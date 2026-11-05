// COMPRESS! (chem_bio MED-11) — a CPR training dummy on a mat, seen from above, with its heart, an artery and the brain
// drawn on its see-through chest. A ring on the chest pulses to the beat (110 a minute) with a drum. Tap the chest on
// each beat: the beaver's paws push down, the heart squeezes and a pulse of red blood runs up the artery to the brain,
// which turns from grey to pink as the oxygen meter fills. Off-beat or too-slow presses make the flow sputter and the
// meter sinks. Level 2: the ring and drum stop after a few beats, so you keep the rhythm yourself.
const PER = 60 / 110, HEART = [180, 350], BRAIN = [180, 178], HANDS = [180, 404];
const ART = [[188, 326], [206, 286], [216, 240], [218, 200], [208, 176]];
const artAt = k => { const n = ART.length - 1, i = Math.min(n - 1, Math.floor(k * n)), f = k * n - i; return [SK.lerp(ART[i][0], ART[i + 1][0], f), SK.lerp(ART[i][1], ART[i + 1][1], f)]; };

function paintMat(o) {
  const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#c8e8f0'); bg.addColorStop(1, '#a0d0e0'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  // gym floor boards and a blue mat
  o.strokeStyle = 'rgba(255,255,255,0.35)'; o.lineWidth = 2; for (let x = 0; x < 360; x += 40) { o.beginPath(); o.moveTo(x, 0); o.lineTo(x, 640); o.stroke(); }
  o.fillStyle = '#4a8ac8'; o.beginPath(); o.roundRect(40, 116, 280, 480, 26); o.fill(); o.fillStyle = '#5a9ad8'; o.beginPath(); o.roundRect(50, 126, 260, 460, 22); o.fill();
  // the dummy: head, neck, torso, arms (pale training-dummy skin)
  const sk = '#f4dcc4', ink = '#9a7a6a'; o.fillStyle = sk; o.strokeStyle = ink; o.lineWidth = 3;
  o.beginPath(); o.roundRect(98, 258, 164, 270, 50); o.fill(); o.stroke(); // torso
  for (const s of [-1, 1]) { o.beginPath(); o.roundRect(180 + s * 104 - 18, 270, 36, 210, 18); o.fill(); o.stroke(); }
  o.beginPath(); o.roundRect(160, 222, 40, 50, 12); o.fill(); o.stroke();
  o.beginPath(); o.ellipse(180, 182, 52, 58, 0, 0, 7); o.fill(); o.stroke();
  // face: closed eyes, a simple mouth
  o.strokeStyle = '#7a5a4a'; o.lineWidth = 2.5; for (const s of [-1, 1]) { o.beginPath(); o.arc(180 + s * 18, 196, 7, 0.2, Math.PI - 0.2); o.stroke(); }
  o.beginPath(); o.moveTo(170, 218); o.lineTo(190, 218); o.stroke();
  // see-through chest window
  o.fillStyle = 'rgba(255,240,240,0.75)'; o.beginPath(); o.roundRect(124, 290, 112, 170, 36); o.fill(); o.strokeStyle = 'rgba(154,122,106,0.6)'; o.lineWidth = 2; o.stroke();
  // ribs
  o.strokeStyle = 'rgba(220,200,190,0.9)'; o.lineWidth = 4; for (let i = 0; i < 4; i++) for (const s of [-1, 1]) { o.beginPath(); o.moveTo(180 + s * 8, 304 + i * 36); o.quadraticCurveTo(180 + s * 54, 300 + i * 36, 180 + s * 50, 326 + i * 36); o.stroke(); }
  o.fillStyle = 'rgba(220,200,190,0.9)'; o.fillRect(176, 298, 8, 120); // breastbone
}

MG.add({
  id: 'medicine_compress', stage: 'medicine', cmd: 'PRESS THE CHEST ON EVERY BEAT!', time: 7, mood: 'party', winText: 'Blood reached the brain!', failText: 'No blood flow!',
  card: { title: 'Pump for the heart', kind: 'Medicine', ref: 'CPR: chest compressions',
    text: "When someone's heart stops, blood stops carrying oxygen to the brain, and brain cells start to die within minutes. Pressing hard and fast on the middle of the chest squeezes the heart and the chest, which pushes blood out to the brain and body.\n\nCompressions work best at 100 to 120 presses a minute, about 5 to 6 cm deep for an adult, letting the chest come all the way back up each time. Call the emergency number first.\n\nThis game is not training. Take a real first-aid course to learn CPR.",
    note: 'Pressing hard and fast on the chest, 100 to 120 times a minute, pumps blood to the brain when the heart has stopped.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level);
    s.need = [8, 10, 11][L]; s.cueBeats = L >= 2 ? 5 : 999; s.t0 = 0.8; s.meter = 0; s.press = -9; s.pulses = []; s.lastBeat = -1; s.used = {}; s.spurt = -9; s.good = 0;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    s.press = g.t; g.sfx('thud');
    const k = Math.round((g.t - s.t0) / PER), off = Math.abs(g.t - (s.t0 + k * PER));
    if (k >= 0 && off < 0.13 && !s.used[k]) { s.used[k] = 1; s.good++; s.meter = Math.min(1, s.meter + 1 / s.need); s.pulses.push({ t: g.t }); g.sfx('drip'); }
    else { s.meter = Math.max(0, s.meter - 0.5 / s.need); s.spurt = g.t; g.sfx('wrong'); }
  },
  update(g, dt) {
    const s = g.s;
    // the beat: a drum on each beat while the cue lasts; a missed beat lets the meter sink
    const k = Math.floor((g.t - s.t0) / PER);
    if (k > s.lastBeat && g.t >= s.t0) { s.lastBeat = k; if (k < s.cueBeats && !g.done) g.sfx('drum'); if (k - 1 >= 0 && !s.used[k - 1] && s.meter > 0 && !g.done) { s.meter = Math.max(0, s.meter - 0.35 / s.need); s.spurt = g.t; } }
    if (!g.done && s.meter >= 1) { g.win(); g.sfx('cheer'); g.burst(BRAIN[0], BRAIN[1], ['#ff9ab8', '#fff6ea', '#ffd25a'], 20, 180); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('medicine_compress_mat', paintMat), 0, 0, 360, 640);
    const pk = SK.clamp(1 - (t - s.press) / 0.22, 0, 1), sq = Math.sin(pk * Math.PI / 2);
    // the brain, grey until blood brings oxygen
    c.fillStyle = P.mix('#b8b8c8', '#ff9ab8', s.meter); c.strokeStyle = P.mix('#8a8a9a', '#c8507a', s.meter); c.lineWidth = 2;
    c.beginPath(); c.ellipse(BRAIN[0], BRAIN[1] - 10, 34, 24, 0, 0, 7); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(BRAIN[0], BRAIN[1] - 32); c.lineTo(BRAIN[0], BRAIN[1] + 12); c.moveTo(BRAIN[0] - 22, BRAIN[1] - 16); c.quadraticCurveTo(BRAIN[0] - 10, BRAIN[1] - 4, BRAIN[0] - 24, BRAIN[1]); c.moveTo(BRAIN[0] + 22, BRAIN[1] - 16); c.quadraticCurveTo(BRAIN[0] + 10, BRAIN[1] - 4, BRAIN[0] + 24, BRAIN[1]); c.stroke();
    // the artery from the heart up the neck to the brain
    c.strokeStyle = '#c83a4a'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); ART.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
    // pulses of blood running up it
    for (const p of s.pulses) { const k = (t - p.t) / 0.5; if (k > 1 || k < 0) continue; const [x, y] = artAt(k); c.fillStyle = '#ff2a3a'; c.beginPath(); c.arc(x, y, 7, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.arc(x - 2, y - 2, 2.5, 0, 7); c.fill(); }
    if (t - s.spurt < 0.4) { const k = (t - s.spurt) / 0.4; c.fillStyle = `rgba(160,40,60,${0.7 * (1 - k)})`; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(ART[1][0] + i * 4, ART[1][1] - k * 20 - i * 8, 3, 0, 7); c.fill(); } }
    // the heart, squeezed by each press
    c.save(); c.translate(HEART[0], HEART[1]); c.scale(1 + sq * 0.12, 1 - sq * 0.22);
    c.fillStyle = '#e8485a'; c.strokeStyle = '#8a1a2a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, 26); c.bezierCurveTo(-40, 2, -30, -30, -8, -24); c.quadraticCurveTo(0, -20, 0, -14); c.quadraticCurveTo(0, -20, 8, -24); c.bezierCurveTo(30, -30, 40, 2, 0, 26); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.4)'; c.beginPath(); c.ellipse(-12, -10, 7, 4, -0.5, 0, 7); c.fill(); c.restore();
    // the beat cue ring on the chest (fades away after a few beats at level 2)
    const beat = (t - s.t0) / PER, kb = Math.floor(beat), ph = beat - kb, cueA = t < s.t0 ? 0 : kb < s.cueBeats ? 1 : Math.max(0, 1 - (beat - s.cueBeats) * 1.5);
    if (cueA > 0 && !g.done) { c.save(); c.globalAlpha = cueA; c.strokeStyle = '#ffe27a'; c.lineWidth = 4; c.beginPath(); c.arc(HANDS[0], HANDS[1], 60 - ph * 34, 0, 7); c.stroke(); if (ph < 0.15 || ph > 0.9) { c.fillStyle = 'rgba(255,226,122,0.35)'; c.beginPath(); c.arc(HANDS[0], HANDS[1], 30, 0, 7); c.fill(); } c.restore(); }
    // the beaver kneeling at the side, arms straight down onto the chest
    const push = sq * 10;
    SK.animal(c, 'beaver', 302, 604, 1.45, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'think', facing: -1 });
    c.strokeStyle = '#8a5a3a'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(288, 534); c.quadraticCurveTo(250, 470 + push, HANDS[0] + 14, HANDS[1] - 6 + push); c.stroke();
    c.strokeStyle = '#b07a4a'; c.lineWidth = 8; c.stroke();
    c.globalAlpha = 0.9; for (const [dx, dy] of [[0, 4], [-4, -6]]) { c.fillStyle = '#b07a4a'; c.strokeStyle = '#6a4a2a'; c.lineWidth = 2.5; c.beginPath(); c.ellipse(HANDS[0] + dx, HANDS[1] + dy + push, 22, 15, 0, 0, 7); c.fill(); c.stroke(); } c.globalAlpha = 1;
    // the oxygen meter beside the head
    c.fillStyle = 'rgba(30,40,60,0.5)'; c.beginPath(); c.roundRect(290, 140, 22, 110, 11); c.fill();
    c.fillStyle = P.mix('#8a9ab0', '#ff6a8a', s.meter); c.beginPath(); c.roundRect(293, 247 - 104 * s.meter, 16, 104 * s.meter, 8); c.fill();
    if (!g.done) SK.glow(c, g, HANDS[0], HANDS[1], 34);
    // demo: tap on the next beat
    SK.tag(c, 'Heart', 76, HEART[1], 18); SK.tag(c, 'Brain', 76, BRAIN[1] - 10, 18);
    SK.demo(g, c, 'tap', [HANDS[0] + 4, HANDS[1] + 4], null, { period: PER, delay: s.t0 - 0.45 * PER });
  },
  // the bot: press on every beat
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < s.t0 - 0.05) return; const k = Math.round((g.t - s.t0) / PER);
    if (!s.used[k] && Math.abs(g.t - (s.t0 + k * PER)) < 0.02) { synth('down', HANDS[0], HANDS[1]); synth('up', HANDS[0], HANDS[1]); }
  },
});
