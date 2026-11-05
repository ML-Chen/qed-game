// FIZZ! (chem_bio EL-17) — a kitchen counter at sunset: a bottle of vinegar with a red balloon stretched over its neck,
// hanging limp, its bottom heavy with baking soda. Lift the balloon upright and hold it there: the soda pours into the
// vinegar, they react, the bottle foams, and the new gas (carbon dioxide) blows the balloon up. Let go too soon and the
// balloon flops back: only the soda that fell in has reacted, so it only half fills. Level 2: the soda is clumped and
// pours out slowly, so it must be held up longer.
(() => {
  const MOUTH = { x: 180, y: 330 }, TABLE = 566, BAL_R = 56, HANG = -2.25;
  function paintBg(o) {
    // a warm kitchen wall with tiles, a sunset window and a wooden shelf and counter
    const wall = o.createLinearGradient(0, 0, 0, 640); wall.addColorStop(0, '#f6c48a'); wall.addColorStop(0.6, '#f2d6a8'); wall.addColorStop(1, '#e8c08a');
    o.fillStyle = wall; o.fillRect(0, 0, 360, 640);
    o.strokeStyle = 'rgba(180,110,60,0.18)'; o.lineWidth = 1.5;
    for (let y = 300; y < TABLE; y += 30) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); for (let x = (y / 30) % 2 ? 0 : 15; x < 360; x += 30) { o.beginPath(); o.moveTo(x, y); o.lineTo(x, y + 30); o.stroke(); } }
    // window
    const WX = 112, WY = 136, WW = 136, WH = 150;
    o.save(); o.beginPath(); o.roundRect(WX, WY, WW, WH, 14); o.clip();
    const sky = o.createLinearGradient(0, WY, 0, WY + WH); sky.addColorStop(0, '#e8786a'); sky.addColorStop(0.6, '#ffc890'); sky.addColorStop(1, '#fff0d0'); o.fillStyle = sky; o.fillRect(WX, WY, WW, WH);
    o.fillStyle = '#fff4d8'; o.beginPath(); o.arc(WX + 96, WY + 104, 20, 0, 7); o.fill();
    o.fillStyle = '#c8906a'; o.beginPath(); o.moveTo(WX, WY + WH); o.quadraticCurveTo(WX + 40, WY + 100, WX + 80, WY + 126); o.quadraticCurveTo(WX + 110, WY + 108, WX + WW, WY + 120); o.lineTo(WX + WW, WY + WH); o.fill();
    o.restore(); o.strokeStyle = '#fff4e4'; o.lineWidth = 8; o.beginPath(); o.roundRect(WX, WY, WW, WH, 14); o.stroke(); o.lineWidth = 4; o.beginPath(); o.moveTo(WX + WW / 2, WY); o.lineTo(WX + WW / 2, WY + WH); o.moveTo(WX, WY + WH * 0.5); o.lineTo(WX + WW, WY + WH * 0.5); o.stroke();
    o.fillStyle = '#e88a8a'; o.fillRect(WX - 14, WY - 10, 22, WH + 24); o.fillRect(WX + WW - 8, WY - 10, 22, WH + 24); o.fillStyle = 'rgba(255,255,255,0.25)'; o.fillRect(WX - 10, WY - 10, 5, WH + 24); o.fillRect(WX + WW - 4, WY - 10, 5, WH + 24);
    // counter
    const ct = o.createLinearGradient(0, TABLE, 0, 640); ct.addColorStop(0, '#c87a44'); ct.addColorStop(0.08, '#a85e30'); ct.addColorStop(1, '#6a3618'); o.fillStyle = ct; o.fillRect(0, TABLE, 360, 640 - TABLE);
    o.fillStyle = 'rgba(255,230,190,0.35)'; o.fillRect(0, TABLE, 360, 3);
    const r = P.rng(5); o.strokeStyle = 'rgba(60,20,10,0.18)'; o.lineWidth = 1; for (let i = 0; i < 14; i++) { const y = TABLE + 12 + r() * 50; o.beginPath(); o.moveTo(0, y); o.bezierCurveTo(120, y + r() * 6 - 3, 240, y + r() * 6 - 3, 360, y); o.stroke(); }
    P.vignette(o, 360, 640, 0.25, '#5a2a18');
  }
  function bottlePath(c) { // a round-bellied bottle, the neck at the top
    c.beginPath(); c.moveTo(166, MOUTH.y); c.lineTo(166, 382); c.bezierCurveTo(118, 400, 112, 440, 114, 500); c.quadraticCurveTo(116, TABLE, 150, TABLE); c.lineTo(210, TABLE); c.quadraticCurveTo(244, TABLE, 246, 500); c.bezierCurveTo(248, 440, 242, 400, 194, 382); c.lineTo(194, MOUTH.y); c.closePath();
  }
  // the balloon, pointing at angle a from straight up (clockwise positive), its neck on the bottle's mouth
  function balloon(c, s, t) {
    const a = s.a, k = SK.easeOut(s.gas), r = 21 + (BAL_R - 21) * k, len = 50 + r * 0.8;
    c.save(); c.translate(MOUTH.x, MOUTH.y - 4); c.rotate(a);
    const wob = Math.sin(t * 3) * 1.5 * k, cy = -len * 0.62;
    c.fillStyle = '#e8384a'; c.strokeStyle = '#8a1a2a'; c.lineWidth = 2.2;
    c.beginPath(); c.moveTo(-12, 8); c.lineTo(-7, -8);
    c.bezierCurveTo(-r * 1.15, cy + r * 0.7, -r * 1.05 + wob, cy - r * 1.15, 0, cy - r); c.bezierCurveTo(r * 1.05 - wob, cy - r * 1.15, r * 1.15, cy + r * 0.7, 7, -8);
    c.lineTo(12, 8); c.closePath(); c.fill(); c.stroke();
    if (s.powder > 0.02) { c.fillStyle = `rgba(255,252,244,${0.75 * s.powder + 0.1})`; c.beginPath(); c.ellipse(0, cy - r * 0.45, r * 0.7, r * 0.45 * (0.4 + 0.6 * s.powder), 0, 0, 7); c.fill(); c.fillStyle = `rgba(220,214,200,${0.6 * s.powder})`; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(-r * 0.4 + i * r * 0.16, cy - r * 0.5 + B3.hash(i) * r * 0.3, 1.6, 0, 7); c.fill(); } }
    c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(-r * 0.45, cy - r * 0.3, r * 0.18, r * 0.11, -0.7, 0, 7); c.fill();
    c.restore();
    c.fillStyle = '#c8283a'; c.beginPath(); c.roundRect(MOUTH.x - 16, MOUTH.y, 32, 9, 4); c.fill(); c.strokeStyle = '#8a1a2a'; c.lineWidth = 1.5; c.stroke();
  }
  const tipOf = s => { const L = 50 + (21 + (BAL_R - 21) * SK.easeOut(s.gas)) * 1.6; return { x: MOUTH.x + Math.sin(s.a) * L * 0.75, y: MOUTH.y - 4 - Math.cos(s.a) * L * 0.75 }; };
  MG.add({
    id: 'fizz', stage: 'reactions', cmd: 'FIZZ!', time: 5, mood: 'desert', winText: 'Fizz!', failText: 'Flop!',
    card: { title: 'Mixing can make something new', kind: 'Chemistry', ref: 'Chemical reactions (baking soda and vinegar)',
      text: 'Baking soda and vinegar react. Their atoms swap partners and make new substances. One of them is carbon dioxide, a gas. The gas makes the bubbles, and it has to go somewhere, so it blows up the balloon.\n\nThe gas comes only from soda that has reached the vinegar. Let the balloon flop back early and less soda falls in, so less gas is made and the balloon only half fills. Bubbles of a new gas are one sign that a chemical reaction has happened.',
      note: 'In a chemical reaction, atoms rearrange to make new substances. Here the new substance is a gas.' },
    init(g) { const s = g.s; s.a = HANG; s.va = 0; s.powder = 1; s.react = 0; s.made = 0; s.gas = 0; s.foam = 0; s.grab = false; s.pourT = 0; },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; const tp = tipOf(s); if (SK.dist(x, y, tp.x, tp.y) < 70) { s.grab = true; s.va = 0; } },
    move(g, x, y) { const s = g.s; if (!s.grab || g.done) return; s.a = SK.clamp(Math.atan2(x - MOUTH.x, -(y - MOUTH.y)), -2.4, 0.5); },
    up(g) { g.s.grab = false; },
    update(g, dt) {
      const s = g.s;
      // gas pushes the balloon upright; with no gas and no hand it flops back down
      if (!s.grab) { const want = s.gas > 0.3 ? 0 : HANG; s.va += ((want - s.a) * 40 - s.va * 7) * dt; s.a += s.va * dt; }
      const up = Math.abs(s.a) < 0.75;
      if (up && s.powder > 0) { const r = Math.min(s.powder, dt * [2.6, 1.8, 0.95][Math.min(2, g.level)]); s.powder -= r; s.react += r; s.pourT += dt; if (g.rand() < 0.25) g.sfx('rustle'); }
      if (s.react > 0) { const r = Math.min(s.react, dt * 1.1); s.react -= r; s.made += r; s.foam = Math.min(1, s.foam + r * 1.6); if (g.rand() < 0.5) g.sfx('bubble'); }
      else s.foam = Math.max(0, s.foam - dt * 0.35);
      s.gas = Math.min(s.made, s.gas + dt * 1.2);
      if (s.gas >= 0.98 && !g.done) { g.win(); g.sfx('cheer'); g.burst(MOUTH.x, MOUTH.y - 100, ['#e8384a', '#fff6ea', '#ffd45a'], 20, 180); }
    },
    draw(g, c) {
      const s = g.s, t = g.t;
      c.drawImage(g.bake('fizz_bg2', paintBg), 0, 0, 360, 640);
      SK.shadow(c, 180, TABLE + 2, 70, 9, 0.3);
      c.save(); bottlePath(c); c.clip();
      c.fillStyle = 'rgba(255,250,235,0.25)'; c.fillRect(100, 300, 160, 280);
      const lv = 430; const vg = c.createLinearGradient(0, lv, 0, TABLE); vg.addColorStop(0, 'rgba(250,226,150,0.75)'); vg.addColorStop(1, 'rgba(230,190,100,0.85)'); c.fillStyle = vg; c.fillRect(100, lv + Math.sin(t * 2) * 1.5, 160, 200);
      if (s.foam > 0.01) {
        const ft = lv - s.foam * 110, fb = ft + 26 + 20 * s.foam; c.fillStyle = 'rgba(255,253,244,0.95)'; c.beginPath(); c.moveTo(100, fb);
        for (let x = 100; x <= 260; x += 10) c.lineTo(x, ft + Math.sin(x * 0.3 + t * 8) * 4); c.lineTo(260, fb);
        for (let x = 260; x >= 100; x -= 12) c.lineTo(x, fb + Math.sin(x * 0.5 + t * 5) * 5); c.fill();
        for (let i = 0; i < 14; i++) { const bx = 104 + i * 12, by = ft + 8 + B3.hash(i) * 14; c.strokeStyle = 'rgba(220,214,190,0.8)'; c.lineWidth = 1; c.beginPath(); c.arc(bx, by + Math.sin(t * 7 + i) * 2, 3 + B3.hash(i * 3) * 4, 0, 7); c.stroke(); }
        for (let i = 0; i < 26; i++) { const q = (t * 1.3 + B3.hash(i)) % 1, bx = 126 + B3.hash(i * 2.3) * 108, by = TABLE - 8 - q * (TABLE - ft); c.strokeStyle = `rgba(200,200,190,${0.7 * (1 - q)})`; c.lineWidth = 1.2; c.beginPath(); c.arc(bx + Math.sin(t * 6 + i) * 3, by, 2 + B3.hash(i * 5) * 4, 0, 7); c.stroke(); }
      }
      // soda falling through the neck while the balloon is up
      if (Math.abs(s.a) < 0.75 && s.powder > 0) for (let i = 0; i < 22; i++) { const q = (t * 3 + i / 22) % 1; c.fillStyle = i % 3 ? '#fbfbf6' : '#dcdcd4'; c.fillRect(MOUTH.x - 6 + B3.hash(i) * 12, MOUTH.y + q * (lv - MOUTH.y), 3, 3); }
      c.restore();
      bottlePath(c); c.strokeStyle = 'rgba(90,120,130,0.8)'; c.lineWidth = 3; c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.4)'; c.beginPath(); c.ellipse(138, 470, 6, 34, 0.08, 0, 7); c.fill();
      // the target outline: a full balloon standing on the neck (levels 0 and 1)
      if (g.level <= 1 && !g.done && s.gas < 0.5) { c.save(); c.setLineDash([7, 7]); c.lineDashOffset = -t * 20; c.strokeStyle = 'rgba(232,56,74,0.6)'; c.lineWidth = 3; c.beginPath(); c.arc(MOUTH.x, MOUTH.y - 4 - (50 + BAL_R * 0.8) * 0.62 - 4, BAL_R, 0, 7); c.stroke(); c.restore(); }
      balloon(c, s, t);
      const tp = tipOf(s); if (!s.grab && s.gas < 0.3) SK.glow(c, g, tp.x, tp.y, 30);
      // the frog
      const won = g.result === 'win', lost = g.result === 'fail';
      SK.animal(c, 'frog', 300, TABLE + 4, 1, { t, facing: -1, pose: won ? 'cheer' : lost ? 'sad' : s.foam > 0.2 ? 'hop' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : s.foam > 0.2 ? 'wow' : 'happy' });
      const h = tipOf({ a: HANG, gas: 0 });
      SK.demo(g, c, 'drag', [h.x, h.y], [MOUTH.x + 4, MOUTH.y - 90], { arc: 30 });
    },
    // the bot lifts the balloon upright and holds it there until the soda has all fallen in
    auto(g, dt, synth) {
      const s = g.s, B = s._b = s._b || { st: 0 }; if (g.done || g.t < 1.0) return;
      const h = tipOf({ a: HANG, gas: 0 });
      if (B.st === 0) { synth('down', h.x, h.y); B.st = 1; B.t0 = g.t; return; }
      if (B.st === 1) { const k = Math.min(1, (g.t - B.t0) / 0.4), a = SK.lerp(HANG, 0, k); synth('move', MOUTH.x + Math.sin(a) * 80, MOUTH.y - Math.cos(a) * 80); if (k >= 1 && s.powder <= 0) { synth('up', MOUTH.x, MOUTH.y - 80); B.st = 2; } }
    },
  });
})();
