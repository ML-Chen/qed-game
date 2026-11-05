// FIZZ! (chem_bio EL-17) — a kitchen counter at sunset: a bottle of vinegar, a frog holding a limp balloon, and dishes
// on the shelf. Drag a dish over the bottle and it tips in. Baking soda reacts with the vinegar: it foams, and the new
// gas (carbon dioxide) blows up the balloon the frog snaps on. Sand (or sugar, at level 2) just sinks: no new gas, and
// the balloon hangs limp.
(() => {
  const MOUTH = { x: 180, y: 330 }, TABLE = 566, SHELF = 338, BAL_R = 56;
  const KINDS = { soda: { col: '#fbfbf6', dk: '#dcdcd4', fizz: true }, sand: { col: '#e2bf78', dk: '#b8904a' }, sugar: { col: '#f4f8ff', dk: '#c8d8f0', glint: true } };
  function layout(g) {
    const kinds = g.level >= 2 ? ['soda', 'sand', 'sugar'] : ['soda', 'sand'];
    if (g.level >= 1) for (let i = kinds.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]]; }
    const spots = kinds.length === 3 ? [[60, SHELF - 16], [300, SHELF - 16], [58, TABLE - 18]] : [[60, SHELF - 16], [300, SHELF - 16]];
    return kinds.map((k, i) => ({ kind: k, x: spots[i][0], y: spots[i][1], hx: spots[i][0], hy: spots[i][1], ang: 0, full: 1, used: false }));
  }
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
    // two small shelves, one each side
    for (const [x0, x1] of [[10, 114], [246, 350]]) {
      o.fillStyle = 'rgba(90,40,20,0.18)'; o.fillRect(x0 + 4, SHELF + 12, x1 - x0 - 8, 10);
      const sh = o.createLinearGradient(0, SHELF, 0, SHELF + 14); sh.addColorStop(0, '#b8743e'); sh.addColorStop(1, '#8a5028'); o.fillStyle = sh; o.beginPath(); o.roundRect(x0, SHELF, x1 - x0, 14, 5); o.fill();
      for (const x of [x0 + 18, x1 - 18]) { o.fillStyle = '#7a4420'; o.beginPath(); o.moveTo(x - 6, SHELF + 14); o.lineTo(x + 6, SHELF + 14); o.lineTo(x, SHELF + 38); o.fill(); }
    }
    // counter
    const ct = o.createLinearGradient(0, TABLE, 0, 640); ct.addColorStop(0, '#c87a44'); ct.addColorStop(0.08, '#a85e30'); ct.addColorStop(1, '#6a3618'); o.fillStyle = ct; o.fillRect(0, TABLE, 360, 640 - TABLE);
    o.fillStyle = 'rgba(255,230,190,0.35)'; o.fillRect(0, TABLE, 360, 3);
    const r = P.rng(5); o.strokeStyle = 'rgba(60,20,10,0.18)'; o.lineWidth = 1; for (let i = 0; i < 14; i++) { const y = TABLE + 12 + r() * 50; o.beginPath(); o.moveTo(0, y); o.bezierCurveTo(120, y + r() * 6 - 3, 240, y + r() * 6 - 3, 360, y); o.stroke(); }
    P.vignette(o, 360, 640, 0.25, '#5a2a18');
  }
  function bottlePath(c) { // a round-bellied bottle, the neck at the top
    c.beginPath(); c.moveTo(166, MOUTH.y); c.lineTo(166, 382); c.bezierCurveTo(118, 400, 112, 440, 114, 500); c.quadraticCurveTo(116, TABLE, 150, TABLE); c.lineTo(210, TABLE); c.quadraticCurveTo(244, TABLE, 246, 500); c.bezierCurveTo(248, 440, 242, 400, 194, 382); c.lineTo(194, MOUTH.y); c.closePath();
  }
  function dish(c, d, t) {
    const K = KINDS[d.kind]; c.save(); c.translate(d.x, d.y); c.rotate(d.ang);
    if (d.full > 0.02) { // the heap of stuff in the dish
      const h = 16 * d.full; c.fillStyle = K.col; c.beginPath(); c.moveTo(-28, 6); c.quadraticCurveTo(0, 6 - h * 2.2, 28, 6); c.fill(); c.strokeStyle = K.dk; c.lineWidth = 1.5; c.stroke();
      for (let i = 0; i < 16; i++) { const a = B3.hash(i + d.kind.length * 7), b = B3.hash(i * 3.1 + 2); const px = -22 + a * 44, py = 4 - b * h * 1.4 * (1 - Math.abs(px) / 30); c.fillStyle = d.kind === 'sand' ? (i % 2 ? '#c89850' : '#f2d898') : d.kind === 'sugar' ? '#ffffff' : '#e8e8e2'; c.fillRect(px, py, d.kind === 'sugar' ? 3 : 2, d.kind === 'sugar' ? 3 : 2); }
      if (K.glint) for (let i = 0; i < 3; i++) { const p = (Math.sin(t * 4 + i * 2) + 1) / 2; c.fillStyle = `rgba(255,255,255,${p})`; c.beginPath(); c.arc(-14 + i * 14, 2 - h * 0.8 + (i % 2) * 4, 2.4 * p + 0.5, 0, 7); c.fill(); }
      if (d.kind === 'sand') { c.fillStyle = '#f4a8b8'; c.beginPath(); c.ellipse(10, 2 - h * 0.6, 5, 4, 0.4, 0, 7); c.fill(); c.strokeStyle = '#c86a80'; c.lineWidth = 1; c.stroke(); }
    }
    // the dish: a shallow blue bowl
    const bg = c.createLinearGradient(0, 2, 0, 20); bg.addColorStop(0, '#6ab0e0'); bg.addColorStop(1, '#2a6aa8'); c.fillStyle = bg;
    c.beginPath(); c.moveTo(-34, 4); c.quadraticCurveTo(-30, 20, 0, 21); c.quadraticCurveTo(30, 20, 34, 4); c.closePath(); c.fill(); c.strokeStyle = '#1e4a7a'; c.lineWidth = 2; c.stroke();
    c.fillStyle = '#a8d8f4'; c.beginPath(); c.ellipse(0, 4, 34, 4, 0, 0, 7); c.fill(); c.stroke();
    c.restore();
  }
  function balloon(c, s, t) {
    // before it is on: in the frog's hand (drawn by the hold callback); on the neck: limp, or blown up by the gas
    const k = s.gas, r = 10 + (BAL_R - 10) * SK.easeOut(k), cx = MOUTH.x, top = MOUTH.y - 4;
    c.save();
    if (k < 0.08) { // limp: droops over the side of the neck
      c.fillStyle = '#e8384a'; c.strokeStyle = '#8a1a2a'; c.lineWidth = 2; c.beginPath(); c.moveTo(cx - 15, top + 8); c.quadraticCurveTo(cx - 18, top - 16, cx - 2, top - 14); c.quadraticCurveTo(cx + 26, top - 12, cx + 30, top + 18 + Math.sin(t * 2) * 2); c.quadraticCurveTo(cx + 22, top + 30, cx + 15, top + 8); c.closePath(); c.fill(); c.stroke();
    } else {
      const cy = top - r * 0.9 - 6, wob = Math.sin(t * 3) * 1.5;
      c.fillStyle = '#e8384a'; c.strokeStyle = '#8a1a2a'; c.lineWidth = 2.2;
      c.beginPath(); c.moveTo(cx - 13, top + 8); c.lineTo(cx - 8, top - 6); c.bezierCurveTo(cx - r * 1.1, cy + r * 0.6, cx - r * 1.05 + wob, cy - r * 1.05, cx, cy - r); c.bezierCurveTo(cx + r * 1.05 - wob, cy - r * 1.05, cx + r * 1.1, cy + r * 0.6, cx + 8, top - 6); c.lineTo(cx + 13, top + 8); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(cx - r * 0.42, cy - r * 0.42, r * 0.2, r * 0.12, -0.7, 0, 7); c.fill();
    }
    c.fillStyle = '#c8283a'; c.beginPath(); c.roundRect(cx - 16, top + 4, 32, 9, 4); c.fill(); c.strokeStyle = '#8a1a2a'; c.lineWidth = 1.5; c.stroke();
    c.restore();
  }
  MG.add({
    id: 'fizz', stage: 'reactions', cmd: 'FIZZ!', time: 5, mood: 'desert', winText: 'Fizz!', failText: 'Flop!',
    card: { title: 'Mixing can make something new', kind: 'Chemistry', ref: 'Chemical reactions (baking soda and vinegar)',
      text: 'Baking soda and vinegar react. Their atoms swap partners and make new substances. One of them is carbon dioxide, a gas. The gas makes the bubbles, and it has to go somewhere, so it blows up the balloon.\n\nSand does not react with vinegar. It just sinks to the bottom. Sugar dissolves, but it makes no gas either. When a mix makes a new substance, like a gas, a chemical reaction has happened.',
      note: 'In a chemical reaction, atoms rearrange to make new substances. Bubbles of a new gas are one sign of it.' },
    init(g) {
      const s = g.s; s.dishes = layout(g); s.pour = null; s.on = false; s.gas = 0; s.foam = 0; s.sunk = 0; s.flopT = 0; s.react = 0;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (s.pour || g.done) return;
      const d = SK.pick(s.dishes.filter(d => !d.used), x, y, 52); if (d) SK.dragStart(g, d, x, y);
    },
    move(g, x, y) {
      const s = g.s, d = SK.dragMove(g, x, y); if (!d || s.pour) return;
      d.y = Math.min(d.y, 500);
      if (SK.dist(d.x, d.y, MOUTH.x, MOUTH.y - 60) < 62) { // over the bottle: it tips in
        SK.dragEnd(g); const side = d.x < MOUTH.x ? -1 : 1; s.pour = { d, t0: g.t, side, fx: d.x, fy: d.y }; g.sfx('swoosh');
      }
    },
    up(g) { const s = g.s, r = SK.dragEnd(g); if (r && r.obj && !s.pour) { r.obj.back = g.t; } },
    update(g, dt) {
      const s = g.s;
      for (const d of s.dishes) if (d.back != null && !(s.pour && s.pour.d === d)) { d.x += (d.hx - d.x) * Math.min(1, dt * 12); d.y += (d.hy - d.y) * Math.min(1, dt * 12); d.ang *= Math.max(0, 1 - dt * 10); }
      const P0 = s.pour; if (P0) {
        const d = P0.d, k = g.t - P0.t0, tx = MOUTH.x + P0.side * 34, ty = MOUTH.y - 62;
        if (k < 0.25) { const e = SK.easeOut(k / 0.25); d.x = SK.lerp(P0.fx, tx, e); d.y = SK.lerp(P0.fy, ty, e); d.ang = -P0.side * 1.05 * e; }
        else if (k < 1.0) { d.full = Math.max(0, 1 - (k - 0.25) / 0.7); if (KINDS[d.kind].fizz) s.react += dt * 1.4; else s.sunk += dt * 1.4; if (g.rand() < 0.2) g.sfx('rustle'); }
        else { d.used = true; d.full = 0; d.back = g.t; s.pour = null; if (!s.on) { s.on = true; g.sfx('snap'); } }
      }
      // the reaction: foam rises while there is soda left to react; the gas fills the balloon once it is on
      if (s.react > 0) { const r = Math.min(s.react, dt * 0.9); s.react -= r; s.foam = Math.min(1, s.foam + r * 1.6); s.made = (s.made || 0) + r; if (g.rand() < 0.5) g.sfx('bubble'); }
      else s.foam = Math.max(0, s.foam - dt * 0.4);
      const target = Math.min(1, (s.made || 0) / 1);
      if (s.on) s.gas = Math.min(target, s.gas + dt * 1.1);
      if (s.on && s.gas >= 0.98 && !g.done) { g.win(); g.sfx('cheer'); g.burst(MOUTH.x, MOUTH.y - 70, ['#e8384a', '#fff6ea', '#ffd45a'], 20, 180); }
      if (s.on && !g.done && s.react <= 0 && !s.pour && (s.made || 0) < 0.05 && s.dishes.some(d => d.used && !KINDS[d.kind].fizz)) { if (!s.flopT) { s.flopT = g.t; g.sfx('stretch'); } if (g.t - s.flopT > 0.7) { g.sfx('laugh'); g.fail(); } }
    },
    draw(g, c) {
      const s = g.s, t = g.t;
      c.drawImage(g.bake('fizz_bg', paintBg), 0, 0, 360, 640);
      // the bottle: vinegar, sunk grains, the foam
      SK.shadow(c, 180, TABLE + 2, 70, 9, 0.3);
      c.save(); bottlePath(c); c.clip();
      c.fillStyle = 'rgba(255,250,235,0.25)'; c.fillRect(100, 300, 160, 280);
      const lv = 430; const vg = c.createLinearGradient(0, lv, 0, TABLE); vg.addColorStop(0, 'rgba(250,226,150,0.75)'); vg.addColorStop(1, 'rgba(230,190,100,0.85)'); c.fillStyle = vg; c.fillRect(100, lv + Math.sin(t * 2) * 1.5, 160, 200);
      if (s.sunk > 0) { const h = Math.min(1, s.sunk) * 16; for (let i = 0; i < 40; i++) { const a = B3.hash(i * 1.7); c.fillStyle = s.dishes.some(d => d.used && d.kind === 'sugar') && !s.dishes.some(d => d.used && d.kind === 'sand') ? `rgba(255,255,255,${0.5 * Math.min(1, s.sunk)})` : (i % 2 ? '#c89850' : '#e8c880'); c.fillRect(124 + a * 112, TABLE - 3 - B3.hash(i * 4.3) * h, 3, 3); } }
      if (s.foam > 0.01) {
        const ft = lv - s.foam * 110, fb = ft + 26 + 20 * s.foam; c.fillStyle = 'rgba(255,253,244,0.95)'; c.beginPath(); c.moveTo(100, fb);
        for (let x = 100; x <= 260; x += 10) c.lineTo(x, ft + Math.sin(x * 0.3 + t * 8) * 4); c.lineTo(260, fb);
        for (let x = 260; x >= 100; x -= 12) c.lineTo(x, fb + Math.sin(x * 0.5 + t * 5) * 5); c.fill();
        for (let i = 0; i < 14; i++) { const bx = 104 + i * 12, by = ft + 8 + B3.hash(i) * 14; c.strokeStyle = 'rgba(220,214,190,0.8)'; c.lineWidth = 1; c.beginPath(); c.arc(bx, by + Math.sin(t * 7 + i) * 2, 3 + B3.hash(i * 3) * 4, 0, 7); c.stroke(); }
        for (let i = 0; i < 26; i++) { const q = (t * 1.3 + B3.hash(i)) % 1, bx = 126 + B3.hash(i * 2.3) * 108, by = TABLE - 8 - q * (TABLE - ft); c.strokeStyle = `rgba(200,200,190,${0.7 * (1 - q)})`; c.lineWidth = 1.2; c.beginPath(); c.arc(bx + Math.sin(t * 6 + i) * 3, by, 2 + B3.hash(i * 5) * 4, 0, 7); c.stroke(); }
      }
      c.restore();
      bottlePath(c); c.strokeStyle = 'rgba(90,120,130,0.8)'; c.lineWidth = 3; c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.4)'; c.beginPath(); c.ellipse(138, 470, 6, 34, 0.08, 0, 7); c.fill();
      c.fillStyle = 'rgba(200,230,240,0.9)'; c.beginPath(); c.ellipse(180, MOUTH.y, 15, 4, 0, 0, 7); c.fill(); c.stroke();
      // the stream of stuff falling from a tipping dish
      const P0 = s.pour; if (P0 && g.t - P0.t0 > 0.22 && g.t - P0.t0 < 1.0) { const K = KINDS[P0.d.kind], lx = P0.d.x - P0.side * 30, ly = P0.d.y + 10;
        for (let i = 0; i < 26; i++) { const q = (t * 3 + i / 26) % 1, px = SK.lerp(lx, MOUTH.x + (B3.hash(i) - 0.5) * 10, Math.min(1, q * 1.6)), py = ly + q * (lv - ly); c.fillStyle = i % 3 ? K.col : K.dk; c.fillRect(px - 1.5, py, 3, 3); } }
      // the target balloon outline (levels 0 and 1), then the balloon
      if (g.level <= 1 && !g.done && s.gas < 0.5) { c.save(); c.setLineDash([7, 7]); c.lineDashOffset = -t * 20; c.strokeStyle = 'rgba(232,56,74,0.6)'; c.lineWidth = 3; c.beginPath(); c.arc(MOUTH.x, MOUTH.y - 4 - BAL_R * 1.9 - 6, BAL_R, 0, 7); c.stroke(); c.restore(); }
      if (s.on) balloon(c, s, t);
      // the dishes
      for (const d of s.dishes) if (!(SK.dragging(g) === d) && !(P0 && P0.d === d)) dish(c, d, t);
      for (const d of s.dishes) if (SK.dragging(g) === d || (P0 && P0.d === d)) dish(c, d, t);
      const soda = s.dishes.find(d => d.kind === 'soda');
      if (!s.pour && !soda.used && !SK.dragging(g)) SK.glow(c, g, soda.x, soda.y, 36);
      // the frog, holding the balloon until it goes on
      const won = g.result === 'win', lost = g.result === 'fail' || s.flopT;
      SK.animal(c, 'frog', 306, TABLE + 4, 0.9, { t, facing: -1, pose: won ? 'cheer' : lost ? 'sad' : s.on ? 'idle' : 'carry', expr: won ? 'laugh' : lost ? 'sad' : s.foam > 0.2 ? 'wow' : 'happy',
        hold: s.on ? null : o => { o.fillStyle = '#e8384a'; o.strokeStyle = '#8a1a2a'; o.lineWidth = 2; o.beginPath(); o.ellipse(0, -8, 12, 18, 0.2, 0, 7); o.fill(); o.stroke(); o.fillStyle = '#c8283a'; o.fillRect(-5, 8, 10, 6); } });
      SK.demo(g, c, 'drag', [soda.hx, soda.hy], [MOUTH.x + (soda.hx < 180 ? -34 : 34), MOUTH.y - 62]);
    },
    auto(g, dt, synth) {
      const s = g.s, d = s.dishes.find(d => d.kind === 'soda'); if (g.done || d.used) return;
      SK.bot.drag(g, synth, 'pour', 1.0, [d.hx, d.hy], [MOUTH.x + (d.hx < 180 ? -30 : 30), MOUTH.y - 60], 0.5);
    },
  });
})();
