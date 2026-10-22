import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";

const template = readFileSync(
  new URL("../plugins/visual-explainer/templates/field-guide.html", import.meta.url),
  "utf8",
);

// Colours from the token table in references/field-guide.md.
const LIGHT = { ground: "rgb(244, 239, 230)" };
const TRANSPARENT = "rgba(0, 0, 0, 0)";

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
      switchShown: style(".theme").display !== "none",
      edge: document.querySelector("h1").getBoundingClientRect().left,
      overflow: root.scrollWidth - root.clientWidth,
    };
  });
}

const cases = [
  {
    name: "on a dark T3 thread",
    t3: { appearance: "dark", background: "#0a0a0a" },
    system: "light",
    expect: { ground: TRANSPARENT, switchShown: false, edge: 0, overflow: 0 },
  },
  {
    name: "outside T3",
    t3: null,
    system: "light",
    expect: { ground: LIGHT.ground, switchShown: true, overflow: 0 },
  },
];

for (const { name, t3, system, expect } of cases) {
  test(`a Field Guide page ${name}`, async () => {
    const page = await open(t3 ? inT3(template, t3) : template, { system });
    const seen = await look(page);
    const checked = Object.fromEntries(Object.keys(expect).map((key) => [key, seen[key]]));
    assert.deepEqual(checked, expect);
  });
}
