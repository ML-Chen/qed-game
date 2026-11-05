// HOLD TEMP! (earth_eng SC-02) — a snowy night; the hedgehog in its armchair. Be the thermostat: tap the heater on
// when the room gets cold and off when it gets warm, keeping the thermometer in its green band. The heater takes a
// moment to warm up and to cool down, so you have to switch early. Every second in the band fills the comfy heart;
// fill it to win. Leave it on and the room turns stuffy and the hedgehog wilts; leave it off and it freezes.
// Level 2: a narrower band, and the window blows open halfway, so the room loses heat faster.
const TH = { x: 316, y0: 170, y1: 520 }, HEAT = { x: 66, y: 520 }, SEAT = { x: 200, y: 520 };
const CFG = [ // the comfy band (0..1 on the thermometer) and the seconds you must keep it there
  { lo: 0.44, hi: 0.66, need: 3.0 }, { lo: 0.46, hi: 0.64, need: 3.4 }, { lo: 0.48, hi: 0.62, need: 3.8 },
];
const A = 0.5, LOSS = 0.3, OUT = -0.3; // heater strength, heat lost through the walls, the cold outside (thermometer units)
function paintRoom(o) {
  const wl = o.createLinearGradient(0, 0, 0, 560); wl.addColorStop(0, '#6a3a4a'); wl.addColorStop(1, '#8a4a52'); o.fillStyle = wl; o.fillRect(0, 0, 360, 560);
  o.fillStyle = 'rgba(255,220,180,0.07)'; for (let x = 0; x < 360; x += 36) for (let y = 0; y < 560; y += 36) { o.beginPath(); o.arc(x + 18, y + 18, 6, 0, 7); o.fill(); }
  const fl = o.createLinearGradient(0, 556, 0, 640); fl.addColorStop(0, '#7a4a2a'); fl.addColorStop(1, '#4a2a18'); o.fillStyle = fl; o.fillRect(0, 556, 360, 84);
  o.fillStyle = '#3a2016'; o.fillRect(0, 550, 360, 8);
  // a rug
  o.fillStyle = '#c8a03a'; o.beginPath(); o.ellipse(186, 590, 120, 22, 0, 0, 7); o.fill(); o.strokeStyle = '#8a5a1a'; o.lineWidth = 3; o.beginPath(); o.ellipse(186, 590, 104, 16, 0, 0, 7); o.stroke();
  // the window frame (the snow outside is drawn live)
  o.fillStyle = '#3a2430'; o.fillRect(40, 140, 170, 170); o.fillStyle = '#e8dcc8'; o.fillRect(46, 146, 158, 158);
  // the armchair
  o.fillStyle = '#2a6a8a'; o.beginPath(); o.roundRect(142, 430, 116, 110, 26); o.fill(); o.fillStyle = '#3a8aaa'; o.beginPath(); o.roundRect(132, 480, 30, 64, 12); o.fill(); o.beginPath(); o.roundRect(238, 480, 30, 64, 12); o.fill();
  o.fillStyle = '#245a74'; o.beginPath(); o.roundRect(156, 508, 88, 36, 10); o.fill();
  // the thermometer on the wall: glass tube and bulb
  o.fillStyle = 'rgba(0,0,0,0.25)'; o.beginPath(); o.roundRect(TH.x - 22, TH.y0 - 18, 44, TH.y1 - TH.y0 + 66, 22); o.fill();
  o.fillStyle = '#f4f0ea'; o.beginPath(); o.roundRect(TH.x - 12, TH.y0 - 8, 24, TH.y1 - TH.y0 + 16, 12); o.fill(); o.beginPath(); o.arc(TH.x, TH.y1 + 22, 20, 0, 7); o.fill();
  for (let i = 0; i <= 10; i++) { const y = TH.y1 - (TH.y1 - TH.y0) * i / 10; o.fillStyle = '#8a7a6a'; o.fillRect(TH.x + 13, y - 1, i % 5 ? 6 : 10, 2); }
}
const tY = k => TH.y1 - (TH.y1 - TH.y0) * SK.clamp(k, 0, 1.04);
MG.add({
  id: 'holdtemp', stage: 'robots', cmd: 'KEEP THE ROOM IN THE GREEN!', time: 6, mood: 'night', winText: 'Thermostat!', failText: 'Out of band!',
  card: { title: 'On, off, on, off', kind: 'Control', ref: 'On-off (bang-bang) control, the thermostat',
    text: 'A thermostat keeps a room near a set temperature with a very simple rule. Too cold: switch the heater on. Warm enough: switch it off. The temperature wiggles up and down in a narrow band instead of sitting still.\n\nA heater takes time to warm up and to cool down, so the room keeps warming for a moment after you switch off. Switching a little early stops it overshooting. Real thermostats add a small gap, called a dead band, between the "on" and "off" temperatures, so the heater does not flick on and off every second.',
    note: 'An on-off controller switches the heater on below the target and off above it, so the temperature stays in a band.' },
  init(g) { const s = g.s, C = CFG[Math.min(2, g.level)]; s.C = C; s.T = 0.47; s.h = 0; s.on = false; s.comfy = 0; s.taps = 0; s.windowOpen = 0; s.flick = 0; },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    if (SK.dist(x, y, HEAT.x, HEAT.y - 30) < 70) { s.on = !s.on; s.taps++; s.flick = 0.25; g.sfx('click'); if (s.on) g.sfx('fire', { vol: 0.4 }); }
  },
  update(g, dt) {
    const s = g.s, C = s.C; s.flick = Math.max(0, s.flick - dt);
    if (g.level >= 2 && g.t > 2.6 && !s.windowOpen) { s.windowOpen = 0.001; g.sfx('wind'); g.sfx('thud'); }
    if (s.windowOpen) s.windowOpen = Math.min(1, s.windowOpen + dt * 3);
    s.h += ((s.on ? 1 : 0) - s.h) * (1 - Math.exp(-dt / 0.4)); // the radiator warms up and cools down slowly
    if (g.done) return;
    const loss = LOSS * (1 + 0.6 * s.windowOpen);
    s.T += (A * s.h - loss * (s.T - OUT)) * dt;
    const inBand = s.T >= C.lo && s.T <= C.hi; if (inBand) { s.comfy += dt; if (Math.floor((s.comfy - dt) * 2) !== Math.floor(s.comfy * 2)) g.sfx('tap', { vol: 0.3, pitch: 1.5 }); }
    if (s.comfy >= C.need) { g.win(); g.sfx('cheer'); g.burst(SEAT.x, SEAT.y - 70, ['#ff7a9a', '#ffe27a'], 18, 140); return; }
    if (s.T < 0.02) { s.cold = 1; g.sfx('crunch'); g.fail(); }
    if (s.T > 0.96) { s.hot = 1; g.sfx('fail'); g.fail(); }
  },
  draw(g, c) {
    const s = g.s, C = s.C, t = g.t, won = g.result === 'win';
    c.drawImage(g.bake('holdtemp_room', paintRoom), 0, 0, 360, 640);
    // the snowy night through the window (blown open at level 2)
    c.save(); c.beginPath(); c.rect(52, 152, 146, 146); c.clip();
    const sky = c.createLinearGradient(0, 152, 0, 298); sky.addColorStop(0, '#1a2a5a'); sky.addColorStop(1, '#3a5a8a'); c.fillStyle = sky; c.fillRect(52, 152, 146, 146);
    c.fillStyle = '#e8f0ff'; c.beginPath(); c.moveTo(52, 280); c.quadraticCurveTo(120, 262, 198, 284); c.lineTo(198, 298); c.lineTo(52, 298); c.fill();
    const rnd = P.rng(3), wind = 1 + 2 * s.windowOpen; for (let i = 0; i < 36; i++) { const sx = rnd() * 200, sp = 30 + rnd() * 40, y = 152 + ((rnd() * 146 + t * sp) % 146), x = 52 + ((sx + t * 14 * wind + Math.sin(t * 2 + i) * 6) % 160); c.fillStyle = 'rgba(255,255,255,0.85)'; c.beginPath(); c.arc(x, y, 1.4 + rnd() * 1.6, 0, 7); c.fill(); }
    c.restore();
    c.fillStyle = '#e8dcc8'; c.fillRect(123, 146, 4, 158); c.fillRect(46, 223, 158, 4);
    if (s.windowOpen) { c.save(); c.translate(204, 146); c.scale(1 - 0.75 * s.windowOpen, 1); c.fillStyle = 'rgba(200,230,255,0.4)'; c.fillRect(-79, 0, 79, 158); c.strokeStyle = '#3a2430'; c.lineWidth = 5; c.strokeRect(-79, 0, 79, 158); c.restore(); for (let i = 0; i < 4; i++) { const k = (t * 1.5 + i / 4) % 1; c.strokeStyle = `rgba(220,240,255,${0.5 * (1 - k)})`; c.lineWidth = 2; c.beginPath(); c.moveTo(200, 180 + i * 28); c.quadraticCurveTo(220 + k * 60, 170 + i * 28, 240 + k * 80, 186 + i * 28); c.stroke(); } }
    // the radiator: fins glowing from dull grey to orange as it heats
    const h = s.h; for (let i = 0; i < 6; i++) { const x = HEAT.x - 45 + i * 18; c.fillStyle = `rgb(${110 + 145 * h},${110 + 40 * h},${120 - 70 * h})`; c.beginPath(); c.roundRect(x, HEAT.y - 70, 14, 86, 6); c.fill(); c.strokeStyle = 'rgba(0,0,0,0.3)'; c.lineWidth = 1.5; c.stroke(); }
    c.fillStyle = '#5a5a64'; c.fillRect(HEAT.x - 50, HEAT.y + 12, 108, 8);
    if (h > 0.2) for (let i = 0; i < 4; i++) { const k = (t * 0.8 + i / 4) % 1; c.strokeStyle = `rgba(255,190,120,${0.4 * h * (1 - k)})`; c.lineWidth = 3; c.beginPath(); const x = HEAT.x - 36 + i * 22; c.moveTo(x, HEAT.y - 80 - k * 60); c.quadraticCurveTo(x + 10, HEAT.y - 100 - k * 60, x, HEAT.y - 120 - k * 60); c.stroke(); }
    // the heater's switch light
    c.fillStyle = s.on ? '#5aff7a' : '#4a2a2a'; c.beginPath(); c.arc(HEAT.x + 2, HEAT.y - 86, 9, 0, 7); c.fill(); if (s.on) { c.fillStyle = 'rgba(90,255,122,0.35)'; c.beginPath(); c.arc(HEAT.x + 2, HEAT.y - 86, 16, 0, 7); c.fill(); }
    if (!g.done) SK.glow(c, g, HEAT.x + 4, HEAT.y - 30, 56);
    SK.tag(c, 'Heater', HEAT.x + 4, HEAT.y + 44, 18); SK.tag(c, 'Thermometer', TH.x - 40, TH.y0 - 30, 18);
    // the thermometer: green band and the red liquid
    c.fillStyle = 'rgba(90,220,120,0.45)'; c.fillRect(TH.x - 10, tY(C.hi), 20, tY(C.lo) - tY(C.hi));
    c.strokeStyle = '#3ac86a'; c.lineWidth = 2; c.strokeRect(TH.x - 16, tY(C.hi), 32, tY(C.lo) - tY(C.hi));
    c.fillStyle = '#e8323e'; c.beginPath(); c.arc(TH.x, TH.y1 + 22, 15, 0, 7); c.fill(); c.fillRect(TH.x - 5, tY(s.T), 10, TH.y1 + 22 - tY(s.T));
    // the hedgehog: shivering when cold, wilting when stuffy, happy in the band
    const inBand = s.T >= C.lo && s.T <= C.hi, cold = s.T < C.lo, sh = cold && !won ? Math.sin(t * 50) * (C.lo - s.T) * 14 : 0;
    SK.animal(c, 'hedgehog', SEAT.x + sh, SEAT.y + 4, 1.3, { t, pose: won ? 'cheer' : 'idle', expr: won || inBand ? 'laugh' : s.T > C.hi ? 'sad' : 'wow', tint: s.cold ? '#a8c8f0' : s.T > 0.82 ? '#e89a7a' : undefined });
    if (s.T > C.hi + 0.06 || s.hot) for (let i = 0; i < 3; i++) { const k = (t * 1.2 + i / 3) % 1; c.fillStyle = `rgba(140,200,255,${1 - k})`; c.beginPath(); c.ellipse(SEAT.x - 30 + i * 30, SEAT.y - 80 + k * 30, 3, 5, 0, 0, 7); c.fill(); }
    if (s.cold) { c.fillStyle = 'rgba(200,230,255,0.5)'; c.beginPath(); c.roundRect(SEAT.x - 50, SEAT.y - 100, 100, 104, 14); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 3; c.stroke(); }
    if (s.hot) { c.fillStyle = 'rgba(255,120,60,0.18)'; c.fillRect(0, 0, 360, 640); }
    // the comfy heart fills with every second in the band
    const k = SK.clamp(s.comfy / C.need, 0, 1), hx = SEAT.x, hy = 380, R = 26;
    const heart = () => { c.beginPath(); c.moveTo(hx, hy + R * 0.9); c.bezierCurveTo(hx - R * 1.6, hy - R * 0.1, hx - R * 0.6, hy - R * 1.2, hx, hy - R * 0.4); c.bezierCurveTo(hx + R * 0.6, hy - R * 1.2, hx + R * 1.6, hy - R * 0.1, hx, hy + R * 0.9); c.closePath(); };
    c.save(); heart(); c.fillStyle = 'rgba(255,255,255,0.18)'; c.fill(); c.clip(); c.fillStyle = '#ff5a7a'; c.fillRect(hx - 50, hy + R - k * 2.2 * R, 100, 2.2 * R + 10); c.restore();
    c.save(); heart(); c.strokeStyle = inBand ? '#ffe27a' : '#fff6ea'; c.lineWidth = 3; c.stroke(); c.restore();
    SK.demo(g, c, 'tap', [HEAT.x, HEAT.y - 30]);
  },
  auto(g, dt, synth) { // a bot thermostat: switch on low in the band, off early (the radiator keeps heating for a moment)
    const s = g.s, C = s.C; if (g.done || g.t < 1.0) return; const B = s._bot = s._bot || {}; if (B.next && g.t < B.next) return;
    if (!s.on && s.T < C.lo + 0.04) { synth('down', HEAT.x, HEAT.y - 30); synth('up', HEAT.x, HEAT.y - 30); B.next = g.t + 0.2; }
    else if (s.on && s.T > C.hi - 0.08 * s.h - 0.02) { synth('down', HEAT.x, HEAT.y - 30); synth('up', HEAT.x, HEAT.y - 30); B.next = g.t + 0.2; }
  },
});
