// ACCEPT! (law LW-01) — the fox slides an offer card across the table: its bike for three coins. Tap to stamp your
// paw-print on it as it stands: the card rolls into a sealed scroll and the bike and the coins swap sides (a contract).
// Wait too long and your friend the duck leans in with a pencil and crosses out a coin. That changed card is a
// counteroffer: it flips round to face the fox, who shakes its head and keeps the bike.
const TAU = Math.PI * 2, CARD = [180, 438], STAMP0 = [84, 566];
function paintTable(o) {
  // a cosy market tent: striped canvas behind the seller, lantern light, and a wooden table seen from the player's side
  const bg = o.createLinearGradient(0, 0, 0, 360); bg.addColorStop(0, '#5a2a4a'); bg.addColorStop(1, '#a8506a'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  for (let i = 0; i < 9; i++) { o.fillStyle = i % 2 ? 'rgba(255,230,200,0.16)' : 'rgba(40,10,30,0.12)'; o.beginPath(); o.moveTo(i * 40, 0); o.lineTo(i * 40 + 40, 0); o.lineTo(i * 46 + 30, 360); o.lineTo(i * 46 - 16, 360); o.closePath(); o.fill(); }
  const lg = o.createRadialGradient(180, 150, 10, 180, 150, 220); lg.addColorStop(0, 'rgba(255,220,150,0.45)'); lg.addColorStop(1, 'rgba(255,220,150,0)'); o.fillStyle = lg; o.fillRect(0, 0, 360, 400);
  o.strokeStyle = '#3a1a2a'; o.lineWidth = 2; o.beginPath(); o.moveTo(180, 0); o.lineTo(180, 128); o.stroke();
  o.fillStyle = '#f6c445'; o.beginPath(); o.roundRect(166, 128, 28, 36, 8); o.fill(); o.fillStyle = '#fff2c0'; o.beginPath(); o.arc(180, 146, 9, 0, TAU); o.fill();
  // the table top in perspective
  o.save(); o.beginPath(); o.moveTo(40, 330); o.lineTo(320, 330); o.lineTo(370, 640); o.lineTo(-10, 640); o.closePath(); o.clip(); B9.wood(o, -10, 330, 380, 310, '#b07440', 8); o.restore();
  o.fillStyle = '#6a3a1e'; o.beginPath(); o.moveTo(40, 330); o.lineTo(320, 330); o.lineTo(322, 338); o.lineTo(38, 338); o.closePath(); o.fill();
  const sh = o.createLinearGradient(0, 330, 0, 420); sh.addColorStop(0, 'rgba(40,10,20,0.35)'); sh.addColorStop(1, 'rgba(40,10,20,0)'); o.fillStyle = sh; o.fillRect(0, 338, 360, 82);
  P.grain(o, 360, 640, 0.05); P.vignette(o, 360, 640, 0.35);
}
function bike(c, x, y, s = 1, col = '#3aa0d8') {
  c.save(); c.translate(x, y); c.scale(s, s); c.lineCap = 'round'; c.lineJoin = 'round';
  for (const wx of [-18, 18]) { c.strokeStyle = '#2a1a2a'; c.lineWidth = 4; c.beginPath(); c.arc(wx, 0, 12, 0, TAU); c.stroke(); c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 1; for (let a = 0; a < 6; a++) { c.beginPath(); c.moveTo(wx, 0); c.lineTo(wx + Math.cos(a) * 11, Math.sin(a) * 11); c.stroke(); } }
  c.strokeStyle = col; c.lineWidth = 4; c.beginPath(); c.moveTo(-18, 0); c.lineTo(-4, -18); c.lineTo(12, -18); c.lineTo(18, 0); c.moveTo(-4, -18); c.lineTo(0, 0); c.lineTo(12, -18); c.moveTo(-18, 0); c.lineTo(0, 0); c.stroke();
  c.strokeStyle = '#2a1a2a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-6, -22); c.lineTo(2, -22); c.moveTo(12, -18); c.lineTo(14, -26); c.lineTo(20, -26); c.stroke();
  c.restore();
}
// the offer card: bike -> three coins (or two, with one crossed out). k is how far the pencil has got (0..1)
function card(c, x, y, rot, t, o = {}) {
  c.save(); c.translate(x, y); c.rotate(rot); const w = 168, h = 96;
  c.fillStyle = 'rgba(30,10,20,0.3)'; c.beginPath(); c.roundRect(-w / 2 + 4, -h / 2 + 7, w, h, 10); c.fill();
  c.fillStyle = '#fff6e0'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 10); c.fill(); c.strokeStyle = '#c8a070'; c.lineWidth = 3; c.stroke();
  c.strokeStyle = 'rgba(200,160,112,0.5)'; c.lineWidth = 1.5; c.beginPath(); c.roundRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12, 7); c.stroke();
  bike(c, -46, 10, 0.95);
  c.strokeStyle = '#8a5a4a'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(-10, -2); c.lineTo(12, -2); c.moveTo(4, -9); c.lineTo(12, -2); c.lineTo(4, 5); c.stroke();
  for (let i = 0; i < 3; i++) B9.coin(c, 34 + (i % 2) * 18, -20 + i * 18, 10);
  if (o.cross > 0) { const k = SK.clamp(o.cross, 0, 1), cx = 34, cy = 16; c.strokeStyle = '#2a2a6a'; c.lineWidth = 4; c.beginPath(); c.moveTo(cx - 12, cy - 12); c.lineTo(cx - 12 + 24 * Math.min(1, k * 2), cy - 12 + 24 * Math.min(1, k * 2)); if (k > 0.5) { c.moveTo(cx + 12, cy - 12); c.lineTo(cx + 12 - 24 * (k - 0.5) * 2, cy - 12 + 24 * (k - 0.5) * 2); } c.stroke(); }
  if (o.paw > 0) { c.save(); c.globalAlpha = Math.min(1, o.paw * 3); c.translate(2, 22); c.rotate(-0.2); c.fillStyle = 'rgba(210,40,60,0.85)'; c.beginPath(); c.ellipse(0, 6, 13, 10, 0, 0, TAU); c.fill(); for (const [px, py] of [[-12, -8], [-4, -14], [5, -14], [13, -8]]) { c.beginPath(); c.ellipse(px, py, 4.5, 5.5, 0, 0, TAU); c.fill(); } c.restore(); }
  c.restore();
}
function scroll(c, x, y, k, t) { // the card rolled into a scroll with a wax seal
  c.save(); c.translate(x, y); c.scale(SK.easeOut(k), SK.easeOut(k));
  c.fillStyle = 'rgba(30,10,20,0.3)'; c.beginPath(); c.ellipse(4, 26, 70, 8, 0, 0, TAU); c.fill();
  const gr = c.createLinearGradient(0, -18, 0, 18); gr.addColorStop(0, '#fff6e0'); gr.addColorStop(0.5, '#f0dcb0'); gr.addColorStop(1, '#c8a070'); c.fillStyle = gr; c.beginPath(); c.roundRect(-66, -18, 132, 36, 18); c.fill(); c.strokeStyle = '#8a6040'; c.lineWidth = 2.5; c.stroke();
  for (const s of [-1, 1]) { c.fillStyle = '#e8d0a0'; c.beginPath(); c.ellipse(s * 66, 0, 8, 18, 0, 0, TAU); c.fill(); c.stroke(); }
  c.fillStyle = '#c8203a'; c.beginPath(); for (let i = 0; i < 12; i++) { const a = i * TAU / 12, r = i % 2 ? 15 : 18; c.lineTo(Math.cos(a) * r, 6 + Math.sin(a) * r); } c.closePath(); c.fill(); c.fillStyle = '#e84058'; c.beginPath(); c.arc(0, 6, 11, 0, TAU); c.fill();
  c.fillStyle = '#a01028'; c.beginPath(); c.ellipse(0, 9, 4.5, 3.5, 0, 0, TAU); c.fill(); for (const [px, py] of [[-5, 2], [-1.5, 0], [2, 0], [5.5, 2]]) { c.beginPath(); c.arc(px, py, 1.7, 0, TAU); c.fill(); }
  c.restore();
}
function stampTool(c, x, y, press) { // a wooden paw stamp, pressed down by `press` 0..1
  c.save(); c.translate(x, y - (1 - press) * 0);
  c.fillStyle = 'rgba(30,10,20,0.3)'; c.beginPath(); c.ellipse(4, 22, 30, 8, 0, 0, TAU); c.fill();
  c.fillStyle = '#c8203a'; c.beginPath(); c.roundRect(-26, 8, 52, 14, 5); c.fill();
  const gr = c.createLinearGradient(-20, 0, 20, 0); gr.addColorStop(0, '#d89a5a'); gr.addColorStop(1, '#8a5a2a'); c.fillStyle = gr; c.beginPath(); c.roundRect(-22, -6, 44, 16, 4); c.fill();
  c.fillStyle = gr; c.beginPath(); c.roundRect(-8, -40, 16, 36, 6); c.fill(); SK.ball(c, 0, -44, 14, '#e8b070');
  c.restore();
}
MG.add({
  id: 'acceptoffer', stage: 'law', cmd: 'ACCEPT!', time: 5, mood: 'desert', winText: 'Deal!', failText: 'Counteroffer!',
  card: { title: 'Say yes to the offer as it stands', kind: 'Law', ref: 'Offer and acceptance; counteroffers',
    text: 'An offer is a promise that waits for a yes. When you accept it exactly as it stands, a contract forms: here, a bike for three coins. Each side gives something of value, which the law calls consideration.\n\nA reply that changes the deal doesn\'t accept it. Crossing out a coin made a counteroffer: it turns down the first offer and makes a new one, which the seller is free to refuse. Until you accept, the seller can also take an offer back.\n\nGeneral information about US law, not legal advice.',
    note: 'A contract forms when an offer is accepted as it stands; changing the terms makes a counteroffer instead.' },
  init(g) {
    const s = g.s; s.stamp = 0; s.haggle = SK.clamp((g.level >= 2 ? 0.45 : 0.6) * g.dur, 2.6, 10); s.card = { x: 180, y: 300, rot: 0 };
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.stamp || g.t > s.haggle + 0.25) return;
    if (Math.abs(x - s.card.x) < 100 && Math.abs(y - s.card.y) < 70 || SK.dist(x, y, STAMP0[0], STAMP0[1] - 20) < 50) { s.stamp = g.t; g.sfx('whoosh'); }
  },
  update(g, dt) {
    const s = g.s, t = g.t;
    // the card slides from the fox across to you, the fox's paw still on it
    if (!s.stamp && t < s.haggle + 0.6) { const k = SK.easeOut(t / 0.9); s.card.x = 180; s.card.y = SK.lerp(300, CARD[1], k); }
    if (s.stamp) { const e = t - s.stamp; if (e > 0.18 && !s.thunk) { s.thunk = true; g.sfx('thud'); g.sfx('stretch'); g.shake(4, 0.15); g.burst(s.card.x, s.card.y + 10, ['#e84058', '#fff6ea'], 12, 140); } if (e > 0.75 && !s.sealed) { s.sealed = true; g.sfx('magic'); } if (e > 1.0 && !g.done) { g.win(); g.sfx('cheer'); g.sfx('coin'); } }
    else if (t > s.haggle) { const e = t - s.haggle; if (e > 0.25 && !s.scribble) { s.scribble = true; g.sfx('sweep'); } if (e > 0.75) { const k = SK.easeInOut((e - 0.75) / 0.6); s.card.rot = Math.PI * k; s.card.y = SK.lerp(CARD[1], 360, k); if (!s.flip) { s.flip = true; g.sfx('swoosh'); } } if (e > 1.5 && !g.done) { g.sfx('laugh'); g.fail(); } }
  },
  draw(g, c) {
    const s = g.s, t = g.t, e = s.stamp ? t - s.stamp : 0, he = t - s.haggle;
    c.drawImage(g.bake('acceptoffer', paintTable), 0, 0, 360, 640);
    const won = g.result === 'win', lost = g.result === 'fail';
    // the bike: on the fox's side, rolling to yours once the deal is sealed; or tucked away by the fox after a counteroffer
    const bk = s.sealed ? SK.clamp((e - 0.75) / 0.7, 0, 1) : 0, pocket = s.flip ? SK.clamp((he - 1.0) / 0.5, 0, 1) : 0;
    if (pocket < 1) bike(c, SK.lerp(78, 270, SK.easeInOut(bk)) + pocket * 40, SK.lerp(318, 560, SK.easeInOut(bk)) - pocket * 30, 1.7 * (1 - pocket * 0.7) + bk * 0.2);
    // the fox seller behind the table
    SK.animal(c, 'fox', 180, 336, 1.55, { t, pose: won ? 'cheer' : lost ? 'wave' : 'idle', expr: won ? 'laugh' : lost ? 'laugh' : 'happy', noShadow: true });
    // your three coins near you, sliding to the fox once the deal is sealed
    for (let i = 0; i < 3; i++) { const k = SK.clamp((e - 0.8 - i * 0.08) / 0.6, 0, 1) * (s.sealed ? 1 : 0), x0 = 160 + i * 30, y0 = 596 - (i % 2) * 6; B9.coin(c, SK.lerp(x0, 250 + i * 18, SK.easeInOut(k)), SK.lerp(y0, 350, SK.easeInOut(k)) - Math.sin(k * Math.PI) * 40, 13, k > 0 && k < 1 ? Math.cos(t * 14) : 1); }
    // the card, or the sealed scroll
    if (s.sealed) scroll(c, CARD[0], CARD[1], SK.clamp((e - 0.75) / 0.25, 0, 1), t);
    else {
      card(c, s.card.x, s.card.y, s.card.rot, t, { cross: s.stamp ? 0 : SK.clamp((he - 0.2) / 0.5, 0, 1), paw: s.thunk ? 1 : 0 });
      // the fox's paw resting on the far edge of the card, ready to pull it back
      if (!s.stamp && !s.flip) { const px = s.card.x + 60, py = s.card.y - 44 + Math.sin(t * 3) * 2; c.fillStyle = '#e8743a'; c.beginPath(); c.ellipse(px, py, 16, 12, 0, 0, TAU); c.fill(); c.strokeStyle = '#7a3418'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#fff2e0'; for (const dx of [-8, 0, 8]) { c.beginPath(); c.ellipse(px + dx, py + 7, 4, 3, 0, 0, TAU); c.fill(); } }
    }
    // the stamp: on your side of the table, then slammed onto the card
    const sk = s.stamp ? SK.clamp(e / 0.18, 0, 1) : 0, up = s.stamp && e > 0.3 ? SK.clamp((e - 0.3) / 0.3, 0, 1) : 0;
    if (!s.sealed) { const sx = SK.lerp(STAMP0[0], s.card.x + 2, s.stamp ? (up ? 1 - up : SK.easeOut(sk)) : 0), sy = SK.lerp(STAMP0[1], s.card.y + 4, s.stamp ? (up ? 1 - up : SK.easeOut(sk)) : 0) - Math.sin(sk * Math.PI) * 60 * (up ? 0 : 1); stampTool(c, sx, sy, sk); }
    else stampTool(c, STAMP0[0], STAMP0[1], 0);
    // your friend the duck, who leans in with a pencil to haggle
    const lean = s.stamp ? 0 : SK.clamp(he / 0.25, 0, 1) * (s.flip ? Math.max(0, 1 - (he - 0.75) * 3) : 1);
    SK.animal(c, 'duck', 318 - lean * 30, 612, 1.1, { t, pose: lean ? 'point' : 'idle', expr: lost ? 'wow' : won ? 'happy' : lean ? 'think' : 'happy', facing: -1 });
    if (lean > 0) { const px = SK.lerp(300, 214 + Math.sin(t * 30) * 6, lean), py = SK.lerp(560, CARD[1] + 4, lean); c.save(); c.translate(px, py); c.rotate(-0.7); c.scale(1.5, 1.5); c.fillStyle = '#f6c445'; c.fillRect(-4, -36, 8, 32); c.fillStyle = '#e8a0a0'; c.fillRect(-4, -42, 8, 7); c.fillStyle = '#f0d8b0'; c.beginPath(); c.moveTo(-4, -4); c.lineTo(4, -4); c.lineTo(0, 6); c.closePath(); c.fill(); c.restore(); }
    // level 2: the offer's sand timer
    if (g.level >= 2 && !g.done) { const k = SK.clamp(t / s.haggle, 0, 1), hx = 300, hy = 400; c.fillStyle = '#6a3a1e'; c.fillRect(hx - 14, hy - 30, 28, 5); c.fillRect(hx - 14, hy + 25, 28, 5); c.fillStyle = 'rgba(220,240,255,0.5)'; c.beginPath(); c.moveTo(hx - 11, hy - 25); c.lineTo(hx + 11, hy - 25); c.lineTo(hx + 2, hy); c.lineTo(hx + 11, hy + 25); c.lineTo(hx - 11, hy + 25); c.lineTo(hx - 2, hy); c.closePath(); c.fill(); c.fillStyle = '#f0c060'; c.beginPath(); c.moveTo(hx - 9 * (1 - k), hy - 24 + 22 * k); c.lineTo(hx + 9 * (1 - k), hy - 24 + 22 * k); c.lineTo(hx, hy); c.closePath(); c.fill(); c.beginPath(); c.moveTo(hx - 10 * k, hy + 24 - 20 * k); c.lineTo(hx + 10 * k, hy + 24 - 20 * k); c.lineTo(hx + 11, hy + 24); c.lineTo(hx - 11, hy + 24); c.closePath(); c.fill(); }
    if (!s.stamp && !g.done) SK.glow(c, g, STAMP0[0], STAMP0[1] - 24, 34);
    SK.demo(g, c, 'tap', [s.card.x - 6, s.card.y + 6], null, { delay: 1.0 });
  },
  auto(g, dt, synth) { SK.bot.tap(g, synth, 'stamp', 1.3, CARD[0], CARD[1]); },
});
