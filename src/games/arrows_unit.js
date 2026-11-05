// arrows_unit.js — UNIT VECTOR! The unit vector in the direction of v is v ÷ |v|: divide each component by the length.
// The deck of a sailing ship at sunset. The problem is lettered in gold on the ship's nameboard: (a, b) ÷ |(a, b)|.
// On the deck below, the vector is an arrow from a brass compass ring of radius 1, with its two legs dashed beside it.
// A turtle is the deckhand.
// Moves (show your work: each plays its working by itself while the fuse stands still):
//   1. Tap |(a, b)| (or the arrow): it is circled, "√(a² + b²) = c" writes itself under it, tick marks pop one by one along
//      the arrow while a counter climbs to c, and the bars collapse into c.
//   2. (either order with 3) Drag c onto a (or onto the across leg): a copy of c flies under a, a fraction bar draws itself,
//      and the across leg shrinks to a/c of its length while "÷ c" writes itself beside it.
//   3. Drag c onto b (or the up leg): the same for b.
//   Once both are divided, "÷ c" fades, the picture zooms in on the compass ring, and the arrow is seen lying exactly on the
//   ring: its length is 1. Its legs read a/c and b/c.
// Level 0: (3, 4) or (4, 3). Level 1: (5, 12), (8, 15) and swaps. Level 2: the same with one or two negative components.
// Medium mode: the length c is picked from the tray.
const M = MK, INK = '#ffe7a8', XC = '#ff8a5c', YC = '#6ee0d0', AC = '#fff3d0', BRASS = '#e8b04a', NOTE = '#fff4dc', EQY = 220, HX = 300, HY = 610;
const PIC = { x0: 30, x1: 330, y0: 276, y1: 520 };
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), list = L === 0 ? [[3, 4]] : [[5, 12], [8, 15]];
  let [a, b] = list[r(list.length)]; if (r(2)) [a, b] = [b, a];
  if (L === 2) { const s = [[-1, 1], [1, -1], [-1, -1]][r(3)]; a *= s[0]; b *= s[1]; }
  return { a, b, c: Math.round(Math.hypot(a, b)) };
}
const sq = v => v < 0 ? M.paren(M.num(v)) : M.num(v); // a negative number is bracketed before it is squared
const kk = (g, a) => a ? M.clamp((g.t - a.t0) / a.dur, 0, 1) : 0;
function put(g, c, n, cx, cy, s, col, alpha = 1) { const m = M.lay(n, s); c.save(); c.globalAlpha *= alpha; M.draw(c, n, cx - m.w / 2, cy + (m.a - m.d) / 2, s, { t: g.t, col }); c.restore(); }
function tag(g, c, n, cx, cy, s, col, alpha = 1) { c.save(); c.shadowColor = 'rgba(40,16,10,0.95)'; c.shadowBlur = 5; put(g, c, n, cx, cy, s, col, alpha); put(g, c, n, cx, cy, s, col, alpha); c.restore(); }

MG.add({
  id: 'unit_vector', stage: 'arrows', cmd: 'UNIT VECTOR!', hint: 'drag', time: 9, winText: 'Length 1!', hold: 1.8,
  card: {
    title: 'Unit vectors', ref: 'Grade 11 and up', kind: 'Precalculus',
    text: 'A unit vector is an arrow of length exactly 1. It keeps only a direction, like a compass needle.\n\nTo get the unit vector that points the same way as a vector, divide the vector by its own length.\n\nFor example, (3, 4) has length √(3² + 4²) = √25 = 5. Divide each component by 5: (3, 4) ÷ 5 = (3/5, 4/5). The arrow keeps its direction but shrinks to one fifth of its length, so now it is exactly 1 long. Check: (3/5)² + (4/5)² = 9/25 + 16/25 = 1.',
    note: 'Divide the vector by its length: v ÷ |v|. The result points the same way and has length 1.',
    ask: 'What is the unit vector in the direction of (5, 12)? Of (0, −7)?',
  },

  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g), { a, b, c } = p;
    // the picture: the vector fits the deck before the zoom; after it the compass ring (radius 1) fills the deck
    const xs = [0, a], ys = [0, b], w = Math.abs(a), h = Math.abs(b);
    S.u0 = Math.min(44, (PIC.x1 - PIC.x0 - 40) / w, (PIC.y1 - PIC.y0 - 40) / h);
    S.o0 = [(PIC.x0 + PIC.x1) / 2 - (Math.min(...xs) + Math.max(...xs)) / 2 * S.u0, (PIC.y0 + PIC.y1) / 2 + (Math.min(...ys) + Math.max(...ys)) / 2 * S.u0];
    S.u1 = 100; S.o1 = [180, 398];
    S.view = () => { const z = M.easeIO(kk(g, S.zoom)); return { u: M.lerp(S.u0, S.u1, z), ox: M.lerp(S.o0[0], S.o1[0], z), oy: M.lerp(S.o0[1], S.o1[1], z), z }; };
    S.sh = { A: null, B: null }; // each leg's shrink animation
    S.f = key => { const q = S.sh[key]; return q ? M.lerp(1, 1 / c, M.easeIO(kk(g, q))) : 1; };
    // the expression: (a, b) ÷ |(a, b)|, built from reused nodes so symbols glide when it is rewritten
    S.va = M.num(a, 'va'); S.vb = M.num(b, 'vb'); S.cA = S.va; S.cB = S.vb;
    S.cm = M.op(',', 'cm'); S.dv = M.op('÷', 'dv');
    S.mag = M.row(M.txt('|', 'b1'), M.paren(M.row(M.num(a, 'ma'), M.op(','), M.gap(4), M.num(b, 'mb')), 'mv'), M.txt('|', 'b2')); S.mag.id = 'mag';
    S.right = S.mag; S.tail = true;
    S.relay = () => { S.vec = M.paren(M.row(S.cA, S.cm, M.gap(6), S.cB), 'vec'); M.place(g, 'eq', S.tail ? M.row(S.vec, S.dv, S.right) : S.vec, 180, EQY, S.fs, { col: INK }); };
    const wid = Math.max(M.lay(M.row(M.paren(M.row(M.num(a), M.op(','), M.gap(6), M.num(b))), M.op('÷'), M.txt('|'), M.paren(M.row(M.num(a), M.op(','), M.gap(4), M.num(b))), M.txt('|')), 40).w,
      M.lay(M.row(M.paren(M.row(M.frac(M.num(a), M.num(c)), M.op(','), M.gap(6), M.frac(M.num(b), M.num(c)))), M.op('÷'), M.num(c)), 40).w);
    S.fs = Math.min(40, 40 * 316 / wid);
    S.relay(); M.inert(g, ['cm', 'dv', 'vec', 'b1', 'b2', 'mv', 'dA', 'dB', 'nt', 'q']);
    S.face = 'happy'; S.faceT = -9; S.hopT = -9; S.point = false;
    const hop = (g, e) => { S.hopT = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    S.zones = () => { const V = S.view(), X = a * S.f('A'), Y = b * S.f('B');
      M.zone(g, 'arrow', { x: V.ox + X * V.u / 2, y: V.oy - Y * V.u / 2, w: Math.max(56, Math.abs(X * V.u) * 0.5), h: Math.max(56, Math.abs(Y * V.u) * 0.5) });
      if (S.mag !== S.right) { M.zone(g, 'legA', { x: V.ox + X * V.u / 2, y: V.oy + 12, w: Math.max(40, Math.abs(X * V.u)), h: 40 }); M.zone(g, 'legB', { x: V.ox + X * V.u + (X >= 0 ? 14 : -14), y: V.oy - Y * V.u / 2, w: 40, h: Math.max(40, Math.abs(Y * V.u)) }); } };
    S.zones();
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const noteAt = (g, node, x) => { node.id = 'nt'; M.place(g, 'note', node, M.clamp(x, 100, 260), EQY + 52, 26, { col: NOTE }); M.writeIn(g, node, { dur: 0.4 * T, delay: 0.08 * T }); };
    const noteOff = (g, d) => { const e = g.s.mk.ex.note; if (!e) return; M.tween(g, e.node, { alpha: 0 }, 0.3 * T, { delay: d });
      M.at(g, [[d + 0.35 * T, g => { if (g.s.mk.ex.note && g.s.mk.ex.note.node === e.node) { delete g.s.mk.ex.note; if (g.s.mk.prevNodes) delete g.s.mk.prevNodes.note; } }]]); };
    // dividing one component by the length: c flies under it, the bar draws, and its leg shrinks to 1/c of its length
    const divide = key => { const A = key === 'A', col = A ? XC : YC;
      return { drag: 'cN', to: [A ? 'va' : 'vb', 'leg' + key], busy: 0.1,
        then(g) { S['did' + key] = true; const fb = { ...M.box(g, 'cN') }; M.show(g, 1.15 * T); S.point = true; hop(g, 'think');
          const n = A ? S.va : S.vb, den = M.num(c, 'd' + key, { alpha: 0, col: BRASS });
          const fr = M.frac(n, den, 'f' + key, { bar: { t0: g.t + 0.1 * T, dur: 0.3 * T } }); if (A) S.cA = fr; else S.cB = fr; S.relay(); g.sfx('swoosh');
          M.fly(g, { node: M.num(c), from: [fb.x, fb.y], to: 'd' + key, dur: 0.45 * T, arc: -50, s0: S.fs, s1: S.fs * 0.82, col: BRASS,
            then(g) { den.alpha = 1; den.pop = g.t; M.sparkle(g, 'd' + key, { n: 8 }); g.sfx('pop'); } });
          M.at(g, [[0.45 * T, g => { S.sh[key] = { t0: g.t, dur: 0.6 * T }; S.legNote = { key, t0: g.t }; g.sfx('sweep'); hop(g); M.light(g, 'f' + key, { col }); }],
            [1.05 * T, g => { M.unlight(g, 'f' + key); M.sparkle(g, 'arrow', { n: 8, cols: [col, '#fff'] }); g.sfx('ding'); S.zones(); }]]);
          if (S.didA && S.didB) { // both divided: ÷ c leaves, the deck zooms in on the compass ring, and the arrow lies on it
            M.show(g, 2.45 * T);
            M.at(g, [[1.1 * T, g => { M.tween(g, S.dv, { alpha: 0, sc: 0.6 }, 0.3 * T); M.tween(g, S.right, { alpha: 0, sc: 0.6 }, 0.3 * T); }],
              [1.45 * T, g => { S.dv.alpha = 0; S.cN.alpha = 0; S.tail = false; S.relay(); S.zoom = { t0: g.t, dur: 0.6 * T }; g.sfx('whoosh'); }],
              [2.05 * T, g => { S.ringT = g.t; S.point = false; g.sfx('chime'); hop(g, 'laugh'); const V = S.view(); g.burst(V.ox + a / c * V.u, V.oy - b / c * V.u, [BRASS, '#fff', AC], 16, 150); }]]);
          } } }; };
    M.play(g, {
      moves(g) {
        const out = [];
        // 1. the length of the vector
        if (S.right === S.mag) out.push({ tap: ['mag', 'ma', 'mb', 'arrow'], busy: 0.1, askAt: 0.55 * T, after: 1.45 * T, ask: { v: c, wrong: [c * c, Math.abs(a) + Math.abs(b), c + 1] },
          then(g) { S.lenDone = true; M.show(g, 0.55 * T); S.point = true; hop(g, 'think');
            M.circle(g, 'mag', { dur: 0.5 * T, col: BRASS }); S.q = M.num(c, 'q', { alpha: 0 });
            const bx = M.box(g, 'mag'); noteAt(g, M.row(M.txt('√'), M.paren(M.row(M.sup(sq(a), M.num(2)), M.op('+'), M.sup(sq(b), M.num(2)))), M.op('='), S.q), bx ? bx.x : 220); },
          resolve(g) { M.show(g, 1.45 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); M.indicate(g, S.q, { delay: 0.12 * T, dur: 0.3 * T }); g.sfx('ding');
            S.ticks = { t0: g.t + 0.2 * T, dur: 0.75 * T }; const n = Math.min(c, 9); for (let i = 1; i <= n; i++) M.at(g, [[0.2 * T + 0.75 * T * i / n, g => g.sfx('tap')]]);
            noteOff(g, 0.9 * T);
            M.at(g, [[1.0 * T, g => { // the bars collapse into c
                for (const q of S.mag.items) M.tween(g, q, { alpha: 0, sc: 0.5 }, 0.25 * T); S.cN = M.num(c, 'cN', { col: BRASS, alpha: 0 });
                M.fly(g, { node: M.num(c), from: 'q', to: 'mag', dur: 0.3 * T, arc: 20, s0: 26, s1: S.fs, col: BRASS }); }],
              [1.3 * T, g => { (function hide(n) { if (!n) return; n.alpha = 0; for (const ch of [n.inner, ...(n.items || [])]) hide(ch); })(S.mag); S.cN.alpha = 1; S.cN.pop = g.t; S.right = S.cN; S.relay(); S.zones(); M.sparkle(g, 'cN', { n: 10 }); g.sfx('pop'); hop(g); S.point = false; }]]); } });
        else { if (!S.didA) out.push(divide('A')); if (!S.didB) out.push(divide('B')); }
        return out;
      },
      area(g) { return S.right === S.mag ? ['mag'] : ['cN']; },
    });
  },
  update(g, dt) { M.update(g, dt); g.s.zones(); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, p = S.p, { a, b } = p, V = S.view(), u = V.u, ox = V.ox, oy = V.oy;
    c.drawImage(g.bake('uv_bg', (cc, W, H) => paintBg(cc, W, H)), 0, 0, 360, 640);
    ambient(c, t);
    c.save(); c.beginPath(); c.rect(PIC.x0 - 10, PIC.y0 - 8, PIC.x1 - PIC.x0 + 20, PIC.y1 - PIC.y0 + 16); c.clip();
    // a chalk grid on the deck, one square per unit (it opens up as the deck zooms in)
    c.strokeStyle = 'rgba(255,240,210,0.22)'; c.lineWidth = 1;
    for (let i = Math.floor((PIC.x0 - 20 - ox) / u); i <= Math.ceil((PIC.x1 + 20 - ox) / u); i++) { c.lineWidth = i ? 1 : 2; c.beginPath(); c.moveTo(ox + i * u, PIC.y0 - 10); c.lineTo(ox + i * u, PIC.y1 + 10); c.stroke(); }
    for (let j = Math.floor((oy - PIC.y1 - 20) / u); j <= Math.ceil((oy - PIC.y0 + 20) / u); j++) { c.lineWidth = j ? 1 : 2; c.beginPath(); c.moveTo(PIC.x0 - 10, oy - j * u); c.lineTo(PIC.x1 + 10, oy - j * u); c.stroke(); }
    // the brass compass ring: radius exactly 1
    const rg = S.ringT != null ? Math.max(0, 1 - (t - S.ringT) / 0.9) : 0;
    c.save(); c.strokeStyle = BRASS; c.lineWidth = 3 + rg * 3; c.shadowColor = '#ffe08a'; c.shadowBlur = 6 + rg * 18; c.beginPath(); c.arc(ox, oy, u, 0, 7); c.stroke();
    for (let i = 0; i < 16; i++) { const an = i * Math.PI / 8, r0 = u * (i % 4 ? 0.92 : 0.84); c.lineWidth = i % 4 ? 1.2 : 2; c.beginPath(); c.moveTo(ox + Math.cos(an) * r0, oy + Math.sin(an) * r0); c.lineTo(ox + Math.cos(an) * u, oy + Math.sin(an) * u); c.stroke(); } c.restore();
    if (u > 50) { const al = M.clamp((u - 50) / 40, 0, 1); for (const [lb, dx, dy] of [['N', 0, -1], ['E', 1, 0], ['S', 0, 1], ['W', -1, 0]]) tag(g, c, M.txt(lb), ox + dx * (u - 18), oy + dy * (u - 18), 13, BRASS, al * 0.8); }
    // legs: across, then up; each glows while it shrinks
    const fa = S.f('A'), fb = S.f('B'), X = a * fa, Y = b * fb, ex = ox + X * u, ey = oy - Y * u;
    const glow = key => { const q = S.sh[key]; return q && t < q.t0 + q.dur + 0.25 ? 1 : 0; };
    const leg = (x0, y0, x1, y1, col, gk) => { c.save(); c.lineCap = 'round'; c.strokeStyle = col; c.lineWidth = 3.5 + gk * 2; if (gk) { c.shadowColor = col; c.shadowBlur = 14; } c.setLineDash([7, 5]); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.restore(); };
    leg(ox, oy, ex, oy, XC, glow('A')); leg(ex, oy, ex, ey, YC, glow('B'));
    // the arrow (the ghost of the full-length arrow stays faintly once it starts shrinking)
    const L = Math.hypot(ex - ox, ey - oy);
    if (S.sh.A || S.sh.B) { c.save(); c.globalAlpha = 0.25 * (1 - V.z); c.strokeStyle = AC; c.lineWidth = 3; c.setLineDash([4, 6]); c.beginPath(); c.moveTo(ox, oy); c.lineTo(ox + a * u, oy - b * u); c.stroke(); c.restore(); }
    if (L > 3) { const ux = (ex - ox) / L, uy = (ey - oy) / L, hw = Math.min(9, L * 0.25); c.save(); c.strokeStyle = AC; c.fillStyle = AC; c.lineWidth = 5; c.lineCap = 'round'; c.shadowColor = '#ffb060'; c.shadowBlur = 8 + rg * 14;
      c.beginPath(); c.moveTo(ox, oy); c.lineTo(ex - ux * hw, ey - uy * hw); c.stroke(); c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex - ux * hw * 1.9 - uy * hw, ey - uy * hw * 1.9 + ux * hw); c.lineTo(ex - ux * hw * 1.9 + uy * hw, ey - uy * hw * 1.9 - ux * hw); c.closePath(); c.fill(); c.restore();
      // tick marks counting the arrow's length, one per unit
      if (S.ticks && !S.sh.A && !S.sh.B) { const n = p.c; let last = 0;
        for (let i = 1; i <= n; i++) { const at = S.ticks.t0 + S.ticks.dur * i / n, k = M.clamp((t - at) / 0.16, 0, 1); if (k <= 0) continue; last = i;
          const px = ox + ux * L * i / n, py = oy + uy * L * i / n, r = 6 * (1 + Math.sin(k * Math.PI) * 0.6); c.save(); c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(px - uy * r, py + ux * r); c.lineTo(px + uy * r, py - ux * r); c.stroke(); c.restore(); }
        if (last) { const fade = M.clamp(1 - (t - S.ticks.t0 - S.ticks.dur - 0.5) / 0.3, 0, 1), px = ox + ux * L * last / n, py = oy + uy * L * last / n, pk = M.clamp((t - S.ticks.t0 - S.ticks.dur * last / n) / 0.16, 0, 1);
          tag(g, c, M.num(last), px - uy * 22, py + ux * 22, 20 * (1 + Math.sin(pk * Math.PI) * 0.3), '#fff', fade); } } }
    c.fillStyle = BRASS; c.beginPath(); c.arc(ox, oy, 4.5, 0, 7); c.fill();
    // leg labels: the component, then the component over c once that leg has shrunk
    const lab = (key, v, cx, cy, col) => { const q = S.sh[key], done = q && t > q.t0 + q.dur * 0.6; tag(g, c, done ? M.frac(M.num(v), M.num(p.c)) : M.num(v), cx, cy, done ? 22 : 18, col); };
    lab('A', a, (ox + ex) / 2, oy + (Y >= 0 ? 16 : -16) + (S.sh.A && t > S.sh.A.t0 + S.sh.A.dur * 0.6 ? (Y >= 0 ? 8 : -8) : 0), XC);
    lab('B', b, ex + (X >= 0 ? 20 : -20), (oy + ey) / 2, YC);
    // the "÷ c" note beside the leg that shrinks
    if (S.legNote) { const k = t - S.legNote.t0; if (k < 0.9) { const key = S.legNote.key, al = M.clamp(k / 0.15, 0, 1) * M.clamp((0.9 - k) / 0.2, 0, 1), col = key === 'A' ? XC : YC;
      const nx = key === 'A' ? (ox + ex) / 2 : ex + (X >= 0 ? 52 : -52), ny = key === 'A' ? oy + (Y >= 0 ? 40 : -40) : (oy + ey) / 2 - 26; tag(g, c, M.row(M.op('÷'), M.num(p.c)), nx, ny, 22, col, al); } }
    // the length 1 along the finished arrow
    if (S.ringT != null) { const k = M.clamp((t - S.ringT) / 0.3, 0, 1), mx = (ox + ex) / 2, my = (oy + ey) / 2, nx = -(ey - oy) / (L || 1), ny = (ex - ox) / (L || 1), sd = (a * b >= 0) ? 1 : -1;
      tag(g, c, M.num(1), mx - nx * 20 * sd, my - ny * 20 * sd, 24 * (1 + Math.sin(k * Math.PI) * 0.4), '#fff', k); }
    c.restore();
    M.drawEx(g, c, 'eq');
    const ne = S.mk.ex.note; if (ne) { const b0 = M.box(g, 'nt'), w = ne.node.write, wk = w ? M.easeIO(M.clamp((t - w.t0) / w.dur, 0, 1)) : 1;
      if (b0) { c.save(); c.globalAlpha *= (ne.node.alpha ?? 1) * Math.min(1, wk * 4); c.fillStyle = 'rgba(40,20,60,0.82)'; c.beginPath(); c.roundRect(b0.x - b0.w / 2 - 10, b0.y - b0.h / 2 - 6, Math.max(24, (b0.w + 20) * wk), b0.h + 12, 12); c.fill(); c.restore(); }
      M.drawEx(g, c, 'note'); }
    // the turtle points while the work is shown, and hops when a step lands
    const hk = t - S.hopT < 0.35 ? Math.sin((t - S.hopT) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'turtle', HX, HY - hk * 24, 1.15, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'turtle', HX, HY, 1.15);
    M.drawUI(g, c);
  },
});
function paintBg(c, W, H) {
  // sunset sky and sea
  const sk = c.createLinearGradient(0, 0, 0, 250); sk.addColorStop(0, '#2a2a6e'); sk.addColorStop(0.45, '#9a4a7a'); sk.addColorStop(0.8, '#f08a5a'); sk.addColorStop(1, '#ffc87a'); c.fillStyle = sk; c.fillRect(0, 0, W, 252);
  c.fillStyle = '#fff0b0'; c.shadowColor = '#ffd080'; c.shadowBlur = 40; c.beginPath(); c.arc(84, 246, 22, Math.PI, 0); c.fill(); c.shadowBlur = 0;
  const sea = c.createLinearGradient(0, 246, 0, 268); sea.addColorStop(0, '#d0705a'); sea.addColorStop(1, '#5a3a6a'); c.fillStyle = sea; c.fillRect(0, 246, W, 22);
  c.fillStyle = 'rgba(255,220,150,0.6)'; for (let i = 0; i < 6; i++) c.fillRect(70 - i * 3, 250 + i * 3, 28 + i * 6, 1.5);
  // the deck: planks running across, with nail heads
  const dk = c.createLinearGradient(0, 262, 0, H); dk.addColorStop(0, '#9a6236'); dk.addColorStop(1, '#6a3e22'); c.fillStyle = dk; c.fillRect(0, 262, W, H - 262);
  for (let y = 262, i = 0; y < H; y += 26, i++) { c.fillStyle = 'rgba(40,18,6,0.35)'; c.fillRect(0, y, W, 2); c.fillStyle = 'rgba(255,220,170,0.07)'; c.fillRect(0, y + 2, W, 5);
    for (let x = (i % 2) * 70 + 30; x < W; x += 140) { c.fillStyle = 'rgba(40,18,6,0.35)'; c.fillRect(x, y, 2, 26); c.fillStyle = '#3a2210'; c.beginPath(); c.arc(x + 7, y + 13, 1.6, 0, 7); c.fill(); } }
  for (let i = 0; i < 70; i++) { c.strokeStyle = 'rgba(50,24,8,0.18)'; c.lineWidth = 1; const x = (i * 53) % W, y = 268 + (i * 37) % (H - 270); c.beginPath(); c.moveTo(x, y); c.lineTo(x + 30 + (i % 4) * 8, y + (i % 3) - 1); c.stroke(); }
  // a gunwale rail along the sides, a coil of rope and a barrel
  c.fillStyle = '#5a3018'; c.fillRect(0, 262, 10, H); c.fillRect(W - 10, 262, 10, H);
  c.save(); c.translate(54, 574); c.strokeStyle = '#e0c088'; c.lineWidth = 5; for (let r = 22; r > 4; r -= 6) { c.beginPath(); c.ellipse(0, 0, r, r * 0.55, 0, 0, 7); c.stroke(); } c.restore();
  c.save(); c.translate(150, 600); c.fillStyle = '#8a5028'; c.beginPath(); c.ellipse(0, 0, 24, 30, 0, 0, 7); c.fill(); c.strokeStyle = '#3a2410'; c.lineWidth = 3; for (const y of [-16, 16]) { c.beginPath(); c.moveTo(-23, y); c.lineTo(23, y); c.stroke(); } c.fillStyle = '#a86a38'; c.beginPath(); c.ellipse(0, -28, 20, 6, 0, 0, 7); c.fill(); c.restore();
  // the nameboard for the problem: navy with a gold border
  c.fillStyle = 'rgba(20,10,30,0.4)'; c.beginPath(); c.roundRect(14, 188, 336, 62, 14); c.fill();
  c.fillStyle = '#c89a3a'; c.beginPath(); c.roundRect(8, 180, 344, 66, 14); c.fill();
  const nb = c.createLinearGradient(0, 186, 0, 240); nb.addColorStop(0, '#24305e'); nb.addColorStop(1, '#18204a'); c.fillStyle = nb; c.beginPath(); c.roundRect(14, 186, 332, 54, 10); c.fill();
  c.fillStyle = '#e8c06a'; for (const x of [22, 338]) for (const y of [194, 232]) { c.beginPath(); c.arc(x, y, 2.5, 0, 7); c.fill(); }
}
function ambient(c, t) {
  // gulls gliding and the sun's glitter on the water
  for (let i = 0; i < 3; i++) { const x = (i * 140 + t * (14 + i * 4)) % 420 - 30, y = 70 + i * 34 + Math.sin(t * 1.3 + i) * 8, f = Math.sin(t * 5 + i * 2) * 4;
    c.strokeStyle = 'rgba(255,240,230,0.85)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 9, y + f); c.quadraticCurveTo(x - 4, y - 4, x, y); c.quadraticCurveTo(x + 4, y - 4, x + 9, y + f); c.stroke(); }
  c.fillStyle = 'rgba(255,240,200,0.7)'; for (let i = 0; i < 8; i++) { const x = 40 + ((i * 47 + t * 20) % 300), y = 252 + (i % 4) * 4, w = 6 + 4 * Math.sin(t * 3 + i); c.fillRect(x, y, Math.max(0, w), 1.5); }
}
