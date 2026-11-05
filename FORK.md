# Fork notes

This is [dhruvkelawala/visual-explainer](https://github.com/dhruvkelawala/visual-explainer), a fork of [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer) with three changes:

- The **Field Guide** look is a kit register and the renderer's default, in light and dark with a switch. It replaces Blueprint.
- In T3 Code, pages show as **T3 visual pages** through `html_preview` and `html_render`, and pick light or dark from T3's background.
- A **teaching page** shape, taken over from research-explainer, builds a topic from scratch in 3 to 7 blocks.

It last merged upstream at v0.15.0.

| Where | What changed |
|---|---|
| `kit/field-guide.css`, `kit/theme.js` | New: the register's tokens, its restyle of the kit's parts, its own parts (`.fg-*`), and the T3 block; the head script that sets light or dark and adds the switch. |
| `kit/render.mjs` | A `field-guide` entry in `FONTS`, Field Guide as the default register, both new files inlined on a Field Guide page, and `--t3` (or `t3: true`), which leaves out the reader-reply UI that T3's frame rejects. |
| `templates/field-guide.src.html` | New: the reference source, which uses every Field Guide part. The test renders it. |
| `references/field-guide.md`, `references/t3.md`, `references/teaching.md` | New: the register and its parts, the T3 steps, the teaching page shape. |
| `SKILL.md`, `references/style-guide.md`, `references/kit.md`, `references/slides.md` | Field Guide as the house register in place of Blueprint. `SKILL.md` also has the T3 step under `## Deliver`, the teaching page row, and teaching pages in its `description`. |
| `commands/fact-check.md`, `commands/generate-web-diagram.md` | Show pages by the Deliver rules instead of a browser. |
| `plan/plan.css`, `plan/render.mjs` | Plan pages use Field Guide tokens and fonts and get the light/dark switch. Overrides sit in one block at the end of `plan.css`. |
| `test/`, `package.json` (repo root) | `npm test` renders the reference source and loads it in headless Chromium as T3 would host it. |

`kit/kit.css` is upstream's file, unchanged. The kit still accepts `data-register="blueprint"`; the fork's docs never use it.

Everything else tracks upstream.

## Sync with upstream

```bash
git fetch upstream
git merge upstream/main     # conflicts, if any, are in the files above
npm install                 # playwright-core, for the render check and npm test
npm run check:versions && npm run check:kit && npm run check:machine && npm run check:ask
npm test
git push origin main
```

After a sync, render `templates/field-guide.src.html` with `node plugins/visual-explainer/kit/render.mjs` and look at its sheet. If upstream renames a kit class or token, `kit/field-guide.css` stops restyling that part, and only the picture shows it.

## Install

All agents read one checkout through symlinks:

```bash
for d in ~/.agents/skills ~/.claude/skills ~/.codex/skills; do
  ln -sfn ~/development/visual-explainer/plugins/visual-explainer "$d/visual-explainer"
done
```

Pi reads `~/.agents/skills`. The render check needs `playwright-core`: run `npm install` once in the checkout.
