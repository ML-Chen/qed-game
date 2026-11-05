// PEDAL! (physics PP-09) — a dark room at bedtime: a fox on an exercise bike whose wheel spins a generator, wired to one
// old-style bulb over the armchair where the hedgehog reads. Mash to pedal. Steady, quick pedalling keeps the bulb bright,
// and the hedgehog turns the pages; slow down and the room dims. A person's steady power is about enough for one bright
// bulb. Level 1: the hedgehog switches the kettle on; it needs about twenty times more power, the pedals go heavy and the
// bulb dims until you tap the kettle off. Level 2: two bulbs, so you have to pedal harder.
(() => {
  const BIKE = { x: 96, y: 478 }, WR = 56, KET = { x: 316, y: 318 }, SW = [316, 362];
  function paintRoom(o) {
    const wall = o.createLinearGradient(0, 0, 0, 560); wall.addColorStop(0, '#3a2a58'); wall.addColorStop(1, '#6a4a6a'); o.fillStyle = wall; o.fillRect(0, 0, 360, 560);
    o.strokeStyle = 'rgba(255,220,180,0.07)'; o.lineWidth = 10; for (let x = 10; x < 360; x += 40) { o.beginPath(); o.moveTo(x, 0); o.lineTo(x, 560); o.stroke(); }
    const fl = o.createLinearGradient(0, 556, 0, 640); fl.addColorStop(0, '#6a3a2a'); fl.addColorStop(1, '#3a1e16'); o.fillStyle = fl; o.fillRect(0, 556, 360, 84); o.fillStyle = '#2a1420'; o.fillRect(0, 552, 360, 6);
    // the armchair
    o.fillStyle = '#3a8a9a'; o.beginPath(); o.roundRect(206, 430, 136, 90, 24); o.fill(); o.fillStyle = '#2a6a7a'; o.beginPath(); o.roundRect(200, 494, 148, 62, 16); o.fill(); o.fillStyle = '#2a5a6a'; o.beginPath(); o.roundRect(194, 476, 30, 80, 12); o.fill(); o.beginPath(); o.roundRect(324, 476, 30, 80, 12); o.fill();
    // the side table for the kettle
    o.fillStyle = '#8a5a3a'; o.fillRect(280, 344, 80, 8); o.fillStyle = '#6a3a2a'; o.beginPath(); o.moveTo(290, 352); o.lineTo(300, 352); o.lineTo(290, 372); o.fill();
    // a picture on the wall
    o.fillStyle = '#c89a5a'; o.fillRect(40, 220, 64, 50); o.fillStyle = '#4a7ab0'; o.fillRect(46, 226, 52, 38); o.fillStyle = '#7ac85a'; o.beginPath(); o.moveTo(46, 264); o.lineTo(66, 240); o.lineTo(84, 256); o.lineTo(98, 246); o.lineTo(98, 264); o.fill();
  }
  function bulb(c, x, y, b, t) {
    c.strokeStyle = '#1a1020'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, 0); c.lineTo(x, y - 22); c.stroke(); c.fillStyle = '#7a7a8a'; c.fillRect(x - 7, y - 24, 14, 12);
    if (b > 0.02) { c.save(); c.globalCompositeOperation = 'lighter'; const gr = c.createRadialGradient(x, y, 4, x, y, 60 + 140 * b); gr.addColorStop(0, `rgba(255,230,150,${0.7 * b})`); gr.addColorStop(1, 'rgba(255,200,100,0)'); c.fillStyle = gr; c.beginPath(); c.arc(x, y, 60 + 140 * b, 0, 7); c.fill(); c.restore(); }
    c.fillStyle = b > 0.05 ? `rgba(255,${230 + 25 * b},${150 + 80 * b},${0.55 + 0.45 * b})` : 'rgba(220,220,235,0.6)'; c.strokeStyle = 'rgba(80,60,60,0.6)'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, 15, 0, 7); c.fill(); c.stroke();
    c.strokeStyle = b > 0.05 ? `rgb(255,${140 + 110 * b},60)` : '#6a5a5a'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x - 5, y - 10); c.lineTo(x - 4, y); c.lineTo(x - 1, y - 4); c.lineTo(x + 1, y); c.lineTo(x + 4, y - 4); c.lineTo(x + 5, y - 10); c.stroke();
  }
  MG.add({
    id: 'energy_pedal', stage: 'energy', cmd: 'PEDAL TO KEEP THE LIGHT ON!', time: 6, mood: 'night', winText: 'Pedal power!', failText: 'Too dark!',
    card: { title: 'How much power you have', kind: 'Physics', ref: 'Power in watts',
      text: 'Power is how fast energy is used or made, measured in watts. A fit person pedalling steadily makes about 100 watts. That is enough for one bright old-style bulb, which uses about 60 to 100 watts.\n\nA kettle uses about 2,000 watts, so it would take about twenty people pedalling to boil it. With a big load on the generator, the pedals get much harder to turn. Two bulbs need twice the power, so you have to pedal harder.',
      note: 'One person can make about 100 watts: enough for a bulb, nowhere near enough for a kettle.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level);
      s.bulbs = lv >= 2 ? [[150, 206], [250, 206]] : [[236, 206]]; s.need = [3, 3.5, 3][lv]; s.th = lv >= 2 ? 0.6 : 0.7;
      s.cad = 0; s.crank = 0; s.read = 0; s.b = 0; s.kettleAt = lv === 1 ? 2.4 : 9e9; s.kettle = false; s.kettleUsed = false; s.taps = 0; s.pageT = -9;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return;
      if (s.kettle && SK.dist(x, y, SW[0], SW[1]) < 46) { s.kettle = false; g.sfx('click'); g.burst(SW[0], SW[1], ['#9aa0c0', '#fff'], 6, 80); return; }
      s.cad += 0.4; s.taps++; if (s.taps % 2) g.sfx('tap');
    },
    update(g, dt) {
      const s = g.s, load = 60 * s.bulbs.length + (s.kettle ? 2000 : 0);
      if (!s.kettleUsed && g.t > s.kettleAt) { s.kettle = true; s.kettleUsed = true; g.sfx('click'); }
      s.cad *= Math.exp(-(0.8 + load / 150) * dt); s.crank += s.cad * dt * Math.PI * 2; // a bigger load makes the pedals harder to turn
      const P_ = 60 * Math.pow(s.cad / 1.6, 2); s.P = P_; s.b = SK.clamp(P_ / load, 0, 1) * (s.kettle ? 1 : 1); s.bb = s.b; // the bulbs share what the generator makes
      if (s.b >= s.th) { const before = Math.floor(s.read); s.read += dt; if (Math.floor(s.read) > before) { s.pageT = g.t; g.sfx('rustle'); } }
      if (s.read >= s.need && !g.done) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, b = s.b || 0, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('pedal_room', paintRoom), 0, 0, 360, 640);
      // the kettle on the side table, and its switch
      c.fillStyle = '#c8d0e0'; c.beginPath(); c.moveTo(KET.x - 22, KET.y + 26); c.lineTo(KET.x - 18, KET.y - 10); c.quadraticCurveTo(KET.x, KET.y - 20, KET.x + 18, KET.y - 10); c.lineTo(KET.x + 22, KET.y + 26); c.closePath(); c.fill();
      c.strokeStyle = '#5a5a6a'; c.lineWidth = 4; c.beginPath(); c.arc(KET.x, KET.y - 12, 13, Math.PI, 0); c.stroke(); c.fillStyle = '#c8d0e0'; c.beginPath(); c.moveTo(KET.x - 18, KET.y); c.lineTo(KET.x - 32, KET.y - 10); c.lineTo(KET.x - 22, KET.y + 10); c.fill();
      c.fillStyle = '#3a3a4a'; c.beginPath(); c.roundRect(SW[0] - 12, SW[1] - 9, 24, 18, 5); c.fill(); c.fillStyle = s.kettle ? '#ff4a3a' : '#6a4a4a'; c.beginPath(); c.arc(SW[0], SW[1], 6, 0, 7); c.fill();
      c.strokeStyle = '#1a1020'; c.lineWidth = 2; c.beginPath(); c.moveTo(KET.x + 22, KET.y + 20); c.quadraticCurveTo(360, 560, BIKE.x + 80, BIKE.y + 4); c.stroke();
      // the bike: wheel, generator, frame, pedals
      const cx = BIKE.x, cy = BIKE.y;
      c.strokeStyle = '#2a2a3a'; c.lineWidth = 6; c.beginPath(); c.arc(cx + 30, cy, WR, 0, 7); c.stroke(); c.strokeStyle = '#8a8aa0'; c.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) { const a = s.crank * 0.8 + i * Math.PI / 4; c.beginPath(); c.moveTo(cx + 30, cy); c.lineTo(cx + 30 + Math.cos(a) * WR, cy + Math.sin(a) * WR); c.stroke(); }
      if (s.cad > 1.2) { c.strokeStyle = 'rgba(200,200,220,0.35)'; c.lineWidth = 10; c.beginPath(); c.arc(cx + 30, cy, WR - 10, 0, 7); c.stroke(); }
      c.fillStyle = '#5a5a70'; c.fillRect(cx - 10, cy + 40, 90, 14); c.fillRect(cx + 74, cy - 4, 6, 50);
      c.fillStyle = '#d8a83a'; c.beginPath(); c.roundRect(cx + 70, cy - 22, 22, 30, 6); c.fill(); c.fillStyle = '#8a6a1a'; c.beginPath(); c.arc(cx + 81, cy - 7, 5, 0, 7); c.fill(); // the generator
      c.strokeStyle = '#e8503a'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(cx - 20, cy + 44); c.lineTo(cx - 6, cy - 46); c.lineTo(cx + 40, cy - 40); c.lineTo(cx + 30, cy); c.lineTo(cx - 20, cy + 44); c.moveTo(cx - 6, cy - 46); c.lineTo(cx + 30, cy); c.stroke();
      c.fillStyle = '#2a2a3a'; c.beginPath(); c.ellipse(cx - 8, cy - 52, 16, 6, 0, 0, 7); c.fill(); c.strokeStyle = '#3a3a4a'; c.lineWidth = 5; c.beginPath(); c.moveTo(cx + 40, cy - 40); c.lineTo(cx + 50, cy - 66); c.lineTo(cx + 64, cy - 66); c.stroke();
      // the fox on the saddle, legs on the pedals
      const pc = [cx + 4, cy + 14], pa = s.crank, p1 = [pc[0] + Math.cos(pa) * 16, pc[1] + Math.sin(pa) * 16], p2 = [pc[0] - Math.cos(pa) * 16, pc[1] - Math.sin(pa) * 16];
      c.strokeStyle = '#2a2a3a'; c.lineWidth = 4; c.beginPath(); c.moveTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]); c.stroke();
      const strain = s.kettle && s.taps > 0 && s.cad > 0.2;
      SK.animal(c, 'fox', cx - 6, cy - 50, 0.85, { t: t * (strain ? 3 : 1), pose: won ? 'cheer' : 'balance', expr: won ? 'laugh' : strain || lost ? 'wow' : s.cad > 1 ? 'happy' : 'think' });
      c.strokeStyle = '#e8803a'; c.lineWidth = 7; for (const p of [p1, p2]) { const hip = [cx - 6, cy - 54], knee = [(hip[0] + p[0]) / 2 + 16, (hip[1] + p[1]) / 2 - 6]; c.beginPath(); c.moveTo(hip[0], hip[1]); c.quadraticCurveTo(knee[0], knee[1], p[0], p[1]); c.stroke(); c.fillStyle = '#3a2418'; c.beginPath(); c.ellipse(p[0], p[1], 7, 4, 0, 0, 7); c.fill(); }
      if (strain) for (let i = 0; i < 3; i++) { const q = (t * 2 + i / 3) % 1; c.fillStyle = `rgba(140,200,255,${1 - q})`; c.beginPath(); c.arc(cx + 14 + i * 6, cy - 100 + q * 30, 3, 0, 7); c.fill(); }
      // the hedgehog reads in the armchair; pages turn while the light is bright
      SK.animal(c, 'hedgehog', 272, 516, 0.9, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : b < s.th ? 'think' : 'happy', facing: -1 });
      const pk = (t - s.pageT) / 0.4; c.fillStyle = '#fff6ea'; c.strokeStyle = '#8a5a3a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(246, 528); c.lineTo(272, 534); c.lineTo(298, 528); c.lineTo(298, 506); c.lineTo(272, 512); c.lineTo(246, 506); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#c83a5a'; c.fillRect(270, 512, 4, 22);
      if (pk >= 0 && pk < 1) { c.fillStyle = '#f2e8d8'; c.beginPath(); c.moveTo(272, 512); c.lineTo(272 + 26 * Math.cos(pk * Math.PI), 506 - 12 * Math.sin(pk * Math.PI)); c.lineTo(272 + 26 * Math.cos(pk * Math.PI), 528 - 12 * Math.sin(pk * Math.PI)); c.lineTo(272, 534); c.fill(); c.stroke(); }
      // the room darkens when the light is weak
      c.fillStyle = `rgba(8,6,24,${0.72 * (1 - b)})`; c.fillRect(0, 0, 360, 640);
      for (const [x, y] of s.bulbs) bulb(c, x, y, b, t);
      // the reading ring: fills while the bulb is bright enough
      const rk = s.read / s.need, rx = 330, ry = 452; c.strokeStyle = 'rgba(255,255,255,0.25)'; c.lineWidth = 7; c.beginPath(); c.arc(rx, ry, 16, 0, 7); c.stroke(); c.strokeStyle = '#ffe27a'; c.lineCap = 'round'; c.beginPath(); c.arc(rx, ry, 16, -Math.PI / 2, -Math.PI / 2 + rk * Math.PI * 2); c.stroke();
      SK.tag(c, 'Generator', cx + 82, cy - 40, 18); if (s.kettle) SK.tag(c, 'Kettle', KET.x - 8, KET.y - 44, 18);
      if (s.kettle) SK.glow(c, g, SW[0], SW[1], 26);
      SK.glow(c, g, cx + 4, cy + 14, 34, '#ffe27a', { level: 0 });
      SK.demo(g, c, 'tap', s.kettle ? SW : [cx + 4, cy + 30], null, { period: s.kettle ? 1.1 : 0.35 });
    },
    // the bot: mash steadily (fast enough for two bulbs at level 2), and switch the kettle off when it comes on
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 1) return;
      if (s.kettle && g.t > s.kettleAt + 0.6) { synth('down', SW[0], SW[1]); synth('up', SW[0], SW[1]); return; }
      const per = g.level >= 2 ? 1 / 8.5 : 1 / 6; s.botT = s.botT ?? g.t; if (g.t >= s.botT) { s.botT += per; synth('down', 150, 520); synth('up', 150, 520); }
    },
  });
})();
