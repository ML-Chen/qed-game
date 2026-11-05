// kit.js — SK, the scene kit for Heurēka! microgames: a ghost hand that demonstrates the action, glowing targets,
// dragging and flinging, holding, a small physics step, readable labels, and helpers for the test bot.
// Everything runs on g.t and g.rand(), so microgames stay deterministic for the rewind scrubber.
// Read docs/HEUREKA_MICROGAMES.md before writing a microgame; the reference microgames are heureka/games/motion_slide.js
// (fling), energy_close.js (drag to a target), motion_swing.js (hold, then let go) and startups_dilute.js (drag, then watch).
const SK = (() => {
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const easeOut = k => 1 - Math.pow(1 - clamp(k, 0, 1), 3);
  const easeInOut = k => { k = clamp(k, 0, 1); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

  // ---------- guidance ----------
  // A cartoon hand, its fingertip at (x, y). press 0..1 squashes it as it presses.
  function hand(c, x, y, press = 0, alpha = 1) {
    c.save(); c.globalAlpha *= alpha; c.translate(x, y); c.rotate(-0.35); const s = 1 - press * 0.12; c.scale(s, s);
    c.fillStyle = 'rgba(30,14,36,0.25)'; c.beginPath(); c.ellipse(6, 30, 16, 6, 0, 0, TAU); c.fill();
    c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(-6, 2); c.quadraticCurveTo(-6, -6, 0, -6); c.quadraticCurveTo(6, -6, 6, 2); c.lineTo(6, 14);
    c.quadraticCurveTo(18, 10, 20, 18); c.quadraticCurveTo(22, 32, 14, 42); c.lineTo(-8, 42); c.quadraticCurveTo(-16, 32, -14, 22); c.lineTo(-6, 18); c.closePath(); c.fill(); c.stroke();
    c.restore();
    if (press > 0.5) { c.save(); c.globalAlpha *= alpha * (press - 0.5) * 2; c.strokeStyle = '#ffd45a'; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 14 + press * 6, 0, TAU); c.stroke(); c.restore(); }
  }
  // demo(g, c, kind, a, b, o): a ghost hand loops the action: kind 'tap' at a, 'drag' or 'swipe' from a to b, 'hold' at a.
  // When it shows (the owner: "for every level, gesture to what you're supposed to do if the player is stuck"):
  // - level 0: from o.delay (0.9 s, after the command) until the player first touches the screen;
  // - every level: whenever the player has not touched the screen for SK.IDLE seconds (2.0 at level 0, 2.4 at 1, 2.8
  //   at 2), counted from the start or from their last touch, and it hides again as soon as they touch.
  // Call it last in draw, every frame, with the NEXT thing to do (it must follow the game's state).
  // o: { delay, period, never: true to turn it off for this frame }.
  function demo(g, c, kind, a, b, o = {}) {
    if (g.done || o.never || (g.ptr && g.ptr.down)) return;
    const idle = g.t - (g.lastIn ?? 0), wait = 1.4;
    let t0;
    if (!g.s.touched) t0 = o.delay ?? 0.9; // every level: the hand shows the action from the start until the first touch
    else if (idle >= wait) t0 = (g.lastIn ?? 0) + wait;
    else return;
    if (g.t < t0) return;
    const per = o.period ?? (kind === 'hold' ? 2.2 : kind === 'tap' ? 1.1 : 1.8), k = ((g.t - t0) % per) / per;
    const fadeIn = clamp((g.t - t0) * 4, 0, 1);
    if (kind === 'tap') { const p = k < 0.3 ? 0 : k < 0.45 ? (k - 0.3) / 0.15 : k < 0.6 ? 1 - (k - 0.45) / 0.15 : 0; hand(c, a[0], a[1] + 10 * (1 - p), p, 0.9 * fadeIn); return; }
    if (kind === 'hold') { const p = k < 0.15 ? k / 0.15 : k < 0.8 ? 1 : 1 - (k - 0.8) / 0.2; hand(c, a[0], a[1] + 8 * (1 - p), p, 0.9 * fadeIn); return; }
    // drag / swipe: press at a, travel to b, lift, fade
    const p = k < 0.12 ? k / 0.12 : k < 0.78 ? 1 : 1 - (k - 0.78) / 0.1, m = kind === 'swipe' ? easeOut((k - 0.12) / 0.4) : easeInOut((k - 0.12) / 0.62);
    const x = lerp(a[0], b[0], m), y = lerp(a[1], b[1], m) + (o.arc ? -Math.sin(m * Math.PI) * o.arc : 0);
    if (p > 0.3 && k < 0.85) { c.save(); c.globalAlpha = 0.35 * fadeIn; c.strokeStyle = '#fff6ea'; c.lineWidth = 4; c.setLineDash([6, 8]); c.lineCap = 'round'; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(x, y); c.stroke(); c.restore(); }
    hand(c, x, y, clamp(p, 0, 1), 0.9 * fadeIn * (k > 0.88 ? 0 : 1));
  }
  // a pulsing ring that marks where to act (levels 0 and 1 by default)
  function glow(c, g, x, y, r = 30, col = '#ffe27a', o = {}) {
    if (g.level > (o.level ?? 1) || g.done) return; const p = 0.5 + 0.5 * Math.sin(g.t * 5);
    c.save(); c.globalCompositeOperation = 'lighter'; const gr = c.createRadialGradient(x, y, r * 0.3, x, y, r * 1.5); gr.addColorStop(0, 'rgba(255,240,170,0)'); gr.addColorStop(0.6, `rgba(255,230,140,${0.18 + 0.15 * p})`); gr.addColorStop(1, 'rgba(255,230,140,0)'); c.fillStyle = gr; c.beginPath(); c.arc(x, y, r * 1.5, 0, TAU); c.fill(); c.restore();
    c.save(); c.strokeStyle = col; c.globalAlpha = 0.55 + 0.4 * p; c.lineWidth = 3; c.setLineDash([8, 6]); c.lineDashOffset = -g.t * 30; c.beginPath(); c.arc(x, y, r + p * 4, 0, TAU); c.stroke(); c.restore();
  }
  // Marking what to drag and where (the owner: "if you want me to drag something, that has to be obvious as opposed to
  // just highlighting some things"). Use all three for every drag: SK.grab on the thing you move (a solid pulsing ring,
  // a little hand-grab badge, and a gentle bob), SK.target on where it goes (a dashed outline that breathes, with four
  // arrows pointing in), and SK.arrow between them (a dotted arrow that flows from the thing to the target).
  // They show at every level until the drag starts (pass o.always to keep them at level 2 too; by default level 2 shows
  // only the arrow while the player is idle, like the ghost hand).
  function hintOn(g, o) { return !(g.done || (g.ptr && g.ptr.down)); } // the owner: "all the interaction should be very obvious from the guides": shown at every level whenever the player isn't dragging
  function grab(c, g, x, y, r = 26, o = {}) {
    if (!hintOn(g, o)) return; const p = 0.5 + 0.5 * Math.sin(g.t * 6);
    c.save(); c.strokeStyle = o.col || '#fff6ea'; c.lineWidth = 4; c.globalAlpha = 0.75 + 0.25 * p; c.beginPath(); c.arc(x, y, r + 3 * p, 0, TAU); c.stroke();
    c.strokeStyle = '#3a1640'; c.lineWidth = 1.5; c.globalAlpha = 0.5; c.beginPath(); c.arc(x, y, r + 3 * p + 2.5, 0, TAU); c.stroke(); c.restore();
    // the badge: a small open hand above the thing, bobbing
    const bx = x + r * 0.75, by = y - r * 0.9 - 4 * p; c.save(); c.translate(bx, by); c.fillStyle = '#ffd45a'; c.strokeStyle = '#3a1640'; c.lineWidth = 2;
    c.beginPath(); c.arc(0, 0, 13, 0, TAU); c.fill(); c.stroke(); c.fillStyle = '#fff6ea'; c.lineWidth = 1.6;
    for (let i = 0; i < 4; i++) { c.beginPath(); c.roundRect(-6.5 + i * 3.4, -8 + (i === 0 || i === 3 ? 2 : 0), 3, 8, 1.5); c.fill(); c.stroke(); }
    c.beginPath(); c.roundRect(-7, -1, 13, 8, 3); c.fill(); c.stroke(); c.restore();
  }
  function target(c, g, x, y, r = 30, o = {}) {
    if (!hintOn(g, o)) return; const p = 0.5 + 0.5 * Math.sin(g.t * 4);
    c.save(); c.strokeStyle = o.col || '#ffe27a'; c.lineWidth = 3.5; c.setLineDash([9, 7]); c.lineDashOffset = -g.t * 24; c.globalAlpha = 0.8;
    if (o.w) { c.beginPath(); c.roundRect(x - o.w / 2, y - o.h / 2, o.w, o.h, 12); c.stroke(); } else { c.beginPath(); c.arc(x, y, r + 4 * p, 0, TAU); c.stroke(); }
    c.setLineDash([]); c.fillStyle = o.col || '#ffe27a'; const R = (o.w ? Math.max(o.w, o.h) / 2 : r) + 16 + 6 * (1 - p);
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; c.save(); c.translate(x + Math.cos(a) * R, y + Math.sin(a) * R); c.rotate(a + Math.PI); c.beginPath(); c.moveTo(7, 0); c.lineTo(-5, -6); c.lineTo(-5, 6); c.closePath(); c.fill(); c.restore(); }
    c.restore();
  }
  function arrow(c, g, ax, ay, bx, by, o = {}) {
    if (!(g.done || (g.ptr && g.ptr.down))) {
      const L = Math.hypot(bx - ax, by - ay); if (L < 20) return; const ux = (bx - ax) / L, uy = (by - ay) / L, s0 = o.from ?? 30, s1 = L - (o.to ?? 36);
      c.save(); c.fillStyle = o.col || '#fff6ea'; c.globalAlpha = 0.85; const step = 16, off = (g.t * 40) % step;
      for (let d = s0 + off; d < s1; d += step) { c.beginPath(); c.arc(ax + ux * d, ay + uy * d, 3.2, 0, TAU); c.fill(); }
      const hx = ax + ux * s1, hy = ay + uy * s1; c.translate(hx, hy); c.rotate(Math.atan2(uy, ux)); c.beginPath(); c.moveTo(10, 0); c.lineTo(-6, -8); c.lineTo(-6, 8); c.closePath(); c.fill(); c.strokeStyle = '#3a1640'; c.lineWidth = 1.5; c.stroke(); c.restore();
    }
  }
  // call from the microgame's down handler (or use SK.input) so the demo hand stops once the player has touched
  function touched(g) { g.s.touched = true; }

  // ---------- variety ----------
  // SK.variant(g, n): which of a microgame's n content variants to play (a word, a scene layout, a set of objects),
  // drawn with g.rand and never the same one as this microgame's previous play (the owner: "I shouldn't be doing
  // 'unbelievable' three times in a row"). Call it once in init and keep the result in g.s. Safe for rewind.
  function variant(g, n) {
    if (n <= 1) return 0; let v = Math.floor(g.rand() * n) % n;
    if (v === g.avoid) v = (v + 1 + Math.floor(g.rand() * (n - 1))) % n;
    if (!g.sim) g.def._lastVariant = v; return v;
  }
  // SK.shuffled(g, list): a copy of the list in a random order (g.rand), e.g. for picking several distinct items
  function shuffled(g, list) { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // ---------- dragging and flinging ----------
  // pointer tracking for a drag: SK.dragStart(g, obj, x, y) on down (obj = whatever you grabbed, with x, y),
  // SK.dragMove(g, x, y) on move (moves obj keeping the grab offset; returns obj), SK.dragEnd(g) on up (returns
  // { obj, vx, vy } with the release velocity in px/s, measured over the last 0.1 s).
  function dragStart(g, obj, x, y) { touched(g); g.s._drag = { obj, ox: obj ? obj.x - x : 0, oy: obj ? obj.y - y : 0, pts: [{ x, y, t: g.t }] }; return obj; }
  function dragMove(g, x, y) { const d = g.s._drag; if (!d) return null; d.pts.push({ x, y, t: g.t }); if (d.pts.length > 12) d.pts.shift(); if (d.obj) { d.obj.x = x + d.ox; d.obj.y = y + d.oy; } return d.obj; }
  function dragEnd(g) {
    const d = g.s._drag; if (!d) return null; g.s._drag = null; const n = d.pts.length, last = d.pts[n - 1]; let i = n - 1;
    while (i > 0 && last.t - d.pts[i - 1].t < 0.1) i--; const first = d.pts[i], dt = Math.max(1 / 60, last.t - first.t);
    return { obj: d.obj, vx: (last.x - first.x) / dt, vy: (last.y - first.y) / dt, x: last.x, y: last.y };
  }
  function dragging(g) { return g.s._drag ? g.s._drag.obj : null; }
  // the nearest item (with x, y) within r of (x, y), or null
  function pick(items, x, y, r = 44) { let best = null, bd = r; for (const it of items) { if (!it || it.gone) continue; const d = dist(it.x, it.y, x, y); if (d < bd) { bd = d; best = it; } } return best; }

  // ---------- holding ----------
  // SK.holdStart(g) on down, SK.holdEnd(g) on up (returns seconds held); SK.held(g) while down returns seconds so far.
  function holdStart(g) { touched(g); g.s._hold = g.t; }
  function holdEnd(g) { const h = g.s._hold == null ? 0 : g.t - g.s._hold; g.s._hold = null; return h; }
  function held(g) { return g.s._hold == null ? 0 : g.t - g.s._hold; }

  // ---------- a small physics step ----------
  // b: { x, y, vx, vy, r } plus optional e (bounciness 0..1), mu (sliding friction, px/s² of slowing on the floor).
  // w: { gy (gravity px/s², default 900), floor (y of the ground), left, right (walls), drag (air, per second) }.
  // Returns 'floor' / 'wall' when it bounced this step (for sounds).
  function step(b, dt, w = {}) {
    const gy = w.gy ?? 900; let hitWhat = null;
    b.vy += gy * dt; if (w.drag) { const k = Math.exp(-w.drag * dt); b.vx *= k; b.vy *= k; }
    b.x += b.vx * dt; b.y += b.vy * dt;
    const r = b.r || 0;
    if (w.floor != null && b.y + r > w.floor) {
      b.y = w.floor - r; if (b.vy > 0) { if (b.vy > 60) hitWhat = 'floor'; b.vy = -b.vy * (b.e ?? 0.3); if (Math.abs(b.vy) < 40) b.vy = 0; }
      const mu = b.mu ?? w.mu ?? 0; if (mu) { const dv = mu * dt; b.vx = Math.abs(b.vx) <= dv ? 0 : b.vx - Math.sign(b.vx) * dv; }
      b.onFloor = true;
    } else b.onFloor = false;
    if (w.left != null && b.x - r < w.left) { b.x = w.left + r; if (b.vx < 0) { b.vx = -b.vx * (b.e ?? 0.3); hitWhat = hitWhat || 'wall'; } }
    if (w.right != null && b.x + r > w.right) { b.x = w.right - r; if (b.vx > 0) { b.vx = -b.vx * (b.e ?? 0.3); hitWhat = hitWhat || 'wall'; } }
    return hitWhat;
  }

  // ---------- drawing helpers ----------
  // a short readable label: bold text on a dark rounded pill (at least 18 px; keep it to three words)
  function tag(c, text, x, y, size = 20, col = '#fff6ea', bg = 'rgba(30,14,36,0.72)') {
    c.save(); c.font = `900 ${size}px Nunito, system-ui, sans-serif`; const w = c.measureText(text).width + size * 1.1, h = size * 1.55;
    c.fillStyle = bg; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, h / 2); c.fill();
    c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, x, y + size * 0.06); c.restore();
  }
  // a soft shadow ellipse on the ground
  function shadow(c, x, y, rx, ry = rx * 0.28, a = 0.25) { c.save(); c.fillStyle = `rgba(30,14,36,${a})`; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill(); c.restore(); }
  // the host animal, safely (falls back to nothing if the cast failed to load)
  function animal(c, kind, x, y, s, o = {}) { try { return ANI.draw(c, kind, x, y, s, o); } catch (e) { return null; } }
  // a radial highlight on a round object (lit from the upper left, as in paint.js)
  function ball(c, x, y, r, col, o = {}) {
    const g2 = c.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r); g2.addColorStop(0, P.shade(col, 0.45)); g2.addColorStop(0.6, col); g2.addColorStop(1, P.shade(col, -0.35));
    c.fillStyle = g2; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.strokeStyle = o.edge || P.shade(col, -0.6); c.lineWidth = o.lw || 2; c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.55)'; c.beginPath(); c.ellipse(x - r * 0.35, y - r * 0.42, r * 0.28, r * 0.16, -0.6, 0, TAU); c.fill();
  }

  // ---------- the test bot ----------
  // In a microgame's auto(g, dt, synth), call these every frame; each acts once, at its time.
  // SK.bot.tap(g, synth, 'key', t, x, y); SK.bot.drag(g, synth, 'key', t, [x0, y0], [x1, y1], dur);
  // SK.bot.hold(g, synth, 'key', t, x, y, dur). They return true while running or once done.
  const bot = {
    tap(g, synth, key, t, x, y) { const B = g.s._bot = g.s._bot || {}; if (B[key] || g.t < t) return !!B[key]; B[key] = 1; synth('down', x, y); synth('up', x, y); return true; },
    drag(g, synth, key, t, a, b, dur = 0.5) {
      const B = g.s._bot = g.s._bot || {}; if (B[key] === 2 || g.t < t) return B[key] === 2; const k = clamp((g.t - t) / dur, 0, 1), x = lerp(a[0], b[0], k), y = lerp(a[1], b[1], k);
      if (!B[key]) { B[key] = 1; synth('down', a[0], a[1]); return false; } synth('move', x, y); if (k >= 1) { B[key] = 2; synth('up', b[0], b[1]); } return B[key] === 2;
    },
    hold(g, synth, key, t, x, y, dur) { const B = g.s._bot = g.s._bot || {}; if (B[key] === 2 || g.t < t) return B[key] === 2; if (!B[key]) { B[key] = 1; synth('down', x, y); } if (g.t >= t + dur) { B[key] = 2; synth('up', x, y); } return B[key] === 2; },
  };

  return { TAU, clamp, lerp, easeOut, easeInOut, dist, hand, demo, glow, grab, target, arrow, touched, variant, shuffled, dragStart, dragMove, dragEnd, dragging, pick, holdStart, holdEnd, held, step, tag, shadow, animal, ball, bot };
})();
