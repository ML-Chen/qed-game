// MELT THE ICE WITH SALT! (chemistry CB OC-08 SALT THE ROAD!) — a frosty street at dusk, −6 °C on the
// thermometer. Patches of ice block the pavement and a penguin wobbles at the edge of each. Drag the salt shaker over
// the ice: salt dissolves into the wet film on top, the salty water's freezing point drops below the air temperature
// (the thermometer's blue "Freezes at" marker slides down past the red air line) and the ice turns to slush, though the
// air is still below zero. Cover every bit of a patch and the penguin waddles on to the next. Two patches at level 0,
// three at level 1; level 2 is a colder night, so each spot needs more salt. If time runs out the penguin tries anyway
// and slides off on its belly.
(() => {
  const ROAD = { t: 404, b: 512 }, CW = 40, ROWS = [432, 482], K = 23, SH = 30;
  const LAY = { 2: [[78, 3], [214, 3]], 3: [[62, 2], [158, 2], [258, 2]] };
  const AIR = [[-6, -4, -7, -5], [-6, -8, -5, -7], [-12, -13, -11, -14]];
  function paintStreet(o) {
    const sky = o.createLinearGradient(0, 0, 0, ROAD.t); sky.addColorStop(0, '#2a3a6a'); sky.addColorStop(0.6, '#7a7aa8'); sky.addColorStop(1, '#e8c8d0'); o.fillStyle = sky; o.fillRect(0, 0, 360, ROAD.t);
    P.stars(o, 360, 200, 40, 9, 0);
    // snowy houses with lit windows
    for (const [x, w, h, col] of [[-10, 90, 120, '#8a6a8a'], [84, 80, 150, '#6a7aa0'], [170, 96, 110, '#a07a7a'], [272, 100, 140, '#7a8a9a']]) {
      o.fillStyle = col; o.fillRect(x, ROAD.t - 30 - h, w, h + 30); o.fillStyle = '#f4f8ff'; o.beginPath(); o.moveTo(x - 8, ROAD.t - 30 - h); o.lineTo(x + w / 2, ROAD.t - 70 - h); o.lineTo(x + w + 8, ROAD.t - 30 - h); o.closePath(); o.fill();
      o.fillStyle = '#ffd880'; for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) o.fillRect(x + 14 + i * (w - 42), ROAD.t - h + 4 + j * 46, 16, 20);
    }
    o.fillStyle = '#eef4ff'; o.fillRect(0, ROAD.t - 34, 360, 34); // a snowbank along the houses
    for (let i = 0; i < 12; i++) { o.beginPath(); o.arc(i * 32 + 10, ROAD.t - 34, 18, Math.PI, 0); o.fill(); }
    // the pavement
    const rd = o.createLinearGradient(0, ROAD.t, 0, ROAD.b); rd.addColorStop(0, '#8a8890'); rd.addColorStop(1, '#6a6870'); o.fillStyle = rd; o.fillRect(0, ROAD.t, 360, ROAD.b - ROAD.t);
    o.strokeStyle = 'rgba(40,30,50,0.25)'; o.lineWidth = 2; for (let x = 0; x < 360; x += 48) { o.beginPath(); o.moveTo(x, ROAD.t); o.lineTo(x - 10, ROAD.b); o.stroke(); }
    o.fillStyle = '#5a5862'; o.fillRect(0, ROAD.b, 360, 10); o.fillStyle = '#eef4ff'; o.fillRect(0, ROAD.b + 10, 360, 130);
    // a snowman and a lamp post in the snow below
    o.fillStyle = '#ffffff'; o.strokeStyle = '#b8c8e0'; o.lineWidth = 2; for (const [y, r] of [[588, 26], [550, 19], [522, 13]]) { o.beginPath(); o.arc(276, y, r, 0, 7); o.fill(); o.stroke(); }
    o.fillStyle = '#2a2a3a'; o.beginPath(); o.arc(271, 519, 2, 0, 7); o.arc(281, 519, 2, 0, 7); o.fill(); o.fillStyle = '#ff8a3a'; o.beginPath(); o.moveTo(276, 523); o.lineTo(290, 526); o.lineTo(276, 527); o.fill(); o.fillStyle = '#d84a4a'; o.fillRect(262, 532, 28, 6);
    o.fillStyle = '#3a3a4a'; o.fillRect(108, 540, 6, 72); o.fillStyle = '#ffe8a0'; o.beginPath(); o.arc(111, 536, 10, 0, 7); o.fill(); const lg = o.createRadialGradient(111, 536, 4, 111, 536, 50); lg.addColorStop(0, 'rgba(255,230,150,0.4)'); lg.addColorStop(1, 'rgba(255,230,150,0)'); o.fillStyle = lg; o.fillRect(60, 486, 102, 102);
    const r = P.rng(3); for (let i = 0; i < 30; i++) { o.fillStyle = 'rgba(180,200,230,0.5)'; o.beginPath(); o.ellipse(r() * 360, ROAD.b + 20 + r() * 100, 10 + r() * 20, 3, 0, 0, 7); o.fill(); }
  }
  function cellsOf(s) { const out = []; s.patches.forEach(([x0, n], p) => { for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) out.push({ p, x: x0 + CW / 2 + i * CW, y: ROWS[j], salt: 0, melted: false }); }); return out; }
  const patchCells = (s, p) => s.cells.filter(c => c.p === p);
  const patchSpan = (s, p) => { const [x0, n] = s.patches[p]; return [x0, x0 + n * CW]; };
  const fpOf = cell => -cell.salt * K; // the freezing point of the salty water on that spot
  function thermo(c, s, t) { // air temperature (red) and the freezing point of the water on the current patch (blue)
    const X = 318, T = 156, B = 330, lo = -16, hi = 4, yv = v => B - (v - lo) / (hi - lo) * (B - T);
    c.fillStyle = 'rgba(20,20,50,0.6)'; c.beginPath(); c.roundRect(X - 40, T - 14, 80, B - T + 44, 16); c.fill();
    c.fillStyle = '#f4f8ff'; c.beginPath(); c.roundRect(X - 7, T, 14, B - T, 7); c.fill(); c.beginPath(); c.arc(X, B + 10, 12, 0, 7); c.fill();
    c.fillStyle = '#e8403a'; c.beginPath(); c.roundRect(X - 4, yv(s.air), 8, B - yv(s.air) + 4, 4); c.fill(); c.beginPath(); c.arc(X, B + 10, 9, 0, 7); c.fill();
    c.strokeStyle = 'rgba(30,20,50,0.5)'; c.lineWidth = 1.5; for (let v = lo; v <= hi; v += 4) { c.beginPath(); c.moveTo(X - 12, yv(v)); c.lineTo(X - 7, yv(v)); c.stroke(); }
    c.save(); c.font = '900 13px Nunito, system-ui, sans-serif'; c.fillStyle = '#fff6ea'; c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillText('0°', X - 14, yv(0)); c.restore();
    // the freezing-point marker for the current patch: the least-salted spot still icy
    const cur = s.cells.filter(q => q.p === s.at && !q.melted), fp = cur.length ? Math.max(...cur.map(fpOf)) : -15, y = yv(Math.max(lo, fp));
    c.fillStyle = '#5ab8ff'; c.strokeStyle = '#1a2a5a'; c.lineWidth = 2; c.beginPath(); c.moveTo(X + 8, y); c.lineTo(X + 22, y - 9); c.lineTo(X + 22, y + 9); c.closePath(); c.fill(); c.stroke();
    return { yAir: yv(s.air), yFp: y };
  }
  MG.add({
    id: 'matter_saltroad', stage: 'matter', cmd: 'MELT THE ICE WITH SALT!', time: 6, mood: 'sea', winText: 'Melted below zero!', failText: 'Whee! Still icy!',
    card: { title: 'Salt melts ice below zero', kind: 'Chemistry', ref: 'Freezing point depression',
      text: 'Pure water freezes at 0 °C. When salt dissolves in water, the bits of salt get in the way of the water molecules locking together into ice. So salty water has to get colder before it freezes.\n\nSalt on icy ground dissolves into the thin wet layer on top of the ice. That salty water stays liquid at −6 °C, and it melts the ice it touches into slush.\n\nMore salt lowers the freezing point further, but only so far. On very cold nights salt stops working, and road crews spread sand for grip instead.',
      note: 'Dissolved salt makes water freeze at a lower temperature, so salted ice melts even below 0 °C.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level), v = SK.variant(g, 4);
      s.patches = LAY[L === 0 ? 2 : 3].map(([x, n]) => [x + [0, 8, -6, 4][v], n]); s.air = AIR[L][v]; s.cells = cellsOf(s); s.at = 0;
      s.pg = { x: 22, walk: false }; s.sh = { x: 200, y: 300 }; s.drag = false; s.grains = []; s.slipT = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; s.drag = true; s.sh.x = x; s.sh.y = y - SH; g.sfx('rustle', { vol: 0.4 }); },
    move(g, x, y) { const s = g.s; if (s.drag) { s.sh.x = x; s.sh.y = y - SH; } },
    up(g) { g.s.drag = false; },
    update(g, dt) {
      const s = g.s;
      // salt pours from the shaker while it is moved over the street
      if (s.drag && !g.done) { for (let i = 0; i < 3; i++) s.grains.push({ x: s.sh.x + (g.rand() - 0.5) * 30, y: s.sh.y + 18, vy: 120 + g.rand() * 80, ty: SK.clamp(s.sh.y + SH + (g.rand() - 0.5) * 60, ROAD.t + 6, ROAD.b - 6) });
        for (const q of s.cells) if (!q.melted && Math.abs(q.x - s.sh.x) < 30 && Math.abs(q.y - (s.sh.y + SH)) < 46) { q.salt += dt; if (fpOf(q) < s.air - 1) { q.melted = true; q.mT = g.t; g.sfx('drip', { pitch: 0.8 + g.rand() * 0.4 }); } } }
      for (const gr of s.grains) { gr.y += gr.vy * dt; } s.grains = s.grains.filter(gr => gr.y < gr.ty);
      if (s.grains.length > 120) s.grains.splice(0, s.grains.length - 120);
      // the penguin waits at the edge of the next icy patch, and walks on once it is slush
      if (!g.done && s.at < s.patches.length && patchCells(s, s.at).every(q => q.melted)) { s.at++; g.sfx('chime'); if (s.at >= s.patches.length) { g.win(); g.sfx('cheer'); } }
      const goal = s.at < s.patches.length ? patchSpan(s, s.at)[0] - 18 : 400; const dx = goal - s.pg.x;
      if (g.result === 'fail' && !s.slipT) s.slipT = g.t;
      if (s.slipT) s.pg.x += 160 * dt * Math.max(0, 1 - (g.t - s.slipT) * 0.5); else { s.pg.walk = dx > 1; if (s.pg.walk) s.pg.x += Math.min(dx, 70 * dt); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('saltroad_bg', paintStreet), 0, 0, 360, 640);
      // the ice patches: shiny where still frozen, grey-brown slush where melted
      s.patches.forEach(([x0, n], p) => { const w = n * CW; c.save(); c.beginPath(); c.roundRect(x0 - 4, ROAD.t + 4, w + 8, ROAD.b - ROAD.t - 8, 22); c.clip();
        for (const q of patchCells(s, p)) { const k = q.melted ? SK.clamp((t - q.mT) * 3, 0, 1) : 0; c.fillStyle = P.mix(P.mix('#cfefff', '#a8d8f8', q.salt * 2), '#8a8478', k); c.fillRect(q.x - CW / 2, q.y - 27, CW, 54);
          if (k > 0) { c.fillStyle = `rgba(200,220,240,${0.35 * k})`; c.beginPath(); c.ellipse(q.x, q.y + 6, 12, 4, 0, 0, 7); c.fill(); } else { c.fillStyle = 'rgba(255,255,255,0.7)'; c.fillRect(q.x - 12, q.y - 14, 18, 3); } }
        c.restore(); c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 2; c.beginPath(); c.roundRect(x0 - 4, ROAD.t + 4, w + 8, ROAD.b - ROAD.t - 8, 22); c.stroke(); });
      for (const gr of s.grains) { c.fillStyle = '#ffffff'; c.fillRect(gr.x - 1, gr.y - 1, 2.5, 2.5); }
      const th = thermo(c, s, t); SK.tag(c, 'Air ' + String(s.air).replace('-', '−') + '°', 318 - 70, th.yAir, 18, '#fff6ea', 'rgba(170,40,40,0.85)'); SK.tag(c, 'Freezes at', 318 - 60, SK.clamp(th.yFp + (Math.abs(th.yFp - th.yAir) < 30 ? (th.yFp > th.yAir ? 28 : -28) : 0), 150, 360), 18, '#fff6ea', 'rgba(30,90,170,0.85)');
      const left = s.patches.length - s.at; if (left > 0 && !g.done) SK.tag(c, 'Ice', SK.lerp(...patchSpan(s, s.at), 0.5), ROAD.t - 16, 18);
      if (!won) SK.tag(c, 'Patch ' + Math.min(s.at + 1, s.patches.length) + ' / ' + s.patches.length, 70, 170, 18);
      // the penguin
      const slide = s.slipT ? 1 : 0;
      if (slide) { c.save(); c.translate(s.pg.x, 470); c.rotate(-Math.PI / 2); SK.animal(c, 'penguin', 0, 0, 0.9, { t, pose: 'cheer', expr: 'wow', noShadow: true }); c.restore(); }
      else SK.animal(c, 'penguin', s.pg.x, 478, 1.05, { t, pose: won ? 'cheer' : s.pg.walk ? 'walk' : 'balance', expr: won ? 'laugh' : s.pg.walk ? 'happy' : 'wow' });
      // the salt shaker (waiting at the side until you pick it up)
      const sx = s.sh.x, sy = s.sh.y, tilt = s.drag ? Math.PI * 0.85 + Math.sin(t * 20) * 0.15 : 0; c.save(); c.translate(sx, sy); c.rotate(tilt);
      c.fillStyle = '#f4f4fa'; c.strokeStyle = '#4a4a6a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-14, -16, 28, 34, 8); c.fill(); c.stroke(); c.fillStyle = '#b8c0d8'; c.beginPath(); c.roundRect(-15, -24, 30, 11, 5); c.fill(); c.stroke();
      c.fillStyle = '#4a4a6a'; for (const dx of [-7, 0, 7]) { c.beginPath(); c.arc(dx, -19, 1.6, 0, 7); c.fill(); } c.restore();
      if (!s.drag) SK.tag(c, 'Salt', sx, sy + 34, 18);
      // guidance: scrub the shaker across the icy patch in front of the penguin
      if (!g.done && s.at < s.patches.length) { const [a, b] = patchSpan(s, s.at), ice = patchCells(s, s.at).filter(q => !q.melted), cy = ice.length && ice.every(q => q.y === ROWS[0]) ? ROWS[0] : ice.length && ice.every(q => q.y === ROWS[1]) ? ROWS[1] : 457;
        const from = [a + 4, cy], to = [b - 4, cy];
        if (!s.drag) { SK.grab(c, g, sx, sy, 26); SK.target(c, g, (a + b) / 2, 458, 0, { w: b - a + 10, h: ROAD.b - ROAD.t - 2 }); SK.arrow(c, g, sx, sy, (a + b) / 2, 440, { from: 30, to: 30 }); }
        SK.demo(g, c, 'drag', from, to, { period: 2.0 }); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.at >= s.patches.length || g.t < 1.0) return; const B = s._bot = s._bot || {};
      const ice = s.cells.filter(q => q.p === s.at && !q.melted); if (!ice.length) return; const q = ice[0];
      if (!B.down) { B.down = 1; synth('down', q.x, q.y); return; } const k = Math.sin(g.t * 7); synth('move', q.x + k * 8, q.y + k * 6);
    },
  });
})();
