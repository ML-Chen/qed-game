// TITRATE! (chem_bio HC-30) — a lab bench: a flask of clear acid with a few drops of indicator, swirling on a stirrer
// under a tall burette of base. Press the Drip button: a tap lets out one drop, holding it pours a stream. Each drop of
// base makes a pink swirl where it lands, and the swirl fades as the acid uses the base up. The closer you get to the
// moment all the acid is used up, the more slowly each swirl fades. The drop that uses up the last of the acid leaves
// the whole flask pale pink, and it stays: that flask is done. One drop more and it flashes hot pink: too much.
// Level 0: one flask; level 1: two; level 2: three, with faster fades that are harder to read.
(() => {
  const BX = 150, FL = { x: 150, y: 500 }, BTN = { x: 292, y: 470, w: 112, h: 100 }, RATE = 6;
  const NS = [[8, 10, 9], [10, 8, 11], [9, 11, 8], [11, 9, 10]];
  const inBtn = (x, y) => Math.abs(x - BTN.x) <= BTN.w / 2 + 8 && Math.abs(y - BTN.y) <= BTN.h / 2 + 8;
  function paintBg(o) {
    const wall = o.createLinearGradient(0, 0, 0, 640); wall.addColorStop(0, '#e8e0f0'); wall.addColorStop(0.7, '#d8d0e8'); wall.addColorStop(1, '#c8c0d8'); o.fillStyle = wall; o.fillRect(0, 0, 360, 640);
    o.fillStyle = 'rgba(255,255,255,0.4)'; for (let y = 0; y < 560; y += 40) for (let x = (y / 40) % 2 ? 0 : 20; x < 360; x += 40) o.fillRect(x + 1, y + 1, 38, 38);
    // the bench
    const bn = o.createLinearGradient(0, 560, 0, 640); bn.addColorStop(0, '#4a4a5a'); bn.addColorStop(1, '#2a2a3a'); o.fillStyle = bn; o.fillRect(0, 560, 360, 80); o.fillStyle = '#6a6a7a'; o.fillRect(0, 560, 360, 6);
    // the stand and clamp
    o.fillStyle = '#3a3a4a'; o.fillRect(60, 548, 120, 12); o.fillRect(72, 110, 8, 440); o.fillRect(76, 300, BX - 70, 8); o.fillStyle = '#5a5a6a'; o.beginPath(); o.roundRect(BX - 12, 294, 24, 20, 5); o.fill();
    // a shelf with bottles
    o.fillStyle = '#8a7a6a'; o.fillRect(220, 160, 130, 8);
    for (const [x, col] of [[240, '#a8d8f0'], [276, '#f0c8a8'], [312, '#c8f0c8']]) { o.fillStyle = 'rgba(255,255,255,0.6)'; o.beginPath(); o.roundRect(x - 12, 112, 24, 48, 6); o.fill(); o.fillStyle = col; o.fillRect(x - 10, 132, 20, 26); }
  }
  function pinkOf(s) { const n = s.n, N = s.N; return n < N ? 0 : n === N ? 1 : 2; }
  function newFlask(s, g) { s.N = s.Ns[s.f]; s.n = 0; s.sw = []; s.okT = 0; s.inT = g.t; s.level = 1; }
  function fadeFor(s, r) { const k = s.lv >= 2 ? 0.75 : 1; return k * (r >= 4 ? 0.3 : r === 3 ? 0.5 : r === 2 ? 0.8 : 1.25); }
  function drop(g) { const s = g.s; if (g.done || s.okT) return; s.n++; const r = s.N - s.n; s.level = Math.max(0.15, s.level - 0.035); g.sfx('drip');
    s.falling.push({ t: g.t }); s.sw.push({ t: g.t + 0.18, life: r > 0 ? fadeFor(s, r) : 99, a: g.rand() * 6 });
    if (s.n === s.N) { s.endT = g.t + 0.18; } if (s.n > s.N) { s.hot = g.t + 0.18; } }
  MG.add({
    id: 'titrate', stage: 'reactions', cmd: 'DRIP UNTIL THE PINK STAYS!', time: 8, mood: 'desert', winText: 'Pale pink: the acid is used up!', failText: 'Too much! Hot pink!',
    card: { title: 'The colour that says "all used up"', kind: 'Chemistry', ref: 'Titration and indicators',
      text: 'An acid and a base cancel each other out when they react. In a titration you add a base to an acid one drop at a time, to find out exactly how much it takes.\n\nThe indicator in the flask is clear while there is acid left, and turns pink as soon as there is extra base. At first each drop of base is used up at once, so its pink swirl vanishes. Near the end there is little acid left, so each swirl lasts longer. The first pink that stays means the acid is all used up.\n\nOne drop too many, and the flask turns deep pink.',
      note: 'An indicator changes colour at the moment the acid is used up, so you add the base drop by drop and stop at the first pink that stays.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.lv = lv; s.v = SK.variant(g, 4); s.Ns = NS[s.v].slice(0, lv + 1); s.need = s.Ns.length; s.f = 0;
      s.pour = false; s.next = 0; s.falling = []; s.hot = 0; s.endT = 0; s.slide = 0; newFlask(s, g);
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.okT || !inBtn(x, y)) return; s.pour = true; s.pourT = g.t; s.next = g.t + 1 / RATE; drop(g); },
    up(g) { g.s.pour = false; },
    update(g, dt) {
      const s = g.s, t = g.t;
      if (s.pour && !g.done && t >= s.next) { s.next += 1 / RATE; drop(g); }
      s.falling = s.falling.filter(p => t - p.t < 0.2);
      s.slide = Math.max(0, s.slide - dt * 3);
      if (g.done) return;
      if (s.hot && t >= s.hot) { g.fail(); g.sfx('wrong'); g.sfx('laugh'); s.pour = false; return; }
      // the pink stays: this flask is done once no drop has followed for a moment
      if (s.endT && !s.hot && t - s.endT > 0.75 && !s.okT) { s.okT = t; s.pour = false; g.sfx('chime'); g.burst(FL.x, FL.y - 30, ['#ffb0d0', '#ffffff', '#ffd0e8'], 14, 120); }
      if (s.okT && t - s.okT > 0.35) { s.f++; if (s.f >= s.need) { g.win(); g.sfx('cheer'); } else { s.slide = 1; s.endT = 0; s.okT = 0; newFlask(s, g); g.sfx('swoosh'); } }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('titrate_bg', paintBg), 0, 0, 360, 640);
      // the burette: a tall glass tube with a scale, the base inside going down, and its tap
      c.fillStyle = 'rgba(255,255,255,0.55)'; c.strokeStyle = '#5a5a7a'; c.lineWidth = 2; c.beginPath(); c.roundRect(BX - 10, 120, 20, 250, 4); c.fill(); c.stroke();
      const top = 128 + (1 - s.level) * 230; c.fillStyle = 'rgba(180,220,255,0.7)'; c.fillRect(BX - 8, top, 16, 368 - top);
      c.strokeStyle = 'rgba(60,60,90,0.6)'; c.lineWidth = 1; for (let y = 134; y < 366; y += 12) { c.beginPath(); c.moveTo(BX - 10, y); c.lineTo(BX - (y % 60 < 12 ? 2 : 5), y); c.stroke(); }
      c.fillStyle = '#d8d8e8'; c.strokeStyle = '#4a4a6a'; c.lineWidth = 2; c.beginPath(); c.moveTo(BX - 4, 370); c.lineTo(BX + 4, 370); c.lineTo(BX + 2, 404); c.lineTo(BX - 2, 404); c.closePath(); c.fill(); c.stroke();
      const open = s.pour || t - (s.pourT || -9) < 0.1; c.save(); c.translate(BX, 384); c.rotate(open ? Math.PI / 2 : 0); c.fillStyle = '#3a6ad8'; c.beginPath(); c.roundRect(-16, -4, 32, 8, 4); c.fill(); c.restore();
      SK.tag(c, 'Base', BX + 40, 200, 18);
      for (const p of s.falling) { const k = (t - p.t) / 0.18; c.fillStyle = 'rgba(180,220,255,0.95)'; c.beginPath(); c.ellipse(BX, 406 + k * 70, 3, 4.5, 0, 0, 7); c.fill(); }
      if (s.pour) { c.strokeStyle = 'rgba(180,220,255,0.8)'; c.lineWidth = 3; c.beginPath(); c.moveTo(BX, 406); c.lineTo(BX, 478); c.stroke(); }
      // the flask on the stirrer: clear acid, pink swirls, the lasting pink
      const ox = s.slide * -260; c.save(); c.translate(ox + FL.x, 556); c.scale(1.4, 1.4); c.translate(-FL.x, -556);
      c.fillStyle = '#5a5a6a'; c.beginPath(); c.roundRect(FL.x - 54, 548, 108, 14, 4); c.fill(); c.fillStyle = '#7a7a8a'; c.fillRect(FL.x - 54, 548, 108, 4);
      const flask = () => { c.beginPath(); c.moveTo(FL.x - 12, 432); c.lineTo(FL.x - 12, 466); c.lineTo(FL.x - 48, 540); c.quadraticCurveTo(FL.x - 50, 548, FL.x - 40, 548); c.lineTo(FL.x + 40, 548); c.quadraticCurveTo(FL.x + 50, 548, FL.x + 48, 540); c.lineTo(FL.x + 12, 466); c.lineTo(FL.x + 12, 432); };
      c.save(); flask(); c.clip(); const pk = pinkOf(s), wave = Math.sin(t * 6) * 2;
      c.fillStyle = pk === 2 && t >= s.hot ? '#ff3aa8' : pk >= 1 && t >= s.endT ? '#ffc8e0' : 'rgba(225,240,255,0.85)'; c.beginPath(); c.moveTo(FL.x - 60, 492 + wave); c.quadraticCurveTo(FL.x, 486 - wave, FL.x + 60, 492 + wave); c.lineTo(FL.x + 60, 560); c.lineTo(FL.x - 60, 560); c.closePath(); c.fill();
      for (const w of s.sw) { const k = (t - w.t) / w.life; if (t < w.t || k > 1) continue; const a = (1 - k) * 0.9; c.fillStyle = `rgba(255,70,170,${a})`; for (let i = 0; i < 5; i++) { const ang = w.a + i * 1.25 + (t - w.t) * 4, rr = 6 + (t - w.t) * 26 + i * 3; c.beginPath(); c.ellipse(FL.x + Math.cos(ang) * rr, 520 + Math.sin(ang) * rr * 0.4, 9 - i, 5, ang, 0, 7); c.fill(); } }
      c.restore();
      c.strokeStyle = '#5a5a7a'; c.lineWidth = 3; flask(); c.stroke(); c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.moveTo(FL.x - 30, 520); c.lineTo(FL.x - 14, 474); c.lineTo(FL.x - 10, 476); c.lineTo(FL.x - 24, 526); c.fill();
      c.save(); c.translate(FL.x, 538); c.rotate(t * 8); c.fillStyle = '#fff'; c.fillRect(-9, -2, 18, 4); c.restore();
      c.restore();
      if (!g.done) { SK.tag(c, 'Acid', FL.x - 96, 470, 18); SK.tag(c, 'Flask ' + Math.min(s.f + 1, s.need) + ' / ' + s.need, 290, 600, 18); }
      // the Drip button
      c.save(); c.translate(BTN.x, BTN.y + (s.pour ? 3 : 0)); c.fillStyle = 'rgba(30,14,36,0.3)'; c.beginPath(); c.roundRect(-BTN.w / 2, -BTN.h / 2 + 6, BTN.w, BTN.h, 20); c.fill();
      const bg = c.createLinearGradient(0, -BTN.h / 2, 0, BTN.h / 2); bg.addColorStop(0, '#6a9ae8'); bg.addColorStop(1, '#3a5ab8'); c.fillStyle = bg; c.strokeStyle = '#1a2a5a'; c.lineWidth = 3; c.beginPath(); c.roundRect(-BTN.w / 2, -BTN.h / 2, BTN.w, BTN.h, 20); c.fill(); c.stroke();
      c.fillStyle = '#bfe8ff'; c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -36); c.quadraticCurveTo(16, -10, 0, -4); c.quadraticCurveTo(-16, -10, 0, -36); c.fill(); c.stroke();
      c.font = '900 22px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 4; c.strokeStyle = 'rgba(20,10,30,0.6)'; c.strokeText('Drip', 0, 22); c.fillStyle = '#fff6ea'; c.fillText('Drip', 0, 22); c.restore();
      SK.animal(c, 'octopus', 300, 390, 0.75, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : s.N - s.n <= 2 ? 'think' : 'happy', facing: -1 });
      if (s.okT || (s.endT && t >= s.endT && !s.hot && !g.done)) SK.tag(c, 'It stays pink!', FL.x + 20, 360, 18, '#fff6ea', 'rgba(200,60,140,0.92)');
      // guidance: hold to pour while far from the end, then single taps, each once the last swirl has faded
      if (g.done || s.okT || s.endT) return; const r = s.N - s.n, swirling = s.sw.some(w => t < w.t + w.life);
      if (r >= 6 && !s.pour) { SK.glow(c, g, BTN.x, BTN.y, 56, '#ffe27a', { level: 2 }); SK.demo(g, c, 'hold', [BTN.x, BTN.y + 10], null, { period: (((r - 2) - 1) / RATE + 0.08) / 0.65 }); return; }
      if (!swirling && !s.pour) SK.glow(c, g, BTN.x, BTN.y, 56, '#ffe27a', { level: 2 });
      SK.demo(g, c, 'tap', [BTN.x, BTN.y + 10], null, { never: swirling || s.pour });
    },
    auto(g, dt, synth) {
      const s = g.s, t = g.t; if (g.done || t < 0.8 || s.okT || s.endT) { if (s.pour) synth('up', BTN.x, BTN.y); return; } const B = s._tb = s._tb || { at: 0 };
      if (s.pour) { if (s.N - s.n <= 2) synth('up', BTN.x, BTN.y); return; }
      if (t < B.at || s.sw.some(w => t < w.t + w.life)) return;
      if (s.N - s.n >= 6) { synth('down', BTN.x, BTN.y); return; }
      synth('down', BTN.x, BTN.y); synth('up', BTN.x, BTN.y); B.at = t + 0.1;
    },
  });
})();
