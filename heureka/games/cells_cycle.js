// CYCLE! (chem_bio APB-23) — a PCR machine on a lab bench, with a zoom bubble into its tiny tube: one DNA molecule.
// Hold the hot button: the block glows red, the thermometer climbs into the red band and each DNA ladder unzips into
// two strands. Let go: it cools into the blue band and a polymerase builds a new partner along every strand. Each
// heat-then-cool cycle doubles the DNA (1, 2, 4, 8...). Keep heating and never cool, and the strands just float apart
// with nothing copied. Level 1 needs 16 copies; level 2 needs 16 with a quicker machine and a shorter copy window.
const TB = { x: 318, y0: 452, y1: 196 }, TMIN = 52, TMAX = 98, HOT = 92, COOL = 68;
const ZC = [168, 262], ZR = 118, BTN = [180, 552];
const tY = T => SK.lerp(TB.y0, TB.y1, (T - TMIN) / (TMAX - TMIN));

function paintLab(o) {
  const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#e8f0fa'); bg.addColorStop(0.7, '#d0def0'); bg.addColorStop(1, '#b8c8de');
  o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  // shelves with glassware
  o.fillStyle = '#c8b090'; o.fillRect(0, 150, 360, 8);
  const cols = ['#7ad0ff', '#ffb0d0', '#a8f07a', '#ffd25a'];
  for (let i = 0; i < 7; i++) { const x = 18 + i * 50; o.fillStyle = 'rgba(255,255,255,0.6)'; o.strokeStyle = '#8aa0b8'; o.lineWidth = 2; o.beginPath(); o.roundRect(x, 112, 22, 38, 6); o.fill(); o.stroke(); o.fillStyle = cols[i % 4]; o.beginPath(); o.roundRect(x + 2, 130, 18, 18, 5); o.fill(); }
  // the bench
  o.fillStyle = '#e8d8c0'; o.fillRect(0, 470, 360, 170); o.fillStyle = '#c8b498'; o.fillRect(0, 470, 360, 8);
  // the PCR machine body
  const mg = o.createLinearGradient(0, 430, 0, 610); mg.addColorStop(0, '#f6f8fc'); mg.addColorStop(1, '#c8d0dc');
  o.fillStyle = mg; o.strokeStyle = '#5a6a80'; o.lineWidth = 3; o.beginPath(); o.roundRect(70, 440, 220, 168, 18); o.fill(); o.stroke();
  o.fillStyle = '#3a4a60'; o.beginPath(); o.roundRect(92, 456, 120, 34, 8); o.fill(); // the heating block slot
  o.fillStyle = '#2a3a50'; o.beginPath(); o.roundRect(224, 458, 50, 28, 6); o.fill(); // little screen
}
// one DNA ladder centred on (x, y), length L; sep pulls the two strands apart (0 joined .. 1 separate, drawn elsewhere)
function ladder(c, x, y, L, gap, colA, colB, rungs = 1, partial = 1, pol = false, t = 0) {
  const n = Math.max(5, Math.round(L / 6));
  const wav = i => Math.sin(i / n * Math.PI * 2 + t * 0) * 2;
  if (rungs > 0) { c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 1.6; for (let i = 0; i <= n * partial; i++) { const xx = x - L / 2 + i / n * L; c.beginPath(); c.moveTo(xx, y - gap / 2 + wav(i)); c.lineTo(xx, y + gap / 2 + wav(i)); c.stroke(); } }
  c.lineCap = 'round'; c.lineWidth = Math.max(2.5, L / 16);
  c.strokeStyle = colA; c.beginPath(); for (let i = 0; i <= n; i++) { const xx = x - L / 2 + i / n * L; i ? c.lineTo(xx, y - gap / 2 + wav(i)) : c.moveTo(xx, y - gap / 2 + wav(i)); } c.stroke();
  if (colB && partial > 0) { c.strokeStyle = colB; c.beginPath(); const m = Math.round(n * partial); for (let i = 0; i <= m; i++) { const xx = x - L / 2 + i / n * L; i ? c.lineTo(xx, y + gap / 2 + wav(i)) : c.moveTo(xx, y + gap / 2 + wav(i)); } c.stroke();
    if (pol && partial < 1) { const xx = x - L / 2 + partial * L; c.fillStyle = '#ffb030'; c.strokeStyle = '#a86010'; c.lineWidth = 1.5; c.beginPath(); c.arc(xx, y + gap / 2, Math.max(4, L / 10), 0, 7); c.fill(); c.stroke(); } }
}
// grid slots for k items inside the zoom bubble
function slots(k) {
  const cols = k <= 2 ? 1 : k <= 8 ? 2 : 4, rows = Math.ceil(k / cols), W = 168, H = 170, w = W / cols, h = H / rows, out = [];
  for (let i = 0; i < k; i++) out.push({ x: ZC[0] - W / 2 + w * (i % cols + 0.5), y: ZC[1] - H / 2 + h * (Math.floor(i / cols) + 0.5), L: Math.min(120, w * 0.82), gap: Math.min(16, h * 0.32) });
  return out;
}

MG.add({
  id: 'cells_cycle', stage: 'cells', cmd: 'HEAT AND COOL TO COPY DNA!', time: 7, mood: 'sea', winText: 'DNA doubled!', failText: 'No copies!',
  card: { title: 'Copy DNA by heating and cooling', kind: 'Biology', ref: 'PCR (polymerase chain reaction)',
    text: 'PCR makes millions of copies of a piece of DNA from just a little. It needs a tiny tube with the right ingredients, and a machine that heats and cools it.\n\nHeating to about 95 °C pulls apart the two strands of each DNA molecule. Cooling to about 60 °C lets short starter pieces called primers stick on, and at about 72 °C an enzyme called a polymerase builds a new partner strand along each one.\n\nEach heat-and-cool cycle doubles the DNA: 1, 2, 4, 8, 16. Thirty cycles make about a billion copies, enough to test for a virus.',
    note: 'Heating separates the DNA strands and cooling lets each one be copied, so every cycle doubles the DNA.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level);
    s.T = 58; s.n = 1; s.sep = 0; s.cp = 0; s.goal = L ? 16 : 8; s.heat = [70, 74, 95][L]; s.cool = [80, 84, 105][L]; s.copyDur = [0.5, 0.45, 0.32][L];
    s.hold = false; s.dbl = -1; s.v = SK.variant(g, 4); [s.ca, s.cb] = [['#7ad0ff', '#ffb070'], ['#a8f07a', '#ff8ac8'], ['#c8a0ff', '#ffe060'], ['#ff8a7a', '#7ae8e0']][s.v];
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; s.hold = true; g.sfx('click'); },
  up(g) { const s = g.s; if (s.hold) g.sfx('click'); s.hold = false; },
  update(g, dt) {
    const s = g.s;
    s.T = s.hold && !g.done ? Math.min(TMAX, s.T + s.heat * dt) : Math.max(TMIN + 4, s.T - s.cool * dt);
    // hot: every ladder unzips
    if (s.T >= HOT && s.cp === 0 && s.sep < 1) { const was = s.sep; s.sep = Math.min(1, s.sep + dt / 0.28); if (was < 1 && s.sep >= 1) g.sfx('swoosh'); }
    // cool: each separated strand gets a new partner
    if (s.T <= COOL && s.sep >= 1 && !g.done) { s.cp = Math.min(1, s.cp + dt / s.copyDur); if (s.cp >= 1) { s.n *= 2; s.sep = 0; s.cp = 0; s.dbl = g.t; g.sfx('ding'); g.sfx('sparkle'); if (s.n >= s.goal) { g.win(); g.sfx('cheer'); } } }
    if (g.result === 'fail' && s.failAt == null) { s.failAt = g.t; g.sfx('fail'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('cells_cycle_lab', paintLab), 0, 0, 360, 640);
    const heatK = SK.clamp((s.T - 60) / 35, 0, 1);
    // heating block glow
    c.fillStyle = P.mix('#4a7ac8', '#ff4a2a', heatK); c.beginPath(); c.roundRect(96, 460, 112, 26, 6); c.fill();
    if (heatK > 0.5) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,120,60,${0.3 * heatK})`; c.beginPath(); c.ellipse(152, 456, 80, 30, 0, 0, 7); c.fill(); c.restore(); }
    if (s.T < 66) { c.strokeStyle = 'rgba(200,230,255,0.8)'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { const k = (t * 0.8 + i / 3) % 1; c.beginPath(); c.arc(110 + i * 40, 452 - k * 30, 3 + k * 3, 0, 7); c.stroke(); } }
    // the tube in the block, glowing as the DNA multiplies
    const glow = Math.log2(s.n) / Math.log2(s.goal);
    c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(120,255,200,${0.15 + 0.5 * glow})`; c.beginPath(); c.arc(152, 430, 26 + glow * 14, 0, 7); c.fill(); c.restore();
    c.fillStyle = 'rgba(255,255,255,0.85)'; c.strokeStyle = '#6a7a90'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(140, 402); c.lineTo(164, 402); c.lineTo(160, 470); c.quadraticCurveTo(152, 482, 144, 470); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = P.mix('#bff0ff', '#7affc0', glow); c.beginPath(); c.moveTo(143, 440); c.lineTo(161, 440); c.lineTo(159, 470); c.quadraticCurveTo(152, 478, 145, 470); c.fill();
    c.fillStyle = '#ff9ab8'; c.beginPath(); c.roundRect(136, 394, 32, 10, 4); c.fill(); c.stroke();
    // the zoom bubble
    c.strokeStyle = 'rgba(90,110,140,0.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(140, 404); c.lineTo(ZC[0] - 70, ZC[1] + 92); c.moveTo(164, 404); c.lineTo(ZC[0] + 70, ZC[1] + 92); c.stroke();
    const zb = c.createRadialGradient(ZC[0] - 30, ZC[1] - 40, 10, ZC[0], ZC[1], ZR); zb.addColorStop(0, '#2a4a7a'); zb.addColorStop(1, '#14284a');
    c.fillStyle = zb; c.beginPath(); c.arc(ZC[0], ZC[1], ZR, 0, 7); c.fill(); c.strokeStyle = '#e8f0fa'; c.lineWidth = 6; c.stroke(); c.strokeStyle = '#6a7a90'; c.lineWidth = 2; c.stroke();
    c.save(); c.beginPath(); c.arc(ZC[0], ZC[1], ZR - 3, 0, 7); c.clip();
    const par = slots(s.n), kid = slots(s.n * 2), jig = (i) => Math.sin(t * 3 + i) * heatK * 2;
    if (s.sep === 0) for (const [i, p] of par.entries()) ladder(c, p.x + jig(i), p.y, p.L, p.gap, s.ca, s.n > 1 ? s.cb : s.ca, 1, 1, false, t);
    else {
      const k = SK.easeInOut(s.sep);
      for (const [i, p] of par.entries()) for (const side of [0, 1]) {
        const q = kid[i * 2 + side], x = SK.lerp(p.x, q.x, k) + jig(i * 2 + side), y = SK.lerp(p.y + (side ? p.gap / 2 : -p.gap / 2), q.y - q.gap / 2, k), L = SK.lerp(p.L, q.L, k);
        // the old strand (blue) and, while cool, its new partner (orange) zipping along with the polymerase
        ladder(c, x, y + q.gap / 2, L, q.gap, s.ca, s.cp > 0 ? s.cb : null, s.cp > 0 ? 1 : 0, s.cp, true, t);
      }
      if (lost && s.cp === 0) for (let i = 0; i < 6; i++) { c.fillStyle = 'rgba(122,208,255,0.6)'; c.beginPath(); c.arc(ZC[0] + Math.cos(i + t) * 70, ZC[1] + Math.sin(i * 2 + t) * 60, 3, 0, 7); c.fill(); }
    }
    if (s.dbl >= 0 && t - s.dbl < 0.5) { c.fillStyle = `rgba(255,255,220,${0.4 * (1 - (t - s.dbl) / 0.5)})`; c.fillRect(ZC[0] - ZR, ZC[1] - ZR, ZR * 2, ZR * 2); }
    c.restore();
    // the copy tally: one dot per molecule, up to the goal
    for (let i = 0; i < s.goal; i++) { const x = 231 + (i % 8) * 5.2, y = 466 + Math.floor(i / 8) * 9, on = i < s.n; c.fillStyle = on ? '#7affc0' : 'rgba(120,160,200,0.25)'; c.beginPath(); c.arc(x, y, 2.2, 0, 7); c.fill(); }
    SK.tag(c, (won ? '×' + s.n : s.n + ' / ' + s.goal + ' copies'), ZC[0] + 92, ZC[1] - 92, won ? 22 : 18, '#fff6ea', s.dbl >= 0 && t - s.dbl < 0.4 ? 'rgba(60,160,110,0.9)' : 'rgba(30,40,70,0.75)');
    // the thermometer with its hot and cool bands
    c.fillStyle = '#fff'; c.strokeStyle = '#5a6a80'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(TB.x - 11, TB.y1 - 14, 22, TB.y0 - TB.y1 + 22, 11); c.fill(); c.stroke();
    c.beginPath(); c.arc(TB.x, TB.y0 + 18, 17, 0, 7); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,80,60,0.35)'; c.fillRect(TB.x - 8, tY(TMAX), 16, tY(HOT) - tY(TMAX)); c.fillStyle = 'rgba(80,150,255,0.35)'; c.fillRect(TB.x - 8, tY(COOL), 16, tY(TMIN) - tY(COOL));
    const tc = P.mix('#4a8ae8', '#ff3a2a', heatK); c.fillStyle = tc; c.beginPath(); c.arc(TB.x, TB.y0 + 18, 12, 0, 7); c.fill(); c.fillRect(TB.x - 5, tY(s.T), 10, TB.y0 + 18 - tY(s.T));
    // the hot button
    const pr = s.hold ? 1 : 0; c.fillStyle = '#8a2a20'; c.beginPath(); c.ellipse(BTN[0], BTN[1] + 6, 40, 14, 0, 0, 7); c.fill();
    c.fillStyle = s.hold ? '#ff6a4a' : '#e8402a'; c.beginPath(); c.ellipse(BTN[0], BTN[1] + pr * 4, 40, 14, 0, 0, 7); c.fill(); c.beginPath(); c.rect(BTN[0] - 40, BTN[1] + pr * 4 - 0, 80, 6 - pr * 4); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.ellipse(BTN[0] - 12, BTN[1] - 4 + pr * 4, 14, 4, 0, 0, 7); c.fill();
    // flame icon on the button
    c.fillStyle = '#ffe07a'; c.beginPath(); c.moveTo(BTN[0], BTN[1] - 10 + pr * 4); c.quadraticCurveTo(BTN[0] + 8, BTN[1] + pr * 4, BTN[0], BTN[1] + 6 + pr * 4); c.quadraticCurveTo(BTN[0] - 8, BTN[1] + pr * 4, BTN[0], BTN[1] - 10 + pr * 4); c.fill();
    // the ant technician
    SK.animal(c, 'ant', 40, 600, 0.95, { t, pose: won ? 'cheer' : s.hold ? 'point' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'happy' });
    // guidance: hold while the needle climbs to red, let go once the ladders unzip
    if (!g.done && !s.hold && s.sep < 1) SK.glow(c, g, BTN[0], BTN[1], 44, '#ffe27a', { level: 2 });
    if (!g.done && s.hold && s.sep >= 1) { const p = 0.5 + 0.5 * Math.sin(t * 10); c.strokeStyle = `rgba(80,150,255,${0.5 + 0.5 * p})`; c.lineWidth = 4; c.beginPath(); c.arc(TB.x, (tY(COOL) + tY(TMIN)) / 2, 22 + p * 4, 0, 7); c.stroke(); }
    SK.tag(c, 'DNA', ZC[0] - 86, ZC[1] - 96, 20); SK.tag(c, 'Hold to heat', BTN[0], BTN[1] + 36, 18);
    // what to do now: heat until the ladders unzip, then let go and wait while it cools and copies
    if (!g.done) { if (s.hold && s.sep >= 1) SK.tag(c, 'Let go to cool!', ZC[0], ZC[1] + ZR + 20 - Math.abs(Math.sin(t * 8)) * 4, 20, '#bfe6ff', 'rgba(30,70,140,0.9)'); else if (s.hold) SK.tag(c, 'Heating...', ZC[0], ZC[1] + ZR + 20, 18, '#ffd0a0'); else if (s.sep >= 1) SK.tag(c, 'Copying...', ZC[0], ZC[1] + ZR + 20, 18, '#bfe6ff'); }
    if (s.sep < 1 && s.cp === 0) SK.demo(g, c, 'hold', BTN, null, { period: 2.0 });
  },
  // the bot: hold until the strands have unzipped, let go until the copies are made, repeat
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < 0.6) return;
    if (!s.hold && s.sep < 1 && s.cp === 0) synth('down', BTN[0], BTN[1]);
    else if (s.hold && s.sep >= 1) synth('up', BTN[0], BTN[1]);
  },
});
