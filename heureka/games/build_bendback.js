// BEND BACK! (build EE ME-13) — a paperclip and no tools. Swipe the free end of the wire left and right to bend it back
// and forth: every reversal grows a tiny crack at the bend, and the bend warms up, until the wire snaps in two. Swiping
// the same way again only pushes the bend further, it does not break the wire: one big pull would just straighten it.
// That is metal fatigue. Level 2: a thicker wire that takes more bends.
const BB_P = [180, 420], BB_LEN = 150, BB_LV = [{ n: 10, w: 9 }, { n: 12, w: 10 }, { n: 16, w: 12 }];
function bbPaint(o) {
  B5.vgrad(o, 0, 0, 360, 640, ['#cfe4ec', '#e8f0ec', '#f6efe0']);
  // the workbench, seen close up
  B5.vgrad(o, 0, 470, 360, 170, ['#c48a54', '#a8703e', '#8a5a34']);
  o.strokeStyle = 'rgba(90,50,20,0.3)'; o.lineWidth = 2; for (let y = 490; y < 640; y += 22) { o.beginPath(); o.moveTo(0, y); o.bezierCurveTo(120, y + 6, 240, y - 6, 360, y + 3); o.stroke(); }
  // pegboard on the wall with a few tools
  o.fillStyle = '#e8d4b0'; o.fillRect(20, 150, 320, 200); o.fillStyle = 'rgba(120,90,60,0.35)'; for (let x = 36; x < 340; x += 24) for (let y = 166; y < 350; y += 24) { o.beginPath(); o.arc(x, y, 2.5, 0, 7); o.fill(); }
  P.grain(o, 360, 640, 0.03);
}
function bbWire(c, pts, w) { // a steel wire along the points
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
  c.strokeStyle = '#4a4a5a'; c.lineWidth = w + 3; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
  c.strokeStyle = '#b8bcc8'; c.lineWidth = w; c.stroke(); c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = w * 0.3; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x - w * 0.2, y - w * 0.2) : c.moveTo(x - w * 0.2, y - w * 0.2)); c.stroke(); c.restore();
}
function bbArm(a) { // the free end: straight up from the bend, then a little hook, turned by angle a
  const pts = [], ca = Math.cos(a), sa = Math.sin(a), P0 = BB_P; const loc = [[0, 0], [0, -BB_LEN], [-4, -BB_LEN - 14], [-18, -BB_LEN - 18], [-30, -BB_LEN - 8], [-30, -BB_LEN + 40]];
  for (const [x, y] of loc) pts.push([P0[0] + x * ca - y * sa, P0[1] + x * sa + y * ca]); return pts;
}
MG.add({
  id: 'bendback', stage: 'build', cmd: 'BEND THE CLIP BACK AND FORTH!', time: 5, mood: 'desert', winText: 'Fatigue!', failText: 'Still bent!',
  card: { title: 'Small bends break metal', kind: 'Engineering', ref: 'Metal fatigue',
    text: 'One hard pull will not snap a paperclip. It just bends or straightens. But bend it back and forth a few times and it breaks.\n\nEach bend makes tiny cracks in the metal at the bend. Bending it back opens and closes them, and every time they grow a little, until the wire is cracked right through. The bend also gets warm, from the work done on the metal. This is called metal fatigue.\n\nEngineers design aircraft wings, bridges and bike frames so the shaking they feel every day never grows cracks like these.',
    note: 'Many small back-and-forth bends grow cracks that break metal, even when one big pull would not. That is fatigue.' },
  init(g) { const s = g.s; s.L = BB_LV[Math.min(2, g.level)]; s.side = 1; s.a = 0.55; s.crack = 0; s.n = 0; s.heat = 0; s.snapT = 0; s.sw = null; s.wob = 0; },
  down(g, x, y) { SK.touched(g); g.s.sw = [x, y]; },
  up(g, x, y) {
    const s = g.s, a = s.sw; s.sw = null; if (!a || g.done) return; const dx = x - a[0]; if (Math.abs(dx) < 26) return;
    const d = Math.sign(dx);
    if (d !== s.side) { s.side = d; s.n++; s.crack = s.n / s.L.n; s.heat = Math.min(1, s.heat + 0.25); g.sfx('stretch'); g.sfx('click');
      if (s.n >= s.L.n) { s.snapT = g.t; g.win(); g.sfx('snap'); g.sfx('cheer'); g.shake(4, 0.25); g.burst(BB_P[0], BB_P[1], ['#fff6c0', '#ffb040', '#c8ccd8'], 22, 220); } }
    else { s.wob = g.t; g.sfx('boing'); } // pushed the same way again: it just bends further, no new crack
  },
  update(g, dt) { const s = g.s; s.heat = Math.max(0, s.heat - dt * 0.12); if (!s.snapT) s.a += (s.side * 0.55 - s.a) * Math.min(1, dt * 14); },
  draw(g, c) {
    const s = g.s, L = s.L, t = g.t;
    c.drawImage(g.bake('bendback_bg', bbPaint), 0, 0, 360, 640);
    // the fixed half of the paperclip, held flat on the bench under the hedgehog's paw
    const base = [[BB_P[0], BB_P[1]], [BB_P[0], 520], [BB_P[0] + 4, 540], [BB_P[0] + 22, 548], [BB_P[0] + 40, 540], [BB_P[0] + 44, 520], [BB_P[0] + 44, 470]];
    bbWire(c, base, L.w);
    // the free half: swings with each bend; after the snap it flies off
    let arm = bbArm(s.a + (s.wob && t - s.wob < 0.3 ? s.side * 0.12 * Math.sin((t - s.wob) * 40) : 0));
    if (s.snapT) { const k = t - s.snapT, dx = s.side * 140 * k, dy = -200 * k + 500 * k * k, r = s.side * k * 6; arm = arm.map(([x, y]) => { const ox = x - BB_P[0], oy = y - BB_P[1]; return [BB_P[0] + ox * Math.cos(r) - oy * Math.sin(r) + dx, BB_P[1] + ox * Math.sin(r) + oy * Math.cos(r) + dy]; }); }
    bbWire(c, arm, L.w);
    // the bend: warm, with a crack that grows each time it is bent back
    if (s.heat > 0.02) { c.save(); c.globalCompositeOperation = 'lighter'; const hg = c.createRadialGradient(BB_P[0], BB_P[1], 2, BB_P[0], BB_P[1], 30); hg.addColorStop(0, `rgba(255,120,60,${0.6 * s.heat})`); hg.addColorStop(1, 'rgba(255,80,40,0)'); c.fillStyle = hg; c.beginPath(); c.arc(BB_P[0], BB_P[1], 30, 0, 7); c.fill(); c.restore(); }
    if (s.crack > 0 && !s.snapT) { const d = L.w * 0.5 * Math.min(1, s.crack) + 1; c.strokeStyle = '#1e1a24'; c.lineWidth = 2; c.beginPath(); c.moveTo(BB_P[0] - L.w / 2 - 1, BB_P[1] - 2); c.lineTo(BB_P[0] - L.w / 2 + d, BB_P[1]); c.lineTo(BB_P[0] - L.w / 2 - 1, BB_P[1] + 2); c.stroke();
      for (let i = 0; i < Math.min(5, s.n); i++) { c.strokeStyle = 'rgba(30,26,36,0.6)'; c.lineWidth = 1; c.beginPath(); c.moveTo(BB_P[0] + L.w / 2, BB_P[1] - 4 + i * 2); c.lineTo(BB_P[0] + L.w / 2 - d * 0.6, BB_P[1] - 3 + i * 2); c.stroke(); } }
    // how many bends so far: pips along the bench
    for (let i = 0; i < L.n; i++) { const x = 180 + (i - (L.n - 1) / 2) * Math.min(22, 300 / L.n); c.fillStyle = i < s.n ? '#ff8a40' : 'rgba(60,40,30,0.3)'; c.beginPath(); c.arc(x, 596, 6, 0, 7); c.fill(); }
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'hedgehog', 268, 560, 0.85, { t, facing: -1, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : s.n ? 'think' : 'happy' });
    const tip = bbArm(s.a)[1];
    if (!g.done) SK.glow(c, g, tip[0], tip[1] + 20, 30, '#ffe27a', { level: 2 });
    // guidance: swipe the free end over to the other side
    SK.demo(g, c, 'swipe', [tip[0], tip[1] + 30], [tip[0] - s.side * 150, tip[1] + 40], { period: 1.0 });
  },
  auto(g, dt, synth) { const s = g.s, B = s._bot = s._bot || {}; if (g.done || g.t < 0.9) return; if (!B.last || g.t - B.last > 0.14) { B.last = g.t; const tip = bbArm(s.a)[1]; synth('down', tip[0], tip[1] + 30); synth('up', tip[0] - s.side * 120, tip[1] + 30); } },
});
