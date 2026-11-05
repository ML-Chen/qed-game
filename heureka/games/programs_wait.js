// RING WHEN A BIRD PECKS! (cs PR-24, WAIT!) — events and handlers. The code says: when the door gets a "peck", run
// on_peck(), which rings the bell. You are the computer: wait, doing nothing, until a bird pecks; then the handler lines
// glow and you tap the bell, the owl opens the door and takes the letter. Ring with no peck and the owl stomps to an
// empty door; wait too long and the bird flies off with its letter. Level 2: falling acorns knock too, but a knock is
// not a peck, so the handler does not run for them.
const PX = 14, PY = 124, PW = 332, BELL = { x: 290, y: 404 }, DOOR = { x: 150, y: 520 };
const LINES = ['def on_peck():', '    ring_bell()', 'door.on("peck", on_peck)'];
const PLANS = [{ n: 3, win: 2.2, gap: [0.5, 1.2] }, { n: 4, win: 1.6, gap: [0.3, 1.0] }, { n: 3, win: 1.3, gap: [0.2, 0.5], acorns: 2 }];
function paintHouse(o) {
  const sk = o.createLinearGradient(0, 0, 0, 640); sk.addColorStop(0, '#9ad0f0'); sk.addColorStop(1, '#e8f4f0'); o.fillStyle = sk; o.fillRect(0, 0, 360, 640);
  P.cloud(o, 300, 280, 0.6);
  // the house front: wall, roof edge, a round window with the bell, and the door
  o.fillStyle = '#e8c890'; o.fillRect(20, 300, 330, 300); o.fillStyle = 'rgba(160,110,60,0.18)'; for (let y = 310; y < 600; y += 22) o.fillRect(20, y, 330, 2);
  o.fillStyle = '#b8503a'; o.beginPath(); o.moveTo(6, 306); o.lineTo(354, 306); o.lineTo(340, 282); o.lineTo(20, 282); o.closePath(); o.fill();
  o.fillStyle = '#5a3a6a'; o.beginPath(); o.arc(BELL.x, BELL.y, 46, 0, 7); o.fill(); o.strokeStyle = '#8a5a34'; o.lineWidth = 7; o.stroke();
  o.fillStyle = '#7a4a2a'; o.beginPath(); o.roundRect(DOOR.x - 46, DOOR.y - 128, 92, 132, [44, 44, 0, 0]); o.fill(); o.strokeStyle = '#4a2a14'; o.lineWidth = 4; o.stroke();
  o.fillStyle = '#a87048'; o.beginPath(); o.roundRect(DOOR.x - 38, DOOR.y - 118, 76, 118, [38, 38, 0, 0]); o.fill();
  o.fillStyle = '#c8a070'; o.fillRect(DOOR.x - 60, DOOR.y, 120, 14);
  // the path and grass
  o.fillStyle = '#8ac860'; o.fillRect(0, 600, 360, 40); o.fillStyle = '#d8c8a8'; o.beginPath(); o.moveTo(DOOR.x - 50, 614); o.lineTo(DOOR.x + 50, 614); o.lineTo(DOOR.x + 80, 640); o.lineTo(DOOR.x - 80, 640); o.closePath(); o.fill();
  // a tree on the right whose acorns fall
  o.fillStyle = '#6a4a2a'; o.fillRect(330, 220, 14, 90); P.tree(o, 330, 300, 1.0, '#5a9a4a', 7);
}
function bell(c, x, y, ring, t) { const sw = ring ? Math.sin(t * 40) * 0.35 * ring : Math.sin(t * 2) * 0.03; c.save(); c.translate(x, y - 30); c.rotate(sw); c.strokeStyle = '#8a6a3a'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 8); c.stroke(); c.fillStyle = '#ffc840'; c.strokeStyle = '#8a5a10'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-20, 44); c.quadraticCurveTo(-20, 8, 0, 8); c.quadraticCurveTo(20, 8, 20, 44); c.lineTo(26, 50); c.lineTo(-26, 50); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#8a5a10'; c.beginPath(); c.arc(0, 54, 5, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.ellipse(-8, 24, 4, 10, 0.2, 0, 7); c.fill(); c.restore();
  if (ring) { c.save(); c.strokeStyle = `rgba(255,220,120,${ring})`; c.lineWidth = 3; for (let i = 1; i <= 3; i++) { c.beginPath(); c.arc(x, y + 6, 30 + i * 10, -0.8, 0.8); c.stroke(); c.beginPath(); c.arc(x, y + 6, 30 + i * 10, Math.PI - 0.8, Math.PI + 0.8); c.stroke(); } c.restore(); } }
MG.add({
  id: 'cs_wait', stage: 'programs', cmd: 'RING WHEN A BIRD PECKS!', time: 7, mood: 'bright', winText: 'Every letter in!', failText: 'Wrong time!',
  card: { title: 'Waiting for events', kind: 'Computer science', ref: 'Events and event handlers',
    text: 'Many programs spend most of their time waiting. An event is something that happens, like a click, a key press or, here, a peck on the door.\n\nThe line door.on("peck", on_peck) does not ring anything by itself. It tells the computer: when a peck happens, run the function on_peck. That function is called a handler.\n\nSo the handler runs once per peck, and only for pecks. A knock from a falling acorn is a different event, so nothing happens.',
    note: 'An event handler is code that waits, and runs only when its event happens.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level), pl = PLANS[L]; s.pl = pl; s.ev = []; let t = 1.3;
    const kinds = []; for (let i = 0; i < pl.n; i++) kinds.push('peck'); for (let i = 0; i < (pl.acorns || 0); i++) kinds.splice(1 + i * 2, 0, 'acorn');
    for (const k of kinds) s.ev.push({ k, t: 0, st: 'queue', gap: pl.gap[0] + g.rand() * (pl.gap[1] - pl.gap[0]) });
    s.ev[0].st = 'wait'; s.ev[0].t = 1.0; // each event is scheduled when the one before it is over
    s.ring = null; s.res = null; s.got = 0; s.fired = null;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || SK.dist(x, y, BELL.x, BELL.y) > 54) return;
    s.ring = g.t; g.sfx('bell');
    const e = s.ev.find(q => q.st === 'peck');
    if (e) { e.st = 'answered'; e.at = g.t; s.got++; s.fired = null; g.sfx('ding'); return; }
    // the bell rang with no peck: the owl stomps to an empty door
    s.res = { t: g.t, win: false, why: 'false' }; B7.flash(g, 2); g.fail();
  },
  update(g, dt) {
    const s = g.s; if (g.done) return;
    for (const e of s.ev) {
      if (e.st === 'wait' && g.t >= e.t) { e.st = e.k === 'peck' ? 'fly' : 'fall'; e.t0 = g.t; }
      if (e.st === 'fly' && g.t - e.t0 > 0.55) { e.st = 'peck'; e.pt = g.t; s.fired = g.t; g.sfx('tap'); g.sfx('tweet'); }
      if (e.st === 'fall' && g.t - e.t0 > 0.7 && !e.knock) { e.knock = g.t; g.sfx('thud'); }
      if (e.st === 'fall' && g.t - e.t0 > 1.0) e.st = 'gone';
      if (e.st === 'peck' && g.t - e.pt > s.pl.win) { e.st = 'left'; s.res = { t: g.t, win: false, why: 'late' }; g.sfx('tweet'); g.fail(); return; }
      if (e.st === 'answered' && g.t - e.at > 0.6) e.st = 'done';
      if ((e.st === 'done' || e.st === 'gone') && !e.next) { e.next = 1; const nx = s.ev[s.ev.indexOf(e) + 1]; if (nx) { nx.st = 'wait'; nx.t = g.t + nx.gap; } }
    }
    if (s.ev.every(e => e.st === 'done' || e.st === 'gone') && !s.res) { s.res = { t: g.t, win: true }; g.win(); g.sfx('cheer'); g.burst(DOOR.x, DOOR.y - 80, ['#ffd45a', '#7ee8a0', '#fff'], 18, 150); }
  },
  draw(g, c) {
    const s = g.s, t = g.t;
    c.drawImage(g.bake('cs_wait', paintHouse), 0, 0, 360, 640);
    // the code: line 3 waits (a soft pulse); a peck makes it fire, and the handler lines glow while you ring
    const peck = s.ev.find(e => e.st === 'peck'), cur = peck ? 1 : -1;
    const L = B7.panel(c, g, { x: PX, y: PY, w: PW, lines: LINES, cur, flash: s.b7flash });
    if (!peck && !s.res) { const p = 0.5 + 0.5 * Math.sin(t * 2.5); c.save(); c.strokeStyle = `rgba(150,200,255,${0.25 + 0.3 * p})`; c.lineWidth = 2; c.setLineDash([5, 5]); c.beginPath(); c.roundRect(PX + 5, L.lineY(2) - L.lineH / 2 + 2, PW - 10, L.lineH - 4, 8); c.stroke(); c.restore(); }
    if (s.fired && t - s.fired < 0.5) { const k = (t - s.fired) / 0.5; c.save(); c.globalAlpha = 1 - k; c.fillStyle = '#ffd45a'; c.beginPath(); c.roundRect(PX + 5, L.lineY(2) - L.lineH / 2 + 2, PW - 10, L.lineH - 4, 8); c.fill(); c.restore(); }
    // the bell in the window and the owl inside
    const rk = s.ring ? Math.max(0, 1 - (t - s.ring) * 1.5) : 0;
    bell(c, BELL.x, BELL.y, rk, t); SK.tag(c, 'Bell', BELL.x, BELL.y + 64, 18);
    // the door opens for each answered peck; the owl takes the letter
    const ans = s.ev.find(e => e.st === 'answered'), open = ans ? Math.min(1, (t - ans.at) * 4) * Math.min(1, (1.1 - (t - ans.at)) * 4) : s.res && s.res.why === 'false' ? Math.min(1, (t - s.res.t) * 4) : 0;
    if (open > 0) { c.save(); c.fillStyle = '#2a1a1a'; c.beginPath(); c.roundRect(DOOR.x - 38, DOOR.y - 118, 76, 118, [38, 38, 0, 0]); c.fill(); SK.animal(c, 'owl', DOOR.x, DOOR.y, 0.9 * open, { t, pose: s.res && !s.res.win ? 'sad' : 'wave', expr: s.res && s.res.why === 'false' ? 'think' : 'happy' }); c.restore();
      c.save(); c.fillStyle = '#a87048'; c.beginPath(); c.roundRect(DOOR.x - 38 - open * 30, DOOR.y - 118, 76 * (1 - open * 0.7), 118, [38, 0, 0, 0]); c.fill(); c.restore(); }
    if (s.res && s.res.why === 'false') { c.save(); c.globalAlpha = Math.min(1, (t - s.res.t) * 3); SK.tag(c, 'Nobody?', DOOR.x, DOOR.y - 150, 20); c.restore(); }
    // birds with letters, and falling acorns
    for (const e of s.ev) {
      if (e.k === 'acorn' && (e.st === 'fall')) { const k = Math.min(1, (t - e.t0) / 0.7), x = SK.lerp(318, DOOR.x + 34, k), y = SK.lerp(250, DOOR.y - 60, k) - Math.sin(k * Math.PI) * 40 + (k >= 1 ? (t - e.t0 - 0.7) * 120 : 0); c.fillStyle = '#9a6a3a'; c.beginPath(); c.ellipse(x, y, 7, 9, 0, 0, 7); c.fill(); c.fillStyle = '#6a4a2a'; c.beginPath(); c.ellipse(x, y - 7, 8, 4, 0, 0, 7); c.fill(); if (e.knock && t - e.knock < 0.4) SK.tag(c, 'knock', DOOR.x + 70, DOOR.y - 70, 18); }
      if (e.k !== 'peck' || e.st === 'wait' || e.st === 'queue' || e.st === 'done') continue;
      let bx = DOOR.x + 58, by = DOOR.y - 66, flap = true;
      if (e.st === 'fly') { const k = (t - e.t0) / 0.55; bx = SK.lerp(400, DOOR.x + 58, SK.easeOut(k)); by = SK.lerp(330, DOOR.y - 66, SK.easeOut(k)); }
      else if (e.st === 'peck') { flap = false; bx += Math.max(0, Math.sin((t - e.pt) * 14)) * -8; }
      else if (e.st === 'answered') { const k = Math.min(1, (t - e.at - 0.4) / 0.7); if (k > 0) { bx = SK.lerp(DOOR.x + 58, 420, k); by = SK.lerp(DOOR.y - 66, 260, k); } }
      else if (e.st === 'left') { const k = Math.min(1, (t - s.res.t) / 0.8); bx = SK.lerp(DOOR.x + 58, 420, k); by = SK.lerp(DOOR.y - 66, 240, k); }
      SK.animal(c, 'bird', bx, by, 0.7, { t, pose: flap ? 'cheer' : 'idle', expr: e.st === 'left' ? 'sad' : 'happy', facing: -1, noShadow: true });
      const keep = e.st !== 'answered' || t - e.at < 0.35; if (keep) { c.save(); c.translate(bx - 18, by - 10); c.rotate(-0.2); c.fillStyle = '#fff6ea'; c.strokeStyle = '#6a5a8a'; c.lineWidth = 1.5; c.beginPath(); c.roundRect(-11, -7, 22, 14, 2); c.fill(); c.stroke(); c.restore(); }
      if (e.st === 'peck') SK.tag(c, 'peck!', DOOR.x + 70, DOOR.y - 112, 18);
    }
    // letters delivered so far
    for (let i = 0; i < s.ev.filter(e => e.k === 'peck').length; i++) { const got = i < s.got; c.save(); c.translate(40 + i * 30, 330); c.globalAlpha = got ? 1 : 0.35; c.fillStyle = '#fff6ea'; c.strokeStyle = '#6a5a8a'; c.lineWidth = 1.5; c.beginPath(); c.roundRect(-11, -8, 22, 16, 2); c.fill(); c.stroke(); c.restore(); }
    // guidance: the bell glows only while a peck is waiting; the hand taps it then
    if (peck && !g.done) { SK.glow(c, g, BELL.x, BELL.y + 6, 50); SK.demo(g, c, 'tap', [BELL.x, BELL.y + 10], null, { delay: 0 }); }
  },
  // the bot rings 0.35 s after each peck (B7FAIL: rings at once, before any bird)
  auto(g, dt, synth) {
    const s = g.s; if (g.done) return; const fail = typeof window !== 'undefined' && window.B7FAIL;
    const e = s.ev.find(q => q.st === 'peck'); if ((e && g.t - e.pt > 0.35) || (fail && g.t > 0.8)) { if (g.t < (s.nb || 0)) return; s.nb = g.t + 0.5; synth('down', BELL.x, BELL.y); synth('up', BELL.x, BELL.y); }
  },
});
