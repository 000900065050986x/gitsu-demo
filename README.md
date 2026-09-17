# GitSU

Phone-ready workspace demo for **KiT the Branchfox**.

Live files in this repo:

- `GitSU.html` — full self-contained demo
- `index.html` — same build (GitHub Pages / local open)

## What this increment adds

The previous `index.html` on GitHub was a size-stripped stub. This pass restores the intended surface:

- stacked / wrapping tab bar (Files, Code, Kit AI, Git, Terminal, Share)
- KiT boot art
- icon picker + night / dawn / forest themes
- edge chip + swipe-from-left app menu
- 3×3 coding tools FAB
- in-memory `aurora-sync` files with save / format / export
- local Git commit simulation and device terminal (`help`, `ls`, `status`, `whoami`, `clear`, `theme`, `kit`)
- KiT chat thread with local replies
- `localStorage` persistence (`gitsu.v2`)

## Run

Open `GitSU.html` or `index.html` in a browser. No build step.

## Status

Workspace is still a front-end prototype. GitHub sign-in and MCP are toggles only — no network auth yet.

Owner: Thomas James / OP Thomas · ORCID 0009-0006-5050-986X
