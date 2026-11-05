// ratios_unit.js — UNIT RATE! "$12 for 4 apples": drag the 4 onto the $12 to share the price out among the apples.
// The sentence rewrites itself in place as $(12 ÷ 4) per apple, and the coins of the price slide into 4 equal piles,
// one pile on each apple. Tapping 12 ÷ 4 computes it: $3 per apple. Dragging the 12 onto the 4 only wobbles.
// Level 0: 2–4 apples. Level 1: 3–6 pieces of fruit. Level 2: 4–8. Medium mode: the tap on 12 ÷ 4 opens the tray.
const M = MK, INK = SCN.ink('paper'), PRICE = '#2a8a4a';
const FRUIT = [['apples', 'apple', '#e0443a'], ['oranges', 'orange', '#f0902a'], ['lemons', 'lemon', '#f2cc2a'], ['pears', 'pear', '#9ac43a']];
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  const n = L === 0 ? 2 + r(3) : L === 1 ? 3 + r(4) : 4 + r(5), u = L === 0 ? 2 + r(3) : 2 + r(L === 1 ? 5 : 4);
  return { n, u, p: n * u, f: FRUIT[L === 0 ? 0 : r(FRUIT.length)] };
}
// the sentence is rebuilt from the state after every move; S.pops[id] says when a part changed (it pops)
function build(g) {
  const S = g.s, pp = id => ({ pop: S.pops[id] });
  const items = S.st === 0 ? [M.txt('$', 'dl'), M.num(S.p, 'p', { col: PRICE }), M.txt(' for ', 'for'), M.num(S.n, 'n'), M.txt(' ' + S.f[0], 'it')]
    : S.st === 1 ? [M.txt('$', 'dl'), M.paren(M.row(M.num(S.p, null, { col: PRICE }), M.op('÷'), M.num(S.n)), 'q', pp('q')), M.txt(' per ' + S.f[1], 'it')]
    : [M.txt('$', 'dl'), M.num(S.u, 'r', { col: PRICE, ...pp('r') }), M.txt(' per ' + S.f[1], 'it')];
  const node = M.row(...items); let s = 36; const w = M.lay(node, s).w; if (w > 300) s *= 300 / w;
  M.place(g, 'ex', node, 180, 236, s, { col: INK });
}
const fruitX = (S, j) => 180 + (j - (S.n - 1) / 2) * Math.min(42, 300 / S.n);
// where coin i sits: in a heap before the split, in pile (i mod n) on its fruit after it
function coinAt(S, i, t) {
  const cols = Math.min(S.p, 12), hx = 180 + (i % cols - (cols - 1) / 2) * 19, hy = 296 + Math.floor(i / cols) * 11;
  const px = fruitX(S, i % S.n), py = 346 - Math.floor(i / S.n) * 6;
  const k = S.splitAt == null ? 0 : M.easeIO((t - S.splitAt - (i % S.n) * 0.02) / 0.3);
  return [M.lerp(hx, px, k), M.lerp(hy, py, k) - Math.sin(k * Math.PI) * 18];
}
function coin(c, x, y) {
  c.fillStyle = '#b8862a'; c.beginPath(); c.ellipse(x, y + 2, 8, 4, 0, 0, 7); c.fill();
  c.fillStyle = '#f6c84a'; c.beginPath(); c.ellipse(x, y, 8, 4, 0, 0, 7); c.fill();
  c.strokeStyle = '#a8761e'; c.lineWidth = 1; c.beginPath(); c.ellipse(x, y, 5, 2.4, 0, 0, 7); c.stroke();
}
function fruit(c, x, y, col, t) {
  c.fillStyle = 'rgba(60,30,20,0.18)'; c.beginPath(); c.ellipse(x, y + 12, 12, 3.5, 0, 0, 7); c.fill();
  const gr = c.createRadialGradient(x - 4, y - 4, 2, x, y, 13); gr.addColorStop(0, P.shade(col, 0.35)); gr.addColorStop(1, col);
  c.fillStyle = gr; c.beginPath(); c.arc(x, y, 12, 0, 7); c.fill();
  c.strokeStyle = '#6a4a2a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y - 11); c.lineTo(x + 1, y - 16); c.stroke();
  c.fillStyle = '#5aa040'; c.beginPath(); c.ellipse(x + 5, y - 15, 5, 2.5, -0.5 + Math.sin(t * 2) * 0.1, 0, 7); c.fill();
}

MG.add({
  id: 'ratios_unit', stage: 'ratios', cmd: 'UNIT RATE!', hint: 'drag', time: 8, mood: 'bright', winText: 'Per one!', hold: 1.4,
  card: {
    title: 'Unit rates', ref: 'Grade 6', kind: 'Ratios and percents',
    text: 'A rate compares two different kinds of amounts, such as dollars and apples. A unit rate tells you how much goes with just one of something: the price of one apple, or how far a car goes in one hour.\n\nTo find a unit rate, divide the first amount by the number of things. For example, if 4 apples cost $12, then one apple costs 12 ÷ 4 = 3 dollars. The unit rate is $3 per apple.\n\nThis works because every apple costs the same. If you share the $12 out equally among the 4 apples, each apple gets $3.',
    note: 'To find the amount for one, divide the total by how many there are: $12 for 4 apples is 12 ÷ 4 = $3 per apple.',
    ask: 'If 5 pencils cost $10, what does one pencil cost? A car goes 120 miles in 2 hours. How far does it go in one hour?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.st = 0; S.pops = {}; S.splitAt = null;
    build(g); M.inert(g, ['dl', 'for']);
    g.dur *= (2.6 + 1.05 * 2) / 8;
    M.play(g, {
      moves(g) {
        // drag the number of fruit onto the price: the price is shared out, $(12 ÷ 4) per apple
        if (S.st === 0) return [{ drag: 'n', to: 'p', busy: 0.1, then(g) { S.st = 1; S.pops.q = g.t; S.splitAt = g.t; g.sfx('whoosh'); build(g); } }];
        // tap the division to compute it
        if (S.st === 1) return [{ tap: 'q', busy: 0.1, askAt: 0, after: 0.1, ask: { v: S.u, wrong: [S.p - S.n, S.u + 1, S.u - 1, S.n, S.p * S.n] },
          then() {}, resolve(g) { S.st = 2; S.pops.r = g.t; S.doneAt = g.t; g.sfx('coin'); build(g); const b = M.box(g, 'r'); if (b) g.burst(b.x, b.y, ['#f6c84a', '#fff', '#9ae07a'], 12, 130); } }];
        return [];
      },
      area(g) { return S.st === 0 ? ['n', 'p'] : ['q']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'kitchen', panel: 'paper', panelY: 290, panelH: 216, host: 'hedgehog', hostX: 290, hostY: 600, hostS: 1.4 });
    // the fruit in a row on the paper, and the coins of the price heaped above them (they split into piles)
    for (let j = 0; j < S.n; j++) { const hop = S.doneAt != null ? Math.max(0, Math.sin((t - S.doneAt - j * 0.06) * 9)) * (t - S.doneAt < 0.5 ? 6 : 0) : 0; fruit(c, fruitX(S, j), 368 - hop, S.f[2], t + j); }
    for (let i = 0; i < S.p; i++) { const [x, y] = coinAt(S, i, t); coin(c, x, y); }
    M.drawEx(g, c, 'ex'); M.drawUI(g, c);
  },
});
