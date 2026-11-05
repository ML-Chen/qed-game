// arrows_comp.js — COMPONENTS! An arrow of length r at angle θ splits into (r cos θ, r sin θ), for special angles.
// A comet arrow streaks across a dusk sky over a hill, with r written along it and θ in its corner; a rabbit holds two
// star tags, cos θ and sin θ. The problem line is v = (?, ?). Moves (either order):
//   1. Drag cos θ onto the first ? (or onto the x-axis): a dashed line drops from the arrow's tip to the axis and the
//      arrow's shadow on the x-axis glows gold. r flies off the arrow and cos θ off the tag into the ?, "cos 60° = ½"
//      writes itself under it, the ½ flies in (4 · ½), and the product collapses into its value (2), which is also
//      written under the shadow.
//   2. Drag sin θ onto the second ? (or onto the upright side): the same with the height, in cyan.
// Wrong moves (they only wobble): swapping sin and cos (the classic slip), tapping the arrow or the ?s.
// Level 0: 30° or 60°, r = 2, 4 or 6. Level 1: also 45° and longer arrows. Level 2: 120°, 135°, 150° (x is negative).
// Medium mode: each component's value is picked from the tray.
const M = MK, INK = '#fff6e8', XC = '#ffd25a', YC = '#7ee0ff', HX = 300, HY = 612, EXY = 252, AXY = 505, LEN = 180;
function pick(g) {
  const L = g.level, R = a => a[Math.floor(g.rand() * a.length)];
  const th = R(L === 0 ? [30, 60] : L === 1 ? [30, 45, 60] : [120, 135, 150]), r = R(L === 0 ? [2, 4, 6] : L === 1 ? [4, 6, 8, 10] : [2, 4, 6, 8]);
  return { th, r };
}
// exact values of cos and sin for these angles, as { s: sign, k: number under the root (1 = none), d: denominator }
function trig(fn, th) {
  const ref = th > 90 ? 180 - th : th, sgn = fn === 'cos' && th > 90 ? -1 : 1;
  const k = fn === 'cos' ? (ref === 30 ? 3 : ref === 45 ? 2 : 1) : (ref === 60 ? 3 : ref === 45 ? 2 : 1);
  return { s: sgn, k, d: 2 };
}
const rootN = (k, o) => k === 1 ? M.num(1, null, o) : M.row(M.txt('√', null, o), M.num(k, null, o));
// the value of a trig function as a fraction: ½, √3/2, −√2/2
const trigNode = (t, o) => M.row(t.s < 0 ? M.op('-', null, o) : null, M.frac(rootN(t.k, o), M.num(t.d, null, o), null, o));
// r times it: (r/2)√k with its sign (r is even, so r/2 is whole)
function valNode(r, t, o) { const c = r / 2 * t.s; if (t.k === 1) return M.num(c, null, o); return M.row(Math.abs(c) === 1 ? (c < 0 ? M.op('-', null, o) : null) : M.num(c, null, o), M.txt('√', null, o), M.num(t.k, null, o)); }
const fname = (fn, th, o) => M.row(M.txt(fn, null, o), M.gap(5), M.num(th, null, o), M.txt('°', null, o));
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
const leaves = (n, out = []) => { if (!n) return out; if (/^(num|var|txt|op)$/.test(n.k)) out.push(n); for (const ch of [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || [])]) leaves(ch, out); return out; };

MG.add({
  id: 'arrows_comp', stage: 'arrows', cmd: 'COMPONENTS!', hint: 'drag', time: 9, mood: 'night', winText: 'Split!', hold: 1.6,
  card: {
    title: 'Components of a vector', ref: 'Precalculus', kind: 'Vectors',
    text: 'An arrow can be described by its length r and its angle θ (theta) from the x-axis. Its components say the same thing as steps: how far across, and how far up.\n\nShine a light straight down on the arrow. Its shadow on the x-axis is r cos θ long. Its height is r sin θ. So the arrow is (r cos θ, r sin θ).\n\nFor an arrow of length 4 at 60°: cos 60° = ½ and sin 60° = √3/2, so the arrow is (4 · ½, 4 · √3/2) = (2, 2√3). Check with the Pythagorean theorem: 2² + (2√3)² = 4 + 12 = 16 = 4².\n\nPast 90° the arrow points left, and cos θ is negative.',
    note: 'An arrow of length r at angle θ is (r cos θ, r sin θ): cos for across, sin for up.',
    ask: 'What are the components of an arrow of length 6 at 30°? Of length 2 at 135°?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { th, r } = S, T = M.pace(g);
    S.t = [trig('cos', th), trig('sin', th)];
    S.OX = th > 90 ? 290 : 70; const a = th * Math.PI / 180; S.tip = [S.OX + Math.cos(a) * LEN, AXY - Math.sin(a) * LEN];
    S.rlab = [(S.OX + S.tip[0]) / 2 - Math.sin(a) * 22, (AXY + S.tip[1]) / 2 - Math.cos(a) * 22];
    // the problem line: v = (?, ?)
    S.sl = [M.slot('sl0', { col: XC, w: 40 }), M.slot('sl1', { col: YC, w: 40 })];
    // the brackets are plain glyphs, so they glide on their own when the line changes width
    S.ex = M.row(M.vr('v', 'vv'), M.op('=', 'eq'), M.txt('(', 'par'), S.sl[0], M.op(',', 'cm'), M.gap(6), S.sl[1], M.txt(')', 'par2'));
    // one size for the whole game, so the line never jumps: the widest it gets is one product written out and the other ?
    const wide = [[M.row(M.num(r), M.gap(5), fname('cos', th)), M.slot()], [valNode(r, S.t[0]), M.row(M.num(r), M.gap(5), fname('sin', th))]].map(([p, q]) => M.lay(M.row(M.vr('v'), M.op('='), M.paren(M.row(M.slot(null, { w: 40, fill: p }), M.op(','), M.gap(6), M.slot(null, { w: 40, fill: q })))), 40).w);
    S.exS = Math.max(26, Math.floor(40 * Math.min(1, 316 / Math.max(...wide))));
    S.relay = () => M.place(g, 'ex', S.ex, 180, EXY, S.exS, { col: INK }); S.relay();
    // the two star tags the rabbit holds
    S.tagX = th > 90 ? [172, 284] : [70, 186]; ['cos', 'sin'].forEach((fn, i) => M.place(g, 'tag' + i, Object.assign(fname(fn, th), { id: 'tag' + i }), S.tagX[i], 588, 26, { col: i ? YC : XC }));
    // the arrow (tappable, but it is never a move) and its two legs as drop zones
    const [tx, ty] = S.tip; M.zone(g, 'arw', { x: (S.OX + tx) / 2, y: (AXY + ty) / 2, w: 40, h: 40 });
    M.zone(g, 'leg0', { x: (S.OX + tx) / 2, y: AXY, w: Math.abs(tx - S.OX), h: 30 }); M.zone(g, 'leg1', { x: tx, y: (AXY + ty) / 2, w: 30, h: AXY - ty });
    M.inert(g, ['vv', 'eq', 'par', 'par2', 'cm']);
    S.done = [false, false]; S.sh = [null, null]; S.lab = [null, null];
    g.dur *= (2.6 + 1.05 * 2) / 8 * 1.35;
    const comp = (i, to) => { const fn = i ? 'sin' : 'cos', col = i ? YC : XC, tv = S.t[i];
      const wrongs = [valNode(r, S.t[1 - i]), M.num(r), valNode(2 * r, tv), M.row(M.num(r), M.txt('√'), M.num(tv.k === 1 ? 2 : tv.k))];
      return { drag: 'tag' + i, to, busy: 0.1, reach: 40, askAt: 1.0 * T, after: 0.95 * T,
        ask: { v: valNode(r, tv), wrong: wrongs.filter(w => JSON.stringify(leaves(w).map(l => l.v)) !== JSON.stringify(leaves(valNode(r, tv)).map(l => l.v))).slice(0, 3) },
        then(g) { S.done[i] = true; S.point = true; hop(g, 'think'); g.sfx('swoosh'); M.show(g, 1.0 * T); S.sh[i] = g.t;
          M.circle(g, 'sl' + i, { col, dur: 0.5 * T });
          // r off the arrow and the trig name off the tag fly into the ?
          const rN = M.num(r, null, { col: INK, alpha: 0 }), fN = fname(fn, th, { col, alpha: 0 }); S.cur = { rN, fN };
          const [mx, my] = S.rlab;
          M.fly(g, { node: M.num(r), from: [mx, my], to: 'sl' + i, delay: 0.3 * T, dur: 0.36 * T, arc: -30, s0: 26, s1: S.exS * 0.8, col: INK });
          M.fly(g, { node: fname(fn, th), from: 'tag' + i, to: 'sl' + i, delay: 0.36 * T, dur: 0.38 * T, arc: -50, s0: 26, s1: S.exS * 0.8, col,
            then(g) { S.sl[i].fill = M.row(rN, M.gap(5), fN); for (const l of [...leaves(rN), ...leaves(fN)]) l.alpha = 1; S.relay(); M.sparkle(g, 'sl' + i, { n: 8, cols: [col, '#fff'] }); g.sfx('pop'); hop(g); } });
          // "cos 60° = ½" writes itself under the ?
          M.at(g, [[0.72 * T, g => { const b = M.box(g, 'sl' + i); S.nt = M.row(fname(fn, th), M.op('='), trigNode(tv, { col })); S.ntKey = 'nt' + i;
            M.place(g, S.ntKey, S.nt, M.clamp(b.x, 120, 240), EXY + 56, 30, { col: INK }); M.writeIn(g, S.nt, { dur: 0.3 * T }); g.sfx('tap'); }]]); },
        resolve(g) { M.show(g, 0.95 * T);
          // the value flies up and takes the trig name's place: 4 · ½
          const nb = M.box(g, S.ntKey), vN = trigNode(tv, { col }); const w = M.lay(trigNode(tv), 30).w;
          for (const l of leaves(vN)) l.alpha = 0;
          M.fly(g, { node: trigNode(tv), from: nb ? [nb.x + nb.w / 2 - w / 2, nb.y] : 'sl' + i, to: 'sl' + i, dur: 0.3 * T, arc: 20, s0: 30, s1: S.exS * 0.8, col,
            then(g) { S.sl[i].fill = M.row(S.cur.rN, M.op('·'), vN); for (const l of leaves(vN)) l.alpha = 1; S.relay(); M.tween(g, S.nt, { alpha: 0 }, 0.2 * T); g.sfx('tap'); hop(g); } });
          M.at(g, [[0.55 * T, g => { const v = valNode(r, tv, { col, pop: g.t }); S.sl[i].fill = v; S.relay(); delete g.s.mk.ex[S.ntKey];
              M.sparkle(g, 'sl' + i, { n: 12, cols: [col, '#fff'] }); g.sfx('ding'); hop(g, 'laugh'); S.lab[i] = g.t; }],
            [0.95 * T, g => { S.point = false; }]]); } }; };
    M.play(g, {
      moves(g) { const out = []; if (!S.done[0]) out.push(comp(0, ['sl0', 'leg0'])); if (!S.done[1]) out.push(comp(1, ['sl1', 'leg1'])); return out; },
      area(g) { return !S.done[0] ? ['tag0', 'sl0'] : ['tag1', 'sl1']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, mk = S.mk, T = M.pace(g), [tx, ty] = S.tip, OX = S.OX;
    c.drawImage(g.bake('comp_dusk', (cc, W, H) => paintBg(cc, W, H)), 0, 0, 360, 640);
    twinkle(c, t);
    // the banner for the problem line
    c.save(); c.fillStyle = 'rgba(30,16,60,0.55)'; c.strokeStyle = 'rgba(255,230,190,0.5)'; c.lineWidth = 2; c.beginPath(); c.roundRect(16, 196, 328, 92, 18); c.fill(); c.stroke(); c.restore();
    // the axes, chalked across the sky
    c.save(); c.strokeStyle = 'rgba(255,246,232,0.75)'; c.lineWidth = 2.5; c.lineCap = 'round'; c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 4;
    c.beginPath(); c.moveTo(14, AXY); c.lineTo(346, AXY); c.moveTo(OX, AXY + 18); c.lineTo(OX, 320); c.stroke();
    c.fillStyle = 'rgba(255,246,232,0.75)'; for (const [x, y, an] of [[348, AXY, 0], [OX, 316, -Math.PI / 2]]) { c.beginPath(); c.moveTo(x + Math.cos(an) * 6, y + Math.sin(an) * 6); c.lineTo(x + Math.cos(an + 2.5) * 9, y + Math.sin(an + 2.5) * 9); c.lineTo(x + Math.cos(an - 2.5) * 9, y + Math.sin(an - 2.5) * 9); c.fill(); }
    c.restore();
    // the shadows: a dashed drop line from the tip, then the leg glowing along the axis (x) or upright (y)
    const leg = (i, x0, y0, x1, y1, col) => { if (S.sh[i] == null) return; const k = M.easeIO((t - S.sh[i] - 0.05 * T) / (0.3 * T)), k2 = M.easeIO((t - S.sh[i] - 0.25 * T) / (0.35 * T));
      c.save(); c.strokeStyle = col; c.globalAlpha = 0.8; c.setLineDash([5, 6]); c.lineWidth = 2; c.beginPath(); c.moveTo(tx, ty); c.lineTo(i ? M.lerp(tx, OX, k) : tx, i ? ty : M.lerp(ty, AXY, k)); c.stroke(); c.restore();
      if (k2 > 0) { c.save(); c.strokeStyle = col; c.shadowColor = col; c.shadowBlur = 14; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, y0); c.lineTo(M.lerp(x0, x1, k2), M.lerp(y0, y1, k2)); c.stroke(); c.restore(); } };
    leg(0, OX, AXY, tx, AXY, XC); leg(1, tx, AXY, tx, ty, YC);
    // the angle arc and θ, and the comet arrow with r along it
    const an = S.th * Math.PI / 180; c.save(); c.strokeStyle = '#ffb0d8'; c.lineWidth = 3; c.beginPath(); c.arc(OX, AXY, 34, -an, 0); c.stroke(); c.restore();
    const lb = M.row(M.num(S.th), M.txt('°')), lm = M.lay(lb, 22), la = an / 2, lr = 56; c.save(); c.shadowColor = 'rgba(0,0,0,0.8)'; c.shadowBlur = 4; M.draw(c, lb, OX + Math.cos(la) * lr - lm.w / 2, AXY - Math.sin(la) * lr + 8, 22, { col: '#ffc8e4' }); c.restore();
    comet(c, OX, AXY, tx, ty, t);
    const [mx, my] = S.rlab;
    { const n = M.num(S.r), m = M.lay(n, 28); c.save(); c.shadowColor = 'rgba(0,0,0,0.8)'; c.shadowBlur = 5; M.draw(c, n, mx - m.w / 2, my + 10, 28, { col: INK }); c.restore(); }
    // the values under the legs once worked out
    const val = (i, x, y, col) => { if (S.lab[i] == null) return; const k = M.clamp((t - S.lab[i]) / (0.3 * T), 0, 1), n = valNode(S.r, S.t[i]), m = M.lay(n, 27); c.save(); c.globalAlpha = k; c.shadowColor = 'rgba(0,0,0,0.85)'; c.shadowBlur = 5; M.draw(c, n, x - m.w / 2, y, 27, { col }); c.restore(); };
    val(0, (OX + tx) / 2, AXY + 30, XC); val(1, tx + (S.th > 90 ? -30 : 30) * 1.15, (AXY + ty) / 2 + 8, YC);
    // the rabbit with the two star tags
    for (let i = 0; i < 2; i++) { const b = M.box(g, 'tag' + i); if (!b) continue; const P0 = mk.press, dragging = P0 && P0.id === 'tag' + i && P0.dragging, used = S.done[i];
      c.save(); c.globalAlpha = dragging ? 0.4 : used ? 0.45 : 1; c.fillStyle = 'rgba(40,20,70,0.85)'; c.strokeStyle = i ? YC : XC; c.lineWidth = 2.5; c.beginPath(); c.roundRect(b.x - b.w / 2 - 12, b.y - 22, b.w + 24, 44, 14); c.fill(); c.stroke();
      c.fillStyle = i ? YC : XC; star(c, b.x - b.w / 2 - 12, b.y - 22, 6); c.restore(); }
    const hk = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missed = mk.missAt > 0 && t - mk.missAt < 0.7;
    const expr = won ? 'laugh' : lost ? 'sad' : missed ? 'think' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'rabbit', S.th > 90 ? 52 : HX, HY - hk * 22, 1.35, { t, pose, expr, facing: S.th > 90 ? 1 : -1 }); else SCN.host(g, c, 'rabbit', S.th > 90 ? 52 : HX, HY, 1.35);
    for (const key of Object.keys(mk.ex)) M.drawEx(g, c, key);
    M.drawUI(g, c);
  },
});

function star(c, x, y, r) { c.beginPath(); for (let j = 0; j < 10; j++) { const rr = j % 2 ? r * 0.45 : r, a = j * Math.PI / 5 - Math.PI / 2; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); }
// a glowing comet arrow from the origin to the tip, with a sparkling tail
function comet(c, x0, y0, x1, y1, t) {
  const an = Math.atan2(y1 - y0, x1 - x0); c.save();
  const gr = c.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, 'rgba(255,200,240,0.3)'); gr.addColorStop(1, '#fff4c0');
  c.strokeStyle = gr; c.shadowColor = '#ffd8a0'; c.shadowBlur = 16; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 - Math.cos(an) * 10, y1 - Math.sin(an) * 10); c.stroke();
  c.fillStyle = '#fff4c0'; c.beginPath(); c.moveTo(x1 + Math.cos(an) * 4, y1 + Math.sin(an) * 4); c.lineTo(x1 + Math.cos(an + 2.6) * 18, y1 + Math.sin(an + 2.6) * 18); c.lineTo(x1 + Math.cos(an - 2.6) * 18, y1 + Math.sin(an - 2.6) * 18); c.closePath(); c.fill();
  c.fillStyle = '#ffffff'; for (let i = 0; i < 6; i++) { const k = ((t * 0.7 + i / 6) % 1), x = M.lerp(x0, x1, k), y = M.lerp(y0, y1, k) + Math.sin(t * 6 + i) * 3; c.globalAlpha = Math.sin(k * Math.PI) * 0.8; c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); }
  c.restore();
}
function paintBg(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, '#1a1448'); sk.addColorStop(0.35, '#4a2a78'); sk.addColorStop(0.62, '#b0507a'); sk.addColorStop(0.8, '#f08a6a'); sk.addColorStop(1, '#ffc88a'); c.fillStyle = sk; c.fillRect(0, 0, W, H);
  P.stars(c, W, 330, 60, 21, 0);
  // the hill
  c.fillStyle = '#2a1a40'; c.beginPath(); c.moveTo(0, 590); c.quadraticCurveTo(140, 540, 360, 572); c.lineTo(360, H); c.lineTo(0, H); c.fill();
  c.fillStyle = '#1c1030'; c.beginPath(); c.moveTo(0, 616); c.quadraticCurveTo(200, 590, 360, 612); c.lineTo(360, H); c.lineTo(0, H); c.fill();
}
function twinkle(c, t) { for (let i = 0; i < 10; i++) { const x = (i * 97) % 340 + 10, y = (i * 61) % 170 + 8, a = 0.4 + 0.6 * Math.max(0, Math.sin(t * 2 + i * 1.9)); c.save(); c.globalAlpha = a; c.fillStyle = '#fffbe0'; star(c, x, y, 2.5 + a); c.restore(); } }
