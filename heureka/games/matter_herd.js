// HERD! (chemistry CB APC-27) — a glass box of gas particles, all held in the left half by a door. The door lifts and
// they spread through the whole box by themselves. Drag the broom to herd them back into the left half; the door drops
// shut only when every one is on the left. They never gather back on their own, and they keep slipping round the
// broom, so herding works only while you keep at it. Pushing them speeds them up (the gas warms). Level 1: more
// particles and a shorter broom; level 2: more again.
(() => {
  const BOX = { l: 22, r: 338, t: 196, b: 520 }, MID = 180, PR = 9;
  const LV = [{ n: 8, h: 280 }, { n: 10, h: 250 }, { n: 11, h: 236 }];
  function warm(k) { // blue when slow, through purple, to red when fast
    const h = ((215 + 150 * k) % 360) / 360, l = 0.55, sat = 0.75, q = l + sat - l * sat, p = 2 * l - q, f = tt => { tt = (tt % 1 + 1) % 1; return tt < 1 / 6 ? p + (q - p) * 6 * tt : tt < 0.5 ? q : tt < 2 / 3 ? p + (q - p) * (2 / 3 - tt) * 6 : p; };
    return '#' + [f(h + 1 / 3), f(h), f(h - 1 / 3)].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
  }
  function paintBox(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#f2c89a'); bg.addColorStop(1, '#e89a7a'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    const rnd = P.rng(12); for (let i = 0; i < 26; i++) { o.fillStyle = 'rgba(255,240,220,0.35)'; o.beginPath(); o.arc(rnd() * 360, rnd() * 640, 6 + rnd() * 18, 0, 7); o.fill(); }
    o.fillStyle = '#7a4a3a'; o.fillRect(0, 548, 360, 92); o.fillStyle = '#9a6a4a'; o.fillRect(0, 548, 360, 8);
    o.fillStyle = '#5a3a2a'; o.beginPath(); o.roundRect(BOX.l - 12, BOX.t - 12, BOX.r - BOX.l + 24, BOX.b - BOX.t + 24, 14); o.fill();
    const gl = o.createLinearGradient(0, BOX.t, 0, BOX.b); gl.addColorStop(0, '#e8f6ff'); gl.addColorStop(1, '#c8e4f4'); o.fillStyle = gl; o.fillRect(BOX.l, BOX.t, BOX.r - BOX.l, BOX.b - BOX.t);
    o.fillStyle = 'rgba(120,200,120,0.18)'; o.fillRect(BOX.l, BOX.t, MID - BOX.l, BOX.b - BOX.t); // the left half, where they belong
    o.strokeStyle = 'rgba(60,120,60,0.35)'; o.lineWidth = 2; o.setLineDash([8, 8]); o.beginPath(); o.moveTo(MID, BOX.t); o.lineTo(MID, BOX.b); o.stroke(); o.setLineDash([]);
    o.fillStyle = '#5a3a2a'; o.fillRect(MID - 22, BOX.t - 42, 44, 32); // the door's slot on top
  }
  MG.add({
    id: 'matter_herd', stage: 'matter', cmd: 'HERD THEM BACK TO THE LEFT!', time: 8, mood: 'sea', winText: 'Herded back!', failText: 'Spread out again!',
    card: { title: 'Things spread out', kind: 'Chemistry', ref: 'Entropy and the second law of thermodynamics',
      text: 'Gas particles fly about at random and bounce off the walls. Open the door and they soon fill the whole box. They never all gather back in one half by themselves, because there are far more ways to be spread out than to be bunched up.\n\nGetting them back takes work: you have to push them, and they keep slipping away. Pushing also speeds them up, so the gas gets warmer. Scientists call this tendency to spread out entropy, and it rises on its own.',
      note: 'Left alone, things spread out and mix, and never un-mix by themselves.' },
    init(g) {
      const s = g.s, L = LV[Math.min(2, g.level)]; s.h = L.h;
      s.ps = []; for (let i = 0; i < L.n; i++) { const a = g.rand() * Math.PI * 2, v = 95 + g.rand() * 45; s.ps.push({ x: BOX.l + 20 + g.rand() * (MID - BOX.l - 40), y: BOX.t + 20 + g.rand() * (BOX.b - BOX.t - 40), vx: Math.cos(a) * v, vy: Math.sin(a) * v, side: 0 }); }
      s.door = 1; s.open = false; s.broom = null; s.prev = null; s.shutT = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || !s.spread) return; s.broom = [SK.clamp(x, BOX.l + 4, BOX.r - 4), SK.clamp(y, BOX.t, BOX.b)]; s.prev = s.broom.slice(); s.ps.forEach(p => { p.side = 0; }); },
    move(g, x, y) { const s = g.s; if (s.broom) s.broom = [SK.clamp(x, BOX.l + 4, BOX.r - 4), SK.clamp(y, BOX.t, BOX.b)]; },
    up(g) { g.s.broom = null; },
    update(g, dt) {
      const s = g.s;
      if (!s.open && g.t > 0.7) { s.open = true; g.sfx('whoosh'); }
      s.door = s.shutT ? Math.min(1, (g.t - s.shutT) / 0.25) : s.open ? Math.max(0, s.door - dt * 4) : 1;
      const b = s.broom, pv = s.prev || b, vb = b ? (b[0] - pv[0]) / Math.max(dt, 1e-3) : 0;
      for (const p of s.ps) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < BOX.l + PR) { p.x = BOX.l + PR; p.vx = Math.abs(p.vx); } if (p.x > BOX.r - PR) { p.x = BOX.r - PR; p.vx = -Math.abs(p.vx); }
        if (p.y < BOX.t + PR) { p.y = BOX.t + PR; p.vy = Math.abs(p.vy); } if (p.y > BOX.b - PR) { p.y = BOX.b - PR; p.vy = -Math.abs(p.vy); }
        if (s.door > 0.05) { const doorB = BOX.t + (BOX.b - BOX.t) * s.door; if (p.y - PR < doorB) { if (p.x < MID && p.x + PR > MID - 5) { p.x = MID - 5 - PR; p.vx = -Math.abs(p.vx); } if (p.x > MID && p.x - PR < MID + 5) { p.x = MID + 5 + PR; p.vx = Math.abs(p.vx); } } }
        // the broom: a short upright bar that particles bounce off (a moving broom gives them a kick)
        if (b) {
          const inY = Math.abs(p.y - b[1]) < s.h / 2 + PR * 0.5, side = Math.sign(p.x - b[0]) || 1;
          if (inY && p.side && side !== p.side) { p.x = b[0] + p.side * (PR + 3); const rel = p.vx - vb; if (Math.sign(rel) !== p.side) p.vx = vb - rel; g.sfx('tap'); }
          else if (inY && Math.abs(p.x - b[0]) < PR + 3) { p.x = b[0] + side * (PR + 3); const rel = p.vx - vb; if (Math.sign(rel) !== side) p.vx = vb - rel; }
          p.side = inY ? Math.sign(p.x - b[0]) || 1 : 0;
          const sp = Math.hypot(p.vx, p.vy); if (sp > 520) { p.vx *= 520 / sp; p.vy *= 520 / sp; }
        }
      }
      s.prev = b ? b.slice() : null;
      if (s.open && !s.spread && g.t > 2.1 && s.ps.filter(p => p.x > MID).length >= s.ps.length * 0.45) { s.spread = g.t; g.sfx('pop'); } // they have spread out by themselves
      if (s.spread && s.broom && !s.shutT && s.ps.every(p => p.x + PR * 0.5 < MID)) { s.shutT = g.t; g.sfx('thud'); g.sfx('cheer'); g.win(); }
    },
    draw(g, c) {
      const s = g.s, t = g.t;
      c.drawImage(g.bake('herd_box', paintBox), 0, 0, 360, 640);
      // the particles, warmer coloured when faster
      for (const p of s.ps) { const sp = Math.hypot(p.vx, p.vy), k = SK.clamp((sp - 120) / 260, 0, 1); SK.ball(c, p.x, p.y, PR, warm(k), { lw: 1.5 }); }
      // the door sliding in its slot
      const doorB = BOX.t + (BOX.b - BOX.t) * s.door; c.fillStyle = '#8a5a3a'; c.fillRect(MID - 5, BOX.t - 40, 10, doorB - BOX.t + 40); c.fillStyle = '#c88a5a'; c.fillRect(MID - 5, BOX.t - 40, 3, doorB - BOX.t + 40);
      // the broom
      if (s.broom) { const [bx, by] = s.broom; c.fillStyle = '#e8c060'; c.strokeStyle = '#8a6a2a'; c.lineWidth = 1.5; c.beginPath(); c.roundRect(bx - 6, by - s.h / 2, 12, s.h, 5); c.fill(); c.stroke();
        c.strokeStyle = 'rgba(138,106,42,0.6)'; for (let yy = by - s.h / 2 + 6; yy < by + s.h / 2 - 4; yy += 6) { c.beginPath(); c.moveTo(bx - 5, yy); c.lineTo(bx + 5, yy + 3); c.stroke(); }
        c.strokeStyle = '#7a4a2a'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(bx + 6, by); c.lineTo(bx + 46, by - 16); c.stroke(); }
      // the ant watches from the bench
      const won = g.result === 'win', lost = g.result === 'fail', frantic = !!s.broom;
      if (!s.broom) SK.tag(c, 'Broom', 300, 548, 18); SK.tag(c, 'Gas particles', 180, BOX.b + 30, 18);
      SK.animal(c, 'ant', 56, 612, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : frantic ? 'hop' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : frantic ? 'wow' : 'happy', facing: -1 });
      if (!s.broom) { // the broom, lying on the bench until you pick it up (dim until the gas has spread)
        c.save(); c.globalAlpha = s.spread ? 1 : 0.55; c.translate(268, 584); c.rotate(-0.12); c.strokeStyle = '#d89a5a'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(-70, 6); c.lineTo(10, 0); c.stroke();
        c.fillStyle = '#e8c060'; c.strokeStyle = '#8a6a2a'; c.lineWidth = 1.5; c.beginPath(); c.roundRect(8, -14, 70, 26, 6); c.fill(); c.stroke(); c.strokeStyle = 'rgba(138,106,42,0.6)'; for (let xx = 14; xx < 76; xx += 6) { c.beginPath(); c.moveTo(xx, -12); c.lineTo(xx + 3, 10); c.stroke(); } c.restore();
        if (s.spread) { SK.grab(c, g, 300, 584, 36); SK.target(c, g, (BOX.l + MID) / 2, (BOX.t + BOX.b) / 2, 0, { w: MID - BOX.l - 16, h: BOX.b - BOX.t - 16 }); SK.arrow(c, g, 300, 560, 160, 420, { from: 30, to: 30 }); }
      }
      const far = s.ps.reduce((a, p) => (p.x > (a ? a.x : MID) ? p : a), null), fy = far ? SK.clamp(far.y, BOX.t + 40, BOX.b - 40) : 358;
      SK.demo(g, c, 'drag', [Math.min(BOX.r - 10, (far ? far.x : 300) + 34), fy], [MID - 20, fy], { period: 2, delay: (s.spread || 0) + 0.2, never: !s.spread || !far });
    },
    // the bot: sweep the broom from the right wall toward the middle, keeping it in front of whichever particle is about to
    // slip past; if one gets away to the right, lift the broom and sweep again from the right wall
    auto(g, dt, synth) {
      const s = g.s; if (g.done || !s.spread) return; const B = s.bot = s.bot || { x: BOX.r - 10, y: 358, on: false, wait: 0 };
      if (!B.on) { if (g.t < B.wait) return; B.x = BOX.r - 10; B.on = true; synth('down', B.x, B.y); return; }
      const left = s.ps.filter(p => p.x < B.x), right = s.ps.filter(p => p.x > B.x + PR);
      if (right.length && B.x < BOX.r - 40) { B.on = false; B.wait = g.t + 0.05; synth('up', B.x, B.y); return; }
      let thr = null, best = 9; for (const p of left) if (p.vx > 0) { const tt = (B.x - p.x) / p.vx; if (tt < best) { best = tt; thr = p; } }
      if (thr) B.y += SK.clamp(thr.y - B.y, -900 * dt, 900 * dt);
      B.y = SK.clamp(B.y, BOX.t + s.h / 2 - 10, BOX.b - s.h / 2 + 10); B.x = Math.max(MID - 14, B.x - 75 * dt); synth('move', B.x, B.y);
    },
  });
})();
