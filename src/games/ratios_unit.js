// ratios_unit.js — UNIT RATE! "$12 for 4 apples": drag the 4 onto the $12 to share the price out among the apples.
// The working plays by itself (show your work):
//   1. The 4 glides next to the 12, "for" becomes "÷" and the sentence reads $(12 ÷ 4) per apple. Then the coins are
//      dealt out like cards, one coin to each apple per round, until the heap is gone: 4 equal piles.
//   2. Tap 12 ÷ 4: each pile is counted in turn (a "3" pops above it), and the 3 from the first pile flies up into the
//      sentence, which becomes $3 per apple. The apples hop.
// Dragging the 12 onto the 4 only wobbles.
// Level 0: 2–4 apples. Level 1: 3–6 pieces of fruit. Level 2: 4–8. Medium mode: the tap on 12 ÷ 4 opens the tray
// once every pile has been counted.
const M = MK, INK = SCN.ink('paper'), PRICE = '#2a8a4a', HX = 290, HY = 600;
const FRUIT = [['apples', 'apple', '#e0443a'], ['oranges', 'orange', '#f0902a'], ['lemons', 'lemon', '#f2cc2a'], ['pears', 'pear', '#9ac43a']];
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  const n = L === 0 ? 2 + r(3) : L === 1 ? 3 + r(4) : 4 + r(5), u = L === 0 ? 2 + r(3) : 2 + r(L === 1 ? 5 : 4);
  return { n, u, p: n * u, f: FRUIT[L === 0 ? 0 : r(FRUIT.length)] };
}
const fruitX = (S, j) => 180 + (j - (S.n - 1) / 2) * Math.min(42, 300 / S.n), FY = 368;
// where coin i sits: in a heap before the split, in pile (i mod n) on its fruit after it. Coins are dealt in rounds:
// in round r every fruit gets its r-th coin, one after the other.
function coinAt(S, i, t) {
  const cols = Math.min(S.p, 12), hx = 180 + (i % cols - (cols - 1) / 2) * 19, hy = 296 + Math.floor(i / cols) * 11;
  const px = fruitX(S, i % S.n), py = 346 - Math.floor(i / S.n) * 6;
  if (S.splitAt == null) return [hx, hy, 0];
  const rd = S.dealDur / S.u, t0 = S.splitAt + Math.floor(i / S.n) * rd + (i % S.n) * rd * 0.6 / S.n, k = M.easeIO((t - t0) / Math.min(0.3, rd * 1.4));
  return [M.lerp(hx, px, k), M.lerp(hy, py, k) - Math.sin(k * Math.PI) * 22, k];
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
const pileTop = (S, j) => [fruitX(S, j), 346 - (S.u - 1) * 6 - 18];
function host(g, c, kind, x, y, s) {
  const S = g.s, K = S.mk, hop = K.lastMove != null && g.t - K.lastMove < 0.35 ? Math.sin((g.t - K.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hop > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hop * 24, s, { t: g.t, pose, expr, facing: -1 }); else SCN.host(g, c, kind, x, y, s);
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
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.splitAt = null; S.counts = []; const T = M.pace(g);
    S.dl = M.txt('$', 'dl'); S.pN = M.num(S.p, 'p', { col: PRICE }); S.nN = M.num(S.n, 'n'); S.it = M.txt(' ' + S.f[0], 'it');
    S.ex = M.row(S.dl, S.pN, M.txt(' for ', 'for'), S.nN, S.it);
    const relay = () => { let s = 36; const w = M.lay(S.ex, s).w; if (w > 300) s *= 300 / w; M.place(g, 'ex', S.ex, 180, 236, s, { col: INK }); }; relay();
    M.inert(g, ['dl', 'for', 'it']);
    const hop = (g, e) => { g.s.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    g.dur *= (2.6 + 1.05 * 2) / 8;
    M.play(g, {
      moves(g) {
        // 1. drag the number of fruit onto the price: the price is shared out, $(12 ÷ 4) per apple
        if (!S.st) return [{ drag: 'n', to: 'p', busy: 0.1,
          then(g) { S.st = 1; S.dealDur = 0.95 * T; M.show(g, 0.45 * T + S.dealDur + 0.3 * T); S.point = true; hop(g, 'wow'); g.sfx('whoosh');
            S.div = M.op('÷', null, { col: '#d86a2a' }); S.pN.id = null; S.nN.id = null;
            S.q = M.paren(M.row(S.pN, S.div, S.nN), 'q'); S.it.v = ' per ' + S.f[1]; S.ex = M.row(S.dl, S.q, S.it); relay();
            M.indicate(g, S.div, { delay: 0.2 * T, dur: 0.35 * T, sc: 1.5 });
            M.at(g, [[0.45 * T, g => { S.splitAt = g.t; g.sfx('coin'); hop(g); }]]);
            for (let r = 1; r < S.u; r++) M.at(g, [[0.45 * T + r * S.dealDur / S.u, g => g.sfx('tap')]]);
            M.at(g, [[0.45 * T + S.dealDur + 0.1 * T, g => { hop(g, 'happy'); M.circle(g, [[fruitX(S, 0) - 8, 340, 30], [fruitX(S, S.n - 1) + 8, 340, 30]], { dur: 0.4 * T, pad: 16, col: '#f6c84a' }); }]]); } }];
        // 2. tap the division: each pile is counted, and one pile's count flies into the sentence
        if (S.st === 1) return [{ tap: 'q', busy: 0.1, askAt: (0.2 + 0.7) * T, after: 0.85 * T, ask: { v: S.u, wrong: [S.p - S.n, S.u + 1, S.u - 1, S.n, S.p * S.n] },
          then(g) { S.st = 2; M.show(g, 0.9 * T); S.point = true; hop(g, 'think'); M.circle(g, 'q', { dur: 0.45 * T });
            for (let j = 0; j < S.n; j++) M.at(g, [[0.2 * T + j * 0.55 * T / S.n, g => { S.counts[j] = g.t; g.sfx('tap'); }]]); },
          resolve(g) { M.show(g, 0.85 * T); const [px, py] = pileTop(S, 0); g.sfx('swoosh');
            M.fly(g, { node: M.num(S.u, null, { col: PRICE }), from: [px, py], to: 'q', dur: 0.4 * T, arc: -50, s0: 20, s1: 36,
              then(g) { for (const q of [S.pN, S.nN, S.div, S.q]) q.alpha = 0; S.rN = M.num(S.u, 'r', { col: PRICE, pop: g.t, _born: -1 }); S.ex = M.row(S.dl, S.rN, S.it); relay(); S.doneAt = g.t; S.fade = g.t; g.sfx('coin'); hop(g, 'laugh');
                const b = M.box(g, 'r'); if (b) g.burst(b.x, b.y, ['#f6c84a', '#fff', '#9ae07a'], 12, 130); } });
            M.indicate(g, S.q, { dur: 0.35 * T, sc: 1.12 }); } }];
        return [];
      },
      area(g) { return !S.st ? ['n', 'p'] : ['q']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'kitchen', panel: 'paper', panelY: 290, panelH: 216 });
    host(g, c, 'hedgehog', HX, HY, 1.4);
    // the fruit in a row on the paper, and the coins of the price heaped above them (they are dealt into piles)
    for (let j = 0; j < S.n; j++) { const hop = S.doneAt != null ? Math.max(0, Math.sin((t - S.doneAt - j * 0.06) * 9)) * (t - S.doneAt < 0.5 ? 6 : 0) : 0; fruit(c, fruitX(S, j), FY - hop, S.f[2], t + j); }
    // coins still in the heap first, so the dealt coins fly over them
    const pos = [...Array(S.p)].map((_, i) => coinAt(S, i, t));
    for (const [x, y, k] of pos) if (k <= 0) coin(c, x, y);
    for (const [x, y, k] of pos) if (k > 0) coin(c, x, y);
    // the count over each pile
    S.counts.forEach((t0, j) => { if (t0 == null) return; const k = M.clamp((t - t0) / 0.25, 0, 1), out = S.fade != null ? M.clamp((t - S.fade) / 0.3, 0, 1) : 0; if (out >= 1) return;
      const [x, y] = pileTop(S, j), sc = 1 + Math.sin(k * Math.PI) * 0.4; c.save(); c.globalAlpha = k * (1 - out); c.translate(x, y); c.scale(sc, sc);
      c.fillStyle = 'rgba(255,255,255,0.92)'; c.beginPath(); c.arc(0, -5, 13, 0, 7); c.fill(); c.strokeStyle = PRICE; c.lineWidth = 2; c.stroke();
      c.font = M.NUMF(18, 700); c.textAlign = 'center'; c.fillStyle = PRICE; c.fillText(String(S.u), 0, 1); c.restore(); });
    M.drawEx(g, c, 'ex'); M.drawUI(g, c);
  },
});
