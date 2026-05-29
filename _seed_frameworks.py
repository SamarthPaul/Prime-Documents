"""
Seed one record for each framework that has no record on staging, so the
27-framework leak sweep (tests/17-frameworks.spec.ts) can open and check them.

Creates a dedicated [UAT] entrepreneur and links one record of each given
framework doctype to it. Idempotent: re-running reuses the existing [UAT] EP and
skips frameworks that already have a record linked to it.

Auth: reads ADMIN_API_KEY / ADMIN_API_SECRET from the environment (never hardcode
the token in this file — pass it inline at run time).

    ADMIN_API_KEY=... ADMIN_API_SECRET=... python _seed_frameworks.py
"""
import os, json, urllib.parse, urllib.request

BASE = os.environ.get('BASE_URL', 'https://stgprime-rural.dhwaniris.in')
KEY = os.environ['ADMIN_API_KEY']
SECRET = os.environ['ADMIN_API_SECRET']
AUTH = f'token {KEY}:{SECRET}'
EP_NAME = '[UAT] Framework Seed EP'

# The 11 frameworks that had no record during the Batch 2 sweep.
FRAMEWORKS = [
    'DF Business Registration', 'DF Product Compliance', 'DF Product Prototyping',
    'DF Product Testing', 'DF Packaging', 'DF Market Research', 'DF Branding Identity',
    'DF Marketing Label', 'DF Marketing Brochure', 'DF Pitch Deck', 'DF Schemes Funding',
]

def api(method, path, data=None):
    url = BASE + path
    body = urllib.parse.urlencode(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method)
    req.add_header('Authorization', AUTH)
    if body:
        req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:200]

def insert(doctype, fields):
    return api('POST', '/api/method/frappe.client.insert',
               {'doc': json.dumps({'doctype': doctype, **fields})})

def exists_linked(doctype, ep):
    flt = urllib.parse.quote(json.dumps([['enterprenur_name', '=', ep]]))
    st, res = api('GET', f'/api/resource/{urllib.parse.quote(doctype)}?filters={flt}&limit_page_length=1')
    return st == 200 and isinstance(res, dict) and res.get('data')

# 1. Ensure the [UAT] seed EP exists. The framework Link field references the EP
#    by its primary-key `name` (a series like EP-00002), NOT the display name.
flt = urllib.parse.quote(json.dumps([['enterprenur_name', '=', EP_NAME]]))
st, res = api('GET', f'/api/resource/Enterprenur%20Profile?filters={flt}&fields=%5B%22name%22%5D&limit_page_length=1')
if st == 200 and res.get('data'):
    ep = res['data'][0]['name']
    print(f'EP exists: {ep} ({EP_NAME})')
else:
    st, res = insert('Enterprenur Profile',
                     {'enterprenur_name': EP_NAME, 'activity_status': 'Active', 'phone_number': '+919876543210'})
    ep = res.get('message', {}).get('name') if isinstance(res, dict) else None
    print(f'EP create: {st} -> {ep}')

# 2. Seed one record per framework, linked by EP primary-key name.
for dt in FRAMEWORKS:
    if exists_linked(dt, ep):
        print(f'  skip (exists)  {dt}')
        continue
    st, res = insert(dt, {'enterprenur_name': ep})
    name = res.get('message', {}).get('name') if isinstance(res, dict) else res
    print(f'  {"seeded " if st==200 else "FAIL "+str(st)}  {dt}  -> {name}')
