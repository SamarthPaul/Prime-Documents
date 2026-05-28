"""
Parse generated/test-cases.html and emit generated/test-cases.xlsx
Columns: ID | Module | Subsection | Title | Type | Polarity | Priority | Role | Preconditions | Steps | Expected | BRD Ref | Status | Actual | Comments
"""
import re, sys, os
from html import unescape
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

HTML = os.path.join(os.path.dirname(__file__), 'test-cases.html')
XLSX = os.path.join(os.path.dirname(__file__), 'test-cases.xlsx')

with open(HTML, 'r', encoding='utf-8') as f:
    src = f.read()

def strip_tags(s):
    s = re.sub(r'<br\s*/?>', '\n', s)
    s = re.sub(r'</li>\s*<li>', '\n• ', s)
    s = re.sub(r'<li>', '• ', s)
    s = re.sub(r'</li>', '', s)
    s = re.sub(r'</?(ol|ul|p|div|span|b|i|em|strong|code)[^>]*>', '', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = unescape(s)
    s = re.sub(r'\n\s*\n', '\n', s)
    s = re.sub(r'[ \t]+', ' ', s)
    return s.strip()

# Find each section (module): h2 contains module name; subsections via h3
# Walk the HTML linearly so we can track current module + subsection per tc
# Approach: split by div.tc boundary, and track context by scanning what came before.

# Capture top-level modules
sections = list(re.finditer(r'<section class="module" id="([^"]+)">\s*<h2>([^<]+)<span class="pid">[^<]+</span></h2>\s*<p class="desc">([^<]*)</p>', src))
# Build a list of (section_start, section_end, section_title, section_id)
section_boundaries = []
for i, m in enumerate(sections):
    start = m.start()
    end = sections[i+1].start() if i+1 < len(sections) else len(src)
    title = strip_tags(m.group(2))
    sec_id = m.group(1)
    section_boundaries.append((start, end, title, sec_id))

# Now find each tc and place it in a section
tc_pattern = re.compile(
    r'<div class="tc[^"]*"\s+data-type="([^"]+)"\s+data-pol="([^"]+)"\s+data-pri="([^"]+)"\s+data-role="([^"]+)">'
    r'\s*<div class="tc-head">.*?<span class="tc-id">([^<]+)</span>.*?</div>'
    r'\s*<div class="tc-title">([^<]+)</div>'
    r'\s*<div class="tc-body">(.*?)</div>'
    r'\s*</div>',
    re.DOTALL
)

# Helper: find current subsection (h3 within <div class="subsec">) by walking backward from tc start
subsec_h3_pattern = re.compile(r'<div class="subsec">\s*<h3>([^<]+)</h3>', re.DOTALL)
# also catch the per-framework h3s like <h3 style="...">...</h3>
generic_h3_pattern = re.compile(r'<h3[^>]*>(.*?)</h3>', re.DOTALL)

def find_subsection(pos):
    """Find the latest h3 before pos."""
    best = ''
    for m in generic_h3_pattern.finditer(src, 0, pos):
        best = strip_tags(m.group(1))
    return best

def find_module(pos):
    for start, end, title, _id in section_boundaries:
        if start <= pos < end:
            return title
    return ''

def parse_body(body):
    # body has: <span class="label">Preconditions</span><ul>...</ul>
    #          <span class="label">Steps</span><ol>...</ol>
    #          <div class="exp"><span class="label">Expected</span>....</div>
    #          <p class="brd">BRD: ...</p>
    pre, steps, exp, brd = '', '', '', ''
    pre_m = re.search(r'<span class="label">Preconditions</span>\s*<ul>(.*?)</ul>', body, re.DOTALL)
    if pre_m: pre = strip_tags(pre_m.group(1))
    steps_m = re.search(r'<span class="label">Steps</span>\s*<ol>(.*?)</ol>', body, re.DOTALL)
    if steps_m: steps = strip_tags(steps_m.group(1))
    exp_m = re.search(r'<div class="exp">.*?<span class="label">Expected</span>\s*(.*?)</div>', body, re.DOTALL)
    if exp_m: exp = strip_tags(exp_m.group(1))
    brd_m = re.search(r'<p class="brd">(.*?)</p>', body, re.DOTALL)
    if brd_m: brd = strip_tags(brd_m.group(1))
    return pre, steps, exp, brd

type_label = {
    'func': 'Functional', 'ui': 'UI / UX', 'val': 'Validation', 'api': 'API',
    'db': 'Database', 'nf': 'Non-Functional', 'sec': 'Security'
}
pol_label = {'pos': 'Positive', 'neg': 'Negative', 'bdy': 'Boundary'}
pri_label = {'p0': 'P0 — Blocker', 'p1': 'P1 — High', 'p2': 'P2 — Medium'}

rows = []
for m in tc_pattern.finditer(src):
    tcid = m.group(5).strip()
    title = m.group(6).strip()
    body = m.group(7)
    pre, steps, exp, brd = parse_body(body)
    rows.append({
        'ID': tcid,
        'Module': find_module(m.start()),
        'Subsection': find_subsection(m.start()),
        'Title': title,
        'Type': type_label.get(m.group(1), m.group(1)),
        'Polarity': pol_label.get(m.group(2), m.group(2)),
        'Priority': pri_label.get(m.group(3), m.group(3)),
        'Role': m.group(4).strip(),
        'Preconditions': pre,
        'Steps': steps,
        'Expected Result': exp,
        'BRD Ref': brd,
        'Status': '',
        'Actual Result': '',
        'Comments': '',
    })

print(f'Parsed {len(rows)} test cases')

# Build workbook
wb = Workbook()
ws = wb.active
ws.title = 'Test Cases'

headers = ['ID','Module','Subsection','Title','Type','Polarity','Priority','Role',
           'Preconditions','Steps','Expected Result','BRD Ref',
           'Status','Actual Result','Comments']
ws.append(headers)

# Header styling — Monsoon Court teal
header_fill = PatternFill('solid', fgColor='0E4D4E')
header_font = Font(name='Georgia', bold=True, color='FBF5E5', size=11)
body_font = Font(name='Georgia', size=10)
thin = Side(border_style='thin', color='E8DFC9')
border = Border(left=thin, right=thin, top=thin, bottom=thin)
align_top_wrap = Alignment(vertical='top', wrap_text=True)
align_top_center = Alignment(vertical='top', horizontal='center')

for col in range(1, len(headers)+1):
    c = ws.cell(row=1, column=col)
    c.fill = header_fill
    c.font = header_font
    c.alignment = Alignment(vertical='center', horizontal='left')
    c.border = border

# Row colour by polarity
pol_fills = {
    'Positive': PatternFill('solid', fgColor='D9E8E5'),     # success-sft (teal)
    'Negative': PatternFill('solid', fgColor='F5E2D6'),     # terracotta-sft
    'Boundary': PatternFill('solid', fgColor='DCE8E8'),     # info-sft
}

for r in rows:
    ws.append([r[h] for h in headers])
    rnum = ws.max_row
    fill = pol_fills.get(r['Polarity'], None)
    for col in range(1, len(headers)+1):
        c = ws.cell(row=rnum, column=col)
        c.font = body_font
        c.border = border
        c.alignment = align_top_wrap if col >= 9 else (align_top_center if col in (5,6,7) else align_top_wrap)
        if fill and col == 6:   # only colour the Polarity column to avoid heavy stripes
            c.fill = fill

# Column widths
widths = {
    'A': 24,  # ID
    'B': 28,  # Module
    'C': 30,  # Subsection
    'D': 60,  # Title
    'E': 14,  # Type
    'F': 12,  # Polarity
    'G': 14,  # Priority
    'H': 16,  # Role
    'I': 40,  # Preconditions
    'J': 60,  # Steps
    'K': 60,  # Expected
    'L': 22,  # BRD Ref
    'M': 12,  # Status
    'N': 40,  # Actual
    'O': 30,  # Comments
}
for col, w in widths.items():
    ws.column_dimensions[col].width = w

ws.row_dimensions[1].height = 28
ws.freeze_panes = 'D2'   # freeze first row + first 3 cols (ID/Module/Subsection)
ws.auto_filter.ref = ws.dimensions

# Summary sheet
summary = wb.create_sheet('Summary')
summary.append(['Coverage Summary'])
summary['A1'].font = Font(name='Georgia', bold=True, size=16, color='0E4D4E')

# Counts by module
mod_counts = {}
type_counts = {}
pol_counts = {}
pri_counts = {}
role_counts = {}
for r in rows:
    mod_counts[r['Module']] = mod_counts.get(r['Module'], 0) + 1
    type_counts[r['Type']] = type_counts.get(r['Type'], 0) + 1
    pol_counts[r['Polarity']] = pol_counts.get(r['Polarity'], 0) + 1
    pri_counts[r['Priority']] = pri_counts.get(r['Priority'], 0) + 1
    role_counts[r['Role']] = role_counts.get(r['Role'], 0) + 1

def write_block(start_row, title, d):
    summary.cell(row=start_row, column=1, value=title).font = Font(name='Georgia', bold=True, size=12, color='0E4D4E')
    rrow = start_row + 1
    summary.cell(row=rrow, column=1, value='Bucket').font = Font(name='Georgia', bold=True)
    summary.cell(row=rrow, column=2, value='Count').font = Font(name='Georgia', bold=True)
    rrow += 1
    for k, v in sorted(d.items(), key=lambda kv: -kv[1]):
        summary.cell(row=rrow, column=1, value=k or '(blank)').font = Font(name='Georgia')
        summary.cell(row=rrow, column=2, value=v).font = Font(name='Georgia')
        rrow += 1
    return rrow + 1

row = 3
row = write_block(row, 'By Module', mod_counts)
row = write_block(row, 'By Type', type_counts)
row = write_block(row, 'By Polarity', pol_counts)
row = write_block(row, 'By Priority', pri_counts)
row = write_block(row, 'By Role', role_counts)

summary.column_dimensions['A'].width = 50
summary.column_dimensions['B'].width = 12
summary.cell(row=2, column=1, value=f'Total test cases: {len(rows)}').font = Font(name='Georgia', bold=True, size=14)

# Move Summary to first sheet
wb.move_sheet('Summary', offset=-1)

wb.save(XLSX)
print(f'Wrote {XLSX}')
