// longway_remainder.js — REMAINDER! Divide by sharing out fairly; what cannot be shared is the remainder: 17 ÷ 5 = 3 R 2.
// An apple orchard at dusk with a hedgehog. A cloth banner strung between the trees reads 17 ÷ 5 = ?; a heap of 17
// apples lies in the grass with a wooden tag counting them, and an empty bucket marked R waits beside it.
// Every move's working plays by itself (show your work):
//   1. drag the 5 onto the grass above the heap: five baskets drop in one after another, each numbered as it lands.
//   2. drag the heap's tag (or the heap, or the 17) onto the baskets: the apples are dealt round by round, one to each
//      basket, flying in arcs; each round the tag rolls down with a "− 5" beside it (17, 12, 7, 2) and the basket
//      counts roll up. When fewer than 5 are left, "2 < 5" writes itself by the tag, the baskets are circled, and their
//      count 3 flies up into the banner: 17 ÷ 5 = 3 R ?.
//   3. drag the leftover apples (the tag or the heap) into the R bucket (or tap them): they hop in one by one, the 2 flies
//      up into the banner, and the check "5 × 3 + 2 = 17" writes itself under it.
// Level 0: ÷ 3–5 with 2–3 each. Level 1: ÷ 3–5 with 3–5 each. Level 2: ÷ 4–6 with 4–6 each.
// Medium mode: the tray asks for the number in each basket and for the remainder.
const M = MK, INK = '#4a2416', EY = 208, BY = 380, PX = 168, PB = 548, TX = 262, TY = 470, RX = 318, RY = 540, HX = 52, HY = 610;
const APPLE = ['#e8443a', '#f2603a', '#d83a4a'];
function pick(g) {
  const L = g.level, ri = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  const d = L === 2 ? ri(4, 6) : ri(3, 5), q = L === 0 ? ri(2, 3) : L === 1 ? ri(3, 5) : ri(4, 6), r = ri(1, d - 1);
  return { d, q, r, n: d * q + r };
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function apple(c, x, y, r, col = APPLE[0]) {
  c.fillStyle = col; c.strokeStyle = '#6a1a1a'; c.lineWidth = 1.4; c.beginPath(); c.arc(x - r * 0.28, y, r * 0.8, 0, 7); c.arc(x + r * 0.28, y, r * 0.8, 0, 7); c.fill();
  c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke(); c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(x - r * 0.35, y - r * 0.35, r * 0.25, r * 0.15, -0.6, 0, 7); c.fill();
  c.strokeStyle = '#5a3a1a'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y - r * 0.8); c.lineTo(x + 1, y - r * 1.25); c.stroke(); c.fillStyle = '#5aa83a'; c.beginPath(); c.ellipse(x + r * 0.4, y - r * 1.1, r * 0.35, r * 0.16, -0.5, 0, 7); c.fill();
}
function label(c, s, x, y, size, fill, stroke = 'rgba(40,16,10,0.9)') { c.save(); c.font = M.NUMF(size, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = Math.max(4, size * 0.22); c.strokeStyle = stroke; c.strokeText(s, x, y); c.fillStyle = fill; c.fillText(s, x, y); c.restore(); }

// ---------------- the orchard at dusk (baked) ----------------
function orchard(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 330); sk.addColorStop(0, '#3a3a7a'); sk.addColorStop(0.5, '#b86a8a'); sk.addColorStop(0.85, '#f6a46a'); sk.addColorStop(1, '#ffd08a'); c.fillStyle = sk; c.fillRect(0, 0, W, 330);
  const R = P.rng(53); for (let i = 0; i < 30; i++) { c.fillStyle = `rgba(255,250,230,${0.2 + R() * 0.5})`; c.beginPath(); c.arc(R() * W, R() * 120, R() * 1.2 + 0.3, 0, 7); c.fill(); }
  c.fillStyle = '#fff0c8'; c.beginPath(); c.arc(250, 300, 26, Math.PI, 0); c.fill();
  // rolling hills with rows of little trees
  c.fillStyle = '#7a5a7a'; c.beginPath(); c.moveTo(0, 300); for (let x = 0; x <= W; x += 20) c.lineTo(x, 286 + Math.sin(x * 0.02) * 12); c.lineTo(W, 340); c.lineTo(0, 340); c.fill();
  for (let i = 0; i < 14; i++) { const x = 10 + i * 26, y = 300 + Math.sin(x * 0.02) * 10; c.fillStyle = '#5a4a62'; c.beginPath(); c.arc(x, y, 9, 0, 7); c.fill(); }
  // the orchard grass
  const gr = c.createLinearGradient(0, 316, 0, H); gr.addColorStop(0, '#8a9a4a'); gr.addColorStop(0.4, '#6a8a3a'); gr.addColorStop(1, '#4a6a2a'); c.fillStyle = gr; c.beginPath(); c.moveTo(0, 322); c.quadraticCurveTo(180, 304, W, 322); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  c.strokeStyle = 'rgba(40,70,20,0.5)'; c.lineWidth = 2; for (let i = 0; i < 60; i++) { const x = R() * W, y = 340 + R() * 300; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 2, y - 7); c.stroke(); }
  // two apple trees at the edges hold the banner
  for (const [x, f] of [[10, 1], [350, -1]]) { c.fillStyle = '#5a3a24'; c.beginPath(); c.moveTo(x - 12, 340); c.lineTo(x - 6, 150); c.lineTo(x + 6, 150); c.lineTo(x + 12, 340); c.fill();
    for (const [dx, dy, r] of [[0, 120, 46], [f * 26, 150, 34], [-f * 20, 160, 32], [f * 8, 92, 30]]) { c.fillStyle = '#3e6a34'; c.beginPath(); c.arc(x + dx, dy, r, 0, 7); c.fill(); c.fillStyle = 'rgba(140,190,90,0.3)'; c.beginPath(); c.arc(x + dx - 8, dy - 8, r * 0.6, 0, 7); c.fill(); }
    for (let i = 0; i < 6; i++) apple(c, x + f * (R() * 40 - 6), 100 + R() * 70, 5, APPLE[i % 3]); }
  // shadows on the grass under the heap and the bucket
  c.fillStyle = 'rgba(30,40,10,0.3)'; c.beginPath(); c.ellipse(PX, PB + 8, 90, 12, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(RX, RY + 26, 34, 8, 0, 0, 7); c.fill();
}
function bucket(c, x, y, glow) {
  c.save(); if (glow) { c.shadowColor = '#ffe08a'; c.shadowBlur = 18 * glow; }
  c.fillStyle = '#9a6a3a'; c.strokeStyle = '#4a2a14'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 30, y - 22); c.lineTo(x + 30, y - 22); c.lineTo(x + 23, y + 24); c.lineTo(x - 23, y + 24); c.closePath(); c.fill(); c.stroke(); c.restore();
  c.strokeStyle = '#5a5a6a'; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 28, y - 10); c.lineTo(x + 28, y - 10); c.moveTo(x - 25, y + 12); c.lineTo(x + 25, y + 12); c.stroke();
  c.fillStyle = '#3a1a0a'; c.beginPath(); c.ellipse(x, y - 22, 30, 7, 0, 0, 7); c.fill();
  label(c, 'R', x, y + 2, 24, '#fff4dc', '#4a2414');
}
function basket(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = '#c8904a'; c.strokeStyle = '#6a3a14'; c.lineWidth = 2; c.beginPath(); c.moveTo(-24, -8); c.lineTo(24, -8); c.lineTo(18, 16); c.lineTo(-18, 16); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(106,58,20,0.55)'; c.lineWidth = 1.2; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * 9, -8); c.lineTo(i * 7, 16); c.stroke(); } c.beginPath(); c.moveTo(-21, 4); c.lineTo(21, 4); c.stroke();
  c.fillStyle = '#e0a860'; rr(c, -26, -12, 52, 7, 3); c.fill(); c.strokeStyle = '#6a3a14'; c.lineWidth = 2; c.stroke();
  c.restore();
}

MG.add({
  id: 'longway_remainder', stage: 'longway', cmd: 'REMAINDER!', hint: 'drag', time: 9, mood: 'bright', winText: 'Shared!', hold: 1.7,
  card: {
    title: 'Division with a remainder', ref: 'Grade 4', kind: 'Division',
    text: 'Dividing means sharing out fairly. 17 ÷ 5 asks: if 17 apples are shared among 5 baskets, how many go in each?\n\nDeal them out one round at a time, one apple per basket. After 3 rounds, 15 apples are in the baskets, 3 in each. Only 2 are left, and 2 is not enough for another round. Those 2 are the remainder.\n\nWe write 17 ÷ 5 = 3 R 2. Check it: 5 baskets of 3 is 15, and 15 + 2 = 17. The remainder is always smaller than the number you divide by.',
    note: 'Share out as many full rounds as you can; what is left over is the remainder. Divisor × answer + remainder = the starting number.',
    ask: 'What is 23 ÷ 4? What is 30 ÷ 7?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { d, q, r, n } = S;
    S.left = n; S.inB = Array(d).fill(0); S.bAt = []; S.flying = []; S.cnt = Array(d).fill(null); S.face = 'happy'; S.hopIn = [];
    const sp = Math.min(66, 320 / d); S.bs = Math.min(1.25, sp / 52); S.bx = i => 180 + (i - (d - 1) / 2) * sp;
    S.N = M.num(n, 'N'); S.D = M.num(d, 'D'); S.Q = M.slot('ans', { col: '#9a6a4a' });
    S.row = M.row(S.N, M.op('÷', 'div'), S.D, M.op('=', 'eq'), S.Q); M.place(g, 'ex', S.row, 180, EY, 40, { col: INK }); M.inert(g, ['div', 'eq', 'Rt', 'qv', 'rv']);
    S.PC = M.num(n, 'pc'); M.place(g, 'tag', S.PC, TX, TY + 10, 28, { col: '#fff6e0' });
    // the heap: rows from the bottom, each a little narrower
    S.heap = []; { let row = 0, k = 0; while (k < n) { const w = Math.max(1, (n <= 15 ? 6 : n <= 24 ? 7 : 9) - row); for (let j = 0; j < w && k < n; j++, k++) S.heap.push([PX + (j - (Math.min(w, n - (k - j)) - 1) / 2) * 18, PB - row * 15]); row++; } }
    S.pileBox = () => { const pts = S.heap.slice(0, S.left); if (!pts.length) return { x: PX, y: PB - 10, w: 60, h: 30 }; const ys = pts.map(p => p[1]); return { x: PX, y: (Math.min(...ys) + PB) / 2, w: 170, h: PB - Math.min(...ys) + 26 }; };
    M.zone(g, 'shelf', { x: 180, y: BY - 6, w: 330, h: 80 }); M.zone(g, 'pile', S.pileBox()); M.zone(g, 'bucket', { x: RX, y: RY, w: 64, h: 56 });
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    const fly = (g, from, to, dur, then) => S.flying.push({ from, to, t0: g.t, dur, then, col: APPLE[S.flying.length % 3] });

    // 1. set out the baskets
    const setOut = g => {
      const T = M.pace(g), per = Math.min(0.16, 0.7 / d) * T; S.out = true; M.show(g, 0.3 * T + d * per + 0.35 * T); hop(g, 'wow'); S.point = true; S.mk.zones.shelf = false;
      M.circle(g, 'D', { dur: 0.45 * T }); M.light(g, 'D', { col: '#ffd25a' });
      const st = []; for (let i = 0; i < d; i++) st.push([0.3 * T + i * per, g => { S.bAt[i] = g.t; g.sfx('pop', { pitch: 0.9 + i * 0.08 }); }]);
      st.push([0.3 * T + d * per + 0.15 * T, g => { M.unlight(g, 'D'); S.point = false; M.zone(g, 'shelf', { x: 180, y: BY - 6, w: 330, h: 80 }); }]);
      M.at(g, st);
    };
    // 2. deal round by round
    const dealT = g => { const T = M.pace(g); return { T, rt: Math.max(0.2, Math.min(0.36, 1.6 / q) * T) }; };
    const dealMove = () => { const { T: T0, rt: rt0 } = dealT(g), end0 = 0.1 * T0 + q * rt0 + 0.1 * T0; return {
      busy: 0.1, askAt: end0 + 0.55 * T0, after: 0.75 * T0, ask: { v: q, wrong: [q + 1, q - 1, r, d].filter(w => w > 0 && w !== q) },
      then(g) { const { T, rt } = dealT(g); S.dealt = true; S.point = true; hop(g, 'think'); g.sfx('swoosh');
        const st = [];
        for (let k = 0; k < q; k++) st.push([0.1 * T + k * rt, g => {
          for (let i = 0; i < d; i++) { const idx = S.left - 1 - i, from = S.heap[idx]; M.later(g, i * rt * 0.08, g => fly(g, from, [S.bx(i), BY - 2], rt * 0.62, g => { S.inB[i]++; if (i === 0) g.sfx('tap', { pitch: 1 + k * 0.1, vol: 0.5 }); }), true); }
          S.left -= d; M.roll(g, S.PC, S.left, { delay: rt * 0.3, dur: rt * 0.45 });
          M.note(g, { node: M.row(M.op('−'), M.num(d)), at: 'pc', off: [0, -34], s: 24, col: '#ffe08a', write: rt * 0.25, hold: rt * 0.25, fade: rt * 0.2 });
          M.at(g, [[rt * 0.8, g => { for (let i = 0; i < d; i++) S.cnt[i] = { v: k + 1, t0: g.t }; hop(g); }]]); }]);
        const end = 0.1 * T + q * rt + 0.1 * T;
        st.push([end, g => { hop(g, 'think'); M.indicate(g, S.PC, { dur: 0.4 * T, sc: 1.3, col: '#ff8a5a' });
          M.note(g, { node: M.row(M.num(r), M.op('<'), M.num(d)), at: 'pc', off: [-4, -42], s: 26, col: '#ffe08a', pill: 'rgba(40,20,10,0.8)', write: 0.3 * T, hold: 0.5 * T, fade: 0.2 * T }); }]);
        st.push([end + 0.3 * T, g => { M.circle(g, [[S.bx(0) - 26, BY - 30], [S.bx(d - 1) + 26, BY + 34]], { dur: 0.5 * T, col: '#ffe08a' }); }]);
        M.at(g, st); M.show(g, end + 0.55 * T); },
      resolve(g) { const { T } = dealT(g); M.show(g, 0.75 * T);
        S.qv = M.num(q, 'qv', { alpha: 0 }); S.rs = M.slot('rem', { col: '#9a6a4a' }); S.qrow = M.row(S.qv, M.txt(' R ', 'Rt', { col: '#a83a2a' }), S.rs);
        S.row.items[4] = S.qrow; M.place(g, 'ex', S.row, 180, EY, 40, { col: INK });
        M.fly(g, { node: M.num(q, null, { col: '#fff6e0' }), from: [S.bx(Math.floor((d - 1) / 2)), BY + 30], to: 'qv', dur: 0.42 * T, arc: -40, s0: 24, s1: 40,
          then(g) { S.qv.alpha = 1; S.qv.pop = g.t; M.sparkle(g, 'qv', { n: 10 }); g.sfx('coin'); hop(g); S.point = false; } }); },
    }; };
    // 3. the leftovers go in the R bucket
    const remMove = () => { const T = M.pace(g), per = Math.min(0.16, 0.6 / r) * T;
      return { busy: 0.1, askAt: 0.45 * T, after: 0.3 * T + r * per + 1.0 * T, ask: { v: r, wrong: [r + 1, d - r, d, r + d].filter(w => w > 0 && w !== r) },
        then(g) { S.remd = true; M.show(g, 0.45 * T); S.point = true; hop(g, 'wow'); M.circle(g, 'pc', { dur: 0.45 * T, col: '#ffe08a' }); S.bglow = g.t; },
        resolve(g) { M.show(g, 0.3 * T + r * per + 1.0 * T); const st = [];
          for (let j = 0; j < r; j++) st.push([0.1 * T + j * per, g => { const idx = S.left - 1; S.left--; M.roll(g, S.PC, S.left, { dur: 0.15 * T }); fly(g, S.heap[idx], [RX + (j - (r - 1) / 2) * 8, RY - 24], 0.3 * T, g => { S.hopIn.push(j); g.sfx('pop', { pitch: 1.1 + j * 0.1 }); g.burst(RX, RY - 22, ['#ffe08a', '#fff'], 5, 60); }); }]);
          const e = 0.1 * T + r * per + 0.25 * T;
          st.push([e, g => { M.fly(g, { node: M.num(r, null, { col: '#fff6e0' }), from: [RX, RY - 30], to: 'rem', dur: 0.4 * T, arc: -60, s0: 26, s1: 40,
            then(g) { S.rs.fill = M.num(r, 'rv', { _born: -1, pop: g.t, col: '#a83a2a' }); M.relayout(g, 'ex'); M.sparkle(g, 'rem', { n: 14, cols: ['#ffe08a', '#ff8a5a', '#fff'] }); g.sfx('sparkle'); hop(g, 'laugh'); } }); }]);
          st.push([e + 0.45 * T, g => { M.note(g, { node: M.row(M.num(d), M.op('×'), M.num(q), M.op('+'), M.num(r), M.op('='), M.num(n)), at: [180, EY + 54], s: 26, col: '#fff6e0', pill: 'rgba(40,20,10,0.75)', write: 0.4 * T, hold: 0.6 * T, fade: 0.25 * T }); S.point = false; }]);
          M.at(g, st); } };
    };
    M.play(g, {
      moves(g) {
        if (!S.out) return [{ drag: 'D', to: 'shelf', area: [0, 250, 360, 420], busy: 0.1, then: setOut }];
        if (!S.dealt) { const mv = dealMove();
          return ['pc', 'pile', 'N'].map(src => ({ ...mv, drag: src, to: 'shelf', area: [0, 250, 360, 420] })); }
        if (!S.qv || S.qv.alpha < 1) return [];
        if (S.remd) return [];
        const rm = remMove();
        return [{ ...rm, drag: 'pc', to: 'bucket' }, { ...rm, drag: 'pile', to: 'bucket' }, { ...rm, tap: ['pc', 'pile', 'rem'] }];
      },
      area(g) { const mv = M.current(g)[0]; return mv ? [].concat(mv.drag || mv.tap).slice(0, 1) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); const S = g.s; S.flying = S.flying.filter(f => { if (g.t - f.t0 >= f.dur) { if (f.then) f.then(g); return false; } return true; }); if (!S.mk.zones || S.mk.zones.pile !== false) M.zone(g, 'pile', S.pileBox()); if (S.remd) S.mk.zones.pile = false; },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, { d } = S;
    c.drawImage(g.bake('remainder_orchard', orchard), 0, 0, 360, 640);
    // fireflies over the grass
    for (let i = 0; i < 10; i++) { const x = (i * 53 + Math.sin(t * 0.6 + i) * 24 + 400) % 360, y = 330 + (i * 37) % 280 + Math.cos(t * 0.8 + i * 1.7) * 12, a = 0.3 + 0.6 * Math.abs(Math.sin(t * 1.8 + i));
      c.fillStyle = `rgba(255,240,150,${a * 0.3})`; c.beginPath(); c.arc(x, y, 6, 0, 7); c.fill(); c.fillStyle = `rgba(255,250,180,${a})`; c.beginPath(); c.arc(x, y, 2, 0, 7); c.fill(); }
    // the banner on its rope
    c.save(); c.strokeStyle = '#6a4a2a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(10, 150); c.quadraticCurveTo(40, EY - 40, 46, EY - 32); c.moveTo(350, 150); c.quadraticCurveTo(320, EY - 40, 314, EY - 32); c.stroke();
    const sw = Math.sin(t * 1.3) * 1.5; c.translate(0, sw);
    c.fillStyle = 'rgba(30,10,10,0.3)'; c.beginPath(); c.moveTo(44, EY - 32); c.lineTo(316, EY - 32); c.lineTo(316, EY + 24); c.quadraticCurveTo(180, EY + 36, 44, EY + 24); c.closePath(); c.translate(3, 5); c.fill(); c.translate(-3, -5);
    const bg = c.createLinearGradient(0, EY - 36, 0, EY + 30); bg.addColorStop(0, '#fff6e2'); bg.addColorStop(1, '#f2dcb8'); c.fillStyle = bg;
    c.beginPath(); c.moveTo(42, EY - 36); c.lineTo(318, EY - 36); c.lineTo(318, EY + 22); c.quadraticCurveTo(180, EY + 34, 42, EY + 22); c.closePath(); c.fill(); c.strokeStyle = '#a8603a'; c.lineWidth = 2.5; c.stroke();
    c.strokeStyle = 'rgba(168,96,58,0.5)'; c.setLineDash([5, 4]); c.lineWidth = 1.5; c.beginPath(); c.moveTo(50, EY - 29); c.lineTo(310, EY - 29); c.stroke(); c.setLineDash([]);
    c.restore();
    M.drawEx(g, c, 'ex');
    // the baskets drop in one by one, numbered as they land
    for (let i = 0; i < d; i++) { const at = S.bAt[i]; if (at == null) continue; const k = M.clamp((t - at) / 0.25, 0, 1), x = S.bx(i), y = BY + 10 - (1 - M.ease(k)) * 90;
      c.save(); c.globalAlpha = Math.min(1, k * 3);
      for (let j = 0; j < S.inB[i]; j++) apple(c, x + ((j % 3) - 1) * 13 * S.bs, y - 12 * S.bs - Math.floor(j / 3) * 10 * S.bs, 7 * S.bs, APPLE[(i + j) % 3]);
      basket(c, x, y, S.bs * (1 + (k >= 1 && t - at < 0.4 ? Math.sin((t - at - 0.25) / 0.15 * Math.PI) * 0.08 : 0)));
      c.restore();
      const cn = S.cnt[i]; if (cn) { const kk = M.clamp((t - cn.t0) / 0.25, 0, 1); label(c, String(cn.v), x, y + 38, 24 * (1 + Math.sin(kk * Math.PI) * 0.35), '#fff6e0'); }
      else if (t - at < 0.9 && !S.dealt) { c.save(); c.globalAlpha = 1 - M.clamp((t - at - 0.5) / 0.4, 0, 1); label(c, String(i + 1), x, y + 38, 22, '#ffe08a'); c.restore(); } }
    // the heap and its tag
    for (let i = 0; i < S.left; i++) { const [x, y] = S.heap[i], lit = S.dealt && S.qv && !S.remd; apple(c, x, y, 9.5, lit ? (Math.sin(t * 6 + i) > 0 ? '#ff6a4a' : APPLE[i % 3]) : APPLE[i % 3]); }
    const tb = M.box(g, 'pc'); if (tb) { c.save(); c.strokeStyle = '#5a3a1a'; c.lineWidth = 3; c.beginPath(); c.moveTo(tb.x, tb.y + 18); c.lineTo(tb.x, TY + 50); c.stroke();
      c.fillStyle = 'rgba(30,10,10,0.3)'; rr(c, tb.x - Math.max(26, tb.w / 2 + 12) + 3, tb.y - 19 + 4, Math.max(52, tb.w + 24), 38, 9); c.fill();
      c.fillStyle = '#8a5a2a'; rr(c, tb.x - Math.max(26, tb.w / 2 + 12), tb.y - 19, Math.max(52, tb.w + 24), 38, 9); c.fill(); c.strokeStyle = '#4a2a10'; c.lineWidth = 2.5; c.stroke(); c.restore(); }
    M.drawEx(g, c, 'tag');
    // the R bucket, with the apples that hopped in
    bucket(c, RX, RY, S.bglow != null ? Math.max(0, 1 - (t - S.bglow) / 1.5) : 0);
    S.hopIn.forEach((j, i) => apple(c, RX + (j - (S.r - 1) / 2) * 12, RY - 24, 8, APPLE[j % 3]));
    // apples in flight
    for (const f of S.flying) { const k = M.clamp((t - f.t0) / f.dur, 0, 1), e = M.easeIO(k), x = M.lerp(f.from[0], f.to[0], e), y = M.lerp(f.from[1], f.to[1], e) - Math.sin(e * Math.PI) * 60; if (k < 1) apple(c, x, y, 9, f.col); }
    // a dragged heap shows a handful of apples under the finger
    const P0 = K.press; if (P0 && P0.dragging && P0.id === 'pile') for (let j = 0; j < 5; j++) apple(c, P0.x + (j - 2) * 12, P0.y - 20 - (j % 2) * 8, 8, APPLE[j % 3]);
    // the hedgehog
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missK = K.missAt >= 0 && t - K.missAt < 0.5;
    const expr = won ? 'laugh' : lost || missK ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'hedgehog', HX + (missK ? Math.sin((t - K.missAt) * 40) * 3 : 0), HY - hopK * 18, 1.4, { t, pose, expr }); else SCN.host(g, c, 'hedgehog', HX, HY, 1.2);
    M.drawUI(g, c);
  },
});
