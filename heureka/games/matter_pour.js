// POUR! (chemistry CB EL-12) — a jug of juice on a rail above a row of oddly shaped glasses: a star, a heart, an
// hourglass. Drag the jug sideways to move it and pull down to tip it. The juice flows out, falls into the glass and
// spreads to fill every corner of it, right into the star's points: a liquid takes the shape of its container. Fill
// every glass to the brim. Miss the opening or overfill and the juice splashes on the counter, and the jug runs dry.
// Level 1: ice cubes tumble in too and float as cubes, keeping their own shape (they are solid). Level 2: four glasses
// and only just enough juice.
(() => {
  const RAIL = 196, Q = 3400, BRIM = 0.97;
  const SHAPES = { // side-view outlines, as points relative to the glass's bottom centre; the first and last points are the rim
    star: [[-18, -112], [-18, -92], [-44, -80], [-24, -56], [-34, -12], [0, -32], [34, -12], [24, -56], [44, -80], [18, -92], [18, -112]],
    heart: [[-17, -112], [-17, -98], [-30, -104], [-46, -84], [-40, -52], [0, 0], [40, -52], [46, -84], [30, -104], [17, -98], [17, -112]],
    hour: [[-30, -112], [-30, -96], [-8, -60], [-30, -24], [-30, 0], [30, 0], [30, -24], [8, -60], [30, -96], [30, -112]],
    round: [[-17, -112], [-17, -84], [-40, -60], [-40, -18], [-22, 0], [22, 0], [40, -18], [40, -60], [17, -84], [17, -112]],
  };
  const LV = [{ cups: ['star', 'heart'], m: 1.45, ice: false }, { cups: ['heart', 'star', 'hour'], m: 1.3, ice: true }, { cups: ['hour', 'star', 'round', 'heart'], m: 1.16, ice: true }];
  const BASE = 548;
  function widthAt(pts, y) { // total width of the outline cut by a horizontal line at height y
    const xs = []; for (let i = 0; i < pts.length; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length]; if ((y0 <= y && y1 > y) || (y1 <= y && y0 > y)) xs.push(x0 + (y - y0) / (y1 - y0) * (x1 - x0)); }
    xs.sort((a, b) => a - b); let w = 0; for (let i = 0; i + 1 < xs.length; i += 2) w += xs[i + 1] - xs[i]; return w;
  }
  function makeCup(kind, cx) {
    const pts = SHAPES[kind], top = Math.min(...pts.map(p => p[1])), bot = Math.max(...pts.map(p => p[1])), cum = [0]; // cum[i]: area below height bot - i
    for (let i = 1; i <= bot - top; i++) cum.push(cum[i - 1] + widthAt(pts, bot - i + 0.5));
    return { kind, cx, pts, top, bot, cum, cap: cum[cum.length - 1] * 0.92, area: 0, open: [pts[0][0], pts[pts.length - 1][0]], ice: [] };
  }
  function levelOf(cup) { let i = 0; while (i < cup.cum.length - 1 && cup.cum[i] < cup.area) i++; return cup.bot - i; } // the juice surface, relative to the base
  function shapePath(c, cup) { c.beginPath(); for (const [x, y] of cup.pts) c.lineTo(cup.cx + x, BASE + y); }
  function paintKitchen(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#9ad4f0'); bg.addColorStop(1, '#e8f6ff'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    o.fillStyle = 'rgba(255,255,255,0.5)'; for (let y = 250; y < 548; y += 26) for (let x = (y / 26 % 2) * 13; x < 360; x += 26) o.fillRect(x + 1, y + 1, 24, 24);
    o.fillStyle = '#e8c890'; o.fillRect(0, 548, 360, 92); o.fillStyle = '#c8a070'; o.fillRect(0, 548, 360, 7);
    o.fillStyle = '#8a8aa0'; o.fillRect(0, RAIL - 60, 360, 6); o.fillStyle = '#b8b8c8'; o.fillRect(0, RAIL - 60, 360, 2); // the rail the jug hangs from
  }
  MG.add({
    id: 'matter_pour', stage: 'matter', cmd: 'FILL EVERY GLASS!', time: 8, mood: 'sea', winText: 'Juice fills every corner!', failText: 'Spilled!',
    card: { title: 'Liquids take any shape', kind: 'Chemistry', ref: 'Solids and liquids',
      text: 'A liquid flows. Its particles slide past each other, so juice runs into every corner of a glass, even the tips of a star, and its top settles flat. A liquid keeps its amount, though: pour too much and it spills over.\n\nA solid keeps its own shape. The particles in an ice cube are locked together, so the cube stays a cube in any glass. It just floats in the juice. A pile of sand pours too, but each grain is a tiny solid that keeps its shape.',
      note: 'Liquids flow and take the shape of their container; solids keep their own shape.' },
    init(g) {
      const s = g.s, L = LV[Math.min(2, g.level)], n = L.cups.length;
      s.cups = L.cups.map((k, i) => makeCup(k, 360 * (i + 0.5) / n));
      s.juice = s.cups.reduce((a, c) => a + c.cap, 0) * L.m; s.juice0 = s.juice; s.jug = { x: 110, tilt: 0 }; s.grab = null; s.spill = 0; s.puddle = []; s.pourX = null;
      s.ice = L.ice ? [{ dx: -8 }, { dx: 8 }] : []; s.iceOut = false;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (Math.abs(x - (s.jug.x - 36)) < 70 && y > RAIL - 90 && y < RAIL + 120) s.grab = { ox: s.jug.x - x, y0: y }; },
    move(g, x, y) { const s = g.s; if (!s.grab) return; s.jug.x = SK.clamp(x + s.grab.ox, 40, 340); s.jug.tilt = SK.clamp((y - s.grab.y0) / 90, 0, 1); },
    up(g) { const s = g.s; s.grab = null; s.jug.tilt = 0; },
    update(g, dt) {
      const s = g.s, j = s.jug; s.tiltS = SK.lerp(s.tiltS || 0, j.tilt, Math.min(1, dt * 10));
      const sx = j.x, sy = RAIL - 24; s.spout = [sx, sy]; // the jug hangs by its spout, so the spout stays put as it tips
      const flow = s.juice > 0 && s.tiltS > 0.3 ? Q * (s.tiltS - 0.3) / 0.7 : 0; s.pourX = flow ? sx : null; s.flow = flow;
      if (flow) {
        const a = Math.min(s.juice, flow * dt); s.juice -= a;
        const cup = s.cups.find(c => sx > c.cx + c.open[0] + 2 && sx < c.cx + c.open[1] - 2);
        if (cup && cup.area < cup.cap) { cup.area = Math.min(cup.cap, cup.area + a); s.target = cup; if (cup.area >= cup.cap * BRIM && !cup.full) { cup.full = g.t; g.sfx('ding'); g.burst(cup.cx, BASE + cup.top - 10, ['#ffd45a', '#fff6ea', '#ff9a4a'], 14, 140); } }
        else { s.spill += a; s.target = cup || null; if (g.rand() < 0.3) s.puddle.push({ x: SK.clamp(sx + (g.rand() - 0.5) * 30, 10, 350), r: 6 + g.rand() * 10 }); if (s.puddle.length > 40) s.puddle.shift(); }
        if (g.rand() < 0.15) g.sfx('drip');
        if (!s.iceOut && s.ice.length && cup && s.tiltS > 0.6) { s.iceOut = true; cup.ice = s.ice.map(q => ({ dx: q.dx, y: 0, t: g.t })); s.ice = []; g.sfx('splash'); }
      }
      if (s.cups.every(c => c.area >= c.cap * BRIM) && !g.done) { g.win(); g.sfx('cheer'); }
      else if (s.juice <= 1 && !g.done) { g.fail(); g.sfx('fail'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, j = s.jug, ang = (s.tiltS || 0) * 1.7;
      c.drawImage(g.bake('pour_kitchen', paintKitchen), 0, 0, 360, 640);
      for (const p of s.puddle) { c.fillStyle = 'rgba(255,150,40,0.45)'; c.beginPath(); c.ellipse(p.x, 556, p.r, p.r * 0.3, 0, 0, 7); c.fill(); }
      // the glasses and the juice inside, filling every corner
      for (const cup of s.cups) {
        const lvY = BASE + levelOf(cup); SK.shadow(c, cup.cx, BASE + 4, 40, 7, 0.15);
        c.save(); shapePath(c, cup); c.closePath(); c.fillStyle = 'rgba(190,225,250,0.55)'; c.fill(); c.clip();
        if (cup.area > 0) { const jg = c.createLinearGradient(0, lvY, 0, BASE); jg.addColorStop(0, '#ffb43a'); jg.addColorStop(1, '#f2803a'); c.fillStyle = jg; c.fillRect(cup.cx - 60, lvY + Math.sin(t * 6 + cup.cx) * (s.target === cup && s.flow ? 1.5 : 0.4), 120, BASE - lvY + 4); c.fillStyle = 'rgba(255,240,200,0.6)'; c.fillRect(cup.cx - 60, lvY, 120, 2); }
        for (const q of cup.ice) { const fy = cup.area > 0 ? lvY - 6 : BASE - 14; const k = SK.clamp((t - q.t) / 0.4, 0, 1), y = SK.lerp(BASE + cup.top - 30, fy, SK.easeOut(k)); c.fillStyle = 'rgba(230,248,255,0.9)'; c.strokeStyle = '#8ac0e0'; c.lineWidth = 1.5; c.save(); c.translate(cup.cx + q.dx, y); c.rotate(Math.sin(t * 2 + q.dx) * 0.15); c.beginPath(); c.roundRect(-8, -8, 16, 16, 3); c.fill(); c.stroke(); c.restore(); }
        c.restore();
        c.save(); shapePath(c, cup); c.strokeStyle = cup.full ? '#ffb43a' : '#3a6a90'; c.lineWidth = cup.full ? 5 : 3.5; c.lineJoin = 'round'; c.stroke(); c.restore();
        // the brim mark
        if (!cup.full) { const by = BASE + levelOf({ ...cup, area: cup.cap }); c.save(); c.setLineDash([4, 4]); c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 2; c.beginPath(); c.moveTo(cup.cx - 26, by); c.lineTo(cup.cx + 26, by); c.stroke(); c.restore(); }
      }
      // the juice stream, falling straight down from the spout
      if (s.pourX != null) { const cup = s.cups.find(cc => s.pourX > cc.cx + cc.open[0] && s.pourX < cc.cx + cc.open[1]), y1 = cup && cup.area < cup.cap ? BASE + levelOf(cup) : 552, w = 2 + 5 * (s.flow / Q);
        c.fillStyle = '#ffa43a'; c.beginPath(); c.moveTo(s.spout[0] - w / 2, s.spout[1]); c.lineTo(s.spout[0] + w / 2, s.spout[1]); c.lineTo(s.pourX + w / 2 - 1, y1); c.lineTo(s.pourX - w / 2 + 1, y1); c.fill();
        c.fillStyle = 'rgba(255,255,255,0.4)'; c.fillRect(s.pourX - 1, s.spout[1] + ((t * 400) % 60), 2, 20); }
      // the jug, hanging from the rail; it tips as you pull down
      c.strokeStyle = '#6a6a80'; c.lineWidth = 3; c.beginPath(); c.moveTo(j.x, RAIL - 56); c.lineTo(j.x, RAIL - 24); c.stroke();
      c.save(); c.translate(j.x, RAIL - 24); c.rotate(ang); c.translate(-40, 38);
      c.fillStyle = 'rgba(255,255,255,0.75)'; c.strokeStyle = '#5a7a9a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-26, -30); c.lineTo(30, -30); c.lineTo(40, -38); c.lineTo(34, -22); c.lineTo(26, 34); c.lineTo(-22, 34); c.closePath(); c.fill(); c.stroke();
      const fk = s.juice / s.juice0; if (fk > 0) { c.save(); c.beginPath(); c.moveTo(-26, -30); c.lineTo(30, -30); c.lineTo(26, 34); c.lineTo(-22, 34); c.closePath(); c.clip(); c.rotate(-ang); c.fillStyle = '#ffa43a'; c.fillRect(-120, 34 - fk * 66 + ang * 14, 240, 160); c.restore(); }
      for (const q of s.ice) { c.fillStyle = 'rgba(230,248,255,0.9)'; c.strokeStyle = '#8ac0e0'; c.lineWidth = 1.5; c.beginPath(); c.roundRect(q.dx - 8, -14, 16, 16, 3); c.fill(); c.stroke(); }
      c.strokeStyle = '#5a7a9a'; c.lineWidth = 5; c.beginPath(); c.arc(-30, 2, 14, Math.PI / 2, Math.PI * 1.5); c.stroke();
      c.restore();
      SK.tag(c, 'Juice', j.x - 36, RAIL + 66, 18);
      const won = g.result === 'win', lost = g.result === 'fail';
      SK.animal(c, 'penguin', 336, 626, 0.6, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
      const next = s.cups.find(cc => !cc.full);
      if (!s.grab && next) { SK.grab(c, g, j.x - 36, RAIL + 12, 42); SK.target(c, g, next.cx, BASE + next.top - 16, 24); SK.arrow(c, g, j.x - 36, RAIL + 12, next.cx - 20, BASE + next.top - 30, { from: 50, to: 30 }); }
      SK.demo(g, c, 'drag', [j.x - 36, RAIL + 12], [next ? next.cx - 36 : j.x, RAIL + 92], { period: 2, never: !next || !!s.grab });
    },
    // the bot: carry the jug over each glass (tilt so the spout sits over the opening), pour, ease off at the brim
    auto(g, dt, synth) {
      const s = g.s, j = s.jug; if (g.done || g.t < 1) return; const cup = s.cups.find(cc => cc.area < cc.cap * BRIM); if (!cup) return;
      const B = s.bot = s.bot || { on: false, y: RAIL };
      if (!B.on) { B.on = true; B.x = j.x - 36; B.y = RAIL + 12; synth('down', B.x, B.y); B.gy = B.y; return; }
      const fill = cup.area / cup.cap, over = Math.abs(j.x - cup.cx) < 4;
      if (!over && s.tiltS < 0.15) B.x += SK.clamp(cup.cx - j.x, -420 * dt, 420 * dt);
      const ty = over && fill < 0.95 ? B.gy + 90 : B.gy; B.y += SK.clamp(ty - B.y, -700 * dt, 700 * dt);
      synth('move', B.x, B.y);
    },
  });
})();
