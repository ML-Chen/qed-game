// TRACE! (space EE EL-05) — a farm at dawn, the Sun peeking over the left hills. Drag the Sun across the sky: up, over the
// top at noon, and down on the far side. The day plays along with the trace (rooster at sunrise, lunch at noon, the owl
// wakes at sunset). Drag it straight up and back down and it sets where it rose: the sky goes dark and the owl is baffled.
// Level 2 is a winter day: the Sun rises and sets closer together and cannot climb as high.
const TR_H = 452, TR_R = 24;
const TR_L = [
  { rise: 46, set: 314, peak: 250, cap: 0, winter: false },
  { rise: 46, set: 314, peak: 250, cap: 0, winter: false },
  { rise: 100, set: 262, peak: 350, cap: 318, winter: true },
];
function trSky(alt) { // night -> dawn -> day colours by the Sun's height
  const N = ['#262660', '#56407e', '#b8647a'], D = ['#5a4a8a', '#e8869a', '#ffcf8a'], Y = ['#4a9ee0', '#8cccf0', '#e2f4f8'];
  const k = SK.clamp(alt, 0, 1); return k < 0.22 ? N.map((c, i) => P.mix(c, D[i], k / 0.22)) : D.map((c, i) => P.mix(c, Y[i], SK.clamp((k - 0.22) / 0.5, 0, 1)));
}
function trGround(o, L) {
  const w = L.winter, gy = x => TR_H - 10 - 16 * Math.sin(x / 60 + 0.4) - 10 * Math.sin(x / 23);
  // far hills (the Sun hides behind these)
  o.fillStyle = w ? '#c8d4e8' : '#6c9a5a'; o.beginPath(); o.moveTo(0, 640); for (let x = 0; x <= 360; x += 6) o.lineTo(x, gy(x)); o.lineTo(360, 640); o.fill();
  o.fillStyle = w ? '#dfe8f4' : '#86b464'; o.beginPath(); o.moveTo(0, 640); for (let x = 0; x <= 360; x += 6) o.lineTo(x, TR_H + 14 - 8 * Math.sin(x / 40 + 2)); o.lineTo(360, 640); o.fill();
  // the field with furrows
  B5.vgrad(o, 0, 490, 360, 150, w ? ['#eef3fa', '#d6e0ee', '#c4d0e4'] : ['#a8cc6a', '#88b050', '#6a9440']);
  o.strokeStyle = w ? 'rgba(150,170,200,0.4)' : 'rgba(80,110,40,0.35)'; o.lineWidth = 2;
  for (let i = 0; i < 9; i++) { o.beginPath(); o.moveTo(180, 492); o.lineTo(-200 + i * 95, 650); o.stroke(); }
  if (!w) P.flowers(o, 360, 520, 620, 26, undefined, 4);
  // the barn
  o.save(); o.translate(196, 470);
  o.fillStyle = '#b8383a'; o.strokeStyle = '#4a1a2a'; o.lineWidth = 2.5; o.beginPath(); o.moveTo(-40, 0); o.lineTo(-40, -44); o.lineTo(-24, -66); o.lineTo(24, -66); o.lineTo(40, -44); o.lineTo(40, 0); o.closePath(); o.fill(); o.stroke();
  if (w) { o.fillStyle = '#fff'; o.beginPath(); o.moveTo(-44, -42); o.lineTo(-24, -70); o.lineTo(24, -70); o.lineTo(44, -42); o.lineTo(36, -44); o.lineTo(22, -62); o.lineTo(-22, -62); o.lineTo(-36, -44); o.fill(); }
  o.fillStyle = '#f4e6d0'; o.fillRect(-14, -30, 28, 30); o.strokeRect(-14, -30, 28, 30); o.beginPath(); o.moveTo(-14, -30); o.lineTo(14, 0); o.moveTo(14, -30); o.lineTo(-14, 0); o.stroke();
  o.fillStyle = '#ffd77a'; o.fillRect(-7, -56, 14, 12); o.strokeRect(-7, -56, 14, 12);
  o.restore();
  // the fence
  o.strokeStyle = '#8a5a34'; o.lineWidth = 4; o.beginPath(); o.moveTo(0, 506); o.lineTo(140, 506); o.moveTo(0, 520); o.lineTo(140, 520); o.stroke();
  o.fillStyle = '#a06a3e'; for (let x = 10; x <= 140; x += 32) { o.fillRect(x - 4, 494, 8, 36); }
  // the owl's tree at the right
  o.save(); if (w) { o.strokeStyle = '#5e3e26'; o.lineCap = 'round'; o.lineWidth = 9; o.beginPath(); o.moveTo(330, 560); o.lineTo(330, 440); o.stroke(); o.lineWidth = 4; o.beginPath(); o.moveTo(330, 470); o.lineTo(302, 446); o.moveTo(330, 456); o.lineTo(352, 430); o.moveTo(330, 445); o.lineTo(318, 418); o.stroke(); }
  else P.tree(o, 332, 560, 1.15, '#4f8a44', 9);
  o.restore();
  P.grain(o, 360, 640, 0.035);
}
MG.add({
  id: 'trace', stage: 'space', cmd: 'TRACE!', time: 5, mood: 'bright', winText: 'Good night!', failText: 'Huh?',
  card: { title: "The Sun's path", kind: 'Astronomy', ref: 'Apparent motion of the Sun',
    text: 'Every morning the Sun rises on one side of the sky, the east. It climbs highest around noon and sets on the other side, the west. It never goes straight up and falls back.\n\nThe Sun is not really moving across the sky. The Earth spins once a day, and as we turn, the Sun seems to sweep across from east to west.\n\nIn winter the path is lower and shorter, so days are short and noon shadows are long.',
    note: 'The Sun rises in the east, is highest at noon and sets in the west, because the Earth spins.' },
  init(g) {
    const s = g.s, L = TR_L[Math.min(2, g.level)]; s.L = L;
    s.sun = { x: L.rise, y: TR_H - 30 }; s.trail = []; s.peak = 999; s.rose = false; s.crow = 0; s.lunch = 0; s.setT = 0; s.backT = 0;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (SK.dist(x, y, s.sun.x, s.sun.y) < 64) SK.dragStart(g, s.sun, x, y); },
  move(g, x, y) { const s = g.s; if (g.done || !SK.dragging(g)) return; SK.dragMove(g, x, y);
    const L = s.L; s.sun.x = SK.clamp(s.sun.x, 14, 346); s.sun.y = SK.clamp(s.sun.y, Math.max(140, L.cap), TR_H + 8); },
  up(g) { SK.dragEnd(g); },
  update(g, dt) {
    const s = g.s, L = s.L, u = s.sun;
    if (s.setT) { u.y += 60 * dt; return; } // sinking behind the hills after a good day
    if (s.backT) { u.y += 50 * dt; return; }
    if (g.done) return;
    const last = s.trail[s.trail.length - 1]; if (!last || SK.dist(last[0], last[1], u.x, u.y) > 6) { s.trail.push([u.x, u.y]); if (s.trail.length > 90) s.trail.shift(); }
    if (u.y < TR_H - 70) s.rose = true;
    if (!s.crow && u.y < TR_H - 30) { s.crow = g.t; g.sfx('tweet'); g.sfx('bell'); }
    if (Math.abs(u.x - 180) < 80) s.peak = Math.min(s.peak, u.y);
    if (!s.lunch && s.peak < L.peak + 10 && Math.abs(u.x - 180) < 60) { s.lunch = g.t; g.sfx('munch'); }
    // set on the far side after passing high over the middle: the day is done
    if (s.peak < L.peak && u.x > L.set - 34 && u.y > TR_H - 40) { s.setT = g.t; SK.dragEnd(g); g.win(); g.sfx('magic'); g.sfx('cheer'); return; }
    // brought back down on the side it rose: the Sun drops back where it came from
    if (s.rose && u.x < 180 - 50 && u.y > TR_H - 22) { s.backT = g.t; SK.dragEnd(g); g.fail(); g.sfx('wrong'); g.sfx('laugh'); }
  },
  draw(g, c) {
    const s = g.s, L = s.L, u = s.sun, t = g.t, alt = (TR_H - 30 - u.y) / 240;
    const sk = trSky(alt), gr = c.createLinearGradient(0, 0, 0, TR_H); gr.addColorStop(0, sk[0]); gr.addColorStop(0.6, sk[1]); gr.addColorStop(1, sk[2]); c.fillStyle = gr; c.fillRect(0, 0, 360, 640);
    if (alt < 0.3) P.stars(c, 360, 380, 40, 7, t); // a few stars before dawn and after dusk
    if (alt < 0) { c.fillStyle = `rgba(14,14,40,${Math.min(0.55, -alt * 2)})`; c.fillRect(0, 0, 360, 640); }
    // drifting clouds
    for (let i = 0; i < 3; i++) P.cloud(c, ((i * 140 + t * 8) % 520) - 80, 200 + i * 52, 0.55 - i * 0.08, '#fff6ea', P.mix('#e7c9d6', sk[1], 0.4), 0.5 + SK.clamp(alt, 0, 0.5));
    // the trace: a warm dotted line where the finger took the Sun
    if (s.trail.length > 1) { c.save(); c.strokeStyle = 'rgba(255,226,140,0.75)'; c.lineWidth = 4; c.setLineDash([3, 9]); c.lineCap = 'round'; c.beginPath(); s.trail.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore(); }
    // the Sun with soft rays
    c.save(); c.globalCompositeOperation = 'lighter'; const sg = c.createRadialGradient(u.x, u.y, 4, u.x, u.y, 90); sg.addColorStop(0, 'rgba(255,230,150,0.55)'); sg.addColorStop(1, 'rgba(255,200,120,0)'); c.fillStyle = sg; c.beginPath(); c.arc(u.x, u.y, 90, 0, 7); c.fill(); c.restore();
    c.save(); c.translate(u.x, u.y); c.rotate(t * 0.4); c.strokeStyle = '#ffd25a'; c.lineWidth = 4; c.lineCap = 'round'; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5, r0 = TR_R + 6, r1 = TR_R + 14 + 3 * Math.sin(t * 4 + i); c.beginPath(); c.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); c.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); c.stroke(); } c.restore();
    SK.ball(c, u.x, u.y, TR_R, alt < 0.2 ? '#ffaa4a' : '#ffcc3a', { edge: '#c8641a' });
    if (!g.done && !SK.dragging(g)) SK.glow(c, g, u.x, u.y, 34);
    // the farm in front
    c.drawImage(g.bake('trace_fg' + (L.winter ? 'w' : 's'), o => trGround(o, L)), 0, 0, 360, 640);
    const dim = SK.clamp(0.45 - alt * 1.6, 0, 0.6); if (dim > 0) { const dg = c.createLinearGradient(0, 440, 0, 520); dg.addColorStop(0, 'rgba(20,16,50,0)'); dg.addColorStop(1, `rgba(20,16,50,${dim})`); c.fillStyle = dg; c.fillRect(0, 440, 360, 200); }
    if (L.winter) { c.save(); c.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 40; i++) { const x = (i * 53 + t * (14 + i % 5 * 4)) % 380 - 10, y = (i * 97 + t * (40 + i % 7 * 6)) % 640; c.beginPath(); c.arc(x, y, 1.5 + (i % 3), 0, 7); c.fill(); } c.restore(); }
    const won = g.result === 'win', lost = g.result === 'fail';
    // the rooster on the fence crows at sunrise
    const crowing = s.crow && t - s.crow < 1.2;
    SK.animal(c, 'bird', 74, 498, 0.62, { t, tint: '#e8563a', pose: crowing ? 'cheer' : 'idle', expr: crowing ? 'laugh' : lost ? 'wow' : 'happy' });
    // the beaver's picnic: lunch when the Sun is high
    c.fillStyle = '#e85a6a'; c.beginPath(); c.ellipse(150, 590, 56, 15, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 3; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(150 + i * 20 - 6, 577); c.lineTo(150 + i * 20 + 6, 603); c.stroke(); }
    const eating = s.lunch && t - s.lunch < 1.6;
    SK.animal(c, 'beaver', 140, 594, 0.75, { t, pose: won ? 'cheer' : eating ? 'carry' : lost ? 'sad' : 'idle', expr: eating ? 'laugh' : lost ? 'wow' : 'happy', hold: eating ? o => { o.fillStyle = '#f4d28a'; o.fillRect(-9, -6, 18, 12); o.fillStyle = '#7ac456'; o.fillRect(-9, -1, 18, 3); } : null });
    // the owl in the tree: asleep all day, wide awake at sunset (and baffled if the Sun goes back where it rose)
    const awake = won || lost, ox = 334, oy = L.winter ? 432 : 450;
    SK.animal(c, 'owl', ox, oy, 0.6, { t, facing: -1, noShadow: true, pose: won ? 'cheer' : 'idle', expr: lost ? 'wow' : won ? 'happy' : 'laugh' });
    if (!awake) { c.save(); c.strokeStyle = '#fff6ea'; c.lineWidth = 2.5; c.lineJoin = 'round'; for (let i = 0; i < 3; i++) { const q = (t * 0.6 + i / 3) % 1, x = ox - 26 - q * 16, y = oy - 46 - q * 34, z = 5 + q * 5; c.globalAlpha = 1 - q; c.beginPath(); c.moveTo(x - z, y - z); c.lineTo(x + z, y - z); c.lineTo(x - z, y + z); c.lineTo(x + z, y + z); c.stroke(); } c.restore(); }
    // guidance: a ghost hand sweeps the Sun over the top of the sky
    SK.demo(g, c, 'drag', [L.rise, TR_H - 30], [L.set, TR_H - 20], { arc: L.winter ? 130 : 250, period: 2.4 });
  },
  // the bot drags the Sun along a real arc from its rising point, over the middle, down to its setting point
  auto(g, dt, synth) {
    const s = g.s, L = s.L, B = s._bot = s._bot || {}, t0 = 1.0, dur = 1.3; if (g.done || g.t < t0 || B.done) return;
    const arc = k => [SK.lerp(L.rise, L.set, k), TR_H - 30 + 10 * k - Math.sin(k * Math.PI) * (L.winter ? 130 : 230)];
    if (!B.on) { B.on = 1; synth('down', s.sun.x, s.sun.y); return; }
    const k = SK.clamp((g.t - t0) / dur, 0, 1), [x, y] = arc(k); synth('move', x, y); if (k >= 1) { B.done = 1; synth('up', x, y); }
  },
});
