// DENOISE IN SMALL STEPS! (cs AI-33) — diffusion image models. The prompt card says "a duck with an umbrella"; the
// screen is pure static. Hold the button and the model wipes away noise; let go and it looks again at what is left and
// guesses the picture a little better (sparkles), so the shapes come first and the details after. Each hold is one step,
// and the Step meter shows how big it is: let go in the green. Hold too long and the step is too big: the model jumps
// straight to a guess and the picture smears into a blob, and the duck in it looks offended.
// Level 1: smaller steps allowed; level 2: smaller still (more steps).
(() => {
  const PROMPTS = [
    { text: 'a duck with an umbrella', kind: 'duck', acc: 'umbrella', sky: ['#7ac0e8', '#c8e8f8'], blob: '#f5d040' },
    { text: 'a frog with a crown', kind: 'frog', acc: 'crown', sky: ['#f0b0c8', '#fde0e8'], blob: '#6ac060' },
    { text: 'an owl with a book', kind: 'owl', acc: 'book', sky: ['#2a3a7a', '#6a7ab8'], blob: '#a8784a' },
    { text: 'a penguin with a scarf', kind: 'penguin', acc: 'scarf', sky: ['#a8d8f0', '#f0f8ff'], blob: '#3a3a4a' },
  ];
  const SCR = { x: 172, y: 318, w: 256, h: 250 }, BTN = { x: 180, y: 574, w: 240, h: 60 }, MET = { x: 336, y0: 440, y1: 230 };
  const LV = [{ max: 0.36 }, { max: 0.28 }, { max: 0.22 }], RATE = 0.62, THINK = 0.32;
  function paint(o) {
    N6.vgrad(o, 0, 0, 360, 640, ['#2a2860', '#4a3a7a', '#8a5a8a', '#c88a9a']);
    for (let i = 0; i < 30; i++) { o.fillStyle = 'rgba(255,240,220,0.5)'; o.beginPath(); o.arc((i * 71) % 360, (i * 43) % 120 + 4, 1 + (i % 3) * 0.5, 0, 7); o.fill(); }
    // the monitor
    o.fillStyle = '#1a1830'; o.beginPath(); o.roundRect(SCR.x - SCR.w / 2 - 14, SCR.y - SCR.h / 2 - 14, SCR.w + 28, SCR.h + 28, 18); o.fill();
    o.fillStyle = '#3a3658'; o.fillRect(SCR.x - 14, SCR.y + SCR.h / 2 + 14, 28, 26); o.beginPath(); o.roundRect(SCR.x - 60, SCR.y + SCR.h / 2 + 36, 120, 12, 6); o.fill();
    N6.vgrad(o, 0, 500, 360, 140, ['#4a3a5a', '#2a2038']);
  }
  function noiseTex(o, W, H, seed) { const r = P.rng(seed); for (let y = 0; y < H; y += 5) for (let x = 0; x < W; x += 5) { const v = r(), q = r(); o.fillStyle = q < 0.12 ? `hsl(${Math.floor(r() * 360)},70%,${40 + v * 40}%)` : `rgb(${Math.floor(v * 255)},${Math.floor(v * 255)},${Math.floor(v * 255)})`; o.fillRect(x, y, 5, 5); } }
  function picture(c, pr, t, detail) { // the finished picture; detail 0..1 adds the small things (eyes, the accessory's details)
    const x = SCR.x, y = SCR.y + 100;
    N6.vgrad(c, SCR.x - SCR.w / 2, SCR.y - SCR.h / 2, SCR.w, SCR.h, pr.sky); c.fillStyle = pr.kind === 'owl' ? '#3a4a3a' : '#8ac860'; c.fillRect(SCR.x - SCR.w / 2, y - 6, SCR.w, SCR.h / 2 - 94);
    if (pr.acc === 'umbrella') { c.save(); c.strokeStyle = '#3a1a10'; c.lineWidth = 5; c.beginPath(); c.moveTo(x + 40, y - 40); c.lineTo(x + 40, y - 150); c.stroke(); c.fillStyle = '#e8403a'; c.beginPath(); c.arc(x + 40, y - 146, 76, Math.PI, 0); c.closePath(); c.fill(); if (detail > 0.5) { c.fillStyle = '#fff6ea'; for (let i = -2; i <= 2; i += 2) { c.beginPath(); c.moveTo(x + 40, y - 222); c.quadraticCurveTo(x + 40 + i * 20, y - 190, x + 40 + i * 30, y - 146); c.lineTo(x + 40 + i * 30 + 12, y - 146); c.quadraticCurveTo(x + 40 + i * 20 + 6, y - 190, x + 40, y - 222); c.fill(); } } c.restore();
      if (detail > 0.7) for (let i = 0; i < 12; i++) { c.fillStyle = 'rgba(80,140,220,0.7)'; c.fillRect(SCR.x - 120 + (i * 37) % 240, SCR.y - 110 + ((i * 53 + t * 120) % 200), 2, 9); } }
    SK.animal(c, pr.kind, x, y, 2.4, { t, pose: 'idle', expr: 'happy', noShadow: detail < 0.4 });
    if (pr.acc === 'crown') { c.save(); c.fillStyle = '#f5c23a'; c.strokeStyle = '#8a5a10'; c.lineWidth = 3; const cy = y - 150; c.beginPath(); c.moveTo(x - 34, cy + 20); c.lineTo(x - 34, cy - 10); c.lineTo(x - 17, cy + 6); c.lineTo(x, cy - 20); c.lineTo(x + 17, cy + 6); c.lineTo(x + 34, cy - 10); c.lineTo(x + 34, cy + 20); c.closePath(); c.fill(); if (detail > 0.5) { c.stroke(); c.fillStyle = '#e8403a'; c.beginPath(); c.arc(x, cy + 8, 5, 0, 7); c.fill(); } c.restore(); }
    if (pr.acc === 'book') { c.save(); c.fillStyle = '#c8403a'; c.strokeStyle = '#5a1a10'; c.lineWidth = 3; c.beginPath(); c.roundRect(x - 40, y - 70, 80, 50, 4); c.fill(); if (detail > 0.5) { c.stroke(); c.fillStyle = '#fff6ea'; c.fillRect(x - 3, y - 70, 6, 50); } c.restore(); }
    if (pr.acc === 'scarf') { c.save(); c.fillStyle = '#e8403a'; c.beginPath(); c.roundRect(x - 40, y - 102, 80, 18, 8); c.fill(); c.fillRect(x + 14, y - 96, 16, 48); if (detail > 0.5) { c.fillStyle = '#fff6ea'; for (let i = 0; i < 3; i++) c.fillRect(x + 14, y - 80 + i * 12, 16, 4); } c.restore(); }
  }
  MG.add({
    id: 'ai_denoise', stage: 'ai', cmd: 'DENOISE IN SMALL STEPS!', time: 6, mood: 'night', winText: 'A clear picture!', failText: 'Smeared into a blob!', hold: 1.6,
    card: { title: 'Pictures out of static', kind: 'AI', ref: 'Diffusion models',
      text: 'An image model like this starts from random static. It has learned, from millions of pictures, how to guess a slightly less noisy version of a picture that matches the words in the prompt.\n\nSo it removes a little noise, looks again, and removes a little more. Big shapes and colours appear first, and the small details come last.\n\nIf it tried to jump from static to a finished picture in one go, its guess would be a blurry average: a smear. Many small steps make a sharp picture.',
      note: 'A diffusion model makes a picture by removing noise in many small steps, guided by the prompt.' },
    init(g) { const s = g.s; s.L = LV[Math.min(2, g.level)]; s.v = SK.variant(g, 4); s.pr = PROMPTS[s.v]; s.noise = 1; s.held = false; s.step = 0; s.steps = 0; s.thinkT = -9; s.smear = 0; },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || g.t - s.thinkT < THINK) return; s.held = true; s.step = 0; g.sfx('sweep', { vol: 0.5 }); },
    up(g) { const s = g.s; if (!s.held) return; s.held = false; if (g.done) return; if (s.step > 0.02) { s.steps++; s.thinkT = g.t; g.sfx('sparkle'); } if (s.noise <= 0.02) { s.noise = 0; g.win(); g.sfx('cheer'); g.burst(SCR.x, SCR.y, ['#ffd45a', '#fff6ea', '#8affd0'], 20, 180); } },
    update(g, dt) {
      const s = g.s; if (g.done || !s.held) return; const d = Math.min(s.noise, RATE * dt); s.noise -= d; s.step += d;
      if (s.step > s.L.max) { s.smear = g.t; s.held = false; g.fail(); g.sfx('slurp'); g.sfx('laugh'); }
      else if (s.noise <= 0) { s.held = false; s.steps++; g.win(); g.sfx('cheer'); g.burst(SCR.x, SCR.y, ['#ffd45a', '#fff6ea', '#8affd0'], 20, 180); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', pr = s.pr, n = s.noise;
      c.drawImage(g.bake('n6denoise_bg', paint), 0, 0, 360, 640);
      // the screen: the picture, blurred by how much noise is left, under the static
      c.save(); c.beginPath(); c.roundRect(SCR.x - SCR.w / 2, SCR.y - SCR.h / 2, SCR.w, SCR.h, 8); c.clip();
      if (s.smear) { N6.vgrad(c, SCR.x - SCR.w / 2, SCR.y - SCR.h / 2, SCR.w, SCR.h, [P.mix(pr.sky[0], '#888', 0.4), P.mix(pr.sky[1], '#888', 0.4)]);
        const k = SK.clamp((t - s.smear) * 3, 0, 1); c.save(); c.filter = 'blur(14px)'; c.fillStyle = pr.blob; c.beginPath(); c.ellipse(SCR.x + 10, SCR.y + 20, 90 + k * 20, 70, 0.3, 0, 7); c.fill(); c.fillStyle = '#e8403a'; c.beginPath(); c.ellipse(SCR.x + 50, SCR.y - 50, 70, 30, -0.4, 0, 7); c.fill(); c.restore();
        for (const ex of [-22, 22]) { c.fillStyle = '#fff'; c.beginPath(); c.arc(SCR.x + ex, SCR.y - 4, 13, 0, 7); c.fill(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(SCR.x + ex, SCR.y, 6, 0, 7); c.fill(); c.strokeStyle = '#2a1424'; c.lineWidth = 4; c.beginPath(); c.moveTo(SCR.x + ex - 14, SCR.y - 22 + (ex < 0 ? -6 : 6) * 0); c.lineTo(SCR.x + ex + 12, SCR.y - 18 + (ex < 0 ? 8 : -8)); c.stroke(); }
        c.strokeStyle = '#2a1424'; c.lineWidth = 4; c.beginPath(); c.moveTo(SCR.x - 14, SCR.y + 34); c.lineTo(SCR.x + 14, SCR.y + 30); c.stroke(); }
      else {
        c.save(); if (n > 0.02) c.filter = `blur(${(n * 16).toFixed(1)}px)`; picture(c, pr, t, 1 - n); c.restore();
        if (n > 0.005) { const fr = Math.floor(t * 12) % 3; c.globalAlpha = Math.min(1, Math.pow(n, 0.75) * 1.05); c.drawImage(g.bake('n6noise' + fr, o => noiseTex(o, 256, 250, 7 + fr * 13), 256, 250), SCR.x - SCR.w / 2, SCR.y - SCR.h / 2, SCR.w, SCR.h); c.globalAlpha = 1; }
        if (t - s.thinkT < THINK + 0.2) { const q = (t - s.thinkT) / (THINK + 0.2); for (let i = 0; i < 8; i++) { const a = i * 0.8 + q * 3; N6.halo(c, SCR.x + Math.cos(a) * 90 * q, SCR.y + Math.sin(a) * 80 * q, 18, `rgba(255,240,170,${0.7 * (1 - q)})`); } }
      }
      c.restore();
      // the prompt card
      c.save(); c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(96, 126, 248, 40, 12); c.fill(); c.stroke(); c.restore();
      N6.text(c, '"' + pr.text + '"', 220, 147, 18, '#3a1a10', { stroke: false }); SK.tag(c, 'Prompt', 50, 146, 18);
      SK.tag(c, 'Noise ' + Math.round(n * 100) + '%', 110, 470, 18, '#fff6ea', 'rgba(30,14,36,0.8)');
      // the step meter: how much this hold has removed; green until the limit, then red
      const my = v => SK.lerp(MET.y0, MET.y1, v / (s.L.max * 1.25)), lim = my(s.L.max);
      c.save(); c.fillStyle = 'rgba(20,10,30,0.6)'; c.beginPath(); c.roundRect(MET.x - 18, MET.y1 - 10, 36, MET.y0 - MET.y1 + 20, 14); c.fill();
      c.fillStyle = 'rgba(90,208,120,0.5)'; c.fillRect(MET.x - 10, lim, 20, MET.y0 - lim); c.fillStyle = 'rgba(232,64,58,0.6)'; c.fillRect(MET.x - 10, MET.y1, 20, lim - MET.y1);
      const cur = s.held ? s.step : 0; c.fillStyle = cur > s.L.max * 0.75 ? '#ffd45a' : '#8affb0'; c.fillRect(MET.x - 6, my(cur), 12, MET.y0 - my(cur)); c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.beginPath(); c.moveTo(MET.x - 16, lim); c.lineTo(MET.x + 16, lim); c.stroke(); c.restore();
      SK.tag(c, 'Step', MET.x, MET.y0 + 24, 18);
      if (s.held && !g.done) SK.tag(c, cur > s.L.max * 0.7 ? 'Let go now!' : 'Wiping...', 230, 516, 20, '#fff6ea', cur > s.L.max * 0.7 ? 'rgba(40,150,70,0.95)' : 'rgba(30,14,36,0.75)');
      // the host owl, and the button
      SK.animal(c, 'owl', 40, 540, 0.9, { t, pose: won ? 'cheer' : g.result === 'fail' ? 'sad' : 'idle', expr: won ? 'laugh' : s.smear ? 'wow' : 'think' });
      const ready = !g.done && t - s.thinkT >= THINK;
      N6.button(c, BTN.x, BTN.y, BTN.w, BTN.h, s.held ? 'Wiping noise...' : 'Hold to denoise', ready || s.held ? '#5a8ad8' : '#4a4a6a', s.held);
      if (ready && !s.held) SK.glow(c, g, BTN.x, BTN.y, 40, '#ffe27a', { level: 1 });
      // guidance: hold for a bit less than the biggest step, then let go
      SK.demo(g, c, 'hold', [BTN.x + 10, BTN.y + 6], null, { never: !ready || s.held, period: Math.max(0.45, Math.min(s.noise, s.L.max * 0.7) / RATE / 0.65) });
    },
    auto(g, dt, synth) { const s = g.s; if (g.done || g.t < 1.0) return; if (!s.held && g.t - s.thinkT > THINK + 0.05) synth('down', BTN.x, BTN.y); else if (s.held && s.step >= Math.min(s.L.max * 0.7, 9)) synth('up', BTN.x, BTN.y); },
  });
})();
