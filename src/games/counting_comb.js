// counting_comb.js — COMBINATION! Count the handshakes among 5 ducks: C(5, 2) = (5 × 4) ÷ 2!.
// A pond at dusk with fireflies; five ducks float in a ring under a frosted panel that reads C(5, 2) = (5 × 4) / □, with
// a 2! chip on a lily pad beside it. Show your work:
//   1. Drag the 2! into the empty bottom of the fraction: it lands and writes itself out as 2 × 1, and on the pond two
//      ducks show why: one arrow goes from the first duck to the second and another comes back, because 5 × 4 counted
//      the same handshake once from each side.
//   2. Tap 5 × 4 and 2 × 1, in either order: each one is circled, a note under the fraction writes "5 × 4 = 20", and
//      the 20 flies up into place (medium mode: picked from the tray).
//   3. Tap 20/2: "20 ÷ 2 = 10" writes itself, the 10 flies up and replaces the fraction, and the 10 handshake lines are
//      drawn between the ducks one by one while a counter beside the pond rolls up to 10.
// Level 0: 4 ducks. Level 1: 5 ducks. Level 2: 6 or 7 ducks.
const M = MK, INK = SCN.ink('glass'), NOTE = '#a8306a';

MG.add({
  id: 'counting_comb', stage: 'counting', cmd: 'COMBINATION!', hint: 'drag', time: 9, mood: 'night', winText: 'Quack!', hold: 1.7,
  card: {
    title: 'Combinations', ref: 'Grade 11 and up', kind: 'Counting',
    text: 'A combination is a choice of a group where order does not matter. C(5, 2), said "5 choose 2", is the number of ways to choose 2 things from 5. It is also the number of handshakes when 5 ducks each shake hands once with every other duck.\n\nFirst count as if order mattered: 5 choices for the first duck and 4 for the second makes 5 × 4 = 20. But that counts every pair twice, as "A then B" and as "B then A". The 2 ducks can be put in order in 2! = 2 × 1 = 2 ways, so divide by 2!: 20 ÷ 2 = 10.\n\nIn general, C(n, k) = n! ÷ (k! (n − k)!).',
    note: 'Count the ordered choices, then divide by k!, the number of orders the k chosen things can be in.',
    ask: 'How many handshakes do 6 people make? What is C(4, 2)?',
  },
  init(g) {
    const S = g.s; M.setup(g); const L = g.level, T = M.pace(g);
    S.n = L === 0 ? 4 : L === 1 ? 5 : 6 + Math.floor(g.rand() * 2); S.top = S.n * (S.n - 1); S.ans = S.top / 2;
    S.denIn = S.numDone = S.denDone = S.done = false; g.dur *= (2.6 + 1.05 * 4) / 8; S.uid = 0;
    const hop = (g, e) => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // every symbol is a node object that lives for the whole game, so symbols glide when the line is rewritten
    const N = S.N = { num: Object.assign(M.row(M.num(S.n), M.op('×'), M.num(S.n - 1)), { id: 'num' }), nv: M.num(S.top, 'nv', { alpha: 0 }), q: M.slot('q'),
      den: Object.assign(M.row(M.num(2), M.op('×'), M.num(1)), { id: 'den' }), dv: M.num(2, 'dv', { alpha: 0 }), ans: M.num(S.ans, 'ans', { alpha: 0, _born: -1 }) };
    N.fr = M.frac(N.num, N.q, 'fb'); S.left = [M.vr('C'), M.paren(M.row(M.num(S.n), M.op(','), M.num(2)), 'nk'), M.op('=', 'eq')];
    S.build = () => {
      N.fr.n = S.numDone ? N.nv : N.num; N.fr.d = !S.denIn ? N.q : S.denDone ? N.dv : N.den; N.fr.id = S.numDone && S.denDone ? 'fr' : 'fb';
      const right = S.done ? N.ans : N.fr;
      M.place(g, 'ex', M.row(...S.left, right), S.denIn ? 180 : 154, 300, 40, { col: INK });
    };
    S.build(); M.inert(g, ['nk', 'eq', 'fb', 'nv', 'dv', 'ans', 'nt']);
    const chip = M.row(M.num(2), M.txt('!')); chip.id = 'k'; M.place(g, 'tok', chip, 296, 300, 40, { col: '#fff6e0' });
    // a working note under the fraction ("5 × 4 = 20"); its result writes itself later and flies up into place
    const note = (g, lhs, v) => { S.res = M.num(v, null, { alpha: 0 }); S.note = Object.assign(M.row(...lhs, M.op('='), S.res), { id: 'nt' }); S.nk = 'n' + S.uid++;
      M.place(g, S.nk, S.note, 180, 372, 28, { col: NOTE }); M.writeIn(g, S.note, { dur: 0.32 * T, delay: 0.08 * T }); g.sfx('tap'); };
    const land = (g, to, fn) => { M.show(g, 0.8 * T); S.res.alpha = 1; M.writeIn(g, S.res, { dur: 0.18 * T }); g.sfx('ding');
      M.at(g, [[0.28 * T, g => { const b = M.box(g, 'nt'), m = M.lay(S.note, 28), rw = M.lay(S.res, 28).w, from = [b.x + m.w / 2 - rw / 2, b.y];
          const q = S.note; M.tween(g, q, { alpha: 0 }, 0.2 * T); for (const it of q.items) M.tween(g, it, { alpha: 0 }, 0.2 * T); const nk = S.nk; M.at(g, [[0.25 * T, g => { delete g.s.mk.ex[nk]; }]]);
          M.fly(g, { node: M.num(S.res.v, null, { col: NOTE }), from, to, dur: 0.32 * T, arc: 30, s0: 28, s1: M.box(g, to).s || 34, then(g) { fn(g); g.sfx('coin'); hop(g); } }); }],
        [0.8 * T, g => { S.point = false; }]]); };
    const fadeRow = (g, r) => { for (const it of r.items) M.tween(g, it, { alpha: 0 }, 0.15 * T, { delay: 0.42 * T }); };
    M.play(g, {
      moves(g) {
        const out = [];
        // 1. divide by 2!: each handshake was counted twice
        if (!S.denIn) out.push({ drag: 'k', to: 'q', reach: 110, busy: 0.12, then(g) {
          M.show(g, 1.2 * T); S.point = true; hop(g, 'think'); const kb = { ...M.box(g, 'k') }; M.node(g, 'k').hide = true; S.denIn = true; S.inAt = g.t;
          for (const it of N.den.items) it.alpha = 0; S.build(); g.sfx('whoosh');
          M.fly(g, { node: M.row(M.num(2), M.txt('!')), from: [kb.x, kb.y], to: 'den', dur: 0.3 * T, arc: -40, s0: 40, s1: 32, col: '#fff6e0',
            then(g) { N.den.items.forEach((it, i) => { it.alpha = 1; M.writeIn(g, it, { delay: i * 0.12 * T, dur: 0.15 * T }); }); M.sparkle(g, 'den', { n: 8 }); g.sfx('pop'); } });
          S.twice = { t0: g.t + 0.35 * T, dur: 0.85 * T };   // two arrows on the pond: A to B, and B back to A
          M.at(g, [[1.2 * T, g => { S.point = false; }]]); } });
        if (S.denIn && !S.denDone) out.push({ tap: 'den', busy: 0.1, askAt: 0.45 * T, after: 0.8 * T, ask: { v: 2, wrong: [1, 3, 4] },
          then(g) { M.show(g, 0.45 * T); S.point = true; hop(g, 'think'); M.circle(g, 'den', { dur: 0.45 * T, col: NOTE }); note(g, [M.num(2), M.op('×'), M.num(1)], 2); },
          resolve(g) { fadeRow(g, N.den); land(g, 'den', g => { S.denDone = true; N.dv.alpha = 1; N.dv.pop = g.t; S.build(); M.sparkle(g, 'dv', { n: 7 }); }); } });
        if (!S.numDone) out.push({ tap: 'num', busy: 0.1, askAt: 0.45 * T, after: 0.8 * T, ask: { v: S.top, wrong: [2 * S.n - 1, S.n * S.n, S.top - S.n] },
          then(g) { M.show(g, 0.45 * T); S.point = true; hop(g, 'think'); M.circle(g, 'num', { dur: 0.45 * T, col: NOTE }); note(g, [M.num(S.n), M.op('×'), M.num(S.n - 1)], S.top); },
          resolve(g) { fadeRow(g, N.num); land(g, 'num', g => { S.numDone = true; N.nv.alpha = 1; N.nv.pop = g.t; S.build(); M.sparkle(g, 'nv', { n: 7 }); }); } });
        if (S.numDone && S.denDone && !S.done) out.push({ tap: 'fr', busy: 0.1, askAt: 0.45 * T, after: 0.8 * T, ask: { v: S.ans, wrong: [S.top, S.ans + 1, S.top - 2, S.ans - 1] },
          then(g) { M.show(g, 0.45 * T); S.point = true; hop(g, 'think'); M.circle(g, 'fr', { dur: 0.45 * T, col: NOTE }); note(g, [M.num(S.top), M.op('÷'), M.num(2)], S.ans); },
          resolve(g) { M.tween(g, N.nv, { alpha: 0 }, 0.15 * T, { delay: 0.3 * T }); M.tween(g, N.dv, { alpha: 0 }, 0.15 * T, { delay: 0.3 * T }); M.at(g, [[0.42 * T, g => { N.nv.col = N.dv.col = INK; N.fr.col = 'rgba(0,0,0,0)'; /* the bar leaves with the numbers; they keep their own ink */ }]]);
            land(g, 'fr', g => { S.done = true; S.doneAt = g.t; N.ans.alpha = 1; N.ans.pop = g.t; S.build(); M.sparkle(g, 'ans', { n: 12 }); hop(g, 'laugh'); }); } });
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || [m.drag, m.to]) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, won = g.done && g.result === 'win';
    SCN.std(g, c, { scene: 'dusk', panel: 'glass', panelH: 150, panelY: 306 });
    // the dark pond with a ring of ducks
    c.fillStyle = 'rgba(30,24,70,0.75)'; c.beginPath(); c.ellipse(180, 512, 170, 78, 0, 0, 7); c.fill();
    c.strokeStyle = 'rgba(255,210,160,0.25)'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { const k = (t * 0.3 + i / 3) % 1; c.beginPath(); c.ellipse(180, 512, 40 + k * 120, 18 + k * 54, 0, 0, 7); c.globalAlpha = 1 - k; c.stroke(); } c.globalAlpha = 1;
    const P0 = [...Array(S.n)].map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / S.n; return { x: 180 + Math.cos(a) * 128, y: 516 + Math.sin(a) * 52 }; });
    // why divide by 2: the same handshake, counted once from each side
    const tw = S.twice; if (tw && t < tw.t0 + tw.dur + 0.6 && t > tw.t0) { const a = P0[S.n - 1], b = P0[S.n === 4 ? 2 : 2];
      for (let s = 0; s < 2; s++) { const k = M.easeIO((t - tw.t0 - s * tw.dur * 0.45) / (tw.dur * 0.5)); if (k <= 0) continue; const fade = t > tw.t0 + tw.dur ? 1 - (t - tw.t0 - tw.dur) / 0.6 : 1;
        const [p, q] = s ? [b, a] : [a, b], bend = 30, mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2 - 18 + (s ? bend : -bend), col = s ? '#ffd45a' : '#7ad0ff';
        c.save(); c.globalAlpha = Math.max(0, fade); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 3.5; c.lineCap = 'round'; c.shadowColor = col; c.shadowBlur = 8; c.beginPath();
        let px = p.x, py = p.y - 18, ex = px, ey = py; for (let u = 0; u <= k + 1e-6; u += 0.05) { ex = (1 - u) * (1 - u) * p.x + 2 * (1 - u) * u * mx + u * u * q.x; ey = (1 - u) * (1 - u) * (p.y - 18) + 2 * (1 - u) * u * my + u * u * (q.y - 18); c.lineTo(ex, ey); } c.stroke();
        const u0 = Math.max(0, k - 0.06), bx = (1 - u0) * (1 - u0) * p.x + 2 * (1 - u0) * u0 * mx + u0 * u0 * q.x, by = (1 - u0) * (1 - u0) * (p.y - 18) + 2 * (1 - u0) * u0 * my + u0 * u0 * (q.y - 18), an = Math.atan2(ey - by, ex - bx);
        c.beginPath(); c.moveTo(ex + Math.cos(an) * 9, ey + Math.sin(an) * 9); c.lineTo(ex + Math.cos(an + 2.4) * 10, ey + Math.sin(an + 2.4) * 10); c.lineTo(ex + Math.cos(an - 2.4) * 10, ey + Math.sin(an - 2.4) * 10); c.fill();
        if (k > 0.5) { c.shadowBlur = 0; c.font = M.NUMF(20); c.textAlign = 'center'; c.strokeStyle = '#1a1430'; c.lineWidth = 4; const lx = mx, ly = my + (s ? 18 : -6); c.strokeText(String(s + 1), lx, ly); c.fillText(String(s + 1), lx, ly); }
        c.restore(); } }
    // the handshakes: one line for every pair of ducks, drawn one by one once the count is known, with a counter
    let drawn = 0;
    if (S.done) { let k = 0; const per = Math.min(0.08, 0.9 / S.ans); for (let i = 0; i < S.n; i++) for (let j = i + 1; j < S.n; j++, k++) { const kk = M.ease((t - S.doneAt - k * per) / 0.15); if (kk <= 0) continue; if (kk >= 1) drawn++;
      const a = P0[i], b = P0[j]; c.strokeStyle = `hsla(${(k * 37) % 360},90%,72%,0.9)`; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(a.x, a.y - 18); c.lineTo(M.lerp(a.x, b.x, kk), M.lerp(a.y, b.y, kk) - 18); c.stroke(); }
      if (drawn) { c.save(); c.fillStyle = 'rgba(26,20,48,0.85)'; c.strokeStyle = '#fff2a0'; c.lineWidth = 2.5; c.beginPath(); c.arc(180, 515, 20, 0, 7); c.fill(); c.stroke(); c.font = M.NUMF(26); c.textAlign = 'center'; c.fillStyle = '#fff2a0'; c.strokeStyle = '#1a1430'; c.lineWidth = 5; c.strokeText(String(drawn), 180, 524); c.fillText(String(drawn), 180, 524); c.restore(); } }
    P0.slice().map((p, i) => ({ ...p, i })).sort((p, q) => p.y - q.y).forEach(p => {
      const bob = Math.sin(t * 2 + p.i) * 2, mk = S.mk, hk = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) * (p.i % 2 ? 8 : 12) : 0;
      try { ANI.draw(c, 'duck', p.x, p.y + bob - hk, 0.62, { t, phase: p.i, pose: won ? 'cheer' : hk > 0 ? 'hop' : 'idle', expr: won ? 'laugh' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', facing: p.x > 180 ? -1 : 1, noShadow: true }); } catch (e) { P.sheep(c, p.x, p.y, 0.5, { t }); }
    });
    // the 2! chip floats on a lily pad beside the fraction
    const kb = M.box(g, 'k'), kn = M.node(g, 'k');
    if (kb && kn && !kn.hide) { c.fillStyle = '#5ab86a'; c.beginPath(); c.arc(kb.x, kb.y, 34 + Math.sin(t * 2) * 1.5, 0.3, Math.PI * 2 - 0.3); c.lineTo(kb.x, kb.y); c.fill(); c.strokeStyle = '#2e7a40'; c.lineWidth = 2; c.stroke(); }
    M.drawEx(g, c, 'ex'); M.drawEx(g, c, 'tok'); for (const k in S.mk.ex) if (/^n\d/.test(k)) M.drawEx(g, c, k);
    M.drawUI(g, c);
  },
});
