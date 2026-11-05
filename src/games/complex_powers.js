// complex_powers.js — POWERS OF I! The powers of i repeat every 4: i⁰ = 1, i¹ = i, i² = −1, i³ = −i, i⁴ = 1.
// A big iⁿ glows in space above a wheel of the four values. The 4 in the wheel's hub stands for i⁴ = 1, one full turn.
// The player drags the 4 onto the exponent (or the exponent onto the 4): the exponent becomes n − 4 and the comet on
// the wheel runs one full lap. Tapping n − 4 subtracts. When the exponent is below 4, tapping the power gives its value
// and the comet steps round the wheel, a quarter turn per factor of i, to that value.
// Level 0: i⁵ to i⁷ (one lap). Level 1: i⁴ to i⁹. Level 2: i⁹ to i¹¹ (two laps). Medium mode: every tap opens the tray.
const M = MK, INK = '#fff6e0', ECOL = '#ffd970', CX = 180, CY = 458, R = 80;
const val = (k, id, o) => k === 0 ? M.num(1, id, o) : k === 1 ? M.vr('i', id, o) : k === 2 ? M.num(-1, id, o) : Object.assign(M.row(M.op('-'), M.gap(-5), M.vr('i')), { id, ...o });
function build(g) {
  const S = g.s, pp = id => ({ pop: S.pops[id] });
  let node;
  if (S.ans != null) node = val(S.ans, 'ans', { ...pp('ans'), col: ECOL });
  else node = M.sup(M.vr('i', 'b'), S.sub ? Object.assign(M.row(M.num(S.e), M.op('-'), M.num(4)), { id: 'sub', col: ECOL, ...pp('sub') }) : M.num(S.e, 'e', { col: ECOL, ...pp('e') }), 'pw');
  M.place(g, 'ex', node, 180, 300, 88, { col: INK });
}

MG.add({
  id: 'complex_powers', stage: 'complex', cmd: 'POWERS OF I!', hint: 'drag', time: 8, mood: 'night', winText: 'Round it goes!', hold: 1.4,
  card: {
    title: 'Powers of i', ref: 'Algebra 2', kind: 'Complex numbers',
    text: 'The number i is defined so that i² = −1. Its powers repeat in a cycle of four: i¹ = i, i² = −1, i³ = i² · i = −i, and i⁴ = i² · i² = (−1)(−1) = 1. Then the pattern starts again, because i⁵ = i⁴ · i = 1 · i = i.\n\nTo find a big power of i, take 4 away from the exponent as many times as you can. Each 4 you take away is a factor of i⁴, which equals 1, so it changes nothing. For example, i⁷ = i⁴ · i³ = 1 · i³ = −i.\n\nOn the wheel, each factor of i is a quarter turn. Four quarter turns bring you all the way around, back to where you started.',
    note: 'The value of iⁿ depends only on the remainder when n is divided by 4: i⁰ = 1, i¹ = i, i² = −1, i³ = −i.',
    ask: 'What is i⁶? What is i¹³?',
  },

  init(g) {
    const S = g.s, r = k => Math.floor(g.rand() * k); M.setup(g); S.pops = {};
    S.e = g.level === 0 ? 5 + r(3) : g.level === 1 ? 4 + r(6) : 9 + r(3); S.sub = false; S.ans = null;
    S.lapAt = -9; S.stepAt = null; S.pos = 0;
    build(g);
    M.place(g, 'hub', M.num(4, 'four', { col: '#2a1840' }), CX, CY + 15, 40);
    [[1, 0], [0, -1], [-1, 0], [0, 1]].forEach(([dx, dy], k) => M.place(g, 'w' + k, val(k, 'w' + k), CX + dx * R, CY + dy * R + 11, 30, { col: '#e8f0ff' }));
    const nMoves = 2 * Math.floor(S.e / 4) + 1; g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const burst = id => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, ['#ffd970', '#fff', '#8ad8ff'], 12, 130); };
    M.play(g, {
      moves(g) {
        const out = [];
        if (S.ans != null) return out;
        // take one full turn, i⁴ = 1, out of the exponent
        if (!S.sub && S.e >= 4) {
          const then = g => { S.sub = true; S.pops.sub = g.t; S.lapAt = g.t; g.sfx('whoosh'); build(g); burst('sub'); };
          out.push({ drag: 'four', to: ['e', 'b'], busy: 0.1, then }, { drag: 'e', to: 'four', busy: 0.1, then });
        }
        if (S.sub) out.push({ tap: 'sub', busy: 0.1, askAt: 0, after: 0.1, ask: { v: S.e - 4, wrong: [S.e + 4, S.e - 3, S.e - 5] },
          then() {}, resolve(g) { S.e -= 4; S.sub = false; S.pops.e = g.t; g.sfx('coin'); build(g); burst('e'); } });
        // a small power: read its value off the wheel
        if (!S.sub && S.e < 4) out.push({ tap: ['pw', 'b', 'e'], busy: 0.1, askAt: 0, after: 0.1, ask: { v: val(S.e), wrong: [0, 1, 2, 3].filter(k => k !== S.e).map(k => val(k)) },
          then() {}, resolve(g) { S.ans = S.e; S.pops.ans = g.t; S.stepAt = g.t; g.sfx('sparkle'); build(g); burst('ans'); } });
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
    // the comet: one lap per 4 taken away, then a quarter turn per factor of i to the answer
    const lap = M.easeIO((t - S.lapAt) / 0.6), step = S.stepAt == null ? 0 : M.easeIO((t - S.stepAt) / 0.45);
    const a = -(lap < 1 ? lap * Math.PI * 2 : 0) - step * (S.ans || 0) * Math.PI / 2, mx = CX + Math.cos(a) * R, my = CY + Math.sin(a) * R;
    for (let k = 1; k <= 8; k++) { const aa = a + k * 0.07; c.fillStyle = `rgba(255,220,140,${0.4 - k * 0.045})`; c.beginPath(); c.arc(CX + Math.cos(aa) * R, CY + Math.sin(aa) * R, 7 - k * 0.6, 0, 7); c.fill(); }
    // the stations, each tagged with its power of i; the answer's station lights up
    [[1, 0], [0, -1], [-1, 0], [0, 1]].forEach(([dx, dy], k) => {
      const x = CX + dx * R, y = CY + dy * R, lit = S.ans === k && step >= 1;
      c.fillStyle = lit ? '#ffd970' : '#3a3a7a'; c.strokeStyle = lit ? '#fff3c0' : 'rgba(180,200,255,0.7)'; c.lineWidth = 2.5; c.beginPath(); c.arc(x, y, 25, 0, 7); c.fill(); c.stroke();
      const tx = x + (dx ? dx * 46 : 34), ty = y + (dy ? dy * 34 : -26); c.font = M.VARF(15); c.fillStyle = 'rgba(220,230,255,0.75)'; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
      c.fillText('i', tx - 4, ty + 5); c.font = M.NUMF(11); c.fillText(String(k), tx + 4, ty - 2);
    });
    if (lit0(S, step)) M.node(g, 'w' + S.ans).col = '#3a1640';
    const gr = c.createRadialGradient(mx, my, 0, mx, my, 18); gr.addColorStop(0, 'rgba(255,240,180,1)'); gr.addColorStop(1, 'rgba(255,200,100,0)'); c.fillStyle = gr; c.beginPath(); c.arc(mx, my, 18, 0, 7); c.fill();
    // the hub: i⁴ = 1, one full turn
    c.fillStyle = '#ffe9a8'; c.strokeStyle = '#a8741a'; c.lineWidth = 3; c.beginPath(); c.arc(CX, CY, 27, 0, 7); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,240,200,0.9)'; c.textAlign = 'left'; c.font = M.VARF(16); c.fillText('i', CX - 25, CY - 33); c.font = M.NUMF(11); c.fillText('4', CX - 18, CY - 41); c.font = M.NUMF(16, 600); c.fillText('= 1', CX - 9, CY - 33);
    c.restore();
    for (let k = 0; k < 4; k++) M.drawEx(g, c, 'w' + k);
    M.drawEx(g, c, 'hub');
    SCN.host(g, c, 'bird', 312, 612, 1.1);
    c.save(); c.shadowColor = 'rgba(255,210,120,0.8)'; c.shadowBlur = 16; M.drawEx(g, c, 'ex'); c.restore();
    M.drawUI(g, c);
  },
});
function lit0(S, step) { return S.ans != null && step >= 1; }
