// trig_spin.js — UNIT CIRCLE! Stop a spinning arrow at a given angle, and read the point's coordinates (cos θ, sin θ).
// A rooftop observatory at night under a teal and magenta nebula. The unit circle is a glowing orbit ring with its two
// axes; an arrow from the centre, tipped with a comet, sweeps steadily counter-clockwise from 0. The target angle is
// written above the circle in real notation (θ = 135°, or θ = 3π/4 at level 2). The player taps anywhere to stop the
// arrow. Stopped close enough to the target, it snaps onto the exact angle: the point on the circle lights up, its
// shadows drop onto the axes (cos θ across, sin θ up), and the coordinates appear with exact values: (−√2/2, √2/2).
// Stopped too early or too late, the arrow only shudders, a red tick marks where it was, the owl tilts its head, and
// the arrow keeps sweeping, so the player tries again on the next pass.
// Level 0: one target from 90°, 180°, 270°, 45°; the 45° marks are labelled, the spin is slow and the window wide; a
// ghost arrow marks the target and a ghost hand taps as the arrow arrives.
// Level 1: two targets in degrees (30°, 60°, 135°, 210°, ...); only the quadrant marks are labelled.
// Level 2: two targets in radians (π/3, 3π/4, 7π/6, ...); the quadrant marks are labelled in radians.
// From level 1 the ghost arrow and hand appear only after a 2-second pause or a miss. The target always glows.
// Medium mode: after each snap one coordinate shows "?" and the player picks cos θ or sin θ from the tray; the wrong
// tiles are the other coordinate, the wrong sign, and the value of the companion angle (1/2 for √3/2).
//
// √ and π are not in the game's fonts, so this file has a tiny typesetter of its own: radicals are drawn as paths and π
// and θ use the serif font, for the target, the coordinates and the tray tiles. The tray itself is the kit's
// (g.s.mk.ask: MK.down picks a tile and MK.auto plays it); only its drawing is done here. The tap is handled here too:
// moves(g) returns one placeholder tap until every target is found, then an empty list, so MK.update wins through finish().
const M = MK;
const clamp = M.clamp, lerp = M.lerp, ease = M.ease, easeIO = M.easeIO;
const CX = 180, CY = 366, R = 118;
const INKL = '#f4f0ff', COSC = '#5ad2ff', SINC = '#ff7ac8', GOLD = '#ffd65a';
const TAU = Math.PI * 2, rad = d => d * Math.PI / 180;
const TOL = [20, 13, 10];                    // degrees either side of the target that still count
const PERIOD = [4.4, 3.5, 3.1];              // seconds per turn at speed 1

// ---------------- exact values ----------------
// values are strings: '0', '1', '-1', '1/2', '-1/2', 'r2/2', '-r2/2', 'r3/2', '-r3/2'
const REF = { 0: ['1', '0'], 30: ['r3/2', '1/2'], 45: ['r2/2', 'r2/2'], 60: ['1/2', 'r3/2'], 90: ['0', '1'] };
const neg = v => v === '0' ? '0' : v[0] === '-' ? v.slice(1) : '-' + v;
function exact(deg) {
  const r = ((deg % 360) + 360) % 360; let ref, sc, ss;
  if (r <= 90) { ref = r; sc = 1; ss = 1; } else if (r <= 180) { ref = 180 - r; sc = -1; ss = 1; } else if (r <= 270) { ref = r - 180; sc = -1; ss = -1; } else { ref = 360 - r; sc = 1; ss = -1; }
  const [c, s] = REF[ref]; return [sc < 0 ? neg(c) : c, ss < 0 ? neg(s) : s];
}
const COMPANION = { '1': '0', '0': '1', '1/2': 'r3/2', 'r3/2': '1/2', 'r2/2': '1/2' };
const absV = v => v[0] === '-' ? v.slice(1) : v;

// ---------------- a tiny typesetter (√, π, θ, fractions) ----------------
// nodes: { k: 't', s, serif, it } text | { k: 'row', items } | { k: 'fr', n, d } | { k: 'sq', v } | { k: 'neg' } | { k: 'par', inner }
const T = (s, o) => ({ k: 't', s: String(s), ...o }), PI = () => T('π', { serif: true }), THETA = () => T('θ', { serif: true, it: true });
const row = (...items) => ({ k: 'row', items: items.filter(Boolean) });
function valNode(v) {
  const ng = v[0] === '-', b = ng ? v.slice(1) : v; let body;
  if (b.includes('/')) { const [n, d] = b.split('/'); body = { k: 'fr', n: n[0] === 'r' ? { k: 'sq', v: n.slice(1) } : T(n), d: T(d) }; }
  else body = T(b);
  return ng ? row({ k: 'neg' }, body) : body;
}
function angleNode(A) {
  if (A.deg != null && !A.rad) return T(A.deg + '°');
  const [k, d] = A.rad, top = k === 1 ? PI() : row(T(k), PI());
  return d === 1 ? top : { k: 'fr', n: top, d: T(d) };
}
const coordNode = (cv, sv) => ({ k: 'par', inner: row(cv, T(',', { tight: true }), { k: 'gap', w: 0.3 }, sv) });
const fontOf = (n, s) => n.serif ? `${n.it ? 'italic ' : ''}700 ${s * 1.06}px Georgia, 'Times New Roman', serif` : M.NUMF(s);
const mc = document.createElement('canvas').getContext('2d');
function lay(n, s) {
  let m;
  switch (n.k) {
    case 't': mc.font = fontOf(n, s); m = { w: mc.measureText(n.s).width + (n.tight ? 0 : s * 0.04), a: s * 0.74, d: s * 0.1 }; break;
    case 'gap': m = { w: n.w * s, a: 0, d: 0 }; break;
    case 'neg': m = { w: s * 0.5, a: s * 0.4, d: 0 }; break;
    case 'row': { let w = 0, a = 0, d = 0; for (const it of n.items) { const q = lay(it, s); w += q.w; a = Math.max(a, q.a); d = Math.max(d, q.d); } m = { w, a, d }; break; }
    case 'sq': { mc.font = M.NUMF(s); const wd = mc.measureText(n.v).width; m = { w: s * 0.5 + wd + s * 0.1, a: s * 0.9, d: s * 0.06, wd }; break; }
    case 'fr': { const fs = s * 0.7, a = lay(n.n, fs), b = lay(n.d, fs), bw = Math.max(a.w, b.w) + s * 0.16; m = { w: bw + s * 0.12, a: s * 0.3 + s * 0.1 + a.d + a.a, d: -s * 0.3 + s * 0.1 + b.a + b.d, fs, na: a, nb: b, bw }; break; }
    case 'par': { const i = lay(n.inner, s); m = { w: i.w + s * 0.7, a: Math.max(i.a, s * 0.8) + s * 0.04, d: Math.max(i.d, s * 0.16) + s * 0.04, i }; break; }
    default: m = { w: 0, a: 0, d: 0 };
  }
  n._m = m; return m;
}
function draw(c, n, x, y, s, col) {
  const m = n._m || lay(n, s); c.fillStyle = col; c.strokeStyle = col;
  switch (n.k) {
    case 't': c.font = fontOf(n, s); c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillText(n.s, x, y); break;
    case 'neg': c.lineWidth = s * 0.085; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + s * 0.08, y - s * 0.3); c.lineTo(x + s * 0.4, y - s * 0.3); c.stroke(); break;
    case 'row': { let xx = x; for (const it of n.items) { draw(c, it, xx, y, s, col); xx += it._m.w; } break; }
    case 'sq': {
      // a radical sign drawn as a path, with its bar over the number
      c.lineWidth = s * 0.075; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
      c.moveTo(x + s * 0.03, y - s * 0.36); c.lineTo(x + s * 0.13, y - s * 0.42); c.lineTo(x + s * 0.27, y + s * 0.02); c.lineTo(x + s * 0.44, y - s * 0.84); c.lineTo(x + s * 0.5 + m.wd + s * 0.06, y - s * 0.84); c.stroke();
      c.font = M.NUMF(s); c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillText(n.v, x + s * 0.5, y); break;
    }
    case 'fr': { const bx = x + s * 0.06, cy = y - s * 0.3;
      draw(c, n.n, bx + (m.bw - m.na.w) / 2, cy - s * 0.1 - m.na.d, m.fs, col); draw(c, n.d, bx + (m.bw - m.nb.w) / 2, cy + s * 0.1 + m.nb.a, m.fs, col);
      c.fillStyle = col; c.fillRect(bx, cy - s * 0.035, m.bw, s * 0.07); break; }
    case 'par': { const top = y - m.a, bot = y + m.d, w = s * 0.13; c.lineWidth = s * 0.075; c.lineCap = 'round';
      for (const [px, dir] of [[x + s * 0.22, -1], [x + m.w - s * 0.22, 1]]) { c.beginPath(); c.moveTo(px - dir * w, top); c.quadraticCurveTo(px + dir * w * 0.9, (top + bot) / 2, px - dir * w, bot); c.stroke(); }
      draw(c, n.inner, x + s * 0.35, y, s, col); break; }
  }
}
// draw a node centred on (cx, cy)
function drawC(c, n, cx, cy, s, col) { const m = lay(n, s); draw(c, n, cx - m.w / 2, cy + (m.a - m.d) / 2, s, col); return m; }

// ---------------- the problem ----------------
function pick(g) {
  const R0 = arr => arr[Math.floor(g.rand() * arr.length)];
  if (g.level === 0) return [{ deg: R0([90, 180, 270, 45]) }];
  const pool = g.level === 1 ? [30, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330] : [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330];
  const a = R0(pool); let b; do { b = R0(pool); } while (b === a || Math.abs(b - a) < 40);
  const RAD = { 30: [1, 6], 45: [1, 4], 60: [1, 3], 90: [1, 2], 120: [2, 3], 135: [3, 4], 150: [5, 6], 180: [1, 1], 210: [7, 6], 225: [5, 4], 240: [4, 3], 270: [3, 2], 300: [5, 3], 315: [7, 4], 330: [11, 6] };
  return [a, b].map(d => g.level === 2 ? { deg: d, rad: RAD[d] } : { deg: d });
}
const angDist = (a, b) => { let d = ((a - b) % TAU + TAU) % TAU; return Math.min(d, TAU - d); };
const ptAt = th => ({ x: CX + Math.cos(th) * R, y: CY - Math.sin(th) * R });

// ---------------- the tray (the kit's state, drawn here so it can show √) ----------------
function openAsk(g, mv) {
  const K = g.s.mk, right = mv.ask.v, seen = new Set([right]);
  const wrong = mv.ask.wrong.filter(w => { if (w == null || seen.has(w)) return false; seen.add(w); return true; }).slice(0, 3);
  const list = [{ v: right, ok: true }, ...wrong.map(v => ({ v }))];
  for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
  const n = list.length, tw = n > 3 ? 74 : 86, gap = n > 3 ? 10 : 16, total = n * tw + (n - 1) * gap;
  list.forEach((ch, i) => { ch.node = valNode(ch.v); ch.x = 180 - total / 2 + tw / 2 + i * (tw + gap); ch.y = 566; ch.w = tw; ch.h = 74; ch.s = 28; });
  K.ask = { mv, list, t0: g.t }; K.busyT = 1e9; g.sfx('pop');
}
function rr(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function drawAsk(g, c) {
  const K = g.s.mk, A = K.ask; if (!A) return; const t = g.t;
  if (g.done && g.result === 'fail' && !A.list.some(q => q.state)) { const r = A.list.find(q => q.ok); if (r) r.state = 'answer'; }
  const out = A.closing ? clamp((t - A.closing) / 0.25, 0, 1) : 0;
  A.list.forEach((ch, i) => {
    const kk = ease((t - A.t0 - i * 0.04) / 0.25) * (1 - out); if (kk <= 0) return;
    const st = ch.state, sh = st === 'bad' && t - ch.at < 0.4 ? Math.sin((t - ch.at) * 60) * 5 : 0, pr = ch.at && t - ch.at < 0.12 ? 3 : 0;
    c.save(); c.translate(ch.x + sh, ch.y + (1 - kk) * 40 + pr); c.globalAlpha *= kk;
    c.fillStyle = 'rgba(10,8,40,0.4)'; rr(c, -ch.w / 2, -ch.h / 2 + 5 - pr, ch.w, ch.h, 18); c.fill();
    const gr = c.createLinearGradient(0, -ch.h / 2, 0, ch.h / 2);
    const [a, b] = st === 'good' ? ['#dff7df', '#a8e2b0'] : st === 'bad' ? ['#ffe0dc', '#f4a8a4'] : st === 'answer' ? ['#fff4c0', '#ffd86a'] : ['#f6f4ff', '#d8d2f4'];
    gr.addColorStop(0, a); gr.addColorStop(1, b); c.fillStyle = gr; rr(c, -ch.w / 2, -ch.h / 2, ch.w, ch.h, 18); c.fill();
    c.strokeStyle = st === 'good' ? M.GOOD : st === 'bad' ? M.BAD : '#5a4a9a'; c.lineWidth = 3; c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.6)'; rr(c, -ch.w / 2 + 8, -ch.h / 2 + 5, ch.w - 16, 10, 5); c.fill();
    drawC(c, ch.node, 0, 2, ch.s, '#241a50');
    c.restore();
  });
  if (!g.done && t - A.t0 > 1.0) { const r = A.list.find(q => q.ok); if (r) M.glowBox(c, { x: r.x, y: r.y, w: r.w, h: r.h }, t, Math.min(1, (t - A.t0 - 1) * 3)); }
}

// ---------------- the moves ----------------
function tryStop(g) {
  const S = g.s, p = S.pts[S.cur]; if (!p || !S.spinning) return;
  S.lastMoveT = g.t;
  const tgt = rad(p.deg), d = Math.min(angDist(S.phi, tgt), angDist(S.phi - S.om * 0.07, tgt)); // a little forgiveness for a late tap
  if (d <= rad(TOL[g.level])) { snap(g, p); return; }
  // a miss: the arrow shudders and keeps going; a red tick marks where it was
  S.misses.push({ th: S.phi, at: g.t }); S.shudderAt = g.t; S.owl.thinkAt = g.t; S.guideAt = g.t;
  S.mk.wrong = (S.mk.wrong || 0) + 1; S.mk.missAt = g.t; g.sfx('boing');
}
function snap(g, p) {
  const S = g.s; p.done = true; p.at = g.t; S.spinning = false; S.snapFrom = S.phi; S.snapAt = g.t; S.phi = rad(p.deg); S.owl.cheerAt = g.t;
  g.sfx('snap'); g.sfx('sparkle'); const q = ptAt(rad(p.deg)); g.burst(q.x, q.y, ['#fff6c0', GOLD, COSC, SINC], 14, 140);
  if (g.mode === 'medium') {
    const which = S.cur % 2 === 0 ? 0 : 1, [cv, sv] = p.ex, right = which ? sv : cv, other = which ? cv : sv, comp = COMPANION[absV(right)] || '1/2';
    p.ask = which;
    M.later(g, 0.2, g => openAsk(g, { ask: { v: right, wrong: [other, neg(right), right[0] === '-' ? neg(comp) : comp, neg(other), '1/2', 'r3/2'] }, after: 0.05,
      resolve(g) { p.ask = null; p.answered = true; p.ansAt = g.t; g.sfx('coin'); next(g, 0.3); } }));
  } else { p.answered = true; next(g, 0.45); }
}
function next(g, wait) {
  const S = g.s; if (S.cur + 1 >= S.pts.length) { S.cur++; return; }
  M.later(g, wait, g => { S.cur++; S.spinning = true; S.lastMoveT = g.t; S.misses = []; });
}

MG.add({
  id: 'spin', stage: 'trig', cmd: 'UNIT CIRCLE!', hint: 'tap', time: 9, mood: 'night', winText: 'On the dot!', hold: 1.6,
  card: {
    title: 'The unit circle', ref: 'Trigonometry', kind: 'Trigonometry',
    text: 'The unit circle is a circle with radius 1, centred where the x-axis and the y-axis cross. Start at the point (1, 0) and turn counter-clockwise by an angle θ (the Greek letter theta). You land on a point of the circle. Its coordinates are (cos θ, sin θ): cos θ is how far across the point is, and sin θ is how far up.\n\nFor example, at θ = 60° the point is (1/2, √3/2), so cos 60° = 1/2 and sin 60° = √3/2. At 90° you are at the top, (0, 1).\n\nAngles can also be measured in radians. Half a turn is π radians, so π radians = 180°, and 60° is π/3.',
    note: 'The point at angle θ on the unit circle is (cos θ, sin θ). Half a turn is 180°, which is π radians.',
    ask: 'What are the coordinates of the point at 180°? What is sin 30°? How many degrees is π/2?',
  },
  init(g) {
    const S = g.s; M.setup(g);
    S.pts = pick(g).map(p => ({ ...p, ex: exact(p.deg) }));
    S.cur = 0; S.phi = 0; S.spinning = true; S.misses = []; S.lastMoveT = 0; S.owl = { cheerAt: -9, thinkAt: -9 };
    S.om = TAU / PERIOD[g.level] * (1 + (g.speed - 1) * 0.3);
    if (S.pts.length === 1) g.dur *= 0.8;
    S.trail = [];
    M.zone(g, 'circle', { x: CX, y: CY, w: R * 2 + 40, h: R * 2 + 40 });
    M.zone(g, 'owl', { x: 300, y: 560, w: 70, h: 80 });
    M.play(g, {
      moves(g) { return S.pts.every(p => p.done && p.answered) ? [] : [{ tap: 'circle' }]; },
      area(g) { return 'circle'; },
      onWin(g) { S.winAt = g.t; g.sfx('magic'); },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    if (S.spinning && !g.done) { const slow = S.shudderAt != null && g.t - S.shudderAt < 0.25 ? 0.35 : 1; S.phi = (S.phi + S.om * slow * dt) % TAU; }
    // after a timeout the arrow glides to the target to show it
    if (g.done && g.result === 'fail' && !S.shown && g.t - g.doneAt > 0.3) { const p = S.pts[S.cur]; if (p && !p.done) { S.shown = p; S.snapFrom = S.phi; S.snapAt = g.t; S.phi = rad(p.deg); S.spinning = false; } }
  },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask && !K.ask.closing) { M.down(g, x, y); return; }
    S.press = g.t; tryStop(g); // a tap anywhere stops the arrow
  },
  up(g) {},
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { if (!K.ask.closing) M.auto(g, dt, synth); return; }
    const p = S.pts[S.cur]; if (!p || !S.spinning || g.t < 0.4) return;
    // tap a moment after the arrow reaches the target, as a person would
    const d = ((S.phi - rad(p.deg)) % TAU + TAU) % TAU;
    if (d < rad(TOL[g.level]) * 0.45 && d > 0) { synth('down', CX, CY); synth('up', CX, CY); }
  },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('trig_observatory', observatory), 0, 0, W, H);
    twinkle(c, t);
    drawCircle(g, c, S);
    drawTarget(g, c, S);
    drawOwl(g, c, S);
    drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});

// ---------------- the observatory ----------------
function observatory(c, w, h) {
  const sky = c.createLinearGradient(0, 0, 0, h); [[0, '#05061c'], [0.4, '#111a4a'], [0.75, '#1e2060'], [1, '#2a1a4a']].forEach(([k, col]) => sky.addColorStop(k, col));
  c.fillStyle = sky; c.fillRect(0, 0, w, h);
  // the nebula: soft clouds of teal and magenta drifting across the sky
  const neb = [[60, 140, 150, '42,190,200', 0.22], [250, 250, 170, '200,70,170', 0.2], [140, 330, 130, '90,120,230', 0.18], [320, 110, 110, '240,120,200', 0.14], [40, 470, 140, '60,200,190', 0.12]];
  for (const [x, y, r, col, a] of neb) { const gr = c.createRadialGradient(x, y, 4, x, y, r); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(1, `rgba(${col},0)`); c.fillStyle = gr; c.fillRect(x - r, y - r, r * 2, r * 2); }
  const R0 = (() => { let s = 17; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  for (let i = 0; i < 220; i++) { const x = R0() * w, y = R0() * 560, r = R0() < 0.08 ? 1.6 : 0.4 + R0() * 0.8; c.fillStyle = `rgba(${R0() < 0.3 ? '200,230,255' : '255,246,230'},${0.3 + R0() * 0.6})`; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  // a ringed planet low in the corner
  const pg = c.createRadialGradient(36, 520, 3, 48, 530, 38); pg.addColorStop(0, '#ffd2a0'); pg.addColorStop(1, '#a8506a'); c.fillStyle = pg; c.beginPath(); c.arc(48, 530, 30, 0, 7); c.fill();
  c.strokeStyle = 'rgba(255,220,190,0.6)'; c.lineWidth = 3; c.beginPath(); c.ellipse(48, 530, 50, 10, -0.35, 0, 7); c.stroke();
  // the observatory roof: a balcony rail and the dome's edge
  c.fillStyle = '#0c0a24'; c.beginPath(); c.moveTo(0, 590); c.quadraticCurveTo(180, 570, 360, 590); c.lineTo(360, 640); c.lineTo(0, 640); c.fill();
  c.strokeStyle = '#2a2458'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 576); c.quadraticCurveTo(180, 556, 360, 576); c.stroke();
  for (let x = 10; x < w; x += 22) { const y = 576 - Math.sin(x / w * Math.PI) * 15; c.fillStyle = '#2a2458'; c.fillRect(x - 1.5, y, 3, 22); }
  c.strokeStyle = 'rgba(160,150,255,0.25)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, 590); c.quadraticCurveTo(180, 570, 360, 590); c.stroke();
  // the brass telescope the owl perches beside
  c.save(); c.translate(256, 588); c.rotate(-0.75);
  const tg = c.createLinearGradient(0, -9, 0, 9); tg.addColorStop(0, '#ffe2a0'); tg.addColorStop(0.5, '#c8902e'); tg.addColorStop(1, '#6a4410'); c.fillStyle = tg;
  c.fillRect(0, -8, 74, 16); c.fillRect(70, -10, 16, 20); c.fillStyle = '#5a3a10'; c.fillRect(20, -9, 4, 18); c.fillRect(48, -9, 4, 18); c.restore();
  c.strokeStyle = '#5a3a10'; c.lineWidth = 4; c.beginPath(); c.moveTo(262, 590); c.lineTo(248, 626); c.moveTo(262, 590); c.lineTo(278, 626); c.stroke();
}
const TW = (() => { let s = 3; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; return [...Array(26)].map(() => [r() * 360, r() * 540, r() * 6, 0.8 + r() * 1.2]); })();
function twinkle(c, t) {
  for (const [x, y, ph, s] of TW) { const a = 0.2 + 0.8 * Math.max(0, Math.sin(t * 1.6 + ph * 2)); c.save(); c.globalAlpha = a; c.fillStyle = '#eef4ff'; star4(c, x, y, s); c.restore(); }
  // a shooting star now and then
  const k = (t % 6.5) / 0.8; if (k < 1) { const x = 300 - k * 160, y = 60 + k * 70; c.save(); const gr = c.createLinearGradient(x, y, x + 50, y - 22); gr.addColorStop(0, 'rgba(255,255,255,0.85)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); c.strokeStyle = gr; c.lineWidth = 2; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 50, y - 22); c.stroke(); c.restore(); }
}
function star4(c, x, y, r) { c.beginPath(); c.moveTo(x, y - r * 2); c.quadraticCurveTo(x, y, x + r * 2, y); c.quadraticCurveTo(x, y, x, y + r * 2); c.quadraticCurveTo(x, y, x - r * 2, y); c.quadraticCurveTo(x, y, x, y - r * 2); c.fill(); }

// ---------------- the circle ----------------
// the arrow's angle right now (it eases onto the target when it snaps)
function armAngle(g, S) {
  if (S.snapAt != null && g.t - S.snapAt < 0.16) { let a = S.snapFrom, b = S.phi; if (b - a > Math.PI) a += TAU; if (a - b > Math.PI) b += TAU; return lerp(a, b, ease((g.t - S.snapAt) / 0.16)); }
  let th = S.phi; if (S.shudderAt != null && g.t - S.shudderAt < 0.3) th += Math.sin((g.t - S.shudderAt) * 70) * 0.05 * (1 - (g.t - S.shudderAt) / 0.3); return th;
}
function drawCircle(g, c, S) {
  const t = g.t, L = g.level;
  // a disc of faint light inside the ring
  const dg = c.createRadialGradient(CX, CY, 10, CX, CY, R + 30); dg.addColorStop(0, 'rgba(120,140,255,0.16)'); dg.addColorStop(0.85, 'rgba(120,140,255,0.06)'); dg.addColorStop(1, 'rgba(120,140,255,0)'); c.fillStyle = dg; c.beginPath(); c.arc(CX, CY, R + 30, 0, 7); c.fill();
  // the axes
  c.save(); c.strokeStyle = 'rgba(220,220,255,0.55)'; c.lineWidth = 2; c.lineCap = 'round';
  c.beginPath(); c.moveTo(CX - R - 24, CY); c.lineTo(CX + R + 24, CY); c.moveTo(CX, CY + R + 24); c.lineTo(CX, CY - R - 24); c.stroke();
  c.fillStyle = 'rgba(220,220,255,0.7)'; c.beginPath(); c.moveTo(CX + R + 30, CY); c.lineTo(CX + R + 20, CY - 5); c.lineTo(CX + R + 20, CY + 5); c.fill(); c.beginPath(); c.moveTo(CX, CY - R - 30); c.lineTo(CX - 5, CY - R - 20); c.lineTo(CX + 5, CY - R - 20); c.fill();
  c.font = M.VARF(15); c.fillStyle = 'rgba(230,230,255,0.85)'; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillText('x', CX + R + 14, CY + 18); c.fillText('y', CX + 9, CY - R - 16);
  c.font = '800 12px Nunito, system-ui, sans-serif'; c.fillStyle = 'rgba(230,230,255,0.75)'; c.textAlign = 'center';
  c.fillText('1', CX + R - 7, CY + 15); c.fillText('−1', CX - R + 10, CY + 15); c.textAlign = 'right'; c.fillText('1', CX - 6, CY - R + 14); c.fillText('−1', CX - 6, CY + R - 6);
  c.restore();
  // the ring: an orbit of light
  c.save(); c.shadowColor = '#9ab0ff'; c.shadowBlur = 14; c.strokeStyle = 'rgba(170,190,255,0.75)'; c.lineWidth = 3; c.beginPath(); c.arc(CX, CY, R, 0, TAU); c.stroke(); c.restore();
  c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 1.2; c.beginPath(); c.arc(CX, CY, R, 0, TAU); c.stroke();
  // marks every 30° and 45°; labels at every 45° (level 0) or at the quadrants
  const marks = L === 0 ? [0, 45, 90, 135, 180, 225, 270, 315] : [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
  for (const d of marks) { const a = rad(d), big = d % 90 === 0, r0 = R - (big ? 7 : 5), r1 = R + (big ? 7 : 5); c.strokeStyle = big ? 'rgba(255,255,255,0.9)' : 'rgba(200,210,255,0.6)'; c.lineWidth = big ? 2.5 : 1.8;
    c.beginPath(); c.moveTo(CX + Math.cos(a) * r0, CY - Math.sin(a) * r0); c.lineTo(CX + Math.cos(a) * r1, CY - Math.sin(a) * r1); c.stroke(); }
  const labs = L === 0 ? [45, 90, 135, 180, 225, 270, 315] : [90, 180, 270];
  const RADL = { 90: [1, 2], 180: [1, 1], 270: [3, 2] };
  for (const d of labs) { const a = rad(d), off = d % 90 ? 24 : 22, x = CX + Math.cos(a) * (R + off), y = CY - Math.sin(a) * (R + off);
    const n = L === 2 ? angleNode({ rad: RADL[d] }) : T(d + '°'), lx = d === 90 ? x + 22 : d === 270 ? x + 24 : d === 180 ? x - 6 : x, ly = d === 180 ? y - 12 : y;
    drawC(c, n, lx, ly, L === 2 ? 15 : 13, 'rgba(225,228,255,0.85)'); }
  // red ticks where the arrow was stopped too early or too late
  for (const ms of S.misses) { const k = (t - ms.at) / 1.4; if (k > 1) continue; const a = ms.th; c.strokeStyle = `rgba(255,90,110,${1 - k})`; c.lineWidth = 4; c.lineCap = 'round';
    c.beginPath(); c.moveTo(CX + Math.cos(a) * (R - 12), CY - Math.sin(a) * (R - 12)); c.lineTo(CX + Math.cos(a) * (R + 12), CY - Math.sin(a) * (R + 12)); c.stroke(); }
  // the guidance: a ghost arrow on the target, and a hand that taps as the arrow arrives
  drawGuide(g, c, S);
  // found points: their shadows on the axes, the point, and its coordinates
  S.pts.forEach((p, i) => { if (p.done || S.shown === p) drawPoint(g, c, S, p, i); });
  // the angle θ as a small arc from the x-axis, and the arrow
  const th = armAngle(g, S), tip = ptAt(th);
  c.save(); c.strokeStyle = 'rgba(255,214,90,0.7)'; c.lineWidth = 2; c.beginPath(); c.arc(CX, CY, 22, 0, -(((th % TAU) + TAU) % TAU), true); c.stroke(); c.restore();
  // a comet tail behind the tip
  if (S.spinning) for (let k = 1; k <= 14; k++) { const a = th - k * 0.045; c.strokeStyle = `rgba(255,220,140,${0.5 * (1 - k / 14)})`; c.lineWidth = 6 * (1 - k / 14) + 1; c.lineCap = 'round'; const q0 = ptAt(a + 0.045), q1 = ptAt(a); c.beginPath(); c.moveTo(q0.x, q0.y); c.lineTo(q1.x, q1.y); c.stroke(); }
  c.save(); c.lineCap = 'round'; c.shadowColor = GOLD; c.shadowBlur = 12;
  c.strokeStyle = '#3a2a10'; c.lineWidth = 7; c.beginPath(); c.moveTo(CX, CY); c.lineTo(tip.x, tip.y); c.stroke();
  c.strokeStyle = '#ffe9a8'; c.lineWidth = 4; c.stroke(); c.restore();
  const flash = S.snapAt != null && t - S.snapAt < 0.35 ? 1 - (t - S.snapAt) / 0.35 : 0;
  const hg = c.createRadialGradient(tip.x, tip.y, 1, tip.x, tip.y, 18 + flash * 20); hg.addColorStop(0, 'rgba(255,250,220,1)'); hg.addColorStop(0.35, 'rgba(255,214,90,0.6)'); hg.addColorStop(1, 'rgba(255,214,90,0)');
  c.fillStyle = hg; c.beginPath(); c.arc(tip.x, tip.y, 18 + flash * 20, 0, 7); c.fill();
  c.fillStyle = '#fffbe8'; c.beginPath(); c.arc(tip.x, tip.y, 5, 0, 7); c.fill();
  c.fillStyle = '#ffe9a8'; c.strokeStyle = '#3a2a10'; c.lineWidth = 2; c.beginPath(); c.arc(CX, CY, 5.5, 0, 7); c.fill(); c.stroke();
  if (flash > 0) { c.strokeStyle = `rgba(255,240,170,${flash})`; c.lineWidth = 3; c.beginPath(); c.arc(tip.x, tip.y, 10 + (1 - flash) * 36, 0, 7); c.stroke(); }
}
function drawPoint(g, c, S, p, i) {
  const t = g.t, old = S.pts.some((q, j) => j > i && (q.done || S.shown === q)), at = p.at ?? (S.snapAt ?? t), k = ease((t - at - 0.08) / 0.25), a = old ? 0.35 : 1;
  const th = rad(p.deg), q = ptAt(th), cosx = CX + Math.cos(th) * R, siny = CY - Math.sin(th) * R;
  c.save(); c.globalAlpha = a;
  // the shadows drop from the point onto the axes: cos across, sin up
  c.lineCap = 'round'; c.setLineDash([5, 5]); c.lineWidth = 2;
  c.strokeStyle = SINC; c.beginPath(); c.moveTo(q.x, q.y); c.lineTo(q.x, lerp(q.y, CY, k)); c.stroke();
  c.strokeStyle = COSC; c.beginPath(); c.moveTo(q.x, q.y); c.lineTo(lerp(q.x, CX, k), q.y); c.stroke(); c.setLineDash([]);
  c.lineWidth = 6; c.shadowBlur = 10;
  if (Math.abs(cosx - CX) > 1) { c.strokeStyle = COSC; c.shadowColor = COSC; c.beginPath(); c.moveTo(CX, CY); c.lineTo(lerp(CX, cosx, k), CY); c.stroke(); }
  if (Math.abs(siny - CY) > 1) { c.strokeStyle = SINC; c.shadowColor = SINC; c.beginPath(); c.moveTo(q.x, CY); c.lineTo(q.x, lerp(CY, siny, k)); c.stroke(); }
  c.shadowBlur = 0;
  // little labels on the shadows
  if (!old && k > 0.6) { c.globalAlpha = a * clamp((k - 0.6) / 0.4, 0, 1);
    const cl = M.row(M.txt('cos'), M.gap(3), M.vr('θ')), sl = M.row(M.txt('sin'), M.gap(3), M.vr('θ'));
    const up = Math.sin(th) >= 0, right = Math.cos(th) >= 0;
    if (Math.abs(cosx - CX) > 30) { const m = M.lay(cl, 13); M.draw(c, cl, (CX + cosx) / 2 - m.w / 2, CY + (up ? 17 : -8), 13, { col: COSC }); }
    if (Math.abs(siny - CY) > 30) { const m = M.lay(sl, 13); M.draw(c, sl, q.x + (right ? 7 : -7 - m.w), (CY + siny) / 2 + 4, 13, { col: SINC }); }
  }
  c.globalAlpha = a;
  // the point
  c.fillStyle = '#fff'; c.shadowColor = GOLD; c.shadowBlur = 14; c.beginPath(); c.arc(q.x, q.y, 7, 0, 7); c.fill(); c.shadowBlur = 0; c.strokeStyle = GOLD; c.lineWidth = 2.5; c.stroke();
  // the coordinates, outside the circle beside the point
  if (!old) {
    const asking = p.ask != null && !p.answered, cv = asking && p.ask === 0 ? T('?') : valNode(p.ex[0]), sv = asking && p.ask === 1 ? T('?') : valNode(p.ex[1]);
    const n = coordNode(cv, sv), s = 22, m = lay(n, s), pop = 1 + Math.sin(clamp((t - at) / 0.3, 0, 1) * Math.PI) * 0.2;
    let lx = CX + Math.cos(th) * (R + 30 + m.w * 0.32), ly = CY - Math.sin(th) * (R + 26) - 4;
    if (Math.sin(th) > 0.8) { lx = q.x + (Math.cos(th) >= -0.01 ? 26 + m.w / 2 : -26 - m.w / 2); ly = q.y - 18; }
    if (Math.sin(th) < -0.8) { lx = q.x + (Math.cos(th) >= -0.01 ? 26 + m.w / 2 : -26 - m.w / 2); ly = q.y + 16; }
    lx = clamp(lx, m.w / 2 + 14, 346 - m.w / 2); ly = clamp(ly, 250, 520);
    c.save(); c.translate(lx, ly); c.scale(pop * k, pop * k);
    const bw = m.w + 18, bh = m.a + m.d + 14; c.fillStyle = 'rgba(16,12,52,0.85)'; rr(c, -bw / 2, -bh / 2, bw, bh, 12); c.fill(); c.strokeStyle = 'rgba(255,214,90,0.8)'; c.lineWidth = 2; c.stroke();
    drawC(c, n, 0, 0, s, '#fff4d8');
    if (asking) { // tint the asked slot in its axis colour
      c.strokeStyle = p.ask === 0 ? COSC : SINC; c.lineWidth = 2.5; const sx = p.ask === 0 ? -m.w / 2 + s * 0.35 + lay(cv, s).w / 2 : m.w / 2 - s * 0.35 - lay(sv, s).w / 2; rr(c, sx - 13, -15, 26, 30, 8); c.stroke(); }
    c.restore();
  }
  c.restore();
}
function drawGuide(g, c, S) {
  const t = g.t, p = S.pts[S.cur]; if (!p || g.done || !S.spinning) return;
  const show = g.level === 0 || t - (S.lastMoveT || 0) > 2 || (S.guideAt != null && t - S.guideAt < 3);
  if (!show) return;
  const th = rad(p.deg), q = ptAt(th), pulse = 0.5 + 0.5 * Math.sin(t * 6);
  c.save(); c.setLineDash([6, 6]); c.lineDashOffset = -t * 20; c.strokeStyle = `rgba(255,214,90,${0.5 + 0.3 * pulse})`; c.lineWidth = 3; c.lineCap = 'round';
  c.beginPath(); c.moveTo(CX, CY); c.lineTo(q.x, q.y); c.stroke(); c.setLineDash([]);
  // the window that counts, as a glowing arc on the ring
  const tol = rad(TOL[g.level]); c.strokeStyle = `rgba(255,214,90,${0.35 + 0.25 * pulse})`; c.lineWidth = 10; c.beginPath(); c.arc(CX, CY, R, -th - tol, -th + tol); c.stroke();
  c.restore();
  M.glowBox(c, { x: q.x, y: q.y, w: 22, h: 22 }, t, 0.8, true);
  // the hand taps just as the arrow sweeps into the window
  const d = ((S.phi - th) % TAU + TAU) % TAU, near = d < tol * 0.8 || TAU - d < 0.15;
  const hx = CX + Math.cos(th) * (R + 6), hy = CY - Math.sin(th) * (R + 6);
  M.hand(c, hx + 2, hy + 6, 1, near ? 1 : 0);
}
// the target angle over the circle: it always glows (the thing to aim for)
function drawTarget(g, c, S) {
  const t = g.t, p = S.pts[Math.min(S.cur, S.pts.length - 1)], y = 212;
  const n = row(THETA(), T(' = ', { tight: true }), angleNode(p)), s = 34, m = lay(n, s);
  const done = p.done, pop = p.at != null ? 1 + Math.sin(clamp((t - p.at) / 0.3, 0, 1) * Math.PI) * 0.15 : 1;
  if (!done && !g.done) M.glowBox(c, { x: 180, y: y - 2, w: m.w + 14, h: m.a + m.d + 6 }, t, 0.7);
  c.save(); c.translate(180, y); c.scale(pop, pop); c.shadowColor = done ? '#8af0a0' : '#ffd65a'; c.shadowBlur = 16; drawC(c, n, 0, 0, s, done ? '#d8ffe0' : '#fff6dc'); c.restore();
  // how many targets (dots), when there are two
  if (S.pts.length > 1) S.pts.forEach((q, i) => { c.fillStyle = q.done ? '#8af0a0' : i === S.cur ? '#ffd65a' : 'rgba(255,255,255,0.3)'; c.beginPath(); c.arc(180 + (i - 0.5) * 16, y + 30, 4, 0, 7); c.fill(); });
}
function drawOwl(g, c, S) {
  const t = g.t, o = S.owl, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const cheer = t - o.cheerAt < 0.7, think = t - o.thinkAt < 0.8, hop = cheer ? Math.sin((t - o.cheerAt) / 0.7 * Math.PI) * 14 : 0;
  const pose = won || cheer ? 'cheer' : 'idle', expr = won ? 'laugh' : lost ? 'sad' : cheer ? 'wow' : think ? 'think' : 'happy';
  c.save(); c.translate(306, 592 - hop); if (think) c.rotate(Math.sin((t - o.thinkAt) * 14) * 0.08);
  try { if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', 0, 0, 1.15, { t, pose, expr, facing: -1 }); else P.dove(c, 0, 0, 1.2, { t }); } catch (e) { }
  c.restore();
}
