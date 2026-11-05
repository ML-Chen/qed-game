// WRAP THE SHOP! (law LW-18) — the beaver owns two shops (three at level 2) and, between them, its own house. Debt
// letters hover in the sky, then swoop at each shop. Trace a loop around each shop: a bubble (the company, an LLC)
// forms, its letter bounces off and the shop pays it from its own till. A shop with no bubble (a sole proprietor):
// its letter flies on past and plasters the owner's front door. A loop that takes in the house too just pops.
const TAU = Math.PI * 2, R = 72;
const SHOPS = {
  bakery: { cx: 92, gy: 330, w: 116, h: 104, wall: ['#ffc4c8', '#e8919a'], roof: '#c9707c', aw: '#e8403a', sign: 'loaf' },
  toys: { cx: 268, gy: 330, w: 116, h: 104, wall: ['#c8e8b0', '#90c080'], roof: '#5a8a50', aw: '#4a7ad8', sign: 'ball' },
  cafe: { cx: 270, gy: 548, w: 116, h: 104, wall: ['#f8e0a0', '#e0b860'], roof: '#a87830', aw: '#8a4ac0', sign: 'cup' },
};
const LAY = [{ shops: ['bakery', 'toys'], house: { x0: 122, x1: 238, gy: 548 } }, { shops: ['bakery', 'toys'], house: { x0: 122, x1: 238, gy: 548 } }, { shops: ['bakery', 'toys', 'cafe'], house: { x0: 34, x1: 150, gy: 548 } }];
function lay(g) { return LAY[Math.min(2, g.level)]; }
function centre(S) { return [S.cx, S.gy - S.h / 2 + 4]; }
function doorOf(g) { const H = lay(g).house; return [(H.x0 + H.x1) / 2, H.gy - 32]; }
function paintShop(o, S) {
  const x0 = S.cx - S.w / 2, x1 = S.cx + S.w / 2, top = S.gy - S.h, gy = S.gy, w = S.w;
  o.fillStyle = 'rgba(40,20,30,0.2)'; o.beginPath(); o.ellipse(S.cx + 8, gy + 4, w * 0.6, 8, 0, 0, TAU); o.fill();
  const wall = o.createLinearGradient(x0, 0, x1, 0); wall.addColorStop(0, S.wall[0]); wall.addColorStop(1, S.wall[1]); o.fillStyle = wall; o.fillRect(x0, top, w, gy - top);
  o.fillStyle = S.roof; o.fillRect(x0 - 6, top - 12, w + 12, 14);
  for (let i = 0; i < 6; i++) { o.fillStyle = i % 2 ? '#fff6ea' : S.aw; o.beginPath(); const ax = x0 - 8 + i * (w + 16) / 6, aw = (w + 16) / 6; o.moveTo(ax, top + 8); o.lineTo(ax + aw, top + 8); o.lineTo(ax + aw + 2, top + 30); o.quadraticCurveTo(ax + aw / 2, top + 38, ax - 2, top + 30); o.closePath(); o.fill(); }
  if (S.sign === 'loaf') P.loaf(o, S.cx, top - 4, 1.4);
  else if (S.sign === 'ball') { o.fillStyle = '#f6c445'; o.beginPath(); o.arc(S.cx, top - 6, 11, 0, TAU); o.fill(); o.fillStyle = '#e84a4a'; o.beginPath(); o.moveTo(S.cx, top - 6); o.arc(S.cx, top - 6, 11, 0, 2.1); o.closePath(); o.fill(); o.fillStyle = '#4a8ae8'; o.beginPath(); o.moveTo(S.cx, top - 6); o.arc(S.cx, top - 6, 11, 2.1, 4.2); o.closePath(); o.fill(); }
  else { o.fillStyle = '#fff6ea'; o.beginPath(); o.roundRect(S.cx - 11, top - 16, 20, 18, [0, 0, 7, 7]); o.fill(); o.strokeStyle = '#fff6ea'; o.lineWidth = 3; o.beginPath(); o.arc(S.cx + 11, top - 8, 5, -1.4, 1.4); o.stroke(); o.fillStyle = '#8a5a3a'; o.fillRect(S.cx - 9, top - 14, 16, 4); }
  o.fillStyle = '#ffe9b0'; o.fillRect(x0 + 10, top + 46, 56, 40); o.strokeStyle = 'rgba(70,30,40,0.7)'; o.lineWidth = 4; o.strokeRect(x0 + 10, top + 46, 56, 40);
  for (let i = 0; i < 3; i++) { o.fillStyle = ['#d98a3a', '#e84a6a', '#4a8ae8'][i]; o.beginPath(); o.ellipse(x0 + 22 + i * 16, top + 78, 7, 5, 0, 0, TAU); o.fill(); }
  o.fillStyle = 'rgba(70,30,40,0.8)'; o.fillRect(x0 + 76, top + 50, 30, gy - top - 50); o.fillStyle = '#f6c445'; o.beginPath(); o.arc(x0 + 100, top + 80, 3, 0, TAU); o.fill();
}
function paintScene(o, L) {
  P.sky(o, 360, 640, ['#f2b98a', '#f9d7b0', '#fff1dc'], { x: 300, y: 130, r: 30, color: '#ffd9a0' });
  P.hills(o, 360, 300, 36, '#e0b98c', '#c99a6a', { seed: 4, freq: 0.01 });
  // two streets: the upper one in front of the top shops, the lower one in front of the house
  for (const gy of [330, 548]) { const st = o.createLinearGradient(0, gy, 0, gy + 60); st.addColorStop(0, '#c09464'); st.addColorStop(1, '#a07a50'); o.fillStyle = st; o.fillRect(0, gy, 360, gy === 330 ? 40 : 92); o.fillStyle = '#e0c090'; o.fillRect(0, gy, 360, 6); }
  o.fillStyle = '#d0a878'; o.fillRect(0, 370, 360, 178); P.hills(o, 360, 400, 14, '#c9a06e', '#b8905e', { seed: 7, freq: 0.02, bottom: 548 });
  for (const k of L.shops) paintShop(o, SHOPS[k]);
  // the owner's house: a blue cottage with a pointed roof and a round window
  const H = L.house, hw = H.x1 - H.x0, gy = H.gy, ht = gy - 92, dx = (H.x0 + H.x1) / 2;
  o.fillStyle = 'rgba(40,20,30,0.2)'; o.beginPath(); o.ellipse(dx + 8, gy + 4, hw * 0.6, 8, 0, 0, TAU); o.fill();
  const hwall = o.createLinearGradient(H.x0, 0, H.x1, 0); hwall.addColorStop(0, '#a8d4f0'); hwall.addColorStop(1, '#6fa8d0'); o.fillStyle = hwall; o.fillRect(H.x0, ht, hw, gy - ht);
  o.fillStyle = '#5a3a5a'; o.beginPath(); o.moveTo(H.x0 - 12, ht + 4); o.lineTo(dx, ht - 50); o.lineTo(H.x1 + 12, ht + 4); o.closePath(); o.fill();
  o.fillStyle = '#7a5478'; o.beginPath(); o.moveTo(H.x0 - 12, ht + 4); o.lineTo(dx, ht - 50); o.lineTo(dx, ht + 4); o.closePath(); o.fill();
  o.fillStyle = '#fff4c8'; o.beginPath(); o.arc(dx, ht - 16, 10, 0, TAU); o.fill(); o.strokeStyle = '#3a2440'; o.lineWidth = 3; o.stroke();
  o.fillStyle = '#c0503a'; o.beginPath(); o.roundRect(dx - 17, gy - 64, 34, 64, [17, 17, 0, 0]); o.fill(); o.fillStyle = '#f6c445'; o.beginPath(); o.arc(dx + 9, gy - 30, 3, 0, TAU); o.fill();
  o.fillStyle = '#fff4c8'; o.fillRect(H.x0 + 10, ht + 22, 22, 22); o.fillRect(H.x1 - 32, ht + 22, 22, 22); o.strokeStyle = '#3a2440'; o.lineWidth = 3; o.strokeRect(H.x0 + 10, ht + 22, 22, 22); o.strokeRect(H.x1 - 32, ht + 22, 22, 22);
  P.flowers(o, 360, gy + 6, gy + 14, 5, undefined, 3);
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
  id: 'wrapshop', stage: 'law', cmd: 'WRAP THE SHOP!', time: 6, mood: 'desert', winText: 'Limited liability!', failText: 'Not my house!',
  card: { title: 'A company is its own person', kind: 'Law', ref: 'Limited liability (LLC or corporation)',
    text: 'When you form an LLC or a corporation, the law treats the business as a separate person. The business owns its own money and owes its own debts. If it can\'t pay, the people it owes can usually take only what the business owns, and the owner\'s house stays safe.\n\nA sole proprietor runs a business without forming a company. Then the business debts are the owner\'s own debts. The shield has holes: an owner who signs a personal guarantee, or mixes company money with personal money, can be made to pay.\n\nGeneral information about US law, not legal advice.',
    note: 'An LLC or corporation is a separate legal person, so its debts usually can\'t reach the owner\'s own home.' },
  init(g) {
    const s = g.s, L = lay(g); s.path = []; s.w = {}; s.bub = {}; s.pops = [];
    const first = SK.clamp(0.4 * g.dur, 3.2, 8), gap = SK.clamp(0.2 * g.dur, 1.4, 3);
    const starts = { bakery: [70, 168], toys: [250, 150], cafe: [336, 392] };
    s.L = L.shops.map((k, i) => { const T1 = first + i * gap; return { i, shop: k, sx: starts[k][0], sy: starts[k][1], T0: T1 - 1.0, T1, st: 'fly', ph: g.rand() * 6, x: starts[k][0], y: starts[k][1] }; });
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; s.path = [[x, y]]; s.w = {}; s.drawing = true; },
  move(g, x, y) {
    const s = g.s, L = lay(g); if (!s.drawing || g.done) return; const q = s.path[s.path.length - 1]; if (SK.dist(q[0], q[1], x, y) < 3) return;
    const da = (cx, cy) => { let d = Math.atan2(y - cy, x - cx) - Math.atan2(q[1] - cy, q[0] - cx); while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return d; };
    const pts = L.shops.map(k => [k, centre(SHOPS[k])]); const H = L.house; pts.push(['house', [(H.x0 + H.x1) / 2, H.gy - 50]]);
    for (const [k, [cx, cy]] of pts) s.w[k] = (s.w[k] || 0) + da(cx, cy);
    s.path.push([x, y]); if (s.path.length > 400) s.path.shift();
    for (const k of L.shops) {
      if (Math.abs(s.w[k] || 0) < TAU * 0.86) continue;
      const others = pts.filter(([o]) => o !== k && Math.abs(s.w[o] || 0) > TAU * 0.5);
      if (others.length) { const [cx, cy] = centre(SHOPS[k]); s.pops.push({ t: g.t, x: cx, y: cy + 60 }); g.sfx('pop'); g.burst(cx, cy + 60, ['#bfe8ff', '#ffc4f0', '#fff6ea'], 16, 160); s.path = [[x, y]]; s.w = {}; return; }
      const [cx, cy] = centre(SHOPS[k]), md = s.path.reduce((a, p) => a + SK.dist(p[0], p[1], cx, cy), 0) / s.path.length;
      if (md < 40) continue; // a scribble on the roof, not a loop around the shop
      if (!s.bub[k]) { s.bub[k] = g.t; g.sfx('magic'); g.sfx('bubble'); }
      s.path = [[x, y]]; s.w = {}; return;
    }
  },
  up(g) { const s = g.s; s.drawing = false; s.path = []; },
  update(g, dt) {
    const s = g.s, [dx, dy] = doorOf(g);
    for (const L of s.L) {
      const S = SHOPS[L.shop], [cx, cy] = centre(S), tx = cx, ty = S.gy - S.h - 4;
      // once every shop is wrapped, the letters stop circling and swoop in straight away
      if (L.st === 'fly' && g.t < L.T0 && lay(g).shops.every(k => s.bub[k]) && !s.hurry) s.hurry = g.t;
      if (s.hurry && L.st === 'fly' && g.t < L.T0) { L.T0 = Math.max(g.t, s.hurry + 0.3 + L.i * 0.25); L.T1 = L.T0 + 0.8; L.sx = L.x; L.sy = L.y; }
      if (L.st === 'fly') {
        if (g.t < L.T0) { L.x = L.sx + Math.sin(g.t * 2 + L.ph) * 8; L.y = L.sy + Math.sin(g.t * 3.1 + L.ph) * 6; continue; }
        if (g.t < L.T1) { const k = SK.easeInOut((g.t - L.T0) / (L.T1 - L.T0)); L.x = SK.lerp(L.sx, tx, k); L.y = SK.lerp(L.sy, ty, k) - Math.sin(k * Math.PI) * 30; }
        else { const k = Math.min(1, (g.t - L.T1) / 0.9); L.x = SK.lerp(tx, dx, k); L.y = SK.lerp(ty, dy, k) - Math.sin(k * Math.PI) * 30; if (k >= 1) { L.st = 'stuck'; L.at = g.t; L.x = dx + (L.i - 1) * 9; L.y = dy - 14 + L.i * 12; g.sfx('thud'); g.shake(4, 0.25); if (!g.done) { g.sfx('wrong'); g.fail(); } } }
        if (s.bub[L.shop] && g.t - s.bub[L.shop] > 0.2 && SK.dist(L.x, L.y, cx, cy) < R + 14) { L.st = 'bounce'; L.at = g.t; L.bx = L.x; L.by = L.y; L.dir = L.x < 180 ? -1 : 1; g.sfx('boing'); g.burst(L.x, L.y, ['#bfe8ff', '#ffc4f0'], 8, 100); }
      } else if (L.st === 'bounce') { const k = g.t - L.at; if (k > 0.45 && !L.paid) { L.paid = true; g.sfx('coin'); } L.x = L.bx + L.dir * k * 150; L.y = L.by - k * 140 + k * k * 20; }
    }
    if (!g.done && s.L.every(L => L.paid)) { g.win(); g.sfx('cheer'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, L = lay(g), H = L.house;
    const shakeH = s.L.some(q => q.st === 'stuck') ? Math.sin(t * 40) * Math.max(0, 1 - (t - g.doneAt) * 2) * 3 : 0;
    c.save(); c.translate(shakeH, 0); c.drawImage(g.bake('wrapshop' + (g.level >= 2 ? 2 : 0), o => paintScene(o, L)), 0, 0, 360, 640); c.restore();
    for (let i = 0; i < 2; i++) P.cloud(c, ((t * 8 + i * 190) % 460) - 60, 150 + i * 46, 0.5 + i * 0.15);
    // coins from each shop's own till to its bounced letter
    for (const q of s.L) if (q.st === 'bounce') { const k = SK.clamp((t - q.at) / 0.45, 0, 1), [cx, cy] = centre(SHOPS[q.shop]); if (k < 1) B9.coin(c, SK.lerp(cx + 20, q.x, k), SK.lerp(cy + 20, q.y, k) - Math.sin(k * Math.PI) * 50, 9, Math.cos(t * 12)); }
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'beaver', H.x1 + 26, 600, 0.9, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    if (s.path.length > 1) { c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 14; c.beginPath(); s.path.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.strokeStyle = 'rgba(170,225,255,0.95)'; c.lineWidth = 5; c.stroke(); c.restore(); }
    for (const k of L.shops) if (s.bub[k]) { const [cx, cy] = centre(SHOPS[k]); bubble(c, cx, cy, R, t, (t - s.bub[k]) / 0.35); }
    for (const p of s.pops) { const k = (t - p.t) / 0.4; if (k < 1) { c.save(); c.globalAlpha = 1 - k; c.strokeStyle = '#bfe8ff'; c.lineWidth = 3; c.beginPath(); c.arc(p.x, p.y, 60 + k * 60, 0, TAU); c.stroke(); c.restore(); } }
    for (const q of s.L) letter(c, q.x, q.y, t, q.ph, { paid: q.paid, stuck: q.st === 'stuck', rot: q.st === 'stuck' ? (q.i - 1) * 0.25 : q.st === 'bounce' ? q.dir * (t - q.at) * 6 : undefined });
    const next = L.shops.find(k => !s.bub[k]);
    if (next && !g.done) { const [cx, cy] = centre(SHOPS[next]); SK.glow(c, g, cx, cy, R); B9.demoPath(g, c, B9.ring(cx, cy, R + 2, R + 2, 30, -Math.PI / 2, 1.05), { period: 2.4 }); }
  },
  auto(g, dt, synth) { lay(g).shops.forEach((k, i) => { const [cx, cy] = centre(SHOPS[k]); B9.botPath(g, synth, 'loop' + i, 1.0 + i * 0.85, B9.ring(cx, cy, R, R, 40, -Math.PI / 2, 1.08), 0.65); }); },
});
