// HOIST! (earth_eng ME-07) — inside a barn: a heavy crate on the floor, a hay loft above it, and a beam with a row of
// pulleys (a block and tackle). The rope runs from the crate over one pulley down to the beaver. Pull it alone and the
// crate is too heavy: the beaver is lifted off its feet instead. Thread the rope's end round each lower pulley (on the
// crate) and it comes back up over the upper one: every rope that holds the crate shares the load, so with 4 ropes
// holding it the beaver only needs a quarter of the force. Then pull the rope down, again and again: the crate rises
// slowly (a quarter of the rope you pull), the pulled rope piles up in coils, and the fox slides it into the loft.
// Level 0: 2 lower pulleys (4 ropes). Level 1: a higher loft. Level 2: a heavier crate and 3 lower pulleys (6 ropes).
const HO = (() => {
  const BEAM = 150, TY = 178, R = 12, GY = 590, HX = 300, H0 = 340, H1 = 584, FORCE = 1;
  const SETS = [
    { what: 'Piano', col: '#3a2a3a', wall: ['#b8583a', '#d8784a'], hay: '#f0c858' },
    { what: 'Anvils', col: '#5a6272', wall: ['#8a5a3a', '#b07a4a'], hay: '#e8d070' },
    { what: 'Bricks', col: '#b8503a', wall: ['#a8483a', '#c86a4a'], hay: '#f4d060' },
    { what: 'Melons', col: '#3a8a3a', wall: ['#7a4a3a', '#a06a4a'], hay: '#ecc850' },
  ];
  function geo(s) { const K = s.K, bx = i => 92 + i * 4 * R, tx = i => bx(i) + 2 * R, cx = (bx(0) + bx(K - 1)) / 2, w = Math.max(116, (K - 1) * 4 * R + 70); return { bx, tx, cx, w }; }
  function paint(o, S, L, loftY) {
    N4.vgrad(o, 0, 0, 360, 640, S.wall);
    o.strokeStyle = 'rgba(60,20,10,0.25)'; o.lineWidth = 2; for (let x = 0; x < 360; x += 30) { o.beginPath(); o.moveTo(x, 0); o.lineTo(x, 640); o.stroke(); }
    // a high window of sky
    o.fillStyle = '#9ad8f0'; o.beginPath(); o.moveTo(250, 220); o.lineTo(330, 220); o.lineTo(330, 290); o.lineTo(250, 290); o.closePath(); o.fill(); o.strokeStyle = '#fff6ea'; o.lineWidth = 5; o.stroke(); o.beginPath(); o.moveTo(290, 220); o.lineTo(290, 290); o.moveTo(250, 255); o.lineTo(330, 255); o.stroke();
    // the beam
    N4.vgrad(o, 0, BEAM - 16, 360, 24, ['#8a5a2a', '#5a3a1a']); o.fillStyle = 'rgba(255,255,255,0.15)'; o.fillRect(0, BEAM - 16, 360, 3);
    // the loft: a plank floor on the left with hay bales
    o.fillStyle = '#6a4220'; o.fillRect(0, loftY, 62, 14); o.fillStyle = '#4a2a10'; o.fillRect(0, loftY + 14, 62, 6); o.fillRect(48, loftY + 20, 10, GY - loftY - 20);
    for (let i = 0; i < 2; i++) { o.fillStyle = S.hay; o.beginPath(); o.roundRect(2, loftY - 34 - i * 30, 46, 30, 6); o.fill(); o.strokeStyle = 'rgba(120,80,10,0.5)'; o.lineWidth = 2; o.stroke(); o.beginPath(); o.moveTo(14, loftY - 34 - i * 30); o.lineTo(14, loftY - 4 - i * 30); o.moveTo(36, loftY - 34 - i * 30); o.lineTo(36, loftY - 4 - i * 30); o.stroke(); }
    // the floor: straw and boards
    N4.vgrad(o, 0, GY, 360, 50, ['#c8a060', '#a07a40']); const r = P.rng(5); o.strokeStyle = 'rgba(240,210,110,0.7)'; o.lineWidth = 1.5;
    for (let i = 0; i < 60; i++) { const x = r() * 360, y = GY + 4 + r() * 40, a = r() * 3; o.beginPath(); o.moveTo(x, y); o.lineTo(x + Math.cos(a) * 10, y + Math.sin(a) * 3); o.stroke(); }
    P.grain(o, 360, 640, 0.03);
  }
  function pulley(c, x, y, spin, threaded) {
    c.fillStyle = '#8a8a9a'; c.strokeStyle = '#2a2a3a'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, R + 3, 0, 7); c.fill(); c.stroke();
    c.fillStyle = threaded ? '#d8d8e4' : '#b8b8c8'; c.beginPath(); c.arc(x, y, R - 2, 0, 7); c.fill();
    c.strokeStyle = '#4a4a5a'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { const a = spin + i * 2.09; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * (R - 3), y + Math.sin(a) * (R - 3)); c.stroke(); }
    c.fillStyle = '#2a2a3a'; c.beginPath(); c.arc(x, y, 2.5, 0, 7); c.fill();
  }
  // the rope's path for k lower pulleys threaded: a list of points, ending at the hand-hold
  function path(s, cy, hy) {
    const G = geo(s), by = cy - 112, pts = [];
    if (!s.k) { pts.push([G.cx, by + 10], [G.tx(0) - R, TY]); }
    else { pts.push([G.bx(0) - R, BEAM - 4]); for (let i = 0; i < s.k; i++) { pts.push([G.bx(i) - R, by], [G.bx(i) + R, by], [G.tx(i) - R, TY], [G.tx(i) + R, TY]); if (i < s.k - 1) pts.push([G.bx(i + 1) - R, TY]); } }
    if (!s.k) pts.push([G.tx(0) + R, TY]);
    pts.push([HX, hy]); return pts;
  }
  function crate(c, S, x, y, w) { // y = bottom of the crate
    const h = 78; SK.shadow(c, x, GY + 2, w / 2, 7, 0.25 * SK.clamp(1 - (GY - y) / 200, 0.2, 1));
    c.fillStyle = '#c8904a'; c.strokeStyle = '#6a4220'; c.lineWidth = 3; c.beginPath(); c.roundRect(x - w / 2, y - h, w, h, 6); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(106,66,32,0.6)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - w / 2, y - h / 2); c.lineTo(x + w / 2, y - h / 2); c.moveTo(x - w / 2 + 4, y - h + 4); c.lineTo(x + w / 2 - 4, y - 4); c.stroke();
    // what it carries, peeking over the top
    c.fillStyle = S.col; if (S.what === 'Piano') { c.beginPath(); c.roundRect(x - 34, y - h - 22, 68, 26, 6); c.fill(); c.fillStyle = '#fff6ea'; c.fillRect(x - 28, y - h - 10, 56, 8); c.fillStyle = '#1a1a1a'; for (let i = 0; i < 7; i++) c.fillRect(x - 25 + i * 8, y - h - 10, 3, 5); }
    else if (S.what === 'Melons') { for (let i = 0; i < 3; i++) { SK.ball(c, x - 28 + i * 28, y - h - 6, 15, S.col); } }
    else for (let i = 0; i < 3; i++) { c.fillStyle = S.col; c.strokeStyle = P.shade(S.col, -0.5); c.lineWidth = 2; c.beginPath(); c.roundRect(x - 40 + i * 27, y - h - 18, 25, 20, 3); c.fill(); c.stroke(); }
    // the lower block: a bar on two straps above the crate
    c.strokeStyle = '#4a3a2a'; c.lineWidth = 4; c.beginPath(); c.moveTo(x - w / 2 + 12, y - h); c.lineTo(x - 20, y - h - 30); c.moveTo(x + w / 2 - 12, y - h); c.lineTo(x + 20, y - h - 30); c.stroke();
  }
  return { BEAM, TY, R, GY, HX, H0, H1, FORCE, SETS, geo, paint, pulley, path, crate };
})();
MG.add({
  id: 'build_hoist', stage: 'build', cmd: 'THREAD THE PULLEYS, THEN PULL!', time: 8, mood: 'desert', winText: 'Lifted with ease!', failText: 'Too heavy!',
  card: { title: 'More ropes, less force', kind: 'Engineering', ref: 'Block and tackle (pulleys)',
    text: 'One rope over one pulley only changes the direction of your pull. To lift a heavy crate that way, you must pull as hard as the crate weighs. If you weigh less, you go up instead.\n\nThread the rope round pulleys on the crate and back up, and several ropes hold the crate at once. They share its weight. With 4 ropes holding it, you pull with a quarter of the force.\n\nThere is a catch: to lift the crate 1 metre you must pull 4 metres of rope. You trade distance for force.',
    note: 'More pulleys mean less pulling force, but you must pull more rope.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.S = HO.SETS[s.v]; s.L = L;
    s.K = L >= 2 ? 3 : 2; s.W = L >= 2 ? 5.4 : 3.6; s.k = 0; s.loftY = [440, 424, 446][L];
    s.cy = HO.GY; s.hy = HO.H0; s.tip = null; s.mode = null; s.pulled = 0; s.lift = 0; s.spin = 0; s.coils = 0; s.winT = 0; s.liftT = -9;
  },
  ma(s) { return Math.max(1, 2 * s.k); },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.winT) return;
    if (SK.dist(x, y, HO.HX, s.hy) < 50) { s.mode = 'hold'; s.y0 = y; s.hy0 = s.hy; SK.dragStart(g, null, x, y); g.sfx('tap'); }
  },
  move(g, x, y) {
    const s = g.s; if (!s.mode) return; SK.dragMove(g, x, y);
    if (s.mode === 'hold' && x < HO.HX - 44 && s.k < s.K) { s.mode = 'thread'; s.hy = HO.H0; if (s.lift) { s.lift = 0; } } // carrying the rope end up toward a pulley
    if (s.mode === 'thread') { s.tip = [x, y]; return; }
    // pulling the rope down: the crate rises by the pulled length / number of ropes holding it, if the beaver can manage
    const ny = SK.clamp(s.hy0 + (y - s.y0), HO.H0, HO.H1), dy = ny - s.hy; if (dy <= 0) { s.hy = Math.max(HO.H0, ny); return; }
    s.hy = ny; const ma = g.def.ma(s);
    if (HO.FORCE * ma >= s.W) { const rise = Math.min(dy / ma, s.cy - s.loftY); s.cy -= rise; s.pulled += dy; s.spin += dy / HO.R; if (g.rand() < 0.3) g.sfx('stretch', { vol: 0.25 }); }
    else { s.lift = Math.min(80, s.lift + dy * 0.6); s.liftT = g.t; s.spin += 0; }
  },
  up(g) {
    const s = g.s; SK.dragEnd(g); const m = s.mode; s.mode = null; if (!m) return;
    if (m === 'thread') {
      const G = HO.geo(s), by = s.cy - 112, t = s.tip || [0, 0]; s.tip = null;
      if (s.k < s.K && SK.dist(t[0], t[1], G.bx(s.k), by) < 46) { s.k++; g.sfx('click'); g.sfx('swoosh'); g.burst(G.bx(s.k - 1), by, ['#fff6ea', '#ffd45a'], 8, 90); }
      else g.sfx('boing', { vol: 0.4 });
    }
    if (s.lift > 0) { s.lift = 0; g.sfx('thud'); g.shake(3, 0.15); }
    s.hy = HO.H0; // the hands go back up the rope for the next pull (the crate is held by a ratchet)
  },
  update(g, dt) {
    const s = g.s; s.coils = s.pulled / 110;
    if (!g.done && !s.winT && s.cy <= s.loftY + 0.5) { s.winT = g.t; g.sfx('chime'); }
    if (s.winT && !g.done && g.t - s.winT > 0.4) { g.sfx('cheer'); g.win(); }
    if (!g.done && s.lift > 0 && !s.mode) s.lift = 0;
  },
  draw(g, c) {
    const s = g.s, t = g.t, S = s.S, G = HO.geo(s), won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('hoist_bg' + s.v + '_' + s.L, o => HO.paint(o, S, s.L, s.loftY)), 0, 0, 360, 640);
    SK.tag(c, 'Loft', 34, s.loftY + 36, 18);
    // the loft line the crate must reach
    if (!s.winT) { c.save(); c.strokeStyle = '#ffd45a'; c.lineWidth = 3; c.setLineDash([8, 6]); c.beginPath(); c.moveTo(62, s.loftY); c.lineTo(G.cx + G.w / 2 + 10, s.loftY); c.stroke(); c.restore(); }
    // the crate slides into the loft once it is up
    const slide = s.winT ? SK.easeInOut((t - s.winT) / 0.4) * 30 : 0, cx = G.cx - slide, by = s.cy - 112;
    HO.crate(c, S, cx, s.cy, G.w);
    // pulleys: upper ones on the beam, lower ones on the crate's block
    c.fillStyle = '#5a4a3a'; c.beginPath(); c.roundRect(G.bx(0) - 22, by - 8, G.bx(s.K - 1) - G.bx(0) + 44, 16, 6); c.fill();
    for (let i = 0; i < s.K; i++) { c.strokeStyle = '#3a2a1a'; c.lineWidth = 4; c.beginPath(); c.moveTo(G.tx(i), HO.BEAM); c.lineTo(G.tx(i), HO.TY); c.stroke(); }
    const pts = HO.path(s, s.cy, s.mode === 'thread' ? HO.H0 : s.hy);
    // the rope (with marks that run along it as it is pulled)
    c.save(); c.lineJoin = 'round'; c.lineCap = 'round'; c.strokeStyle = '#7a5a2a'; c.lineWidth = 6; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
    c.strokeStyle = '#e8c88a'; c.lineWidth = 3.5; c.stroke(); c.strokeStyle = '#a8804a'; c.lineWidth = 3.5; c.setLineDash([3, 9]); c.lineDashOffset = -s.pulled; c.stroke(); c.restore();
    for (let i = 0; i < s.K; i++) { HO.pulley(c, G.tx(i), HO.TY, s.spin, i < s.k || i === 0); HO.pulley(c, G.bx(i), by, -s.spin, i < s.k); }
    // the ropes holding the crate: glowing when it lifts, counted
    const ma = g.def.ma(s);
    if (!won) SK.tag(c, ma + (ma === 1 ? ' rope' : ' ropes'), G.cx, by + 40, 18, '#fff6ea', ma * HO.FORCE >= s.W ? 'rgba(40,140,70,0.92)' : 'rgba(30,14,36,0.75)');
    SK.tag(c, 'Pulleys', 236 + (s.K - 2) * 24, HO.TY - 2, 18);
    // the rope end being carried to a pulley
    if (s.tip) { const [x0, y0] = [G.tx(Math.max(0, s.k - 1)) + HO.R, HO.TY]; c.strokeStyle = '#e8c88a'; c.lineWidth = 4; c.setLineDash([6, 5]); c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + s.tip[0]) / 2, Math.max(y0, s.tip[1]) + 40, s.tip[0], s.tip[1]); c.stroke(); c.setLineDash([]); c.fillStyle = '#c8402a'; c.beginPath(); c.arc(s.tip[0], s.tip[1], 9, 0, 7); c.fill(); }
    // the pulled rope piles up in coils at the beaver's feet
    for (let i = 0; i < Math.min(12, Math.floor(s.coils)); i++) { c.strokeStyle = i % 2 ? '#c8a060' : '#e8c88a'; c.lineWidth = 4; c.beginPath(); c.ellipse(262 - (i % 4) * 4, HO.GY + 6 - Math.floor(i / 4) * 7 - (i % 2) * 3, 24, 7, 0, 0, 7); c.stroke(); }
    // the beaver hangs on the rope's hand-hold; lifted off its feet if the crate is too heavy for this many ropes
    const hy = s.mode === 'thread' ? HO.H0 : s.hy, lift = s.lift;
    if (hy < HO.GY - 80) { c.strokeStyle = '#7a5a2a'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(HO.HX, hy); c.quadraticCurveTo(HO.HX + 4, (hy + HO.GY) / 2, HO.HX - 4, HO.GY - 60 - s.lift); c.quadraticCurveTo(HO.HX - 20, HO.GY - 20, 262, HO.GY + 2); c.stroke(); c.strokeStyle = '#e8c88a'; c.lineWidth = 3.5; c.stroke(); } // the tail the beaver holds, down to the coils
    c.fillStyle = '#c8402a'; c.strokeStyle = '#6a1a0a'; c.lineWidth = 2; c.beginPath(); c.roundRect(HO.HX - 16, hy - 6, 32, 12, 6); c.fill(); c.stroke();
    const bY = Math.min(HO.GY, Math.max(hy + 96, HO.GY - lift));
    SK.animal(c, 'beaver', HO.HX + 8, lift > 0 ? HO.GY - lift : HO.GY, 1.05, { t, pose: won ? 'cheer' : lift > 0 ? 'hop' : 'carry', expr: won ? 'laugh' : lift > 0 || lost ? 'wow' : 'happy', facing: -1, noShadow: lift > 0 });
    if (lift > 0) SK.shadow(c, HO.HX + 8, HO.GY + 2, 22, 5, 0.25);
    SK.animal(c, 'fox', 24, s.loftY, 0.62, { t, pose: s.winT ? 'cheer' : 'point', expr: s.winT ? 'laugh' : 'happy' });
    // guidance: carry the rope end down round the next lower pulley; once all are threaded, pull the rope down
    const busy = g.done || s.winT; let hint = null;
    if (!busy && s.k < s.K) hint = { kind: 'drag', a: [HO.HX, HO.H0], b: [G.bx(s.k), by] };
    else if (!busy) hint = { kind: 'drag', a: [HO.HX, HO.H0], b: [HO.HX, HO.H1 - 10] };
    if (hint && !s.mode) {
      SK.grab(c, g, HO.HX, HO.H0, 24);
      if (s.k < s.K) { SK.target(c, g, G.bx(s.k), by, 20); SK.arrow(c, g, HO.HX, HO.H0, G.bx(s.k), by, { from: 28, to: 30 }); }
      else { SK.arrow(c, g, HO.HX - 40, HO.H0, HO.HX - 40, HO.H1 - 40, { from: 0, to: 0 }); }
    }
    SK.demo(g, c, 'drag', hint ? hint.a : [0, 0], hint ? hint.b : [0, 0], { never: !hint });
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._b = s._b || { n: 0, next: 1.0 }; if (g.done || s.winT || g.t < B.next) return;
    const G = HO.geo(s), by = s.cy - 112, thr = s.k < s.K, b = thr ? [G.bx(s.k), by] : [HO.HX, HO.H1];
    if (SK.bot.drag(g, synth, 'p' + B.n, B.next, [HO.HX, HO.H0], b, thr ? 0.4 : 0.3)) { B.n++; B.next = g.t + 0.15; }
  },
});
