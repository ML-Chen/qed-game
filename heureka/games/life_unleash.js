// UNLEASH! (chem_bio MB-09) — a meadow full of breeding rabbits and a fox den. Tap the den to send out a fox. With no
// foxes the rabbits breed until they strip the meadow bare. Release foxes when the rabbits are plentiful: the foxes eat
// and raise cubs, the rabbits fall, then the hungry foxes leave and the rabbits recover, so you release again at the next
// boom. Release a whole pack at once and the rabbits crash, the foxes leave, and the rabbits boom out of control. A graph
// at the top draws both numbers chasing each other through the seasons. Level 0: two years; level 1: two and a half;
// level 2: three years (three booms).
(() => {
  const DEN = { x: 58, y: 566 }, OVER = 44, SEASONS = [8, 10, 12], SEASON_S = 1.25;
  const M = { a: 0.9, K: 200, b: 0.4, c: 0.15, d: 0.9, low: 16, leave: 3.5 };
  const SKY = [['#9ad8f0', '#d8f0e0'], ['#7ac8f0', '#fff0c0'], ['#e8a070', '#f8d8a0'], ['#a8b8d0', '#e8eef4']];
  const GRASS = [['#8ad060', '#5aa040'], ['#a8c850', '#789838'], ['#c8a050', '#987030'], ['#e8eef0', '#b8c8d0']];
  function paintBg(o, k) {
    const sk = o.createLinearGradient(0, 0, 0, 300); sk.addColorStop(0, SKY[k][0]); sk.addColorStop(1, SKY[k][1]); o.fillStyle = sk; o.fillRect(0, 0, 360, 640);
    o.fillStyle = k === 3 ? '#c8d0dc' : P.shade(GRASS[k][1], -0.2); o.beginPath(); o.moveTo(0, 290); o.quadraticCurveTo(120, 240, 220, 280); o.quadraticCurveTo(300, 300, 360, 270); o.lineTo(360, 640); o.lineTo(0, 640); o.fill();
    const gr = o.createLinearGradient(0, 300, 0, 640); gr.addColorStop(0, GRASS[k][0]); gr.addColorStop(1, GRASS[k][1]); o.fillStyle = gr; o.beginPath(); o.moveTo(0, 320); o.quadraticCurveTo(180, 290, 360, 316); o.lineTo(360, 640); o.lineTo(0, 640); o.fill();
    const r = P.rng(40 + k); for (let i = 0; i < 60; i++) { o.strokeStyle = k === 3 ? 'rgba(255,255,255,0.6)' : 'rgba(40,90,30,0.35)'; o.lineWidth = 1.5; const x = r() * 360, y = 330 + r() * 290; o.beginPath(); o.moveTo(x, y); o.lineTo(x - 2, y - 7); o.moveTo(x, y); o.lineTo(x + 3, y - 6); o.stroke(); }
    if (k === 2) for (let i = 0; i < 20; i++) { o.fillStyle = ['#e8703a', '#c8402a', '#f0b040'][i % 3]; o.beginPath(); o.ellipse(r() * 360, 340 + r() * 270, 4, 2, r() * 3, 0, 7); o.fill(); }
    if (k === 0) P.flowers(o, 360, 340, 610, 14, undefined, 3);
    // trees at the edge of the meadow
    for (const [x, y, s] of [[30, 300, 0.8], [320, 290, 0.9]]) { o.fillStyle = '#6a4a2a'; o.fillRect(x - 5, y - 30, 10, 34); o.fillStyle = k === 3 ? '#e8eef4' : k === 2 ? '#d8803a' : '#4a8a3a'; o.beginPath(); o.arc(x, y - 46, 30 * s, 0, 7); o.arc(x - 16, y - 34, 20 * s, 0, 7); o.arc(x + 16, y - 34, 20 * s, 0, 7); o.fill(); }
    // the fox den: a hole under a mound
    o.fillStyle = '#8a6a48'; o.beginPath(); o.ellipse(DEN.x, DEN.y, 56, 30, 0, Math.PI, 0); o.fill(); o.fillStyle = '#2a1a12'; o.beginPath(); o.ellipse(DEN.x, DEN.y + 2, 24, 18, 0, Math.PI, 0); o.fill();
  }
  function seasonLen(g) { return Math.min(SEASON_S, (g.dur - 0.7) / SEASONS[Math.min(2, g.level)]); }
  MG.add({
    id: 'unleash', stage: 'life', cmd: 'SEND FOXES WHEN RABBITS BOOM!', time: 6, mood: 'bright', winText: 'Predator-prey!', failText: 'Overrun!',
    card: { title: 'Predators and prey', kind: 'Biology', ref: 'Predator and prey cycles (population ecology)',
      text: 'With no foxes, rabbits breed fast until they eat the meadow bare. When there are plenty of rabbits, foxes find food easily and raise more cubs. More foxes eat more rabbits, so the rabbits fall. Then the foxes go hungry and leave or die, which lets the rabbits recover.\n\nSo the two numbers rise and fall in a chase, with the foxes one step behind. Too many foxes at once can eat almost every rabbit, and then the foxes starve too. Records of lynx and snowshoe hares in Canada show a similar rise and fall about every ten years.',
      note: 'Predator and prey numbers rise and fall in turn: more prey feeds more predators, and more predators mean fewer prey.' },
    init(g) { const s = g.s; s.R = 5; s.F = 0; s.u = 0; s.hist = [[0, 5, 0]]; s.rel = []; s.end = 0; },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (SK.dist(x, y, DEN.x, DEN.y - 14) < 70) { s.F += 1; s.rel.push(g.t); if (s.rel.length > 10) s.rel.shift(); g.sfx('roar'); g.sfx('whoosh'); } },
    update(g, dt) {
      const s = g.s; if (g.done) return; const N = SEASONS[Math.min(2, g.level)], du = dt / seasonLen(g);
      for (let i = 0; i < 4; i++) { const h = du / 4, R = s.R, F = s.F;
        const dR = M.a * R * (1 - R / M.K) - M.b * R * F, dF = F * (M.c * M.b * R - M.d) - (R < M.low && F > 0 ? M.leave : 0);
        s.R = Math.max(0, R + dR * h); s.F = Math.max(0, F + dF * h); if (s.F < 0.3) s.F = 0; }
      s.u += du; if (s.hist.length === 0 || s.u - s.hist[s.hist.length - 1][0] > 0.08) s.hist.push([s.u, s.R, s.F]);
      if (s.R >= OVER) { g.sfx('munch'); g.sfx('fail'); g.fail(); return; }
      if (s.R < 1) { s.R = 0; g.sfx('fail'); g.fail(); return; }
      if (s.u >= N) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, N = SEASONS[Math.min(2, g.level)], sp = s.u % 4, k0 = Math.floor(sp), kf = sp - k0;
      c.drawImage(g.bake('unleash_bg' + k0, o => paintBg(o, k0)), 0, 0, 360, 640);
      if (kf > 0.75) { c.save(); c.globalAlpha = (kf - 0.75) * 4; c.drawImage(g.bake('unleash_bg' + (k0 + 1) % 4, o => paintBg(o, (k0 + 1) % 4)), 0, 0, 360, 640); c.restore(); }
      // bare patches as the rabbits strip the grass
      const bare = SK.clamp((s.R - 24) / (OVER - 24), 0, 1); if (bare > 0) for (let i = 0; i < 14; i++) { c.fillStyle = `rgba(150,110,60,${0.55 * bare})`; c.beginPath(); c.ellipse(30 + B3.hash(i) * 300, 350 + B3.hash(i * 3) * 250, 30 * bare + 6, 12 * bare + 3, 0, 0, 7); c.fill(); }
      // the rabbits, each hopping about its own spot
      const nR = Math.round(s.R), items = [];
      for (let i = 0; i < nR; i++) { const hx = 30 + B3.hash(i * 1.3) * 300, hy = 352 + B3.hash(i * 2.9) * 240, hop = Math.max(0, Math.sin(t * 6 + i * 1.7)) * 6; items.push([hy, () => SK.animal(c, 'rabbit', hx + Math.sin(t * 0.8 + i) * 8, hy - hop, 0.38, { t, phase: i, noShadow: true, tint: k0 === 3 ? '#f4f4f8' : undefined })]); }
      const nF = Math.round(s.F);
      for (let i = 0; i < nF; i++) { const a = t * 0.9 + i * 2.1, fx = 180 + Math.cos(a) * (110 + 20 * Math.sin(i)), fy = 470 + Math.sin(a * 1.3) * 90; items.push([fy, () => SK.animal(c, 'fox', fx, fy, 0.6, { t, phase: i, pose: 'walk', facing: Math.sin(a) > 0 ? -1 : 1, expr: s.R < M.low ? 'sad' : 'happy' })]); }
      items.sort((a, b) => a[0] - b[0]); for (const [, f] of items) f();
      // a fox just released runs out of the den
      for (const rt of s.rel) { const q = (t - rt) * 2; if (q > 1) continue; SK.animal(c, 'fox', DEN.x + q * 90, DEN.y - 4 - Math.sin(q * Math.PI) * 20, 0.65, { t, pose: 'hop', expr: 'laugh' }); }
      // the graph: rabbits (white) and foxes (orange) through the seasons, the overrun line in red
      const gx = 30, gy = 134, gw = 300, gh = 56;
      c.save(); c.fillStyle = 'rgba(30,14,36,0.62)'; c.beginPath(); c.roundRect(gx - 10, gy - 8, gw + 20, gh + 16, 12); c.fill();
      c.strokeStyle = 'rgba(255,90,90,0.8)'; c.setLineDash([5, 5]); c.lineWidth = 2; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + gw, gy); c.stroke(); c.setLineDash([]);
      for (let i = 1; i < N; i++) { c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(gx + gw * i / N, gy, 1, gh); }
      for (const [col, idx, sc] of [['#fff6ea', 1, gh / OVER], ['#ff9a3a', 2, gh / 8]]) { c.strokeStyle = col; c.lineWidth = 3; c.lineJoin = 'round'; c.beginPath(); s.hist.forEach(([u, R, F], j) => { const x = gx + gw * u / N, y = gy + gh - Math.min(gh, (idx === 1 ? R : F) * sc); j ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); }
      SK.animal(c, 'rabbit', gx + gw * s.u / N, gy + gh - Math.min(gh, s.R * gh / OVER) + 6, 0.2, { t, noShadow: true });
      c.restore();
      // the host fox by the den cheers or sulks
      const won = g.result === 'win', lost = g.result === 'fail';
      if (won || lost) SK.animal(c, 'fox', 120, 610, 0.8, { t, pose: won ? 'cheer' : 'sad', expr: won ? 'laugh' : 'wow' });
      if (s.F < 0.5) SK.glow(c, g, DEN.x, DEN.y - 14, 40, s.R > 20 ? '#ffe27a' : 'rgba(255,240,200,0.5)');
      SK.tag(c, 'Rabbits', 120, 218, 18, '#fff6ea'); SK.tag(c, 'Foxes', 240, 218, 18, '#ffb060'); SK.tag(c, 'Fox den', DEN.x + 40, DEN.y + 30, 18);
      SK.demo(g, c, 'tap', [DEN.x, DEN.y - 14], null, { delay: 2.2, never: (g.s.touched || g.level > 0) && !(s.R > 20 && s.F < 0.5) });
    },
    // the bot sends out one fox whenever the rabbits boom and no foxes are left
    auto(g, dt, synth) { const s = g.s; if (g.done) return; const B = s._b = s._b || { u: -9 }; if (s.R > 24 && s.F < 0.5 && s.u - B.u > 0.3) { B.u = s.u; synth('down', DEN.x, DEN.y - 14); synth('up', DEN.x, DEN.y - 14); } },
  });
})();
