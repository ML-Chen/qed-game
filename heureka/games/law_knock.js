// KNOCK FIRST! (law EC-12) — a sunset street of three houses and, below, your puppet theatre with a gramophone and a
// big Play button, an audience waiting. Music drifts out of one neighbour's window (the bird's song, the frog's...).
// Knock on that neighbour's door first: they pop out, nod "yes", fly over and sit on your theatre roof; then press
// Play and they sing along with the show. Press Play before asking and the owner bursts out of the house, zooms down
// and yanks the gramophone's plug: the show goes dark. Two shows at level 0, three at level 1, and at level 2 one
// neighbour says "no": they keep their song, and your turtle hums its own tune for that show instead.
// The idea: ask before you use something someone else made (permission, the first step toward copyright).
const TAU = Math.PI * 2;
const HX = [64, 180, 296], HY = 318, DOOR_H = 54;
const OWN = [
  { k: 'bird', name: "Bird's song", col: '#4ab0f0', call: 'tweet' },
  { k: 'frog', name: "Frog's song", col: '#5ad05a', call: 'ribbit' },
  { k: 'duck', name: "Duck's song", col: '#ffc83a', call: 'quack' },
  { k: 'rabbit', name: "Rabbit's song", col: '#ff8ac0', call: 'tweet' },
];
const WALL = ['#e8a070', '#d8b0d8', '#f0c878'], ROOF = ['#a8483a', '#6a4a8a', '#b8683a'];
const ST = { x: 138, top: 392, w: 196, h: 160 }, PLAY = { x: 298, y: 552, r: 30 }, GRAM = { x: 298, y: 470 }, SOCK = [348, 510];
function paintStreet(o) {
  // a warm desert sunset, far mesas, a street of adobe houses and the yard where the theatre stands
  const sk = o.createLinearGradient(0, 0, 0, 340); sk.addColorStop(0, '#3a2a6a'); sk.addColorStop(0.45, '#c8607a'); sk.addColorStop(0.8, '#f8a868'); sk.addColorStop(1, '#ffd8a0'); o.fillStyle = sk; o.fillRect(0, 0, 360, 340);
  const sun = o.createRadialGradient(250, 250, 4, 250, 250, 90); sun.addColorStop(0, 'rgba(255,240,190,0.95)'); sun.addColorStop(0.25, 'rgba(255,220,150,0.6)'); sun.addColorStop(1, 'rgba(255,200,140,0)'); o.fillStyle = sun; o.fillRect(140, 150, 220, 200);
  P.stars(o, 360, 120, 24, 5, 0);
  o.fillStyle = '#9a4a6a'; o.beginPath(); o.moveTo(0, 290); o.lineTo(30, 250); o.lineTo(90, 248); o.lineTo(110, 270); o.lineTo(200, 268); o.lineTo(222, 236); o.lineTo(300, 234); o.lineTo(320, 262); o.lineTo(360, 262); o.lineTo(360, 340); o.lineTo(0, 340); o.closePath(); o.fill();
  o.fillStyle = 'rgba(255,200,150,0.25)'; o.fillRect(0, 280, 360, 60);
  // the street and the yard
  const gr = o.createLinearGradient(0, HY - 4, 0, 640); gr.addColorStop(0, '#d8a068'); gr.addColorStop(0.15, '#c88a58'); gr.addColorStop(1, '#8a5a3a'); o.fillStyle = gr; o.fillRect(0, HY - 4, 360, 640 - HY + 4);
  o.fillStyle = '#e8c090'; o.fillRect(0, HY, 360, 10); o.fillStyle = 'rgba(90,40,20,0.25)'; o.fillRect(0, HY + 10, 360, 3);
  const rnd = P.rng(7); for (let i = 0; i < 70; i++) { o.fillStyle = rnd() < 0.5 ? 'rgba(255,230,190,0.25)' : 'rgba(80,40,20,0.2)'; o.beginPath(); o.ellipse(rnd() * 360, HY + 20 + rnd() * 300, 2 + rnd() * 4, 1 + rnd() * 1.5, 0, 0, TAU); o.fill(); }
  for (const [x, y, s] of [[18, 362, 0.8], [344, 350, 0.7], [20, 560, 0.9]]) cactus(o, x, y, s);
  // the houses: walls, roofs, windows (lit later) and closed doors
  for (let i = 0; i < 3; i++) {
    const x = HX[i], w = 96, h = 108, l = x - w / 2;
    o.fillStyle = 'rgba(40,10,30,0.25)'; o.beginPath(); o.ellipse(x + 6, HY + 2, w * 0.6, 6, 0, 0, TAU); o.fill();
    const wg = o.createLinearGradient(l, 0, l + w, 0); wg.addColorStop(0, P.shade(WALL[i], 0.18)); wg.addColorStop(1, P.shade(WALL[i], -0.15)); o.fillStyle = wg; o.beginPath(); o.roundRect(l, HY - h, w, h, [6, 6, 0, 0]); o.fill();
    o.strokeStyle = P.shade(WALL[i], -0.45); o.lineWidth = 2; o.stroke();
    o.fillStyle = ROOF[i]; o.beginPath(); o.moveTo(l - 10, HY - h + 4); o.lineTo(x, HY - h - 40); o.lineTo(l + w + 10, HY - h + 4); o.closePath(); o.fill(); o.strokeStyle = P.shade(ROOF[i], -0.4); o.stroke();
    o.fillStyle = 'rgba(255,255,255,0.18)'; o.beginPath(); o.moveTo(l - 4, HY - h + 1); o.lineTo(x, HY - h - 34); o.lineTo(x, HY - h - 26); o.lineTo(l + 6, HY - h + 1); o.closePath(); o.fill();
    o.fillStyle = '#6a3a2a'; o.fillRect(x + 24, HY - h - 26, 10, 18);
    // door frame and step
    o.fillStyle = P.shade(WALL[i], -0.35); o.beginPath(); o.roundRect(x - 19, HY - DOOR_H - 4, 38, DOOR_H + 4, [19, 19, 0, 0]); o.fill();
    o.fillStyle = '#c8a078'; o.fillRect(x - 24, HY - 3, 48, 6);
    // window frame
    o.fillStyle = P.shade(WALL[i], -0.4); o.beginPath(); o.roundRect(x - 40, HY - 92, 34, 30, 5); o.fill();
  }
  P.grain(o, 360, 640, 0.04); P.vignette(o, 360, 640, 0.3);
}
function cactus(o, x, y, s) {
  o.save(); o.translate(x, y); o.scale(s, s); o.fillStyle = '#4a8a4a'; o.strokeStyle = '#2a5a2a'; o.lineWidth = 2;
  o.beginPath(); o.roundRect(-8, -60, 16, 60, 8); o.fill(); o.stroke(); o.beginPath(); o.roundRect(-24, -40, 10, 26, 5); o.fill(); o.stroke(); o.beginPath(); o.roundRect(-24, -20, 18, 8, 4); o.fill();
  o.beginPath(); o.roundRect(14, -50, 10, 26, 5); o.fill(); o.stroke(); o.beginPath(); o.roundRect(6, -30, 18, 8, 4); o.fill(); o.restore();
}
function note(c, x, y, col, s = 1, a = 1) {
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.strokeStyle = 'rgba(40,10,40,0.6)'; c.lineWidth = 1.5;
  c.beginPath(); c.ellipse(0, 0, 6, 4.5, -0.4, 0, TAU); c.fill(); c.stroke(); c.fillRect(4, -18, 2.5, 18); c.beginPath(); c.moveTo(6.5, -18); c.quadraticCurveTo(14, -14, 12, -6); c.lineWidth = 2.5; c.strokeStyle = col; c.stroke(); c.restore();
}
// notes rising from (x, y), drawn from the clock only (deterministic)
function notes(c, t, x, y, col, n = 4, spread = 30, a = 1) { for (let i = 0; i < n; i++) { const k = ((t * 0.7 + i / n) % 1); note(c, x + Math.sin(t * 3 + i * 2) * 8 + (i - n / 2) * spread / n, y - k * 60, col, 0.8 + 0.3 * Math.sin(i), a * Math.min(1, (1 - k) * 3, k * 6)); } }
function gramophone(c, x, y, t, playing) {
  c.save(); c.translate(x, y);
  c.fillStyle = 'rgba(30,10,20,0.3)'; c.beginPath(); c.ellipse(4, 34, 40, 8, 0, 0, TAU); c.fill();
  const bx = c.createLinearGradient(-34, 0, 34, 0); bx.addColorStop(0, '#b0703a'); bx.addColorStop(1, '#6a3a1a'); c.fillStyle = bx; c.beginPath(); c.roundRect(-34, 4, 68, 30, 6); c.fill(); c.strokeStyle = '#3a1a0a'; c.lineWidth = 2; c.stroke();
  c.fillStyle = '#2a1a2a'; c.beginPath(); c.ellipse(0, 4, 30, 7, 0, 0, TAU); c.fill(); c.fillStyle = '#c83a3a'; c.beginPath(); c.ellipse(0, 4, 8, 2.5, 0, 0, TAU); c.fill();
  c.strokeStyle = '#d8a83a'; c.lineWidth = 4; c.beginPath(); c.moveTo(18, 2); c.quadraticCurveTo(22, -20, 6, -30); c.stroke();
  const hw = playing ? 1 + Math.sin(t * 12) * 0.04 : 1; c.save(); c.translate(6, -30); c.rotate(-0.6); c.scale(hw, hw);
  const hg = c.createLinearGradient(-30, -30, 10, 10); hg.addColorStop(0, '#fff0a0'); hg.addColorStop(1, '#c8902a'); c.fillStyle = hg; c.beginPath(); c.moveTo(0, 0); c.lineTo(-36, -22); c.quadraticCurveTo(-44, 0, -36, 22); c.closePath(); c.fill(); c.strokeStyle = '#7a5010'; c.lineWidth = 2; c.stroke();
  c.fillStyle = '#5a3008'; c.beginPath(); c.ellipse(-37, 0, 5, 22, 0, 0, TAU); c.fill(); c.restore();
  c.restore();
}
function theatre(c, t, open, lit) {
  const { x, top, w, h } = ST, l = x - w / 2;
  c.fillStyle = 'rgba(30,10,20,0.3)'; c.beginPath(); c.ellipse(x + 6, top + h + 4, w * 0.55, 9, 0, 0, TAU); c.fill();
  const fr = c.createLinearGradient(l, 0, l + w, 0); fr.addColorStop(0, '#d8783a'); fr.addColorStop(1, '#8a3a1a'); c.fillStyle = fr; c.beginPath(); c.roundRect(l, top, w, h, 10); c.fill(); c.strokeStyle = '#4a1a0a'; c.lineWidth = 3; c.stroke();
  // the window of the stage: a starry backdrop behind the curtains
  const iw = w - 36, ih = h - 62, ix = l + 18, iy = top + 22;
  const bd = c.createLinearGradient(0, iy, 0, iy + ih); bd.addColorStop(0, lit ? '#2a4a8a' : '#0a0a1a'); bd.addColorStop(1, lit ? '#5a8ac8' : '#14142a'); c.fillStyle = bd; c.fillRect(ix, iy, iw, ih);
  if (lit) { c.fillStyle = '#fff6c8'; for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(ix + 12 + i * 23, iy + 12 + (i % 3) * 9, 1.8, 0, TAU); c.fill(); } c.fillStyle = '#ffe9a0'; c.beginPath(); c.arc(ix + iw - 24, iy + 18, 10, 0, TAU); c.fill(); }
  // puppets bob up from below when the show runs
  if (open > 0.3 && lit) for (const [px, col, ph] of [[ix + iw * 0.32, '#e8563a', 0], [ix + iw * 0.68, '#5ab0e8', 1.7]]) {
    const py = iy + ih - 16 - Math.abs(Math.sin(t * 5 + ph)) * 14; c.fillStyle = col; c.beginPath(); c.roundRect(px - 13, py - 6, 26, 40, 10); c.fill();
    c.fillStyle = '#fff6ea'; c.beginPath(); c.arc(px - 5, py + 2, 4, 0, TAU); c.arc(px + 5, py + 2, 4, 0, TAU); c.fill(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(px - 5, py + 3, 2, 0, TAU); c.arc(px + 5, py + 3, 2, 0, TAU); c.fill();
    c.strokeStyle = '#2a1424'; c.lineWidth = 2; c.beginPath(); c.arc(px, py + 11, 5, 0.2, Math.PI - 0.2); c.stroke(); }
  // the curtains part as `open` goes 0..1
  for (const sd of [-1, 1]) { const cw = iw / 2 * (1 - 0.78 * open), cx0 = sd < 0 ? ix : ix + iw - cw;
    const cg = c.createLinearGradient(cx0, 0, cx0 + cw, 0); cg.addColorStop(0, '#c8203a'); cg.addColorStop(0.5, '#e8405a'); cg.addColorStop(1, '#a01028'); c.fillStyle = cg; c.fillRect(cx0, iy, cw, ih);
    c.strokeStyle = 'rgba(80,0,20,0.4)'; c.lineWidth = 2; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(cx0 + cw * k / 4, iy); c.lineTo(cx0 + cw * k / 4, iy + ih); c.stroke(); } }
  c.fillStyle = '#c8203a'; c.beginPath(); c.moveTo(ix, iy); c.lineTo(ix + iw, iy); c.lineTo(ix + iw, iy + 10); for (let k = 0; k <= 8; k++) c.quadraticCurveTo(ix + iw - (k + 0.5) * iw / 8, iy + 20, ix + iw - (k + 1) * iw / 8, iy + 10); c.closePath(); c.fill();
  c.fillStyle = '#f6c445'; c.fillRect(ix - 4, iy + ih, iw + 8, 8);
  if (!lit) { c.fillStyle = 'rgba(10,5,20,0.45)'; c.beginPath(); c.roundRect(l, top, w, h, 10); c.fill(); }
}
MG.add({
  id: 'knockfirst', stage: 'law', cmd: 'KNOCK FIRST, THEN PLAY THE SHOW!', time: 7, mood: 'desert', winText: 'They said yes!', failText: 'Ask first!',
  card: { title: 'Ask before you use it', kind: 'Law', ref: 'Permission and copyright',
    text: 'A song, a drawing or a story belongs to the person who made it. Before you use it in your own show, you ask them. That is called asking permission.\n\nWhen the bird said yes, it came over and sang along. When you played its song without asking, it was upset and pulled the plug. When a neighbour said no, the show still went on: you made up your own tune.\n\nGrown-up law works the same way. Copyright lets the maker decide who may copy or perform their work.\n\nGeneral information about US law, not legal advice.',
    note: 'Ask the maker before you use their song or picture; if they say no, make your own.' },
  init(g) {
    const s = g.s, v = SK.variant(g, 4), houses = SK.shuffled(g, [0, 1, 2]), n = g.level ? 3 : 2;
    s.rounds = []; for (let i = 0; i < n; i++) s.rounds.push({ h: houses[i], o: (v + i) % 4, no: g.level >= 2 && i === 1 });
    s.i = 0; s.ph = 'ask'; s.at = 0; s.singers = []; s.shows = 0;
  },
  down(g, x, y) {
    const s = g.s, R = s.rounds[s.i]; SK.touched(g); if (g.done || !R) return;
    const onPlay = SK.dist(x, y, PLAY.x, PLAY.y) < PLAY.r + 16, hx = HX[R.h];
    if (s.ph === 'ask') {
      if (Math.abs(x - hx) < 46 && y > HY - 150 && y < HY + 14) { s.ph = 'answer'; s.at = g.t; g.sfx('thud'); g.sfx('tap'); return; }
      if (onPlay) { s.ph = 'unplug'; s.at = g.t; g.sfx('click'); g.sfx('wrong'); }
      else if (HX.some(h => Math.abs(x - h) < 46) && y > HY - 150 && y < HY + 14) g.sfx('tap'); // a quiet house: nobody's music there
      return;
    }
    if (s.ph === 'ready' && onPlay) { s.ph = 'show'; s.at = g.t; g.sfx('click'); g.sfx(R.no ? 'magic' : 'bell'); }
  },
  update(g, dt) {
    const s = g.s, R = s.rounds[s.i], e = g.t - s.at; if (!R) return;
    if (s.ph === 'answer') { if (e > 0.12 && !s.called) { s.called = true; g.sfx(R.no ? 'wrong' : OWN[R.o].call); } if (e > 0.75) { s.called = false; s.ph = R.no ? 'back' : 'fly'; s.at = g.t; if (!R.no) g.sfx('whoosh'); } }
    else if (s.ph === 'fly') { if (e > 0.55) { s.singers.push({ o: R.o, slot: s.singers.length }); s.ph = 'ready'; s.at = g.t; g.sfx('chime'); } }
    else if (s.ph === 'back') { if (e > 0.4) { s.ph = 'ready'; s.at = g.t; } }
    else if (s.ph === 'show') {
      if (e > 0.45 && !s.counted) { s.counted = true; s.shows++; g.burst(ST.x, ST.top + 40, ['#ffd45a', '#fff6ea', OWN[R.o].col], 14, 160); if (s.shows >= s.rounds.length && !g.done) { g.win(); g.sfx('cheer'); } else g.sfx('clap'); }
      if (e > 1.15 && s.shows < s.rounds.length) { s.counted = false; s.i++; s.ph = 'ask'; s.at = g.t; }
    } else if (s.ph === 'unplug') {
      if (e > 0.55 && !s.yanked) { s.yanked = true; g.sfx('snap'); g.shake(4, 0.2); g.burst(SOCK[0] - 6, SOCK[1], ['#ffe27a', '#fff6ea'], 14, 180); }
      if (e > 1.0 && !g.done) { g.sfx('laugh'); g.fail(); }
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, R = s.rounds[Math.min(s.i, s.rounds.length - 1)], e = t - s.at, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('knockfirst', paintStreet), 0, 0, 360, 640);
    const hx = HX[R.h], O = OWN[R.o], musicOn = s.ph === 'ask' || s.ph === 'answer' || s.ph === 'unplug' && e < 0.3;
    // windows: the house whose music plays glows in its owner's colour; the others are asleep
    for (let i = 0; i < 3; i++) { const x = HX[i], act = i === R.h && (musicOn || s.ph === 'back' || (R.no && s.ph === 'ready')); c.fillStyle = act ? P.mix('#fff0b0', O.col, 0.35 + 0.15 * Math.sin(t * 6)) : '#3a2a4a'; c.beginPath(); c.roundRect(x - 37, HY - 89, 28, 24, 4); c.fill(); c.fillStyle = 'rgba(60,30,30,0.6)'; c.fillRect(x - 24, HY - 89, 2, 24); c.fillRect(x - 37, HY - 78, 28, 2); }
    if (musicOn) { notes(c, t, hx - 22, HY - 96, O.col, 4, 34); SK.tag(c, O.name, hx < 100 ? 92 : hx > 260 ? 268 : hx, HY - 168, 18); }
    // doors: closed, or open with the owner on the step
    for (let i = 0; i < 3; i++) { const x = HX[i], open = i === R.h && (s.ph === 'answer' || s.ph === 'back' && e < 0.3 || s.ph === 'fly' && e < 0.3 || s.ph === 'unplug' && e < 0.25);
      c.fillStyle = open ? '#2a1424' : '#8a4a2a'; c.beginPath(); c.roundRect(x - 15, HY - DOOR_H, 30, DOOR_H, [15, 15, 0, 0]); c.fill();
      if (!open) { c.strokeStyle = '#5a2a1a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, HY - DOOR_H + 4); c.lineTo(x, HY); c.stroke(); c.fillStyle = '#f6c445'; c.beginPath(); c.arc(x + 9, HY - 24, 2.8, 0, TAU); c.fill(); }
      else { c.save(); c.translate(x - 15, 0); c.scale(0.25, 1); c.fillStyle = '#a85a3a'; c.beginPath(); c.roundRect(-30, HY - DOOR_H, 30, DOOR_H, 4); c.fill(); c.restore(); } }
    // the knock: two little shock marks on the door
    if (s.ph === 'answer' && e < 0.4) { c.strokeStyle = '#fff6ea'; c.lineWidth = 3; for (const k of [0, 1]) { const a = SK.clamp((e - k * 0.12) * 6, 0, 1); if (a <= 0) continue; c.globalAlpha = 1 - e * 2; c.beginPath(); c.moveTo(hx + 20, HY - 40 + k * 14); c.lineTo(hx + 30 + a * 6, HY - 44 + k * 14); c.stroke(); } c.globalAlpha = 1; }
    // the owner: on the step answering, flying to the roof, or bursting out to pull the plug
    const perch = k => [ST.x - 66 + k * 44, ST.top + 2];
    if (s.ph === 'answer' || s.ph === 'back') { const pop = s.ph === 'answer' ? SK.easeOut(e / 0.2) : 1 - SK.clamp(e / 0.35, 0, 1); if (pop > 0.02) {
      SK.animal(c, O.k, hx, HY, 0.75 * pop, { t, pose: R.no ? 'idle' : 'wave', expr: R.no ? 'think' : 'happy' });
      if (s.ph === 'answer' && e > 0.15) { const bx = hx + (hx > 250 ? -44 : 44), by = HY - 92; c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5; c.beginPath(); c.arc(bx, by, 20, 0, TAU); c.fill(); c.stroke();
        c.lineWidth = 5; c.lineCap = 'round'; if (R.no) { c.strokeStyle = '#e8403a'; c.beginPath(); c.moveTo(bx - 8, by - 8); c.lineTo(bx + 8, by + 8); c.moveTo(bx + 8, by - 8); c.lineTo(bx - 8, by + 8); c.stroke(); } else { c.strokeStyle = '#3ab05a'; c.beginPath(); c.moveTo(bx - 9, by); c.lineTo(bx - 2, by + 7); c.lineTo(bx + 10, by - 8); c.stroke(); } } } }
    // the singers who said yes sit on the theatre roof (and sing when a show runs)
    const showing = s.ph === 'show' && !R.no;
    for (const q of s.singers) { const [px, py] = perch(q.slot); SK.animal(c, OWN[q.o].k, px, py, 0.62, { t, pose: won ? 'cheer' : 'idle', expr: lost ? 'sad' : 'happy', noShadow: true, phase: q.slot }); }
    if (s.ph === 'fly') { const k = SK.easeInOut(e / 0.55), [px, py] = perch(s.singers.length); SK.animal(c, O.k, SK.lerp(hx, px, k), SK.lerp(HY, py, k) - Math.sin(k * Math.PI) * 70, 0.68, { t, pose: 'hop', expr: 'laugh', noShadow: true }); }
    theatre(c, t, s.ph === 'show' ? SK.easeOut(e / 0.35) * (won ? 1 : 1 - SK.clamp((e - 0.95) / 0.2, 0, 1)) : 0, !(s.ph === 'unplug' && s.yanked));
    // the gramophone, its cable to the wall socket, and the Play button
    const yank = s.ph === 'unplug' ? SK.clamp((e - 0.45) / 0.15, 0, 1) : 0, plug = [SK.lerp(SOCK[0] - 8, 318, yank), SK.lerp(SOCK[1], 560, yank)];
    c.strokeStyle = '#2a1a2a'; c.lineWidth = 4; c.beginPath(); c.moveTo(GRAM.x + 30, GRAM.y + 24); c.quadraticCurveTo(GRAM.x + 44, GRAM.y + 60, plug[0], plug[1]); c.stroke();
    c.fillStyle = '#e8e0d0'; c.beginPath(); c.roundRect(SOCK[0] - 6, SOCK[1] - 14, 12, 28, 3); c.fill(); c.fillStyle = '#3a3a3a'; c.fillRect(SOCK[0] - 2, SOCK[1] - 6, 4, 4); c.fillRect(SOCK[0] - 2, SOCK[1] + 2, 4, 4);
    c.fillStyle = '#4a4a5a'; c.beginPath(); c.roundRect(plug[0] - 10, plug[1] - 8, 14, 16, 3); c.fill();
    gramophone(c, GRAM.x, GRAM.y, t, s.ph === 'show');
    if (s.ph === 'show') notes(c, t, GRAM.x - 26, GRAM.y - 40, R.no ? '#fff6ea' : O.col, 4, 30);
    if (showing) for (const q of s.singers) { const [px, py] = perch(q.slot); notes(c, t + q.slot, px + 6, py - 40, OWN[q.o].col, 2, 14); }
    const pr = s.ph === 'show' && e < 0.15 ? 1 : 0;
    c.fillStyle = '#1a6a3a'; c.beginPath(); c.arc(PLAY.x, PLAY.y + 5, PLAY.r, 0, TAU); c.fill(); SK.ball(c, PLAY.x, PLAY.y + pr * 4, PLAY.r, s.ph === 'unplug' ? '#c84a3a' : '#3ac86a');
    c.fillStyle = '#fff6ea'; c.beginPath(); c.moveTo(PLAY.x - 9, PLAY.y - 13 + pr * 4); c.lineTo(PLAY.x + 14, PLAY.y + pr * 4); c.lineTo(PLAY.x - 9, PLAY.y + 13 + pr * 4); c.closePath(); c.fill();
    SK.tag(c, 'Play', PLAY.x - 2, PLAY.y + 46 > 600 ? PLAY.y - 46 : PLAY.y + 44, 18);
    // the angry owner zooms down to the socket and pulls the plug
    if (s.ph === 'unplug') { const k = SK.easeInOut(e / 0.45); SK.animal(c, O.k, SK.lerp(hx, SOCK[0] - 22, k) - yank * 18, SK.lerp(HY, SOCK[1] + 26, k) - Math.sin(k * Math.PI) * 50, 0.8, { t, pose: yank ? 'carry' : 'hop', expr: 'wow', facing: hx > SOCK[0] - 22 ? -1 : 1, noShadow: true }); }
    // the audience and your turtle, who hums its own tune when a neighbour says no
    for (let i = 0; i < 4; i++) SK.animal(c, i % 2 ? 'ant' : 'hedgehog', 34 + i * 46, 612, 0.48, { t, phase: i * 1.3, pose: won || s.ph === 'show' && e > 0.4 ? 'cheer' : 'idle', expr: lost ? 'sad' : 'happy', facing: 1 });
    const hum = R.no && (s.ph === 'ready' || s.ph === 'show');
    SK.animal(c, 'turtle', 236, 614, 0.62, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: lost ? 'wow' : hum ? 'laugh' : 'happy', facing: 1 });
    if (hum) { notes(c, t, 240, 566, '#fff6ea', 3, 20, s.ph === 'show' ? 1 : 0.6); if (s.ph === 'ready') SK.tag(c, 'Own tune', 232, 520, 18); }
    G2.count(c, 52, 44, s.shows, s.rounds.length);
    // guidance: the door to knock on, then the Play button
    if (s.ph === 'ask' && !g.done) { SK.glow(c, g, hx, HY - 28, 32); SK.demo(g, c, 'tap', [hx, HY - 26]); }
    else if (s.ph === 'ready' && !g.done) { SK.glow(c, g, PLAY.x, PLAY.y, PLAY.r + 6); SK.demo(g, c, 'tap', [PLAY.x, PLAY.y]); }
    else SK.demo(g, c, 'tap', [0, 0], null, { never: true });
  },
  auto(g, dt, synth) {
    const s = g.s, R = s.rounds[s.i]; if (!R || g.done) return; const k = s.i + s.ph;
    if (s.ph === 'ask') SK.bot.tap(g, synth, 'knock' + s.i, Math.max(1.0, s.at + 0.3), HX[R.h], HY - 26);
    else if (s.ph === 'ready') SK.bot.tap(g, synth, 'play' + s.i, s.at + 0.3, PLAY.x, PLAY.y); void k;
  },
});
