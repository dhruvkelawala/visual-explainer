# Fork notes

This is [dhruvkelawala/visual-explainer](https://github.com/dhruvkelawala/visual-explainer), a fork of [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer) with one change: the **Field Guide** house style replaces the Blueprint register as the default look, in light and dark with a switch.

| Where | What changed |
|---|---|
| `references/field-guide.md`, `templates/field-guide.html` | New: the house style and its reference build. |
| `SKILL.md`, `references/style-guide.md`, `references/slides.md` | A House style block under `## Look`; Blueprint removed from the register tables. |
| `plan/plan.css`, `plan/render.mjs` | Plan pages use Field Guide tokens and fonts and get the light/dark switch. Overrides sit in one block at the end of `plan.css`. |
| `quick/base.css`, `quick/render.mjs` | Quick mode uses Field Guide tokens and fonts and follows the system scheme. |

Everything else tracks upstream.

## Sync with upstream

```bash
git fetch upstream
git merge upstream/main     # conflicts, if any, are in the files above
npm run check:versions
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
