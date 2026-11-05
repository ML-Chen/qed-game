// DUNK! (chem_bio HB-10, reworked as mixing) — a lab bench with a beaker; a red blood cell floats in it, seen big
// through the glass. Water moves through the cell's skin toward the saltier side: in water that is too fresh, water
// rushes in (blue arrows) and the cell swells into a ball; in water that is too salty, water leaves and it shrivels
// into a spiky raisin. Tap the shaker to add salt, hold the jug to pour in fresh water, and bring the beaker to the same
// saltiness as blood (the green band on the Salt gauge): the arrows stop and the cell settles back to a plump dimpled
// disc. Then the next beaker slides in, mixed differently. Pour far too much water and the cell pops like a balloon.
// Level 0: two beakers; level 1: three; level 2: three, with a narrower band.
(() => {
  const BK = { x: 180, y: 346, w: 190, h: 220 }, SALT = { x: 92, y: 566, w: 150, h: 70 }, WAT = { x: 268, y: 566, w: 150, h: 70 };
  const POUR = 0.4, SALTR = 0.36, HOLD_OK = 0.35;
  const STARTS = [[[0.62, 1.45], [1.5, 0.66], [0.58, 1.4], [1.42, 0.6]], [[0.6, 1.5, 0.74], [1.46, 0.64, 1.3], [0.7, 1.52, 0.6], [1.36, 0.62, 1.5]], [[1.52, 0.6, 1.3], [0.62, 1.32, 0.7], [1.4, 0.64, 1.56], [0.68, 1.5, 0.6]]];
  const inBtn = (b, x, y) => Math.abs(x - b.x) <= b.w / 2 + 6 && Math.abs(y - b.y) <= b.h / 2 + 8;
  function paintBg(o) {
    const wall = o.createLinearGradient(0, 0, 0, 640); wall.addColorStop(0, '#2a7ab0'); wall.addColorStop(0.55, '#7ac4e0'); wall.addColorStop(1, '#bfe6f0'); o.fillStyle = wall; o.fillRect(0, 0, 360, 640);
    const r = P.rng(4); for (let i = 0; i < 22; i++) { const x = r() * 360, y = r() * 480, rr = 4 + r() * 16; o.strokeStyle = 'rgba(255,255,255,0.25)'; o.lineWidth = 2; o.beginPath(); o.arc(x, y, rr, 0, 7); o.stroke(); }
    // a shelf of glassware
    o.fillStyle = 'rgba(20,50,80,0.35)'; o.fillRect(0, 122, 360, 8);
    for (const [x, h, col] of [[26, 40, '#f4a0c0'], [320, 52, '#a0e0a0'], [344, 30, '#f8d870']]) { o.fillStyle = 'rgba(255,255,255,0.35)'; o.beginPath(); o.roundRect(x - 12, 122 - h, 24, h, 6); o.fill(); o.fillStyle = col; o.beginPath(); o.roundRect(x - 10, 122 - h * 0.55, 20, h * 0.55 - 2, 5); o.fill(); }
    // the bench
    const bn = o.createLinearGradient(0, 470, 0, 640); bn.addColorStop(0, '#f2dca8'); bn.addColorStop(1, '#d8b878'); o.fillStyle = bn; o.fillRect(0, 466, 360, 174);
    o.fillStyle = 'rgba(120,80,30,0.25)'; o.fillRect(0, 466, 360, 5);
  }
  // the cell, seen face on: k = size (1 plump, >1 swollen round, <1 shrivelled and spiky)
  function rbc(c, x, y, k, t, popT) {
    if (popT) { const q = SK.clamp((t - popT) / 0.5, 0, 1); c.save(); c.globalAlpha = 1 - q; c.strokeStyle = '#e8303a'; c.lineWidth = 4; for (let i = 0; i < 10; i++) { const a = i * 0.628; c.beginPath(); c.moveTo(x + Math.cos(a) * (30 + q * 40), y + Math.sin(a) * (30 + q * 40)); c.lineTo(x + Math.cos(a) * (46 + q * 70), y + Math.sin(a) * (46 + q * 70)); c.stroke(); }
      c.fillStyle = '#e8505a'; for (let i = 0; i < 7; i++) { const a = i * 0.9; c.beginPath(); c.ellipse(x + Math.cos(a) * q * 70, y + Math.sin(a) * q * 70, 8, 4, a, 0, 7); c.fill(); } c.restore(); return; }
    const R = 46 * Math.pow(k, 0.85), spikes = SK.clamp((0.92 - k) / 0.3, 0, 1), dimple = SK.clamp((1.18 - k) / 0.2, 0, 1);
    c.save(); c.translate(x, y + Math.sin(t * 1.6) * 3);
    c.beginPath(); for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2, rr = R * (1 + spikes * 0.18 * Math.max(0, Math.sin(a * 9 + 0.5)) - spikes * 0.06); c[i ? 'lineTo' : 'moveTo'](Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath();
    const gr = c.createRadialGradient(-R * 0.3, -R * 0.35, R * 0.1, 0, 0, R); gr.addColorStop(0, '#ff8a8a'); gr.addColorStop(0.7, '#e0303a'); gr.addColorStop(1, '#a01424');
    c.fillStyle = gr; c.fill(); c.strokeStyle = '#6a0a14'; c.lineWidth = 2.5; c.stroke();
    // the dimple in the middle of a healthy cell (gone when swollen)
    if (dimple > 0) { const dg = c.createRadialGradient(0, 0, 2, 0, 0, R * 0.55); dg.addColorStop(0, `rgba(255,190,190,${0.75 * dimple})`); dg.addColorStop(1, 'rgba(255,190,190,0)'); c.fillStyle = dg; c.beginPath(); c.arc(0, 0, R * 0.55, 0, 7); c.fill(); }
    c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.ellipse(-R * 0.38, -R * 0.42, R * 0.22, R * 0.12, -0.6, 0, 7); c.fill();
    if (k > 1.25) { c.strokeStyle = 'rgba(255,220,220,0.7)'; c.lineWidth = 1.5; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(0, 0, R * (0.6 + i * 0.12), -0.9 + i, -0.3 + i); c.stroke(); } }
    c.restore();
  }
  function shaker(c, x, y, tilt) { c.save(); c.translate(x, y); c.rotate(tilt); c.fillStyle = '#f4f4f8'; c.strokeStyle = '#4a4a6a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-14, -20, 28, 40, 8); c.fill(); c.stroke(); c.fillStyle = '#b8b8c8'; c.beginPath(); c.roundRect(-14, 14, 28, 10, 4); c.fill(); c.stroke(); c.fillStyle = '#4a4a6a'; for (const dx of [-6, 0, 6]) { c.beginPath(); c.arc(dx, 20, 1.6, 0, 7); c.fill(); } c.restore(); }
  function jug(c, x, y, tilt) { c.save(); c.translate(x, y); c.rotate(tilt); c.fillStyle = 'rgba(200,235,255,0.85)'; c.strokeStyle = '#2a5a8a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-18, -24); c.lineTo(16, -24); c.lineTo(22, -30); c.lineTo(20, 22); c.lineTo(-18, 22); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#5ab4e8'; c.fillRect(-16, -6, 34, 26); c.beginPath(); c.arc(-24, 0, 10, Math.PI * 0.5, Math.PI * 1.5); c.stroke(); c.restore(); }
  function button(c, b, label, active, t, pressed) {
    c.save(); c.translate(b.x, b.y + (pressed ? 3 : 0));
    c.fillStyle = 'rgba(30,14,36,0.35)'; c.beginPath(); c.roundRect(-b.w / 2, -b.h / 2 + 6, b.w, b.h, 18); c.fill();
    const gr = c.createLinearGradient(0, -b.h / 2, 0, b.h / 2); gr.addColorStop(0, P.shade(b.col, active ? 0.25 : -0.1)); gr.addColorStop(1, P.shade(b.col, active ? -0.2 : -0.45));
    c.fillStyle = gr; c.strokeStyle = '#1a2a3a'; c.lineWidth = 3; c.beginPath(); c.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 18); c.fill(); c.stroke();
    c.font = '900 20px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 4; c.strokeStyle = 'rgba(20,10,30,0.6)';
    label.forEach((l, i) => { const y = (i - (label.length - 1) / 2) * 22; c.strokeText(l, 0, y); c.fillStyle = '#fff6ea'; c.fillText(l, 0, y); });
    c.restore();
  }
  SALT.col = '#9a8ad8'; WAT.col = '#3a9ad8';
  function newBeaker(g) { const s = g.s; s.c = s.starts[s.i]; s.k = 1; s.ok = 0; s.lvl = 0.62; s.inT = g.t; s.grains = []; s.popT = 0; s.doneT = 0; }
  MG.add({
    id: 'dunk', stage: 'cells', cmd: 'MAKE EVERY BLOOD CELL PLUMP!', time: 6, mood: 'sea', winText: 'Just as salty as blood!', failText: 'Pop!',
    card: { title: 'Water goes to the salty side', kind: 'Biology', ref: 'Osmosis',
      text: 'A cell\'s outer skin, its membrane, lets water through but holds the salt back. Water moves through it toward the side with more salt in it. This is called osmosis.\n\nIn fresh water, water rushes into a red blood cell until it swells and can burst. In very salty water, water leaves the cell and it shrivels. When the water around it is just as salty as the inside of the cell, as much water goes in as comes out, and the cell keeps its shape.\n\nThat is why a hospital drip is saline, salt water as salty as blood, and not plain water.',
      note: 'Water moves into or out of a cell toward the saltier side, so cells stay healthy only in water as salty as they are.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.lv = lv; s.v = SK.variant(g, 4);
      s.starts = STARTS[lv][s.v]; s.need = s.starts.length; s.band = [0.1, 0.085, 0.065][lv]; s.i = 0; s.pourOn = false; s.saltOn = false; s.shakeT = -9; s.drops = [];
      newBeaker(g); s.slide = 0;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || s.doneT || s.popT) return;
      if (inBtn(SALT, x, y)) { s.saltOn = true; SK.holdStart(g); g.sfx('rustle', { vol: 0.4 }); }
      else if (inBtn(WAT, x, y)) { s.pourOn = true; SK.holdStart(g); g.sfx('splash', { vol: 0.5 }); }
    },
    up(g) { const s = g.s; if (s.pourOn || s.saltOn) { s.pourOn = s.saltOn = false; SK.holdEnd(g); } },
    update(g, dt) {
      const s = g.s, t = g.t;
      if (s.slide > 0) { s.slide = Math.max(0, s.slide - dt * 3.2); }
      if (s.doneT) { if (t - s.doneT > 0.55 && !g.done) { s.i++; if (s.i >= s.need) { g.win(); g.sfx('cheer'); } else { newBeaker(g); s.slide = 1; g.sfx('swoosh'); } } return; }
      if (s.popT || g.done) return;
      if (s.saltOn) { s.c += SALTR * dt; s.shakeT = t; if (g.rand() < 0.9) s.grains.push({ x: BK.x - 50 + g.rand() * 24, y: BK.y - 126, vy: 60 + g.rand() * 80, vx: (g.rand() - 0.3) * 30, life: 1.2 }); if (t - (s.rusT || 0) > 0.2) { s.rusT = t; g.sfx('rustle', { vol: 0.35 }); } }
      if (s.pourOn) { s.c *= Math.exp(-POUR * dt); s.lvl = Math.min(0.86, s.lvl + dt * 0.06); if (g.rand() < 0.8) s.drops.push({ x: BK.x + 44 + g.rand() * 8, y: BK.y - 110, vy: 300, life: 0.4 }); if (t - (s.dripT || 0) > 0.25) { s.dripT = t; g.sfx('drip', { vol: 0.4 }); } }
      // osmosis: the cell's size slides toward the size this water gives it
      const want = SK.clamp(1 + (1 / s.c - 1) * 0.75, 0.55, 1.9); s.k += (want - s.k) * Math.min(1, dt * 2.4);
      if (s.k > 1.62) { s.popT = t; g.fail(); g.sfx('snap'); g.sfx('laugh'); g.burst(BK.x, BK.y + 20, ['#e8303a', '#ff8a8a', '#ffffff'], 18, 200); return; }
      const inBand = Math.abs(s.c - 1) <= s.band && Math.abs(s.k - 1) < 0.1 && !s.saltOn && !s.pourOn;
      s.ok = inBand ? s.ok + dt : 0;
      if (s.ok >= HOLD_OK) { s.doneT = t; g.sfx('chime'); g.sfx('sparkle'); g.burst(BK.x, BK.y + 20, ['#fff6c0', '#ffd45a', '#8affb0'], 14, 150); if (s.pourOn || s.saltOn) { s.pourOn = s.saltOn = false; SK.holdEnd(g); } }
      for (const p of s.grains) { p.vy += 200 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; } s.grains = s.grains.filter(p => p.life > 0 && p.y < BK.y + BK.h / 2 - 8);
      for (const p of s.drops) { p.y += p.vy * dt; p.life -= dt; } s.drops = s.drops.filter(p => p.life > 0);
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('dunk_bg', paintBg), 0, 0, 360, 640);
      // beakers still to mix wait on the bench at the right; finished ones on the left
      for (let j = 0; j < s.need; j++) { if (j === s.i && !won) continue; const done = j < s.i || won, x = done ? 80 + j * 22 : 286 + (j - s.i) * 22, y = 494;
        c.fillStyle = 'rgba(255,255,255,0.5)'; c.strokeStyle = '#2a5a8a'; c.lineWidth = 2; c.beginPath(); c.roundRect(x - 9, y - 28, 18, 30, 4); c.fill(); c.stroke(); c.fillStyle = done ? '#ff8a90' : '#8ad0f0'; c.fillRect(x - 7, y - 14, 14, 14); }
      const ox = s.slide * 260, bx = BK.x + ox, top = BK.y - BK.h / 2, bot = BK.y + BK.h / 2;
      // the beaker of water
      c.save(); c.translate(ox, 0);
      const wl = bot - BK.h * s.lvl; c.fillStyle = s.c > 1 + s.band ? 'rgba(210,230,240,0.75)' : 'rgba(150,210,245,0.7)'; c.beginPath(); c.roundRect(BK.x - BK.w / 2 + 4, wl, BK.w - 8, bot - wl - 4, [0, 0, 16, 16]); c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 2; c.beginPath(); c.moveTo(BK.x - BK.w / 2 + 8, wl + Math.sin(t * 3) * 1.5); c.lineTo(BK.x + BK.w / 2 - 8, wl - Math.sin(t * 3) * 1.5); c.stroke();
      // salt dissolving: a few grains settle and fade, more the saltier it is
      const rr = P.rng(5); for (let i = 0; i < Math.round(s.c * 14); i++) { c.fillStyle = 'rgba(255,255,255,0.55)'; c.fillRect(BK.x - 80 + rr() * 160, wl + 10 + rr() * (bot - wl - 20), 2, 2); }
      // water moving through the cell's skin: in when the water is fresher than the cell, out when it is saltier
      const flow = SK.clamp((1 - s.c) * 3, -1, 1), cy0 = BK.y + 30;
      if (Math.abs(s.c - 1) > s.band * 0.6 && !s.popT && !s.doneT) for (let i = 0; i < 6; i++) { const a = i * 1.047 + 0.3, q = ((t * 1.4 + i * 0.17) % 1), R0 = 46 * s.k, d = flow > 0 ? R0 + 34 - q * 30 : R0 - 4 + q * 30;
        c.save(); c.translate(bx - ox + Math.cos(a) * d, cy0 + Math.sin(a) * d); c.rotate(a + (flow > 0 ? Math.PI : 0)); c.globalAlpha = Math.min(1, Math.abs(flow) * 1.5) * (1 - Math.abs(q - 0.5)); c.fillStyle = '#1a6ad8'; c.beginPath(); c.moveTo(10, 0); c.lineTo(-6, -7); c.lineTo(-6, 7); c.closePath(); c.fill(); c.restore(); }
      rbc(c, BK.x, cy0, s.k, t, s.popT);
      // the glass itself
      c.strokeStyle = 'rgba(40,80,120,0.8)'; c.lineWidth = 4; c.beginPath(); c.moveTo(BK.x - BK.w / 2 - 6, top); c.lineTo(BK.x - BK.w / 2, top + 6); c.lineTo(BK.x - BK.w / 2, bot - 16); c.quadraticCurveTo(BK.x - BK.w / 2, bot, BK.x - BK.w / 2 + 16, bot); c.lineTo(BK.x + BK.w / 2 - 16, bot); c.quadraticCurveTo(BK.x + BK.w / 2, bot, BK.x + BK.w / 2, bot - 16); c.lineTo(BK.x + BK.w / 2, top + 6); c.lineTo(BK.x + BK.w / 2 + 6, top); c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(BK.x - BK.w / 2 + 10, top + 16, 10, BK.h - 40);
      c.restore();
      for (const p of s.grains) { c.fillStyle = '#ffffff'; c.fillRect(p.x, p.y, 3, 3); }
      for (const p of s.drops) { c.fillStyle = '#5ab4e8'; c.beginPath(); c.ellipse(p.x, p.y, 3, 6, 0, 0, 7); c.fill(); }
      shaker(c, BK.x - 44, top - 38 + (t - s.shakeT < 0.2 ? -8 : 0), 2.6 + (t - s.shakeT < 0.2 ? Math.sin((t - s.shakeT) * 40) * 0.3 : 0));
      jug(c, BK.x + 58, top - 46, s.pourOn ? -1.0 : -0.25);
      if (!g.done) SK.tag(c, 'Red blood cell', BK.x, BK.y + 30 + 46 * Math.min(s.k, 1.4) + 24, 18, '#fff6ea', 'rgba(140,20,40,0.88)');
      // the Salt gauge: how salty the beaker is, with the green band where it matches blood
      if (!g.done) { const GX = 40, GY = 160, GW = 280, f = v => GX + GW * SK.clamp((v - 0.4) / 1.3, 0, 1);
        c.fillStyle = 'rgba(30,14,36,0.65)'; c.beginPath(); c.roundRect(GX - 8, GY - 14, GW + 16, 28, 14); c.fill();
        const lg = c.createLinearGradient(GX, 0, GX + GW, 0); lg.addColorStop(0, '#8ad0ff'); lg.addColorStop(1, '#ffffff'); c.fillStyle = lg; c.fillRect(GX, GY - 5, GW, 10);
        c.fillStyle = '#5ad07a'; c.fillRect(f(1 - s.band), GY - 9, f(1 + s.band) - f(1 - s.band), 18);
        const nx = f(s.c), ok = Math.abs(s.c - 1) <= s.band; c.fillStyle = ok ? '#c8ffc8' : '#ffd45a'; c.strokeStyle = '#1a1030'; c.lineWidth = 2; c.beginPath(); c.moveTo(nx, GY + 6); c.lineTo(nx - 9, GY - 18); c.lineTo(nx + 9, GY - 18); c.closePath(); c.fill(); c.stroke();
        SK.tag(c, 'Salt', GX + 20, GY + 30, 18); SK.tag(c, 'Beaker ' + Math.min(s.i + 1, s.need) + ' / ' + s.need, 180, 502, 18);
        if ((s.saltOn || s.pourOn) && !s.doneT) { const go = s.saltOn ? s.c < 1 - s.band : s.c > 1 + s.band; SK.tag(c, ok ? 'Let go now!' : go ? 'Keep holding...' : 'Too far!', BK.x, BK.y - 80, 20, '#fff6ea', ok ? 'rgba(40,150,70,0.95)' : go ? 'rgba(30,14,36,0.75)' : 'rgba(190,40,40,0.9)'); }
        else if (ok && s.ok > 0) SK.tag(c, 'Plump!', BK.x, BK.y - 80, 20, '#fff6ea', 'rgba(40,150,70,0.95)'); }
      button(c, SALT, ['Hold to shake', 'salt'], !g.done && s.c < 1 - s.band, t, s.saltOn);
      button(c, WAT, ['Hold to pour', 'water'], !g.done && s.c > 1 + s.band, t, s.pourOn);
      SK.animal(c, 'octopus', 36, 488, 0.66, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : s.k > 1.3 || s.k < 0.75 ? 'wow' : 'happy', facing: 1 });
      // guidance: salt when the water is too fresh, a hold of the right length when it is too salty
      if (g.done || s.doneT || s.popT) return;
      if (s.c < 1 - s.band * 0.5) { const need = (1 - s.c) / SALTR; SK.glow(c, g, SALT.x, SALT.y, 46, '#ffe27a', { level: 2 }); SK.demo(g, c, 'hold', [SALT.x, SALT.y + 6], null, { period: Math.max(0.9, need / 0.65) }); }
      else if (s.c > 1 + s.band * 0.5) { const need = Math.log(s.c) / POUR; SK.glow(c, g, WAT.x, WAT.y, 46, '#ffe27a', { level: 2 }); SK.demo(g, c, 'hold', [WAT.x, WAT.y + 6], null, { period: Math.max(0.9, need / 0.65) }); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 0.8 || s.doneT || s.popT) return;
      if (s.pourOn) { if (s.c <= 1.0) synth('up', WAT.x, WAT.y); return; }
      if (s.saltOn) { if (s.c >= 1.0) synth('up', SALT.x, SALT.y); return; }
      if (s.c < 1 - s.band * 0.4) synth('down', SALT.x, SALT.y);
      else if (s.c > 1 + s.band * 0.4) synth('down', WAT.x, WAT.y);
    },
  });
})();
