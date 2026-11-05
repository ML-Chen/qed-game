// SLAM THE CAP BELOW THE RENT! (business MI-08, a price ceiling) — a block of flats with a tall rent gauge beside it.
// The coin marker shows today's market rent: at that rent, as many people want a flat as there are flats to rent. The
// Rent cap bar slides up and down the gauge; tap to slam it down where it is. Below the market rent it pushes the rent
// down: more people now want a flat, a few landlords stop renting (boarded windows), and the extra renters queue in a
// line outside (a shortage). Slam it above the market rent and nothing changes: the bar just dangles there.
// Three blocks, each with a different market rent. Levels 1 and 2: the bar slides faster.
(() => {
  const G = { x: 312, y0: 222, y1: 486 }, BLD = { x: 186, w: 150, y0: 218, y1: 500 }, FLATS = 12;
  const RENTS = [[0.62, 0.74, 0.55], [0.7, 0.56, 0.78], [0.58, 0.72, 0.66], [0.76, 0.6, 0.68], [0.66, 0.54, 0.74]];
  const COLS = ['#e8a070', '#a8c0e0', '#d8a8c8', '#c8d890', '#f0c870'];
  const ry = r => SK.lerp(G.y1, G.y0, r);
  const PER = [2.8, 2.2, 1.7];
  function paintCity(o) {
    const sky = o.createLinearGradient(0, 0, 0, 500); sky.addColorStop(0, '#7ab0d8'); sky.addColorStop(0.6, '#b8d8ec'); sky.addColorStop(1, '#f0f6e8'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    P.cloud(o, 70, 170, 0.5); P.cloud(o, 260, 140, 0.4);
    for (let i = 0; i < 7; i++) { o.fillStyle = `rgba(120,150,190,${0.35 + (i % 2) * 0.1})`; const h = 90 + (i * 37) % 80; o.fillRect(i * 54 - 10, 500 - h - 40, 46, h + 40); }
    const gr = o.createLinearGradient(0, 500, 0, 640); gr.addColorStop(0, '#c8c0b0'); gr.addColorStop(1, '#a8a090'); o.fillStyle = gr; o.fillRect(0, 500, 360, 140);
    o.fillStyle = '#e8e0d0'; o.fillRect(0, 500, 360, 8); o.fillStyle = '#7aa860'; o.fillRect(0, 610, 360, 30);
    // the rent gauge
    o.fillStyle = 'rgba(30,14,36,0.6)'; o.beginPath(); o.roundRect(G.x - 22, G.y0 - 16, 44, G.y1 - G.y0 + 32, 14); o.fill();
    o.fillStyle = '#e8e0d0'; o.fillRect(G.x - 4, G.y0, 8, G.y1 - G.y0);
    for (let i = 0; i <= 10; i++) { o.fillStyle = '#e8e0d0'; o.fillRect(G.x - 14, SK.lerp(G.y1, G.y0, i / 10) - 1, i % 5 ? 8 : 12, 2); }
  }
  function block(c, x, y0, y1, w, col, board, lit) {
    c.fillStyle = col; c.strokeStyle = P.shade(col, -0.5); c.lineWidth = 3; c.beginPath(); c.rect(x - w / 2, y0, w, y1 - y0); c.fill(); c.stroke();
    c.fillStyle = P.shade(col, -0.3); c.fillRect(x - w / 2 - 6, y0 - 10, w + 12, 12);
    let k = 0; for (let r = 0; r < 4; r++) for (let q = 0; q < 3; q++, k++) { const wx = x - w / 2 + 18 + q * 44, wy = y0 + 22 + r * 58;
      if (k >= FLATS - board) { c.fillStyle = '#8a6a4a'; c.fillRect(wx, wy, 28, 34); c.strokeStyle = '#5a3a20'; c.lineWidth = 3; c.beginPath(); c.moveTo(wx, wy + 4); c.lineTo(wx + 28, wy + 30); c.moveTo(wx + 28, wy + 4); c.lineTo(wx, wy + 30); c.stroke(); continue; }
      c.fillStyle = k < lit ? '#ffe9a0' : '#5a7aa0'; c.fillRect(wx, wy, 28, 34); c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(wx + 2, wy + 2, 8, 12); }
    c.fillStyle = '#5a3a2a'; c.fillRect(x - 16, y1 - 46, 32, 46);
  }
  MG.add({
    id: 'caprent', stage: 'markets', cmd: 'SLAM THE CAP BELOW THE RENT!', time: 7, mood: 'desert', winText: 'Rents capped, and a queue formed!', failText: 'The cap never bit!', hold: 1.7,
    card: { title: 'A cap on rent', kind: 'Economics', ref: 'Price ceilings',
      text: 'A price ceiling is a law that a price can\'t go above a set level. A cap below the market rent does lower the rent for people who have a flat.\n\nBut at the lower rent, more people want a flat, and some owners stop renting theirs out or build fewer new ones. So there are more renters than flats: a shortage, and a queue.\n\nA cap set above the market rent changes nothing. Supporters say caps protect tenants from sudden rises; critics point to shortages and fewer new homes. Economists still argue about how large these effects are.',
      note: 'A price cap set below the market price makes the thing cheaper but scarcer: more people want it than can get it.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 5); s.L = L; s.rents = RENTS[s.v]; s.bi = 0; this.newBlock(g, 0);
    },
    newBlock(g, slide) { const s = g.s; s.m = s.rents[s.bi]; s.phase = 'swing'; s.pt = g.t; s.ph0 = g.t + g.rand() * PER[s.L]; s.cap = null; s.slide = slide; s.walk = 0; s.miss = 0; },
    barR(g) { const s = g.s; return 0.52 + 0.44 * Math.sin((g.t - s.ph0) / PER[s.L] * Math.PI * 2); },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || s.phase !== 'swing' || g.t - s.pt < 0.3) return;
      const r = this.barR(g); s.cap = r; s.pt = g.t; g.sfx('thud'); g.shake(4, 0.15);
      if (r < s.m - 0.03) { s.phase = 'bite'; g.sfx('click'); } else { s.phase = 'dangle'; g.sfx('boing', { vol: 0.5 }); }
    },
    update(g, dt) {
      const s = g.s;
      if (g.done) return;
      if (s.phase === 'bite' && g.t - s.pt > 1.5) { s.bi++; if (s.bi >= s.rents.length) { g.win(); g.sfx('cheer'); } else { this.newBlock(g, 1); g.sfx('pop'); } }
      else if (s.phase === 'dangle' && g.t - s.pt > 1.1) { s.phase = 'swing'; s.pt = g.t; s.cap = null; }
    },
    gap(s) { if (s.phase !== 'bite' && !(s.phase === 'swing' && false)) return { D: FLATS, S: FLATS }; const d = s.m - s.cap; return { D: Math.min(22, Math.round(FLATS * (1 + d * 1.5))), S: Math.max(5, Math.round(FLATS * (1 - d * 0.9))) }; },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', bite = s.phase === 'bite' || (won && s.cap != null), k = bite ? SK.clamp((t - s.pt) / 0.9, 0, 1) : 0;
      c.drawImage(g.bake('n7city', paintCity), 0, 0, 360, 640);
      const { D, S } = this.gap(s), board = bite ? Math.round((FLATS - S) * SK.clamp(k * 2, 0, 1)) : 0;
      const bx = s.slide && s.phase === 'swing' ? BLD.x + Math.max(0, 1 - (t - s.pt) * 3) * 260 : BLD.x;
      block(c, bx, BLD.y0, BLD.y1, BLD.w, COLS[(s.v + s.bi) % COLS.length], board, bite ? Math.min(S, Math.round(S * k)) : FLATS);
      // renters: those who got a flat walk in; the rest queue outside
      const queue = bite ? Math.round((D - S) * k) : 0;
      for (let i = 0; i < Math.min(9, queue); i++) SK.animal(c, ['rabbit', 'frog', 'duck', 'penguin', 'hedgehog', 'bird', 'fox', 'turtle', 'beaver'][(i + s.bi) % 9], 98 - i * 26, 576, 0.62, { t, phase: i, pose: 'idle', expr: 'sad', facing: 1 });
      if (queue > 0) SK.tag(c, 'Waiting for a flat', 100, 530, 18, '#fff6ea', 'rgba(170,40,50,0.88)');
      if (!bite) for (let i = 0; i < 3; i++) SK.animal(c, ['rabbit', 'frog', 'duck'][(i + s.bi) % 3], 60 + i * 34, 566, 0.62, { t, phase: i, pose: 'idle', expr: 'happy' });
      // the gauge: market rent (coin marker) and the cap bar
      const my = ry(bite ? SK.lerp(s.m, s.cap, k) : s.m);
      c.save(); c.strokeStyle = '#ffd45a'; c.lineWidth = 3; c.setLineDash([6, 5]); c.beginPath(); c.moveTo(BLD.x + BLD.w / 2 + 4, ry(s.m)); c.lineTo(G.x - 16, ry(s.m)); c.stroke(); c.restore();
      SK.ball(c, G.x, my, 13, '#f5c23a'); c.fillStyle = '#8a6010'; c.font = '900 14px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('$', G.x, my + 1);
      SK.tag(c, 'Rent', G.x, G.y0 - 30, 18);
      const br = s.cap != null ? s.cap : this.barR(g), by = ry(br) + (s.phase === 'dangle' ? Math.sin((t - s.pt) * 14) * 6 * Math.max(0, 1 - (t - s.pt)) : 0), slam = s.cap != null && t - s.pt < 0.12;
      c.fillStyle = s.phase === 'dangle' ? '#a8a8b8' : '#e8503a'; c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.beginPath(); c.roundRect(G.x - 46, by - 7 + (slam ? 4 : 0), 92, 14, 6); c.fill(); c.stroke();
      if (s.phase === 'dangle') { c.strokeStyle = '#5a5a68'; c.lineWidth = 2; c.beginPath(); c.moveTo(G.x - 40, by); c.lineTo(G.x - 40, G.y0 - 10); c.moveTo(G.x + 40, by); c.lineTo(G.x + 40, G.y0 - 10); c.stroke(); }
      SK.tag(c, 'Rent cap', G.x - 76, by, 18, '#fff6ea', s.phase === 'dangle' ? 'rgba(90,90,110,0.9)' : 'rgba(170,40,50,0.9)');
      if (!g.done) SK.tag(c, 'Block ' + Math.min(s.bi + 1, s.rents.length) + ' / ' + s.rents.length, 80, 190, 18);
      SK.tag(c, 'Flats', BLD.x, BLD.y0 - 30, 18);
      SK.animal(c, 'owl', 312, 600, 0.75, { t, pose: won ? 'cheer' : bite ? 'point' : 'idle', expr: s.phase === 'dangle' ? 'think' : bite ? 'wow' : 'happy', facing: -1 });
      // guidance: tap while the bar is below the market rent
      const ok = s.phase === 'swing' && !g.done && this.barR(g) < s.m - 0.08 && t - s.pt > 0.3;
      if (s.phase === 'swing' && !g.done) SK.glow(c, g, G.x, by, 34, ok ? '#5ad07a' : '#ffe27a');
      SK.demo(g, c, 'tap', [G.x + 8, by + 6], null, { never: !ok, delay: 0.4, period: 0.7 });
    },
    auto(g, dt, synth) { const s = g.s; if (g.done || s.phase !== 'swing' || g.t - s.pt < 0.35) return; const r = this.barR(g); if (r < s.m - 0.12 && r > 0.2) { synth('down', G.x, 400); synth('up', G.x, 400); } },
  });
})();
