// STOP THE HOWL! (earth_eng SC-04) — a stage seen from above, with three loudspeakers. Three singers stand with their
// microphones too close to a speaker; as each one starts to sing, a squeal builds: the speaker's sound reaches the mic,
// comes out of the speaker louder, reaches the mic again, louder still, so the rings between them grow every lap.
// Drag each singer (and mic) back until the rings shrink and die away. Let one run away and the whole stage screeches
// and the bird covers its ears. Level 2: louder speakers, so the mics must go farther, and the squeals build faster.
const SPK = [[60, 200], [300, 214], [180, 540]], STAGE = { x0: 24, x1: 336, y0: 140, y1: 596 };
const CFG = [{ c: 6400, grow: 2.1, live: [1.2, 2.6, 4.0] }, { c: 7200, grow: 1.8, live: [1.0, 2.2, 3.4] }, { c: 8100, grow: 1.7, live: [0.8, 1.7, 2.6] }];
const START = [[116, 256], [246, 266], [184, 468]], SINGERS = ['bird', 'duck', 'frog'], SAFE = [[110, 330], [250, 344], [128, 432]];
function loopGain(c, x, y) { let G = 0; for (const [a, b] of SPK) G += c / Math.max(400, (x - a) ** 2 + (y - b) ** 2); return G; } // sound fades with distance squared
function paintStage(o) {
  const fl = o.createLinearGradient(0, 0, 0, 640); fl.addColorStop(0, '#3a2440'); fl.addColorStop(1, '#2a1830'); o.fillStyle = fl; o.fillRect(0, 0, 360, 640);
  o.fillStyle = '#7a4a2a'; o.beginPath(); o.roundRect(STAGE.x0, STAGE.y0, STAGE.x1 - STAGE.x0, STAGE.y1 - STAGE.y0, 18); o.fill();
  o.strokeStyle = 'rgba(40,20,10,0.35)'; o.lineWidth = 2; for (let x = STAGE.x0 + 26; x < STAGE.x1; x += 26) { o.beginPath(); o.moveTo(x, STAGE.y0); o.lineTo(x, STAGE.y1); o.stroke(); }
  for (const [x, y, col] of [[120, 300, 'rgba(255,120,200,0.14)'], [240, 380, 'rgba(120,200,255,0.14)'], [170, 460, 'rgba(255,230,120,0.12)']]) { const gr = o.createRadialGradient(x, y, 10, x, y, 120); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); o.fillStyle = gr; o.fillRect(0, 0, 360, 640); }
  o.strokeStyle = '#c8a04a'; o.lineWidth = 4; o.beginPath(); o.roundRect(STAGE.x0, STAGE.y0, STAGE.x1 - STAGE.x0, STAGE.y1 - STAGE.y0, 18); o.stroke();
  // loudspeakers seen from above: black cabinets with two cones each
  for (const [x, y] of SPK) {
    SK.shadow(o, x + 4, y + 30, 32, 8, 0.4);
    o.fillStyle = '#16141a'; o.beginPath(); o.roundRect(x - 28, y - 30, 56, 60, 8); o.fill(); o.strokeStyle = '#4a4650'; o.lineWidth = 3; o.stroke();
    for (const [dy, r] of [[-12, 11], [12, 14]]) { const gr = o.createRadialGradient(x - 3, y + dy - 3, 1, x, y + dy, r); gr.addColorStop(0, '#6a6670'); gr.addColorStop(1, '#2a2830'); o.fillStyle = gr; o.beginPath(); o.arc(x, y + dy, r, 0, 7); o.fill(); o.fillStyle = '#111'; o.beginPath(); o.arc(x, y + dy, r * 0.3, 0, 7); o.fill(); }
  }
}
MG.add({
  id: 'howl', stage: 'robots', cmd: 'STOP THE HOWL!', time: 6, mood: 'party', winText: 'Feedback!', failText: 'SCREECH!',
  card: { title: 'When each echo comes back bigger', kind: 'Control', ref: 'Positive feedback (audio feedback)',
    text: 'A microphone picks up sound, an amplifier makes it louder, and a loudspeaker plays it. If the speaker\'s sound reaches the microphone again, it goes round the loop again. That is called feedback.\n\nWhen the microphone is close, each trip round comes back louder than the last, and in a moment it becomes a howl. Move the microphone away and each trip comes back quieter, so the sound dies out. The test is whether one trip round the loop makes the sound bigger or smaller. The same rule decides whether any feedback loop, in a robot, a market or a climate, settles down or runs away.',
    note: 'A feedback loop runs away when each trip round makes the signal bigger, and dies down when it makes it smaller.' },
  init(g) {
    const s = g.s, C = CFG[Math.min(2, g.level)]; s.C = C;
    s.mics = START.map(([x, y], i) => ({ x, y, hx: x, hy: y, kind: SINGERS[i], live: C.live[i], a: 0, G: 0, calm: false, peak: 0 }));
    s.lap = 0; s.squeal = 0; s.screech = 0;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; const m = SK.pick(s.mics, x, y, 52); if (m) { SK.dragStart(g, m, x, y); g.sfx('tap'); } },
  move(g, x, y) { const m = SK.dragMove(g, x, y); if (m) { m.x = SK.clamp(m.x, STAGE.x0 + 20, STAGE.x1 - 20); m.y = SK.clamp(m.y, STAGE.y0 + 30, STAGE.y1 - 16); } },
  up(g) { SK.dragEnd(g); },
  update(g, dt) {
    const s = g.s, C = s.C; s.lap += dt;
    if (g.done) { if (g.result === 'fail') s.screech += dt; return; }
    let loud = 0;
    for (const m of s.mics) {
      m.G = loopGain(C.c, m.x, m.y);
      if (g.t < m.live) continue;
      if (!m.a && !m.calm) m.a = 0.08; // the first note reaches the speaker
      if (m.G > 1) { m.a = Math.max(m.a, 0.04) * Math.exp(C.grow * (m.G - 1) * dt); m.calm = false; }
      else { m.a *= Math.exp(-(2.5 * (1 - m.G) + 0.4) * dt); if (m.a < 0.04) { if (!m.calm) { g.sfx('chime', { vol: 0.5 }); } m.calm = true; m.a = 0; } }
      m.peak = Math.max(m.peak, m.a); loud = Math.max(loud, m.a);
      if (m.a >= 1) { s.screech = 0.001; g.sfx('stretch', { pitch: 3, vol: 1.2 }); g.sfx('buzz', { pitch: 3.5, vol: 1 }); g.shake(7, 0.5); g.fail(); return; }
    }
    if (loud > 0.15 && Math.floor((s.lap - dt) * 4) !== Math.floor(s.lap * 4)) g.sfx('buzz', { pitch: 2 + loud * 2, vol: 0.2 + loud * 0.7 });
    if (s.mics.every(m => g.t >= m.live && m.calm && m.G < 1)) { g.win(); g.sfx('cheer'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('howl_stage', paintStage), 0, 0, 360, 640);
    // the loop for each live mic: rings travel from the nearest speaker to the mic, each lap bigger if the loop gain is over 1
    for (const m of s.mics) {
      if (t < m.live || (m.calm && !lost)) continue;
      let best = SPK[0], bd = 1e9; for (const p of SPK) { const d = SK.dist(p[0], p[1], m.x, m.y); if (d < bd) { bd = d; best = p; } }
      const a = Math.min(1, m.a), run = m.G > 1;
      if (run) { const mx = (best[0] + m.x) / 2, my = (best[1] + m.y) / 2, R = 40 + 90 * a; const gr = c.createRadialGradient(mx, my, 4, mx, my, R); gr.addColorStop(0, `rgba(255,70,50,${0.15 + 0.5 * a})`); gr.addColorStop(1, 'rgba(255,70,50,0)'); c.fillStyle = gr; c.beginPath(); c.arc(mx, my, R, 0, 7); c.fill(); }
      for (let i = 0; i < 4; i++) {
        const k = ((t * 2.2 + i / 4) % 1), x = SK.lerp(best[0], m.x, k), y = SK.lerp(best[1], m.y, k), r = 10 + k * 16 + a * 30 * (run ? (0.6 + 0.4 * k) : (1 - 0.6 * k));
        c.strokeStyle = run ? `rgba(255,${200 - 160 * a},${120 - 100 * a},${0.25 + 0.6 * a})` : `rgba(140,220,255,${0.2 + 0.5 * a})`; c.lineWidth = 3 + a * 6;
        const ang = Math.atan2(m.y - best[1], m.x - best[0]); c.beginPath(); c.arc(x, y, r, ang - 0.9, ang + 0.9); c.stroke();
      }
      if (a > 0.3) { c.save(); c.translate(m.x, m.y - 30); c.strokeStyle = '#ff5a3a'; c.lineWidth = 3; c.beginPath(); for (let i = 0; i < 9; i++) { const r = (i % 2 ? 12 : 24) * (0.6 + a * 0.6) + Math.sin(t * 40 + i) * 2, aa = i / 8 * Math.PI * 2; c.lineTo(Math.cos(aa) * r, Math.sin(aa) * r); } c.closePath(); c.stroke(); c.restore(); }
    }
    // singers and their mic stands (drawn back to front)
    const order = s.mics.slice().sort((p, q) => p.y - q.y);
    for (const m of order) {
      const singing = t >= m.live, a = Math.min(1, m.a), shake = a > 0.3 && !won ? Math.sin(t * 60) * a * 3 : 0;
      SK.shadow(c, m.x, m.y + 2, 26, 7, 0.3);
      c.strokeStyle = '#2a2a30'; c.lineWidth = 4; c.beginPath(); c.moveTo(m.x + 16, m.y); c.lineTo(m.x + 16, m.y - 52); c.lineTo(m.x + 4, m.y - 60); c.stroke();
      c.fillStyle = '#3a3a44'; c.beginPath(); c.ellipse(m.x + 3, m.y - 62, 6, 8, -0.5, 0, 7); c.fill(); c.fillStyle = '#8a8a96'; c.beginPath(); c.ellipse(m.x + 2, m.y - 64, 4, 5, -0.5, 0, 7); c.fill();
      const ears = lost || a > 0.55; SK.animal(c, m.kind, m.x - 10 + shake, m.y, m.kind === 'bird' ? 1.45 : 1.15, { t, pose: won ? 'cheer' : ears ? 'sad' : singing ? 'wave' : 'idle', expr: won ? 'laugh' : ears ? 'wow' : singing ? 'happy' : 'think', facing: 1 });
      if (singing && !m.calm && !g.done && SK.dragging(g) !== m) SK.glow(c, g, m.x, m.y - 30, 40);
      if (m.calm && !lost) { c.fillStyle = '#7aff9a'; c.font = '900 22px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.fillText('♪', m.x + 26 + Math.sin(t * 3) * 3, m.y - 74); }
    }
    if (lost) { const k = Math.min(1, s.screech * 4); c.fillStyle = `rgba(255,60,60,${0.12 * k + 0.08 * Math.sin(t * 40)})`; c.fillRect(0, 0, 360, 640); }
    // guidance: drag the first squealing singer away from its speaker, to a quiet spot (shown as a dashed ring)
    const m0 = s.mics.find(m => t >= m.live && !m.calm); if (m0 && !g.done) { const i = s.mics.indexOf(m0); c.save(); c.strokeStyle = 'rgba(140,230,255,0.55)'; c.lineWidth = 3; c.setLineDash([7, 6]); c.lineDashOffset = -t * 20; c.beginPath(); c.ellipse(SAFE[i][0], SAFE[i][1], 30, 12, 0, 0, 7); c.stroke(); c.restore(); }
    if (m0) { const i = s.mics.indexOf(m0); SK.demo(g, c, 'drag', [m0.hx, m0.hy - 30], [SAFE[i][0], SAFE[i][1] - 30], { delay: m0.live }); }
  },
  auto(g, dt, synth) {
    const s = g.s; s.mics.forEach((m, i) => { SK.bot.drag(g, synth, 'm' + i, m.live + 0.2, [m.hx, m.hy - 20], [SAFE[i][0], SAFE[i][1] - 20], 0.35); });
  },
});
