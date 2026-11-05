// SLIP THROUGH! (chem_bio APB-04) — a cell membrane runs across the screen: outside (water) above, the cell below.
// Drag each molecule down into the cell. Oxygen slips straight through the fatty layer anywhere. Glucose bounces off
// the fat and only fits through its hexagon-shaped carrier protein. Potassium sits in the pump's round pocket, and you
// tap the pump three times (each tap spends one ATP) to push it in. Level 1 has more molecules; level 2 adds water,
// which crosses fastest through its own narrow water channel.
const MY = 318, MH = 46, INSIDE = 470; // membrane centre line, thickness, where molecules settle inside
const LV = [
  { mols: ['o2', 'glu', 'k'], prot: { glu: 156, pump: 282 } },
  { mols: ['o2', 'o2', 'glu', 'k'], prot: { glu: 156, pump: 282 } },
  { mols: ['o2', 'glu', 'k', 'h2o', 'h2o'], prot: { glu: 142, h2o: 216, pump: 298 } },
];
const NAME = { o2: 'Oxygen', glu: 'Glucose', k: 'Potassium', h2o: 'Water' };

function paintMembrane(o, L) {
  const out = o.createLinearGradient(0, 0, 0, MY); out.addColorStop(0, '#8ad8f0'); out.addColorStop(1, '#5ab8e0'); o.fillStyle = out; o.fillRect(0, 0, 360, MY);
  const inn = o.createLinearGradient(0, MY, 0, 640); inn.addColorStop(0, '#ffe8c8'); inn.addColorStop(1, '#f4c8a0'); o.fillStyle = inn; o.fillRect(0, MY, 360, 640 - MY);
  const rnd = P.rng(21);
  for (let i = 0; i < 30; i++) { o.fillStyle = 'rgba(255,255,255,0.25)'; o.beginPath(); o.arc(rnd() * 360, rnd() * (MY - 40), 2 + rnd() * 5, 0, 7); o.fill(); }
  for (let i = 0; i < 40; i++) { o.fillStyle = 'rgba(200,130,90,0.18)'; o.beginPath(); o.arc(rnd() * 360, MY + 40 + rnd() * 280, 2 + rnd() * 6, 0, 7); o.fill(); }
  // the lipid bilayer: two rows of round heads with wavy tails meeting in the middle
  o.fillStyle = '#ffe9a0'; o.fillRect(0, MY - MH / 2 + 6, 360, MH - 12);
  for (let x = 4; x < 364; x += 10) for (const s of [-1, 1]) {
    o.strokeStyle = '#d8a850'; o.lineWidth = 1.6; o.beginPath(); o.moveTo(x - 2, MY + s * (MH / 2 - 5)); o.quadraticCurveTo(x - 4, MY + s * 10, x - 2, MY + s * 2); o.moveTo(x + 2, MY + s * (MH / 2 - 5)); o.quadraticCurveTo(x + 4, MY + s * 10, x + 2, MY + s * 2); o.stroke();
    o.fillStyle = '#f08a7a'; o.strokeStyle = '#b8504a'; o.lineWidth = 1.2; o.beginPath(); o.arc(x, MY + s * (MH / 2 - 3), 5, 0, 7); o.fill(); o.stroke();
  }
}
function mol(c, kind, x, y, t, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (kind === 'o2') { for (const d of [-8, 8]) SK.ball(c, d, 0, 10, '#ff5a4a'); }
  else if (kind === 'glu') { c.rotate(Math.sin(t * 1.5) * 0.1); c.fillStyle = '#fff6ea'; c.strokeStyle = '#c89a30'; c.lineWidth = 3; c.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + Math.PI / 6; i ? c.lineTo(Math.cos(a) * 17, Math.sin(a) * 17) : c.moveTo(Math.cos(a) * 17, Math.sin(a) * 17); } c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#ffd25a'; c.beginPath(); c.arc(0, 0, 6, 0, 7); c.fill(); }
  else if (kind === 'k') { SK.ball(c, 0, 0, 14, '#a86ae8'); c.strokeStyle = '#fff'; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(-6, 0); c.lineTo(6, 0); c.moveTo(0, -6); c.lineTo(0, 6); c.stroke(); }
  else if (kind === 'h2o') { SK.ball(c, 0, 2, 10, '#ff6a5a'); for (const d of [-1, 1]) SK.ball(c, d * 10, -6, 6, '#f4f8ff'); }
  c.restore();
}

MG.add({
  id: 'cells_slip', stage: 'cells', cmd: 'GET EVERY MOLECULE INSIDE!', time: 7, mood: 'sea', winText: 'All inside!', failText: 'Still outside!',
  card: { title: 'Ways into a cell', kind: 'Biology', ref: 'Membrane transport',
    text: "A cell is wrapped in a membrane, a thin double layer of fatty molecules. Small molecules that mix with fat, like oxygen, slip straight through it.\n\nSugar (glucose) and charged particles called ions can't cross the fatty layer. They go through protein doors in the membrane. A carrier lets glucose through when there is more of it outside than inside. A pump uses ATP, the cell's energy molecule, to push potassium in even when the cell already has more inside.\n\nWater crosses slowly on its own, and much faster through water channels called aquaporins.",
    note: 'Oxygen slips through the membrane itself; glucose, ions and most water need protein doors, and a pump needs energy.' },
  init(g) {
    const s = g.s, L = LV[Math.min(2, g.level)];
    s.v = SK.variant(g, 4); s.prot = {}; for (const k in L.prot) s.prot[k] = s.v % 2 ? 360 - L.prot[k] : L.prot[k];
    s.L = L; s.m = []; const ks = L.mols.slice();
    for (let i = ks.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [ks[i], ks[j]] = [ks[j], ks[i]]; }
    ks.forEach((k, i) => { const hx = 50 + i * (260 / Math.max(1, ks.length - 1)), hy = 214 + ((i + (s.v >> 1)) % 2) * 50; s.m.push({ kind: k, x: hx, y: hy, hx, hy, ph: g.rand() * 6, st: 'wait', at: 0 }); });
    s.pumpTaps = 0; s.pumpAt = -9; s.pumpMol = null; s.bounce = -9; s.atp = [];
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    const px = s.prot.pump;
    if (s.pumpMol && SK.dist(x, y, px, MY) < 50) { s.pumpTaps++; s.pumpAt = g.t; s.atp.push(g.t); g.sfx('click'); g.sfx('sweep'); if (s.pumpTaps >= 3) { const m = s.pumpMol; m.st = 'cross'; m.from = [px, MY]; m.to = [px + (g.rand() - 0.5) * 40, INSIDE + g.rand() * 60]; m.at = g.t; s.pumpMol = null; s.pumpTaps = 0; g.sfx('pop'); } return; }
    const m = SK.pick(s.m.filter(q => q.st === 'wait'), x, y, 44); if (m) { m.st = 'drag'; SK.dragStart(g, m, x, y); g.sfx('tap'); }
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const m = d.obj, P2 = s.prot;
    if (g.done || m.y < MY - MH) { m.st = 'home'; m.from = [m.x, m.y]; m.at = g.t; return; }
    const near = (k, r) => P2[k] != null && Math.abs(m.x - P2[k]) < r;
    if (m.kind === 'o2') { m.st = 'cross'; m.from = [m.x, Math.min(m.y, MY - 20)]; m.to = [m.x, INSIDE + g.rand() * 60]; m.at = g.t; g.sfx('swoosh'); return; }
    if (m.kind === 'glu' && near('glu', 34)) { m.st = 'cross'; m.from = [P2.glu, MY - 30]; m.to = [P2.glu + (g.rand() - 0.5) * 40, INSIDE + g.rand() * 60]; m.at = g.t; g.sfx('click'); return; }
    if (m.kind === 'h2o' && near('h2o', 30)) { m.st = 'cross'; m.from = [P2.h2o, MY - 30]; m.to = [P2.h2o + (g.rand() - 0.5) * 40, INSIDE + g.rand() * 60]; m.at = g.t; g.sfx('drip'); return; }
    if (m.kind === 'k' && near('pump', 38) && !s.pumpMol) { m.st = 'pump'; m.x = P2.pump; m.y = MY - 22; s.pumpMol = m; s.pumpTaps = 0; g.sfx('click'); return; }
    // anything else hits the fatty layer and bounces back out
    m.st = 'home'; m.from = [m.x, MY - 30]; m.at = g.t; m.bounce = true; s.bounce = g.t; g.sfx('boing');
  },
  update(g, dt) {
    const s = g.s;
    for (const m of s.m) {
      if (m.st === 'wait') { m.x = m.hx + Math.sin(g.t * 1.2 + m.ph) * 8; m.y = m.hy + Math.cos(g.t * 1.6 + m.ph) * 6; }
      if (m.st === 'home') { const k = Math.min(1, (g.t - m.at) / 0.4); m.x = SK.lerp(m.from[0], m.hx, SK.easeOut(k)); m.y = SK.lerp(m.from[1], m.hy, SK.easeOut(k)) - (m.bounce ? Math.sin(k * Math.PI) * 40 : 0); if (k >= 1) { m.st = 'wait'; m.bounce = false; } }
      if (m.st === 'cross') { const dur = m.kind === 'o2' ? 0.7 : 0.5, k = Math.min(1, (g.t - m.at) / dur); m.x = SK.lerp(m.from[0], m.to[0], k) + (m.kind === 'o2' ? Math.sin(k * 20) * 6 * (1 - k) : 0); m.y = SK.lerp(m.from[1], m.to[1], SK.easeInOut(k)); if (k >= 1) { m.st = 'in'; g.sfx('ding'); } }
      if (m.st === 'in') { m.x = m.to[0] + Math.sin(g.t + m.ph) * 6; m.y = m.to[1] + Math.cos(g.t * 1.3 + m.ph) * 4; }
    }
    if (!g.done && s.m.every(m => m.st === 'in')) { g.win(); g.sfx('cheer'); g.burst(180, INSIDE + 30, ['#ffd25a', '#ff8a7a', '#a86ae8'], 22, 180); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, L = s.L, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('cells_slip_mem' + Math.min(2, g.level), o => paintMembrane(o, L)), 0, 0, 360, 640);
    // the proteins in the membrane
    const P2 = s.prot;
    if (P2.glu != null) { const x = P2.glu; c.fillStyle = '#5ac870'; c.strokeStyle = '#2a7a3a'; c.lineWidth = 3; for (const d of [-1, 1]) { c.beginPath(); c.roundRect(x + d * 24 - 12, MY - 34, 24, 68, 10); c.fill(); c.stroke(); }
      c.fillStyle = 'rgba(255,246,234,0.5)'; c.strokeStyle = '#2a7a3a'; c.lineWidth = 2.5; c.setLineDash([4, 3]); c.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + Math.PI / 6; i ? c.lineTo(x + Math.cos(a) * 15, MY - 36 + Math.sin(a) * 15) : c.moveTo(x + Math.cos(a) * 15, MY - 36 + Math.sin(a) * 15); } c.closePath(); c.fill(); c.stroke(); c.setLineDash([]); }
    if (P2.h2o != null) { const x = P2.h2o; c.fillStyle = '#5aa8f0'; c.strokeStyle = '#2a5a9a'; c.lineWidth = 3; for (const d of [-1, 1]) { c.beginPath(); c.roundRect(x + d * 16 - 9, MY - 32, 18, 64, 8); c.fill(); c.stroke(); } }
    { const x = P2.pump, rot = s.pumpTaps * 2.09 + Math.max(0, 1 - (t - s.pumpAt) * 5) * 0.4; c.save(); c.translate(x, MY); c.fillStyle = '#ff9a4a'; c.strokeStyle = '#a8501a'; c.lineWidth = 3; c.beginPath(); c.roundRect(-30, -36, 60, 72, 18); c.fill(); c.stroke();
      c.rotate(rot); c.strokeStyle = '#a8501a'; c.lineWidth = 4; for (let i = 0; i < 3; i++) { c.rotate(2.09); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 20); c.stroke(); } c.restore();
      c.fillStyle = 'rgba(255,246,234,0.6)'; c.strokeStyle = '#a8501a'; c.lineWidth = 2.5; c.setLineDash([4, 3]); c.beginPath(); c.arc(x, MY - 22, 15, 0, 7); c.fill(); c.stroke(); c.setLineDash([]);
      // ATP spent with each tap: little yellow bolts flying up from inside the cell
      for (const a of s.atp) { const k = (t - a) / 0.35; if (k < 0 || k > 1) continue; c.fillStyle = `rgba(255,220,60,${1 - k})`; c.beginPath(); c.arc(x + 30, SK.lerp(MY + 90, MY + 10, k), 9, 0, 7); c.fill(); c.strokeStyle = '#a87a10'; c.lineWidth = 2; c.beginPath(); c.moveTo(x + 32, MY + 82 - k * 80); c.lineTo(x + 27, MY + 90 - k * 80); c.lineTo(x + 33, MY + 90 - k * 80); c.lineTo(x + 28, MY + 98 - k * 80); c.stroke(); }
      if (s.pumpMol) for (let i = 0; i < 3; i++) { c.fillStyle = i < s.pumpTaps ? '#ffd23a' : 'rgba(255,255,255,0.5)'; c.strokeStyle = '#a87a10'; c.lineWidth = 1.5; c.beginPath(); c.arc(x - 16 + i * 16, MY + 78, 6, 0, 7); c.fill(); c.stroke(); } }
    // molecules
    for (const m of s.m) if (m.st !== 'drag') mol(c, m.kind, m.x, m.y, t);
    const dr = SK.dragging(g); if (dr) mol(c, dr.kind, dr.x, dr.y, t, 1.15);
    // labels
    SK.tag(c, 'Outside', 180, 146, 18); SK.tag(c, 'Inside the cell', 100, 600, 18); SK.tag(c, 'Membrane', s.v % 2 ? 304 : 56, MY, 18, '#fff6ea', 'rgba(120,70,20,0.8)');
    if (P2.glu != null) SK.tag(c, 'Glucose carrier', SK.clamp(P2.glu, 86, 274), MY + 54, 18);
    if (P2.h2o != null) SK.tag(c, 'Water channel', SK.clamp(P2.h2o, 80, 290), MY + 92, 18);
    SK.tag(c, 'Pump', SK.clamp(P2.pump, 40, 326), MY + 54, 18);
    for (const m of s.m) if (m.st === 'wait' || m.st === 'drag') SK.tag(c, NAME[m.kind], SK.clamp(m.x, 58, 302), m.y - 34, 18);
    SK.animal(c, 'octopus', 322, 624, 0.55, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : t - s.bounce < 0.8 ? 'wow' : 'happy', facing: -1 });
    // guidance: the next molecule and where it goes (tap the pump when potassium sits in it)
    if (!g.done) { const ni = s.m.filter(m => m.st === 'in' || m.st === 'cross').length; SK.tag(c, ni + ' / ' + s.m.length + ' inside', 250, 560, 18, ni === s.m.length ? '#9affb0' : '#fff6ea'); }
    if (s.pumpMol && !g.done) SK.tag(c, 'Tap the pump ' + s.pumpTaps + ' / 3', SK.clamp(P2.pump, 100, 260), MY - 64, 18, '#ffd080');
    if (s.pumpMol && !g.done) { SK.glow(c, g, P2.pump, MY, 40, '#ffe27a', { level: 2 }); SK.demo(g, c, 'tap', [P2.pump, MY + 4], null, { period: 0.6 }); return; }
    const next = s.m.find(m => m.st === 'wait');
    if (next && !dr && !g.done) { const tx = next.kind === 'o2' ? next.x : next.kind === 'k' ? P2.pump : P2[next.kind]; const ty = next.kind === 'k' ? MY - 22 : next.kind === 'o2' ? MY + 10 : MY - 36; SK.target(c, g, tx, ty, 22); SK.arrow(c, g, next.x, next.y, tx, ty); SK.grab(c, g, next.x, next.y, 26); SK.demo(g, c, 'drag', [next.x, next.y], [tx, next.kind === 'k' ? MY - 22 : MY + 40]); }
  },
  auto(g, dt, synth) {
    const s = g.s, P2 = s.prot; if (g.done || g.t < 0.6) return;
    if (s.botCur) { const b = s.botCur; if (!SK.bot.drag(g, synth, b.key, b.t, b.a, b.b, 0.3)) return; s.botCur = null; return; }
    if (s.pumpMol) { s.botT = s.botT || 0; if (g.t - s.botT > 0.16) { s.botT = g.t; synth('down', P2.pump, MY); synth('up', P2.pump, MY); } return; }
    const m = s.m.find(q => q.st === 'wait'); if (!m) return; s.botN = (s.botN || 0) + 1;
    const tx = m.kind === 'o2' ? m.x : m.kind === 'k' ? P2.pump : P2[m.kind];
    s.botCur = { key: 'm' + s.botN, t: g.t + 0.1, a: [m.x, m.y], b: [tx, m.kind === 'k' ? MY - 22 : MY + 20] };
  },
});
