// FUZZ! (earth_eng EE-30) — a night-club stage: the fox strums, the guitar's wave runs through an amp onto a big
// screen with the power rails drawn as two glowing bars. Turn the gain knob up: the wave grows until its tops hit the
// rails and are sliced flat, the sound turns to buzzing fuzz and the crowd head-bangs. Leave it low: a gentle lullaby
// and the crowd dozes off. Three songs in a row, each on a different instrument (guitar, bass, ukulele) with a different
// signal size, and the stagehand resets the knob between songs, so each needs its own turn. Level 2: a bigger power
// supply (rails farther apart), so every instrument needs more gain.
const SC = { x0: 30, x1: 330, y0: 128, y1: 300 }, CY = 214, AMP = { x: 70, y: 318, w: 220, h: 148 };
const CFG = [ // rail height above the centre line (px), the guitar's wave size (px), the most gain the knob gives
  { R: 56, A: 18, gmax: 9.5 }, { R: 64, A: 17, gmax: 11 }, { R: 74, A: 15, gmax: 14 },
];
const SONGS = [ // each instrument's signal size (times the level's A), how fast it wiggles on the screen, and its look
  { A: 1, f: 3.4, col: '#d8283a', sc: 1.35, neck: 78 }, { A: 1.5, f: 2.1, col: '#2a6ad8', sc: 1.5, neck: 96 }, { A: 0.5, f: 5.4, col: '#d89a4a', sc: 0.95, neck: 46 },
];
const STRUM = 0.62, SPEED = 230; // seconds per strum; how fast the trace scrolls (px/s)
const wav = th => (Math.sin(th) + 0.38 * Math.sin(2 * th + 0.6) + 0.18 * Math.sin(3 * th + 1.3)) / 1.32; // a guitar-ish shape
const env = tau => { const p = ((tau % STRUM) + STRUM) % STRUM; return 0.78 + 0.22 * Math.exp(-p * 5); };
function paintClub(o) {
  const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#120c2a'); bg.addColorStop(0.55, '#2a1448'); bg.addColorStop(1, '#3c1a40'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  const rnd = P.rng(31); // brick wall behind the stage
  for (let y = 0; y < 480; y += 22) for (let x = (y / 22) % 2 ? -20 : 0; x < 360; x += 44) { o.fillStyle = `rgba(${90 + rnd() * 40},${40 + rnd() * 20},${80 + rnd() * 30},${0.18 + rnd() * 0.1})`; o.fillRect(x + 1, y + 1, 42, 20); }
  for (const [x, col] of [[60, 'rgba(255,80,200,0.16)'], [300, 'rgba(80,220,255,0.14)']]) { // spotlight cones
    const gr = o.createLinearGradient(x, 0, 180, 560); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); o.fillStyle = gr; o.beginPath(); o.moveTo(x - 14, 0); o.lineTo(x + 14, 0); o.lineTo(x < 180 ? 300 : 200, 600); o.lineTo(x < 180 ? 120 : 40, 600); o.closePath(); o.fill();
  }
  // the stage floor
  const fl = o.createLinearGradient(0, 470, 0, 640); fl.addColorStop(0, '#5a3426'); fl.addColorStop(1, '#2a160e'); o.fillStyle = fl; o.fillRect(0, 470, 360, 170);
  o.strokeStyle = 'rgba(0,0,0,0.3)'; o.lineWidth = 2; for (let x = -40; x < 400; x += 46) { o.beginPath(); o.moveTo(x, 470); o.lineTo(x - 30, 640); o.stroke(); }
  o.fillStyle = 'rgba(255,220,160,0.12)'; o.fillRect(0, 470, 360, 4);
  // the scope's bezel and glass
  o.fillStyle = '#20202a'; o.beginPath(); o.roundRect(SC.x0 - 12, SC.y0 - 12, SC.x1 - SC.x0 + 24, SC.y1 - SC.y0 + 24, 18); o.fill();
  o.strokeStyle = '#4a4a58'; o.lineWidth = 3; o.stroke();
  const gl = o.createRadialGradient(180, CY, 20, 180, CY, 200); gl.addColorStop(0, '#0e3a2c'); gl.addColorStop(1, '#06180f'); o.fillStyle = gl; o.beginPath(); o.roundRect(SC.x0, SC.y0, SC.x1 - SC.x0, SC.y1 - SC.y0, 10); o.fill();
  o.strokeStyle = 'rgba(120,255,180,0.09)'; o.lineWidth = 1; for (let x = SC.x0 + 30; x < SC.x1; x += 30) { o.beginPath(); o.moveTo(x, SC.y0); o.lineTo(x, SC.y1); o.stroke(); } for (let y = CY - 80; y <= CY + 80; y += 20) { o.beginPath(); o.moveTo(SC.x0, y); o.lineTo(SC.x1, y); o.stroke(); }
  o.strokeStyle = 'rgba(120,255,180,0.22)'; o.beginPath(); o.moveTo(SC.x0, CY); o.lineTo(SC.x1, CY); o.stroke();
  // wire from the amp up into the scope
  o.strokeStyle = '#111'; o.lineWidth = 6; o.lineCap = 'round'; o.beginPath(); o.moveTo(270, AMP.y + 4); o.bezierCurveTo(300, 310, 320, 312, 318, SC.y1 + 10); o.stroke();
  // the amp: tolex box, gold panel, cloth grille
  const { x, y, w, h } = AMP;
  SK.shadow(o, x + w / 2, y + h + 4, w * 0.55, 10, 0.5);
  o.fillStyle = '#2a1e1a'; o.beginPath(); o.roundRect(x, y, w, h, 14); o.fill();
  o.fillStyle = '#c9a25a'; o.beginPath(); o.roundRect(x + 10, y + 10, w - 20, 82, 8); o.fill();
  o.fillStyle = 'rgba(255,255,255,0.25)'; o.fillRect(x + 14, y + 13, w - 28, 4);
  o.fillStyle = '#e8dcc0'; o.beginPath(); o.roundRect(x + 10, y + 98, w - 20, h - 108, 8); o.fill();
  o.strokeStyle = 'rgba(120,90,60,0.35)'; o.lineWidth = 1; for (let i = x + 12; i < x + w - 10; i += 5) { o.beginPath(); o.moveTo(i, y + 100); o.lineTo(i + 6, y + h - 12); o.stroke(); }
  // input jack and a red power light
  o.fillStyle = '#222'; o.beginPath(); o.arc(x + 32, y + 52, 9, 0, 7); o.fill(); o.fillStyle = '#888'; o.beginPath(); o.arc(x + 32, y + 52, 4, 0, 7); o.fill();
  o.fillStyle = '#ff3a3a'; o.beginPath(); o.arc(x + w - 30, y + 52, 6, 0, 7); o.fill(); o.fillStyle = 'rgba(255,120,120,0.4)'; o.beginPath(); o.arc(x + w - 30, y + 52, 11, 0, 7); o.fill();
}
function guitar(c, x, y, rot, strum, so) { // the instrument held across the fox: guitar, bass or ukulele
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(so.sc, so.sc);
  c.fillStyle = '#7a4a22'; c.fillRect(0, -4, so.neck, 8); c.fillStyle = '#3a2210'; c.fillRect(so.neck - 4, -7, 16, 14);
  c.fillStyle = so.col; c.strokeStyle = '#5a0a14'; c.lineWidth = 2.5; c.beginPath(); c.ellipse(-14, 0, 24, 19, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.ellipse(8, 0, 16, 14, 0, 0, 7); c.fill(); c.stroke();
  c.fillStyle = '#fff6ea'; c.beginPath(); c.ellipse(-12, 6, 10, 6, 0.3, 0, 7); c.fill();
  c.strokeStyle = 'rgba(255,240,200,0.9)'; c.lineWidth = 1; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(-26, i * 2 + Math.sin(strum * 40 + i) * strum * 2); c.lineTo(so.neck + 10, i * 1.3); c.stroke(); }
  c.restore();
}
MG.add({
  id: 'fuzz', stage: 'circuits', cmd: 'TURN UP THE GAIN FOR FUZZ!', time: 7, mood: 'night', winText: 'Tops squashed flat!', failText: 'Zzz...',
  card: { title: 'Too much gain clips the wave', kind: 'Engineering', ref: 'Amplifier clipping',
    text: 'An amplifier makes a signal bigger. The gain knob sets how many times bigger. The amplifier gets its power from a supply with a top voltage and a bottom voltage, called the rails, and its output can never go past them.\n\nTurn the gain up far enough and the peaks of the wave hit the rails and are sliced flat. A flat-topped wave holds extra high, buzzy tones that the smooth wave did not have. Guitar players clip on purpose to get fuzz. In a phone call or a recording, the same clipping is unwanted distortion.',
    note: "An amplifier's output can't go past its power rails, so too much gain slices the wave's tops flat and makes it buzz." },
  init(g) {
    const s = g.s, L = CFG[Math.min(2, g.level)];
    s.L = L; s.kn = B6.knob(180, AMP.y + 52, 30, 0.06); s.fz = 0; s.song = 0; s.songT0 = 0; s.swap = 0; s.nextStrum = 0.3; s.strum = 0; s.sleep = 0; s.bang = 0;
  },
  down(g, x, y) { SK.touched(g); if (!g.done) B6.knobDown(g, g.s.kn, x, y); },
  move(g, x, y) { if (!g.done) B6.knobMove(g, g.s.kn, x, y); },
  up(g) { B6.knobUp(g.s.kn); },
  update(g, dt) {
    const s = g.s, L = s.L, gain = 1 + (L.gmax - 1) * s.kn.k, so = SONGS[s.song], peak = gain * L.A * so.A, fuzzy = s.swap <= 0 && peak >= L.R * 1.3;
    s.gain = gain; s.fuzzy = fuzzy; s.strum = Math.max(0, s.strum - dt * 3);
    if (g.t >= s.nextStrum) { s.nextStrum += STRUM; s.strum = 1; if (!g.done || g.result === 'win') { if (fuzzy) { g.sfx('buzz', { pitch: 0.55, vol: 0.7 }); g.sfx('harp', { pitch: 0.5, vol: 0.5 }); } else g.sfx('harp', { pitch: 0.5, vol: 0.35 + 0.4 * Math.min(1, peak / L.R) }); } }
    if (g.done) { if (g.result === 'win') s.bang += dt; else s.sleep = Math.min(1, s.sleep + dt); return; }
    s.swap = Math.max(0, s.swap - dt);
    s.fz = fuzzy ? s.fz + dt : Math.max(0, s.fz - dt * 2);
    s.sleep = fuzzy ? Math.max(0, s.sleep - dt * 3) : Math.min(0.7, s.sleep + dt * 0.12 * (peak < L.R ? 1 : 0.3));
    if (fuzzy) s.bang += dt;
    if (s.fz >= 0.45) {
      g.burst(180, CY, ['#ff5ad0', '#5ae0ff', '#ffe27a'], 26, 220); g.shake(4, 0.3);
      if (s.song >= SONGS.length - 1) { g.win(); g.sfx('cheer'); return; }
      s.song++; s.songT0 = g.t; s.swap = 0.45; s.fz = 0; s.kn.k = 0.04; s.kn.grab = null; g.sfx('clap'); g.sfx('swoosh'); // the stagehand swaps the instrument and turns the amp back down
    }
  },
  draw(g, c) {
    const s = g.s, L = s.L, t = g.t, gain = s.gain || 1, so = SONGS[s.song];
    c.drawImage(g.bake('fuzz_club', paintClub), 0, 0, 360, 640);
    B6.motes(c, t, 18, 7, [0, 0, 360, 470], 'rgba(255,220,255,0.8)');
    // rails: the power supply's top and bottom, as glowing bars
    const top = CY - L.R, bot = CY + L.R, hit = s.fuzzy ? 1 : 0;
    for (const [yy, col] of [[top, '#ff6a4a'], [bot, '#4ab0ff']]) {
      c.save(); c.globalAlpha = 0.55 + 0.4 * hit * (0.5 + 0.5 * Math.sin(t * 30)); c.fillStyle = col; c.fillRect(SC.x0, yy - 4, SC.x1 - SC.x0, 8); c.restore();
    }
    c.save(); c.font = '900 20px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ff8a6a'; c.fillText('+', SC.x0 + 12, top - 13); c.fillStyle = '#7ac8ff'; c.fillText('−', SC.x0 + 12, bot + 13); c.restore();
    // the wave: the clipped output, plus a faint ghost of what was sliced off beyond the rails
    c.save(); c.beginPath(); c.roundRect(SC.x0, SC.y0, SC.x1 - SC.x0, SC.y1 - SC.y0, 10); c.clip();
    const pts = [];
    for (let px = SC.x0; px <= SC.x1; px += 2) { const tau = t - (SC.x1 - px) / SPEED, v = gain * L.A * so.A * env(tau) * wav(tau * so.f * Math.PI * 2) * (1 - s.swap / 0.45); pts.push([px, v]); }
    c.strokeStyle = 'rgba(180,255,200,0.22)'; c.lineWidth = 2; c.setLineDash([4, 5]); c.beginPath(); pts.forEach(([px, v], i) => i ? c.lineTo(px, CY - v) : c.moveTo(px, CY - v)); c.stroke(); c.setLineDash([]);
    for (const [w, a] of [[9, 0.18], [3.5, 1]]) { c.strokeStyle = `rgba(140,255,170,${a})`; c.lineWidth = w; c.lineJoin = 'round'; c.beginPath(); pts.forEach(([px, v], i) => { const y = CY - SK.clamp(v, -L.R, L.R); i ? c.lineTo(px, y) : c.moveTo(px, y); }); c.stroke(); }
    // the flattened tops, painted hot red where the wave is squashed against a rail
    c.strokeStyle = '#ff4a5a'; c.lineWidth = 6; c.lineCap = 'round'; for (let i = 1; i < pts.length; i++) { const [x0, v0] = pts[i - 1], [x1, v1] = pts[i]; if (Math.abs(v0) > L.R && Math.abs(v1) > L.R && Math.sign(v0) === Math.sign(v1)) { const y = v1 > 0 ? top : bot; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); } }
    // sparks where the wave grinds along a rail
    for (let i = 0; i < pts.length; i += 6) { const [px, v] = pts[i]; if (Math.abs(v) > L.R) { const y = v > 0 ? top : bot, f = Math.sin(px * 1.7 + t * 40); c.fillStyle = v > 0 ? '#ffd0a0' : '#c0e8ff'; c.beginPath(); c.arc(px, y + f * 2, 2 + Math.abs(f) * 2, 0, 7); c.fill(); } }
    c.restore();
    SK.tag(c, 'Power rail', SC.x1 - 62, top + 20, 18, '#ffd0c0'); SK.tag(c, 'Power rail', SC.x1 - 62, bot - 20, 18, '#c8e8ff');
    // the gain knob
    if (!s.kn.grab) SK.grab(c, g, s.kn.x, s.kn.y, 44); SK.tag(c, 'Gain', s.kn.x + 70, s.kn.y, 18); SK.tag(c, 'Amplifier', 180, AMP.y + 114, 18);
    B6.drawKnob(c, s.kn, { col: '#2a2420', cap: '#e8d8b0', arc: s.fuzzy ? '#ff5ad0' : '#ffb43a' });
    // the speaker grille thumps with the sound
    const thump = s.strum * Math.min(1, gain * L.A * so.A / L.R);
    c.save(); c.globalAlpha = 0.18 * thump; c.fillStyle = s.fuzzy ? '#ff5ad0' : '#ffe8a0'; c.beginPath(); c.ellipse(180, AMP.y + 124, 92 + thump * 6, 20 + thump * 3, 0, 0, 7); c.fill(); c.restore();
    // the fox and its guitar, cable to the amp
    const won = g.result === 'win', lost = g.result === 'fail', bob = Math.sin(t * (s.fuzzy || won ? 14 : 4)) * (s.fuzzy || won ? 5 : 1.5);
    c.strokeStyle = '#111'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(AMP.x + 32, AMP.y + 52); c.bezierCurveTo(30, 380, 20, 560, 50, 570); c.stroke();
    SK.animal(c, 'fox', 84, 606 + bob * 0.3, 1.5, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : s.fuzzy ? 'laugh' : 'happy' });
    const sw = s.swap / 0.45; guitar(c, 74 - sw * 140, 556 + bob * 0.3, -0.5, s.strum, so);
    for (let i = 0; i < SONGS.length; i++) { c.fillStyle = i < s.song || g.result === 'win' ? '#ffe27a' : 'rgba(255,255,255,0.25)'; c.beginPath(); c.arc(156 + i * 24, AMP.y + 140, 6, 0, 7); c.fill(); } // songs played
    // the crowd: head-banging to the fuzz, or nodding off to the lullaby
    const crowd = [['hedgehog', 208, 608, 1.05, 0], ['rabbit', 266, 602, 1.0, 1.3], ['duck', 322, 608, 0.95, 2.1]];
    for (const [kind, x, y, sc, ph] of crowd) {
      const rock = (s.fuzzy || won) ? Math.abs(Math.sin(t * 12 + ph)) * 10 : 0, zz = lost ? 1 : s.sleep;
      c.save(); c.translate(x, y - rock); c.rotate(zz * 0.25 * (ph % 2 ? 1 : -1)); SK.animal(c, kind, 0, 0, sc, { t, pose: won ? 'cheer' : (s.fuzzy ? 'hop' : 'idle'), expr: won || s.fuzzy ? 'laugh' : zz > 0.45 ? 'sad' : 'happy', facing: -1 }); c.restore();
      if (zz > 0.3) { c.save(); c.globalAlpha = Math.min(1, (zz - 0.3) * 3); c.fillStyle = '#d8d0ff'; c.font = '900 20px Nunito, system-ui, sans-serif'; for (let i = 0; i < 3; i++) { const k = ((t * 0.6 + i / 3 + ph) % 1); c.globalAlpha = Math.min(1, (zz - 0.3) * 3) * (1 - k); c.fillText('z', x + 12 + k * 18, y - 96 - k * 40); } c.restore(); }
    }
    // stage lights flash on a win
    if (won) { c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.18 + 0.12 * Math.sin(t * 20); c.fillStyle = Math.sin(t * 7) > 0 ? '#ff5ad0' : '#5ae0ff'; c.fillRect(0, 0, 360, 640); c.restore(); }
    // guidance: turn the knob up, over the top
    SK.demo(g, c, 'drag', [s.kn.x - 44, s.kn.y + 18], [s.kn.x + 44, s.kn.y + 18], { arc: 66 });
  },
  auto(g, dt, synth) { const s = g.s; B6.botTurn(g, synth, s.kn, 'turn' + s.song, s.song ? s.songT0 + 0.55 : 1.1, 0.97, 0.45); },
});
