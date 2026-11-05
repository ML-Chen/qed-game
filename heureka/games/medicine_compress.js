// PRESS THE CHEST ON EVERY BEAT! (chem_bio MED-11) — CPR seen from the side: a person lies on their back on a mat,
// your two stacked hands rest on the middle of their chest, and an x-ray view shows the heart between the breastbone
// and the spine, an artery up the neck and the brain in the head. A beat ring closes on your hands with a drum, 100 to
// 120 times a minute. Tap on each beat: your arms push down, the chest squashes and springs back, the heart is
// squeezed and a pulse of red blood runs up to the brain, which turns from grey to pink. A gauge shows your push speed
// ("Too slow / Good / Too fast"). Too-fast pushes don't let the chest spring back, so the heart can't refill and only a
// trickle moves; too-slow pushes let the brain use up its oxygen between pulses. Level 2: the beat ring and drum stop
// after a few beats, so you keep the rhythm yourself with the gauge.
const CPR = (() => {
  const BACK = 500, CX = 232, TOP0 = 426, HEAD = [62, 460], BRAIN = [56, 450];
  const BPM = [100, 108, 114, 120], GOOD = [0.43, 0.7]; // seconds between pushes that count as good (86 to 140 a minute)
  const SET = [ // four places, each with its own floor, mat, sleeve and coach
    { wall: ['#cfe6f2', '#e8f4f8'], floor: '#d8b88a', mat: '#4a8ac8', sleeve: '#e8665a', coach: 'beaver', shirt: '#5a8ae0' },
    { wall: ['#bfe3c0', '#e8f6dc'], floor: '#7ab85a', mat: '#e8a040', sleeve: '#5a7ad8', coach: 'rabbit', shirt: '#c868a8' },
    { wall: ['#bfe0f8', '#f8ecd0'], floor: '#e8d0a0', mat: '#d85a7a', sleeve: '#3aa8a0', coach: 'penguin', shirt: '#f0b040' },
    { wall: ['#e8dcf4', '#f8f0f8'], floor: '#b8a0c8', mat: '#3a9a7a', sleeve: '#f0a030', coach: 'fox', shirt: '#4aa0b8' },
  ];
  // the top of the body seen from the side, at x, with the chest pushed down by d at the hands
  const KEY = [[96, 474], [128, 462], [160, 438], [200, 428], [CX, TOP0], [270, 430], [310, 440], [372, 446]];
  function top(x, d) {
    let y = KEY[KEY.length - 1][1];
    for (let i = 0; i < KEY.length - 1; i++) if (x <= KEY[i + 1][0]) { const [x0, y0] = KEY[i], [x1, y1] = KEY[i + 1], f = SK.clamp((x - x0) / (x1 - x0), 0, 1), e = (1 - Math.cos(f * Math.PI)) / 2; y = y0 + (y1 - y0) * e; break; }
    return y + d * Math.exp(-Math.pow((x - CX) / 52, 2));
  }
  const ART = [[214, 456], [176, 470], [134, 478], [104, 474], [80, 462], [62, 454]];
  const artAt = k => { const n = ART.length - 1, i = Math.min(n - 1, Math.floor(k * n)), f = k * n - i; return [SK.lerp(ART[i][0], ART[i + 1][0], f), SK.lerp(ART[i][1], ART[i + 1][1], f)]; };
  function paint(o, v) {
    const S = SET[v], bg = o.createLinearGradient(0, 0, 0, BACK); bg.addColorStop(0, S.wall[0]); bg.addColorStop(1, S.wall[1]); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    if (v === 0) { o.strokeStyle = 'rgba(255,255,255,0.45)'; o.lineWidth = 2; for (let x = 0; x < 360; x += 45) { o.beginPath(); o.moveTo(x, 0); o.lineTo(x, BACK); o.stroke(); } }
    if (v === 1) { P.hills(o, 360, 470, 40, '#9ad07a', '#7ab85a', { seed: 5 }); }
    if (v === 2) { o.fillStyle = '#5ab8e8'; o.fillRect(0, 430, 360, 40); o.fillStyle = 'rgba(255,255,255,0.5)'; for (let x = 0; x < 360; x += 30) { o.beginPath(); o.ellipse(x + 10, 440, 10, 2, 0, 0, 7); o.fill(); } }
    if (v === 3) { o.fillStyle = 'rgba(255,255,255,0.5)'; for (let i = 0; i < 3; i++) { o.beginPath(); o.roundRect(250 + i * 0, 150 + i * 70, 80, 50, 8); o.fill(); } }
    const fl = o.createLinearGradient(0, BACK, 0, 640); fl.addColorStop(0, S.floor); fl.addColorStop(1, P.shade(S.floor, -0.25)); o.fillStyle = fl; o.fillRect(0, BACK - 6, 360, 646 - BACK);
    o.fillStyle = S.mat; o.beginPath(); o.roundRect(6, BACK - 4, 360, 18, 6); o.fill(); o.fillStyle = P.shade(S.mat, -0.3); o.fillRect(6, BACK + 10, 360, 5);
    P.grain(o, 360, 640, 0.03);
  }
  // your hands, stacked, fingers laced, heel of the lower hand on the breastbone; arms straight down from above
  function arms(c, hy, sleeve) {
    const ax = CX + 2;
    c.fillStyle = P.shade(sleeve, -0.25); c.strokeStyle = P.shade(sleeve, -0.5); c.lineWidth = 2.5; c.beginPath(); c.roundRect(ax - 2, 120, 36, hy - 226, 14); c.fill(); c.stroke();
    c.fillStyle = '#d8a888'; c.strokeStyle = '#8a5a4a'; c.beginPath(); c.roundRect(ax + 2, hy - 116, 26, 92, 12); c.fill(); c.stroke();
    c.fillStyle = '#e8b898'; c.strokeStyle = '#8a5a4a'; c.lineWidth = 2.5;
    c.beginPath(); c.roundRect(ax - 15, hy - 120, 30, 100, 12); c.fill(); c.stroke(); // forearms (one in front of the other)
    c.fillStyle = sleeve; c.strokeStyle = P.shade(sleeve, -0.45); c.beginPath(); c.roundRect(ax - 20, 120, 40, hy - 222, 14); c.fill(); c.stroke();
    c.fillStyle = P.shade(sleeve, 0.2); c.beginPath(); c.roundRect(ax - 22, hy - 116, 44, 18, 8); c.fill(); c.stroke(); // cuff
    // lower hand: flat, heel down
    c.fillStyle = '#f0c4a4'; c.strokeStyle = '#8a5a4a'; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(ax + 14, hy - 22); c.lineTo(ax + 18, hy - 2); c.quadraticCurveTo(ax + 10, hy + 2, ax - 6, hy); c.lineTo(ax - 40, hy - 4); c.quadraticCurveTo(ax - 50, hy - 10, ax - 40, hy - 16); c.lineTo(ax - 10, hy - 22); c.closePath(); c.fill(); c.stroke();
    // upper hand on top, its fingers wrapped down over the lower hand
    c.fillStyle = '#f6d0b4'; c.beginPath(); c.moveTo(ax + 16, hy - 38); c.lineTo(ax + 18, hy - 20); c.lineTo(ax - 12, hy - 18); c.quadraticCurveTo(ax - 34, hy - 20, ax - 38, hy - 28); c.quadraticCurveTo(ax - 30, hy - 40, ax - 8, hy - 40); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(138,90,74,0.8)'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(ax - 30 + i * 8, hy - 30); c.quadraticCurveTo(ax - 32 + i * 8, hy - 16, ax - 28 + i * 8, hy - 8); c.stroke(); }
  }
  function body(c, d, S, heartSq, meter) {
    // torso: a shirt from the neck to the hips
    c.save(); c.beginPath(); c.moveTo(96, BACK + 2); for (let x = 96; x <= 372; x += 4) c.lineTo(x, top(x, d)); c.lineTo(372, BACK + 2); c.closePath();
    c.fillStyle = S.shirt; c.fill(); c.strokeStyle = P.shade(S.shirt, -0.45); c.lineWidth = 3; c.stroke(); c.clip();
    // the x-ray window: breastbone under the chest, spine along the back, the heart squeezed between them
    c.fillStyle = 'rgba(255,240,240,0.72)'; c.beginPath(); c.ellipse(CX - 6, 466, 70, 40, 0, 0, 7); c.fill();
    c.strokeStyle = '#e8dccc'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); for (let x = CX - 56; x <= CX + 44; x += 4) { const y = top(x, d) + 9; x === CX - 56 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
    c.fillStyle = '#e8dccc'; for (let x = 120; x < 372; x += 17) { c.beginPath(); c.roundRect(x, BACK - 13, 13, 10, 3); c.fill(); }
    c.restore();
    // the heart sits on the spine; the push squashes it from above
    const hb = BACK - 14, ht = top(CX - 10, d) + 16, h = hb - ht;
    c.save(); c.translate(CX - 12, hb); c.scale(1 + heartSq * 0.12, h / 52);
    c.fillStyle = '#e8485a'; c.strokeStyle = '#8a1a2a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-36, -18, -30, -52, -8, -50); c.quadraticCurveTo(0, -48, 0, -42); c.quadraticCurveTo(0, -48, 8, -50); c.bezierCurveTo(30, -52, 36, -18, 0, 0); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.4)'; c.beginPath(); c.ellipse(-12, -34, 7, 4, -0.5, 0, 7); c.fill(); c.restore();
    // neck and head (face up, nose to the sky)
    c.fillStyle = '#f0c8a8'; c.strokeStyle = '#8a5a4a'; c.lineWidth = 3;
    c.beginPath(); c.roundRect(90, 452, 40, 48, 10); c.fill(); c.stroke();
    c.beginPath(); c.arc(HEAD[0], HEAD[1], 40, 0, 7); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(70, 421); c.quadraticCurveTo(80, 408, 86, 424); c.fill(); c.stroke(); // nose
    c.fillStyle = '#6a4a3a'; c.beginPath(); c.arc(HEAD[0] - 4, HEAD[1] + 6, 38, Math.PI * 0.55, Math.PI * 1.25); c.lineTo(HEAD[0] - 4, HEAD[1] + 6); c.fill(); // hair
    c.strokeStyle = '#5a3a2a'; c.lineWidth = 2.5; c.beginPath(); c.arc(92, 436, 6, 0.3, Math.PI - 0.3); c.stroke(); // closed eye
    // the brain, grey until blood brings oxygen
    c.fillStyle = P.mix('#a8a8b8', '#ff8ab0', meter); c.strokeStyle = P.mix('#6a6a7a', '#c8507a', meter); c.lineWidth = 2.5;
    c.beginPath(); c.ellipse(BRAIN[0], BRAIN[1], 25, 19, -0.2, 0, 7); c.fill(); c.stroke();
    c.lineWidth = 2; c.beginPath(); c.moveTo(BRAIN[0] - 14, BRAIN[1] - 8); c.quadraticCurveTo(BRAIN[0] - 2, BRAIN[1] - 2, BRAIN[0] - 12, BRAIN[1] + 6); c.moveTo(BRAIN[0] + 4, BRAIN[1] - 14); c.quadraticCurveTo(BRAIN[0] + 14, BRAIN[1] - 2, BRAIN[0] + 6, BRAIN[1] + 12); c.stroke();
    // the artery from the heart up the neck to the brain
    c.strokeStyle = 'rgba(200,58,74,0.85)'; c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); ART.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
  }
  // the push-speed gauge: a needle over Too slow / Good / Too fast
  const GZ = [108, 262, 56], RMIN = 50, RMAX = 170;
  const ang = r => Math.PI + SK.clamp((r - RMIN) / (RMAX - RMIN), 0, 1) * Math.PI;
  function gauge(c, rate, zone) {
    const [x, y, R] = GZ;
    c.fillStyle = 'rgba(30,20,40,0.6)'; c.beginPath(); c.roundRect(x - R - 30, y - R - 18, 2 * R + 60, R + 62, 18); c.fill();
    const lo = 60 / GOOD[1], hi = 60 / GOOD[0];
    for (const [a0, a1, col] of [[RMIN, lo, '#e8604a'], [lo, hi, '#5ac86a'], [hi, RMAX, '#f0a030']]) { c.strokeStyle = col; c.lineWidth = 16; c.lineCap = 'butt'; c.beginPath(); c.arc(x, y, R, ang(a0), ang(a1)); c.stroke(); }
    const a = ang(rate); c.strokeStyle = '#fff6ea'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * (R + 6), y + Math.sin(a) * (R + 6)); c.stroke();
    c.fillStyle = '#fff6ea'; c.beginPath(); c.arc(x, y, 7, 0, 7); c.fill();
    const lab = (t, lx, ly, on, col) => { c.save(); c.font = '900 18px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = on ? col : 'rgba(255,246,234,0.55)'; c.fillText(t, lx, ly); c.restore(); };
    lab('Good', x, y - R - 4, zone === 'good', '#8af090'); lab('Too slow', x - R + 12, y + 22, zone === 'slow', '#ff9a80'); lab('Too fast', x + R - 12, y + 22, zone === 'fast', '#ffc860');
  }
  return { BACK, CX, TOP0, HEAD, BRAIN, BPM, GOOD, SET, top, artAt, paint, arms, body, gauge };
})();

MG.add({
  id: 'medicine_compress', stage: 'medicine', cmd: 'PRESS THE CHEST ON EVERY BEAT!', time: 7, mood: 'party', winText: 'Blood reached the brain!', failText: 'No blood flow!',
  card: { title: 'Pump for the heart', kind: 'Medicine', ref: 'CPR: chest compressions',
    text: "When someone's heart stops, blood stops carrying oxygen to the brain, and brain cells start to die within minutes. Pressing hard and fast on the middle of the chest squeezes the heart between the breastbone and the spine, which pushes blood out to the brain and body.\n\nCompressions work best at 100 to 120 presses a minute, about 5 to 6 cm deep for an adult, letting the chest come all the way back up each time so the heart can fill again. Call the emergency number first.\n\nThis game is not training. Take a real first-aid course to learn CPR.",
    note: 'Pressing hard and fast on the chest, 100 to 120 times a minute, pumps blood to the brain when the heart has stopped.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level);
    s.v = SK.variant(g, 4); s.per = 60 / CPR.BPM[s.v];
    s.need = [8, 10, 11][L]; s.cueBeats = L >= 2 ? 5 : 999; s.t0 = 0.8; s.meter = 0; s.shown = 0; s.press = -9; s.last = -9; s.pulses = []; s.lastBeat = -1;
    s.rate = 0; s.zone = ''; s.zoneAt = -9;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || y < 130) return;
    const gap = g.t - s.last; s.last = g.t; s.press = g.t; g.sfx('thud');
    // a push too soon after the last one doesn't let the chest spring back, so the heart can't refill: only a trickle
    let amt = 1, zone = 'good';
    if (gap < CPR.GOOD[0]) { amt = 0.15; zone = 'fast'; } else if (gap > CPR.GOOD[1] && gap < 9) zone = 'slow';
    if (gap < 9) { s.rate = 60 / gap; s.zone = zone; s.zoneAt = g.t; }
    s.pulses.push({ t: g.t, amt });
    if (zone === 'good') g.sfx('drip'); else if (zone === 'fast') g.sfx('wrong');
  },
  update(g, dt) {
    const s = g.s;
    const k = Math.floor((g.t - s.t0) / s.per);
    if (k > s.lastBeat && g.t >= s.t0) { s.lastBeat = k; if (k < s.cueBeats && !g.done) g.sfx('drum'); }
    // each pulse of blood reaches the brain half a second after its push; between pulses the brain uses up oxygen
    for (const p of s.pulses) if (!p.done && g.t - p.t >= 0.5) { p.done = true; s.meter = Math.min(1, s.meter + p.amt / s.need); }
    if (!g.done && s.meter >= 1) { g.win(); g.sfx('cheer'); g.burst(CPR.BRAIN[0], CPR.BRAIN[1], ['#ff9ab8', '#fff6ea', '#ffd25a'], 20, 180); }
    if (g.t - s.last > 0.3 && s.meter > 0 && !g.done) s.meter = Math.max(0, s.meter - dt * 0.6 / s.need);
    s.shown += (s.meter - s.shown) * Math.min(1, dt * 8);
    // the needle sinks toward "Too slow" while you wait
    if (s.last > 0 && g.t - s.last > 60 / s.rate) { s.rate = Math.max(40, 60 / (g.t - s.last)); if (s.rate < 60 / CPR.GOOD[1]) s.zone = 'slow'; }
  },
  draw(g, c) {
    const s = g.s, t = g.t, S = CPR.SET[s.v], won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('medicine_compress_' + s.v, o => CPR.paint(o, s.v)), 0, 0, 360, 640);
    // the push: down fast, then the chest springs all the way back up
    const e = t - s.press, d = e < 0.08 ? (e / 0.08) * 20 : Math.max(0, 20 * (1 - (e - 0.08) / 0.2));
    CPR.body(c, d, S, d / 20, s.shown);
    // pulses of blood running up the artery (a too-fast push only moves a trickle)
    for (const p of s.pulses) { const k = (t - p.t) / 0.5; if (k > 1 || k < 0) continue; const [x, y] = CPR.artAt(k), r = p.amt < 1 ? 3.5 : 8; c.fillStyle = p.amt < 1 ? '#8a2a3a' : '#ff2a3a'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); if (p.amt >= 1) { c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.arc(x - 2, y - 2, 2.5, 0, 7); c.fill(); } }
    // how much oxygen the brain has: a ring around the head fills
    c.save(); c.strokeStyle = 'rgba(30,20,40,0.35)'; c.lineWidth = 6; c.beginPath(); c.arc(CPR.HEAD[0], CPR.HEAD[1], 48, 0, 7); c.stroke();
    c.strokeStyle = '#ff6a9a'; c.lineCap = 'round'; c.beginPath(); c.arc(CPR.HEAD[0], CPR.HEAD[1], 48, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0.001, s.shown)); c.stroke(); c.restore();
    const hy = CPR.top(CPR.CX, d);
    // the beat ring closes on your hands on each beat (stops after a few beats at level 2)
    const beat = (t - s.t0) / s.per, kb = Math.floor(beat), ph = beat - kb, cueA = t < s.t0 ? 0 : kb < s.cueBeats ? 1 : Math.max(0, 1 - (beat - s.cueBeats) * 1.5);
    if (cueA > 0 && !g.done) { c.save(); c.globalAlpha = cueA; c.strokeStyle = '#ffe27a'; c.lineWidth = 5; c.beginPath(); c.arc(CPR.CX - 10, CPR.TOP0 - 14, 76 - ph * 42, 0, 7); c.stroke(); if (ph < 0.12 || ph > 0.92) { c.fillStyle = 'rgba(255,226,122,0.4)'; c.beginPath(); c.arc(CPR.CX - 10, CPR.TOP0 - 14, 36, 0, 7); c.fill(); } c.restore(); }
    CPR.arms(c, hy, S.sleeve);
    if (!g.done && cueA <= 0) SK.glow(c, g, CPR.CX - 10, CPR.TOP0 - 16, 38, '#ffe27a', { level: 2 });
    CPR.gauge(c, s.last > 0 ? s.rate : 50, t - s.zoneAt < 9 ? s.zone : '');
    SK.tag(c, 'Brain', CPR.HEAD[0] + 2, 392, 18); SK.tag(c, 'Chest', 318, 404, 18);
    c.strokeStyle = 'rgba(30,20,40,0.6)'; c.lineWidth = 2; c.beginPath(); c.moveTo(286, 548); c.lineTo(CPR.CX - 4, 478); c.stroke(); SK.tag(c, 'Heart', 300, 556, 18);
    SK.animal(c, S.coach, 84, 600, 0.9, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'think' });
    SK.demo(g, c, 'tap', [CPR.CX - 6, CPR.TOP0 - 24], null, { period: s.per, delay: s.t0 - 0.45 * s.per });
  },
  // the bot: press on every beat
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < s.t0 - 0.05) return; const k = Math.round((g.t - s.t0) / s.per);
    if (s._k !== k && Math.abs(g.t - (s.t0 + k * s.per)) < 0.02) { s._k = k; synth('down', CPR.CX, CPR.TOP0 - 20); synth('up', CPR.CX, CPR.TOP0 - 20); }
  },
});
