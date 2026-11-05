// integers_line.js — NUMBER LINE! Add and subtract on a number line by hopping: −2 + 5 starts at −2 and hops 5 to the
// right, landing on 3. Subtracting hops left; adding a negative hops left; subtracting a negative hops right.
// A meadow with a long wooden boardwalk marked as a number line. The player drags the frog along it; every whole number
// it passes is a hop that snaps into place and leaves an arc behind, so the hops can be counted. Letting go on the
// answer wins. Letting go short of it (in the right direction) keeps the frog there to carry on; letting go past it or
// on the wrong side is a wrong move: the frog wobbles and hops back to the start.
// Level 0: negative start, adding. Level 1: adding or subtracting a positive number. Level 2: also a + (−b), a − (−b).
// Medium mode: after landing, a tray asks for the sum; wrong tiles are hopping the wrong way, the wrong sign, one off.
// The kit's moves are for taps and drags between parts, so this file handles the continuous frog drag itself (like
// calc_tangent.js): moves(g) returns a placeholder drag (frog onto the goal, which the kit's guidance demonstrates)
// until the sum is in, then an empty list, so the kit wins the game through its own finish().
const M = MK, INK = '#2a1840', LY = 404, X0 = 24, X1 = 336;
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  for (;;) {
    let a, o, b;
    if (L === 0) { a = -(1 + r(5)); o = '+'; b = 3 + r(5); }
    else { a = r(11) - 5; o = g.rand() < 0.5 ? '+' : '-'; b = 2 + r(6); if (L === 2 && g.rand() < 0.5) b = -b; }
    const v = o === '+' ? a + b : a - b;
    if (Math.abs(v) <= 8 && v !== a) return { a, o, b, v };
  }
}
MG.add({
  id: 'integers_line', stage: 'integers', cmd: 'NUMBER LINE!', hint: 'drag', time: 9, mood: 'bright', winText: 'Landed!', hold: 1.4,
  card: {
    title: 'Adding on a number line', ref: 'Grades 6–7', kind: 'Negative numbers',
    text: 'A number line shows every number in order. Negative numbers are to the left of 0 and positive numbers are to the right.\n\nTo add a positive number, start at the first number and hop that many steps to the right. To subtract a positive number, hop to the left. For example, −2 + 5: start at −2 and hop 5 steps right. You land on 3, so −2 + 5 = 3.\n\nA negative number turns the hops around. Adding −3 hops 3 steps left, the same as subtracting 3. Subtracting −3 hops 3 steps right, the same as adding 3.',
    note: 'Adding a positive number moves right, subtracting it moves left. A negative number flips the direction.',
    ask: 'Where do you land for −4 + 6? For 1 − 5?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g));
    let lo = Math.min(S.a, S.v) - 1, hi = Math.max(S.a, S.v) + 1;
    while (hi - lo < 10) { if (hi - lo < 10) hi++; if (hi - lo < 10) lo--; }
    S.lo = lo; S.hi = hi; S.u = (X1 - X0) / (hi - lo); S.X = v => X0 + (v - S.lo) * S.u; S.pos = S.a; S.from = S.a; S.hopAt = -9; S.drag = null;
    S.slot = M.slot('ans', { col: INK });
    const bn = S.b < 0 ? M.paren(M.num(S.b, 'b'), 'bp') : M.num(S.b, 'b');
    S.exNode = M.row(M.num(S.a, 'a'), M.op(S.o, 'op'), bn, M.op('=', 'eq'), S.slot); M.place(g, 'ex', S.exNode, 180, 250, 44, { col: INK });
    M.inert(g, ['eq', 'ans', 'bp', 'goal']);
    M.zone(g, 'goal', { x: S.X(S.v), y: LY - 16, w: 40, h: 40 }); M.zone(g, 'frog', { x: S.X(S.pos), y: LY - 18, w: 44, h: 44 });
    g.dur *= (2.6 + 1.05 * 3) / 8;
    M.play(g, {
      moves(g) { return S.answered ? [] : [{ drag: 'frog', to: 'goal' }]; },
      area(g) { return 'frog'; },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    M.zone(g, 'frog', { x: S.X(S.pos), y: LY - 18, w: 44, h: 44 });
  },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask && !K.ask.closing) { M.down(g, x, y); return; }
    if (!S.landed && Math.hypot(x - S.X(S.pos), y - (LY - 18)) < 40) { S.drag = { x, y }; g.sfx('tap'); return; }
    M.down(g, x, y);
  },
  move(g, x, y) {
    const S = g.s; if (!S.drag || g.done) { M.move(g, x, y); return; }
    const p = M.clamp(Math.round((x - X0) / S.u + S.lo), S.lo, S.hi);
    if (p !== S.pos) { S.from = S.pos; S.pos = p; S.hopAt = g.t; g.sfx('ribbit', { vol: 0.4 }); g.sfx('pop'); }
  },
  up(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (!S.drag) { M.up(g, x, y); return; }
    S.drag = null; K.moveT = g.t;
    if (S.pos === S.v) { land(g); return; }
    const dir = Math.sign(S.v - S.a), went = (S.pos - S.a) * dir;
    if (went >= 0 && S.pos !== S.v && (S.pos - S.v) * dir < 0) return;  // short of the answer, right direction: stay
    K.wrong = (K.wrong || 0) + 1; K.missAt = g.t; K.missInfo = { drag: 'frog', to: 'line' }; g.sfx('boing');
    S.backAt = g.t; S.from = S.pos; S.pos = S.a; S.hopAt = g.t;
  },
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { if (!K.ask.closing) M.auto(g, dt, synth); return; }
    if (S.landed) return;
    if (S.bot) { const k = M.clamp((g.t - S.bot.t0) / 0.5, 0, 1), x = M.lerp(S.bot.x, S.X(S.v), k); synth('move', x, LY - 18); if (k >= 1) { synth('up', x, LY - 18); S.bot = null; } return; }
    if (g.t < 0.4) return;
    const x = S.X(S.pos); synth('down', x, LY - 18); S.bot = { t0: g.t, x };
  },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.bg(g, c, 'meadow');
    P.cloud(c, 180, 268, 1.75, '#fffdf6', '#d8e8f2', 0.95);
    M.drawEx(g, c, 'ex');
    // the boardwalk number line
    c.save(); c.fillStyle = 'rgba(40,30,10,0.25)'; c.fillRect(X0 - 14, LY + 6, X1 - X0 + 28, 16);
    const wg = c.createLinearGradient(0, LY - 4, 0, LY + 14); wg.addColorStop(0, '#d8a868'); wg.addColorStop(1, '#9a6a38'); c.fillStyle = wg; c.fillRect(X0 - 14, LY - 4, X1 - X0 + 28, 18);
    c.strokeStyle = '#5a3a18'; c.lineWidth = 2; c.strokeRect(X0 - 14, LY - 4, X1 - X0 + 28, 18);
    c.font = M.NUMF(15, 700); c.textAlign = 'center'; c.lineCap = 'round';
    for (let v = S.lo; v <= S.hi; v++) { const x = S.X(v); c.strokeStyle = '#4a2a10'; c.lineWidth = v === 0 ? 4 : 2; c.beginPath(); c.moveTo(x, LY - 4); c.lineTo(x, LY + 14); c.stroke();
      c.fillStyle = v === 0 ? '#2a1840' : '#4a3a5a'; c.fillText(String(v).replace('-', '−'), x, LY + 36); }
    c.restore();
    // the start flag
    const sx = S.X(S.a); c.strokeStyle = '#5a3a18'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(sx, LY - 4); c.lineTo(sx, LY - 70); c.stroke();
    c.fillStyle = '#ff7a5a'; c.beginPath(); c.moveTo(sx, LY - 70); c.lineTo(sx + 22, LY - 63); c.lineTo(sx, LY - 56); c.fill();
    // hop arcs from the start to the frog
    const dir = Math.sign(S.pos - S.a), good = dir === Math.sign(S.v - S.a);
    for (let v = S.a; v !== S.pos; v += dir) { const xa = S.X(v), xb = S.X(v + dir);
      c.strokeStyle = good ? 'rgba(40,150,80,0.85)' : 'rgba(216,69,74,0.85)'; c.lineWidth = 3; c.setLineDash([6, 5]); c.beginPath(); c.moveTo(xa, LY - 8); c.quadraticCurveTo((xa + xb) / 2, LY - 8 - S.u * 0.9, xb, LY - 8); c.stroke(); c.setLineDash([]); }
    if (S.pos !== S.a) { c.fillStyle = good ? '#1e7a40' : '#b8303a'; c.font = M.NUMF(18, 700); c.textAlign = 'center'; c.fillText((dir > 0 ? '+' : '−') + Math.abs(S.pos - S.a), (S.X(S.a) + S.X(S.pos)) / 2, LY - 18 - S.u * 0.6); }
    // the frog, hopping between whole numbers
    const k = M.clamp((t - S.hopAt) / (S.backAt === S.hopAt ? 0.3 : 0.14), 0, 1), fx = M.lerp(S.X(S.from), S.X(S.pos), M.easeIO(k)), fy = LY - 10 - Math.sin(k * Math.PI) * (S.backAt === S.hopAt ? 40 : 16);
    const wob = K.missInfo && K.missInfo.drag === 'frog' && t - K.missAt < 0.4 ? Math.sin((t - K.missAt) * 50) * 4 : 0, won = g.done && g.result === 'win';
    if (S.drag) { c.fillStyle = 'rgba(255,230,120,0.35)'; c.beginPath(); c.arc(S.X(S.pos), LY - 24, 30, 0, 7); c.fill(); }
    try { ANI.draw(c, 'frog', fx + wob, fy, 1.05, { t, pose: won ? 'cheer' : k < 1 ? 'hop' : 'idle', expr: won ? 'laugh' : g.done ? 'sad' : 'happy', facing: Math.sign(S.v - S.a) || 1 }); } catch (e) { P.sheep(c, fx, fy, 0.8, { t }); }
    SCN.host(g, c, 'duck', 300, 566, 1.2);
    if (!S.drag && !S.landed) M.drawGuide(g, c);
    M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});
function land(g) {
  const S = g.s; S.landed = true; g.sfx('splash'); g.burst(S.X(S.v), LY - 20, ['#9ae07a', '#ffd45a', '#ffffff'], 14, 140); S.mk.lastMove = g.t;
  const fill = g => { S.answered = true; S.slot.fill = M.num(S.v, null, { pop: g.t, col: '#1e7a40' }); M.place(g, 'ex', S.exNode, 180, 250, 44, { col: INK }); g.sfx('coin'); };
  if (g.mode === 'medium') M.openAsk(g, { ask: { v: S.v, wrong: [S.o === '+' ? S.a - S.b : S.a + S.b, -S.v, S.v + 1, S.v - 1] }, resolve: fill, after: 0.05 });
  else fill(g);
}
