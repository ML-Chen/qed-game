// ASSEMBLE! (chem_bio HC-13) — a sandwich counter: piles of bread and cheese, and a plate. Tap the piles to stack a
// sandwich on the plate (two breads and one cheese each). Make as many as you can: the cheese runs out first and bread
// is left over, so the cheese limits how many sandwiches there can be. Add a third bread to one sandwich and the stack
// topples onto the floor, and those slices are lost. Level 1: then the same with molecules: two hydrogen molecules and
// one oxygen make two waters, and the hydrogen runs out first. Level 2: three ingredients (a tomato too).
(() => {
  const PLATE = { x: 180, y: 446 }, TRAY = { x: 180, y: 214 };
  const PHASES = [
    [{ kind: 'sandwich', piles: { bread: 8, cheese: 3 }, recipe: { bread: 2, cheese: 1 }, order: ['bread', 'cheese', 'bread'] }],
    [{ kind: 'sandwich', piles: { bread: 7, cheese: 4 }, recipe: { bread: 2, cheese: 1 }, order: ['bread', 'cheese', 'bread'] },
     { kind: 'water', piles: { H2: 4, O2: 3 }, recipe: { H2: 2, O2: 1 }, order: ['H2', 'O2', 'H2'] }],
    [{ kind: 'sandwich', piles: { bread: 8, cheese: 4, tomato: 3 }, recipe: { bread: 2, cheese: 1, tomato: 1 }, order: ['bread', 'cheese', 'tomato', 'bread'] }],
  ];
  const PILE_X = { 2: [78, 282], 3: [62, 180, 298] };
  function paintBg(o) {
    const wall = o.createLinearGradient(0, 0, 0, 380); wall.addColorStop(0, '#8ad0c8'); wall.addColorStop(1, '#c8ece0'); o.fillStyle = wall; o.fillRect(0, 0, 360, 640);
    o.fillStyle = 'rgba(255,255,255,0.25)'; for (let y = 140; y < 380; y += 36) for (let x = (y / 36) % 2 ? 0 : 18; x < 360; x += 36) o.fillRect(x + 2, y + 2, 32, 32);
    // the shelf where finished things go
    o.fillStyle = '#b87a48'; o.fillRect(30, TRAY.y + 26, 300, 12); o.fillStyle = '#8a5428'; o.fillRect(30, TRAY.y + 38, 300, 4);
    // the counter
    const ct = o.createLinearGradient(0, 380, 0, 640); ct.addColorStop(0, '#f2e2c8'); ct.addColorStop(0.05, '#e0c8a0'); ct.addColorStop(1, '#b89868'); o.fillStyle = ct; o.fillRect(0, 380, 360, 260);
    o.fillStyle = 'rgba(255,255,255,0.4)'; o.fillRect(0, 380, 360, 3);
    P.vignette(o, 360, 640, 0.2, '#2a3a3a');
  }
  // the pieces
  function piece(c, kind, x, y, s = 1, a = 0) {
    c.save(); c.translate(x, y); c.rotate(a); c.scale(s * 1.4, s * 1.4);
    if (kind === 'bread') { c.fillStyle = '#e8b868'; c.strokeStyle = '#9a6a2a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-34, -7, 68, 14, 7); c.fill(); c.stroke(); c.fillStyle = '#f8e0b0'; c.beginPath(); c.roundRect(-30, -5, 60, 7, 4); c.fill(); }
    if (kind === 'cheese') { c.fillStyle = '#ffd040'; c.strokeStyle = '#c89a10'; c.lineWidth = 2; c.beginPath(); c.moveTo(-36, -4); c.lineTo(36, -4); c.lineTo(32, 5); c.lineTo(-32, 5); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#f0b820'; for (const hx of [-18, 4, 22]) { c.beginPath(); c.arc(hx, 0, 2.5, 0, 7); c.fill(); } }
    if (kind === 'tomato') { c.fillStyle = '#e8402a'; c.strokeStyle = '#8a1a10'; c.lineWidth = 2; for (const hx of [-16, 16]) { c.beginPath(); c.ellipse(hx, 0, 15, 5, 0, 0, 7); c.fill(); c.stroke(); } c.fillStyle = '#ffd8c0'; for (const hx of [-16, 16]) { c.beginPath(); c.arc(hx, 0, 2, 0, 7); c.fill(); } }
    if (kind === 'H2') { SK.ball(c, -9, 0, 10, '#f4f4f0', { lw: 1.6 }); SK.ball(c, 9, 0, 10, '#f4f4f0', { lw: 1.6 }); }
    if (kind === 'O2') { SK.ball(c, -11, 0, 13, '#e8483a', { lw: 1.6 }); SK.ball(c, 11, 0, 13, '#e8483a', { lw: 1.6 }); }
    if (kind === 'H2O') { SK.ball(c, -12, 8, 8, '#f4f4f0', { lw: 1.4 }); SK.ball(c, 12, 8, 8, '#f4f4f0', { lw: 1.4 }); SK.ball(c, 0, -1, 13, '#e8483a', { lw: 1.6 }); }
    c.restore();
  }
  const H = { bread: 20, cheese: 13, tomato: 14, H2: 26, O2: 32 };
  function phase(g) { return PHASES[Math.min(2, g.level)][g.s.ph]; }
  function startPhase(g) {
    const s = g.s, P0 = phase(g), kinds = Object.keys(P0.piles), xs = PILE_X[kinds.length];
    s.piles = kinds.map((k, i) => ({ kind: k, n: P0.piles[k], x: xs[i], y: 568 }));
    s.station = []; s.made = 0; s.max = Math.min(...kinds.map(k => Math.floor(P0.piles[k] / P0.recipe[k]))); s.done = []; s.fall = []; s.flies = []; s.endT = 0;
  }
  function nextNeed(s, P0) { const n = {}; for (const k of s.station) n[k] = (n[k] || 0) + 1; for (const k of P0.order) { if (n[k] > 0) n[k]--; else return k; } return null; }
  function canMore(s, P0) { return Object.keys(P0.recipe).every(k => { const p = s.piles.find(p => p.kind === k); return p.n + s.station.filter(x => x === k).length >= P0.recipe[k]; }); }
  MG.add({
    id: 'assemble', stage: 'reactions', cmd: 'ASSEMBLE!', time: 6, mood: 'desert', winText: 'Limiting!', failText: 'Toppled!',
    card: { title: 'What runs out first', kind: 'Chemistry', ref: 'Limiting reactant',
      text: 'Each sandwich takes two slices of bread and one slice of cheese. With eight breads and three cheeses you can make only three sandwiches, because the cheese runs out first. Two breads are left over.\n\nReactions work the same way. Two hydrogen molecules and one oxygen molecule make two water molecules. With four hydrogens and three oxygens you make four waters, and one oxygen is left over. The ingredient that runs out first is called the limiting reactant: it decides how much you can make.',
      note: 'The ingredient that runs out first limits how much product you can make.' },
    init(g) { const s = g.s; s.ph = 0; s.allMade = 0; s.toppleT = -9; startPhase(g); },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || s.endT || s.busy) return; const P0 = phase(g);
      const p = s.piles.find(p => Math.abs(x - p.x) < 52 && y > 470); if (!p || p.n <= 0) { if (p) g.sfx('wrong'); return; }
      p.n--; s.flies.push({ kind: p.kind, x0: p.x, y0: p.y - p.n * 4 - 10, t: g.t });
      const have = s.station.filter(k => k === p.kind).length;
      if (have >= P0.recipe[p.kind]) { // one too many
        if (P0.kind === 'sandwich') { s.fall = s.station.concat([p.kind]).map((k, i) => ({ kind: k, i, t: g.t, dx: (i % 2 ? 1 : -1) * (20 + i * 9) })); s.station = []; s.toppleT = g.t; g.sfx('boing'); g.sfx('thud'); }
        else { p.n++; s.bounce = { kind: p.kind, t: g.t }; g.sfx('boing'); }
      } else { s.station.push(p.kind); g.sfx('pop'); }
    },
    update(g, dt) {
      const s = g.s, P0 = phase(g); if (g.done) return;
      const full = Object.keys(P0.recipe).every(k => s.station.filter(x => x === k).length === P0.recipe[k]);
      if (full && !s.busy) { s.busy = g.t; }
      if (s.busy && g.t - s.busy > 0.4) { s.busy = 0; s.station = []; s.made++; s.allMade++; s.done.push(g.t); g.sfx(P0.kind === 'water' ? 'bubble' : 'ding'); }
      if (!s.busy && !s.endT && !canMore(s, P0)) s.endT = g.t;
      if (s.endT && g.t - s.endT > 0.7) {
        if (s.made < s.max) { g.sfx('fail'); g.fail(); return; }
        const L = PHASES[Math.min(2, g.level)]; if (s.ph + 1 < L.length) { s.ph++; startPhase(g); g.sfx('whoosh'); } else { g.win(); g.sfx('cheer'); }
      }
    },
    draw(g, c) {
      const s = g.s, t = g.t, P0 = phase(g), wat = P0.kind === 'water';
      c.drawImage(g.bake('assemble_bg', paintBg), 0, 0, 360, 640);
      // the finished things on the shelf
      s.done.forEach((dt0, i) => { const k = SK.easeOut((t - dt0) * 3), n = s.done.length, x = TRAY.x + (i - (n - 1) / 2) * (wat ? 84 : 100), y = SK.lerp(PLATE.y - 30, TRAY.y, k);
        if (wat) { piece(c, 'H2O', x - 18, y + 10, 0.65); piece(c, 'H2O', x + 18, y + 8, 0.65); }
        else { let yy = y + 18; for (const kk of P0.order) { piece(c, kk, x, yy, 0.62); yy -= H[kk] * 0.62; } } });
      // the plate, with a dashed ghost of what goes on it
      SK.shadow(c, PLATE.x, PLATE.y + 18, 104, 14, 0.2);
      c.fillStyle = '#fbfbf6'; c.strokeStyle = '#a8b0b8'; c.lineWidth = 2; c.beginPath(); c.ellipse(PLATE.x, PLATE.y + 8, 104, 22, 0, 0, 7); c.fill(); c.stroke(); c.strokeStyle = '#d8e0e4'; c.beginPath(); c.ellipse(PLATE.x, PLATE.y + 8, 74, 13, 0, 0, 7); c.stroke();
      let y = PLATE.y;
      P0.order.forEach((k, i) => { const have = i < s.station.length; if (!have) { c.save(); c.globalAlpha = 0.28 + 0.1 * Math.sin(t * 4); piece(c, k, PLATE.x, y, 1); c.restore(); } y -= H[k]; });
      y = PLATE.y; const sq = s.busy ? SK.easeOut((t - s.busy) * 3) : 0;
      // what is on the plate, in the order it was added; molecules regroup into water as it completes
      if (wat && s.busy) { piece(c, 'H2O', PLATE.x - 22, PLATE.y - 20 * sq, 1); piece(c, 'H2O', PLATE.x + 22, PLATE.y - 20 * sq, 1); }
      else s.station.forEach(k => { piece(c, k, PLATE.x, y - sq * 4, 1); y -= H[k]; });
      // a toppling stack
      for (const f of s.fall) { const q = (t - f.t); if (q > 1.4) continue; const x = PLATE.x + f.dx * q * 2, yy = PLATE.y - f.i * 12 + q * q * 500 * 0.5; if (yy < 660) piece(c, f.kind, x, Math.min(yy, 620), 1, f.dx * q * 0.08); }
      // the piles
      for (const p of s.piles) {
        for (let i = 0; i < p.n; i++) { const yy = p.y - i * (wat ? 22 : H[p.kind] * 0.75) - 6, xx = p.x + Math.sin(i * 2.1) * 3; if (wat) piece(c, p.kind, xx + (i % 2 ? 14 : -14), p.y - Math.floor(i / 2) * 34 - 8, 0.8); else piece(c, p.kind, xx, yy, 0.75); }
        const need = nextNeed(s, P0); if (need === p.kind && !s.busy && !s.endT && p.n > 0) SK.glow(c, g, p.x, p.y - 24, 40);
        if (s.endT && p.n > 0) { c.save(); c.globalAlpha = Math.min(1, (t - s.endT) * 3); c.strokeStyle = '#ff8a5a'; c.lineWidth = 3; c.setLineDash([6, 5]); c.beginPath(); c.ellipse(p.x, p.y - 20, 50, 34, 0, 0, 7); c.stroke(); c.restore(); }
      }
      // pieces flying from a pile to the plate
      for (const f of s.flies) { const q = (t - f.t) * 6; if (q > 1) continue; piece(c, f.kind, SK.lerp(f.x0, PLATE.x, q), SK.lerp(f.y0, PLATE.y - 30, q) - Math.sin(q * Math.PI) * 40, 0.9); }
      if (s.bounce && t - s.bounce.t < 0.6) { const q = (t - s.bounce.t) / 0.6; piece(c, s.bounce.kind, SK.lerp(PLATE.x, 180, q), PLATE.y - 60 - Math.sin(q * Math.PI) * 60, 0.9); }
      const won = g.result === 'win', lost = g.result === 'fail';
      SK.animal(c, 'fox', 322, 376, 0.85, { t, facing: -1, pose: won ? 'cheer' : lost || t - s.toppleT < 1 ? 'sad' : s.busy ? 'hop' : 'idle', expr: won ? 'laugh' : lost || t - s.toppleT < 1 ? 'wow' : 'happy' });
      const need = nextNeed(s, P0), np = s.piles.find(p => p.kind === need);
      SK.demo(g, c, 'tap', np ? [np.x, np.y - 24] : [180, 560], null, { never: !np || np.n <= 0 || !!s.busy || !!s.endT });
    },
    // the bot taps exactly what the plate needs next
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.busy || s.endT || g.t < 1.0) return; const B = s._b = s._b || { n: 0 }; if (g.t < B.n) return;
      const need = nextNeed(s, phase(g)), p = s.piles.find(p => p.kind === need); if (!p || p.n <= 0) return;
      synth('down', p.x, p.y - 20); synth('up', p.x, p.y - 20); B.n = g.t + 0.2;
    },
  });
})();
