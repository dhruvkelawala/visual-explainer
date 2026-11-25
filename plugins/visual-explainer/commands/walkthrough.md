---
name: walkthrough
description: Walk through a visual explainer in plain English, one section at a time
---

Load the visual-explainer skill and walk the user through the explainer at `$@` in plain English, one section per turn.

Follow `./references/walkthrough.md`. With no path, use the explainer just shown in this conversation, or the newest HTML page excluding `.src.html`. Native Pi: call `visual_explainer` `prepare` with `topic: "Walkthrough"` and `preferSubagent: false`, then search its `outputDir`. Elsewhere: use nonblank `VISUAL_EXPLAINER_OUTPUT_DIR` (relative to the working directory), else `~/.agent/diagrams/`. Read the sibling `.src.html` when present so you inspect the page without inlined kit code.
