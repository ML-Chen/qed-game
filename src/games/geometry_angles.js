// geometry_angles.js — ANGLE SUM! The angles of a triangle add up to 180°: tear the corners off and they make a straight line.
// An orange paper triangle on a green cutting mat on a craft table. Two corners are marked (50°, 60°), the third is x.
// Under it a pencil line runs across the mat, with a point on it and a faint half circle marked 180°.
//   1-2. Drag each marked corner down onto the line, in either order. The corner tears off along a zigzag, lifts off the
//        paper and flies down, turning as it goes, until its tip sits on the point: the 50° corner against the left half
//        of the line, the 60° corner against the right half. Its coloured angle arc comes along and its label writes itself
//        beside it on the line. A gap is left between the two.
//   3.   Drag the x corner into the gap: it tears off and fits exactly, so the three corners fill the straight line. A gold
//        half circle sweeps over all three and 180° pulses. Then "x = 180 − 50 − 60" writes itself under the line (each
//        number lights its corner), "= 70" follows, 70 flies up into the gap's label and on into the triangle's x.
// Level 0: friendly tens (50° and 60°). Level 1: tens. Level 2: fives, and the triangle may be obtuse.
// Medium mode: the tray asks for x once the gap is filled. Classic slip in the tray: 360 − 50 − 60.
const M = MK, D2R = Math.PI / 180, LY = 446, PX = 180, NY = 494, HX = 62, HY = 618;
const COL = { A: '#4aa8ff', B: '#45c97e', C: '#c47aff' }, LCOL = { A: '#a8d8ff', B: '#a8f0c4', C: '#e4c4ff' }, PAPER = '#ffbe78', EDGE = '#e0843a', NOTE = '#fff3b0';
const dir = d => [Math.cos(d * D2R), -Math.sin(d * D2R)];
const rot = ([x, y], d) => { const c = Math.cos(d * D2R), s = Math.sin(d * D2R); return [x * c + y * s, -x * s + y * c]; }; // a counter-clockwise turn on screen
const norm = d => { d = ((d % 360) + 360) % 360; return d > 180 ? d - 360 : d; };
function pick(g) {
  const r = k => Math.floor(g.rand() * k);
  if (g.level === 0) { const p = [[50, 60], [60, 70], [40, 60], [50, 70]][r(4)]; return g.rand() < 0.5 ? p : [p[1], p[0]]; }
  for (let i = 0; i < 200; i++) {
    const A = g.level === 1 ? 30 + 10 * r(6) : 25 + 5 * r(20), B = g.level === 1 ? 30 + 10 * r(6) : 25 + 5 * r(13), C = 180 - A - B;
    if (C >= (g.level === 1 ? 30 : 25) && C <= 110 && A !== B) return [A, B];
  }
  return [55, 65];
}

MG.add({
  id: 'geometry_angles', stage: 'geometry', cmd: 'ANGLE SUM!', hint: 'drag', time: 10, mood: 'bright', winText: 'Straight!', hold: 1.7,
  card: {
    title: 'Angles of a triangle', ref: 'Grade 8', kind: 'Geometry',
    text: 'The three angles inside any triangle add up to 180°, whatever its shape.\n\nYou can see it with a paper triangle. Tear off its three corners and put their tips together at one point. They fit side by side into a straight line, and a straight line is a half turn, 180°.\n\nSo if two angles are known, the third is what is left of 180°. In a triangle with angles 50° and 60°, the third angle is x = 180° − 50° − 60° = 70°.',
    note: 'The angles of a triangle add up to 180°. The missing angle is 180° minus the other two.',
    ask: 'A triangle has angles 35° and 90°. What is the third? A triangle has angles 100° and 45°?',
  },
  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g); const [A, B] = pick(g), C = 180 - A - B; S.ang = { A, B, C };
    // the triangle: base AB horizontal, sized to fit the mat above the line
    const sA = Math.sin(A * D2R), sB = Math.sin(B * D2R), sC = Math.sin(C * D2R), hK = sA * sB / sC;
    const cxK = sB / sC * Math.cos(A * D2R), span = Math.max(1, cxK) - Math.min(0, cxK); // width of the triangle per unit base
    const L = Math.min(160 / hK, 290 / span, 260), yb = 370, x0 = PX - L * (Math.min(0, cxK) + Math.max(1, cxK)) / 2;
    const VA = [x0, yb], VB = [x0 + L, yb], bAC = L * sB / sC, VC = [x0 + bAC * Math.cos(A * D2R), yb - bAC * sA];
    const side = Math.min(L, bAC, L * sA / sC), r = Math.min(52, side * 0.34); S.r = r;
    S.K = {
      A: { k: 'A', v: VA, s: 0, th: A, to: 180 - A }, B: { k: 'B', v: VB, s: 180 - B, th: B, to: 0 }, C: { k: 'C', v: VC, s: 180 + A, th: C, to: B },
    };
    let seed = A * 7 + B * 13; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (const K of Object.values(S.K)) {
      K.d = norm(K.to - K.s); const n = Math.max(6, Math.round(K.th / 7)); K.pts = [[0, 0]];
      for (let i = 0; i <= n; i++) { const rr = i === 0 || i === n ? r : r * (i % 2 ? 1.05 + R() * 0.04 : 0.95 - R() * 0.04); const p = dir(K.s + K.th * i / n); K.pts.push([p[0] * rr, p[1] * rr]); }
      const bis = dir(K.s + K.th / 2); K.bis = bis; K.cen = [bis[0] * r * 0.5, bis[1] * r * 0.5];
      // the label on the paper, just past the torn piece, and a zone over the corner for dragging it
      // the label sits just outside the corner, so it never collides with the torn pieces or the other labels
      const dl = K.k === 'C' ? 20 : 26; K.lab = [K.v[0] - bis[0] * dl, K.v[1] - bis[1] * dl * 0.8 + (K.k === 'C' ? -2 : 4)];
      const lab = K.k === 'C' ? M.row(M.vr('x', 'aC')) : M.row(M.num(K.th, 'a' + K.k), M.txt('°'));
      M.place(g, 't' + K.k, lab, K.lab[0], K.lab[1] + 8, 24, { col: '#4a1e14' }); K.labNode = lab;
      const zc = [K.v[0] + bis[0] * r * 0.45, K.v[1] + bis[1] * r * 0.45]; M.zone(g, 'c' + K.k, { x: zc[0], y: zc[1], w: 70, h: 64 });
    }
    M.zone(g, 'line', { x: PX, y: LY - 34, w: 320, h: 120 }); M.inert(g, ['line', 'aA', 'aB', 'aC', 'lA', 'lB', 'lC', 'note']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    S.hop = hop;
    // a corner tears off and flies to the point on the line, turning so that its tip sits on the point
    const send = (g, K, fly) => { const Mk = S.mk; delete Mk.box['c' + K.k]; delete Mk.zones['c' + K.k]; K.done = true; S.point = true;
      const lifted = K.lift; K.lift = false; K.lifted = lifted; const tear = lifted ? 0 : 0.22 * T;
      K.from = lifted && S.drop ? [S.drop[0] - K.cen[0], S.drop[1] - 20 - K.cen[1]] : K.v.slice();
      K.tear = g.t; g.sfx(lifted ? 'swoosh' : 'crunch'); hop(g, 'think'); M.indicate(g, K.labNode, { dur: 0.35 * T, col: COL[K.k], sc: 1.25 });
      M.at(g, [[tear, g => { K.fly = { t0: g.t, dur: fly }; K.torn = true; if (tear) g.sfx('swoosh'); }],
        [tear + fly, g => { K.fly = null; K.landed = g.t; g.sfx('pop'); hop(g, 'wow'); g.burst(PX, LY - 6, [COL[K.k], '#fff', '#ffe9a0'], 10, 110);
          const p = dir(K.to + K.th / 2), dl = r + 21 + (K.th < 40 ? 4 : 0); const lab = K.k === 'C' ? M.row(M.vr('x', 'lC')) : M.row(M.num(K.th, 'l' + K.k), M.txt('°'));
          K.line = lab; M.place(g, 'l' + K.k, lab, PX + p[0] * dl, LY + p[1] * dl + 7, 21, { col: LCOL[K.k] }); M.writeIn(g, lab, { dur: 0.22 * T }); }]]);
      return tear + fly; };
    S.send = send;
    M.play(g, {
      moves(g) {
        const out = [];
        for (const k of ['A', 'B']) { const K = S.K[k]; if (K.done) continue;
          out.push({ drag: 'c' + k, to: 'line', area: [0, LY - 110, 360, LY + 60], busy: 0.1,
            then(g) { const t = send(g, K, 0.5 * T); M.show(g, t + 0.32 * T); M.at(g, [[t + 0.3 * T, g => { if (S.K.A.landed && S.K.B.landed) { S.gapT = g.t; g.sfx('ding'); } S.point = false; }]]); } }); }
        if (out.length || S.K.C.done) return out;
        const K = S.K.C;
        return [{ drag: 'cC', to: 'line', area: [0, LY - 110, 360, LY + 60], busy: 0.1, askAt: 1.2 * T, after: 1.0 * T, ask: { v: C, wrong: [360 - A - B, A + B, 180 - A] },
          then(g) { const t = send(g, K, 0.45 * T); M.show(g, 1.2 * T);
            M.at(g, [[t + 0.02 * T, g => { S.semi = g.t; g.sfx('chime'); hop(g, 'wow'); }],
              [t + 0.08 * T, g => { // x = 180 − A − B writes itself under the line; each number lights up its corner as it is written
                S.nx = M.num(C, 'nx', { alpha: 0 }); S.neq = M.op('=', null, { alpha: 0 });
                S.note = M.row(M.vr('x'), M.op('='), M.num(180, 'n180'), M.op('−'), M.num(A, 'nA', { col: LCOL.A }), M.op('−'), M.num(B, 'nB', { col: LCOL.B }), S.neq, S.nx);
                M.place(g, 'note', S.note, PX, NY, 30, { col: NOTE }); M.writeIn(g, S.note, { dur: 0.42 * T }); }],
              [t + 0.22 * T, g => { S.semiPulse = g.t; }],
              [t + 0.3 * T, g => { M.indicate(g, 'nA', { dur: 0.3 * T, col: COL.A }); M.indicate(g, S.K.A.line, { dur: 0.3 * T, col: COL.A }); S.K.A.flash = g.t; }],
              [t + 0.42 * T, g => { M.indicate(g, 'nB', { dur: 0.3 * T, col: COL.B }); M.indicate(g, S.K.B.line, { dur: 0.3 * T, col: COL.B }); S.K.B.flash = g.t; }]]); },
          resolve(g) { M.show(g, 1.0 * T); S.neq.alpha = 1; S.nx.alpha = 1; M.writeIn(g, S.neq, { dur: 0.1 * T }); M.writeIn(g, S.nx, { delay: 0.06 * T, dur: 0.16 * T });
            M.indicate(g, 'nx', { delay: 0.18 * T, dur: 0.3 * T, col: '#ffcf3a' }); g.sfx('ding'); hop(g);
            M.at(g, [[0.3 * T, g => { const lb = M.box(g, 'lC'); // 70 flies up into the gap's label, then on into the triangle's x
                M.fly(g, { node: M.num(C, null, { col: NOTE }), from: 'nx', to: lb ? [lb.x, lb.y] : [PX, LY - 70], dur: 0.3 * T, arc: -30, s0: 30, s1: 21,
                  then(g) { const K = S.K.C, b = M.box(g, 'lC'); K.line = M.row(M.num(C, 'lC'), M.txt('°')); M.place(g, 'lC', K.line, b ? b.x : PX, (b ? b.y : LY - 60) + 7, 21, { col: LCOL.C }); K.line.pop = g.t; M.sparkle(g, 'lC', { n: 8, cols: [COL.C, '#fff'] }); g.sfx('pop'); } }); }],
              [0.6 * T, g => { const K = S.K.C, lb = M.box(g, 'lC');
                M.fly(g, { node: M.row(M.num(C), M.txt('°')), from: lb ? [lb.x, lb.y] : [PX, LY - 60], to: 'aC', dur: 0.32 * T, arc: -50, s0: 21, s1: 24, col: '#4a1e14',
                  then(g) { K.labNode = M.row(M.num(C, 'aC'), M.txt('°')); M.place(g, 'tC', K.labNode, K.lab[0], K.lab[1] + 8, 24, { col: '#4a1e14' }); K.labNode.pop = g.t;
                    M.sparkle(g, 'aC', { n: 12, cols: ['#ffe9a0', '#fff', COL.C] }); g.sfx('coin'); hop(g, 'laugh'); S.point = false; } });
                M.tween(g, S.note, { alpha: 0 }, 0.3 * T, { delay: 0.1 * T }); }]]); } }];
      },
      area(g) { const k = ['A', 'B'].filter(k => !S.K[k].done); return k.length ? k.map(k => 'c' + k).concat(['line']) : ['cC', 'line']; },
    });
  },
  update(g, dt) {
    M.update(g, dt); const S = g.s, Mk = S.mk, pr = Mk.press;
    // a corner tears off as soon as it is dragged (only a corner that may move now)
    for (const K of Object.values(S.K)) { const mine = pr && pr.dragging && pr.id === 'c' + K.k && !K.done;
      if (mine && !K.lift && MK.current(g).some(m => m.drag === 'c' + K.k)) { K.lift = true; K.liftT = g.t; g.sfx('crunch'); }
      else if (!mine && K.lift && !K.done) K.lift = false; }
    if (pr) S.drop = [pr.x, pr.y];
    // the x corner moved too early: it wobbles and its x turns red for a moment
    if (Mk.missAt > (S.lastMiss ?? -1)) { S.lastMiss = Mk.missAt; const id = Mk.missInfo && (Mk.missInfo.tap || Mk.missInfo.drag);
      if (id && id[0] === 'c') { const K = S.K[id[1]]; if (K) { K.wob = g.t; const n = M.node(g, 'a' + K.k); if (n) { n.mark = 'bad'; n.pop = g.t; M.later(g, 0.6, () => { if (n.mark === 'bad') n.mark = null; }); } } } }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { const S = g.s, pr = S.mk.press; S.drop = [x, y];
    // the x corner is what is left of the line, so it goes last: moving it first wobbles
    if (pr && pr.dragging && pr.id === 'cC' && !(S.K.A.done && S.K.B.done)) { S.mk.press = null; M.miss(g, { drag: 'cC', to: 'line' }); return; }
    M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, Mk = S.mk, r = S.r, T = M.pace(g);
    c.drawImage(g.bake('gang_table', (cc, W, H) => {
      const wg = cc.createLinearGradient(0, 0, W, H); wg.addColorStop(0, '#d89a62'); wg.addColorStop(1, '#a8683a'); cc.fillStyle = wg; cc.fillRect(0, 0, W, H);
      const R = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(17);
      cc.strokeStyle = 'rgba(90,40,10,0.14)'; cc.lineWidth = 2; for (let i = 0; i < 26; i++) { const y = R() * H; cc.beginPath(); cc.moveTo(0, y); for (let x = 0; x <= W; x += 30) cc.lineTo(x, y + Math.sin(x * 0.02 + i) * 6); cc.stroke(); }
      cc.fillStyle = 'rgba(255,240,200,0.12)'; cc.beginPath(); cc.moveTo(220, 0); cc.lineTo(360, 0); cc.lineTo(360, 260); cc.lineTo(120, 640); cc.lineTo(0, 640); cc.lineTo(0, 520); cc.fill(); // afternoon sun through a window
      // the cutting mat
      cc.fillStyle = 'rgba(40,20,10,0.35)'; cc.beginPath(); cc.roundRect(18, 190, 332, 340, 16); cc.fill();
      const mg = cc.createLinearGradient(0, 182, 0, 530); mg.addColorStop(0, '#36806a'); mg.addColorStop(1, '#2a6a58'); cc.fillStyle = mg; cc.beginPath(); cc.roundRect(14, 182, 332, 340, 16); cc.fill();
      cc.save(); cc.beginPath(); cc.roundRect(14, 182, 332, 340, 16); cc.clip();
      for (let x = 24; x < 346; x += 16) { cc.strokeStyle = (x - 24) % 80 ? 'rgba(220,255,240,0.09)' : 'rgba(220,255,240,0.2)'; cc.lineWidth = 1; cc.beginPath(); cc.moveTo(x, 182); cc.lineTo(x, 522); cc.stroke(); }
      for (let y = 190; y < 522; y += 16) { cc.strokeStyle = (y - 190) % 80 ? 'rgba(220,255,240,0.09)' : 'rgba(220,255,240,0.2)'; cc.beginPath(); cc.moveTo(14, y); cc.lineTo(346, y); cc.stroke(); }
      cc.strokeStyle = 'rgba(255,240,140,0.25)'; cc.setLineDash([3, 5]); cc.beginPath(); cc.moveTo(14, 182); cc.lineTo(200, 522); cc.stroke(); cc.restore();
      // a pencil and paper scraps on the table
      cc.save(); cc.translate(250, 560); cc.rotate(-0.25); cc.fillStyle = '#f2c03a'; cc.fillRect(-60, -6, 100, 12); cc.fillStyle = '#e88a8a'; cc.fillRect(-72, -6, 12, 12); cc.fillStyle = '#f6d8a8'; cc.beginPath(); cc.moveTo(40, -6); cc.lineTo(58, 0); cc.lineTo(40, 6); cc.fill(); cc.fillStyle = '#3a2a2a'; cc.beginPath(); cc.moveTo(52, -2); cc.lineTo(58, 0); cc.lineTo(52, 2); cc.fill(); cc.restore();
      for (const [x, y, a, col] of [[330, 600, 0.6, '#7ac8ff'], [28, 160, 2.2, '#ff8aa8'], [340, 150, 4, '#b8e86a'], [190, 600, 1.2, '#ffd86a']]) { cc.save(); cc.translate(x, y); cc.rotate(a); cc.fillStyle = 'rgba(40,20,10,0.25)'; cc.beginPath(); cc.moveTo(-12, 10); cc.lineTo(14, 12); cc.lineTo(2, -12); cc.fill(); cc.fillStyle = col; cc.beginPath(); cc.moveTo(-14, 8); cc.lineTo(12, 10); cc.lineTo(0, -14); cc.fill(); cc.restore(); }
    }), 0, 0, 360, 640);
    // drifting dust in the sunbeam
    for (let i = 0; i < 12; i++) { const x = (i * 53 + Math.sin(t * 0.4 + i) * 20 + t * 4) % 360, y = (i * 97 + t * 7) % 640, a = 0.25 + 0.3 * Math.abs(Math.sin(t + i)); c.fillStyle = `rgba(255,245,210,${a})`; c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); }
    // the pencil line, its point and the faint half turn marked 180°
    c.save(); c.strokeStyle = 'rgba(240,240,255,0.75)'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(30, LY); c.lineTo(330, LY); c.stroke();
    c.setLineDash([4, 6]); c.strokeStyle = 'rgba(255,255,255,0.28)'; c.lineWidth = 2; c.beginPath(); c.arc(PX, LY, r + 6, Math.PI, 0); c.stroke(); c.setLineDash([]);
    const sp = S.semiPulse != null ? Math.sin(M.clamp((t - S.semiPulse) / (0.4 * T), 0, 1) * Math.PI) : 0;
    c.fillStyle = S.semi != null ? `rgba(255,230,140,${0.75 + sp * 0.25})` : 'rgba(255,255,255,0.45)'; c.font = M.NUMF(18 * (1 + sp * 0.35), 600); c.textAlign = 'center'; c.fillText('180°', PX, LY + 26 + sp * 4);
    c.fillStyle = '#fff'; c.beginPath(); c.arc(PX, LY, 3.5, 0, 7); c.fill(); c.restore();
    // the paper triangle, with holes where corners were torn off
    const Ks = Object.values(S.K), wob = k => k.wob != null && t - k.wob < 0.45 ? Math.sin((t - k.wob) * 40) * 4 * (1 - (t - k.wob) / 0.45) : 0;
    const shake = Ks.reduce((a, k) => a + wob(k), 0);
    c.save(); c.translate(shake, 0);
    const tri = () => { c.beginPath(); c.moveTo(...S.K.A.v); c.lineTo(...S.K.B.v); c.lineTo(...S.K.C.v); c.closePath(); };
    const piecePath = (K, ox, oy, d) => { K.pts.forEach((p, i) => { const q = rot(p, d); i ? c.lineTo(ox + q[0], oy + q[1]) : c.moveTo(ox + q[0], oy + q[1]); }); c.closePath(); };
    c.fillStyle = 'rgba(20,40,30,0.35)'; c.save(); c.translate(4, 6); tri(); for (const K of Ks) if (K.torn || K.lift) piecePath(K, ...K.v, 0); c.fill('evenodd'); c.restore();
    tri(); for (const K of Ks) if (K.torn || K.lift) piecePath(K, ...K.v, 0);
    const pg = c.createLinearGradient(0, 200, 0, 360); pg.addColorStop(0, '#ffd09a'); pg.addColorStop(1, PAPER); c.fillStyle = pg; c.fill('evenodd');
    c.strokeStyle = EDGE; c.lineWidth = 2.5; c.lineJoin = 'round'; tri(); c.stroke();
    for (const K of Ks) {
      if (K.torn || K.lift) { c.save(); c.setLineDash([4, 4]); c.strokeStyle = 'rgba(255,240,220,0.55)'; c.lineWidth = 1.5; piecePath(K, ...K.v, 0); c.stroke(); c.restore(); }
      else { // the corner's angle arc on the paper; while it tears, a zigzag draws itself across it
        c.save(); c.strokeStyle = COL[K.k]; c.lineWidth = 3.5; c.beginPath(); c.arc(K.v[0], K.v[1], r * 0.42, -(K.s + K.th) * D2R, -K.s * D2R); c.stroke(); c.restore();
        if (K.tear != null) { const k = M.clamp((t - K.tear) / (0.22 * T), 0, 1), n = K.pts.length - 1, m = Math.max(1, Math.round(k * (n - 1)));
          c.save(); c.strokeStyle = '#fff6e0'; c.lineWidth = 2.5; c.setLineDash([5, 3]); c.beginPath(); for (let i = 1; i <= m + 1 && i <= n; i++) { const p = K.pts[i]; i === 1 ? c.moveTo(K.v[0] + p[0], K.v[1] + p[1]) : c.lineTo(K.v[0] + p[0], K.v[1] + p[1]); } c.stroke(); c.restore(); } }
    }
    for (const K of Ks) M.drawEx(g, c, 't' + K.k);
    c.restore();
    // the gold half circle sweeps over all three corners once the third fits
    if (S.semi != null) { const k = M.easeIO((t - S.semi) / (0.35 * T)); c.save(); c.strokeStyle = '#ffd25a'; c.shadowColor = '#ffd25a'; c.shadowBlur = 12; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.arc(PX, LY, r + 6, Math.PI, Math.PI + Math.PI * k); c.stroke(); c.restore(); }
    // the gap between the first two corners: a soft glow until the third corner fills it
    if (S.gapT != null && !S.K.C.landed) { const a = Math.min(1, (t - S.gapT) / 0.3) * (0.35 + 0.15 * Math.sin(t * 5)); c.save(); c.fillStyle = `rgba(196,122,255,${a})`; c.beginPath(); c.moveTo(PX, LY); c.arc(PX, LY, r, -(S.ang.B + S.ang.C) * D2R, -S.ang.B * D2R); c.closePath(); c.fill(); c.restore(); }
    // the torn corners: flying, on the line, or under the finger
    const piece = (K, x, y, d, lift) => { c.save();
      if (lift) { c.fillStyle = 'rgba(20,30,20,0.3)'; c.beginPath(); piecePath(K, x + 5 * lift, y + 8 * lift, d); c.fill(); }
      const fl = K.flash != null && t - K.flash < 0.4 ? Math.sin((t - K.flash) / 0.4 * Math.PI) : 0;
      c.fillStyle = fl ? M.mix(PAPER, '#fff6d0', fl) : PAPER; c.beginPath(); piecePath(K, x, y, d); c.fill(); c.strokeStyle = EDGE; c.lineWidth = 1.5; c.stroke();
      c.strokeStyle = COL[K.k]; c.lineWidth = 3.5; c.beginPath(); c.arc(x, y, r * 0.42, -(K.s + d + K.th) * D2R, -(K.s + d) * D2R); c.stroke(); c.restore(); };
    for (const K of Ks) {
      if (K.fly) { const k = M.easeIO((t - K.fly.t0) / K.fly.dur), x = M.lerp(K.from[0], PX, k), y = M.lerp(K.from[1], LY, k) - Math.sin(k * Math.PI) * 40; piece(K, x, y, K.d * k, Math.sin(k * Math.PI) + (K.lifted ? 0.6 : 0) * (1 - k)); }
      else if (K.landed != null) piece(K, PX, LY, K.d, Math.max(0, 1 - (t - K.landed) / 0.15) * 0.5);
      else if (K.lift && Mk.press) { const k = M.clamp((t - K.liftT) / 0.15, 0, 1); piece(K, Mk.press.x - K.cen[0] * k + (K.v[0] - Mk.press.x) * (1 - k), Mk.press.y - 20 - K.cen[1] * k + (K.v[1] - Mk.press.y + 20) * (1 - k), 0, k); }
    }
    for (const k of ['A', 'B', 'C']) M.drawEx(g, c, 'l' + k);
    M.drawEx(g, c, 'note');
    // the duck points at the work and hops when a corner lands
    const hk = Mk.lastMove != null && t - Mk.lastMove < 0.35 ? Math.sin((t - Mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'duck', HX, HY - hk * 18, 1.15, { t, pose, expr }); else SCN.host(g, c, 'duck', HX, HY, 1.15);
    M.drawUI(g, c);
  },
});
