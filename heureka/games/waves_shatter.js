// SHATTER! (physics PMS-21) — an opera owl sings at a wine glass. Slide the golden note up or down to change the owl's
// pitch (the crests of the sound wave squeeze closer for a higher note). Every glass has its own note: at that pitch each push from the
// sound arrives in step with the glass's own wobble, so the wobble grows and grows until the glass shatters. A note that is
// close but not right makes the glass tremble a little and calm down again (the pushes drift out of step).
// The glass is a real driven, damped oscillator: x'' = -w0² x - γ x' + F cos(phase).
// Two glasses at level 0, three at levels 1 and 2, each its own size and so its own note (bigger is lower): tune to each in
// turn. Level 2: a sharper resonance, so the note must be closer.
(() => {
  const TR = { x: 44, y0: 560, y1: 180 }, F_LO = 2.2, F_HI = 5.2, BEAK = { x: 126, y: 446 }, GL = { x: 244, y: 450 };
  const fOf = y => F_LO + (TR.y0 - SK.clamp(y, TR.y1, TR.y0)) / (TR.y0 - TR.y1) * (F_HI - F_LO);
  const yOf = f => TR.y0 - (f - F_LO) / (F_HI - F_LO) * (TR.y0 - TR.y1);
  function paintStage(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#2a1030'); bg.addColorStop(0.55, '#4a1a40'); bg.addColorStop(1, '#2a1424'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    // the spotlight
    const sp = o.createRadialGradient(220, 470, 20, 220, 470, 260); sp.addColorStop(0, 'rgba(255,230,170,0.55)'); sp.addColorStop(1, 'rgba(255,230,170,0)'); o.fillStyle = sp; o.fillRect(0, 160, 360, 480);
    // the wooden stage floor
    const fl = o.createLinearGradient(0, 530, 0, 640); fl.addColorStop(0, '#a8643a'); fl.addColorStop(1, '#5a2e1a'); o.fillStyle = fl; o.fillRect(0, 530, 360, 110);
    o.strokeStyle = 'rgba(40,16,10,0.35)'; o.lineWidth = 1.5; for (let i = 0; i < 9; i++) { o.beginPath(); o.moveTo(180 + (i - 4) * 30, 530); o.lineTo(180 + (i - 4) * 90, 640); o.stroke(); }
    o.fillStyle = 'rgba(255,220,160,0.25)'; o.beginPath(); o.ellipse(220, 560, 150, 26, 0, 0, 7); o.fill();
    // velvet curtains with gold trim
    for (const side of [-1, 1]) {
      const x0 = side < 0 ? 0 : 360; o.save();
      for (let i = 0; i < 2; i++) { const xx = x0 - side * (8 + i * 14); const cg = o.createLinearGradient(xx - 10, 0, xx + 10, 0); cg.addColorStop(0, '#7a1028'); cg.addColorStop(0.5, '#c8304a'); cg.addColorStop(1, '#6a0c22'); o.fillStyle = cg; o.beginPath(); o.moveTo(xx - 10, 0); o.quadraticCurveTo(xx + side * 6, 300, xx - 10 - side * 10, 640); o.lineTo(xx + 12 - side * 10, 640); o.quadraticCurveTo(xx + 12 + side * 6, 300, xx + 10, 0); o.fill(); }
      o.restore();
    }
    const val = o.createLinearGradient(0, 0, 0, 70); val.addColorStop(0, '#8a1430'); val.addColorStop(1, '#c8304a'); o.fillStyle = val; o.beginPath(); o.moveTo(0, 0); o.lineTo(360, 0); o.lineTo(360, 46);
    for (let i = 6; i >= 0; i--) o.quadraticCurveTo(i * 60 + 30, 76, i * 60, 46); o.fill();
    o.strokeStyle = '#f0c060'; o.lineWidth = 3; o.beginPath(); o.moveTo(360, 46); for (let i = 6; i >= 0; i--) o.quadraticCurveTo(i * 60 + 30, 76, i * 60, 46); o.stroke();
    // the little table with a white cloth
    o.fillStyle = '#5a2e1a'; for (const lx of [GL.x - 60, GL.x + 60]) { o.fillRect(lx - 5, GL.y + 10, 10, 104); o.fillRect(lx - 20, GL.y + 110, 40, 8); }
    o.fillStyle = '#fff6ea'; o.beginPath(); o.moveTo(GL.x - 86, GL.y + 2); o.lineTo(GL.x + 86, GL.y + 2); o.lineTo(GL.x + 92, GL.y + 44); o.quadraticCurveTo(GL.x, GL.y + 56, GL.x - 92, GL.y + 44); o.closePath(); o.fill();
    o.fillStyle = '#e8d8c8'; o.beginPath(); o.ellipse(GL.x, GL.y + 2, 86, 10, 0, 0, 7); o.fill();
    // the pitch pole: wide waves at the bottom (low), tight waves at the top (high)
    o.fillStyle = 'rgba(20,6,20,0.45)'; o.beginPath(); o.roundRect(TR.x - 20, TR.y1 - 30, 40, TR.y0 - TR.y1 + 60, 20); o.fill();
    const pg = o.createLinearGradient(0, TR.y0, 0, TR.y1); pg.addColorStop(0, '#7a4a1a'); pg.addColorStop(1, '#f8d870'); o.fillStyle = pg; o.beginPath(); o.roundRect(TR.x - 5, TR.y1 - 10, 10, TR.y0 - TR.y1 + 20, 5); o.fill();
    o.strokeStyle = 'rgba(255,240,200,0.8)'; o.lineWidth = 2;
    for (const [yy, f] of [[TR.y1 - 46, 3.2], [TR.y0 + 46, 1]]) { o.beginPath(); for (let x = -16; x <= 16; x++) { const y = yy + Math.sin(x / 16 * Math.PI * f) * 5; x === -16 ? o.moveTo(TR.x + x, y) : o.lineTo(TR.x + x, y); } o.stroke(); }
  }
  function glass(c, q, t) {
    const k = SK.clamp(q.amp, 0, 1), sz = q.sz, sq = q.xn * 0.16; // the rim squashes and stretches as it wobbles
    const bw = 15 * sz, bh = 30 * sz, stem = 24 * sz, top = GL.y - 4 - stem - bh, cx = q.cx;
    c.save();
    if (k > 0.22 && !q.broken) { c.strokeStyle = `rgba(255,240,200,${0.8 * k})`; c.lineWidth = 2.5; c.lineCap = 'round'; for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { const r = bw + 8 + i * 7 + k * 5; c.beginPath(); c.arc(cx, top + bh * 0.45, r, sd < 0 ? Math.PI - 0.5 : -0.5, sd < 0 ? Math.PI + 0.5 : 0.5); c.stroke(); } }
    SK.shadow(c, cx, GL.y + 2, bw * 0.8, 4, 0.25);
    if (q.broken) { c.fillStyle = 'rgba(225,245,255,0.6)'; c.beginPath(); c.ellipse(cx, GL.y - 3, bw * 0.7, 3, 0, 0, 7); c.fill(); c.restore(); return; }
    const bw1 = bw * (1 + sq), bw2 = bw * (1 - sq * 0.6);
    const gl = c.createLinearGradient(cx - bw, 0, cx + bw, 0); gl.addColorStop(0, 'rgba(220,240,255,0.55)'); gl.addColorStop(0.4, 'rgba(255,255,255,0.18)'); gl.addColorStop(1, 'rgba(180,210,240,0.5)');
    c.fillStyle = gl; c.strokeStyle = 'rgba(240,250,255,0.95)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(cx - bw1, top); c.bezierCurveTo(cx - bw2, top + bh * 0.9, cx - 6, top + bh, cx - 2, top + bh + 3); c.lineTo(cx + 2, top + bh + 3); c.bezierCurveTo(cx + 6, top + bh, cx + bw2, top + bh * 0.9, cx + bw1, top); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(cx, top, bw1, 4 * (1 - sq * 2), 0, 0, 7); c.stroke();
    if (k > 0.05) { c.save(); c.globalCompositeOperation = 'lighter'; const gg = c.createRadialGradient(cx, top + bh * 0.5, 4, cx, top + bh * 0.5, 44); gg.addColorStop(0, `rgba(255,220,150,${0.45 * k})`); gg.addColorStop(1, 'rgba(255,220,150,0)'); c.fillStyle = gg; c.beginPath(); c.arc(cx, top + bh * 0.5, 44, 0, 7); c.fill(); c.restore(); }
    c.fillStyle = 'rgba(230,245,255,0.75)'; c.fillRect(cx - 2.5, top + bh + 2, 5, stem - 2);
    c.beginPath(); c.ellipse(cx, GL.y - 3, bw * 0.7, 3.5, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(cx - bw * 0.5, top + bh * 0.35, 2.5, bh * 0.25, 0.15, 0, 7); c.fill();
    if (k > 0.5) { c.strokeStyle = `rgba(255,255,255,${(k - 0.5) * 6})`; c.lineWidth = 1.2; c.beginPath(); c.moveTo(cx - 4, top + 2); c.lineTo(cx - 9, top + bh * 0.35); c.lineTo(cx - 3, top + bh * 0.55); c.moveTo(cx + 7, top + 1); c.lineTo(cx + 10, top + bh * 0.3); c.lineTo(cx + 5, top + bh * 0.5); c.stroke(); }
    c.restore();
  }
  const BREAK = 0.66, next = s => s.gl.find(q => !q.broken);
  MG.add({
    id: 'shatter', stage: 'waves', cmd: 'TUNE THE NOTE TO BREAK GLASS!', time: 7.5, mood: 'party', winText: 'Shattered!', failText: 'Out of breath!',
    card: { title: 'Every thing has its own note', kind: 'Physics', ref: 'Resonance',
      text: 'Tap a glass and it rings with one note. That is its own note, or natural frequency: how many times a second it wobbles by itself. A bigger glass has a lower note.\n\nA sound is the air pushing back and forth. When the owl sings exactly a glass\'s own note, every push arrives just as that glass is already moving that way. Each push adds a little more, so the wobble grows until the glass breaks. This is called resonance.\n\nA note that is a little off pushes at the wrong moments. Some pushes help and some cancel out, so the glass only trembles.',
      note: 'Pushing something at its own natural rhythm makes it shake more and more. This is resonance.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 4); const fs = L === 0 ? [[2.9, 4.4], [4.4, 2.9], [2.6, 3.9], [4.8, 3.4]][s.v] : [[2.75, 3.65, 4.55], [2.6, 3.5, 4.6], [2.9, 3.9, 4.8], [2.7, 3.8, 4.7]][s.v].map(f => f + (g.rand() - 0.5) * 0.16);
      for (let i = fs.length - 1; i > 0 && L; i--) { const j = Math.floor(g.rand() * (i + 1)); [fs[i], fs[j]] = [fs[j], fs[i]]; }
      const xs = fs.length === 2 ? [GL.x - 44, GL.x + 44] : [GL.x - 60, GL.x, GL.x + 60];
      s.gl = fs.map((f0, i) => ({ f0, w0: Math.PI * 2 * f0, cx: xs[i], sz: 1.45 - (f0 - 2.6) * 0.36, x: 0, v: 0, amp: 0, xn: 0, broken: 0 }));
      s.gam = [1.6, 1.4, 1.3][L];
      s.knob = yOf(L === 0 ? 3.65 : 2.25); s.ph = 0; s.shards = []; s.drag = null; s.lastNote = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; s.drag = { y0: y, k0: x < 100 ? y : s.knob }; if (x < 100) s.knob = SK.clamp(y, TR.y1, TR.y0); },
    move(g, x, y) { const s = g.s; if (!s.drag || g.done) return; s.knob = SK.clamp(s.drag.k0 + (y - s.drag.y0), TR.y1, TR.y0); },
    up(g) { g.s.drag = null; },
    update(g, dt) {
      const s = g.s, f = fOf(s.knob), w = Math.PI * 2 * f, n = 8, h = dt / n;
      for (let i = 0; i < n; i++) { // every glass is pushed by the same sound; each answers by its own note
        s.ph += w * h; const push = Math.cos(s.ph);
        for (const q of s.gl) { if (q.broken) continue; const a = -q.w0 * q.w0 * q.x - s.gam * q.v + s.gam * q.w0 * q.w0 * push; q.v += a * h; q.x += q.v * h; }
      }
      for (const q of s.gl) {
        if (q.broken) continue; q.amp = Math.hypot(q.x, q.v / q.w0) / q.w0; q.xn = q.x / q.w0;
        if (q.amp > BREAK && !g.done) {
          q.broken = g.t; g.sfx('crunch'); g.sfx('snap'); g.sfx('ding', { pitch: 0.5 + (q.f0 - F_LO) / (F_HI - F_LO) * 1.5 }); g.shake(4, 0.25);
          const top = GL.y - 4 - 54 * q.sz;
          for (let i = 0; i < 12; i++) { const a = -Math.PI * (0.1 + 0.8 * g.rand()), sp = 100 + g.rand() * 240; s.shards.push({ x: q.cx + (g.rand() - 0.5) * 24 * q.sz, y: top + g.rand() * 24 * q.sz, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: g.rand() * 6, va: (g.rand() - 0.5) * 14, sz: 4 + g.rand() * 7 }); }
          if (!next(s)) { g.sfx('cheer'); g.win(); }
        }
      }
      for (const p of s.shards) { p.vy += 900 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.va * dt; if (p.y > GL.y && p.vy > 0 && Math.abs(p.x - GL.x) < 90) { p.y = GL.y; p.vy *= -0.3; p.vx *= 0.6; p.va *= 0.5; } if (p.y > 600) { p.y = 600; p.vy = 0; p.vx *= 0.8; } }
      // the owl's song: one bell note per beat at the chosen pitch; a glass hums along when it wobbles hard
      if (!g.done && g.t > 0.5 && g.t - s.lastNote > 0.26) { s.lastNote = g.t; g.sfx('bell', { pitch: 0.5 + (f - F_LO) / (F_HI - F_LO) * 1.5, vol: 0.35 }); for (const q of s.gl) if (!q.broken && q.amp > 0.25) g.sfx('ding', { pitch: 0.5 + (q.f0 - F_LO) / (F_HI - F_LO) * 1.5, vol: q.amp }); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', f = fOf(s.knob);
      c.drawImage(g.bake('shatter_stage2', paintStage), 0, 0, 360, 640);
      for (const q of s.gl) glass(c, q, t);
      for (const p of s.shards) { c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = 'rgba(225,245,255,0.85)'; c.strokeStyle = '#ffffff'; c.lineWidth = 1; c.beginPath(); c.moveTo(-p.sz / 2, 0); c.lineTo(0, -p.sz); c.lineTo(p.sz / 2, p.sz * 0.3); c.closePath(); c.fill(); c.stroke(); c.restore(); }
      // the owl on its stool, singing (it turns blue and droops as its breath runs out)
      c.fillStyle = '#3a1a10'; c.fillRect(86, 500, 8, 54); c.fillRect(130, 500, 8, 54); c.fillStyle = '#8a3a2a'; c.beginPath(); c.roundRect(76, 492, 72, 12, 6); c.fill();
      const breath = g.dur ? SK.clamp(g.left() / g.dur, 0, 1) : 1;
      SK.animal(c, 'owl', 110, 494, 1.6, { t, pose: won ? 'cheer' : lost ? 'sad' : 'wave', expr: won ? 'laugh' : lost ? 'sad' : 'wow', tint: breath < 0.25 && !won ? P.mix('#8a6a4a', '#6a8ac8', 1 - breath * 4) : undefined, noShadow: true });
      // the sound wave from the owl's beak toward the glasses: crests closer together for a higher note
      if (!g.done) {
        const vs = 130, lam = vs / f, x0 = BEAK.x + 4, x1 = GL.x - 70, y0 = BEAK.y, y1 = GL.y - 50; c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
        const path = () => { c.beginPath(); for (let x = x0; x <= x1; x += 2) { const k = (x - x0) / (x1 - x0), env = Math.min(1, k * 5, (1 - k) * 6), y = SK.lerp(y0, y1, k) + Math.sin((x - x0) / lam * Math.PI * 2 - s.ph) * 12 * env; x === x0 ? c.moveTo(x, y) : c.lineTo(x, y); } };
        c.strokeStyle = 'rgba(255,200,90,0.3)'; c.lineWidth = 12; path(); c.stroke();
        c.strokeStyle = '#ffe27a'; c.lineWidth = 4.5; path(); c.stroke();
        c.restore();
      }
      // the golden note on the pitch pole
      const ky = s.knob; c.save(); c.shadowColor = 'rgba(0,0,0,0.4)'; c.shadowBlur = 8; SK.ball(c, TR.x, ky, 20, '#f2c040', { edge: '#7a4a10' }); c.restore();
      c.fillStyle = '#4a2a10'; c.beginPath(); c.ellipse(TR.x - 3, ky + 6, 6, 4.5, -0.4, 0, 7); c.fill(); c.fillRect(TR.x + 1.5, ky - 10, 2.5, 16); c.beginPath(); c.moveTo(TR.x + 4, ky - 10); c.quadraticCurveTo(TR.x + 12, ky - 6, TR.x + 9, ky + 1); c.lineTo(TR.x + 4, ky - 4); c.fill();
      SK.tag(c, 'High', TR.x + 52, TR.y1 - 4, 18); SK.tag(c, 'Low', TR.x + 48, TR.y0 + 4, 18);
      const q0 = next(s);
      if (!g.done && q0) { SK.grab(c, g, TR.x, ky, 24); SK.target(c, g, TR.x, yOf(q0.f0), 22); SK.arrow(c, g, TR.x + 30, ky, TR.x + 30, yOf(q0.f0), { from: 0, to: 0 }); }
      // which glass the note is for now: a bobbing arrow over it; while sliding, "Higher" / "Lower" / "Hold it there"
      if (!g.done && q0) { const top = GL.y - 4 - 54 * q0.sz - 26 + 4 * Math.sin(t * 5); c.save(); c.fillStyle = '#ffe27a'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.moveTo(q0.cx, top + 12); c.lineTo(q0.cx - 10, top - 2); c.lineTo(q0.cx + 10, top - 2); c.closePath(); c.fill(); c.stroke(); c.restore();
        if (s.drag) { const d = f - q0.f0, ok = Math.abs(d) < 0.1; SK.tag(c, ok ? 'Hold it there' : d < 0 ? 'Higher' : 'Lower', TR.x + 74, SK.clamp(ky, TR.y1, TR.y0), 18, ok ? '#8affa8' : '#ffe27a'); } }
      if (q0) SK.demo(g, c, 'drag', [TR.x + 4, s.knob + 6], [TR.x + 4, yOf(q0.f0) + 6]);
    },
    auto(g, dt, synth) {
      const s = g.s, B = s._ab = s._ab || { i: -1 }; if (g.done) return;
      const q = next(s), i = s.gl.indexOf(q); if (i < 0) return;
      if (B.i !== i) { if (s.drag) return; B.i = i; B.a = s.knob; B.t = Math.max(1.0, g.t + 0.15); }
      SK.bot.drag(g, synth, 'tune' + i, B.t, [TR.x, B.a], [TR.x, yOf(q.f0)], 0.45);
    },
  });
})();
