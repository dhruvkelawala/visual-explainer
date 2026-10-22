# How a T3 visual page picks light or dark

Research notes for the teaching page `t3-page-theme.html`. Every claim carries its source.

## Answers first

- T3 adds one `<style id="t3-theme">` right after `<head>`, holding its theme as CSS variables on `:root` and a base sheet. [T3 Code (Nightly) app bundle, `app.asar`: `injectHtmlRenderBootstrap`, `bootstrapMarkup`, `THEME_FRAGMENT_KEY = "t3-theme"`]
- Inside the frame, `prefers-color-scheme: dark` is false in both of T3's appearances. [`html_preview` probes in this session: appearance light → `prefersDark=false`, `--background:#fcfcfc`; appearance dark → `prefersDark=false`, `--background:#0a0a0a`]
- On a theme switch, T3 does not reload the page. The parent posts `ui/notifications/host-context-changed`, and the bootstrap rewrites the text of `#t3-theme`. [T3 bundle: `BOOTSTRAP_SCRIPT`, `HOST_CONTEXT_CHANGED_METHOD`, `s.textContent=c+"}"+b`]
- Relative luminance runs from 0 (black) to 1 (white): L = 0.2126 R + 0.7152 G + 0.0722 B on linearised sRGB channels. [WCAG 2.1, relative luminance: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance]
- Contrast ratio is (L1 + 0.05) / (L2 + 0.05). [WCAG 2.1, contrast ratio: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio]
- White and black text have equal contrast where (L + 0.05)² = 1.05 × 0.05, so L ≈ 0.179. Below it white text wins. [derived from the two WCAG definitions above]
- A `MutationObserver` calls back when an observed node's children or text change. [MDN: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver]

## Measured samples (canvas readback, headless Chromium)

| Background | sRGB | Luminance | Scheme |
|---|---|---|---|
| `#0a0a0a` (T3 dark) | 10,10,10 | 0.0030 | dark |
| `oklch(0.25 0.02 260)` | 28,34,43 | 0.0157 | dark |
| `#707070` | 112,112,112 | 0.1620 | dark |
| `#777777` | 119,119,119 | 0.1845 | light |
| `#fcfcfc` (T3 light) | 252,252,252 | 0.9734 | light |

## In the project

- `plugins/visual-explainer/templates/field-guide.html`, first `<head>` script: finds `#t3-theme`, adds the `t3` class, picks the scheme, observes the style.
- `plugins/visual-explainer/templates/field-guide.html`, `T3 VISUAL PAGE` CSS block: no body ground, switch hidden, flush-left wrap.
- `test/field-guide-t3.test.mjs`: four scheme cases and a live switch, with T3's base sheet copied from the bundle.
- `plugins/visual-explainer/references/t3.md`: the steps and the frame's rules.

## Open risks

- A custom T3 theme with a mid-grey background can land on the side its name does not suggest; the page follows contrast, not the name.
- The base sheet copied into the test can drift from T3's own.
