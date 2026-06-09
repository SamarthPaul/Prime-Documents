# bug-evidence/

Visual evidence (screenshots) for bugs in the Internal QA tracker
(`Prime_Rural_Bug_Tracker_updated.xlsx`).

## Naming
One image per finding, named by its tracker reference so it's traceable:
- `EP-041-district-block-vanish.png`
- `landscape-blocks-card.png`

(Row number or a short slug of the bug's short-description is fine.)

## How a screenshot reaches the tracker
1. Captured live during a Playwright/MCP E2E run (or attached manually) and saved
   here as `bug-evidence/<name>.png`.
2. Run `C:\Dev\Prime-Documents\publish.ps1` → the file is committed + pushed.
3. Public URL becomes:
   `https://samarthpaul.github.io/Prime-Documents/bug-evidence/<name>.png`
4. Paste that URL into the tracker's **Video/Img Link** column (N) for that bug.

## Videos / multi-step flows
MCP captures stills, not video. For a flow, attach a sequence of screenshots, or
record a **Loom / Jam** and paste its public link in column N.

## Note
The repo-wide `*.png` ignore is **overridden** for this folder (see `.gitignore`),
so anything dropped here IS published to the public Pages site. Keep it to
genuine bug evidence — no internal/sensitive captures.
