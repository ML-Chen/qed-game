// decimals_expand.js — EXPAND! Write a decimal in expanded form: each digit times the value of its place.
// A stone tablet on the reef floor. A number (2.305) is carved on it in a place-value chart: above each column a shell
// tag shows the column's value (1, 1/10, 1/100, 1/1000). Under it the expanded form builds itself: 2.305 = ...
// The player taps each non-zero digit, in any order. The working plays by itself: a glowing ring draws around the digit,
// its column's shell lights up, the digit lifts out and sinks down into its place in the expanded form, then the
// shell's value follows it down: for a decimal place its 10, 100 or 1000 drops in under a fraction bar that draws
// itself (3/10); for the tens a 0 writes itself in beside the digit (10). The terms sit in place order whichever digit
// came first, and + signs slide in between them. The octopus points at each column and hops when a term lands.
// Tapping a 0 is the classic slip (writing a "+ 0" term): it wobbles, and a note "0/100 = 0" shows that it adds nothing.
// Level 0: 3.47 (three non-zero digits). Level 1: 2.305 (a zero inside). Level 2: 12.406 (tens too, and a zero).
// Medium mode: the tray asks for each digit's value (5/1000, not 5/100) as it lifts out.
const M = MK, INK = '#eaf6ff', SHELL = '#ffe4c8', NY = 314, RY = 418, CW = 58, OX = 70, OY = 606;
function gen(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  if (L === 0) return [[r(1, 9)], [r(1, 9), r(1, 9)]];
  if (L === 1) return g.rand() < 0.5 ? [[r(1, 9)], [r(1, 9), 0, r(1, 9)]] : [[r(1, 9)], [0, r(1, 9), r(1, 9)]];
  return [[r(1, 9), r(1, 9)], g.rand() < 0.5 ? [r(1, 9), 0, r(1, 9)] : [0, r(1, 9), r(1, 9)]];
}
const valNode = (d, p, ids = {}) => p >= 0 ? M.num(d * 10 ** p, ids.n) : M.frac(M.num(d, ids.n), M.num(10 ** -p, ids.d), ids.f);
const headNode = (p, id) => p >= 0 ? M.num(10 ** p, id) : M.frac(M.num(1), M.num(10 ** -p), id);

MG.add({
  id: 'decimals_expand', stage: 'decimals', cmd: 'EXPAND!', hint: 'tap', time: 9, mood: 'sea', winText: 'Expanded!', hold: 1.6,
  card: {
    title: 'Expanded form of decimals', ref: 'Grade 5', kind: 'Decimals',
    text: 'Every digit in a number is worth its own amount, depending on its place. Expanded form writes each of those amounts separately and adds them up.\n\nAfter the decimal point the places are tenths, hundredths and thousandths. In 2.305 the 2 is 2 ones, the 3 is 3 tenths (3/10), the 0 is no hundredths, and the 5 is 5 thousandths (5/1000). So 2.305 = 2 + 3/10 + 5/1000.\n\nThe 0 adds nothing, but it matters: it holds the hundredths place so that the 5 stays in the thousandths. Without it, 2.35 would mean 2 + 3/10 + 5/100.',
    note: 'Each digit is worth digit × place value. A 0 adds nothing but keeps the other digits in their places.',
    ask: 'Write 4.68 in expanded form. What is the 7 worth in 1.073?',
  },
  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g); const [W, D] = gen(g);
    S.cols = [...W.map((d, j) => ({ d, p: W.length - 1 - j })), ...D.map((d, j) => ({ d, p: -1 - j }))];
    const n = S.cols.length, x0 = 180 - (n * CW + 16) / 2;
    S.cols.forEach((C, j) => { C.j = j; C.x = x0 + (j + 0.5) * CW + (C.p < 0 ? 16 : 0); C.id = 'd' + j;
      M.place(g, C.id, M.num(C.d, C.id), C.x, NY, 62, { col: INK }); M.place(g, 'h' + j, headNode(C.p, 'h' + j), C.x, NY - 80, C.p >= 0 ? 24 : 27, { col: '#5a3a2a' }); });
    S.ptX = x0 + W.length * CW + 8; S.x0 = x0; S.x1 = x0 + n * CW + 16;
    M.inert(g, S.cols.map((C, j) => 'h' + j).concat(['eq', 'num']));
    g.dur *= (2.6 + 1.05 * S.cols.filter(C => C.d).length) / 8;
    // the expanded form: "2.305 =" on the left, then the terms in place order
    S.lhs = M.num(W.join('') + '.' + D.join(''), 'num', { col: '#a8d4ee' }); S.eq = M.op('=', 'eq'); S.terms = [];
    const relay = () => { const items = [S.lhs, S.eq]; const tl = S.terms.slice().sort((a, b) => b.p - a.p);
      if (!tl.length) items.push(M.slot('rs', { col: '#7aa8c8' }));
      tl.forEach((q, i) => { if (i) items.push(q.plus); items.push(q.node); });
      const row = M.row(...items), s = Math.min(40, 40 * 300 / Math.max(1, M.lay(row, 40).w)); M.place(g, 'row', row, 180, RY, s, { col: INK }); M.inert(g, ['rs']); };
    relay();
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    M.play(g, {
      moves(g) {
        return S.cols.filter(C => C.d && !C.done).map(C => ({ tap: C.id, busy: 0.1, askAt: 0.4 * T, after: 0.95 * T,
          ask: { v: valNode(C.d, C.p), wrong: [C.p + 1, C.p - 1, C.p >= 0 ? C.p - 2 : C.p + 2].filter(p => p !== C.p && p >= -4 && p <= 2).map(p => valNode(C.d, p)) },
          then(g) { C.done = true; M.inert(g, [C.id]); M.show(g, 0.4 * T); S.point = C; hop(g, 'think'); g.sfx('tap');
            M.circle(g, C.id, { dur: 0.45 * T, col: '#7ae8ff' }); M.indicate(g, 'h' + C.j, { dur: 0.45 * T, sc: 1.3, col: '#ffb21f' }); C.beam = g.t;
            M.tween(g, C.id, { dy: -10, hl: 1 }, 0.3 * T); },
          resolve(g) { M.show(g, 0.95 * T); const ids = { n: 'tn' + C.j, d: 'td' + C.j, f: 'tf' + C.j };
            const nd = valNode(C.d, C.p, ids), top = C.p >= 0 ? nd : nd.n, bot = C.p >= 0 ? null : nd.d;
            if (C.p > 0) top.v = String(C.d); top.alpha = 0; if (bot) { bot.alpha = 0; nd.bar = { t0: g.t + 0.4 * T, dur: 0.3 * T }; } // the bar stays hidden until it draws itself
            const term = { p: C.p, node: nd, plus: M.op('+', 'tp' + C.j, { alpha: 0 }) }; S.terms.push(term); relay();
            for (const q of S.terms) if (q !== term) q.plus.alpha = 1; else if (S.terms.slice().sort((a, b) => b.p - a.p)[0] !== q) M.tween(g, q.plus, { alpha: 1 }, 0.25 * T, { delay: 0.3 * T });
            M.fly(g, { node: M.num(C.d, null, { col: INK }), from: C.id, to: ids.n, dur: 0.38 * T, arc: 30, s0: 62, s1: M.box(g, ids.n).s,
              then(g) { top.alpha = 1; top.pop = g.t; M.tween(g, C.id, { dy: 0, hl: 0 }, 0.25 * T); M.tween(g, C.id, { alpha: 0.45 }, 0.25 * T); g.sfx('pop'); hop(g); } });
            if (bot) M.fly(g, { node: M.num(10 ** -C.p, null, { col: SHELL }), from: 'h' + C.j, to: ids.d, delay: 0.42 * T, dur: 0.42 * T, arc: -30, s0: 20, s1: M.box(g, ids.d).s,
              then(g) { bot.alpha = 1; bot.pop = g.t; M.sparkle(g, ids.f, { n: 9, cols: ['#7ae8ff', '#fff', '#ffe4c8'] }); g.sfx('ding'); hop(g, 'wow'); } });
            else if (C.p > 0) M.at(g, [[0.5 * T, g => { M.roll(g, top, C.d * 10 ** C.p, { dur: 0.3 * T }); M.indicate(g, 'h' + C.j, { dur: 0.35 * T, col: '#ffb21f' }); g.sfx('tap'); }], [0.8 * T, g => { M.sparkle(g, ids.n, { n: 8 }); g.sfx('ding'); hop(g, 'wow'); }]]);
            else M.at(g, [[0.45 * T, g => { M.sparkle(g, ids.n, { n: 8 }); g.sfx('ding'); hop(g, 'wow'); }]]);
            M.at(g, [[0.85 * T, g => { if (S.point === C) S.point = null; if (S.cols.every(q => !q.d || q.done)) { for (const q of S.cols) if (q.d) M.tween(g, q.id, { alpha: 1 }, 0.3 * T); M.indicate(g, 'row', { sc: 1.06, dur: 0.4 * T, col: '#7ae8ff' }); S.cols.filter(q => !q.d).forEach((q, i) => M.circle(g, q.id, { delay: 0.1 * T + i * 0.1 * T, dur: 0.5 * T, col: '#9ab8c8' })); g.sfx('coin'); hop(g, 'laugh'); } }]]);
          } }));
      },
      area(g) { return S.cols.filter(C => C.d && !C.done).map(C => C.id); },
    });
  },
  update(g, dt) { M.update(g, dt); const S = g.s, Mk = S.mk;
    // the classic slip, acted out: a 0 is tapped, and a note shows it is worth nothing
    if (Mk.missAt > (S.lastMiss ?? -1)) { S.lastMiss = Mk.missAt; const id = Mk.missInfo && Mk.missInfo.tap, C = S.cols.find(q => q.id === id);
      if (C && !C.d && C.p < 0) M.note(g, { node: M.row(M.frac(M.num(0), M.num(10 ** -C.p)), M.op('='), M.num(0)), at: C.id, off: [0, 58], s: 24, col: '#ffb0a8', write: 0.3, hold: 0.4, fade: 0.25 }); } },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, Mk = S.mk;
    SCN.bg(g, c, 'reef');
    // the stone tablet with the place-value chart carved into it
    c.drawImage(g.bake('dexp_tab', (cc) => {
      cc.fillStyle = 'rgba(0,20,40,0.35)'; cc.beginPath(); cc.roundRect(20, 192, 328, 278, 26); cc.fill();
      const gr = cc.createLinearGradient(0, 182, 0, 462); gr.addColorStop(0, '#5a7a86'); gr.addColorStop(1, '#3a5662'); cc.fillStyle = gr; cc.beginPath(); cc.roundRect(14, 182, 332, 278, 26); cc.fill();
      cc.strokeStyle = 'rgba(200,240,255,0.25)'; cc.lineWidth = 3; cc.stroke();
      const R = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(5); for (let i = 0; i < 40; i++) { cc.fillStyle = `rgba(${R() < 0.5 ? '20,40,50' : '160,200,210'},0.12)`; cc.beginPath(); cc.arc(20 + R() * 320, 188 + R() * 266, 2 + R() * 7, 0, 7); cc.fill(); }
      cc.fillStyle = '#2e8a5a'; for (const [x, y] of [[22, 454], [334, 460], [300, 188]]) { cc.beginPath(); cc.ellipse(x, y, 16, 7, 0.3, 0, 7); cc.fill(); }
      cc.fillStyle = '#f2a0b8'; for (const [x, y] of [[40, 456], [318, 192]]) { cc.beginPath(); cc.arc(x, y, 5, 0, 7); cc.fill(); }
    }), 0, 0, 360, 640);
    // column grooves, the light beam of the column being worked on, the shell tags
    c.save(); c.strokeStyle = 'rgba(20,40,50,0.45)'; c.lineWidth = 2; for (let j = 1; j < S.cols.length; j++) { const x = (S.cols[j - 1].x + S.cols[j].x) / 2 + (S.cols[j].p === -1 ? 8 : 0); if (S.cols[j].p === -1) continue; c.beginPath(); c.moveTo(x, NY - 50); c.lineTo(x, NY + 22); c.stroke(); } c.restore();
    for (const C of S.cols) if (C.beam != null && t - C.beam < 1.3) { const k = t - C.beam, a = Math.min(1, k * 4) * Math.max(0, 1 - (k - 0.8) / 0.5); const gr = c.createLinearGradient(0, NY - 110, 0, RY); gr.addColorStop(0, `rgba(255,220,150,${0.3 * a})`); gr.addColorStop(1, 'rgba(120,230,255,0)'); c.fillStyle = gr; c.fillRect(C.x - CW / 2 + 6, NY - 110, CW - 12, RY - NY + 110); }
    for (const C of S.cols) { const b = M.box(g, 'h' + C.j); if (!b) continue; const y = b.y, w = 52, h = C.p >= 0 ? 38 : 58, bob = Math.sin(t * 1.5 + C.j) * 1.2;
      c.save(); c.translate(0, bob); c.fillStyle = 'rgba(0,20,40,0.3)'; c.beginPath(); c.ellipse(C.x + 2, y + 4, w / 2, h / 2, 0, 0, 7); c.fill();
      const sg = c.createRadialGradient(C.x - 8, y - 10, 2, C.x, y, w / 2); sg.addColorStop(0, '#fff6ea'); sg.addColorStop(1, SHELL); c.fillStyle = sg; c.beginPath(); c.ellipse(C.x, y, w / 2, h / 2, 0, 0, 7); c.fill();
      c.strokeStyle = 'rgba(200,140,110,0.5)'; c.lineWidth = 1.2; for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(C.x + k * 4, y + h / 2 - 2); c.lineTo(C.x + k * 9, y - h / 2 + 4); c.stroke(); } c.restore();
      c.save(); c.translate(0, bob); M.drawEx(g, c, 'h' + C.j); c.restore(); }
    // the carved digits, the decimal point, and the expanded form
    for (const C of S.cols) M.drawEx(g, c, C.id);
    c.fillStyle = INK; c.beginPath(); c.arc(S.ptX, NY - 4, 5.5, 0, 7); c.fill();
    c.strokeStyle = 'rgba(200,240,255,0.25)'; c.lineWidth = 2; c.beginPath(); c.moveTo(34, NY + 52); c.lineTo(326, NY + 52); c.stroke();
    // a fraction whose 10 has not landed yet shows no bar until the bar draws itself
    M.drawEx(g, c, 'row');
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', hk = Mk.lastMove != null && t - Mk.lastMove < 0.35 ? Math.sin((t - Mk.lastMove) / 0.35 * Math.PI) : 0;
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'octopus', OX, OY - hk * 20, 1.25, { t, pose, expr }); else SCN.host(g, c, 'octopus', OX, OY, 1.25);
    M.drawUI(g, c);
  },
});
