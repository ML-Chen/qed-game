// STAY LOW! (chem_bio FP-05) — a hallway at night with a fire glowing behind the far doorway. Hot smoke rises and
// fills the hallway from the ceiling down, sinking lower as it thickens. Drag each animal to the open door: the lower
// your finger, the lower it crawls. Down near the floor the air is clear. Upright, its head goes into the smoke: it
// coughs and slows, and after too much smoke it stumbles. Animals left standing breathe smoke once the layer reaches
// them. Level 0: two animals; level 1: three; level 2: three, and the smoke sinks faster and lower.
(() => {
  const FLOOR = 560, CEIL = 140, DOOR = { x: 300, w: 52 }, START = 54, GOAL = 316;
  const SMK = [[440, 498, 6], [446, 505, 5], [456, 520, 4]]; // per level: smoke line at the start, at the end, seconds to sink
  function smokeLine(g) { const [a, b, d] = SMK[Math.min(2, g.level)]; return SK.lerp(a, b, SK.easeInOut(Math.min(1, g.t / d))); }
  const CAST = ['fox', 'rabbit', 'penguin'];
  function paintBg(o) {
    o.fillStyle = '#1a1020'; o.fillRect(0, 0, 360, 640);
    // the hallway wall: striped wallpaper, a skirting board, a picture and a lamp
    const wg = o.createLinearGradient(0, CEIL, 0, FLOOR); wg.addColorStop(0, '#6a4a6a'); wg.addColorStop(1, '#8a6a7a'); o.fillStyle = wg; o.fillRect(0, CEIL, 360, FLOOR - CEIL);
    for (let x = 0; x < 360; x += 24) { o.fillStyle = 'rgba(255,230,240,0.06)'; o.fillRect(x, CEIL, 10, FLOOR - CEIL); }
    o.fillStyle = '#4a2e3a'; o.fillRect(0, FLOOR - 16, 360, 16); o.fillStyle = 'rgba(255,255,255,0.1)'; o.fillRect(0, FLOOR - 16, 360, 2);
    o.fillStyle = '#3a2430'; o.fillRect(0, CEIL - 14, 360, 14);
    o.fillStyle = '#c8a060'; o.fillRect(146, 330, 70, 54); o.fillStyle = '#7ab0d8'; o.fillRect(152, 336, 58, 42); o.fillStyle = '#8ac060'; o.beginPath(); o.moveTo(152, 378); o.quadraticCurveTo(180, 350, 210, 370); o.lineTo(210, 378); o.fill();
    // the floor boards
    const fg = o.createLinearGradient(0, FLOOR, 0, 640); fg.addColorStop(0, '#8a5a3a'); fg.addColorStop(1, '#4a2e1e'); o.fillStyle = fg; o.fillRect(0, FLOOR, 360, 640 - FLOOR);
    o.strokeStyle = 'rgba(40,20,10,0.4)'; o.lineWidth = 1.5; for (let y = FLOOR + 14; y < 640; y += 16) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); }
    // the far doorway on the left, where the fire is
    o.fillStyle = '#2a1018'; o.fillRect(-10, 300, 40, FLOOR - 300);
    // the open exit door on the right: cool night air and a porch light
    const dg = o.createLinearGradient(0, 330, 0, FLOOR); dg.addColorStop(0, '#2a4a7a'); dg.addColorStop(1, '#4a8a6a'); o.fillStyle = dg; o.fillRect(DOOR.x, 330, DOOR.w, FLOOR - 330);
    o.fillStyle = '#5aa05a'; o.fillRect(DOOR.x, FLOOR - 26, DOOR.w, 26); o.fillStyle = 'rgba(255,250,220,0.8)'; for (let i = 0; i < 5; i++) { o.beginPath(); o.arc(DOOR.x + 8 + i * 10, 350 + (i % 2) * 14, 1.2, 0, 7); o.fill(); }
    o.strokeStyle = '#e8d8c0'; o.lineWidth = 7; o.strokeRect(DOOR.x - 3, 327, DOOR.w + 6, FLOOR - 324);
    o.fillStyle = '#a87a5a'; o.beginPath(); o.moveTo(DOOR.x + DOOR.w + 3, 330); o.lineTo(360, 316); o.lineTo(360, FLOOR + 10); o.lineTo(DOOR.x + DOOR.w + 3, FLOOR); o.fill();
    o.fillStyle = '#7ae08a'; o.beginPath(); o.roundRect(DOOR.x - 2, 296, DOOR.w + 4, 22, 5); o.fill(); o.fillStyle = '#fff'; o.beginPath(); o.moveTo(DOOR.x + 10, 307); o.lineTo(DOOR.x + 36, 307); o.lineTo(DOOR.x + 36, 301); o.lineTo(DOOR.x + 46, 307); o.lineTo(DOOR.x + 36, 313); o.lineTo(DOOR.x + 36, 307); o.fill(); o.fillRect(DOOR.x + 10, 305, 26, 4);
  }
  MG.add({
    id: 'staylow', stage: 'fire', cmd: 'STAY LOW!', time: 6, mood: 'storm', winText: 'Smoke rises!', failText: 'Cough!',
    card: { title: 'Clean air is near the floor', kind: 'Chemistry', ref: 'Fire safety: smoke layering',
      text: 'Smoke from a fire is hot, and hot gas is lighter than the cooler air around it, so it rises. It spreads along the ceiling and fills the room from the top down. The cleanest, coolest air stays near the floor.\n\nSmoke is the most dangerous part of most house fires. It is full of poison gases and makes it hard to see. That is why you get low and crawl to the way out, and leave the building straight away.',
      note: 'Hot smoke rises and fills a room from the ceiling down, so crawl low under it to get out.' },
    init(g) {
      const s = g.s, n = g.level >= 1 ? 3 : 2, xs = n === 3 ? [74, 142, 210] : [80, 176];
      s.an = xs.map((x, i) => ({ kind: CAST[i], x, sy: 1, smk: 0, cough: 0, out: 0, ph: i * 1.7 }));
      s.cur = null; s.fy = null; s.tx = 0; s.fell = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; let best = null, bd = 70; for (const a of s.an) { if (a.out) continue; const d = Math.abs(a.x - x) + Math.max(0, FLOOR - 90 - y) * 0.5; if (d < bd) { bd = d; best = a; } } s.cur = best; s.fy = y; s.tx = x; },
    move(g, x, y) { const s = g.s; if (s.fy == null) return; s.fy = y; s.tx = x; },
    up(g) { g.s.fy = null; g.s.cur = null; },
    update(g, dt) {
      const s = g.s, sl = smokeLine(g); if (s.fell) return;
      for (const a of s.an) {
        if (a.out) { a.x += 200 * dt; continue; }
        const mine = s.cur === a && s.fy != null, want = mine ? SK.clamp((FLOOR - s.fy) / 70, 0.42, 1) : 1; a.sy += (want - a.sy) * Math.min(1, dt * 10);
        const inSmoke = FLOOR - 62 * a.sy - 10 < sl;
        if (inSmoke) { a.smk += dt * 0.7; if ((a.cough += dt) > 0.4) { a.cough = 0; g.sfx('thud'); } } else a.cough = 0;
        if (mine) { const v = inSmoke ? 34 : 160, dx = s.tx - a.x; a.x += SK.clamp(dx, -v * dt, v * dt); a.x = Math.max(30, a.x); }
        if (a.x >= GOAL) { a.out = g.t; if (s.cur === a) s.cur = null; g.sfx('ding'); }
        if (a.smk >= 1.2 && !g.done) { s.fell = a; a.fellT = g.t; g.sfx('fail'); g.fail(); }
      }
      if (!g.done && s.an.every(a => a.out)) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, sl = smokeLine(g);
      c.drawImage(g.bake('staylow_bg', paintBg), 0, 0, 360, 640);
      B3.glow(c, 10, 470, 130, '255,120,40', 0.45 + 0.12 * Math.sin(t * 11));
      for (let i = 0; i < 3; i++) B3.flame(c, 2 + i * 12, FLOOR, 0.9, t, 1, i * 2);
      // the animals: the one you drag crawls as low as your finger; the others stand and wait
      const won = g.result === 'win';
      for (const a of s.an) {
        if (a.x > 380) continue; const head = FLOOR - 62 * a.sy, inSmoke = !a.out && head - 10 < sl;
        c.save(); if (a.out) { c.beginPath(); c.rect(0, 0, DOOR.x + DOOR.w, 640); c.clip(); }
        c.translate(a.x, FLOOR - 4); if (a.fellT) c.rotate(-Math.min(1.4, (t - a.fellT) * 5));
        c.scale(1 + (1 - a.sy) * 0.5, a.sy); SK.animal(c, a.kind, 0, 0, 1, { t, phase: a.ph, pose: a.out ? 'walk' : a.sy < 0.7 ? 'walk' : inSmoke ? 'sad' : 'idle', expr: inSmoke || a.fellT ? 'sad' : a.out ? 'laugh' : 'wow', noShadow: true });
        c.restore();
        if (inSmoke && !a.fellT) for (let i = 0; i < 3; i++) { const q = (t * 2 + i / 3 + a.ph) % 1; c.fillStyle = `rgba(90,80,90,${0.7 * (1 - q)})`; c.beginPath(); c.arc(a.x + 22 + q * 24, head + 6 - q * 10, 5 + q * 6, 0, 7); c.fill(); }
      }
      // the smoke layer, thick at the ceiling, with a rolling lower edge
      const sg = c.createLinearGradient(0, CEIL, 0, sl + 10); sg.addColorStop(0, 'rgba(40,34,44,0.92)'); sg.addColorStop(0.7, 'rgba(80,72,84,0.78)'); sg.addColorStop(1, 'rgba(110,100,110,0.66)');
      c.fillStyle = sg; c.beginPath(); c.moveTo(0, 0); c.lineTo(360, 0); c.lineTo(360, sl);
      for (let x = 360; x >= 0; x -= 12) c.lineTo(x, sl + Math.sin(x * 0.05 + t * 2) * 6 + Math.sin(x * 0.13 - t * 3) * 3);
      c.closePath(); c.fill();
      for (let i = 0; i < 12; i++) { const q = (t * 0.25 + B3.hash(i)) % 1, x = q * 400 - 20, y = sl - 4 + Math.sin(i * 2.1 + t) * 5; c.fillStyle = 'rgba(120,110,120,0.5)'; c.beginPath(); c.arc(x, y, 14 + B3.hash(i * 3) * 12, 0, 7); c.fill(); }
      if (g.level <= 1 && !g.done) { c.save(); c.strokeStyle = 'rgba(160,240,200,0.5)'; c.lineWidth = 3; c.setLineDash([8, 8]); c.lineDashOffset = -t * 30; c.beginPath(); c.moveTo(30, FLOOR - 28); c.lineTo(GOAL, FLOOR - 28); c.stroke(); c.restore(); }
      const next = s.an.find(a => !a.out); if (next && !s.cur) SK.glow(c, g, next.x, FLOOR - 30, 30);
      SK.demo(g, c, 'drag', [next ? next.x : START, FLOOR - 18], [GOAL + 6, FLOOR - 14], { period: 2.4, never: !next });
    },
    // the bot crawls each animal out in turn, the one nearest the door first
    auto(g, dt, synth) {
      const s = g.s; if (g.done) return; const B = s._b = s._b || { i: 0, t: 1.0 };
      const order = s.an.slice().sort((a, b) => b.x - a.x), a = order[B.i]; if (!a || g.t < B.t) return;
      if (!B.st) { B.st = g.t; B.x0 = a.x; B.dur = (GOAL + 20 - a.x) / 150; synth('down', a.x, FLOOR - 10); return; }
      const k = Math.min(1, (g.t - B.st) / B.dur); synth('move', SK.lerp(B.x0, GOAL + 30, k), FLOOR - 8);
      if (k >= 1 || a.out) { synth('up', GOAL + 30, FLOOR - 8); B.i++; B.st = 0; B.t = g.t + 0.1; }
    },
  });
})();
