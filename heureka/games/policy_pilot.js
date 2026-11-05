// PILOT IT! (policy GP-14) — a valley of twelve little farms, some sunny, some shady. The town wants to know whether a
// new plant food helps, before handing it to everyone. The raffle wheel spins and shoots red flags onto a few farms
// picked at random. Drag the watering can of plant food onto each flagged farm (only those: the others are the
// comparison). When every flagged farm is fed, the season passes: every crop grows (sunny ones more), the fed ones a bit
// more again, and two big stalks rise side by side, "With" and "Without", so the difference shows. Feed a farm the raffle
// didn't pick and the test is no longer fair: the owl tears up the chart. If time runs out, the food is dumped on every
// farm at once, nothing is left to compare with, and the owl shrugs. Level 2: four picks, and two farmers on sunny farms
// wave "Me!" to volunteer (feeding them would spoil the test: they were growing faster already).
const TAU = Math.PI * 2;
const COLS = [70, 180, 290], ROWS = [212, 286, 360, 434], PW = 98, PH = 62, CAN = [302, 548], WHEEL = [62, 546];
function paintValley(o) {
  P.sky(o, 360, 640, ['#7ab0d8', '#b8d8ec', '#f0f6e8']);
  P.cloud(o, 80, 140, 0.55); P.cloud(o, 280, 120, 0.45);
  P.hills(o, 360, 186, 22, '#a8d080', '#7aa860', { seed: 9 });
  const gr = o.createLinearGradient(0, 180, 0, 640); gr.addColorStop(0, '#8ac060'); gr.addColorStop(1, '#4a7a40'); o.fillStyle = gr; o.fillRect(0, 178, 360, 462);
  // lanes between the farms
  o.fillStyle = '#e8d8a8'; for (const y of [249, 323, 397]) o.fillRect(0, y - 4, 360, 8); for (const x of [125, 235]) o.fillRect(x - 4, 176, 8, 296);
  o.fillStyle = 'rgba(60,90,40,0.25)'; o.fillRect(0, 470, 360, 6);
  P.grassTufts(o, 360, 480, 630, 30, '#3a6a30', 3); P.flowers(o, 360, 486, 620, 18, undefined, 4);
  // the raffle wheel's stand and the can's stand
  o.fillStyle = '#8a5a3a'; o.fillRect(WHEEL[0] - 4, WHEEL[1], 8, 52); o.fillStyle = 'rgba(30,20,10,0.25)'; o.beginPath(); o.ellipse(WHEEL[0], WHEEL[1] + 52, 30, 6, 0, 0, TAU); o.fill();
  o.fillStyle = '#b07440'; o.beginPath(); o.roundRect(CAN[0] - 38, CAN[1] + 22, 76, 12, 4); o.fill(); o.fillStyle = '#7a4a2a'; o.fillRect(CAN[0] - 32, CAN[1] + 34, 6, 22); o.fillRect(CAN[0] + 26, CAN[1] + 34, 6, 22);
  P.grain(o, 360, 640, 0.035); P.vignette(o, 360, 640, 0.22);
}
function plot(c, p, t, grow, done) {
  const x = p.x - PW / 2, y = p.y - PH / 2;
  c.fillStyle = 'rgba(40,30,10,0.25)'; c.beginPath(); c.roundRect(x + 3, y + 4, PW, PH, 8); c.fill();
  const sg = c.createLinearGradient(0, y, 0, y + PH); sg.addColorStop(0, P.mix('#7a5030', '#b8804a', p.b)); sg.addColorStop(1, P.mix('#5a3a20', '#8a5a30', p.b)); c.fillStyle = sg; c.beginPath(); c.roundRect(x, y, PW, PH, 8); c.fill();
  if (p.b < 0.65) { c.fillStyle = 'rgba(30,30,70,0.25)'; c.beginPath(); c.roundRect(x, y, PW, PH, 8); c.fill(); } else { c.fillStyle = 'rgba(255,240,170,0.18)'; c.beginPath(); c.roundRect(x, y, PW, PH, 8); c.fill(); }
  // rows of crops: their height = how much they have grown
  const h = 6 + grow * 30;
  for (let r = 0; r < 2; r++) for (let i = 0; i < 5; i++) { const cx = x + 12 + i * 18.5, cy = y + 26 + r * 26, sw = Math.sin(t * 2 + i + r + p.x) * 1.5;
    c.strokeStyle = '#3a8a2a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + sw, cy - h); c.stroke();
    c.fillStyle = '#6ac84a'; c.beginPath(); c.ellipse(cx + sw - 4, cy - h * 0.55, 4, 2.2, -0.6, 0, TAU); c.ellipse(cx + sw + 4, cy - h * 0.75, 4, 2.2, 0.6, 0, TAU); c.fill();
    if (grow > 0.6) { c.fillStyle = '#f6c445'; c.beginPath(); c.ellipse(cx + sw, cy - h, 3, 5, 0, 0, TAU); c.fill(); } }
  if (p.fed) { c.strokeStyle = 'rgba(120,255,160,0.9)'; c.lineWidth = 3; c.beginPath(); c.roundRect(x - 2, y - 2, PW + 4, PH + 4, 10); c.stroke(); }
}
function flag(c, x, y, t, ok) { c.strokeStyle = '#5a3a2a'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 34); c.stroke(); const w = Math.sin(t * 6 + x) * 3; c.fillStyle = ok ? '#3ac86a' : '#e8403a'; c.beginPath(); c.moveTo(x, y - 34); c.quadraticCurveTo(x + 12, y - 30 + w, x + 22, y - 27); c.quadraticCurveTo(x + 12, y - 22 + w, x, y - 20); c.closePath(); c.fill(); c.strokeStyle = '#3a1640'; c.lineWidth = 1.5; c.stroke(); }
function wateringCan(c, x, y, tilt) {
  c.save(); c.translate(x, y); c.rotate(tilt);
  c.fillStyle = '#3a9ad8'; c.strokeStyle = '#1a4a7a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-22, -18, 40, 36, 8); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(16, 4); c.lineTo(40, -18); c.lineTo(44, -12); c.lineTo(18, 12); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#5ab8f0'; c.beginPath(); c.ellipse(44, -16, 6, 8, 0.8, 0, TAU); c.fill(); c.stroke();
  c.strokeStyle = '#1a4a7a'; c.lineWidth = 4; c.beginPath(); c.arc(-4, -18, 14, Math.PI, 0); c.stroke();
  c.fillStyle = '#7ad85a'; c.beginPath(); c.roundRect(-14, -6, 24, 12, 4); c.fill(); c.restore();
}
function wheel(c, t, spin) { const [x, y] = WHEEL; c.save(); c.translate(x, y); c.rotate(spin); const cols = ['#e8403a', '#f6c445', '#3a9ad8', '#3ac86a', '#a85ad8', '#ff8a3a'];
  for (let i = 0; i < 6; i++) { c.fillStyle = cols[i]; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 30, i * TAU / 6, (i + 1) * TAU / 6); c.closePath(); c.fill(); } c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 30, 0, TAU); c.stroke(); c.restore();
  SK.ball(c, x, y, 7, '#fff6ea'); c.fillStyle = '#3a1640'; c.beginPath(); c.moveTo(x - 6, y - 38); c.lineTo(x + 6, y - 38); c.lineTo(x, y - 26); c.closePath(); c.fill(); }
const fedCount = s => s.plots.filter(p => p.pick && p.fed).length;
MG.add({
  id: 'pilotit', stage: 'policy', cmd: 'FEED ONLY THE FLAGGED FARMS!', time: 7, mood: 'bright', winText: 'It works!', failText: 'Not a fair test!',
  card: { title: 'Try it on a few first', kind: 'Civics', ref: 'Randomised pilot programs',
    text: 'Before giving the new plant food to every farm, the town tried it on a few farms that a raffle picked. The other farms got nothing, so they showed what would have happened anyway.\n\nSunny farms grow more no matter what. Because the raffle picked the farms, the fed group and the unfed group had about the same mix of sun and shade, so the difference in their crops came from the food.\n\nFarms that volunteer may already be the sunny ones, which would make the food look better than it is. Feeding every farm at once leaves nothing to compare with.',
    note: 'Test a new program on randomly picked places first, and compare them with the places that did not get it.' },
  init(g) {
    const s = g.s, v = SK.variant(g, 4), L2 = g.level >= 2, n = g.level ? 4 : 3;
    s.plots = []; for (const y of ROWS) for (const x of COLS) s.plots.push({ x, y, b: 0.35 + g.rand() * 0.65, pick: false, vol: false, fed: false });
    const order = SK.shuffled(g, s.plots.map((_, i) => i)); order.unshift(...order.splice(v * 2, 1));
    if (L2) { const sunny = order.slice(-6).sort((a, b) => s.plots[b].b - s.plots[a].b).slice(0, 2); for (const i of sunny) { s.plots[i].vol = true; s.plots[i].b = Math.max(s.plots[i].b, 0.9); } }
    let k = 0; for (const i of order) { if (k >= n) break; if (s.plots[i].vol) continue; s.plots[i].pick = true; s.plots[i].fx = 0.25 + k * 0.22; k++; }
    s.n = n; s.can = { x: CAN[0], y: CAN[1] }; s.pour = null; s.ph = 'raffle';
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.ph !== 'feed' || s.pour) return; if (SK.dist(x, y, s.can.x, s.can.y) < 46) { SK.dragStart(g, s.can, x, y); g.sfx('tap'); } },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g, x, y) {
    const s = g.s, r = SK.dragEnd(g); if (!r || !r.obj || g.done) return;
    const p = s.plots.find(q => Math.abs(s.can.x - 20 - q.x) < PW / 2 + 6 && Math.abs(s.can.y + 20 - q.y) < PH / 2 + 10);
    if (!p || p.fed) { s.pour = { back: g.t, fx: s.can.x, fy: s.can.y }; g.sfx('boing'); return; }
    s.pour = { p: s.plots.indexOf(p), t: g.t, fx: s.can.x, fy: s.can.y }; g.sfx('splash');
    if (!p.pick) { p.fed = true; s.ph = 'spoilt'; s.at = g.t; g.sfx('wrong'); }
  },
  update(g, dt) {
    const s = g.s;
    if (s.ph === 'raffle' && g.t > 1.3) s.ph = 'feed';
    if (s.pour && s.pour.p != null && g.t - s.pour.t > 0.45 && s.ph === 'feed') { const p = s.plots[s.pour.p]; if (!p.fed) { p.fed = true; g.sfx('grow'); g.burst(p.x, p.y, ['#7ad85a', '#fff6ea'], 10, 110); } s.pour = { back: g.t, fx: s.can.x, fy: s.can.y };
      if (fedCount(s) >= s.n && !g.done) { s.ph = 'season'; s.at = g.t; g.win(); g.sfx('cheer'); } }
    if (s.pour && s.pour.back != null) { const k = SK.easeOut((g.t - s.pour.back) / 0.3); s.can.x = SK.lerp(s.pour.fx, CAN[0], k); s.can.y = SK.lerp(s.pour.fy, CAN[1], k); if (k >= 1) s.pour = null; }
    if (s.ph === 'spoilt' && g.t - s.at > 0.8 && !g.done) { g.sfx('laugh'); g.fail(); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', dumped = lost && s.ph !== 'spoilt', lt = g.done ? t - g.doneAt : 0;
    c.drawImage(g.bake('pilotit', paintValley), 0, 0, 360, 640);
    const season = won ? SK.easeInOut(lt / 1.0) : 0;
    for (const p of s.plots) { const grow = 0.15 + season * (p.b * 0.55 + (p.fed ? 0.4 : 0)); plot(c, p, t, grow, won); if (dumped) { c.fillStyle = 'rgba(122,216,90,0.35)'; c.fillRect(p.x - PW / 2, p.y - PH / 2, PW, PH); } }
    // the volunteers wave from their sunny farms
    for (const p of s.plots) if (p.vol) { SK.animal(c, 'rabbit', p.x + 30, p.y + 22, 0.5, { t, pose: 'wave', expr: 'happy', noShadow: true }); if (!g.done) SK.tag(c, 'Me!', p.x + 30, p.y - 26, 18, '#3a1640', 'rgba(255,246,234,0.92)'); }
    // the flags fly out of the raffle wheel to the picked farms
    const spin = t < 1.3 ? t * t * 6 : 1.3 * 1.3 * 6 + (t - 1.3) * 0.4;
    for (const p of s.plots) { if (!p.pick) continue; const k = SK.clamp((t - p.fx) / 0.5, 0, 1); if (k <= 0) continue; const fx = SK.lerp(WHEEL[0], p.x - PW / 2 + 10, SK.easeInOut(k)), fy = SK.lerp(WHEEL[1] - 30, p.y + PH / 2 - 4, SK.easeInOut(k)) - Math.sin(k * Math.PI) * 90; flag(c, fx, fy, t, p.fed); }
    wheel(c, t, spin); SK.tag(c, 'Raffle', WHEEL[0], WHEEL[1] + 52, 18);
    // the watering can (tilting and pouring over a farm)
    const pouring = s.pour && s.pour.p != null && g.t - s.pour.t < 0.45, tilt = pouring ? 0.6 : 0;
    wateringCan(c, s.can.x, s.can.y, tilt);
    if (pouring) for (let i = 0; i < 6; i++) { const k = ((t * 3 + i / 6) % 1); c.fillStyle = '#7ad85a'; c.beginPath(); c.arc(s.can.x + 30 + Math.sin(i) * 4, s.can.y - 4 + k * 40, 3, 0, TAU); c.fill(); }
    if (!SK.dragging(g) && !s.pour) SK.tag(c, 'Plant food', CAN[0] - 6, CAN[1] + 70 > 606 ? CAN[1] - 42 : CAN[1] + 70, 18);
    // the owl with the results chart: two stalks, With and Without, once the season has passed
    SK.animal(c, 'owl', 180, 612, 0.85, { t, pose: won ? 'cheer' : dumped ? 'wave' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'think' });
    if (won && lt > 0.6) { const k = SK.easeOut((lt - 0.6) / 0.6), with_ = s.plots.filter(p => p.fed), wo = s.plots.filter(p => !p.fed), avg = a => a.reduce((q, p) => q + p.b * 0.55 + (p.fed ? 0.4 : 0), 0) / a.length;
      c.fillStyle = 'rgba(255,246,234,0.94)'; c.beginPath(); c.roundRect(60, 130, 240, 176, 14); c.fill(); c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.stroke();
      for (const [x, v, col, lab] of [[124, avg(with_), '#3ac86a', 'With'], [236, avg(wo), '#c8a060', 'Without']]) { const h = v * 120 * k; c.fillStyle = col; c.beginPath(); c.roundRect(x - 30, 270 - h, 60, h, 6); c.fill(); c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.stroke(); SK.tag(c, lab, x, 288, 18); } }
    if (lost && s.ph === 'spoilt') { const p = s.plots.find(q => q.fed && !q.pick); if (p) SK.tag(c, 'Not picked!', p.x, p.y - 44, 18, '#ffd0d0'); }
    if (dumped && lt > 0.2) SK.tag(c, 'Compare with what?', 180, 160, 20);
    G2.count(c, 60, 44, fedCount(s), s.n);
    // guidance: the can, the next flagged farm, and the arrow between
    const next = s.ph === 'feed' && !g.done ? s.plots.find(p => p.pick && !p.fed) : null;
    if (next && !s.pour) { const tx = next.x + 20, ty = next.y - 20; SK.grab(c, g, CAN[0], CAN[1], 34); SK.target(c, g, next.x, next.y, 0, { w: PW + 8, h: PH + 8 }); SK.arrow(c, g, CAN[0], CAN[1], next.x, next.y); SK.demo(g, c, 'drag', [CAN[0], CAN[1]], [tx, ty], { delay: 1.5 }); }
    else SK.demo(g, c, 'drag', [0, 0], [1, 1], { never: true });
  },
  auto(g, dt, synth) {
    const s = g.s; if (g.done || s.ph !== 'feed') return;
    if (s._bt) { if (SK.bot.drag(g, synth, s._bt.key, s._bt.t, s._bt.a, s._bt.b, 0.35)) s._bt = null; return; }
    if (s.pour) return; const p = s.plots.find(q => q.pick && !q.fed); if (!p) return; s._bn = (s._bn || 0) + 1;
    s._bt = { key: 'f' + s._bn, t: Math.max(1.5, g.t + 0.1), a: [CAN[0], CAN[1]], b: [p.x + 20, p.y - 20] };
  },
});
