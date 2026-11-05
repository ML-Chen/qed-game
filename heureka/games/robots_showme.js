// SHOW ME! (hardware RO-21) — a laundry table seen from above, a robot arm whose gripper already pinches the edge of a
// towel. Drag the robot's hand across to fold the towel in half, then in half again: the arm records every move (a
// red Rec light; the trail of your hand turns red where it wobbles). Then a new towel slides in and the robot folds it
// by itself, copying your moves: this is how robots learn from demonstrations. A shaky, wandering drag is copied too:
// the robot wobbles its way through and scrunches the new towel into a lumpy ball, with a flourish.
// Level 1: three folds. Level 2: show it on two towels of different shapes; then it folds a third, new shape.
(() => {
  const BASE = { x: 180, y: 262 }, L1 = 168, L2 = 168, HOLD_K = 0.8, REPLAY = 0.85;
  const COLS = [['#e85a7a', '#fff2f4'], ['#3a9ad8', '#e8f6ff'], ['#f0a830', '#fff8e0'], ['#4ab07a', '#eafff2']];
  // a towel: centre, half sizes, its colours, how many layers thick, and the folds still to do (axis, handle side)
  function towel(cx, cy, w, h, col, folds) { return { cx, cy, hw: w / 2, hh: h / 2, col: col[0], band: col[1], layers: 1, folds: folds.slice(), done: 0, lump: 0 }; }
  // the current fold's frame: u along the fold axis (handle at u = +half*side), v across it
  function frame(T) { const f = T.folds[T.done]; if (!f) return null; const ax = f[0], sd = f[1]; return { ax, sd, half: ax === 'x' ? T.hw : T.hh, hv: ax === 'x' ? T.hh : T.hw }; }
  const toXY = (T, F, u, v) => F.ax === 'x' ? [T.cx + u, T.cy + v] : [T.cx + v, T.cy + u];
  const toUV = (T, F, x, y) => F.ax === 'x' ? [x - T.cx, y - T.cy] : [y - T.cy, x - T.cx];
  function handle(T) { const F = frame(T); return F ? toXY(T, F, F.half * F.sd, 0) : [T.cx, T.cy]; }
  function goal(T) { const F = frame(T); return F ? toXY(T, F, -F.half * F.sd, 0) : [T.cx, T.cy]; }
  // fold the towel in half along the current fold (the handle half now lies on the other half)
  function applyFold(T) { const F = frame(T); const shift = -F.sd * F.half / 2; if (F.ax === 'x') { T.cx += shift; T.hw /= 2; } else { T.cy += shift; T.hh /= 2; } T.layers *= 2; T.done++; }
  function paintRoom(o) {
    const wall = o.createLinearGradient(0, 0, 0, 260); wall.addColorStop(0, '#b8a0d8'); wall.addColorStop(1, '#e8d0e8'); o.fillStyle = wall; o.fillRect(0, 0, 360, 262);
    o.fillStyle = 'rgba(255,255,255,0.12)'; for (let x = 0; x < 360; x += 36) o.fillRect(x, 120, 18, 142);
    // a round window with the sky, and a shelf of folded towels
    o.fillStyle = '#7a5a9a'; o.beginPath(); o.arc(70, 180, 44, 0, 7); o.fill(); const sk = o.createLinearGradient(0, 140, 0, 220); sk.addColorStop(0, '#8ad0f8'); sk.addColorStop(1, '#e0f4ff'); o.fillStyle = sk; o.beginPath(); o.arc(70, 180, 36, 0, 7); o.fill();
    P.cloud(o, 62, 186, 0.28); o.strokeStyle = '#7a5a9a'; o.lineWidth = 4; o.beginPath(); o.moveTo(70, 144); o.lineTo(70, 216); o.moveTo(34, 180); o.lineTo(106, 180); o.stroke();
    // the table top, wood seen from above
    const tb = o.createLinearGradient(0, 250, 0, 640); tb.addColorStop(0, '#9a6240'); tb.addColorStop(1, '#6a3e28'); o.fillStyle = tb; o.fillRect(0, 250, 360, 390);
    o.fillStyle = '#5a321e'; o.fillRect(0, 250, 360, 8); const r = P.rng(7);
    o.strokeStyle = 'rgba(40,18,8,0.25)'; o.lineWidth = 1.4; for (let i = 0; i < 26; i++) { const y = 266 + r() * 370, x = r() * 360; o.beginPath(); o.moveTo(x, y); o.bezierCurveTo(x + 40, y + 4 * (r() - 0.5), x + 80, y - 3, x + 130, y + 2); o.stroke(); }
    for (let y = 330; y < 640; y += 78) { o.fillStyle = 'rgba(30,10,4,0.25)'; o.fillRect(0, y, 360, 2); }
    // a laundry basket for finished towels
    o.fillStyle = '#c89858'; o.beginPath(); o.roundRect(16, 548, 84, 60, 10); o.fill(); o.strokeStyle = '#8a6030'; o.lineWidth = 2; for (let x = 24; x < 100; x += 10) { o.beginPath(); o.moveTo(x, 552); o.lineTo(x, 604); o.stroke(); } o.strokeRect(16, 548, 84, 60);
  }
  function rect(c, x0, y0, w, h, fill) { c.fillStyle = fill; c.beginPath(); c.roundRect(x0, y0, w, h, 6); c.fill(); }
  // a flat towel: base colour, two bands across its ends, a soft edge, thicker lines for more layers
  function drawTowel(c, T, flap) {
    const F = frame(T);
    if (T.lump > 0) { drawBall(c, T); return; }
    let x0 = T.cx - T.hw, y0 = T.cy - T.hh, w = T.hw * 2, h = T.hh * 2;
    if (flap && F) { // only the half that stays put is flat; the other half is the moving flap
      if (F.ax === 'x') { if (F.sd > 0) w = T.hw; else { x0 = T.cx; w = T.hw; } } else { if (F.sd > 0) h = T.hh; else { y0 = T.cy; h = T.hh; } }
    }
    c.fillStyle = 'rgba(30,10,4,0.3)'; c.beginPath(); c.roundRect(x0 + 3, y0 + 5, w, h, 6); c.fill();
    rect(c, x0, y0, w, h, T.col);
    c.save(); c.beginPath(); c.roundRect(x0, y0, w, h, 6); c.clip(); c.fillStyle = T.band;
    const W0 = T.hw * 2, Hh = T.hh * 2; if (W0 >= Hh) { c.fillRect(T.cx - T.hw + W0 * 0.12, y0, 6, h); c.fillRect(T.cx + T.hw - W0 * 0.12 - 6, y0, 6, h); } else { c.fillRect(x0, T.cy - T.hh + Hh * 0.12, w, 6); c.fillRect(x0, T.cy + T.hh - Hh * 0.12 - 6, w, 6); }
    c.fillStyle = 'rgba(255,255,255,0.13)'; for (let yy = y0 + 4; yy < y0 + h; yy += 7) c.fillRect(x0, yy, w, 2);
    c.restore();
    c.strokeStyle = P.shade(T.col, -0.35); c.lineWidth = Math.min(6, 1.5 + Math.log2(T.layers)); c.beginPath(); c.roundRect(x0, y0, w, h, 6); c.stroke();
    if (flap && F) drawFlap(c, T, F, flap);
  }
  // the moving half: from the fold line to the gripper. Still on its own side it is rising (foreshortened, shaded);
  // past the fold line it lies upside down on top, showing its paler underside. Its far edge follows the gripper.
  function drawFlap(c, T, F, flap) {
    const [u, v] = flap, over = u * F.sd < 0, hv = F.hv;
    const pts = [toXY(T, F, 0, -hv), toXY(T, F, 0, hv), toXY(T, F, u, hv + v), toXY(T, F, u, -hv + v)];
    c.fillStyle = 'rgba(30,10,4,0.3)'; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x + 4, y + 7) : c.moveTo(x + 4, y + 7)); c.closePath(); c.fill();
    c.fillStyle = over ? P.mix(T.col, '#ffffff', 0.35) : P.shade(T.col, -0.12 - 0.2 * (1 - Math.abs(u) / F.half));
    c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); c.strokeStyle = P.shade(T.col, -0.4); c.lineWidth = 2; c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 3; c.beginPath(); c.moveTo(...pts[0]); c.lineTo(...pts[1]); c.stroke(); // the fold crease
  }
  function drawBall(c, T) { // the lumpy ball the robot makes of a towel when it copies shaky moves
    const k = T.lump, r = SK.lerp(Math.max(T.hw, T.hh), 46, k); c.save(); c.translate(T.cx, T.cy);
    c.fillStyle = 'rgba(30,10,4,0.3)'; c.beginPath(); c.ellipse(4, r * 0.8, r, r * 0.3, 0, 0, 7); c.fill();
    c.fillStyle = T.col; c.beginPath(); for (let i = 0; i <= 14; i++) { const a = i / 14 * 6.283, rr = r * (1 + k * 0.22 * Math.sin(i * 2.7) + k * 0.12 * Math.cos(i * 5.1)); i ? c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : c.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill();
    c.strokeStyle = P.shade(T.col, -0.4); c.lineWidth = 2.5; c.stroke(); c.lineWidth = 2;
    for (let i = 0; i < 6; i++) { const a = i * 1.1; c.beginPath(); c.arc(Math.cos(a) * r * 0.35, Math.sin(a) * r * 0.35, r * 0.3, a, a + 1.8); c.stroke(); }
    c.fillStyle = T.band; c.save(); c.rotate(0.6); c.fillRect(-r * 0.8, -4, r * 1.2, 5); c.restore(); c.restore();
  }
  // the robot arm: a turret on the table edge, two links (bent at the elbow) and a two-finger gripper
  function drawArm(c, G, closed, t, spin) {
    const dx = G[0] - BASE.x, dy = G[1] - BASE.y, D = SK.clamp(Math.hypot(dx, dy), 30, (L1 + L2) * 0.995), a = Math.atan2(dy, dx);
    const b = Math.acos(SK.clamp((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D), -1, 1)), E = [BASE.x + Math.cos(a - b) * L1, BASE.y + Math.sin(a - b) * L1];
    const link = (p, q, w) => { c.lineCap = 'round'; c.strokeStyle = '#3a3448'; c.lineWidth = w + 5; c.beginPath(); c.moveTo(...p); c.lineTo(...q); c.stroke(); c.strokeStyle = '#f0a040'; c.lineWidth = w; c.stroke(); c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = w * 0.25; c.beginPath(); c.moveTo(p[0] - 2, p[1] - 3); c.lineTo(q[0] - 2, q[1] - 3); c.stroke(); };
    SK.shadow(c, (BASE.x + G[0]) / 2 + 10, (BASE.y + G[1]) / 2 + 16, 30, 10, 0.12);
    c.fillStyle = '#3a3448'; c.beginPath(); c.arc(BASE.x, BASE.y, 30, 0, 7); c.fill(); c.fillStyle = '#6a6488'; c.beginPath(); c.arc(BASE.x, BASE.y, 24, 0, 7); c.fill();
    link([BASE.x, BASE.y], E, 18); link(E, G, 14);
    c.fillStyle = '#3a3448'; c.beginPath(); c.arc(E[0], E[1], 12, 0, 7); c.fill(); c.fillStyle = '#c8c0e0'; c.beginPath(); c.arc(E[0], E[1], 6, 0, 7); c.fill();
    c.fillStyle = '#c8c0e0'; c.beginPath(); c.arc(BASE.x, BASE.y, 9, 0, 7); c.fill();
    // the robot's face on the turret: two little eye lights
    c.fillStyle = '#7ef0ff'; c.beginPath(); c.arc(BASE.x - 8, BASE.y - 2, 3.5, 0, 7); c.arc(BASE.x + 8, BASE.y - 2, 3.5, 0, 7); c.fill();
    const ga = Math.atan2(G[1] - E[1], G[0] - E[0]) + (spin || 0), op = closed ? 5 : 13;
    c.save(); c.translate(G[0], G[1]); c.rotate(ga); c.fillStyle = '#3a3448'; c.beginPath(); c.roundRect(-14, -16, 18, 32, 6); c.fill();
    c.fillStyle = '#d8d0f0'; c.strokeStyle = '#3a3448'; c.lineWidth = 2; for (const s of [-1, 1]) { c.beginPath(); c.roundRect(0, s * op - 4, 20, 8, 3); c.fill(); c.stroke(); } c.restore();
  }
  function newPhase(s, ph, t) { s.ph = ph; s.pt = t; }
  MG.add({
    id: 'showme', stage: 'robots', cmd: 'SHOW THE ROBOT HOW TO FOLD!', time: 6, mood: 'party', winText: 'It copied you!', failText: 'It copied the wobbles!',
    card: { title: 'Robots learn by copying', kind: 'Robots', ref: 'Learning from demonstration (imitation learning)',
      text: 'Folding a floppy towel is hard to write as a program. So people often teach a robot by showing it. A person steers the robot\'s hand through the job while the robot records every move.\n\nThe robot then learns to copy those moves on towels it has never seen. Real robots learn from many such demonstrations, not just one.\n\nThe robot copies everything, including mistakes. A shaky, wandering demonstration teaches shaky, wandering moves. Clean, steady examples teach the robot clean, steady work.',
      note: 'A robot can learn a job by copying recorded demonstrations, so the quality of the examples decides the quality of the robot\'s work.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.L = L;
      const f1 = ['x', s.v & 1 ? -1 : 1], f2 = ['y', s.v & 2 ? -1 : 1], f3 = ['x', s.v & 1 ? -1 : 1];
      const col = i => COLS[(s.v + i) % 4];
      // the towels you demonstrate on, then the new towel the robot folds alone
      if (L === 0) s.demos = [towel(180, 430, 220, 150, col(0), [f1, f2])];
      else if (L === 1) s.demos = [towel(180, 424, 240, 170, col(0), [f1, f2, f3])];
      else s.demos = [towel(180, 428, 200, 150, col(0), [f1, f2]), towel(180, 430, 160, 210, col(1), [f1, f2])];
      const nf = L === 1 ? [f1, f2, f3] : [f1, f2];
      s.robotT = L === 2 ? towel(180, 430, 250, 180, col(2), nf) : towel(180, 430, L === 1 ? 240 : 220, L === 1 ? 170 : 150, col(1), nf);
      s.di = 0; s.T = s.demos[0]; s.G = handle(s.T).slice(); s.rec = []; s.path = null; s.flap = null; s.back = null; s.shaky = false; s.wob = 0; s.pile = 0;
      s.trail = []; newPhase(s, 'demo', 0); s.move = null;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || s.ph !== 'demo' || s.move || s.back) return;
      if (SK.dist(x, y, s.G[0], s.G[1]) > 58) return;
      SK.dragStart(g, null, x, y); s.grabOff = [s.G[0] - x, s.G[1] - y]; s.path = [[0, 0, 0]]; s.t0 = g.t; s.trail = []; g.sfx('click');
    },
    move(g, x, y) {
      const s = g.s; if (!s.path) return; SK.dragMove(g, x, y);
      const T = s.T, F = frame(T), gx = x + s.grabOff[0], gy = y + s.grabOff[1]; let [u, v] = toUV(T, F, gx, gy);
      u = SK.clamp(u * F.sd, -F.half, F.half) * F.sd; v = SK.clamp(v, -70, 70);
      s.flap = [u, v]; s.G = toXY(T, F, u, v); const k = (F.half - u * F.sd) / (2 * F.half);
      s.path.push([g.t - s.t0, k, v / F.half]); s.trail.push([s.G[0], s.G[1], Math.abs(v) > 22]); if (s.trail.length > 60) s.trail.shift();
    },
    up(g) {
      const s = g.s; if (!s.path) return; SK.dragEnd(g); const T = s.T, F = frame(T), p = s.path; s.path = null;
      const k = p[p.length - 1][1];
      if (k < HOLD_K) { s.back = { t: g.t, from: s.flap ? s.flap.slice() : [F.half * F.sd, 0] }; g.sfx('swoosh', { pitch: 0.7 }); s.trail = []; return; }
      // a whole fold: judge how steady it was, record it and lay the flap down flat
      let ss = 0, mx = 0; for (const q of p) { const d = Math.abs(q[2] * F.half); ss += d * d; mx = Math.max(mx, d); } const rms = Math.sqrt(ss / p.length);
      const wob = rms > 13 || mx > 34; if (wob) s.shaky = true;
      s.rec.push({ path: p, fold: T.done }); s.trail = []; applyFold(T); s.flap = null; g.sfx('rustle'); g.sfx(wob ? 'boing' : 'pop', { vol: 0.6 });
      if (wob) g.float('Wobbly!', s.G[0], s.G[1] - 40);
      if (T.done < T.folds.length) { s.move = { t: g.t, from: s.G.slice(), to: handle(T) }; return; }
      // this towel is done: next demo towel, or the robot's turn
      s.di++; if (s.di < s.demos.length) { s.slide = { t: g.t, old: T }; s.T = s.demos[s.di]; s.move = { t: g.t, from: s.G.slice(), to: handle(s.T) }; s.pile++; return; }
      s.slide = { t: g.t, old: T }; s.pile++; s.T = s.robotT; newPhase(s, 'robot', g.t); s.ri = 0; s.rt = 0; s.move = { t: g.t, from: s.G.slice(), to: handle(s.T) }; g.sfx('sweep');
    },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      if (s.back) { const k = SK.clamp((g.t - s.back.t) / 0.25, 0, 1), F = frame(s.T), u0 = F.half * F.sd; s.flap = [SK.lerp(s.back.from[0], u0, k), SK.lerp(s.back.from[1], 0, k)]; s.G = toXY(s.T, F, ...s.flap); if (k >= 1) { s.back = null; s.flap = null; s.G = handle(s.T); } }
      if (s.move) { const k = SK.easeInOut((g.t - s.move.t) / 0.35); s.G = [SK.lerp(s.move.from[0], s.move.to[0], k), SK.lerp(s.move.from[1], s.move.to[1], k)]; if (k >= 1) { s.move = null; if (s.ph === 'robot') s.rt = g.t; } }
      if (s.ph !== 'robot') return;
      g.held += dt; // the fuse stands still while the robot works by itself
      if (s.move) return;
      const T = s.T;
      if (s.ri >= T.folds.length) { // every fold copied: a neat stack, or a lumpy ball
        if (!s.shaky) { if (g.t - s.rt > 0.15) { g.win(); g.sfx('cheer'); g.burst(T.cx, T.cy, ['#ffd45a', '#fff6ea', T.col], 22, 170); } }
        else { T.lump = SK.clamp((g.t - s.rt) / 0.5, 0, 1); if (T.lump >= 1 && g.t - s.rt > 0.8) { g.fail(); g.sfx('laugh'); } }
        return;
      }
      // replay the recorded fold on the new towel, at the same pace, copying every wiggle (bigger towels, bigger wiggles)
      const R = s.rec.filter(r => r.fold === s.ri), rec = R[R.length - 1] || s.rec[0], P0 = rec.path, Tend = Math.max(0.05, P0[P0.length - 1][0]);
      const F = frame(T), tt = (g.t - s.rt) / REPLAY * Tend;
      let q = P0[P0.length - 1]; for (const p of P0) if (p[0] >= tt) { q = p; break; }
      const k = q[1], u = F.half * F.sd * (1 - 2 * k), v = (s.shaky ? 1.5 : 1) * q[2] * F.half; s.flap = [u, SK.clamp(v, -90, 90)]; s.G = toXY(T, F, ...s.flap);
      if (s.shaky && g.rand() < 0.15) g.sfx('rustle', { vol: 0.3 });
      if (tt >= Tend) { applyFold(T); s.flap = null; s.ri++; g.sfx(s.shaky ? 'boing' : 'pop', { vol: 0.6 }); if (s.ri < T.folds.length) s.move = { t: g.t, from: s.G.slice(), to: handle(T) }; else s.rt = g.t; }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('showme_room', paintRoom), 0, 0, 360, 640);
      // finished towels in the basket
      for (let i = 0; i < s.pile; i++) { const col = (s.demos[i] || s.robotT).col; c.fillStyle = col; c.beginPath(); c.roundRect(28, 540 - i * 10, 60, 14, 4); c.fill(); c.strokeStyle = P.shade(col, -0.35); c.lineWidth = 1.5; c.stroke(); }
      // the old towel slides into the basket; the new one slides in from the right
      if (s.slide && t - s.slide.t < 0.35) { const k = SK.easeInOut((t - s.slide.t) / 0.35), o = s.slide.old; c.save(); c.translate(SK.lerp(o.cx, 58, k) - o.cx, SK.lerp(o.cy, 540, k) - o.cy); c.globalAlpha = 1 - k * 0.6; drawTowel(c, o, null); c.restore();
        c.save(); c.translate((1 - k) * 300, 0); drawTowel(c, s.T, s.flap); c.restore(); }
      else drawTowel(c, s.T, s.flap);
      // your hand's trail while you demonstrate: green where steady, red where it wobbles
      for (let i = 1; i < s.trail.length; i++) { const [x0, y0] = s.trail[i - 1], [x1, y1, bad] = s.trail[i]; c.strokeStyle = bad ? 'rgba(255,70,60,0.85)' : 'rgba(120,255,150,0.8)'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
      // the robot arm, pinching the towel's edge
      const spin = lost ? (t - g.doneAt) * 9 : s.ph === 'robot' && s.shaky && s.ri >= s.T.folds.length ? (t - s.rt) * 9 : 0;
      drawArm(c, s.G, !s.move, t, spin);
      // labels and the recording light
      SK.tag(c, 'Robot', 82, 282, 18);
      if (s.ph === 'demo' && s.di === 0 && s.T.done === 0 && !s.path) SK.tag(c, 'Towel', s.T.cx + (frame(s.T).ax === 'x' ? 0 : 60), s.T.cy + (frame(s.T).ax === 'x' ? 44 : 0), 18);
      if (!g.done) { const ph = s.ph === 'demo', blink = 0.5 + 0.5 * Math.sin(t * 6);
        c.save(); c.fillStyle = 'rgba(30,14,36,0.78)'; c.beginPath(); c.roundRect(200, 150, 142, 34, 17); c.fill(); c.fillStyle = ph ? `rgba(255,60,60,${0.5 + 0.5 * blink})` : '#7ef0ff'; c.beginPath(); c.arc(220, 167, 8, 0, 7); c.fill();
        c.font = '900 18px Nunito, system-ui, sans-serif'; c.fillStyle = '#fff6ea'; c.textBaseline = 'middle'; c.fillText(ph ? 'Recording' : 'Robot alone', 234, 168); c.restore();
        if (ph) { const n = s.demos.reduce((a, T) => a + T.folds.length, 0), d = s.demos.reduce((a, T) => a + T.done, 0); N5.slots(c, d, n, 271, 212); }
      }
      // the rabbit watches; cheers when the robot folds it neatly
      SK.animal(c, 'rabbit', 312, 614, 1.0, { t, pose: won ? 'cheer' : lost ? 'sad' : s.ph === 'robot' ? 'point' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
      // guidance: drag the gripper straight across to the far edge of the towel
      if (s.ph === 'demo' && !s.move && !s.back && !g.done && !s.path) { const h = handle(s.T), e = goal(s.T), F = frame(s.T);
        SK.grab(c, g, h[0], h[1], 26); SK.target(c, g, e[0], e[1], 0, F.ax === 'x' ? { w: 30, h: F.hv * 2 + 8 } : { w: F.hv * 2 + 8, h: 30 }); SK.arrow(c, g, h[0], h[1], e[0], e[1], { from: 34, to: 22 });
        SK.demo(g, c, 'drag', h, e); }
    },
    // the bot drags each fold in a straight line, steadily
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.ph !== 'demo' || s.move || s.back) return;
      const n = s.demos.slice(0, s.di).reduce((a, T) => a + T.folds.length, 0) + s.T.done; s.nb = s.nb || {};
      if (s.nb[n] == null) s.nb[n] = g.t + (n ? 0.25 : 0.9);
      const h = handle(s.T), e = goal(s.T);
      if (typeof window !== 'undefined' && window.N5FAIL) { // a shaky, wandering drag (for checking the fail)
        const B = s._wb = s._wb || {}; if (g.t < s.nb[n]) return; const k = SK.clamp((g.t - s.nb[n]) / 0.9, 0, 1), F = frame(s.T), w = Math.sin(k * 30) * 40;
        const [x, y] = toXY(s.T, F, SK.lerp(F.half * F.sd, -F.half * F.sd, k), w);
        if (!B[n]) { B[n] = 1; synth('down', h[0], h[1]); } else synth('move', x, y); if (k >= 1 && B[n] === 1) { B[n] = 2; synth('up', x, y); } return; }
      SK.bot.drag(g, synth, 'fold' + n, s.nb[n], h, e, 0.6);
    },
  });
})();
