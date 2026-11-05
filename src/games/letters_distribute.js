// letters_distribute.js — DISTRIBUTE! Expand a(bx + c) with the distributive property.
// 3(x + 4): the player drags the 3 onto each term inside the brackets (either order); the first drag draws a rainbow arrow
// from the 3 to that term, the way it is done by hand, and the second drag rewrites the expression at once as
// 3 · x + 3 · 4. Then the player taps each product (either order): 3x + 12.
// Level 0: a(x + c). Level 1: a(bx + c). Level 2: a negative factor and a minus inside, −2(x − 5) → −2x + 10.
// Medium mode: each product is picked from the tray.
const M = MK, PANEL = 'glass', INK = SCN.ink(PANEL), ARC = ['#e8603a', '#3a8ad0'], Y_EX = 300;
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  if (L === 0) return { a: 2 + r(4), b: 1, c: 1 + r(6) };
  if (L === 1) return { a: 2 + r(4), b: 2 + r(3), c: 1 + r(7) };
  return { a: -(2 + r(4)), b: 1, c: -(1 + r(7)) };
}
const neg = v => v < 0;
// a coefficient times x: "x", "3x", "−2x"
const cx = (k, id, o) => { const r = M.row(k === 1 ? null : k === -1 ? M.op('-') : M.num(k), M.vr('x')); r.id = id; Object.assign(r, o || {}); return r; };
// the number written in brackets when it is negative: (−5)
const sgn = (v, o) => neg(v) ? M.paren(M.num(v, null, o)) : M.num(v, null, o);

MG.add({
  id: 'distribute', stage: 'letters', cmd: 'DISTRIBUTE!', hint: 'drag', time: 9, mood: 'bright', winText: 'Expanded!', hold: 1.4,
  card: {
    title: 'The distributive property', ref: 'Grade 6', kind: 'Expressions',
    text: 'A number written right in front of brackets multiplies everything inside them. So 3(x + 4) means 3 times the whole sum x + 4. Each part of the sum, such as x or 4, is called a term.\n\nThe distributive property says you can multiply each term by the number in front and then add the products: 3(x + 4) = 3 · x + 3 · 4 = 3x + 12. (3x is short for 3 · x.) With a negative number in front, keep track of the signs: −2(x − 5) = −2 · x + (−2) · (−5) = −2x + 10, because a negative times a negative is positive.\n\nWhy it works: 3(x + 4) is three groups of x + 4. Three groups of x and three groups of 4 make 3x + 12.',
    note: 'Multiply the number in front by every term inside the brackets, keeping each term\'s sign. Then add the products.',
    ask: 'Expand 5(x + 2). Expand −3(x − 4).',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a, b, c } = S;
    S.arc = {}; S.split = false; S.pu = null; S.pk = null;
    const fit = (node) => { let s = 58; for (;;) { const m = M.lay(node, s); if (m.w <= 300 || s <= 34) break; s -= 2; } M.place(g, 'ex', node, 180, Y_EX, s, { col: INK }); };
    const build = () => {
      if (!S.split) {
        const inner = M.row(cx(b, 'u'), M.op(neg(c) ? '-' : '+', 'm'), M.num(Math.abs(c), 'k'));
        fit(M.row(M.num(a, 'a'), M.gap(4), M.paren(inner, 'br'))); M.inert(g, ['br']); return;
      }
      const left = S.pu != null ? cx(a * b, 'ru', { pop: S.pu }) : (() => { const r = M.row(M.num(a, null, { col: ARC[0] }), M.op('·'), b === 1 ? M.vr('x') : cx(b)); r.id = 'pu'; return r; })();
      let right;
      if (S.pk != null) { const v = a * c; right = M.row(M.op(neg(v) ? '-' : '+'), M.num(Math.abs(v), 'rk', { pop: S.pk })); }
      else { right = M.row(M.op('+'), M.row(sgn(a, { col: ARC[1] }), M.op('·'), sgn(c))); right.items[1].id = 'pk'; }
      fit(M.row(left, right)); M.inert(g, ['ru', 'rk']);
    };
    S.build = build; build();
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const tile = (k) => cx(k), cst = v => M.num(v);
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.split) {
          for (const [i, to] of [[0, ['u']], [1, ['k', 'm']]]) if (S.arc[i] == null) out.push({ drag: 'a', to, busy: 0.1, then(g) {
            S.arc[i] = g.t; g.sfx('swoosh'); const nd = M.node(g, to[0]); if (nd) { (function tint(q) { if (!q) return; q.col = ARC[i]; (q.items || []).forEach(tint); })(nd); nd.pop = g.t; }
            if (S.arc[0] != null && S.arc[1] != null) { S.split = true; S.splitAt = g.t; build(); }
          } });
          return out;
        }
        if (S.pu == null) out.push({ tap: 'pu', busy: 0.1, ...(b === 1 ? {} : { askAt: 0, after: 0.1, ask: { v: tile(a * b), wrong: [tile(a + b), tile(Number(String(a) + String(b))), M.sup(M.vr('x'), M.num(a * b))] } }),
          then(g) { if (b === 1) { S.pu = g.t; build(); g.sfx('coin'); } }, resolve(g) { S.pu = g.t; build(); g.sfx('coin'); } });
        if (S.pk == null) out.push({ tap: 'pk', busy: 0.1, askAt: 0, after: 0.1, ask: { v: cst(a * c), wrong: [cst(-a * c), cst(a + c), cst(a * c + (neg(a) ? -1 : 1))] },
          then(g) { }, resolve(g) { S.pk = g.t; build(); g.sfx('coin'); const bx = M.box(g, 'rk'); if (bx) g.burst(bx.x, bx.y, ['#ffd27a', '#9ad0ff', '#fff'], 10, 120); } });
        return out;
      },
      area(g) { return !S.split ? ['a'] : [S.pu == null ? 'pu' : 'pk']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'dusk', panel: PANEL, panelY: 292, panelH: 210, host: 'fox', hostX: 286, hostY: 594, hostS: 1.35 });
    // the hand-drawn rainbow arrows from the factor in front to each term inside the brackets
    if (!S.split) {
      const A = M.box(g, 'a');
      for (const [i, id] of [[0, 'u'], [1, 'k']]) { const t0 = S.arc[i]; if (t0 == null || !A) continue; const B = M.box(g, id); if (!B) continue;
        const e = M.ease((t - t0) / 0.2), y0 = Math.min(A.y - A.h / 2, B.y - B.h / 2) - 6, x0 = A.x + 4, x1 = B.x, h = 26 + i * 18;
        c.save(); c.strokeStyle = ARC[i]; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath();
        let px = x0, py = y0; for (let u = 0; u <= e + 1e-6; u += 0.05) { px = M.lerp(x0, x1, u); py = y0 - Math.sin(u * Math.PI) * h; u ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke();
        if (e >= 1) { c.fillStyle = ARC[i]; c.beginPath(); c.moveTo(x1, y0 + 2); c.lineTo(x1 - 7, y0 - 9); c.lineTo(x1 + 6, y0 - 8); c.closePath(); c.fill(); }
        c.restore(); }
    }
    M.drawEx(g, c, 'ex');
    M.drawUI(g, c);
  },
});
