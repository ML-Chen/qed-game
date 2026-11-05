// FENCE! (chem_bio MB-12) — a river seen from above winds down through a pasture. Cows stand on the bank to drink and
// trample it into mud; the mud washes into the river, which runs brown, and the fish have gone. Drag along each muddy
// stretch of the bank to build a fence there: the cows bump it and wander off to graze, grass grows back over the mud,
// the water clears and the fish swim back in. Level 0: two stretches; level 1: three; level 2: three stretches and a
// second cause, a farm drain pouring muck into the river, to shut with a tap.
(() => {
  const RW = 92, FO = 14, TOL = 24;
  const cxAt = (s, y) => 150 + 44 * Math.sin(y * 0.011 + s.ph);
  const bankX = (s, y) => cxAt(s, y) + RW / 2 + FO;
  const STR = [[[200, 292], [400, 492]], [[176, 262], [326, 412], [470, 556]], [[176, 262], [326, 412], [470, 556]]];
  function paintBg(o, s) {
    const gr = o.createLinearGradient(0, 0, 0, 640); gr.addColorStop(0, '#8ac860'); gr.addColorStop(1, '#5a9a40'); o.fillStyle = gr; o.fillRect(0, 0, 360, 640);
    const r = P.rng(12); for (let i = 0; i < 160; i++) { o.fillStyle = r() < 0.5 ? 'rgba(60,120,40,0.35)' : 'rgba(190,230,140,0.35)'; o.beginPath(); o.ellipse(r() * 360, r() * 640, 3 + r() * 6, 2 + r() * 3, r() * 3, 0, 7); o.fill(); }
    for (let i = 0; i < 10; i++) { const x = 270 + r() * 90, y = 130 + r() * 480; P.tree(o, x + 30, y, 0.4); }
    for (let i = 0; i < 6; i++) { const x = r() * 60, y = 140 + r() * 480; P.tree(o, x, y, 0.38); }
    // the river bed and its sandy banks
    o.fillStyle = '#c8b080'; o.beginPath(); for (let y = 0; y <= 640; y += 8) o.lineTo(cxAt(s, y) - RW / 2 - 8, y); for (let y = 640; y >= 0; y -= 8) o.lineTo(cxAt(s, y) + RW / 2 + 8, y); o.closePath(); o.fill();
  }
  function cow(c, x, y, t, ph, away, col) {
    c.save(); c.translate(x, y); const bob = Math.sin(t * 3 + ph) * 2, f = away ? -1 : 1; c.scale(f, 1);
    c.fillStyle = 'rgba(30,14,36,0.2)'; c.beginPath(); c.ellipse(0, 14, 26, 6, 0, 0, 7); c.fill();
    c.strokeStyle = '#3a2a2a'; c.lineWidth = 4; c.lineCap = 'round'; for (const lx of [-15, -7, 9, 16]) { c.beginPath(); c.moveTo(lx, 2); c.lineTo(lx + Math.sin(t * 6 + lx) * (away ? 2 : 0.5), 13); c.stroke(); }
    c.fillStyle = '#f8f4ee'; c.strokeStyle = '#3a2a2a'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, -4, 24, 13, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = col; c.beginPath(); c.ellipse(-8, -8, 8, 6, 0.4, 0, 7); c.fill(); c.beginPath(); c.ellipse(9, -1, 6, 5, -0.3, 0, 7); c.fill();
    c.fillStyle = '#f8f4ee'; c.beginPath(); c.ellipse(-26, -2 + bob + (away ? -6 : 4), 9, 8, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#f0a8a8'; c.beginPath(); c.ellipse(-32, 1 + bob + (away ? -6 : 4), 5, 4, 0, 0, 7); c.fill(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(-25, -5 + bob + (away ? -6 : 4), 1.6, 0, 7); c.fill();
    c.strokeStyle = '#c8b88a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-24, -9 + bob + (away ? -6 : 4)); c.lineTo(-20, -15 + bob + (away ? -6 : 4)); c.stroke();
    c.strokeStyle = '#3a2a2a'; c.lineWidth = 2; c.beginPath(); c.moveTo(23, -6); c.quadraticCurveTo(30, -2 + Math.sin(t * 4 + ph) * 4, 28, 8); c.stroke();
    c.restore();
  }
  function fenceSeg(c, a, b) { c.strokeStyle = '#8a5a2a'; c.lineWidth = 3; c.beginPath(); c.moveTo(a.x, a.y - 4); c.lineTo(b.x, b.y - 4); c.moveTo(a.x, a.y + 3); c.lineTo(b.x, b.y + 3); c.stroke(); }
  function post(c, p) { c.fillStyle = '#6a4020'; c.fillRect(p.x - 3, p.y - 8, 6, 14); c.fillStyle = '#a87040'; c.fillRect(p.x - 3, p.y - 8, 6, 3); }
  MG.add({
    id: 'fence', stage: 'life', cmd: 'FENCE THE COWS OFF THE BANK!', cmdAt: [null, null, 'FENCE THE BANK, SHUT THE DRAIN!'], time: 7, mood: 'bright', winText: 'The river came back to life!', failText: 'Still muddy!',
    card: { title: 'Fix the cause', kind: 'Ecology', ref: 'Habitat restoration',
      text: 'The fish had left because the river was full of mud. The mud came from the bank: cows walking down to drink trampled the plants, and with no roots to hold it, the soil washed into the water.\n\nAdding more fish would not help. They would swim into the same muddy water. A fence keeps the cows off the bank. The plants grow back, their roots hold the soil, the water clears, and the fish return on their own.\n\nOften a problem in nature has more than one cause, like mud from a bank and muck from a drain. Each one has to be fixed.',
      note: 'An ecosystem recovers when you fix the cause of the problem, not just the symptoms.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.lv = lv; s.v = SK.variant(g, 4); s.ph = [0, 1.6, 3.1, 4.6][s.v];
      s.str = STR[lv].map(([y0, y1], i) => { const pts = []; for (let y = y0; y <= y1; y += 8) pts.push({ x: bankX(s, y), y, f: 0 }); return { y0, y1, pts, done: 0, cow: { x: bankX(s, (y0 + y1) / 2) + 26, y: (y0 + y1) / 2, ph: i * 1.7 } }; });
      s.drain = lv >= 2 ? { y: [300, 220, 470, 380][s.v], open: true, t: 0 } : null; if (s.drain) s.drain.x = cxAt(s, s.drain.y) - RW / 2 - 10;
      s.last = null; s.clear = 0; s.winAt = 0; s.fish = [0, 1, 2, 3, 4, 5].map(i => ({ y: 120 + i * 90 + g.rand() * 40, ph: g.rand() * 6, sp: 30 + g.rand() * 30, col: ['#f0a050', '#e86a5a', '#f0c850'][i % 3] }));
      s.cowCol = ['#2a2424', '#8a5a3a', '#3a3030', '#6a4a3a'][s.v];
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return;
      if (s.drain && s.drain.open && SK.dist(x, y, s.drain.x - 16, s.drain.y) < 38) { s.drain.open = false; s.drain.t = g.t; g.sfx('click'); g.sfx('thud'); return; }
      s.last = [x, y]; build(g, x, y); },
    move(g, x, y) { const s = g.s; if (!s.last || g.done) return; const [x0, y0] = s.last, n = Math.max(1, Math.ceil(SK.dist(x0, y0, x, y) / 4)); for (let k = 1; k <= n; k++) build(g, SK.lerp(x0, x, k / n), SK.lerp(y0, y, k / n)); s.last = [x, y]; },
    up(g) { g.s.last = null; },
    update(g, dt) {
      const s = g.s, t = g.t;
      for (const S of s.str) { if (!S.done && S.pts.every(p => p.f)) { S.done = t; g.sfx('moo'); g.sfx('chime'); }
        const target = S.done ? bankX(s, (S.y0 + S.y1) / 2) + 90 : bankX(s, (S.y0 + S.y1) / 2) + 26; S.cow.x += (Math.min(330, target) - S.cow.x) * Math.min(1, dt * 2.5); }
      const fixed = s.str.filter(S => S.done).length + (s.drain && !s.drain.open ? 1 : 0), causes = s.str.length + (s.drain ? 1 : 0);
      s.clear += (fixed / causes - s.clear) * Math.min(1, dt * 2.2);
      if (fixed === causes && !g.done) { if (!s.winAt) s.winAt = t + 0.6; if (t >= s.winAt) { g.win(); g.sfx('cheer'); g.sfx('splash'); } }
      for (const f of s.fish) f.y += f.sp * dt * (s.clear > 0.5 ? 1 : 0.4);
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('fence_bg' + s.v, o => paintBg(o, s)), 0, 0, 360, 640);
      // the water: brown with mud, clearing to blue as the causes are fixed
      const col = P.mix('#8a6a3a', '#3a9ad0', s.clear), col2 = P.mix('#a8845a', '#7ad0f0', s.clear);
      c.fillStyle = col; c.beginPath(); for (let y = 0; y <= 640; y += 8) c.lineTo(cxAt(s, y) - RW / 2, y); for (let y = 640; y >= 0; y -= 8) c.lineTo(cxAt(s, y) + RW / 2, y); c.closePath(); c.fill();
      c.strokeStyle = col2; c.lineWidth = 2; for (let i = 0; i < 14; i++) { const y = ((i * 52 + t * 40) % 680) - 20, x = cxAt(s, y) + Math.sin(i * 2.3) * 24; c.beginPath(); c.moveTo(x - 8, y); c.quadraticCurveTo(x, y + 4, x + 8, y); c.stroke(); }
      // mud swirls in the water below every muddy stretch, and from the open drain
      for (const S of s.str) if (!S.done || t - S.done < 1) { const k = S.done ? 1 - (t - S.done) : 1; for (let i = 0; i < 5; i++) { const q = (t * 0.5 + i / 5) % 1, y = S.y0 + q * 160, x = cxAt(s, y) + 20 - q * 30; c.fillStyle = `rgba(110,70,30,${0.4 * k * (1 - q)})`; c.beginPath(); c.ellipse(x, y, 16, 8, 0.4, 0, 7); c.fill(); } }
      if (s.drain) { const D = s.drain; if (D.open) for (let i = 0; i < 5; i++) { const q = (t * 0.8 + i / 5) % 1; c.fillStyle = `rgba(90,60,30,${0.6 * (1 - q)})`; c.beginPath(); c.ellipse(D.x + 6 + q * 30, D.y + q * 60, 10 + q * 10, 6, 0.6, 0, 7); c.fill(); }
        c.fillStyle = '#6a6a7a'; c.strokeStyle = '#2a2a3a'; c.lineWidth = 2; c.beginPath(); c.roundRect(D.x - 46, D.y - 9, 46, 18, 5); c.fill(); c.stroke();
        c.fillStyle = D.open ? '#e8403a' : '#5ad07a'; c.beginPath(); c.arc(D.x - 16, D.y, 10, 0, 7); c.fill(); c.stroke(); c.strokeStyle = '#fff'; c.lineWidth = 3; c.beginPath(); c.moveTo(D.x - 22, D.y); c.lineTo(D.x - 10, D.y); if (D.open) { c.moveTo(D.x - 16, D.y - 6); c.lineTo(D.x - 16, D.y + 6); } c.stroke();
        if (!g.done) SK.tag(c, 'Drain', D.x - 24, D.y - 26, 18); }
      // fish: back once the water clears
      for (const f of s.fish) { const y = ((f.y % 700) + 700) % 700 - 30, vis = SK.clamp(s.clear * 1.6 - 0.4, 0, 1); if (vis <= 0) continue; c.globalAlpha = vis; P.fishShape(c, cxAt(s, y) + Math.sin(t * 2 + f.ph) * 22, y, 0.9, f.col); c.globalAlpha = 1; }
      // the banks: trampled mud, or grass growing back behind the fence
      for (const S of s.str) {
        const k = S.done ? SK.clamp((t - S.done) / 0.8, 0, 1) : 0;
        c.fillStyle = `rgba(110,72,40,${0.9 * (1 - k)})`; c.beginPath(); for (let y = S.y0 - 6; y <= S.y1 + 6; y += 6) c.lineTo(bankX(s, y) - FO - 4 + Math.sin(y * 0.3) * 3, y); for (let y = S.y1 + 6; y >= S.y0 - 6; y -= 6) c.lineTo(bankX(s, y) + 34 + Math.sin(y * 0.2) * 5, y); c.closePath(); c.fill();
        if (!S.done) for (let i = 0; i < 6; i++) { const y = S.y0 + 10 + i * (S.y1 - S.y0 - 20) / 5; c.fillStyle = 'rgba(70,40,20,0.7)'; c.beginPath(); c.ellipse(bankX(s, y) + 10 + (i % 2) * 10, y, 4, 3, 0, 0, 7); c.fill(); }
        if (k > 0) for (let y = S.y0; y <= S.y1; y += 7) { c.strokeStyle = '#4a9a30'; c.lineWidth = 2; const h = 8 * k; const x = bankX(s, y) - FO + 4 + Math.sin(y) * 4; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 2, y - h); c.moveTo(x + 4, y); c.lineTo(x + 5, y - h); c.stroke(); }
        // the fence: posts where you dragged, rails between neighbouring posts
        for (let i = 0; i < S.pts.length; i++) { const p = S.pts[i]; if (!p.f) continue; if (i + 1 < S.pts.length && S.pts[i + 1].f) fenceSeg(c, p, S.pts[i + 1]); }
        S.pts.forEach((p, i) => { if (p.f && i % 2 === 0) post(c, p); });
        cow(c, S.cow.x, S.cow.y, t, S.cow.ph, !!S.done, s.cowCol);
      }
      // the duck on the water
      const dy = 590, dx = cxAt(s, dy); SK.animal(c, 'duck', dx, dy + 10, 0.75, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : s.clear > 0.5 ? 'happy' : 'think', noShadow: true });
      const left = s.str.filter(S => !S.done);
      if (!g.done) { if (left[0]) SK.tag(c, "Riverbank", SK.clamp(bankX(s, left[0].y0) + 110, 60, 300), left[0].y0 - 6, 18); SK.tag(c, 'Fenced ' + (s.str.length - left.length) + ' / ' + s.str.length, 72, 140, 18); }
      // guidance: drag along the next muddy stretch, from its first gap to its last; then (level 2) shut the drain
      if (g.done) return;
      const S = left[0];
      if (S && !s.last) { const bare = S.pts.filter(p => !p.f), a = bare[0], b = bare[bare.length - 1];
        SK.grab(c, g, a.x, a.y, 18); SK.arrow(c, g, a.x, a.y, b.x, b.y, { from: 20, to: 6 }); SK.target(c, g, b.x, b.y, 14);
        SK.demo(g, c, 'drag', [a.x, a.y], [b.x, b.y]); return; }
      if (!S && s.drain && s.drain.open) { SK.glow(c, g, s.drain.x - 16, s.drain.y, 24, '#ffe27a', { level: 2 }); SK.demo(g, c, 'tap', [s.drain.x - 16, s.drain.y + 4], null); return; }
      SK.demo(g, c, 'tap', [180, 300], null, { never: true });
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 0.7) return; const B = s._fb = s._fb || { n: 0, at: 0 };
      if (B.cur) { if (SK.bot.drag(g, synth, 'f' + B.n, B.cur.t0, B.cur.a, B.cur.b, 0.5)) { B.n++; B.cur = null; B.at = g.t + 0.1; } return; }
      if (g.t < B.at) return; const S = s.str.find(S => !S.done && S.pts.some(p => !p.f));
      if (S) { const bare = S.pts.filter(p => !p.f); B.cur = { t0: g.t, a: [bare[0].x, bare[0].y - 4], b: [bare[bare.length - 1].x, bare[bare.length - 1].y + 4] }; return; }
      if (s.drain && s.drain.open) { synth('down', s.drain.x - 16, s.drain.y); synth('up', s.drain.x - 16, s.drain.y); B.at = g.t + 0.5; }
    },
  });
  // building: every fence point of a muddy stretch close to the finger gets its post
  function build(g, x, y) { const s = g.s; let n = 0; for (const S of s.str) if (!S.done) for (const p of S.pts) if (!p.f && SK.dist(p.x, p.y, x, y) <= TOL) { p.f = g.t; n++; }
    if (n && g.t - (s.knock || 0) > 0.14) { s.knock = g.t; g.sfx('tap', { pitch: 0.7 }); } }
})();
