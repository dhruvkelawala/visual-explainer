# Walkthrough

Guide the reader through an existing visual explainer in plain English, **one section per turn**, while they follow the rendered page side by side. Keep the page, code, and other threads untouched until the walkthrough finishes and the reader asks to act.

## 1. Locate and read the page

1. Find the target explainer:
   - Use the file path or slug the reader named.
   - With no path, use the explainer just shown in this conversation, or pick the newest rendered `.html` (excluding `.src.html`) in `VISUAL_EXPLAINER_OUTPUT_DIR`, else `~/.agent/diagrams/`.
2. Read the sibling `.src.html` when it exists (it carries the exact headings, prose, figures, and numbers without inlined CSS/JS); otherwise read the `.html`.
3. Inspect every section, figure, KPI strip, table, and interactive control so nothing is skipped or guessed.

**Done when:** every section and figure on the page has been read.

## 2. Build the scroll map

1. Split the page into **5 to 8 sequential stops** that follow the reader's exact top-to-bottom scroll order:
   - Combine small adjacent pieces (such as a short KPI strip and the card grid right below it) when they tell one story.
   - Split dense multi-part sections (such as a plate with several independent decisions) into separate stops so every stop fits in one short turn.
2. On Turn 1, print the numbered map before Stop 1, marking Stop 1 with `*(now)*` so the reader sees the whole journey upfront.

**Done when:** the numbered map covers the entire page in scroll order and Stop 1 is marked.

## 3. Teach one stop per turn

Explain **only the current stop**, then stop and wait for the reader's reply.

- **Anchor to the screen:** open with where to look (`"Scroll to Figure 3…"`, `"Look at the 4 bars right below…"`) so the reader tracks the page side by side.
- **Plain English first:** explain the mechanism with everyday cause-and-effect or a concrete analogy before naming any jargon, formula, or code symbol.
- **Keep it concrete:** quote the actual before/after examples, counts, or trade-offs from that section and say why they matter in practice.
- **Keep it tight:** aim for ~150–250 words per stop, with bold subheadings and short bullets.
- **End on a check-in:** finish with a one-line question naming the next stop (`"Make sense? Any questions before Part N+1 (<short topic>)?"`) and end the turn.

Handle replies cleanly:
- Affirmative (`"yes"`, `"next"`, `"lgtm"`, `"makes sense"`) → advance to the next stop.
- Question or confusion → answer directly on the current stop and wait before advancing.
- Navigation (`"skip"`, `"jump to 5"`, `"go deeper on X"`) → follow the reader's direction.
- Decision or preference (`"definitely do this"`, `"skip that"`) → acknowledge briefly and carry it forward to the wrap-up.

**Done when:** one stop is explained and the turn ends waiting for the reader.

## 4. Wrap up

After the final stop, close with a brief note of any decisions or preferences the reader voiced along the way, and ask what they want to do next (act on it, tweak or drop specific items, or hand it off).

**Done when:** the final stop is explained and the next step is left to the reader.
