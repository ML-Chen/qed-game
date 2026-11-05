// ROLL DOWN! (cs AI-06) — gradient descent. A penguin sits on a snowy hill in thick fog; the hill's height is the
// model's error, shown on the gauge at the top. Only the slope right under the penguin shows through the fog. Tap on the
// downhill side to nudge it one step that way, again and again, until the error reaches the green zone at the bottom of
// the valley; the fog lifts. Push uphill and the gauge climbs into the red. Level 2: a shallow valley that is a trap.
const GY0 = 588, GH = 300, GAUGE = { x0: 44, x1: 316, y: 158 };
function errAt(s, k) { // the error landscape, at step position k (fractional between steps)
  if (s.L === 2) return 0.62 - 0.56 * Math.exp(-(((k - 3) / 1.5) ** 2)) - 0.30 * Math.exp(-(((k + 2.5) / 1.2) ** 2)) + 0.012 * k * k;
  const d = (k - s.kmin) / 5; return s.a * d * d + 0.05 + 0.025 * Math.sin(k * 1.7 + s.ph) * Math.min(1, Math.abs(k - s.kmin));
}
const xAt = (s, k) => 180 + k * s.dx, yAt = (s, k) => GY0 - errAt(s, k) * GH;
function paintSnow(o, s) {
  const sk = o.createLinearGradient(0, 0, 0, 640); sk.addColorStop(0, '#3a4a8a'); sk.addColorStop(0.5, '#6a7ac0'); sk.addColorStop(1, '#9aa8d8'); o.fillStyle = sk; o.fillRect(0, 0, 360, 640);
  // far mountains
  o.fillStyle = '#5a68a8'; o.beginPath(); o.moveTo(0, 330); for (let x = 0; x <= 360; x += 30) o.lineTo(x, 300 - Math.abs(Math.sin(x * 0.02 + 1)) * 80); o.lineTo(360, 640); o.lineTo(0, 640); o.fill();
  // the hill: the error landscape, snow on top
  o.beginPath(); o.moveTo(0, 640); for (let x = 0; x <= 360; x += 3) { const k = (x - 180) / s.dx; o.lineTo(x, yAt(s, k)); } o.lineTo(360, 640); o.closePath();
  const hg = o.createLinearGradient(0, 250, 0, 640); hg.addColorStop(0, '#ffffff'); hg.addColorStop(1, '#cfdcf0'); o.fillStyle = hg; o.fill();
  o.strokeStyle = '#2a3a7a'; o.lineWidth = 4; o.beginPath(); for (let x = 0; x <= 360; x += 3) { const k = (x - 180) / s.dx; x ? o.lineTo(x, yAt(s, k)) : o.moveTo(x, yAt(s, k)); } o.stroke();
  // little step marks along the slope, where a nudge can land
  for (let k = -8; k <= 8; k++) { const x = xAt(s, k); if (x < 8 || x > 352) continue; o.fillStyle = 'rgba(120,140,190,0.55)'; o.beginPath(); o.arc(x, yAt(s, k) + 6, 2.5, 0, 7); o.fill(); }
  const rnd = P.rng(12); for (let i = 0; i < 60; i++) { const x = rnd() * 360, k = (x - 180) / s.dx, y = yAt(s, k) + 12 + rnd() * 120; o.fillStyle = `rgba(150,170,220,${0.2 + rnd() * 0.3})`; o.beginPath(); o.ellipse(x, y, 8 + rnd() * 14, 2 + rnd() * 2, 0, 0, 7); o.fill(); }
}
MG.add({
  id: 'cs_rolldown', stage: 'ai', cmd: 'ROLL DOWN!', time: 6, mood: 'night', winText: 'Descent!', failText: 'Uphill!',
  card: { title: 'Learning by going downhill', kind: 'Artificial intelligence', ref: 'Gradient descent',
    text: 'A model learns by changing its settings, called weights, to make its error smaller. Picture every possible setting as a spot on a hilly landscape, where height is the error.\n\nThe model cannot see the whole landscape. It can only feel the slope right where it stands. So it takes a small step downhill, feels the slope again, and takes another step. That is gradient descent.\n\nIt can get stuck in a small valley that is not the lowest one. Real training uses tricks, like starting in several places, to find a better valley.',
    note: 'Gradient descent: feel the slope where you are, step downhill, and repeat until the error stops falling.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.L = L; s.ph = g.rand() * 6;
    if (L === 2) { s.dx = 30; s.k = -1; s.kmin = 3; s.target = 0.2; s.red = 0.8; s.fogR = 62; }
    else { s.dx = 26; s.kmin = L ? (g.rand() < 0.5 ? -1 : 1) : 0; s.a = L ? 0.6 : 0.85; const side = g.rand() < 0.5 ? -1 : 1; s.k = s.kmin + side * (L ? 5 : 4); s.target = errAt(s, s.kmin) + 0.03; s.red = 0.95; s.fogR = 76; }
    s.anim = null; s.res = null; s.trail = [];
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.anim) return; const px = xAt(s, s.k);
    if (Math.abs(x - px) < 10 || y < 200) return; const dir = x < px ? -1 : 1;
    s.anim = { from: s.k, to: s.k + dir, t0: g.t }; s.trail.push(s.k); g.sfx(errAt(s, s.k + dir) < errAt(s, s.k) ? 'swoosh' : 'stretch'); s.tapX = x; s.tapT = g.t;
  },
  update(g, dt) {
    const s = g.s, a = s.anim; if (!a || g.done) return;
    if (g.t - a.t0 >= 0.28) {
      s.k = a.to; s.anim = null; const e = errAt(s, s.k);
      if (e <= s.target) { s.res = { t: g.t, win: true }; g.win(); g.sfx('cheer'); g.burst(xAt(s, s.k), yAt(s, s.k) - 30, ['#7ee8a0', '#ffd45a', '#fff'], 20, 150); }
      else if (e >= s.red || xAt(s, s.k) < 0 || xAt(s, s.k) > 360) { s.res = { t: g.t, win: false }; g.fail(); g.sfx('thud'); g.shake(4, 0.25); }
      else g.sfx('tap');
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t;
    c.drawImage(g.bake('cs_rolldown' + s.L + '_' + s.kmin + '_' + Math.round(s.ph * 10), o => paintSnow(o, s)), 0, 0, 360, 640);
    // where the penguin is: between two steps while it slides
    let kk = s.k; if (s.anim) kk = SK.lerp(s.anim.from, s.anim.to, SK.easeInOut((t - s.anim.t0) / 0.28));
    if (s.res && !s.res.win) kk = s.k + Math.sign(s.k - s.kmin) * Math.min(1.5, (t - s.res.t) * 3) * -0.6; // it skids back a little
    const px = xAt(s, kk), py = yAt(s, kk), slope = (yAt(s, kk + 0.05) - yAt(s, kk - 0.05)) / (0.1 * s.dx);
    // footprints of past steps
    for (const k of s.trail) { c.fillStyle = 'rgba(90,110,160,0.35)'; c.beginPath(); c.ellipse(xAt(s, k), yAt(s, k) + 3, 5, 2.5, 0, 0, 7); c.fill(); }
    // the penguin, leaning with the slope
    const won = s.res && s.res.win, lost = s.res && !s.res.win;
    c.save(); c.translate(px, py + 2); c.rotate(Math.atan(slope) * 0.7 + (lost ? Math.sin(t * 14) * 0.3 : 0));
    SK.animal(c, 'penguin', 0, 0, 0.7, { t, pose: won ? 'cheer' : lost ? 'balance' : s.anim ? 'hop' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
    c.restore();
    // the fog: everything but a small window round the penguin, lifting at the end
    const lift = s.res ? Math.min(1, (t - s.res.t) * 1.2) : 0, R = s.fogR + lift * 500;
    c.save(); const fg = c.createRadialGradient(px, py - 20, R * 0.55, px, py - 20, R * 1.25); fg.addColorStop(0, 'rgba(206,214,236,0)'); fg.addColorStop(1, `rgba(206,214,236,${0.97 * (1 - lift)})`);
    c.fillStyle = fg; c.fillRect(0, 196, 360, 444); c.restore();
    for (let i = 0; i < 5; i++) { const fx = ((t * 12 + i * 90) % 460) - 50, fy = 300 + i * 60; c.fillStyle = `rgba(255,255,255,${0.18 * (1 - lift)})`; c.beginPath(); c.ellipse(fx, fy, 70, 16, 0, 0, 7); c.fill(); }
    // the error gauge: green at the low end, red at the high end, the penguin's marker sliding along it
    const G = GAUGE, gw = G.x1 - G.x0, e = errAt(s, kk), ex = G.x0 + Math.min(1, e) * gw;
    c.save(); c.fillStyle = 'rgba(30,20,60,0.6)'; c.beginPath(); c.roundRect(G.x0 - 14, G.y - 20, gw + 28, 40, 20); c.fill();
    const gr = c.createLinearGradient(G.x0, 0, G.x1, 0); gr.addColorStop(0, '#5ad88a'); gr.addColorStop(0.5, '#ffd45a'); gr.addColorStop(1, '#ff5a6a'); c.fillStyle = gr; c.beginPath(); c.roundRect(G.x0, G.y - 8, gw, 16, 8); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.9)'; c.fillRect(G.x0 + s.target * gw, G.y - 13, 3, 26); c.fillRect(G.x0 + s.red * gw, G.y - 13, 3, 26);
    c.fillStyle = 'rgba(40,140,80,0.5)'; c.beginPath(); c.roundRect(G.x0, G.y - 8, s.target * gw, 16, 8); c.fill();
    c.fillStyle = '#fff'; c.strokeStyle = '#2a2040'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(ex, G.y + 4); c.lineTo(ex - 9, G.y - 16); c.lineTo(ex + 9, G.y - 16); c.closePath(); c.fill(); c.stroke();
    c.restore();
    // a tap ripple
    if (s.tapT && t - s.tapT < 0.3) { const q = (t - s.tapT) / 0.3; c.save(); c.globalAlpha = 1 - q; c.strokeStyle = '#fff'; c.lineWidth = 3; c.beginPath(); c.arc(s.tapX, py - 20, 10 + q * 24, 0, 7); c.stroke(); c.restore(); }
    // guidance: a pulsing arrow on the downhill side (levels 0 and 1); the ghost hand taps it
    const down = s.L === 2 ? (s.kmin > s.k ? 1 : -1) : errAt(s, s.k - 1) < errAt(s, s.k + 1) ? -1 : 1; // at level 2 the hand points the way to the deep valley
    if (!g.done && !s.anim && g.level <= 1) { const ax = xAt(s, s.k) + down * 48, ay = yAt(s, s.k) - 30, p = 0.5 + 0.5 * Math.sin(t * 6); c.save(); c.globalAlpha = 0.5 + 0.4 * p; c.fillStyle = '#ffd45a'; c.strokeStyle = '#6a4a10'; c.lineWidth = 2; c.translate(ax + down * p * 4, ay); c.scale(down, 1); c.beginPath(); c.moveTo(-10, -9); c.lineTo(6, -9); c.lineTo(6, -16); c.lineTo(18, 0); c.lineTo(6, 16); c.lineTo(6, 9); c.lineTo(-10, 9); c.closePath(); c.fill(); c.stroke(); c.restore(); }
    SK.demo(g, c, 'tap', [xAt(s, s.k) + down * 52, yAt(s, s.k) - 30]);
  },
  // the bot steps toward the deepest valley (B7FAIL: steps uphill)
  auto(g, dt, synth) {
    const s = g.s; if (g.done || s.anim || g.t < (s.nb || 0.9)) return; s.nb = g.t + 0.38;
    const fail = typeof window !== 'undefined' && window.B7FAIL, dir = (s.kmin > s.k ? 1 : -1) * (fail ? -1 : 1), x = xAt(s, s.k) + dir * 50;
    synth('down', x, yAt(s, s.k) - 30); synth('up', x, yAt(s, s.k) - 30);
  },
});
