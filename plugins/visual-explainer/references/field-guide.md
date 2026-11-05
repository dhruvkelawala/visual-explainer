# Field Guide (house style)

The default look for every page this skill makes: reviews, architecture, concepts, recaps and teaching pages. It reads like a naturalist's field guide printed as a Swiss poster: a bone ground, bold flat colour fields, poster-scale numerals, numbered plates and specimen cards.

Field Guide is a kit register. `data-register="field-guide"` selects it, and the renderer uses it when a page names no register. The kit then adds `kit/field-guide.css` after its own CSS, so every kit part (nodes, edges, KPI strips, cases, chips, tables, the stepper) takes the Field Guide look. It also adds a head script that sets light or dark. A page writes only its own layout CSS. Where this file and `style-guide.md` disagree, this file wins. The style guide still governs words, figure choice, accessibility and the look rules.

`templates/field-guide.src.html` is the reference source: a cache-aside review that uses every part below. Copy its parts, not its outline. Render it with `kit/render.mjs` to see them.

Never use the Blueprint register. Use Instrument, Paper or Editorial only when the user names one. Plan pages (`plan/plan.css`) use the same tokens and fonts, with the same switch.

## Tokens

The register sets the kit's tokens (`--bg --surface --border --border-bright --text --text-dim --accent --ok --warn --risk --info`) and these of its own. Light is the default; dark redefines tokens only. The field colours are the same in both schemes. Text on a tomato or butter field is always `--on-field`; text on cobalt is `--on-cobalt`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f4efe6` | `#14120f` | page ground |
| `--surface` | `#fbf8f2` | `#1d1a16` | plates, cards, buttons; the label halo on a drawing |
| `--text`, `--border-bright` | `#121212` | `#f1ebe0` | text, 3px borders, node strokes |
| `--text-dim` | `#55504a` | `#b3aa9b` | labels, secondary text |
| `--border` | `#a9a296` | `#5a534a` | dashed row rules |
| `--accent` | `#1f4bd8` | `#8ea6ff` | the hot path, the unit in a headline numeral |
| `--cobalt` / `--tomato` / `--butter` | `#1f4bd8` / `#ef5a3c` / `#f6d44c` | same | colour fields, fills |
| `--on-field` / `--on-cobalt` | `#121212` / `#fff` | same | text on fields |
| `--cobalt-fg` / `--tomato-fg` | `#1f4bd8` / `#b0341a` | `#8ea6ff` / `#ff8d73` | cobalt or tomato as text or a line on the ground |
| `--shadow` | `#121212` | `#000` | hard offset shadows |
| `--inv-*` | ink ground, bone text, butter accent | bone ground, ink text, cobalt accent | the inverse field (`.fg-inv`) |
| `--font-display` / `--font-serif` | Bricolage Grotesque 800 / Instrument Serif | same | headings and numerals / a few italic words |

Never put raw `--tomato` or `--butter` text on the ground; use `--tomato-fg`, and never use butter as text on bone. In SVG, set colours with kit classes or `style="fill:var(--…)"`, because presentation attributes do not read CSS variables.

## Fonts

Bricolage Grotesque for display and numerals, Instrument Serif italic for a few words, Instrument Sans for body, and JetBrains Mono for labels. The renderer loads them. Body is 17px. Labels are mono at 13px, uppercase, `.06em` tracking.

`<em>` is Instrument Serif italic. Use it only for the tail of a headline (“…five gates. *Any ‘no’ is silence.*”), specimen names (“The *Cold* Miss”) and takeaway numerals (*One. Two. Three.*). Edge labels on a drawing (`.ve-el`, `<ve-edge label>`) are serif italic too, so write them as verbs.

## Light and dark

- `kit/theme.js` runs in `<head>`. Outside T3 it applies the reader's stored choice (`localStorage` key `fg-theme`), else the system scheme. It adds a **Light / Dark** switch at the end of the section nav, or at the top right when there is no nav.
- In T3 (`references/t3.md`) it reads T3's background instead and leaves the switch out.
- What flips: the ground, surfaces, text and borders, and the inverse field (an ink band in light, a bone band in dark). What does not flip: the cobalt, tomato and butter fields.

## Page structure

1. **Header.** `.eyebrow` (`Field Guide · subject`) over a 3px rule. Then the answer: `<h1><span class="num">94<span class="unit">%</span></span> of reads never touch <em>Postgres.</em></h1>`. The numeral is poster scale and its unit is cobalt. Beside it, or under it on a phone, a `.fg-note`. Put the two in a two-column grid of your own; the reference source shows one.
2. **Sections.** Each opens with `.sec-head`: a `.fg-no` plate number (`01`) and a mono label (`Plate I · Anatomy of a read`) in the label column, and an `h2` that states the takeaway and ends with an `<em>` phrase.
3. **Colour fields.** At most one full-width colour field per screen. A good order: bone header → bone Plate I → `.fg-inv` for numbers → bone Plate II → bone hazards → `.fg-cobalt` takeaways.

## Parts

The kit's parts (`kit.md`) work as written and take the Field Guide look. These are Field Guide's own:

| Part | Markup |
|---|---|
| Field note | `<div class="fg-note">`: `<p class="ve-label"><span>Field note</span><span>Obs. · 7 days</span></p>`, a `.lead` with one bold phrase, a `.meta` line, and an optional `<span class="fg-stamp">■ Two-way door</span>` for the one warning |
| Plate | the kit's `figure` › `.frame`: a surface panel with a 3px border and a hard 10px shadow. A plate that steps is the kit's stepper (`motion.md`); the key node (`key` on `<ve-node>`, `.is-key`) is the cobalt box |
| Plate number | `<span class="fg-no">01</span>` above the label in `.sec-head` |
| Label row | `<div class="fg-top">`: mono labels split left and right over a rule. In a `.case`, `data-field="cobalt\|butter\|tomato\|ink"` colours it as the card's header strip |
| Inverse field | `<section class="fg-inv">`: redefines the tokens, so a KPI strip or a figure inside it follows. Numbers go here |
| Cobalt field | `<section class="fg-cobalt">`: white text, butter accent and `<em>`. Takeaways go here |
| Specimen cards | the kit's `.cases` › `.case[data-st]`: a `.fg-top` header strip with `Specimen No. N` and a chip, an `h3` with one `<em>` word, the same `.ve-mini` drawing in every card with only the changed part `.is-st`, and a `<dl>` of **Field mark** (how to recognise it), **Habitat** (when it happens), then **Cost**, **Behaviour**, **Undo** or **Watch for**. Header colour: cobalt for the normal case, butter for caution, tomato for risk, ink for neutral |
| Hazards | `<ul class="fg-hz">` › `<li>`: a `<span class="fg-tag risk\|check">■ Risk</span>` (no class for **Later**), then a `<div>` with an `h3` and one or two sentences |
| Switch callout | `<div class="fg-switch"><b>Kill switch</b><p><code>flag=false</code> does …</p></div>`, one per page, for the rollback or the key setting |
| Takeaways | `<ol class="fg-takes">` › `<li>`: `<span class="n">One.</span>`, an `h3`, one or two sentences |

Chips are pills and tags are square. Both carry shape and word: ● follows or ok, ○ paused or check, ■ stops or risk, ▲ skipped or later, ◆ write or change.

## Rules that adapt the style guide

- **Quiet ground, one signal, per figure.** Colour fields are structure, not signal. Inside a figure, one colour carries the main path (cobalt), tomato marks only failure or risk, and butter marks “you are here”, the selection or the outcome.
- **Square and hard.** Square corners except pills. Shadows are hard offsets with no blur. No gradients, glows or glass.
- **Field-guide words as labels, never as jokes.** Use Plate, Specimen No., Field mark and Habitat. Never write puns or fake Latin (“Cachea asidea”).
- **Contrast.** Check every text colour on each ground it sits on, in both schemes. `--tomato-fg` and `--cobalt-fg` exist for this.

## Extra delivery checks

```
□ the render shows no ✗ in light; look at the sheet once, and at the page in dark once
□ in T3: light on a light background and dark on a dark one (`html_preview` both appearances), with no switch
□ one full-width colour field per screen at most; tomato only for risk or failure
□ specimen cards share one mini drawing and use Field mark / Habitat
□ no Blueprint grid, IBM Plex, puns or fake Latin
```
