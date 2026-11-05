// STAY COOL! (chem_bio HB-12) — a hiker walks out of a snowstorm into a hot desert (and back, at higher levels), with a
// penguin friend cheering from the side. A big dial shows the hiker's body heat, with a green band in the middle. The
// snow keeps pulling the needle toward cold, the desert toward hot. Tap Shiver: the muscles twitch and make heat, and
// the needle climbs. Tap Sweat: drops appear, they evaporate and carry heat away, and the needle falls. Keep the needle
// in the band until the hiker reaches the far side. Shiver in the desert, or sweat in the snow, and it runs away: the
// hiker turns red (or blue) and sits down, puffing. Level 0: snow, then desert; level 1: snow, desert, snow; level 2:
// four zones and stronger weather.
(() => {
  const GROUND = 474, X0 = 40, X1 = 322, DIAL = { x: 180, y: 262, r: 88 }, BAND = 0.12, KICK = 0.17, FAIL = 0.4;
  const ZONES = [[['snow', 0, 172], ['desert', 172, 360]], [['snow', 0, 120], ['desert', 120, 236], ['snow', 236, 360]], [['desert', 0, 96], ['snow', 96, 180], ['desert', 180, 268], ['snow', 268, 360]]];
  const SWEAT = { x: 92, y: 568, w: 150, h: 70, col: '#3a9ad8' }, SHIV = { x: 268, y: 568, w: 150, h: 70, col: '#e8803a' };
  const inBtn = (b, x, y) => Math.abs(x - b.x) <= b.w / 2 + 6 && Math.abs(y - b.y) <= b.h / 2 + 8;
  function paintZone(o, k) {
    const gr = o.createLinearGradient(0, 0, 0, 640);
    if (k === 'snow') { gr.addColorStop(0, '#6a7a9a'); gr.addColorStop(0.6, '#b8c8dc'); gr.addColorStop(1, '#e8f0f8'); }
    else { gr.addColorStop(0, '#f0a040'); gr.addColorStop(0.6, '#ffd890'); gr.addColorStop(1, '#fff0c0'); }
    o.fillStyle = gr; o.fillRect(0, 0, 360, 640);
    o.fillStyle = k === 'snow' ? '#f4f8ff' : '#e8c070'; o.beginPath(); o.moveTo(0, GROUND - 10); for (let x = 0; x <= 360; x += 8) o.lineTo(x, GROUND - 10 - Math.sin(x * 0.04) * 8); o.lineTo(360, 640); o.lineTo(0, 640); o.closePath(); o.fill();
    o.fillStyle = k === 'snow' ? '#d8e4f4' : '#d0a050'; o.fillRect(0, GROUND + 30, 360, 140);
  }
  function paintBg(o, lv) {
    // the zones blend into each other: each is painted whole, then faded in across its edges
    for (const [k, a, b] of ZONES[lv]) {
      const cv = document.createElement('canvas'); cv.width = 720; cv.height = 1280; const q = cv.getContext('2d'); q.scale(2, 2); paintZone(q, k);
      const mx = (a + b) / 2 + 24;
      if (k === 'desert') { const sg = q.createRadialGradient((a + b) / 2, 150, 4, (a + b) / 2, 150, 60); sg.addColorStop(0, 'rgba(255,255,220,1)'); sg.addColorStop(0.3, 'rgba(255,240,160,0.9)'); sg.addColorStop(1, 'rgba(255,220,120,0)'); q.fillStyle = sg; q.fillRect(a - 40, 90, b - a + 80, 130);
        q.fillStyle = '#5a9a4a'; q.beginPath(); q.roundRect(mx - 7, GROUND - 74, 14, 66, 7); q.fill(); q.beginPath(); q.roundRect(mx - 24, GROUND - 56, 10, 26, 5); q.fill(); q.beginPath(); q.roundRect(mx + 14, GROUND - 64, 10, 30, 5); q.fill(); q.fillRect(mx - 20, GROUND - 36, 14, 8); q.fillRect(mx + 6, GROUND - 40, 14, 8); }
      else { q.fillStyle = '#3a6a5a'; for (let i = 0; i < 3; i++) { q.beginPath(); q.moveTo(mx - 22 + i * 4, GROUND - 30 - i * 22); q.lineTo(mx, GROUND - 76 - i * 22); q.lineTo(mx + 22 - i * 4, GROUND - 30 - i * 22); q.fill(); } q.fillStyle = '#fff'; q.beginPath(); q.moveTo(mx - 8, GROUND - 84); q.lineTo(mx, GROUND - 120); q.lineTo(mx + 8, GROUND - 84); q.fill(); }
      q.globalCompositeOperation = 'destination-in'; const m = q.createLinearGradient(0, 0, 360, 0), E = 26;
      const st = (x, al) => m.addColorStop(SK.clamp(x / 360, 0, 1), `rgba(0,0,0,${al})`);
      if (a > 0) { st(a - E, 0); st(a + E, 1); } else st(0, 1); if (b < 360) { st(b - E, 1); st(b + E, 0); } else st(1 * 360, 1);
      q.fillStyle = m; q.fillRect(0, 0, 360, 640); o.drawImage(cv, 0, 0, 360, 640);
    }
    o.fillStyle = 'rgba(255,255,255,0.15)'; o.fillRect(0, 520, 360, 120);
  }
  function zoneAt(lv, x) { return ZONES[lv].find(([, a, b]) => x >= a && x < b) || ZONES[lv][ZONES[lv].length - 1]; }
  function button(c, b, label, active, pressed, t, icon) {
    c.save(); c.translate(b.x, b.y + (pressed ? 3 : 0));
    c.fillStyle = 'rgba(30,14,36,0.35)'; c.beginPath(); c.roundRect(-b.w / 2, -b.h / 2 + 6, b.w, b.h, 18); c.fill();
    const gr = c.createLinearGradient(0, -b.h / 2, 0, b.h / 2); gr.addColorStop(0, P.shade(b.col, active ? 0.25 : -0.05)); gr.addColorStop(1, P.shade(b.col, active ? -0.2 : -0.4));
    c.fillStyle = gr; c.strokeStyle = '#1a2a3a'; c.lineWidth = 3; c.beginPath(); c.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 18); c.fill(); c.stroke();
    // icon: drops for sweat, a zigzag for shiver
    c.save(); c.translate(-44, 0); c.strokeStyle = '#fff6ea'; c.fillStyle = '#bfe8ff'; c.lineWidth = 3;
    if (icon === 'sweat') for (const [dx, dy] of [[-6, -8], [6, 4]]) { c.beginPath(); c.moveTo(dx, dy - 10); c.quadraticCurveTo(dx + 8, dy + 2, dx, dy + 6); c.quadraticCurveTo(dx - 8, dy + 2, dx, dy - 10); c.fill(); c.stroke(); }
    else { c.beginPath(); c.moveTo(-12, -10); for (let i = 0; i < 6; i++) c.lineTo(-12 + i * 5, i % 2 ? 10 : -10); c.stroke(); }
    c.restore();
    c.font = '900 24px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 4; c.strokeStyle = 'rgba(20,10,30,0.6)'; c.strokeText(label, 16, 0); c.fillStyle = '#fff6ea'; c.fillText(label, 16, 0);
    c.restore();
  }
  MG.add({
    id: 'staycool', stage: 'body', cmd: 'KEEP THE NEEDLE IN THE GREEN!', time: 7, mood: 'bright', winText: 'Steady body heat all the way!', failText: 'Overheated!',
    card: { title: 'Your body\'s thermostat', kind: 'Biology', ref: 'Homeostasis: sweating and shivering',
      text: 'Your body works best at about 37 °C, so it keeps its inside temperature steady whatever the weather.\n\nWhen you get too hot, your skin sweats. The sweat evaporates, and that carries heat away and cools you. When you get too cold, your muscles shiver: lots of tiny twitches that make heat.\n\nA part of the brain watches your temperature like a thermostat and switches these on when you drift out of the safe range. Keeping the inside of the body steady like this is called homeostasis.',
      note: 'The body keeps its temperature steady by sweating when it is too hot and shivering when it is too cold.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.lv = lv; s.v = SK.variant(g, 4);
      s.x = X0; s.T = [0.02, -0.02, 0.04, -0.04][s.v]; s.push = 0; s.sweatT = -9; s.shivT = -9; s.k = lv >= 2 ? 2.0 : 1; s.speed = (X1 - X0) / [8, 9.5, 9][lv];
      s.outfit = [['#e8403a', '#3f5a8a'], ['#2f8f8a', '#4a3a2a'], ['#e8a33a', '#3a4a6a'], ['#8a4d7a', '#2a3a4a']][s.v]; s.endT = 0; s.flakes = [];
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return;
      if (inBtn(SWEAT, x, y)) { s.push -= KICK; s.sweatT = g.t; g.sfx('drip'); g.sfx('splash', { vol: 0.3 }); }
      else if (inBtn(SHIV, x, y)) { s.push += KICK; s.shivT = g.t; g.sfx('stretch', { vol: 0.5 }); g.sfx('click'); } },
    update(g, dt) {
      const s = g.s, t = g.t; if (g.done) return;
      const [zk] = zoneAt(s.lv, s.x), drift = (zk === 'snow' ? -0.062 : 0.066) * s.k;
      const step = Math.sign(s.push) * Math.min(Math.abs(s.push), 0.5 * dt); s.push -= step;
      s.T += drift * dt + step;
      if (t > 0.6) s.x += s.speed * dt;
      s.out = Math.abs(s.T) > BAND ? (s.out || 0) + dt : 0; // out of the green band for too long, or far out: the hiker gives up
      if (Math.abs(s.T) >= FAIL || s.out > 1.5) { s.endT = t; g.fail(); g.sfx('fail'); g.sfx('laugh'); return; }
      if (s.x >= X1) { s.x = X1; s.endT = t; g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', [zk] = zoneAt(s.lv, s.x);
      c.drawImage(g.bake('staycool_bg' + s.lv, o => paintBg(o, s.lv)), 0, 0, 360, 640);
      // weather: snow falls in the snow zones, heat shimmers over the desert
      for (const [k, a, b] of ZONES[s.lv]) { if (k === 'snow') { c.fillStyle = 'rgba(255,255,255,0.9)'; for (let i = 0; i < 24; i++) { const x = a + ((i * 37 + t * 30) % (b - a)), y = 120 + ((i * 53 + t * 90) % 360); c.beginPath(); c.arc(x + Math.sin(t * 2 + i) * 6, y, 2.2, 0, 7); c.fill(); } }
        else { c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 2; for (let i = 0; i < 4; i++) { const y = GROUND - 30 - i * 26; c.beginPath(); for (let x = a + 6; x < b - 6; x += 6) c[x === a + 6 ? 'moveTo' : 'lineTo'](x, y + Math.sin(x * 0.12 + t * 5 + i) * 3); c.stroke(); } } }
      // the hiker: shivers, sweats, flushes red or blue, and sits down when it all goes wrong
      const hot = SK.clamp(s.T / FAIL, -1, 1), shiv = t - s.shivT < 0.5, sw = t - s.sweatT < 0.7, jit = shiv ? Math.sin(t * 60) * 2.5 : 0;
      const skin = hot > 0 ? P.mix('#e6c29c', '#ff7a6a', hot) : P.mix('#e6c29c', '#9ab8e8', -hot);
      P.person(c, s.x + jit, GROUND + (lost ? 14 : 0), 1.35, { t: lost || won ? 0 : t * 1.4, outfit: 'modern', robe: s.outfit[0], pants: s.outfit[1], hoodie: true, skin, hair: '#3b2416', expr: lost ? 'sad' : won ? 'laugh' : Math.abs(hot) > 0.5 ? 'wow' : 'happy', arms: won ? 'up' : 'down', bounce: lost ? 0 : 2 });
      if (sw) for (let i = 0; i < 4; i++) { const q = ((t - s.sweatT) * 1.6 + i * 0.25) % 1; c.fillStyle = `rgba(140,200,255,${1 - q})`; c.beginPath(); c.ellipse(s.x - 18 + i * 12, GROUND - 92 + q * 30, 3, 4.5, 0, 0, 7); c.fill(); c.fillStyle = `rgba(255,255,255,${0.4 * q})`; c.beginPath(); c.arc(s.x - 18 + i * 12, GROUND - 100 - q * 26, 4 + q * 5, 0, 7); c.fill(); }
      if (shiv) { c.strokeStyle = 'rgba(255,140,60,0.8)'; c.lineWidth = 2.5; for (const d of [-1, 1]) { c.beginPath(); c.moveTo(s.x + d * 30, GROUND - 70); for (let i = 1; i < 5; i++) c.lineTo(s.x + d * (30 + i * 4), GROUND - 70 + (i % 2 ? -8 : 8)); c.stroke(); } }
      // the finish flag
      c.strokeStyle = '#5a4a3a'; c.lineWidth = 3; c.beginPath(); c.moveTo(X1 + 18, GROUND + 6); c.lineTo(X1 + 18, GROUND - 70); c.stroke(); c.fillStyle = '#e8403a'; c.beginPath(); c.moveTo(X1 + 18, GROUND - 70); c.lineTo(X1 + 40, GROUND - 62); c.lineTo(X1 + 18, GROUND - 54); c.fill();
      // the penguin friend
      SK.animal(c, 'penguin', 22, GROUND + 14, 0.6, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: 1 });
      // the dial: body heat, blue (cold) to red (hot), with the green band in the middle
      const D = DIAL, ang = v => Math.PI + (SK.clamp(v / FAIL, -1, 1) + 1) / 2 * Math.PI;
      c.fillStyle = 'rgba(30,14,36,0.6)'; c.beginPath(); c.arc(D.x, D.y, D.r + 14, Math.PI, 0); c.closePath(); c.fill();
      for (let i = 0; i < 40; i++) { const v0 = -FAIL + i / 40 * 2 * FAIL, v1 = v0 + 2 * FAIL / 40; c.strokeStyle = Math.abs(v0 + FAIL / 40) <= BAND ? '#5ad07a' : v0 < 0 ? P.mix('#3a6ae8', '#bfe0ff', 1 + v0 / FAIL) : P.mix('#ffd0b0', '#e83a2a', v1 / FAIL); c.lineWidth = 18; c.beginPath(); c.arc(D.x, D.y, D.r - 6, ang(v0), ang(v1) + 0.01); c.stroke(); }
      const a = ang(s.T); c.strokeStyle = '#fff6ea'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(D.x, D.y); c.lineTo(D.x + Math.cos(a) * (D.r - 4), D.y + Math.sin(a) * (D.r - 4)); c.stroke(); c.fillStyle = '#fff6ea'; c.beginPath(); c.arc(D.x, D.y, 8, 0, 7); c.fill();
      SK.tag(c, 'Body heat', D.x, D.y + 22, 18);
      if (!g.done && Math.abs(s.T) > BAND) SK.tag(c, (s.T > 0 ? 'Too hot!' : 'Too cold!'), D.x, D.y - D.r - 30, 18, '#fff6ea', s.T > 0 ? 'rgba(200,50,30,0.9)' : 'rgba(40,80,190,0.9)');
      SK.tag(c, zk === 'snow' ? 'Snow' : 'Desert', SK.clamp(s.x, 50, 310), GROUND + 40, 18, '#fff6ea', zk === 'snow' ? 'rgba(60,90,150,0.85)' : 'rgba(170,100,30,0.85)');
      button(c, SWEAT, 'Sweat', !g.done && s.T > BAND * 0.3, t - s.sweatT < 0.15, t, 'sweat');
      button(c, SHIV, 'Shiver', !g.done && s.T < -BAND * 0.3, t - s.shivT < 0.15, t, 'shiver');
      // guidance: the hand taps the response that brings the needle back toward the middle
      if (g.done) return; const drift = zk === 'snow' ? -1 : 1, ahead = s.T + s.push + drift * 0.058 * s.k * 0.8;
      const B = ahead > 0.05 ? SWEAT : ahead < -0.05 ? SHIV : null;
      if (B) SK.glow(c, g, B.x, B.y, 46, '#ffe27a', { level: 2 });
      SK.demo(g, c, 'tap', B ? [B.x + 10, B.y + 6] : [180, 560], null, { never: !B });
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 0.7) return; const B = s._sb = s._sb || { at: 0 }; if (g.t < B.at) return;
      const ahead = s.T + s.push; if (ahead > 0.06) { synth('down', SWEAT.x, SWEAT.y); synth('up', SWEAT.x, SWEAT.y); B.at = g.t + 0.35; } else if (ahead < -0.06) { synth('down', SHIV.x, SHIV.y); synth('up', SHIV.x, SHIV.y); B.at = g.t + 0.35; }
    },
  });
})();
