// POLLINATE! (chem_bio MB-07) — a spring orchard: two apple trees in blossom and a bumblebee. Drag to fly the bee (it
// buzzes after your finger). Touch a flower and the bee's fuzzy legs pick up that tree's pollen (yellow dust). Fly to a
// flower on the OTHER tree: the pollen rubs off, the petals fall and the flower swells into an apple, and the bee picks
// up pollen there for the way back. Pollen taken to a flower on the same tree does nothing (apple trees need pollen
// from another tree): the flower just shakes. Level 0: two apples; level 1: three; level 2: three, with a breeze that
// pushes the bee and a hungry bird swooping across that knocks the pollen off the bee.
(() => {
  const TREES = [{ x: 92, y: 300 }, { x: 268, y: 300 }], CR = 88, GROUND = 566;
  const OFFS = [[[-40, -34], [12, -50], [44, -6], [-30, 22], [20, 34]], [[-46, -10], [-6, -52], [40, -30], [-18, 30], [36, 24]], [[-34, -44], [24, -40], [-44, 14], [8, 0], [40, 36]], [[-20, -54], [36, -24], [-46, -6], [-6, 36], [30, 18]]];
  function paintBg(o) {
    P.sky(o, 360, 640, ['#7ec4f0', '#bfe4f6', '#f4f8e8']);
    P.cloud(o, 70, 150, 0.7); P.cloud(o, 290, 190, 0.55);
    P.hills(o, 360, 470, 50, '#a8d880', '#78b058', { seed: 6 });
    P.hills(o, 360, 520, 30, '#8ac860', '#5a9a40', { seed: 2 });
    const gr = o.createLinearGradient(0, 520, 0, 640); gr.addColorStop(0, '#7ab850'); gr.addColorStop(1, '#4a8a34'); o.fillStyle = gr; o.fillRect(0, 540, 360, 100);
    P.grassTufts(o, 360, 548, 630, 30, '#3a7a28', 3); P.flowers(o, 360, 556, 626, 22, ['#ffffff', '#f8d84a', '#f4a0c0'], 4);
    // the two trunks and branches
    for (const T of TREES) {
      o.strokeStyle = '#6a4a30'; o.lineCap = 'round'; o.lineWidth = 22; o.beginPath(); o.moveTo(T.x, GROUND); o.quadraticCurveTo(T.x - 6, T.y + 120, T.x, T.y + 40); o.stroke();
      o.lineWidth = 10; for (const [dx, dy] of [[-44, -10], [40, -20], [-10, -46], [30, 30]]) { o.beginPath(); o.moveTo(T.x, T.y + 70); o.quadraticCurveTo(T.x + dx * 0.5, T.y + 36, T.x + dx * 1.3, T.y + dy * 1.3); o.stroke(); }
      o.fillStyle = 'rgba(30,14,36,0.2)'; o.beginPath(); o.ellipse(T.x + 6, GROUND + 4, 60, 10, 0, 0, 7); o.fill();
      // the blossom crown: soft clumps of leaves and pale pink blossom
      const r = P.rng(Math.round(T.x));
      for (let i = 0; i < 34; i++) { const a = r() * 6.28, d = r() * CR * 0.85, x = T.x + Math.cos(a) * d, y = T.y + Math.sin(a) * d * 0.85, rr = 26 + r() * 18;
        const lg = o.createRadialGradient(x - rr * 0.3, y - rr * 0.3, 2, x, y, rr); lg.addColorStop(0, '#9ad870'); lg.addColorStop(1, '#4a9a48'); o.fillStyle = lg; o.beginPath(); o.arc(x, y, rr, 0, 7); o.fill(); }
      for (let i = 0; i < 60; i++) { const a = r() * 6.28, d = r() * CR, x = T.x + Math.cos(a) * d, y = T.y + Math.sin(a) * d * 0.85; o.fillStyle = r() < 0.5 ? 'rgba(255,230,240,0.9)' : 'rgba(250,190,215,0.85)'; o.beginPath(); o.arc(x, y, 2.5 + r() * 2.5, 0, 7); o.fill(); }
    }
  }
  function flower(c, x, y, t, k, shake) { // k: 0 open flower .. 1 ripe apple
    c.save(); c.translate(x + shake, y);
    if (k < 0.5) { const sp = 1 - k * 2; for (let i = 0; i < 5; i++) { const a = i * 1.2566 + t * 0.2; c.fillStyle = i % 2 ? '#fff4f8' : '#ffd8e8'; c.strokeStyle = '#d87aa0'; c.lineWidth = 1.2; c.beginPath(); c.ellipse(Math.cos(a) * 8 * sp, Math.sin(a) * 8 * sp + k * 30, 7 * sp + 0.1, 5 * sp + 0.1, a, 0, 7); c.fill(); c.stroke(); }
      c.fillStyle = '#f8c830'; c.beginPath(); c.arc(0, 0, 4.5, 0, 7); c.fill(); for (let i = 0; i < 6; i++) { c.fillStyle = '#e89a20'; c.beginPath(); c.arc(Math.cos(i) * 3, Math.sin(i) * 3, 1, 0, 7); c.fill(); } }
    if (k > 0.3) { const q = SK.clamp((k - 0.3) / 0.7, 0, 1), r = 5 + q * 11; SK.ball(c, 0, 4, r, P.mix('#8ac840', '#e83a3a', q)); c.strokeStyle = '#6a3a1a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, 4 - r); c.lineTo(2, -4 - r); c.stroke(); c.fillStyle = '#4aa83a'; c.beginPath(); c.ellipse(6, -2 - r, 5, 2.5, -0.5, 0, 7); c.fill(); }
    c.restore();
  }
  function bee(c, x, y, t, vx, pollen, facing) {
    c.save(); c.translate(x, y); c.scale(facing, 1); c.rotate(SK.clamp(vx / 1500, -0.25, 0.25));
    const flap = Math.sin(t * 60) * 0.5; c.scale(1.15, 1.15);
    c.fillStyle = 'rgba(230,245,255,0.75)'; c.strokeStyle = 'rgba(80,90,120,0.6)'; c.lineWidth = 1.2;
    for (const s of [-1, 1]) { c.save(); c.translate(-2, -10); c.rotate(-0.4 + s * 0.2 + flap * s * 0.4); c.beginPath(); c.ellipse(0, -10, 8, 13, 0, 0, 7); c.fill(); c.stroke(); c.restore(); }
    c.fillStyle = '#f8c830'; c.strokeStyle = '#3a2410'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 0, 18, 13, 0, 0, 7); c.fill(); c.stroke();
    c.save(); c.beginPath(); c.ellipse(0, 0, 18, 13, 0, 0, 7); c.clip(); c.fillStyle = '#2a1a10'; for (const sx of [-10, -1, 8]) c.fillRect(sx - 2.5, -14, 5, 28); c.restore();
    c.fillStyle = '#2a1a10'; c.beginPath(); c.arc(17, -2, 9, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(20, -4, 3, 0, 7); c.fill(); c.fillStyle = '#000'; c.beginPath(); c.arc(21, -4, 1.5, 0, 7); c.fill();
    c.strokeStyle = '#2a1a10'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(20, -9); c.quadraticCurveTo(24, -18, 28, -16); c.moveTo(16, -10); c.quadraticCurveTo(18, -20, 22, -20); c.stroke();
    // fuzzy legs, dusted with pollen
    for (const lx of [-6, 2, 9]) { c.strokeStyle = '#2a1a10'; c.lineWidth = 2; c.beginPath(); c.moveTo(lx, 11); c.lineTo(lx - 2, 18); c.stroke(); if (pollen) { c.fillStyle = '#ffd030'; c.beginPath(); c.arc(lx - 2, 18, 4, 0, 7); c.fill(); c.strokeStyle = '#c89010'; c.lineWidth = 1; c.stroke(); } }
    c.restore();
  }
  MG.add({
    id: 'pollinate', stage: 'life', cmd: 'CARRY POLLEN TO THE OTHER TREE!', time: 6, mood: 'bright', winText: 'Pollen made apples!', failText: 'No apples!',
    card: { title: 'Pollen makes fruit', kind: 'Biology', ref: 'Pollination',
      text: 'A flower can only turn into a fruit after pollen reaches it. Pollen is a fine yellow dust that flowers make.\n\nA bee visits flowers to drink their sweet nectar. Pollen sticks to its fuzzy body, and some rubs off on the next flower it visits. Then the flower can make seeds, and the fruit grows around them.\n\nMost apple trees need pollen from a different apple tree. Pollen from the same tree does not work. So orchards plant different kinds of apple trees side by side, and farmers keep bees.',
      note: 'When a bee carries pollen from one flower to another, the flower can turn into a fruit with seeds.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.v = SK.variant(g, 4); s.lv = lv;
      s.fl = []; TREES.forEach((T, ti) => OFFS[(s.v + ti) % 4].forEach(([dx, dy]) => s.fl.push({ x: T.x + dx * 1.3, y: T.y + dy * 1.25, tree: ti, k: 0, apple: false, at: 0, shake: -9 })));
      s.need = lv === 0 ? 2 : 3; s.made = 0;
      const f0 = s.fl.filter(f => f.tree === s.v % 2)[s.v % 5]; // the bee starts on a flower, already dusted with that tree's pollen
      s.b = { x: f0.x, y: f0.y - 6, vx: 0, vy: 0 }; s.face = s.v % 2 ? -1 : 1; s.pollen = f0.tree; s.dust = []; s.tgt = null; s.lastF = f0;
      s.wind = lv >= 2; s.bird = lv >= 2 ? { x: -60, dir: 1, y: 250, next: 2.2 } : null; s.winAt = 0; s.knock = -9;
    },
    down(g, x, y) { SK.touched(g); if (!g.done) g.s.tgt = [x, y]; },
    move(g, x, y) { if (!g.done && g.s.tgt) g.s.tgt = [x, y]; },
    up(g) { g.s.tgt = null; },
    update(g, dt) {
      const s = g.s, t = g.t, b = s.b;
      // the bee flies after the finger, and hovers when let go
      if (s.tgt && !g.done) { const dx = s.tgt[0] - b.x, dy = s.tgt[1] - 14 - b.y, d = Math.hypot(dx, dy), sp = Math.min(440, d * 7); b.vx = SK.lerp(b.vx, d > 1 ? dx / d * sp : 0, Math.min(1, dt * 10)); b.vy = SK.lerp(b.vy, d > 1 ? dy / d * sp : 0, Math.min(1, dt * 10)); }
      else { b.vx *= Math.exp(-dt * 5); b.vy *= Math.exp(-dt * 5); }
      if (s.wind) { const gust = Math.sin(t * 1.3) > 0.2 ? 1 : 0.2; b.vx += 90 * gust * dt * 3; }
      b.x = SK.clamp(b.x + b.vx * dt, 20, 340); b.y = SK.clamp(b.y + b.vy * dt + Math.sin(t * 7) * 0.3, 140, 590);
      if (Math.abs(b.vx) > 20) s.face = b.vx > 0 ? 1 : -1;
      // the hungry bird swoops across; it knocks the pollen off the bee
      if (s.bird) { const B = s.bird; if (B.x < -50 || B.x > 410) { if (t > B.next) { B.dir = B.x < 0 ? 1 : -1; B.x = B.dir > 0 ? -40 : 400; B.y = 220 + g.rand() * 220; B.next = t + 3.5; } }
        else { B.x += B.dir * 210 * dt; if (SK.dist(B.x, B.y, b.x, b.y) < 36 && t - s.knock > 1) { s.knock = t; if (s.pollen >= 0) { s.pollen = -1; for (let i = 0; i < 8; i++) s.dust.push({ x: b.x, y: b.y + 14, vx: (g.rand() - 0.5) * 120, vy: g.rand() * 60, life: 0.7 }); } b.vy -= 260; b.vx += B.dir * 200; g.sfx('tweet'); g.sfx('boing'); } } }
      // touching a flower
      if (!g.done) for (const f of s.fl) {
        if (f.apple || SK.dist(f.x, f.y, b.x, b.y + 10) > 22) { if (s.lastF === f && SK.dist(f.x, f.y, b.x, b.y + 10) > 34) s.lastF = null; continue; }
        if (s.lastF === f) continue; s.lastF = f;
        if (s.pollen >= 0 && s.pollen !== f.tree) { f.apple = true; f.at = t; s.made++; g.sfx('grow'); g.sfx('chime'); g.burst(f.x, f.y, ['#ffd030', '#fff4f8', '#ffb8d0'], 14, 120); }
        else if (s.pollen === f.tree) { f.shake = t; g.sfx('wrong', { vol: 0.5 }); }
        else g.sfx('sparkle');
        s.pollen = f.tree; g.sfx('buzz', { vol: 0.5 });
        for (let i = 0; i < 6; i++) s.dust.push({ x: f.x, y: f.y, vx: (g.rand() - 0.5) * 70, vy: -g.rand() * 50, life: 0.6 });
      }
      for (const f of s.fl) if (f.apple) f.k = SK.clamp((t - f.at) / 0.6, 0, 1);
      for (const p of s.dust) { p.vy += 120 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; } s.dust = s.dust.filter(p => p.life > 0);
      if (!g.done && s.made >= s.need) { if (!s.winAt) s.winAt = t + 0.45; if (t >= s.winAt) { g.win(); g.sfx('cheer'); } }
    },
    draw(g, c) {
      const s = g.s, t = g.t, b = s.b, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('pollinate_bg', paintBg), 0, 0, 360, 640);
      for (const f of s.fl) flower(c, f.x, f.y, t, f.k, t - f.shake < 0.4 ? Math.sin((t - f.shake) * 50) * 3 : 0);
      TREES.forEach((T, i) => SK.tag(c, 'Apple tree', T.x, 470, 18));
      // the host bird on the grass, and the hungry one swooping
      SK.animal(c, 'bird', 318, 600, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'happy', facing: -1 });
      if (s.bird && s.bird.x > -50 && s.bird.x < 410) SK.animal(c, 'bird', s.bird.x, s.bird.y + 20, 0.9, { t, pose: 'hop', expr: 'wow', facing: s.bird.dir, noShadow: true, tint: '#5a5a7a' });
      if (s.wind) for (let i = 0; i < 4; i++) { const y = 180 + i * 100, x = ((t * 140 + i * 97) % 420) - 30; c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 2.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 40, y); c.quadraticCurveTo(x - 20, y - 8, x, y); c.stroke(); }
      for (const p of s.dust) { c.fillStyle = `rgba(255,208,48,${Math.min(1, p.life * 2)})`; c.beginPath(); c.arc(p.x, p.y, 2.5, 0, 7); c.fill(); }
      bee(c, b.x, b.y, t, b.vx, s.pollen >= 0, s.face);
      if (s.pollen >= 0 && !g.done) SK.tag(c, 'Pollen', SK.clamp(b.x, 50, 310), b.y + 46, 18, '#5a3a00', 'rgba(255,214,80,0.92)');
      if (!won) SK.tag(c, 'Apples ' + s.made + ' / ' + s.need, 180, 150, 18);
      // guidance: fly the bee to a flower (any, to pick up pollen), then to a flower on the other tree
      if (g.done) return;
      const other = s.pollen < 0 ? null : 1 - s.pollen, open = s.fl.filter(f => !f.apple && (other == null || f.tree === other) && f !== s.lastF);
      const f = open.reduce((a, f) => !a || SK.dist(f.x, f.y, b.x, b.y) < SK.dist(a.x, a.y, b.x, b.y) ? f : a, null);
      if (f) { SK.grab(c, g, b.x, b.y, 28, { col: '#e8563a' }); SK.target(c, g, f.x, f.y, 18, { col: '#e8563a' }); SK.arrow(c, g, b.x, b.y, f.x, f.y, { col: '#c0502a', from: 34, to: 30 }); }
      SK.demo(g, c, 'drag', [b.x, b.y + 14], f ? [f.x, f.y + 10] : [b.x, b.y], { never: !f });
    },
    auto(g, dt, synth) {
      const s = g.s, b = s.b; if (g.done || g.t < 0.7) return; const B = s._pb = s._pb || {};
      const other = s.pollen < 0 ? null : 1 - s.pollen, open = s.fl.filter(f => !f.apple && (other == null || f.tree === other) && f !== s.lastF);
      const f = open.reduce((a, f) => !a || SK.dist(f.x, f.y, b.x, b.y) < SK.dist(a.x, a.y, b.x, b.y) ? f : a, null); if (!f) return;
      if (!B.down) { B.down = 1; synth('down', b.x, b.y + 14); }
      synth("move", f.x, f.y + 10);
    },
  });
})();
