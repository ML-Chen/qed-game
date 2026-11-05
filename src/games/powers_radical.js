// powers_radical.js — SIMPLIFY ROOT! √72 = √(36 · 2) = √36 · √2 = 6√2.
// Dawn over a vegetable garden, seen as a cut through the soil: the root is written in chalk on the dark earth, a row
// of square stones (the perfect squares 4, 9, 16, ... each drawn as its own little k × k grid) lies under it, and a
// loose heap of n pebbles lies below that. A fox watches from its den. Every move's working plays by itself (show your
// work; the fuse stands still meanwhile):
//   1. Drag the biggest perfect square that divides n onto n (or tap its stone): the other stones sink away, n is
//      circled, "72 ÷ 36 = 2" writes itself under it while the pebbles hop out of the heap and lay themselves into
//      2 squares of 6 × 6, square after square, each labelled 36. Then 36 and 2 fly up out of the note into the root,
//      which now reads √(36 · 2).
//   2. Drag the 36 out of the root (or tap it): the radical sign splits in two (√36 · √2), the first square of pebbles
//      turns gold and its bottom side lights up pebble by pebble. Its label rolls from 36 to 6 while "6 · 6 = 36"
//      writes itself under √36, then the 6 flies up into the root, the first radical sign fades and the 36 rolls over
//      to 6: the answer 6√2.
// Wrong moves, acted out: a square that does not divide n ("72 ÷ 16 = 4.5", crossed out); a smaller square that does
// divide ("72 ÷ 9 = 8" and then "8 = 4 · 2": a square is still left inside); trying to take the leftover out ("√2 ≈ 1.41").
// Level 0: n = 8 to 45 (squares 4 and 9). Level 1: squares 16, 25, 36. Level 2: squares 36 to 100.
// Medium mode: n ÷ s² and √(s²) are picked from the tray.
const M = MK;
const CX = 180, EY = 262, ES = 60, INK = '#fff1d6', NOTE = '#ffd27a', CHIPY = 338, PY = 436, GROUND = 206, HX = 50, HY = 630;
const STONE = ['#c8a070', '#b88e5e', '#d6b282'], GOLD = '#ffcf3a';

function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), one = a => a[r(a.length)];
  const [s, rest] = L === 0 ? one([[2, 2], [2, 3], [2, 5], [3, 2], [3, 3], [3, 5]]) : L === 1 ? one([[4, 2], [4, 3], [5, 2], [5, 3], [6, 2], [6, 3]]) : one([[6, 3], [7, 2], [7, 3], [8, 2], [8, 3], [9, 2], [10, 2], [10, 3]]);
  const n = s * s * rest, sq = s * s;
  // five stones: the answer, the smaller squares that also divide n (classic mistakes), then squares that don't divide
  const all = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(k => k * k), chips = [sq];
  for (const q of all) if (q < sq && n % q === 0 && chips.length < 3) chips.push(q);
  for (const q of all.slice().sort((a, b) => Math.abs(a - sq) - Math.abs(b - sq))) if (chips.length < 5 && !chips.includes(q) && n % q) chips.push(q);
  chips.sort((a, b) => a - b);
  return { s, rest, n, sq, chips };
}
const dec = v => Math.abs(Math.round(v * 100) - v * 100) < 1e-9 ? String(Math.round(v * 100) / 100) : (Math.floor(v * 100) / 100).toFixed(2) + '…';

// one pebble (a rounded square stone) centred at x, y
function pebble(c, x, y, sz, rot, col, lit) {
  c.save(); c.translate(x, y); if (rot) c.rotate(rot); const h = sz / 2 - 0.8;
  let base = col; if (lit > 0.01) base = P.mix(col, GOLD, lit);
  c.fillStyle = 'rgba(10,5,0,0.35)'; c.fillRect(-h + 1, -h + 1.6, h * 2, h * 2);
  const gr = c.createLinearGradient(-h, -h, h, h); gr.addColorStop(0, P.shade(base, 0.28)); gr.addColorStop(1, P.shade(base, -0.18));
  c.fillStyle = gr; c.beginPath(); c.roundRect(-h, -h, h * 2, h * 2, Math.max(1.2, sz * 0.22)); c.fill();
  if (lit > 0.01) { c.shadowColor = GOLD; c.shadowBlur = 8 * lit; c.strokeStyle = `rgba(255,240,170,${0.8 * lit})`; c.lineWidth = 1.2; c.stroke(); }
  c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(-h + 1.5, -h + 1.5, h * 0.9, Math.max(1, sz * 0.12));
  c.restore();
}

// the garden at dawn: a strip of sky and garden beds over a deep cut through the soil, with the fox's den at the bottom
function garden(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, GROUND); sk.addColorStop(0, '#f08aa0'); sk.addColorStop(0.55, '#ffc0a0'); sk.addColorStop(1, '#ffe8c0'); c.fillStyle = sk; c.fillRect(0, 0, W, GROUND);
  const sun = c.createRadialGradient(286, GROUND - 6, 4, 286, GROUND - 6, 120); sun.addColorStop(0, 'rgba(255,250,220,0.95)'); sun.addColorStop(0.25, 'rgba(255,236,180,0.5)'); sun.addColorStop(1, 'rgba(255,220,170,0)'); c.fillStyle = sun; c.fillRect(140, 60, 220, GROUND - 60);
  c.fillStyle = '#fff6dc'; c.beginPath(); c.arc(286, GROUND - 2, 24, Math.PI, 0); c.fill();
  P.cloud(c, 60, 58, 0.45, '#ffe6e0', '#f0b0b8', 0.85); P.cloud(c, 210, 130, 0.32, '#fff0e0', '#f4c0b4', 0.8);
  // far hedges, then the soil
  c.fillStyle = '#8a6a8a'; c.beginPath(); c.moveTo(0, GROUND); for (let x = 0; x <= W; x += 12) c.lineTo(x, GROUND - 14 - Math.sin(x * 0.07) * 5 - Math.sin(x * 0.19) * 3); c.lineTo(W, GROUND); c.fill();
  const sg = c.createLinearGradient(0, GROUND, 0, H); sg.addColorStop(0, '#6a4428'); sg.addColorStop(0.3, '#4a2e1c'); sg.addColorStop(1, '#2a1a10'); c.fillStyle = sg; c.fillRect(0, GROUND, W, H - GROUND);
  // strata and pebbles in the earth
  const R = P.rng(57);
  for (let k = 0; k < 7; k++) { const y0 = GROUND + 40 + k * 62; c.strokeStyle = `rgba(255,220,170,${0.05 + (k % 2) * 0.03})`; c.lineWidth = 6 + (k % 3) * 3; c.beginPath(); for (let x = -10; x <= W + 10; x += 10) c.lineTo(x, y0 + Math.sin(x * 0.02 + k) * 8 + Math.sin(x * 0.07 + k * 2) * 3); c.stroke(); }
  for (let i = 0; i < 70; i++) { const x = R() * W, y = GROUND + 20 + R() * (H - GROUND - 20), r = 1.5 + R() * 4; c.fillStyle = ['rgba(150,110,80,0.45)', 'rgba(90,60,40,0.6)', 'rgba(200,170,130,0.3)'][i % 3]; c.beginPath(); c.ellipse(x, y, r * 1.3, r, R() * 3, 0, 7); c.fill(); }
  // hair roots hanging into the soil from the beds above
  c.strokeStyle = 'rgba(230,200,150,0.35)'; c.lineWidth = 1.2;
  for (let i = 0; i < 16; i++) { let x = 10 + i * 23 + R() * 8, y = GROUND + 4; c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (R() - 0.5) * 12; y += 6 + R() * 8; c.lineTo(x, y); } c.stroke(); }
  // carrots growing down from the bed, leaves above the ground
  for (const [x, len] of [[34, 46], [104, 34], [250, 40], [332, 30]]) {
    const gr = c.createLinearGradient(x - 8, 0, x + 8, 0); gr.addColorStop(0, '#e8742a'); gr.addColorStop(0.5, '#ff9a4a'); gr.addColorStop(1, '#c85a1e'); c.fillStyle = gr;
    c.beginPath(); c.moveTo(x - 8, GROUND - 2); c.quadraticCurveTo(x - 6, GROUND + len * 0.6, x, GROUND + len); c.quadraticCurveTo(x + 6, GROUND + len * 0.6, x + 8, GROUND - 2); c.fill();
    c.strokeStyle = 'rgba(140,60,20,0.5)'; c.lineWidth = 1; for (let k = 1; k < 4; k++) { const yy = GROUND + k * len / 4.5; c.beginPath(); c.moveTo(x - 6 + k, yy); c.lineTo(x - 1, yy + 2); c.stroke(); } }
  // the den: a hollow at the bottom left
  const dg = c.createRadialGradient(HX + 6, HY - 30, 10, HX + 6, HY - 30, 90); dg.addColorStop(0, 'rgba(20,10,6,0.9)'); dg.addColorStop(1, 'rgba(20,10,6,0)'); c.fillStyle = dg; c.beginPath(); c.ellipse(HX + 6, HY - 26, 92, 60, 0, 0, 7); c.fill();
  c.fillStyle = '#5a3a24'; c.beginPath(); c.ellipse(HX + 6, HY + 6, 78, 14, 0, 0, 7); c.fill();
  // a faint tunnel behind the root, so the chalk sits on smooth earth
  c.fillStyle = 'rgba(20,10,6,0.28)'; c.beginPath(); c.ellipse(CX, EY - 18, 170, 52, 0, 0, 7); c.fill();
}

MG.add({
  id: 'radical', stage: 'powers', cmd: 'SIMPLIFY ROOT!', hint: 'drag', time: 8, winText: 'Simpler!', hold: 1.8,
  card: {
    title: 'Simplifying square roots', ref: 'Algebra 1', kind: 'Exponents and radicals',
    text: 'A square root can often be written more simply. Look for the biggest perfect square hiding inside the number. Perfect squares are 4, 9, 16, 25, 36 and so on: a whole number times itself.\n\nFor √72, the biggest perfect square that divides 72 is 36, because 72 = 36 × 2. The root of a product is the product of the roots, so √(36 × 2) = √36 × √2. And √36 = 6, the side of a 6 × 6 square. So √72 = 6√2.\n\nThe 2 stays inside the root, because 2 is not a perfect square.',
    note: 'Split the number into the biggest perfect square times what is left. The square\'s root comes out in front: √(a² · b) = a√b.',
    ask: 'Simplify √50. Simplify √48.',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { s, rest, n, sq } = S, T = M.pace(g); S.rv = rest;
    S.gA = { ...M.gap(30), id: 'rad' }; S.gB = { ...M.gap(30), id: 'radB' };
    S.nn = M.num(n, 'n'); S.ex = M.row(S.gA, S.nn);
    S.rads = [{ gap: S.gA, items: [S.nn], a: 1 }];
    S.relay = () => M.place(g, 'ex', S.ex, CX, EY, ES, { col: INK }); S.relay();
    // the stones: perfect squares
    S.chipN = S.chips.map(q => M.num(q, 'q' + q));
    S.chipN.forEach((q, i) => M.place(g, 'chip' + i, q, CX + (i - 2) * 62, CHIPY + 10, 26, { col: '#3a2010' }));
    M.inert(g, ['rad', 'radB', 'dot']);
    // pebbles: a loose heap now; each has its place in one of the `rest` squares of s × s
    const ts = Math.min(24, 104 / s, (300 - (rest - 1) * 16) / (rest * s)), side = s * ts, gapW = Math.min(18, ts * 1.4), tot = rest * side + (rest - 1) * gapW, R = P.rng(n * 7 + 3);
    S.ts = ts; S.side = side; S.sqx = [...Array(rest)].map((_, i) => CX - tot / 2 + i * (side + gapW)); S.peb = [];
    for (let i = 0; i < rest; i++) for (let r = 0; r < s; r++) for (let q = 0; q < s; q++)
      S.peb.push({ i, r, q, hx: CX + (R() - 0.5) * 250 * (0.5 + 0.5 * R()), hy: PY + 20 + (R() - 0.5) * 70, hr: (R() - 0.5) * 1.6, gx: S.sqx[i] + (q + 0.5) * ts, gy: PY - side / 2 + (r + 0.5) * ts, col: STONE[(r * 3 + q + i) % 3], t0: null, dur: 0, lit: 0 });
    S.labs = []; S.face = null;
    const hop = e => { g.s.mk.lastMove = g.t; S.face = e; S.faceT = g.t; };
    S.hop = hop;

    // ---- move 1: split n into the biggest square times the rest ----
    const fill = 0.16 * T + (rest - 1) * 0.14 * T + 0.2 * T + 0.28 * T, askA = Math.max(0.75 * T, fill + 0.06 * T);
    const split = {
      busy: 0.1, askAt: askA, after: 0.85 * T, ask: { v: rest, wrong: [rest + 1, s, rest * 2, sq] },
      then(g) {
        S.split = true; S.point = true; hop('wow'); g.sfx('swoosh'); M.show(g, askA);
        for (const q of S.chipN) M.tween(g, q, { alpha: 0, dy: q.id === 'q' + sq ? -30 : 24 }, 0.3 * T);
        M.at(g, [[0.32 * T, g => { for (const q of S.chipN) q.hide = true; }]]);
        M.circle(g, 'n', { dur: 0.55 * T, col: NOTE }); M.light(g, 'n', { col: NOTE });
        // the working note: n ÷ s² = (answer later)
        S.nr = M.num(rest, 'nr', { alpha: 0 }); S.nq = M.num(sq, 'nq');
        S.note = M.row(M.num(n), M.op('÷'), S.nq, M.op('='), S.nr);
        M.place(g, 'note', S.note, CX, CHIPY + 12, 32, { col: NOTE }); M.writeIn(g, S.note, { dur: 0.42 * T, delay: 0.18 * T });
        // the pebbles hop into squares, one square after another
        for (let i = 0; i < rest; i++) {
          const st = 0.16 * T + i * 0.14 * T;
          S.peb.filter(p => p.i === i).forEach(p => { p.t0 = g.t + st + (p.r * s + p.q) / (s * s) * 0.2 * T; p.dur = 0.28 * T; });
          M.at(g, [[st + 0.48 * T, g => { S.labs.push(M.num(sq, null, { _born: -1, pop: g.t })); S.placeLabs(g); g.sfx('tap', { pitch: 1 + i * 0.12 }); }]]);
        }
      },
      resolve(g) {
        M.show(g, 0.85 * T); S.nr.alpha = 1; M.writeIn(g, S.nr, { dur: 0.2 * T }); M.indicate(g, S.nr, { delay: 0.15 * T, dur: 0.3 * T }); g.sfx('ding'); hop('think');
        M.at(g, [
          [0.3 * T, g => { // 36 and 2 fly up out of the note into the root, while n fades out where it was
            const a = { ...M.box(g, 'nq') }, b = { ...M.box(g, 'nr') }, nb = { ...M.box(g, 'n') }, ghost = M.num(n), gm = M.lay(ghost, ES);
            M.anim(g, { dur: 0.36 * T, draw(c, g, k) { c.globalAlpha = 1 - M.easeIO(k); M.draw(c, ghost, nb.x - gm.w / 2, EY, ES, { t: g.t, col: M.mix(INK, NOTE, 0.6) }); } });
            S.sqN = M.num(sq, 'sq', { alpha: 0 }); S.dot = M.op('·', 'dot', { alpha: 0 }); S.restN = M.num(rest, 'rest', { alpha: 0 });
            S.nn.alpha = 0; S.ex = M.row(S.gA, S.sqN, S.dot, S.restN); S.rads[0].items = [S.sqN, S.restN]; S.relay();
            M.fly(g, { node: M.num(sq, null, { col: NOTE }), from: [a.x, a.y], to: 'sq', dur: 0.4 * T, arc: 30, s0: 32, s1: ES, then(g) { S.sqN.alpha = 1; S.sqN.pop = g.t; M.sparkle(g, 'sq', { n: 8 }); } });
            M.fly(g, { node: M.num(rest, null, { col: NOTE }), from: [b.x, b.y], to: 'rest', dur: 0.4 * T, delay: 0.06 * T, arc: 30, s0: 32, s1: ES, then(g) { S.restN.alpha = 1; S.restN.pop = g.t; g.sfx('pop'); hop('laugh'); } });
            M.tween(g, S.dot, { alpha: 1 }, 0.3 * T, { delay: 0.25 * T }); M.tween(g, S.note, { alpha: 0 }, 0.3 * T, { delay: 0.2 * T }); }],
          [0.8 * T, g => { delete g.s.mk.ex.note; S.point = false; }],
        ]);
      },
    };
    // ---- move 2: take the square's root out in front ----
    const step = Math.min(0.09, 0.5 / s) * T, askB = 0.3 * T + s * step + 0.12 * T;
    const out = {
      busy: 0.1, askAt: askB, after: 1.0 * T, ask: { v: s, wrong: [sq / 2, sq, s + 1, 2 * s] },
      then(g) {
        S.out = true; S.point = true; hop('think'); g.sfx('swoosh'); M.show(g, askB);
        M.indicate(g, S.sqN, { dur: 0.4 * T, col: NOTE });
        // the root splits: √(36 · 2) = √36 · √2
        S.ex = M.row(S.gA, S.sqN, S.dot, S.gB, S.restN); S.rads = [{ gap: S.gA, items: [S.sqN], a: 1, x0: S.rads[0].x0, x1: S.rads[0].x1 }, { gap: S.gB, items: [S.restN], a: 0 }]; S.relay();
        M.tween(g, S.rads[1], { alpha: 1 }, 0.3 * T); S.rads[1].alpha = 0;
        // the first square turns gold and its bottom side lights up, pebble by pebble
        S.goldAt = g.t;
        for (let q = 0; q < s; q++) M.at(g, [[0.3 * T + q * step, g => { const p = S.peb.find(p => p.i === 0 && p.r === s - 1 && p.q === q); if (p) { p.side = g.t; } g.sfx('tap', { pitch: 1 + q * 0.06 }); }]]);
      },
      resolve(g) {
        M.show(g, 1.0 * T); hop('wow'); const lab = S.labs[0];
        M.roll(g, lab, s, { dur: 0.3 * T }); lab.col = GOLD; lab.pop = g.t; g.sfx('ding');
        // the check under √36
        S.chk = M.row(M.num(s), M.op('·'), M.num(s), M.op('='), M.num(sq)); M.place(g, 'chk', S.chk, M.box(g, 'sq').x, EY + 50, 26, { col: NOTE }); M.writeIn(g, S.chk, { dur: 0.32 * T, delay: 0.05 * T });
        M.at(g, [
          [0.36 * T, g => { const b = { ...M.box(g, 'lab0') }; M.tween(g, lab, { alpha: 0 }, 0.12 * T);
            M.tween(g, S.rads[0], { alpha: 0 }, 0.3 * T); M.tween(g, S.dot, { alpha: 0 }, 0.25 * T);
            M.fly(g, { node: M.num(s, null, { col: GOLD }), from: [b.x, b.y], to: 'sq', dur: 0.38 * T, arc: -60, s0: 24, s1: ES,
              then(g) { M.tween(g, lab, { alpha: 1 }, 0.25 * T); M.roll(g, S.sqN, s, { dur: 0.25 * T }); S.sqN.id = 'coef'; S.sqN.pop = g.t; S.ex = M.row(S.sqN, S.gB, S.restN); S.rads = [S.rads[1]]; S.relay();
                M.sparkle(g, 'coef', { n: 14 }); g.sfx('coin'); hop('laugh'); } }); }],
          [0.82 * T, g => { M.tween(g, S.chk, { alpha: 0 }, 0.2 * T); M.indicate(g, S.ex, { dur: 0.35 * T, sc: 1.08, col: NOTE }); S.point = false; }],
        ]);
      },
    };
    // each square's label is a num node in its own placed expression, so it can roll from 36 to 6
    S.placeLabs = g => { S.labs.forEach((L, i) => { L.id = 'lab' + i; M.place(g, 'lab' + i, L, S.sqx[i] + S.side / 2, PY + S.side / 2 + 26, 24, { col: INK }); }); };
    M.play(g, {
      moves(g) {
        if (!S.split) return [{ ...split, drag: 'q' + sq, to: 'n', area: [30, EY - 80, 330, EY + 24] }, { ...split, tap: 'q' + sq }];
        if (!S.out) { const b = M.box(g, 'rad'); return [{ ...out, drag: 'sq', to: 'rad', area: [0, EY - 90, b ? b.x + 4 : 110, EY + 30] }, { ...out, tap: 'sq' }]; }
        return [];
      },
      area(g) { return !S.split ? ['q' + sq, 'n'] : !S.out ? 'sq' : null; },
      onWin(g) { S.sqN.pop = g.t; S.restN.pop = g.t; },
    });
  },
  update(g, dt) {
    const S = g.s, K = S.mk; M.update(g, dt);
    if (K.missAt >= 0 && K.missAt !== S.seenMiss) { S.seenMiss = K.missAt; S.face = 'sad'; S.faceT = g.t; const I = K.missInfo || {}, id = I.drag || I.tap;
      const m = /^q(\d+)$/.exec(id || '');
      if (m) { const q = +m[1];
        if (S.n % q) { const nd = M.row(M.num(S.n), M.op('÷'), M.num(q), M.op('='), M.txt(dec(S.n / q))); nd.strike = { t0: g.t + 0.4, dur: 0.22, col: '#ff4a3a' };
          M.note(g, { node: nd, at: [CX, 180], s: 26, col: '#b8202a', write: 0.3, hold: 0.45, fade: 0.25 }); }
        else { const k = S.n / q; let sub = 4; for (const z of [4, 9, 16, 25, 36, 49]) if (k % z === 0) sub = z;
          M.note(g, { node: M.row(M.num(S.n), M.op('÷'), M.num(q), M.op('='), M.num(k)), at: [CX, 164], s: 26, col: '#b8202a', write: 0.25, hold: 0.6, fade: 0.25 });
          M.note(g, { node: M.row(M.num(k), M.op('='), M.num(sub), M.op('·'), M.num(k / sub)), at: [CX, 192], s: 24, col: '#8a2a5a', delay: 0.3, write: 0.25, hold: 0.35, fade: 0.25 }); } }
      if (id === 'rest') M.note(g, { node: M.row(M.txt('√'), M.num(S.rv), M.op("≈"), M.txt(dec(Math.sqrt(S.rv)))), at: 'rest', off: [0, 56], s: 22, col: '#ff8a7a', write: 0.25, hold: 0.45, fade: 0.25 });
    }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, ts = S.ts, dt = Math.min(0.1, Math.max(0, t - (S.lastT ?? t))); S.lastT = t;
    c.drawImage(g.bake('powers_radical_garden', garden), 0, 0, W, H);
    // gentle motion: carrot leaves and grass above the ground, a worm in the soil, motes drifting
    c.save();
    for (const [x, ph] of [[34, 0], [104, 1.3], [250, 2.1], [332, 0.7]]) for (let k = -1; k <= 1; k++) { const a = k * 0.35 + Math.sin(t * 1.6 + ph + k) * 0.08; c.strokeStyle = k ? '#4a9a3a' : '#5ab048'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, GROUND - 2); c.quadraticCurveTo(x + Math.sin(a) * 14, GROUND - 16, x + Math.sin(a) * 22, GROUND - 30 + Math.abs(k) * 4); c.stroke(); }
    c.fillStyle = '#5aa040'; for (let x = 4; x < W; x += 9) { const h = 5 + (x * 7 % 6), sw = Math.sin(t * 2 + x * 0.1) * 1.5; c.beginPath(); c.moveTo(x - 2, GROUND + 1); c.lineTo(x + sw, GROUND - h); c.lineTo(x + 2, GROUND + 1); c.fill(); }
    { const wx = 300 + Math.sin(t * 0.5) * 18, wy = 560; c.strokeStyle = '#d88a8a'; c.lineWidth = 5; c.beginPath(); for (let k = 0; k <= 10; k++) { const x = wx + k * 3.2, y = wy + Math.sin(t * 4 + k * 0.7) * 3; k ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.fillStyle = '#2a1010'; c.beginPath(); c.arc(wx + 32, wy + Math.sin(t * 4 + 7) * 3 - 1, 1.2, 0, 7); c.fill(); }
    for (let i = 0; i < 14; i++) { const x = (i * 47 + t * 6 + Math.sin(t * 0.6 + i) * 10) % W, y = GROUND + 30 + (i * 83) % 400 + Math.cos(t * 0.5 + i) * 8; c.fillStyle = `rgba(255,220,160,${0.18 + 0.15 * Math.sin(t * 2 + i)})`; c.beginPath(); c.arc(x, y, 1.4, 0, 7); c.fill(); }
    c.restore();
    // the stones (perfect squares), each a little k × k grid with its number on it
    for (const q of S.chipN) { const b = M.box(g, q.id); if (!b || q.hide) continue; const k = Math.round(Math.sqrt(+q.v)), w = 48, a = q.alpha ?? 1, dy = q.dy || 0, bad = q.mark === 'bad';
      c.save(); c.globalAlpha = a; c.translate(b.x, b.y + dy); if (q.pop != null && t - q.pop < 0.4) c.rotate(Math.sin((t - q.pop) * 40) * 0.06);
      c.fillStyle = 'rgba(10,5,0,0.4)'; c.beginPath(); c.roundRect(-w / 2 + 2, -w / 2 + 4, w, w, 9); c.fill();
      const gr = c.createLinearGradient(0, -w / 2, 0, w / 2); gr.addColorStop(0, bad ? '#ffc0b0' : '#f4e4c4'); gr.addColorStop(1, bad ? '#e88878' : '#d8bc8c'); c.fillStyle = gr; c.beginPath(); c.roundRect(-w / 2, -w / 2, w, w, 9); c.fill();
      c.strokeStyle = 'rgba(120,80,40,0.28)'; c.lineWidth = 1; const g0 = w - 10, cs = g0 / k; c.beginPath(); for (let j = 0; j <= k; j++) { c.moveTo(-g0 / 2 + j * cs, -g0 / 2); c.lineTo(-g0 / 2 + j * cs, g0 / 2); c.moveTo(-g0 / 2, -g0 / 2 + j * cs); c.lineTo(g0 / 2, -g0 / 2 + j * cs); } c.stroke();
      c.restore(); }
    S.chipN.forEach((q, i) => M.drawEx(g, c, 'chip' + i));
    // the radical signs, easing to follow the symbols under them
    const kk = 1 - Math.exp(-dt * 16);
    for (const R of S.rads) { const gb = M.box(g, R.gap.id), bs = R.items.map(n => M.box(g, n.id)).filter(Boolean); if (!gb || !bs.length) continue;
      const x0 = gb.x - gb.w / 2 + 2, x1 = Math.max(...bs.map(b => b.x + b.w / 2)) + 5, top = EY - ES * 0.86;
      if (R.x0 == null) { R.x0 = x0; R.x1 = x1; } else { R.x0 += (x0 - R.x0) * kk; R.x1 += (x1 - R.x1) * kk; }
      const al = (R.alpha ?? 1); if (al <= 0.01) continue; const mid = EY - ES * 0.3, bot = EY + ES * 0.1, gw = gb.w;
      c.save(); c.globalAlpha = al; c.strokeStyle = INK; c.lineWidth = 4.2; c.lineCap = 'round'; c.lineJoin = 'round'; c.shadowColor = 'rgba(0,0,0,0.4)'; c.shadowBlur = 4;
      c.beginPath(); c.moveTo(R.x0, mid + 4); c.lineTo(R.x0 + gw * 0.26, mid - 3); c.lineTo(R.x0 + gw * 0.58, bot); c.lineTo(R.x0 + gw - 2, top); c.lineTo(R.x1, top); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'ex');
    // pebbles: in the heap, hopping, or laid into squares
    const gk = S.goldAt != null ? M.clamp((t - S.goldAt) / 0.3, 0, 1) : 0;
    const still = [], moving = [];
    for (const p of S.peb) { if (p.t0 == null || t < p.t0) { pebble(c, p.hx, p.hy, Math.min(ts, 13), p.hr, p.col, 0); continue; } (t >= p.t0 + p.dur ? still : moving).push(p); }
    for (const p of still) { const lit = p.i === 0 ? gk * 0.75 + (p.side != null ? 0.25 : 0) : 0, pk = p.side != null ? 1 + Math.sin(M.clamp((t - p.side) / 0.25, 0, 1) * Math.PI) * 0.3 : 1;
      pebble(c, p.gx, p.gy, ts * pk, 0, p.col, lit); }
    for (const p of moving) { const k = M.easeIO((t - p.t0) / p.dur), x = M.lerp(p.hx, p.gx, k), y = M.lerp(p.hy, p.gy, k) - Math.sin(k * Math.PI) * 46; pebble(c, x, y, M.lerp(Math.min(ts, 13), ts, k) * (1 + Math.sin(k * Math.PI) * 0.3), p.hr * (1 - k), p.col, 0); }
    // the lit side of the first square
    const sideN = S.peb.filter(p => p.i === 0 && p.side != null).length;
    if (sideN) { const x0 = S.sqx[0], y = PY + S.side / 2 + 5; c.save(); c.strokeStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 10; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0 + 1, y); c.lineTo(x0 + sideN * ts - 1, y); c.stroke(); c.restore(); }
    S.labs.forEach((L, i) => M.drawEx(g, c, 'lab' + i));
    // the fox, watching from its den
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', HX, HY - hopK * 22, 1.2, { t, pose, expr, facing: 1 }); else SCN.host(g, c, 'fox', HX, HY, 1.2);
    M.drawEx(g, c, 'note'); M.drawEx(g, c, 'chk');
    M.drawUI(g, c);
  },
});
