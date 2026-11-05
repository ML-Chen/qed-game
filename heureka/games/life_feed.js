// FEED! (chem_bio EL-01) — a sunny garden with a hungry puppy, a wilting sapling, a mushroom, a rock and a toy robot.
// Drag a biscuit from the bowl, or the watering can, to everything that needs it: the puppy wags and grows, the sapling
// perks up and sprouts a leaf, the mushroom pops up a baby mushroom. Feeding the rock or the robot does nothing: the
// crumbs just sit there and a bird swoops down and eats them. Level 2 swaps in a seed (alive, waiting) and a campfire
// (it grows, but is not alive).
(() => {
  const BOWL = { x: 78, y: 566 }, CAN = { x: 286, y: 560 }, SLOTS = [[72, 318], [180, 290], [290, 318], [110, 438], [252, 438]];
  const LIVING = { puppy: 'snack', sapling: 'water', mushroom: 'water', seed: 'water' };
  function cast(g) {
    const L = g.level;
    const kinds = L === 0 ? ['puppy', 'rock', 'sapling', null, 'robot'] : L === 1 ? ['puppy', 'mushroom', 'sapling', 'rock', 'robot'] : ['puppy', 'mushroom', 'seed', 'rock', 'fire'];
    if (L >= 1) for (let i = kinds.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]]; }
    return kinds.map((k, i) => k && { kind: k, x: SLOTS[i][0], y: SLOTS[i][1], fed: 0, wet: 0, crumbs: 0 }).filter(Boolean);
  }
  function paintBg(o) {
    P.sky(o, 360, 640, ['#7ec8ea', '#bfe6f2', '#fff4dc'], { x: 290, y: 150, r: 26, color: '#ffe0a0' });
    P.cloud(o, 80, 160, 0.7); P.cloud(o, 230, 200, 0.5);
    P.hills(o, 360, 250, 30, '#a8d870', '#80b850', { seed: 3 });
    const gr = o.createLinearGradient(0, 250, 0, 640); gr.addColorStop(0, '#8ccc5c'); gr.addColorStop(1, '#5a9a3c'); o.fillStyle = gr; o.fillRect(0, 262, 360, 378);
    // a garden path and a fence
    o.fillStyle = '#e8d2a0'; o.beginPath(); o.moveTo(150, 640); o.quadraticCurveTo(170, 500, 180, 380); o.lineTo(186, 380); o.quadraticCurveTo(210, 500, 230, 640); o.fill();
    o.strokeStyle = '#fff6ea'; o.lineWidth = 5; for (let x = 6; x < 360; x += 26) { o.beginPath(); o.moveTo(x, 270); o.lineTo(x, 236); o.stroke(); } o.lineWidth = 4; o.beginPath(); o.moveTo(0, 246); o.lineTo(360, 246); o.moveTo(0, 262); o.lineTo(360, 262); o.stroke();
    P.grassTufts(o, 360, 280, 630, 40, '#4f8a38', 5); P.flowers(o, 360, 300, 620, 18, undefined, 7);
    // shadows of the supplies
    SK.shadow(o, BOWL.x, BOWL.y + 14, 44, 10, 0.25); SK.shadow(o, CAN.x, CAN.y + 22, 46, 10, 0.25);
  }
  function puppy(c, it, t, hungry) {
    const s = 1 + 0.18 * SK.easeOut(it.fed), wag = Math.sin(t * (it.fed ? 22 : 4)) * (it.fed ? 0.7 : 0.15);
    c.save(); c.translate(it.x, it.y + 20); c.scale(s, s);
    SK.shadow(c, 0, 0, 30, 7, 0.25);
    c.strokeStyle = '#8a5a30'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(-20, -18); c.quadraticCurveTo(-34 + wag * 8, -34, -30 + wag * 14, -44); c.stroke();
    c.fillStyle = '#e8b878'; c.strokeStyle = '#7a4a24'; c.lineWidth = 2.2;
    c.beginPath(); c.ellipse(-4, -18, 24, 16, 0, 0, 7); c.fill(); c.stroke();
    for (const lx of [-18, -4, 8]) { c.beginPath(); c.roundRect(lx, -8, 9, 10, 4); c.fill(); c.stroke(); }
    c.beginPath(); c.arc(16, -36, 17, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#9a6234'; c.beginPath(); c.ellipse(4, -36, 7, 13, 0.3 + (hungry ? 0.3 : 0), 0, 7); c.fill(); c.stroke(); c.beginPath(); c.ellipse(28, -36, 7, 13, -0.3 - (hungry ? 0.3 : 0), 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#fff2dc'; c.beginPath(); c.ellipse(18, -28, 9, 7, 0, 0, 7); c.fill();
    c.fillStyle = '#2a1424'; c.beginPath(); c.arc(18, -32, 3.4, 0, 7); c.fill();
    for (const ex of [10, 24]) { c.beginPath(); if (it.fed) { c.lineWidth = 2; c.arc(ex, -40, 3, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); } else { c.arc(ex, -40, 2.6, 0, 7); c.fill(); } }
    if (hungry) { c.fillStyle = '#f58a9c'; c.beginPath(); c.ellipse(19, -21, 3, 5 + Math.sin(t * 6), 0, 0, 7); c.fill(); }
    c.restore();
    if (it.fed) for (let i = 0; i < 3; i++) { const q = (t * 0.8 + i / 3) % 1; c.fillStyle = `rgba(255,90,120,${1 - q})`; c.font = '900 18px Nunito, sans-serif'; c.textAlign = 'center'; c.fillText('♥', it.x + 22 + Math.sin(q * 6 + i) * 8, it.y - 30 - q * 40); }
    else if (hungry) { c.strokeStyle = 'rgba(90,50,30,0.5)'; c.lineWidth = 2; for (let i = 0; i < 2; i++) { const q = (t * 1.5 + i * 0.5) % 1; c.beginPath(); c.arc(it.x - 4, it.y + 2, 26 + q * 10, -0.4, 0.4); c.stroke(); } }
  }
  function sapling(c, it, t) {
    const k = SK.easeOut(it.fed), droop = 1 - k, x = it.x, y = it.y + 24;
    SK.shadow(c, x, y, 26, 6, 0.22); c.fillStyle = '#8a5a3a'; c.beginPath(); c.ellipse(x, y - 2, 22, 7, 0, 0, 7); c.fill();
    const top = y - 46 - k * 14, lean = droop * 16;
    c.strokeStyle = P.mix('#a89050', '#4a8a30', k); c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y - 4); c.quadraticCurveTo(x, y - 30, x + lean, top); c.stroke();
    const leaf = (lx, ly, a, sz) => { c.save(); c.translate(lx, ly); c.rotate(a); c.fillStyle = P.mix('#b8a060', '#5ab040', k); c.strokeStyle = P.mix('#7a6030', '#2a6a20', k); c.lineWidth = 1.6; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(sz * 0.5, -sz * 0.45, sz, 0); c.quadraticCurveTo(sz * 0.5, sz * 0.45, 0, 0); c.fill(); c.stroke(); c.restore(); };
    const sw = Math.sin(t * 2) * 0.06;
    leaf(x + lean * 0.5, y - 26, -0.5 + droop * 1.5 + sw, 18); leaf(x + lean * 0.5, y - 26, Math.PI + 0.5 - droop * 1.5 + sw, 18);
    leaf(x + lean, top, -0.9 + droop * 1.6 + sw, 16); leaf(x + lean, top, Math.PI + 0.9 - droop * 1.6 + sw, 16);
    if (k > 0.05) leaf(x, top - 2, -Math.PI / 2 + sw, 14 * k);
  }
  function seed(c, it, t) {
    const k = SK.easeOut(it.fed), x = it.x, y = it.y + 24;
    SK.shadow(c, x, y, 26, 6, 0.22); c.fillStyle = '#7a4a2a'; c.beginPath(); c.ellipse(x, y - 2, 24, 8, 0, 0, 7); c.fill();
    c.fillStyle = '#c8a060'; c.strokeStyle = '#6a4a20'; c.lineWidth = 2; c.beginPath(); c.ellipse(x, y - 8 - k * 4, 9, 6, 0.3, 0, 7); c.fill(); c.stroke();
    if (k > 0.02) { c.strokeStyle = '#4a9a30'; c.lineWidth = 3.5; c.beginPath(); c.moveTo(x, y - 12); c.quadraticCurveTo(x - 4, y - 12 - 20 * k, x + 2, y - 14 - 34 * k); c.stroke();
      for (const s of [-1, 1]) { c.save(); c.translate(x + 2, y - 14 - 34 * k); c.rotate(s * 0.7 - Math.PI / 2); c.fillStyle = '#6ac04a'; c.beginPath(); c.ellipse(0, s * 0, 12 * k, 6 * k, s * 0.9, 0, 7); c.fill(); c.restore(); } }
  }
  function mushroom(c, it, t) {
    const k = SK.easeOut(it.fed), x = it.x, y = it.y + 24, one = (mx, sz, h) => {
      c.fillStyle = '#fff2dc'; c.strokeStyle = '#8a5a4a'; c.lineWidth = 2; c.beginPath(); c.roundRect(mx - sz * 0.28, y - h, sz * 0.56, h, sz * 0.2); c.fill(); c.stroke();
      c.fillStyle = '#e84a3a'; c.beginPath(); c.ellipse(mx, y - h, sz, sz * 0.7, 0, Math.PI, 0); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#fff6ea'; for (const [dx, dy, r] of [[-0.45, -0.3, 0.16], [0.2, -0.5, 0.14], [0.5, -0.18, 0.11]]) { c.beginPath(); c.arc(mx + dx * sz, y - h + dy * sz, r * sz, 0, 7); c.fill(); } };
    SK.shadow(c, x, y, 30, 7, 0.22);
    one(x, 22 + k * 4, 26 + k * 8 - (1 - k) * 6);
    if (k > 0.05) one(x + 26, 12 * k, 16 * k);
    if (!it.fed) { c.fillStyle = 'rgba(120,90,60,0.25)'; c.beginPath(); c.ellipse(x, y - 30, 22, 10, 0, 0, 7); c.fill(); }
  }
  function rock(c, it, t) { P.rock(c, it.x, it.y + 22, 1.1, '#a8a0a0'); if (it.wet) { c.fillStyle = 'rgba(150,200,255,0.35)'; c.beginPath(); c.ellipse(it.x, it.y + 6, 26, 14, 0, 0, 7); c.fill(); } }
  function robot(c, it, t) {
    const x = it.x, y = it.y + 24, bat = Math.max(0.1, 1 - t * 0.06);
    SK.shadow(c, x, y, 24, 6, 0.25);
    c.fillStyle = '#9ab0c8'; c.strokeStyle = '#3a4a6a'; c.lineWidth = 2.2;
    c.beginPath(); c.roundRect(x - 18, y - 36, 36, 30, 6); c.fill(); c.stroke(); c.beginPath(); c.roundRect(x - 13, y - 60, 26, 22, 6); c.fill(); c.stroke();
    for (const lx of [-12, 5]) { c.beginPath(); c.roundRect(x + lx, y - 8, 8, 8, 2); c.fill(); c.stroke(); }
    c.beginPath(); c.moveTo(x, y - 60); c.lineTo(x, y - 70); c.stroke(); c.fillStyle = `rgba(255,${80 + 150 * bat | 0},80,${0.4 + 0.6 * bat * (0.5 + 0.5 * Math.sin(t * 6))})`; c.beginPath(); c.arc(x, y - 72, 4, 0, 7); c.fill();
    c.fillStyle = '#2a3a5a'; c.beginPath(); c.arc(x - 5, y - 50, 3, 0, 7); c.arc(x + 5, y - 50, 3, 0, 7); c.fill();
    c.fillStyle = '#2a3a5a'; c.fillRect(x - 10, y - 30, 20, 8); c.fillStyle = bat > 0.4 ? '#6ad86a' : '#e8a040'; c.fillRect(x - 9, y - 29, 18 * bat, 6);
  }
  function campfire(c, it, t) {
    const x = it.x, y = it.y + 24, k = 1 + it.crumbs * 0.6 - it.wet * 0.9;
    SK.shadow(c, x, y, 28, 6, 0.25);
    c.fillStyle = '#8a5430'; c.save(); c.translate(x, y - 4); c.rotate(0.4); c.fillRect(-20, -4, 40, 8); c.rotate(-0.8); c.fillRect(-20, -4, 40, 8); c.restore();
    B3.glow(c, x, y - 16, 40 * Math.max(0.2, k), '255,150,60', 0.4);
    B3.flame(c, x, y - 4, 0.55 * Math.max(0.2, k), t, Math.max(0.05, Math.min(1, k)), 1);
    if (it.wet) B3.smoke(c, x, y - 10, t, it.wet, '170,170,180', 5, 70);
  }
  const DRAW = { puppy, sapling, seed, mushroom, rock, robot, fire: campfire };
  function biscuit(c, x, y, a = 0) { c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = '#d89a50'; c.strokeStyle = '#7a4a1a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-11, -5, 22, 10, 4); for (const [bx, by] of [[-11, -5], [-11, 5], [11, -5], [11, 5]]) { c.moveTo(bx + 5, by); c.arc(bx, by, 5, 0, 7); } c.fill(); c.stroke(); c.restore(); }
  function can(c, x, y, tilt, t, pouring) {
    c.save(); c.translate(x, y); c.rotate(tilt);
    c.fillStyle = '#4aa8d8'; c.strokeStyle = '#1e5a7a'; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(16, -4); c.lineTo(50, -26); c.lineTo(54, -20); c.lineTo(22, 6); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(52, -24, 8, 4, -0.6, 0, 7); c.fill(); c.stroke();
    c.beginPath(); c.roundRect(-24, -20, 44, 40, 8); c.fill(); c.stroke();
    c.beginPath(); c.arc(-2, -20, 16, Math.PI, 0); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(-18, -14, 6, 26);
    c.restore();
    if (pouring) { const sx = x + Math.cos(tilt) * 52 - Math.sin(tilt) * -24, sy = y + Math.sin(tilt) * 52 + Math.cos(tilt) * -24; for (let i = 0; i < 14; i++) { const q = (t * 3 + i / 14) % 1; c.fillStyle = `rgba(120,200,255,${0.9 - q * 0.5})`; c.beginPath(); c.arc(sx + 6 * q + Math.sin(i) * 4, sy + q * 60, 2.6, 0, 7); c.fill(); } }
  }
  MG.add({
    id: 'feed', stage: 'life', cmd: 'FEED WHAT IS ALIVE!', time: 6, mood: 'bright', winText: 'Alive!', failText: 'Hungry!',
    card: { title: 'What is alive?', kind: 'Biology', ref: 'Characteristics of living things',
      text: 'Living things need food and water. They use them to grow, to move, to repair themselves and to make more of their kind. A puppy eats food. A plant takes in water through its roots and makes its own food from sunlight. A mushroom soaks up food from the soil or wood it grows on, and needs water too.\n\nA rock and a toy robot are not alive. They do not eat, grow or have babies, so food does nothing for them. A campfire grows and gives off heat, but it is not alive either. A seed is alive even while it waits: give it water and it sprouts.',
      note: 'Living things take in food and water, grow, and make more living things. Non-living things do not.' },
    init(g) { const s = g.s; s.items = cast(g); s.held = null; s.can = { x: CAN.x, y: CAN.y, tilt: 0, pour: null }; s.bird = null; s.fedN = 0; },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return;
      if (!s.can.pour && SK.dist(x, y, s.can.x, s.can.y - 4) < 46) { s.held = 'water'; SK.dragStart(g, s.can, x, y); return; }
      if (SK.dist(x, y, BOWL.x, BOWL.y) < 50) { s.held = 'snack'; s.snack = { x: BOWL.x, y: BOWL.y - 12 }; SK.dragStart(g, s.snack, x, y); }
    },
    move(g, x, y) { SK.dragMove(g, x, y); },
    up(g) {
      const s = g.s, d = SK.dragEnd(g), what = s.held; s.held = null; if (!d || g.done) return;
      const tx = what === 'water' ? s.can.x + 30 : s.snack.x, ty = what === 'water' ? s.can.y + 20 : s.snack.y;
      const it = SK.pick(s.items, tx, ty - 10, 62);
      if (what === 'water') s.can.pour = { t0: g.t, it }; else s.snack = null;
      if (!it) return;
      const need = LIVING[it.kind];
      if (need === what || (it.kind === 'puppy' && what === 'water')) { if (!it.fed) { it.fedAt = g.t; it.fed = 0.001; g.sfx(it.kind === 'puppy' ? (what === 'snack' ? 'munch' : 'slurp') : 'grow'); } return; }
      // a plant cannot eat a biscuit, and a non-living thing needs nothing: the crumbs just sit there until a bird comes
      if (what === 'snack') { it.crumbs = 1; if (it.kind !== 'fire' && !s.bird) s.bird = { t0: g.t, it }; } else if (!need) it.wet = 1;
      g.sfx(it.kind === 'fire' ? (what === 'water' ? 'sweep' : 'fire') : 'thud'); if (!need) it.nope = g.t;
    },
    update(g, dt) {
      const s = g.s;
      for (const it of s.items) if (it.fed > 0 && it.fed < 1) it.fed = Math.min(1, it.fed + dt * 2.2);
      const P0 = s.can.pour; if (P0) { const k = g.t - P0.t0; s.can.tilt = SK.easeOut(Math.min(1, k * 5)) * 0.7; if (k > 0.45) { s.can.tilt = 0; s.can.pour = null; s.can.back = true; } }
      if (s.can.back && !SK.dragging(g)) { s.can.x += (CAN.x - s.can.x) * Math.min(1, dt * 12); s.can.y += (CAN.y - s.can.y) * Math.min(1, dt * 12); if (SK.dist(s.can.x, s.can.y, CAN.x, CAN.y) < 1) s.can.back = false; }
      if (!g.done && s.items.every(it => !LIVING[it.kind] || it.fed >= 1)) { g.win(); g.sfx('cheer'); g.burst(180, 360, ['#ffd45a', '#ff8aa0', '#8ad860'], 20, 200); }
      if (s.bird && g.t - s.bird.t0 > 1.1 && !s.bird.ate) { s.bird.ate = true; s.bird.it.crumbs = 0; g.sfx('tweet'); g.sfx('munch'); }
      if (s.bird && g.t - s.bird.t0 > 2.2) s.bird = null;
      for (const it of s.items) if (it.kind === 'fire' && it.crumbs) it.crumbs = Math.min(1.6, it.crumbs + dt);
    },
    draw(g, c) {
      const s = g.s, t = g.t;
      c.drawImage(g.bake('feed_bg', paintBg), 0, 0, 360, 640);
      const sorted = s.items.slice().sort((a, b) => a.y - b.y);
      for (const it of sorted) {
        if (it.kind === 'puppy') puppy(c, it, t, !it.fed); else DRAW[it.kind](c, it, t);
        if (it.crumbs && it.kind !== 'fire' && !(s.bird && s.bird.ate && s.bird.it === it)) for (let i = 0; i < 6; i++) { c.fillStyle = '#c88a40'; c.fillRect(it.x - 12 + B3.hash(i) * 24, it.y + 2 + B3.hash(i * 2) * 8, 4, 3); }
        if (LIVING[it.kind] && !it.fed) SK.glow(c, g, it.x, it.y, 40);
      }
      // the bird that swoops down for the crumbs
      if (s.bird) { const q = t - s.bird.t0, k = SK.clamp(q / 0.9, 0, 1), o = SK.clamp((q - 1.6) / 0.6, 0, 1), it = s.bird.it;
        const bx = SK.lerp(-30, it.x - 18, SK.easeOut(k)) + o * 260, by = SK.lerp(160, it.y + 14, SK.easeOut(k)) - o * 260 + Math.sin(t * 20) * (1 - k + o) * 4, peck = k >= 1 && !o ? Math.abs(Math.sin(t * 14)) * 4 : 0;
        SK.animal(c, 'bird', bx, by + peck, 0.95, { t, pose: k < 1 || o ? 'hop' : 'idle', expr: s.bird.ate ? 'laugh' : 'happy', noShadow: k < 1 || o > 0 }); }
      for (const it of s.items) if (it.nope && t - it.nope < 1) { const q = t - it.nope; c.save(); c.globalAlpha = 1 - q; c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.lineCap = 'round'; for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + (i - 1) * 0.6; c.beginPath(); c.moveTo(it.x + Math.cos(a) * 34, it.y - 10 + Math.sin(a) * 34); c.lineTo(it.x + Math.cos(a) * (40 + q * 10), it.y - 10 + Math.sin(a) * (40 + q * 10)); c.stroke(); } c.restore(); }
      // the supplies: a bowl of biscuits and the watering can
      c.fillStyle = '#e85a5a'; c.strokeStyle = '#8a2a2a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(BOWL.x - 40, BOWL.y - 8); c.quadraticCurveTo(BOWL.x - 36, BOWL.y + 16, BOWL.x, BOWL.y + 16); c.quadraticCurveTo(BOWL.x + 36, BOWL.y + 16, BOWL.x + 40, BOWL.y - 8); c.closePath(); c.fill(); c.stroke();
      for (let i = 0; i < 5; i++) biscuit(c, BOWL.x - 22 + i * 11, BOWL.y - 10 - (i % 2) * 5, (i - 2) * 0.3);
      c.fillStyle = '#ff8a8a'; c.beginPath(); c.ellipse(BOWL.x, BOWL.y - 8, 40, 6, 0, 0, Math.PI); c.fill();
      can(c, s.can.x, s.can.y, s.can.tilt, t, !!s.can.pour);
      if (s.held === 'snack' && s.snack) biscuit(c, s.snack.x, s.snack.y, Math.sin(t * 8) * 0.2);
      // the frog cheers you on
      const won = g.result === 'win', lost = g.result === 'fail';
      SK.animal(c, 'frog', 180, 612, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
      const nx = s.items.find(i => LIVING[i.kind] && !i.fed), snack = nx && LIVING[nx.kind] === 'snack';
      SK.demo(g, c, 'drag', snack ? [BOWL.x, BOWL.y - 6] : [CAN.x, CAN.y], nx ? (snack ? [nx.x, nx.y + 4] : [nx.x - 30, nx.y - 8]) : [180, 300], { never: !nx || !!s.can.pour });
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done) return; const todo = s.items.filter(it => LIVING[it.kind]);
      todo.forEach((it, i) => {
        const t = 1.0 + i * 1.05, need = LIVING[it.kind];
        if (need === 'snack') SK.bot.drag(g, synth, 'f' + i, t, [BOWL.x, BOWL.y - 6], [it.x, it.y + 12], 0.45);
        else SK.bot.drag(g, synth, 'f' + i, t, [CAN.x, CAN.y], [it.x - 30, it.y - 8], 0.45);
      });
    },
  });
})();
