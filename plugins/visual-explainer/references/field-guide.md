# Field Guide (house style)

The default look for every page this skill makes: reviews, architecture, concepts, recaps and plans. It reads like a naturalist's field guide printed as a Swiss poster: a bone ground, bold flat colour fields, poster-scale numerals, numbered plates and specimen cards.

`templates/field-guide.html` is the reference build. Copy its parts (tokens, theme switch, CSS, scripts, components), not its outline. Where this file and `style-guide.md` disagree, this file wins. The style guide still governs words, figure choice, typography rules, accessibility and the polish pass.

Never use the Blueprint register. Use Instrument, Paper or Editorial only when the user names one.

The renderers already use it: `plan/plan.css` (plan pages, with the same light/dark switch) and `quick/base.css` (quick mode, which has no script and follows the system scheme) share these tokens and fonts.

## Tokens

Light is the default. Dark redefines tokens only. Field colours (`--cobalt --tomato --butter`) are the same in both schemes. Text on a tomato or butter field is always `--on-field`; text on cobalt is `--on-cobalt`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f4efe6` | `#14120f` | page ground, mini-plate ground |
| `--surface` | `#fbf8f2` | `#1d1a16` | plates, cards, buttons |
| `--fg` | `#121212` | `#f1ebe0` | text, 3px borders, strokes |
| `--muted` | `#55504a` | `#b3aa9b` | labels, secondary text |
| `--rule` | `#a9a296` | `#5a534a` | dashed row rules |
| `--shadow` | `#121212` | `#000` | hard offset shadows |
| `--code-bg` | `rgba(18,18,18,.06)` | `rgba(241,235,224,.09)` | inline code |
| `--cobalt` / `--tomato` / `--butter` | `#1f4bd8` / `#ef5a3c` / `#f6d44c` | same | colour fields, fills |
| `--on-field` / `--on-cobalt` | `#121212` / `#fff` | same | text on fields |
| `--cobalt-fg` | `#1f4bd8` | `#8ea6ff` | cobalt as text or line on the ground |
| `--tomato-fg` | `#b0341a` | `#ff8d73` | tomato as text or line on the ground |
| `--spine` | `#1f4bd8` | `#4d72ff` | the main path in a plate |
| `--inv-bg` / `--inv-fg` | `#121212` / `#f4efe6` | `#f1ebe0` / `#121212` | the inverse field (ink in light, bone in dark) |
| `--inv-accent` / `--inv-mut` / `--inv-rule` / `--inv-mid` | `#f6d44c` / `#d9d3c8` / `#4a4640` / `#8d877d` | `#1f4bd8` / `#4f493f` / `#c9c1b3` / `#8d877d` | numbers, notes, rules and neutral marks on the inverse field |
| `--dim-line` / `--dim-text` / `--dim-cobalt` / `--dim-butter` | `#d3ccc0` / `#bdb6aa` / `#c8d2f4` / `#efe6c0` | `#3a352e` / `#6e675c` / `#232d5c` / `#4a4226` | opaque dimming inside a plate |

Never put raw `--tomato` or `--butter` text on the ground; use `--tomato-fg`, and never use butter as text. In SVG, set colours with classes or `style="fill:var(--…)"`, because presentation attributes do not read CSS variables. The only literal hex values allowed in SVG are the constant field colours and the text that sits on them.

## Fonts

Bricolage Grotesque 700–800 for display and numerals, Instrument Serif italic for a few words, Instrument Sans for body, and JetBrains Mono for labels. Load them in one Google Fonts link at every weight used. Body is 17px. Labels are mono at 13px, uppercase, `.06em` tracking.

Serif italic marks only these: the tail of a headline (“…five gates. *Any ‘no’ is silence.*”), verbs on figure arrows, specimen names (“The *Cold* Miss”), takeaway numerals (*One. Two. Three.*), and the plate subtitle.

## Light and dark

- `:root` holds the light tokens. `:root[data-theme=dark]` holds the dark tokens, and the same dark block repeats inside `@media (prefers-color-scheme:dark){:root:not([data-theme=light]){…}}`. Without JS, the page follows the system.
- A fixed switch sits at the top right: two buttons, **Light** and **Dark**, with `aria-pressed`, a 2px `--fg` border, a `--surface` ground and a 3px hard shadow. The pressed button inverts (`--fg` ground, `--surface` text). Hide it in print and without JS.
- Clicking sets `document.documentElement.dataset.theme` and stores it in `localStorage` (key `fg-theme`, inside `try/catch`, because `file://` pages can throw). A one-line script in `<head>` applies the stored choice before first paint. The switch reflects the system scheme until the reader chooses.
- What flips: the ground, surfaces, text and borders; the inverse field (ink band in light, bone band in dark, with a butter accent in light and a cobalt accent in dark); and the hero note's offset shadow (ink in light, cobalt in dark). What does not flip: the cobalt, tomato and butter fields.

## Page structure

1. **Topbar.** Mono labels on one line (`Field Guide No. N · subject` on the left, the scope on the right) over a 3px `--fg` rule. Leave room on the right for the theme switch.
2. **Hero.** The answer as a giant numeral (`clamp(7rem,26vw,13rem)`, weight 800, `-.07em` tracking) with its unit in cobalt, then the rest of the headline at `clamp(2.1rem,5.6vw,3.8rem)`. Beside it (stacked under 860px), a butter **Field note** card with a hard 10px offset shadow: a mono label row, a one- or two-sentence deck with one bold phrase, a mono meta line and an optional tilted tomato **stamp** for the one warning (for example “One-way door”).
3. **Sections.** Each opens with a giant section number (`01`, weight 800), a mono label (`Plate I · Anatomy of a read`) and an `h2` that states the takeaway and ends with a serif italic phrase.
4. **Colour fields.** At most one full-width colour field per screen. A good order: bone hero → bone Plate I → inverse field for numbers → bone Plate II → bone hazards → cobalt takeaways.

## Components

| Component | Spec |
|---|---|
| **Plate** (the main figure) | `--surface` panel, 3px `--fg` border, 10px hard offset shadow. A top row holds the mono plate label with a serif subtitle and the source path. Inside, an anatomical SVG sits beside the **key** at ≥1000px and above it when narrower. Stages are square-cornered boxes with numbered ink badges on the left edge, on a 12px `--spine` line with moving `--surface` dots (hidden under reduced motion). Serif-italic verbs sit beside the spine. Failure or alternate paths are 3px dashed `--tomato-fg` branches into a tomato side column. The goal or last stage is a cobalt box with a butter badge, and the outcome is a butter box. |
| **Key as a stepper** | An `<ol>` of buttons, one per numbered stage: a numbered dot, a display-font title, one or two sentences, and an optional mono `--tomato-fg` line for what happens on failure. Clicking a stage selects it (butter row, `aria-pressed`), keeps it full strength in the SVG and dims the rest. Dim stage boxes with the opaque `--dim-*` tokens, not opacity, so the spine never shows through. Verbs, branches and side-column lines may use opacity `.16`. Below the key: **Walk the path →** / **← Back** / **Show all** buttons and a `Gate N of M` read-out. Arrow keys move through the key, and Escape shows all. `#gate=N` in the URL opens a stage. Without JS, everything shows. |
| **Measurements** | On the inverse field. A 3-column strip with a 3px top rule and 1.5px column rules. Each cell has a giant `--inv-accent` numeral (with `/N` or the unit at half size in `--inv-mut`), a mono caption that wraps, and its picture: a stacked bar with a key, square pips, a waffle, bars or a sparkline. Every number gets a picture. |
| **Specimen cards** | Small multiples for cases, states, options or failure modes. A 3px border and a coloured header strip with `Specimen No. N` and a status chip (shape + word). The header colour carries meaning: **cobalt** for the normal or desired case, **butter** for paused or caution, **tomato** for stopped or risk, **ink** (`--fg` ground) for skipped or neutral. Then a display title with one serif word (“The *Shared* Thread”), a mini plate (the same small drawing in every card, on `--bg`, with only the changed part coloured), and a `<dl>` of mono field names: **Field mark** (how to recognise it), **Habitat** (when it happens), **Behaviour**, then **Cost**, **Undo**, **Ends when** or **Watch for**. |
| **Hazards** | A list with a 3px top rule and 1.5px row rules. The left column holds a tag (`■ Risk` tomato, `○ Check` butter, `▲ Later` surface) and an optional mono SHA chip. The right column holds a display title and one or two sentences. |
| **Switch callout** | One per page for the rollback or the key setting: a `--surface` box with a 3px border and a double hard shadow (8px butter, then an 8px `--fg` outline). Big display label on the left, the setting in a butter `code` on the right. |
| **Takeaways** | On the cobalt field. Three columns with a 3px white top rule. Each has a butter serif numeral (*One.*), a display title and one or two sentences. |
| **Chips and tags** | Mono 13px, uppercase, 2px `--fg` border. Chips are pills; tags are square. Always shape + word: ● follows or ok, ○ paused or check, ■ stops or risk, ▲ skipped or later, ◆ write or change. |

## Rules that adapt the style guide

- **Quiet ground, one signal, per figure.** Colour fields are structure, not signal. Inside a figure, one colour carries the main path (cobalt), tomato only marks failure or risk, and butter marks “you are here”, the selection or the outcome.
- **Square and hard.** Square corners (radius 0–2px) except pills, chips and avatars. Shadows are hard offsets with no blur. No gradients, glows or glass.
- **Field-guide words as labels, never as jokes.** Use Plate, Specimen No., Field mark and Habitat. Never write puns or fake Latin (“Cachea asidea”).
- **Contrast.** Check every text colour on each ground it sits on, in both schemes. `--tomato-fg` and `--cobalt-fg` exist for this. Butter is never text on bone.
- **Big type, still readable.** SVG labels are at least 12px when rendered at 728px wide, so size the `viewBox` to the content (a vertical plate around 640 units wide renders at about 1:1 in a 728px column).

## Traps seen while building it

- A `::before` hard-shadow block with `z-index:-1` paints over its own card if the card has `isolation:isolate` or creates a stacking context. Leave the card without one.
- `white-space:nowrap` on a numeral container also stops its caption `<small>` from wrapping, so it overflows into the next column. Set `white-space:normal` on the caption.
- Labels that cross a dashed line need a halo: `paint-order:stroke` with a stroke in the ground colour.
- Mobile: plates keep a 6px shadow, the stats and takeaways go to one column, and the topbar gets top padding so the fixed switch does not cover it.

## Extra delivery checks

```
□ light and dark both checked at 728px and 1280px; the switch works, persists, and follows the system before a choice
□ one full-width colour field per screen at most; tomato only for risk or failure
□ no raw tomato or butter text on the ground; SVG colours come from tokens
□ plate key steps through every stage; dimming is opaque; #gate=N works; everything shows without JS
□ specimen cards share one mini drawing and use Field mark / Habitat / Behaviour
□ no Blueprint grid, IBM Plex, puns or fake Latin
```
