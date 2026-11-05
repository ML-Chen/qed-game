// DROP A COIN! (policy EC-10) — an empty town lot with the dotted outline of a playground, a big glass town jar, and
// the townsfolk standing round it, each holding a coin over its head. Tap an animal: its coin flies into the jar. Every
// coin builds half of a piece (a swing set's frame, then its swings), so no single coin buys anything; only when
// everyone has chipped in does the whole playground stand. If time runs out first, a lone swing seat lies in the dirt.
// Level 2: a bigger playground, and the two richest animals hold two coins each (tap them twice).
// The idea: when everyone puts in a little, the town can buy things nobody could buy alone (taxes pay for public goods).
const TAU = Math.PI * 2;
const JAR = { x: 180, y0: 376, y1: 500, w: 92 };
const SPOTS = [[48, 470], [104, 566], [256, 566], [312, 470], [40, 604], [320, 604]];
const KINDS = ['ant', 'frog', 'rabbit', 'duck', 'hedgehog', 'penguin', 'fox', 'beaver'];
const PIECE_AT = { swing: [76, 322], slide: [282, 322], seesaw: [172, 292], merry: [180, 350] };
function paintTown(o) {
  // a bright spring town: sky, far rooftops, green hills, and the fenced lot
  P.sky(o, 360, 640, ['#6aa8e0', '#a8d4f0', '#eaf6f0']);
  P.cloud(o, 70, 150, 0.7); P.cloud(o, 290, 130, 0.55);
  for (let i = 0; i < 8; i++) { const x = i * 48 - 10, h = 30 + (i * 37) % 40; o.fillStyle = ['#e8a87a', '#d8b0c8', '#f0d090', '#a8c0e0'][i % 4]; o.fillRect(x, 230 - h, 40, h + 10); o.fillStyle = ['#a8483a', '#6a4a8a', '#b8683a', '#4a6a9a'][i % 4]; o.beginPath(); o.moveTo(x - 4, 232 - h); o.lineTo(x + 20, 214 - h); o.lineTo(x + 44, 232 - h); o.closePath(); o.fill(); o.fillStyle = '#fff2c0'; o.fillRect(x + 8, 240 - h, 8, 8); o.fillRect(x + 24, 240 - h, 8, 8); }
  P.hills(o, 360, 252, 18, '#9ad070', '#5a9a48', { seed: 6 });
  // the lot: bare dirt inside a little picket fence
  o.fillStyle = '#d8b47a'; o.beginPath(); o.roundRect(22, 248, 316, 108, 18); o.fill(); o.fillStyle = 'rgba(120,80,30,0.2)'; const rnd = P.rng(3); for (let i = 0; i < 50; i++) { o.beginPath(); o.ellipse(30 + rnd() * 300, 256 + rnd() * 94, 2 + rnd() * 3, 1 + rnd(), 0, 0, TAU); o.fill(); }
  o.strokeStyle = '#fff6ea'; o.lineWidth = 3; o.beginPath(); o.moveTo(18, 250); o.lineTo(342, 250); o.stroke();
  for (let x = 20; x <= 340; x += 16) { o.fillStyle = '#fff6ea'; o.beginPath(); o.moveTo(x - 4, 252); o.lineTo(x - 4, 236); o.lineTo(x, 230); o.lineTo(x + 4, 236); o.lineTo(x + 4, 252); o.closePath(); o.fill(); }
  // the square where the townsfolk gather, and a path
  const sq = o.createLinearGradient(0, 360, 0, 640); sq.addColorStop(0, '#8ac860'); sq.addColorStop(1, '#5a9a40'); o.fillStyle = sq; o.fillRect(0, 360, 360, 280);
  o.fillStyle = '#e8d8b0'; o.beginPath(); o.ellipse(180, 520, 170, 70, 0, 0, TAU); o.fill(); o.fillStyle = 'rgba(160,130,90,0.25)'; for (let i = 0; i < 40; i++) { o.beginPath(); o.ellipse(40 + rnd() * 280, 470 + rnd() * 100, 6 + rnd() * 8, 3 + rnd() * 3, 0, 0, TAU); o.fill(); }
  P.flowers(o, 360, 372, 420, 26, undefined, 5); P.grassTufts(o, 360, 380, 630, 40, '#4a8a3a', 7);
  // the jar's stone pedestal
  o.fillStyle = 'rgba(30,20,40,0.25)'; o.beginPath(); o.ellipse(186, 520, 62, 12, 0, 0, TAU); o.fill();
  o.fillStyle = '#b8b0c0'; o.beginPath(); o.roundRect(130, 498, 100, 22, 6); o.fill(); o.fillStyle = '#d8d0e0'; o.fillRect(130, 498, 100, 5);
  P.grain(o, 360, 640, 0.035); P.vignette(o, 360, 640, 0.25);
}
// one playground piece: k = 0 (a dotted outline), 0.5 (half built: just its frame), 1 (done); col = its paint
function piece(c, kind, x, y, k, t, ghost) {
  c.save(); c.translate(x, y); c.lineCap = 'round'; c.lineJoin = 'round';
  const out = ghost, wood = out ? 'rgba(255,255,255,0.7)' : '#e8563a', blue = out ? 'rgba(255,255,255,0.7)' : '#3a8ad8', yel = out ? 'rgba(255,255,255,0.7)' : '#f6c445';
  if (out) { c.setLineDash([5, 6]); c.lineDashOffset = -t * 10; }
  const lw = out ? 3 : 6;
  if (kind === 'swing') {
    c.strokeStyle = wood; c.lineWidth = lw; c.beginPath(); c.moveTo(-44, 0); c.lineTo(-34, -78); c.lineTo(-24, 0); c.moveTo(24, 0); c.lineTo(34, -78); c.lineTo(44, 0); c.moveTo(-36, -76); c.lineTo(36, -76); c.stroke();
    if (k >= 1 || out) for (const sx of [-14, 14]) { const sw = out ? 0 : Math.sin(t * 2.4 + sx) * 0.18; c.save(); c.translate(sx, -76); c.rotate(sw); c.strokeStyle = out ? wood : '#5a4a4a'; c.lineWidth = out ? 2 : 2.5; c.beginPath(); c.moveTo(-7, 0); c.lineTo(-7, 56); c.moveTo(7, 0); c.lineTo(7, 56); c.stroke(); c.fillStyle = out ? 'rgba(0,0,0,0)' : yel; c.strokeStyle = out ? wood : '#8a6a10'; c.lineWidth = 2; c.beginPath(); c.roundRect(-10, 54, 20, 6, 2); c.fill(); c.stroke(); c.restore(); }
  } else if (kind === 'slide') {
    c.strokeStyle = blue; c.lineWidth = lw; c.beginPath(); c.moveTo(-34, 0); c.lineTo(-30, -74); c.moveTo(-14, 0); c.lineTo(-10, -74); c.stroke();
    c.lineWidth = out ? 2 : 3; for (let i = 1; i < 6; i++) { const yy = -i * 13; c.beginPath(); c.moveTo(-33 + i * 0.6, yy); c.lineTo(-13 + i * 0.6, yy); c.stroke(); }
    if (k >= 1 || out) { c.strokeStyle = yel; c.lineWidth = out ? 3 : 10; c.beginPath(); c.moveTo(-12, -72); c.quadraticCurveTo(14, -60, 22, -20); c.quadraticCurveTo(28, -2, 48, -2); c.stroke(); }
  } else if (kind === 'seesaw') {
    c.fillStyle = out ? 'rgba(0,0,0,0)' : '#8a5ad8'; c.strokeStyle = out ? wood : '#4a2a8a'; c.lineWidth = out ? 3 : 2; c.beginPath(); c.moveTo(-12, 0); c.lineTo(0, -22); c.lineTo(12, 0); c.closePath(); c.fill(); c.stroke();
    if (k >= 1 || out) { const a = out ? 0 : Math.sin(t * 2) * 0.22; c.save(); c.translate(0, -22); c.rotate(a); c.strokeStyle = wood; c.lineWidth = out ? 3 : 8; c.beginPath(); c.moveTo(-50, 0); c.lineTo(50, 0); c.stroke(); c.lineWidth = out ? 2 : 4; c.beginPath(); c.moveTo(-40, 0); c.lineTo(-40, -12); c.moveTo(40, 0); c.lineTo(40, -12); c.stroke(); c.restore(); }
  } else { // merry-go-round
    c.strokeStyle = yel; c.lineWidth = out ? 3 : 4; c.beginPath(); c.moveTo(0, -6); c.lineTo(0, -44); c.stroke();
    c.fillStyle = out ? 'rgba(0,0,0,0)' : '#3ab07a'; c.strokeStyle = out ? wood : '#1a6a4a'; c.lineWidth = out ? 3 : 2; c.beginPath(); c.ellipse(0, -6, 44, 12, 0, 0, TAU); c.fill(); c.stroke();
    if (k >= 1 || out) { const sp = out ? 0 : t * 1.6; c.strokeStyle = out ? wood : '#e8563a'; c.lineWidth = out ? 2 : 3.5; for (let i = 0; i < 4; i++) { const a = sp + i * TAU / 4, ex = Math.cos(a) * 38, ey = -6 + Math.sin(a) * 10; c.beginPath(); c.moveTo(0, -44); c.lineTo(ex, ey - 22); c.lineTo(ex, ey); c.stroke(); } c.fillStyle = out ? 'rgba(0,0,0,0)' : '#e8563a'; c.beginPath(); c.ellipse(0, -46, 14, 6, 0, 0, TAU); c.fill(); if (out) c.stroke(); }
  }
  c.restore();
}
MG.add({
  id: 'dropcoin', stage: 'policy', cmd: 'EVERYONE DROPS A COIN IN!', time: 7, mood: 'bright', winText: 'A playground for all!', failText: 'Not enough coins!',
  card: { title: 'Everyone chips in', kind: 'Civics', ref: 'Taxes and public goods',
    text: 'One coin could not buy a swing set. Each coin built only half of a piece. When every animal dropped its coin in the town jar, there was enough for the whole playground.\n\nTowns work this way. People pay a little each, called taxes, into one shared pot. The pot pays for things that everyone uses and nobody could buy alone, like parks, roads and fire engines. These are called public goods.\n\nTowns choose how much each person pays and what the money buys, and people often disagree about both.',
    note: 'Many small payments into one shared pot can buy things for everyone that no one could buy alone.' },
  init(g) {
    const s = g.s, v = SK.variant(g, 4), L2 = g.level >= 2;
    const order = ['swing', 'slide', 'seesaw', 'merry']; s.pieces = [order[v], ...SK.shuffled(g, order.filter((_, i) => i !== v))].slice(0, L2 ? 4 : 3);
    const n = 6, kinds = SK.shuffled(g, KINDS), spots = SK.shuffled(g, SPOTS), rich = L2 ? SK.shuffled(g, [0, 1, 2, 3, 4, 5]).slice(0, 2) : [];
    s.ani = []; for (let i = 0; i < n; i++) s.ani.push({ k: kinds[i], x: spots[i][0], y: spots[i][1], coins: rich.includes(i) ? 2 : 1, paid: 0, at: -9, ph: i * 1.1 });
    s.need = s.pieces.length * 2; s.inJar = 0; s.fly = [];
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return; let best = null, bd = 52;
    for (const a of s.ani) { if (a.paid >= a.coins) continue; const d = SK.dist(x, y, a.x, a.y - 40); if (d < bd) { bd = d; best = a; } }
    if (!best) return; best.paid++; best.at = g.t; s.fly.push({ x: best.x, y: best.y - 76, t: g.t, i: s.ani.indexOf(best) }); g.sfx('pop'); g.sfx('whoosh');
  },
  update(g, dt) {
    const s = g.s;
    for (const f of s.fly) if (!f.landed && g.t - f.t >= 0.42) { f.landed = true; s.inJar++; g.sfx('coin'); if (s.inJar % 2 === 0) { const p = s.pieces[s.inJar / 2 - 1], [px, py] = PIECE_AT[p]; g.burst(px, py - 40, ['#ffd45a', '#fff6ea', '#e8563a'], 16, 170); g.sfx('grow'); } if (s.inJar >= s.need && !g.done) { g.win(); g.sfx('cheer'); } }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('dropcoin', paintTown), 0, 0, 360, 640);
    // the playground: each piece is a dotted outline, then half built (its frame) after one coin, then whole after two
    s.pieces.forEach((p, i) => { const [px, py] = PIECE_AT[p], k = SK.clamp((s.inJar - i * 2) / 2, 0, 1);
      if (k <= 0) { if (lost && i === Math.floor(s.inJar / 2)) { c.fillStyle = '#f6c445'; c.strokeStyle = '#8a6a10'; c.lineWidth = 2; c.save(); c.translate(px + 6, py - 4); c.rotate(0.2); c.beginPath(); c.roundRect(-11, -4, 22, 7, 2); c.fill(); c.stroke(); c.restore(); } else piece(c, p, px, py, 1, t, true); }
      else { if (k < 1) piece(c, p, px, py, 1, t, true); piece(c, p, px, py, k, t, false); } });
    SK.tag(c, 'Playground', 180, 222, 18);
    // the jar: coins stack up inside, with a line for each piece they pay for
    B8.jarBack(c, JAR.x, JAR.y0, JAR.y1, JAR.w);
    const per = (JAR.y1 - JAR.y0 - 20) / s.need;
    for (let i = 0; i < s.inJar; i++) B8.flatCoin(c, JAR.x + ((i * 7) % 11) - 5, JAR.y1 - 10 - i * per, 24, ((i * 3) % 5 - 2) * 0.04);
    c.save(); c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 2; c.setLineDash([4, 4]); for (let i = 1; i <= s.pieces.length; i++) { const yy = JAR.y1 - 10 - (i * 2 - 0.5) * per; c.beginPath(); c.moveTo(JAR.x + JAR.w / 2 - 14, yy); c.lineTo(JAR.x + JAR.w / 2 - 2, yy); c.stroke(); } c.restore();
    B8.jarFront(c, JAR.x, JAR.y0, JAR.y1, JAR.w);
    c.fillStyle = '#c8a070'; c.beginPath(); c.roundRect(JAR.x - 36, JAR.y0, 72, 12, 5); c.fill(); c.fillStyle = '#3a2a1a'; c.fillRect(JAR.x - 14, JAR.y0 + 3, 28, 5);
    SK.tag(c, 'Town jar', JAR.x, JAR.y1 + 34, 18);
    // the townsfolk, holding their coins up until they drop them in
    const order = s.ani.map((a, i) => i).sort((a, b) => s.ani[a].y - s.ani[b].y);
    for (const i of order) { const a = s.ani[i], left = a.coins - a.paid, hop = t - a.at < 0.4 ? 1 : 0;
      SK.animal(c, a.k, a.x, a.y, 0.92, { t, phase: a.ph, pose: won ? 'cheer' : lost && left ? 'sad' : left ? 'carry' : hop ? 'hop' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : left ? 'happy' : 'laugh', facing: a.x < 180 ? 1 : -1,
        hold: left ? (h => { for (let j = 0; j < left; j++) B8.coin(h, 0, -6 - j * 16, 10, Math.sin(t * 3 + a.ph) * 0.6); }) : null }); }
    // coins in flight: an arc from the paw into the slot
    for (const f of s.fly) { if (f.landed) continue; const k = SK.clamp((t - f.t) / 0.42, 0, 1), x = SK.lerp(f.x, JAR.x, k), y = SK.lerp(f.y, JAR.y0 + 4, k) - Math.sin(k * Math.PI) * 70; B8.coin(c, x, y, 11, t * 14); }
    G2.count(c, 60, 44, Math.floor(s.inJar / 2), s.pieces.length);
    // guidance: every animal still holding a coin glows; the hand taps the next one
    let next = null; for (const a of s.ani) if (a.paid < a.coins) { SK.glow(c, g, a.x, a.y - 48, 34); if (!next) next = a; }
    if (next && !g.done) SK.demo(g, c, 'tap', [next.x, next.y - 40]); else SK.demo(g, c, 'tap', [0, 0], null, { never: true });
  },
  auto(g, dt, synth) {
    const s = g.s; if (g.done) return; const i = s.fly.length; let a = null, n = 0;
    for (const q of s.ani) { if (q.paid < q.coins) { a = q; break; } } if (!a) return; for (const q of s.ani) n += q.paid; void n;
    SK.bot.tap(g, synth, 'c' + i, 1.0 + i * (g.level >= 2 ? 0.45 : 0.6), a.x, a.y - 40);
  },
});
