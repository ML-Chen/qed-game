// DRAG THE MAMMALS INTO BURROWS! (earth EE HE-12, BURROW!) — 66 million years ago: an asteroid streaks across a
// pink Cretaceous sky toward the Earth. Little furry mammals scurry about between the ferns; a giant dinosaur grazes
// beside them. Drag each mammal into a burrow (the ground is cut away, so you see the tunnel and the snug chamber below).
// Once all are underground, the asteroid strikes: a flash, a firestorm and dark soot sweep the land, and the burrowers
// peek out safe. Drag the dinosaur to a burrow and it doesn't fit: its head goes in and its tail sticks out, wiggling.
// The asteroid's approach follows the fuse and waits, short of impact, while the timer is off.
// Level 0: three mammals that scurry slowly; level 1: three, quicker; level 2: four, quicker still.
(() => {
  const GROUND = 424, DINO = { x: 300, y: GROUND }, IMPACT = [60, GROUND - 70];
  const BUR = [[60, 140, 214], [46, 122, 200], [74, 150, 224], [52, 168, 226]], BUR4 = [[40, 100, 162, 224], [48, 108, 170, 228], [36, 98, 158, 218], [44, 106, 166, 226]];
  function paintBg(o) {
    const sky = o.createLinearGradient(0, 0, 0, GROUND); sky.addColorStop(0, '#5a3a7a'); sky.addColorStop(0.45, '#d8708a'); sky.addColorStop(1, '#ffc890'); o.fillStyle = sky; o.fillRect(0, 0, 360, GROUND);
    P.cloud(o, 90, 200, 0.6, '#ffd8c0', '#e8a0a8'); P.cloud(o, 280, 250, 0.45, '#ffd8c0', '#e8a0a8');
    // a smoking volcano and far hills
    o.fillStyle = '#8a4a6a'; o.beginPath(); o.moveTo(150, GROUND - 40); o.lineTo(230, 300); o.lineTo(256, 300); o.lineTo(340, GROUND - 40); o.closePath(); o.fill();
    o.fillStyle = 'rgba(90,60,80,0.35)'; for (let i = 0; i < 4; i++) { o.beginPath(); o.arc(244 + i * 8, 284 - i * 22, 12 + i * 5, 0, 7); o.fill(); }
    P.hills(o, 360, GROUND - 10, 40, '#7a9a5a', '#5a7a40', { seed: 7 });
    for (const [x, s] of [[20, 0.8], [118, 0.6], [180, 0.7]]) P.palm(o, x, GROUND - 6, s, 0.1, 0, '#3a7a4a');
    // the ground, cut away to show the soil
    const so = o.createLinearGradient(0, GROUND, 0, 640); so.addColorStop(0, '#8a5a3a'); so.addColorStop(1, '#4a2a1c'); o.fillStyle = so; o.fillRect(0, GROUND, 360, 640 - GROUND);
    o.fillStyle = '#6a9a4a'; o.fillRect(0, GROUND - 4, 360, 10); o.fillStyle = '#8aba5a'; o.fillRect(0, GROUND - 6, 360, 4);
    const r = P.rng(5); for (let i = 0; i < 60; i++) { o.fillStyle = `rgba(${r() < 0.5 ? '40,20,10' : '200,150,100'},${0.15 + r() * 0.2})`; o.beginPath(); o.ellipse(r() * 360, GROUND + 14 + r() * 160, 2 + r() * 5, 1.5 + r() * 3, r() * 3, 0, 7); o.fill(); }
    P.grassTufts(o, 360, GROUND - 8, GROUND, 16, '#4a8a3a', 3);
  }
  function burrow(c, bx, t, full) { // the hole, the tunnel and the chamber below
    c.fillStyle = '#2a1408'; c.beginPath(); c.ellipse(bx, GROUND, 22, 8, 0, 0, 7); c.fill();
    c.strokeStyle = '#3a1c0c'; c.lineWidth = 20; c.lineCap = 'round'; c.beginPath(); c.moveTo(bx, GROUND + 4); c.quadraticCurveTo(bx - 6, GROUND + 44, bx + 14, GROUND + 76); c.stroke();
    c.fillStyle = '#3a1c0c'; c.beginPath(); c.ellipse(bx + 18, GROUND + 84, 30, 19, 0, 0, 7); c.fill();
    c.fillStyle = 'rgba(200,170,110,0.35)'; c.beginPath(); c.ellipse(bx + 18, GROUND + 98, 24, 5, 0, 0, 7); c.fill(); // a bed of dry grass
  }
  function shrew(c, x, y, s, f, t, o = {}) { // a little furry mammal, feet at (x, y), facing f
    c.save(); c.translate(x, y); c.scale(s * f, s); const run = o.run ? Math.sin(t * 30) : 0, bob = o.run ? Math.abs(run) * 2 : Math.sin(t * 3) * 0.6;
    c.strokeStyle = '#8a5a4a'; c.lineWidth = 2; c.beginPath(); c.moveTo(-14, -7); c.quadraticCurveTo(-26, -10, -30, -2 + Math.sin(t * 5) * 2); c.stroke();
    c.fillStyle = '#5a3a2a'; for (const [lx, ph] of [[-8, 0], [8, Math.PI]]) { c.beginPath(); c.ellipse(lx + (o.run ? Math.sin(t * 30 + ph) * 3 : 0), -2, 4, 2.5, 0, 0, 7); c.fill(); }
    const soot = o.soot ? 0.6 : 0; c.fillStyle = P.mix('#a87850', '#3a3036', soot); c.strokeStyle = '#4a2a1a'; c.lineWidth = 1.6; c.beginPath(); c.ellipse(0, -11 - bob, 16, 11, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = P.mix('#e8c8a0', '#5a5056', soot); c.beginPath(); c.ellipse(3, -7 - bob, 9, 5, 0, 0, 7); c.fill();
    c.fillStyle = P.mix('#b88858', '#3a3036', soot); c.beginPath(); c.ellipse(15, -15 - bob, 9, 7.5, 0.2, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#f0a0a8'; c.beginPath(); c.moveTo(21, -17 - bob); c.quadraticCurveTo(31, -14 - bob, 28, -11 - bob); c.lineTo(21, -12 - bob); c.closePath(); c.fill(); c.fillStyle = '#3a1a20'; c.beginPath(); c.arc(29, -12.5 - bob, 1.6, 0, 7); c.fill();
    c.fillStyle = '#c89878'; c.beginPath(); c.arc(11, -22 - bob, 4.5, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#f0b8b0'; c.beginPath(); c.arc(11, -22 - bob, 2.2, 0, 7); c.fill();
    c.fillStyle = '#1a0a10'; c.beginPath(); c.arc(17, -17 - bob, o.wow ? 2.6 : 2, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(16.4, -17.8 - bob, 0.8, 0, 7); c.fill();
    c.restore();
  }
  function dino(c, x, y, t, o = {}) { // a big plant-eating dinosaur (a sauropod), feet at (x, y)
    c.save(); c.translate(x, y); const sw = Math.sin(t * 1.2) * 0.05, col = o.dark ? '#3a4a4a' : '#6aa86a', dk = o.dark ? '#2a3434' : '#3a6a40';
    c.fillStyle = col; c.strokeStyle = dk; c.lineWidth = 3;
    c.beginPath(); c.moveTo(40, -60); c.quadraticCurveTo(110, -50, 130, -20); c.quadraticCurveTo(90, -40, 40, -34); c.closePath(); c.fill(); c.stroke(); // tail
    for (const lx of [-34, -12, 18, 38]) { c.fillStyle = lx === -12 || lx === 38 ? P.shade(col, -0.15) : col; c.beginPath(); c.roundRect(lx - 9, -44, 18, 44, 6); c.fill(); c.stroke(); }
    c.fillStyle = col; c.beginPath(); c.ellipse(4, -58, 60, 34, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.15)'; c.beginPath(); c.ellipse(-6, -72, 36, 12, -0.1, 0, 7); c.fill();
    c.save(); c.translate(-40, -72); c.rotate(sw); c.fillStyle = col; c.beginPath(); c.moveTo(-6, 12); c.quadraticCurveTo(-30, -50, -70, -110); c.lineTo(-56, -116); c.quadraticCurveTo(-10, -60, 16, 4); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(-70, -118, 20, 12, -0.2, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#1a2a1a'; c.beginPath(); c.arc(-74, -122, 3, 0, 7); c.fill(); c.strokeStyle = dk; c.lineWidth = 2; c.beginPath(); c.arc(-84, -114, 6, 0.2, 1.4); c.stroke();
    c.restore(); c.restore();
  }
  function rock(c, x, y, k, t) { // the asteroid: a glowing rock with a fiery trail behind it (toward the upper right)
    const r = 12 + 24 * k; c.save(); const tl = c.createLinearGradient(x, y, x + r * 7, y - r * 4); tl.addColorStop(0, 'rgba(255,230,150,0.9)'); tl.addColorStop(0.4, 'rgba(255,140,60,0.5)'); tl.addColorStop(1, 'rgba(255,100,60,0)');
    c.fillStyle = tl; c.beginPath(); c.moveTo(x - r * 0.6, y - r * 0.8); c.lineTo(x + r * 7, y - r * 4); c.lineTo(x + r * 0.8, y + r * 0.6); c.closePath(); c.fill();
    const gl = c.createRadialGradient(x, y, r * 0.5, x, y, r * 2.2); gl.addColorStop(0, 'rgba(255,200,120,0.7)'); gl.addColorStop(1, 'rgba(255,120,60,0)'); c.fillStyle = gl; c.beginPath(); c.arc(x, y, r * 2.2, 0, 7); c.fill();
    SK.ball(c, x, y, r, '#8a6a5a', { edge: '#ff9a40', lw: 3 }); c.fillStyle = 'rgba(60,30,30,0.4)'; c.beginPath(); c.arc(x - r * 0.2, y + r * 0.2, r * 0.25, 0, 7); c.arc(x + r * 0.35, y - r * 0.1, r * 0.15, 0, 7); c.fill(); c.restore();
  }
  const rockAt = k => [SK.lerp(350, IMPACT[0], k), SK.lerp(170, IMPACT[1], k * k * 0.3 + k * 0.7)];
  const freeBurrow = (s, x) => { let best = -1, bd = 1e9; s.bur.forEach((b, i) => { if (s.used[i]) return; const d = Math.abs(b - x); if (d < bd) { bd = d; best = i; } }); return best; };
  MG.add({
    id: 'earth_burrow', stage: 'earth', cmd: 'DRAG THE MAMMALS INTO BURROWS!', time: 6, mood: 'storm', winText: 'Safe underground!', failText: 'Still outside!',
    card: { title: 'The small survived', kind: 'Earth science', ref: 'The end of the dinosaurs',
      text: 'About 66 million years ago, an asteroid about 10 kilometres wide hit the Earth near what is now Mexico. The blast started huge fires, and dust and soot blocked out the Sun for months. Plants stopped growing, so big animals that needed lots of food starved.\n\nThe giant dinosaurs died out. Small animals that could shelter in burrows and live on little food, such as early mammals, had a better chance. Some small birds survived too, and birds are the living relatives of dinosaurs.\n\nWith the giant dinosaurs gone, mammals spread into many new kinds, which in time led to us.',
      note: 'When an asteroid hit 66 million years ago, the giant dinosaurs died out, but small burrowing mammals survived and later spread.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level), v = SK.variant(g, 4), n = L === 2 ? 4 : 3;
      s.bur = (n === 4 ? BUR4 : BUR)[v].slice(); s.used = s.bur.map(() => false); s.sp = [45, 65, 80][L];
      const xs = SK.shuffled(g, [26, 94, 180, 232, 128, 60]).slice(0, n);
      s.m = xs.map((x, i) => ({ x, y: GROUND - 2, f: g.rand() < 0.5 ? 1 : -1, st: 'sit', tt: 0.8 + g.rand() * 1.2, ph: i * 1.3, hid: -1, vy: 0 }));
      s.drag = null; s.hitT = 0; s.stuck = null; s.dinoOff = [0, 0];
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return;
      const m = SK.pick(s.m.filter(m => m.hid < 0), x, y + 16, 44); if (m) { s.drag = { m, ox: m.x - x, oy: m.y - y }; m.st = 'held'; g.sfx('tweet', { pitch: 1.6, vol: 0.4 }); return; }
      if (!s.stuck && x > DINO.x - 120 && x < 360 && y > DINO.y - 210 && y < DINO.y) { s.drag = { dino: true, x0: x, y0: y }; g.sfx('stretch', { vol: 0.4 }); }
    },
    move(g, x, y) { const s = g.s, d = s.drag; if (!d) return; if (d.m) { d.m.x = SK.clamp(x + d.ox, 14, 346); d.m.y = Math.min(GROUND - 2, y + d.oy); } else s.dinoOff = [(x - d.x0) * 0.25, Math.min(0, (y - d.y0) * 0.1)]; },
    up(g, x, y) {
      const s = g.s, d = s.drag; if (!d) return; s.drag = null;
      if (d.dino) { s.dinoOff = [0, 0]; const bi = freeBurrow(s, x); if (bi >= 0 && Math.abs(s.bur[bi] - x) < 60 && Math.abs(y - GROUND) < 90) { s.stuck = { bi, t: g.t }; g.sfx('thud'); g.sfx('laugh'); g.shake(3, 0.25); } return; }
      const m = d.m, bi = freeBurrow(s, m.x);
      if (!g.done && bi >= 0 && Math.abs(s.bur[bi] - m.x) < 50 && m.y > GROUND - 110) { s.used[bi] = true; m.hid = bi; m.hidT = g.t; m.st = 'in'; g.sfx('swoosh'); g.sfx('pop');
        if (s.m.every(q => q.hid >= 0)) { s.hitT = g.t; s.k0 = 0.08 + 0.72 * SK.clamp(g.fuse() / g.dur, 0, 1); g.win(); } }
      else { m.st = 'fall'; m.vy = 0; }
    },
    update(g, dt) {
      const s = g.s;
      for (const m of s.m) {
        if (m.st === 'fall') { m.vy += 1400 * dt; m.y += m.vy * dt; if (m.y >= GROUND - 2) { m.y = GROUND - 2; m.st = 'sit'; m.tt = 0.6 + g.rand() * 0.6; } continue; }
        if (m.st === 'sit' || m.st === 'run') { m.tt -= dt; if (m.tt <= 0) { if (m.st === 'sit') { m.st = 'run'; m.tt = 0.35 + g.rand() * 0.5; m.f = g.rand() < 0.5 ? 1 : -1; } else { m.st = 'sit'; m.tt = 1.1 + g.rand() * 1.2; } }
          if (m.st === 'run' && !g.done) { m.x += m.f * s.sp * dt; if (m.x < 20) { m.x = 20; m.f = 1; } if (m.x > 232) { m.x = 232; m.f = -1; } } }
      }
      if (s.stuck && g.t - s.stuck.t > 1.4) s.stuck = null;
      if (!s.hitT && g.done) { s.hitT = g.t; s.k0 = 0.8; } // time ran out: the asteroid strikes anyway
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win';
      c.drawImage(g.bake('burrow_bg', paintBg), 0, 0, 360, 640);
      // the asteroid: its approach follows the fuse, and it waits short of impact while the player still has time
      const fk = g.dur ? SK.clamp(g.fuse() / g.dur, 0, 1) : 0, k0 = 0.08 + 0.72 * fk, hk = s.hitT ? SK.clamp((t - s.hitT) / 0.4, 0, 1) : 0;
      const k = s.hitT ? SK.lerp(s.k0 ?? k0, 1, hk) : k0;
      const [rx, ry] = rockAt(k); if (hk < 1) rock(c, rx, ry, k, t);
      s.bur.forEach((b, i) => burrow(c, b, t, s.used[i]));
      // the dinosaur (with its head stuck in a burrow and its tail sticking out, if you tried to hide it)
      const after = s.hitT ? SK.clamp((t - s.hitT - 0.4) / 0.6, 0, 1) : 0;
      if (s.stuck) { const bx = s.bur[s.stuck.bi]; c.save(); c.translate(bx + 70, GROUND + 6); c.rotate(-0.75); c.scale(0.8, 0.8); dino(c, 0, 0, t * 6); c.restore(); }
      else dino(c, DINO.x + s.dinoOff[0], DINO.y + s.dinoOff[1], t, { dark: after > 0.5 });
      // the mammals: hidden ones curl up in their chambers, the rest scurry
      for (const m of s.m) {
        if (m.hid >= 0) { const b = s.bur[m.hid], dk = SK.clamp((t - m.hidT) / 0.3, 0, 1); const x = SK.lerp(b, b + 16, dk), y = SK.lerp(GROUND - 2, GROUND + 98, dk); shrew(c, x, y, 1.05, 1, t, {}); continue; }
        shrew(c, m.x, m.y, 1.3, m.f, t + m.ph, { run: m.st === 'run' || m.st === 'held', soot: after > 0.6, wow: m.st === 'held' || after > 0 });
      }
      // the strike: a flash, then fire and soot sweep across
      if (s.hitT && hk >= 1) { const q = (t - s.hitT - 0.4); c.save(); c.globalAlpha = SK.clamp(1 - q * 2.5, 0, 1); c.fillStyle = '#fff6d0'; c.fillRect(0, 0, 360, 640); c.restore();
        const sweep = SK.clamp(q * 1.6, 0, 1), gr = c.createLinearGradient(0, 0, 360 * sweep + 120, 0); gr.addColorStop(0, 'rgba(60,20,30,0.72)'); gr.addColorStop(Math.max(0.01, sweep * 0.8), 'rgba(160,50,30,0.55)'); gr.addColorStop(1, 'rgba(255,120,40,0)'); c.fillStyle = gr; c.fillRect(0, 0, 360, GROUND + 4);
        for (let i = 0; i < 8; i++) { const fx = ((i * 53) % 330) + 10, fh = 20 + 16 * Math.sin(t * 9 + i); if (fx < 360 * sweep) { c.fillStyle = 'rgba(255,150,50,0.7)'; c.beginPath(); c.moveTo(fx - 10, GROUND - 2); c.quadraticCurveTo(fx, GROUND - fh * 2, fx + 10, GROUND - 2); c.fill(); } } }
      // hidden ones peek out once it's over
      if (won && after >= 1) for (const m of s.m) { const b = s.bur[m.hid]; c.fillStyle = '#a87850'; c.beginPath(); c.arc(b, GROUND - 4, 8, Math.PI, 0); c.fill(); c.fillStyle = '#1a0a10'; c.beginPath(); c.arc(b - 3, GROUND - 7, 1.6, 0, 7); c.arc(b + 3, GROUND - 7, 1.6, 0, 7); c.fill(); }
      // names
      if (!s.hitT) { SK.tag(c, 'Asteroid', SK.clamp(rx + 40, 60, 300), SK.clamp(ry + 46, 150, 400), 18); SK.tag(c, 'Dinosaur', DINO.x + 8, DINO.y - 120, 18); SK.tag(c, 'Burrow', s.bur[s.bur.length - 1] + 20, GROUND + 140, 18); }
      const left = s.m.filter(m => m.hid < 0).length; if (!won) SK.tag(c, (s.m.length - left) + ' / ' + s.m.length + ' safe', 76, 172, 18);
      SK.animal(c, 'duck', 330, 610, 0.6, { t, pose: won ? 'cheer' : g.result === 'fail' ? 'sad' : 'idle', expr: won ? 'laugh' : g.result === 'fail' ? 'wow' : 'think', facing: -1 });
      // guidance: drag the nearest mammal into the nearest free burrow
      if (!g.done && !s.drag) { let best = null, bd = 1e9; for (const m of s.m) { if (m.hid >= 0 || m.st === 'fall') continue; const bi = freeBurrow(s, m.x), d = Math.abs(s.bur[bi] - m.x); if (d < bd) { bd = d; best = [m, bi]; } }
        if (best) { const [m, bi] = best, bx = s.bur[bi]; SK.tag(c, 'Mammal', m.x, m.y - 62, 18); SK.grab(c, g, m.x, m.y - 16, 26); SK.target(c, g, bx, GROUND - 4, 24); SK.arrow(c, g, m.x, m.y - 16, bx, GROUND - 10, { from: 30, to: 30 }); SK.demo(g, c, 'drag', [m.x, m.y - 16], [bx, GROUND - 6], { arc: 40 }); } }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done) return; const B = s._bot = s._bot || {}; if (B.busy) { if (SK.bot.drag(g, synth, B.key, B.t0, B.a, B.b, 0.4)) B.busy = 0; return; }
      if (g.t < (B.next ?? 1.0)) return; const m = s.m.find(m => m.hid < 0 && m.st !== 'fall'); if (!m) return; const bi = freeBurrow(s, m.x);
      B.key = 'm' + s.m.indexOf(m) + '_' + Math.round(g.t * 10); B.t0 = g.t; B.a = [m.x, m.y - 16]; B.b = [s.bur[bi], GROUND - 6]; B.busy = 1; B.next = g.t + 0.65; SK.bot.drag(g, synth, B.key, B.t0, B.a, B.b, 0.4);
    },
  });
})();
