// Renders the Heurēka! promo video for RedNote (Xiaohongshu): node promo/render_heureka.js PAGE.html OUT
// Same approach as Q.E.D.!'s promo (promo/render.js): the real game is played live in headless Chromium, one 30 fps
// frame at a time on the game's own clock (test mode, HM.step); each microgame is played by its test bot from a chosen
// moment, with a fingertip drawn where the bot touches and a slow camera move per shot; hard cuts with a short white
// flash land on the music's bars. No narration and no caption text apart from the cover's one Chinese hook line.
// Build the page first: python3 src/build.py --app heureka PAGE.html
// Output: OUT/heureka-promo.mp4 (1080x1920, 30 fps, H.264 + AAC music), OUT/video.mp4 (no audio), OUT/cover.jpg (the
// first frame, which RedNote uses as the thumbnail), OUT/cover_3x4.jpg (its centred 3:4 crop, 1080x1440: what the
// feed shows), OUT/stills/<n>-<id>.jpg and OUT/contact.jpg.
// PROMO_ONLY=slide,title renders only those shots; PROMO_STILLS=1 saves stills (and four check frames per shot in
// OUT/check/) and skips encoding. PROMO_SCOUT=slide,dilute (or PROMO_SCOUT=all) films each microgame from its start with
// the same setup and writes OUT/scout/<id>.jpg, a grid of frames every 0.25 s labelled with the time, for picking `from`.
// Music: PROMO_MUSIC=track.mp3 (default heureka_bright_pop.mp3 in PROMO_MUSIC_DIR). PROMO_MUSIC_OFFSET skips that many
// seconds of the track so its downbeats land on the cuts (measured per track below). PROMO_MUX=1 only muxes the music
// into an existing OUT/video.mp4.
const {chromium} = require('playwright'); const fs = require('fs'), path = require('path'), {execFileSync} = require('child_process');
const [html, out = '/tmp/heureka-promo'] = process.argv.slice(2);
const FPS = 30;
const MUSIC_DIR = process.env.PROMO_MUSIC_DIR || '/tmp/claude-0/-home-claude/0ca8e3eb-b9e6-52a3-af00-e1b117f1a7c5/scratchpad/pm/repo/promo/music';
const MUSIC = process.env.PROMO_MUSIC || path.join(MUSIC_DIR, 'heureka_bright_pop.mp3');
// Measured with an onset analysis (spectral flux autocorrelation, then the kick and crash onsets): all three tracks are
// 150 BPM (0.4 s beats, 1.6 s bars). Their downbeats sit at OFFSET + 1.6 k s (bright_pop's crashes at 12.9, 38.5,
// 51.3 s), so the track is started OFFSET s in and every cut lands on a downbeat.
const TRACKS = {heureka_bright_pop: {bpm: 150, offset: 0.1}, heureka_lab_funk: {bpm: 150, offset: 0.0}, heureka_chip_orchestra: {bpm: 150, offset: 0.0}};
const TR = TRACKS[path.basename(MUSIC, '.mp3')] || {bpm: 150, offset: 0};
const BAR = 4 * 60 / TR.bpm;
const OFFSET = process.env.PROMO_MUSIC_OFFSET != null ? +process.env.PROMO_MUSIC_OFFSET : TR.offset;
const ff = (...a) => execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...a]);

// The cover's hook line, in the game's lettering style. Two rows so it can be large inside the 3:4 safe area.
const HOOK = ['100个小游戏', '玩懂科学和商业'];
const URL = 'ml-chen.github.io/qed-game/heureka';

// Shots, in bars (1.6 s at 150 BPM). mg: a microgame (its id in the build) played by its bot from `from` seconds in,
// chosen so the shot shows the action and its result, ending on the win banner (it names the idea). Ordered for breadth:
// physics, chemistry, biology and medicine, earth and space, engineering, CS and AI, money and startups, law, policy and
// consulting; then a faster second round from the music's chorus at 32 s. To update: edit this array only (ids from
// HM.list(); PROMO_SCOUT=<id> films a game so you can pick `from`). Keep the total at 37.5 bars (60 s).
const SHOTS = [
  {id: 'title', title: true, first: true, bars: 1, t0: 2.2},   // the cover: frame 0 is the thumbnail (no fade, no flash)
  // round one, the sciences, up to the chorus at 32 s (19 bars)
  // physics
  {id: 'slide', mg: 'slide', bars: 2, from: 2.5},              // two pucks glide past the sand into the net: Inertia!
  {id: 'knock', mg: 'energy_knock', bars: 1, from: 5.1},       // the heavy ball rolls down the ramp and topples the stack: Momentum!
  {id: 'shatter', mg: 'shatter', bars: 2, from: 1.8},          // the owl sings the glass's note: it shatters, then the next: Resonance!
  {id: 'split', mg: 'atoms_split', bars: 1, from: 4.5},        // a neutron splits the nucleus in a flash; the scale tips: E = mc²!
  {id: 'fire', mg: 'atoms_fire', bars: 1, from: 4.2},          // one electron at a time builds the stripes: Interference!
  {id: 'swing', mg: 'swing', bars: 1, from: 2.3},              // let go at the right moment and the ball flies off straight: Centripetal!
  // chemistry
  {id: 'balance', mg: 'balance_eq', bars: 1, from: 1.1},       // the last O₂ balances the scale, CH₄ + 2O₂ → CO₂ + 2H₂O: Mass conserved!
  {id: 'smother', mg: 'smother', bars: 1, from: 3.2},          // the lid takes away the air and the fire goes out: Fire triangle!
  // biology and medicine
  {id: 'divide', mg: 'cells_divide', bars: 2, from: 4.6},      // chromosomes line up, are pulled apart, two cells: Mitosis!
  {id: 'gobble', mg: 'body_gobble', bars: 1, from: 4.4},       // the white blood cell swallows the last germ: Phagocytosis!
  {id: 'pcr', mg: 'cells_cycle', bars: 1, from: 4.7},          // heat, cool, copy: the DNA doubles again: PCR!
  {id: 'wash', mg: 'medicine_wash', bars: 1, from: 2.6},       // soap scrubs and the germs rinse down the drain: Soap scrub!
  // earth and space
  {id: 'trace', mg: 'trace', bars: 2, from: 1.15},             // the sun's arc through a whole day, then the moon: Earth spins!
  {id: 'launch', mg: 'launch', bars: 1, from: 2.4},            // the second satellite settles into orbit: Orbit!
  {id: 'plough', mg: 'plough', bars: 1, from: 2.6},            // cold air shoves the warm air up into a storm cloud: Cold front!
  // round two, from the chorus (32 s): one bar each, bigger camera moves
  // engineering and hardware
  {id: 'unlock', mg: 'unlock', bars: 1, from: 1.0},            // both switches down, the circuit lights, the vault opens: AND gate!
  {id: 'lidar', mg: 'lidar', bars: 1, from: 6.0},             // the spinning lidar's last sweep, then the room's map lights up: Lidar map!
  {id: 'buildbot', mg: 'buildbot', bars: 1, from: 1.9},        // the last part clicks on and the robot vacuum sets off: Robot loop!
  // computer science and AI
  {id: 'next', mg: 'cs_next', bars: 1, from: 4.8},             // the word wheel lands on "purred": Next token!
  {id: 'descent', mg: 'cs_rolldown', bars: 1, from: 1.3},      // step by step down the loss valley: Descent!
  {id: 'loop', mg: 'cs_loop', bars: 1, from: 4.5},             // the last pass of the for loop, then beep(): For loop!
  // money and startups
  {id: 'snow', mg: 'rollsnow', bars: 1, from: 2.2},            // the coin snowball grows faster as it rolls: Compounding!
  {id: 'dilute', mg: 'dilute', bars: 1, from: 1.8},            // the investor's slice goes in and every slice thins: Dilution!
  {id: 'plug', mg: 'plugchurn', bars: 1, from: 2.6},           // holes plugged, the bucket of customers fills: Retention!
  // law, policy and consulting
  {id: 'copies', mg: 'catchcopies', bars: 1, from: 7.1},       // the copied painting gets knocked off its easel: Copyright!
  {id: 'rats', mg: 'clearrats', bars: 1, from: 2.1},           // paid helpers sweep the square clear: Incentives!
  {id: 'beetles', mg: 'squashbeetles', bars: 1, from: 0.9},    // squash the two big beetles that cause most of the bugs: 80/20 rule!
  {id: 'card', card: 'slide', bars: 2},                        // one card: THE IDEA behind SLIDE!
  {id: 'end', end: true, bars: 3.5},
];
const ONLY = (process.env.PROMO_ONLY || '').split(',').filter(Boolean);
const SCOUT = (process.env.PROMO_SCOUT || '').split(',').filter(Boolean);
// a slow camera move per shot: [scale from, scale to, x from, x to, y from, y to] as fractions of the frame; a shot's
// own `cam` overrides it. From the chorus on the moves are a little bigger (CAMS2).
const CAMS = [[1.0, 1.07, 0, 0, 0, -0.01], [1.09, 1.02, -0.015, 0.01, 0, 0], [1.02, 1.1, 0.01, -0.01, 0.01, -0.01], [1.1, 1.03, 0.015, -0.01, -0.01, 0.01], [1.04, 1.09, 0, 0, 0.012, -0.008]];
const CAMS2 = [[1.0, 1.12, 0, 0, 0.01, -0.012], [1.14, 1.03, -0.02, 0.015, 0, 0], [1.03, 1.14, 0.015, -0.015, 0.012, -0.012], [1.13, 1.02, 0.02, -0.015, -0.012, 0.012]];
const CAMSW = [[1.1, 1.0, 0.015, 0, 0.01, 0], [1.08, 1.0, -0.015, 0, -0.01, 0]];
const LIFT = 32.0;   // the chorus

function mux() {   // the music, as its own last step: from OFFSET s into the track, faded out over the last 2 s
  const video = path.join(out, 'video.mp4'), final = path.join(out, 'heureka-promo.mp4');
  const total = SHOTS.reduce((a, s) => a + s.bars * BAR, 0);
  if (!fs.existsSync(MUSIC)) { fs.copyFileSync(video, final); console.log(`${final}: ${total.toFixed(1)} s, no music (${MUSIC} not found)`); return; }
  ff('-i', video, '-i', MUSIC, '-filter_complex', `[1:a]atrim=start=${OFFSET},asetpts=PTS-STARTPTS,afade=t=in:d=0.03,afade=t=out:st=${(total - 2).toFixed(2)}:d=2,volume=0.9[a]`,
     '-map', '0:v', '-map', '[a]', '-t', total.toFixed(3), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', final);
  console.log(`${final}: ${total.toFixed(1)} s with ${path.basename(MUSIC)} from ${OFFSET} s`);
}
if (process.env.PROMO_MUX) { mux(); process.exit(0); }
for (const d of ['segs', 'stills']) fs.mkdirSync(path.join(out, d), {recursive: true});
// a full render (or a full stills pass) starts with no stills left over from an older shot list
if (!ONLY.length && !process.env.PROMO_SCOUT) for (const f of fs.readdirSync(path.join(out, 'stills'))) fs.rmSync(path.join(out, 'stills', f));

(async () => {
  const b = await chromium.launch();
  const dsf = SCOUT.length ? 1 : 3;
  const ctx = await b.newContext({viewport: {width: 360, height: 640}, deviceScaleFactor: dsf});
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  // a fixed Math.random (reseeded per shot, below) so renders repeat exactly
  await p.addInitScript(() => { let s = 12345; window.PRseed = n => { s = n & 0x7fffffff; }; Math.random = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }; try { localStorage.clear(); } catch (e) {} });
  await p.goto('file://' + path.resolve(html) + '?test=1'); await p.waitForFunction('window.HM && HM.ready && document.fonts.status === "loaded"', null, {timeout: 20000});
  // the hook's CJK font (Noto Sans CJK SC Black, a system font) must be loaded before the first frame
  await p.evaluate(async () => { try { await document.fonts.load('900 48px "Noto Sans CJK SC"', '玩懂科学个小游戏'); } catch (e) {} });
  await p.waitForTimeout(300);
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setDeviceMetricsOverride', {width: 360, height: 640, deviceScaleFactor: dsf, mobile: false});
  const built = await p.evaluate(() => HM.list().map(d => d.id));
  const missing = SHOTS.filter(s => (s.mg || s.card) && !built.includes(s.mg || s.card)).map(s => s.mg || s.card);
  if (missing.length && !SCOUT.length) { console.error('not in the build (PENDING?):', missing.join(', ')); process.exit(1); }
  await p.evaluate(([HOOK, URL]) => {
    const cvs = document.getElementById('game'); cvs.style.transformOrigin = '50% 50%';
    A.call = () => 0;      // the video's sound is the music track; the game's own audio stays off
    backIcon = () => {};   // no back button in the video
    pauseIcon = () => {};  // nor a pause button
    hintIcon = () => {};   // nor input icons
    rewindIcon = () => {}; // nor the rewind button
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
    // the hook line, lettered like P.command (cream to gold fill, thick plum outline, offset plum shadow, glossy top)
    // in Noto Sans CJK SC Black, which has the CJK glyphs the game's own fonts lack
    window.PRhook = (c, text, x, y, size, tilt) => {
      c.save(); c.translate(x, y); c.rotate(tilt);
      c.font = `900 ${size}px "Noto Sans CJK SC", "Noto Sans CJK TC", Fredoka, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
      const ol = '#3a1640';
      c.fillStyle = ol; c.strokeStyle = ol; c.lineWidth = size * 0.22; c.strokeText(text, 3, 5); c.fillText(text, 3, 5);
      c.strokeText(text, 0, 0);
      const g = c.createLinearGradient(0, -size * 0.5, 0, size * 0.5); g.addColorStop(0, '#fff8e2'); g.addColorStop(0.55, '#fff0c4'); g.addColorStop(1, '#ffcf5a'); c.fillStyle = g; c.fillText(text, 0, 0);
      c.globalAlpha = 0.5; c.fillStyle = '#ffffff'; c.beginPath(); c.rect(-400, -size * 0.55, 800, size * 0.3); c.clip(); c.fillText(text, 0, 0);
      c.restore();
    };
    const hash = s => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) & 0x7fffffff; return h; };
    window.PR = {
      setup(s) {
        PRseed(s.seed ?? hash(s.mg || s.id));
        FX.clear(); window.HM_AUTO = false; CV.list = null; run = null;
        if (s.mg) {
          const d = MG.byId[s.mg];
          // the problem and its pacing are level 0's (the slowest working), but the level-0 ghost hand (SK.demo and the
          // games' own level-0 hands) is hidden because the fingertip shows the bot's real touches: draw() sees level 1
          if (!d._prWrapped) { const d0 = d.draw; d.draw = (g, c) => { PR.inDraw = true; try { return d0.call(d, g, c); } finally { PR.inDraw = false; } }; d._prWrapped = true; }
          startRun(d.stage); run.list = [d]; run.i = 0; window.HM_AUTO = true; nextMicro();
          Object.defineProperty(run.g, 'level', {get: () => PR.inDraw ? 1 : 0, configurable: true});
          for (let i = Math.round(s.from * 30); i > 0; i--) HM.step(1, 1 / 30);   // one frame at a time: the kit records tap boxes while drawing
        }
        else if (s.card) { scene = 'cards'; Object.keys(MG.byId).forEach(k => SAVE.d.cards[k] = 1); openCards([MG.byId[s.card]], 0, 'reward'); }
        else if (s.title || s.end) { scene = 'promo'; }
        PR.s = s; PR.t = 0; Object.assign(PRF, {down: false, last: -9, upT: -9, ripples: []});
        // the win banner's width (P.command at 50 px): a wide one would be cropped by a zoomed-in camera
        if (!s.mg) return 0; const c = cvs.getContext('2d'); c.save(); c.font = '700 50px Fredoka, Nunito, system-ui, sans-serif'; const w = c.measureText(MG.byId[s.mg].winText || '').width + 11; c.restore(); return w;
      },
      frame(dt, cam, D) {
        const s = PR.s; PR.t += dt; const k = Math.min(1, PR.t / D), e = k * k * (3 - 2 * k);
        const sc = cam[0] + (cam[1] - cam[0]) * e, x = (cam[2] + (cam[3] - cam[2]) * e) * 100, y = (cam[4] + (cam[5] - cam[4]) * e) * 100;
        cvs.style.transform = `translate(${x}%,${y}%) scale(${sc})`;
        // a microgame shot holds on its winning moment (the banner naming the idea) instead of moving on
        if (s.mg && run && run.g && run.g.done) { run.phase = 'play'; run.g.doneAt = Math.max(run.g.doneAt, run.g.t - 0.5); }
        HM.step(1, dt);
        const c = cvs.getContext('2d'); c.setTransform(scale * DPR, 0, 0, scale * DPR, offX * DPR, offY * DPR);
        if (s.title || s.end) PR.paint(c, s, PR.t);
        else if (s.mg) PRfinger(c, PR.t);
        if (PR.t < 0.2 && !s.first) { c.fillStyle = `rgba(255,250,235,${(s.lift ? 0.95 : 0.85) * (1 - PR.t / 0.2)})`; c.fillRect(0, 0, 360, 640); }   // a white flash on the cut
        if (s.label) { c.save(); c.fillStyle = 'rgba(0,0,0,0.6)'; c.fillRect(0, 600, 120, 40); c.fillStyle = '#fff'; c.font = '700 26px sans-serif'; c.fillText(s.label(), 8, 630); c.restore(); }
      },
      paint(c, s, t) {
        // the title painting; the cover starts at a chosen moment of its loop (t0), the lettering from the painting itself
        PANEL_TITLE(c, (s.t0 || 0) + t);
        if (s.title) {
          // inside the centre 3:4 area (y 80 to 560): "Heurēka!" at y 168, the hook below it where Play and Cards sit
          PRhook(c, HOOK[0], 180, 276, 50, -0.05);
          PRhook(c, HOOK[1], 184, 340, HOOK[1].length > 5 ? 46 : 56, -0.05);
        }
        if (s.end) {
          const a = Math.min(1, Math.max(0, (t - 0.5) / 0.6));
          c.save(); c.globalAlpha = a; c.font = '800 16px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
          const w = c.measureText(URL).width + 34;
          c.fillStyle = 'rgba(40,16,48,0.62)'; roundRect(c, 180 - w / 2, 250, w, 42, 21); c.fill(); c.fillStyle = '#fff6dc'; c.fillText(URL, 180, 272); c.restore();
          if (t > 3.4) { c.fillStyle = `rgba(20,8,24,${Math.min(1, (t - 3.4) / 2.2)})`; c.fillRect(0, 0, 360, 640); }
        }
      },
    };
  }, [HOOK, URL]);

  if (SCOUT.length) {   // film each microgame from its start: a labelled frame every 0.25 s, as a grid per game
    const ids = SCOUT[0] === 'all' ? built : SCOUT;
    const dir = path.join(out, 'scout'); fs.mkdirSync(dir, {recursive: true});
    for (const id of ids) {
      await p.evaluate(id => PR.setup({id, mg: id, from: 0}), id);
      const fdir = path.join(dir, id); fs.rmSync(fdir, {recursive: true, force: true}); fs.mkdirSync(fdir);
      let n = 0, doneAt = null;
      for (let f = 0; f < 30 * 14; f++) {
        await p.evaluate(() => { PR.s.label = () => PR.t.toFixed(2); PR.frame(1 / 30, [1, 1, 0, 0, 0, 0], 1); });
        if (f % 8 === 7) { const shot = await cdp.send('Page.captureScreenshot', {format: 'jpeg', quality: 70, optimizeForSpeed: true}); fs.writeFileSync(path.join(fdir, String(n++).padStart(3, '0') + '.jpg'), Buffer.from(shot.data, 'base64')); }
        const st = await p.evaluate(() => run && run.g ? {done: run.g.done, res: run.g.result, t: PR.t} : null);
        if (st && st.done && doneAt == null) doneAt = st.t;
        if (doneAt != null && st.t > doneAt + 1.0) break;
      }
      const cols = 8, rows = Math.ceil(n / cols);
      ff('-framerate', '1', '-i', path.join(fdir, '%03d.jpg'), '-vf', `scale=180:320,tile=${cols}x${rows}`, '-frames:v', '1', path.join(dir, id + '.jpg'));
      fs.rmSync(fdir, {recursive: true, force: true});
      const res = await p.evaluate(() => run && run.g ? run.g.result : null);
      console.log(`scout ${id}: ${res} at ${doneAt == null ? '-' : doneAt.toFixed(2)} s`);
    }
    await b.close(); console.log('errors:', errs.join('; ') || 'none'); return;
  }

  const segs = []; let total = 0;
  for (const [n, s] of SHOTS.entries()) {
    const D = s.bars * BAR, N = Math.round(D * FPS);
    if (ONLY.length && !ONLY.includes(s.id)) { total += D; continue; }
    s.lift = Math.abs(total - LIFT) < 0.05;
    const bw = await p.evaluate(s => PR.setup(s), s);
    const dir = path.join(out, 'frames', String(n).padStart(2, '0')); fs.rmSync(dir, {recursive: true, force: true}); fs.mkdirSync(dir, {recursive: true});
    // the card and the end card fill the frame, so they barely move; a shot whose win banner is wide (over 270 px of
    // the 360) ends wide, so the banner is never cropped
    const cam = s.cam || (s.card || s.end ? [1, 1.025, 0, 0, 0, 0] : bw > 270 ? CAMSW[n % CAMSW.length] : total >= LIFT - 0.05 ? CAMS2[n % CAMS2.length] : CAMS[n % CAMS.length]), tag = `${String(n + 1).padStart(2, '0')}-${s.id}`;
    if (bw > 270) console.log(`${s.id}: wide banner (${Math.round(bw)} px), the camera ends wide`);
    for (let f = 0; f < N; f++) {
      // the cover holds still for its first frames (the thumbnail), then the slow push-in starts
      const cm = s.title ? [1, 1.04, 0, 0, 0, 0] : cam;
      await p.evaluate(([dt, cam, D]) => PR.frame(dt, cam, D), [1 / FPS, cm, D]);
      const shot = await cdp.send('Page.captureScreenshot', {format: 'jpeg', quality: 92, optimizeForSpeed: true});
      const file = path.join(dir, String(f).padStart(5, '0') + '.jpg'); fs.writeFileSync(file, Buffer.from(shot.data, 'base64'));
      if (s.first && f === 0) {
        const png = await cdp.send('Page.captureScreenshot', {format: 'png'}); const cp = path.join(out, 'cover.png'); fs.writeFileSync(cp, Buffer.from(png.data, 'base64'));
        ff('-i', cp, '-q:v', '2', path.join(out, 'cover.jpg')); ff('-i', cp, '-vf', 'crop=1080:1440:0:240', '-q:v', '2', path.join(out, 'cover_3x4.jpg')); fs.rmSync(cp);
      }
      if (f === Math.round(N * 0.55)) fs.copyFileSync(file, path.join(out, 'stills', `${tag}.jpg`));
      if (process.env.PROMO_STILLS) for (const [q, nm] of [[0.0, 'a'], [0.35, 'b'], [0.7, 'c'], [0.98, 'd']]) if (f === Math.round((N - 1) * q)) {
        fs.mkdirSync(path.join(out, 'check'), {recursive: true}); fs.copyFileSync(file, path.join(out, 'check', `${tag}-${nm}.jpg`)); }
    }
    total += D;
    if (process.env.PROMO_STILLS) { fs.rmSync(dir, {recursive: true, force: true}); console.log(`${s.id}: stills only`); continue; }
    const seg = path.join(out, 'segs', `${String(n).padStart(2, '0')}.mp4`), tmp = seg.replace(/\.mp4$/, '.tmp.mp4');
    ff('-framerate', String(FPS), '-i', path.join(dir, '%05d.jpg'), '-vf', 'scale=1080:1920:flags=lanczos,format=yuv420p,setsar=1', '-frames:v', String(N),
       '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-r', String(FPS), '-an', tmp);
    fs.renameSync(tmp, seg); fs.rmSync(dir, {recursive: true, force: true});
    segs.push(seg); console.log(`${s.id}: ${D.toFixed(1)} s`);
  }
  await b.close();
  fs.writeFileSync(path.join(out, 'errors.txt'), errs.join('\n'));
  const st = fs.readdirSync(path.join(out, 'stills')).filter(f => f.endsWith('.jpg')).sort().map(f => path.join(out, 'stills', f));
  const contact = () => ff(...st.flatMap(f => ['-i', f]), '-filter_complex', st.map((_, i) => `[${i}:v]scale=216:384[s${i}]`).join(';') + ';' + st.map((_, i) => `[s${i}]`).join('') +
     `xstack=inputs=${st.length}:layout=${st.map((_, i) => `${(i % 10) * 216}_${Math.floor(i / 10) * 384}`).join('|')}:fill=black`, '-frames:v', '1', path.join(out, 'contact.jpg'));
  if (process.env.PROMO_STILLS || ONLY.length) { if (st.length > 1) contact(); console.log('errors:', errs.join('; ') || 'none'); return; }
  // join the shots (hard cuts on the bars), then the music as the last step
  const list = path.join(out, 'segs.txt'); fs.writeFileSync(list, segs.map(f => `file '${f}'`).join('\n'));
  const video = path.join(out, 'video.mp4'); ff('-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', video);
  contact();
  mux();
  console.log(`errors: ${errs.join('; ') || 'none'}`);
})();
