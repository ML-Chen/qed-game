// counting_sigma.js — SIGMA! Expand a sum written in sigma notation and add it up.
// An old library at night; the sum is chalked on a blackboard and a beaver keeps watch. Show your work:
//   1. Tap the Σ: for each k in turn, the k in the formula lights up in blue and a chalk note writes the formula with that
//      k put in ("2 · 3 = 6", the 3 in blue) right above it; the value lifts off the note and lands as the next term of the
//      written-out sum, with its "k = 3" under it. The bottom limit glows for the first term and the top limit for the last.
//   2. Tap the written-out sum: a running total appears above it; each term in turn flies up beside it, the addition is
//      written out ("2 + 4 = 6") and collapses to its result (2, 6, 12, 20); the finished total drops into the answer.
// Level 0: c·k for k = 1 to 3 or 4. Level 1: k + c for k = 1 to 4 or 5. Level 2: k² for k from 1 or 2 to 4.
// Medium mode: the total is picked from the tray, then the running total shows how it adds up.
// The Σ is painted here (the fonts have no Σ glyph); its token is an invisible placeholder that keeps its box.
const M = MK, INK = SCN.ink('chalk'), KC = '#8ae4ff', GOLD = '#ffd970';
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level, kk = (k, o) => M.num(k, null, { col: KC, ...o });
  if (L === 0) { const c = 2 + r(2); return { lo: 1, hi: 3 + r(2), f: k => c * k, body: () => M.row(M.num(c), M.vr('k', 'kv')), sub: k => M.row(M.num(c), M.op('·'), kk(k)) }; }
  if (L === 1) { const c = 1 + r(4); return { lo: 1, hi: 4 + r(2), f: k => k + c, body: () => M.paren(M.row(M.vr('k', 'kv'), M.op('+'), M.num(c))), sub: k => M.row(kk(k), M.op('+'), M.num(c)) }; }
  return { lo: 1 + r(2), hi: 4, f: k => k * k, body: () => M.sup(M.vr('k', 'kv'), M.num(2)), sub: k => M.sup(kk(k), M.num(2)) };
}
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c, kind, x, y, s, facing) {
  const S = g.s, mk = S.mk, t = g.t, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hopK * 24, s, { t, pose, expr, facing }); else SCN.host(g, c, kind, x, y, s);
}

MG.add({
  id: 'counting_sigma', stage: 'counting', cmd: 'SIGMA!', hint: 'tap', time: 8, mood: 'night', winText: 'Summed!', hold: 1.6,
  card: {
    title: 'Sigma notation', ref: 'Grade 11 and up', kind: 'Sequences',
    text: 'The big Greek letter Σ, called sigma, is a short way to write "add these up". The letter k under it starts at the number written below Σ and counts up by 1 to the number written above Σ. For each value of k, you work out the formula next to Σ, and then you add all the results.\n\nFor example, the sum of 2k from k = 1 to 4 means 2·1 + 2·2 + 2·3 + 2·4, which is 2 + 4 + 6 + 8 = 20.\n\nSigma notation lets you write a long sum in a small space, even a sum with a hundred terms.',
    note: 'Put each value of k, from the bottom number to the top number, into the formula. Then add the results.',
    ask: 'What is the sum of 3k from k = 1 to 3? What is the sum of k² from k = 1 to 3?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const T = M.pace(g);
    S.ks = []; for (let k = S.lo; k <= S.hi; k++) S.ks.push(k); S.vals = S.ks.map(S.f); S.total = S.vals.reduce((p, v) => p + v, 0);
    const n = S.vals.length; S.st = 1; S.size = 46; S.shown = S.vals.map(() => true); g.dur *= (2.6 + 1.05 * 2) / 8;
    // the expression is always laid out from the same node objects, so the symbols glide when the sum widens or shrinks
    const N = S.N = { sig: M.txt('M', 'sig', { alpha: 0 }), body: Object.assign(S.body(), { id: 'body' }), eq: M.op('=', 'eq'), q: M.slot('q'),
      e: S.vals.map((v, i) => M.num(v, 'e' + i)), p: S.vals.map((v, i) => i ? M.op('+', 'p' + i) : null), tot: M.num(S.total, 'tot', { _born: -1 }) };
    S.build = () => {
      let fill = null;
      if (S.st === 1) { S.vals.forEach((v, i) => { N.e[i].alpha = S.shown[i] ? N.e[i].alpha ?? 1 : 0; if (N.p[i]) N.p[i].alpha = S.shown[i] ? N.p[i].alpha ?? 1 : 0; });
        fill = M.row(...S.vals.flatMap((v, i) => [N.p[i], N.e[i]])); fill.id = 'sum'; }
      if (S.st === 2) { fill = N.tot; N.tot.pop = g.t; }
      N.q.fill = fill;
      M.place(g, 'ex', M.row(N.sig, M.gap(S.size * 0.25), N.body, N.eq, N.q), 180, 300, S.size, { col: INK });
    };
    // one size for every step, chosen so the widest step (the written-out sum) fits on the board
    for (S.build(); M.lay(g.s.mk.ex.ex.node, S.size).w > 300 && S.size > 26; S.build()) S.size -= 2;
    S.st = 0; S.shown = S.vals.map(() => false); S.build(); M.inert(g, ['eq', 'tot', 'run', ...S.vals.flatMap((v, i) => ['e' + i, 'p' + i])]);
    // one term per beat, slow enough to read its note; one addition per beat, written out ("2 + 4 = 6")
    const per = (n <= 4 ? 0.9 : 0.75) * T, add = 1.15 * T, first = 0.5 * T, sumLen = first + (n - 1) * add + 0.6 * T;
    M.play(g, {
      moves(g) {
        // 1. expand: put each k into the formula, one after another
        if (S.st === 0) return [{ tap: 'sig', busy: 0.12, then(g) {
          S.st = 1; S.expAt = g.t; S.build(); g.sfx('whoosh'); S.point = true; hop(g, 'think');
          M.show(g, 0.15 * T + n * per + 0.1 * T);
          S.vals.forEach((v, i) => M.at(g, [
            [0.15 * T + i * per, g => {
              S.hot = { lim: i === 0 ? 'lo' : i === n - 1 ? 'hi' : null, t0: g.t, dur: per };
              M.indicate(g, 'kv', { col: KC, dur: 0.45 * per, sc: 1.35 });
              const res = M.num(v), nd = Object.assign(M.row(S.sub(S.ks[i]), M.op('='), res), { id: 'nt' + i }), m = M.lay(nd, 28), bb = M.box(g, 'body');
              const nx = M.clamp(bb.x + 6, m.w / 2 + 28, 332 - m.w / 2), ny = bb.y - bb.h / 2 - 44;
              M.place(g, 'nt' + i, nd, nx, ny + 10, 28, { col: GOLD }); M.writeIn(g, nd, { dur: 0.3 * per }); g.sfx('tap');
              // the note stays written while a copy of its value flies down into the sum; it leaves as the next note starts
              M.at(g, [[0.5 * per, g => { const rb = M.box(g, 'nt' + i), rw = M.lay(res, 28).w; M.tween(g, res, { alpha: 0.45 }, 0.15 * per);
                  M.fly(g, { node: M.num(v, null, { col: GOLD }), from: [rb.x + rb.w / 2 - rw / 2, ny], to: 'e' + i, dur: 0.35 * per, arc: -26, s0: 28,
                    then(g) { S.shown[i] = true; const e = M.node(g, 'e' + i), p = M.node(g, 'p' + i); if (e) { e.alpha = 1; e.pop = g.t; } if (p) p.alpha = 1; M.sparkle(g, 'e' + i, { n: 7, cols: [GOLD, '#fff', KC] }); g.sfx('pop'); hop(g); } }); }],
                [0.88 * per, g => { M.tween(g, nd, { alpha: 0 }, 0.12 * per); }],
                [per, g => { delete g.s.mk.ex['nt' + i]; }]]);
            }]]));
          M.at(g, [[0.15 * T + n * per + 0.05 * T, g => { S.point = false; }]]);
        } }];
        // 2. add the terms up: each one flies into a running total that rolls up
        if (S.st === 1) {
          const v = S.vals, last = v[v.length - 1];
          return [{ tap: ['sum', 'q'], busy: 0.1, askAt: 0.45 * T, after: sumLen, ask: { v: S.total, wrong: [S.total - last, S.total + 1, S.total - 1, S.total + v[0]] },
            then(g) { M.show(g, 0.45 * T); M.circle(g, 'sum', { dur: 0.45 * T, col: GOLD }); S.point = true; hop(g, 'think'); },
            resolve(g) {
              // the running total sits above the sum; each term flies up beside it and the addition is written out in full
              // ("2 + 4 = 6"), then it collapses to its result, which is the start of the next addition
              M.show(g, sumLen); const sb = M.box(g, 'sum'), rx = sb.x, ry = sb.y - sb.h / 2 - 38; let acc = v[0];
              const putRun = (...items) => { const nd = Object.assign(M.row(...items), { id: 'run' }); M.place(g, 'run', nd, rx, ry + 11, 30, { col: GOLD }); };
              const dim = i => { M.tween(g, 'e' + i, { alpha: 0.35 }, 0.15 * T); if (i) M.tween(g, 'p' + i, { alpha: 0.35 }, 0.15 * T); };
              S.run = M.num(v[0], null, { alpha: 0 }); putRun(S.run);
              M.indicate(g, 'e0', { col: GOLD, dur: 0.3 * T, sc: 1.25 });
              M.fly(g, { node: M.num(v[0], null, { col: GOLD }), from: 'e0', to: 'run', dur: 0.3 * T, arc: -24, s1: 30,
                then(g) { S.run.alpha = 1; S.run.pop = g.t; dim(0); M.sparkle(g, 'run', { n: 6, cols: [GOLD, '#fff'] }); g.sfx('tap'); hop(g); } });
              for (let i = 1; i < n; i++) { const t0 = first + (i - 1) * add, val = v[i];
                M.at(g, [[t0, g => {
                  M.indicate(g, 'e' + i, { col: GOLD, dur: 0.3 * T, sc: 1.25 }); M.indicate(g, 'p' + i, { col: GOLD, dur: 0.3 * T });
                  const rb = M.box(g, 'run'), plus = M.op('+', null, { alpha: 0 }), term = M.num(val, null, { alpha: 0, _born: -1 });
                  putRun(S.run, plus, term); const tb = M.box(g, 'run'), tw = M.lay(term, 30).w;
                  M.fly(g, { node: M.num(val, null, { col: GOLD }), from: 'e' + i, to: [tb.x + tb.w / 2 - tw / 2, rb.y], dur: 0.3 * T, arc: -24, s1: 30,
                    then(g) { plus.alpha = 1; term.alpha = 1; term.pop = g.t; dim(i); g.sfx('tap'); hop(g); } });
                  M.at(g, [[0.32 * T, g => { // "= 6" writes itself
                      const eq = M.op('='), res = M.num(acc + val); S.next = res; putRun(S.run, plus, term, eq, res);
                      M.writeIn(g, eq, { dur: 0.1 * T }); M.writeIn(g, res, { delay: 0.08 * T, dur: 0.16 * T }); g.sfx('ding'); }],
                    [1.05 * T, g => { // the addition collapses into its result
                      acc += val; S.run = S.next; putRun(S.run); S.run.pop = g.t; M.sparkle(g, 'run', { n: 6, cols: [GOLD, '#fff'] }); }]]);
                }]]); }
              M.at(g, [
                [first + (n - 1) * add + 0.05 * T, g => { // the finished total drops into the answer
                  for (let i = 0; i < n; i++) { M.tween(g, 'e' + i, { alpha: 0 }, 0.2 * T); if (i) M.tween(g, 'p' + i, { alpha: 0 }, 0.2 * T); }
                  M.tween(g, S.run, { alpha: 0 }, 0.05);
                  M.fly(g, { node: M.num(S.total, null, { col: GOLD }), from: 'run', to: 'q', dur: 0.35 * T, arc: -20, s0: 30, s1: S.size,
                    then(g) { delete g.s.mk.ex.run; S.st = 2; S.build(); g.sfx('coin'); hop(g, 'laugh'); g.burst(180, 290, ['#fff6c0', '#ffd45a', '#bfe8ff'], 14, 140); } }); }],
                [first + (n - 1) * add + 0.5 * T, g => { S.point = false; }]]);
            } }];
        }
        return [];
      },
      area(g) { return S.st === 0 ? 'sig' : 'sum'; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'library', panel: 'chalk' });
    // a candle on the shelf, flickering
    const fl = 1 + 0.12 * Math.sin(t * 17) + 0.08 * Math.sin(t * 29);
    c.fillStyle = '#f4ead0'; c.fillRect(56, 432, 14, 34); const cg = c.createRadialGradient(63, 424, 0, 63, 424, 46 * fl); cg.addColorStop(0, 'rgba(255,220,140,0.55)'); cg.addColorStop(1, 'rgba(255,200,120,0)');
    c.fillStyle = cg; c.beginPath(); c.arc(63, 424, 46 * fl, 0, 7); c.fill(); c.fillStyle = '#ffcf5a'; c.beginPath(); c.ellipse(63, 424, 4, 8 * fl, 0, 0, 7); c.fill();
    host(g, c, 'beaver', 284, 474, 1.2, -1);
    M.drawEx(g, c, 'ex');
    // the Σ with its limits, in chalk; a limit glows blue while its term is worked out
    const b0 = M.box(g, 'sig'), sn = M.node(g, 'sig'), b = b0 && { ...b0, x: b0.x + (sn && sn._ax || 0), y: b0.y + (sn && sn._ay || 0) }; // follows the token as it glides
    if (b) {
      const pk = S.expAt != null ? Math.sin(M.clamp((t - S.expAt) / 0.3, 0, 1) * Math.PI) * 0.25 : 0, h = S.size * 1.15 * (1 + pk), w = S.size * 0.8 * (1 + pk), x0 = b.x - w / 2, y0 = b.y - h / 2;
      const hot = S.hot && t - S.hot.t0 < S.hot.dur * 0.9 ? S.hot.lim : null;
      c.save(); c.strokeStyle = INK; c.lineWidth = S.size * 0.1; c.lineJoin = 'round'; c.lineCap = 'round';
      c.beginPath(); c.moveTo(x0 + w, y0 + h * 0.12); c.lineTo(x0 + w, y0); c.lineTo(x0, y0); c.lineTo(x0 + w * 0.55, y0 + h / 2); c.lineTo(x0, y0 + h); c.lineTo(x0 + w, y0 + h); c.lineTo(x0 + w, y0 + h * 0.88); c.stroke();
      const lim = on => { c.fillStyle = on ? KC : INK; c.shadowColor = KC; c.shadowBlur = on ? 12 : 0; };
      lim(hot === 'hi'); c.textAlign = 'center'; c.font = M.NUMF(S.size * 0.48); c.fillText(String(S.hi), b.x, y0 - 8);
      lim(hot === 'lo'); const ly = y0 + h + S.size * 0.5; c.font = M.VARF(S.size * 0.46); const kw = c.measureText('k').width; c.font = M.NUMF(S.size * 0.46); const rest = ' = ' + S.lo, rw = c.measureText(rest).width;
      c.textAlign = 'left'; c.font = M.VARF(S.size * 0.46); c.fillText('k', b.x - (kw + rw) / 2, ly); c.font = M.NUMF(S.size * 0.46); c.fillText(rest, b.x - (kw + rw) / 2 + kw, ly);
      c.restore();
    }
    // under each written-out term, the k it came from
    if (S.st === 1) S.ks.forEach((k, i) => { const e = M.box(g, 'e' + i), n = M.node(g, 'e' + i); if (!e || !S.shown[i]) return; c.save(); c.globalAlpha = Math.min(1, n ? n.alpha ?? 1 : 1) * 0.85; c.fillStyle = KC; c.textAlign = 'center'; c.font = `italic 700 18px Georgia, serif`; c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 4; c.fillText('k=' + k, e.x, e.y + e.h / 2 + 22); c.restore(); });
    for (let i = 0; i < S.vals.length; i++) M.drawEx(g, c, 'nt' + i);
    M.drawEx(g, c, 'run');
    M.drawUI(g, c);
  },
});
