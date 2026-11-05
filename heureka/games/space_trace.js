// TRACE! (space EE EL-05) — a farm at dawn, the Sun peeking over the left hills. Drag the Sun across the sky: up, over the
// top at noon, and down on the far side. The day plays along with the trace (rooster at sunrise, lunch at noon, the owl
// wakes at sunset). Drag it straight up and back down and it sets where it rose: the sky goes dark and the owl is baffled.
// Then the full Moon rises in the east: trace it the same way. Level 2: winter (the Sun's path is lower and shorter),
// and a second day follows the night.
const TR_H = 452, TR_R = 24;
const TR_L = [
  { rise: 46, set: 314, peak: 250, cap: 0, winter: false },
  { rise: 46, set: 314, peak: 250, cap: 0, winter: false },
  { rise: 100, set: 262, peak: 350, cap: 318, winter: true },
];
const TR_N = 24; // dots along the path
function trArc(L, k) { return [SK.lerp(L.rise, L.set, k), TR_H - 30 + 10 * k - Math.sin(k * Math.PI) * L.h]; }
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
  // low bushes on the western hill, leaving the hilltop clear for the sunset
  for (const [x, y, k] of [[352, 470, 0.9], [20, 476, 0.7]]) B5.bush(o, x, y, k, 1, w ? '#8aa0a8' : '#4f8a44');
  P.grain(o, 360, 640, 0.035);
}
// a small Earth seen from above the North Pole, lit from the right by a little Sun; the farm (red dot) turns with it,
// anticlockwise, from the dawn edge into daylight and round to the dusk edge: the spin that makes the Sun cross the sky
function trGlobe(c, x, y, r, th, t) {
  c.save(); c.fillStyle = 'rgba(20,16,50,0.45)'; c.beginPath(); c.roundRect(x - r - 12, y - r - 12, r * 2 + 64, r * 2 + 24, 14); c.fill();
  const sx = x + r + 34; c.fillStyle = '#ffd45a'; c.beginPath(); c.arc(sx, y, 9, 0, 7); c.fill(); c.strokeStyle = '#ffd45a'; c.lineWidth = 2; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.beginPath(); c.moveTo(sx + Math.cos(a) * 12, y + Math.sin(a) * 12); c.lineTo(sx + Math.cos(a) * 16, y + Math.sin(a) * 16); c.stroke(); }
  c.fillStyle = '#2a6ab8'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  c.save(); c.beginPath(); c.arc(x, y, r, 0, 7); c.clip(); c.fillStyle = '#5aa84a';
  for (const [a, d, rr] of [[0, 0.55, 0.32], [1.9, 0.5, 0.28], [3.6, 0.6, 0.25], [5.0, 0.35, 0.2]]) { const aa = th + a; c.beginPath(); c.arc(x + Math.cos(aa) * r * d, y + Math.sin(aa) * r * d, r * rr, 0, 7); c.fill(); }
  c.fillStyle = 'rgba(10,10,40,0.6)'; c.fillRect(x - r, y - r, r, r * 2); c.restore(); // the night half, away from the Sun
  c.fillStyle = '#e8403a'; c.strokeStyle = '#fff6ea'; c.lineWidth = 1.5; c.beginPath(); c.arc(x + Math.cos(th) * r * 0.8, y + Math.sin(th) * r * 0.8, 4.5, 0, 7); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(255,246,234,0.85)'; c.lineWidth = 2.5; c.beginPath(); c.arc(x, y, r + 6, -0.3, -1.6, true); c.stroke(); // spin arrow, anticlockwise
  const ax = x + Math.cos(-1.6) * (r + 6), ay = y + Math.sin(-1.6) * (r + 6); c.beginPath(); c.moveTo(ax - 6, ay - 3); c.lineTo(ax, ay); c.lineTo(ax - 3, ay + 6); c.stroke();
  c.restore();
}
// when the kit's ghost hand would show (SK.demo's rule), or -1: the hand here follows the curved path, which SK.demo can't
function trHandT(g) {
  if (g.done || (g.ptr && g.ptr.down)) return -1; const idle = g.t - (g.lastIn ?? 0); let t0;
  if (!g.s.touched) t0 = 0.9; else if (idle >= 1.4) t0 = (g.lastIn ?? 0) + 1.4; else return -1;
  return g.t >= t0 ? g.t - t0 : -1;
}
function trRounds(c, s, t) { // the goal: a little sun or moon per crossing, lit and ticked once it has set in the west
  const n = s.rounds.length, x0 = 340 - n * 40;
  c.save(); c.fillStyle = 'rgba(20,16,50,0.45)'; c.beginPath(); c.roundRect(x0 - 6, 154, n * 40 + 12, 44, 14); c.fill(); c.restore();
  s.rounds.forEach((r, i) => { const x = x0 + 20 + i * 40, y = 176, done = i < s.ri || (i === s.ri && s.setT), cur = i === s.ri && !s.setT;
    c.save(); c.globalAlpha *= done || cur ? 1 : 0.45;
    if (r === 'sun') { c.fillStyle = '#ffcc3a'; c.strokeStyle = '#ffd25a'; c.lineWidth = 2; for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; c.beginPath(); c.moveTo(x + Math.cos(a) * 11, y + Math.sin(a) * 11); c.lineTo(x + Math.cos(a) * 15, y + Math.sin(a) * 15); c.stroke(); } c.beginPath(); c.arc(x, y, 9, 0, 7); c.fill(); }
    else { c.fillStyle = '#e8ecf4'; c.beginPath(); c.arc(x, y, 11, 0, 7); c.fill(); c.fillStyle = 'rgba(150,156,180,0.6)'; c.beginPath(); c.arc(x - 3, y - 2, 3, 0, 7); c.arc(x + 4, y + 4, 2, 0, 7); c.fill(); }
    if (cur) { c.strokeStyle = '#fff6ea'; c.lineWidth = 2.5; c.setLineDash([4, 4]); c.lineDashOffset = -t * 12; c.beginPath(); c.arc(x, y, 18, 0, 7); c.stroke(); }
    c.restore();
    if (done) { c.save(); c.strokeStyle = '#5ad07a'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + 2, y + 10); c.lineTo(x + 8, y + 16); c.lineTo(x + 18, y + 2); c.stroke(); c.restore(); }
  });
}
MG.add({
  id: 'trace', stage: 'space', cmd: 'MOVE SUN AND MOON EAST TO WEST!', time: 6.5, mood: 'bright', winText: 'Earth spins!', failText: 'Huh?',
  card: { title: "The Sun's path", kind: 'Astronomy', ref: 'Apparent motion of the Sun',
    text: 'Every morning the Sun rises on one side of the sky, the east. It climbs highest around noon and sets on the other side, the west. It never goes straight up and falls back. At night the Moon and the stars cross the sky the same way.\n\nThe Sun is not really moving across the sky. The Earth spins once a day, and as we turn, the Sun, the Moon and the stars seem to sweep across from east to west.\n\nIn winter the path is lower and shorter, so days are short and noon shadows are long.',
    note: 'The Sun rises in the east, is highest at noon and sets in the west, because the Earth spins. So does the Moon.' },
  init(g) {
    // variants: where the Sun rises and sets on the hills, and how high its path climbs
    const s = g.s, B = TR_L[Math.min(2, g.level)], v = SK.variant(g, 4), V = (B.winter ? [[100, 262, 110], [90, 270, 100], [110, 252, 120], [96, 266, 104]] : [[46, 314, 230], [60, 300, 210], [40, 320, 250], [54, 306, 220]])[v];
    const L = { rise: V[0], set: V[1], h: V[2], winter: B.winter, peak: TR_H - 30 - V[2] + 40, cap: B.winter ? TR_H - 30 - V[2] + 4 : 0 }; s.L = L; s.v = v;
    s.rounds = g.level >= 2 ? ['sun', 'moon', 'sun'] : ['sun', 'moon']; s.ri = 0; s.nextT = 0;
    s.sun = { x: L.rise, y: TR_H - 30 }; s.trail = []; s.peak = 999; s.rose = false; s.crow = 0; s.lunch = 0; s.setT = 0; s.backT = 0; s.lit = new Array(TR_N).fill(0);
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.reset) return; if (SK.dist(x, y, s.sun.x, s.sun.y) < 64) SK.dragStart(g, s.sun, x, y); },
  move(g, x, y) { const s = g.s; if (g.done || !SK.dragging(g)) return; SK.dragMove(g, x, y);
    const L = s.L; s.sun.x = SK.clamp(s.sun.x, 14, 346); s.sun.y = SK.clamp(s.sun.y, Math.max(140, L.cap), TR_H + 8); },
  up(g) { const s = g.s; if (!SK.dragging(g)) return; SK.dragEnd(g); if (g.done || s.setT || s.backT) return;
    // let go after leaving the path (dots skipped behind it): the Sun slides back to where it rose, to try again
    const L = s.L, ku = (s.sun.x - L.rise) / (L.set - L.rise); let miss = 0; for (let i = 1; i < TR_N; i++) if (!s.lit[i] && i / TR_N < ku - 0.06) miss++;
    if (miss >= 3) { s.reset = { t: g.t, x: s.sun.x, y: s.sun.y }; g.sfx('swoosh'); } },
  update(g, dt) {
    const s = g.s, L = s.L, u = s.sun;
    if (s.setT) { u.y += 70 * dt; // sinking behind the hills; then the next body rises in the east
      if (!g.done && g.t - s.setT > 0.6) { s.ri++; s.sun = { x: L.rise, y: TR_H - 30 }; s.trail = []; s.peak = 999; s.rose = false; s.setT = 0; s.lunch = 0; s.lit = new Array(TR_N).fill(0); s.crow = s.rounds[s.ri] === 'sun' ? 0 : s.crow; s.nextT = g.t; g.sfx(s.rounds[s.ri] === 'moon' ? 'sparkle' : 'tweet'); }
      return; }
    if (s.backT) { u.y += 50 * dt; return; }
    if (s.reset) { const k = SK.easeInOut((g.t - s.reset.t) / 0.6); u.x = SK.lerp(s.reset.x, L.rise, k); u.y = SK.lerp(s.reset.y, TR_H - 30, k); if (k >= 1) { s.reset = null; s.trail = []; s.peak = 999; s.rose = false; s.lunch = 0; s.lit = new Array(TR_N).fill(0); } return; }
    if (g.done) return;
    const last = s.trail[s.trail.length - 1]; if (!last || SK.dist(last[0], last[1], u.x, u.y) > 6) { s.trail.push([u.x, u.y]); if (s.trail.length > 90) s.trail.shift(); }
    if (u.y < TR_H - 70) s.rose = true;
    const moon = s.rounds[s.ri] === 'moon';
    if (!moon && !s.crow && u.y < TR_H - 30) { s.crow = g.t; g.sfx('tweet'); g.sfx('bell'); }
    if (Math.abs(u.x - 180) < 80) s.peak = Math.min(s.peak, u.y);
    for (let i = 1; i < TR_N; i++) if (!s.lit[i]) { const [x, y] = trArc(L, i / TR_N); if (SK.dist(x, y, u.x, u.y) < 30) { s.lit[i] = 1; if (i % 4 === 0) g.sfx('tap'); } }
    if (!s.lunch && s.peak < L.peak + 10 && Math.abs(u.x - 180) < 60) { s.lunch = g.t; g.sfx(moon ? 'magic' : 'munch'); }
    // set on the far side after passing high over the middle: the day is done
    if (s.peak < L.peak && s.lit.reduce((a, b) => a + b, 0) >= (TR_N - 1) * 0.7 && u.x > L.set - 34 && u.y > TR_H - 40) { s.setT = g.t; SK.dragEnd(g); if (s.ri >= s.rounds.length - 1) { g.win(); g.sfx('cheer'); } g.sfx('chime'); return; }
    // brought back down on the side it rose: the Sun drops back where it came from
    if (s.rose && u.x < 180 - 50 && u.y > TR_H - 22) { s.backT = g.t; SK.dragEnd(g); g.fail(); g.sfx('wrong'); g.sfx('laugh'); }
  },
  draw(g, c) {
    const s = g.s, L = s.L, u = s.sun, t = g.t, moon = s.rounds[s.ri] === 'moon', alt0 = (TR_H - 30 - u.y) / 240, alt = moon ? -0.35 + alt0 * 0.12 : alt0;
    const sk = trSky(alt), gr = c.createLinearGradient(0, 0, 0, TR_H); gr.addColorStop(0, sk[0]); gr.addColorStop(0.6, sk[1]); gr.addColorStop(1, sk[2]); c.fillStyle = gr; c.fillRect(0, 0, 360, 640);
    if (alt < 0.3) P.stars(c, 360, 380, moon ? 90 : 40, 7, t); // a few stars before dawn and after dusk
    if (alt < 0) { c.fillStyle = `rgba(14,14,40,${Math.min(0.55, -alt * 2)})`; c.fillRect(0, 0, 360, 640); }
    // drifting clouds
    for (let i = 0; i < 3; i++) P.cloud(c, ((i * 140 + t * 8) % 520) - 80, 200 + i * 52, 0.55 - i * 0.08, '#fff6ea', P.mix('#e7c9d6', sk[1], 0.4), 0.5 + SK.clamp(alt, 0, 0.5));
    // the path to follow: a faint dotted arc from the eastern hill over the top to the western hill, and a glowing
    // spot on the western hill where the Sun (or Moon) should set
    const arcH = L.h, arcP = k => trArc(L, k);
    if (!g.done && !s.setT) { c.save(); for (let i = 1; i < TR_N; i++) { const [x, y] = arcP(i / TR_N); c.globalAlpha = s.lit[i] ? 1 : 0.6; c.fillStyle = s.lit[i] ? (moon ? '#ffffff' : '#ffd45a') : (moon ? 'rgba(220,230,255,0.7)' : 'rgba(255,240,190,0.8)'); c.beginPath(); c.arc(x, y, s.lit[i] ? 5 : 3, 0, 7); c.fill(); } c.restore();
      // chevrons along the path that flow from east to west: the way to go (a curved SK.arrow)
      c.save(); c.fillStyle = moon ? 'rgba(235,240,255,0.9)' : 'rgba(255,236,170,0.95)'; const fl = (t * 0.35) % (1 / 5);
      for (let q = fl + 0.04; q < 0.96; q += 1 / 5) { const kq = q; if (kq < (u.x - L.rise) / (L.set - L.rise) + 0.04) continue; const [x0, y0] = arcP(kq), [x1, y1] = arcP(kq + 0.01), a = Math.atan2(y1 - y0, x1 - x0); c.save(); c.translate(x0, y0); c.rotate(a); c.beginPath(); c.moveTo(9, 0); c.lineTo(-5, -7); c.lineTo(-1, 0); c.lineTo(-5, 7); c.closePath(); c.fill(); c.restore(); }
      c.restore();
      // dots the Sun went past without touching: hollow orange rings, so the player sees the path wasn't followed
      const ku = (u.x - L.rise) / (L.set - L.rise); c.save(); c.strokeStyle = '#ff8a4a'; c.lineWidth = 2.5; for (let i = 1; i < TR_N; i++) if (!s.lit[i] && i / TR_N < ku - 0.06) { const [x, y] = arcP(i / TR_N); c.beginPath(); c.arc(x, y, 6 + Math.sin(t * 6) * 1.5, 0, 7); c.stroke(); } c.restore();
      const [ex, ey] = arcP(1), p = 0.5 + 0.5 * Math.sin(t * 4); c.save(); c.strokeStyle = moon ? 'rgba(220,230,255,0.85)' : 'rgba(255,200,120,0.9)'; c.lineWidth = 3; c.setLineDash([6, 5]); c.beginPath(); c.arc(ex, ey, TR_R + 6 + p * 4, 0, 7); c.stroke(); c.restore(); }
    // the trace: a warm dotted line where the finger took the Sun
    if (s.trail.length > 1) { c.save(); c.strokeStyle = moon ? 'rgba(220,230,255,0.75)' : 'rgba(255,226,140,0.75)'; c.lineWidth = 4; c.setLineDash([3, 9]); c.lineCap = 'round'; c.beginPath(); s.trail.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore(); }
    if (moon) { // the full Moon, pale with craters
      c.save(); c.globalCompositeOperation = 'lighter'; const mg = c.createRadialGradient(u.x, u.y, 4, u.x, u.y, 70); mg.addColorStop(0, 'rgba(200,215,255,0.4)'); mg.addColorStop(1, 'rgba(200,215,255,0)'); c.fillStyle = mg; c.beginPath(); c.arc(u.x, u.y, 70, 0, 7); c.fill(); c.restore();
      SK.ball(c, u.x, u.y, TR_R - 2, '#e8ecf4', { edge: '#8a90a8' }); c.fillStyle = 'rgba(150,156,180,0.5)'; for (const [dx, dy, r] of [[-7, -4, 5], [6, 6, 4], [5, -9, 3], [-3, 10, 3]]) { c.beginPath(); c.arc(u.x + dx, u.y + dy, r, 0, 7); c.fill(); }
    } else {
    // the Sun with soft rays
    c.save(); c.globalCompositeOperation = 'lighter'; const sg = c.createRadialGradient(u.x, u.y, 4, u.x, u.y, 90); sg.addColorStop(0, 'rgba(255,230,150,0.55)'); sg.addColorStop(1, 'rgba(255,200,120,0)'); c.fillStyle = sg; c.beginPath(); c.arc(u.x, u.y, 90, 0, 7); c.fill(); c.restore();
    c.save(); c.translate(u.x, u.y); c.rotate(t * 0.4); c.strokeStyle = '#ffd25a'; c.lineWidth = 4; c.lineCap = 'round'; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5, r0 = TR_R + 6, r1 = TR_R + 14 + 3 * Math.sin(t * 4 + i); c.beginPath(); c.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); c.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); c.stroke(); } c.restore();
    SK.ball(c, u.x, u.y, TR_R, alt < 0.2 ? '#ffaa4a' : '#ffcc3a', { edge: '#c8641a' });
    }
    if (!s.setT) { SK.target(c, g, ...arcP(1), TR_R + 8); SK.grab(c, g, u.x, u.y, 34); } // what moves (the Sun or Moon) and where it goes (the western hill); the dots are the way
    // the farm in front
    c.drawImage(g.bake('trace_fg' + (L.winter ? 'w' : 's'), o => trGround(o, L)), 0, 0, 360, 640);
    const dim = SK.clamp(0.45 - alt * 1.6, 0, 0.6); if (dim > 0) { const dg = c.createLinearGradient(0, 440, 0, 520); dg.addColorStop(0, 'rgba(20,16,50,0)'); dg.addColorStop(1, `rgba(20,16,50,${dim})`); c.fillStyle = dg; c.fillRect(0, 440, 360, 200); }
    if (L.winter) { c.save(); c.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 40; i++) { const x = (i * 53 + t * (14 + i % 5 * 4)) % 380 - 10, y = (i * 97 + t * (40 + i % 7 * 6)) % 640; c.beginPath(); c.arc(x, y, 1.5 + (i % 3), 0, 7); c.fill(); } c.restore(); }
    const won = g.result === 'win', lost = g.result === 'fail';
    // the rooster on the fence crows at sunrise
    const crowing = s.crow && t - s.crow < 1.2;
    SK.animal(c, 'bird', L.winter ? 40 : 112, 498, 0.62, { t, tint: '#e8563a', pose: crowing ? 'cheer' : 'idle', expr: crowing ? 'laugh' : lost ? 'wow' : 'happy' });
    // the beaver's picnic: lunch when the Sun is high
    c.fillStyle = '#e85a6a'; c.beginPath(); c.ellipse(150, 590, 56, 15, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 3; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(150 + i * 20 - 6, 577); c.lineTo(150 + i * 20 + 6, 603); c.stroke(); }
    const eating = !moon && s.lunch && t - s.lunch < 1.6;
    SK.animal(c, 'beaver', 140, 594, 0.75, { t, pose: won ? 'cheer' : eating ? 'carry' : lost ? 'sad' : 'idle', expr: eating ? 'laugh' : lost ? 'wow' : moon ? 'think' : 'happy', hold: eating ? o => { o.fillStyle = '#f4d28a'; o.fillRect(-9, -6, 18, 12); o.fillStyle = '#7ac456'; o.fillRect(-9, -1, 18, 3); } : null });
    // the owl in the tree: asleep all day, wide awake at sunset (and baffled if the Sun goes back where it rose)
    const awake = won || lost || moon, ox = 196, oy = 408;
    SK.animal(c, 'owl', ox, oy, 0.55, { t, facing: -1, noShadow: true, pose: won || (moon && s.lunch && t - s.lunch < 1.5) ? 'cheer' : 'idle', expr: lost ? 'wow' : won || moon ? 'happy' : 'laugh' });
    if (!awake) { c.save(); c.strokeStyle = '#fff6ea'; c.lineWidth = 2.5; c.lineJoin = 'round'; for (let i = 0; i < 3; i++) { const q = (t * 0.6 + i / 3) % 1, x = ox + 22 + q * 16, y = oy - 40 - q * 30, z = 5 + q * 5; c.globalAlpha = 1 - q; c.beginPath(); c.moveTo(x - z, y - z); c.lineTo(x + z, y - z); c.lineTo(x - z, y + z); c.lineTo(x + z, y + z); c.stroke(); } c.restore(); }
    // guidance: a ghost hand sweeps the Sun over the top of the sky
    // east and west on the hills, and the spinning Earth that makes the day
    SK.tag(c, 'East', Math.max(42, L.rise), 470, 18); SK.tag(c, 'West', Math.min(318, L.set), 470, 18);
    const kk = s.setT ? 1 : SK.clamp((u.x - L.rise) / (L.set - L.rise), 0, 1); c.save(); c.globalAlpha = SK.clamp((t - 2.0) * 3, 0, 1); trGlobe(c, 44, 176, 22, (moon ? -Math.PI / 2 : Math.PI / 2) - kk * Math.PI, t);
    // guidance (every level when idle): a hand drags the current body from where it is along the rest of the arc
    trRounds(c, s, t); c.restore();
    // live direction: dragged under the path in the middle of the sky, a "Higher!" cue above the Sun
    if (!g.done && !s.setT && SK.dragging(g)) { const k = (u.x - L.rise) / (L.set - L.rise); if (k > 0.12 && k < 0.88 && u.y > trArc(L, k)[1] + 40) { const p = 0.5 + 0.5 * Math.sin(t * 8); SK.tag(c, 'Higher!', u.x, u.y - 62 - 4 * p, 20, '#ffe27a'); } }
    // guidance (every level when idle, SK.demo's timing): a hand presses the Sun and carries it along the rest of the curved path
    const ht = s.setT ? -1 : trHandT(g);
    if (ht >= 0) { const per = 2.6, k = (ht % per) / per, k0 = SK.clamp((u.x - L.rise) / (L.set - L.rise), 0, 0.9), fade = SK.clamp(ht * 4, 0, 1);
      const press = k < 0.12 ? k / 0.12 : k < 0.82 ? 1 : 1 - (k - 0.82) / 0.1, m = SK.easeInOut((k - 0.12) / 0.7);
      const [ax, ay] = arcP(k0), [px, py] = m < 0.12 ? [SK.lerp(u.x, ax, m / 0.12), SK.lerp(u.y, ay, m / 0.12)] : arcP(SK.lerp(k0, 1, (m - 0.12) / 0.88));
      SK.hand(c, px, py, SK.clamp(press, 0, 1), 0.9 * fade * (k > 0.9 ? 0 : 1)); }
  },
  // the bot drags the Sun along a real arc from its rising point, over the middle, down to its setting point
  auto(g, dt, synth) {
    const s = g.s, L = s.L, B = s._bot = s._bot || {}, dur = 1.0; if (g.done || s.setT) return; const R = B['r' + s.ri] = B['r' + s.ri] || {};
    const t0 = s.ri ? s.nextT + 0.15 : 1.0; if (g.t < t0 || R.done) return;
    const arc = k => trArc(L, k);
    if (!R.on) { R.on = 1; R.t = g.t; synth('down', s.sun.x, s.sun.y); return; }
    const k = SK.clamp((g.t - R.t) / dur, 0, 1), [x, y] = arc(k); synth('move', x, y); if (k >= 1) { R.done = 1; synth('up', x, y); }
  },
});
