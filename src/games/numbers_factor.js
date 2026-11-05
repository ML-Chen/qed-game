// numbers_factor.js — PRIME FACTOR! Chop a number into its prime factors, building a factor tree.
// A moonlit forest clearing. The number is painted on the end of a log (36). The player chops it with a downward swipe
// through the log: it splits along a branch into two smaller logs, its smallest prime factor and the rest (2 and 18).
// The player keeps chopping the logs that are not prime. A prime log glows gold and cannot be chopped: an axe stroke
// through it bounces off with a clang and a shower of sparks (only the timer ends the microgame).
// Each chop is acted out: the log cracks and shakes, "36 ÷ 2 = 18" writes itself on a little sign under it, then the
// log splits and its two pieces slide down the new branches (a × writes itself between them), and every prime piece
// lights up gold with a ding. When every leaf is prime, the leaves lift one after another and fly down into the
// answer line, and the power form writes itself: 36 = 2 × 2 × 3 × 3 = 2² × 3².
// A beaver on a branch at the right cheers each chop and winces at each clang.
// Level 0: two chops (12, 18, 20, 28, 30, 45, 50), a wide swipe band. Level 1: two or three chops (24, 36, 40, 54...).
// Level 2: three chops (60, 84, 90, 100, 126, 150), a narrower band. A clang counts as a miss from level 1 up.
// Medium mode: the sign under a chopped log reads "36 ÷ ?", and the player picks the smallest prime factor from the tray.
//
// The swipe is a continuous gesture, so this file handles its own down/move/up (like calc_tangent.js). moves(g) returns a
// placeholder drag move (the logs still to chop) until every leaf is prime, then nothing, so MK.update finishes the
// microgame with the kit's stars and confetti. The tray is the kit's (MK.openAsk), and MK.auto answers it in tests.
const M = MK;
const clamp = M.clamp, lerp = M.lerp, ease = M.ease, easeIO = M.easeIO;
const R0 = 29;                                   // a log's radius
const PAD = [20, 12, 8];                         // extra width of the swipe band around a log, by level
const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const spf = n => { for (let d = 2; d * d <= n; d++) if (n % d === 0) return d; return n; };
const nChops = n => { let k = 0; while (!isPrime(n)) { n /= spf(n); k++; } return k; };

function pickN(g) {
  const R = a => a[Math.floor(g.rand() * a.length)];
  return g.level === 0 ? R([12, 18, 20, 28, 30, 45, 50]) : g.level === 1 ? R([24, 36, 40, 54, 56, 42, 63]) : R([60, 84, 90, 100, 126, 150]);
}
function factors(n) { const out = []; while (n > 1) { const p = spf(n); out.push(p); n /= p; } return out; }

MG.add({
  id: 'factor', stage: 'numbers', cmd: 'PRIME FACTOR!', hint: 'swipe', time: 9, mood: 'night', winText: 'All prime!', hold: 1.6,
  card: {
    title: 'Prime factorization', ref: 'Grade 6 and up', kind: 'Number theory',
    text: 'A prime number is a whole number above 1 that can only be divided evenly by 1 and by itself, like 2, 3, 5, 7 and 11. A number above 1 that is not prime can be split into two smaller factors that multiply to make it.\n\nTo find the prime factors of a number, keep splitting it until every piece is prime. For example, 36 = 2 × 18, then 18 = 2 × 9, then 9 = 3 × 3. So 36 = 2 × 2 × 3 × 3, which we can write with powers as 2² × 3².\n\nEvery whole number above 1 is a product of primes in exactly one way, if you ignore the order. You can split 36 as 6 × 6 or 4 × 9 instead, and you still end up with two 2s and two 3s.',
    note: 'Split the number into factors, and keep splitting until every factor is prime. Multiply the primes back together to check.',
    ask: 'What are the prime factors of 20? Write 72 as a product of primes.',
  },
  init(g) {
    const S = g.s, K = M.setup(g); S.N = pickN(g); S.d = nChops(S.N); S.T = M.pace(g);
    g.dur *= (2.6 + 1.05 * S.d * 1.4) / 8;
    // the tree is a chain: each chop puts the prime on the left and the rest on the right, one row down
    const L = S.d >= 3 ? { x0: 108, dx: 55, dy: 84, y0: 214 } : { x0: 124, dx: 64, dy: 102, y0: 226 };
    S.L = L; S.finalY = L.y0 + L.dy * S.d + 74;
    S.nodes = [{ n: S.N, x: L.x0, y: L.y0, row: 0, bornAt: -1, prime: isPrime(S.N) }];
    S.press = null; S.slash = []; S.lastMoveT = 0; S.beaver = { cheerAt: -9, winceAt: -9, waveAt: -9 };
    M.zone(g, 'n0', box(S.nodes[0]));
    M.zone(g, 'beaver', { x: 300, y: 262, w: 56, h: 70 });
    // the answer line, filled in when the tree is done
    const fs = factors(S.N), groups = []; for (const p of fs) { const q = groups.find(q => q.p === p); if (q) q.k++; else groups.push({ p, k: 1 }); }
    S.fs = fs; S.groups = groups;
    M.play(g, {
      moves(g) { const left = S.nodes.map((q, i) => !q.prime && !q.chopped && !q.hidden ? 'n' + i : null).filter(Boolean); return left.length || S.pending ? [{ drag: left.length ? left : ['n0'], to: 'axe' }] : []; },
      area(g) { return null; },
      onWin(g) { S.winAt = g.t; reveal(g); },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    S.nodes.forEach((q, i) => M.zone(g, 'n' + i, box(q)));
    S.slash = S.slash.filter(s => g.t - s.t0 < 0.35 * M.pace(g));
    // after a timeout the rest of the tree chops itself, one log at a time, so the player sees the answer
    if (g.done && g.result === 'fail') { if (S.pending) { S.pending = false; S.nodes.forEach(q => q.pending = false); } if (S.splitting != null) { finishSplit(g, S.splitting, true); } if (g.t - g.doneAt > 0.35 && g.t - (S.autoChopAt ?? -9) > 0.22) { const i = S.nodes.findIndex(q => !q.prime && !q.chopped && !q.hidden); if (i >= 0) { S.autoChopAt = g.t; split(g, i, true); } else if (!S.revealAt) reveal(g); } }
  },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask && !K.ask.closing) { M.down(g, x, y); return; }
    S.press = { pts: [[x, y, g.t]], used: false };
  },
  move(g, x, y) {
    const S = g.s, P0 = S.press; if (!P0 || g.done) return;
    const [px, py] = P0.pts[P0.pts.length - 1]; P0.pts.push([x, y, g.t]);
    if (P0.used || (S.mk.ask && !S.mk.ask.closing) || S.mk.busyT > 0) return;
    // the axe cuts a log when the stroke crosses the log's middle going down, inside its swipe band
    if (y - P0.pts[0][1] < 10 || y <= py) return;
    const pad = PAD[g.level];
    for (let i = 0; i < S.nodes.length; i++) {
      const q = S.nodes[i]; if (q.chopped || q.pending || q.hidden) continue;
      if (py < q.y && y >= q.y) { const k = (q.y - py) / (y - py), cx = px + (x - px) * k; if (Math.abs(cx - q.x) <= R0 + pad) { P0.used = true; hit(g, i); return; } }
    }
  },
  up(g, x, y) {
    const S = g.s, P0 = S.press; S.press = null; if (!P0 || g.done || P0.used) return;
    if ((S.mk.ask && !S.mk.ask.closing) || S.mk.busyT > 0) return;
    const [x0, y0] = P0.pts[0], dx = x - x0, dy = y - y0;
    // a short downward stroke that started on a log (but never crossed its middle) also counts
    if (dy >= 26 && Math.abs(dx) < dy * 1.3) {
      const pad = PAD[g.level]; let bi = -1, bd = 1e9;
      S.nodes.forEach((q, i) => { if (q.chopped || q.pending || q.hidden) return; const xm = (x0 + x) / 2; if (Math.abs(xm - q.x) <= R0 + pad && y0 <= q.y + R0 + 6 && y >= q.y - R0 - 6) { const d = Math.abs(xm - q.x); if (d < bd) { bd = d; bi = i; } } });
      if (bi >= 0) { hit(g, bi); return; }
    }
    // a tap: a log to chop wiggles (it wants a swipe), a prime twinkles, the beaver waves
    if (Math.hypot(dx, dy) < 12) {
      const i = S.nodes.findIndex(q => Math.hypot(x0 - q.x, y0 - q.y) < R0 + 8);
      if (i >= 0) { const q = S.nodes[i]; q.nudgeAt = g.t; g.sfx(q.prime ? 'ding' : 'tap'); if (!q.prime) S.lastMoveT = -9; return; }
      const b = S.mk.box.beaver; if (b && Math.abs(x0 - b.x) < b.w / 2 && Math.abs(y0 - b.y) < b.h / 2) { S.beaver.waveAt = g.t; g.sfx('tweet'); }
    }
  },
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { if (!K.ask.closing) M.auto(g, dt, synth); return; }
    if (S.bot) { const b = S.bot, k = clamp((g.t - b.t0) / b.dur, 0, 1), y = lerp(b.y0, b.y1, k); synth('move', b.x, y); if (k >= 1) { synth('up', b.x, y); S.bot = null; S.botNext = g.t + 0.35; } return; }
    if (g.t < (S.botNext ?? 0.5) || K.busyT > 0) return;
    const q = S.nodes.find(q => !q.prime && !q.chopped && !q.pending && !q.hidden); if (!q) return;
    synth('down', q.x + 4, q.y - R0 - 22); S.bot = { t0: g.t, dur: 0.16, x: q.x - 2, y0: q.y - R0 - 22, y1: q.y + R0 + 22 };
  },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('numbers_factor_moon', moonlit), 0, 0, W, H);
    ambient(c, t);
    drawBeaver(g, c, S);
    drawTree(g, c, S);
    drawNote(g, c, S);
    drawSlash(g, c, S);
    drawFinal(g, c, S);
    drawGuide(g, c, S);
    M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});

const box = q => ({ x: q.x, y: q.y, w: R0 * 2 + 6, h: R0 * 2 + 6 });

// ---------------- chopping ----------------
function hit(g, i) {
  const S = g.s, q = S.nodes[i]; S.lastMoveT = g.t;
  S.slash.push({ t0: g.t, x: q.x, y: q.y, prime: q.prime });
  if (q.prime) {
    // the axe bounces off a prime with a clang
    q.clangAt = g.t; S.beaver.winceAt = g.t; g.sfx('bell'); g.sfx('boing'); g.burst(q.x, q.y - R0 * 0.4, ['#fff6c0', '#ffd45a', '#ffffff'], 12, 170); g.shake && g.shake(3, 0.15);
    if (g.level >= 1) { S.mk.wrong = (S.mk.wrong || 0) + 1; S.mk.missAt = g.t; }
    return;
  }
  split(g, i, false);
}
function split(g, i, quiet) {
  const S = g.s, q = S.nodes[i], p = spf(q.n), rest = q.n / p, L = S.L, T = S.T;
  q.chopped = true; q.chopAt = g.t;
  const a = { n: p, x: q.x - L.dx, y: q.y + L.dy, row: q.row + 1, bornAt: g.t, prime: true, parent: i, hidden: true };
  const b = { n: rest, x: q.x + L.dx, y: q.y + L.dy, row: q.row + 1, bornAt: g.t, prime: isPrime(rest), parent: i, hidden: true };
  S.nodes.push(a, b); q.kids = [S.nodes.length - 2, S.nodes.length - 1];
  S.beaver.cheerAt = g.t; S.splitting = i; S.noteOut = null;
  if (quiet) { finishSplit(g, i, true); return; }
  g.sfx('crunch'); g.sfx('snap'); g.burst(q.x, q.y + R0, ['#e8b878', '#c88a4a', '#fff0d0'], 14, 150);
  // the working sign under the log: "84 ÷ 2 = 42"
  S.nq = M.num('?', 'np', { col: '#ffe9a0' }); S.note = M.row(M.num(q.n), M.op('÷'), S.nq); S.noteAt = q;
  M.place(g, 'note', S.note, q.x, q.y + R0 + 22, 20, { col: '#fff3d8' }); M.writeIn(g, S.note, { delay: 0.08 * T, dur: 0.3 * T }); S.noteK = g.t;
  const go = g => { S.nq.v = String(p); S.nq.pop = g.t; M.relayout(g, 'note'); g.sfx('tap'); finishSplit(g, i, false); };
  if (g.mode === 'medium') {
    M.show(g, 0.45 * T); a.pending = b.pending = true; S.pending = true;
    let cd = 0; for (let d = 4; d < q.n; d++) if (q.n % d === 0 && !isPrime(d)) { cd = d; break; }
    const wrong = [cd || null, ...[2, 3, 5, 7].filter(r => r !== p)].filter(Boolean);
    M.at(g, [[0.42 * T, g => { S.mk.busyT = 1e9; M.openAsk(g, { ask: { v: p, wrong }, after: 0.05, resolve(g) { a.pending = b.pending = false; S.pending = false; go(g); } }); }]]);
  } else { M.show(g, 0.45 * T); M.at(g, [[0.45 * T, go]]); }
}
// the rest of a chop: "= 42" writes itself, then the log splits and its pieces slide down the branches
function finishSplit(g, i, quiet) {
  const S = g.s, q = S.nodes[i], [a, b] = q.kids.map(j => S.nodes[j]), T = S.T; if (S.splitting !== i) return; S.splitting = null;
  S.noteOut = null; const born = g => { a.hidden = b.hidden = false; a.pending = b.pending = false; a.bornAt = b.bornAt = q.splitAt = g.t; };
  const lastChop = !S.nodes.some(r => !r.prime && !r.chopped);
  if (quiet) { born(g); delete S.mk.ex.note; S.note = null; if (b.prime) g.sfx('sparkle'); return; }
  const eq = M.op('='), r = M.num(b.n, 'nr', { col: '#ffe9a0' }); S.note.items.push(eq, r); M.relayout(g, 'note'); M.writeIn(g, eq, { dur: 0.12 * T }); M.writeIn(g, r, { delay: 0.08 * T, dur: 0.22 * T });
  const len = lastChop ? 1.05 + 0.16 * S.fs.length + 0.75 : 1.1; M.show(g, len * T);
  M.at(g, [
    [0.4 * T, g => { S.noteOut = g.t; }], // the sign fades just before the pieces slide down past it
    [0.52 * T, g => { delete S.mk.ex.note; S.note = null; born(g); g.sfx('whoosh'); S.beaver.cheerAt = g.t; }],
    [0.9 * T, g => { for (const r of [a, b]) if (r.prime) { r.dingAt = g.t; g.burst(r.x, r.y, ['#fff6c0', '#ffd45a', '#fff'], 8, 110); } g.sfx('sparkle'); }],
    ...(lastChop ? [[1.05 * T, g => reveal(g)]] : []),
  ]);
}
// the leaves fly down into the answer line
function reveal(g) {
  const S = g.s; if (S.revealAt) return; S.revealAt = g.t; g.sfx('magic'); const T = S.T || 1, quick = g.done;
  const leaves = S.nodes.filter(q => q.prime && !q.chopped).sort((p, q) => p.n - q.n || p.row - q.row);
  layoutFinal(g); S.fs.forEach((p, i) => { const n = M.node(g, 'f' + i); if (n) n.alpha = 0; });
  const pw = M.node(g, 'fpow'); if (pw) pw.alpha = 0;
  const gap = (quick ? 0.06 : 0.16 * T), dur = quick ? 0.35 : 0.42 * T;
  leaves.forEach((q, k) => { const b = S.finalBoxes[k]; if (!b) return; M.at(g, [[k * gap, g => { q.liftAt = g.t; }]]);
    M.fly(g, { node: M.num(q.n), from: [q.x, q.y], to: [b.x, b.y], dur, delay: k * gap, arc: -30, s0: 24, s1: S.finalS, col: '#ffe9a0',
      then(g) { const n = M.node(g, 'f' + k); if (n) { n.alpha = 1; n.pop = g.t; } g.sfx('tap'); } }); });
  const end = (leaves.length - 1) * gap + dur;
  if (pw) M.at(g, [[end + 0.05, g => { pw.alpha = 1; M.writeIn(g, pw, { dur: quick ? 0.2 : 0.4 * T }); M.sparkle(g, 'fpow', { delay: quick ? 0.2 : 0.4 * T, n: 12 }); g.sfx('ding'); S.beaver.cheerAt = g.t; }]]);
}
function finalNode(S, withIds) {
  const prod = S.fs.flatMap((p, i) => [i ? M.op('×') : null, M.num(p, withIds ? 'f' + i : null)]);
  const pow = S.groups.flatMap((q, i) => [i ? M.op('×') : null, q.k > 1 ? M.sup(M.num(q.p), M.num(q.k)) : M.num(q.p)]);
  const pr = M.row(M.op('='), ...pow); if (withIds) pr.id = 'fpow';
  return M.row(M.num(S.N), M.op('='), ...prod, ...(S.groups.some(q => q.k > 1) ? [pr] : []));
}
function layoutFinal(g) {
  const S = g.s, node = finalNode(S, true); let s = 28; const w = M.lay(node, s).w; if (w > 312) s *= 312 / w;
  S.finalS = s; S.finalNode = node; M.place(g, 'final', node, 180, S.finalY + 10, s, { col: '#fff3d8' });
  S.finalBoxes = S.fs.map((p, i) => M.box(g, 'f' + i));
}

// ---------------- the world ----------------
function moonlit(c, w, h) {
  const sky = c.createLinearGradient(0, 0, 0, 520); [[0, '#0b1236'], [0.45, '#1d2a66'], [0.85, '#3d4a86'], [1, '#5a5a8e']].forEach(([k, col]) => sky.addColorStop(k, col));
  c.fillStyle = sky; c.fillRect(0, 0, w, h);
  let sd = 5; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 90; i++) { c.fillStyle = `rgba(255,250,230,${0.25 + rnd() * 0.6})`; c.beginPath(); c.arc(rnd() * w, rnd() * 420, 0.4 + rnd() * 1.1, 0, 7); c.fill(); }
  // the moon
  const mg = c.createRadialGradient(286, 196, 10, 286, 196, 120); mg.addColorStop(0, 'rgba(255,246,210,0.55)'); mg.addColorStop(1, 'rgba(255,246,210,0)'); c.fillStyle = mg; c.fillRect(160, 70, 260, 260);
  c.fillStyle = '#fff6da'; c.beginPath(); c.arc(286, 196, 30, 0, 7); c.fill();
  c.fillStyle = 'rgba(210,200,170,0.5)'; for (const [x, y, r] of [[276, 188, 6], [296, 204, 4.5], [290, 182, 3]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  // far and near pines in silhouette
  const pines = (base, n, hmin, hmax, col, seed) => { sd = seed; c.fillStyle = col; for (let i = 0; i < n; i++) { const x = (i + rnd() * 0.6) * w / n, hh = hmin + rnd() * (hmax - hmin), ww = hh * 0.36; c.beginPath(); c.moveTo(x, base - hh); for (let k = 1; k <= 4; k++) { const yy = base - hh + hh * k / 4, ww2 = ww * k / 4; c.lineTo(x + ww2, yy); c.lineTo(x + ww2 * 0.45, yy); } c.lineTo(x, base); for (let k = 4; k >= 1; k--) { const yy = base - hh + hh * k / 4, ww2 = ww * k / 4; c.lineTo(x - ww2 * 0.45, yy); c.lineTo(x - ww2, yy); } c.closePath(); c.fill(); c.fillRect(0, base - 2, w, 30); } };
  pines(520, 14, 50, 90, '#26305e', 21);
  pines(560, 10, 60, 120, '#18204a', 33);
  // the clearing: a mossy meadow in moonlight
  const gr = c.createLinearGradient(0, 548, 0, h); gr.addColorStop(0, '#2a4a52'); gr.addColorStop(1, '#14283a'); c.fillStyle = gr;
  c.beginPath(); c.moveTo(0, 560); c.quadraticCurveTo(180, 538, 360, 556); c.lineTo(360, h); c.lineTo(0, h); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(160,210,190,0.18)'; c.lineWidth = 2; c.lineCap = 'round'; sd = 9;
  for (let i = 0; i < 70; i++) { const x = rnd() * w, y = 566 + rnd() * 74; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (rnd() - 0.5) * 6, y - 5 - rnd() * 7); c.stroke(); }
  // the beaver's tree at the right edge, with its branch
  const tg = c.createLinearGradient(318, 0, 360, 0); tg.addColorStop(0, '#3a2a3a'); tg.addColorStop(1, '#1e1426'); c.fillStyle = tg;
  c.beginPath(); c.moveTo(328, 640); c.bezierCurveTo(322, 500, 334, 380, 330, 160); c.lineTo(362, 160); c.lineTo(362, 640); c.closePath(); c.fill();
  c.fillStyle = '#3a2a3a'; c.beginPath(); c.moveTo(332, 286); c.quadraticCurveTo(300, 290, 266, 288); c.quadraticCurveTo(262, 296, 268, 300); c.quadraticCurveTo(300, 302, 332, 304); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(255,240,200,0.25)'; c.lineWidth = 2; c.beginPath(); c.moveTo(330, 287); c.quadraticCurveTo(300, 291, 268, 289); c.stroke();
  c.fillStyle = '#2a4a3a'; for (const [x, y, r] of [[318, 168, 26], [346, 150, 30], [330, 130, 22]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  // a little lantern hanging from the branch
  c.strokeStyle = '#1e1426'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(276, 294); c.lineTo(276, 318); c.stroke();
}
const motes = [...Array(16)].map((_, i) => [((i * 97) % 360), 200 + ((i * 53) % 360), i * 1.3]);
function ambient(c, t) {
  // fireflies
  for (const [x0, y0, ph] of motes) { const x = x0 + Math.sin(t * 0.6 + ph) * 18, y = y0 + Math.cos(t * 0.5 + ph * 2) * 12, a = 0.25 + 0.6 * Math.max(0, Math.sin(t * 2.2 + ph * 3));
    c.save(); c.globalAlpha = a; const gr = c.createRadialGradient(x, y, 0, x, y, 9); gr.addColorStop(0, 'rgba(230,255,150,0.9)'); gr.addColorStop(1, 'rgba(230,255,150,0)'); c.fillStyle = gr; c.fillRect(x - 9, y - 9, 18, 18); c.fillStyle = '#f6ffd0'; c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); c.restore(); }
  // the lantern glows
  const k = 0.75 + 0.25 * Math.sin(t * 3.1) * Math.sin(t * 1.7);
  c.save(); const lg = c.createRadialGradient(276, 326, 2, 276, 326, 40); lg.addColorStop(0, `rgba(255,210,120,${0.55 * k})`); lg.addColorStop(1, 'rgba(255,210,120,0)'); c.fillStyle = lg; c.fillRect(230, 280, 92, 92);
  c.fillStyle = '#2a1a20'; c.fillRect(270, 316, 12, 3); c.fillStyle = `rgba(255,214,130,${0.8 + 0.2 * k})`; c.beginPath(); c.moveTo(271, 319); c.lineTo(281, 319); c.lineTo(283, 333); c.lineTo(269, 333); c.closePath(); c.fill(); c.fillStyle = '#2a1a20'; c.fillRect(268, 333, 16, 3); c.restore();
}
function rr(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// ---------------- the beaver ----------------
function drawBeaver(g, c, S) {
  const t = g.t, B = S.beaver, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const cheer = won || t - B.cheerAt < 0.45, wince = t - B.winceAt < 0.6, wave = t - B.waveAt < 0.8;
  const hop = t - B.cheerAt < 0.35 ? Math.sin((t - B.cheerAt) / 0.35 * Math.PI) * 10 : 0;
  try { ANI.draw(c, 'beaver', 300, 292 - hop, 1.0, { t, pose: cheer ? 'cheer' : wince ? 'balance' : wave ? 'wave' : 'point', expr: cheer ? 'laugh' : wince ? 'wow' : lost ? 'sad' : 'happy', facing: -1, noShadow: true }); }
  catch (e) { P.sheep(c, 300, 292, 0.8, { t }); }
}

// ---------------- the factor tree ----------------
function drawTree(g, c, S) {
  const t = g.t;
  // branches first
  for (const q of S.nodes) {
    if (!q.kids || q.splitAt == null) continue; const k = ease((t - q.splitAt) / ((S.T || 1) * 0.35));
    for (const j of q.kids) { const r = S.nodes[j], ex = lerp(q.x, r.x, k), ey = lerp(q.y, r.y, k);
      c.save(); c.lineCap = 'round'; c.strokeStyle = '#1a1020'; c.lineWidth = 7; c.beginPath(); c.moveTo(q.x, q.y + R0 * 0.6); c.quadraticCurveTo((q.x + ex) / 2, (q.y + ey) / 2 + 6, ex, ey - R0 * 0.6); c.stroke();
      c.strokeStyle = '#8a6a4a'; c.lineWidth = 4; c.stroke(); c.restore(); }
    // the × between the two pieces
    const a = S.nodes[q.kids[0]], b = S.nodes[q.kids[1]];
    c.save(); c.globalAlpha = k; c.strokeStyle = '#fff3d8'; c.lineWidth = 3; c.lineCap = 'round'; const mx = (a.x + b.x) / 2, my = a.y, r = 6;
    c.beginPath(); c.moveTo(mx - r, my - r); c.lineTo(mx + r, my + r); c.moveTo(mx + r, my - r); c.lineTo(mx - r, my + r); c.stroke(); c.restore();
  }
  S.nodes.forEach((q, i) => drawLog(g, c, S, q, i));
}
function drawLog(g, c, S, q, i) {
  if (q.hidden) return; const BD = (S.T || 1) * 0.35, t = g.t, born = q.bornAt < 0 ? 1 : ease((t - q.bornAt) / BD);
  let x = q.x, y = q.y;
  if (q.parent != null && q.bornAt >= 0 && t - q.bornAt < BD) { const p = S.nodes[q.parent]; x = lerp(p.x, q.x, born); y = lerp(p.y, q.y, born); }
  const nud = q.nudgeAt != null && t - q.nudgeAt < 0.35 ? Math.sin((t - q.nudgeAt) * 45) * 4 * (1 - (t - q.nudgeAt) / 0.35) : 0;
  const clang = q.clangAt != null && t - q.clangAt < 0.4 ? 1 - (t - q.clangAt) / 0.4 : 0;
  // a fresh chop shakes the log; a prime piece swells once when it lights up; a leaf lifts as it flies to the answer
  const crack = q.chopAt != null && t - q.chopAt < 0.3 ? 1 - (t - q.chopAt) / 0.3 : 0, ding = q.dingAt != null && t - q.dingAt < 0.35 ? Math.sin((t - q.dingAt) / 0.35 * Math.PI) : 0;
  const lift = q.liftAt != null ? Math.sin(clamp((t - q.liftAt) / 0.3, 0, 1) * Math.PI) : 0;
  const gold = q.prime && !q.pending && (q.dingAt != null || q.parent == null || t - q.bornAt > BD * 2.2), r = R0 * (q.parent != null ? 0.6 + 0.4 * born : 1) * (1 + clang * 0.12 + ding * 0.18 + lift * 0.12);
  c.save(); c.translate(x + nud + Math.sin(t * 70) * (clang + crack) * 3, y - lift * 8);
  if (gold) { c.shadowColor = '#ffd84a'; c.shadowBlur = 18 + 8 * Math.sin(t * 4 + i); }
  // bark ring, then the cut face with growth rings
  c.fillStyle = gold ? '#a8701a' : '#4a2c1c'; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill(); c.shadowBlur = 0;
  const fg = c.createRadialGradient(-r * 0.25, -r * 0.3, 2, 0, 0, r * 0.9);
  if (gold) { fg.addColorStop(0, '#fff6c0'); fg.addColorStop(0.6, '#ffd860'); fg.addColorStop(1, '#e8a830'); } else { fg.addColorStop(0, '#f4d8a8'); fg.addColorStop(0.7, '#dcae74'); fg.addColorStop(1, '#c08a52'); }
  c.fillStyle = fg; c.beginPath(); c.arc(0, 0, r * 0.84, 0, 7); c.fill();
  c.strokeStyle = gold ? 'rgba(180,120,20,0.35)' : 'rgba(140,90,40,0.35)'; c.lineWidth = 1.2; for (const k of [0.3, 0.52, 0.72]) { c.beginPath(); c.arc(1, 1, r * k, 0, 7); c.stroke(); }
  // a chopped log keeps its axe cut
  if (q.chopped) { const k = ease((t - q.chopAt) / 0.15); c.strokeStyle = '#3a1e10'; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(-1, -r * 0.98); c.lineTo(-1, -r * (0.98 - 0.4 * k)); c.moveTo(1, r * 0.98); c.lineTo(1, r * (0.98 - 0.4 * k)); c.stroke(); }
  // the number
  const txt = q.pending ? '?' : String(q.n), fs = txt.length >= 3 ? 21 : 25;
  c.font = `700 ${fs}px Fredoka, Nunito, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
  if (false) { c.fillStyle = 'rgba(255,248,230,0.75)'; c.beginPath(); rr(c, -c.measureText(txt).width / 2 - 4, -fs * 0.48, c.measureText(txt).width + 8, fs * 0.96, 6); c.fill(); }
  c.fillStyle = gold ? '#6a3a06' : q.pending ? '#8a5a8a' : '#3a1a10'; c.fillText(txt, 0, 1.5);
  if (gold) { for (let k = 0; k < 2; k++) { const a = t * 1.6 + k * 3.1 + i, rr2 = r + 6; c.fillStyle = '#fff8c8'; star4(c, Math.cos(a) * rr2, Math.sin(a) * rr2 * 0.8, 2.2); } }
  c.restore();
}
function star4(c, x, y, r) { c.beginPath(); c.moveTo(x, y - r * 2); c.quadraticCurveTo(x, y, x + r * 2, y); c.quadraticCurveTo(x, y, x, y + r * 2); c.quadraticCurveTo(x, y, x - r * 2, y); c.quadraticCurveTo(x, y, x, y - r * 2); c.fill(); }
// the axe stroke: a bright streak through the log (a short bounce for a prime)
// the little wooden sign under a log being chopped, holding its working ("84 ÷ 2 = 42")
function drawNote(g, c, S) {
  const e = S.mk.ex.note; if (!e || !S.note) return; const t = g.t, m = M.lay(S.note, e.s), x = e.x + m.w / 2, y = e.y - e.s * 0.3;
  const fade = S.noteOut != null ? 1 - clamp((t - S.noteOut) / 0.2, 0, 1) : 1, grow = ease((t - S.noteK) / 0.15); if (fade <= 0) return;
  c.save(); c.globalAlpha = fade; c.translate(x, y); c.scale(grow, grow);
  const w = m.w + 18, h = 28; c.fillStyle = 'rgba(10,8,30,0.4)'; rr(c, -w / 2, -h / 2 + 3, w, h, 8); c.fill();
  const gr = c.createLinearGradient(0, -h / 2, 0, h / 2); gr.addColorStop(0, '#7a5034'); gr.addColorStop(1, '#4a2c1c'); c.fillStyle = gr; rr(c, -w / 2, -h / 2, w, h, 8); c.fill();
  c.strokeStyle = 'rgba(255,220,160,0.45)'; c.lineWidth = 1.5; c.stroke(); c.restore();
  c.save(); c.globalAlpha = fade; M.drawEx(g, c, 'note'); c.restore();
}
function drawSlash(g, c, S) {
  for (const s of S.slash) {
    const k = (g.t - s.t0) / (0.35 * M.pace(g)), a = 1 - k;
    c.save(); c.globalAlpha = a; c.lineCap = 'round';
    if (s.prime) { c.strokeStyle = '#fff6c0'; c.lineWidth = 4; for (const d of [-1, 1]) { c.beginPath(); c.moveTo(s.x, s.y - R0 - 6); c.lineTo(s.x + d * (14 + k * 16), s.y - R0 - 22 - k * 10); c.stroke(); } }
    else { c.shadowColor = '#fff'; c.shadowBlur = 12; c.strokeStyle = '#ffffff'; c.lineWidth = 6 * (1 - k * 0.6); c.beginPath(); c.moveTo(s.x + 6, s.y - R0 - 30); c.quadraticCurveTo(s.x - 3, s.y, s.x - 6, s.y + R0 + 30); c.stroke(); }
    c.restore();
  }
  // the live stroke trail under the finger
  const P0 = S.press; if (P0 && P0.pts.length > 1) {
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; const pts = P0.pts.slice(-8);
    for (let i = 1; i < pts.length; i++) { c.strokeStyle = `rgba(255,255,255,${0.15 + 0.6 * i / pts.length})`; c.lineWidth = 2 + 5 * i / pts.length; c.beginPath(); c.moveTo(pts[i - 1][0], pts[i - 1][1]); c.lineTo(pts[i][0], pts[i][1]); c.stroke(); }
    c.restore();
  }
}
// the answer line on a wooden sign, once the tree is done
function drawFinal(g, c, S) {
  if (!S.revealAt) return; const t = g.t;
  const node = S.finalNode, s = S.finalS, m = M.lay(node, s), y = S.finalY;
  c.save(); c.globalAlpha = Math.min(1, (t - S.revealAt) / 0.2);
  c.fillStyle = 'rgba(10,8,30,0.35)'; rr(c, 180 - m.w / 2 - 16, y - 24 + 5, m.w + 32, 52, 14); c.fill();
  const gr = c.createLinearGradient(0, y - 24, 0, y + 28); gr.addColorStop(0, '#7a5034'); gr.addColorStop(1, '#4a2c1c'); c.fillStyle = gr; rr(c, 180 - m.w / 2 - 16, y - 24, m.w + 32, 52, 14); c.fill();
  c.strokeStyle = 'rgba(255,220,160,0.4)'; c.lineWidth = 1.5; c.stroke(); c.restore();
  // each prime appears in the line when its flying copy lands
  M.drawEx(g, c, 'final');
}

// ---------------- guidance ----------------
// the next log to chop always glows; a ghost hand swipes down through it at level 0, or after a 2-second pause
function drawGuide(g, c, S) {
  const t = g.t, K = S.mk; if (g.done || S.press || (K.ask && !K.ask.closing) || K.busyT > 0) return;
  const q = S.nodes.find(q => !q.prime && !q.chopped && !q.pending && !q.hidden); if (!q) return;
  M.glowBox(c, { x: q.x, y: q.y, w: R0 * 2, h: R0 * 2 }, t, 0.9, true);
  if ((g.level !== 0 && t - S.lastMoveT < 2) || t < 0.4) return;
  const per = 1.3, k = ((t - 0.4) % per) / per, e = easeIO(clamp((k - 0.2) / 0.4, 0, 1)), y = lerp(q.y - R0 - 34, q.y + R0 + 30, e), fade = k > 0.85 ? (1 - k) / 0.15 : Math.min(1, k / 0.1);
  if (e > 0 && e < 1) { c.save(); c.globalAlpha = 0.7 * fade; c.strokeStyle = '#fff6c0'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(q.x + 4, q.y - R0 - 34); c.lineTo(q.x, y); c.stroke(); c.restore(); }
  c.save(); c.globalAlpha = fade; M.hand(c, q.x + 2, y, 1, e <= 0 || e >= 1 ? 1 : 0); c.restore();
}
