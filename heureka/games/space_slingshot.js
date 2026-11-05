// SWING PAST JUPITER TO SATURN! (space EE AS-05 SLINGSHOT!) — a space probe waits by the Earth at the bottom; the Sun's
// pull drags everything back down, so on its own the probe can't climb as far as Saturn's orbit at the top: it slows,
// stops and falls back. Jupiter sweeps across the middle. Drag from the probe to aim, let go to launch. Aim to pass
// just behind Jupiter (on the side it is moving away from): Jupiter's gravity swings the probe round and drags it along,
// so it leaves faster than it came and climbs on past Saturn's orbit. Pass in front and it is slowed; aim too close and it
// plunges into Jupiter's clouds with a puff. Real gravity (GM/r²) from a moving Jupiter, plus a steady pull down.
// Two probes at levels 0 and 1, three at level 2, where the Sun's pull is stronger so only close passes make it.
(() => {
  const SX = 180, SY = 574, JY = 330, JR = 24, TOP = 150, V0 = 135, U = 70, GM = 900000, H = 1 / 120, GS = [28, 28, 29.5];
  function stepProbe(b, jx, g, h) { const dx = jx - b.x, dy = JY - b.y, r2 = dx * dx + dy * dy, r = Math.sqrt(r2), a = GM / Math.max(r2, 400); b.vx += a * dx / r * h; b.vy += a * dy / r * h + g * h; b.x += b.vx * h; b.y += b.vy * h; return r; }
  const wrapJ = x => x > 400 ? x - 460 : x;
  function fly(s, ang, jx0) { // where a probe launched now at this angle ends up: 'win', 'crash' or 'lost'
    const b = { x: SX, y: SY, vx: V0 * Math.sin(ang), vy: -V0 * Math.cos(ang) }; let jx = jx0;
    for (let i = 0; i < 120 * 12; i++) { jx += U * H; const r = stepProbe(b, jx, s.g, H); if (r < JR) return 'crash'; if (b.y < TOP) return 'win'; if (b.y > SY + 20 || b.x < -30 || b.x > 390 || b.vy > 45) return 'lost'; }
    return 'lost';
  }
  function bestAim(s, lead) { // the middle of the widest run of winning angles, for a launch 'lead' seconds from now
    const jx = s.jx + U * lead; let best = null, run = [];
    for (let d = -64; d <= 64; d += 2) { if (fly(s, d * Math.PI / 180, jx) === 'win') run.push(d); else { if (run.length && (!best || run.length > best.length)) best = run; run = []; } }
    if (run.length && (!best || run.length > best.length)) best = run; return best && best.length >= 2 ? (best[0] + best[best.length - 1]) / 2 * Math.PI / 180 : null;
  }
  function paintSky(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#05061a'); bg.addColorStop(0.55, '#141842'); bg.addColorStop(1, '#3a2440'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    P.stars(o, 360, 640, 150, 23, 0);
    const sg = o.createRadialGradient(180, 760, 60, 180, 760, 330); sg.addColorStop(0, 'rgba(255,220,120,0.9)'); sg.addColorStop(0.35, 'rgba(255,160,70,0.35)'); sg.addColorStop(1, 'rgba(255,120,60,0)'); o.fillStyle = sg; o.fillRect(0, 430, 360, 210);
    // Jupiter's path and Saturn's orbit
    o.save(); o.strokeStyle = 'rgba(255,210,170,0.22)'; o.lineWidth = 2; o.setLineDash([6, 10]); o.beginPath(); o.moveTo(0, JY); o.lineTo(360, JY); o.stroke();
    o.strokeStyle = 'rgba(220,230,255,0.5)'; o.lineWidth = 3; o.beginPath(); o.moveTo(0, TOP); o.lineTo(360, TOP); o.stroke(); o.restore();
    // the Earth at the bottom left
    const eg = o.createRadialGradient(146, 598, 2, 150, 602, 18); eg.addColorStop(0, '#7ad0ff'); eg.addColorStop(1, '#1e5aa8'); o.fillStyle = eg; o.beginPath(); o.arc(150, 602, 17, 0, 7); o.fill(); o.fillStyle = '#5aa84a'; o.beginPath(); o.ellipse(146, 598, 7, 5, 0.4, 0, 7); o.fill();
  }
  function jupiter(c, x, t) {
    c.save(); c.beginPath(); c.arc(x, JY, JR, 0, 7); c.clip(); const bands = ['#e8c8a0', '#c89a6a', '#f0dcc0', '#b8805a', '#e8c8a0', '#d0a070', '#f0dcc0'];
    bands.forEach((col, i) => { c.fillStyle = col; c.fillRect(x - JR, JY - JR + i * (JR * 2 / bands.length), JR * 2, JR * 2 / bands.length + 1); });
    c.fillStyle = '#c85a3a'; c.beginPath(); c.ellipse(x + 6 + Math.sin(t * 0.5) * 2, JY + 7, 6, 4, 0, 0, 7); c.fill();
    const sh = c.createRadialGradient(x - 8, JY - 8, 4, x, JY, JR); sh.addColorStop(0, 'rgba(255,255,255,0.2)'); sh.addColorStop(1, 'rgba(40,20,30,0.45)'); c.fillStyle = sh; c.fillRect(x - JR, JY - JR, JR * 2, JR * 2); c.restore();
  }
  function saturn(c, x, y, t) {
    c.save(); c.translate(x, y); c.rotate(-0.25); c.strokeStyle = 'rgba(230,210,160,0.85)'; c.lineWidth = 4; c.beginPath(); c.ellipse(0, 0, 32, 8, 0, Math.PI, 0); c.stroke();
    const sg = c.createRadialGradient(-5, -5, 2, 0, 0, 17); sg.addColorStop(0, '#fff0c8'); sg.addColorStop(1, '#c8a060'); c.fillStyle = sg; c.beginPath(); c.arc(0, 0, 17, 0, 7); c.fill();
    c.beginPath(); c.ellipse(0, 0, 32, 8, 0, 0, Math.PI); c.stroke(); c.restore();
  }
  function probe(c, x, y, a, t, fire) {
    c.save(); c.translate(x, y); c.rotate(a);
    if (fire) { c.fillStyle = '#ffb040'; c.beginPath(); c.moveTo(-10, -4); c.lineTo(-22 - Math.sin(t * 40) * 4, 0); c.lineTo(-10, 4); c.fill(); }
    c.fillStyle = '#d8d8e8'; c.strokeStyle = '#4a4a6a'; c.lineWidth = 1.5; c.beginPath(); c.roundRect(-10, -6, 20, 12, 3); c.fill(); c.stroke();
    c.fillStyle = '#e8c040'; c.beginPath(); c.arc(10, 0, 7, -Math.PI / 2, Math.PI / 2); c.fill(); c.stroke();
    c.fillStyle = '#3a5aa8'; c.fillRect(-6, -18, 8, 12); c.fillRect(-6, 6, 8, 12); c.strokeRect(-6, -18, 8, 12); c.strokeRect(-6, 6, 8, 12);
    c.restore();
  }
  function newProbe(s, g) { s.b = { x: SX, y: SY, vx: 0, vy: 0 }; s.phase = 'aim'; s.trail = []; s.endT = 0; s.res = ''; s.born = g.t; s.v0 = 0; }
  MG.add({
    id: 'space_slingshot', stage: 'space', cmd: 'SWING PAST JUPITER TO SATURN!', time: 8, mood: 'night', winText: 'Jupiter flung it on!', failText: 'Pulled back!',
    card: { title: 'Borrow speed from a planet', kind: 'Astronomy', ref: 'Gravity assist',
      text: "A space probe can't carry enough fuel to fly to the far planets quickly. The Sun's gravity keeps pulling it back.\n\nSo it borrows speed. Jupiter is moving fast around the Sun. A probe that passes just behind it gets pulled along by Jupiter's gravity, swings round and leaves faster than it came. Jupiter slows down by a tiny amount that nobody could ever notice.\n\nPassing in front of the planet does the opposite and slows the probe down. Real missions such as Voyager used this trick to reach Saturn and beyond.",
      note: "A probe passing just behind a moving planet is dragged along by the planet's gravity and leaves faster." },
    init(g) {
      const s = g.s, L = Math.min(2, g.level), v = SK.variant(g, 4); s.g = GS[L]; s.need = L === 2 ? 3 : 2; s.got = 0; s.jx = [-60, 0, -100, 40][v]; s.aim = null; s.aimAt = -9; s.drag = null; newProbe(s, g); s.aim = bestAim(s, 0.6); s.aimAt = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.phase !== 'aim') return; if (SK.dist(x, y, SX, SY) < 90) s.drag = { x, y }; },
    move(g, x, y) { const s = g.s; if (s.drag) { s.drag.x = x; s.drag.y = y; } },
    up(g, x, y) {
      const s = g.s, d = s.drag; s.drag = null; if (!d || g.done || s.phase !== 'aim') return; const dx = d.x - SX, dy = d.y - SY; if (Math.hypot(dx, dy) < 30 || dy > 10) return;
      const ang = SK.clamp(Math.atan2(dx, -dy), -1.2, 1.2); s.b.vx = V0 * Math.sin(ang); s.b.vy = -V0 * Math.cos(ang); s.phase = 'fly'; s.flyT = g.t; s.vmin = V0; s.boosted = false; g.sfx('whoosh');
    },
    update(g, dt) {
      const s = g.s, n = Math.max(1, Math.round(dt / H)), h = dt / n;
      for (let i = 0; i < n; i++) {
        s.jx = wrapJ(s.jx + U * h);
        if (s.phase !== 'fly') continue; const b = s.b, r = stepProbe(b, s.jx, s.g, h), sp = Math.hypot(b.vx, b.vy);
        if (r < JR) { s.phase = 'end'; s.res = 'crash'; s.endT = g.t; g.sfx('thud'); g.sfx('laugh'); g.burst(b.x, b.y, ['#e8c8a0', '#c89a6a', '#ffffff'], 16, 140); break; }
        if (r < 90 && sp > s.vmin + 40 && !s.boosted) { s.boosted = true; g.float('Faster!', b.x, b.y - 30); g.sfx('swoosh'); }
        s.vmin = Math.min(s.vmin, sp);
        if (b.y < TOP) { s.phase = 'end'; s.res = 'win'; s.endT = g.t; s.got++; g.sfx('chime'); g.burst(b.x, TOP, ['#fff6c0', '#8ad0ff'], 14, 120); if (s.got >= s.need && !g.done) { g.win(); g.sfx('cheer'); } break; }
        if (b.y > SY + 20 || b.x < -30 || b.x > 390 || b.vy > 45) { s.phase = 'end'; s.res = 'lost'; s.endT = g.t; g.sfx('wrong'); break; }
      }
      if (s.phase === 'fly') { s.trail.push([s.b.x, s.b.y, Math.hypot(s.b.vx, s.b.vy)]); if (s.trail.length > 160) s.trail.shift(); }
      if (s.phase === 'end' && g.t - s.endT > (s.res === 'win' ? 0.5 : 0.8) && !g.done) { newProbe(s, g); g.sfx('pop'); }
      if (s.phase === 'aim' && g.t - s.aimAt > 0.2) { s.aimAt = g.t; s.aim = bestAim(s, 0.9); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', b = s.b;
      c.drawImage(g.bake('sling_bg', paintSky), 0, 0, 360, 640);
      saturn(c, 292, TOP - 4, t); SK.tag(c, "Saturn's orbit", 110, TOP + 22, 18);
      // the trail: orange when slow, blue-white when fast
      for (let i = 1; i < s.trail.length; i++) { const [x0, y0] = s.trail[i - 1], [x1, y1, sp] = s.trail[i]; c.strokeStyle = P.mix('#ff9a40', '#a8e8ff', SK.clamp((sp - 40) / 200, 0, 1)); c.globalAlpha = 0.3 + 0.7 * i / s.trail.length; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); } c.globalAlpha = 1;
      jupiter(c, s.jx, t); SK.tag(c, 'Jupiter', SK.clamp(s.jx, 50, 310), JY + 44, 18);
      // which way Jupiter is moving
      c.save(); c.fillStyle = 'rgba(255,220,180,0.75)'; const ax = s.jx + JR + 12; c.beginPath(); c.moveTo(ax + 14, JY); c.lineTo(ax, JY - 7); c.lineTo(ax, JY + 7); c.closePath(); c.fill(); c.restore();
      if (s.phase === 'end' && s.res === 'crash') { const k = SK.clamp((t - s.endT) * 2, 0, 1); c.fillStyle = `rgba(240,220,200,${0.7 * (1 - k)})`; c.beginPath(); c.arc(b.x, b.y, 8 + k * 20, 0, 7); c.fill(); }
      else if (!(s.phase === 'end' && s.res === 'win' && b.y < 0)) probe(c, b.x, b.y, s.phase === 'aim' ? -Math.PI / 2 : Math.atan2(b.vy, b.vx), t, s.phase === 'fly' && t - s.flyT < 0.3);
      if (s.phase === 'aim') SK.tag(c, 'Probe', SX + 56, SY + 4, 18);
      // aiming: a dotted line from the probe toward the finger
      if (s.drag) { const dx = s.drag.x - SX, dy = s.drag.y - SY, L = Math.hypot(dx, dy) || 1; c.save(); c.strokeStyle = 'rgba(255,246,234,0.8)'; c.lineWidth = 3; c.setLineDash([5, 7]); c.beginPath(); c.moveTo(SX, SY); c.lineTo(SX + dx / L * 150, SY + dy / L * 150); c.stroke(); c.restore(); }
      if (!won) SK.tag(c, 'Probe ' + Math.min(s.got + 1, s.need) + ' / ' + s.need, 290, 196, 18);
      SK.animal(c, 'owl', 318, 612, 0.65, { t, pose: won ? 'cheer' : s.res === 'crash' || g.result === 'fail' ? 'sad' : 'idle', expr: won ? 'laugh' : s.res && s.res !== 'win' ? 'wow' : 'think', facing: -1 });
      // guidance: aim just behind Jupiter (where a launch about now would swing round it)
      if (s.phase === 'aim' && !g.done) { const a = s.aim; if (a != null) { const tx = SX + Math.sin(a) * 120, ty = SY - Math.cos(a) * 120; SK.grab(c, g, SX, SY, 22); SK.arrow(c, g, SX, SY, SX + Math.sin(a) * 170, SY - Math.cos(a) * 170, { from: 28, to: 0 }); }
        SK.demo(g, c, 'drag', [SX, SY], a != null ? [SX + Math.sin(a) * 120, SY - Math.cos(a) * 120] : [SX, SY - 100], { never: a == null }); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.phase !== 'aim' || g.t - s.born < 0.4 || g.t < 1.0) return; const B = s._bot = s._bot || {}, key = 'p' + s.got + '_' + Math.round(s.born * 10);
      if (!B[key + 'a']) { const a = bestAim(s, 0.25); if (a == null) return; B[key + 'a'] = a; }
      const a = B[key + 'a']; SK.bot.drag(g, synth, key, B[key + 't'] ?? (B[key + 't'] = g.t), [SX, SY], [SX + Math.sin(a) * 120, SY - Math.cos(a) * 120], 0.25);
    },
  });
})();
