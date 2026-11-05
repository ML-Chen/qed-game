// calc_power.js — POWER RULE! Differentiate a polynomial term by term: d/dx (a·xⁿ) = n·a·xⁿ⁻¹.
// The working line under the problem starts as a copy of the polynomial. For each term the player drags the exponent
// onto the coefficient (the term becomes (n · a) x^(n − 1)), then taps n · a to multiply and taps n − 1 to subtract,
// in either order. Nothing waits on an animation. Terms can be done in any order. A constant term is tapped: it becomes 0.
// Level 0: one term. Level 1: two terms. Level 2: three terms, with a constant or a plain x term mixed in.
// Medium mode: each tap on n · a or n − 1 opens a tray to pick the result.
const M = MK, INK2 = '#fff6dc'; // light ink for the parts that float on the water
function pickTerms(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  const count = L === 0 ? 1 : L === 1 ? 2 : 3, used = new Set(), terms = [];
  while (terms.length < count) {
    const n = L === 0 ? 2 + r(3) : 2 + r(5); if (used.has(n)) continue; used.add(n);
    terms.push({ a: L === 0 ? 2 + r(3) : 2 + r(6), n });
  }
  terms.sort((p, q) => q.n - p.n);
  if (L === 2) terms[terms.length - 1] = g.rand() < 0.5 ? { a: 2 + r(8), n: 0 } : { a: 2 + r(8), n: 1 };
  return terms;
}
// a pond seen from straight above: deep teal water, reeds and stones at the banks, scattered pads and petals
function pond(c, W, H) {
  const gr = c.createRadialGradient(180, 360, 40, 180, 360, 460); gr.addColorStop(0, '#2f9a9a'); gr.addColorStop(0.6, '#1f6f80'); gr.addColorStop(1, '#123e5a');
  c.fillStyle = gr; c.fillRect(0, 0, W, H);
  const R = P.rng ? null : null; let sd = 7; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  // sandy banks with stones in the corners
  c.fillStyle = '#c8b27a'; for (const [x, y, r] of [[-30, -20, 120], [400, 40, 90], [-40, 680, 140], [390, 660, 110]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  c.fillStyle = '#9ab070'; for (const [x, y, r] of [[-30, -20, 100], [400, 40, 72], [-40, 680, 122], [390, 660, 92]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  for (let k = 0; k < 14; k++) { const x = rnd() < 0.5 ? rnd() * 70 : 290 + rnd() * 70, y = rnd() < 0.5 ? rnd() * 90 : 560 + rnd() * 80, r = 6 + rnd() * 10;
    c.fillStyle = ['#8a8a96', '#a8a2a0', '#7a7a88'][k % 3]; c.beginPath(); c.ellipse(x, y, r, r * 0.75, rnd() * 3, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.25)'; c.beginPath(); c.ellipse(x - r * 0.3, y - r * 0.3, r * 0.35, r * 0.2, 0, 0, 7); c.fill(); }
  // reeds poking up from the banks
  c.lineCap = 'round'; for (let k = 0; k < 40; k++) { const left = k % 2, bx = left ? rnd() * 50 : 310 + rnd() * 50, by = rnd() < 0.5 ? 20 + rnd() * 120 : 500 + rnd() * 130;
    c.strokeStyle = ['#4a7a3a', '#5e9a48', '#3a6430'][k % 3]; c.lineWidth = 3; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + (rnd() - 0.5) * 22, by - 14 - rnd() * 16); c.stroke(); }
  // little decorative lily pads and floating petals
  for (const [x, y, r] of [[40, 220, 22], [326, 250, 18], [30, 470, 26], [330, 520, 20], [300, 160, 14]]) pad(c, x, y, r, 0.3);
  for (let k = 0; k < 18; k++) { c.fillStyle = k % 3 ? 'rgba(255,190,210,0.8)' : 'rgba(255,240,200,0.8)'; c.beginPath(); c.ellipse(60 + rnd() * 240, 120 + rnd() * 460, 3, 1.6, rnd() * 3, 0, 7); c.fill(); }
}
// a lily pad seen from above, with its notch and veins; r is the radius
function pad(c, x, y, r, rot, light) {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.fillStyle = 'rgba(8,40,50,0.35)'; c.beginPath(); c.ellipse(3, 4, r, r * 0.92, 0, 0, 7); c.fill();
  const g = c.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r); g.addColorStop(0, light ? '#d8f4a8' : '#a8dc70'); g.addColorStop(1, light ? '#8cc860' : '#5a9a40');
  c.fillStyle = g; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r, 0.22, Math.PI * 2 - 0.22); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(40,90,30,0.45)'; c.lineWidth = 1.2; for (let k = 0; k < 7; k++) { const a = 0.5 + k * 0.8; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85); c.stroke(); }
  c.strokeStyle = 'rgba(30,70,25,0.6)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r, 0.22, Math.PI * 2 - 0.22); c.closePath(); c.stroke();
  c.restore();
}
// koi gliding under the water
function koi(c, x, y, a, s, col) {
  c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s); c.globalAlpha = 0.85;
  c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, 16, 6, 0, 0, 7); c.fill();
  c.beginPath(); c.moveTo(-14, 0); c.lineTo(-26, -7); c.lineTo(-23, 0); c.lineTo(-26, 7); c.closePath(); c.fill();
  c.fillStyle = '#fff6ea'; c.beginPath(); c.ellipse(4, -1, 5, 3, 0.3, 0, 7); c.fill(); c.restore();
}

MG.add({
  id: 'power', stage: 'derivs', cmd: 'POWER RULE!', hint: 'drag', time: 8, mood: 'bright', winText: 'Derived!', hold: 1.4,
  card: {
    title: 'The power rule', ref: 'Grade 11 and up', kind: 'Calculus',
    text: 'The derivative of a formula tells you how fast its value changes as x changes. The power rule is a shortcut for finding the derivative of x raised to a power, such as x⁴. The power is the small raised number.\n\nTo use the rule, move the power down in front of x and multiply it by the number that is already there. Then make the power one smaller. For example, the derivative of 3x⁴ is 4 × 3 × x³, which is 12x³.\n\nA number on its own, such as 7, never changes, so its derivative is 0.\n\nHere is why the rule works for x². Picture a square whose sides are x long, so its area is x². When each side grows by a tiny amount, the square gains a thin strip along the top and a thin strip along one side, and each strip is x long. So the area grows 2x times as fast as the sides do, and the derivative of x² is 2x.',
    note: 'Move the power down and multiply it by the number in front of x. Then make the power one smaller. Do this for each term separately.',
    ask: 'What is the derivative of x⁵? What is the derivative of 2x³ + 7?',
  },

  init(g) {
    const S = g.s; M.setup(g); S.terms = pickTerms(g);
    // the problem (not interactive) and the working line, where every term's parts have ids
    const shown = S.terms.flatMap((t, i) => [i ? M.op('+') : null, t.n === 0 ? M.num(t.a) : M.row(M.num(t.a), t.n === 1 ? M.vr('x') : M.sup(M.vr('x'), M.num(t.n)))]);
    S.prob = M.row(M.ddx('x', 'ddx'), M.paren(M.row(...shown), 'body'));
    S.terms.forEach((t, i) => {
      t.node = t.n === 0 ? M.row(M.num(t.a, 'c' + i)) : M.row(M.num(t.a, 'a' + i), M.gap(7), M.sup(M.vr('x', 'x' + i, { col: INK2 }), M.num(t.n, 'n' + i)));
    });
    S.work = M.row(M.op('=', 'eq', { col: INK2 }), M.gap(8), ...S.terms.flatMap((t, i) => [i ? M.gap(6) : null, i ? M.op('+', 'p' + i, { col: INK2 }) : null, i ? M.gap(6) : null, t.node]));
    const many = S.terms.length > 2;
    M.place(g, 'prob', S.prob, 180, 238, many ? 30 : 36, { col: '#fff6e0' }); M.place(g, 'work', S.work, 180, 372, many ? 36 : 50);
    M.inert(g, ['eq', 'ddx', 'body', ...S.terms.map((t, i) => 'p' + i)]);
    // time scales with the number of moves: three per term (drag, multiply, subtract), one per constant
    const nMoves = S.terms.reduce((k, t) => k + (t.n === 0 ? 1 : 3), 0); g.dur *= (2.6 + 1.05 * nMoves) / 8;
    S.frog = { hopT: -9 };
    const burst = (g, k, i) => { const b = M.box(g, 'm' + i); if (b) g.burst(b.x, b.y, ['#ffd45a', '#7ad0ff', '#fff'], 10, 120); };
    const relay = () => M.place(g, 'work', S.work, 180, 372, many ? 36 : 50);
    M.play(g, {
      moves(g) {
        const out = [];
        S.terms.forEach((t, i) => {
          if (t.n === 0) { if (!t.done) out.push({ tap: 'c' + i, busy: 0.1, then(g) { t.done = true; const n = M.node(g, 'c' + i); n.v = '0'; n.pop = g.t; g.sfx('shrink'); n.alpha = 0.45; } }); return; }
          if (!t.down) out.push({
            // drag the exponent onto the coefficient: the term becomes (n · a) x^(n − 1), waiting to be computed
            drag: 'n' + i, to: 'a' + i, busy: 0.1,
            then(g) {
              t.down = true; S.frog.hopT = g.t; g.sfx('ribbit');
              t.mul = M.row(M.num(t.n, null, { col: '#2a7ab0', pop: g.t }), M.op('·'), M.num(t.a, null, { pop: g.t })); t.mul.id = 'm' + i;
              t.sub = M.row(M.num(t.n, null, { col: '#2a7ab0' }), M.op('-'), M.num(1)); t.sub.id = 's' + i;
              t.node.items[0] = t.mul; t.node.items[2].exp = t.sub; relay();
            },
          });
          else {
            // two taps, in either order: multiply, and lower the power
            if (!t.mulDone) out.push({ tap: 'm' + i, busy: 0.1, askAt: 0, after: 0.1, ask: { v: t.a * t.n, wrong: [t.a + t.n, t.a * (t.n - 1), t.a * t.n + t.a, t.a * t.n - 1, t.n] },
              then(g) { t.mulDone = true; }, resolve(g) { t.node.items[0] = M.num(t.a * t.n, 'r' + i, { pop: g.t }); M.inert(g, ['r' + i]); g.sfx('coin'); burst(g, 'a', i); relay(); } });
            if (!t.subDone) out.push({ tap: 's' + i, busy: 0.1, askAt: 0, after: 0.1, ask: { v: t.n - 1, wrong: [t.n, t.n + 1, t.n - 2] },
              then(g) { t.subDone = true; }, resolve(g) { const n1 = t.n - 1; t.node.items[2] = n1 === 1 ? M.vr('x', 'xr' + i, { pop: g.t, col: INK2 }) : M.sup(M.vr('x', 'xr' + i, { col: INK2 }), M.num(n1, 'e' + i, { pop: g.t })); M.inert(g, ['e' + i, 'xr' + i]); g.sfx('pop'); relay(); } });
          }
        });
        return out;
      },
      area(g) { const i = S.terms.findIndex(q => q.n === 0 ? !q.done : !(q.mulDone && q.subDone)); if (i < 0) return null; const t = S.terms[i]; return t.n === 0 ? 'c' + i : !t.down ? ['a' + i, 'n' + i] : [!t.mulDone ? 'm' + i : 's' + i]; },
      onMiss(g) { S.frog.sadAt = g.t; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t; c.drawImage(g.bake('calc_pond_top', pond), 0, 0, W, H);
    // light playing on the water, and koi circling under the pads
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 6; k++) { const x = 180 + Math.sin(t * 0.3 + k * 1.7) * 140, y = 360 + Math.cos(t * 0.23 + k * 2.3) * 220, r = 60 + 20 * Math.sin(t + k);
      const gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(120,220,210,0.10)'); gr.addColorStop(1, 'rgba(120,220,210,0)'); c.fillStyle = gr; c.fillRect(x - r, y - r, r * 2, r * 2); }
    c.restore();
    for (const [k, col] of [[0, '#ff8a3a'], [1, '#fff0e0'], [2, '#e8503a']]) { const a = t * 0.35 + k * 2.1, x = 180 + Math.cos(a) * (120 - k * 18), y = 400 + Math.sin(a) * (170 - k * 25); koi(c, x, y, a + Math.PI / 2, 1 - k * 0.12, col); }
    // the problem, painted on a floating plank
    const pb = M.box(g, 'body'), dd = M.box(g, 'ddx');
    if (pb && dd) { const x0 = dd.x - dd.w / 2 - 22, x1 = pb.x + pb.w / 2 + 22, y0 = 238 - 46, h = 64, bob = Math.sin(t * 1.3) * 1.5;
      c.save(); c.translate(0, bob); c.fillStyle = 'rgba(8,40,50,0.35)'; c.beginPath(); c.roundRect(x0 + 4, y0 + 6, x1 - x0, h, 10); c.fill();
      const wg = c.createLinearGradient(0, y0, 0, y0 + h); wg.addColorStop(0, '#b07a48'); wg.addColorStop(1, '#7a4e2a'); c.fillStyle = wg; c.beginPath(); c.roundRect(x0, y0, x1 - x0, h, 10); c.fill();
      c.strokeStyle = 'rgba(60,30,10,0.35)'; c.lineWidth = 1.5; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(x0 + 8, y0 + k * h / 4); c.bezierCurveTo(x0 + 80, y0 + k * h / 4 + 3, x1 - 80, y0 + k * h / 4 - 3, x1 - 8, y0 + k * h / 4); c.stroke(); }
      c.restore(); }
    M.drawEx(g, c, 'prob');
    // every number of the working line sits on its own lily pad
    const padIds = []; (function walk(n) { if (!n) return; if (n.id && /^[acnmsre]\d$/.test(n.id)) padIds.push(n.id); if (n.id && /^[ms]\d$/.test(n.id)) return; for (const ch of [n.base, n.exp, n.n, n.d, n.inner, ...(n.items || [])]) walk(ch); })(S.work);
    for (const id of padIds) {
      const b = M.box(g, id), n = M.node(g, id); if (!b || !n || n.hide) continue;
      const small = /^(n|s|e)/.test(id), r = Math.max(b.w * 0.9, b.h) / 2 + (small ? 6 : 9), k = +id.slice(-1) || 0;
      pad(c, b.x, b.y + Math.sin(t * 1.6 + k) * 1.2, r, 0.6 + k * 1.3 + (small ? 2 : 0), small);
    }
    // ripples where the frog sits
    for (let i = 0; i < 3; i++) { const k = ((t * 0.4 + i / 3) % 1); c.strokeStyle = `rgba(255,255,255,${0.3 * (1 - k)})`; c.lineWidth = 2; c.beginPath(); c.ellipse(180, 532, 40 + k * 70, (40 + k * 70) * 0.8, 0, 0, 7); c.stroke(); }
    pad(c, 180, 534, 52, 2.2, false);
    M.drawEx(g, c, 'work');
    const f = S.frog, hk = (t - f.hopT) / 0.5, hop = hk >= 0 && hk <= 1 ? Math.sin(hk * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    try { if (typeof ANI !== 'undefined') ANI.draw(c, 'frog', 180, 556 - hop * 50, 1.5, { t, pose: won ? 'cheer' : hop > 0 ? 'hop' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'happy' }); else P.sheep(c, 180, 556 - hop * 50, 1.1, { t }); } catch (e) { P.sheep(c, 180, 556, 1.1, { t }); }
    M.drawUI(g, c);
  },
});
