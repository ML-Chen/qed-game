// MOUNT! (chem_bio FP-06) — a little house cut open at night: a hedgehog asleep in the upstairs bedroom, and a
// forgotten toaster smoking in the kitchen downstairs. Drag each smoke alarm from the tray and stick it on the ceiling
// of a room. Hot smoke rises: it rolls along the ceilings first, out of the kitchen, up the stairs and along the
// upstairs hall, and only then sinks down. An alarm on a ceiling beeps as soon as the first smoke touches it, so the
// hedgehog wakes in time and hurries out. Stuck low on a wall, it stays quiet until the smoke is thick, while the
// hedgehog snores. Level 0: alarms for the bedroom and the upstairs hall; level 1: plus the downstairs hall;
// level 2: three alarms, and each must be tested (tap its button) once it is up.
(() => {
  const ROOF = 156, UP = [160, 306], DN = [318, 466], WALLS = [14, 346], MID = 172;
  function rooms(m) { // B bedroom, U upstairs hall, K kitchen, D downstairs hall; m mirrors the house
    const X = (a, b) => m ? [360 - b, 360 - a] : [a, b];
    return { B: { x: X(WALLS[0], MID), y: UP, name: 'Bedroom' }, U: { x: X(MID + 6, WALLS[1]), y: UP, name: 'Hall' }, K: { x: X(WALLS[0], MID), y: DN, name: 'Kitchen' }, D: { x: X(MID + 6, WALLS[1]), y: DN, name: 'Hall' } };
  }
  const START = { K: 0, D: 2.2, U: 3.6, B: 6.4 }, RATE = 8.5;
  function paintBg(o, m) {
    const R = rooms(m), sk = o.createLinearGradient(0, 0, 0, 640); sk.addColorStop(0, '#1a1438'); sk.addColorStop(0.6, '#3a2a5a'); sk.addColorStop(1, '#2a1a30'); o.fillStyle = sk; o.fillRect(0, 0, 360, 640);
    P.stars(o, 360, 300, 50, 8, 0);
    o.fillStyle = '#fff4d0'; o.beginPath(); o.arc(m ? 300 : 60, 60, 18, 0, 7); o.fill();
    // ground and garden
    const gg = o.createLinearGradient(0, 466, 0, 640); gg.addColorStop(0, '#2a4a30'); gg.addColorStop(1, '#1a2a20'); o.fillStyle = gg; o.fillRect(0, 466, 360, 174);
    // the roof
    o.fillStyle = '#7a3a3a'; o.strokeStyle = '#3a1820'; o.lineWidth = 3; o.beginPath(); o.moveTo(4, ROOF + 4); o.lineTo(180, ROOF - 52); o.lineTo(356, ROOF + 4); o.closePath(); o.fill(); o.stroke();
    // walls and floors of the cut-open house
    o.fillStyle = '#5a3a2a'; o.fillRect(6, ROOF, 348, DN[1] - ROOF + 8);
    const wallp = { B: '#f4d8c8', U: '#e8e0c0', K: '#d8ecd8', D: '#e8e0c0' };
    for (const k in R) { const r = R[k]; o.fillStyle = wallp[k]; o.fillRect(r.x[0], r.y[0], r.x[1] - r.x[0], r.y[1] - r.y[0]);
      o.fillStyle = 'rgba(0,0,0,0.05)'; for (let x = r.x[0] + 8; x < r.x[1]; x += 16) o.fillRect(x, r.y[0], 6, r.y[1] - r.y[0]);
      o.fillStyle = '#a8784a'; o.fillRect(r.x[0], r.y[1] - 8, r.x[1] - r.x[0], 8); }
    // doorways between the rooms (tall gaps in the inner walls, open at the top part too so smoke rolls through)
    const dx = m ? 360 - MID - 3 : MID + 3; o.fillStyle = '#e8e0c0';
    o.fillRect(dx - 4, UP[0] + 40, 8, UP[1] - UP[0] - 48); o.fillRect(dx - 4, DN[0] + 40, 8, DN[1] - DN[0] - 48);
    // the stairs in the downstairs hall, up through a gap in the floor
    const D = R.D, sx0 = m ? D.x[0] + 20 : D.x[1] - 20, sd = m ? 1 : -1;
    o.fillStyle = '#a8784a'; for (let i = 0; i < 9; i++) o.fillRect(sx0 + sd * i * 13 - (m ? 0 : 13), DN[1] - 8 - (i + 1) * 15, 13, (i + 1) * 15);
    o.fillStyle = R.U.x ? '#e8e0c0' : '#fff'; const gx = m ? D.x[0] + 14 : D.x[1] - 130; o.fillRect(gx, UP[1] - 8, 116, 20);
    // furniture: bed, chest of drawers, kitchen counter, a picture and a lamp
    const B = R.B, bx = m ? B.x[1] - 116 : B.x[0] + 12; o.fillStyle = '#8a5a3a'; o.fillRect(bx, UP[1] - 44, 104, 36); o.fillStyle = '#6a8ad8'; o.fillRect(bx + 4, UP[1] - 52, 96, 16); o.fillStyle = '#fff'; o.beginPath(); o.ellipse(m ? bx + 88 : bx + 16, UP[1] - 54, 14, 8, 0, 0, 7); o.fill();
    const K = R.K, kx = m ? K.x[0] + 8 : K.x[1] - 98; o.fillStyle = '#c8a878'; o.fillRect(kx, DN[1] - 50, 90, 42); o.fillStyle = '#8a6a4a'; o.fillRect(kx - 2, DN[1] - 54, 94, 6);
    o.fillStyle = '#6a8a6a'; o.fillRect((R.U.x[0] + R.U.x[1]) / 2 - 14, UP[0] + 40, 28, 22);
  }
  function toaster(c, x, y, t) { c.fillStyle = '#c8ccd8'; c.strokeStyle = '#4a4a5a'; c.lineWidth = 2; c.beginPath(); c.roundRect(x - 20, y - 26, 40, 26, 7); c.fill(); c.stroke(); c.fillStyle = '#2a2a30'; c.fillRect(x - 12, y - 28, 8, 4); c.fillRect(x + 4, y - 28, 8, 4); c.fillStyle = `rgba(255,120,40,${0.5 + 0.3 * Math.sin(t * 9)})`; c.fillRect(x - 12, y - 27, 8, 2); c.fillRect(x + 4, y - 27, 8, 2); }
  function alarm(c, x, y, t, beep, tested, onCeil) {
    c.save(); c.translate(x, y);
    if (beep) { c.strokeStyle = `rgba(255,80,60,${0.6 + 0.4 * Math.sin(t * 20)})`; c.lineWidth = 3; for (let i = 1; i <= 2; i++) { c.beginPath(); c.arc(0, onCeil ? 4 : 0, 18 + i * 9 + ((t * 30) % 9), onCeil ? 0.15 : 0, onCeil ? Math.PI - 0.15 : 7); c.stroke(); } }
    c.fillStyle = '#f8f8fa'; c.strokeStyle = '#5a5a6a'; c.lineWidth = 2.5; c.beginPath(); c.ellipse(0, 0, 18, onCeil ? 9 : 18, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#d8d8e0'; c.beginPath(); c.ellipse(0, onCeil ? 2 : 0, 8, onCeil ? 4 : 8, 0, 0, 7); c.fill();
    c.fillStyle = beep && Math.sin(t * 20) > 0 ? '#ff3a3a' : tested ? '#5ad07a' : '#8a2a2a'; c.beginPath(); c.arc(10, onCeil ? -2 : -8, 2.5, 0, 7); c.fill();
    c.restore();
  }
  MG.add({
    id: 'mount', stage: 'fire', cmd: 'STICK AN ALARM ON EACH CEILING!', cmdAt: [null, null, 'CEILING ALARMS, THEN TEST THEM!'], time: 7, mood: 'night', winText: 'Beep! The hedgehog woke in time!', failText: 'Still snoring!',
    card: { title: 'Smoke goes up first', kind: 'Safety', ref: 'Smoke alarm placement',
      text: 'Smoke from a fire is hot, and hot air rises. So the smoke goes up first, spreads out along the ceiling, and only fills the room downward once the ceiling is full.\n\nA smoke alarm high up, on the ceiling, meets the very first smoke and beeps early, while there is still time to get out. Low on a wall, the smoke reaches it much later.\n\nHomes should have alarms on every floor, outside the bedrooms and inside them. Press the test button once a month to check each one still beeps.',
      note: 'Smoke rises and spreads along the ceiling first, so smoke alarms go high up, where they warn you soonest.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.lv = lv; s.v = SK.variant(g, 4); s.m = s.v % 2 === 1; s.R = rooms(s.m);
      s.need = lv === 0 ? ['B', 'U'] : ['B', 'U', 'D']; if (s.v >= 2) s.need.reverse();
      s.al = s.need.map((k, i) => ({ x: 180 + (i - (s.need.length - 1) / 2) * 70, y: 560, home: [180 + (i - (s.need.length - 1) / 2) * 70, 560], room: null, ceil: false, tested: !(lv >= 2), beep: 0 }));
      s.clock = 0; s.ff = 1; s.wake = 0; s.snoreT = 0; s.cough = -9; s.testT = -9;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || s.wake) return;
      // level 2: tap a mounted alarm's button to test it
      const m = s.al.find(a => a.room && a.ceil && !a.tested && SK.dist(a.x, a.y, x, y) < 30); if (m) { m.tested = true; s.testT = g.t; m.testT = g.t; g.sfx('bell'); g.sfx('ding'); return; }
      const a = SK.pick(s.al, x, y, 40); if (a) { a.room = null; a.ceil = false; SK.dragStart(g, a, x, y); g.sfx('pop'); }
    },
    move(g, x, y) { SK.dragMove(g, x, y); const a = SK.dragging(g); if (a) { a.x = SK.clamp(a.x, 24, 336); a.y = SK.clamp(a.y, UP[0] + 8, 600); } },
    up(g) {
      const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const a = d.obj;
      const k = Object.keys(s.R).find(k => { const r = s.R[k]; return a.x > r.x[0] && a.x < r.x[1] && a.y > r.y[0] - 10 && a.y < r.y[1]; });
      if (!k) { a.x = a.home[0]; a.y = a.home[1]; return; }
      const r = s.R[k]; a.room = k;
      if (a.y - r.y[0] < 40) { a.ceil = true; a.y = r.y[0] + 9; a.x = SK.clamp(a.x, r.x[0] + 26, r.x[1] - 26); g.sfx('click'); g.sfx('thud'); } // stuck on the ceiling
      else { a.ceil = false; a.x = SK.clamp(a.x, r.x[0] + 20, r.x[1] - 20); a.y = Math.min(a.y, r.y[1] - 30); g.sfx('click'); } // stuck on the wall, low down
    },
    update(g, dt) {
      const s = g.s, t = g.t;
      // everything is up (and tested): the smoke's story plays out fast
      const ready = s.need.every(k => s.al.some(a => a.room === k && a.ceil)) && s.al.every(a => a.tested);
      if (ready && s.ff === 1 && !g.done) { s.ff = 3.5; }
      s.clock += dt * s.ff;
      for (const a of s.al) { if (!a.room || SK.dragging(g) === a) { a.beep = 0; continue; } const r = s.R[a.room], depth = (s.clock - START[a.room]) * RATE; if (depth >= a.y - r.y[0] + 2 && !a.beep) { a.beep = t; g.sfx('bell'); } }
      if (!g.done && !s.wake && ready && s.al.some(a => a.beep)) { s.wake = t; g.sfx('boing'); }
      if (s.wake && !g.done && t - s.wake > 0.5) { g.win(); g.sfx('cheer'); }
      // the smoke reaches the sleeping hedgehog before anything beeps
      const bedDepth = (s.clock - START.B) * RATE; if (!g.done && !s.wake && bedDepth > UP[1] - UP[0] - 64) { if (!s.al.some(a => a.beep)) { g.fail(); g.sfx('fail'); } else if (!ready) { g.fail(); g.sfx('fail'); } }
      if (t - s.cough > 1.2 && bedDepth > 40 && !s.wake) { s.cough = t; }
    },
    draw(g, c) {
      const s = g.s, t = g.t, R = s.R, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('mount_bg' + (s.m ? 1 : 0), o => paintBg(o, s.m)), 0, 0, 360, 640);
      // the toaster smoking on the kitchen counter, its plume rising to the ceiling
      const K = R.K, kx = s.m ? K.x[0] + 52 : K.x[1] - 52; toaster(c, kx, DN[1] - 54, t);
      for (let i = 0; i < 6; i++) { const q = ((t * 0.7 + i / 6) % 1); c.fillStyle = `rgba(110,110,120,${0.5 * (1 - q)})`; c.beginPath(); c.arc(kx + Math.sin(q * 6 + i) * 8, DN[1] - 80 - q * (DN[1] - DN[0] - 90), 8 + q * 14, 0, 7); c.fill(); }
      // the hedgehog in bed: asleep, or awake and hurrying out
      const B = R.B, hx = s.m ? B.x[1] - 40 : B.x[0] + 40;
      if (!s.wake) { const lx = s.m ? B.x[1] - 104 : B.x[0] + 24; c.save(); c.translate(lx, UP[1] - 58); c.rotate(s.m ? -1.45 : 1.45); SK.animal(c, 'hedgehog', 0, 0, 0.66, { t: t * 0.4, expr: lost ? 'sad' : 'laugh', pose: 'idle', facing: s.m ? 1 : -1, noShadow: true }); c.restore();
        c.fillStyle = '#5a7ad0'; c.beginPath(); c.roundRect(s.m ? B.x[1] - 104 - 50 : B.x[0] + 54, UP[1] - 62, 52, 20, 6); c.fill();
        c.save(); c.font = '900 18px Nunito, system-ui, sans-serif'; c.fillStyle = '#5a4a8a'; for (let i = 0; i < 3; i++) { const q = (t * 0.5 + i / 3) % 1; c.globalAlpha = 1 - q; c.fillText('z', (s.m ? B.x[1] - 60 : B.x[0] + 60) + q * 14, UP[1] - 84 - q * 30); } c.restore(); }
      else { const k = SK.clamp((t - s.wake) / 0.8, 0, 1), dir = s.m ? -1 : 1; SK.animal(c, 'hedgehog', hx + dir * k * 60, UP[1] - 8, 0.7, { t, expr: 'wow', pose: won ? 'cheer' : 'walk', facing: dir }); }
      // the smoke: a grey layer under each ceiling, thickening downward
      for (const k in R) { const r = R[k], d = Math.max(0, Math.min(r.y[1] - r.y[0], (s.clock - START[k]) * RATE)); if (d <= 0) continue;
        c.save(); c.beginPath(); c.rect(r.x[0], r.y[0], r.x[1] - r.x[0], r.y[1] - r.y[0]); c.clip();
        const sg = c.createLinearGradient(0, r.y[0], 0, r.y[0] + d + 10); sg.addColorStop(0, 'rgba(70,66,76,0.85)'); sg.addColorStop(0.8, 'rgba(110,106,116,0.6)'); sg.addColorStop(1, 'rgba(120,116,126,0)'); c.fillStyle = sg;
        c.beginPath(); c.moveTo(r.x[0], r.y[0]); c.lineTo(r.x[1], r.y[0]); for (let x = r.x[1]; x >= r.x[0]; x -= 10) c.lineTo(x, r.y[0] + d + Math.sin(x * 0.08 + t * 2) * 5); c.closePath(); c.fill(); c.restore(); }
      // what to put up: alarms waiting in the tray, and the ceilings that need one
      c.fillStyle = 'rgba(255,255,255,0.12)'; c.beginPath(); c.roundRect(60, 530, 240, 60, 18); c.fill();
      for (const a of s.al) alarm(c, a.x, a.y, t, a.beep && a.room, a.tested && a.room && s.lv >= 2, a.ceil);
      for (const a of s.al) if (s.lv >= 2 && a.ceil && !a.tested && !g.done) { SK.tag(c, 'Test', a.x, a.y + 34, 18, '#fff6ea', 'rgba(190,40,40,0.9)'); SK.glow(c, g, a.x, a.y, 26, '#ffe27a', { level: 2 }); }
      if (!g.done) { const anyHome = s.al.find(a => !a.room); if (anyHome) SK.tag(c, 'Smoke alarms', 180, 606, 18); }
      const smk = Object.keys(R).find(k => (s.clock - START[k]) * RATE > 24); if (smk && !g.done) { const r = R[smk]; SK.tag(c, 'Smoke', (r.x[0] + r.x[1]) / 2, r.y[0] + 26, 18, '#fff6ea', 'rgba(60,56,66,0.9)'); }
      SK.animal(c, 'fox', s.m ? 330 : 30, 520, 0.7, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'think', facing: s.m ? -1 : 1 });
      // guidance: carry the next alarm up to the ceiling of a room that still needs one (then, at level 2, test it)
      if (g.done || s.wake) return;
      const free = s.need.filter(k => !s.al.some(a => a.room === k && a.ceil)), good = a => a.ceil && s.need.includes(a.room) && s.al.find(b => b.room === a.room && b.ceil) === a, a = s.al.find(a => !good(a));
      if (free.length && a && !SK.dragging(g)) { const r = R[free[0]], tx = (r.x[0] + r.x[1]) / 2 + (free[0] === 'U' || free[0] === 'D' ? 0 : 0), ty = r.y[0] + 12;
        SK.grab(c, g, a.x, a.y, 26); SK.target(c, g, tx, ty + 6, 0, { w: 96, h: 30 }); SK.arrow(c, g, a.x, a.y, tx, ty + 6, { from: 34, to: 30 });
        SK.demo(g, c, 'drag', [a.x, a.y], [tx, ty]); return; }
      const nt = s.al.find(a => a.ceil && !a.tested); SK.demo(g, c, 'tap', nt ? [nt.x, nt.y + 4] : [180, 300], null, { never: !nt });
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 0.7 || s.wake) return; const B = s._mb = s._mb || { n: 0, at: 0 };
      if (B.cur) { if (SK.bot.drag(g, synth, 'm' + B.n, B.cur.t0, B.cur.a, B.cur.b, 0.4)) { B.n++; B.cur = null; B.at = g.t + 0.12; } return; }
      if (g.t < B.at) return;
      const free = s.need.filter(k => !s.al.some(a => a.room === k && a.ceil));
      if (free.length) { const good = a => a.ceil && s.need.includes(a.room) && s.al.find(b => b.room === a.room && b.ceil) === a, a = s.al.find(a => !good(a)), r = s.R[free[0]]; if (a) B.cur = { t0: g.t, a: [a.x, a.y], b: [(r.x[0] + r.x[1]) / 2, r.y[0] + 12] }; return; }
      const nt = s.al.find(a => a.ceil && !a.tested); if (nt) { synth('down', nt.x, nt.y); synth('up', nt.x, nt.y); B.at = g.t + 0.3; }
    },
  });
})();
