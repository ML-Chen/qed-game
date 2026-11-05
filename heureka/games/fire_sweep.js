// SWEEP UP! (chem_bio FP-09) — a bakery factory at night shift: fine flour dust has settled along the steel beams,
// the shelves and the top of the big mixer. Drag the vacuum nozzle along each dusty surface to suck it clean (the dust
// streams into the nozzle). The mixer's start light counts down with the time. When it starts it shakes the whole
// building and its motor gives off a spark. If the surfaces are clean, the spark has nothing to catch and the bakery
// keeps working. If dust is left, the shaking knocks it into a cloud in the air, the spark flashes through the cloud
// with a cartoon WHOOMPH, the alarm rings and the ant bakers run out (unhurt). Level 0: three surfaces; level 1: four;
// level 2: five, one of them on top of a high pipe.
(() => {
  const SURF = [
    { n: 'Beam', y: 196, x0: 30, x1: 196, kind: 'beam' }, { n: 'Beam', y: 286, x0: 168, x1: 334, kind: 'beam' },
    { n: 'Mixer', y: 402, x0: 52, x1: 196, kind: 'mixer' }, { n: 'Shelf', y: 470, x0: 222, x1: 334, kind: 'shelf' }, { n: 'Pipe', y: 150, x0: 214, x1: 340, kind: 'pipe' },
  ];
  const R = 19;
  function paintBg(o) {
    const wall = o.createLinearGradient(0, 0, 0, 640); wall.addColorStop(0, '#5a3a3a'); wall.addColorStop(1, '#8a5a48'); o.fillStyle = wall; o.fillRect(0, 0, 360, 640);
    o.strokeStyle = 'rgba(40,20,20,0.35)'; o.lineWidth = 1.5; for (let y = 0; y < 560; y += 18) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); for (let x = (y / 18) % 2 ? 0 : 20; x < 360; x += 40) { o.beginPath(); o.moveTo(x, y); o.lineTo(x, y + 18); o.stroke(); } }
    // tall windows with the night outside
    for (const x of [60, 250]) { o.fillStyle = '#1a2040'; o.fillRect(x, 40, 60, 90); o.strokeStyle = '#3a2a2a'; o.lineWidth = 4; o.strokeRect(x, 40, 60, 90); o.beginPath(); o.moveTo(x + 30, 40); o.lineTo(x + 30, 130); o.moveTo(x, 85); o.lineTo(x + 60, 85); o.stroke(); o.fillStyle = '#fff4d0'; o.beginPath(); o.arc(x + 44, 60, 5, 0, 7); o.fill(); }
    // the floor, a conveyor of loaves
    o.fillStyle = '#6a5a5a'; o.fillRect(0, 556, 360, 84); o.fillStyle = 'rgba(0,0,0,0.2)'; o.fillRect(0, 556, 360, 6);
    o.fillStyle = '#4a4a5a'; o.fillRect(210, 520, 150, 14); for (let x = 214; x < 360; x += 20) { o.fillStyle = '#2a2a3a'; o.beginPath(); o.arc(x, 536, 4, 0, 7); o.fill(); }
    for (let x = 222; x < 350; x += 34) P.loaf(o, x, 518, 0.55);
  }
  function surface(c, S) {
    if (S.kind === 'beam') { c.fillStyle = '#5a6a7a'; c.fillRect(S.x0 - 6, S.y, S.x1 - S.x0 + 12, 16); c.fillStyle = '#7a8a9a'; c.fillRect(S.x0 - 6, S.y, S.x1 - S.x0 + 12, 4); c.fillStyle = '#3a4a5a'; c.fillRect(S.x0 - 6, S.y + 12, S.x1 - S.x0 + 12, 4); for (let x = S.x0 + 8; x < S.x1; x += 26) { c.fillStyle = '#8a9aaa'; c.beginPath(); c.arc(x, S.y + 8, 2, 0, 7); c.fill(); } }
    else if (S.kind === 'shelf') { c.fillStyle = '#8a6a4a'; c.fillRect(S.x0 - 6, S.y, S.x1 - S.x0 + 12, 10); c.fillStyle = '#5a4030'; c.fillRect(S.x0, S.y + 10, 6, 40); c.fillRect(S.x1 - 6, S.y + 10, 6, 40); }
    else if (S.kind === 'pipe') { c.fillStyle = '#9a7a5a'; c.beginPath(); c.roundRect(S.x0 - 8, S.y, S.x1 - S.x0 + 40, 18, 9); c.fill(); c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(S.x0 - 4, S.y + 3, S.x1 - S.x0 + 30, 3); c.strokeStyle = '#5a4a3a'; c.lineWidth = 2; for (const x of [S.x0 + 20, S.x1 - 20]) { c.beginPath(); c.moveTo(x, S.y + 18); c.lineTo(x, 100); c.stroke(); } }
  }
  function mixer(c, S, t, run, spark) {
    const x = (S.x0 + S.x1) / 2, y = S.y, sh = run ? Math.sin(t * 50) * 2 : 0;
    c.save(); c.translate(sh, 0);
    c.fillStyle = '#c8ccd8'; c.strokeStyle = '#4a4a5a'; c.lineWidth = 3; c.beginPath(); c.roundRect(S.x0 - 6, y, S.x1 - S.x0 + 12, 30, 6); c.fill(); c.stroke();
    c.fillStyle = '#a8acb8'; c.beginPath(); c.moveTo(S.x0 + 10, y + 30); c.lineTo(S.x1 - 10, y + 30); c.lineTo(S.x1 - 30, y + 120); c.lineTo(S.x0 + 30, y + 120); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#7a7e8a'; c.beginPath(); c.roundRect(S.x1 - 40, y + 44, 34, 30, 5); c.fill(); c.stroke();
    if (spark) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = '#fff2a0'; for (let i = 0; i < 6; i++) { const a = i * 1.05 + t * 9; c.beginPath(); c.moveTo(S.x1 - 23, y + 59); c.lineTo(S.x1 - 23 + Math.cos(a) * 18, y + 59 + Math.sin(a) * 18); c.lineTo(S.x1 - 23 + Math.cos(a + 0.2) * 6, y + 59 + Math.sin(a + 0.2) * 6); c.fill(); } c.restore(); }
    c.restore();
  }
  function startLight(c, x, y, k, run, t) {
    c.fillStyle = '#2a2a34'; c.beginPath(); c.roundRect(x - 34, y - 14, 68, 28, 14); c.fill();
    for (let i = 0; i < 4; i++) { const on = k > (i + 1) / 5 || run; c.fillStyle = on ? (run ? (Math.sin(t * 12) > 0 ? '#ff4a3a' : '#7a2a2a') : '#ffb030') : '#4a4a54'; c.beginPath(); c.arc(x - 22 + i * 15, y, 5, 0, 7); c.fill(); }
  }
  MG.add({
    id: 'sweep', stage: 'fire', cmd: 'VACUUM ALL THE FLOUR DUST!', time: 7, mood: 'storm', winText: 'Clean! Nothing for the spark to catch!', failText: 'WHOOMPH!',
    card: { title: 'Dust in the air burns fast', kind: 'Safety', ref: 'Dust explosions',
      text: 'A heap of flour burns slowly, because only the grains on the outside touch the air. Stir the same flour into a cloud and every tiny grain is surrounded by air. Then a flame can jump from grain to grain almost all at once, with a flash and a bang.\n\nFlour, sugar, sawdust and metal powders can all do this. So factories that make fine powders keep their beams, ledges and machines clean, vacuum the dust up, and never blow it around with an air hose.',
      note: 'Fine dust stirred into a cloud can burn almost all at once, so factories clean it up before it builds up.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.lv = lv; s.v = SK.variant(g, 4);
      const ids = [[0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4]][lv];
      s.surf = ids.map(i => { const S = SURF[i], j = (s.v * 7 + i * 3) % 5, pts = []; for (let x = S.x0 + 4; x <= S.x1 - 4; x += 7) pts.push({ x, y: S.y + 1, h: 8 + ((x * 13 + j * 7) % 7), d: 1 }); return Object.assign({}, S, { pts }); });
      s.last = null; s.motes = []; s.runT = 0; s.boomT = 0; s.cloud = []; s.order = SK.shuffled(g, s.surf.map((_, i) => i));
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.runT) return; s.last = [x, y]; suck(g, x, y); },
    move(g, x, y) { const s = g.s; if (!s.last || g.done || s.runT) return; const [x0, y0] = s.last, n = Math.max(1, Math.ceil(SK.dist(x0, y0, x, y) / 4)); for (let k = 1; k <= n; k++) suck(g, SK.lerp(x0, x, k / n), SK.lerp(y0, y, k / n)); s.last = [x, y]; },
    up(g) { g.s.last = null; },
    update(g, dt) {
      const s = g.s, t = g.t, left = s.surf.reduce((a, S) => a + S.pts.filter(p => p.d).length, 0);
      if (!left && !s.runT && !g.done) { s.runT = t; s.last = null; g.sfx('rumble', { vol: 0.5 }); }
      if (s.runT && !g.done && t - s.runT > 0.7) { g.win(); g.sfx('cheer'); }
      if (g.result === 'fail' && !s.runT) { s.runT = t; g.sfx('rumble'); for (const S of s.surf) for (const p of S.pts) if (p.d) { p.d = 0; s.cloud.push({ x: p.x, y: p.y, vx: (g.rand() - 0.5) * 40, vy: 30 + g.rand() * 60 }); } }
      if (g.result === 'fail' && s.runT && !s.boomT && t - s.runT > 0.5) { s.boomT = t; g.sfx('thunder'); g.sfx('fire'); g.sfx('bell'); g.shake(8, 0.5); }
      for (const p of s.motes) { const dx = p.tx - p.x, dy = p.ty - p.y, d = Math.hypot(dx, dy) || 1; p.x += dx / d * 420 * dt; p.y += dy / d * 420 * dt; p.life -= dt; } s.motes = s.motes.filter(p => p.life > 0);
      for (const p of s.cloud) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy *= Math.exp(-dt * 1.5); p.vx += (g.rand() - 0.5) * 30 * dt; }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', run = !!s.runT;
      c.drawImage(g.bake('sweep_bg', paintBg), 0, 0, 360, 640);
      const shake = run && !s.boomT ? Math.sin(t * 40) * 1.5 : 0; c.save(); c.translate(shake, 0);
      for (const S of s.surf) if (S.kind !== 'mixer') surface(c, S);
      const M = s.surf.find(S => S.kind === 'mixer'); mixer(c, M, t, run, run && Math.sin(t * 17) > 0.3);
      // the dust: soft cream mounds along the surfaces
      for (const S of s.surf) for (const p of S.pts) if (p.d) { c.fillStyle = '#c8b898'; c.beginPath(); c.ellipse(p.x + 1, p.y, 6.5, p.h * 0.8 + 1, 0, Math.PI, 0); c.fill(); c.fillStyle = '#f8f0dc'; c.beginPath(); c.ellipse(p.x, p.y, 6, p.h * 0.8, 0, Math.PI, 0); c.fill(); c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.arc(p.x - 1.5, p.y - p.h * 0.55, 1.6, 0, 7); c.fill(); }
      c.restore();
      // dust streaming into the nozzle
      for (const p of s.motes) { c.fillStyle = 'rgba(250,244,230,0.9)'; c.beginPath(); c.arc(p.x, p.y, 2.2, 0, 7); c.fill(); }
      startLight(c, 124, 380, g.dur ? SK.clamp(g.fuse() / g.dur, 0, 1) : 0, run, t);
      // the ant bakers: at work, cheering, or running for the door
      for (let i = 0; i < 3; i++) { const bx = 230 + i * 40, runOut = lost ? (t - s.runT) * 160 * (1 + i * 0.2) : 0; SK.animal(c, 'ant', bx + runOut, 556, 0.7, { t, phase: i, pose: won ? 'cheer' : lost ? 'walk' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: lost ? 1 : -1 }); }
      // the dust cloud and the flash
      if (s.cloud.length) { for (const p of s.cloud) { c.fillStyle = 'rgba(250,240,220,0.35)'; c.beginPath(); c.arc(p.x, p.y, 14, 0, 7); c.fill(); } }
      if (s.boomT) { const k = SK.clamp((t - s.boomT) / 0.5, 0, 1); c.save(); c.globalAlpha = 1 - k * 0.7; const fg = c.createRadialGradient(150, 330, 10, 150, 330, 60 + k * 260); fg.addColorStop(0, 'rgba(255,250,200,0.95)'); fg.addColorStop(0.4, 'rgba(255,190,80,0.8)'); fg.addColorStop(1, 'rgba(255,120,40,0)'); c.fillStyle = fg; c.fillRect(0, 0, 360, 640); c.restore();
        c.save(); c.translate(150, 330); c.rotate(-0.15); c.font = `900 ${40 + k * 10}px Nunito, system-ui, sans-serif`; c.textAlign = 'center'; c.lineWidth = 8; c.strokeStyle = '#7a2a14'; c.strokeText('WHOOMPH!', 0, 0); c.fillStyle = '#ffd45a'; c.fillText('WHOOMPH!', 0, 0); c.restore(); }
      if (!g.done) { const S0 = s.surf.find(S => S.pts.some(p => p.d)); if (S0) SK.tag(c, 'Flour dust', SK.clamp((S0.x0 + S0.x1) / 2, 70, 290), S0.y - 30, 18); SK.tag(c, 'Spark', 186, 486, 18, '#fff6ea', 'rgba(190,60,20,0.88)'); SK.tag(c, 'Mixer', 100, 476, 18); if (!s.last) SK.tag(c, 'Vacuum', 72, 548, 18); }
      if (s.last && !g.done) { const [x, y] = s.last; c.strokeStyle = '#3a3a4a'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y + 14); c.quadraticCurveTo(x - 20, y + 120, 30, 600); c.stroke(); c.fillStyle = '#e8c030'; c.strokeStyle = '#5a4a1a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 16, y - 6); c.lineTo(x + 16, y - 6); c.lineTo(x + 6, y + 16); c.lineTo(x - 6, y + 16); c.closePath(); c.fill(); c.stroke(); }
      c.fillStyle = '#e8c030'; c.strokeStyle = '#5a4a1a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(10, 572, 46, 44, 10); c.fill(); c.stroke(); c.fillStyle = '#5a4a1a'; c.fillRect(20, 566, 26, 8);
      // guidance: drag along the dustiest surface left, from its first dust to its last
      if (g.done || run) return; const S = s.surf.filter(S => S.pts.some(p => p.d)).sort((a, b) => b.pts.filter(p => p.d).length - a.pts.filter(p => p.d).length)[0];
      if (!S) return; const ds = S.pts.filter(p => p.d), a = [ds[0].x, S.y - 4], b = [ds[ds.length - 1].x, S.y - 4];
      if (!s.last) { SK.grab(c, g, a[0], a[1], 18); SK.arrow(c, g, a[0], a[1], b[0], b[1], { from: 20, to: 4 }); SK.target(c, g, b[0], b[1], 14); }
      SK.demo(g, c, 'drag', a, b[0] - a[0] < 10 ? [a[0] + 14, a[1]] : b);
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 0.7 || s.runT) return; const B = s._wb = s._wb || { n: 0, at: 0 };
      if (B.cur) { if (SK.bot.drag(g, synth, 'v' + B.n, B.cur.t0, B.cur.a, B.cur.b, 0.45)) { B.n++; B.cur = null; B.at = g.t + 0.1; } return; }
      if (g.t < B.at) return; const S = s.surf.find(S => S.pts.some(p => p.d)); if (!S) return; const ds = S.pts.filter(p => p.d);
      B.cur = { t0: g.t, a: [ds[0].x - 6, S.y - 4], b: [ds[ds.length - 1].x + 6, S.y - 4] };
    },
  });
  function suck(g, x, y) { const s = g.s; let n = 0; for (const S of s.surf) for (const p of S.pts) if (p.d && SK.dist(p.x, p.y, x, y) <= R) { p.d = 0; n++; if (s.motes.length < 60) s.motes.push({ x: p.x, y: p.y - 4, tx: x, ty: y, life: 0.25 }); }
    if (n && g.t - (s.vT || 0) > 0.2) { s.vT = g.t; g.sfx('slurp', { vol: 0.4 }); } }
})();
