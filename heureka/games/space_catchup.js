// CATCH UP! (space EE AS-01) — a capsule orbits the Earth behind a space station. Swipe to fire the thruster: each swipe is
// one short burn in that direction. Brake (swipe against the motion) and the capsule drops into a lower orbit, which is
// faster: it races round the inside track and rises back up just behind the station; boost forward there to dock. Boost forward instead
// and it climbs into a higher, slower orbit and falls even further behind.
// The orbits are real: gravity pulls toward the Earth's centre with strength GM / r².
// Level 2: the station is further ahead, so the capsule must brake twice and dip lower.
const CU_C = [180, 384], CU_R = 120, CU_T = 3.0, CU_EARTH = 50;
const CU_VC = 2 * Math.PI * CU_R / CU_T, CU_GM = CU_VC * CU_VC * CU_R, CU_DV = CU_VC / 15;
// how far ahead the station starts (radians) so that one (or two) brakes bring the capsule up exactly beside it
function cuLead(burns) { const v = CU_VC - burns * CU_DV, a = 1 / (2 / CU_R - v * v / CU_GM); return 2 * Math.PI * (1 - Math.pow(a / CU_R, 1.5)); }
function cuStep(b, dt) { // semi-implicit Euler with gravity toward the centre: keeps orbits closed
  const dx = b.x - CU_C[0], dy = b.y - CU_C[1], r2 = dx * dx + dy * dy, r = Math.sqrt(r2), a = CU_GM / r2;
  b.vx -= a * dx / r * dt; b.vy -= a * dy / r * dt; b.x += b.vx * dt; b.y += b.vy * dt;
}
function cuPeriod(b) { const r = Math.hypot(b.x - CU_C[0], b.y - CU_C[1]), v2 = b.vx * b.vx + b.vy * b.vy, inv = 2 / r - v2 / CU_GM; if (inv <= 0) return 99; const a = 1 / inv; return 2 * Math.PI * Math.sqrt(a * a * a / CU_GM); }
function cuPaint(o) {
  B5.vgrad(o, 0, 0, 360, 640, ['#06081e', '#121a44', '#2a2458', '#0c0e2a']);
  P.stars(o, 360, 640, 160, 21, 0);
  const r = P.rng(5); for (let i = 0; i < 3; i++) { const x = r() * 360, y = 140 + r() * 460, gr = o.createRadialGradient(x, y, 2, x, y, 120); gr.addColorStop(0, 'rgba(160,110,220,0.18)'); gr.addColorStop(1, 'rgba(160,110,220,0)'); o.fillStyle = gr; o.fillRect(x - 120, y - 120, 240, 240); }
}
function cuEarth(c, t) {
  const [x, y] = CU_C, R = CU_EARTH;
  const halo = c.createRadialGradient(x, y, R * 0.9, x, y, R * 1.35); halo.addColorStop(0, 'rgba(120,190,255,0.5)'); halo.addColorStop(1, 'rgba(120,190,255,0)'); c.fillStyle = halo; c.beginPath(); c.arc(x, y, R * 1.35, 0, 7); c.fill();
  c.save(); c.beginPath(); c.arc(x, y, R, 0, 7); c.clip();
  const sea = c.createRadialGradient(x - R * 0.4, y - R * 0.4, 4, x, y, R); sea.addColorStop(0, '#5ab8f0'); sea.addColorStop(1, '#1e5aa8'); c.fillStyle = sea; c.fillRect(x - R, y - R, R * 2, R * 2);
  c.fillStyle = '#5aa84a'; const off = (t * 10) % 200;
  for (const [lx, ly, rx, ry] of [[-30, -18, 20, 14], [10, 10, 26, 16], [60, -26, 18, 12], [-80, 20, 24, 12], [120, 6, 22, 18], [-130, -10, 20, 14]]) { const px = ((lx + off + 300) % 200) - 100; c.beginPath(); c.ellipse(x + px, y + ly, rx, ry, 0.4, 0, 7); c.fill(); }
  c.fillStyle = 'rgba(255,255,255,0.75)'; for (const [lx, ly] of [[-20, -34], [30, 26], [-50, 8], [70, -6]]) { const px = ((lx + off * 1.4 + 300) % 200) - 100; c.beginPath(); c.ellipse(x + px, y + ly, 16, 4, 0, 0, 7); c.fill(); }
  const night = c.createLinearGradient(x - R, y - R, x + R, y + R); night.addColorStop(0.45, 'rgba(8,10,40,0)'); night.addColorStop(1, 'rgba(8,10,40,0.6)'); c.fillStyle = night; c.fillRect(x - R, y - R, R * 2, R * 2);
  c.restore();
}
function cuStation(c, x, y, a, t) {
  c.save(); c.translate(x, y); c.rotate(a); c.scale(1.45, 1.45);
  c.fillStyle = '#3a4a8a'; c.strokeStyle = '#c8d0f0'; c.lineWidth = 1.2;
  for (const s of [-1, 1]) { c.fillRect(-7, s * 10 - (s < 0 ? 18 : 0), 14, 18); c.strokeRect(-7, s * 10 - (s < 0 ? 18 : 0), 14, 18); c.beginPath(); c.moveTo(0, s * 10); c.lineTo(0, s * 28); c.stroke(); }
  c.fillStyle = '#e8e4f0'; c.strokeStyle = '#4a4a6a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-16, -7, 32, 14, 5); c.fill(); c.stroke();
  c.fillStyle = '#ffd45a'; c.beginPath(); c.arc(-8, 0, 2.2, 0, 7); c.arc(0, 0, 2.2, 0, 7); c.arc(8, 0, 2.2, 0, 7); c.fill();
  if (Math.sin(t * 6) > 0) { c.fillStyle = '#ff5a5a'; c.beginPath(); c.arc(17, 0, 2.5, 0, 7); c.fill(); }
  c.restore();
}
function cuCapsule(c, x, y, a, flame, t) { // a: heading (radians), flame: >0 exhaust out the back, <0 out the front
  c.save(); c.translate(x, y); c.rotate(a); c.scale(1.45, 1.45);
  if (flame) { const d = flame > 0 ? -1 : 1, L = 16 + 6 * Math.sin(t * 40); c.fillStyle = '#ffb040'; c.beginPath(); c.moveTo(d * 10, -5); c.lineTo(d * (10 + L), 0); c.lineTo(d * 10, 5); c.fill(); c.fillStyle = '#fff2a0'; c.beginPath(); c.moveTo(d * 10, -2.5); c.lineTo(d * (10 + L * 0.55), 0); c.lineTo(d * 10, 2.5); c.fill(); }
  c.fillStyle = '#f4f0f8'; c.strokeStyle = '#3a2a4a'; c.lineWidth = 2; c.beginPath(); c.moveTo(13, 0); c.lineTo(-8, -10); c.lineTo(-11, -10); c.lineTo(-11, 10); c.lineTo(-8, 10); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#8ad0ff'; c.beginPath(); c.arc(-1, 0, 4, 0, 7); c.fill(); c.stroke();
  c.fillStyle = '#e8563a'; c.fillRect(-11, -10, 3, 20);
  c.restore();
}
MG.add({
  id: 'catchup', stage: 'space', cmd: 'CATCH UP!', time: 6, mood: 'night', winText: 'Lower, faster!', failText: 'Left behind!',
  card: { title: 'Slow down to catch up', kind: 'Astronomy', ref: 'Orbital mechanics (phasing)',
    text: 'In orbit, a lower path is a faster lap. Closer to the Earth, gravity pulls harder, so a spacecraft must move faster to keep falling around it, and the circle it travels is shorter.\n\nSo to catch a space station ahead of you, you brake. The capsule drops into a lower orbit, gains on the station every lap, then boosts back up beside it. Push forward instead and you rise into a higher, slower orbit and fall further behind.\n\nReal crews plan their trips to the space station this way.',
    note: 'A lower orbit is faster, so to catch something ahead of you in orbit, you brake and drop lower.' },
  init(g) {
    const s = g.s, burns = g.level >= 2 ? 2 : 1, lead = cuLead(burns) - 0.16; s.burns = burns; // arrives just behind the station
    const th = -Math.PI / 2; s.st = { th }; // the station: a circular orbit, moving anticlockwise on screen
    const tc = th + lead; s.cap = { x: CU_C[0] + CU_R * Math.cos(tc), y: CU_C[1] + CU_R * Math.sin(tc), vx: CU_VC * Math.sin(tc), vy: -CU_VC * Math.cos(tc) };
    s.fired = 0; s.brakes = 0; s.boosts = 0; s.lastBurn = 0; s.flame = 0; s.flameT = -9; s.dock = 0; s.crash = 0; s.sw = null;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); s.sw = [x, y]; },
  up(g, x, y) {
    const s = g.s, a = s.sw; s.sw = null; if (!a || g.done) return; const dx = x - a[0], dy = y - a[1], L = Math.hypot(dx, dy); if (L < 24) return;
    const b = s.cap, v = Math.hypot(b.vx, b.vy), along = (dx * b.vx + dy * b.vy) / (L * v); if (Math.abs(along) < 0.35) return; // a sideways swipe does nothing
    const d = Math.sign(along); b.vx += d * CU_DV * b.vx / v; b.vy += d * CU_DV * b.vy / v; // one short burn along (or against) the motion
    s.fired++; if (d < 0) s.brakes++; else s.boosts++; s.lastBurn = g.t; s.flame = d; s.flameT = g.t; g.sfx('whoosh'); g.sfx(d < 0 ? 'shrink' : 'grow');
  },
  update(g, dt) {
    const s = g.s, b = s.cap;
    if (s.dock) { const sx = CU_C[0] + CU_R * Math.cos(s.st.th), sy = CU_C[1] + CU_R * Math.sin(s.st.th); s.st.th -= 2 * Math.PI / CU_T * dt; b.x = SK.lerp(b.x, sx + 22 * Math.sin(s.st.th), 0.2); b.y = SK.lerp(b.y, sy - 22 * Math.cos(s.st.th), 0.2); return; }
    if (s.crash) return;
    for (let i = 0; i < 8; i++) cuStep(b, dt / 8);
    s.st.th -= 2 * Math.PI / CU_T * dt;
    if (g.done) return;
    const sx = CU_C[0] + CU_R * Math.cos(s.st.th), sy = CU_C[1] + CU_R * Math.sin(s.st.th), r = Math.hypot(b.x - CU_C[0], b.y - CU_C[1]);
    if (s.brakes === s.burns && s.boosts === s.burns && SK.dist(b.x, b.y, sx, sy) < 40) { s.dock = g.t; g.win(); g.sfx('click'); g.sfx('chime'); g.sfx('cheer'); g.burst(sx, sy, ['#fff6c0', '#8ad0ff', '#ffd45a'], 20, 160); return; }
    if (r < CU_EARTH + 6) { s.crash = g.t; g.fail(); g.sfx('fire'); g.burst(b.x, b.y, ['#ff8a40', '#ffd45a', '#fff'], 22, 200); return; }
    // a whole lap since the last burn without meeting the station: it is not going to happen
    if (s.fired && g.t - s.lastBurn > cuPeriod(b) * 1.12) { g.fail(); g.sfx('wrong'); g.sfx('laugh'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, b = s.cap;
    c.drawImage(g.bake('catchup_bg', cuPaint), 0, 0, 360, 640);
    // the station's orbit, faint
    c.save(); c.strokeStyle = 'rgba(200,210,255,0.28)'; c.lineWidth = 2; c.setLineDash([4, 8]); c.beginPath(); c.arc(CU_C[0], CU_C[1], CU_R, 0, 7); c.stroke(); c.restore();
    cuEarth(c, t);
    // the capsule's own path for the next lap (worked out from the same gravity), drawn after a burn
    if (s.fired && !s.dock && !s.crash) { const q = { x: b.x, y: b.y, vx: b.vx, vy: b.vy }, T = Math.min(5, cuPeriod(b)), n = 90; c.save(); c.strokeStyle = 'rgba(140,230,200,0.6)'; c.lineWidth = 2.5; c.setLineDash([3, 6]); c.beginPath(); c.moveTo(q.x, q.y);
      for (let i = 0; i < n; i++) { for (let k = 0; k < 4; k++) cuStep(q, T / n / 4); c.lineTo(q.x, q.y); if (Math.hypot(q.x - CU_C[0], q.y - CU_C[1]) < CU_EARTH) break; } c.stroke(); c.restore(); }
    const sx = CU_C[0] + CU_R * Math.cos(s.st.th), sy = CU_C[1] + CU_R * Math.sin(s.st.th);
    cuStation(c, sx, sy, s.st.th, t);
    if (!g.done) SK.glow(c, g, sx, sy, 34, '#9ad8ff', { level: 2 });
    if (!s.crash) cuCapsule(c, b.x, b.y, Math.atan2(b.vy, b.vx), t - s.flameT < 0.45 ? s.flame : s.dock && t - s.dock < 0.5 ? 1 : 0, t);
    // the rabbit at mission control
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'rabbit', 52, 600, 0.7, { t, pose: won ? 'cheer' : lost ? 'sad' : 'point', expr: won ? 'laugh' : lost ? 'wow' : 'think' });
    c.save(); c.strokeStyle = 'rgba(200,230,255,0.8)'; c.lineWidth = 2.5; c.fillStyle = 'rgba(180,220,255,0.16)'; c.beginPath(); c.arc(56, 560, 30, 0, 7); c.fill(); c.stroke(); c.restore();
    // guidance: swipe backward, against the capsule's motion
    const v = Math.hypot(b.vx, b.vy), nearTop = s.brakes === s.burns && s.boosts < s.burns && t - s.lastBurn > 0.7 && Math.hypot(b.x - CU_C[0], b.y - CU_C[1]) > CU_R - 26;
    // back up beside the station: the hand shows the boost forward (level 0), and the capsule glows (levels 0 and 1)
    if (!g.done && nearTop) { SK.glow(c, g, b.x, b.y, 26, '#a8ffb8', { level: 2 });
    }
    // guidance: brake (swipe back against the motion) until braked enough; then, back up by the station, boost forward
    const dir = s.brakes < s.burns ? -1 : 1; SK.demo(g, c, 'swipe', [b.x, b.y], [b.x + dir * b.vx / v * 70, b.y + dir * b.vy / v * 70], { period: 1.2, never: dir > 0 && !nearTop });
  },
  // the bot brakes with quick swipes against the motion (twice at level 2), then boosts forward once back up by the station
  auto(g, dt, synth) {
    const s = g.s, b = s.cap, B = s._bot = s._bot || {}, v = Math.hypot(b.vx, b.vy), r = Math.hypot(b.x - CU_C[0], b.y - CU_C[1]); if (g.done) return;
    const swipe = d => { synth('down', b.x, b.y); synth('up', b.x + d * b.vx / v * 60, b.y + d * b.vy / v * 60); };
    if (s.brakes < s.burns && g.t >= 1.0 + s.brakes * 0.06 && (!B.last || g.t - B.last > 0.05)) { B.last = g.t; swipe(-1); return; }
    if (s.brakes === s.burns && s.boosts < s.burns && g.t - s.lastBurn > 0.5 && r > CU_R - 3 && (!B.last || g.t - B.last > 0.05)) { B.last = g.t; swipe(1); }
  },
});
