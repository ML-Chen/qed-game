// modular_inverse.js — MOD INVERSE! Solve a × ? ≡ 1 (mod n) by walking the multiples of a round an n-hour ring.
// A ring of n paper lanterns at dusk, numbered 0 to n − 1, with a firefly on 0. The lantern to tap is the next
// multiple of a: (last + a) mod n, so the player counts a hours on from the firefly. The working then plays by
// itself: the firefly walks there one hour at a time, each lantern it passes flickers with "+1", "+2", ... beside it,
// a golden trail grows along the ring behind it, and the 0 lantern flashes when it goes past 0 (a full turn is
// dropped). The tapped lantern lights, and the centre of the ring writes "k × 3 = 3k", then "≡ r". When the firefly
// lands on 1, the number of hops k is the inverse: the note is circled and k flies up into the "?" in the problem.
// Level 0: mod 5, inverse 2 to 4. Level 1: mod 7. Level 2: mod 7 or mod 11, inverse up to 6.
// Medium mode: on the last hop the note reads "? × a ≡ 1" and the player picks the inverse from the tray.
// Wrong parts: every other lantern (a tap wobbles it) and the numbers of the problem.
const M = MK, CX = 180, CY = 378, R = 110, INK = '#fff4e6', GOLD = '#ffc85a';
const POOL = [[[5, 2], [5, 3], [5, 4]], [[7, 2], [7, 3], [7, 4], [7, 5]], [[7, 3], [7, 5], [7, 6], [11, 2], [11, 3], [11, 4], [11, 6], [11, 9]]];
const inv = (a, n) => { for (let k = 1; k < n; k++) if (k * a % n === 1) return k; return 0; };
const pos = (S, k, r = R) => { const t = k * 2 * Math.PI / S.n - Math.PI / 2; return { x: CX + Math.cos(t) * r, y: CY + Math.sin(t) * r }; };
function lantern(c, x, y, lit, glow, t, k) {
  c.save(); c.translate(x, y + Math.sin(t * 1.6 + k) * 1.5);
  if (lit) { const gr = c.createRadialGradient(0, 0, 4, 0, 0, 46); gr.addColorStop(0, `rgba(255,200,90,${0.55 * glow})`); gr.addColorStop(1, 'rgba(255,200,90,0)'); c.fillStyle = gr; c.fillRect(-46, -46, 92, 92); }
  const bg = c.createRadialGradient(-6, -8, 2, 0, 0, 24); bg.addColorStop(0, lit ? '#fff0b8' : '#9a6a8a'); bg.addColorStop(1, lit ? '#f08a3a' : '#5a3a62');
  c.fillStyle = bg; c.beginPath(); c.ellipse(0, 0, 21, 23, 0, 0, 7); c.fill();
  c.strokeStyle = lit ? 'rgba(160,70,20,0.5)' : 'rgba(30,15,40,0.45)'; c.lineWidth = 1.4; for (const ex of [-12, 0, 12]) { c.beginPath(); c.ellipse(0, 0, Math.abs(ex) * 1.5 + 2, 23, 0, 0, 7); c.stroke(); }
  c.fillStyle = '#3a2030'; c.fillRect(-8, -27, 16, 6); c.fillRect(-8, 21, 16, 6);
  c.restore();
}

MG.add({
  id: 'modular_inverse', stage: 'modular', cmd: 'MOD INVERSE!', hint: 'tap', time: 9, mood: 'night', winText: 'Inverted!', hold: 1.4,
  card: {
    title: 'Inverses mod n', ref: 'College', kind: 'Number theory',
    text: 'Two numbers are congruent mod n, written ≡, when they leave the same remainder after dividing by n. On an n-hour clock they land on the same hour. For example, 15 ≡ 1 (mod 7), because 15 = 2 × 7 + 1.\n\nThe inverse of a mod n is the number k with a × k ≡ 1 (mod n). It plays the part of 1/a on the clock.\n\nTo find it, walk the multiples of a round an n-hour clock until you land on 1. For 3 mod 7: 3, 6, 9 ≡ 2, 12 ≡ 5, 15 ≡ 1. That took 5 steps, so the inverse is 5. Check it: 3 × 5 = 15 = 2 × 7 + 1.\n\nAn inverse exists only when a and n share no factor bigger than 1. Mod 6, the multiples of 2 are 2, 4, 0, 2, 4, 0 and never reach 1.',
    note: 'The inverse of a mod n is the k with a × k ≡ 1 (mod n). Count up the multiples of a, keeping only the remainder, until you reach 1.',
    ask: 'What is the inverse of 2 mod 7? What is the inverse of 4 mod 5?',
  },
  init(g) {
    const S = g.s; M.setup(g); const pool = POOL[g.level], [n, a] = pool[Math.floor(g.rand() * pool.length)];
    Object.assign(S, { n, a, inv: inv(a, n), k: 0, cur: 0, lit: { 0: -9 }, hops: [], hopAt: -9, flick: {} });
    S.prob = M.row(M.num(a, 'a'), M.op('×', 'x'), M.slot('ans'), M.op('≡', 'eq'), M.num(1, 'one'), M.gap(10), M.txt(`(mod ${n})`, 'md'));
    M.place(g, 'prob', S.prob, 180, 220, 40, { col: INK }); M.inert(g, ['x', 'eq', 'md', 'ans']);
    M.place(g, 'key', M.txt(`≡ (mod ${n}) means: same remainder after ÷ ${n}`, 'key'), 180, 528, 14, { col: '#ffe0c8' }); M.inert(g, ['key']);
    for (let i = 0; i < n; i++) { const p = pos(S, i); M.zone(g, 'p' + i, { x: p.x, y: p.y, w: 46, h: 50 }); }
    g.dur *= (2.6 + 1.05 * S.inv) / 8;
    const T = S.T = M.pace(g), hop = e => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // the note in the middle of the ring: "k × a = ka", then "≡ r" (or, in medium on the last hop, "? × a ≡ 1")
    const work = (g, k, r, ask) => { const v = k * a, sz = n > 7 ? 20 : 22, o = { col: GOLD };
      S.kn = ask ? M.slot('kq', { w: 26 }) : M.num(k, 'kn');
      const p1 = ask ? M.row(S.kn, M.op('×'), M.num(a)) : M.row(S.kn, M.op('×'), M.num(a), M.op('='), M.num(v, null, v === r ? o : null));
      const p2 = ask || v !== r ? M.row(M.op('≡'), M.num(r, null, o)) : null;
      S.work = M.row(p1, p2); S.work.id = 'wk'; M.place(g, 'work', S.work, CX, CY + 8, sz, { col: INK }); M.inert(g, ['kn', 'kq', 'wk']);
      M.writeIn(g, p1, { dur: 0.3 * T }); if (p2) M.writeIn(g, p2, { delay: 0.32 * T, dur: 0.2 * T }); return p2 ? 0.55 * T : 0.32 * T; };
    M.play(g, {
      moves(g) {
        if (S.done) return [];
        const nx = (S.cur + a) % n, last = nx === 1, k = S.k + 1, st = Math.min(0.17, 1 / a) * T, walk = a * st, ask = last && g.mode === 'medium';
        const noteAt = walk + 0.05 * T, noteLen = (ask || k * a !== nx ? 0.55 : 0.32) * T, end = noteAt + noteLen + 0.12 * T;
        const mv = { tap: 'p' + nx, busy: 0.1,
          // the firefly walks a hours, one lantern at a time, then the note writes itself
          then(g) { const from = S.cur; S.walk = { from, a, t0: g.t, st }; S.cur = nx; S.k = k; S.point = true; hop('think'); M.show(g, end); g.sfx('swoosh');
            for (let i = 1; i <= a; i++) M.at(g, [[i * st, g => { const q = (from + i) % n; S.flick[q] = { t0: g.t, i }; g.sfx('tap', { p: 1 + i * 0.06 });
              if (q === 0) { S.wrapAt = g.t; g.sfx('coin', { p: 0.8 }); } }]]);
            M.at(g, [[walk, g => { S.hops.push([from, nx]); S.lit[nx] = g.t; S.hopAt = -9; S.walk = null; g.sfx(last ? 'magic' : 'pop'); const p = pos(S, nx); g.burst(p.x, p.y, [GOLD, '#fff', '#ff9a6a'], 10, 100); hop(); }],
              [noteAt, g => { work(g, k, nx, ask); }],
              [end, g => { if (!last) S.point = false; }]]);
            if (last) S.done = true; } };
        if (last) Object.assign(mv, { askAt: end, after: 0.8 * T, ask: { v: k, wrong: [k + 1, k - 1, n - k, a] },
          // k hops landed on 1: the note is circled and k flies up into the ?
          resolve(g) { M.show(g, 0.8 * T); hop('wow');
            if (ask) { const p1 = S.work.items[0]; p1.items[0] = S.kn = M.num(k, 'kn', { pop: g.t, _born: -1 }); M.place(g, 'work', S.work, CX, CY + 8, n > 7 ? 20 : 22, { col: INK }); }
            M.circle(g, 'wk', { col: GOLD, dur: 0.4 * T }); M.indicate(g, 'kn', { col: GOLD, sc: 1.4, dur: 0.35 * T });
            M.at(g, [[0.3 * T, g => { M.fly(g, { node: M.num(k, null, { col: GOLD }), from: 'kn', to: 'ans', dur: 0.4 * T, arc: -50, s0: 22, s1: 40,
              then(g) { M.node(g, 'ans').fill = M.num(k, 'r', { pop: g.t, col: GOLD }); M.inert(g, ['r']); M.place(g, 'prob', S.prob, 180, 220, 40, { col: INK }); M.sparkle(g, 'r', { n: 12, cols: [GOLD, '#fff', '#ff9a6a'] }); g.sfx('ding'); hop('laugh'); S.point = false; } }); }]]); } });
        return [mv];
      },
      area(g) { return 'p' + (S.cur + a) % n; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, K = S.mk, t = g.t; SCN.bg(g, c, 'dusk');
    // the string the lanterns hang on, and the hops taken so far as golden arcs bowed toward the centre
    c.strokeStyle = 'rgba(40,20,40,0.6)'; c.lineWidth = 2; c.beginPath(); c.arc(CX, CY, R, 0, 7); c.stroke();
    S.hops.forEach(([p, q], i) => { const A = pos(S, p, R - 20), B = pos(S, q, R - 20), recent = i === S.hops.length - 1;
      c.strokeStyle = recent ? 'rgba(255,220,120,0.9)' : 'rgba(255,200,110,0.35)'; c.lineWidth = recent ? 3 : 2; c.setLineDash([5, 6]); c.beginPath(); c.moveTo(A.x, A.y); c.quadraticCurveTo((A.x + B.x) / 2 * 0.6 + CX * 0.4, (A.y + B.y) / 2 * 0.6 + CY * 0.4, B.x, B.y); c.stroke(); c.setLineDash([]); });
    for (let i = 0; i < S.n; i++) {
      const p = pos(S, i), lit = S.lit[i] != null, pk = lit ? M.clamp((t - S.lit[i]) / 0.3, 0, 1) : 0;
      lantern(c, p.x, p.y, lit, lit ? 0.6 + 0.4 * Math.sin(t * 3 + i) : 0, t, i);
      c.save(); const sc = 1 + Math.sin(pk * Math.PI) * 0.35; c.translate(p.x, p.y + 1); c.scale(sc, sc); c.fillStyle = lit ? '#5a2010' : '#f8e8f0'; c.font = M.NUMF(S.n > 7 ? 20 : 22); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(i), 0, 1); c.restore();
    }
    // the firefly walks round the ring one hour at a time, hopping in toward the centre on each step; a golden
    // trail grows behind it along the ring. Otherwise it hovers by its lantern.
    const T = S.T || 1, W = S.walk; let fx, fy;
    if (W) { const pr = M.clamp((t - W.t0) / W.st, 0, W.a), i = Math.min(W.a - 1, Math.floor(pr)), fr = pr >= W.a ? 1 : pr - i, u = W.from + i + M.easeIO(fr), r = R - 34 - Math.sin(fr * Math.PI) * 14;
      const an = th => th * 2 * Math.PI / S.n - Math.PI / 2;
      c.save(); c.strokeStyle = 'rgba(255,220,120,0.85)'; c.shadowColor = GOLD; c.shadowBlur = 10; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.arc(CX, CY, R, an(W.from), an(W.from + pr)); c.stroke(); c.restore();
      fx = CX + Math.cos(an(u)) * r; fy = CY + Math.sin(an(u)) * r; }
    else { const p = pos(S, S.cur, R - 34); fx = p.x + Math.sin(t * 3) * 4; fy = p.y + Math.cos(t * 4) * 3; }
    // each lantern passed flickers and shows how many hours have been counted so far
    for (const [q, f] of Object.entries(S.flick)) { const k = (t - f.t0) / (0.6 * T); if (k > 1) continue; let p = pos(S, +q, R + 34); if (p.y < 262) p = { x: p.x + 34, y: pos(S, +q).y - 14 }; // the top lantern's label sits beside it, clear of the problem
      c.save(); c.globalAlpha = Math.min(1, 3 * (1 - k)); c.font = M.NUMF(16 + 6 * Math.sin(Math.min(1, k * 3) * Math.PI / 2), 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = GOLD; c.strokeStyle = 'rgba(40,20,50,0.7)'; c.lineWidth = 3;
      c.strokeText('+' + f.i, p.x, p.y - k * 6); c.fillText('+' + f.i, p.x, p.y - k * 6); c.restore();
      const lp = pos(S, +q); c.save(); c.globalAlpha = 0.6 * (1 - k); c.fillStyle = '#fff4c0'; c.beginPath(); c.arc(lp.x, lp.y, 18 + k * 10, 0, 7); c.fill(); c.restore(); }
    // passing 0 drops a whole turn: the 0 lantern rings
    if (S.wrapAt != null && t - S.wrapAt < 0.5 * T) { const k = (t - S.wrapAt) / (0.5 * T), p = pos(S, 0); c.save(); c.globalAlpha = 1 - k; c.strokeStyle = '#fff4c0'; c.shadowColor = GOLD; c.shadowBlur = 12; c.lineWidth = 3; c.beginPath(); c.arc(p.x, p.y, 26 + k * 18, 0, 7); c.stroke(); c.restore(); }
    const fg = c.createRadialGradient(fx, fy, 1, fx, fy, 16); fg.addColorStop(0, 'rgba(240,255,150,1)'); fg.addColorStop(1, 'rgba(240,255,150,0)'); c.fillStyle = fg; c.fillRect(fx - 16, fy - 16, 32, 32);
    c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(fx - 4, fy - 4, 4, 2, -0.6, 0, 7); c.ellipse(fx + 4, fy - 4, 4, 2, 0.6, 0, 7); c.fill();
    M.drawEx(g, c, 'work'); M.drawEx(g, c, 'prob'); c.save(); c.globalAlpha = 0.85; M.drawEx(g, c, 'key'); c.restore();
    // the fox points at the ring while the work is shown, and hops when the firefly lands
    { const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
      const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
      if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', 54, 630 - hopK * 14, 1.05, { t, pose, expr }); else SCN.host(g, c, 'fox', 54, 630, 1.05); }
    M.drawUI(g, c);
  },
});
