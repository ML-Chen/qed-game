// BRAKE TO CATCH THE STATION! (space EE AS-01) — a capsule orbits the Earth behind a space station. Two thruster buttons:
// Brake (flame out of the nose) and Boost (flame out of the tail); each tap is one short burn. Brake and the capsule drops
// into a lower orbit, which is faster: it races round the inside track (a "Gap" arc along the station's orbit shrinks) and
// rises back up beside the station; tap Boost there to match its speed and dock. Boost first instead and it climbs into
// a higher, slower orbit and falls even further behind.
// The orbits are real: gravity pulls toward the Earth's centre with strength GM / r².
// Level 2: the station is further ahead, so the capsule must brake twice and dip lower.
const CU_C = [180, 362], CU_R = 120, CU_T = 4.5, CU_EARTH = 50;
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
  c.save(); c.translate(x, y); c.rotate(a); c.scale(1.9, 1.9);
  if (flame) { const d = flame > 0 ? -1 : 1, L = 16 + 6 * Math.sin(t * 40); c.fillStyle = '#ffb040'; c.beginPath(); c.moveTo(d * 10, -5); c.lineTo(d * (10 + L), 0); c.lineTo(d * 10, 5); c.fill(); c.fillStyle = '#fff2a0'; c.beginPath(); c.moveTo(d * 10, -2.5); c.lineTo(d * (10 + L * 0.55), 0); c.lineTo(d * 10, 2.5); c.fill(); }
  c.fillStyle = '#f4f0f8'; c.strokeStyle = '#3a2a4a'; c.lineWidth = 2; c.beginPath(); c.moveTo(13, 0); c.lineTo(-8, -10); c.lineTo(-11, -10); c.lineTo(-11, 10); c.lineTo(-8, 10); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#8ad0ff'; c.beginPath(); c.arc(-1, 0, 4, 0, 7); c.fill(); c.stroke();
  c.fillStyle = '#e8563a'; c.fillRect(-11, -10, 3, 20);
  c.restore();
}
const CU_BTN = { brake: { x: 106, y: 560, w: 150, h: 70, d: -1, label: 'Brake', col: '#ff8a4a' }, boost: { x: 254, y: 560, w: 150, h: 70, d: 1, label: 'Boost', col: '#5ad0a0' } };
const cuIn = (b, x, y) => Math.abs(x - b.x) <= b.w / 2 + 6 && Math.abs(y - b.y) <= b.h / 2 + 8;
const cuWrap = a => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
// the gap from the capsule forward to the station along the orbit (radians, > 0 while the capsule is behind)
function cuGap(s) { return cuWrap(Math.atan2(s.cap.y - CU_C[1], s.cap.x - CU_C[0]) - s.st.th); }
function cuStationXY(s) { return [CU_C[0] + CU_R * Math.cos(s.st.th), CU_C[1] + CU_R * Math.sin(s.st.th)]; }
function cuReady(s) { const [sx, sy] = cuStationXY(s); return s.brakes >= s.burns && s.boosts < s.burns && SK.dist(s.cap.x, s.cap.y, sx, sy) < 50; }
function cuButton(c, g, b, s, on, ready) { // a big thruster button with a little capsule icon: flame out of the nose (brake) or tail (boost)
  const t = g.t, pressed = t - (b.d < 0 ? s.brakeT : s.boostT) < 0.18, p = 0.5 + 0.5 * Math.sin(t * 6);
  c.save(); c.translate(b.x, b.y + (pressed ? 3 : 0));
  if (ready) { c.fillStyle = `rgba(150,255,190,${0.25 + 0.25 * p})`; c.beginPath(); c.roundRect(-b.w / 2 - 8, -b.h / 2 - 8, b.w + 16, b.h + 16, 22); c.fill(); }
  c.fillStyle = 'rgba(10,8,30,0.5)'; c.beginPath(); c.roundRect(-b.w / 2, -b.h / 2 + 6, b.w, b.h, 18); c.fill();
  const gr = c.createLinearGradient(0, -b.h / 2, 0, b.h / 2); gr.addColorStop(0, P.shade(b.col, on ? 0.3 : -0.2)); gr.addColorStop(1, P.shade(b.col, on ? -0.25 : -0.55));
  c.fillStyle = gr; c.strokeStyle = '#1a1030'; c.lineWidth = 3; c.beginPath(); c.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 18); c.fill(); c.stroke();
  // icon
  c.save(); const d = b.d; c.translate(d < 0 ? -50 : -30, -3); c.scale(1.3, 1.3); // the capsule always points right; the flame shows where the thrust goes
  const L = 16 + 4 * Math.sin(t * 30), fx = d < 0 ? 13 : -11, fd = d < 0 ? 1 : -1;
  c.fillStyle = '#ffb040'; c.beginPath(); c.moveTo(fx, -6); c.lineTo(fx + fd * L, 0); c.lineTo(fx, 6); c.fill(); c.fillStyle = '#fff2a0'; c.beginPath(); c.moveTo(fx, -3); c.lineTo(fx + fd * L * 0.6, 0); c.lineTo(fx, 3); c.fill();
  c.fillStyle = '#f4f0f8'; c.strokeStyle = '#3a2a4a'; c.lineWidth = 2; c.beginPath(); c.moveTo(13, 0); c.lineTo(-8, -9); c.lineTo(-11, -9); c.lineTo(-11, 9); c.lineTo(-8, 9); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#8ad0ff'; c.beginPath(); c.arc(-1, 0, 3.5, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#e8563a'; c.fillRect(-11, -9, 3, 18);
  c.restore();
  c.font = '900 25px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 5; c.strokeStyle = 'rgba(20,10,30,0.7)'; c.strokeText(b.label, 30, -4); c.fillStyle = '#fff6ea'; c.fillText(b.label, 30, -4);
  // pips: how many burns of this kind the trip needs, lit as they are done
  const n = s.burns, done = Math.min(n, d < 0 ? s.brakes : s.boosts);
  for (let i = 0; i < n; i++) { const px = 30 + (i - (n - 1) / 2) * 16; c.fillStyle = i < done ? '#fff6a0' : 'rgba(20,10,30,0.5)'; c.strokeStyle = '#1a1030'; c.lineWidth = 1.5; c.beginPath(); c.arc(px, 21, 5, 0, 7); c.fill(); c.stroke(); }
  c.restore();
}
MG.add({
  id: 'catchup', stage: 'space', cmd: 'BRAKE TO CATCH THE STATION!', time: 6, mood: 'night', winText: 'Lower, faster!', failText: 'Missed it!',
  card: { title: 'Slow down to catch up', kind: 'Astronomy', ref: 'Orbital mechanics (phasing)',
    text: 'In orbit, a lower path is a faster lap. Closer to the Earth, gravity pulls harder, so a spacecraft must move faster to keep falling around it, and the circle it travels is shorter.\n\nSo to catch a space station ahead of you, you brake. The capsule drops into a lower orbit, gains on the station every lap, then boosts back up beside it. Push forward instead and you rise into a higher, slower orbit and fall further behind.\n\nReal crews plan their trips to the space station this way.',
    note: 'A lower orbit is faster, so to catch something ahead of you in orbit, you brake and drop lower.' },
  init(g) {
    const s = g.s, burns = g.level >= 2 ? 2 : 1, v = SK.variant(g, 4); s.burns = burns; s.v = v;
    // variants: where on the orbit the chase starts (the station leads by just enough that the brakes bring the capsule up beside it)
    const th = [-Math.PI / 2, -Math.PI * 0.15, Math.PI * 0.35, Math.PI * 0.85][v]; s.st = { th };
    const tc = th + cuLead(burns); s.lead = cuLead(burns);
    s.cap = { x: CU_C[0] + CU_R * Math.cos(tc), y: CU_C[1] + CU_R * Math.sin(tc), vx: CU_VC * Math.sin(tc), vy: -CU_VC * Math.cos(tc) };
    s.fired = 0; s.brakes = 0; s.boosts = 0; s.lastBurn = 0; s.flame = 0; s.flameT = -9; s.brakeT = -9; s.boostT = -9; s.dock = 0; s.crash = 0;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    const btn = cuIn(CU_BTN.brake, x, y) ? CU_BTN.brake : cuIn(CU_BTN.boost, x, y) ? CU_BTN.boost : null; if (!btn) return;
    const b = s.cap, v = Math.hypot(b.vx, b.vy), d = btn.d; b.vx += d * CU_DV * b.vx / v; b.vy += d * CU_DV * b.vy / v; // one short burn along (or against) the motion
    s.fired++; if (d < 0) { s.brakes++; s.brakeT = g.t; } else { s.boosts++; s.boostT = g.t; } s.lastBurn = g.t; s.flame = d; s.flameT = g.t; g.sfx('whoosh'); g.sfx(d < 0 ? 'shrink' : 'grow');
  },
  update(g, dt) {
    const s = g.s, b = s.cap;
    if (s.dock) { const [sx, sy] = cuStationXY(s); s.st.th -= 2 * Math.PI / CU_T * dt; b.x = SK.lerp(b.x, sx + 26 * Math.sin(s.st.th), 0.2); b.y = SK.lerp(b.y, sy - 26 * Math.cos(s.st.th), 0.2); b.vx = 2 * Math.PI / CU_T * CU_R * Math.sin(s.st.th); b.vy = -2 * Math.PI / CU_T * CU_R * Math.cos(s.st.th); return; }
    if (s.crash) return;
    for (let i = 0; i < 8; i++) cuStep(b, dt / 8);
    s.st.th -= 2 * Math.PI / CU_T * dt;
    if (g.done) return;
    const [sx, sy] = cuStationXY(s), r = Math.hypot(b.x - CU_C[0], b.y - CU_C[1]), gap = cuGap(s);
    if (s.brakes === s.burns && s.boosts === s.burns && SK.dist(b.x, b.y, sx, sy) < 50) { s.dock = g.t; g.win(); g.sfx('click'); g.sfx('chime'); g.sfx('cheer'); g.burst(sx, sy, ['#fff6c0', '#8ad0ff', '#ffd45a'], 20, 160); return; }
    if (r < CU_EARTH + 8) { s.crash = g.t; g.fail(); g.sfx('fire'); g.burst(b.x, b.y, ['#ff8a40', '#ffd45a', '#fff'], 22, 200); return; }
    // raced past the station without boosting, or fell even further behind (boosted first): it is not going to happen
    if (s.fired && (gap < -0.55 || gap > s.lead + 0.9 || g.t - s.lastBurn > cuPeriod(b) * 1.4)) { g.fail(); g.sfx('wrong'); g.sfx('laugh'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, b = s.cap, v = Math.hypot(b.vx, b.vy), ux = b.vx / v, uy = b.vy / v;
    c.drawImage(g.bake('catchup_bg', cuPaint), 0, 0, 360, 640);
    // three orbit tracks: their dashes travel at the real speeds, fastest on the lowest track
    for (const k of [0.78, 1.25]) { const r = CU_R * k, w = 2 * Math.PI / CU_T * Math.pow(k, -1.5); c.save(); c.strokeStyle = 'rgba(200,210,255,0.2)'; c.lineWidth = 2; c.setLineDash([6, 12]); c.lineDashOffset = t * w * r; c.beginPath(); c.arc(CU_C[0], CU_C[1], r, 0, 7); c.stroke(); c.restore(); }
    c.save(); c.strokeStyle = 'rgba(200,210,255,0.32)'; c.lineWidth = 2; c.setLineDash([6, 12]); c.lineDashOffset = t * 2 * Math.PI / CU_T * CU_R; c.beginPath(); c.arc(CU_C[0], CU_C[1], CU_R, 0, 7); c.stroke(); c.restore();
    cuEarth(c, t);
    const [sx, sy] = cuStationXY(s), gap = cuGap(s);
    // the gap to close: an arc along the station's orbit from the capsule up to the station, orange far, green close
    if (!g.done && gap > -0.5) {
      const k = SK.clamp(Math.abs(gap) / s.lead, 0, 1), col = k < 0.3 ? '#8affb0' : k < 0.7 ? '#ffd45a' : '#ff9a5a', a0 = s.st.th, a1 = s.st.th + gap;
      c.save(); c.strokeStyle = col; c.globalAlpha = 0.75; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.arc(CU_C[0], CU_C[1], CU_R, Math.min(a0, a1), Math.max(a0, a1)); c.stroke(); c.restore();
      if (Math.abs(gap) > 0.35) { const am = s.st.th + gap / 2, rr = CU_R + 26; SK.tag(c, 'Gap', SK.clamp(CU_C[0] + rr * Math.cos(am), 40, 320), SK.clamp(CU_C[1] + rr * Math.sin(am), 170, 500), 18, col); }
    }
    // the path the capsule will take: after a burn its real next lap; before braking, the lower lap a brake would give it
    if (!s.dock && !s.crash && !g.done) {
      const q = { x: b.x, y: b.y, vx: b.vx, vy: b.vy }, preview = s.brakes < s.burns && !s.boosts;
      if (preview) for (let i = s.brakes; i < s.burns; i++) { const w = Math.hypot(q.vx, q.vy); q.vx -= CU_DV * q.vx / w; q.vy -= CU_DV * q.vy / w; }
      if (s.fired || preview) { const T = Math.min(6, cuPeriod(q)), n = 90; c.save(); c.strokeStyle = preview ? 'rgba(255,170,110,0.55)' : 'rgba(140,230,200,0.7)'; c.lineWidth = 2.5; c.setLineDash([3, 6]); c.beginPath(); c.moveTo(q.x, q.y);
        for (let i = 0; i < n; i++) { for (let k = 0; k < 4; k++) cuStep(q, T / n / 4); c.lineTo(q.x, q.y); if (Math.hypot(q.x - CU_C[0], q.y - CU_C[1]) < CU_EARTH) break; } c.stroke(); c.restore(); }
    }
    cuStation(c, sx, sy, s.st.th, t);
    if (!g.done) SK.tag(c, 'Station', SK.clamp(sx + Math.cos(s.st.th) * 46, 52, 308), SK.clamp(sy + Math.sin(s.st.th) * 46, 170, 500), 18);
    const ready = !g.done && cuReady(s), nextBrake = !g.done && s.brakes < s.burns && !s.boosts;
    if (!s.crash) {
      // which way the next burn pushes: an arrow on the capsule, backward (brake) or forward (boost)
      if (nextBrake || ready) { const d = nextBrake ? -1 : 1, col = nextBrake ? '#ff9a5a' : '#8affb0', p = 0.5 + 0.5 * Math.sin(t * 6), L0 = 26, L1 = 52 + 6 * p;
        c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(b.x + d * ux * L0, b.y + d * uy * L0); c.lineTo(b.x + d * ux * L1, b.y + d * uy * L1); c.stroke();
        c.translate(b.x + d * ux * (L1 + 6), b.y + d * uy * (L1 + 6)); c.rotate(Math.atan2(d * uy, d * ux)); c.beginPath(); c.moveTo(9, 0); c.lineTo(-6, -9); c.lineTo(-6, 9); c.closePath(); c.fill(); c.restore(); }
      cuCapsule(c, b.x, b.y, Math.atan2(b.vy, b.vx), t - s.flameT < 0.45 ? s.flame : s.dock && t - s.dock < 0.5 ? 1 : 0, t);
      if (!g.done && SK.dist(b.x, b.y, sx, sy) > 70) { const nx = -uy, ny = ux, side = (b.x + nx * 30 - CU_C[0]) * nx + (b.y + ny * 30 - CU_C[1]) * ny > 0 ? 1 : -1; SK.tag(c, 'Capsule', SK.clamp(b.x + nx * side * 36, 52, 308), SK.clamp(b.y + ny * side * 36, 170, 500), 18); }
    }
    // the rabbit at mission control
    const won = g.result === 'win', lost = g.result === 'fail';
    c.save(); c.strokeStyle = 'rgba(200,230,255,0.8)'; c.lineWidth = 2.5; c.fillStyle = 'rgba(180,220,255,0.16)'; c.beginPath(); c.arc(316, 168, 26, 0, 7); c.fill(); c.stroke(); c.restore();
    SK.animal(c, 'rabbit', 314, 200, 0.6, { t, pose: won ? 'cheer' : lost ? 'sad' : 'point', expr: won ? 'laugh' : lost ? 'wow' : 'think' });
    cuButton(c, g, CU_BTN.brake, s, nextBrake, false);
    cuButton(c, g, CU_BTN.boost, s, ready, ready);
    if (nextBrake) SK.glow(c, g, CU_BTN.brake.x, CU_BTN.brake.y, 44, '#ffd45a', { level: 2 });
    if (ready) SK.glow(c, g, CU_BTN.boost.x, CU_BTN.boost.y, 44, '#a8ffb8', { level: 2 });
    // guidance: tap Brake (as many times as the pips ask); then, once back up beside the station, tap Boost
    const btn = nextBrake ? CU_BTN.brake : CU_BTN.boost; SK.demo(g, c, 'tap', [btn.x - 10, btn.y + 4], null, { never: !nextBrake && !ready });
  },
  // the bot brakes (twice at level 2), then boosts once back up beside the station
  auto(g, dt, synth) {
    const s = g.s, B = s._bot = s._bot || {}; if (g.done) return; const tap = btn => { B.last = g.t; synth('down', btn.x, btn.y); synth('up', btn.x, btn.y); };
    const [sx, sy] = cuStationXY(s), r = Math.hypot(s.cap.x - CU_C[0], s.cap.y - CU_C[1]);
    if (s.brakes < s.burns && g.t >= 1.0 + s.brakes * 0.1 && (!B.last || g.t - B.last > 0.08)) { tap(CU_BTN.brake); return; }
    if (s.brakes === s.burns && s.boosts < s.burns && SK.dist(s.cap.x, s.cap.y, sx, sy) < 40 && r > CU_R - 8 && (!B.last || g.t - B.last > 0.08)) tap(CU_BTN.boost);
  },
});
