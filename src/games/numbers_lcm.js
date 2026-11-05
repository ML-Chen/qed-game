// numbers_lcm.js — LCM! Find the least common multiple of two numbers by hopping along two number lines.
// In a meadow, a frog hops along one number line in hops of a, and a rabbit along a second line, lined up with the
// first, in hops of b. Each starts with one hop made. The player taps the animal that is behind to make it hop again
// (its new landing is written under the line). The first number both animals land on is the lcm: a golden line joins
// the two landings and lcm(4, 6) = 12 is written.
// Level 0: small pairs, two or three hops. Level 1: three to five hops. Level 2: bigger numbers.
// Medium mode: each hop asks where the animal lands (8 + 4 = ?).
// Wrong parts: the animal that is ahead (hopping it would skip past a common multiple) and the numbers of the problem.
const M = MK, PANEL = 'glass', INK = SCN.ink(PANEL), PY = 214, TY = [318, 420], LX0 = 36, LX1 = 324;
const POOL = [[[2, 3], [4, 6], [6, 9], [2, 6], [3, 9]], [[3, 4], [6, 8], [2, 5], [10, 15], [4, 10]], [[8, 12], [9, 12], [6, 8], [12, 18], [10, 25]]];
const COL = ['#d8602a', '#2a78c8'], KIND = ['frog', 'rabbit'];
const gcd = (a, b) => b ? gcd(b, a % b) : a;

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
    M.play(g, {
      moves(g) {
        if (S.met) return [];
        const i = S.end[0] < S.end[1] ? 0 : 1, s = S.st[i], e = S.end[i], nx = e + s, meet = nx === S.end[1 - i];
        return [{ tap: 'r' + i, busy: 0.1, askAt: 0, after: 0.1, ask: { v: nx, wrong: [nx + 1, e * s, nx - 1, e + S.st[1 - i]] },
          then(g) { S.hopAt[i] = g.t; S.from = S.from || []; S.from[i] = e; g.sfx(i ? 'pop' : 'ribbit'); S.pending = i; },
          resolve(g) { S.end[i] = nx; S.pending = null; zones(); g.sfx('coin');
            if (meet) { S.met = true; S.metAt = g.t; M.node(g, 'ans').fill = M.num(S.L, 'res', { pop: g.t }); M.inert(g, ['res']); M.place(g, 'prob', S.prob, 180, PY, 40, { col: INK }); g.sfx('magic'); g.burst(LX0 + nx * S.sc, (TY[0] + TY[1]) / 2, ['#ffd45a', '#fff', COL[0], COL[1]], 16, 140); } } }];
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
    if (S.met) { const x = X(S.L); c.save(); c.strokeStyle = '#f0b020'; c.lineWidth = 4; c.setLineDash([8, 6]); c.lineDashOffset = -t * 20; c.beginPath(); c.moveTo(x, TY[0] - 4); c.lineTo(x, TY[1]); c.stroke(); c.restore(); }
    for (let i = 0; i < 2; i++) {
      const y = TY[i], s = S.st[i];
      // the number line, with a tick for every whole number when there is room
      c.strokeStyle = '#5a4a6a'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(LX0 - 8, y); c.lineTo(LX1 + 10, y); c.stroke();
      c.lineWidth = 1.5; if (S.sc >= 6) for (let u = 0; u <= S.L; u++) { c.beginPath(); c.moveTo(X(u), y - 4); c.lineTo(X(u), y + 4); c.stroke(); }
      c.font = M.NUMF(15); c.textAlign = 'center'; c.textBaseline = 'top'; c.fillStyle = '#5a4a6a'; c.fillText('0', X(0), y + 8);
      // the hops made so far, as arcs, with each landing written under the line
      const hopping = S.pending === i, hk = M.clamp((t - S.hopAt[i]) / 0.24, 0, 1);
      for (let u = s; u <= S.end[i]; u += s) {
        const x0 = X(u - s), x1 = X(u), h = Math.min(46, (x1 - x0) * 0.55);
        c.strokeStyle = COL[i]; c.lineWidth = 2.5; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(x0, y - 2); c.quadraticCurveTo((x0 + x1) / 2, y - h * 2, x1, y - 2); c.stroke(); c.setLineDash([]);
        c.fillStyle = COL[i]; c.beginPath(); c.arc(x1, y, 4, 0, 7); c.fill();
        const big = S.met && u === S.L; c.font = M.NUMF(big ? 20 : 16); c.fillStyle = big ? '#c88a00' : COL[i]; c.fillText(String(u), x1, y + 8);
      }
      // the animal: mid-hop it follows the arc to its next landing
      let ax = X(S.end[i]), ay = y;
      if (hk < 1 && S.from && S.from[i] != null && (hopping || S.end[i] === S.from[i] + s)) { const x0 = X(S.from[i]), x1 = X(S.from[i] + s), e = M.easeIO(hk), h = Math.min(46, (x1 - x0) * 0.55); ax = x0 + (x1 - x0) * e; ay = y - Math.sin(e * Math.PI) * h; }
      else if (hopping) ax = X(S.from[i] + s), ay = y;
      const won = g.done && g.result === 'win';
      try { if (typeof ANI !== 'undefined') ANI.draw(c, KIND[i], ax, ay - 2, 0.5, { t: t + i, pose: won ? 'cheer' : hk < 1 ? 'hop' : 'idle', expr: won ? 'laugh' : 'happy', facing: 1 }); } catch (e) { }
    }
    M.drawEx(g, c, 'prob'); M.drawUI(g, c);
  },
});
