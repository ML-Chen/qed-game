// TUG! (physics PMS-03) — tug of war on a frozen lake at night. A sled with a giant carrot sits on the ice between the
// rabbit's snow bank and the fox's. Each pull is an arrow on the sled: the rabbit's points left, the fox's right. Mash to
// pull: every tap makes the rabbit's arrow longer, and it shrinks when you rest. The leftover arrow (the net force) is drawn
// under the sled, and the sled speeds up the way it points (on ice nothing else pushes on it). Rest too long and the fox's
// arrow wins: the sled slides off to the fox and the rabbit is yanked face-first across the ice.
// Level 2: two foxes pull together.
(() => {
  const Y = 440, BANK_L = 92, BANK_R = 268, RX = 40, FX = 322, S = 1.0; // S: arrow pixels per unit of pull
  function paintLake(o) {
    const sky = o.createLinearGradient(0, 0, 0, Y); sky.addColorStop(0, '#0e1238'); sky.addColorStop(0.6, '#2a2a70'); sky.addColorStop(1, '#6a5a9a'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    const rnd = P.rng(5); for (let i = 0; i < 90; i++) { o.fillStyle = `rgba(255,250,230,${0.3 + rnd() * 0.7})`; o.beginPath(); o.arc(rnd() * 360, rnd() * 330, 0.5 + rnd() * 1.3, 0, 7); o.fill(); }
    // aurora ribbons
    for (const [col, y0, a] of [['rgba(110,240,180,', 200, 0.28], ['rgba(240,130,220,', 250, 0.2], ['rgba(110,200,255,', 170, 0.18]]) {
      for (let k = 0; k < 14; k++) { o.strokeStyle = col + (a * (1 - k / 14)) + ')'; o.lineWidth = 6; o.beginPath(); for (let x = -10; x <= 370; x += 10) { const y = y0 + Math.sin(x / 60 + y0) * 26 + Math.sin(x / 23) * 6 - k * 5; x < 0 ? o.moveTo(x, y) : o.lineTo(x, y); } o.stroke(); }
    }
    // far hills and pines
    o.fillStyle = '#3a3a72'; o.beginPath(); o.moveTo(0, 370); for (let x = 0; x <= 360; x += 20) o.lineTo(x, 350 - Math.sin(x / 50) * 20 - Math.sin(x / 17) * 6); o.lineTo(360, 390); o.lineTo(0, 390); o.fill();
    o.fillStyle = '#26285a'; for (let i = 0; i < 12; i++) { const x = i * 32 + rnd() * 12, h = 30 + rnd() * 26; o.beginPath(); o.moveTo(x - 10, 390); o.lineTo(x, 390 - h); o.lineTo(x + 10, 390); o.fill(); }
    // the ice
    const ice = o.createLinearGradient(0, 382, 0, 640); ice.addColorStop(0, '#8a9ad8'); ice.addColorStop(0.3, '#b8c8f0'); ice.addColorStop(1, '#6a7ab8'); o.fillStyle = ice; o.fillRect(0, 382, 360, 258);
    o.strokeStyle = 'rgba(255,255,255,0.4)'; o.lineWidth = 1.2; for (let i = 0; i < 22; i++) { const x = rnd() * 360, y = 400 + rnd() * 220, l = 20 + rnd() * 60; o.beginPath(); o.moveTo(x, y); o.lineTo(x + l, y + (rnd() - 0.5) * 6); o.stroke(); }
    o.fillStyle = 'rgba(255,255,255,0.18)'; o.beginPath(); o.ellipse(180, 520, 120, 10, 0, 0, 7); o.fill();
    // the two snow banks
    for (const [x0, x1] of [[-20, BANK_L - 8], [BANK_R + 8, 380]]) { const gr = o.createLinearGradient(0, Y - 30, 0, 640); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#c8d0f0'); o.fillStyle = gr; o.beginPath(); o.moveTo(x0, 640); o.lineTo(x0, Y + 4); o.quadraticCurveTo((x0 + x1) / 2, Y - 14, x1, Y + 4); o.quadraticCurveTo(x1 + 16, Y + 60, x1 + 6, 640); o.closePath(); o.fill(); }
    // the finish marks on the ice: a red flag line at each bank
    for (const [x, col] of [[BANK_L + 18, '#ff8a5a'], [BANK_R - 18, '#c84040']]) { o.strokeStyle = col; o.globalAlpha = 0.6; o.lineWidth = 4; o.setLineDash([8, 8]); o.beginPath(); o.moveTo(x, Y - 4); o.lineTo(x, 640); o.stroke(); o.setLineDash([]); o.globalAlpha = 1; }
  }
  function arrow(c, x0, y0, len, col, w) { // a horizontal arrow from x0, len signed
    if (Math.abs(len) < 3) return; const d = Math.sign(len), L = Math.abs(len), hd = Math.min(L, w * 1.6);
    c.save(); c.translate(x0, y0); c.scale(d, 1); c.fillStyle = col; c.strokeStyle = 'rgba(20,10,40,0.7)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(0, -w / 2); c.lineTo(L - hd, -w / 2); c.lineTo(L - hd, -w * 1.25); c.lineTo(L, 0); c.lineTo(L - hd, w * 1.25); c.lineTo(L - hd, w / 2); c.lineTo(0, w / 2); c.closePath(); c.fill(); c.stroke(); c.restore();
  }
  function sled(c, x, t) {
    c.save(); c.translate(x, Y); c.scale(1.3, 1.3); c.translate(-x, -Y);
    SK.shadow(c, x, Y + 3, 40, 4, 0.3);
    c.strokeStyle = '#c8a040'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 40, Y); c.lineTo(x + 34, Y); c.quadraticCurveTo(x + 46, Y, x + 44, Y - 10); c.stroke();
    c.fillStyle = '#b8402a'; c.beginPath(); c.roundRect(x - 38, Y - 18, 76, 12, 4); c.fill(); c.fillStyle = '#7a2414'; c.fillRect(x - 30, Y - 8, 5, 8); c.fillRect(x + 22, Y - 8, 5, 8);
    // the giant carrot
    c.save(); c.translate(x, Y - 30); c.rotate(-0.08 + Math.sin(t * 2) * 0.02);
    const cg = c.createLinearGradient(0, -12, 0, 12); cg.addColorStop(0, '#ffb050'); cg.addColorStop(1, '#e8701a'); c.fillStyle = cg; c.beginPath(); c.moveTo(-34, -12); c.quadraticCurveTo(-36, 0, -34, 12); c.quadraticCurveTo(0, 8, 34, 1); c.quadraticCurveTo(0, -8, -34, -12); c.fill();
    c.strokeStyle = 'rgba(140,60,10,0.5)'; c.lineWidth = 1.5; for (const xx of [-18, -4, 10]) { c.beginPath(); c.moveTo(xx, -7); c.lineTo(xx + 3, -2); c.stroke(); }
    c.fillStyle = '#4a9a3a'; for (const a of [-0.6, 0, 0.6]) { c.save(); c.translate(-34, 0); c.rotate(Math.PI + a); c.beginPath(); c.ellipse(12, 0, 13, 4, 0, 0, 7); c.fill(); c.restore(); }
    c.restore(); c.restore();
  }
  MG.add({
    id: 'tug', stage: 'forces', cmd: 'TAP FAST TO PULL THE SLED!', time: 5, mood: 'night', winText: 'Net force!', failText: 'Yanked!',
    card: { title: 'The bigger total pull wins', kind: 'Physics', ref: 'Net force',
      text: 'Two pulls act on the sled: the rabbit pulls left and the fox pulls right. The arrows show how hard each one pulls.\n\nWhat matters is the leftover after the two pulls cancel out. That leftover is called the net force. When the pulls are equal, the leftover is zero and the sled\'s speed does not change.\n\nWhen the rabbit pulls harder, the leftover points left, and the sled speeds up to the left. On ice almost nothing else pushes on the sled, so once it moves it keeps moving until a pull slows it.',
      note: 'A thing speeds up in the direction of the total of all the pushes and pulls on it, called the net force.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.foxes = L >= 2 ? 2 : 1; s.fox = L >= 2 ? 92 : [60, 74][L]; // the fox side's total pull
      s.vr = SK.variant(g, 4); s.me = 30; s.x = 180; s.v = 0; s.taps = 0; s.yank = 0; s.won = 0; s.puff = 0; s.lastTap = -1; s.ry = 0;
    },
    down(g) { const s = g.s; SK.touched(g); if (g.done) return; s.me = Math.min(150, s.me + [22, 26, 15][Math.min(2, g.level)]); /* levels 0-1: tapping at the ghost hand's pace (4 a second) out-pulls the fox */ s.taps++; s.lastTap = g.t; g.sfx('tap', { pitch: 0.8 + Math.min(1, s.me / 150) * 0.6 }); if (s.taps % 3 === 0) g.sfx('stretch', { vol: 0.25 }); },
    update(g, dt) {
      const s = g.s;
      s.me = Math.max(14, s.me - s.me * 1.05 * dt); // pulls fade when the rabbit rests
      const L = Math.min(2, g.level), fox = s.fox * SK.clamp((g.t - [1.3, 0.8, 0.6][L]) / 0.9, 0.3, 1) * [1 + 0.05 * Math.sin(g.t * 3), 1 + 0.18 * Math.sin(g.t * 2.2), (g.t > 2.2 ? 1.12 : 0.9), 1 + 0.12 * Math.sign(Math.sin(g.t * 1.6))][s.vr]; s.foxNow = fox; // four ways the fox pulls: steady, surging, a late heave, or jerking
      if (!s.won && !s.yank) {
        const net = fox - s.me; s.v += net * [0.9, 1.2, 1.4][L] * dt; s.x += s.v * dt; // left is negative x: rabbit's pull is -me
        if (s.x < BANK_L + 18 + 4 && !g.done) { s.won = g.t; s.v = 0; g.sfx('thud'); g.sfx('cheer'); g.sfx('munch'); g.burst(s.x - 10, Y - 30, ['#ffb050', '#ffffff', '#6ef0b4'], 22, 200); g.win(); }
        if (s.x > BANK_R - 18 - 4 && !g.done) { s.yank = g.t; s.ry = RX; s.rv = s.v + 60; g.sfx('whoosh'); g.sfx('laugh'); g.fail(); }
      } else if (s.yank) {
        s.x += s.v * dt; if (s.x > BANK_R - 4) { s.x = BANK_R - 4; s.v = 0; } s.v *= Math.exp(-1.5 * dt); s.ry += s.rv * dt; s.rv *= Math.exp(-0.9 * dt); s.ry = Math.min(s.ry, s.x - 70);
      }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('tug_lake', paintLake), 0, 0, 360, 640);
      const rope = '#e8d8a8';
      // the fox (or two), dug in on the right bank
      const fhands = [];
      for (let i = 0; i < s.foxes; i++) { const fx = FX + i * 30 - (s.foxes - 1) * 14; const h = SK.animal(c, 'fox', fx, Y + 2 + i * 8, 1.2, { t, phase: i * 2, facing: -1, pose: lost ? 'cheer' : 'walk', expr: lost ? 'laugh' : won ? 'sad' : 'think' }); fhands.push(h && h.hands ? h.hands[1] : { x: fx - 16, y: Y - 30 }); }
      c.strokeStyle = rope; c.lineWidth = 3; for (const h of fhands) { c.beginPath(); c.moveTo(s.x + 50, Y - 18); c.lineTo(h.x, h.y); c.stroke(); }
      // the rabbit: braced on its bank, or yanked face-first across the ice
      let rh;
      if (!s.yank) { const strain = SK.clamp((s.me - 30) / 90, 0, 1); c.save(); c.translate(RX, Y + 2); c.rotate(-0.25 * strain); const r = SK.animal(c, 'rabbit', 0, 0, 1.25, { t, pose: won ? 'cheer' : 'walk', expr: won ? 'laugh' : strain > 0.5 ? 'wow' : 'happy' }); c.restore();
        rh = r && r.hands ? r.hands[1] : { x: 16, y: -30 }; const a = -0.25 * strain, hx = RX + rh.x * Math.cos(a) - (rh.y - Y - 2) * Math.sin(a) * 0, hy = rh.y; rh = { x: RX + 24 + strain * 8, y: Y - 32 }; }
      else { const k = SK.clamp((t - s.yank) * 4, 0, 1); c.save(); c.translate(s.ry, Y - 6); c.rotate(Math.PI / 2 * k); SK.animal(c, 'rabbit', 0, 12, 1.25, { t, pose: 'hop', expr: 'wow', noShadow: true }); c.restore(); rh = { x: s.ry + 20, y: Y - 10 };
        c.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 5; i++) { const q = ((t * 3 + i * 0.2) % 1); c.beginPath(); c.arc(s.ry - 30 - q * 30, Y - 4 - q * 18 + i * 2, 5 * (1 - q) + 1, 0, 7); c.fill(); } }
      c.strokeStyle = rope; c.lineWidth = 3; c.beginPath(); c.moveTo(rh.x, rh.y); c.lineTo(s.x - 50, Y - 18); c.stroke();
      sled(c, s.x, t);
      // the pulls as arrows above the sled, and the leftover (net force) arrow under it
      if (!g.done) {
        const ay = Y - 100, me = s.me * S, fox = s.foxNow * S;
        arrow(c, s.x - 4, ay, -me, '#ffb050', 18); arrow(c, s.x + 4, ay, fox, '#e84848', 18);
        c.fillStyle = '#ffffff'; c.beginPath(); c.arc(s.x, ay, 5, 0, 7); c.fill();
        const net = (fox - me); arrow(c, s.x, Y + 44, net, net < 0 ? '#6ef0b4' : '#ff6a8a', 14);
        SK.tag(c, 'Your pull', SK.clamp(s.x - 62, 58, 302), ay - 34, 18, '#ffd08a'); SK.tag(c, "Fox's pull", SK.clamp(s.x + 62, 58, 302), ay - 34 - 34, 18, '#ffb0b0'); SK.tag(c, 'Net force', SK.clamp(s.x, 70, 290), Y + 80, 18, '#a0ffd2');
      }
      // the crowd on the ice: three penguins and a duck, cheering whoever wins
      for (const [px, kind, ph] of [[96, ['penguin', 'duck', 'owl', 'frog'][s.vr], 0], [150, 'duck', 1.3], [212, ['penguin', 'beaver', 'penguin', 'hedgehog'][s.vr], 2.1], [266, 'penguin', 3.3]]) SK.animal(c, kind, px, 598 + Math.sin(ph) * 6, 0.85, { t, phase: ph, pose: g.done ? 'cheer' : 'wave', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: px < 180 ? 1 : -1 });
      if (!g.done) SK.glow(c, g, RX + 4, Y - 40, 42, undefined, { level: 2 });
      SK.demo(g, c, 'tap', [RX + 12, Y - 30], null, { period: 0.25, delay: 0.7 });
    },
    auto(g, dt, synth) { const s = g.s; if (g.done || g.t < 0.8) return; if (g.t - (s._bt || 0) > 0.11) { s._bt = g.t; synth('down', RX, Y - 30); synth('up', RX, Y - 30); } },
  });
})();
