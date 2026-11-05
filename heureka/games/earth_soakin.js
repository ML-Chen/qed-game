// PLANT GRASS TO STOP THE FLOOD! (earth EE ES-27 SOAK IN!) — a car park seen from above in a rainstorm. Rain on the paving
// can't soak in, so every paved tile sends a stream sliding down to the one storm drain, and the drain backs up: water
// bubbles out of the grate and spreads over the street. Tap paving tiles to dig them up and plant grass, flowers or a
// rain garden: rain on those tiles soaks into the soil (drops sink in), and their streams stop. When the water reaching
// the drain is no more than it can take (the flow bar drops below the drain's line), the drain calms and the street
// drains. Tap a planted tile and it is paved over again. Parked cars cover some tiles. Level 1 needs more tiles planted;
// level 2 is a bigger storm, so more still and the drain backs up faster.
(() => {
  const COLS = 4, ROWS = 4, TS = 64, LX = 52, LY = 214, DRAIN = { x: 180, y: 500 }, BAR = { x: 70, y: 566, w: 220 };
  const CARS = [[1, 6, 11], [2, 4, 13], [0, 7, 9], [3, 5, 14]], NEED = [4, 5, 7], RATE = [0.012, 0.01, 0.02];
  const tileXY = i => [LX + (i % COLS) * TS + TS / 2, LY + Math.floor(i / COLS) * TS + TS / 2];
  function paintBg(o) {
    const sky = o.createLinearGradient(0, 0, 0, 640); sky.addColorStop(0, '#4a5a7a'); sky.addColorStop(1, '#7a8a9a'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    // grass verges and a street along the bottom, seen from above
    o.fillStyle = '#5a8a4a'; o.fillRect(0, 150, 360, 380); const r = P.rng(8); for (let i = 0; i < 80; i++) { o.fillStyle = r() < 0.5 ? 'rgba(40,80,30,0.4)' : 'rgba(140,190,90,0.35)'; o.beginPath(); o.arc(r() * 360, 150 + r() * 380, 2 + r() * 3, 0, 7); o.fill(); }
    for (const [x, y] of [[22, 190], [338, 230], [20, 420], [340, 470]]) { o.fillStyle = '#2a5a2a'; o.beginPath(); o.arc(x, y, 22, 0, 7); o.fill(); o.fillStyle = '#4a8a3a'; o.beginPath(); o.arc(x - 5, y - 5, 15, 0, 7); o.fill(); }
    o.fillStyle = '#3a3a44'; o.fillRect(0, 530, 360, 110); o.fillStyle = '#e8e0a0'; for (let x = 10; x < 360; x += 50) o.fillRect(x, 588, 26, 5);
    o.fillStyle = '#8a8a90'; o.fillRect(0, 524, 360, 8);
    // the car park's edge
    o.fillStyle = '#4a4a52'; o.beginPath(); o.roundRect(LX - 10, LY - 10, COLS * TS + 20, ROWS * TS + 20 + 30, 10); o.fill();
    o.fillStyle = '#5a5a62'; o.fillRect(DRAIN.x - 40, LY + ROWS * TS, 80, 40);
  }
  function paver(c, x, y, wet, t) { c.fillStyle = '#7a7880'; c.fillRect(x - TS / 2 + 1, y - TS / 2 + 1, TS - 2, TS - 2); c.strokeStyle = 'rgba(40,36,48,0.4)'; c.lineWidth = 1.5; c.strokeRect(x - TS / 2 + 1, y - TS / 2 + 1, TS - 2, TS - 2);
    c.fillStyle = `rgba(170,200,230,${0.15 + 0.2 * wet})`; c.beginPath(); c.ellipse(x - 8, y + 6, 16, 6, 0.3, 0, 7); c.fill(); }
  function plot(c, x, y, deco, k, t) { // grass, flowers or a little rain garden, popping up as k goes 0..1
    c.fillStyle = '#5a3a24'; c.fillRect(x - TS / 2 + 1, y - TS / 2 + 1, TS - 2, TS - 2);
    c.save(); c.translate(x, y); c.scale(0.4 + 0.6 * k, 0.4 + 0.6 * k);
    c.fillStyle = '#5aa840'; c.beginPath(); c.roundRect(-TS / 2 + 3, -TS / 2 + 3, TS - 6, TS - 6, 10); c.fill();
    c.strokeStyle = '#3a8a2a'; c.lineWidth = 2; for (let i = 0; i < 9; i++) { const gx = -22 + (i % 3) * 22 + (i * 7) % 5, gy = -20 + Math.floor(i / 3) * 20; c.beginPath(); c.moveTo(gx, gy + 6); c.lineTo(gx - 2, gy - 2 + Math.sin(t * 3 + i) * 1.5); c.moveTo(gx + 3, gy + 6); c.lineTo(gx + 4, gy - 1); c.stroke(); }
    if (deco === 1) for (const [fx, fy, col] of [[-12, -10, '#ff7aa0'], [12, 4, '#ffd45a'], [-4, 14, '#c88aff']]) { c.fillStyle = col; for (let p = 0; p < 5; p++) { c.beginPath(); c.arc(fx + Math.cos(p * 1.26) * 4, fy + Math.sin(p * 1.26) * 4, 3, 0, 7); c.fill(); } c.fillStyle = '#fff6a0'; c.beginPath(); c.arc(fx, fy, 2, 0, 7); c.fill(); }
    if (deco === 2) { c.fillStyle = '#4a8ab8'; c.beginPath(); c.ellipse(0, 2, 18, 12, 0, 0, 7); c.fill(); c.fillStyle = '#7ab8e0'; c.beginPath(); c.ellipse(-4, -1, 8, 4, 0, 0, 7); c.fill(); c.fillStyle = '#3a7a2a'; for (const a of [0, 2.1, 4.2]) { c.beginPath(); c.ellipse(Math.cos(a) * 20, Math.sin(a) * 14, 7, 4, a, 0, 7); c.fill(); } }
    if (deco === 3) { c.fillStyle = '#2a6a2a'; c.beginPath(); c.arc(0, 0, 20, 0, 7); c.fill(); c.fillStyle = '#4a9a3a'; c.beginPath(); c.arc(-5, -5, 13, 0, 7); c.fill(); }
    c.restore();
  }
  function car(c, x, y, col) { c.fillStyle = '#7a7880'; c.fillRect(x - TS / 2 + 1, y - TS / 2 + 1, TS - 2, TS - 2); c.strokeStyle = '#e8e8f0'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - TS / 2 + 4, y - TS / 2 + 2); c.lineTo(x - TS / 2 + 4, y + TS / 2 - 2); c.stroke();
    c.fillStyle = 'rgba(20,20,30,0.3)'; c.beginPath(); c.roundRect(x - 17, y - 25, 38, 54, 10); c.fill(); c.fillStyle = col; c.strokeStyle = P.shade(col, -0.5); c.lineWidth = 2; c.beginPath(); c.roundRect(x - 19, y - 28, 38, 54, 10); c.fill(); c.stroke();
    c.fillStyle = '#a8d0f0'; c.beginPath(); c.roundRect(x - 14, y - 18, 28, 12, 4); c.fill(); c.beginPath(); c.roundRect(x - 13, y + 10, 26, 9, 4); c.fill(); }
  MG.add({
    id: 'earth_soakin', stage: 'earth', cmd: 'PLANT GRASS TO STOP THE FLOOD!', time: 6, mood: 'storm', winText: 'It soaks in!', failText: 'Flooded!',
    card: { title: 'Let the rain soak in', kind: 'Earth science', ref: 'Runoff and permeable ground',
      text: "Rain that falls on soil soaks into the ground. Plant roots and the tiny gaps between bits of soil take the water in, and it seeps down slowly.\n\nRain that falls on concrete, tarmac or roofs can't soak in. It all runs off at once into storm drains. In a big storm the drains can't take it fast enough, and streets flood.\n\nCities fight floods by swapping some hard ground for grass, trees and rain gardens: dips full of plants that catch the water and let it soak in.",
      note: 'Soil and plants soak up rain, but hard ground sends it all rushing into drains, which can overflow.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level), v = SK.variant(g, 4), cars = CARS[v];
      s.tiles = []; for (let i = 0; i < COLS * ROWS; i++) s.tiles.push({ k: cars.includes(i) ? 'car' : 'pave', t: -9, deco: Math.floor(g.rand() * 4) % 4, col: ['#e8563a', '#3a8ae8', '#f0c040'][cars.indexOf(i) % 3] });
      const paved = s.tiles.filter(q => q.k !== 'grass').length; s.cap = paved - NEED[L]; s.rate = RATE[L]; s.lvl = 0; s.flow = paved; s.calmT = 0; s.drops = [];
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return; const cx = Math.floor((x - LX) / TS), cy = Math.floor((y - LY) / TS); if (cx < 0 || cx >= COLS || cy < 0 || cy >= ROWS) return;
      const q = s.tiles[cy * COLS + cx]; if (q.k === 'car') { g.sfx('honk', { vol: 0.4 }); return; }
      q.k = q.k === 'pave' ? 'grass' : 'pave'; q.t = g.t; g.sfx(q.k === 'grass' ? 'grow' : 'thud'); if (q.k === 'grass') g.burst(...tileXY(cy * COLS + cx), ['#5aa840', '#8a5a34', '#ffd45a'], 10, 110);
      const paved = s.tiles.filter(q => q.k !== 'grass').length; if (paved <= s.cap) { s.calmT = g.t; g.win(); g.sfx('cheer'); }
    },
    update(g, dt) {
      const s = g.s, paved = s.tiles.filter(q => q.k !== 'grass').length, rain = SK.clamp(0.5 + g.t / 6, 0, 1);
      s.flow = SK.lerp(s.flow, paved, 1 - Math.exp(-dt * 6));
      if (!g.done) { s.lvl = SK.clamp(s.lvl + (paved - s.cap) * s.rate * rain * dt, 0, 1); if (s.lvl >= 1) { g.fail(); g.sfx('splash'); g.sfx('laugh'); } }
      else if (g.result === 'win') s.lvl = Math.max(0, s.lvl - dt * 0.6);
      // raindrops soaking into planted tiles
      for (let i = 0; i < s.tiles.length; i++) if (s.tiles[i].k === 'grass' && g.rand() < dt * 4) { const [x, y] = tileXY(i); s.drops.push({ x: x + (g.rand() - 0.5) * 44, y: y + (g.rand() - 0.5) * 44, t: g.t }); }
      s.drops = s.drops.filter(d => g.t - d.t < 0.6);
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('soakin_bg', paintBg), 0, 0, 360, 640);
      s.tiles.forEach((q, i) => { const [x, y] = tileXY(i); if (q.k === 'car') car(c, x, y, q.col); else if (q.k === 'pave') paver(c, x, y, 1, t); else plot(c, x, y, q.deco, SK.clamp((t - q.t) * 5, 0, 1), t); });
      for (const d of s.drops) { const k = (t - d.t) / 0.6; c.fillStyle = `rgba(150,210,255,${0.8 * (1 - k)})`; c.beginPath(); c.ellipse(d.x, d.y + k * 4, 2.5 * (1 - k) + 1, 3 * (1 - k) + 1, 0, 0, 7); c.fill(); }
      // runoff: a stream from every paved (or car) tile down to the drain
      if (!won) { c.save(); c.strokeStyle = 'rgba(140,200,255,0.65)'; c.lineWidth = 3; c.setLineDash([8, 10]); c.lineDashOffset = -t * 60; s.tiles.forEach((q, i) => { if (q.k === 'grass') return; const [x, y] = tileXY(i); c.beginPath(); c.moveTo(x, y + 10); c.quadraticCurveTo(x, DRAIN.y - 20, DRAIN.x + (x - DRAIN.x) * 0.15, DRAIN.y - 8); c.stroke(); }); c.restore(); }
      // the drain grate, bubbling over as it backs up, and the flood on the street
      c.fillStyle = '#2a2a30'; c.beginPath(); c.roundRect(DRAIN.x - 26, DRAIN.y - 10, 52, 20, 4); c.fill(); c.strokeStyle = '#8a8a90'; c.lineWidth = 2; for (let i = -20; i <= 20; i += 8) { c.beginPath(); c.moveTo(DRAIN.x + i, DRAIN.y - 8); c.lineTo(DRAIN.x + i, DRAIN.y + 8); c.stroke(); }
      if (s.lvl > 0.25) { const k = (s.lvl - 0.25) / 0.75; for (let i = 0; i < 4; i++) { const a = t * 6 + i * 1.6; c.fillStyle = 'rgba(140,200,255,0.7)'; c.beginPath(); c.arc(DRAIN.x - 15 + i * 10, DRAIN.y - 8 - Math.abs(Math.sin(a)) * 14 * k, 4, 0, 7); c.fill(); } }
      if (s.lvl > 0.05) { const w = 40 + s.lvl * 360, gr = c.createRadialGradient(DRAIN.x, DRAIN.y + 40, 10, DRAIN.x, DRAIN.y + 40, w); gr.addColorStop(0, 'rgba(90,150,210,0.75)'); gr.addColorStop(1, 'rgba(90,150,210,0)'); c.fillStyle = gr; c.fillRect(0, DRAIN.y + 10, 360, 130); }
      // rain over everything
      c.save(); c.strokeStyle = 'rgba(210,225,255,0.45)'; c.lineWidth = 1.5; for (let i = 0; i < 60; i++) { const x = (i * 37 + t * 40) % 380 - 10, y = (i * 91 + t * 520) % 520 + 120; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 4, y + 14); c.stroke(); } c.restore();
      P.cloud(c, 80, 132, 0.6, '#9aa0b8', '#6a7088'); P.cloud(c, 270, 128, 0.7, '#9aa0b8', '#6a7088');
      // the flow bar: how much water reaches the drain, and the line it can take
      const nmax = s.tiles.length, fx = n => BAR.x + BAR.w * SK.clamp(n / nmax, 0, 1), over = s.flow > s.cap + 0.05;
      c.fillStyle = 'rgba(20,20,30,0.7)'; c.beginPath(); c.roundRect(BAR.x - 6, BAR.y - 12, BAR.w + 12, 24, 12); c.fill();
      c.fillStyle = over ? '#5aa0e8' : '#8affb0'; c.beginPath(); c.roundRect(BAR.x, BAR.y - 6, Math.max(8, fx(s.flow) - BAR.x), 12, 6); c.fill();
      c.fillStyle = '#ffd45a'; c.fillRect(fx(s.cap) - 2, BAR.y - 15, 4, 30);
      SK.tag(c, 'Into drain', BAR.x + 34, BAR.y - 30, 18); SK.tag(c, 'Drain', DRAIN.x + 66, DRAIN.y, 18);
      if (!won) { const left = s.tiles.filter(q => q.k !== 'grass').length - s.cap; SK.tag(c, left + ' more', fx(s.cap) + 6, BAR.y + 32, 18, '#fff6ea', 'rgba(30,14,36,0.8)'); }
      SK.animal(c, 'duck', 322, 616, 0.7, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : s.lvl > 0.5 ? 'wow' : 'think', facing: -1 });
      // guidance: tap the next paved tile (the one nearest the drain)
      if (!g.done) { let best = -1, bd = 1e9; s.tiles.forEach((q, i) => { if (q.k !== 'pave') return; const [x, y] = tileXY(i), d = SK.dist(x, y, DRAIN.x, DRAIN.y); if (d < bd) { bd = d; best = i; } });
        if (best >= 0) { const [x, y] = tileXY(best); SK.glow(c, g, x, y, 28, undefined, { level: 2 }); if (s.tiles.every(q => q.k !== 'grass')) SK.tag(c, 'Paving', x, y - 44, 18); SK.demo(g, c, 'tap', [x, y + 4]); } }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 1.0) return; const B = s._bot = s._bot || {}; if (B.last && g.t - B.last < 0.25) return;
      const i = s.tiles.findIndex(q => q.k === 'pave'); if (i < 0) return; const [x, y] = tileXY(i); B.last = g.t; synth('down', x, y); synth('up', x, y);
    },
  });
})();
