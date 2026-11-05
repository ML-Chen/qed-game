// BUILD A BOT! (hardware GE-01) — a kitchen floor seen from above, crumbs everywhere, an empty robot-vacuum shell.
// Drag in the eye (senses), the brain (decides) and the wheels (acts): the robot loop runs, eye, brain, wheels, and the
// robot zips from crumb to crumb slurping them up. Leave out the eye and it drives straight ahead and bonks the fridge,
// over and over, with crumbs all around. Level 2: a cat sits in the way; add the bumper too, so the robot backs off
// and goes round instead of shoving the cat.
const START = { x: 180, y: 404 }, RR = 46, FRIDGE = 196, SPEED = 210;
const PARTS = ['eye', 'brain', 'wheels', 'bumper'];
function paintKitchen(o) {
  // checker tiles
  for (let y = 0; y < 640; y += 40) for (let x = 0; x < 360; x += 40) { o.fillStyle = ((x + y) / 40) % 2 ? '#f4e6cc' : '#e6d0a8'; o.fillRect(x, y, 40, 40); }
  const vg = o.createRadialGradient(180, 360, 100, 180, 360, 420); vg.addColorStop(0, 'rgba(255,250,230,0)'); vg.addColorStop(1, 'rgba(120,70,40,0.28)'); o.fillStyle = vg; o.fillRect(0, 0, 360, 640);
  // the fridge along the top wall (seen from above, with its door edge and magnets)
  o.fillStyle = '#9ac8d8'; o.fillRect(0, 0, 360, 64);
  SK.shadow(o, 180, FRIDGE + 4, 140, 8, 0.3);
  const fg = o.createLinearGradient(0, 100, 0, FRIDGE); fg.addColorStop(0, '#f8fbff'); fg.addColorStop(1, '#cfdbe6'); o.fillStyle = fg; o.beginPath(); o.roundRect(60, 64, 240, FRIDGE - 64, [0, 0, 16, 16]); o.fill();
  o.strokeStyle = '#8aa0b4'; o.lineWidth = 3; o.stroke(); o.fillStyle = '#8aa0b4'; o.fillRect(70, FRIDGE - 22, 220, 5);
  for (const [x, y, col] of [[100, 150, '#ff6a5a'], [250, 140, '#5ac86a'], [210, 160, '#ffcc3a']]) { o.fillStyle = col; o.beginPath(); o.arc(x, y, 7, 0, 7); o.fill(); }
  // counters left and right
  for (const x of [0, 316]) { o.fillStyle = '#b07a4a'; o.fillRect(x, 64, 44, 380); o.fillStyle = '#d8a876'; o.fillRect(x + (x ? 0 : 4), 64, 40, 376); o.strokeStyle = 'rgba(90,50,20,0.35)'; o.lineWidth = 2; for (let y = 120; y < 440; y += 80) { o.beginPath(); o.moveTo(x + 4, y); o.lineTo(x + 40, y); o.stroke(); } }
  // the parts tray at the bottom: a little workbench mat
  o.fillStyle = 'rgba(60,40,30,0.25)'; o.beginPath(); o.roundRect(14, 498, 282, 100, 18); o.fill();
  o.fillStyle = '#3a6a8a'; o.beginPath(); o.roundRect(12, 494, 282, 100, 18); o.fill();
  o.strokeStyle = 'rgba(255,255,255,0.18)'; o.lineWidth = 1; for (let x = 32; x < 290; x += 20) { o.beginPath(); o.moveTo(x, 500); o.lineTo(x, 588); o.stroke(); }
}
function drawPart(c, kind, x, y, h, t, on, sc = 1.15, tray = false) { // on: 0..1 how lit this part is (during the robot loop)
  c.save(); c.translate(x, y); c.rotate(h + Math.PI / 2); c.scale(sc, sc); if (tray && kind === 'bumper') c.translate(0, 8); // h is the robot's heading; parts face "up" = forward
  if (kind === 'eye') {
    c.fillStyle = '#222a34'; c.beginPath(); c.roundRect(-16, -11, 32, 22, 8); c.fill();
    c.fillStyle = '#10161e'; c.beginPath(); c.arc(0, 0, 9, 0, 7); c.fill();
    const gr = c.createRadialGradient(-2, -2, 1, 0, 0, 8); gr.addColorStop(0, '#d8f4ff'); gr.addColorStop(0.5, on ? '#3ad0ff' : '#2a7ab0'); gr.addColorStop(1, '#0a2a4a'); c.fillStyle = gr; c.beginPath(); c.arc(0, 0, 7, 0, 7); c.fill();
    if (on) { c.globalAlpha = on; c.fillStyle = 'rgba(80,220,255,0.35)'; c.beginPath(); c.arc(0, 0, 16, 0, 7); c.fill(); }
  } else if (kind === 'brain') {
    c.fillStyle = '#1e7a4a'; c.beginPath(); c.roundRect(-17, -15, 34, 30, 4); c.fill(); c.strokeStyle = '#0e4a2a'; c.lineWidth = 2; c.stroke();
    c.fillStyle = '#f0c24a'; for (let i = -1; i <= 1; i++) { c.fillRect(-20, i * 7 - 1.5, 4, 3); c.fillRect(16, i * 7 - 1.5, 4, 3); }
    c.fillStyle = '#20202a'; c.fillRect(-9, -8, 18, 16); c.strokeStyle = 'rgba(120,255,170,0.5)'; c.lineWidth = 1; c.beginPath(); c.moveTo(-14, 11); c.lineTo(-4, 11); c.lineTo(-4, 8); c.stroke();
    c.fillStyle = on ? '#ff4a6a' : '#6a2a3a'; c.beginPath(); c.arc(12, -10, 3, 0, 7); c.fill();
    if (on) { c.globalAlpha = on * 0.6; c.fillStyle = '#ff8aa0'; c.beginPath(); c.arc(12, -10, 7, 0, 7); c.fill(); }
  } else if (kind === 'wheels') {
    c.strokeStyle = '#7a7a86'; c.lineWidth = 5; c.beginPath(); c.moveTo(-30, 0); c.lineTo(30, 0); c.stroke();
    for (const s of [-1, 1]) { c.fillStyle = '#26262e'; c.beginPath(); c.roundRect(s * 31 - 7, -15, 14, 30, 5); c.fill(); c.strokeStyle = '#555'; c.lineWidth = 1.5; for (let i = 0; i < 4; i++) { const yy = -13 + ((i * 8 + t * (on ? 120 : 0)) % 28); c.beginPath(); c.moveTo(s * 31 - 6, yy); c.lineTo(s * 31 + 6, yy); c.stroke(); } }
  } else if (kind === 'bumper') {
    c.strokeStyle = '#ff9a2a'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.arc(0, 30, 44, -Math.PI * 0.8, -Math.PI * 0.2); c.stroke();
    c.strokeStyle = '#ffd27a'; c.lineWidth = 3; c.beginPath(); c.arc(0, 30, 44, -Math.PI * 0.78, -Math.PI * 0.22); c.stroke();
  }
  c.restore();
}
// where each part sits on the robot, in its own frame (forward = -y)
const SLOT = { eye: [0, -30], brain: [0, 5], wheels: [0, 5], bumper: [0, 0] };
MG.add({
  id: 'buildbot', stage: 'robots', cmd: 'BUILD A BOT!', time: 6, mood: 'party', winText: 'Slurp!', failText: 'Bonk!',
  card: { title: 'Sense, decide, act', kind: 'Robotics', ref: 'The robot loop (sense, think, act)',
    text: 'Every robot needs three kinds of part. A sensor notices the world: here, a camera eye spots a crumb. A brain decides what to do: a small computer turns toward the crumb. Motors act: the wheels roll it there.\n\nThen the robot does it all again, many times a second. That repeating cycle is called the robot loop.\n\nTake away the eye and the brain gets no news about the world. The wheels still turn, but the robot can only drive blindly, so it bumps into the fridge again and again.',
    note: 'A robot senses, decides and acts, over and over. Without a sense, it cannot react to the world.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level), kinds = L >= 2 ? PARTS : PARTS.slice(0, 3), n = kinds.length, sp = n === 4 ? 66 : 84, x0 = 153 - sp * (n - 1) / 2;
    const order = kinds.slice(); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    s.parts = order.map((k, i) => ({ kind: k, x: x0 + i * sp, y: 545, hx: x0 + i * sp, hy: 545, on: false }));
    s.bot = { x: START.x, y: START.y, h: -Math.PI / 2, mode: 'idle', bonk: 0, back: 0 }; s.eaten = 0; s.loopT = 0; s.bonks = 0;
    s.cat = L >= 2 ? { x: 180, y: 322 } : null;
    s.crumbs = []; const fixed = L >= 2 ? [[180, 240]] : []; for (const [x, y] of fixed) s.crumbs.push({ x, y, gone: 0 });
    let tries = 0; while (s.crumbs.length < (s.cat ? 4 : 7) && tries++ < 300) {
      const x = 84 + g.rand() * 192, y = s.cat ? 236 + g.rand() * 34 : 250 + g.rand() * 200;
      if (SK.dist(x, y, START.x, START.y) < 80 || (s.cat && SK.dist(x, y, s.cat.x, s.cat.y) < 60) || s.crumbs.some(q => SK.dist(q.x, q.y, x, y) < 50)) continue;
      if (!s.cat && Math.abs(x - START.x) < 34 && y < START.y) continue; // keep the straight lane to the fridge clear, so the blind fail reads
      s.crumbs.push({ x, y, gone: 0 });
    }
    s.wob = 0;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; const p = SK.pick(s.parts.filter(q => !q.on), x, y, 44); if (p) SK.dragStart(g, p, x, y); },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const p = d.obj;
    if (SK.dist(p.x, p.y, s.bot.x, s.bot.y) < 78) { p.on = true; g.sfx('click'); g.sfx('pop'); g.burst(s.bot.x, s.bot.y, ['#ffe27a', '#8ae0ff'], 10, 120); }
    else { p.x = p.hx; p.y = p.hy; g.sfx('tap'); }
  },
  update(g, dt) {
    const s = g.s, b = s.bot, has = k => s.parts.some(p => p.kind === k && p.on);
    for (const q of s.crumbs) if (q.gone) q.gone += dt;
    if (s.catHiss) s.catHiss = Math.max(0, s.catHiss - dt);
    if (!has('brain') || !has('wheels') || (g.done && g.result === 'fail' && has('eye'))) { b.mode = 'idle'; return; }
    s.loopT += dt; b.bonk = Math.max(0, b.bonk - dt); b.x = SK.clamp(b.x, 44 + RR - 8, 316 - RR + 8); b.y = SK.clamp(b.y, FRIDGE + RR - 4, 470 - RR);
    const fwd = (sp) => { b.x += Math.cos(b.h) * sp * dt; b.y += Math.sin(b.h) * sp * dt; };
    if (b.back > 0) { b.back -= dt; fwd(-110); return; }
    if (b.av) { b.av.t -= dt; if (b.av.ph === 'turn') { b.h += b.av.dir * 5 * dt; if (b.av.t <= 0) { b.av.ph = 'go'; b.av.t = 0.42; } } else { fwd(SPEED); if (b.av.t <= 0) b.av = null; } if (s.cat && SK.dist(b.x, b.y, s.cat.x, s.cat.y) < RR + 24) { const a = Math.atan2(b.y - s.cat.y, b.x - s.cat.x); b.x = s.cat.x + Math.cos(a) * (RR + 24); b.y = s.cat.y + Math.sin(a) * (RR + 24); } return; }
    if (!has('eye')) { // blind: drive straight ahead, bonk, back up a little, bonk again
      b.mode = 'blind'; const want = -Math.PI / 2; b.h += SK.clamp(want - b.h, -4 * dt, 4 * dt); fwd(SPEED);
      if (b.y - RR < FRIDGE) { b.y = FRIDGE + RR; b.bonk = 0.35; b.back = 0.25; s.bonks++; g.sfx('thud'); g.shake(3, 0.15); }
      return;
    }
    b.mode = 'seek';
    // pick the nearest crumb
    let tgt = null;
    if (!tgt) { let best = null, bd = 1e9; for (const q of s.crumbs) { if (q.gone) continue; const d = SK.dist(q.x, q.y, b.x, b.y); if (d < bd) { bd = d; best = q; } } tgt = best ? { x: best.x, y: best.y, crumb: best } : null; }
    if (!tgt) return;
    const want = Math.atan2(tgt.y - b.y, tgt.x - b.x); let da = want - b.h; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2;
    b.h += SK.clamp(da, -7 * dt, 7 * dt); if (Math.abs(da) < 1.2) fwd(SPEED);
    // the cat (level 2)
    if (s.cat && SK.dist(b.x, b.y, s.cat.x, s.cat.y) < RR + 24) {
      const a = Math.atan2(b.y - s.cat.y, b.x - s.cat.x); b.x = s.cat.x + Math.cos(a) * (RR + 24); b.y = s.cat.y + Math.sin(a) * (RR + 24);
      if (has('bumper')) { b.bonk = 0.3; b.back = 0.22; g.sfx('click'); const toCat = Math.atan2(s.cat.y - b.y, s.cat.x - b.x); let rel = toCat - b.h; while (rel > Math.PI) rel -= Math.PI * 2; while (rel < -Math.PI) rel += Math.PI * 2; b.av = { ph: 'turn', t: 0.3, dir: rel > 0 ? -1 : 1 }; if (Math.abs(rel) < 0.05) b.av.dir = b.x > 200 ? -1 : 1; }
      else if (!s.catHiss) { s.catHiss = 0.8; g.sfx('meow'); s.wob += 1; }
    }


    if (tgt.crumb && SK.dist(tgt.x, tgt.y, b.x, b.y) < RR * 0.6) { tgt.crumb.gone = 0.001; s.eaten++; g.sfx('slurp'); g.burst(tgt.x, tgt.y, ['#c88a3a', '#f0c070'], 8, 90); if (s.eaten >= 2 && !g.done) { g.win(); g.sfx('cheer'); } }
  },
  draw(g, c) {
    const s = g.s, b = s.bot, t = g.t, has = k => s.parts.some(p => p.kind === k && p.on);
    c.drawImage(g.bake('buildbot_kitchen', paintKitchen), 0, 0, 360, 640);
    // crumbs
    for (const q of s.crumbs) { if (q.gone > 0.3) continue; const k = q.gone ? 1 - q.gone / 0.3 : 1; c.save(); c.translate(q.x, q.y); c.scale(k * 1.5, k * 1.5); c.fillStyle = '#b8742e'; for (const [dx, dy, r] of [[0, 0, 5], [7, 3, 3], [-6, 4, 3.5], [3, -6, 2.5]]) { c.beginPath(); c.arc(dx, dy, r, 0, 7); c.fill(); } c.fillStyle = '#f0c070'; c.beginPath(); c.arc(-1, -1, 2, 0, 7); c.fill(); c.restore(); }
    // the cat (level 2)
    if (s.cat) { SK.shadow(c, s.cat.x, s.cat.y + 2, 20, 6); P.cat(c, s.cat.x, s.cat.y + 4, 1.6, { t, facing: 1, expr: s.catHiss ? 'grumpy' : undefined }); if (s.catHiss) SK.tag(c, '!', s.cat.x + 18, s.cat.y - 52, 20, '#fff', '#d83a3a'); }
    // the robot: shell, then whatever parts are in it
    const run = b.mode !== 'idle', ph = (s.loopT * 3) % 3, lit = k => run ? Math.max(0, 1 - Math.abs(ph - k) * 1.5) : 0;
    c.save(); c.translate(b.x, b.y);
    SK.shadow(c, 3, 6, RR + 2, RR * 0.9, 0.25);
    const sg = c.createRadialGradient(-12, -14, 6, 0, 0, RR); sg.addColorStop(0, '#ffffff'); sg.addColorStop(0.7, '#dfe4ea'); sg.addColorStop(1, '#a8b2bc'); c.fillStyle = sg; c.beginPath(); c.arc(0, 0, RR, 0, 7); c.fill(); c.strokeStyle = '#6a7480'; c.lineWidth = 3; c.stroke();
    c.rotate(b.h + Math.PI / 2); c.scale(1.15, 1.15);
    c.strokeStyle = 'rgba(90,100,120,0.55)'; c.lineWidth = 2; c.setLineDash([4, 4]); // empty sockets
    if (!has('eye')) { c.beginPath(); c.roundRect(-16, -37, 32, 22, 8); c.stroke(); }
    if (!has('brain')) { c.beginPath(); c.roundRect(-17, -11, 34, 30, 4); c.stroke(); }
    if (!has('wheels')) for (const sx of [-1, 1]) { c.beginPath(); c.roundRect(sx * 31 - 7, -11, 14, 30, 5); c.stroke(); }
    if (s.cat && !has('bumper')) { c.beginPath(); c.arc(0, 30, 44, -Math.PI * 0.8, -Math.PI * 0.2); c.stroke(); }
    c.setLineDash([]); c.restore();
    const pr = b.h + Math.PI / 2, rot = (dx, dy) => [b.x + dx * Math.cos(pr) - dy * Math.sin(pr), b.y + dx * Math.sin(pr) + dy * Math.cos(pr)];
    for (const k of ['wheels', 'brain', 'eye', 'bumper']) if (has(k)) { const [x, y] = rot(...SLOT[k]); drawPart(c, k, x, y, b.h, t, k === 'eye' ? lit(0) : k === 'brain' ? lit(1) : k === 'wheels' ? lit(2) + (run ? 0.5 : 0) : 0); }
    if (b.mode === 'seek') { const [ex, ey] = rot(0, -30); c.save(); c.globalAlpha = 0.18 + 0.12 * lit(0); c.fillStyle = '#5ad8ff'; c.beginPath(); c.moveTo(ex, ey); c.arc(ex, ey, 120, b.h - 0.45, b.h + 0.45); c.closePath(); c.fill(); c.restore(); }
    if (b.bonk > 0) { const [bx, by] = rot(0, -RR - 6); for (let i = 0; i < 3; i++) { const a = t * 6 + i * 2.1; c.fillStyle = '#ffe27a'; c.save(); c.translate(bx + Math.cos(a) * 16, by - 14 + Math.sin(a) * 6); c.rotate(a); c.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 3 : 7, aa = j * Math.PI / 5; c.lineTo(Math.cos(aa) * r, Math.sin(aa) * r); } c.fill(); c.restore(); } }
    // the parts still on the tray (and the one being dragged)
    for (const p of s.parts) if (!p.on) { SK.shadow(c, p.x + 2, p.y + 18, 22, 6, 0.3); drawPart(c, p.kind, p.x, p.y, -Math.PI / 2, t, 0, p.kind === 'bumper' ? 0.9 : 1.4, true); }
    if (!SK.dragging(g)) SK.glow(c, g, b.x, b.y, RR + 8);
    // the hedgehog, cheering crumbs away or groaning at the bonks
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'hedgehog', 326, 606, 0.95, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost || s.bonks ? 'wow' : 'happy', facing: -1 });
    // guidance: drag the first part on the tray into the shell
    const first = s.parts.find(p => !p.on); if (first) SK.demo(g, c, 'drag', [first.hx, first.hy], [b.x, b.y]);
  },
  auto(g, dt, synth) {
    const s = g.s; let t = 1.0;
    const order = s.parts.slice().sort((a, b) => (a.kind === 'bumper' ? -1 : 0) - (b.kind === 'bumper' ? -1 : 0)); // the bot fits the bumper first
    for (const p of order) { SK.bot.drag(g, synth, 'p' + p.kind, t, [p.hx, p.hy], [s.bot.x, s.bot.y], 0.35); t += 0.5; }
  },
});
