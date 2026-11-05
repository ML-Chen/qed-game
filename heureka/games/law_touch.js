// ADD YOUR TOUCH! (law LW-16) — a robot has painted a landscape all by itself, in cold machine colours. A copyright
// stamp hovers over the canvas but keeps bouncing off: nobody can own a picture made by the machine alone. Drag the
// penguin artist's own hand-painted pieces (a boat, a bird, a flower; a kite too at level 2) onto the canvas. The
// stamp lands on each human-made piece and outlines only those. Leave the picture as the robot made it and the stamp
// gives up and bonks the robot.
const TAU = Math.PI * 2, CV = { x: 46, y: 150, w: 268, h: 250 };
const PARTS = [
  { kind: 'boat', slot: [214, 330], tray: [104, 540] },
  { kind: 'bird', slot: [120, 196], tray: [176, 540] },
  { kind: 'flower', slot: [96, 370], tray: [248, 540] },
  { kind: 'kite', slot: [262, 196], tray: [318, 540] },
];
function paintStudio(o) {
  const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#e8e0f4'); bg.addColorStop(1, '#c8b8e0'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  o.fillStyle = 'rgba(255,255,255,0.18)'; for (let i = 0; i < 6; i++) { o.beginPath(); o.arc(30 + i * 62, 60 + (i % 2) * 40, 16 + (i % 3) * 6, 0, TAU); o.fill(); }
  B9.wood(o, 0, 470, 360, 170, '#9a7a5a', 4); o.fillStyle = 'rgba(40,20,40,0.25)'; o.fillRect(0, 468, 360, 5);
  // the easel
  o.strokeStyle = '#6a4a2a'; o.lineWidth = 8; o.lineCap = 'round'; o.beginPath(); o.moveTo(90, 470); o.lineTo(130, 140); o.moveTo(270, 470); o.lineTo(230, 140); o.stroke();
  // the robot's painting: sky, sun, mountains and a lake, in flat machine colours with a faint pixel grid
  const { x, y, w, h } = CV; o.fillStyle = '#5a4a3a'; o.fillRect(x - 8, y - 8, w + 16, h + 16);
  o.save(); o.beginPath(); o.rect(x, y, w, h); o.clip();
  const sky = o.createLinearGradient(0, y, 0, y + h); sky.addColorStop(0, '#9ab8c8'); sky.addColorStop(1, '#c8d8d8'); o.fillStyle = sky; o.fillRect(x, y, w, h);
  o.fillStyle = '#d8d0a8'; o.beginPath(); o.arc(x + 200, y + 50, 22, 0, TAU); o.fill();
  o.fillStyle = '#6a8090'; o.beginPath(); o.moveTo(x, y + 170); o.lineTo(x + 70, y + 80); o.lineTo(x + 120, y + 140); o.lineTo(x + 180, y + 70); o.lineTo(x + w, y + 160); o.lineTo(x + w, y + h); o.lineTo(x, y + h); o.closePath(); o.fill();
  o.fillStyle = '#e0e8ec'; o.beginPath(); o.moveTo(x + 58, y + 95); o.lineTo(x + 70, y + 80); o.lineTo(x + 84, y + 98); o.closePath(); o.fill(); o.beginPath(); o.moveTo(x + 166, y + 86); o.lineTo(x + 180, y + 70); o.lineTo(x + 196, y + 90); o.closePath(); o.fill();
  o.fillStyle = '#7a9aa8'; o.fillRect(x, y + 165, w, 50); o.fillStyle = '#8a9a78'; o.fillRect(x, y + 210, w, 40);
  o.strokeStyle = 'rgba(40,60,70,0.12)'; o.lineWidth = 1; for (let i = 0; i < w; i += 8) { o.beginPath(); o.moveTo(x + i, y); o.lineTo(x + i, y + h); o.stroke(); } for (let j = 0; j < h; j += 8) { o.beginPath(); o.moveTo(x, y + j); o.lineTo(x + w, y + j); o.stroke(); }
  o.restore();
  // the artist's tray
  o.fillStyle = 'rgba(40,20,40,0.25)'; o.beginPath(); o.roundRect(70, 504, 284, 76, 18); o.fill();
  P.grain(o, 360, 640, 0.04); P.vignette(o, 360, 640, 0.3);
}
// the artist's hand-painted pieces: warm colours and visible brush strokes
function part(c, kind, x, y, s = 1, o = {}) {
  c.save(); c.translate(x, y); c.scale(s, s); c.lineCap = 'round'; c.lineJoin = 'round';
  if (o.ghost) { c.globalAlpha = 0.5; c.setLineDash([5, 5]); c.strokeStyle = '#fff6ea'; c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, 28, 0, TAU); c.stroke(); c.setLineDash([]); c.globalAlpha = 0.28; }
  if (kind === 'boat') { c.fillStyle = '#c8402a'; c.beginPath(); c.moveTo(-26, 4); c.lineTo(26, 4); c.lineTo(16, 18); c.lineTo(-16, 18); c.closePath(); c.fill(); c.strokeStyle = '#6a3a1a'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 4); c.lineTo(0, -26); c.stroke(); c.fillStyle = '#fff2c8'; c.beginPath(); c.moveTo(3, -24); c.lineTo(22, 0); c.lineTo(3, 0); c.closePath(); c.fill(); c.fillStyle = '#f6c445'; c.beginPath(); c.moveTo(-3, -20); c.lineTo(-18, 0); c.lineTo(-3, 0); c.closePath(); c.fill(); }
  else if (kind === 'bird') { c.strokeStyle = '#2a2a6a'; c.lineWidth = 4; c.beginPath(); c.moveTo(-22, -4); c.quadraticCurveTo(-11, -16, 0, -2); c.quadraticCurveTo(11, -16, 22, -4); c.stroke(); c.fillStyle = '#e84a6a'; c.beginPath(); c.arc(0, -1, 4, 0, TAU); c.fill(); }
  else if (kind === 'flower') { c.strokeStyle = '#3a8a3a'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 24); c.quadraticCurveTo(-4, 10, 0, 0); c.stroke(); c.fillStyle = '#5ab04a'; c.beginPath(); c.ellipse(-8, 14, 7, 3.5, -0.6, 0, TAU); c.fill(); for (let i = 0; i < 6; i++) { const a = i * TAU / 6; c.fillStyle = '#f070a0'; c.beginPath(); c.ellipse(Math.cos(a) * 9, -6 + Math.sin(a) * 9, 7, 5, a, 0, TAU); c.fill(); } c.fillStyle = '#f6c445'; c.beginPath(); c.arc(0, -6, 6, 0, TAU); c.fill(); }
  else { c.fillStyle = '#f08a3a'; c.beginPath(); c.moveTo(0, -24); c.lineTo(16, -2); c.lineTo(0, 22); c.lineTo(-16, -2); c.closePath(); c.fill(); c.fillStyle = '#4aa0d8'; c.beginPath(); c.moveTo(0, -24); c.lineTo(16, -2); c.lineTo(0, -2); c.closePath(); c.fill(); c.strokeStyle = '#6a3a5a'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 22); c.quadraticCurveTo(10, 30, 2, 38); c.stroke(); }
  c.restore();
}
function robot(c, x, y, t, o = {}) {
  c.save(); c.translate(x, y); const bob = Math.sin(t * 4) * 2, arm = Math.sin(t * 6) * 0.4;
  c.fillStyle = 'rgba(30,20,40,0.25)'; c.beginPath(); c.ellipse(0, 4, 30, 7, 0, 0, TAU); c.fill();
  c.fillStyle = '#8a9aa8'; c.beginPath(); c.roundRect(-22, -60 + bob, 44, 54, 8); c.fill(); c.strokeStyle = '#4a5a68'; c.lineWidth = 2.5; c.stroke();
  c.fillStyle = '#6ad0e0'; c.beginPath(); c.roundRect(-14, -48 + bob, 28, 16, 5); c.fill();
  c.fillStyle = '#a8b8c8'; c.beginPath(); c.roundRect(-18, -94 + bob + (o.bonk ? 6 : 0), 36, 30, 7); c.fill(); c.stroke();
  c.fillStyle = o.bonk ? '#2a1a2a' : '#5af0ff'; for (const s of [-1, 1]) { c.beginPath(); if (o.bonk) { c.moveTo(s * 8 - 4, -83 + bob + 6); c.lineTo(s * 8 + 4, -77 + bob + 6); c.moveTo(s * 8 + 4, -83 + bob + 6); c.lineTo(s * 8 - 4, -77 + bob + 6); c.strokeStyle = '#2a1a2a'; c.stroke(); } else { c.arc(s * 8, -80 + bob, 4, 0, TAU); c.fill(); } }
  c.strokeStyle = '#4a5a68'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -94 + bob); c.lineTo(0, -106 + bob); c.stroke(); c.fillStyle = '#ff5a5a'; c.beginPath(); c.arc(0, -108 + bob, 4, 0, TAU); c.fill();
  c.save(); c.translate(22, -46 + bob); c.rotate(-0.8 + arm); c.strokeStyle = '#8a9aa8'; c.lineWidth = 6; c.beginPath(); c.moveTo(0, 0); c.lineTo(28, 0); c.stroke(); c.fillStyle = '#6a8090'; c.fillRect(26, -3, 16, 6); c.restore();
  c.restore();
}
function stamp(c, x, y, rot) { // the copyright stamp: a red rubber stamp with a big © on its face
  c.save(); c.translate(x, y); c.rotate(rot);
  c.fillStyle = 'rgba(30,10,20,0.25)'; c.beginPath(); c.ellipse(4, 34, 26, 6, 0, 0, TAU); c.fill();
  c.fillStyle = '#c8203a'; c.beginPath(); c.roundRect(-24, 10, 48, 16, 5); c.fill();
  c.fillStyle = '#8a5a2a'; c.beginPath(); c.roundRect(-18, -4, 36, 16, 4); c.fill(); c.fillRect(-6, -30, 12, 28); SK.ball(c, 0, -34, 11, '#d8a060');
  B9.txt(c, '©', 0, 18, 16, '#fff6ea');
  c.restore();
}
MG.add({
  id: 'addtouch', stage: 'law', cmd: 'PAINT YOUR OWN PARTS IN!', time: 6, mood: 'desert', winText: 'Your art is protected!', failText: 'No author!',
  card: { title: 'A person has to make it', kind: 'Law', ref: 'Copyright and AI (US Copyright Office, 2025; Thaler v. Perlmutter)',
    text: 'US copyright protects works made by people. The US Copyright Office says that a picture made by an AI on its own, even from a person\'s prompt, can\'t be copyrighted. A federal appeals court agreed in 2025, in a case called Thaler v. Perlmutter.\n\nThe parts a person creatively adds, changes, selects or arranges can be protected, so the stamp landed only on the penguin\'s pieces. The robot\'s mountains stay free for anyone to use. The rules are still being worked out, and other countries differ.\n\nGeneral information about US law, not legal advice.',
    note: 'In the US, work made by AI alone can\'t be copyrighted; the parts a person creatively made or arranged can be.' },
  init(g) {
    const s = g.s; s.parts = PARTS.slice(0, g.level >= 2 ? 4 : 3).map(p => ({ ...p, x: p.tray[0], y: p.tray[1], st: 'tray' })); s.tries = []; s.nextTry = 0.8;
    s.tol = g.level >= 2 ? 26 : 38;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; const p = SK.pick(s.parts.filter(q => q.st === 'tray'), x, y, 40); if (p) { p.st = 'drag'; SK.dragStart(g, p, x, y); g.sfx('pop'); } },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const p = d.obj;
    if (!g.done && SK.dist(p.x, p.y, p.slot[0], p.slot[1]) < s.tol) { p.x = p.slot[0]; p.y = p.slot[1]; p.st = 'on'; p.at = g.t; g.sfx('stretch'); g.sfx('click'); g.burst(p.x, p.y, ['#f070a0', '#f6c445', '#fff6ea'], 10, 110); }
    else { p.st = 'tray'; p.x = p.tray[0]; p.y = p.tray[1]; g.sfx('boing'); }
  },
  update(g, dt) {
    const s = g.s;
    // the stamp lands on each newly painted human piece; on the robot's picture alone it keeps bouncing off
    for (const p of s.parts) if (p.st === 'on' && !p.stamped && g.t - p.at > 0.15 && !s.busy) { s.busy = { p, t: g.t }; }
    if (s.busy && g.t - s.busy.t > 0.45) { s.busy.p.stamped = g.t; s.busy = null; g.sfx('thud'); g.sfx('ding'); }
    if (!s.busy && g.t >= s.nextTry && !g.done) { s.tries.push(g.t); s.nextTry = g.t + 1.8; g.sfx('boing'); }
    if (!g.done && s.parts.every(p => p.stamped) && !s.busy) { g.win(); g.sfx('cheer'); }
    if (!g.done && g.fuse() >= g.dur - 0.05) { s.bonk = g.t; g.sfx('thud'); g.sfx('laugh'); g.fail(); }
  },
  draw(g, c) {
    const s = g.s, t = g.t;
    c.drawImage(g.bake('addtouch', paintStudio), 0, 0, 360, 640);
    // the slots for the artist's pieces: faint dashed outlines on the canvas
    for (const p of s.parts) if (p.st !== 'on') part(c, p.kind, p.slot[0], p.slot[1], 1, { ghost: true });
    // at the win, the robot's own picture greys out: nobody owns it; only the stamped pieces are protected
    if (g.result === 'win') { c.save(); c.globalAlpha = 0.45 * SK.clamp((t - g.doneAt) * 3, 0, 1); c.fillStyle = '#8a8a90'; c.fillRect(CV.x, CV.y, CV.w, CV.h); c.restore(); }
    // pieces on the canvas, each outlined with its own copyright line once stamped
    for (const p of s.parts) if (p.st === 'on') { part(c, p.kind, p.x, p.y, 1); if (p.stamped) { const k = SK.clamp((t - p.stamped) / 0.3, 0, 1); c.save(); c.globalAlpha = k; c.strokeStyle = '#e8304a'; c.lineWidth = 3; c.setLineDash([6, 4]); c.lineDashOffset = -t * 20; c.beginPath(); c.arc(p.x, p.y, 32, 0, TAU); c.stroke(); c.setLineDash([]); c.fillStyle = '#e8304a'; c.beginPath(); c.arc(p.x + 24, p.y - 24, 11, 0, TAU); c.fill(); B9.txt(c, '©', p.x + 24, p.y - 23, 15, '#fff6ea'); c.restore(); } }
    // the hovering stamp: dropping onto a fresh human piece, or bouncing off the robot's picture
    let sx = 180 + Math.sin(t * 1.3) * 60, sy = 128 + Math.sin(t * 2.2) * 4, rot = Math.sin(t * 2) * 0.08;
    if (s.busy) { const k = SK.clamp((t - s.busy.t) / 0.45, 0, 1), q = k < 0.6 ? SK.easeInOut(k / 0.6) : 1 - SK.easeInOut((k - 0.6) / 0.4) * 0.0; sx = SK.lerp(sx, s.busy.p.x, Math.min(1, k * 2)); sy = SK.lerp(sy, s.busy.p.y - 46, q); }
    else { const lt = s.tries[s.tries.length - 1]; if (lt != null && t - lt < 0.6) { const k = (t - lt) / 0.6; sy += Math.sin(k * Math.PI) * 120 * (k < 0.5 ? 1 : 1); rot += Math.sin(k * 30) * 0.3 * (k > 0.5 ? 1 - k : 0); if (k > 0.48 && k < 0.56) { c.save(); c.globalAlpha = 0.6; c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.beginPath(); c.arc(sx, sy + 40, 22, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); c.restore(); } } }
    if (s.bonk) { const k = SK.clamp((t - s.bonk) / 0.4, 0, 1); sx = SK.lerp(sx, 44, k); sy = SK.lerp(sy, 380, k) - Math.sin(k * Math.PI) * 80; }
    stamp(c, sx, sy, rot);
    robot(c, 40, 470, t, { bonk: s.bonk && t - s.bonk > 0.4 });
    // the artist's tray of hand-painted pieces, and the one in hand
    const held = SK.dragging(g);
    for (const p of s.parts) if (p.st === 'tray') part(c, p.kind, p.x, p.y, 0.85);
    if (held) part(c, held.kind, held.x, held.y, 1.05);
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'penguin', 36, 620, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
    // labels: the robot (an AI), its picture, the stamp, and your own pieces
    SK.tag(c, 'AI', 40, 336, 18); SK.tag(c, 'AI picture', 180, CV.y + CV.h + 22, 18);
    if (!s.bonk) SK.tag(c, 'Copyright', sx, sy - 64, 18, '#ffd0d0');
    if (s.parts.some(p => p.st === 'tray')) SK.tag(c, 'Your art', 212, 498, 18, '#d0ffd8');
    const nx = s.parts.find(p => p.st === 'tray');
    if (nx && !held && !g.done) { SK.grab(c, g, nx.x, nx.y, 30); SK.target(c, g, nx.slot[0], nx.slot[1], 30); SK.arrow(c, g, nx.x, nx.y, nx.slot[0], nx.slot[1]); }
    if (nx && !held) SK.demo(g, c, 'drag', [nx.x, nx.y], nx.slot);
  },
  auto(g, dt, synth) {
    const s = g.s, Q = s._plan = s._plan || { n: 0 };
    if (Q.cur) { if (SK.bot.drag(g, synth, Q.cur.key, Q.cur.t, Q.cur.a, Q.cur.b, 0.35)) Q.cur = null; return; }
    if (g.done || SK.dragging(g) || g.t < 1.0) return;
    if (g.t < (Q.next || 0)) return; const p = s.parts.find(q => q.st === 'tray'); if (!p) return;
    Q.n++; Q.cur = { key: 'p' + Q.n, t: g.t, a: [p.x, p.y], b: p.slot }; Q.next = g.t + 0.5;
  },
});
