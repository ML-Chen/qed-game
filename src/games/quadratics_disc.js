// quadratics_disc.js — DISCRIMINANT! Work out b² − 4ac and read off how many roots ax² + bx + c = 0 has.
// Deep space: the numbers glow like starlight, and the parabola y = ax² + bx + c hangs faintly below them.
// The player drags a, b and c from the key onto their letters in b² − 4ac (any order), taps the expression to work it
// out, then drags the result onto its sign: "> 0" (two roots), "= 0" (one root) or "< 0" (no roots). The parabola then
// lights up, and the places where it crosses or touches the x-axis shine.
// Level 0: a = 1, small numbers. Level 1: a = 1 or 2. Level 2: a = 2 or 3, bigger numbers.
// Medium mode: the value of b² − 4ac is picked from the tray.
const M = MK, INK = '#f4f0ff', LET = '#a8d8ff', NEW = '#ffe68a';
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), kind = ['+', '0', '-'][r(0, 2)];
  for (;;) {
    const a = L === 0 ? 1 : L === 1 ? r(1, 2) : r(2, 3);
    let b, c;
    if (kind === '0') { const m = r(-3, 3); if (!m) continue; b = -2 * a * m; c = a * m * m; }
    else { b = r(-(L ? 8 : 6), L ? 8 : 6); c = L === 2 ? r(-6, 9) : r(-4, 9); }
    const D = b * b - 4 * a * c; if (!b || !c || Math.abs(D) > 100) continue;
    if (kind === '+' ? D > 0 : kind === '-' ? D < 0 : D === 0) return { a, b, c, D, kind };
  }
}
function poly(a, b, c) { return M.row(M.vr('y'), M.op('='), a === 1 ? null : M.num(a), M.sup(M.vr('x'), M.num(2)), M.op(b < 0 ? '-' : '+'), Math.abs(b) === 1 ? null : M.num(Math.abs(b)), M.vr('x'), M.op(c < 0 ? '-' : '+'), M.num(Math.abs(c))); }
const sn = (v, o) => v < 0 ? M.paren(M.num(v, null, o), null, o) : M.num(v, null, o);
function swap(n, nn) { for (const k of Object.keys(n)) delete n[k]; Object.assign(n, nn); }
const CL = [['cg', '>', 2, '2 roots'], ['ce', '=', 1, '1 root'], ['cl', '<', 0, 'no roots']];

MG.add({
  id: 'quadratics_disc', stage: 'quadratics', cmd: 'DISCRIMINANT!', hint: 'drag', time: 10, mood: 'night', winText: 'Counted!', hold: 1.4,
  card: {
    title: 'The discriminant', ref: 'Algebra 1–2', kind: 'Algebra',
    text: 'For a quadratic ax² + bx + c, the discriminant is the number b² − 4ac. It is the part under the square root in the quadratic formula.\n\nIts sign tells you how many solutions ax² + bx + c = 0 has. If b² − 4ac is more than 0, there are two, and the graph crosses the x-axis twice. If it is 0, there is one, and the graph just touches the x-axis. If it is less than 0, there are none, and the graph never reaches the x-axis.\n\nFor example, x² − 4x + 3 has a = 1, b = −4 and c = 3, so b² − 4ac = 16 − 12 = 4, which is more than 0: two solutions.\n\nWhy: a negative number has no real square root.',
    note: 'b² − 4ac > 0: two roots. b² − 4ac = 0: one root. b² − 4ac < 0: no real roots.',
    ask: 'How many solutions does x² + 2x + 5 = 0 have? How many does x² − 6x + 9 = 0 have?',
  },
  init(g) {
    const S = g.s; M.setup(g); const Q = S.q = pick(g);
    M.place(g, 'prob', poly(Q.a, Q.b, Q.c), 180, 208, 30, { col: INK });
    const key = (L, v) => [M.vr(L, null, { col: LET }), M.op('='), M.num(v, 'k' + L, { col: NEW })];
    M.place(g, 'key', M.row(...key('a', Q.a), M.gap(22), ...key('b', Q.b), M.gap(22), ...key('c', Q.c)), 180, 250, 24, { col: INK });
    const lt = (L, id) => M.vr(L, id, { col: LET });
    S.dx = M.row(M.sup(lt('b', 'sb'), M.num(2)), M.op('-'), M.num(4), lt('a', 'sa'), lt('c', 'sc')); S.dx.id = 'dx';
    const fit = S.fit = () => { let z = 38; while (z > 18 && M.lay(S.dx, z).w > 320) z -= 1; M.place(g, 'dx', S.dx, 180, 312, z, { col: INK }); };
    fit();
    CL.forEach(([id, op], i) => { const n = M.row(M.op(op), M.num(0)); n.id = id; M.place(g, id, n, 70 + i * 110, 362, 28, { col: INK }); });
    CL.forEach(([id, , , lab], i) => M.place(g, 'l' + id, M.txt(lab, 'l' + id), 70 + i * 110, 392, 14, { col: 'rgba(220,210,255,0.75)' }));
    M.inert(g, CL.map(q => 'l' + q[0]));
    g.dur *= (2.6 + 1.05 * 5) / 8;
    S.f = {};
    const o = { col: NEW }, T = { a: 'sa', b: 'sb', c: 'sc' };
    const sub = { a: g => swap(M.node(g, 'sa'), M.row(M.op('·'), sn(Q.a, o))), b: g => swap(M.node(g, 'sb'), sn(Q.b, o)), c: g => swap(M.node(g, 'sc'), M.row(M.op('·'), sn(Q.c, o))) };
    const right = CL.find(q => (q[1] === '>' && Q.D > 0) || (q[1] === '=' && Q.D === 0) || (q[1] === '<' && Q.D < 0));
    M.play(g, {
      moves(g) {
        const out = [];
        for (const L of ['a', 'b', 'c']) if (!S.f[L]) out.push({ drag: 'k' + L, to: T[L], busy: 0.1, then(g) { S.f[L] = true; sub[L](g); fit(); const k = M.node(g, 'k' + L); k.alpha = 0.4; M.inert(g, ['k' + L]); g.sfx('snap'); } });
        if (out.length) return out;
        if (!S.dDone) return [{ tap: 'dx', busy: 0.1, askAt: 0, after: 0.1, ask: { v: Q.D, wrong: [Q.b * Q.b + 4 * Q.a * Q.c, -Q.b * Q.b - 4 * Q.a * Q.c, Q.D + 4, Q.D - 2] },
          then(g) { S.dDone = true; }, resolve(g) { S.dx.items.push(M.op('='), M.num(Q.D, 'dv', { col: NEW, pop: g.t })); fit(); g.sfx('coin'); } }];
        if (!S.cDone) return [{ drag: 'dv', to: right[0], reach: 40, busy: 0.1, then(g) { S.cDone = true; S.litAt = g.t; const n = M.node(g, right[0]); n.mark = 'good'; n.pop = g.t; g.sfx('chime');
          const b = M.box(g, right[0]); if (b) g.burst(b.x, b.y, [NEW, '#fff', '#a8d8ff'], 14, 130); } }];
        return [];
      },
      area(g) { const L = ['a', 'b', 'c'].find(L => !S.f[L]); return L ? ['k' + L, T[L]] : !S.dDone ? ['dx'] : ['dv', right[0]]; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, Q = S.q, t = g.t; SCN.bg(g, c, 'space');
    // a soft nebula behind the writing
    c.save(); const nb = c.createRadialGradient(190, 290, 10, 190, 290, 210); nb.addColorStop(0, 'rgba(120,70,200,0.35)'); nb.addColorStop(1, 'rgba(120,70,200,0)'); c.fillStyle = nb; c.fillRect(0, 160, 360, 280); c.restore();
    // the parabola, scaled around its vertex so its crossings (if any) are on screen
    const h = -Q.b / (2 * Q.a), k = Q.c - Q.b * Q.b / (4 * Q.a), AY = Q.D > 0 ? 448 : Q.D === 0 ? 500 : 538, sy = Q.D === 0 ? 10 : Math.min(14, 96 / Math.abs(k));
    const px = x => 180 + (x - h) * 26, f = x => Q.a * x * x + Q.b * x + Q.c, on = S.litAt != null ? M.clamp((t - S.litAt) / 0.3, 0, 1) : 0;
    c.save(); c.strokeStyle = 'rgba(220,210,255,0.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(14, AY); c.lineTo(346, AY); c.stroke();
    c.beginPath(); c.rect(0, 404, 360, 150); c.clip();
    c.strokeStyle = `rgba(150,220,255,${0.3 + 0.65 * on})`; c.lineWidth = 2.5 + on; c.shadowColor = '#7ad0ff'; c.shadowBlur = 4 + on * 12; if (!on) c.setLineDash([5, 6]);
    c.beginPath(); for (let x = h - 7; x <= h + 7; x += 0.05) { const y = AY - f(x) * sy; x > h - 7 ? c.lineTo(px(x), y) : c.moveTo(px(x), y); } c.stroke(); c.restore();
    if (on) { const roots = Q.D > 0 ? [h - Math.sqrt(Q.D) / (2 * Q.a), h + Math.sqrt(Q.D) / (2 * Q.a)] : Q.D === 0 ? [h] : [];
      for (const r of roots) { const x = px(r), p = 1 + 0.2 * Math.sin(t * 7); c.save(); c.globalAlpha = on; const gr = c.createRadialGradient(x, AY, 0, x, AY, 22 * p); gr.addColorStop(0, 'rgba(255,240,170,0.95)'); gr.addColorStop(1, 'rgba(255,240,170,0)');
        c.fillStyle = gr; c.beginPath(); c.arc(x, AY, 22 * p, 0, 7); c.fill(); c.fillStyle = '#fffbe0'; c.beginPath(); c.arc(x, AY, 5, 0, 7); c.fill(); c.restore(); } }
    for (const id of ['prob', 'key', 'dx', ...CL.flatMap(q => [q[0], 'l' + q[0]])]) M.drawEx(g, c, id);
    SCN.host(g, c, 'bird', 314, 612, 1.0);
    M.drawUI(g, c);
  },
});
