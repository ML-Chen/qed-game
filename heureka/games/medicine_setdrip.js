// SET DRIP! (chem_bio MED-03) — a hospital room at night. A drip bag hangs on a pole; drops fall through its little
// chamber and down a tube into the patient's arm. A roller clamp on the tube sets how fast it drips: slide it up for
// more drops. The patient's kidneys clear the medicine all the time, faster the more there is (drops fall out of the
// bed into a bag). A bedside monitor draws the medicine level as a line over time, with a green band.
// Set the drip: the level climbs and then flattens, once as much goes in as comes out. Hold it in the green band and
// the patient feels better; the next patient's body clears it faster, so they need a faster drip. Open it wide and
// the level climbs into the red: the patient turns green and wobbles.
// The model is the real one: change in level = drip rate - clearance x level, so the level settles at drip / clearance.
// Level 0-1: two patients. Level 2: three, each clearing it faster.
const SD = (() => {
  const TR = { x: 64, y0: 520, y1: 316 }, RMAX = 2.0, MON = { x: 150, y: 136, w: 196, h: 150 }, BAND = [0.46, 0.66];
  const SETS = [ // four wards: wall colour, blanket colour, and the patients (with how fast their kidneys clear it)
    { wall: ['#1e2a4a', '#2e3e66'], blanket: '#e87aa0', pts: [['rabbit', 1.0], ['penguin', 1.5], ['fox', 2.0]] },
    { wall: ['#24324a', '#38506a'], blanket: '#7ab0e8', pts: [['hedgehog', 1.1], ['duck', 1.6], ['beaver', 2.1]] },
    { wall: ['#2a2444', '#463a66'], blanket: '#f0b84a', pts: [['frog', 0.95], ['owl', 1.45], ['rabbit', 1.95]] },
    { wall: ['#1e3438', '#2e5052'], blanket: '#a07ae0', pts: [['fox', 1.05], ['hedgehog', 1.55], ['penguin', 2.05]] },
  ];
  const rY = r => TR.y0 + (TR.y1 - TR.y0) * r / RMAX, yR = y => SK.clamp((y - TR.y0) / (TR.y1 - TR.y0), 0, 1) * RMAX;
  const mY = v => MON.y + MON.h - 12 - (MON.h - 24) * SK.clamp(v, 0, 1);
  function paint(o, S) {
    N4.vgrad(o, 0, 0, 360, 640, S.wall);
    o.fillStyle = 'rgba(255,255,255,0.04)'; for (let x = 0; x < 360; x += 40) o.fillRect(x, 0, 20, 470);
    // a window with the moon
    o.fillStyle = '#0e1430'; o.beginPath(); o.roundRect(14, 128, 104, 110, 10); o.fill(); P.stars(o, 360, 240, 20, 3, 0);
    o.fillStyle = S.wall[1]; o.fillRect(0, 0, 14, 260); o.fillRect(118, 0, 32, 260); o.fillRect(0, 0, 150, 128); o.fillRect(0, 238, 150, 30);
    o.fillStyle = '#fff4d0'; o.beginPath(); o.arc(90, 160, 13, 0, 7); o.fill(); o.fillStyle = '#0e1430'; o.beginPath(); o.arc(96, 156, 11, 0, 7); o.fill();
    o.strokeStyle = 'rgba(255,255,255,0.25)'; o.lineWidth = 4; o.beginPath(); o.roundRect(14, 128, 104, 110, 10); o.stroke();
    N4.vgrad(o, 0, 470, 360, 170, ['#3a4a5a', '#2a3644']); o.fillStyle = 'rgba(255,255,255,0.05)'; for (let x = 0; x < 360; x += 48) o.fillRect(x, 470, 2, 170);
    // the bed frame
    o.fillStyle = '#c8d0dc'; o.fillRect(154, 556, 8, 48); o.fillRect(338, 556, 8, 48); o.fillStyle = '#9aa4b4'; o.fillRect(150, 540, 200, 18);
    o.fillStyle = '#e8eef4'; o.beginPath(); o.roundRect(146, 428, 12, 120, 6); o.fill();
    // the drip pole
    o.fillStyle = '#b8c0cc'; o.fillRect(TR.x + 30, 140, 6, 460); o.fillRect(TR.x + 10, 596, 46, 6); o.fillRect(TR.x + 14, 140, 38, 5);
    P.grain(o, 360, 640, 0.03);
  }
  function monitor(c, g, s) {
    const { x, y, w, h } = MON, lo = mY(s.lo), hi = mY(s.hi), t = g.t;
    c.fillStyle = '#c8d0dc'; c.fillRect(x + w / 2 - 4, y + h, 8, 26);
    c.fillStyle = '#3a4250'; c.beginPath(); c.roundRect(x - 8, y - 8, w + 16, h + 16, 14); c.fill();
    c.fillStyle = '#081420'; c.beginPath(); c.roundRect(x, y, w, h, 8); c.fill();
    c.save(); c.beginPath(); c.roundRect(x, y, w, h, 8); c.clip();
    c.fillStyle = 'rgba(255,70,70,0.22)'; c.fillRect(x, y, w, hi - y);
    c.fillStyle = 'rgba(70,220,120,0.3)'; c.fillRect(x, hi, w, lo - hi);
    c.strokeStyle = 'rgba(120,255,170,0.12)'; c.lineWidth = 1; for (let gx = x + 20; gx < x + w; gx += 24) { c.beginPath(); c.moveTo(gx, y); c.lineTo(gx, y + h); c.stroke(); }
    // the level trace, newest at the right
    const H = s.hist, n = H.length, dx = (w - 22) / 90; c.strokeStyle = '#8affc0'; c.lineWidth = 3; c.lineJoin = 'round'; c.beginPath();
    for (let i = 0; i < n; i++) { const px = x + w - 22 - (n - 1 - i) * dx, py = mY(H[i]); i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke();
    const cy = mY(s.lv), col = s.lv > s.hi ? '#ff6a6a' : s.lv >= s.lo ? '#8affc0' : '#ffd45a';
    c.fillStyle = col; c.beginPath(); c.arc(x + w - 22, cy, 7, 0, 7); c.fill(); c.strokeStyle = '#081420'; c.lineWidth = 2; c.stroke();
    // where it is heading (drip / clearance): a dashed line, at levels 0-1
    if (g.level <= 1 && !g.done && s.phase === 'drip') { const ty = mY(s.r / s.k); c.save(); c.strokeStyle = s.r / s.k > s.hi ? '#ff8a8a' : s.r / s.k >= s.lo ? '#c8ffd8' : '#ffe08a'; c.lineWidth = 2.5; c.setLineDash([6, 5]); c.lineDashOffset = -t * 20; c.beginPath(); c.moveTo(x + 8, ty); c.lineTo(x + w - 8, ty); c.stroke(); c.restore(); }
    c.restore();
    c.strokeStyle = '#1e7a4e'; c.lineWidth = 2; for (const yy of [lo, hi]) { c.beginPath(); c.moveTo(x, yy); c.lineTo(x + w, yy); c.stroke(); }
  }
  function bag(c, t) {
    const x = TR.x, y = 150;
    c.fillStyle = 'rgba(230,240,255,0.85)'; c.strokeStyle = '#8aa0c0'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 26, y); c.lineTo(x + 26, y); c.quadraticCurveTo(x + 30, y + 60, x + 14, y + 84); c.lineTo(x - 14, y + 84); c.quadraticCurveTo(x - 30, y + 60, x - 26, y); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,190,90,0.75)'; c.beginPath(); c.moveTo(x - 24, y + 28); c.lineTo(x + 24, y + 28); c.quadraticCurveTo(x + 27, y + 60, x + 13, y + 82); c.lineTo(x - 13, y + 82); c.quadraticCurveTo(x - 27, y + 60, x - 24, y + 28); c.closePath(); c.fill();
    c.fillStyle = '#8aa0c0'; c.fillRect(x - 4, y + 84, 8, 12);
    // the drip chamber
    c.fillStyle = 'rgba(230,240,255,0.6)'; c.strokeStyle = '#8aa0c0'; c.beginPath(); c.roundRect(x - 11, y + 96, 22, 46, 8); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,190,90,0.6)'; c.fillRect(x - 9, y + 130, 18, 10);
  }
  function roller(c, g, s) {
    const x = TR.x, y = rY(s.r);
    c.fillStyle = '#e8eef8'; c.strokeStyle = '#3a4a6a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(x - 22, TR.y1 - 20, 44, TR.y0 - TR.y1 + 40, 14); c.fill(); c.stroke(); // the clamp body
    c.fillStyle = '#c8d0e0'; c.fillRect(x - 3, TR.y1 - 12, 6, TR.y0 - TR.y1 + 24);
    // the roller wheel
    c.fillStyle = '#4a8ae8'; c.strokeStyle = '#1a3a7a'; c.beginPath(); c.roundRect(x - 26, y - 14, 52, 28, 10); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 2; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(x - 20, y + i * 5); c.lineTo(x + 20, y + i * 5); c.stroke(); }
    N4.text(c, '+', x, TR.y1 - 36, 22, '#8affc0'); N4.text(c, '–', x, TR.y0 + 36, 22, '#ffb08a');
  }
  return { TR, RMAX, MON, BAND, SETS, rY, yR, mY, paint, monitor, bag, roller };
})();
MG.add({
  id: 'medicine_setdrip', stage: 'medicine', cmd: 'SET THE DRIP TO HOLD GREEN!', time: 7, mood: 'night', winText: 'Steady level!', failText: 'Too much!',
  card: { title: 'In equals out', kind: 'Medicine', ref: 'Steady state of an IV infusion',
    text: 'A drip puts medicine into the blood at a steady rate. At the same time the kidneys and liver take some out. The more medicine there is, the faster they remove it.\n\nSo the level climbs, then slows, then flattens out. It stops rising once as much leaves each minute as drips in. That flat level is called the steady state.\n\nA faster drip gives a higher steady level. A patient who clears it faster needs a faster drip to reach the same level. Nurses set the drip so the level sits in the safe range.',
    note: 'With a steady drip in and the body clearing some out, the level rises and then holds where in equals out.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.S = SD.SETS[s.v];
    s.lo = SD.BAND[0] + (L >= 1 ? 0.02 : 0); s.hi = SD.BAND[1] - (L >= 1 ? 0.02 : 0);
    s.queue = L >= 2 ? s.S.pts.slice() : s.S.pts.slice(0, 2); s.i = 0; s.r = 0; s.lv = 0; s.hist = []; s.histT = 0;
    s.k = s.queue[0][1]; s.phase = 'drip'; s.okT = 0; s.inPh = 0; s.outPh = 0; s.dIn = []; s.dOut = []; s.nextT = 0; s.cheerT = -9;
    s.roller = { x: SD.TR.x, y: SD.rY(0) };
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    if (Math.abs(x - SD.TR.x) < 46 && y > SD.TR.y1 - 40 && y < SD.TR.y0 + 40) { s.roller.y = SD.rY(s.r); SK.dragStart(g, s.roller, x, Math.abs(y - s.roller.y) < 30 ? y : s.roller.y); g.sfx('click'); }
  },
  move(g, x, y) { const s = g.s, o = SK.dragMove(g, x, y); if (o) { s.r = SD.yR(o.y); } },
  up(g) { SK.dragEnd(g); },
  update(g, dt) {
    const s = g.s;
    if (s.phase === 'next' && g.t >= s.nextT) { s.i++; s.k = s.queue[s.i][1]; s.lv = 0; s.hist = []; s.phase = 'drip'; s.okT = 0; g.sfx('pop'); }
    // the level: drip in, the kidneys clear a share of what is there
    for (let i = 0; i < 4; i++) s.lv = Math.max(0, s.lv + (s.r - s.k * s.lv) * dt / 4);
    s.histT += dt; if (s.histT > 1 / 30) { s.histT = 0; s.hist.push(s.lv); if (s.hist.length > 90) s.hist.shift(); }
    // drops: in through the chamber at the drip rate, out of the bed at the clearance rate
    s.inPh += s.r * 3.2 * dt; while (s.inPh >= 1) { s.inPh -= 1; s.dIn.push(g.t); }
    s.outPh += s.k * s.lv * 3.2 * dt; while (s.outPh >= 1) { s.outPh -= 1; s.dOut.push(g.t); }
    s.dIn = s.dIn.filter(t0 => g.t - t0 < 0.35); s.dOut = s.dOut.filter(t0 => g.t - t0 < 0.45);
    if (g.done || s.phase !== 'drip') return;
    if (s.lv > 0.94) { g.sfx('boing'); g.sfx('laugh'); g.fail(); return; }
    const steady = Math.abs(s.r - s.k * s.lv) < 0.07, inB = s.lv >= s.lo && s.lv <= s.hi;
    if (inB && steady) { if (!s.okT) { s.okT = g.t; g.sfx('chime'); } if (g.t - s.okT > 0.9) {
      s.cheerT = g.t; g.burst(270, 470, ['#8affb0', '#fff6ea', '#ffd45a'], 16, 150);
      if (s.i >= s.queue.length - 1) { s.phase = 'won'; g.sfx('cheer'); g.win(); } else { s.phase = 'next'; s.nextT = g.t + 0.6; g.sfx('ding'); } } }
    else s.okT = 0;
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', TR = SD.TR;
    c.drawImage(g.bake('setdrip_bg' + s.v, o => SD.paint(o, s.S)), 0, 0, 360, 640);
    SD.monitor(c, g, s); SK.tag(c, 'Medicine level', SD.MON.x + SD.MON.w / 2, SD.MON.y + SD.MON.h + 40, 18);
    SK.tag(c, (s.i + 1) + ' / ' + s.queue.length, 318, 364, 18);
    // the tube: from the chamber, through the clamp, round to the patient's arm
    c.strokeStyle = 'rgba(230,240,255,0.75)'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(TR.x, 292); c.lineTo(TR.x, TR.y0 + 30); c.quadraticCurveTo(TR.x, 580, 130, 560); c.quadraticCurveTo(200, 540, 226, 494); c.stroke();
    SD.bag(c, t); SK.tag(c, 'Drip', TR.x, 132, 18);
    for (const t0 of s.dIn) { const k = (t - t0) / 0.35; c.fillStyle = '#ffc070'; c.beginPath(); c.ellipse(TR.x, 248 + k * 34, 3, 4.5, 0, 0, 7); c.fill(); }
    SD.roller(c, g, s);
    // the patient, sitting up in bed under a blanket; a green tinge and a wobble when the level is too high
    const P0 = s.queue[s.i], red = s.lv > s.hi, inB = s.lv >= s.lo && !red, cheer = t - s.cheerT < 0.6 || won;
    c.save(); if (red) { c.translate(270, 520); c.rotate(Math.sin(t * 8) * 0.08 * SK.clamp((s.lv - s.hi) / 0.2, 0, 1)); c.translate(-270, -520); }
    SK.animal(c, P0[0], 262, 508, 1.5, { t, pose: cheer ? 'cheer' : 'idle', expr: red ? 'wow' : cheer ? 'laugh' : inB ? 'happy' : 'sad', tint: red && s.lv > s.hi + 0.12 ? '#a8d878' : undefined, noShadow: true });
    c.restore();
    c.fillStyle = s.S.blanket; c.strokeStyle = P.shade(s.S.blanket, -0.4); c.lineWidth = 3; c.beginPath(); c.moveTo(152, 492); c.quadraticCurveTo(250, 470, 352, 488); c.lineTo(352, 546); c.lineTo(152, 546); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.25)'; c.fillRect(152, 500, 200, 6);
    if (red) N4.dizzy(c, 266, 396, 30, t, 3);
    // the kidneys, in a zoom bubble from the patient's back: two beans whose tubes drip out the medicine they clear
    { const kx = 206, ky = 580, R = 36; c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = 2.5; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(kx + 20, ky - 30); c.lineTo(248, 520); c.stroke(); c.setLineDash([]);
      c.fillStyle = '#1a2a3a'; c.strokeStyle = '#e8eef8'; c.lineWidth = 3; c.beginPath(); c.arc(kx, ky, R, 0, 7); c.fill(); c.stroke();
      c.save(); c.beginPath(); c.arc(kx, ky, R - 2, 0, 7); c.clip();
      for (const sd of [-1, 1]) { const x = kx + sd * 14, y = ky - 8;
        c.strokeStyle = '#e8a0b0'; c.lineWidth = 3; c.beginPath(); c.moveTo(x - sd * 5, y + 4); c.quadraticCurveTo(x - sd * 6, y + 18, kx + sd * 3, y + 26); c.stroke(); // the tube from each kidney
        c.save(); c.translate(x, y); c.scale(sd, 1); c.fillStyle = '#b8304a'; c.strokeStyle = '#6a1424'; c.lineWidth = 2;
        c.beginPath(); c.moveTo(-2, -14); c.bezierCurveTo(10, -16, 12, 14, 0, 14); c.bezierCurveTo(-8, 14, -9, 6, -4, 2); c.bezierCurveTo(-8, -2, -9, -12, -2, -14); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = 'rgba(255,200,210,0.45)'; c.beginPath(); c.ellipse(3, -6, 3, 5, 0.3, 0, 7); c.fill(); c.restore(); }
      for (const t0 of s.dOut) { const k = (t - t0) / 0.45; c.fillStyle = '#ffd070'; c.beginPath(); c.ellipse(kx, ky + 20 + k * 20, 2.5, 4, 0, 0, 7); c.fill(); }
      c.restore(); }
    SK.tag(c, 'Kidneys', 290, 590, 18);
    // which way to slide: an arrow on the roller toward the setting that settles in the band
    const head = s.r / s.k, need = s.phase === 'drip' && !g.done ? (head < s.lo + 0.01 ? 1 : head > s.hi - 0.01 ? -1 : 0) : 0;
    if (need && !SK.dragging(g)) N4.bigArrow(c, TR.x + 46, SD.rY(s.r), need, need > 0 ? '#8affc0' : '#ffb08a', 0.9, t);
    SK.animal(c, 'octopus', 120, 470, 0.62, { t, pose: won ? 'cheer' : lost ? 'sad' : 'point', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
    // guidance: drag the roller to the setting that holds this patient in the middle of the band
    const goal = s.k * (s.lo + s.hi) / 2, gy = SD.rY(goal), ry = SD.rY(s.r);
    if (need) { SK.grab(c, g, TR.x, ry, 26); SK.target(c, g, TR.x, gy, 0, { w: 56, h: 32 }); }
    SK.demo(g, c, 'drag', [TR.x, ry], [TR.x, gy], { never: !need });
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._b = s._b || { n: 0, next: 1.0 }; if (g.done || s.phase !== 'drip' || g.t < B.next) return;
    const goal = s.k * (s.lo + s.hi) / 2, head = s.r / s.k; if (head >= s.lo + 0.01 && head <= s.hi - 0.01 && !s._bot?.['r' + B.n]) return;
    if (SK.bot.drag(g, synth, 'r' + B.n, B.next, [SD.TR.x, SD.rY(s.r)], [SD.TR.x, SD.rY(goal)], 0.4)) { B.n++; B.next = g.t + 0.3; }
  },
});
