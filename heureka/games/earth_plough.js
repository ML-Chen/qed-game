// PLOUGH! (earth EE MSE-01) — a wedge of cold blue air beside warm, damp orange air over a town. Drag the cold air along
// the ground into the warm air: being heavier, it slides underneath like a snowplough and shoves the warm air up, the
// rising damp air builds a towering storm cloud, and rain pours on the town. Lift the cold air over the top instead and
// it sinks straight back down with a thud (heavy air does not float on light air).
// A second cold front then comes from the other side. Level 2: three fronts, and the town is further away.
const PO_G = 520, PO_L = [{ f0: 120, xt: 236 }, { f0: 120, xt: 250 }, { f0: 104, xt: 290 }];
function poPaint(o) {
  B5.vgrad(o, 0, 0, 360, PO_G, ['#6f8cb8', '#a8b8cc', '#e8d6b0', '#f4c890']);
  o.fillStyle = '#9aac88'; o.beginPath(); o.moveTo(0, PO_G); for (let x = 0; x <= 360; x += 8) o.lineTo(x, PO_G - 34 - 16 * Math.sin(x / 44 + 1) - 8 * Math.sin(x / 17)); o.lineTo(360, PO_G); o.fill();
  B5.vgrad(o, 0, PO_G, 360, 120, ['#8ab860', '#6a9a48', '#4e7a38']);
  P.grassTufts(o, 360, PO_G + 8, 610, 36, '#7ab450', 3);
  // the town: little houses on the right
  const hs = [[214, 0.55, '#f0d2a0'], [252, 0.7, '#f6e0c0'], [292, 0.6, '#ecc898'], [330, 0.66, '#f2dcb4']];
  for (const [x, sc] of hs) B5.cottage(o, x, PO_G + 4, sc);
  P.grain(o, 360, 640, 0.035);
}
// the cold air's outline: a long low wedge whose steep nose is at x = f; lift raises it off the ground
function poWedge(c, f, lift) {
  const G = PO_G - lift; c.beginPath(); c.moveTo(-20, G); c.lineTo(f - 6, G); c.quadraticCurveTo(f + 12, G - 8, f + 2, G - 44);
  c.quadraticCurveTo(f - 18, G - 92, f - 90, G - 116); c.quadraticCurveTo(f - 160, G - 136, -20, G - 150); c.closePath();
}
MG.add({
  id: 'plough', stage: 'earth', cmd: 'PUSH COLD AIR UNDER WARM AIR!', time: 6, mood: 'storm', winText: 'Cold front!', failText: 'Thud!',
  card: { title: 'Cold fronts make storms', kind: 'Earth science', ref: 'Cold front and frontal lifting',
    text: 'Cold air is denser than warm air, so it is heavier for its size. When a mass of cold air moves into warm air, it does not climb over. It slides along the ground underneath and pushes the warm air up, like a snowplough. This moving edge is called a cold front.\n\nAs the warm, damp air rises, it cools. Its water vapour turns into tiny droplets, which build a tall cloud. If the air is lifted fast, the cloud grows into a thunderstorm with heavy rain.',
    note: 'Heavy cold air pushes under warm air and lifts it, and rising damp air makes storm clouds.' },
  init(g) {
    const s = g.s, v = SK.variant(g, 4), L0 = PO_L[Math.min(2, g.level)], L = { f0: L0.f0, xt: L0.xt + (v >> 1) * 14 }; s.L = L; s.v = v; s.f = L.f0; s.lift = 0; s.push = L.f0; s.drop = 0; s.dropV = 0; s.stormT = 0; s.grab = null;
    const d0 = v % 2 ? -1 : 1; s.dirs = g.level >= 2 ? [d0, -d0, d0] : [d0, -d0]; s.k = 0; s.resetT = 0; // variants: which side the first front comes from, how far the town is; each front comes from a new side
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.drop || s.stormT) return; x = s.dirs[s.k] < 0 ? 360 - x : x; if (x < s.f + 40 && y > PO_G - 190 - s.lift && y < PO_G + 40) { s.grab = { dx: s.f - x, y0: y }; g.sfx('wind'); } },
  move(g, x, y) {
    const s = g.s, G = s.grab; if (!G || g.done) return; x = s.dirs[s.k] < 0 ? 360 - x : x;
    s.f = SK.clamp(Math.max(s.f, x + G.dx), s.L.f0, 350);
    s.lift = SK.clamp((PO_G - 150) - y, 0, 220); // a finger well above the wedge lifts the cold air off the ground
  },
  up(g) { const s = g.s; s.grab = null; },
  update(g, dt) {
    const s = g.s, L = s.L;
    if (s.drop) { s.dropV += 1400 * dt; s.lift = Math.max(0, s.lift - s.dropV * dt); if (!s.lift && !s.thud) { s.thud = g.t; g.sfx('thud'); g.sfx('laugh'); g.shake(6, 0.35); g.burst(s.f - 40, PO_G - 10, ['#bfe4ff', '#ffffff', '#8ac0ec'], 16, 160); g.fail(); } return; }
    if (s.stormT && !g.done && g.t - s.stormT > 1.1) { s.k++; s.f = s.push = L.f0; s.lift = 0; s.stormT = 0; s.resetT = g.t; g.sfx('wind'); }
    if (g.done || s.stormT) return;
    // lifted over the warm air: the heavy air will not stay up there, and drops
    if (s.lift > 40 && s.f > L.f0 + 30) { s.drop = g.t; s.grab = null; s.dropV = 0; g.sfx('whoosh'); return; }
    if (!s.lift) s.push = Math.max(s.push, s.f);
    if (!s.grab && s.lift) s.lift = Math.max(0, s.lift - 400 * dt); // let go up high over its own side: it settles back
    if (!s.lift && s.f >= L.xt && !s.stormT) { s.stormT = g.t; s.grab = null; g.sfx('thunder'); g.sfx('rain'); g.shake(4, 0.3); if (s.k >= s.dirs.length - 1) g.win(); }
  },
  draw(g, c) {
    const s = g.s, L = s.L, t = g.t, f = s.f, p = SK.clamp((s.push - L.f0) / (L.xt - L.f0), 0, 1), storm = s.stormT ? Math.min(1, (t - s.stormT) * 2) : 0;
    c.save(); if (s.dirs[s.k] < 0) { c.translate(360, 0); c.scale(-1, 1); } // the second front comes from the right
    c.drawImage(g.bake('plough_bg', poPaint), 0, 0, 360, 640);
    c.fillStyle = `rgba(40,40,70,${0.3 * p + 0.2 * storm})`; c.fillRect(0, 0, 360, 640);
    // the warm, damp air: an orange haze over the town, pushed up into a rising column at the cold air's nose
    c.save(); const wg = c.createLinearGradient(0, 300, 0, PO_G); wg.addColorStop(0, 'rgba(255,150,80,0)'); wg.addColorStop(0.4, 'rgba(255,150,80,0.32)'); wg.addColorStop(1, 'rgba(255,170,90,0.5)');
    c.fillStyle = wg; c.beginPath(); c.moveTo(f - 10, PO_G); c.lineTo(370, PO_G); c.lineTo(370, 330); c.quadraticCurveTo(f + 80, 320 - p * 60, f + 10, 300 - p * 120); c.quadraticCurveTo(f - 30, 360, f - 10, PO_G); c.fill(); c.strokeStyle = 'rgba(255,140,60,0.8)'; c.lineWidth = 3; c.setLineDash([8, 6]); c.stroke(); c.setLineDash([]);
    // little warm parcels riding up the cold air's slope
    for (let i = 0; i < 9; i++) { const q = (t * 0.5 + i / 9) % 1, x = f + 70 - q * 80 + Math.sin(i * 3 + t * 2) * 6, y = PO_G - 30 - q * (140 + p * 140); c.globalAlpha = Math.sin(q * Math.PI) * (0.4 + 0.5 * p);
      c.fillStyle = '#ffb070'; c.beginPath(); c.arc(x, y, 6 + q * 4, 0, 7); c.fill(); c.strokeStyle = '#ff8a40'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y + 10); c.lineTo(x, y - 6); c.lineTo(x - 4, y - 2); c.moveTo(x, y - 6); c.lineTo(x + 4, y - 2); c.stroke(); }
    c.restore();
    // the cloud above the nose grows into a tall thunderhead as the warm air is lifted
    const ch = 0.2 + p * 0.8, cx = Math.min(s.push + 30, 268), top = 300 - 150 * ch;
    c.save(); c.translate(cx, top + 6); c.scale(1.9, 0.55); P.cloud(c, 0, 0, 0.55 * ch + 0.1, '#f4f2f6', '#aeb0c8', SK.clamp((ch - 0.5) * 3, 0, 1)); c.restore(); // the anvil top
    for (let i = 3; i >= 0; i--) { const k = i / 3, y = 300 - k * (300 - top - 20); if (i && k > ch + 0.1) continue; P.cloud(c, cx + Math.sin(i * 2.1) * 8, y, 0.5 + 0.28 * ch - i * 0.05, i < 1 ? '#b8bace' : '#eeecf4', i < 1 ? '#5a5a7a' : '#a8a4c0', 0.96); }
    if (storm) { c.save(); c.globalAlpha = storm; c.beginPath(); c.rect(cx - 110, 320, 220, PO_G - 320); c.clip(); P.rain(c, 360, 640, t, 90, 'rgba(210,225,255,0.7)', -0.12); c.restore();
      if ((t - s.stormT) % 0.9 < 0.12) { c.fillStyle = 'rgba(255,255,230,0.35)'; c.fillRect(0, 0, 360, 640); c.strokeStyle = '#fff8c0'; c.lineWidth = 4; c.lineJoin = 'round'; c.beginPath(); c.moveTo(cx, 330); c.lineTo(cx - 14, 380); c.lineTo(cx + 6, 390); c.lineTo(cx - 10, 450); c.stroke(); } }
    // the cold air: a frosty blue wedge with swirls
    const lift = s.lift, wob = s.drop ? 0 : Math.sin(t * 3) * 2;
    c.save(); poWedge(c, f + wob, lift); const cg = c.createLinearGradient(0, PO_G - 150 - lift, 0, PO_G - lift); cg.addColorStop(0, 'rgba(150,200,255,0.75)'); cg.addColorStop(1, 'rgba(70,130,220,0.85)'); c.fillStyle = cg; c.fill();
    c.strokeStyle = 'rgba(235,248,255,0.95)'; c.lineWidth = 4; c.stroke(); c.clip();
    c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 3; for (let i = 0; i < 6; i++) { const x = ((i * 70 + t * 30) % 420) - 60, y = PO_G - lift - 30 - (i % 3) * 30; c.beginPath(); c.arc(x, y, 14, Math.PI * 0.2, Math.PI * 1.6); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 14; i++) B5.star(c, (i * 47) % (f + 10), PO_G - lift - 20 - (i * 29) % 110, 3 + (i % 3));
    c.restore();
    if (s.thud) { c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(f - 40, PO_G - 4, 60 * Math.min(1, (t - s.thud) * 4), 6, 0, 0, 7); c.fill(); }
    // the penguin rides the cold air
    const won = g.result === 'win', lost = g.result === 'fail', px = Math.max(30, f - 120);
    SK.animal(c, 'penguin', px, PO_G - lift - 112 + 18 * SK.clamp((px - (f - 160)) / 160, -1, 1) * 0 , 0.62, { t, noShadow: true, pose: won ? 'cheer' : lost ? 'sad' : s.grab ? 'balance' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
    // what moves (the cold air's nose), where it goes (the town under the warm air), and the way there
    if (!s.stormT && !s.drop) B5.hint(c, g, [f - 30, PO_G - 50], [L.xt + 10, PO_G - 40], { ra: 30, rb: 30 });
    SK.demo(g, c, 'drag', [s.f - 30, PO_G - 40], [L.xt - 10, PO_G - 40], { never: !!s.stormT });
    c.restore();
    // labels, drawn unmirrored
    const mx = x => s.dirs[s.k] < 0 ? 360 - x : x;
    if (!s.drop && !g.done) { SK.tag(c, 'Cold air', mx(Math.max(64, s.f - 100)), PO_G - s.lift - 40, 18); SK.tag(c, 'Warm air', mx(Math.min(300, Math.max(s.f + 90, 240))), 372, 18, '#fff6ea', 'rgba(170,70,20,0.78)'); }
    // how many cold fronts are done, so the reset after the first storm reads as "next one", not "start again"
    G2.count(c, 60, 44, s.k + (s.stormT || g.result === 'win' ? 1 : 0), s.dirs.length);
    if (s.resetT && t - s.resetT < 0.35) { c.fillStyle = `rgba(20,20,40,${0.6 * (1 - (t - s.resetT) / 0.35)})`; c.fillRect(0, 0, 360, 640); }
  },
  auto(g, dt, synth) { const s = g.s, L = s.L, m = x => s.dirs[s.k] < 0 ? 360 - x : x; if (s.stormT) return;
    SK.bot.drag(g, synth, 'push' + s.k, s.k ? s.resetT + 0.2 : 1.0, [m(L.f0 - 30), PO_G - 40], [m(L.xt - 10), PO_G - 36], 0.7); },
});
