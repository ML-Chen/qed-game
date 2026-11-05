// BUILD UP! (earth_eng ME-31) — a valley seen from the side: a lake on the left starts filling behind a thin concrete
// dam, a village sits in the valley below it on the right. Blue arrows show the water pushing on the dam: the deeper
// the water, the longer the arrow, so the push is biggest at the bottom. Drag the dam's face out to thicken it, band
// by band (you have a limited load of concrete). A band too thin for the push on it turns red, bulges and cracks; hold
// out too long and it bursts and water sprays toward the village. Thick at the bottom, thin at the top, and the lake
// fills to the brim while the dam holds.
// Water pressure grows with depth (pressure = density x g x depth), which is why real dams are wedge-shaped.
// Level 0: the dashed outline of a good shape. Level 1: less spare concrete. Level 2: a higher lake, no outline.
const BU = (() => {
  const WX = 150, TOP = 220, BOT = 540, NB = 4, BH = (BOT - TOP) / NB, T0 = 22, TMAX = 150;
  const SETS = [
    { sky: ['#8ad0f0', '#c8ecf8', '#fff6dc'], hill: '#7ab85a', lake: ['#4aa8d8', '#1e6aa0'], roof: '#d8503a' },
    { sky: ['#f0b08a', '#f8d8b0', '#fff2dc'], hill: '#a8b860', lake: ['#5a9ad0', '#2a5a90'], roof: '#5a7ad8' },
    { sky: ['#b0a8e8', '#d8d0f4', '#fff0e8'], hill: '#6aa870', lake: ['#4ab0c8', '#1a6a8a'], roof: '#e8a03a' },
    { sky: ['#9ad8d0', '#d0f0e8', '#fffbe0'], hill: '#8ac05a', lake: ['#3a98d8', '#1a5a9a'], roof: '#c84a8a' },
  ];
  const bandY = i => TOP + (i + 0.5) * BH; // i = 0 at the top
  function paint(o, S) {
    N4.vgrad(o, 0, 0, 360, 600, S.sky);
    P.cloud(o, 260, 170, 0.6); P.cloud(o, 80, 150, 0.5);
    // valley walls: the lake basin on the left, the valley floor on the right
    o.fillStyle = P.shade(S.hill, -0.1); o.beginPath(); o.moveTo(0, 210); o.quadraticCurveTo(60, 230, 90, 560); o.lineTo(WX, 560); o.lineTo(WX, 640); o.lineTo(0, 640); o.closePath(); o.fill();
    o.fillStyle = S.hill; o.beginPath(); o.moveTo(WX, 548); o.lineTo(360, 560); o.lineTo(360, 640); o.lineTo(WX, 640); o.closePath(); o.fill();
    o.fillStyle = P.shade(S.hill, 0.15); o.beginPath(); o.moveTo(300, 300); o.quadraticCurveTo(340, 330, 360, 320); o.lineTo(360, 560); o.lineTo(290, 556); o.closePath(); o.fill();
    o.fillStyle = '#7a6a5a'; o.fillRect(0, 560, WX, 80); o.fillStyle = '#6a5a4a'; o.fillRect(WX - 4, BOT, 8, 30);
    // the village below the dam
    for (const [x, k] of [[228, 0.75], [318, 0.85], [266, 1]]) { const w = 40 * k, h = 30 * k, y = 562 - h; o.fillStyle = '#f4e2c0'; o.strokeStyle = '#7a5a3a'; o.lineWidth = 2; o.fillRect(x - w / 2, y, w, h); o.strokeRect(x - w / 2, y, w, h);
      o.fillStyle = S.roof; o.beginPath(); o.moveTo(x - w / 2 - 6, y + 2); o.lineTo(x, y - h * 0.8); o.lineTo(x + w / 2 + 6, y + 2); o.closePath(); o.fill(); o.stroke(); o.fillStyle = '#7a4b2e'; o.fillRect(x - 5 * k, y + h - 14 * k, 10 * k, 14 * k); o.fillStyle = '#9ad8f0'; o.fillRect(x + 8 * k, y + 6 * k, 8 * k, 8 * k); }
    P.grassTufts(o, 360, 566, 630, 18, P.shade(S.hill, -0.3), 7);
    P.grain(o, 360, 640, 0.025);
  }
  // the dam's outline: from the top of its upstream face, down the downstream face through each band's thickness
  function outline(c, th, bulge) {
    c.beginPath(); c.moveTo(WX, TOP); c.lineTo(WX + th[0] * 0.8, TOP);
    for (let i = 0; i < NB; i++) c.lineTo(WX + th[i] + (bulge[i] || 0), bandY(i));
    c.lineTo(WX + th[NB - 1] * 1.05, BOT); c.lineTo(WX, BOT); c.closePath();
  }
  return { WX, TOP, BOT, NB, BH, T0, TMAX, SETS, bandY, paint, outline };
})();
MG.add({
  id: 'build_buildup', stage: 'build', cmd: 'THICKEN THE DAM WHERE IT PUSHES!', time: 8, mood: 'desert', winText: 'The dam holds!', failText: 'It burst!',
  card: { title: 'Deeper water pushes harder', kind: 'Engineering', ref: 'Hydrostatic pressure (dam design)',
    text: 'Water pushes on everything it touches. The deeper you go, the more water sits above, so the harder it pushes. At the bottom of a lake the push is greatest.\n\nThat is why dams are thick at the bottom and thin at the top, like a wedge. The bottom must hold back the biggest push. Concrete at the top would be wasted.\n\nA dam that is thick only at the top bulges and cracks low down, where the push is strongest.',
    note: 'Water pressure grows with depth, so a dam must be thickest at the bottom.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.S = BU.SETS[s.v]; s.L = L;
    s.kp = L >= 2 ? 0.42 : 0.36; s.full = L >= 2 ? 228 : 238; s.th = Array(BU.NB).fill(BU.T0); s.bulge = Array(BU.NB).fill(0); s.strain = Array(BU.NB).fill(0);
    let need = 0; for (let i = 0; i < BU.NB; i++) need += Math.max(0, g.def.req(s, i, s.full) - BU.T0); s.conc = need * [1.35, 1.2, 1.2][L]; s.conc0 = s.conc;
    s.surf = BU.BOT - 4; s.started = false; s.burst = -1; s.burstT = 0; s.okT = 0; s.drag = null;
  },
  // how thick band i must be when the water's surface is at y
  req(s, i, surf) { const d = BU.bandY(i) - surf; return d <= 0 ? 0 : 12 + s.kp * d; },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; s.started = true; if (x > BU.WX - 10 && x < BU.WX + BU.TMAX + 40 && y > BU.TOP - 20 && y < BU.BOT + 10) { s.drag = true; SK.dragStart(g, null, x, y); g.def.paint(g, x, y); } },
  move(g, x, y) { const s = g.s; if (!s.drag || g.done) return; SK.dragMove(g, x, y); g.def.paint(g, x, y); },
  up(g) { g.s.drag = null; SK.dragEnd(g); },
  // dragging the face out: the band under the finger grows to reach the finger, using concrete
  paint(g, x, y) {
    const s = g.s, i = Math.floor((y - BU.TOP) / BU.BH); if (i < 0 || i >= BU.NB) return;
    const want = SK.clamp(x - BU.WX, BU.T0, BU.TMAX), add = Math.min(want - s.th[i], s.conc); if (add <= 0.5) return;
    s.th[i] += add; s.conc -= add; s.strain[i] = Math.max(0, s.strain[i] - 0.5); if (g.rand() < 0.4) g.sfx('crunch', { vol: 0.3 });
  },
  update(g, dt) {
    const s = g.s; if (g.done) return;
    if (!s.started && g.t > 5) s.started = true;
    const strong = s.th.every((t, i) => t >= g.def.req(s, i, s.full) * 0.92);
    if (s.started && s.surf > s.full) s.surf = Math.max(s.full, s.surf - (strong ? 200 : (BU.BOT - s.full) / 14) * dt); // the lake fills (fast once the dam can hold it all)
    for (let i = 0; i < BU.NB; i++) {
      const need = g.def.req(s, i, s.surf), weak = need > 0 && s.th[i] < need * 0.92;
      s.strain[i] = weak ? s.strain[i] + dt : Math.max(0, s.strain[i] - dt * 2); s.bulge[i] = Math.min(14, s.strain[i] * 9) * (weak ? 1 : 0.5);
      if (s.strain[i] > 1.5) { s.burst = i; s.burstT = g.t; g.sfx('splash'); g.sfx('crunch'); g.shake(6, 0.4); g.fail(); return; }
    }
    if (s.surf <= s.full + 0.5 && strong) { if (!s.okT) { s.okT = g.t; g.sfx('chime'); } if (g.t - s.okT > 0.35) { g.sfx('cheer'); g.win(); } }
  },
  draw(g, c) {
    const s = g.s, t = g.t, S = s.S, won = g.result === 'win', lost = g.result === 'fail', WX = BU.WX;
    c.drawImage(g.bake('buildup_bg' + s.v, o => BU.paint(o, S)), 0, 0, 360, 640);
    // the lake
    c.save(); c.beginPath(); c.moveTo(0, s.surf); c.lineTo(WX, s.surf); c.lineTo(WX, BU.BOT + 20); c.lineTo(0, BU.BOT + 20); c.closePath(); c.clip();
    N4.vgrad(c, 0, s.surf, WX, BU.BOT + 20 - s.surf, S.lake); c.fillStyle = 'rgba(255,255,255,0.35)'; for (let i = 0; i < 5; i++) { const x = (i * 37 + t * 14) % WX; c.beginPath(); c.ellipse(x, s.surf + 4, 12, 2.5, 0, 0, 7); c.fill(); } c.restore();
    SK.tag(c, 'Lake', 50, Math.max(s.surf + 26, 300), 18);
    // the full line on the hill
    c.save(); c.strokeStyle = 'rgba(30,90,160,0.8)'; c.lineWidth = 2.5; c.setLineDash([6, 5]); c.beginPath(); c.moveTo(4, s.full); c.lineTo(WX, s.full); c.stroke(); c.restore();
    // level 0: the dashed outline of a good dam
    if (g.level === 0 && !g.done) { const gh = []; for (let i = 0; i < BU.NB; i++) gh.push(Math.max(BU.T0, g.def.req(s, i, s.full) + 6)); c.save(); c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 3; c.setLineDash([7, 6]); BU.outline(c, gh, []); c.stroke(); c.restore(); }
    // the dam: grey concrete, red where a band is straining, with cracks
    BU.outline(c, s.th, s.bulge); const dg = c.createLinearGradient(WX, 0, WX + 120, 0); dg.addColorStop(0, '#c8c4bc'); dg.addColorStop(1, '#a8a49c'); c.fillStyle = dg; c.fill(); c.strokeStyle = '#5a5650'; c.lineWidth = 3; c.stroke();
    for (let i = 0; i < BU.NB; i++) {
      const y = BU.bandY(i), k = SK.clamp(s.strain[i] / 1.5, 0, 1);
      if (k > 0.05) { c.save(); c.globalAlpha = 0.25 + 0.5 * k; c.fillStyle = '#e8302a'; c.fillRect(WX, y - BU.BH / 2 + 2, s.th[i] + s.bulge[i], BU.BH - 4); c.restore();
        c.strokeStyle = '#3a2a2a'; c.lineWidth = 2; c.beginPath(); c.moveTo(WX + s.th[i] + s.bulge[i] - 2, y - 10); c.lineTo(WX + s.th[i] * 0.6, y - 2 + k * 4); c.lineTo(WX + s.th[i] * 0.5, y + 8 * k); c.stroke(); }
      if (i < BU.NB - 1) { c.strokeStyle = 'rgba(90,86,80,0.35)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(WX, y + BU.BH / 2); c.lineTo(WX + Math.min(s.th[i], s.th[i + 1]), y + BU.BH / 2); c.stroke(); }
    }
    // the water's push on the dam: arrows that grow with depth
    for (let i = 0; i < 8; i++) { const y = BU.TOP + 20 + i * 40, d = y - s.surf; if (d <= 4) continue; const L = Math.min(124, 6 + d * 0.4); c.save(); c.strokeStyle = '#1a5aa8'; c.fillStyle = '#1a5aa8'; c.lineWidth = 3 + Math.min(4, d / 70); c.lineCap = 'round'; c.beginPath(); c.moveTo(WX - 6 - L, y); c.lineTo(WX - 10, y); c.stroke(); c.beginPath(); c.moveTo(WX - 4, y); c.lineTo(WX - 14, y - 7); c.lineTo(WX - 14, y + 7); c.closePath(); c.fill(); c.restore(); }
    // a burst: water sprays out of the broken band toward the village
    if (s.burst >= 0) { const y = BU.bandY(s.burst), k = SK.clamp((t - s.burstT) * 2, 0, 1); c.fillStyle = 'rgba(90,170,230,0.85)'; c.beginPath(); c.moveTo(WX + s.th[s.burst], y - 10); c.quadraticCurveTo(WX + 120 * k + 40, y - 30, WX + 200 * k + 20, 560); c.lineTo(WX + 160 * k, 560); c.quadraticCurveTo(WX + 80 * k + 20, y + 10, WX + s.th[s.burst], y + 10); c.closePath(); c.fill(); }
    SK.tag(c, 'Dam', WX + 40, BU.TOP - 18, 18);
    // the concrete left
    const cx0 = 214, cw = 128, cy = 160, f = s.conc / s.conc0; c.fillStyle = 'rgba(30,14,36,0.7)'; c.beginPath(); c.roundRect(cx0 - 6, cy - 12, cw + 12, 24, 12); c.fill(); c.fillStyle = f > 0.2 ? '#d8d4cc' : '#ff8a6a'; c.beginPath(); c.roundRect(cx0, cy - 6, Math.max(4, cw * f), 12, 6); c.fill();
    SK.tag(c, 'Concrete', cx0 + cw / 2, cy + 30, 18);
    SK.animal(c, 'beaver', 306, 568, 0.85, { t, pose: won ? 'cheer' : lost ? 'sad' : 'point', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    // guidance: drag the face of the lowest band that is too thin for the full lake out to where it needs to be
    const h = g.done ? null : BUhint(g, s);
    if (h) { SK.grab(c, g, h.a[0], h.a[1], 18); SK.target(c, g, h.b[0], h.b[1], 16); SK.arrow(c, g, h.a[0], h.a[1], h.b[0], h.b[1], { from: 18, to: 22 }); }
    SK.demo(g, c, 'drag', h ? h.a : [0, 0], h ? h.b : [0, 0], { never: !h });
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._b = s._b || { n: 0, next: 1.0 }; if (g.done || g.t < B.next) return; const h = BUhint(g, s); if (!h) return;
    if (SK.bot.drag(g, synth, 'b' + B.n, B.next, h.a, h.b, 0.35)) { B.n++; B.next = g.t + 0.2; }
  },
});
function BUhint(g, s) {
  for (let i = BU.NB - 1; i >= 0; i--) { const need = g.def.req(s, i, s.full); if (s.th[i] < need * 0.95) { const y = BU.bandY(i); return { a: [BU.WX + s.th[i] - 4, y], b: [BU.WX + Math.min(BU.TMAX, need + 6), y] }; } }
  return null;
}
