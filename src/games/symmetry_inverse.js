// symmetry_inverse.js — GROUP INVERSE! Undo a symmetry of the triangle (the dihedral group D3) with its inverse.
// Two turtles stand in the desert. At the start each triangle shell does one move (a turn or a flip) and stays there;
// dashed rings show where the shell's three marks sit at the start. Above each turtle: "r⁻¹ = ?". The player drags the
// move that undoes it from the row of moves on the sign (r, r², f, rf, r²f) onto that turtle: the shell does that move
// and lands back at the start, every mark in its ring, and the label reads r⁻¹ = r². A wrong move only wobbles.
// The moves are real 2×2 matrices (screen coordinates, so r turns counter-clockwise on screen); the inverse is found by
// multiplying, and the animation uses the same matrices, so what the shell does always matches the math.
// Level 0: two turns (r and r²). Level 1: two flips (each flip is its own inverse). Level 2: one turn and one flip.
// Medium mode: the drop writes "r² ∘ r = ?" and the tray asks for the single move it equals (e).
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
const invOf = k => M.sup(k === 'r' || k === 'f' ? nm(k) : M.paren(nm(k)), M.num(-1, null, { col: DARK }));
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
    const S = g.s; M.setup(g); const R = a => a[Math.floor(g.rand() * a.length)];
    const flips = ['f', 'rf', 'r2f'].sort(() => g.rand() - 0.5);
    const ks = g.level === 0 ? ['r', 'r2'] : g.level === 1 ? flips.slice(0, 2) : [R(['r', 'r2']), flips[0]];
    if (g.rand() < 0.5) ks.reverse();
    S.T = ks.map((k, i) => ({ k, ans: inv(k), done: false, A: MAT[k], anim: { from: MAT.e, key: k, t0: 0.15, dur: 0.5 } }));
    // the row of moves on the sign, and the key
    M.place(g, 'tiles', M.row(...KEYS.flatMap((k, i) => [i ? M.gap(30) : null, nm(k, 'k_' + k)])), 180, 248, 36);
    M.place(g, 'key', M.row(M.vr('r'), M.op('='), M.txt('rotate 120°'), M.gap(22), M.vr('f'), M.op('='), M.txt('flip')), 180, 296, 15, { col: LIGHT });
    S.label = (i, node) => { const w = M.lay(node, 30).w; M.place(g, 'lab' + i, node, TX[i], 360, Math.min(30, 30 * 160 / w), { col: DARK }); };
    S.T.forEach((t, i) => { S.label(i, M.row(invOf(t.k), M.op('='), M.slot('q' + i))); M.zone(g, 'tu' + i, { x: TX[i], y: 428, w: 150, h: 150 }); });
    g.dur *= (2.6 + 1.05 * 2) / 8;
    M.play(g, {
      moves(g) {
        return S.T.map((t, i) => t.done ? null : {
          drag: 'k_' + t.ans, to: ['tu' + i, 'q' + i], busy: 0.1, askAt: 0, after: 0.1,
          ask: { v: nm('e'), wrong: [...new Set([t.k, t.ans, 'r', 'f', 'r2'])].map(k => nm(k)) },
          then(g) { t.done = true; g.sfx('whoosh'); if (g.mode === 'medium') S.label(i, M.row(nm(t.ans), M.op('∘'), nm(t.k), M.op('='), M.slot('q' + i))); },
          resolve(g) {
            t.anim = { from: t.A, key: t.ans, t0: g.t, dur: 0.3 }; t.A = MAT.e; g.sfx('coin');
            S.label(i, M.row(invOf(t.k), M.op('='), nm(t.ans, 'a' + i, { pop: g.t }))); M.inert(g, ['a' + i]);
            M.later(g, 0.3, g => { t.landAt = g.t; g.sfx('ding'); g.burst(TX[i], TY - 46, ['#ffd45a', '#fff4dc', '#9ae07a'], 14, 130); });
          },
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
      const x = TX[i], hop = won ? Math.abs(Math.sin(t * 6 + i)) * 10 : 0, y = TY - hop;
      const missed = K.missInfo && K.missInfo.to === 'tu' + i && t - K.missAt < 0.45;
      const sad = g.done && !won, expr = won || (tt.landAt && t - tt.landAt < 0.8) ? 'laugh' : missed || sad ? 'sad' : 'happy';
      if (typeof ANI !== 'undefined') ANI.draw(c, 'turtle', x, y, TS, { t, pose: 'idle', expr, facing: i ? -1 : 1, phase: i * 2 });
      // the shell, moved by its matrix (lifted while it moves)
      const a = tt.anim, k = a ? M.clamp((t - a.t0) / a.dur, 0, 1) : 1, A = a && k < 1 ? mul(motion(a.key, M.easeIO(k)), a.from) : tt.A;
      const lift = a && k > 0 && k < 1 ? Math.sin(k * Math.PI) * 18 : 0, cx = x + (missed ? Math.sin(t * 50) * 4 : 0), cy = y - 30.4 * TS - lift, R = 31.2 * TS;
      c.save(); c.translate(cx, cy); c.transform(A[0], A[2], A[1], A[3], 0, 0); if (typeof ANI !== 'undefined') ANI.shell(c, 0, 0, R * 1.05); c.restore();
      // dashed rings: where the three marks sit at the start
      const home = !tt.A.some((v, j) => Math.abs(v - MAT.e[j]) > 1e-9) && k >= 1;
      for (const [col, ang] of MARKS) { c.save(); c.strokeStyle = home ? '#2f9a5a' : col; c.lineWidth = 2.5; c.setLineDash([4, 4]); c.lineDashOffset = -t * 12;
        c.beginPath(); c.arc(x + Math.cos(ang) * R * 0.5, y - 30.4 * TS + Math.sin(ang) * R * 0.5, R * 0.27, 0, 7); c.stroke(); c.restore(); }
      M.drawEx(g, c, 'lab' + i);
    });
    M.drawUI(g, c);
  },
});
