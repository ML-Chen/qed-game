// HURRY! (chem_bio APC-17) — a bucket brigade at dusk: buckets go from animal to animal and onto a burning haystack.
// One helper, the turtle, is slow, and the whole line can only go as fast as its slowest step. Tap an animal to hurry it
// along (each tap is a short burst of speed). Hurry the turtle and buckets reach the fire fast enough to put it out.
// Hurry the frog instead and its buckets just pile up in front of the turtle while the fire keeps burning.
// Level 0: frog then turtle; level 1: frog, turtle, rabbit; level 2: the same three in a shuffled order and a bigger fire.
(() => {
  const Y = 470, FIRE = { x: 322, y: Y + 4 }, RATE = { fast: 2.4, slow: 0.12, boost: 2.6 }, NEED = [5, 6, 7];
  const KIND = { frog: 'fast', rabbit: 'fast', turtle: 'slow' };
  function paintBg(o) {
    const sk = o.createLinearGradient(0, 0, 0, 470); sk.addColorStop(0, '#5a3a7a'); sk.addColorStop(0.55, '#e88a6a'); sk.addColorStop(1, '#ffd0a0'); o.fillStyle = sk; o.fillRect(0, 0, 360, 640);
    o.fillStyle = '#fff0c8'; o.beginPath(); o.arc(70, 330, 30, 0, 7); o.fill();
    o.fillStyle = '#a86a6a'; o.beginPath(); o.moveTo(0, 400); o.quadraticCurveTo(90, 360, 180, 392); o.quadraticCurveTo(270, 420, 360, 380); o.lineTo(360, 640); o.lineTo(0, 640); o.fill();
    const gr = o.createLinearGradient(0, 420, 0, 640); gr.addColorStop(0, '#c8b070'); gr.addColorStop(1, '#8a7040'); o.fillStyle = gr; o.beginPath(); o.moveTo(0, 430); o.quadraticCurveTo(180, 410, 360, 430); o.lineTo(360, 640); o.lineTo(0, 640); o.fill();
    const r = P.rng(9); for (let i = 0; i < 40; i++) { o.fillStyle = 'rgba(120,90,40,0.35)'; o.fillRect(r() * 360, 440 + r() * 190, 2 + r() * 8, 1.5); }
    // the well on the left
    o.fillStyle = '#9a8a88'; o.beginPath(); o.roundRect(4, Y - 34, 46, 40, 6); o.fill(); o.strokeStyle = '#5a4a48'; o.lineWidth = 2; o.stroke();
    for (let i = 0; i < 3; i++) { o.strokeStyle = 'rgba(60,40,40,0.4)'; o.beginPath(); o.moveTo(4, Y - 24 + i * 11); o.lineTo(50, Y - 24 + i * 11); o.stroke(); }
    o.fillStyle = '#7a4a2a'; o.fillRect(6, Y - 82, 5, 50); o.fillRect(43, Y - 82, 5, 50); o.fillStyle = '#b8443a'; o.beginPath(); o.moveTo(0, Y - 78); o.lineTo(27, Y - 98); o.lineTo(54, Y - 78); o.fill();
    o.fillStyle = '#4a7ab8'; o.beginPath(); o.ellipse(27, Y - 34, 18, 4, 0, 0, 7); o.fill();
    // the barn behind the haystack
    o.fillStyle = '#b8443a'; o.fillRect(270, 330, 90, 110); o.fillStyle = '#8a2a24'; o.beginPath(); o.moveTo(262, 334); o.lineTo(316, 292); o.lineTo(370, 334); o.fill(); o.strokeStyle = '#fff0e0'; o.lineWidth = 3; o.strokeRect(298, 376, 34, 64);
    P.vignette(o, 360, 640, 0.25, '#3a1a2a');
  }
  function bucket(c, x, y, full = true, s = 1) {
    c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#8aa0b8'; c.strokeStyle = '#3a4a5a'; c.lineWidth = 1.8;
    c.beginPath(); c.moveTo(-9, -10); c.lineTo(9, -10); c.lineTo(7, 8); c.lineTo(-7, 8); c.closePath(); c.fill(); c.stroke(); c.beginPath(); c.arc(0, -10, 9, Math.PI, 0); c.stroke();
    if (full) { c.fillStyle = '#5ab0f0'; c.beginPath(); c.ellipse(0, -10, 8.5, 2.6, 0, 0, 7); c.fill(); } c.restore();
  }
  function hay(c, x, y, k, t) { // the haystack, burning while k > 0
    c.fillStyle = '#e8c060'; c.strokeStyle = '#a8802a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 40, y); c.quadraticCurveTo(x - 42, y - 50, x, y - 62); c.quadraticCurveTo(x + 42, y - 50, x + 40, y); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(160,120,40,0.6)'; c.lineWidth = 1.2; for (let i = 0; i < 9; i++) { const a = -0.9 + i * 0.22; c.beginPath(); c.moveTo(x + Math.sin(a) * 10, y - 54); c.quadraticCurveTo(x + Math.sin(a) * 34, y - 30, x + Math.sin(a) * 40, y - 2); c.stroke(); }
    if (k > 0.01) { B3.glow(c, x, y - 40, 90 * (0.4 + 0.6 * k), '255,130,50', 0.5); for (let i = 0; i < 3; i++) B3.flame(c, x + (i - 1) * 18, y - 30 + Math.abs(i - 1) * 8, 0.9 + (i === 1 ? 0.5 : 0), t, k, i * 2.1); B3.smoke(c, x, y - 90, t, k, '80,70,80', 5, 120); }
    else B3.smoke(c, x, y - 50, t, 0.7, '170,170,180', 5, 110);
  }
  MG.add({
    id: 'hurry', stage: 'reactions', cmd: 'HURRY!', time: 5, mood: 'desert', winText: 'Slowest step!', failText: 'Pile-up!',
    card: { title: 'The slowest step sets the pace', kind: 'Chemistry', ref: 'Rate-determining step',
      text: 'Every bucket has to pass through every helper, so the whole line can only go as fast as its slowest helper. Hurrying the frog makes no difference: its buckets just pile up in front of the turtle. Hurrying the turtle speeds up the whole line.\n\nMany chemical reactions happen in several steps, one after another. The slowest step is called the rate-determining step, and it sets how fast the whole reaction goes. Factories, checkout queues and computer programs work the same way.',
      note: 'In a chain of steps, the slowest step limits the speed of the whole chain.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      let kinds = L === 0 ? ['frog', 'turtle'] : ['frog', 'turtle', 'rabbit'];
      if (L >= 2) for (let i = kinds.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]]; }
      const xs = kinds.length === 2 ? [104, 212] : [84, 160, 236];
      s.a = kinds.map((k, i) => ({ kind: k, x: xs[i], p: 0, busy: false, q: 0, boost: 0, hop: -9 }));
      s.need = NEED[L]; s.hits = 0; s.splash = -9; s.taps = [];
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return; let best = null, bd = 56;
      for (const a of s.a) { const d = SK.dist(x, y, a.x, Y - 30); if (d < bd) { bd = d; best = a; } }
      if (best) { best.boost = Math.min(1.0, best.boost + 0.34); best.hop = g.t; g.sfx('tap'); s.taps.push({ x: best.x, y: Y - 70, t: g.t }); if (s.taps.length > 8) s.taps.shift(); }
    },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      s.a.forEach((a, i) => {
        a.boost = Math.max(0, a.boost - dt);
        if (!a.busy && (i === 0 || a.q > 0)) { a.busy = true; a.p = 0; if (i > 0) a.q--; }
        if (a.busy) { const r = a.boost > 0 ? (KIND[a.kind] === 'slow' ? RATE.boost : RATE.fast * 1.3) : RATE[KIND[a.kind]]; a.p += r * dt;
          if (a.p >= 1) { a.busy = false; a.p = 0; const nx = s.a[i + 1];
            if (nx) { nx.q++; g.sfx('click'); if (nx.q > 4) g.sfx('thud'); }
            else { s.hits++; s.splash = g.t; g.sfx('splash'); if (s.hits >= s.need) { g.win(); g.sfx('cheer'); g.burst(FIRE.x, FIRE.y - 40, ['#5ab0f0', '#fff6ea', '#ffd45a'], 20, 180); } } } }
      });
    },
    draw(g, c) {
      const s = g.s, t = g.t;
      c.drawImage(g.bake('hurry_bg', paintBg), 0, 0, 360, 640);
      hay(c, FIRE.x, FIRE.y, g.result === 'win' ? 0 : 1 - s.hits / s.need * 0.7, t);
      if (t - s.splash < 0.5) { const q = (t - s.splash) * 2; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i - 4.5) * 0.25; c.fillStyle = `rgba(90,176,240,${1 - q})`; c.beginPath(); c.arc(FIRE.x + Math.cos(a) * 50 * q, FIRE.y - 50 + Math.sin(a) * 40 * q + q * q * 30, 4, 0, 7); c.fill(); } }
      // the piles of buckets waiting in front of each helper
      // the helpers, and the bucket each one is carrying to the next
      const won = g.result === 'win', lost = g.result === 'fail';
      s.a.forEach((a, i) => {
        const nx = i + 1 < s.a.length ? s.a[i + 1].x - 18 : FIRE.x - 24, hop = Math.max(0, 1 - (t - a.hop) * 5) * 10, fast = a.boost > 0;
        SK.animal(c, a.kind, a.x, Y + 6 - hop, a.kind === 'turtle' ? 1.3 : 1.2, { t: t * (fast ? 2.5 : 1), phase: i, pose: won ? 'cheer' : lost ? 'sad' : a.busy ? 'carry' : 'idle', expr: won ? 'laugh' : a.q > 3 ? 'wow' : fast ? 'laugh' : KIND[a.kind] === 'slow' ? 'think' : 'happy' });
        if (fast) { c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2.5; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(a.x - 30 - k * 4, Y - 40 + k * 12); c.lineTo(a.x - 46 - k * 4, Y - 40 + k * 12); c.stroke(); } }
        if (a.busy) { const k = a.p, x = SK.lerp(a.x + 8, nx, k), y = Y - 74 - Math.sin(k * Math.PI) * 30; bucket(c, x, y, true, 1.3); }
        if (KIND[a.kind] === 'slow' && !g.done) SK.glow(c, g, a.x, Y - 36, 42);
      });
      // buckets waiting in front of a helper stack up into a wobbly tower
      for (const a of s.a) for (let j = 0; j < Math.min(a.q, 14); j++) { const w = Math.sin(t * 5 + j * 0.4) * j * 1.3; bucket(c, a.x - 36 + w, Y + 16 - j * 17, true, 1.05); }
      for (const tp of s.taps) { const q = (t - tp.t) * 3; if (q > 1) continue; c.save(); c.globalAlpha = 1 - q; c.strokeStyle = '#ffd45a'; c.lineWidth = 3; c.beginPath(); c.arc(tp.x, tp.y, 12 + q * 18, 0, 7); c.stroke(); c.restore(); }
      // how many buckets the fire still needs: drops along the top of the barn
      for (let i = 0; i < s.need; i++) { const x = 210 + i * 20, y = 268, got = i < s.hits; c.fillStyle = got ? '#5ab0f0' : 'rgba(255,255,255,0.35)'; c.beginPath(); c.moveTo(x, y - 9); c.quadraticCurveTo(x + 7, y, x, y + 5); c.quadraticCurveTo(x - 7, y, x, y - 9); c.fill(); }
      const slow = s.a.find(a => KIND[a.kind] === 'slow'); SK.demo(g, c, 'tap', [slow.x, Y - 30], null, { period: 0.5 });
    },
    // the bot mashes the slow helper
    auto(g, dt, synth) { const s = g.s; if (g.done || g.t < 1.0) return; const B = s._b = s._b || { n: 1.0 }; if (g.t < B.n) return; const a = s.a.find(a => KIND[a.kind] === 'slow'); synth('down', a.x, Y - 30); synth('up', a.x, Y - 30); B.n = g.t + 0.14; },
  });
})();
