// SHADE EACH TOWN WITH THE MOON! (space EE MSE-19 BLOCK!) — looking down on the Earth and the Moon's orbit, with the
// Sun blazing at the left. Sunlight lights the Earth's left half; a little town sits on the sunny side. Drag the Moon
// round its orbit until it is exactly between the Sun and the town: its small shadow falls on the town, and the close-up
// window shows the town go dark at midday, stars come out and the rooster crow. Three towns, each at a new spot; from
// level 1 the Earth turns, so the town slides along and you must follow it with the Moon; level 2 has four towns and a
// thinner shadow. Drag the Moon behind the Earth instead and it slides into the Earth's shadow and glows red: a lunar
// eclipse, not what the town needed.
(() => {
  const E = { x: 222, y: 370, R: 70 }, ORB = 124, MR = 19, SUN = { x: -70, y: 370, r: 120 }, INSET = { x: 74, y: 548, r: 50 };
  const TOWNS = [[-0.55, 0.45, -0.2, 0.7], [0.5, -0.7, 0.15, -0.35], [0.2, -0.5, 0.65, -0.1], [-0.3, 0.6, -0.65, 0.3]];
  const townXY = a => [E.x + E.R * Math.cos(Math.PI + a), E.y + E.R * Math.sin(Math.PI + a)];
  const moonXY = th => [E.x + ORB * Math.cos(th), E.y + ORB * Math.sin(th)];
  // where the Moon must sit: on the sunny side, at the town's height (sunlight runs left to right)
  const aimTh = ty => Math.PI - Math.asin(SK.clamp((ty - E.y) / ORB, -1, 1));
  function paintSpace(o) {
    const bg = o.createLinearGradient(0, 0, 360, 640); bg.addColorStop(0, '#0a0c28'); bg.addColorStop(0.6, '#1a1a4a'); bg.addColorStop(1, '#2a2058'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    P.stars(o, 360, 640, 140, 17, 0);
    const sg = o.createRadialGradient(SUN.x, SUN.y, SUN.r * 0.6, SUN.x, SUN.y, SUN.r * 2.4); sg.addColorStop(0, 'rgba(255,220,120,0.55)'); sg.addColorStop(1, 'rgba(255,180,80,0)'); o.fillStyle = sg; o.fillRect(0, 0, 360, 640);
    const sd = o.createRadialGradient(SUN.x + 20, SUN.y - 20, 10, SUN.x, SUN.y, SUN.r); sd.addColorStop(0, '#fffbe0'); sd.addColorStop(0.6, '#ffd860'); sd.addColorStop(1, '#ff9a30'); o.fillStyle = sd; o.beginPath(); o.arc(SUN.x, SUN.y, SUN.r, 0, 7); o.fill();
    // the orbit
    o.save(); o.strokeStyle = 'rgba(200,210,255,0.3)'; o.lineWidth = 2; o.setLineDash([6, 10]); o.beginPath(); o.arc(E.x, E.y, ORB, 0, 7); o.stroke(); o.restore();
  }
  function earth(c, t, spin) {
    const { x, y, R } = E;
    // the Earth's own shadow, stretching away from the Sun
    const sh = c.createLinearGradient(x, 0, 360, 0); sh.addColorStop(0, 'rgba(0,0,10,0.45)'); sh.addColorStop(1, 'rgba(0,0,10,0.15)'); c.fillStyle = sh; c.fillRect(x, y - R, 360 - x, R * 2);
    c.save(); c.beginPath(); c.arc(x, y, R, 0, 7); c.clip();
    const sea = c.createRadialGradient(x - R * 0.5, y, 4, x, y, R * 1.1); sea.addColorStop(0, '#6ac8f8'); sea.addColorStop(1, '#1e5aa8'); c.fillStyle = sea; c.fillRect(x - R, y - R, R * 2, R * 2);
    c.fillStyle = '#5aa84a'; for (const [a, d, rx, ry] of [[0.3, 0.5, 24, 16], [2.0, 0.4, 20, 26], [3.6, 0.55, 26, 14], [4.9, 0.3, 18, 14], [1.2, 0.75, 14, 10]]) { const aa = a + spin; c.beginPath(); c.ellipse(x + Math.cos(aa) * R * d, y + Math.sin(aa) * R * d, rx, ry, aa, 0, 7); c.fill(); }
    c.fillStyle = 'rgba(255,255,255,0.65)'; for (const [a, d] of [[1, 0.6], [2.8, 0.7], [4.4, 0.5]]) { const aa = a + spin * 1.3; c.beginPath(); c.ellipse(x + Math.cos(aa) * R * d, y + Math.sin(aa) * R * d, 16, 5, aa + 1.2, 0, 7); c.fill(); }
    const night = c.createLinearGradient(x - 8, 0, x + 18, 0); night.addColorStop(0, 'rgba(6,8,30,0)'); night.addColorStop(1, 'rgba(6,8,30,0.72)'); c.fillStyle = night; c.fillRect(x - R, y - R, R * 2, R * 2);
    c.restore(); c.strokeStyle = 'rgba(160,210,255,0.6)'; c.lineWidth = 3; c.beginPath(); c.arc(x, y, R + 2, 0, 7); c.stroke();
  }
  function moon(c, x, y, red, t) {
    c.save(); const col = P.mix('#e8e4f0', '#c8482a', red); SK.ball(c, x, y, MR, col, { edge: P.shade(col, -0.5) });
    c.fillStyle = P.rgba(P.shade(col, -0.3), 0.6); for (const [dx, dy, r] of [[-6, -4, 4], [5, 6, 3], [7, -6, 2.4]]) { c.beginPath(); c.arc(x + dx, y + dy, r, 0, 7); c.fill(); }
    // the Moon's own night side faces away from the Sun
    c.beginPath(); c.arc(x, y, MR, -Math.PI / 2, Math.PI / 2); c.fillStyle = 'rgba(10,10,40,0.45)'; c.fill(); c.restore();
  }
  function town(c, x, y, a, k) { // three tiny houses standing on the Earth's edge
    c.save(); c.translate(x, y); c.rotate(Math.PI + a - Math.PI / 2 + Math.PI);
    for (let i = -1; i <= 1; i++) { c.fillStyle = P.mix('#ffe0a0', '#4a4a6a', k); c.fillRect(i * 7 - 3, -9, 6, 8); c.fillStyle = P.mix('#e85a4a', '#3a2a4a', k); c.beginPath(); c.moveTo(i * 7 - 4, -9); c.lineTo(i * 7, -14); c.lineTo(i * 7 + 4, -9); c.fill(); }
    c.restore();
  }
  function inset(c, g, s, k, t) { // the close-up of the town: day, or dark at midday with stars and a crowing rooster
    const { x, y, r } = INSET; c.save(); c.beginPath(); c.arc(x, y, r, 0, 7); c.clip();
    c.fillStyle = P.mix('#8ad0f8', '#0e1440', k); c.fillRect(x - r, y - r, r * 2, r * 2);
    if (k > 0.5) { c.fillStyle = `rgba(255,255,230,${(k - 0.5) * 2})`; for (const [dx, dy] of [[-30, -30], [-8, -38], [20, -28], [34, -10], [-38, -8], [6, -20]]) { c.beginPath(); c.arc(x + dx, y + dy, 1.6, 0, 7); c.fill(); } }
    // the Sun, covered by the Moon as it goes dark
    const sx = x + 22, sy = y - 26; c.fillStyle = '#ffe070'; c.beginPath(); c.arc(sx, sy, 10, 0, 7); c.fill(); if (k > 0) { c.fillStyle = '#1a1a30'; c.beginPath(); c.arc(sx + 20 * (1 - k), sy, 10.5, 0, 7); c.fill(); if (k > 0.95) { c.strokeStyle = 'rgba(255,250,220,0.9)'; c.lineWidth = 2; c.beginPath(); c.arc(sx, sy, 12, 0, 7); c.stroke(); } }
    c.fillStyle = P.mix('#6ab84a', '#1a3a2a', k); c.fillRect(x - r, y + 16, r * 2, r);
    for (const [hx, w, h, col] of [[-30, 20, 18, '#f0c890'], [-4, 22, 24, '#e8a8a0'], [22, 18, 16, '#c8d8f0']]) { c.fillStyle = P.mix(col, '#2a2a48', k * 0.8); c.fillRect(x + hx, y + 16 - h, w, h); c.fillStyle = P.mix('#c84a3a', '#2a1a30', k * 0.8); c.beginPath(); c.moveTo(x + hx - 3, y + 16 - h); c.lineTo(x + hx + w / 2, y + 16 - h - 10); c.lineTo(x + hx + w + 3, y + 16 - h); c.fill();
      c.fillStyle = k > 0.6 ? '#ffe070' : P.mix('#5a7aa0', '#ffe070', k); c.fillRect(x + hx + w / 2 - 3, y + 16 - h + 5, 6, 6); }
    // the rooster on the middle roof
    const rx = x + 7, ry = y - 16, crow = s.crowT && t - s.crowT < 0.8; c.fillStyle = '#f4f0e8'; c.beginPath(); c.ellipse(rx, ry, 6, 5, 0, 0, 7); c.fill(); c.fillStyle = '#e83a2a'; c.beginPath(); c.arc(rx + 4, ry - 6, 3, 0, 7); c.fill(); c.fillStyle = '#f4f0e8'; c.beginPath(); c.arc(rx + 4, ry - 3, 3.2, 0, 7); c.fill();
    c.fillStyle = '#ffb040'; c.beginPath(); c.moveTo(rx + 7, ry - 4); c.lineTo(rx + (crow ? 13 : 11), ry - (crow ? 6 : 3)); c.lineTo(rx + 7, ry - 2); c.fill();
    c.restore(); c.strokeStyle = '#e8eaff'; c.lineWidth = 3; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
    if (crow) { c.save(); c.globalAlpha = 1 - (t - s.crowT) / 0.8; c.strokeStyle = '#fff6ea'; c.lineWidth = 2; for (let i = 1; i <= 3; i++) { c.beginPath(); c.arc(rx + 12, ry - 5, i * 5, -0.6, 0.6); c.stroke(); } c.restore(); }
  }
  function townAngle(g, s) { return s.towns[s.round] + (s.spin ? s.spin * (g.t - s.born) : 0); }
  MG.add({
    id: 'space_block', stage: 'space', cmd: 'SHADE EACH TOWN WITH THE MOON!', time: 6, mood: 'night', winText: 'Dark at midday!', failText: 'Still sunny!',
    card: { title: 'The Moon blocks the Sun', kind: 'Astronomy', ref: 'Solar eclipse',
      text: "The Moon goes round the Earth about once a month. Sometimes it passes exactly between the Sun and the Earth. Then it blocks the sunlight and casts a shadow on the Earth.\n\nThe shadow is small, so only places right under it go dark, for a few minutes, even at midday. Birds go quiet and stars come out. This is a total solar eclipse.\n\nWhen the Moon passes behind the Earth instead, it moves into the Earth's shadow. The only light that reaches it has bent through the Earth's air, which makes it glow red. That is a lunar eclipse.",
      note: 'A solar eclipse happens when the Moon passes between the Sun and the Earth and its shadow falls on the Earth.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level), v = SK.variant(g, 4);
      s.towns = TOWNS[v].slice(0, L === 2 ? 4 : 3); s.tol = [11, 9, 7][L]; s.spinR = [0, 0.1, 0.14][L];
      s.th = Math.PI * 0.3; s.round = 0; s.k = 0; s.drag = false; s.crowT = 0; s.doneT = 0; s.red = 0; this.next(g);
    },
    next(g) { const s = g.s; s.born = g.t; s.k = 0; s.spin = s.spinR * (s.towns[s.round] > 0 ? -1 : 1); s.doneT = 0; },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; const [mx, my] = moonXY(s.th); if (SK.dist(x, y, mx, my) < 48) { s.drag = true; g.sfx('pop'); } },
    move(g, x, y) { const s = g.s; if (s.drag && SK.dist(x, y, E.x, E.y) > 20) s.th = Math.atan2(y - E.y, x - E.x); },
    up(g) { g.s.drag = false; },
    update(g, dt) {
      const s = g.s; if (s.round >= s.towns.length) return;
      const [mx, my] = moonXY(s.th), [tx, ty] = townXY(townAngle(g, s));
      // in the Earth's shadow (behind it, away from the Sun): the Moon turns red
      const behind = mx > E.x && Math.abs(my - E.y) < E.R; s.red = SK.clamp(s.red + (behind ? 2 : -2) * dt, 0, 1);
      if (s.doneT) { if (g.t - s.doneT > 0.7 && !g.done) { s.round++; if (s.round < s.towns.length) { this.next(g); g.sfx('pop'); } } return; }
      if (g.done) return;
      const on = mx < E.x && Math.abs(my - ty) < s.tol;
      s.k = SK.clamp(s.k + (on ? 2.2 : -3) * dt, 0, 1);
      if (s.k >= 1) { s.doneT = g.t; s.crowT = g.t; g.sfx('tweet', { pitch: 0.7 }); g.sfx('chime'); if (s.round === s.towns.length - 1) { g.win(); g.sfx('cheer'); } }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', r = Math.min(s.round, s.towns.length - 1);
      c.drawImage(g.bake('block_bg', paintSpace), 0, 0, 360, 640);
      earth(c, t, s.spinR ? -t * 0.1 : t * 0.02);
      const ta = s.round < s.towns.length ? townAngle(g, s) : s.towns[r], [tx, ty] = townXY(ta), [mx, my] = moonXY(s.th), k = s.doneT ? 1 : s.k;
      // the Moon's shadow: a narrow cone toward the right, ending in a small dark spot where it meets the Earth
      if (mx < E.x) { const dy = my - E.y, hit = Math.abs(dy) < E.R ? E.x - Math.sqrt(E.R * E.R - dy * dy) : 360;
        const gr = c.createLinearGradient(mx, 0, hit, 0); gr.addColorStop(0, 'rgba(0,0,20,0.55)'); gr.addColorStop(1, 'rgba(0,0,20,0.35)'); c.fillStyle = gr; c.beginPath(); c.moveTo(mx, my - MR); c.lineTo(hit, my - 4); c.lineTo(hit, my + 4); c.lineTo(mx, my + MR); c.closePath(); c.fill();
        if (hit < 360) { c.fillStyle = 'rgba(0,0,20,0.7)'; c.beginPath(); c.ellipse(hit + 3, my, 4, 7, 0, 0, 7); c.fill(); } }
      town(c, tx, ty, ta, k);
      // the town's mark: a ring that fills while the shadow sits on it
      if (!g.done && !s.doneT) { const p = 0.5 + 0.5 * Math.sin(t * 6); c.save(); c.strokeStyle = s.k > 0 ? '#8affb0' : '#ffe27a'; c.globalAlpha = 0.7 + 0.3 * p; c.lineWidth = 2.5; c.setLineDash([4, 4]); c.beginPath(); c.arc(tx, ty, 15, 0, 7); c.stroke(); c.restore();
        if (s.k > 0) { c.strokeStyle = '#8affb0'; c.lineWidth = 4; c.beginPath(); c.arc(tx, ty, 20, -Math.PI / 2, -Math.PI / 2 + s.k * Math.PI * 2); c.stroke(); } }
      // a dotted line from the town to its close-up window
      c.save(); c.strokeStyle = 'rgba(230,235,255,0.45)'; c.lineWidth = 2; c.setLineDash([3, 6]); c.beginPath(); c.moveTo(tx - 6, ty + 6); c.lineTo(INSET.x + 30, INSET.y - INSET.r + 6); c.stroke(); c.restore();
      moon(c, mx, my, s.red, t);
      inset(c, g, s, k, t);
      SK.tag(c, 'Sun', 34, 300, 18); SK.tag(c, 'Earth', E.x + 30, E.y - E.R - 22, 18); SK.tag(c, 'Town', INSET.x + 90, INSET.y + 8, 18);
      if (!s.drag) SK.tag(c, 'Moon', SK.clamp(mx, 40, 320), my + (my > E.y ? 38 : -38), 18);
      if (!won) SK.tag(c, 'Town ' + (r + 1) + ' / ' + s.towns.length, 280, 172, 18);
      SK.animal(c, 'owl', 320, 610, 0.7, { t, pose: won ? 'cheer' : g.result === 'fail' ? 'sad' : 'idle', expr: won ? 'laugh' : g.result === 'fail' ? 'wow' : 'think', facing: -1 });
      // guidance: drag the Moon round to the sunny side, level with the town
      if (!g.done && !s.doneT) { const [ax, ay] = moonXY(aimTh(ty)); SK.grab(c, g, mx, my, MR + 6); SK.target(c, g, ax, ay, MR + 2); SK.arrow(c, g, mx, my, ax, ay, { from: 28, to: 30 }); SK.demo(g, c, 'drag', [mx, my], [ax, ay]); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.round >= s.towns.length) return; const B = s._bot = s._bot || {}; if (g.t < 1.0) return;
      const [mx, my] = moonXY(s.th), [, ty] = townXY(townAngle(g, s)), [ax, ay] = moonXY(aimTh(ty));
      if (!B.down) { if (s.doneT) return; B.down = 1; synth('down', mx, my); return; }
      synth('move', SK.lerp(mx, ax, 0.25), SK.lerp(my, ay, 0.25));
    },
  });
})();
