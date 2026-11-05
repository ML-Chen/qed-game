// BREAK IT UP! (problems EC-13) — a messy bedroom: one giant cloud of stuff (toys, clothes, books, and shoes at level 2)
// floats over the floor, far too big for the beaver to carry. Swipe across the cloud to cut it: it splits along your
// swipe into two smaller clouds. A cloud that holds only one kind of thing is a small, easy job: it drops straight into
// its own box. Keep cutting until every pile is in its box and the room is tidy. A cut through the middle of a kind is
// fine (both halves go to the same box); a pile that still mixes two kinds belongs in two boxes, so it waits for another
// cut. Run out of time and the beaver tries to lift the whole cloud at once and topples under it.
// The idea: a big job is easier when you split it into small jobs that each have one place to go.
const TAU = Math.PI * 2;
const KIND = [{ n: 'Toys', col: '#e8563a' }, { n: 'Clothes', col: '#3a8ad8' }, { n: 'Books', col: '#3ab07a' }, { n: 'Shoes', col: '#a85ad8' }];
const LAY3 = [[[80, 290], [180, 290], [280, 290]], [[84, 222], [180, 296], [276, 370]], [[276, 222], [180, 296], [84, 370]], [[100, 236], [260, 236], [180, 366]]];
const LAY4 = [[[100, 226], [260, 226], [100, 364], [260, 364]], [[180, 200], [82, 296], [278, 296], [180, 392]], [[90, 228], [190, 210], [270, 310], [150, 380]], [[72, 250], [180, 216], [288, 250], [180, 372]]];
const PAT = [[-22, -18], [22, -20], [-20, 20], [24, 18]];
const BOX_Y = 548, FLOOR = 456, BEAV = [316, 486];
function boxX(i, n) { return n === 3 ? 66 + i * 114 : 46 + i * 89; }
function paintRoom(o) {
  // a cosy kid's room: striped wallpaper, a window with sky, a rug on the wooden floor
  const wl = o.createLinearGradient(0, 0, 0, FLOOR); wl.addColorStop(0, '#f8d8e8'); wl.addColorStop(1, '#f0c0d8'); o.fillStyle = wl; o.fillRect(0, 0, 360, FLOOR);
  for (let x = 0; x < 360; x += 36) { o.fillStyle = 'rgba(255,255,255,0.35)'; o.fillRect(x, 0, 14, FLOOR); }
  for (let x = 18; x < 360; x += 72) for (let y = 30; y < FLOOR; y += 64) { o.fillStyle = 'rgba(232,120,170,0.35)'; o.beginPath(); o.arc(x + (y / 64 % 2) * 36, y, 4, 0, TAU); o.fill(); }
  o.fillStyle = '#fff6ea'; o.beginPath(); o.roundRect(236, 128, 104, 90, 8); o.fill(); const sk = o.createLinearGradient(0, 136, 0, 210); sk.addColorStop(0, '#6ab8e8'); sk.addColorStop(1, '#c8ecf8'); o.fillStyle = sk; o.fillRect(244, 136, 88, 74);
  P.cloud(o, 272, 168, 0.3); o.fillStyle = '#fff6ea'; o.fillRect(286, 136, 4, 74); o.fillRect(244, 171, 88, 4);
  o.fillStyle = '#e8708a'; o.beginPath(); o.moveTo(230, 120); o.lineTo(256, 120); o.quadraticCurveTo(248, 180, 236, 228); o.lineTo(228, 228); o.closePath(); o.fill(); o.beginPath(); o.moveTo(346, 120); o.lineTo(320, 120); o.quadraticCurveTo(328, 180, 340, 228); o.lineTo(348, 228); o.closePath(); o.fill();
  // a shelf with a plant and a picture frame on the left
  o.fillStyle = '#b07440'; o.fillRect(14, 150, 92, 8); o.fillStyle = '#5a9a48'; o.beginPath(); o.arc(36, 134, 14, 0, TAU); o.fill(); o.fillStyle = '#c8603a'; o.fillRect(28, 138, 16, 12);
  o.fillStyle = '#f6c445'; o.fillRect(62, 120, 34, 30); o.fillStyle = '#6ab8e8'; o.fillRect(66, 124, 26, 22); o.fillStyle = '#5a9a48'; o.beginPath(); o.moveTo(66, 146); o.lineTo(78, 132); o.lineTo(92, 146); o.fill();
  // the floor
  const fl = o.createLinearGradient(0, FLOOR, 0, 640); fl.addColorStop(0, '#c88a50'); fl.addColorStop(1, '#8a5a30'); o.fillStyle = fl; o.fillRect(0, FLOOR, 360, 640 - FLOOR);
  o.strokeStyle = 'rgba(80,40,10,0.25)'; o.lineWidth = 1.5; for (let y = FLOOR + 18; y < 640; y += 22) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); }
  o.fillStyle = '#7a4a2a'; o.fillRect(0, FLOOR - 6, 360, 8);
  o.fillStyle = 'rgba(120,200,220,0.35)'; o.beginPath(); o.ellipse(180, 600, 170, 30, 0, 0, TAU); o.fill();
  P.grain(o, 360, 640, 0.035); P.vignette(o, 360, 640, 0.22);
}
function item(c, k, x, y, v, t) { // one thing in the mess: kind k, look v
  c.save(); c.translate(x, y); c.rotate(Math.sin(t * 1.5 + v * 2) * 0.12 + (v % 3 - 1) * 0.3); c.lineJoin = 'round'; c.strokeStyle = '#3a1640'; c.lineWidth = 2;
  if (k === 0) { // toys: a ball, a teddy, a block, a duckling
    if (v % 4 === 0) { SK.ball(c, 0, 0, 12, '#e8403a'); c.fillStyle = '#fff6ea'; c.fillRect(-12, -2, 24, 4); }
    else if (v % 4 === 1) { c.fillStyle = '#c8884a'; for (const [ex, ey] of [[-9, -10], [9, -10]]) { c.beginPath(); c.arc(ex, ey, 5, 0, TAU); c.fill(); c.stroke(); } c.beginPath(); c.arc(0, 0, 12, 0, TAU); c.fill(); c.stroke(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(-4, -2, 1.8, 0, TAU); c.arc(4, -2, 1.8, 0, TAU); c.fill(); c.fillStyle = '#f0c89a'; c.beginPath(); c.ellipse(0, 4, 5, 3.5, 0, 0, TAU); c.fill(); }
    else if (v % 4 === 2) { c.fillStyle = '#f6c445'; c.beginPath(); c.roundRect(-11, -11, 22, 22, 3); c.fill(); c.stroke(); c.fillStyle = '#e8563a'; c.font = '900 15px Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('A', 0, 1); }
    else { c.fillStyle = '#ffd45a'; c.beginPath(); c.ellipse(0, 3, 12, 8, 0, 0, TAU); c.fill(); c.stroke(); c.beginPath(); c.arc(6, -6, 6, 0, TAU); c.fill(); c.stroke(); c.fillStyle = '#e8803a'; c.beginPath(); c.moveTo(11, -6); c.lineTo(17, -4); c.lineTo(11, -2); c.fill(); }
  } else if (k === 1) { // clothes: a T-shirt, a sock, shorts, a hat
    const col = ['#3a8ad8', '#5ac8e8', '#2a5aa8', '#78a8f0'][v % 4]; c.fillStyle = col;
    if (v % 4 === 0) { c.beginPath(); c.moveTo(-14, -8); c.lineTo(-6, -12); c.lineTo(6, -12); c.lineTo(14, -8); c.lineTo(10, -2); c.lineTo(7, -4); c.lineTo(7, 12); c.lineTo(-7, 12); c.lineTo(-7, -4); c.lineTo(-10, -2); c.closePath(); c.fill(); c.stroke(); }
    else if (v % 4 === 1) { c.beginPath(); c.moveTo(-4, -13); c.lineTo(5, -13); c.lineTo(5, 3); c.quadraticCurveTo(14, 4, 13, 10); c.lineTo(-2, 11); c.quadraticCurveTo(-5, 8, -4, 2); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#fff6ea'; c.fillRect(-4, -13, 9, 4); }
    else if (v % 4 === 2) { c.beginPath(); c.moveTo(-12, -9); c.lineTo(12, -9); c.lineTo(13, 10); c.lineTo(2, 10); c.lineTo(0, 0); c.lineTo(-2, 10); c.lineTo(-13, 10); c.closePath(); c.fill(); c.stroke(); }
    else { c.beginPath(); c.arc(0, 2, 11, Math.PI, 0); c.closePath(); c.fill(); c.stroke(); c.beginPath(); c.ellipse(4, 3, 14, 3.5, 0, 0, TAU); c.fill(); c.stroke(); }
  } else if (k === 2) { // books
    const col = ['#3ab07a', '#2a8a5a', '#7ac85a', '#1a6a4a'][v % 4]; c.fillStyle = col; c.beginPath(); c.roundRect(-10, -13, 20, 26, 2); c.fill(); c.stroke(); c.fillStyle = '#fff6ea'; c.fillRect(6, -12, 3, 24); c.fillStyle = 'rgba(255,255,255,0.6)'; c.fillRect(-6, -7, 10, 3); c.fillRect(-6, -2, 8, 2);
  } else { // shoes
    const col = ['#a85ad8', '#8a3ab8', '#c88af0', '#6a2a9a'][v % 4]; c.fillStyle = col; c.beginPath(); c.moveTo(-14, 6); c.lineTo(-12, -8); c.lineTo(-2, -8); c.quadraticCurveTo(2, 0, 12, 1); c.quadraticCurveTo(16, 4, 14, 8); c.lineTo(-14, 8); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#fff6ea'; c.fillRect(-14, 6, 28, 4); c.strokeRect(-14, 6, 28, 4);
  }
  c.restore();
}
function box(c, x, y, k, fill, t) {
  const w = 80, h = 62, col = KIND[k].col;
  c.fillStyle = 'rgba(30,10,20,0.3)'; c.beginPath(); c.ellipse(x + 4, y + h / 2 + 4, w * 0.55, 8, 0, 0, TAU); c.fill();
  c.fillStyle = P.shade(col, -0.35); c.beginPath(); c.moveTo(x - w / 2, y - h / 2); c.lineTo(x - w / 2 - 12, y - h / 2 - 16); c.lineTo(x - w / 2 + 10, y - h / 2 - 8); c.closePath(); c.fill(); c.beginPath(); c.moveTo(x + w / 2, y - h / 2); c.lineTo(x + w / 2 + 12, y - h / 2 - 16); c.lineTo(x + w / 2 - 10, y - h / 2 - 8); c.closePath(); c.fill();
  const bg = c.createLinearGradient(x - w / 2, 0, x + w / 2, 0); bg.addColorStop(0, P.shade(col, 0.15)); bg.addColorStop(1, P.shade(col, -0.2)); c.fillStyle = bg; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 6); c.fill(); c.strokeStyle = P.shade(col, -0.55); c.lineWidth = 2; c.stroke();
  for (let i = 0; i < Math.min(3, fill); i++) item(c, k, x - 20 + i * 20, y - h / 2 - 2 - (i % 2) * 4, i * 5 + 1, 0);
  c.fillStyle = P.shade(col, 0.1); c.fillRect(x - w / 2, y - h / 2, w, 10);
}
function centroid(s, p) { let x = 0, y = 0; for (const i of p.items) { x += s.it[i].x; y += s.it[i].y; } return [x / p.items.length + p.ox, y / p.items.length + p.oy]; }
function kindsOf(s, p) { return [...new Set(p.items.map(i => s.it[i].k))]; }
// a clean cut for the guide and the bot: the straight line with the widest gap between one kind and the rest of its pile
function goodCut(s) {
  for (const p of s.piles) { if (p.st !== 'float') continue; const ks = kindsOf(s, p); if (ks.length < 2) continue; let best = null;
    for (const k of ks) for (let j = 0; j < 24; j++) { const th = j * Math.PI / 24, nx = Math.cos(th), ny = Math.sin(th); let kmin = 1e9, kmax = -1e9, omin = 1e9, omax = -1e9;
      for (const i of p.items) { const q = s.it[i], pr = (q.x + p.ox) * nx + (q.y + p.oy) * ny; if (q.k === k) { kmin = Math.min(kmin, pr); kmax = Math.max(kmax, pr); } else { omin = Math.min(omin, pr); omax = Math.max(omax, pr); } }
      for (const [gap, at] of [[omin - kmax, (omin + kmax) / 2], [kmin - omax, (kmin + omax) / 2]]) if (gap > 0 && (!best || gap > best.gap)) best = { gap, at, nx, ny, k }; }
    if (!best) continue; const [cx, cy] = centroid(s, p), off = cx * best.nx + cy * best.ny - best.at, mx = cx - best.nx * off, my = cy - best.ny * off, tx = -best.ny, ty = best.nx, h = 110;
    let a0 = [mx - tx * h, my - ty * h], a1 = [mx + tx * h, my + ty * h]; if (a0[1] > a1[1] + 1 || (Math.abs(a0[1] - a1[1]) <= 1 && a0[0] > a1[0])) [a0, a1] = [a1, a0]; return [a0, a1]; }
  return null;
}
MG.add({
  id: 'breakup', stage: 'problems', cmd: 'SPLIT THE MESS INTO 3 PILES!', cmdAt: [null, null, 'SPLIT THE MESS INTO 4 PILES!'], time: 6, mood: 'party', winText: 'Room tidy!', failText: 'Too big to lift!',
  card: { title: 'Break a big job into small ones', kind: 'Problem solving', ref: 'Breaking a problem down',
    text: 'The whole mess was too big for the beaver to lift. Each cut made smaller piles. A pile with only one kind of thing had one clear place to go, so it dropped into its box.\n\nA pile that still mixed two kinds belonged in two boxes, so it needed another cut. Cutting through the middle of the toys was fine: both halves still went in the toy box.\n\nBig jobs at work are broken down the same way. You split them into small parts, and each part has one clear owner or place.',
    note: 'Split a big job into small parts that each have one clear place to go.' },
  init(g) {
    const s = g.s, v = SK.variant(g, 4), n = g.level >= 2 ? 4 : 3, lay = (n === 3 ? LAY3 : LAY4)[v], ks = SK.shuffled(g, [0, 1, 2, 3].slice(0, n));
    s.n = n; s.it = []; ks.forEach((k, ci) => { const [cx, cy] = lay[ci], r0 = g.rand() * 4; PAT.forEach(([dx, dy], j) => s.it.push({ k, x: cx + dx + (g.rand() - 0.5) * 6, y: cy + dy + (g.rand() - 0.5) * 6, v: Math.floor(r0) + j })); });
    s.piles = [{ items: s.it.map((_, i) => i), ox: 0, oy: 0, fx: 0, fy: 0, at: -9, st: 'float' }]; s.fill = [0, 0, 0, 0]; s.cuts = []; s.inBox = 0;
  },
  down(g, x, y) { SK.touched(g); if (!g.done) SK.dragStart(g, null, x, y); },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g, x, y) {
    const s = g.s, d = g.s._drag, r = SK.dragEnd(g); if (!r || !d || g.done) return; const a = d.pts[0], b = [r.x, r.y], L = SK.dist(a.x, a.y, b[0], b[1]); if (L < 60) return;
    const nx = -(b[1] - a.y) / L, ny = (b[0] - a.x) / L; let cut = false; const out = [];
    for (const p of s.piles) {
      if (p.st !== 'float' || p.items.length < 2) { out.push(p); continue; }
      // the swipe must pass over this pile (its line, stretched a little, comes near the pile's centre)
      const [cx, cy] = centroid(s, p), ux = (b[0] - a.x) / L, uy = (b[1] - a.y) / L, along = (cx - a.x) * ux + (cy - a.y) * uy, perp = Math.abs((cx - a.x) * nx + (cy - a.y) * ny);
      if (along < -40 || along > L + 40 || perp > 90) { out.push(p); continue; }
      const side = i => (s.it[i].x + p.ox - a.x) * nx + (s.it[i].y + p.oy - a.y) * ny, A = p.items.filter(i => side(i) < 0), B = p.items.filter(i => side(i) >= 0);
      if (!A.length || !B.length) { out.push(p); continue; }
      cut = true; for (const [part, sg] of [[A, -1], [B, 1]]) out.push({ items: part, ox: p.ox + sg * nx * 16, oy: p.oy + sg * ny * 16, fx: p.ox, fy: p.oy, at: g.t, st: 'float' });
    }
    if (!cut) { g.sfx('swoosh'); return; }
    s.piles = out; s.cuts.push({ a: [a.x, a.y], b, t: g.t }); g.sfx('snap'); g.sfx('swoosh');
    for (const p of s.piles) if (p.st === 'float' && kindsOf(s, p).length === 1 && p.at === g.t) { p.st = 'wait'; }
  },
  update(g, dt) {
    const s = g.s;
    for (const p of s.piles) {
      if (p.st === 'wait' && g.t - p.at > 0.25) { p.st = 'drop'; p.dt0 = g.t; p.from = centroid(s, p); g.sfx('whoosh'); }
      if (p.st === 'drop' && g.t - p.dt0 > 0.45) { p.st = 'in'; const k = s.it[p.items[0]].k; s.fill[k] += p.items.length; s.inBox++; g.sfx('thud'); g.sfx('pop'); g.burst(boxX(k, s.n), BOX_Y - 34, [KIND[k].col, '#fff6ea'], 10, 120);
        if (s.piles.every(q => q.st === 'in') && !g.done) { g.win(); g.sfx('cheer'); } }
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', lt = lost ? g.t - g.doneAt : 0;
    c.drawImage(g.bake('breakup', paintRoom), 0, 0, 360, 640);
    for (let k = 0; k < s.n; k++) { box(c, boxX(k, s.n), BOX_Y, k, s.fill[k], t); SK.tag(c, KIND[k].n, boxX(k, s.n), BOX_Y + 48, 18); }
    // the beaver: arms open, thinking; at a timeout it tries to lift the whole cloud and topples under it
    const fall = lost ? SK.easeOut(SK.clamp((lt - 0.35) / 0.35, 0, 1)) : 0;
    const beaver = () => { c.save(); c.translate(BEAV[0], BEAV[1]); c.rotate(-fall * 1.3); SK.animal(c, 'beaver', 0, 0, 1.15, { t, pose: won ? 'cheer' : lost ? 'carry' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'think', facing: -1, noShadow: fall > 0 }); c.restore(); };
    if (!lost) beaver();
    // the piles: each a soft cloud round its things
    for (const p of s.piles) {
      if (p.st === 'in') continue; const pk = SK.easeOut((t - p.at) / 0.25); let ox = SK.lerp(p.fx, p.ox, pk), oy = SK.lerp(p.fy, p.oy, pk), sc = 1;
      if (p.st === 'drop') { const k = SK.easeInOut((t - p.dt0) / 0.45), bk = s.it[p.items[0]].k; ox += (boxX(bk, s.n) - p.from[0]) * k; oy += (BOX_Y - 30 - p.from[1]) * k - Math.sin(k * Math.PI) * 30; sc = 1 - 0.4 * k; }
      if (lost && p.st === 'float') { const k = SK.easeInOut(SK.clamp(lt / 0.4, 0, 1)), [cx, cy] = centroid(s, p); ox += (BEAV[0] - 40 - cx) * k * 0.7; oy += (BEAV[1] - 70 - cy) * k * 0.7; }
      const mixed = kindsOf(s, p).length > 1, bob = Math.sin(t * 2 + p.items[0]) * 3, cx0 = centroid(s, p)[0] - p.ox + ox, cy0 = centroid(s, p)[1] - p.oy + oy + bob;
      c.save(); c.translate(cx0, cy0); c.scale(sc, sc); c.translate(-cx0, -cy0);
      // one lumpy cloud round the whole pile: puffs on every thing and on the gaps between near neighbours
      const pts = p.items.map(i => [s.it[i].x + ox, s.it[i].y + oy + bob]);
      for (let a = 0; a < p.items.length; a++) for (let b = a + 1; b < p.items.length; b++) { const dd = SK.dist(pts[a][0], pts[a][1], pts[b][0], pts[b][1]); if (dd < 125) pts.push([(pts[a][0] + pts[b][0]) / 2, (pts[a][1] + pts[b][1]) / 2]); }
      for (const [r, col] of [[34, mixed ? '#8a6aa8' : '#c8a040'], [31, mixed ? '#e4d8f0' : '#fff4c8']]) { c.fillStyle = col; c.beginPath(); for (const [px, py] of pts) { c.moveTo(px + r, py); c.arc(px, py, r, 0, TAU); } c.fill(); }
      c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); for (const [px, py] of pts.slice(0, p.items.length)) { c.moveTo(px - 4 + 14, py - 12); c.arc(px - 4, py - 12, 14, 0, TAU); } c.fill();
      for (const i of p.items) { const q = s.it[i]; c.save(); c.translate(q.x + ox, q.y + oy + bob); c.scale(1.3, 1.3); item(c, q.k, 0, 0, q.v, t); c.restore(); }
      c.restore();
    }
    if (lost) beaver();
    // the slash of each cut fades
    for (const cu of s.cuts) { const k = (t - cu.t) / 0.35; if (k > 1) continue; c.strokeStyle = `rgba(255,255,255,${1 - k})`; c.lineWidth = 6 * (1 - k) + 1; c.lineCap = 'round'; c.beginPath(); c.moveTo(cu.a[0], cu.a[1]); c.lineTo(cu.b[0], cu.b[1]); c.stroke(); }
    const d = g.s._drag; if (d && d.pts.length > 1) { const a = d.pts[0], b = d.pts[d.pts.length - 1]; c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 4; c.setLineDash([8, 6]); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); c.setLineDash([]); }
    G2.count(c, 60, 44, s.inBox, s.n);
    // guidance: a dashed cutting line with an arrowhead where a clean cut goes, and the hand swiping along it
    const cut = !g.done ? goodCut(s) : null;
    if (cut) { const [a0, a1] = cut, show = g.level <= 1 || G2.vis(g) > 0; if (show && !(g.ptr && g.ptr.down)) { const dx = a1[0] - a0[0], dy = a1[1] - a0[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
      c.save(); c.strokeStyle = '#e8563a'; c.lineWidth = 4; c.setLineDash([10, 8]); c.lineDashOffset = -t * 30; c.beginPath(); c.moveTo(a0[0], a0[1]); c.lineTo(a1[0] - ux * 12, a1[1] - uy * 12); c.stroke(); c.setLineDash([]);
      c.fillStyle = '#e8563a'; c.translate(a1[0], a1[1]); c.rotate(Math.atan2(uy, ux)); c.beginPath(); c.moveTo(12, 0); c.lineTo(-10, -11); c.lineTo(-10, 11); c.closePath(); c.fill(); c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.stroke(); c.restore(); }
      SK.demo(g, c, 'swipe', a0, a1); }
    else SK.demo(g, c, 'swipe', [0, 0], [1, 1], { never: true });
  },
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < 1.0 || s.piles.some(p => p.st === 'wait')) return; const cut = goodCut(s); if (!cut) return;
    SK.bot.drag(g, synth, 'cut' + s.cuts.length, Math.max(1.0, (s.cuts.length ? s.cuts[s.cuts.length - 1].t : 0) + 0.5), cut[0], cut[1], 0.25);
  },
});
