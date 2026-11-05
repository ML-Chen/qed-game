// BIG SHADOW! (physics PE-09) — a puppet show at night. A lamp on the left shines along a table; a black cardboard puppet
// on a stick slides along the table; a white sheet hangs on the right, and a glowing outline of the puppet's shape is
// drawn on it. Slide the puppet until its shadow fills the outline exactly. Light goes in straight lines from the bulb
// (pale rays show the edges), so near the lamp the puppet blocks a wide spread of light and the shadow is huge; near the
// sheet it blocks a narrow spread and the shadow shrinks to nearly the puppet's own size (the rabbits laugh at a tiny one).
// Two outlines at level 0, three at levels 1 and 2, each a new size; level 2 needs a closer fit.
(() => {
  const LX = 40, LY = 316, WX = 300, RAIL = [94, 240], PH = 54, TABLE = 380;
  const scaleAt = px => (WX - LX) / (px - LX), pxFor = k => LX + (WX - LX) / k;
  const KINDS = ['rabbit', 'fox', 'duck', 'bird', 'penguin'];
  // the silhouette's box inside N1.silhouette's 200 x 200 canvas (measured once per kind)
  const BOX = {};
  function box(kind) {
    if (BOX[kind]) return BOX[kind]; const cv = N1.silhouette(kind, '#1a0e1e'), d = cv.getContext('2d').getImageData(0, 0, 200, 200).data;
    let x0 = 200, y0 = 200, x1 = 0, y1 = 0; for (let y = 0; y < 200; y++) for (let x = 0; x < 200; x++) if (d[(y * 200 + x) * 4 + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    return (BOX[kind] = x1 > x0 ? { x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 } : { x0: 0, y0: 0, w: 200, h: 200 });
  }
  const OUT = {};
  function outline(kind, col) { // a rim around the shape, in one colour
    const key = kind + col; if (OUT[key]) return OUT[key]; const s = N1.silhouette(kind, '#ffffff'), cv = document.createElement('canvas'); cv.width = cv.height = 200; const o = cv.getContext('2d');
    for (let a = 0; a < 16; a++) o.drawImage(s, Math.cos(a / 16 * 6.283) * 5, Math.sin(a / 16 * 6.283) * 5);
    o.globalCompositeOperation = 'destination-out'; o.drawImage(s, 0, 0); o.globalCompositeOperation = 'source-in'; o.fillStyle = col; o.fillRect(0, 0, 200, 200); return (OUT[key] = cv);
  }
  // draw a sprite of `kind` so its box is H tall and centred on (0, 0)
  function sprite(c, cv, kind, H) { const b = box(kind), sc = H / b.h; c.drawImage(cv, -(b.x0 + b.w / 2) * sc, -(b.y0 + b.h / 2) * sc, 200 * sc, 200 * sc); }
  function paintRoom(o) {
    N1.vgrad(o, 0, 0, 360, 640, ['#1c1838', '#2a2450', '#3a2e5a']);
    o.fillStyle = 'rgba(255,255,255,0.035)'; for (let x = 0; x < 360; x += 36) o.fillRect(x, 0, 16, 540); // wallpaper stripes
    const r = P.rng(5); o.fillStyle = 'rgba(255,230,180,0.08)'; for (let i = 0; i < 40; i++) { o.beginPath(); o.arc(r() * 360, r() * 520, 2 + r() * 2, 0, 7); o.fill(); }
    // the floor and the table
    N1.vgrad(o, 0, 540, 360, 100, ['#5a3a3a', '#3a2228']);
    o.fillStyle = '#7a4a30'; o.fillRect(0, TABLE, 262, 12); o.fillStyle = '#a86a40'; o.fillRect(0, TABLE - 4, 262, 6); o.fillStyle = '#5a3420'; o.fillRect(20, TABLE + 12, 10, 160); o.fillRect(236, TABLE + 12, 10, 160);
    o.fillStyle = 'rgba(0,0,0,0.25)'; o.fillRect(RAIL[0] - 12, TABLE - 8, RAIL[1] - RAIL[0] + 24, 4); // the slot the stick runs in
    // the sheet: a white screen seen at an angle, on a frame
    o.fillStyle = '#5a3a2a'; o.fillRect(WX + 52, 92, 6, 470); o.fillRect(WX - 58, 132, 6, 440);
    o.save(); o.transform(0.5, -0.14, 0, 1, WX, LY); o.fillStyle = '#efe6d6'; o.fillRect(-110, -200, 220, 400);
    const sg = o.createRadialGradient(0, 0, 10, 0, 0, 240); sg.addColorStop(0, 'rgba(255,240,190,0.7)'); sg.addColorStop(1, 'rgba(120,100,140,0.3)'); o.fillStyle = sg; o.fillRect(-110, -200, 220, 400);
    o.strokeStyle = '#c8b8a0'; o.lineWidth = 3; o.strokeRect(-110, -200, 220, 400); o.restore();
    // the lamp
    o.fillStyle = '#3a2a3a'; o.fillRect(18, TABLE - 10, 44, 8); o.fillRect(34, LY + 10, 8, TABLE - LY - 18);
    o.fillStyle = '#d84a5a'; o.beginPath(); o.moveTo(20, LY - 22); o.lineTo(44, LY - 16); o.lineTo(44, LY + 16); o.lineTo(20, LY + 22); o.closePath(); o.fill();
  }
  MG.add({
    id: 'shadow', stage: 'waves', cmd: 'FIT THE SHADOW TO THE OUTLINE!', time: 6, mood: 'night', winText: 'Perfect fit!', failText: 'Wrong size!',
    card: { title: 'Shadows grow near the light', kind: 'Physics', ref: 'Light travels in straight lines',
      text: 'Light travels out from the bulb in straight lines. A shadow is the dark patch on the wall where something blocks that light.\n\nClose to the lamp, the puppet blocks a wide spread of light, so its shadow is big. Near the wall, it blocks only a narrow spread, so the shadow is small, almost the puppet\'s own size.\n\nThe puppet stays the same size the whole time. Only the shadow changes.',
      note: 'Light travels in straight lines, so the closer a thing is to the lamp, the bigger its shadow.' },
    init(g) {
      const s = g.s, v = SK.variant(g, 4), lv = Math.min(2, g.level);
      s.kind = KINDS[v]; s.n = lv === 0 ? 2 : 3; s.tol = lv >= 2 ? 0.08 : 0.12;
      const orders = [[1.9, 3.1, 2.4], [3.0, 1.8, 2.5], [2.4, 3.2, 1.8], [1.8, 2.5, 3.1]];
      s.ks = orders[v].map(k => k * (1 + (g.rand() - 0.5) * 0.08)); s.i = 0; s.px = 236; s.fit = 0; s.lockT = 0; s.drag = false; s.doneN = 0; s.tinyT = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.lockT) return; if (Math.abs(x - s.px) < 56 && y > LY - 70 && y < TABLE + 60) { s.drag = true; SK.dragStart(g, null, x, y); s.gx = x - s.px; } },
    move(g, x) { const s = g.s; if (!s.drag || g.done) return; SK.dragMove(g, x, 0); s.px = SK.clamp(x - s.gx, RAIL[0], RAIL[1]); },
    up(g) { const s = g.s; if (!s.drag) return; s.drag = false; SK.dragEnd(g); },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      if (s.lockT) { if (g.t - s.lockT > 0.6) { s.lockT = 0; s.i++; s.fit = 0; if (s.doneN >= s.n) { g.win(); g.sfx('cheer'); } } return; }
      const k = scaleAt(s.px), kt = s.ks[s.i], ok = Math.abs(k / kt - 1) <= s.tol;
      s.fit = ok ? s.fit + dt : 0;
      if (s.fit >= 0.35 && !s.drag) { s.lockT = g.t; s.doneN++; g.sfx('chime'); g.sfx('sparkle'); g.burst(WX, LY, ['#ffd45a', '#fff6ea', '#8affb0'], 22, 170); if (s.doneN >= s.n) { s.lockT = g.t - 0.25; } }
      if (s.px > RAIL[1] - 6 && !s.tinyT) { s.tinyT = g.t; g.sfx('laugh', { vol: 0.5 }); } if (s.px < RAIL[1] - 30) s.tinyT = 0;
    },
    draw(g, c) {
      const s = g.s, t = g.t, k = scaleAt(s.px), i = Math.min(s.i, s.n - 1), kt = s.ks[i], ok = Math.abs(k / kt - 1) <= s.tol, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('shadow_room', paintRoom), 0, 0, 360, 640);
      const sh = PH * k, top = LY - sh / 2, bot = LY + sh / 2;
      // the light: a warm cone from the bulb, and the two edge rays that just graze the puppet
      c.save(); c.globalCompositeOperation = 'lighter'; const lg = c.createRadialGradient(LX, LY, 4, LX, LY, 300); lg.addColorStop(0, 'rgba(255,220,140,0.35)'); lg.addColorStop(1, 'rgba(255,220,140,0)'); c.fillStyle = lg;
      c.beginPath(); c.moveTo(LX, LY); c.lineTo(WX, LY - 230); c.lineTo(WX, LY + 230); c.closePath(); c.fill(); c.restore();
      // the sheet drawing: the outline to fill, then the shadow
      c.save(); c.transform(0.5, -0.14, 0, 1, WX, LY); c.beginPath(); c.rect(-110, -200, 220, 400); c.clip();
      c.save(); c.globalAlpha = 0.85; c.filter = 'blur(' + (1 + k * 0.6).toFixed(1) + 'px)'; sprite(c, N1.silhouette(s.kind, '#2a1a30'), s.kind, sh); c.restore();
      if (!won) { const p = 0.6 + 0.4 * Math.sin(t * 5); c.save(); c.globalAlpha = s.lockT ? 1 : p; const oc = s.lockT ? '#ffb020' : ok ? '#2ac04a' : '#e8563a';
        sprite(c, outline(s.kind, oc), s.kind, PH * kt); c.restore(); }
      c.restore();
      // the rays: straight lines from the bulb past the puppet's top and bottom to the sheet
      c.save(); c.strokeStyle = 'rgba(255,236,170,0.75)'; c.lineWidth = 2; c.setLineDash([7, 6]); c.lineDashOffset = -t * 30;
      for (const [yy, yw] of [[LY - PH / 2, top], [LY + PH / 2, bot]]) { c.beginPath(); c.moveTo(LX + 6, LY); c.lineTo(WX, yw); c.stroke(); }
      c.restore();
      // the lamp's bulb
      c.save(); c.fillStyle = '#fff6d0'; c.shadowColor = '#ffe08a'; c.shadowBlur = 24; c.beginPath(); c.arc(LX + 6, LY, 9, 0, 7); c.fill(); c.restore();
      // the puppet: a black cardboard cut-out on a stick, in its slot on the table
      c.fillStyle = '#6a4a2a'; c.fillRect(s.px - 2.5, LY + PH / 2 - 4, 5, TABLE - LY - PH / 2 + 2); c.fillStyle = '#3a2418'; c.beginPath(); c.roundRect(s.px - 10, TABLE - 10, 20, 9, 3); c.fill();
      c.save(); c.translate(s.px, LY); sprite(c, N1.silhouette(s.kind, '#1a0e1e'), s.kind, PH); c.restore();
      SK.tag(c, 'Lamp', LX + 8, LY - 52, 18); SK.tag(c, 'Puppet', SK.clamp(s.px, 70, 230), LY - 56, 18);
      // which way to slide: toward the lamp for a bigger shadow, away for a smaller one
      if (!s.lockT && !g.done && !ok) { const d = k < kt ? -1 : 1, ax = s.px + d * 30; N1.farrow(c, s.px + d * 16, TABLE + 22, s.px + d * 52, TABLE + 22, '#ffd45a', 5); SK.tag(c, k < kt ? 'Bigger' : 'Smaller', ax + d * 26, TABLE + 52, 18); }
      if (!g.done) N1.pips(c, 180, 156, s.n, s.doneN);
      // the audience: the rabbit and a hedgehog watching from the floor
      const tiny = s.tinyT && !s.lockT, ex = won ? 'laugh' : lost ? 'sad' : tiny ? 'laugh' : s.lockT ? 'laugh' : 'happy';
      SK.animal(c, 'rabbit', 130, 606, 0.95, { t, pose: won || s.lockT ? 'cheer' : lost ? 'sad' : tiny ? 'hop' : 'idle', expr: ex, facing: 1 });
      SK.animal(c, 'hedgehog', 210, 610, 0.85, { t, phase: 2, pose: won || s.lockT ? 'cheer' : lost ? 'sad' : 'idle', expr: ex, facing: 1 });
      // guidance: grab the puppet and slide it to where its shadow fits
      if (!s.lockT && !g.done) { const tx = SK.clamp(pxFor(kt), RAIL[0], RAIL[1]);
        if (Math.abs(tx - s.px) > 6) { SK.grab(c, g, s.px, LY, 30); SK.target(c, g, tx, TABLE - 4, 16); SK.arrow(c, g, s.px, LY + 36, tx, LY + 36, { from: 0, to: 6 }); }
        SK.demo(g, c, 'drag', [s.px, LY + 6], [tx, LY + 6], { never: Math.abs(tx - s.px) <= 6 }); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.lockT || g.t < 1.0) return; const tx = pxFor(s.ks[s.i]);
      const key = 'slide' + s.i, B = s._bot = s._bot || {}; if (B['at' + key] == null) B['at' + key] = g.t + 0.2;
      SK.bot.drag(g, synth, key, B['at' + key], [s.px, LY], [tx, LY], 0.6);
    },
  });
})();
