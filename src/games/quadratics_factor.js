// quadratics_factor.js — FACTOR! Factor x² + bx + c as (x + p)(x + q), where p · q = c and p + q = b.
// Under the sea: the quadratic is written on the water, and the factor pairs of c float in bubbles below it.
// The player drags the bubble whose pair adds up to b onto the brackets: its two numbers fill the brackets at once,
// and the check "p + q = b" appears under them. A bubble whose pair has the wrong sum only wobbles.
// Level 0: small positive numbers. Level 1: bigger positive numbers. Level 2: negative numbers too.
// Medium mode: after the drop the player picks the sum p + q from the tray.
const M = MK, INK = '#fff6e0';
const SLOTS = [[94, 418], [266, 418], [94, 494], [266, 494]]; // where the bubbles float
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
function poly(b, c) { return M.row(M.sup(M.vr('x'), M.num(2)), M.op(b < 0 ? '-' : '+'), Math.abs(b) === 1 ? null : M.num(Math.abs(b)), M.vr('x'), M.op(c < 0 ? '-' : '+'), M.num(Math.abs(c))); }

MG.add({
  id: 'quadratics_factor', stage: 'quadratics', cmd: 'FACTOR!', hint: 'drag', time: 9, mood: 'sea', winText: 'Factored!', hold: 1.4,
  card: {
    title: 'Factoring a quadratic', ref: 'Algebra 1', kind: 'Algebra',
    text: 'A quadratic is an expression such as x² + 5x + 6, where the highest power of x is 2. To factor it means to write it as two brackets multiplied together.\n\nWhen there is no number in front of x², look for two numbers that multiply to make the last number and add up to the middle number. For x² + 5x + 6 you need a product of 6 and a sum of 5. The pairs that make 6 are 1 · 6 and 2 · 3. Only 2 + 3 makes 5, so x² + 5x + 6 = (x + 2)(x + 3).\n\nThis works because multiplying out (x + p)(x + q) gives x² + (p + q)x + pq. The two numbers add up to the middle number and multiply to the last one.',
    note: 'To factor x² + bx + c, find two numbers p and q with p · q = c and p + q = b. Then x² + bx + c = (x + p)(x + q).',
    ask: 'Factor x² + 7x + 12. Factor x² − x − 6.',
  },
  init(g) {
    const S = g.s; M.setup(g); const P0 = S.p = pick(g);
    M.place(g, 'prob', poly(P0.b, P0.c), 180, 236, 46, { col: INK });
    const br = k => M.paren(M.row(M.vr('x'), M.op('+', 'o' + k), M.slot('s' + k, { col: '#bfe8ff' })), 'p' + k);
    S.ans = M.row(M.op('=', 'eq'), M.gap(4), br(1), br(2));
    M.place(g, 'ans', S.ans, 180, 318, 40, { col: INK });
    P0.list.forEach(([u, v], i) => { const n = M.row(sn(u), M.op('·'), sn(v)); n.id = 'k' + i; M.place(g, 'k' + i, n, SLOTS[i][0], SLOTS[i][1] + 11, 30, { col: INK }); });
    M.inert(g, ['eq', 'p1', 'p2', 'o1', 'o2']);
    g.dur *= (2.6 + 1.05 * 2) / 8; // one drag, but finding the pair takes a moment of thought
    const [p, q] = P0.pair;
    const fill = (k, v) => { const s = M.node(g, 's' + k), o = M.node(g, 'o' + k); s.fill = M.num(Math.abs(v), null, { col: '#ffe680' }); s.pop = g.t; o.v = v < 0 ? '−' : '+'; };
    M.play(g, {
      moves(g) {
        if (S.done) return [];
        return [{ drag: 'k' + P0.ri, to: ['s1', 's2'], area: [8, 262, 352, 352], busy: 0.1, askAt: 0, after: 0.1,
          ask: { v: P0.b, wrong: [P0.c, p - q, q - p, P0.b + 1] },
          then(g) { S.done = true; M.node(g, 'k' + P0.ri).hide = true; fill(1, p); fill(2, q); M.relayout(g, 'ans'); g.sfx('splash');
            const b = M.box(g, 'ans'); if (b) g.burst(b.x, b.y, ['#bfe8ff', '#fff'], 14, 140);
            S.chk = M.row(M.num(p, null, { col: '#ffe680' }), M.op(q < 0 ? '-' : '+'), M.num(Math.abs(q), null, { col: '#ffe680' }), M.op('='), M.slot('chk', { col: '#bfe8ff' }));
            M.place(g, 'chk', S.chk, 180, 372, 28, { col: INK }); M.inert(g, ['chk']); },
          resolve(g) { const n = M.node(g, 'chk'); n.fill = M.num(P0.b, null, { mark: 'good', pop: g.t }); M.relayout(g, 'chk'); g.sfx('coin'); } }];
      },
      area(g) { return ['k' + P0.ri, 's1']; },
    });
  },
  update(g, dt) { M.update(g, dt); for (let i = 0; i < 4; i++) { const n = M.node(g, 'k' + i); if (n) n.dy = Math.sin(g.t * 1.7 + i * 1.9) * 3; } },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t; SCN.bg(g, c, 'reef');
    // a calm patch of deep water behind the writing
    c.save(); const gr = c.createRadialGradient(180, 290, 20, 180, 290, 200); gr.addColorStop(0, 'rgba(4,24,52,0.55)'); gr.addColorStop(1, 'rgba(4,24,52,0)'); c.fillStyle = gr; c.fillRect(0, 170, 360, 260); c.restore();
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'ans'); M.drawEx(g, c, 'chk');
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
    SCN.host(g, c, 'octopus', 304, 612, 1.15);
    M.drawUI(g, c);
  },
});
