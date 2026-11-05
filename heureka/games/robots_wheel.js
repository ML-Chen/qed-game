// FREEZE THE WHEEL ON SCREEN! (earth_eng SC-12, STOP THE WHEEL!) — a wagon wheel with six spokes spins fast on a
// stand, and a camera films it. The camera takes a still picture (a frame) a set number of times per second, and its
// screen shows only those pictures. Slide the Frame rate knob until the wheel on the screen stands still, and hold it
// there: that happens when the wheel turns exactly one spoke between pictures, so every picture looks the same. A bit
// faster and each picture catches the wheel just short of a spoke, so it seems to roll slowly backwards (the fox rubs
// its eyes); a bit slower and it creeps forwards. Three wheels spinning at different speeds (two at level 0); the band
// of "still" frame rates is narrower at higher levels.
(() => {
  const N = 6, FMIN = 4, FMAX = 24, TR = { x0: 46, x1: 314, y: 574 }, WH = { x: 96, y: 236, r: 66 }, SC = { x: 180, y: 418, w: 236, h: 160 };
  const SEQS = [[2.0, 2.5, 1.5], [2.5, 1.5, 2.0], [1.5, 2.5, 1.2], [3.0, 2.0, 2.5]]; // turns per second (freeze at 12, 15, 9, 7.2, 18 frames/s)
  const TOLS = [1.1, 0.8, 0.55], HOLD = 0.8;
  const fx = F => TR.x0 + (F - FMIN) / (FMAX - FMIN) * (TR.x1 - TR.x0), Fof = x => FMIN + SK.clamp((x - TR.x0) / (TR.x1 - TR.x0), 0, 1) * (FMAX - FMIN);
  // how far the wheel seems to turn per picture, in spokes (-0.5..0.5), and how fast it seems to spin (spokes per second)
  function seen(f, F) { const q = f * N / F, d = q - Math.round(q); return { d, w: d * F }; }
  function paintStudio(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#f2c27a'); bg.addColorStop(0.45, '#f8dca8'); bg.addColorStop(1, '#c89870'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    o.fillStyle = 'rgba(255,255,255,0.12)'; for (let x = 0; x < 360; x += 30) o.fillRect(x, 120, 14, 200);
    o.fillStyle = '#a8784a'; o.fillRect(0, 316, 360, 10); o.fillStyle = '#8a5a34'; o.fillRect(0, 326, 360, 314);
    for (let y = 340; y < 640; y += 40) { o.fillStyle = 'rgba(60,30,10,0.18)'; o.fillRect(0, y, 360, 2); }
    // the wheel's stand and motor
    o.fillStyle = '#5a5a6a'; o.beginPath(); o.moveTo(WH.x - 40, 318); o.lineTo(WH.x - 8, WH.y); o.lineTo(WH.x + 8, WH.y); o.lineTo(WH.x + 40, 318); o.closePath(); o.fill();
  }
  function wheel(c, x, y, r, ang, blur, col) {
    const draw = (a, al) => { c.save(); c.globalAlpha *= al; c.translate(x, y); c.rotate(a); c.strokeStyle = col.spoke; c.lineWidth = r * 0.09; c.lineCap = 'round'; for (let i = 0; i < N; i++) { const q = i * 2 * Math.PI / N; c.beginPath(); c.moveTo(Math.cos(q) * r * 0.16, Math.sin(q) * r * 0.16); c.lineTo(Math.cos(q) * r * 0.84, Math.sin(q) * r * 0.84); c.stroke(); } c.restore(); };
    c.save(); c.strokeStyle = col.rim; c.lineWidth = r * 0.16; c.beginPath(); c.arc(x, y, r * 0.9, 0, 7); c.stroke(); c.strokeStyle = 'rgba(255,255,255,0.3)'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, r * 0.98, -2.4, -1.2); c.stroke(); c.restore();
    if (blur) { for (let k = 0; k < 6; k++) draw(ang - k * blur / 6, 0.28); } else draw(ang, 1);
    c.fillStyle = col.hub; c.beginPath(); c.arc(x, y, r * 0.17, 0, 7); c.fill(); c.strokeStyle = col.rim; c.lineWidth = 3; c.stroke();
  }
  const COLS = [{ rim: '#6a3a1a', spoke: '#a8683a', hub: '#e8b060' }, { rim: '#2a4a7a', spoke: '#5a8ac8', hub: '#c8d8f0' }, { rim: '#7a2a3a', spoke: '#c85a6a', hub: '#f0c0a0' }];
  function newWheel(g) { const s = g.s; s.f = s.seq[s.i]; s.hold = 0; s.ok = 0; s.born = g.t; }
  MG.add({
    id: 'wheel', stage: 'robots', cmd: 'FREEZE THE WHEEL ON SCREEN!', time: 7, mood: 'party', winText: 'Frozen still!', failText: 'Still spinning!',
    card: { title: 'Cameras sample in snapshots', kind: 'Robots', ref: 'Sampling and aliasing (the wagon-wheel effect)',
      text: 'A camera does not watch smoothly. It takes separate pictures, called frames, many times a second. A robot\'s sensors sample the world the same way.\n\nIf a six-spoked wheel turns exactly one spoke between two frames, every frame looks the same, so the wheel looks frozen. If it turns a little less than one spoke, each frame shows it a bit behind, so it seems to roll slowly backwards.\n\nSampling too slowly for fast motion can make it look slow, still or backwards. This is called aliasing.',
      note: 'Sampling fast motion too slowly can make it look slow, still or even backwards.' },
    init(g) { const s = g.s; s.L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.seq = SEQS[s.v]; s.n = s.L === 0 ? 2 : 3; s.i = 0; s.F = 21.5; s.drag = false; s.tol = TOLS[s.L]; newWheel(g); },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (Math.abs(y - TR.y) < 40 && x > TR.x0 - 30 && x < TR.x1 + 30) { s.drag = true; s.grab = fx(s.F) - x; if (Math.abs(s.grab) > 30) s.grab = 0; s.F = Fof(x + s.grab); g.sfx('click'); } },
    move(g, x) { const s = g.s; if (!s.drag) return; const F0 = s.F; s.F = Fof(x + s.grab); if (Math.floor(F0 * 2) !== Math.floor(s.F * 2)) g.sfx('tap', { vol: 0.25, pitch: 0.8 + s.F / 30 }); },
    up(g) { g.s.drag = false; },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      if (s.ok) { if (g.t - s.ok > 0.45) { s.i++; if (s.i >= s.n) { g.win(); g.sfx('cheer'); } else { newWheel(g); g.sfx('whoosh'); } } return; }
      const { w } = seen(s.f, s.F);
      if (Math.abs(w) < s.tol) { s.hold += dt; if (s.hold >= HOLD) { s.ok = g.t; g.sfx('chime'); g.sfx('magic'); g.burst(SC.x, SC.y, ['#ffd45a', '#fff6ea', '#7ee8a0'], 16, 140); } }
      else s.hold = Math.max(0, s.hold - dt * 2);
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', col = COLS[s.i % 3];
      c.drawImage(g.bake('wheel_studio', paintStudio), 0, 0, 360, 640);
      // the real wheel, spinning fast (a blur)
      const ang = 2 * Math.PI * s.f * (t - s.born) + s.i; wheel(c, WH.x, WH.y, WH.r, ang, 2 * Math.PI * s.f / 30, col);
      SK.tag(c, 'Wheel', WH.x, WH.y + WH.r + 22, 18);
      // the camera on its tripod, pointing at the wheel, clicking at the frame rate
      const CX = 270, CY = 214, snap = ((t * s.F) % 1) < 0.25;
      c.strokeStyle = '#3a3448'; c.lineWidth = 4; c.beginPath(); c.moveTo(CX, CY + 24); c.lineTo(CX - 24, 316); c.moveTo(CX, CY + 24); c.lineTo(CX + 24, 316); c.moveTo(CX, CY + 24); c.lineTo(CX, 316); c.stroke();
      c.fillStyle = '#3a3448'; c.beginPath(); c.roundRect(CX - 34, CY - 22, 70, 46, 8); c.fill(); c.fillStyle = '#5a5470'; c.beginPath(); c.arc(CX - 14, CY - 30, 13, 0, 7); c.arc(CX + 14, CY - 30, 13, 0, 7); c.fill();
      c.fillStyle = '#1a1a2a'; c.beginPath(); c.roundRect(CX - 58, CY - 12, 26, 26, 4); c.fill(); c.fillStyle = snap ? '#fff6c0' : '#4a6a9a'; c.beginPath(); c.arc(CX - 50, CY + 1, 8, 0, 7); c.fill();
      c.fillStyle = snap ? '#ff4a3a' : '#7a2a2a'; c.beginPath(); c.arc(CX + 24, CY - 12, 4, 0, 7); c.fill();
      SK.tag(c, 'Camera', CX, CY + 48, 18);
      // the screen: only the pictures the camera took
      c.fillStyle = 'rgba(30,14,36,0.35)'; c.beginPath(); c.roundRect(SC.x - SC.w / 2 + 4, SC.y - SC.h / 2 + 6, SC.w, SC.h + 16, 16); c.fill();
      c.fillStyle = '#2a2440'; c.beginPath(); c.roundRect(SC.x - SC.w / 2, SC.y - SC.h / 2, SC.w, SC.h + 16, 16); c.fill();
      c.fillStyle = '#e8f0f8'; c.beginPath(); c.roundRect(SC.x - SC.w / 2 + 10, SC.y - SC.h / 2 + 10, SC.w - 20, SC.h - 4, 10); c.fill();
      const tk = Math.floor((t - s.born) * s.F) / s.F, sa = 2 * Math.PI * s.f * tk + s.i; wheel(c, SC.x, SC.y + 4, 62, sa, 0, col);
      const { w } = seen(s.f, s.F), still = Math.abs(w) < s.tol;
      if (s.hold > 0 || s.ok) { c.save(); c.strokeStyle = '#3ac86a'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.arc(SC.x, SC.y + 4, 70, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, s.ok ? 1 : s.hold / HOLD)); c.stroke(); c.restore(); }
      if (!g.done) { if (still) SK.tag(c, 'Still!', SC.x + 82, SC.y - 52, 18, '#fff6ea', 'rgba(40,150,70,0.95)'); else if (w < 0 && w > -4) SK.tag(c, 'Backwards!', SC.x + 60, SC.y - 52, 18, '#fff6ea', 'rgba(200,60,60,0.92)'); else if (w > 0 && w < 4) SK.tag(c, 'Slow!', SC.x + 82, SC.y - 52, 18, '#3a1640', 'rgba(255,212,90,0.95)'); }
      SK.tag(c, 'Screen', SC.x - 76, SC.y - 52, 18);
      // the fox watching the screen: rubs its eyes when the wheel seems to roll backwards
      SK.animal(c, 'fox', 322, 520, 0.72, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : still ? 'happy' : w < 0 && w > -4 ? 'think' : 'wow', facing: -1 });
      if (!g.done) N5.slots(c, s.i, s.n, 204, 326);
      // the frame-rate slider
      c.save(); c.fillStyle = 'rgba(30,14,36,0.7)'; c.beginPath(); c.roundRect(TR.x0 - 24, TR.y - 22, TR.x1 - TR.x0 + 48, 44, 22); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.2)'; c.beginPath(); c.roundRect(TR.x0, TR.y - 4, TR.x1 - TR.x0, 8, 4); c.fill(); c.restore();
      const kx = fx(s.F); c.save(); c.fillStyle = still ? '#7ee8a0' : '#ffd45a'; c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.beginPath(); c.arc(kx, TR.y, 16, 0, 7); c.fill(); c.stroke(); c.restore();
      N5.text(c, 'Frame rate: ' + s.F.toFixed(1) + ' per second', 180, TR.y - 38, 18, '#fff6ea');
      // guidance: drag the knob to where the wheel looks still (the slowest such rate in range above the knob's side)
      if (!s.ok && !g.done) { const opts = []; for (let k = 1; k <= 3; k++) { const F0 = s.f * N / k; if (F0 >= FMIN + 0.3 && F0 <= FMAX - 0.3) opts.push(F0); } const F0 = opts.sort((a, b) => Math.abs(a - s.F) - Math.abs(b - s.F))[0], tx = fx(F0);
        if (!still) { SK.grab(c, g, kx, TR.y, 22); SK.target(c, g, tx, TR.y, 18); SK.arrow(c, g, kx, TR.y - 2, tx, TR.y - 2, { from: 24, to: 24 }); SK.demo(g, c, 'drag', [kx, TR.y], [tx, TR.y]); }
        else SK.demo(g, c, 'drag', [kx, TR.y], [kx, TR.y], { never: true }); }
    },
    // the bot slides the knob to the nearest frame rate that freezes the wheel
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.ok || g.t - s.born < 0.5) return; if (Math.abs(seen(s.f, s.F).w) < s.tol * 0.5) return;
      const opts = []; for (let k = 1; k <= 3; k++) { const F0 = s.f * N / k; if (F0 >= FMIN + 0.3 && F0 <= FMAX - 0.3) opts.push(F0); } const F0 = opts.sort((a, b) => Math.abs(a - s.F) - Math.abs(b - s.F))[0];
      SK.bot.drag(g, synth, 'knob' + s.i, s.born + 0.5, [fx(s.F), TR.y], [fx(F0), TR.y], 0.5);
    },
  });
})();
