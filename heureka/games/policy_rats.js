// CLEAR THE RATS! (policy GP-02) — a town full of rats. Tap a rat to catch it: its tail goes to the bounty stall
// ("Bounty: 1 coin per tail"), which pays a coin. It works at first... then the shed opens as a rat farm, the coins
// flow along a dotted path from the stall to the farm, and the farm breeds rats faster than you can catch them. Tap the
// bounty stall to shut it: the coins stop, the farm closes, and now your catching clears the street. Keep catching
// with the bounty open and the town is overrun.
const TAU = Math.PI * 2, STREET = { t: 344, b: 474 }, SHED = { x: 300, y: 336 }, MAXR = 24, STALL = { x0: 14, x1: 184, y0: 492, y1: 592 }, TILL = [150, 548];
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
MG.add({
  id: 'clearrats', stage: 'policy', cmd: 'CATCH ALL THE RATS!', time: 7, mood: 'bright', winText: 'Rats gone for good!', failText: 'Rat farm!',
  card: { title: 'Pay for what you really want', kind: 'Policy', ref: 'Perverse incentives (the Hanoi rat bounty, 1902)',
    text: 'In 1902, the French colonial rulers of Hanoi paid people a reward for every rat tail they brought in. Historians report that many people cut off the tails and let the rats go, so the rats could breed more tails. Some even raised rats to sell their tails.\n\nThe reward paid for a sign of success (a tail), not for success itself (fewer rats). A rule like that is called a perverse incentive. Here the rat farm lived on the bounty\'s coins; once the bounty stopped, the farm had no reason to breed rats, and catching them finally worked.',
    note: 'People do what a reward pays for, so pay for the result you want, not for something that only looks like it.' },
  init(g) {
    const s = g.s, n = g.level >= 2 ? 8 : 6; s.rats = []; s.n0 = n; s.meter = n; s.pays = []; s.flow = []; s.poofs = [];
    for (let i = 0; i < n; i++) s.rats.push({ x: 24 + g.rand() * 300, y: STREET.t + 18 + g.rand() * (STREET.b - STREET.t - 30), vx: (g.rand() - 0.5) * 80, vy: 0, ph: g.rand() * 6, st: 'roam' });
    s.sp = g.level >= 2 ? 1.5 : 1; s.closed = 0;
    s.spawnEvery = SK.clamp(0.04 * g.dur, 0.45, 1.1); s.nextSpawn = 0;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    if (!s.closed && x > STALL.x0 && x < STALL.x1 && y > STALL.y0 - 20 && y < STALL.y1) { s.closed = g.t; g.sfx('snap'); g.sfx('bell'); g.shake(3, 0.15); return; }
    let best = null, bd = 34; for (const r of s.rats) { if (r.st !== 'roam') continue; const d = SK.dist(x, y, r.x, r.y - 6); if (d < bd) { bd = d; best = r; } }
    if (!best) { g.sfx('tap'); return; }
    best.st = 'caught'; s.poofs.push({ x: best.x, y: best.y, t: g.t }); g.sfx('pop'); g.burst(best.x, best.y, ['#a8a0b0', '#fff6ea'], 8, 110);
    // while the bounty is open, the tail is traded at the stall for a coin, and the coin goes to the rat farm
    if (!s.closed) { s.pays.push({ t: g.t, x: best.x, y: best.y }); if (!s.farm) s.farmAt = s.farmAt || g.t + 0.9; }
  },
  update(g, dt) {
    const s = g.s, t = g.t;
    for (const p of s.pays) if (!p.paid && t - p.t > 0.45) { p.paid = true; g.sfx('coin'); s.flow.push({ t }); }
    if (!s.farm && s.farmAt && t >= s.farmAt && !s.closed) { s.farm = t; s.nextSpawn = t + 0.2; g.sfx('crunch'); g.shake(6, 0.3); g.burst(SHED.x, SHED.y - 30, ['#8a5a3a', '#c8a070'], 14, 200); }
    const breeding = s.farm && !(s.closed && t - s.closed > 0.5);
    const born = (n) => { for (let k = 0; k < n; k++) s.rats.push({ x: SHED.x - 6 + g.rand() * 12, y: SHED.y + 4 + g.rand() * 10, vx: -80 - g.rand() * 120, vy: 40 + g.rand() * 60, ph: g.rand() * 6, st: 'roam', heart: g.rand() < 0.3 }); };
    // each coin that reaches the farm pays for two more rats: catching rats for the bounty breeds more of them
    for (const q of s.flow) if (!q.done && t - q.t >= 0.9) { q.done = true; if (s.farm && breeding) { born(2); g.sfx('pop'); } }
    if (breeding && t >= s.nextSpawn) { s.nextSpawn = t + s.spawnEvery; s.rats.push({ x: SHED.x - 6 + g.rand() * 12, y: SHED.y + 4 + g.rand() * 10, vx: -80 - g.rand() * 120, vy: 40 + g.rand() * 60, ph: g.rand() * 6, st: 'roam', heart: g.rand() < 0.3 }); if (g.rand() < 0.5) g.sfx('tap'); }
    for (const r of s.rats) {
      if (r.st !== 'roam') continue;
      if (g.rand() < dt * 1.5) { r.vx = (g.rand() - 0.5) * 140 * s.sp; r.vy = (g.rand() - 0.5) * 60 * s.sp; }
      r.x += r.vx * dt; r.y += r.vy * dt;
      if (r.x < 20) r.vx = Math.abs(r.vx); if (r.x > 340) r.vx = -Math.abs(r.vx); if (r.y < STREET.t + 18) r.vy = Math.abs(r.vy); if (r.y > STREET.b - 6) r.vy = -Math.abs(r.vy);
    }
    const vis = s.rats.filter(r => r.st === 'roam').length;
    s.meter += (vis - s.meter) * Math.min(1, dt * 5);
    if (!g.done && vis === 0 && (s.closed || !s.farmAt)) { if (s.closed) { g.win(); g.sfx('cheer'); } }
    if (!g.done && vis >= MAXR) { g.sfx('laugh'); g.shake(5, 0.4); g.fail(); }
  },
  draw(g, c) {
    const s = g.s, t = g.t;
    c.drawImage(g.bake('clearrats2', o => paintTown(o)), 0, 0, 360, 640);
    // the rat meter
    const mx = 88, my = 152, mw = 220, f = SK.clamp(s.meter / MAXR, 0, 1), m0 = s.n0 / MAXR;
    c.fillStyle = 'rgba(40,20,40,0.6)'; c.beginPath(); c.roundRect(mx - 46, my - 22, mw + 58, 44, 22); c.fill();
    rat(c, mx - 24, my + 8, t, 0, { s: 0.9 });
    c.fillStyle = 'rgba(255,255,255,0.18)'; c.beginPath(); c.roundRect(mx, my - 10, mw, 20, 10); c.fill();
    c.fillStyle = f > m0 + 0.04 ? '#ff4a4a' : f < 0.1 ? '#6ad070' : '#f0a040'; c.beginPath(); c.roundRect(mx, my - 10, Math.max(20, mw * f), 20, 10); c.fill();
    c.strokeStyle = '#fff6ea'; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(mx + mw * m0, my - 14); c.lineTo(mx + mw * m0, my + 14); c.stroke(); c.setLineDash([]);
    // the shed: shut, then a rat farm while the bounty pays, then shut again once the bounty closes
    const open = s.farm && !(s.closed && t - s.closed > 0.5);
    if (open) { c.fillStyle = '#2a1420'; c.fillRect(SHED.x - 14, SHED.y - 44, 32, 46); c.save(); c.translate(SHED.x - 14, SHED.y + 2); c.rotate(-1.2); c.fillStyle = '#6a3a24'; c.fillRect(0, -46, 32, 46); c.restore(); c.fillStyle = 'rgba(255,90,120,0.85)'; c.font = '900 16px Nunito, system-ui'; c.textAlign = 'center'; c.fillText('♥', SHED.x + 2 + Math.sin(t * 9) * 5, SHED.y - 64 - ((t * 30) % 22)); }
    else { c.fillStyle = '#5a3020'; c.fillRect(SHED.x - 14, SHED.y - 44, 32, 46); c.fillStyle = '#f6c445'; c.beginPath(); c.arc(SHED.x + 12, SHED.y - 20, 2.5, 0, TAU); c.fill(); }
    if (s.farm) SK.tag(c, 'Rat farm', SHED.x - 4, SHED.y - 104, 18, open ? '#ffd0d0' : '#c8c0c8');
    // the dotted coin path from the stall's till up to the farm, with coins travelling along it
    if (s.farm) { const path = [[TILL[0], TILL[1] - 20], [240, 500], [SHED.x + 20, SHED.y + 6]]; c.save(); c.globalAlpha = open ? 0.85 : 0.3; c.strokeStyle = '#f6c445'; c.lineWidth = 4; c.setLineDash([3, 9]); c.lineCap = 'round'; c.lineDashOffset = -t * 40; c.beginPath(); c.moveTo(path[0][0], path[0][1]); c.quadraticCurveTo(path[1][0], path[1][1], path[2][0], path[2][1]); c.stroke(); c.restore();
      for (const q of s.flow) { const k = (t - q.t) / 0.9; if (k < 1) { const a = path[0], b = path[1], e = path[2], u = 1 - k, x = u * u * a[0] + 2 * u * k * b[0] + k * k * e[0], y = u * u * a[1] + 2 * u * k * b[1] + k * k * e[1]; B9.coin(c, x, y, 9, Math.cos(t * 14)); } } }
    const rs = s.rats.filter(r => r.st === 'roam').sort((a, b) => a.y - b.y);
    for (const r of rs) rat(c, r.x, r.y, t, r.ph, { dir: r.vx < 0 ? -1 : 1, s: 1.45, heart: r.heart });
    for (const p of s.poofs) { const k = (t - p.t) / 0.35; if (k < 1) { c.save(); c.globalAlpha = 1 - k; c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.beginPath(); c.arc(p.x, p.y - 6, 14 + k * 20, 0, TAU); c.stroke(); c.restore(); } }
    // tails flying to the stall, and the stall paying a coin for each
    for (const p of s.pays) { const k = (t - p.t) / 0.45; if (k < 1) { const x = SK.lerp(p.x, TILL[0], k), y = SK.lerp(p.y, TILL[1], k) - Math.sin(k * Math.PI) * 50; c.strokeStyle = '#e8909c'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 10, y); c.bezierCurveTo(x - 4, y - 10, x + 4, y + 10, x + 10, y); c.stroke(); } }
    // the bounty stall: its sign, its till of coins, and the hedgehog trading in tails
    if (s.closed) { c.save(); c.strokeStyle = 'rgba(200,30,40,0.9)'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(STALL.x0 + 10, STALL.y0 + 4); c.lineTo(STALL.x1 - 10, STALL.y1 - 8); c.moveTo(STALL.x1 - 10, STALL.y0 + 4); c.lineTo(STALL.x0 + 10, STALL.y1 - 8); c.stroke(); c.restore(); }
    SK.tag(c, s.closed ? 'Bounty: closed' : 'Bounty: 1 coin per tail', 128, 512, 18, s.closed ? '#c8c0c8' : '#ffe9a0', s.closed ? 'rgba(120,20,30,0.85)' : undefined);
    for (let i = 0; i < 5; i++) B9.coin(c, TILL[0] - 16 + (i % 3) * 14, TILL[1] - 2 - Math.floor(i / 3) * 10, 9);
    const tail = c2 => { c2.strokeStyle = '#e88a9a'; c2.lineWidth = 4; c2.lineCap = 'round'; c2.beginPath(); c2.moveTo(0, 0); c2.bezierCurveTo(6, -14, -6, -20, 4, -32); c2.stroke(); };
    SK.animal(c, 'hedgehog', 50, 572, 0.75, { t, pose: s.closed ? 'idle' : 'carry', expr: s.closed ? 'sad' : 'laugh', hold: s.closed ? undefined : tail });
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'fox', 290, 612, 0.85, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : s.farm && !s.closed ? 'wow' : 'happy', facing: -1 });
    // guidance: the stall once the farm is breeding, otherwise the nearest rat
    const target = s.farm && !s.closed ? [99, 548] : (() => { const r = rs[0]; return r ? [r.x, r.y - 6] : null; })();
    if (target && !g.done) { SK.glow(c, g, target[0], target[1], s.farm && !s.closed ? 60 : 26); SK.demo(g, c, 'tap', target, null, { delay: 1.0 }); }
  },
  auto(g, dt, synth) { // the bot catches rats; once the farm opens, it shuts the bounty stall, then catches the rest
    const s = g.s, Q = s._plan = s._plan || {}; if (g.done || g.t < 1.0 || g.t < (Q.next || 0)) return; Q.next = g.t + 0.3;
    if (s.farm && !s.closed && g.t - s.farm > 0.4) { synth('down', 99, 548); synth('up', 99, 548); return; }
    const r = s.rats.find(q => q.st === 'roam'); if (r) { synth('down', r.x, r.y - 6); synth('up', r.x, r.y - 6); }
  },
});
