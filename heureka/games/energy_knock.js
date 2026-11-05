// KNOCK DOWN! (physics PE-15) — a playroom at night: a plank ramp leans on a bookshelf, a block tower stands at its foot,
// and a bowling ball and a ping-pong ball wait on the rug. Drag a ball onto the ramp and let go. The ball speeds up as it
// rolls down (the higher you let go, the faster it arrives). The heavy bowling ball scatters the tower; the light
// ping-pong ball just goes "tik" and bounces back. Level 2: a taller tower that only a fast, heavy ball knocks down.
(() => {
  const P0 = [22, 176], P1 = [238, 470], FLOOR = 470, TX = 304, BW = 46, BH = 28;
  const DX = P1[0] - P0[0], DY = P1[1] - P0[1], L = Math.hypot(DX, DY), D = [DX / L, DY / L], N = [D[1], -D[0]];
  const ACC = 900 * D[1] * 5 / 7; // a rolling ball speeds up at 5/7 of g·sinθ
  const TOWERS = [[[4, 150], [5, 300]], [[5, 300], [6, 400]], [[5, 300], [6, 400], [7, 470]]]; // per level, each tower: blocks, the speed a bowling ball needs to topple it
  const BCOL = ['#e8563a', '#f2b33a', '#4aa8d8', '#7ac85a', '#b86ad8', '#f27aa0', '#e8563a'];
  function pathPos(b, sp) {
    if (sp <= L) return [P0[0] + D[0] * sp + N[0] * b.r, P0[1] + D[1] * sp + N[1] * b.r];
    const q = sp - L, k = Math.min(1, q / 22), x0 = P1[0] + N[0] * b.r, y0 = P1[1] + N[1] * b.r;
    return [x0 + q, SK.lerp(y0, FLOOR - b.r, SK.easeOut(k))];
  }
  // where on the ramp a ball let go at (b.x, b.y) lands, as a distance down the slope, or null if it is too far away
  function snap(b) {
    const vx = b.x - P0[0], vy = b.y - P0[1], along = vx * D[0] + vy * D[1], off = vx * N[0] + vy * N[1];
    if (off < -40 || off > 90 || along < -40 || along > L + 10) return null; return SK.clamp(along, 8, L - 12);
  }
  function paintRoom(o) {
    const wall = o.createLinearGradient(0, 0, 0, FLOOR); wall.addColorStop(0, '#20184a'); wall.addColorStop(0.6, '#3a2a68'); wall.addColorStop(1, '#55407a');
    o.fillStyle = wall; o.fillRect(0, 0, 360, FLOOR);
    const rnd = P.rng(5); // wallpaper: rows of tiny stars
    for (let y = 20; y < FLOOR - 10; y += 34) for (let x = (y / 34 % 2) * 17; x < 360; x += 34) { o.fillStyle = 'rgba(255,220,170,0.10)'; o.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? 2 : 5; o.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } o.fill(); }
    // the window with the moon
    o.fillStyle = '#4a3060'; o.beginPath(); o.roundRect(188, 128, 150, 112, 10); o.fill();
    const sky = o.createLinearGradient(0, 136, 0, 232); sky.addColorStop(0, '#0e1240'); sky.addColorStop(1, '#3a3a80'); o.fillStyle = sky; o.fillRect(196, 136, 134, 96);
    for (let i = 0; i < 18; i++) { o.fillStyle = `rgba(255,250,220,${0.4 + rnd() * 0.5})`; o.beginPath(); o.arc(198 + rnd() * 130, 138 + rnd() * 90, 0.8 + rnd() * 1.2, 0, 7); o.fill(); }
    o.fillStyle = '#fff4c8'; o.beginPath(); o.arc(296, 166, 17, 0, 7); o.fill(); o.fillStyle = '#16184a'; o.beginPath(); o.arc(305, 160, 15, 0, 7); o.fill();
    o.fillStyle = '#4a3060'; o.fillRect(261, 136, 4, 96); o.fillRect(196, 182, 134, 4);
    // a warm lamp glow on the wall
    const lg = o.createRadialGradient(130, 120, 10, 130, 120, 220); lg.addColorStop(0, 'rgba(255,200,120,0.28)'); lg.addColorStop(1, 'rgba(255,200,120,0)'); o.fillStyle = lg; o.fillRect(0, 0, 360, FLOOR);
    // the bookshelf that holds up the ramp
    o.fillStyle = '#6a3a24'; o.fillRect(0, 180, 46, FLOOR - 180); o.fillStyle = '#4a2414'; for (let y = 180; y < FLOOR; y += 58) o.fillRect(0, y, 46, 6);
    for (let y = 186; y < FLOOR - 8; y += 58) { let x = 2; while (x < 40) { const w = 5 + rnd() * 5, h = 34 + rnd() * 16; o.fillStyle = ['#d8503a', '#3a8ad0', '#e8b83a', '#5aa85a', '#c86ab0'][Math.floor(rnd() * 5)]; o.fillRect(x, y + 52 - h, w, h); o.fillStyle = 'rgba(255,255,255,0.25)'; o.fillRect(x + 1, y + 56 - h, w - 2, 2); x += w + 1; } }
    // the wooden floor
    const fl = o.createLinearGradient(0, FLOOR, 0, 640); fl.addColorStop(0, '#9a5a32'); fl.addColorStop(1, '#5a2e1a'); o.fillStyle = fl; o.fillRect(0, FLOOR, 360, 170);
    o.strokeStyle = 'rgba(40,16,10,0.35)'; o.lineWidth = 1.5; for (let i = -6; i <= 6; i++) { o.beginPath(); o.moveTo(180 + i * 40, FLOOR); o.lineTo(180 + i * 110, 640); o.stroke(); }
    for (let y = FLOOR + 22; y < 640; y += 30 + (y - FLOOR) * 0.3) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); }
    o.fillStyle = '#2a1830'; o.fillRect(0, FLOOR - 6, 360, 8);
    // the rug where the balls wait
    o.fillStyle = '#c83a5a'; o.beginPath(); o.ellipse(112, 560, 100, 34, 0, 0, 7); o.fill(); o.strokeStyle = '#f2c84a'; o.lineWidth = 4; o.setLineDash([8, 6]); o.beginPath(); o.ellipse(112, 560, 86, 26, 0, 0, 7); o.stroke(); o.setLineDash([]);
    // the ramp: a plank resting on the shelf, with a curved lip at the bottom
    o.fillStyle = '#e8b878'; o.strokeStyle = '#7a4a24'; o.lineWidth = 2.5; o.beginPath(); o.moveTo(P0[0] - 8, P0[1] - 6); o.lineTo(P1[0], P1[1]); o.quadraticCurveTo(P1[0] + 14, FLOOR, P1[0] + 26, FLOOR); o.lineTo(P1[0] - 16, FLOOR); o.lineTo(P0[0] - 8 - N[0] * 14, P0[1] - 6 - N[1] * 14); o.closePath(); o.fill(); o.stroke();
    for (let k = 0.12; k < 0.9; k += 0.19) { const x = P0[0] + DX * k, y = P0[1] + DY * k, col = P.mix('#5ac85a', '#e8403a', 1 - k); o.strokeStyle = col; o.lineWidth = 5; o.lineCap = 'round'; o.beginPath(); o.moveTo(x - N[0] * 2, y - N[1] * 2); o.lineTo(x + N[0] * 12, y + N[1] * 12); o.stroke(); } // height marks: red is high and fast
    o.strokeStyle = 'rgba(122,74,36,0.35)'; o.lineWidth = 1.2; for (let k = 0.1; k < 1; k += 0.18) { const x = P0[0] + DX * k - N[0] * 6, y = P0[1] + DY * k - N[1] * 6; o.beginPath(); o.moveTo(x, y); o.lineTo(x + D[0] * 30, y + D[1] * 30); o.stroke(); }
  }
  function drawBall(c, b, t = 0) {
    c.save(); c.globalAlpha = b.alpha ?? 1;
    if (b.st === 'home' && b.k === 'bowl') { c.fillStyle = 'rgba(80,10,30,0.45)'; c.beginPath(); c.ellipse(b.x, b.y + b.r - 2, b.r * 1.3, 8, 0, 0, 7); c.fill(); } // it sinks into the rug
    const hop = b.st === 'home' && b.k === 'pong' ? Math.abs(Math.sin(t * 5)) * 12 : 0; b = hop ? { ...b, y: b.y - hop } : b;
    SK.shadow(c, b.x, (b.st === 'home' || b.y > FLOOR - b.r - 2 ? Math.max(FLOOR, b.y + b.r) : b.y + b.r + 6), b.r * 0.9, b.r * 0.25, 0.25);
    if (b.k === 'bowl') {
      SK.ball(c, b.x, b.y, b.r, '#2a2a3a', { edge: '#0a0a14' });
      for (let i = 0; i < 3; i++) { const a = b.rot + [-0.35, 0.05, 0.4][i] - 1.2, rr = b.r * [0.5, 0.42, 0.5][i]; c.fillStyle = '#7a7a90'; c.beginPath(); c.arc(b.x + Math.cos(a) * rr, b.y + Math.sin(a) * rr, b.r * 0.12, 0, 7); c.fill(); }
    } else {
      SK.ball(c, b.x, b.y, b.r, '#fff4e6', { edge: '#c8a080', lw: 1.5 });
      c.strokeStyle = '#f2903a'; c.lineWidth = 2; c.beginPath(); c.arc(b.x, b.y, b.r * 0.62, b.rot, b.rot + 1.6); c.stroke();
    }
    c.restore();
  }
  function build(g, s) { const [n, need] = s.towers[s.round]; s.need = need; s.blocks = []; for (let i = 0; i < n; i++) s.blocks.push({ x: TX, y: FLOOR - BH / 2 - i * BH, a: 0, vx: 0, vy: 0, va: 0, col: BCOL[(i + s.round * 2) % BCOL.length], r: BH / 2, e: 0.2, mu: 1500, born: g.t + i * 0.06 }); }
  function block(c, bl, t) {
    const k = SK.easeOut(SK.clamp((t - (bl.born ?? -9)) / 0.35, 0, 1));
    c.save(); c.translate(bl.x, bl.free ? bl.y : bl.y - (1 - k) * 360); c.rotate(bl.a + (bl.wob || 0));
    c.fillStyle = bl.col; c.strokeStyle = P.shade(bl.col, -0.5); c.lineWidth = 2; c.beginPath(); c.roundRect(-BW / 2, -BH / 2, BW, BH, 5); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(-BW / 2 + 4, -BH / 2 + 3, BW - 8, 4);
    c.fillStyle = P.shade(bl.col, -0.25); c.beginPath(); c.arc(0, 2, 6, 0, 7); c.fill();
    c.restore();
  }
  MG.add({
    id: 'energy_knock', stage: 'energy', cmd: 'KNOCK DOWN THE TOWERS!', time: 7, mood: 'night', winText: 'Heavy and fast hits hard!', failText: 'Still up!',
    card: { title: 'Heavy and fast hits hard', kind: 'Physics', ref: 'Kinetic energy and momentum',
      text: 'A ball rolling down the ramp speeds up, because gravity keeps pulling it. The higher you let it go, the faster it is at the bottom.\n\nA moving ball carries energy. At the same speed, a heavier ball carries more energy than a light one, and a faster ball carries more than a slower one. The bowling ball has plenty, so it sends the blocks flying. The ping-pong ball is so light that it only taps the tower and bounces off.',
      note: 'Heavier and faster things carry more energy, so they hit harder.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level);
      s.balls = [
        { k: 'bowl', r: 27, m: 1, home: [76, 546], st: 'home', rot: 0 },
        { k: 'pong', r: 9, m: 0.03, home: [160, 556], st: 'home', rot: 0 },
      ];
      for (const b of s.balls) { b.x = b.home[0]; b.y = b.home[1]; }
      s.towers = TOWERS[lv]; s.round = 0; build(g, s); s.blocks.forEach(bl => { bl.born = -9; }); s.down = false; s.nextAt = 0; s.wob = -9; s.tik = -9; s.tries = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (s.down || s.balls.some(b => b.st === 'roll' || b.st === 'back')) return; const b = SK.pick(s.balls.filter(b => b.st === 'home'), x, y, 48); if (b) { b.st = 'drag'; SK.dragStart(g, b, x, y); g.sfx('tap'); } },
    move(g, x, y) { const b = SK.dragMove(g, x, y); if (b) { b.x = SK.clamp(b.x, 10, 350); b.y = SK.clamp(b.y, 130, 610); } },
    up(g) {
      const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const b = d.obj, sp = snap(b);
      if (sp == null) { b.st = 'home'; b.x = b.home[0]; b.y = b.home[1]; g.sfx('pop'); return; }
      b.st = 'roll'; b.sp = sp; b.u = 0; const [px, py] = pathPos(b, sp); b.x = px; b.y = py; s.tries++; g.sfx('thud');
    },
    update(g, dt) {
      const s = g.s;
      for (const b of s.balls) {
        if (b.st === 'roll' || b.st === 'back') {
          for (let i = 0; i < 4; i++) {
            const h = dt / 4; b.u += (b.sp < L ? ACC : -(b.u > 0 ? 60 : -60)) * h; b.sp += b.u * h; b.rot += b.u * h / b.r;
            if (b.sp < 4) { b.sp = 4; b.u = Math.abs(b.u) * 0.3; }
            const [px, py] = pathPos(b, b.sp); b.x = px; b.y = py;
            if (b.st === 'roll' && !s.down && b.x + b.r > TX - BW / 2) { // it reaches the tower
              const hit = b.m * b.u;
              if (hit >= s.need) { // the tower goes: each block takes off, the bottom ones fastest
                s.down = true; b.u *= 0.55; b.st = 'back'; b.backT = 9e9; g.sfx('crunch'); g.sfx('thud'); g.shake(7, 0.3); g.burst(TX - 10, FLOOR - 30, ['#ffd45a', '#fff6ea', '#e8563a'], 20, 220);
                s.blocks.forEach((bl, j) => { bl.free = true; bl.vx = hit * (1.15 - j * 0.09) * (0.75 + 0.5 * g.rand()); bl.vy = -120 - g.rand() * 260; bl.va = (g.rand() - 0.3) * 9; });
                if (s.round + 1 >= s.towers.length) s.wonAt = g.t + 0.45; else { s.wonAt = 9e9; s.nextAt = g.t + 1.1; }
              } else { // not enough: the ball bounces back (tik) and the tower only wobbles
                b.st = 'back'; b.backT = g.t; b.sp -= 1; b.u = -b.u * (b.k === 'pong' ? 0.8 : 0.12); s.wob = g.t; s.tik = g.t; s.tikK = b.k;
                g.sfx(b.k === 'pong' ? 'click' : 'thud'); if (b.k === 'pong') g.sfx('boing');
              }
            }
            if (b.x + b.r > 352) { b.sp -= (b.x + b.r - 352); b.u = -Math.abs(b.u) * 0.4; }
          }
          if (b.st === 'back' && g.t - b.backT > 1.1) { b.alpha = Math.max(0, 1 - (g.t - b.backT - 1.1) * 3); if (b.alpha <= 0) { b.st = 'home'; b.x = b.home[0]; b.y = b.home[1]; b.alpha = 1; b.rot = 0; } }
        }
      }
      for (const bl of s.blocks) {
        if (!bl.free) { bl.wob = g.t - s.wob < 0.8 ? Math.sin((g.t - s.wob) * 30) * (s.tikK === 'pong' ? 0.03 : 0.1) * (1 - (g.t - s.wob) / 0.8) * (bl.y < FLOOR - 40 ? 1 : 0.4) : 0; continue; }
        const hit = SK.step(bl, dt, { gy: 900, floor: FLOOR, right: 354 }); bl.a += bl.va * dt; if (bl.onFloor) { bl.va *= Math.exp(-6 * dt); bl.a = SK.lerp(bl.a, Math.round(bl.a / (Math.PI / 2)) * Math.PI / 2, Math.min(1, dt * 6)); }
        if (hit) g.sfx('thud');
      }
      if (s.nextAt && g.t > s.nextAt) { // the next, taller tower drops in, and the bowling ball comes home
        s.nextAt = 0; s.round++; build(g, s); s.down = false; g.sfx('drum');
        for (const b of s.balls) { b.st = 'home'; b.x = b.home[0]; b.y = b.home[1]; b.alpha = 1; b.rot = 0; }
      }
      if (s.down && !g.done && g.t > s.wonAt) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t;
      c.drawImage(g.bake('knock_room', paintRoom), 0, 0, 360, 640);
      // dust motes drifting in the lamp light
      for (let i = 0; i < 10; i++) { const x = (60 + i * 37 + Math.sin(t * 0.4 + i) * 20) % 360, y = 140 + ((i * 53 + t * 8) % 300); c.fillStyle = 'rgba(255,230,180,0.35)'; c.beginPath(); c.arc(x, y, 1.4, 0, 7); c.fill(); }
      for (const bl of s.blocks) block(c, bl, t);
      // a dropped ball's landing spot on the ramp, while dragging
      const dr = SK.dragging(g); if (dr) { const sp = snap(dr); if (sp != null) { const [px, py] = pathPos(dr, sp); c.save(); c.strokeStyle = 'rgba(255,240,200,0.7)'; c.lineWidth = 2.5; c.setLineDash([5, 5]); c.beginPath(); c.arc(px, py, dr.r, 0, 7); c.stroke(); c.restore(); } }
      for (const b of s.balls) if (b !== dr) drawBall(c, b, t);
      if (dr) drawBall(c, dr);
      // the ping-pong ball's "tik" and the tower's wobble
      if (t - s.tik < 0.7) { const k = (t - s.tik) / 0.7; c.save(); c.globalAlpha = 1 - k; c.strokeStyle = '#fff6ea'; c.lineWidth = 3; for (let i = 0; i < 3; i++) { const a = Math.PI + (i - 1) * 0.6; c.beginPath(); c.moveTo(TX - BW / 2 - 8 + Math.cos(a) * 10, FLOOR - 14 + Math.sin(a) * 10); c.lineTo(TX - BW / 2 - 8 + Math.cos(a) * (18 + k * 14), FLOOR - 14 + Math.sin(a) * (18 + k * 14)); c.stroke(); } c.restore(); SK.tag(c, s.tikK === 'pong' ? 'tik' : 'wobble', TX - 52, FLOOR - 70 - k * 20, 18); }
      // the hedgehog watches from the floor
      const won = g.result === 'win', lost = g.result === 'fail', ow = t - s.tik < 1.2;
      SK.animal(c, 'hedgehog', 296, 614, 0.95, { t, pose: won ? 'cheer' : lost ? 'sad' : ow ? 'hop' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : ow ? 'wow' : 'happy', facing: -1 });
      if (s.balls[0].st === 'home') SK.tag(c, 'Bowling ball', 80, 496, 18); if (s.balls[1].st === 'home') SK.tag(c, 'Ping-pong ball', 178, 598, 18);
      const bowl = s.balls[0];
      if (bowl.st === 'home' && !s.down && s.balls[1].st === 'home') { const tg = [P0[0] + D[0] * 50 + N[0] * 27, P0[1] + D[1] * 50 + N[1] * 27]; SK.target(c, g, tg[0], tg[1], 30); SK.grab(c, g, bowl.x, bowl.y, 32); SK.arrow(c, g, bowl.x, bowl.y, tg[0], tg[1], { from: 40, to: 44 }); }
      SK.demo(g, c, 'drag', bowl.home, [P0[0] + D[0] * 50 + N[0] * 23, P0[1] + D[1] * 50 + N[1] * 23], { period: 2, never: s.down || s.balls.some(b => b.st !== 'home') });
    },
    // the bot: carry the bowling ball to near the top of the ramp and let it go, once per tower (level 1: try the ping-pong ball first)
    auto(g, dt, synth) {
      const s = g.s, [bw, pp] = s.balls, top = [P0[0] + D[0] * 40 + N[0] * 23, P0[1] + D[1] * 40 + N[1] * 23]; if (g.done || s.down) return;
      if (g.level === 1 && !(s._bot && s._bot.pong === 2)) { SK.bot.drag(g, synth, 'pong', 1.0, pp.home, [top[0] - 8, top[1] - 8], 0.5); return; }
      const key = 'carry' + s.round, B = s._bot || {};
      if (!B[key] && (pp.st !== 'home' || bw.st !== 'home')) return;
      s._bt = s._bt || {}; s._bt[key] = s._bt[key] ?? Math.max(g.t, 1.0) + 0.15;
      SK.bot.drag(g, synth, key, s._bt[key], bw.home, top, 0.45);
    },
  });
})();
