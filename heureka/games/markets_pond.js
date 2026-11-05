// SHARE THE POND! (business MI-27, the tragedy of the commons) — a round pond seen from above, full of fish, with four
// little boats: yours (the duck's, at the bottom) and three neighbours'. Tap to cast and catch a fish. The neighbours
// copy you: every time you catch one, each of them catches one too. The fish breed back fastest when the pond is about
// half full, and not at all when it is nearly empty. The "Fish left" bar shows the pond, with a line below which it
// can't refill in time. Fish while the pond is above the line, wait while it refills, and fill your basket. Fish as
// fast as you can and every boat does the same: the pond empties and the last cast hooks an old boot.
// Level 1: a bigger basket. Level 2: the neighbours each take two fish for every one of yours.
(() => {
  const PD = { x: 180, y: 392, rx: 160, ry: 146 }, ME = { x: 180, y: 556 }, BAR = { x0: 50, x1: 310, y: 150 }, LINE = 0.42, DEAD = 0.1;
  const NB = [[{ x: 44, y: 330 }, 'frog'], [{ x: 316, y: 330 }, 'penguin'], [{ x: 180, y: 252 }, 'beaver']];
  const LV = [{ need: 8, take: 0.05, nb: 1, r: 0.55 }, { need: 8, take: 0.055, nb: 1, r: 0.55 }, { need: 6, take: 0.035, nb: 2, r: 0.55 }];
  const VAR = [{ water: ['#2a8aa0', '#6ac8d8'], fish: '#f08a3a' }, { water: ['#2a7a8a', '#5ab8a8'], fish: '#e8c040' }, { water: ['#2a6a9a', '#5aa8d8'], fish: '#e86a8a' }, { water: ['#3a7a6a', '#7ac0a0'], fish: '#f0a050' }, { water: ['#2a5a8a', '#6a98d0'], fish: '#f07a5a' }];
  function paintPond(o, V) {
    const gr = o.createLinearGradient(0, 0, 0, 640); gr.addColorStop(0, '#9ad070'); gr.addColorStop(1, '#6aa048'); o.fillStyle = gr; o.fillRect(0, 0, 360, 640);
    P.grassTufts(o, 360, 140, 640, 40, '#5a8a38', 3); P.flowers(o, 360, 150, 620, 26, undefined, 4);
    for (const [x, y, s] of [[20, 600, 0.7], [340, 610, 0.6], [26, 170, 0.5], [336, 176, 0.55]]) P.tree(o, x, y, s, '#4a8a3a', 2);
    o.fillStyle = '#c8b070'; o.beginPath(); o.ellipse(PD.x, PD.y, PD.rx + 12, PD.ry + 12, 0, 0, 7); o.fill();
    const wg = o.createRadialGradient(PD.x - 30, PD.y - 40, 10, PD.x, PD.y, PD.rx); wg.addColorStop(0, V.water[1]); wg.addColorStop(1, V.water[0]); o.fillStyle = wg; o.beginPath(); o.ellipse(PD.x, PD.y, PD.rx, PD.ry, 0, 0, 7); o.fill();
    for (const [x, y, r] of [[96, 470, 14], [276, 452, 12], [120, 300, 10]]) { o.fillStyle = '#4a9a4a'; o.beginPath(); o.arc(x, y, r, 0.4, 6); o.lineTo(x, y); o.closePath(); o.fill(); }
  }
  function fishTop(c, x, y, a, col, s = 1) { c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s); c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, 9, 4.5, 0, 0, 7); c.fill(); c.beginPath(); c.moveTo(-7, 0); c.lineTo(-14, -5); c.lineTo(-14, 5); c.closePath(); c.fill(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(5, -1.5, 1.2, 0, 7); c.fill(); c.restore(); }
  function boat(c, x, y, kind, t, ph, mine, face) {
    c.save(); c.translate(x, y + Math.sin(t * 2 + ph) * 2);
    c.fillStyle = 'rgba(255,255,255,0.25)'; c.beginPath(); c.ellipse(0, 6, 40, 12, 0, 0, 7); c.fill();
    c.fillStyle = mine ? '#e8503a' : '#a8703a'; c.strokeStyle = '#5a2a1a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-34, -4); c.quadraticCurveTo(0, 20, 34, -4); c.lineTo(28, -10); c.lineTo(-28, -10); c.closePath(); c.fill(); c.stroke(); c.restore();
    SK.animal(c, kind, x, y - 4 + Math.sin(t * 2 + ph) * 2, 0.62, { t, phase: ph, noShadow: true, ...face });
  }
  MG.add({
    id: 'sharepond', stage: 'markets', cmd: 'FISH, BUT LEAVE ENOUGH TO REFILL!', time: 7, mood: 'sea', winText: 'Basket full, pond still full!', failText: 'The pond is empty!', hold: 1.6,
    card: { title: 'Share the pond', kind: 'Economics', ref: 'The tragedy of the commons',
      text: 'The pond belongs to nobody, so everyone can fish it. Each boat gains a fish when it fishes, but the cost, fewer fish left, is shared by every boat. So each boat is tempted to grab as much as it can.\n\nFish breed back fastest when the pond is about half full. If everyone fishes too fast, there are too few fish left to breed, and the pond empties for everyone.\n\nFishing towns avoid this with shared rules: catch limits, fishing seasons and quotas that everyone agrees to keep.',
      note: 'When anyone can take freely from a shared resource, it tends to get used up unless people agree on limits.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 5); s.L = L; s.lv = LV[L]; s.V = VAR[s.v]; s.F = 0.86; s.mine = 0; s.casts = []; s.boot = 0; s.nbFish = [0, 0, 0];
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return;
      if (y < 300 && SK.dist(x, y, ME.x, ME.y) > 90) return;
      if (s.casts.some(k => k.who < 0 && g.t - k.t < 0.35)) return; // the line is still out
      const lv = s.lv; s.casts.push({ who: -1, t: g.t, ang: -0.3 + g.rand() * 0.6 }); g.sfx('swoosh', { vol: 0.5 });
      for (let i = 0; i < 3; i++) for (let j = 0; j < lv.nb; j++) s.casts.push({ who: i, t: g.t + 0.3 + i * 0.12 + j * 0.25, ang: g.rand() * 6.28 });
    },
    update(g, dt) {
      const s = g.s, lv = s.lv;
      if (!g.done) s.F = Math.min(1, s.F + lv.r * s.F * (1 - s.F) * dt * (s.F < DEAD ? 0 : 1)); // fish breed back, fastest when the pond is half full
      for (const k of s.casts) if (!k.done && g.t >= k.t + 0.25) { // the catch lands
        k.done = true; if (g.done) continue;
        if (s.F < DEAD + 0.03) { k.boot = true; if (k.who < 0) { s.boot = g.t; } continue; }
        s.F = Math.max(0, s.F - lv.take); if (k.who < 0) { s.mine++; g.sfx('splash', { vol: 0.5 }); } else s.nbFish[k.who]++;
      }
      s.casts = s.casts.filter(k => !k.done || g.t - k.t < 0.9);
      if (g.done) return;
      if (s.mine >= lv.need) { g.win(); g.sfx('cheer'); g.burst(ME.x, ME.y - 30, ['#ffe27a', '#fff6ea', '#5ab4d4'], 24, 200); return; }
      if (s.F < DEAD || s.boot) { if (!s.boot) s.boot = g.t; g.fail(); g.sfx('laugh'); g.sfx('thud'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, lv = s.lv, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('n7pond' + s.v, o => paintPond(o, s.V)), 0, 0, 360, 640);
      // the fish: as many as the pond holds
      const n = Math.round(s.F * 26);
      for (let i = 0; i < n; i++) { const a = t * (0.25 + (i % 5) * 0.06) * (i % 2 ? 1 : -1) + i * 2.4, rr = 0.25 + ((i * 37) % 60) / 100, x = PD.x + Math.cos(a) * PD.rx * rr * 0.85, y = PD.y + Math.sin(a) * PD.ry * rr * 0.8; fishTop(c, x, y, a + (i % 2 ? Math.PI / 2 : -Math.PI / 2), s.V.fish, i >= n - 2 ? 0.75 : 1); }
      // the "Fish left" bar: below the line the pond can't refill in time
      const bx = f => SK.lerp(BAR.x0, BAR.x1, f), lowF = s.F < LINE;
      c.fillStyle = 'rgba(30,14,36,0.65)'; c.beginPath(); c.roundRect(BAR.x0 - 10, BAR.y - 16, BAR.x1 - BAR.x0 + 20, 32, 16); c.fill();
      c.fillStyle = 'rgba(232,80,58,0.55)'; c.fillRect(BAR.x0, BAR.y - 9, bx(LINE) - BAR.x0, 18); c.fillStyle = 'rgba(90,208,122,0.45)'; c.fillRect(bx(LINE), BAR.y - 9, BAR.x1 - bx(LINE), 18);
      c.fillStyle = lowF ? '#e8503a' : '#5ab4d4'; c.beginPath(); c.roundRect(BAR.x0, BAR.y - 6, Math.max(8, (BAR.x1 - BAR.x0) * s.F), 12, 6); c.fill();
      c.fillStyle = '#fff6ea'; c.fillRect(bx(LINE) - 2, BAR.y - 14, 4, 28);
      SK.tag(c, 'Fish left', 110, BAR.y + 32, 18);
      if (!g.done) SK.tag(c, lowF ? 'Wait: refilling' : 'Fish now', 260, BAR.y + 32, 18, '#fff6ea', lowF ? 'rgba(170,40,50,0.9)' : 'rgba(40,150,70,0.92)');
      // the neighbours' boats and your boat
      for (let i = 0; i < 3; i++) { const [p, k] = NB[i]; boat(c, p.x, p.y, k, t, i + 1, false, { pose: lost ? 'sad' : 'idle', expr: lost ? 'sad' : 'happy', facing: p.x > 180 ? -1 : 1 }); }
      boat(c, ME.x, ME.y, 'duck', t, 0, true, { pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
      // fishing lines and the fish (or the boot) on the way up
      for (const k of s.casts) { if (g.t < k.t) continue; const from = k.who < 0 ? ME : NB[k.who][0], q = SK.clamp((t - k.t) / 0.25, 0, 1), tx = from.x + (PD.x - from.x) * 0.35 + Math.cos(k.ang) * 20, ty = from.y + (PD.y - from.y) * 0.35 + Math.sin(k.ang) * 14;
        const up = SK.clamp((t - k.t - 0.25) / 0.4, 0, 1), hx = SK.lerp(tx, from.x, up), hy = SK.lerp(ty, from.y - 30, up) - Math.sin(up * Math.PI) * 30;
        c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(from.x + 12, from.y - 30); c.quadraticCurveTo(SK.lerp(from.x, tx, 0.5), Math.min(from.y, ty) - 30, SK.lerp(from.x + 12, hx, q), SK.lerp(from.y - 30, hy, q)); c.stroke();
        if (k.done && up < 1) { if (k.boot) { c.fillStyle = '#5a3a2a'; c.beginPath(); c.moveTo(hx - 10, hy - 12); c.lineTo(hx + 2, hy - 12); c.lineTo(hx + 2, hy + 2); c.lineTo(hx + 14, hy + 4); c.lineTo(hx + 14, hy + 10); c.lineTo(hx - 10, hy + 10); c.closePath(); c.fill(); } else fishTop(c, hx, hy, -1.2, s.V.fish, 1.2); } }
      if (s.boot) { const q = SK.clamp((t - s.boot) * 2, 0, 1); c.save(); c.translate(ME.x + 30, ME.y - 70 - q * 20); c.rotate(0.3); c.fillStyle = '#5a3a2a'; c.strokeStyle = '#2a1a10'; c.lineWidth = 2; c.beginPath(); c.moveTo(-14, -18); c.lineTo(4, -18); c.lineTo(4, 2); c.lineTo(20, 5); c.lineTo(20, 14); c.lineTo(-14, 14); c.closePath(); c.fill(); c.stroke(); c.restore(); }
      // your basket
      if (!won) SK.tag(c, 'Your basket ' + s.mine + ' / ' + lv.need, 180, 596, 18);
      // guidance: cast only while the pond is above the line
      const can = !g.done && !lowF;
      if (can) SK.glow(c, g, ME.x, ME.y - 20, 40);
      SK.demo(g, c, 'tap', [ME.x + 20, ME.y - 40], null, { never: !can, delay: 0.6, period: 0.7 });
    },
    auto(g, dt, synth) { const s = g.s; if (g.done) return; const B = s._n7 = s._n7 || { at: 0.3 }; if (g.t >= B.at && s.F > LINE + 0.06 && !s.casts.some(k => !k.done)) { synth('down', ME.x, ME.y - 20); synth('up', ME.x, ME.y - 20); B.at = g.t + 0.2; } },
  });
})();
