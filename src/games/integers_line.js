// integers_line.js — NUMBER LINE! Add and subtract on a number line by hopping: −2 + 5 starts at −2 and hops 5 to the
// right, landing on 3. Subtracting hops left; adding a negative hops left; subtracting a negative hops right.
// A meadow with a long wooden boardwalk marked as a number line. The player drags the frog along it; every whole number
// it passes is a hop that snaps into place and leaves an arc behind, so the hops can be counted. Letting go on the
// answer wins. Letting go short of it (in the right direction) keeps the frog there to carry on; letting go past it or
// on the wrong side is a wrong move: the frog wobbles and hops back to the start.
// Level 0: negative start, adding. Level 1: adding or subtracting a positive number. Level 2: also a + (−b), a − (−b).
// Show your work: once the frog lands, the operation in the sum is circled; for a negative number a note writes the
// rule right above the hops ("+ (−3) = − 3", "− (−3) = + 3"); the hop arcs light up one after another while a count
// rides over each (1, 2, 3, ...), the total (+5 or −3) pops, the landing number glows and flies up into the answer.
// The frog cheers at the end of the hops and the duck hops on each beat.
// Medium mode: after the hops are counted, a tray asks for the sum; wrong tiles are hopping the wrong way, the wrong
// sign, one off.
// The kit's moves are for taps and drags between parts, so this file handles the continuous frog drag itself (like
// calc_tangent.js): moves(g) returns a placeholder drag (frog onto the goal, which the kit's guidance demonstrates)
// until the sum is in, then an empty list, so the kit wins the game through its own finish().
const M = MK, INK = '#2a1840', LY = 404, X0 = 24, X1 = 336, GOLD = '#f2a81a', NOTE = '#1e6a8a';
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
    // hop arcs from the start to the frog; once landed they are counted one by one (gold, with the count above each)
    const dir = Math.sign(S.pos - S.a), good = dir === Math.sign(S.v - S.a), C = S.cnt, n = Math.abs(S.pos - S.a);
    let j = 0; const labels = []; // hop counts, drawn over the frog
    for (let v = S.a; v !== S.pos; v += dir, j++) { const xa = S.X(v), xb = S.X(v + dir), lit = C && t >= C.t0 + j * C.per, lk = lit ? M.clamp((t - C.t0 - j * C.per) / 0.2, 0, 1) : 0, h = S.u * 0.9 * (1 + 0.25 * Math.sin(lk * Math.PI));
      c.strokeStyle = lit ? GOLD : good ? 'rgba(40,150,80,0.85)' : 'rgba(216,69,74,0.85)'; c.lineWidth = lit ? 4 : 3; if (!lit) c.setLineDash([6, 5]);
      if (lit) { c.shadowColor = '#ffe27a'; c.shadowBlur = 10; }
      c.beginPath(); c.moveTo(xa, LY - 8); c.quadraticCurveTo((xa + xb) / 2, LY - 8 - h, xb, LY - 8); c.stroke(); c.setLineDash([]); c.shadowBlur = 0;
      if (lit && !(C.gone && t > C.gone)) labels.push([Math.min(1, lk * 3), String(j + 1), (xa + xb) / 2, LY - 14 - S.u * 0.45 - 6 * Math.sin(lk * Math.PI)]); }
    if (S.pos !== S.a) { const tx = (S.X(S.a) + S.X(S.pos)) / 2, done = C && t >= C.t0 + n * C.per, pk = done ? M.clamp((t - C.t0 - n * C.per) / 0.3, 0, 1) : 0;
      if (!C || done) { c.save(); c.globalAlpha = C ? Math.min(1, pk * 3) : 1; outlined(c, (dir > 0 ? '+' : '−') + n, tx, LY - 30 - S.u * 0.55 - (C ? 8 : 0), (C ? 22 : 18) * (1 + 0.35 * Math.sin(pk * Math.PI)), C ? GOLD : good ? '#1e7a40' : '#b8303a'); c.restore(); } }
    // the landing number glows before it flies up into the answer
    if (S.glow != null) { const gk = M.clamp((t - S.glow) / 0.25, 0, 1); c.save(); c.globalAlpha = gk * (S.answered ? 0.5 : 1); c.fillStyle = 'rgba(255,226,122,0.75)'; c.beginPath(); c.arc(S.X(S.v), LY + 30, 13 + 3 * Math.sin(gk * Math.PI), 0, 7); c.fill(); c.restore(); }
    // the frog, hopping between whole numbers
    const bk = S.bounce != null ? M.clamp((t - S.bounce) / 0.14, 0, 1) : 1, k = M.clamp((t - S.hopAt) / (S.backAt === S.hopAt ? 0.3 : 0.14), 0, 1), fx = M.lerp(S.X(S.from), S.X(S.pos), M.easeIO(k)), fy = LY - 10 - Math.sin(k * Math.PI) * (S.backAt === S.hopAt ? 40 : 16) - Math.sin(bk * Math.PI) * 6;
    const wob = K.missInfo && K.missInfo.drag === 'frog' && t - K.missAt < 0.4 ? Math.sin((t - K.missAt) * 50) * 4 : 0, won = g.done && g.result === 'win';
    if (S.drag) { c.fillStyle = 'rgba(255,230,120,0.35)'; c.beginPath(); c.arc(S.X(S.pos), LY - 24, 30, 0, 7); c.fill(); }
    try { ANI.draw(c, 'frog', fx + wob, fy, 1.05, { t, pose: won ? 'cheer' : k < 1 ? 'hop' : 'idle', expr: won ? 'laugh' : g.done ? 'sad' : 'happy', facing: Math.sign(S.v - S.a) || 1 }); } catch (e) { P.sheep(c, fx, fy, 0.8, { t }); }
    for (const [a, txt, x, y] of labels) { c.save(); c.globalAlpha = a; outlined(c, txt, x, y, 15, '#8a5a00'); c.restore(); }
    SCN.host(g, c, 'duck', 300, 566, 1.2);
    M.drawAnims(g, c);
    if (!S.drag && !S.landed) M.drawGuide(g, c);
    M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});
function outlined(c, s, x, y, sz, col) { c.save(); c.font = M.NUMF(sz, 700); c.textAlign = 'center'; c.lineJoin = 'round'; c.lineWidth = 4; c.strokeStyle = 'rgba(255,255,255,0.92)'; c.strokeText(s, x, y); c.fillStyle = col; c.fillText(s, x, y); c.restore(); }
// the frog has landed on the answer: show the work, then fill in the sum
function land(g) {
  const S = g.s, T = M.pace(g), n = Math.abs(S.v - S.a), neg = S.b < 0, pre = (neg ? 0.75 : 0.35) * T, per = Math.min(0.16, 0.9 / n) * T, askAt = pre + n * per + 0.25 * T, after = 0.6 * T;
  S.landed = true; g.sfx('splash'); g.burst(S.X(S.v), LY - 20, ['#9ae07a', '#ffd45a', '#ffffff'], 14, 140); S.mk.lastMove = g.t;
  M.show(g, askAt); M.circle(g, neg ? ['op', 'bp'] : ['op', 'b'], { dur: 0.5 * T, col: GOLD });
  // a negative number flips the direction: the rule writes itself right above the hops
  if (neg) M.note(g, { node: M.row(M.op(S.o), M.paren(M.num(S.b)), M.op('='), M.op(S.o === '+' ? '-' : '+'), M.num(-S.b)), at: [M.clamp((S.X(S.a) + S.X(S.v)) / 2, 90, 270), LY - 104], s: 24, col: NOTE, delay: 0.1 * T, write: 0.35 * T, hold: 0.5 * T + n * per, fade: 0.25 * T });
  S.cnt = { t0: g.t + pre, per };
  M.at(g, Array.from({ length: n }, (_, j) => [pre + j * per, g => { g.sfx('tap', { vol: 0.5 }); S.bounce = g.t; }]).concat([[pre + n * per, g => { g.sfx('ding'); S.mk.lastMove = g.t; }]]));
  const fill = g => { M.show(g, after); S.glow = g.t; g.sfx('swoosh');
    M.at(g, [[0.2 * T, g => { S.cnt.gone = g.t; M.fly(g, { node: M.num(S.v, null, { col: '#1e7a40' }), from: [S.X(S.v), LY + 30], to: 'ans', dur: 0.36 * T, arc: -40, s0: 15, s1: 44,
      then(g) { S.answered = true; S.slot.fill = M.num(S.v, null, { pop: g.t, col: '#1e7a40', _born: -1 }); M.place(g, 'ex', S.exNode, 180, 250, 44, { col: INK }); g.sfx('coin'); S.mk.lastMove = g.t; M.sparkle(g, 'ans', { cols: ['#9ae07a', '#ffd45a', '#fff'] }); } }); }]]); };
  if (g.mode === 'medium') M.later(g, askAt, g => M.openAsk(g, { ask: { v: S.v, wrong: [S.o === '+' ? S.a - S.b : S.a + S.b, -S.v, S.v + 1, S.v - 1] }, resolve: fill, after }), true);
  else M.later(g, askAt, fill, true);
}
