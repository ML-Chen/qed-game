// complex_rotate.js — QUARTER TURN! Multiplying by i turns a point on the complex plane 90° counterclockwise:
// i(a + bi) = −b + ai. A physical microgame on a frozen pond: the point a + bi sits on the ice grid, with dashed lines
// to the axes. The player grabs the point and swings it around the origin; it clicks into place at every quarter turn.
// Released at a quarter turn counterclockwise, the turn counts: the point stays there and the sign above rewrites
// i(3 + 2i) as −2 + 3i. Turning the wrong way, or not far enough, springs back (a wrong way turn is a wrong move).
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
function build(g) {
  const S = g.s, fac = S.left === 2 ? M.sup(M.vr('i'), M.num(2)) : M.vr('i');
  const node = S.left > 0 ? M.row(Object.assign(fac, { id: 'fac' }), M.paren(Object.assign(cnum(...S.z), { id: 'z' }), 'zp')) : Object.assign(cnum(...S.z), { id: 'res', pop: g.t });
  M.place(g, 'ex', node, 180, 268, 44, { col: INK });
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
      g.sfx('ding'); g.sfx('sparkle'); const p = pos(S.z, 0); g.burst(p.x, p.y, ['#ffffff', '#bfe8ff', PCOL], 12, 130);
      if (g.mode === 'medium' && S.left === 0) {
        const [a, b] = S.z, [a0, b0] = from; S.answered = false; S.hideLab = true; K.busyT = 1e9;
        M.openAsk(g, { ask: { v: cnum(a, b), wrong: [cnum(-a, -b), cnum(b0 === 0 ? 1 : b0, a0), cnum(a0, b0)] }, after: 0.05, resolve(g) { S.answered = true; S.hideLab = false; build(g); } });
        M.place(g, 'ex', M.row(...(n === 2 && S.trail.length === 1 ? [M.sup(M.vr('i'), M.num(2))] : [M.vr('i')]), M.paren(cnum(...from)), M.op('='), M.txt('?')), 180, 268, 40, { col: INK });
      } else build(g);
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
    if (S.left <= 0 || g.t < (S.botNext ?? 0.4) || S.springAt != null) return;
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
    c.fillStyle = '#2a4a7a'; c.font = M.NUMF(13, 700); c.textAlign = 'center'; c.textBaseline = 'middle';
    for (const k of [-4, -2, 2, 4]) { c.fillText(String(k).replace('-', '−'), OX + k * U, OY + 12); c.fillText((k > 0 ? '' : '−') + Math.abs(k) + 'i', OX - 14, OY - k * U); }
    // finished turns leave a ghost and an arc marked 90°
    for (const tr of S.trail) for (let k = 0; k < tr.n; k++) {
      const z = turn(tr.from, k), r = Math.hypot(...z) * U, a0 = Math.atan2(z[1], z[0]), e = M.ease((t - tr.at) / 0.3), gp = pos(z, 0);
      c.fillStyle = 'rgba(255,255,255,0.55)'; c.beginPath(); c.arc(gp.x, gp.y, 6, 0, 7); c.fill();
      c.strokeStyle = 'rgba(255,240,170,0.95)'; c.lineWidth = 3; c.setLineDash([6, 5]); c.beginPath(); c.arc(OX, OY, r, -a0, -a0 - e * Math.PI / 2, true); c.stroke(); c.setLineDash([]);
      c.fillStyle = '#7a4a10'; c.font = M.NUMF(12, 700); c.fillText('90°', OX + Math.cos(a0 + Math.PI / 4) * (r * 0.55), OY - Math.sin(a0 + Math.PI / 4) * (r * 0.55));
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
      const lab = cnum(...S.z), m = M.lay(lab, 20), side = p.x >= OX ? 1 : -1, lx = p.x + side * 16 + (side < 0 ? -m.w : 0), ly = p.y + (p.y < OY ? -12 : 26);
      c.fillStyle = 'rgba(255,255,255,0.85)'; c.beginPath(); c.roundRect(lx - 5, ly - 19, m.w + 10, 25, 8); c.fill();
      M.draw(c, lab, lx, ly, 20, { t, col: '#8a1a3a' });
    }
    c.restore();
    SCN.host(g, c, 'penguin', 306, 606, 1.2);
    M.drawEx(g, c, 'ex');
    M.drawUI(g, c);
  },
});
