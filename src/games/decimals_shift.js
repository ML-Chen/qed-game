// decimals_shift.js — SHIFT POINT! Multiplying and dividing by 10, 100 and 1000 moves the decimal point.
// Two wooden signs in the snow each hold a problem ("3.47 × 10 =") and, under it, a big working copy of the number.
// The player drags the working copy's decimal point: it hops from gap to gap between the digits, with a little arc for
// every hop, and empty places it passes fill with 0. Dropped in the right gap, the number is rewritten cleanly (34.7).
// The two signs can be done in either order. Dropping in a wrong gap only flashes that gap.
// Level 0: × 10 and ÷ 10. Level 1: one of them is 100. Level 2: 100 or 1000 with padding zeros (0.6 × 100 = 60,
// 4.2 ÷ 100 = 0.042). Medium mode: after the drop, the player picks the rewritten number from a tray.
const M = MK, INK = SCN.ink('sign'), HOP = '#ffd45a', GOOD = '#c8f0a8', CW = 34, SZ = 50;
// empty places that become 0 when the point sits in gap `at`: between the digits and the point, plus a leading 0
const zeroAt = (P, at, j) => (j >= at && j < P.lead) || (j >= P.lead + P.len && j < at) || (j === at - 1 && at <= P.lead);
const clean = (m, d) => d <= 0 ? String(m) + '0'.repeat(-d) : (s => s.slice(0, -d) + '.' + s.slice(-d))(String(m).padStart(d + 1, '0'));
function gen(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), nz = (a, b) => { let m; do m = r(a, b); while (m % 10 === 0); return m; };
  const mul = k => L === 2 ? { m: nz(1, 99) , d: 1, k } : { m: nz(10 ** (k + 1), 10 ** (k + 2) - 1), d: k + 1, k };      // 3.47 × 10
  const div = k => L === 2 ? { m: nz(11, 99), d: 1, k: -k } : { m: nz(10 ** (k + 1), 10 ** (k + 2) - 1), d: 1, k: -k };  // 25.6 ÷ 10
  const ks = L === 0 ? [1, 1] : L === 1 ? (g.rand() < 0.5 ? [2, 1] : [1, 2]) : [2 + r(0, 1), 2 + r(0, 1)];
  const list = [mul(ks[0]), div(ks[1])]; if (g.rand() < 0.5) list.reverse(); return list;
}
// the working copy: cells (digits, or '' for an empty place) and the gap the point sits in
function layout(P) {
  const s = String(P.m).padStart(P.d + 1, '0'), pt0 = s.length - P.d, tgt = pt0 + P.k;
  const needL = Math.max(0, 1 - tgt), needR = Math.max(0, tgt - s.length), Lb = needL + 1, Rb = needR + 1;
  P.cells = [...Array(Lb).fill(''), ...s.split(''), ...Array(Rb).fill('')]; P.pt = pt0 + Lb; P.tgt = tgt + Lb; P.lead = Lb; P.len = s.length;
}

MG.add({
  id: 'decimals_shift', stage: 'decimals', cmd: 'SHIFT POINT!', hint: 'drag', time: 8, mood: 'bright', winText: 'Shifted!', hold: 1.4,
  card: {
    title: 'Multiplying by 10, 100 and 1000', ref: 'Grade 5', kind: 'Decimals',
    text: 'Each place in a number is worth 10 times the place to its right: a ten is 10 ones, and a one is 10 tenths.\n\nSo multiplying by 10 moves every digit one place to the left, into a place worth 10 times as much. Writing this by hand, it is easier to move the decimal point one place to the right instead. For example, 3.47 × 10 = 34.7. Multiplying by 100 moves the point two places right, and by 1000 three places.\n\nDividing by 10 moves the point one place to the left: 25.6 ÷ 10 = 2.56.\n\nWhen the point moves past the last digit, fill the empty places with zeros: 0.6 × 100 = 60, and 4.2 ÷ 100 = 0.042.',
    note: 'Multiplying by 10 moves every digit one place left, which looks like the point moving one place right. Count the zeros in 10, 100 or 1000 to know how many places.',
    ask: 'What is 5.08 × 100? What is 73.1 ÷ 1000?',
  },
  init(g) {
    const S = g.s; M.setup(g); S.P = gen(g); S.P.forEach((P, i) => { layout(P); P.y = 262 + i * 166; P.i = i; });
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const geo = S.geo = P => { const N = P.cells.length, x0 = 180 - N * CW / 2; return { N, x0, gx: j => x0 + j * CW, cx: j => x0 + (j + 0.5) * CW, base: P.y + 34 }; };
    const zones = () => S.P.forEach((P, i) => { const G = geo(P); M.zone(g, 'pz' + i, { x: G.gx(P.pt), y: G.base - 8, w: 30, h: 56 });
      for (let j = 0; j <= G.N; j++) if (j !== P.pt) M.zone(g, `g${i}_${j}`, { x: G.gx(j), y: G.base - 16, w: CW - 6, h: 64 }); else delete g.s.mk.box[`g${i}_${j}`]; });
    S.zones = zones; zones();
    const pow = k => 10 ** Math.abs(k), sym = k => k > 0 ? '×' : '÷';
    S.P.forEach((P, i) => M.place(g, 'pr' + i, M.row(M.num(clean(P.m, P.d)), M.op(sym(P.k)), M.num(pow(P.k)), M.op('=')), 180, P.y - 18, 30, { col: INK }));
    M.play(g, {
      moves(g) {
        return S.P.filter(P => !P.moved).map(P => ({ drag: 'pz' + P.i, to: `g${P.i}_${P.tgt}`, reach: 6, busy: 0.1,
          area: (G => [G.gx(P.tgt) - CW / 2, G.base - 90, G.gx(P.tgt) + CW / 2, G.base + 50])(geo(P)),
          ask: { v: M.num(clean(P.m, P.d - P.k)), wrong: [M.num(clean(P.m, P.d - P.k - 1)), M.num(clean(P.m, P.d + P.k)), M.num(clean(P.m, P.d - P.k + Math.sign(P.k)))] },
          then(g) { P.moved = g.t; P.from = P.pt; P.pt = P.tgt; P.cells = P.cells.map((ch, j) => ch || (zeroAt(P, P.pt, j) ? '0' : '')); g.sfx('whoosh'); zones(); },
          resolve(g) { const s = clean(P.m, P.d - P.k), dot = s.indexOf('.'); P.cells = s.replace('.', '').split(''); P.pt = dot < 0 ? -1 : dot; P.done = g.t; P.lead = 0; P.len = P.cells.length;
            g.sfx('coin'); zones(); const G = geo(P); g.burst(180, G.base - 16, ['#ffd45a', '#c8f0ff', '#fff'], 14, 130); } }));
      },
      area(g) { const m = M.current(g)[0]; return m ? [m.drag] : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, Mk = S.mk, t = g.t;
    SCN.bg(g, c, 'snow');
    for (const P of S.P) SCN.panel(c, 'sign', 180, P.y + 6, 316, 128, t);
    SCN.host(g, c, 'penguin', 292, 606, 1.3);
    const pr = Mk.press && Mk.press.dragging && /^pz\d/.test(Mk.press.id) ? Mk.press : null;
    for (const P of S.P) {
      const G = S.geo(P), drag = pr && +pr.id.slice(2) === P.i, hov = drag ? M.clamp(Math.round((pr.x - G.x0) / CW), 0, G.N) : null;
      const at = drag ? hov : P.pt, col = P.done ? GOOD : INK;
      M.drawEx(g, c, 'pr' + P.i);
      // the digits; empty places show a faint dash, or a faint 0 while the point is dragged past them
      c.save(); c.font = M.NUMF(SZ); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
      P.cells.forEach((ch, j) => {
        const fill0 = !ch && drag && zeroAt(P, at, j);
        const pop = P.done ? 1 + 0.3 * Math.sin(M.clamp((t - P.done) / 0.3, 0, 1) * Math.PI) : 1;
        c.save(); c.translate(G.cx(j) + (at < 0 ? 0 : j < at ? -7 : 7), G.base); c.scale(pop, pop);
        if (ch) { c.fillStyle = col; c.fillText(ch, 0, 0); }
        else if (fill0) { c.globalAlpha = 0.5; c.fillStyle = INK; c.fillText('0', 0, 0); }
        else { c.fillStyle = 'rgba(255,244,220,0.3)'; c.fillRect(-9, 2, 18, 3); }
        c.restore();
      });
      // the point, and while dragging one arc per hop from where it started
      if (at >= 0) {
        if (drag) { const dir = Math.sign(at - P.pt); c.strokeStyle = HOP; c.lineWidth = 2.5; c.lineCap = 'round';
          for (let j = P.pt; j !== at; j += dir) { const a = G.gx(j), b = G.gx(j + dir); c.beginPath(); c.moveTo(a, G.base + 10); c.quadraticCurveTo((a + b) / 2, G.base + 34, b, G.base + 10); c.stroke(); } }
        const bob = drag ? -6 + Math.sin(t * 18) * 2 : 0;
        c.fillStyle = drag ? HOP : col; c.beginPath(); c.arc(G.gx(at), G.base - 5 + bob, drag ? 7.5 : 6, 0, 7); c.fill();
      }
      // a drop in a wrong gap flashes that gap red
      const mi = Mk.missInfo; if (mi && mi.drag === 'pz' + P.i && t - Mk.missAt < 0.5) { const j = +mi.to.split('_')[1]; c.fillStyle = `rgba(216,69,74,${0.6 * (1 - (t - Mk.missAt) / 0.5)})`; c.beginPath(); c.arc(G.gx(j), G.base - 4, 12, 0, 7); c.fill(); }
      c.restore();
    }
    M.drawUI(g, c);
  },
});
