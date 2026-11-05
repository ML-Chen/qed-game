// LIFT! (physics PE-22) — a frog, a plank on a barrel, and a rock on the far end of the plank; a beaver waits on a high
// ledge to collect rocks for its dam. Slide the barrel (the pivot), let go, and the frog hops onto its end of the plank.
// The frog turns the plank only if its weight times its distance from the pivot beats the rock's weight times the rock's
// distance (a lever). But a lever trades distance for force: the closer the pivot is to the rock, the easier the lift and
// the less high the rock goes. Too far from the rock: the plank won't budge and the frog is flung into the air. Too close:
// the rock rises but not as high as the ledge. Two rocks at level 0, three at level 1, three heavier ones at level 2, each
// heavier than the last, so the barrel must move every time.
(() => {
  const GND = 520, X0 = 44, LEN = 262, BH = 60, BR = 30, HN = 76, LEDGE = 322, PMIN = 92, PMAX = 262;
  // with the frog end on the ground, the rock end stands BH * LEN / dF above the ground
  const win = k => ({ lo: X0 + LEN * k / (1 + k) + 3, hi: X0 + BH * LEN / HN - 3 }); // barrel x range that works
  function paintGlade(o) {
    P.sky(o, 360, 640, ['#9ad0e8', '#d0ecf4', '#fff6e0']);
    P.cloud(o, 90, 170, 0.7); P.cloud(o, 280, 130, 0.5);
    P.hills(o, 360, 420, 60, '#b8c870', '#88984a', { seed: 11 });
    for (const [x, s] of [[40, 0.7], [140, 0.5]]) P.tree(o, x, 420, s);
    const gr = o.createLinearGradient(0, 440, 0, 640); gr.addColorStop(0, '#a8c860'); gr.addColorStop(1, '#6a8a3a'); o.fillStyle = gr; o.fillRect(0, 446, 360, 194);
    // the high ledge: a rocky bank with the beaver's dam pile on top
    const lg = o.createLinearGradient(LEDGE, 0, 360, 0); lg.addColorStop(0, '#9a7a5a'); lg.addColorStop(1, '#6a5038'); o.fillStyle = lg;
    o.beginPath(); o.moveTo(LEDGE, GND + 8); o.lineTo(LEDGE, GND - HN + 4); o.quadraticCurveTo(LEDGE + 2, GND - HN - 4, LEDGE + 12, GND - HN - 4); o.lineTo(370, GND - HN - 4); o.lineTo(370, GND + 8); o.closePath(); o.fill();
    o.strokeStyle = 'rgba(40,20,10,0.3)'; o.lineWidth = 2; for (let i = 0; i < 4; i++) { o.beginPath(); o.moveTo(LEDGE + 4, GND - 60 + i * 16); o.lineTo(360, GND - 56 + i * 16); o.stroke(); }
    o.fillStyle = '#7aa040'; o.fillRect(LEDGE + 6, GND - HN - 8, 50, 6);
    // the post under the far end of the plank
    o.fillStyle = '#9a6a3a'; o.strokeStyle = '#4a2a10'; o.lineWidth = 2; o.beginPath(); o.roundRect(X0 + LEN - 12, GND - BH + 2, 12, BH, 3); o.fill(); o.stroke();
    // the frog's stump
    o.fillStyle = '#7a4a2a'; o.beginPath(); o.roundRect(2, GND - 34, 30, 36, 4); o.fill(); o.fillStyle = '#c89a6a'; o.beginPath(); o.ellipse(17, GND - 34, 15, 5, 0, 0, 7); o.fill();
    P.grassTufts(o, 360, 530, 610, 24, '#6aa34f', 6); P.flowers(o, 360, 540, 610, 12, undefined, 3);
  }
  function rock(c, x, y, r, a) {
    c.save(); c.translate(x, y); c.rotate(a);
    const g2 = c.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r); g2.addColorStop(0, '#c8c0b8'); g2.addColorStop(0.6, '#8a8478'); g2.addColorStop(1, '#5a544a');
    c.fillStyle = g2; c.strokeStyle = '#3a342a'; c.lineWidth = 2; c.beginPath();
    for (let i = 0; i < 9; i++) { const q = i / 9 * Math.PI * 2, rr = r * (0.88 + 0.12 * Math.sin(i * 2.3)); i ? c.lineTo(Math.cos(q) * rr, Math.sin(q) * rr) : c.moveTo(Math.cos(q) * rr, Math.sin(q) * rr); } c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(40,30,20,0.35)'; c.beginPath(); c.moveTo(-r * 0.3, -r * 0.1); c.lineTo(r * 0.1, r * 0.2); c.stroke(); c.restore();
  }
  MG.add({
    id: 'lift', stage: 'forces', cmd: 'LIFT!', time: 7, mood: 'desert', winText: 'Lever!', failText: 'Too heavy!',
    card: { title: 'A lever trades distance for force', kind: 'Physics', ref: 'Levers',
      text: 'A plank on a barrel is a lever. The barrel is the pivot, the point it turns on.\n\nThe little frog can lift a heavy rock if the frog is far from the pivot and the rock is close to it. The frog\'s weight times its distance from the pivot has to beat the rock\'s weight times the rock\'s distance.\n\nThere is a price. With the pivot close to the rock, the frog\'s end goes down a long way while the rock\'s end goes up only a little. A heavier rock needs the pivot closer, so it rises less.',
      note: 'With a lever, a small push over a long distance can lift a heavy load a short distance.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.ks = [[1.4, 2.0], [1.4, 2.0, 2.4], [1.8, 2.2, 2.6]][L]; s.ri = 0;
      s.px = 150; s.drag = null; s.phase = 'aim'; s.pt = 0; s.ang = 0; s.frog = { x: 17, y: GND - 34 }; s.rockA = 0; s.drop = 1; s.done = [];
      s.angNow = rockDownAng(s.px);
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.phase !== 'aim') return; if (Math.abs(x - s.px) < 56 && y > GND - BH - 50) s.drag = { dx: s.px - x }; },
    move(g, x) { const s = g.s; if (!s.drag || s.phase !== 'aim') return; s.px = SK.clamp(x + s.drag.dx, PMIN, PMAX); g.sfx('rustle', { vol: 0.2 }); },
    up(g) { const s = g.s; if (!s.drag) return; s.drag = null; if (s.phase === 'aim') { s.phase = 'hop'; s.pt = g.t; g.sfx('boing', { pitch: 1.3, vol: 0.5 }); } },
    update(g, dt) {
      const s = g.s, k = s.ks[s.ri], dF = s.px - X0, dR = LEN - dF, aR = rockDownAng(s.px), aF = -Math.asin(BH / dF), e = g.t - s.pt;
      if (s.drop < 1) s.drop = Math.min(1, s.drop + dt * 3);
      if (s.phase === 'aim') { s.angNow = aR; return; }
      const lifts = dF > k * dR; // the frog's turning effect beats the rock's
      if (s.phase === 'hop') { // the frog hops from its stump onto the raised end
        const end = endPt(s.px, aR, -1), q = SK.clamp(e / 0.32, 0, 1); s.frog = { x: SK.lerp(17, end.x + 8, q), y: SK.lerp(GND - 34, end.y, q) - Math.sin(q * Math.PI) * 60 };
        if (q >= 1) { s.phase = lifts ? 'tip' : 'fling'; s.pt = g.t; g.sfx('thud'); }
      } else if (s.phase === 'tip') {
        const q = SK.easeInOut(e / 0.75); s.angNow = SK.lerp(aR, aF, q); const end = endPt(s.px, s.angNow, -1); s.frog = { x: end.x + 8, y: end.y }; // the frog's end sinks slowly, the rock's end rises
        if (e >= 0.75) {
          const h = GND - endPt(s.px, aF, 1).y; s.phase = h >= HN - 2 ? 'roll' : 'low'; s.pt = g.t;
          if (s.phase === 'roll') { g.sfx('cheer'); } else { g.sfx('thud'); g.sfx('wrong'); }
        }
      } else if (s.phase === 'fling') { // too far from the rock: the plank won't budge, so the frog bounces off
        const q = e / 0.9; s.frog = { x: SK.lerp(endPt(s.px, aR, -1).x + 8, 17, q), y: SK.lerp(endPt(s.px, aR, -1).y, GND - 34, q) - Math.sin(q * Math.PI) * 170 };
        if (e < dt * 1.5) { g.sfx('boing'); g.sfx('laugh'); }
        if (q >= 1) { s.phase = 'aim'; s.frog = { x: 17, y: GND - 34 }; }
      } else if (s.phase === 'low') { // lifted, but not as high as the ledge: it drops back
        if (e > 0.6) { const q = SK.easeInOut((e - 0.6) / 0.35); s.angNow = SK.lerp(aF, aR, q); const end = endPt(s.px, s.angNow, -1); s.frog = { x: SK.lerp(end.x + 8, 17, q), y: SK.lerp(end.y, GND - 34, q) - Math.sin(q * Math.PI) * 50 }; }
        if (e > 0.95) { s.phase = 'aim'; s.frog = { x: 17, y: GND - 34 }; g.sfx('thud'); }
      } else if (s.phase === 'roll') { // high enough: the rock rolls onto the ledge
        s.rockA += dt * 6;
        if (e > 0.35) { s.done.push(LEDGE + 30 + s.done.length * 10); s.ri++; g.sfx('ding');
          if (s.ri >= s.ks.length) { s.phase = 'won'; g.burst(LEDGE + 20, GND - HN - 20, ['#ffd45a', '#ffffff', '#c8a070'], 22, 200); g.win(); }
          else { s.phase = 'reset'; s.pt = g.t; } }
      } else if (s.phase === 'reset') { // the frog hops back and the beaver drops on the next, heavier rock
        const q = SK.clamp(e / 0.4, 0, 1); s.angNow = SK.lerp(aF, aR, SK.easeInOut(q)); const end = endPt(s.px, s.angNow, -1); s.frog = { x: SK.lerp(end.x + 8, 17, q), y: SK.lerp(end.y, GND - 34, q) - Math.sin(q * Math.PI) * 50 };
        if (q >= 1) { s.phase = 'aim'; s.drop = 0; s.rockA = 0; g.sfx('pop'); }
      }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('lift_glade', paintGlade), 0, 0, 360, 640);
      // rocks already delivered, piled by the beaver
      for (let i = 0; i < s.done.length; i++) rock(c, 336 - i * 4, GND - HN - 16 - i * 14, 14, i);
      SK.animal(c, 'beaver', 334, GND - HN - 4, 0.85, { t, facing: -1, pose: won || s.phase === 'roll' ? 'cheer' : 'wave', expr: won ? 'laugh' : s.phase === 'low' ? 'think' : 'happy' });
      // the barrel (pivot)
      const px = s.px, py = GND - BR; SK.shadow(c, px, GND + 2, BR + 4, 5, 0.25);
      const bg = c.createLinearGradient(px - BR, 0, px + BR, 0); bg.addColorStop(0, '#7a4a2a'); bg.addColorStop(0.45, '#c88a4a'); bg.addColorStop(1, '#6a3a1a');
      c.fillStyle = bg; c.strokeStyle = '#3a2010'; c.lineWidth = 2; c.beginPath(); c.arc(px, py, BR, 0, 7); c.fill(); c.stroke();
      c.strokeStyle = '#5a5a6a'; c.lineWidth = 3; c.beginPath(); c.arc(px, py, BR - 6, 0, 7); c.stroke(); c.fillStyle = '#3a2010'; c.beginPath(); c.arc(px, py, 4, 0, 7); c.fill();
      // the height the rock must reach: a dashed line from the ledge top back across the plank
      c.save(); c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 2; c.setLineDash([6, 6]); c.beginPath(); c.moveTo(LEDGE + 4, GND - HN - 4); c.lineTo(200, GND - HN - 4); c.stroke(); c.restore();
      // the plank, resting on the top of the barrel
      const a = s.angNow, L0 = endPt(px, a, -1), R0 = endPt(px, a, 1);
      c.save(); c.translate(px, GND - BH); c.rotate(a); c.fillStyle = '#d8a060'; c.strokeStyle = '#6a3a1a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-(px - X0), -10, LEN, 10, 3); c.fill(); c.stroke();
      c.lineWidth = 4; c.lineCap = 'round'; c.strokeStyle = 'rgba(80,170,80,0.8)'; c.beginPath(); c.moveTo(-(px - X0) + 6, -5); c.lineTo(-4, -5); c.stroke(); c.strokeStyle = 'rgba(140,130,120,0.9)'; c.beginPath(); c.moveTo(4, -5); c.lineTo(LEN - (px - X0) - 6, -5); c.stroke(); c.restore(); // the frog's arm (green) and the rock's arm (grey)
      // the rock on the far end (it rolls off onto the ledge on a good lift)
      if (s.ri < s.ks.length) {
        const k = s.ks[s.ri], r = 14 + k * 7; let rx = R0.x - r * 0.9, ry = R0.y - r - 8 + Math.sin(a) * 0;
        if (s.phase === 'roll') { const q = SK.clamp((t - s.pt) / 0.35, 0, 1); rx = SK.lerp(rx, LEDGE + 26, q); ry = SK.lerp(ry, GND - HN - r - 4, q); }
        rock(c, rx, ry, r * (s.drop < 1 ? SK.easeOut(s.drop) : 1), s.rockA); // a new rock pops onto the plank
      }
      // the frog
      const f = s.frog; SK.animal(c, 'frog', f.x, f.y, 0.9, { t, pose: won ? 'cheer' : s.phase === 'hop' || s.phase === 'fling' ? 'hop' : 'idle', expr: won ? 'laugh' : s.phase === 'fling' ? 'wow' : s.phase === 'low' ? 'think' : lost ? 'sad' : 'happy', noShadow: f.y < GND - 40 });
      // guidance: glow on the barrel; at level 0 the ghost hand slides it into the range that works
      if (s.phase === 'aim' && !g.done) { SK.glow(c, g, px, py, 38, undefined, { level: 2 });
        c.save(); c.fillStyle = 'rgba(255,255,255,0.85)'; for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(px + sd * 52, GND + 14); c.lineTo(px + sd * 40, GND + 6); c.lineTo(px + sd * 40, GND + 22); c.closePath(); c.fill(); } c.fillRect(px - 40, GND + 12, 80, 4); c.restore(); const w = win(s.ks[s.ri]); if (g.level === 0) { c.save(); c.fillStyle = 'rgba(255,240,150,0.3)'; c.beginPath(); c.roundRect(w.lo - BR, GND + 26, w.hi - w.lo + BR * 2, 10, 5); c.fill(); c.restore(); }
        SK.demo(g, c, 'drag', [px, py], [(w.lo + w.hi) / 2, py]); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.phase !== 'aim' || s.drop < 1) return; const w = win(s.ks[s.ri]), tx = (w.lo + w.hi) / 2;
      if (!s._bb || s._bb.ri !== s.ri) s._bb = { ri: s.ri, t: Math.max(0.9, g.t + 0.1), a: s.px };
      SK.bot.drag(g, synth, 'rock' + s.ri, s._bb.t, [s._bb.a, GND - BR], [tx, GND - BR], 0.35);
    },
  });
  function rockDownAng() { return 0; } // at rest the plank lies level, its far end on a post
  function endPt(px, a, side) { const d = side < 0 ? px - X0 : LEN - (px - X0); return { x: px + side * Math.cos(a) * d, y: GND - BH + side * Math.sin(a) * d }; }
})();
