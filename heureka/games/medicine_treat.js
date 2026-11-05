// TREAT! (chem_bio HB-24) — a petri dish of bacteria; a magnifier shows a few already wear armour before any drug.
// Tap the antibiotic dropper: a pink wave spreads and most plain bacteria pop, but the armoured ones shrug it off.
// The survivors regrow, so tap again each time the dish fills back up (the dropper needs a moment to refill), while
// two white blood cells hunt down the armoured ones. Clear the dish to win; let it overflow and the armoured kind takes
// over the whole dish. Level 2: more armour from the start and faster regrowth.
const DC = [180, 330], DR = 132, CAP = 80, DROP = [180, 548];

const AGAR = [['#f8e0a0', '#e0b060'], ['#e86a6a', '#a82a3a'], ['#b0784a', '#6a4024'], ['#ffb0c8', '#d86a9a']];
function paintBench(o, v = 0) {
  const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#2a4a52'); bg.addColorStop(1, '#16282e'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  const lamp = o.createRadialGradient(180, 300, 20, 180, 320, 300); lamp.addColorStop(0, 'rgba(255,240,200,0.35)'); lamp.addColorStop(1, 'rgba(255,240,200,0)'); o.fillStyle = lamp; o.fillRect(0, 0, 360, 640);
  const rnd = P.rng(9); o.strokeStyle = 'rgba(255,255,255,0.04)'; o.lineWidth = 1; for (let i = 0; i < 40; i++) { const y = rnd() * 640; o.beginPath(); o.moveTo(0, y); o.lineTo(360, y + rnd() * 10); o.stroke(); }
  // the dish: glass rim, amber agar
  o.fillStyle = 'rgba(0,0,0,0.3)'; o.beginPath(); o.ellipse(DC[0] + 6, DC[1] + 10, DR + 14, DR + 12, 0, 0, 7); o.fill();
  o.fillStyle = 'rgba(220,240,255,0.5)'; o.beginPath(); o.arc(DC[0], DC[1], DR + 12, 0, 7); o.fill();
  const ag = o.createRadialGradient(DC[0] - 40, DC[1] - 50, 10, DC[0], DC[1], DR); ag.addColorStop(0, AGAR[v][0]); ag.addColorStop(1, AGAR[v][1]); o.fillStyle = ag; o.beginPath(); o.arc(DC[0], DC[1], DR, 0, 7); o.fill();
  o.strokeStyle = 'rgba(255,255,255,0.7)'; o.lineWidth = 3; o.beginPath(); o.arc(DC[0], DC[1], DR + 8, 3.6, 4.6); o.stroke();
  // the dropper's stand
  o.fillStyle = '#3a5a62'; o.beginPath(); o.roundRect(124, 586, 112, 22, 10); o.fill();
}
function bug(c, b, t, s = 1) {
  c.save(); c.translate(b.x, b.y); c.rotate(b.a); const k = b.born != null ? Math.min(1, (t - b.born) / 0.25) : 1; c.scale(s * k, s * k);
  if (b.arm) {
    c.fillStyle = '#7a8aa8'; c.strokeStyle = '#2a3448'; c.lineWidth = 2; c.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; i ? c.lineTo(Math.cos(a) * 13, Math.sin(a) * 9.5) : c.moveTo(Math.cos(a) * 13, Math.sin(a) * 9.5); } c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-7, -5); c.lineTo(5, -6); c.stroke();
    c.fillStyle = '#ffd25a'; for (const [x, y] of [[-6, 2], [0, 3], [6, 2]]) { c.beginPath(); c.arc(x, y, 1.4, 0, 7); c.fill(); }
  } else {
    const gg = c.createLinearGradient(0, -6, 0, 6); gg.addColorStop(0, '#b8f08a'); gg.addColorStop(1, '#5ab048'); c.fillStyle = gg; c.strokeStyle = '#2a6a20'; c.lineWidth = 1.5;
    c.beginPath(); c.roundRect(-10, -6, 20, 12, 6); c.fill(); c.stroke();
  }
  c.fillStyle = '#1a2a14'; c.beginPath(); c.arc(3, -1, 1.5, 0, 7); c.arc(7, -1, 1.5, 0, 7); c.fill();
  c.restore();
}
function inDish(x, y, m = 14) { return SK.dist(x, y, DC[0], DC[1]) < DR - m; }

MG.add({
  id: 'medicine_treat', stage: 'medicine', cmd: 'CLEAR THE DISH OF GERMS!', time: 7, mood: 'party', winText: 'Germs cleared!', failText: 'Resistant germs won!',
  card: { title: 'Drugs pick the survivors', kind: 'Medicine', ref: 'Antibiotic resistance and natural selection',
    text: 'An antibiotic kills the bacteria it can attack. In a big crowd of bacteria, a few may already carry a gene that protects them, like armour. The drug did not give them that armour; they had it before.\n\nEach dose kills unprotected bacteria and leaves the armoured ones, which then multiply. Over many rounds, the armoured kind takes over. This is natural selection.\n\nHere, white blood cells catch the few survivors, which works only while there are few of them. Using antibiotics only when they are needed slows the spread of resistance.',
    note: 'Antibiotics do not teach bacteria to resist. They kill the others, so the resistant ones that were already there take over.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level);
    s.v = SK.variant(g, 4); s.L = L; s.bugs = []; s.drug = -9; s.doses = 0; s.over = -1; s.pops = [];
    const add = (arm) => { const a = g.rand() * 6.28, d = Math.sqrt(g.rand()) * (DR - 22); s.bugs.push({ x: DC[0] + Math.cos(a) * d, y: DC[1] + Math.sin(a) * d, a: g.rand() * 6.28, arm, split: [1.1, 0.7, 0.3][L] + g.rand() * 0.9, born: null, vx: 0, vy: 0 }); };
    for (let i = 0; i < 22; i++) add(false); for (let i = 0; i < [2, 3, 4][L]; i++) add(true);
    s.wbc = [{ x: 96, y: 410, tx: 0, ty: 0, eat: -1 }, { x: 262, y: 250, tx: 0, ty: 0, eat: -1 }];
    s.grow = [[1.3, 1.7], [1.1, 1.5], [0.9, 1.2]][L]; s.growA = [[1.9, 2.5], [1.8, 2.3], [1.5, 2.0]][L];
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    if (y < 470 && !(SK.dist(x, y, DROP[0], DROP[1]) < 80)) { if (!inDish(x, y, -20)) return; }
    if (g.t - s.drug < 1.1) { g.sfx('wrong'); return; } // the dropper is still refilling
    s.drug = g.t; s.doses++; g.sfx('drip'); g.sfx('splash');
  },
  update(g, dt) {
    const s = g.s, L = s.L;
    const age = g.t - s.drug, wave = age < 0.5 ? age / 0.5 * DR : DR, active = age < 1.0;
    // the drug wave: plain bacteria it reaches mostly pop; a few lucky ones survive each dose
    // the wave reaches an armoured one: it bounces off with a tink
    if (active) for (const b of s.bugs) if (b.arm && b.hit !== s.doses && SK.dist(b.x, b.y, DC[0], DC[1]) < wave) { b.hit = s.doses; b.tink = g.t; g.sfx('click'); }
    if (active) for (const b of s.bugs) if (!b.arm && !b.dead && b.hit !== s.doses && SK.dist(b.x, b.y, DC[0], DC[1]) < wave) { b.hit = s.doses; if (g.rand() < [0.7, 0.72, 0.74][L]) { b.dead = true; s.pops.push({ x: b.x, y: b.y, t: g.t }); } }
    if (s.bugs.some(b => b.dead)) { if (g.rand() < 0.5) g.sfx('pop'); s.bugs = s.bugs.filter(b => !b.dead); }
    // growth: each bacterium splits after a while (the armoured ones grow a little slower); none grow while the drug is in
    if (!g.done) for (const b of s.bugs.slice()) {
      b.split -= dt; if (b.split > 0 || (active && !b.arm)) continue;
      const [lo, hi] = b.arm ? s.growA : s.grow; b.split = lo + g.rand() * (hi - lo);
      if (s.bugs.length >= CAP) continue;
      let nx = b.x, ny = b.y; for (let k = 0; k < 6; k++) { const a = g.rand() * 6.28; nx = b.x + Math.cos(a) * 18; ny = b.y + Math.sin(a) * 18; if (inDish(nx, ny)) break; }
      if (!inDish(nx, ny)) continue;
      s.bugs.push({ x: nx, y: ny, a: g.rand() * 6.28, arm: b.arm, split: b.split * (0.8 + g.rand() * 0.4), born: g.t, vx: 0, vy: 0 });
      if (g.rand() < 0.3) g.sfx('bubble');
    }
    // gentle jostling so the crowd spreads out
    for (const b of s.bugs) { b.a += Math.sin(g.t * 2 + b.x) * dt * 0.5; }
    // white blood cells: hunt the nearest bacterium, armoured first
    for (const w of s.wbc) {
      if (w.eat >= 0 && g.t - w.eat < 0.45) continue;
      const tgt = s.bugs.filter(b => b.arm).sort((a, b) => SK.dist(a.x, a.y, w.x, w.y) - SK.dist(b.x, b.y, w.x, w.y))[0] || s.bugs.slice().sort((a, b) => SK.dist(a.x, a.y, w.x, w.y) - SK.dist(b.x, b.y, w.x, w.y))[0];
      if (!tgt) continue; const dx = tgt.x - w.x, dy = tgt.y - w.y, d = Math.hypot(dx, dy) || 1, sp = 72;
      w.x += dx / d * Math.min(d, sp * dt); w.y += dy / d * Math.min(d, sp * dt);
      if (d < 22) { tgt.dead = true; w.eat = g.t; g.sfx('munch'); }
    }
    s.bugs = s.bugs.filter(b => !b.dead);
    if (!g.done && s.bugs.length === 0) { g.win(); g.sfx('cheer'); g.burst(DC[0], DC[1], ['#fff6ea', '#ff9ac0', '#ffd25a'], 24, 220); }
    if (!g.done && s.bugs.length >= CAP) { s.over = g.t; g.fail(); g.sfx('laugh'); }
    // the fuse ran out: the armoured ones crowd the dish
    if (g.result === 'fail' && s.bugs.length < CAP + 20 && g.rand() < 0.5) { const a = g.rand() * 6.28, d = Math.sqrt(g.rand()) * (DR - 16); s.bugs.push({ x: DC[0] + Math.cos(a) * d, y: DC[1] + Math.sin(a) * d, a: g.rand() * 6, arm: true, split: 9, born: g.t }); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('medicine_treat_bench' + s.v, o => paintBench(o, s.v)), 0, 0, 360, 640);
    const age = t - s.drug;
    // the drug wave
    if (age < 1.2) { const r = age < 0.5 ? age / 0.5 * DR : DR, a = age < 1.0 ? 0.35 : 0.35 * (1.2 - age) / 0.2; c.save(); c.beginPath(); c.arc(DC[0], DC[1], DR, 0, 7); c.clip(); c.fillStyle = `rgba(255,110,180,${a})`; c.beginPath(); c.arc(DC[0], DC[1], r, 0, 7); c.fill(); c.strokeStyle = `rgba(255,190,230,${a * 2})`; c.lineWidth = 4; c.stroke(); c.restore(); }
    for (const b of s.bugs) if (!b.arm) bug(c, b, t);
    for (const b of s.bugs) if (b.arm) { bug(c, b, t, 1.55); if (b.tink != null && t - b.tink < 0.45) { const k = (t - b.tink) / 0.45; c.strokeStyle = `rgba(255,255,255,${1 - k})`; c.lineWidth = 3; c.beginPath(); c.arc(b.x, b.y, 20 + k * 14, 0, 7); c.stroke(); c.strokeStyle = `rgba(255,220,90,${1 - k})`; c.lineWidth = 2.5; for (let j = 0; j < 4; j++) { const a = j * 1.57 + 0.6; c.beginPath(); c.moveTo(b.x + Math.cos(a) * (24 + k * 10), b.y + Math.sin(a) * (24 + k * 10)); c.lineTo(b.x + Math.cos(a) * (32 + k * 12), b.y + Math.sin(a) * (32 + k * 12)); c.stroke(); } } }
    for (const p of s.pops) { const k = (t - p.t) / 0.4; if (k > 1) continue; c.strokeStyle = `rgba(200,255,160,${1 - k})`; c.lineWidth = 2; c.beginPath(); c.arc(p.x, p.y, 6 + k * 12, 0, 7); c.stroke(); }
    if (s.pops.length > 80) s.pops.splice(0, s.pops.length - 80);
    // white blood cells
    for (const w of s.wbc) { c.fillStyle = 'rgba(255,255,255,0.3)'; c.beginPath(); c.arc(w.x, w.y, 30, 0, 7); c.fill(); c.fillStyle = '#fbf8ff'; c.strokeStyle = '#8a7ab0'; c.lineWidth = 2; c.beginPath(); for (let i = 0; i <= 20; i++) { const a = i / 20 * 6.283, r = 24 * (1 + 0.08 * Math.sin(a * 5 + t * 5 + w.x)); i ? c.lineTo(w.x + Math.cos(a) * r, w.y + Math.sin(a) * r) : c.moveTo(w.x + Math.cos(a) * r, w.y + Math.sin(a) * r); } c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#9a6ad0'; c.beginPath(); c.arc(w.x - 6, w.y - 6, 6.5, 0, 7); c.arc(w.x + 5, w.y - 4, 6, 0, 7); c.fill(); for (const e of [-1, 1]) { c.fillStyle = '#fff'; c.beginPath(); c.arc(w.x + e * 7, w.y + 8, 4, 0, 7); c.fill(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(w.x + e * 7, w.y + 8.5, 2.2, 0, 7); c.fill(); } }
    // the magnifier: before the first dose, it shows an armoured one is already there
    const arm0 = s.bugs.find(b => b.arm);
    if (arm0 && s.doses === 0 && g.level <= 1 && !g.done) { const lx = SK.clamp(arm0.x + 58, 70, 290), ly = arm0.y - 58; c.strokeStyle = '#d8c8a0'; c.lineWidth = 6; c.beginPath(); c.moveTo(lx + 22, ly + 22); c.lineTo(lx + 40, ly + 40); c.stroke(); c.save(); c.beginPath(); c.arc(lx, ly, 28, 0, 7); c.fillStyle = AGAR[s.v][0]; c.fill(); c.clip(); bug(c, { x: lx, y: ly, a: arm0.a, arm: true }, t, 2); c.restore(); c.strokeStyle = '#5a4a30'; c.lineWidth = 4; c.beginPath(); c.arc(lx, ly, 28, 0, 7); c.stroke(); c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(arm0.x, arm0.y); c.lineTo(lx - 20, ly + 20); c.stroke(); }
    // how full the dish is: a ring round the rim fills toward overflow
    const full = s.bugs.length / CAP; c.strokeStyle = 'rgba(255,255,255,0.12)'; c.lineWidth = 6; c.beginPath(); c.arc(DC[0], DC[1], DR + 20, 0, 7); c.stroke();
    c.strokeStyle = full > 0.7 ? '#ff6a5a' : '#ffd25a'; c.beginPath(); c.arc(DC[0], DC[1], DR + 20, -Math.PI / 2, -Math.PI / 2 + Math.min(1, full) * 6.283); c.stroke();
    // the dropper: refills after each dose
    const ready = age >= 1.1, fill = Math.min(1, age / 1.1);
    if (age < 0.4) { const k = age / 0.4; c.fillStyle = '#ff6ab0'; c.beginPath(); c.arc(DROP[0], SK.lerp(500, DC[1], k), 7, 0, 7); c.fill(); }
    c.fillStyle = '#fff6fa'; c.strokeStyle = '#8a4a6a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(DROP[0] - 22, 528, 44, 58, 10); c.fill(); c.stroke();
    c.fillStyle = '#ff6ab0'; c.beginPath(); c.roundRect(DROP[0] - 18, 582 - 46 * fill, 36, 46 * fill, 7); c.fill();
    c.fillStyle = '#7a3a5a'; c.beginPath(); c.roundRect(DROP[0] - 14, 506, 28, 24, 8); c.fill(); c.fillStyle = '#eae0e8'; c.beginPath(); c.moveTo(DROP[0] - 5, 506); c.lineTo(DROP[0] + 5, 506); c.lineTo(DROP[0], 486); c.fill();
    c.fillStyle = '#fff'; c.fillRect(DROP[0] - 9, 548, 18, 5); c.fillRect(DROP[0] - 2.5, 541, 5, 19);
    SK.animal(c, 'duck', 46, 618, 0.7, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
    if (ready && !g.done) SK.glow(c, g, DROP[0], 548, 40);
    SK.tag(c, 'Antibiotic', DROP[0] + 98, 548, 18); const ra = s.bugs.find(b => b.arm); if (ra && !g.done) SK.tag(c, 'Resistant germ', SK.clamp(ra.x, 84, 276), ra.y - 30, 18);
    if (ready) SK.demo(g, c, 'tap', [DROP[0], 552], null);
  },
  // the bot: dose whenever the dropper is full and plain bacteria have regrown
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < 0.8) return;
    if (g.t - s.drug >= 1.12 && s.bugs.filter(b => !b.arm).length >= 3) { synth('down', DROP[0], 552); synth('up', DROP[0], 552); }
  },
});
