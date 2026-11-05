// logic_demorgan.js — DE MORGAN! Push a "not" into a bracket: ¬(P ∧ Q) = ¬P ∨ ¬Q and ¬(P ∨ Q) = ¬P ∧ ¬Q.
// The player drags the ¬ in front of the bracket onto the bracket (or anything inside it). The working then plays by
// itself: the ¬ swells and the bracket is circled, the ¬ splits in two and each half flies onto a letter while the
// brackets fade and the letters slide together, then ∧ turns over into ∨ (or ∨ into ∧). Every problem has a ¬
// already inside the bracket, so a double ¬¬ appears and glows; tapping ¬¬Q crosses both ¬ out, they float away and
// the Q slides back into place. The ¬¬ taps can come in either order. The symbols are the same node objects all the
// way through, so they glide instead of popping.
// Level 0: ¬(P ∧ ¬Q) or ¬(¬P ∧ Q). Level 1: ∧ or ∨, one inner ¬. Level 2: ∧ or ∨, sometimes both letters negated.
// ∧ and ∨ are drawn as strokes over invisible placeholder tokens (the fonts lack them); ¬ is in the font.
// Medium mode: tapping ¬¬Q crosses the pair out, then a tray asks what is left (Q, ¬Q, or the other letter).
const M = MK, INK = SCN.ink('glass'), NEG = '#c8327a', EY = 316, HX = 78, HY = 590;
function glyph(c, kind, x, y, s, col) {
  const a = s * 0.22; c.save(); c.strokeStyle = col; c.lineWidth = s * 0.085; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
  if (kind === 'and') { c.moveTo(x - a, y + a); c.lineTo(x, y - a); c.lineTo(x + a, y + a); }
  else { c.moveTo(x - a, y - a); c.lineTo(x, y + a); c.lineTo(x + a, y - a); }
  c.stroke(); c.restore();
}
function gen(g) {
  const L = g.level, op = L === 0 || g.rand() < 0.5 ? 'and' : 'or';
  const one = g.rand() < 0.5 ? [1, 0] : [0, 1], neg = L === 2 && g.rand() < 0.5 ? [1, 1] : one;
  return { op, lits: ['P', 'Q'].map((name, i) => ({ name, negs: [...Array(neg[i])].map(() => M.txt('¬')), v: M.vr(name) })) };
}
// the expression, rebuilt from the same symbol nodes every time (fresh rows around them), so symbols glide
function build(g) {
  const S = g.s, lit = (l, i) => { const r = M.row(...l.negs, l.v); r.id = 'L' + i; return r; };
  const inner = M.row(lit(S.lits[0], 0), S.o, lit(S.lits[1], 1));
  S.ex = S.dist ? inner : M.row(S.N, M.paren(inner, 'br'));
  M.place(g, 'ex', S.ex, 180, EY, S.size, { col: INK });
}
// a bracket that has just been removed fades and drifts outward
function ghostParen(c, b, k, col) {
  const s = b.h / 1.2, top = b.y - b.h / 2, bot = b.y + b.h / 2, w = s * 0.12; c.save(); c.globalAlpha = 1 - k; c.strokeStyle = col; c.lineWidth = s * 0.075; c.lineCap = 'round';
  for (const [x, d] of [[b.x - b.w / 2 + s * 0.18 - k * 14, -1], [b.x + b.w / 2 - s * 0.18 + k * 14, 1]]) { c.beginPath(); c.moveTo(x - d * w, top); c.quadraticCurveTo(x + d * w * 0.9, (top + bot) / 2, x - d * w, bot); c.stroke(); }
  c.restore();
}

MG.add({
  id: 'logic_demorgan', stage: 'logic', cmd: 'DE MORGAN!', hint: 'drag', time: 8, mood: 'night', winText: 'Negated!', hold: 1.4,
  card: {
    title: 'De Morgan’s laws', ref: 'Discrete math', kind: 'Logic',
    text: '¬ means "not". It turns a true statement into a false one, and a false one into a true one. ∧ means "and", and ∨ means "or".\n\nDe Morgan’s laws say what happens when "not" stands in front of a bracket. The ¬ goes onto each part, and ∧ and ∨ swap: ¬(P ∧ Q) = ¬P ∨ ¬Q, and ¬(P ∨ Q) = ¬P ∧ ¬Q.\n\nFor example, "not (tall and fast)" means "not tall, or not fast": missing just one of the two is enough.\n\nTwo nots cancel out, so ¬¬Q = Q. That gives ¬(P ∧ ¬Q) = ¬P ∨ ¬¬Q = ¬P ∨ Q.',
    note: 'Put the ¬ on each part and swap ∧ with ∨. Two ¬ in a row cancel: ¬¬P = P.',
    ask: 'What is ¬(P ∨ Q)? What is ¬(¬P ∧ Q)?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.dist = false; const T = S.T = M.pace(g);
    S.N = M.txt('¬', 'N', { col: NEG }); S.o = M.op('+', 'o', { alpha: 0 });
    // one size for the whole game, wide enough for the longest form (¬¬P ∨ ¬¬Q), so nothing jumps in size
    const lw = (k, name) => M.row(...[...Array(k)].map(() => M.txt('¬')), M.vr(name)), [k0, k1] = S.lits.map(l => l.negs.length);
    const forms = [M.row(M.txt('¬'), M.paren(M.row(lw(k0, 'P'), M.op('+'), lw(k1, 'Q')))), M.row(lw(k0 + 1, 'P'), M.op('+'), lw(k1 + 1, 'Q'))];
    S.size = 64; while (forms.some(f => M.lay(f, S.size).w > 300) && S.size > 30) S.size -= 2;
    build(g); M.inert(g, ['br']);
    g.dur *= (2.6 + 1.05 * (1 + S.lits.filter(l => l.negs.length).length)) / 8;
    const hop = e => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    M.play(g, {
      moves(g) {
        if (!S.pushed) {
          const b = M.box(g, 'br'), area = b ? [b.x - b.w / 2 - 12, b.y - b.h / 2 - 40, b.x + b.w / 2 + 12, b.y + b.h / 2 + 40] : null;
          return [{ drag: 'N', to: ['L0', 'o', 'L1'], area, busy: 0.1, then(g) {
            S.pushed = true; S.point = true; hop('think'); M.show(g, 1.35 * T); g.sfx('swoosh');
            M.indicate(g, S.N, { col: NEG, sc: 1.35, dur: 0.35 * T }); M.circle(g, 'br', { col: NEG, dur: 0.45 * T });
            M.at(g, [
              // the ¬ splits in two and each half flies onto a letter; the brackets fade and the letters close up
              [0.3 * T, g => { const nb = { ...M.box(g, 'N') }, bb = { ...M.box(g, 'br') }; S.N.alpha = 0;
                const fresh = S.lits.map((l, i) => { const n = M.txt('¬', 'n' + i, { col: NEG, alpha: 0, _born: -1 }); l.negs.unshift(n); return n; });
                S.dist = true; build(g); M.inert(g, ['n0', 'n1']); g.sfx('whoosh');
                M.anim(g, { dur: 0.35 * T, draw(c, g, k) { ghostParen(c, bb, M.ease(k), INK); } });
                fresh.forEach((n, i) => M.fly(g, { node: M.txt('¬', null, { col: NEG }), from: [nb.x, nb.y], to: 'n' + i, dur: 0.42 * T, arc: i ? -70 : -40, s0: nb.s, s1: S.size,
                  then(g) { n.alpha = 1; n.pop = g.t; M.sparkle(g, 'L' + i, { n: 7, cols: [NEG, '#fff', '#ffd970'] }); g.sfx('pop', { p: 1 + i * 0.15 }); hop(); } }));
              }],
              // ∧ turns over into ∨ (or ∨ into ∧)
              [0.85 * T, g => { S.oldOp = S.op; S.op = S.op === 'and' ? 'or' : 'and'; S.flipAt = g.t; S.flipDur = 0.32 * T; M.circle(g, 'o', { col: NEG, dur: 0.4 * T, pad: 4 }); g.sfx('sweep'); hop(); }],
              // any ¬¬ now glows, ready to be cancelled
              [1.25 * T, g => { S.point = false; S.lits.forEach(l => { if (l.negs.length === 2) for (const n of l.negs) M.light(g, n, { col: '#ffb21f' }); }); }],
            ]); } }];
        }
        return S.lits.flatMap((l, i) => l.negs.length !== 2 || l.gone ? [] : [{
          tap: 'L' + i, busy: 0.1, askAt: 0.6 * T, after: 0.6 * T,
          ask: { v: M.vr(l.name), wrong: [M.row(M.txt('¬'), M.vr(l.name)), M.vr(S.lits[1 - i].name)] },
          // both ¬ are crossed out ("not not" cancels) ...
          then(g) { l.gone = true; S.point = true; hop('think'); M.show(g, 0.6 * T); g.sfx('tap');
            M.circle(g, 'L' + i, { col: NEG, dur: 0.45 * T }); l.negs.forEach((n, k) => { M.unlight(g, n); M.strike(g, n, { delay: (0.12 + k * 0.14) * T, dur: 0.18 * T, col: '#ff5a6a' }); }); },
          // ... float away, and the letter slides back into place
          resolve(g) { M.show(g, 0.6 * T); for (const n of l.negs) M.tween(g, n, { alpha: 0, dy: -26, sc: 0.6 }, 0.28 * T);
            M.at(g, [[0.3 * T, g => { l.negs = []; build(g); l.v.pop = g.t; M.sparkle(g, 'L' + i, { n: 10, cols: ['#ff8ac0', '#fff', '#ffd970'] }); g.sfx('coin'); hop('laugh'); }],
              [0.6 * T, g => { S.point = false; }]]); },
        }]);
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.std(g, c, { scene: 'night', panel: 'glass', panelY: 318, panelH: 190 });
    // the fox points at the glass while the work is shown, and hops when a piece lands
    { const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
      const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
      if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', HX, HY - hopK * 24, 1.35, { t, pose, expr }); else SCN.host(g, c, 'fox', HX, HY, 1.35); }
    M.drawEx(g, c, 'ex');
    // ∧ / ∨ over its placeholder: it turns over when the ¬ comes in
    const b = M.box(g, 'o'), n = S.o;
    if (b && n) {
      const k = S.flipAt != null ? M.clamp((t - S.flipAt) / S.flipDur, 0, 1) : 1, kind = k < 0.5 ? S.oldOp : S.op, sy = Math.max(0.06, Math.abs(Math.cos(k * Math.PI)));
      const col = n.mark === 'bad' ? M.BAD : k < 1 ? NEG : INK, sh = n.mark === 'bad' ? Math.sin(t * 50) * 4 : 0, sc = 1 + Math.sin(k * Math.PI) * 0.3;
      c.save(); c.translate(b.x + sh + (n._ax || 0), b.y + (n._ay || 0)); c.scale(sc, sy * sc); glyph(c, kind, 0, 0, b.s, col); c.restore();
    }
    // a small key naming the symbols in words
    c.save(); c.font = M.NUMF(17, 500); c.fillStyle = 'rgba(42,24,64,0.75)'; c.textBaseline = 'middle'; c.textAlign = 'left';
    const parts = [['¬', '= not'], ['and', '= and'], ['or', '= or']]; let x = 62;
    for (const [sym, w] of parts) { if (sym === '¬') c.fillText('¬', x - 5, 392); else glyph(c, sym, x, 392, 18, 'rgba(42,24,64,0.8)'); c.fillText(w, x + 10, 393); x += 88; }
    c.restore();
    M.drawUI(g, c);
  },
});
