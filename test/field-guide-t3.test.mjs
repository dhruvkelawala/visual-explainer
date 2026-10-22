import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";

const template = readFileSync(
  new URL("../plugins/visual-explainer/templates/field-guide.html", import.meta.url),
  "utf8",
);

// Colours from the token table in references/field-guide.md: --fg as text, --surface as a plate.
const LIGHT = { text: "rgb(18, 18, 18)", surface: "rgb(251, 248, 242)" };
const DARK = { text: "rgb(241, 235, 224)", surface: "rgb(29, 26, 22)" };
// --bg in dark, the ground a page paints for itself outside T3.
const DARK_GROUND = "rgb(20, 18, 15)";
const ON_THREAD = { ground: "rgba(0, 0, 0, 0)", switchShown: false, edge: 0, overflow: 0 };

const DARK_THREAD = { appearance: "dark", background: "#0a0a0a" };
const LIGHT_THREAD = { appearance: "light", background: "#fcfcfc" };

// T3's html_render bootstrap puts one style right after <head>: its theme as variables on :root,
// then this base sheet, copied from the T3 Code app. A theme switch rewrites the style with both.
const T3_BASE =
  "html{background:var(--background);color:var(--foreground);font-family:var(--font-sans);font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;scrollbar-width:none}html::-webkit-scrollbar{display:none}body{margin:0}code,kbd,pre,samp{font-family:var(--font-mono)}:where(:focus-visible){outline:2px solid var(--ring)}:focus-visible{outline-width:2px!important;outline-offset:-2px!important}:where(img:not(a[href] img,button img)){cursor:zoom-in}";

function t3Theme({ appearance, background }) {
  return `:root{color-scheme:${appearance};--background:${background}}${T3_BASE}`;
}

function inT3(html, thread) {
  return html.replace("<head>", `<head><style id="t3-theme">${t3Theme(thread)}</style>`);
}

let browser;
before(async () => {
  try {
    browser = await chromium.launch();
  } catch {
    browser = await chromium.launch({ channel: "chrome" });
  }
});
after(() => browser?.close());

// 728px is T3's reply column.
async function open(html, { system }) {
  const page = await browser.newPage({
    viewport: { width: 728, height: 900 },
    colorScheme: system,
    reducedMotion: "reduce",
  });
  await page.route(/^https?:/, (route) => route.abort());
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  return page;
}

function look(page) {
  return page.evaluate(() => {
    const style = (selector) => getComputedStyle(document.querySelector(selector));
    const root = document.documentElement;
    return {
      ground: style("body").backgroundColor,
      text: style("body").color,
      surface: style(".plate").backgroundColor,
      switchShown: style(".theme").display !== "none",
      edge: document.querySelector("h1").getBoundingClientRect().left,
      overflow: root.scrollWidth - root.clientWidth,
    };
  });
}

function seenFor(expect, seen) {
  return Object.fromEntries(Object.keys(expect).map((key) => [key, seen[key]]));
}

// Inside T3's frame the system scheme does not follow T3, so each T3 case sets the opposite one.
const cases = [
  {
    name: "turns dark on a dark T3 thread, sits on it flush left, and hides the switch",
    thread: DARK_THREAD,
    system: "light",
    expect: { ...ON_THREAD, ...DARK },
  },
  {
    name: "turns light on a light T3 thread while the system is dark",
    thread: LIGHT_THREAD,
    system: "dark",
    expect: { ...ON_THREAD, ...LIGHT },
  },
  {
    name: "turns dark on a custom T3 background written in oklch",
    thread: { appearance: "dark", background: "oklch(0.25 0.02 260)" },
    system: "light",
    expect: { ...ON_THREAD, ...DARK },
  },
  {
    name: "outside T3 paints its own ground, shows the switch and follows a dark system",
    thread: null,
    system: "dark",
    expect: { ground: DARK_GROUND, switchShown: true, overflow: 0, ...DARK },
  },
];

for (const { name, thread, system, expect } of cases) {
  test(`a Field Guide page ${name}`, async () => {
    const page = await open(thread ? inT3(template, thread) : template, { system });
    assert.deepEqual(seenFor(expect, await look(page)), expect);
  });
}

test("a Field Guide page turns light when the reader switches T3 to light", async () => {
  const page = await open(inT3(template, DARK_THREAD), { system: "dark" });
  await page.evaluate((css) => {
    document.getElementById("t3-theme").textContent = css;
  }, t3Theme(LIGHT_THREAD));
  assert.deepEqual(seenFor(LIGHT, await look(page)), LIGHT);
});

// T3 changes only the horizontal layout: T3's 14px root and the T3 block must not shrink the type or the spacing.
test("a Field Guide page keeps the reference build's type scale and section spacing in T3", async () => {
  const scale = async (html) =>
    (await open(html, { system: "light" })).evaluate(() => [
      ...[...document.querySelectorAll(".hero, .sec")].map((el) => {
        const { paddingTop, paddingBottom } = getComputedStyle(el);
        return `${el.className}: ${paddingTop} ${paddingBottom}`;
      }),
      ...["h1 .num", "h1 .rest", "h2", ".sec-no"].map(
        (selector) => `${selector}: ${getComputedStyle(document.querySelector(selector)).fontSize}`,
      ),
    ]);
  assert.deepEqual(await scale(inT3(template, DARK_THREAD)), await scale(template));
});
