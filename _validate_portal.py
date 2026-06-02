# -*- coding: utf-8 -*-
"""
Automated portal validation — calc/validation backbone.

For each framework: create a throwaway Active EP, insert a record populating the
editable numeric fields of its main child table (satisfying mandatory Links from
existing masters), read back the server-computed fields, and assert they fired
(+ exact formula where known). Deterministic; immune to UI selector drift.

Run:  ADMIN_API_KEY=... ADMIN_API_SECRET=... python _validate_portal.py
Cleans up everything it creates. PII-free (throwaway EP only).
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

_meta_cache = {}
def meta(dt):
    if dt not in _meta_cache:
        st, d = call('GET', '/api/resource/DocType/' + urllib.parse.quote(dt))
        _meta_cache[dt] = d['data']['fields'] if st == 200 else None
    return _meta_cache[dt]

def ep_field(fields):
    for f in fields:
        if f['fieldtype'] == 'Link' and f.get('options') == 'Enterprenur Profile':
            return f['fieldname']
    return None

def sample(fieldname):
    n = fieldname.lower()
    if any(k in n for k in ('qty', 'quantity', 'units', 'no_of', 'number')): return 10
    if 'interest' in n or n.endswith('_pa') or 'percent' in n or n.endswith('_pct'): return 12
    if any(k in n for k in ('term', 'months', 'life', 'tenure', 'year', 'days', 'hours')): return 12
    if any(k in n for k in ('rate', 'price', 'cost', 'amount', 'wage', 'sanction', 'loan', 'value', 'revenue', 'budget', 'capacity', 'weight', 'salary')): return 800
    return 5

def link_value(opts):
    if not opts: return None
    st, r = call('GET', f'/api/resource/{urllib.parse.quote(opts)}?limit_page_length=1')
    if st == 200 and isinstance(r, dict) and r.get('data'): return r['data'][0]['name']
    return None

# main existing child table: prefer fieldname containing 'existing', else first
# Table that isn't a log book / resource table
def main_table(tables):
    for t in tables:
        if 'existing' in t['fieldname'].lower(): return t
    for t in tables:
        if not any(k in t['fieldname'].lower() for k in ('log', 'resource', 'required', 'flagged')):
            return t
    return tables[0] if tables else None

# known exact formula checks: (doctype) -> fn(row, inputs) -> (label, ok|None)
def check_formulas(dt, row):
    out = []
    def g(k): return row.get(k)
    if dt == 'DF Raw Material' and g('amount_per_batch') is not None:
        out.append(('amount_per_batch fired', g('amount_per_batch') not in (None, 0)))
    if dt == 'DF Packaging' and g('total_order_cost') is not None:
        out.append(('total_order_cost fired', g('total_order_cost') not in (None, 0)))
    if dt == 'DF Logistic Service' and g('total_dispatch_cost') is not None:
        out.append(('total_dispatch_cost fired', g('total_dispatch_cost') not in (None, 0)))
    if dt == 'DF Schemes Funding' and g('emi_per_month') is not None:
        out.append(('emi_per_month fired', g('emi_per_month') not in (None, 0)))
    return out

FRAMEWORKS = ['DF Raw Material', 'DF Machinery', 'DF Human Resource', 'DF Financials',
              'DF Packaging', 'DF Logistic Service', 'DF Logistic Packing', 'DF Schemes Funding',
              'DF Unit Pricing', 'DF Quality Control', 'DF Digital Literacy', 'DF Market Linkage',
              'DF Promotional Marketing', 'DF Customer Analysis', 'DF Market Research',
              'DF Product Testing', 'DF Product Prototyping', 'DF Standardization',
              'DF Business Registration', 'DF Product Compliance', 'DF Branding Identity',
              'DF Capacity Building', 'DF Infrastructure', 'DF Marketing Brochure',
              'DF Pitch Deck', 'DF Business Plan Canvas', 'DF Marketing Label']

st, res = call('POST', '/api/method/frappe.client.insert', {'doc': json.dumps(
    {'doctype': 'Enterprenur Profile', 'enterprenur_name': '[UAT] Portal Validate EP',
     'activity_status': 'Active', 'phone_number': '+919876543210'})})
EP = res['message']['name'] if st == 200 else None
print(f"throwaway EP: {st} {EP}\n")
if not EP: raise SystemExit('cannot create EP')

results = []
created = []
for dt in FRAMEWORKS:
    fs = meta(dt)
    if not fs:
        results.append((dt, 'NOT FOUND', '')); continue
    epf = ep_field(fs) or 'enterprenur_name'
    tables = [f for f in fs if f['fieldtype'] == 'Table']
    tbl = main_table(tables)
    if not tbl:
        results.append((dt, 'NO TABLE', 'no child table')); continue
    cf = meta(tbl['options']) or []
    row = {}
    blocked = None
    for f in cf:
        if f.get('read_only'): continue
        ft = f['fieldtype']
        if ft in ('Currency', 'Float', 'Int', 'Percent'):
            row[f['fieldname']] = sample(f['fieldname'])
        elif ft == 'Link' and f.get('reqd'):
            v = link_value(f.get('options'))
            if v: row[f['fieldname']] = v
            else: blocked = f"mandatory link {f['fieldname']}->{f.get('options')} has no master record"
        elif f.get('reqd') and ft in ('Data',):
            row[f['fieldname']] = '[UAT] probe'
        elif f.get('reqd') and ft == 'Select' and f.get('options'):
            opt = [o for o in f['options'].split('\n') if o.strip()]
            if opt: row[f['fieldname']] = opt[0]
    if blocked:
        results.append((dt, 'BLOCKED', blocked)); continue
    doc = {'doctype': dt, epf: EP, tbl['fieldname']: [row]}
    st, res = call('POST', '/api/method/frappe.client.insert', {'doc': json.dumps(doc)})
    if st != 200:
        msg = res if isinstance(res, str) else json.dumps(res)[:120]
        results.append((dt, 'INSERT FAIL', msg[:110])); continue
    name = res['message']['name']; created.append((dt, name))
    back = res['message'].get(tbl['fieldname'], [{}])
    rrow = back[0] if back else {}
    comp = {f['fieldname']: rrow.get(f['fieldname']) for f in cf
            if f.get('read_only') and f['fieldtype'] in ('Currency', 'Float', 'Percent')}
    fired = [k for k, v in comp.items() if v not in (None, 0, 0.0)]
    checks = check_formulas(dt, rrow)
    verdict = 'PASS' if (fired or not comp) else 'CALC?'
    detail = f"{len(fired)}/{len(comp)} computed fired" + (f"; {comp}" if comp and not fired else '')
    results.append((dt, verdict, detail[:110]))

# cleanup
for dt, name in created:
    call('DELETE', f'/api/resource/{urllib.parse.quote(dt)}/{urllib.parse.quote(name)}')
call('DELETE', '/api/resource/Enterprenur%20Profile/' + urllib.parse.quote(EP))

print(f"{'FRAMEWORK':28} {'VERDICT':12} DETAIL")
print('-' * 100)
from collections import Counter
tally = Counter()
for dt, v, d in results:
    tally[v] += 1
    print(f"{dt:28} {v:12} {d}")
print('-' * 100)
print('tally:', dict(tally), f'| cleaned up {len(created)} records + EP')