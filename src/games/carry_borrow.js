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
    S.top = S.A.slice(); S.next = 0; S.swipe = null; S.note = null; S.point = false;
    S.topNode = j => { const r = M.node(g, 'r' + j); return r && !r.hide ? r : M.node(g, 't' + j); }; // the column's current top digit
    const inert = ['minus'];
    M.place(g, 'minus', M.op('-', 'minus'), colX(n, n - 1) - 54, Y_BOT, SZ, { col: INK });
    for (let j = 0; j < n; j++) {
      const x = colX(n, j);
      M.place(g, 'tt' + j, M.num(S.A[j], 't' + j), x, Y_TOP, SZ, { col: INK });
      M.place(g, 'bb' + j, M.num(S.B[j], 'b' + j), x, Y_BOT, SZ, { col: INK });
      M.place(g, 'rr' + j, M.num(0, 'r' + j, { hide: true }), x, Y_BOR, 28, { col: BOR }); // the new top digit after lending
      M.place(g, 'aa' + j, M.num(0, 'a' + j, { hide: true }), x, Y_ANS, SZ, { col: '#fff2b0' });
      inert.push('t' + j, 'b' + j, 'r' + j, 'a' + j);
      M.zone(g, 'col' + j, { x, y: (Y_BOR - 20 + Y_ANS + 16) / 2, w: CW - 6, h: Y_ANS + 16 - (Y_BOR - 20) });
    }
    M.inert(g, inert);
    g.dur *= (2.6 + 1.05 * n) / 8;
    const hop = (e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    M.play(g, {
      moves(g) {
        const j = S.next; if (j >= n) return [];
        const b = S.B[j], needs = S.top[j] < b, top = needs ? S.top[j] + 10 : S.top[j], diff = top - b, T = M.pace(g);
        const t0 = needs ? 0.78 : 0.3, ask = t0 + 0.26; // when the note starts writing, and when its "top − b" is written
        return [{ tap: 'col' + j, busy: 0.1, askAt: ask * T, after: 0.78 * T, ask: { v: diff, wrong: [Math.abs(S.A[j] - b), diff + 1, diff - 1, needs ? diff + 10 : diff + 2].filter(w => w >= 0) },
          then(g) {
            S.swipe = { j, t0: g.t }; g.sfx('whoosh'); M.show(g, ask * T); S.point = true;
            const tn = S.topNode(j), bn = M.node(g, 'b' + j);
            M.light(g, tn, { dur: 0.12 * T }); M.tween(g, tn, { sc: 1.2 }, 0.26 * T, { yoyo: true });
            M.light(g, bn, { delay: 0.1 * T, dur: 0.12 * T }); M.tween(g, bn, { sc: 1.2 }, 0.26 * T, { yoyo: true, delay: 0.1 * T });
            if (needs) { // the top digit is too small: borrow a ten from the next column, acted out right on the problem
              const L = j + 1, ln = M.node(g, 't' + L), old = S.top[L]; S.top[L]--; S.top[j] = top;
              M.at(g, [
                [0.14 * T, g => { tn.hlc = '#ff7a6a'; M.tween(g, tn, { dx: 4 }, 0.05 * T, { yoyo: true }); M.tween(g, tn, { dx: -4 }, 0.05 * T, { yoyo: true, delay: 0.06 * T }); hop('think'); g.sfx('boing', { vol: 0.5, pitch: 1.4 }); }],
                [0.24 * T, g => { M.circle(g, 't' + L, { dur: 0.36 * T, col: BOR }); M.strike(g, ln, { delay: 0.04 * T, dur: 0.16 * T, col: BOR }); g.sfx('swoosh'); }],
                [0.36 * T, g => { // the lender's old digit lifts above it and rolls down by one (5 becomes 4)
                  const fb = M.box(g, 't' + L); M.fly(g, { node: M.num(old), from: [fb.x, fb.y], to: 'r' + L, dur: 0.2 * T, arc: 0, s0: SZ, s1: 28, col: BOR,
                    then(g) { const rn = M.node(g, 'r' + L); rn.v = String(old); rn.hide = false; rn.pop = g.t; M.relayout(g, 'rr' + L); M.roll(g, rn, S.top[L], { dur: 0.24 * T }); M.relayout(g, 'rr' + L); M.sparkle(g, 'r' + L, { n: 6, cols: [BOR, '#fff'] }); g.sfx('tap'); } }); }],
                [0.46 * T, g => { // a ten flies over from the lender and sits in front of the small digit (2 becomes 12)
                  const fb = M.box(g, 't' + L), tb = M.box(g, tn.id), sz = tb.s * 0.74, base = tb.y + 0.34 * tb.s, dst = [tb.x - tb.w / 2 - sz * 0.32, base - 0.34 * sz]; g.sfx('whoosh', { pitch: 1.3 });
                  M.fly(g, { node: M.num(1), from: [fb.x + 4, fb.y + 4], to: dst, dur: 0.3 * T, arc: -40, s0: 30, s1: sz, col: BOR,
                    then(g) { M.place(g, 'oo' + j, M.num(1, 'o' + j, { col: BOR, _born: -1, pop: g.t }), dst[0], base, sz, { col: BOR }); M.inert(g, ['o' + j]);
                      M.sparkle(g, 'o' + j, { n: 10, cols: [BOR, '#fff2b0', '#fff'] }); g.sfx('ding'); hop('laugh'); tn.hlc = null; M.indicate(g, M.node(g, 'o' + j), { sc: 1.25, dur: 0.3 * T }); M.tween(g, tn, { sc: 1.25 }, 0.3 * T, { yoyo: true }); } }); }],
              ]);
            }
            // the working note writes itself in the answer row: "12 − 7", then (resolve) "= 5"
            M.at(g, [[t0 * T, g => { S.note = M.row(M.num(top, 'nt'), M.op('-', 'nm'), M.num(b, 'nb'), M.op('=', 'neq', { alpha: 0 }), M.num(diff, 'nd', { alpha: 0 })); S.note.id = 'note';
              const w = M.lay(S.note, 26).w, x = colX(n, j), cx = j ? Math.min(x, x + 26 - w / 2) : Math.min(x, 334 - w / 2);
              M.place(g, 'note', S.note, cx, Y_ANS - 4, 26, { col: '#ffe9a8' }); M.inert(g, ['note', 'nt', 'nm', 'nb', 'neq', 'nd']); M.writeIn(g, S.note, { dur: 0.24 * T }); }]]);
          },
          resolve(g) {
            const T = M.pace(g), K = g.s.mk; M.show(g, 0.78 * T); delete K.zones['col' + j]; delete K.box['col' + j]; S.next = j + 1;
            const eq = M.node(g, 'neq'), nd = M.node(g, 'nd'); for (const q of [eq, nd]) { q.alpha = 1; M.writeIn(g, q, { dur: 0.16 * T }); }
            M.indicate(g, nd, { delay: 0.14 * T, dur: 0.24 * T, sc: 1.35 }); g.sfx('ding'); hop();
            M.at(g, [[0.36 * T, g => { const fb = M.box(g, 'nd'); nd.alpha = 0; g.sfx('swoosh');
                M.fly(g, { node: M.num(diff), from: [fb.x, fb.y], to: 'a' + j, dur: 0.24 * T, arc: 26, s0: 26, s1: SZ, col: '#fff2b0',
                  then(g) { const a = M.node(g, 'a' + j); a.v = String(diff); a.hide = j === n - 1 && diff === 0; a.pop = g.t; M.relayout(g, 'aa' + j); M.sparkle(g, 'a' + j, { n: 12, cols: ['#fff2b0', BOR, '#fff'] });
                    g.sfx('coin'); hop('laugh'); g.burst(colX(n, j), Y_ANS - 16, ['#fff2b0', '#ffb070', '#fff'], 10, 120);
                    for (const id of ['t' + j, 'b' + j, 'r' + j, 'o' + j]) { const q = M.node(g, id); if (q) { M.unlight(g, q, { dur: 0.2 * T }); M.tween(g, q, { alpha: 0.6 }, 0.25 * T); } } } }); }],
              [0.4 * T, g => { M.tween(g, S.note, { alpha: 0 }, 0.2 * T); }],
              [0.7 * T, g => { delete K.ex.note; S.point = false; }]]);
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
    SCN.std(g, c, { scene: 'snow', panel: PANEL, panelY: 316, panelH: 262 });
    // the penguin points at the board while the work is shown, scratches its head at a too-small digit, hops when a step lands
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 && S.face !== 'think' ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'penguin', 290, 596 - (S.face !== 'think' ? hopK * 22 : 0), 1.35, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'penguin', 290, 596, 1.35);
    // the line under the bottom number, in chalk
    const xl = colX(n, n - 1) - 80, xr = colX(n, 0) + 30; c.save(); c.strokeStyle = 'rgba(251,248,238,0.9)'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(xl, Y_LINE); c.lineTo(xr, Y_LINE + 1.5); c.stroke(); c.restore();
    // the player's swipe leaves a chalk-dust streak; a fresh swipe glows down the column
    const P0 = K.press; if (P0 && /^col/.test(P0.id)) { c.save(); c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); c.moveTo(P0.x0, P0.y0); c.lineTo(P0.x0, Math.max(P0.y0, P0.y)); c.stroke(); c.restore(); }
    const q = S.swipe; if (q && t - q.t0 < 0.3) { const k = M.ease((t - q.t0) / 0.3), x = colX(n, q.j); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(120,110,70,${0.5 * (1 - k)})`; c.fillRect(x - 28, Y_BOR - 24, 56, (Y_ANS + 14 - Y_BOR + 24) * k); c.restore(); }
    for (let j = 0; j < n; j++) { M.drawEx(g, c, 'tt' + j); M.drawEx(g, c, 'bb' + j); M.drawEx(g, c, 'rr' + j); M.drawEx(g, c, 'oo' + j); M.drawEx(g, c, 'aa' + j); }
    M.drawEx(g, c, 'note');
    M.drawEx(g, c, 'minus');
    M.drawUI(g, c);
  },
});
