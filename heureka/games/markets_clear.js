// CLEAR STALL! (business MI-06) — the hedgehog's apple stall, a row of buyers in front, and a price tag on a pole. Slide
// the tag: a higher price brings more apples to the stall (it pays to grow and pick them) but sends buyers away; a lower
// price brings buyers but fewer apples. Let go when every apple sits above a buyer: they all trade and the curves draw
// themselves crossing at the tag. Too low: buyers wait empty-handed (a shortage). Too high: apples rot (a surplus).
// Each new market day brings a different crowd (more buyers: the price must rise). Level 2: three days, the last with fewer buyers.
const COLS = 6, CX = i => 42 + i * 40, COUNTER = 330, QUEUE = 474, TRACK = { x: 312, y0: 178, y1: 566 };
const KINDS = ['frog', 'duck', 'penguin', 'rabbit', 'bird', 'turtle'];
// each buyer's top price (willingness to pay) and each apple's cost to bring (0 = slider bottom, 1 = top)
const C = [0.06, 0.18, 0.3, 0.42, 0.74, 0.86]; // each apple's cost to bring
const BASE = { w: [0.94, 0.82, 0.7, 0.58, 0.32, 0.2], c: C }, MORE = { w: [1, 1, 1, 0.88, 0.62, 0.5], c: C }, FEWER = { w: [0.69, 0.57, 0.45, 0.33, 0.07, 0], c: C };
const LV = [[BASE, MORE], [MORE, BASE], [BASE, MORE, FEWER]]; // market days: each new day more (or fewer) buyers come
const pOfY = y => SK.clamp((TRACK.y1 - y) / (TRACK.y1 - TRACK.y0), 0, 1), yOfP = p => TRACK.y1 - p * (TRACK.y1 - TRACK.y0);
function paintMarket(o) {
  const sky = o.createLinearGradient(0, 0, 0, 420); sky.addColorStop(0, '#e8a0c0'); sky.addColorStop(0.55, '#f8c8d8'); sky.addColorStop(1, '#fff0e8'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
  P.hills(o, 360, 300, 40, '#b8d890', '#8ab868', { seed: 4 });
  const gr = o.createLinearGradient(0, 380, 0, 640); gr.addColorStop(0, '#d8b888'); gr.addColorStop(1, '#b89060'); o.fillStyle = gr; o.fillRect(0, 380, 360, 260);
  const rnd = P.rng(9); for (let i = 0; i < 70; i++) { o.fillStyle = rnd() < 0.5 ? 'rgba(120,80,40,0.18)' : 'rgba(255,240,210,0.3)'; o.beginPath(); o.ellipse(rnd() * 360, 390 + rnd() * 240, 3 + rnd() * 5, 1.5 + rnd() * 2, 0, 0, 7); o.fill(); }
  // the stall: posts, a striped awning, the back wall and the counter
  o.fillStyle = '#8a5a34'; o.fillRect(18, 160, 10, 230); o.fillRect(256, 160, 10, 230);
  o.fillStyle = '#f2e0c4'; o.fillRect(26, 190, 232, 150);
  for (let i = 0; i < 7; i++) { o.fillStyle = i % 2 ? '#fff6ea' : '#4aa06a'; o.beginPath(); o.moveTo(10 + i * 38, 150); o.lineTo(48 + i * 38, 150); o.lineTo(48 + i * 38, 186); o.quadraticCurveTo(29 + i * 38, 202, 10 + i * 38, 186); o.closePath(); o.fill(); }
  o.fillStyle = '#3a8058'; o.fillRect(6, 140, 272, 12);
  o.fillStyle = '#b87a48'; o.fillRect(14, COUNTER, 256, 18); o.fillStyle = '#9a6036'; o.fillRect(14, COUNTER + 18, 256, 52); o.strokeStyle = 'rgba(60,30,10,0.25)'; o.lineWidth = 2; for (let x = 40; x < 270; x += 36) { o.beginPath(); o.moveTo(x, COUNTER + 20); o.lineTo(x, COUNTER + 68); o.stroke(); }
  // the price pole and its track
  o.fillStyle = '#7a4a2a'; o.beginPath(); o.roundRect(TRACK.x - 5, TRACK.y0 - 16, 10, TRACK.y1 - TRACK.y0 + 50, 5); o.fill();
  o.fillStyle = 'rgba(255,255,255,0.25)'; o.fillRect(TRACK.x - 3, TRACK.y0 - 12, 3, TRACK.y1 - TRACK.y0 + 40);
  o.fillStyle = '#5a3a1a'; o.beginPath(); o.ellipse(TRACK.x, TRACK.y1 + 36, 26, 8, 0, 0, 7); o.fill();
}
function apple(c, x, y, r, rot = 0) {
  if (rot > 0) { c.fillStyle = P.mix('#e8403a', '#7a5a2a', Math.min(1, rot)); } else c.fillStyle = '#e8403a';
  c.beginPath(); c.arc(x - r * 0.35, y, r * 0.75, 0, 7); c.arc(x + r * 0.35, y, r * 0.75, 0, 7); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(x - r * 0.4, y - r * 0.3, r * 0.22, r * 0.14, -0.5, 0, 7); c.fill();
  c.strokeStyle = '#5a3a1a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x, y - r * 0.6); c.lineTo(x + 2, y - r * 1.05); c.stroke();
  c.fillStyle = rot > 0.5 ? '#8a8a40' : '#5ab050'; c.beginPath(); c.ellipse(x + 7, y - r * 0.95, 6, 3, -0.4, 0, 7); c.fill();
}
function priceTag(c, x, y, p, hot) { // a paper tag on the pole holding a little stack of coins (taller = pricier)
  c.save(); c.translate(x, y);
  c.fillStyle = 'rgba(40,20,40,0.25)'; c.beginPath(); c.roundRect(-30, -24, 66, 52, 10); c.fill();
  c.fillStyle = hot ? '#fff8d8' : '#fff2d8'; c.strokeStyle = '#7a4a2a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-36, 0); c.lineTo(-22, -24); c.lineTo(30, -24); c.lineTo(30, 24); c.lineTo(-22, 24); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#7a4a2a'; c.beginPath(); c.arc(-22, 0, 4, 0, 7); c.fill();
  const n = 1 + Math.round(p * 7); for (let i = 0; i < n; i++) B8.flatCoin(c, 6, 16 - i * 4.5, 13, 0);
  c.restore();
}
MG.add({
  id: 'clearstall', stage: 'markets', cmd: 'CLEAR STALL!', time: 6, mood: 'desert', winText: 'Equilibrium!', failText: 'Not cleared!', hold: 1.8,
  card: { title: 'The price that clears the market', kind: 'Economics', ref: 'Supply and demand: equilibrium',
    text: 'At a low price, lots of buyers want apples, but growers bring few, because picking them hardly pays. Buyers are left waiting. That is a shortage.\n\nAt a high price, growers bring lots of apples, but most buyers walk away. Apples are left to rot. That is a surplus.\n\nIn between is one price where the number of apples buyers want matches the number growers bring. Every apple sells and nobody waits. Economists call it the equilibrium price. When more buyers arrive, that price rises.',
    note: 'A market clears at the price where buyers want as much as sellers bring.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level);
    s.days = LV[L]; s.day = 0; s.V = s.days[0]; s.p = g.rand() < 0.5 ? 0.08 : 0.92; if (L === 0) s.p = 0.08; s.moved = 0; s.held = false; s.doneP = null; s.res = null;
    s.vis = { a: [0, 0, 0, 0, 0, 0], b: [1, 1, 1, 1, 1, 1] }; // smooth in/out of apples and buyers
  },
  counts(g, p) { const s = g.s; const b = s.V.w.map(w => w >= p), a = s.V.c.map(c => c <= p); return { a, b, na: a.filter(Boolean).length, nb: b.filter(Boolean).length }; },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.res) return; if (Math.abs(x - TRACK.x) < 60 && y > TRACK.y0 - 50 && y < TRACK.y1 + 50) { s.held = true; s.lastY = y; s.p = pOfY(y); g.sfx('click'); } },
  move(g, x, y) { const s = g.s; if (!s.held || s.res) return; s.moved += Math.abs(y - s.lastY); s.lastY = y; const np = pOfY(y); if (Math.round(np * 12) !== Math.round(s.p * 12)) g.sfx('tap'); s.p = np; },
  up(g) {
    const s = g.s; if (!s.held || s.res) return; s.held = false; if (s.moved < 12) return; // a tap without a slide does nothing
    const k = this.counts(g, s.p); s.res = { t: g.t, ...k, ok: k.na === k.nb, a: k.a.slice(), b: k.b.slice() };
    g.sfx(s.res.ok ? 'coin' : 'wrong');
  },
  update(g, dt) {
    const s = g.s, k = s.res || this.counts(g, s.p);
    for (let i = 0; i < COLS; i++) { s.vis.a[i] += ((k.a[i] ? 1 : 0) - s.vis.a[i]) * Math.min(1, dt * 8); s.vis.b[i] += ((k.b[i] ? 1 : 0) - s.vis.b[i]) * Math.min(1, dt * 6); }
    if (s.res && s.res.ok && s.day < s.days.length - 1 && g.t > s.res.t + 1.1) { // the next market day: new apples, and a different crowd
      s.day++; s.V = s.days[s.day]; s.res = null; s.moved = 0; s.vis.a = s.vis.a.map(() => 0); s.vis.b = s.vis.b.map(() => 0); s.dayT = g.t; g.sfx('bell'); return; }
    if (s.res && !g.done && g.t > s.res.t + 0.55 && !(s.res.ok && s.day < s.days.length - 1)) { if (s.res.ok) { g.win(); g.sfx('cheer'); g.burst(150, 400, ['#ff6a6a', '#ffe27a', '#fff6ea'], 22, 200); } else { g.fail(); g.sfx(s.res.na < s.res.nb ? 'fail' : 'buzz'); } }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', R = s.res;
    c.drawImage(g.bake('b8clear_m', paintMarket), 0, 0, 360, 640);
    const k = R || this.counts(g, s.p), rk = R ? SK.clamp((t - R.t) / 0.5, 0, 1) : 0;
    // the hedgehog grower behind the counter
    SK.animal(c, 'hedgehog', 140, COUNTER + 4, 1.0, { t, pose: won ? 'cheer' : lost && R.na > R.nb ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? (R.na > R.nb ? 'sad' : 'wow') : 'happy' });
    // the buyers in front: those whose top price is below the tag walk away
    // in pairs: apple i over buyer i; apples are brought from the cheapest up (left first), buyers keen first (left first)
    const matched = i => k.a[i] && k.b[i] && (R ? true : true);
    for (let i = COLS - 1; i >= 0; i--) {
      const v = s.vis.b[i]; if (v < 0.02) continue; const x = CX(i) + (1 - v) * 80 * (i % 2 ? 1 : -1) * 0 + (1 - v) * 120, al = v;
      const has = R && rk > 0.5 && matched(i), sadW = R && !k.a[i] && k.b[i];
      c.save(); c.globalAlpha = al;
      SK.animal(c, KINDS[i], x, QUEUE + (i % 2) * 22, 0.74, { t, phase: i, pose: has && won ? 'cheer' : sadW && rk > 0.5 ? 'sad' : v < 0.95 ? 'walk' : 'idle', expr: has ? 'laugh' : sadW && rk > 0.5 ? 'sad' : 'happy', facing: v < 0.95 ? 1 : 1,
        hold: has ? (h => apple(h, 0, -2, 9)) : null });
      c.restore();
      if (sadW && rk > 0.5) { c.save(); c.globalAlpha = Math.min(1, (rk - 0.5) * 3); c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.ellipse(x + 14, QUEUE + (i % 2) * 22 - 78, 13, 13, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#3a1640'; c.font = '900 18px Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', x + 14, QUEUE + (i % 2) * 22 - 77); c.restore(); }
    }
    // the apples on the counter: grown and brought only when the price covers their cost
    for (let i = 0; i < COLS; i++) {
      const v = s.vis.a[i]; if (v < 0.02) continue; const flying = R && matched(i) && rk > 0;
      const rot = R && k.a[i] && !k.b[i] ? SK.clamp((t - R.t) * 1.5, 0, 1) : 0;
      if (flying && rk > 0.5) continue; // now held by its buyer
      const ax = flying ? SK.lerp(CX(i), CX(i) + 4, rk * 2) : CX(i), ay = flying ? SK.lerp(COUNTER - 6, QUEUE - 40, rk * 2) : COUNTER - 6 - (1 - v) * 30;
      c.save(); c.globalAlpha = v; apple(c, ax, ay, 17, rot); c.restore();
      if (rot > 0.3) for (let f = 0; f < 2; f++) { const a = t * 9 + f * 3 + i; c.fillStyle = '#2a2430'; c.beginPath(); c.arc(ax + Math.cos(a) * 14, ay - 14 + Math.sin(a * 1.3) * 8, 2.2, 0, 7); c.fill(); }
    }
    // the price tag on its pole
    const ty = yOfP(s.p);
    if (!R) SK.glow(c, g, TRACK.x + 2, ty, 34);
    priceTag(c, TRACK.x + 4, ty, s.p, s.held);
    // on a win, the buyers' and growers' curves draw themselves and cross at the tag
    if (R && R.ok) { const q = SK.clamp((t - R.t - 0.3) * 2, 0, 1); c.save(); c.lineWidth = 5; c.lineCap = 'round';
      c.strokeStyle = '#3a78d8'; c.beginPath(); c.moveTo(TRACK.x - 60, ty - 60); c.lineTo(SK.lerp(TRACK.x - 60, TRACK.x + 40, q), SK.lerp(ty - 60, ty + 40, q)); c.stroke();
      c.strokeStyle = '#e8403a'; c.beginPath(); c.moveTo(TRACK.x - 60, ty + 60); c.lineTo(SK.lerp(TRACK.x - 60, TRACK.x + 40, q), SK.lerp(ty + 60, ty - 40, q)); c.stroke(); c.restore(); }
    // guidance: slide the tag up from the bottom
    SK.demo(g, c, 'drag', [TRACK.x + 4, yOfP(s.p)], [TRACK.x + 4, yOfP(0.5)], { delay: 0.8, period: 2 });
  },
  auto(g, dt, synth) {
    const s = g.s; if (s.res) return; const t0 = s.day ? s.dayT + 0.6 : 1.0;
    // the bot aims at the middle of the band where apples and buyers match (at the time it lets go)
    let lo = null, hi = null; for (let p = 0; p <= 1.0001; p += 0.01) { const k = this.counts(g, p); if (k.na === k.nb) { if (lo == null) lo = p; hi = p; } }
    if (s._b8d !== s.day) { s._b8d = s.day; s._b8a = yOfP(s.p); } const target = yOfP(((lo ?? 0.5) + (hi ?? 0.5)) / 2);
    SK.bot.drag(g, synth, 'slide' + s.day, t0, [TRACK.x + 4, s._b8a], [TRACK.x + 4, target], 0.5);
  },
});
