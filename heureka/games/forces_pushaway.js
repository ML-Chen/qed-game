// PUSH AWAY! (physics PE-06) — a toy railway with a station at the far end. Each little wagon has a bar magnet on its
// back, one end red, one end blue. You hold another bar magnet on a stick: drag it along behind the wagon, and tap it to
// turn it round. When the ends that face each other are the same colour, they push apart, so the wagon rolls away
// without being touched; push it all the way into the station. Turned the wrong way, the ends pull together: the wagon
// rolls toward your magnet and sticks with a clack (tap to turn it round and it shoots off). The track is a bit rough,
// so the wagon soon stops unless you keep pushing. Two wagons at level 0, three at level 1; at level 2 the wagons'
// magnets are not painted, so test which way they push first.
(() => {
  const TY = 470, MY = TY - 40, ST = 268, BUF = 344, K = 7e5, MU = 220, WL = 72, ML = 54, GAPMIN = 5;
  function paintRail(o) {
    P.sky(o, 360, 640, ['#ffb890', '#ffd8a8', '#fff2d8'], { x: 280, y: 170, r: 26, color: '#fff0b0' }); P.cloud(o, 90, 190, 0.6);
    P.hills(o, 360, 400, 40, '#b8d878', '#88b050', { seed: 2 }); for (const [x, s] of [[40, 0.6], [200, 0.5]]) P.tree(o, x, 410, s);
    N1.vgrad(o, 0, TY + 8, 360, 640 - TY, ['#c8a870', '#9a7a48']);
    // sleepers and rails
    o.fillStyle = '#7a5030'; for (let x = 4; x < 360; x += 22) o.fillRect(x, TY + 4, 12, 8); o.fillStyle = '#8a8a9a'; o.fillRect(0, TY, 360, 4); o.fillStyle = '#c8c8d8'; o.fillRect(0, TY, 360, 1.5);
    // the station: a platform with a roof, and a buffer at the end
    o.fillStyle = '#d8c8a8'; o.fillRect(ST - 6, TY + 6, BUF - ST + 20, 18); o.fillStyle = '#b8a888'; o.fillRect(ST - 6, TY + 22, BUF - ST + 20, 4);
    o.fillStyle = '#6a4a3a'; o.fillRect(ST + 4, TY - 130, 6, 136); o.fillRect(BUF + 2, TY - 130, 6, 136);
    o.fillStyle = '#d84a4a'; o.beginPath(); o.moveTo(ST - 10, TY - 128); o.lineTo((ST + BUF) / 2 + 4, TY - 160); o.lineTo(BUF + 18, TY - 128); o.closePath(); o.fill();
    o.fillStyle = '#ffd43a'; o.fillRect(BUF - 4, TY - 22, 14, 22); o.fillStyle = '#2a2a34'; for (let i = 0; i < 3; i++) o.fillRect(BUF - 4, TY - 20 + i * 7, 14, 3);
  }
  function bar(c, x, y, len, dirRightIsRed, painted = true) { // a bar magnet, x = its left end
    const h = 24, half = len / 2, L = painted ? (dirRightIsRed ? '#3a7aff' : '#ff4a3a') : '#9a9aa8', R = painted ? (dirRightIsRed ? '#ff4a3a' : '#3a7aff') : '#b8b8c4';
    c.fillStyle = L; c.fillRect(x, y - h / 2, half, h); c.fillStyle = R; c.fillRect(x + half, y - h / 2, half, h);
    c.strokeStyle = '#2a1a2a'; c.lineWidth = 2; c.strokeRect(x, y - h / 2, len, h);
    if (painted) { c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(x + 2, y - h / 2 + 2, len - 4, 4); }
  }
  function wagon(c, x, col, t) { // x = its back (left) end
    c.fillStyle = '#2a2a34'; for (const wx of [x + 14, x + WL - 14]) { c.beginPath(); c.arc(wx, TY - 7, 9, 0, 7); c.fill(); c.fillStyle = '#9a9aa8'; c.beginPath(); c.arc(wx, TY - 6, 2.5, 0, 7); c.fill(); c.fillStyle = '#2a2a34'; }
    const bg = c.createLinearGradient(0, TY - 60, 0, TY - 12); bg.addColorStop(0, P.shade(col, 0.25)); bg.addColorStop(1, P.shade(col, -0.2)); c.fillStyle = bg; c.strokeStyle = P.shade(col, -0.55); c.lineWidth = 2;
    c.beginPath(); c.roundRect(x + 2, TY - 60, WL - 4, 46, 6); c.fill(); c.stroke(); c.fillStyle = 'rgba(255,255,255,0.5)'; c.fillRect(x + 12, TY - 54, WL - 24, 10);
  }
  MG.add({
    id: 'pushaway', stage: 'forces', cmd: 'PUSH THE WAGONS WITHOUT TOUCHING!', time: 7, mood: 'bright', winText: 'All aboard!', failText: 'Not there yet!',
    card: { title: 'Like ends push apart', kind: 'Physics', ref: 'Magnetic poles',
      text: 'Every magnet has two ends, called poles: a north pole and a south pole. Here they are painted red and blue.\n\nTwo matching ends push each other away, even through the air. Two different ends pull together and snap shut. So turning your magnet round changes a push into a pull.\n\nThe push gets much stronger as the magnets get closer. When the ends are not painted, the only way to find out is to try it.',
      note: 'Matching magnet ends push apart; different ends pull together.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level), v = SK.variant(g, 4); s.n = lv === 0 ? 2 : 3; s.painted = lv < 2;
      const flips = [[1, 1, 0], [0, 0, 1], [0, 1, 1], [1, 0, 0]][v]; // which way round each wagon's magnet is: 1 = red end facing back
      s.cars = flips.slice(0, s.n).map((f, i) => ({ f, col: ['#5ab0e8', '#ffb040', '#8ad06a', '#e87ab0'][(v + i) % 4] }));
      s.i = 0; s.hf = (v % 2) ? 1 : 0; // the hand magnet: 1 = red end facing the wagon
      s.mx = 30; s.wx = 150 + Math.round(g.rand() * 20); s.wv = 0; s.stuck = false; s.drag = false; s.tapOK = false; s.inT = 0; s.clackT = 0; s.arr = 0; s.flipT = -9;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.inT) return; if (x > s.mx - 50 && x < s.mx + ML + 30 && y > MY - 60 && y < MY + 46) { s.drag = true; s.dx = x; s.moved = 0; s.mx0 = s.mx; SK.dragStart(g, null, x, y); } },
    move(g, x) { const s = g.s; if (!s.drag) return; SK.dragMove(g, x, 0); s.moved = Math.max(s.moved, Math.abs(x - s.dx)); const nx = SK.clamp(s.mx0 + x - s.dx, 0, ST - ML); s.mx = s.stuck ? Math.min(nx, s.mx) : Math.min(nx, s.wx - ML - GAPMIN); if (s.stuck) s.wx = s.mx + ML; }, // stuck, it can only be pulled back (no pushing by touching)
    up(g) { const s = g.s; if (!s.drag) return; s.drag = false; SK.dragEnd(g); if (s.moved < 10) { // a tap turns the magnet round
        s.hf = 1 - s.hf; s.flipT = g.t; g.sfx('swoosh'); if (s.stuck) { s.stuck = false; s.wv = 260; g.sfx('boing'); } } },
    update(g, dt) {
      const s = g.s; if (g.done) return; const car = s.cars[Math.min(s.i, s.n - 1)];
      if (s.inT) { s.wv = Math.max(0, s.wv - MU * dt); s.wx = Math.min(BUF - WL, s.wx + s.wv * dt); if (g.t - s.inT > 0.5) { s.inT = 0; s.i++; if (s.i >= s.n) { g.win(); g.sfx('cheer'); return; } s.wx = 150 + Math.round(g.rand() * 20); s.wv = 0; s.mx = Math.min(s.mx, 30); g.sfx('pop'); } return; }
      if (s.stuck) { s.wx = s.mx + ML; s.wv = 0; return; }
      // the force between the facing ends: the wagon's back end and the hand magnet's front end
      const same = s.hf === car.f, gap = Math.max(GAPMIN, s.wx - (s.mx + ML)), F = gap < 110 ? Math.min(3000, K / (gap * gap)) : 0;
      let a = same ? F : -F; if (s.wv > 0) a -= MU; else if (s.wv < 0) a += MU; else if (Math.abs(a) <= MU) a = 0; else a -= Math.sign(a) * MU;
      const v0 = s.wv; s.wv += a * dt; if (v0 > 0 && s.wv < 0 && a < 0 && same) s.wv = 0; if (v0 < 0 && s.wv > 0 && !same) s.wv = 0;
      s.wx += s.wv * dt; if (s.wx > BUF - WL) { s.wx = BUF - WL; s.wv = 0; }
      if (!same && s.wx - (s.mx + ML) <= 1.5) { s.stuck = true; s.clackT = g.t; s.wv = 0; g.sfx('click'); g.sfx('thud'); g.sfx('laugh', { vol: 0.5 }); g.shake(2, 0.15); }
      if (s.wx >= ST - 4) { s.inT = g.t; s.arr++; g.sfx('bell'); g.sfx('chime'); g.burst(s.wx + WL / 2, TY - 60, ['#ffd45a', '#fff6ea', car.col], 16, 150); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', car = s.cars[Math.min(s.i, s.n - 1)], same = s.hf === car.f;
      c.drawImage(g.bake('push_rail', paintRail), 0, 0, 360, 640);
      SK.tag(c, 'Station', (ST + BUF) / 2 + 6, TY - 182, 18);
      // wagons already home sit in the station (drawn small, stacked)
      for (let k = 0; k < Math.min(s.i, s.n); k++) { c.save(); c.globalAlpha = 0.9; c.fillStyle = s.cars[k].col; c.beginPath(); c.roundRect(ST + 6 + k * 18, TY + 34, 14, 10, 3); c.fill(); c.restore(); }
      if (!won) { wagon(c, s.wx, car.col, t); bar(c, s.wx - 2, MY, ML, car.f === 1 ? false : true, s.painted); }
      // the hand magnet on its stick, held by the duck
      const fl = SK.clamp((t - s.flipT) / 0.25, 0, 1), sq = Math.abs(Math.cos(fl * Math.PI));
      c.fillStyle = '#8a5a30'; c.fillRect(s.mx + ML / 2 - 3, MY + 8, 6, 96);
      c.save(); c.translate(s.mx + ML / 2, MY); c.scale(fl < 1 ? Math.max(0.05, sq) : 1, 1); bar(c, -ML / 2, 0, ML, s.hf === 1, true); c.restore();
      SK.animal(c, 'duck', s.mx + ML / 2 - 8, 612, 1.15, { t, pose: won ? 'cheer' : lost ? 'sad' : s.stuck ? 'sad' : 'idle', expr: won ? 'laugh' : s.stuck ? 'wow' : 'happy' });
      // the push or pull between the facing ends
      if (!won && !s.stuck && !s.inT) { const gap = s.wx - (s.mx + ML); if (gap < 110) { const k = SK.clamp(1 - gap / 110, 0, 1), x0 = s.mx + ML, x1 = s.wx - 2;
        c.save(); c.strokeStyle = same ? `rgba(255,120,80,${0.3 + 0.6 * k})` : `rgba(90,160,255,${0.3 + 0.6 * k})`; c.lineWidth = 2; for (let i = 0; i < 3; i++) { const yy = MY - 14 + i * 14, mx = (x0 + x1) / 2; c.beginPath(); c.moveTo(x0 + 2, yy); c.quadraticCurveTo(mx, yy + (i - 1) * (same ? 14 : -4), x1 - 2, yy); c.stroke(); } c.restore();
        if (gap < 90) N1.word(c, same ? 'Push!' : 'Pull!', (x0 + x1) / 2, MY - 40, 18, same ? '#ffb080' : '#9ac8ff'); } }
      if (s.stuck && t - s.clackT < 1.2) N1.word(c, 'Clack!', s.wx, MY - 46, 22, '#9ac8ff');
      SK.tag(c, 'Magnet', s.mx + ML / 2 + 50, MY + 64, 18);
      if (!won) N1.pips(c, 180, 150, s.n, s.arr);
      // guidance: if the facing ends do not match (or it stuck), tap to turn the magnet; otherwise push it along
      if (g.done || s.inT) return; const known = s.painted || s.stuck;
      if (s.stuck || (known && !same)) { SK.glow(c, g, s.mx + ML / 2, MY, 30, undefined, { level: 2 }); SK.demo(g, c, 'tap', [s.mx + ML / 2, MY + 4]); return; }
      const tx = ST - ML - 6; if (tx - s.mx < 8) return; // one long push: the magnet follows close behind the wagon
      SK.grab(c, g, s.mx + ML / 2, MY, 26); SK.arrow(c, g, s.mx + ML + 4, MY + 30, tx + ML, MY + 30, { from: 0, to: 4 });
      SK.demo(g, c, 'drag', [s.mx + ML / 2, MY], [tx + ML / 2, MY]);
    },
    auto(g, dt, synth) {
      const s = g.s, B = s._bot = s._bot || {}; if (g.done || s.inT || g.t < 1.0) return; const car = s.cars[s.i], same = s.hf === car.f;
      if (B.on) { const k = SK.clamp((g.t - B.t0) / 0.7, 0, 1), x = SK.lerp(B.x0, B.x1, k); synth('move', x, MY); if (k >= 1) { synth('up', x, MY); B.on = 0; B.next = g.t + 0.15; } return; }
      if (B.next && g.t < B.next) return;
      if (s.stuck || ((s.painted || B.tried === s.i) && !same)) { synth('down', s.mx + ML / 2, MY); synth('up', s.mx + ML / 2, MY); B.next = g.t + 0.3; return; }
      if (!s.painted) B.tried = s.i; // level 2: just try it, and turn it round if it sticks
      if (Math.abs(s.wv) > 20) return; const x0 = s.mx + ML / 2, x1 = ST - ML / 2 - 6; if (x1 - x0 < 6) return;
      synth('down', x0, MY); B.on = 1; B.t0 = g.t; B.x0 = x0; B.x1 = x1;
    },
  });
})();
