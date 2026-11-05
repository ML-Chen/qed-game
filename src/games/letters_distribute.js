// letters_distribute.js — DISTRIBUTE! Expand a(bx + c) with the distributive property.
// 3(x + 4), and every step is acted out (show your work):
//   1. Drag the 3 onto a term inside the brackets (either one first): a coloured arrow draws itself from the 3 over to
//      that term and the term lights up in the arrow's colour. When both terms have their arrow, the 3 splits in two and
//      the copies glide in front of each term while the brackets melt away: 3 · x + 3 · 4.
//   2. Tap each product (either order): it is circled, "3 × 4 = 12" writes itself just above it, then the note drops
//      into place and the product collapses into its value: 3x + 12.
// The fox points while the work is shown and hops on each landing.
// Level 0: a(x + c). Level 1: a(bx + c). Level 2: a negative factor and a minus inside, −2(x − 5) → −2x + 10.
// Medium mode: each product is picked from the tray, which opens once its note is written.
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
    const S = g.s, MKs = M.setup(g), T = M.pace(g); Object.assign(S, pick(g)); const { a, b, c } = S;
    S.arc = {}; S.split = false; S.pu = null; S.pk = null; S.busy = {};
    const fit = (node) => { let s = 58; for (;;) { const m = M.lay(node, s); if (m.w <= 300 || s <= 34) break; s -= 2; } M.place(g, 'ex', node, 180, Y_EX, s, { col: INK }); };
    // the same nodes are kept between rewrites, so they glide into their new places
    S.nA = M.num(a, 'a'); S.nU = cx(b, 'u'); S.nM = M.op(neg(c) ? '-' : '+', 'm'); S.nK = M.num(Math.abs(c), 'k');
    S.a0 = M.num(a, 'a0', { col: ARC[0] }); S.a1 = sgn(a, { col: ARC[1] }); S.a1.id = 'a1'; S.cK = neg(c) ? sgn(c) : S.nK; S.xU = S.nU.items[S.nU.items.length - 1];
    const build = () => {
      if (!S.split) { fit(M.row(S.nA, M.gap(4), M.paren(M.row(S.nU, S.nM, S.nK), 'br'))); M.inert(g, ['br']); return; }
      let left; if (S.pu != null) left = S.ru; else { left = M.row(S.a0, M.op('·'), b === 1 ? S.xU : S.nU); left.id = 'pu'; }
      let right; if (S.pk != null) right = M.row(S.rop, S.rk);
      else { right = M.row(S.nM, M.row(S.a1, M.op('·'), S.cK)); right.items[1].id = 'pk'; S.nM.v = '+'; }
      fit(M.row(left, right)); M.inert(g, ['ru', 'rk', 'm', 'a0', 'a1', 'u', 'k']);
    };
    S.build = build; MKs.relay = build; build();
    const hop = (g, e) => { MKs.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const tile = (k) => cx(k), cst = v => M.num(v);
    const tint = (q, col) => { if (!q) return; q.col = col; (q.items || []).forEach(z => tint(z, col)); if (q.inner) tint(q.inner, col); };
    // a product's working note: "3 × 4 = 12" written just above the product
    const prodNote = (g, key, id, lhs, val) => { const bp = M.box(g, id), nd = M.row(...lhs, M.op('='), val); M.place(g, key, nd, bp.x, bp.y - bp.h / 2 - 16, 26, { col: '#c8402a' }); M.writeIn(g, nd, { dur: 0.35 * T, delay: 0.12 * T }); return nd; };
    const land = (g, key, id, then) => { const nd = g.s.mk.ex[key] && g.s.mk.ex[key].node, bp = M.box(g, id), bn = M.box(g, nd); if (nd && bp && bn) M.tween(g, nd, { dy: bp.y - bn.y, alpha: 0, sc: 1.4 }, 0.3 * T);
      M.at(g, [[0.25 * T, g => { delete g.s.mk.ex[key]; then(g); }]]); };
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.split) {
          if (M.showing(g)) return out;
          for (const [i, to] of [[0, ['u']], [1, ['k', 'm']]]) if (S.arc[i] == null) out.push({ drag: 'a', to, busy: 0.1, then(g) {
            S.arc[i] = g.t; S.arcDur = 0.4 * T; M.show(g, 0.55 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh');
            M.indicate(g, 'a', { dur: 0.35 * T, col: ARC[i], sc: 1.2 });
            M.at(g, [[0.38 * T, g => { const nd = M.node(g, to[0]); tint(nd, ARC[i]); if (i === 1) tint(S.nM, ARC[i]); M.indicate(g, nd, { dur: 0.35 * T, col: ARC[i], sc: 1.3 }); M.sparkle(g, to[0], { n: 6 }); g.sfx('tap'); hop(g); }]]);
            if (S.arc[0] != null && S.arc[1] != null) { M.show(g, 1.0 * T);
              // both terms reached: the 3 splits in two, the copies glide in front of each term, the brackets melt away
              M.at(g, [[0.6 * T, g => { S.aFrom = { ...M.box(g, 'a') }; S.split = true; S.splitAt = g.t; S.nA.alpha = 0; tint(S.nU, INK); tint(S.nK, INK); tint(S.nM, INK); build(); g.sfx('whoosh'); hop(g, 'laugh');
                const from = S.aFrom; for (const [q, col, id] of [[S.a0, ARC[0], 'a0'], [S.a1, ARC[1], 'a1']]) { q.alpha = 0; M.fly(g, { node: M.num(a, null, { col }), from: [from.x, from.y], to: id, dur: 0.35 * T, arc: -30, s0: from.s, then() { q.alpha = 1; q.pop = g.t; } }); } }]]); }
          } });
          return out;
        }
        if (M.showing(g)) return out;
        if (S.pu == null && !S.busy.u) out.push({ tap: 'pu', busy: 0.1, askAt: 0.5 * T, after: 0.6 * T, ...(b === 1 ? {} : { ask: { v: tile(a * b), wrong: [tile(a + b), tile(Number(String(a) + String(b))), M.sup(M.vr('x'), M.num(a * b))] } }),
          then(g) { S.busy.u = true; M.show(g, 0.5 * T); S.point = true; hop(g, 'think'); M.circle(g, 'pu', { dur: 0.45 * T, col: ARC[0] });
            prodNote(g, 'nu', 'pu', b === 1 ? [M.num(a), M.op('×'), M.vr('x')] : [M.num(a), M.op('×'), M.num(b), M.vr('x')], cx(a * b));
            if (b === 1) M.at(g, [[0.5 * T, g => this.resolve(g)]]); }, // no tray question for a · x: the working just goes on
          resolve(g) { M.show(g, 0.6 * T); land(g, 'nu', 'pu', g => { S.ru = cx(a * b, 'ru', { pop: g.t }); S.pu = g.t; build(); g.sfx('coin'); hop(g); M.sparkle(g, 'ru', { n: 8 }); }); } });
        if (S.pk == null && !S.busy.k) out.push({ tap: 'pk', busy: 0.1, askAt: 0.5 * T, after: 0.6 * T, ask: { v: cst(a * c), wrong: [cst(-a * c), cst(a + c), cst(a * c + (neg(a) ? -1 : 1))] },
          then(g) { S.busy.k = true; M.show(g, 0.5 * T); S.point = true; hop(g, 'think'); M.circle(g, 'pk', { dur: 0.45 * T, col: ARC[1] });
            prodNote(g, 'nk', 'pk', [sgn(a), M.op('×'), sgn(c)], M.num(a * c)); },
          resolve(g) { M.show(g, 0.6 * T); land(g, 'nk', 'pk', g => { const v = a * c; S.rop = M.op(neg(v) ? '-' : '+'); S.rk = M.num(Math.abs(v), 'rk', { pop: g.t }); S.pk = g.t; build(); g.sfx('coin'); hop(g, S.pu != null ? 'laugh' : 'wow');
            const bx = M.box(g, 'rk'); if (bx) g.burst(bx.x, bx.y, ['#ffd27a', '#9ad0ff', '#fff'], 10, 120); }); } });
        return out;
      },
      area(g) { return !S.split ? ['a'] : [S.pu == null ? 'pu' : 'pk']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, mk = S.mk;
    SCN.std(g, c, { scene: 'dusk', panel: PANEL, panelY: 292, panelH: 210 });
    const hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', 286, 594 - hopK * 24, 1.35, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'fox', 286, 594, 1.35);
    // the hand-drawn arrows from the factor in front to each term inside the brackets; they fade as the 3 splits
    const fade = S.splitAt != null ? 1 - M.clamp((t - S.splitAt) / 0.25, 0, 1) : 1;
    const A = S.aBox = (!S.split && M.box(g, 'a')) || S.aBox;
    if (fade > 0 && A) for (const [i, id] of [[0, 'u'], [1, 'k']]) { const t0 = S.arc[i]; if (t0 == null) continue; const B = (!S.split && M.box(g, id)) || (S.bBox = S.bBox || {})[id]; if (!B) continue; if (!S.split) S.bBox = { ...(S.bBox || {}), [id]: B };
      const e = M.easeIO((t - t0) / (S.arcDur || 0.2)), y0 = Math.min(A.y - A.h / 2, B.y - B.h / 2) - 6, x0 = A.x + 4, x1 = B.x, h = 26 + i * 18;
      c.save(); c.globalAlpha = fade; c.strokeStyle = ARC[i]; c.lineWidth = 4; c.lineCap = 'round'; c.shadowColor = ARC[i]; c.shadowBlur = 6; c.beginPath();
      let px = x0, py = y0; for (let u = 0; u <= e + 1e-6; u += 0.04) { px = M.lerp(x0, x1, u); py = y0 - Math.sin(u * Math.PI) * h; u ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke();
      if (e > 0.05 && e < 1) { c.fillStyle = '#fffbe0'; c.beginPath(); c.arc(px, py, 3.5, 0, 7); c.fill(); }
      if (e >= 1) { c.fillStyle = ARC[i]; c.beginPath(); c.moveTo(x1, y0 + 2); c.lineTo(x1 - 7, y0 - 9); c.lineTo(x1 + 6, y0 - 8); c.closePath(); c.fill(); }
      c.restore(); }
    M.drawEx(g, c, 'ex'); M.drawEx(g, c, 'nu'); M.drawEx(g, c, 'nk');
    M.drawUI(g, c);
  },
});
