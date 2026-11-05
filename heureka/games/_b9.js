// _b9.js — small shared helpers for builder b9's law, policy and problem-solving microgames (one global, B9).
// Everything here is drawing or bot plumbing; no game state lives here.
const B9 = (() => {
  const TAU = Math.PI * 2;
  // bold text, centred, with an optional dark outline so it reads on any background
  function txt(c, s, x, y, size = 20, col = '#fff6ea', o = {}) {
    c.save(); c.font = `${o.weight || 900} ${size}px Nunito, system-ui, sans-serif`; c.textAlign = o.align || 'center'; c.textBaseline = 'middle';
    if (o.stroke) { c.lineJoin = 'round'; c.lineWidth = o.lw || size * 0.22; c.strokeStyle = o.stroke; c.strokeText(s, x, y); }
    c.fillStyle = col; c.fillText(s, x, y); c.restore();
  }
  // a gold coin seen face on (r = radius); squash 0..1 flattens it as it spins
  function coin(c, x, y, r = 10, squash = 1) {
    c.save(); c.translate(x, y); c.scale(Math.max(0.15, Math.abs(squash)), 1);
    c.fillStyle = '#b9781c'; c.beginPath(); c.arc(1, 1.5, r, 0, TAU); c.fill();
    const gr = c.createRadialGradient(-r * 0.4, -r * 0.4, r * 0.1, 0, 0, r); gr.addColorStop(0, '#fff2b0'); gr.addColorStop(0.55, '#f6c445'); gr.addColorStop(1, '#d4921e');
    c.fillStyle = gr; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill(); c.strokeStyle = '#8a5410'; c.lineWidth = Math.max(1, r * 0.14); c.stroke();
    c.strokeStyle = 'rgba(138,84,16,0.55)'; c.lineWidth = Math.max(1, r * 0.1); c.beginPath(); c.arc(0, 0, r * 0.66, 0, TAU); c.stroke();
    c.restore();
  }
  // a point along a closed or open polyline of [x, y] points at fraction k (0..1)
  function along(pts, k) {
    let L = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    let want = Math.max(0, Math.min(1, k)) * L; for (let i = 0; i < seg.length; i++) { if (want <= seg[i] || i === seg.length - 1) { const f = seg[i] ? Math.min(1, want / seg[i]) : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; } want -= seg[i]; }
    return pts[pts.length - 1];
  }
  // a ring of n points around (cx, cy), starting at angle a0, going round `turns` times
  function ring(cx, cy, rx, ry, n = 24, a0 = 0, turns = 1) { const out = []; for (let i = 0; i <= n; i++) { const a = a0 + TAU * turns * i / n; out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return out; }
  // the ghost hand following a path (level 0, until the player touches): the action for traces and curved drags
  // (same timing as SK.demo: at level 0 from the start until the first touch, and at every level after 2-2.8 s idle)
  function demoPath(g, c, pts, o = {}) {
    if (g.done || (g.ptr && g.ptr.down)) return;
    const idle = g.t - (g.lastIn ?? 0), wait = [2.0, 2.4, 2.8][Math.min(2, g.level)]; let t0;
    if (g.level === 0 && !g.s.touched) t0 = o.delay ?? 0.9; else if (idle >= wait) t0 = (g.lastIn ?? 0) + wait; else return;
    if (g.t < t0) return;
    const per = o.period ?? 2.2, k = ((g.t - t0) % per) / per, fade = Math.min(1, (g.t - t0) * 4);
    const p = k < 0.1 ? k / 0.1 : k < 0.8 ? 1 : 1 - (k - 0.8) / 0.08, m = SK.easeInOut((k - 0.1) / 0.68);
    const [x, y] = along(pts, m);
    if (p > 0.3 && k < 0.85) { c.save(); c.globalAlpha = 0.38 * fade; c.strokeStyle = '#fff6ea'; c.lineWidth = 4; c.setLineDash([6, 8]); c.lineCap = 'round'; c.beginPath(); const n = 40; for (let i = 0; i <= n; i++) { const q = along(pts, m * i / n); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); } c.stroke(); c.restore(); }
    SK.hand(c, x, y, Math.max(0, Math.min(1, p)), 0.9 * fade * (k > 0.88 ? 0 : 1));
  }
  // the bot drags along a path: press at its start at time t, move along it for dur seconds, then lift. Call every frame.
  function botPath(g, synth, key, t, pts, dur) {
    const B = g.s._bot = g.s._bot || {}; if (B[key] === 2 || g.t < t) return B[key] === 2;
    if (!B[key]) { B[key] = 1; synth('down', pts[0][0], pts[0][1]); return false; }
    const k = Math.min(1, (g.t - t) / dur), [x, y] = along(pts, k); synth('move', x, y);
    if (k >= 1) { B[key] = 2; synth('up', x, y); } return B[key] === 2;
  }
  // a wooden table top filling a rectangle (painted into a bake)
  function wood(o, x, y, w, h, col = '#b0743e', seed = 3) {
    const rnd = P.rng(seed), gr = o.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, P.shade(col, 0.18)); gr.addColorStop(1, P.shade(col, -0.2));
    o.fillStyle = gr; o.fillRect(x, y, w, h);
    for (let i = 0; i < h / 6; i++) { o.strokeStyle = `rgba(${rnd() < 0.5 ? '90,46,20' : '255,220,170'},${0.08 + rnd() * 0.12})`; o.lineWidth = 1 + rnd() * 2; const yy = y + rnd() * h; o.beginPath(); o.moveTo(x, yy); o.bezierCurveTo(x + w * 0.3, yy + (rnd() - 0.5) * 8, x + w * 0.7, yy + (rnd() - 0.5) * 8, x + w, yy + (rnd() - 0.5) * 6); o.stroke(); }
  }
  return { TAU, txt, coin, along, ring, demoPath, botPath, wood };
})();
