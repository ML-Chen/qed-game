// fractions_mixed.js — MIXED NUMBER! Turn an improper fraction into a mixed number by making whole pies.
// A picnic on the beach: the fraction 7/3 is painted on a wooden sign, and 7 loose pie slices (thirds) lie on the
// blanket below in loose groups. The player drags the denominator 3 onto the numerator 7, and the working plays:
// three slices light up one by one (that is what 3 means: 3 slices make a whole), "− 3" writes itself beside the 7,
// the slices snap together into a whole pie, the "− 3" slides into the 7 and it rolls down to 4, and a 1 flies up from
// the pie to the whole-number place: 1 4/3. Again: 2 1/3 (the 1 rolls over to 2). When fewer slices are left than make
// a pie, it is done. Dragging the numerator onto the denominator (the wrong way round) only wobbles.
// Level 0: two wholes with halves, thirds or quarters (7/3). Level 1: three wholes (10/3, 7/2). Level 2: fifths and
// sixths, two or three wholes (17/5).
// Medium mode: the tray opens once "− 3" is written and asks for the slices left.
const M = MK, PANEL = 'sign', INK = SCN.ink(PANEL), Y_EX = 282, PY = 462, PR = 30;
const PIE = ['#f6c870', '#d8943e'], FILL = ['#5a2a7a', '#8a4aa8']; // blueberry filling, golden crust

MG.add({
  id: 'fractions_mixed', stage: 'fractions', cmd: 'MIXED NUMBER!', hint: 'drag', time: 8, mood: 'bright', winText: 'Mixed!', hold: 1.4,
  card: {
    title: 'Mixed numbers', ref: 'Grade 4', kind: 'Fractions',
    text: 'In a fraction like 7/3, the bottom number (the denominator) says how many equal pieces make one whole, and the top number (the numerator) says how many pieces there are. When the top is bigger than the bottom, there is more than one whole.\n\nA mixed number writes the same amount as a whole number and a smaller fraction: 2 1/3 means 2 wholes and 1/3 more.\n\nTo change 7/3, take 3 pieces to make one whole pie: 7 − 3 = 4 pieces are left. Take 3 more for a second pie: 4 − 3 = 1 piece is left. One piece is too few for another pie, so 7/3 = 2 1/3.\n\nThis is division: 7 ÷ 3 = 2 with 1 left over. The 2 is the number of wholes, and the 1 left over stays on top of the fraction.',
    note: 'Divide the numerator by the denominator. The quotient is the number of wholes, and the remainder goes on top of the same denominator.',
    ask: 'Write 11/4 as a mixed number. Write 7/2 as a mixed number.',
  },
  init(g) {
    const S = g.s, MKs = M.setup(g), T = M.pace(g); const R = a => a[Math.floor(g.rand() * a.length)];
    const [n, d] = g.level === 0 ? R([[5, 2], [7, 3], [8, 3], [9, 4], [11, 4]]) : g.level === 1 ? R([[7, 2], [10, 3], [11, 3], [13, 4], [15, 4]]) : R([[11, 5], [13, 5], [17, 5], [19, 6], [13, 6], [14, 5]]);
    Object.assign(S, { n0: n, d, n, w: 0, groups: Math.ceil(n / d), formed: [], litAt: [] });
    // the same node objects are kept between rewrites, so the kit glides and rolls them instead of fading them in again
    S.nN = M.num(n, 'n'); S.nD = M.num(d, 'd'); S.nW = M.num(1, 'w', { col: '#ffe08a', alpha: 0 }); S.fr = M.frac(S.nN, S.nD, 'fr'); S.ex = M.row(S.fr);
    const relay = () => M.place(g, 'ex', S.ex, 180, Y_EX, 64, { col: INK }); MKs.relay = relay; relay();
    M.inert(g, ['fr', 'w', 'note']);
    const hop = (g, e) => { MKs.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    const pieX = j => 180 + (j - (S.groups - 1) / 2) * 84;
    g.dur *= (2.6 + 1.05 * Math.floor(n / d)) / 8;
    M.play(g, {
      moves(g) {
        if (S.working || S.n < S.d) return [];
        return [{ drag: 'd', to: ['n', 'fr'], busy: 0.1, askAt: 0.6 * T, after: 0.9 * T,
          ask: { v: S.n - S.d, wrong: [S.n + S.d, S.n - 1, S.d, S.n - S.d + 1] },
          then(g) {
            // the denominator says how many slices make a whole: d slices light up one by one, and "− d" writes itself
            S.working = true; M.show(g, 0.6 * T); S.point = true; hop(g, 'think'); g.sfx('whoosh');
            const j = S.w, step = Math.min(0.12, 0.42 / S.d) * T; S.litAt[j] = { t0: g.t + 0.08 * T, step };
            for (let s = 0; s < S.d; s++) M.at(g, [[0.08 * T + s * step, g => g.sfx('tap')]]);
            M.circle(g, 'd', { dur: 0.45 * T, col: '#ffe08a' }); M.indicate(g, 'd', { dur: 0.4 * T, col: '#ffe08a', sc: 1.25 });
            const bn = M.box(g, 'n'); S.note = M.row(M.op('-'), M.num(S.d)); S.note.id = 'note';
            M.place(g, 'note', S.note, bn.x + bn.w / 2 + 34, bn.y + 12, 34, { col: '#ffe08a' }); M.writeIn(g, S.note, { dur: 0.3 * T, delay: 0.15 * T });
            M.indicate(g, 'n', { delay: 0.2 * T, dur: 0.35 * T, sc: 1.15, col: '#ffe08a' });
          },
          resolve(g) {
            M.show(g, 0.9 * T); const j = S.w, v = S.n - S.d;
            // the slices snap together into one whole pie; the "− d" slides into the numerator, which rolls down
            S.formed[j] = g.t; g.sfx('munch'); g.burst(pieX(j), PY, ['#ffd45a', '#fff4dc', '#ff8a8a'], 12, 120);
            const bn = M.box(g, 'n'), bx = M.box(g, 'note'); if (bn && bx) M.tween(g, S.note, { dx: bn.x - bx.x, alpha: 0, sc: 0.6 }, 0.28 * T);
            M.roll(g, S.nN, v, { delay: 0.15 * T, dur: 0.35 * T }); S.n = v;
            M.at(g, [
              [0.3 * T, g => { // the whole pie sends a 1 up to the whole-number place
                const first = S.w === 0; S.w++;
                if (first) { S.ex.items = [S.nW, M.gap(10), S.fr]; relay(); }
                M.fly(g, { node: M.num(1, null, { col: '#ffe08a' }), from: [pieX(j), PY - 4], to: 'w', dur: 0.4 * T, arc: -50, s0: 30, s1: 64,
                  then(g) { if (first) S.nW.alpha = 1; else M.roll(g, S.nW, S.w, { dur: 0.3 * T }); S.nW.pop = g.t; M.sparkle(g, 'w', { n: 10 }); g.sfx('coin'); hop(g, S.n < S.d ? 'laugh' : 'wow'); } }); }],
              [0.4 * T, g => { delete g.s.mk.ex.note; }],
              [0.85 * T, g => { S.working = false; S.point = false; if (S.n < S.d) { M.indicate(g, S.nN, { dur: 0.4 * T, col: '#b4f5c4' }); M.sparkle(g, 'ex', { n: 14 }); } }],
            ]);
          } }];
      },
      area(g) { return ['d', 'n']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, won = g.done && g.result === 'win';
    SCN.std(g, c, { scene: 'beach', panel: PANEL, panelY: 268, panelH: 150 });
    // the rabbit points at the slices while the work is shown and hops when a whole pie lands
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'rabbit', 66, 606 - hopK * 22, 1.15, { t, pose, expr }); else SCN.host(g, c, 'rabbit', 66, 606, 1.15);
    // the picnic blanket
    c.save(); c.translate(180, PY + 8); c.fillStyle = 'rgba(80,50,20,0.2)'; c.beginPath(); c.ellipse(4, 8, 176, 50, 0, 0, 7); c.fill();
    c.fillStyle = '#f4f0ff'; c.beginPath(); c.ellipse(0, 0, 172, 48, 0, 0, 7); c.fill(); c.clip();
    c.fillStyle = 'rgba(80,140,230,0.45)'; for (let x = -180; x < 180; x += 28) c.fillRect(x, -60, 14, 120); for (let y = -50; y < 60; y += 28) c.fillRect(-180, y, 360, 14); c.restore();
    // the slices: group j is a whole pie once it has been formed (tight), otherwise its slices lie apart
    const d = S.d, step = 2 * Math.PI / d;
    for (let j = 0; j < S.groups; j++) {
      const cx = 180 + (j - (S.groups - 1) / 2) * 84, cnt = Math.min(d, S.n0 - j * d), ft = S.formed[j];
      const k = ft != null ? M.clamp((t - ft) / 0.25, 0, 1) : 0, spread = (1 - M.ease(k)) * 9 + (ft == null ? Math.sin(t * 2 + j) * 0.8 : 0);
      const bounce = ft != null && k < 1 ? Math.sin(k * Math.PI) * 10 : won ? Math.abs(Math.sin(t * 6 + j)) * 4 : 0;
      const lit = S.litAt[j];
      for (let s = 0; s < cnt; s++) {
        const on = lit && ft == null && t >= lit.t0 + s * lit.step, ok = on ? M.clamp((t - lit.t0 - s * lit.step) / 0.15, 0, 1) : 0;
        const a0 = -Math.PI / 2 + s * step, mid = a0 + step / 2, jit = (1 - M.ease(k)) * 0.12 * Math.sin(s * 2.3 + j), ox = Math.cos(mid) * spread, oy = Math.sin(mid) * spread * 0.9;
        c.save(); c.translate(cx + ox * (1 - ok * 0.4), PY + oy - bounce - Math.sin(ok * Math.PI) * 10 - ok * 3); c.rotate(jit); if (on) { c.shadowColor = '#fff070'; c.shadowBlur = 22 * ok; }
        c.fillStyle = 'rgba(60,30,10,0.25)'; c.beginPath(); c.moveTo(2, 4); c.arc(2, 4, PR, a0, a0 + step); c.closePath(); c.fill();
        const gr = c.createRadialGradient(0, 0, 4, 0, 0, PR); gr.addColorStop(0, FILL[1]); gr.addColorStop(0.68, FILL[0]); gr.addColorStop(0.72, PIE[0]); gr.addColorStop(1, PIE[1]);
        c.fillStyle = gr; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, PR, a0, a0 + step); c.closePath(); c.fill(); c.shadowBlur = 0; c.strokeStyle = on ? '#fff6b0' : '#a8602a'; c.lineWidth = on ? 3 : 1.6; c.stroke();
        c.restore();
      }
      if (ft != null && k >= 1) { c.strokeStyle = 'rgba(255,240,170,0.9)'; c.lineWidth = 3; c.beginPath(); c.arc(cx, PY - bounce, PR + 4, 0, 7); c.stroke(); }
    }
    // the ghost outline of each pie that is not whole yet
    for (let j = S.w; j < S.groups; j++) { const cx = 180 + (j - (S.groups - 1) / 2) * 84; c.save(); c.setLineDash([4, 5]); c.strokeStyle = 'rgba(120,80,60,0.45)'; c.lineWidth = 2; c.beginPath(); c.arc(cx, PY, PR + 10, 0, 7); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'ex'); M.drawEx(g, c, 'note');
    M.drawUI(g, c);
  },
});
