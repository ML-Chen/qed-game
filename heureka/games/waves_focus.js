// FOCUS! (physics AP2-26) — a little cinema. At the top, the big screen the audience sees; below, the projector on its
// bench, seen from the side: a lamp, a slide of a frog (upside down, as in real projectors), a glass lens that slides
// along a rail, and the screen at the far end. Slide the lens until the picture on the screen snaps sharp. Rays from the
// top of the frog spread out, pass through the lens and bend back together to a point; the picture is sharp only when
// that point lands right on the screen. Too far either way and the rays meet in front of or behind it: a blur.
// Between pictures the frog swaps in a fatter or thinner lens (and moves the screen a little), so the sharp spot moves. Two pictures at level 0, three at level 1;
// at level 2 the screen keeps creeping while you focus.
(() => {
  const BY = 500, SX = 58, AP = 15, LMIN = SX + 20, LMAX = 300, SCR = { x: 34, y: 136, w: 292, h: 196 };
  // where the lens brings the slide's light to a point (px from the lens), or null if it cannot (slide inside the focal length)
  const imgDist = (L, F) => { const d = L - SX; return d > F + 0.5 ? F * d / (d - F) : null; };
  function blurOf(L, ws, F) { const di = imgDist(L, F); if (!di) return 40; return Math.min(40, AP * Math.abs(ws - (L + di)) / di); }
  function sharpL(ws, F) { const D = ws - SX, q = D * D - 4 * F * D; if (q < 0) return [SX + D / 2]; const r = Math.sqrt(q); return [SX + (D - r) / 2, SX + (D + r) / 2].filter(L => L >= LMIN && L <= Math.min(LMAX, ws - 16)); }
  function paintHall(o) {
    N1.vgrad(o, 0, 0, 360, 640, ['#2a1030', '#3a1838', '#1a0c20']);
    // curtains around the screen
    for (const sd of [-1, 1]) { const x0 = sd < 0 ? 0 : 330; const cg = o.createLinearGradient(x0, 0, x0 + 30, 0); cg.addColorStop(0, '#8a1a2a'); cg.addColorStop(0.5, '#c83a4a'); cg.addColorStop(1, '#7a1424'); o.fillStyle = cg; o.fillRect(x0, 100, 30, 280); for (let i = 0; i < 4; i++) { o.fillStyle = 'rgba(40,0,10,0.25)'; o.fillRect(x0 + 4 + i * 7, 100, 2, 280); } }
    o.fillStyle = '#a82a3a'; o.fillRect(0, 100, 360, 26); o.fillStyle = '#d8a040'; o.fillRect(0, 124, 360, 4);
    // the seats' backs
    for (let i = 0; i < 7; i++) { o.fillStyle = '#5a1a2a'; o.beginPath(); o.roundRect(6 + i * 50, 352, 44, 40, 10); o.fill(); }
    // the bench below: a wooden rail
    N1.vgrad(o, 0, 410, 360, 230, ['#2a1a2e', '#1a1020']);
    o.fillStyle = '#7a5030'; o.fillRect(10, BY + 22, 340, 10); o.fillStyle = '#5a3820'; o.fillRect(10, BY + 32, 340, 6);
    for (let x = 20; x < 350; x += 20) { o.fillStyle = 'rgba(255,230,180,0.25)'; o.fillRect(x, BY + 24, 1.5, 6); }
    // the lamp box and the slide holder
    o.fillStyle = '#4a4a5a'; o.beginPath(); o.roundRect(8, BY - 34, 34, 56, 6); o.fill(); o.fillStyle = '#ffe9a0'; o.beginPath(); o.arc(28, BY - 6, 9, 0, 7); o.fill();
  }
  function frog(c, x, y, h, flip) { // the picture: the frog, about h tall
    c.save(); c.translate(x, y); if (flip) c.scale(1, -1); const s = h / 64; SK.animal(c, 'frog', 0, 32 * s, s, { t: 0, expr: 'happy', noShadow: true }); c.restore();
  }
  MG.add({
    id: 'focus', stage: 'waves', cmd: 'SLIDE THE LENS TO MAKE IT SHARP!', time: 6, mood: 'party', winText: 'Sharp!', failText: 'Still blurry!',
    card: { title: 'Bringing light to a point', kind: 'Physics', ref: 'Lenses and focus',
      text: 'Light spreads out from every point of the slide. A lens bends that light so it comes back together to a point again.\n\nIt meets at one distance only. Put the screen there and every point of the picture lands as a point: it looks sharp. Put the screen nearer or farther, and each point lands as a fuzzy blob: blur.\n\nMove the screen and the lens must move to match. Cameras, projectors and your own eyes all focus this way.',
      note: 'A lens brings light from each point back to a point at one distance only. That is where the picture is sharp.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level), v = SK.variant(g, 4); s.n = lv === 0 ? 2 : 3; s.tol = [2.2, 1.8, 1.6][lv]; s.creep = lv >= 2 ? 9 : 0;
      const W = [[316, 332, 304], [330, 306, 322], [308, 326, 334], [322, 312, 300]][v], Fs = [[40, 62, 52], [60, 42, 54], [50, 64, 40], [44, 56, 64]][v];
      s.ws = W.map(x => x + Math.round((g.rand() - 0.5) * 6)); s.fs = Fs; s.f = Fs[0];
      s.i = 0; s.scr = s.ws[0]; s.L = 186 + Math.round(g.rand() * 10); s.ok = 0; s.lockT = 0; s.drag = false; s.doneN = 0; s.moveT = 0; s.dir = 1;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.lockT || s.moveT) return; if (Math.abs(x - s.L) < 46 && y > BY - 80 && y < BY + 60) { s.drag = true; SK.dragStart(g, null, x, y); s.gx = s.L - x; } },
    move(g, x) { const s = g.s; if (!s.drag) return; SK.dragMove(g, x, 0); s.L = SK.clamp(x + s.gx, LMIN, Math.min(LMAX, s.scr - 16)); },
    up(g) { const s = g.s; if (s.drag) { s.drag = false; SK.dragEnd(g); } },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      if (s.moveT) { const k = SK.clamp((g.t - s.moveT) / 0.6, 0, 1); s.scr = SK.lerp(s.from, s.ws[s.i], SK.easeInOut(k)); if (k >= 1) s.moveT = 0; s.L = Math.min(s.L, s.scr - 16); return; }
      if (s.lockT) { if (g.t - s.lockT > 0.6) { s.lockT = 0; s.doneN++; if (s.doneN >= s.n) { g.win(); g.sfx('cheer'); return; } s.i++; s.from = s.scr; s.moveT = g.t; s.f = s.fs[s.i]; g.sfx('swoosh'); g.sfx('click'); } return; }
      if (s.creep && s.touched) { s.scr += s.dir * s.creep * dt; if (s.scr > 342 || s.scr < 258) s.dir *= -1; s.L = Math.min(s.L, s.scr - 16); } // level 2: the screen keeps creeping
      const b = blurOf(s.L, s.scr, s.f); s.ok = b <= s.tol && !s.drag ? s.ok + dt : 0;
      if (s.ok > 0.35) { s.lockT = g.t; g.sfx('chime'); g.sfx('sparkle'); g.burst(180, 230, ['#ffd45a', '#fff6ea', '#8affb0'], 22, 180); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', di = imgDist(s.L, s.f), b = blurOf(s.L, s.scr, s.f), sharp = b <= s.tol;
      c.drawImage(g.bake('focus_hall', paintHall), 0, 0, 360, 640);
      // the screen the audience sees: the picture, as big and as sharp as the lens makes it
      c.fillStyle = '#f4eee4'; c.fillRect(SCR.x, SCR.y, SCR.w, SCR.h);
      c.save(); c.beginPath(); c.rect(SCR.x, SCR.y, SCR.w, SCR.h); c.clip();
      const m = di ? (s.scr - s.L) / (s.L - SX) : 4, ph = SK.clamp(44 * m, 26, 240), bl = b * 1.6 + (di ? 0 : 6);
      const lg = c.createRadialGradient(180, 234, 10, 180, 234, 190); lg.addColorStop(0, 'rgba(255,240,190,0.55)'); lg.addColorStop(1, 'rgba(255,240,190,0)'); c.fillStyle = lg; c.fillRect(SCR.x, SCR.y, SCR.w, SCR.h);
      c.filter = 'blur(' + bl.toFixed(1) + 'px)'; c.globalAlpha = SK.clamp(1.6 / Math.max(1, m * 0.8), 0.45, 1); frog(c, 180, 234, ph, false); c.filter = 'none'; c.globalAlpha = 1;
      c.restore(); c.strokeStyle = sharp || s.lockT ? '#6ae07a' : '#d8c8b0'; c.lineWidth = 4; c.strokeRect(SCR.x, SCR.y, SCR.w, SCR.h);
      // the audience: owl and friends, heads over the seats
      const ex = won || s.lockT ? 'laugh' : b > 10 ? 'think' : 'happy';
      [['owl', 70], ['rabbit', 180], ['hedgehog', 290]].forEach(([k, x], i) => SK.animal(c, k, x, 392, 0.7, { t, phase: i, pose: won || s.lockT ? 'cheer' : lost ? 'sad' : 'idle', expr: lost ? 'sad' : ex, noShadow: true }));
      if (!won) N1.pips(c, 180, 418, s.n, s.doneN);
      // the bench: lamp, upside-down slide, lens, screen
      c.fillStyle = '#c8e8ff'; c.fillRect(SX - 2, BY - 30, 4, 52); frog(c, SX, BY - 4, 34, true); // the slide with the frog upside down
      c.fillStyle = '#e8e4dc'; c.fillRect(s.scr, BY - 74, 8, 100); c.fillStyle = '#5a4a3a'; c.fillRect(s.scr - 2, BY + 20, 12, 8);
      // three rays from the top of the frog through the lens, meeting where the lens focuses them
      const py = BY - 12, iy = di ? BY + (BY - py) * di / (s.L - SX) * 0 + (py - BY) * -(di / (s.L - SX)) : null;
      c.save(); c.globalCompositeOperation = 'lighter';
      for (const k of [-1, 0, 1]) { const ly = BY - 4 + k * AP * 1.4 - 2; c.strokeStyle = 'rgba(255,220,120,0.7)'; c.lineWidth = 2; c.beginPath(); c.moveTo(SX, py); c.lineTo(s.L, ly);
        if (di) { const ix = s.L + di, iyy = BY - 4 + (BY - 4 - py) * di / (s.L - SX), ex2 = s.scr, ey = ly + (iyy - ly) * (ex2 - s.L) / di; c.lineTo(ex2, ey); }
        else { const ex2 = s.scr, sl = (ly - py) / (s.L - SX) * 0.5; c.lineTo(ex2, ly + sl * (ex2 - s.L)); } c.stroke(); }
      if (di && s.L + di < 360) { const ix = s.L + di, iyy = BY - 4 + (BY - 4 - py) * di / (s.L - SX); c.fillStyle = 'rgba(255,240,170,0.9)'; c.beginPath(); c.arc(ix, iyy, 3.5, 0, 7); c.fill(); }
      c.restore();
      // the lens on its holder
      c.fillStyle = '#5a4a3a'; c.fillRect(s.L - 6, BY + 14, 12, 14); c.fillRect(s.L - 2, BY + 2, 4, 14);
      c.fillStyle = 'rgba(170,220,255,0.75)'; c.strokeStyle = '#e8f6ff'; c.lineWidth = 2; c.beginPath(); c.ellipse(s.L, BY - 4, 2 + 320 / s.f, AP * 1.6 + 6, 0, 0, 7); c.fill(); c.stroke();
      SK.tag(c, 'Lens', s.L, BY + 52, 18); SK.tag(c, 'Screen', SK.clamp(s.scr, 40, 316), BY - 96, 18); SK.tag(c, 'Slide', SX + 4, BY - 56, 18);
      // which way to slide: toward the nearest sharp spot
      if (g.done || s.lockT || s.moveT) return; const targets = sharpL(s.scr, s.f); if (!targets.length) return;
      const tx = targets[0], off = !sharp; // the spot nearer the slide: the big picture
      if (off) { SK.grab(c, g, s.L, BY - 4, 30); SK.target(c, g, tx, BY + 22, 12); SK.arrow(c, g, s.L, BY + 76, tx, BY + 76, { from: 0, to: 8 }); }
      SK.demo(g, c, 'drag', [s.L, BY - 4], [tx, BY - 4], { never: !off });
    },
    auto(g, dt, synth) {
      const s = g.s, B = s._bot = s._bot || {}; if (g.done || s.lockT || s.moveT || g.t < 1.0) return; const T = sharpL(s.scr, s.f); if (!T.length) return;
      if (!B.on) { if (blurOf(s.L, s.scr, s.f) <= s.tol * 0.5) return; synth('down', s.L, BY - 4); B.on = 1; B.t0 = g.t; B.l0 = s.L; return; }
      const k = SK.clamp((g.t - B.t0) / 0.45, 0, 1), x = SK.lerp(B.l0, sharpL(s.scr, s.f)[0], k); synth('move', x, BY - 4); if (k >= 1) { synth('up', x, BY - 4); B.on = 0; }
    },
  });
})();
