// CLEAR THE RATS! (policy GP-02) — a town full of rats and rubbish. The town's coins sit at the bounty stall, which pays
// one coin for every rat tail brought in. Tails get snipped, the tailless rats scurry behind the shed... which bursts
// open as a rat farm, and the rat meter climbs. Drag the coins, one by one, to the three street sweepers instead: each
// paid sweeper clears the rubbish from its part of the street, the rats there have nothing to eat and leave, and once
// every part is clean the meter falls and stays down. Leave the coins at the stall and the farm overruns the town.
const TAU = Math.PI * 2, STREET = { t: 344, b: 470 }, SHED = { x: 300, y: 336 };
const MAXR = 28, SW = [[226, 'duck'], [278, 'rabbit'], [330, 'beaver']], BOWLY = 588; // the sweepers and their bowls
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
  // the sweepers' corner: a little bowl in front of each sweeper for its pay
  for (const [x] of SW) { o.fillStyle = 'rgba(40,20,30,0.2)'; o.beginPath(); o.ellipse(x, BOWLY + 10, 22, 6, 0, 0, TAU); o.fill(); o.fillStyle = '#6a8ac8'; o.beginPath(); o.moveTo(x - 20, BOWLY - 4); o.quadraticCurveTo(x, BOWLY + 20, x + 20, BOWLY - 4); o.closePath(); o.fill(); o.fillStyle = '#2a3a68'; o.beginPath(); o.ellipse(x, BOWLY - 4, 20, 5, 0, 0, TAU); o.fill(); }
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
MG.add({
  id: 'clearrats', stage: 'policy', cmd: 'CLEAR THE RATS!', time: 6, mood: 'bright', winText: 'Incentives!', failText: 'Rat farm!',
  card: { title: 'Pay for what you really want', kind: 'Policy', ref: 'Perverse incentives (the Hanoi rat bounty, 1902)',
    text: 'In 1902, the French colonial rulers of Hanoi paid people a reward for every rat tail they brought in. Historians report that many people cut off the tails and let the rats go, so the rats could breed more tails. Some even raised rats to sell their tails.\n\nThe reward paid for a sign of success (a tail), not for success itself (fewer rats). A rule like that is called a perverse incentive. Paying sweepers for clean streets rewards what the town actually wants, because rats leave when there is no rubbish to eat.',
    note: 'People do what a reward pays for, so pay for the result you want, not for something that only looks like it.' },
  init(g) {
    const s = g.s, n = g.level >= 2 ? 11 : 9; s.rats = []; s.n0 = n; s.meter = n;
    for (let i = 0; i < n; i++) s.rats.push({ x: 20 + g.rand() * 300, y: STREET.t + 14 + g.rand() * (STREET.b - STREET.t - 20), vx: (g.rand() - 0.5) * 60, vy: 0, ph: g.rand() * 6, tail: true, st: 'roam' });
    s.trash = TRASH.map(p => ({ x: p[0], y: p[1], k: 0 })); s.pays = []; s.sw = SW.map(() => 0);
    s.coins = [0, 1, 2, 3].map(i => ({ x: 70 + i * 26, y: 546 - (i % 2) * 8, hx: 70 + i * 26, hy: 546 - (i % 2) * 8, st: 'stall' }));
    s.payEvery = SK.clamp((g.level >= 2 ? 0.16 : 0.22) * g.dur, 1.0, 4.5); s.nextPay = 1.4; s.Tf = 1.4;
    const over = SK.clamp(0.8 * g.dur, 4.2, 14); s.spawnEvery = (over - s.Tf) / (MAXR - n - 2); s.nextSpawn = 0;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; const c0 = SK.pick(s.coins.filter(q => q.st === 'stall'), x, y, 30); if (c0) { c0.st = 'drag'; SK.dragStart(g, c0, x, y); g.sfx('coin'); } },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const c0 = d.obj; if (g.done) { c0.st = 'stall'; return; }
    const k = SW.findIndex(([x], i) => !s.sw[i] && SK.dist(c0.x, c0.y, x, BOWLY - 6) < 40);
    if (k >= 0) { c0.st = 'paid'; c0.x = SW[k][0]; c0.y = BOWLY - 8; s.sw[k] = g.t; g.sfx('coin'); g.sfx('bell'); g.burst(c0.x, c0.y, ['#f6c445', '#fff6ea'], 10, 120); }
    else { c0.st = 'stall'; c0.x = c0.hx; c0.y = c0.hy; g.sfx('thud'); }
  },
  update(g, dt) {
    const s = g.s, t = g.t, bounty = s.coins.some(q => q.st === 'stall'), zone = x => SK.clamp(Math.floor(x / 120), 0, 2), clean = x => s.sw[zone(x)] && t - s.sw[zone(x)] > 0.5;
    // the bounty: the stall pays out one of its coins for a tail every so often, and the tailless rat runs to the shed
    if (bounty && t >= s.nextPay) {
      s.nextPay = t + s.payEvery; const c0 = s.coins.filter(q => q.st === 'stall').pop(); c0.st = 'spent'; c0.at = t;
      const r = s.rats.find(q => q.st === 'roam' && q.tail && !clean(q.x)); if (r) { r.st = 'snip'; r.tail = false; s.pays.push({ t, x: r.x, y: r.y }); g.burst(r.x - 20, r.y - 4, ['#f6c445', '#fff6ea'], 5, 80); }
      g.sfx('snap'); g.sfx('coin');
    }
    // the rat farm behind the shed: it opens with the first paid tail and keeps breeding rats while tails still pay
    if (!s.farm && t >= s.Tf && s.pays.length) { s.farm = t; s.nextSpawn = t; g.sfx('crunch'); g.shake(6, 0.3); g.burst(SHED.x, SHED.y - 30, ['#8a5a3a', '#c8a070'], 14, 200); }
    if (s.farm && bounty && t >= s.nextSpawn) { s.nextSpawn += s.spawnEvery; s.rats.push({ x: SHED.x - 6 + g.rand() * 12, y: SHED.y + g.rand() * 10, vx: -60 - g.rand() * 140, vy: (g.rand() - 0.2) * 100, ph: g.rand() * 6, tail: true, st: 'roam', heart: g.rand() < 0.3 }); if (g.rand() < 0.5) g.sfx('tap'); }
    // each paid sweeper clears the rubbish in its third of the street
    for (const tr of s.trash) if (s.sw[zone(tr.x)] && t - s.sw[zone(tr.x)] > 0.3) tr.k = Math.min(1, tr.k + dt * 2);
    for (const r of s.rats) {
      if (r.st === 'roam') {
        if (g.rand() < dt * 1.5) { r.vx = (g.rand() - 0.5) * 120; r.vy = (g.rand() - 0.5) * 50; }
        if (clean(r.x)) { const open = [0, 1, 2].filter(z => !s.sw[z]); if (open.length) { const z = open.reduce((a, b) => Math.abs(b * 120 + 60 - r.x) < Math.abs(a * 120 + 60 - r.x) ? b : a); r.vx = Math.sign(z * 120 + 60 - r.x) * 200; } else { r.st = 'flee'; r.vx = r.x < 180 ? -260 : 260; r.vy = 0; } }
      } else if (r.st === 'snip') {
        const dx = SHED.x - r.x, dy = SHED.y - 10 - r.y, d = Math.hypot(dx, dy); r.vx = dx / d * 230; r.vy = dy / d * 230;
        if (d < 12) { r.st = 'roam'; r.tail = true; r.vx = -100; } // tails grow back on the farm, ready to sell again
      }
      if (r.st !== 'gone') { r.x += r.vx * dt; r.y += r.vy * dt; }
      if (r.st === 'roam') { if (r.x < 16) r.vx = Math.abs(r.vx); if (r.x > 344) r.vx = -Math.abs(r.vx); if (r.y < STREET.t + 12) r.vy = Math.abs(r.vy); if (r.y > STREET.b - 4) r.vy = -Math.abs(r.vy); }
      if (r.st === 'flee' && (r.x < -40 || r.x > 400)) r.st = 'gone';
    }
    const vis = s.rats.filter(r => r.st === 'roam' || r.st === 'flee' && r.x > 0 && r.x < 360).length;
    s.meter += (vis - s.meter) * Math.min(1, dt * 4);
    const allPaid = s.sw.every(v => v);
    if (!g.done && allPaid && vis === 0) { g.win(); g.sfx('cheer'); }
    if (!g.done && (vis >= MAXR || !allPaid && !s.coins.some(q => q.st === 'stall' || q.st === 'drag'))) { g.sfx('laugh'); g.shake(5, 0.4); g.fail(); }
  },
  draw(g, c) {
    const s = g.s, t = g.t;
    c.drawImage(g.bake('clearrats', o => paintTown(o)), 0, 0, 360, 640);
    const mx = 88, my = 152, mw = 220, f = SK.clamp(s.meter / MAXR, 0, 1), m0 = s.n0 / MAXR;
    c.fillStyle = 'rgba(40,20,40,0.6)'; c.beginPath(); c.roundRect(mx - 46, my - 22, mw + 58, 44, 22); c.fill();
    rat(c, mx - 24, my + 8, t, 0, { s: 0.9 });
    c.fillStyle = 'rgba(255,255,255,0.18)'; c.beginPath(); c.roundRect(mx, my - 10, mw, 20, 10); c.fill();
    c.fillStyle = f > m0 + 0.04 ? '#ff4a4a' : f < 0.12 ? '#6ad070' : '#f0a040'; c.beginPath(); c.roundRect(mx, my - 10, Math.max(20, mw * f), 20, 10); c.fill();
    c.strokeStyle = '#fff6ea'; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(mx + mw * m0, my - 14); c.lineTo(mx + mw * m0, my + 14); c.stroke(); c.setLineDash([]);
    const open = s.farm && s.coins.some(q => q.st === 'stall');
    if (open) { c.fillStyle = '#2a1420'; c.fillRect(SHED.x - 14, SHED.y - 44, 32, 46); c.save(); c.translate(SHED.x - 14, SHED.y + 2); c.rotate(-1.2); c.fillStyle = '#6a3a24'; c.fillRect(0, -46, 32, 46); c.restore(); c.fillStyle = 'rgba(255,90,120,0.85)'; c.font = '900 16px Nunito, system-ui'; c.textAlign = 'center'; c.fillText('♥', SHED.x + 2 + Math.sin(t * 9) * 5, SHED.y - 64 - ((t * 30) % 22)); }
    else { c.fillStyle = '#5a3020'; c.fillRect(SHED.x - 14, SHED.y - 44, 32, 46); c.fillStyle = '#f6c445'; c.beginPath(); c.arc(SHED.x + 12, SHED.y - 20, 2.5, 0, TAU); c.fill(); }
    // clean parts of the street shine a little
    for (let z = 0; z < 3; z++) if (s.sw[z]) { c.fillStyle = `rgba(255,255,230,${0.18 * SK.clamp((t - s.sw[z]) / 0.6, 0, 1)})`; c.fillRect(z * 120, STREET.t, 120, STREET.b - STREET.t + 12); }
    for (const tr of s.trash) trash(c, tr.x, tr.y, tr.k);
    const rs = s.rats.filter(r => r.st !== 'gone').sort((a, b) => a.y - b.y);
    for (const r of rs) rat(c, r.x, r.y, t, r.ph, { dir: r.vx < 0 ? -1 : 1, tail: r.tail, run: r.st !== 'roam', heart: r.heart });
    // the tail-bringer at the stall (a hedgehog holding up a tail); each paid tail sends a coin flying to it
    const tail = c2 => { c2.strokeStyle = '#e88a9a'; c2.lineWidth = 4; c2.lineCap = 'round'; c2.beginPath(); c2.moveTo(0, 0); c2.bezierCurveTo(6, -14, -6, -20, 4, -32); c2.stroke(); };
    const bounty = s.coins.some(q => q.st === 'stall');
    SK.animal(c, 'hedgehog', 40, 560, 0.75, { t, pose: bounty ? 'carry' : 'idle', expr: bounty ? 'laugh' : 'sad', hold: bounty ? tail : undefined });
    for (const q of s.coins) if (q.st === 'spent') { const k = (t - q.at) / 0.6; if (k < 1) B9.coin(c, SK.lerp(q.hx, 40, k), SK.lerp(q.hy, 520, k) - Math.sin(k * Math.PI) * 40, 11, Math.cos(t * 14)); }
    // the sweepers: waiting behind their bowls, then out in their own part of the street, sweeping
    SW.forEach(([x0, kind], k) => {
      if (!s.sw[k]) { SK.animal(c, kind, x0, 560, 0.62, { t, pose: 'idle', expr: 'think', facing: -1, phase: k }); return; }
      const e = t - s.sw[k], zx = k * 120 + 20, x = zx + 40 + Math.sin(e * 3) * 34, yy = 420 + (k % 2) * 34; SK.animal(c, kind, x, yy, 0.72, { t, pose: 'walk', phase: k });
      const sw = Math.sin(t * 14 + k) * 6; c.strokeStyle = '#8a5a2a'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + 12, yy - 30); c.lineTo(x + 34 + sw, yy); c.stroke(); c.fillStyle = '#e8c050'; c.beginPath(); c.ellipse(x + 36 + sw, yy + 1, 14, 6, 0.3, 0, TAU); c.fill();
    });
    for (const q of s.coins) if (q.st === 'stall' || q.st === 'paid') B9.coin(c, q.x, q.y, 12);
    const held = SK.dragging(g); if (held) B9.coin(c, held.x, held.y - 6, 14);
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'fox', 160, 616, 0.62, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : s.farm ? 'wow' : 'happy' });
    const nc = s.coins.filter(q => q.st === 'stall').pop(), nk = s.sw.findIndex(v => !v);
    if (nc && nk >= 0 && !held && !g.done) { SK.glow(c, g, nc.x, nc.y, 22); SK.demo(g, c, 'drag', [nc.x, nc.y], [SW[nk][0], BOWLY - 6], { delay: 1.6 }); }
  },
  auto(g, dt, synth) { // the bot carries the top coin of the stall to the next unpaid sweeper, one after another
    const s = g.s, Q = s._plan = s._plan || { n: 0 };
    if (Q.cur) { if (SK.bot.drag(g, synth, Q.cur.key, Q.cur.t, Q.cur.a, Q.cur.b, 0.35)) Q.cur = null; return; }
    if (g.done || g.t < 1.0 || g.t < (Q.next || 0)) return; const nc = s.coins.filter(q => q.st === 'stall').pop(), nk = s.sw.findIndex(v => !v); if (!nc || nk < 0) return;
    Q.n++; Q.cur = { key: 'd' + Q.n, t: g.t, a: [nc.x, nc.y], b: [SW[nk][0], BOWLY - 6] }; Q.next = g.t + 0.45;
  },

});
