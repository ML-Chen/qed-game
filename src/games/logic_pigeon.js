// logic_pigeon.js — PIGEONHOLE! If n pigeons go into k holes and n > k, some hole gets at least ⌈n ÷ k⌉ pigeons.
// A city rooftop at sunrise: a wooden dovecote with k holes, and a flock of pigeons on a wire below it. The sign asks
// ⌈n ÷ k⌉ = ? (the fewest pigeons the fullest hole can have), with a small key "n pigeons · k holes".
// Moves: 1. Drag the flock (any pigeon on the wire) up to the dovecote: the best anyone can do is spread them out, so one
//           pigeon flies into each hole in turn while each hole's counter rolls up, and "4 − 3 = 1 left" writes itself
//           by the wire. Level 2 needs a second round (another pigeon in each hole).
//        2. Drag the pigeon that is left onto any hole you like (every hole is a valid choice: that is the point):
//           it squeezes in, the two squabble and feathers fly, the counter rolls to 2, "1 + 1 = 2" writes itself and 2
//           flies into the sign. With two left over (level 2), the second one then flies to another hole by itself.
// Level 0: 4 pigeons, 3 holes. Level 1: 5 or 6 pigeons, 4 or 5 holes. Level 2: 7 in 3 or 9 in 4 or 8 in 3 (two rounds).
// Medium mode: the fullest hole's count is picked from the tray.
const M = MK, SIGNY = 212, CY = 372, WY = 532, INK = '#fff4dc', PIG = '#8a92ac', WOOD = '#b0703a';
function pick(g) {
  const L = g.level, r = a => a[Math.floor(g.rand() * a.length)];
  const [n, k] = L === 0 ? [4, 3] : L === 1 ? r([[5, 4], [6, 5], [4, 3]]) : r([[7, 3], [9, 4], [8, 3]]);
  const q = Math.floor(n / k), rem = n - q * k; return { n, k, q, rem, ans: q + 1 };
}
function roof(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 470); [[0, '#4a5ab0'], [0.4, '#b88ac8'], [0.75, '#ffb09a'], [1, '#ffe2b0']].forEach(([k, col]) => sk.addColorStop(k, col)); c.fillStyle = sk; c.fillRect(0, 0, W, H);
  const sun = c.createRadialGradient(80, 440, 6, 80, 440, 200); sun.addColorStop(0, 'rgba(255,248,210,1)'); sun.addColorStop(0.15, 'rgba(255,220,170,0.55)'); sun.addColorStop(1, 'rgba(255,200,160,0)'); c.fillStyle = sun; c.fillRect(0, 220, W, 300);
  // far skyline
  c.fillStyle = '#9a7ab0'; for (let i = 0; i < 12; i++) { const x = i * 32 - 6, h = 40 + (i * 37 % 60); c.fillRect(x, 470 - h, 26, h); }
  c.fillStyle = 'rgba(255,230,180,0.5)'; for (let i = 0; i < 30; i++) { const x = (i * 47) % 360, y = 420 + (i * 23) % 40; c.fillRect(x, y, 3, 4); }
  c.fillStyle = '#7a5a90'; for (let i = 0; i < 8; i++) { const x = i * 48 + 10, h = 30 + (i * 29 % 40); c.fillRect(x, 490 - h, 34, h); }
  // our rooftop: tar-paper roof and a parapet
  const rf = c.createLinearGradient(0, 560, 0, H); rf.addColorStop(0, '#6a4a5a'); rf.addColorStop(1, '#3a2a3a'); c.fillStyle = rf; c.fillRect(0, 566, W, H - 566);
  c.fillStyle = '#a86a5a'; c.fillRect(0, 556, W, 14); c.fillStyle = '#c8806a'; c.fillRect(0, 556, W, 4);
  c.strokeStyle = 'rgba(60,30,40,0.5)'; c.lineWidth = 1; for (let x = 0; x < W; x += 24) { c.beginPath(); c.moveTo(x, 560); c.lineTo(x, 570); c.stroke(); }
  // chimney with a wisp, and the wire's two poles
  c.fillStyle = '#8a4a3a'; c.fillRect(300, 520, 30, 40); c.fillStyle = '#6a3a2a'; c.fillRect(296, 516, 38, 8);
  c.fillStyle = '#5a3a2a'; c.fillRect(18, WY - 6, 6, 70); c.fillRect(336, WY - 6, 6, 70);
}
function coopShape(c, k, t) {
  const w = k * 62 + 24, x0 = 180 - w / 2, top = CY - 44;
  c.save(); c.fillStyle = 'rgba(40,20,30,0.3)'; c.fillRect(x0 + 6, top + 6, w, 92);
  // pole
  c.fillStyle = '#6a4228'; c.fillRect(174, CY + 48, 12, 120);
  // roof
  c.fillStyle = '#8a3a3a'; c.beginPath(); c.moveTo(x0 - 14, top + 2); c.lineTo(180, top - 40); c.lineTo(x0 + w + 14, top + 2); c.closePath(); c.fill(); c.fillStyle = '#a84a44'; c.beginPath(); c.moveTo(x0 - 14, top + 2); c.lineTo(180, top - 40); c.lineTo(180, top - 30); c.lineTo(x0 - 2, top + 2); c.fill();
  const g = c.createLinearGradient(0, top, 0, top + 92); g.addColorStop(0, '#d8945a'); g.addColorStop(1, WOOD); c.fillStyle = g; c.fillRect(x0, top, w, 92);
  c.strokeStyle = 'rgba(90,40,20,0.35)'; c.lineWidth = 1.5; for (let y = top + 18; y < top + 92; y += 18) { c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke(); }
  c.restore(); return { x0, w };
}
const holeX = (k, j) => 180 + (j - (k - 1) / 2) * 62;

MG.add({
  id: 'pigeon', stage: 'logic', cmd: 'PIGEONHOLE!', hint: 'drag', time: 9, mood: 'bright', winText: 'Squeezed in!', hold: 1.7,
  card: {
    title: 'The pigeonhole principle', ref: 'Discrete math', kind: 'Logic and proof',
    text: 'If there are more pigeons than holes, some hole must get at least two pigeons. It sounds obvious, but it proves surprising facts.\n\nWhy it is true: try to keep every hole to one pigeon. Put one pigeon in each hole. With 4 pigeons and 3 holes, one pigeon is still left over, and wherever it goes, that hole now has 2.\n\nThe general rule: n pigeons in k holes means some hole has at least ⌈n ÷ k⌉, n ÷ k rounded up. 7 pigeons in 3 holes: two each uses 6, the 7th makes a hole with 3.\n\nFor example, among any 13 people, two share a birth month: 13 people, 12 months.',
    note: 'n pigeons in k holes: some hole holds at least ⌈n ÷ k⌉ (n ÷ k rounded up).',
    ask: 'How many socks must you pull from a drawer of black and white socks to be sure of a matching pair? Among 25 students, must 3 share a birth month?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g), { n, k } = p;
    // the pigeons, sitting on the wire
    const sp = Math.min(34, 300 / n); S.pg = [...Array(n)].map((_, i) => ({ i, x: 180 + (i - (n - 1) / 2) * sp, y: WY, home: null, slot: 0, phase: i * 1.3, face: i % 2 ? -1 : 1 }));
    S.cnt = [...Array(k)].map(() => M.num(0)); S.inHole = [...Array(k)].map(() => []);
    S.ans = M.slot('ans', { w: 46 });
    S.top = M.row(M.txt('⌈', 'cl'), M.num(n, 'nn'), M.op('÷', 'dv'), M.num(k, 'kk'), M.txt('⌉', 'cr'), M.op('=', 'eq'), S.ans);
    M.place(g, 'top', S.top, 180, SIGNY + 4, 36, { col: INK }); M.inert(g, ['cl', 'nn', 'dv', 'kk', 'cr', 'eq', 'ans']);
    S.round = 0; S.face = (g, e) => { S.ex = e; S.faceT = g.t; g.s.mk.lastMove = g.t; };
    const zones = () => { const Z = g.s.mk; for (const id of Object.keys(Z.box)) if (/^(p\d+|h\d+|coop)$/.test(id)) { delete Z.box[id]; if (Z.zones) delete Z.zones[id]; }
      for (const q of S.pg) if (q.home == null) M.zone(g, 'p' + q.i, { x: q.x, y: q.y - 14, w: Math.min(30, sp), h: 34, s: 24 });
      for (let j = 0; j < k; j++) M.zone(g, 'h' + j, { x: holeX(k, j), y: CY, w: 52, h: 66, s: 24 });
      M.zone(g, 'coop', { x: 180, y: CY - 30, w: k * 62 + 24, h: 40, s: 24 }); };
    S.zones = zones; zones();
    g.dur *= (2.6 + 1.05 * (p.q + 1)) / 8;
    const left = () => S.pg.filter(q => q.home == null);
    const flyTo = (g, q, j, t0, dur) => { const slot = S.inHole[j].length; S.inHole[j].push(q); q.home = j; q.fl = { x0: q.x, y0: q.y, t0: g.t + t0, dur }; q.slot = slot; zones(); };
    M.play(g, {
      moves(g) {
        const lf = left();
        // 1. spread them out: one more pigeon in every hole
        if (S.round < p.q) { const src = lf.map(q => 'p' + q.i), to = ['coop', ...[...Array(k).keys()].map(j => 'h' + j)];
          const st = 0.2 * T, len = (0.15 + st / T * (k - 1) + 0.5 + 0.55) * T;
          return [{ drag: src, to, busy: 0.1, then(g) { S.round++; M.show(g, len); S.face(g, 'wow'); g.sfx('whoosh');
            const go = lf.slice(0, k); go.forEach((q, j) => { flyTo(g, q, j, 0.15 * T + j * st, 0.5 * T); M.at(g, [[0.15 * T + j * st + 0.5 * T, g => { M.roll(g, S.cnt[j], S.round, { dur: 0.25 * T }); g.sfx(j % 2 ? 'tap' : 'pop'); g.burst(holeX(k, j), CY + 20, ['#fff', '#d8d8e8'], 4, 50); }]]); });
            const rest = lf.length - k;
            M.at(g, [[0.15 * T + st * (k - 1) + 0.55 * T, g => { M.note(g, { node: M.row(M.num(lf.length), M.op('−'), M.num(k), M.op('='), M.num(rest), M.gap(8), M.txt('left')), at: [180, WY - 58], s: 26, col: '#ffffff', pill: 'rgba(40,20,50,0.78)', write: 0.35 * T, hold: 0.5 * T, fade: 0.3 * T }); }]]); } }]; }
        // 2. the leftover pigeon goes into any hole at all
        if (!S.extra) { const q = lf[0], to = [...Array(k).keys()].map(j => 'h' + j);
          return [{ drag: 'p' + q.i, to, busy: 0.1, askAt: 0.95 * T, after: 1.1 * T, ask: { v: p.ans, wrong: [p.q, n, k, p.ans + 1] },
            then(g, a, b) { const j = +b.slice(1); S.extra = { j, t0: g.t }; M.show(g, 0.95 * T); S.face(g, 'wow'); g.sfx('swoosh');
              flyTo(g, q, j, 0, 0.45 * T);
              M.at(g, [[0.45 * T, g => { S.squab = { j, t0: g.t }; g.sfx('boing'); M.roll(g, S.cnt[j], p.ans, { dur: 0.25 * T }); M.circle(g, 'h' + j, { dur: 0.45 * T, col: '#ffe070' });
                g.burst(holeX(k, j), CY - 10, ['#fff', '#c8cce0', '#9aa0b8'], 12, 110); }],
                [0.6 * T, g => { S.q = M.num(p.ans, 'nq', { alpha: 0 }); S.note = M.row(M.num(p.q), M.op('+'), M.num(1), M.op('='), S.q);
                  M.place(g, 'note', S.note, M.clamp(holeX(k, j), 70, 290), CY + 98, 26, { col: '#fff8e0' }); M.writeIn(g, S.note, { dur: 0.3 * T }); }]]); },
            resolve(g) { M.show(g, 1.1 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); g.sfx('ding');
              M.at(g, [[0.3 * T, g => { const bq = { ...M.box(g, 'nq') }; M.tween(g, S.note, { alpha: 0 }, 0.25 * T);
                M.fly(g, { node: M.num(p.ans, null, { col: '#fff4c0' }), from: [bq.x, bq.y], to: 'ans', dur: 0.45 * T, arc: -40, s0: 26, s1: 36, then(g) { S.ans.fill = M.num(p.ans, null, { pop: g.t }); M.sparkle(g, 'ans', { n: 14 }); g.sfx('coin'); S.face(g, 'laugh'); S.cheer = g.t; } });
                // a second leftover (level 2) flies to another hole by itself
                const more = left(); more.forEach((q2, m2) => { const j2 = (S.extra.j + 1 + m2) % k; flyTo(g, q2, j2, 0.1 * T, 0.45 * T); M.at(g, [[0.55 * T, g => { M.roll(g, S.cnt[j2], S.inHole[j2].length, { dur: 0.25 * T }); g.sfx('pop'); }]]); }); }],
                [1.0 * T, g => { delete g.s.mk.ex.note; }]]); } }];
        }
        return [];
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, p = S.p, k = p.k, E = M.easeIO;
    c.drawImage(g.bake('logic_pigeon_roof', roof), 0, 0, 360, 640);
    // drifting clouds
    for (let i = 0; i < 3; i++) { const x = (t * (6 + i * 3) + i * 140) % 460 - 60, y = 110 + i * 46; c.fillStyle = 'rgba(255,240,240,0.35)'; c.beginPath(); c.ellipse(x, y, 40, 10, 0, 0, 7); c.ellipse(x + 26, y - 6, 26, 9, 0, 0, 7); c.fill(); }
    SCN.panel(c, 'sign', 180, SIGNY + 2, 250, 86, t);
    { c.save(); c.font = M.NUMF(18, 600); c.textAlign = 'center'; c.fillStyle = 'rgba(255,244,220,0.95)'; c.fillText(`${p.n} pigeons · ${p.k} holes`, 180, SIGNY + 33); c.restore(); }
    coopShape(c, k, t);
    // the wire
    c.save(); c.strokeStyle = '#2a1a2a'; c.lineWidth = 2; c.beginPath(); c.moveTo(21, WY - 4); c.quadraticCurveTo(180, WY + 10, 339, WY - 4); c.stroke(); c.restore();
    const miss = K.missInfo && t - K.missAt < 0.6 ? (K.missInfo.tap || K.missInfo.to || K.missInfo.drag) : null;
    // holes, with their counters
    for (let j = 0; j < k; j++) { const x = holeX(k, j), sh = miss === 'h' + j ? Math.sin((t - K.missAt) * 50) * 3 : 0, full = S.extra && +S.cnt[j].v === p.ans;
      c.save(); c.translate(sh, 0); c.fillStyle = '#2a1410'; c.beginPath(); c.moveTo(x - 22, CY + 22); c.lineTo(x - 22, CY - 10); c.arc(x, CY - 10, 22, Math.PI, 0); c.lineTo(x + 22, CY + 22); c.closePath(); c.fill();
      c.fillStyle = '#8a5a30'; c.fillRect(x - 28, CY + 22, 56, 7);
      const nd = S.cnt[j], mm = M.lay(nd, 26); c.fillStyle = full ? '#ffe070' : '#fff2d8'; c.beginPath(); c.arc(x, CY + 54, 18, 0, 7); c.fill(); c.strokeStyle = full ? '#c88a1a' : '#8a5a30'; c.lineWidth = 2; c.stroke();
      M.draw(c, nd, x - mm.w / 2, CY + 54 + (mm.a - mm.d) / 2, 26, { t, col: '#4a2418' }); c.restore(); }
    // pigeons: on the wire, flying, or in their holes
    const won = g.done && g.result === 'win';
    for (const q of S.pg) {
      let x = q.x, y = q.y + Math.sin((q.x - 180) / 160 * Math.PI / 2 + Math.PI / 2) * 6 - 2, pose = 'idle', s = 0.7, face = q.face;
      if (q.home != null) { const n2 = S.inHole[q.home].length, off = n2 > 1 ? (q.slot - (n2 - 1) / 2) * Math.min(20, 40 / (n2 - 1)) : 0, hx = holeX(k, q.home) + off, hy = CY + 22;
        const kf = q.fl ? M.clamp((t - q.fl.t0) / q.fl.dur, 0, 1) : 1, e = E(kf);
        if (kf < 1) { x = M.lerp(q.fl.x0, hx, e); y = M.lerp(q.fl.y0, hy, e) - Math.sin(e * Math.PI) * 60; pose = 'cheer'; face = hx > q.fl.x0 ? 1 : -1; if (t < q.fl.t0) { x = q.fl.x0; y = q.fl.y0; pose = 'idle'; } }
        else { x = hx; y = hy; s = n2 > 2 ? 0.52 : 0.6; face = off < 0 ? 1 : off > 0 ? -1 : q.face;
          const sq = S.squab && S.squab.j === q.home && t - S.squab.t0 < 0.9; if (sq) { x += Math.sin((t - S.squab.t0) * 40 + q.slot * 2) * 3; pose = 'wave'; } } }
      if (miss === 'p' + q.i) x += Math.sin((t - K.missAt) * 50) * 3;
      if (won || (S.cheer && t - S.cheer < 1)) pose = q.home != null ? 'cheer' : pose;
      const dragging = K.press && K.press.dragging && K.press.id === 'p' + q.i;
      if (dragging) { x = K.press.x; y = K.press.y + 4; pose = 'cheer'; }
      if (typeof ANI !== 'undefined') ANI.draw(c, 'bird', x, y, s, { t, phase: q.phase, pose, tint: PIG, facing: face, noShadow: q.home != null || dragging, expr: S.squab && S.squab.j === q.home && t - S.squab.t0 < 0.9 ? 'wow' : 'happy' });
      else { c.fillStyle = PIG; c.beginPath(); c.arc(x, y - 12, 10, 0, 7); c.fill(); }
    }
    M.drawEx(g, c, 'top');
    if (K.ex.note) { const e = K.ex.note, m = M.lay(e.node, e.s), wr = e.node.write, wk = wr ? E((t - wr.t0) / wr.dur) : 1; if (wk > 0) { c.save(); c.globalAlpha = (e.node.alpha ?? 1) * 0.85; c.fillStyle = 'rgba(40,20,50,0.92)'; c.beginPath(); c.roundRect(e.x - 10, e.y - m.a - 7, (m.w + 20) * wk, m.a + m.d + 14, 12); c.fill(); c.restore(); } }
    M.drawEx(g, c, 'note');
    M.drawUI(g, c);
  },
});
