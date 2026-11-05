// symmetry_inverse.js — GROUP INVERSE! Undo a symmetry of the triangle (the dihedral group D3) with its inverse.
// Two turtles stand in the desert. At the start each triangle shell plays its move (a turn with a curved arrow and its
// angle, or a flip across a dashed mirror line) and stays there; dashed rings show where the shell's three marks sat at
// the start. Above each turtle: "r⁻¹ = ?". The player drags the move that undoes it from the row of moves on the sign
// (r, r², f, rf, r²f) onto that turtle, and the working plays by itself: the label becomes "r² ∘ r = ?" (first r, then
// r²), the shell lifts and does r² with its arrow, lands with every mark back in its ring (each ring sparkles), "= e"
// writes itself in green, and the line folds back into r⁻¹ = r². The turtle gasps while its shell moves and hops on landing.
// The moves are real 2×2 matrices (screen coordinates, so r turns counter-clockwise on screen); the inverse is found by
// multiplying, and the animation uses the same matrices, so what the shell does always matches the math.
// Level 0: two turns (r and r²). Level 1: two flips (each flip is its own inverse). Level 2: one turn and one flip.
// Medium mode: once the shell has landed, the tray asks for the single move that "r² ∘ r" equals (e).
const M = MK, PANEL = 'sign', LIGHT = SCN.ink(PANEL), DARK = '#3a1640', ROTC = '#17507e', FLIPC = '#a42c1c';
const rotM = a => [Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a)];
const mul = (A, B) => [A[0] * B[0] + A[1] * B[2], A[0] * B[1] + A[1] * B[3], A[2] * B[0] + A[3] * B[2], A[2] * B[1] + A[3] * B[3]];
const R1 = rotM(-2 * Math.PI / 3), FL = [-1, 0, 0, 1];
const MAT = { e: [1, 0, 0, 1], r: R1, r2: mul(R1, R1), f: FL, rf: mul(R1, FL), r2f: mul(mul(R1, R1), FL) };
const KEYS = ['r', 'r2', 'f', 'rf', 'r2f'], ROT = k => k === 'e' || k === 'r' || k === 'r2';
const same = (A, B) => A.every((v, i) => Math.abs(v - B[i]) < 1e-9);
const inv = k => KEYS.find(j => same(mul(MAT[j], MAT[k]), MAT.e));
// the move k as a smooth motion at progress u (0..1): a turn about the centre, or a flip across its mirror line
function motion(k, u) {
  if (ROT(k)) return rotM({ e: 0, r: -2 * Math.PI / 3, r2: -4 * Math.PI / 3 }[k] * u);
  const A = MAT[k], psi = Math.atan2(A[1], A[0]) / 2, n = [-Math.sin(psi), Math.cos(psi)];
  return [1 - 2 * u * n[0] * n[0], -2 * u * n[0] * n[1], -2 * u * n[0] * n[1], 1 - 2 * u * n[1] * n[1]];
}
function nm(k, id, o = {}) {
  const col = o.col || (k === 'e' ? '#6a4a5a' : ROT(k) ? ROTC : FLIPC), v = x => M.vr(x, null, { col }), r2 = () => M.sup(v('r'), M.num(2, null, { col }));
  const n = M.row(...{ e: [v('e')], r: [v('r')], r2: [r2()], f: [v('f')], rf: [v('r'), v('f')], r2f: [r2(), v('f')] }[k]); n.id = id; if (o.pop) n.pop = o.pop; return n;
}
const leaves = n => !n ? [] : n.items ? n.items.flatMap(leaves) : n.k === 'sup' ? [...leaves(n.base), ...leaves(n.exp)] : n.k === 'paren' ? leaves(n.inner) : [n];
// the move being made, drawn over the shell: a curved arrow with its angle for a turn, a dashed mirror line for a flip
function aid(c, k, u, al, x, y, R) {
  if (k === 'e' || al <= 0) return; c.save(); c.globalAlpha *= al; c.lineCap = 'round';
  if (ROT(k)) { const tot = k === 'r' ? 2 * Math.PI / 3 : 4 * Math.PI / 3, a0 = -Math.PI / 2 - 0.12, a1 = a0 - tot * Math.max(0.04, u), rad = R + 14;
    c.strokeStyle = 'rgba(255,250,235,0.9)'; c.lineWidth = 8; c.beginPath(); c.arc(x, y, rad, a0, a1, true); c.stroke();
    c.strokeStyle = ROTC; c.lineWidth = 4; c.beginPath(); c.arc(x, y, rad, a0, a1, true); c.stroke();
    const hx = x + Math.cos(a1) * rad, hy = y + Math.sin(a1) * rad, ta = a1 - Math.PI / 2; c.fillStyle = ROTC; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath();
    c.moveTo(hx + Math.cos(ta) * 11, hy + Math.sin(ta) * 11); c.lineTo(hx + Math.cos(ta + 2.4) * 9, hy + Math.sin(ta + 2.4) * 9); c.lineTo(hx + Math.cos(ta - 2.4) * 9, hy + Math.sin(ta - 2.4) * 9); c.closePath(); c.stroke(); c.fill();
    if (u > 0.25) { const am = (a0 + a1) / 2, lx = x + Math.cos(am) * (rad + 18), ly = y + Math.sin(am) * (rad + 14); c.font = '700 16px Fredoka, Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.lineWidth = 4; c.strokeStyle = 'rgba(255,250,235,0.9)'; c.strokeText(k === 'r' ? '120°' : '240°', lx, ly); c.fillStyle = ROTC; c.fillText(k === 'r' ? '120°' : '240°', lx, ly); } }
  else { const A = MAT[k], psi = Math.atan2(A[1], A[0]) / 2, L = R + 18, dx = Math.cos(psi) * L, dy = Math.sin(psi) * L;
    c.strokeStyle = 'rgba(255,250,235,0.9)'; c.lineWidth = 7; c.beginPath(); c.moveTo(x - dx, y - dy); c.lineTo(x + dx, y + dy); c.stroke();
    c.setLineDash([9, 6]); c.strokeStyle = FLIPC; c.lineWidth = 3.5; c.beginPath(); c.moveTo(x - dx, y - dy); c.lineTo(x + dx, y + dy); c.stroke(); }
  c.restore();
}
const TX = [95, 265], TY = 486, TS = 1.5, MARKS = [['#ff6b5e', -Math.PI / 2], ['#ffd23a', Math.PI / 6], ['#4aa6f0', Math.PI * 5 / 6]];

MG.add({
  id: 'symmetry_inverse', stage: 'symmetry', cmd: 'GROUP INVERSE!', hint: 'drag', time: 8, mood: 'desert', winText: 'Undone!', hold: 1.4,
  card: {
    title: 'Inverses in a group', ref: 'College', kind: 'Abstract algebra',
    text: 'A group is a set of moves that you can combine: doing one move and then another always gives a move in the set. The move that changes nothing is called the identity, e. Every move has an inverse, the move that undoes it. The inverse of r is written r⁻¹, so doing r and then r⁻¹ gives e.\n\nA triangle has six symmetries: e, the turns r (120°) and r² (240°), and the three flips f, rf and r²f. A turn of 120° followed by a turn of 240° is a full turn of 360°, so every corner is back where it started. That means r⁻¹ = r², and (r²)⁻¹ = r.\n\nFlipping twice across the same line puts the triangle back, so every flip is its own inverse: f⁻¹ = f.',
    note: 'The inverse of a turn is the turn that completes a full circle: r⁻¹ = r². A flip is its own inverse.',
    ask: 'For a square, r is a quarter turn (90°). What is r⁻¹? What is (r³)⁻¹?',
  },
  init(g) {
    const S = g.s; M.setup(g); const R = a => a[Math.floor(g.rand() * a.length)], T = M.pace(g);
    const flips = ['f', 'rf', 'r2f'].sort(() => g.rand() - 0.5);
    const ks = g.level === 0 ? ['r', 'r2'] : g.level === 1 ? flips.slice(0, 2) : [R(['r', 'r2']), flips[0]];
    if (g.rand() < 0.5) ks.reverse();
    // at the start each shell does its move, one after the other, with its turn arrow or mirror line (shown work: the fuse waits)
    S.T = ks.map((k, i) => ({ k, ans: inv(k), done: false, A: MAT[k], anim: { from: MAT.e, key: k, t0: (0.1 + i * 0.45) * T, dur: 0.55 * T }, hopAt: -9, face: null, faceT: -9 }));
    M.show(g, 1.15 * T);
    // the row of moves on the sign, and the key
    M.place(g, 'tiles', M.row(...KEYS.flatMap((k, i) => [i ? M.gap(30) : null, nm(k, 'k_' + k)])), 180, 248, 36);
    M.place(g, 'key', M.row(M.vr('r'), M.op('='), M.txt('rotate 120°'), M.gap(22), M.vr('f'), M.op('='), M.txt('flip')), 180, 296, 15, { col: LIGHT });
    S.label = (i, node) => { const w = M.lay(node, 30).w; M.place(g, 'lab' + i, node, TX[i], 360, Math.min(30, 30 * 160 / w), { col: DARK }); };
    // the label's parts are kept as objects, so when it is rewritten the symbols glide instead of fading in again
    S.T.forEach((t, i) => { t.inner = nm(t.k, 'kk' + i); t.par = t.k === 'r' || t.k === 'f' ? null : M.paren(t.inner); t.neg = M.num(-1, null, { col: DARK });
      t.inv = M.sup(t.par || t.inner, t.neg); t.eq = M.op('='); t.q = M.slot('q' + i); S.label(i, M.row(t.inv, t.eq, t.q)); M.zone(g, 'tu' + i, { x: TX[i], y: 428, w: 150, h: 150 }); });
    g.dur *= (2.6 + 1.05 * 2) / 8;
    const MOVE = 0.62 * T, ASK = 0.8 * T, AFTER = 0.8 * T;
    M.play(g, {
      moves(g) {
        return S.T.map((t, i) => t.done ? null : {
          drag: 'k_' + t.ans, to: ['tu' + i, 'q' + i], busy: 0.1, askAt: ASK, after: AFTER,
          ask: { v: nm('e'), wrong: [...new Set([t.k, t.ans, 'r', 'f', 'r2'])].map(k => nm(k)) },
          // the drop: the label becomes "r² ∘ r = ?" (first r, which the shell already did, then r²), and the shell does r²
          then(g) { t.done = true; g.sfx('whoosh'); M.show(g, ASK);
            t.ansN = nm(t.ans, 'a' + i, { pop: g.t }); t.circ = M.op('∘'); t.kN = t.inner;
            t.ansN.alpha = 0; t.circ.alpha = 0; t.neg.alpha = 0;
            S.label(i, M.row(t.ansN, t.circ, t.kN, t.eq, t.q)); M.inert(g, ['a' + i, 'kk' + i]);
            // the dragged move flies from the sign into the label, in front of the move it undoes
            M.fly(g, { node: nm(t.ans), from: 'k_' + t.ans, to: 'a' + i, dur: 0.3 * T, arc: -30, s0: 36, then(g) { t.ansN.alpha = 1; t.ansN.pop = g.t; t.circ.alpha = 1; M.sparkle(g, 'a' + i, { n: 6 }); } });
            M.indicate(g, t.kN, { dur: 0.3 * T, sc: 1.25 });
            t.anim = { from: t.A, key: t.ans, t0: g.t + 0.15 * T, dur: MOVE }; t.A = MAT.e; t.face = 'wow'; t.faceT = g.t;
            // for turns, the angles write themselves under the two moves: 120° and 240° make a full 360° turn, which is e
            if (ROT(t.k)) { const deg = k => M.txt(k === 'r' ? '120°' : '240°'); M.at(g, [[0.15 * T + MOVE * 0.55, g => {
              M.note(g, { node: deg(t.ans), at: 'a' + i, off: [0, -27], s: 15, col: ROTC, write: 0.22 * T, hold: 0.7 * T, fade: 0.25 * T });
              M.note(g, { node: deg(t.k), at: 'kk' + i, off: [0, -27], s: 15, col: ROTC, delay: 0.16 * T, write: 0.22 * T, hold: 0.54 * T, fade: 0.25 * T }); }]]); }
            M.at(g, [[0.15 * T + MOVE, g => { t.landAt = g.t; t.hopAt = g.t; g.sfx('ding'); MARKS.forEach(([col, ang], j) => M.later(g, j * 0.06 * T, g => g.burst(TX[i] + Math.cos(ang) * 23.4, TY - 45.6 + Math.sin(ang) * 23.4, [col, '#fff4dc', '#9ae07a'], 6, 90))); }]]); },
          // = e writes itself (every mark is home), then the line rearranges itself into r⁻¹ = r²
          resolve(g) { M.show(g, AFTER); g.sfx('coin');
            const eN = nm('e', 'e' + i); eN.col = M.GOOD; for (const q of eN.items) q.col = M.GOOD; t.q.fill = eN; S.label(i, M.row(t.ansN, t.circ, t.kN, t.eq, t.q)); M.inert(g, ['e' + i]);
            M.writeIn(g, eN, { dur: 0.22 * T }); M.indicate(g, eN, { delay: 0.2 * T, dur: 0.3 * T, col: M.GOOD });
            for (const q of [...leaves(eN), t.circ]) M.tween(g, q, { alpha: 0 }, 0.15 * T, { delay: 0.35 * T });
            M.at(g, [[0.5 * T, g => { t.q.fill = null; t.q.hide = true; S.label(i, M.row(t.inv, t.eq, t.ansN)); M.tween(g, t.neg, { alpha: 1 }, 0.25 * T, { delay: 0.1 * T });
              M.tween(g, t.ansN, { dy: -24 }, 0.32 * T, { yoyo: true }); M.tween(g, t.inv, { dy: 12 }, 0.32 * T, { yoyo: true }); /* they swap places on arcs, one over and one under */ M.indicate(g, t.ansN, { delay: 0.2 * T, dur: 0.35 * T, sc: 1.2 }); t.hopAt = g.t; g.sfx('pop'); }]]); },
        }).filter(Boolean);
      },
      area(g) { const t = S.T.find(q => !q.done); return t ? ['k_' + t.ans] : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.std(g, c, { scene: 'desert', panel: PANEL, panelY: 262, panelH: 104 });
    // each move sits on a pale round stone
    for (const k of KEYS) { const b = M.box(g, 'k_' + k); if (!b) continue; const r = Math.max(b.w, b.h) / 2 + 9;
      c.fillStyle = 'rgba(40,20,5,0.35)'; c.beginPath(); c.arc(b.x + 2, b.y + 4, r, 0, 7); c.fill();
      c.fillStyle = '#fff2d8'; c.beginPath(); c.arc(b.x, b.y, r, 0, 7); c.fill(); c.strokeStyle = '#c8a070'; c.lineWidth = 2.5; c.stroke(); }
    M.drawEx(g, c, 'tiles'); M.drawEx(g, c, 'key');
    const won = g.done && g.result === 'win';
    S.T.forEach((tt, i) => {
      const hk = (t - tt.hopAt) / 0.4, hp = hk > 0 && hk < 1 ? Math.sin(hk * Math.PI) : 0;
      const x = TX[i], hop = won ? Math.abs(Math.sin(t * 6 + i)) * 10 : hp * 14, y = TY - hop;
      const missed = K.missInfo && K.missInfo.to === 'tu' + i && t - K.missAt < 0.45, moving = tt.anim && t >= tt.anim.t0 && t < tt.anim.t0 + tt.anim.dur;
      const sad = g.done && !won, expr = won || (tt.landAt && t - tt.landAt < 0.8) ? 'laugh' : missed || sad ? 'sad' : moving ? 'wow' : 'happy';
      if (typeof ANI !== 'undefined') ANI.draw(c, 'turtle', x, y, TS, { t, pose: won ? 'cheer' : hp > 0 ? 'hop' : 'idle', expr, facing: i ? -1 : 1, phase: i * 2 });
      // the shell, moved by its matrix (lifted while it moves)
      const a = tt.anim, k = a ? M.clamp((t - a.t0) / a.dur, 0, 1) : 1, A = a && k < 1 ? mul(motion(a.key, M.easeIO(k)), a.from) : tt.A;
      const lift = a && k > 0 && k < 1 ? Math.sin(k * Math.PI) * 18 : 0, cx = x + (missed ? Math.sin(t * 50) * 4 : 0), cy = y - 30.4 * TS - lift, R = 31.2 * TS;
      c.save(); c.translate(cx, cy); c.transform(A[0], A[2], A[1], A[3], 0, 0); if (typeof ANI !== 'undefined') ANI.shell(c, 0, 0, R * 1.05); c.restore();
      // dashed rings: where the three marks sit at the start
      const home = !tt.A.some((v, j) => Math.abs(v - MAT.e[j]) > 1e-9) && k >= 1;
      for (const [col, ang] of MARKS) { c.save(); c.strokeStyle = home ? '#2f9a5a' : col; c.lineWidth = 2.5; c.setLineDash([4, 4]); c.lineDashOffset = -t * 12;
        c.beginPath(); c.arc(x + Math.cos(ang) * R * 0.5, y - 30.4 * TS + Math.sin(ang) * R * 0.5, R * 0.27, 0, 7); c.stroke(); c.restore(); }
      if (a && k > 0 && k < 1) aid(c, a.key, M.easeIO(k), Math.min(1, Math.sin(k * Math.PI) * 2.5), x, y - 30.4 * TS, R);
      M.drawEx(g, c, 'lab' + i);
    });
    M.drawUI(g, c);
  },
});
