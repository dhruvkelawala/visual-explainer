# Fork notes

This is [dhruvkelawala/visual-explainer](https://github.com/dhruvkelawala/visual-explainer), a fork of [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer) with three changes:

- The **Field Guide** house style replaces the Blueprint register as the default look, in light and dark with a switch.
- In T3 Code, pages show as **T3 visual pages** through `html_preview` and `html_render`, and pick light or dark from T3's background.
- A **teaching page** shape, taken over from research-explainer, builds a topic from scratch in 3 to 7 blocks.

| Where | What changed |
|---|---|
| `references/field-guide.md`, `templates/field-guide.html` | New: the house style and its reference build. The template's head script and its `T3 VISUAL PAGE` CSS block fit it to T3. |
| `references/t3.md` | New: how a page becomes a T3 visual page. |
| `references/teaching.md` | New: the teaching page shape. |
| `SKILL.md`, `references/style-guide.md`, `references/slides.md` | A House style block under `## Look`; Blueprint removed from the register tables. `SKILL.md` also has the T3 step under `## Deliver`, the teaching page row in the page-shape table, and teaching pages in its `description`. `commands/fact-check.md` and `commands/generate-web-diagram.md` show pages by the Deliver rules instead of a browser. |
| `plan/plan.css`, `plan/render.mjs` | Plan pages use Field Guide tokens and fonts and get the light/dark switch. Overrides sit in one block at the end of `plan.css`. |
| `quick/base.css`, `quick/render.mjs` | Quick mode uses Field Guide tokens and fonts and follows the system scheme. |
| `test/`, `package.json` (repo root) | `npm test` loads the template in headless Chromium as T3 would host it. |

Everything else tracks upstream.

## Sync with upstream

```bash
git fetch upstream
git merge upstream/main     # conflicts, if any, are in the files above
npm run check:versions
npm test
git push origin main
```

## Install

All agents read one checkout through symlinks:

```bash
for d in ~/.agents/skills ~/.claude/skills ~/.codex/skills; do
  ln -sfn ~/development/visual-explainer/plugins/visual-explainer "$d/visual-explainer"
done
```

Pi reads `~/.agents/skills`.
