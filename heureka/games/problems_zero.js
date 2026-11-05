// START AT ZERO! (problems PS-08) — bar charts on a big board in front of an alarmed audience. Each chart's axis starts
// high, so one bar looks two or three times taller than the other. Drag the chart's bottom edge down to the glowing
// zero line: the bars grow from the true floor, the gap shrinks to its real size and the audience calms down. Three
// charts in a row (four at level 2, with less room for error). Drag the edge up instead and the gap balloons until the
// duck faints.
const TAU = Math.PI * 2, TOP = 176, Z = 520, F0 = 410, X0 = 56, X1 = 304;
const CHARTS = [
  { v: [52, 50], fl: 48, top: 54, col: ['#e8604a', '#4aa8d8'] },
  { v: [31, 33, 30], fl: 28.5, top: 34, col: ['#f0b030', '#8ac850', '#b070d0'] },
  { v: [81, 84], fl: 78, top: 86, col: ['#4ab0a0', '#e870a0'] },
  { v: [62, 60, 64], fl: 58, top: 66, col: ['#5a9ad8', '#f08a3a', '#8ac850'] },
];
function paintRoom(o) {
  const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#3a4a7a'); bg.addColorStop(1, '#6a5a8a'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  const sp = o.createRadialGradient(180, 120, 20, 180, 300, 320); sp.addColorStop(0, 'rgba(255,240,200,0.35)'); sp.addColorStop(1, 'rgba(255,240,200,0)'); o.fillStyle = sp; o.fillRect(0, 0, 360, 640);
  // the board
  o.fillStyle = 'rgba(20,10,30,0.35)'; o.beginPath(); o.roundRect(30, 142, 308, 410, 16); o.fill();
  o.fillStyle = '#fff8ec'; o.beginPath(); o.roundRect(24, 134, 312, 410, 16); o.fill(); o.strokeStyle = '#c8a878'; o.lineWidth = 6; o.stroke();
  o.strokeStyle = 'rgba(120,100,140,0.12)'; o.lineWidth = 1; for (let y = TOP; y < 540; y += 24) { o.beginPath(); o.moveTo(40, y); o.lineTo(320, y); o.stroke(); }
  // the floor of the room, where the audience sits
  o.fillStyle = '#4a3050'; o.fillRect(0, 560, 360, 80);
  P.grain(o, 360, 640, 0.05); P.vignette(o, 360, 640, 0.35);
}
// the axis's bottom value when its edge sits at y = F: zero at the zero line, the chart's own start at F0, and creeping up
// towards the smallest bar as the edge is dragged higher (so the gap balloons)
function floorVal(ch, F) { if (F >= F0) return ch.fl * (Z - F) / (Z - F0); const lo = Math.min(...ch.v); return ch.fl + (lo - 0.25 - ch.fl) * SK.clamp((F0 - F) / (F0 - 300), 0, 1); }
MG.add({
  id: 'startzero', stage: 'problems', cmd: 'DRAG EACH AXIS DOWN TO ZERO!', time: 6, mood: 'party', winText: 'True sizes!', failText: 'Misleading!',
  card: { title: 'Bars start at zero', kind: 'Problem solving', ref: 'Truncated axes in bar charts',
    text: 'A bar chart shows each amount as the length of a bar. If the axis starts at zero, a bar twice as long means twice as much.\n\nThese charts started their axis near the top of the values, so a small difference looked huge: one bar looked three times taller than the other when it was only a little bigger. Dragging the bottom down to zero showed the true sizes.\n\nWhen you read a chart, check where the axis starts. Line charts are different: they show change over time, and they don\'t always need to start at zero.',
    note: 'A bar chart whose axis doesn\'t start at zero makes small differences look huge.' },
  init(g) {
    const s = g.s; s.list = CHARTS.slice(0, g.level >= 2 ? 4 : 3); s.i = 0; s.F = F0; s.ok = 0; s.tol = g.level >= 2 ? 7 : 12; s.slide = 0; s.calm = 1;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.ok) return; if (Math.abs(y - s.F) < 40 && x > 30 && x < 330) { s.drag = { y0: y, F0: s.F }; g.sfx('click'); } },
  move(g, x, y) {
    const s = g.s, d = s.drag; if (!d) return; s.F = SK.clamp(d.F0 + (y - d.y0), 236, Z + 60);
    if (s.F < 300 && !g.done) { s.faint = g.t; s.drag = null; g.sfx('wrong'); g.sfx('laugh'); g.fail(); }
  },
  up(g) {
    const s = g.s; if (!s.drag) return; s.drag = null;
    if (Math.abs(s.F - Z) <= s.tol) { s.F = Z; s.ok = g.t; g.sfx('ding'); g.sfx('sparkle'); g.burst(180, Z, ['#ffe27a', '#fff6ea', '#8ad0a0'], 14, 140); }
    else g.sfx('tap');
  },
  update(g, dt) {
    const s = g.s;
    if (s.ok && g.t - s.ok > 0.7) { s.i++; s.ok = 0; s.F = F0; if (s.i >= s.list.length) { if (!g.done) { g.win(); g.sfx('cheer'); } s.i = s.list.length - 1; s.F = Z; s.end = true; } else { s.slide = g.t; g.sfx('swoosh'); } }
    // how alarmed the audience is: the apparent ratio of the tallest bar to the shortest
    const ch = s.list[s.i], fv = floorVal(ch, s.F), hi = Math.max(...ch.v), lo = Math.min(...ch.v), ratio = (hi - fv) / Math.max(0.3, lo - fv);
    s.calm += ((s.end || s.ok ? 0 : SK.clamp((ratio - 1.05) / 1.5, 0, 1.5)) - s.calm) * Math.min(1, dt * 5);
  },
  draw(g, c) {
    const s = g.s, t = g.t, ch = s.list[s.i];
    c.drawImage(g.bake('startzero', paintRoom), 0, 0, 360, 640);
    const sl = s.slide ? SK.clamp((t - s.slide) / 0.35, 0, 1) : 1, off = (1 - SK.easeOut(sl)) * 300;
    c.save(); c.beginPath(); c.rect(26, 136, 308, 406); c.clip(); c.translate(off, 0);
    // the true zero line: a glowing dashed floor
    c.save(); c.strokeStyle = '#4ab070'; c.lineWidth = 4; c.setLineDash([10, 8]); c.lineDashOffset = -t * 20; c.beginPath(); c.moveTo(X0 - 12, Z); c.lineTo(X1 + 12, Z); c.stroke(); c.restore();
    B9.txt(c, '0', X0 - 22, Z, 22, '#2a7a4a');
    // the bars, growing up from the chart's bottom edge to their values (the top of the chart is a fixed value)
    const F = s.F, fv = floorVal(ch, F), n = ch.v.length, bw = n === 2 ? 70 : 54, gap = (X1 - X0 - n * bw) / (n + 1);
    ch.v.forEach((v, i) => {
      const x = X0 + gap + i * (bw + gap), y = TOP + (ch.top - v) / (ch.top - fv) * (F - TOP), h = F - y;
      if (h > 0) B9.txt(c, String(v), x + bw / 2, Math.max(TOP + 4, y - 14), 20, '#3a2a4a');
      if (h > 0) { const gr = c.createLinearGradient(x, 0, x + bw, 0); gr.addColorStop(0, P.shade(ch.col[i], 0.2)); gr.addColorStop(1, P.shade(ch.col[i], -0.15)); c.fillStyle = gr; c.beginPath(); c.roundRect(x, y, bw, h, [8, 8, 0, 0]); c.fill(); c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(x + 6, y + 6, 6, Math.max(0, h - 12)); }
    });
    // the axis: a left rule from the top down to the draggable bottom edge
    c.strokeStyle = '#3a2a4a'; c.lineWidth = 3; c.beginPath(); c.moveTo(X0 - 6, TOP - 10); c.lineTo(X0 - 6, F); c.stroke();
    for (let k = 0; k <= 4; k++) { const y = TOP + k * (F - TOP) / 4; c.beginPath(); c.moveTo(X0 - 12, y); c.lineTo(X0 - 6, y); c.stroke(); }
    // the bottom edge with its grab handle
    const hot = !!s.drag; c.fillStyle = hot ? '#e8604a' : '#5a4a6a'; c.beginPath(); c.roundRect(X0 - 14, F - 5, X1 - X0 + 28, 10, 5); c.fill();
    c.fillStyle = hot ? '#ff8a6a' : '#7a6a8a'; c.beginPath(); c.roundRect(150, F - 13, 60, 26, 13); c.fill(); c.strokeStyle = '#fff6ea'; c.lineWidth = 2.5; for (const dx of [-8, 0, 8]) { c.beginPath(); c.moveTo(180 + dx, F - 6); c.lineTo(180 + dx, F + 6); c.stroke(); }
    c.restore();
    // the chart's place in the run: one dot per chart
    s.list.forEach((_, k) => { c.fillStyle = k < s.i || (k === s.i && (s.ok || s.end)) ? '#8ad0a0' : k === s.i ? '#ffe27a' : 'rgba(255,255,255,0.3)'; c.beginPath(); c.arc(300 - (s.list.length - 1 - k) * 18, 154, 6, 0, TAU); c.fill(); });
    // the audience: alarmed while the gap looks huge, calm once it is fixed; the duck faints if it balloons
    const alarm = s.calm > 0.45, won = g.result === 'win';
    [['owl', 60, 604], ['rabbit', 130, 610], ['duck', 230, 606], ['frog', 300, 610]].forEach(([kind, x, y], k) => {
      if (kind === 'duck' && s.faint) { c.save(); c.translate(x, y - 10); c.rotate(-1.5 * SK.clamp((t - s.faint) * 3, 0, 1)); SK.animal(c, kind, 0, 10, 0.75, { t, expr: 'sad', pose: 'sad', noShadow: true }); c.restore(); return; }
      SK.animal(c, kind, x, y + (alarm ? -Math.abs(Math.sin(t * 9 + k)) * 6 : 0), 0.72, { t, phase: k, pose: won ? 'cheer' : alarm ? 'hop' : 'idle', expr: won ? 'laugh' : alarm ? 'wow' : 'happy' });
    });
    // what the audience thinks it sees
    if (!g.done || g.result === 'win') { const say = s.end || s.ok ? 'About the same!' : s.calm > 0.45 ? 'Way bigger!' : 'Hmm...'; SK.tag(c, say, 180, 572, 18, s.end || s.ok ? '#d0ffd8' : s.calm > 0.45 ? '#ffd0d0' : '#fff6ea'); }
    if (!s.ok && !s.end && !s.drag && !g.done) { SK.grab(c, g, 180, s.F, 26); SK.target(c, g, 180, Z, 26, { w: X1 - X0 + 30, h: 26 }); SK.arrow(c, g, 180, s.F, 180, Z); }
    if (!s.ok && !s.end && !g.done) SK.demo(g, c, 'drag', [180, s.F], [180, Z]);
  },
  auto(g, dt, synth) {
    const s = g.s; if (g.done || s.ok || s.end || g.t < 1.0) return; const Q = s._plan = s._plan || {};
    if (Q[s.i] == null) { if (s.slide && g.t - s.slide < 0.4) return; Q[s.i] = g.t; }
    SK.bot.drag(g, synth, 'c' + s.i, Q[s.i], [180, F0], [180, Z], 0.35);
  },
});
