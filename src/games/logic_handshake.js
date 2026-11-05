// logic_handshake.js — HANDSHAKE! Count a graph's edges from its degrees: every edge has two ends, so
// edges = (sum of the degrees) ÷ 2. A rooftop party at sunset: four animals (the vertices) are joined by streamers (the
// edges, the handshakes). The board reads "( ? + ? + ? + ? ) ÷ 2" and "edges = ?".
//   Tap an animal (any order): it waves, each streamer it holds lights up at its end, one after another, while a counter
//      beside it rolls 1, 2, 3; then its degree flies up into the next empty ? of the sum. A dot stays on each end counted.
//   Tap the ÷ 2 (or the ?) once every animal is counted: the degrees light up and merge into their sum (10), then
//      "10 ÷ 2" is worked out by the streamers themselves: the two counted ends of each streamer slide together and merge
//      into one, the streamer is numbered, and the answer rolls 1, 2, ... 5 with them.
// Level 0: 3 or 4 streamers. Level 1: 4 or 5. Level 2: 5 or 6. Every animal holds at least one.
// Medium mode: the number of edges is picked from the tray (wrong tiles: the degree sum, sum ÷ 2 ± 1).
// Wrong moves: the ÷ 2 before every animal is counted, or an animal counted again.
const M = MK, INK = '#3a1a40', PY = 220, RY = 270, NOTE = '#c04a20';
const POS = [[96, 396], [264, 396], [96, 516], [264, 516]], KIND = ['penguin', 'frog', 'duck', 'hedgehog'];
const VCOL = ['#3a7ad8', '#3aa860', '#e0a020', '#c05a8a'], ECOL = ['#ff7a5a', '#ffd04a', '#5ad0c0', '#a080f0', '#ff9ad0', '#8ae060'];
const PAIRS = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]];
const CEN = i => ({ x: POS[i][0], y: POS[i][1] - 34 });
function gen(g) {
  const m = [[3, 4], [4, 5], [5, 6]][g.level][Math.floor(g.rand() * 2)];
  for (let tries = 0; tries < 200; tries++) {
    const idx = [0, 1, 2, 3, 4, 5]; for (let i = 5; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    const E = idx.slice(0, m).sort((a, b) => a - b).map(k => PAIRS[k]), deg = [0, 0, 0, 0]; for (const [a, b] of E) { deg[a]++; deg[b]++; }
    if (deg.every(d => d > 0) && (m === 6 || tries > 150 || !deg.every(d => d === deg[0]))) return { E, deg };
  }
  return { E: PAIRS.slice(0, m), deg: [3, 3, 2, 2] };
}
// a point along streamer e, u = 0 at its first end, 1 at its second; it sags a little in the middle
function along(e, u) { const a = CEN(e.a), b = CEN(e.b), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 + 16;
  return { x: (1 - u) * (1 - u) * a.x + 2 * (1 - u) * u * mx + u * u * b.x, y: (1 - u) * (1 - u) * a.y + 2 * (1 - u) * u * my + u * u * b.y }; }

MG.add({
  id: 'logic_handshake', stage: 'logic', cmd: 'HANDSHAKE!', hint: 'tap', time: 10, mood: 'party', winText: 'Halved!', hold: 1.8,
  card: {
    title: 'The handshake lemma', ref: 'Discrete math', kind: 'Graphs',
    text: 'A graph is a set of dots, called vertices, joined by lines, called edges. The degree of a vertex is the number of edges that touch it.\n\nThink of a party where each edge is a handshake. Every handshake uses two hands, one from each person. So if every person counts their own handshakes and we add those counts, each handshake gets counted exactly twice.\n\nThat means the sum of all the degrees is twice the number of edges. For degrees 3, 3, 2 and 2 the sum is 10, so there are 10 ÷ 2 = 5 edges.',
    note: 'The degrees of a graph always add up to twice the number of edges, so edges = (sum of degrees) ÷ 2.',
    ask: 'A graph has degrees 2, 2, 2, 2 and 4. How many edges does it have? Can a graph have degrees 3, 3, 3?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); const T = M.pace(g);
    S.edges = S.E.map(([a, b], k) => ({ a, b, k, mid: a + b === 3 ? (a === 0 ? 0.36 : 0.64) : 0.5, lit: [null, null], dot: [null, null], merge: null }));
    S.sum = S.deg.reduce((p, q) => p + q, 0); S.m = S.E.length; S.counted = []; S.st = POS.map(() => ({ tap: -9, done: false }));
    S.slots = POS.map((p, k) => M.slot('s' + k, { w: 28, col: '#8a6aa0' }));
    S.inner = M.row(S.slots.flatMap((q, k) => k ? [M.op('+', 'p' + k), q] : [q])); S.par = M.paren(S.inner, 'par');
    S.r1 = M.row(S.par, M.op('÷', 'dv'), M.num(2, 'two')); S.ans = M.slot('ans', { w: 34, col: '#8a6aa0' });
    S.r2 = M.row(M.txt('edges', 'lab'), M.op('=', 'eq'), S.ans);
    S.place1 = () => M.place(g, 'r1', S.r1, 180, PY, 34, { col: INK }); S.place2 = () => M.place(g, 'r2', S.r2, 180, RY, 34, { col: INK });
    S.place1(); S.place2();
    POS.forEach((p, i) => M.zone(g, 'v' + i, { x: p[0], y: p[1] - 34, w: 70, h: 84 }));
    M.inert(g, ['lab', 'eq', 'par', 'p1', 'p2', 'p3', 's0', 's1', 's2', 's3', 'cnt', 'tot']);
    g.dur *= (2.6 + 1.05 * 5) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    // which end of streamer e belongs to vertex i
    const endOf = (e, i) => e.a === i ? 0 : 1;

    M.play(g, {
      moves(g) {
        const out = [];
        // count the edges at an animal (glow the one with the most streamers first)
        const left = [0, 1, 2, 3].filter(i => !S.st[i].done).sort((p, q) => S.deg[q] - S.deg[p] || p - q);
        for (const i of left) out.push({ tap: 'v' + i, busy: 0.1,
          then(g) { const st = S.st[i], d = S.deg[i], slot = S.slots[S.counted.length]; st.done = true; st.tap = g.t; S.counted.push(i); hop(g, 'wow'); g.sfx('tap');
            const mine = S.edges.filter(e => e.a === i || e.b === i), side = POS[i][0] < 180 ? -1 : 1, cx = POS[i][0] + side * 50, cy = POS[i][1] - 58;
            M.circle(g, 'v' + i, { dur: 0.45 * T, col: VCOL[i], pad: 2 });
            const cnt = M.num(1, 'cnt', { col: VCOL[i], alpha: 0 }); S.cntKey = 'c' + i; M.place(g, S.cntKey, cnt, cx, cy + 12, 32, { col: VCOL[i] });
            const gap = 0.26 * T, t0 = 0.3 * T, beats = mine.map((e, j) => [t0 + j * gap, g => { const u = endOf(e, i); e.lit[u] = g.t; e.dot[u] = g.t; hop(g);
              g.sfx('pop', { p: 1 + j * 0.12 }); if (j === 0) { cnt.alpha = 1; M.writeIn(g, cnt, { dur: 0.14 * T }); } else M.roll(g, cnt, j + 1, { dur: 0.16 * T }); cnt.pop = g.t; }]);
            const tf = t0 + d * gap + 0.08 * T;
            beats.push([tf, g => { M.tween(g, cnt, { alpha: 0 }, 0.1 * T); g.sfx('swoosh');
              M.fly(g, { node: M.num(d, null, { col: VCOL[i] }), from: [cx, cy], to: slot.id, dur: 0.38 * T, arc: -40, s0: 34, s1: 34,
                then(g) { slot.fill = M.num(d, 'g' + i, { col: VCOL[i], _born: -1, pop: g.t }); S.place1(); M.sparkle(g, slot.id, { n: 8, cols: [VCOL[i], '#fff', '#ffe08a'] }); delete g.s.mk.ex['c' + i]; } }); }]);
            M.at(g, beats); M.show(g, tf + 0.42 * T); } });
        // add the degrees up, then halve: every streamer was counted from both of its ends
        if (!left.length && !S.halved) out.push({ tap: ['dv', 'two', 'ans'], busy: 0.1, get askAt() { return S.askT; }, get after() { return S.afterLen || 1.5 * T; },
          ask: { v: S.m, wrong: [S.sum, S.m + 1, S.m - 1, S.sum * 2] },
          then(g) { S.halved = true; hop(g, 'think'); const gs = S.slots.map(q => q.fill);
            M.circle(g, 'par', { dur: 0.5 * T });
            gs.forEach((q, k) => M.indicate(g, q, { delay: 0.12 * T + k * 0.1 * T, dur: 0.3 * T, sc: 1.3, col: '#ffb21f' }));
            const ta = 0.2 * T + 0.1 * T * 4; S.askT = ta + 2 * 0.36 * T + 0.45 * T + 0.6 * T;
            // a running total: the next degree slides into the total so far and fades, and the total rolls over (3 + 2 → 5, ...)
            let run = S.deg[S.counted[0]]; const first = gs[0], it = S.inner.items;
            for (let k = 1; k < 4; k++) { const tk = ta + (k - 1) * 0.36 * T;
              M.at(g, [[tk, g => { const b0 = M.box(g, first.id); for (const q of [it[2 * k - 1], it[2 * k]]) { const b = M.box(g, q.id); if (b && b0) M.tween(g, q, { dx: b0.x - b.x, alpha: 0, sc: 0.6 }, 0.24 * T); }
                  run += S.deg[S.counted[k]]; M.roll(g, first, run, { delay: 0.16 * T, dur: 0.2 * T }); M.at(g, [[0.3 * T, g => { first.pop = g.t; g.sfx('pop', { p: 1 + k * 0.1 }); }]]); }]]); }
            const tb = ta + 2 * 0.36 * T + 0.45 * T;
            M.at(g, [[tb, g => { for (let k = 1; k < 4; k++) gs[k].alpha = 0; first.col = INK; first.id = 'tot'; S.tot = first; S.slots[0].fill = null; S.r1.items = [first, S.r1.items[1], S.r1.items[2]]; S.place1(); g.sfx('ding'); M.indicate(g, first, { dur: 0.3 * T, sc: 1.25 }); }],
              [tb + 0.25 * T, g => { M.indicate(g, 'dv', { dur: 0.3 * T, sc: 1.3 }); M.indicate(g, 'two', { delay: 0.05 * T, dur: 0.3 * T, sc: 1.3 }); }]]);
            M.show(g, S.askT); },
          resolve(g) { const gap = 0.24 * T; let res = null; hop(g, 'happy');
            const beats = S.edges.map((e, k) => [0.1 * T + k * gap, g => { e.merge = g.t; g.sfx('chime', { vol: 0.5, p: 1 + k * 0.08 });
              if (!res) { res = M.num(1, 'res', { col: '#1a8a4a', alpha: 1 }); S.ans.fill = res; S.place2(); M.writeIn(g, res, { dur: 0.12 * T }); } else M.roll(g, res, k + 1, { dur: 0.16 * T });
              res.pop = g.t; const p = along(e, e.mid); g.burst(p.x, p.y, [ECOL[e.k], '#fff'], 6, 80); }]);
            const te = 0.1 * T + S.m * gap + 0.1 * T;
            beats.push([te, g => { M.indicate(g, res, { dur: 0.35 * T, sc: 1.4 }); M.sparkle(g, 'res', { n: 16 }); g.sfx('coin'); hop(g, 'laugh'); S.allAt = g.t; }]);
            M.at(g, beats); S.afterLen = te + 0.45 * T; M.show(g, S.afterLen); } });
        return out;
      },
      area(g) { const l = [0, 1, 2, 3].filter(i => !S.st[i].done).map(i => 'v' + i); return l.length ? l : ['dv']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, T = M.pace(g);
    SCN.bg(g, c, 'city');
    // the rooftop: a wooden deck behind a low wall, with string lights
    c.drawImage(g.bake('hs_roof', (cc, W, H) => {
      cc.fillStyle = '#6a4a5a'; cc.fillRect(0, 318, W, 18); cc.fillStyle = '#8a6a78'; cc.fillRect(0, 312, W, 8);
      const gr = cc.createLinearGradient(0, 336, 0, H); gr.addColorStop(0, '#b07a58'); gr.addColorStop(1, '#7a4a38'); cc.fillStyle = gr; cc.fillRect(0, 336, W, H - 336);
      cc.strokeStyle = 'rgba(60,30,20,0.35)'; cc.lineWidth = 1.5; for (let y = 352; y < H; y += 22 + (y - 336) * 0.08) { cc.beginPath(); cc.moveTo(0, y); cc.lineTo(W, y); cc.stroke(); }
      for (let i = 0; i < 9; i++) { cc.beginPath(); cc.moveTo(180 + (i - 4) * 30, 336); cc.lineTo(180 + (i - 4) * 110, H); cc.stroke(); }
    }), 0, 0, 360, 640);
    c.save(); c.strokeStyle = 'rgba(40,20,30,0.6)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, 300); c.quadraticCurveTo(180, 340, 360, 300); c.stroke();
    for (let i = 0; i < 12; i++) { const u = (i + 0.5) / 12, x = 360 * u, y = (1 - u) * (1 - u) * 300 + 2 * (1 - u) * u * 340 + u * u * 300, tw = 0.6 + 0.4 * Math.sin(t * 3 + i * 1.7);
      c.fillStyle = ['#ffe08a', '#ff9a7a', '#9ad8ff', '#c8ff9a'][i % 4]; c.globalAlpha = tw; c.shadowColor = c.fillStyle; c.shadowBlur = 10; c.beginPath(); c.arc(x, y + 5, 3.5, 0, 7); c.fill(); }
    c.restore();
    SCN.panel(c, 'glass', 180, 242, 316, 112, t);
    // the streamers (edges)
    const mergeK = e => e.merge != null ? M.clamp((t - e.merge) / (0.22 * T), 0, 1) : 0;
    for (const e of S.edges) { const mk = mergeK(e), gold = mk > 0.99;
      c.save(); c.lineCap = 'round'; c.strokeStyle = gold ? '#ffd45a' : ECOL[e.k]; c.lineWidth = gold ? 7 : 5; if (gold) { c.shadowColor = '#ffe08a'; c.shadowBlur = 12; }
      c.beginPath(); for (let j = 0; j <= 24; j++) { const p = along(e, j / 24), w = Math.sin(j / 24 * Math.PI * 6 + t * 3 + e.k) * 1.5; j ? c.lineTo(p.x, p.y + w) : c.moveTo(p.x, p.y + w); } c.stroke(); c.shadowBlur = 0;
      // a streamer end lights up when its animal counts it
      for (const u of [0, 1]) { if (e.lit[u] == null) continue; const k = (t - e.lit[u]) / (0.35 * T); if (k > 1) continue;
        c.strokeStyle = `rgba(255,255,220,${1 - k})`; c.lineWidth = 10; c.shadowColor = '#fff6c0'; c.shadowBlur = 14; c.beginPath();
        for (let j = 0; j <= 8; j++) { const v = j / 8 * 0.4, p = along(e, u ? 1 - v : v); j ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y); } c.stroke(); c.shadowBlur = 0; }
      c.restore(); }
    // the animals (vertices)
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const miss = K.missInfo && K.missInfo.tap && t - K.missAt < 0.6 ? K.missInfo.tap : null;
    POS.forEach((p, i) => { const st = S.st[i], since = t - st.tap, act = since < 1.6 * T && M.showing(g), wob = miss === 'v' + i ? Math.sin((t - K.missAt) * 46) * 4 : 0;
      const jump = since < 0.35 ? Math.sin(since / 0.35 * Math.PI) * 16 : act ? hopK * 8 : 0, cheer = won || (S.allAt != null && t - S.allAt < 0.8);
      const pose = cheer ? 'cheer' : act ? 'wave' : 'idle', expr = won ? 'laugh' : lost ? 'sad' : miss === 'v' + i ? 'think' : act ? 'wow' : 'happy';
      // a coloured ring on the deck marks each vertex
      c.save(); c.strokeStyle = VCOL[i]; c.globalAlpha = 0.85; c.lineWidth = 4; c.beginPath(); c.ellipse(p[0], p[1] + 2, 34, 9, 0, 0, 7); c.stroke(); c.restore();
      if (typeof ANI !== 'undefined') ANI.draw(c, KIND[i], p[0] + wob, p[1] - jump, 1.1, { t, phase: i * 1.7, pose, expr, facing: p[0] < 180 ? 1 : -1 }); });
    for (const e of S.edges) { const mk = mergeK(e); c.save();
      // the dots on the counted ends; when the streamer is halved they slide together and merge into one
      const ends = [0, 1].filter(u => e.dot[u] != null);
      if (mk < 0.99) for (const u of ends) { const pk = M.clamp((t - e.dot[u]) / 0.2, 0, 1), uu = M.lerp(u ? 0.72 : 0.28, e.mid, M.easeIO(mk)), p = along(e, uu), r = 7 * (1 + Math.sin(pk * Math.PI) * 0.8);
        c.fillStyle = VCOL[u ? e.b : e.a]; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.arc(p.x, p.y, r, 0, 7); c.fill(); c.stroke(); }
      else { const p = along(e, e.mid), pk = M.clamp((t - e.merge - 0.22 * T) / 0.25, 0, 1), r = 14 * (1 + Math.sin(pk * Math.PI) * 0.3);
        c.fillStyle = '#ffd45a'; c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.beginPath(); c.arc(p.x, p.y, r, 0, 7); c.fill(); c.stroke();
        c.fillStyle = INK; c.font = M.NUMF(18); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(e.k + 1), p.x, p.y + 1); }
      c.restore(); }
    M.drawEx(g, c, 'r1'); M.drawEx(g, c, 'r2'); for (let i = 0; i < 4; i++) { const e = K.ex['c' + i]; if (!e) continue; const nd = e.node, b = M.box(g, 'cnt');
      if (b && (nd.alpha ?? 1) > 0.05) { c.save(); c.globalAlpha = nd.alpha ?? 1; c.fillStyle = 'rgba(255,250,240,0.92)'; c.strokeStyle = VCOL[i]; c.lineWidth = 3; c.beginPath(); c.arc(b.x, b.y, 22, 0, 7); c.fill(); c.stroke(); c.restore(); } M.drawEx(g, c, 'c' + i); }
    M.drawUI(g, c);
  },
});
