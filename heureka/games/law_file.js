// FILE FIRST! (law LW-09) — the beaver has just invented something (a mousetrap, a wind-up car, a rain hat, a kite
// launcher), and so has the fox next door. Both race to the patent office. Drag your blueprint into the office window
// before the fox, who is hurrying up the street with its own copy, gets there. Filed first: your blueprint is pinned on
// the office's public board (everyone can now read how it works), a fence with a clock goes up round your invention, and
// a copycat bounces off it. At the next invention the clock on the old fence has run out and the fence drops: anyone may
// build it now. If the fox files first, its fence goes up round your own machine and you are locked out of your idea.
// Two inventions at level 0, three at levels 1 and 2 (the fox gets faster each time).
const TAU = Math.PI * 2;
const WIN = { x: 268, y: 214, w: 74, h: 50 }, DESK = [84, 452], FOXP = [[308, 600], [300, 470], [292, 330], [286, 252]];
const KINDS = ['trap', 'car', 'hat', 'kite'];
function paintStreet(o) {
  P.sky(o, 360, 640, ['#e8a878', '#f8d0a0', '#fff2d8']);
  P.cloud(o, 70, 130, 0.5);
  // the patent office: a stone building with columns and a service window
  o.fillStyle = 'rgba(40,20,20,0.25)'; o.beginPath(); o.ellipse(262, 300, 100, 10, 0, 0, TAU); o.fill();
  const wg = o.createLinearGradient(170, 0, 350, 0); wg.addColorStop(0, '#f0e0c8'); wg.addColorStop(1, '#c8b090'); o.fillStyle = wg; o.fillRect(172, 140, 176, 160);
  o.fillStyle = '#a88a68'; o.beginPath(); o.moveTo(160, 142); o.lineTo(260, 104); o.lineTo(360, 142); o.closePath(); o.fill();
  o.fillStyle = '#e8d8c0'; for (const x of [182, 330]) o.fillRect(x, 150, 12, 146);
  o.fillStyle = '#8a6a4a'; o.fillRect(172, 292, 176, 10);
  // the public board on the office wall
  o.fillStyle = '#8a5a3a'; o.beginPath(); o.roundRect(196, 152, 56, 44, 4); o.fill(); o.fillStyle = '#d8b888'; o.fillRect(200, 156, 48, 36);
  // the street and the grass
  const gr = o.createLinearGradient(0, 300, 0, 640); gr.addColorStop(0, '#a8c870'); gr.addColorStop(1, '#6a9a48'); o.fillStyle = gr; o.fillRect(0, 300, 360, 340);
  o.fillStyle = '#d8c8a0'; o.beginPath(); o.moveTo(250, 300); o.lineTo(326, 300); o.lineTo(350, 640); o.lineTo(260, 640); o.closePath(); o.fill();
  o.fillStyle = 'rgba(120,90,50,0.2)'; for (let y = 320; y < 640; y += 34) o.fillRect(286, y, 8, 16);
  // your workshop (left) and the fox's shed (bottom right)
  P.house(o, 6, DESK[1] - 30, 74, 104, '#e8c89a', { window: true });
  o.fillStyle = '#b07440'; o.beginPath(); o.roundRect(28, DESK[1] + 10, 132, 14, 4); o.fill(); o.fillRect(38, DESK[1] + 24, 10, 40); o.fillRect(140, DESK[1] + 24, 10, 40); P.grassTufts(o, 360, 320, 630, 26, '#4a7a30', 4); P.flowers(o, 240, 330, 460, 12, undefined, 5);
  P.grain(o, 360, 640, 0.035); P.vignette(o, 360, 640, 0.25);
}
function gadget(c, k, x, y, s, t) {
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.lineJoin = 'round';
  if (k === 'trap') { c.fillStyle = '#c8884a'; c.fillRect(-26, -6, 52, 10); c.strokeRect(-26, -6, 52, 10); c.strokeStyle = '#8a8a9a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-18, -6); c.lineTo(-18, -24); c.lineTo(10, -24); c.stroke(); c.fillStyle = '#f6c445'; c.beginPath(); c.moveTo(12, -8); c.lineTo(24, -8); c.lineTo(18, -18); c.closePath(); c.fill(); }
  else if (k === 'car') { c.fillStyle = '#e8563a'; c.beginPath(); c.roundRect(-22, -20, 44, 16, 6); c.fill(); c.stroke(); c.fillStyle = '#2a2a3a'; for (const wx of [-12, 12]) { c.beginPath(); c.arc(wx, -2, 6, 0, TAU); c.fill(); } c.strokeStyle = '#f6c445'; c.lineWidth = 3; c.beginPath(); c.arc(0, -28, 6, t * 3, t * 3 + 4.5); c.stroke(); }
  else if (k === 'hat') { c.fillStyle = '#3a8ad8'; c.beginPath(); c.ellipse(0, -4, 24, 6, 0, 0, TAU); c.fill(); c.stroke(); c.beginPath(); c.roundRect(-12, -24, 24, 20, 4); c.fill(); c.stroke(); c.strokeStyle = '#3a1640'; c.beginPath(); c.moveTo(0, -24); c.lineTo(0, -34); c.stroke(); c.fillStyle = '#e8563a'; c.beginPath(); c.arc(0, -40, 12, Math.PI, 0); c.closePath(); c.fill(); c.stroke(); }
  else { c.fillStyle = '#8a5a3a'; c.fillRect(-20, -8, 40, 10); c.strokeRect(-20, -8, 40, 10); c.strokeStyle = '#8a8a9a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-10, -8); c.lineTo(8, -30); c.stroke(); c.fillStyle = '#e84a8a'; c.beginPath(); c.moveTo(12, -46); c.lineTo(24, -32); c.lineTo(12, -18); c.lineTo(0, -32); c.closePath(); c.fill(); c.stroke(); }
  c.restore();
}
function blueprint(c, k, x, y, s, t, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  c.fillStyle = 'rgba(20,20,40,0.3)'; c.fillRect(-27, -19, 58, 42);
  c.fillStyle = '#2a6ab8'; c.fillRect(-29, -21, 58, 42); c.strokeStyle = '#fff6ea'; c.lineWidth = 1.5; c.strokeRect(-26, -18, 52, 36);
  c.strokeStyle = 'rgba(255,255,255,0.25)'; c.lineWidth = 1; for (let i = -24; i < 26; i += 8) { c.beginPath(); c.moveTo(i, -18); c.lineTo(i, 18); c.stroke(); }
  c.save(); c.globalAlpha = 0.95; c.scale(0.55, 0.55); c.translate(0, 22); c.strokeStyle = '#fff6ea'; gadgetLines(c, k); c.restore();
  c.restore();
}
function gadgetLines(c, k) { c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.beginPath(); if (k === 'trap') { c.rect(-26, -6, 52, 10); c.moveTo(-18, -6); c.lineTo(-18, -24); c.lineTo(10, -24); } else if (k === 'car') { c.roundRect(-22, -20, 44, 16, 6); c.moveTo(-6, -2); c.arc(-12, -2, 6, 0, TAU); c.moveTo(18, -2); c.arc(12, -2, 6, 0, TAU); } else if (k === 'hat') { c.ellipse(0, -4, 24, 6, 0, 0, TAU); c.rect(-12, -24, 24, 20); c.moveTo(-12, -40); c.arc(0, -40, 12, Math.PI, 0); } else { c.rect(-20, -8, 40, 10); c.moveTo(-10, -8); c.lineTo(8, -30); c.moveTo(12, -46); c.lineTo(24, -32); c.lineTo(12, -18); c.lineTo(0, -32); c.closePath(); } c.stroke(); }
function fence(c, x, y, k, t, clock, col = '#fff6ea') { // a little picket fence round (x, y); k 0..1 rises it; clock 0..1 how much time is left
  if (k <= 0) return; c.save(); c.translate(x, y); const h = 30 * k;
  for (let i = -3; i <= 3; i++) { const px = i * 12; c.fillStyle = col; c.strokeStyle = '#6a4a3a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(px - 4, 6); c.lineTo(px - 4, 6 - h); c.lineTo(px, 2 - h); c.lineTo(px + 4, 6 - h); c.lineTo(px + 4, 6); c.closePath(); c.fill(); c.stroke(); }
  c.fillStyle = col; c.fillRect(-40, -h * 0.55, 80, 4); c.restore();
  if (clock != null && k > 0.6) { const cx = x + 44, cy = y - 34; c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, 13, 0, TAU); c.fill(); c.stroke(); c.fillStyle = '#e8563a'; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, 11, -Math.PI / 2, -Math.PI / 2 + clock * TAU); c.closePath(); c.fill(); c.strokeStyle = '#3a1640'; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(-Math.PI / 2 + clock * TAU) * 11, cy + Math.sin(-Math.PI / 2 + clock * TAU) * 11); c.stroke(); }
}
function foxAt(p) { const n = FOXP.length - 1, u = SK.clamp(p, 0, 1) * n, i = Math.min(n - 1, Math.floor(u)), k = u - i; return [SK.lerp(FOXP[i][0], FOXP[i + 1][0], k), SK.lerp(FOXP[i][1], FOXP[i + 1][1], k)]; }
function newRound(g) { const s = g.s; s.bp = { x: DESK[0] + 10, y: DESK[1] - 8, st: 'desk' }; s.fox = 0; s.ph = 'race'; s.at = g.t; s.foxGo = s.r === 0 ? null : g.t + 0.5; }
MG.add({
  id: 'filefirst', stage: 'law', cmd: 'FILE YOUR BLUEPRINT BEFORE THE FOX!', time: 7, mood: 'desert', winText: 'Patented!', failText: 'Fenced out!',
  card: { title: 'File first', kind: 'Law', ref: 'Patents ("first inventor to file")',
    text: 'A patent is a deal. You publish exactly how your invention works, so everyone can learn from it. In return, the law fences it off for you: for about 20 years from the day you file, nobody else may make or sell it without your permission. Then the fence drops and anyone may build it.\n\nIn the United States, when two people invent the same thing, the patent usually goes to the first one to file. Keeping your blueprint in a drawer let the fox file first and fence you out of your own idea.\n\nGeneral information about US law, not legal advice.',
    note: 'A patent trades publishing how an invention works for about 20 years of protection, and in the US the first to file usually wins.' },
  init(g) { const s = g.s, v = SK.variant(g, 4); s.n = g.level ? 3 : 2; s.kinds = [KINDS[v], ...SK.shuffled(g, KINDS.filter((_, i) => i !== v))]; s.r = 0; s.won = 0; s.old = []; s.foxT = [6.5, 5.2, 3.8][Math.min(2, g.level)]; newRound(g); },
  down(g, x, y) { const s = g.s; SK.touched(g); if (s.foxGo == null) s.foxGo = Math.max(1.2, g.t + 0.3); if (g.done || s.ph !== 'race' || s.bp.st !== 'desk') return; if (SK.dist(x, y, s.bp.x, s.bp.y) < 48) { s.bp.st = 'drag'; SK.dragStart(g, s.bp, x, y); g.sfx('rustle'); } },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, r = SK.dragEnd(g); if (!r || !r.obj || s.bp.st !== 'drag') return;
    if (s.ph === 'race' && Math.abs(s.bp.x - WIN.x) < WIN.w / 2 + 16 && Math.abs(s.bp.y - WIN.y) < WIN.h / 2 + 18) { s.bp.st = 'in'; s.ph = 'filed'; s.at = g.t; s.won++; g.sfx('stretch'); g.sfx('ding'); g.burst(WIN.x, WIN.y, ['#ffd45a', '#fff6ea', '#5ab0f0'], 16, 160); if (s.won >= s.n && !g.done) { g.win(); g.sfx('cheer'); } }
    else { s.bp.st = 'back'; s.bp.fx = s.bp.x; s.bp.fy = s.bp.y; s.bp.at = g.t; g.sfx('boing'); }
  },
  update(g, dt) {
    const s = g.s;
    if (s.foxGo == null && g.t > 4.0) s.foxGo = g.t; // a player who never touches still meets the fox
    if (s.bp.st === 'back') { const k = SK.easeOut((g.t - s.bp.at) / 0.25); s.bp.x = SK.lerp(s.bp.fx, DESK[0] + 10, k); s.bp.y = SK.lerp(s.bp.fy, DESK[1] - 8, k); if (k >= 1) s.bp.st = 'desk'; }
    if (s.ph === 'race' && s.foxGo != null && g.t > s.foxGo) { s.fox = Math.min(1, s.fox + dt / s.foxT); if (s.fox >= 1) { s.ph = 'lost'; s.at = g.t; g.sfx('stretch'); g.sfx('wrong'); } }
    if (s.ph === 'lost' && g.t - s.at > 0.9 && !g.done) { g.sfx('laugh'); g.fail(); }
    if (s.ph === 'filed' && g.t - s.at > 1.4 && s.won < s.n) { s.old.push({ k: s.kinds[s.r], t: g.t }); s.r++; s.foxT *= 0.85; newRound(g); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, e = t - s.at, k = s.kinds[s.r], won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('filefirst', paintStreet), 0, 0, 360, 640);
    // published blueprints pinned on the office's public board
    for (let i = 0; i < s.won; i++) blueprint(c, s.kinds[i], 214 + i * 12, 168 + i * 6, 0.42, t);
    SK.tag(c, 'Patent office', 262, 122, 18);
    // the service window and its clerk
    c.fillStyle = '#3a2a3a'; c.beginPath(); c.roundRect(WIN.x - WIN.w / 2, WIN.y - WIN.h / 2, WIN.w, WIN.h, 6); c.fill(); c.strokeStyle = '#6a4a2a'; c.lineWidth = 4; c.stroke();
    SK.animal(c, 'owl', WIN.x, WIN.y + WIN.h / 2 - 2, 0.55, { t, pose: s.ph === 'filed' ? 'cheer' : 'idle', expr: s.ph === 'filed' ? 'laugh' : 'happy', noShadow: true });
    c.fillStyle = '#c8a070'; c.fillRect(WIN.x - WIN.w / 2 - 6, WIN.y + WIN.h / 2 - 4, WIN.w + 12, 8);
    // older inventions: their fences' clocks have run out, so the fences lie flat and everyone builds them
    s.old.forEach((o, i) => { const x = 130 + i * 44, y = 580; gadget(c, o.k, x, y - 4, 0.55, t); const drop = SK.clamp((t - o.t) / 0.5, 0, 1); fence(c, x, y + 6, 1 - drop, t, 1 - drop); if (drop >= 1) SK.animal(c, i % 2 ? 'rabbit' : 'duck', x + 14, y + 8, 0.35, { t, pose: 'cheer', expr: 'laugh', noShadow: true }); });
    // your invention on the workbench, fenced once you have filed (and a copycat bouncing off)
    const fk = s.ph === 'filed' ? SK.easeOut(e / 0.3) : 0; gadget(c, k, DESK[0] + 40, DESK[1] + 8, 0.9, t);
    if (s.ph === 'filed') { fence(c, DESK[0] + 40, DESK[1] + 12, fk, t, 1 - SK.clamp(e / 1.4, 0, 0.3)); SK.tag(c, 'Patent', DESK[0] + 40, DESK[1] + 36, 18, '#b8ffc8'); const ck = SK.clamp((e - 0.3) / 0.7, 0, 1), cx = SK.lerp(190, 136, Math.sin(ck * Math.PI)); SK.animal(c, 'frog', cx, DESK[1] + 14, 0.55, { t, pose: 'hop', expr: ck > 0.4 ? 'wow' : 'happy', facing: -1 }); }
    if (s.ph === 'lost') { fence(c, DESK[0] + 40, DESK[1] + 12, SK.easeOut(e / 0.3), t, 1, '#ffc8c8'); SK.tag(c, "Fox's patent", DESK[0] + 40, DESK[1] + 36, 18, '#ffd0d0'); }
    SK.animal(c, 'beaver', 46, DESK[1] + 92, 0.9, { t, pose: won || s.ph === 'filed' ? 'cheer' : lost || s.ph === 'lost' ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'happy' });
    // the fox racing up the street with its copy
    const [fx, fy] = foxAt(s.fox), going = s.ph === 'race' && s.foxGo != null && t > s.foxGo;
    SK.animal(c, 'fox', fx, fy, 0.8, { t, pose: going ? 'walk' : s.ph === 'lost' ? 'cheer' : s.ph === 'filed' ? 'sad' : 'idle', expr: s.ph === 'lost' ? 'laugh' : s.ph === 'filed' ? 'sad' : 'happy', facing: -1 });
    if (s.ph !== 'filed') blueprint(c, k, fx + 16, fy - 50, 0.55, t, 0.2);
    SK.tag(c, 'Rival', fx, fy + 16 > 610 ? fy - 86 : fy + 16, 18);
    // your blueprint
    if (s.bp.st !== 'in' || e < 0.25) { const sh = s.bp.st === 'in' ? 1 - e / 0.25 : 1; if (s.ph !== 'lost') blueprint(c, k, s.bp.x, s.bp.y, 0.95 * sh, t); }
    G2.count(c, 60, 44, s.won, s.n);
    // guidance: the blueprint, the office window, and the arrow between
    if (s.ph === 'race' && s.bp.st === 'desk' && !g.done) { SK.grab(c, g, s.bp.x, s.bp.y, 36); SK.target(c, g, WIN.x, WIN.y, 0, { w: WIN.w + 8, h: WIN.h + 8 }); SK.arrow(c, g, s.bp.x, s.bp.y, WIN.x, WIN.y); SK.demo(g, c, 'drag', [s.bp.x, s.bp.y], [WIN.x, WIN.y]); }
    else SK.demo(g, c, 'drag', [0, 0], [1, 1], { never: true });
  },
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < 1.0) return;
    if (s._bt) { if (SK.bot.drag(g, synth, s._bt.key, s._bt.t, s._bt.a, s._bt.b, 0.4)) s._bt = null; return; }
    if (s.ph !== 'race' || s.bp.st !== 'desk' || g.t - s.at < 0.3) return; s._bn = (s._bn || 0) + 1;
    s._bt = { key: 'f' + s._bn, t: g.t + 0.1, a: [s.bp.x, s.bp.y], b: [WIN.x, WIN.y] };
  },
});
