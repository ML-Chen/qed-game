// LOUDER! (physics PMS-18) — a night wood with animals asleep at different distances, and a speaker whose sound shows as
// a wave on a big screen. Drag the glowing crest up or down to make the wave taller or shorter: a taller wave is a louder
// sound (you hear it), the speaker cone moves farther, and the rings it sends out are stronger. Sideways makes the crests
// closer or farther apart: the pitch changes, but the loudness does not, so nobody wakes. Sound gets fainter with distance,
// so a far sleeper needs a louder sound. Each sleeper wakes when the sound reaching it is loud enough for a moment; much too
// loud and it tumbles off its perch in fright (then climbs back, still sleepy). Wake them all: two at level 0, three at
// levels 1 and 2 (narrower bands at level 2).
(() => {
  const SCR = { x0: 26, x1: 334, y0: 452, y1: 590, mid: 521 }, APX = 18, SPK = { x: 62, y: 418 };
  const SLEEP = [ // where each sleeper is, how much of the sound reaches it, and its size (farther is smaller)
    { kind: 'owl', x: 96, y: 238, att: 1.0, s: 1.05 },
    { kind: 'rabbit', x: 210, y: 334, att: 0.66, s: 0.8 },
    { kind: 'fox', x: 304, y: 250, att: 0.46, s: 0.62 },
  ];
  function paintWood(o) {
    const sky = o.createLinearGradient(0, 0, 0, 450); sky.addColorStop(0, '#141a48'); sky.addColorStop(0.6, '#2a3270'); sky.addColorStop(1, '#4a4a88'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    const rnd = P.rng(31); for (let i = 0; i < 70; i++) { o.fillStyle = `rgba(255,250,220,${0.3 + rnd() * 0.6})`; o.beginPath(); o.arc(rnd() * 360, rnd() * 300, 0.5 + rnd(), 0, 7); o.fill(); }
    const mg = o.createRadialGradient(250, 150, 10, 250, 150, 70); mg.addColorStop(0, 'rgba(255,245,200,0.5)'); mg.addColorStop(1, 'rgba(255,245,200,0)'); o.fillStyle = mg; o.fillRect(150, 60, 200, 200);
    o.fillStyle = '#fff4cc'; o.beginPath(); o.arc(250, 150, 22, 0, 7); o.fill(); o.fillStyle = '#2a3270'; o.beginPath(); o.arc(260, 144, 20, 0, 7); o.fill();
    // far hill with the fox's rock, middle meadow with the rabbit's bush, the near tree with the owl's branch
    o.fillStyle = '#2a3a6a'; o.beginPath(); o.moveTo(0, 300); o.quadraticCurveTo(120, 250, 220, 280); o.quadraticCurveTo(300, 240, 360, 262); o.lineTo(360, 460); o.lineTo(0, 460); o.fill();
    o.fillStyle = '#5a6a8a'; o.beginPath(); o.ellipse(304, 256, 30, 10, 0, 0, 7); o.fill();
    o.fillStyle = '#34507a'; o.beginPath(); o.moveTo(0, 360); o.quadraticCurveTo(180, 320, 360, 350); o.lineTo(360, 460); o.lineTo(0, 460); o.fill();
    for (const [x, y, r] of [[184, 336, 16], [236, 338, 14], [204, 326, 14]]) { o.fillStyle = '#2a5a4a'; o.beginPath(); o.arc(x, y, r, 0, 7); o.fill(); }
    o.fillStyle = '#3a4a7a'; o.fillRect(0, 400, 360, 60);
    o.fillStyle = '#1e1a30'; o.beginPath(); o.moveTo(22, 460); o.quadraticCurveTo(30, 300, 26, 120); o.lineTo(48, 120); o.quadraticCurveTo(52, 300, 60, 460); o.fill();
    o.beginPath(); o.moveTo(40, 246); o.quadraticCurveTo(90, 236, 140, 244); o.lineTo(140, 252); o.quadraticCurveTo(90, 246, 44, 258); o.fill();
    for (let i = 0; i < 9; i++) { o.fillStyle = i % 2 ? '#22304a' : '#283a58'; o.beginPath(); o.arc(10 + rnd() * 90, 90 + rnd() * 70, 26 + rnd() * 16, 0, 7); o.fill(); }
    // the screen panel
    o.fillStyle = '#2a2030'; o.beginPath(); o.roundRect(SCR.x0 - 12, SCR.y0 - 12, SCR.x1 - SCR.x0 + 24, SCR.y1 - SCR.y0 + 24, 16); o.fill();
    const sg = o.createLinearGradient(0, SCR.y0, 0, SCR.y1); sg.addColorStop(0, '#0a2a2a'); sg.addColorStop(1, '#06201e'); o.fillStyle = sg; o.beginPath(); o.roundRect(SCR.x0, SCR.y0, SCR.x1 - SCR.x0, SCR.y1 - SCR.y0, 10); o.fill();
    o.strokeStyle = 'rgba(120,255,200,0.12)'; o.lineWidth = 1; for (let x = SCR.x0 + 22; x < SCR.x1; x += 22) { o.beginPath(); o.moveTo(x, SCR.y0); o.lineTo(x, SCR.y1); o.stroke(); } for (let y = SCR.y0 + 17; y < SCR.y1; y += 17) { o.beginPath(); o.moveTo(SCR.x0, y); o.lineTo(SCR.x1, y); o.stroke(); }
    o.strokeStyle = 'rgba(120,255,200,0.3)'; o.beginPath(); o.moveTo(SCR.x0, SCR.mid); o.lineTo(SCR.x1, SCR.mid); o.stroke();
    // the speaker box
    o.fillStyle = '#5a3a2a'; o.beginPath(); o.roundRect(SPK.x - 34, SPK.y - 36, 68, 72, 8); o.fill(); o.strokeStyle = '#2a1a10'; o.lineWidth = 2; o.stroke();
  }
  function zzz(c, x, y, t, s) { c.save(); c.strokeStyle = 'rgba(220,230,255,0.85)'; c.lineWidth = 2 * s; c.lineCap = 'round'; for (let i = 0; i < 3; i++) { const q = (t * 0.6 + i / 3) % 1, zx = x + q * 22 * s, zy = y - q * 34 * s, z = (5 + q * 5) * s; c.globalAlpha = Math.min(1, (1 - q) * 2.5); c.beginPath(); c.moveTo(zx - z, zy - z); c.lineTo(zx + z, zy - z); c.lineTo(zx - z, zy + z); c.lineTo(zx + z, zy + z); c.stroke(); } c.restore(); }
  const BANDS = [[1.0, 1.75], [1.0, 1.65], [1.0, 1.45]]; // the sound reaching a sleeper must land in this band
  MG.add({
    id: 'louder', stage: 'waves', cmd: 'WAKE THEM WITH A LOUDER SOUND!', time: 7, mood: 'night', winText: 'Amplitude!', failText: 'Still asleep!',
    card: { title: 'A taller wave is a louder sound', kind: 'Physics', ref: 'Amplitude and loudness',
      text: 'A sound is the air being pushed back and forth. The screen draws that push as a wave.\n\nThe height of the wave is called its amplitude. A taller wave means the speaker pushes the air harder, so the sound is louder. The note stays the same.\n\nSpacing the crests closer or farther apart changes the pitch, how high or low the note is, but not how loud it is.\n\nSound spreads out as it travels, so it is fainter far away. To wake a far sleeper you need a louder sound.',
      note: 'The taller the sound wave, the louder the sound. The spacing of the crests sets the pitch.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.who = (L === 0 ? [0, 2] : [0, 1, 2]).map(i => ({ ...SLEEP[i], awake: 0, hear: 0, prog: 0, fallT: -9 }));
      s.band = BANDS[L]; s.A = 0.35; s.lam = 120; s.ph = 0; s.drag = null; s.lastNote = 0; s.cone = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (y > SCR.y0 - 40) s.drag = { dx: crestX(s) - x, dy: (SCR.mid - s.A * APX) - y }; },
    move(g, x, y) { const s = g.s; if (!s.drag || g.done) return; const cx = x + s.drag.dx, cy = y + s.drag.dy; s.A = SK.clamp((SCR.mid - cy) / APX, 0.15, 3.7); s.lam = SK.clamp((cx - SCR.x0) * 4, 60, 260); },
    up(g) { g.s.drag = null; },
    update(g, dt) {
      const s = g.s, f = 130 / s.lam; s.ph += f * Math.PI * 2 * dt * 1.6; s.cone = Math.sin(s.ph) * s.A;
      for (const w of s.who) {
        if (w.awake) continue; w.hear = s.A * w.att;
        if (g.t - w.fallT < 1.4) continue; // climbing back up
        if (w.hear > s.band[1] * 1.22) { w.fallT = g.t; w.prog = 0; g.sfx('boing'); g.sfx('laugh'); continue; } // much too loud: it tumbles off in fright
        if (w.hear >= s.band[0] && w.hear <= s.band[1]) { w.prog += dt / 0.5; if (w.prog >= 1) { w.awake = g.t; g.sfx(w.kind === 'owl' ? 'coo' : 'tweet'); g.sfx('ding'); g.burst(w.x, w.y - 40 * w.s, ['#ffd45a', '#ffffff'], 12, 120); } }
        else w.prog = Math.max(0, w.prog - dt * 2);
      }
      if (!g.done && s.who.every(w => w.awake)) { g.sfx('cheer'); g.win(); }
      // the speaker's sound: a note per beat, as loud as the wave is tall and as high as the crests are close
      if (!g.done && g.t > 0.4 && g.t - s.lastNote > 0.3) { s.lastNote = g.t; g.sfx('bell', { pitch: SK.clamp(120 / s.lam, 0.45, 2.2), vol: SK.clamp(s.A / 2.2, 0.08, 1.6) }); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win';
      c.drawImage(g.bake('louder_wood', paintWood), 0, 0, 360, 640);
      // the rings the speaker sends out: stronger for a taller wave
      c.save(); c.lineCap = 'round';
      for (let i = 0; i < 6; i++) { const q = ((t * 0.9 + i / 6) % 1), r = 30 + q * 320; c.strokeStyle = `rgba(160,255,210,${(1 - q) * SK.clamp(s.A / 3, 0.05, 1) * 0.8})`; c.lineWidth = 1.5 + s.A * 1.6; c.beginPath(); c.arc(SPK.x, SPK.y, r, -1.45, -0.05); c.stroke(); }
      c.restore();
      // the speaker cone moving in and out
      const cz = 1 + s.cone * 0.05; c.fillStyle = '#1a1018'; c.beginPath(); c.arc(SPK.x, SPK.y, 26, 0, 7); c.fill();
      const cg = c.createRadialGradient(SPK.x - 4, SPK.y - 4, 2, SPK.x, SPK.y, 22 * cz); cg.addColorStop(0, '#8a8a9a'); cg.addColorStop(1, '#2a2a3a'); c.fillStyle = cg; c.beginPath(); c.arc(SPK.x, SPK.y, 22 * cz, 0, 7); c.fill();
      c.fillStyle = '#c8c8d8'; c.beginPath(); c.arc(SPK.x, SPK.y, 7 * cz, 0, 7); c.fill();
      // the sleepers
      for (const w of s.who) {
        const fall = t - w.fallT < 1.4 ? (t - w.fallT) / 1.4 : -1; let y = w.y, rot = 0;
        if (fall >= 0) { const k = fall < 0.35 ? fall / 0.35 : fall < 0.75 ? 1 : 1 - (fall - 0.75) / 0.25; y = w.y + Math.sin(Math.min(1, k) * Math.PI / 2) * 60 * w.s + (fall < 0.35 ? -Math.sin(fall / 0.35 * Math.PI) * 20 : 0); rot = fall < 0.75 ? Math.sin(fall * 30) * 0.4 : 0; }
        c.save(); c.translate(w.x, y); c.rotate(rot);
        const awake = !!w.awake, react = awake && t - w.awake < 0.8;
        SK.animal(c, w.kind, 0, 0, w.s, { t, phase: w.x, pose: awake ? (won ? 'cheer' : 'wave') : fall >= 0 ? 'hop' : 'idle', expr: react || fall >= 0 ? 'wow' : awake ? 'happy' : 'laugh', noShadow: true });
        c.restore();
        if (!awake && fall < 0) {
          zzz(c, w.x + 14 * w.s, w.y - 64 * w.s, t + w.x, w.s);
          // how loud the sound is where this sleeper is: a little meter of three dots
          const k = SK.clamp(w.hear / s.band[0], 0, 1.5);
          if (w.prog > 0) { c.save(); c.strokeStyle = '#ffd45a'; c.lineWidth = 3; c.beginPath(); c.arc(w.x, w.y - 32 * w.s, 30 * w.s + 6, -Math.PI / 2, -Math.PI / 2 + w.prog * Math.PI * 2); c.stroke(); c.restore(); }
          if (k > 0.6) { c.save(); c.globalAlpha = SK.clamp((k - 0.6) * 2, 0, 0.8); c.strokeStyle = w.hear > s.band[1] ? '#ff6a6a' : '#a0ffd2'; c.lineWidth = 2; for (const sd of [-1, 1]) { c.beginPath(); c.arc(w.x, w.y - 30 * w.s, 34 * w.s + 4, sd < 0 ? Math.PI - 0.4 : -0.4, sd < 0 ? Math.PI + 0.4 : 0.4); c.stroke(); } c.restore(); }
        }
      }
      // the wave on the screen
      c.save(); c.beginPath(); c.roundRect(SCR.x0, SCR.y0, SCR.x1 - SCR.x0, SCR.y1 - SCR.y0, 10); c.clip();
      const yA = s.A * APX, path = () => { c.beginPath(); for (let x = SCR.x0; x <= SCR.x1; x += 2) { const y = SCR.mid - Math.sin((x - SCR.x0) / s.lam * Math.PI * 2 + Math.PI / 2 * 0 - s.ph * 0) * 0 - Math.cos((x - SCR.x0 - s.lam / 4) / s.lam * Math.PI * 2) * yA; x === SCR.x0 ? c.moveTo(x, y) : c.lineTo(x, y); } };
      c.strokeStyle = 'rgba(120,255,200,0.3)'; c.lineWidth = 10; path(); c.stroke(); c.strokeStyle = '#a0ffd2'; c.lineWidth = 3.5; path(); c.stroke();
      c.restore();
      // levels 0 and 1: a dashed line at the height that wakes the next sleeper
      const nx = s.who.find(w => !w.awake);
      if (nx && g.level < 2 && !g.done) { const yy = SCR.mid - (s.band[0] + s.band[1]) / 2 / nx.att * APX; c.save(); c.strokeStyle = 'rgba(255,226,122,0.7)'; c.lineWidth = 2; c.setLineDash([6, 6]); c.lineDashOffset = -t * 20; c.beginPath(); c.moveTo(SCR.x0 + 6, yy); c.lineTo(SCR.x1 - 6, yy); c.stroke(); c.restore(); }
      SK.tag(c, 'Sound wave', 262, SCR.y0 - 24, 18);
      // the handle on the first crest
      const hx = crestX(s), hy = SCR.mid - yA; SK.ball(c, hx, hy, 13, '#ffd45a', { edge: '#7a4a10' });
      c.strokeStyle = 'rgba(255,212,90,0.6)'; c.lineWidth = 2; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(hx, hy + 14); c.lineTo(hx, SCR.mid); c.stroke(); c.setLineDash([]);
      if (!g.done) SK.glow(c, g, hx, hy, 22, undefined, { level: 2 });
      const tgt = s.who.find(w => !w.awake); if (tgt) SK.demo(g, c, 'drag', [hx, hy], [hx, SCR.mid - ((s.band[0] + s.band[1]) / 2 / tgt.att) * APX]);
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done) return; const w = s.who.find(q => !q.awake); if (!w) return;
      const want = (s.band[0] + s.band[1]) / 2 / w.att; if (!s.drag && Math.abs(want - s.A) < 0.05) return;
      if (!s._bb || s._bb.w !== w.x) s._bb = { w: w.x, t: Math.max(1.0, g.t + 0.1), a: [crestX(s), SCR.mid - s.A * APX] };
      SK.bot.drag(g, synth, 'amp' + w.x, s._bb.t, s._bb.a, [s._bb.a[0], SCR.mid - want * APX], 0.35);
    },
  });
  function crestX(s) { return SCR.x0 + s.lam / 4; }
})();
