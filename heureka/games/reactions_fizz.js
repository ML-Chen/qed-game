// FIZZ! (chem_bio EL-17) — a kitchen counter at sunset: bottles of vinegar, each with a red balloon stretched over its
// neck, hanging limp to one side, its bottom heavy with baking soda. Lift each balloon upright and hold it there: the
// soda pours into the vinegar, they react, the bottle foams, and the new gas (carbon dioxide) blows the balloon up. Let
// go too soon and the balloon flops back: only the soda that fell in has reacted, so it only half fills.
// Level 0: two bottles; level 1: three; level 2: three, and the soda is clumped and pours out slowly.
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
  // one bottle's balloon, in the bottle's own frame (the big bottle at x 180), pointing at angle a from straight up
  function balloon(c, b, t) {
    const a = b.a, k = SK.easeOut(b.gas), r = 21 + (BAL_R - 21) * k, len = 50 + r * 0.8;
    c.save(); c.translate(MOUTH.x, MOUTH.y - 4); c.rotate(a);
    const wob = Math.sin(t * 3 + b.ph) * 1.5 * k, cy = -len * 0.62;
    c.fillStyle = b.col; c.strokeStyle = P.shade(b.col, -0.5); c.lineWidth = 2.6;
    c.beginPath(); c.moveTo(-12, 8); c.lineTo(-7, -8);
    c.bezierCurveTo(-r * 1.15, cy + r * 0.7, -r * 1.05 + wob, cy - r * 1.15, 0, cy - r); c.bezierCurveTo(r * 1.05 - wob, cy - r * 1.15, r * 1.15, cy + r * 0.7, 7, -8);
    c.lineTo(12, 8); c.closePath(); c.fill(); c.stroke();
    if (b.powder > 0.02) { c.fillStyle = `rgba(255,252,244,${0.75 * b.powder + 0.1})`; c.beginPath(); c.ellipse(0, cy - r * 0.45, r * 0.7, r * 0.45 * (0.4 + 0.6 * b.powder), 0, 0, 7); c.fill(); }
    c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(-r * 0.45, cy - r * 0.3, r * 0.18, r * 0.11, -0.7, 0, 7); c.fill();
    c.restore();
    c.fillStyle = P.shade(b.col, -0.2); c.beginPath(); c.roundRect(MOUTH.x - 16, MOUTH.y, 32, 9, 4); c.fill(); c.strokeStyle = P.shade(b.col, -0.5); c.lineWidth = 2; c.stroke();
  }
  const tipOf = (b, a = b.a, gas = b.gas) => { const L = (50 + (21 + (BAL_R - 21) * SK.easeOut(gas)) * 1.6) * 0.75; return { x: MOUTH.x + Math.sin(a) * L, y: MOUTH.y - 4 - Math.cos(a) * L }; };
  // between the screen and a bottle's own frame
  const toScr = (b, p) => ({ x: b.x + (p.x - 180) * b.k, y: TABLE + (p.y - TABLE) * b.k });
  const toLoc = (b, x, y) => ({ x: (x - b.x) / b.k + 180, y: (y - TABLE) / b.k + TABLE });
  const RATE = [2.6, 1.8, 0.9];
  MG.add({
    id: 'fizz', stage: 'reactions', cmd: 'FILL THE BALLOONS WITH GAS!', time: 5, mood: 'desert', winText: 'New gas blew them up!', failText: 'Not enough gas!',
    card: { title: 'Mixing can make something new', kind: 'Chemistry', ref: 'Chemical reactions (baking soda and vinegar)',
      text: 'Baking soda and vinegar react. Their atoms swap partners and make new substances. One of them is carbon dioxide, a gas. The gas makes the bubbles, and it has to go somewhere, so it blows up the balloon.\n\nThe gas comes only from soda that has reached the vinegar. Let the balloon flop back early and less soda falls in, so less gas is made and the balloon only half fills. Bubbles of a new gas are one sign that a chemical reaction has happened.',
      note: 'In a chemical reaction, atoms rearrange to make new substances. Here the new substance is a gas.' },
    init(g) {
      const s = g.s, n = g.level >= 1 ? 3 : 2, v = s.v = SK.variant(g, 4), xs = n === 3 ? [64, 180, 296] : [[104, 256], [92, 248], [112, 266], [100, 260]][v], k = n === 3 ? 0.56 : 0.72;
      const PAL = ['#e8384a', '#3a8ae8', '#e8a020', '#3ab070', '#b060d0'], cols = [0, 1, 2].map(i => PAL[(i + v) % 5]), SIDES = [[-1, 1, -1], [1, -1, 1], [-1, -1, 1], [1, 1, -1]][v];
      s.b = xs.map((x, i) => { const side = SIDES[i]; return { x, k, side, hang: 2.25 * side, a: 2.25 * side, va: 0, powder: 1, react: 0, made: 0, gas: 0, foam: 0, col: cols[i], ph: i * 2 }; });
      s.grab = null;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; let best = null, bd = 60;
      for (const b of s.b) { if (b.gas > 0.3) continue; const tp = toScr(b, tipOf(b)), d = SK.dist(x, y, tp.x, tp.y); if (d < bd) { bd = d; best = b; } }
      s.grab = best; if (best) best.va = 0; },
    move(g, x, y) { const s = g.s, b = s.grab; if (!b || g.done) return; const p = toLoc(b, x, y), a = Math.atan2(p.x - MOUTH.x, -(p.y - MOUTH.y)); b.a = b.side < 0 ? SK.clamp(a, -2.4, 0.5) : SK.clamp(a, -0.5, 2.4); },
    up(g) { g.s.grab = null; },
    update(g, dt) {
      const s = g.s, rate = RATE[Math.min(2, g.level)];
      for (const b of s.b) {
        // gas pushes the balloon upright; with no gas and no hand it flops back down
        if (s.grab !== b) { const want = b.gas > 0.3 ? 0 : b.hang; b.va += ((want - b.a) * 40 - b.va * 7) * dt; b.a += b.va * dt; }
        if (Math.abs(b.a) < 0.75 && b.powder > 0) { const r = Math.min(b.powder, dt * rate); b.powder -= r; b.react += r; if (g.rand() < 0.25) g.sfx('rustle'); }
        if (b.react > 0) { const r = Math.min(b.react, dt * 1.1); b.react -= r; b.made += r; b.foam = Math.min(1, b.foam + r * 1.6); if (g.rand() < 0.3) g.sfx('bubble'); }
        else b.foam = Math.max(0, b.foam - dt * 0.35);
        const was = b.gas; b.gas = Math.min(b.made, b.gas + dt * 1.2);
        if (was < 0.98 && b.gas >= 0.98) { g.sfx('ding'); g.burst(b.x, TABLE - (TABLE - 200) * b.k, [b.col, '#fff6ea', '#ffd45a'], 12, 140); }
      }
      if (!g.done && s.b.every(b => b.gas >= 0.98)) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t;
      c.drawImage(g.bake('fizz_bg3', paintBg), 0, 0, 360, 640);
      for (const b of s.b) {
        c.save(); c.translate(b.x, TABLE); c.scale(b.k, b.k); c.translate(-180, -TABLE);
        SK.shadow(c, 180, TABLE + 2, 70, 9, 0.3);
        c.save(); bottlePath(c); c.clip();
        c.fillStyle = 'rgba(255,250,235,0.25)'; c.fillRect(100, 300, 160, 280);
        const lv = 430; const vg = c.createLinearGradient(0, lv, 0, TABLE); vg.addColorStop(0, 'rgba(250,226,150,0.75)'); vg.addColorStop(1, 'rgba(230,190,100,0.85)'); c.fillStyle = vg; c.fillRect(100, lv + Math.sin(t * 2 + b.ph) * 1.5, 160, 200);
        if (b.foam > 0.01) {
          const ft = lv - b.foam * 110, fb = ft + 26 + 20 * b.foam; c.fillStyle = 'rgba(255,253,244,0.95)'; c.beginPath(); c.moveTo(100, fb);
          for (let x = 100; x <= 260; x += 10) c.lineTo(x, ft + Math.sin(x * 0.3 + t * 8) * 4); c.lineTo(260, fb);
          for (let x = 260; x >= 100; x -= 12) c.lineTo(x, fb + Math.sin(x * 0.5 + t * 5) * 5); c.fill();
          for (let i = 0; i < 20; i++) { const q = (t * 1.3 + B3.hash(i)) % 1, bx = 126 + B3.hash(i * 2.3) * 108, by = TABLE - 8 - q * (TABLE - ft); c.strokeStyle = `rgba(200,200,190,${0.7 * (1 - q)})`; c.lineWidth = 1.6; c.beginPath(); c.arc(bx + Math.sin(t * 6 + i) * 3, by, 3 + B3.hash(i * 5) * 5, 0, 7); c.stroke(); }
        }
        if (Math.abs(b.a) < 0.75 && b.powder > 0) for (let i = 0; i < 22; i++) { const q = (t * 3 + i / 22) % 1; c.fillStyle = i % 3 ? '#fbfbf6' : '#dcdcd4'; c.fillRect(MOUTH.x - 6 + B3.hash(i) * 12, MOUTH.y + q * (lv - MOUTH.y), 4, 4); }
        c.restore();
        bottlePath(c); c.strokeStyle = 'rgba(90,120,130,0.85)'; c.lineWidth = 4; c.stroke();
        c.fillStyle = 'rgba(255,255,255,0.4)'; c.beginPath(); c.ellipse(138, 470, 6, 34, 0.08, 0, 7); c.fill();
        if (g.level <= 1 && !g.done && b.gas < 0.5) { c.save(); c.setLineDash([9, 9]); c.lineDashOffset = -t * 20; c.strokeStyle = P.rgba(b.col, 0.6); c.lineWidth = 4; c.beginPath(); c.arc(MOUTH.x, MOUTH.y - 4 - (50 + BAL_R * 0.8) * 0.62 - 4, BAL_R, 0, 7); c.stroke(); c.restore(); }
        balloon(c, b, t);
        c.restore();
      }
      const next = s.b.find(b => b.gas < 0.3); if (next && !s.grab) { const tp = toScr(next, tipOf(next)), up = toScr(next, { x: MOUTH.x, y: MOUTH.y - 100 }); SK.grab(c, g, tp.x, tp.y, 24); SK.target(c, g, up.x, up.y, 26); SK.arrow(c, g, tp.x, tp.y, up.x, up.y, { from: 26, to: 34 }); }
      // while a balloon is held: a ring above its bottle that turns green once it is upright enough for the soda to pour,
      // filling round as the soda falls in (keep holding until it closes)
      if (s.grab && !g.done) { const b = s.grab, up = toScr(b, { x: MOUTH.x, y: MOUTH.y - 100 }), pour = Math.abs(b.a) < 0.75, r = 40 * b.k + 12;
        c.save(); c.lineCap = 'round'; c.strokeStyle = 'rgba(30,14,36,0.45)'; c.lineWidth = 8; c.beginPath(); c.arc(up.x, up.y, r, 0, 7); c.stroke();
        c.strokeStyle = pour ? '#7ee8a0' : '#ffb060'; c.lineWidth = 5; c.beginPath(); c.arc(up.x, up.y, r, -Math.PI / 2, -Math.PI / 2 + Math.max(0.05, 1 - b.powder) * Math.PI * 2); c.stroke(); c.restore();
        if (!pour) { const p = 0.5 + 0.5 * Math.sin(t * 8); SK.tag(c, 'Higher!', up.x, up.y - r - 22 - 3 * p, 18, '#ffe27a'); } }
      const won = g.result === 'win', lost = g.result === 'fail', foamy = s.b.some(b => b.foam > 0.2);
      SK.animal(c, 'frog', 180, 294, 0.72, { t, pose: won ? 'cheer' : lost ? 'sad' : foamy ? 'hop' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : foamy ? 'wow' : 'happy' });
      const b0 = next || s.b[0], h = toScr(b0, tipOf(b0, b0.hang, 0)), up = toScr(b0, { x: MOUTH.x, y: MOUTH.y - 110 });
      { const b = s.b[0], bt = toScr(b, { x: 180, y: 505 }); SK.tag(c, 'Vinegar', bt.x, bt.y, 18); if (b.powder > 0.5) { const tp = toScr(b, tipOf(b)); SK.tag(c, 'Baking soda', tp.x + 36, tp.y + 40, 18); } }
      SK.demo(g, c, 'drag', [h.x, h.y], [up.x, up.y], { arc: 20, never: !next });
    },
    // the bot lifts each balloon upright in turn and holds it there until its soda has all fallen in
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 1.0) return; const B = s._b = s._b || { i: 0, st: 0 }, b = s.b[B.i]; if (!b) return;
      if (B.st === 0) { const h = toScr(b, tipOf(b, b.hang, 0)); synth('down', h.x, h.y); B.st = 1; B.t0 = g.t; return; }
      const k = Math.min(1, (g.t - B.t0) / 0.35), a = SK.lerp(b.hang, 0, k), p = toScr(b, { x: MOUTH.x + Math.sin(a) * 80, y: MOUTH.y - Math.cos(a) * 80 }); synth('move', p.x, p.y);
      if (k >= 1 && b.powder <= 0) { synth('up', p.x, p.y); B.i++; B.st = 0; }
    },
  });
})();
