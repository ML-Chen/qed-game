// PUT IT OUT! (chem_bio FP-03) — a workshop with three small fires on the bench: a waste-paper bin, a plugged-in toaster
// and a deep fryer. Drag an extinguisher from the rack onto a fire and it sprays. Water soaks the paper bin out. Carbon
// dioxide smothers the toaster without wetting the live wires. The wet chemical makes a soapy crust over the hot oil.
// The wrong one does not work: water on the toaster crackles with sparks, carbon dioxide only blows the fryer's flames
// about, and water on the fryer flashes into steam and throws burning oil up in a cartoon whoosh (that ends the game).
// Level 2: a fourth fire, a tray of burning metal shavings, that only the special metal-fire powder puts out.
(() => {
  const BENCH = 392;
  const EXT = { water: { band: '#e8403a', label: 'drop' }, co2: { band: '#2a2a30', label: 'cloud' }, wet: { band: '#f2c230', label: 'pan' }, metal: { band: '#3a7ad8', label: 'cube' } };
  const WORKS = { bin: ['water', 'wet'], toaster: ['co2'], fryer: ['wet'], metal: ['metal'] };
  function paintBg(o) {
    const wall = o.createLinearGradient(0, 0, 0, BENCH); wall.addColorStop(0, '#5a6a7a'); wall.addColorStop(1, '#8a9aa8'); o.fillStyle = wall; o.fillRect(0, 0, 360, 640);
    o.strokeStyle = 'rgba(255,255,255,0.08)'; o.lineWidth = 1; for (let x = 0; x < 360; x += 40) { o.beginPath(); o.moveTo(x, 120); o.lineTo(x, BENCH); o.stroke(); }
    // a pegboard of tools
    o.fillStyle = '#c8a878'; o.fillRect(20, 140, 320, 130); o.fillStyle = 'rgba(90,60,30,0.35)'; for (let y = 152; y < 266; y += 14) for (let x = 32; x < 336; x += 14) { o.beginPath(); o.arc(x, y, 1.6, 0, 7); o.fill(); }
    o.strokeStyle = '#5a5a60'; o.lineWidth = 5; o.lineCap = 'round'; o.beginPath(); o.moveTo(60, 160); o.lineTo(60, 220); o.moveTo(110, 160); o.lineTo(132, 230); o.stroke();
    o.fillStyle = '#c84a3a'; o.fillRect(52, 214, 16, 30); o.fillStyle = '#7a7a82'; o.beginPath(); o.arc(250, 200, 26, 0, 7); o.fill(); o.fillStyle = '#c8a878'; o.beginPath(); o.arc(250, 200, 12, 0, 7); o.fill();
    o.fillStyle = '#e8c040'; o.fillRect(290, 160, 30, 90); o.fillStyle = '#5a4a20'; for (let i = 0; i < 8; i++) o.fillRect(292, 168 + i * 10, 8, 2);
    // the wall socket for the toaster
    o.fillStyle = '#f4f0e8'; o.beginPath(); o.roundRect(200, 300, 30, 36, 5); o.fill(); o.fillStyle = '#3a3a40'; o.fillRect(208, 310, 4, 9); o.fillRect(218, 310, 4, 9);
    // the bench
    const bn = o.createLinearGradient(0, BENCH, 0, BENCH + 30); bn.addColorStop(0, '#a87a4a'); bn.addColorStop(1, '#6a4a2a'); o.fillStyle = bn; o.fillRect(0, BENCH, 360, 30);
    o.fillStyle = '#5a3a22'; o.fillRect(14, BENCH + 30, 14, 100); o.fillRect(332, BENCH + 30, 14, 100);
    // the concrete floor and the extinguisher rack
    const fl = o.createLinearGradient(0, BENCH + 30, 0, 640); fl.addColorStop(0, '#6a6a70'); fl.addColorStop(1, '#4a4a52'); o.fillStyle = fl; o.fillRect(0, BENCH + 30, 360, 640 - BENCH - 30);
    o.fillStyle = '#e8c040'; for (let x = 0; x < 360; x += 30) { o.save(); o.beginPath(); o.rect(0, 586, 360, 10); o.clip(); o.beginPath(); o.moveTo(x, 596); o.lineTo(x + 15, 586); o.lineTo(x + 30, 586); o.lineTo(x + 15, 596); o.fill(); o.restore(); }
    P.vignette(o, 360, 640, 0.25, '#1a1a2a');
  }
  function icon(c, kind, x, y) {
    c.save(); c.translate(x, y); c.fillStyle = '#fff6ea'; c.beginPath(); c.arc(0, 0, 10, 0, 7); c.fill(); c.fillStyle = '#2a2a30'; c.strokeStyle = '#2a2a30'; c.lineWidth = 2;
    if (kind === 'drop') { c.fillStyle = '#3a8ae8'; c.beginPath(); c.moveTo(0, -7); c.quadraticCurveTo(6, 1, 0, 6); c.quadraticCurveTo(-6, 1, 0, -7); c.fill(); }
    if (kind === 'cloud') { c.fillStyle = '#7a7a88'; c.beginPath(); c.arc(-3, 1, 4, 0, 7); c.arc(3, 0, 5, 0, 7); c.arc(0, -3, 4, 0, 7); c.fill(); }
    if (kind === 'pan') { c.fillRect(-6, -1, 10, 5); c.fillRect(4, 0, 5, 2); c.fillStyle = '#f2a030'; c.beginPath(); c.moveTo(-4, -2); c.lineTo(-1, -8); c.lineTo(2, -2); c.fill(); }
    if (kind === 'cube') { c.fillStyle = '#9aa0aa'; c.fillRect(-5, -4, 9, 9); c.fillStyle = '#c8ccd4'; c.beginPath(); c.moveTo(-5, -4); c.lineTo(-2, -7); c.lineTo(7, -7); c.lineTo(4, -4); c.fill(); }
    c.restore();
  }
  function extinguisher(c, e, t) {
    const E = EXT[e.kind]; c.save(); c.translate(e.x, e.y); c.rotate(e.tilt || 0); c.scale(1.2, 1.2);
    SK.shadow(c, 0, 30, 18, 5, 0.3);
    c.fillStyle = '#d8342a'; c.strokeStyle = '#6a1410'; c.lineWidth = 2; c.beginPath(); c.roundRect(-14, -26, 28, 56, 10); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(-9, -20, 4, 42);
    c.fillStyle = E.band; c.fillRect(-14, -4, 28, 18); icon(c, E.label, 0, 5);
    c.fillStyle = '#3a3a40'; c.fillRect(-6, -36, 12, 10); c.strokeStyle = '#2a2a30'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(4, -32); c.quadraticCurveTo(22, -34, 22, -14); c.stroke();
    c.restore();
  }
  function fireArt(c, f, t) {
    const x = f.x, y = BENCH;
    if (f.kind === 'bin') { c.fillStyle = '#9aa0a8'; c.strokeStyle = '#4a5058'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 20, y - 40); c.lineTo(x + 20, y - 40); c.lineTo(x + 15, y); c.lineTo(x - 15, y); c.closePath(); c.fill(); c.stroke(); for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(x - 16 + i * 11, y - 40); c.lineTo(x - 12 + i * 8, y); c.stroke(); } c.fillStyle = '#f4f0e0'; c.beginPath(); c.moveTo(x - 14, y - 40); c.lineTo(x - 6, y - 52); c.lineTo(x + 4, y - 42); c.lineTo(x + 12, y - 50); c.lineTo(x + 16, y - 40); c.fill(); }
    if (f.kind === 'toaster') { c.strokeStyle = '#2a2a30'; c.lineWidth = 3; c.beginPath(); c.moveTo(x + 22, y - 10); c.quadraticCurveTo(x + 40, y - 6, 215, 330); c.stroke(); c.fillStyle = '#c8ccd4'; c.strokeStyle = '#4a4e58'; c.lineWidth = 2; c.beginPath(); c.roundRect(x - 24, y - 40, 48, 40, 10); c.fill(); c.stroke(); c.fillStyle = '#2a2a30'; c.fillRect(x - 14, y - 42, 10, 4); c.fillRect(x + 4, y - 42, 10, 4); c.fillStyle = '#e8403a'; c.fillRect(x + 18, y - 26, 5, 10); }
    if (f.kind === 'fryer') { c.fillStyle = '#3a3a42'; c.strokeStyle = '#1a1a20'; c.lineWidth = 2; c.beginPath(); c.roundRect(x - 26, y - 34, 52, 34, 6); c.fill(); c.stroke(); c.fillStyle = '#e8b040'; c.beginPath(); c.ellipse(x, y - 34, 24, 5, 0, 0, 7); c.fill(); c.fillStyle = '#1a1a20'; c.fillRect(x + 26, y - 30, 14, 4); if (f.crust) { c.fillStyle = `rgba(255,250,230,${Math.min(1, f.crust)})`; for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(x - 18 + i * 6, y - 36 + Math.sin(i * 2) * 2, 4, 0, 7); c.fill(); } } }
    if (f.kind === 'metal') { c.fillStyle = '#6a6a72'; c.beginPath(); c.roundRect(x - 26, y - 12, 52, 12, 3); c.fill(); for (let i = 0; i < 12; i++) { c.strokeStyle = i % 2 ? '#c8ccd4' : '#9aa0aa'; c.lineWidth = 2; c.beginPath(); c.arc(x - 20 + B3.hash(i) * 40, y - 14, 3 + B3.hash(i * 2) * 3, 0, Math.PI * 1.5); c.stroke(); } if (f.powder) { c.fillStyle = `rgba(230,230,240,${Math.min(1, f.powder)})`; c.beginPath(); c.ellipse(x, y - 14, 26, 9, 0, Math.PI, 0); c.fill(); } }
    // the flames
    const k = f.out ? 0 : f.k, top = f.kind === 'fryer' ? y - 36 : f.kind === 'toaster' ? y - 40 : f.kind === 'metal' ? y - 14 : y - 44;
    if (k > 0.02) { const metal = f.kind === 'metal'; B3.glow(c, x, top - 20, 60 * k + 20, metal ? '220,230,255' : '255,140,60', 0.4);
      if (metal) { for (let i = 0; i < 3; i++) { c.save(); c.globalCompositeOperation = 'lighter'; B3.flame(c, x + (i - 1) * 14, top + 2, 0.55 * k, t, k, i); c.restore(); } c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.arc(x, top - 6, 8 * k, 0, 7); c.fill(); }
      else for (let i = 0; i < 3; i++) B3.flame(c, x + (i - 1) * 14, top + 4, (i === 1 ? 0.75 : 0.5) * Math.min(1.6, k), t, Math.min(1.2, k), i * 1.7 + x); }
    if (f.out) B3.smoke(c, x, top - 6, t, 0.6, '200,200,210', 4, 70);
    if (f.spark && t - f.spark < 0.9) for (let i = 0; i < 8; i++) { const q = (t * 3 + i / 8) % 1; c.strokeStyle = '#ffe85a'; c.lineWidth = 2; const sx = x - 30 + B3.hash(i + Math.floor(t * 8)) * 60, sy = top - 10 - q * 30; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + 5, sy - 6); c.lineTo(sx + 1, sy - 8); c.lineTo(sx + 7, sy - 15); c.stroke(); }
  }
  MG.add({
    id: 'putout', stage: 'fire', cmd: 'PUT IT OUT!', time: 6, mood: 'storm', winText: 'Fire classes!', failText: 'Flare-up!',
    card: { title: 'The right extinguisher for the fire', kind: 'Chemistry', ref: 'Classes of fire and extinguishers',
      text: 'Different fires need different extinguishers. Water cools burning paper and wood. Water conducts electricity, so it must never go on live electrics; carbon dioxide smothers the fire without wetting the wires. On burning cooking oil, water sinks, boils into steam at once and throws burning oil out, so a wet-chemical extinguisher is used: it cools the oil and makes a soapy crust that keeps the air out. Burning metals need a special powder.\n\nThis is general safety information. If a fire is big or spreading, get out, stay out and call the fire service. Unplug electrics only if it is safe to.',
      note: 'Match the extinguisher to what is burning. Never use water on electrics or cooking oil.' },
    init(g) {
      const s = g.s, L2 = g.level >= 2;
      const fk = L2 ? ['bin', 'toaster', 'fryer', 'metal'] : ['bin', 'toaster', 'fryer'], fx = L2 ? [46, 134, 224, 312] : [66, 180, 294];
      s.fires = fk.map((k, i) => ({ kind: k, x: fx[i], y: BENCH - 30, k: 1, out: false }));
      const ek = L2 ? ['water', 'co2', 'wet', 'metal'] : ['water', 'co2', 'wet'];
      if (g.level >= 1) for (let i = ek.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [ek[i], ek[j]] = [ek[j], ek[i]]; }
      const ex = L2 ? [40, 104, 168, 232] : [52, 128, 204];
      s.ext = ek.map((k, i) => ({ kind: k, x: ex[i], y: 548, hx: ex[i], hy: 548, tilt: 0 }));
      s.spray = null; s.flare = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.spray) return; const e = SK.pick(s.ext, x, y, 44); if (e) { SK.dragStart(g, e, x, y); g.sfx('tap'); } },
    move(g, x, y) { SK.dragMove(g, x, y); },
    up(g) {
      const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj || g.done) return; const e = d.obj;
      const f = SK.pick(s.fires.filter(f => !f.out), e.x, e.y + 40, 80);
      if (f && e.y < BENCH + 60) { s.spray = { e, f, t0: g.t }; e.x = f.x - 40; e.y = BENCH - 70; e.tilt = 0.9; g.sfx('sweep'); } else e.back = true;
    },
    update(g, dt) {
      const s = g.s, S = s.spray;
      for (const e of s.ext) if (e.back && !SK.dragging(g)) { e.x += (e.hx - e.x) * Math.min(1, dt * 12); e.y += (e.hy - e.y) * Math.min(1, dt * 12); e.tilt *= 0.8; if (SK.dist(e.x, e.y, e.hx, e.hy) < 1) e.back = false; }
      if (S) { const k = g.t - S.t0, f = S.f, ok = WORKS[f.kind].includes(S.e.kind);
        if (ok) { f.k = Math.max(0, f.k - dt * 1.8); if (f.kind === 'fryer') f.crust = (f.crust || 0) + dt * 2; if (f.kind === 'metal') f.powder = (f.powder || 0) + dt * 2; if (f.k <= 0 && !f.out) { f.out = true; g.sfx('ding'); } }
        else if (S.e.kind === 'water' && f.kind === 'fryer') { if (!s.flare) { s.flare = g.t; g.sfx('whoosh'); g.sfx('fire'); g.shake(6, 0.4); } f.k = Math.min(2.6, f.k + dt * 4); }
        else if (S.e.kind === 'water' && f.kind === 'toaster') { f.spark = g.t; if (g.rand() < 0.3) g.sfx('snap'); }
        else { f.k = 0.6 + 0.4 * Math.abs(Math.sin(k * 9)); if (k > 0.7) f.k = 1; }
        if (k > 0.75) { s.spray = null; S.e.back = true; if (!ok && !s.flare) g.sfx('wrong'); }
      }
      if (s.flare && !g.done && g.t - s.flare > 0.8) { g.sfx('laugh'); g.fail(); }
      if (!g.done && s.fires.every(f => f.out)) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, S = s.spray;
      c.drawImage(g.bake('putout_bg', paintBg), 0, 0, 360, 640);
      for (const f of s.fires) fireArt(c, f, t);
      if (s.flare) { const q = Math.min(1, (t - s.flare) * 2); const f = s.fires.find(f => f.kind === 'fryer'); c.save(); c.globalAlpha = 0.9; B3.flame(c, f.x, BENCH - 30, 2.6 * q, t, 1, 3); c.restore(); B3.smoke(c, f.x, BENCH - 120, t, q, '240,240,250', 6, 90); }
      // the spray from the nozzle to the base of the flames
      if (S) { const e = S.e, f = S.f, nx = e.x + 24, ny = e.y - 6, col = { water: '120,190,255', co2: '235,240,250', wet: '255,248,220', metal: '230,230,240' }[e.kind];
        for (let i = 0; i < 18; i++) { const q = (t * 3 + i / 18) % 1, x = SK.lerp(nx, f.x + (B3.hash(i) - 0.5) * 30, q), y = SK.lerp(ny, BENCH - 38, q) + Math.sin(q * 3) * 6; c.fillStyle = `rgba(${col},${0.9 - q * 0.5})`; c.beginPath(); c.arc(x, y, 3 + q * (e.kind === 'co2' ? 9 : 3), 0, 7); c.fill(); } }
      for (const e of s.ext) if (SK.dragging(g) !== e && (!S || S.e !== e)) extinguisher(c, e, t);
      for (const e of s.ext) if (SK.dragging(g) === e || (S && S.e === e)) extinguisher(c, e, t);
      const won = g.result === 'win', lost = g.result === 'fail';
      SK.animal(c, 'beaver', 318, 606, 0.7, { t, facing: -1, pose: won ? 'cheer' : lost ? 'sad' : s.fires.some(f => f.spark && t - f.spark < 0.8) ? 'hop' : 'idle', expr: won ? 'laugh' : lost || s.flare ? 'wow' : 'happy' });
      if (lost) B3.smoke(c, 312, 548, t, 0.6, '80,80,90', 3, 40);
      const w = s.ext.find(e => e.kind === 'water'), bin = s.fires[0]; if (!bin.out && !SK.dragging(g)) SK.glow(c, g, w.x, w.y, 34, '#ffe27a', { level: 0 });
      SK.demo(g, c, 'drag', [w.hx, w.hy], [bin.x - 36, BENCH - 70]);
    },
    // the bot uses the right extinguisher on each fire in turn
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.spray || g.t < 1.0) return; const f = s.fires.find(f => !f.out); if (!f) return; const B = s._b = s._b || { n: 0, t: 1.0 };
      const e = s.ext.find(e => e.kind === WORKS[f.kind][0]); if (e.back) return;
      if (!B.st) { if (g.t < B.t) return; B.st = g.t; synth('down', e.hx, e.hy); return; }
      const k = Math.min(1, (g.t - B.st) / 0.35); synth('move', SK.lerp(e.hx, f.x - 36, k), SK.lerp(e.hy, BENCH - 70, k)); if (k >= 1) { synth('up', f.x - 36, BENCH - 70); B.st = 0; B.t = g.t + 0.1; }
    },
  });
})();
