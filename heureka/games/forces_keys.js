// FIND KEYS! (physics PE-05) — a sandbox seen from above, with little sand mounds where things are buried: old iron
// keys, iron nails, a rubber duck, a wooden block and a plastic cup (and at level 2 coins: steel ones and copper ones).
// Drag the big horseshoe magnet over the sand. Anything made of iron or steel leaps out of the sand and clicks onto the
// magnet; the magnet's sweep brushes the sand off everything else, which just lies there (the duck squeaks). Find all
// the keys. Two keys at level 0, three at levels 1 and 2.
(() => {
  const BOX = { l: 26, r: 334, t: 168, b: 548 }, PULL = 38, BRUSH = 34;
  const SLOTS = [[70, 214], [150, 226], [232, 212], [300, 240], [96, 300], [186, 310], [272, 318], [62, 392], [146, 384], [230, 402], [308, 396], [100, 478], [186, 470], [270, 490]];
  const KIND = { key: { iron: 1, name: 'Key' }, nail: { iron: 1, name: 'Nail' }, duck: { iron: 0, name: 'Rubber' }, block: { iron: 0, name: 'Wood' }, cup: { iron: 0, name: 'Plastic' }, steel: { iron: 1, name: 'Steel' }, copper: { iron: 0, name: 'Copper' } };
  function paintBox(o) {
    N1.vgrad(o, 0, 0, 360, 640, ['#8ac860', '#7ab850', '#9ad070']); const r = P.rng(12);
    for (let i = 0; i < 90; i++) { o.fillStyle = r() < 0.5 ? 'rgba(40,90,30,0.3)' : 'rgba(210,250,160,0.35)'; o.beginPath(); o.ellipse(r() * 360, r() * 640, 3, 1.5, r() * 3, 0, 7); o.fill(); }
    P.flowers(o, 360, 120, 160, 10); P.flowers(o, 360, 566, 636, 14);
    // the wooden frame and the sand
    o.fillStyle = '#8a5a30'; o.beginPath(); o.roundRect(BOX.l - 16, BOX.t - 16, BOX.r - BOX.l + 32, BOX.b - BOX.t + 32, 12); o.fill();
    o.fillStyle = '#b07a44'; o.beginPath(); o.roundRect(BOX.l - 10, BOX.t - 12, BOX.r - BOX.l + 20, BOX.b - BOX.t + 22, 10); o.fill();
    const sg = o.createLinearGradient(0, BOX.t, 0, BOX.b); sg.addColorStop(0, '#f4dc9c'); sg.addColorStop(1, '#e2c07a'); o.fillStyle = sg; o.fillRect(BOX.l, BOX.t, BOX.r - BOX.l, BOX.b - BOX.t);
    for (let i = 0; i < 900; i++) { o.fillStyle = r() < 0.5 ? 'rgba(160,110,50,0.3)' : 'rgba(255,250,220,0.6)'; o.fillRect(BOX.l + r() * (BOX.r - BOX.l), BOX.t + r() * (BOX.b - BOX.t), 1.6, 1.6); }
    o.strokeStyle = 'rgba(170,120,60,0.35)'; o.lineWidth = 2; for (let i = 0; i < 8; i++) { const y = BOX.t + 30 + i * 46; o.beginPath(); o.moveTo(BOX.l + 10, y); o.bezierCurveTo(120, y + 12, 240, y - 12, BOX.r - 10, y + 4); o.stroke(); } // raked lines
    o.fillStyle = '#d8584a'; o.beginPath(); o.moveTo(300, 520); o.lineTo(326, 520); o.lineTo(320, 540); o.lineTo(306, 540); o.closePath(); o.fill(); // a toy bucket
  }
  function drawItem(c, it, x, y, t, rot = 0) {
    c.save(); c.translate(x, y); c.rotate(rot + (it.rot || 0)); c.scale(1.35, 1.35);
    if (it.k === 'key') { c.strokeStyle = '#3a3a48'; c.fillStyle = '#6a6a7a'; c.lineWidth = 2; c.beginPath(); c.arc(-12, 0, 7, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#e2c07a'; c.beginPath(); c.arc(-12, 0, 3, 0, 7); c.fill(); c.fillStyle = '#6a6a7a'; c.fillRect(-5, -2.5, 22, 5); c.strokeRect(-5, -2.5, 22, 5); c.fillRect(11, 2, 3, 6); c.fillRect(15, 2, 3, 4); }
    else if (it.k === 'nail') { c.fillStyle = '#8a8a98'; c.strokeStyle = '#3a3a48'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-12, -1.5); c.lineTo(10, -1.5); c.lineTo(15, 0); c.lineTo(10, 1.5); c.lineTo(-12, 1.5); c.closePath(); c.fill(); c.stroke(); c.fillRect(-14, -4, 3, 8); }
    else if (it.k === 'duck') { c.fillStyle = '#ffd43a'; c.strokeStyle = '#a07a10'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 2, 15, 11, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(8, -6, 8, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#ff8a2a'; c.beginPath(); c.moveTo(15, -6); c.lineTo(22, -4); c.lineTo(15, -2); c.fill(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(10, -8, 1.6, 0, 7); c.fill(); }
    else if (it.k === 'block') { c.fillStyle = '#d89a58'; c.strokeStyle = '#7a4a20'; c.lineWidth = 2; c.beginPath(); c.roundRect(-12, -12, 24, 24, 3); c.fill(); c.stroke(); c.strokeStyle = 'rgba(120,70,30,0.5)'; c.lineWidth = 1; for (let i = -6; i <= 6; i += 6) { c.beginPath(); c.moveTo(-10, i); c.lineTo(10, i + 2); c.stroke(); } }
    else if (it.k === 'cup') { c.fillStyle = '#4aa8e8'; c.strokeStyle = '#1a5a90'; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, 13, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#2a78b8'; c.beginPath(); c.arc(0, 0, 9, 0, 7); c.fill(); }
    else { const steel = it.k === 'steel'; SK.ball(c, 0, 0, 9, steel ? '#b8bcc8' : '#d88a4a', { edge: steel ? '#5a5a6a' : '#7a3a1a' }); }
    c.restore();
  }
  function magnet(c, x, y, t, glow) { // a horseshoe magnet from above, poles pointing down, on a handle
    c.save(); c.translate(x, y); c.scale(1.25, 1.25); c.translate(0, -4);
    c.fillStyle = 'rgba(30,14,36,0.22)'; c.beginPath(); c.ellipse(8, 30, 34, 12, 0, 0, 7); c.fill();
    c.fillStyle = '#8a5a30'; c.fillRect(-5, -70, 10, 40); c.fillStyle = '#6a4020'; c.beginPath(); c.roundRect(-9, -84, 18, 22, 6); c.fill();
    c.lineWidth = 16; c.lineCap = 'butt'; c.strokeStyle = '#e8403a'; c.beginPath(); c.arc(0, -8, 22, Math.PI, 0); c.stroke();
    c.beginPath(); c.moveTo(-22, -8); c.lineTo(-22, 10); c.moveTo(22, -8); c.lineTo(22, 10); c.stroke();
    c.strokeStyle = '#d8dce8'; c.beginPath(); c.moveTo(-22, 10); c.lineTo(-22, 22); c.moveTo(22, 10); c.lineTo(22, 22); c.stroke();
    c.lineWidth = 2; c.strokeStyle = '#5a1a1a'; c.beginPath(); c.arc(0, -8, 30, Math.PI, 0); c.arc(0, -8, 14, 0, Math.PI, true); c.closePath(); c.stroke();
    if (glow) { c.strokeStyle = `rgba(150,200,255,${0.4 + 0.3 * Math.sin(t * 8)})`; c.lineWidth = 2; c.setLineDash([4, 5]); for (const r of [36, 48]) { c.beginPath(); c.arc(0, 22, r, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke(); } }
    c.restore();
  }
  // the next move: a sweep from the magnet over the nearest buried key and on past it (over whatever else lies there)
  function nextMove(s) {
    const m = s.mag, left = s.items.filter(it => it.k === 'key' && it.state === 'buried'); if (!left.length) return null;
    const px = m.x, py = m.y + 22, nk = left.reduce((a, b) => SK.dist(a.x, a.y, px, py) < SK.dist(b.x, b.y, px, py) ? a : b);
    const d = SK.dist(nk.x, nk.y, px, py) || 1, ux = (nk.x - px) / d, uy = (nk.y - py) / d;
    return { to: [SK.clamp(nk.x + ux * 70, BOX.l + 14, BOX.r - 14), SK.clamp(nk.y + uy * 70, BOX.t + 10, BOX.b - 6)] };
  }
  MG.add({
    id: 'keys', stage: 'forces', cmd: 'FIND THE KEYS WITH THE MAGNET!', time: 7, mood: 'bright', winText: 'Iron sticks!', failText: 'Still lost!',
    card: { title: 'Magnets pull on iron', kind: 'Physics', ref: 'Magnetism',
      text: 'A magnet pulls on things made of iron or steel, even through sand. These old keys and the nails are iron, so they jump up and stick to the magnet.\n\nWood, plastic and rubber feel no pull at all, so they stay where they are. Most metals are not magnetic either: copper coins and modern brass keys stay put.\n\nThe pull is strongest close to the magnet, so you have to pass right over a buried key to find it.',
      note: 'Magnets pull things made of iron or steel. Wood, plastic, rubber and most other metals feel no pull.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level), v = SK.variant(g, 4); s.nk = lv === 0 ? 2 : 3;
      // the keys go in far-apart slots; on the way to each key lies something that is not iron (so sweeping to a key
      // always passes over a duck, a block or a cup first); the rest fill other slots
      const slots = SK.shuffled(g, SLOTS.filter(p => p[1] < 420)), keys = [], items = [], decoys = SK.shuffled(g, ['duck', 'block', 'cup']);
      let prev = [196, 608]; for (const p of slots) { if (keys.length >= s.nk) break; if (keys.some(q => SK.dist(q[0], q[1], p[0], p[1]) < 120) || SK.dist(prev[0], prev[1], p[0], p[1]) < 150) continue; keys.push(p); prev = p; }
      prev = [196, 608]; keys.forEach((p, i) => { items.push({ k: 'key', x: p[0], y: p[1] }); items.push({ k: decoys[i % 3], x: SK.lerp(prev[0], p[0], 0.55 + (v % 2) * 0.1), y: SK.lerp(prev[1], p[1], 0.55 + (v % 2) * 0.1) }); prev = p; });
      const rest = ['nail', 'nail', ...(lv >= 2 ? ['steel', 'copper', 'copper'] : []), ...(s.nk === 2 ? [decoys[2]] : [])];
      for (const p of SK.shuffled(g, SLOTS)) { if (!rest.length) break; if (items.some(q => SK.dist(q.x, q.y, p[0], p[1]) < 56)) continue; items.push({ k: rest.shift(), x: p[0], y: p[1] }); }
      s.items = items.map(it => ({ ...it, x: it.x + (g.rand() - 0.5) * 10, y: it.y + (g.rand() - 0.5) * 10, rot: g.rand() * 6.28, state: 'buried', t: 0 }));
      s.mag = { x: 196, y: 586 }; s.stuck = []; s.got = 0; s.winT = 0; s.drag = false; s.sand = [];
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (SK.dist(x, y, s.mag.x, s.mag.y - 20) < 70) { s.drag = true; SK.dragStart(g, s.mag, x, y); } },
    move(g, x, y) { const s = g.s; if (!s.drag) return; SK.dragMove(g, x, y); s.mag.x = SK.clamp(s.mag.x, 10, 350); s.mag.y = SK.clamp(s.mag.y, 150, 610); },
    up(g) { const s = g.s; if (s.drag) { s.drag = false; SK.dragEnd(g); } },
    update(g, dt) {
      const s = g.s, m = s.mag, px = m.x, py = m.y + 22; // the poles
      for (const it of s.items) {
        const d = SK.dist(it.x, it.y, px, py);
        if (it.state === 'buried' && d < Math.max(PULL, BRUSH)) {
          if (KIND[it.k].iron && d < PULL) { it.state = 'fly'; it.t = g.t; it.fx = it.x; it.fy = it.y; it.slot = s.stuck.length; s.stuck.push(it); g.sfx('whoosh', { vol: 0.5 }); for (let i = 0; i < 8; i++) s.sand.push({ x: it.x, y: it.y, vx: (g.rand() - 0.5) * 160, vy: (g.rand() - 0.5) * 160, life: 0.5 }); }
          else if (!KIND[it.k].iron && d < BRUSH) { it.state = 'shown'; it.t = g.t; g.sfx(it.k === 'duck' ? 'boing' : 'rustle', { vol: 0.6 }); if (it.k === 'duck') g.sfx('quack', { vol: 0.5 }); }
        }
        if (it.state === 'fly' && g.t - it.t > 0.22) { it.state = 'stuck'; g.sfx('click'); if (it.k === 'key') { s.got++; g.sfx('chime'); if (s.got >= s.nk) s.winT = g.t; } }
      }
      for (const p of s.sand) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; } s.sand = s.sand.filter(p => p.life > 0);
      if (s.winT && !g.done && g.t - s.winT > 0.3) { g.win(); g.sfx('cheer'); g.burst(m.x, m.y, ['#ffd45a', '#fff6ea', '#e8403a'], 20, 170); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, m = s.mag, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('keys_box', paintBox), 0, 0, 360, 640);
      // buried things: a little mound each; uncovered ones lie in a brushed hollow with their name
      for (const it of s.items) {
        if (it.state === 'buried') { c.fillStyle = 'rgba(150,100,40,0.28)'; c.beginPath(); c.ellipse(it.x + 3, it.y + 4, 17, 10, 0, 0, 7); c.fill(); c.fillStyle = '#fbe8b4'; c.beginPath(); c.ellipse(it.x, it.y, 16, 9, 0, 0, 7); c.fill(); }
        else if (it.state === 'shown') { c.fillStyle = 'rgba(170,120,60,0.35)'; c.beginPath(); c.ellipse(it.x, it.y + 2, 22, 16, 0, 0, 7); c.fill(); const bob = it.k === 'duck' ? Math.max(0, 1 - (t - it.t) * 3) * Math.sin((t - it.t) * 30) * 4 : 0; drawItem(c, it, it.x, it.y - Math.abs(bob), t); if (t - it.t < 2.2) SK.tag(c, KIND[it.k].name, it.x, it.y + 34, 18); }
        else if (it.state === 'buried' || it.state === 'fly') { /* drawn with the magnet */ }
        if (it.state !== 'buried' && it.state !== 'shown') { c.fillStyle = 'rgba(150,100,40,0.3)'; c.beginPath(); c.ellipse(it.fx, it.fy + 2, 14, 9, 0, 0, 7); c.fill(); }
      }
      for (const p of s.sand) { c.globalAlpha = p.life * 2; c.fillStyle = '#e8c88a'; c.beginPath(); c.arc(p.x, p.y, 2.5, 0, 7); c.fill(); } c.globalAlpha = 1;
      // the keys still to find
      if (!won) { c.fillStyle = 'rgba(30,14,36,0.7)'; c.beginPath(); c.roundRect(180 - s.nk * 30 - 12, 124, s.nk * 60 + 24, 40, 20); c.fill();
        for (let i = 0; i < s.nk; i++) { const it = { k: 'key', rot: 0 }, kx = 180 + (i - (s.nk - 1) / 2) * 60; c.save(); c.translate(kx, 144); c.scale(1.1, 1.1); c.globalAlpha = i < s.got ? 1 : 0.35; drawItem(c, it, 0, 0, t); c.restore(); if (i < s.got) { c.fillStyle = '#6ae07a'; c.beginPath(); c.arc(kx + 20, 134, 6, 0, 7); c.fill(); } } }
      // the magnet, with everything stuck to its poles
      magnet(c, m.x, m.y, t, !g.done);
      for (const it of s.stuck) { const sx = m.x + [-22, 22, -10, 12, -24, 24, 0, -14][it.slot % 8], sy = m.y + 30 + Math.floor(it.slot / 2) % 3 * 4;
        const k = it.state === 'fly' ? SK.easeOut((t - it.t) / 0.22) : 1, x = SK.lerp(it.fx, sx, k), y = SK.lerp(it.fy, sy, k) - Math.sin(k * Math.PI) * 24, sc = 1 + Math.sin(k * Math.PI) * 0.4;
        c.save(); c.translate(x, y); c.scale(sc, sc); drawItem(c, it, 0, 0, t, it.state === 'stuck' ? Math.PI / 2 : 0); c.restore(); }
      if (!g.done) SK.tag(c, 'Magnet', SK.clamp(m.x + 64, 50, 310), m.y - 50, 18);
      // the fox on the edge of the box
      SK.animal(c, 'fox', 52, 628, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'happy' });
      // guidance: bring the magnet to a row of mounds and sweep it along
      const nm = g.done ? null : nextMove(s); if (!nm) return;
      const tx = SK.clamp(nm.to[0], BOX.l + 14, BOX.r - 14), ty = nm.to[1] - 22;
      SK.grab(c, g, m.x, m.y, 40); SK.arrow(c, g, m.x, m.y, tx, ty, { from: 44, to: 20 });
      SK.demo(g, c, 'drag', [m.x, m.y - 10], [tx, ty - 10]);
    },
    auto(g, dt, synth) {
      const s = g.s, B = s._bot = s._bot || {}; if (g.done || g.t < 1.0) return; const m = s.mag;
      if (!B.on) { synth('down', m.x, m.y - 10); B.on = 1; B.p = [m.x, m.y - 10]; return; }
      const nm = nextMove(s); if (!nm) { if (B.on === 1) { synth('up', B.p[0], B.p[1]); B.on = 2; } return; }
      const tx = SK.clamp(nm.to[0], BOX.l + 14, BOX.r - 14), ty = nm.to[1] - 32, d = Math.hypot(tx - B.p[0], ty - B.p[1]), st = Math.min(d, 420 * dt);
      if (d > 1) { B.p = [B.p[0] + (tx - B.p[0]) / d * st, B.p[1] + (ty - B.p[1]) / d * st]; synth('move', B.p[0], B.p[1]); }
    },
  });
})();
