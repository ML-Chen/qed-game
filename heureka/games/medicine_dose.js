// DOSE! (chem_bio MED-01) — a cosy clinic. A patient with an aching leg sits on the exam bed; beside it a tall meter
// shows how much medicine is in its blood: too little at the bottom, a green "works" band in the middle, a red
// "harmful" zone at the top. Tap the pill bottle: a pill flies into the patient's mouth and, over the next half second,
// the meter climbs as the pill is absorbed. Stop in the green band and the ache marks vanish, the patient cheers and
// hops off, and the next patient comes in. Patients differ in size: one pill lifts a small bird's level a lot and a
// big beaver's only a little, so each one needs a different number of pills. Tap too fast (before the last pill is
// absorbed) or too many times and the level runs into the red: the patient goes dizzy with stars round its head.
// Level 0-1: two patients; level 1 a narrower band. Level 2: three patients and a narrow window.
const DS = (() => {
  const M = { x: 54, y0: 476, y1: 176, w: 34 }, BED = { x: 186, y: 444 }, BOT = { x: 300, y: 516, w: 104, h: 96 };
  const SIZES = { small: { s: 1.15, n: 2 }, mid: { s: 1.4, n: 3 }, big: { s: 1.65, n: 4 } };
  const SETS = [ // four sets of patients (small, medium, big), each with its own band height and room colour
    { pts: [['bird', 'small'], ['rabbit', 'mid'], ['beaver', 'big']], mid: 0.6, wall: ['#cfeee0', '#f2fbf4'], trim: '#5aa88a' },
    { pts: [['rabbit', 'mid'], ['hedgehog', 'small'], ['penguin', 'big']], mid: 0.56, wall: ['#fde2cf', '#fff6ec'], trim: '#e07a5a' },
    { pts: [['frog', 'small'], ['owl', 'big'], ['fox', 'mid']], mid: 0.64, wall: ['#dfe4fb', '#f6f7ff'], trim: '#6a7ad0' },
    { pts: [['duck', 'mid'], ['beaver', 'big'], ['bird', 'small']], mid: 0.58, wall: ['#f6dcef', '#fff4fa'], trim: '#c05a9a' },
  ];
  const lvY = v => M.y0 + (M.y1 - M.y0) * Math.min(1, v);
  function paint(o, S) {
    N4.vgrad(o, 0, 0, 360, 500, S.wall);
    // a window onto a sunny garden
    o.fillStyle = '#fff6ea'; o.beginPath(); o.roundRect(120, 150, 190, 150, 14); o.fill();
    N4.vgrad(o, 130, 160, 170, 130, ['#8fd0f0', '#cfeef8']); o.fillStyle = '#9ad070'; o.beginPath(); o.ellipse(215, 300, 120, 40, 0, Math.PI, 0); o.fill();
    o.fillStyle = '#fff'; o.beginPath(); o.ellipse(170, 190, 22, 9, 0, 0, 7); o.ellipse(190, 186, 16, 8, 0, 0, 7); o.fill();
    o.fillStyle = '#ffd45a'; o.beginPath(); o.arc(270, 190, 14, 0, 7); o.fill();
    o.strokeStyle = '#fff6ea'; o.lineWidth = 6; o.beginPath(); o.moveTo(215, 160); o.lineTo(215, 290); o.moveTo(130, 225); o.lineTo(300, 225); o.stroke();
    o.strokeStyle = S.trim; o.lineWidth = 4; o.beginPath(); o.roundRect(120, 150, 190, 150, 14); o.stroke();
    // a wall rail and the floor
    o.fillStyle = S.trim; o.fillRect(0, 352, 360, 8); o.fillStyle = 'rgba(255,255,255,0.4)'; o.fillRect(0, 352, 360, 2);
    N4.vgrad(o, 0, 494, 360, 146, ['#d8b48a', '#b88c62']); o.strokeStyle = 'rgba(120,80,40,0.25)'; o.lineWidth = 2;
    for (let y = 510; y < 640; y += 26) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); }
    // the exam bed: a padded top on steel legs
    o.fillStyle = '#9aa6b8'; o.fillRect(BED.x - 62, BED.y + 14, 8, 56); o.fillRect(BED.x + 54, BED.y + 14, 8, 56); o.fillRect(BED.x - 62, BED.y + 60, 124, 6);
    o.fillStyle = 'rgba(30,14,36,0.18)'; o.beginPath(); o.ellipse(BED.x, BED.y + 128, 84, 10, 0, 0, 7); o.fill();
    const bg = o.createLinearGradient(0, BED.y, 0, BED.y + 20); bg.addColorStop(0, '#7ac0e8'); bg.addColorStop(1, '#4a8ac0'); o.fillStyle = bg; o.beginPath(); o.roundRect(BED.x - 76, BED.y, 152, 20, 10); o.fill();
    o.fillStyle = '#fff'; o.beginPath(); o.roundRect(BED.x - 68, BED.y - 2, 136, 6, 3); o.fill();
    // a red cross on the wall
    o.fillStyle = '#e8564a'; o.fillRect(326, 200, 10, 30); o.fillRect(316, 210, 30, 10);
    P.grain(o, 360, 640, 0.025);
  }
  // the meter: a glass tube with a too-little zone, a green band and a red zone, and the medicine level inside
  function meter(c, g, s) {
    const { x, y0, y1, w } = M, lo = lvY(s.lo), hi = lvY(s.hi), t = g.t;
    c.fillStyle = 'rgba(30,14,36,0.25)'; c.beginPath(); c.roundRect(x - w / 2 - 6, y1 - 10, w + 12, y0 - y1 + 22, 18); c.fill();
    c.fillStyle = '#fbf6ff'; c.beginPath(); c.roundRect(x - w / 2, y1 - 4, w, y0 - y1 + 8, 14); c.fill();
    c.fillStyle = 'rgba(232,64,64,0.28)'; c.fillRect(x - w / 2, y1, w, hi - y1); // harmful
    c.fillStyle = 'rgba(70,200,110,0.45)'; c.fillRect(x - w / 2, hi, w, lo - hi); // works
    // the medicine in the blood
    const L = lvY(s.lv), inB = s.lv >= s.lo && s.lv <= s.hi, red = s.lv > s.hi, col = red ? '#e83a3a' : inB ? '#3ac06a' : '#e89a3a';
    c.save(); c.beginPath(); c.roundRect(x - w / 2 + 4, y1, w - 8, y0 - y1 + 2, 10); c.clip();
    const fg = c.createLinearGradient(x - w / 2, 0, x + w / 2, 0); fg.addColorStop(0, P.shade(col, 0.25)); fg.addColorStop(1, P.shade(col, -0.2)); c.fillStyle = fg; c.fillRect(x - w / 2, L, w, y0 + 4 - L);
    c.fillStyle = 'rgba(255,255,255,0.5)'; for (let i = 0; i < 4; i++) { const by = y0 - ((t * 40 + i * 37) % Math.max(1, y0 - L)); if (by > L + 4) { c.beginPath(); c.arc(x - 4 + (i % 2) * 8, by, 2.5, 0, 7); c.fill(); } }
    c.restore();
    // where the pills already swallowed will take it (a dashed ghost line), while it is still climbing
    if (s.tg - s.lv > 0.01) { const T = lvY(s.tg); c.save(); c.strokeStyle = s.tg > s.hi ? '#e83a3a' : '#3a1640'; c.lineWidth = 2.5; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(x - w / 2 - 6, T); c.lineTo(x + w / 2 + 6, T); c.stroke(); c.restore(); }
    c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.beginPath(); c.roundRect(x - w / 2, y1 - 4, w, y0 - y1 + 8, 14); c.stroke();
    // band edges and a tick for "just right"
    c.strokeStyle = '#1e7a3e'; c.lineWidth = 2.5; for (const yy of [lo, hi]) { c.beginPath(); c.moveTo(x - w / 2 - 8, yy); c.lineTo(x + w / 2 + 8, yy); c.stroke(); }
    c.save(); c.strokeStyle = '#1e7a3e'; c.lineWidth = 5; c.lineCap = 'round'; c.lineJoin = 'round'; const cy = (lo + hi) / 2; c.beginPath(); c.moveTo(x + w / 2 + 12, cy); c.lineTo(x + w / 2 + 18, cy + 6); c.lineTo(x + w / 2 + 30, cy - 8); c.stroke(); c.restore();
    // skull-free "harmful" mark: a red cross on the red zone
    c.save(); c.strokeStyle = '#c02a2a'; c.lineWidth = 5; c.lineCap = 'round'; const ry = (y1 + hi) / 2, rx = x + w / 2 + 21; c.beginPath(); c.moveTo(rx - 7, ry - 7); c.lineTo(rx + 7, ry + 7); c.moveTo(rx + 7, ry - 7); c.lineTo(rx - 7, ry + 7); c.stroke(); c.restore();
    // the level marker
    c.fillStyle = col; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - w / 2 - 4, L); c.lineTo(x - w / 2 - 16, L - 8); c.lineTo(x - w / 2 - 16, L + 8); c.closePath(); c.fill(); c.stroke();
  }
  function bottle(c, g, s, press) {
    const { x, y } = BOT, sq = press ? 0.94 : 1; c.save(); c.translate(x, y + 40); c.scale(1, sq); c.translate(-x, -(y + 40));
    SK.shadow(c, x, y + 46, 46, 9, 0.25);
    const bg = c.createLinearGradient(x - 40, 0, x + 40, 0); bg.addColorStop(0, '#ffb45a'); bg.addColorStop(0.5, '#ff9a3a'); bg.addColorStop(1, '#d8702a');
    c.fillStyle = bg; c.strokeStyle = '#7a3a14'; c.lineWidth = 3; c.beginPath(); c.roundRect(x - 38, y - 30, 76, 76, 14); c.fill(); c.stroke();
    c.fillStyle = '#fff6ea'; c.beginPath(); c.roundRect(x - 44, y - 50, 88, 24, 8); c.fill(); c.stroke(); // the cap
    c.strokeStyle = 'rgba(122,58,20,0.4)'; c.lineWidth = 2; for (let i = -36; i <= 36; i += 9) { c.beginPath(); c.moveTo(x + i, y - 47); c.lineTo(x + i, y - 29); c.stroke(); }
    c.fillStyle = '#fff6ea'; c.beginPath(); c.roundRect(x - 30, y - 14, 60, 44, 8); c.fill(); // the label: a pill picture
    c.save(); c.translate(x, y + 8); c.rotate(-0.5); c.fillStyle = '#e84a6a'; c.beginPath(); c.roundRect(-18, -8, 18, 16, [8, 0, 0, 8]); c.fill(); c.fillStyle = '#fff'; c.strokeStyle = '#7a3a14'; c.lineWidth = 2; c.beginPath(); c.roundRect(0, -8, 18, 16, [0, 8, 8, 0]); c.fill(); c.beginPath(); c.roundRect(-18, -8, 36, 16, 8); c.stroke(); c.restore();
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.roundRect(x - 33, y - 26, 8, 66, 4); c.fill();
    c.restore();
  }
  function pill(c, x, y, r) { c.save(); c.translate(x, y); c.rotate(r); c.fillStyle = '#e84a6a'; c.beginPath(); c.roundRect(-10, -5, 10, 10, [5, 0, 0, 5]); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.roundRect(0, -5, 10, 10, [0, 5, 5, 0]); c.fill(); c.strokeStyle = '#7a3a14'; c.lineWidth = 1.5; c.beginPath(); c.roundRect(-10, -5, 20, 10, 5); c.stroke(); c.restore(); }
  const mouth = (s) => { const P0 = s.cur; return [BED.x + 14 * P0.s, BED.y - 2 - 44 * P0.s]; };
  function nextPatient(g) {
    const s = g.s; s.i++; if (s.i >= s.queue.length) return;
    const [kind, size] = s.queue[s.i]; s.cur = { kind, s: SIZES[size].s, n: SIZES[size].n, inc: s.mid / SIZES[size].n }; s.lv = 0; s.tg = 0; s.okT = 0; s.inT = g.t; s.phase = 'dose'; s.pills = [];
  }
  return { M, BED, BOT, SETS, paint, meter, bottle, pill, mouth, nextPatient, lvY };
})();
MG.add({
  id: 'medicine_dose', stage: 'medicine', cmd: 'DOSE EACH PATIENT TO GREEN!', time: 7, mood: 'party', winText: 'Aches gone!', failText: 'Too much!',
  card: { title: 'Just the right amount', kind: 'Medicine', ref: 'The therapeutic window',
    text: 'A medicine helps only when the right amount of it is in your blood. Too little does nothing. Too much can make you ill. The safe, useful range in between is called the therapeutic window.\n\nThe same pill raises the level more in a small body than in a big one, so doctors set doses by size and age.\n\nA pill also takes time to soak into the blood. That is why you wait and watch before taking more, and why you never take extra because the first one "isn\'t working yet".',
    note: 'A medicine works between too little and too much, and the right dose depends on the body taking it.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.v = SK.variant(g, DS.SETS.length); const S = DS.SETS[s.v];
    s.S = S; s.mid = S.mid; const w = [0.2, 0.16, 0.12][L]; s.lo = S.mid - w / 2; s.hi = S.mid + w / 2;
    s.queue = L >= 2 ? S.pts.slice() : S.pts.slice(0, 2); s.i = -1; s.done = 0; s.pressT = -9; s.dizzyT = 0; s.hopT = 0; DS.nextPatient(g);
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.phase !== 'dose' || !N4.inBox(DS.BOT, x, y, 22)) return;
    s.pressT = g.t; g.sfx('pop'); const [mx, my] = DS.mouth(s); s.pills.push({ t0: g.t, x0: DS.BOT.x, y0: DS.BOT.y - 50, x1: mx, y1: my });
  },
  update(g, dt) {
    const s = g.s;
    if (s.phase === 'next' && g.t >= s.nextT) { DS.nextPatient(g); g.sfx('pop'); return; }
    for (const p of s.pills) if (!p.in && g.t - p.t0 >= 0.35) { p.in = true; s.tg += s.cur.inc; g.sfx('slurp'); }
    s.pills = s.pills.filter(p => !p.in);
    // the swallowed pills soak into the blood: the level climbs toward the total and settles there
    const d = s.tg - s.lv; s.lv += d * Math.min(1, dt * 6); if (Math.abs(d) < 0.002) s.lv = s.tg;
    if (g.done) return;
    if (s.phase === 'dose' && s.lv > s.hi + 0.004) { s.phase = 'dizzy'; s.dizzyT = g.t; g.sfx('boing'); g.sfx('laugh'); g.fail(); return; }
    if (s.phase === 'dose' && !s.pills.length && s.lv >= s.lo && s.tg <= s.hi && s.tg - s.lv < 0.01) {
      if (!s.okT) { s.okT = g.t; g.sfx('chime'); g.burst(DS.BED.x, DS.BED.y - 50, ['#8affb0', '#fff6ea', '#ffd45a'], 14, 140); }
      if (g.t - s.okT > 0.45) { s.done++; s.hopT = g.t; if (s.done >= s.queue.length) { s.phase = 'won'; g.sfx('cheer'); g.win(); } else { s.phase = 'next'; s.nextT = g.t + 0.55; g.sfx('ding'); } }
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, P0 = s.cur, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('dose_bg' + s.v, o => DS.paint(o, s.S)), 0, 0, 360, 640);
    // the patients still waiting, by the door
    for (let k = s.i + 1; k < s.queue.length; k++) SK.animal(c, s.queue[k][0], 338 - (k - s.i - 1) * 24, 404, 0.6, { t, phase: k, expr: 'sad', facing: -1 });
    // the patient on the bed: aching, then cheering and hopping off; dizzy if overdosed
    const inB = s.lv >= s.lo && s.lv <= s.hi, healed = s.okT && s.lv <= s.hi, red = s.lv > s.hi;
    const hopK = s.phase === 'next' ? SK.clamp((t - s.hopT) / 0.55, 0, 1) : 0;
    c.save(); const ax = DS.BED.x - hopK * 160, ay = DS.BED.y - Math.sin(hopK * Math.PI) * 40;
    if (red) { c.translate(ax, ay); c.rotate(Math.sin(t * 7) * 0.18); c.translate(-ax, -ay); }
    SK.animal(c, P0.kind, ax, ay, P0.s, { t, pose: healed || won ? 'cheer' : red ? 'balance' : 'idle', expr: red ? 'wow' : healed || won ? 'laugh' : inB ? 'happy' : 'sad', facing: hopK > 0 ? -1 : 1 });
    c.restore();
    if (!healed && !red && !hopK) N4.ache(c, DS.BED.x - 4, DS.BED.y - 14 * P0.s, 22 * P0.s, t, 1 - SK.clamp((s.lv - s.lo * 0.6) / (s.lo * 0.4), 0, 0.85));
    if (red) N4.dizzy(c, DS.BED.x + 6 * P0.s, DS.BED.y - 70 * P0.s, 30 * P0.s, t);
    // pills in flight to the mouth
    for (const p of s.pills) { const k = SK.clamp((t - p.t0) / 0.35, 0, 1); DS.pill(c, SK.lerp(p.x0, p.x1, k), SK.lerp(p.y0, p.y1, k) - Math.sin(k * Math.PI) * 70, k * 8); }
    DS.meter(c, g, s);
    SK.tag(c, 'Medicine', DS.M.x + 6, DS.M.y1 - 34, 18);
    if (!hopK) SK.tag(c, 'Patient', DS.BED.x, DS.BED.y + 44, 18);
    SK.tag(c, Math.min(s.done + 1, s.queue.length) + ' / ' + s.queue.length, 300, 140, 20);
    const pressed = t - s.pressT < 0.12; DS.bottle(c, g, s, pressed);
    SK.tag(c, 'Pills', DS.BOT.x, DS.BOT.y + 72, 18);
    // which way to go: an up arrow by the meter while the level (with the pills already taken) is still too low
    if (s.phase === 'dose' && !g.done && s.tg + s.pills.length * P0.inc < s.lo) N4.bigArrow(c, DS.M.x + 50, DS.lvY(s.lv) - 10, 1, '#ffd45a', 1, t);
    // the duck nurse
    SK.animal(c, 'duck', 40, 590, 0.75, { t, pose: won ? 'cheer' : lost ? 'sad' : 'point', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
    // guidance: tap the bottle while the pills taken so far won't reach the green band; otherwise wait (no hand)
    const tapNow = s.phase === 'dose' && !g.done && s.tg + s.pills.length * P0.inc < s.lo - 0.001;
    if (tapNow) SK.glow(c, g, DS.BOT.x, DS.BOT.y, 60, '#e8563a');
    SK.demo(g, c, 'tap', [DS.BOT.x, DS.BOT.y + 6], null, { never: !tapNow });
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._b = s._b || { last: -9 }; if (g.done || s.phase !== 'dose' || g.t < 1.0 || g.t - s.inT < 0.3) return;
    // one pill at a time, waiting for each to soak in, until the level reaches the band
    if (!s.pills.length && Math.abs(s.tg - s.lv) < 0.01 && s.tg < s.lo && g.t - B.last > 0.2) { B.last = g.t; synth('down', DS.BOT.x, DS.BOT.y); synth('up', DS.BOT.x, DS.BOT.y); }
  },
});
