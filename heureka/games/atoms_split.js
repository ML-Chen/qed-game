// SPLIT! (physics PHS-39) — a midnight lab: a big nucleus sits in the bowl of a balance scale, level with a brass weight.
// Flick the neutron into it. The neutron flies in a straight line (it has no charge, so nothing pulls it aside), the
// nucleus wobbles and splits in two, spare neutrons pop out into the bowl, a huge flash lights the room, and the bowl
// rises a touch: the pieces weigh a little less than the nucleus did. Miss, and the neutron bounces round the room while
// the beaver ducks behind the bench. Level 2 is fusion: flick a small nucleus into another; both are positive, so they
// push each other apart, and only a fast flick gets them close enough to join.
(() => {
  const PIV = [180, 214], BEAM = 92, STR = 70, WALL = { l: 6, r: 354, t: 124, b: 604 }, VMAX = 950;
  const KREP = 7.1e6, TILT = 0.045; // repulsion between two nuclei (level 2); beam tilt per unit of mass difference
  const sunflower = (n, R) => { const o = []; for (let i = 0; i < n; i++) { const r = R * Math.sqrt((i + 0.5) / n), a = i * 2.39996; o.push([Math.cos(a) * r, Math.sin(a) * r, i % 2 ? 'n' : 'p']); } return o.reverse(); };
  function cluster(c, x, y, balls, br, t, jig = 1) {
    balls.forEach(([dx, dy, k], i) => { const jx = Math.sin(t * 9 + i * 1.7) * 0.9 * jig, jy = Math.cos(t * 8 + i * 2.3) * 0.9 * jig; SK.ball(c, x + dx + jx, y + dy + jy, br, k === 'p' ? '#e8503a' : '#9ab8e0', { lw: 1.2 }); });
  }
  function ends(a) { return [[PIV[0] - BEAM * Math.cos(a), PIV[1] - BEAM * Math.sin(a)], [PIV[0] + BEAM * Math.cos(a), PIV[1] + BEAM * Math.sin(a)]]; }
  function bowlAt(s) { const [l] = ends(s.a); return [l[0], l[1] + STR]; } // the left bowl's rim centre
  function paintLab(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#0a0c2a'); bg.addColorStop(0.55, '#1c1e52'); bg.addColorStop(1, '#2c2460'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    o.strokeStyle = 'rgba(120,160,255,0.08)'; o.lineWidth = 1; for (let x = 0; x <= 360; x += 30) { o.beginPath(); o.moveTo(x, 0); o.lineTo(x, 640); o.stroke(); } for (let y = 0; y <= 640; y += 30) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); }
    const rnd = P.rng(7); for (let i = 0; i < 40; i++) { o.fillStyle = `rgba(200,220,255,${0.2 + rnd() * 0.4})`; o.beginPath(); o.arc(rnd() * 360, 120 + rnd() * 480, 0.6 + rnd() * 1.2, 0, 7); o.fill(); }
    // the floor and the scale's base and post
    o.fillStyle = '#16123a'; o.fillRect(0, 470, 360, 170); o.fillStyle = 'rgba(140,120,255,0.12)'; o.fillRect(0, 470, 360, 3);
    o.fillStyle = '#b8862a'; o.beginPath(); o.ellipse(PIV[0], 472, 62, 12, 0, 0, 7); o.fill(); o.fillStyle = '#e0b04a'; o.beginPath(); o.ellipse(PIV[0], 466, 56, 9, 0, 0, 7); o.fill();
    const pg = o.createLinearGradient(PIV[0] - 7, 0, PIV[0] + 7, 0); pg.addColorStop(0, '#a87a22'); pg.addColorStop(0.5, '#f2cc6a'); pg.addColorStop(1, '#a87a22'); o.fillStyle = pg; o.fillRect(PIV[0] - 7, PIV[1], 14, 252);
    // the dial behind the needle
    o.strokeStyle = 'rgba(255,230,160,0.55)'; o.lineWidth = 2; o.beginPath(); o.arc(PIV[0], PIV[1], 52, Math.PI / 2 - 0.5, Math.PI / 2 + 0.5); o.stroke();
    for (let k = -4; k <= 4; k++) { const a = Math.PI / 2 + k * 0.11, r0 = k ? 47 : 42; o.beginPath(); o.moveTo(PIV[0] + Math.cos(a) * r0, PIV[1] + Math.sin(a) * r0); o.lineTo(PIV[0] + Math.cos(a) * 56, PIV[1] + Math.sin(a) * 56); o.stroke(); }
    // the lab bench the beaver hides behind
    o.fillStyle = '#3a2a5a'; o.fillRect(0, 548, 120, 6);
  }
  function pan(c, x, y, bowl) {
    c.strokeStyle = '#e0b04a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y - STR); c.lineTo(x - 38, y); c.moveTo(x, y - STR); c.lineTo(x + 38, y); c.stroke();
    const gr = c.createLinearGradient(0, y, 0, y + 30); gr.addColorStop(0, '#f2cc6a'); gr.addColorStop(1, '#8a5a1a'); c.fillStyle = gr; c.strokeStyle = '#6a4210'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(x - 44, y); c.quadraticCurveTo(x, y + (bowl ? 44 : 18), x + 44, y); c.closePath(); c.fill(); c.stroke();
  }
  MG.add({
    id: 'atoms_split', stage: 'atoms', cmd: 'SPLIT!', time: 5, mood: 'night', winText: 'Boom!', failText: 'Missed!',
    card: { title: 'Splitting a nucleus', kind: 'Physics', ref: 'Nuclear fission and E = mc²',
      text: 'The middle of an atom is its nucleus, a tight ball of protons and neutrons. A neutron has no electric charge, so it flies straight in. A big nucleus such as uranium can wobble and split in two when a neutron hits it, and two or three spare neutrons fly out.\n\nWeigh all the pieces and they come to a tiny bit less than the nucleus did. That missing mass has turned into a huge amount of energy, the flash. Nuclear power stations run on this. Joining two small nuclei (fusion) also loses mass and powers the Sun.',
      note: 'When a big nucleus splits, a little of its mass turns into a lot of energy.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.fus = lv >= 2;
      s.start = lv === 0 ? [180, 540] : [292, 544];
      s.n = { x: s.start[0], y: s.start[1], vx: 0, vy: 0, r: s.fus ? 16 : 9, st: 'ready', alpha: 1 };
      s.big = s.fus ? sunflower(3, 9.5) : sunflower(30, 27); s.bigR = s.fus ? 19 : 36; s.br = s.fus ? 9 : 6.5;
      s.proj = s.fus ? sunflower(2, 7) : null;
      s.mL = s.fus ? 3 : 30; s.mR = s.fus ? 5 : 30; s.a = (s.mR - s.mL) * TILT; s.va = 0;
      s.hit = 0; s.flash = -9; s.trail = []; s.shots = 0; s.spare = []; s.duck = -9;
    },
    down(g, x, y) { const s = g.s, n = s.n; SK.touched(g); if (n.st !== 'ready' || s.hit) return; if (SK.dist(x, y, n.x, n.y) < 64) SK.dragStart(g, null, x, y); },
    move(g, x, y) { SK.dragMove(g, x, y); },
    up(g) {
      const s = g.s, n = s.n, d = SK.dragEnd(g); if (!d || n.st !== 'ready' || s.hit) return;
      let { vx, vy } = d; const sp = Math.hypot(vx, vy); if (sp < 140) return; if (sp > VMAX) { vx *= VMAX / sp; vy *= VMAX / sp; }
      n.vx = vx; n.vy = vy; n.st = 'fly'; n.flyT = g.t; s.shots++; s.trail = []; g.sfx('swoosh');
    },
    update(g, dt) {
      const s = g.s, n = s.n;
      // the scale's beam swings toward the balance point of the two pans
      const tgt = SK.clamp((s.mR - s.mL) * TILT, -0.16, 0.16); s.va += (-(s.a - tgt) * 60 - s.va * 5) * dt; s.a += s.va * dt;
      const [bx, by] = bowlAt(s), cx = bx, cy = by + 2 - s.bigR * 0.55;
      if (n.st === 'fly') {
        for (let i = 0; i < 4; i++) {
          const h = dt / 4;
          if (s.fus) { const dx = n.x - cx, dy = n.y - cy, d2 = Math.max(200, dx * dx + dy * dy), d = Math.sqrt(d2), f = KREP / d2; n.vx += f * dx / d * h; n.vy += f * dy / d * h; }
          n.x += n.vx * h; n.y += n.vy * h;
          if (n.x - n.r < WALL.l) { n.x = WALL.l + n.r; n.vx = Math.abs(n.vx) * 0.92; g.sfx('click'); }
          if (n.x + n.r > WALL.r) { n.x = WALL.r - n.r; n.vx = -Math.abs(n.vx) * 0.92; g.sfx('click'); }
          if (n.y - n.r < WALL.t) { n.y = WALL.t + n.r; n.vy = Math.abs(n.vy) * 0.92; g.sfx('click'); }
          if (n.y + n.r > WALL.b) { n.y = WALL.b - n.r; n.vy = -Math.abs(n.vy) * 0.92; g.sfx('click'); }
          if (SK.dist(n.x, n.y, cx, cy) < s.bigR + n.r - (s.fus ? 4 : 0)) { // it hits: split (or, at level 2, fuse)
            n.st = 'gone'; s.hit = g.t; g.sfx('magic'); break;
          }
        }
        s.trail.push([n.x, n.y]); if (s.trail.length > 14) s.trail.shift();
        if (SK.dist(n.x, n.y, 60, 560) < 110) s.duck = g.t;
        if (n.st === 'fly' && g.t - n.flyT > 1.8) { n.alpha = Math.max(0, 1 - (g.t - n.flyT - 1.8) * 3); if (n.alpha <= 0) { n.st = 'ready'; n.x = s.start[0]; n.y = s.start[1]; n.vx = n.vy = 0; n.alpha = 1; s.trail = []; } }
      }
      if (s.hit && !s.boom && g.t - s.hit > 0.3) { // the flash, the spare neutrons, and the lighter bowl
        s.boom = true; s.flash = g.t; g.sfx('thunder'); g.sfx('sparkle'); g.shake(8, 0.35);
        s.mL = s.fus ? 5 - 1.4 : 30 - 2.2; // exaggerated, so the bowl visibly rises
        const k = s.fus ? 1 : 3; for (let i = 0; i < k; i++) s.spare.push({ x: (i - (k - 1) / 2) * 8, y: -20, vx: (i - (k - 1) / 2) * 60 + (g.rand() - 0.5) * 30, vy: -260 - g.rand() * 120, r: s.br });
        g.burst(cx, cy, ['#fff6ea', '#ffe27a', '#ff9a4a', '#9ad8ff'], 30, 320);
      }
      for (const p of s.spare) { const hit = SK.step(p, dt, { gy: 900, floor: 22, left: -32, right: 32 }); p.e = 0.45; p.mu = 200; if (hit === 'floor') g.sfx('click'); }
      if (s.boom && !g.done && g.t - s.flash > 0.7) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, n = s.n, t = g.t;
      c.drawImage(g.bake('split_lab', paintLab), 0, 0, 360, 640);
      // the beam, the needle and the two pans
      const [l, r] = ends(s.a), [bx, by] = bowlAt(s);
      c.strokeStyle = '#ffe27a'; c.lineWidth = 3; c.beginPath(); c.moveTo(PIV[0], PIV[1]); c.lineTo(PIV[0] - Math.sin(s.a) * 50, PIV[1] + Math.cos(s.a) * 50); c.stroke();
      c.strokeStyle = '#6a4210'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(l[0], l[1]); c.lineTo(r[0], r[1]); c.stroke(); c.strokeStyle = '#f2cc6a'; c.lineWidth = 5; c.stroke();
      SK.ball(c, PIV[0], PIV[1], 8, '#e0b04a');
      // the brass weight on the right pan
      pan(c, r[0], r[1] + STR, false);
      const ww = s.fus ? 30 : 46, wh = s.fus ? 22 : 34; c.fillStyle = '#c89a3a'; c.strokeStyle = '#6a4210'; c.lineWidth = 2; c.beginPath(); c.roundRect(r[0] - ww / 2, r[1] + STR - wh, ww, wh, 6); c.fill(); c.stroke(); c.fillStyle = '#f2d27a'; c.fillRect(r[0] - ww / 2 + 4, r[1] + STR - wh + 4, ww - 8, 4);
      c.fillStyle = '#8a5a1a'; c.beginPath(); c.roundRect(r[0] - 8, r[1] + STR - wh - 8, 16, 9, 4); c.fill();
      // the nucleus (or, after the hit, its pieces) in the left bowl
      pan(c, bx, by, true);
      const cx = bx, cy = by + 2 - s.bigR * 0.55;
      if (!s.hit) { cluster(c, cx, cy, s.big, s.br, t); SK.glow(c, g, cx, cy, s.bigR + 12); }
      else {
        const k = SK.clamp((t - s.hit) / 0.3, 0, 1), sep = SK.easeOut(SK.clamp((t - s.hit - 0.2) / 0.3, 0, 1));
        if (s.fus) { // two small nuclei join into one helium nucleus
          const he = s.he || (s.he = sunflower(4, 10.5)); cluster(c, cx, cy + 2, he, s.br, t, 1 + (1 - k) * 4);
        } else {
          if (!s.frag) { let spare = 3; const B = s.big.filter(b => b[0] >= 0).filter(b => !(b[2] === 'n' && spare-- > 0)); s.frag = [s.big.filter(b => b[0] < 0).map(([x, y, q]) => [x + 10, y, q]), B.map(([x, y, q]) => [x - 10, y, q])]; } const [A, B] = s.frag;
          const wob = Math.sin((t - s.hit) * 40) * (1 - k) * 4;
          c.save(); c.translate(cx, cy); c.scale(1 + 0.25 * k * (1 - sep) + wob * 0.02, 1 - 0.12 * k * (1 - sep));
          cluster(c, -sep * 20, sep * 8, A, s.br, t, 1.5);
          cluster(c, sep * 20, sep * 8, B, s.br, t, 1.5);
          c.restore();
        }
        for (const p of s.spare) SK.ball(c, cx + p.x, cy + p.y + (s.fus ? 6 : 14), p.r, '#9ab8e0', { lw: 1.2 });
      }
      // the neutron (or, at level 2, the small nucleus) and its launch pad
      if (n.st !== 'gone') {
        c.save(); c.globalAlpha = 0.5 + 0.3 * Math.sin(t * 4); c.strokeStyle = '#9ad8ff'; c.lineWidth = 2; c.beginPath(); c.ellipse(s.start[0], s.start[1] + 14, 26, 8, 0, 0, 7); c.stroke(); c.restore();
        for (let i = 1; i < s.trail.length; i++) { const [x0, y0] = s.trail[i - 1], [x1, y1] = s.trail[i]; c.strokeStyle = `rgba(160,210,255,${0.6 * i / s.trail.length})`; c.lineWidth = 2 + 5 * i / s.trail.length; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
        c.save(); c.globalAlpha = n.alpha;
        if (s.fus) cluster(c, n.x, n.y, s.proj, s.br, t); else SK.ball(c, n.x, n.y, n.r, '#9ab8e0', { lw: 1.5 });
        c.restore();
        if (n.st === 'ready') SK.glow(c, g, n.x, n.y, 24, '#9ad8ff');
        const d = g.s._drag; if (d && n.st === 'ready') { const q = d.pts[d.pts.length - 1]; c.save(); c.strokeStyle = 'rgba(160,210,255,0.4)'; c.lineWidth = 3; c.setLineDash([5, 6]); c.beginPath(); c.moveTo(n.x, n.y); c.lineTo(q.x, q.y); c.stroke(); c.restore(); }
      }
      // the beaver peeks over the bench, and ducks when a neutron comes flying its way
      const ducking = t - s.duck < 0.9, dy = ducking ? 52 : 0;
      SK.animal(c, 'beaver', 60, 556 + dy, 0.78, { t, pose: g.result === 'win' ? 'cheer' : 'idle', expr: ducking ? 'wow' : 'happy' });
      const bg = c.createLinearGradient(0, 552, 0, 640); bg.addColorStop(0, '#5a3a7a'); bg.addColorStop(1, '#2a1a4a'); c.fillStyle = bg; c.fillRect(0, 552, 120, 88); c.fillStyle = '#7a5a9a'; c.fillRect(0, 552, 120, 5);
      c.fillStyle = 'rgba(160,220,255,0.6)'; c.beginPath(); c.roundRect(14, 572, 30, 40, 5); c.fill(); c.fillStyle = '#2a1a4a'; c.fillRect(20, 578, 18, 10);
      // the owl hosts
      const won = g.result === 'win', lost = g.result === 'fail';
      SK.animal(c, 'owl', 318, 616, 0.72, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'wow' : lost ? 'sad' : 'happy', facing: -1 });
      // the flash: the missing mass, turned into energy
      const fk = (t - s.flash) / 0.9; if (fk >= 0 && fk < 1) {
        c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = (1 - fk) * 0.9; const fg = c.createRadialGradient(cx, cy, 5, cx, cy, 420); fg.addColorStop(0, '#ffffff'); fg.addColorStop(0.25, s.fus ? '#ffd27a' : '#c8e8ff'); fg.addColorStop(1, 'rgba(60,40,120,0)'); c.fillStyle = fg; c.fillRect(0, 0, 360, 640);
        c.strokeStyle = '#fff6ea'; c.lineWidth = 3; for (let i = 0; i < 14; i++) { const a = i * Math.PI / 7 + fk; c.beginPath(); c.moveTo(cx + Math.cos(a) * (30 + fk * 60), cy + Math.sin(a) * (30 + fk * 60)); c.lineTo(cx + Math.cos(a) * (80 + fk * 240), cy + Math.sin(a) * (80 + fk * 240)); c.stroke(); }
        c.restore();
      }
      SK.demo(g, c, 'swipe', s.start, [s.start[0] + (cx - s.start[0]) * 0.35, s.start[1] + (cy - s.start[1]) * 0.35]);
    },
    // the bot: flick straight at the nucleus (fast enough at level 2 to beat the push between two nuclei)
    auto(g, dt, synth) {
      const s = g.s, n = s.n; if (s.shots || g.done || n.st !== 'ready') return;
      const [bx, by] = bowlAt(s), tx = bx, ty = by + 2 - s.bigR * 0.55, dx = tx - n.x, dy = ty - n.y, L = Math.hypot(dx, dy), v = s.fus ? 920 : 650, dur = 0.16;
      SK.bot.drag(g, synth, 'flick', 1.2, [n.x, n.y], [n.x + dx / L * v * dur, n.y + dy / L * v * dur], dur);
    },
  });
})();
