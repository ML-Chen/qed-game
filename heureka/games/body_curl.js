// CURL UP! (chem_bio EL-06) — a hedgehog snuffles in autumn leaves while a fox creeps closer. Tap the hedgehog just
// before the fox's nose reaches it: it rolls into a ball, the spines bristle out, the fox gets a prickle on the nose
// and runs off. Curl too early (it can only hold the ball so long) or too late, and the fox gives it a playful nudge
// and it tumbles downhill. Level 2: the fox fakes a pounce from further away first.
const HX = 196, GY = 468, SLOPE_X = 252; // the hedgehog's spot, the ground line, where the hill starts falling away
const groundY = x => x < SLOPE_X ? GY : GY + (x - SLOPE_X) * 0.62;
const CURL_HOLD = [1.7, 1.25, 0.95]; // seconds the hedgehog can stay curled, per level
const FS = 1.35, NOSE = 34 * FS;     // fox scale and how far its nose sits ahead of its feet

function paintWood(o) {
  const sky = o.createLinearGradient(0, 0, 0, 470); sky.addColorStop(0, '#f39a6a'); sky.addColorStop(0.55, '#f8c58a'); sky.addColorStop(1, '#fbe2b0');
  o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
  // a low sun glowing between the trees
  const sun = o.createRadialGradient(250, 300, 10, 250, 300, 190); sun.addColorStop(0, 'rgba(255,248,214,0.95)'); sun.addColorStop(0.25, 'rgba(255,230,170,0.55)'); sun.addColorStop(1, 'rgba(255,220,160,0)');
  o.fillStyle = sun; o.fillRect(0, 100, 360, 400);
  const rnd = P.rng(23);
  // two rows of trunks: far ones pale and hazy, near ones dark plum
  for (const [n, col, w0, a] of [[9, '#d98a6a', 10, 0.55], [5, '#7a3a4a', 22, 0.95]]) {
    for (let i = 0; i < n; i++) {
      const x = (i + 0.3 + rnd() * 0.5) * 360 / n, w = w0 + rnd() * w0 * 0.6; o.globalAlpha = a; o.fillStyle = col;
      o.beginPath(); o.moveTo(x - w / 2, 480); o.lineTo(x - w * 0.38, 0); o.lineTo(x + w * 0.38, 0); o.lineTo(x + w / 2, 480); o.fill();
      if (w0 > 15) { o.strokeStyle = P.shade(col, -0.3); o.lineWidth = 1.5; for (let k = 0; k < 5; k++) { const yy = 140 + rnd() * 300; o.beginPath(); o.moveTo(x - w * 0.2, yy); o.quadraticCurveTo(x, yy + 6, x + w * 0.2, yy - 2); o.stroke(); } }
    }
  }
  o.globalAlpha = 1;
  // canopy of autumn leaves across the top
  for (let i = 0; i < 90; i++) { const x = rnd() * 380 - 10, y = rnd() * 150 - 30, r = 18 + rnd() * 26; o.fillStyle = ['#d4573a', '#e8873a', '#c23a3a', '#f0b040', '#a8342e'][Math.floor(rnd() * 5)]; o.globalAlpha = 0.75; o.beginPath(); o.arc(x, y, r, 0, 7); o.fill(); }
  o.globalAlpha = 1;
  // the ground: a leafy bank that falls away to the right
  const gr = o.createLinearGradient(0, GY - 10, 0, 640); gr.addColorStop(0, '#c9883e'); gr.addColorStop(0.4, '#a5622e'); gr.addColorStop(1, '#6e3a26');
  o.fillStyle = gr; o.beginPath(); o.moveTo(0, GY); o.lineTo(SLOPE_X, GY); o.quadraticCurveTo(SLOPE_X + 30, GY + 4, 360, groundY(360)); o.lineTo(360, 640); o.lineTo(0, 640); o.fill();
  o.strokeStyle = 'rgba(255,220,150,0.6)'; o.lineWidth = 3; o.beginPath(); o.moveTo(0, GY); o.lineTo(SLOPE_X, GY); o.quadraticCurveTo(SLOPE_X + 30, GY + 4, 360, groundY(360)); o.stroke();
  // fallen leaves
  for (let i = 0; i < 160; i++) {
    const x = rnd() * 360, y0 = groundY(x), y = y0 + 4 + rnd() * (640 - y0), a = rnd() * 6.3, s = 4 + rnd() * 6;
    o.save(); o.translate(x, y); o.rotate(a); o.fillStyle = ['#e8873a', '#d4573a', '#f0b040', '#8a3a2a', '#c96a30'][Math.floor(rnd() * 5)];
    o.beginPath(); o.moveTo(-s, 0); o.quadraticCurveTo(0, -s * 0.7, s, 0); o.quadraticCurveTo(0, s * 0.7, -s, 0); o.fill();
    o.strokeStyle = 'rgba(80,30,20,0.4)'; o.lineWidth = 0.8; o.beginPath(); o.moveTo(-s, 0); o.lineTo(s, 0); o.stroke(); o.restore();
  }
  // a mushroom and a log at the left edge
  o.fillStyle = '#f4e6cc'; o.fillRect(30, 548, 9, 26); o.fillStyle = '#d23a3a'; o.beginPath(); o.ellipse(34, 550, 20, 12, 0, Math.PI, 0); o.fill();
  o.fillStyle = '#fff6ea'; for (const [dx, dy] of [[-9, -5], [3, -9], [10, -3]]) { o.beginPath(); o.arc(34 + dx, 550 + dy, 2.6, 0, 7); o.fill(); }
  P.vignette(o, 360, 640, 0.3, '#4a1a20');
}

// the hedgehog, facing left. k: 0 = snuffling, 1 = a tight ball of bristling spines. rot spins it (tumbling).
function hog(c, x, y, k, t, rot = 0, sad = false) {
  const R = 34, cy = y - R + 2;
  c.save(); c.translate(x, cy); c.rotate(rot);
  const sq = 1 - k; // how much of the snout and legs still show
  // legs and belly (they tuck in as it curls)
  if (sq > 0.05) {
    c.fillStyle = '#6a3a2a'; for (const lx of [-18, 14]) { c.beginPath(); c.ellipse(lx * (0.6 + 0.4 * sq), R - 4 - 6 * k, 6 * sq + 1, 5 * sq + 1, 0, 0, 7); c.fill(); }
    c.fillStyle = '#e8cfa6'; c.beginPath(); c.ellipse(0, 12 * sq, R * (0.9 - 0.3 * k), 16 * sq + 4, 0, 0, 7); c.fill();
  }
  // the body under the spines
  const bg = c.createRadialGradient(-8, -12, 4, 0, 0, R); bg.addColorStop(0, '#9a6a4a'); bg.addColorStop(1, '#5a3424');
  c.fillStyle = bg; c.beginPath(); c.ellipse(0, 0, R - 2, R - 2 - 8 * sq, 0, 0, 7); c.fill();
  // spines: long, two-tone, all around the back, more and longer as it curls
  const a0 = Math.PI * (1.08 - 0.62 * k), a1 = Math.PI * (2.0 + 0.62 * k) + 0.2 * k, n = 46;
  const wob = Math.sin(t * 6) * 0.03 * (1 - k);
  for (let pass = 0; pass < 3; pass++) for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * (i + pass * 0.33) / n + wob, L = (12 + 9 * k + (i % 3) * 2) * (1 - pass * 0.12), rr = R - 6 - pass * 9;
    const bx = Math.cos(a) * rr, by = Math.sin(a) * (rr - 8 * sq), tx = Math.cos(a) * (rr + 2 + L), ty = Math.sin(a) * (rr - 8 * sq + L);
    c.strokeStyle = ['#2e1a14', '#4a2a1e', '#5e3826'][pass]; c.lineWidth = 4.2 - pass * 0.6; c.lineCap = 'round'; c.beginPath(); c.moveTo(bx, by); c.lineTo(tx, ty); c.stroke();
    c.strokeStyle = '#f4e2c0'; c.lineWidth = 2.2 - pass * 0.4; c.beginPath(); c.moveTo(bx + (tx - bx) * 0.72, by + (ty - by) * 0.72); c.lineTo(tx, ty); c.stroke();
  }
  // the face (facing left), pulled in as it curls
  if (sq > 0.05) {
    c.save(); c.translate(-R + 6 + 14 * k, 6); c.scale(sq, sq);
    c.fillStyle = '#e8cfa6'; c.beginPath(); c.moveTo(14, -16); c.quadraticCurveTo(-6, -14, -24, 2); c.quadraticCurveTo(-6, 14, 14, 12); c.closePath(); c.fill();
    c.strokeStyle = '#7a4a34'; c.lineWidth = 1.6; c.stroke();
    const sn = Math.sin(t * 9) * 1.5; c.fillStyle = '#2a1414'; c.beginPath(); c.arc(-24 + sn * 0.4, 1 + sn * 0.3, 4.5, 0, 7); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(-25, -0.5, 1.3, 0, 7); c.fill();
    c.fillStyle = '#2a1414'; c.beginPath(); c.arc(-3, -6, sad ? 2.4 : 3.4, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(-4, -7.2, 1.1, 0, 7); c.fill();
    c.fillStyle = 'rgba(232,96,110,0.45)'; c.beginPath(); c.ellipse(-6, 4, 4, 2.4, 0, 0, 7); c.fill();
    c.fillStyle = '#c99a7a'; c.beginPath(); c.ellipse(6, -14, 5, 6, -0.3, 0, 7); c.fill(); // ear
    c.restore();
  }
  c.restore();
}

MG.add({
  id: 'body_curl', stage: 'body', cmd: 'CURL UP!', time: 5, mood: 'bright', winText: 'Prickly!', failText: 'Bonk!',
  card: { title: 'Spines that protect', kind: 'Biology', ref: 'Adaptations: the hedgehog',
    text: "A hedgehog's back is covered in about 5,000 to 7,000 stiff spines. Each spine is a hollow hair made of keratin, the same material as your fingernails.\n\nWhen danger comes close, a ring of muscle under the skin pulls tight like the string of a drawstring bag, and the hedgehog rolls into a ball. Its soft face, belly and legs end up tucked inside, and the spines stand up all around. A fox that sniffs the ball gets a sore nose and usually leaves it alone.",
    note: 'Body parts that help an animal survive, like a hedgehog\'s spines, are called adaptations.' },
  init(g) {
    const s = g.s, f = 1 + (g.speed - 1) * 0.35, L = Math.min(2, g.level);
    s.f = f; s.fox = { x: -70, ph: 'creep', pt: 0, crouch: 0, flee: 0, wait: 0, faked: L < 2 }; s.curl = 0; s.curlAt = -1; s.used = false;
    s.creepV = (L === 0 ? 62 : L === 1 ? 76 : 88) * f;
    s.fakeAt = HX - 150 - g.rand() * 30; // level 2: where the fox fakes a pounce
    s.pauseAt = [-10 + g.rand() * 40, 40 + g.rand() * 30]; s.end = null; s.roll = null; s.leaves = [];
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.used) return;
    if (SK.dist(x, y, HX, GY - 34) > 90) return;
    s.used = true; s.curlAt = g.t; g.sfx('shrink'); g.sfx('rustle');
  },
  update(g, dt) {
    const s = g.s, F = s.fox, L = Math.min(2, g.level), f = s.f;
    // the curl: in fast, held for a while, then the hedgehog peeks out again
    const hold = CURL_HOLD[L];
    if (s.curlAt >= 0) { const a = g.t - s.curlAt; s.curl = a < 0.18 ? a / 0.18 : (a < 0.18 + hold || (s.end === 'win')) ? 1 : Math.max(0, 1 - (a - 0.18 - hold) / 0.3); }
    F.pt += dt;
    const nose = F.x + NOSE, contact = HX - 30;
    if (F.ph === 'creep') {
      // stalk: step, freeze, step
      if (F.wait > 0) F.wait -= dt; else F.x += s.creepV * dt * (0.8 + 0.4 * Math.max(0, Math.sin(g.t * 7)));
      while (s.pauseAt.length && F.x > s.pauseAt[0]) { s.pauseAt.shift(); F.wait = 0.45 / f; }
      if (!F.faked && nose > s.fakeAt) { F.ph = 'fake'; F.pt = 0; F.faked = true; }
      if (nose > contact - (L === 0 ? 46 : 40)) { F.ph = 'crouch'; F.pt = 0; }
    } else if (F.ph === 'fake') { // level 2: crouches, wiggles, then stands up and keeps creeping
      F.crouch = Math.min(1, F.pt / 0.15) * (F.pt < 0.55 ? 1 : Math.max(0, 1 - (F.pt - 0.55) / 0.2)); if (F.pt > 0.8) { F.ph = 'creep'; F.pt = 0; F.crouch = 0; }
    } else if (F.ph === 'crouch') {
      F.crouch = Math.min(1, F.pt / 0.15); if (F.pt > [0.55, 0.42, 0.32][L] / f) { F.ph = 'lunge'; F.pt = 0; g.sfx('whoosh'); }
    } else if (F.ph === 'lunge') {
      F.crouch = Math.max(0, 1 - F.pt * 6); F.x += 260 * f * dt;
      if (nose >= contact && !g.done) {
        if (s.curl > 0.85) { s.end = 'win'; F.ph = 'yelp'; F.pt = 0; g.win(); g.sfx('boing'); g.sfx('wrong'); g.burst(contact, GY - 40, ['#fff6ea', '#ff5a5a', '#ffd45a'], 16, 160); g.shake(4, 0.2); }
        else { s.end = 'fail'; F.ph = 'nudge'; F.pt = 0; s.roll = { x: HX, v: 0, rot: 0 }; g.fail(); g.sfx('boing'); g.sfx('laugh'); }
      }
    } else if (F.ph === 'yelp') { // jumps back, then runs away
      if (F.pt < 0.35) F.x -= 160 * dt; else F.x -= 330 * dt;
    } else if (F.ph === 'nudge') { if (F.pt < 0.3) F.x += 20 * dt; }
    if (s.roll) { // the tumble downhill
      const r = s.roll; r.v = Math.min(260, r.v + (r.x > SLOPE_X ? 520 : 300) * dt); r.x += r.v * dt; r.rot += r.v * dt / 30;
      if (g.rand() < 0.4 && r.x < 380) s.leaves.push({ x: r.x, y: groundY(r.x) - 6, vx: (g.rand() - 0.3) * 120, vy: -80 - g.rand() * 120, a: g.rand() * 6, c: Math.floor(g.rand() * 3) });
    }
    for (const l of s.leaves) { l.vy += 300 * dt; l.x += l.vx * dt; l.y += l.vy * dt; l.a += dt * 6; }
  },
  draw(g, c) {
    const s = g.s, t = g.t, F = s.fox;
    c.drawImage(g.bake('body_curl_wood', paintWood), 0, 0, 360, 640);
    // drifting leaves in the light
    for (let i = 0; i < 6; i++) { const x = (i * 71 + t * 22) % 400 - 20, y = 140 + i * 48 + Math.sin(t * 1.5 + i) * 18; c.save(); c.translate(x, y); c.rotate(t * 2 + i); c.fillStyle = ['#e8873a', '#d4573a', '#f0b040'][i % 3]; c.globalAlpha = 0.85; c.beginPath(); c.moveTo(-6, 0); c.quadraticCurveTo(0, -4, 6, 0); c.quadraticCurveTo(0, 4, -6, 0); c.fill(); c.restore(); }
    // the hedgehog (or the tumbling ball)
    if (s.roll) { const r = s.roll, x = Math.min(r.x, 420); SK.shadow(c, x, groundY(x), 30, 7, 0.25); hog(c, x, groundY(x) + 2, 0.55, t, r.rot, true); }
    else {
      const bob = s.curl < 0.5 ? Math.abs(Math.sin(t * 4)) * 2 : 0; SK.shadow(c, HX, GY, 40, 8, 0.28);
      hog(c, HX, GY - bob, s.curl, t);
      // little sniff puffs while it snuffles in the leaves
      if (s.curl < 0.2 && !g.done) { const k = (t * 1.6) % 1; c.fillStyle = `rgba(255,250,235,${0.6 * (1 - k)})`; c.beginPath(); c.arc(HX - 62 - k * 14, GY - 18 - k * 6, 3 + k * 4, 0, 7); c.fill(); }
      if (s.curl > 0.9 && s.end === 'win' && F.pt < 0.6) { c.strokeStyle = '#ffe27a'; c.lineWidth = 3; for (let i = 0; i < 7; i++) { const a = -2.6 + i * 0.35, r0 = 52 + F.pt * 30; c.beginPath(); c.moveTo(HX + Math.cos(a) * r0, GY - 34 + Math.sin(a) * r0); c.lineTo(HX + Math.cos(a) * (r0 + 12), GY - 34 + Math.sin(a) * (r0 + 12)); c.stroke(); } }
    }
    for (const l of s.leaves) { c.save(); c.translate(l.x, l.y); c.rotate(l.a); c.fillStyle = ['#e8873a', '#d4573a', '#f0b040'][l.c]; c.beginPath(); c.moveTo(-6, 0); c.quadraticCurveTo(0, -4, 6, 0); c.quadraticCurveTo(0, 4, -6, 0); c.fill(); c.restore(); }
    // the fox: creeping, crouching low (rear wiggling), lunging; it yelps and runs off on a win
    const fleeing = F.ph === 'yelp', fx = F.x, cr = F.crouch;
    c.save(); c.translate(fx, GY); c.scale(1 + cr * 0.08, 1 - cr * 0.22); if (cr > 0.5) c.rotate(Math.sin(t * 22) * 0.025);
    if (fleeing && F.pt < 0.35) c.rotate(-0.25);
    SK.animal(c, 'fox', 0, 0, FS, { t, pose: fleeing ? 'hop' : F.ph === 'nudge' ? 'cheer' : F.ph === 'lunge' ? 'hop' : 'walk', expr: fleeing ? 'wow' : F.ph === 'nudge' ? 'laugh' : 'think', facing: fleeing && F.pt > 0.35 ? -1 : 1 });
    c.restore();
    if (fleeing && F.pt < 1) { c.fillStyle = `rgba(255,70,70,${0.8 * (1 - F.pt)})`; c.beginPath(); c.arc(fx + NOSE - 4, GY - 44, 7 + F.pt * 4, 0, 7); c.fill(); }
    // the rabbit host by the mushroom
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'rabbit', 72, 598, 0.75, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
    // guidance: the ring shows when the fox is close enough
    const near = F.x + NOSE > HX - 120 && s.curlAt < 0;
    if (near && !g.done) SK.glow(c, g, HX, GY - 34, 46);
    if (!s.touched && g.level === 0 && near && !g.done) SK.hand(c, HX + 6, GY - 26 + 8 * (1 - Math.abs(Math.sin(t * 5))), Math.abs(Math.sin(t * 5)), 0.9);
  },
  // the bot: tap the moment the fox crouches for its real pounce (not the fake one)
  auto(g, dt, synth) { const s = g.s; if (s.fox.ph === 'crouch' && s.fox.pt > 0.05) SK.bot.tap(g, synth, 'curl', 0, HX, GY - 34); },
});
