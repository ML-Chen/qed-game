// DIAL IN! (hardware EB-03) — a grow shelf at night. A knob (a potentiometer) is wired to the brain board's analog pin
// A0; the board reads the knob as a smooth amount (a bar on the pin rises as you turn), and sets the grow lamp's
// brightness to match. A seedling sits under the lamp, with a light meter beside it. Turn the knob: too little light
// and the seedling droops; in its green band it perks up and opens a flower; too much and its leaves brown and smoke.
// Then the next plant comes, which wants a different amount (a fern likes shade, a tomato likes lots of light).
// Level 0: two plants. Level 1: narrower bands. Level 2: then the sun comes up through the window and adds its own
// light, so you turn the lamp down to keep the plant in its band.
const DI = (() => {
  const KN = { x: 88, y: 526, r: 50 }, LAMP = { x: 196, y: 166 }, POT = { x: 190, y: 446 }, MET = { x: 318, y0: 420, y1: 210 }, A0 = -1.75, A1 = 1.75;
  const PLANTS = { Fern: { need: 0.3, leaf: '#3a9a5a' }, Basil: { need: 0.5, leaf: '#5ab84a' }, Tomato: { need: 0.68, leaf: '#4a9a3a', fruit: '#e8402a' }, Cactus: { need: 0.8, leaf: '#6aa85a' } };
  const SETS = [['Fern', 'Tomato'], ['Cactus', 'Basil'], ['Basil', 'Cactus'], ['Tomato', 'Fern']];
  const ang = v => A0 + (A1 - A0) * v, mY = v => MET.y0 + (MET.y1 - MET.y0) * SK.clamp(v, 0, 1);
  function paint(o, L) {
    N4.vgrad(o, 0, 0, 360, 640, ['#1a2440', '#2a3a5a', '#3a3a52']);
    // the window (night, or dawn at level 2 when the sun will come up)
    o.fillStyle = '#0e1430'; o.beginPath(); o.roundRect(18, 140, 96, 120, 10); o.fill(); P.stars(o, 360, 260, 12, 9, 0);
    o.fillStyle = '#2a3a5a'; o.fillRect(0, 0, 18, 280); o.fillRect(114, 0, 40, 280); o.fillRect(0, 0, 154, 140); o.fillRect(0, 260, 154, 30);
    o.strokeStyle = '#c8b8a0'; o.lineWidth = 5; o.beginPath(); o.roundRect(18, 140, 96, 120, 10); o.moveTo(66, 140); o.lineTo(66, 260); o.stroke();
    // the shelf
    N4.vgrad(o, 0, 470, 360, 170, ['#7a5a3a', '#5a3e26']); o.fillStyle = '#a07a4a'; o.fillRect(0, 466, 360, 10); o.fillStyle = 'rgba(255,255,255,0.06)'; for (let y = 490; y < 640; y += 24) o.fillRect(0, y, 360, 2);
    // the brain board
    o.fillStyle = 'rgba(0,0,0,0.3)'; o.beginPath(); o.roundRect(194, 500, 148, 96, 10); o.fill();
    const bg = o.createLinearGradient(0, 494, 0, 590); bg.addColorStop(0, '#2a7ad0'); bg.addColorStop(1, '#1a5aa8'); o.fillStyle = bg; o.strokeStyle = '#0e3a70'; o.lineWidth = 3; o.beginPath(); o.roundRect(190, 494, 148, 96, 10); o.fill(); o.stroke();
    o.fillStyle = '#1a1a22'; o.beginPath(); o.roundRect(234, 528, 56, 40, 4); o.fill(); o.fillStyle = '#c8c8d0'; for (let i = 0; i < 5; i++) { o.fillRect(238 + i * 11, 524, 5, 5); o.fillRect(238 + i * 11, 567, 5, 5); }
    // the knob's base plate with a scale
    o.fillStyle = '#2a2a34'; o.beginPath(); o.arc(KN.x, KN.y, KN.r + 16, 0, 7); o.fill();
    o.strokeStyle = '#8a8aa0'; o.lineWidth = 2; for (let i = 0; i <= 10; i++) { const a = ang(i / 10) - Math.PI / 2; o.beginPath(); o.moveTo(KN.x + Math.cos(a) * (KN.r + 6), KN.y + Math.sin(a) * (KN.r + 6)); o.lineTo(KN.x + Math.cos(a) * (KN.r + 13), KN.y + Math.sin(a) * (KN.r + 13)); o.stroke(); }
    // the lamp's cord
    o.strokeStyle = '#1a1a22'; o.lineWidth = 3; o.beginPath(); o.moveTo(LAMP.x, 0); o.lineTo(LAMP.x, LAMP.y - 20); o.stroke();
    P.grain(o, 360, 640, 0.03);
  }
  function plant(c, kind, x, y, droop, burn, happy, t) {
    const P0 = PLANTS[kind], sway = Math.sin(t * 2) * 0.03, leaf = P.mix(P0.leaf, '#8a6a2a', SK.clamp(burn, 0, 1) * 0.8);
    // the pot
    c.fillStyle = '#c8603a'; c.strokeStyle = '#6a2a1a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 34, y - 34); c.lineTo(x + 34, y - 34); c.lineTo(x + 26, y + 18); c.lineTo(x - 26, y + 18); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#e07a4a'; c.beginPath(); c.roundRect(x - 38, y - 42, 76, 12, 4); c.fill(); c.stroke(); c.fillStyle = '#4a2a1a'; c.fillRect(x - 32, y - 44, 64, 4);
    // the stem bends over as it droops
    const H = kind === 'Cactus' ? 64 : 92, bend = droop * 1.25 + sway;
    c.save(); c.translate(x, y - 42);
    if (kind === 'Cactus') {
      c.rotate(bend * 0.5); c.fillStyle = leaf; c.strokeStyle = P.shade(leaf, -0.5); c.lineWidth = 2.5; c.beginPath(); c.roundRect(-14, -H, 28, H, 14); c.fill(); c.stroke();
      for (const s of [-1, 1]) { c.beginPath(); c.roundRect(s > 0 ? 12 : -26, -H * 0.6, 14, 10, 5); c.fill(); c.stroke(); c.beginPath(); c.roundRect(s > 0 ? 18 : -26, -H * 0.6 - 20 + droop * 14, 8, 26, 4); c.fill(); c.stroke(); }
      c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 1; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-6 + (i % 3) * 6, -10 - i * 9); c.lineTo(-9 + (i % 3) * 6, -13 - i * 9); c.stroke(); }
      if (happy > 0) { c.fillStyle = '#ff6aa8'; for (let i = 0; i < 5; i++) { const a = i * 1.256; c.beginPath(); c.ellipse(Math.cos(a) * 7 * happy, -H - 4 + Math.sin(a) * 7 * happy, 6 * happy, 4 * happy, a, 0, 7); c.fill(); } }
    } else {
      const seg = 6; let px = 0, py = 0, a = 0; c.strokeStyle = P.shade(leaf, -0.35); c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0);
      const pts = []; for (let i = 1; i <= seg; i++) { a = bend * Math.pow(i / seg, 1.6); px += Math.sin(a) * H / seg; py -= Math.cos(a) * H / seg; c.lineTo(px, py); pts.push([px, py, a]); } c.stroke();
      // leaves along the stem, hanging limp when it droops
      pts.forEach(([lx, ly, la], i) => { if (i % 2 === 0 || i === seg - 1) for (const s of [-1, 1]) { c.save(); c.translate(lx, ly); c.rotate(la + s * (1.1 + droop * 0.9)); c.fillStyle = leaf; c.strokeStyle = P.shade(leaf, -0.5); c.lineWidth = 1.5; const L = kind === 'Fern' ? 30 : kind === 'Basil' ? 20 : 24, W = kind === 'Fern' ? 7 : 11; c.beginPath(); c.ellipse(0, -L / 2, W, L / 2, 0, 0, 7); c.fill(); c.stroke(); c.restore(); } });
      const [tx, ty] = pts[seg - 1];
      if (happy > 0) { if (P0.fruit) { SK.ball(c, tx + 8, ty + 12, 9 * happy, P0.fruit); SK.ball(c, tx - 10, ty + 22, 7 * happy, P0.fruit); } else { c.fillStyle = '#fff6ea'; for (let i = 0; i < 5; i++) { const a = i * 1.256 + t; c.beginPath(); c.ellipse(tx + Math.cos(a) * 7 * happy, ty - 4 + Math.sin(a) * 7 * happy, 5 * happy, 3 * happy, a, 0, 7); c.fill(); } c.fillStyle = '#ffd45a'; c.beginPath(); c.arc(tx, ty - 4, 4 * happy, 0, 7); c.fill(); } }
    }
    c.restore();
    if (burn > 0.2) for (let i = 0; i < 3; i++) { const k = (t * 0.8 + i / 3) % 1; c.fillStyle = `rgba(120,110,110,${0.5 * (1 - k) * Math.min(1, burn)})`; c.beginPath(); c.arc(x - 10 + i * 10 + Math.sin(t * 3 + i) * 6, y - 120 - k * 60, 8 + k * 10, 0, 7); c.fill(); }
  }
  return { KN, LAMP, POT, MET, A0, A1, PLANTS, SETS, ang, mY, paint, plant };
})();
MG.add({
  id: 'circuits_dialin', stage: 'circuits', cmd: 'TURN THE KNOB TILL IT PERKS UP!', time: 7, mood: 'night', winText: 'Just enough light!', failText: 'Scorched!',
  card: { title: 'Pins that read in-between amounts', kind: 'Hardware', ref: 'Analog input (a potentiometer)',
    text: 'Some pins on a microcontroller only tell on from off. An analog pin reads an in-between amount, from none to full.\n\nThe knob is a potentiometer. Turning it changes how much voltage reaches the pin, smoothly. The program reads that amount and sets the lamp to the same brightness.\n\nThat is how a dimmer, a volume knob or a thermostat dial works. Different plants want different amounts of light, so you need the in-between steps, not just on and off.',
    note: 'An analog pin reads a smooth range of values, so a knob can set exactly how bright or fast something is.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.L = L;
    s.queue = DI.SETS[s.v].map(k => ({ kind: k, need: DI.PLANTS[k].need })); if (L >= 2) s.queue.push({ kind: s.queue[1].kind, need: s.queue[1].need, sun: 0.32 });
    s.w = [0.16, 0.12, 0.12][L]; s.i = 0; s.val = 0.06; s.sun = 0; s.okT = 0; s.burnT = 0; s.phase = 'set'; s.nextT = 0; s.happyT = 0; s.knob = null; s.arrT = 0;
  },
  light(s) { return SK.clamp(s.val + s.sun, 0, 1.1); },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (SK.dist(x, y, DI.KN.x, DI.KN.y) < DI.KN.r + 34) { s.knob = Math.atan2(y - DI.KN.y, x - DI.KN.x); SK.dragStart(g, null, x, y); g.sfx('click'); } },
  move(g, x, y) {
    const s = g.s; if (s.knob == null || g.done) return; SK.dragMove(g, x, y); const a = Math.atan2(y - DI.KN.y, x - DI.KN.x); let d = a - s.knob; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    s.knob = a; s.val = SK.clamp(s.val + d / (DI.A1 - DI.A0), 0, 1);
  },
  up(g) { g.s.knob = null; SK.dragEnd(g); },
  update(g, dt) {
    const s = g.s, Q = s.queue[s.i];
    if (s.phase === 'next' && g.t >= s.nextT) { s.i++; s.phase = 'set'; s.okT = 0; s.arrT = g.t; s.burnT = 0; if (s.queue[s.i].sun) { s.sunUp = g.t; g.sfx('magic'); } else g.sfx('pop'); }
    if (s.sunUp) s.sun = s.queue[s.i].sun * SK.clamp((g.t - s.sunUp) / 0.8, 0, 1);
    if (g.done || s.phase !== 'set') return;
    const L = g.def.light(s), lo = Q.need - s.w / 2, hi = Q.need + s.w / 2;
    const acted = (g.lastIn ?? 0) > s.arrT || g.t - s.arrT > 6; // a new plant only scorches once you have had a go at the knob
    if (L > hi + 0.06 && acted) { s.burnT += dt; if (s.burnT > 1.2) { g.sfx('fire'); g.sfx('laugh'); g.fail(); return; } } else s.burnT = Math.max(0, s.burnT - dt * 2);
    if (L >= lo && L <= hi && (!s.sunUp || g.t - s.sunUp > 0.8)) { if (!s.okT) { s.okT = g.t; g.sfx('grow'); } if (g.t - s.okT > 0.8) { s.happyT = g.t; g.burst(DI.POT.x, DI.POT.y - 120, ['#ffd45a', '#8affb0', '#fff6ea'], 14, 130);
      if (s.i >= s.queue.length - 1) { s.phase = 'won'; g.sfx('cheer'); g.win(); } else { s.phase = 'next'; s.nextT = g.t + 0.6; g.sfx('chime'); } } }
    else s.okT = 0;
  },
  draw(g, c) {
    const s = g.s, t = g.t, Q = s.queue[s.i], KN = DI.KN, won = g.result === 'win', lost = g.result === 'fail', L = g.def.light(s), lo = Q.need - s.w / 2, hi = Q.need + s.w / 2;
    c.drawImage(g.bake('dialin_bg' + s.L, o => DI.paint(o, s.L)), 0, 0, 360, 640);
    // the sun rising in the window (level 2)
    if (s.sun > 0) { const k = s.sun / 0.32; c.save(); c.beginPath(); c.roundRect(18, 140, 96, 120, 10); c.clip(); c.fillStyle = `rgba(255,200,120,${0.6 * k})`; c.fillRect(18, 140, 96, 120); c.fillStyle = '#ffe070'; c.beginPath(); c.arc(66, 260 - 70 * k, 22, 0, 7); c.fill(); c.restore();
      c.save(); c.globalCompositeOperation = 'lighter'; const sg = c.createLinearGradient(66, 200, 200, 440); sg.addColorStop(0, `rgba(255,220,140,${0.3 * k})`); sg.addColorStop(1, 'rgba(255,220,140,0)'); c.fillStyle = sg; c.beginPath(); c.moveTo(30, 170); c.lineTo(110, 160); c.lineTo(260, 440); c.lineTo(130, 450); c.closePath(); c.fill(); c.restore(); SK.tag(c, 'Sun', 66, 128 + 160, 18); }
    // the lamp and its light cone, as bright as the pin reading
    const b = s.val; c.save(); c.globalCompositeOperation = 'lighter'; const cg = c.createLinearGradient(0, DI.LAMP.y, 0, 460); cg.addColorStop(0, `rgba(255,170,255,${0.55 * b})`); cg.addColorStop(1, `rgba(255,170,255,${0.08 * b})`); c.fillStyle = cg; c.beginPath(); c.moveTo(DI.LAMP.x - 30, DI.LAMP.y + 10); c.lineTo(DI.LAMP.x + 30, DI.LAMP.y + 10); c.lineTo(DI.LAMP.x + 100, 462); c.lineTo(DI.LAMP.x - 100, 462); c.closePath(); c.fill(); c.restore();
    c.fillStyle = '#4a4a5a'; c.strokeStyle = '#1a1a22'; c.lineWidth = 3; c.beginPath(); c.moveTo(DI.LAMP.x - 46, DI.LAMP.y + 12); c.lineTo(DI.LAMP.x - 22, DI.LAMP.y - 22); c.lineTo(DI.LAMP.x + 22, DI.LAMP.y - 22); c.lineTo(DI.LAMP.x + 46, DI.LAMP.y + 12); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = P.mix('#5a4a6a', '#ffd0ff', b); c.beginPath(); c.ellipse(DI.LAMP.x, DI.LAMP.y + 12, 42, 7, 0, 0, 7); c.fill();
    SK.tag(c, 'Lamp', DI.LAMP.x + 82, DI.LAMP.y - 8, 18);
    // the plant: droops in too little light, flowers in its band, browns and smokes in too much
    const droop = SK.clamp((lo - L) / Math.max(0.1, lo), 0, 1), burn = SK.clamp((L - hi) / 0.15, 0, 1) * (0.4 + Math.min(1, s.burnT)), inB = L >= lo && L <= hi;
    const hap = s.happyT && t - s.happyT < 0.6 || won ? 1 : inB ? SK.clamp((t - s.okT) / 0.6, 0, 1) * (s.okT ? 1 : 0) : 0;
    const slide = s.phase === 'next' ? SK.easeInOut((t - s.happyT) / 0.6) * 260 : 0;
    c.save(); c.translate(DI.POT.x + slide, DI.POT.y + 18); c.scale(1.35, 1.35); c.translate(-(DI.POT.x + slide), -(DI.POT.y + 18)); DI.plant(c, Q.kind, DI.POT.x + slide, DI.POT.y, droop, burn, hap, t); c.restore();
    if (!slide) SK.tag(c, Q.kind, DI.POT.x, DI.POT.y + 2, 18);
    // the light meter by the plant, with this plant's green band
    const M = DI.MET; c.fillStyle = 'rgba(10,12,30,0.75)'; c.beginPath(); c.roundRect(M.x - 18, M.y1 - 12, 36, M.y0 - M.y1 + 24, 14); c.fill();
    c.fillStyle = 'rgba(255,80,80,0.35)'; c.fillRect(M.x - 12, M.y1, 24, DI.mY(hi) - M.y1); c.fillStyle = 'rgba(70,220,120,0.6)'; c.fillRect(M.x - 12, DI.mY(hi), 24, DI.mY(lo) - DI.mY(hi));
    const col = L > hi ? '#ff6a6a' : inB ? '#8affc0' : '#ffd45a'; c.fillStyle = col; c.beginPath(); c.roundRect(M.x - 6, DI.mY(L), 12, M.y0 - DI.mY(L), 5); c.fill();
    c.fillStyle = col; c.strokeStyle = '#1a1a22'; c.lineWidth = 2; c.beginPath(); c.moveTo(M.x - 14, DI.mY(L)); c.lineTo(M.x - 26, DI.mY(L) - 7); c.lineTo(M.x - 26, DI.mY(L) + 7); c.closePath(); c.fill(); c.stroke();
    SK.tag(c, 'Light', M.x - 4, M.y0 + 30, 18);
    // the wire from the knob to the analog pin, and the pin's reading bar
    c.strokeStyle = '#e8c040'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(KN.x + KN.r + 10, KN.y + 30); c.quadraticCurveTo(170, 600, 206, 556); c.stroke();
    c.fillStyle = '#05050a'; c.beginPath(); c.roundRect(200, 504, 20, 80, 4); c.fill(); c.fillStyle = '#ffe27a'; c.fillRect(204, 580 - 72 * s.val, 12, 72 * s.val);
    SK.tag(c, 'Pin A0', 278, 510, 18, '#fff6ea', 'rgba(140,90,10,0.92)');
    c.strokeStyle = `rgba(255,170,255,${0.4 + 0.6 * b})`; c.lineWidth = 3; c.beginPath(); c.moveTo(330, 500); c.quadraticCurveTo(352, 300, DI.LAMP.x + 40, DI.LAMP.y - 10); c.stroke();
    // the knob
    const a = DI.ang(s.val) - Math.PI / 2;
    c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.arc(KN.x + 3, KN.y + 6, KN.r, 0, 7); c.fill();
    const kg = c.createRadialGradient(KN.x - 14, KN.y - 16, 6, KN.x, KN.y, KN.r); kg.addColorStop(0, '#f0f0f8'); kg.addColorStop(1, '#8a8aa0'); c.fillStyle = kg; c.strokeStyle = '#2a2a34'; c.lineWidth = 3; c.beginPath(); c.arc(KN.x, KN.y, KN.r, 0, 7); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(40,40,52,0.35)'; c.lineWidth = 3; for (let i = 0; i < 16; i++) { const q = a + i * Math.PI / 8; c.beginPath(); c.moveTo(KN.x + Math.cos(q) * (KN.r - 6), KN.y + Math.sin(q) * (KN.r - 6)); c.lineTo(KN.x + Math.cos(q) * (KN.r - 1), KN.y + Math.sin(q) * (KN.r - 1)); c.stroke(); }
    c.strokeStyle = '#e8403a'; c.lineWidth = 6; c.beginPath(); c.moveTo(KN.x + Math.cos(a) * 12, KN.y + Math.sin(a) * 12); c.lineTo(KN.x + Math.cos(a) * (KN.r - 10), KN.y + Math.sin(a) * (KN.r - 10)); c.stroke();
    SK.tag(c, 'Knob', KN.x, KN.y + KN.r + 34, 18);
    SK.animal(c, 'hedgehog', 116, 470, 0.7, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : inB ? 'happy' : 'think' });
    // which way to turn: a curved arrow round the knob toward the band, until it is in
    const goal = SK.clamp(Q.need - s.sun, 0, 1), need = s.phase === 'set' && !g.done && !inB ? (L < lo ? 1 : -1) : 0;
    if (need) { const a0 = a, a1 = a + need * 0.8, rr = KN.r + 24; c.save(); c.strokeStyle = need > 0 ? '#8affc0' : '#ffb08a'; c.fillStyle = c.strokeStyle; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.arc(KN.x, KN.y, rr, Math.min(a0, a1), Math.max(a0, a1)); c.stroke();
      c.translate(KN.x + Math.cos(a1) * rr, KN.y + Math.sin(a1) * rr); c.rotate(a1 + need * Math.PI / 2); c.beginPath(); c.moveTo(10, 0); c.lineTo(-6, -9); c.lineTo(-6, 9); c.closePath(); c.fill(); c.restore(); }
    // guidance: drag the knob's pointer round to the setting for this plant
    const ag = DI.ang(goal) - Math.PI / 2, tipR = KN.r - 14;
    SK.demo(g, c, 'drag', [KN.x + Math.cos(a) * tipR, KN.y + Math.sin(a) * tipR], [KN.x + Math.cos(ag) * tipR, KN.y + Math.sin(ag) * tipR], { never: !need });
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._b = s._b || { n: 0, next: 1.0 }, Q = s.queue[s.i]; if (g.done || s.phase !== 'set' || g.t < B.next || (s.sunUp && g.t - s.sunUp < 0.8)) return;
    const L = g.def.light(s), inB = L >= Q.need - s.w / 2 && L <= Q.need + s.w / 2; if (inB && !(s._bot && s._bot['k' + B.n] === 1)) return;
    const KN = DI.KN, a = DI.ang(s.val) - Math.PI / 2, ag = DI.ang(SK.clamp(Q.need - s.sun, 0, 1)) - Math.PI / 2, r = KN.r - 14;
    if (SK.bot.drag(g, synth, 'k' + B.n, B.next, [KN.x + Math.cos(a) * r, KN.y + Math.sin(a) * r], [KN.x + Math.cos(ag) * r, KN.y + Math.sin(ag) * r], 0.4)) { B.n++; B.next = g.t + 0.3; }
  },
});
