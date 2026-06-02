# -*- coding: utf-8 -*-
"""
Seed one record per framework (+ a throwaway Active EP) via the admin API, with
all mandatory parent/child fields satisfied, and write _fixtures.json — the
manifest the browser observe pass (observe.spec.ts) opens and reads as a role.

Run:  ADMIN_API_KEY=... ADMIN_API_SECRET=... python _seed_fixtures.py
Pair with _cleanup_fixtures.py to delete everything afterwards. PII-free.
"""
import os, json, urllib.parse, urllib.request

BASE = os.environ.get('BASE_URL', 'https://stgprime-rural.dhwaniris.in')
AUTH = f"token {os.environ['ADMIN_API_KEY']}:{os.environ['ADMIN_API_SECRET']}"

def call(method, path, data=None):
    body = urllib.parse.urlencode(data).encode() if data else None
    req = urllib.request.Request(BASE + path, data=body, method=method)
    req.add_header('Authorization', AUTH)
    if body: req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    try:
        with urllib.request.urlopen(req) as r: return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:200]

_mc = {}
def meta(dt):
    if dt not in _mc:
        st, d = call('GET', '/api/resource/DocType/' + urllib.parse.quote(dt))
        _mc[dt] = d['data']['fields'] if st == 200 else None
    return _mc[dt]

def first(dt):
    st, r = call('GET', f'/api/resource/{urllib.parse.quote(dt)}?limit_page_length=1')
    return r['data'][0]['name'] if st == 200 and isinstance(r, dict) and r.get('data') else None

def sample(fn):
    n = fn.lower()
    if any(k in n for k in ('qty', 'quantity', 'units', 'no_of', 'number', 'batch_size')): return 10
    if 'interest' in n or n.endswith('_pa') or 'percent' in n or n.endswith('_pct'): return 12
    if any(k in n for k in ('term', 'months', 'life', 'tenure', 'days', 'hours')): return 12
    if any(k in n for k in ('rate', 'price', 'cost', 'amount', 'wage', 'sanction', 'loan', 'value',
                            'revenue', 'budget', 'capacity', 'weight', 'salary', 'size')): return 800
    return 5

def fill_required(fields, include_numeric=False):
    """Build a payload dict satisfying mandatory fields (and numerics if asked)."""
    row = {}
    for f in fields:
        fn = f['fieldname']; ft = f['fieldtype']
        if f.get('read_only') or ft in ('Table', 'Section Break', 'Column Break', 'Tab Break', 'HTML'):
            continue
        if ft in ('Currency', 'Float', 'Int', 'Percent') and (include_numeric or f.get('reqd')):
            row[fn] = sample(fn)
        elif not f.get('reqd'):
            continue
        elif ft == 'Link':
            v = first(f.get('options'))
            if v: row[fn] = v
            else: return None, f"missing master {f.get('options')} for {fn}"
        elif ft == 'Select':
            opt = [o for o in (f.get('options') or '').split('\n') if o.strip()]
            if opt: row[fn] = opt[0]
        elif ft in ('Data', 'Small Text', 'Text', 'Long Text'):
            row[fn] = '[UAT] probe'
        elif ft == 'Date':
            row[fn] = '2026-06-01'
        elif ft == 'Check':
            row[fn] = 0
    return row, None

def ep_field(fields):
    return next((f['fieldname'] for f in fields if f['fieldtype'] == 'Link'
                 and f.get('options') == 'Enterprenur Profile'), None)

def main_table(tables):
    for t in tables:
        if 'existing' in t['fieldname'].lower(): return t
    for t in tables:
        if not any(k in t['fieldname'].lower() for k in ('log', 'resource', 'required', 'flagged')):
            return t
    return tables[0] if tables else None

FRAMEWORKS = ['DF Raw Material', 'DF Machinery', 'DF Human Resource', 'DF Financials',
              'DF Packaging', 'DF Logistic Service', 'DF Logistic Packing', 'DF Schemes Funding',
              'DF Unit Pricing', 'DF Quality Control', 'DF Digital Literacy', 'DF Market Linkage',
              'DF Promotional Marketing', 'DF Customer Analysis', 'DF Market Research',
              'DF Product Testing', 'DF Product Prototyping', 'DF Standardization',
              'DF Business Registration', 'DF Product Compliance', 'DF Branding Identity',
              'DF Capacity Building', 'DF Marketing Brochure', 'DF Marketing Label']

# reuse-or-create EP
flt = urllib.parse.quote(json.dumps([['enterprenur_name', '=', '[UAT] Observe EP']]))
st, r = call('GET', f'/api/resource/Enterprenur%20Profile?filters={flt}&fields=%5B%22name%22%5D&limit_page_length=1')
EP = r['data'][0]['name'] if st == 200 and r.get('data') else None
if not EP:
    st, r = call('POST', '/api/method/frappe.client.insert', {'doc': json.dumps(
        {'doctype': 'Enterprenur Profile', 'enterprenur_name': '[UAT] Observe EP',
         'activity_status': 'Active', 'phone_number': '+919876543210'})})
    EP = r['message']['name']
print('EP:', EP)

manifest = {'ep': EP, 'records': []}
for dt in FRAMEWORKS:
    fs = meta(dt)
    if not fs:
        manifest['records'].append({'framework': dt, 'status': 'NOT FOUND'}); print('  NOT FOUND', dt); continue
    epf = ep_field(fs) or 'enterprenur_name'
    parent, perr = fill_required(fs)
    if parent is None:
        manifest['records'].append({'framework': dt, 'status': 'BLOCKED', 'why': perr}); print('  BLOCKED', dt, perr); continue
    parent.update({'doctype': dt, epf: EP})
    tables = [f for f in fs if f['fieldtype'] == 'Table']
    tbl = main_table(tables)
    if tbl:
        crow, cerr = fill_required(meta(tbl['options']) or [], include_numeric=True)
        if crow is None:
            manifest['records'].append({'framework': dt, 'status': 'BLOCKED', 'why': cerr}); print('  BLOCKED', dt, cerr); continue
        parent[tbl['fieldname']] = [crow]
    st, r = call('POST', '/api/method/frappe.client.insert', {'doc': json.dumps(parent)})
    if st != 200:
        msg = r if isinstance(r, str) else json.dumps(r)[:120]
        manifest['records'].append({'framework': dt, 'status': 'INSERT FAIL', 'why': msg[:120]}); print('  FAIL', dt, msg[:80]); continue
    nm = r['message']['name']
    manifest['records'].append({'framework': dt, 'doctype': dt, 'record': nm, 'status': 'SEEDED'})
    print('  seeded', dt, '->', nm)

open('_fixtures.json', 'w', encoding='utf-8').write(json.dumps(manifest, indent=1))
ok = sum(1 for x in manifest['records'] if x['status'] == 'SEEDED')
print(f"\nwrote _fixtures.json — {ok}/{len(FRAMEWORKS)} seeded")
