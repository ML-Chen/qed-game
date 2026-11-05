// MAKE LOTS! (business MI-15) — a cup factory with one big, costly machine. On the door hangs a coin badge: what each
// cup costs to make. A dashed ring beside it is the price buyers pay. Mash to make cups during the shift: each cup
// shares the machine's cost, so the badge shrinks (economies of scale). Push far past what the factory can handle and
// the ants crowd and bump, the machine smokes, and the badge grows again. When the shift whistle blows, the badge must
// sit inside the ring. Level 1: a smaller factory. Level 2: smaller still, so the sweet spot is narrow.
const FIXED = 10, VAR = 0.3, CROWD = 0.25, SHIFTS = [7, 6.5, 4.2], // seconds of shift per level: at levels 0-1, tapping at the ghost hand's pace makes enough cups
   BADGE = { x: 70, y: 214 }, MACH = { x: 168, y: 420 }, CC = { x: 92, y: 204 }, PC = { x: 268, y: 204 }; // CC, PC: the big cost-per-cup and price coins
const LVM = [{ cap: 18, price: 1.05 }, { cap: 16, price: 1.05 }, { cap: 14, price: 1.0 }];
const ac = (q, cap) => q <= 0 ? 99 : FIXED / q + VAR + CROWD * Math.max(0, q - cap) ** 2 / q; // cost per cup
function paintFactory(o) {
  const w = o.createLinearGradient(0, 0, 0, 640); w.addColorStop(0, '#e8a0c0'); w.addColorStop(0.5, '#f8c8d8'); w.addColorStop(1, '#fff0f0'); o.fillStyle = w; o.fillRect(0, 0, 360, 640);
  o.fillStyle = '#c8a0b0'; o.fillRect(0, 128, 360, 340); o.strokeStyle = 'rgba(255,255,255,0.15)'; o.lineWidth = 2; for (let y = 140; y < 468; y += 22) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); }
  // the door with its hook for the badge

  // the floor and the conveyor to the truck
  const fl = o.createLinearGradient(0, 468, 0, 640); fl.addColorStop(0, '#a890a0'); fl.addColorStop(1, '#8a7088'); o.fillStyle = fl; o.fillRect(0, 468, 360, 172);
  o.fillStyle = '#4a4a5a'; o.beginPath(); o.roundRect(196, 470, 100, 16, 8); o.fill();
  // the truck
  o.fillStyle = '#5aa8e8'; o.beginPath(); o.roundRect(286, 420, 70, 74, 6); o.fill(); o.fillStyle = '#3a78b8'; o.fillRect(286, 486, 70, 12);
  for (const wx of [300, 342]) { o.fillStyle = '#2a2430'; o.beginPath(); o.arc(wx, 502, 10, 0, 7); o.fill(); }
}
const STRIPES = ['#e8566a', '#5aa8e8', '#7ac870', '#b88ae0']; let STRIPE = STRIPES[0]; // the cup's colour: a different order each play
function cup(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#fff6ea'; c.strokeStyle = '#8a5a6a'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-8, -16); c.lineTo(8, -16); c.lineTo(6, 0); c.lineTo(-6, 0); c.closePath(); c.fill(); c.stroke(); c.fillStyle = STRIPE; c.fillRect(-7, -11, 14, 4); c.restore(); }
MG.add({
  id: 'makelots', stage: 'markets', cmd: 'MAKE CUPS TILL EACH IS CHEAP!', time: 6, mood: 'desert', winText: 'Cheap cups!', failText: 'Too costly!', hold: 1.7,
  card: { title: 'Bigger batches, cheaper cups', kind: 'Economics', ref: 'Economies of scale',
    text: 'The big machine costs the same whether it makes one cup or a hundred. That is a fixed cost. Make more cups and that cost is shared out over all of them, so each cup costs less. That is called an economy of scale.\n\nBut a factory has a limit. Push far past it and workers crowd each other, machines break down, and each extra cup costs more again. The cheapest cups come from making a lot, but not more than the factory can handle.',
    note: 'Making more spreads the fixed costs, so each unit costs less, up to a point.' },
  init(g) { const s = g.s, v = SK.variant(g, 4), L0 = LVM[Math.min(2, g.level)], L = { ...L0, cap: L0.cap + [0, 2, 1, 3][v] }; /* never below the level cap: a smaller factory at level 2 had no cup count cheap enough */ s.v = v; s.L = L; s.q = 0; s.start = 0; s.end = 0; s.cups = []; s.lastTap = -9; s.badge = 60; },
  down(g) {
    const s = g.s; SK.touched(g); if (g.done || s.end) return;
    if (!s.start) s.start = g.t; s.q++; s.lastTap = g.t; s.cups.push({ t: g.t, i: s.q }); g.sfx(s.q > s.L.cap ? 'thud' : 'pop');
    if (s.q > s.L.cap + 2 && s.q % 2) g.sfx('crunch');
  },
  update(g, dt) {
    const s = g.s, L = s.L, target = Math.min(60, 16 * ac(s.q, L.cap)); s.badge += (target - s.badge) * Math.min(1, dt * 10);
    // as soon as each cup costs no more than its price (and stays there for a short beat), the job is done
    if (s.start && !s.end) { if (ac(s.q, L.cap) <= L.price) { if (!s.okAt) { s.okAt = g.t; g.sfx('ding'); } } else s.okAt = 0; }
    if (s.okAt && !s.end && g.t - s.okAt >= 0.6) { s.end = g.t; g.win(); g.sfx('cheer'); g.burst(CC.x, CC.y, ['#7ad070', '#fff6ea', '#ffe27a'], 18, 160); }
    if (s.start && !s.end && g.t - s.start >= SHIFTS[Math.min(2, g.level)]) { // the whistle: is each cup now cheaper than its price?
      s.end = g.t; g.sfx('bell'); if (ac(s.q, L.cap) <= L.price) { g.win(); g.sfx('cheer'); g.burst(CC.x, CC.y, ['#7ad070', '#fff6ea', '#ffe27a'], 18, 160); } else { g.fail(); g.sfx('fail'); }
    }
    s.cups = s.cups.filter(cp => g.t - cp.t < 1.4);
  },
  draw(g, c) {
    STRIPE = STRIPES[g.s.v];
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', L = s.L, over = Math.max(0, s.q - L.cap), cost = ac(s.q, L.cap);
    c.drawImage(g.bake('b8make_f2', paintFactory), 0, 0, 360, 640);
    // the shift clock: a sun that crosses the window
    const sk = s.start ? SK.clamp((t - s.start) / SHIFTS[Math.min(2, g.level)], 0, 1) : 0;
    c.fillStyle = '#5a6aa8'; c.beginPath(); c.roundRect(258, 318, 90, 52, 10); c.fill(); c.fillStyle = '#f8e8c8'; c.beginPath(); c.roundRect(263, 323, 80, 42, 8); c.fill();
    c.fillStyle = '#f5c23a'; c.beginPath(); c.arc(SK.lerp(272, 334, sk), 358 - Math.sin(sk * Math.PI) * 24, 7, 0, 7); c.fill();
    // the machine: a big press; it shakes and smokes when overworked
    const shk = over > 0 ? Math.sin(t * 40) * Math.min(4, over * 0.6) : 0, pump = s.cups.length && t - s.lastTap < 0.15 ? 1 - (t - s.lastTap) / 0.15 : 0;
    c.save(); c.translate(MACH.x + shk, MACH.y);
    const gr = c.createLinearGradient(-64, 0, 64, 0); gr.addColorStop(0, '#5a6a7a'); gr.addColorStop(0.4, '#8a9aaa'); gr.addColorStop(1, '#4a5a6a');
    c.fillStyle = gr; c.beginPath(); c.roundRect(-64, -120, 128, 170, 12); c.fill(); c.strokeStyle = '#3a4a5a'; c.lineWidth = 3; c.stroke();
    for (const [gx, gy, gr2, dir] of [[-64, -20, 22, 1], [64, -50, 16, -1]]) { c.save(); c.translate(gx, gy); c.rotate(dir * s.q * 0.5 + dir * t * 0.3); c.fillStyle = '#f5a040'; c.strokeStyle = '#8a4a10'; c.lineWidth = 2; c.beginPath(); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, r = i % 2 ? gr2 : gr2 * 0.78; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#8a4a10'; c.beginPath(); c.arc(0, 0, 4, 0, 7); c.fill(); c.restore(); }
    c.fillStyle = '#e8566a'; c.beginPath(); c.moveTo(-26, -150); c.lineTo(26, -150); c.lineTo(10, -120); c.lineTo(-10, -120); c.closePath(); c.fill();
    c.fillStyle = '#8a9aaa'; c.fillRect(-50, -104, 100, 40); c.fillStyle = '#f5c23a'; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(-30 + i * 30, -84, 8, 0, 7); c.fill(); }
    // the machine's cost as a big coin, cut into one sliver for every cup made: more cups, thinner slivers
    c.save(); c.translate(0, 0); B8.coin(c, 0, -10, 26); c.strokeStyle = '#8a4a10'; c.lineWidth = 1.5; const nq = Math.min(40, s.q); for (let i = 0; i < nq; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / Math.max(1, nq); c.beginPath(); c.moveTo(0, -10); c.lineTo(Math.cos(a) * 26, -10 + Math.sin(a) * 26); c.stroke(); } c.restore();
    c.fillStyle = '#4a5a6a'; c.fillRect(-14, -60 + pump * 18 - 40, 28, 14); c.fillStyle = '#2a3a4a'; c.fillRect(-30, 20, 60, 12);
    c.restore();
    if (over > 0) for (let i = 0; i < Math.min(6, over); i++) { const q = (t * 0.8 + i / 6) % 1; c.fillStyle = `rgba(80,70,80,${0.5 * (1 - q)})`; c.beginPath(); c.arc(MACH.x - 30 + i * 12 + Math.sin(q * 5 + i) * 8, MACH.y - 130 - q * 80, 10 + q * 16, 0, 7); c.fill(); }
    // cups popping out and riding to the truck
    for (const cp of s.cups) { const q = (t - cp.t) / 1.4; cup(c, SK.lerp(MACH.x + 30, 300, q), 470 - (q < 0.2 ? Math.sin(q / 0.2 * Math.PI) * 30 : 0), 1); }
    for (let i = 0; i < Math.min(18, s.q); i++) cup(c, 296 + (i % 6) * 9, 486 - Math.floor(i / 6) * 14 - 22, 0.6);
    // the ants at work: more of them as you make more; past the limit they bump into each other
    const nA = Math.min(10, 2 + Math.floor(s.q / 2));
    for (let i = 0; i < nA; i++) { const crowd = over > 0 && i >= Math.floor(L.cap / 2) - 1, x = 40 + i * 26 + (crowd ? Math.sin(t * 12 + i) * 6 : 0), y = 596 + (i % 2) * 18;
      SK.animal(c, 'ant', x, y, 0.75, { t, phase: i, pose: won ? 'cheer' : crowd ? 'balance' : s.q && t - s.lastTap < 0.5 ? 'walk' : 'idle', expr: won ? 'laugh' : crowd ? 'wow' : lost ? 'sad' : 'happy', facing: i % 2 ? -1 : 1 }); }
    // the price ring and the cost badge on the door
    // the two biggest things: what each cup costs to make, and the price buyers pay, side by side
    const cheap = cost <= L.price, num = (v, x, y, col) => { c.save(); c.font = '900 30px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 5; c.strokeStyle = 'rgba(40,20,40,0.55)'; c.strokeText(v, x, y); c.fillStyle = col; c.fillText(v, x, y); c.restore(); };
    c.save(); c.fillStyle = 'rgba(40,20,40,0.35)'; c.beginPath(); c.roundRect(20, 140, 320, 156, 22); c.fill(); c.restore();
    const pz = s.okAt ? 1 + 0.08 * Math.sin((t - s.okAt) * 18) : 1; c.save(); c.translate(CC.x, CC.y); c.scale(pz, pz); B8.coin(c, 0, 0, 52, 0, cheap ? { col: '#5ad07a' } : { col: '#f0803a' }); c.restore();
    num(s.q ? cost.toFixed(2) : '?', CC.x, CC.y + 2, '#fff6ea');
    B8.coin(c, PC.x, PC.y, 52, 0); num(L.price.toFixed(2), PC.x, PC.y + 2, '#fff6ea');
    c.save(); c.font = '900 44px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = cheap ? '#7aff9a' : '#ff8a6a'; c.lineWidth = 5; c.strokeStyle = 'rgba(40,20,40,0.6)'; c.strokeText(cheap ? '≤' : '>', 180, CC.y); c.fillText(cheap ? '≤' : '>', 180, CC.y); c.restore();
    SK.tag(c, 'Machine cost', MACH.x, MACH.y + 46, 18);

    if (!s.end && cost > L.price && over === 0) SK.glow(c, g, MACH.x, MACH.y - 40, 70, '#ffe27a', { level: 2 }); // tap the machine until the cost fits the price
    if (!s.end && !g.done) SK.tag(c, `Cups: ${s.q}`, 56, 384, 18);
    SK.tag(c, 'Cost per cup', CC.x, 276, 18, '#fff6ea', cheap ? 'rgba(40,150,70,0.92)' : undefined); SK.tag(c, 'Price', PC.x, 276, 18); SK.tag(c, 'Shift', 303, 304, 18); if (over > 0) SK.tag(c, 'Too crowded', MACH.x, MACH.y + 74, 18, '#fff6ea', 'rgba(190,40,40,0.85)');
    if (!s.end && cost > L.price && over === 0) SK.demo(g, c, 'tap', [MACH.x, MACH.y - 40], null, { delay: 0.7, period: 0.4 }); // keep mashing while the badge is outside the ring
  },
  auto(g, dt, synth) { // mash until the badge is inside the ring with a little room to spare, then stop
    const s = g.s; const B = s._b8 = s._b8 || { next: 0.9 }; if (g.done || g.t < B.next || s.end) return;
    let goal = 1; for (let q = 1; q <= 40; q++) if (ac(q, s.L.cap) < ac(goal, s.L.cap)) goal = q; for (let q = 1; q <= 40; q++) if (ac(q, s.L.cap) <= s.L.price - 0.02) { goal = Math.max(q, Math.min(goal, q + 1)); break; } if (s.q < goal) { synth('down', MACH.x, MACH.y - 40); synth('up', MACH.x, MACH.y - 40); B.next = g.t + 0.12; }
  },
});
