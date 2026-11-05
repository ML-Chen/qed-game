// SPREAD YOUR EGGS OUT! (business PF-31) — diversify. Your eggs (your money) sit in a nest; baskets on two shelves are
// companies you can put money into. Drag each egg into a basket. A basket with too many eggs bends and creaks. When the
// nest is empty, one company fails: the fullest basket cracks and its eggs fall and splat. Spread out, and only a few eggs
// are lost; pile them into one basket and a big omelette lands on the ant.
// Level 1: more eggs and baskets; level 2: two baskets are tied together (companies in the same business), so they
// crack together.
(() => {
  const CAP = 2, NEST = { x: 92, y: 560 };
  const SPOTS = { 3: [[96, 262], [264, 262], [180, 408]], 4: [[70, 262], [180, 262], [290, 262], [180, 408]], 5: [[70, 262], [180, 262], [290, 262], [112, 408], [248, 408]] };
  const LV = [{ eggs: 5, n: 3 }, { eggs: 6, n: 4 }, { eggs: 7, n: 5, tie: [3, 4] }];
  const NAMES = [['Bakery', 'Farm', 'Toys', 'Bikes', 'Cafe'], ['Games', 'Shoes', 'Books', 'Pizza', 'Phones'], ['Juice', 'Hats', 'Trains', 'Paint', 'Music'], ['Boats', 'Tea', 'Kites', 'Soap', 'Robots']];
  function paint(o) {
    P.sky(o, 360, 640, ['#f0b080', '#f8d0a8', '#fff4e0']); // a warm barn interior
    N6.vgrad(o, 0, 0, 360, 640, ['#c8784a', '#e0a070', '#f0c890']);
    o.fillStyle = 'rgba(120,60,30,0.18)'; for (let x = 0; x < 360; x += 40) o.fillRect(x, 0, 3, 640);
    for (const [wx, wy] of [[70, 136], [250, 136]]) { o.fillStyle = '#5a3018'; o.beginPath(); o.roundRect(wx - 6, wy - 6, 92, 76, 8); o.fill(); o.save(); o.beginPath(); o.rect(wx, wy, 80, 64); o.clip(); N6.vgrad(o, wx, wy, 80, 64, ['#8ad0f0', '#d8f0f8']); o.fillStyle = '#8ac860'; o.beginPath(); o.ellipse(wx + 40, wy + 70, 70, 26, 0, 0, 7); o.fill(); o.fillStyle = '#fff2a0'; o.beginPath(); o.arc(wx + 60, wy + 18, 9, 0, 7); o.fill(); o.restore(); o.fillStyle = '#5a3018'; o.fillRect(wx + 38, wy, 4, 64); o.fillRect(wx, wy + 30, 80, 4); }
    o.fillStyle = 'rgba(255,240,200,0.2)'; o.fillRect(0, 120, 360, 2);
    for (const y of [300, 446]) { o.fillStyle = '#7a4a2a'; o.fillRect(0, y, 360, 12); o.fillStyle = '#5a3018'; o.fillRect(0, y + 12, 360, 4); for (const x of [30, 330]) { o.fillStyle = '#5a3018'; o.beginPath(); o.moveTo(x - 6, y + 14); o.lineTo(x + 6, y + 14); o.lineTo(x, y + 34); o.fill(); } }
    N6.vgrad(o, 0, 520, 360, 120, ['#d8b070', '#b88a48']); for (let i = 0; i < 40; i++) { o.strokeStyle = 'rgba(255,230,150,0.6)'; o.lineWidth = 1.5; const x = (i * 53) % 360, y = 530 + (i * 37) % 100; o.beginPath(); o.moveTo(x, y); o.lineTo(x + 14, y - 4); o.stroke(); }
  }
  function egg(c, x, y, s = 1, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); const gr = c.createRadialGradient(-4, -6, 1, 0, 0, 14); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#f0dcc0'); c.fillStyle = gr; c.strokeStyle = '#a8805a'; c.lineWidth = 1.6; c.beginPath(); c.ellipse(0, 0, 10, 13, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#c8901a'; c.font = '900 11px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('$', 0, 1); c.restore(); }
  function splat(c, x, y, k) { c.save(); c.globalAlpha = SK.clamp(k * 3, 0, 1); c.fillStyle = '#fff8ec'; c.beginPath(); for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28, r = 16 + (i % 2) * 7; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.45); } c.closePath(); c.fill(); c.fillStyle = '#f5b820'; c.beginPath(); c.ellipse(x, y - 1, 7, 4, 0, 0, 7); c.fill(); c.restore(); }
  function basket(c, x, y, n, t, crack, wob) { // y: the basket's rim
    c.save(); c.translate(x, y); c.rotate(wob);
    const sag = Math.min(1, Math.max(0, n - CAP) / 3), cr = crack ? SK.clamp(crack * 3, 0, 1) : 0;
    c.fillStyle = '#a8642a'; c.strokeStyle = '#5a3010'; c.lineWidth = 2.5;
    if (!cr) { c.beginPath(); c.moveTo(-42, 0); c.lineTo(42, 0); c.lineTo(32 + sag * 4, 34 + sag * 8); c.lineTo(-32 - sag * 4, 34 + sag * 8); c.closePath(); c.fill(); c.stroke(); }
    else for (const s of [-1, 1]) { c.save(); c.translate(s * 20, 0); c.rotate(s * cr * 0.6); c.beginPath(); c.moveTo(s * -22, 0); c.lineTo(s * 22, 0); c.lineTo(s * 14, 34); c.lineTo(s * -16, 34); c.closePath(); c.fill(); c.stroke(); c.restore(); }
    c.strokeStyle = 'rgba(90,48,16,0.55)'; c.lineWidth = 1.5; if (!cr) for (let i = 1; i < 4; i++) { c.beginPath(); c.moveTo(-40 + i * 2, i * 8.5); c.lineTo(40 - i * 2, i * 8.5); c.stroke(); }
    if (sag > 0 && !cr) { c.strokeStyle = '#3a1a08'; c.lineWidth = 2; c.beginPath(); c.moveTo(-6, 12); c.lineTo(0, 20); c.lineTo(-4, 26); c.lineTo(3, 34); c.stroke(); }
    c.fillStyle = '#c88040'; c.strokeStyle = '#5a3010'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-45, -5, 90, 9, 4); c.fill(); c.stroke();
    if (!cr) for (let i = 0; i < n; i++) egg(c, -24 + (i % 4) * 16, -6 - Math.floor(i / 4) * 12, 0.95, (i % 2 ? 0.2 : -0.2));
    c.restore();
  }
  MG.add({
    id: 'money_spread', stage: 'money', cmd: 'SPREAD YOUR EGGS OUT!', time: 8, mood: 'bright', winText: 'Only a few eggs lost!', failText: 'All eggs in one basket!', hold: 1.7,
    card: { title: 'Don\'t put all your eggs in one basket', kind: 'Money', ref: 'Diversification',
      text: 'When you invest, you buy small pieces of companies. Some companies do well, and some fail. Nobody can tell ahead of time which one will fail.\n\nIf all your money is in one company and it fails, you lose almost everything. If your money is spread over many companies, one failure takes only a small part.\n\nCompanies in the same business often fall together, like the tied baskets. So spread across different kinds of business too. Many people buy an index fund, which holds hundreds of companies at once.',
      note: 'Spreading money over many different companies means one failure only hurts a little.' },
    init(g) {
      const s = g.s, L = LV[Math.min(2, g.level)]; s.L = L; s.v = SK.variant(g, 4); const names = NAMES[s.v];
      s.b = SPOTS[L.n].map(([x, y], i) => ({ x, y, n: 0, name: names[i], crack: 0, tie: L.tie && L.tie.includes(i) }));
      s.left = L.eggs; s.held = null; s.fall = []; s.phase = 'fill'; s.crashT = 0; s.lost = 0; s.drops = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.phase !== 'fill' || !s.left) return; if (SK.dist(x, y, NEST.x, NEST.y - 14) < 64) { s.held = { x, y }; s.left--; SK.dragStart(g, s.held, x, y); g.sfx('pop'); } },
    move(g, x, y) { if (g.s.held) SK.dragMove(g, x, y); },
    up(g, x, y) {
      const s = g.s; if (!s.held) return; SK.dragEnd(g); const e = s.held; s.held = null;
      const b = s.b.find(b => Math.abs(e.x - b.x) < 54 && e.y > b.y - 60 && e.y < b.y + 40);
      if (b && s.phase === 'fill') { b.n++; g.sfx('tap'); g.sfx(b.n > CAP ? 'stretch' : 'coin', { vol: 0.6 }); if (!s.left) { s.phase = 'wait'; s.crashT = g.t + 0.45; } }
      else { s.left++; g.sfx('boing', { vol: 0.4 }); }
    },
    update(g, dt) {
      const s = g.s;
      if (s.phase === 'wait' && g.t >= s.crashT) { // one company fails: the fullest basket (or the fullest tied pair) cracks
        const groups = s.b.map((b, i) => ({ list: b.tie ? s.b.filter(o => o.tie) : [b], i })); let best = null, bn = -1;
        for (const gr of groups) { const n = gr.list.reduce((a, b) => a + b.n, 0); if (n > bn) { bn = n; best = gr; } }
        s.lost = bn; s.phase = 'crack'; const onAnt = bn > CAP; s.crashT = g.t; g.sfx('crunch'); g.shake(4, 0.3);
        for (const b of best.list) { b.crack = g.t; for (let i = 0; i < b.n; i++) s.fall.push({ x: b.x - 24 + (i % 4) * 16, y: b.y - 6, vy: -120 - i * 14, vx: onAnt ? (262 - b.x) * 1.3 + (i % 3 - 1) * 20 : (i % 4 - 1.5) * 14, splat: 0 }); }
      }
      for (const f of s.fall) { if (f.splat) continue; f.vy += 1500 * dt; f.x += f.vx * dt; f.y += f.vy * dt; const fl = 596; if (f.y >= fl) { f.y = fl; f.splat = g.t; g.sfx('splash', { vol: 0.3 }); } }
      if (s.phase === 'crack' && !g.done && g.t - s.crashT > 0.85) { if (s.lost <= CAP) { g.win(); g.sfx('cheer'); } else { g.fail(); g.sfx('laugh'); } }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('n6spread_bg', paint), 0, 0, 360, 640);
      // the rope between tied baskets
      const tied = s.b.filter(b => b.tie); if (tied.length === 2) { c.save(); c.strokeStyle = '#e8d8a0'; c.lineWidth = 4; c.beginPath(); c.moveTo(tied[0].x + 40, tied[0].y + 12); c.quadraticCurveTo((tied[0].x + tied[1].x) / 2, tied[0].y + 40, tied[1].x - 40, tied[1].y + 12); c.stroke(); c.restore(); }
      for (const b of s.b) { const wob = b.n > CAP && !b.crack ? Math.sin(t * 14 + b.x) * 0.04 * (b.n - CAP) : 0; basket(c, b.x, b.y, b.n, t, b.crack ? t - b.crack : 0, wob); SK.tag(c, b.name, b.x, b.y + 54, 18); }
      if (tied.length === 2) SK.tag(c, 'Tied together', 180, 352, 18, '#3a1640', 'rgba(232,216,160,0.95)');
      // falling eggs and splats
      for (const f of s.fall) { if (f.splat) splat(c, f.x, f.y, t - f.splat); else egg(c, f.x, f.y, 1, t * 8); }
      // the nest with the eggs still to place
      c.save(); c.fillStyle = '#8a5a2a'; c.beginPath(); c.ellipse(NEST.x, NEST.y + 8, 62, 18, 0, 0, 7); c.fill(); c.strokeStyle = '#c8a060'; c.lineWidth = 2; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(NEST.x, NEST.y + 4, 54 - i, 0.1 + i * 0.3, 2.9 + i * 0.2); c.stroke(); } c.restore();
      for (let i = 0; i < s.left; i++) egg(c, NEST.x - 34 + (i % 4) * 22 + (Math.floor(i / 4) * 11), NEST.y - 4 - Math.floor(i / 4) * 16, 1.15, (i % 2 ? 0.2 : -0.2));
      SK.tag(c, 'Your money', NEST.x, NEST.y + 40, 18);
      if (s.held) egg(c, s.held.x, s.held.y, 1.3);
      // the ant: the host, wearing the omelette if the eggs land on it
      const omelette = s.phase === 'crack' && s.lost > CAP;
      SK.animal(c, 'ant', 262, 600, 1.3, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
      if (omelette) { const k = SK.clamp((t - s.crashT - 0.25) * 4, 0, 1); c.save(); c.globalAlpha = k; c.fillStyle = '#fff8ec'; c.beginPath(); c.ellipse(262, 548, 34, 12, 0, 0, 7); c.fill(); c.fillStyle = '#f5b820'; c.beginPath(); c.ellipse(258, 546, 12, 6, 0, 0, 7); c.ellipse(272, 550, 8, 4, 0, 0, 7); c.fill(); c.restore(); }
      if (s.phase === 'crack') SK.tag(c, s.lost + (s.lost === 1 ? ' egg lost' : ' eggs lost'), 262, 476, 20, '#fff6ea', s.lost > CAP ? 'rgba(190,40,40,0.9)' : 'rgba(40,140,70,0.92)');
      // guidance: drag an egg from the nest to the emptiest basket
      if (s.phase === 'fill' && s.left && !g.done) { let tg = s.b[0]; for (const b of s.b) { const n = b.tie ? tied.reduce((a, o) => a + o.n, 0) : b.n, m = tg.tie ? tied.reduce((a, o) => a + o.n, 0) : tg.n; if (n < m) tg = b; }
        const ex = NEST.x - 34 + ((s.left - 1) % 4) * 22, ey = NEST.y - 4; SK.grab(c, g, ex, ey, 22); SK.target(c, g, tg.x, tg.y - 4, 0, { w: 96, h: 50 }); SK.arrow(c, g, ex, ey, tg.x, tg.y, { from: 26, to: 34 });
        SK.demo(g, c, 'drag', [ex, ey], [tg.x, tg.y - 4]); s.hintB = s.b.indexOf(tg); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.phase !== 'fill' || (!s.left && !s.held)) return; const B = s._a = s._a || { n: 1.0, k: 0 }; if (g.t < B.n) return;
      const tied = s.b.filter(b => b.tie), sum = b => b.tie ? tied.reduce((a, o) => a + o.n, 0) : b.n; let tg = s.b[0]; for (const b of s.b) if (sum(b) < sum(tg)) tg = b;
      if (SK.bot.drag(g, synth, 'e' + B.k, B.n, [NEST.x - 10, NEST.y - 10], [tg.x, tg.y - 4], 0.3)) { B.k++; B.n = g.t + 0.15; }
    },
  });
})();
