// linalg_inverse.js — INVERSE MATRIX! The inverse of [a b; c d] is 1/(ad − bc) · [d −b; −c a], on a recipe page in a kitchen.
// The page shows A = [a b; c d], and under it the working line A⁻¹ = [slot] [a b; c d], a copy of A that the player
// rewrites in place. Beneath sit the "ingredients": two minus signs and the fraction 1/det A.
// Moves (any order): drag a onto d (or d onto a) to swap them; drag a minus sign onto b and onto c (each changes sign);
// drag 1/det A into the slot in front of the matrix; once it is there, tap det A to compute it (ad − bc).
// When det A = 1 the fraction disappears and the matrix alone is the inverse.
// Wrong moves (they only wobble): swapping a with b or c, a minus sign dropped on a or d, tapping the entries of A.
// Level 0: det A = 1. Level 1: det A from 2 to 5. Level 2: negative entries, and det A may be negative.
// Medium mode: tapping det A opens a tray (wrong tiles: ad + bc, bc − ad, ab − cd).
const M = MK, INK = SCN.ink('paper'), C1 = '#c8402a', C2 = '#2a7ab0';
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (let n = 0; n < 500; n++) {
    const a = r(L === 2 ? -4 : 1, 5), b = r(L === 2 ? -3 : 1, 4), c = r(L === 2 ? -3 : 1, 4), d = r(L === 2 ? -4 : 1, 5), det = a * d - b * c;
    if ([a, b, c, d].includes(0) || new Set([a, b, c, d]).size < 3) continue;
    if (L === 0 ? det === 1 : L === 1 ? det >= 2 && det <= 5 : det !== 0 && Math.abs(det) <= 6 && det !== 1 && [a, b, c, d].some(v => v < 0)) return { a, b, c, d, det };
  }
  return { a: 3, b: 1, c: 5, d: 2, det: 1 };
}
const fracOf = det => det === 1 ? null : det === -1 ? M.num(-1, 'k') : det < 0 ? M.row(M.op('-'), M.frac(M.num(1), M.num(-det))) : M.frac(M.num(1), M.num(det));

MG.add({
  id: 'linalg_inverse', stage: 'linalg', cmd: 'INVERSE MATRIX!', hint: 'drag', time: 8, mood: 'bright', winText: 'Inverted!', hold: 1.4,
  card: {
    title: 'The inverse of a 2 × 2 matrix', ref: 'College', kind: 'Linear algebra',
    text: 'The inverse of a matrix A is written A⁻¹. It undoes what A does: A⁻¹ times A is the identity matrix, which has 1s on the diagonal and 0s elsewhere.\n\nFor a 2 × 2 matrix with rows a b and c d, there is a recipe. Swap a and d. Put a minus sign in front of b and c. Then multiply by 1 over the determinant, det A = ad − bc.\n\nFor example, with rows 3 1 and 5 2, det A = 3 · 2 − 1 · 5 = 1. So A⁻¹ has rows 2 −1 and −5 3. Check the top left of A⁻¹A: 2 · 3 + (−1) · 5 = 1.\n\nThe recipe works because the swapped matrix times A gives det A times the identity, and dividing by det A leaves the identity. If det A = 0, there is no inverse.',
    note: 'For rows a b and c d: swap a and d, change the signs of b and c, and divide everything by ad − bc.',
    ask: 'What is the inverse of the matrix with rows 2 1 and 1 1? Why does the matrix with rows 2 4 and 1 2 have no inverse?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g);
    S.orig = M.row(M.vr('A', 'nA'), M.op('=', 'eq0'), M.mat([[M.num(p.a, 'oa'), M.num(p.b, 'ob')], [M.num(p.c, 'oc'), M.num(p.d, 'od')]], 'om'));
    S.cells = { a: M.num(p.a, 'wa'), b: M.num(p.b, 'wb'), c: M.num(p.c, 'wc'), d: M.num(p.d, 'wd') };
    S.slot = M.slot('front', { w: 34, col: C2 });
    S.work = M.row(M.sup(M.vr('A', 'nA2'), M.num(-1, 'inv1')), M.op('=', 'eq1'), S.slot, M.gap(4), M.mat([[S.cells.a, S.cells.b], [S.cells.c, S.cells.d]], 'wm'));
    S.ing = M.row(M.op('-', 'm1', { col: C1 }), M.gap(26), M.op('-', 'm2', { col: C1 }), M.gap(34), M.frac(M.num(1), M.row(M.txt('det', 'dt'), M.gap(5), M.vr('A')), 'inv', { col: C2 }));
    S.relay = () => { M.place(g, 'orig', S.orig, 180, 236, 26, { col: INK }); M.place(g, 'work', S.work, 180, 330, 38, { col: INK }); M.place(g, 'ing', S.ing, 180, 414, 30, { col: INK }); };
    S.relay(); M.inert(g, ['nA', 'eq0', 'om', 'nA2', 'inv1', 'eq1', 'wm', 'front']);
    g.dur *= (2.6 + 1.05 * 5) / 8;
    const neg = (k, src) => ({ drag: src, to: 'w' + k, busy: 0.1, then(g) { S['neg' + k] = 1; M.node(g, src).hide = true; const n = S.cells[k]; n.v = String(-p[k]).replace(/^-/, '−'); n.pop = g.t; n.col = C1; g.sfx('pop'); S.relay(); } });
    const swap = (from) => ({ drag: from, to: from === 'wa' ? 'wd' : 'wa', busy: 0.12, then(g) {
      S.swapped = 1; const A = S.cells.a, D = S.cells.d, ba = M.box(g, 'wa'), bd = M.box(g, 'wd');
      [A.v, D.v] = [D.v, A.v]; A.pop = D.pop = g.t; A.alpha = D.alpha = 0; g.sfx('whoosh');
      M.fly(g, { node: M.num(p.a, null, { col: INK }), from: [ba.x, ba.y], to: [bd.x, bd.y], dur: 0.22, arc: -50, then() { D.alpha = 1; } });
      M.fly(g, { node: M.num(p.d, null, { col: INK }), from: [bd.x, bd.y], to: [ba.x, ba.y], dur: 0.22, arc: 50, then() { A.alpha = 1; } });
    } });
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.swapped) out.push(swap('wa'), swap('wd'));
        const free = ['m1', 'm2'].filter(id => !M.node(g, id).hide);
        for (const k of ['b', 'c']) if (!S['neg' + k]) for (const id of free) out.push(neg(k, id));
        if (!S.placed) out.push({ drag: 'inv', to: 'front', reach: 90, busy: 0.1, then(g) {
          S.placed = 1; M.node(g, 'inv').hide = true; S.slot.fill = M.frac(M.num(1), M.row(M.txt('det', 'den'), M.gap(5), M.vr('A', 'denA')), 'invf', { col: C2, pop: g.t }); g.sfx('pop'); S.relay(); } });
        else if (!S.tapped) out.push({ tap: ['den', 'denA'], busy: 0.1, then() { S.tapped = 1; }, ask: { v: p.det, wrong: [p.a * p.d + p.b * p.c, p.b * p.c - p.a * p.d, p.a * p.b - p.c * p.d] },
          resolve(g) {
            S.detDone = g.t; const f = fracOf(p.det); g.sfx('coin');
            if (f) { S.slot.fill = f; f.col = C2; f.pop = g.t; } else { S.work.items.splice(2, 2); }
            S.relay(); const b = M.box(g, 'wm'); if (b) g.burst(b.x, b.y, [C1, C2, '#ffd45a'], 14, 140);
          } });
        return out;
      },
      area(g) { return !S.swapped ? ['wa', 'wd'] : !S.negb ? ['wb'] : !S.negc ? ['wc'] : !S.placed ? ['inv'] : ['den']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s;
    SCN.std(g, c, { scene: 'kitchen', panel: 'paper', host: 'rabbit', hostX: 70, hostY: 598, hostS: 1.25, panelY: 318, panelH: 250 });
    // the ingredients sit in little dishes on the page
    for (const id of ['m1', 'm2', 'inv']) { const b = M.box(g, id), n = M.node(g, id); if (!b || !n || n.hide) continue; c.save(); c.fillStyle = id === 'inv' ? 'rgba(42,122,176,0.12)' : 'rgba(200,64,42,0.12)'; c.strokeStyle = id === 'inv' ? 'rgba(42,122,176,0.5)' : 'rgba(200,64,42,0.5)'; c.lineWidth = 2; c.beginPath(); c.ellipse(b.x, b.y + 2, Math.max(b.w, 30) / 2 + 10, b.h / 2 + 8, 0, 0, 7); c.fill(); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'orig'); M.drawEx(g, c, 'work'); M.drawEx(g, c, 'ing');
    M.drawUI(g, c);
  },
});
