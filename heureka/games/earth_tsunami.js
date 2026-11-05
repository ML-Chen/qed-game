// WARN EVERYONE TO RUN UPHILL! (earth EE MSE-08 CLIMB!) — a beach town at the foot of a hill. The sea has suddenly
// drained far out, leaving fish flapping on the wet sand, and the villagers wander out to pick them up. Far out at sea a
// wall of water is building. Tap each villager to warn them: they drop everything and run along the beach and up the hill
// path (slower uphill, slower still on the soft wet sand). Once everyone is above the dashed safe line, the wave rushes
// in, floods the beach and stops below them, and they wave from the top. Anyone still down low gets a big cartoon splash.
// The wave's approach follows the fuse, so it never arrives before a player copying the hand could warn everyone.
// Level 0: three villagers; level 1: four; level 2: four, and they wander further out after the fish.
(() => {
  const BEACH = 470, SAFE = 372, HILL0 = 196, TOP = { x: 296, y: 300 }, SHORE0 = 158;
  const groundY = x => x < HILL0 ? BEACH : x < TOP.x ? BEACH - (x - HILL0) / (TOP.x - HILL0) * (BEACH - TOP.y) : TOP.y;
  const KINDS = ['rabbit', 'fox', 'hedgehog', 'penguin'];
  function paintBg(o) {
    const sky = o.createLinearGradient(0, 0, 0, BEACH); sky.addColorStop(0, '#7ab8e8'); sky.addColorStop(1, '#f4e0c0'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    P.cloud(o, 90, 160, 0.6); P.cloud(o, 250, 210, 0.45);
    // the hill with its path and trees, the beach and the town
    o.fillStyle = '#6aa84a'; o.beginPath(); o.moveTo(HILL0 - 10, BEACH + 4); o.lineTo(TOP.x, TOP.y); o.lineTo(360, TOP.y - 8); o.lineTo(360, 640); o.lineTo(HILL0 - 10, 640); o.closePath(); o.fill();
    o.strokeStyle = '#d8c090'; o.lineWidth = 7; o.lineCap = 'round'; o.beginPath(); o.moveTo(HILL0, BEACH - 2); o.lineTo(TOP.x, TOP.y - 2); o.lineTo(352, TOP.y - 6); o.stroke();
    for (const [x, s] of [[318, 0.6], [344, 0.5], [262, 0.45]]) P.tree(o, x, groundY(x) - 2, s);
    o.fillStyle = '#e8d098'; o.fillRect(0, BEACH, HILL0 + 4, 640 - BEACH); o.fillStyle = '#d8bc80'; for (let i = 0; i < 40; i++) { o.beginPath(); o.arc((i * 47) % 200, BEACH + 10 + (i * 31) % 150, 2, 0, 7); o.fill(); }
    for (const [x, w, col] of [[166, 30, '#f0a080'], [128, 26, '#a0c8e8']]) P.house(o, x, BEACH, w, 26, col);
  }
  function villager(c, v, t) {
    const sk = v.st === 'safe' ? 'cheer' : v.st === 'run' ? 'walk' : v.st === 'wet' ? 'sad' : 'idle';
    if (v.st === 'wet') { c.save(); c.translate(v.x, v.y - 10); c.rotate(Math.sin(t * 4 + v.ph) * 0.5); SK.animal(c, v.kind, 0, 10, 0.55, { t: t + v.ph, pose: 'sad', expr: 'wow', noShadow: true }); c.restore();
      c.strokeStyle = '#e84a3a'; c.lineWidth = 5; c.beginPath(); c.ellipse(v.x, v.y - 6, 18, 6, 0, 0, 7); c.stroke(); return; } // bobbing in a rubber ring
    SK.animal(c, v.kind, v.x, v.y, 0.55, { t: t + v.ph, pose: sk, expr: v.st === 'safe' ? 'laugh' : v.st === 'run' ? 'wow' : 'happy', facing: v.st === 'run' || v.st === 'safe' ? 1 : v.f });
    if (v.st === 'fish') { c.save(); c.translate(v.x + v.f * 12, v.y - 22); c.rotate(Math.sin(t * 12) * 0.4); P.fishShape(c, 0, 0, 0.35, '#8ad0f0'); c.restore(); }
  }
  MG.add({
    id: 'earth_tsunami', stage: 'earth', cmd: 'WARN EVERYONE TO RUN UPHILL!', time: 6, mood: 'storm', winText: 'Safe on high ground!', failText: 'Splash! Too low!',
    card: { title: 'When the sea pulls back, run uphill', kind: 'Earth science', ref: 'Tsunami warning signs',
      text: "A tsunami is a series of giant waves, usually set off by an earthquake under the sea. Sometimes the first sign is the sea suddenly pulling far back from the beach, leaving fish and seaweed stranded.\n\nThat means a huge wave is coming, often within minutes. Don't go out to look or to pick things up. Head for high ground or far inland at once, and stay there, because more waves can follow.\n\nOut in the deep ocean a tsunami travels as fast as a jet plane. Near the shore it slows down and grows tall.",
      note: 'If the sea suddenly pulls back from the beach, a tsunami may be coming: go to high ground right away.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level), v = SK.variant(g, 4), n = L === 0 ? 3 : 4, kinds = SK.shuffled(g, KINDS), xs = SK.shuffled(g, [44, 78, 112, 150]);
      s.v = xs.slice(0, n).map((x, i) => ({ kind: kinds[i], x, y: BEACH, f: -1, st: 'walk', tt: 0.5 + g.rand(), ph: i * 1.7, far: [90, 60, 16][L] + i * 18, slot: 0 }));
      s.allT = 0; s.hitT = 0; s.fish = []; for (let i = 0; i < 7; i++) s.fish.push({ x: 6 + g.rand() * 130, ph: g.rand() * 6 });
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return; const v = SK.pick(s.v.filter(q => q.st !== 'run' && q.st !== 'safe'), x, y + 18, 40); if (!v) return;
      v.st = 'run'; g.sfx('bell', { vol: 0.5 }); g.sfx(v.kind === 'penguin' ? 'honk' : 'tweet', { vol: 0.5 }); g.float('Run!', v.x, v.y - 50);
    },
    update(g, dt) {
      const s = g.s;
      for (const v of s.v) {
        if (v.st === 'walk' || v.st === 'fish') { // drawn seaward to the stranded fish
          v.tt -= dt; if (v.tt <= 0) { if (v.st === 'walk') { v.st = 'fish'; v.tt = 0.8 + g.rand() * 0.8; } else { v.st = 'walk'; v.tt = 0.6 + g.rand() * 0.6; } }
          if (v.st === 'walk' && !g.done) v.x = Math.max(v.far, v.x - 20 * dt);
        } else if (v.st === 'run' && !g.done) { const sp = v.x < SHORE0 - 20 ? 55 : v.x < HILL0 ? 90 : 52; v.x += sp * dt; v.y = groundY(v.x); if (v.y < SAFE - 4) { v.st = 'safe'; v.slot = 304 + s.v.filter(q => q.st === 'safe').length * 16; g.sfx('chime'); } }
        else if (v.st === 'safe' && v.x < v.slot) { v.x = Math.min(v.slot, v.x + 52 * dt); v.y = groundY(v.x); }
      }
      if (!g.done && s.v.every(q => q.st === 'safe')) { s.allT = g.t; s.hitT = g.t; s.k0 = 0.1 + 0.75 * SK.clamp(g.fuse() / g.dur, 0, 1); g.win(); g.sfx('cheer'); }
      if (g.result === 'fail' && !s.hitT) { s.hitT = g.t; s.k0 = 0.85; g.sfx('wave'); g.sfx('splash'); for (const q of s.v) if (q.st !== 'safe') q.st = 'wet'; }
      for (const q of s.v) if (q.st === 'wet') { q.x += Math.sin(g.t * 2 + q.ph) * 10 * dt; q.y = SAFE + 30 + Math.sin(g.t * 3 + q.ph) * 4; }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win';
      c.drawImage(g.bake('tsunami_bg', paintBg), 0, 0, 360, 640);
      // the drained sea floor with stranded fish, the sea pulled far back, and the wave building out there
      const fk = g.dur ? SK.clamp(g.fuse() / g.dur, 0, 1) : 0, k = s.hitT ? 0.85 : 0.1 + 0.75 * fk, hk = s.hitT ? SK.clamp((t - s.hitT) / 0.7, 0, 1) : 0;
      c.fillStyle = '#b8a070'; c.fillRect(0, BEACH, SHORE0, 640 - BEACH); c.fillStyle = 'rgba(90,70,50,0.25)'; for (let i = 0; i < 12; i++) { c.beginPath(); c.ellipse((i * 29) % SHORE0, BEACH + 20 + (i * 37) % 120, 12, 3, 0, 0, 7); c.fill(); }
      if (!s.hitT) for (const f of s.fish) { c.save(); c.translate(f.x, BEACH + 8); c.rotate(Math.sin(t * 10 + f.ph) * 0.5); P.fishShape(c, 0, 0, 0.4, '#8ad0f0'); c.restore(); }
      const wx = -14 + 60 * k, wh = 40 + 60 * k; // the wave out at sea (left edge), taller as it nears
      if (!s.hitT || hk < 1) { const x = s.hitT ? SK.lerp(wx, HILL0, hk) : wx, h = s.hitT ? SK.lerp(wh, BEACH - SAFE + 20, hk) : wh;
        const gw = c.createLinearGradient(0, BEACH - h, 0, 640); gw.addColorStop(0, '#5ab0d8'); gw.addColorStop(1, '#1e5a88'); c.fillStyle = gw; c.beginPath(); c.moveTo(-10, 640); c.lineTo(-10, BEACH - h + 10); c.quadraticCurveTo(x - 20, BEACH - h - 10, x + 14, BEACH - h + 16); c.quadraticCurveTo(x + 4, BEACH - h + 40, x + 20, 640); c.closePath(); c.fill();
        c.fillStyle = 'rgba(255,255,255,0.85)'; c.beginPath(); c.ellipse(x, BEACH - h + 4, 20, 7, -0.4, 0, 7); c.fill(); }
      else { const gw = c.createLinearGradient(0, SAFE + 20, 0, 640); gw.addColorStop(0, '#5ab0d8'); gw.addColorStop(1, '#1e5a88'); c.fillStyle = gw; const lvl = SAFE + 22, xs = HILL0 + (BEACH - lvl) / (BEACH - TOP.y) * (TOP.x - HILL0); c.beginPath(); c.moveTo(0, 640); c.lineTo(0, lvl); for (let x = 0; x <= xs; x += 20) c.lineTo(x, lvl + Math.sin(t * 3 + x * 0.05) * 2.5); c.lineTo(xs, lvl); c.lineTo(HILL0 - 10, BEACH + 4); c.lineTo(HILL0 - 10, 640); c.closePath(); c.fill(); }
      // the safe line up the hill
      c.save(); c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 3; c.setLineDash([8, 6]); c.beginPath(); c.moveTo(0, SAFE); c.lineTo(360, SAFE); c.stroke(); c.restore();
      SK.tag(c, 'High ground', 300, TOP.y + 42, 18, '#eaffea', 'rgba(30,110,60,0.88)');
      if (!s.hitT) { SK.tag(c, 'Wave', SK.clamp(wx + 30, 40, 200), BEACH - wh - 26, 18, '#fff6ea', 'rgba(30,70,140,0.9)'); SK.tag(c, 'Sea pulled back', 92, 600, 18); }
      for (const v of s.v) villager(c, v, t);
      const safe = s.v.filter(q => q.st === 'safe').length; if (!won) SK.tag(c, safe + ' / ' + s.v.length + ' safe', 290, 170, 18);
      SK.animal(c, 'duck', 336, TOP.y - 4, 0.55, { t, pose: won ? 'cheer' : g.result === 'fail' ? 'sad' : 'wave', expr: won ? 'laugh' : 'wow', facing: -1 });
      // guidance: warn the villager furthest from the hill first
      if (!g.done) { const q = s.v.filter(q => q.st === 'walk' || q.st === 'fish').sort((a, b) => a.x - b.x)[0]; if (q) { SK.glow(c, g, q.x, q.y - 18, 26, '#e8563a', { level: 2 }); SK.demo(g, c, 'tap', [q.x, q.y - 14]); } }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 1.0) return; const B = s._bot = s._bot || {}; if (B.last && g.t - B.last < 0.3) return;
      const q = s.v.filter(q => q.st === 'walk' || q.st === 'fish').sort((a, b) => a.x - b.x)[0]; if (!q) return; B.last = g.t; synth('down', q.x, q.y - 14); synth('up', q.x, q.y - 14);
    },
  });
})();
