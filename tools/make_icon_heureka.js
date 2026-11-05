// Renders Heurēka!'s Android launcher icons from the title painting's own art (src/paint.js, src/animals.js and
// heureka/title.js, used read-only): the claw-foot bathtub overflowing with water, the frog leaping out of it with
// its arms up, a splash, and the lightbulb of the idea, over the title's sky, sea and sandstone terrace.
//
//   node tools/make_icon_heureka.js [heureka/android/res]
//
// Writes, for every density (mdpi … xxxhdpi):
//   mipmap-*/ic_launcher.png             legacy square icon with rounded corners (48 dp)
//   mipmap-*/ic_launcher_round.png       legacy round icon (48 dp)
//   mipmap-*/ic_launcher_foreground.png  adaptive-icon foreground, the tub, frog, splash and bulb on transparent (108 dp)
//   mipmap-*/ic_launcher_background.png  adaptive-icon background, the sky, sea and terrace (108 dp)
// plus mipmap-anydpi-v26/ic_launcher.xml and ic_launcher_round.xml, which tell Android 8+ to combine the two layers.
// Needs: npm i playwright (Chromium). Look at the PNGs after running it.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'heureka', 'android', 'res'));
const DENSITIES = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent('<!doctype html><meta charset="utf-8"><body></body>');
  const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
  await page.addScriptTag({ content: 'window.GAME_NAME = "Heurēka!";\n' + rd('src/paint.js') + '\n' + rd('src/animals.js') + '\n' + rd('heureka/title.js') + '\nwindow.P = P; window.ANI = ANI; window.HK_TITLE = HK_TITLE;' });
  await page.waitForFunction(() => window.P && window.ANI && window.HK_TITLE && HK_TITLE.paintTub);

  const render = (kind, px) => page.evaluate(([kind, px]) => {
    const c = document.createElement('canvas'); c.width = c.height = px; const x = c.getContext('2d');
    const TAU = Math.PI * 2, { paintTub: T, TUB } = HK_TITLE;
    // All art is laid out on a 108-unit square (the adaptive-icon grid); legacy icons crop to the middle 72 units
    // (what a launcher shows of an adaptive icon), so the art is the same size relative to the visible shape.
    const legacy = kind === 'legacy' || kind === 'round';
    const k = legacy ? px / 72 : px / 108; x.scale(k, k); if (legacy) x.translate(-18, -18);
    const SEA0 = 50, SEA1 = 60;
    const background = () => {
      const g = x.createLinearGradient(0, 0, 0, SEA0); g.addColorStop(0, '#4aa6e4'); g.addColorStop(0.6, '#8ccff4'); g.addColorStop(1, '#d8f2f0');
      x.fillStyle = g; x.fillRect(0, 0, 108, SEA0 + 1);
      const sun = x.createRadialGradient(30, 28, 1, 30, 28, 30); sun.addColorStop(0, 'rgba(255,248,214,0.95)'); sun.addColorStop(0.3, 'rgba(255,242,192,0.45)'); sun.addColorStop(1, 'rgba(255,242,192,0)');
      x.fillStyle = sun; x.fillRect(0, 0, 108, SEA0);
      // the island with its temple on the right
      x.fillStyle = '#9cc4a8'; x.beginPath(); x.moveTo(64, SEA0 + 0.5); x.quadraticCurveTo(76, SEA0 - 8, 92, SEA0 - 7); x.quadraticCurveTo(104, SEA0 - 5, 112, SEA0 + 0.5); x.closePath(); x.fill();
      const w = x.createLinearGradient(0, SEA0, 0, SEA1); w.addColorStop(0, '#9adcec'); w.addColorStop(1, '#2a7cb4'); x.fillStyle = w; x.fillRect(0, SEA0, 108, SEA1 - SEA0);
      x.strokeStyle = 'rgba(255,255,255,0.6)'; x.lineWidth = 0.7; x.lineCap = 'round';
      for (const [cx, cy, l] of [[14, 53, 5], [40, 55.5, 4], [88, 54, 6], [66, 57.5, 4]]) { x.beginPath(); x.moveTo(cx - l, cy); x.lineTo(cx + l, cy); x.stroke(); }
      // the marble ledge and the sandstone terrace
      x.fillStyle = '#fbf4e8'; x.fillRect(0, SEA1 - 0.5, 108, 2.6);
      const f = x.createLinearGradient(0, SEA1 + 2, 0, 108); f.addColorStop(0, '#f4dfba'); f.addColorStop(1, '#dcae78'); x.fillStyle = f; x.fillRect(0, SEA1 + 2, 108, 108 - SEA1);
      x.strokeStyle = 'rgba(176,122,78,0.3)'; x.lineWidth = 0.5;
      for (const y of [66, 74, 86, 102]) { x.beginPath(); x.moveTo(0, y); x.lineTo(108, y); x.stroke(); }
      for (let i = -6; i <= 6; i++) { x.beginPath(); x.moveTo(54 + i * 10, SEA1 + 2); x.lineTo(54 + i * 30, 108); x.stroke(); }
    };
    const foreground = () => {
      // the tub from the title, shrunk, its rim centred at (54, 61)
      const s = 0.31, t = 1.3;
      x.save(); x.translate(54, 61); x.scale(s, s); x.translate(-TUB.x, -TUB.y);
      const fs = { since: 0.2, air: 1, u: 0.5 };
      T.puddle(x, t, fs); T.tubBody(x); T.rivulets(x, t, 0.8); T.tubRim(x, 6, t);
      T.stream(x, t, -1, 1.1); T.stream(x, t, 1, 1.1);
      x.restore();
      // the frog leaps out with its arms up, trailing a splash
      x.fillStyle = 'rgba(255,255,255,0.9)'; x.strokeStyle = 'rgba(40,120,170,0.7)'; x.lineWidth = 0.6;
      for (const [dx, dy, r] of [[-17, -6, 1.6], [-12, -12, 1.3], [16, -7, 1.6], [12, -13, 1.2], [-21, -1, 1.1], [21, -2, 1.1], [-5, -9, 1.0], [6, -10, 1.0]]) { x.beginPath(); x.ellipse(55 + dx, 58 + dy, r, r * 1.25, 0, 0, TAU); x.fill(); x.stroke(); }
      x.strokeStyle = '#ffffff'; x.lineWidth = 1.4; x.lineCap = 'round'; x.beginPath(); x.ellipse(55, 58, 15, 3.4, 0, Math.PI * 1.08, Math.PI * 1.92); x.stroke();
      ANI.draw(x, 'frog', 53, 53, 0.48, { t: 0, pose: 'cheer', expr: 'laugh', noShadow: true });
      // the idea
      x.save(); x.translate(74, 34); x.scale(0.56, 0.56); T.bulb(x, 0, 0, 1, 0.3); x.restore();
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
