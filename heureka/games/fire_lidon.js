// LID ON! (chem_bio FP-02) — a pan of cooking oil has caught fire on the stove. Drag the lid from the hook onto the pan:
// the flames go out at once because the lid cuts off the air. Then twist the stove knob to off so the oil stops
// heating. Both, for every burning pan. The cup of water by the sink is a trap: tip it into the oil and the water sinks,
// boils into steam at once and throws burning oil up in a cartoon whoosh (the penguin's eyebrows smoke, unhurt).
// Level 0: two pans; level 1: three; level 2: three, and a pan left burning for 4 s sets the hood alight.
(() => {
  const KY = 566, CUP = { x: 318, y: 342 };
  const LAY = [[[108, 448], [252, 448]], [[86, 462], [274, 462], [180, 400]], [[86, 462], [274, 462], [180, 400]]];
  const HOOK = [[[70, 214], [150, 214]], [[56, 214], [126, 214], [196, 214]], [[56, 214], [126, 214], [196, 214]]];
  function paintBg(o) {
    const wall = o.createLinearGradient(0, 0, 0, 400); wall.addColorStop(0, '#5a8aa8'); wall.addColorStop(1, '#9ac0d0'); o.fillStyle = wall; o.fillRect(0, 0, 360, 640);
    o.strokeStyle = 'rgba(255,255,255,0.18)'; o.lineWidth = 1.5; for (let y = 130; y < 380; y += 26) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); } for (let x = 0; x < 360; x += 26) { o.beginPath(); o.moveTo(x, 130); o.lineTo(x, 380); o.stroke(); }
    // the hood over the stove
    o.fillStyle = '#c8ccd4'; o.beginPath(); o.moveTo(60, 120); o.lineTo(300, 120); o.lineTo(330, 180); o.lineTo(30, 180); o.closePath(); o.fill(); o.fillStyle = '#9aa0aa'; o.fillRect(30, 178, 300, 8);
    // hooks for the lids
    o.fillStyle = '#7a5030'; o.fillRect(30, 196, 200, 8);
    // the counter with a sink on the right
    o.fillStyle = '#e8d8b8'; o.fillRect(0, 372, 360, 14); o.fillStyle = '#a8b8c0'; o.beginPath(); o.ellipse(CUP.x - 6, 376, 30, 6, 0, 0, 7); o.fill();
    o.fillStyle = '#c8ccd4'; o.fillRect(CUP.x + 10, 318, 6, 54); o.fillRect(CUP.x - 12, 318, 28, 6);
    // the stove: a dark hob and a front panel
    const hb = o.createLinearGradient(0, 380, 0, 520); hb.addColorStop(0, '#2a2a32'); hb.addColorStop(1, '#3a3a44'); o.fillStyle = hb; o.beginPath(); o.moveTo(20, 380); o.lineTo(340, 380); o.lineTo(352, 520); o.lineTo(8, 520); o.closePath(); o.fill();
    const fp = o.createLinearGradient(0, 520, 0, 640); fp.addColorStop(0, '#e8e8ec'); fp.addColorStop(1, '#b8bcc4'); o.fillStyle = fp; o.fillRect(8, 520, 344, 120);
    o.fillStyle = '#6a6e78'; o.fillRect(8, 520, 344, 4);
    o.fillStyle = 'rgba(30,30,40,0.25)'; o.beginPath(); o.roundRect(60, 596, 240, 30, 6); o.fill();
    P.vignette(o, 360, 640, 0.25, '#1a2030');
  }
  function lidArt(c, x, y, s = 1) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = '#c8ccd4'; c.strokeStyle = '#5a5e68'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 0, 50, 16, 0, Math.PI, 0); c.lineTo(50, 2); c.ellipse(0, 2, 50, 6, 0, 0, Math.PI); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.ellipse(-18, -8, 14, 4, -0.2, 0, 7); c.fill();
    c.fillStyle = '#2a2a30'; c.beginPath(); c.roundRect(-10, -22, 20, 8, 4); c.fill(); c.restore();
  }
  function knobArt(c, x, y, a, off) {
    c.save(); c.translate(x, y); SK.shadow(c, 2, 4, 22, 8, 0.25); c.fillStyle = '#3a3a44'; c.beginPath(); c.arc(0, 0, 20, 0, 7); c.fill(); c.fillStyle = '#5a5a66'; c.beginPath(); c.arc(-3, -3, 16, 0, 7); c.fill();
    c.rotate(a); c.fillStyle = '#f4f4f8'; c.beginPath(); c.roundRect(-4, -19, 8, 22, 3); c.fill(); c.restore();
    // the marks: off at the top (a ring), high to the right (a flame)
    c.fillStyle = off ? '#7ae08a' : '#e8e8ec'; c.strokeStyle = '#2a2a30'; c.lineWidth = 2; c.beginPath(); c.arc(x, y - 30, 5, 0, 7); c.stroke();
    B3.flame(c, x + 31, y + 6, 0.16, 0, 1);
  }
  MG.add({
    id: 'lidon', stage: 'fire', cmd: 'LID ON, THEN HEAT OFF!', time: 5, mood: 'storm', winText: 'No air, no fire!', failText: 'Water made it worse!',
    card: { title: 'Lid on, heat off, never water', kind: 'Chemistry', ref: 'Fire safety: cooking oil fires',
      text: 'Burning oil needs air, like every fire. A lid slid over the pan cuts off the air, so the flames go out at once. Turning the stove off stops the oil getting hotter, and leaving the lid on lets it cool so it cannot light again.\n\nNever throw water on burning oil. The water sinks under the oil, boils into steam in an instant and throws burning oil into the air. Never carry the pan outside. If the fire is not out at once, get out, close the door and call the fire service.',
      note: 'Smother an oil fire with a lid and turn off the heat. Water makes it explode.' },
    init(g) {
      const L = Math.min(2, g.level), s = g.s;
      s.pans = LAY[L].map(([x, y], i) => ({ x, y, lid: false, off: false, a: 1.6, kx: 0 }));
      const n = s.pans.length, kxs = n === 1 ? [180] : n === 2 ? [108, 252] : [86, 274, 180];
      s.pans.forEach((p, i) => { p.kx = kxs[i]; });
      s.lids = HOOK[L].map(([x, y]) => ({ x, y: y + 22, hx: x, hy: y + 22, on: null }));
      s.cup = { x: CUP.x, y: CUP.y, hx: CUP.x, hy: CUP.y }; s.turn = null; s.flare = 0; s.held = null;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return;
      for (const p of s.pans) if (!p.off && SK.dist(x, y, p.kx, KY) < 36) { s.turn = { p, a0: p.a, q0: Math.atan2(x - p.kx, -(y - KY)) }; return; }
      const l = SK.pick(s.lids.filter(l => !l.on), x, y, 56); if (l) { s.held = l; SK.dragStart(g, l, x, y); g.sfx('tap'); return; }
      if (SK.dist(x, y, s.cup.x, s.cup.y) < 34) { s.held = s.cup; SK.dragStart(g, s.cup, x, y); }
    },
    move(g, x, y) {
      const s = g.s;
      if (s.turn) { const T = s.turn, q = Math.atan2(x - T.p.kx, -(y - KY)); let d = q - T.q0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        T.p.a = SK.clamp(T.a0 + d, 0, 1.6); if (T.p.a <= 0.15 && !T.p.off) { T.p.off = true; T.p.a = 0; g.sfx('click'); s.turn = null; } return; }
      SK.dragMove(g, x, y);
    },
    up(g) {
      const s = g.s; s.turn = null; const d = SK.dragEnd(g), h = s.held; s.held = null; if (!d || !h || g.done) return;
      const p = s.pans.slice().sort((a, b) => SK.dist(h.x, h.y, a.x, a.y - 30) - SK.dist(h.x, h.y, b.x, b.y - 30))[0];
      const near = p && SK.dist(h.x, h.y, p.x, p.y - 30) < 70;
      if (h === s.cup) { if (near && !p.lid) { s.flare = { t: g.t, p }; g.sfx('whoosh'); g.sfx('fire'); g.shake(8, 0.5); h.x = p.x + 30; h.y = p.y - 60; } else { h.back = true; } return; }
      if (near && !p.lid) { p.lid = true; h.on = p; h.x = p.x; h.y = p.y - 26; p.lidT = g.t; g.sfx('thud'); g.sfx('click'); } else h.back = true;
    },
    update(g, dt) {
      const s = g.s;
      for (const o of [...s.lids, s.cup]) if (o.back && !SK.dragging(g)) { o.x += (o.hx - o.x) * Math.min(1, dt * 12); o.y += (o.hy - o.y) * Math.min(1, dt * 12); if (SK.dist(o.x, o.y, o.hx, o.hy) < 1) o.back = false; }
      for (const p of s.pans) { if (p.lid && p.off) p.cool = Math.min(1, (p.cool || 0) + dt * 2); }
      if (g.level >= 2 && !s.flare && !g.done) { const p = s.pans.find(p => !p.lid); if (p && g.t > 4.2) { s.flare = { t: g.t, p }; g.sfx('fire'); g.sfx('whoosh'); } }
      if (s.flare && !g.done && g.t - s.flare.t > 0.9) { g.sfx('laugh'); g.fail(); }
      if (!g.done && !s.flare && s.pans.every(p => p.lid && p.off)) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t;
      c.drawImage(g.bake('lidon_bg', paintBg), 0, 0, 360, 640);
      // the pans: burners glow while on; the oil burns until the lid is on
      const pans = s.pans.slice().sort((a, b) => a.y - b.y);
      for (const p of pans) {
        if (!p.off) B3.glow(c, p.x, p.y + 6, 60, '255,90,40', 0.45);
        c.strokeStyle = p.off ? '#4a4a54' : '#ff6a3a'; c.lineWidth = 3; c.beginPath(); c.ellipse(p.x, p.y + 6, 44, 12, 0, 0, 7); c.stroke();
        c.fillStyle = '#2a2a30'; c.beginPath(); c.roundRect(p.x + 44, p.y - 22, 46, 9, 4); c.fill();
        const pg = c.createLinearGradient(p.x - 48, 0, p.x + 48, 0); pg.addColorStop(0, '#5a5e68'); pg.addColorStop(0.4, '#9aa0aa'); pg.addColorStop(1, '#4a4e58'); c.fillStyle = pg; c.beginPath(); c.moveTo(p.x - 48, p.y - 26); c.lineTo(p.x + 48, p.y - 26); c.lineTo(p.x + 42, p.y + 4); c.quadraticCurveTo(p.x, p.y + 14, p.x - 42, p.y + 4); c.closePath(); c.fill();
        c.fillStyle = '#e8b040'; c.beginPath(); c.ellipse(p.x, p.y - 26, 48, 12, 0, 0, 7); c.fill(); c.strokeStyle = '#3a3e48'; c.lineWidth = 2; c.stroke();
        if (!p.lid) { B3.glow(c, p.x, p.y - 50, 90, '255,140,50', 0.45); for (let i = 0; i < 3; i++) B3.flame(c, p.x + (i - 1) * 22, p.y - 22, i === 1 ? 1.5 : 1.0, t, 1, i * 2 + p.x); }
        else { const q = SK.clamp((t - p.lidT) * 2, 0, 1); if (q < 1 || !p.off) B3.smoke(c, p.x + 30, p.y - 40, t, p.off ? 1 - q : 0.6, '120,120,130', 4, 60); }
      }
      if (s.flare) { const q = Math.min(1, (t - s.flare.t) * 2), p = s.flare.p; B3.glow(c, p.x, p.y - 120, 200 * q, '255,160,60', 0.6); B3.flame(c, p.x, p.y - 20, 3.6 * q, t, 1, 4); B3.smoke(c, p.x, p.y - 200, t, q, '240,240,250', 6, 120); }
      // the lids: on the hooks, in the hand, or on a pan
      for (const l of s.lids) { if (!l.on && !SK.dragging(g)) { c.strokeStyle = '#3a2a1a'; c.lineWidth = 2; c.beginPath(); c.moveTo(l.hx, l.hy - 30); c.lineTo(l.hx, l.hy - 18); c.stroke(); } lidArt(c, l.x, l.y, l.on ? 1 : 0.62); }
      // the cup of water
      const cp = s.cup, tip = s.flare ? 1.6 : 0; c.save(); c.translate(cp.x, cp.y); c.rotate(-tip); c.fillStyle = 'rgba(220,240,255,0.85)'; c.strokeStyle = '#6a8aa8'; c.lineWidth = 2; c.beginPath(); c.moveTo(-14, -18); c.lineTo(14, -18); c.lineTo(11, 18); c.lineTo(-11, 18); c.closePath(); c.fill(); c.stroke(); if (!s.flare) { c.fillStyle = '#5ab0f0'; c.fillRect(-12, -6, 24, 22); } c.restore();
      // the knobs
      for (const p of s.pans) knobArt(c, p.kx, KY, p.a, p.off);
      // the penguin by the sink
      const won = g.result === 'win', lost = g.result === 'fail';
      SK.animal(c, 'penguin', 300, 372, 0.8, { t, facing: -1, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost || s.flare ? 'wow' : 'think' });
      if (lost) { B3.smoke(c, 292, 316, t, 0.8, '60,60,70', 3, 30); }
      // guidance: the next lid to its pan, or the next knob to off
      const np = s.pans.find(p => !p.lid), nl = s.lids.find(l => !l.on), nk = s.pans.find(p => p.lid && !p.off) || s.pans.find(p => !p.off);
      if (np && nl && !SK.dragging(g)) { SK.grab(c, g, nl.x, nl.y, 34); SK.target(c, g, np.x, np.y - 28, 0, { w: 112, h: 44 }); SK.arrow(c, g, nl.x, nl.y, np.x, np.y - 28, { to: 40 }); }
      else if (nk) { SK.grab(c, g, nk.kx + 22, KY, 14); SK.target(c, g, nk.kx, KY - 30, 10); SK.arrow(c, g, nk.kx + 26, KY - 4, nk.kx + 6, KY - 30, { from: 4, to: 12 }); }
      SK.tag(c, 'Water', s.cup.x, s.cup.y + 36, 18); SK.tag(c, 'Lid', s.lids[0].hx, 176, 18);
      if (np && nl) SK.demo(g, c, 'drag', [nl.hx, nl.hy], [np.x, np.y - 30], { never: !!s.flare });
      else if (nk) SK.demo(g, c, 'drag', [nk.kx + 24, KY], [nk.kx, KY - 24], { arc: 10, never: !!s.flare });
      else SK.demo(g, c, 'tap', [180, 300], null, { never: true });
    },
    // the bot: every lid onto its pan, then every knob a quarter turn to off
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 1.0) return; const B = s._b = s._b || { n: 1.0 }; if (g.t < B.n) return;
      if (B.job) { const J = B.job, k = Math.min(1, (g.t - J.t0) / J.d);
        if (J.kind === 'lid') synth('move', SK.lerp(J.a[0], J.b[0], k), SK.lerp(J.a[1], J.b[1], k));
        else { const an = SK.lerp(1.6, -0.1, k); synth('move', J.kx + Math.sin(an) * 24, KY - Math.cos(an) * 24); }
        if (k >= 1) { synth('up', J.b[0], J.b[1]); B.job = null; B.n = g.t + 0.12; } return; }
      const np = s.pans.find(p => !p.lid), nl = s.lids.find(l => !l.on && !l.back);
      if (np && nl) { B.job = { kind: 'lid', a: [nl.x, nl.y], b: [np.x, np.y - 30], t0: g.t, d: 0.3 }; synth('down', nl.x, nl.y); return; }
      const nk = s.pans.find(p => !p.off); if (nk) { B.job = { kind: 'knob', kx: nk.kx, b: [nk.kx, KY - 24], t0: g.t, d: 0.3 }; synth('down', nk.kx + 24, KY); }
    },
  });
})();
