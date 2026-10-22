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
const BONE_GROUND = "rgb(244, 239, 230)";
const ON_THREAD = { ground: "rgba(0, 0, 0, 0)", switchShown: false, edge: 0, overflow: 0 };

// What T3's html_render bootstrap puts right after <head>: its theme as variables on :root,
// and a base sheet that paints html with the thread's background.
function inT3(html, { appearance, background }) {
  const theme = `<style id="t3-theme">:root{color-scheme:${appearance};--background:${background}}html{background:var(--background)}body{margin:0}</style>`;
  return html.replace("<head>", `<head>${theme}`);
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

// Inside T3's frame the system scheme does not follow T3, so each T3 case sets the opposite one.
const cases = [
  {
    name: "on a dark T3 thread",
    t3: { appearance: "dark", background: "#0a0a0a" },
    system: "light",
    expect: { ...ON_THREAD, ...DARK },
  },
  {
    name: "on a light T3 thread",
    t3: { appearance: "light", background: "#fcfcfc" },
    system: "dark",
    expect: { ...ON_THREAD, ...LIGHT },
  },
  {
    name: "on a custom dark T3 theme written in oklch",
    t3: { appearance: "dark", background: "oklch(0.25 0.02 260)" },
    system: "light",
    expect: { ...ON_THREAD, ...DARK },
  },
  {
    name: "outside T3",
    t3: null,
    system: "light",
    expect: { ground: BONE_GROUND, switchShown: true, overflow: 0, ...LIGHT },
  },
];

function only(seen, expect) {
  return Object.fromEntries(Object.keys(expect).map((key) => [key, seen[key]]));
}

for (const { name, t3, system, expect } of cases) {
  test(`a Field Guide page ${name}`, async () => {
    const page = await open(t3 ? inT3(template, t3) : template, { system });
    assert.deepEqual(only(await look(page), expect), expect);
  });
}

test("a Field Guide page follows T3 when the reader switches T3 to light", async () => {
  const page = await open(inT3(template, { appearance: "dark", background: "#0a0a0a" }), { system: "dark" });
  // T3 rewrites this style in place when its theme changes.
  await page.evaluate(() => {
    document.getElementById("t3-theme").textContent = ":root{color-scheme:light;--background:#fcfcfc}";
  });
  assert.deepEqual(only(await look(page), LIGHT), LIGHT);
});
