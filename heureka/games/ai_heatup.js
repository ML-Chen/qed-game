// HEAT UP! (cs AI-03) — sampling temperature. The owl poet writes a poem word by word. Each next word comes out of a
// bubbling pot of candidate words; the balls in the pot are as big as the chance the model gives each word at the current
// temperature (a softmax: cold makes the likeliest word huge, hot makes every word about the same size). Hold the button
// to heat the pot; it cools when you let go. Keep the thermometer in the green band while the words come out: each line
// comes out fresh and sensible. Too cold and the model picks the likeliest word every time, so it copies the first line
// (the words freeze blue and the line is crossed out: "the cat sat on the mat" again). Too hot and long-shot words win:
// word soup in wobbly red. Two spoiled lines and the poem is ruined.
// Level 1: a narrower band; level 2: three lines to write and the pot cools faster.
(() => {
  const POEMS = [
    ['The cat', 'sat', 'on the mat'], ['The sun', 'rose', 'over the hill'], ['A frog', 'sang', 'in the pond'], ['The wind', 'blew', 'through the trees'],
  ];
  const FRESH = [['The moon', 'A fox', 'The rain', 'My dog', 'A bee', 'The snow'], ['danced', 'hummed', 'slept', 'dreamed', 'spun', 'glowed'], ['by the sea', 'in the hay', 'on the roof', 'under stars', 'in the snow', 'near the barn']];
  const SOUP = [['Fork', 'Zxq', 'Eleven'], ['glorped', 'purpled', 'sneezles'], ['of Tuesday', 'blorp blorp', 'up seven']];
  const LOGIT = [2.2, 1.4, 1.4, -0.4, -0.4, -0.4]; // copy, fresh, fresh, soup x3
  const POT = { x: 160, y: 440, w: 176 }, TH = { x: 322, y0: 340, y1: 500 }, BTN = { x: 180, y: 574, w: 250, h: 62 };
  const SCROLL = { x: 22, y: 128, w: 316, top: 158, gap: 32 };
  const LV = [{ lo: 0.34, hi: 0.72, need: 2, cool: 0.22 }, { lo: 0.38, hi: 0.68, need: 2, cool: 0.28 }, { lo: 0.40, hi: 0.66, need: 3, cool: 0.4 }];
  const HEAT = 0.7, EVERY = 0.72, FLY = 0.38;
  const zone = (s, h) => h < s.L.lo ? 'copy' : h > s.L.hi ? 'soup' : 'fresh';
  const COL = { copy: '#4a90d8', fresh: '#5a3a1a', soup: '#e8403a' };
  function probs(h) { const tau = 0.15 + 2.6 * h, e = LOGIT.map(l => Math.exp(l / tau)), z = e.reduce((a, b) => a + b, 0); return e.map(v => v / z); }
  function paint(o) {
    N6.vgrad(o, 0, 0, 360, 640, ['#2a2860', '#4a3a7a', '#8a5a8a', '#c88a9a']);
    // a window with the moon, and bookshelves
    o.fillStyle = '#1a1840'; o.beginPath(); o.roundRect(236, 18, 108, 96, 50); o.fill(); P.stars(o, 360, 120, 0, 3, 0);
    o.save(); o.beginPath(); o.roundRect(240, 22, 100, 90, 46); o.clip(); N6.vgrad(o, 240, 22, 100, 90, ['#1e2260', '#3a3a8a']);
    for (let i = 0; i < 14; i++) { o.fillStyle = 'rgba(255,250,220,0.8)'; o.beginPath(); o.arc(246 + (i * 37) % 92, 30 + (i * 23) % 70, 1.2, 0, 7); o.fill(); }
    o.fillStyle = '#fff2c0'; o.beginPath(); o.arc(300, 56, 18, 0, 7); o.fill(); o.fillStyle = '#1e2260'; o.beginPath(); o.arc(308, 50, 16, 0, 7); o.fill(); o.restore();
    for (const sy of [20, 64]) { o.fillStyle = '#5a3a2a'; o.fillRect(0, sy + 34, 200, 7); for (let i = 0; i < 11; i++) { o.fillStyle = ['#c85a5a', '#5a8ac8', '#e8b040', '#6aa86a', '#9a6ac8'][i % 5]; o.fillRect(6 + i * 17, sy + 6 + (i % 3) * 3, 13, 28 - (i % 3) * 3); } }
    // the desk and the floor
    N6.vgrad(o, 0, 500, 360, 140, ['#6a3a2a', '#4a2418']);
    o.fillStyle = '#8a5236'; o.fillRect(0, 498, 360, 12); o.fillStyle = 'rgba(255,220,180,0.15)'; o.fillRect(0, 498, 360, 3);
    // the stove under the pot
    o.fillStyle = '#3a3040'; o.beginPath(); o.roundRect(POT.x - 70, 484, 140, 22, 6); o.fill(); o.fillStyle = '#5a5060'; o.fillRect(POT.x - 64, 486, 128, 4);
  }
  function scroll(c) {
    const { x, y, w } = SCROLL, h = 160;
    c.save(); c.fillStyle = 'rgba(20,10,30,0.35)'; c.beginPath(); c.roundRect(x + 4, y + 8, w, h, 10); c.fill();
    const gr = c.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#fff4dc'); gr.addColorStop(1, '#f2dcb4'); c.fillStyle = gr; c.beginPath(); c.roundRect(x, y, w, h, 8); c.fill();
    c.strokeStyle = '#a87a4a'; c.lineWidth = 2; c.stroke();
    for (const yy of [y, y + h]) { c.fillStyle = '#d8b480'; c.beginPath(); c.roundRect(x - 8, yy - 7, w + 16, 14, 7); c.fill(); c.strokeStyle = '#8a5a2a'; c.stroke(); }
    c.restore();
  }
  function lineText(c, words, x, y, t, o = {}) { // words: [{ w, k }] drawn left to right with a space
    c.save(); c.font = '800 19px Nunito, system-ui, sans-serif'; c.textBaseline = 'middle'; let cx = x;
    words.forEach((wd, i) => {
      const wob = wd.k === 'soup' ? Math.sin(t * 9 + i * 2) * 2.5 : 0; c.fillStyle = o.col || COL[wd.k] || '#3a1a10';
      c.save(); c.translate(cx, y + wob); if (wd.k === 'soup') c.rotate(Math.sin(t * 7 + i) * 0.06); c.fillText(wd.w, 0, 0); c.restore();
      const ww = c.measureText(wd.w + ' ').width; if (wd.k === 'copy' && !o.col) { c.fillStyle = 'rgba(140,200,255,0.35)'; c.fillRect(cx - 2, y - 11, ww - 3, 22); } cx += ww;
    });
    c.restore(); return cx;
  }
  MG.add({
    id: 'ai_heatup', stage: 'ai', cmd: 'KEEP THE HEAT IN THE GREEN!', time: 6, mood: 'night', winText: 'A fresh poem!', failText: 'Repeats or nonsense!', hold: 1.6,
    card: { title: 'How adventurous the words are', kind: 'AI', ref: 'Sampling temperature',
      text: 'A language model writes one word at a time. For each spot it gives every possible next word a chance, and then picks one.\n\nTemperature changes those chances. When it is cold, the likeliest word gets almost all the chance, so the model plays it safe and can get stuck repeating itself. When it is hot, unlikely words get nearly as much chance as good ones, and the writing turns to nonsense.\n\nPeople use a low temperature for code and facts, and a higher one for stories and ideas.',
      note: 'Temperature sets how adventurous a model\'s word choices are: low is safe and repetitive, high is varied and wild.' },
    init(g) {
      const s = g.s; s.L = LV[Math.min(2, g.level)]; s.v = SK.variant(g, POEMS.length); s.first = POEMS[s.v];
      s.h = 0; s.held = false; s.started = false; s.next = 0; s.slot = 0; s.cur = []; s.lines = []; s.bad = 0; s.fly = null; s.struck = null; s.fi = [Math.floor(g.rand() * 6), Math.floor(g.rand() * 6), Math.floor(g.rand() * 6)]; s.si = 0; s.endT = 0;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return;
      if (Math.abs(x - BTN.x) < BTN.w / 2 + 12 && Math.abs(y - BTN.y) < BTN.h / 2 + 14 || y > 300) { s.held = true; g.sfx('fire', { vol: 0.4 }); if (!s.started) { s.started = true; s.next = g.t + 0.7; } }
    },
    up(g) { g.s.held = false; },
    update(g, dt) {
      const s = g.s; s.h = SK.clamp(s.h + (s.held && !g.done ? HEAT : -s.L.cool) * dt, 0, 1);
      if (g.done || !s.started) return;
      if (s.struck && g.t - s.struck.t > 0.9) s.struck = null;
      if (!s.fly && g.t >= s.next) { // the next word comes out of the pot, chosen by the temperature right now
        const k = zone(s, s.h), slot = s.slot; let w;
        if (k === 'copy') w = s.first[slot]; else if (k === 'fresh') { w = FRESH[slot][s.fi[slot] % 6]; s.fi[slot] += 1 + (g.rand() < 0.5 ? 1 : 0); } else { w = SOUP[slot][s.si % 3]; s.si++; }
        s.fly = { w, k, t: g.t, slot }; s.next = g.t + EVERY; g.sfx(k === 'soup' ? 'boing' : k === 'copy' ? 'click' : 'bubble');
      }
      if (s.fly && g.t - s.fly.t >= FLY) { // it lands in the poem
        s.cur.push({ w: s.fly.w, k: s.fly.k }); s.fly = null; s.slot++;
        if (s.slot >= 3) {
          const soup = s.cur.some(w => w.k === 'soup'), copies = s.cur.filter(w => w.k === 'copy').length;
          if (!soup && copies <= 1) { s.lines.push(s.cur); g.sfx('chime'); g.burst(SCROLL.x + 160, SCROLL.top + s.lines.length * SCROLL.gap, ['#ffd45a', '#fff6ea', '#8affb0'], 12, 120);
            if (s.lines.length >= s.L.need) { g.win(); g.sfx('cheer'); } }
          else { s.bad++; s.struck = { words: s.cur, t: g.t, kind: soup ? 'soup' : 'copy' }; g.sfx(soup ? 'laugh' : 'wrong'); g.shake(3, 0.2); if (s.bad >= (g.level ? 2 : 3)) g.fail(); }
          s.cur = []; s.slot = 0; s.next = g.t + 0.5;
        }
      }
    },
    draw(g, c) {
      const s = g.s, t = g.t, L = s.L, won = g.result === 'win', lost = g.result === 'fail', k = zone(s, s.h);
      c.drawImage(g.bake('n6heat_bg', paint), 0, 0, 360, 640);
      // the poem
      scroll(c); const x0 = SCROLL.x + 18;
      lineText(c, s.first.map(w => ({ w, k: 'given' })), x0, SCROLL.top, t, { col: '#3a1a10' });
      s.lines.forEach((ln, i) => lineText(c, ln, x0, SCROLL.top + (i + 1) * SCROLL.gap, t));
      const row = s.lines.length + 1;
      if (row <= L.need) {
        const y = SCROLL.top + row * SCROLL.gap;
        if (s.struck) { const q = SK.clamp((t - s.struck.t) / 0.9, 0, 1); c.save(); c.globalAlpha = 1 - q * 0.6; const ex = lineText(c, s.struck.words, x0, y, t); c.strokeStyle = '#c0302a'; c.lineWidth = 3; c.beginPath(); c.moveTo(x0 - 4, y); c.lineTo(ex, y + 1); c.stroke(); c.restore();
          SK.tag(c, s.struck.kind === 'soup' ? 'Nonsense!' : 'Same line!', 262, y - 2, 18, '#fff6ea', s.struck.kind === 'soup' ? 'rgba(200,50,40,0.92)' : 'rgba(40,100,190,0.92)'); }
        else { const ex = lineText(c, s.cur, x0, y, t); c.save(); c.strokeStyle = 'rgba(120,80,40,0.55)'; c.lineWidth = 2; c.setLineDash([6, 5]); for (let i = s.cur.length; i < 3; i++) { const bx = ex + (i - s.cur.length) * 74; c.beginPath(); c.moveTo(bx, y + 11); c.lineTo(bx + 62, y + 11); c.stroke(); } c.restore(); }
        for (let r = row + 1; r <= L.need; r++) { const y2 = SCROLL.top + r * SCROLL.gap; c.save(); c.strokeStyle = 'rgba(120,80,40,0.4)'; c.lineWidth = 2; c.setLineDash([6, 5]); c.beginPath(); c.moveTo(x0, y2 + 11); c.lineTo(x0 + 270, y2 + 11); c.stroke(); c.restore(); }
      }
      SK.tag(c, 'Poem', 296, SCROLL.y, 18);
      // the flame under the pot, as big as the heat
      const fl = s.h; for (let i = 0; i < 7; i++) { const fx = POT.x - 54 + i * 18, fh = 8 + fl * 34 * (0.7 + 0.3 * Math.sin(t * 13 + i * 1.7)); const gr = c.createLinearGradient(0, 486, 0, 486 - fh); gr.addColorStop(0, '#4a8aff'); gr.addColorStop(0.4, '#ffb040'); gr.addColorStop(1, 'rgba(255,240,160,0)'); c.fillStyle = gr; c.beginPath(); c.moveTo(fx - 7, 486); c.quadraticCurveTo(fx, 486 - fh * 1.2, fx + 7, 486); c.fill(); }
      // the pot of candidate words: each ball as big as its chance right now
      const p = probs(s.h), slot = s.fly ? s.fly.slot : s.slot % 3;
      const words = [s.first[slot], FRESH[slot][s.fi[slot] % 6], FRESH[slot][(s.fi[slot] + 1) % 6], ...SOUP[slot]];
      const cols = ['#5aa8f0', '#f5c23a', '#f5c23a', '#e8563a', '#e8563a', '#e8563a'], kinds = ['copy', 'fresh', 'fresh', 'soup', 'soup', 'soup'];
      c.save(); c.fillStyle = '#2a2430'; c.beginPath(); c.ellipse(POT.x, 392, POT.w / 2, 18, 0, 0, 7); c.fill(); c.restore();
      // two packed rows: the three long shots behind, the likely words in front; the word this temperature picks bobs up
      const R = p.map(q => 7 + 33 * Math.sqrt(q)), pick = k === 'copy' ? 0 : k === 'fresh' ? 1 : 3, jig = s.h * s.h * 16;
      const rows = [[3, 4, 5], [1, 0, 2]], at = [];
      rows.forEach((rw, ri) => { const W = rw.reduce((a, i) => a + 2 * R[i], 0) + 4 * (rw.length - 1); let x = POT.x - W / 2;
        for (const i of rw) { at[i] = [x + R[i], (ri ? 390 : 356) - R[i] * 0.9]; x += 2 * R[i] + 4; } });
      c.save(); c.beginPath(); c.rect(0, 200, 360, 192); c.rect(POT.x - POT.w / 2, 392, POT.w, 100); c.clip();
      for (const i of [3, 4, 5, 1, 2, 0]) { if (s.fly && i === (s.fly.k === 'copy' ? 0 : s.fly.k === 'fresh' ? 1 : 3)) continue;
        const up = s.started && !g.done && i === pick ? 10 + 6 * Math.sin(t * 7) : 0, bx = at[i][0] + Math.sin(t * (5 + i) + i) * jig * 0.4, by = at[i][1] - up - Math.abs(Math.sin(t * (6 + i * 1.3) + i * 2)) * jig;
        SK.ball(c, bx, by, R[i], cols[i]); if (R[i] >= 17) N6.text(c, words[i], bx, by, SK.clamp(R[i] * 0.62, 12, 17), '#fff6ea', { stroke: 'rgba(30,14,36,0.85)' }); }
      c.restore();
      // the pot's body in front
      c.save(); const pg = c.createLinearGradient(POT.x - POT.w / 2, 0, POT.x + POT.w / 2, 0); pg.addColorStop(0, '#3a3a4a'); pg.addColorStop(0.35, '#8a8a9a'); pg.addColorStop(1, '#2a2a3a');
      c.fillStyle = pg; c.strokeStyle = '#1a1424'; c.lineWidth = 3; c.beginPath(); c.moveTo(POT.x - POT.w / 2, 392); c.lineTo(POT.x + POT.w / 2, 392); c.quadraticCurveTo(POT.x + POT.w / 2, 484, POT.x + 60, 484); c.lineTo(POT.x - 60, 484); c.quadraticCurveTo(POT.x - POT.w / 2, 484, POT.x - POT.w / 2, 392); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#5a5a6a'; c.beginPath(); c.roundRect(POT.x - POT.w / 2 - 8, 386, POT.w + 16, 12, 6); c.fill(); c.stroke();
      if (k === 'copy' && s.started) { c.fillStyle = 'rgba(190,230,255,0.55)'; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(POT.x - 70 + i * 28, 398); c.lineTo(POT.x - 64 + i * 28, 420 + (i % 2) * 8); c.lineTo(POT.x - 58 + i * 28, 398); c.fill(); } }
      if (k === 'soup') for (let i = 0; i < 4; i++) { const q = (t * 1.5 + i * 0.25) % 1; c.fillStyle = `rgba(255,255,255,${0.5 * (1 - q)})`; c.beginPath(); c.arc(POT.x - 50 + i * 34 + Math.sin(t * 3 + i) * 8, 380 - q * 70, 10 + q * 12, 0, 7); c.fill(); }
      c.restore();
      SK.tag(c, 'Next word', POT.x, 460, 18);
      // the word flying up to the poem
      if (s.fly) { const q = SK.easeInOut((t - s.fly.t) / FLY), ex = x0 + 60 + s.cur.length * 70, ey = SCROLL.top + (s.lines.length + 1) * SCROLL.gap;
        const bx = SK.lerp(POT.x, ex, q), by = SK.lerp(370, ey, q) - Math.sin(q * Math.PI) * 40; SK.ball(c, bx, by, 26 - q * 10, s.fly.k === 'copy' ? '#5aa8f0' : s.fly.k === 'soup' ? '#e8563a' : '#f5c23a'); N6.text(c, s.fly.w, bx, by - 26, 18, '#fff6ea'); }
      // the thermometer
      const ty = h => SK.lerp(TH.y1 - 18, TH.y0 + 14, h);
      c.save(); c.fillStyle = 'rgba(20,10,30,0.5)'; c.beginPath(); c.roundRect(TH.x - 20, TH.y0 - 8, 40, TH.y1 - TH.y0 + 30, 20); c.fill();
      c.fillStyle = '#fff6ea'; c.beginPath(); c.roundRect(TH.x - 9, TH.y0, 18, TH.y1 - TH.y0, 9); c.fill(); c.beginPath(); c.arc(TH.x, TH.y1, 15, 0, 7); c.fill();
      c.fillStyle = 'rgba(90,208,120,0.85)'; c.fillRect(TH.x - 9, ty(L.hi), 18, ty(L.lo) - ty(L.hi));
      c.fillStyle = 'rgba(120,180,255,0.4)'; c.fillRect(TH.x - 9, ty(L.lo), 18, TH.y1 - ty(L.lo));
      c.fillStyle = 'rgba(255,120,90,0.35)'; c.fillRect(TH.x - 9, TH.y0 + 4, 18, ty(L.hi) - TH.y0 - 4);
      const merc = k === 'fresh' ? '#2aa84a' : k === 'copy' ? '#3a7ad8' : '#e8303a'; c.fillStyle = merc; c.fillRect(TH.x - 4, ty(s.h), 8, TH.y1 - ty(s.h)); c.beginPath(); c.arc(TH.x, TH.y1, 11, 0, 7); c.fill();
      c.strokeStyle = '#2a1430'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(TH.x - 9, TH.y0, 18, TH.y1 - TH.y0 - 12, 9); c.stroke();
      N6.tri(c, TH.x - 22, ty(s.h), 0, 9, '#fff6ea'); c.restore();
      SK.tag(c, 'Temperature', TH.x - 38, TH.y0 - 24, 18);
      // which way to go: an arrow on the thermometer while the poem is being written
      if (!g.done && s.started && k !== 'fresh') { const up = k === 'copy', ay = up ? ty(L.lo) + 26 : ty(L.hi) - 26, bob = Math.sin(t * 8) * 4; N6.tri(c, TH.x + 26, ay + (up ? -bob : bob), up ? -Math.PI / 2 : Math.PI / 2, 12, up ? '#8ad0ff' : '#ff8a6a'); }
      // the owl poet
      SK.animal(c, 'owl', 38, 500, 1.25, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : s.struck ? (s.struck.kind === 'soup' ? 'wow' : 'sad') : 'think' });
      // the hold button
      N6.button(c, BTN.x, BTN.y, BTN.w, BTN.h, s.held ? 'Heating...' : k === 'soup' && s.started ? 'Let go to cool' : 'Hold to heat', s.held ? '#e8563a' : '#e8803a', s.held);
      const canHeat = !g.done && !s.held && s.h < L.lo + 0.08;
      if (canHeat) SK.glow(c, g, BTN.x, BTN.y, 40, '#ffe27a', { level: 1 });
      // guidance: hold just long enough to bring the heat into the middle of the green
      const need = Math.max(0.15, ((L.lo + L.hi) / 2 - s.h) / HEAT);
      SK.demo(g, c, 'hold', [BTN.x + 10, BTN.y + 6], null, { never: !canHeat, period: Math.max(0.8, need / 0.65) });
    },
    // the bot keeps the heat in the middle of the band: hold below it, let go above it
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 1.0) return; const mid = (s.L.lo + s.L.hi) / 2;
      if (!s.held && s.h < mid - 0.07) synth('down', BTN.x, BTN.y); else if (s.held && s.h > mid + 0.03) synth('up', BTN.x, BTN.y);
    },
  });
})();
