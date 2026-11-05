// CLEAR THE RATS! (policy GP-02) — a town full of rats and rubbish. The town's money bag starts at the bounty stall: it
// pays a coin for every rat tail brought in. Tails get snipped, the tailless rats scurry behind the shed... which bursts
// open as a rat farm, and the rat meter climbs. Drag the money bag over to the street sweepers instead: they sweep the
// rubbish away, the rats have nothing to eat and leave, and the meter falls and stays down. Leave the bag where it is
// and the farm keeps breeding rats until the town is overrun. Paying for the wrong thing.
const TAU = Math.PI * 2, STREET = { t: 344, b: 470 }, SHED = { x: 300, y: 336 };
const BAG0 = [104, 548], BOWL = [272, 566], MAXR = 28;
const TRASH = [[60, 398], [150, 440], [214, 380], [268, 450], [110, 360]];
function paintTown(o) {
  P.sky(o, 360, 640, ['#6aa8d8', '#a8d2ec', '#eef6e6'], { x: 70, y: 70, r: 24, color: '#fff2c0' });
  P.hills(o, 360, 250, 30, '#8ab870', '#6a9a58', { seed: 3 });
  const cols = ['#f0c27a', '#e89a8a', '#a8c8e8', '#f4e0a0', '#b8d8a0', '#e8b0d0'];
  for (let i = 0; i < 6; i++) {
    const x = -6 + i * 62, w = 58, h = 92 + (i % 3) * 18, y = STREET.t - h;
    const gr = o.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, P.shade(cols[i], 0.1)); gr.addColorStop(1, P.shade(cols[i], -0.15)); o.fillStyle = gr; o.fillRect(x, y, w, h);
    o.fillStyle = P.shade(cols[i], -0.45); o.beginPath(); o.moveTo(x - 4, y + 2); o.lineTo(x + w / 2, y - 26); o.lineTo(x + w + 4, y + 2); o.closePath(); o.fill();
    o.fillStyle = '#fff4c8'; for (let r = 0; r < 2; r++) for (let k = 0; k < 2; k++) o.fillRect(x + 10 + k * 24, y + 14 + r * 30, 14, 16);
    o.strokeStyle = 'rgba(60,30,50,0.5)'; o.lineWidth = 2; for (let r = 0; r < 2; r++) for (let k = 0; k < 2; k++) o.strokeRect(x + 10 + k * 24, y + 14 + r * 30, 14, 16);
  }
  // the shed at the right end of the street
  o.fillStyle = '#8a5a3a'; o.fillRect(SHED.x - 30, SHED.y - 60, 64, 62); o.fillStyle = '#6a3a24'; o.beginPath(); o.moveTo(SHED.x - 38, SHED.y - 58); o.lineTo(SHED.x + 2, SHED.y - 84); o.lineTo(SHED.x + 42, SHED.y - 58); o.closePath(); o.fill();
  o.strokeStyle = 'rgba(40,20,10,0.4)'; o.lineWidth = 2; for (let i = 0; i < 6; i++) { o.beginPath(); o.moveTo(SHED.x - 30 + i * 11, SHED.y - 60); o.lineTo(SHED.x - 30 + i * 11, SHED.y + 2); o.stroke(); }
  // the cobbled street
  const st = o.createLinearGradient(0, STREET.t, 0, STREET.b + 20); st.addColorStop(0, '#c8b8a0'); st.addColorStop(1, '#a8957c'); o.fillStyle = st; o.fillRect(0, STREET.t, 360, STREET.b - STREET.t + 24);
  const rnd = P.rng(9); for (let y = STREET.t + 6; y < STREET.b + 20; y += 14) for (let x = (y / 14 % 2) * 12; x < 370; x += 24) { o.fillStyle = `rgba(${rnd() < 0.5 ? '120,100,80' : '230,220,200'},0.35)`; o.beginPath(); o.roundRect(x + rnd() * 3, y, 20, 11, 4); o.fill(); }
  // the market square below: the bounty stall on the left, the sweepers' corner on the right
  o.fillStyle = '#d8c8a8'; o.fillRect(0, 486, 360, 154); const r2 = P.rng(3);
  for (let i = 0; i < 40; i++) { o.fillStyle = `rgba(${r2() < 0.5 ? '150,120,90' : '255,250,230'},0.3)`; o.beginPath(); o.ellipse(r2() * 360, 490 + r2() * 150, 6 + r2() * 10, 3 + r2() * 3, 0, 0, TAU); o.fill(); }
  o.fillStyle = 'rgba(40,20,10,0.25)'; o.fillRect(0, 486, 360, 5);
  // the bounty stall: a counter with a striped canopy and a rat-tail picture
  o.fillStyle = '#8a5a3a'; o.fillRect(18, 504, 8, 60); o.fillRect(172, 504, 8, 60);
  for (let i = 0; i < 6; i++) { o.fillStyle = i % 2 ? '#fff6ea' : '#c84a5a'; o.fillRect(12 + i * 29, 496, 29, 18); }
  B9.wood(o, 14, 562, 170, 22, '#a06a3c', 5); o.fillStyle = '#6a3a24'; o.fillRect(14, 584, 170, 6);
  o.strokeStyle = '#e88a9a'; o.lineWidth = 5; o.lineCap = 'round'; o.beginPath(); o.moveTo(150, 540); o.bezierCurveTo(158, 516, 168, 552, 176, 524); o.stroke();
  // the sweepers' corner: a bowl for their pay and a bin of brooms
  o.fillStyle = 'rgba(40,20,30,0.2)'; o.beginPath(); o.ellipse(BOWL[0], BOWL[1] + 14, 40, 9, 0, 0, TAU); o.fill();
  o.fillStyle = '#6a8ac8'; o.beginPath(); o.moveTo(BOWL[0] - 36, BOWL[1] - 4); o.quadraticCurveTo(BOWL[0], BOWL[1] + 34, BOWL[0] + 36, BOWL[1] - 4); o.closePath(); o.fill();
  o.fillStyle = '#4a6aa8'; o.beginPath(); o.ellipse(BOWL[0], BOWL[1] - 4, 36, 9, 0, 0, TAU); o.fill(); o.fillStyle = '#2a3a68'; o.beginPath(); o.ellipse(BOWL[0], BOWL[1] - 3, 30, 6, 0, 0, TAU); o.fill();
  P.grain(o, 360, 640, 0.04);
}
function rat(c, x, y, t, ph, o = {}) {
  const dir = o.dir || 1, run = o.run ? 1.8 : 1; c.save(); c.translate(x, y); c.scale(dir * (o.s || 1), o.s || 1);
  const bob = Math.abs(Math.sin(t * 12 * run + ph)) * 2;
  if (o.tail !== false) { c.strokeStyle = '#e8909c'; c.lineWidth = 2.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(-12, 0); c.bezierCurveTo(-22, -2 + Math.sin(t * 8 + ph) * 4, -26, 8, -34, 2 + Math.sin(t * 6 + ph) * 5); c.stroke(); }
  else { c.fillStyle = '#e8909c'; c.beginPath(); c.arc(-13, -1, 2.5, 0, TAU); c.fill(); }
  c.fillStyle = '#3a2430'; for (const lx of [-6, 6]) c.fillRect(lx - 1.5, 2, 3, 4 - bob);
  c.fillStyle = '#8a8090'; c.beginPath(); c.ellipse(0, -4 - bob, 14, 8, 0, 0, TAU); c.fill(); c.fillStyle = '#a8a0b0'; c.beginPath(); c.ellipse(-2, -7 - bob, 9, 4, 0, 0, TAU); c.fill();
  c.fillStyle = '#8a8090'; c.beginPath(); c.moveTo(8, -9 - bob); c.lineTo(20, -3 - bob); c.lineTo(8, 1 - bob); c.closePath(); c.fill();
  c.fillStyle = '#e8909c'; c.beginPath(); c.arc(7, -11 - bob, 4, 0, TAU); c.fill(); c.beginPath(); c.arc(20, -3 - bob, 2, 0, TAU); c.fill();
  c.fillStyle = '#1a1020'; c.beginPath(); c.arc(13, -6 - bob, 1.6, 0, TAU); c.fill();
  if (o.heart) { c.fillStyle = '#ff5a7a'; c.font = '900 12px Nunito, system-ui'; c.textAlign = 'center'; c.fillText('♥', 4, -20 - bob - Math.sin(t * 4 + ph) * 3); }
  c.restore();
}
function trash(c, x, y, k) { // a rubbish pile: a bag, a can and a fish bone; k 0..1 sweeps it away
  if (k >= 1) return; c.save(); c.translate(x + k * 60, y); c.globalAlpha = 1 - k; c.rotate(k * 0.8);
  c.fillStyle = 'rgba(40,20,30,0.2)'; c.beginPath(); c.ellipse(0, 4, 20, 5, 0, 0, TAU); c.fill();
  c.fillStyle = '#4a4a5a'; c.beginPath(); c.moveTo(-14, 4); c.quadraticCurveTo(-18, -16, -4, -20); c.lineTo(-2, -26); c.lineTo(2, -20); c.quadraticCurveTo(12, -14, 8, 4); c.closePath(); c.fill();
  c.fillStyle = '#c0c8d0'; c.fillRect(8, -10, 9, 14); c.fillStyle = '#d04040'; c.fillRect(8, -6, 9, 5);
  c.strokeStyle = '#f0e8d8'; c.lineWidth = 2; c.beginPath(); c.moveTo(-22, 2); c.lineTo(-10, 2); for (let i = 0; i < 3; i++) { c.moveTo(-20 + i * 4, -2); c.lineTo(-20 + i * 4, 6); } c.stroke();
  c.restore();
}
function moneyBag(c, x, y, t, lift) {
  c.save(); c.translate(x, y); if (lift) c.rotate(Math.sin(t * 8) * 0.08);
  c.fillStyle = 'rgba(40,20,30,0.25)'; c.beginPath(); c.ellipse(0, 24 + (lift ? 10 : 0), 26, 6, 0, 0, TAU); c.fill();
  const gr = c.createRadialGradient(-8, -4, 4, 0, 6, 30); gr.addColorStop(0, '#f0d090'); gr.addColorStop(1, '#a8783a'); c.fillStyle = gr;
  c.beginPath(); c.moveTo(-10, -16); c.quadraticCurveTo(-32, 0, -24, 18); c.quadraticCurveTo(0, 30, 24, 18); c.quadraticCurveTo(32, 0, 10, -16); c.closePath(); c.fill(); c.strokeStyle = '#6a4420'; c.lineWidth = 2.5; c.stroke();
  c.fillStyle = '#c8402a'; c.fillRect(-11, -19, 22, 6); c.fillStyle = '#a8783a'; c.beginPath(); c.moveTo(-8, -19); c.lineTo(-14, -30); c.lineTo(0, -24); c.lineTo(14, -30); c.lineTo(8, -19); c.closePath(); c.fill(); c.stroke();
  B9.coin(c, 0, 6, 11); c.restore();
}
MG.add({
  id: 'clearrats', stage: 'policy', cmd: 'CLEAR THE RATS!', time: 5, mood: 'bright', winText: 'Rat-free!', failText: 'Rat farm!',
  card: { title: 'Pay for what you really want', kind: 'Policy', ref: 'Perverse incentives (the Hanoi rat bounty, 1902)',
    text: 'In 1902, the French colonial rulers of Hanoi paid people a reward for every rat tail they brought in. Historians report that many people cut off the tails and let the rats go, so the rats could breed more tails. Some even raised rats to sell their tails.\n\nThe reward paid for a sign of success (a tail), not for success itself (fewer rats). A rule like that is called a perverse incentive. Paying for clean streets rewards the thing the town actually wants, because rats leave when there is no rubbish to eat.',
    note: 'People do what a reward pays for, so pay for the result you want, not for something that only looks like it.' },
  init(g) {
    const s = g.s, n = g.level >= 2 ? 11 : 9; s.rats = []; s.n0 = n; s.meter = n;
    for (let i = 0; i < n; i++) s.rats.push({ x: 20 + g.rand() * 300, y: STREET.t + 14 + g.rand() * (STREET.b - STREET.t - 20), vx: (g.rand() - 0.5) * 60, vy: 0, ph: g.rand() * 6, tail: true, st: 'roam' });
    s.trash = TRASH.map(p => ({ x: p[0], y: p[1], k: 0 })); s.bag = { x: BAG0[0], y: BAG0[1] }; s.paid = 0; s.nextSnip = 0.5; s.pays = [];
    s.Tf = 1.5; const over = SK.clamp(0.8 * g.dur, 4.2, 14); s.spawnEvery = (over - s.Tf) / (MAXR - n - 2); s.nextSpawn = 0;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (s.paid || g.done) return; if (SK.dist(x, y, s.bag.x, s.bag.y) < 48) { SK.dragStart(g, s.bag, x, y); g.sfx('coin'); } },
  move(g, x, y) { if (!g.s.paid) SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || s.paid || g.done) return;
    if (SK.dist(s.bag.x, s.bag.y, BOWL[0], BOWL[1] - 10) < 70) { s.bag.x = BOWL[0]; s.bag.y = BOWL[1] - 14; s.paid = g.t; g.sfx('coin'); g.sfx('bell'); g.burst(BOWL[0], BOWL[1] - 20, ['#f6c445', '#fff6ea'], 14, 140); }
    else { s.bag.x = BAG0[0]; s.bag.y = BAG0[1]; g.sfx('thud'); }
  },
  update(g, dt) {
    const s = g.s, e = s.paid ? g.t - s.paid : -1, held = SK.dragging(g) === s.bag, sweep = -40 + e * 260;
    // the bounty: while the bag sits at the stall, it pays a coin for each tail, and a tailless rat runs to the shed
    if (!s.paid && !held && g.t >= s.nextSnip) {
      const r = s.rats.find(q => q.st === 'roam' && q.tail); s.nextSnip = g.t + 0.32;
      if (r) { r.st = 'snip'; r.tail = false; s.pays.push({ t: g.t, x: r.x, y: r.y }); g.sfx('snap'); g.sfx('coin'); g.burst(r.x - 20, r.y - 4, ['#f6c445', '#fff6ea'], 5, 80); }
    }
    // the rat farm behind the shed: it opens, and keeps breeding rats for as long as tails pay
    if (!s.farm && g.t >= s.Tf && !s.paid) { s.farm = g.t; s.nextSpawn = g.t; g.sfx('crunch'); g.shake(6, 0.3); g.burst(SHED.x, SHED.y - 30, ['#8a5a3a', '#c8a070'], 14, 200); for (const r of s.rats) if (r.st === 'shed') { r.st = 'roam'; r.tail = true; r.x = SHED.x; r.y = SHED.y; r.vx = -100; } }
    if (s.farm && !s.paid && g.t >= s.nextSpawn) { s.nextSpawn += s.spawnEvery; for (let k = 0; k < 1; k++) s.rats.push({ x: SHED.x - 6 + g.rand() * 12, y: SHED.y + g.rand() * 10, vx: -60 - g.rand() * 140, vy: (g.rand() - 0.2) * 100, ph: g.rand() * 6, tail: true, st: 'roam', heart: g.rand() < 0.3 }); if (g.rand() < 0.5) g.sfx('tap'); }
    if (s.paid) for (const tr of s.trash) if (sweep > tr.x - 10) tr.k = Math.min(1, tr.k + dt * 2.5);
    for (const r of s.rats) {
      if (r.st === 'roam') {
        if (g.rand() < dt * 1.5) { r.vx = (g.rand() - 0.5) * 120; r.vy = (g.rand() - 0.5) * 50; }
        if (s.paid && (sweep > r.x - 40 || e > 1.2)) { r.st = 'flee'; r.vx = r.x < 200 ? -260 : 260; r.vy = 0; }
      } else if (r.st === 'snip') {
        const dx = SHED.x - r.x, dy = SHED.y - 10 - r.y, d = Math.hypot(dx, dy); r.vx = dx / d * 230; r.vy = dy / d * 230; if (d < 12) r.st = s.farm && !s.paid ? 'roam' : 'shed';
        if (r.st === 'roam') { r.tail = true; r.vx = -100; } // tails grow back on the farm, ready to sell again
      }
      if (r.st !== 'shed' && r.st !== 'gone') { r.x += r.vx * dt; r.y += r.vy * dt; }
      if (r.st === 'roam') { if (r.x < 16) r.vx = Math.abs(r.vx); if (r.x > 344) r.vx = -Math.abs(r.vx); if (r.y < STREET.t + 12) r.vy = Math.abs(r.vy); if (r.y > STREET.b - 4) r.vy = -Math.abs(r.vy); }
      if (r.st === 'flee' && (r.x < -40 || r.x > 400)) r.st = 'gone';
    }
    const vis = s.rats.filter(r => r.st === 'roam' || r.st === 'flee' && r.x > 0 && r.x < 360).length;
    s.meter += (vis - s.meter) * Math.min(1, dt * 4);
    if (!g.done && s.paid && e > 1.9) { g.win(); g.sfx('cheer'); }
    if (!g.done && vis >= MAXR) { g.sfx('laugh'); g.shake(5, 0.4); g.fail(); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, e = s.paid ? t - s.paid : -1, sweep = -40 + e * 260;
    c.drawImage(g.bake('clearrats', o => paintTown(o)), 0, 0, 360, 640);
    // the rat meter: its fill is how many rats are about; the dashed tick marks where it started
    const mx = 88, my = 152, mw = 220, f = SK.clamp(s.meter / MAXR, 0, 1), m0 = s.n0 / MAXR;
    c.fillStyle = 'rgba(40,20,40,0.6)'; c.beginPath(); c.roundRect(mx - 46, my - 22, mw + 58, 44, 22); c.fill();
    rat(c, mx - 24, my + 8, t, 0, { s: 0.9 });
    c.fillStyle = 'rgba(255,255,255,0.18)'; c.beginPath(); c.roundRect(mx, my - 10, mw, 20, 10); c.fill();
    c.fillStyle = f > m0 + 0.04 ? '#ff4a4a' : f < 0.12 ? '#6ad070' : '#f0a040'; c.beginPath(); c.roundRect(mx, my - 10, Math.max(20, mw * f), 20, 10); c.fill();
    c.strokeStyle = '#fff6ea'; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(mx + mw * m0, my - 14); c.lineTo(mx + mw * m0, my + 14); c.stroke(); c.setLineDash([]);
    // the shed door: shut, then blown open by the rat farm, then shut again once tails stop paying
    const open = s.farm && !(s.paid && e > 0.4);
    if (open) { c.fillStyle = '#2a1420'; c.fillRect(SHED.x - 14, SHED.y - 44, 32, 46); c.save(); c.translate(SHED.x - 14, SHED.y + 2); c.rotate(-1.2); c.fillStyle = '#6a3a24'; c.fillRect(0, -46, 32, 46); c.restore(); c.fillStyle = 'rgba(255,90,120,0.85)'; c.font = '900 16px Nunito, system-ui'; c.textAlign = 'center'; c.fillText('♥', SHED.x + 2 + Math.sin(t * 9) * 5, SHED.y - 64 - ((t * 30) % 22)); }
    else { c.fillStyle = '#5a3020'; c.fillRect(SHED.x - 14, SHED.y - 44, 32, 46); c.fillStyle = '#f6c445'; c.beginPath(); c.arc(SHED.x + 12, SHED.y - 20, 2.5, 0, TAU); c.fill(); }
    for (const tr of s.trash) trash(c, tr.x, tr.y, tr.k);
    const rs = s.rats.filter(r => r.st !== 'shed' && r.st !== 'gone').sort((a, b) => a.y - b.y);
    for (const r of rs) rat(c, r.x, r.y, t, r.ph, { dir: r.vx < 0 ? -1 : 1, tail: r.tail, run: r.st !== 'roam', heart: r.heart });
    // the tail-bringer at the stall (a hedgehog holding up a tail); each tail flies to the stall and a coin flies back
    const tail = c2 => { c2.strokeStyle = '#e88a9a'; c2.lineWidth = 4; c2.lineCap = 'round'; c2.beginPath(); c2.moveTo(0, 0); c2.bezierCurveTo(6, -14, -6, -20, 4, -32); c2.stroke(); };
    if (!s.paid) SK.animal(c, 'hedgehog', 50, 560, 0.75, { t, pose: 'carry', expr: 'laugh', hold: tail });
    else if (e < 1) SK.animal(c, 'hedgehog', 50 - e * 120, 560, 0.75, { t, pose: 'walk', expr: 'sad', facing: -1 });
    for (const p of s.pays) { const k = (t - p.t) / 0.6; if (k < 1) B9.coin(c, SK.lerp(BAG0[0], 60, k), SK.lerp(BAG0[1] - 20, 520, k) - Math.sin(k * Math.PI) * 40, 8, Math.cos(t * 14)); }
    // the sweepers: waiting by the bowl, then out in the street sweeping left to right
    const sweepers = [['duck', 228, 0], ['beaver', 322, 1]];
    for (const [kind, x0, k] of sweepers) {
      if (!s.paid) SK.animal(c, kind, x0, 616, 0.72, { t, pose: 'idle', expr: 'think', facing: k ? -1 : 1, phase: k });
      else { const yy = 410 + k * 56, x = sweep - k * 50; if (x < 420) { SK.animal(c, kind, x, yy, 0.8, { t, pose: 'walk', phase: k }); const sw = Math.sin(t * 14 + k) * 6; c.strokeStyle = '#8a5a2a'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + 12, yy - 34); c.lineTo(x + 38 + sw, yy); c.stroke(); c.fillStyle = '#e8c050'; c.beginPath(); c.ellipse(x + 40 + sw, yy + 1, 15, 6, 0.3, 0, TAU); c.fill(); c.fillStyle = 'rgba(200,180,150,0.5)'; for (let q = 0; q < 3; q++) { c.beginPath(); c.arc(x + 56 + q * 8 + sw, yy - 4 - q * 3, 4 - q, 0, TAU); c.fill(); } } }
      if (!s.paid) { c.strokeStyle = '#8a5a2a'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0 + (k ? -22 : 22), 560); c.lineTo(x0 + (k ? -26 : 26), 612); c.stroke(); c.fillStyle = '#e8c050'; c.beginPath(); c.ellipse(x0 + (k ? -26 : 26), 612, 10, 5, 0, 0, TAU); c.fill(); }
    }
    const held = SK.dragging(g) === s.bag; moneyBag(c, s.bag.x, s.bag.y - (held ? 10 : 0), t, held);
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'fox', 168, 612, 0.7, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : s.farm ? 'wow' : 'happy' });
    if (!s.paid && !held) SK.glow(c, g, s.bag.x, s.bag.y, 34);
    SK.demo(g, c, 'drag', [BAG0[0], BAG0[1]], [BOWL[0], BOWL[1] - 14], { delay: 1.6 });
  },
  auto(g, dt, synth) { SK.bot.drag(g, synth, 'bag', 1.8, [BAG0[0], BAG0[1]], [BOWL[0], BOWL[1] - 14], 0.4); },
});
