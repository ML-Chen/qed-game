// BEAT! (chem_bio AN-12) — a rabbit naps in a meadow; a zoom bubble shows its heart. A beat ring closes on the heart at
// the pace the body needs. Tap the heart on the beat: it squeezes, a pulse of red blood runs down to the rabbit's legs
// and tops up their Oxygen gauge, and the heart swells as it refills. Asleep, a slow beat is plenty. After a few beats
// a fox wakes the rabbit and it sprints for its burrow: the running legs use oxygen much faster, so the ring speeds up
// and so must you. Tap too slowly and the gauge runs dry: the rabbit flags and sits down, puffing, and the fox gets a
// cuddle. Tapping again before the heart has refilled squeezes out only a dribble.
// Level 0: a short dash; level 1: longer; level 2: longer, with a hill near the end where the beat must be faster still.
(() => {
  const HC = { x: 180, y: 268 }, BUB = 112, PATH = 566, REFILL = 0.26, PULSE = 0.17, TRAVEL = 0.36;
  const LV = [{ dist: 200, run: 0.36, hill: null }, { dist: 236, run: 0.4, hill: null }, { dist: 236, run: 0.4, hill: [190, 240], up: 0.5 }];
  function paintBg(o, lv) {
    P.sky(o, 360, 640, ['#ffb0a0', '#ffd8b8', '#fff4e0']);
    P.cloud(o, 60, 140, 0.6); P.cloud(o, 300, 170, 0.5);
    P.hills(o, 360, 470, 60, '#c8e08a', '#90b860', { seed: 9 });
    for (const [x, sc] of [[24, 0.7], [338, 0.6]]) P.tree(o, x, 500, sc);
    const gr = o.createLinearGradient(0, 500, 0, 640); gr.addColorStop(0, '#a8d870'); gr.addColorStop(1, '#6a9a48'); o.fillStyle = gr; o.fillRect(0, 500, 360, 140);
    // the path, with a little hill at level 2
    o.fillStyle = '#e8c890'; o.beginPath(); o.moveTo(0, PATH - 6); if (LV[lv].hill) { const [a, b] = LV[lv].hill; o.lineTo(a + 6, PATH - 6); o.quadraticCurveTo((a + b) / 2 + 6, PATH - 40, b + 16, PATH - 6); } o.lineTo(360, PATH - 6); o.lineTo(360, PATH + 12); o.lineTo(0, PATH + 12); o.closePath(); o.fill();
    P.grassTufts(o, 360, PATH + 16, 630, 24, '#4a8a30', 2); P.flowers(o, 360, PATH + 20, 626, 16, undefined, 3);
  }
  function hillY(L, x) { if (!L.hill) return 0; const [a, b] = L.hill; if (x < a + 6 || x > b + 16) return 0; const k = (x - a - 6) / (b + 10 - a); return 34 * 4 * k * (1 - k); }
  function burrow(c, x, y) { c.fillStyle = '#9a7a4a'; c.beginPath(); c.ellipse(x, y, 34, 22, 0, Math.PI, 0); c.fill(); c.fillStyle = '#2a1a10'; c.beginPath(); c.ellipse(x, y - 2, 18, 14, 0, Math.PI, 0); c.fill(); c.fillStyle = '#6a9a3a'; for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(x - 28 + i * 14, y - 18 - Math.sin(i) * 4, 3, 7, (i - 2) * 0.3, 0, 7); c.fill(); } }
  function heartShape(c, s) {
    c.beginPath(); c.moveTo(0, 40 * s); c.bezierCurveTo(-62 * s, 4 * s, -54 * s, -46 * s, -16 * s, -40 * s); c.bezierCurveTo(-4 * s, -38 * s, 0, -28 * s, 0, -22 * s);
    c.bezierCurveTo(4 * s, -36 * s, 18 * s, -44 * s, 30 * s, -40 * s); c.bezierCurveTo(64 * s, -30 * s, 56 * s, 12 * s, 0, 40 * s); c.closePath();
  }
  function heart(c, x, y, sq, t, ready) {
    c.save(); c.translate(x, y);
    // the big vessels on top: the aorta (red, carries blood out) and the vena cava (blue, brings it back)
    c.lineCap = 'round'; c.strokeStyle = '#3a8ae0'; c.lineWidth = 16; c.beginPath(); c.moveTo(-26, -20); c.lineTo(-30, -64); c.stroke();
    c.strokeStyle = '#d8303a'; c.lineWidth = 18; c.beginPath(); c.moveTo(6, -24); c.quadraticCurveTo(4, -74, 40, -70); c.quadraticCurveTo(64, -66, 66, -30); c.stroke();
    c.strokeStyle = '#ff7a7a'; c.lineWidth = 5; c.beginPath(); c.moveTo(4, -40); c.quadraticCurveTo(6, -66, 38, -64); c.stroke();
    const s = 1.25 * (1 - 0.16 * sq);
    if (ready) { c.save(); c.globalAlpha = 0.35 + 0.25 * Math.sin(t * 8); c.fillStyle = '#ffd0d0'; heartShape(c, s * 1.12); c.fill(); c.restore(); }
    const gr = c.createRadialGradient(-20, -16, 4, 0, 0, 70); gr.addColorStop(0, '#ff8a8a'); gr.addColorStop(0.6, '#e03a48'); gr.addColorStop(1, '#a01a2a');
    c.fillStyle = gr; c.strokeStyle = '#6a0a1a'; c.lineWidth = 3; heartShape(c, s); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(120,10,30,0.5)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(6 * s, -20 * s); c.quadraticCurveTo(-8 * s, 6 * s, 4 * s, 34 * s); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.ellipse(-26 * s, -20 * s, 10 * s, 6 * s, -0.6, 0, 7); c.fill();
    c.restore();
  }
  MG.add({
    id: 'beat', stage: 'body', cmd: 'TAP THE HEART TO RUN HOME!', time: 6, mood: 'bright', winText: 'Faster heart, faster legs!', failText: 'Out of puff!',
    card: { title: 'The heart keeps time', kind: 'Biology', ref: 'Heart rate and exercise',
      text: 'Every beat, your heart squeezes and pushes blood out through your arteries. The blood carries oxygen to your muscles. Between beats the heart relaxes and fills up again.\n\nResting muscles need only a little oxygen, so a slow, steady beat is enough. Running muscles burn oxygen much faster, so the heart beats faster and harder to keep up. That is why your heart pounds when you run.\n\nIf the heart beats too fast, it has no time to fill between beats, so each beat pushes out less blood.',
      note: 'The heart pumps blood in a steady rhythm and speeds up when the muscles work harder and need more oxygen.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.lv = lv; s.L = LV[lv]; s.v = SK.variant(g, 4);
      s.O = 0.75; s.phase = 'sleep'; s.beats = 0; s.last = -9; s.sq = 0; s.pulses = []; s.rx = [44, 52, 40, 48][s.v]; s.fx = -80; s.home = 316; s.wake = 0; s.endT = 0; s.cue0 = 0.9; s.per = 1.0; s.cueN = 0; s.dribble = -9; s.goodT = -9;
      s.fox = [['#e8803a', 1], ['#d8703a', 1], ['#e8803a', 1], ['#c8602a', 1]][s.v][0];
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || s.phase === 'home' || s.phase === 'flag') return;
      if (SK.dist(x, y, HC.x, HC.y) > BUB) return;
      const fill = SK.clamp((g.t - s.last) / REFILL, 0, 1); s.last = g.t; s.beats++; s.sq = 1;
      s.pulses.push({ t: g.t, a: PULSE * (0.15 + 0.85 * fill * fill) }); if (fill < 0.7) s.dribble = g.t; else s.goodT = g.t;
      g.sfx('drum', { vol: 0.8, pitch: 0.7 }); g.sfx('thud', { vol: 0.6 });
    },
    update(g, dt) {
      const s = g.s, t = g.t, L = s.L;
      s.sq = Math.max(0, s.sq - dt / REFILL);
      // the blood pulses travel to the legs and top up the oxygen there
      for (const p of s.pulses) if (!p.done && t - p.t >= TRAVEL) { p.done = true; s.O = Math.min(1, s.O + p.a); }
      s.pulses = s.pulses.filter(p => t - p.t < TRAVEL + 0.3);
      if (s.phase === 'sleep') {
        s.O = Math.max(0.35, s.O - 0.05 * dt);
        if ((s.beats >= 3 && t - s.last > 0.3) || t > 4.6) { s.phase = 'run'; s.wake = t; s.fx = s.rx - 130; g.sfx('rustle'); g.sfx('boing'); }
      } else if (s.phase === 'run') {
        const up = L.hill && s.rx > L.hill[0] - 10 && s.rx < L.hill[1] + 10, use = up ? L.up : L.run;
        s.O = Math.max(0, s.O - use * dt);
        const sp = 76 * SK.clamp((s.O - 0.06) / 0.4, 0.25, 1) * (up ? 0.8 : 1);
        if (t - s.wake > 0.35) s.rx += sp * dt;
        s.fx += 58 * dt; if (s.fx > s.rx - 46) s.fx = s.rx - 46;
        if (s.rx >= s.home - 6 && !g.done) { s.phase = 'home'; s.endT = t; g.sfx('pop'); g.sfx('cheer'); g.win(); }
        else if (s.O <= 0 && !g.done) { s.phase = 'flag'; s.endT = t; g.sfx('fail'); g.sfx('laugh'); g.fail(); }
      }
      // the beat the body asks for: slow while asleep, fast while running (faster up the hill)
      const up = L.hill && s.rx > L.hill[0] - 10 && s.rx < L.hill[1] + 10;
      s.per = s.phase === 'sleep' ? 0.8 : PULSE / (up ? L.up : L.run) * 0.92;
      if (t >= s.cue0 + s.per) { s.cue0 += s.per; if (t > s.cue0 + s.per) s.cue0 = t; s.cueN++; }
    },
    draw(g, c) {
      const s = g.s, t = g.t, L = s.L, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('beat_bg' + s.lv, o => paintBg(o, s.lv)), 0, 0, 360, 640);
      burrow(c, s.home + 10, PATH - 2);
      // the fox (once it has woken the rabbit) and the rabbit
      const ry = PATH - 4 - hillY(L, s.rx), running = s.phase === 'run';
      if (s.phase !== 'sleep') SK.animal(c, 'fox', s.fx, PATH - 4 - hillY(L, s.fx), 0.8, { t: t * (running ? 1.6 : 1), pose: lost ? 'cheer' : won ? 'sad' : 'walk', expr: lost ? 'laugh' : won ? 'wow' : 'happy' });
      if (s.phase !== 'home' || t - s.endT < 0.25) {
        const hop = running ? Math.abs(Math.sin(t * 12)) * 10 : 0;
        SK.animal(c, 'rabbit', s.rx, ry - hop, 1.0, { t: t * (running ? 2 : 1), pose: s.phase === 'sleep' ? 'idle' : s.phase === 'flag' ? 'sad' : 'walk', expr: s.phase === 'sleep' ? 'laugh' : s.phase === 'flag' ? 'sad' : s.O < 0.3 ? 'wow' : 'happy', noShadow: !!hop });
        // the legs glow with the oxygen they have
        c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,90,90,${0.15 + 0.45 * s.O})`; c.beginPath(); c.ellipse(s.rx - 4, ry - hop - 10, 18, 10, 0, 0, 7); c.fill(); c.restore();
        if (s.phase === 'sleep') { c.save(); c.font = '900 20px Nunito, system-ui, sans-serif'; c.fillStyle = '#6a4a8a'; for (let i = 0; i < 3; i++) { const q = (t * 0.6 + i / 3) % 1; c.globalAlpha = 1 - q; c.fillText('z', s.rx + 24 + q * 20, ry - 60 - q * 40); } c.restore(); }
        if (s.phase === 'flag') { c.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 3; i++) { const q = (t * 2 + i / 3) % 1; c.beginPath(); c.arc(s.rx + 30 + q * 20, ry - 40 - q * 10, 4 + q * 6, 0, 7); c.fill(); } }
      }
      // the zoom bubble: a window into the rabbit's chest, joined to it by a tail
      const tx = SK.clamp(s.rx, 30, 330), tyy = ry - 40;
      c.fillStyle = 'rgba(255,250,240,0.85)'; c.beginPath(); c.moveTo(HC.x - 34, HC.y + BUB - 8); c.lineTo(tx, tyy); c.lineTo(HC.x + 34, HC.y + BUB - 8); c.closePath(); c.fill();
      c.fillStyle = '#fff4f0'; c.strokeStyle = '#c87a8a'; c.lineWidth = 4; c.beginPath(); c.arc(HC.x, HC.y, BUB, 0, 7); c.fill(); c.stroke();
      c.save(); c.beginPath(); c.arc(HC.x, HC.y, BUB - 2, 0, 7); c.clip();
      const bg = c.createRadialGradient(HC.x, HC.y, 10, HC.x, HC.y, BUB); bg.addColorStop(0, '#ffe8e0'); bg.addColorStop(1, '#f4c0b8'); c.fillStyle = bg; c.fillRect(HC.x - BUB, HC.y - BUB, BUB * 2, BUB * 2);
      // the artery to the legs, leaving the bubble at the bottom, and the pulses running along it
      const A = [[HC.x + 82, HC.y - 30], [HC.x + 96, HC.y + 40], [HC.x + 40, HC.y + 96], [HC.x, HC.y + BUB + 10]];
      c.strokeStyle = '#c8303a'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(A[0][0], A[0][1]); c.bezierCurveTo(A[1][0], A[1][1], A[2][0], A[2][1], A[3][0], A[3][1]); c.stroke();
      const bez = k => { const u = 1 - k; return [0, 1].map(j => u * u * u * A[0][j] + 3 * u * u * k * A[1][j] + 3 * u * k * k * A[2][j] + k * k * k * A[3][j]); };
      for (const p of s.pulses) { const k = (t - p.t) / (TRAVEL * 0.7); if (k > 1) continue; const [px, py] = bez(SK.clamp(k, 0, 1)); SK.ball(c, px, py, 4 + p.a * 50, '#ff3a4a'); }
      const fill = SK.clamp((t - s.last) / REFILL, 0, 1), ready = fill >= 1 && !g.done && s.phase !== 'home';
      heart(c, HC.x - 6, HC.y + 8, s.sq * (1 - 0.3 * (1 - fill)), t, ready);
      if (t - s.dribble < 0.5) SK.tag(c, 'Not full yet!', HC.x, HC.y + 78, 18, '#fff6ea', 'rgba(190,40,40,0.9)');
      c.restore();
      // pulses on their way down the tail to the legs
      for (const p of s.pulses) { const k = (t - p.t - TRAVEL * 0.7) / (TRAVEL * 0.3); if (k < 0 || k > 1) continue; SK.ball(c, SK.lerp(HC.x, tx, k), SK.lerp(HC.y + BUB, tyy, k), 4 + p.a * 40, '#ff3a4a'); }
      // the beat ring: it closes on the heart in the rhythm the body needs right now
      if (!g.done && s.phase !== 'home') { const k = SK.clamp((t - s.cue0) / s.per, 0, 1), R = SK.lerp(BUB - 6, 62, k);
        c.save(); c.strokeStyle = s.phase === 'run' ? '#e8303a' : '#8a5ac8'; c.globalAlpha = 0.35 + 0.6 * k; c.lineWidth = 3 + 5 * k; c.beginPath(); c.arc(HC.x - 6, HC.y + 4, R, 0, 7); c.stroke(); c.restore(); }
      SK.tag(c, 'Heart', HC.x - 70, HC.y - 86, 18, '#fff6ea', 'rgba(150,30,50,0.88)');
      // the oxygen gauge for the legs, with a green band to keep it in
      if (!g.done) { const GX = 60, GY = 428, GW = 240;
        c.fillStyle = 'rgba(30,14,36,0.65)'; c.beginPath(); c.roundRect(GX - 6, GY - 13, GW + 12, 26, 13); c.fill();
        c.fillStyle = 'rgba(90,208,122,0.45)'; c.fillRect(GX + GW * 0.45, GY - 9, GW * 0.55, 18);
        c.fillStyle = s.O < 0.3 ? '#ff5a5a' : s.O < 0.45 ? '#ffd45a' : '#7affa0'; c.beginPath(); c.roundRect(GX, GY - 6, Math.max(8, GW * s.O), 12, 6); c.fill();
        SK.tag(c, 'Oxygen', GX + 30, GY - 30, 18);
        if (s.phase === 'run' && s.O < 0.4) SK.tag(c, 'Beat faster!', GX + 170, GY - 30, 18, '#fff6ea', 'rgba(190,40,40,0.9)');
        const togo = Math.max(0, s.home - s.rx); if (s.phase === 'run') { c.strokeStyle = 'rgba(255,255,255,0.6)'; c.setLineDash([5, 6]); c.lineWidth = 3; c.beginPath(); c.moveTo(s.rx + 24, PATH + 4); c.lineTo(s.rx + 24 + togo - 20, PATH + 4); c.stroke(); c.setLineDash([]); } }
      SK.glow(c, g, HC.x - 6, HC.y + 8, 58, '#ffe27a');
      // guidance: the hand taps the heart in the body's rhythm (always once the heart has refilled)
      const per = Math.max(s.per, REFILL + 0.05);
      SK.demo(g, c, 'tap', [HC.x, HC.y + 20], null, { period: per, never: s.phase === 'home' || s.phase === 'flag' });
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 0.9) return;
      if (g.t - s.last >= Math.max(REFILL + 0.02, s.per * 0.97)) { synth('down', HC.x, HC.y + 10); synth('up', HC.x, HC.y + 10); }
    },
  });
})();
