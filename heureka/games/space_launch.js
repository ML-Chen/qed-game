// LAUNCH! (space EE MSE-22) — Newton's cannon on a mountain on a small round planet. Pull the plunger back and let go:
// the further you pull, the faster the ball flies sideways. Too slow and it falls back down (into the lake); too fast and
// it escapes into space; just right and it keeps falling all the way round without ever hitting the ground: an orbit.
// Put two balls into orbit (three at level 2, where the "just right" band is narrower). Real gravity, GM / r².
const LA_C = [180, 392], LA_R = 100, LA_TOP = 136, LA_T = 2.6;
const LA_VC = 2 * Math.PI * LA_TOP / LA_T, LA_GM = LA_VC * LA_VC * LA_TOP, LA_PULL = 110; // a pull of LA_PULL px gives the circular speed
const LA_LV = [{ need: 2, rp: LA_R + 6, ra: 226 }, { need: 2, rp: LA_R + 8, ra: 212 }, { need: 3, rp: LA_R + 16, ra: 170 }];
const LA_MUZ = [LA_C[0] + 16, LA_C[1] - LA_TOP];
function laStep(b, dt) { const dx = b.x - LA_C[0], dy = b.y - LA_C[1], r2 = dx * dx + dy * dy, r = Math.sqrt(r2), a = LA_GM / r2; b.vx -= a * dx / r * dt; b.vy -= a * dy / r * dt; b.x += b.vx * dt; b.y += b.vy * dt; }
function laPaint(o) {
  B5.vgrad(o, 0, 0, 360, 640, ['#120c34', '#2a1e5a', '#3a2a6a', '#1a1440']);
  P.stars(o, 360, 640, 140, 9, 0);
  const [x, y] = LA_C, R = LA_R;
  const halo = o.createRadialGradient(x, y, R * 0.95, x, y, R * 1.25); halo.addColorStop(0, 'rgba(140,220,255,0.45)'); halo.addColorStop(1, 'rgba(140,220,255,0)'); o.fillStyle = halo; o.beginPath(); o.arc(x, y, R * 1.25, 0, 7); o.fill();
  o.save(); o.beginPath(); o.arc(x, y, R, 0, 7); o.clip();
  const gr = o.createRadialGradient(x - 30, y - 30, 8, x, y, R); gr.addColorStop(0, '#9ad870'); gr.addColorStop(1, '#3a7a3e'); o.fillStyle = gr; o.fillRect(x - R, y - R, 2 * R, 2 * R);
  // the lake on the right, where slow balls land
  o.fillStyle = '#3aa0d8'; o.beginPath(); o.ellipse(x + 80, y - 38, 46, 38, 0.5, 0, 7); o.fill(); o.fillStyle = 'rgba(255,255,255,0.4)'; o.beginPath(); o.ellipse(x + 70, y - 50, 16, 5, 0.5, 0, 7); o.fill();
  o.fillStyle = '#d8c070'; o.beginPath(); o.ellipse(x - 40, y + 40, 30, 20, -0.3, 0, 7); o.fill();
  for (let i = 0; i < 9; i++) { const a = i * 0.7 + 2, rr = 30 + (i % 3) * 18; o.fillStyle = '#2e6a36'; o.beginPath(); o.arc(x + Math.cos(a) * rr, y + Math.sin(a) * rr, 6, 0, 7); o.fill(); }
  const sh = o.createLinearGradient(x - R, y - R, x + R, y + R); sh.addColorStop(0.5, 'rgba(10,10,40,0)'); sh.addColorStop(1, 'rgba(10,10,40,0.5)'); o.fillStyle = sh; o.fillRect(x - R, y - R, 2 * R, 2 * R);
  o.restore();
  // the mountain on top
  o.fillStyle = '#8a7a8a'; o.strokeStyle = '#3a2a4a'; o.lineWidth = 2; o.beginPath(); o.moveTo(x - 46, y - R + 12); o.lineTo(x - 8, y - LA_TOP + 6); o.lineTo(x + 8, y - LA_TOP + 6); o.lineTo(x + 46, y - R + 12); o.closePath(); o.fill(); o.stroke();
  o.fillStyle = '#f4f0f8'; o.beginPath(); o.moveTo(x - 17, y - LA_TOP + 20); o.lineTo(x - 8, y - LA_TOP + 6); o.lineTo(x + 8, y - LA_TOP + 6); o.lineTo(x + 17, y - LA_TOP + 20); o.lineTo(x + 6, y - LA_TOP + 16); o.lineTo(x, y - LA_TOP + 22); o.lineTo(x - 6, y - LA_TOP + 16); o.closePath(); o.fill();
}
MG.add({
  id: 'launch', stage: 'space', cmd: 'LAUNCH!', time: 6, mood: 'night', winText: 'Orbit!', failText: 'Fell down!',
  card: { title: 'An orbit is falling around', kind: 'Astronomy', ref: "Newton's cannon",
    text: 'Everything thrown sideways falls toward the ground. Throw it faster and it lands further away.\n\nOn a round planet, the ground curves away beneath a fast ball. Throw it fast enough and the ground curves away as fast as the ball falls, so it falls all the way round and never lands. That is an orbit.\n\nToo slow and it falls back down. Much too fast and it escapes into space. The Moon and every satellite are falling around the Earth like this, all the time.',
    note: 'An orbit is falling all the way round a planet without ever hitting the ground.' },
  init(g) { const s = g.s; s.L = LA_LV[Math.min(2, g.level)]; s.balls = []; s.pull = 0; s.grab = null; s.reload = 0; s.good = 0; s.fx = []; },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || g.t < s.reload) return; if (SK.dist(x, y, LA_MUZ[0] - 20, LA_MUZ[1]) < 70) s.grab = { x0: x }; },
  move(g, x, y) { const s = g.s; if (!s.grab || g.done) return; s.pull = SK.clamp(s.grab.x0 - x, 0, 170); },
  up(g) {
    const s = g.s; if (!s.grab) return; s.grab = null; const d = s.pull; s.pull = 0; if (d < 18 || g.done) return;
    const v = LA_VC * d / LA_PULL; s.balls.push({ x: LA_MUZ[0] + 6, y: LA_MUZ[1], vx: v, vy: 0, st: 'fly', a0: 0, tr: [], t0: g.t }); s.reload = g.t + 0.35;
    g.sfx('thud'); g.sfx('whoosh'); g.shake(3, 0.15); g.burst(LA_MUZ[0] + 14, LA_MUZ[1], ['#fff6c0', '#ffb040', '#c8c0c8'], 10, 120);
  },
  update(g, dt) {
    const s = g.s, L = s.L;
    for (const b of s.balls) {
      if (b.st === 'land' || b.st === 'gone') continue;
      for (let i = 0; i < 8; i++) {
        const px = b.x - LA_C[0]; laStep(b, dt / 8);
        const r = Math.hypot(b.x - LA_C[0], b.y - LA_C[1]), ang = Math.atan2(b.y - LA_C[1], b.x - LA_C[0]) + Math.PI / 2; // 0 at the top, growing clockwise
        if (r < L.rp) { b.st = 'land'; const wet = ang > 0.25 && ang < 1.9; b.wet = wet; s.fx.push({ x: b.x, y: b.y, t: g.t, wet }); g.sfx(wet ? 'splash' : 'thud'); g.sfx('laugh'); if (!wet) g.burst(b.x, b.y, ['#c8a878', '#8a7a6a'], 10, 100); else g.burst(b.x, b.y, ['#bfe8ff', '#ffffff'], 14, 140); break; }
        if (r > L.ra) { b.st = 'gone'; s.fx.push({ x: b.x, y: b.y, t: g.t, gone: true }); g.sfx('magic'); g.sfx('wrong'); break; }
        // past the far side and still up: it is in orbit for good
        if (b.st === 'fly' && px > 0 && b.x - LA_C[0] <= 0 && b.y > LA_C[1]) { b.st = 'orbit'; s.good++; g.sfx('chime'); g.burst(b.x, b.y, ['#ffd45a', '#fff6c0', '#8ad0ff'], 14, 120); if (s.good >= L.need && !g.done) { g.win(); g.sfx('cheer'); } }
      }
      if (b.st !== 'land' && b.st !== 'gone') { b.tr.push([b.x, b.y]); if (b.tr.length > 26) b.tr.shift(); }
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, L = s.L;
    c.drawImage(g.bake('launch_bg', laPaint), 0, 0, 360, 640);
    // balls already in orbit leave a faint ring of their path
    for (const b of s.balls) { if (b.tr.length < 2) continue; c.save(); c.strokeStyle = b.st === 'orbit' ? 'rgba(255,214,90,0.55)' : 'rgba(255,255,255,0.35)'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); b.tr.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore(); }
    for (const f of s.fx) { const k = SK.clamp((t - f.t) / 0.8, 0, 1); if (k >= 1) continue; c.save(); c.globalAlpha = 1 - k;
      if (f.gone) { B5.star(c, f.x, f.y, 6 + 10 * k, '#fff6c0'); } else { c.strokeStyle = f.wet ? '#bfe8ff' : '#c8a878'; c.lineWidth = 3; c.beginPath(); c.arc(f.x, f.y, 6 + 18 * k, 0, 7); c.stroke(); } c.restore(); }
    for (const b of s.balls) { if (b.st === 'gone') continue; if (b.st === 'land' && b.wet) continue; SK.ball(c, b.x, b.y, 9, b.st === 'orbit' ? '#ffcc3a' : '#4a4a5a'); }
    // the cannon on the peak, with its plunger pulled back
    const [mx, my] = LA_MUZ, d = s.pull;
    c.save(); c.translate(mx - 18, my); c.scale(1.25, 1.25); c.fillStyle = '#5a4a3a'; c.fillRect(-10, 6, 30, 8);
    c.strokeStyle = '#c8c0c8'; c.lineWidth = 3; c.beginPath(); for (let i = 0; i <= 12; i++) c.lineTo(-14 - d * i / 12, (i % 2 ? -6 : 6)); c.stroke(); // the spring
    c.fillStyle = '#e84a3a'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.roundRect(-20 - d, -9, 10, 18, 3); c.fill(); c.stroke();
    const bg = c.createLinearGradient(0, -10, 0, 10); bg.addColorStop(0, '#8a8aa0'); bg.addColorStop(1, '#4a4a60'); c.fillStyle = bg; c.beginPath(); c.roundRect(-14, -10, 44, 20, 6); c.fill(); c.stroke();
    c.fillStyle = '#2a2a3a'; c.beginPath(); c.ellipse(30, 0, 4, 9, 0, 0, 7); c.fill(); c.restore();
    if (!g.done && !s.grab) SK.glow(c, g, mx - 24, my, 30);
    // the rabbit on the mountain ducks as balls whizz round, cheers when they stay up
    const whizz = s.balls.some(b => b.st === 'orbit' && SK.dist(b.x, b.y, mx, my) < 60);
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'rabbit', LA_C[0] - 34, LA_C[1] - LA_TOP + 14, 0.52, { t, pose: won ? 'cheer' : whizz ? 'sad' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : whizz ? 'wow' : lost ? 'wow' : 'happy' });
    // how many must orbit: little gold rings under the command, filled as balls make it
    for (let i = 0; i < L.need; i++) { const x = 180 + (i - (L.need - 1) / 2) * 30; c.strokeStyle = '#ffd45a'; c.lineWidth = 3; c.beginPath(); c.arc(x, 150, 9, 0, 7); c.stroke(); if (i < s.good) SK.ball(c, x, 150, 7, '#ffcc3a'); }
    SK.demo(g, c, 'drag', [mx - 24, my], [mx - 24 - LA_PULL, my]);
  },
  auto(g, dt, synth) { const s = g.s, B = s._bot = s._bot || {}; if (g.done) return; const n = B.n || 0; if (n >= s.L.need) return;
    B['t' + n] = B['t' + n] || Math.max(0.9 + n * 0.5, s.reload + 0.05, g.t); if (SK.bot.drag(g, synth, 'f' + n, B['t' + n], [LA_MUZ[0] - 24, LA_MUZ[1]], [LA_MUZ[0] - 24 - LA_PULL, LA_MUZ[1]], 0.25)) B.n = n + 1; },
});
