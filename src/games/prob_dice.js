// prob_dice.js — PROBABILITY! Two dice: P(event) = favourable outcomes / all 36 outcomes, then simplify.
// A duck-pond stall at a night fair. The stall's painted sign reads P(sum = 7) = ?/?, and under it a shelf of 6 × 6
// cubbies holds every outcome (first die across, second die down, the sum painted in each cubby).
// Moves (nothing waits on an animation):
//   1. tap the event (the 7): the matching cubbies light in one quick ripple along their diagonal, a rubber duck pops
//      up in each, and a red balloon inflates with the count (6) on it;
//   2. drag the balloon's 6 into the top slot, and 3. drag the 36 (the gold balloon on the "6 × 6 = 36" plank, or the
//      whole shelf) into the bottom slot, in either order;
//   4. tap the fraction: top and bottom get "÷ 6" (their common factor); 5./6. tap "6 ÷ 6" → 1 and "36 ÷ 6" → 6, in
//      either order. When nothing divides both (5/36, 11/36), one tap stamps the fraction as already in simplest form.
// The classic mistake (the count on the bottom, or 36 on top) is a miss from level 1 up, acted out on the sign.
// Level 0: sum 7, 6 or 8. Level 1: any sum from 3 to 11. Level 2: sum ≥ 10, sum ≤ 4, doubles, or at least one 6.
// Medium mode: the tray asks for the number of lit cubbies, then each division (or the simplest form).
const M = MK;
const GX = 88, GY = 314, CS = 28, RX = 312, RY = 360, PY = 252, LBY = 517; // shelf cubbies' top-left, cubby size, balloon, rows
const INKC = '#fff2d6', GOLD = '#ffd86a', ORANGE = '#ff9a3a', RED_DIE = '#e2483e', BLUE_DIE = '#3a78d6';
const gcd = (a, b) => b ? gcd(b, a % b) : a;

// ---------------- the event ----------------
function sumEvent(k) { const cells = []; for (let a = 1; a <= 6; a++) { const b = k - a; if (b >= 1 && b <= 6) cells.push([a, b]); } return { kind: 'sum', k, cells }; }
function pickEvent(g) {
  const r = n => Math.floor(g.rand() * n);
  if (g.level === 0) return sumEvent([7, 6, 7, 8][r(4)]); // 7 (which simplifies to 1/6) comes up half the time
  if (g.level === 1) return sumEvent(3 + r(9));
  const all = []; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) all.push([a, b]);
  const bySum = (p, q) => (p[0] + p[1]) - (q[0] + q[1]) || p[0] - q[0];
  const kinds = [
    () => ({ kind: 'ge', k: 10, cells: all.filter(([a, b]) => a + b >= 10).sort(bySum) }),
    () => ({ kind: 'le', k: 4, cells: all.filter(([a, b]) => a + b <= 4).sort(bySum) }),
    () => ({ kind: 'dbl', cells: [1, 2, 3, 4, 5, 6].map(i => [i, i]) }),
    // the first die's 6 column top to bottom, then the second die's 6 row (6,6 is counted once)
    () => ({ kind: 'six', cells: [...[1, 2, 3, 4, 5, 6].map(b => [6, b]), ...[1, 2, 3, 4, 5].map(a => [a, 6])] }),
  ];
  return kinds[r(kinds.length)]();
}
function eventParts(E) {
  if (E.kind === 'sum') return [M.txt('sum', 'sw'), M.op('=', 'eqs'), M.num(E.k, 'ev')];
  if (E.kind === 'ge') return [M.txt('sum', 'sw'), M.op('≥', 'eqs'), M.num(E.k, 'ev')];
  if (E.kind === 'le') return [M.txt('sum', 'sw'), M.op('≤', 'eqs'), M.num(E.k, 'ev')];
  if (E.kind === 'dbl') return [M.txt('doubles', 'ev')];
  return [M.txt('at least one', 'sw'), M.gap(6), M.num(6, 'ev')];
}
// wrong counts for the medium tray: off by one, or counted twice; "at least one 6" is classically counted as 12 (6,6 twice)
function wrongCounts(E, n) { return (E.kind === 'six' ? [12, 10, 6] : [n + 1, n - 1, n * 2]).filter(v => v > 0 && v !== n); }
// wrong answers for "is n/36 already in simplest form?": only the bottom divided, upside down, or rounded to "1 in something"
function wrongFracs(n) { const list = [[n, 6], [36, n], [1, Math.round(36 / n)]]; return list.filter(([p, q]) => p * 36 !== q * n).map(([p, q]) => M.frac(M.num(p), M.num(q))); }

// ---------------- painting ----------------
// a rubber duck floating with its waterline at (x, y); s = 1 is about 44 px long
function rDuck(c, x, y, s, o = {}) {
  const col = o.col || '#ffd23a', dk = P.shade(col, -0.22), lt = P.shade(col, 0.45), face = o.facing || 1;
  c.save(); c.translate(x, y); c.scale(s * face, s); if (o.rot) c.rotate(o.rot);
  c.lineJoin = 'round'; c.lineWidth = 2; c.strokeStyle = P.shade(col, -0.45);
  c.beginPath(); c.moveTo(-21, -21); c.quadraticCurveTo(-18, -12, -19, -7); c.quadraticCurveTo(-17, 0, -6, 0); c.lineTo(10, 0);
  c.quadraticCurveTo(21, -1, 21, -11); c.quadraticCurveTo(20, -17, 12, -17); c.quadraticCurveTo(0, -18, -9, -14); c.quadraticCurveTo(-15, -14, -21, -21); c.closePath();
  const gr = c.createLinearGradient(0, -20, 0, 0); gr.addColorStop(0, lt); gr.addColorStop(0.5, col); gr.addColorStop(1, dk); c.fillStyle = gr; c.fill(); c.stroke();
  c.fillStyle = dk; c.beginPath(); const fl = o.flap ? Math.sin(o.flap) * 6 : 0; c.moveTo(-10, -11); c.quadraticCurveTo(-2, -15 - fl, 6, -10 - fl * 0.6); c.quadraticCurveTo(-1, -4, -10, -11); c.fill();
  const hy = -28 + (o.headBob || 0); c.beginPath(); c.arc(8, hy, 9.5, 0, 7); const hg = c.createRadialGradient(5, hy - 4, 1, 8, hy, 10); hg.addColorStop(0, lt); hg.addColorStop(1, col); c.fillStyle = hg; c.fill(); c.stroke();
  const open = o.quack ? 3.2 : 0; c.fillStyle = '#ff8a2a'; c.strokeStyle = '#b8501a'; c.lineWidth = 1.5;
  c.beginPath(); c.moveTo(15, hy - 1 - open * 0.3); c.quadraticCurveTo(25, hy - 3 - open, 25, hy - open * 0.5); c.quadraticCurveTo(20, hy + 1, 15, hy + 1); c.closePath(); c.fill(); c.stroke();
  if (open) { c.beginPath(); c.moveTo(15, hy + 1); c.quadraticCurveTo(23, hy + 1 + open * 0.4, 23, hy + 2 + open * 0.5); c.quadraticCurveTo(19, hy + 4, 15, hy + 3); c.closePath(); c.fill(); c.stroke(); }
  c.fillStyle = '#2a1430'; c.strokeStyle = '#2a1430'; c.lineWidth = 1.8; c.lineCap = 'round';
  if (o.expr === 'happy') { c.beginPath(); c.arc(10, hy - 1, 2.6, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
  else if (o.expr === 'sad') { c.beginPath(); c.arc(10, hy - 1, 2, 0, 7); c.fill(); c.beginPath(); c.moveTo(6, hy - 6); c.lineTo(12, hy - 4.5); c.stroke(); }
  else { c.beginPath(); c.arc(10, hy - 2, 2.2, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(10.8, hy - 2.8, 0.8, 0, 7); c.fill(); }
  c.fillStyle = 'rgba(255,120,120,0.35)'; c.beginPath(); c.arc(6, hy + 3, 2.4, 0, 7); c.fill();
  c.restore();
}
function host(c, x, y, s, o) {
  try { if (typeof ANI !== 'undefined' && ANI.draw) { ANI.draw(c, 'duck', x, y, s, o); return; } } catch (e) { }
  rDuck(c, x, y, s * 1.25, { expr: o.expr === 'sad' ? 'sad' : o.expr === 'laugh' ? 'happy' : null, quack: o.quack || o.pose === 'cheer', facing: o.facing, headBob: Math.sin((o.t || 0) * 3) * 1.2, flap: o.flap });
}
function die(c, x, y, sz, v, col, k = 1) {
  c.save(); c.translate(x, y); c.scale(k, k); const h = sz / 2;
  c.fillStyle = 'rgba(10,4,20,0.4)'; c.beginPath(); rr(c, -h, -h + 2, sz, sz, sz * 0.24); c.fill();
  const gr = c.createLinearGradient(0, -h, 0, h); gr.addColorStop(0, P.shade(col, 0.25)); gr.addColorStop(1, col); c.fillStyle = gr; c.beginPath(); rr(c, -h, -h, sz, sz, sz * 0.24); c.fill();
  c.strokeStyle = P.shade(col, -0.35); c.lineWidth = 1.2; c.stroke();
  const q = sz * 0.27, pr = sz * 0.095, pts = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }[v];
  c.fillStyle = '#fffaf0'; for (const [px, py] of pts) { c.beginPath(); c.arc(px * q, py * q, pr, 0, 7); c.fill(); }
  c.restore();
}
function rr(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
// where the count's balloon floats: limp on the shelf until the event is tapped, then it inflates and bobs
function balloonAt(S, t) { const inf = S.tapped ? M.ease((t - S.tapT) / 0.25) : 0; return { inf, x: RX + Math.sin(t * 1.4) * 2, y: RY + Math.sin(t * 2) * 3 * inf + (1 - inf) * 100, r: 8 + 19 * inf }; }
function bulb(c, x, y, r, on, col = '255,214,120') {
  if (on > 0.05) { const gr = c.createRadialGradient(x, y, 0, x, y, r * 4); gr.addColorStop(0, `rgba(${col},${0.45 * on})`); gr.addColorStop(1, `rgba(${col},0)`); c.fillStyle = gr; c.fillRect(x - r * 4, y - r * 4, r * 8, r * 8); }
  c.fillStyle = on > 0.5 ? '#fff6d0' : `rgba(${col},${0.35 + on * 0.5})`; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
}
function balloon(c, x, y, r, col, o = {}) {
  c.save(); c.strokeStyle = 'rgba(255,240,220,0.55)'; c.lineWidth = 1.2; if (o.string) { c.beginPath(); c.moveTo(x, y + r * 1.15); c.quadraticCurveTo(x + 8, (y + o.string[1]) / 2, o.string[0], o.string[1]); c.stroke(); }
  const gr = c.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r * 1.2); gr.addColorStop(0, P.shade(col, 0.5)); gr.addColorStop(0.55, col); gr.addColorStop(1, P.shade(col, -0.35)); c.fillStyle = gr;
  c.beginPath(); c.ellipse(x, y, r, r * 1.12, 0, 0, 7); c.fill(); c.beginPath(); c.moveTo(x - 4, y + r * 1.2); c.lineTo(x + 4, y + r * 1.2); c.lineTo(x, y + r * 1.08); c.closePath(); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.ellipse(x - r * 0.42, y - r * 0.5, r * 0.18, r * 0.3, -0.5, 0, 7); c.fill(); c.restore();
}

function night(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 200); sk.addColorStop(0, '#0e0a2a'); sk.addColorStop(0.6, '#2a1650'); sk.addColorStop(1, '#6a2a62'); c.fillStyle = sk; c.fillRect(0, 0, W, 200);
  const rnd = P.rng(11); for (let i = 0; i < 60; i++) { c.fillStyle = `rgba(255,248,230,${0.25 + rnd() * 0.6})`; c.beginPath(); c.arc(rnd() * W, rnd() * 150, 0.5 + rnd() * 1.1, 0, 7); c.fill(); }
  // moon
  const mg = c.createRadialGradient(40, 52, 4, 40, 52, 60); mg.addColorStop(0, 'rgba(255,240,200,0.35)'); mg.addColorStop(1, 'rgba(255,240,200,0)'); c.fillStyle = mg; c.fillRect(0, 0, 110, 120);
  c.fillStyle = '#fff4d8'; c.beginPath(); c.arc(40, 52, 15, 0, 7); c.fill(); c.fillStyle = '#2a1a4a'; c.beginPath(); c.arc(47, 47, 13, 0, 7); c.fill();
  // far fairground glow on the horizon
  const hz = c.createRadialGradient(180, 200, 10, 180, 200, 220); hz.addColorStop(0, 'rgba(255,150,120,0.45)'); hz.addColorStop(1, 'rgba(255,150,120,0)'); c.fillStyle = hz; c.fillRect(0, 60, W, 140);
  // the stall's back wall: dark planks lit warmly from the sign
  const wl = c.createLinearGradient(0, 180, 0, 540); wl.addColorStop(0, '#5a2a3a'); wl.addColorStop(1, '#2a1424'); c.fillStyle = wl; c.fillRect(0, 180, W, 360);
  for (let x = 0; x < W; x += 30) { c.fillStyle = 'rgba(0,0,0,0.18)'; c.fillRect(x, 180, 1.5, 360); c.fillStyle = 'rgba(255,200,160,0.05)'; c.fillRect(x + 2, 180, 3, 360); }
  const lg = c.createRadialGradient(180, 230, 20, 180, 260, 260); lg.addColorStop(0, 'rgba(255,190,110,0.28)'); lg.addColorStop(1, 'rgba(255,190,110,0)'); c.fillStyle = lg; c.fillRect(0, 180, W, 360);
  // corner posts, candy-striped
  for (const px of [0, 346]) { c.fillStyle = '#e8d8c0'; c.fillRect(px, 180, 14, 360); c.save(); c.beginPath(); c.rect(px, 180, 14, 360); c.clip(); c.fillStyle = '#b8283a'; for (let y = 170; y < 560; y += 22) { c.beginPath(); c.moveTo(px, y); c.lineTo(px + 14, y - 10); c.lineTo(px + 14, y); c.lineTo(px, y + 10); c.closePath(); c.fill(); } c.restore(); c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(px + 10, 180, 4, 360); }
  // counter, pond and the striped front panel
  c.fillStyle = '#7a4626'; c.fillRect(0, 532, W, 10); c.fillStyle = '#a8683a'; c.fillRect(0, 532, W, 3);
  const wg = c.createLinearGradient(0, 542, 0, 596); wg.addColorStop(0, '#0e2a40'); wg.addColorStop(1, '#1e5470'); c.fillStyle = wg; c.fillRect(0, 542, W, 54);
  for (let i = 0; i < 14; i++) { c.fillStyle = `rgba(255,214,120,${0.12 + (i % 3) * 0.05})`; c.beginPath(); c.ellipse(14 + i * 26, 556 + (i % 4) * 8, 9, 1.5, 0, 0, 7); c.fill(); }
  for (let i = 0; i < 12; i++) { c.fillStyle = i % 2 ? '#d8c0a0' : '#9a1e32'; c.fillRect(i * 30, 596, 30, 44); }
  const sh = c.createLinearGradient(0, 596, 0, 640); sh.addColorStop(0, 'rgba(255,200,140,0.18)'); sh.addColorStop(1, 'rgba(20,6,20,0.45)'); c.fillStyle = sh; c.fillRect(0, 596, W, 44);
  c.fillStyle = '#c89a30'; c.fillRect(0, 592, W, 6);
}

// ---------------- the microgame ----------------
MG.add({
  id: 'dice', stage: 'stats', cmd: 'PROBABILITY!', hint: 'drag', time: 8, mood: 'party', winText: 'Lucky duck!', hold: 1.4,
  card: {
    title: 'Probability', ref: 'Grade 7', kind: 'Probability',
    text: 'Probability is a number that says how likely an event is. An event is something that can happen when you roll, such as the two dice adding up to 7. An outcome is one possible roll. The outcomes that make the event happen are called favourable outcomes. P(sum = 7) means the probability that the sum is 7.\n\nWhen every outcome is equally likely, the probability of an event is the number of favourable outcomes divided by the number of all outcomes.\n\nTwo dice have 6 × 6 = 36 outcomes, because each of the 6 faces of the first die can go with each of the 6 faces of the second die. A sum of 7 has 6 favourable outcomes: 1+6, 2+5, 3+4, 4+3, 5+2 and 6+1. The rolls 3+4 and 4+3 count separately, because the two dice are different dice. So P(sum = 7) = 6/36. Dividing the top and the bottom by 6 gives 1/6.\n\nNo other sum has 6 favourable outcomes, so 7 is the most likely sum.',
    note: 'Probability = favourable outcomes ÷ all outcomes. For two dice, count the matching squares in the 6 × 6 grid, write that count over 36, and then simplify the fraction.',
    ask: 'With two dice, what is P(sum = 2)? What is P(sum = 10)?',
  },
  init(g) {
    const S = g.s; M.setup(g);
    const E = S.ev = pickEvent(g), n = S.n = E.cells.length, gg = gcd(n, 36), a = n / gg, b = 36 / gg;
    S.cells = []; for (let r = 1; r <= 6; r++) for (let q = 1; q <= 6; q++) S.cells.push({ a: q, b: r, x: GX + (q - 0.5) * CS, y: GY + (r - 0.5) * CS, litAt: -1, order: -1 });
    E.cells.forEach(([q, r], i) => { S.cells[(r - 1) * 6 + (q - 1)].order = i; });
    S.floats = []; S.hdrA = {}; S.hdrB = {}; S.quackAt = -9; S.actAt = -9; S.missAt = -9; S.tapT = -9; S.splash = [];
    // the stall's sign: P(event) = ?/?, shrunk to fit when the fraction grows
    const ps0 = 36, slotW = ps0 * 0.82 * 1.3;
    S.fracNode = M.frac(M.slot('sn', { w: slotW, col: GOLD }), M.slot('sd', { w: slotW, col: GOLD }));
    S.prob = M.row(M.vr('P', 'P'), M.paren(M.row(...eventParts(E)), 'par'), M.op('=', 'eq'), M.gap(4), S.fracNode);
    const relay = () => { const w = M.lay(S.prob, ps0).w, s = w > 292 ? Math.floor(ps0 * 292 / w) : ps0; M.place(g, 'prob', S.prob, 180, PY, s, { col: INKC }); };
    S.relay = relay; relay();
    // the plank under the shelf: 6 × 6 = 36, with the 36 on a gold balloon; the whole shelf is a zone too
    M.place(g, 'total', M.row(M.num(6, 'gw'), M.op('×', 'gx'), M.num(6, 'gh'), M.op('=', 'geq'), M.gap(4), M.num(36, 'tot', { col: '#5a2a08' })), GX + 3 * CS, LBY, 24, { col: INKC });
    M.zone(g, 'grid', { x: GX + 3 * CS, y: GY + 3 * CS, w: 6 * CS, h: 6 * CS, s: 30 });
    M.inert(g, ['par', 'eq', 'gw', 'gx', 'gh', 'geq']);
    const tapIds = ['ev', 'sw', 'eqs'].filter(id => M.node(g, id));
    // nothing waits on an animation: the cubbies light in one quick ripple (under 0.3 s) and the count appears at once
    const dt = Math.min(0.05, 0.27 / Math.max(1, n - 1));
    // time scales with the number of moves: tap the event, two drags, tap the fraction, and (when it simplifies) two divisions
    const nMoves = gg > 1 ? 6 : 4; g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const burst = (id, cols) => { const bx = M.box(g, id); if (bx) g.burst(bx.x, bx.y, cols || [GOLD, '#ff8ac0', '#fff'], 12, 130); };
    const act = (g, kind) => { S.actAt = g.t; S.act = kind; S.quackAt = g.t; for (let i = 0; i < 3; i++) S.splash.push({ x: 40 + g.rand() * 280, t0: g.t + i * 0.06 }); };
    // a drag into a slot: the number lands in the slot at once, with a pop
    const fill = (slotId, v, fillId) => {
      const sl = M.node(g, slotId); sl.fill = M.num(v, fillId, { pop: g.t }); g.sfx('coin');
      if (S.numFilled && S.denFilled) S.fracNode.id = 'fr';
      relay(); burst(slotId);
    };
    const gold = (node, t) => { node.col = GOLD; node.pop = t; return node; };
    M.play(g, {
      moves(g) {
        if (!S.tapped) return [{
          tap: tapIds, busy: 0.1, askAt: 0, after: 0.1,
          ask: { v: n, wrong: wrongCounts(E, n) },
          then(g) {
            S.tapped = true; S.tapT = g.t; g.sfx('magic'); act(g, 'quack');
            E.cells.forEach(([q, r], i) => M.later(g, i * dt, g => {
              const cl = S.cells[(r - 1) * 6 + (q - 1)]; cl.litAt = g.t; S.hdrA[q] = g.t; S.hdrB[r] = g.t; if (i % 2 === 0) g.sfx(i % 4 ? 'pop' : 'quack');
              S.floats.push({ x: cl.x, y: cl.y - 6, t0: g.t, text: E.kind === 'sum' || E.kind === 'ge' || E.kind === 'le' ? `${q}+${r}` : `${q}, ${r}` });
            }));
          },
          resolve(g) { S.counted = true; S.countAt = g.t; S.cntNode = M.num(n, 'cnt', { pop: g.t }); const bl = balloonAt(S, g.t); M.place(g, 'cnt', S.cntNode, bl.x, bl.y + 11, 32 * Math.max(0.3, bl.inf), { col: INKC }); g.sfx('ding'); M.later(g, 0.22, g => burst('cnt', ['#ff6070', GOLD, '#fff'])); },
        }];
        const out = [];
        if (!S.counted) return out;
        if (!S.numFilled) out.push({ drag: 'cnt', to: 'sn', busy: 0.1, then(g) { S.numFilled = true; S.popAt = g.t; g.sfx('snap'); M.node(g, 'cnt').hide = true; act(g, 'flap'); fill('sn', n, 'fn'); } });
        if (!S.denFilled) out.push({ drag: ['tot', 'grid'], to: 'sd', busy: 0.1, then(g) { S.denFilled = true; S.totAt = g.t; const tn = M.node(g, 'tot'); tn.alpha = 0.35; M.inert(g, ['tot']); act(g, 'flap'); fill('sd', 36, 'fd'); } });
        if (out.length || S.simplified) return out;
        if (gg === 1) return [{
          // nothing divides both 5 and 36 (or 11 and 36): one tap stamps the fraction as already in simplest form
          tap: ['fr', 'fn', 'fd', 'sn', 'sd'], busy: 0.1, askAt: 0, after: 0.1,
          ask: { v: M.frac(M.num(n), M.num(36)), wrong: wrongFracs(n) },
          then(g) { S.split = true; g.sfx('magic'); act(g, 'quack'); },
          resolve(g) { S.simplified = true; S.doneT = g.t; gold(S.fracNode.n, g.t); gold(S.fracNode.d, g.t); S.fracNode.col = GOLD; relay(); g.sfx('sparkle'); burst('fr'); },
        }];
        if (!S.split) return [{
          // tap the fraction: top and bottom are both divided by their common factor
          tap: ['fr', 'fn', 'fd', 'sn', 'sd'], busy: 0.1,
          then(g) {
            S.split = true; g.sfx('whoosh'); S.fracNode.id = null; act(g, 'quack');
            const f = () => M.num(gg, null, { col: ORANGE, pop: g.t });
            S.fracNode.n = M.row(M.num(n, 'fn'), M.op('÷', null, { col: ORANGE }), f()); S.fracNode.n.id = 'dn';
            S.fracNode.d = M.row(M.num(36, 'fd'), M.op('÷', null, { col: ORANGE }), f()); S.fracNode.d.id = 'dd';
            relay();
          },
        }];
        const done = g => { act(g, 'quack'); if (S.topDone && S.botDone) { S.simplified = true; S.doneT = g.t; S.fracNode.col = GOLD; relay(); } };
        if (!S.topDone) out.push({ tap: ['dn', 'fn'], busy: 0.1, askAt: 0, after: 0.1, ask: { v: a, wrong: [n, 0, a + 1, gg] },
          then(g) { S.topDone = true; }, resolve(g) { S.fracNode.n = gold(M.num(a, 'fn'), g.t); g.sfx('coin'); done(g); relay(); burst('fn'); } });
        if (!S.botDone) out.push({ tap: ['dd', 'fd'], busy: 0.1, askAt: 0, after: 0.1, ask: { v: b, wrong: [b + 1, b - 1, 36 - gg] },
          then(g) { S.botDone = true; }, resolve(g) { S.fracNode.d = gold(M.num(b, 'fd'), g.t); g.sfx('coin'); done(g); relay(); burst('fd'); } });
        return out;
      },
      area(g) {
        if (!S.tapped) return tapIds;
        if (!S.numFilled) return ['cnt', 'sn'];
        if (!S.denFilled) return ['tot', 'sd'];
        if (!S.split) return ['fr'];
        return [!S.topDone ? 'dn' : 'dd'];
      },
      onMiss(g, info) {
        S.missAt = g.t; S.missInfo = info;
        if (info.drag && (info.to === 'sn' || info.to === 'sd')) {
          // act it out: the number lands in the wrong place, in red, and the sign swings on its hooks
          const sl = M.node(g, info.to); if (sl) { sl.fill = M.num(info.drag === 'cnt' ? n : 36, null, { mark: 'bad', pop: g.t }); relay(); }
          S.flipAt = g.t;
        }
        if (info.tap === 'grid' && S.lastUp) { const [x, y] = S.lastUp; const cl = S.cells.find(q => Math.abs(q.x - x) <= CS / 2 && Math.abs(q.y - y) <= CS / 2); if (cl) cl.badAt = g.t; }
      },
      onWin(g) { S.winAt = g.t; },
    });
  },
  update(g, dt) {
    M.update(g, dt); const S = g.s, t = g.t;
    S.floats = S.floats.filter(f => t - f.t0 < 0.9); S.splash = S.splash.filter(p => t - p.t0 < 0.8);
    // the count rides on its bobbing balloon
    if (S.counted && !S.numFilled) { const bl = balloonAt(S, t); M.place(g, 'cnt', S.cntNode, bl.x, bl.y + 11, 32 * Math.max(0.3, bl.inf), { col: INKC }); }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { g.s.lastUp = [x, y]; M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, MKs = g.s.mk, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    c.drawImage(g.bake('prob_dice_night', night), 0, 0, W, H);
    for (let i = 0; i < 8; i++) { const k = 0.5 + 0.5 * Math.sin(t * 2 + i * 2.3); c.fillStyle = `rgba(255,250,230,${0.2 + k * 0.6})`; c.beginPath(); c.arc((i * 47 + 20) % 360, 18 + (i * 37) % 120, 0.8 + k, 0, 7); c.fill(); }
    // carousel on the left, glowing and turning
    { const cx = 70, cy = 128; c.save();
      const gl = c.createRadialGradient(cx, cy + 20, 5, cx, cy + 20, 90); gl.addColorStop(0, 'rgba(255,170,90,0.5)'); gl.addColorStop(1, 'rgba(255,170,90,0)'); c.fillStyle = gl; c.fillRect(cx - 90, cy - 70, 180, 160);
      c.fillStyle = '#2a1030'; c.fillRect(cx - 50, cy + 14, 100, 50);
      for (let i = 0; i < 5; i++) { const a = t * 0.9 + i * 1.2566, x = cx + Math.sin(a) * 40, front = Math.cos(a) > 0, y = cy + 34 + Math.sin(t * 3 + i) * 4; if (!front) continue;
        c.strokeStyle = '#e8c070'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, cy + 10); c.lineTo(x, cy + 60); c.stroke(); c.fillStyle = ['#fff0e0', '#ffd0e0', '#d0e8ff', '#fff0b0', '#e0d0ff'][i]; c.beginPath(); c.ellipse(x, y, 9, 5, 0, 0, 7); c.fill(); c.beginPath(); c.arc(x + 7, y - 5, 3.5, 0, 7); c.fill(); }
      c.fillStyle = '#c8304a'; c.beginPath(); c.moveTo(cx - 58, cy + 14); c.lineTo(cx, cy - 24); c.lineTo(cx + 58, cy + 14); c.closePath(); c.fill();
      c.fillStyle = '#f0e0c8'; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(cx, cy - 24); c.lineTo(cx - 58 + i * 29 + 7, cy + 14); c.lineTo(cx - 58 + i * 29 + 21, cy + 14); c.closePath(); c.fill(); }
      for (let i = 0; i < 9; i++) bulb(c, cx - 56 + i * 14, cy + 15, 2, 0.5 + 0.5 * Math.sin(t * 6 - i));
      c.fillStyle = GOLD; c.beginPath(); c.arc(cx, cy - 26, 4, 0, 7); c.fill(); c.restore(); }
    // ferris wheel on the right, neon at night
    { const cx = 296, cy = 128, R = 60, rot = t * 0.18; c.save();
      c.strokeStyle = '#4a2a5a'; c.lineWidth = 4; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx - 36, 200); c.moveTo(cx, cy); c.lineTo(cx + 36, 200); c.stroke();
      c.shadowColor = '#ff7ad0'; c.shadowBlur = 10; c.strokeStyle = '#ff9ae0'; c.lineWidth = 2.5; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.stroke(); c.shadowBlur = 0;
      c.strokeStyle = 'rgba(160,220,255,0.6)'; c.lineWidth = 1.2; for (let i = 0; i < 10; i++) { const an = rot + i * Math.PI / 5; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(an) * R, cy + Math.sin(an) * R); c.stroke(); }
      for (let i = 0; i < 10; i++) { const an = rot + i * Math.PI / 5, gx = cx + Math.cos(an) * R, gy = cy + Math.sin(an) * R; c.fillStyle = ['#ff6070', GOLD, '#60c0ff', '#9ae07a', '#d080ff'][i % 5]; c.beginPath(); rr(c, gx - 6, gy + 3, 12, 9, 3); c.fill(); }
      for (let i = 0; i < 20; i++) { const an = rot + i * Math.PI / 10; bulb(c, cx + Math.cos(an) * R, cy + Math.sin(an) * R, 1.6, 0.5 + 0.5 * Math.sin(t * 5 + i * 1.7)); }
      c.restore(); }
    // string lights across the top, gently swaying
    for (const [y0, sag, ph] of [[14, 26, 0], [6, 40, 1.7]]) { const sway = Math.sin(t * 1.2 + ph) * 3; c.strokeStyle = 'rgba(20,10,30,0.8)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-10, y0); c.quadraticCurveTo(180, y0 + sag * 2 + sway, 370, y0); c.stroke();
      for (let i = 0; i < 14; i++) { const k = (i + 0.5) / 14, x = -10 + k * 380, y = y0 + 4 * k * (1 - k) * (sag + sway / 2) + 4; bulb(c, x, y, 2.6, 0.55 + 0.45 * Math.sin(t * 3 + i * 1.1 + ph), ['255,214,120', '255,140,170', '140,220,255'][i % 3]); } }
    // the striped awning over the stall, with its scalloped edge and bulbs
    { const y0 = 166, y1 = 190; for (let i = 0; i < 12; i++) { const x0 = i * 30; c.fillStyle = i % 2 ? '#e8d4b8' : '#a8243a'; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + 30, y0); c.lineTo(x0 + 30, y1 - 6); c.quadraticCurveTo(x0 + 15, y1 + 8, x0, y1 - 6); c.closePath(); c.fill(); }
      c.fillStyle = 'rgba(30,8,20,0.25)'; c.fillRect(0, y0, W, 4);
      for (let i = 0; i < 12; i++) bulb(c, i * 30 + 15, y1 + 1, 2.4, won ? 0.5 + 0.5 * Math.sin(t * 14 + i) : 0.6 + 0.4 * Math.sin(t * 2.5 + i)); }

    // the painted sign, hanging on two chains; it swings when a wrong number lands on it
    const fk = S.flipAt != null ? M.clamp((t - S.flipAt) / 0.8, 0, 1) : 1, swing = Math.sin(fk * Math.PI * 4) * 0.06 * (1 - fk);
    c.save(); c.translate(180, 196); c.rotate(swing); c.translate(-180, -196);
    { const x0 = 16, y0 = 200, w = 328, h = 90;
      c.strokeStyle = '#c8a050'; c.lineWidth = 2; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(60, 188); c.lineTo(60, y0); c.moveTo(300, 188); c.lineTo(300, y0); c.stroke(); c.setLineDash([]);
      c.fillStyle = 'rgba(10,4,20,0.4)'; c.beginPath(); rr(c, x0, y0 + 5, w, h, 14); c.fill();
      const sg = c.createLinearGradient(0, y0, 0, y0 + h); sg.addColorStop(0, '#24407a'); sg.addColorStop(1, '#162a58'); c.fillStyle = sg; c.beginPath(); rr(c, x0, y0, w, h, 14); c.fill();
      c.strokeStyle = '#d8a840'; c.lineWidth = 3; c.stroke(); c.strokeStyle = 'rgba(255,220,140,0.35)'; c.lineWidth = 1; c.beginPath(); rr(c, x0 + 7, y0 + 7, w - 14, h - 14, 9); c.stroke();
      // chasing marquee bulbs round the edge (faster after a win)
      const per = 2 * (w + h), nB = 30, sp = won ? 10 : 3;
      for (let i = 0; i < nB; i++) { let d = i / nB * per, x, y; if (d < w) { x = x0 + d; y = y0; } else if ((d -= w) < h) { x = x0 + w; y = y0 + d; } else if ((d -= h) < w) { x = x0 + w - d; y = y0 + h; } else { d -= w; x = x0; y = y0 + h - d; }
        bulb(c, x, y, 2.4, (Math.floor(t * sp) + i) % 3 === 0 ? 1 : 0.25); }
    }
    // backings for the slots' numbers and the ÷ parts: soft glows so they read on the dark sign
    for (const id of ['dn', 'dd']) { const bx = M.box(g, id); if (bx && M.node(g, id)) { c.fillStyle = 'rgba(255,154,58,0.16)'; c.beginPath(); rr(c, bx.x - bx.w / 2 - 4, bx.y - bx.h / 2 - 2, bx.w + 8, bx.h + 4, 8); c.fill(); } }
    M.drawEx(g, c, 'prob');
    if (S.simplified) { const bx = M.box(g, 'fr') || M.unionBox([M.box(g, 'fn'), M.box(g, 'fd')]); if (bx) { const k = M.ease((t - S.doneT) / 0.3);
      c.save(); c.globalAlpha = 0.5 + 0.3 * Math.sin(t * 6); c.shadowColor = GOLD; c.shadowBlur = 18; c.strokeStyle = 'rgba(255,216,106,0.7)'; c.lineWidth = 2; c.beginPath(); rr(c, bx.x - bx.w / 2 - 6, bx.y - bx.h / 2 - 4, bx.w + 12, bx.h + 8, 10); c.stroke(); c.restore();
      if (gcd(S.n, 36) === 1) { c.save(); c.translate(Math.min(328, bx.x + bx.w / 2 + 16), bx.y); c.scale(k, k); c.strokeStyle = '#7ae09a'; c.lineWidth = 5; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(-9, 0); c.lineTo(-2, 8); c.lineTo(11, -10); c.stroke(); c.restore(); } } }
    c.restore();

    // the shelf of 36 cubbies, with the dice along its top and left edges
    { c.save(); c.fillStyle = 'rgba(10,4,20,0.4)'; c.beginPath(); rr(c, GX - 30, GY - 30 + 5, 6 * CS + 38, 6 * CS + 38, 10); c.fill();
      const fw = c.createLinearGradient(0, GY - 30, 0, GY + 6 * CS + 8); fw.addColorStop(0, '#9a5a30'); fw.addColorStop(1, '#6a3a1e'); c.fillStyle = fw; c.beginPath(); rr(c, GX - 30, GY - 30, 6 * CS + 38, 6 * CS + 38, 10); c.fill();
      c.strokeStyle = '#4a2410'; c.lineWidth = 2; c.stroke(); c.fillStyle = 'rgba(255,220,170,0.2)'; c.fillRect(GX - 26, GY - 28, 6 * CS + 30, 2); c.restore(); }
    P.label(c, '+', GX - 14, GY - 13, 17, '#ffe8c0', 'center', 800);
    for (let i = 1; i <= 6; i++) {
      const pk = v => v != null ? 1 + Math.sin(M.clamp((t - v) / 0.3, 0, 1) * Math.PI) * 0.3 : 1;
      die(c, GX + (i - 0.5) * CS, GY - 14, 19, i, RED_DIE, pk(S.hdrA[i])); die(c, GX - 14, GY + (i - 0.5) * CS, 19, i, BLUE_DIE, pk(S.hdrB[i]));
    }
    for (const cl of S.cells) {
      const x0 = cl.x - CS / 2 + 2, y0 = cl.y - CS / 2 + 2, w = CS - 4, lit = cl.litAt >= 0 && t >= cl.litAt, bad = cl.badAt != null && t - cl.badAt < 1.2;
      c.save(); c.beginPath(); rr(c, x0, y0, w, w, 5);
      const ig = c.createLinearGradient(0, y0, 0, y0 + w);
      if (lit) { ig.addColorStop(0, '#ffe28a'); ig.addColorStop(1, '#ffb43a'); c.shadowColor = 'rgba(255,200,80,0.95)'; c.shadowBlur = 12; }
      else if (bad) { ig.addColorStop(0, '#a83040'); ig.addColorStop(1, '#6a1828'); }
      else { ig.addColorStop(0, '#1e0e18'); ig.addColorStop(1, '#3a1e26'); }
      c.fillStyle = ig; c.fill(); c.shadowBlur = 0; c.strokeStyle = lit ? '#fff0b0' : 'rgba(255,200,150,0.25)'; c.lineWidth = 1.2; c.stroke(); c.restore();
      if (!lit) { c.font = MK.NUMF(13, 600); c.fillStyle = bad ? '#ffd0d0' : 'rgba(255,226,190,0.78)'; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.fillText(String(cl.a + cl.b), cl.x, cl.y + 5); }
      else {
        const k = M.clamp((t - cl.litAt) / 0.3, 0, 1), sc = k < 1 ? M.ease(k) * (1 + Math.sin(k * Math.PI) * 0.35) : 1;
        const hop = won ? Math.abs(Math.sin((t - S.winAt) * 7 + cl.order)) * 4 : 0, bob = Math.sin(t * 3 + cl.order * 0.9) * 0.8;
        rDuck(c, cl.x - 1, cl.y + 9 + bob - hop, 0.42 * sc, { quack: t - cl.litAt < 0.25 || (won && Math.sin((t - S.winAt) * 7 + cl.order) > 0.6), expr: lost ? 'sad' : null });
      }
    }
    for (const f of S.floats) { const k = (t - f.t0) / 0.9; c.save(); c.globalAlpha = 1 - k * k; c.font = MK.NUMF(12, 700); c.textAlign = 'center'; c.lineWidth = 3; c.strokeStyle = '#2a1020'; c.strokeText(f.text, f.x, f.y - 14 - k * 16); c.fillStyle = '#ffe9a0'; c.fillText(f.text, f.x, f.y - 14 - k * 16); c.restore(); }

    // the count's red balloon: limp on the shelf until the event is tapped, then it inflates; it pops when its number is taken
    { const { x: bx, y: by, r } = balloonAt(S, t);
      if (!S.numFilled) {
        balloon(c, bx, by, r, '#e8404a', { string: [RX - 10, 482] });
        if (S.tapped && !S.counted) P.label(c, '?', bx, by + 9, 28, INKC, 'center', 800);
        M.drawEx(g, c, 'cnt');
      } else { const k = M.clamp((t - S.popAt) / 0.3, 0, 1); if (k < 1) { c.save(); c.globalAlpha = 1 - k; c.fillStyle = '#e8404a'; for (let i = 0; i < 8; i++) { const an = i * 0.785 + 0.3, d = 14 + k * 30; c.save(); c.translate(RX + Math.cos(an) * d, RY + Math.sin(an) * d); c.rotate(an + k * 4); c.fillRect(-5, -2, 10, 4); c.restore(); } c.restore(); } } }
    // the plank with 6 × 6 = 36, the 36 on a little gold balloon
    { c.save(); c.fillStyle = 'rgba(10,4,20,0.35)'; c.beginPath(); rr(c, 92, LBY - 26, 176, 36, 8); c.fill(); const pg = c.createLinearGradient(0, LBY - 28, 0, LBY + 6); pg.addColorStop(0, '#a86a3a'); pg.addColorStop(1, '#7a4626'); c.fillStyle = pg; c.beginPath(); rr(c, 92, LBY - 29, 176, 36, 8); c.fill(); c.strokeStyle = '#4a2410'; c.lineWidth = 1.5; c.stroke();
      for (const nx of [100, 260]) { c.fillStyle = '#d8b070'; c.beginPath(); c.arc(nx, LBY - 11, 2, 0, 7); c.fill(); } c.restore();
      const tb = M.box(g, 'tot'); if (tb) { c.save(); c.globalAlpha = S.denFilled ? 0.35 : 1; const by = tb.y + Math.sin(t * 2.2) * 1.2; balloon(c, tb.x, by, 17, '#ffc83a'); c.restore(); } }
    M.drawEx(g, c, 'total');
    // dragging the whole shelf: a little shelf with 36 on it follows the finger
    const pr = MKs.press;
    if (pr && pr.dragging && pr.id === 'grid') {
      c.save(); c.translate(pr.x, pr.y - 22); c.shadowColor = 'rgba(255,200,80,0.6)'; c.shadowBlur = 14; c.fillStyle = '#7a4626'; c.beginPath(); rr(c, -28, -28, 56, 56, 8); c.fill(); c.shadowBlur = 0;
      c.fillStyle = '#2a1420'; for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) c.fillRect(-25 + i * 8.4, -25 + j * 8.4, 7, 7);
      c.font = MK.NUMF(30, 700); c.textAlign = 'center'; c.lineWidth = 5; c.strokeStyle = '#2a1420'; c.strokeText('36', 0, 11); c.fillStyle = GOLD; c.fillText('36', 0, 11); c.restore();
      for (const id of ['sn', 'sd']) { const bx = M.box(g, id); if (bx && Math.abs(pr.x - bx.x) < bx.w / 2 + 10 && Math.abs(pr.y - 22 - bx.y) < bx.h / 2 + 12) M.glowBox(c, bx, t, 0.5); }
    }

    // ducks drifting round the pond, splashing whenever a move lands; the stall-keeper duck acts on every move
    for (let i = 0; i < 6; i++) { const x = ((i * 72 + t * 16) % 432) - 36, hopK = M.clamp((t - S.actAt - i * 0.04) / 0.35, 0, 1), jump = hopK < 1 ? Math.sin(hopK * Math.PI) * 7 : 0, winJ = won ? Math.abs(Math.sin((t - S.winAt) * 6 + i)) * 10 : 0;
      const y = 582 + (i % 2) * 6 + Math.sin(t * 2.4 + i * 1.3) * 1.6 - jump - winJ;
      c.strokeStyle = `rgba(255,214,140,${0.3 + 0.2 * Math.sin(t * 3 + i)})`; c.lineWidth = 1.2; c.beginPath(); c.ellipse(x, 583 + (i % 2) * 6, 20 + Math.sin(t * 3 + i) * 2, 3, 0, 0, 7); c.stroke();
      rDuck(c, x, y, 0.62 + (i % 3) * 0.06, { col: i === 2 ? '#ff9ab8' : i === 5 ? '#8ad0ff' : '#ffd23a', headBob: Math.sin(t * 2 + i), quack: jump > 3 || winJ > 6, expr: lost ? 'sad' : won ? 'happy' : null }); }
    for (const p of S.splash) { const k = (t - p.t0) / 0.8; if (k < 0) continue; c.strokeStyle = `rgba(200,240,255,${0.7 * (1 - k)})`; c.lineWidth = 1.5; c.beginPath(); c.ellipse(p.x, 586, 6 + k * 24, 2 + k * 5, 0, 0, 7); c.stroke();
      c.fillStyle = `rgba(200,240,255,${0.8 * (1 - k)})`; for (let j = -1; j <= 1; j++) { c.beginPath(); c.arc(p.x + j * (4 + k * 10), 584 - Math.sin(k * Math.PI) * 12 * (1 - Math.abs(j) * 0.3), 1.8, 0, 7); c.fill(); } }
    { const ak = M.clamp((t - S.actAt) / 0.4, 0, 1), acting = ak < 1, wk = won ? t - S.winAt : 0, hop = won ? Math.abs(Math.sin(wk * 6)) * 14 : acting ? Math.sin(ak * Math.PI) * 10 : 0;
      host(c, 314, 604 - hop, 1.05, { t, pose: won ? 'cheer' : acting ? 'hop' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : S.tapped ? 'wow' : 'happy', facing: -1, quack: acting && ak < 0.6, flap: acting ? t * 30 : 0 }); }
    M.drawUI(g, c);
  },
});
