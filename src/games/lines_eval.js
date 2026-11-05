// lines_eval.js — EVALUATE! Find f(v) for f(x) = ax ± b, written in light on the water of a reef.
// The question f(v) = ? floats under the definition. Every move acts out its working (show your work):
//   1. Drag the v onto the x of the definition (or onto the ?): the x is circled, the rule is copied down into the
//      question line symbol by symbol, and then the v lifts out of f(v) and drops into the x's place: f(v) = a · v ± b.
//   2. Tap the product (multiplication comes first): "a · v = av" writes itself under it, and the product collapses into
//      its value, which flies up into the line.
//   3. Tap the rest: "av ± b = f" writes itself, and the answer flies into the line.
// Tapping the "± b" before the product is the classic order-of-operations slip, so it only wobbles.
// Level 0: small numbers. Level 1: bigger ones. Level 2: a negative input, written in brackets.
// Medium mode: the product and the final sum open a tray when the working note reaches its "=".
const M = MK, INK = SCN.ink('none'), IN = '#ffd27a', GO = '#8af0d0', Y1 = 246, Y2 = 344, NY = 410;
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c, kind, x, y, s, facing) { // the host hops on beats and points at the work while it is shown
  const S = g.s, mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hk * 24, s, { t: g.t, pose, expr, facing }); else SCN.host(g, c, kind, x, y, s);
}
// a working note under the line: "3 · 4 = ?" writes itself; its result is written when the computation resolves
function work(g, nodes, res, x, T) { res.alpha = 0; const n = M.row(...nodes, M.op('='), res); M.place(g, 'note', n, x, NY, 30, { col: IN }); M.writeIn(g, n, { dur: 0.4 * T, delay: 0.1 * T }); return n; }
function workGone(g, T, delay) { M.at(g, [[delay, g => { const e = g.s.mk.ex.note; if (e) M.tween(g, e.node, { alpha: 0 }, 0.25 * T); }], [delay + 0.27 * T, g => { delete g.s.mk.ex.note; }]]); }
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  const a = L === 0 ? r(2, 4) : r(2, 6), b = L === 0 ? r(1, 5) : r(1, 9), s = g.rand() < 0.5 ? 1 : -1, v = L === 0 ? r(2, 5) : L === 1 ? r(3, 7) : -r(1, 4);
  return { a, b, s, v, pv: a * v, f: a * v + s * b };
}
const nm = (v, id, o) => v < 0 ? M.paren(M.num(v, null, o), id, o) : M.num(v, id, o);

MG.add({
  id: 'lines_eval', stage: 'lines', cmd: 'EVALUATE!', hint: 'drag', time: 9, winText: 'Evaluated!', hold: 1.4,
  card: {
    title: 'Evaluating a function', ref: 'Grade 8', kind: 'Algebra 1',
    text: 'A function is a rule that turns an input into an output. f(x) = 3x − 1 is the rule "multiply the input by 3, then subtract 1". The letter x stands for the input.\n\nTo evaluate the function means to find its output for one input. Write f(4) for the output when the input is 4. Put the 4 in place of every x, then do the arithmetic: multiplication first, then addition and subtraction.\n\nFor example, f(4) = 3 · 4 − 1 = 12 − 1 = 11.\n\nIf the input is negative, keep it in brackets: f(−2) = 3 · (−2) − 1 = −6 − 1 = −7. The brackets stop the minus signs from getting mixed up.',
    note: 'To find f(a), replace every x with a, then multiply before you add or subtract.',
    ask: 'If f(x) = 2x + 5, what is f(3)? What is f(−1)?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), sg = p.s < 0 ? '-' : '+', T = S.T = M.pace(g);
    S.def = M.row(M.vr('f', 'fd'), M.paren(M.vr('x', 'xf'), 'pf'), M.op('=', 'q1'), M.num(p.a, 'ca'), M.vr('x', 'xt'), M.op(sg, 'pm'), M.num(p.b, 'cb'));
    S.q = M.row(M.vr('f', 'fq'), M.paren(M.num(p.v, 'in', { col: IN }), 'pq'), M.op('=', 'q2'), M.slot('ans', { col: GO }));
    // the question line keeps a fixed left edge (centred for its longest form, f(v) = a · v ± b), so f(v) = never slides
    const wide = M.lay(M.row(M.vr('f'), M.paren(nm(p.v)), M.op('='), M.num(p.a), M.op('·'), nm(p.v), M.op(sg), M.num(p.b)), 40).w, QX = 180 - wide / 2;
    const place = S.place = () => { M.place(g, 'def', S.def, 180, Y1, 42, { col: INK }); M.place(g, 'q', S.q, QX, Y2, 40, { col: INK, left: true }); };
    place(); M.inert(g, ['fd', 'xf', 'pf', 'q1', 'pm', 'fq', 'pq', 'q2', 'w1', 'w2']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    S.sgn = M.op(sg, 'pm2'); S.tail = M.num(p.b, 'cb2'); // the same nodes all the way down, so they glide as the line shrinks
    const vIn = () => M.box(g, 'in') || { x: 120, y: Y2 };
    M.play(g, {
      moves(g) {
        // 1. substitute: the input flies up into the x, and the rule is copied down with the input in its place
        if (!S.subAt) return [{ drag: 'in', to: ['xt', 'ans'], reach: 70, busy: 0.1, then(g) {
          S.subAt = g.t; M.show(g, 1.15 * T); S.point = true; g.sfx('bubble'); hop(g, 'think');
          M.circle(g, 'xt', { col: IN, dur: 0.5 * T }); M.light(g, 'xt', { col: IN }); M.indicate(g, 'in', { dur: 0.4 * T, col: IN });
          // the rule is copied down into the question line, symbol by symbol (the x too, as a gap waiting for the input)
          S.a2 = M.num(p.a, null, { alpha: 0 }); S.dot = M.op('·', null, { alpha: 0 }); S.sx = M.vr('x', 'sx', { col: IN, alpha: 0 }); S.v2 = nm(p.v, null, { col: IN, _born: -1 });
          S.pr = M.row(S.a2, S.dot, S.sx); S.pr.id = 'pr'; S.sgn.alpha = 0; S.tail.alpha = 0;
          S.q.items[3] = M.row(S.pr, S.sgn, S.tail); place(); M.inert(g, ['sx']);
          const drop = (fromId, node, to, d) => M.fly(g, { node, from: fromId, to, delay: d, dur: 0.36 * T, arc: 18, s0: 42, s1: 40, col: node.col || INK, then(g) { to.alpha = 1; to.pop = g.t; } });
          const bx = id => { const b = M.box(g, id); return [b.x, b.y]; };
          drop(bx('ca'), M.num(p.a), S.a2, 0.15 * T); drop(bx('xt'), M.vr('x', null, { col: IN }), S.sx, 0.2 * T); drop(bx('pm'), M.op(sg), S.sgn, 0.25 * T); drop(bx('cb'), M.num(p.b), S.tail, 0.3 * T);
          M.at(g, [[0.4 * T, g => { S.dot.alpha = 1; S.dot._born = g.t; g.sfx('swoosh'); }],
            // the input lifts out of f( ) and drops into the x's place: the x gives way to it
            [0.68 * T, g => { const from = { ...vIn() }; M.unlight(g, 'xt'); M.tween(g, S.sx, { sc: 1.4, hl: 1 }, 0.15 * T, { yoyo: true });
              M.fly(g, { node: nm(p.v, null, { col: IN }), from: [from.x, from.y], to: 'sx', dur: 0.32 * T, arc: -46, s0: 40, s1: 44,
                then(g) { S.pr.items[2] = S.v2; place(); S.v2.pop = g.t; M.sparkle(g, S.v2, { n: 8, cols: [IN, '#fff'] }); g.sfx('pop'); hop(g); } }); }],
          ]); } }];
        // 2. multiply first: the product is worked out in a note under it and collapses into its value
        if (!S.tp) return [{ tap: 'pr', busy: 0.1, askAt: 0.6 * T, after: 0.9 * T, ask: { v: p.pv, wrong: [p.a + p.v, -p.pv, p.pv + p.a] },
          then(g) { S.tp = 1; M.show(g, 0.6 * T); S.point = true; hop(g, 'think'); M.circle(g, 'pr', { col: IN, dur: 0.5 * T }); M.light(g, S.pr, { col: IN });
            const b = M.box(g, 'pr'); S.r1 = M.num(p.pv, 'w1', { col: GO }); work(g, [M.num(p.a), M.op('·'), nm(p.v)], S.r1, b ? b.x : 180, T); },
          resolve(g) { M.show(g, 0.9 * T); S.r1.alpha = 1; M.writeIn(g, S.r1, { dur: 0.22 * T }); M.indicate(g, S.r1, { delay: 0.18 * T, dur: 0.3 * T, col: GO }); g.sfx('ding');
            M.at(g, [[0.45 * T, g => { const from = { ...M.box(g, 'w1') }; S.pv = M.num(p.pv, 'pv', { col: GO, alpha: 0 }); const rs = M.row(S.pv, S.sgn, S.tail); rs.id = 'rs'; S.q.items[3] = rs; place(); g.sfx('coin');
              M.fly(g, { node: M.num(p.pv, null, { col: GO }), from: [from.x, from.y], to: 'pv', dur: 0.32 * T, arc: 30, s0: 30, s1: 40, then(g) { S.pv.alpha = 1; S.pv.pop = g.t; M.sparkle(g, 'pv', { n: 8, cols: [GO, '#fff'] }); hop(g); } }); }]]);
            workGone(g, T, 0.6 * T); } }];
        // 3. then add or subtract: the sum is worked out in a note and the answer flies into the line
        if (!S.tf) return [{ tap: ['rs', 'pv', 'pm2', 'cb2'], busy: 0.1, askAt: 0.6 * T, after: 1.0 * T, ask: { v: p.f, wrong: [p.pv - p.s * p.b, p.a * (p.v + p.s * p.b), -p.f] },
          then(g) { S.tf = 1; M.show(g, 0.6 * T); S.point = true; hop(g, 'think'); M.circle(g, 'rs', { col: GO, dur: 0.5 * T });
            const b = M.box(g, 'rs'); S.r2 = M.num(p.f, 'w2', { col: GO }); work(g, [M.num(p.pv), M.op(sg), M.num(p.b)], S.r2, b ? b.x : 180, T); },
          resolve(g) { M.show(g, 1.0 * T); S.r2.alpha = 1; M.writeIn(g, S.r2, { dur: 0.22 * T }); M.indicate(g, S.r2, { delay: 0.18 * T, dur: 0.3 * T, col: GO }); g.sfx('ding');
            M.at(g, [[0.45 * T, g => { const from = { ...M.box(g, 'w2') }; S.res = M.num(p.f, 'res', { col: GO, alpha: 0 }); S.q.items[3] = S.res; M.inert(g, ['res']); place(); g.sfx('coin');
              M.fly(g, { node: M.num(p.f, null, { col: GO }), from: [from.x, from.y], to: 'res', dur: 0.32 * T, arc: 30, s0: 30, s1: 40,
                then(g) { S.res.alpha = 1; S.res.pop = g.t; S.winAt = g.t; g.sfx('chime'); hop(g, 'laugh'); S.point = false; const bb = M.box(g, 'res'); if (bb) g.burst(bb.x, bb.y, [GO, IN, '#fff'], 14, 130); } }); }]]);
            workGone(g, T, 0.6 * T); } }];
        return [];
      },
      area(g) { return !S.subAt ? ['in', 'xt'] : !S.tp ? ['pr'] : ['rs']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'reef', panel: 'none' });
    host(g, c, 'octopus', 286, 580, 1.35, -1);
    // each line rides on a long, dark ribbon of water with a glowing rim, bobbing gently
    for (const [key, y, col] of [['def', Y1 - 14, 'rgba(120,220,255,0.55)'], ['q', Y2 - 14, 'rgba(138,240,208,0.6)']]) {
      const e = S.mk.ex[key]; if (!e) continue; const w = e.node._m.w + 48, x = e.x - 24, h = 64, bob = Math.sin(t * 1.4 + y) * 2;
      c.save(); c.translate(0, bob); c.fillStyle = 'rgba(4,20,48,0.55)'; c.beginPath(); c.roundRect(x, y - h / 2, w, h, 32); c.fill(); c.strokeStyle = col; c.lineWidth = 2; c.stroke(); c.restore();
    }
    M.drawEx(g, c, 'def'); M.drawEx(g, c, 'q'); M.drawEx(g, c, 'note');
    M.drawUI(g, c);
  },
});
