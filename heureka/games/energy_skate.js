// SKATE! (physics PMS-14) — a skate park at sunset: a half-pipe with a ledge at the top of the far side, and a pond just
// past the ledge. Drag the rabbit up the near ramp and let go. She speeds up on the way down and rises on the far side to
// exactly the height she started from: height energy turns into speed and back. Start below the ledge and she stops
// just short and rolls back; start a little above it and she rolls onto the ledge and stops; start far too high and she
// zooms across the ledge and into the pond. Two or three ledges, each at a new height. Level 2: a rough patch at the
// bottom steals a little height on every pass, so start a bit higher.
(() => {
  const G = 900, BOT = 520, LX = [20, 120], RX = [190, 270], LEDGE = 50, TOPL = 200;
  const ROUNDS = [[[380, 320], [330, 380], [360, 300], [310, 350]], [[360, 300, 336], [300, 350, 320], [330, 290, 360], [350, 320, 296]], [[350, 296, 326], [300, 340, 290], [330, 300, 350], [296, 330, 310]]], MU = [900, 720, 720], ROUGH = 16;
  function trackY(x, rim) {
    if (x <= LX[1]) return BOT - (BOT - TOPL) * Math.pow((LX[1] - x) / (LX[1] - LX[0]), 2);
    if (x <= RX[0]) return BOT; if (x <= RX[1]) return BOT - (BOT - rim) * Math.pow((x - RX[0]) / (RX[1] - RX[0]), 2); return rim;
  }
  function build(rim) { const pts = []; let s = 0, px = LX[0], py = trackY(LX[0], rim); for (let x = LX[0]; x <= RX[1] + LEDGE + 0.01; x += 1) { const y = trackY(x, rim); s += Math.hypot(x - px, y - py); pts.push({ x, y, s }); px = x; py = y; } return pts; }
  function at(T, s) { // position and slope angle at arc length s
    let lo = 0, hi = T.length - 1; s = SK.clamp(s, 0, T[hi].s); while (hi - lo > 1) { const m = (lo + hi) >> 1; if (T[m].s < s) lo = m; else hi = m; }
    const a = T[lo], b = T[hi], k = (s - a.s) / Math.max(1e-6, b.s - a.s); return { x: SK.lerp(a.x, b.x, k), y: SK.lerp(a.y, b.y, k), ang: Math.atan2(b.y - a.y, b.x - a.x) };
  }
  function sOfX(T, x) { for (const p of T) if (p.x >= x) return p.s; return T[T.length - 1].s; }
  function paintPark(o) {
    const sky = o.createLinearGradient(0, 0, 0, 560); sky.addColorStop(0, '#5a4a9a'); sky.addColorStop(0.5, '#f28a6a'); sky.addColorStop(1, '#ffd89a'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    o.fillStyle = '#ffe8a8'; o.beginPath(); o.arc(250, 250, 40, 0, 7); o.fill();
    P.hills(o, 360, 470, 50, '#c86a7a', '#9a4a6a', { seed: 5 });
    o.fillStyle = '#4a8a5a'; o.fillRect(0, 540, 360, 100);
    // the pond past the ledge
    const pw = o.createLinearGradient(0, 548, 0, 640); pw.addColorStop(0, '#4ab0d8'); pw.addColorStop(1, '#1a6a9a'); o.fillStyle = pw; o.beginPath(); o.ellipse(352, 590, 60, 40, 0, 0, 7); o.fill();
    o.fillStyle = '#3a7a4a'; for (let i = 0; i < 5; i++) { o.beginPath(); o.ellipse(300 + i * 14, 556 - (i % 2) * 6, 3, 14, 0.2 * (i - 2), 0, 7); o.fill(); }
  }
  function paintPipe(o, rim) {
    const T = build(rim);
    o.fillStyle = '#b8b0c8'; o.beginPath(); o.moveTo(0, TOPL); for (const p of T) o.lineTo(p.x, p.y); o.lineTo(RX[1] + LEDGE, 560); o.lineTo(0, 560); o.closePath(); o.fill();
    o.fillStyle = 'rgba(80,60,100,0.2)'; o.fillRect(RX[1] - 4, rim, LEDGE + 4, 560 - rim);
    o.strokeStyle = '#6a6080'; o.lineWidth = 5; o.beginPath(); for (const p of T) o.lineTo(p.x, p.y); o.stroke();
    o.strokeStyle = '#e8e0f0'; o.lineWidth = 2; o.beginPath(); for (const p of T) o.lineTo(p.x, p.y + 4); o.stroke();
    o.fillStyle = '#8a8098'; o.fillRect(0, TOPL - 6, 22, 8); o.fillStyle = '#d8503a'; o.fillRect(RX[1], rim - 4, LEDGE, 6); // the ledge's lip
    o.fillStyle = '#5a4a6a'; o.fillRect(RX[1] + LEDGE - 6, rim - 30, 4, 30); o.fillStyle = '#ffd45a'; o.beginPath(); o.moveTo(RX[1] + LEDGE - 2, rim - 30); o.lineTo(RX[1] + LEDGE + 18, rim - 24); o.lineTo(RX[1] + LEDGE - 2, rim - 18); o.fill(); // a flag on the ledge
  }
  MG.add({
    id: 'energy_skate', stage: 'energy', cmd: 'SKATE ONTO THE LEDGE!', time: 7, mood: 'night', winText: 'Back to the same height!', failText: 'Not on the ledge!',
    card: { title: 'Height turns into speed', kind: 'Physics', ref: 'Conservation of energy',
      text: 'High up, the skater has energy stored by her height. Rolling down, that energy turns into speed. Rolling up the other side, the speed turns back into height, so she rises to almost exactly the height she started from.\n\nStart lower than the ledge and she can never reach it. Start a little higher and she arrives with just a little speed left. Start much higher and the extra energy carries her right off the end. Rough ground turns some energy into heat, so she rises a little less each time.',
      note: 'Energy changes form, from height to speed and back, but the total stays the same.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.rims = ROUNDS[lv][SK.variant(g, 4)]; s.mu = MU[lv]; s.rough = lv >= 2; s.round = 0;
      s.T = build(s.rims[0]); s.sk = { s: sOfX(s.T, 150), dir: 1, Y0: BOT, st: 'rest' }; s.doneT = 0; s.fall = null; s.splash = -9;
    },
    down(g, x, y) {
      const s = g.s, k = s.sk; SK.touched(g); if (g.done || k.st === 'won' || k.st === 'fall') return; const p = at(s.T, k.s);
      if (SK.dist(x, y, p.x, p.y - 20) < 60 || x < LX[1] + 20) { k.st = 'drag'; this.move(g, x, y); g.sfx('tap'); }
    },
    move(g, x, y) {
      const s = g.s, k = s.sk; if (k.st !== 'drag') return;
      // follow the finger along the near ramp: pick the point on it nearest the finger
      let best = null, bd = 1e9; for (const p of s.T) { if (p.x > LX[1] + 30) break; const d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bd) { bd = d; best = p; } }
      if (best) k.s = Math.max(best.s, 6);
    },
    up(g) { const s = g.s, k = s.sk; if (k.st !== 'drag') return; s.relY = at(s.T, k.s).y; k.st = 'roll'; k.dir = 1; k.Y0 = at(s.T, k.s).y; k.crossed = false; g.sfx('swoosh'); },
    update(g, dt) {
      const s = g.s, k = s.sk, rim = s.rims[s.round], end = s.T[s.T.length - 1].s, sRim = sOfX(s.T, RX[1]);
      if (k.st === 'roll') {
        for (let i = 0; i < 6; i++) {
          const h = dt / 6, p = at(s.T, k.s), v = Math.sqrt(Math.max(0, 2 * G * (p.y - k.Y0)));
          if (k.s > sRim) k.Y0 = Math.min(rim, k.Y0 + s.mu / G * v * h); // friction on the ledge eats the leftover energy
          if (s.rough && p.x > RX[0] - 50 && p.x < RX[0] - 10) { if (!k.inR) { k.inR = true; k.Y0 += ROUGH; g.sfx('crunch'); } } else k.inR = false;
          const v2 = Math.sqrt(Math.max(0, 2 * G * (at(s.T, k.s).y - k.Y0)));
          if (v2 < 6) { // a turning point (or, on the ledge, a stop)
            if (k.s > sRim) { k.st = 'won'; s.doneT = g.t; g.sfx('ding'); g.burst(p.x, p.y - 20, ['#ffd45a', '#fff6ea', '#ff8a5a'], 16, 160); break; }
            k.dir = at(s.T, k.s + k.dir * 2).y < p.y ? -k.dir : k.dir; k.s += k.dir * 2; continue;
          }
          k.s += k.dir * v2 * h;
          if (k.s >= end) { k.st = 'fall'; const q = at(s.T, end); s.fall = { x: q.x, y: q.y, vx: v2, vy: -60 }; g.sfx('whoosh'); break; }
          if (k.s < 2) { k.s = 2; k.dir = 1; }
        }
      }
      if (k.st === 'fall') { const f = s.fall; f.vy += G * dt; f.x += f.vx * dt; f.y += f.vy * dt; if (f.y > 590 && s.splash < 0) { s.splash = g.t; g.sfx('splash'); g.burst(f.x, 584, ['#9ad8ff', '#fff'], 18, 200); } if (s.splash > 0 && g.t - s.splash > 0.8) { k.st = 'rest'; k.s = sOfX(s.T, 150); s.fall = null; s.splash = -9; } }
      if (k.st === 'won' && g.t - s.doneT > 0.7) {
        if (s.round + 1 >= s.rims.length) { if (!g.done) { g.win(); g.sfx('cheer'); } }
        else { s.round++; s.T = build(s.rims[s.round]); k.st = 'rest'; k.s = sOfX(s.T, 150); g.sfx('pop'); }
      }
    },
    draw(g, c) {
      const s = g.s, k = s.sk, t = g.t, rim = s.rims[s.round];
      c.drawImage(g.bake('skate_park', paintPark), 0, 0, 360, 640);
      c.drawImage(g.bake('skate_pipe' + rim, o => paintPipe(o, rim)), 0, 0, 360, 640);
      if (s.rough) { c.fillStyle = '#8a6a4a'; c.fillRect(RX[0] - 50, BOT - 3, 40, 7); c.fillStyle = '#5a4030'; for (let i = 0; i < 16; i++) { c.beginPath(); c.arc(RX[0] - 48 + i * 2.5, BOT - 3 - (i % 3) * 1.5, 2.4, 0, 7); c.fill(); } }
      // a dotted guide at the ledge's height across the park, levels 0 and 1
      if (g.level < 2 && !g.done) { c.save(); c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 2; c.setLineDash([4, 8]); c.beginPath(); c.moveTo(14, rim); c.lineTo(RX[1], rim); c.stroke(); c.restore(); }
      if (s.relY && k.st !== 'rest') { c.save(); c.strokeStyle = 'rgba(255,240,120,0.8)'; c.lineWidth = 3; c.setLineDash([3, 6]); c.beginPath(); c.moveTo(14, s.relY); c.lineTo(RX[1] + LEDGE, s.relY); c.stroke(); c.restore(); c.fillStyle = '#ffe27a'; c.beginPath(); c.arc(at(s.T, 0).x + 8, s.relY, 5, 0, 7); c.fill(); } // where you let her go
      // the skater on her board
      let p = k.st === 'fall' ? { x: s.fall.x, y: s.fall.y, ang: Math.atan2(s.fall.vy, s.fall.vx) * 0.5 } : at(s.T, k.s);
      if (k.st === 'drag') { c.save(); c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 2; c.setLineDash([4, 6]); c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(360, p.y); c.stroke(); c.restore(); }
      if (!(k.st === 'fall' && s.splash > 0)) {
        c.save(); c.translate(p.x, p.y); c.rotate(p.ang);
        c.fillStyle = '#3a2a4a'; c.beginPath(); c.roundRect(-24, -10, 48, 7, 3); c.fill(); c.fillStyle = '#ffd45a'; for (const wx of [-15, 15]) { c.beginPath(); c.arc(wx, -2, 4.5, 0, 7); c.fill(); }
        SK.animal(c, 'rabbit', 0, -10, 0.85, { t, pose: k.st === 'won' ? 'cheer' : k.st === 'roll' ? 'balance' : 'idle', expr: k.st === 'fall' ? 'wow' : k.st === 'won' ? 'laugh' : 'happy', facing: k.dir });
        c.restore();
      } else { const q = (t - s.splash) / 0.8; SK.animal(c, 'rabbit', s.fall.x - 8, 600 - Math.sin(q * Math.PI) * 10, 0.5, { t, pose: 'sad', expr: 'wow' }); }
      SK.tag(c, 'Ledge', RX[1] + LEDGE / 2 - 4, rim + 26, 18);
      // the start heights that end on the ledge: a green stretch of the near ramp (a little above the ledge, not too far);
      // while you drag, an arrow on the rabbit says higher, lower, or a tick when she is in it
      if (k.st === 'rest' || k.st === 'drag') {
        const yHi = rim - 4 - (s.rough ? ROUGH : 0), yTop = rim - LEDGE * s.mu / G + 6 - (s.rough ? ROUGH : 0);
        c.save(); c.strokeStyle = 'rgba(90,216,122,0.85)'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); let on = false;
        for (const pt of s.T) { if (pt.x > LX[1] + 30) break; const inb = pt.y <= yHi && pt.y >= yTop; if (inb) { on ? c.lineTo(pt.x, pt.y) : c.moveTo(pt.x, pt.y); on = true; } else on = false; } c.stroke(); c.restore();
        if (k.st === 'drag') { const py = at(s.T, k.s).y, pp = at(s.T, k.s); G2.dir(c, pp.x + 34, pp.y - 40, py > yHi ? 1 : py < yTop ? -1 : 0); }
      }
      // the rounds still to go: little flags along the top
      for (let i = 0; i < s.rims.length; i++) { c.fillStyle = i < s.round || (i === s.round && k.st === 'won') ? '#ffd45a' : 'rgba(255,255,255,0.35)'; c.beginPath(); c.arc(180 + (i - (s.rims.length - 1) / 2) * 22, 140, 7, 0, 7); c.fill(); }
      const want = rim - 18 - (s.rough ? ROUGH : 0), tx = LX[1] - (LX[1] - LX[0]) * Math.sqrt((BOT - want) / (BOT - TOPL)), q = at(s.T, k.s);
      if (k.st === 'rest') { const tY = trackY(tx, rim); SK.grab(c, g, q.x, q.y - 22, 30); SK.target(c, g, tx + 6, tY - 18, 24); SK.arrow(c, g, q.x, q.y - 22, tx + 6, tY - 18, { from: 40, to: 34 }); }
      SK.demo(g, c, 'drag', [q.x, q.y - 18], [tx + 8, trackY(tx, rim) - 14], { period: 2.2, never: k.st === 'won' || k.st === 'fall' || k.st === 'drag' });
    },
    // the bot: carry her up to a little above the ledge's height (more at level 2, for the rough patch) and let go
    auto(g, dt, synth) {
      const s = g.s, k = s.sk; if (g.done || k.st !== 'rest' && k.st !== 'drag') return; const rim = s.rims[s.round], want = rim - 18 - (s.rough ? ROUGH : 0);
      const x = LX[1] - (LX[1] - LX[0]) * Math.sqrt((BOT - want) / (BOT - TOPL)), y = trackY(x, rim), q = at(s.T, k.s);
      SK.bot.drag(g, synth, 'r' + s.round, Math.max(1.0, s.doneT + 0.9), [q.x, q.y - 20], [x, y - 2], 0.5);
    },
  });
})();
