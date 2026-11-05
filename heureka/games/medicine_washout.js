// WASH OUT! (chem_bio MED-05) — a bathroom: a tub of water dyed with medicine, the turtle waiting in a towel for a clear
// bath. Hold the button: the plug comes out and every tick half the tub drains away while the tap refills it with clean
// water, so the colour halves each tick. A chart above the tub draws one bar per tick: 1, 1/2, 1/4, 1/8... falling fast
// at first, then more and more slowly, never quite reaching zero. Let go once the bar is under the "Clear" line: the
// plug goes back, the turtle hops in and splashes. Let go after two ticks expecting it to be empty and a quarter is
// still left: the turtle comes out dyed pink.
// Level 0: two tubs (the second must be paler). Level 1: paler lines. Level 2: the second tub holds two medicines,
// one that halves every tick and one that halves only every second tick; both must be under the line.
const WO = (() => {
  const TICK = 0.6, TUB = { x0: 52, x1: 300, top: 360, bot: 476 }, CH = { x: 48, y0: 296, y1: 156, w: 272 }, BTN = { x: 180, y: 566, w: 236, h: 62 };
  const SETS = [
    { tile: ['#bfe6ee', '#e6f6f8'], cols: ['#e84a8a', '#4a6ae8'] },
    { tile: ['#f6e2c8', '#fff4e6'], cols: ['#e8642a', '#3a9a6a'] },
    { tile: ['#dcd6f4', '#f2eefc'], cols: ['#c83ad8', '#e8a020'] },
    { tile: ['#cfeccf', '#effaef'], cols: ['#e83a4a', '#2a8ac8'] },
  ];
  function paint(o, S) {
    N4.vgrad(o, 0, 0, 360, 500, S.tile); o.strokeStyle = 'rgba(255,255,255,0.7)'; o.lineWidth = 2;
    for (let y = 0; y < 500; y += 30) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); } for (let x = 0; x < 360; x += 30) { o.beginPath(); o.moveTo(x, 0); o.lineTo(x, 500); o.stroke(); }
    N4.vgrad(o, 0, 496, 360, 144, ['#a8c0d0', '#8aa4b8']); o.fillStyle = 'rgba(255,255,255,0.15)'; for (let x = 0; x < 360; x += 40) for (let y = 500; y < 640; y += 40) if (((x + y) / 40) % 2 < 1) o.fillRect(x, y, 40, 40);
    // the tap on the wall
    o.fillStyle = '#c8ccd8'; o.strokeStyle = '#6a7080'; o.lineWidth = 2.5; o.beginPath(); o.roundRect(70, 318, 46, 14, 6); o.fill(); o.stroke(); o.beginPath(); o.roundRect(104, 318, 12, 30, 5); o.fill(); o.stroke();
    o.beginPath(); o.arc(80, 312, 9, 0, 7); o.fill(); o.stroke();
    // feet of the tub
    o.fillStyle = '#d8b060'; for (const x of [80, 272]) { o.beginPath(); o.ellipse(x, 500, 12, 8, 0, 0, 7); o.fill(); }
    P.grain(o, 360, 640, 0.025);
  }
  function tub(c, S, s, t, drain) {
    const { x0, x1, top, bot } = TUB;
    // the water: each medicine tints it by how much of it is left
    c.save(); c.beginPath(); c.moveTo(x0 + 6, top + 8); c.lineTo(x1 - 6, top + 8); c.quadraticCurveTo(x1 - 8, bot, x1 - 50, bot); c.lineTo(x0 + 50, bot); c.quadraticCurveTo(x0 + 8, bot, x0 + 6, top + 8); c.closePath(); c.clip();
    c.fillStyle = '#d8f0ff'; c.fillRect(x0, top, x1 - x0, bot - top);
    s.meds.forEach((m, i) => { c.fillStyle = S.cols[i]; c.globalAlpha = 0.88 * m.c; c.fillRect(x0, top, x1 - x0, bot - top); }); c.globalAlpha = 1;
    // a swirl over the drain while it drains
    if (drain) { const dx = (x0 + x1) / 2 + 40; c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2.5; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(dx, bot - 14, 8 + i * 9, t * 8 + i, t * 8 + i + 3.6); c.stroke(); } }
    c.fillStyle = 'rgba(255,255,255,0.45)'; for (let i = 0; i < 6; i++) { const x = x0 + 30 + i * 38 + Math.sin(t * 2 + i) * 6; c.beginPath(); c.ellipse(x, top + 12, 14, 3, 0, 0, 7); c.fill(); }
    c.restore();
    // the white enamel tub
    c.strokeStyle = '#8a98a8'; c.lineWidth = 3; c.fillStyle = '#fbfcff';
    c.beginPath(); c.moveTo(x0 - 6, top); c.lineTo(x1 + 6, top); c.lineTo(x1 + 6, top + 10); c.quadraticCurveTo(x1, bot + 18, x1 - 50, bot + 18); c.lineTo(x0 + 50, bot + 18); c.quadraticCurveTo(x0, bot + 18, x0 - 6, top + 10); c.closePath();
    c.save(); c.clip(); c.fillStyle = '#fbfcff'; c.fillRect(x0 - 10, top, x1 - x0 + 20, 12); c.fillRect(x0 - 10, bot - 2, x1 - x0 + 20, 30); c.restore(); c.stroke();
    c.fillStyle = '#fbfcff'; c.beginPath(); c.roundRect(x0 - 10, top - 8, x1 - x0 + 20, 14, 7); c.fill(); c.stroke();
  }
  return { TICK, TUB, CH, BTN, SETS, paint, tub };
})();
MG.add({
  id: 'medicine_washout', stage: 'medicine', cmd: 'DRAIN TILL PALE, THEN LET GO!', time: 7, mood: 'party', winText: 'Clear bath!', failText: 'Still a quarter left!',
  card: { title: 'Halving, again and again', kind: 'Medicine', ref: 'Drug half-life (elimination)',
    text: 'Your body removes a medicine a bit like this tub. In each stretch of time it clears the same share of what is left, often half. That stretch is called the half-life.\n\nSo the amount goes 1, then 1/2, 1/4, 1/8. It falls fast at first, then slower and slower, and never quite reaches zero.\n\nAfter two half-lives a quarter is still there. It takes about four or five half-lives to be nearly gone. Some medicines have a short half-life and some a long one, which is why some are taken often and some once a day.',
    note: 'The body clears a fixed share of a drug each half-life, so the level halves and halves again.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.S = WO.SETS[s.v]; s.L = L;
    const lines = [[0.15, 0.08], [0.1, 0.05], [0.15, 0.15]][L];
    s.tubs = [{ meds: [{ half: 1 }], line: lines[0] }, { meds: L >= 2 ? [{ half: 1 }, { half: 2 }] : [{ half: 1 }], line: lines[1] }];
    s.i = 0; s.phase = 'ready'; s.hopT = 0; s.nextT = 0; s.drainT = 0; s.tickN = 0; start(s);
    function start(s) { const T = s.tubs[s.i]; s.meds = T.meds.map(m => ({ half: m.half, c: 1 })); s.line = T.line; s.hist = [s.meds.map(m => 1)]; s.tickN = 0; }
  },
  // ticks needed for every medicine in this tub to drop under its line
  need(s) { let n = 0; for (const m of s.tubs[s.i].meds) { let c = 1, k = 0; while (c >= s.tubs[s.i].line) { k++; c = Math.pow(0.5, k / m.half); } n = Math.max(n, k); } return n; },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.phase !== 'ready' || !N4.inBox(WO.BTN, x, y, 16)) return; SK.holdStart(g); s.phase = 'drain'; s.drainT = g.t; g.sfx('click'); },
  up(g) {
    const s = g.s; if (s.phase !== 'drain') return; SK.holdEnd(g); g.sfx('click');
    if (!s.tickN) { s.phase = 'ready'; return; } // let go before the first tick: the plug just goes back
    const clear = s.meds.every(m => m.c < s.line); s.phase = clear ? 'bath' : 'dyed'; s.hopT = g.t; g.sfx('splash');
    if (!clear) { g.sfx('laugh'); g.fail(); }
  },
  update(g, dt) {
    const s = g.s;
    if (s.phase === 'drain') { while (g.t - s.drainT >= (s.tickN + 1) * WO.TICK) { s.tickN++; for (const m of s.meds) m.c = Math.pow(0.5, s.tickN / m.half); s.hist.push(s.meds.map(m => m.c)); g.sfx('drip'); g.sfx('bubble', { vol: 0.5 }); } }
    if (s.phase === 'bath' && !g.done && g.t - s.hopT > 0.45) { if (s.i >= s.tubs.length - 1) { s.phase = 'won'; g.sfx('cheer'); g.win(); } else { s.phase = 'next'; s.nextT = g.t + 0.35; g.sfx('chime'); } }
    if (s.phase === 'next' && g.t >= s.nextT) { s.i++; const T = s.tubs[s.i]; s.meds = T.meds.map(m => ({ half: m.half, c: 1 })); s.line = T.line; s.hist = [s.meds.map(() => 1)]; s.tickN = 0; s.phase = 'ready'; g.sfx('wave'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, S = s.S, won = g.result === 'win', lost = g.result === 'fail', CH = WO.CH, BTN = WO.BTN;
    c.drawImage(g.bake('washout_bg' + s.v, o => WO.paint(o, S)), 0, 0, 360, 640);
    // the chart: one bar per tick for each medicine, and the line it must get under
    c.fillStyle = 'rgba(255,255,255,0.88)'; c.strokeStyle = '#6a7a8a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(CH.x - 12, CH.y1 - 14, CH.w + 24, CH.y0 - CH.y1 + 26, 14); c.fill(); c.stroke();
    const n = s.meds.length, bw = n > 1 ? 13 : 24, gap = n > 1 ? 30 : 32;
    s.hist.forEach((row, k) => row.forEach((v, j) => { const x = CH.x + 6 + k * gap + j * (bw + 2), h = (CH.y0 - CH.y1) * v; c.fillStyle = S.cols[j]; c.beginPath(); c.roundRect(x, CH.y0 - h, bw, Math.max(2, h), 3); c.fill(); }));
    const ly = CH.y0 - (CH.y0 - CH.y1) * s.line; c.save(); c.strokeStyle = '#2a9a4a'; c.lineWidth = 3; c.setLineDash([7, 5]); c.beginPath(); c.moveTo(CH.x - 4, ly); c.lineTo(CH.x + CH.w + 4, ly); c.stroke(); c.restore();
    SK.tag(c, 'Clear', CH.x + CH.w - 26, ly - 18, 18, '#fff6ea', 'rgba(30,130,60,0.92)');
    SK.tag(c, 'Medicine', CH.x + 60, CH.y1 + 4, 18);
    // the water pouring from the tap as it refills
    const draining = s.phase === 'drain';
    if (draining && (g.t - s.drainT) % WO.TICK < 0.4) { c.fillStyle = 'rgba(200,235,255,0.85)'; c.fillRect(106, 348, 8, WO.TUB.top + 14 - 348); }
    WO.tub(c, S, s, t, draining && (g.t - s.drainT) % WO.TICK < 0.4);
    // the plug's chain: hanging in, or pulled up
    const px = 220; c.strokeStyle = '#8a8a9a'; c.lineWidth = 2; c.setLineDash([3, 2]); c.beginPath(); c.moveTo(WO.TUB.x1 - 6, WO.TUB.top + 2); c.quadraticCurveTo(px + 30, WO.TUB.top + 40, px, draining ? WO.TUB.top + 30 : WO.TUB.bot - 14); c.stroke(); c.setLineDash([]);
    c.fillStyle = '#3a3a48'; c.beginPath(); c.ellipse(px, draining ? WO.TUB.top + 30 : WO.TUB.bot - 12, 11, 6, 0, 0, 7); c.fill();
    SK.tag(c, (s.i + 1) + ' / ' + s.tubs.length, 316, 336, 18);
    // the turtle: waiting in a towel; hops in on release, clean or dyed
    const hop = s.phase === 'bath' || s.phase === 'dyed' || won ? SK.clamp((t - s.hopT) / 0.4, 0, 1) : 0;
    const tx = SK.lerp(320, 200, hop), ty = SK.lerp(498, 400, hop) - Math.sin(hop * Math.PI) * 60;
    const tint = s.phase === 'dyed' || (lost && hop) ? S.cols[s.meds.findIndex(m => m.c >= s.line)] || S.cols[0] : undefined;
    SK.animal(c, 'turtle', tx, ty, 1.2, { t, pose: s.phase === 'bath' || won ? 'cheer' : lost ? 'sad' : 'idle', expr: won || s.phase === 'bath' ? 'laugh' : lost ? 'wow' : 'happy', facing: -1, tint, noShadow: hop > 0 });
    if (!hop) { c.fillStyle = '#ff9ab0'; c.globalAlpha = 0.85; c.beginPath(); c.roundRect(300, 470, 40, 22, 8); c.fill(); c.globalAlpha = 1; }
    // the hold button, with feedback while draining
    const held = draining;
    N4.button(c, BTN, held ? 'Draining...' : 'Hold to drain', { pressed: held, col: '#3a8ae8', size: 22 });
    if (draining && g.level <= 1 && !g.done) { const ok = s.meds.every(m => m.c < s.line); SK.tag(c, ok ? 'Let go now!' : 'Keep holding...', 180, 512, 20, '#fff6ea', ok ? 'rgba(40,150,70,0.95)' : 'rgba(30,14,36,0.78)'); }
    // guidance: hold for exactly as many ticks as this tub needs
    const ready = s.phase === 'ready' && !g.done;
    if (ready) SK.glow(c, g, BTN.x, BTN.y, 52, '#e8563a', { level: 2 });
    const dur = (g.def.need(s) + 0.4) * WO.TICK; SK.demo(g, c, 'hold', [BTN.x + 40, BTN.y + 4], null, { never: !ready, period: Math.max(1.6, dur / 0.65) });
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._b = s._b || {}; if (g.done || (s.phase !== 'ready' && s.phase !== 'drain')) return; const dur = (g.def.need(s) + 0.4) * WO.TICK;
    if (B['t' + s.i] == null) B['t' + s.i] = s.i ? g.t + 0.2 : 1.0; SK.bot.hold(g, synth, 'h' + s.i, B['t' + s.i], WO.BTN.x, WO.BTN.y, dur);
  },
});
