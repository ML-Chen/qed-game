// PLANT! (earth EE EL-10) — a bare hill above a cottage, rain clouds rolling in. Tap each bare patch to plant grass and a
// bush; their roots grip the soil. When the rain comes, planted soil stays put and only clear water runs past the door.
// Any patch left bare turns to mud, slides down the hill and splats on the door.
const PL_SPOTS = [[40, 90, 140, 190, 236], [30, 72, 114, 156, 198, 240], [24, 60, 96, 132, 168, 204, 242]];
const PL_DOOR = 280, PL_TOP = 250, PL_BOT = 520, PL_X1 = 280;
function plY(x) { if (x >= PL_X1) return PL_BOT; const k = Math.max(0, x / PL_X1), e = k * k * (3 - 2 * k); return PL_TOP + (PL_BOT - PL_TOP) * e; }
function plPaint(o) {
  B5.vgrad(o, 0, 0, 360, 640, ['#56688f', '#8fa3c2', '#d9d4c4', '#efe0c2']);
  // far hills, misty blue-green
  o.fillStyle = '#9ab49a'; o.beginPath(); o.moveTo(0, 330); for (let x = 0; x <= 360; x += 10) o.lineTo(x, 300 - 26 * Math.sin(x / 70 + 1) - 12 * Math.sin(x / 23)); o.lineTo(360, 640); o.lineTo(0, 640); o.fill();
  o.fillStyle = '#7fa07e'; o.beginPath(); o.moveTo(0, 400); for (let x = 0; x <= 360; x += 10) o.lineTo(x, 380 - 20 * Math.sin(x / 50 + 3)); o.lineTo(360, 640); o.lineTo(0, 640); o.fill();
  for (let i = 0; i < 4; i++) P.tree(o, 250 + i * 34, 392 - 14 * Math.sin((250 + i * 34) / 50 + 3), 0.42, '#5f8a5a', 20 + i);
  // the flat yard on the right, grassy
  B5.vgrad(o, 0, PL_BOT, 360, 120, ['#7cae58', '#5d8f44', '#4a7438']);
  P.grassTufts(o, 360, PL_BOT + 6, 600, 40, '#79b04f', 5);
  // the bare hill in cross-section: topsoil over subsoil over rock
  const path = () => { o.beginPath(); o.moveTo(-10, PL_TOP); for (let x = 0; x <= PL_X1 + 2; x += 4) o.lineTo(x, plY(x)); o.lineTo(PL_X1 + 30, 640); o.lineTo(-10, 640); o.closePath(); };
  o.save(); path(); o.clip();
  B5.vgrad(o, 0, PL_TOP, 360, 400, ['#a46c3e', '#86542f', '#6a4026', '#523424']);
  const r = P.rng(31);
  for (let i = 0; i < 160; i++) { o.fillStyle = r() < 0.5 ? 'rgba(60,30,20,0.35)' : 'rgba(230,180,120,0.3)'; o.beginPath(); o.arc(r() * 300, PL_TOP + r() * 380, 1 + r() * 2.2, 0, 7); o.fill(); }
  for (let i = 0; i < 12; i++) P.rock(o, 20 + r() * 240, 470 + r() * 140, 0.35 + r() * 0.25, '#9a8a7a');
  o.restore();
  // the topsoil skin: a light, crumbly band along the surface
  o.strokeStyle = '#c48a54'; o.lineWidth = 7; o.lineJoin = 'round'; o.beginPath(); for (let x = -10; x <= PL_X1; x += 4) o.lineTo(x, plY(x) + 2); o.stroke();
  o.strokeStyle = '#d9a56a'; o.lineWidth = 2; o.beginPath(); for (let x = -10; x <= PL_X1; x += 4) o.lineTo(x, plY(x)); o.stroke();
  P.grain(o, 360, 640, 0.04);
}
MG.add({
  id: 'plant', stage: 'earth', cmd: 'PLANT!', time: 5, mood: 'storm', winText: 'Held!', failText: 'Mudslide!',
  card: { title: 'Roots hold the soil', kind: 'Earth science', ref: 'Soil erosion',
    text: 'Rain hitting bare soil knocks the grains loose, and running water carries them downhill. On a steep hill that can turn into a mudslide.\n\nPlant roots spread through the soil like a net and grip it. Leaves and grass also break the fall of the raindrops, so the water soaks in or runs off slowly and clear. Farmers, road builders and gardeners plant slopes for exactly this reason.',
    note: 'Plant roots hold soil in place, so rain cannot wash it away. Bare soil erodes.' },
  init(g) {
    const s = g.s; s.spots = PL_SPOTS[Math.min(2, g.level)].map(x => ({ x, y: plY(x), at: 0 }));
    s.ck = 0; s.rainT = 0; s.mud = []; s.splat = 0;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    const sp = SK.pick(s.spots.filter(p => !p.at), x, y, 48); if (!sp) return;
    sp.at = g.t; g.sfx('grow'); g.sfx('rustle'); g.burst(sp.x, sp.y - 6, ['#7cc456', '#b8e070', '#8a5a34'], 8, 90);
  },
  update(g, dt) {
    const s = g.s, all = s.spots.every(p => p.at);
    // the clouds roll in on their own; once every patch is planted they hurry up
    if (!s.rainT) { const arrive = SK.clamp(g.dur * 0.5, 3.2, 6.5); s.ck = Math.min(1, s.ck + dt * (all ? 2.2 : B5.patient() ? 0 : 1 / arrive)); if (s.ck >= 1) { s.rainT = g.t; g.sfx('rain'); g.sfx('thunder');
      for (const p of s.spots) if (!p.at) s.mud.push({ x: p.x, v: 20, r: 13 }); } }
    if (!s.rainT || g.done) return;
    for (const m of s.mud) { m.v = Math.min(300, m.v + 420 * dt); m.x += m.v * dt; m.r = Math.min(24, m.r + dt * 10);
      if (m.x >= PL_DOOR && !s.splat) { s.splat = g.t; g.sfx('splash'); g.sfx('laugh'); g.shake(4, 0.3); g.burst(PL_DOOR + 8, PL_BOT - 14, ['#6a4424', '#8a5a30', '#4a2e18'], 22, 220); g.fail(); } }
    if (!s.mud.length && g.t - s.rainT > 1.3) { g.win(); g.sfx('cheer'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, rain = s.rainT ? Math.min(1, (t - s.rainT) * 3) : 0;
    c.drawImage(g.bake('plant_bg', plPaint), 0, 0, 360, 640);
    // darkening sky as the storm arrives
    c.fillStyle = `rgba(40,44,70,${0.32 * s.ck})`; c.fillRect(0, 0, 360, 640);
    // the cottage and the beaver on the doorstep
    const lost = g.result === 'fail', won = g.result === 'win';
    B5.cottage(c, 312, PL_BOT + 2, 1, { mud: s.splat ? Math.min(1, (t - s.splat) * 4) : 0 });
    SK.animal(c, 'beaver', 334, PL_BOT + 52, 0.7, { t, facing: -1, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : s.ck > 0.6 ? 'think' : 'happy' });
    // the patches: bare dug spots, or plants with roots reaching down into the soil
    for (const p of s.spots) {
      if (!p.at) { c.fillStyle = '#5e3a22'; c.beginPath(); c.ellipse(p.x, p.y + 3, 19, 7, Math.atan2(plY(p.x + 4) - plY(p.x - 4), 8), 0, 7); c.fill();
        c.fillStyle = '#7a4c2c'; for (let i = -1; i <= 1; i++) { c.beginPath(); c.arc(p.x + i * 8, p.y + (i ? 1 : -1), 3, 0, 7); c.fill(); }
        if (!s.rainT) SK.glow(c, g, p.x, p.y, 22); continue; }
      const k = SK.easeOut((t - p.at) / 0.45);
      c.save(); c.strokeStyle = '#e8d2a0'; c.lineCap = 'round'; // roots
      for (let i = 0; i < 5; i++) { const a = -0.9 + i * 0.45, L = (26 + (i % 2) * 14) * k; c.lineWidth = 2.4 - (i % 2) * 0.8; c.beginPath(); c.moveTo(p.x, p.y + 4); c.quadraticCurveTo(p.x + Math.sin(a) * L * 0.3, p.y + 4 + L * 0.6, p.x + Math.sin(a) * L, p.y + 6 + Math.cos(a) * L); c.stroke();
        c.lineWidth = 1; c.beginPath(); c.moveTo(p.x + Math.sin(a) * L * 0.6, p.y + 6 + Math.cos(a) * L * 0.6); c.lineTo(p.x + Math.sin(a) * L * 0.6 + 6, p.y + 10 + Math.cos(a) * L * 0.6); c.stroke(); }
      c.restore();
      const sway = Math.sin(t * 3 + p.x) * (1 + rain * 2);
      B5.blades(c, p.x - 14, p.y + 2, 14 * k, '#6ab84f', sway); B5.blades(c, p.x + 14, plY(p.x + 14) + 2, 13 * k, '#5aa848', sway);
      B5.bush(c, p.x, p.y + 4, 1.0, k, '#4f9a48');
    }
    // sliding mud
    for (const m of s.mud) { if (s.splat && m.x >= PL_DOOR) continue; const y = Math.min(plY(m.x), PL_BOT), a = Math.atan2(plY(m.x + 5) - plY(m.x - 5), 10), R = m.r;
      c.strokeStyle = 'rgba(122,80,48,0.75)'; c.lineWidth = R * 0.7; c.lineCap = 'round'; c.beginPath(); for (let d = 0; d < 70; d += 5) c.lineTo(m.x - d, plY(m.x - d) - R * 0.25); c.stroke();
      c.save(); c.translate(m.x, y - R * 0.45); c.rotate(a);
      c.fillStyle = '#7a5030'; c.strokeStyle = '#3a2414'; c.lineWidth = 2; c.beginPath(); c.moveTo(-R * 1.8, R * 0.45); c.quadraticCurveTo(-R * 0.6, -R * 1.1, R * 0.7, -R * 0.6); c.quadraticCurveTo(R * 1.5, -R * 0.2, R * 1.2, R * 0.45); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = 'rgba(220,170,110,0.65)'; c.beginPath(); c.ellipse(-R * 0.2, -R * 0.45, R * 0.5, R * 0.16, -0.3, 0, 7); c.fill();
      c.fillStyle = '#5e3a20'; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(R * (0.9 + i * 0.35), -R * (0.7 + 0.3 * Math.sin(t * 9 + i * 2)), R * 0.14, 0, 7); c.fill(); }
      c.restore(); }
    // water running down the hill and past the house: clear where the soil holds, brown behind mud
    if (rain) { c.save(); c.globalAlpha = rain; c.lineCap = 'round'; c.lineWidth = 3;
      for (let i = 0; i < 14; i++) { const q = ((t * 0.9 + i / 14) % 1), x = q * 380 - 10, y = Math.min(plY(x), PL_BOT) + (x > PL_X1 ? 8 : 0) - 2;
        c.strokeStyle = s.mud.length ? 'rgba(130,86,50,0.7)' : 'rgba(190,230,255,0.8)'; c.beginPath(); c.moveTo(x - 10, Math.min(plY(x - 10), PL_BOT) + (x - 10 > PL_X1 ? 8 : 0) - 2); c.lineTo(x, y); c.stroke(); }
      c.restore(); }
    // the clouds rolling in from the left, and the rain
    const cx = -70 + s.ck * 190;
    P.cloud(c, cx + 130, 150, 1.0, '#8e94ac', '#4a4f6c', 0.97); P.cloud(c, cx - 60, 160, 1.1, '#8a90a8', '#464b68', 0.97); P.cloud(c, cx + 40, 178, 1.3, '#9aa0b6', '#50567a', 0.98);
    if (rain) { c.save(); c.globalAlpha = rain; c.beginPath(); c.rect(0, 190, 330, 450); c.clip(); P.rain(c, 330, 640, t, 110, 'rgba(210,225,255,0.55)', -0.15); c.restore(); }
    const first = s.spots.find(p => !p.at); if (first) SK.demo(g, c, 'tap', [first.x, first.y], null);
  },
  auto(g, dt, synth) { const s = g.s; s.spots.forEach((p, i) => SK.bot.tap(g, synth, 'p' + i, 0.8 + i * 0.22, p.x + 4, p.y - 6)); },
});
