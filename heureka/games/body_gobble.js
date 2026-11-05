// GOBBLE! (chem_bio AN-15) — bacteria have swum in through a cut beside a thorn; a white blood cell waits in the tissue.
// Steer the white cell (drag anywhere: it flows toward your finger) into each bacterium: it wraps around it, swallows it
// and digests it. Bump the body's own red blood cells and they flash a friendly badge, and the white cell backs off.
// Leave any bacteria and they multiply. Level 2: two bacteria wear slippery capsules and squirt away in open water;
// pin them against the tissue wall to catch them.
const AR = { l: 16, r: 344, t: 158, b: 572 }, WR = 38, VMAX = 320;

function paintTissue(o) {
  // skin at the top with a cut and a thorn, then the soft pink tissue fluid
  const bg = o.createLinearGradient(0, 140, 0, 640); bg.addColorStop(0, '#ffd8d0'); bg.addColorStop(1, '#f4b0a8');
  o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  const sk = o.createLinearGradient(0, 0, 0, 150); sk.addColorStop(0, '#f6c8a0'); sk.addColorStop(0.6, '#e8a888'); sk.addColorStop(1, '#d88878');
  o.fillStyle = sk; o.beginPath(); o.moveTo(0, 0); o.lineTo(360, 0); o.lineTo(360, 140); for (let x = 360; x >= 0; x -= 20) o.lineTo(x, 140 + Math.sin(x * 0.07) * 5); o.closePath(); o.fill();
  // skin cells as rows of rounded bricks
  o.strokeStyle = 'rgba(160,80,70,0.25)'; o.lineWidth = 1.5; for (let y = 10; y < 140; y += 18) for (let x = (y / 18) % 2 ? -12 : 0; x < 360; x += 26) { o.beginPath(); o.roundRect(x + 2, y, 22, 15, 6); o.stroke(); }
  // the cut: a dark gash in the middle
  o.fillStyle = '#8a2a30'; o.beginPath(); o.moveTo(150, 0); o.quadraticCurveTo(178, 70, 172, 146); o.lineTo(192, 146); o.quadraticCurveTo(196, 70, 214, 0); o.closePath(); o.fill();
  o.fillStyle = '#c84a4a'; o.beginPath(); o.moveTo(162, 0); o.quadraticCurveTo(182, 70, 178, 146); o.lineTo(186, 146); o.quadraticCurveTo(190, 70, 202, 0); o.closePath(); o.fill();
  // the thorn
  o.fillStyle = '#6a8a3a'; o.strokeStyle = '#3a5a20'; o.lineWidth = 2; o.beginPath(); o.moveTo(206, 20); o.lineTo(236, 6); o.lineTo(190, 118); o.closePath(); o.fill(); o.stroke();
  // tissue: soft fibres and fat cells at the edges
  const rnd = P.rng(41); o.strokeStyle = 'rgba(255,240,235,0.5)'; o.lineWidth = 2;
  for (let i = 0; i < 18; i++) { const y = 170 + rnd() * 400; o.beginPath(); o.moveTo(-10, y); o.bezierCurveTo(120, y + (rnd() - 0.5) * 80, 240, y + (rnd() - 0.5) * 80, 370, y + (rnd() - 0.5) * 40); o.stroke(); }
  for (const [x0, dir] of [[0, 1], [360, -1]]) for (let i = 0; i < 9; i++) { const y = 170 + i * 48, r = 14 + rnd() * 8; o.fillStyle = 'rgba(255,236,190,0.8)'; o.strokeStyle = 'rgba(200,140,110,0.5)'; o.beginPath(); o.arc(x0 + dir * 4, y, r, 0, 7); o.fill(); o.stroke(); }
  o.fillStyle = 'rgba(255,236,190,0.8)'; for (let i = 0; i < 8; i++) { const x = 20 + i * 46; o.beginPath(); o.arc(x, 590, 16 + rnd() * 6, 0, 7); o.fill(); o.stroke(); }
  P.vignette(o, 360, 640, 0.25, '#6a1a2a');
}
function bacterium(c, b, t) {
  c.save(); c.translate(b.x, b.y); c.rotate(b.a); c.scale(1.3, 1.3);
  // flagella tail
  c.strokeStyle = '#3a7a2a'; c.lineWidth = 1.5; c.beginPath(); for (let i = 0; i <= 10; i++) { const x = -14 - i * 2.2, y = Math.sin(i * 0.9 + t * 18 + b.ph) * 3; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
  if (b.cap) { c.fillStyle = 'rgba(200,240,255,0.45)'; c.strokeStyle = 'rgba(120,200,240,0.9)'; c.lineWidth = 2; c.beginPath(); c.roundRect(-20, -13, 40, 26, 13); c.fill(); c.stroke(); }
  const gg = c.createLinearGradient(0, -8, 0, 8); gg.addColorStop(0, '#a8f07a'); gg.addColorStop(1, '#4aa83a');
  c.fillStyle = gg; c.strokeStyle = '#2a6a20'; c.lineWidth = 2; c.beginPath(); c.roundRect(-14, -8, 28, 16, 8); c.fill(); c.stroke();
  c.fillStyle = '#1a3a14'; c.beginPath(); c.arc(6, -2, 2, 0, 7); c.arc(10, -2, 2, 0, 7); c.fill();
  c.strokeStyle = '#1a3a14'; c.lineWidth = 1.3; c.beginPath(); c.arc(8, 2, 2.5, 0.2, Math.PI - 0.2); c.stroke();
  c.restore();
}
function rbc(c, r, t, badge) {
  c.save(); c.translate(r.x, r.y); c.rotate(r.a); c.scale(1, 0.62 + 0.08 * Math.sin(t + r.ph));
  const rg = c.createRadialGradient(0, 0, 3, 0, 0, 22); rg.addColorStop(0, '#c8323a'); rg.addColorStop(0.45, '#e8505a'); rg.addColorStop(0.8, '#d83a44'); rg.addColorStop(1, '#a82a34');
  c.fillStyle = rg; c.strokeStyle = '#8a1a24'; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, 22, 0, 7); c.fill(); c.stroke();
  c.restore();
  if (badge > 0) { c.save(); c.globalAlpha = Math.min(1, badge * 2); c.fillStyle = '#fff6ea'; c.strokeStyle = '#3aa860'; c.lineWidth = 3; c.beginPath(); c.arc(r.x + 16, r.y - 20, 11, 0, 7); c.fill(); c.stroke(); c.strokeStyle = '#3aa860'; c.beginPath(); c.moveTo(r.x + 10, r.y - 20); c.lineTo(r.x + 15, r.y - 15); c.lineTo(r.x + 22, r.y - 25); c.stroke(); c.restore(); }
}
const nearWall = b => Math.min(b.x - AR.l, AR.r - b.x, b.y - AR.t, AR.b - b.y) < 26;

MG.add({
  id: 'body_gobble', stage: 'body', cmd: 'GOBBLE!', time: 6, mood: 'bright', winText: 'Phagocytosis!', failText: 'Multiplied!',
  card: { title: 'White cells eat germs', kind: 'Biology', ref: 'Phagocytes and phagocytosis',
    text: 'When bacteria get in through a cut, white blood cells crawl out of the blood vessels to meet them. Some white cells, called phagocytes, swallow germs whole: the cell flows around a bacterium, wraps it in a bubble and breaks it down with strong chemicals. This is called phagocytosis.\n\nThe body\'s own cells carry markers that say "self", so phagocytes leave them alone.\n\nSome bacteria grow a slippery coat called a capsule that is hard to grip. Phagocytes catch them more easily when they are pinned against a surface or coated with antibodies.',
    note: 'White blood cells find bacteria, swallow them and digest them, and leave the body\'s own cells alone.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level), n = [4, 5, 5][L];
    s.w = { x: 180, y: 470, vx: 0, vy: 0, r: WR }; s.tgt = null; s.eaten = 0; s.bump = -1;
    s.bac = []; for (let i = 0; i < n; i++) { const a = g.rand() * 6.28, sp = [44, 60, 64][L] * (0.8 + g.rand() * 0.4); s.bac.push({ x: 150 + g.rand() * 60, y: 196 + g.rand() * 30, vx: Math.cos(a) * sp, vy: Math.abs(Math.sin(a)) * sp + 30, a, ph: g.rand() * 6, sp, cap: L >= 2 && i < 2, eat: -1, turn: g.rand() * 2 }); }
    s.rbc = []; for (let i = 0; i < 3; i++) s.rbc.push({ x: 40 + i * 120 + g.rand() * 30, y: 230 + (i % 2) * 140 + g.rand() * 60, a: g.rand() * 3, ph: g.rand() * 6, badge: 0, v: 18 + g.rand() * 10 });
    s.kids = [];
  },
  down(g, x, y) { SK.touched(g); if (!g.done) g.s.tgt = { x, y }; },
  move(g, x, y) { if (g.s.tgt && !g.done) g.s.tgt = { x, y }; },
  up(g) { g.s.tgt = null; },
  update(g, dt) {
    const s = g.s, w = s.w;
    // the white cell flows toward the finger
    if (s.tgt && !g.done && g.t - s.bump > 0.35) { const dx = s.tgt.x - w.x, dy = s.tgt.y - w.y, d = Math.hypot(dx, dy); const sp = Math.min(VMAX, d * 6); w.vx = SK.lerp(w.vx, d ? dx / d * sp : 0, Math.min(1, dt * 8)); w.vy = SK.lerp(w.vy, d ? dy / d * sp : 0, Math.min(1, dt * 8)); }
    else { w.vx *= Math.exp(-dt * 4); w.vy *= Math.exp(-dt * 4); }
    w.x = SK.clamp(w.x + w.vx * dt, AR.l + WR, AR.r - WR); w.y = SK.clamp(w.y + w.vy * dt, AR.t + WR, AR.b - WR);
    // red blood cells drift past; bumping one makes the white cell back off
    for (const r of s.rbc) { r.x += r.v * dt; if (r.x > 390) r.x = -30; r.a += dt * 0.3; r.badge = Math.max(0, r.badge - dt * 0.8);
      if (SK.dist(r.x, r.y, w.x, w.y) < WR + 14 && g.t - s.bump > 0.35 && !g.done) { const dx = w.x - r.x, dy = w.y - r.y, d = Math.hypot(dx, dy) || 1; w.vx = dx / d * 240; w.vy = dy / d * 240; s.bump = g.t; r.badge = 1.4; g.sfx('boing'); } }
    // bacteria swim, wiggle and turn; capsule ones squirt away unless pinned at a wall
    for (const b of s.bac) {
      if (b.eat >= 0) { const k = Math.min(1, (g.t - b.eat) / 0.45); b.x = SK.lerp(b.x, w.x, k * 0.5); b.y = SK.lerp(b.y, w.y, k * 0.5); continue; }
      b.turn -= dt; if (b.turn < 0) { b.turn = 0.8 + g.rand() * 1.2; const a = Math.atan2(b.vy, b.vx) + (g.rand() - 0.5) * 2.2, sp = Math.max(b.sp, Math.hypot(b.vx, b.vy) * 0.6); b.vx = Math.cos(a) * sp; b.vy = Math.sin(a) * sp; }
      const sp = Math.hypot(b.vx, b.vy); if (sp > b.sp) { const k = Math.max(b.sp / sp, Math.exp(-dt * 3)); b.vx *= k; b.vy *= k; }
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.x < AR.l + 12) { b.x = AR.l + 12; b.vx = Math.abs(b.vx); } if (b.x > AR.r - 12) { b.x = AR.r - 12; b.vx = -Math.abs(b.vx); }
      if (b.y < AR.t + 12) { b.y = AR.t + 12; b.vy = Math.abs(b.vy); } if (b.y > AR.b - 12) { b.y = AR.b - 12; b.vy = -Math.abs(b.vy); }
      b.a = Math.atan2(b.vy, b.vx);
      if (!g.done && SK.dist(b.x, b.y, w.x, w.y) < WR + 15) {
        if (b.cap && !nearWall(b)) { const dx = b.x - w.x, dy = b.y - w.y, d = Math.hypot(dx, dy) || 1; b.vx = dx / d * 230; b.vy = dy / d * 230; b.x = w.x + dx / d * (WR + 16); b.y = w.y + dy / d * (WR + 16); if (g.t - (b.slip || -9) > 0.3) { g.sfx('slurp'); b.slip = g.t; } }
        else { b.eat = g.t; s.eaten++; g.sfx('munch'); g.sfx('pop'); g.burst(w.x, w.y, ['#fff6ea', '#a8f07a'], 8, 90); }
      }
    }
    if (!g.done && s.bac.every(b => b.eat >= 0 && g.t - b.eat > 0.3)) { g.win(); g.sfx('cheer'); }
    // the fuse ran out: every bacterium left splits in two, then again
    if (g.result === 'fail') { if (s.multAt == null) { s.multAt = g.t; g.sfx('laugh'); } if (s.kids.length < 40 && g.t - (s.lastKid || 0) > 0.12) { s.lastKid = g.t; for (const b of s.bac) if (b.eat < 0 && s.kids.length < 40) s.kids.push({ x: b.x, y: b.y, vx: (g.rand() - 0.5) * 120, vy: (g.rand() - 0.5) * 120, a: g.rand() * 6, ph: g.rand() * 6, cap: false }); } for (const k of s.kids) { k.x += k.vx * dt; k.y += k.vy * dt; k.vx *= 0.97; k.vy *= 0.97; } }
  },
  draw(g, c) {
    const s = g.s, t = g.t, w = s.w, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('body_gobble_tissue', paintTissue), 0, 0, 360, 640);
    for (const r of s.rbc) rbc(c, r, t, r.badge);
    for (const b of s.bac) if (b.eat < 0) bacterium(c, b, t);
    for (const k of s.kids) bacterium(c, k, t);
    // the white cell: a wobbly pale blob with a lobed purple nucleus; its edge reaches toward where it is going
    const sp = Math.hypot(w.vx, w.vy), dir = Math.atan2(w.vy, w.vx), st = Math.min(0.35, sp / 700);
    c.save(); c.translate(w.x, w.y);
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.arc(0, 0, WR + 8, 0, 7); c.fill();
    c.fillStyle = '#f4f0ff'; c.strokeStyle = '#8a7ab0'; c.lineWidth = 2.5; c.beginPath();
    for (let i = 0; i <= 28; i++) { const a = i / 28 * 6.283, reach = 1 + st * Math.max(0, Math.cos(a - dir)) * 1.2 + 0.07 * Math.sin(a * 5 + t * 4); const rr = WR * reach; i ? c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : c.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#9a6ad0'; for (const [dx, dy, r] of [[-11, -5, 10], [3, -11, 9], [11, 3, 8.5]]) { c.beginPath(); c.arc(dx, dy, r, 0, 7); c.fill(); }
    c.fillStyle = 'rgba(200,180,255,0.6)'; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(Math.cos(i * 1.1 + t) * 18, Math.sin(i * 1.7) * 16, 1.8, 0, 7); c.fill(); }
    c.restore();
    // bacteria being swallowed and digested inside the bubble
    for (const b of s.bac) if (b.eat >= 0) { const k = Math.min(1, (t - b.eat) / 0.9); if (k >= 1) continue; c.save(); c.globalAlpha = 1 - k; c.translate(w.x + (b.x - w.x) * (1 - k), w.y + (b.y - w.y) * (1 - k)); c.scale(1 - k * 0.6, 1 - k * 0.6); c.translate(-b.x, -b.y); bacterium(c, b, t); c.restore(); c.strokeStyle = `rgba(160,120,220,${0.8 * (1 - k)})`; c.lineWidth = 2; c.beginPath(); c.arc(w.x + (b.x - w.x) * (1 - k) * 0.5, w.y + (b.y - w.y) * (1 - k) * 0.5, 14 * (1 - k * 0.5), 0, 7); c.stroke(); }
    // eyes on the white cell (it looks toward the nearest germ)
    const near = s.bac.filter(b => b.eat < 0).sort((a, b) => SK.dist(a.x, a.y, w.x, w.y) - SK.dist(b.x, b.y, w.x, w.y))[0];
    const la = near ? Math.atan2(near.y - w.y, near.x - w.x) : 0;
    for (const e of [-1, 1]) { const ex = w.x + e * 11, ey = w.y + 15; c.fillStyle = '#fff'; c.beginPath(); c.arc(ex, ey, 5, 0, 7); c.fill(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(ex + Math.cos(la) * 2, ey + Math.sin(la) * 2, 2.6, 0, 7); c.fill(); }
    SK.animal(c, 'rabbit', 330, 628, 0.55, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    if (!s.touched && !g.done) SK.glow(c, g, w.x, w.y, 40);
    if (near) SK.demo(g, c, 'drag', [w.x, w.y], [near.x, near.y]);
  },
  // the bot: chase the nearest germ around the red cells; corner capsule germs against the nearest wall
  auto(g, dt, synth) {
    const s = g.s, w = s.w; if (g.done || g.t < 0.6) return;
    const left = s.bac.filter(b => b.eat < 0); if (!left.length) { if (s.tgt) synth('up', w.x, w.y); return; }
    const b = left.sort((a, c) => (a.cap - c.cap) || SK.dist(a.x, a.y, w.x, w.y) - SK.dist(c.x, c.y, w.x, w.y))[0];
    let tx = b.x + b.vx * 0.12, ty = b.y + b.vy * 0.12;
    if (b.cap) { // come at it from the open side so it squirts toward the wall
      const walls = [[b.x - AR.l, -1, 0], [AR.r - b.x, 1, 0], [b.y - AR.t, 0, -1], [AR.b - b.y, 0, 1]].sort((p, q) => p[0] - q[0])[0], nx = walls[1], ny = walls[2];
      const ox = b.x - nx * 70, oy = b.y - ny * 70, behind = (w.x - b.x) * -nx + (w.y - b.y) * -ny > 30;
      if (behind) { tx = b.x + nx * 30; ty = b.y + ny * 30; } else { tx = ox; ty = oy; }
    }
    if (!s.tgt) synth('down', tx, ty); else synth('move', tx, ty);
  },
});
