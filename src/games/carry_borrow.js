// carry_borrow.js — BORROW! Column subtraction, right to left, borrowing a ten from the next column when needed.
// 52 − 27 on a chalkboard: one swipe down a column (a tap counts too) does that column. When its top digit is smaller
// than the bottom digit, a ten is borrowed right on the problem first: the next column's top digit is crossed out and
// one less is written above it (5 → 4), and a small 1 makes this column's top 12. Then 12 − 7 = 5 drops into the
// answer. Right to left is the only valid order; a swipe on a column further left only wobbles.
// Level 0: 2-digit, one borrow. Level 1: 3-digit, one borrow. Level 2: 3-digit, two borrows.
// Medium mode: the swipe writes the column's subtraction ("12 − 7") in its answer place and the tray asks for it.
const M = MK, PANEL = 'chalk', INK = SCN.ink(PANEL), BOR = '#ffb070', Y_BOR = 222, Y_TOP = 276, Y_BOT = 336, Y_LINE = 356, Y_ANS = 408, SZ = 48, CW = 66;
const colX = (n, j) => 180 + 14 + ((n - 1) / 2 - j) * CW;
function pick(g) {
  const L = g.level, n = L === 0 ? 2 : 3, r = k => Math.floor(g.rand() * k), want = L === 0 ? [0] : L === 1 ? [g.rand() < 0.5 ? 0 : 1] : [0, 1];
  for (;;) {
    const A = [...Array(n)].map(() => 1 + r(9)), B = [...Array(n)].map(() => r(10)); B[n - 1] = 1 + r(8);
    const top = A.slice(); let ok = true; const borrows = [];
    for (let j = 0; j < n; j++) { if (top[j] < B[j]) { if (j === n - 1 || top[j + 1] < 1) { ok = false; break; } borrows.push(j); top[j + 1]--; top[j] += 10; } }
    if (!ok || top[n - 1] - B[n - 1] < 1 || borrows.join() !== want.join()) continue;
    if (B.slice(0, n - 1).every(v => v === 0)) continue;
    return { n, A, B };
  }
}

MG.add({
  id: 'borrow', stage: 'carry', cmd: 'BORROW!', hint: 'swipe', time: 9, mood: 'bright', winText: 'Subtracted!', hold: 1.4,
  card: {
    title: 'Regrouping to subtract', ref: 'Grade 3', kind: 'Subtraction',
    text: 'In column subtraction you write the bigger number on top, with the digits lined up in columns. Then you subtract one column at a time, starting with the ones column on the right.\n\nSometimes the top digit is smaller than the bottom digit. In 52 − 27, the ones column is 2 − 7, and 2 is smaller than 7. So you borrow a ten from the tens column: the 5 tens become 4 tens, and the 2 ones become 12 ones. Now 12 − 7 = 5. The tens column is 4 − 2 = 2. So 52 − 27 = 25.\n\nBorrowing does not change the number, because 5 tens and 2 ones is the same as 4 tens and 12 ones. This is also called regrouping.',
    note: 'Start with the ones column. When the top digit is too small, take 1 from the top digit of the next column on the left and add 10 to this column.',
    ask: 'What is 63 − 28? What is 425 − 183?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const n = S.n;
    S.top = S.A.slice(); S.next = 0; S.strike = []; S.swipe = null;
    const inert = ['minus'];
    M.place(g, 'minus', M.op('-', 'minus'), colX(n, n - 1) - 54, Y_BOT, SZ, { col: INK });
    for (let j = 0; j < n; j++) {
      const x = colX(n, j);
      M.place(g, 'tt' + j, M.num(S.A[j], 't' + j), x, Y_TOP, SZ, { col: INK });
      M.place(g, 'bb' + j, M.num(S.B[j], 'b' + j), x, Y_BOT, SZ, { col: INK });
      M.place(g, 'rr' + j, M.num(0, 'r' + j, { hide: true }), x, Y_BOR, 28, { col: BOR }); // the new top digit after lending
      M.place(g, 'oo' + j, M.num(1, 'o' + j, { hide: true }), x - 24, Y_TOP - 26, 24, { col: BOR }); // the small borrowed 1
      M.place(g, 'aa' + j, M.num(0, 'a' + j, { hide: true }), x, Y_ANS, SZ, { col: '#fff2b0' });
      inert.push('t' + j, 'b' + j, 'r' + j, 'o' + j, 'a' + j);
      M.zone(g, 'col' + j, { x, y: (Y_BOR - 20 + Y_ANS + 16) / 2, w: CW - 6, h: Y_ANS + 16 - (Y_BOR - 20) });
    }
    M.inert(g, inert);
    g.dur *= (2.6 + 1.05 * n) / 8;
    M.play(g, {
      moves(g) {
        const j = S.next; if (j >= n) return [];
        const b = S.B[j], needs = S.top[j] < b, top = needs ? S.top[j] + 10 : S.top[j], diff = top - b;
        return [{ tap: 'col' + j, busy: 0.1, askAt: 0, after: 0.1, ask: { v: diff, wrong: [Math.abs(S.A[j] - b), diff + 1, diff - 1, needs ? diff + 10 : diff + 2].filter(w => w >= 0) },
          then(g) {
            S.swipe = { j, t0: g.t }; g.sfx('whoosh');
            if (needs) { // borrow a ten from the next column, right on the problem
              S.top[j + 1]--; S.strike[j + 1] = g.t; const rn = M.node(g, 'r' + (j + 1)); rn.v = String(S.top[j + 1]); rn.hide = false; rn.pop = g.t; M.relayout(g, 'rr' + (j + 1));
              const rj = M.node(g, 'r' + j);
              if (!rj.hide) { rj.v = String(top); rj.pop = g.t; M.relayout(g, 'rr' + j); } else { const o = M.node(g, 'o' + j); o.hide = false; o.pop = g.t; }
              S.top[j] = top; g.sfx('snap');
            }
            if (g.mode === 'medium') { const e = M.row(M.num(top), M.op('-'), M.num(b)); e.id = 'e' + j; M.place(g, 'ee' + j, e, colX(n, j), Y_ANS - 8, 22, { col: '#fff2b0' }); M.inert(g, ['e' + j]); }
          },
          resolve(g) {
            const e = M.node(g, 'e' + j); if (e) e.hide = true;
            const a = M.node(g, 'a' + j); a.v = String(diff); a.hide = j === n - 1 && diff === 0; a.pop = g.t; M.relayout(g, 'aa' + j);
            const K = g.s.mk; delete K.zones['col' + j]; delete K.box['col' + j];
            for (const id of ['t' + j, 'b' + j, 'r' + j, 'o' + j]) { const q = M.node(g, id); if (q) q.alpha = 0.6; }
            S.next = j + 1; g.sfx('coin'); g.burst(colX(n, j), Y_ANS - 16, ['#fff2b0', '#ffb070', '#fff'], 10, 120);
          } }];
      },
      area(g) { return S.next < S.n ? 'col' + S.next : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  // a press in a column zone and a swipe down it (or a plain tap) does that column; the kit treats both as a tap
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) {
    const K = g.s.mk; if (g.done) return;
    if (K.ask || K.busyT > 0 || g.t - K.moveT < 0.3) return M.auto(g, dt, synth);
    const j = g.s.next; if (j >= g.s.n) return; const x = colX(g.s.n, j);
    synth('down', x, Y_TOP - 20); for (let i = 1; i <= 4; i++) synth('move', x + 1, Y_TOP - 20 + i * 30); synth('up', x + 1, Y_TOP + 100);
    K.moveT = g.t + 5;
  },
  draw(g, c) {
    const S = g.s, t = g.t, n = S.n, K = S.mk;
    SCN.std(g, c, { scene: 'snow', panel: PANEL, panelY: 316, panelH: 262, host: 'penguin', hostX: 290, hostY: 596, hostS: 1.35 });
    // the line under the bottom number, in chalk
    const xl = colX(n, n - 1) - 80, xr = colX(n, 0) + 30; c.save(); c.strokeStyle = 'rgba(251,248,238,0.9)'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(xl, Y_LINE); c.lineTo(xr, Y_LINE + 1.5); c.stroke(); c.restore();
    // the player's swipe leaves a chalk-dust streak; a fresh swipe glows down the column
    const P0 = K.press; if (P0 && /^col/.test(P0.id)) { c.save(); c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); c.moveTo(P0.x0, P0.y0); c.lineTo(P0.x0, Math.max(P0.y0, P0.y)); c.stroke(); c.restore(); }
    const q = S.swipe; if (q && t - q.t0 < 0.3) { const k = M.ease((t - q.t0) / 0.3), x = colX(n, q.j); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(120,110,70,${0.5 * (1 - k)})`; c.fillRect(x - 28, Y_BOR - 24, 56, (Y_ANS + 14 - Y_BOR + 24) * k); c.restore(); }
    for (let j = 0; j < n; j++) { M.drawEx(g, c, 'tt' + j); M.drawEx(g, c, 'bb' + j); M.drawEx(g, c, 'rr' + j); M.drawEx(g, c, 'oo' + j); M.drawEx(g, c, 'aa' + j); M.drawEx(g, c, 'ee' + j); }
    M.drawEx(g, c, 'minus');
    // a crossed-out top digit, after it lent a ten
    S.strike.forEach((t0, j) => { if (t0 == null) return; const b = M.box(g, 't' + j); if (!b) return; const k = M.ease((t - t0) / 0.2);
      c.save(); c.strokeStyle = BOR; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(b.x - 16, b.y + 18); c.lineTo(b.x - 16 + 32 * k, b.y + 18 - 36 * k); c.stroke(); c.restore(); });
    M.drawUI(g, c);
  },
});
