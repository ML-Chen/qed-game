// decimals_shift.js — SHIFT POINT! Multiplying and dividing by 10, 100 and 1000 moves the decimal point.
// Two wooden signs in the snow each hold a problem ("3.47 × 10 =") and, under it, a big working copy of the number.
// The player drags the working copy's decimal point to the gap where it should end up (a gold ghost point follows the
// finger). Then the working plays by itself: the "× 10" in the problem lights up, and the real point hops there one
// gap at a time; every hop draws its little arc and writes "×10" (or "÷10") under it, and an empty place the point
// passes fills with a 0 that writes itself in. Then the number tidies up: unneeded zeros and empty places fade, the
// digits glide together and turn green (34.7). The two signs can be done in either order. A drop in a wrong gap flashes
// that gap red. The penguin hops on every landing.
// Level 0: × 10 and ÷ 10. Level 1: one of them is 100. Level 2: 100 or 1000 with padding zeros (0.6 × 100 = 60,
// 4.2 ÷ 100 = 0.042). Medium mode: once the point has arrived, the player picks the rewritten number from a tray.
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
// the working copy: cells ({ ch: digit or '' for an empty place }) and the gap the point sits in
function layout(P) {
  const s = String(P.m).padStart(P.d + 1, '0'), pt0 = s.length - P.d, tgt = pt0 + P.k;
  const needL = Math.max(0, 1 - tgt), needR = Math.max(0, tgt - s.length), Lb = needL + 1, Rb = needR + 1;
  P.cells = [...Array(Lb).fill(''), ...s.split(''), ...Array(Rb).fill('')].map(ch => ({ ch })); P.pt = pt0 + Lb; P.tgt = tgt + Lb; P.lead = Lb; P.len = s.length;
}
// the tidy-up after the point has arrived: which cells stay (no empty places, no extra leading zeros) and where they go
function tidy(P) {
  const idx = P.cells.map((c, j) => j).filter(j => P.cells[j].ch);
  while (idx.length > 1 && P.cells[idx[0]].ch === '0' && idx[0] + 1 < P.pt) idx.shift(); // a leading zero before another digit of the whole part
  const keepPt = idx.some(j => j >= P.pt), str = idx.map(j => (j === P.pt && keepPt ? '.' : '') + P.cells[j].ch).join('');
  return { keep: new Set(idx), keepPt, str };
}
const pow = k => 10 ** Math.abs(k), sym = k => k > 0 ? '×' : '÷';

MG.add({
  id: 'decimals_shift', stage: 'decimals', cmd: 'SHIFT POINT!', hint: 'drag', time: 8, mood: 'bright', winText: 'Shifted!', hold: 1.4,
  card: {
    title: 'Multiplying by 10, 100 and 1000', ref: 'Grade 5', kind: 'Decimals',
    text: 'Each place in a number is worth 10 times the place to its right: a ten is 10 ones, and a one is 10 tenths.\n\nSo multiplying by 10 moves every digit one place to the left, into a place worth 10 times as much. Writing this by hand, it is easier to move the decimal point one place to the right instead. For example, 3.47 × 10 = 34.7. Multiplying by 100 moves the point two places right, and by 1000 three places.\n\nDividing by 10 moves the point one place to the left: 25.6 ÷ 10 = 2.56.\n\nWhen the point moves past the last digit, fill the empty places with zeros: 0.6 × 100 = 60, and 4.2 ÷ 100 = 0.042.',
    note: 'Multiplying by 10 moves every digit one place left, which looks like the point moving one place right. Count the zeros in 10, 100 or 1000 to know how many places.',
    ask: 'What is 5.08 × 100? What is 73.1 ÷ 1000?',
  },
  init(g) {
    const S = g.s; M.setup(g); S.P = gen(g); S.P.forEach((P, i) => { layout(P); P.y = 250 + i * 164; P.i = i; P.ptX = P.pt; P.hops = []; });
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const geo = S.geo = P => { const N = P.cells.length, x0 = 180 - N * CW / 2; return { N, x0, gx: j => x0 + j * CW, cx: j => x0 + (j + 0.5) * CW, base: P.y + 32 }; };
    const unzone = id => { delete g.s.mk.box[id]; if (g.s.mk.zones) delete g.s.mk.zones[id]; };
    const zones = () => S.P.forEach((P, i) => { const G = geo(P);
      for (let j = 0; j <= 9; j++) unzone(`g${i}_${j}`);
      if (P.moved) { unzone('pz' + i); return; }
      M.zone(g, 'pz' + i, { x: G.gx(P.pt), y: G.base - 8, w: 30, h: 56 });
      for (let j = 0; j <= G.N; j++) if (j !== P.pt) M.zone(g, `g${i}_${j}`, { x: G.gx(j), y: G.base - 16, w: CW - 6, h: 64 }); });
    S.zones = zones; zones();
    S.P.forEach((P, i) => M.place(g, 'pr' + i, M.row(M.num(clean(P.m, P.d), 'pn' + i), M.op(sym(P.k), 'ps' + i), M.num(pow(P.k), 'pk' + i), M.op('=', 'pe' + i)), 180, P.y - 24, 30, { col: INK }));
    M.inert(g, S.P.flatMap((P, i) => ['pn' + i, 'ps' + i, 'pk' + i, 'pe' + i]));
    const hop = g => { g.s.mk.lastMove = g.t; };
    M.play(g, {
      moves(g) {
        return S.P.filter(P => !P.moved).map(P => { const n = Math.abs(P.k), T = M.pace(g), H = (n > 1 ? 0.36 : 0.45) * T, H0 = 0.3 * T, end = H0 + n * H;
          return { drag: 'pz' + P.i, to: `g${P.i}_${P.tgt}`, reach: 6, busy: 0.1, askAt: end + 0.12 * T, after: 0.75 * T,
          area: (G => [G.gx(P.tgt) - CW / 2, G.base - 90, G.gx(P.tgt) + CW / 2, G.base + 50])(geo(P)),
          ask: { v: M.num(clean(P.m, P.d - P.k)), wrong: [M.num(clean(P.m, P.d - P.k - 1)), M.num(clean(P.m, P.d + P.k)), M.num(clean(P.m, P.d - P.k + Math.sign(P.k)))] },
          then(g) { const dir = Math.sign(P.k); P.moved = g.t; P.from = P.pt; g.sfx('whoosh'); zones(); M.show(g, end + 0.12 * T);
            // the × 10 in the problem says how far: it lights up, and the point hops one place for every zero
            M.circle(g, ['ps' + P.i, 'pk' + P.i], { dur: 0.55 * T, col: HOP }); M.indicate(g, 'pk' + P.i, { dur: 0.4 * T, col: HOP, sc: 1.25 });
            for (let h = 0; h < n; h++) { const a = P.from + h * dir, b = a + dir, t0 = H0 + h * H;
              M.at(g, [[t0, g => { P.hops.push({ a, b, t0: g.t, dur: H * 0.85 }); g.sfx('tap'); }],
                [t0 + H * 0.85, g => { P.ptX = b; hop(g); g.sfx('pop');
                  P.cells.forEach((c, j) => { if (!c.ch && zeroAt(P, b, j)) { c.ch = '0'; c.born = g.t; c.zero = true; } });
                  const G = geo(P); g.burst(G.gx(b), G.base - 6, ['#ffe9a0', '#fff', HOP], 6, 70); }]]); }
            M.at(g, [[end, g => { P.pt = P.tgt; P.ptX = P.tgt; }]]); },
          resolve(g) { const G = geo(P), td = tidy(P), keep = td.keep, s1 = clean(P.m, P.d - P.k); M.show(g, 0.75 * T);
            // the number tidies up: extra zeros and empty places fade, the digits close ranks around the point
            const kept = [...keep], dot = s1.indexOf('.'), N1 = kept.length, pt1 = dot < 0 ? -1 : dot, x01 = 180 - N1 * CW / 2;
            const xAt = (k, ptg) => x01 + (k + 0.5) * CW + (ptg < 0 ? 0 : k < ptg ? -7 : 7);
            P.tidy = { t0: g.t + 0.1 * T, dur: 0.38 * T, x0: P.cells.map((c, j) => cellX(P, G, j, P.pt)), x1: P.cells.map((c, j) => keep.has(j) ? xAt(kept.indexOf(j), pt1) : null), p0: G.gx(P.pt), p1: pt1 < 0 ? null : x01 + pt1 * CW };
            M.at(g, [[0.5 * T, g => { P.done = g.t; g.sfx('coin'); hop(g); g.burst(180, G.base - 16, ['#ffd45a', '#c8f0ff', '#fff'], 14, 130); }],
              [0.72 * T, g => { P.cells = kept.map(j => ({ ch: P.cells[j].ch })); P.pt = pt1; P.ptX = pt1; P.lead = 0; P.len = N1; P.tidy = null; P.hops = []; P.final = true; zones(); }]]); } }; });
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
    for (const P of S.P) SCN.panel(c, 'sign', 180, P.y + 14, 316, 154, t);
    SCN.host(g, c, 'penguin', 300, 622, 1.2);
    const pr = Mk.press && Mk.press.dragging && /^pz\d/.test(Mk.press.id) ? Mk.press : null;
    for (const P of S.P) {
      const G = S.geo(P), drag = pr && +pr.id.slice(2) === P.i, hov = drag ? M.clamp(Math.round((pr.x - G.x0) / CW), 0, G.N) : null;
      M.drawEx(g, c, 'pr' + P.i);
      // where the point is now: between gaps while it hops (it dips under the digits along its arc)
      let px = P.ptX, dip = 0; const live = P.hops.find(h => t >= h.t0 && t < h.t0 + h.dur);
      if (live) { const k = M.easeIO((t - live.t0) / live.dur); px = M.lerp(live.a, live.b, k); dip = Math.sin(k * Math.PI); }
      const TD = P.tidy, tk = TD ? M.easeIO((t - TD.t0) / TD.dur) : 0, col = P.done ? GOOD : INK;
      c.save(); c.font = M.NUMF(SZ); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
      P.cells.forEach((cl, j) => {
        const ch = cl.ch, pop = P.done ? 1 + 0.3 * Math.sin(M.clamp((t - P.done) / 0.3, 0, 1) * Math.PI) : 1;
        let x = TD ? (TD.x1[j] != null ? M.lerp(TD.x0[j], TD.x1[j], tk) : TD.x0[j]) : cellX(P, G, j, px), al = TD && TD.x1[j] == null ? 1 - tk : 1;
        c.save(); c.translate(x, G.base); c.scale(pop, pop); c.globalAlpha *= al;
        if (ch) { const wk = cl.born != null ? M.clamp((t - cl.born) / 0.28, 0, 1) : 1;
          if (wk < 1) { c.beginPath(); c.rect(-CW / 2, -SZ, CW * M.easeIO(wk), SZ * 1.3); c.clip(); }
          c.fillStyle = cl.zero && !P.done ? '#ffe9b0' : col; if (cl.born != null && wk < 1) { c.shadowColor = HOP; c.shadowBlur = 12; } c.fillText(ch, 0, 0);
          if (wk < 1) { c.fillStyle = '#fffbe0'; c.beginPath(); c.arc(-CW / 2 + CW * M.easeIO(wk), -SZ * 0.35, 3, 0, 7); c.fill(); } }
        else if (drag && zeroAt(P, hov, j)) { c.globalAlpha *= 0.45; c.fillStyle = INK; c.fillText('0', 0, 0); }
        else if (!P.final) { c.fillStyle = 'rgba(255,244,220,0.3)'; c.fillRect(-9, 2, 18, 3); }
        c.restore();
      });
      // the hops made so far: an arc under the number for each, with its × 10 (or ÷ 10) written underneath
      const arc = (a, b, k, y0) => { const xa = G.gx(a), xb = G.gx(b); c.beginPath(); for (let i = 0; i <= 16; i++) { const u = k * i / 16, x = M.lerp(xa, xb, u), y = y0 + Math.sin(u * Math.PI) * 16; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); };
      const fadeH = TD ? 1 - tk : 1;
      for (const h of P.hops) { const k = M.clamp((t - h.t0) / h.dur, 0, 1); if (k <= 0) continue;
        c.save(); c.globalAlpha *= fadeH; c.strokeStyle = HOP; c.lineWidth = 2.5; c.lineCap = 'round'; c.shadowColor = HOP; c.shadowBlur = 6; arc(h.a, h.b, M.easeIO(k), G.base + 8);
        const lk = M.clamp((k - 0.45) / 0.35, 0, 1); if (lk > 0) { const lx = (G.gx(h.a) + G.gx(h.b)) / 2, s = 1 + 0.35 * Math.sin(lk * Math.PI);
          c.globalAlpha *= lk; c.shadowBlur = 0; c.fillStyle = '#ffe6a0'; c.font = M.NUMF(17 * s, 700); c.fillText(sym(P.k) + ' 10', lx, G.base + 40 + (Math.min(h.a, h.b) % 2) * 17); }
        c.restore(); }
      // the point, and while dragging a dashed preview of the hops to the gap under the finger
      if (drag) { const dir = Math.sign(hov - P.pt); c.save(); c.strokeStyle = 'rgba(255,212,90,0.55)'; c.lineWidth = 2; c.lineCap = 'round'; c.setLineDash([4, 5]);
        for (let j = P.pt; j !== hov; j += dir) arc(j, j + dir, 1, G.base + 8); c.restore();
        c.fillStyle = HOP; c.beginPath(); c.arc(G.gx(hov), G.base - 11 + Math.sin(t * 18) * 2, 7.5, 0, 7); c.fill(); }
      const ptx = TD ? (TD.p1 == null ? TD.p0 : M.lerp(TD.p0, TD.p1, tk)) : P.pt < 0 ? null : G.gx(px), pal = TD && TD.p1 == null ? 1 - tk : 1;
      if (ptx != null && (!P.final || P.pt >= 0)) { c.save(); c.globalAlpha *= pal * (drag ? 0.35 : 1); const lit = live || (P.moved && !P.done);
        if (lit) { c.shadowColor = HOP; c.shadowBlur = 14; } c.fillStyle = lit ? HOP : col; c.beginPath(); c.arc(ptx, G.base - 5 + dip * 30, lit ? 7 : 6, 0, 7); c.fill(); c.restore(); }
      // a drop in a wrong gap flashes that gap red
      const mi = Mk.missInfo; if (mi && mi.drag === 'pz' + P.i && mi.to && t - Mk.missAt < 0.5) { const j = +mi.to.split('_')[1]; c.fillStyle = `rgba(216,69,74,${0.6 * (1 - (t - Mk.missAt) / 0.5)})`; c.beginPath(); c.arc(G.gx(j), G.base - 4, 12, 0, 7); c.fill(); }
      c.restore();
    }
    M.drawUI(g, c);
  },
});
// a digit's x: digits on either side of the point step apart a little to make room for it (smoothly, as it passes)
function cellX(P, G, j, ptX) { return G.cx(j) + (ptX < 0 || P.final && P.pt < 0 ? 0 : 7 * M.clamp((j + 0.5 - ptX) * 2.5, -1, 1)); }
