// SAVE UP TO BUY IT! (business EL-08) — a prize (bike, kite, guitar or skateboard: a new one each play) waits in the shop window; a glass jar has a line at its price. Coins pop onto
// the sidewalk one at a time, and each time the fox's candy cart rolls up to grab it. Drag every coin into the jar: the
// little coins pile up to the line and the bike rolls out to the rabbit. Let the cart grab one and the rabbit gets a
// lollipop while the bike stays in the window. Level 2: one small treat is allowed, but the line is higher.
const FLOOR = 566, JAR = { x: 284, y0: 478, y1: 600, w: 104 }, CR = 15;
const NEED = [5, 6, 6], TOTAL_TREATS = [0, 0, 1], REACH = [3.8, 3.0, 1.9]; // coins to the line; lollipops allowed; seconds for the cart to reach a coin
// where the k-th saved coin settles inside the jar: rows of three, slightly jumbled (fixed, so it never changes on rewind)
function slot(k) { const row = Math.floor(k / 3), col = k % 3, jit = [[-2, 1], [3, -2], [-1, 2], [2, 1], [-3, -1], [1, 2], [2, -2], [-2, 0], [0, 1]][k % 9]; return { x: JAR.x + (col - 1) * 31 + jit[0] + (row % 2 ? 8 : 0) * (col === 2 ? -1 : 1) * 0.5, y: JAR.y1 - 12 - row * 15 + jit[1], tilt: (jit[0] - jit[1]) * 0.04 }; }
function lineY(n) { return JAR.y1 - 12 - (Math.ceil(n / 3) - 1) * 15 - 14; }
function paintStreet(o) {
  // a warm evening street: sky, the shop front with a striped awning and a big window, the sidewalk
  const sky = o.createLinearGradient(0, 0, 0, 380); sky.addColorStop(0, '#f0a878'); sky.addColorStop(0.6, '#f8cfa0'); sky.addColorStop(1, '#fff0d8'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
  // the brick shop front
  o.fillStyle = '#3e7f86'; o.fillRect(0, 120, 360, 280);
  const rnd = P.rng(5); o.fillStyle = 'rgba(255,255,255,0.06)'; for (let y = 126; y < 396; y += 14) for (let x = (y / 14) % 2 ? 0 : -14; x < 360; x += 28) if (rnd() < 0.6) o.fillRect(x + 1, y, 26, 12);
  // the awning
  for (let i = 0; i < 9; i++) { o.fillStyle = i % 2 ? '#fff4e2' : '#e8566a'; o.beginPath(); o.moveTo(i * 40, 122); o.lineTo(i * 40 + 40, 122); o.lineTo(i * 40 + 40, 150); o.quadraticCurveTo(i * 40 + 20, 166, i * 40, 150); o.closePath(); o.fill(); }
  o.fillStyle = 'rgba(0,0,0,0.12)'; o.fillRect(0, 150, 360, 6);
  // the window: dark glass, a little display floor and a spotlight
  o.fillStyle = '#5a3a2a'; o.beginPath(); o.roundRect(22, 178, 236, 168, 12); o.fill();
  const gl = o.createLinearGradient(0, 186, 0, 338); gl.addColorStop(0, '#2c4a64'); gl.addColorStop(1, '#4a7090'); o.fillStyle = gl; o.beginPath(); o.roundRect(30, 186, 220, 152, 8); o.fill();
  const sp = o.createRadialGradient(140, 280, 10, 140, 280, 110); sp.addColorStop(0, 'rgba(255,240,190,0.55)'); sp.addColorStop(1, 'rgba(255,240,190,0)'); o.fillStyle = sp; o.fillRect(30, 186, 220, 152);
  o.fillStyle = '#c89060'; o.fillRect(30, 318, 220, 20);
  o.fillStyle = 'rgba(255,255,255,0.18)'; o.beginPath(); o.moveTo(44, 190); o.lineTo(84, 190); o.lineTo(44, 300); o.closePath(); o.fill();
  // the door
  o.fillStyle = '#7a3a2a'; o.beginPath(); o.roundRect(276, 196, 64, 200, [30, 30, 0, 0]); o.fill(); o.fillStyle = '#f4c860'; o.beginPath(); o.arc(328, 300, 4, 0, 7); o.fill();
  o.fillStyle = 'rgba(255,230,160,0.5)'; o.beginPath(); o.roundRect(286, 210, 44, 56, [22, 22, 4, 4]); o.fill();
  // the sidewalk
  const sw = o.createLinearGradient(0, 396, 0, 640); sw.addColorStop(0, '#d8c8b8'); sw.addColorStop(1, '#bca894'); o.fillStyle = sw; o.fillRect(0, 396, 360, 244);
  o.fillStyle = '#a89280'; o.fillRect(0, 396, 360, 6);
  o.strokeStyle = 'rgba(110,80,60,0.25)'; o.lineWidth = 2; for (let x = -20; x < 380; x += 90) { o.beginPath(); o.moveTo(x, 402); o.lineTo(x - 30, 640); o.stroke(); } o.beginPath(); o.moveTo(0, 500); o.lineTo(360, 500); o.stroke();
  o.fillStyle = 'rgba(255,255,255,0.12)'; for (let i = 0; i < 50; i++) { o.beginPath(); o.arc(rnd() * 360, 410 + rnd() * 220, 1 + rnd() * 2, 0, 7); o.fill(); }
}
function bike(c, x, y, s, spin) { // a red bike, wheels on y
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const wx of [-30, 30]) { c.strokeStyle = '#2a2430'; c.lineWidth = 5; c.beginPath(); c.arc(wx, -18, 17, 0, 7); c.stroke(); c.strokeStyle = 'rgba(220,220,230,0.8)'; c.lineWidth = 1.2; for (let i = 0; i < 6; i++) { const a = spin + i * Math.PI / 3; c.beginPath(); c.moveTo(wx, -18); c.lineTo(wx + Math.cos(a) * 15, -18 + Math.sin(a) * 15); c.stroke(); } }
  c.strokeStyle = '#e8403a'; c.lineWidth = 5; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(-30, -18); c.lineTo(-6, -18); c.lineTo(16, -44); c.lineTo(-12, -44); c.lineTo(-30, -18); c.moveTo(-6, -18); c.lineTo(-14, -52); c.moveTo(16, -44); c.lineTo(30, -18); c.moveTo(16, -44); c.lineTo(12, -58); c.stroke();
  c.strokeStyle = '#2a2430'; c.lineWidth = 4; c.beginPath(); c.moveTo(4, -60); c.lineTo(20, -58); c.stroke(); c.fillStyle = '#2a2430'; c.beginPath(); c.ellipse(-14, -54, 9, 3.5, 0, 0, 7); c.fill();
  c.fillStyle = '#fff'; c.globalAlpha = 0.5; c.beginPath(); c.arc(-6, -18, 3, 0, 7); c.fill(); c.restore();
}
const PRIZES = ['Bike', 'Kite', 'Guitar', 'Skateboard'];
function prize(c, kind, x, y, s, spin) { // the thing in the shop window, standing on y
  if (kind === 'Bike') return bike(c, x, y, s, spin);
  c.save(); c.translate(x, y); c.scale(s, s); c.lineJoin = 'round'; c.lineCap = 'round';
  if (kind === 'Kite') { c.rotate(Math.sin(spin * 0.5) * 0.1); c.fillStyle = '#e8566a'; c.strokeStyle = '#7a1a2a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, -78); c.lineTo(26, -46); c.lineTo(0, -6); c.lineTo(-26, -46); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#f5c23a'; c.beginPath(); c.moveTo(0, -78); c.lineTo(26, -46); c.lineTo(0, -46); c.closePath(); c.fill(); c.beginPath(); c.moveTo(0, -6); c.lineTo(-26, -46); c.lineTo(0, -46); c.closePath(); c.fill(); c.strokeStyle = '#3a1640'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, -6); c.quadraticCurveTo(12, 0, 4, 8); c.quadraticCurveTo(-8, 14, 2, 20); c.stroke(); for (const [bx, by] of [[6, 4], [-2, 14]]) { c.fillStyle = '#5aa8e8'; c.beginPath(); c.moveTo(bx - 5, by - 3); c.lineTo(bx + 5, by + 3); c.lineTo(bx + 5, by - 3); c.lineTo(bx - 5, by + 3); c.closePath(); c.fill(); } }
  if (kind === 'Guitar') { c.rotate(-0.25); c.fillStyle = '#d8843a'; c.strokeStyle = '#6a3a14'; c.lineWidth = 2.5; c.beginPath(); c.ellipse(0, -16, 20, 16, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.ellipse(0, -40, 15, 12, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#3a1a10'; c.beginPath(); c.arc(0, -26, 6, 0, 7); c.fill(); c.fillStyle = '#6a3a14'; c.fillRect(-4, -96, 8, 56); c.fillRect(-7, -104, 14, 12); c.strokeStyle = '#fff6ea'; c.lineWidth = 0.8; for (let i = -2; i <= 2; i += 2) { c.beginPath(); c.moveTo(i, -100); c.lineTo(i, -12); c.stroke(); } }
  if (kind === 'Skateboard') { c.fillStyle = '#5aa8e8'; c.strokeStyle = '#1a4a7a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-46, -22); c.quadraticCurveTo(-54, -30, -42, -30); c.lineTo(42, -30); c.quadraticCurveTo(54, -30, 46, -22); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#f5c23a'; c.fillRect(-20, -29, 40, 4); for (const wx of [-30, 30]) { c.fillStyle = '#e8566a'; c.beginPath(); c.arc(wx, -12, 8, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(wx, -12, 3, 0, 7); c.fill(); } }
  c.restore();
}
function lollipop(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 22); c.stroke(); c.fillStyle = '#ff6aa0'; c.beginPath(); c.arc(0, -8, 11, 0, 7); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.beginPath(); for (let a = 0; a < 9; a += 0.3) c.lineTo(Math.cos(a) * a * 1.1, -8 + Math.sin(a) * a * 1.1); c.stroke(); c.restore(); }
function cart(c, x, y, t, moving) { // the candy cart: striped canopy, lollipop jars, two wheels; its front edge is at x
  c.save(); c.translate(x - 50, y);
  const bob = moving ? Math.sin(t * 16) * 1.2 : 0;
  c.fillStyle = 'rgba(40,20,40,0.22)'; c.beginPath(); c.ellipse(0, 4, 54, 7, 0, 0, 7); c.fill();
  for (const wx of [-30, 30]) { c.fillStyle = '#2a2430'; c.beginPath(); c.arc(wx, -10, 11, 0, 7); c.fill(); c.strokeStyle = '#d0c8d0'; c.lineWidth = 2; c.beginPath(); const a = -t * (moving ? 12 : 0); c.moveTo(wx + Math.cos(a) * 8, -10 + Math.sin(a) * 8); c.lineTo(wx - Math.cos(a) * 8, -10 - Math.sin(a) * 8); c.stroke(); }
  c.translate(0, bob);
  c.fillStyle = '#f7d6e8'; c.strokeStyle = '#9a3a6a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-46, -66, 92, 50, 8); c.fill(); c.stroke();
  for (let i = 0; i < 4; i++) lollipop(c, -30 + i * 20, -74, 0.75);
  c.strokeStyle = '#9a3a6a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-40, -66); c.lineTo(-40, -112); c.moveTo(40, -66); c.lineTo(40, -112); c.stroke();
  for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#fff' : '#ff6aa0'; c.beginPath(); c.moveTo(-50 + i * 16.7, -112); c.lineTo(-50 + (i + 1) * 16.7, -112); c.lineTo(-50 + (i + 1) * 16.7, -100); c.quadraticCurveTo(-50 + (i + 0.5) * 16.7, -92, -50 + i * 16.7, -100); c.closePath(); c.fill(); }
  c.fillStyle = '#ff6aa0'; c.beginPath(); c.arc(0, -40, 9, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(0, -40, 4, 0, 7); c.fill();
  c.restore();
}
MG.add({
  id: 'save', stage: 'money', cmd: 'SAVE UP TO BUY IT!', time: 7, mood: 'bright', winText: 'Saved enough!', failText: 'Spent on candy!', hold: 1.7,
  card: { title: 'Saving adds up', kind: 'Money', ref: 'Saving toward a goal',
    text: 'Each coin on its own is small. Put every one in the jar and the pile grows until it reaches the line, the price of the thing you want.\n\nSpend the coins as they come, on candy, and the jar never fills. Saving means keeping some money now so you can buy something bigger later.\n\nA goal helps. When you know the price of the thing you want, you can see how close you are, and a small treat now and then can still fit if you keep saving the rest.',
    note: 'Saving a little each time adds up to something big.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level);
    s.prize = PRIZES[SK.variant(g, PRIZES.length)]; // a different thing in the window each play
    s.need = NEED[L]; s.treats = TOTAL_TREATS[L]; s.reach = REACH[L];
    s.saved = 0; s.eaten = 0; s.coin = null; s.next = 0.9; s.k = 0; s.cartX = 100; s.fall = []; s.wonT = 0; s.lolly = 0; s.lollyFly = null; s.happy = 0;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); const k = s.coin; if (!k || g.done || k.inJar || k.gone) return;
    if (SK.dist(x, y, k.x, k.y) < 52) { k.held = true; SK.dragStart(g, k, x, y); g.sfx('tap'); }
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const k = d.obj; k.held = false;
    if (k.x > JAR.x - JAR.w / 2 - 22 && k.x < JAR.x + JAR.w / 2 + 22 && k.y < JAR.y1 - 10 && k.y > JAR.y0 - 140) { // over the jar's mouth or on it
      const sl = slot(s.saved + s.fall.length); k.inJar = true; k.tx = sl.x; k.ty = sl.y; k.tilt = sl.tilt; k.vy = 200; k.x = SK.clamp(k.x, JAR.x - 30, JAR.x + 30); if (k.y > JAR.y0) k.y = JAR.y0 - 6; g.sfx('whoosh');
      s.fall.push(k); s.coin = null; s.next = g.t + 0.12;
    } else { k.vx = d.vx * 0.2; k.vy = Math.min(0, d.vy * 0.2); }
  },
  update(g, dt) {
    const s = g.s, k = s.coin;
    // a new coin pops out once the last one is settled
    if (!k && !g.done && g.t >= s.next) { s.coin = { x: 160 + g.rand() * 32, y: 500, vx: 0, vy: 0, r: CR, e: 0.35, mu: 1400, t0: g.t, spin: 0, idx: s.k++ }; g.sfx('coin'); }
    if (k && !k.inJar && !k.gone && !k.held) {
      SK.step(k, dt, { gy: 1500, floor: FLOOR, left: 16, right: 344 }); k.spin += dt * (k.onFloor ? 0 : 14);
      if (k.onFloor) k.spin *= 0.8;
    }
    // the cart rolls toward the coin (it starts once the coin lands), and backs off when the coin is gone
    if (k && !k.inJar && !k.gone) {
      const target = k.x - CR - 4, sp = Math.max(25, target - 100) / s.reach;
      if (g.t > k.t0 + 0.35) s.cartX = Math.min(target, s.cartX + sp * dt);
      if (s.cartX >= target - 0.5 && !k.held && k.onFloor) { // grabbed!
        k.gone = true; s.eaten++; g.sfx('munch'); g.sfx('pop'); s.lollyFly = { t: g.t, x: k.x, y: k.y - 60 };
        if (s.eaten > s.treats) { s.lolly = g.t; g.fail(); g.sfx('laugh'); } else { s.happy = g.t; s.coin = null; s.next = g.t + 0.6; }
      }
    } else if (!s.lolly) s.cartX = Math.max(100, s.cartX - 200 * dt);
    if (k && k.held && s.cartX >= k.x - 40) s.cartX = k.x - 40; // the cart can't catch a coin in your hand, but it follows
    // a coin falling into the jar settles on its slot
    for (const k of s.fall) if (!k.landed) {
      k.vy += 2000 * dt; k.y += k.vy * dt; k.x += (k.tx - k.x) * Math.min(1, dt * 10); k.spin += dt * 10;
      if (k.y >= k.ty) { k.y = k.ty; k.landed = true; s.saved++; g.sfx('coin'); g.burst(k.tx, k.ty - 6, ['#ffe27a', '#fff6ea'], 6, 90);
        if (s.saved >= s.need && !g.done) { s.wonT = g.t; g.win(); g.sfx('bell'); g.sfx('cheer'); g.burst(JAR.x, lineY(s.need), ['#ffe27a', '#ff8aa0', '#fff6ea'], 20, 200); } }
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, k = s.coin, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('b8save_st', paintStreet), 0, 0, 360, 640);
    const lf = s.lollyFly; let lk = lf ? SK.clamp((t - lf.t) / 0.5, 0, 1) : 0;
    // the bike: in the window, or rolling out to the rabbit after the win
    const wk = won ? SK.easeInOut((t - s.wonT - 0.15) / 1.0) : 0;
    const bx = SK.lerp(140, 236, wk), by = SK.lerp(322, 452, wk) - Math.sin(wk * Math.PI) * 30, bs = SK.lerp(1.2, 0.9, wk);
    if (wk > 0) { c.save(); c.globalAlpha = 1 - wk * 0.6; c.fillStyle = 'rgba(255,240,190,0.4)'; c.beginPath(); c.roundRect(30, 186, 220, 152, 8); c.fill(); c.restore(); }
    prize(c, s.prize, bx, by, bs, wk * 14 + (wk ? 0 : Math.sin(t * 0.8) * 0.2));
    if (!wk) { c.save(); c.globalAlpha = 0.3 + 0.2 * Math.sin(t * 3); c.fillStyle = '#fff4c0'; for (let i = 0; i < 3; i++) { const a = t * 1.3 + i * 2.1; c.beginPath(); c.arc(140 + Math.cos(a) * 70, 250 + Math.sin(a * 1.3) * 30, 2.5, 0, 7); c.fill(); } c.restore(); }
    // the jar, its price line with a little bike, and the coins saved so far
    const ly = lineY(s.need);
    // the rabbit, at the shop door behind the jar
    const pose = won ? 'cheer' : lost ? 'idle' : s.happy && t - s.happy < 1 ? 'hop' : 'idle';
    SK.animal(c, 'rabbit', 312, 446, 0.9, { t, pose, expr: won ? 'laugh' : 'happy', facing: -1,
      hold: lf && lk >= 1 ? (h => lollipop(h, 0, -6, 1)) : null });
    B8.jarBack(c, JAR.x, JAR.y0, JAR.y1, JAR.w);
    for (let i = 0; i < s.saved; i++) { const sl = slot(i); B8.flatCoin(c, sl.x, sl.y, CR, sl.tilt); }
    for (const f of s.fall) if (!f.landed) B8.coin(c, f.x, f.y, CR, f.spin);
    B8.jarFront(c, JAR.x, JAR.y0, JAR.y1, JAR.w);
    const full = s.saved >= s.need;
    c.save(); c.strokeStyle = full ? '#5ad07a' : '#e8403a'; c.lineWidth = 4; c.setLineDash([9, 6]); c.beginPath(); c.moveTo(JAR.x - JAR.w / 2 - 4, ly); c.lineTo(JAR.x + JAR.w / 2 + 4, ly); c.stroke(); c.restore();
    
    // the fox pushing the candy cart
    const cx = s.cartX, moving = k && !k.inJar && !k.gone && cx < k.x - CR - 6;
    if (cx > -150) { SK.animal(c, 'fox', cx - 118, FLOOR + 28, 0.8, { t, pose: moving ? 'walk' : s.lolly ? 'cheer' : 'idle', expr: s.lolly ? 'laugh' : 'happy' }); cart(c, cx, FLOOR + 26, t, moving); }
    // the coin on the sidewalk (or in your hand)
    if (k && !k.inJar && !k.gone) {
      if (k.onFloor) SK.shadow(c, k.x, FLOOR + 2, CR * 0.9, 4, 0.25);
      B8.coin(c, k.x, k.y, CR, k.spin);
      if (!k.held && k.onFloor) { SK.grab(c, g, k.x, k.y, 22); SK.target(c, g, JAR.x, JAR.y0 + 30, 0, { w: JAR.w + 14, h: 70 }); SK.arrow(c, g, k.x, k.y, JAR.x, JAR.y0 + 10); } // move this coin into the jar
    }
    // a lollipop flies from the cart to the rabbit
    if (lf && lk < 1) lollipop(c, SK.lerp(lf.x, 316, lk), SK.lerp(lf.y, 400, lk) - Math.sin(lk * Math.PI) * 60, 1.1);
    // labels: the real names of things
    SK.tag(c, 'Savings ' + Math.min(s.saved, s.need) + ' / ' + s.need, JAR.x - 8, JAR.y0 - 16, 18); SK.tag(c, s.prize + ' price', JAR.x, ly - 24, 18, '#fff6ea', full ? 'rgba(40,140,70,0.85)' : 'rgba(190,40,40,0.85)');
    if (s.cartX > 60) SK.tag(c, 'Candy cart', Math.max(64, s.cartX - 50), FLOOR - 112, 18);
    // guidance: drag the coin into the jar
    // each new coin is a new step, so the hand shows it at once (not only after the kit's idle wait), until you grab it
    const wait = k && !k.inJar && !k.gone && k.onFloor && !k.held && !g.done;
    SK.demo(g, c, 'drag', [k ? k.x : 0, k ? k.y : 0], [JAR.x, JAR.y0 - 20], { never: true });
    if (wait && !(g.ptr && g.ptr.down)) { const t0 = k.t0 + 0.35, per = 1.5; if (t >= t0) { const q = ((t - t0) % per) / per, fade = SK.clamp((t - t0) * 4, 0, 1), p = q < 0.12 ? q / 0.12 : q < 0.78 ? 1 : 1 - (q - 0.78) / 0.1, m = SK.easeInOut((q - 0.12) / 0.62);
      SK.hand(c, SK.lerp(k.x, JAR.x, m), SK.lerp(k.y, JAR.y0 - 20, m) - Math.sin(m * Math.PI) * 60, SK.clamp(p, 0, 1), 0.9 * fade * (q > 0.88 ? 0 : 1)); } }
  },
  auto(g, dt, synth) {
    const s = g.s, k = s.coin; if (!k || k.inJar || k.gone || !k.onFloor) return;
    const B = s._b8 = s._b8 || {}; if (!B[k.idx]) B[k.idx] = { a: [k.x, k.y], t: g.t + 0.05 };
    SK.bot.drag(g, synth, 'c' + k.idx, B[k.idx].t, B[k.idx].a, [JAR.x, JAR.y0 - 30], 0.35);
  },
});
