// SQUASH BEETLES! (problems PS-01) — an app on a big phone screen, shaking with crashes. Bugs crawl over it: a couple
// of big beetles and a swarm of tiny ants. You only have a few squashes (the mallets at the bottom). Squash the big
// beetles: they cause most of the crashing, so the shaking almost stops (the 80/20 rule). Spend the squashes on ants and
// the screen keeps shaking until the hedgehog's coffee spills.
const TAU = Math.PI * 2, SCR = { l: 34, r: 326, t: 146, b: 500 };
const LV = [{ beetles: 2, ants: 20, hits: 3, sp: 70 }, { beetles: 2, ants: 22, hits: 3, sp: 85, duck: true }, { beetles: 3, ants: 22, hits: 3, sp: 95, hide: true, duck: true }];
// level 1+: beetles duck under the app's tiles now and then (no squashing them while they hide)
function hidden(g, b) { return g.s.L.duck && b.big && !b.dead && Math.sin(g.t * 1.3 + b.ph * 3) > 0.45; }
function paintDesk(o) {
  const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#5ab0e0'); bg.addColorStop(1, '#b8e2f2'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  o.fillStyle = 'rgba(255,255,255,0.16)'; for (let i = 0; i < 8; i++) { o.beginPath(); o.arc(30 + i * 48, 40 + (i % 3) * 30, 18 + (i % 2) * 10, 0, TAU); o.fill(); }
  B9.wood(o, 0, 540, 360, 100, '#c08a52', 5); o.fillStyle = 'rgba(40,20,10,0.3)'; o.fillRect(0, 538, 360, 5);
  P.grain(o, 360, 640, 0.04);
}
// four apps (one per variant): a shop, a music player, a weather app and a photo grid, each with its own colours and layout
const THEMES = [
  { head: '#ff8a5a', bg: '#fff6ea', cols: ['#ffd45a', '#8ad0a0', '#a8c8f0', '#f0a8c8'], grid: [2, 3] },
  { head: '#7a5ad8', bg: '#f4f0ff', cols: ['#c8b8f8', '#f8b8d8', '#b8e0f8', '#f8e0a8'], grid: [1, 5] },
  { head: '#3aa0d8', bg: '#eef8ff', cols: ['#ffe27a', '#bfe8ff', '#d8f0c8', '#ffd0b0'], grid: [2, 2] },
  { head: '#4ab070', bg: '#f2fff4', cols: ['#f0a8a8', '#a8d8f0', '#f0d8a0', '#c8a8f0'], grid: [3, 4] },
];
function paintApp(o, th) { // the app on the screen
  o.fillStyle = th.bg; o.beginPath(); o.roundRect(SCR.l, SCR.t, SCR.r - SCR.l, SCR.b - SCR.t, 14); o.fill();
  o.fillStyle = th.head; o.beginPath(); o.roundRect(SCR.l, SCR.t, SCR.r - SCR.l, 46, [14, 14, 0, 0]); o.fill();
  const [nc, nr] = th.grid, W = (SCR.r - SCR.l - 14 * (nc + 1)) / nc, Hh = (SCR.b - SCR.t - 60 - 12 * nr) / nr;
  for (let r = 0; r < nr; r++) for (let k = 0; k < nc; k++) { const x = SCR.l + 14 + k * (W + 14), y = SCR.t + 58 + r * (Hh + 12); o.fillStyle = th.cols[(r * nc + k) % 4]; o.beginPath(); o.roundRect(x, y, W, Hh, 10); o.fill(); o.fillStyle = 'rgba(255,255,255,0.7)'; o.fillRect(x + 10, y + Hh - 22, Math.min(70, W - 20), 9); o.beginPath(); o.arc(x + (nc === 1 ? 26 : W / 2), y + (nc === 1 ? Hh / 2 : Hh * 0.38), Math.min(18, Hh * 0.28), 0, TAU); o.fill(); }
}
function beetle(c, x, y, a, t, ph, sq) {
  c.save(); c.translate(x, y); c.rotate(a); if (sq) c.scale(1.4, 0.35);
  c.strokeStyle = '#2a1424'; c.lineWidth = 3; c.lineCap = 'round';
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = Math.sin(t * 16 + ph + i * 2) * 4; c.beginPath(); c.moveTo(-8 + i * 9, s * 10); c.lineTo(-10 + i * 10 + w, s * 24); c.stroke(); }
  c.fillStyle = '#2a1830'; c.beginPath(); c.ellipse(16, 0, 9, 8, 0, 0, TAU); c.fill();
  const gr = c.createLinearGradient(-20, -16, 10, 16); gr.addColorStop(0, '#6ad0a0'); gr.addColorStop(1, '#1a6a5a'); c.fillStyle = gr; c.beginPath(); c.ellipse(-4, 0, 22, 17, 0, 0, TAU); c.fill();
  c.strokeStyle = '#0a3a30'; c.lineWidth = 2; c.beginPath(); c.moveTo(18, 0); c.lineTo(-26, 0); c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(-8, -8, 8, 3, -0.3, 0, TAU); c.fill();
  c.strokeStyle = '#2a1424'; c.lineWidth = 2; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(22, s * 4); c.quadraticCurveTo(32, s * 8, 34, s * 14); c.stroke(); }
  c.fillStyle = '#ff5a5a'; for (const s of [-1, 1]) { c.beginPath(); c.arc(19, s * 4, 2.2, 0, TAU); c.fill(); }
  c.restore();
}
function ant(c, x, y, a, t, ph, sq) {
  c.save(); c.translate(x, y); c.rotate(a); if (sq) c.scale(1.4, 0.3);
  c.strokeStyle = '#3a1a1a'; c.lineWidth = 1.4; for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = Math.sin(t * 22 + ph + i * 2) * 2; c.beginPath(); c.moveTo(-2 + i * 3, 0); c.lineTo(-4 + i * 4 + w, s * 7); c.stroke(); }
  c.fillStyle = '#8a2a1a'; c.beginPath(); c.ellipse(-6, 0, 4.5, 3.5, 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(0, 0, 3, 2.5, 0, 0, TAU); c.fill(); c.beginPath(); c.arc(5, 0, 2.8, 0, TAU); c.fill();
  c.restore();
}
MG.add({
  id: 'squashbeetles', stage: 'problems', cmd: 'SQUASH THE BIG BEETLES!', time: 6, mood: 'party', winText: 'Big bugs, most crashes!', failText: 'Still crashing!',
  card: { title: 'A few causes do most of the damage', kind: 'Problem solving', ref: 'The Pareto principle (the 80/20 rule)',
    text: 'The crash meter showed it: the two big beetles caused most of the crashing, and the swarm of ants caused only a little. With only a few squashes, hitting the beetles fixed almost everything.\n\nThis pattern is common: a few causes often make most of the effect. People call it the 80/20 rule, or the Pareto principle, after the economist Vilfredo Pareto. The numbers are rough and change from case to case. The habit is useful anyway: before you start fixing things, find the few big causes and fix those first.',
    note: 'Often a few causes make most of the effect, so find and fix the big ones first.' },
  init(g) {
    const s = g.s, L = LV[Math.min(2, g.level)]; s.L = L; s.v = SK.variant(g, 4); s.bugs = []; s.hits = L.hits; s.whacks = []; s.amp = 1;
    const wb = 80 / L.beetles, wa = 20 / L.ants;
    for (let i = 0; i < L.beetles; i++) s.bugs.push({ big: true, x: SCR.l + 60 + g.rand() * 170, y: SCR.t + 80 + g.rand() * 240, a: g.rand() * TAU, sp: L.sp, w: wb, ph: g.rand() * 6 });
    for (let i = 0; i < L.ants; i++) {
      const host = L.hide ? s.bugs[i % L.beetles] : null; // level 2: the ants swarm over the beetles and hide them
      s.bugs.push({ big: false, x: host ? host.x + (g.rand() - 0.5) * 50 : SCR.l + 20 + g.rand() * 250, y: host ? host.y + (g.rand() - 0.5) * 50 : SCR.t + 60 + g.rand() * 280, a: g.rand() * TAU, sp: 40 + g.rand() * 20, w: wa, ph: g.rand() * 6, host: host ? i % L.beetles : -1, ox: (g.rand() - 0.5) * 44, oy: (g.rand() - 0.5) * 44 });
    }
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.hits <= 0) return; s.hits--;
    // the mallet comes down: it squashes the bug under it (a beetle first, if one is there)
    let hit = null, bd = 1e9; for (const b of s.bugs) { if (b.dead || hidden(g, b)) continue; const d = SK.dist(x, y, b.x, b.y), r = b.big ? 34 : 16; if (d < r && (b.big ? d - 30 : d) < bd) { bd = b.big ? d - 30 : d; hit = b; } }
    s.whacks.push({ x, y, t: g.t }); g.sfx('thud');
    if (hit) { hit.dead = g.t; g.sfx(hit.big ? 'crunch' : 'tap'); g.burst(hit.x, hit.y, hit.big ? ['#6ad0a0', '#1a6a5a', '#fff6ea'] : ['#8a2a1a'], hit.big ? 18 : 5, hit.big ? 180 : 60); if (hit.big) g.shake(5, 0.2); }
    if (hit && hit.big) for (const b of s.bugs) if (b.host >= 0 && s.bugs[b.host] === hit) b.host = -1; // the hiding ants scatter
    s.check = g.t + 0.45;
  },
  update(g, dt) {
    const s = g.s;
    for (const b of s.bugs) {
      if (b.dead) continue;
      if (b.host >= 0 && !s.bugs[b.host].dead) { const h = s.bugs[b.host]; b.x += (h.x + b.ox - b.x) * Math.min(1, dt * 6); b.y += (h.y + b.oy - b.y) * Math.min(1, dt * 6); b.a = h.a + Math.sin(g.t * 3 + b.ph) * 0.5; continue; }
      if (g.rand() < dt * (b.big ? 1.2 : 0.8)) b.a += (g.rand() - 0.5) * 2.4;
      b.x += Math.cos(b.a) * b.sp * dt; b.y += Math.sin(b.a) * b.sp * dt;
      const m = b.big ? 26 : 8;
      if (b.x < SCR.l + m) { b.x = SCR.l + m; b.a = Math.PI - b.a; } if (b.x > SCR.r - m) { b.x = SCR.r - m; b.a = Math.PI - b.a; }
      if (b.y < SCR.t + 50 + m) { b.y = SCR.t + 50 + m; b.a = -b.a; } if (b.y > SCR.b - m) { b.y = SCR.b - m; b.a = -b.a; }
    }
    // how hard the app shakes: the share of the crashing still caused by live bugs
    const want = s.bugs.reduce((a, b) => a + (b.dead ? 0 : b.w), 0) / 100; s.amp += (want - s.amp) * Math.min(1, dt * 5);
    if (s.check && g.t >= s.check && !g.done) {
      s.check = 0;
      if (want <= 0.25) { g.win(); g.sfx('cheer'); }
      else if (s.hits <= 0) { s.spill = g.t; g.sfx('splash'); g.sfx('laugh'); g.fail(); }
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, amp = s.amp;
    c.drawImage(g.bake('squashbeetles', paintDesk), 0, 0, 360, 640);
    const jx = Math.sin(t * 47) * amp * 6, jy = Math.cos(t * 41) * amp * 4, jr = Math.sin(t * 37) * amp * 0.02;
    c.save(); c.translate(180 + jx, 330 + jy); c.rotate(jr); c.translate(-180, -330);
    // the phone
    c.fillStyle = 'rgba(30,14,30,0.3)'; c.beginPath(); c.roundRect(SCR.l - 10, SCR.t - 22, SCR.r - SCR.l + 28, SCR.b - SCR.t + 50, 30); c.fill();
    c.fillStyle = '#2a2034'; c.beginPath(); c.roundRect(SCR.l - 14, SCR.t - 26, SCR.r - SCR.l + 28, SCR.b - SCR.t + 50, 28); c.fill();
    c.fillStyle = '#4a3a54'; c.beginPath(); c.roundRect(150, SCR.t - 16, 60, 6, 3); c.fill();
    c.drawImage(g.bake('squashapp' + s.v, o => paintApp(o, THEMES[s.v])), 0, 0, 360, 640);
    // crash flashes: red glitch bars, more of them the harder it shakes
    if (amp > 0.3 && g.result !== 'win') { const n = Math.round(amp * 4); for (let i = 0; i < n; i++) { const k = (t * 3 + i * 0.37) % 1; if (k < 0.25) { c.fillStyle = 'rgba(255,60,80,0.35)'; c.fillRect(SCR.l, SCR.t + 50 + ((i * 97 + Math.floor(t * 3) * 53) % 290), SCR.r - SCR.l, 10 + (i % 3) * 6); } } }
    // bugs: ants first, then beetles (on level 2 the swarm crawls on top of the beetles)
    const drawBug = b => { const sq = b.dead ? 1 : 0; if (b.dead && t - b.dead > 1.2) { c.globalAlpha = Math.max(0, 1 - (t - b.dead - 1.2) * 2); } if (hidden(g, b)) c.globalAlpha = 0.16; (b.big ? beetle : ant)(c, b.x, b.y, b.a, b.dead ? 0 : t, b.ph, sq); c.globalAlpha = 1; };
    if (s.L.hide) { for (const b of s.bugs) if (b.big) drawBug(b); for (const b of s.bugs) if (!b.big) drawBug(b); }
    else { for (const b of s.bugs) if (!b.big) drawBug(b); for (const b of s.bugs) if (b.big) drawBug(b); }
    // the crash meter in the app's top bar: one fat chunk per beetle, one thin sliver for all the ants together
    { const mx = SCR.l + 104, mw = SCR.r - 14 - mx, my = SCR.t + 16; B9.txt(c, 'Crashes', SCR.l + 54, SCR.t + 24, 18, '#fff6ea', { stroke: 'rgba(120,40,20,0.5)' }); c.fillStyle = 'rgba(255,255,255,0.4)'; c.beginPath(); c.roundRect(mx, my, mw, 16, 8); c.fill(); let x = mx;
      for (const b of s.bugs) if (b.big) { const k = b.dead ? Math.max(0, 1 - (t - b.dead) * 3) : 1, w = mw * b.w / 100 * k; if (w > 0.5) { c.fillStyle = '#d82a3a'; c.fillRect(x, my, w - 1, 16); x += w; } }
      const aw = mw * s.bugs.filter(b => !b.big && !b.dead).reduce((a, b) => a + b.w, 0) / 100; c.fillStyle = '#f0a040'; c.fillRect(x, my, aw, 16); }
    c.restore();
    SK.tag(c, 'Your app', 180, SCR.b + 14, 18);
    // the mallet strikes
    for (const w of s.whacks) { const k = (t - w.t) / 0.35; if (k < 1) { c.save(); c.translate(w.x, w.y); c.rotate(-0.6 + Math.min(1, k * 4) * 0.6); c.globalAlpha = k < 0.7 ? 1 : (1 - k) / 0.3; c.fillStyle = '#8a5a2a'; c.fillRect(-4, -60, 8, 50); c.fillStyle = '#e84a4a'; c.beginPath(); c.roundRect(-22, -16, 44, 22, 6); c.fill(); c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(-18, -13, 36, 5); c.restore(); } }
    // the squashes left: one mallet each
    for (let i = 0; i < s.L.hits; i++) { const x = 220 + i * 40, y = 572, on = i < s.hits; c.save(); c.globalAlpha = on ? 1 : 0.25; c.translate(x, y); c.rotate(-0.5); c.fillStyle = '#8a5a2a'; c.fillRect(-3, -6, 6, 32); c.fillStyle = '#e84a4a'; c.beginPath(); c.roundRect(-14, -16, 28, 14, 4); c.fill(); c.restore(); }
    if (!g.done) SK.tag(c, s.hits + ' squashes left', 260, 604, 18);
    // the hedgehog developer and its coffee, which sloshes with the shaking (and spills on a fail)
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'hedgehog', 64, 604, 0.9, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : amp > 0.5 ? 'wow' : 'think' });
    const mx = 140, my = 574, tip = s.spill ? SK.clamp((t - s.spill) * 3, 0, 1) * 1.4 : Math.sin(t * 30) * amp * 0.12;
    c.save(); c.translate(mx, my + 14); c.rotate(tip); c.fillStyle = '#fff6ea'; c.beginPath(); c.roundRect(-14, -30, 28, 30, [3, 3, 8, 8]); c.fill(); c.strokeStyle = '#fff6ea'; c.lineWidth = 4; c.beginPath(); c.arc(16, -16, 7, -1.4, 1.4); c.stroke(); c.fillStyle = '#6a3a1a'; c.fillRect(-12, -27, 24, 5); c.restore();
    if (s.spill) { const k = SK.clamp((t - s.spill) * 2, 0, 1); c.fillStyle = 'rgba(106,58,26,0.85)'; c.beginPath(); c.ellipse(mx + 30 + k * 20, my + 22, 10 + k * 34, 4 + k * 6, 0, 0, TAU); c.fill(); }
    else if (amp > 0.4) { c.fillStyle = 'rgba(106,58,26,0.8)'; for (let i = 0; i < 2; i++) { const k = (t * 2 + i * 0.5) % 1; c.beginPath(); c.arc(mx + 6 + k * 14, my - 18 + k * k * 30, 2.5, 0, TAU); c.fill(); } }
    const target = s.bugs.find(b => b.big && !b.dead && !hidden(g, b)) || s.bugs.find(b => b.big && !b.dead);
    if (target && !g.done) { SK.glow(c, g, target.x, target.y, 30); SK.demo(g, c, 'tap', [target.x, target.y], null, { delay: 1.0 }); }
  },
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < 1.0 || s.hits <= 0) return; const B = s._plan = s._plan || {}; if (g.t < (B.next || 0)) return;
    const b = s.bugs.find(q => q.big && !q.dead && !hidden(g, q)); if (!b) return; B.next = g.t + 0.5; synth('down', b.x, b.y); synth('up', b.x, b.y);
  },
});
