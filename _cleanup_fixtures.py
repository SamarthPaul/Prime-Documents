# -*- coding: utf-8 -*-
"""Delete everything created by _seed_fixtures.py (reads _fixtures.json)."""
import os, json, urllib.parse, urllib.request
BASE = os.environ.get('BASE_URL', 'https://stgprime-rural.dhwaniris.in')
AUTH = f"token {os.environ['ADMIN_API_KEY']}:{os.environ['ADMIN_API_SECRET']}"
def dele(dt, n):
    r = urllib.request.Request(f"{BASE}/api/resource/{urllib.parse.quote(dt)}/{urllib.parse.quote(n)}", method='DELETE')
    r.add_header('Authorization', AUTH)
    try:
        with urllib.request.urlopen(r) as x: return x.status
    except urllib.error.HTTPError as e: return e.code
man = json.load(open('_fixtures.json', encoding='utf-8'))
n = 0
for rec in man['records']:
    if rec.get('status') == 'SEEDED':
        dele(rec['doctype'], rec['record']); n += 1
print('deleted', n, 'records;  EP:', dele('Enterprenur Profile', man['ep']))
