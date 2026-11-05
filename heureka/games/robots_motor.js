// MOTOR! (physics AP2-20) — an electric motor seen end-on: a coil of wire on an axle between two magnets (N and S). The
// axle winds a rope that lifts the beaver's log. Tap to send current through the coil, then tap again to flip the
// current each time the coil passes upright. The magnets push one side of the coil up and the other down (the push
// arrows), which turns it, but only until the coil is upright: past that point the same pushes would turn it back. Flip
// the current there and the pushes swap, so the coil keeps turning the same way and speeds up. Flip at the wrong
// moment, or not at all, and it rocks back and forth like a nervous pendulum. Level 0: five turns to lift the log;
// level 1: seven; level 2: nine, with less friction so the motor spins faster and the flips come faster.
(() => {
  const M = { x: 146, y: 372 }, RC = 58, K = 7, PULL = { x: 300, y: 184 }, BTN = { x: 180, y: 584 };
  const PLANS = [{ turns: 5, c: 1.25 }, { turns: 7, c: 1.0 }, { turns: 9, c: 0.75 }];
  function paintShop(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#3a6a8a'); bg.addColorStop(0.5, '#6aa0b8'); bg.addColorStop(1, '#a8c8a0'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    o.fillStyle = 'rgba(255,255,255,0.08)'; for (let x = 0; x < 360; x += 34) o.fillRect(x, 120, 16, 420);
    // the riverbank floor and the pulley post
    const fl = o.createLinearGradient(0, 520, 0, 640); fl.addColorStop(0, '#8ab060'); fl.addColorStop(1, '#5a8040'); o.fillStyle = fl; o.fillRect(0, 524, 360, 116);
    o.fillStyle = '#6a4a2a'; o.fillRect(PULL.x + 24, PULL.y - 10, 12, 340); o.fillRect(PULL.x - 20, PULL.y - 16, 60, 10);
    // the motor's base
    o.fillStyle = '#4a4a5a'; o.beginPath(); o.roundRect(M.x - 120, M.y + 96, 240, 26, 8); o.fill(); o.fillStyle = '#5a5a6a'; o.fillRect(M.x - 8, M.y, 16, 100);
  }
  function magnet(c, x, y, left) { const col = left ? '#e8503a' : '#3a7ae8';
    c.save(); c.fillStyle = 'rgba(20,10,30,0.3)'; c.beginPath(); c.roundRect(x - 34 + 4, y - 80 + 6, 68, 160, 12); c.fill();
    const g2 = c.createLinearGradient(x - 34, 0, x + 34, 0); g2.addColorStop(0, P.shade(col, 0.2)); g2.addColorStop(1, P.shade(col, -0.25)); c.fillStyle = g2;
    c.beginPath(); if (left) { c.moveTo(x - 34, y - 80); c.lineTo(x + 34, y - 80); c.lineTo(x + 34, y - 60); c.quadraticCurveTo(x + 6, y, x + 34, y + 60); c.lineTo(x + 34, y + 80); c.lineTo(x - 34, y + 80); }
    else { c.moveTo(x + 34, y - 80); c.lineTo(x - 34, y - 80); c.lineTo(x - 34, y - 60); c.quadraticCurveTo(x - 6, y, x - 34, y + 60); c.lineTo(x - 34, y + 80); c.lineTo(x + 34, y + 80); }
    c.closePath(); c.fill(); c.strokeStyle = P.shade(col, -0.5); c.lineWidth = 2.5; c.stroke(); c.restore();
    N5.text(c, left ? 'N' : 'S', x + (left ? -12 : 12), y, 34, '#fff6ea'); }
  function arrow(c, x, y, dy, col) { c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + dy); c.stroke(); const s = Math.sign(dy); c.beginPath(); c.moveTo(x, y + dy + s * 10); c.lineTo(x - 9, y + dy - s * 2); c.lineTo(x + 9, y + dy - s * 2); c.closePath(); c.fill(); c.restore(); }
  function wireEnd(c, x, y, into) { c.fillStyle = '#e8a040'; c.strokeStyle = '#7a4a10'; c.lineWidth = 2.5; c.beginPath(); c.arc(x, y, 13, 0, 7); c.fill(); c.stroke(); c.strokeStyle = '#3a1640'; c.fillStyle = '#3a1640'; c.lineWidth = 3;
    if (into) { c.beginPath(); c.moveTo(x - 6, y - 6); c.lineTo(x + 6, y + 6); c.moveTo(x + 6, y - 6); c.lineTo(x - 6, y + 6); c.stroke(); } else { c.beginPath(); c.arc(x, y, 3.5, 0, 7); c.fill(); } }
  MG.add({
    id: 'motor', stage: 'robots', cmd: 'FLIP THE CURRENT, LIFT THE LOG!', time: 7, mood: 'party', winText: 'The motor spins!', failText: 'It just rocks!',
    card: { title: 'How a motor keeps turning', kind: 'Physics', ref: 'Electric motors (DC motor and commutator)',
      text: 'When electricity flows through a wire between two magnets, the magnets push on the wire. In a loop of wire, the coil, one side is pushed up and the other side down, so the coil turns.\n\nThe pushes only turn it until the coil stands upright. Past that point, the same pushes would turn it back, so it would just rock.\n\nSo a motor flips the direction of the current every half turn, right as the coil passes upright. Then the pushes swap sides and keep turning the coil the same way. Real motors flip it automatically with a part called a commutator.',
      note: 'A motor spins because the current in its coil flips at just the right moment, every half turn.' },
    init(g) { const s = g.s; s.L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.pl = PLANS[s.L]; s.phi = [0, 0.25, -0.2, 0.15][s.v]; s.w = 0; s.cur = 0; s.rot = 0; s.flips = 0; s.flipT = -9; s.wrong = 0; s.rock = 0; },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || y < 470) return;
      const good = s.cur === 0 || torque(s) * s.w < 0; s.cur = s.cur === 0 ? 1 : -s.cur; s.flips++; s.flipT = g.t; g.sfx('click');
      if (!good) { s.wrong = g.t; g.sfx('wrong', { vol: 0.4 }); }
    },
    update(g, dt) {
      const s = g.s; if (g.done) return; const n = 4, h = dt / n;
      for (let i = 0; i < n; i++) { const tq = torque(s); s.w += (tq - s.pl.c * s.w) * h; s.phi += s.w * h; s.rot += s.w * h; }
      if (s.rot < 0) s.rot = 0; // the rope is fully let out; the log rests on the ground
      // rocking: turning back and forth without getting anywhere
      s.rock = Math.max(0, s.rock - dt); if (s.cur && Math.abs(torque(s)) > 0.5 && s.w * s.lastW < 0) { s.rock = 1.2; } s.lastW = s.w;
      const turns = s.rot / (2 * Math.PI); if (turns >= s.pl.turns) { g.win(); g.sfx('cheer'); g.sfx('ding'); g.burst(PULL.x + 30, 260, ['#ffd45a', '#fff6ea', '#7ee8a0'], 20, 160); }
      if (Math.floor(turns) > (s.lastTurn || 0)) { s.lastTurn = Math.floor(turns); g.sfx('tap', { pitch: 1 + s.lastTurn * 0.06 }); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', turns = s.rot / (2 * Math.PI), lift = SK.clamp(turns / s.pl.turns, 0, 1);
      c.drawImage(g.bake('motor_shop', paintShop), 0, 0, 360, 640);
      // the rope from the drum on the axle, over the pulley, down to the log; the log rises as the drum winds
      const LY = SK.lerp(500, 252, lift); c.strokeStyle = '#e8d8a8'; c.lineWidth = 3; c.beginPath(); c.moveTo(M.x + 20, M.y - 20); c.lineTo(PULL.x, PULL.y - 12); c.moveTo(PULL.x + 14, PULL.y); c.lineTo(PULL.x + 14, LY - 18); c.stroke();
      c.fillStyle = '#8a8a9a'; c.beginPath(); c.arc(PULL.x + 4, PULL.y, 14, 0, 7); c.fill(); c.fillStyle = '#4a4a5a'; c.beginPath(); c.arc(PULL.x + 4, PULL.y, 5, 0, 7); c.fill();
      c.save(); c.translate(PULL.x + 14, LY); c.fillStyle = '#8a5a30'; c.beginPath(); c.roundRect(-26, -16, 52, 32, 14); c.fill(); c.fillStyle = '#c89a60'; c.beginPath(); c.ellipse(22, 0, 8, 15, 0, 0, 7); c.fill(); c.strokeStyle = '#8a5a30'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(22, 0, 4, 8, 0, 0, 7); c.stroke(); c.restore();
      // the goal: a mark at the top of the post
      c.save(); c.setLineDash([6, 6]); c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 3; c.beginPath(); c.moveTo(PULL.x - 26, 234); c.lineTo(PULL.x + 50, 234); c.stroke(); c.restore();
      SK.tag(c, Math.min(s.pl.turns, Math.floor(turns)) + ' / ' + s.pl.turns + ' turns', 292, 150, 18);
      // field lines from N to S
      c.save(); c.strokeStyle = 'rgba(255,255,255,0.3)'; c.lineWidth = 2; c.setLineDash([6, 8]); c.lineDashOffset = -t * 20; for (const dy of [-50, -18, 18, 50]) { c.beginPath(); c.moveTo(M.x - 80, M.y + dy); c.lineTo(M.x + 80, M.y + dy); c.stroke(); } c.restore();
      magnet(c, M.x - 108, M.y, true); magnet(c, M.x + 108, M.y, false);
      // the drum and axle
      c.fillStyle = '#7a6a5a'; c.beginPath(); c.arc(M.x, M.y, 24, 0, 7); c.fill(); c.strokeStyle = '#e8d8a8'; c.lineWidth = 2; for (let k = 0; k < 4; k++) { c.beginPath(); c.arc(M.x, M.y, 14 + k * 2.5, -s.phi + k, -s.phi + k + 4.5); c.stroke(); }
      // the coil, seen end-on: a wire loop whose two sides carry the current into and out of the screen
      const ax = Math.cos(s.phi) * RC, ay = -Math.sin(s.phi) * RC, A = [M.x + ax, M.y + ay], B = [M.x - ax, M.y - ay];
      c.save(); c.strokeStyle = '#b8701a'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(A[0] + 10, A[1] - 12); c.lineTo(B[0] + 10, B[1] - 12); c.stroke(); c.strokeStyle = '#e8a040'; c.lineWidth = 9; c.beginPath(); c.moveTo(...A); c.lineTo(...B); c.stroke();
      c.strokeStyle = '#c8801a'; c.lineWidth = 6; c.beginPath(); c.moveTo(...A); c.lineTo(A[0] + 10, A[1] - 12); c.moveTo(...B); c.lineTo(B[0] + 10, B[1] - 12); c.stroke(); c.restore();
      wireEnd(c, A[0], A[1], s.cur < 0); wireEnd(c, B[0], B[1], s.cur > 0); // out of the screen on the side pushed up (N to S field)
      SK.tag(c, 'Coil', M.x, M.y + 116, 18);
      // the push arrows: with the field from N to S, the side whose current comes out of the screen is pushed up, the other down
      if (s.cur) { const F = 34; arrow(c, A[0], A[1] + (s.cur > 0 ? -18 : 18), s.cur > 0 ? -F : F, '#ffe27a'); arrow(c, B[0], B[1] + (s.cur > 0 ? 18 : -18), s.cur > 0 ? F : -F, '#ffe27a'); }
      // the flip button; it glows "Now!" when the coil has just passed upright and the pushes would turn it back
      const now = s.cur === 0 || torque(s) * s.w < -0.2, pr = t - s.flipT < 0.15 ? 1 : 0;
      N5.button(c, BTN.x, BTN.y, 230, 54, s.cur ? 'Flip current' : 'Switch on', now && !g.done ? '#3ab86a' : '#7a6a8a', pr, 22);
      if (now && !g.done && g.level <= 1 && s.cur) SK.tag(c, 'Now!', BTN.x + 140, BTN.y - 40, 20, '#fff6ea', 'rgba(40,150,70,0.95)');
      if (s.rock > 0 && !won) SK.tag(c, 'Rocking!', M.x, M.y - 104, 18, '#fff6ea', 'rgba(200,60,60,0.92)');
      // the beaver waits for its log
      SK.animal(c, 'beaver', 56, 540, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : s.rock > 0 ? 'wow' : 'happy', facing: 1 });
      // guidance: tap the button only while flipping helps
      if (!g.done) { if (now) SK.glow(c, g, BTN.x, BTN.y + 2, 60, '#ffe27a', { level: 2 }); SK.demo(g, c, 'tap', [BTN.x, BTN.y + 4], null, { never: !now, delay: 0.6, period: 0.7 }); }
    },
    // the bot flips just after the coil passes upright
    auto(g, dt, synth) { const s = g.s; if (g.done || g.t < 0.8) return; if ((s.cur === 0 || torque(s) * s.w < -0.2) && g.t - s.flipT > 0.12) { synth('down', BTN.x, BTN.y); synth('up', BTN.x, BTN.y); } },
  });
  // the turning push on the coil: strongest with the coil flat (sides far apart across the field), zero when upright
  function torque(s) { return K * s.cur * Math.cos(s.phi); }
})();
