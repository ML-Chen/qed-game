// SWITCH OFF! (physics PP-08) — a house at night with everything on. Energy pours into each appliance from a tap on the
// ceiling pipe: the heater and the kettle gush, the TV and the fridge run a thin stream, the LED lamp, the fairy lights
// and the phone charger only drip. The meter's needle sits deep in the red. Tap appliances to switch them off until the
// needle drops below the line. Switch off the drippers and the needle hardly moves, while the cat dozes on by the roaring
// heater. Level 1 adds a hair dryer; level 2 adds the oven and the fridge must stay on (its ice cream starts to melt).
(() => {
  const MC = [180, 178], MR = 46, LINES = [600, 600, 220], MAXP = 9000;
  const frac = p => Math.min(1.08, Math.sqrt(p / MAXP)), ang = f => Math.PI * (0.8 + 1.4 * Math.min(1, f)); // dial from lower left to lower right
  const KINDS = { // watts and where each sits (x, y of its top centre; floor 1 ceiling y 244, floor 2 ceiling 428)
    heater: { w: 2000, x: 62, y: 352, ceil: 244 }, lamp: { w: 10, x: 152, y: 334, ceil: 244 }, charger: { w: 5, x: 216, y: 380, ceil: 244 }, dryer: { w: 1500, x: 296, y: 350, ceil: 244 },
    kettle: { w: 2000, x: 58, y: 540, ceil: 428 }, fridge: { w: 150, x: 136, y: 486, ceil: 428 }, tv: { w: 100, x: 222, y: 528, ceil: 428 }, lights: { w: 8, x: 310, y: 470, ceil: 428 }, oven: { w: 2000, x: 306, y: 540, ceil: 428 },
  };
  const LEVELS = [['heater', 'lamp', 'charger', 'dryer', 'kettle', 'fridge', 'tv', 'lights'], ['heater', 'lamp', 'charger', 'dryer', 'kettle', 'fridge', 'tv', 'lights', 'oven'], ['heater', 'lamp', 'charger', 'dryer', 'kettle', 'fridge', 'tv', 'lights', 'oven']];
  function paintHouse(o) {
    const sky = o.createLinearGradient(0, 0, 0, 640); sky.addColorStop(0, '#0c1238'); sky.addColorStop(1, '#2a2a6a'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    const rnd = P.rng(3); for (let i = 0; i < 50; i++) { o.fillStyle = `rgba(255,250,220,${0.3 + rnd() * 0.6})`; o.beginPath(); o.arc(rnd() * 360, rnd() * 230, 0.6 + rnd() * 1.3, 0, 7); o.fill(); }
    o.fillStyle = '#fff4c8'; o.beginPath(); o.arc(318, 150, 16, 0, 7); o.fill(); o.fillStyle = '#121a48'; o.beginPath(); o.arc(326, 144, 14, 0, 7); o.fill();
    // the roof and the brick shell, cut away to show two floors
    o.fillStyle = '#7a3040'; o.beginPath(); o.moveTo(-10, 240); o.lineTo(80, 196); o.lineTo(280, 196); o.lineTo(370, 240); o.closePath(); o.fill(); o.fillStyle = '#5a2030'; o.fillRect(-10, 236, 380, 8);
    o.fillStyle = '#8a4a3a'; o.fillRect(0, 244, 360, 370);
    const room = (x, y, w, h, c1, c2) => { const gr = o.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, c1); gr.addColorStop(1, c2); o.fillStyle = gr; o.fillRect(x, y, w, h); };
    room(8, 250, 344, 160, '#f2d8a8', '#e8c088'); room(8, 434, 344, 162, '#cfe0c0', '#b0c8a0');
    o.fillStyle = '#6a3a2a'; o.fillRect(8, 404, 344, 8); o.fillRect(8, 590, 344, 8); o.fillStyle = '#5a2a20'; o.fillRect(0, 412, 360, 22);
    o.strokeStyle = 'rgba(120,70,40,0.15)'; o.lineWidth = 1; for (let x = 20; x < 352; x += 24) { o.beginPath(); o.moveTo(x, 250); o.lineTo(x, 404); o.stroke(); }
    for (let y = 446; y < 590; y += 22) for (let x = 8 + ((y - 446) / 22 % 2) * 11; x < 352; x += 22) { o.fillStyle = 'rgba(255,255,255,0.12)'; o.fillRect(x, y, 10, 10); }
    // the energy pipe along each ceiling, coming down from the meter
    o.fillStyle = '#6a6a80'; o.fillRect(174, 214, 12, 34); o.fillRect(8, 250, 344, 8); o.fillRect(8, 434, 344, 8); o.fillRect(342, 250, 10, 192);
    o.fillStyle = '#9a9ab0'; o.fillRect(8, 251, 344, 2); o.fillRect(8, 435, 344, 2);
    // the rug by the heater, where the cat sleeps
    o.fillStyle = '#5a8ad0'; o.beginPath(); o.ellipse(104, 400, 46, 7, 0, 0, 7); o.fill();
  }
  function faucet(c, x, ceil) { c.fillStyle = '#8a8aa0'; c.fillRect(x - 4, ceil + 8, 8, 12); c.beginPath(); c.roundRect(x - 9, ceil + 18, 18, 8, 3); c.fill(); c.fillStyle = '#c8c8d8'; c.fillRect(x - 7, ceil + 19, 14, 2); }
  function stream(c, x, y0, y1, w, t, on) {
    if (w <= 0) return; c.save(); c.globalCompositeOperation = 'lighter';
    const gr = c.createLinearGradient(x - w, 0, x + w, 0); gr.addColorStop(0, 'rgba(255,200,60,0)'); gr.addColorStop(0.5, 'rgba(255,220,90,0.9)'); gr.addColorStop(1, 'rgba(255,200,60,0)');
    c.fillStyle = gr; c.fillRect(x - w, y0, w * 2, y1 - y0);
    c.strokeStyle = 'rgba(255,255,220,0.9)'; c.lineWidth = Math.max(1.2, w * 0.35); c.setLineDash([8, 10]); c.lineDashOffset = -t * 260; c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y1); c.stroke(); c.restore();
  }
  function appliance(c, k, a, t, s) {
    const { x, y } = KINDS[k], on = a.on;
    c.save(); c.translate(x, y);
    if (k === 'heater') { c.fillStyle = on ? '#e85a3a' : '#9a8a8a'; c.beginPath(); c.roundRect(-30, 0, 60, 48, 6); c.fill(); for (let i = 0; i < 5; i++) { c.fillStyle = on ? `rgb(255,${170 + 50 * Math.sin(t * 6 + i)},60)` : '#6a5a5a'; c.fillRect(-24 + i * 11, 6, 6, 36); } c.fillStyle = '#4a3a3a'; c.fillRect(-28, 48, 6, 4); c.fillRect(22, 48, 6, 4);
      if (on) { c.strokeStyle = 'rgba(255,160,90,0.5)'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { const q = (t * 0.8 + i / 3) % 1; c.beginPath(); c.moveTo(-14 + i * 14, -q * 30); c.quadraticCurveTo(-8 + i * 14, -q * 30 - 8, -14 + i * 14, -q * 30 - 16); c.stroke(); } } }
    else if (k === 'lamp') { c.fillStyle = '#7a5a3a'; c.fillRect(-3, 20, 6, 46); c.fillRect(-14, 64, 28, 6); c.fillStyle = on ? '#fff4b0' : '#c8c0a0'; c.beginPath(); c.moveTo(-18, 22); c.lineTo(-10, 0); c.lineTo(10, 0); c.lineTo(18, 22); c.closePath(); c.fill(); if (on) { const gr = c.createRadialGradient(0, 18, 2, 0, 18, 46); gr.addColorStop(0, 'rgba(255,250,200,0.5)'); gr.addColorStop(1, 'rgba(255,250,200,0)'); c.fillStyle = gr; c.beginPath(); c.arc(0, 18, 46, 0, 7); c.fill(); } }
    else if (k === 'charger') { c.fillStyle = '#7a5040'; c.fillRect(-26, 20, 52, 6); c.fillStyle = '#2a2a3a'; c.beginPath(); c.roundRect(-9, -8, 18, 28, 3); c.fill(); c.fillStyle = on ? '#6ad0ff' : '#3a3a4a'; c.fillRect(-7, -5, 14, 20); c.fillStyle = on ? '#5aff7a' : '#4a4a4a'; c.beginPath(); c.arc(16, 16, 2.5, 0, 7); c.fill(); }
    else if (k === 'dryer') { c.rotate(-0.2); c.fillStyle = on ? '#f27aa8' : '#b89aa8'; c.beginPath(); c.roundRect(-26, 0, 44, 24, 12); c.fill(); c.fillRect(-12, 20, 12, 30); c.fillStyle = '#5a3a4a'; c.fillRect(18, 4, 8, 16); if (on) { c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { const q = (t * 3 + i / 3) % 1; c.beginPath(); c.moveTo(30 + q * 24, 6 + i * 6); c.lineTo(40 + q * 24, 6 + i * 6); c.stroke(); } } }
    else if (k === 'kettle') { c.fillStyle = on ? '#c8d0e0' : '#9aa0aa'; c.beginPath(); c.moveTo(-22, 44); c.lineTo(-18, 4); c.quadraticCurveTo(0, -6, 18, 4); c.lineTo(22, 44); c.closePath(); c.fill(); c.strokeStyle = '#5a5a6a'; c.lineWidth = 4; c.beginPath(); c.arc(0, 2, 14, Math.PI, 0); c.stroke(); c.fillStyle = on ? '#ff5a3a' : '#5a5a5a'; c.beginPath(); c.arc(0, 36, 3, 0, 7); c.fill();
      if (on) { for (let i = 0; i < 4; i++) { const q = (t * 0.9 + i / 4) % 1; c.fillStyle = `rgba(255,255,255,${0.6 * (1 - q)})`; c.beginPath(); c.arc(28 + q * 10 + Math.sin(q * 6 + i) * 4, 4 - q * 40, 6 + q * 8, 0, 7); c.fill(); } c.fillStyle = '#c8d0e0'; c.beginPath(); c.moveTo(18, 14); c.lineTo(30, 6); c.lineTo(22, 22); c.fill(); } }
    else if (k === 'fridge') { c.fillStyle = on ? '#f4f8ff' : '#d8d8e0'; c.strokeStyle = '#8a9ab0'; c.lineWidth = 2; c.beginPath(); c.roundRect(-26, 0, 52, 104, 6); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-26, 36); c.lineTo(26, 36); c.stroke(); c.fillStyle = '#8a9ab0'; c.fillRect(16, 12, 4, 16); c.fillRect(16, 46, 4, 24);
      if (s.melt > 0) { c.fillStyle = '#f2a0c0'; for (let i = 0; i < 3; i++) { const q = (t * 0.7 + i / 3) % 1; c.beginPath(); c.ellipse(-10 + i * 8, 104 + q * 0 + 2, 3 + s.melt * 6, 2 + s.melt * 2, 0, 0, 7); c.fill(); c.globalAlpha = 1 - q; c.beginPath(); c.arc(-10 + i * 8, 36 + q * 66, 2.5, 0, 7); c.fill(); c.globalAlpha = 1; } } }
    else if (k === 'tv') { c.fillStyle = '#2a2a3a'; c.beginPath(); c.roundRect(-34, 0, 68, 44, 5); c.fill(); c.fillRect(-4, 44, 8, 10); c.fillRect(-18, 52, 36, 5); if (on) { const hu = (t * 60) % 360; c.fillStyle = `hsl(${hu},70%,60%)`; c.fillRect(-30, 4, 60, 36); c.fillStyle = 'rgba(255,255,255,0.4)'; c.fillRect(-30, 4 + ((t * 40) % 36), 60, 3); } else { c.fillStyle = '#1a1a26'; c.fillRect(-30, 4, 60, 36); } }
    else if (k === 'lights') { c.strokeStyle = '#3a5a3a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-36, 0); c.quadraticCurveTo(0, 22, 36, 0); c.stroke(); for (let i = 0; i < 7; i++) { const u = i / 6, lx = -36 + u * 72, ly = 22 * 2 * u * (1 - u) + 4; c.fillStyle = on ? ['#ff6a6a', '#ffd45a', '#6ad0ff', '#7aff8a'][i % 4] : '#6a6a6a'; c.globalAlpha = on ? 0.7 + 0.3 * Math.sin(t * 5 + i) : 1; c.beginPath(); c.arc(lx, ly, 3.5, 0, 7); c.fill(); } c.globalAlpha = 1; }
    else if (k === 'oven') { c.fillStyle = on ? '#e8e0d8' : '#c8c0b8'; c.strokeStyle = '#7a6a5a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-30, 0, 60, 50, 4); c.fill(); c.stroke(); c.fillStyle = on ? '#ff8a3a' : '#4a3a3a'; c.beginPath(); c.roundRect(-22, 14, 44, 28, 4); c.fill(); c.fillStyle = '#5a4a3a'; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(-14 + i * 14, 6, 3, 0, 7); c.fill(); } }
    c.restore();
  }
  MG.add({
    id: 'energy_switch', stage: 'energy', cmd: 'SWITCH OFF!', time: 6, mood: 'night', winText: 'Power saved!', failText: 'Bill shock!',
    card: { title: 'Gulpers and sippers', kind: 'Physics', ref: 'Electrical power (watts)',
      text: 'Power is how fast something uses energy, measured in watts. Things that make heat are the big gulpers: a heater or a kettle uses about 2,000 watts. A TV or a fridge uses about 100. An LED lamp or a phone charger only sips about 5 to 10.\n\nSo switching off one heater saves as much as switching off two hundred LED lamps. To cut an energy bill, switch off or turn down the things that heat. A fridge runs all day, so it adds up too, but food needs it.',
      note: 'Things that heat use far more energy than lights and chargers.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.keepFridge = lv >= 2;
      s.apps = LEVELS[lv].map(k => ({ k, on: true, x: KINDS[k].x, y: KINDS[k].y + 20, offT: -9 }));
      s.f = frac(s.apps.reduce((a, b) => a + KINDS[b.k].w, 0)); s.disc = 0; s.melt = 0; s.under = 0; s.taps = 0;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); const a = SK.pick(s.apps, x, y, 50); if (!a) return;
      a.on = !a.on; a.offT = g.t; s.taps++; g.sfx('click'); if (!a.on && KINDS[a.k].w >= 1000) g.sfx('shrink'); g.burst(a.x, a.y, a.on ? ['#ffe27a'] : ['#9aa0c0', '#fff'], 6, 80);
    },
    update(g, dt) {
      const s = g.s, P_ = s.apps.reduce((acc, a) => acc + (a.on ? KINDS[a.k].w : 0), 0), tgt = frac(P_);
      s.f += (tgt - s.f) * Math.min(1, dt * 5); s.disc += dt * P_ / 180;
      const fr = s.apps.find(a => a.k === 'fridge'); if (s.keepFridge && fr && !fr.on) s.melt = Math.min(1, s.melt + dt * 0.8); else s.melt = Math.max(0, s.melt - dt);
      const LINE = LINES[Math.min(2, g.level)], ok = P_ < LINE && (!s.keepFridge || (fr && fr.on));
      s.under = ok && s.f < frac(LINE) ? s.under + dt : 0;
      if (s.under > 0.3 && !g.done) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t;
      c.drawImage(g.bake('switch_house', paintHouse), 0, 0, 360, 640);
      // the cat dozing by the heater (it shivers once the heater goes off)
      const heat = s.apps.find(a => a.k === 'heater'), sh = heat && !heat.on ? Math.sin(t * 40) * 1.2 : 0;
      try { P.cat(c, 112 + sh, 400, 0.7, { t }); } catch (e) { }
      // the appliances and the energy pouring into each from its tap
      for (const a of s.apps) {
        const K = KINDS[a.k], w = a.on ? 1.5 + 11 * Math.sqrt(K.w / 2000) : 0; faucet(c, K.x, K.ceil);
        if (a.on) stream(c, K.x, K.ceil + 26, K.y + 2, w, t);
        else { const q = (t - a.offT) * 2.5; if (q < 1) { c.fillStyle = 'rgba(255,220,90,0.8)'; c.beginPath(); c.arc(K.x, K.ceil + 26 + q * (K.y - K.ceil - 26), 3, 0, 7); c.fill(); } }
        appliance(c, a.k, a, t, s);
      }
      // the meter: a dial with a red zone above the line, and a spinning disc
      c.fillStyle = '#3a3a50'; c.beginPath(); c.roundRect(MC[0] - 62, MC[1] - 60, 124, 98, 14); c.fill();
      c.fillStyle = '#fff6ea'; c.beginPath(); c.arc(MC[0], MC[1], MR, 0, 7); c.fill();
      const aL = ang(frac(LINES[Math.min(2, g.level)])); c.strokeStyle = '#7ac85a'; c.lineWidth = 9; c.beginPath(); c.arc(MC[0], MC[1], MR - 9, ang(0), aL); c.stroke(); c.strokeStyle = '#e84a3a'; c.beginPath(); c.arc(MC[0], MC[1], MR - 9, aL, ang(1)); c.stroke();
      c.strokeStyle = '#2a1430'; c.lineWidth = 3; c.beginPath(); c.moveTo(MC[0] + Math.cos(aL) * (MR - 16), MC[1] + Math.sin(aL) * (MR - 16)); c.lineTo(MC[0] + Math.cos(aL) * (MR + 2), MC[1] + Math.sin(aL) * (MR + 2)); c.stroke();
      const jit = s.f > 0.9 ? Math.sin(t * 50) * 0.03 : 0, na = ang(s.f) + jit; c.strokeStyle = '#2a1430'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(MC[0], MC[1]); c.lineTo(MC[0] + Math.cos(na) * (MR - 8), MC[1] + Math.sin(na) * (MR - 8)); c.stroke(); SK.ball(c, MC[0], MC[1], 6, '#5a5a70');
      c.fillStyle = '#c8c8d8'; c.beginPath(); c.ellipse(MC[0], MC[1] + 30, 30, 5, 0, 0, 7); c.fill(); const dx = Math.sin(s.disc) * 28; c.fillStyle = '#e84a3a'; c.fillRect(MC[0] + dx - 3, MC[1] + 26, 6, 8);
      // the penguin on the roof
      const won = g.result === 'win', lost = g.result === 'fail';
      SK.animal(c, 'penguin', 60, 228, 0.6, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
      if (heat && heat.on) SK.glow(c, g, heat.x, heat.y, 36, '#ffe27a', { level: 0 });
      const fr = s.apps.find(a => a.k === 'fridge'), nx = s.keepFridge && fr && !fr.on ? fr : s.apps.find(a => a.on && (KINDS[a.k].w >= 1000 || (g.level >= 2 && a.k === 'tv')));
      SK.demo(g, c, 'tap', nx ? [nx.x, nx.y] : [0, 0], null, { never: !nx });
    },
    // the bot: switch off the big heat-makers, one by one
    auto(g, dt, synth) {
      const s = g.s; if (g.done) return; let i = 0;
      for (const a of s.apps) if (KINDS[a.k].w >= 1000 || (g.level >= 2 && a.k === 'tv')) { SK.bot.tap(g, synth, 'off' + a.k, 1.0 + i * 0.45, a.x, a.y); i++; }
    },
  });
})();
