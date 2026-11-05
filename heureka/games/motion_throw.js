// THROW! (physics PMS-07) — a tiny planet in space with a frog on a mountain top holding a ball. Drag from the ball to
// throw it: the arrow's direction is the direction, its length the speed. The planet's gravity pulls the ball toward its
// centre all the way round. A slow throw lands nearby; a faster one lands farther round; at the right speed the ball falls
// all the way round the planet and bonks the frog on the back of its head: that is an orbit. Too fast and it flies off into
// space. Thrown straight up, it falls straight back down on the frog. After each orbit the frog hops to another peak (a
// different height, so a different speed): two orbits at levels 0 and 1, three at level 2.
(() => {
  const C = { x: 180, y: 360 }, R = 92, GM = 8.2e7, BR = 8, KV = 3.7, LOST = 178;
  const PEAKS = [{ a: -Math.PI / 2, h: 30 }, { a: Math.PI, h: 26 }, { a: 0.35, h: 20 }];
  const surf = th => { let r = R; for (const p of PEAKS) { let d = Math.atan2(Math.sin(th - p.a), Math.cos(th - p.a)); r += p.h * Math.exp(-d * d / 0.05); } return r; };
  const ORDER = [[0, 1], [0, 1], [0, 1, 2]];
  function handOf(s) { const p = PEAKS[s.order[Math.min(s.k, s.order.length - 1)]], r0 = R + p.h + 30; return { x: C.x + Math.cos(p.a) * r0, y: C.y + Math.sin(p.a) * r0, r0, a: p.a }; }
  function paintSpace(o) {
    const bg = o.createRadialGradient(180, 340, 40, 180, 340, 460); bg.addColorStop(0, '#2a2a6a'); bg.addColorStop(0.6, '#141838'); bg.addColorStop(1, '#0a0c22'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    const rnd = P.rng(77);
    for (const [x, y, r, col] of [[60, 140, 120, 'rgba(200,90,180,0.10)'], [300, 560, 150, 'rgba(90,160,220,0.10)']]) { const ng = o.createRadialGradient(x, y, 4, x, y, r); ng.addColorStop(0, col); ng.addColorStop(1, 'rgba(0,0,0,0)'); o.fillStyle = ng; o.fillRect(0, 0, 360, 640); }
    for (let i = 0; i < 160; i++) { o.fillStyle = `rgba(255,250,230,${0.25 + rnd() * 0.75})`; o.beginPath(); o.arc(rnd() * 360, rnd() * 640, 0.4 + rnd() * 1.3, 0, 7); o.fill(); }
    // a far ringed planet and a moon
    o.fillStyle = '#c87a5a'; o.beginPath(); o.arc(310, 150, 18, 0, 7); o.fill(); o.strokeStyle = 'rgba(255,220,180,0.6)'; o.lineWidth = 2; o.beginPath(); o.ellipse(310, 150, 30, 7, -0.3, 0, 7); o.stroke();
    o.fillStyle = '#d8d0e8'; o.beginPath(); o.arc(48, 580, 12, 0, 7); o.fill(); o.fillStyle = 'rgba(120,110,150,0.5)'; o.beginPath(); o.arc(44, 577, 3, 0, 7); o.arc(52, 584, 2, 0, 7); o.fill();
    // the little planet: sea, land and mountains
    const glow = o.createRadialGradient(C.x, C.y, R, C.x, C.y, R + 30); glow.addColorStop(0, 'rgba(140,200,255,0.35)'); glow.addColorStop(1, 'rgba(140,200,255,0)'); o.fillStyle = glow; o.beginPath(); o.arc(C.x, C.y, R + 30, 0, 7); o.fill();
    o.beginPath(); for (let i = 0; i <= 360; i++) { const th = i / 360 * Math.PI * 2, r = surf(th); i ? o.lineTo(C.x + Math.cos(th) * r, C.y + Math.sin(th) * r) : o.moveTo(C.x + Math.cos(th) * r, C.y + Math.sin(th) * r); } o.closePath();
    const lg = o.createRadialGradient(C.x - 30, C.y - 40, 10, C.x, C.y, R + 50); lg.addColorStop(0, '#9ad870'); lg.addColorStop(0.7, '#5a9a48'); lg.addColorStop(1, '#3a6a38'); o.fillStyle = lg; o.fill();
    o.save(); o.clip(); o.fillStyle = '#4a9ad0'; for (const [a, w] of [[0.9, 0.6], [2.4, 0.5], [-1.0, 0.25]]) { o.beginPath(); o.ellipse(C.x + Math.cos(a) * 50, C.y + Math.sin(a) * 50, 36 * w + 14, 22 * w + 8, a, 0, 7); o.fill(); }
    for (const p of PEAKS) { const x = C.x + Math.cos(p.a) * (R + p.h - 6), y = C.y + Math.sin(p.a) * (R + p.h - 6); o.fillStyle = '#ffffff'; o.beginPath(); o.arc(x, y, 7, 0, 7); o.fill(); }
    o.restore();
    o.strokeStyle = 'rgba(30,50,30,0.5)'; o.lineWidth = 2; o.stroke();
    for (let i = 0; i < 9; i++) { const th = 0.4 + i * 0.7, r = surf(th); const x = C.x + Math.cos(th) * r, y = C.y + Math.sin(th) * r; o.save(); o.translate(x, y); o.rotate(th + Math.PI / 2); o.fillStyle = '#2f6a3a'; o.beginPath(); o.moveTo(-5, 1); o.lineTo(0, -13); o.lineTo(5, 1); o.fill(); o.restore(); }
  }
  MG.add({
    id: 'throw', stage: 'motion', cmd: 'THROW IT INTO ORBIT!', time: 7.5, mood: 'night', winText: 'Orbit!', failText: 'Crash!',
    card: { title: 'An orbit is falling all the way round', kind: 'Physics', ref: 'Orbits and gravity',
      text: 'The planet\'s gravity pulls the ball toward its centre the whole time it flies.\n\nThrow it slowly and it falls to the ground nearby. Throw it faster and it lands farther round, because the ground curves away beneath it as it falls. At just the right speed, the ground curves away as fast as the ball falls, so it never lands. It falls all the way round and comes back. That path is an orbit.\n\nThrow it much faster and gravity cannot bend its path enough, so it flies off into space. The Moon and every satellite stay up this way.',
      note: 'A thing in orbit is falling the whole time, but it moves sideways fast enough to keep missing the ground.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.order = ORDER[L]; s.k = 0; s.ball = null; s.trail = []; s.marks = []; s.drag = null; s.bonkT = -9; s.next = 0; s.hopT = -9; s.lostT = -9; s.fx = null; s.orbits = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.ball || g.t < s.next) return; const h = handOf(s); if (SK.dist(x, y, h.x, h.y) < 70) s.drag = { x, y, x0: x, y0: y }; },
    move(g, x, y) { const s = g.s; if (s.drag) { s.drag.x = x; s.drag.y = y; } },
    up(g) {
      const s = g.s, d = s.drag; s.drag = null; if (!d || g.done || s.ball) return;
      const dx = d.x - d.x0, dy = d.y - d.y0, L = Math.hypot(dx, dy); if (L < 14) return;
      const h = handOf(s), k = Math.min(L, 280) / L;
      s.tries = (s.tries || 0) + 1; s.ball = { x: h.x, y: h.y, vx: dx * k * KV, vy: dy * k * KV, th: Math.atan2(h.y - C.y, h.x - C.x), went: 0, t: 0 }; s.trail = []; g.sfx('whoosh');
    },
    update(g, dt) {
      const s = g.s, b = s.ball; if (!b) return;
      const n = 10, hh = dt / n; let end = null;
      for (let i = 0; i < n && !end; i++) { // gravity toward the planet's centre, falling off with distance squared
        const acc = (x, y) => { const rx = x - C.x, ry = y - C.y, r2 = rx * rx + ry * ry, r = Math.sqrt(r2), a = GM / r2; return [-a * rx / r, -a * ry / r]; };
        const [ax, ay] = acc(b.x, b.y); b.vx += ax * hh / 2; b.vy += ay * hh / 2; b.x += b.vx * hh; b.y += b.vy * hh; const [ax2, ay2] = acc(b.x, b.y); b.vx += ax2 * hh / 2; b.vy += ay2 * hh / 2;
        const th = Math.atan2(b.y - C.y, b.x - C.x); b.went += Math.atan2(Math.sin(th - b.th), Math.cos(th - b.th)); b.th = th; b.t += hh;
        const r = Math.hypot(b.x - C.x, b.y - C.y), h = handOf(s);
        if (b.t > 0.12 && SK.dist(b.x, b.y, h.x, h.y) < 24) end = Math.abs(b.went) > 5.2 ? 'orbit' : 'head';
        else if (r < surf(th) + BR) end = 'land';
        else if (b.x < -30 || b.x > 390 || b.y < 50 || b.y > 650 || b.t > 3) end = 'lost';
      }
      s.trail.push([b.x, b.y]); if (s.trail.length > 90) s.trail.shift();
      if (!end) return;
      s.ball = null; s.next = g.t + 0.7;
      s.bonkAt = [b.x, b.y];
      if (end === 'orbit') { s.orbits++; s.bonkT = g.t; g.sfx('thud'); g.sfx('cheer'); g.burst(b.x, b.y, ['#ffd45a', '#ffffff', '#8ad8ff'], 22, 200); s.k++; if (s.k >= s.order.length) g.win(); else { s.hopT = g.t + 0.2; s.next = g.t + 0.7; } }
      else if (end === 'head') { s.bonkT = g.t; s.dazed = g.t; g.sfx('boing'); g.sfx('laugh'); }
      else if (end === 'land') { s.marks.push([b.x, b.y, g.t]); if (s.marks.length > 4) s.marks.shift(); g.sfx('thud', { vol: 0.6 }); g.burst(b.x, b.y, ['#c8a870', '#9ad870'], 8, 90); }
      else { s.lostT = g.t; s.lostAt = [SK.clamp(b.x, 12, 348), SK.clamp(b.y, 120, 600)]; g.sfx('sparkle'); }
      s.fadeTrail = g.t;
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', h = handOf(s);
      c.drawImage(g.bake('throw_space', paintSpace), 0, 0, 360, 640);
      // where earlier throws landed
      for (const [x, y, t0] of s.marks) { c.fillStyle = `rgba(255,220,150,${Math.max(0.25, 1 - (t - t0))})`; c.beginPath(); c.arc(x, y, 4, 0, 7); c.fill(); }
      // level 0: the circle an orbit from this peak would follow
      if (g.level === 0 && !g.done) { c.save(); c.strokeStyle = 'rgba(255,255,255,0.22)'; c.lineWidth = 2; c.setLineDash([3, 9]); c.beginPath(); c.arc(C.x, C.y, h.r0, 0, 7); c.stroke(); c.restore(); }
      // the ball's path
      const fade = s.ball ? 1 : Math.max(0, 1 - (t - (s.fadeTrail || 0)) * 1.5);
      if (fade > 0) for (let i = 1; i < s.trail.length; i++) { const [x0, y0] = s.trail[i - 1], [x1, y1] = s.trail[i]; c.strokeStyle = `rgba(255,230,140,${(0.1 + 0.7 * i / s.trail.length) * fade})`; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
      // the frog on its peak, feet toward the planet's centre (it hops to the next peak after an orbit)
      let fa = h.a, fr = R + PEAKS[s.order[Math.min(s.k, s.order.length - 1)]].h - 2;
      if (t < s.hopT + 0.5 && s.k > 0 && s.k < s.order.length && t > s.hopT) { const q = SK.easeInOut((t - s.hopT) / 0.5), pa = PEAKS[s.order[s.k - 1]], pb = PEAKS[s.order[s.k]]; const da = Math.atan2(Math.sin(pb.a - pa.a), Math.cos(pb.a - pa.a)); fa = pa.a + da * q; fr = R + SK.lerp(pa.h, pb.h, q) - 2 + Math.sin(q * Math.PI) * 60; }
      else if (t <= s.hopT && s.k > 0 && s.k < s.order.length) { const pa = PEAKS[s.order[s.k - 1]]; fa = pa.a; fr = R + pa.h - 2; }
      c.save(); c.translate(C.x + Math.cos(fa) * fr, C.y + Math.sin(fa) * fr); c.rotate(fa + Math.PI / 2);
      const dz = t - (s.dazed || -9) < 1.2, bonk = t - s.bonkT < 0.8;
      SK.animal(c, 'frog', 0, 0, 0.75, { t, pose: won ? 'cheer' : s.ball || s.drag ? 'point' : 'idle', expr: won ? 'laugh' : dz || bonk ? 'wow' : lost ? 'sad' : 'happy', noShadow: true });
      if (dz) { c.fillStyle = '#ffd45a'; for (let i = 0; i < 3; i++) { const q = t * 5 + i * 2.1; c.beginPath(); c.arc(Math.cos(q) * 16, -52 + Math.sin(q) * 5, 3, 0, 7); c.fill(); } }
      c.restore();
      if (bonk && !dz && s.bonkAt) SK.tag(c, 'Bonk!', SK.clamp(s.bonkAt[0], 50, 310), s.bonkAt[1] - 34, 18);
      // the ball, in the frog's hand or flying
      const b = s.ball;
      if (b) SK.ball(c, b.x, b.y, BR, '#ff8a5a');
      else if (!g.done && g.t >= s.next - 0.2) { SK.ball(c, h.x, h.y, BR, '#ff8a5a'); }
      if (t - s.lostT < 0.8) { const [x, y] = s.lostAt; c.save(); c.globalAlpha = 1 - (t - s.lostT) / 0.8; c.translate(x, y); c.rotate(t * 3); c.fillStyle = '#ffffff'; c.beginPath(); for (let i = 0; i < 8; i++) { const q = i * Math.PI / 4, r = i % 2 ? 4 : 14; c.lineTo(Math.cos(q) * r, Math.sin(q) * r); } c.closePath(); c.fill(); c.restore(); }
      // the throw arrow while dragging: direction and speed
      const d = s.drag; if (d) { const dx = d.x - d.x0, dy = d.y - d.y0, L = Math.min(280, Math.hypot(dx, dy)), a = Math.atan2(dy, dx); if (L > 6) { c.save(); c.translate(h.x, h.y); c.rotate(a); c.fillStyle = '#ffd45a'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -4); c.lineTo(L - 12, -4); c.lineTo(L - 12, -10); c.lineTo(L, 0); c.lineTo(L - 12, 10); c.lineTo(L - 12, 4); c.lineTo(0, 4); c.closePath(); c.fill(); c.stroke(); c.restore(); } }
      // orbits still to make
      for (let i = 0; i < s.order.length; i++) { const x = 180 + (i - (s.order.length - 1) / 2) * 30; c.fillStyle = i < s.k ? '#ffd45a' : 'rgba(255,255,255,0.3)'; c.strokeStyle = '#ffffff'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, 590, 8, 0, 7); c.fill(); c.stroke(); }
      if (!s.ball && !g.done && g.t >= s.next - 0.2) { const tg = { x: -Math.sin(h.a), y: Math.cos(h.a) }, Lb = 1.0 * Math.sqrt(GM / h.r0) / KV; SK.grab(c, g, h.x, h.y, 20); SK.target(c, g, h.x + tg.x * Lb, h.y + tg.y * Lb, 18); SK.arrow(c, g, h.x, h.y, h.x + tg.x * Lb, h.y + tg.y * Lb); SK.demo(g, c, 'drag', [h.x, h.y], [h.x + tg.x * Lb, h.y + tg.y * Lb]); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.ball || g.t < Math.max(1.0, s.next)) return; const h = handOf(s), tg = { x: -Math.sin(h.a), y: Math.cos(h.a) }, Lb = 1.0 * Math.sqrt(GM / h.r0) / KV;
      if (!s._bb || s._bb.n !== (s.tries || 0)) s._bb = { n: s.tries || 0, t: g.t };
      SK.bot.drag(g, synth, 'throw' + (s.tries || 0), s._bb.t, [h.x, h.y], [h.x + tg.x * Lb, h.y + tg.y * Lb], 0.3);
    },
  });
})();
