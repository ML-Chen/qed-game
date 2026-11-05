// FIRE! (physics AP1-01) — a snowy cliff over the sea. A cannon at the top points straight out sideways, and beside it a
// penguin holds a snowball over the edge. Boats sail past below. Tap to fire: at the same moment the penguin lets go of its
// snowball. The cannonball flies far out while the snowball drops straight down, yet dashed lines join them at the same
// height all the way down and they splash at the same instant: sideways speed does not change how fast a thing falls. So
// every shot takes the same time to come down, and you fire when a boat is the same distance from where the ball lands.
// Two boats at level 0, three at levels 1 and 2 (faster boats; level 0 and 1 mark where the ball will land).
(() => {
  const TOP = 236, SEA = 548, MUZ = { x: 108, y: TOP - 22 }, VX = 170, G = 900, DROP = { x: 64, y: TOP - 34 };
  const TFALL = Math.sqrt(2 * (SEA - MUZ.y) / G), LAND = MUZ.x + VX * TFALL; // every shot lands here, after the same time
  function paintCliff(o) {
    const sky = o.createLinearGradient(0, 0, 0, SEA); sky.addColorStop(0, '#8ac8f0'); sky.addColorStop(0.7, '#cfe8f8'); sky.addColorStop(1, '#f0f8ff'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    P.cloud(o, 250, 160, 0.7); P.cloud(o, 320, 300, 0.5);
    // far icebergs
    o.fillStyle = '#e8f4ff'; for (const [x, w, h] of [[230, 60, 40], [320, 40, 26]]) { o.beginPath(); o.moveTo(x - w / 2, SEA); o.lineTo(x - w * 0.2, SEA - h); o.lineTo(x + w * 0.1, SEA - h * 0.7); o.lineTo(x + w / 2, SEA); o.fill(); }
    // the sea
    const sg = o.createLinearGradient(0, SEA, 0, 640); sg.addColorStop(0, '#3a90c8'); sg.addColorStop(1, '#1a4a7a'); o.fillStyle = sg; o.fillRect(0, SEA, 360, 92);
    o.strokeStyle = 'rgba(255,255,255,0.35)'; o.lineWidth = 2; for (let i = 0; i < 8; i++) { o.beginPath(); o.moveTo(90 + i * 34, SEA + 14 + (i % 3) * 18); o.lineTo(110 + i * 34, SEA + 14 + (i % 3) * 18); o.stroke(); }
    // the cliff: rock face with a snow cap; its face is a smooth wall so the falling snowball's path shows against it
    const cg = o.createLinearGradient(0, 0, 90, 0); cg.addColorStop(0, '#6a6a8a'); cg.addColorStop(1, '#9a9ab8'); o.fillStyle = cg;
    o.beginPath(); o.moveTo(0, TOP); o.lineTo(60, TOP); o.lineTo(62, SEA + 92); o.lineTo(0, 640); o.closePath(); o.fill();
    o.fillStyle = '#ffffff'; o.beginPath(); o.moveTo(0, TOP - 10); o.quadraticCurveTo(60, TOP - 18, 130, TOP - 8); o.lineTo(130, TOP + 6); o.quadraticCurveTo(60, TOP + 2, 0, TOP + 12); o.closePath(); o.fill();
    o.fillStyle = '#9a9ab8'; o.fillRect(60, TOP, 70, 10);
    o.strokeStyle = 'rgba(50,50,80,0.25)'; o.lineWidth = 1.5; for (let y = TOP + 40; y < SEA; y += 40) { o.beginPath(); o.moveTo(8, y); o.lineTo(56, y + 6); o.stroke(); }
    // a bucket on a rock at the foot of the cliff to catch the dropped snowball
    o.fillStyle = '#5a5a7a'; o.beginPath(); o.ellipse(DROP.x, SEA + 4, 26, 9, 0, 0, 7); o.fill();
  }
  function boat(c, x, y, t, hit, col) {
    c.save(); c.translate(x, y + Math.sin(t * 3 + x / 40) * 2); c.scale(1.4, 1.4);
    c.fillStyle = col; c.strokeStyle = '#3a1a20'; c.lineWidth = 2; c.beginPath(); c.moveTo(-34, -8); c.lineTo(34, -8); c.lineTo(24, 8); c.lineTo(-24, 8); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#fff6ea'; c.fillRect(-34, -12, 68, 5); c.strokeStyle = '#7a5a3a'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -12); c.lineTo(0, -54); c.stroke();
    c.fillStyle = hit ? '#ffd45a' : '#ffffff'; c.beginPath(); c.moveTo(2, -52); c.lineTo(26, -20); c.lineTo(2, -20); c.closePath(); c.fill(); c.strokeStyle = '#8a8aa0'; c.lineWidth = 1.5; c.stroke();
    if (hit) { c.fillStyle = '#f4f6ff'; c.beginPath(); c.arc(-12, -16, 8, 0, 7); c.arc(-4, -18, 7, 0, 7); c.fill(); }
    c.restore();
  }
  const COLS = ['#e8604a', '#4a8ae8', '#5ab060'];
  MG.add({
    id: 'fire', stage: 'motion', cmd: 'FIRE WHEN A BOAT CAN BE HIT!', time: 7, mood: 'sea', winText: 'Same fall!', failText: 'Splash!',
    card: { title: 'Sideways speed does not change falling', kind: 'Physics', ref: 'Projectile motion',
      text: 'The cannonball flies off sideways, fast. The penguin\'s snowball just drops. They leave at the same moment from the same height, and they hit the water at the same moment.\n\nGravity pulls both down in exactly the same way. Moving sideways does not change how fast something falls. The two motions, sideways and down, happen separately.\n\nSo every cannonball takes the same time to come down, whatever it does sideways. That is why you can fire early, just when a boat is far enough away.',
      note: 'A ball fired sideways falls at the same rate as a ball that is simply dropped.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.speeds = [[70, 90], [80, 100, 120], [100, 120, 135]][L]; s.bi = 0; s.mark = L < 2;
      s.boat = { x: 500, hit: 0 }; s.old = null; s.ball = null; s.snow = null; s.trail = []; s.lines = []; s.splash = []; s.cool = 0; s.recoil = -9;
    },
    down(g) { const s = g.s; SK.touched(g); if (g.done || s.ball || g.t < s.cool) return;
      s.ball = { x: MUZ.x, y: MUZ.y, vx: VX, vy: 0, t: 0 }; s.snow = { x: DROP.x, y: DROP.y, vy: 0 }; s.lines = []; s.recoil = g.t; g.sfx('thud'); g.sfx('rumble', { vol: 0.5 }); g.shake(3, 0.15); g.burst(MUZ.x + 10, MUZ.y, ['#ffffff', '#c8c8d8'], 10, 120); },
    update(g, dt) {
      const s = g.s, B = s.boat, v = s.speeds[Math.min(s.bi, s.speeds.length - 1)];
      B.x -= v * dt; if (s.old) { s.old.x -= 220 * dt; if (s.old.x < -60) s.old = null; } // a loaded boat sails off fast
      if (B.x < -60) s.boat = { x: 420, hit: 0 }; // a missed boat comes round again
      const b = s.ball;
      if (b) { // both fall under the same gravity; the cannonball also keeps its sideways speed
        b.vy += G * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.t += dt; const n = s.snow; n.vy += G * dt; n.y += n.vy * dt;
        if (s.lines.length < 8 && b.t > s.lines.length * 0.11) s.lines.push([n.x, n.y, b.x, b.y]);
        s.trail.push([b.x, b.y]); if (s.trail.length > 40) s.trail.shift();
        if (b.y >= SEA - 6) {
          s.splash.push({ x: b.x, t: g.t }, { x: n.x, t: g.t, bucket: 1 }); g.sfx('splash'); g.sfx('drip');
          if (!B.hit && Math.abs(b.x - B.x) < 46) { B.hit = g.t; g.sfx('ding'); g.sfx('cheer'); g.burst(b.x, SEA - 20, ['#ffd45a', '#ffffff'], 18, 180); s.old = B; s.oldCol = COLS[s.bi % 3]; s.bi++; if (s.bi >= s.speeds.length) { if (!g.done) g.win(); } else s.boat = { x: 420, hit: 0 }; }
          else g.sfx('laugh');
          s.ball = null; s.cool = g.t + 0.35; s.trail = [];
        }
      }
    },
    draw(g, c) {
      const s = g.s, t = g.t, B = s.boat, won = g.result === 'win';
      c.drawImage(g.bake('fire_cliff', paintCliff), 0, 0, 360, 640);
      // levels 0 and 1: a ring on the water where every cannonball lands
      if (s.mark && !g.done) { c.save(); c.strokeStyle = 'rgba(255,240,150,0.85)'; c.lineWidth = 3; c.setLineDash([6, 6]); c.lineDashOffset = -t * 20; c.beginPath(); c.ellipse(LAND, SEA + 2, 30, 7, 0, 0, 7); c.stroke(); c.restore(); }
      if (s.old) boat(c, s.old.x, SEA - 4, t, 1, s.oldCol); if (!won) boat(c, B.x, SEA - 4, t, B.hit, COLS[s.bi % 3]);
      // the splashes
      for (const p of s.splash) { const k = (t - p.t) / 0.6; if (k > 1) continue; c.strokeStyle = `rgba(255,255,255,${1 - k})`; c.lineWidth = 2.5; c.beginPath(); c.ellipse(p.x, SEA + (p.bucket ? 0 : 2), 8 + k * 26, 3 + k * 7, 0, 0, 7); c.stroke(); }
      if (s.splash.length > 6) s.splash.splice(0, s.splash.length - 6);
      // the two falls side by side, joined by dashed lines at equal heights
      c.save(); c.setLineDash([4, 5]); c.strokeStyle = 'rgba(80,40,110,0.55)'; c.lineWidth = 2; for (const [x0, y0, x1, y1] of s.lines) { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); } c.restore();
      for (const [x0, y0, x1] of s.lines) { c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.arc(x0, y0, 5, 0, 7); c.fill(); c.fillStyle = 'rgba(60,60,80,0.45)'; c.beginPath(); c.arc(x1, y0, 6, 0, 7); c.fill(); }
      for (let i = 1; i < s.trail.length; i++) { const [x0, y0] = s.trail[i - 1], [x1, y1] = s.trail[i]; c.strokeStyle = `rgba(60,60,80,${0.4 * i / s.trail.length})`; c.lineWidth = 4; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
      if (s.ball) { SK.ball(c, s.ball.x, s.ball.y, 11, '#3a3a4a'); SK.ball(c, s.snow.x, s.snow.y, 10, '#f4f6ff', { edge: '#8a86b8' }); }
      // the cannon
      const rc = Math.max(0, 1 - (t - s.recoil) * 6) * 8; c.save(); c.translate(MUZ.x - rc, MUZ.y); c.scale(1.5, 1.5); c.translate(-42, 0);
      c.fillStyle = '#3a3a4a'; c.beginPath(); c.roundRect(0, -11, 40, 22, 6); c.fill(); c.fillStyle = '#5a5a6a'; c.beginPath(); c.roundRect(34, -13, 8, 26, 3); c.fill();
      c.fillStyle = '#7a4a2a'; c.beginPath(); c.arc(12, 14, 10, 0, 7); c.fill(); c.fillStyle = '#c89a6a'; c.beginPath(); c.arc(12, 14, 4, 0, 7); c.fill(); c.restore();
      // the penguin at the edge, holding (or having just dropped) its snowball
      SK.animal(c, 'penguin', DROP.x - 30, TOP - 4, 1.1, { t, facing: 1, pose: won ? 'cheer' : s.ball ? 'wave' : 'point', expr: won ? 'laugh' : s.ball ? 'wow' : 'happy' });
      if (!s.ball && !g.done) SK.ball(c, DROP.x, DROP.y, 10, '#f4f6ff', { edge: '#8a86b8' });
      SK.tag(c, 'Cannon', MUZ.x - 20, MUZ.y - 40, 18);
      if (!s.ball && !g.done && t >= s.cool) { SK.glow(c, g, MUZ.x - 10, MUZ.y, 28, undefined, { level: 2 }); SK.demo(g, c, 'tap', [MUZ.x - 8, MUZ.y + 6], null, { period: 1.1 }); }
    },
    auto(g, dt, synth) {
      const s = g.s, B = s.boat, v = s.speeds[Math.min(s.bi, s.speeds.length - 1)]; if (g.done || s.ball || B.hit || g.t < Math.max(0.4, s.cool)) return;
      const want = LAND + v * TFALL; if (B.x <= want && B.x > want - v * dt * 2) { synth('down', MUZ.x, MUZ.y); synth('up', MUZ.x, MUZ.y); }
    },
  });
})();
