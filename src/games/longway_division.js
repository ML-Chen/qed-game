// longway_division.js — LONG DIVISION! Divide a number by one digit in the long-division layout, acting out
// "divide, multiply, subtract, bring down" for each digit (show your work).
// The player drags the divisor onto the part of the dividend being divided (the first digit, then each number that a
// bring-down makes). The working then plays by itself:
//   divide:    the divisor and the current part are circled, a pencil note "7 ÷ 3" writes itself beside it, and the
//              quotient digit writes itself on top (medium mode: the tray asks for it);
//   multiply:  the quotient digit and the divisor light up, "2 × 3 = 6" writes itself beside the next row, and the 6
//              writes itself under the current part;
//   subtract:  a minus sign and the subtraction line draw themselves, "7 − 6 = 1" writes itself, and the difference
//              writes in under the line;
//   bring down: the next dividend digit lights up, an arrow draws itself straight down, and the digit drops along it
//              to sit beside the difference (a leading 0 fades away), making the next number to divide.
// The owl on the shelf points at the work and hops on each landing; a songbird on the page hops and tweets.
// Dropping the divisor on a digit further right (out of order) only wobbles.
// Level 0: two digits with nothing left over (84 ÷ 4). Level 1: two digits with a remainder to carry (72 ÷ 3).
// Level 2: three digits (852 ÷ 4).
const M = MK, PANEL = 'paper', INK = SCN.ink(PANEL), NOTE = '#2f6fd0', RED = '#e0573a', HX = 58, HY = 604;

function pick(g) {
  const r = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), L = g.level;
  for (;;) {
    const d = L === 0 ? r(2, 4) : L === 1 ? r(3, 6) : r(2, 5), q = L === 2 ? r(100, 330) : r(11, 49), D = q * d;
    const digs = String(D).split('').map(Number); if (digs.length !== (L === 2 ? 3 : 2) || digs[0] < d) continue;
    let rem = 0; const steps = digs.map(x => { const cur = rem * 10 + x, qd = Math.floor(cur / d); rem = cur - qd * d; return { cur, qd, p: qd * d, rem }; });
    const rems = steps.slice(0, -1).filter(s => s.rem > 0).length;
    if (L === 0 ? rems === 0 : rems >= 1) return { d, D, digs, steps, q };
  }
}

MG.add({
  id: 'longway_division', stage: 'longway', cmd: 'LONG DIVISION!', hint: 'drag', time: 8, mood: 'bright', winText: 'Divided!', hold: 1.4,
  card: {
    title: 'Long division', ref: 'Grade 4–5', kind: 'Division',
    text: 'Long division splits a number into equal groups one digit at a time, from left to right. In 72 ÷ 3, the number being divided (72) goes under the bar and the number you divide by (3) goes outside.\n\nEach digit gets four steps: divide, multiply, subtract, bring down. 7 ÷ 3 is 2, so write 2 on top. 2 × 3 = 6, so write 6 under the 7. 7 − 6 = 1 is left over. Bring the 2 down next to the 1 to make 12. Then 12 ÷ 3 = 4, 4 × 3 = 12 and 12 − 12 = 0. So 72 ÷ 3 = 24.\n\nThe 1 left over is 1 ten, which is 10 ones. That is why it joins the 2 to make 12.',
    note: 'Divide, multiply, subtract, bring down. Repeat until every digit has been brought down.',
    ask: 'What is 96 ÷ 4? What is 75 ÷ 5?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const n = S.digs.length, mk = S.mk;
    // sizes: three digits need eight rows, so they are a little smaller
    const G = S.G = n > 2 ? { big: 42, ws: 34, rh: 36, cw: 44, x0: 106, yq: 228, yd: 278, ns: 22 } : { big: 48, ws: 40, rh: 44, cw: 50, x0: 130, yq: 236, yd: 296, ns: 25 };
    const cx = S.cx = k => G.x0 + k * G.cw, rowY = S.rowY = r => G.yd + r * G.rh, NX = cx(n - 1) + G.cw / 2 + 18;
    G.top = G.yq - G.big - 14; G.bot = rowY(2 * n) + 18;
    const put = (key, nd, x, y, s, col) => M.place(g, key, nd, x, y, s, { col });
    put('dvp', M.num(S.d, 'dv'), cx(0) - G.cw / 2 - 34, G.yd, G.big, INK);
    S.digs.forEach((v, k) => {
      const st = S.steps[k];
      put('dd' + k, M.num(v, 'd' + k), cx(k), G.yd, G.big, INK);
      put('qq' + k, M.num(st.qd, 'q' + k, { hide: true }), cx(k), G.yq, G.big, INK);
      const ps = String(st.p); [...ps].forEach((ch, j) => put(`P${k}_${j}`, M.num(ch, `p${k}_${j}`, { hide: true }), cx(k - ps.length + 1 + j), rowY(2 * k + 1), G.ws, INK));
      put('DF' + k, M.num(st.rem, 'df' + k, { hide: true }), cx(k), rowY(2 * k + 2), G.ws, INK);
      if (k + 1 < n) put('BD' + (k + 1), M.num(S.digs[k + 1], 'bd' + (k + 1), { hide: true }), cx(k + 1), rowY(2 * k + 2), G.ws, INK);
    });
    M.inert(g, S.digs.flatMap((v, k) => ['q' + k, 'df' + k, 'bd' + k, ...[0, 1].map(j => `p${k}_${j}`)]));
    S.lines = []; S.next = 0; S.face = 'happy'; S.faceT = -9; S.hopAt = -9; S.birdAt = -9;
    g.dur *= (2.6 + 1.05 * n) / 8;
    const node = id => M.node(g, id);
    const face = (e, hop = true) => { S.face = e; S.faceT = g.t; if (hop) S.hopAt = g.t; };
    // a pencil note, left-aligned beside row r of the working; it writes itself and stays until noteOff
    const noteOn = (key, nd, r, dur) => { const y = (r < 0 ? G.yd : rowY(r)) - G.ws * 0.02; M.place(g, key, nd, NX, y, G.ns, { col: NOTE, left: true }); M.writeIn(g, nd, { dur }); };
    const noteOff = (key, delay, dur) => { const e = mk.ex[key]; if (!e) return; M.tween(g, e.node, { alpha: 0 }, dur, { delay }); M.at(g, [[delay + dur + 0.02, g => { if (mk.ex[key] === e) delete mk.ex[key]; }]]); };
    const writeDigit = (id, dur) => { const q = node(id); if (!q) return; q.hide = false; q.alpha = 1; M.writeIn(g, q, { dur }); };
    // the ids that make up the number being divided at step k (the leftover and the digit brought down)
    S.curIds = k => k === 0 ? ['d0'] : S.steps[k - 1].rem > 0 ? ['df' + (k - 1), 'bd' + k] : ['bd' + k];

    const stepMove = k => {
      const st = S.steps[k], last = k === n - 1, qn = node('q' + k), cur = S.curIds(k), ps = String(st.p);
      const prodIds = [...ps].map((_, j) => `p${k}_${j}`), divRow = k === 0 ? -1 : 2 * k;
      // One idea at a time: each note is fully written, then stays still for about 0.9 s before the next one starts.
      // Beat times (× pace): quotient 0–0.7, multiply 1.35–2.8, subtract 2.8–4.25, bring down 4.25–4.8.
      const T0 = M.pace(g), askAt = 0.5 * T0, after = (last ? 4.4 : 4.95) * T0;
      return { busy: 0.1, askAt, after, ask: { v: st.qd, wrong: [st.qd + 1, st.qd - 1, st.rem, st.cur - S.d, st.p].filter(w => w >= 0 && w !== st.qd) },
        then(g) {
          const T = M.pace(g); S.next = k + 1; S.point = true; M.show(g, askAt); face('think', false); g.sfx('whoosh');
          // divide: circle the divisor and the part being divided, and write "7 ÷ 3" beside it
          M.circle(g, 'dv', { dur: 0.5 * T, col: '#ffb21f' }); M.circle(g, cur, { dur: 0.5 * T, delay: 0.06 * T, col: '#ffb21f' });
          for (const id of ['dv', ...cur]) M.light(g, id, { dur: 0.2 * T });
          // the note's "= 2" waits, hidden, until the division is worked out
          S.ndEq = M.row(M.op('='), M.num(st.qd, 'nq' + k)); S.ndEq.hide = true;
          noteOn('nd' + k, M.row(M.num(st.cur), M.op('÷'), M.num(S.d), S.ndEq), divRow, 0.3 * T);
          if (g.mode === 'medium') { qn.v = '?'; qn.hide = false; qn.col = M.MID; qn.pop = g.t; }
        },
        resolve(g) {
          const T = M.pace(g); M.show(g, after);
          // "= 2" writes itself into the note, and the 2 flies up onto the bar
          const eq = S.ndEq; eq.hide = false; M.relayout(g, 'nd' + k); M.writeIn(g, eq, { dur: 0.2 * T }); g.sfx('tap');
          qn.v = String(st.qd); qn.col = null; qn.hide = true;
          M.at(g, [[0.35 * T, g => { const b = M.box(g, 'nq' + k); if (!b) return; M.tween(g, 'nq' + k, { alpha: 0.3 }, 0.12 * T);
            M.fly(g, { node: M.num(st.qd, null, { col: NOTE }), from: [b.x, b.y], to: 'q' + k, dur: 0.35 * T, arc: 30, s0: G.ns, s1: G.big,
              then(g) { qn.hide = false; qn.alpha = 1; qn.pop = g.t; M.indicate(g, qn, { dur: 0.3 * T, sc: 1.25 }); M.sparkle(g, qn); g.sfx('ding'); } }); }]]);
          noteOff('nd' + k, 1.15 * T, 0.2 * T);
          for (const id of ['dv', ...cur]) M.unlight(g, id, { delay: 1.1 * T });
          M.at(g, [
            [0.75 * T, g => face('wow')],
            // multiply: quotient digit × divisor, written under the part being divided
            [1.35 * T, g => { M.light(g, qn, { col: NOTE }); M.light(g, 'dv', { col: NOTE });
              noteOn('nm' + k, M.row(M.num(st.qd), M.op('×'), M.num(S.d), M.op('='), M.num(st.p)), 2 * k + 1, 0.3 * T); g.sfx('tap'); }],
            [1.75 * T, g => { prodIds.forEach((id, j) => { writeDigit(id, 0.2 * T); M.indicate(g, id, { delay: 0.16 * T + j * 0.05 * T, dur: 0.3 * T, sc: 1.2, col: NOTE }); }); S.birdAt = g.t; }],
            [2.5 * T, g => { M.unlight(g, qn); M.unlight(g, 'dv'); }],
            [2.6 * T, g => noteOff('nm' + k, 0, 0.2 * T)],
            // subtract: a minus sign and the line draw themselves under the product, then "7 − 6 = 1"
            [2.8 * T, g => { const x0 = S.cx(k + 1 - Math.max(ps.length, cur.length)) - G.cw / 2 + 6, x1 = S.cx(k) + G.cw / 2 - 6;
              S.lines.push({ x0, x1, y: S.rowY(2 * k + 1) + G.ws * 0.24, mx: x0 - 12, my: S.rowY(2 * k + 1) - G.ws * 0.3, t0: g.t, dur: 0.25 * T });
              noteOn('ns' + k, M.row(M.num(st.cur), M.op('−'), M.num(st.p), M.op('='), M.num(st.rem)), 2 * k + 2, 0.3 * T); g.sfx('swoosh'); }],
            [3.2 * T, g => { writeDigit('df' + k, 0.2 * T); M.indicate(g, 'df' + k, { delay: 0.16 * T, dur: 0.3 * T, sc: 1.25 }); M.sparkle(g, 'df' + k, { delay: 0.18 * T, n: 6 }); face('happy'); g.sfx('pop'); }],
            [4.05 * T, g => noteOff('ns' + k, 0, 0.2 * T)],
            ...(last ? [
              // done: the quotient lights up digit by digit
              [3.9 * T, g => { S.point = false; S.digs.forEach((_, j) => { M.indicate(g, 'q' + j, { delay: j * 0.1 * T, dur: 0.35 * T, sc: 1.25, col: '#3aa860' }); M.sparkle(g, 'q' + j, { delay: j * 0.1 * T + 0.1 * T, n: 8 }); }); face('laugh'); S.birdAt = g.t; g.sfx('sparkle'); }],
            ] : [
              // bring down: the next digit lights up and drops down along an arrow beside the difference
              [4.25 * T, g => { const dn = 'd' + (k + 1), bd = node('bd' + (k + 1)), a = M.box(g, dn), b = M.box(g, 'bd' + (k + 1));
                M.light(g, dn, { col: RED, dur: 0.15 * T });
                M.arrow(g, [a.x, a.y + a.h / 2 + 6], [b.x, b.y - b.h / 2 - 8], { dur: 0.3 * T, bend: 16, col: RED, linger: 0.5 * T });
                M.fly(g, { node: M.num(S.digs[k + 1], null, { col: INK }), from: [a.x, a.y], to: [b.x, b.y], delay: 0.14 * T, dur: 0.4 * T, arc: 0, s0: G.big, s1: G.ws,
                  then(g) { bd.hide = false; bd.alpha = 1; bd.pop = g.t; M.sparkle(g, bd, { n: 8, cols: ['#ffd45a', '#fff', '#ff9a7a'] }); M.unlight(g, dn, { dur: 0.3 * T }); face('wow'); S.birdAt = g.t; g.sfx('tweet');
                    if (st.rem === 0) M.tween(g, 'df' + k, { alpha: 0 }, 0.25 * T); } }); }],
            ]),
          ]);
        } };
    };

    M.play(g, {
      moves(g) {
        const k = S.next; if (k >= n) return [];
        const cur = S.curIds(k), r = k === 0 ? -1 : 2 * k, y = r < 0 ? G.yd : S.rowY(r), c0 = k + 1 - cur.length;
        const area = [S.cx(c0) - G.cw / 2 - 6, (k === 0 ? G.yq : y) - G.big * 0.9, S.cx(k) + G.cw / 2 + 4, y + 16];
        return [{ ...stepMove(k), drag: 'dv', to: k === 0 ? ['d0', 'q0'] : [...cur.slice().reverse(), 'd' + k, 'q' + k], area }];
      },
      area(g) { return S.next < n ? ['dv', ...S.curIds(S.next)] : null; },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    if (S.mk.missAt >= 0 && S.mk.missAt !== S.seenMiss) { S.seenMiss = S.mk.missAt; S.face = 'sad'; S.faceT = g.t; }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, G = S.G, t = g.t, n = S.digs.length, mk = S.mk;
    SCN.std(g, c, { scene: 'library', panel: PANEL, panelY: (G.top + G.bot) / 2, panelH: G.bot - G.top });
    // the long-division bracket: the bar over the dividend and its curved left side
    const bx = S.cx(0) - G.cw / 2 - 6, top = G.yq + 14, right = S.cx(n - 1) + G.cw / 2 + 4;
    c.save(); c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(right, top); c.lineTo(bx, top); c.quadraticCurveTo(bx + 14, (top + G.yd + 14) / 2, bx - 4, G.yd + 14); c.stroke();
    // subtraction lines and minus signs draw themselves
    for (const L of S.lines) { const k = M.easeIO((t - L.t0) / L.dur); if (k <= 0) continue;
      c.globalAlpha = Math.min(1, k * 2); c.lineWidth = 3; c.beginPath(); c.moveTo(L.mx - 6, L.my); c.lineTo(L.mx + 6, L.my); c.stroke();
      c.globalAlpha = 1; c.beginPath(); c.moveTo(L.x0, L.y); c.lineTo(M.lerp(L.x0, L.x1, k), L.y); c.stroke();
      if (k < 1) { c.fillStyle = '#fffbe0'; c.shadowColor = M.HL; c.shadowBlur = 10; c.beginPath(); c.arc(M.lerp(L.x0, L.x1, k), L.y, 3, 0, 7); c.fill(); c.shadowBlur = 0; } }
    c.restore();
    for (const key of Object.keys(mk.ex)) M.drawEx(g, c, key);
    // the songbird perched on the corner of the page: it hops and sings when a digit lands
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const bk = (t - S.birdAt) / 0.4, bh = bk >= 0 && bk <= 1 ? Math.sin(bk * Math.PI) : 0;
    if (typeof ANI !== 'undefined') ANI.draw(c, 'bird', 318, G.top + 4 - bh * 16, 0.8, { t, pose: won ? 'cheer' : bh > 0 ? 'hop' : 'idle', expr: won || bh > 0 ? 'laugh' : 'happy', facing: -1 });
    // the owl on the shelf points at the work while it is shown and hops on each beat
    const hk = (t - S.hopAt) / 0.35, hop = hk >= 0 && hk <= 1 ? Math.sin(hk * Math.PI) : 0;
    const expr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.7 ? S.face : 'happy';
    const pose = won ? 'cheer' : hop > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', HX, HY - hop * 22, 1.3, { t, pose, expr, facing: 1 }); else SCN.host(g, c, 'owl', HX, HY, 1.3);
    M.drawUI(g, c);
  },
});
