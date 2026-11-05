// integers_order.js — ORDER OF OPS! Work out 3 + 4 × 2 in the right order by tapping the operation to do next.
// Tapping an operation that may go next computes it in place (4 × 2 becomes 8, so the line reads 3 + 8); tapping one
// that has to wait (the + first) only wobbles. Order: brackets, then exponents, then × and ÷ left to right, then + and −
// left to right. Any order that gives the same answer is allowed: in 2 + 3 − 1 the − may go first, since 2 + (3 − 1)
// is the same; in 5 − 3 + 1 the + may not.
// A note pinned up in a cosy library, with a hedgehog reading below.
// Level 0: two operations. Level 1: three operations. Level 2: brackets and exponents.
// Medium mode: each tap opens a tray; wrong tiles come from the classic slips (a power as a product, ± one, the
// other operation).
const M = MK, INK = SCN.ink('paper'), PREC = { '+': 1, '-': 1, '×': 2, '÷': 2 };
let uid = 0;
const N = v => ({ k: 'n', v, id: 'n' + uid++ }), O = o => ({ k: 'o', o, id: 'o' + uid++ }), Pa = (...l) => ({ k: 'p', l, id: 'p' + uid++ }), Pw = (b, e) => ({ k: 'w', b, e, id: 'e' + uid++ });
const calc = (a, o, b) => o === '+' ? a + b : o === '-' ? a - b : o === '×' ? a * b : a / b;
function build(g) {
  const r = (lo, hi) => lo + Math.floor(g.rand() * (hi - lo + 1)), L = g.level, pick = arr => arr[Math.floor(g.rand() * arr.length)];
  if (L === 0) return pick([
    () => [N(r(2, 9)), O('+'), N(r(2, 5)), O('×'), N(r(2, 4))],
    () => [N(r(2, 5)), O('×'), N(r(2, 4)), O('+'), N(r(2, 9))],
    () => [N(r(2, 9)), O('-'), N(r(2, 4)), O('×'), N(r(2, 4))],
    () => { const c = r(2, 4); return [N(r(2, 9)), O('+'), N(c * r(2, 4)), O('÷'), N(c)]; },
  ])();
  if (L === 1) return pick([
    () => [N(r(2, 9)), O('+'), N(r(2, 4)), O('×'), N(r(2, 4)), O('-'), N(r(2, 9))],
    () => [N(r(2, 4)), O('×'), N(r(2, 5)), O('-'), N(r(2, 4)), O('×'), N(r(2, 4))],
    () => { const c = r(2, 4); return [N(r(2, 9)), O('-'), N(c * r(2, 4)), O('÷'), N(c), O('+'), N(r(2, 9))]; },
    () => [N(r(2, 9)), O('-'), N(r(2, 9)), O('+'), N(r(2, 3)), O('×'), N(r(2, 5))],
  ])();
  return pick([
    () => [N(r(2, 4)), O('×'), Pa(N(r(2, 6)), O('+'), N(r(2, 6)))],
    () => [Pw(Pa(N(r(1, 3)), O('+'), N(r(1, 2))), 2), O('-'), N(r(2, 9))],
    () => [N(r(2, 9)), O('+'), Pw(N(r(2, 3)), 2), O('×'), N(r(2, 3))],
    () => [Pa(N(r(6, 9)), O('-'), N(r(2, 5))), O('×'), Pw(N(r(2, 3)), 2)],
    () => [Pw(N(2), 3), O('-'), Pa(N(r(1, 4)), O('+'), N(r(1, 4)))],
  ])();
}
// every operation that may be done now: [{ item, list, i }] for an operation, [{ item: power }] for a power
function valid(list, out = []) {
  list.forEach((it, i) => {
    if (it.k === 'p') valid(it.l, out);
    if (it.k === 'w') { if (it.b.k === 'p') valid(it.b.l, out); else out.push({ item: it, pow: true }); }
    if (it.k !== 'o') return;
    const a = list[i - 1], b = list[i + 1], lo = list[i - 2], ro = list[i + 2], p = PREC[it.o];
    if (a.k !== 'n' || b.k !== 'n') return;
    if (lo && !(PREC[lo.o] < p || (PREC[lo.o] === p && (lo.o === '+' || (lo.o === '×' && it.o === '×'))))) return;
    if (ro && PREC[ro.o] > p) return;
    out.push({ item: it, list, i });
  });
  return out;
}
function tidy(list) { // a bracket around a single number goes away
  list.forEach((it, i) => { if (it.k === 'p') { tidy(it.l); if (it.l.length === 1) list[i] = it.l[0]; } if (it.k === 'w' && it.b.k === 'p') { tidy(it.b.l); if (it.b.l.length === 1) it.b = it.b.l[0]; } });
}
function node(it, g) {
  if (it.k === 'n') return M.num(it.v, it.id, { pop: it.pop, col: it.pop ? '#1e6a8a' : undefined });
  if (it.k === 'o') return M.op(it.o, it.id);
  if (it.k === 'p') return M.paren(M.row(...it.l.map(q => node(q, g))), it.id);
  return M.sup(node(it.b, g), M.num(it.e, it.id));
}
MG.add({
  id: 'integers_order', stage: 'integers', cmd: 'ORDER OF OPS!', hint: 'tap', time: 9, mood: 'bright', winText: 'In order!', hold: 1.4,
  card: {
    title: 'Order of operations', ref: 'Grades 6–7', kind: 'Arithmetic',
    text: 'An operation is something you do to numbers, such as adding or multiplying. When an expression has several operations, everyone agrees to do them in the same order, so everyone gets the same answer.\n\nThe order is: first work out what is inside brackets. Then work out exponents, such as 3² = 3 × 3. Then multiply and divide, from left to right. Last, add and subtract, from left to right.\n\nFor example, 3 + 4 × 2: multiply first, 4 × 2 = 8, then add, 3 + 8 = 11. If you added first you would get 14, which is wrong.\n\nIf you want the adding done first, write brackets: (3 + 4) × 2 = 14.',
    note: 'Brackets, then exponents, then × and ÷ from left to right, then + and − from left to right.',
    ask: 'What is 10 − 2 × 3? What is (1 + 2)² × 2?',
  },
  init(g) {
    const S = g.s; M.setup(g); uid = 0; S.list = build(g);
    let nOps = 0; (function count(l) { for (const it of l) { if (it.k === 'o' || it.k === 'w') nOps++; if (it.k === 'p') count(it.l); if (it.k === 'w' && it.b.k === 'p') count(it.b.l); } })(S.list);
    g.dur *= (2.6 + 1.05 * nOps) / 8;
    const ids = []; (function walk(l) { for (const it of l) { if (it.k === 'p') { ids.push(it.id); walk(it.l); } if (it.k === 'w' && it.b.k === 'p') { ids.push(it.b.id); walk(it.b.l); } } })(S.list);
    M.inert(g, ids);
    S.place = () => { const n = M.row(...S.list.map(q => node(q, g))), w = M.lay(n, 48).w; M.place(g, 'ex', n, 180, 300, Math.min(48, 48 * 290 / w), { col: INK }); };
    S.place();
    M.play(g, {
      moves(g) {
        return valid(S.list).map(m => {
          if (m.pow) { const it = m.item, v = Math.pow(it.b.v, it.e);
            return { tap: [it.id, it.b.id], busy: 0.1, ask: { v, wrong: [it.b.v * it.e, it.b.v + it.e, v + 1] },
              then(g) { S.cur = it; }, resolve(g) { const n = N(v); n.pop = g.t; replace(S.list, it, n); S.after(g, n); } };
          }
          const { item: op, list, i } = m, a = list[i - 1].v, b = list[i + 1].v, v = calc(a, op.o, b);
          const other = calc(a, op.o === '+' ? '×' : op.o === '×' ? '+' : op.o === '-' ? '+' : '×', b);
          return { tap: op.id, busy: 0.1, ask: { v, wrong: [other, v + 1, v - 1, -v] },
            then(g) { }, resolve(g) { const n = N(v); n.pop = g.t; list.splice(i - 1, 3, n); S.after(g, n); } };
        });
      },
      area(g) { const m = valid(S.list)[0]; return m ? m.item.id : null; },
    });
    S.after = (g, n) => { tidy(S.list); S.place(); g.sfx('coin'); const b = M.box(g, n.id); if (b) g.burst(b.x, b.y, ['#ffd45a', '#7ad0ff', '#ffffff'], 10, 120); };
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const t = g.t;
    SCN.std(g, c, { scene: 'library', panel: 'paper', panelY: 296, panelH: 170, host: 'hedgehog', hostX: 90, hostY: 512, hostS: 1.3 });
    // a reading lamp on the top shelf, its glow flickering softly
    const fl = 0.3 + 0.05 * Math.sin(t * 7) * Math.sin(t * 3.1), gl = c.createRadialGradient(286, 440, 4, 286, 440, 130); gl.addColorStop(0, `rgba(255,220,140,${fl})`); gl.addColorStop(1, 'rgba(255,220,140,0)'); c.fillStyle = gl; c.fillRect(150, 310, 280, 260);
    c.fillStyle = '#3a1a10'; c.fillRect(272, 506, 28, 8); c.fillStyle = '#c89a4a'; c.fillRect(283, 452, 6, 56); c.fillStyle = '#e8c070'; c.beginPath(); c.moveTo(264, 456); c.lineTo(308, 456); c.lineTo(296, 428); c.lineTo(276, 428); c.closePath(); c.fill();
    M.drawEx(g, c, 'ex');
    M.drawUI(g, c);
  },
});
function replace(list, it, n) {
  const i = list.indexOf(it); if (i >= 0) { list[i] = n; return true; }
  return list.some(q => (q.k === 'p' && replace(q.l, it, n)) || (q.k === 'w' && q.b.k === 'p' && replace(q.b.l, it, n)));
}
