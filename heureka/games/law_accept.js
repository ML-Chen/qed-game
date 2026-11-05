// ACCEPT! (law LW-01) — the fox slides offer cards across the table one after another (its bike for three coins, a
// kite for two, a ball for four). Your paw stamp swings back and forth above the table: tap to drop it onto each card
// as it stands, and the card rolls into a sealed scroll while the goods and the coins swap sides (a contract). Dawdle
// and your friend the duck leans in with a pencil and crosses out a coin: that changed card is a counteroffer, it flips
// round to face the fox, and the fox keeps its goods.
const TAU = Math.PI * 2, CY = 456, SY = 368;
const OFFERS = [{ item: 'bike', coins: 3, x: 132 }, { item: 'kite', coins: 2, x: 232 }, { item: 'ball', coins: 4, x: 160 }];
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
function goods(c, kind, x, y, s = 1) {
  if (kind === 'bike') return bike(c, x, y, s);
  c.save(); c.translate(x, y); c.scale(s, s);
  if (kind === 'kite') { c.fillStyle = '#e84a6a'; c.beginPath(); c.moveTo(0, -24); c.lineTo(16, -4); c.lineTo(0, 16); c.lineTo(-16, -4); c.closePath(); c.fill(); c.fillStyle = '#f6c445'; c.beginPath(); c.moveTo(0, -24); c.lineTo(16, -4); c.lineTo(0, -4); c.closePath(); c.fill(); c.beginPath(); c.moveTo(0, 16); c.lineTo(-16, -4); c.lineTo(0, -4); c.closePath(); c.fill(); c.strokeStyle = '#5a3a5a'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 16); c.quadraticCurveTo(8, 22, 2, 28); c.quadraticCurveTo(-6, 32, 2, 36); c.stroke(); }
  else { const gr = c.createRadialGradient(-5, -6, 2, 0, 0, 16); gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#d8e8f8'); c.fillStyle = gr; c.beginPath(); c.arc(0, 0, 16, 0, TAU); c.fill(); for (const [col, a] of [['#e84a4a', 0], ['#4a8ae8', 2.1], ['#f6c445', 4.2]]) { c.fillStyle = col; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 16, a, a + 1.05); c.closePath(); c.fill(); } c.strokeStyle = '#5a4a6a'; c.lineWidth = 1.5; c.beginPath(); c.arc(0, 0, 16, 0, TAU); c.stroke(); }
  c.restore();
}
// the offer card: goods -> coins (one crossed out when o.cross reaches 1); o.paw shows the stamped paw-print
function card(c, x, y, rot, t, of, o = {}) {
  c.save(); c.translate(x, y); c.rotate(rot); const w = 168, h = 96;
  c.fillStyle = 'rgba(30,10,20,0.3)'; c.beginPath(); c.roundRect(-w / 2 + 4, -h / 2 + 7, w, h, 10); c.fill();
  c.fillStyle = '#fff6e0'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 10); c.fill(); c.strokeStyle = '#c8a070'; c.lineWidth = 3; c.stroke();
  c.strokeStyle = 'rgba(200,160,112,0.5)'; c.lineWidth = 1.5; c.beginPath(); c.roundRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12, 7); c.stroke();
  goods(c, of.item, -46, of.item === 'bike' ? 10 : 0, of.item === 'bike' ? 0.95 : 1.1);
  c.strokeStyle = '#8a5a4a'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(-10, -2); c.lineTo(12, -2); c.moveTo(4, -9); c.lineTo(12, -2); c.lineTo(4, 5); c.stroke();
  const pos = []; for (let i = 0; i < of.coins; i++) pos.push([32 + (i % 2) * 20, -22 + Math.floor(i / 2) * 22 + (of.coins === 3 && i === 2 ? 0 : 0)]);
  for (const [px, py] of pos) B9.coin(c, px, py, 10);
  if (o.cross > 0) { const k = SK.clamp(o.cross, 0, 1), [cx, cy] = pos[pos.length - 1]; c.strokeStyle = '#2a2a6a'; c.lineWidth = 4; c.beginPath(); c.moveTo(cx - 12, cy - 12); c.lineTo(cx - 12 + 24 * Math.min(1, k * 2), cy - 12 + 24 * Math.min(1, k * 2)); if (k > 0.5) { c.moveTo(cx + 12, cy - 12); c.lineTo(cx + 12 - 24 * (k - 0.5) * 2, cy - 12 + 24 * (k - 0.5) * 2); } c.stroke(); }
  if (o.paw) { c.save(); c.translate(o.paw - x, 18); c.rotate(-0.2); c.fillStyle = 'rgba(210,40,60,0.85)'; c.beginPath(); c.ellipse(0, 6, 13, 10, 0, 0, TAU); c.fill(); for (const [px, py] of [[-12, -8], [-4, -14], [5, -14], [13, -8]]) { c.beginPath(); c.ellipse(px, py, 4.5, 5.5, 0, 0, TAU); c.fill(); } c.restore(); }
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
  id: 'acceptoffer', stage: 'law', cmd: 'STAMP YES ON EACH OFFER!', time: 6, mood: 'desert', winText: 'Deal done!', failText: 'Counteroffer!',
  card: { title: 'Say yes to the offer as it stands', kind: 'Law', ref: 'Offer and acceptance; counteroffers',
    text: 'An offer is a promise that waits for a yes. When you accept it exactly as it stands, a contract forms: here, a bike for three coins. Each side gives something of value, which the law calls consideration.\n\nA reply that changes the deal doesn\'t accept it. Crossing out a coin made a counteroffer: it turns down the first offer and makes a new one, which the seller is free to refuse. Until you accept, the seller can also take an offer back.\n\nGeneral information about US law, not legal advice.',
    note: 'A contract forms when an offer is accepted as it stands; changing the terms makes a counteroffer instead.' },
  init(g) {
    const s = g.s; s.i = 0; s.ph = 'slide'; s.at = 0.15; s.sx = 180; s.sa = -1.2; s.drop = 0; s.prints = []; s.done = [];
    s.spd = [1.9, 2.3, 3.1][Math.min(2, g.level)]; s.wait = SK.clamp(0.3 * g.dur, 2.0, 6);
    s.card = { x: OFFERS[0].x, y: 300, rot: 0 };
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.drop || s.ph === 'seal' || s.ph === 'haggle') return; s.drop = g.t; s.dx = s.sx; g.sfx('whoosh'); },
  update(g, dt) {
    const s = g.s, t = g.t, of = OFFERS[s.i];
    if (!s.drop) { s.sa += dt * s.spd; s.sx = 180 + 128 * Math.sin(s.sa); }
    // the stamp lands 0.18 s after the tap, then lifts again
    if (s.drop && !s.hit && t - s.drop >= 0.18) {
      s.hit = true; g.shake(3, 0.12);
      if (of && (s.ph === 'wait' || s.ph === 'slide') && Math.abs(s.dx - s.card.x) < 58 && Math.abs(s.card.y - CY) < 40) { s.ph = 'seal'; s.at = t; s.pawX = s.dx; g.sfx('thud'); g.sfx('stretch'); g.burst(s.dx, CY + 10, ['#e84058', '#fff6ea'], 12, 140); }
      else { s.prints.push({ x: s.dx, t }); g.sfx('thud'); g.sfx('wrong'); }
    }
    if (s.drop && t - s.drop > 0.5) { s.drop = 0; s.hit = false; }
    if (!of) return;
    const e = t - s.at;
    if (s.ph === 'slide') { const k = SK.easeOut(e / 0.5); s.card.x = of.x; s.card.y = SK.lerp(300, CY, k); s.card.rot = 0; if (e >= 0.5) { s.ph = 'wait'; s.at = t; } }
    else if (s.ph === 'wait') { if (e > s.wait) { s.ph = 'haggle'; s.at = t; } }
    else if (s.ph === 'haggle') { if (e > 0.25 && !s.scrib) { s.scrib = true; g.sfx('sweep'); } if (e > 0.75) { const k = SK.easeInOut((e - 0.75) / 0.5); s.card.rot = Math.PI * k; s.card.y = SK.lerp(CY, 360, k); } if (e > 1.4 && !g.done) { g.sfx('laugh'); g.fail(); } }
    else if (s.ph === 'seal') {
      if (e > 0.35 && !s.sealed) { s.sealed = true; g.sfx('magic'); g.sfx('coin'); }
      if (e > 0.85) { s.done.push({ i: s.i, t }); s.i++; s.sealed = false; if (s.i >= OFFERS.length) { s.ph = 'end'; if (!g.done) { g.win(); g.sfx('cheer'); } } else { s.ph = 'slide'; s.at = t; s.card = { x: OFFERS[s.i].x, y: 300, rot: 0 }; g.sfx('swoosh'); } }
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, e = t - s.at, of = OFFERS[s.i];
    c.drawImage(g.bake('acceptoffer', paintTable), 0, 0, 360, 640);
    const won = g.result === 'win', lost = g.result === 'fail';
    // goods still for sale wait on the fox's side; bought ones sit on yours
    OFFERS.forEach((o, i) => { const d = s.done.find(q => q.i === i), mine = i < s.i || (i === s.i && s.ph === 'seal' && s.sealed); const k = d ? SK.clamp((t - d.t + 0.5) / 0.5, 0, 1) : mine ? SK.clamp((e - 0.35) / 0.5, 0, 1) : 0; if (i === s.i && lost) return; goods(c, o.item, SK.lerp(40 + i * 26, 50 + i * 60, SK.easeInOut(k)), SK.lerp(312 - i * 6, 590, SK.easeInOut(k)), o.item === 'bike' ? 1.2 : 1.1); });
    SK.animal(c, 'fox', 190, 336, 1.45, { t, pose: won ? 'cheer' : lost ? 'wave' : 'idle', expr: won || lost ? 'laugh' : 'happy', noShadow: true });
    // sealed scrolls pile up at the side
    s.done.forEach((d, k) => scroll(c, 236, 566 - k * 26, Math.min(1, (t - d.t) / 0.2) * 0.55, t));
    // the current card (or the scroll it rolls into)
    if (of && s.ph !== 'end') {
      if (s.ph === 'seal' && s.sealed) scroll(c, SK.lerp(s.card.x, 236, SK.clamp((e - 0.5) / 0.35, 0, 1)), SK.lerp(CY, 566 - s.done.length * 26, SK.clamp((e - 0.5) / 0.35, 0, 1)), 1 - SK.clamp((e - 0.5) / 0.35, 0, 1) * 0.45, t);
      else card(c, s.card.x, s.card.y, s.card.rot, t, of, { cross: s.ph === 'haggle' ? SK.clamp((e - 0.2) / 0.5, 0, 1) : 0, paw: s.ph === 'seal' ? s.pawX : 0 });
      if (s.ph === 'slide' || s.ph === 'wait') { const px = s.card.x + 62, py = s.card.y - 44 + Math.sin(t * 3) * 2; c.fillStyle = '#e8743a'; c.beginPath(); c.ellipse(px, py, 16, 12, 0, 0, TAU); c.fill(); c.strokeStyle = '#7a3418'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#fff2e0'; for (const dx of [-8, 0, 8]) { c.beginPath(); c.ellipse(px + dx, py + 7, 4, 3, 0, 0, TAU); c.fill(); } }
    }
    // missed stamps leave paw-prints on the wood
    for (const p of s.prints) { c.save(); c.globalAlpha = 0.5; c.translate(p.x, CY + 18); c.fillStyle = '#c8203a'; c.beginPath(); c.ellipse(0, 6, 12, 9, 0, 0, TAU); c.fill(); for (const [px, py] of [[-11, -7], [-4, -12], [4, -12], [11, -7]]) { c.beginPath(); c.ellipse(px, py, 4, 5, 0, 0, TAU); c.fill(); } c.restore(); }
    // the swinging stamp: a dashed drop line shows where it would land
    const dk = s.drop ? SK.clamp((t - s.drop) / 0.18, 0, 1) * (t - s.drop < 0.3 ? 1 : 1 - SK.clamp((t - s.drop - 0.3) / 0.2, 0, 1)) : 0, sx = s.drop ? s.dx : s.sx;
    if (!s.drop && !g.done) { c.save(); c.strokeStyle = 'rgba(255,246,234,0.35)'; c.lineWidth = 2; c.setLineDash([4, 6]); c.beginPath(); c.moveTo(sx, SY + 26); c.lineTo(sx, CY + 20); c.stroke(); c.restore(); }
    stampTool(c, sx, SK.lerp(SY, CY + 4, SK.easeOut(dk)), dk);
    // your friend the duck, who leans in with a pencil to haggle
    // the duck's pencil creeps toward the card while you wait (a visible clock), then crosses out a coin
    const lean = s.ph === 'wait' ? 0.55 * SK.clamp(e / s.wait, 0, 1) : s.ph === 'haggle' ? SK.clamp(0.55 + e / 0.25 * 0.45, 0, 1) * Math.max(0, 1 - Math.max(0, e - 0.75) * 3) : 0;
    SK.animal(c, 'duck', 318 - lean * 30, 616, 1.0, { t, pose: lean ? 'point' : 'idle', expr: lost ? 'wow' : won ? 'happy' : lean ? 'think' : 'happy', facing: -1 });
    if (lean > 0) { const px = SK.lerp(300, s.card.x + 48 + Math.sin(t * 30) * 6, lean), py = SK.lerp(560, CY + 10, lean); c.save(); c.translate(px, py); c.rotate(-0.7); c.scale(1.5, 1.5); c.fillStyle = '#f6c445'; c.fillRect(-4, -36, 8, 32); c.fillStyle = '#e8a0a0'; c.fillRect(-4, -42, 8, 7); c.fillStyle = '#f0d8b0'; c.beginPath(); c.moveTo(-4, -4); c.lineTo(4, -4); c.lineTo(0, 6); c.closePath(); c.fill(); c.restore(); }
    // your coins: they hop over to the fox with each deal
    if (s.ph === 'seal' && s.sealed && of) for (let i = 0; i < of.coins; i++) { const k = SK.clamp((e - 0.35 - i * 0.06) / 0.45, 0, 1); if (k < 1) B9.coin(c, SK.lerp(150 + i * 20, 230 + i * 16, k), SK.lerp(600, 350, k) - Math.sin(k * Math.PI) * 40, 11, Math.cos(t * 14)); }
    // labels: the seller, the offer (or what the duck turned it into), your stamp
    SK.tag(c, 'Seller', 252, 214, 18);
    if (of && s.ph !== 'end' && !(s.ph === 'seal' && s.sealed)) { const counter = s.ph === 'haggle' && e > 0.6; SK.tag(c, counter ? 'Counteroffer' : 'Offer', s.card.x, s.card.y + (counter ? 62 : -66), 18, counter ? '#ffd0d0' : '#fff6ea'); }
    if (s.ph === 'seal' && s.sealed) SK.tag(c, 'Contract', 236, 520 - s.done.length * 26, 18, '#ffe9a0');
    if (!s.done.length && s.ph !== 'seal') { const lx = s.drop ? s.dx : s.sx; SK.tag(c, 'Your stamp', lx + (lx < 180 ? 74 : -74), SY - 16, 18); }
    if (of && s.ph === 'wait' && !s.drop) SK.glow(c, g, s.card.x, CY, 50);
    if (of && (s.ph === 'wait' || s.ph === 'slide')) SK.demo(g, c, 'tap', [s.card.x, CY + 20], null, { delay: 1.0 });
  },
  // the bot taps when the swinging stamp is about to pass over the card
  auto(g, dt, synth) {
    const s = g.s, of = OFFERS[s.i]; if (!of || g.done || s.drop || (s.ph !== 'wait' && s.ph !== 'slide') || g.t < 1.0 || s.ph === 'slide' && g.t - s.at < 0.35) return;
    if (Math.abs(s.sx - s.card.x) < 22) synth('down', 180, 560), synth('up', 180, 560);
  },
});
