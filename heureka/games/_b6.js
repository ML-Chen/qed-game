// _b6.js — shared helpers for builder b6's circuits_ and robots_ microgames: a turnable knob (drag around it, or
// slide up and down near its centre) and its drawing. Everything is deterministic: state lives in the knob object,
// which the microgame keeps inside g.s.
const B6 = (() => {
  const TAU = Math.PI * 2, SWEEP = Math.PI * 1.5; // the knob turns 270 degrees, from lower left over the top to lower right
  // a knob: { x, y, r, k (0..1), grab: null }
  function knob(x, y, r, k) { return { x, y, r, k, grab: null }; }
  const ang = (kn, x, y) => Math.atan2(x - kn.x, -(y - kn.y)); // 0 = straight up, clockwise positive
  function knobDown(g, kn, x, y, reach = 2) {
    if (SK.dist(x, y, kn.x, kn.y) > kn.r * reach) return false;
    SK.touched(g); kn.grab = { a: ang(kn, x, y), y }; return true;
  }
  function knobMove(g, kn, x, y) {
    const G = kn.grab; if (!G) return;
    const d = SK.dist(x, y, kn.x, kn.y);
    if (d < kn.r * 0.5) { kn.k = SK.clamp(kn.k - (y - G.y) / 220, 0, 1); } // near the centre: slide up to turn up
    else { let da = ang(kn, x, y) - G.a; if (da > Math.PI) da -= TAU; if (da < -Math.PI) da += TAU; kn.k = SK.clamp(kn.k + da / SWEEP, 0, 1); }
    G.a = ang(kn, x, y); G.y = y;
  }
  function knobUp(kn) { const was = !!kn.grab; kn.grab = null; return was; }
  // paint a chunky knob with ticks around it; o: { col, cap, tick, lit (0..1 colour of the arc), from (start colour) }
  function drawKnob(c, kn, o = {}) {
    const { x, y, r } = kn, a0 = -Math.PI / 2 - SWEEP / 2 - Math.PI / 2; // canvas angle of k = 0
    const ca = k => -Math.PI / 2 + (k - 0.5) * SWEEP; // canvas angle for k
    c.save();
    // tick marks
    for (let i = 0; i <= 10; i++) { const a = ca(i / 10), r1 = r + 8, r2 = r + (i % 5 ? 14 : 19); c.strokeStyle = o.tick || 'rgba(255,240,210,0.75)'; c.lineWidth = i % 5 ? 2 : 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); c.lineTo(x + Math.cos(a) * r2, y + Math.sin(a) * r2); c.stroke(); }
    // the lit arc showing how far it is turned
    c.strokeStyle = o.arc || '#ffb43a'; c.lineWidth = 5; c.beginPath(); c.arc(x, y, r + 4, ca(0), ca(kn.k)); c.stroke();
    // body
    SK.shadow(c, x + 3, y + r * 0.85, r * 0.95, r * 0.3, 0.35);
    const gr = c.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r); gr.addColorStop(0, P.shade(o.col || '#3a3440', 0.5)); gr.addColorStop(0.7, o.col || '#3a3440'); gr.addColorStop(1, P.shade(o.col || '#3a3440', -0.5));
    c.fillStyle = gr; c.beginPath();
    for (let i = 0; i < 24; i++) { const a = i / 24 * TAU + ca(kn.k), rr = r * (i % 2 ? 0.93 : 1); c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    c.closePath(); c.fill(); c.strokeStyle = 'rgba(0,0,0,0.5)'; c.lineWidth = 2; c.stroke();
    c.fillStyle = o.cap || '#c8c0b8'; c.beginPath(); c.arc(x, y, r * 0.62, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(x - r * 0.2, y - r * 0.25, r * 0.3, r * 0.15, -0.5, 0, TAU); c.fill();
    // pointer
    const a = ca(kn.k); c.strokeStyle = o.ptr || '#ff5a3a'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + Math.cos(a) * r * 0.2, y + Math.sin(a) * r * 0.2); c.lineTo(x + Math.cos(a) * r * 0.85, y + Math.sin(a) * r * 0.85); c.stroke();
    c.restore(); void a0;
  }
  // bot helper: turn the knob from its current k to k1 by dragging around its rim in small chords (no straight line
  // through the centre). Call every frame; returns true when finished.
  function botTurn(g, synth, kn, key, t, k1, dur = 0.6) {
    const B = g.s._bot = g.s._bot || {}; if (B[key] === 2 || g.t < t) return B[key] === 2;
    const ca = k => -Math.PI / 2 + (k - 0.5) * SWEEP, R = kn.r * 1.3;
    if (!B[key]) { B[key] = 1; B[key + 'k0'] = kn.k; const a = ca(kn.k); synth('down', kn.x + Math.cos(a) * R, kn.y + Math.sin(a) * R); return false; }
    const m = SK.clamp((g.t - t) / dur, 0, 1), a = ca(SK.lerp(B[key + 'k0'], k1, m)); synth('move', kn.x + Math.cos(a) * R, kn.y + Math.sin(a) * R);
    if (m >= 1) { B[key] = 2; synth('up', kn.x + Math.cos(a) * R, kn.y + Math.sin(a) * R); } return B[key] === 2;
  }
  // a few drifting stars / dust motes for night scenes (deterministic: seeded, animated by t only)
  function motes(c, t, n, seed, box, col) { const rnd = P.rng(seed); c.save(); for (let i = 0; i < n; i++) { const x = box[0] + rnd() * box[2], y = box[1] + ((rnd() * box[3] - t * (6 + rnd() * 10)) % box[3] + box[3]) % box[3], a = 0.3 + 0.5 * Math.abs(Math.sin(t * (1 + rnd()) + i)); c.globalAlpha = a; c.fillStyle = col; c.beginPath(); c.arc(x, y, 1 + rnd() * 1.6, 0, TAU); c.fill(); } c.restore(); }
  return { knob, knobDown, knobMove, knobUp, drawKnob, botTurn, motes, SWEEP };
})();
