var GAME_NAME = window.GAME_NAME || 'Q.E.D.!';
// title.js — the animated title painting (the engine draws Play at (180, 300), Cards at (180, 372) and the mute icon at
// (330, 30) on top). A sunny meadow by a lily pond: a frog hops across numbered lily pads, an octopus in the pond holds up
// brackets, penguins ride a seesaw, a duck shows off its dice, ants march by with the digits of pi, an owl in the tree
// holds a little chalkboard with x², a turtle with a triangle shell, and math symbols drift up into the sky.
// The sky, hills, tree, banks and grass are painted once into a 2x offscreen canvas; everything else moves.
const QED_TITLE = (() => {
  const W = 360, H = 640, TAU = Math.PI * 2, INK = '#3a1640';
  const FONT = s => `700 ${s}px Fredoka, Nunito, system-ui, sans-serif`;
  const hasAni = () => typeof ANI !== 'undefined';
  const an = (c, kind, x, y, s, o) => { if (!hasAni()) return null; try { return ANI.draw(c, kind, x, y, s, o); } catch (e) { console.error('title', kind, e); return null; } };

  // ---------- the static background (painted once at 2x) ----------
  const POND = { x: 236, y: 536, rx: 128, ry: 38 };
  const SEESAW = { x: 70, y: 591 };
  let bg = null;
  function paintBg(o) {
    P.sky(o, W, H, ['#5cb2ea', '#96d2f2', '#d6f0ee', '#fff0c4'], { x: 288, y: 96, r: 22, color: '#fff2c0', glow: 200 });
    // a soft glow behind the lettering
    const tg = o.createRadialGradient(180, 172, 10, 180, 172, 190); tg.addColorStop(0, 'rgba(255,252,236,0.5)'); tg.addColorStop(1, 'rgba(255,252,236,0)');
    o.save(); o.translate(180, 172); o.scale(1, 0.5); o.translate(-180, -172); o.fillStyle = tg; o.fillRect(-20, -30, 400, 400); o.restore();
    P.hills(o, W, 420, 46, '#a8d6b6', '#88bf98', { seed: 4, freq: 0.009, dabs: 24 });
    P.tree(o, 300, 418, 0.42, '#6aa65a', 9); P.tree(o, 338, 424, 0.34, '#6aa65a', 3);
    P.hills(o, W, 462, 26, '#9ad266', '#62a444', { seed: 7, freq: 0.012, dabs: 70, rim: '#e4f8b0' });
    P.grassTufts(o, W, 470, 500, 16, '#5f9e42', 21);
    P.tree(o, 30, 456, 1.0, '#5c9e48', 6);
    // the pond's bank: a damp earthy rim with a lit far edge
    o.save(); o.fillStyle = 'rgba(60,40,30,0.18)'; o.beginPath(); o.ellipse(POND.x + 2, POND.y + 4, POND.rx + 10, POND.ry + 9, 0, 0, TAU); o.fill();
    const bank = o.createLinearGradient(0, POND.y - POND.ry - 8, 0, POND.y + POND.ry + 8); bank.addColorStop(0, '#c9b88a'); bank.addColorStop(0.5, '#a89060'); bank.addColorStop(1, '#8a7448');
    o.fillStyle = bank; o.beginPath(); o.ellipse(POND.x, POND.y, POND.rx + 7, POND.ry + 6, 0, 0, TAU); o.fill(); o.restore();
    // reeds and cattails on both ends of the pond
    const reeds = (x, y, n, seed) => { const r = P.rng(seed); for (let i = 0; i < n; i++) { const rx = x + (r() - 0.5) * 22, h = 24 + r() * 22, lean = (r() - 0.5) * 8; o.strokeStyle = i % 2 ? '#4f8a3a' : '#6aa64a'; o.lineWidth = 2; o.lineCap = 'round'; o.beginPath(); o.moveTo(rx, y); o.quadraticCurveTo(rx + lean * 0.3, y - h * 0.6, rx + lean, y - h); o.stroke(); if (i % 3 === 0) { o.fillStyle = '#8a5432'; o.beginPath(); o.ellipse(rx + lean * 0.85, y - h * 0.85, 2.6, 6, lean * 0.03, 0, TAU); o.fill(); o.fillStyle = 'rgba(255,220,180,0.4)'; o.beginPath(); o.ellipse(rx + lean * 0.85 - 0.8, y - h * 0.88, 0.9, 3.5, 0, 0, TAU); o.fill(); } } };
    reeds(116, 528, 7, 3); reeds(352, 506, 6, 8);
    // the front strip of meadow
    P.hills(o, W, 606, 12, '#8ccc5a', '#5e9c40', { seed: 12, freq: 0.02, dabs: 60, rim: '#dcf4a4' });
    P.flowers(o, W, 610, 640, 16, ['#f4d35e', '#ee6c8a', '#ffffff', '#b98ae0'], 7);
    P.flowers(o, W, 466, 496, 10, ['#f4d35e', '#ffffff', '#ee6c8a'], 4);
    P.grassTufts(o, W, 604, 640, 26, '#5a9a3e', 5);
    // the seesaw's fulcrum: a wooden wedge with an = carved in it
    o.save(); o.translate(SEESAW.x, SEESAW.y);
    o.fillStyle = 'rgba(40,20,40,0.2)'; o.beginPath(); o.ellipse(2, 16, 22, 4, 0, 0, TAU); o.fill();
    const wg = o.createLinearGradient(-14, 0, 14, 0); wg.addColorStop(0, '#d49a5a'); wg.addColorStop(1, '#8a5a32');
    o.fillStyle = wg; o.strokeStyle = INK; o.lineWidth = 2; o.lineJoin = 'round'; o.beginPath(); o.moveTo(0, 0); o.lineTo(15, 16); o.lineTo(-15, 16); o.closePath(); o.fill(); o.stroke();
    o.strokeStyle = '#fff2d8'; o.lineWidth = 1.8; o.lineCap = 'round'; o.beginPath(); o.moveTo(-4, 9); o.lineTo(4, 9); o.moveTo(-4, 12.5); o.lineTo(4, 12.5); o.stroke();
    o.restore();
  }
  function background(c) {
    if (!bg) { bg = document.createElement('canvas'); bg.width = W * 2; bg.height = H * 2; const o = bg.getContext('2d'); o.scale(2, 2); paintBg(o); }
    c.drawImage(bg, 0, 0, W, H);
  }

  // ---------- drifting symbols ----------
  const SYM = ['+', '×', 'π', 'Σ', '√', '∫', '=', '÷', '∞', '7', '3', '−', '2', '%'];
  const DRIFT = SYM.map((s, i) => { const r = P.rng(i * 7 + 3); r(); return { s, x: 14 + ((i * 0.618) % 1) * 332, sp: 9 + r() * 7, off: r() * 600, size: 15 + r() * 11, ph: r() * 6 }; });
  function symbols(c, t) {
    c.save(); c.textAlign = 'center'; c.textBaseline = 'middle';
    for (const d of DRIFT) {
      const span = 400, q = ((t * d.sp + d.off) % span) / span, y = 470 - q * span, x = d.x + Math.sin(t * 0.7 + d.ph) * 9;
      const a = Math.min(1, q * 5, (1 - q) * 3) * 0.6; if (a <= 0.01) continue;
      c.globalAlpha = a; c.font = FONT(d.size); c.save(); c.translate(x, y); c.rotate(Math.sin(t * 0.9 + d.ph) * 0.2);
      c.fillStyle = 'rgba(58,22,64,0.25)'; c.fillText(d.s, 1.2, 1.8); c.fillStyle = '#fffaf0'; c.fillText(d.s, 0, 0); c.restore();
    }
    c.restore();
  }

  // ---------- props ----------
  function tile(c, txt, w = 22, fs = 17) {
    c.fillStyle = 'rgba(40,20,48,0.2)'; c.beginPath(); c.roundRect(-w / 2 + 1, -w / 2 + 2, w, w, 5); c.fill();
    c.fillStyle = '#fff6dc'; c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.roundRect(-w / 2, -w / 2, w, w, 5); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,214,120,0.6)'; c.fillRect(-w / 2 + 2, w / 2 - 5, w - 4, 3);
    c.fillStyle = INK; c.font = FONT(fs); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 0, 1);
  }
  const PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
  function die(c, x, y, s, n, rot) {
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
    c.fillStyle = '#e8d8e8'; c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.roundRect(-9, -9, 18, 18, 4.5); c.fill(); c.stroke();
    c.fillStyle = '#fffaf2'; c.beginPath(); c.roundRect(-8, -8.6, 15.4, 15, 4); c.fill();
    c.fillStyle = '#e8506a'; for (const [px, py] of PIPS[n]) { c.beginPath(); c.arc(px * 4.4 - 0.3, py * 4.4 - 0.8, 1.8, 0, TAU); c.fill(); }
    c.restore();
  }
  function chalkboard(c) {
    c.fillStyle = 'rgba(40,20,48,0.22)'; c.beginPath(); c.roundRect(-20, -13, 42, 30, 4); c.fill();
    const fg = c.createLinearGradient(-21, -15, 21, 15); fg.addColorStop(0, '#d8a466'); fg.addColorStop(1, '#94603a');
    c.fillStyle = fg; c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.roundRect(-21, -15, 42, 30, 4); c.fill(); c.stroke();
    c.fillStyle = '#2f5e4c'; c.beginPath(); c.roundRect(-17, -11, 34, 22, 2); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.08)'; c.beginPath(); c.ellipse(-6, -5, 12, 4, -0.2, 0, TAU); c.fill();
    c.fillStyle = 'rgba(248,252,240,0.95)'; c.font = FONT(17); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('x', -3, 1.5); c.font = FONT(11); c.fillText('2', 5.5, -4.5);
    c.fillStyle = '#fbfbf2'; c.fillRect(9, 9.5, 7, 2.2);
  }
  function lilyPad(c, x, y, n, t, i) {
    const by = y + Math.sin(t * 1.5 + i * 1.7) * 0.8;
    c.save(); c.translate(x, by);
    c.fillStyle = 'rgba(20,60,80,0.25)'; c.beginPath(); c.ellipse(1, 2, 19, 7, 0, 0, TAU); c.fill();
    const notch = 0.35 + i * 1.3;
    c.fillStyle = '#5aae4a'; c.strokeStyle = '#2e6a34'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(0, 0, 18, 6.6, 0, notch + 0.28, notch + TAU - 0.28); c.lineTo(0, 0); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = 'rgba(214,246,160,0.5)'; c.beginPath(); c.ellipse(-4, -1.8, 9, 2.4, 0, 0, TAU); c.fill();
    c.fillStyle = '#fff8e0'; c.strokeStyle = 'rgba(46,106,52,0.9)'; c.lineWidth = 2.4; c.font = FONT(15); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.save(); c.scale(1, 0.62); c.strokeText(String(n), 0, 0.5); c.fillText(String(n), 0, 0.5); c.restore();
    c.restore();
  }

  // ---------- the lettering ----------
  // Each glyph is painted once into its own sprite (a soft drop shadow, a deep plum extrusion, a thick outline, a warm
  // gradient fill and a glossy top), then the glyphs bob and sway on their own.
  const GLY = new Map();
  const FILLS = { letter: ['#fff8e2', '#ffd65e', '#ff9e3a'], dot: [['#ffb0bc', '#ff5a78', '#e03a5a'], ['#a8ecff', '#44b4f0', '#2a86d0'], ['#d4f6a0', '#78cc48', '#4a9e30']], bang: ['#ffe48a', '#ff9c4a', '#ff6a3a'] };
  function glyphSprite(ch, size, fill, k) {
    const key = ch + size + fill.join() + k; let g = GLY.get(key); if (g) return g;
    const m = document.createElement('canvas').getContext('2d'); m.font = FONT(size); const w = m.measureText(ch).width;
    const pad = size * 0.32, cw = w + pad * 2, ch2 = size * 1.6;
    g = document.createElement('canvas'); g.width = Math.ceil(cw * k); g.height = Math.ceil(ch2 * k); g.cw = cw; g.ch = ch2; g.ox = pad + w / 2; g.oy = ch2 * 0.48;
    const o = g.getContext('2d'); o.scale(k, k); o.translate(g.ox, g.oy); o.font = FONT(size); o.textAlign = 'center'; o.textBaseline = 'middle'; o.lineJoin = 'round';
    const lw = size * 0.2;
    o.save(); o.shadowColor = 'rgba(58,22,64,0.35)'; o.shadowBlur = size * 0.12; o.shadowOffsetY = size * 0.1; o.strokeStyle = INK; o.lineWidth = lw; o.strokeText(ch, size * 0.03, size * 0.09); o.restore();
    for (let i = 7; i >= 1; i--) { o.strokeStyle = o.fillStyle = i > 3 ? INK : '#5a2a66'; o.lineWidth = lw; o.strokeText(ch, i * size * 0.004, i * size * 0.012); o.fillText(ch, i * size * 0.004, i * size * 0.012); }
    o.strokeStyle = INK; o.lineWidth = lw; o.strokeText(ch, 0, 0);
    const fg = o.createLinearGradient(0, -size * 0.38, 0, size * 0.36); fg.addColorStop(0, fill[0]); fg.addColorStop(0.55, fill[1]); fg.addColorStop(1, fill[2]); o.fillStyle = fg; o.fillText(ch, 0, 0);
    o.save(); o.beginPath(); o.rect(-w, -size, w * 2, size * 0.66); o.clip(); o.globalAlpha = 0.45; o.fillStyle = '#ffffff'; o.fillText(ch, 0, 0); o.restore();
    o.save(); o.globalCompositeOperation = 'source-atop'; o.fillStyle = 'rgba(255,255,255,0.7)'; o.beginPath(); o.ellipse(-w * 0.2, -size * 0.27, w * 0.16, size * 0.05, -0.35, 0, TAU); o.fill(); o.restore();
    GLY.set(key, g); if (GLY.size > 40) GLY.delete(GLY.keys().next().value); return g;
  }
  function lettering(c, text, cx, cy, t) {
    const chars = [...text], m = c.measureText ? c : null; c.save(); c.font = FONT(100);
    const adv = chars.map(ch => c.measureText(ch).width * (ch === '.' ? 0.62 : 1)); const total100 = adv.reduce((a, b) => a + b, 0) + 6 * (chars.length - 1);
    const size = Math.max(40, Math.min(110, 100 * 300 / total100)), sc = size / 100;
    let k = 2; try { const tm = c.getTransform(); k = Math.min(4, Math.max(1, Math.ceil(Math.hypot(tm.a, tm.b) * 2) / 2)); } catch (e) { }
    let x = cx - total100 * sc / 2, di = 0;
    c.translate(cx, cy); c.rotate(-0.05); c.translate(-cx, -cy);
    chars.forEach((ch, i) => {
      const a = adv[i] * sc, gx = x + a / 2; x += a + 6 * sc;
      const fill = ch === '.' ? FILLS.dot[di++ % 3] : ch === '!' ? FILLS.bang : FILLS.letter, g = glyphSprite(ch, Math.round(size), fill, k);
      const bob = Math.sin(t * 2.6 - i * 0.55) * 3.2, rot = Math.sin(t * 2 - i * 0.7) * 0.04, pop = 1 + 0.07 * Math.pow(Math.max(0, Math.sin(t * 1.6 - i * 0.45)), 12);
      c.save(); c.translate(gx, cy + bob + size * 0.04); c.rotate(rot); c.scale(pop, pop); c.drawImage(g, -g.ox, -g.oy, g.cw, g.ch); c.restore();
    });
    // a twinkle on the first letter
    const tw = Math.pow(Math.max(0, Math.sin(t * 1.3)), 6);
    if (tw > 0.02) { const sx = cx - total100 * sc / 2 + adv[0] * sc * 0.22, sy = cy - size * 0.36; c.save(); c.translate(sx, sy); c.rotate(t); c.globalAlpha = tw; c.fillStyle = '#ffffff'; c.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 2 : 10 * (0.6 + tw * 0.4), a = i * Math.PI / 4; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); c.restore(); }
    c.restore();
  }

  // ---------- the scene ----------
  const PADS = [[146, 546, 1], [190, 521, 2], [236, 547, 4], [278, 521, 8]];
  const HOP = [0, 1, 2, 3, 2, 1];
  const PI_DIGITS = ['3', '.', '1', '4', '1', '5'];
  function draw(c, t) {
    background(c);
    // clouds drifting slowly
    for (const [x0, y, s, sp] of [[60, 108, 0.8, 3], [250, 226, 0.5, 4.2], [-80, 262, 0.42, 3.6]]) { const x = ((x0 + t * sp) % 520 + 520) % 520 - 80; P.cloud(c, x, y, s, '#ffffff', '#cfe0f2', 0.95); }
    symbols(c, t);
    // a songbird fluttering on the right
    an(c, 'bird', 318 + Math.sin(t * 0.8) * 10, 318 + Math.sin(t * 1.9) * 7, 0.72, { t, pose: 'cheer', expr: 'happy', facing: -1, phase: 2 });
    // the far meadow
    an(c, 'turtle', 80, 488, 0.64, { t, phase: 1, expr: Math.sin(t * 0.7) > 0.6 ? 'laugh' : 'happy' });
    an(c, 'rabbit', 206, 478, 0.6, { t, phase: 3, pose: 'wave', expr: 'happy', facing: -1 });
    an(c, 'fox', 336, 484, 0.62, { t, phase: 4, expr: 'happy', facing: -1, pose: Math.sin(t * 0.5) > 0.7 ? 'cheer' : 'idle' });
    // the pond
    c.save(); c.beginPath(); c.ellipse(POND.x, POND.y, POND.rx, POND.ry, 0, 0, TAU); c.clip();
    P.water(c, W, POND.y - POND.ry, POND.y + POND.ry, '#2f7fae', '#7cd0e2', t, { waves: 4 });
    c.strokeStyle = 'rgba(20,50,70,0.3)'; c.lineWidth = 8; c.beginPath(); c.ellipse(POND.x, POND.y + 3, POND.rx, POND.ry, 0, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
    c.restore();
    PADS.forEach(([x, y, n], i) => lilyPad(c, x, y, n, t, i));
    // the frog hops pad to pad (1, 2, 4, 8 and back)
    const seg = 1.25, T = t / seg, step = Math.floor(T), u = T - step, from = HOP[step % 6], to = HOP[(step + 1) % 6], hu = Math.max(0, (u - 0.45) / 0.55);
    const e = hu * hu * (3 - 2 * hu), fx = PADS[from][0] + (PADS[to][0] - PADS[from][0]) * e, fy = PADS[from][1] + (PADS[to][1] - PADS[from][1]) * e - Math.sin(hu * Math.PI) * 30;
    if (u < 0.4) { const q = u / 0.4; c.strokeStyle = `rgba(255,255,255,${0.7 * (1 - q)})`; c.lineWidth = 1.5; c.beginPath(); c.ellipse(PADS[from][0], PADS[from][1] + 1, 18 + q * 16, 6.5 + q * 6, 0, 0, TAU); c.stroke(); }
    an(c, 'frog', fx, fy - 1, 0.6, { t, pose: hu > 0 && hu < 1 ? 'hop' : 'idle', expr: hu > 0 && hu < 1 ? 'laugh' : 'happy', facing: PADS[to][0] >= PADS[from][0] ? 1 : -1 });
    // the octopus rises from the water holding up a pair of brackets
    const wl = 546 + Math.sin(t * 1.3) * 1.5, oy = 562 + Math.sin(t * 1.3 + 0.6) * 2.5, OX = 322;
    const oo = { t, pose: 'cheer', expr: Math.sin(t * 0.9) > 0.5 ? 'laugh' : 'happy', facing: -1, phase: 0.5 };
    c.save(); c.beginPath(); c.ellipse(POND.x, POND.y, POND.rx, POND.ry, 0, 0, TAU); c.clip(); c.beginPath(); c.rect(250, wl, 120, 60); c.clip(); c.globalAlpha = 0.32; an(c, 'octopus', OX, oy, 0.74, oo); c.restore();
    c.save(); c.beginPath(); c.rect(250, 380, 120, wl - 380); c.clip();
    const oc = an(c, 'octopus', OX, oy, 0.74, oo);
    c.restore();
    c.strokeStyle = 'rgba(255,255,255,0.65)'; c.lineWidth = 1.6; c.beginPath(); c.ellipse(OX, wl + 0.5, 20 + Math.sin(t * 2.6) * 1.5, 4.2, 0, 0, TAU); c.stroke();
    if (oc) { c.save(); c.font = FONT(24); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = 5; c.strokeStyle = INK; c.fillStyle = '#fff6dc';
      [[oc.hands[0], ')'], [oc.hands[1], '(']].forEach(([h, b], i) => { const x = h.x + (i ? -3 : 3), y = h.y - 9; c.strokeText(b, x, y); c.fillText(b, x, y); }); c.restore(); }
    // the owl in the tree with its chalkboard
    an(c, 'owl', 40, 352, 0.8, { t, pose: 'carry', expr: Math.sin(t * 0.8 + 1) > 0.75 ? 'think' : 'happy', phase: 1.3, hold: chalkboard });
    // penguins on the seesaw
    const tilt = Math.sin(t * 1.5) * 0.17, ex = Math.cos(tilt) * 46, ey = Math.sin(tilt) * 46;
    c.save(); c.translate(SEESAW.x, SEESAW.y); c.rotate(tilt);
    c.fillStyle = '#b87a44'; c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.roundRect(-54, -3.5, 108, 7, 3.5); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,230,190,0.6)'; c.fillRect(-50, -2.4, 100, 1.6);
    c.restore();
    an(c, 'penguin', SEESAW.x - ex, SEESAW.y - ey - 3, 0.6, { t, phase: 0, pose: tilt > 0.05 ? 'cheer' : 'idle', expr: tilt > 0.05 ? 'laugh' : 'happy' });
    an(c, 'penguin', SEESAW.x + ex, SEESAW.y + ey - 3, 0.6, { t, phase: 2, pose: tilt < -0.05 ? 'cheer' : 'idle', expr: tilt < -0.05 ? 'laugh' : 'happy', facing: -1, tint: '#3c5a8a' });
    // the duck shows off its dice
    die(c, 200, 611, 1, 3, 0.2);
    const roll = Math.floor(t / 1.6) % 6 + 1;
    an(c, 'duck', 168, 616, 0.82, { t, phase: 0.7, pose: 'carry', expr: (t / 1.6) % 1 < 0.3 ? 'wow' : 'happy', hold: cc => die(cc, 0, 2, 1.1, roll, Math.sin(t * 3) * 0.12) });
    // hedgehog and beaver at the front
    an(c, 'hedgehog', 252, 620, 0.66, { t, phase: 2.2, pose: 'wave', expr: 'laugh' });
    an(c, 'beaver', 318, 618, 0.8, { t, phase: 3.1, pose: 'point', expr: 'happy', facing: -1 });
    // ants marching by with the digits of pi
    PI_DIGITS.forEach((d, i) => { const x = ((t * 15 + i * 30) % 560 + 560) % 560 - 100, step2 = Math.abs(Math.sin(t * 9 + i)) * 1.2;
      an(c, 'ant', x, 638 - step2, 0.66, { t, phase: i * 0.9, pose: 'carry', expr: 'happy', hold: cc => tile(cc, d, 22, d === '.' ? 20 : 17) }); });
    lettering(c, typeof GAME_NAME !== 'undefined' ? GAME_NAME : 'Q.E.D.!', 180, 168, t);
  }
  return { draw };
})();
function PANEL_TITLE(c, t) { QED_TITLE.draw(c, t); }
