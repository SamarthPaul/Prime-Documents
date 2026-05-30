import re
HTML='test-cases.html'
src=open(HTML,encoding='utf-8').read()

TYPE_TAG={'func':'tp func">Functional','ui':'tp ui">UI / UX','val':'tp val">Validation'}
POL_TAG={'pos':'pol-pos">Positive','neg':'pol-neg">Negative'}
PRI_TAG={'p0':'pri-p0">P0','p1':'pri-p1">P1','p2':'pri-p2">P2'}

# (id, type, pol, pri, role, title, steps[list], expected, brd)
CASES=[
 ('PR-TC-DB-EPS-005','func','neg','p0','SM/CTI/CTP','Sector → Business Basket dropdown cascades (basket filtered by sector)',
  ['Select Sector = Food Processing on the Landscape.','Open the Business Basket dropdown.'],
  'Basket list shows ONLY baskets whose master sector = Food Processing. (Verified UAT: cascade BROKEN — all baskets shown incl. other sectors.)','BRD: dependent filters cascade (Basket.sector → Sector).'),
 ('PR-TC-DB-EPS-006','func','neg','p0','SM/CTI/CTP','District → Block cascade filter present on the dashboard',
  ['Open the Landscape / EP Status Monitor filter row.','Look for District + Block filters.'],
  'A District filter and a Block filter (cascading: Block.district = selected District) are present. (Verified UAT: NO District/Block filter on Landscape; Status Monitor link dead.)','BRD: District→Block cascade.'),
 ('PR-TC-DB-EPS-007','func','pos','p1','SM/CTI/CTP','Each filter recomputes all KPI counts',
  ['Note Total Entrepreneurs.','Apply Sector = Food Processing.'],
  'KPI counts recompute to the filtered subset (Total 40 → 13 verified). Label switches to Filtered.','BRD: filters recompute KPIs.'),
 ('PR-TC-DB-VIS-001','func','neg','p1','SM/CTI/CTP','Village Visits map mode re-scopes KPIs to village-visit GPS pins',
  ['On the Landscape, toggle the map mode to Village Visits.','Inspect the KPI cards (esp. GPS Verified).'],
  'KPIs reflect village-visit data — GPS Verified shows the village-visit GPS-pin count, not the entrepreneur count. (Verified UAT: KPIs stay entrepreneur-scoped — finding.)','BRD/req: GPS Verified per active map mode.'),
 ('PR-TC-DB-NAV-001','func','neg','p1','SM/CTI/CTP','Status Monitor sidebar link routes to the EP status view',
  ['Click the "Status Monitor" item in the sidebar.'],
  'Navigates to the EP Status Monitor view. (Verified UAT: link has href=null, does not navigate — dead link.)','BRD: Status Monitor nav.'),
 ('PR-TC-DB-MAP-001','func','pos','p1','SM/CTI/CTP','Geo coordinates captured; count cross-checks GPS-Verified KPI',
  ['Read EP.location (Geolocation) values via API.','Compare count-with-coords to the GPS-Verified KPI.'],
  'EPs with a captured location > 0; GPS-Verified KPI ≤ count-with-coords. (Obs: KPI=6 vs 12 with location — confirm GPS-only vs incl. centroid.)','BRD: geo-tag capture.'),
 ('PR-TC-DB-MAP-002','ui','pos','p1','SM/CTI/CTP','Landscape map renders (Leaflet canvas + tiles)',
  ['Open the Landscape.','Inspect the map container.'],
  'Leaflet map renders with base tiles + canvas renderer (pins drawn on canvas). (Verified pass.)','BRD: map renders.'),
 ('PR-TC-DB-MAP-003','ui','pos','p1','SM/CTI/CTP','Meghalaya boundary overlay rendered',
  ['Open the Landscape map.'],
  'State boundary overlay (svg/canvas) renders around Meghalaya. (Verified pass.)','BRD: map boundaries.'),
 ('PR-TC-DB-MAP-004','ui','pos','p1','SM/CTI/CTP','Block-level drill-down works on the map',
  ['Click / zoom a district on the map.'],
  'Map drills down to block-level detail. (Canvas — manual/visual verification pending.)','BRD: drill down to block level.'),
 ('PR-TC-DB-MAP-005','val','neg','p0','SM/CTI/CTP','Captured coordinates fall within Meghalaya bounds',
  ['Read EP.location GeoJSON coords.','Check each lat/lng against Meghalaya bounds (lat 25.0–26.2, lng 89.8–92.9).'],
  'All coords within Meghalaya. (Verified UAT: only 1 of parseable coords in-state; default Mountain View CA + Delhi + malformed GeoJSON — finding.)','BRD: coordinate validation / map boundaries.'),
 ('PR-TC-DB-MAP-006','ui','pos','p2','SM/CTI/CTP','Village Visits map mode plots village pins',
  ['Toggle map to Village Visits.'],
  'Village-visit pins render on the map. (Canvas — manual/visual verification pending.)','BRD: village visit pins.'),
]

def tc(c):
    cid,ty,pol,pri,role,title,steps,exp,brd=c
    roledisp=role.replace('/',' / ')
    steps_html=''.join(f'<li>{s}</li>' for s in steps)
    return f'''
    <div class="tc {pol}" data-type="{ty}" data-pol="{pol}" data-pri="{pri}" data-role="{role}">
      <div class="tc-head">
        <span class="tc-id">{cid}</span>
        <span class="tag {POL_TAG[pol]}</span><span class="tag {PRI_TAG[pri]}</span>
        <span class="tag {TYPE_TAG[ty]}</span><span class="tag role">{roledisp}</span>
      </div>
      <div class="tc-title">{title}</div>
      <div class="tc-body">
        <span class="label">Steps</span>
        <ol>{steps_html}</ol>
        <div class="exp">
          <span class="label">Expected</span>
          {exp}
        </div>
        <p class="brd">{brd}</p>
      </div>
    </div>
'''

block='\n    <h3 style="font-size:20px;font-weight:500;color:var(--teal);border-left:4px solid var(--terracotta);padding-left:12px;margin-top:18px;">19.6 Filter Cascade, KPI Correctness &amp; Maps (added from UAT)</h3>\n'+''.join(tc(c) for c in CASES)

# insert before the dashboards section's closing </section> (the one right before the 20. NOTIFICATIONS comment)
anchor='    </div>\n\n  </section>\n\n  <!-- ============================================================ -->\n  <!-- ============================================================ -->\n  <!-- 20. NOTIFICATIONS'
assert src.count(anchor)==1, f'anchor count={src.count(anchor)}'
src=src.replace(anchor, '    </div>\n'+block+'\n  </section>\n\n  <!-- ============================================================ -->\n  <!-- ============================================================ -->\n  <!-- 20. NOTIFICATIONS')
open(HTML,'w',encoding='utf-8',newline='\n').write(src)
# verify div balance
print('div open/close:', src.count('<div'), src.count('</div>'))
print('section open/close:', src.count('<section'), src.count('</section>'))
print('new tc-ids present:', all(c[0] in src for c in CASES))
