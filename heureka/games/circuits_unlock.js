// UNLOCK! (earth_eng EE-18) — a bank vault whose lock is wired through two floor switches in a row (an AND gate).
// Drag the fox onto one switch, then hold the other with your finger: only with both pressed is the loop complete,
// current marches round and the vault swings open on a heap of gold. With one pressed, the wire glows "live" only up to
// the open switch and nothing flows. Level 2: three switches in a row, so the duck has to stand on one too.
// (Only one finger is tracked, so an animal holds the first switch down.)
const WY = 522, TOPY = 150, BX = 40, RX = 330, DOOR = { x: 180, y: 306, r: 98 }, LOCK = { x: RX, y: 306 };
const STAY = [1.6, 1.4, 2.0]; // seconds a helper will stand on a switch before hopping off
const LAY = [ // switch x positions and which animals help
  { pads: [118, 236], helpers: ['fox'] }, { pads: [118, 236], helpers: ['fox'] }, { pads: [92, 176, 260], helpers: ['fox', 'duck'] },
];
function loopPts(pads) { // the wire as a polyline from the battery's + (bottom) round to its − (top)
  const p = [[BX, 492], [BX, WY]]; for (const x of pads) p.push([x, WY]); p.push([RX, WY], [RX, LOCK.y + 26], [RX, LOCK.y - 26], [RX, TOPY], [BX, TOPY], [BX, 428]); return p;
}
function paintVault(o) {
  const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#2a3a4e'); bg.addColorStop(0.7, '#3e5068'); bg.addColorStop(1, '#2a3444'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  o.strokeStyle = 'rgba(255,255,255,0.05)'; o.lineWidth = 2; for (let y = 20; y < 500; y += 36) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); } // stone courses
  const fl = o.createLinearGradient(0, 500, 0, 640); fl.addColorStop(0, '#6a5a4a'); fl.addColorStop(1, '#3a2e24'); o.fillStyle = fl; o.fillRect(0, 500, 360, 140);
  o.fillStyle = 'rgba(0,0,0,0.25)'; o.fillRect(0, 500, 360, 6);
  // the vault's frame in the wall
  SK.shadow(o, DOOR.x, DOOR.y + DOOR.r + 12, DOOR.r, 12, 0.35);
  o.fillStyle = '#1a222c'; o.beginPath(); o.arc(DOOR.x, DOOR.y, DOOR.r + 16, 0, 7); o.fill();
  o.strokeStyle = '#7a8898'; o.lineWidth = 6; o.stroke();
  // gold inside (seen when the door swings open)
  const inG = o.createRadialGradient(DOOR.x, DOOR.y + 30, 10, DOOR.x, DOOR.y, DOOR.r); inG.addColorStop(0, '#5a4220'); inG.addColorStop(1, '#140e08'); o.fillStyle = inG; o.beginPath(); o.arc(DOOR.x, DOOR.y, DOOR.r + 2, 0, 7); o.fill();
  o.save(); o.beginPath(); o.arc(DOOR.x, DOOR.y, DOOR.r, 0, 7); o.clip(); const rnd = P.rng(5); for (let i = 0; i < 70; i++) { const a = rnd() * Math.PI, r = rnd() * 80, x = DOOR.x + Math.cos(a) * r * 1.1, y = DOOR.y + 70 - Math.sin(a) * r * 0.55; o.fillStyle = rnd() < 0.5 ? '#ffd24a' : '#f0a82a'; o.beginPath(); o.ellipse(x, y, 9, 5, 0, 0, 7); o.fill(); o.strokeStyle = '#a06a14'; o.lineWidth = 1; o.stroke(); }
  for (let i = 0; i < 3; i++) { const x = DOOR.x - 50 + i * 40, y = DOOR.y + 10 - i * 6; o.fillStyle = '#ffc83a'; o.beginPath(); o.moveTo(x - 16, y + 8); o.lineTo(x - 10, y - 4); o.lineTo(x + 10, y - 4); o.lineTo(x + 16, y + 8); o.closePath(); o.fill(); o.strokeStyle = '#a06a14'; o.stroke(); }
  o.restore();
  // the battery standing on the left, + at the bottom
  o.fillStyle = '#1e1e26'; o.beginPath(); o.roundRect(BX - 20, 426, 40, 68, 8); o.fill();
  o.fillStyle = '#e8b83a'; o.beginPath(); o.roundRect(BX - 18, 448, 36, 44, [0, 0, 6, 6]); o.fill();
  o.fillStyle = '#888'; o.fillRect(BX - 7, 420, 14, 7);
  o.fillStyle = '#fff6ea'; o.font = '900 20px Nunito, system-ui, sans-serif'; o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillText('+', BX, 474); o.fillStyle = '#c8d0e0'; o.fillText('−', BX, 438);
  // the lock box on the right wall
  o.fillStyle = '#4a5664'; o.beginPath(); o.roundRect(RX - 22, LOCK.y - 34, 44, 68, 8); o.fill(); o.strokeStyle = '#8a98a8'; o.lineWidth = 3; o.stroke();
}
function pad(c, x, down, t, live) { // a big red floor switch in the wire
  c.save(); c.translate(x, WY);
  c.fillStyle = '#2a2a30'; c.beginPath(); c.ellipse(0, 4, 30, 11, 0, 0, 7); c.fill();
  const h = down ? 3 : 11; c.fillStyle = down ? '#9a1a24' : '#e8323e'; c.beginPath(); c.ellipse(0, 2 - h, 24, 9, 0, 0, 7); c.fill(); c.fillRect(-24, 2 - h, 48, h); c.beginPath(); c.ellipse(0, 2, 24, 9, 0, 0, Math.PI); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(-7, -h - 1, 9, 3, 0, 0, 7); c.fill();
  if (live && !down) { c.globalAlpha = 0.5 + 0.5 * Math.sin(t * 16); c.fillStyle = '#ffe27a'; c.beginPath(); c.arc(-34, 0, 5, 0, 7); c.fill(); } // the live wire waits here
  c.restore();
}
MG.add({
  id: 'unlock', stage: 'circuits', cmd: 'PRESS BOTH SWITCHES AT ONCE!', time: 6, mood: 'night', winText: 'Loop complete!', failText: 'Locked!',
  card: { title: 'Switches in a row make AND', kind: 'Engineering', ref: 'Logic gates (AND and OR)',
    text: 'This lock is wired through two switches in a row, one after the other. Electricity flows only around a complete loop, so current reaches the lock only when the first switch AND the second switch are both pressed. With one pressed, the loop is still broken at the other, and nothing flows.\n\nEngineers call this an AND gate. Wire the two switches side by side instead, and either one alone completes the loop: that is an OR gate. Computer chips are built from billions of tiny gates like these, made of transistors instead of buttons.',
    note: 'Switches in a row make an AND: every one must be closed before any current flows.' },
  init(g) {
    const s = g.s, L = LAY[Math.min(2, g.level)], v = s.v = SK.variant(g, 4);
    const pads = L.pads.length === 2 ? [[118, 236], [96, 214], [140, 262], [104, 250]][v] : [[92, 176, 260], [100, 170, 248], [86, 182, 266], [110, 190, 262]][v];
    const kinds = [['fox', 'duck'], ['rabbit', 'penguin'], ['penguin', 'fox'], ['duck', 'rabbit']][v], left = v % 2 === 1; // helpers wait on the right or the left
    s.pads = pads.map(x => ({ x, by: null })); s.pts = loopPts(pads);
    s.ani = L.helpers.map((k0, i) => { const x = left ? 90 + i * 96 : 304 - i * 96; return { kind: kinds[i], x, y: 612, hx: x, hy: 612, pad: null }; });
    s.hold = null; s.on = 0; s.flow = 0; s.open = 0; s.tries = 0;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    const a = SK.pick(s.ani, x, y + 30, 54); if (a) { if (a.pad) { a.pad.by = null; a.pad = null; } SK.dragStart(g, a, x, y); g.sfx('tap'); return; }
    const p = s.pads.find(q => !q.by && Math.abs(x - q.x) < 42 && Math.abs(y - WY) < 50); if (p) { s.hold = p; SK.holdStart(g); g.sfx('click'); }
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g, x, y) {
    const s = g.s; if (s.hold) { s.hold = null; SK.holdEnd(g); }
    const d = SK.dragEnd(g); if (!d || !d.obj) return; const a = d.obj;
    const p = s.pads.filter(q => !q.by).sort((u, v) => Math.abs(u.x - a.x) - Math.abs(v.x - a.x))[0];
    if (p && Math.abs(p.x - a.x) < 60 && Math.abs(a.y - WY) < 90) { a.pad = p; p.by = a; a.x = p.x; a.y = WY - 2; a.onT = g.t; g.sfx('click'); g.sfx('thud'); }
    else { a.x = a.hx; a.y = a.hy; }
  },
  update(g, dt) {
    for (const a of g.s.ani) if (a.pad && !g.done && g.t - a.onT > STAY[Math.min(2, g.level)]) { a.pad.by = null; a.pad = null; a.x = a.hx; a.y = a.hy; a.hopT = g.t; g.sfx('boing'); } // the helper gets bored and hops off
    const s = g.s, pressed = q => !!q.by || s.hold === q, all = s.pads.every(pressed);
    if (g.done) { if (g.result === 'win') { s.open = Math.min(1, s.open + dt * 1.6); s.flow += dt; } return; }
    s.on = all ? s.on + dt : 0; if (all) s.flow += dt;
    if (all && !s.wasAll) g.sfx('sweep'); s.wasAll = all;
    if (s.on > 0.4) { g.win(); g.sfx('bell'); g.sfx('cheer'); g.burst(DOOR.x, DOOR.y, ['#ffd24a', '#fff6ea', '#7ae0a0'], 26, 220); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, pressed = q => !!q.by || s.hold === q, all = s.pads.every(pressed);
    c.drawImage(g.bake('unlock_vault', paintVault), 0, 0, 360, 640);
    // how far the battery's push reaches: up to the first open switch (or all the way round when every switch is closed)
    let liveTo = s.pts.length - 1; for (let i = 0; i < s.pads.length; i++) if (!pressed(s.pads[i])) { liveTo = 2 + i; break; }
    const seg = (a, b, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); for (let i = a; i <= b; i++) { const [x, y] = s.pts[i], xx = i === b && b < s.pts.length - 1 && b <= 1 + s.pads.length && !all ? x - 30 : x; i === a ? c.moveTo(xx, y) : c.lineTo(xx, y); } c.stroke(); };
    seg(0, s.pts.length - 1, '#1a1418', 9); seg(0, s.pts.length - 1, '#8a6a4a', 5);
    c.save(); c.globalAlpha = 0.35; seg(0, liveTo, '#ffe27a', 13); c.globalAlpha = 0.7 + 0.3 * Math.sin(t * 8); seg(0, liveTo, '#fff0a0', 5); c.restore();
    // current: dots march round the whole loop only when it is complete
    if (all || g.result === 'win') {
      const P2 = s.pts, lens = []; let tot = 0; for (let i = 1; i < P2.length; i++) { const l = SK.dist(...P2[i - 1], ...P2[i]); lens.push(l); tot += l; }
      for (let d = (s.flow * 160) % 26; d < tot; d += 26) { let u = d, i = 0; while (u > lens[i]) { u -= lens[i]; i++; } const k = u / lens[i], x = SK.lerp(P2[i][0], P2[i + 1][0], k), y = SK.lerp(P2[i][1], P2[i + 1][1], k); c.fillStyle = '#fff6b0'; c.beginPath(); c.arc(x, y, 4.5, 0, 7); c.fill(); c.fillStyle = 'rgba(255,230,120,0.35)'; c.beginPath(); c.arc(x, y, 9, 0, 7); c.fill(); }
    }
    // the vault door: swings aside (squashes toward its hinge) once unlocked
    const op = SK.easeInOut(s.open), dx = DOOR.x - DOOR.r * op;
    c.save(); c.translate(dx, DOOR.y); c.scale(1 - op * 0.85, 1);
    const dg = c.createRadialGradient(-30, -36, 10, 0, 0, DOOR.r); dg.addColorStop(0, '#d8e0ea'); dg.addColorStop(0.6, '#98a6b6'); dg.addColorStop(1, '#5a6878'); c.fillStyle = dg; c.beginPath(); c.arc(DOOR.r * op, 0, DOOR.r, 0, 7); c.fill(); c.strokeStyle = '#3a4654'; c.lineWidth = 4; c.stroke();
    c.translate(DOOR.r * op, 0);
    for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; c.fillStyle = '#6a7888'; c.beginPath(); c.arc(Math.cos(a) * (DOOR.r - 14), Math.sin(a) * (DOOR.r - 14), 5, 0, 7); c.fill(); }
    c.rotate(op * 3 + (all ? s.on * 4 : 0)); c.strokeStyle = '#2a323c'; c.lineWidth = 8; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(0, 0); const a = i * 2.094; c.lineTo(Math.cos(a) * 44, Math.sin(a) * 44); c.stroke(); c.fillStyle = '#2a323c'; c.beginPath(); c.arc(Math.cos(a) * 44, Math.sin(a) * 44, 8, 0, 7); c.fill(); }
    c.fillStyle = '#c8a04a'; c.beginPath(); c.arc(0, 0, 14, 0, 7); c.fill();
    c.restore();
    // the bolt from the lock box into the door, and the lamp on the box
    const bolt = all || g.result === 'win' ? SK.clamp(s.on / 0.3, 0, 1) : 0; c.fillStyle = '#c0c8d0'; c.fillRect(DOOR.x + DOOR.r - 6, LOCK.y - 7, (RX - 22 - (DOOR.x + DOOR.r - 6)) * (1 - bolt) + 4, 14);
    const lit = all || g.result === 'win'; c.fillStyle = lit ? '#5aff8a' : '#ff3a3a'; c.beginPath(); c.arc(RX, LOCK.y - 14, 8, 0, 7); c.fill(); c.fillStyle = lit ? 'rgba(90,255,138,0.35)' : 'rgba(255,58,58,0.3)'; c.beginPath(); c.arc(RX, LOCK.y - 14, 15, 0, 7); c.fill();
    SK.tag(c, 'Battery', BX + 4, 404, 18); SK.tag(c, 'Lock', RX - 6, LOCK.y - 52, 18);
    // the floor switches
    for (const p of s.pads) { pad(c, p.x, pressed(p), t, false); if (!p.by) SK.tag(c, 'Switch', p.x, WY - 36, 18); if (!pressed(p) && !s.ani.some(a => !a.pad)) SK.glow(c, g, p.x, WY - 4, 32); }
    // a spark where the live wire stops at an open switch
    if (!all && !g.done) { const p = s.pads.find(q => !pressed(q)); if (p) { c.save(); c.globalAlpha = 0.6 + 0.4 * Math.sin(t * 20); c.fillStyle = '#ffe27a'; c.beginPath(); c.arc(p.x - 30, WY, 6, 0, 7); c.fill(); c.restore(); } }
    // the helpers, standing by or pressing a switch down
    const won = g.result === 'win', lost = g.result === 'fail';
    for (const a of s.ani) { const sc = a.kind === 'duck' || a.kind === 'penguin' ? 1.1 : 1.2; SK.animal(c, a.kind, a.x, a.y, sc, { t, pose: won ? 'cheer' : SK.dragging(g) === a ? 'hop' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : a.pad ? 'think' : 'happy', facing: -1 }); }
    for (const a of s.ani) if (a.pad && !g.done) { const k = (g.t - a.onT) / STAY[Math.min(2, g.level)]; c.strokeStyle = '#ffe27a'; c.lineWidth = 4; c.beginPath(); c.arc(a.x, a.y - 96, 10, -Math.PI / 2, -Math.PI / 2 + (1 - k) * 6.283); c.stroke(); }
    // your finger on the held switch
    if (s.hold) SK.hand(c, s.hold.x, WY - 8, 1, 0.85);
    // guidance: first drag a helper onto a free switch, then hold the last one
    { const fr = s.pads.filter(q => !q.by), id = s.ani.find(a => !a.pad); if (id && fr.length > 1 && !SK.dragging(g) && !g.done) { SK.grab(c, g, id.x, id.y - 40, 40); SK.target(c, g, fr[0].x, WY - 4, 30); SK.arrow(c, g, id.x, id.y - 40, fr[0].x, WY - 4, { from: 46, to: 40 }); } }
    const free = s.pads.filter(q => !q.by), idle = s.ani.find(a => !a.pad);
    if (idle && free.length > 1) SK.demo(g, c, 'drag', [idle.hx, idle.hy - 30], [free[0].x, WY - 30]); else if (free.length) SK.demo(g, c, 'hold', [free[free.length - 1].x, WY - 6]);
  },
  auto(g, dt, synth) {
    const s = g.s; let t = 1.0;
    s.ani.forEach((a, i) => { SK.bot.drag(g, synth, 'a' + i, t, [a.hx, a.hy - 30], [s.pads[i].x, WY - 30], 0.4); t += 0.6; });
    const last = s.pads[s.pads.length - 1]; SK.bot.hold(g, synth, 'h', t, last.x, WY, 1.2);
  },
});
