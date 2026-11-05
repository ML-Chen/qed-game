// limits_factor.js — CANCEL! A limit that gives 0/0 when you substitute: factor the top, cancel the common factor,
// then substitute. lim x→r (x − r)(x + q)/(x − r) = r + q.
// Moves: tap the top to factor it into (x − r)(x + q); drag that (x − r) onto the bottom (or the bottom onto it) and
// both are struck out, leaving x + q; drag the r under "lim" into the x; tap r + q to add.
// Dragging the r into the unfactored fraction is the classic mistake: it wobbles and a red 0/0 flashes.
// Level 0: x² − r² over x − r. Level 1: x² + bx + c over x − r. Level 2: negative r or a factor with a minus.
// Medium mode: the final sum opens the tray.
const M = MK, PANEL = 'paper', INK = SCN.ink(PANEL), SUB = '#c0503a', CUT = '#e0503a';
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) { const a = 1 + r(4); return { r: a, q: a }; }
  if (L === 1) { const a = 1 + r(4); let q = 1 + r(5); if (q === a) q++; return { r: a, q }; }
  for (;;) { const a = [-4, -3, -2, -1, 2, 3, 4, 5][r(8)], q = [-3, -2, -1, 1, 2, 3, 4, 5][r(8)]; if (q !== -a && q !== a) return { r: a, q }; }
}
function glyph(c, b, col) {
  if (!b) return; const s = b.s, y = b.y - s * 0.3, x0 = b.x - b.w / 2 + s * 0.1, x1 = b.x + b.w / 2 - s * 0.1; c.save(); c.strokeStyle = col; c.lineWidth = Math.max(2, s * 0.08); c.lineCap = c.lineJoin = 'round';
  c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.moveTo(x1 - s * 0.2, y - s * 0.17); c.lineTo(x1, y); c.lineTo(x1 - s * 0.2, y + s * 0.17); c.stroke(); c.restore();
}
// x + k (or x − |k|) as a row
const lin = (k, id, xid) => Object.assign(M.row(M.vr('x', xid), M.op(k < 0 ? '-' : '+'), M.num(Math.abs(k))), { id });
// x² + bx + c with zero terms left out
function quad(b, c0, id) {
  const it = [M.sup(M.vr('x'), M.num(2))];
  if (b) it.push(M.op(b < 0 ? '-' : '+'), Math.abs(b) === 1 ? M.vr('x') : M.row(M.num(Math.abs(b)), M.vr('x')));
  if (c0) it.push(M.op(c0 < 0 ? '-' : '+'), M.num(Math.abs(c0)));
  return Object.assign(M.row(...it), { id });
}
function build(g) {
  const S = g.s, p = S.pops, R = S.r, Q = S.q;
  const lim = M.txt('lim', 'lim'), sub = M.row(M.vr('x'), { k: 'gap', w: 22, id: 'arr' }, M.num(R, 'a', { col: SUB }));
  const orig = () => M.frac(quad(Q - R, -R * Q), lin(-R));
  let main;
  if (S.st === 0) main = M.frac(quad(Q - R, -R * Q, 'top'), lin(-R, 'den'));
  else if (S.st === 1) main = M.frac(M.row(M.paren(lin(-R), 'f1', { pop: p.f }), M.paren(lin(Q), 'f2', { pop: p.f })), lin(-R, 'den'));
  else if (S.st === 2) main = lin(Q, 'rest', 'xr');
  else if (S.st === 3) main = Object.assign(M.row(R < 0 ? M.paren(M.num(R, null, { col: SUB })) : M.num(R, null, { col: SUB }), M.op(Q < 0 ? '-' : '+'), M.num(Math.abs(Q))), { id: 'sum', pop: p.s });
  else main = M.row(orig(), M.op('='), M.num(R + Q, 'res', { col: M.GOOD, pop: p.v }));
  let s = 46; const w = () => Math.max(M.lay(lim, s).w, M.lay(sub, s * 0.55).w) + s * 0.25 + M.lay(main, s).w;
  if (w() > 310) s *= 310 / w();
  const cw = Math.max(M.lay(lim, s).w, M.lay(sub, s * 0.55).w), x0 = 180 - w() / 2, y = 300;
  M.place(g, 'lim', lim, x0 + cw / 2, y, s, { col: INK }); M.place(g, 'sub', sub, x0 + cw / 2, y + s * 0.62, s * 0.55, { col: INK });
  M.place(g, 'main', main, x0 + cw + s * 0.25, y, s, { col: INK, left: true });
}

MG.add({
  id: 'limits_factor', stage: 'limits', cmd: 'CANCEL!', hint: 'drag', time: 9, mood: 'bright', winText: 'Cancelled!', hold: 1.4,
  card: {
    title: 'Limits by factoring', ref: 'Calculus', kind: 'Limits',
    text: 'Sometimes putting the number in gives 0/0. For lim x→2 (x² − 4)/(x − 2), putting in 2 gives (4 − 4)/(2 − 2) = 0/0. The expression 0/0 has no value, so it tells you to simplify first. It does not mean the limit is 0.\n\nFactor the top: x² − 4 = (x − 2)(x + 2). Now the top and the bottom share the factor x − 2. While x is close to 2 but not equal to 2, x − 2 is not zero, so you may cancel it. What is left is x + 2.\n\nNow substitute: 2 + 2 = 4. So the limit is 4.\n\nThe graph of (x² − 4)/(x − 2) is the line y = x + 2 with one hole at x = 2. The limit is the height of the hole.',
    note: 'If substituting gives 0/0, factor, cancel the factor that made the zero, then substitute again.',
    ask: 'What is lim x→3 (x² − 9)/(x − 3)? What is lim x→1 (x² + x − 2)/(x − 1)?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); S.st = 0; S.pops = {}; build(g); M.inert(g, ['arr', 'res']);
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const R = S.r, Q = S.q;
    M.play(g, {
      moves(g) {
        if (S.st === 0) return [{ tap: 'top', busy: 0.1, then(g) { S.st = 1; S.pops.f = g.t; g.sfx('pop'); build(g); } }];
        if (S.st === 1) {
          const cut = { busy: 0.15, then(g) { S.cut = [M.box(g, 'f1'), M.box(g, 'den')].map(b => ({ ...b })); S.cutT = g.t; S.st = 2; g.sfx('sweep'); build(g); const b = M.box(g, 'rest'); if (b) g.burst(b.x, b.y, ['#ffb070', '#fff'], 8, 100); } };
          return [{ drag: 'f1', to: 'den', reach: 70, ...cut }, { drag: 'den', to: 'f1', reach: 70, ...cut }];
        }
        if (S.st === 2) return [{ drag: 'a', to: 'xr', reach: 80, area: [0, 180, 360, 400], busy: 0.1, then(g) { S.st = 3; S.pops.s = g.t; g.sfx('pop'); build(g); } }];
        if (S.st === 3 && !S.tapped) return [{ tap: 'sum', busy: 0.1, ask: { v: R + Q, wrong: [R - Q, Q - R, R * Q, 0, -(R + Q)] }, askAt: 0, after: 0.1,
          then() { S.tapped = true; }, resolve(g) { S.st = 4; S.pops.v = g.t; g.sfx('coin'); build(g); const b = M.box(g, 'res'); if (b) g.burst(b.x, b.y, ['#ffd45a', '#9ae07a', '#fff'], 14, 130); } }];
        return [];
      },
      area(g) { return [['top'], ['f1', 'den'], ['a', 'xr'], ['sum']][S.st] || null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = g.s.mk;
    SCN.std(g, c, { scene: 'kitchen', panel: PANEL, host: 'beaver', hostX: 80, hostY: 590, hostS: 1.3, panelY: 300, panelH: 190 });
    M.drawEx(g, c, 'lim'); M.drawEx(g, c, 'sub'); M.drawEx(g, c, 'main'); glyph(c, M.box(g, 'arr'), INK);
    // the two cancelled factors, struck out where they were
    if (S.cut && t - S.cutT < 0.5) { const k = M.clamp((t - S.cutT) / 0.15, 0, 1), fade = 1 - M.clamp((t - S.cutT - 0.25) / 0.25, 0, 1);
      c.save(); c.globalAlpha = fade; c.strokeStyle = CUT; c.lineWidth = 4; c.lineCap = 'round';
      for (const b of S.cut) { if (!b.w) continue; c.beginPath(); c.moveTo(b.x - b.w / 2, b.y + b.h / 2); c.lineTo(M.lerp(b.x - b.w / 2, b.x + b.w / 2, k), M.lerp(b.y + b.h / 2, b.y - b.h / 2, k)); c.stroke(); }
      c.restore(); }
    // the classic mistake, acted out: substituting too early gives 0/0
    if (K.missInfo && (K.missInfo.drag === 'a' || K.missInfo.tap === 'a') && S.st < 2 && t - K.missAt < 0.9) {
      const n = M.frac(M.num(0), M.num(0)), m = M.lay(n, 40), a = Math.sin(Math.min(1, (t - K.missAt) / 0.9) * Math.PI);
      c.save(); c.globalAlpha = a; M.draw(c, n, 300 - m.w / 2, 230, 40, { col: M.BAD }); c.restore();
    }
    M.drawUI(g, c);
  },
});
