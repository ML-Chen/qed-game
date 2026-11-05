// SAMPLE! (earth_eng SC-11) — a frog sings into a robot's microphone; its song's wave rolls past the Mic line. Each tap
// takes one sample: a dot at the wave's height at that moment. The robot joins its dots into its own copy of the song
// (the panel below). Tap often enough, at least twice for every wiggle, so that every hump and every dip of the wave
// gets a dot, and the copy has the same wiggles. Let a hump or a dip roll past without a dot and the copy draws a
// slow, wrong wave there, and the count of wiggles copied in a row starts again. Recording starts at your first tap.
// Level 0: three wiggles; level 1: four, a faster song; level 2: five, faster still.
(() => {
  const MX = 232, V = 120, TOP = { y: 236, a: 48 }, COPY = { y: 412, a: 44 }, BTN = { x: 180, y: 566 };
  const PL = [{ n: 3, T: 1.5 }, { n: 4, T: 1.15 }, { n: 5, T: 0.9 }], AMP = [1, 0.85, 0.95, 0.8];
  const half = s => V * s.pl.T / 2, wave = (s, u) => Math.sin(u / (V * s.pl.T) * 2 * Math.PI) * (0.75 + 0.25 * Math.sin(u / 230 + s.v)) * s.amp;
  function paintStage(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#2a5a6a'); bg.addColorStop(0.5, '#4a8a8a'); bg.addColorStop(1, '#2a4a5a'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    const r = P.rng(12); for (let i = 0; i < 18; i++) { o.fillStyle = `rgba(200,255,230,${0.05 + r() * 0.1})`; o.beginPath(); o.arc(r() * 360, 130 + r() * 480, 10 + r() * 30, 0, 7); o.fill(); }
    for (const [y, h, lbl] of [[TOP.y, 70, 0], [COPY.y, 66, 1]]) { o.fillStyle = 'rgba(10,20,30,0.45)'; o.beginPath(); o.roundRect(10, y - h, 340, h * 2, 16); o.fill(); o.strokeStyle = 'rgba(255,255,255,0.08)'; o.lineWidth = 1; for (let k = -2; k <= 2; k++) { o.beginPath(); o.moveTo(16, y + k * h / 2.5); o.lineTo(344, y + k * h / 2.5); o.stroke(); } }
    // the lily pad stage for the frog
    o.fillStyle = '#3a9a4a'; o.beginPath(); o.ellipse(306, 318, 46, 12, 0, 0, 7); o.fill();
  }
  function newRun(s) { s.dots = []; s.rec = null; s.checked = 0; s.streak = 0; s.misses = []; s.miss = null; }
  MG.add({
    id: 'sample', stage: 'robots', cmd: 'TAP FAST TO COPY THE SONG!', time: 7, mood: 'night', winText: 'Perfect copy!', failText: 'Wrong wave!',
    card: { title: 'Sample often enough', kind: 'Robots', ref: 'Sampling (the Nyquist rule)',
      text: 'A robot cannot record a smooth wave directly. It measures the wave\'s height again and again, at separate moments. Each measurement is a sample, and joining the samples gives the robot its copy.\n\nIf it samples at least twice for every wiggle, every hump and dip gets a dot, and the copy keeps the wave\'s wiggles. If it samples less often, whole wiggles slip between the dots, and the copy becomes a slower, wrong wave.\n\nThis is why music is recorded tens of thousands of times a second.',
      note: 'To capture a wave you must sample it often enough: at least twice for every wiggle.' },
    init(g) { const s = g.s; s.L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.pl = PL[s.L]; s.amp = AMP[s.v]; s.off = s.v * 37 + 20; newRun(s); s.flash = 0; },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || y < 480) return; const u = MX + V * g.t + s.off;
      if (!s.rec) { s.rec = { t: g.t, h0: Math.floor(u / half(s)) }; g.sfx('click'); }
      s.dots.push({ u, h: wave(s, u) }); s.flash = g.t; g.sfx('tap', { pitch: 1.1 + wave(s, u) * 0.3 });
    },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      if (!s.rec) return;
      // every hump and dip that has finished passing the mic since recording began must hold at least one dot
      const u = MX + V * g.t + s.off, cur = Math.floor(u / half(s));
      while (s.rec.h0 + 1 + s.checked < cur) { const j = s.rec.h0 + 1 + s.checked, has = s.dots.some(d => Math.floor(d.u / half(s)) === j);
        s.checked++;
        if (!has) { s.miss = { t: g.t, j }; s.misses.push(j); s.streak = 0; g.sfx('wrong'); g.sfx('boing', { pitch: 0.6 }); continue; }
        s.streak++; g.sfx('ding', { pitch: 1 + s.streak * 0.05, vol: 0.4 });
        if (s.streak >= s.pl.n * 2) { g.win(); g.sfx('cheer'); g.burst(200, COPY.y, ['#7ee8a0', '#fff6ea', '#ffd45a'], 22, 170); return; } }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', missing = s.miss && t - s.miss.t < 1.2, uNow = V * t + s.off;
      c.drawImage(g.bake('sample_stage', paintStage), 0, 0, 360, 640);
      // the song: the wave rolls left past the Mic line
      c.save(); c.beginPath(); c.rect(12, TOP.y - 68, 336, 136); c.clip();
      c.strokeStyle = '#7ef0d0'; c.lineWidth = 4; c.lineJoin = 'round'; c.beginPath(); for (let x = 12; x <= 348; x += 3) { const y = TOP.y - wave(s, x + uNow) * TOP.a; x === 12 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
      // the humps and dips already judged: green ticks for caught ones; the missed one in red
      if (s.rec) for (let k = 0; k < s.checked; k++) { const j = s.rec.h0 + 1 + k, uc = (j + 0.5) * half(s), x = uc - uNow; if (x < -half(s) || x > 340) continue; const up = Math.sin(uc / (V * s.pl.T) * 2 * Math.PI) > 0, miss = s.misses.includes(j);
        c.fillStyle = miss ? 'rgba(255,80,70,0.25)' : 'rgba(120,255,160,0.15)'; c.fillRect(x - half(s) / 2, up ? TOP.y - 66 : TOP.y, half(s), 66); }
      // the samples, sitting on the wave where they were taken
      for (const d of s.dots) { const x = d.u - uNow; if (x < 4) continue; c.fillStyle = '#ffd45a'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.arc(x, TOP.y - d.h * TOP.a, 6, 0, 7); c.fill(); c.stroke(); }
      c.restore();
      // the mic and its line
      c.save(); c.strokeStyle = 'rgba(255,255,255,0.7)'; c.setLineDash([5, 5]); c.lineWidth = 2; c.beginPath(); c.moveTo(MX, TOP.y - 70); c.lineTo(MX, COPY.y + 66); c.stroke(); c.restore();
      const fl = Math.max(0, 1 - (t - s.flash) * 5); c.fillStyle = '#3a3448'; c.beginPath(); c.roundRect(MX - 12, TOP.y - 104, 24, 34, 12); c.fill(); c.fillStyle = P.mix('#8a8aa8', '#ffe27a', fl); c.beginPath(); c.roundRect(MX - 9, TOP.y - 101, 18, 22, 9); c.fill(); c.fillStyle = '#3a3448'; c.fillRect(MX - 2, TOP.y - 72, 4, 6);
      SK.tag(c, 'Mic', MX - 42, TOP.y - 88, 18); SK.tag(c, 'Song', 306, TOP.y - 88, 18);
      // the robot's copy: straight lines joining its dots
      c.save(); c.beginPath(); c.rect(12, COPY.y - 64, 336, 128); c.clip();
      const pts = s.dots.map(d => [d.u - uNow, COPY.y - d.h * COPY.a]).filter(p => p[0] > -60);
      if (pts.length) { c.strokeStyle = missing || lost ? '#ff8a7a' : '#ffd45a'; c.lineWidth = 4; c.lineJoin = 'round'; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.lineTo(MX, pts[pts.length - 1][1]); c.stroke(); for (const p of pts) { c.fillStyle = '#ffd45a'; c.beginPath(); c.arc(p[0], p[1], 4, 0, 7); c.fill(); } }
      c.restore();
      SK.tag(c, "Robot's copy", 110, COPY.y - 82, 18);
      if (missing) SK.tag(c, 'Missed a wiggle!', 130, COPY.y + 40, 18, '#fff6ea', 'rgba(200,50,50,0.92)');
      // the frog singing on its lily pad
      SK.animal(c, 'frog', 306, 316, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'wave', expr: won ? 'laugh' : lost || missing ? 'wow' : 'laugh', facing: -1 });
      if (!g.done) { for (let i = 0; i < 2; i++) N5.text(c, '♪', 280 - i * 18 - ((t * 30) % 30), 268 - i * 12 + Math.sin(t * 4 + i) * 6, 20, '#c8fff0'); }
      if (!g.done) { N5.slots(c, Math.floor(s.streak / 2), s.pl.n, 100, 506); if (!s.rec) SK.tag(c, 'Not recording', 262, 506, 16); else SK.tag(c, 'Recording', 262, 506, 16, '#fff6ea', 'rgba(200,50,50,0.9)'); }
      N5.button(c, BTN.x, BTN.y, 230, 58, 'Sample!', '#3ab88a', fl > 0.5 ? 1 : 0, 24);
      // guidance: tap quickly, again and again
      if (!g.done) { SK.glow(c, g, BTN.x, BTN.y + 2, 60, '#ffe27a', { level: 2 }); SK.demo(g, c, 'tap', [BTN.x, BTN.y + 4], null, { period: 0.45 }); }
    },
    // the bot samples four times per wiggle
    auto(g, dt, synth) { const s = g.s; if (g.done || g.t < 0.8 || g.t < (s.bt || 0)) return; s.bt = g.t + s.pl.T * (typeof window !== 'undefined' && window.N5FAIL ? 0.9 : 0.25); synth('down', BTN.x, BTN.y); synth('up', BTN.x, BTN.y); },
  });
})();
