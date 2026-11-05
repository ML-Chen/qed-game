// DIG DEEPER! (problems PS-16) — a garden seen in cross-section: weeds stick up out of the lawn, and their roots run
// down through the layers of soil. Tap the soil under a weed to dig down one layer at a time; the hole shows the root
// going deeper until its fat bulb, the root cause, is uncovered. Then swipe the weed up and it all comes out, root and
// all. Swipe it up before you reach the root and the weed snaps off at the ground and grows straight back. Two weeds at
// level 0 and 1 (deeper at 1); at level 2, three weeds, one with two roots (dig down on both sides of it).
// The idea: asking "why?" again and again digs from the problem you see down to its root cause; fix that, not the leaves.
const TAU = Math.PI * 2;
const SURF = 300, LAYER = 66, LCOL = ['#8a5a3a', '#a8683a', '#8a7a68', '#5a3a2a', '#463030'], HW = 26;
function paintGarden(o) {
  P.sky(o, 360, 640, ['#6ab8e8', '#b8e2f2', '#fff2cc']);
  P.cloud(o, 90, 150, 0.6); P.cloud(o, 280, 128, 0.45);
  P.hills(o, 360, 268, 20, '#a8d878', '#7ab050', { seed: 5 });
  o.fillStyle = '#c8a070'; for (let x = 4; x < 360; x += 22) { o.fillRect(x, 238, 8, 56); o.beginPath(); o.moveTo(x, 238); o.lineTo(x + 4, 230); o.lineTo(x + 8, 238); o.fill(); } o.fillRect(0, 252, 360, 6); o.fillRect(0, 276, 360, 6);
  // soil layers in cross-section, each with its own texture
  const rnd = P.rng(4);
  for (let i = 0; i < LCOL.length; i++) { const y = SURF + i * LAYER; o.fillStyle = LCOL[i]; o.fillRect(0, y, 360, i === LCOL.length - 1 ? 640 - y : LAYER + 1);
    for (let k = 0; k < 60; k++) { o.fillStyle = rnd() < 0.5 ? 'rgba(255,230,190,0.12)' : 'rgba(30,10,0,0.18)'; o.beginPath(); o.ellipse(rnd() * 360, y + 4 + rnd() * (LAYER - 8), 1.5 + rnd() * (i === 2 ? 5 : 2.5), 1 + rnd() * (i === 2 ? 4 : 1.5), rnd() * 3, 0, TAU); o.fill(); }
    o.strokeStyle = 'rgba(30,10,0,0.25)'; o.lineWidth = 2; o.beginPath(); for (let x = 0; x <= 360; x += 12) o.lineTo(x, y + Math.sin(x * 0.07 + i) * 2); o.stroke(); }
  // a worm and a couple of stones
  o.strokeStyle = '#e8908a'; o.lineWidth = 5; o.lineCap = 'round'; o.beginPath(); o.moveTo(310, 352); o.quadraticCurveTo(320, 344, 330, 352); o.quadraticCurveTo(340, 360, 348, 352); o.stroke();
  for (const [x, y] of [[40, 470], [330, 520]]) P.rock(o, x, y, 0.5);
  // the lawn on top
  o.fillStyle = '#6ab84a'; o.fillRect(0, SURF - 8, 360, 12); for (let x = 0; x < 360; x += 5) { o.fillStyle = x % 10 ? '#5aa83a' : '#8ad85a'; o.beginPath(); o.moveTo(x, SURF); o.lineTo(x + 2, SURF - 12 - (x * 7) % 6); o.lineTo(x + 4, SURF); o.fill(); }
  P.grain(o, 360, 640, 0.035); P.vignette(o, 360, 640, 0.22);
}
function weedTop(c, x, t, size, snapK) { // the leaves above ground; size 0..1 regrows after a snap
  if (size <= 0.02) return; c.save(); c.translate(x, SURF - 2); c.scale(size * 1.2, size * 1.2); const sw = Math.sin(t * 2 + x) * 0.06; c.rotate(sw);
  c.strokeStyle = '#3a7a2a'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -64); c.stroke();
  for (const [ly, sd, L] of [[-18, -1, 30], [-30, 1, 34], [-44, -1, 28], [-54, 1, 24]]) { c.save(); c.translate(0, ly); c.rotate(sd * 0.9); c.fillStyle = '#4ab83a'; c.strokeStyle = '#2a6a1a'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 0); for (let k = 1; k <= 4; k++) c.lineTo(sd * (k * L / 4), -6 - (k % 2) * 5); c.lineTo(sd * L, 0); for (let k = 3; k >= 1; k--) c.lineTo(sd * (k * L / 4), 5 + (k % 2) * 3); c.closePath(); c.fill(); c.stroke(); c.restore(); }
  c.fillStyle = '#f6c445'; for (let i = 0; i < 6; i++) { c.beginPath(); c.ellipse(Math.cos(i) * 7, -68 + Math.sin(i) * 7, 5, 3, i, 0, TAU); c.fill(); } c.fillStyle = '#e8803a'; c.beginPath(); c.arc(0, -68, 4, 0, TAU); c.fill();
  c.restore();
}
function rootPath(c, x0, depth, dx) { const y1 = SURF + depth * LAYER - 22; c.beginPath(); c.moveTo(x0, SURF); c.bezierCurveTo(x0 + 10 + dx * 0.3, SURF + (y1 - SURF) * 0.3, x0 - 10 + dx * 0.8, SURF + (y1 - SURF) * 0.7, x0 + dx, y1); return [x0 + dx, y1]; }
function root(c, x0, depth, dx, t, glow) {
  c.strokeStyle = '#c89a6a'; c.lineWidth = 6; c.lineCap = 'round'; const [bx, by] = rootPath(c, x0, depth, dx); c.stroke();
  c.strokeStyle = '#a87a4a'; c.lineWidth = 2; for (let i = 1; i < depth * 3; i++) { const y = SURF + i * 18, sx = x0 + dx * (i / (depth * 3)); c.beginPath(); c.moveTo(sx, y); c.lineTo(sx + (i % 2 ? 12 : -12), y + 8); c.stroke(); }
  if (glow) { c.save(); c.globalCompositeOperation = 'lighter'; const gg = c.createRadialGradient(bx, by + 4, 2, bx, by + 4, 34); gg.addColorStop(0, 'rgba(255,220,120,0.6)'); gg.addColorStop(1, 'rgba(255,220,120,0)'); c.fillStyle = gg; c.beginPath(); c.arc(bx, by + 4, 34, 0, TAU); c.fill(); c.restore(); }
  SK.ball(c, bx, by + 6, 15, '#e8803a');
}
const ready = w => w.cols.every(q => q.dug >= q.depth);
MG.add({
  id: 'digdeeper', stage: 'problems', cmd: 'DIG TO THE ROOT, THEN PULL!', time: 9, mood: 'party', winText: 'Root and all!', failText: 'The weeds stayed!',
  card: { title: 'Find the root cause', kind: 'Problem solving', ref: 'Root cause analysis ("5 whys")',
    text: 'The leaves you can see are the problem, like late deliveries. Pulling only the leaves let the weed grow straight back, because the root was still in the ground.\n\nDigging down one layer at a time is like asking "why?" again and again. Why are deliveries late? The truck breaks down. Why? Nobody services it. Each answer takes you a layer deeper, until you reach the root cause.\n\nFix the root cause and the problem goes away for good. Some problems have two roots, and you need to find both.',
    note: 'Keep asking "why?" until you reach the root cause, and fix that instead of the problem on top.' },
  init(g) {
    const s = g.s, v = SK.variant(g, 4), L = Math.min(2, g.level), xs = L >= 2 ? [56, 164, 272] : [[100, 260], [86, 250], [120, 276], [96, 236]][v];
    const depths = [[2, 3], [3, 3], [2, 3, 4]][L], two = L >= 2 ? v % 3 : -1, order = SK.shuffled(g, depths.map((_, i) => i));
    s.weeds = xs.map((x, i) => { const d = depths[order[i]]; return { x, cols: i === two ? [{ dx: -HW, depth: d, dug: 0 }, { dx: HW, depth: d, dug: 0 }] : [{ dx: 0, depth: d, dug: 0 }], size: 1, st: 'in', at: -9 }; });
    s.pulled = 0; s.dirt = [];
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return; SK.dragStart(g, null, x, y); s.dn = { x, y, t: g.t };
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g, x, y) {
    const s = g.s, d = SK.dragEnd(g), dn = s.dn; s.dn = null; if (!d || !dn || g.done) return;
    const dy = y - dn.y, dx = x - dn.x;
    if (dy < -50 && Math.abs(dy) > Math.abs(dx)) { // a swipe up on a weed: pull it
      const w = s.weeds.find(q => q.st === 'in' && Math.abs(dn.x - q.x) < 50 && dn.y < SURF + 40 && dn.y > SURF - 110); if (!w) return;
      if (ready(w)) { w.st = 'out'; w.at = g.t; s.pulled++; g.sfx('stretch'); g.sfx('pop'); g.burst(w.x, SURF, ['#8a5a3a', '#6ab84a'], 14, 160); if (s.pulled >= s.weeds.length) { g.win(); g.sfx('cheer'); } }
      else { w.size = 0; w.at = g.t; w.snaps = (w.snaps || 0) + 1; g.sfx('snap'); g.sfx('laugh'); }
      return;
    }
    if (Math.hypot(dx, dy) > 30) return;
    // a tap in the soil under a weed: dig that column one layer deeper
    if (dn.y < SURF - 6) return; let best = null, bd = 46;
    for (const w of s.weeds) { if (w.st !== 'in') continue; for (const q of w.cols) { if (q.dug >= q.depth) continue; const cx = w.x + q.dx, dd = Math.abs(dn.x - cx); if (dd < bd && dn.y < SURF + (q.dug + 1) * LAYER + 50) { bd = dd; best = [w, q]; } } }
    if (!best) { g.sfx('thud'); return; } const [w, q] = best; q.dug++; q.at = g.t; g.sfx('crunch'); g.burst(w.x + q.dx, SURF + q.dug * LAYER - 20, [LCOL[q.dug - 1], '#fff6ea'], 8, 120); s.dirt.push({ x: w.x + q.dx + (q.dx < 0 ? -40 : 40), t: g.t, col: LCOL[q.dug - 1] });
    if (ready(w)) g.sfx('chime');
  },
  update(g, dt) { for (const w of g.s.weeds) if (w.st === 'in' && w.size < 1) w.size = Math.min(1, w.size + dt * 1.6); },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('digdeeper', paintGarden), 0, 0, 360, 640);
    // dirt piles beside the holes
    for (const d of s.dirt) { const k = SK.clamp((t - d.t) / 0.2, 0, 1); c.fillStyle = d.col; c.beginPath(); c.ellipse(d.x, SURF - 2, 14 * k, 7 * k, 0, Math.PI, 0); c.fill(); }
    for (const w of s.weeds) {
      // the holes, and the root inside them (only what you have dug down to shows; a faint outline below at level 0)
      const out = w.st === 'out', ok = ready(w), lift = out ? SK.easeInOut((t - w.at) / 0.5) : 0;
      for (const q of w.cols) { const cx = w.x + q.dx, hd = q.dug * LAYER; if (hd > 0) { c.fillStyle = '#2a1810'; c.beginPath(); c.roundRect(cx - 24, SURF - 2, 48, hd + 2, [4, 4, 18, 18]); c.fill(); c.strokeStyle = 'rgba(255,220,180,0.25)'; c.lineWidth = 2; c.stroke(); } }
      if (out && lift >= 1) continue;
      c.save(); c.translate(0, -lift * 260);
      for (const q of w.cols) { const cx = w.x + q.dx; c.save(); if (!out) { c.beginPath(); c.roundRect(cx - 24, SURF - 2, 48, q.dug * LAYER + 2, [4, 4, 18, 18]); c.clip(); } root(c, w.x, q.depth, q.dx, t, ok && !out); c.restore();
        if (g.level === 0 && !out) { c.save(); c.globalAlpha = 0.28; c.setLineDash([5, 6]); c.strokeStyle = '#fff6ea'; c.lineWidth = 3; rootPath(c, w.x, q.depth, q.dx); c.stroke(); c.restore(); } }
      weedTop(c, w.x, t, w.size, 0);
      c.restore();
      if (w.st === 'in' && w.size < 1 && t - w.at < 0.8) SK.tag(c, 'Grew back!', w.x, SURF - 140, 18, '#ffd0d0');
      if (w.st === 'in' && ok) for (const q of w.cols) SK.tag(c, 'Root cause', SK.clamp(w.x + q.dx * 2.6, 64, 296), SURF + q.depth * LAYER + 20, 18, '#ffe9a0');
    }
    const first = s.weeds.find(w => w.st === 'in'); if (first && !g.done && !s.pulled) SK.tag(c, 'Problem', first.x, SURF - 104, 18);
    SK.animal(c, 'beaver', 334, SURF - 4, 0.7, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'think', facing: -1 });
    G2.count(c, 60, 44, s.pulled, s.weeds.length);
    // guidance: dig the next column of the first weed still in, then swipe it up once its root is uncovered
    const w = !g.done ? s.weeds.find(q => q.st === 'in') : null;
    if (w && w.size >= 1) { if (ready(w)) { const p0 = [w.x, SURF - 30], p1 = [w.x, SURF - 140]; SK.glow(c, g, w.x, SURF - 40, 36); if (g.level <= 1 || G2.vis(g) > 0) { c.save(); c.translate(w.x + 40, SURF - 70); c.fillStyle = '#ffd45a'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -26); c.lineTo(14, -6); c.lineTo(5, -6); c.lineTo(5, 20); c.lineTo(-5, 20); c.lineTo(-5, -6); c.lineTo(-14, -6); c.closePath(); c.fill(); c.stroke(); c.restore(); } SK.demo(g, c, 'swipe', p0, p1); }
      else { const q = w.cols.find(z => z.dug < z.depth), cx = w.x + q.dx, cy = SURF + q.dug * LAYER + LAYER / 2; SK.glow(c, g, cx, cy, 28); SK.demo(g, c, 'tap', [cx, cy]); } }
    else SK.demo(g, c, 'tap', [0, 0], null, { never: true });
  },
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < 1.0) return; const w = s.weeds.find(q => q.st === 'in'); if (!w || w.size < 1) return;
    s._n = s._n || 0; s._at = s._at || 1.0; if (g.t < s._at) return;
    if (s._sw) { if (SK.bot.drag(g, synth, 'sw' + s._n, s._sw, [w.x, SURF - 30], [w.x, SURF - 140], 0.15)) { s._sw = 0; s._n++; s._at = g.t + 0.25; } return; }
    if (ready(w)) { s._sw = g.t; return; }
    const q = w.cols.find(z => z.dug < z.depth); synth('down', w.x + q.dx, SURF + q.dug * LAYER + LAYER / 2); synth('up', w.x + q.dx, SURF + q.dug * LAYER + LAYER / 2); s._at = g.t + (g.level >= 2 ? 0.28 : 0.4);
  },
});
