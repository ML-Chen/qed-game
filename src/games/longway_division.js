// longway_division.js — LONG DIVISION! Divide a number by one digit, one digit at a time, left to right.
// 84 ÷ 4 is written in a notebook in the long-division layout: the divisor outside the bracket, the dividend under the
// bar. The player drags the divisor onto each digit of the dividend in turn, left to right. Each drop writes that
// digit's quotient digit above it at once (8 ÷ 4 = 2 above the 8). When something is left over, the remainder hops
// down by itself as a small red digit in front of the next digit (7 ÷ 3 = 2, and the 1 left over makes the next 2 a 12).
// Dropping on a digit further right (out of order) only wobbles.
// Level 0: two digits with nothing left over (84 ÷ 4). Level 1: two digits with one remainder (72 ÷ 3).
// Level 2: three digits (852 ÷ 4).
// Medium mode: each drop puts a "?" above the digit and the tray asks for the quotient digit.
const M = MK, PANEL = 'paper', INK = SCN.ink(PANEL), RED = '#d8454a', Y_Q = 252, Y_DIV = 334, SZ = 54, CW = 52;

function pick(g) {
  const r = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), L = g.level;
  for (;;) {
    const d = L === 0 ? r(2, 4) : L === 1 ? r(3, 6) : r(2, 5), q = L === 2 ? r(100, 330) : r(11, 49), D = q * d;
    const digs = String(D).split('').map(Number); if (digs.length !== (L === 2 ? 3 : 2) || digs[0] < d) continue;
    let rem = 0; const steps = digs.map(x => { const cur = rem * 10 + x, qd = Math.floor(cur / d); rem = cur - qd * d; return { cur, qd, rem }; });
    const rems = steps.slice(0, -1).filter(s => s.rem > 0).length;
    if (L === 0 ? rems === 0 : rems >= 1) return { d, D, digs, steps, q };
  }
}

MG.add({
  id: 'longway_division', stage: 'longway', cmd: 'LONG DIVISION!', hint: 'drag', time: 8, mood: 'bright', winText: 'Divided!', hold: 1.4,
  card: {
    title: 'Long division', ref: 'Grade 4–5', kind: 'Division',
    text: 'Long division splits a number into equal groups one digit at a time, from left to right. In 84 ÷ 4, the number being divided (84) goes under the bar and the number you divide by (4) goes outside.\n\nStart with the left digit: 8 ÷ 4 = 2, so write 2 above the 8. Then 4 ÷ 4 = 1, so write 1 above the 4. The answer, called the quotient, is 21.\n\nSometimes a digit does not divide evenly. In 72 ÷ 3, 7 ÷ 3 = 2 with 1 left over. That 1 is a ten, which is 10 ones, so it joins the next digit to make 12. Then 12 ÷ 3 = 4, so 72 ÷ 3 = 24.\n\nThis works because 84 is 8 tens and 4 ones. Dividing each part by 4 gives 2 tens and 1 one, which is 21.',
    note: 'Divide one digit at a time, from left to right. Write each answer above its digit, and carry anything left over to the next digit as tens.',
    ask: 'What is 96 ÷ 3? What is 75 ÷ 5?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const n = S.digs.length; S.next = 0;
    S.cx = k => 196 + (k - (n - 1) / 2) * CW;
    M.place(g, 'dvp', M.num(S.d, 'dv'), S.cx(0) - 76, Y_DIV, SZ, { col: INK });
    S.digs.forEach((v, k) => {
      M.place(g, 'dd' + k, M.num(v, 'd' + k), S.cx(k), Y_DIV, SZ, { col: INK });
      M.place(g, 'qq' + k, M.num(S.steps[k].qd, 'q' + k, { hide: true }), S.cx(k), Y_Q, SZ, { col: INK });
      M.place(g, 'rr' + k, M.num(0, 'rm' + k, { hide: true }), S.cx(k) - 22, Y_DIV - 36, 24, { col: RED });
    });
    M.inert(g, S.digs.flatMap((v, k) => ['q' + k, 'rm' + k]));
    g.dur *= (2.6 + 1.05 * n) / 8;
    M.play(g, {
      moves(g) {
        const k = S.next; if (k >= n) return [];
        const st = S.steps[k], qn = M.node(g, 'q' + k);
        return [{ drag: 'dv', to: ['d' + k, 'q' + k], busy: 0.1, askAt: 0, after: 0.1,
          ask: { v: st.qd, wrong: [st.qd + 1, st.qd - 1, st.rem, st.cur - S.d].filter(w => w >= 0) },
          then(g) { S.next++; S.hopAt = g.t; S.hopK = k; g.sfx('whoosh'); if (g.mode === 'medium') { qn.v = '?'; qn.hide = false; qn.col = M.MID; qn.pop = g.t; } },
          resolve(g) {
            qn.v = String(st.qd); qn.hide = false; qn.col = null; qn.pop = g.t; g.sfx('coin');
            if (st.rem > 0 && k + 1 < n) { const rn = M.node(g, 'rm' + (k + 1)); rn.v = String(st.rem); rn.hide = false; rn.pop = g.t + 0.08; M.relayout(g, 'rr' + (k + 1)); g.sfx('pop'); }
            const b = M.box(g, 'q' + k); if (b) g.burst(b.x, b.y, ['#ffd45a', '#7ad0ff', '#fff'], 8, 90);
          } }];
      },
      area(g) { return S.next < n ? ['dv', 'd' + S.next] : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, n = S.digs.length;
    SCN.std(g, c, { scene: 'library', panel: PANEL, panelY: 292, panelH: 196, host: 'owl', hostX: 290, hostY: 600, hostS: 1.3 });
    // the long-division bracket: a curved stroke and the bar over the dividend
    const bx = S.cx(0) - 38, top = Y_Q + 16, right = S.cx(n - 1) + 34;
    c.save(); c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(right, top); c.lineTo(bx, top); c.quadraticCurveTo(bx + 16, (top + Y_DIV + 14) / 2, bx - 4, Y_DIV + 16); c.stroke(); c.restore();
    // the digit being worked on gets a soft highlighter stripe; done digits get a pencil tick of colour
    for (let k = 0; k < n; k++) { const b = M.box(g, 'd' + k); if (!b) continue;
      if (k < S.next) { c.fillStyle = 'rgba(120,200,140,0.22)'; c.fillRect(b.x - CW / 2 + 4, Y_Q - 46, CW - 8, Y_DIV - Y_Q + 54); }
      else if (k === S.next && !g.done) { c.fillStyle = `rgba(255,220,90,${0.25 + 0.1 * Math.sin(t * 5)})`; c.fillRect(b.x - CW / 2 + 4, Y_DIV - 46, CW - 8, 54); } }
    M.drawEx(g, c, 'dvp');
    for (let k = 0; k < n; k++) { M.drawEx(g, c, 'dd' + k); M.drawEx(g, c, 'qq' + k); M.drawEx(g, c, 'rr' + k); }
    M.drawUI(g, c);
  },
});
