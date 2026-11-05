// Renders the Q.E.D.! promo video: node promo/render.js PAGE.html OUT
// Same approach as Holy Moly!'s promo: the real game is played live in headless Chromium, one 30 fps frame at a time
// on the game's own clock (test mode, HM.step), with a slow camera move on every shot and hard cuts, each with a short
// white flash, on the music's 1.6 s bars (150 BPM). No narration and no caption text: the game's title screen,
// microgames whose working animates step by step (grade 3 to college), one card, and an end card with the address.
// Build the page first: python3 src/build.py PAGE.html
// Output: OUT/qed-promo.mp4 (1080x1920, 30 fps, with music), OUT/video.mp4 (no audio), OUT/stills/<n>-<id>.jpg,
// OUT/contact.jpg.
// PROMO_ONLY=regroup,title renders only those shots (for checking frames); PROMO_STILLS=1 saves stills (and three
// check frames per shot in OUT/check/) and skips encoding.
// Music is a separate last step: PROMO_MUSIC=track.mp3 picks the track (default OUT/music/playful_marimba.mp3; it plays
// from its start, faded at the end). Without a track the video is left silent. PROMO_MUX=1 skips the rendering and only
// muxes the music into an existing OUT/video.mp4.
const {chromium} = require('playwright'); const fs = require('fs'), path = require('path'), {execFileSync} = require('child_process');
const [html, out = '/tmp/qed-promo'] = process.argv.slice(2);
const BAR = 1.6, FPS = 30;
const MUSIC = process.env.PROMO_MUSIC || path.join(out, 'music', 'playful_marimba.mp3');
const ff = (...a) => execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...a]);
for (const d of ['segs', 'stills']) fs.mkdirSync(path.join(out, d), {recursive: true});

// Shots, in bars of 1.6 s. mg: a microgame (its id in the build) played by its bot from `from` seconds in, chosen so the
// shot lands on its working. Music map (playful_marimba): soft start, groove from 2 s, a lift at 32.0 s, a dip around
// 40-44 s, ending at 58-60 s. Grade 3 to algebra before the lift; calculus and college math after it.
const SHOTS = [
  {id: 'title', title: true, first: true, bars: 2},   // the first frame is the preview image: the logo over the meadow, no flash
  // grade 3 to algebra
  {id: 'regroup', mg: 'regroup', bars: 2, from: 0.3},            // 36 + 37: the column adds up "6 + 7 = 13", the 3 drops, the 1 arcs over
  {id: 'area', mg: 'geometry_area', bars: 2, from: 1.25},        // A = 6 × 4, then rows of grass sprout and count up to 24
  {id: 'multiply', mg: 'multiply', bars: 1, from: 0.55},         // 4 × 9 = 36: the 6 drops, the 3 is carried up to the tens
  {id: 'division', mg: 'longway_division', bars: 1, from: 0.8},  // 88 ÷ 4: 2 × 4 = 8, 8 − 8 = 0, bring down
  {id: 'mixed', mg: 'fractions_mixed', bars: 1, from: 0.45},     // 7/3: three thirds make a whole, then another: 2 1/3
  {id: 'common', mg: 'common', bars: 1, from: 3.2},              // 4/8 + 1/8 = 5/8, the pies fill in
  {id: 'distribute', mg: 'distribute', bars: 1, from: 1.0},      // 5(x + 1): the 5 arcs onto both terms
  {id: 'solve', mg: 'solve', bars: 1, from: 0.3},                // 2x + 1 = 7 on a penguin seesaw
  {id: 'addexp', mg: 'addexp', bars: 1, from: 0.45},             // x³ · x⁴ = xxx · xxxx = x^(3+4)
  {id: 'dice', mg: 'dice', bars: 1, from: 0.45},                 // P(sum = 7): the diagonal of the 36 outcomes lights up
  {id: 'foil', mg: 'foil', bars: 1, from: 0.3},                  // (x + 4)(x + 1): the FOIL arcs build x² + 5x + 4
  {id: 'complement', mg: 'complement', bars: 1, from: 3.1},      // P(not 5) = 1 − 1/6 = 5/6, the dice turn green one by one
  {id: 'vecadd', mg: 'vecadd', bars: 1, from: 0.35},             // tip to tail: (2,3) + (1,0) = (3,3)
  {id: 'det', mg: 'det', bars: 1, from: 3.2},                    // det: 5 · 5 − 3 · 3 = 25 − 9
  {id: 'power', mg: 'power', bars: 1, from: 2.1},                // d/dx 4x²: 2 × 4 = 8, the exponent drops to 1
  {id: 'scalar', mg: 'scalar', bars: 1, from: 3.55},             // 2 · (1, 1): the arrow stretches to (2, 2)
  // the lift at 32 s: calculus and college
  {id: 'reverse', mg: 'reverse', bars: 2, from: 0.5},            // ∫3x² dx: "+1" writes itself, 2 + 1 rolls over to 3, ÷ 3
  {id: 'tangent', mg: 'tangent', bars: 1, from: 0.4},            // reeds turn to the curve's slope; the derivative appears
  {id: 'euclid', mg: 'modular_euclid', bars: 2, from: 0.35},     // gcd(12, 8): squares sawn off the rectangle, 12 = 1 × 8 + 4, 8 = 2 × 4 + 0
  {id: 'card', card: 'modular_euclid', bars: 2},                 // the card for EUCLID!
  {id: 'order', mg: 'symmetry_order', bars: 2, from: 0.45, cam: [1.0, 1.07, 0, 0, 0, -0.01]},      // |r|: the pentagon turns 72° at a time (r, r², r³, ...) until it comes home
  {id: 'dot', mg: 'dot', bars: 1, from: 0.3},                    // row times column: 1 · 4 + 4 · 2
  {id: 'compose', mg: 'compose', bars: 1, from: 0.3},            // f ∘ r on a turtle's triangular shell
  {id: 'cycle', mg: 'symmetry_cycle', bars: 1, from: 0.3, cam: [1.0, 1.05, 0, 0, 0.01, -0.005]},     // (1 4 3): the animals hop around the cycle
  {id: 'chain', mg: 'chain', bars: 1, from: 0.3},                // d/dx (3x + 2)⁴ as glowing bubbles in a night marsh
  {id: 'end', end: true, bars: 4.5},
];
const ONLY = (process.env.PROMO_ONLY || '').split(',').filter(Boolean);
// a slow camera move per shot: [scale from, scale to, x from, x to, y from, y to] as fractions of the frame; a shot's
// own `cam` overrides it (the wide commands, ELEMENT ORDER! and CYCLE NOTATION!, would be cropped by a zoomed-in start)
const CAMS = [[1.0, 1.08, 0, 0, 0, -0.01], [1.1, 1.02, -0.02, 0.01, 0, 0], [1.03, 1.12, 0.01, -0.01, 0.01, -0.01], [1.12, 1.04, 0.02, -0.01, -0.01, 0.01], [1.05, 1.1, 0, 0, 0.015, -0.01]];

function mux() {   // the music, as its own last step: the track plays from its start and fades out over the last 2 s
  const video = path.join(out, 'video.mp4'), final = path.join(out, 'qed-promo.mp4');
  const total = SHOTS.reduce((a, s) => a + s.bars * BAR, 0);
  if (!fs.existsSync(MUSIC)) { fs.copyFileSync(video, final); console.log(`${final}: ${total.toFixed(1)} s, no music (${MUSIC} not found)`); return; }
  ff('-i', video, '-i', MUSIC, '-filter_complex', `[1:a]afade=t=in:d=0.05,afade=t=out:st=${(total - 2).toFixed(2)}:d=2,volume=0.9[a]`,
     '-map', '0:v', '-map', '[a]', '-t', total.toFixed(3), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', final);
  console.log(`${final}: ${total.toFixed(1)} s with ${path.basename(MUSIC)}`);
}
if (process.env.PROMO_MUX) { mux(); process.exit(0); }

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({viewport: {width: 360, height: 640}, deviceScaleFactor: 3});
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  // a fixed Math.random (reseeded per shot, below) so renders repeat exactly
  await p.addInitScript(() => { let s = 12345; window.PRseed = n => { s = n & 0x7fffffff; }; Math.random = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }; try { localStorage.clear(); } catch (e) {} });
  await p.goto('file://' + path.resolve(html) + '?test=1'); await p.waitForFunction('window.HM && HM.ready && document.fonts.status === "loaded"', null, {timeout: 20000});
  await p.waitForTimeout(300);
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setDeviceMetricsOverride', {width: 360, height: 640, deviceScaleFactor: 3, mobile: false});
  const built = await p.evaluate(() => HM.list().map(d => d.id));
  const missing = SHOTS.filter(s => (s.mg || s.card) && !built.includes(s.mg || s.card)).map(s => s.mg || s.card);
  if (missing.length) { console.error('not in the build (PENDING?):', missing.join(', ')); process.exit(1); }
  // helpers inside the page: shot setup, per-frame step with camera, and the title/end drawings
  await p.evaluate(() => {
    const cvs = document.getElementById('game'); cvs.style.transformOrigin = '50% 50%';
    A.call = () => 0;      // the video's sound is the music track; the game's own audio stays off
    backIcon = () => {};   // no back button in the video
    pauseIcon = () => {};  // nor a pause button
    hintIcon = () => {};   // nor input icons
    // the finger: record every touch the test bot makes, and draw a fingertip that glides to it
    const F = window.PRF = {x: 180, y: 420, tx: 180, ty: 420, down: false, last: -9, ripples: []};
    const orig = synth;
    synth = (type, ...a) => {
      const now = PR.t;
      if (type === 'down' || type === 'move') { F.tx = a[0]; F.ty = a[1]; if (type === 'down') { if (now - F.last > 0.5) { F.x = a[0]; F.y = a[1]; } F.down = true; F.ripples.push({x: a[0], y: a[1], t: now}); } F.last = now; }
      if (type === 'up') { F.down = false; F.last = now; F.upT = now; }
      return orig(type, ...a);
    };
    window.PRfinger = (c, t) => {
      F.x += (F.tx - F.x) * 0.45; F.y += (F.ty - F.y) * 0.45;
      for (const r of F.ripples) { const k = (t - r.t) / 0.45; if (k < 0 || k > 1) continue; c.strokeStyle = `rgba(255,255,255,${0.85 * (1 - k)})`; c.lineWidth = 3; c.beginPath(); c.arc(r.x, r.y, 10 + k * 26, 0, 7); c.stroke(); }
      F.ripples = F.ripples.filter(r => t - r.t < 0.5);
      // the bot's touches are instant, so the fingertip stays pressed for a moment while it glides to where it let go
      const pressed = F.down || t - (F.upT ?? -9) < 0.2;
      const vis = pressed ? 1 : Math.max(0, 1 - (t - F.last - 0.2) / 0.6); if (vis <= 0) return;
      c.save(); c.globalAlpha = vis; const r = pressed ? 15 : 18;
      c.fillStyle = 'rgba(30,10,40,0.25)'; c.beginPath(); c.arc(F.x + 2, F.y + 4, r, 0, 7); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.72)'; c.strokeStyle = 'rgba(58,22,64,0.85)'; c.lineWidth = 2.5; c.beginPath(); c.arc(F.x, F.y, r, 0, 7); c.fill(); c.stroke();
      c.restore();
    };
    const hash = s => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) & 0x7fffffff; return h; };
    window.PR = {
      setup(s) {
        PRseed(s.seed ?? hash(s.mg || s.id));
        FX.clear(); window.HM_AUTO = false; CV.list = null; run = null;
        if (s.mg) {
          const d = MG.byId[s.mg];
          // the problem and its pacing are level 0's (the slowest working), but the level-0 ghost hand is hidden
          // because the fingertip shows the bot's real touches: draw() sees level 1, where the next move only glows
          if (!d._prWrapped) { const d0 = d.draw; d.draw = (g, c) => { PR.inDraw = true; try { return d0.call(d, g, c); } finally { PR.inDraw = false; } }; d._prWrapped = true; }
          startRun(d.stage); run.list = [d]; run.i = 0; window.HM_AUTO = true; nextMicro();
          Object.defineProperty(run.g, 'level', {get: () => PR.inDraw ? 1 : 0, configurable: true});
          for (let i = Math.round(s.from * 30); i > 0; i--) HM.step(1, 1 / 30);   // one frame at a time: the kit records tap boxes while drawing
        }
        else if (s.card) { scene = 'cards'; Object.keys(MG.byId).forEach(k => SAVE.d.cards[k] = 1); openCards([MG.byId[s.card]], 0, 'reward'); }
        else if (s.title || s.end) { scene = 'promo'; }
        PR.s = s; PR.t = 0; Object.assign(PRF, {down: false, last: -9, upT: -9, ripples: []});
      },
      frame(dt, cam, D) {
        const s = PR.s; PR.t += dt; const k = Math.min(1, PR.t / D), e = k * k * (3 - 2 * k);
        const sc = cam[0] + (cam[1] - cam[0]) * e, x = (cam[2] + (cam[3] - cam[2]) * e) * 100, y = (cam[4] + (cam[5] - cam[4]) * e) * 100;
        cvs.style.transform = `translate(${x}%,${y}%) scale(${sc})`;
        // a microgame shot holds on its winning moment instead of moving on to the acorns screen
        if (s.mg && run && run.g && run.g.done) { run.phase = 'play'; run.g.doneAt = Math.max(run.g.doneAt, run.g.t - 0.5); }
        HM.step(1, dt);
        const c = cvs.getContext('2d'); c.setTransform(scale * DPR, 0, 0, scale * DPR, offX * DPR, offY * DPR);
        if (s.title || s.end) PR.paint(c, s, PR.t);
        else if (s.mg) PRfinger(c, PR.t);
        if (PR.t < 0.2 && !s.first) { c.fillStyle = `rgba(255,250,235,${0.85 * (1 - PR.t / 0.2)})`; c.fillRect(0, 0, 360, 640); }   // a white flash on the cut
      },
      paint(c, s, t) {
        PANEL_TITLE(c, T);
        if (s.end) {
          const a = Math.min(1, Math.max(0, (t - 0.8) / 0.8));
          c.save(); c.globalAlpha = a; c.font = '800 18px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
          c.fillStyle = 'rgba(40,16,48,0.55)'; roundRect(c, 50, 238, 260, 42, 21); c.fill(); c.fillStyle = '#fff6dc'; c.fillText('ml-chen.github.io/qed-game', 180, 260); c.restore();
          if (t > 3.6) { c.fillStyle = `rgba(20,8,24,${Math.min(1, (t - 3.6) / 3.6)})`; c.fillRect(0, 0, 360, 640); }
        }
      },
    };
  });
  const segs = []; let total = 0;
  for (const [n, s] of SHOTS.entries()) {
    const D = s.bars * BAR, N = Math.round(D * FPS);
    if (ONLY.length && !ONLY.includes(s.id)) { total += D; continue; }
    await p.evaluate(s => PR.setup(s), s);
    const dir = path.join(out, 'frames', String(n).padStart(2, '0')); fs.rmSync(dir, {recursive: true, force: true}); fs.mkdirSync(dir, {recursive: true});
    const cam = s.cam || CAMS[n % CAMS.length], tag = `${String(n + 1).padStart(2, '0')}-${s.id}`;
    for (let f = 0; f < N; f++) {
      await p.evaluate(([dt, cam, D]) => PR.frame(dt, cam, D), [1 / FPS, cam, D]);
      const shot = await cdp.send('Page.captureScreenshot', {format: 'jpeg', quality: 92, optimizeForSpeed: true});
      const file = path.join(dir, String(f).padStart(5, '0') + '.jpg'); fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
      if (f === Math.round(N * 0.55)) fs.copyFileSync(file, path.join(out, 'stills', `${tag}.jpg`));
      if (process.env.PROMO_STILLS) for (const [q, nm] of [[0.12, 'a'], [0.4, 'b'], [0.7, 'c'], [0.96, 'd']]) if (f === Math.round((N - 1) * q)) {
        fs.mkdirSync(path.join(out, 'check'), {recursive: true}); fs.copyFileSync(file, path.join(out, 'check', `${tag}-${nm}.jpg`)); }
    }
    if (process.env.PROMO_STILLS) { fs.rmSync(dir, {recursive: true, force: true}); console.log(`${s.id}: stills only`); continue; }
    const seg = path.join(out, 'segs', `${String(n).padStart(2, '0')}.mp4`), tmp = seg.replace(/\.mp4$/, '.tmp.mp4');
    ff('-framerate', String(FPS), '-i', path.join(dir, '%05d.jpg'), '-vf', 'scale=1080:1920:flags=lanczos,format=yuv420p,setsar=1', '-frames:v', String(N),
       '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-r', String(FPS), '-an', tmp);
    fs.renameSync(tmp, seg); fs.rmSync(dir, {recursive: true, force: true});
    segs.push(seg); total += D; console.log(`${s.id}: ${D.toFixed(1)} s`);
  }
  await b.close();
  fs.writeFileSync(path.join(out, 'errors.txt'), errs.join('\n'));
  if (process.env.PROMO_STILLS || ONLY.length) { console.log('errors:', errs.join('; ') || 'none'); return; }
  // join the shots (hard cuts on the bars), then the music as the last step
  const list = path.join(out, 'segs.txt'); fs.writeFileSync(list, segs.map(f => `file '${f}'`).join('\n'));
  const video = path.join(out, 'video.mp4'); ff('-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', video);
  const st = fs.readdirSync(path.join(out, 'stills')).filter(f => f.endsWith('.jpg')).sort().map(f => path.join(out, 'stills', f));
  ff(...st.flatMap(f => ['-i', f]), '-filter_complex', st.map((_, i) => `[${i}:v]scale=216:384[s${i}]`).join(';') + ';' + st.map((_, i) => `[s${i}]`).join('') +
     `xstack=inputs=${st.length}:layout=${st.map((_, i) => `${(i % 10) * 216}_${Math.floor(i / 10) * 384}`).join('|')}:fill=black`, '-frames:v', '1', path.join(out, 'contact.jpg'));
  mux();
  console.log(`errors: ${errs.join('; ') || 'none'}`);
})();
