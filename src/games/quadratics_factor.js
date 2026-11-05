// quadratics_factor.js — FACTOR! Factor x² + bx + c as (x + p)(x + q), where p · q = c and p + q = b.
// Under the sea: the quadratic is written on the water, and the factor pairs of c float in bubbles below it.
// The player drags the bubble whose pair adds up to b onto the brackets, and the check acts itself out (show your work):
// the bubble pops and its pair floats up under the last number, where "2 · 3 = 6" writes itself and the 6 lights up;
// a copy slides over under the middle term as "2 + 3 =", and "5" writes itself in as the 5x lights up. Then the two
// numbers fly down into the brackets (the signs flip to − where a number is negative) and the octopus cheers.
// A bubble whose pair has the wrong sum wobbles, and its sum writes itself beside it in red ("1 + 6 = 7 ≠ 5").
// Level 0: small positive numbers. Level 1: bigger positive numbers. Level 2: negative numbers too.
// Medium mode: the player picks the sum p + q from the tray when "2 + 3 =" is written.
const M = MK, INK = '#fff6e0', PRD = '#ffb0d8', SUM = '#9ae8ff', GOLD = '#ffe680', PY = 222, NY = 268, AY = 330;
const SLOTS = [[94, 430], [266, 430], [94, 504], [266, 504]]; // where the bubbles float
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c, kind, x, y, s, facing) { // the host hops on beats and points at the work while it is shown
  const S = g.s, mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hk * 24, s, { t: g.t, pose, expr, facing }); else SCN.host(g, c, kind, x, y, s);
}
function pairsOf(c, signed) {
  const out = [], A = Math.abs(c);
  for (let u = 1; u * u <= A; u++) if (A % u === 0) { const v = A / u;
    if (c > 0) { out.push([u, v]); if (signed) out.push([-v, -u]); } else { out.push([u, -v]); if (u !== v) out.push([-u, v]); } }
  return out;
}
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (;;) {
    let p = L === 0 ? r(1, 5) : r(2, 9), q = L === 0 ? r(1, 6) : r(2, 9);
    if (L === 2) { p = r(1, 7) * (g.rand() < 0.5 ? -1 : 1); q = r(1, 7) * (g.rand() < 0.6 ? -1 : 1); }
    if (p === q || p + q === 0) continue;
    const c = p * q; if (L === 0 && c > 12 || Math.abs(c) > 42) continue;
    const pairs = pairsOf(c, L === 2); if (pairs.length < 2) continue;
    const right = pairs.findIndex(([u, v]) => u + v === p + q);
    // the right pair plus up to three others, in shuffled bubbles
    const others = pairs.filter((_, i) => i !== right).sort(() => g.rand() - 0.5).slice(0, 3);
    const list = [pairs[right], ...others].sort(() => g.rand() - 0.5);
    return { b: p + q, c, list, ri: list.indexOf(pairs[right]), pair: pairs[right] };
  }
}
const sn = v => v < 0 ? M.paren(M.num(v)) : M.num(v); // a negative factor goes in brackets: (−2) · 3
function poly(b, c) { const tb = M.row(M.op(b < 0 ? '-' : '+'), Math.abs(b) === 1 ? null : M.num(Math.abs(b)), M.vr('x')), tc = M.row(M.op(c < 0 ? '-' : '+'), M.num(Math.abs(c))); tb.id = 'pb'; tc.id = 'pc';
  const r = M.row(M.sup(M.vr('x'), M.num(2)), tb, tc); r.id = 'pq'; return r; }

MG.add({
  id: 'quadratics_factor', stage: 'quadratics', cmd: 'FACTOR!', hint: 'drag', time: 9, mood: 'sea', winText: 'Factored!', hold: 1.4,
  card: {
    title: 'Factoring a quadratic', ref: 'Algebra 1', kind: 'Algebra',
    text: 'A quadratic is an expression such as x² + 5x + 6, where the highest power of x is 2. To factor it means to write it as two brackets multiplied together.\n\nWhen there is no number in front of x², look for two numbers that multiply to make the last number and add up to the middle number. For x² + 5x + 6 you need a product of 6 and a sum of 5. The pairs that make 6 are 1 · 6 and 2 · 3. Only 2 + 3 makes 5, so x² + 5x + 6 = (x + 2)(x + 3).\n\nThis works because multiplying out (x + p)(x + q) gives x² + (p + q)x + pq. The two numbers add up to the middle number and multiply to the last one.',
    note: 'To factor x² + bx + c, find two numbers p and q with p · q = c and p + q = b. Then x² + bx + c = (x + p)(x + q).',
    ask: 'Factor x² + 7x + 12. Factor x² − x − 6.',
  },
  init(g) {
    const S = g.s; M.setup(g); const P0 = S.p = pick(g), T = S.T = M.pace(g);
    M.place(g, 'prob', poly(P0.b, P0.c), 180, PY, 46, { col: INK });
    const br = k => M.paren(M.row(M.vr('x'), M.op('+', 'o' + k), M.slot('s' + k, { col: '#bfe8ff' })), 'p' + k);
    S.ans = M.row(M.op('=', 'eq'), M.gap(4), br(1), br(2));
    M.place(g, 'ans', S.ans, 180, AY, 40, { col: INK });
    P0.list.forEach(([u, v], i) => { const n = M.row(sn(u), M.op('·'), sn(v)); n.id = 'k' + i; M.place(g, 'k' + i, n, SLOTS[i][0], SLOTS[i][1] + 11, 30, { col: INK }); });
    M.inert(g, ['eq', 'p1', 'p2', 'o1', 'o2', 'pq', 'pb', 'pc']);
    g.dur *= (2.6 + 1.05 * 2) / 8; // one drag, but finding the pair takes a moment of thought
    const [p, q] = P0.pair, NS = 22;
    // the two notes sit under the terms they check: the product under the last number, the sum under the middle term
    const spot = (id, n, right) => { const b = M.box(g, id), w = M.lay(n, NS).w; let x = b ? b.x : 180; x = right ? Math.min(x, 350 - w / 2) : x; return { x, w }; };
    M.play(g, {
      moves(g) {
        if (S.done) return [];
        return [{ drag: 'k' + P0.ri, to: ['s1', 's2', 'ans', 'p1', 'p2'], area: [8, 262, 352, 362], busy: 0.1, askAt: 1.0 * T, after: 1.1 * T,
          ask: { v: P0.b, wrong: [P0.c, p - q, q - p, P0.b + 1] },
          then(g) { S.done = true; M.show(g, 1.0 * T); S.point = true; hop(g, 'think'); const bub = { ...M.box(g, 'k' + P0.ri) }; M.node(g, 'k' + P0.ri).hide = true; g.sfx('splash');
            g.burst(bub.x, bub.y, ['#bfe8ff', '#fff'], 16, 150); S.popAt = { t: g.t, x: bub.x, y: bub.y };
            // the product: the pair floats up under the last number, and "= c" writes itself
            S.prd = M.row(sn(p), M.op('·'), sn(q), M.op('=', 'pe'), M.num(P0.c, 'pv')); S.prd.id = 'prd';
            const at = spot('pc', S.prd, true); M.place(g, 'prd', S.prd, at.x, NY, NS, { col: PRD }); S.prd.alpha = 0; S.prdX = at;
            M.fly(g, { node: M.row(sn(p), M.op('·'), sn(q)), from: [bub.x, bub.y], to: [at.x - at.w / 2 + M.lay(M.row(sn(p), M.op('·'), sn(q)), NS).w / 2, NY - 7], dur: 0.38 * T, arc: 40, s0: 30, s1: NS, col: PRD,
              then(g) { S.prd.alpha = 1; for (const n of S.prd.items.slice(3)) n.alpha = 0; g.sfx('pop'); } });
            M.circle(g, 'pc', { col: PRD, dur: 0.45 * T, delay: 0.25 * T });
            M.at(g, [[0.42 * T, g => { for (const n of S.prd.items.slice(3)) { n.alpha = 1; M.writeIn(g, n, { dur: 0.2 * T }); } g.sfx('tap'); }],
              [0.62 * T, g => { M.indicate(g, 'pc', { col: PRD, sc: 1.18, dur: 0.35 * T }); M.indicate(g, 'pv', { col: PRD, sc: 1.3, dur: 0.35 * T }); g.sfx('ding'); hop(g); }],
              // the sum: the same two numbers slide over under the middle term
              [0.7 * T, g => { S.sum = M.row(M.num(p, 'np'), M.op(q < 0 ? '-' : '+'), M.num(Math.abs(q), 'nq'), M.op('='), M.num(P0.b, 'sv', { alpha: 0 })); S.sum.id = 'sum';
                const w = M.lay(S.sum, NS).w, pb = M.box(g, 'prd'); let x = (M.box(g, 'pb') || { x: 160 }).x; if (pb) x = Math.min(x, pb.x - pb.w / 2 - 26 - w / 2); x = Math.max(x, 8 + w / 2);
                M.place(g, 'sum', S.sum, x, NY, NS, { col: SUM }); S.sum.items.slice(0, 4).forEach(n => { n._born = -1; }); M.writeIn(g, M.row(...S.sum.items.slice(0, 4)), { dur: 0.25 * T });
                S.sum.items.slice(0, 4).forEach((n, i) => M.writeIn(g, n, { delay: i * 0.05 * T, dur: 0.12 * T }));
                M.circle(g, 'pb', { col: SUM, dur: 0.4 * T }); g.sfx('swoosh'); }]]); },
          resolve(g) { M.show(g, 1.1 * T); const sv = M.node(g, 'sv'); sv.alpha = 1; M.writeIn(g, sv, { dur: 0.2 * T }); g.sfx('ding');
            M.indicate(g, 'pb', { col: SUM, sc: 1.18, delay: 0.15 * T, dur: 0.35 * T }); M.indicate(g, sv, { col: SUM, sc: 1.3, delay: 0.15 * T, dur: 0.35 * T }); hop(g);
            // the two numbers fly down into the brackets; a negative one turns its + into a −
            M.at(g, [[0.45 * T, g => { [['np', 1, p], ['nq', 2, q]].forEach(([id, k, v], i) => { const b = M.box(g, id) || M.box(g, 'sum');
                M.fly(g, { node: M.num(Math.abs(v)), from: [b.x, b.y], to: 's' + k, delay: i * 0.12 * T, dur: 0.36 * T, arc: 30, s0: NS, s1: 40, col: GOLD,
                  then(g) { const s = M.node(g, 's' + k), o = M.node(g, 'o' + k); s.fill = M.num(Math.abs(v), null, { col: GOLD, _born: -1 }); s.pop = g.t; if (v < 0) { o.v = '−'; o.pop = g.t; }
                    M.relayout(g, 'ans'); M.sparkle(g, 's' + k, { n: 8, cols: [GOLD, '#fff'] }); g.sfx('pop'); hop(g); } }); }); }],
              [0.8 * T, g => { M.tween(g, S.prd, { alpha: 0 }, 0.25 * T); M.tween(g, S.sum, { alpha: 0 }, 0.25 * T); }],
              [1.0 * T, g => { const b = M.box(g, 'ans'); if (b) g.burst(b.x, b.y, ['#bfe8ff', '#fff', GOLD], 16, 150); g.sfx('chime'); hop(g, 'laugh'); S.point = false; }]]); } }];
      },
      area(g) { return ['k' + P0.ri, 's1']; },
    });
  },
  update(g, dt) { M.update(g, dt); const S = g.s, K = S.mk;
    // a wrong bubble: its sum writes itself beside it in red, and it is not the middle number
    if (K.missAt !== S.seenMiss && K.missAt > 0 && (S.seenMiss = K.missAt) && K.missInfo && K.missInfo.drag && /^k\d$/.test(K.missInfo.drag)) { const [u, v] = S.p.list[+K.missInfo.drag[1]];
      M.note(g, { node: M.row(M.num(u), M.op(v < 0 ? '-' : '+'), M.num(Math.abs(v)), M.op('='), M.num(u + v), M.txt(' ≠ '), M.num(S.p.b)), at: K.missInfo.drag, off: [0, -46], s: 20, col: '#ff8a9a', write: 0.25, hold: 0.45, fade: 0.25 }); }
    for (let i = 0; i < 4; i++) { const n = M.node(g, 'k' + i); if (n) n.dy = Math.sin(g.t * 1.7 + i * 1.9) * 3; } },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t; SCN.bg(g, c, 'reef');
    // a calm patch of deep water behind the writing
    c.save(); const gr = c.createRadialGradient(180, 290, 20, 180, 290, 200); gr.addColorStop(0, 'rgba(4,24,52,0.55)'); gr.addColorStop(1, 'rgba(4,24,52,0)'); c.fillStyle = gr; c.fillRect(0, 160, 360, 270); c.restore();
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'ans'); M.drawEx(g, c, 'prd'); M.drawEx(g, c, 'sum');
    // the factor pairs, each in its own bubble
    S.p.list.forEach((_, i) => {
      const n = M.node(g, 'k' + i), b = M.box(g, 'k' + i); if (!n || n.hide || !b) return;
      const dragging = g.s.mk.press && g.s.mk.press.dragging && g.s.mk.press.id === 'k' + i, x = b.x, y = b.y + (n.dy || 0), r = Math.max(b.w / 2 + 16, 36), ry = 33;
      c.save(); if (dragging) c.globalAlpha = 0.3;
      const bg = c.createRadialGradient(x - r * 0.35, y - ry * 0.4, 2, x, y, r); bg.addColorStop(0, 'rgba(220,250,255,0.5)'); bg.addColorStop(0.7, 'rgba(120,200,240,0.18)'); bg.addColorStop(1, 'rgba(180,235,255,0.42)');
      c.fillStyle = bg; c.beginPath(); c.ellipse(x, y, r, ry, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(220,250,255,0.75)'; c.lineWidth = 2; c.stroke();
      c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 3; c.beginPath(); c.ellipse(x, y, r * 0.78, ry * 0.72, 0, 3.6, 4.4); c.stroke(); c.restore();
      M.drawEx(g, c, 'k' + i);
    });
    // tiny fish darting past
    for (let k = 0; k < 3; k++) { const x = ((t * (30 + k * 12) + k * 150) % 460) - 50, y = 560 + k * 18 + Math.sin(t * 2 + k) * 4; c.fillStyle = ['#ffb04a', '#ff7a9a', '#ffe06a'][k]; c.beginPath(); c.ellipse(x, y, 9, 4.5, 0, 0, 7); c.fill(); c.beginPath(); c.moveTo(x - 7, y); c.lineTo(x - 14, y - 5); c.lineTo(x - 14, y + 5); c.fill(); }
    host(g, c, 'octopus', 304, 612, 1.15, -1);
    M.drawUI(g, c);
  },
});
