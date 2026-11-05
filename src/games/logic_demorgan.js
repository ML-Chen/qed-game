// logic_demorgan.js — DE MORGAN! Push a "not" into a bracket: ¬(P ∧ Q) = ¬P ∨ ¬Q and ¬(P ∨ Q) = ¬P ∧ ¬Q.
// The player drags the ¬ in front of the bracket onto the bracket (or anything inside it): at once a ¬ lands on each
// letter, the bracket goes away and ∧ flips to ∨ (or ∨ to ∧). Every problem has a ¬ already inside the bracket, so a
// double ¬¬ appears; tapping ¬¬Q cancels it to Q. The ¬¬ taps can come in either order.
// Level 0: ¬(P ∧ ¬Q) or ¬(¬P ∧ Q). Level 1: ∧ or ∨, one inner ¬. Level 2: ∧ or ∨, sometimes both letters negated.
// ∧ and ∨ are drawn as strokes over invisible placeholder tokens (the fonts lack them); ¬ is in the font.
// Medium mode: tapping ¬¬Q opens a tray (Q, ¬Q, or the other letter).
const M = MK, INK = SCN.ink('glass'), NEG = '#c8327a';
function glyph(c, kind, x, y, s, col) {
  const a = s * 0.22; c.save(); c.strokeStyle = col; c.lineWidth = s * 0.085; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
  if (kind === 'and') { c.moveTo(x - a, y + a); c.lineTo(x, y - a); c.lineTo(x + a, y + a); }
  else { c.moveTo(x - a, y - a); c.lineTo(x, y + a); c.lineTo(x + a, y - a); }
  c.stroke(); c.restore();
}
function gen(g) {
  const L = g.level, op = L === 0 || g.rand() < 0.5 ? 'and' : 'or';
  const one = g.rand() < 0.5 ? [1, 0] : [0, 1], neg = L === 2 && g.rand() < 0.5 ? [1, 1] : one;
  return { op, lits: ['P', 'Q'].map((name, i) => ({ name, neg: neg[i], pop: null })) };
}
function build(g) {
  const S = g.s;
  const lit = (l, i) => { const items = []; for (let k = 0; k < l.neg; k++) items.push(M.op('¬', null, { col: S.dist && k === l.neg - 1 ? NEG : undefined }));
    items.push(M.vr(l.name)); const r = M.row(...items); r.id = 'L' + i; r.pop = l.pop; return r; };
  const inner = M.row(lit(S.lits[0], 0), M.op('+', 'o', { alpha: 0, pop: S.flipAt }), lit(S.lits[1], 1));
  const ex = S.dist ? inner : M.row(M.op('¬', 'N', { col: NEG }), M.paren(inner, 'br'));
  let s = 64; do { M.place(g, 'ex', ex, 180, 316, s, { col: INK }); s -= 4; } while (ex._m.w > 312 && s > 30);
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
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.dist = false; build(g);
    M.inert(g, ['br']);
    g.dur *= (2.6 + 1.05 * (1 + S.lits.filter(l => l.neg).length)) / 8;
    const burst = id => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, ['#ff8ac0', '#fff', '#ffd970'], 10, 120); };
    M.play(g, {
      moves(g) {
        if (!S.dist) {
          const b = M.box(g, 'br'), area = b ? [b.x - b.w / 2 - 12, b.y - b.h / 2 - 40, b.x + b.w / 2 + 12, b.y + b.h / 2 + 40] : null;
          return [{ drag: 'N', to: ['L0', 'o', 'L1'], area, busy: 0.1, then(g) {
            const nb = M.box(g, 'N');
            S.dist = true; S.lits.forEach(l => { l.neg++; l.pop = g.t; }); S.oldOp = S.op; S.op = S.op === 'and' ? 'or' : 'and'; S.flipAt = g.t;
            g.sfx('swoosh'); build(g); burst('L0'); burst('L1');
            // the ¬ splits in two and each half lands on a letter
            if (nb) for (const id of ['L0', 'L1']) M.fly(g, { node: M.op('¬', null, { col: NEG }), from: [nb.x, nb.y], to: id, dur: 0.2, arc: -40, s0: nb.s, s1: nb.s });
          } }];
        }
        return S.lits.flatMap((l, i) => l.neg !== 2 ? [] : [{
          tap: 'L' + i, busy: 0.1, askAt: 0, after: 0.1,
          ask: { v: M.vr(l.name), wrong: [M.row(M.op('¬'), M.vr(l.name)), M.vr(S.lits[1 - i].name)] },
          then() {}, resolve(g) { l.neg = 0; l.pop = g.t; g.sfx('coin'); build(g); burst('L' + i); },
        }]);
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'night', panel: 'glass', panelY: 318, panelH: 190, host: 'fox', hostX: 78, hostY: 590, hostS: 1.35 });
    M.drawEx(g, c, 'ex');
    // ∧ / ∨ over its placeholder: it flips upside down when the ¬ comes in
    const b = M.box(g, 'o'), n = M.node(g, 'o');
    if (b && n) {
      const k = S.flipAt != null ? M.clamp((t - S.flipAt) / 0.26, 0, 1) : 1, kind = k < 0.5 ? S.oldOp : S.op, sy = Math.max(0.06, Math.abs(Math.cos(k * Math.PI)));
      const col = n.mark === 'bad' ? M.BAD : k < 1 ? NEG : INK, sh = n.mark === 'bad' ? Math.sin(t * 50) * 4 : 0;
      c.save(); c.translate(b.x + sh, b.y); c.scale(1, sy); glyph(c, kind, 0, 0, b.s, col); c.restore();
    }
    // a small key naming the symbols in words
    c.save(); c.font = M.NUMF(17, 500); c.fillStyle = 'rgba(42,24,64,0.75)'; c.textBaseline = 'middle'; c.textAlign = 'left';
    const parts = [['¬', '= not'], ['and', '= and'], ['or', '= or']]; let x = 62;
    for (const [sym, w] of parts) { if (sym === '¬') c.fillText('¬', x - 5, 392); else glyph(c, sym, x, 392, 18, 'rgba(42,24,64,0.8)'); c.fillText(w, x + 10, 393); x += 88; }
    c.restore();
    M.drawUI(g, c);
  },
});
