// integers_order.js — ORDER OF OPS! Work out 3 + 4 × 2 in the right order by tapping the operation to do next.
// Order: brackets, then exponents, then × and ÷ left to right, then + and − left to right. Any order that gives the same
// answer is allowed: in 2 + 3 − 1 the − may go first, since 2 + (3 − 1) is the same; in 5 − 3 + 1 the + may not.
// Tapping an operation that has to wait (the + first) only wobbles.
// A note pinned up in a cosy library, with a hedgehog reading below. Every move acts its working out (show your work):
// tapping an operation circles it with its two numbers, and the working writes itself just under them ("4 × 2 = 8";
// for a power "3² = 3 × 3 = 9"); the answer lifts out of the note and drops into the line, where the old numbers and
// the sign fold into it and the rest of the line glides together. A bracket left around a single number tips over and
// falls off the paper. The hedgehog points while the work plays and hops when a result lands.
// Level 0: two operations. Level 1: three operations. Level 2: brackets and exponents.
// Medium mode: each tap opens a tray once "4 × 2 =" is written; wrong tiles come from the classic slips (a power as a
// product, ± one, the other operation).
const M = MK, INK = SCN.ink('paper'), NOTE = '#1e6a8a', HX = 90, HY = 512, NY = 364, PREC = { '+': 1, '-': 1, '×': 2, '÷': 2 };
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
// one node object per item for the whole microgame, so a symbol glides when the line is rewritten
function node(it, g) {
  const C = g.s.nodes; let n = C.get(it);
  if (it.k === 'n') { if (!n) C.set(it, n = M.num(it.v, it.id)); return n; }
  if (it.k === 'o') { if (!n) C.set(it, n = M.op(it.o, it.id)); return n; }
  if (it.k === 'p') { if (!n) C.set(it, n = M.paren(M.row(), it.id)); n.inner = M.row(...it.l.map(q => node(q, g))); return n; }
  if (!n) C.set(it, n = M.sup(null, M.num(it.e, it.id))); n.base = node(it.b, g); return n;
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
    S.nodes = new Map(); const T = M.pace(g);
    S.place = () => { const n = M.row(...S.list.map(q => node(q, g))), w = M.lay(n, 48).w; S.sz = Math.min(48, 48 * 290 / w); M.place(g, 'ex', n, 180, 300, S.sz, { col: INK }); };
    S.place();
    const hop = (g, e) => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    const parens = () => { const out = []; (function walk(l) { for (const it of l) { if (it.k === 'p') { out.push(it.id); walk(it.l); } if (it.k === 'w' && it.b.k === 'p') { out.push(it.b.id); walk(it.b.l); } } })(S.list); return out; };
    // the working note: "4 × 2 =" writes itself under the part being worked on; the answer fills in at resolve.
    // Each note gets its own key, so an old one never comes back as a ghost when the next is placed.
    const start = (g, ids, noteItems) => { M.show(g, 0.62 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh');
      M.circle(g, ids, { dur: 0.5 * T, col: '#e8a83a' }); for (const id of ids) M.light(g, id, { col: '#e8a83a' });
      const b = M.box(g, ids[0]) && M.unionBox(ids.map(id => M.box(g, id)));
      S.q = M.num(0, 'q', { alpha: 0 }); S.note = M.row(...noteItems, M.op('='), S.q);
      const w = M.lay(S.note, 30).w, x = M.clamp(b ? b.x : 180, 30 + w / 2, 330 - w / 2);
      S.nk = 'note' + (S.nn = (S.nn || 0) + 1); M.place(g, S.nk, S.note, x, NY, 30, { col: NOTE }); M.writeIn(g, S.note, { delay: 0.1 * T, dur: 0.42 * T }); };
    // the answer fills in, lifts out of the note and drops into the line; the old symbols fold into it
    const finish = (g, v, swap) => { M.show(g, 0.9 * T); const key = S.nk; S.q.v = String(v).replace(/^-/, '−'); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); M.indicate(g, S.q, { delay: 0.14 * T, dur: 0.3 * T, col: '#e8a83a' }); g.sfx('ding');
      M.at(g, [[0.42 * T, g => { const from = { ...M.box(g, 'q') }, before = parens().map(id => ({ id, b: { ...M.box(g, id) } }));
        const n = N(v); swap(n); tidy(S.list); const nn = node(n, g); nn.alpha = 0; nn.col = '#1e6a8a'; S.place(); M.tween(g, S.note, { alpha: 0 }, 0.25 * T);
        // a bracket around a single number tips over and falls off the paper
        const now = new Set(parens()); for (const p of before) if (!now.has(p.id) && p.b) fall(g, p.b, T);
        M.fly(g, { node: M.num(v, null, { col: NOTE }), from: [from.x, from.y], to: n.id, dur: 0.34 * T, arc: 26, s0: 30, s1: S.sz,
          then(g) { nn.alpha = 1; nn.pop = g.t; M.sparkle(g, nn, { cols: ['#ffd45a', '#7ad0ff', '#fff'] }); g.sfx('coin'); hop(g, 'laugh'); } }); }],
        [0.85 * T, g => { delete g.s.mk.ex[key]; S.point = false; }]]); };
    M.play(g, {
      moves(g) {
        return valid(S.list).map(m => {
          if (m.pow) { const it = m.item, bv = it.b.v, v = Math.pow(bv, it.e);
            return { tap: [it.id, it.b.id], busy: 0.1, askAt: 0.62 * T, after: 0.9 * T, ask: { v, wrong: [bv * it.e, bv + it.e, v + 1] },
              then(g) { start(g, [it.b.id, it.id], [M.sup(M.num(bv), M.num(it.e)), M.op('='), ...Array.from({ length: it.e }, (_, k) => [k ? M.op('×') : null, M.num(bv)]).flat()]); },
              resolve(g) { finish(g, v, n => replace(S.list, it, n)); } };
          }
          const { item: op, list, i } = m, a = list[i - 1], b = list[i + 1], v = calc(a.v, op.o, b.v);
          const other = calc(a.v, op.o === '+' ? '×' : op.o === '×' ? '+' : op.o === '-' ? '+' : '×', b.v);
          return { tap: op.id, busy: 0.1, askAt: 0.62 * T, after: 0.9 * T, ask: { v, wrong: [other, v + 1, v - 1, -v] },
            then(g) { start(g, [a.id, op.id, b.id], [M.num(a.v), M.op(op.o), M.num(b.v)]); },
            resolve(g) { finish(g, v, n => list.splice(list.indexOf(a), 3, n)); } };
        });
      },
      area(g) { const m = valid(S.list)[0]; return m ? m.item.id : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.std(g, c, { scene: 'library', panel: 'paper', panelY: 296, panelH: 170 });
    // a reading lamp on the top shelf, its glow flickering softly
    const fl = 0.3 + 0.05 * Math.sin(t * 7) * Math.sin(t * 3.1), gl = c.createRadialGradient(286, 440, 4, 286, 440, 130); gl.addColorStop(0, `rgba(255,220,140,${fl})`); gl.addColorStop(1, 'rgba(255,220,140,0)'); c.fillStyle = gl; c.fillRect(150, 310, 280, 260);
    c.fillStyle = '#3a1a10'; c.fillRect(272, 506, 28, 8); c.fillStyle = '#c89a4a'; c.fillRect(283, 452, 6, 56); c.fillStyle = '#e8c070'; c.beginPath(); c.moveTo(264, 456); c.lineTo(308, 456); c.lineTo(296, 428); c.lineTo(276, 428); c.closePath(); c.fill();
    // the hedgehog points up at the note while the work plays, and hops when a result lands
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    try { if (typeof ANI !== 'undefined') ANI.draw(c, 'hedgehog', HX, HY - hopK * 22, 1.3, { t, pose, expr }); else SCN.host(g, c, 'hedgehog', HX, HY, 1.3); } catch (e) { }
    M.drawEx(g, c, 'ex'); for (const k of Object.keys(K.ex)) if (k.startsWith('note')) M.drawEx(g, c, k);
    M.drawUI(g, c);
  },
});
// a bracket pair that is no longer needed tips outward and drops off the paper
function fall(g, B, T) {
  M.anim(g, { dur: 0.45 * T, draw(c, g, k) { c.globalAlpha = 1 - k; c.strokeStyle = INK; c.lineWidth = B.s * 0.075; c.lineCap = 'round';
    for (const d of [-1, 1]) { const x = B.x + d * (B.w / 2 - B.s * 0.15), y = B.y + k * k * 70, h = B.h / 2, w = B.s * 0.12; c.save(); c.translate(x + d * k * 14, y); c.rotate(d * k * 1.1);
      c.beginPath(); c.moveTo(-d * w, -h); c.quadraticCurveTo(d * w * 0.9, 0, -d * w, h); c.stroke(); c.restore(); } } });
}
function replace(list, it, n) {
  const i = list.indexOf(it); if (i >= 0) { list[i] = n; return true; }
  return list.some(q => (q.k === 'p' && replace(q.l, it, n)) || (q.k === 'w' && q.b.k === 'p' && replace(q.b.l, it, n)));
}
