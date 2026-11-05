// COAT IT! (chem_bio MT-09) — a new bare-steel bike frame stands in a back garden; a grey rain cloud drifts in from the
// left as the time runs down. Drag along each tube of the frame to paint it (a brush follows the finger; bare steel
// stays grey, paint shines). Rust needs both water and air to touch the iron, so a complete coat keeps it safe: once
// every bit is painted the rain comes and beads off, and the bike stays shiny. Miss a spot and the rain soaks it: orange
// rust blooms there and creeps under the paint around it.
// Level 0: the three tubes of the front triangle; level 1: plus the fork; level 2: plus the seat stays, with a smaller brush.
(() => {
  const WR = 60;
  const GEOS = [ // rear axle, bottom bracket, seat top, head top, head bottom, front axle
    { R: [76, 452], B: [170, 456], S: [150, 316], H: [270, 322], HB: [260, 366], F: [286, 452] },
    { R: [74, 454], B: [172, 458], S: [146, 322], H: [276, 318], HB: [266, 362], F: [290, 454] },
    { R: [78, 450], B: [166, 456], S: [154, 312], H: [266, 326], HB: [256, 368], F: [282, 450] },
    { R: [72, 452], B: [168, 460], S: [148, 318], H: [272, 314], HB: [262, 360], F: [288, 452] },
  ];
  const COLS = ['#e8403a', '#20a8a0', '#f0b020', '#8a4ad8'];
  function tubesFor(G, lv) { const t = [['Seat tube', G.B, G.S], ['Top tube', G.S, G.H], ['Down tube', G.HB, G.B]]; if (lv >= 1) t.push(['Fork', G.HB, G.F]); if (lv >= 2) t.push(['Seat stay', G.S, G.R]); return t; }
  function paintBg(o) {
    P.sky(o, 360, 640, ['#8ac8ec', '#c4e4f4', '#f4f4e4']);
    P.hills(o, 360, 300, 40, '#a8d088', '#80b060', { seed: 3 });
    // a wooden fence and a shed
    o.fillStyle = '#c89a6a'; for (let x = -6; x < 360; x += 26) { o.beginPath(); o.moveTo(x, 330); o.lineTo(x + 11, 316); o.lineTo(x + 22, 330); o.lineTo(x + 22, 470); o.lineTo(x, 470); o.closePath(); o.fill(); }
    o.fillStyle = 'rgba(90,50,20,0.25)'; for (let x = -6; x < 360; x += 26) o.fillRect(x + 20, 330, 2, 140); o.fillStyle = '#a87a4a'; o.fillRect(0, 360, 360, 8); o.fillRect(0, 430, 360, 8);
    const gr = o.createLinearGradient(0, 470, 0, 640); gr.addColorStop(0, '#8ac860'); gr.addColorStop(1, '#5a9a40'); o.fillStyle = gr; o.fillRect(0, 470, 360, 170);
    o.fillStyle = '#c8b89a'; o.beginPath(); o.ellipse(180, 520, 170, 26, 0, 0, 7); o.fill(); o.fillStyle = 'rgba(120,100,70,0.3)'; o.beginPath(); o.ellipse(180, 524, 150, 18, 0, 0, 7); o.fill();
    P.grassTufts(o, 360, 552, 630, 26, '#3a7a28', 7); P.flowers(o, 360, 560, 628, 14, undefined, 5);
  }
  function wheel(c, x, y, t, spin) {
    c.strokeStyle = '#2a2a34'; c.lineWidth = 9; c.beginPath(); c.arc(x, y, WR, 0, 7); c.stroke();
    c.strokeStyle = '#9a9aa8'; c.lineWidth = 2.5; c.beginPath(); c.arc(x, y, WR - 7, 0, 7); c.stroke();
    c.strokeStyle = 'rgba(160,160,175,0.8)'; c.lineWidth = 1.2; for (let i = 0; i < 12; i++) { const a = i * 0.5236 + spin; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * (WR - 7), y + Math.sin(a) * (WR - 7)); c.stroke(); }
    c.fillStyle = '#5a5a6a'; c.beginPath(); c.arc(x, y, 6, 0, 7); c.fill();
  }
  function cloud(c, x, y, dark) { c.save(); c.fillStyle = dark ? '#6a7080' : '#8a90a0'; for (const [dx, dy, r] of [[-50, 8, 30], [-16, -10, 40], [26, -4, 34], [58, 10, 26], [0, 16, 34]]) { c.beginPath(); c.arc(x + dx, y + dy, r, 0, 7); c.fill(); } c.fillStyle = 'rgba(255,255,255,0.18)'; c.beginPath(); c.arc(x - 20, y - 22, 22, 0, 7); c.fill(); c.restore(); }
  function brush(c, x, y, col) { c.save(); c.translate(x, y); c.rotate(-0.7); c.fillStyle = col; c.beginPath(); c.roundRect(-8, -4, 16, 14, [0, 0, 6, 6]); c.fill(); c.fillStyle = '#c8c8d0'; c.fillRect(-9, -12, 18, 9); c.fillStyle = '#b87a3a'; c.beginPath(); c.roundRect(-5, -46, 10, 36, 4); c.fill(); c.restore(); }
  function paintAt(g, x, y) { const s = g.s; let hit = 0; for (const T of s.tubes) for (const p of T.pts) if (!p.p && SK.dist(p.x, p.y, x, y) <= s.BR) { p.p = g.t; hit++; }
      if (hit && g.t - (s.swT || 0) > 0.15) { s.swT = g.t; g.sfx('sweep', { vol: 0.4 }); }
      if (!hit && s.splats.length < 60 && g.rand() < 0.15) s.splats.push({ x, y: Math.max(y, 500) + g.rand() * 20, r: 2 + g.rand() * 3 }); }
  MG.add({
    id: 'coat', stage: 'reactions', cmd: 'PAINT EVERY BIT OF THE FRAME!', time: 7, mood: 'bright', winText: 'No rust! The paint keeps water out!', failText: 'Rust!',
    card: { title: 'Rust needs water and air', kind: 'Chemistry', ref: 'Corrosion and coatings',
      text: 'Rust forms when iron or steel meets both water and oxygen from the air. They react with the iron and make crumbly orange iron oxide, and the metal gets weaker.\n\nA coat of paint or oil keeps the water and air away from the metal, so the steel underneath stays shiny. But the coat must be complete. Where one spot is bare or scratched, water gets in, rust starts there and creeps under the paint around it.\n\nSome steel is coated with zinc. The zinc reacts first and protects the steel even where it is scratched.',
      note: 'Rust needs water and oxygen to reach the iron, so a complete coat of paint stops it, but one bare spot lets it start.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.lv = lv; s.v = SK.variant(g, 4); s.G = GEOS[s.v]; s.col = COLS[(s.v + lv) % 4];
      s.tubes = tubesFor(s.G, lv).map(([name, a, b]) => { const L = SK.dist(a[0], a[1], b[0], b[1]), n = Math.max(6, Math.round(L / 5)); return { name, a, b, pts: Array.from({ length: n + 1 }, (_, i) => ({ x: SK.lerp(a[0], b[0], i / n), y: SK.lerp(a[1], b[1], i / n), p: 0 })) }; });
      s.BR = lv >= 2 ? 12 : 15; s.last = null; s.rainT = 0; s.drops = []; s.rust = 0; s.splats = [];
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.rainT) return; s.last = [x, y]; paintAt(g, x, y); },
    move(g, x, y) { const s = g.s; if (!s.last || g.done || s.rainT) return; const [x0, y0] = s.last, n = Math.max(1, Math.ceil(SK.dist(x0, y0, x, y) / 3)); for (let k = 1; k <= n; k++) paintAt(g, SK.lerp(x0, x, k / n), SK.lerp(y0, y, k / n)); s.last = [x, y]; },
    up(g) { g.s.last = null; },
    update(g, dt) {
      const s = g.s, t = g.t, all = s.tubes.every(T => T.pts.every(p => p.p));
      if (all && !s.rainT && !g.done) { s.rainT = t; s.last = null; g.sfx('rain'); g.sfx('chime'); }
      if (s.rainT && !g.done && t - s.rainT > 0.75) { g.win(); g.sfx('cheer'); }
      if (g.result === 'fail' && !s.rainT) { s.rainT = t; g.sfx('rain'); g.sfx('wrong'); }
      if (s.rainT) { for (let i = 0; i < 6; i++) s.drops.push({ x: 40 + g.rand() * 300, y: 150 + g.rand() * 30, vy: 520 + g.rand() * 120, life: 1 }); }
      for (const p of s.drops) { p.y += p.vy * dt; p.life -= dt; } s.drops = s.drops.filter(p => p.life > 0 && p.y < 560);
      if (g.result === 'fail') s.rust = Math.min(1, s.rust + dt * 0.9);
    },
    draw(g, c) {
      const s = g.s, t = g.t, G = s.G, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('coat_bg', paintBg), 0, 0, 360, 640);
      // the rain cloud drifts in as the time runs out (or rushes in once the frame is coated)
      const fz = g.dur ? SK.clamp(g.fuse() / g.dur, 0, 1) : 0, cxp = s.rainT ? 180 : SK.lerp(-80, 120, fz);
      cloud(c, cxp, 170, !!s.rainT);
      c.strokeStyle = 'rgba(80,110,170,0.6)'; c.lineWidth = 2; for (const p of s.drops) { c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - 3, p.y + 12); c.stroke(); }
      SK.shadow(c, 180, 518, 140, 12, 0.22);
      for (const p of s.splats) { c.fillStyle = s.col; c.globalAlpha = 0.7; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 7); c.fill(); } c.globalAlpha = 1;
      wheel(c, G.R[0], G.R[1], t, 0); wheel(c, G.F[0], G.F[1], t, 0.2);
      // the frame: bare steel where unpainted, glossy paint where painted
      c.lineCap = 'round';
      for (const T of s.tubes) { c.strokeStyle = '#4a4a58'; c.lineWidth = 16; c.beginPath(); c.moveTo(T.a[0], T.a[1]); c.lineTo(T.b[0], T.b[1]); c.stroke(); c.strokeStyle = '#a8acb8'; c.lineWidth = 12; c.stroke(); c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 3; c.stroke(); }
      for (const T of s.tubes) { const ps = T.pts; for (let i = 0; i < ps.length; i++) { const p = ps[i]; if (!p.p) continue; const q = ps[Math.min(ps.length - 1, i + 1)], o = ps[Math.max(0, i - 1)];
        c.strokeStyle = s.col; c.lineWidth = 13; c.beginPath(); c.moveTo((o.x + p.x) / 2, (o.y + p.y) / 2); c.lineTo((q.x + p.x) / 2, (q.y + p.y) / 2); c.stroke(); }
        for (let i = 0; i < ps.length - 1; i++) if (ps[i].p && ps[i + 1].p) { c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 3; c.beginPath(); c.moveTo(ps[i].x - 2, ps[i].y - 3); c.lineTo(ps[i + 1].x - 2, ps[i + 1].y - 3); c.stroke(); } }
      // rust: blooms on every bare spot the rain reaches and creeps under the paint around it
      if (s.rust > 0) for (const T of s.tubes) T.pts.forEach((p, i) => { if (p.p) return; const r = 6 + s.rust * 12; c.fillStyle = `rgba(200,90,30,${0.5 + 0.4 * s.rust})`; c.beginPath(); c.arc(p.x, p.y, r, 0, 7); c.fill(); c.fillStyle = 'rgba(140,50,20,0.7)'; c.beginPath(); c.arc(p.x + Math.sin(i) * 4, p.y + Math.cos(i) * 3, r * 0.4, 0, 7); c.fill(); });
      // beads of rain rolling off a painted frame
      if (won || (s.rainT && !lost)) for (const T of s.tubes) for (let i = 0; i < T.pts.length; i += 4) { const p = T.pts[i], q = ((t * 1.5 + i * 0.13) % 1); c.fillStyle = 'rgba(200,230,255,0.85)'; c.beginPath(); c.arc(p.x + 4, p.y - 6 + q * 14, 2.5, 0, 7); c.fill(); }
      // the seat, the handlebars, the cranks
      c.fillStyle = '#2a2a34'; c.beginPath(); c.ellipse(G.S[0] - 4, G.S[1] - 14, 22, 6, -0.1, 0, 7); c.fill(); c.strokeStyle = '#2a2a34'; c.lineWidth = 4; c.beginPath(); c.moveTo(G.S[0], G.S[1]); c.lineTo(G.S[0] - 2, G.S[1] - 12); c.stroke();
      c.beginPath(); c.moveTo(G.H[0], G.H[1]); c.lineTo(G.H[0] - 4, G.H[1] - 22); c.quadraticCurveTo(G.H[0] + 26, G.H[1] - 34, G.H[0] + 30, G.H[1] - 16); c.stroke();
      c.fillStyle = '#5a5a6a'; c.beginPath(); c.arc(G.B[0], G.B[1], 12, 0, 7); c.fill(); c.strokeStyle = '#3a3a48'; c.lineWidth = 5; c.beginPath(); c.moveTo(G.B[0] - 16, G.B[1] + 18); c.lineTo(G.B[0] + 16, G.B[1] - 18); c.stroke();
      // the parts that came already painted from the factory
      const pre = [[G.B, G.R]]; if (s.lv < 1) pre.push([G.HB, G.F]); if (s.lv < 2) pre.push([G.S, G.R]);
      for (const [a, b] of pre) { c.strokeStyle = P.shade(s.col, -0.5); c.lineWidth = 10; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.strokeStyle = s.col; c.lineWidth = 7; c.stroke(); c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 2; c.beginPath(); c.moveTo(a[0] - 1, a[1] - 2); c.lineTo(b[0] - 1, b[1] - 2); c.stroke(); }
      // the hedgehog owner with the paint tin
      SK.animal(c, 'hedgehog', 324, 600, 0.9, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
      c.fillStyle = '#c8c8d0'; c.strokeStyle = '#4a4a5a'; c.lineWidth = 2; c.beginPath(); c.roundRect(254, 572, 34, 34, 4); c.fill(); c.stroke(); c.fillStyle = s.col; c.fillRect(254, 580, 34, 14);
      const left = s.tubes.filter(T => T.pts.some(p => !p.p));
      if (!g.done) { const T0 = left[0]; if (T0) { const m = T0.pts.filter(p => !p.p), q = m[Math.floor(m.length / 2)], d = [T0.b[0] - T0.a[0], T0.b[1] - T0.a[1]], L = Math.hypot(d[0], d[1]), nx = -d[1] / L, ny = d[0] / L, sg = (q.x - 180) * nx + (q.y - 400) * ny > 0 ? 1 : -1; SK.tag(c, 'Bare steel', SK.clamp(q.x + nx * sg * 44, 60, 300), SK.clamp(q.y + ny * sg * 44, 150, 560), 18); } if (!won) SK.tag(c, (s.tubes.length - left.length) + ' / ' + s.tubes.length + ' painted', 92, 600, 18); }
      if (lost && s.rust > 0.3) SK.tag(c, 'Rust', 180, 252, 20, '#fff6ea', 'rgba(170,70,20,0.92)');
      if (s.last && !g.done) brush(c, s.last[0], s.last[1], s.col);
      // guidance: brush along the next tube with bare steel on it, from its first bare spot to its last
      const T = !g.done && !s.rainT ? left[0] : null; let a = null, b = null;
      if (T) { const bare = T.pts.filter(p => !p.p); a = [bare[0].x, bare[0].y]; b = [bare[bare.length - 1].x, bare[bare.length - 1].y];
        if (SK.dist(a[0], a[1], b[0], b[1]) < 12) { const d = [T.b[0] - T.a[0], T.b[1] - T.a[1]], L = Math.hypot(d[0], d[1]); b = [a[0] + d[0] / L * 14, a[1] + d[1] / L * 14]; a = [a[0] - d[0] / L * 14, a[1] - d[1] / L * 14]; }
        if (!s.last) { SK.grab(c, g, a[0], a[1], 18, { col: '#e8563a' }); SK.arrow(c, g, a[0], a[1], b[0], b[1], { col: '#c0502a', from: 20, to: 4 }); SK.target(c, g, b[0], b[1], 14, { col: '#e8563a' }); } }
      SK.demo(g, c, 'drag', a || [180, 400], b || [180, 400], { never: !T });
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 0.7 || s.rainT) return; const B = s._cb = s._cb || { n: 0, at: 0 };
      if (B.cur) { if (SK.bot.drag(g, synth, 'p' + B.n, B.cur.t0, B.cur.a, B.cur.b, 0.45)) { B.n++; B.cur = null; B.at = g.t + 0.1; } return; }
      if (g.t < B.at) return; const T = s.tubes.find(T => T.pts.some(p => !p.p)); if (!T) return; const bare = T.pts.filter(p => !p.p);
      const d = [T.b[0] - T.a[0], T.b[1] - T.a[1]], L = Math.hypot(d[0], d[1]);
      B.cur = { t0: g.t, a: [bare[0].x - d[0] / L * 6, bare[0].y - d[1] / L * 6], b: [bare[bare.length - 1].x + d[0] / L * 6, bare[bare.length - 1].y + d[1] / L * 6] };
    },
  });
})();
