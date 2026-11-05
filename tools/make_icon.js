// Renders the Android launcher icons from the game's own painted art (src/paint.js and src/animals.js, used read-only):
// the title screen's frog sitting on a lily pad in a sunny pond, with a pink water lily beside it.
//
//   node tools/make_icon.js [android/res]
//
// Writes, for every density (mdpi … xxxhdpi):
//   mipmap-*/ic_launcher.png             legacy square icon with rounded corners (48 dp)
//   mipmap-*/ic_launcher_round.png       legacy round icon (48 dp)
//   mipmap-*/ic_launcher_foreground.png  adaptive-icon foreground, the frog on its lily pad on transparent (108 dp)
//   mipmap-*/ic_launcher_background.png  adaptive-icon background, the sky and the pond (108 dp)
// plus mipmap-anydpi-v26/ic_launcher.xml and ic_launcher_round.xml, which tell Android 8+ to combine the two layers.
// Needs: npm i playwright (Chromium). Look at the PNGs after running it.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'android', 'res'));
const DENSITIES = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent('<!doctype html><meta charset="utf-8"><body></body>');
  const src = f => fs.readFileSync(path.join(ROOT, 'src', f), 'utf8');
  await page.addScriptTag({ content: src('paint.js') + '\n' + src('animals.js') + '\nwindow.P = P; window.ANI = ANI;' });
  await page.waitForFunction(() => window.P && window.ANI && typeof ANI.draw === 'function');

  const render = (kind, px) => page.evaluate(([kind, px]) => {
    const c = document.createElement('canvas'); c.width = c.height = px; const x = c.getContext('2d');
    const TAU = Math.PI * 2;
    // All art is laid out on a 108-unit square (the adaptive-icon grid); legacy icons crop to the middle 72 units
    // (what a launcher shows of an adaptive icon), so the art is the same size relative to the visible shape.
    const legacy = kind === 'legacy' || kind === 'round';
    const k = legacy ? px / 72 : px / 108; x.scale(k, k); if (legacy) x.translate(-18, -18);
    const background = () => {
      // a summer sky (the title screen's colours) over a pond that fills the lower half
      const g = x.createLinearGradient(0, 0, 0, 58);
      g.addColorStop(0, '#5cb2ea'); g.addColorStop(0.55, '#96d2f2'); g.addColorStop(1, '#e2f4ea');
      x.fillStyle = g; x.fillRect(0, 0, 108, 60);
      const sun = x.createRadialGradient(78, 30, 1, 78, 30, 34);
      sun.addColorStop(0, 'rgba(255,248,214,0.95)'); sun.addColorStop(0.3, 'rgba(255,242,192,0.5)'); sun.addColorStop(1, 'rgba(255,242,192,0)');
      x.fillStyle = sun; x.fillRect(0, 0, 108, 60);
      // a far bank of soft green hills
      x.fillStyle = '#8cc866'; x.beginPath(); x.moveTo(0, 56); x.quadraticCurveTo(22, 46, 46, 53); x.quadraticCurveTo(72, 45, 108, 54); x.lineTo(108, 60); x.lineTo(0, 60); x.closePath(); x.fill();
      x.fillStyle = '#6cb054'; x.beginPath(); x.moveTo(0, 58); x.quadraticCurveTo(34, 52, 60, 57); x.quadraticCurveTo(86, 53, 108, 57); x.lineTo(108, 60); x.lineTo(0, 60); x.closePath(); x.fill();
      const w = x.createLinearGradient(0, 57, 0, 108);
      w.addColorStop(0, '#9ad8de'); w.addColorStop(0.35, '#58b4c4'); w.addColorStop(1, '#2a7690');
      x.fillStyle = w; x.fillRect(0, 57, 108, 51);
      // ripples and sparkles on the water
      x.strokeStyle = 'rgba(255,255,255,0.35)'; x.lineWidth = 1.1; x.lineCap = 'round';
      for (const [cx, cy, r] of [[20, 64, 7], [92, 66, 6], [16, 92, 8], [94, 96, 9], [56, 100, 6]]) { x.beginPath(); x.ellipse(cx, cy, r, r * 0.28, 0, Math.PI * 1.1, Math.PI * 1.9); x.stroke(); }
      x.fillStyle = 'rgba(255,250,224,0.8)';
      for (const [cx, cy, r] of [[30, 61, 0.9], [84, 62, 1.1], [70, 104, 0.8], [8, 78, 0.8]]) { x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill(); }
    };
    const foreground = () => {
      // the lily pad, seen at a low angle, with its notch toward the viewer's right
      const px0 = 54, py0 = 76;
      x.fillStyle = 'rgba(20,60,80,0.28)'; x.beginPath(); x.ellipse(px0 + 1.5, py0 + 3, 28, 9, 0, 0, TAU); x.fill();
      const notch = 0.62;
      x.fillStyle = '#5aae4a'; x.strokeStyle = '#2e6a34'; x.lineWidth = 1.6; x.lineJoin = 'round';
      x.beginPath(); x.ellipse(px0, py0, 27, 8.4, 0, notch + 0.22, notch + TAU - 0.22); x.lineTo(px0, py0); x.closePath(); x.fill(); x.stroke();
      x.fillStyle = 'rgba(214,246,160,0.5)'; x.beginPath(); x.ellipse(px0 - 8, py0 - 2.5, 14, 3.2, 0, 0, TAU); x.fill();
      x.strokeStyle = 'rgba(46,106,52,0.45)'; x.lineWidth = 0.8;
      for (const a of [2.0, 2.7, 3.4, 4.1, 4.8]) { x.beginPath(); x.moveTo(px0, py0); x.lineTo(px0 + Math.cos(a) * 22, py0 + Math.sin(a) * 6.6); x.stroke(); }
      // the frog sits on the pad, smiling
      ANI.draw(x, 'frog', 52, 78, 0.66, { expr: 'happy', noShadow: true });
      // a pink water lily on the pad's right edge
      const lx = 72.5, ly = 74; // inside the 66-unit safe circle
      const petal = (a, len, wid, col) => { x.save(); x.translate(lx, ly); x.rotate(a); x.fillStyle = col; x.strokeStyle = '#b8406c'; x.lineWidth = 0.8;
        x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(wid, -len * 0.5, 0, -len); x.quadraticCurveTo(-wid, -len * 0.5, 0, 0); x.closePath(); x.fill(); x.stroke(); x.restore(); };
      for (const a of [-1.25, 1.25, -0.8, 0.8]) petal(a, 8.5, 3.4, '#f4a0bc');
      for (const a of [-0.38, 0.38, 0]) petal(a, 10, 3.6, '#fbc4d6');
      x.fillStyle = '#ffd24a'; x.beginPath(); x.ellipse(lx, ly - 2.5, 2.2, 1.3, 0, 0, TAU); x.fill();
    };
    if (kind === 'background') background();
    else if (kind === 'foreground') foreground();
    else {
      x.save(); x.beginPath();
      if (kind === 'round') x.arc(54, 54, 36, 0, 7);
      else { const r = 9, a = 19, b = 89; x.moveTo(a + r, a); x.arcTo(b, a, b, b, r); x.arcTo(b, b, a, b, r); x.arcTo(a, b, a, a, r); x.arcTo(a, a, b, a, r); x.closePath(); }
      x.clip(); background(); foreground(); x.restore();
    }
    return c.toDataURL('image/png').split(',')[1];
  }, [kind, px]);

  for (const [name, d] of Object.entries(DENSITIES)) {
    const dir = path.join(OUT, 'mipmap-' + name); fs.mkdirSync(dir, { recursive: true });
    const files = { ic_launcher: ['legacy', 48], ic_launcher_round: ['round', 48], ic_launcher_foreground: ['foreground', 108], ic_launcher_background: ['background', 108] };
    for (const [file, [kind, dp]] of Object.entries(files)) {
      fs.writeFileSync(path.join(dir, file + '.png'), Buffer.from(await render(kind, Math.round(dp * d)), 'base64'));
    }
  }
  const anydpi = path.join(OUT, 'mipmap-anydpi-v26'); fs.mkdirSync(anydpi, { recursive: true });
  const xml = '<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
    + '    <background android:drawable="@mipmap/ic_launcher_background" />\n'
    + '    <foreground android:drawable="@mipmap/ic_launcher_foreground" />\n</adaptive-icon>\n';
  fs.writeFileSync(path.join(anydpi, 'ic_launcher.xml'), xml);
  fs.writeFileSync(path.join(anydpi, 'ic_launcher_round.xml'), xml);
  await browser.close();
  console.log('wrote launcher icons to', OUT);
})();
