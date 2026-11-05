// FLOAT! (physics PE-25) — a lump of clay over a bath, and penguins waiting on the rim for a boat. Drag sideways on the
// clay to spread it: the wider it gets, the lower its walls (there is only so much clay). Let go and it drops in the water.
// A lump (or a tall narrow cup) holds little water out, so it sinks; a wide bowl pushes aside lots of water and floats; a
// flat pancake has walls too low, so water pours over the rim. Then the penguin hops in: the boat sinks lower, and if it
// cannot push aside enough water to hold the extra weight, glug. A real buoyancy rule: it floats while the water it pushes
// aside weighs as much as the boat and its load. Two boats at level 0, three at levels 1 and 2, each carrying more.
(() => {
  const WY = 432, TUB = { x0: 18, x1: 342, y1: 600 }, CL = { x: 196, y: 262 }, PER = 260, MCLAY = 2600, WMIN = 40, WMAX = 250;
  const wallH = w => w < 52 ? 0 : (PER - w) / 2; // fixed clay: a wider boat has lower walls
  const cap = w => w * wallH(w); // how much water (by weight) it can push aside before the rim goes under
  function paintBath(o) {
    const wall = o.createLinearGradient(0, 0, 0, 640); wall.addColorStop(0, '#a8d8f0'); wall.addColorStop(1, '#e8f6ff'); o.fillStyle = wall; o.fillRect(0, 0, 360, 640);
    o.strokeStyle = 'rgba(255,255,255,0.7)'; o.lineWidth = 2; for (let x = 0; x < 360; x += 40) { o.beginPath(); o.moveTo(x, 0); o.lineTo(x, 380); o.stroke(); } for (let y = 0; y < 380; y += 40) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); }
    // a shelf with a little rubber duck and a sponge, and the clay board
    o.fillStyle = '#c8905a'; o.fillRect(0, 196, 110, 10); o.fillStyle = '#ffd45a'; o.beginPath(); o.ellipse(40, 184, 14, 11, 0, 0, 7); o.fill(); o.beginPath(); o.arc(50, 172, 8, 0, 7); o.fill(); o.fillStyle = '#ff8a3a'; o.beginPath(); o.moveTo(57, 172); o.lineTo(64, 174); o.lineTo(57, 176); o.fill();
    o.fillStyle = '#9ad870'; o.beginPath(); o.roundRect(74, 178, 26, 18, 4); o.fill();
    // the tub
    const tg = o.createLinearGradient(0, 380, 0, 620); tg.addColorStop(0, '#ffffff'); tg.addColorStop(1, '#c8d8e8'); o.fillStyle = tg;
    o.beginPath(); o.moveTo(TUB.x0 - 10, 392); o.lineTo(TUB.x1 + 10, 392); o.lineTo(TUB.x1, TUB.y1); o.quadraticCurveTo(180, TUB.y1 + 18, TUB.x0, TUB.y1); o.closePath(); o.fill();
    o.strokeStyle = '#8aa0b8'; o.lineWidth = 2; o.stroke();
    o.fillStyle = '#e8eef4'; o.beginPath(); o.roundRect(TUB.x0 - 14, 384, TUB.x1 - TUB.x0 + 28, 14, 7); o.fill(); o.stroke();
    o.fillStyle = '#c8b090'; for (const x of [44, 316]) { o.beginPath(); o.ellipse(x, TUB.y1 + 18, 14, 8, 0, 0, 7); o.fill(); }
    o.fillStyle = '#a0a8b8'; o.fillRect(TUB.x1 - 34, 352, 8, 34); o.beginPath(); o.roundRect(TUB.x1 - 50, 346, 30, 10, 4); o.fill(); // the tap
  }
  function boatPath(c, w, hw) { // a bowl seen from the side, rim at y = -hw, bottom at y = 0
    const r = w / 2, th = 10;
    c.beginPath(); c.moveTo(-r, -hw); c.bezierCurveTo(-r, -hw * 0.2, -r * 0.6, 0, 0, 0); c.bezierCurveTo(r * 0.6, 0, r, -hw * 0.2, r, -hw);
    c.lineTo(r - th, -hw); c.bezierCurveTo(r - th, -hw * 0.25 - th * 0.2, r * 0.55, -th, 0, -th); c.bezierCurveTo(-r * 0.55, -th, -r + th, -hw * 0.25 - th * 0.2, -r + th, -hw); c.closePath();
  }
  function drawClay(c, x, y, w, rot, wet) {
    const hw = wallH(w); c.save(); c.translate(x, y); c.rotate(rot || 0);
    const cg = c.createLinearGradient(0, -Math.max(hw, 30), 0, 4); cg.addColorStop(0, '#f0a070'); cg.addColorStop(1, wet ? '#a0502a' : '#c0683a');
    c.fillStyle = cg; c.strokeStyle = '#7a3a1a'; c.lineWidth = 2;
    if (hw <= 0) { const r = 26; c.beginPath(); c.ellipse(0, -r * 0.9, r * (w / 40), r, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = 'rgba(255,255,255,0.3)'; c.beginPath(); c.ellipse(-8, -r * 1.3, 8, 5, -0.5, 0, 7); c.fill(); }
    else { boatPath(c, w, hw); c.fill(); c.stroke(); c.strokeStyle = 'rgba(255,220,190,0.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(-w / 2 + 8, -hw + 4); c.quadraticCurveTo(-w * 0.3, -6, 0, -9); c.stroke(); }
    c.restore();
  }
  MG.add({
    id: 'float', stage: 'forces', cmd: 'SHAPE THE CLAY INTO A BOAT!', time: 7, mood: 'sea', winText: 'It floats!', failText: 'Glug!',
    card: { title: 'A boat shape floats', kind: 'Physics', ref: 'Buoyancy',
      text: 'Anything in water pushes some water out of the way, and the water pushes back up on it. That push up is called buoyancy.\n\nA lump of clay pushes aside only a little water, less than its own weight, so it sinks. Spread the same clay into a wide bowl and it pushes aside much more water before the rim goes under, so it floats.\n\nThe heavier the load, the lower the boat sits. Spread the clay too thin and the walls are so low that water pours in.',
      note: 'A thing floats when the water it pushes aside weighs as much as the thing itself.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 4); const c1 = 'crate';
      s.loads = [
        [[[1], [1, c1]], [[1], [1, c1], [1, c1, c1]], [[1, c1], [1, c1, c1], [1, 1]]],
        [[[c1, c1], [1]], [[c1, c1], [1, c1], [1, 1]], [[1, 1], [1, c1], [1, c1, c1]]],
        [[[1, c1], [1]], [[1, c1], [1], [1, c1, c1]], [[1, c1, c1], [1, 1], [1, c1]]],
        [[[c1], [1, c1]], [[c1], [1, c1, c1], [1, c1]], [[c1, c1, c1], [1, 1], [1, c1, c1]]]][s.v][L].map(a => a.map(k => k === 1 ? 'peng' : k));
      s.ri = 0; s.w = WMIN; s.drag = null; s.phase = 'shape'; s.pt = 0; s.y = CL.y; s.water = 0; s.sailX = 0; s.sunk = 0; s.board = 0; s.fails = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.phase !== 'shape') return; if (Math.abs(y - CL.y + 30) < 70 && Math.abs(x - CL.x) < 150) s.drag = { x0: x, w0: s.w }; },
    move(g, x) { const s = g.s; if (!s.drag || s.phase !== 'shape') return; s.w = SK.clamp(s.drag.w0 + 2 * Math.abs(x - s.drag.x0), WMIN, WMAX); g.sfx('rustle', { vol: 0.15 }); },
    up(g) { const s = g.s; if (!s.drag) return; s.drag = null; if (s.phase === 'shape' && s.w > WMIN + 4) { s.phase = 'drop'; s.pt = g.t; g.sfx('whoosh'); } },
    update(g, dt) {
      const s = g.s, e = g.t - s.pt, load = loadOf(s.loads[Math.min(s.ri, s.loads.length - 1)]), C = cap(s.w);
      if (s.phase === 'drop') { const q = SK.clamp(e / 0.35, 0, 1); s.y = SK.lerp(CL.y, WY + draft(s, MCLAY), q * q);
        if (q >= 1) { g.sfx('splash'); g.burst(CL.x, WY, ['#ffffff', '#9ad8f0'], 14, 160); if (C < MCLAY) { s.phase = 'sink'; s.pt = g.t; } else { s.phase = 'board'; s.pt = g.t; } } }
      else if (s.phase === 'board') { // the penguin (and its cargo) hop in; the boat sinks lower
        const q = SK.clamp(e / 0.45, 0, 1); s.board = q; s.y = WY + draft(s, MCLAY + load * SK.easeInOut(q));
        if (q >= 1) { if (C < MCLAY + load) { s.phase = 'sink'; s.pt = g.t; g.sfx('drip'); } else { s.phase = 'sail'; s.pt = g.t; g.sfx('ding'); g.sfx('cheer'); } } }
      else if (s.phase === 'sink') { s.y += 140 * dt; if (e < dt * 1.5) { g.sfx('bubble'); g.sfx('laugh'); } if (e > 0.9) { s.fails++; reset(s, g); } }
      else if (s.phase === 'sail') { s.sailX += 260 * dt * SK.clamp(e * 3, 0, 1); s.y = WY + draft(s, MCLAY + load) + Math.sin(g.t * 6) * 1.5; if (e > 0.6) { s.ri++; if (s.ri >= s.loads.length) { s.phase = 'won'; g.win(); } else reset(s, g); } }
      s.water = SK.lerp(s.water, (s.phase === 'board' || s.phase === 'sail') ? 4 : s.phase === 'drop' ? 0 : 1, Math.min(1, dt * 4));
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', load = s.loads[Math.min(s.ri, s.loads.length - 1)];
      c.drawImage(g.bake('float_bath', paintBath), 0, 0, 360, 640);
      const wy = WY - s.water;
      // the clay, the boat (sailing away to the right after a good build), and what it carries
      const bx = CL.x + s.sailX, onBoat = s.phase === 'board' || s.phase === 'sail' || (s.phase === 'sink' && s.board > 0);
      const hw = wallH(s.w);
      if (s.phase !== 'won') {
        if (s.phase === 'sink') { c.save(); c.globalAlpha = SK.clamp(1 - (t - s.pt) * 0.8, 0.2, 1); }
        drawClay(c, bx, s.y, s.w, s.phase === 'sink' ? Math.sin(t * 8) * 0.15 : 0, s.phase !== 'shape' && s.phase !== 'drop');
        if (onBoat) drawLoad(c, load, bx, s.y - Math.max(hw, 10) + 8, t, s.phase === 'sink', s.board);
        if (s.phase === 'sink') c.restore();
      }
      // the water (drawn over the boat's lower part)
      c.save(); c.globalAlpha = 0.62; const wg = c.createLinearGradient(0, wy, 0, TUB.y1); wg.addColorStop(0, '#6ac8e8'); wg.addColorStop(1, '#2a88b8'); c.fillStyle = wg;
      c.beginPath(); c.moveTo(TUB.x0 + 2, wy); for (let x = TUB.x0 + 2; x <= TUB.x1 - 2; x += 6) c.lineTo(x, wy + Math.sin(x / 18 + t * 3) * 1.6); c.lineTo(TUB.x1 - 4, TUB.y1 - 2); c.quadraticCurveTo(180, TUB.y1 + 14, TUB.x0 + 4, TUB.y1 - 2); c.closePath(); c.fill(); c.restore();
      c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 2; c.beginPath(); for (let x = TUB.x0 + 2; x <= TUB.x1 - 2; x += 6) { const y = wy + Math.sin(x / 18 + t * 3) * 1.6; x === TUB.x0 + 2 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
      if (s.phase === 'sink') for (let i = 0; i < 5; i++) { const q = ((t - s.pt) * 1.5 + i * 0.2) % 1; c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 1.5; c.beginPath(); c.arc(bx - 20 + i * 10, s.y - 10 - q * (s.y - wy), 3 + i % 2 * 2, 0, 7); c.stroke(); }
      // the penguins and crates still waiting on the rim
      if (!onBoat && s.phase !== 'won') drawLoad(c, load, 52, 386, t, false, 0, true);
      SK.animal(c, 'penguin', 312, 386, 0.8, { t, facing: -1, pose: won ? 'cheer' : s.phase === 'sail' ? 'cheer' : 'wave', expr: won || s.phase === 'sail' ? 'laugh' : s.phase === 'sink' ? 'wow' : 'happy' });
      // the clay board while shaping, with stretch arrows; level 0 also shows a good bowl as a dashed outline
      if (s.phase === 'shape' && !g.done) {
        c.fillStyle = '#c8905a'; c.fillRect(CL.x - 130, CL.y + 2, 260, 8);
        if (g.level === 0) { c.save(); c.setLineDash([5, 6]); c.strokeStyle = 'rgba(80,60,40,0.55)'; c.lineWidth = 2; c.translate(CL.x, CL.y); boatPath(c, 140, wallH(140)); c.stroke(); c.restore(); }
        c.save(); c.fillStyle = 'rgba(255,255,255,0.9)'; for (const sd of [-1, 1]) { const ax = CL.x + sd * (s.w / 2 + 22); c.beginPath(); c.moveTo(ax + sd * 12, CL.y - 20); c.lineTo(ax, CL.y - 30); c.lineTo(ax, CL.y - 10); c.closePath(); c.fill(); } c.restore();
        SK.tag(c, 'Clay', CL.x, CL.y - 96, 18);
        SK.grab(c, g, CL.x + s.w / 2, CL.y - 20, 22); SK.target(c, g, CL.x + 70, CL.y - 20, 18); SK.arrow(c, g, CL.x + s.w / 2, CL.y - 20, CL.x + 70, CL.y - 20, { from: 18, to: 20 });
        SK.demo(g, c, 'drag', [CL.x + s.w / 2, CL.y - 20], [CL.x + s.w / 2 + Math.max(0, (140 - s.w) / 2), CL.y - 20]);
      }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.phase !== 'shape') return; const want = 130;
      if (!s._bb || s._bb.ri !== s.ri + s.fails * 10) s._bb = { ri: s.ri + s.fails * 10, t: Math.max(1.0, g.t + 0.15), w0: s.w };
      SK.bot.drag(g, synth, 'sh' + s._bb.ri, s._bb.t, [CL.x + 10, CL.y - 20], [CL.x + 10 + (want - s._bb.w0) / 2, CL.y - 20], 0.35);
    },
  });
  function loadOf(a) { return a.reduce((m, k) => m + (k === 'peng' ? 2800 : 1000), 0); }
  function draft(s, M) { const hw = wallH(s.w); if (hw <= 0) return 0; return Math.min(hw + 6, M / s.w) - hw * 0.0; } // how deep the bottom sits below the waterline
  function reset(s, g) { s.phase = 'shape'; s.w = WMIN; s.y = CL.y; s.sailX = 0; s.board = 0; s.pt = g.t; g.sfx('pop'); }
  function drawLoad(c, a, x, y, t, sinking, board, waiting) {
    const n = a.length; let i = 0;
    for (const k of a) {
      const dx = waiting ? i * 30 : (i - (n - 1) / 2) * 22, hop = !waiting && board < 1 ? -Math.sin(board * Math.PI) * 40 : 0, sx = waiting ? x + dx : SK.lerp(52 + i * 30, x + dx, board);
      if (k === 'peng') SK.animal(c, 'penguin', sx, y + hop, 0.75, { t, phase: i, pose: sinking ? 'hop' : waiting ? 'idle' : 'cheer', expr: sinking ? 'wow' : 'happy', noShadow: !waiting });
      else { c.fillStyle = '#b8803a'; c.strokeStyle = '#5a3a1a'; c.lineWidth = 2; c.beginPath(); c.roundRect(sx - 11, y + hop - 20, 22, 20, 3); c.fill(); c.stroke(); c.fillStyle = '#f0a050'; c.beginPath(); c.ellipse(sx, y + hop - 22, 8, 4, 0, 0, 7); c.fill(); }
      i++;
    }
  }
})();
