// modular_inverse.js — MOD INVERSE! Solve a × ? ≡ 1 (mod n) by walking the multiples of a round an n-hour ring.
// A ring of n paper lanterns at dusk, numbered 0 to n − 1, with a firefly on 0. Each tap lights the lantern of the
// next multiple of a: the firefly hops a hours round the ring, and the centre of the ring rewrites itself as
// "k × 3 = 3k ≡ r". The lantern to tap is (last + a) mod n, so the player counts a hours on from the firefly. When the
// firefly lands on 1, the number of hops k is the inverse, and it fills the "?" in the problem.
// Level 0: mod 5, inverse 2 to 4. Level 1: mod 7. Level 2: mod 7 or mod 11, inverse up to 6.
// Medium mode: on the last hop the player picks the inverse from the tray.
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
    Object.assign(S, { n, a, inv: inv(a, n), k: 0, cur: 0, lit: { 0: -9 }, hops: [], hopAt: -9 });
    S.prob = M.row(M.num(a, 'a'), M.op('×', 'x'), M.slot('ans'), M.op('≡', 'eq'), M.num(1, 'one'), M.gap(10), M.txt(`(mod ${n})`, 'md'));
    M.place(g, 'prob', S.prob, 180, 220, 40, { col: INK }); M.inert(g, ['x', 'eq', 'md', 'ans']);
    M.place(g, 'key', M.txt(`≡ (mod ${n}) means: same remainder after ÷ ${n}`, 'key'), 180, 528, 14, { col: '#ffe0c8' }); M.inert(g, ['key']);
    for (let i = 0; i < n; i++) { const p = pos(S, i); M.zone(g, 'p' + i, { x: p.x, y: p.y, w: 46, h: 50 }); }
    g.dur *= (2.6 + 1.05 * S.inv) / 8;
    const work = (g, k, r) => { const v = k * a; S.work = v === r ? M.row(M.num(k), M.op('×'), M.num(a), M.op('='), M.num(r, null, { col: GOLD, pop: g.t })) : M.row(M.num(k), M.op('×'), M.num(a), M.op('='), M.num(v), M.op('≡'), M.num(r, null, { col: GOLD, pop: g.t })); M.place(g, 'work', S.work, CX, CY + 8, n > 7 ? 20 : 22, { col: INK }); };
    M.play(g, {
      moves(g) {
        if (S.done) return [];
        const nx = (S.cur + a) % n, last = nx === 1, k = S.k + 1;
        const mv = { tap: 'p' + nx, busy: 0.1,
          then(g) { S.hops.push([S.cur, nx]); S.cur = nx; S.k = k; S.hopAt = g.t; S.lit[nx] = g.t; work(g, k, nx); g.sfx(last ? 'magic' : 'pop'); const p = pos(S, nx); g.burst(p.x, p.y, [GOLD, '#fff', '#ff9a6a'], 8, 90); if (last) S.done = true; } };
        if (last) Object.assign(mv, { askAt: 0, after: 0.1, ask: { v: k, wrong: [k + 1, k - 1, n - k, a] },
          resolve(g) { M.node(g, 'ans').fill = M.num(k, 'r', { pop: g.t, col: GOLD }); M.inert(g, ['r']); M.place(g, 'prob', S.prob, 180, 220, 40, { col: INK }); g.sfx('ding'); } });
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
    // the firefly: hops along the newest arc, then hovers by its lantern
    const hk = M.clamp((t - S.hopAt) / 0.22, 0, 1), last = S.hops[S.hops.length - 1];
    let fx, fy; if (last && hk < 1) { const A = pos(S, last[0], R - 20), B = pos(S, last[1], R - 20), e = M.easeIO(hk), cx = (A.x + B.x) / 2 * 0.6 + CX * 0.4, cy = (A.y + B.y) / 2 * 0.6 + CY * 0.4;
      fx = (1 - e) * (1 - e) * A.x + 2 * (1 - e) * e * cx + e * e * B.x; fy = (1 - e) * (1 - e) * A.y + 2 * (1 - e) * e * cy + e * e * B.y; }
    else { const p = pos(S, S.cur, R - 34); fx = p.x + Math.sin(t * 3) * 4; fy = p.y + Math.cos(t * 4) * 3; }
    const fg = c.createRadialGradient(fx, fy, 1, fx, fy, 16); fg.addColorStop(0, 'rgba(240,255,150,1)'); fg.addColorStop(1, 'rgba(240,255,150,0)'); c.fillStyle = fg; c.fillRect(fx - 16, fy - 16, 32, 32);
    c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(fx - 4, fy - 4, 4, 2, -0.6, 0, 7); c.ellipse(fx + 4, fy - 4, 4, 2, 0.6, 0, 7); c.fill();
    M.drawEx(g, c, 'work'); M.drawEx(g, c, 'prob'); c.save(); c.globalAlpha = 0.85; M.drawEx(g, c, 'key'); c.restore();
    SCN.host(g, c, 'fox', 64, 610, 1.15);
    M.drawUI(g, c);
  },
});
