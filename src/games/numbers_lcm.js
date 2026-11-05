// numbers_lcm.js — LCM! Find the least common multiple of two numbers by hopping along two number lines.
// In a meadow, a frog hops along one number line in hops of a, and a rabbit along a second line, lined up with the
// first, in hops of b. Each starts with one hop made. The player taps the animal that is behind to make it hop again.
// The working plays by itself: the animal hops, its trail draws behind it, and the sum "8 + 4 = 12" writes itself
// above the hop; the 12 then drops under the line at the landing. When both animals stand on the same number, a golden
// line joins the two landings, both labels swell, and that number flies up into lcm(4, 6) = 12.
// Level 0: small pairs, two or three hops. Level 1: three to five hops. Level 2: bigger numbers.
// Medium mode: each hop asks where the animal lands (8 + 4 = ?).
// Wrong parts: the animal that is ahead (hopping it would skip past a common multiple) and the numbers of the problem.
const M = MK, PANEL = 'glass', INK = SCN.ink(PANEL), PY = 214, TY = [318, 420], LX0 = 36, LX1 = 324;
const POOL = [[[2, 3], [4, 6], [6, 9], [2, 6], [3, 9]], [[3, 4], [6, 8], [2, 5], [10, 15], [4, 10]], [[8, 12], [9, 12], [6, 8], [12, 18], [10, 25]]];
const COL = ['#d8602a', '#2a78c8'], KIND = ['frog', 'rabbit'];
const gcd = (a, b) => b ? gcd(b, a % b) : a;
// remove the working note so that the next note starts fresh (no ghosts of the old symbols fly into it)
const dropNote = g => { const K = g.s.mk; delete K.ex.note; if (K.prevNodes) delete K.prevNodes.note; if (K.seen) delete K.seen.note; };

MG.add({
  id: 'numbers_lcm', stage: 'numbers', cmd: 'LCM!', hint: 'tap', time: 9, mood: 'bright', winText: 'They meet!', hold: 1.4,
  card: {
    title: 'Least common multiple', ref: 'Grades 5–6', kind: 'Factors and multiples',
    text: 'The multiples of a number are what you get when you count by it. The multiples of 4 are 4, 8, 12, 16 and so on. A common multiple of two numbers is on both lists. The least common multiple, written lcm, is the smallest one.\n\nTo find it, count up by both numbers at once, and always add to the one that is behind. For lcm(4, 6): 4 and 6. 4 is behind, so 8. 6 is behind, so 12. 8 is behind, so 12. Both reached 12, so lcm(4, 6) = 12.\n\nThe lcm is the common denominator you need to add fractions such as 1/4 + 1/6. It also tells you when two repeating things happen together again: a light that blinks every 4 seconds and one that blinks every 6 seconds blink together every 12 seconds.',
    note: 'Count up by both numbers, always moving the one that is behind. The first number both lists reach is the lcm.',
    ask: 'What is lcm(3, 5)? What is lcm(6, 8)?',
  },
  init(g) {
    const S = g.s; M.setup(g); const pool = POOL[g.level]; let [a, b] = pool[Math.floor(g.rand() * pool.length)]; if (g.rand() < 0.5) [a, b] = [b, a];
    const L = a * b / gcd(a, b); Object.assign(S, { st: [a, b], end: [a, b], L, hopAt: [-9, -9], met: false, sc: (LX1 - LX0) / L });
    S.prob = M.row(M.txt('lcm', 'lcm'), M.paren(M.row(M.num(a, 'a', { col: COL[0] }), M.op(',', 'cm'), M.gap(6), M.num(b, 'b', { col: COL[1] })), 'par'), M.op('=', 'eq'), M.slot('ans'));
    M.place(g, 'prob', S.prob, 180, PY, 40, { col: INK }); M.inert(g, ['lcm', 'cm', 'par', 'eq', 'ans']);
    const zones = () => [0, 1].forEach(i => M.zone(g, 'r' + i, { x: LX0 + S.end[i] * S.sc, y: TY[i] - 24, w: 56, h: 60 }));
    zones(); g.dur *= (2.6 + 1.05 * (L / a + L / b - 2)) / 8;
    const T = S.T = M.pace(g), HD = S.hopD = 0.5 * T, X = u => LX0 + u * S.sc;
    S.lab = [null, null]; S.labT = [-9, -9];
    M.play(g, {
      moves(g) {
        if (S.met) return [];
        const i = S.end[0] < S.end[1] ? 0 : 1, s = S.st[i], e = S.end[i], nx = e + s, meet = nx === S.end[1 - i];
        return [{ tap: 'r' + i, busy: 0.1, askAt: 0.55 * T, after: (meet ? 1.25 : 0.55) * T, ask: { v: nx, wrong: [nx + 1, e * s, nx - 1, e + S.st[1 - i]] },
          // the animal hops one step of its number; the sum writes itself above the hop
          then(g) { M.show(g, 0.55 * T); S.hopAt[i] = g.t; S.from = S.from || []; S.from[i] = e; S.pending = i; g.sfx(i ? 'pop' : 'ribbit');
            const y = TY[i], h = Math.min(46, s * S.sc * 0.55), nxX = M.clamp((X(e) + X(nx)) / 2, 82, 278);
            S.q = M.num(nx, 'nq', { alpha: 0 }); S.note = M.row(M.num(e, 'na'), M.op('+'), M.num(s, 'nb', { col: COL[i] }), M.op('='), S.q);
            M.place(g, 'note', S.note, nxX, y - h - 16, 26, { col: COL[i] }); M.writeIn(g, S.note, { delay: 0.1 * T, dur: 0.4 * T }); M.inert(g, ['na', 'nb', 'nq']);
            M.indicate(g, 'nb', { delay: 0.25 * T, dur: 0.3 * T, sc: 1.25 }); },
          // the landing number appears and drops under the line; if both animals stand on it, it is the lcm
          resolve(g) { const y = TY[i]; S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.18 * T }); M.indicate(g, S.q, { delay: 0.1 * T, dur: 0.3 * T, sc: 1.2 }); g.sfx('tap');
            M.show(g, (meet ? 1.25 : 0.55) * T);
            M.at(g, [[0.25 * T, g => { const qb = { ...M.box(g, 'nq') }; M.tween(g, S.note, { alpha: 0 }, 0.25 * T);
              M.fly(g, { node: M.num(nx, null, { col: COL[i] }), from: [qb.x, qb.y], to: [X(nx), y + 16], dur: 0.28 * T, arc: -18, s0: 26, s1: meet ? 20 : 16,
                then(g) { S.end[i] = nx; S.pending = null; S.lab[i] = nx; S.labT[i] = g.t; zones(); g.sfx('coin'); g.s.mk.lastMove = g.t; dropNote(g);
                  g.burst(X(nx), y + 14, ['#fff', COL[i]], 6, 70);
                  if (meet) { S.met = true; S.metAt = g.t; g.sfx('magic'); } } }); }]]);
            if (meet) M.at(g, [
              [0.6 * T, g => { S.lab[0] = S.lab[1] = nx; S.labT[0] = S.labT[1] = g.t; g.burst(X(nx), (TY[0] + TY[1]) / 2, ['#ffd45a', '#fff', COL[0], COL[1]], 16, 140); }],
              [0.75 * T, g => { const slot = M.node(g, 'ans'); M.fly(g, { node: M.num(S.L, null, { col: '#c88a00' }), from: [X(nx), (TY[0] + TY[1]) / 2], to: 'ans', dur: 0.4 * T, arc: -50, s0: 22, s1: 40,
                then(g) { slot.fill = M.num(S.L, 'res', { pop: g.t, _born: -1 }); M.inert(g, ['res']); M.place(g, 'prob', S.prob, 180, PY, 40, { col: INK }); M.sparkle(g, 'res', { n: 12 }); g.sfx('ding'); g.s.mk.lastMove = g.t; } }); }],
            ]); } }];
      },
      area(g) { return S.end[0] < S.end[1] ? 'r0' : 'r1'; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, X = u => LX0 + u * S.sc;
    SCN.std(g, c, { scene: 'meadow', panel: PANEL, panelY: 318, panelH: 272 });
    if (S.met) { const x = X(S.L), k = M.clamp((t - S.metAt) / (0.35 * S.T), 0, 1); c.save(); c.strokeStyle = '#f0b020'; c.shadowColor = '#ffd45a'; c.shadowBlur = 10; c.lineWidth = 4; c.setLineDash([8, 6]); c.lineDashOffset = -t * 20;
      c.beginPath(); c.moveTo(x, TY[0] - 4); c.lineTo(x, TY[0] - 4 + (TY[1] - TY[0] + 4) * M.easeIO(k)); c.stroke(); c.restore(); }
    for (let i = 0; i < 2; i++) {
      const y = TY[i], s = S.st[i];
      // the number line, with a tick for every whole number when there is room
      c.strokeStyle = '#5a4a6a'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(LX0 - 8, y); c.lineTo(LX1 + 10, y); c.stroke();
      c.lineWidth = 1.5; if (S.sc >= 6) for (let u = 0; u <= S.L; u++) { c.beginPath(); c.moveTo(X(u), y - 4); c.lineTo(X(u), y + 4); c.stroke(); }
      c.font = M.NUMF(15); c.textAlign = 'center'; c.textBaseline = 'top'; c.fillStyle = '#5a4a6a'; c.fillText('0', X(0), y + 8);
      const arc = (x0, x1, k) => { const h = Math.min(46, (x1 - x0) * 0.55); c.strokeStyle = COL[i]; c.lineWidth = 2.5; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(x0, y - 2);
        for (let j = 1; j <= 20; j++) { const u = k * j / 20; c.lineTo(x0 + (x1 - x0) * u, y - 2 - 4 * h * u * (1 - u)); } c.stroke(); c.setLineDash([]); };
      // the hops made so far, as arcs, with each landing written under the line
      const hopping = S.pending === i, hk = M.clamp((t - S.hopAt[i]) / (S.hopD || 0.3), 0, 1);
      for (let u = s; u <= S.end[i]; u += s) {
        arc(X(u - s), X(u), 1); c.fillStyle = COL[i]; c.beginPath(); c.arc(X(u), y, 4, 0, 7); c.fill();
        const big = S.met && u === S.L, pk = S.lab[i] === u ? M.clamp((t - S.labT[i]) / 0.4, 0, 1) : 1, ps = 1 + Math.sin(pk * Math.PI) * 0.5;
        c.save(); c.translate(X(u), y + 16); c.scale(ps, ps); c.font = M.NUMF(big ? 20 : 16); c.fillStyle = big ? '#c88a00' : COL[i]; c.textBaseline = 'middle'; c.fillText(String(u), 0, 0); c.restore();
      }
      // the hop being made: its trail draws behind the animal
      if (hopping && S.from && S.from[i] != null) arc(X(S.from[i]), X(S.from[i] + s), M.easeIO(hk));
      // the animal: mid-hop it follows the arc to its next landing
      let ax = X(S.end[i]), ay = y;
      if (hk < 1 && S.from && S.from[i] != null && (hopping || S.end[i] === S.from[i] + s)) { const x0 = X(S.from[i]), x1 = X(S.from[i] + s), e = M.easeIO(hk), h = Math.min(46, (x1 - x0) * 0.55); ax = x0 + (x1 - x0) * e; ay = y - 4 * h * e * (1 - e); }
      else if (hopping) ax = X(S.from[i] + s), ay = y;
      const won = g.done && g.result === 'win', cheer = won || (S.met && t - S.metAt < 0.5);
      try { if (typeof ANI !== 'undefined') ANI.draw(c, KIND[i], ax, ay - 2, 0.5, { t: t + i, pose: cheer ? 'cheer' : hk < 1 ? 'hop' : 'idle', expr: cheer ? 'laugh' : hopping ? 'wow' : 'happy', facing: 1 }); } catch (e) { }
    }
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'note'); M.drawUI(g, c);
  },
});
