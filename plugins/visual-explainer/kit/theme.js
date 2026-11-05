// Field Guide's scheme (references/field-guide.md). The renderer puts this in <head>, so the scheme is set before first paint.
(() => {
  const root = document.documentElement;
  // In T3 (references/t3.md) the page is dark when white text contrasts more than black on T3's background, which is WCAG
  // luminance under .179. A colour the canvas cannot read leaves it white, so light. T3 rewrites #t3-theme when the reader
  // switches its theme. Inside T3's frame prefers-color-scheme does not follow T3, so the switch is left out.
  const t3 = document.getElementById('t3-theme');
  if (t3) {
    root.classList.add('t3');
    const c = document.createElement('canvas').getContext('2d');
    const pick = () => {
      c.fillStyle = '#fff'; c.fillStyle = getComputedStyle(root).getPropertyValue('--background'); c.fillRect(0, 0, 1, 1);
      const p = c.getImageData(0, 0, 1, 1).data, w = [.2126, .7152, .0722];
      let L = 0;
      for (let i = 0; i < 3; i++) { const v = p[i] / 255; L += w[i] * (v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); }
      root.dataset.theme = L < .179 ? 'dark' : 'light';
    };
    pick();
    new MutationObserver(pick).observe(t3, { childList: true, characterData: true, subtree: true });
    return;
  }
  // a file:// page can throw on localStorage
  try { const t = localStorage.getItem('fg-theme'); if (t === 'light' || t === 'dark') root.dataset.theme = t; } catch {}
  // The switch shows the system scheme until the reader picks one; it sits at the end of the section nav when there is one.
  addEventListener('DOMContentLoaded', () => {
    const dark = matchMedia('(prefers-color-scheme: dark)');
    const box = document.createElement('div');
    box.className = 'fg-theme'; box.setAttribute('role', 'group'); box.setAttribute('aria-label', 'Colour scheme');
    const buttons = ['light', 'dark'].map((t) => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = t === 'light' ? 'Light' : 'Dark';
      b.addEventListener('click', () => { root.dataset.theme = t; try { localStorage.setItem('fg-theme', t); } catch {} paint(); });
      box.append(b);
      return [t, b];
    });
    const paint = () => { const cur = root.dataset.theme || (dark.matches ? 'dark' : 'light'); for (const [t, b] of buttons) b.setAttribute('aria-pressed', String(t === cur)); };
    dark.addEventListener('change', paint);
    paint();
    const nav = document.querySelector('.ve-toc');
    if (nav) nav.append(box); else document.body.prepend(box);
  });
})();
