// WRAP THE SHOP! (law LW-18) — a bakery and, next door, the owner's own house. Debt letters fly in toward the bakery.
// Trace a loop around the bakery: a bubble (the company, an LLC) forms, the letters bounce off it and the bakery pays
// them from its own till. No bubble (a sole proprietor): the letters fly on past and plaster the owner's front door.
const BK = { x0: 34, x1: 166, top: 300, gy: 452 }, BC = [100, 372]; // the bakery and the bubble's centre
const HOUSES = [{ x0: 214, x1: 330 }, { x0: 210, x1: 326 }, { x0: 196, x1: 312 }]; // level 2: the house sits closer
const TAU = Math.PI * 2;
function houseOf(g) { return HOUSES[Math.min(2, g.level)]; }
function doorOf(g) { const H = houseOf(g); return [(H.x0 + H.x1) / 2, BK.gy - 32]; }
function paintScene(o, H) {
  P.sky(o, 360, 640, ['#f2b98a', '#f9d7b0', '#fff1dc'], { x: 300, y: 150, r: 34, color: '#ffd9a0' });
  P.hills(o, 360, 420, 40, '#e0b98c', '#c99a6a', { seed: 4, freq: 0.01 });
  P.hills(o, 360, 452, 22, '#c9a06e', '#a87c4e', { seed: 7, freq: 0.016 });
  // the street
  const st = o.createLinearGradient(0, BK.gy, 0, 640); st.addColorStop(0, '#b68a5c'); st.addColorStop(1, '#8a6040'); o.fillStyle = st; o.fillRect(0, BK.gy, 360, 188);
  o.fillStyle = '#d9b88a'; o.fillRect(0, BK.gy, 360, 10); o.fillStyle = 'rgba(70,40,20,0.18)'; o.fillRect(0, BK.gy + 10, 360, 4);
  const rnd = P.rng(5); for (let i = 0; i < 60; i++) { o.fillStyle = rnd() < 0.5 ? 'rgba(80,50,30,0.25)' : 'rgba(255,230,190,0.3)'; o.beginPath(); o.ellipse(rnd() * 360, BK.gy + 20 + rnd() * 160, 2 + rnd() * 5, 1 + rnd() * 2, 0, 0, TAU); o.fill(); }
  // the bakery: pink walls, a striped awning, a big loaf sign and a window full of buns
  const { x0, x1, top, gy } = BK, w = x1 - x0;
  o.fillStyle = 'rgba(40,20,30,0.2)'; o.beginPath(); o.ellipse((x0 + x1) / 2 + 8, gy + 4, w * 0.6, 8, 0, 0, TAU); o.fill();
  const wall = o.createLinearGradient(x0, 0, x1, 0); wall.addColorStop(0, '#ffc4c8'); wall.addColorStop(1, '#e8919a'); o.fillStyle = wall; o.fillRect(x0, top, w, gy - top);
  o.fillStyle = '#c9707c'; o.fillRect(x0 - 6, top - 14, w + 12, 16); // the roof lip
  for (let i = 0; i < 7; i++) { o.fillStyle = i % 2 ? '#fff6ea' : '#e8403a'; o.beginPath(); const ax = x0 - 8 + i * (w + 16) / 7, aw = (w + 16) / 7; o.moveTo(ax, top + 28); o.lineTo(ax + aw, top + 28); o.lineTo(ax + aw + 2, top + 54); o.quadraticCurveTo(ax + aw / 2, top + 64, ax - 2, top + 54); o.closePath(); o.fill(); }
  P.loaf(o, (x0 + x1) / 2, top - 2, 1.5);
  o.fillStyle = '#ffe9b0'; o.fillRect(x0 + 12, top + 70, 64, 50); o.strokeStyle = '#8a4a40'; o.lineWidth = 4; o.strokeRect(x0 + 12, top + 70, 64, 50);
  for (let i = 0; i < 4; i++) { o.fillStyle = ['#d98a3a', '#f0b860', '#c86a2a', '#e8a04a'][i]; o.beginPath(); o.ellipse(x0 + 22 + i * 15, top + 108, 8, 6, 0, 0, TAU); o.fill(); }
  o.fillStyle = '#8a4a40'; o.fillRect(x0 + 86, top + 76, 36, gy - top - 76); o.fillStyle = '#f6c445'; o.beginPath(); o.arc(x0 + 114, top + 118, 3, 0, TAU); o.fill();
  // the owner's house: a blue cottage with a pointed roof and a round window
  const hw = H.x1 - H.x0, ht = 330;
  o.fillStyle = 'rgba(40,20,30,0.2)'; o.beginPath(); o.ellipse((H.x0 + H.x1) / 2 + 8, gy + 4, hw * 0.6, 8, 0, 0, TAU); o.fill();
  const hwall = o.createLinearGradient(H.x0, 0, H.x1, 0); hwall.addColorStop(0, '#a8d4f0'); hwall.addColorStop(1, '#6fa8d0'); o.fillStyle = hwall; o.fillRect(H.x0, ht, hw, gy - ht);
  o.fillStyle = '#5a3a5a'; o.beginPath(); o.moveTo(H.x0 - 12, ht + 4); o.lineTo((H.x0 + H.x1) / 2, ht - 58); o.lineTo(H.x1 + 12, ht + 4); o.closePath(); o.fill();
  o.fillStyle = '#7a5478'; o.beginPath(); o.moveTo(H.x0 - 12, ht + 4); o.lineTo((H.x0 + H.x1) / 2, ht - 58); o.lineTo((H.x0 + H.x1) / 2, ht + 4); o.closePath(); o.fill();
  o.fillStyle = '#fff4c8'; o.beginPath(); o.arc((H.x0 + H.x1) / 2, ht - 18, 11, 0, TAU); o.fill(); o.strokeStyle = '#3a2440'; o.lineWidth = 3; o.stroke();
  const dx = (H.x0 + H.x1) / 2; o.fillStyle = '#c0503a'; o.beginPath(); o.roundRect(dx - 18, gy - 70, 36, 70, [18, 18, 0, 0]); o.fill(); o.fillStyle = '#f6c445'; o.beginPath(); o.arc(dx + 10, gy - 34, 3, 0, TAU); o.fill();
  o.fillStyle = '#fff4c8'; o.fillRect(H.x0 + 10, ht + 30, 24, 24); o.fillRect(H.x1 - 34, ht + 30, 24, 24); o.strokeStyle = '#3a2440'; o.lineWidth = 3; o.strokeRect(H.x0 + 10, ht + 30, 24, 24); o.strokeRect(H.x1 - 34, ht + 30, 24, 24);
  P.flowers(o, 360, gy - 4, gy + 4, 6, undefined, 3);
  P.grain(o, 360, 640, 0.04); P.vignette(o, 360, 640, 0.25);
}
// a debt letter: an envelope with a red seal and flapping paper wings
function letter(c, x, y, t, ph, o = {}) {
  c.save(); c.translate(x, y); c.scale(1.35, 1.35); c.rotate(o.rot || Math.sin(t * 6 + ph) * 0.12);
  const f = Math.sin(t * 18 + ph) * 0.6; c.fillStyle = '#fffaf0'; c.strokeStyle = '#7a5a60'; c.lineWidth = 1.5;
  for (const s of [-1, 1]) { c.save(); c.scale(s, 1); c.rotate(-0.3 + f * 0.5); c.beginPath(); c.moveTo(10, -4); c.quadraticCurveTo(26, -18, 32, -6); c.quadraticCurveTo(24, -2, 12, 2); c.closePath(); c.fill(); c.stroke(); c.restore(); }
  c.fillStyle = '#fff4e0'; c.beginPath(); c.roundRect(-17, -11, 34, 22, 3); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(120,80,90,0.6)'; c.beginPath(); c.moveTo(-17, -11); c.lineTo(0, 2); c.lineTo(17, -11); c.stroke();
  c.fillStyle = o.paid ? '#4aa860' : '#d0303a'; c.beginPath(); c.arc(0, 3, 7, 0, TAU); c.fill();
  c.fillStyle = '#fff6ea'; c.font = '900 10px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.paid ? '✓' : '$', 0, 3.5);
  if (!o.paid && !o.stuck) { c.fillStyle = '#2a1424'; for (const s of [-1, 1]) { c.beginPath(); c.arc(s * 8, -3, 1.6, 0, TAU); c.fill(); } c.strokeStyle = '#2a1424'; c.lineWidth = 1.5; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * 11, -8); c.lineTo(s * 5, -6); c.stroke(); } }
  c.restore();
}
function bubble(c, x, y, r, t, k) { // an iridescent soap bubble; k 0..1 grows it in
  if (k <= 0) return; const R = r * SK.easeOut(k) * (1 + Math.sin(t * 3) * 0.015);
  c.save(); const gr = c.createRadialGradient(x - R * 0.3, y - R * 0.35, R * 0.1, x, y, R);
  gr.addColorStop(0, 'rgba(255,255,255,0.04)'); gr.addColorStop(0.8, 'rgba(190,230,255,0.12)'); gr.addColorStop(0.95, 'rgba(255,190,240,0.32)'); gr.addColorStop(1, 'rgba(255,255,255,0.5)');
  c.fillStyle = gr; c.beginPath(); c.arc(x, y, R, 0, TAU); c.fill();
  c.lineWidth = 3; for (let i = 0; i < 6; i++) { c.strokeStyle = ['rgba(255,140,200,0.55)', 'rgba(140,220,255,0.55)', 'rgba(255,240,140,0.5)'][i % 3]; c.beginPath(); c.arc(x, y, R - 1.5, t * 0.6 + i * TAU / 6, t * 0.6 + i * TAU / 6 + 0.8); c.stroke(); }
  c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(x - R * 0.45, y - R * 0.5, R * 0.16, R * 0.07, -0.7, 0, TAU); c.fill();
  c.restore();
}
MG.add({
  id: 'wrapshop', stage: 'law', cmd: 'WRAP THE SHOP!', time: 5, mood: 'desert', winText: 'Shielded!', failText: 'Not my house!',
  card: { title: 'A company is its own person', kind: 'Law', ref: 'Limited liability (LLC or corporation)',
    text: 'When you form an LLC or a corporation, the law treats the business as a separate person. The business owns its own money and owes its own debts. If it can\'t pay, the people it owes can usually take only what the business owns, and the owner\'s house stays safe.\n\nA sole proprietor runs a business without forming a company. Then the business debts are the owner\'s own debts. The shield has holes: an owner who signs a personal guarantee, or mixes company money with personal money, can be made to pay.\n\nGeneral information about US law, not legal advice.',
    note: 'An LLC or corporation is a separate legal person, so its debts usually can\'t reach the owner\'s own home.' },
  init(g) {
    const s = g.s; s.path = []; s.wind = 0; s.windH = 0; s.bub = 0; s.R = 90; s.pops = [];
    const arrive = SK.clamp(0.5 * g.dur, 2.6, 6.5); // when the first letter reaches the bakery
    s.L = [0, 1, 2].map(i => ({ i, sx: [36, 96, 156][i], sy: [196, 162, 200][i], T1: arrive + i * 0.38, st: 'fly', ph: g.rand() * 6 }));
    for (const L of s.L) { L.T0 = L.T1 - 1.1; L.x = L.sx; L.y = L.sy; }
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.bub) return; s.path = [[x, y]]; s.wind = 0; s.windH = 0; s.drawing = true; },
  move(g, x, y) {
    const s = g.s; if (!s.drawing || s.bub || g.done) return; const q = s.path[s.path.length - 1]; if (SK.dist(q[0], q[1], x, y) < 3) return;
    const [hx, hy] = [(houseOf(g).x0 + houseOf(g).x1) / 2, 395];
    const da = (cx, cy) => { let d = Math.atan2(y - cy, x - cx) - Math.atan2(q[1] - cy, q[0] - cx); while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return d; };
    s.wind += da(BC[0], BC[1]); s.windH += da(hx, hy); s.path.push([x, y]); if (s.path.length > 400) s.path.shift();
    if (Math.abs(s.wind) > TAU * 0.86) {
      const md = s.path.reduce((a, p) => a + SK.dist(p[0], p[1], BC[0], BC[1]), 0) / s.path.length;
      if (Math.abs(s.windH) > TAU * 0.5) { s.pops.push({ t: g.t, x: (BC[0] + hx) / 2, y: BC[1] }); g.sfx('pop'); g.burst((BC[0] + hx) / 2, BC[1], ['#bfe8ff', '#ffc4f0', '#fff6ea'], 16, 160); s.path = []; s.drawing = false; return; }
      if (md < 50) return; // a scribble on the roof, not a loop around the shop
      s.R = SK.clamp(md, 84, 98); s.bub = g.t; s.drawing = false; g.sfx('magic'); g.sfx('bubble');
    }
  },
  up(g) { const s = g.s; s.drawing = false; if (!s.bub) s.path = []; },
  update(g, dt) {
    const s = g.s, [dx, dy] = doorOf(g);
    for (const L of s.L) {
      if (L.st === 'fly') {
        if (g.t < L.T0) { L.x = L.sx + Math.sin(g.t * 2 + L.ph) * 8; L.y = L.sy + Math.sin(g.t * 3.1 + L.ph) * 6; continue; }
        if (g.t < L.T1) { const k = SK.easeInOut((g.t - L.T0) / (L.T1 - L.T0)); L.x = SK.lerp(L.sx, BC[0] + (L.i - 1) * 20, k); L.y = SK.lerp(L.sy, BC[1] - 50, k) - Math.sin(k * Math.PI) * 40; }
        else { const k = Math.min(1, (g.t - L.T1) / 0.9); L.x = SK.lerp(BC[0] + (L.i - 1) * 20, dx, k); L.y = SK.lerp(BC[1] - 50, dy, k) - Math.sin(k * Math.PI) * 30; if (k >= 1) { L.st = 'stuck'; L.at = g.t; L.x = dx + (L.i - 1) * 9; L.y = dy - 14 + L.i * 15; g.sfx('thud'); g.shake(4, 0.25); if (!g.done) { g.sfx('wrong'); g.fail(); } } }
        // the bubble: the letter bounces off, and the bakery pays it from its own till
        if (s.bub && g.t - s.bub > 0.2 && SK.dist(L.x, L.y, BC[0], BC[1]) < s.R + 14) {
          L.st = 'bounce'; L.at = g.t; L.bx = L.x; L.by = L.y; g.sfx('boing'); g.burst(L.x, L.y, ['#bfe8ff', '#ffc4f0'], 8, 100);
          if (!g.done) { g.win(); g.sfx('cheer'); }
        }
      } else if (L.st === 'bounce') {
        const k = g.t - L.at; if (k > 0.45 && !L.paid) { L.paid = true; g.sfx('coin'); }
        L.x = L.bx - k * 150; L.y = L.by - k * 120 + k * k * 20;
      }
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, H = houseOf(g), [dx] = doorOf(g);
    const shakeH = s.L.some(L => L.st === 'stuck') ? Math.sin(t * 40) * Math.max(0, 1 - (t - g.doneAt) * 2) * 3 : 0;
    c.save(); c.translate(shakeH, 0); c.drawImage(g.bake('wrapshop' + Math.min(2, g.level), o => paintScene(o, H)), 0, 0, 360, 640); c.restore();
    // drifting clouds
    for (let i = 0; i < 2; i++) P.cloud(c, ((t * 8 + i * 190) % 460) - 60, 170 + i * 40, 0.6 + i * 0.2);
    // coins flying from the bakery's till to each bounced letter
    for (const L of s.L) if (L.st === 'bounce') { const k = SK.clamp((t - L.at) / 0.45, 0, 1); if (k < 1) { const x = SK.lerp(BK.x0 + 104, L.x, k), y = SK.lerp(BK.top + 100, L.y, k) - Math.sin(k * Math.PI) * 50; B9.coin(c, x, y, 9, Math.cos(t * 12)); } }
    // the owner (beaver) by the house door
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'beaver', H.x1 - 4, 520, 0.95, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    // the trace while drawing, then the bubble
    if (s.path.length > 1 && !s.bub) { c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 14; c.beginPath(); s.path.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.strokeStyle = 'rgba(170,225,255,0.95)'; c.lineWidth = 5; c.stroke(); c.restore(); }
    if (s.bub) bubble(c, BC[0], BC[1], s.R, t, (t - s.bub) / 0.35);
    for (const p of s.pops) { const k = (t - p.t) / 0.4; if (k < 1) { c.save(); c.globalAlpha = 1 - k; c.strokeStyle = '#bfe8ff'; c.lineWidth = 3; c.beginPath(); c.arc(p.x, p.y, 60 + k * 60, 0, TAU); c.stroke(); c.restore(); } }
    // the letters
    for (const L of s.L) { letter(c, L.x, L.y, t, L.ph, { paid: L.paid, stuck: L.st === 'stuck', rot: L.st === 'stuck' ? (L.i - 1) * 0.25 : L.st === 'bounce' ? -(t - L.at) * 6 : undefined }); }
    if (!s.bub && !g.done) SK.glow(c, g, BC[0], BC[1], 92);
    B9.demoPath(g, c, B9.ring(BC[0], BC[1], 94, 94, 30, -Math.PI / 2, 1.05), { period: 2.4 });
  },
  auto(g, dt, synth) { B9.botPath(g, synth, 'loop', 1.0, B9.ring(BC[0], BC[1], 92, 92, 40, -Math.PI / 2, 1.08), 0.8); },
});
