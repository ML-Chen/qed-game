// BRACE! (build EE ME-21) — a wooden bridge of square frames over a canyon, a log truck waiting to cross. Drag a diagonal
// across each square. A braced square is two triangles and holds its shape; when the truck rolls onto a square left
// without a diagonal, it leans over and folds flat, and the truck rolls into the dip and stops.
const BR_X0 = 62, BR_X1 = 334, BR_YT = 372, BR_N = [3, 3, 4];
function brPaint(o) {
  B5.vgrad(o, 0, 0, 360, 640, ['#86c4e4', '#c4e4f0', '#fbe8c8']);
  P.cloud(o, 80, 210, 0.7); P.cloud(o, 270, 170, 0.55);
  // far mesas
  o.fillStyle = '#e0a88a'; o.beginPath(); o.moveTo(0, 360); o.lineTo(30, 300); o.lineTo(110, 296); o.lineTo(130, 330); o.lineTo(220, 326); o.lineTo(240, 284); o.lineTo(320, 280); o.lineTo(360, 320); o.lineTo(360, 640); o.lineTo(0, 640); o.fill();
  o.fillStyle = '#d0907a'; o.beginPath(); o.moveTo(0, 400); o.lineTo(60, 360); o.lineTo(160, 366); o.lineTo(260, 350); o.lineTo(360, 372); o.lineTo(360, 640); o.lineTo(0, 640); o.fill();
  // the canyon: a river far below
  B5.vgrad(o, 0, 400, 360, 240, ['#b8705a', '#8a4a40', '#5a2e34']);
  B5.vgrad(o, 0, 560, 360, 80, ['#3a9ab0', '#2a7a98', '#1e5a78']);
  o.strokeStyle = 'rgba(255,255,255,0.45)'; o.lineWidth = 2; for (let i = 0; i < 8; i++) { o.beginPath(); o.moveTo(40 + i * 40, 580 + (i % 3) * 12); o.lineTo(60 + i * 40, 580 + (i % 3) * 12); o.stroke(); }
  // the two cliffs, layered sandstone
  const cliff = (pts, sh) => { o.beginPath(); pts.forEach(([x, y], i) => i ? o.lineTo(x, y) : o.moveTo(x, y)); o.closePath(); const gr = o.createLinearGradient(0, BR_YT, 0, 640); gr.addColorStop(0, '#e8a860'); gr.addColorStop(0.5, '#c87a48'); gr.addColorStop(1, '#8a4a34'); o.fillStyle = gr; o.fill();
    o.save(); o.clip(); o.strokeStyle = 'rgba(120,50,30,0.35)'; o.lineWidth = 3; for (let y = BR_YT + 30; y < 640; y += 26) { o.beginPath(); o.moveTo(sh - 80, y); o.lineTo(sh + 80, y + 6); o.stroke(); } o.restore(); };
  cliff([[-10, BR_YT], [BR_X0 + 4, BR_YT], [BR_X0 + 8, BR_YT + 60], [50, BR_YT + 150], [62, 560], [40, 640], [-10, 640]], 20);
  cliff([[370, BR_YT], [BR_X1 - 4, BR_YT], [BR_X1 - 10, BR_YT + 70], [348, BR_YT + 160], [334, 560], [350, 640], [370, 640]], 340);
  // the road on top of each cliff
  o.fillStyle = '#6a5a5a'; o.fillRect(-10, BR_YT - 8, BR_X0 + 14, 9); o.fillRect(BR_X1 - 4, BR_YT - 8, 80, 9);
  o.fillStyle = '#8ac860'; o.fillRect(-10, BR_YT + 1, BR_X0 + 14, 5); o.fillRect(BR_X1 - 4, BR_YT + 1, 80, 5);
  P.grain(o, 360, 640, 0.035);
}
function brBeam(c, a, b, col = '#b07a44', w = 9) {
  c.save(); c.lineCap = 'round'; c.strokeStyle = '#4a2a1a'; c.lineWidth = w + 3; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
  c.strokeStyle = col; c.lineWidth = w; c.stroke(); c.strokeStyle = 'rgba(255,230,180,0.45)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(a[0], a[1] - 2); c.lineTo(b[0], b[1] - 2); c.stroke(); c.restore();
}
function brTruck(c, x, y, a, t, moving) {
  c.save(); c.translate(x, y); c.rotate(a); c.scale(0.74, 0.74);
  SK.shadow(c, 0, 0, 34, 5, 0.25);
  // logs on the bed
  c.fillStyle = '#c4874a'; c.strokeStyle = '#5a3420'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { c.beginPath(); c.roundRect(-38, -40 + i * 8 - (i === 2 ? 0 : 0), 44, 9, 4); c.fill(); c.stroke(); c.fillStyle = '#e8c08a'; c.beginPath(); c.arc(-36, -35.5 + i * 8, 3.5, 0, 7); c.fill(); c.fillStyle = '#c4874a'; }
  c.fillStyle = '#e84a3a'; c.strokeStyle = '#5a1a20'; c.beginPath(); c.roundRect(-40, -18, 50, 12, 3); c.fill(); c.stroke();
  // cab
  c.fillStyle = '#ffc93a'; c.beginPath(); c.moveTo(8, -6); c.lineTo(8, -34); c.lineTo(26, -34); c.lineTo(36, -18); c.lineTo(38, -6); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#bfe8ff'; c.beginPath(); c.moveTo(13, -20); c.lineTo(13, -30); c.lineTo(24, -30); c.lineTo(31, -20); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#7a4a2a'; c.beginPath(); c.arc(19, -23, 5, 0, 7); c.fill(); // the driver's head
  for (const wx of [-26, 26]) { c.save(); c.translate(wx, -4); c.rotate(moving ? t * 8 : 0); c.fillStyle = '#2a2430'; c.beginPath(); c.arc(0, 0, 8, 0, 7); c.fill(); c.fillStyle = '#b0a8b8'; c.beginPath(); c.arc(0, 0, 3.5, 0, 7); c.fill(); c.fillRect(-1, -7, 2, 4); c.restore(); }
  c.restore();
}
// the frame's joints: bottom node j and top node j, after any folding
function brNodes(s) {
  const n = s.n, S = s.S, B = [], T = [];
  for (let j = 0; j <= n; j++) {
    let drop = 0, lean = 0;
    s.sq.forEach((q, k) => { if (!q.fold) return; const f = SK.easeInOut(q.fold), sh = j <= k ? j / (k + 0.5) : (n - j) / (n - k - 0.5); drop += f * 46 * Math.max(0, Math.min(1, sh)); if (j === k || j === k + 1) lean = Math.max(lean, f * 1.25); });
    const bx = BR_X0 + j * S, by = BR_YT + S + drop; B.push([bx, by]); T.push([bx + Math.sin(lean) * S, by - Math.cos(lean) * S]);
  }
  return { B, T };
}
MG.add({
  id: 'brace', stage: 'build', cmd: 'BRACE!', time: 5, mood: 'desert', winText: 'Solid!', failText: 'Folded!',
  card: { title: 'Triangles hold their shape', kind: 'Engineering', ref: 'Trusses and triangulation',
    text: 'A square frame with pins at its corners can lean over like a pushed bookshelf. Its sides stay the same length, but the corners can change their angles, so the square folds into a flat diamond.\n\nA triangle cannot do that. Once its three sides are fixed, its corners are fixed too. A diagonal splits a square into two triangles, so the frame stays square.\n\nThat is why bridges, cranes, roofs and bike frames are full of triangles. A frame built from triangles is called a truss.',
    note: 'A triangle cannot change shape without changing a side, so diagonal braces stop frames from folding.' },
  init(g) {
    const s = g.s, n = BR_N[Math.min(2, g.level)], S = (BR_X1 - BR_X0) / n; s.n = n; s.S = S;
    s.sq = []; for (let k = 0; k < n; k++) s.sq.push({ x: BR_X0 + k * S, brace: 0, dir: 1, fold: 0, at: 0 });
    s.truck = { x: 26, v: 0 }; s.goT = 0; s.line = null; s.stopT = 0;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; s.line = { a: [x, y], b: [x, y] }; },
  move(g, x, y) { const s = g.s; if (s.line) s.line.b = [x, y]; },
  up(g, x, y) {
    const s = g.s, L = s.line; s.line = null; if (!L || g.done) return; const [ax, ay] = L.a, [bx, by] = L.b, S = s.S;
    if (Math.abs(bx - ax) < S * 0.45 || Math.abs(by - ay) < S * 0.45) return; // too short or too flat for a diagonal
    const mx = (ax + bx) / 2, my = (ay + by) / 2, k = Math.floor((mx - BR_X0) / S), q = s.sq[k];
    if (!q || q.brace || my < BR_YT - 30 || my > BR_YT + S + 30) return;
    q.brace = g.t; q.dir = (bx - ax) * (by - ay) > 0 ? 1 : -1; g.sfx('click'); g.sfx('thud'); g.burst(mx, my, ['#ffd45a', '#e8b878', '#fff6ea'], 10, 120);
  },
  update(g, dt) {
    const s = g.s, tr = s.truck, all = s.sq.every(q => q.brace);
    if (!s.goT) { const at = SK.clamp(g.dur * 0.5, g.level >= 2 ? 3.0 : 3.6, 7); if ((all && !s.allT) || 0) s.allT = g.t; if ((s.allT && g.t - s.allT > 0.35) || (!B5.patient() && g.t > at)) { s.goT = g.t; g.sfx('rumble'); } }
    if (!s.goT) return;
    for (const q of s.sq) if (q.at) q.fold = Math.min(1, q.fold + dt * 1.8);
    if (!s.stopT) tr.v = Math.min(170, tr.v + 300 * dt); else tr.v *= Math.exp(-6 * dt);
    tr.x += tr.v * dt;
    // the truck's front wheels reach a square: a braced one holds, an open one folds
    const k = Math.floor((tr.x + 14 - BR_X0) / s.S), q = s.sq[k];
    if (q && !q.brace && !q.at && tr.x + 14 > q.x + 8) { q.at = g.t; s.stopT = g.t; g.sfx('stretch'); g.sfx('crunch'); g.shake(5, 0.4); g.fail(); }
    if (q && q.brace && !q.ok) { q.ok = 1; g.sfx('drum'); }
    if (tr.x > 356 && !g.done) { g.win(); g.sfx('cheer'); g.sfx('honk'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, tr = s.truck, { B, T } = brNodes(s);
    c.drawImage(g.bake('brace_bg', brPaint), 0, 0, 360, 640);
    // the frame: bottom chord, verticals, top chord (the road), diagonals
    for (let j = 0; j < s.n; j++) brBeam(c, B[j], B[j + 1], '#a06a3a', 8);
    for (let j = 0; j <= s.n; j++) brBeam(c, B[j], T[j], '#b07a44', 8);
    s.sq.forEach((q, k) => { if (!q.brace) return; const pop = SK.easeOut((t - q.brace) / 0.25); const a = q.dir > 0 ? T[k] : T[k + 1], b = q.dir > 0 ? B[k + 1] : B[k];
      brBeam(c, a, [SK.lerp(a[0], b[0], pop), SK.lerp(a[1], b[1], pop)], '#e8a24a', 9); });
    for (let j = 0; j < s.n; j++) { brBeam(c, T[j], T[j + 1], '#7a6a6a', 10); }
    for (const p of [...B, ...T]) { c.fillStyle = '#3a2a2a'; c.beginPath(); c.arc(p[0], p[1], 4.5, 0, 7); c.fill(); c.fillStyle = '#c8c0c8'; c.beginPath(); c.arc(p[0] - 1, p[1] - 1, 2, 0, 7); c.fill(); }
    // glowing open squares at levels 0 and 1
    if (!s.goT) s.sq.forEach(q => { if (!q.brace) SK.glow(c, g, q.x + s.S / 2, BR_YT + s.S / 2, s.S * 0.36); });
    // the line being drawn
    if (s.line) { c.save(); c.strokeStyle = 'rgba(255,240,200,0.9)'; c.lineWidth = 6; c.lineCap = 'round'; c.setLineDash([10, 8]); c.beginPath(); c.moveTo(...s.line.a); c.lineTo(...s.line.b); c.stroke(); c.restore(); }
    // the truck rides along the road (the top chord), following any dip
    const roadY = x => { if (x <= T[0][0]) return x < BR_X0 ? BR_YT - 8 : T[0][1] - 5; for (let j = 0; j < s.n; j++) if (x <= T[j + 1][0]) { const k = (x - T[j][0]) / Math.max(1, T[j + 1][0] - T[j][0]); return SK.lerp(T[j][1], T[j + 1][1], k) - 5; } return x > BR_X1 ? BR_YT - 8 : T[s.n][1] - 5; };
    const ty = roadY(tr.x), ang = Math.atan2(roadY(tr.x + 20) - roadY(tr.x - 20), 40);
    brTruck(c, tr.x, ty + (s.goT && !s.stopT ? Math.sin(t * 30) * 0.6 : 0), ang, t, tr.v > 5);
    // the beaver on the far cliff waves the truck over
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'beaver', 348, BR_YT - 8, 0.5, { t, facing: -1, pose: won ? 'cheer' : lost ? 'sad' : 'wave', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
    const q0 = s.sq.find(q => !q.brace); if (q0) SK.demo(g, c, 'drag', [q0.x + 6, BR_YT + 6], [q0.x + s.S - 6, BR_YT + s.S - 6]);
  },
  auto(g, dt, synth) { const s = g.s; s.sq.forEach((q, k) => SK.bot.drag(g, synth, 'b' + k, 0.9 + k * 0.3, [q.x + 8, BR_YT + 8], [q.x + s.S - 8, BR_YT + s.S - 8], 0.18)); },
});
