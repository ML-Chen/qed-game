// CHARGE! (earth_eng EE-23, with EE-24's flash) — a photo studio. The camera's flash runs off a capacitor, drawn as a
// glass jar filled from the battery's big tank through a narrow pipe. Hold to open the valve: the jar fills fast at
// first, then slower and slower as its level nears the tank's. Let go once it passes the gold line and the flash fires
// and snaps the photo. Let go too early: a feeble flicker, a dark photo, and the jar is empty again. Three animals,
// each standing farther away, so each needs a fuller jar. Level 2: a narrower pipe fills more slowly.
const FL = { x: 304, y: 352 }, TANK = { x: 64, y0: 392, y1: 580, w: 58 }, JAR = { x: 230, y0: 412, y1: 580, w: 74 }, PIPE_Y = 560;
const TAU = [0.62, 0.72, 0.95]; // seconds: how slowly the jar fills (the pipe's resistance times the jar's size)
const DIST = [{ sc: 1.5, y: 318, need: 0.62 }, { sc: 1.15, y: 286, need: 0.76 }, { sc: 0.95, y: 262, need: 0.86 }]; // near, middle, far
const CAST = [['frog', 'duck', 'fox'], ['rabbit', 'penguin', 'owl'], ['hedgehog', 'frog', 'duck'], ['fox', 'owl', 'rabbit'], ['penguin', 'hedgehog', 'frog']];
const ORDER = [[0, 2, 1], [1, 0, 2], [2, 1, 0], [0, 1, 2], [1, 2, 0]];
const SHOTS = [ // each subject: animal, how far back it stands (scale, foot y), and the charge its flash needs
  { kind: 'frog', sc: 1.5, y: 318, need: 0.62 }, { kind: 'duck', sc: 0.95, y: 262, need: 0.86 }, { kind: 'fox', sc: 1.15, y: 286, need: 0.76 },
];
function paintStudio(o) {
  const bg = o.createLinearGradient(0, 0, 0, 340); bg.addColorStop(0, '#3a2a5a'); bg.addColorStop(1, '#6a4a7a'); o.fillStyle = bg; o.fillRect(0, 0, 360, 340);
  // the paper backdrop curving onto the floor
  const bd = o.createLinearGradient(0, 120, 0, 340); bd.addColorStop(0, '#9ad8e8'); bd.addColorStop(0.7, '#c8eef4'); bd.addColorStop(1, '#e8f8fa'); o.fillStyle = bd; o.beginPath(); o.moveTo(40, 120); o.lineTo(320, 120); o.lineTo(340, 340); o.lineTo(20, 340); o.closePath(); o.fill();
  o.fillStyle = '#5a3a2a'; o.fillRect(30, 112, 300, 10); // backdrop roll
  for (const x of [26, 334]) { o.strokeStyle = '#2a2030'; o.lineWidth = 4; o.beginPath(); o.moveTo(x, 120); o.lineTo(x, 340); o.stroke(); } // stands
  // the camera body across the bottom
  o.fillStyle = '#1e1a24'; o.fillRect(0, 340, 360, 300);
  const cb = o.createLinearGradient(0, 360, 0, 610); cb.addColorStop(0, '#4a4452'); cb.addColorStop(1, '#2a2632'); o.fillStyle = cb; o.beginPath(); o.roundRect(14, 362, 332, 240, 22); o.fill();
  o.strokeStyle = 'rgba(255,255,255,0.12)'; o.lineWidth = 2; o.stroke();
  for (let y = 374; y < 596; y += 6) { o.fillStyle = 'rgba(0,0,0,0.12)'; o.fillRect(20, y, 320, 2); } // grip texture
  // the battery tank (always full: the battery's push), and its narrow pipe to the jar
  o.fillStyle = '#16141c'; o.beginPath(); o.roundRect(TANK.x - TANK.w / 2 - 4, TANK.y0 - 4, TANK.w + 8, TANK.y1 - TANK.y0 + 8, 10); o.fill();
  const tw = o.createLinearGradient(TANK.x - TANK.w / 2, 0, TANK.x + TANK.w / 2, 0); tw.addColorStop(0, '#2a7ad8'); tw.addColorStop(0.5, '#6ac8ff'); tw.addColorStop(1, '#2a6ac0'); o.fillStyle = tw; o.beginPath(); o.roundRect(TANK.x - TANK.w / 2, TANK.y0 + 6, TANK.w, TANK.y1 - TANK.y0 - 6, 8); o.fill();
  o.fillStyle = '#e8b83a'; o.beginPath(); o.roundRect(TANK.x - 18, TANK.y0 - 18, 36, 14, 4); o.fill();
  o.fillStyle = '#fff6ea'; o.font = '900 22px Nunito, system-ui, sans-serif'; o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillText('+', TANK.x, TANK.y0 + 30);
  o.strokeStyle = '#16141c'; o.lineWidth = 12; o.beginPath(); o.moveTo(TANK.x + TANK.w / 2, PIPE_Y); o.lineTo(JAR.x - JAR.w / 2, PIPE_Y); o.stroke();
  o.strokeStyle = '#8a8698'; o.lineWidth = 5; o.beginPath(); o.moveTo(TANK.x + TANK.w / 2, PIPE_Y); o.lineTo(JAR.x - JAR.w / 2, PIPE_Y); o.stroke();
  // the jar's glass
  o.fillStyle = 'rgba(200,230,255,0.10)'; o.strokeStyle = 'rgba(220,240,255,0.7)'; o.lineWidth = 3; o.beginPath(); o.roundRect(JAR.x - JAR.w / 2, JAR.y0, JAR.w, JAR.y1 - JAR.y0, 12); o.fill(); o.stroke();
  // the flash lamp on top, wired from the jar
  o.strokeStyle = '#16141c'; o.lineWidth = 7; o.beginPath(); o.moveTo(JAR.x + JAR.w / 2, JAR.y0 + 20); o.lineTo(FL.x, JAR.y0 + 20); o.lineTo(FL.x, 372); o.stroke();
  // the camera's big lens, looking up at the stage
  o.fillStyle = '#121016'; o.beginPath(); o.arc(FL.x, 516, 40, 0, 7); o.fill(); o.strokeStyle = '#6a6474'; o.lineWidth = 4; o.stroke();
  const lg = o.createRadialGradient(FL.x - 10, 506, 3, FL.x, 516, 30); lg.addColorStop(0, '#8ab0e8'); lg.addColorStop(0.5, '#2a3a6a'); lg.addColorStop(1, '#0a0a18'); o.fillStyle = lg; o.beginPath(); o.arc(FL.x, 516, 28, 0, 7); o.fill();
  o.fillStyle = 'rgba(255,255,255,0.5)'; o.beginPath(); o.ellipse(FL.x - 10, 504, 8, 4, -0.6, 0, 7); o.fill();
  // the stage floor, drawn in perspective so the far animals read as far
  o.strokeStyle = 'rgba(80,140,170,0.25)'; o.lineWidth = 1.5; for (let i = 0; i <= 8; i++) { const x = 40 + i * 35; o.beginPath(); o.moveTo(180 + (x - 180) * 0.45, 230); o.lineTo(x, 340); o.stroke(); } for (const y of [242, 262, 290, 326]) { o.beginPath(); o.moveTo(20, y); o.lineTo(340, y); o.stroke(); }
}
function lvlY(k, y0, y1) { return y1 - (y1 - y0 - 8) * k; }
MG.add({
  id: 'charge', stage: 'circuits', cmd: 'CHARGE UP, LET GO TO SNAP!', time: 6, mood: 'party', winText: 'Flash charged!', failText: 'Too dark!',
  card: { title: 'A capacitor fills fast, then slowly', kind: 'Engineering', ref: 'Charging a capacitor (RC circuit)',
    text: 'A capacitor stores electric charge, like a jar stores water. Here the battery is a full tank, and charge flows into the capacitor through a narrow pipe, which is a resistor.\n\nAt first the jar is empty and the push from the tank is strong, so it fills fast. As the jar fills, its own level pushes back, the difference shrinks, and the flow slows down. It creeps closer and closer to the tank\'s level but never quite gets there. A narrower pipe makes the whole thing slower. A camera flash charges a capacitor like this, then empties it all at once into the lamp.',
    note: 'A capacitor charges quickly at first and then more and more slowly, as it nears the battery\'s voltage.' },
  init(g) { const s = g.s; s.v = SK.variant(g, 5); s.shots = ORDER[s.v].map((d, i) => ({ kind: CAST[s.v][i], ...DIST[d] })); s.drainT = null; s.drainQ = 0; s.tau = TAU[Math.min(2, g.level)]; s.q = 0; s.shot = 0; s.flash = 0; s.flashK = 0; s.photos = []; s.dud = 0; s.flowT = 0; },
  down(g) { if (g.done) return; SK.holdStart(g); g.sfx('click'); },
  up(g) {
    const s = g.s; if (s._hold == null) return; SK.holdEnd(g); if (g.done) return;
    const sh = s.shots[s.shot], ok = s.q >= sh.need; s.flash = 0.001; s.flashK = s.q * s.q; s.drainQ = s.q; s.drainT = g.t; // the flash's light grows with the stored energy
    s.photos.push({ kind: sh.kind, ok, t: g.t }); s.q = 0;
    if (ok) { g.sfx('snap'); g.sfx('sparkle'); s.shot++; if (s.shot >= s.shots.length) { g.win(); g.sfx('cheer'); } }
    else { g.sfx('click'); g.sfx('wrong'); s.dud = 0.8; }
  },
  update(g, dt) {
    const s = g.s; if (s.flash) { s.flash += dt; if (s.flash > 0.6) s.flash = 0; } s.dud = Math.max(0, s.dud - dt);
    if (s._hold != null && !g.done) { s.q += (1 - s.q) * (1 - Math.exp(-dt / s.tau)); s.flowT += dt; if (Math.floor((s.flowT - dt) * 8) !== Math.floor(s.flowT * 8)) g.sfx('drip', { vol: 0.35, pitch: 0.8 + s.q }); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', sh = s.shots[Math.min(s.shot, s.shots.length - 1)];
    c.drawImage(g.bake('charge_studio', paintStudio), 0, 0, 360, 640);
    // the subject posing on the backdrop (the next one waits at the side)
    SK.shadow(c, 180, sh.y + 2, 30 * sh.sc, 7 * sh.sc, 0.2);
    SK.animal(c, sh.kind, 180, sh.y, sh.sc, { t, pose: won ? 'cheer' : s.dud ? 'sad' : 'wave', expr: won ? 'laugh' : s.dud || lost ? 'sad' : 'happy' });
    // the flash: brightness from the stored energy
    if (s.flash) { const k = Math.max(0, 1 - s.flash / 0.45) * Math.min(1, s.flashK * 1.3); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,255,230,${k * 0.75})`; c.beginPath(); c.moveTo(FL.x - 24, FL.y - 6); c.lineTo(FL.x + 24, FL.y - 6); c.lineTo(360, 120); c.lineTo(0, 120); c.closePath(); c.fill(); c.fillStyle = `rgba(255,255,240,${k * 0.5})`; c.fillRect(0, 0, 360, 340); c.restore(); }
    // the flash lamp
    const lampOn = s.flash ? Math.max(0, 1 - s.flash / 0.45) * s.flashK : 0; c.fillStyle = '#16141c'; c.beginPath(); c.roundRect(FL.x - 34, FL.y - 18, 68, 40, 8); c.fill(); c.fillStyle = '#c8ccd8'; c.beginPath(); c.moveTo(FL.x - 28, FL.y - 14); c.lineTo(FL.x + 28, FL.y - 14); c.lineTo(FL.x + 20, FL.y + 14); c.lineTo(FL.x - 20, FL.y + 14); c.closePath(); c.fill(); c.fillStyle = `rgb(${150 + 105 * lampOn},${150 + 105 * lampOn},${160 + 80 * lampOn})`; c.beginPath(); c.ellipse(FL.x, FL.y, 14, 8, 0, 0, 7); c.fill();
    // after a release, the jar's charge rushes along the wire into the flash
    if (s.drainT != null && t - s.drainT < 0.3) { const k = (t - s.drainT) / 0.3; for (let i = 0; i < 8; i++) { const u = SK.clamp(k * 1.6 - i * 0.08, 0, 1); if (u <= 0 || u >= 1) continue; const L1 = FL.x - (JAR.x + JAR.w / 2), L2 = JAR.y0 + 20 - 372, d = u * (L1 + L2), x = d < L1 ? JAR.x + JAR.w / 2 + d : FL.x, y = d < L1 ? JAR.y0 + 20 : JAR.y0 + 20 - (d - L1); c.fillStyle = '#bff0ff'; c.beginPath(); c.arc(x, y, 4, 0, 7); c.fill(); } }
    // charge flowing through the pipe while held
    const open = s._hold != null && !g.done;
    if (open) { const sp = 1 - s.q; for (let i = 0; i < 6; i++) { const k = ((t * (1.5 + 4 * sp) + i / 6) % 1), x = SK.lerp(TANK.x + TANK.w / 2, JAR.x - JAR.w / 2, k); c.fillStyle = `rgba(140,220,255,${0.4 + 0.6 * sp})`; c.beginPath(); c.arc(x, PIPE_Y, 3, 0, 7); c.fill(); } }
    // the valve on the pipe
    c.save(); c.translate(150, PIPE_Y); c.rotate(open ? Math.PI / 2 : 0); c.fillStyle = '#e8323e'; c.beginPath(); c.roundRect(-24, -7, 48, 14, 7); c.fill(); c.restore(); c.fillStyle = '#8a1a24'; c.beginPath(); c.arc(150, PIPE_Y, 8, 0, 7); c.fill();
    // the jar's water and the line it must pass
    const shown = s.drainT != null && t - s.drainT < 0.25 ? s.drainQ * (1 - (t - s.drainT) / 0.25) : s.q, top = lvlY(shown, JAR.y0, JAR.y1);
    c.save(); c.beginPath(); c.roundRect(JAR.x - JAR.w / 2 + 3, JAR.y0 + 3, JAR.w - 6, JAR.y1 - JAR.y0 - 6, 10); c.clip();
    const jw = c.createLinearGradient(JAR.x - JAR.w / 2, 0, JAR.x + JAR.w / 2, 0); jw.addColorStop(0, '#2a7ad8'); jw.addColorStop(0.5, '#6ac8ff'); jw.addColorStop(1, '#2a6ac0'); c.fillStyle = jw;
    c.beginPath(); c.moveTo(JAR.x - JAR.w / 2, JAR.y1); for (let x = JAR.x - JAR.w / 2; x <= JAR.x + JAR.w / 2; x += 4) c.lineTo(x, top + (open ? Math.sin(x * 0.2 + t * 12) * 2 : 0)); c.lineTo(JAR.x + JAR.w / 2, JAR.y1); c.closePath(); c.fill(); c.restore();
    // the tank's own level, carried across as a faint line: the jar can never pass it
    c.save(); c.strokeStyle = 'rgba(140,220,255,0.35)'; c.lineWidth = 2; c.setLineDash([3, 5]); c.beginPath(); c.moveTo(TANK.x + TANK.w / 2, TANK.y0 + 6); c.lineTo(JAR.x + JAR.w / 2, TANK.y0 + 6); c.stroke(); c.restore();
    if (!g.done || won) { const ly = lvlY(sh.need, JAR.y0, JAR.y1), past = s.q >= sh.need; c.save(); c.strokeStyle = past ? '#7aff9a' : '#ffd24a'; c.lineWidth = 4; c.setLineDash([8, 5]); c.beginPath(); c.moveTo(JAR.x - JAR.w / 2 - 10, ly); c.lineTo(JAR.x + JAR.w / 2 + 10, ly); c.stroke(); c.restore(); c.fillStyle = past ? '#7aff9a' : '#ffd24a'; c.beginPath(); c.moveTo(JAR.x - JAR.w / 2 - 12, ly); c.lineTo(JAR.x - JAR.w / 2 - 24, ly - 8); c.lineTo(JAR.x - JAR.w / 2 - 24, ly + 8); c.closePath(); c.fill(); }
    // photos popping out of the camera, stacked along the top of the body
    s.photos.forEach((p, i) => { const k = SK.easeOut((t - p.t) / 0.35), x = 34 + (i % 5) * 52, y = 372 - k * 26; if (!p.ok && t - p.t > 0.9) return; c.save(); c.translate(x, y); c.rotate((i % 2 ? 1 : -1) * 0.08); c.fillStyle = '#fff6ea'; c.fillRect(-20, -24, 40, 46); c.fillStyle = p.ok ? '#9ad8e8' : '#1a1a22'; c.fillRect(-16, -20, 32, 30); if (p.ok) SK.animal(c, p.kind, 0, 8, 0.36, { t: 0 }); c.restore(); });
    if (!g.done && s._hold == null) SK.glow(c, g, 150, PIPE_Y, 30, '#ffe27a', { level: 2 });
    // what to do now: hold the valve to charge; let go once the water passes the gold line
    if (!g.done) { if (open && s.q >= sh.need) SK.tag(c, 'Let go!', JAR.x, JAR.y0 - 22 - Math.abs(Math.sin(t * 8)) * 4, 22, '#9affb0', 'rgba(20,90,50,0.9)'); else SK.tag(c, open ? 'Charging...' : 'Hold to charge', 136, PIPE_Y - 34, 18, open ? '#bfe6ff' : '#fff6ea');
      SK.tag(c, 'Photo ' + Math.min(s.shots.length, s.shot + 1) + ' / ' + s.shots.length, 70, 140, 18); }
    SK.tag(c, 'Battery', TANK.x, 466, 18); SK.tag(c, 'Capacitor', JAR.x, 600, 18); SK.tag(c, 'Flash', FL.x - 76, FL.y + 4, 18);
    // the beaver photographer
    SK.animal(c, 'beaver', 322, 612, 0.7, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : s.dud || lost ? 'sad' : open ? 'think' : 'happy' });
    SK.demo(g, c, 'hold', [150, PIPE_Y], null, { period: 2.0 });
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._bot = s._bot || {}; if (g.done || g.t < 1.0 || s.shot >= s.shots.length) return;
    if (B.next && g.t < B.next) return;
    if (s._hold == null) { synth('down', 230, 500); return; }
    if (s.q >= s.shots[s.shot].need + 0.03) { synth('up', 230, 500); B.next = g.t + 0.35; }
  },
});
