// matrix_vecadd.js — VECTOR ADD! Add two vectors, on the card (as columns) and on a grid of seaweed lines in a sandy lagoon.
// Moves (any valid order), each acted out by itself (show your work; the fuse stands still while the working plays):
//  - slide: drag the second vector's arrow (or its column on the card) onto the first arrow's tip: it glides there,
//    tip to tail, and a ring pulses where they join. Dragging the first onto the second also works (a + b = b + a).
//  - for each component, drag the matching parts together (1 onto 2): both are circled, copies of the 2 and the 1 fly
//    into that answer slot to make "2 + 1", and on the grid that leg of the sum walks out step by step (the first
//    vector's steps, then the second's), each with its step count beside it.
//  - then tap "2 + 1": the "+ 1" slides into the 2, which rolls over to 3, and the leg turns gold with a 3 beside it.
//  When all are done, the gold sum arrow draws itself from the start of the first arrow to the tip of the second.
// Wrong move: dragging an x-part onto a y-part (mixing components). From level 1 up it is a miss: the steps are walked
// along the wrong line on the grid, with a red cross, and the octopus is puzzled.
// Level 0: 2D, components 0..3. Level 1: 2D with negatives. Level 2: 3D columns (x, y, z) on an oblique 3D grid.
// Medium mode: the tap on "2 + 1" opens a tray (distractors: product, difference, the other component's sum).
const M = MK;
const COL = { A: '#f2684a', Ad: '#bf3a20', B: '#8c63ea', Bd: '#5733c0', S: '#f8bf2e', Sd: '#9a5c06', Sb: '#c98a12' };
const KZ = [-0.42, -0.36]; // the z axis points toward the viewer: drawn down and to the left, a bit shorter
const clamp = M.clamp, lerp = M.lerp, ease = M.ease, easeIO = M.easeIO;
const AX = ['x', 'y', 'z'];
let T = 1; // the tempo (MK.pace) of the current microgame, set in init
const proj = v => [v[0] + (v[2] || 0) * KZ[0], v[1] + (v[2] || 0) * KZ[1]];
const unit = (k, n, d) => { const v = Array(d).fill(0); v[k] = n; return v; };

// ---------------- the problem ----------------
function fitGrid(S) {
  const d = S.dim, pts = [Array(d).fill(0), S.a, S.b, S.s];
  // every corner a component leg can start or turn at: partial sums, plus the first vector's steps from there
  for (let m = 0; m < 1 << d; m++) { const base = S.s.map((v, k) => (m >> k) & 1 ? v : 0); pts.push(base); for (let k = 0; k < d; k++) if (!((m >> k) & 1)) { const q = base.slice(); q[k] += S.a[k]; pts.push(q); } }
  const pp = pts.map(proj), xs = pp.map(p => p[0]), ys = pp.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), B = S.board;
  const u = Math.min(40, (B.x1 - B.x0 - 16) / (x1 - x0 + 1.3), (B.y1 - B.y0 - 16) / (y1 - y0 + 1.3));
  S.u = u; S.ox = (B.x0 + B.x1) / 2 - (x0 + x1) / 2 * u; S.oy = (B.y0 + B.y1) / 2 + (y0 + y1) / 2 * u;
}
const scr = (S, v) => { const p = proj(v); return [S.ox + p[0] * S.u, S.oy - p[1] * S.u]; };
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
function pick(g, S) {
  const L = g.level, R = (lo, hi) => lo + Math.floor(g.rand() * (hi - lo + 1)), d = L === 2 ? 3 : 2;
  const lo = L === 0 ? 0 : L === 1 ? -4 : -3, hi = L === 0 ? 3 : L === 1 ? 4 : 3, lim = L === 0 ? 6 : L === 1 ? 5 : 4;
  const ok = () => {
    const { a, b, s } = S;
    if (a.every(v => !v) || b.every(v => !v)) return false;
    if ([...a, ...b].filter(v => v === 0).length > 1) return false;
    if (d === 3 && (!a[2] || !b[2])) return false; // a 3D problem really uses z
    if (L >= 1 && ![...a, ...b].some(v => v < 0)) return false;
    if (s.some(v => Math.abs(v) > lim)) return false;
    const cr = d === 2 ? [a[0] * b[1] - a[1] * b[0]] : [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    if (cr.every(v => v === 0)) return false; // not parallel, so the tip-to-tail picture is a real triangle
    fitGrid(S); if (S.u < 21) return false;
    const o = scr(S, Array(d).fill(0)), ta = scr(S, a), tb = scr(S, b), ma = mid(o, ta), mb = mid(o, tb);
    if (dist(o, ta) < 38 || dist(o, tb) < 38 || dist(ta, tb) < 46 || dist(ma, mb) < 44 || dist(ta, mb) < 40 || dist(tb, ma) < 40) return false;
    if (dist(scr(S, S.s), ta) < 30 || dist(scr(S, S.s), tb) < 30) return false;
    return true;
  };
  for (let i = 0; i < 800; i++) {
    S.a = [...Array(d)].map(() => R(lo, hi)); S.b = [...Array(d)].map(() => R(lo, hi)); S.s = S.a.map((v, k) => v + S.b[k]);
    if (ok()) return;
  }
  [S.a, S.b] = L === 0 ? [[2, 1], [1, 3]] : L === 1 ? [[2, 3], [1, -4]] : [[2, 1, -2], [1, -3, 1]];
  S.s = S.a.map((v, k) => v + S.b[k]); fitGrid(S);
}
const term = v => v < 0 ? M.paren(M.num(v)) : M.num(v);
const sumRow = (S, k) => M.row(M.num(S.a[k], null, { col: COL.Ad }), M.op('+'), v2n(S.b[k], COL.Bd));
const v2n = (v, col) => v < 0 ? M.paren(M.num(v, null, { col }), null, { col }) : M.num(v, null, { col });

// ---------------- the world: a bright shallow lagoon seen from above ----------------
const shoreY = x => 58 + Math.sin(x * 0.021) * 7 + Math.sin(x * 0.057 + 1) * 3;
function lagoon(c, W, H) {
  // the beach at the top
  c.fillStyle = '#f7ebcb'; c.fillRect(0, 0, W, 90);
  const r0 = P.rng(5); for (let i = 0; i < 260; i++) { c.fillStyle = r0() < 0.5 ? 'rgba(200,160,100,0.25)' : 'rgba(255,255,255,0.6)'; c.fillRect(r0() * W, r0() * 80, 1.5, 1.5); }
  // shallow water over sand: pale near the shore, deeper turquoise further out
  const gr = c.createLinearGradient(0, 50, 0, H); gr.addColorStop(0, '#b8f2e2'); gr.addColorStop(0.12, '#7fe0dc'); gr.addColorStop(0.55, '#41c6d4'); gr.addColorStop(1, '#2aa6cc');
  c.fillStyle = gr; c.beginPath(); c.moveTo(0, H); for (let x = 0; x <= W; x += 4) c.lineTo(x, shoreY(x)); c.lineTo(W, H); c.closePath(); c.fill();
  // wet sand seen through the water: ripple marks
  const r1 = P.rng(17); c.lineCap = 'round';
  for (let i = 0; i < 120; i++) { const x = r1() * W, y = 80 + r1() * 560, w = 10 + r1() * 22; c.strokeStyle = r1() < 0.5 ? 'rgba(255,255,230,0.18)' : 'rgba(20,90,110,0.12)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - w, y); c.quadraticCurveTo(x, y - 5, x + w, y); c.stroke(); }
  // sea grass patches and coral heads at the edges, seen from above
  const patch = (x, y, n, rad) => { for (let i = 0; i < n; i++) { const a = r1() * 7, d = r1() * rad, px = x + Math.cos(a) * d, py = y + Math.sin(a) * d; c.strokeStyle = r1() < 0.5 ? 'rgba(40,120,80,0.55)' : 'rgba(70,150,90,0.5)'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(px, py); c.quadraticCurveTo(px + 4, py - 6, px + 2 + r1() * 6, py - 12); c.stroke(); } };
  patch(330, 150, 40, 30); patch(28, 168, 30, 24); patch(340, 600, 46, 34);
  const coral = (x, y, r, col) => { c.fillStyle = 'rgba(10,70,90,0.22)'; c.beginPath(); c.ellipse(x + 4, y + 6, r * 1.15, r, 0, 0, 7); c.fill();
    for (let i = 0; i < 9; i++) { const a = i / 9 * 7, rr2 = r * (0.5 + 0.2 * Math.sin(i * 3)); c.fillStyle = P.shade(col, (i % 3) * 0.1 - 0.05); c.beginPath(); c.arc(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.5, rr2, 0, 7); c.fill(); }
    c.fillStyle = 'rgba(255,255,255,0.25)'; for (let i = 0; i < 14; i++) { const a = r1() * 7, d = r1() * r; c.beginPath(); c.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.9, 1.5, 0, 7); c.fill(); } };
  coral(326, 560, 22, '#f08aa0'); coral(300, 620, 16, '#f4b25a'); coral(40, 140, 14, '#b48ae8');
  star5(c, 250, 606, 12, '#f07a3a', 0.5); star5(c, 340, 196, 9, '#e85a6a', 1.1); shell(c, 200, 626, 0.8, '#fbe2c8');
  // palm crowns over the beach, with their shadows on the sand
  const palmTop = (x, y, s, rot) => {
    c.save(); c.translate(x + 10, y + 12); c.fillStyle = 'rgba(80,60,20,0.18)'; for (let i = 0; i < 7; i++) { c.save(); c.rotate(rot + i * 0.9); c.beginPath(); c.ellipse(26 * s, 0, 28 * s, 7 * s, 0, 0, 7); c.fill(); c.restore(); } c.restore();
    c.save(); c.translate(x, y);
    for (let i = 0; i < 7; i++) { c.save(); c.rotate(rot + i * 0.9); const g2 = c.createLinearGradient(0, 0, 54 * s, 0); g2.addColorStop(0, '#2f7a3a'); g2.addColorStop(1, '#6fbf4a'); c.fillStyle = g2; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(28 * s, -12 * s, 56 * s, 2 * s); c.quadraticCurveTo(28 * s, 8 * s, 0, 0); c.fill();
      c.strokeStyle = 'rgba(20,70,30,0.5)'; c.lineWidth = 1; c.beginPath(); c.moveTo(4 * s, 0); c.quadraticCurveTo(28 * s, -3 * s, 54 * s, 2 * s); c.stroke(); c.restore(); }
    c.fillStyle = '#7a5a2a'; c.beginPath(); c.arc(0, 0, 6 * s, 0, 7); c.fill(); c.restore();
  };
  palmTop(-6, 8, 1.1, 0.3); palmTop(362, 18, 1.0, 1.8);
  // a beach towel and a bucket, tiny, for scale
  c.save(); c.translate(250, 26); c.rotate(-0.12); c.fillStyle = '#ff8a7a'; c.fillRect(-20, -9, 40, 18); c.fillStyle = '#fff4e0'; for (let i = 0; i < 3; i++) c.fillRect(-20 + i * 14 + 4, -9, 5, 18); c.restore();
  P.vignette(c, W, H, 0.16, '#0a4a60');
}
// a light-net of caustics, baked once and slid around
function causticTile(c, W, H) {
  const r = P.rng(33); c.strokeStyle = 'rgba(255,255,255,1)'; c.lineCap = 'round'; c.lineJoin = 'round';
  for (let i = 0; i < 140; i++) { const x = r() * W, y = r() * H, n = 3 + Math.floor(r() * 3), rad = 10 + r() * 16; c.lineWidth = 1 + r() * 1.6; c.beginPath();
    for (let j = 0; j <= n; j++) { const a = j / n * Math.PI * 2 + r() * 0.4, d = rad * (0.7 + r() * 0.5); if (j === 0) c.moveTo(x + Math.cos(a) * d, y + Math.sin(a) * d); else c.quadraticCurveTo(x + Math.cos(a - 0.6) * d * 1.3, y + Math.sin(a - 0.6) * d * 1.3, x + Math.cos(a) * d, y + Math.sin(a) * d); }
    c.stroke(); }
}
function shell(c, x, y, s, col) {
  c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = 'rgba(20,80,90,0.2)'; c.beginPath(); c.ellipse(2, 3, 11, 4, 0, 0, 7); c.fill();
  c.fillStyle = col; c.strokeStyle = P.shade(col, -0.35); c.lineWidth = 1.2; c.beginPath(); c.moveTo(-10, 0); c.quadraticCurveTo(-10, -13, 0, -13); c.quadraticCurveTo(10, -13, 10, 0); c.lineTo(3, 2); c.lineTo(-3, 2); c.closePath(); c.fill(); c.stroke();
  for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(0, 1); c.lineTo(i * 4.2, -11 + Math.abs(i) * 1.6); c.stroke(); }
  c.restore();
}
function star5(c, x, y, r, col, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = 'rgba(10,70,90,0.22)'; c.beginPath(); c.arc(3, 4, r * 0.9, 0, 7); c.fill();
  c.beginPath(); for (let j = 0; j < 10; j++) { const rr2 = j % 2 ? r * 0.42 : r, a = j * Math.PI / 5 - Math.PI / 2; c.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } c.closePath();
  c.fillStyle = col; c.fill(); c.strokeStyle = P.shade(col, -0.35); c.lineWidth = 1.4; c.stroke();
  c.fillStyle = 'rgba(255,240,210,0.8)'; for (let j = 0; j < 5; j++) { const a = j * Math.PI * 2 / 5 - Math.PI / 2; c.beginPath(); c.arc(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5, 1.2, 0, 7); c.fill(); }
  c.restore();
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
// a fishing float under a number, seen from above: coloured caps, a white middle for the digits, a ring of ripples
function float(c, b, fs, col, t, ph, dim, bad) {
  if (bad) col = M.BAD;
  const h = fs * 1.0, w = Math.max(b.w + fs * 0.75, fs * 1.25), x = b.x + (bad ? Math.sin(t * 40) * 2 : 0), y = b.y + Math.sin(t * 1.8 + ph) * 1.1, r = h / 2;
  const k = (t * 0.4 + ph * 0.23) % 1; c.save();
  c.strokeStyle = `rgba(255,255,255,${0.45 * (1 - k)})`; c.lineWidth = 1.5; rr(c, x - w / 2 - 3 - k * 10, y - r - 3 - k * 7, w + 6 + k * 20, h + 6 + k * 14, r + 3 + k * 7); c.stroke();
  c.globalAlpha *= dim ? 0.5 : 1;
  c.fillStyle = 'rgba(10,70,90,0.28)'; rr(c, x - w / 2 + 3, y - r + 5, w, h, r); c.fill();
  c.save(); rr(c, x - w / 2, y - r, w, h, r); c.clip();
  c.fillStyle = col; c.fillRect(x - w / 2, y - r, w, h);
  const g2 = c.createLinearGradient(0, y - r, 0, y + r); g2.addColorStop(0, '#ffffff'); g2.addColorStop(1, '#f1ead8'); c.fillStyle = g2; c.fillRect(x - w / 2 + fs * 0.3, y - r, w - fs * 0.6, h);
  c.fillStyle = 'rgba(255,255,255,0.4)'; c.fillRect(x - w / 2, y - r + 2, w, h * 0.22);
  c.restore();
  c.strokeStyle = P.shade(col, -0.35); c.lineWidth = 1.6; rr(c, x - w / 2, y - r, w, h, r); c.stroke();
  c.restore();
}
// a driftwood plank under an answer slot
function plank(c, b, t, ph, gold) {
  const w = b.w + 18, h = b.h + 10, x = b.x - w / 2, y = b.y - h / 2 + Math.sin(t * 1.6 + ph) * 1.2;
  c.save(); c.fillStyle = 'rgba(10,70,90,0.28)'; rr(c, x + 4, y + 6, w, h, 10); c.fill();
  const g2 = c.createLinearGradient(0, y, 0, y + h); g2.addColorStop(0, gold ? '#fff0b8' : '#e8c48a'); g2.addColorStop(1, gold ? '#f2c860' : '#c99a5a'); c.fillStyle = g2; rr(c, x, y, w, h, 10); c.fill();
  c.strokeStyle = 'rgba(120,80,40,0.35)'; c.lineWidth = 1.2; for (let i = 1; i < 3; i++) { c.beginPath(); c.moveTo(x + 8, y + h * i / 3); c.bezierCurveTo(x + w * 0.3, y + h * i / 3 - 3, x + w * 0.6, y + h * i / 3 + 3, x + w - 8, y + h * i / 3); c.stroke(); }
  c.strokeStyle = gold ? '#c08a12' : '#8a5a2a'; c.lineWidth = 2; rr(c, x, y, w, h, 10); c.stroke();
  c.fillStyle = '#6a4a2a'; c.beginPath(); c.arc(x + 6, y + h / 2, 1.8, 0, 7); c.arc(x + w - 6, y + h / 2, 1.8, 0, 7); c.fill();
  c.restore();
}
// a sand dollar under + and =
function sandDollar(c, b, t, ph) {
  const r = Math.max(b.w, b.h) * 0.52, x = b.x, y = b.y + Math.sin(t * 1.7 + ph) * 1;
  c.save(); c.fillStyle = 'rgba(10,70,90,0.25)'; c.beginPath(); c.arc(x + 3, y + 5, r, 0, 7); c.fill();
  c.fillStyle = '#f4ead4'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = '#c8b08a'; c.lineWidth = 1.5; c.stroke();
  c.strokeStyle = 'rgba(180,150,110,0.45)'; for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5 - Math.PI / 2; c.beginPath(); c.ellipse(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.22, r * 0.08, a, 0, 7); c.stroke(); }
  c.restore();
}
// the grid: a smooth sand flat under clear water, ripple ridges for grid lines, and ropes for the axes
function drawBoard(c, S, t, caus) {
  const B = S.board, u = S.u;
  c.save(); c.shadowColor = 'rgba(240,250,220,0.9)'; c.shadowBlur = 16; c.fillStyle = 'rgba(244,240,206,0.92)'; rr(c, B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0, 26); c.fill(); c.restore();
  c.save(); rr(c, B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0, 26); c.clip();
  const g2 = c.createLinearGradient(0, B.y0, 0, B.y1); g2.addColorStop(0, 'rgba(150,230,220,0.22)'); g2.addColorStop(1, 'rgba(90,200,210,0.3)'); c.fillStyle = g2; c.fillRect(B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0);
  const wx0 = Math.ceil((B.x0 - S.ox) / u), wx1 = Math.floor((B.x1 - S.ox) / u), wy0 = Math.ceil((S.oy - B.y1) / u), wy1 = Math.floor((S.oy - B.y0) / u);
  const ridge = (x0, y0, x1, y1) => { c.strokeStyle = 'rgba(160,130,80,0.42)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 + 1.4, y0 + 1.6); c.lineTo(x1 + 1.4, y1 + 1.6); c.stroke(); c.strokeStyle = 'rgba(255,253,236,0.95)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); };
  for (let i = wx0; i <= wx1; i++) if (i) { const x = S.ox + i * u; ridge(x, B.y0, x, B.y1); }
  for (let j = wy0; j <= wy1; j++) if (j) { const y = S.oy - j * u; ridge(B.x0, y, B.x1, y); }
  // light dancing over the sand
  if (caus) { c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = 0.14; c.drawImage(caus, -((t * 6) % 360), -((t * 4) % 640) + 0, 720, 1280); c.restore(); }
  const rope = (p0, p1, a = 1) => {
    c.save(); c.globalAlpha *= a; c.lineCap = 'round'; c.strokeStyle = 'rgba(10,70,90,0.25)'; c.lineWidth = 5; c.beginPath(); c.moveTo(p0[0] + 2, p0[1] + 3); c.lineTo(p1[0] + 2, p1[1] + 3); c.stroke();
    c.strokeStyle = '#a87a42'; c.lineWidth = 4; c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.stroke();
    c.strokeStyle = '#e8c890'; c.lineWidth = 2; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.stroke(); c.restore();
  };
  const o = [S.ox, S.oy]; let zEnd = null;
  rope([B.x0, S.oy], [B.x1, S.oy]); rope([S.ox, B.y1], [S.ox, B.y0]);
  // little corks on the axis ropes, one per step, so steps can be counted
  const cork = (x, y) => { c.fillStyle = '#f2d27a'; c.strokeStyle = '#a8742a'; c.lineWidth = 1.2; c.beginPath(); c.arc(x, y, 3.2, 0, 7); c.fill(); c.stroke(); };
  for (let i = wx0; i <= wx1; i++) if (i) cork(S.ox + i * u, S.oy); for (let j = wy0; j <= wy1; j++) if (j) cork(S.ox, S.oy - j * u);
  if (S.dim === 3) { // the z axis comes toward you: down and to the left; its far half is faint
    const dz = [KZ[0] * u, -KZ[1] * u]; let k = 1; while (k < 14 && o[0] + dz[0] * (k + 1) > B.x0 + 8 && o[1] + dz[1] * (k + 1) < B.y1 - 8) k++;
    let kb = 1; while (kb < 14 && o[0] - dz[0] * (kb + 1) < B.x1 - 8 && o[1] - dz[1] * (kb + 1) > B.y0 + 8) kb++;
    rope(o, [o[0] - dz[0] * kb, o[1] - dz[1] * kb], 0.35); rope(o, [o[0] + dz[0] * k, o[1] + dz[1] * k]);
    for (let i = 1; i <= k; i++) cork(o[0] + dz[0] * i, o[1] + dz[1] * i);
    zEnd = [o[0] + dz[0] * k, o[1] + dz[1] * k];
  }
  c.restore();
  c.save(); c.font = M.VARF(17); c.fillStyle = '#1e5a6a'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('x', B.x1 - 10, S.oy - 12); c.fillText('y', S.ox + 12, B.y0 + 12); if (zEnd) c.fillText('z', zEnd[0] + 12, zEnd[1] + 2);
  c.restore();
}
function arrow(c, p0, p1, col, dark, w = 6, alpha = 1) {
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy); if (L < 3 || alpha <= 0) return;
  const ux = dx / L, uy = dy / L, hl = Math.min(17, L * 0.55), hw = hl * 0.62, bx = p1[0] - ux * hl * 0.8, by = p1[1] - uy * hl * 0.8;
  const head = () => { c.beginPath(); c.moveTo(p1[0], p1[1]); c.lineTo(p1[0] - ux * hl - uy * hw, p1[1] - uy * hl + ux * hw); c.lineTo(p1[0] - ux * hl * 0.72, p1[1] - uy * hl * 0.72); c.lineTo(p1[0] - ux * hl + uy * hw, p1[1] - uy * hl - ux * hw); c.closePath(); };
  c.save(); c.globalAlpha *= alpha; c.lineCap = 'round'; c.lineJoin = 'round';
  c.strokeStyle = dark; c.lineWidth = w + 4; c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(bx, by); c.stroke();
  head(); c.lineWidth = 4; c.fillStyle = dark; c.stroke(); c.fill();
  c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(bx, by); c.stroke();
  head(); c.fillStyle = col; c.fill();
  c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = Math.max(1.2, w * 0.25); c.beginPath(); c.moveTo(p0[0] - uy * w * 0.18, p0[1] + ux * w * 0.18 - w * 0.12); c.lineTo(bx - ux * 6 - uy * w * 0.18, by - uy * 6 + ux * w * 0.18 - w * 0.12); c.stroke();
  c.beginPath(); c.arc(p0[0], p0[1], w * 0.7, 0, 7); c.fillStyle = dark; c.fill();
  c.restore();
}
// a little fish that swims from tail to tip, again and again
function fishOn(c, p0, p1, t, ph, col) {
  const L = dist(p0, p1); if (L < 30) return; const k = (t * 0.42 + ph) % 1, a = Math.sin(k * Math.PI);
  const ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]), nx = -Math.sin(ang), ny = Math.cos(ang), off = -11 + Math.sin(t * 5 + ph * 9) * 1.5;
  const x = lerp(p0[0], p1[0], k) + nx * off * Math.sign(Math.cos(ang) || 1), y = lerp(p0[1], p1[1], k) + ny * off * Math.sign(Math.cos(ang) || 1);
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(ang); if (Math.cos(ang) < 0) c.scale(1, -1); c.scale(-1, 1); c.rotate(Math.sin(t * 9 + ph) * 0.08);
  P.fishShape(c, 0, 0, 0.42, col); c.restore();
}
function dashed(c, p0, p1, col, w = 2, alpha = 0.6) { c.save(); c.globalAlpha *= alpha; c.setLineDash([5, 5]); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.stroke(); c.restore(); }
// a plump octopus, painted here in case the shared animal cast is not ready
function octo(c, x, y, s, t, mood) {
  const col = '#e2709e', dark = '#a8406e', light = '#f8a8c8';
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = 'rgba(60,40,30,0.22)'; c.beginPath(); c.ellipse(0, 2, 38, 7, 0, 0, 7); c.fill();
  const cheer = mood === 'cheer', sad = mood === 'sad';
  for (let i = 0; i < 8; i++) {
    const f = (i - 3.5) / 3.5, back = i % 2 === 1, lift = cheer && (i === 0 || i === 7) ? 1 : 0;
    const pts = []; for (let j = 0; j <= 10; j++) { const q = j / 10, wv = Math.sin(t * 3 + i * 1.3 + q * 4) * 4 * q;
      let px = f * 12 + f * 30 * q + wv, py = -24 + q * 26 - q * q * 6 * Math.abs(f);
      if (lift) { px = f * 12 + f * 22 * q + wv * 0.5; py = -26 - q * 36 + Math.sin(t * 8 + i) * 3 * q; }
      if (sad) py += q * 2;
      pts.push([px, py]); }
    const end = pts[10]; pts.push([end[0] + f * 5, end[1] - (lift ? 6 : 5)]);
    for (let j = 0; j < pts.length - 1; j++) { const w = 9 * (1 - j / pts.length) + 2; c.strokeStyle = back ? dark : col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(pts[j][0], pts[j][1]); c.lineTo(pts[j + 1][0], pts[j + 1][1]); c.stroke(); }
    if (!back) { c.fillStyle = light; for (let j = 3; j < 10; j += 2) { c.beginPath(); c.arc(pts[j][0], pts[j][1] + 2, 1.5, 0, 7); c.fill(); } }
  }
  const bob = Math.sin(t * 2.2) * 2 + (cheer ? -Math.abs(Math.sin(t * 9)) * 4 : 0);
  const hg = c.createRadialGradient(-8, -50 + bob, 4, 0, -38 + bob, 34); hg.addColorStop(0, light); hg.addColorStop(0.6, col); hg.addColorStop(1, dark);
  c.fillStyle = hg; c.beginPath(); c.ellipse(0, -40 + bob, 25, 27, 0, 0, 7); c.fill(); c.strokeStyle = dark; c.lineWidth = 2; c.stroke();
  c.fillStyle = 'rgba(168,64,110,0.35)'; [[-12, -54], [10, -58], [2, -48], [15, -45]].forEach(([a, b]) => { c.beginPath(); c.arc(a, b + bob, 2.6, 0, 7); c.fill(); });
  const blink = (t % 3.4) < 0.12;
  for (const ex of [-9, 9]) { c.fillStyle = '#fff'; c.beginPath(); c.ellipse(ex, -34 + bob, 6, blink ? 1 : 7, 0, 0, 7); c.fill(); if (!blink) P.eye(c, ex + 1, -33 + bob, 3.6); }
  P.blush(c, -16, -25 + bob, 4); P.blush(c, 16, -25 + bob, 4);
  c.strokeStyle = '#4a1a30'; c.lineWidth = 2.2; c.lineCap = 'round'; c.beginPath();
  if (sad) c.arc(0, -15 + bob, 5, Math.PI * 1.15, Math.PI * 1.85); else if (cheer) { c.arc(0, -25 + bob, 6, 0.1, Math.PI - 0.1); c.fillStyle = '#7a2a40'; c.fill(); } else c.arc(0, -25 + bob, 5, 0.25, Math.PI - 0.25);
  c.stroke();
  if (sad) { c.beginPath(); c.moveTo(-14, -45 + bob); c.lineTo(-5, -43 + bob); c.moveTo(14, -45 + bob); c.lineTo(5, -43 + bob); c.stroke(); }
  c.restore();
}
function sparkle(c, x, y, r, a) { c.save(); c.globalAlpha *= a; c.fillStyle = '#fff6c0'; c.beginPath(); c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r); c.fill(); c.restore(); }

// ---------------- grabbing the arrows ----------------
const GRABS = new Set(['arrA', 'arrB', 'tipA', 'tipB', 'tail']), REACH = 58;
function segDist(p, a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy || 1, k = clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L, 0, 1); return Math.hypot(p[0] - a[0] - dx * k, p[1] - a[1] - dy * k); }
// which part of which arrow is under the finger: 'tail' (the shared start), 'tipA'/'tipB', or a shaft 'arrA'/'arrB'
function grabArrow(S, p) {
  const o = scr(S, S.zero), ta = scr(S, S.a), tb = scr(S, S.b);
  if (dist(p, o) < 20) return 'tail';
  const da = dist(p, ta), db = dist(p, tb);
  if (Math.min(da, db) < 24) return da <= db ? 'tipA' : 'tipB';
  const sa = segDist(p, o, ta), sb = segDist(p, o, tb);
  if (Math.min(sa, sb) < 22) return sa <= sb ? 'arrA' : 'arrB';
  return null;
}
// where a drag ends up: 'B' = B's tail goes onto A's tip, 'A' = A's tail goes onto B's tip, null = neither
function decide(S, id, f0, f) {
  const o = scr(S, S.zero), ta = scr(S, S.a), tb = scr(S, S.b), tail = [o[0] + f[0] - f0[0], o[1] + f[1] - f0[1]];
  if (id === 'tail') { const da = dist(f, ta), db = dist(f, tb); return da < REACH && da <= db ? 'B' : db < REACH ? 'A' : null; }
  // a tip may be pulled onto the shared tail (join the two arrows), or the whole arrow moved by its tip; when both
  // readings fit, the closer one wins (both give the same sum)
  if (id === 'tipA' || id === 'tipB') { const w = id[3], ow = w === 'A' ? 'B' : 'A', dj = dist(f, o), db = dist(tail, w === 'A' ? tb : ta);
    if (dj < REACH && dj <= db) return ow; if (db < REACH) return w; return null; }
  if ((id === 'arrA' || id === 'tipA') && (dist(tail, tb) < REACH || (id === 'arrA' && dist(f, tb) < REACH * 0.8))) return 'A';
  if ((id === 'arrB' || id === 'tipB') && (dist(tail, ta) < REACH || (id === 'arrB' && dist(f, ta) < REACH * 0.8))) return 'B';
  return null;
}
// which arrow follows the finger while dragging
function movedArrow(S, id, f0, f) { if (id === 'tail') return decide(S, id, f0, f) === 'A' ? 'A' : 'B'; return id.endsWith('A') ? 'A' : 'B'; }

MG.add({
  id: 'vecadd', stage: 'arrows', cmd: 'VECTOR ADD!', hint: 'drag', time: 8, mood: 'sea', winText: 'Added!', hold: 1.4,
  card: {
    title: 'Adding vectors', ref: 'Grade 11 and up', kind: 'Vectors',
    text: 'A vector is an arrow. It has a length and a direction. The numbers in a vector are called its parts. The x-part says how far the arrow goes across, and the y-part says how far it goes up. A negative part means left or down. Written in a row, the vector that goes 2 across and 3 up is (2, 3). In the game, the parts are stacked in a column, with the x-part on top.\n\nThe tail of an arrow is where it starts, and the tip is where it ends. To add two vectors on a grid, put the tail of the second arrow on the tip of the first arrow. The sum is a new arrow from the tail of the first arrow to the tip of the second.\n\nTo add two vectors with numbers, add the matching parts: the x-parts together and the y-parts together. For example, (2, 3) + (1, −4) = (2 + 1, 3 + (−4)) = (3, −1).\n\nHere is why the two ways agree. The first arrow takes you 2 right and 3 up. The second arrow takes you 1 more right and 4 down. In total you went 3 right and 1 down, and that is the arrow (3, −1).\n\nA vector in space has a third part, the z-part, for how far it comes toward you. You add the z-parts the same way.',
    note: 'Add the matching parts: x-part with x-part, y-part with y-part, and z-part with z-part. On the grid, put the arrows tip to tail. The sum goes from the first tail to the last tip.',
    ask: 'What is (4, 1) + (−2, 3)? What is (1, 2, 0) + (3, −2, 5)?',
  },
  init(g) {
    const S = g.s; M.setup(g); T = M.pace(g);
    S.dim = g.level === 2 ? 3 : 2; const d = S.dim;
    S.board = { x0: 14, x1: 346, y0: d === 3 ? 326 : 306, y1: 522 };
    pick(g, S);
    // the problem floats on the water: [a] + [b] = [slots]; the slots are wide enough for the "2 + 1" step, so nothing jumps
    S.slots = S.s.map((_, k) => M.slot('s' + k));
    const build = () => M.row(
      M.mat(S.a.map((v, k) => [M.num(v, 'a' + k, { col: COL.Ad })]), 'vA', { col: COL.A }), M.op('+', 'plus'),
      M.mat(S.b.map((v, k) => [M.num(v, 'b' + k, { col: COL.Bd })]), 'vB', { col: COL.B }), M.op('=', 'eq'),
      M.mat(S.slots.map(n => [n]), 'vS', { col: '#8a560c' }));
    S.ex = build();
    let fs = d === 3 ? 31 : 36;
    for (; fs > 22; fs--) {
      const sw = Math.max(...S.s.map((_, k) => M.lay(sumRow(S, k), fs).w)) + fs * 0.3; S.slots.forEach(n => { n.w = sw; });
      const m = M.lay(S.ex, fs); if (m.w <= 322 && m.a + m.d <= (d === 3 ? 124 : 96)) break;
    }
    S.fs = fs; const em = M.lay(S.ex, fs); S.base = 188 + em.a; S.bob = 0;
    S.board.y0 = Math.max(S.board.y0, S.base + em.d + 18); fitGrid(S);
    S.relay = () => M.place(g, 'ex', S.ex, 180, S.base + S.bob, S.fs, { col: '#1d4f5e' }); S.relay();
    M.inert(g, ['plus', 'eq', 'vS']);
    // The arrows on the grid. Grabbing them is handled here (see grabArrow and decide below): the player may grab an
    // arrow anywhere (shaft, tail or tip). These zones are where the guidance glows and where accepted drops land:
    // arrA/arrB = middle of each arrow, dockA/dockB = each tip, landB/landA = where the middle of the other arrow ends up.
    S.zero = Array(d).fill(0); S.vec = { A: S.a, B: S.b };
    const o = scr(S, S.zero), ta = scr(S, S.a), tb = scr(S, S.b);
    M.zone(g, 'arrA', { ...pt(mid(o, ta)), w: 44, h: 44 }); M.zone(g, 'arrB', { ...pt(mid(o, tb)), w: 44, h: 44 });
    M.zone(g, 'dockA', { ...pt(ta), w: 24, h: 24 }); M.zone(g, 'dockB', { ...pt(tb), w: 24, h: 24 });
    M.zone(g, 'landB', { ...pt(scr(S, S.a.map((v, k) => v + S.b[k] / 2))), w: 30, h: 30 }); M.zone(g, 'landA', { ...pt(scr(S, S.b.map((v, k) => v + S.a[k] / 2))), w: 30, h: 30 });
    // st[k]: 0 = not started, 1 = "a + b" written in the slot, 2 = computed
    S.st = Array(d).fill(0); S.legs = []; S.slid = null; S.sumT0 = null; S.oct = { happyAt: -9, sadAt: -9 }; S.mix = null;
    // time scales with the number of moves: the slide, then a drag and a tap for each component
    const nMoves = 1 + 2 * d; g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const allDone = () => S.slid && S.st.every(v => v === 2);
    // the finale: the gold sum arrow draws itself from the first tail to the last tip, and the answer column lights up
    const sumGo = g => { if (S.sumT0 != null) return; S.sumT0 = g.t + 0.1 * T; M.show(g, 0.9 * T); S.point = true; g.sfx('swoosh');
      M.at(g, [[0.75 * T, g => { M.indicate(g, 'vS', { dur: 0.45 * T, col: COL.S, sc: 1.08 }); S.oct.happyAt = g.t; }]]); };
    const slide = (g, who) => {
      const other = who === 'A' ? 'B' : 'A';
      S.slid = { who, t0: g.t, dur: 0.6 * T, to: S.vec[other] }; g.sfx('whoosh'); M.show(g, 0.8 * T); S.point = true;
      M.indicate(g, 'v' + who, { dur: 0.45 * T, col: COL[who], sc: 1.1 });
      const mk = g.s.mk; for (const z of ['arrA', 'arrB', 'dockA', 'dockB', 'landA', 'landB']) { delete mk.zones[z]; delete mk.box[z]; }
      M.at(g, [[0.6 * T, g => { g.sfx('bubble'); const p = scr(S, S.vec[other]); g.burst(p[0], p[1], ['#fff', '#bdf0ff', COL[who]], 10, 100); S.joinAt = g.t; S.oct.happyAt = g.t; if (allDone()) sumGo(g); }]]);
    };
    M.play(g, {
      moves(g) {
        const out = [];
        if (!S.slid) {
          // B's tail onto A's tip (grab B anywhere, or A's tip and pull it to B's tail), or the other way round: a + b = b + a.
          // Arrow grabs are decided in up() and land on dockA / dockB; the columns on the water use the kit's forgiving drops.
          out.push({ drag: ['arrB', 'tipB', 'tail', 'tipA', 'vB'], to: ['landB', 'dockA', 'vA', ...S.a.map((_, k) => 'a' + k)], reach: 70, busy: 0.1, then(g) { slide(g, 'B'); } });
          out.push({ drag: ['arrA', 'tipA', 'tail', 'tipB', 'vA'], to: ['landA', 'dockB', 'vB', ...S.b.map((_, k) => 'b' + k)], reach: 70, busy: 0.1, then(g) { slide(g, 'A'); } });
        }
        S.s.forEach((sv, k) => {
          const a = S.a[k], b = S.b[k], oth = S.s[(k + 1) % d];
          if (S.st[k] === 0) out.push({
            // drag the matching parts together, either one onto the other (or onto their plank): "a + b" is written in the
            // slot at once, and the steps are walked on the grid
            drag: ['b' + k, 'a' + k], to: ['a' + k, 'b' + k, 's' + k], reach: 64, busy: 0.1,
            then(g) {
              const start = S.zero.map((_, j) => S.st[j] ? S.s[j] : 0); S.st[k] = 1; // this leg starts where the legs so far end
              // the leg walks one step at a time: first vector's steps, then the second's
              const d1 = T * Math.min(0.5, 0.1 + 0.12 * Math.abs(a)), d2 = T * Math.min(0.5, 0.1 + 0.12 * Math.abs(b)), t0 = g.t + 0.35 * T;
              S.legs.push({ k, start, a, b, t0, d1, d2, gold: null });
              M.show(g, 0.35 * T + d1 + d2 + 0.15 * T); S.point = true;
              M.circle(g, ['a' + k, 'b' + k], { dur: 0.45 * T, col: '#fff6c0' });
              // the slot gets "a + b", built from copies of the two numbers flying in
              const f = sumRow(S, k), [na, pl, nb] = f.items; f.id = 'c' + k; na.id = 'ca' + k; pl.id = 'cp' + k; nb.id = 'cb' + k;
              for (const q of f.items) q.alpha = 0; S.slots[k].fill = f; S.relay(); M.inert(g, ['ca' + k, 'cp' + k, 'cb' + k]);
              const land = (q, col) => g => { q.alpha = 1; q._born = null; q.pop = g.t; M.sparkle(g, q, { n: 6, cols: ['#fff', col] }); g.sfx('drip'); };
              M.fly(g, { node: M.num(a, null, { col: COL.Ad }), from: 'a' + k, to: 'ca' + k, delay: 0.1 * T, dur: 0.4 * T, arc: -18, then: land(na, COL.A) });
              M.at(g, [[0.35 * T, g => { pl.alpha = 1; pl.pop = g.t; }]]);
              M.fly(g, { node: v2n(b, COL.Bd), from: 'b' + k, to: 'cb' + k, delay: 0.25 * T, dur: 0.4 * T, arc: -18, then: land(nb, COL.B) });
              for (const id of ['a' + k, 'b' + k]) { const n = M.node(g, id); if (n) M.tween(g, n, { alpha: 0.32 }, 0.3 * T, { delay: 0.35 * T }); }
              S.oct.happyAt = g.t; g.sfx('splash'); M.at(g, [[t0 - g.t, g => g.sfx('bubble')], [t0 - g.t + d1, g => g.sfx('bubble')]]);
            },
          });
          else if (S.st[k] === 1) out.push({
            // tap "a + b" to add
            tap: ['c' + k, 's' + k], busy: 0.1, askAt: 0.35 * T, after: 0.75 * T, ask: { v: sv, wrong: [a * b, a - b, oth, b - a, sv + 1, sv - 1] },
            then(g) { S.st[k] = 2; M.show(g, 0.35 * T); S.point = true; const f = S.slots[k].fill; M.circle(g, 's' + k, { dur: 0.4 * T, col: COL.S });
              for (const q of f.items) M.indicate(g, q, { dur: 0.3 * T, sc: 1.18, col: '#fff6c0' }); },
            resolve(g) { M.show(g, 0.75 * T);
              // the "+ b" slides into a, and a rolls over to the sum like an odometer
              const f = S.slots[k].fill, [na, pl, nb] = f.items, bo = M.box(g, 'ca' + k);
              for (const q of [pl, nb]) { const b0 = M.box(g, q.id); if (bo && b0) M.tween(g, q, { dx: bo.x - b0.x, alpha: 0, sc: 0.5 }, 0.28 * T); }
              M.at(g, [[0.12 * T, g => { M.roll(g, na, sv, { dur: 0.32 * T }); na.col = COL.Sd; g.sfx('coin'); }],
                [0.45 * T, g => { na.id = null; na.pop = g.t; S.slots[k].fill = na; S.relay(); S.oct.happyAt = g.t;
                  const sb = M.box(g, 's' + k); if (sb) g.burst(sb.x, sb.y, ['#fff6c0', COL.S, '#fff'], 10, 110);
                  const lg = S.legs.find(l => l.k === k); if (lg) { lg.gold = g.t; const p = scr(S, lg.start.map((v, j) => j === k ? sv : v)); g.burst(p[0], p[1], ['#fff6c0', COL.S, '#fff'], 8, 80); }
                  if (allDone()) sumGo(g); }]]);
            },
          });
        });
        return out;
      },
      area(g) { if (!S.slid) return ['arrB', 'dockA']; const k = S.st.findIndex(v => v < 2); return k < 0 ? null : S.st[k] === 0 ? ['a' + k, 'b' + k] : 'c' + k; },
    });
    S.onMiss = (g, info) => {
        S.oct.sadAt = g.t;
        const f = info.drag && /^[ab]\d$/.test(info.drag) ? info.drag : null, to = info.to && /^[abs]\d$/.test(info.to) ? info.to : null;
        if (f && to && f[1] !== to[1]) { // mixed an x-part with a y-part: walk those steps along the wrong line
          const kf = +f[1], kt = +to[1], vf = (f[0] === 'a' ? S.a : S.b)[kf], vt = (to[0] === 'b' ? S.b : S.a)[kt];
          S.mix = { t0: g.t, kt, vf, vt, cf: f[0] === 'a' ? COL.A : COL.B, ct: to[0] === 'b' ? COL.B : COL.A, from: f, to };
          M.fly(g, { node: M.num(vf, null, { col: COL.BAD || M.BAD }), from: f, to, dur: 0.25, arc: -30, then(g) { g.sfx('boing'); } });
        }
    };
    S.seenMiss = -1;
  },
  update(g, dt) { M.update(g, dt); const S = g.s, mk = S.mk;
    if (mk.missAt >= 0 && mk.missAt !== S.seenMiss) { S.seenMiss = mk.missAt; try { S.onMiss(g, mk.missInfo || {}); } catch (e) { console.error(e); } }
    if (!M.showing(g)) S.point = false; },
  down(g, x, y) {
    const S = g.s, mk = S.mk;
    if (!S.slid && !g.done && !(mk.busyT > 0) && !mk.ask) { const id = grabArrow(S, [x, y]); if (id) { mk.press = { id, x0: x, y0: y, x, y, dragging: false, t: g.t }; return; } }
    M.down(g, x, y);
  },
  move(g, x, y) { M.move(g, x, y); },
  up(g, x, y) {
    const S = g.s, mk = S.mk, P0 = mk.press;
    if (P0 && P0.dragging && GRABS.has(P0.id) && !g.done) {
      const who = decide(S, P0.id, [P0.x0, P0.y0], [x, y]);
      if (who) { const b = mk.box[who === 'B' ? 'dockA' : 'dockB']; if (b) { M.up(g, b.x, b.y); return; } }
      // not near a tip: the arrow swims back where it was
      mk.press = null; S.snap = { w: movedArrow(S, P0.id, [P0.x0, P0.y0], [x, y]), dx: x - P0.x0, dy: y - P0.y0, t0: g.t }; g.sfx('boing'); return;
    }
    // a number dropped near its partner (or their plank) counts even when the drop point touches a column's bracket;
    // a drop right on a number or plank of another row is left to the kit (a wrong move, acted out in onMiss)
    if (P0 && P0.dragging && /^[ab]\d$/.test(P0.id) && !g.done) {
      const k = +P0.id[1], near = (b, m) => b && Math.abs(x - b.x) <= b.w / 2 + m && Math.abs(y - b.y) <= b.h / 2 + m;
      const other = S.s.some((_, j) => j !== k && ['a', 'b', 's'].some(w => near(mk.box[w + j], 4)));
      if (!other && S.st[k] === 0) { let best = null, bd = 64;
        for (const id of ['a' + k, 'b' + k, 's' + k]) { const b = mk.box[id]; if (!b || id === P0.id) continue; const dd = Math.hypot(Math.max(0, Math.abs(x - b.x) - b.w / 2), Math.max(0, Math.abs(y - b.y) - b.h / 2)); if (dd < bd) { bd = dd; best = b; } }
        if (best) { M.up(g, best.x, best.y); return; } }
    }
    M.up(g, x, y);
  },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, mk = g.s.mk;
    c.drawImage(g.bake('vecadd_lagoon', lagoon), 0, 0, W, H);
    const caus = g.bake('vecadd_caustic', causticTile);
    c.save(); c.beginPath(); c.moveTo(0, H); for (let x = 0; x <= W; x += 8) c.lineTo(x, shoreY(x)); c.lineTo(W, H); c.closePath(); c.clip();
    c.globalCompositeOperation = 'screen'; c.globalAlpha = 0.11; c.drawImage(caus, -((t * 7) % 360), 0, 720, 1280); c.globalAlpha = 0.07; c.drawImage(caus, -360 + ((t * 5) % 360), -((t * 3) % 640), 720, 1280);
    c.restore();
    // the wash of little waves on the beach
    for (let i = 0; i < 2; i++) { const k = (t * 0.35 + i * 0.5) % 1, push = Math.sin(k * Math.PI) * 9;
      c.strokeStyle = `rgba(255,255,255,${0.8 * Math.sin(k * Math.PI)})`; c.lineWidth = 3 - i; c.beginPath(); for (let x = 0; x <= W; x += 6) c.lineTo(x, shoreY(x) - push + Math.sin(x * 0.09 + t * 2 + i) * 1.5); c.stroke(); }
    // a school of little fish, seen from above, sweeping around the lagoon
    for (let i = 0; i < 6; i++) { const a = t * 0.32 + i * 0.13, x = 180 + Math.cos(a) * 200, y = 140 + Math.sin(a * 2) * 26 + (i % 3) * 7, ang = Math.atan2(Math.cos(a * 2) * 52, -Math.sin(a) * 200);
      c.save(); c.translate(x, y); c.rotate(ang); if (Math.cos(ang) < 0) c.scale(1, -1); c.scale(-1, 1); c.globalAlpha = 0.5; P.fishShape(c, 0, 0, 0.45, '#1f6f8a'); c.restore(); }
    // ripple rings drifting
    for (let i = 0; i < 3; i++) { const k = (t * 0.25 + i / 3) % 1, x = [70, 300, 190][i], y = [560, 548, 610][i]; c.strokeStyle = `rgba(255,255,255,${0.35 * (1 - k)})`; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y, 10 + k * 40, 6 + k * 24, 0, 0, 7); c.stroke(); }

    drawBoard(c, S, t, caus);
    const d = S.dim;
    // the slide: the moving arrow's tail glides from the start to the other arrow's tip
    let offA = S.zero, offB = S.zero;
    if (S.slid) { const k = easeIO((t - S.slid.t0) / S.slid.dur), off = S.slid.to.map(v => v * k); if (S.slid.who === 'A') offA = off; else offB = off; }
    // the legs of the sum: first vector's steps, then the second's, along one axis
    for (const L of S.legs) {
      const k = L.k, p0 = scr(S, L.start), p1 = scr(S, L.start.map((v, j) => j === k ? v + L.a : v)), p2 = scr(S, L.start.map((v, j) => j === k ? v + L.a + L.b : v));
      const k1 = clamp((t - L.t0) / L.d1, 0, 1), k2 = clamp((t - L.t0 - L.d1) / L.d2, 0, 1), gk = L.gold == null ? 0 : clamp((t - L.gold) / 0.3, 0, 1);
      const nrm = k === 0 ? [0, 7] : k === 1 ? [7, 0] : [5, -5];
      c.save(); c.lineCap = 'round';
      if (gk < 1 && k1 > 0) {
        c.globalAlpha = 1 - gk; const q1 = [lerp(p0[0], p1[0], k1), lerp(p0[1], p1[1], k1)];
        c.strokeStyle = COL.A; c.lineWidth = 5; c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(q1[0], q1[1]); c.stroke();
        if (k2 > 0) { const s1 = [p1[0] + nrm[0], p1[1] + nrm[1]], s2 = [p2[0] + nrm[0], p2[1] + nrm[1]], q2 = [lerp(s1[0], s2[0], k2), lerp(s1[1], s2[1], k2)];
          c.strokeStyle = COL.B; c.beginPath(); c.moveTo(s1[0], s1[1]); c.lineTo(q2[0], q2[1]); c.stroke();
          c.fillStyle = COL.B; c.beginPath(); c.arc(q2[0], q2[1], 4.5, 0, 7); c.fill(); }
        // one dot per step, so the steps can be counted
        c.fillStyle = '#fff';
        for (let i = 1; i <= Math.abs(L.a); i++) { const q = i / Math.abs(L.a); if (q <= k1 + 1e-6) { c.beginPath(); c.arc(lerp(p0[0], p1[0], q), lerp(p0[1], p1[1], q), 2.2, 0, 7); c.fill(); } }
        for (let i = 1; i <= Math.abs(L.b); i++) { const q = i / Math.abs(L.b); if (q <= k2 + 1e-6) { c.beginPath(); c.arc(lerp(p1[0], p2[0], q) + nrm[0], lerp(p1[1], p2[1], q) + nrm[1], 2.2, 0, 7); c.fill(); } }
      }
      if (gk > 0) { c.globalAlpha = gk * 0.85; c.setLineDash([7, 6]); c.strokeStyle = COL.Sb; c.lineWidth = 4; c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p2[0], p2[1]); c.stroke(); c.setLineDash([]);
        c.fillStyle = COL.S; c.beginPath(); c.arc(p2[0], p2[1], 4.5, 0, 7); c.fill(); c.strokeStyle = COL.Sd; c.lineWidth = 1.5; c.stroke(); }
      c.restore();
      // the step counts beside each leg: the first vector's, the second's, then their sum in gold
      const lab = (txt, p, q, col, al, side = 1) => { if (al <= 0) return; const m = mid(p, q), o0 = k === 0 ? [0, 18] : k === 1 ? [-18, 0] : [13, 13], off = [o0[0] * side, o0[1] * side];
        c.save(); c.globalAlpha *= clamp(al, 0, 1); c.font = M.NUMF(19, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 4; c.strokeStyle = 'rgba(255,255,240,0.95)'; c.lineJoin = 'round';
        const s = String(txt).replace(/^-/, '−'); c.strokeText(s, m[0] + off[0], m[1] + off[1]); c.fillStyle = col; c.fillText(s, m[0] + off[0], m[1] + off[1]); c.restore(); };
      if (L.a) lab(L.a, p0, p1, COL.Ad, (k1 > 0.3 ? 1 : 0) * (1 - gk));
      if (L.b) lab(L.b, [p1[0] + nrm[0], p1[1] + nrm[1]], [p2[0] + nrm[0], p2[1] + nrm[1]], COL.Bd, (k2 > 0.3 ? 1 : 0) * (1 - gk), Math.sign(L.a) === Math.sign(L.b) ? 1 : -1);
      if (gk > 0 && L.a + L.b) lab(L.a + L.b, p0, p2, COL.Sd, gk);
    }
    // the ring where the two arrows join, tip to tail
    if (S.joinAt != null && t - S.joinAt < 0.6) { const k = (t - S.joinAt) / 0.6, p = scr(S, S.vec[S.slid.who === 'A' ? 'B' : 'A']);
      c.save(); c.globalAlpha = 1 - k; c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.beginPath(); c.arc(p[0], p[1], 8 + k * 22, 0, 7); c.stroke(); c.restore(); }
    // the original spot of the arrow that slid, fading
    if (S.slid) { const k = clamp((t - S.slid.t0) / 1.0, 0, 1), w = S.slid.who; if (k < 1) dashed(c, scr(S, S.zero), scr(S, S.vec[w]), COL[w], 3, 0.5 * (1 - k)); }
    // 3D: dashed drop lines from each tip back to the x-y plane show how far toward you it is
    const drop = (v, col, a = 0.55) => { if (d === 3 && v[2]) dashed(c, scr(S, v), scr(S, [v[0], v[1], 0]), col, 1.8, a); };
    const press = !S.slid && mk.press && mk.press.dragging && GRABS.has(mk.press.id) ? mk.press : null;
    const pw = press ? movedArrow(S, press.id, [press.x0, press.y0], [press.x, press.y]) : null;
    const sn = S.snap && t - S.snap.t0 < 0.22 ? S.snap : null;
    const drawVec = (w, off) => {
      const v = S.vec[w], tail = off, tip = off.map((q, j) => q + v[j]); let p0 = scr(S, tail), p1 = scr(S, tip), al = 1;
      if (pw === w) al = 0.3;
      if (sn && sn.w === w && !S.slid) { const k = 1 - ease((t - sn.t0) / 0.22), dx = sn.dx * k, dy = sn.dy * k; p0 = [p0[0] + dx, p0[1] + dy]; p1 = [p1[0] + dx, p1[1] + dy]; }
      drop(tip, COL[w + 'd'] || COL[w]);
      arrow(c, p0, p1, COL[w], COL[w + 'd'], 6, al);
      if (al === 1) fishOn(c, p0, p1, t, w === 'A' ? 0 : 0.5, P.shade(COL[w], 0.35));
    };
    drawVec('A', offA); drawVec('B', offB);
    // the sum arrow, from the very start to the final tip
    if (S.sumT0 != null && t >= S.sumT0) {
      const k = easeIO((t - S.sumT0) / (0.6 * T)), o = scr(S, S.zero), e = scr(S, S.s), p = [lerp(o[0], e[0], k), lerp(o[1], e[1], k)];
      drop(S.s, COL.Sd, 0.6 * k);
      c.save(); c.shadowColor = 'rgba(255,220,90,0.9)'; c.shadowBlur = 14; arrow(c, o, p, COL.S, COL.Sd, 8); c.restore();
      if (k >= 1) { fishOn(c, o, e, t, 0.25, '#ffe58a'); for (let i = 0; i < 3; i++) { const a = t * 2.4 + i * 2.1; sparkle(c, e[0] + Math.cos(a) * 18, e[1] + Math.sin(a) * 14, 5, 0.85); } }
      if (!S.sumBurst && k >= 1) { S.sumBurst = 1; g.burst(e[0], e[1], ['#fff6c0', COL.S, '#ffffff', '#bdf0ff'], 16, 140); g.sfx('sparkle'); }
    }
    // a wrong move, acted out: the steps are walked along the wrong line, then fizzle with a red cross
    if (S.mix) {
      const X = S.mix, k = clamp((t - X.t0 - 0.1) / 0.3, 0, 1), kt = X.kt, o = scr(S, S.zero);
      const p1 = scr(S, unit(kt, X.vt, d)), p2 = scr(S, unit(kt, X.vt + X.vf, d)), q = [lerp(p1[0], p2[0], k), lerp(p1[1], p2[1], k)];
      const B = S.board; c.save(); rr(c, B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0, 26); c.clip(); c.lineCap = 'round'; c.lineWidth = 5; c.strokeStyle = X.ct; c.beginPath(); c.moveTo(o[0], o[1]); c.lineTo(p1[0], p1[1]); c.stroke();
      if (k > 0) { c.setLineDash([6, 5]); c.strokeStyle = M.BAD; c.beginPath(); c.moveTo(p1[0] + 6, p1[1] + 6); c.lineTo(q[0] + 6, q[1] + 6); c.stroke(); c.setLineDash([]); }
      q[0] = clamp(q[0], B.x0 + 20, B.x1 - 26); q[1] = clamp(q[1], B.y0 + 14, B.y1 - 26); // keep the cross on the sand
      if (k >= 1) { const r = 12, wob = Math.sin((t - X.t0) * 30) * 2 * Math.max(0, 1 - (t - X.t0 - 0.7) * 2); c.strokeStyle = M.BAD; c.lineWidth = 4.5; c.beginPath(); c.moveTo(q[0] + 6 - r + wob, q[1] + 6 - r); c.lineTo(q[0] + 6 + r + wob, q[1] + 6 + r); c.moveTo(q[0] + 6 + r + wob, q[1] + 6 - r); c.lineTo(q[0] + 6 - r + wob, q[1] + 6 + r); c.stroke(); }
      c.restore();
      // the two numbers that should not have met shake
      const sh = t - X.t0 < 0.7 ? Math.sin((t - X.t0) * 50) * 3 : 0; for (const id of [X.from, X.to]) { const n = M.node(g, id); if (n) n.dx = sh; }
      if (t - X.t0 > 1.1 && !g.done) S.mix = null; // a wrong move only wobbles: the act-out clears and play goes on
    }
    // dragging an arrow: it follows the finger. When the drop would be accepted, a bright copy shows where it will land
    // (its tail on the other arrow's tip), and that tip glows.
    if (press) {
      const f0 = [press.x0, press.y0], f = [press.x, press.y], who = decide(S, press.id, f0, f), o = scr(S, S.zero);
      const joining = (press.id === 'tipA' || press.id === 'tipB') && who && who !== press.id[3]; // pulling a tip onto the shared tail
      if (who) { const v = S.vec[who], at = S.vec[who === 'A' ? 'B' : 'A'], q0 = scr(S, at), q1 = scr(S, at.map((x, j) => x + v[j]));
        arrow(c, q0, q1, COL[who], COL[who + 'd'], 6, 0.5); M.glowBox(c, { x: q0[0], y: q0[1], w: 26, h: 26 }, t, 0.8, true); }
      if (joining) { const tp = scr(S, S.vec[press.id[3]]); c.save(); c.setLineDash([6, 6]); c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.beginPath(); c.moveTo(tp[0], tp[1]); c.lineTo(f[0], f[1]); c.stroke(); c.restore(); }
      else { const dx = f[0] - f0[0], dy = f[1] - f0[1], p1 = scr(S, S.vec[pw]); c.save(); c.shadowColor = 'rgba(30,40,60,0.35)'; c.shadowBlur = 10; c.shadowOffsetY = 5;
        arrow(c, [o[0] + dx, o[1] + dy], [p1[0] + dx, p1[1] + dy], COL[pw], COL[pw + 'd'], 7); c.restore(); }
    }
    // the guidance for the slide: a ghost of the second arrow glides with the ghost hand until its tail sits on the first tip
    const mv0 = M.current(g)[0];
    if (mv0 && mv0.drag && ids0(mv0.drag)[0] === 'arrB' && !press && !(mk.busyT > 0) && !mk.ask && (!g.done || g.result === 'fail') && (g.level === 0 || t - mk.moveT > 2 || g.done)) {
      const k = ((t - mk.moveT) * 0.75) % 1, e = easeIO(clamp((k - 0.15) / 0.7, 0, 1)), a = mk.box.arrB, b = mk.box.landB;
      if (a && b && k > 0.1 && k < 0.95) { const dx = (b.x - a.x) * e, dy = (b.y - a.y) * e - Math.sin(e * Math.PI) * 40, o = scr(S, S.zero), p1 = scr(S, S.b);
        arrow(c, [o[0] + dx, o[1] + dy], [p1[0] + dx, p1[1] + dy], COL.B, COL.Bd, 6, 0.45); }
    }

    // the card
    // the problem, afloat: number floats, sand dollars under + and =, driftwood planks for the answers
    S.bob = Math.sin(t * 1.5) * 1.2; S.relay();
    const bx = id => M.box(g, id);
    for (const id of ['plus', 'eq']) { const b = bx(id); if (b) sandDollar(c, b, t, id === 'eq' ? 1 : 0); }
    S.s.forEach((_, k) => {
      for (const [w, col] of [['a', COL.A], ['b', COL.B]]) { const b = bx(w + k), n = M.node(g, w + k); if (b) float(c, b, S.fs, col, t, k + (w === 'b' ? 2 : 0), n && n.alpha < 1, n && (n.mark === 'bad' || (S.mix && S.mix.from === w + k && t - S.mix.t0 < 1.2))); }
      const b = bx('s' + k); if (b) plank(c, b, t, k, S.st[k] === 2);
    });
    M.drawEx(g, c, 'ex');

    // the octopus host: it bounces and blows a puff of bubbles on every move, cheers on a win, droops on a miss
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const hk = (t - S.oct.happyAt) / 0.45, busyK = hk >= 0 && hk < 1, sadK = lost || t - S.oct.sadAt < 1.5;
    const ox = 62, oy = 606 - (busyK ? Math.sin(hk * Math.PI) * 16 : 0) - (won ? Math.abs(Math.sin(t * 7)) * 8 : 0), os = 1.0;
    try {
      if (typeof ANI !== 'undefined' && ANI.draw) ANI.draw(c, 'octopus', ox, oy, 1.3, { t, pose: won ? 'cheer' : busyK ? 'hop' : S.point ? 'point' : 'idle', expr: won ? 'laugh' : sadK ? 'sad' : busyK ? 'wow' : 'happy' });
      else octo(c, ox, oy, os, t, won || busyK ? 'cheer' : sadK ? 'sad' : 'happy');
    } catch (e) { octo(c, ox, oy, os, t, 'happy'); }
    for (let i = 0; i < 3; i++) { const k = (t * 0.5 + i / 3) % 1; c.strokeStyle = `rgba(255,255,255,${0.7 * (1 - k)})`; c.lineWidth = 1.5; c.beginPath(); c.arc(ox + 20 + Math.sin(t * 3 + i) * 4, oy - 70 - k * 70, 2.5 + i, 0, 7); c.stroke(); }
    const pk = (t - S.oct.happyAt) / 0.8;
    if (pk >= 0 && pk < 1) for (let i = 0; i < 6; i++) { const a = -1.2 + i * 0.35, d = 20 + pk * (50 + i * 6); c.strokeStyle = `rgba(255,255,255,${0.9 * (1 - pk)})`; c.lineWidth = 1.6; c.beginPath(); c.arc(ox + 10 + Math.cos(a) * d, oy - 60 + Math.sin(a) * d * 0.8 - pk * 20, 3 + (i % 3), 0, 7); c.stroke(); }
    M.drawUI(g, c);
  },
});
function pt(p) { return { x: p[0], y: p[1] }; }
function ids0(v) { return Array.isArray(v) ? v : [v]; }
