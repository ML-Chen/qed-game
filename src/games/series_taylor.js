// series_taylor.js — TAYLOR SERIES! Build a function's Taylor polynomial about 0, one term at a time:
// the term with xⁿ is f⁽ⁿ⁾(0) / n! · xⁿ.
// A rainforest morning: the true graph of f is a curving branch on a pale mist board, and the Taylor polynomial is a
// green vine that a frog keeps re-growing; with each new term the vine hugs the branch a little farther out.
// One expression: f(x) ≈ ? + ? + ? + ?. Tap the next ? (left to right; a later one first is the wrong move). Its working:
//   the slot writes the term's recipe in place, f″(0)/2! · x²; f″(0) is circled and a note gives its value with the reason
//   ("f″(0) = e⁰ = 1"), and it turns into that number; then 2! is circled with "2! = 2 · 1 = 2" and turns into 2; the
//   term tidies itself into x²/2 (a 0 term is crossed out and leaves); then the vine re-grows to the new polynomial and
//   small flowers bloom where it stops hugging the branch.
// Level 0: eˣ through x². Level 1: eˣ or e⁻ˣ through x³. Level 2: sin x or cos x through x³ (the zero terms drop out).
// Medium mode: each term from x² on is picked from the tray (wrong: no n!, divided by n, the sign flipped).
const M = MK, INK = '#173a22', GOLD = '#e08a00', NOTE = '#7a3a00', VINE = '#3ec84a', BRANCH = '#7a4a26';
const L1Y = 226, NY = 292, GX0 = 30, GX1 = 330, GT = 338, GB = 548, FX = 306, FY = 612;
const FACT = [1, 1, 2, 6];
const FN = {
  exp: { f: Math.exp, xr: [-3, 2.4], yr: [-1.2, 7], v: n => 1, lhs: () => M.sup(M.vr('e'), M.vr('x')), at0: n => M.sup(M.vr('e'), M.num(0)) },
  expm: { f: x => Math.exp(-x), xr: [-2.4, 3], yr: [-1.2, 7], v: n => (n % 2 ? -1 : 1), lhs: () => M.sup(M.vr('e'), M.row(M.op('-'), M.vr('x'))), at0: n => M.row(n % 2 ? M.op('-') : null, M.sup(M.vr('e'), M.num(0))) },
  sin: { f: Math.sin, xr: [-4.4, 4.4], yr: [-2.4, 2.4], v: n => [0, 1, 0, -1][n % 4], lhs: () => M.row(M.txt('sin'), M.gap(5), M.vr('x')), at0: n => M.row([null, null, M.op('-'), M.op('-')][n % 4], M.txt(['sin', 'cos', 'sin', 'cos'][n % 4]), M.gap(5), M.num(0)) },
  cos: { f: Math.cos, xr: [-4.4, 4.4], yr: [-2.4, 2.4], v: n => [1, 0, -1, 0][n % 4], lhs: () => M.row(M.txt('cos'), M.gap(5), M.vr('x')), at0: n => M.row([null, M.op('-'), M.op('-'), null][n % 4], M.txt(['cos', 'sin', 'cos', 'sin'][n % 4]), M.gap(5), M.num(0)) },
};
const xpow = (n, id) => n === 1 ? M.vr('x', id) : M.sup(M.vr('x'), M.num(n), id);
const fd = (n, id) => { const r = M.row(M.vr('f' + '′'.repeat(n)), M.paren(M.num(0))); if (id) r.id = id; return r; };
const nf = (n, id) => { const r = M.row(M.num(n), M.txt('!')); if (id) r.id = id; return r; };
// the finished term (without its sign), as a plain node: 1, x, x²/2, x³/6
const plainT = n => n === 0 ? M.num(1) : n === 1 ? M.vr('x') : M.frac(xpow(n), M.num(FACT[n]));
const kids = n => [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || [])].filter(Boolean);
const hideAll = n => { if (!n) return; n.alpha = 0; kids(n).forEach(hideAll); };
function fitAsk(g) { // tray tiles grow to fit an expression at a readable size
  const A = g.s.mk.ask; if (!A || A.fit) return; A.fit = 1; const gap = 8, ws = A.list.map(ch => M.lay(ch.node, 28).w + 22), tws = ws.map(w => Math.max(74, w));
  const tot = tws.reduce((p, q) => p + q, 0) + gap * (tws.length - 1), k = Math.min(1, 344 / tot); let x = 180 - tot * k / 2;
  A.list.forEach((ch, i) => { ch.w = tws[i] * k; ch.x = x + ch.w / 2; x += ch.w + gap * k; ch.s = Math.min(34, 34 * (ch.w - 14) / M.lay(ch.node, 34).w); M.lay(ch.node, ch.s); }); }

// ---------------- the scene: a misty rainforest morning ----------------
function leaf(c, x, y, len, ang, col) { c.save(); c.translate(x, y); c.rotate(ang); c.fillStyle = col; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(len * 0.5, -len * 0.38, len, 0); c.quadraticCurveTo(len * 0.5, len * 0.38, 0, 0); c.fill();
  c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(len * 0.95, 0); c.stroke(); c.restore(); }
function scene(c, W, H) {
  P.sky(c, W, H, ['#4a9a7a', '#7ac0a0', '#b8e0c0', '#e0f0cc'], { x: 250, y: 60, r: 26, color: '#fffbe0', glow: 160 });
  // far misty trees
  for (let i = 0; i < 9; i++) { const x = i * 46 - 10; c.fillStyle = 'rgba(30,100,70,0.45)'; c.beginPath(); c.ellipse(x, 300 + (i % 3) * 14, 46, 120, 0, 0, 7); c.fill(); }
  for (let i = 0; i < 5; i++) { const x = i * 84 + 20; c.fillStyle = 'rgba(30,70,50,0.7)'; c.fillRect(x, 100, 12, 540); }
  // light shafts through the canopy
  c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) { const x = 60 + i * 80; const gr = c.createLinearGradient(x, 0, x + 60, 640); gr.addColorStop(0, 'rgba(255,250,210,0.12)'); gr.addColorStop(1, 'rgba(255,250,210,0)'); c.fillStyle = gr; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 26, 0); c.lineTo(x + 120, 640); c.lineTo(x + 70, 640); c.fill(); } c.restore();
  // big leaves framing the scene
  const L = [[-20, 120, 110, 0.4], [370, 150, 110, Math.PI - 0.5], [-10, 600, 120, -0.5], [380, 560, 90, Math.PI + 0.3], [-30, 380, 80, 0.1], [390, 400, 80, Math.PI - 0.1]];
  L.forEach(([x, y, l, a], i) => leaf(c, x, y, l, a, i % 2 ? '#2e8a4a' : '#3a9a52'));
  c.fillStyle = '#2a6a3a'; c.fillRect(0, 586, W, 54); P.grassTufts(c, W, 586, 640, 30, '#1e5a2e', 4);
  P.flowers(c, W, 600, 640, 10, ['#ff7aa8', '#ffd45a', '#ffffff'], 6);
}

MG.add({
  id: 'taylor', stage: 'series', cmd: 'TAYLOR SERIES!', hint: 'tap', time: 10, mood: 'bright', winText: 'Hugged!', hold: 1.8,
  card: {
    title: 'Taylor series', ref: 'Calculus', kind: 'Calculus',
    text: 'A Taylor polynomial copies a function near x = 0 using only powers of x. It matches the function\'s value at 0, then its slope, then how its slope bends, and so on.\n\nThe term with xⁿ is f⁽ⁿ⁾(0) / n! · xⁿ: take the n-th derivative, put in x = 0, and divide by n! = n · (n − 1) · ... · 1.\n\nFor eˣ every derivative is eˣ again, and e⁰ = 1, so eˣ ≈ 1 + x + x²/2 + x³/6. Each extra term makes the copy hug the real curve a little farther from 0.',
    note: 'f(x) ≈ f(0) + f′(0)·x + f″(0)/2!·x² + f‴(0)/3!·x³ + ...',
    ask: 'What are the first three terms for e⁻ˣ? Why does sin x have no x² term?',
  },

  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g), r = k => Math.floor(g.rand() * k);
    S.fn = g.level === 0 ? 'exp' : g.level === 1 ? ['exp', 'expm'][r(2)] : ['sin', 'cos'][r(2)]; const F = FN[S.fn]; S.F = F;
    S.N = g.level === 0 ? 3 : 4; S.vals = [...Array(S.N)].map((_, n) => F.v(n)); S.coef = []; S.vine = null; S.blooms = [];
    S.face = 'happy'; S.faceT = -9; S.done = [];
    // the one expression: f(x) ≈ ? + ? + ? (+ ?)
    S.sl = [...Array(S.N)].map((_, n) => M.slot('s' + n, { w: 32 })); S.ops = S.sl.map((_, n) => n ? M.op('+', 'p' + n) : null);
    S.lhs = F.lhs(); S.lhs.id = 'lhs'; S.cell = S.sl.map((_, n) => { const r = M.row(); r.id = 'c' + n; return r; });
    S.build = () => { const it = [S.lhs, M.op('≈', 'apx')]; let first = true; S.sl.forEach((sl, n) => { if (S.gone && S.gone[n]) return; if (!first) it.push(S.ops[n]); if (sl.fill) { S.cell[n].items = [sl.fill]; it.push(S.cell[n]); } else it.push(sl); first = false; }); S.ex = M.row(...it); };
    // the line's size: its widest moment is a full recipe written into the last slot
    // the line's size: its widest moment is a recipe written into a slot, with the finished terms before it and ?s after
    { let w = 0; for (let n = 0; n < S.N; n++) { const it = [F.lhs(), M.op('≈')]; let first = true;
        for (let k = 0; k < S.N; k++) { if (k < n && S.vals[k] === 0) continue; if (!first) it.push(M.op('+')); first = false;
          it.push(k < n ? plainT(k) : k === n ? M.row(n >= 2 ? M.frac(fd(n), nf(n)) : fd(n), n ? xpow(n) : null) : M.slot(null, { w: 32 })); }
        w = Math.max(w, M.lay(M.row(...it), 34).w); } S.ls = Math.min(34, 34 * 326 / w); }
    const relay = () => { S.build(); M.place(g, 'ex', S.ex, 180, L1Y, S.ls, { col: INK }); };
    S.relay = relay; relay(); M.inert(g, ['lhs', 'apx']);
    S.X = x => GX0 + (x - F.xr[0]) / (F.xr[1] - F.xr[0]) * (GX1 - GX0); S.Y = y => GB - (y - F.yr[0]) / (F.yr[1] - F.yr[0]) * (GB - GT);
    const react = (g, e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    g.dur *= (2.6 + 1.05 * S.N) / 8;

    // the recipe for term n, in its slot: f(0), f′(0)·x, f″(0)/2!·x², with the parts kept so they can change in place
    const recipe = n => { const Q = { n, top: fd(n, 'fd' + n), bot: n >= 2 ? nf(n, 'nf' + n) : null, xp: n ? xpow(n, 'xp' + n) : null };
      Q.node = () => M.row(Q.bot ? M.frac(Q.top, Q.bot, 'tf' + n, Q.bar ? { bar: Q.bar } : {}) : Q.top, Q.xp); return Q; };
    const setFill = (n, node) => { S.sl[n].fill = node; relay(); };
    // the whole working of one term after its recipe is written (the part medium mode plays after the tray)
    function work(g, Q) {
      const n = Q.n, v = S.vals[n]; let t = 0;
      // f⁽ⁿ⁾(0) gets its value, with the reason written beside it
      M.at(g, [[t, g => { M.circle(g, 'fd' + n, { dur: 0.5 * T, col: GOLD, pad: 4 }); react(g, 'think');
        M.note(g, { node: M.row(fd(n), M.op('='), S.F.at0(n), M.op('='), M.num(v)), at: ['fd' + n], off: [0, NY - L1Y + 8], s: 28, col: NOTE, write: 0.4 * T, hold: 0.75 * T, fade: 0.25 * T, pill: 'rgba(255,252,240,0.94)' }); }],
        [t + 1.05 * T, g => { const b = M.box(g, 'fd' + n); Q.top = M.num(v, 'tv' + n, { col: GOLD, pop: g.t, _born: -1 }); setFill(n, Q.node()); g.sfx('ding'); M.sparkle(g, 'tv' + n, { n: 6 }); void b; }]]);
      t += 1.5;
      // n! becomes its number
      if (Q.bot && v !== 0) { M.at(g, [[t * T, g => { M.circle(g, 'nf' + n, { dur: 0.5 * T, col: GOLD, pad: 4 });
          M.note(g, { node: M.row(M.num(n), M.txt('!'), M.op('='), ...[...Array(n)].flatMap((_, k) => [k ? M.op('·') : null, M.num(n - k)]), M.op('='), M.num(FACT[n])), at: ['nf' + n], off: [0, NY - L1Y - 12], s: 28, col: NOTE, write: 0.4 * T, hold: 0.75 * T, fade: 0.25 * T, pill: 'rgba(255,252,240,0.94)' }); }],
        [(t + 1.05) * T, g => { Q.bot = M.num(FACT[n], 'tn' + n, { col: GOLD, pop: g.t, _born: -1 }); setFill(n, Q.node()); g.sfx('ding'); }]]); t += 1.5; }
      // the term tidies itself: 1/2 · x² → x²/2, 1 · x → x, −1 · x → − x; a 0 term is crossed out and leaves
      M.at(g, [[t * T, g => { react(g, 'happy');
        if (v === 0) { M.strike(g, S.cell[n], { dur: 0.35 * T }); M.tween(g, S.cell[n], { alpha: 0, sc: 0.6 }, 0.3 * T, { delay: 0.55 * T }); if (S.ops[n]) M.tween(g, S.ops[n], { alpha: 0 }, 0.3 * T, { delay: 0.55 * T }); g.sfx('tap');
          M.at(g, [[0.9 * T, g => { (S.gone = S.gone || {})[n] = 1; relay(); }]]); return; }
        if (v < 0 && S.ops[n]) { S.ops[n].v = '−'; S.ops[n].pop = g.t; M.indicate(g, S.ops[n], { col: GOLD, dur: 0.4 * T }); }
        const body = n === 0 ? M.num(Math.abs(v), 'fin' + n) : n === 1 ? (Q.xp.id = 'fin' + n, Q.xp) : M.frac(Q.xp, Q.bot, 'fin' + n);
        if (Q.top) Q.top.col = undefined; if (Q.bot) Q.bot.col = undefined;
        setFill(n, v < 0 && !S.ops[n] ? M.row(M.op('-'), body) : body); g.sfx('swoosh'); M.sparkle(g, 'fin' + n, { n: 8, delay: 0.3 * T }); M.inert(g, ['s' + n, 'c' + n, 'fin' + n]); }]]);
      t += 0.6;
      // the vine re-grows to the new polynomial and hugs the branch a little farther out
      M.at(g, [[t * T, g => { const from = S.coef.slice(); S.coef[n] = v / FACT[n]; S.vine = { from, to: S.coef.slice(), t0: g.t, dur: 0.9 * T }; react(g, 'wow'); g.sfx('sparkle'); }],
        [(t + 0.95) * T, g => { S.blooms.push({ r: hugR(S.coef), t0: g.t }); react(g, 'laugh'); }]]);
      return t + 1.15;
    }
    const hugR = co => { const P = x => co.reduce((s, c, k) => s + (c || 0) * Math.pow(x, k), 0), tol = 0.05 * (F.yr[1] - F.yr[0]); let r = 0;
      for (let i = 1; i <= 200; i++) { const x = i * 0.025; if (Math.abs(P(x) - F.f(x)) > tol || Math.abs(P(-x) - F.f(-x)) > tol) break; r = x; } return r; };
    S.hugR = hugR;
    const termAsk = n => { const v = S.vals[n], sg = q => v < 0 ? M.row(M.op('-'), q) : q;
      if (v === 0) return { v: M.num(0), wrong: [plainT(n), M.row(M.op('-'), plainT(n)), xpow(n)] };
      return { v: sg(plainT(n)), wrong: [sg(xpow(n)), sg(M.frac(xpow(n), M.num(n))), v < 0 ? plainT(n) : M.row(M.op('-'), plainT(n)), sg(M.row(M.num(n), n - 1 > 1 ? xpow(n - 1) : M.vr('x')))] }; };

    M.play(g, {
      moves(g) {
        const n = S.done.length; if (n >= S.N) return [];
        const Q = recipe(n), mv = { tap: 's' + n, busy: 0.1,
          then(g) { S.done.push(n); S.point = true; react(g, 'think'); M.show(g, 0.95 * T);
            M.circle(g, 's' + n, { dur: 0.45 * T, col: GOLD }); g.sfx('tap');
            M.at(g, [[0.2 * T, g => { Q.bar = { t0: g.t + 0.2 * T, dur: 0.4 * T }; setFill(n, Q.node()); Q.bar = null; M.writeIn(g, S.sl[n].fill, { dur: 0.6 * T }); }]]);
            if (!mv.ask) M.at(g, [[0.95 * T, g => { const len = work(g, Q); M.show(g, len * T); M.at(g, [[len * T, g => { S.point = false; }]]); }]]); } };
        if (n >= 2 && g.mode === 'medium') Object.assign(mv, { ask: termAsk(n), askAt: 0.95 * T,
          resolve(g) { const len = work(g, Q); M.show(g, len * T); mv.after = len * T; M.at(g, [[len * T, g => { S.point = false; }]]); } });
        return [mv];
      },
      area(g) { return ['s' + S.done.length]; },
    });
  },
  update(g, dt) { M.update(g, dt); fitAsk(g); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, F = S.F;
    c.drawImage(g.bake('taylor_scene', scene), 0, 0, 360, 640);
    // the mist panel behind the expression, and the board for the graph
    c.save(); c.fillStyle = 'rgba(255,253,244,0.88)'; c.beginPath(); c.roundRect(12, 182, 336, 82, 20); c.fill(); c.strokeStyle = 'rgba(40,90,50,0.35)'; c.lineWidth = 2; c.stroke();
    c.fillStyle = 'rgba(248,252,240,0.82)'; c.beginPath(); c.roundRect(GX0 - 16, GT - 14, GX1 - GX0 + 32, GB - GT + 28, 18); c.fill(); c.stroke(); c.restore();
    const ax = S.Y(0), ay = S.X(0);
    c.save(); c.strokeStyle = 'rgba(40,70,50,0.55)'; c.lineWidth = 2; c.beginPath(); c.moveTo(GX0 - 6, ax); c.lineTo(GX1 + 6, ax); c.moveTo(ay, GT - 8); c.lineTo(ay, GB + 8); c.stroke();
    c.font = M.NUMF(18, 700); c.textAlign = 'center'; c.fillStyle = '#2a4a30'; c.fillText('0', ay - 12, ax + 20); c.restore();
    // the true graph: a curving branch with a few leaves
    const pts = []; for (let i = 0; i <= 120; i++) { const x = F.xr[0] + (F.xr[1] - F.xr[0]) * i / 120, y = F.f(x); pts.push([S.X(x), S.Y(y)]); }
    c.save(); c.beginPath(); c.rect(GX0 - 14, GT - 12, GX1 - GX0 + 28, GB - GT + 24); c.clip();
    c.strokeStyle = BRANCH; c.lineWidth = 9; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
    c.strokeStyle = '#a8784a'; c.lineWidth = 2.5; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y - 2) : c.moveTo(x, y - 2)); c.stroke();
    for (let i = 10; i < 120; i += 22) { const [x, y] = pts[i]; if (y > GT && y < GB) leaf(c, x, y, 16, -1.2 + (i % 3) * 0.5, '#4a8a3a'); }
    // the vine: the Taylor polynomial so far (it morphs when a term is added)
    if (S.vine) { const vk = M.easeIO((t - S.vine.t0) / S.vine.dur), co = S.vine.to.map((c2, k) => M.lerp(S.vine.from[k] || 0, c2 || 0, vk)), P = x => co.reduce((s, c2, k) => s + c2 * Math.pow(x, k), 0);
      const grow = M.clamp((t - S.vine.t0) / S.vine.dur, 0, 1), lim = (F.xr[1] - F.xr[0]) / 2 * (0.25 + 0.75 * grow) + 0.4;
      c.strokeStyle = VINE; c.lineWidth = 5; c.shadowColor = 'rgba(60,200,80,0.6)'; c.shadowBlur = 8; c.beginPath(); let on = false;
      for (let i = 0; i <= 160; i++) { const x = F.xr[0] + (F.xr[1] - F.xr[0]) * i / 160; if (Math.abs(x) > lim) { on = false; continue; } const y = S.Y(P(x)); if (y < GT - 30 || y > GB + 30) { on = false; continue; } on ? c.lineTo(S.X(x), y) : c.moveTo(S.X(x), y); on = true; } c.stroke(); c.shadowBlur = 0;
      // little leaves along the vine
      c.fillStyle = '#2aa83a'; for (let i = 8; i < 160; i += 16) { const x = F.xr[0] + (F.xr[1] - F.xr[0]) * i / 160; if (Math.abs(x) > lim) continue; const y = S.Y(P(x)); if (y < GT || y > GB) continue; c.beginPath(); c.ellipse(S.X(x), y - 5, 4, 2.4, (i % 2 ? 0.6 : -0.6), 0, 7); c.fill(); } }
    // flowers bloom on the branch where the vine stops hugging it
    for (const bl of S.blooms) { const k = M.ease((t - bl.t0) / 0.4), last = bl === S.blooms[S.blooms.length - 1]; if (bl.r <= 0) continue;
      for (const sx of [-1, 1]) { const x = sx * bl.r; if (x < F.xr[0] || x > F.xr[1]) continue; const px = S.X(x), py = S.Y(F.f(x)); if (py < GT || py > GB) continue;
        c.save(); c.translate(px, py); c.scale(k, k); c.globalAlpha = last ? 1 : 0.55; for (let j = 0; j < 5; j++) { c.fillStyle = last ? '#ff6aa0' : '#e8a0c0'; c.beginPath(); c.ellipse(Math.cos(j * 1.256) * 6, Math.sin(j * 1.256) * 6, 5, 3.4, j * 1.256, 0, 7); c.fill(); }
        c.fillStyle = '#ffd45a'; c.beginPath(); c.arc(0, 0, 3.5, 0, 7); c.fill(); c.restore(); } }
    c.restore();
    // the frog on its leaf re-grows the vine, points while work is shown, and cheers
    leaf(c, FX - 50, FY + 4, 100, -0.05, '#2e8a4a');
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'frog', FX, FY - hopK * 18, 0.9, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'frog', FX, FY, 0.9);
    M.drawEx(g, c, 'ex');
    fitAsk(g); M.drawUI(g, c);
  },
});
