// complex_powers.js — POWERS OF I! The powers of i repeat every 4: i⁰ = 1, i¹ = i, i² = −1, i³ = −i, i⁴ = 1.
// A big iⁿ glows in space above a wheel of the four values. The 4 in the wheel's hub stands for i⁴ = 1, one full turn.
// The player drags the 4 onto the exponent (or the exponent onto the 4): "− 4" lifts off the hub and lands in the
// exponent while the comet runs one whole lap round the wheel, back to where it started (i⁴ = 1 changes nothing).
// Tapping n − 4: the − 4 slides into n and n rolls down by four. When the exponent is below 4, tapping the power sends
// the comet a quarter turn per factor of i ("× i" writes itself on each quarter); the value it lands on lights up, lifts
// off the wheel and takes the power's place.
// Level 0: i⁵ to i⁷ (one lap). Level 1: i⁴ to i⁹. Level 2: i⁹ to i¹¹ (two laps). Medium mode: every tap opens the tray.
const M = MK, INK = '#fff6e0', ECOL = '#ffd970', CX = 180, CY = 466, R = 98, NY = 196;
const val = (k, id, o) => k === 0 ? M.num(1, id, o) : k === 1 ? M.vr('i', id, o) : k === 2 ? M.num(-1, id, o) : Object.assign(M.row(M.op('-'), M.gap(-5), M.vr('i')), { id, ...o });
// The expression is always laid out from the same node objects, so symbols glide to their new places.
function build(g) {
  const S = g.s, N = S.N;
  if (S.ans != null) { M.place(g, 'ex', N.ans, 180, 300, 88, { col: INK }); return; }
  N.pw.exp = S.sub ? N.sub : N.en; M.place(g, 'ex', N.pw, 180, 300, 88, { col: INK });
}
// fade a node and every symbol inside it (so nothing ghosts back when it is replaced)
function fadeAll(g, n, dur, delay) { const all = []; (function walk(q) { if (!q) return; all.push(q); for (const ch of [q.base, q.exp, q.inner, ...(q.items || [])]) walk(ch); })(n);
  for (const q of all) M.tween(g, q, { alpha: 0 }, dur, { delay }); }
// where the comet is: one lap per 4 taken away, then a quarter turn per factor of i
function cometAngle(g) { const S = g.s, t = g.t; let a = 0;
  if (S.lap) { for (let j = 0; j < 4; j++) a -= M.easeIO((t - S.lap.t0 - j * S.lap.q) / (S.lap.q * 0.8)) * Math.PI / 2; if (t >= S.lap.t0 + S.lap.dur) a = 0; }
  if (S.step) for (let j = 0; j < S.step.n; j++) a -= M.easeIO((t - S.step.t0 - j * S.step.q) / (S.step.q * 0.75)) * Math.PI / 2;
  return a; }

MG.add({
  id: 'complex_powers', stage: 'complex', cmd: 'POWERS OF I!', hint: 'drag', time: 8, mood: 'night', winText: 'Looped!', hold: 1.4,
  card: {
    title: 'Powers of i', ref: 'Algebra 2', kind: 'Complex numbers',
    text: 'The number i is defined so that i² = −1. Its powers repeat in a cycle of four: i¹ = i, i² = −1, i³ = i² · i = −i, and i⁴ = i² · i² = (−1)(−1) = 1. Then the pattern starts again, because i⁵ = i⁴ · i = 1 · i = i.\n\nTo find a big power of i, take 4 away from the exponent as many times as you can. Each 4 you take away is a factor of i⁴, which equals 1, so it changes nothing. For example, i⁷ = i⁴ · i³ = 1 · i³ = −i.\n\nOn the wheel, each factor of i is a quarter turn. Four quarter turns bring you all the way around, back to where you started.',
    note: 'The value of iⁿ depends only on the remainder when n is divided by 4: i⁰ = 1, i¹ = i, i² = −1, i³ = −i.',
    ask: 'What is i⁶? What is i¹³?',
  },

  init(g) {
    const S = g.s, r = k => Math.floor(g.rand() * k); M.setup(g); const T = M.pace(g);
    S.e = g.level === 0 ? 5 + r(3) : g.level === 1 ? 4 + r(6) : 9 + r(3); S.sub = false; S.ans = null; S.lap = null; S.step = null;
    const N = S.N = { b: M.vr('i', 'b'), en: M.num(S.e, 'e', { col: ECOL }), sm: M.op('-', 'sm', { col: ECOL, alpha: 0 }), f4: M.num(4, 'f4', { col: ECOL, alpha: 0 }) };
    N.sub = Object.assign(M.row(N.en, N.sm, N.f4), { id: 'sub' }); N.pw = M.sup(N.b, N.en, 'pw');
    build(g); M.inert(g, ['sm', 'f4']);
    M.place(g, 'hub', M.num(4, 'four', { col: '#2a1840' }), CX, CY + 16, 44);
    M.place(g, 'hubl', Object.assign(M.row(M.sup(M.vr('i'), M.num(4)), M.op('='), M.num(1)), { id: 'hl' }), CX, CY - 37, 26, { col: '#fff0c8' }); M.inert(g, ['hl']);
    [[1, 0], [0, -1], [-1, 0], [0, 1]].forEach(([dx, dy], k) => { M.place(g, 'w' + k, val(k, 'w' + k), CX + dx * R, CY + dy * R + 12, 32, { col: '#e8f0ff' });
      M.place(g, 'pl' + k, Object.assign(M.sup(M.vr('i'), M.num(k)), { id: 'pl' + k }), CX + dx * R + (dx ? dx * 52 : 44), CY + dy * R + (dy ? dy * 40 : -28) + 10, 30, { col: '#dce6ff' }); });
    M.inert(g, ['pl0', 'pl1', 'pl2', 'pl3']);
    const nMoves = 2 * Math.floor(S.e / 4) + 1; g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // the working note above the exponent ("6 − 4 = 2"), written now, its value added once it is known
    const noteAt = g => { const b = M.box(g, 'e'); return b ? b.x : 220; };
    M.play(g, {
      moves(g) {
        const out = [];
        if (S.ans != null || S.target != null) return out;
        // take one full turn, i⁴ = 1, out of the exponent: the comet makes four quarter turns ("× i" on each) and comes
        // back to where it started, the hub's "i⁴ = 1" swells, and "− 4" lifts off the hub and lands in the exponent
        if (!S.sub && S.e >= 4) {
          const then = g => { const q = 0.34 * T, lap = 4 * q; S.sub = true; M.show(g, lap + 0.95 * T); S.point = true; hop(g, 'think'); g.sfx('whoosh');
            N.sm.alpha = 0; N.f4.alpha = 0; build(g); M.circle(g, 'hub', { dur: 0.45 * T, col: '#ffe9a8', pad: 10 }); M.indicate(g, 'four', { dur: 0.4 * T, sc: 1.25 });
            S.lap = { t0: g.t + 0.15 * T, q, dur: lap };
            const list = []; for (let j = 1; j <= 4; j++) list.push([0.15 * T + j * q - 0.2 * q, g => { M.sparkle(g, 'w' + (j % 4), { n: 5, cols: ['#ffd970', '#fff'] }); g.sfx('tap'); }]);
            list.push([0.2 * T + lap, g => { M.indicate(g, 'hl', { dur: 0.5 * T, sc: 1.3, col: '#ffd970' }); M.sparkle(g, 'w0', { n: 10, cols: ['#ffd970', '#fff'] }); g.sfx('ding'); hop(g, 'laugh'); }]);
            list.push([0.45 * T + lap, g => M.fly(g, { node: M.row(M.op('-', null, { col: ECOL }), M.num(4, null, { col: ECOL })), from: 'four', to: 'sub', dur: 0.45 * T, arc: -50, s0: 40, s1: 55,
              then(g) { N.sm.alpha = 1; N.f4.alpha = 1; N.f4.pop = g.t; M.sparkle(g, 'f4', { n: 8, cols: ['#ffd970', '#fff', '#8ad8ff'] }); g.sfx('pop'); hop(g); S.point = false; } })]);
            M.at(g, list); };
          out.push({ drag: 'four', to: ['e', 'b'], busy: 0.1, then }, { drag: 'e', to: 'four', busy: 0.1, then });
        }
        // n − 4: "n − 4 = m" writes itself above the exponent, the − 4 slides into n and n rolls down by four
        if (S.sub) out.push({ tap: ['sub', 'e'], busy: 0.1, askAt: 0.55 * T, after: 1.3 * T, ask: { v: S.e - 4, wrong: [S.e + 4, S.e - 3, S.e - 5] },
          then(g) { M.show(g, 0.55 * T); M.circle(g, 'sub', { dur: 0.4 * T, col: ECOL }); for (const q of N.sub.items) M.light(g, q, { col: '#fff3c0' }); hop(g, 'think');
            S.q = M.num(S.e - 4, 'q', { alpha: 0 }); S.nt = M.row(M.num(S.e), M.op('-'), M.num(4), M.op('='), S.q);
            M.place(g, 'nt', S.nt, noteAt(g), NY, 34, { col: '#ffe9a8' }); M.writeIn(g, S.nt, { dur: 0.45 * T, delay: 0.05 * T }); g.sfx('tap'); },
          resolve(g) { M.show(g, 1.3 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.25 * T }); M.indicate(g, S.q, { delay: 0.2 * T, dur: 0.4 * T, sc: 1.3, col: '#fff' }); g.sfx('ding');
            M.at(g, [[0.4 * T, g => { const bo = M.box(g, 'e'); for (const q of [N.sm, N.f4]) { const bq = M.box(g, q.id); M.tween(g, q, { dx: bo.x - bq.x, alpha: 0, sc: 0.5 }, 0.32 * T); }
                M.roll(g, N.en, S.e - 4, { delay: 0.12 * T, dur: 0.4 * T }); g.sfx('tap'); }],
              [0.9 * T, g => { M.sparkle(g, 'e', { n: 10 }); g.sfx('coin'); hop(g); for (const q of N.sub.items) M.unlight(g, q); for (const q of S.nt.items) M.tween(g, q, { alpha: 0 }, 0.3 * T); }],
              [1.2 * T, g => { S.e -= 4; S.sub = false; Object.assign(N.sm, { dx: 0, sc: 1 }); Object.assign(N.f4, { dx: 0, sc: 1 }); build(g); delete g.s.mk.ex.nt; }]]); } });
        // a small power: the comet steps a quarter turn for each factor of i ("× i" on each quarter); the tray asks
        // where it landed; that value lights up, lifts off the wheel and takes the power's place
        if (!S.sub && S.e < 4) { const n = S.e, q = 0.55 * T, end = 0.2 * T + n * q;
          out.push({ tap: ['pw', 'b', 'e'], busy: 0.1, askAt: end + 0.1 * T, after: 1.0 * T, ask: { v: val(n), wrong: [0, 1, 2, 3].filter(k => k !== n).map(k => val(k)) },
            then(g) { M.show(g, end + 0.1 * T); S.point = true; M.circle(g, 'pw', { dur: 0.4 * T, col: ECOL }); M.indicate(g, 'e', { dur: 0.4 * T, sc: 1.3 }); hop(g, 'think');
              S.target = n; S.step = { t0: g.t + 0.2 * T, q, n }; if (n) M.at(g, [[0.2 * T, g => g.sfx('whoosh')]]);
              const list = []; for (let j = 1; j <= n; j++) list.push([0.2 * T + j * q - 0.2 * q, g => { M.sparkle(g, 'w' + j, { n: 6, cols: ['#ffd970', '#fff'] }); g.sfx('tap'); hop(g); }]);
              M.at(g, list); },
            resolve(g) { M.show(g, 1.0 * T);
              M.at(g, [[0, g => { S.lit = true; M.indicate(g, 'w' + n, { dur: 0.4 * T, sc: 1.35, col: '#ffd970' }); g.sfx('ding'); }],
                [0.4 * T, g => { fadeAll(g, N.pw, 0.3 * T); const bw = M.box(g, 'w' + n);
                M.fly(g, { node: tintAll(val(n), ECOL), from: [bw.x, bw.y], to: 'pw', dur: 0.45 * T, arc: -70, s0: 32, s1: 88,
                  then(g) { S.ans = n; S.N.ans = tintAll(val(n, 'ans', { _born: -1 }), ECOL); for (const q of S.N.ans.items || []) q._born = -1; S.N.ans.pop = g.t; build(g); const b = M.box(g, 'ans'); if (b) g.burst(b.x, b.y, ['#ffd970', '#fff', '#8ad8ff'], 16, 150); g.sfx('sparkle'); hop(g, 'laugh'); S.point = false; } }); }]]); } }); }
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.bg(g, c, 'space');
    // the wheel: a dark disc, the ring, four spokes
    c.save();
    c.fillStyle = 'rgba(10,6,30,0.6)'; c.beginPath(); c.arc(CX, CY, R + 34, 0, 7); c.fill();
    c.strokeStyle = 'rgba(160,190,255,0.5)'; c.lineWidth = 3; c.beginPath(); c.arc(CX, CY, R, 0, 7); c.stroke();
    c.lineWidth = 1.5; c.strokeStyle = 'rgba(160,190,255,0.25)'; c.beginPath(); c.moveTo(CX - R, CY); c.lineTo(CX + R, CY); c.moveTo(CX, CY - R); c.lineTo(CX, CY + R); c.stroke();
    const a = cometAngle(g), mx = CX + Math.cos(a) * R, my = CY + Math.sin(a) * R, moving = S.lap && t > S.lap.t0 && t < S.lap.t0 + S.lap.dur;
    // the lap leaves a glowing trail all the way round; the quarter steps leave a gold arc with "× i" on each quarter
    const xi = (j, al) => { const aa = -(j + 0.5) * Math.PI / 2, lab = M.row(M.op('×'), M.vr('i')), m = M.lay(lab, 28), x = CX + Math.cos(aa) * (R + 44), y = CY + Math.sin(aa) * (R + 40);
      c.save(); c.globalAlpha = al; c.shadowColor = 'rgba(10,6,30,0.95)'; c.shadowBlur = 6; M.draw(c, lab, x - m.w / 2, y + 10, 28, { col: '#ffe9a8' }); c.restore(); };
    if (S.lap && t > S.lap.t0 && t < S.lap.t0 + S.lap.dur + 0.5) { const fade = M.clamp(1 - (t - S.lap.t0 - S.lap.dur) / 0.5, 0, 1);
      c.save(); c.globalAlpha = fade; c.strokeStyle = 'rgba(255,217,112,0.6)'; c.lineWidth = 5; c.shadowColor = '#ffd04a'; c.shadowBlur = 10; c.beginPath(); c.arc(CX, CY, R, 0, moving ? a : -Math.PI * 2 + 1e-4, true); c.stroke(); c.restore();
      for (let j = 0; j < 4; j++) { const e = M.clamp((t - S.lap.t0 - j * S.lap.q) / (S.lap.q * 0.6), 0, 1); if (e > 0.2) xi(j, (e - 0.2) / 0.8 * fade); } }
    if (S.step) { c.strokeStyle = '#ffd970'; c.lineWidth = 5; c.shadowColor = '#ffd04a'; c.shadowBlur = 10; c.beginPath(); c.arc(CX, CY, R, 0, a, true); c.stroke(); c.shadowBlur = 0;
      for (let j = 0; j < S.step.n; j++) { const e = M.clamp((t - S.step.t0 - j * S.step.q) / (S.step.q * 0.6), 0, 1); if (e > 0.2) xi(j, (e - 0.2) / 0.8); } }
    if (!moving && !S.step) for (let k = 1; k <= 8; k++) { const aa = a + k * 0.07; c.fillStyle = `rgba(255,220,140,${0.4 - k * 0.045})`; c.beginPath(); c.arc(CX + Math.cos(aa) * R, CY + Math.sin(aa) * R, 7 - k * 0.6, 0, 7); c.fill(); }
    else for (let k = 1; k <= 10; k++) { const aa = a + k * 0.09; c.fillStyle = `rgba(255,220,140,${0.6 - k * 0.055})`; c.beginPath(); c.arc(CX + Math.cos(aa) * R, CY + Math.sin(aa) * R, 9 - k * 0.7, 0, 7); c.fill(); }
    // the stations, each tagged with its power of i; a station flares as the comet passes, and the answer's station lights up
    [[1, 0], [0, -1], [-1, 0], [0, 1]].forEach(([dx, dy], k) => {
      const x = CX + dx * R, y = CY + dy * R, lit = S.lit && S.target === k, sa = -k * Math.PI / 2;
      let d = Math.abs(((a - sa) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI); const near = (moving || S.step) && d < 0.35 ? 1 - d / 0.35 : 0;
      c.fillStyle = lit ? '#ffd970' : M.mix('#3a3a7a', '#8a7ad0', near); c.strokeStyle = lit ? '#fff3c0' : 'rgba(180,200,255,0.7)'; c.lineWidth = 2.5; c.beginPath(); c.arc(x, y, 28 + near * 3, 0, 7); c.fill(); c.stroke();
      tintAll(M.node(g, 'w' + k), lit ? '#3a1640' : '#e8f0ff');
    });
    const gr = c.createRadialGradient(mx, my, 0, mx, my, 18); gr.addColorStop(0, 'rgba(255,240,180,1)'); gr.addColorStop(1, 'rgba(255,200,100,0)'); c.fillStyle = gr; c.beginPath(); c.arc(mx, my, 18, 0, 7); c.fill();
    // the hub: i⁴ = 1, one full turn
    c.fillStyle = '#ffe9a8'; c.strokeStyle = '#a8741a'; c.lineWidth = 3; c.beginPath(); c.arc(CX, CY, 30, 0, 7); c.fill(); c.stroke();
    c.restore();
    for (let k = 0; k < 4; k++) M.drawEx(g, c, 'w' + k);
    M.drawEx(g, c, 'hub'); c.save(); c.shadowColor = 'rgba(10,6,30,0.95)'; c.shadowBlur = 6; M.drawEx(g, c, 'hubl'); for (let k = 0; k < 4; k++) M.drawEx(g, c, 'pl' + k); c.restore();
    // the bird points at the wheel while the work is shown, and hops when a step lands
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'bird', 322, 618 - hopK * 22, 1.1, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'bird', 312, 612, 1.1);
    c.save(); c.shadowColor = 'rgba(255,210,120,0.8)'; c.shadowBlur = 16; M.drawEx(g, c, 'ex'); c.restore();
    c.save(); c.shadowColor = 'rgba(10,6,30,0.95)'; c.shadowBlur = 6; M.drawEx(g, c, 'nt'); c.restore();
    M.drawUI(g, c);
  },
});
function tintAll(n, col) { if (!n) return n; n.col = col; for (const ch of [n.base, n.exp, n.inner, ...(n.items || [])]) tintAll(ch, col); return n; }
