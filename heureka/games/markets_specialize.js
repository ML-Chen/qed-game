// FILL BOTH CRATES BEFORE SUNSET! (business MI-03, comparative advantage; reworked) — a little island with a fishing
// pond on the left and a coconut palm on the right, and a crate under each with slots for what the village needs
// today. The sun crosses the sky from your first touch. Two workers start the day splitting their time: a bit of
// fishing, a walk across, a bit of picking, a walk back (walking makes nothing). The first worker is faster at BOTH
// jobs, but far faster at one of them. Drag a worker onto a job and they stick to it; drag again whenever you like.
// Watch the crates fill live: splitting wastes the day and leaves a crate short at sunset, and the star worker on its
// "only a bit better" job leaves the slow one hopelessly behind. Each sticking to the job they give up least for
// fills both crates in time. Two days with new workers and numbers; at night the day starts again (time lost).
// Level 2: shorter days.
(() => {
  const SKY = 150, ST = [{ x: 92, wy: 456, name: 'Fish' }, { x: 268, wy: 456, name: 'Coconuts' }], CY = 528;
  // rates[w][good]: what worker w makes in one whole day at good 0 (fish) or 1 (coconuts); the first is faster at both
  const ROUNDS = [
    { w: ['beaver', 'rabbit'], r: [[12, 6], [2, 4]] },
    { w: ['penguin', 'hedgehog'], r: [[6, 12], [4, 2]] },
    { w: ['octopus', 'duck'], r: [[12, 8], [3, 6]] },
    { w: ['turtle', 'bird'], r: [[6, 12], [5, 3]] },
    { w: ['fox', 'frog'], r: [[11, 8], [2, 6]] },
  ];
  const best = R => (R.r[0][0] / R.r[1][0] >= R.r[0][1] / R.r[1][1] ? [0, 1] : [1, 0]); // the job each worker gives up least for
  const WORK = 1.3, WALK = 0.7, DAY = [10, 9, 7];
  function paintIsland(o) {
    const sky = o.createLinearGradient(0, 0, 0, 360); sky.addColorStop(0, '#7ec8e8'); sky.addColorStop(0.6, '#bfe6f0'); sky.addColorStop(1, '#fff1c8'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    P.cloud(o, 60, 244, 0.5); P.cloud(o, 316, 226, 0.45);
    P.water(o, 360, 300, 350, '#2a7a9a', '#5ab4d4');
    const sand = o.createLinearGradient(0, 310, 0, 640); sand.addColorStop(0, '#f8e0a8'); sand.addColorStop(1, '#e0b878'); o.fillStyle = sand; o.beginPath(); o.moveTo(0, 342); o.quadraticCurveTo(180, 306, 360, 342); o.lineTo(360, 640); o.lineTo(0, 640); o.closePath(); o.fill();
    P.grassTufts(o, 360, 580, 606, 14, '#8aa848', 6);
    const pg = o.createRadialGradient(92, 410, 6, 92, 414, 76); pg.addColorStop(0, '#5ab8d8'); pg.addColorStop(1, '#2a7a9a'); o.fillStyle = pg; o.beginPath(); o.ellipse(92, 414, 76, 30, 0, 0, 7); o.fill();
    o.strokeStyle = 'rgba(255,255,255,0.55)'; o.lineWidth = 2; for (const [x, y] of [[70, 408], [110, 420], [92, 400]]) { o.beginPath(); o.moveTo(x - 10, y); o.lineTo(x + 10, y); o.stroke(); }
    for (let i = 0; i < 5; i++) { o.strokeStyle = '#4a8a3a'; o.lineWidth = 3; o.beginPath(); o.moveTo(20 + i * 5, 420); o.quadraticCurveTo(16 + i * 6, 394, 22 + i * 4, 382 + i * 3); o.stroke(); }
    o.strokeStyle = '#8a5a30'; o.lineWidth = 14; o.lineCap = 'round'; o.beginPath(); o.moveTo(262, 446); o.quadraticCurveTo(252, 370, 280, 300); o.stroke(); o.lineCap = 'butt';
    o.strokeStyle = 'rgba(60,30,10,0.35)'; o.lineWidth = 2; for (let i = 0; i < 8; i++) { const y = 436 - i * 17, x = 258 + (i > 4 ? (i - 4) * 5 : 0); o.beginPath(); o.moveTo(x - 6, y); o.lineTo(x + 7, y - 3); o.stroke(); }
    for (const [a, l] of [[-2.7, 70], [-2.1, 62], [-1.3, 60], [-0.5, 66], [0.2, 58], [-3.3, 52]]) { o.save(); o.translate(280, 300); o.rotate(a); const lg = o.createLinearGradient(0, 0, l, 0); lg.addColorStop(0, '#3a8a3a'); lg.addColorStop(1, '#7ac060'); o.fillStyle = lg; o.beginPath(); o.moveTo(0, 0); o.quadraticCurveTo(l * 0.5, -18, l, 8); o.quadraticCurveTo(l * 0.5, 4, 0, 0); o.fill(); o.restore(); }
    for (const [x, y] of [[276, 312], [288, 316], [282, 304]]) { o.fillStyle = '#6a4020'; o.beginPath(); o.arc(x, y, 6, 0, 7); o.fill(); }
  }
  function fish(c, x, y, s = 1, ghost) { c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha *= ghost ? 0.3 : 1; c.fillStyle = ghost ? '#3a1640' : '#f08a3a'; c.strokeStyle = '#8a3a10'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(0, 0, 10, 6, 0, 0, 7); c.fill(); if (!ghost) c.stroke(); c.beginPath(); c.moveTo(8, 0); c.lineTo(15, -6); c.lineTo(15, 6); c.closePath(); c.fill(); if (!ghost) { c.fillStyle = '#2a1424'; c.beginPath(); c.arc(-5, -1.5, 1.5, 0, 7); c.fill(); } c.restore(); }
  function nut(c, x, y, s = 1, ghost) { c.save(); c.translate(x, y); c.scale(s, s); if (ghost) { c.globalAlpha *= 0.3; c.fillStyle = '#3a1640'; c.beginPath(); c.arc(0, 0, 8.5, 0, 7); c.fill(); } else { SK.ball(c, 0, 0, 8.5, '#8a5a30', { lw: 1.5 }); c.fillStyle = '#3a2010'; for (const a of [-0.4, 0.4, 1.2]) { c.beginPath(); c.arc(Math.cos(a) * 3 - 1, Math.sin(a) * 3 - 3, 1.3, 0, 7); c.fill(); } } c.restore(); }
  const item = (c, k, x, y, s, gh) => (k ? nut : fish)(c, x, y, s, gh);
  MG.add({
    id: 'specialize', stage: 'markets', cmd: 'FILL BOTH CRATES BEFORE SUNSET!', time: 8, mood: 'sea', winText: 'Both crates full!', failText: 'The crates are short!', hold: 1.5,
    card: { title: 'Do what you give up least for', kind: 'Economics', ref: 'Comparative advantage',
      text: 'The first worker was faster at both jobs, but it could not do both at once. Every minute spent on one job, and every walk between them, was time lost from the other.\n\nWhat a job really costs is what you give up to do it. The star worker gave up a lot of its best job to do the other one. The slower worker gave up very little.\n\nSo each worker stuck to the job where they gave up least, and together they made more than any other way. This is why people, and whole countries, specialise and trade.',
      note: 'Even someone who is better at everything gains by doing what they give up least for and trading for the rest.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 5); s.L = L; s.n = 2; s.rounds = [ROUNDS[s.v], ROUNDS[(s.v + 2) % ROUNDS.length]]; s.ri = 0; this.startDay(g);
    },
    startDay(g) {
      const s = g.s, R = s.rounds[s.ri];
      s.R = R; s.best = best(R); s.need = [0, 1].map(k => Math.max(2, Math.round(0.6 * R.r[s.best.indexOf(k)][k]))); s.dayOn = false; /* a bit over half of what the right split makes */ s.crate = [0, 0]; s.acc = [0.3, 0.3]; s.day = 0; s.phase = 'day'; s.pt = g.t; s.fly = []; s.drag = null;
      s.wk = R.w.map((k, i) => ({ k, i, at: i, pin: false, x: ST[i].x + (i ? 24 : -24), y: ST[i].wy, st: 'work', t: g.t + i * 0.5 })); // they start out splitting their time
    },
    spot(s, w) { const share = s.wk.filter(o => o.at === w.at && o.st === 'work' && o !== s.drag), j = share.indexOf(w); return [ST[w.at].x + (share.length > 1 ? (j ? 28 : -28) : 0), ST[w.at].wy]; },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.phase !== 'day') return; if (!s.dayOn) { s.dayOn = true; g.sfx('chime', { vol: 0.5 }); } const w = SK.pick(s.wk, x, y + 30, 46); if (w) { s.drag = w; SK.dragStart(g, w, x, y); g.sfx('tap'); } },
    move(g, x, y) { if (g.s.drag) SK.dragMove(g, x, y); },
    up(g) {
      const s = g.s, w = s.drag; if (!w) return; s.drag = null; SK.dragEnd(g);
      let at = -1; for (let k = 0; k < 2; k++) if (Math.abs(w.x - ST[k].x) < 86 && w.y > 300 && w.y < 600) at = k;
      if (at >= 0) { w.at = at; w.pin = true; w.st = 'work'; w.t = g.t; s.acc[w.i] = Math.max(s.acc[w.i], 0.3); g.sfx('pop'); g.sfx(at ? 'rustle' : 'splash', { vol: 0.5 }); } else { w.pin = false; w.st = 'walk'; w.t = g.t; g.sfx('swoosh'); }
    },
    update(g, dt) {
      const s = g.s, R = s.R, L = s.L;
      for (const f of s.fly) f.k += dt / 0.45; s.fly = s.fly.filter(f => f.k < 1);
      if (g.done) return;
      if (s.phase === 'day') {
        if (s.dayOn) s.day += dt / DAY[L]; // the sun starts with your first touch
        for (const w of s.wk) {
          if (s.drag === w) continue;
          if (w.st === 'work') {
            const [hx, hy] = this.spot(s, w); w.x += (hx - w.x) * Math.min(1, dt * 9); w.y += (hy - w.y) * Math.min(1, dt * 9);
            if (g.t >= w.t && s.dayOn) s.acc[w.i] += R.r[w.i][w.at] * dt / DAY[L];
            if (s.acc[w.i] >= 1) { s.acc[w.i] -= 1; s.crate[w.at]++; s.fly.push({ g: w.at, x: w.x, y: w.y - 50, k: 0, n: s.crate[w.at] - 1 }); g.sfx(w.at ? 'thud' : 'splash', { vol: 0.3, pitch: 1.2 }); }
            if (!w.pin && g.t - w.t > WORK) { w.st = 'walk'; w.t = g.t; w.at = 1 - w.at; } // off to help with the other job
          } else { // walking across: making nothing
            const hx = ST[w.at].x, hy = ST[w.at].wy, d = SK.dist(w.x, w.y, hx, hy), sp = Math.abs(ST[1].x - ST[0].x) / WALK;
            if (d < sp * dt + 2) { w.x = hx; w.y = hy; w.st = 'work'; w.t = g.t; } else { w.x += (hx - w.x) / d * sp * dt; w.y += (hy - w.y) / d * sp * dt; }
          }
        }
        if (s.crate[0] >= s.need[0] && s.crate[1] >= s.need[1]) {
          if (s.ri >= s.n - 1) { g.win(); g.sfx('cheer'); g.burst(180, 500, ['#ffe27a', '#fff6ea', '#f08a3a', '#5ab4d4'], 26, 220); return; }
          s.phase = 'next'; s.pt = g.t; g.sfx('ding'); g.burst(180, 520, ['#ffe27a', '#fff6ea'], 16, 160);
        } else if (s.day >= 1) { s.phase = 'night'; s.pt = g.t; s.drag = null; g.sfx('wrong'); g.sfx('laugh', { vol: 0.5 }); }
      } else if (s.phase === 'next' && g.t - s.pt > 0.7) { s.ri++; this.startDay(g); g.sfx('pop'); }
      else if (s.phase === 'night' && g.t - s.pt > 1.3) this.startDay(g);
    },
    draw(g, c) {
      const s = g.s, t = g.t, R = s.R, won = g.result === 'win';
      c.drawImage(g.bake('n7isle2', paintIsland), 0, 0, 360, 640);
      // the sun crosses the sky; night falls if the crates are short
      const night = s.phase === 'night' ? SK.clamp((t - s.pt) * 3, 0, 1) * SK.clamp((1.3 - (t - s.pt)) * 3, 0, 1) : 0, dk = Math.min(1, s.day);
      const sx = SK.lerp(34, 326, dk), sy = SKY + 46 - Math.sin(dk * Math.PI) * 36 + night * 120;
      c.save(); c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 2; c.setLineDash([4, 6]); c.beginPath(); for (let i = 0; i <= 20; i++) { const q = i / 20, x = SK.lerp(34, 326, q), y = SKY + 46 - Math.sin(q * Math.PI) * 36; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore();
      c.save(); c.fillStyle = '#ffd45a'; c.shadowColor = '#ffe9a0'; c.shadowBlur = 24; c.beginPath(); c.arc(sx, sy, 17, 0, 7); c.fill(); c.restore();
      SK.tag(c, 'Sunset', 316, SKY + 72, 18);
      if (night) { c.fillStyle = `rgba(20,20,70,${0.5 * night})`; c.fillRect(0, 0, 360, 640); c.fillStyle = `rgba(255,250,220,${night})`; c.beginPath(); c.arc(300, 200, 14, 0, 7); c.fill(); c.fillStyle = `rgba(20,20,70,${0.5 * night})`; c.beginPath(); c.arc(306, 196, 12, 0, 7); c.fill(); }
      for (let k = 0; k < 2; k++) SK.tag(c, ST[k].name, ST[k].x, 268 + (k ? 0 : 50), 18);
      // the crates: slots for what the village needs, filled live
      for (let k = 0; k < 2; k++) {
        const need = s.need[k], have = Math.min(need, s.crate[k]), cx = ST[k].x, sp = 19, w = need * sp + 16;
        c.fillStyle = '#c8945a'; c.strokeStyle = '#6a4020'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(cx - w / 2, CY - 18, w, 38, 6); c.fill(); c.stroke();
        for (let j = 0; j < need; j++) { const ix = cx - (need - 1) * sp / 2 + j * sp; item(c, k, ix, CY, 0.82, j >= have || s.fly.some(f => f.g === k && f.n === j)); }
        const ok = s.crate[k] >= need, short = s.phase === 'night' && !ok;
        if (ok || short) { c.strokeStyle = short ? `rgba(232,64,58,${0.6 + 0.4 * Math.sin(t * 12)})` : '#5ad07a'; c.lineWidth = 4; c.beginPath(); c.roundRect(cx - w / 2 - 3, CY - 21, w + 6, 44, 8); c.stroke(); }
      }
      for (const f of s.fly) { const n = s.need[f.g], sp = 19, tx = ST[f.g].x - (n - 1) * sp / 2 + Math.min(f.n, n - 1) * sp, m = SK.easeInOut(f.k); item(c, f.g, SK.lerp(f.x, tx, m), SK.lerp(f.y, CY, m) - Math.sin(m * Math.PI) * 40, 1); }
      // the workers: fishing, shaking the palm, or walking between the jobs (a red flag: sticking to this job)
      for (const w of s.wk) {
        const working = s.phase === 'day' && w.st === 'work' && s.drag !== w, walking = w.st === 'walk' && s.drag !== w;
        SK.animal(c, w.k, w.x, w.y, 0.92, { t, phase: w.i * 2, facing: walking ? (ST[w.at].x > w.x ? 1 : -1) : w.at === 1 ? 1 : -1, pose: won ? 'cheer' : s.phase === 'night' ? 'sad' : s.drag === w ? 'hop' : walking ? 'walk' : working ? (w.at ? 'cheer' : 'point') : 'idle',
          expr: won || s.phase === 'next' ? 'laugh' : s.phase === 'night' ? 'sad' : walking ? 'think' : 'happy' });
        if (working && w.at === 0) { const fx = w.x - 34, fy = w.y - 44; c.strokeStyle = '#6a4020'; c.lineWidth = 3; c.beginPath(); c.moveTo(w.x - 10, w.y - 36); c.lineTo(fx, fy - 20); c.stroke(); c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 1; c.beginPath(); c.moveTo(fx, fy - 20); c.lineTo(fx - 4, 420 + Math.sin(t * 5 + w.i) * 3); c.stroke(); }
        if (w.pin && s.phase === 'day') { c.fillStyle = '#e8503a'; c.beginPath(); c.moveTo(w.x + 14, w.y - 78); c.lineTo(w.x + 14, w.y - 96); c.lineTo(w.x + 28, w.y - 90); c.closePath(); c.fill(); c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.moveTo(w.x + 14, w.y - 70); c.lineTo(w.x + 14, w.y - 98); c.stroke(); }
      }
      if (!g.done) SK.tag(c, 'Day ' + (s.ri + 1) + ' / ' + s.n, 180, 236, 18);
      // guidance: drag the next worker who isn't sticking to the job they give up least for
      if (s.phase === 'day' && !g.done && !s.drag) {
        const w = s.wk.find(o => !o.pin || o.at !== s.best[o.i]);
        if (w) { const k = s.best[w.i], tx = ST[k].x, ty = ST[k].wy - 30;
          SK.grab(c, g, w.x, w.y - 30, 30); SK.target(c, g, tx, ty, 0, { w: 120, h: 90 }); SK.arrow(c, g, w.x, w.y - 30, tx, ty, { from: 36, to: 56 });
          SK.demo(g, c, 'drag', [w.x, w.y - 30], [tx, ty], { delay: 0.7 }); }
      }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.phase !== 'day') return;
      const B = s._n7 = s._n7 || {};
      if (B.cur) { if (SK.bot.drag(g, synth, B.cur.key, B.cur.at, B.cur.a, B.cur.b, 0.45)) B.cur = null; return; }
      const w = s.wk.find(o => !o.pin || o.at !== s.best[o.i]); if (!w) return;
      if (!B.wait) { B.wait = g.t + 0.3; return; } if (g.t < B.wait) return; B.wait = 0;
      const k = s.best[w.i]; B.n = (B.n || 0) + 1; B.cur = { key: 'w' + B.n, at: g.t, a: [w.x, w.y - 30], b: [ST[k].x, ST[k].wy - 30] };
      SK.bot.drag(g, synth, B.cur.key, B.cur.at, B.cur.a, B.cur.b, 0.45);
    },
  });
})();
