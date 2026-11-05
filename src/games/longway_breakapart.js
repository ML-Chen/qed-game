// longway_breakapart.js — BREAK APART! Multiply by breaking one factor into friendly parts (the distributive property):
// 7 × 8 = 7 × 5 + 7 × 3 = 35 + 21 = 56.
// A river at morning with a beaver. The array of 7 rows of 8 is a raft of log rounds floating under a birch sign that
// reads 7 × 8 = ?. A hand saw rests on the bank. Every move's working plays by itself (show your work):
//   1. drag the saw onto a gap in the raft (or tap a gap): the saw rasps down the gap with sawdust flying, the two blocks
//      drift apart, "5" and "3" write themselves over the blocks, and on the sign the 8 rolls to 5 while a copy of the 7
//      flies over to make 7 × 5 + 7 × 3. Any gap is a fair cut; the guidance shows the friendly one (5, or 10 at level 2).
//   2. tap either product (on the sign or its block), in any order: its rounds light up row by row, "7 × 5 = 35" writes
//      itself on the block, and 35 flies up into the sign in place of 7 × 5.
//   3. drag one product onto the other (or tap the +): the blocks slide back together, "35 + 21 = 56" writes itself,
//      the + 21 slides into the 35, which rolls to 56 and drops into the ?, and the sign reads 7 × 8 = 56 again.
// Level 0: 3–6 × 7–9 split at 5. Level 1: 6–9 × 6–9 split at 5. Level 2: 3–7 × 12–15 split at 10.
// Medium mode: the tray asks for each product and for the sum.
const M = MK, INK = '#3a2414', EY = 214, RY = 390, SAWX = 72, SAWY = 572, BX = 296, BY = 606;
const COLS = ['#ff9a4a', '#5ac8a0'], DARK = ['#8a3a10', '#1e6a50'];
function pick(g) {
  const L = g.level, ri = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  if (L === 0) return { a: ri(3, 6), b: ri(7, 9), f: 5 };
  if (L === 1) return { a: ri(6, 9), b: ri(6, 9), f: 5 };
  return { a: ri(3, 7), b: ri(12, 15), f: 10 };
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
// bold text with a dark outline, so it reads on water and wood
function label(c, s, x, y, size, fill, stroke = 'rgba(30,16,8,0.9)') { c.save(); c.font = M.NUMF(size, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = Math.max(4, size * 0.2); c.strokeStyle = stroke; c.strokeText(s, x, y); c.fillStyle = fill; c.fillText(s, x, y); c.restore(); }

// ---------------- the river at morning (baked) ----------------
function river(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 270); sk.addColorStop(0, '#7ab8e0'); sk.addColorStop(0.6, '#c8e4ee'); sk.addColorStop(1, '#ffe8c8'); c.fillStyle = sk; c.fillRect(0, 0, W, 270);
  const sg = c.createRadialGradient(64, 236, 4, 64, 236, 120); sg.addColorStop(0, 'rgba(255,244,200,0.95)'); sg.addColorStop(0.25, 'rgba(255,230,170,0.5)'); sg.addColorStop(1, 'rgba(255,230,170,0)'); c.fillStyle = sg; c.fillRect(0, 110, 200, 160);
  c.fillStyle = '#fff6d8'; c.beginPath(); c.arc(64, 244, 18, Math.PI, 0); c.fill();
  // far hills and a row of pines on the far bank
  c.fillStyle = '#8ab0b8'; c.beginPath(); c.moveTo(0, 250); for (let x = 0; x <= W; x += 20) c.lineTo(x, 228 + Math.sin(x * 0.018 + 1) * 14 + Math.sin(x * 0.06) * 4); c.lineTo(W, 280); c.lineTo(0, 280); c.fill();
  const R = P.rng(31); for (let i = 0; i < 22; i++) { const x = i * 17 + R() * 8, h = 22 + R() * 26; c.fillStyle = i % 2 ? '#3e6a58' : '#4a7a62'; c.beginPath(); c.moveTo(x - 9, 272); c.lineTo(x, 272 - h); c.lineTo(x + 9, 272); c.fill(); }
  c.fillStyle = '#5a8a4a'; c.fillRect(0, 268, W, 8);
  // the river
  const wg = c.createLinearGradient(0, 274, 0, 560); wg.addColorStop(0, '#7ac8c8'); wg.addColorStop(0.5, '#3a9aa8'); wg.addColorStop(1, '#2a7a90'); c.fillStyle = wg; c.fillRect(0, 274, W, 290);
  c.fillStyle = 'rgba(255,240,200,0.35)'; for (let i = 0; i < 10; i++) { const y = 282 + i * 7, w = 70 - i * 6; c.fillRect(64 - w / 2 + R() * 12, y, w, 2); }
  // the near bank: grass, pebbles and reeds
  c.fillStyle = '#7aa84a'; c.beginPath(); c.moveTo(0, 540); for (let x = 0; x <= W; x += 18) c.lineTo(x, 534 + Math.sin(x * 0.04) * 6); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  c.fillStyle = '#5a8a3a'; c.beginPath(); c.moveTo(0, 580); for (let x = 0; x <= W; x += 18) c.lineTo(x, 574 + Math.sin(x * 0.07 + 2) * 5); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  for (let i = 0; i < 9; i++) { c.fillStyle = ['#c8c0b0', '#a89a88', '#ddd4c4'][i % 3]; c.beginPath(); c.ellipse(20 + R() * 320, 548 + R() * 80, 6 + R() * 6, 4 + R() * 3, 0, 0, 7); c.fill(); }
  c.strokeStyle = '#4a7a2a'; c.lineWidth = 3; c.lineCap = 'round'; for (let i = 0; i < 18; i++) { const x = R() * W, h = 18 + R() * 30; c.beginPath(); c.moveTo(x, 560); c.quadraticCurveTo(x + 5, 560 - h / 2, x + (R() - 0.5) * 12, 560 - h); c.stroke(); }
  // a little stump the saw rests against
  c.fillStyle = '#7a4e2c'; c.fillRect(SAWX + 34, SAWY - 30, 30, 34); c.fillStyle = '#d8a870'; c.beginPath(); c.ellipse(SAWX + 49, SAWY - 30, 15, 6, 0, 0, 7); c.fill(); c.strokeStyle = '#a8784a'; c.lineWidth = 1; c.beginPath(); c.ellipse(SAWX + 49, SAWY - 30, 8, 3, 0, 0, 7); c.stroke();
}
// a hand saw: blade pointing down-left from the handle, drawn with the handle at (0, 0)
function saw(c, x, y, rot, s = 1) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  c.fillStyle = '#d8dee6'; c.strokeStyle = '#4a5260'; c.lineWidth = 2; c.beginPath(); c.moveTo(-6, -9); c.lineTo(-70, -5); c.lineTo(-70, 5); c.lineTo(-6, 11); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#4a5260'; for (let i = 0; i < 9; i++) { const xx = -66 + i * 7; c.beginPath(); c.moveTo(xx, 5 + i * 0.7); c.lineTo(xx + 3.5, 10 + i * 0.7); c.lineTo(xx + 7, 5.5 + i * 0.7); c.fill(); }
  c.fillStyle = 'rgba(255,255,255,0.7)'; c.fillRect(-60, -4, 46, 2);
  c.fillStyle = '#b8642a'; c.strokeStyle = '#5a2a10'; c.beginPath(); rr(c, -8, -14, 26, 30, 9); c.fill(); c.stroke(); c.fillStyle = '#5a2a10'; c.beginPath(); rr(c, 0, -6, 11, 14, 5); c.fill();
  c.restore();
}

MG.add({
  id: 'longway_breakapart', stage: 'longway', cmd: 'BREAK APART!', hint: 'drag', time: 10, mood: 'bright', winText: 'Sawn!', hold: 1.7,
  card: {
    title: 'Breaking apart a product', ref: 'Grade 3', kind: 'Multiplication',
    text: 'A hard times fact can be broken into two easy ones. Think of 7 × 8 as 7 rows of 8. Saw the rows after the 5th column: now there is a block of 7 × 5 and a block of 7 × 3.\n\nWork out each block: 7 × 5 = 35 and 7 × 3 = 21. Nothing was lost or added by the cut, so the whole is the two blocks together: 35 + 21 = 56. So 7 × 8 = 56.\n\nThis is called the distributive property. Cutting at 5 or at 10 makes the blocks easy to work out.',
    note: 'Break one factor into parts, multiply each part, then add: 7 × 8 = 7 × 5 + 7 × 3.',
    ask: 'Break apart 6 × 7 as 6 × 5 + 6 × 2. What do you get? What is 4 × 13?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a, b, f } = S;
    S.u = Math.min(34, 290 / (b + 1.6), 176 / a); S.sp = 0; S.k = 0; S.lit = [null, null]; S.val = [null, null]; S.all = null; S.face = 'happy';
    S.A = M.num(a, 'A'); S.X = M.op('×', 'X'); S.B = M.num(b, 'B'); S.EQ = M.op('=', 'eq'); S.Q = M.slot('ans', { col: '#7a5a3a' });
    S.size = b >= 10 ? 34 : 38;
    S.set = items => { S.row = M.row(...items); M.place(g, 'ex', S.row, 180, EY, S.size, { col: INK }); };
    S.set([S.A, S.X, S.B, S.EQ, S.Q]); M.inert(g, ['eq', 'res', 'Bf']);
    // where things are on the raft
    S.cx = j => 180 - b * S.u / 2 + (j + 0.5) * S.u + (S.k ? (j < S.k ? -11 : 11) * S.sp : 0);
    S.top = RY - a * S.u / 2; S.bot = RY + a * S.u / 2;
    S.blockBox = i => { const j0 = i ? S.k : 0, j1 = i ? b : S.k, x0 = S.cx(j0) - S.u / 2, x1 = S.cx(j1 - 1) + S.u / 2; return { x: (x0 + x1) / 2, y: RY, w: x1 - x0, h: S.bot - S.top }; };
    S.gapX = k => 180 - b * S.u / 2 + k * S.u;
    M.zone(g, 'saw', { x: SAWX + 4, y: SAWY - 4, w: 96, h: 46 });
    for (let k = 1; k < b; k++) M.zone(g, 'g' + k, { x: S.gapX(k), y: RY, w: Math.max(14, S.u * 0.6), h: S.bot - S.top + 20 });
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    S.hop = hop;

    // 1. the cut
    const cut = (g, gid) => {
      const T = M.pace(g), k = +gid.slice(1), x = S.gapX(k); S.k = k; S.b2 = b - k; S.point = true;
      M.show(g, 1.45 * T); hop(g, 'wow');
      for (let q = 1; q < b; q++) S.mk.zones['g' + q] = false; S.mk.zones.saw = false;
      S.sawing = { x, t0: g.t, dur: 0.55 * T }; S.cutAt = g.t + 0.55 * T;
      const st = []; for (let i = 0; i < 5; i++) st.push([i * 0.11 * T, g => { g.sfx('rustle', { vol: 0.5 }); g.burst(x, S.top + (S.bot - S.top) * (i + 0.5) / 5, ['#f2d29a', '#d8a870', '#fff0c8'], 6, 80); }]);
      st.push([0.55 * T, g => { g.sfx('thud'); hop(g); M.tween(g, S, { sp: 1 }, 0.3 * T); S.parts = { t0: g.t + 0.2 * T }; }]);
      // on the sign: the b rolls to the first part, + a × (second part) writes itself in, and a copy of a flies over
      st.push([0.8 * T, g => {
        S.a2 = M.num(a, 'a2', { alpha: 0 }); S.X2 = M.op('×', 'X2'); S.c2 = M.num(b - k, 'c2'); S.PL = M.op('+', 'pl');
        S.B.id = 'c1'; S.t1 = M.row(S.A, S.X, S.B); S.t1.id = 't1'; S.t2 = M.row(S.a2, S.X2, S.c2); S.t2.id = 't2';
        S.set([S.t1, S.PL, S.t2, S.EQ, S.Q]); M.roll(g, S.B, k, { dur: 0.35 * T });
        for (const q of [S.PL, S.X2, S.c2]) M.writeIn(g, q, { dur: 0.3 * T, delay: 0.1 * T });
        const fa = { ...M.box(g, 'A') }; M.indicate(g, S.A, { dur: 0.4 * T, sc: 1.25 });
        M.fly(g, { node: M.num(a, null, { col: INK }), from: [fa.x, fa.y], to: 'a2', dur: 0.4 * T, delay: 0.05 * T, arc: -34, s0: S.size, s1: S.size,
          then(g) { S.a2.alpha = 1; S.a2.pop = g.t; M.sparkle(g, 'a2', { n: 6 }); g.sfx('pop'); } });
        g.sfx('swoosh'); }]);
      st.push([1.4 * T, g => { S.point = false; }]);
      M.at(g, st);
    };
    // 2. one product (i = 0 for the first block, 1 for the second)
    const prodMove = i => {
      const T = M.pace(g), kk = i ? S.b2 : S.k, v = a * kk, rows = a, per = Math.min(0.06, 0.42 / rows) * T, lit = 0.12 * T + rows * per + 0.1 * T;
      return { tap: i ? ['t2', 'a2', 'X2', 'c2', 'br'] : ['t1', 'A', 'X', 'c1', 'bl'], busy: 0.1, askAt: lit, after: 1.05 * T,
        ask: { v, wrong: [a + kk, a * (kk + 1), v - a, (a + 1) * kk].filter(w => w > 0 && w !== v) },
        then(g) { S['p' + i + 'go'] = true; M.show(g, lit); hop(g, 'think'); S.point = true; S.side = i;
          M.circle(g, i ? 't2' : 't1', { dur: 0.5 * T, col: COLS[i] }); M.light(g, i ? S.t2 : S.t1, { col: COLS[i] });
          S.lit[i] = { t0: g.t + 0.12 * T, per };
          const st = []; for (let r = 0; r < rows; r++) st.push([0.12 * T + r * per, g => g.sfx('tap', { pitch: 0.9 + r * 0.06, vol: 0.35 })]); M.at(g, st); },
        resolve(g) { M.show(g, 1.05 * T); const bb = S.blockBox(i);
          M.note(g, { node: M.row(M.num(a), M.op('×'), M.num(kk), M.op('='), M.num(v)), at: [bb.x, bb.y], s: 26, col: '#fff8e8', pill: 'rgba(40,20,10,0.8)', write: 0.32 * T, hold: 0.3 * T, fade: 0.2 * T });
          M.at(g, [
            [0.55 * T, g => { S.val[i] = { v, t0: g.t }; g.sfx('ding'); hop(g);
              M.fly(g, { node: M.num(v, null, { col: '#fff8e8' }), from: [bb.x, bb.y], to: i ? 't2' : 't1', dur: 0.38 * T, arc: -40, s0: 30, s1: S.size,
                then(g) { const p = M.num(v, 'p' + i, { _born: -1, pop: g.t, col: DARK[i] }); S['p' + i] = p;
                  S.set([S.p0 || S.t1, S.PL, S.p1 || S.t2, S.EQ, S.Q]); M.sparkle(g, p, { n: 10, cols: [COLS[i], '#fff', '#ffe08a'] }); g.sfx('coin'); S.point = false; } }); }],
          ]); } };
    };
    // 3. add the two products
    const addMove = () => {
      const T = M.pace(g), v0 = S.p0.v * 1, v1 = S.p1.v * 1, sum = a * b;
      return { busy: 0.1, askAt: 0.6 * T, after: 1.35 * T, ask: { v: sum, wrong: [sum + 10, sum - 10, v0 + S.b2, v1 + S.k].filter(w => w > 0 && w !== sum) },
        then(g) { S.adding = true; M.show(g, 0.6 * T); hop(g, 'wow'); S.point = true; g.sfx('swoosh');
          M.tween(g, S, { sp: 0 }, 0.4 * T); M.circle(g, [S.p0, S.PL, S.p1], { dur: 0.55 * T }); M.indicate(g, S.PL, { dur: 0.4 * T, sc: 1.4 }); },
        resolve(g) { M.show(g, 1.35 * T);
          M.note(g, { node: M.row(M.num(v0, null, { col: '#ffd0a8' }), M.op('+'), M.num(v1, null, { col: '#b8f0d8' }), M.op('='), M.num(sum)), at: [180, EY + 56], s: 28, col: '#fff8e8', pill: 'rgba(40,20,10,0.8)', write: 0.35 * T, hold: 0.45 * T, fade: 0.2 * T });
          M.at(g, [
            [0.45 * T, g => { const b0 = M.box(g, 'p0'); for (const q of [S.PL, S.p1]) { const bq = M.box(g, q.id); if (bq && b0) M.tween(g, q, { dx: b0.x - bq.x, alpha: 0, sc: 0.6 }, 0.3 * T); }
              M.roll(g, S.p0, sum, { delay: 0.15 * T, dur: 0.3 * T }); S.all = { v: sum, t0: g.t + 0.3 * T }; S.val = [null, null]; }],
            [0.8 * T, g => { S.p0.col = INK; S.p0.pop = g.t; S.Q.fill = S.p0; S.p0.id = 'res'; S.Bf = M.num(b, 'Bf');
              S.set([S.A, S.X, S.Bf, S.EQ, S.Q]); M.sparkle(g, 'res', { n: 16, cols: ['#ffd25a', '#fff', '#9ae0d0'] }); g.sfx('coin'); g.sfx('sparkle'); hop(g, 'laugh'); }],
            [1.2 * T, g => { S.point = false; M.indicate(g, S.row, { dur: 0.3 * T, sc: 1.06 }); }],
          ]); } };
    };
    M.play(g, {
      moves(g) {
        if (!S.k) { const gaps = [f]; for (let k = 1; k < b; k++) if (k !== f) gaps.push(k); const ids = gaps.map(k => 'g' + k);
          return [{ drag: 'saw', to: ids, busy: 0.1, reach: 30, then: (g, from, to) => cut(g, to) }, { tap: ids, busy: 0.1, then: (g, id) => cut(g, id) }]; }
        const out = []; if (!S.p0go) out.push(prodMove(0)); if (!S.p1go) out.push(prodMove(1));
        if (out.length || S.adding || !S.p0 || !S.p1) return out;
        const am = addMove(); return [{ ...am, drag: 'p0', to: 'p1' }, { ...am, drag: 'p1', to: 'p0' }, { ...am, tap: 'pl' }];
      },
      area(g) { const mv = M.current(g)[0]; return mv ? [].concat(mv.tap || mv.drag).slice(0, 1) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); const S = g.s; if (S.k) { const z = S.mk.zones || {}; if (!S.p0go) M.zone(g, 'bl', S.blockBox(0)); else z.bl = false; if (!S.p1go) M.zone(g, 'br', S.blockBox(1)); else z.br = false; } },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, { a, b } = S, u = S.u, T = M.pace(g);
    c.drawImage(g.bake('breakapart_river', river), 0, 0, 360, 640);
    // ripples drift on the river
    c.save(); c.strokeStyle = 'rgba(230,250,255,0.5)'; c.lineWidth = 2; c.lineCap = 'round';
    for (let i = 0; i < 12; i++) { const x = (i * 67 + t * (10 + (i % 3) * 4)) % 400 - 20, y = 300 + (i * 41) % 230, w = 14 + (i % 4) * 6; c.globalAlpha = 0.3 + 0.3 * Math.sin(t * 2 + i); c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + w / 2, y - 3, x + w, y); c.stroke(); }
    c.restore();
    // the birch sign with the problem
    c.save(); c.fillStyle = '#6a4a2a'; c.fillRect(64, EY + 20, 8, 46); c.fillRect(288, EY + 20, 8, 46);
    c.fillStyle = 'rgba(30,20,10,0.25)'; rr(c, 22, EY - 44 + 5, 316, 70, 14); c.fill();
    const bg = c.createLinearGradient(0, EY - 44, 0, EY + 26); bg.addColorStop(0, '#fffaf0'); bg.addColorStop(1, '#efe2cc'); c.fillStyle = bg; rr(c, 20, EY - 44, 320, 70, 14); c.fill(); c.strokeStyle = '#8a6a4a'; c.lineWidth = 2.5; c.stroke();
    c.restore();
    M.drawEx(g, c, 'ex');
    // the raft bobs a little
    const bob = Math.sin(t * 1.6) * 1.5;
    c.save(); c.translate(0, bob);
    const boards = S.k ? [S.blockBox(0), S.blockBox(1)] : [{ x: 180, y: RY, w: b * u, h: a * u }];
    for (const bb of boards) { c.fillStyle = 'rgba(10,40,60,0.3)'; rr(c, bb.x - bb.w / 2 - 6, bb.y - bb.h / 2 + 2, bb.w + 12, bb.h + 12, 10); c.fill();
      c.fillStyle = '#8a5a30'; rr(c, bb.x - bb.w / 2 - 6, bb.y - bb.h / 2 - 6, bb.w + 12, bb.h + 12, 10); c.fill(); c.strokeStyle = '#5a3418'; c.lineWidth = 2; c.stroke(); }
    // the log rounds; lit rounds take their block's colour, row by row
    for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) {
      const x = S.cx(j), y = S.top + (i + 0.5) * u, side = S.k && j >= S.k ? 1 : 0, L = S.lit[side], on = L && t >= L.t0 + i * L.per, pk = on ? M.clamp((t - L.t0 - i * L.per) / 0.15, 0, 1) : 0, r = u * 0.43 * (1 + Math.sin(pk * Math.PI) * 0.2);
      c.fillStyle = on ? COLS[side] : '#e8c08a'; c.strokeStyle = on ? DARK[side] : '#7a4a22'; c.lineWidth = 1.8; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke();
      c.strokeStyle = on ? 'rgba(255,255,255,0.5)' : 'rgba(150,100,50,0.6)'; c.lineWidth = 1; c.beginPath(); c.arc(x, y, r * 0.55, 0, 7); c.stroke(); c.beginPath(); c.arc(x, y, r * 0.2, 0, 7); c.stroke();
    }
    // the cut line, drawn as the saw passes
    if (S.sawing) { const k = M.clamp((t - S.sawing.t0) / S.sawing.dur, 0, 1), x = S.gapX(S.k), yb = M.lerp(S.top - 8, S.bot + 8, k);
      if (!S.sp) { c.strokeStyle = 'rgba(60,30,10,0.85)'; c.lineWidth = 3; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(x, S.top - 8); c.lineTo(x, yb); c.stroke(); c.setLineDash([]); }
      if (k < 1) saw(c, x + 6 + Math.sin(t * 40) * 5, yb - 4, -Math.PI / 2 - 0.25, 0.9); }
    // the numbers painted on the blocks once worked out, and the whole once added
    for (let i = 0; i < 2; i++) { const V = S.val[i]; if (!V) continue; const bb = S.blockBox(i), k = M.clamp((t - V.t0) / 0.3, 0, 1); c.save(); c.globalAlpha = k; label(c, String(V.v), bb.x, bb.y, Math.min(40, 18 + bb.w * 0.3) * (1 + Math.sin(k * Math.PI) * 0.3), '#fffdf4', DARK[i]); c.restore(); }
    if (S.all) { const k = M.clamp((t - S.all.t0) / 0.35, 0, 1); c.save(); c.globalAlpha = k; label(c, String(S.all.v), 180, RY, 52 * (1 + Math.sin(k * Math.PI) * 0.3), '#fffdf4', '#5a3418'); c.restore(); }
    c.restore();
    // labels: rows on the left, columns along the top (the whole b, then its two parts)
    const lft = 180 - b * u / 2 - (S.k ? 11 * S.sp : 0) - 22;
    label(c, String(a), Math.max(16, lft), RY + bob, 24, '#fffdf4');
    if (!S.parts) label(c, String(b), 180, S.top - 26 + bob, 26, '#fffdf4');
    else { const k = M.clamp((t - S.parts.t0) / (0.3 * T), 0, 1);
      for (let i = 0; i < 2; i++) { const bb = S.blockBox(i), y = S.top - 24 + bob; c.save(); c.globalAlpha = S.all ? 0.4 : 1;
        c.strokeStyle = '#fffdf4'; c.lineWidth = 2.5; c.lineCap = 'round'; const w = (bb.w / 2 - 2) * k; c.beginPath(); c.moveTo(bb.x - w, y + 12); c.lineTo(bb.x - w, y + 16); c.moveTo(bb.x - w, y + 14); c.lineTo(bb.x + w, y + 14); c.lineTo(bb.x + w, y + 12); c.moveTo(bb.x + w, y + 14); c.lineTo(bb.x + w, y + 16); c.stroke();
        c.globalAlpha *= k; label(c, String(i ? S.b2 : S.k), bb.x, y - 4, 24, i ? '#c8f4e0' : '#ffe0c4'); c.restore(); } }
    // the saw on the bank (or in the player's hand while dragged)
    const P0 = K.press, dragging = P0 && P0.dragging && P0.id === 'saw';
    if (dragging) saw(c, P0.x + 30, P0.y - 10, -Math.PI / 2 - 0.25, 1);
    else if (!S.sawing || t > S.sawing.t0 + S.sawing.dur) saw(c, SAWX + 34, SAWY - 4, 0.25, 1);
    // the beaver: points while the work is shown, hops when a step lands
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missK = K.missAt >= 0 && t - K.missAt < 0.5;
    const expr = won ? 'laugh' : lost || missK ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'beaver', BX + (missK ? Math.sin((t - K.missAt) * 40) * 3 : 0), BY - hopK * 20, 1.25, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'beaver', BX, BY, 1.25);
    M.drawUI(g, c);
  },
});
