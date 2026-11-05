// REMEMBER! (chem_bio AN-16) — inside the body, a squad of sleepy immune cells sits under a notice board. A germ waits
// at the far door, and a harmless "wanted poster" of it (the vaccine) lands in the tray. Drag the poster onto the board:
// the cells study it, a bulb lights, and each pins on a little badge of that germ's face. When the real germ marches in,
// the cells recognise it and fire Y-shaped antibodies at once; it falls apart. Skip the poster and the germ arrives to a
// squad that has never seen it: it multiplies while they yawn. 2 / 3 / 3 germs, each with its own face; level 2: the
// last germ changes its face after you show its poster, so a new poster (an updated vaccine) is needed.
const BOARD = { x: 40, y: 228, w: 170, h: 124 }, TRAY = [282, 552], DOOR = [314, 178], MEET = [226, 420];
const KINDS = [{ col: '#ff5a6a', spk: 10, sh: 'round' }, { col: '#5a9aff', spk: 6, sh: 'square' }, { col: '#6ad050', spk: 5, sh: 'star' }, { col: '#ffb030', spk: 14, sh: 'round' }];
const CELLS = [[60, 440], [126, 466], [188, 486]];

function paintNode(o) {
  const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#ffe2d0'); bg.addColorStop(1, '#f0b8b0'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  const rnd = P.rng(13);
  for (let i = 0; i < 26; i++) { o.fillStyle = `rgba(255,255,255,${0.12 + rnd() * 0.15})`; o.beginPath(); o.arc(rnd() * 360, rnd() * 640, 10 + rnd() * 30, 0, 7); o.fill(); }
  // soft tissue walls and the door where germs come in
  o.fillStyle = '#e89a9a'; o.beginPath(); o.moveTo(360, 110); o.quadraticCurveTo(250, 140, 260, 250); o.lineTo(360, 250); o.fill();
  o.fillStyle = '#5a2030'; o.beginPath(); o.ellipse(DOOR[0], DOOR[1], 30, 40, 0, 0, 7); o.fill(); o.fillStyle = '#8a3a4a'; o.beginPath(); o.ellipse(DOOR[0], DOOR[1] + 4, 24, 32, 0, 0, 7); o.fill();
  // the path the germ walks
  o.strokeStyle = 'rgba(255,255,255,0.5)'; o.lineWidth = 16; o.lineCap = 'round'; o.setLineDash([2, 22]); o.beginPath(); o.moveTo(DOOR[0], DOOR[1] + 30); o.quadraticCurveTo(300, 380, MEET[0] + 30, MEET[1]); o.stroke(); o.setLineDash([]);
  // the notice board on its post
  o.fillStyle = '#8a5a3a'; o.fillRect(BOARD.x + BOARD.w / 2 - 5, BOARD.y + BOARD.h, 10, 40);
  o.fillStyle = '#c8945a'; o.strokeStyle = '#6a4024'; o.lineWidth = 4; o.beginPath(); o.roundRect(BOARD.x, BOARD.y, BOARD.w, BOARD.h, 8); o.fill(); o.stroke();
  o.fillStyle = '#e0b07a'; o.beginPath(); o.roundRect(BOARD.x + 8, BOARD.y + 8, BOARD.w - 16, BOARD.h - 16, 4); o.fill();
  // the tray
  o.fillStyle = 'rgba(120,60,60,0.25)'; o.beginPath(); o.roundRect(TRAY[0] - 62, TRAY[1] - 60, 124, 120, 18); o.fill();
}
function germ(c, x, y, r, K, t, mood = 'happy') {
  c.save(); c.translate(x, y); c.rotate(Math.sin(t * 2) * 0.15);
  c.fillStyle = P.shade(K.col, -0.3); for (let i = 0; i < K.spk; i++) { const a = i / K.spk * 6.283 + t * 0.5; c.beginPath(); c.arc(Math.cos(a) * r * 1.15, Math.sin(a) * r * 1.15, r * 0.2, 0, 7); c.fill(); }
  c.fillStyle = K.col; c.strokeStyle = P.shade(K.col, -0.5); c.lineWidth = 2;
  c.beginPath(); if (K.sh === 'square') c.roundRect(-r, -r, 2 * r, 2 * r, r * 0.35); else if (K.sh === 'star') { for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283 - Math.PI / 2, rr = i % 2 ? r * 0.62 : r * 1.05; i ? c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : c.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); } else c.arc(0, 0, r, 0, 7);
  c.fill(); c.stroke();
  c.fillStyle = '#2a1424'; c.beginPath(); c.arc(-r * 0.32, -r * 0.12, r * 0.14, 0, 7); c.arc(r * 0.32, -r * 0.12, r * 0.14, 0, 7); c.fill();
  c.strokeStyle = '#2a1424'; c.lineWidth = Math.max(1.2, r * 0.1); c.beginPath(); if (mood === 'sad') c.arc(0, r * 0.45, r * 0.3, Math.PI + 0.4, -0.4); else { c.moveTo(-r * 0.35, r * 0.3); c.lineTo(-r * 0.1, r * 0.4); c.lineTo(r * 0.1, r * 0.3); c.lineTo(r * 0.35, r * 0.4); } c.stroke();
  c.restore();
}
function poster(c, x, y, K, t, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-0.05);
  c.fillStyle = '#fff6e0'; c.strokeStyle = '#8a6a4a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-34, -40, 68, 80, 6); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(138,106,74,0.4)'; c.lineWidth = 2; c.beginPath(); c.roundRect(-28, -34, 56, 56, 4); c.stroke();
  // a faded, harmless copy of the germ (no spikes moving, pale)
  c.globalAlpha = 0.85; germ(c, 0, -6, 17, { ...K, col: P.mix(K.col, '#ffffff', 0.35) }, 0, 'sad'); c.globalAlpha = 1;
  c.fillStyle = '#c84a3a'; c.beginPath(); c.arc(0, -40, 4, 0, 7); c.fill(); // pin
  c.fillStyle = '#8a6a4a'; for (let i = 0; i < 3; i++) c.fillRect(-22 + i * 16, 28, 12, 3);
  c.restore();
}
function cell(c, x, y, t, i, awake, badge, K) {
  const bob = Math.sin(t * 2 + i) * 2;
  c.fillStyle = '#fbf8ff'; c.strokeStyle = '#8a7ab0'; c.lineWidth = 2.5; c.beginPath(); c.arc(x, y + bob, 32, 0, 7); c.fill(); c.stroke();
  c.fillStyle = 'rgba(154,106,208,0.7)'; c.beginPath(); c.arc(x + 5, y - 6 + bob, 13, 0, 7); c.fill();
  for (const e of [-1, 1]) { if (awake) { c.fillStyle = '#2a1424'; c.beginPath(); c.arc(x + e * 11, y + 8 + bob, 4, 0, 7); c.fill(); } else { c.strokeStyle = '#2a1424'; c.lineWidth = 2.5; c.beginPath(); c.arc(x + e * 11, y + 7 + bob, 4.5, 0.2, Math.PI - 0.2); c.stroke(); } }
  if (badge) { c.save(); c.fillStyle = '#fff6e0'; c.strokeStyle = '#d8a040'; c.lineWidth = 2; c.beginPath(); c.arc(x + 22, y + 18 + bob, 12, 0, 7); c.fill(); c.stroke(); germ(c, x + 22, y + 18 + bob, 7, K, 0); c.restore(); }
}

MG.add({
  id: 'medicine_remember', stage: 'medicine', cmd: 'SHOW THE VACCINE POSTER FIRST!', time: 8, mood: 'party', winText: 'Germs stopped fast!', failText: 'Germ spread!',
  card: { title: 'Practise on a poster', kind: 'Medicine', ref: 'Vaccines and immune memory',
    text: 'A vaccine shows your immune system a harmless copy or piece of a germ, like a wanted poster. Immune cells learn its shape, and some stay on as memory cells, often for years.\n\nIf the real germ arrives later, the memory cells recognise it and quickly make lots of antibodies, Y-shaped proteins that stick to the germ and help destroy it. Without that practice, the body needs a week or more to build its defence, and the germ has time to spread.\n\nSome germs, like flu viruses, keep changing their outside, so their vaccines are updated every year.',
    note: 'A vaccine teaches the immune system a germ\'s shape ahead of time, so the real germ is stopped quickly.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level), f = 1 + (g.speed - 1) * 0.35;
    s.L = L; s.f = f; s.rounds = [2, 3, 3][L]; s.walk = [3.3, 2.5, 1.9][L] / f;
    const order = [0, 1, 2, 3]; for (let i = 3; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    s.order = order; s.learned = []; s.fails = 0; s.mutated = false;
    startRound(g, 0, 0.5);
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; const p = s.post; if (p && !p.on && SK.dist(x, y, p.x, p.y) < 50) { p.drag = true; SK.dragStart(g, p, x, y); g.sfx('rustle'); } },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const p = d.obj; p.drag = false;
    if (!g.done && p.x > BOARD.x - 10 && p.x < BOARD.x + BOARD.w + 10 && p.y > BOARD.y - 20 && p.y < BOARD.y + BOARD.h + 30) { p.on = g.t; p.x = BOARD.x + BOARD.w / 2; p.y = BOARD.y + BOARD.h / 2; s.learn = g.t; s.known = p.kind; g.sfx('ding'); g.sfx('magic'); }
    else { p.x = TRAY[0]; p.y = TRAY[1]; }
  },
  update(g, dt) {
    const s = g.s, R = s.r; if (!R) return;
    // learning: a moment after the poster goes up, every cell wears a badge of that face
    if (s.learn >= 0 && g.t - s.learn > 0.45 && !s.learned.includes(s.known)) { s.learned.push(s.known); g.sfx('chime'); }
    // level 2, last germ: halfway along it changes its face, and an updated poster arrives
    if (s.L >= 2 && R.i === s.rounds - 1 && !s.mutated && s.learned.includes(R.kind) && g.t > R.t0 + 0.6) { s.mutated = true; R.kind = s.order[3]; R.mut = g.t; s.post = { x: TRAY[0], y: TRAY[1], kind: R.kind, on: 0 }; R.arrive += 1.1 / s.f; g.sfx('magic'); }
    // the germ walks in
    const k = SK.clamp((g.t - R.t0) / (R.arrive - R.t0), 0, 1); R.k = k;
    if (k >= 1 && !R.met && !g.done) {
      R.met = g.t;
      if (s.learned.includes(R.kind)) { R.beat = true; g.sfx('pop'); g.sfx('clap'); }
      else { R.spread = g.t; g.fail(); g.sfx('laugh'); }
    }
    if (R.beat && g.t - R.met > 0.55 && !g.done) { if (R.i + 1 >= s.rounds) { g.win(); g.sfx('cheer'); } else startRound(g, R.i + 1, 0.2); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, R = s.r, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('medicine_remember_node', paintNode), 0, 0, 360, 640);
    const K = R ? KINDS[R.kind] : KINDS[0];
    // the germ on its way (or bursting, or multiplying)
    if (R) {
      const q = SK.easeInOut(R.k), x = SK.lerp(DOOR[0], MEET[0] + 30, q) + Math.sin(q * 3) * 20 * (1 - q), y = SK.lerp(DOOR[1] + 10, MEET[1], q) - Math.abs(Math.sin(t * 8)) * 4;
      if (R.beat) { const k = Math.min(1, (t - R.met) / 0.6); c.globalAlpha = 1 - k; germ(c, x, y, 30 * (1 - k * 0.5), K, t, 'sad'); c.globalAlpha = 1;
        for (let i = 0; i < 6; i++) { const a = i * 1.05; const kk = Math.min(1, (t - R.met) * 4); const ax = SK.lerp(CELLS[i % 3][0], x + Math.cos(a) * 18, kk), ay = SK.lerp(CELLS[i % 3][1], y + Math.sin(a) * 18, kk); c.strokeStyle = '#ffd25a'; c.lineWidth = 4.5; c.lineCap = 'round'; c.save(); c.translate(ax, ay); c.rotate(a + Math.PI / 2); c.beginPath(); c.moveTo(0, 9); c.lineTo(0, 0); c.lineTo(-7, -9); c.moveTo(0, 0); c.lineTo(7, -9); c.stroke(); c.restore(); } }
      else if (R.spread) { const k = Math.min(1, (t - R.spread) / 1.2); for (let i = 0; i < 1 + Math.floor(k * 7); i++) germ(c, x + Math.cos(i * 2.1) * i * 12, y + Math.sin(i * 1.7) * i * 9, 22, K, t + i); }
      else germ(c, x, y, 30, K, t);
      if (R.mut && t - R.mut < 0.6) { c.strokeStyle = `rgba(255,255,255,${1 - (t - R.mut) / 0.6})`; c.lineWidth = 4; c.beginPath(); c.arc(x, y, 30 + (t - R.mut) * 60, 0, 7); c.stroke(); }
    }
    // the squad of immune cells (awake once they've learned the face that's coming)
    const awake = R && s.learned.includes(R.kind);
    for (const [i, [x, y]] of CELLS.entries()) cell(c, x, y, t, i, awake || won, s.learned.length > 0, KINDS[s.learned[Math.min(i, s.learned.length - 1)] ?? 0]);
    if (R && R.spread) { const k = (t * 1.2) % 1; c.fillStyle = `rgba(42,20,36,${1 - k})`; c.font = '900 20px Nunito, system-ui, sans-serif'; c.fillText('z', 50 + k * 14, 398 - k * 24); }
    if (s.learn >= 0 && t - s.learn < 0.9) { const k = (t - s.learn) / 0.9; c.fillStyle = `rgba(255,230,90,${1 - k})`; c.beginPath(); c.arc(126, 410 - k * 20, 11, 0, 7); c.fill(); }
    // the poster: in the tray (glowing), being dragged, or pinned on the board
    const p = s.post;
    if (p && !p.on) { c.save(); c.setLineDash([8, 6]); c.strokeStyle = `rgba(255,250,200,${0.5 + 0.4 * Math.sin(t * 6)})`; c.lineWidth = 3; c.beginPath(); c.roundRect(BOARD.x + BOARD.w / 2 - 50, BOARD.y + 6, 100, 112, 6); c.stroke(); c.restore(); }
    if (p) poster(c, p.x, p.y, KINDS[p.kind], t, p.drag ? 1.4 : 1.3);
    SK.animal(c, 'duck', 40, 620, 0.65, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    if (p) SK.tag(c, 'Vaccine', p.x, p.y - 64, 18); SK.tag(c, 'Immune cells', 120, 534, 18); if (R && !R.beat && !R.spread && R.k < 0.5) SK.tag(c, 'Germ', 300, 232, 18);
    if (p && !p.on && !p.drag) { SK.target(c, g, BOARD.x + BOARD.w / 2, BOARD.y + BOARD.h / 2, 0, { w: BOARD.w + 10, h: BOARD.h + 10 }); SK.arrow(c, g, p.x, p.y, BOARD.x + BOARD.w / 2 + 20, BOARD.y + BOARD.h / 2 + 30); SK.grab(c, g, p.x, p.y, 50); }
    if (p && !p.on) SK.demo(g, c, 'drag', [TRAY[0], TRAY[1]], [BOARD.x + BOARD.w / 2, BOARD.y + BOARD.h / 2]);
  },
  // the bot: put each poster on the board as soon as it appears
  auto(g, dt, synth) {
    const s = g.s, p = s.post; if (g.done || !p || p.on) return; s.botN = s.botN || 0;
    if (!s.botAt || s.botFor !== p) { s.botFor = p; s.botAt = g.t + 0.25; s.botN++; }
    SK.bot.drag(g, synth, 'p' + s.botN, s.botAt, [TRAY[0], TRAY[1]], [BOARD.x + BOARD.w / 2, BOARD.y + BOARD.h / 2], 0.35);
  },
});
function startRound(g, i, delay) {
  const s = g.s, kind = s.order[i];
  s.r = { i, kind, t0: g.t + delay, arrive: g.t + delay + s.walk, k: 0 };
  s.post = { x: TRAY[0], y: TRAY[1], kind, on: 0 }; s.learn = -1; s.known = null;
}
