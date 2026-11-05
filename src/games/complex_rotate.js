// complex_rotate.js — QUARTER TURN! Multiplying by i turns a point on the complex plane 90° counterclockwise:
// i(a + bi) = −b + ai. A physical microgame on a frozen pond: the point a + bi sits on the ice grid, with dashed lines
// to the axes. The player grabs the point and swings it around the origin; it clicks into place at every quarter turn.
// Released at a quarter turn counterclockwise, the turn counts: the point stays there and the sign above works the
// algebra (see work() below): i(3 + 2i) = 3i + 2i² = 3i − 2 = −2 + 3i. Turning the wrong way, or not far enough, springs back (a wrong way turn is a wrong move).
// Level 0: a point in the first quadrant, times i. Level 1: any quadrant, times i. Level 2: times i² (two quarter turns,
// one at a time or one half turn at once). Medium mode: after the point clicks into place, the player picks its name.
// The kit's moves are for taps and drags of tokens, so this file runs the swing itself (like calc_tangent.js) and uses
// MK.play with a placeholder move until the turns are done, so the kit awards the stars and the win.
const M = MK, INK = SCN.ink('sign'), OX = 180, OY = 436, U = 24, TOL = [0.38, 0.3, 0.26];
const PCOL = '#ff5a7a';
function cterm(v, kind, first) { const A = Math.abs(v), sg = first ? (v < 0 ? M.op('-') : null) : M.op(v < 0 ? '-' : '+'); return kind ? [sg, A === 1 ? null : M.num(A), M.vr('i')] : [sg, M.num(A)]; }
const cnum = (a, b) => M.row(...cterm(a, 0, true), ...cterm(b, 1, false));
const turn = ([a, b], n) => { for (let k = 0; k < n; k++) [a, b] = [-b, a]; return [a, b]; };
const pos = ([a, b], rot) => { const r = Math.hypot(a, b) * U, t = Math.atan2(b, a) + rot; return { x: OX + Math.cos(t) * r, y: OY - Math.sin(t) * r }; };
// The sign shows the algebra of each turn, acted out with the same node objects so symbols glide (show your work).
// S.nd is the current a + bi as nodes: leading sign (or null), |a|, the sign of b, |b| (left out when it is 1), i.
const sgn = v => M.op(v < 0 ? '-' : '+');
function zNodes(a, b) { return { sR: a < 0 ? M.op('-') : null, nR: M.num(Math.abs(a)), sI: sgn(b), nI: M.num(Math.abs(b)), iI: M.vr('i'), a, b }; }
const zRow = d => M.row(d.sR, d.nR, d.sI, Math.abs(d.b) === 1 ? null : d.nI, d.iI);
function show(g, items, o = {}) { const r = M.row(...items); r._born = -1; if (o.id) r.id = o.id; M.place(g, 'ex', r, 180, 268, o.s || 42, { col: INK }); }
function build(g) {
  const S = g.s, d = S.nd;
  if (S.left > 0) { const z = Object.assign(zRow(d), { id: 'z' }); S.zp = M.paren(z, 'zp'); show(g, [S.fac, S.zp], { s: 44 }); }
  else show(g, [zRow(d)], { id: 'res', s: 44 });
}
const NOTE = '#ffe9a0';
// The working of one turn on the sign, acted out. A quarter turn: i(3 + 2i) → the i flies into each term: 3i + 2i²
// → "i² = −1" writes itself above i², and −1 flies into its place: 3i + 2(−1) → "2 · (−1) = −2" writes itself and the
// sign in front of the 2 flips: 3i − 2 → the parts swap places: −2 + 3i. A half turn at once: "i² = −1" writes itself
// over i² and −1 takes its place, giving (−1)(3 + 2i), then both signs flip: −3 − 2i. Each note stays up about 0.8 s.
// In medium mode the tray opens once the i has been multiplied in, and the rest plays after the right tile.
const NS = 30; // working notes: 30 px on a dark pill
const pill = (g, node, at, o = {}) => M.note(g, { node, at, off: [0, -58], s: NS, col: NOTE, pill: true, write: 0.3 * M.pace(g), hold: 0.8, fade: 0.25 * M.pace(g), ...o });
function work(g, n, ask) {
  const S = g.s, K = S.mk, T = M.pace(g), d = S.nd, { a, b } = d, outer = S.left > 0 && n === 1 ? S.fi : null; S.hideLab = true; S.point = true;
  const face = e => { S.face = e; S.faceT = g.t; K.lastMove = g.t; };
  const wrap = items => outer ? [outer, M.paren(M.row(...items))] : items;
  const isq = () => M.row(M.sup(M.vr('i'), M.num(2)), M.op('='), M.num(-1));
  const fin = (g, nd) => { S.nd = nd; S.fac = S.fi; S.fi.id = 'fac'; build(g); M.sparkle(g, S.left > 0 ? 'z' : 'res', { n: 12, cols: ['#fff', '#bfe8ff', NOTE] }); g.sfx('coin'); face('laugh');
    S.hideLab = false; S.point = false; };
  const go = (g, at, rest) => { if (!ask) { M.at(g, [[at, g => S.restFn(g)]]); return; }
    M.at(g, [[at, g => { const [x, y] = S.z, [x0, y0] = turn(S.z, 4 - n); S.answered = false; K.busyT = 1e9;
      M.openAsk(g, { ask: { v: cnum(x, y), wrong: [cnum(-x, -y), cnum(y0 === 0 ? 1 : y0, x0), cnum(x0, y0)] }, after: rest, resolve(g) { S.answered = true; S.restFn(g); } }); }]]); };
  // a −1 lifts off the note above `at` and lands where `at` is; then() swaps it into the expression
  const dropNeg = (g, at, then) => { const b0 = { ...M.box(g, at) }, w = M.lay(isq(), NS).w, wn = M.lay(M.num(-1), NS).w;
    M.fly(g, { node: M.num(-1, null, { col: NOTE }), from: [b0.x + w / 2 - wn / 2, b0.y - 58], to: [b0.x, b0.y], dur: 0.4 * T, arc: 20, s0: NS, s1: 40, then }); };
  for (const id of ['two', 'sq', 'act', 'ia', 'pn', 'neg']) { const q = M.node(g, id); if (q) q.id = undefined; } // ids from the last turn are reused below
  if (n === 2) { // a half turn: i² = −1, then −1 flips both signs
    const neg = M.num(-1, 'neg', { alpha: 0, _born: -1 }), pn = M.paren(neg, 'pn', { _born: -1 }), nd = { sR: a > 0 ? M.op('-') : null, nR: d.nR, sI: d.sI, nI: d.nI, iI: d.iI, a: -a, b: -b };
    M.show(g, 2.25 * T); M.circle(g, 'fac', { dur: 0.45 * T, col: NOTE }); M.light(g, S.fac, { col: NOTE }); face('think');
    pill(g, isq(), 'fac', { delay: 0.1 * T });
    M.at(g, [[0.1 * T + 0.3 * T + 0.8, g => dropNeg(g, 'fac', g => { show(g, [pn, M.paren(zRow(d))]); neg.alpha = 1; neg.pop = g.t; M.sparkle(g, 'neg', { n: 8, cols: ['#fff', NOTE] }); g.sfx('pop'); face('wow'); })]]);
    S.restFn = g => { M.show(g, 1.2 * T); M.indicate(g, neg, { dur: 0.4 * T, col: NOTE });
      // the (−1) fades out, and at the same moment both signs of the number flip (no line shows the −1 and the flipped signs together)
      M.at(g, [[0.4 * T, g => { for (const q of [neg, pn]) M.tween(g, q, { alpha: 0 }, 0.15 * T); }],
        [0.57 * T, g => { d.sI.v = b > 0 ? '−' : '+'; fin(g, nd); for (const q of [nd.sR, d.sI]) if (q) { q.pop = g.t; M.indicate(g, q, { dur: 0.45 * T, sc: 1.45, col: NOTE }); } g.sfx('tap'); }]]); };
    go(g, 2.25 * T, 1.2 * T); return;
  }
  // a quarter turn. With i² still outside, it splits into i · i: one i does this turn, the other waits outside.
  const act = S.left > 0 ? M.vr('i', 'act') : S.fi, i1 = M.vr('i', 'ia', { alpha: 0 }), two = M.num(2, 'two', { alpha: 0 }), sq = M.sup(d.iI, two, 'sq');
  const neg = M.num(-1, 'neg', { alpha: 0, _born: -1 }), pn = M.paren(neg, 'pn', { _born: -1 }), nR = Math.abs(a) === 1 ? null : d.nR, nI = Math.abs(b) === 1 ? null : d.nI;
  if (S.left > 0) show(g, [outer, M.paren(M.row(act, M.paren(zRow(d))))]); else { act.id = 'act'; M.relayout(g, 'ex'); }
  M.show(g, 1.2 * T); M.circle(g, 'act', { dur: 0.45 * T, col: NOTE }); M.light(g, act, { col: NOTE }); face('think');
  M.at(g, [[0.4 * T, g => { const from = { ...M.box(g, 'act') }; M.tween(g, act, { alpha: 0 }, 0.12 * T);
    show(g, wrap([d.sR, nR, i1, d.sI, nI, sq])); g.sfx('swoosh');
    // the i flies into each term: next to 3 it makes 3i, next to 2i it makes 2i²
    M.fly(g, { node: M.vr('i', null, { col: NOTE }), from: [from.x, from.y], to: 'ia', dur: 0.45 * T, arc: -36, s0: 44, s1: 44 });
    M.fly(g, { node: M.vr('i', null, { col: NOTE }), from: [from.x, from.y], to: 'two', dur: 0.55 * T, arc: -56, s0: 44, s1: 27,
      then(g) { i1.alpha = 1; two.alpha = 1; two.pop = g.t; i1.pop = g.t; g.sfx('pop'); face('wow'); } }); }]]);
  const nd = { sR: b > 0 ? d.sI : null, nR: d.nI, sI: a < 0 ? d.sR : b < 0 ? d.sI : M.op('+'), nI: d.nR, iI: i1, a: -b, b: a };
  const t1 = 0.3 * T + 0.8, t2 = t1 + 0.4 * T + 0.15 * T, t3 = t2 + 0.3 * T + 0.8;
  S.restFn = g => { M.show(g, t3 + 1.05 * T);
    // i² = −1: the note writes itself above i², then its −1 flies into the place of i²
    M.indicate(g, sq, { dur: 0.4 * T, sc: 1.2, col: NOTE }); pill(g, isq(), 'sq');
    M.at(g, [[t1, g => dropNeg(g, 'sq', g => { show(g, wrap([d.sR, nR, i1, d.sI, nI, pn])); neg.alpha = 1; neg.pop = g.t; M.sparkle(g, 'neg', { n: 8, cols: ['#fff', NOTE] }); g.sfx('pop'); face('wow'); })],
      // b · (−1) = −b: the sign in front of b flips
      [t2, g => { M.circle(g, [d.sI, nI || pn, pn], { dur: 0.45 * T, col: NOTE }); pill(g, M.row(M.num(b), M.op('·'), M.paren(M.num(-1)), M.op('='), M.num(-b)), 'pn'); face('think'); }],
      // "+ 2(−1)": the sign and the (−1) fade out together, then "− 2" comes in, so no wrong in-between line shows
      [t3, g => { for (const q of [d.sI, neg, pn]) M.tween(g, q, { alpha: 0 }, 0.12 * T); }],
      [t3 + 0.2 * T, g => { d.sI.v = b > 0 ? '−' : '+'; M.tween(g, d.sI, { alpha: 1 }, 0.12 * T); d.sI.pop = g.t; d.nI.pop = g.t; show(g, wrap([d.sR, nR, i1, d.sI, d.nI])); M.indicate(g, d.sI, { dur: 0.4 * T, sc: 1.4, col: NOTE }); M.sparkle(g, d.nI, { n: 8, cols: ['#fff', NOTE] }); g.sfx('tap'); face('wow'); }],
      // the real part moves to the front
      [t3 + 0.75 * T, g => fin(g, nd)]]); };
  go(g, 1.2 * T, t3 + 1.05 * T);
}
MG.add({
  id: 'complex_rotate', stage: 'complex', cmd: 'QUARTER TURN!', hint: 'drag', time: 8, mood: 'bright', winText: 'Turned!', hold: 1.4,
  card: {
    title: 'Multiplying by i', ref: 'Algebra 2', kind: 'Complex numbers',
    text: 'Every complex number a + bi is a point on the complex plane: go a steps across and b steps up. The across line is the real axis, and the up-and-down line is the imaginary axis.\n\nMultiplying by i turns the point a quarter turn (90°) counterclockwise around 0. Here is the algebra, using i² = −1: i(a + bi) = ai + bi² = −b + ai. The two parts swap places, and the new real part gets a minus sign.\n\nFor example, i(3 + 2i) = 3i + 2i² = −2 + 3i. The point 3 across and 2 up turns to 2 back and 3 up.\n\nMultiplying by i² is two quarter turns, a half turn. That matches i² = −1: multiplying by −1 points the other way.',
    note: 'i(a + bi) = −b + ai. Multiplying by i turns a point 90° counterclockwise around 0.',
    ask: 'What is i(4 + i)? What is i(−2 + 5i)?',
  },

  init(g) {
    const S = g.s, r = k => Math.floor(g.rand() * k), L = g.level; M.setup(g);
    let a = 1 + r(4), b = 1 + r(3); if (a === b) a = a % 4 + 1;
    if (L >= 1) { if (g.rand() < 0.5) a = -a; if (g.rand() < 0.5) b = -b; }
    S.z = [a, b]; S.z0 = [a, b]; S.left = L === 2 ? 2 : 1; S.rot = 0; S.drag = null; S.trail = []; S.answered = true;
    S.nd = zNodes(a, b); S.fi = M.vr('i', 'fac'); S.fac = S.left === 2 ? M.sup(S.fi, M.num(2), 'fac') : S.fi;
    build(g);
    M.inert(g, ['turn', 'zp']);
    g.dur *= (2.6 + 1.05 * 2 * S.left) / 8;
    const sync = () => { const p = pos(S.z, S.rot), q = pos(S.z, Math.PI / 2); M.zone(g, 'pt', { x: p.x, y: p.y, w: 34, h: 34 }); M.zone(g, 'turn', { x: q.x, y: q.y, w: 30, h: 30 }); };
    S.sync = sync; sync();
    M.play(g, {
      moves(g) { return S.left > 0 || !S.answered ? [{ drag: 'pt', to: 'turn' }] : []; },
      area() { return 'pt'; },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    if (S.springAt != null) { const k = (g.t - S.springAt) / 0.2; S.rot = S.springFrom * (1 - M.ease(k)); if (k >= 1) { S.springAt = null; S.rot = 0; } }
    S.sync();
  },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask && !K.ask.closing) { M.down(g, x, y); return; }
    const p = pos(S.z, S.rot);
    if (S.left > 0 && K.busyT <= 0 && Math.hypot(x - p.x, y - p.y) < 38) { S.springAt = null; S.drag = { last: Math.atan2(y - OY, x - OX), moved: false }; K.lastMove = g.t; g.sfx('tap'); return; }
    M.down(g, x, y);
  },
  move(g, x, y) {
    const S = g.s, D = S.drag; if (!D) { M.move(g, x, y); return; } if (g.done) return;
    if (Math.hypot(x - OX, y - OY) < 10) return;
    const a = Math.atan2(y - OY, x - OX); let d = a - D.last; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; D.last = a;
    const raw = M.clamp((D.raw ?? S.rot) - d, -Math.PI / 2 - 0.4, S.left * Math.PI / 2 + 0.4); D.raw = raw; D.moved = true;
    // the point clicks into each quarter turn as it passes
    const q = Math.round(raw / (Math.PI / 2)) * Math.PI / 2, near = Math.abs(raw - q) < 0.13;
    if (near && D.clickQ !== q) { D.clickQ = q; if (q) g.sfx('tap'); } else if (!near) D.clickQ = null;
    S.rot = near ? q : raw;
  },
  up(g, x, y) {
    const S = g.s, K = S.mk, D = S.drag; if (!D) { M.up(g, x, y); return; } S.drag = null; if (g.done || !D.moved) return;
    const tol = TOL[g.level], n = [1, 2].find(k => k <= S.left && Math.abs(S.rot - k * Math.PI / 2) < tol);
    if (n) {
      const from = S.z; S.z = turn(S.z, n); S.left -= n; S.rot = 0; S.trail.push({ from, n, at: g.t }); K.lastMove = g.t;
      g.sfx('ding'); const p = pos(S.z, 0); g.burst(p.x, p.y, ['#ffffff', '#bfe8ff', PCOL], 12, 130);
      work(g, n, g.mode === 'medium' && S.left === 0);
      return;
    }
    if (Math.abs(S.rot) > 0.6 || (S.rot > 0 && Math.abs(S.rot) > tol)) { K.wrong = (K.wrong || 0) + 1; K.missAt = g.t; K.missInfo = { drag: 'pt', to: 'plane' }; }
    S.springAt = g.t; S.springFrom = S.rot; g.sfx('boing');
  },
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { if (!K.ask.closing) M.auto(g, dt, synth); return; }
    if (S.bot) {
      const b = S.bot, k = M.clamp((g.t - b.t0) / 0.5, 0, 1), p = pos(S.z, M.lerp(0, Math.PI / 2 + 0.04, M.easeIO(k)));
      synth('move', p.x, p.y); if (k >= 1) { synth('up', p.x, p.y); S.bot = null; S.botNext = g.t + 0.3; } return;
    }
    if (S.left <= 0 || K.busyT > 0 || g.t < (S.botNext ?? 0.4) || S.springAt != null) return;
    const p = pos(S.z, S.rot); synth('down', p.x, p.y); S.bot = { t0: g.t };
  },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.std(g, c, { scene: 'snow', panel: 'sign', panelY: 260, panelH: 92, panelW: 300 });
    // the frozen pond with its grid
    c.save();
    const ice = c.createLinearGradient(0, OY - 110, 0, OY + 110); ice.addColorStop(0, 'rgba(150,200,240,0.9)'); ice.addColorStop(1, 'rgba(110,170,225,0.9)');
    c.fillStyle = 'rgba(40,70,120,0.25)'; c.beginPath(); c.ellipse(OX + 4, OY + 8, 160, 118, 0, 0, 7); c.fill();
    c.fillStyle = ice; c.beginPath(); c.ellipse(OX, OY, 160, 116, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 3; c.stroke();
    c.save(); c.clip();
    c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 1;
    for (let k = -6; k <= 6; k++) { c.beginPath(); c.moveTo(OX + k * U, OY - 130); c.lineTo(OX + k * U, OY + 130); c.moveTo(OX - 170, OY + k * U); c.lineTo(OX + 170, OY + k * U); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,0.25)'; for (let k = 0; k < 5; k++) { c.beginPath(); c.ellipse(OX - 90 + k * 50, OY - 60 + (k % 2) * 90, 26, 4, -0.4, 0, 7); c.fill(); }
    c.restore();
    c.strokeStyle = '#2a4a7a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(OX - 150, OY); c.lineTo(OX + 150, OY); c.moveTo(OX, OY + 110); c.lineTo(OX, OY - 110); c.stroke();
    c.fillStyle = '#1e3a66'; c.font = M.NUMF(18, 700); c.textAlign = 'center'; c.textBaseline = 'middle';
    for (const k of [-4, -2, 2, 4]) { c.fillText(String(k).replace('-', '−'), OX + k * U, OY + 14); c.textAlign = 'right'; c.fillText((k > 0 ? '' : '−') + Math.abs(k) + 'i', OX - 5, OY - k * U); c.textAlign = 'center'; }
    // finished turns leave a ghost and an arc marked 90°
    for (const tr of S.trail) for (let k = 0; k < tr.n; k++) {
      const z = turn(tr.from, k), r = Math.hypot(...z) * U, a0 = Math.atan2(z[1], z[0]), e = M.ease((t - tr.at) / 0.3), gp = pos(z, 0);
      c.fillStyle = 'rgba(255,255,255,0.55)'; c.beginPath(); c.arc(gp.x, gp.y, 6, 0, 7); c.fill();
      c.strokeStyle = 'rgba(255,240,170,0.95)'; c.lineWidth = 3; c.setLineDash([6, 5]); c.beginPath(); c.arc(OX, OY, r, -a0, -a0 - e * Math.PI / 2, true); c.stroke(); c.setLineDash([]);
      const bis = a0 + Math.PI / 4, cs = Math.cos(bis), sn = Math.sin(bis); let lx = OX + cs * r * 0.55, ly = OY - sn * r * 0.55; // keep "90°" off the axis labels
      if (Math.abs(sn) < 0.35) ly = OY + (sn >= 0 ? -18 : 18) * 1.4; if (Math.abs(cs) < 0.35) lx = OX + (cs >= 0 ? 1 : -1) * 34;
      c.fillStyle = 'rgba(255,255,255,0.75)'; c.beginPath(); c.roundRect(lx - 21, ly - 12, 42, 24, 8); c.fill(); c.fillStyle = '#6a3a08'; c.font = M.NUMF(18, 700); c.fillText('90°', lx, ly + 1);
    }
    // the swing in progress: the arc it has turned so far
    const p = pos(S.z, S.rot), r0 = Math.hypot(...S.z) * U, a0 = Math.atan2(S.z[1], S.z[0]);
    if (Math.abs(S.rot) > 0.02) { c.strokeStyle = 'rgba(255,90,122,0.8)'; c.lineWidth = 3; c.beginPath(); c.arc(OX, OY, r0, -a0, -a0 - S.rot, S.rot > 0); c.stroke(); }
    // dashed lines to the axes show the real and imaginary parts
    if (!S.drag && S.springAt == null) { c.strokeStyle = 'rgba(200,40,80,0.7)'; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x, OY); c.moveTo(p.x, p.y); c.lineTo(OX, p.y); c.stroke(); c.setLineDash([]); }
    c.strokeStyle = 'rgba(42,74,122,0.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(OX, OY); c.lineTo(p.x, p.y); c.stroke();
    const miss = K.missAt > 0 && t - K.missAt < 0.5, wob = miss ? Math.sin((t - K.missAt) * 50) * 4 : 0, gl = 0.5 + 0.5 * Math.sin(t * 5);
    c.fillStyle = `rgba(255,120,150,${0.25 + gl * 0.2})`; c.beginPath(); c.arc(p.x + wob, p.y, 16, 0, 7); c.fill();
    c.fillStyle = miss ? M.BAD : PCOL; c.strokeStyle = '#fff'; c.lineWidth = 3; c.beginPath(); c.arc(p.x + wob, p.y, 9, 0, 7); c.fill(); c.stroke();
    if (!S.drag && !S.hideLab && S.springAt == null) {
      const lab = cnum(...S.z), m = M.lay(lab, 23), side = p.x >= OX ? 1 : -1, lx = p.x + side * 16 + (side < 0 ? -m.w : 0), ly = p.y + (p.y < OY ? -12 : 26);
      c.fillStyle = 'rgba(255,255,255,0.85)'; c.beginPath(); c.roundRect(lx - 6, ly - 22, m.w + 12, 29, 9); c.fill();
      M.draw(c, lab, lx, ly, 23, { t, col: '#8a1a3a' });
    }
    c.restore();
    // the penguin points at the sign while the work is shown, and hops when a step lands
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'penguin', 306, 606 - hopK * 22, 1.2, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'penguin', 306, 606, 1.2);
    M.drawEx(g, c, 'ex');
    M.drawUI(g, c);
  },
});
