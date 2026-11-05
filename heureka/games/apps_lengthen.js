// LENGTHEN! (cs SC-10) — your password is one word, and a fox is speed-reading its guess book (every possible password,
// in order) toward it: its progress bar is filling fast. Word bubbles float up: tap random words ("otter", "piano") to
// add them to the password. Each random word makes the guess book thousands of times bigger (the stack of volumes grows
// and the fox's bar drops back to almost nothing), until the stack is too heavy and the fox is buried under it. Bubbles
// with common tricks ("123", "!", "abc") add almost nothing: the fox flips to its "Common tricks" chapter and reads on.
// Level 0: add three words; level 1: four, faster fox; level 2: four, faster bubbles and more tricks.
(() => {
  const WORDS = ['otter', 'piano', 'cloud', 'tulip', 'robot', 'mango', 'violin', 'cactus', 'pebble', 'zebra', 'lemon', 'rocket', 'walrus', 'banjo', 'comet', 'teapot'];
  const TRICKS = ['123', '!', 'abc', '1', '2024', '!!'];
  const START = ['sunny', 'puppy', 'tiger', 'happy'], LIST = 7776; // a word list of 7,776 words (dice words)
  const PLANS = [{ need: 3, read: 6.5, rise: 55, trick: 0.25, gap: 0.75 }, { need: 4, read: 4.8, rise: 65, trick: 0.33, gap: 0.65 }, { need: 4, read: 4.0, rise: 85, trick: 0.45, gap: 0.55 }];
  const FIELD = { y0: 336, y1: 540 };
  function big(n) { const u = [[1e15, 'quadrillion'], [1e12, 'trillion'], [1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']]; for (const [v, w] of u) if (n >= v) { const x = n / v; return (x >= 100 ? Math.round(x) : x >= 10 ? Math.round(x) : x.toFixed(1)) + ' ' + w; } return String(Math.round(n)); }
  function paintRoom(o) {
    const wall = o.createLinearGradient(0, 0, 0, 640); wall.addColorStop(0, '#5a3a7a'); wall.addColorStop(0.5, '#8a5a8a'); wall.addColorStop(1, '#3a2850'); o.fillStyle = wall; o.fillRect(0, 0, 360, 640);
    o.fillStyle = 'rgba(255,255,255,0.05)'; for (let x = 0; x < 360; x += 40) o.fillRect(x, 0, 20, 300);
    // a lamp glow over the fox's desk
    const lg = o.createRadialGradient(110, 228, 10, 110, 228, 170); lg.addColorStop(0, 'rgba(255,220,140,0.45)'); lg.addColorStop(1, 'rgba(255,220,140,0)'); o.fillStyle = lg; o.fillRect(0, 60, 300, 260);
    o.fillStyle = '#6a4028'; o.fillRect(0, 314, 360, 14); o.fillStyle = '#4a2a18'; o.fillRect(0, 326, 360, 4);
    // the floor where the word bubbles float, and the keyboard strip at the bottom
    const fl = o.createLinearGradient(0, 330, 0, 640); fl.addColorStop(0, '#2a2048'); fl.addColorStop(1, '#1a1430'); o.fillStyle = fl; o.fillRect(0, 330, 360, 310);
    const r = P.rng(3); for (let i = 0; i < 40; i++) { o.fillStyle = `rgba(255,255,255,${0.05 + r() * 0.2})`; o.beginPath(); o.arc(r() * 360, 338 + r() * 200, 0.8 + r() * 1.5, 0, 7); o.fill(); }
  }
  function stack(c, s, t, lift) { // the guess book: more volumes the bigger it is
    const n = Math.min(14, 2 + s.words.length * 3), x0 = 196, base = 300;
    c.save(); c.translate(0, -lift);
    for (let i = 0; i < n; i++) { const w = 64 - (i % 3) * 5, h = 14, cl = Math.floor(i / 7), x = x0 + cl * 72 + (i % 2) * 6 - (i % 5) * 2, y = base - (i % 7 + 1) * h; const col = ['#c84a4a', '#4a7ac8', '#e8a83a', '#4aa86a', '#8a5ac8'][i % 5];
      c.fillStyle = col; c.beginPath(); c.roundRect(x, y, w, h - 1, 2); c.fill(); c.fillStyle = 'rgba(255,255,255,0.7)'; c.fillRect(x + 4, y + 3, w - 8, 2); c.fillStyle = P.shade(col, -0.4); c.fillRect(x + w - 8, y, 3, h - 1); }
    c.restore(); return base - Math.min(7, n) * 14;
  }
  function spawn(g) { const s = g.s, pl = s.pl, tr = g.rand() < pl.trick && s.since > 0, x = 50 + g.rand() * 260;
    let w; if (tr) w = TRICKS[Math.floor(g.rand() * TRICKS.length)]; else { const pool = WORDS.filter(q => !s.words.includes(q) && !s.bub.some(b => b.w === q)); w = pool[Math.floor(g.rand() * pool.length)] || 'otter'; }
    s.bub.push({ w, trick: tr, x, y: FIELD.y1 + 10, ph: g.rand() * 6, born: g.t }); s.since = tr ? 0 : s.since + 1; }
  MG.add({
    id: 'lengthen', stage: 'apps', cmd: 'ADD WORDS TO YOUR PASSWORD!', time: 7, mood: 'night', winText: 'Too many guesses!', failText: 'The fox got in!',
    card: { title: 'Long passwords are hard to guess', kind: 'Computer science', ref: 'Passphrases and guessing attacks',
      text: 'An attacker can guess passwords by trying every possibility, very fast. A password made of one common word is found quickly.\n\nEach random word you add multiplies the number of possible passwords. With a list of 7,776 words, two random words make about 60 million possibilities, and four make about 3.7 quadrillion.\n\nTricks like adding "123" or "!" help very little, because attackers try those common tricks first. Several random words beat one clever-looking word.',
      note: 'Every extra random word multiplies the guesses an attacker needs, so a few random words make a strong password.' },
    init(g) {
      const s = g.s; s.L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.pl = PLANS[s.L];
      s.words = []; s.base = START[s.v]; s.tricks = []; s.bub = []; s.p = 0.35; s.since = 0; s.nextB = 0.35; s.pops = []; s.flip = 0; s.found = 0; s.buried = 0;
      for (let i = 0; i < 3; i++) { s.since = 0; spawn(g); s.bub[i].y = FIELD.y1 - 60 - i * 70; }
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || s.found || s.buried) return;
      let best = null, bd = 44; for (const b of s.bub) { const d = Math.hypot(b.x + Math.sin(g.t * 1.6 + b.ph) * 12 - x, b.y - y); if (d < bd) { bd = d; best = b; } } if (!best) return;
      s.bub = s.bub.filter(b => b !== best); s.pops.push({ x: best.x, y: best.y, t: g.t, trick: best.trick });
      if (best.trick) { s.tricks.push(best.w); s.flip = g.t; g.sfx('boing'); g.sfx('laugh', { vol: 0.4 }); s.p = Math.min(0.999, s.p * 0.9); return; }
      s.words.push(best.w); s.p = s.p / LIST; s.grow = g.t; g.sfx('pop'); g.sfx('grow', { vol: 0.5 }); g.sfx('thud', { vol: 0.5 });
      if (s.words.length >= s.pl.need) { s.buried = g.t; g.sfx('crunch'); }
    },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      if (s.buried) { if (g.t - s.buried > 0.55) { g.win(); g.sfx('cheer'); } return; }
      if (s.found) { if (g.t - s.found > 0.7) { g.fail(); } return; }
      // the fox reads its book at a steady speed: guesses per second never change, only the size of the book does
      const total = Math.pow(LIST, 1 + s.words.length); s.p += dt / s.pl.read * (LIST / total) * 0.65;
      if (s.p >= 1) { s.p = 1; s.found = g.t; g.sfx('ding'); g.sfx('laugh'); }
      for (const b of s.bub) b.y -= s.pl.rise * dt; s.bub = s.bub.filter(b => b.y > FIELD.y0 + 8);
      if (g.t >= s.nextB && s.bub.length < 5) { spawn(g); s.nextB = g.t + s.pl.gap + g.rand() * 0.3; }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('lengthen_room', paintRoom), 0, 0, 360, 640);
      // the desk, the fox and its guess book
      c.fillStyle = '#8a5a3a'; c.fillRect(20, 300, 170, 14);
      const top = stack(c, s, t, 0);
      SK.tag(c, 'Guess book', 254, 300, 18);
      const crush = s.buried ? SK.clamp((t - s.buried) / 0.4, 0, 1) : won ? 1 : 0;
      SK.animal(c, 'fox', 100, 300 + crush * 10, 1.0 - crush * 0.15, { t, pose: s.found || lost ? 'cheer' : crush ? 'sad' : 'idle', expr: s.found ? 'laugh' : crush ? 'wow' : 'happy', facing: 1 });
      // the open book the fox is reading, pages flipping (to "Common tricks" after a trick)
      c.save(); c.translate(150, 278); c.fillStyle = '#fff6ea'; c.beginPath(); c.moveTo(-26, 0); c.lineTo(0, 6); c.lineTo(26, 0); c.lineTo(26, -26); c.lineTo(0, -20); c.lineTo(-26, -26); c.closePath(); c.fill(); c.strokeStyle = '#8a6a4a'; c.lineWidth = 1.5; c.stroke();
      c.strokeStyle = 'rgba(60,40,60,0.4)'; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-22, -20 + i * 5); c.lineTo(-4, -16 + i * 5); c.moveTo(4, -16 + i * 5); c.lineTo(22, -20 + i * 5); c.stroke(); }
      const fk = ((t * (s.words.length ? 6 : 10)) % 1); c.fillStyle = 'rgba(255,246,234,0.9)'; c.beginPath(); c.moveTo(0, 6); c.lineTo(0, -20); c.lineTo(26 * Math.cos(fk * Math.PI), -26); c.lineTo(26 * Math.cos(fk * Math.PI), 0); c.closePath(); c.fill(); c.restore();
      if (s.flip && t - s.flip < 1.2) SK.tag(c, 'Common tricks', 150, 230, 18, '#3a1640', 'rgba(255,212,90,0.95)');
      // a falling avalanche of volumes buries the fox at the end
      if (crush) for (let i = 0; i < 8; i++) { const k = SK.clamp(crush * 1.4 - i * 0.06, 0, 1), col = ['#c84a4a', '#4a7ac8', '#e8a83a', '#4aa86a'][i % 4]; c.save(); c.translate(SK.lerp(230 + (i % 3) * 14, 70 + i * 12, k), SK.lerp(178 - i * 8, 278 + (i % 3) * 8, k)); c.rotate(i + k * 2); c.fillStyle = col; c.fillRect(-18, -6, 36, 12); c.restore(); }
      // the fox's progress toward your password
      const BX = 22, BY = 146, BW = 316; c.save(); c.fillStyle = 'rgba(30,14,36,0.75)'; c.beginPath(); c.roundRect(BX - 6, BY - 4, BW + 12, 44, 14); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.12)'; c.beginPath(); c.roundRect(BX + 4, BY + 22, BW - 8, 12, 6); c.fill();
      const fw = Math.max(0.01, s.p); c.fillStyle = s.p > 0.7 ? '#ff5a4a' : s.p > 0.3 ? '#ffb040' : '#7ee8a0'; c.beginPath(); c.roundRect(BX + 4, BY + 22, Math.max(6, (BW - 8) * fw), 12, 6); c.fill(); c.restore();
      N5.text(c, big(Math.pow(LIST, 1 + s.words.length)) + ' guesses', 180, BY + 9, 18, '#fff6ea', { lw: 0 });
      // the password being built
      const pw = [s.base, ...s.words].join('-') + s.tricks.join(''); c.save(); c.fillStyle = 'rgba(255,255,255,0.92)'; c.beginPath(); c.roundRect(14, 556, 332, 44, 12); c.fill(); c.strokeStyle = '#ffd45a'; c.lineWidth = 3; c.stroke(); c.restore();
      c.save(); c.font = `800 ${pw.length > 26 ? 15 : 18}px ${N5.MONO}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#3a1640'; c.fillText(pw, 180, 579); c.restore();
      SK.tag(c, 'Password', 66, 552, 16);
      if (!g.done) N5.slots(c, s.words.length, s.pl.need, 290, 552);
      if (s.found) { const k = SK.clamp((t - s.found) * 3, 0, 1); c.save(); c.globalAlpha = k; SK.tag(c, 'Found it!', 100, 216, 22, '#fff6ea', 'rgba(200,40,40,0.92)'); c.restore(); }
      // the floating bubbles: random words (soft blue) and tricks (orange)
      for (const b of s.bub) { const x = b.x + Math.sin(t * 1.6 + b.ph) * 12, a = SK.clamp((FIELD.y1 + 10 - b.y) / 30, 0, 1) * SK.clamp((b.y - FIELD.y0) / 30, 0, 1);
        c.save(); c.globalAlpha = a; c.font = `900 19px Nunito, system-ui, sans-serif`; const w = Math.max(56, c.measureText(b.w).width + 28);
        const gr = c.createRadialGradient(x - w * 0.2, b.y - 10, 2, x, b.y, w * 0.6); gr.addColorStop(0, b.trick ? '#ffd8a0' : '#d8f0ff'); gr.addColorStop(1, b.trick ? '#e8803a' : '#5a9ae8'); c.fillStyle = gr; c.beginPath(); c.roundRect(x - w / 2, b.y - 20, w, 40, 20); c.fill(); c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 2; c.stroke();
        c.fillStyle = '#1a1430'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(b.w, x, b.y + 1); c.restore(); }
      for (const p of s.pops) { const k = (t - p.t) / 0.4; if (k > 1) continue; c.strokeStyle = `rgba(255,255,255,${1 - k})`; c.lineWidth = 3; c.beginPath(); c.arc(p.x, p.y, 20 + k * 30, 0, 7); c.stroke(); }
      // guidance: tap a random word (the highest one)
      if (!g.done && !s.buried) { const b = s.bub.filter(q => !q.trick && q.y < FIELD.y1 - 20).sort((a, b2) => a.y - b2.y)[0]; if (b) { const x = b.x + Math.sin(t * 1.6 + b.ph) * 12; SK.glow(c, g, x, b.y, 40); SK.demo(g, c, 'tap', [x, b.y + 6], null, { period: 0.9 }); } }
    },
    // the bot taps a random-word bubble every 0.6 s
    auto(g, dt, synth) { const s = g.s; if (g.done || g.t < (s.bt || 0.8)) return; const b = s.bub.filter(q => !q.trick && q.y < FIELD.y1 - 20).sort((a, b2) => a.y - b2.y)[0]; if (!b) return; s.bt = g.t + 0.6; const x = b.x + Math.sin(g.t * 1.6 + b.ph) * 12; synth('down', x, b.y); synth('up', x, b.y); },
  });
})();
