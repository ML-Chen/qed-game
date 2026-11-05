// STOP POLISHING! (problems PS-04) — the turtle's stone shop. A client waits at the counter for a polished stone. Hold
// the button: the wheel spins and the stone shines, and a chart above draws its shine against polishing time. The shine
// climbs fast at first, then flattens out: past the "Good enough" line, more polishing adds almost nothing, while the
// time runs on toward the client's "Deadline". Let go to ship it: in time and shiny enough, the client smiles and pays.
// Let go too soon and the stone is still rough; hold past the deadline and the client walks off, leaving the shiny stone
// alone on the counter. Two clients at level 0, three at levels 1 and 2; at level 2 one client wants it extra shiny.
// The idea: past a point, more work adds little; stop when the work is good enough for the decision.
const TAU = Math.PI * 2;
const TAU_S = 0.62, CH = { x: 40, y: 140, w: 284, h: 150 }, BTN = [180, 574], ROCK = [116, 418], DESK = 330;
const shine = h => 1 - Math.exp(-h / TAU_S), timeFor = m => -TAU_S * Math.log(1 - m);
const CLIENTS = ['rabbit', 'fox', 'duck', 'penguin', 'frog'], GEMS = ['#e8403a', '#3a8ad8', '#3ac86a', '#a85ad8', '#f6a03a'];
function paintShop(o) {
  const wl = o.createLinearGradient(0, 0, 0, 470); wl.addColorStop(0, '#5ab0d8'); wl.addColorStop(1, '#a8dcec'); o.fillStyle = wl; o.fillRect(0, 0, 360, 470);
  for (let x = 0; x < 360; x += 40) { o.fillStyle = x % 80 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'; o.fillRect(x, 0, 40, 470); }
  P.cloud(o, 300, 60, 0.4);
  // the shop's back shelf with finished stones
  o.fillStyle = '#b07440'; o.fillRect(0, 322, 360, 10); for (let i = 0; i < 6; i++) { o.fillStyle = GEMS[i % 5]; o.beginPath(); o.ellipse(30 + i * 58, 312, 12, 9, 0, 0, TAU); o.fill(); o.fillStyle = 'rgba(255,255,255,0.6)'; o.beginPath(); o.ellipse(26 + i * 58, 308, 4, 2.5, -0.5, 0, TAU); o.fill(); }
  // floor and counter
  const fl = o.createLinearGradient(0, 460, 0, 640); fl.addColorStop(0, '#e8b878'); fl.addColorStop(1, '#b8844a'); o.fillStyle = fl; o.fillRect(0, 460, 360, 180);
  o.fillStyle = 'rgba(120,70,30,0.2)'; for (let x = 0; x < 360; x += 45) o.fillRect(x, 460, 2, 180);
  const ct = o.createLinearGradient(0, 452, 0, 500); ct.addColorStop(0, '#c87a3a'); ct.addColorStop(1, '#8a4a1a'); o.fillStyle = ct; o.beginPath(); o.roundRect(196, 452, 170, 52, 6); o.fill(); o.fillStyle = '#e89a5a'; o.fillRect(192, 446, 174, 10);
  // the polishing wheel's bench
  o.fillStyle = '#7a4a2a'; o.beginPath(); o.roundRect(60, 446, 120, 14, 4); o.fill(); o.fillRect(70, 460, 10, 40); o.fillRect(160, 460, 10, 40);
  P.grain(o, 360, 640, 0.035); P.vignette(o, 360, 640, 0.25);
}
function stone(c, x, y, r, col, sh, t) {
  c.save(); c.translate(x, y);
  const pts = [[-1, -0.55], [-0.35, -0.95], [0.5, -0.85], [1, -0.2], [0.75, 0.6], [0, 0.9], [-0.8, 0.55]];
  const rough = 1 - sh; c.beginPath(); pts.forEach(([px, py], i) => { const j = rough * 0.14 * Math.sin(i * 7.3); const X = px * r * (1 + j), Y = py * r * 0.8 * (1 + j); i ? c.lineTo(X, Y) : c.moveTo(X, Y); }); c.closePath();
  const base = P.mix('#8a8078', col, sh), gr = c.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r * 1.1); gr.addColorStop(0, P.shade(base, 0.2 + sh * 0.4)); gr.addColorStop(1, P.shade(base, -0.35)); c.fillStyle = gr; c.fill(); c.strokeStyle = P.shade(base, -0.6); c.lineWidth = 2.5; c.stroke();
  if (rough > 0.2) { c.fillStyle = `rgba(60,50,40,${rough * 0.5})`; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(Math.sin(i * 2.1) * r * 0.6, Math.cos(i * 3.3) * r * 0.45, 2 + (i % 3), 0, TAU); c.fill(); } }
  c.fillStyle = `rgba(255,255,255,${0.2 + sh * 0.7})`; c.beginPath(); c.ellipse(-r * 0.35, -r * 0.35, r * 0.28 * (0.5 + sh), r * 0.14 * (0.5 + sh), -0.6, 0, TAU); c.fill();
  if (sh > 0.5) for (let i = 0; i < 3; i++) { const k = (t * 1.3 + i / 3) % 1, a = (sh - 0.5) * 2 * Math.sin(k * Math.PI), sx = Math.cos(i * 2.2) * r * 0.8, sy = Math.sin(i * 2.2) * r * 0.6 - 6; c.fillStyle = `rgba(255,255,230,${a})`; c.beginPath(); for (let q = 0; q < 8; q++) { const rr = q % 2 ? 2 : 8 * (0.6 + 0.4 * sh); c.lineTo(sx + Math.cos(q * Math.PI / 4) * rr, sy + Math.sin(q * Math.PI / 4) * rr); } c.closePath(); c.fill(); }
  c.restore();
}
function newClient(g) { const s = g.s, o = s.orders[s.i]; s.held = 0; s.ph = 'ready'; s.at = g.t; s.trace = []; s.rel = 0; void o; }
MG.add({
  id: 'stoppolish', stage: 'problems', cmd: 'LET GO WHEN IT\'S GOOD ENOUGH!', time: 6, mood: 'party', winText: 'Shipped on time!', failText: 'Missed it!',
  card: { title: 'Good enough beats perfect', kind: 'Problem solving', ref: 'Diminishing returns',
    text: 'The first moments of polishing made the stone much shinier. After that, each extra moment added less and less, and the chart\'s line went flat. The deadline did not wait.\n\nWhen the stone passed the client\'s "good enough" line, more polishing was mostly wasted time. Shipping it then made the client happy. Polishing past the deadline lost the client, however shiny the stone was.\n\nWork is often like this. Decide how good the work must be for the person using it, and stop there.',
    note: 'Past a point, more work adds little: stop when it is good enough and ship on time.' },
  init(g) {
    const s = g.s, v = SK.variant(g, 4), n = g.level ? 3 : 2, kinds = SK.shuffled(g, CLIENTS);
    const marks = [[0.72, 0.78], [0.78, 0.8, 0.74], [0.8, 0.93, 0.76]][Math.min(2, g.level)];
    s.orders = []; for (let i = 0; i < n; i++) { const m = marks[i], need = timeFor(m), slack = [1.7, 1.25, 0.95][Math.min(2, g.level)] * (m > 0.9 ? 0.8 : 1); s.orders.push({ k: kinds[i], col: GEMS[(v + i) % 5], mark: m, dl: need + slack }); }
    s.i = 0; s.done = 0; newClient(g);
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.ph !== 'ready') return; s.ph = 'polish'; s.h0 = g.t; SK.holdStart(g); g.sfx('sweep'); },
  up(g, x, y) {
    const s = g.s; SK.holdEnd(g); if (g.done || s.ph !== 'polish') return; const o = s.orders[s.i];
    s.held = g.t - s.h0; s.ph = 'ship'; s.at = g.t;
    if (shine(s.held) >= o.mark) { s.ok = true; g.sfx('swoosh'); } else { s.ok = false; g.sfx('wrong'); }
  },
  update(g, dt) {
    const s = g.s, o = s.orders[s.i], e = g.t - s.at; if (!o) return;
    if (s.ph === 'polish') { s.held = g.t - s.h0; if (s.trace.length === 0 || s.held - s.trace[s.trace.length - 1] > 0.03) s.trace.push(s.held);
      if (s.held >= o.dl) { s.ph = 'leave'; s.at = g.t; g.sfx('fail'); } }
    else if (s.ph === 'ship') {
      if (!s.ok && e > 0.6 && !g.done) { g.sfx('laugh'); g.fail(); }
      if (s.ok && e > 0.45 && !s.paid) { s.paid = true; s.done++; g.sfx('coin'); g.sfx('chime'); g.burst(DESK - 30, 420, ['#ffd45a', '#fff6ea', o.col], 14, 150); if (s.done >= s.orders.length && !g.done) { g.win(); g.sfx('cheer'); } }
      if (s.ok && e > 1.0 && s.done < s.orders.length) { s.paid = false; s.i++; newClient(g); }
    } else if (s.ph === 'leave') { if (e > 0.7 && !g.done) { g.sfx('laugh'); g.fail(); } }
  },
  draw(g, c) {
    const s = g.s, t = g.t, o = s.orders[Math.min(s.i, s.orders.length - 1)], e = t - s.at, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('stoppolish', paintShop), 0, 0, 360, 640);
    const sh = shine(s.held), T = o.dl + 0.6, X = h => CH.x + 34 + (h / T) * (CH.w - 48), Y = v => CH.y + CH.h - 26 - v * (CH.h - 44);
    // the chart: shine against polishing time, with the client's good-enough line and deadline
    c.fillStyle = 'rgba(255,250,240,0.95)'; c.beginPath(); c.roundRect(CH.x, CH.y, CH.w, CH.h, 12); c.fill(); c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.stroke();
    c.strokeStyle = '#8a7a8a'; c.lineWidth = 2; c.beginPath(); c.moveTo(X(0), Y(1.05)); c.lineTo(X(0), Y(0)); c.lineTo(X(T), Y(0)); c.stroke();
    c.save(); c.setLineDash([7, 5]); c.strokeStyle = '#2a9a4a'; c.lineWidth = 3; c.beginPath(); c.moveTo(X(0), Y(o.mark)); c.lineTo(X(T), Y(o.mark)); c.stroke();
    c.strokeStyle = '#e8403a'; c.beginPath(); c.moveTo(X(o.dl), Y(1.08)); c.lineTo(X(o.dl), Y(0)); c.stroke(); c.restore();
    c.fillStyle = 'rgba(232,64,58,0.12)'; c.fillRect(X(o.dl), Y(1.08), X(T) - X(o.dl), Y(0) - Y(1.08));
    // the ghost of the whole curve (faint), then the part polished so far (bold)
    c.strokeStyle = 'rgba(58,22,64,0.15)'; c.lineWidth = 2; c.beginPath(); for (let i = 0; i <= 40; i++) { const h = T * i / 40; i ? c.lineTo(X(h), Y(shine(h))) : c.moveTo(X(h), Y(0)); } c.stroke();
    if (s.held > 0) { c.strokeStyle = sh >= o.mark ? '#2a9a4a' : '#e88a2a'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(X(0), Y(0)); for (let i = 1; i <= 30; i++) { const h = s.held * i / 30; c.lineTo(X(h), Y(shine(h))); } c.stroke(); c.fillStyle = '#3a1640'; c.beginPath(); c.arc(X(s.held), Y(sh), 6, 0, TAU); c.fill(); }
    SK.tag(c, 'Good enough', CH.x + 104, Y(o.mark) + 20, 18, '#c8ffd0'); SK.tag(c, 'Deadline', Math.min(X(o.dl), CH.x + CH.w - 50), CH.y + CH.h + 4, 18, '#ffd0d0');
    // the turtle at its wheel, and the stone (spinning while you hold)
    const spin = s.ph === 'polish';
    SK.animal(c, 'turtle', 50, 448, 1.15, { t, pose: won ? 'cheer' : lost ? 'sad' : spin ? 'balance' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : spin ? 'think' : 'happy' });
    c.save(); c.translate(ROCK[0] + 20, ROCK[1] + 16); c.rotate(spin ? t * 20 : 0); c.fillStyle = '#c8c0b8'; c.beginPath(); c.arc(0, 0, 18, 0, TAU); c.fill(); c.strokeStyle = '#6a6058'; c.lineWidth = 3; c.stroke(); c.beginPath(); c.moveTo(-18, 0); c.lineTo(18, 0); c.stroke(); c.restore();
    const shipK = s.ph === 'ship' ? SK.easeInOut(e / 0.45) : 0;
    if (!(s.ph === 'ship' && s.ok && e > 0.45)) { const rx = s.ph === 'ship' ? SK.lerp(ROCK[0], DESK - 40, shipK) : s.ph === 'leave' ? DESK - 90 : ROCK[0], ry = s.ph === 'ship' ? SK.lerp(ROCK[1] - 14, 426, shipK) - Math.sin(shipK * Math.PI) * 50 : s.ph === 'leave' ? 428 : ROCK[1] - 14 + (spin ? Math.sin(t * 40) * 1.5 : 0); stone(c, rx, ry, 34, o.col, sh, t); }
    if (spin && g.t % 0.1 < 0.05) { c.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(ROCK[0] + 34 + i * 6, ROCK[1] + 2 - i * 5, 2, 0, TAU); c.fill(); } }
    // the client at the counter (walks off at the deadline; the next one walks in)
    const inK = s.ph === 'ready' && s.i > 0 ? SK.easeOut((t - s.at) / 0.4) : 1, leaveK = s.ph === 'leave' ? SK.clamp(e / 0.6, 0, 1) : 0;
    const happy = s.ph === 'ship' && s.ok;
    SK.animal(c, o.k, DESK + 2 + (1 - inK) * 80 + leaveK * 90, 452, 1.15, { t, pose: happy || won ? 'cheer' : leaveK ? 'walk' : s.ph === 'ship' ? 'sad' : 'idle', expr: happy || won ? 'laugh' : leaveK || (s.ph === 'ship' && !s.ok) ? 'sad' : 'happy', facing: leaveK ? 1 : -1 });
    if (s.ph === 'ship' && !s.ok && e > 0.3) SK.tag(c, 'Too rough!', DESK - 20, 360, 20, '#ffd0d0');
    if (s.ph === 'leave') SK.tag(c, 'Too late!', DESK - 20, 360, 20, '#ffd0d0');
    G2.count(c, 60, 44, s.done, s.orders.length);
    // the hold button, with live feedback while you polish
    if (!g.done && (s.ph === 'ready' || s.ph === 'polish')) {
      const pr = spin ? 1 : 0; c.fillStyle = '#7a3a1a'; c.beginPath(); c.roundRect(BTN[0] - 110, BTN[1] - 18, 220, 40, 20); c.fill(); c.fillStyle = spin ? '#e8a03a' : '#e8803a'; c.beginPath(); c.roundRect(BTN[0] - 110, BTN[1] - 22 + pr * 4, 220, 38, 19); c.fill();
      c.save(); c.font = '900 20px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff6ea'; c.fillText(spin ? 'Polishing...' : 'Hold to polish', BTN[0], BTN[1] - 3 + pr * 4); c.restore();
      if (spin) { const late = s.held > o.dl - 0.45; SK.tag(c, sh < o.mark ? 'Keep holding...' : late ? 'Let go NOW!' : 'Let go to ship!', 180, 520, 20, '#fff6ea', sh < o.mark ? 'rgba(30,14,36,0.78)' : late ? 'rgba(200,40,40,0.95)' : 'rgba(40,150,70,0.95)'); }
      if (s.ph === 'ready') SK.glow(c, g, BTN[0], BTN[1], 46);
    }
    // the hand holds for just the time this client needs (from the good-enough line to well before the deadline)
    if (s.ph === 'ready' && !g.done) { const need = (timeFor(o.mark) * 0.6 + Math.min(o.dl - 0.3, timeFor(o.mark) + 0.5) * 0.4); SK.demo(g, c, 'hold', [BTN[0] + 40, BTN[1]], null, { period: Math.max(1.4, need / 0.65) }); }
    else SK.demo(g, c, 'hold', [0, 0], null, { never: true });
  },
  auto(g, dt, synth) {
    const s = g.s, o = s.orders[s.i]; if (!o || g.done) return;
    if (s._bh) { if (SK.bot.hold(g, synth, s._bh.key, s._bh.t, BTN[0], BTN[1], s._bh.need)) s._bh = null; return; }
    if (s.ph !== 'ready' || g.t - s.at < 0.4) return;
    s._bh = { key: 'h' + s.i, t: Math.max(1.0, s.at + 0.45), need: timeFor(o.mark) + Math.min(0.25, (o.dl - timeFor(o.mark)) / 3) };
  },
});
