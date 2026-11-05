// CRUMPLE! (physics PHS-09) — a crash-test lab. A toy car with an egg for a driver waits on a ramp, facing a concrete
// wall. Drag the folded cardboard box on the car's nose to stretch it out into a crumple zone, then press Go. The car
// rolls down and hits the wall: the cardboard squashes flat fold after fold, so the car takes a longer distance (and time)
// to stop and the push on the egg is gentler. Too few boxes and the car stops dead: the egg cracks on the windscreen.
// A car that starts higher on the ramp is faster and needs a longer crumple zone. The "Push on egg" bar shows the push
// the crash will give with the boxes fitted. At level 2 the car must also stay
// short enough to fit its parking space (a crumple zone long enough, but no longer). Two cars at levels 0 and 1, three at 2.
(() => {
  const A = [6, 296], B = [190, 470], FY = 470, WALLX = 322, CL = 72, BL = 18, D0 = 3, GR = 500, PLIM = 1000;
  const RL = Math.hypot(B[0] - A[0], B[1] - A[1]), TH = Math.atan2(B[1] - A[1], B[0] - A[0]), FLAT = WALLX - B[0];
  const GO = { x: 270, y: 584, w: 150, h: 54 };
  // the car's nose at arc length s along the track (down the ramp, then along the floor); the car body lies behind it
  function at(s) { if (s <= RL) return { x: A[0] + Math.cos(TH) * s, y: A[1] + Math.sin(TH) * s, a: TH }; return { x: B[0] + (s - RL), y: FY, a: 0 }; }
  const heightAt = s => FY - at(Math.min(s, RL)).y;
  function paintLab(o) {
    N1.vgrad(o, 0, 0, 360, 640, ['#a8dcd8', '#c8ece6', '#e8f4ee']);
    o.fillStyle = 'rgba(255,255,255,0.3)'; for (let x = 0; x < 360; x += 60) o.fillRect(x, 0, 2, FY); for (let y = 30; y < FY; y += 60) o.fillRect(0, y, 360, 2);
    for (const x of [70, 180, 290]) { o.fillStyle = '#4a5a68'; o.fillRect(x - 1, 0, 2, 118); o.fillStyle = '#fff8d8'; o.beginPath(); o.ellipse(x, 124, 26, 8, 0, 0, 7); o.fill(); const lg = o.createRadialGradient(x, 130, 4, x, 180, 120); lg.addColorStop(0, 'rgba(255,250,210,0.35)'); lg.addColorStop(1, 'rgba(255,250,210,0)'); o.fillStyle = lg; o.fillRect(x - 120, 124, 240, 200); }

    // the floor with a hazard stripe
    N1.vgrad(o, 0, FY, 360, 170, ['#6a7480', '#4a525e']);
    for (let x = -20; x < 380; x += 28) { o.fillStyle = '#ffd43a'; o.beginPath(); o.moveTo(x, FY); o.lineTo(x + 14, FY); o.lineTo(x + 4, FY + 12); o.lineTo(x - 10, FY + 12); o.closePath(); o.fill(); }
    o.fillStyle = '#2a2a34'; for (let x = -6; x < 380; x += 28) { o.beginPath(); o.moveTo(x + 14, FY); o.lineTo(x + 28, FY); o.lineTo(x + 18, FY + 12); o.lineTo(x + 4, FY + 12); o.closePath(); o.fill(); }
    // the ramp
    o.fillStyle = '#8a9aa8'; o.beginPath(); o.moveTo(A[0] - 30, A[1] + 6); o.lineTo(B[0] + 10, FY); o.lineTo(A[0] - 30, FY); o.closePath(); o.fill();
    o.strokeStyle = '#4a5a68'; o.lineWidth = 6; o.beginPath(); o.moveTo(A[0] - 30, A[1] - 3); o.lineTo(B[0] + 10, FY - 1); o.stroke();
    o.strokeStyle = 'rgba(255,255,255,0.4)'; o.lineWidth = 2; for (let i = 1; i < 6; i++) { const k = i / 6, x = A[0] + (B[0] - A[0]) * k, y = A[1] + (B[1] - A[1]) * k; o.beginPath(); o.moveTo(x, y + 6); o.lineTo(x, FY); o.stroke(); }
    // the wall: a concrete block
    const wg = o.createLinearGradient(WALLX, 0, 360, 0); wg.addColorStop(0, '#a8a8b0'); wg.addColorStop(1, '#7a7a84'); o.fillStyle = wg; o.fillRect(WALLX, 300, 40, FY - 300); o.fillStyle = '#5a5a64'; o.fillRect(WALLX - 4, 296, 48, 8);
    o.fillStyle = 'rgba(40,40,50,0.25)'; const r = P.rng(3); for (let i = 0; i < 30; i++) { o.beginPath(); o.arc(WALLX + 4 + r() * 32, 306 + r() * 160, 1 + r() * 2, 0, 7); o.fill(); }
    o.strokeStyle = '#ffd43a'; o.lineWidth = 4; o.strokeRect(WALLX + 2, 302, 36, FY - 304);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) { o.fillStyle = (i + j) % 2 ? '#2a2a34' : '#ffd43a'; o.fillRect(WALLX + 6 + i * 10, 400 + j * 10, 10, 10); } // a crash-test target
  }
  function box(c, x, y, a, squash = 0, W = BL) { // one fold of the cardboard crumple box (length W), its back face at (x, y) along heading a
    c.save(); c.translate(x, y); c.rotate(a); const w = W * (1 - squash * 0.85), h = 26 - squash * 2;
    c.fillStyle = squash > 0.3 ? '#b8884a' : '#d8a860'; c.strokeStyle = '#7a5020'; c.lineWidth = 1.8;
    if (squash > 0.05) { c.beginPath(); c.moveTo(0, -h); for (let i = 0; i <= 4; i++) c.lineTo(w * i / 4 + (i % 2 ? 2 : -1) * squash * 3, -h + (i % 2 ? 2 : 0)); c.lineTo(w, 0); for (let i = 4; i >= 0; i--) c.lineTo(w * i / 4 + (i % 2 ? 2 : -1) * squash * 3, i % 2 ? -2 : 0); c.closePath(); c.fill(); c.stroke(); }
    else { c.beginPath(); c.rect(0, -h, w, h); c.fill(); c.stroke(); c.strokeStyle = 'rgba(120,80,30,0.6)'; c.beginPath(); c.moveTo(w / 2, -h); c.lineTo(w / 2, 0); c.stroke(); c.fillStyle = '#c8b090'; c.fillRect(w / 2 - 3, -h, 6, h); }
    c.restore();
  }
  function egg(c, x, y, crack, t, wob) {
    c.save(); c.translate(x, y); c.rotate(Math.sin(t * 30) * wob * 0.3);
    c.fillStyle = '#fff8ec'; c.strokeStyle = '#8a7a6a'; c.lineWidth = 1.6; c.beginPath(); c.ellipse(0, -9, 8, 11, 0, 0, 7); c.fill(); c.stroke();
    if (crack) { c.strokeStyle = '#5a4a3a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-7, -12); c.lineTo(-2, -8); c.lineTo(1, -13); c.lineTo(5, -8); c.lineTo(8, -11); c.stroke(); }
    c.fillStyle = '#2a1424'; c.beginPath(); c.arc(-2.5, -11, 1.4, 0, 7); c.arc(3, -11, 1.4, 0, 7); c.fill();
    c.strokeStyle = '#2a1424'; c.lineWidth = 1.2; c.beginPath(); if (crack || wob > 0.2) c.arc(0.5, -5, 2.5, Math.PI * 1.1, Math.PI * 1.9); else c.arc(0.5, -7.5, 2.5, 0.2, Math.PI - 0.2); c.stroke();
    c.restore();
  }
  function car(c, x, y, a, s, t) { // nose at (x, y); body behind it
    c.save(); c.translate(x, y); c.rotate(a); c.scale(CL / 58, CL / 58); const CL0 = CL; { const CL = 58;
    SK.shadow(c, -CL / 2, 2, CL / 2 + 4, 4, 0.25);
    c.fillStyle = '#2a2a34'; for (const wx of [-CL + 12, -12]) { c.beginPath(); c.arc(wx, -6, 7, 0, 7); c.fill(); c.fillStyle = '#9a9aa8'; c.beginPath(); c.arc(wx, -6, 2.6, 0, 7); c.fill(); c.fillStyle = '#2a2a34'; }
    const bg = c.createLinearGradient(0, -34, 0, -6); bg.addColorStop(0, '#5ab8f0'); bg.addColorStop(1, '#2a78c0'); c.fillStyle = bg; c.strokeStyle = '#123a6a'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-CL, -8); c.lineTo(-CL, -22); c.lineTo(-CL + 14, -24); c.lineTo(-CL + 24, -36); c.lineTo(-18, -36); c.lineTo(-8, -24); c.lineTo(0, -22); c.lineTo(0, -8); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#cfeeff'; c.beginPath(); c.moveTo(-CL + 27, -33); c.lineTo(-19, -33); c.lineTo(-11, -25); c.lineTo(-CL + 27, -25); c.closePath(); c.fill();
    egg(c, -26, -24, s.crack, t, s.wob || 0);
    if (s.crack) { c.fillStyle = '#ffc020'; c.beginPath(); c.ellipse(-14, -29, 7, 4, 0.8, 0, 7); c.fill(); c.fillStyle = 'rgba(255,250,235,0.9)'; c.beginPath(); c.ellipse(-16, -27, 11, 6, 0.8, 0, 7); c.globalCompositeOperation = 'destination-over'; c.fill(); c.globalCompositeOperation = 'source-over'; }
    c.fillStyle = '#c8c8d0'; c.fillRect(-2, -16, 4, 10); } // the steel bumper
    c.restore();
  }
  const pushFor = (h, L) => GR * h / (D0 + L); // v²/(2d) with v² = 2gh, d = the crumple length
  const needFor = h => GR * h / PLIM - D0, LMAX = 120; // the shortest crumple zone that saves the egg
  MG.add({
    id: 'crumple', stage: 'motion', cmd: 'PAD THE CAR SO THE EGG SURVIVES!', time: 7, mood: 'bright', winText: 'Soft landing!', failText: 'Splat!',
    card: { title: 'Crumple zones', kind: 'Physics', ref: 'Impulse: force times time',
      text: 'A crashing car has to lose all its speed. If it stops in a tiny distance, the stop takes a tiny moment, and the push on whoever is inside is huge.\n\nThe boxes squash as the car hits, so the car stops over a longer distance and a longer time. The same speed is lost, but more gently, so the egg survives.\n\nReal cars have crumple zones at the front and back that fold up in a crash for the same reason. A faster car needs a longer crumple zone.',
      note: 'Making a crash last longer makes the push gentler. Crumple zones fold up to stretch out the stop.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level), v = SK.variant(g, 4), n = lv <= 1 ? 2 : 3;
      const order = [[0.32, 0.78, 0.55], [0.78, 0.32, 0.55], [0.55, 0.78, 0.32], [0.32, 0.55, 0.78]][v]; // how far down the ramp each car starts (higher up = faster)
      s.starts = order.slice(0, n).map(k => RL * (k + (g.rand() - 0.5) * 0.04)); s.ci = 0; s.n = n; s.park = lv >= 2; s.saved = 0;
      s.L = 0; s.phase = 'set'; s.pos = s.starts[0]; s.v = 0; s.crushD = 0; s.crushK = 0; s.peak = 0; s.crack = 0; s.wob = 0; s.endT = 0; s.held = null; s.goT = 0; s.hitT = 0;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || s.phase !== 'set') return;
      const nz = at(s.pos), fx = nz.x + Math.cos(nz.a) * s.L, fy = nz.y + Math.sin(nz.a) * s.L;
      if (SK.dist(x, y, fx + 6, fy - 13) < 40) { s.held = { L0: s.L, x0: x, y0: y }; SK.dragStart(g, null, x, y); g.sfx('stretch', { vol: 0.4 }); return; }
      if (N1.inBox(GO, x, y)) { s.phase = 'roll'; s.goT = g.t; s.h0 = heightAt(s.pos); g.sfx('click'); g.sfx('swoosh'); }
    },
    move(g, x, y) { const s = g.s; if (!s.held) return; SK.dragMove(g, x, y); const a = at(s.pos).a; s.L = SK.clamp(s.held.L0 + (x - s.held.x0) * Math.cos(a) + (y - s.held.y0) * Math.sin(a), 0, LMAX); },
    up(g) { const s = g.s; if (!s.held) return; SK.dragEnd(g); s.held = null; },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      if (s.phase === 'roll') {
        const on = s.pos < RL, a = on ? GR * Math.sin(TH) : 0; s.v += a * dt; s.pos += s.v * dt;
        if (s.pos >= RL + FLAT - s.L - 1) { s.pos = RL + FLAT - s.L; s.phase = 'crush'; s.hitT = g.t; s.v0 = s.v; s.D = D0 + s.L; s.dec = s.v * s.v / (2 * s.D); s.crushD = 0; g.sfx('crunch'); g.shake(3 + 4 * Math.min(1, s.dec / PLIM), 0.25); }
      } else if (s.phase === 'crush') { // the boxes squash: the car slows evenly over the crumple distance
        const st = Math.min(s.v * dt, s.D - s.crushD); s.v = Math.max(0, s.v - s.dec * dt); s.crushD += st; s.pos += st; s.crushK = s.crushD / s.D; s.peak = s.dec;
        if (s.v <= 0 || s.crushD >= s.D - 0.01) {
          s.phase = 'stop'; s.endT = g.t;
          if (s.dec > PLIM) { s.crack = 1; g.sfx('crunch'); g.sfx('splash', { vol: 0.5 }); g.sfx('laugh'); const nz = at(s.pos); g.burst(nz.x - 16, nz.y - 30, ['#ffc020', '#fff8ec'], 18, 160); g.fail(); }
          else { s.wob = 1; s.saved++; g.sfx('boing', { vol: 0.5 }); g.sfx('chime'); }
        }
      } else if (s.phase === 'stop') { s.wob = Math.max(0, s.wob - dt * 1.6);
        if (g.t - s.endT > 0.5) { if (s.saved >= s.n) { g.win(); g.sfx('cheer'); } else { s.ci++; s.L = 0; s.phase = 'set'; s.pos = s.starts[s.ci]; s.v = 0; s.crushK = 0; s.crushD = 0; s.peak = 0; s.wob = 0; g.sfx('pop'); } } }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('crumple_lab', paintLab), 0, 0, 360, 640);
      SK.tag(c, 'Wall', WALLX + 6, 282, 18);
      // the car with its crumple zone
      const nz = at(s.pos), h = heightAt(s.pos), need = needFor(h);
      { const n = Math.ceil(s.L / BL - 0.01); let off = 0; // the crumple box: folds of cardboard, the front ones squash first
        for (let i = 0; i < n; i++) { const W = Math.min(BL, s.L - i * BL), cut = (n - 1 - i) * BL / Math.max(1, s.L), k = SK.clamp((s.crushK - cut) / Math.max(0.01, W / Math.max(1, s.L)), 0, 1);
          if (W > 0.5) box(c, nz.x + Math.cos(nz.a) * off, nz.y + Math.sin(nz.a) * off, nz.a, k, W); off += W * (1 - 0.85 * k); } }
      if (s.L > 6 && s.phase === 'set' && !g.done) SK.tag(c, 'Crumple box', nz.x + Math.cos(nz.a) * s.L / 2 + 34, nz.y + Math.sin(nz.a) * s.L / 2 + 30, 18);
      car(c, nz.x, nz.y, nz.a, s, t);
      // level 2: the parking space the car must fit (the car plus just enough boxes)
      if (s.park && s.phase === 'set' && !g.done) { const L = CL + need + 16, rx = nz.x - Math.cos(nz.a) * CL, ry = nz.y - Math.sin(nz.a) * CL, ok = s.L <= need + 16;
        c.save(); c.translate(rx, ry); c.rotate(nz.a); c.strokeStyle = ok ? '#2a9a4a' : '#d83a3a'; c.lineWidth = 3; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(0, 10); c.lineTo(L, 10); c.moveTo(0, 4); c.lineTo(0, 16); c.moveTo(L, 4); c.lineTo(L, 16); c.stroke(); c.restore();
        SK.tag(c, ok ? 'Parking' : 'Too long', rx + Math.cos(nz.a) * L / 2 - 30, ry + Math.sin(nz.a) * L / 2 + 34, 18, '#fff6ea', ok ? 'rgba(30,110,60,0.9)' : 'rgba(190,40,40,0.92)'); }
      // the push bar: what this crash will do to the egg (live during the crash)
      if (!g.done) { const BX = 34, BY = 200, BW = 292, pv = s.phase === 'set' ? pushFor(h, s.L) : s.phase === 'roll' ? pushFor(s.h0, s.L) : s.peak, f = SK.clamp(pv / (PLIM / 0.62), 0, 1), lf = 0.62;
        c.fillStyle = 'rgba(30,14,36,0.75)'; c.beginPath(); c.roundRect(BX - 6, BY - 14, BW + 12, 28, 14); c.fill();
        c.fillStyle = 'rgba(220,60,60,0.45)'; c.fillRect(BX + BW * lf, BY - 9, BW * (1 - lf), 18);
        c.fillStyle = pv > PLIM ? '#ff5a4a' : '#6ae07a'; c.beginPath(); c.roundRect(BX, BY - 7, Math.max(8, BW * f), 14, 7); c.fill();
        c.fillStyle = '#fff6ea'; c.fillRect(BX + BW * lf - 2, BY - 16, 4, 32);
        N1.word(c, 'Push on egg', BX + BW * lf / 2, BY + 30, 18); N1.word(c, 'Crack!', BX + BW * (lf + 1) / 2, BY + 30, 18, '#ffb0a0');
        N1.pips(c, 180, 252, s.n, s.saved, { col: '#fff8ec' }); }
      // the lever button and the duck tester
      const canGo = s.phase === 'set' && !g.done && pushFor(h, s.L) <= PLIM && (!s.park || s.L <= need + 16);
      if (s.phase === 'set' && !g.done) N1.button(c, GO, 'Go!', canGo ? '#3a9a5a' : '#7a8a7a', { lit: canGo, t, size: 24 });
      SK.animal(c, 'duck', 84, 600, 0.95, { t, pose: won ? 'cheer' : lost ? 'sad' : s.phase === 'crush' || s.phase === 'stop' ? (s.crack ? 'sad' : 'cheer') : 'idle', expr: won ? 'laugh' : lost ? 'wow' : s.crack ? 'wow' : 'happy' });
      // guidance: stretch the crumple box while the egg would crack (level 2: not past the parking space); then press Go
      if (s.phase !== 'set' || g.done || s.held) return;
      const fx = nz.x + Math.cos(nz.a) * s.L, fy = nz.y + Math.sin(nz.a) * s.L, want = need + 8, tx = nz.x + Math.cos(nz.a) * want, ty = nz.y + Math.sin(nz.a) * want;
      if (pushFor(h, s.L) > PLIM || (s.park && s.L > need + 16)) { SK.grab(c, g, fx + 6, fy - 13, 22); SK.target(c, g, tx + 6, ty - 13, 14); SK.arrow(c, g, fx + 6, fy - 13, tx + 6, ty - 13, { from: 20, to: 18 }); SK.demo(g, c, 'drag', [fx + 6, fy - 13], [tx + 6, ty - 13]); }
      else { SK.glow(c, g, GO.x, GO.y, 44, undefined, { level: 2 }); SK.demo(g, c, 'tap', [GO.x + 10, GO.y + 4]); }
    },
    auto(g, dt, synth) {
      const s = g.s, B = s._bot = s._bot || {}; if (g.done || s.phase !== 'set' || g.t < 1.0) return; if (B.wait && g.t < B.wait) return;
      const nz = at(s.pos), h = heightAt(s.pos), want = needFor(h) + 8;
      if (B.drag) { const k = SK.clamp((g.t - B.t0) / 0.4, 0, 1), L = SK.lerp(B.L0, want, k), x = nz.x + Math.cos(nz.a) * L + 6, y = nz.y + Math.sin(nz.a) * L - 13; synth('move', x, y); if (k >= 1) { synth('up', x, y); B.drag = 0; B.wait = g.t + 0.15; } return; }
      if (pushFor(h, s.L) > PLIM) { B.L0 = s.L; synth('down', nz.x + Math.cos(nz.a) * s.L + 6, nz.y + Math.sin(nz.a) * s.L - 13); B.drag = 1; B.t0 = g.t; return; }
      synth('down', GO.x, GO.y); synth('up', GO.x, GO.y); B.wait = g.t + 0.3;
    },
  });
})();
