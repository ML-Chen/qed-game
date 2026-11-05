// mathkit.js — the shared toolkit for tap-the-number math microgames (global MK).
// It typesets small math expressions on the canvas, records where every token is, and runs a microgame as a set of
// valid moves: tap a part of the problem, or drag one part onto another (never "pick the right answer"). Each move's
// animation does the arithmetic and rewrites the expression, so the player watches how the operation works. It also
// shows the next move according to the guidance level, flies numbers around, and awards stars for answering fast.
// See docs/MICROGAMES.md for how a microgame uses it; src/games/calc_power.js is the reference microgame.
const MK = (() => {
  const INK = '#3a1640', MID = '#7a4a5a', GOOD = '#2f9a5a', BAD = '#d8454a', GLOW = '#ffcf3a', HL = '#ffb21f';
  const NUMF = (s, w = 600) => `${w} ${s}px Fredoka, Nunito, system-ui, sans-serif`;
  const VARF = s => `italic 700 ${s}px Georgia, 'Times New Roman', serif`;
  const mc = document.createElement('canvas').getContext('2d'); // measuring context
  const lerp = (a, b, k) => a + (b - a) * k, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = k => 1 - Math.pow(1 - clamp(k, 0, 1), 3), easeIO = k => { k = clamp(k, 0, 1); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };

  // ---------------- expression nodes ----------------
  // Every node may carry: id (for tapping, glowing and boxes), col (ink colour), alpha, hide, dx/dy (offset in px),
  // pop (g.t when it last popped: it swells briefly), mark ('good' | 'bad': tints it).
  const num = (v, id, o) => ({ k: 'num', v: String(v).replace(/^-/, '−'), id, ...o });
  const vr = (v, id, o) => ({ k: 'var', v, id, ...o });
  const txt = (v, id, o) => ({ k: 'txt', v, id, ...o });
  const op = (v, id, o) => ({ k: 'op', v: v === '-' ? '−' : v === '*' ? '×' : v, id, ...o });
  const sup = (base, exp, id, o) => ({ k: 'sup', base, exp, id, ...o });
  const frac = (n, d, id, o) => ({ k: 'frac', n: wrap(n), d: wrap(d), id, ...o });
  const row = (...items) => ({ k: 'row', items: items.flat().filter(Boolean).map(wrap) });
  const paren = (inner, id, o) => ({ k: 'paren', inner: wrap(inner), br: '()', id, ...o });
  const mat = (rows, id, o) => ({ k: 'mat', rows: rows.map(r => r.map(wrap)), id, ...o });
  const slot = (id, o) => ({ k: 'slot', id, fill: null, ...o });
  const gap = w => ({ k: 'gap', w });
  function wrap(x) { return x == null ? null : typeof x === 'object' ? x : typeof x === 'number' ? num(x) : /^[a-zA-Z]$/.test(x) ? vr(x) : txt(x); }
  // d/dx as a node
  const ddx = (x = 'x', id) => frac(txt('d'), row(txt('d'), vr(x)), id, { small: true });

  // ---------------- layout ----------------
  // lay(node, s) -> { w, a (ascent above baseline), d (descent below) }; s is the font size in px.
  function lay(n, s) {
    if (!n) return { w: 0, a: 0, d: 0 };
    let m;
    switch (n.k) {
      case 'num': { mc.font = NUMF(s); const neg = n.v.startsWith('−'); const w = mc.measureText(neg ? n.v.slice(1) : n.v).width + (neg ? s * 0.42 : 0); m = { w, a: s * 0.74, d: s * 0.06 }; break; }
      case 'var': mc.font = VARF(s); m = { w: mc.measureText(n.v).width + s * 0.08, a: s * 0.72, d: s * 0.12 }; break;
      case 'txt': mc.font = NUMF(s, 500); m = { w: mc.measureText(n.v).width, a: s * 0.74, d: s * 0.12 }; break;
      case 'op': { const pad = n.v === ',' ? s * 0.08 : s * 0.22; mc.font = NUMF(s, 500); const w = n.v === '−' ? s * 0.5 : mc.measureText(n.v).width; m = { w: w + pad * 2, a: s * 0.6, d: s * 0.05, pad }; break; }
      case 'gap': m = { w: n.w, a: 0, d: 0 }; break;
      case 'sup': { const b = lay(n.base, s), e = lay(n.exp, s * 0.62); m = { w: b.w + e.w + s * 0.04, a: Math.max(b.a, s * 0.42 + e.a), d: b.d, b, e }; break; }
      case 'frac': { const fs = n.small ? s * 0.62 : s * 0.82, a = lay(n.n, fs), b = lay(n.d, fs), w = Math.max(a.w, b.w) + s * 0.24; m = { w: w + s * 0.12, a: s * 0.3 + a.a + a.d + s * 0.1, d: -s * 0.3 + s * 0.1 + b.a + b.d + s * 0.08, fs, na: a, nb: b, bw: w }; break; }
      case 'row': { let w = 0, a = 0, d = 0; const ms = n.items.map(it => lay(it, s)); for (const q of ms) { w += q.w; a = Math.max(a, q.a); d = Math.max(d, q.d); } m = { w, a, d, ms }; break; }
      case 'paren': { const i = lay(n.inner, s), pw = s * 0.32; m = { w: i.w + pw * 2, a: Math.max(i.a, s * 0.78) + s * 0.06, d: Math.max(i.d, s * 0.16) + s * 0.06, i, pw }; break; }
      case 'mat': {
        const cs = n.rows.map(r => r.map(c => lay(c, s))), nc = Math.max(...n.rows.map(r => r.length));
        const colW = [...Array(nc)].map((_, j) => Math.max(s * 0.7, ...cs.map(r => r[j] ? r[j].w : 0))), rh = s * 1.18, cg = s * 0.55, bw = s * 0.3;
        const h = rh * n.rows.length, w = colW.reduce((p, q) => p + q, 0) + cg * (nc - 1) + bw * 2 + s * 0.2;
        m = { w, a: h / 2 + s * 0.3, d: h / 2 - s * 0.3, cs, colW, rh, cg, bw, h }; break;
      }
      case 'slot': { const f = n.fill ? lay(n.fill, s) : null, w = Math.max(n.w || s * 0.95, f ? f.w + s * 0.3 : 0); m = { w: w + s * 0.12, a: s * 0.86, d: s * 0.2, f, bw: w }; break; }
      default: m = { w: 0, a: 0, d: 0 };
    }
    n._m = m; return m;
  }

  // draw(c, n, x, y, s, ctx): x is the left edge, y the baseline. ctx = { box, t, glow } records boxes into ctx.box[id].
  function draw(c, n, x, y, s, X) {
    if (!n) return; const m = n._m || lay(n, s);
    if (n.id && X.box) X.box[n.id] = { x: x + m.w / 2, y: y - (m.a - m.d) / 2, w: m.w, h: m.a + m.d, s };
    if (n.hide) return;
    const popK = n.pop != null && X.t != null ? clamp((X.t - n.pop) / 0.35, 0, 1) : 1, sc = (1 + Math.sin(popK * Math.PI) * 0.35) * (n.sc ?? 1);
    c.save(); c.translate((n.dx || 0) + (n._gx || 0), (n.dy || 0) + (n._gy || 0)); if (n.alpha != null) c.globalAlpha *= n.alpha;
    if (n._born != null && X.t != null) { const k = clamp((X.t - n._born) / 0.28, 0, 1); c.globalAlpha *= k; if (k >= 1) n._born = null; }
    if (sc !== 1) { const cx = x + m.w / 2, cy = y - (m.a - m.d) / 2; c.translate(cx, cy); c.scale(sc, sc); c.translate(-cx, -cy); }
    // write-in (manim's Write): the node is revealed left to right, with a bright pen tip at the leading edge
    let wk = 1; if (n.write && X.t != null) { wk = clamp((X.t - n.write.t0) / n.write.dur, 0, 1); if (wk >= 1) n.write = null; else { c.beginPath(); c.rect(x - s * 0.3, y - m.a - s, (m.w + s * 0.6) * easeIO(wk), m.a + m.d + s * 2); c.clip(); } }
    let col = n.mark === 'good' ? GOOD : n.mark === 'bad' ? BAD : (n.col || X.col || INK);
    if (n.hl > 0.01) { col = mix(col, n.hlc || HL, n.hl); c.shadowColor = n.hlc || HL; c.shadowBlur = 18 * n.hl; X = { ...X, col }; }
    c.fillStyle = col; c.strokeStyle = col; c.textBaseline = 'alphabetic'; c.textAlign = 'left';
    switch (n.k) {
      case 'num': { c.font = NUMF(s); let xx = x;
        // odometer roll (n.roll = { from, t0, dur }): the old value slides up and out while the new one rolls in from below
        // the window is exactly one line of digits tall (cap height plus a little), so the two numbers never show whole at once
        if (n.roll && X.t != null) { const k = easeIO((X.t - n.roll.t0) / n.roll.dur), d = s * 0.9;
          if (k < 1) { c.save(); c.beginPath(); c.rect(x - s * 0.5, y - s * 0.8, m.w + s, s * 0.88); c.clip(); const a0 = c.globalAlpha;
            c.globalAlpha = a0 * (1 - k); c.fillText(String(n.roll.from).replace(/^-/, '−'), xx, y - k * d); c.globalAlpha = a0 * k; c.fillText(n.v, xx, y + (1 - k) * d); c.restore(); break; }
          n.roll = null; }
        if (n.v.startsWith('−')) { c.lineWidth = s * 0.09; c.lineCap = 'round'; c.beginPath(); c.moveTo(xx + s * 0.06, y - s * 0.3); c.lineTo(xx + s * 0.34, y - s * 0.3); c.stroke(); xx += s * 0.42; c.fillText(n.v.slice(1), xx, y); } else c.fillText(n.v, xx, y); break; }
      case 'var': c.font = VARF(s); c.fillText(n.v, x + s * 0.02, y); break;
      case 'txt': c.font = NUMF(s, 500); c.fillText(n.v, x, y); break;
      case 'op': {
        c.lineWidth = s * 0.08; c.lineCap = 'round'; const cx = x + m.w / 2, cy = y - s * 0.3, r = s * 0.2;
        c.beginPath();
        if (n.v === '−') { c.moveTo(cx - r, cy); c.lineTo(cx + r, cy); c.stroke(); }
        else if (n.v === '+') { c.moveTo(cx - r, cy); c.lineTo(cx + r, cy); c.moveTo(cx, cy - r); c.lineTo(cx, cy + r); c.stroke(); }
        else if (n.v === '×') { const q = r * 0.75; c.moveTo(cx - q, cy - q); c.lineTo(cx + q, cy + q); c.moveTo(cx + q, cy - q); c.lineTo(cx - q, cy + q); c.stroke(); }
        else if (n.v === '=') { c.moveTo(cx - r, cy - r * 0.45); c.lineTo(cx + r, cy - r * 0.45); c.moveTo(cx - r, cy + r * 0.45); c.lineTo(cx + r, cy + r * 0.45); c.stroke(); }
        else if (n.v === '·') { c.arc(cx, cy, s * 0.06, 0, 7); c.fill(); }
        else { c.font = NUMF(s, 500); c.fillText(n.v, x + m.pad, y); }
        break;
      }
      case 'sup': draw(c, n.base, x, y, s, X); draw(c, n.exp, x + m.b.w + s * 0.04, y - s * 0.42, s * 0.62, X); break;
      case 'frac': {
        const bx = x + s * 0.06, cy = y - s * 0.3;
        draw(c, n.n, bx + (m.bw - m.na.w) / 2, cy - s * 0.1 - m.na.d, m.fs, X); draw(c, n.d, bx + (m.bw - m.nb.w) / 2, cy + s * 0.1 + m.nb.a, m.fs, X);
        // n.bar = { t0, dur }: the fraction bar draws itself from left to right
        const bk = n.bar && X.t != null ? easeIO((X.t - n.bar.t0) / n.bar.dur) : 1; if (bk >= 1 && X.t != null) n.bar = null; // only a timed (real) draw ends the animation; the measuring pass has no time
        if (bk > 0) { c.fillStyle = col; c.beginPath(); roundRectK(c, bx, cy - s * 0.035, Math.max(s * 0.07, m.bw * bk), s * 0.07, s * 0.035); c.fill(); } break;
      }
      case 'row': { let xx = x; n.items.forEach((it, i) => { draw(c, it, xx, y, s, X); xx += m.ms[i].w; }); break; }
      case 'paren': { bracket(c, x + m.pw * 0.55, y - m.a, y + m.d, -1, s, n.br, col); draw(c, n.inner, x + m.pw, y, s, X); bracket(c, x + m.w - m.pw * 0.55, y - m.a, y + m.d, 1, s, n.br, col); break; }
      case 'mat': {
        const top = y - m.a + s * 0.06, bot = y + m.d;
        bracket(c, x + m.bw * 0.5, top, bot, -1, s, '[]', col); bracket(c, x + m.w - m.bw * 0.5, top, bot, 1, s, '[]', col);
        n.rows.forEach((r, i) => { let xx = x + m.bw + s * 0.1; const by = y - m.a + s * 0.06 + m.rh * (i + 0.5) + s * 0.3;
          r.forEach((cell, j) => { const cm = m.cs[i][j]; draw(c, cell, xx + (m.colW[j] - cm.w) / 2, by, s, X); xx += m.colW[j] + m.cg; }); });
        break;
      }
      case 'slot': {
        const bx = x + s * 0.06, top = y - m.a, h = m.a + m.d;
        if (!n.fill) { c.save(); c.fillStyle = 'rgba(255,255,255,0.55)'; c.beginPath(); roundRectK(c, bx, top, m.bw, h, s * 0.2); c.fill(); c.setLineDash([s * 0.14, s * 0.1]); c.lineWidth = s * 0.06; c.strokeStyle = n.col || MID; c.beginPath(); roundRectK(c, bx, top, m.bw, h, s * 0.2); c.stroke(); c.restore();
          c.font = NUMF(s * 0.8, 600); c.fillStyle = 'rgba(122,74,90,0.55)'; c.textAlign = 'center'; c.fillText('?', bx + m.bw / 2, y - s * 0.02); }
        else draw(c, n.fill, bx + (m.bw - m.f.w) / 2, y, s, X);
        break;
      }
    }
    // n.strike = { t0, dur, col }: a stroke crosses the node out (factors cancelling, a term leaving)
    if (n.strike && X.t != null) { const k = easeIO((X.t - n.strike.t0) / n.strike.dur); if (k > 0) { c.shadowBlur = 0; c.strokeStyle = n.strike.col || '#ff6a5a'; c.lineWidth = Math.max(3, s * 0.09); c.lineCap = 'round';
      const x0 = x - s * 0.08, y0 = y + m.d + s * 0.02, x1 = x + m.w + s * 0.08, y1 = y - m.a + s * 0.02; c.beginPath(); c.moveTo(x0, y0); c.lineTo(lerp(x0, x1, k), lerp(y0, y1, k)); c.stroke(); } }
    if (wk < 1 && wk > 0) { c.restore(); c.save(); const px = x + (m.w + s * 0.3) * easeIO(wk) - s * 0.3, py = y - (m.a - m.d) / 2; c.globalAlpha = 0.9; c.fillStyle = '#fffbe0'; c.shadowColor = HL; c.shadowBlur = 12; c.beginPath(); c.arc(px, py, Math.max(2.5, s * 0.07), 0, 7); c.fill(); }
    c.restore();
  }
  // mix two colours ('#rrggbb' or '#rgb'); anything else returns b once k > 0.5
  function hex(h) { h = String(h); if (/^#[0-9a-f]{3}$/i.test(h)) h = '#' + [...h.slice(1)].map(q => q + q).join(''); return /^#[0-9a-f]{6}$/i.test(h) ? [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)) : null; }
  function mix(a, b, k) { const p = hex(a), q = hex(b); if (!p || !q) return k > 0.5 ? b : a; return `rgb(${p.map((v, i) => Math.round(v + (q[i] - v) * clamp(k, 0, 1))).join(',')})`; }
  function bracket(c, x, top, bot, dir, s, kind, col) {
    c.save(); c.strokeStyle = col; c.lineWidth = s * 0.075; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
    if (kind === '[]') { const w = s * 0.14; c.moveTo(x - dir * w, top); c.lineTo(x, top); c.lineTo(x, bot); c.lineTo(x - dir * w, bot); }
    else { const w = s * 0.12, mid = (top + bot) / 2; c.moveTo(x - dir * w, top); c.quadraticCurveTo(x + dir * w * 0.9, mid, x - dir * w, bot); }
    c.stroke(); c.restore();
  }
  function roundRectK(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function find(n, id) { if (!n) return null; if (n.id === id) return n; for (const ch of [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || []), ...(n.rows ? n.rows.flat() : [])]) { const f = find(ch, id); if (f) return f; } return null; }

  // ---------------- per-microgame state ----------------
  // MK.setup(g) must be called first in init. Expressions are placed with MK.place(g, key, node, cx, baseline, size):
  // the node is laid out centred on cx with its baseline at `baseline`, and every token's box goes into g.s.mk.box.
  function setup(g) { g.s.mk = { ex: {}, box: {}, flies: [], busyT: 0, moveT: 0, missAt: -1, stars: 0, fx: [], press: null, opts: null, timers: [] }; return g.s.mk; }
  function place(g, key, node, cx, y, s, o = {}) { const M = g.s.mk; const m = lay(node, s); M.ex[key] = { node, x: cx - (o.left ? 0 : m.w / 2), y, s, col: o.col, still: o.still }; relayout(g, key); return M.ex[key]; }
  function relayout(g, key) { const M = g.s.mk, e = M.ex[key]; if (!e) return; lay(e.node, e.s); draw(nullCtx, e.node, e.x, e.y, e.s, { box: M.box }); }
  const nullCtx = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; return cv.getContext('2d'); })(); // a 1x1 canvas: drawing into it just records boxes
  // Manim-style motion (the owner asked for 3Blue1Brown-like equations): when an expression is rewritten, every symbol
  // that is still there glides from where it was to where it now is, and new symbols fade in. Positions are tracked
  // per node object, so this works whether or not a node has an id. It never blocks input.
  const lastPos = new WeakMap(), GLIDE = 0.32;
  function collect(n, out) { if (!n) return; out.push(n); for (const ch of [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || []), ...(n.rows ? n.rows.flat() : [])]) collect(ch, out); }
  function drawEx(g, c, key) {
    const M = g.s.mk, e = M.ex[key]; if (!e) return; lay(e.node, e.s);
    const tmp = {}, all = []; collect(e.node, all);
    for (const n of all) n._pid = n._pid || ('_' + Math.random().toString(36).slice(2, 9)); // a private id so every node records a box
    const ids = new Map(all.map(n => [n, n.id])); for (const n of all) if (!n.id) n.id = n._pid;
    draw(nullCtx, e.node, e.x, e.y, e.s, { box: tmp });
    const LEAF = /^(num|var|txt|op|slot)$/, isNew = n => !lastPos.has(n), allNew = n => { const q = []; collect(n, q); return q.filter(x => LEAF.test(x.k)).every(isNew); };
    for (const n of all) {
      const b = tmp[n.id]; if (!b) continue; const prev = lastPos.get(n), first = !M.seen || !M.seen[key];
      if (!prev && !first && !n._born && !LEAF.test(n.k) && !allNew(n)) { lastPos.set(n, { x: b.x, y: b.y }); continue; } // a new wrapper around old symbols: the symbols glide, nothing fades
      if (e.still) { n._glide = null; lastPos.set(n, { x: b.x, y: b.y }); n._ax = n._ay = 0; continue; } // placed with { still: true }: the game moves it itself
      if (prev && (Math.abs(prev.x - b.x) > 1.5 || Math.abs(prev.y - b.y) > 1.5)) n._glide = { dx: prev.x - b.x + (n._ax || 0), dy: prev.y - b.y + (n._ay || 0), t0: g.t };
      else if (!prev && !first && !n._born) n._born = g.t;
      lastPos.set(n, { x: b.x, y: b.y });
      // _ax/_ay: how far this symbol should appear from its new place right now (on screen, not relative to its parent)
      if (n._glide) { const k = ease(clamp((g.t - n._glide.t0) / GLIDE, 0, 1)); n._ax = n._glide.dx * (1 - k); n._ay = n._glide.dy * (1 - k); if (k >= 1) { n._glide = null; n._ax = n._ay = 0; } }
      else n._ax = n._ay = 0;
    }
    // drawing translates a child by its parents' offsets too, so each node draws with its own offset minus its parent's
    // (otherwise a symbol inside a gliding bracket or fraction slid twice as far)
    const par = new Map(); (function walk(n, p) { if (!n) return; par.set(n, p); for (const ch of [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || []), ...(n.rows ? n.rows.flat() : [])]) walk(ch, n); })(e.node, null);
    for (const n of all) { const p = par.get(n); n._gx = (n._ax || 0) - (p ? p._ax || 0 : 0); n._gy = (n._ay || 0) - (p ? p._ay || 0 : 0); }
    // symbols that vanished since the last frame fly into the nearest newly born symbol and fade (4 and 3 merge into 12)
    const prevT = (M.prevT = M.prevT || {})[key], prev = prevT != null && g.t - prevT < 0.15 ? ((M.prevNodes = M.prevNodes || {})[key] || []) : [], cur = new Set(all), born = all.filter(n => n._born === g.t && tmp[n.id]);
    for (const p of prev) { if (cur.has(p.n) || !p.vis || !/^(num|var|txt|op)$/.test(p.n.k)) continue; // a symbol already faded out leaves no ghost
      let best = null, bd = 160; for (const n of born) { const b = tmp[n.id], d = Math.hypot(b.x - p.b.x, b.y - p.b.y); if (d < bd) { bd = d; best = b; } }
      (M.ghosts = M.ghosts || []).push({ n: { ...p.n, alpha: 1, pop: null, mark: null, dx: 0, dy: 0, _gx: 0, _gy: 0, _born: null, id: undefined }, a: p.b, b: best || p.b, t0: g.t, s: p.s, merge: !!best }); }
    // vis: the symbol could be seen (no hidden or faded-out ancestor), so only symbols that were really on screen in the
    // last frame leave a ghost (a note key that was not drawn for a while and is then reused never brings old symbols back)
    const seenA = n => { let a = 1; for (let q = n; q; q = par.get(q)) { if (q.hide) return 0; a *= q.alpha ?? 1; } return a; };
    (M.prevNodes = M.prevNodes || {})[key] = all.filter(n => tmp[n.id]).map(n => ({ n, b: tmp[n.id], s: tmp[n.id].s, vis: seenA(n) > 0.05 })); M.prevT[key] = g.t;
    (M.seen = M.seen || {})[key] = true;
    // every node records its box (anonymous ones under their private id), so helpers can also be given node objects
    draw(c, e.node, e.x, e.y, e.s, { box: M.box, t: g.t, col: e.col });
    for (const [n, id] of ids) n.id = id; // restore real ids (undefined for anonymous nodes)
    if (M.ghosts && M.ghosts.length) { M.ghosts = M.ghosts.filter(q => g.t - q.t0 < 0.34);
      for (const q of M.ghosts) { const k = ease(clamp((g.t - q.t0) / 0.32, 0, 1)), x = lerp(q.a.x, q.b.x, k), y = lerp(q.a.y, q.b.y, k), sz = q.s * (q.merge ? 1 - 0.35 * k : 1);
        const m = lay(q.n, sz); c.save(); c.globalAlpha *= 1 - k; draw(c, q.n, x - m.w / 2, y + (m.a - m.d) / 2, sz, { t: g.t, col: e.col }); c.restore(); } }
  }
  function box(g, id) { return g.s.mk.box[id]; }
  // MK.zone(g, id, { x, y, w, h }): a tappable/droppable area that is not a token (a grid region, an animal, a pan); x, y = centre
  function zone(g, id, b) { const M = g.s.mk; (M.zones = M.zones || {})[id] = true; M.box[id] = { s: 40, ...b }; }
  // ids that can never be tapped (labels, the d/dx sign, the = sign...): taps on them are ignored, never misses
  function inert(g, list) { const M = g.s.mk; M.inert = new Set([...(M.inert || []), ...list]); }
  function node(g, id) { for (const e of Object.values(g.s.mk.ex)) { const f = find(e.node, id); if (f) return f; } return null; }

  // ---------------- glow (guidance) ----------------
  function glowBox(c, b, t, strength = 1, round = false) {
    if (!b) return; const p = 0.5 + 0.5 * Math.sin(t * 7), pad = 8 + p * 3;
    c.save(); c.globalAlpha *= strength;
    c.shadowColor = GLOW; c.shadowBlur = 18 + p * 10; c.strokeStyle = `rgba(255,214,80,${0.75 + p * 0.25})`; c.lineWidth = 4;
    c.beginPath(); if (round) c.arc(b.x, b.y, Math.max(b.w, b.h) / 2 + pad, 0, 7); else roundRectK(c, b.x - b.w / 2 - pad, b.y - b.h / 2 - pad, b.w + pad * 2, b.h + pad * 2, 12); c.stroke();
    c.shadowBlur = 0; c.fillStyle = `rgba(255,236,150,${0.16 + p * 0.1})`; c.fill();
    for (let i = 0; i < 3; i++) { const a = t * 2.2 + i * 2.1, r = Math.max(b.w, b.h) / 2 + 14; c.fillStyle = '#fff6c0'; star4(c, b.x + Math.cos(a) * r, b.y + Math.sin(a) * r * 0.7, 3 + p * 2); }
    c.restore();
  }
  function star4(c, x, y, r) { c.beginPath(); c.moveTo(x, y - r * 2); c.quadraticCurveTo(x, y, x + r * 2, y); c.quadraticCurveTo(x, y, x, y + r * 2); c.quadraticCurveTo(x, y, x - r * 2, y); c.quadraticCurveTo(x, y, x, y - r * 2); c.fill(); }
  function unionBox(bs) { bs = bs.filter(Boolean); if (!bs.length) return null; const x0 = Math.min(...bs.map(b => b.x - b.w / 2)), x1 = Math.max(...bs.map(b => b.x + b.w / 2)), y0 = Math.min(...bs.map(b => b.y - b.h / 2)), y1 = Math.max(...bs.map(b => b.y + b.h / 2)); return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 }; }
  const ids = v => v == null ? [] : Array.isArray(v) ? v : [v];
  // a pointing hand, for the level-0 guidance (drawn with its fingertip at x, y)
  function hand(c, x, y, s = 1, press = 0) {
    c.save(); c.translate(x, y); c.scale(s, s); c.translate(0, press * 3); c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(-4, 4); c.quadraticCurveTo(-4, -2, 0, -2); c.quadraticCurveTo(4, -2, 4, 4); c.lineTo(4, 16); c.lineTo(12, 18); c.quadraticCurveTo(16, 20, 15, 28); c.lineTo(12, 36); c.lineTo(-6, 36); c.lineTo(-12, 24); c.quadraticCurveTo(-13, 20, -9, 20); c.lineTo(-4, 24); c.closePath(); c.fill(); c.stroke(); c.restore();
  }

  // ---------------- moves ----------------
  // MK.play(g, { moves, area, onMiss, onWin }) runs a microgame. moves(g) returns every move that is valid right now:
  //   { tap: id | [ids], then(g, id), busy }                          — tap that part of the problem
  //   { drag: id | [ids], to: id | [ids], then(g, from, to), busy }   — drag one part onto another. Drops are forgiving:
  //       anywhere within `reach` px (64 by default) of a target counts, and so does anywhere inside `area: [x0, y0, x1, y1]`
  // List every move that is mathematically valid at this moment, so the player may work in any valid order; the
  // first move is the one the level-0 guidance shows. `then` starts the move's animation (which does the arithmetic
  // and rewrites the expression); `busy` is how many seconds it needs, and input waits until it ends. When moves(g)
  // returns an empty list after an animation, the problem is solved and the microgame is won.
  // area(g) (optional) returns the ids to glow at level 1: the part of the problem that matters next.
  // Two modes (g.mode): in 'easy' the animation does all the arithmetic. In 'medium' a move may carry
  //   ask: { v: 12, wrong: [7, 3, 4] }, resolve(g), askAt, after
  // then() shows the computation (say "4 · 3"), and after askAt seconds (0 by default: at once) the player picks the result
  // from a tray of tiles; the right tile runs resolve(g) (which shows 12) and the animation continues for `after`
  // seconds. In easy mode resolve(g) simply runs by itself after askAt. A wrong tile is a miss.
  // A tap or drop on any other part is a wrong move: the part turns red and wobbles, the dragged part snaps back, and
  // the player tries again (only the timer ends a microgame). Dropping on empty space is not counted. Taps on ids passed
  // to MK.inert are ignored.
  function play(g, o) { const M = g.s.mk; M.opts = o; M.moveT = g.t; }
  function current(g) { const M = g.s.mk; if (!M.opts) return []; try { return M.opts.moves(g) || []; } catch (e) { console.error('moves', e); return []; } }
  // MK.steps(g, [move | { parts: [move, ...] }, ...], opts): the same thing for a fixed order; a { parts } entry is a set of
  // moves that may come in any order.
  function steps(g, list, o = {}) {
    const M = g.s.mk; M.stepList = list; M.step = 0; M.doneParts = {};
    play(g, { ...o, moves(g) { const st = M.stepList[M.step]; if (!st) return []; if (!st.parts) return [st]; return st.parts.filter((p, i) => !M.doneParts[i]); } });
    M.stepAdvance = (mv) => { const st = M.stepList[M.step]; if (!st) return; if (st.parts) { const i = st.parts.indexOf(mv); if (i >= 0) M.doneParts[i] = 1; if (st.parts.every((p, k) => M.doneParts[k])) { M.step++; M.doneParts = {}; } } else { M.step++; } };
  }
  function accept(g, mv, a, b) {
    const M = g.s.mk; const n = node(g, a); if (n) n.pop = g.t; g.sfx('pop');
    if (M.stepAdvance) M.stepAdvance(mv);
    M.busyT = mv.busy ?? 0.12; M.lastMove = g.t;
    try { if (mv.then) mv.then(g, a, b); } catch (e) { console.error('move', e); }
    if (mv.ask && mv.resolve) {
      if (g.mode === 'medium') { M.busyT = 1e9; if (mv.askAt) later(g, mv.askAt, g => openAsk(g, mv)); else openAsk(g, mv); }
      else if (mv.askAt) later(g, mv.askAt, mv.resolve, true); else mv.resolve(g);
    }
  }
  // A wrong move never ends the microgame (the owner's rule: failing at once makes it hard to see what went wrong).
  // The part turns red and wobbles for a moment, the right move keeps glowing, and the player tries again; only the
  // timer can end the microgame. M.wrong counts wrong moves (for stars).
  function miss(g, info) {
    const M = g.s.mk, id = info.to || info.tap || info.drag, n = node(g, id), src = info.drag ? node(g, info.drag) : null;
    for (const q of [n, src]) if (q) { q.pop = g.t; if (q.mark !== 'good') { q.mark = 'bad'; later(g, 0.6, () => { if (q.mark === 'bad') q.mark = null; }); } }
    M.missAt = g.t; M.missInfo = info; M.wrong = (M.wrong || 0) + 1; M.wobbleAt = g.t; g.sfx('boing');
    if (M.onMiss) M.onMiss(g, info);
    return false;
  }
  // MK.onMiss(g, fn): fn(g, info) runs after every wrong move (info is the move: { tap } or { drag, to }, or { ask } for a wrong tray tile)
  function onMiss(g, fn) { g.s.mk.onMiss = fn; }
  function hitToken(g, x, y, skip) {
    const M = g.s.mk; let hit = null, best = 1e9;
    for (const [id, b] of Object.entries(M.box)) {
      if (id === skip || (M.inert && M.inert.has(id))) continue; const n = node(g, id); if (n ? n.hide : !(M.zones && M.zones[id])) continue; // stale boxes of tokens that are gone are skipped
      if (Math.abs(x - b.x) <= b.w / 2 + 10 && Math.abs(y - b.y) <= b.h / 2 + 12) { const d = Math.hypot(x - b.x, y - b.y) + (b.w * b.h) * 0.002; if (d < best) { best = d; hit = id; } }
    }
    return hit;
  }
  const busy = M => M.busyT > 0;
  function down(g, x, y) {
    const M = g.s.mk; if (g.done) return;
    if (M.ask && !M.ask.closing) { const i = askHit(g, x, y); if (i >= 0) pickAsk(g, i); return; } // a closing tray never swallows taps
    if (busy(M)) return; const id = hitToken(g, x, y); if (!id) return;
    M.press = { id, x0: x, y0: y, x, y, dragging: false, t: g.t };
  }
  function move(g, x, y) {
    const M = g.s.mk, P0 = M.press; if (!P0 || g.done) return; P0.x = x; P0.y = y;
    if (!P0.dragging && Math.hypot(x - P0.x0, y - P0.y0) > 10 && current(g).some(m => m.drag)) { P0.dragging = true; const n = node(g, P0.id); if (n) { P0.prevAlpha = n.alpha; n.alpha = 0.28; } g.sfx('tap'); }
  }
  function up(g, x, y) {
    const M = g.s.mk, P0 = M.press; M.press = null; if (!P0 || g.done) return; P0.x = x; P0.y = y;
    const src = node(g, P0.id), mvs = current(g);
    if (P0.dragging) {
      if (src) src.alpha = P0.prevAlpha;
      const tgt = hitToken(g, x, y, P0.id);
      let mv = tgt && mvs.find(m => m.drag && ids(m.drag).includes(P0.id) && ids(m.to).includes(tgt)), to = tgt;
      // forgiving drops (the owner's rule): if this part has a valid target, a drop near it counts, and so does a drop
      // in the move's `area` (for example "anywhere on the other side of the equation": area: [x0, y0, x1, y1]).
      const onOther = tgt && !(M.inert && M.inert.has(tgt)); // dropped right on a different part: that is a real (wrong) choice
      if (!mv && !onOther) { let best = 1e9; for (const m of mvs) { if (!m.drag || !ids(m.drag).includes(P0.id)) continue;
        if (m.area && x >= m.area[0] && x <= m.area[2] && y >= m.area[1] && y <= m.area[3]) { mv = m; to = ids(m.to)[0]; break; }
        for (const id of ids(m.to)) { const b = M.box[id]; if (!b) continue; const dx = Math.max(0, Math.abs(x - b.x) - b.w / 2), dy = Math.max(0, Math.abs(y - b.y) - b.h / 2), d = Math.hypot(dx, dy);
          if (d < (m.reach ?? 64) && d < best) { best = d; mv = m; to = id; } } } }
      if (mv) { accept(g, mv, P0.id, to); return; }
      if (tgt && !(M.inert && M.inert.has(tgt))) { if (miss(g, { drag: P0.id, to: tgt })) return; }
      // snap back
      const b = M.box[P0.id]; if (src && b) { src.alpha = 0; fly(g, { node: { ...src, alpha: 1, mark: null, pop: null, dx: 0, dy: 0 }, from: [x, y], to: [b.x, b.y], dur: 0.22, arc: 0, s0: b.s, s1: b.s, then() { src.alpha = P0.prevAlpha; } }); }
      return;
    }
    // a tap
    const mv = mvs.find(m => m.tap && ids(m.tap).includes(P0.id));
    if (mv) { accept(g, mv, P0.id); return; }
    if (mvs.some(m => m.drag && ids(m.drag).includes(P0.id))) { if (src) src.pop = g.t; M.dragHintAt = g.t; return; } // right part, but it wants dragging: show how
    miss(g, { tap: P0.id });
  }

  // ---------------- the answer tray (medium mode) ----------------
  const TRAY_Y = 566;
  function openAsk(g, mv) {
    const M = g.s.mk, right = mv.ask.v, seen = new Set([JSON.stringify(right)]);
    const wrong = (mv.ask.wrong || []).filter(w => { const k = JSON.stringify(w); if (seen.has(k) || w == null || (typeof w === 'number' && !Number.isFinite(w))) return false; seen.add(k); return true; }).slice(0, 3);
    const list = [{ v: right, ok: true }, ...wrong.map(v => ({ v }))];
    for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
    const n = list.length, tw = n > 3 ? 74 : 86, gap = n > 3 ? 10 : 16, total = n * tw + (n - 1) * gap;
    list.forEach((ch, i) => { ch.node = wrap(typeof ch.v === 'number' ? num(ch.v) : ch.v); ch.x = 180 - total / 2 + tw / 2 + i * (tw + gap); ch.y = TRAY_Y; ch.w = tw; ch.h = 74; ch.s = 34; lay(ch.node, ch.s); });
    M.ask = { mv, list, t0: g.t }; g.sfx('pop');
  }
  function askHit(g, x, y) { const A = g.s.mk.ask; if (!A) return -1; return A.list.findIndex(ch => Math.abs(x - ch.x) <= ch.w / 2 + 4 && Math.abs(y - ch.y) <= ch.h / 2 + 6); }
  function pickAsk(g, i) {
    const M = g.s.mk, A = M.ask, ch = A.list[i]; ch.at = g.t; A.pickAt = g.t;
    if (ch.ok) { ch.state = 'good'; g.sfx('coin'); A.closing = g.t; later(g, 0.25, g => { if (M.ask === A) M.ask = null; }); try { A.mv.resolve(g); } catch (e) { console.error('resolve', e); } M.busyT = Math.max(A.mv.after ?? 0.05, (M.showUntil || 0) - g.t); }
    else { if (ch.state === 'bad') return; ch.state = 'bad'; M.missAt = g.t; M.missInfo = { ask: ch.v }; M.wrong = (M.wrong || 0) + 1; g.sfx('boing'); if (M.onMiss) M.onMiss(g, M.missInfo); }
  }
  function drawAsk(g, c) {
    const M = g.s.mk, A = M.ask; if (!A) return;
    if (g.done && g.result === 'fail' && !A.list.some(q => q.state)) { const r = A.list.find(q => q.ok); if (r) r.state = 'answer'; }
    const out = A.closing ? clamp((g.t - A.closing) / 0.25, 0, 1) : 0;
    A.list.forEach((ch, i) => {
      const kk = ease((g.t - A.t0 - i * 0.04) / 0.25) * (1 - out); if (kk <= 0) return;
      const st = ch.state, sh = st === 'bad' && g.t - ch.at < 0.4 ? Math.sin((g.t - ch.at) * 60) * 5 : 0, pr = ch.at && g.t - ch.at < 0.12 ? 3 : 0;
      c.save(); c.translate(ch.x + sh, ch.y + (1 - kk) * 40 + pr); c.globalAlpha *= kk;
      c.fillStyle = 'rgba(58,22,64,0.25)'; c.beginPath(); roundRectK(c, -ch.w / 2, -ch.h / 2 + 5 - pr, ch.w, ch.h, 18); c.fill();
      const gr = c.createLinearGradient(0, -ch.h / 2, 0, ch.h / 2);
      const [a, b] = st === 'good' ? ['#dff7df', '#a8e2b0'] : st === 'bad' ? ['#ffe0dc', '#f4a8a4'] : st === 'answer' ? ['#fff4c0', '#ffd86a'] : ['#fffaf0', '#f2e2c8'];
      gr.addColorStop(0, a); gr.addColorStop(1, b); c.fillStyle = gr; c.beginPath(); roundRectK(c, -ch.w / 2, -ch.h / 2, ch.w, ch.h, 18); c.fill();
      c.strokeStyle = st === 'good' ? GOOD : st === 'bad' ? BAD : '#8a5a4a'; c.lineWidth = 3; c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); roundRectK(c, -ch.w / 2 + 8, -ch.h / 2 + 5, ch.w - 16, 12, 6); c.fill();
      const m = ch.node._m || lay(ch.node, ch.s); draw(c, ch.node, -m.w / 2, (m.a - m.d) / 2, ch.s, { t: g.t });
      c.restore();
    });
    // level 0: the right tile lights up after a moment
    if (!g.done && g.t - A.t0 > 1.0) { const r = A.list.find(q => q.ok); if (r) glowBox(c, { x: r.x, y: r.y, w: r.w, h: r.h }, g.t, Math.min(1, (g.t - A.t0 - 1) * 3)); }
  }

  // ---------------- guidance ----------------
  // level 0: the first valid move glows (a tap target, or a drag source with a ghost hand sliding to its target);
  // level 1: only the area(g) ids glow; level 2: nothing. After a miss or a timeout, the move that was right glows.
  function drawGuide(g, c) {
    const M = g.s.mk; if (M.ask || busy(M) || M.press && M.press.dragging) return;
    const failed = g.done && g.result === 'fail';
    if (g.done && !failed) return; if (failed && g.t - g.doneAt < 0.3) return;
    const mv = current(g)[0]; if (!mv) return;
    // the owner's rule: the next valid move always glows, at every level. The ghost hand demonstrates it at level 0,
    // and at higher levels only after the player has paused for 2 seconds.
    const showHand = failed || g.level === 0 || g.t - M.moveT > 2;
    if (mv.tap) { const b = unionBox(ids(mv.tap).slice(0, 1).map(i => M.box[i])); glowBox(c, b, g.t); if (b && showHand && g.t - M.moveT > 0.35) { const k = (g.t * 1.6) % 1; hand(c, b.x + 4, b.y + 6, 1, Math.sin(k * Math.PI)); } return; }
    if (mv.drag) {
      const a = M.box[ids(mv.drag)[0]], b = M.box[ids(mv.to)[0]]; if (!a || !b) return;
      glowBox(c, a, g.t); glowBox(c, b, g.t, 0.45);
      if (!showHand) return;
      const k = ((g.t - M.moveT) * 0.75) % 1, e = easeIO(clamp((k - 0.15) / 0.7, 0, 1)), mx = lerp(a.x, b.x, e), my = lerp(a.y, b.y, e) - Math.sin(e * Math.PI) * 40;
      c.save(); c.setLineDash([6, 8]); c.lineDashOffset = -g.t * 30; c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 3; c.lineCap = 'round';
      c.beginPath(); c.moveTo(a.x, a.y); c.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 - 80, b.x, b.y); c.stroke(); c.restore();
      const an = node(g, ids(mv.drag)[0]); if (an && k > 0.1 && k < 0.9) { c.save(); c.globalAlpha = 0.55; const m = lay(an, a.s); draw(c, { ...an, alpha: 1, pop: null, mark: null, dx: 0, dy: 0 }, mx - m.w / 2, my + (m.a - m.d) / 2, a.s, { t: g.t }); c.restore(); }
      hand(c, mx + 4, my + 8, 1, k < 0.12 || k > 0.88 ? 1 : 0);
    }
  }
  function drawDrag(g, c) {
    const M = g.s.mk, P0 = M.press; if (!P0 || !P0.dragging) return; const n = node(g, P0.id), b = M.box[P0.id]; if (!n || !b) return;
    const s = b.s * 1.12, m = lay(n, s); c.save(); c.shadowColor = 'rgba(58,22,64,0.35)'; c.shadowBlur = 12; c.shadowOffsetY = 6;
    draw(c, { ...n, alpha: 1, pop: null, mark: null, dx: 0, dy: 0 }, P0.x - m.w / 2, P0.y - 20 + (m.a - m.d) / 2, s, { t: g.t }); c.restore();
    const tgt = hitToken(g, P0.x, P0.y - 20, P0.id); if (tgt) glowBox(c, M.box[tgt], g.t, 0.5);
  }
  function update(g, dt) {
    const M = g.s.mk; if (!M) return;
    for (const f of M.flies) { f.k = clamp((g.t - f.t0) / f.dur, 0, 1); if (f.k >= 1 && !f.landed) { f.landed = true; if (f.then) f.then(g); } }
    M.flies = M.flies.filter(f => !f.landed || f.keep);
    M.fx = M.fx.filter(p => g.t - p.t0 < p.life);
    for (const tm of M.timers.filter(tm => g.t >= tm.at)) { M.timers.splice(M.timers.indexOf(tm), 1); try { tm.fn(g); } catch (e) { console.error('later', e); } }
    runTweens(g); if (!g.done && g.t < (M.showUntil || 0)) g.held = (g.held || 0) + dt; // the fuse stands still while work is shown
    if (M.busyT > 0) { M.busyT -= dt; if (M.busyT <= 0) { M.busyT = 0; M.moveT = g.t; } }
    if (!g.done && M.opts && !busy(M) && !showing(g) && !M.timers.some(tm => tm.hold) && !current(g).length) finish(g);
  }
  // MK.later(g, seconds, fn): run fn(g) after that many seconds of game time (for multi-beat animations)
  function later(g, dt, fn, hold) { g.s.mk.timers.push({ at: g.t + dt, fn, hold }); } // hold: the microgame can't be won before it runs
  function finish(g) {
    const M = g.s.mk; if (g.done) return; const k = (g.t - (g.held || 0)) / (g.dur / (g.tf || 1)); // fraction of the base time (before the generous factor)
    M.stars = Math.max(1, (k < 0.6 ? 3 : k < 1.1 ? 2 : 1) - (M.wrong ? 1 : 0)); g.stars = M.stars; M.winAt = g.t;
    if (M.opts && M.opts.onWin) M.opts.onWin(g); g.win();
    for (let i = 0; i < 18; i++) M.fx.push({ t0: g.t + i * 0.01, life: 1.1, x: 180, y: 300, a: Math.random() * 7, v: 120 + Math.random() * 200, col: ['#ffd45a', '#ff8a5a', '#7ad0ff', '#9ae07a'][i % 4] });
  }
  // generic test bot: waits a beat, then makes the first valid move (a tap, or a drag in a few pointer moves)
  function auto(g, dt, synth, o = {}) {
    const M = g.s.mk; if (g.done) return;
    if (M.ask) { if (!M.ask.closing && g.t - M.ask.t0 > (o.wait ?? 0.3)) { const i = M.ask.list.findIndex(q => q.ok); const ch = M.ask.list[i]; synth('down', ch.x, ch.y); synth('up', ch.x, ch.y); } return; }
    if (busy(M) || g.t - M.moveT < (o.wait ?? 0.3)) return;
    const mv = current(g)[0]; if (!mv) return;
    let did = false;
    if (mv.tap) { const b = M.box[ids(mv.tap)[0]]; if (b) { synth('down', b.x, b.y); synth('up', b.x, b.y); did = true; } }
    else if (mv.drag) { const a = M.box[ids(mv.drag)[0]], b = M.box[ids(mv.to)[0]]; if (a && b) { synth('down', a.x, a.y); for (let i = 1; i <= 4; i++) synth('move', lerp(a.x, b.x, i / 4), lerp(a.y, b.y, i / 4)); synth('up', b.x, b.y); did = true; } }
    if (did) M.moveT = g.t + 5; // don't repeat while the move's animation starts (a move resets moveT when its busy time ends)
  }

  // ---------------- show your work (manim-style beats) ----------------
  // The owner's rule: every operation is acted out slowly enough to see what happens, and it plays by itself.
  // A move's then() / resolve() schedule beats with the helpers below; MK.show(g, seconds) marks how long they run.
  // While a show runs, input waits and the fuse stands still (g.held grows), so the animation never costs time.
  // MK.pace(g) is the tempo factor (1 at level 0, quicker as guidance fades and the run speeds up): multiply every
  // beat time by it. Targets are ids or node objects; positions are read from the boxes at draw time.
  function pace(g) { return [1, 0.82, 0.68][Math.min(2, g.level || 0)] / Math.sqrt(Math.max(1, g.speed || 1)); }
  function show(g, sec) { const M = g.s.mk; M.showUntil = Math.max(M.showUntil || 0, g.t + sec); M.busyT = Math.max(M.busyT, sec); return sec; }
  function showing(g) { const M = g.s.mk; return M && g.t < (M.showUntil || 0); }
  const nodeOf = (g, n) => typeof n === 'string' ? node(g, n) : n;
  // MK.tween(g, target, { sc, hl, alpha, dx, dy }, dur, { delay, yoyo, ease }): animate node properties. With yoyo the
  // values go to the target and back (a pulse). Returns the end time offset.
  function tween(g, tgt, to, dur, o = {}) { const n = nodeOf(g, tgt); if (!n) return 0; (g.s.mk.tweens = g.s.mk.tweens || []).push({ n, to, from: null, t0: g.t + (o.delay || 0), dur, yoyo: o.yoyo, ease: o.ease || easeIO }); return (o.delay || 0) + dur; }
  const DEF = { sc: 1, hl: 0, alpha: 1, dx: 0, dy: 0 };
  function runTweens(g) { const M = g.s.mk; if (!M.tweens) return;
    M.tweens = M.tweens.filter(tw => { if (g.t < tw.t0) return true; if (!tw.from) { tw.from = {}; for (const k in tw.to) tw.from[k] = tw.n[k] ?? DEF[k]; }
      const k = clamp((g.t - tw.t0) / tw.dur, 0, 1), e = tw.yoyo ? Math.sin(k * Math.PI) : tw.ease(k);
      for (const key in tw.to) tw.n[key] = tw.from[key] + (tw.to[key] - tw.from[key]) * e; if (k >= 1) { if (tw.yoyo) for (const key in tw.to) tw.n[key] = tw.from[key]; return false; } return true; }); }
  // manim's Indicate: the part swells and lights up, then settles
  function indicate(g, tgt, o = {}) { const n = nodeOf(g, tgt); if (!n) return 0; if (o.col) n.hlc = o.col; return tween(g, n, { sc: (n.sc ?? 1) * (o.sc || 1.3), hl: 1 }, o.dur || 0.5, { delay: o.delay, yoyo: true }); } // relative to the current size
  // a lasting highlight (until MK.unlight)
  function light(g, tgt, o = {}) { const n = nodeOf(g, tgt); if (!n) return 0; if (o.col) n.hlc = o.col; return tween(g, n, { hl: 1 }, o.dur || 0.2, { delay: o.delay }); }
  function unlight(g, tgt, o = {}) { return tween(g, tgt, { hl: 0 }, o.dur || 0.25, { delay: o.delay }); }
  // odometer: the number's value changes by rolling (3 rolls over to 4)
  function roll(g, tgt, v, o = {}) { const n = nodeOf(g, tgt); if (!n) return 0; const from = n.v, d = o.dur || 0.4, t0 = g.t + (o.delay || 0);
    if (o.delay) later(g, o.delay, () => { n.roll = { from, t0, dur: d }; n.v = String(v).replace(/^-/, '−'); if (g.s.mk.relay) g.s.mk.relay(); }); else { n.roll = { from, t0, dur: d }; n.v = String(v).replace(/^-/, '−'); }
    return (o.delay || 0) + d; }
  function writeIn(g, tgt, o = {}) { const n = nodeOf(g, tgt); if (!n) return 0; n.write = { t0: g.t + (o.delay || 0), dur: o.dur || 0.4 }; return (o.delay || 0) + (o.dur || 0.4); }
  function strike(g, tgt, o = {}) { const n = nodeOf(g, tgt); if (!n) return 0; n.strike = { t0: g.t + (o.delay || 0), dur: o.dur || 0.25, col: o.col }; return (o.delay || 0) + (o.dur || 0.25); }
  // overlay animations drawn on top of the expressions: { t0, dur, draw(c, g, k, t) }
  function anim(g, a) { const M = g.s.mk; a.t0 = g.t + (a.delay || 0); (M.anims = M.anims || []).push(a); return (a.delay || 0) + a.dur; }
  function drawAnims(g, c) { const M = g.s.mk; if (!M.anims) return; M.anims = M.anims.filter(a => g.t < a.t0 + a.dur + (a.linger || 0)); for (const a of M.anims) { if (g.t < a.t0) continue; c.save(); try { a.draw(c, g, clamp((g.t - a.t0) / a.dur, 0, 1), g.t - a.t0); } catch (e) { console.error('anim', e); } c.restore(); } }
  const boxOf = (g, tgt) => Array.isArray(tgt) && typeof tgt[0] === 'number' ? { x: tgt[0], y: tgt[1], w: 0, h: 0, s: tgt[2] || 30 } : unionBox(ids(tgt).map(i => typeof i === 'string' ? g.s.mk.box[i] : i && i.k ? g.s.mk.box[i.id || i._pid] : i)); // ids, node objects or boxes
  // manim's Circumscribe: a glowing loop is drawn around the part, then fades
  function circle(g, tgt, o = {}) { const dur = o.dur || 0.6, col = o.col || HL, pad = o.pad ?? 7;
    return anim(g, { delay: o.delay, dur, draw(c, g, k) { const b = boxOf(g, tgt); if (!b) return; const w = b.w + pad * 2, h = b.h + pad * 2, r = Math.min(h / 2, 16), per = 2 * (w + h);
      c.globalAlpha = k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3; c.strokeStyle = col; c.shadowColor = col; c.shadowBlur = 12; c.lineWidth = 3.5; c.lineCap = 'round';
      c.setLineDash([per * easeIO(Math.min(1, k / 0.6)), per * 2]); c.beginPath(); roundRectK(c, b.x - w / 2, b.y - h / 2, w, h, r); c.stroke(); } }); }
  // MK.note(g, { node, at: [x, y] | id, off: [dx, dy], s, col, delay, write, hold, to: [x, y] | id, fly, s1, fade, then, pill }):
  // a small chalk-style working note ("+1", "6 ÷ 3 = 2") writes itself next to the problem, stays a moment, then either
  // flies into its place in the expression (and calls then) or fades away. This is the "showing your work" voice.
  function note(g, o) { const nd = wrap(o.node), wr = o.write ?? 0.35, hold = o.hold ?? 0.3, fl = o.to ? (o.fly ?? 0.35) : 0, fade = o.to ? 0 : (o.fade ?? 0.3), dur = wr + hold + fl + fade, s0 = o.s || 28, col = o.col || HL;
        const where = () => { const b = boxOf(g, o.at || [180, 300]) || { x: 180, y: 300 }; return { x: b.x + (o.off ? o.off[0] : 0), y: b.y + (o.off ? o.off[1] : 0) }; };
    if (o.to && o.then) later(g, (o.delay || 0) + wr + hold + fl, o.then, true); // the landing runs on the game clock, not in draw
    return anim(g, { delay: o.delay, dur, draw(c, g, k, t) {
      const p = where(); let x = p.x, y = p.y, sz = s0, al = 1, wk = clamp(t / wr, 0, 1);
      if (t > wr + hold && o.to) { const kk = easeIO((t - wr - hold) / fl), b0 = boxOf(g, o.to) || p, b = o.toOff ? { ...b0, x: b0.x + o.toOff[0], y: b0.y + o.toOff[1] } : b0; x = lerp(p.x, b.x, kk); y = lerp(p.y, b.y, kk) - Math.sin(kk * Math.PI) * (o.arc ?? 36); sz = lerp(s0, o.s1 || (b.s || s0), kk); if (kk >= 1) return; }
      else if (t > wr + hold) al = 1 - (t - wr - hold) / fade;
      const m = lay(nd, sz); if (!(t > wr + hold && o.to)) x = clamp(x, m.w / 2 + 10, 350 - m.w / 2); // keep a note inside the 360-wide screen
      c.globalAlpha = clamp(al, 0, 1); c.shadowColor = 'rgba(0,0,0,0.35)'; c.shadowBlur = 6;
      if (o.pill) { c.save(); c.shadowBlur = 0; c.fillStyle = typeof o.pill === 'string' ? o.pill : 'rgba(20,24,40,0.72)'; c.beginPath(); roundRectK(c, x - m.w / 2 - 9, y - sz * 0.72, m.w + 18, sz * 1.44, sz * 0.5); c.fill(); c.restore(); } // a dark pill behind the note, for busy scenes
      if (wk < 1) { c.beginPath(); c.rect(x - m.w / 2 - 4, y - sz * 1.5, (m.w + 8) * easeIO(wk), sz * 3); c.clip(); }
      draw(c, nd, x - m.w / 2, y + (m.a - m.d) / 2, sz, { t: g.t, col });
      if (wk < 1) { c.shadowColor = col; c.shadowBlur = 10; c.fillStyle = '#fffbe0'; c.beginPath(); c.arc(x - m.w / 2 - 4 + (m.w + 8) * easeIO(wk), y, 3, 0, 7); c.fill(); }
    } }); }
  // a curved arrow that draws itself from one place to another, with an optional label at its middle
  function arrow(g, from, to, o = {}) { const dur = o.dur || 0.45, col = o.col || HL;
    return anim(g, { delay: o.delay, dur, linger: o.linger ?? 0.4, draw(c, g, k, t) { const a = boxOf(g, from), b = boxOf(g, to); if (!a || !b) return;
      const fadeK = t > dur ? 1 - (t - dur) / (o.linger ?? 0.4) : 1, e = easeIO(k), bend = o.bend ?? -40, L = Math.hypot(b.x - a.x, b.y - a.y) || 1, mx = (a.x + b.x) / 2 + (b.y - a.y) / L * bend, my = (a.y + b.y) / 2 - (b.x - a.x) / L * bend; // bend > 0: bows to the left of the direction of travel
      const q = u => ({ x: (1 - u) * (1 - u) * a.x + 2 * (1 - u) * u * mx + u * u * b.x, y: (1 - u) * (1 - u) * a.y + 2 * (1 - u) * u * my + u * u * b.y });
      c.globalAlpha = clamp(fadeK, 0, 1); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 3; c.lineCap = 'round'; c.shadowColor = col; c.shadowBlur = 8; c.beginPath();
      for (let i = 0; i <= 24; i++) { const p = q(e * i / 24); i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y); } c.stroke();
      const p1 = q(e), p0 = q(Math.max(0, e - 0.05)), an = Math.atan2(p1.y - p0.y, p1.x - p0.x); c.beginPath(); c.moveTo(p1.x + Math.cos(an) * 8, p1.y + Math.sin(an) * 8); c.lineTo(p1.x + Math.cos(an + 2.4) * 9, p1.y + Math.sin(an + 2.4) * 9); c.lineTo(p1.x + Math.cos(an - 2.4) * 9, p1.y + Math.sin(an - 2.4) * 9); c.fill();
      if (o.label && e > 0.4) { const lb = wrap(o.label), ls = o.ls || 22, m = lay(lb, ls), p = q(0.5); c.globalAlpha *= clamp((e - 0.4) / 0.3, 0, 1); draw(c, lb, p.x - m.w / 2, p.y - 8, ls, { t: g.t, col }); } } }); }
  // a burst of sparkles at a part (for landings)
  function sparkle(g, tgt, o = {}) { return later(g, o.delay || 0, g => { const b = boxOf(g, tgt); if (b) g.burst(b.x, b.y, o.cols || ['#ffe9a0', '#fff', '#ffb21f'], o.n || 10, o.v || 120); }); }
  // run fn(g) at each time: MK.at(g, [[0, fn], [0.4, fn], ...])
  function at(g, list) { for (const [t, fn] of list) { if (t <= 0) fn(g); else later(g, t, fn, true); } }

  // ---------------- flying numbers ----------------
  // MK.fly(g, { node, from: [x, y] | 'id', to: [x, y] | 'id', dur, arc, s0, s1, then, keep }) — a copy of node travels on an arc.
  function fly(g, o) {
    const M = g.s.mk, pt = p => Array.isArray(p) ? { x: p[0], y: p[1], s: null } : M.box[p] ? { ...M.box[p] } : { x: 180, y: 300 };
    const f = { node: wrap(o.node), a: pt(o.from), b: pt(o.to), t0: g.t + (o.delay || 0), dur: o.dur || 0.5, arc: o.arc ?? -60, s0: o.s0 || (pt(o.from).s || 40), s1: o.s1 || (pt(o.to).s || pt(o.from).s || 40), then: o.then, keep: o.keep, k: 0, col: o.col };
    M.flies.push(f); return f;
  }
  function drawFlies(g, c) {
    for (const f of g.s.mk.flies) {
      if (g.t < f.t0) continue; const k = easeIO(f.k), x = lerp(f.a.x, f.b.x, k), y = lerp(f.a.y, f.b.y, k) + Math.sin(k * Math.PI) * f.arc, s = lerp(f.s0, f.s1, k) * (1 + Math.sin(k * Math.PI) * 0.25);
      const m = lay(f.node, s); c.save(); c.shadowColor = 'rgba(255,210,80,0.9)'; c.shadowBlur = 14; draw(c, f.node, x - m.w / 2, y + (m.a - m.d) / 2, s, { t: g.t, col: f.col }); c.restore();
    }
  }
  // stars and confetti on a win; a small "+" sparkle burst helper
  function drawFx(g, c) {
    const M = g.s.mk;
    for (const p of M.fx) { const k = (g.t - p.t0) / p.life; if (k < 0) continue; c.save(); c.globalAlpha = 1 - k; c.fillStyle = p.col; const x = p.x + Math.cos(p.a) * p.v * k, y = p.y + Math.sin(p.a) * p.v * k + 160 * k * k; c.translate(x, y); c.rotate(k * 6 + p.a); c.fillRect(-4, -2, 8, 4); c.restore(); }
    if (g.done && g.result === 'win' && M.stars) {
      const k = g.t - M.winAt;
      for (let i = 0; i < 3; i++) { const kk = clamp((k - 0.12 * i) / 0.3, 0, 1); if (kk <= 0) continue; const on = i < M.stars, x = 180 + (i - 1) * 54, y = 156 - (i === 1 ? 10 : 0), r = 22 * (on ? 1 + Math.sin(kk * Math.PI) * 0.4 : 0.85);
        c.save(); c.globalAlpha = kk; c.fillStyle = on ? '#ffd23a' : 'rgba(255,255,255,0.35)'; c.strokeStyle = on ? '#a8641a' : 'rgba(90,50,60,0.4)'; c.lineWidth = 3; c.beginPath(); for (let j = 0; j < 10; j++) { const rr = j % 2 ? r * 0.48 : r, a = j * Math.PI / 5 - Math.PI / 2; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); c.stroke(); c.restore(); }
    }
  }
  // a paper card to set an expression on (cx, cy centre)
  function card(c, cx, cy, w, h, o = {}) {
    c.save(); c.fillStyle = 'rgba(58,22,64,0.22)'; c.beginPath(); roundRectK(c, cx - w / 2, cy - h / 2 + 6, w, h, 22); c.fill();
    const gr = c.createLinearGradient(0, cy - h / 2, 0, cy + h / 2); gr.addColorStop(0, o.top || '#fffdf6'); gr.addColorStop(1, o.bot || '#f6ead6'); c.fillStyle = gr; c.beginPath(); roundRectK(c, cx - w / 2, cy - h / 2, w, h, 22); c.fill();
    c.strokeStyle = o.edge || 'rgba(122,74,90,0.55)'; c.lineWidth = 2.5; c.stroke(); c.restore();
  }
  // everything a microgame usually draws on top of its scene, in order: guidance glow, tray, flying numbers, effects
  function drawUI(g, c) { drawAnims(g, c); drawGuide(g, c); drawAsk(g, c); drawFlies(g, c); drawDrag(g, c); drawFx(g, c); }

  return { INK, MID, GOOD, BAD, GLOW, NUMF, VARF, num, vr, txt, op, sup, frac, row, paren, mat, slot, gap, ddx, wrap, lay, draw, find,
    setup, place, relayout, drawEx, box, zone, inert, node, glowBox, unionBox, hand, drawGuide, drawDrag, play, steps, current, later, drawAsk, update, finish, openAsk, miss, down, move, up, auto, fly, drawFlies, drawFx, card, drawUI, ease, easeIO, lerp, clamp,
    HL, mix, pace, show, showing, tween, indicate, light, unlight, roll, writeIn, strike, anim, drawAnims, circle, note, arrow, sparkle, at, onMiss };
})();
