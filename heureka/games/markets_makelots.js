// MAKE LOTS! (business MI-15) — a cup factory with one big, costly machine. On the door hangs a coin badge: what each
// cup costs to make. A dashed ring beside it is the price buyers pay. Mash to make cups during the shift: each cup
// shares the machine's cost, so the badge shrinks (economies of scale). Push far past what the factory can handle and
// the ants crowd and bump, the machine smokes, and the badge grows again. When the shift whistle blows, the badge must
// sit inside the ring. Level 1: a smaller factory. Level 2: smaller still, so the sweet spot is narrow.
const FIXED = 10, VAR = 0.3, CROWD = 0.25, SHIFT = 4.2, BADGE = { x: 70, y: 214 }, MACH = { x: 168, y: 420 };
const LVM = [{ cap: 18, price: 1.05 }, { cap: 16, price: 1.05 }, { cap: 14, price: 1.0 }];
const ac = (q, cap) => q <= 0 ? 99 : FIXED / q + VAR + CROWD * Math.max(0, q - cap) ** 2 / q; // cost per cup
function paintFactory(o) {
  const w = o.createLinearGradient(0, 0, 0, 640); w.addColorStop(0, '#e8a0c0'); w.addColorStop(0.5, '#f8c8d8'); w.addColorStop(1, '#fff0f0'); o.fillStyle = w; o.fillRect(0, 0, 360, 640);
  o.fillStyle = '#c8a0b0'; o.fillRect(0, 128, 360, 340); o.strokeStyle = 'rgba(255,255,255,0.15)'; o.lineWidth = 2; for (let y = 140; y < 468; y += 22) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); }
  // the door with its hook for the badge
  o.fillStyle = '#7a4a5a'; o.beginPath(); o.roundRect(20, 150, 100, 170, [40, 40, 0, 0]); o.fill(); o.fillStyle = '#f5c23a'; o.beginPath(); o.arc(108, 250, 4, 0, 7); o.fill();
  // the floor and the conveyor to the truck
  const fl = o.createLinearGradient(0, 468, 0, 640); fl.addColorStop(0, '#a890a0'); fl.addColorStop(1, '#8a7088'); o.fillStyle = fl; o.fillRect(0, 468, 360, 172);
  o.fillStyle = '#4a4a5a'; o.beginPath(); o.roundRect(196, 470, 100, 16, 8); o.fill();
  // the truck
  o.fillStyle = '#5aa8e8'; o.beginPath(); o.roundRect(286, 420, 70, 74, 6); o.fill(); o.fillStyle = '#3a78b8'; o.fillRect(286, 486, 70, 12);
  for (const wx of [300, 342]) { o.fillStyle = '#2a2430'; o.beginPath(); o.arc(wx, 502, 10, 0, 7); o.fill(); }
}
function cup(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#fff6ea'; c.strokeStyle = '#8a5a6a'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-8, -16); c.lineTo(8, -16); c.lineTo(6, 0); c.lineTo(-6, 0); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#e8566a'; c.fillRect(-7, -11, 14, 4); c.restore(); }
MG.add({
  id: 'makelots', stage: 'markets', cmd: 'MAKE CUPS TILL EACH IS CHEAP!', time: 6, mood: 'desert', winText: 'Scale!', failText: 'Too costly!', hold: 1.7,
  card: { title: 'Bigger batches, cheaper cups', kind: 'Economics', ref: 'Economies of scale',
    text: 'The big machine costs the same whether it makes one cup or a hundred. That is a fixed cost. Make more cups and that cost is shared out over all of them, so each cup costs less. That is called an economy of scale.\n\nBut a factory has a limit. Push far past it and workers crowd each other, machines break down, and each extra cup costs more again. The cheapest cups come from making a lot, but not more than the factory can handle.',
    note: 'Making more spreads the fixed costs, so each unit costs less, up to a point.' },
  init(g) { const s = g.s, L = LVM[Math.min(2, g.level)]; s.L = L; s.q = 0; s.start = 0; s.end = 0; s.cups = []; s.lastTap = -9; s.badge = 60; },
  down(g) {
    const s = g.s; SK.touched(g); if (g.done || s.end) return;
    if (!s.start) s.start = g.t; s.q++; s.lastTap = g.t; s.cups.push({ t: g.t, i: s.q }); g.sfx(s.q > s.L.cap ? 'thud' : 'pop');
    if (s.q > s.L.cap + 2 && s.q % 2) g.sfx('crunch');
  },
  update(g, dt) {
    const s = g.s, L = s.L, target = Math.min(60, 16 * ac(s.q, L.cap)); s.badge += (target - s.badge) * Math.min(1, dt * 10);
    if (s.start && !s.end && g.t - s.start >= SHIFT) { // the whistle: is each cup now cheaper than its price?
      s.end = g.t; g.sfx('bell'); if (ac(s.q, L.cap) <= L.price) { g.win(); g.sfx('cheer'); g.burst(BADGE.x, BADGE.y, ['#7ad070', '#fff6ea', '#ffe27a'], 18, 160); } else { g.fail(); g.sfx('fail'); }
    }
    s.cups = s.cups.filter(cp => g.t - cp.t < 1.4);
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', L = s.L, over = Math.max(0, s.q - L.cap), cost = ac(s.q, L.cap);
    c.drawImage(g.bake('b8make_f', paintFactory), 0, 0, 360, 640);
    // the shift clock: a sun that crosses the window
    const sk = s.start ? SK.clamp((t - s.start) / SHIFT, 0, 1) : 0;
    c.fillStyle = '#5a6aa8'; c.beginPath(); c.roundRect(210, 150, 130, 70, 10); c.fill(); c.fillStyle = '#f8e8c8'; c.beginPath(); c.roundRect(216, 156, 118, 58, 8); c.fill();
    c.fillStyle = '#f5c23a'; c.beginPath(); c.arc(SK.lerp(226, 324, sk), 200 - Math.sin(sk * Math.PI) * 32, 9, 0, 7); c.fill();
    // the machine: a big press; it shakes and smokes when overworked
    const shk = over > 0 ? Math.sin(t * 40) * Math.min(4, over * 0.6) : 0, pump = s.cups.length && t - s.lastTap < 0.15 ? 1 - (t - s.lastTap) / 0.15 : 0;
    c.save(); c.translate(MACH.x + shk, MACH.y);
    const gr = c.createLinearGradient(-64, 0, 64, 0); gr.addColorStop(0, '#5a6a7a'); gr.addColorStop(0.4, '#8a9aaa'); gr.addColorStop(1, '#4a5a6a');
    c.fillStyle = gr; c.beginPath(); c.roundRect(-64, -120, 128, 170, 12); c.fill(); c.strokeStyle = '#3a4a5a'; c.lineWidth = 3; c.stroke();
    for (const [gx, gy, gr2, dir] of [[-64, -20, 22, 1], [64, -50, 16, -1]]) { c.save(); c.translate(gx, gy); c.rotate(dir * s.q * 0.5 + dir * t * 0.3); c.fillStyle = '#f5a040'; c.strokeStyle = '#8a4a10'; c.lineWidth = 2; c.beginPath(); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, r = i % 2 ? gr2 : gr2 * 0.78; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#8a4a10'; c.beginPath(); c.arc(0, 0, 4, 0, 7); c.fill(); c.restore(); }
    c.fillStyle = '#e8566a'; c.beginPath(); c.moveTo(-26, -150); c.lineTo(26, -150); c.lineTo(10, -120); c.lineTo(-10, -120); c.closePath(); c.fill();
    c.fillStyle = '#8a9aaa'; c.fillRect(-50, -104, 100, 40); c.fillStyle = '#f5c23a'; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(-30 + i * 30, -84, 8, 0, 7); c.fill(); }
    c.fillStyle = '#4a5a6a'; c.fillRect(-14, -60 + pump * 18, 28, 40); c.fillStyle = '#2a3a4a'; c.fillRect(-30, 20, 60, 12);
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
    c.save(); c.strokeStyle = cost <= L.price ? '#5ad07a' : '#3a1640'; c.lineWidth = 4; c.setLineDash([7, 5]); c.lineDashOffset = -t * 15; c.beginPath(); c.arc(BADGE.x, BADGE.y, 16 * L.price + 3, 0, 7); c.stroke(); c.restore();
    c.save(); c.globalAlpha = 0.92; B8.coin(c, BADGE.x, BADGE.y, s.badge, 0, cost <= L.price ? {} : { col: '#f0a040' }); c.restore();
    if (!s.start) SK.glow(c, g, MACH.x, MACH.y - 40, 70);
    SK.tag(c, 'Cost per cup', BADGE.x, 300, 18); SK.tag(c, 'Price', BADGE.x, 136, 18); SK.tag(c, 'Shift', 275, 238, 18); if (over > 0) SK.tag(c, 'Too crowded', MACH.x, MACH.y + 74, 18, '#fff6ea', 'rgba(190,40,40,0.85)');
    if (!s.end && cost > L.price && over === 0) SK.demo(g, c, 'tap', [MACH.x, MACH.y - 40], null, { delay: 0.7, period: 0.5 }); // keep mashing while the badge is outside the ring
  },
  auto(g, dt, synth) { // mash until the badge is inside the ring with a little room to spare, then stop
    const s = g.s; const B = s._b8 = s._b8 || { next: 0.9 }; if (g.done || g.t < B.next || s.end) return;
    const goal = Math.ceil(FIXED / (s.L.price - VAR)) + 1; if (s.q < goal) { synth('down', MACH.x, MACH.y - 40); synth('up', MACH.x, MACH.y - 40); B.next = g.t + 0.12; }
  },
});
