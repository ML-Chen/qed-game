// ADD ATOMS TILL THE BULB GLOWS! (physics PHY UP3-16 DOPE!) — a silicon crystal sits in a circuit with a battery and a
// bulb. In pure silicon every outer electron is held in a bond, so no current flows and the bulb stays dark. Hold the
// button and phosphorus atoms hop from the jar into the crystal, one by one, each taking a silicon atom's place; each
// brings one spare electron that drifts free through the crystal and round the wire, so the bulb glows brighter. Let go
// when the meter is in the green band. Hold too long and so much current flows that the bulb pops.
// Each chip needs a different amount (a new band). Two chips at level 0, three at level 1; at level 2 the band is one
// atom wide and the last chip takes boron, which leaves holes (missing electrons) that drift the other way.
(() => {
  const COLS = 5, ROWS = 4, GX = 76, GY = 318, SP = 52, CR = { l: 46, r: 314, t: 286, b: 482 }, DROP = 0.42, FIRST = 0.25;
  const BULB = { x: 180, y: 182 }, METER = { x: 104, y: 246, w: 152 }, NMAX = 7, BTN = { x: 216, y: 566, w: 210, h: 56 }, JAR = { x: 62, y: 566 };
  const SEQ = [[2, 4, 3], [3, 2, 4], [4, 3, 2], [3, 4, 2]];
  const holdFor = s => { const R = Math.max(1, s.need - s.n); return FIRST + (s.wide ? R : R - 0.5) * DROP; }; // the middle of the window that ends in the band
  const site = i => [GX + (i % COLS) * SP, GY + Math.floor(i / COLS) * SP];
  function paintBg(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#141a3a'); bg.addColorStop(0.6, '#1e2a52'); bg.addColorStop(1, '#2a2450'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    // a circuit-board texture
    const r = P.rng(4); o.strokeStyle = 'rgba(90,200,160,0.08)'; o.lineWidth = 3; for (let i = 0; i < 18; i++) { let x = r() * 360, y = 120 + r() * 480; o.beginPath(); o.moveTo(x, y); for (let k = 0; k < 3; k++) { if (r() < 0.5) x += (r() - 0.5) * 160; else y += (r() - 0.5) * 120; o.lineTo(x, y); } o.stroke(); o.fillStyle = 'rgba(90,200,160,0.12)'; o.beginPath(); o.arc(x, y, 4, 0, 7); o.fill(); }
    // the wires: crystal left - up - bulb - right - battery - down - crystal right
    o.strokeStyle = '#c88a3a'; o.lineWidth = 7; o.lineJoin = 'round'; o.beginPath(); o.moveTo(CR.l, 384); o.lineTo(24, 384); o.lineTo(24, BULB.y + 40); o.lineTo(BULB.x - 14, BULB.y + 40); o.stroke();
    o.beginPath(); o.moveTo(BULB.x + 14, BULB.y + 40); o.lineTo(336, BULB.y + 40); o.lineTo(336, 384); o.lineTo(CR.r, 384); o.stroke();
    o.strokeStyle = '#f0b860'; o.lineWidth = 2; o.beginPath(); o.moveTo(CR.l, 382); o.lineTo(26, 382); o.lineTo(26, BULB.y + 38); o.stroke();
    // the battery on the right-hand wire
    o.fillStyle = '#3a3a4a'; o.beginPath(); o.roundRect(322, 262, 28, 64, 6); o.fill(); o.fillStyle = '#e8c040'; o.beginPath(); o.roundRect(322, 262, 28, 22, 6); o.fill(); o.fillStyle = '#c8c8d8'; o.fillRect(330, 256, 12, 6);
    o.fillStyle = '#fff6ea'; o.font = '900 16px Nunito, system-ui, sans-serif'; o.textAlign = 'center'; o.fillText('+', 336, 278); o.fillText('−', 336, 318);
    // the crystal's frame
    o.fillStyle = 'rgba(160,190,240,0.1)'; o.strokeStyle = 'rgba(180,210,255,0.5)'; o.lineWidth = 3; o.beginPath(); o.roundRect(CR.l, CR.t, CR.r - CR.l, CR.b - CR.t, 16); o.fill(); o.stroke();
    // the shelf
    o.fillStyle = '#4a3a5a'; o.fillRect(0, 600, 360, 40);
  }
  function atomBall(c, x, y, kind, t, k = 1) {
    const col = kind === 'P' ? '#f0903a' : kind === 'B' ? '#e070b0' : '#8aa0c8', r = 15 * k;
    SK.ball(c, x, y, r, col); c.font = `900 ${Math.round(12 * k)}px Nunito, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = 'rgba(20,10,30,0.75)'; c.fillText(kind === 'S' ? 'Si' : kind, x, y + 1);
  }
  function bulb(c, x, y, b, popT, t) {
    if (popT) { const k = SK.clamp((t - popT) * 3, 0, 1); c.fillStyle = '#5a5a6a'; c.beginPath(); c.roundRect(x - 12, y + 22, 24, 18, 4); c.fill(); c.strokeStyle = 'rgba(200,220,255,0.6)'; c.lineWidth = 2;
      for (let i = 0; i < 6; i++) { const a = i * 1.05 + 0.3, d = 20 + k * 30; c.beginPath(); c.moveTo(x + Math.cos(a) * d, y - 4 + Math.sin(a) * d); c.lineTo(x + Math.cos(a) * (d + 8), y - 4 + Math.sin(a) * (d + 8)); c.stroke(); }
      c.fillStyle = `rgba(120,120,130,${0.6 * (1 - k)})`; c.beginPath(); c.arc(x, y - 30 - k * 30, 14 + k * 10, 0, 7); c.fill(); return; }
    if (b > 0) { const gl = c.createRadialGradient(x, y - 4, 4, x, y - 4, 40 + 70 * b); gl.addColorStop(0, `rgba(255,240,160,${0.25 + 0.55 * b})`); gl.addColorStop(1, 'rgba(255,220,120,0)'); c.fillStyle = gl; c.beginPath(); c.arc(x, y - 4, 40 + 70 * b, 0, 7); c.fill(); }
    c.fillStyle = P.mix('#4a4a5e', '#fff6c0', SK.clamp(b * 1.3, 0, 1)); c.strokeStyle = 'rgba(230,240,255,0.8)'; c.lineWidth = 2.5; c.beginPath(); c.arc(x, y - 4, 22, Math.PI * 0.75, Math.PI * 2.25); c.lineTo(x + 10, y + 22); c.lineTo(x - 10, y + 22); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = b > 0.05 ? '#ffb040' : '#8a7a6a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 6, y + 20); c.lineTo(x - 6, y); c.lineTo(x - 2, y - 6); c.lineTo(x + 2, y); c.lineTo(x + 6, y - 6); c.lineTo(x + 6, y + 20); c.stroke();
    c.fillStyle = '#8a8a9a'; c.beginPath(); c.roundRect(x - 12, y + 22, 24, 18, 4); c.fill(); c.strokeStyle = '#5a5a6a'; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(x - 12, y + 27 + i * 5); c.lineTo(x + 12, y + 27 + i * 5); c.stroke(); }
  }
  function newChip(g) {
    const s = g.s; s.kinds = []; for (let i = 0; i < COLS * ROWS; i++) s.kinds.push('S'); s.free = []; s.fly = []; s.n = 0; s.chipT = g.t; s.doneT = 0; s.holdOn = false; s.dropAt = 0;
    s.dop = g.level >= 2 && s.chip === s.seq.length - 1 ? 'B' : 'P'; s.need = s.seq[s.chip]; s.hi = s.need + s.wide;
  }
  MG.add({
    id: 'atoms_dope', stage: 'atoms', cmd: 'ADD ATOMS TILL THE BULB GLOWS!', time: 7, mood: 'night', winText: 'Current flows!', failText: 'Too much current!',
    card: { title: 'A pinch of the right atoms', kind: 'Physics', ref: 'Doping semiconductors',
      text: 'Pure silicon carries electricity badly. Each silicon atom shares its four outer electrons with its neighbours, so every electron is held in a bond and none are free to move.\n\nSwap in a few phosphorus atoms. Phosphorus has five outer electrons, so each one brings a spare electron that can drift through the crystal and carry current. Boron has only three, so it leaves a gap called a hole, which moves and carries current too.\n\nThis is called doping. Computer chips are made by doping tiny parts of silicon by exact amounts.',
      note: 'Adding a few atoms of another element gives silicon free charges, so it can carry current.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level), v = SK.variant(g, 4);
      s.seq = SEQ[v].slice(0, L === 0 ? 2 : 3); s.wide = L === 2 ? 0 : 1; s.chip = 0; s.popT = 0; s.cur = 0; newChip(g);
    },
    down(g, x, y) { const s = g.s; if (g.done || s.doneT) { SK.touched(g); return; } SK.holdStart(g); s.holdOn = true; s.dropAt = g.t + FIRST; g.sfx('click'); },
    up(g) { const s = g.s; if (!s.holdOn) return; SK.holdEnd(g); s.holdOn = false;
      if (!g.done && !s.doneT && s.n >= s.need && s.n <= s.hi) { s.doneT = g.t; g.sfx('chime'); if (s.chip === s.seq.length - 1) { g.win(); g.sfx('cheer'); } } },
    update(g, dt) {
      const s = g.s;
      // while held, one atom hops from the jar into a random silicon site every half second
      if (s.holdOn && !g.done && !s.doneT && g.t >= s.dropAt) {
        s.dropAt += DROP; const empty = []; s.kinds.forEach((k, i) => { if (k === 'S' && !s.fly.some(f => f.i === i)) empty.push(i); });
        if (empty.length) { const i = empty[Math.floor(g.rand() * empty.length) % empty.length]; s.fly.push({ i, t: g.t }); s.n++; g.sfx('pop', { pitch: 1.2 });
          if (s.n > s.hi) { s.popT = g.t; g.fail(); g.sfx('snap'); g.sfx('laugh'); g.shake(4, 0.3); } }
      }
      for (const f of s.fly) if (g.t - f.t >= 0.35 && !f.landed) { f.landed = true; s.kinds[f.i] = s.dop; const [x, y] = site(f.i);
        s.free.push({ x: x + 18, y: y - 18, vx: 0, vy: 0, born: g.t, hole: s.dop === 'B' }); g.sfx('sparkle');
      }
      s.fly = s.fly.filter(f => !f.landed);
      // the free charges drift through the crystal (electrons toward the + side, holes the other way) and round the wire
      const live = !s.popT; for (const e of s.free) { const dir = e.hole ? -1 : 1; e.x += dir * (live ? 70 : 10) * dt; e.y += Math.sin(g.t * 3 + e.born * 7) * 30 * dt;
        if (e.x > CR.r - 10) e.x = CR.l + 10; if (e.x < CR.l + 10) e.x = CR.r - 10; e.y = SK.clamp(e.y, CR.t + 12, CR.b - 12); }
      s.cur = SK.lerp(s.cur, s.popT ? 0 : s.n / NMAX, 1 - Math.exp(-dt * 8));
      if (s.doneT && g.t - s.doneT > 0.7 && !g.done) { s.chip++; newChip(g); g.sfx('pop'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('dope_bg', paintBg), 0, 0, 360, 640);
      // current in the wires: moving dashes, more and faster with more free charges
      if (s.cur > 0.01) { c.save(); c.strokeStyle = `rgba(120,230,255,${0.3 + 0.6 * s.cur})`; c.lineWidth = 3; c.setLineDash([4, 14]); c.lineDashOffset = -t * 120 * (s.dop === 'B' ? 1 : 1);
        c.beginPath(); c.moveTo(CR.r, 384); c.lineTo(336, 384); c.lineTo(336, BULB.y + 40); c.lineTo(BULB.x + 14, BULB.y + 40); c.moveTo(BULB.x - 14, BULB.y + 40); c.lineTo(24, BULB.y + 40); c.lineTo(24, 384); c.lineTo(CR.l, 384); c.stroke(); c.restore(); }
      bulb(c, BULB.x, BULB.y, s.cur * NMAX / (s.need + 0.5) * 0.9, s.popT, t);
      // the crystal: bonds (each holds a pair of electrons), then the atoms
      for (let i = 0; i < COLS * ROWS; i++) { const [x, y] = site(i); for (const [dx, dy] of [[1, 0], [0, 1]]) { const j = i + dx + dy * COLS; if ((dx && i % COLS === COLS - 1) || (dy && j >= COLS * ROWS)) continue; const [x2, y2] = site(j);
        c.strokeStyle = 'rgba(180,200,240,0.35)'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x2, y2); c.stroke();
        const mx = (x + x2) / 2, my = (y + y2) / 2, hole = s.kinds[i] === 'B' && dx === 1 && i % COLS < COLS - 1, ox = dy ? 4 : 0, oy = dx ? 4 : 0;
        c.fillStyle = '#5ad8ff'; c.beginPath(); c.arc(mx - ox, my - oy, 3, 0, 7); c.fill(); if (!hole) { c.beginPath(); c.arc(mx + ox, my + oy, 3, 0, 7); c.fill(); } } }
      for (let i = 0; i < COLS * ROWS; i++) { const [x, y] = site(i), jit = lost ? Math.sin(t * 40 + i) * 3 : 0; atomBall(c, x + jit, y, s.kinds[i], t); }
      // atoms in flight from the jar
      for (const f of s.fly) { const k = SK.clamp((t - f.t) / 0.35, 0, 1), [x, y] = site(f.i); atomBall(c, SK.lerp(JAR.x, x, k), SK.lerp(JAR.y - 30, y, k) - Math.sin(k * Math.PI) * 80, s.dop, t, 0.9); }
      // free electrons (or holes)
      for (const e of s.free) { if (e.hole) { c.save(); c.strokeStyle = '#ff9ad0'; c.lineWidth = 2.5; c.setLineDash([3, 3]); c.beginPath(); c.arc(e.x, e.y, 6, 0, 7); c.stroke(); c.restore(); }
        else { const gl = c.createRadialGradient(e.x, e.y, 0, e.x, e.y, 14); gl.addColorStop(0, 'rgba(120,230,255,0.6)'); gl.addColorStop(1, 'rgba(120,230,255,0)'); c.fillStyle = gl; c.beginPath(); c.arc(e.x, e.y, 14, 0, 7); c.fill(); SK.ball(c, e.x, e.y, 6, '#5ad8ff', { edge: '#1a4a7a', lw: 1.5 }); } }
      const lastE = s.free[s.free.length - 1]; if (lastE && t - lastE.born < 1.4 && !g.done) SK.tag(c, lastE.hole ? 'Hole' : 'Free electron', SK.clamp(lastE.x, 80, 280), lastE.y - 26, 18);
      SK.tag(c, 'Silicon', CR.l + 52, CR.t, 18); SK.tag(c, 'Bulb', BULB.x + 62, BULB.y - 8, 18);
      // the brightness meter with its band
      const bx = n => METER.x + METER.w * n / NMAX; c.fillStyle = 'rgba(10,10,30,0.7)'; c.beginPath(); c.roundRect(METER.x - 6, METER.y - 10, METER.w + 12, 20, 10); c.fill();
      c.fillStyle = '#5ad07a'; c.fillRect(bx(s.need - 0.5), METER.y - 7, bx(s.hi + 0.5) - bx(s.need - 0.5), 14); c.fillStyle = '#ffd45a'; c.beginPath(); c.roundRect(METER.x, METER.y - 4, Math.max(6, METER.w * Math.min(1, s.n / NMAX)), 8, 4); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.35)'; for (let k = 1; k < NMAX; k++) c.fillRect(bx(k) - 0.5, METER.y - 7, 1, 14);
      if (s.holdOn && !g.done && !s.doneT) SK.tag(c, s.n < s.need ? 'Keep holding...' : s.n <= s.hi ? 'Let go now!' : 'Too many!', BTN.x, BTN.y - 52, 19, '#fff6ea', s.n < s.need ? 'rgba(30,14,36,0.8)' : 'rgba(40,150,70,0.95)'); // status
      if (!won) SK.tag(c, 'Chip ' + (s.chip + 1) + ' / ' + s.seq.length, 66, 178, 18);
      // the jar and the hold button
      c.save(); c.fillStyle = 'rgba(220,240,255,0.25)'; c.strokeStyle = 'rgba(230,245,255,0.8)'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(JAR.x - 30, JAR.y - 34, 60, 64, 10); c.fill(); c.stroke();
      for (let i = 0; i < 6; i++) atomBall(c, JAR.x - 16 + (i % 3) * 16, JAR.y + 14 - Math.floor(i / 3) * 16, s.dop, t, 0.65); c.restore();
      SK.tag(c, s.dop === 'B' ? 'Boron' : 'Phosphorus', JAR.x + 8, JAR.y - 50, 18);
      if (!g.done && !s.doneT) { const pr = s.holdOn ? 1 : 0; c.fillStyle = '#7a3a1a'; c.beginPath(); c.roundRect(BTN.x - BTN.w / 2, BTN.y - BTN.h / 2 + 4, BTN.w, BTN.h, 18); c.fill(); c.fillStyle = s.dop === 'B' ? '#d0609a' : '#e8803a'; c.beginPath(); c.roundRect(BTN.x - BTN.w / 2, BTN.y - BTN.h / 2 + pr * 4, BTN.w, BTN.h, 18); c.fill(); c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.stroke();
        c.save(); c.font = '900 20px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff6ea'; c.fillText(pr ? 'Adding atoms...' : 'Hold to add atoms', BTN.x, BTN.y + 1 + pr * 4); c.restore(); }
      SK.animal(c, 'ant', 300, 236, 0.9, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
      // guidance: hold the button just long enough for the atoms this chip still needs
      if (!g.done && !s.doneT && !s.holdOn) { const need = holdFor(s); SK.glow(c, g, BTN.x, BTN.y, 50, undefined, { level: 2 }); SK.demo(g, c, 'hold', [BTN.x + 20, BTN.y + 6], null, { period: need / 0.65 }); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.doneT) return; const B = s._bot = s._bot || {}; const key = 'c' + s.chip;
      if (B[key + 'T'] == null) B[key + 'T'] = Math.max(1.0, g.t + 0.2); const r = s.need - s.n;
      if (B[key + 'D'] == null) B[key + 'D'] = holdFor(s); SK.bot.hold(g, synth, key, B[key + 'T'], BTN.x, BTN.y, B[key + 'D']);
    },
  });
})();
