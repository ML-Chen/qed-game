// RAISE JUST ENOUGH TO REACH THE FLAG! (business SV-31, how much to raise) — the fox's startup is a little car on a
// road; the next milestone is a flag up ahead (a working product, the first 100 customers). Cash is fuel. Slide the
// Raise knob: the investor pours in more cash, the dotted reach line on the road stretches, and the investor's slice
// of the company pie grows. Let go and the car drives, burning cash. Too little and it sputters out short of the flag;
// far too much and it gets there but the investor's slice swallows the pie. Raise just enough, with a little to spare.
// Two milestones at level 0, three at levels 1 and 2. Level 2: the flag can slide further on the way (plans slip).
(() => {
  const ROAD = 316, X0 = 44, SL = { x0: 40, x1: 320, y: 584 }, PIE = { x: 262, y: 460, r: 64 }, TANK = { x: 76, y0: 392, y1: 524 };
  const FLAGS = [[196, 268, 230], [250, 200, 290], [220, 296, 250], [280, 220, 300], [210, 250, 286]];
  const reachOf = kx => X0 + (kx - SL.x0) / (SL.x1 - SL.x0) * 316, kxOf = r => SL.x0 + (r - X0) / 316 * (SL.x1 - SL.x0);
  function paintRoad(o) {
    const sky = o.createLinearGradient(0, 0, 0, ROAD); sky.addColorStop(0, '#ff9ac0'); sky.addColorStop(0.6, '#ffc890'); sky.addColorStop(1, '#fff2d0'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    P.cloud(o, 90, 200, 0.6); P.cloud(o, 290, 160, 0.45); P.hills(o, 360, ROAD - 10, 50, '#b8d870', '#80a848', { seed: 14 }); P.tree(o, 330, ROAD - 14, 0.6, '#6a9a4a', 8);
    o.fillStyle = '#5a5a68'; o.fillRect(0, ROAD - 4, 360, 26); o.fillStyle = '#fff6ea'; for (let x = 10; x < 360; x += 36) o.fillRect(x, ROAD + 8, 18, 3);
    const gr = o.createLinearGradient(0, ROAD + 22, 0, 640); gr.addColorStop(0, '#a8d870'); gr.addColorStop(1, '#70a848'); o.fillStyle = gr; o.fillRect(0, ROAD + 22, 360, 330);
    P.grassTufts(o, 360, 540, 560, 12, '#4a8a38', 6);
    o.fillStyle = 'rgba(30,14,36,0.55)'; o.beginPath(); o.roundRect(SL.x0 - 16, SL.y - 14, SL.x1 - SL.x0 + 32, 28, 14); o.fill();
  }
  function car(c, x, y, t, moving, sput, kind) {
    const b = moving ? Math.sin(t * 30) * 1.2 : 0; c.save(); c.translate(x, y + b);
    if (sput) { for (let i = 0; i < 3; i++) { const q = (t * 1.5 + i / 3) % 1; c.fillStyle = `rgba(80,80,90,${0.5 * (1 - q)})`; c.beginPath(); c.arc(-34 - q * 30, -14 - q * 20, 6 + q * 10, 0, 7); c.fill(); } }
    SK.animal(c, kind, -2, -18, 0.55, { t, noShadow: true, expr: sput ? 'sad' : moving ? 'laugh' : 'happy', pose: 'idle' });
    c.fillStyle = '#e8503a'; c.strokeStyle = '#7a2a1a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-32, -6); c.lineTo(-28, -24); c.lineTo(-12, -24); c.lineTo(-8, -30); c.lineTo(20, -30); c.lineTo(30, -12); c.lineTo(32, -6); c.closePath(); c.fill(); c.stroke();
    for (const wx of [-18, 18]) { c.fillStyle = '#2a2430'; c.beginPath(); c.arc(wx, -4, 9, 0, 7); c.fill(); c.fillStyle = '#c8c8d4'; c.beginPath(); c.arc(wx, -4, 3.5, 0, 7); c.fill(); }
    c.restore();
  }
  function flag(c, x, t, ghost) { c.save(); c.globalAlpha *= ghost ? 0.35 : 1; c.strokeStyle = '#3a2a3a'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, ROAD); c.lineTo(x, ROAD - 70); c.stroke(); const w = Math.sin(t * 4) * 4; c.fillStyle = '#5ad07a'; c.beginPath(); c.moveTo(x, ROAD - 70); c.quadraticCurveTo(x + 18, ROAD - 64 + w, x + 34, ROAD - 60 + w); c.quadraticCurveTo(x + 18, ROAD - 54, x, ROAD - 48); c.closePath(); c.fill(); c.restore(); }
  const BUF = [0.4, 0.34, 0.26];
  MG.add({
    id: 'raiseenough', stage: 'startups', cmd: 'RAISE JUST ENOUGH FOR THE FLAG!', time: 8, mood: 'party', winText: 'Milestone, and most of the pie!', failText: 'Out of road!', hold: 1.6,
    card: { title: 'Raise enough, not too much', kind: 'Startups', ref: 'How much to raise',
      text: 'A startup raises money to reach its next milestone: a working product, or its first paying customers. Cash runs out at a steady rate, so the money must last until the flag.\n\nEvery bit of money raised sells part of the company. At the same price, raising twice as much sells about twice as big a slice.\n\nToo little and you run out before the milestone. Far too much and you sell more of the company than you needed to. Founders raise enough to get there with some to spare.',
      note: 'Raise enough cash to reach the next milestone with a little to spare, because every extra dollar sells more of the company.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 5); s.L = L; s.flags = FLAGS[s.v].slice(0, L === 0 ? 2 : 3); s.ri = 0; s.prev = []; this.newRound(g);
    },
    newRound(g) { const s = g.s; s.F = s.flags[s.ri]; s.F0 = s.F; s.kx = SL.x0; s.phase = 'set'; s.cx = X0; s.pt = g.t; s.drift = s.L === 2 ? Math.round(18 + g.rand() * 14) : 0; },
    want(s) { return Math.max(s.F0 + (s.F0 - X0) * BUF[s.L] * 0.55, s.F0 + s.drift + 6); },
    raise(s) { return Math.max(0, reachOf(s.kx) - X0); },
    slice(s) { const R = this.raise(s), V = 3 * (s.F0 - X0); return R / (R + V); },
    tooMuch(s) { return reachOf(s.kx) > s.F0 + (s.F0 - X0) * BUF[s.L]; },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.phase !== 'set') return; if (y > SL.y - 44 && y < SL.y + 40) { s.drag = true; s.kx = SK.clamp(x, SL.x0, SL.x1); g.sfx('tap'); } },
    move(g, x, y) { const s = g.s; if (!s.drag) return; const k = SK.clamp(x, SL.x0, SL.x1); if (Math.floor(k / 14) !== Math.floor(s.kx / 14)) g.sfx('coin', { vol: 0.15, pitch: 1.5 }); s.kx = k; },
    up(g) { const s = g.s; if (!s.drag) return; s.drag = false; if (g.done || this.raise(s) < 8) return; s.phase = 'drive'; s.pt = g.t; s.reach = reachOf(s.kx); s.big = this.tooMuch(s); g.sfx('coin'); g.sfx('swoosh', { vol: 0.5 }); },
    update(g, dt) {
      const s = g.s;
      if (s.phase === 'drive' && !g.done) {
        if (s.drift && s.F < s.F0 + s.drift && s.cx > X0 + 40) s.F = Math.min(s.F0 + s.drift, s.F + 60 * dt); // the milestone slips further away
        s.cx = Math.min(s.reach, s.cx + 230 * dt);
        if (s.cx >= s.F - 2) { if (s.big) { s.phase = 'big'; s.pt = g.t; g.sfx('wrong'); g.sfx('laugh', { vol: 0.5 }); } else { s.phase = 'made'; s.pt = g.t; g.sfx('cheer'); g.burst(s.F, ROAD - 60, ['#5ad07a', '#ffe27a', '#fff6ea'], 18, 180); s.prev.push(this.slice(s)); } }
        else if (s.cx >= s.reach) { s.phase = 'short'; s.pt = g.t; g.sfx('fail'); g.sfx('boing', { vol: 0.5, pitch: 0.6 }); }
      } else if (s.phase === 'made' && g.t - s.pt > 0.5) { s.ri++; if (s.ri >= s.flags.length) g.win(); else this.newRound(g); }
      else if ((s.phase === 'short' || s.phase === 'big') && g.t - s.pt > 1.2) this.newRound(g);
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', R = this.raise(s), live = s.phase === 'set', sl = this.slice(s), big = this.tooMuch(s), reach = reachOf(s.kx);
      c.drawImage(g.bake('n7road', paintRoad), 0, 0, 360, 640);
      if (s.drift && live) flag(c, s.F0 + s.drift, t, true);
      flag(c, s.F, t, false);
      SK.tag(c, 'Milestone', Math.min(300, s.F + 10), ROAD - 92, 18);
      // the reach line: how far this much cash will take the car
      if (live || s.phase === 'drive') { const lo = s.F0, hi = s.F0 + (s.F0 - X0) * BUF[s.L];
        if (g.level <= 1 && live) { c.fillStyle = 'rgba(90,208,122,0.35)'; c.fillRect(lo, ROAD - 4, hi - lo, 26); }
        c.save(); c.strokeStyle = big ? '#e8503a' : reach >= s.F0 ? '#5ad07a' : '#ffd45a'; c.lineWidth = 4; c.setLineDash([6, 6]); c.beginPath(); c.moveTo(s.cx + 30, ROAD - 2); c.lineTo(Math.max(s.cx + 30, reach), ROAD - 2); c.stroke(); c.restore();
        if (R > 4) { c.fillStyle = big ? '#e8503a' : '#ffd45a'; c.beginPath(); c.moveTo(reach, ROAD - 14); c.lineTo(reach - 8, ROAD - 26); c.lineTo(reach + 8, ROAD - 26); c.closePath(); c.fill(); } }
      const moving = s.phase === 'drive', sput = s.phase === 'short';
      car(c, s.cx, ROAD + 8, t, moving, sput, 'fox');
      // the cash tank: fills as you raise, drains as the car drives
      const full = live ? R / 260 : s.phase === 'drive' ? (s.reach - s.cx) / 260 : 0;
      c.fillStyle = 'rgba(30,14,36,0.35)'; c.beginPath(); c.roundRect(TANK.x - 30, TANK.y0, 60, TANK.y1 - TANK.y0, 12); c.fill();
      const fh = (TANK.y1 - TANK.y0 - 8) * SK.clamp(full, 0, 1); const tg = c.createLinearGradient(0, TANK.y1 - fh, 0, TANK.y1); tg.addColorStop(0, '#ffe27a'); tg.addColorStop(1, '#c8901a'); c.fillStyle = tg; c.beginPath(); c.roundRect(TANK.x - 26, TANK.y1 - 4 - fh, 52, fh, 9); c.fill();
      c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.beginPath(); c.roundRect(TANK.x - 30, TANK.y0, 60, TANK.y1 - TANK.y0, 12); c.stroke();
      SK.tag(c, 'Cash', TANK.x, TANK.y0 - 18, 18);
      // the company pie: earlier investors (grey), this investor's new slice (blue, red when far too big), the founders
      let a0 = -Math.PI / 2; const totalPrev = s.prev.reduce((m, x) => m + x * (1 - m), 0), newSl = live || moving || s.phase === 'big' ? sl * (1 - totalPrev) : 0;
      c.fillStyle = '#f0a040'; c.beginPath(); c.arc(PIE.x, PIE.y, PIE.r, 0, 7); c.fill();
      if (totalPrev > 0) { c.fillStyle = '#a8a8b8'; c.beginPath(); c.moveTo(PIE.x, PIE.y); c.arc(PIE.x, PIE.y, PIE.r, a0, a0 + totalPrev * 6.283); c.closePath(); c.fill(); a0 += totalPrev * 6.283; }
      if (newSl > 0) { c.fillStyle = big ? '#e8503a' : '#5a8ad8'; c.beginPath(); c.moveTo(PIE.x, PIE.y); c.arc(PIE.x, PIE.y, PIE.r + (big ? 6 : 0), a0, a0 + newSl * 6.283); c.closePath(); c.fill(); }
      c.strokeStyle = '#7a4a10'; c.lineWidth = 3; c.beginPath(); c.arc(PIE.x, PIE.y, PIE.r, 0, 7); c.stroke();
      SK.tag(c, 'Investor', PIE.x + 30, PIE.y - PIE.r - 16, 18, '#fff6ea', 'rgba(60,100,180,0.9)'); SK.tag(c, 'Founders', PIE.x - 24, PIE.y + PIE.r + 18, 18, '#fff6ea', 'rgba(170,100,30,0.92)');
      // the investor with a bag of cash
      SK.animal(c, 'owl', 168, 528, 0.9, { t, pose: live && R > 10 ? 'carry' : s.phase === 'big' ? 'cheer' : 'idle', expr: s.phase === 'big' ? 'laugh' : 'happy',
        hold: live && R > 10 ? (h => { const r = 8 + R / 18; h.fillStyle = '#d8b878'; h.strokeStyle = '#6a4a20'; h.lineWidth = 2; h.beginPath(); h.arc(0, -r, r, 0, 7); h.fill(); h.stroke(); }) : null });
      // the Raise slider
      c.fillStyle = '#ffd45a'; c.beginPath(); c.roundRect(SL.x0, SL.y - 5, s.kx - SL.x0, 10, 5); c.fill();
      SK.ball(c, s.kx, SL.y, 16, big ? '#e8503a' : '#f5c23a');
      SK.tag(c, 'Raise', SL.x0 + 30, SL.y - 34, 18);
      if (!g.done) SK.tag(c, 'Round ' + Math.min(s.ri + 1, s.flags.length) + ' / ' + s.flags.length, 80, 206, 18);
      if (s.phase === 'big' && t - s.pt < 1.2) SK.tag(c, 'Too much of the pie!', 190, 372, 20, '#fff6ea', 'rgba(170,40,50,0.92)');
      if (s.phase === 'short' && t - s.pt < 1.2) SK.tag(c, 'Out of cash!', 190, 372, 20, '#fff6ea', 'rgba(170,40,50,0.92)');
      // guidance: slide the knob until the reach line passes the flag (with a little to spare)
      if (live && !g.done && !s.drag) {
        const tx = kxOf(this.want(s));
        SK.grab(c, g, s.kx, SL.y, 22); SK.target(c, g, tx, SL.y, 20); SK.arrow(c, g, s.kx, SL.y - 26, tx, SL.y - 26, { from: 10, to: 18 });
        SK.demo(g, c, 'drag', [s.kx, SL.y], [tx, SL.y], { delay: 0.7 });
      }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.phase !== 'set' || g.t - s.pt < 0.3) return; const B = s._n7 = s._n7 || {};
      if (B.ri !== s.ri + '_' + s.pt) { B.ri = s.ri + '_' + s.pt; B.at = g.t; B.a = s.kx; }
      SK.bot.drag(g, synth, 'r' + B.ri, B.at, [B.a, SL.y], [kxOf(this.want(s)), SL.y], 0.45);
    },
  });
})();
