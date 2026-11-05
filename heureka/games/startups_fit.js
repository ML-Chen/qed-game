// BUILD WHAT THEY WANT! (business SV-00, product-market fit) — a smoothie booth labelled "Your product". Customers walk
// up, try a cup and walk off, each with a thought bubble showing what they wanted (ice, berries, a bigger cup, a straw).
// Drag that add-on from the tray onto the product. With each fix more customers stay; once the product has everything
// they asked for, they come back by themselves and bring friends: the queue grows on its own (word of mouth). Blast the
// Ads megaphone before the product fits and a crowd rushes in, tries once and leaves. Level 2: four wants, faster.
const BOOTH = { x: 180, y: 322 }, PATH = 486, TRYX = 150, TRAY = 588;
const ADDS = ['ice', 'berry', 'big', 'straw', 'pickle'];
const LVF = [{ need: ['ice', 'berry', 'big'], every: 1.25, goal: 6 }, { need: ['berry', 'big', 'ice'], every: 1.05, goal: 6 }, { need: ['ice', 'straw', 'berry', 'big'], every: 0.85, goal: 7 }];
const KINDS = ['rabbit', 'frog', 'penguin', 'duck', 'bird', 'turtle', 'hedgehog', 'beaver', 'ant', 'owl'];
const TRAYX = i => 44 + i * 68, ADSP = { x: 316, y: 214 };
function paintStreet(o) {
  const sky = o.createLinearGradient(0, 0, 0, 430); sky.addColorStop(0, '#ff9ac0'); sky.addColorStop(0.6, '#ffc890'); sky.addColorStop(1, '#fff2d0'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
  P.hills(o, 360, 420, 40, '#b8d870', '#80a848', { seed: 21 }); P.tree(o, 30, 420, 0.9, '#6a9a4a', 5);
  const gr = o.createLinearGradient(0, 440, 0, 640); gr.addColorStop(0, '#e0c8a0'); gr.addColorStop(1, '#c8a878'); o.fillStyle = gr; o.fillRect(0, 440, 360, 200);
  o.fillStyle = 'rgba(255,255,255,0.22)'; for (let x = 0; x < 360; x += 46) o.fillRect(x, 506, 26, 4);
  // the booth: striped roof, posts, counter
  o.fillStyle = '#7a4a8a'; o.fillRect(92, 240, 8, 170); o.fillRect(260, 240, 8, 170);
  for (let i = 0; i < 6; i++) { o.fillStyle = i % 2 ? '#fff6ea' : '#5ab8a8'; o.beginPath(); o.moveTo(84 + i * 32, 230); o.lineTo(116 + i * 32, 230); o.lineTo(116 + i * 32, 252); o.quadraticCurveTo(100 + i * 32, 264, 84 + i * 32, 252); o.closePath(); o.fill(); }
  o.fillStyle = '#3a8878'; o.fillRect(80, 222, 200, 10);
  o.fillStyle = '#f8e0c0'; o.fillRect(86, 350, 188, 62); o.fillStyle = '#e0b890'; o.fillRect(86, 350, 188, 8);
  // the tray of add-ons
  o.fillStyle = 'rgba(90,60,40,0.35)'; o.beginPath(); o.roundRect(10, TRAY - 34, 340, 62, 16); o.fill();
}
function addon(c, k, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (k === 'ice') { for (const [dx, dy] of [[-8, 4], [7, 2], [0, -8]]) { c.fillStyle = 'rgba(200,240,255,0.95)'; c.strokeStyle = '#6ab0d8'; c.lineWidth = 2; c.beginPath(); c.roundRect(dx - 8, dy - 8, 16, 16, 4); c.fill(); c.stroke(); c.fillStyle = '#fff'; c.fillRect(dx - 5, dy - 5, 4, 4); } }
  if (k === 'berry') { c.fillStyle = '#e8403a'; c.beginPath(); c.moveTo(0, 14); c.quadraticCurveTo(-16, 0, -10, -8); c.quadraticCurveTo(0, -12, 10, -8); c.quadraticCurveTo(16, 0, 0, 14); c.fill(); c.fillStyle = '#ffe0a0'; for (const [dx, dy] of [[-4, -2], [4, -1], [0, 5]]) { c.beginPath(); c.arc(dx, dy, 1.4, 0, 7); c.fill(); } c.fillStyle = '#5ab050'; c.beginPath(); c.ellipse(-4, -11, 6, 3, -0.4, 0, 7); c.ellipse(4, -11, 6, 3, 0.4, 0, 7); c.fill(); }
  if (k === 'big') { for (const [dx, sc] of [[-10, 0.55], [8, 1]]) { c.save(); c.translate(dx, 8); c.scale(sc, sc); c.fillStyle = '#fff6ea'; c.strokeStyle = '#5a3a6a'; c.lineWidth = 2 / sc; c.beginPath(); c.moveTo(-9, -24); c.lineTo(9, -24); c.lineTo(7, 0); c.lineTo(-7, 0); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#f0d070'; c.fillRect(-7, -18, 14, 16); c.restore(); } c.fillStyle = '#5a3a6a'; c.beginPath(); c.moveTo(-6, -10); c.lineTo(0, -16); c.lineTo(0, -4); c.closePath(); c.fill(); }
  if (k === 'straw') { c.strokeStyle = '#e8566a'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(-6, 16); c.lineTo(2, -10); c.lineTo(12, -16); c.stroke(); c.strokeStyle = '#fff'; c.lineWidth = 2; c.setLineDash([4, 5]); c.stroke(); }
  if (k === 'pickle') { c.fillStyle = '#6a9a3a'; c.strokeStyle = '#3a5a1a'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 0, 8, 16, 0.4, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#9ac860'; for (const [dx, dy] of [[-2, -6], [2, 2], [-1, 8]]) { c.beginPath(); c.arc(dx, dy, 1.6, 0, 7); c.fill(); } }
  c.restore();
}
function product(c, x, y, feat, t) { // the smoothie on the counter, showing every add-on it has
  const big = feat.includes('big'), sc = big ? 1.35 : 1, berry = feat.includes('berry');
  c.save(); c.translate(x, y); c.scale(sc, sc);
  c.fillStyle = 'rgba(40,20,40,0.2)'; c.beginPath(); c.ellipse(0, 2, 22, 5, 0, 0, 7); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.7)'; c.strokeStyle = '#5a3a6a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-20, -50); c.lineTo(20, -50); c.lineTo(15, 0); c.lineTo(-15, 0); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = berry ? '#f07090' : '#f0d070'; c.beginPath(); c.moveTo(-18, -40); c.lineTo(18, -40); c.lineTo(15, -2); c.lineTo(-15, -2); c.closePath(); c.fill();
  if (feat.includes('ice')) for (const [dx, dy] of [[-8, -30], [6, -22], [-2, -14]]) { c.fillStyle = 'rgba(220,245,255,0.9)'; c.fillRect(dx - 5, dy - 5, 10, 10); }
  if (feat.includes('straw')) { c.strokeStyle = '#e8566a'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(4, -20); c.lineTo(10, -66); c.lineTo(20, -72); c.stroke(); }
  if (berry) addon(c, 'berry', -16, -52, 0.7);
  if (feat.includes('pickle')) addon(c, 'pickle', 16, -54, 0.7);
  c.restore();
}
function bubble(c, x, y, k, a) { c.save(); c.globalAlpha = a; c.fillStyle = '#fff'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5; c.beginPath(); c.arc(x, y, 29, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(x - 12, y + 30, 5, 0, 7); c.fill(); c.stroke(); addon(c, k, x, y + 1, 1.15); c.restore(); }
MG.add({
  id: 'pmfit', stage: 'startups', cmd: 'BUILD WHAT THEY WANT!', time: 6, mood: 'party', winText: 'Product-market fit!', failText: 'They tried it and left!', hold: 1.9,
  card: { title: 'Make something people want', kind: 'Startups', ref: 'Product-market fit',
    text: 'At first, people try your product and walk away. Each one wanted something it didn\'t have. If you watch and listen, they tell you what to build.\n\nWhen the product finally gives people what they need, something changes: they come back on their own and bring their friends. That pull is called product-market fit.\n\nBefore that point, ads only bring more people who try it once and leave. Most startups that fail never reach this point, so finding it comes before growing, pricing or raising money.',
    note: 'Build what customers want first; once it fits, they come back and bring others.' },
  init(g) {
    const s = g.s, L = LVF[Math.min(2, g.level)];
    s.L = L; s.feat = []; s.cust = []; s.next = 0.3; s.n = 0; s.queue = 0; s.fitT = 0; s.ads = 0; s.adsLeft = 0; s.drag = null; s.wom = [];
    s.tray = ADDS.filter(k => L.need.includes(k) || k === 'pickle').map((k, i) => ({ k, hx: TRAYX(i), hy: TRAY, x: TRAYX(i), y: TRAY, used: false }));
    const sh = L.need.slice(); for (let i = sh.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [sh[i], sh[j]] = [sh[j], sh[i]]; } s.order = sh;
  },
  missing(g) { return g.s.order.filter(k => !g.s.feat.includes(k)); },
  spawn(g, opt = {}) { const s = g.s, m = this.missing(g); s.cust.push({ x: opt.x ?? 10, st: opt.st || 'walk', t: g.t, want: m.length ? m[s.n % m.length] : null, kind: KINDS[s.n % KINDS.length], ph: s.n, ad: !!opt.ad, dx: opt.dx || 0 }); s.n++; },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    if (SK.dist(x, y, ADSP.x, ADSP.y) < 36 && !s.ads) { s.ads = g.t; g.sfx('roar'); for (let i = 0; i < 5; i++) this.spawn(g, { x: -40 - i * 46, ad: true, dx: 40 - i * 34 }); return; }
    const it = SK.pick(s.tray.filter(o => !o.used), x, y, 36); if (it) { s.drag = it; SK.dragStart(g, it, x, y); g.sfx('tap'); }
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !s.drag) return; const it = s.drag; s.drag = null;
    if (SK.dist(it.x, it.y, BOOTH.x, BOOTH.y - 20) < 70) { it.used = true; s.feat.push(it.k); g.sfx(it.k === 'pickle' ? 'boing' : 'magic'); g.burst(BOOTH.x, BOOTH.y - 30, ['#ffe27a', '#fff6ea', '#5ab8a8'], 12, 150);
      if (!this.missing(g).length && !s.fitT) { s.fitT = g.t; s.next = g.t + 0.2; g.sfx('chime'); for (const cu of s.cust) { if (cu.st === 'walk' || cu.st === 'try') cu.want = null; if (cu.st === 'leave' && cu.x < 380) cu.st = 'back'; } } } // the ones who left come back
    else g.sfx('swoosh');
  },
  update(g, dt) {
    const s = g.s, L = s.L; if (g.done) return;
    for (const it of s.tray) if (!it.used && s.drag !== it) { it.x += (it.hx - it.x) * Math.min(1, dt * 10); it.y += (it.hy - it.y) * Math.min(1, dt * 10); }
    if (!s.fitT && g.t >= s.next) { this.spawn(g); s.next = g.t + L.every; }
    // after the fit: everyone who stays comes back with a friend (word of mouth)
    if (s.fitT && g.t >= s.next) { this.spawn(g, { x: 60 }); s.next = g.t + Math.max(0.18, 0.45 - s.queue * 0.06); }
    for (const cu of s.cust) {
      if (cu.st === 'walk') { cu.x += (s.fitT ? 260 : 190) * dt; if (cu.x >= TRYX + cu.dx) { cu.x = TRYX + cu.dx; cu.st = 'try'; cu.t = g.t; } }
      else if (cu.st === 'back') { cu.x -= 200 * dt; if (cu.x <= TRYX + 30) { cu.st = 'stay'; cu.t = g.t; s.queue++; g.sfx('ding'); s.wom.push({ t: g.t, i: s.queue }); } }
      else if (cu.st === 'try' && g.t - cu.t > (s.fitT ? 0.25 : 0.45)) {
        const happy = s.fitT || (cu.want && s.feat.includes(cu.want)) || (!cu.want && !this.missing(g).length);
        if (happy) { cu.st = 'stay'; cu.t = g.t; s.queue++; g.sfx('ding'); if (s.fitT) s.wom.push({ t: g.t, i: s.queue }); }
        else { cu.st = 'leave'; cu.t = g.t; g.sfx('wrong'); }
      } else if (cu.st === 'leave') cu.x += 110 * dt;
    }
    s.cust = s.cust.filter(cu => cu.x < 420);
    if (s.ads && !s.fitT && g.t - s.ads > 3.2 && s.cust.every(cu => !cu.ad || cu.st === 'leave')) { g.fail(); g.sfx('fail'); }
    if (s.queue >= L.goal && s.fitT) { g.win(); g.sfx('cheer'); g.burst(BOOTH.x, BOOTH.y - 60, ['#ffe27a', '#ff8aa0', '#fff6ea', '#5ab8a8'], 28, 240); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('b8fit_s', paintStreet), 0, 0, 360, 640);
    SK.animal(c, 'fox', 214, 352, 0.9, { t, pose: won ? 'cheer' : s.fitT ? 'cheer' : lost ? 'sad' : 'idle', expr: won || s.fitT ? 'laugh' : lost ? 'sad' : 'happy', facing: -1 });
    product(c, BOOTH.x - 20, BOOTH.y + 28, s.feat, t);
    SK.tag(c, 'Your product', BOOTH.x, 214, 18);
    // the queue of happy customers who came back (they stand in a row behind the path)
    const qn = Math.min(10, s.queue);
    for (let i = 0; i < qn; i++) SK.animal(c, KINDS[(i * 3) % KINDS.length], 300 - i * 28, 448, 0.55, { t, phase: i, pose: won ? 'cheer' : 'idle', expr: 'laugh', facing: -1 });
    if (s.queue && !s.fitT) SK.tag(c, 'Happy customers', 266, 470, 18);
    // word of mouth: arrows from happy customers out to new friends
    for (const w of s.wom) { const q = (t - w.t) / 0.8; if (q > 1) continue; c.save(); c.globalAlpha = 1 - q; c.strokeStyle = '#ff5a8a'; c.lineWidth = 4; c.setLineDash([6, 5]); c.beginPath(); c.moveTo(300 - (w.i - 1) * 28, 420); c.quadraticCurveTo(160, 380 - q * 30, 20, 470); c.stroke(); c.restore(); }
    if (s.fitT && t - s.fitT < 3) SK.tag(c, 'Word of mouth', 84, 520, 18, '#fff6ea', 'rgba(200,60,110,0.85)');
    // customers on the path: walking up, trying, staying or walking off with what they wanted in a bubble
    for (const cu of s.cust) {
      if (cu.st === 'stay') { const q = SK.clamp((t - cu.t) / 0.5, 0, 1); if (q >= 1) continue; SK.animal(c, cu.kind, SK.lerp(cu.x, 300, q), SK.lerp(PATH, 448, q), 0.75, { t, phase: cu.ph, pose: 'hop', expr: 'laugh', facing: 1 }); continue; }
      const sad = cu.st === 'leave';
      SK.animal(c, cu.kind, cu.x, PATH + (cu.ph % 2) * 6, 0.75, { t, phase: cu.ph, pose: cu.st === 'try' ? 'idle' : 'walk', expr: sad ? 'sad' : cu.st === 'try' ? 'think' : 'happy', facing: 1,
        hold: cu.st === 'try' ? (h => { h.fillStyle = s.feat.includes('berry') ? '#f07090' : '#f0d070'; h.fillRect(-5, -10, 10, 12); }) : null });
      if (sad && cu.want) bubble(c, cu.x + 22, PATH - 92, cu.want, Math.min(1, (t - cu.t) * 4));
      if (sad && !cu.want && cu.ad) bubble(c, cu.x + 22, PATH - 92, this.missing(g)[cu.ph % Math.max(1, this.missing(g).length)] || 'ice', Math.min(1, (t - cu.t) * 4));
    }
    // the Ads megaphone
    c.save(); c.translate(ADSP.x, ADSP.y); c.rotate(-0.3); c.fillStyle = s.ads ? '#c8c0c8' : '#f5c23a'; c.strokeStyle = '#7a4a10'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-18, -8); c.lineTo(14, -22); c.lineTo(14, 22); c.lineTo(-18, 8); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#7a4a10'; c.fillRect(-26, -7, 9, 14); c.restore();
    if (s.ads && t - s.ads < 1.2) for (let i = 0; i < 3; i++) { c.strokeStyle = 'rgba(122,74,16,0.6)'; c.lineWidth = 3; c.beginPath(); c.arc(ADSP.x + 16, ADSP.y - 6, 20 + i * 12 + (t - s.ads) * 40, -0.9, 0.5); c.stroke(); }
    SK.tag(c, 'Ads', ADSP.x, ADSP.y + 40, 18);
    // the tray of add-ons
    for (const it of s.tray) if (!it.used) { addon(c, it.k, it.x, it.y, 1.15); }
    // guidance: drag what the last unhappy customer wanted onto the product
    const want = this.target(g), it = want && s.tray.find(o => !o.used && o.k === want);
    if (it && !s.drag) { SK.glow(c, g, it.x, it.y, 28); SK.glow(c, g, BOOTH.x - 20, BOOTH.y - 10, 50); SK.demo(g, c, 'drag', [it.x, it.y], [BOOTH.x - 20, BOOTH.y - 10], { delay: 0.6 }); }
  },
  target(g) { const s = g.s; const c = s.cust.filter(cu => (cu.st === 'leave') && cu.want && !s.feat.includes(cu.want)); return c.length ? c[c.length - 1].want : null; },
  auto(g, dt, synth) {
    const s = g.s, B = s._b8 = s._b8 || { n: 0 }; if (g.done) return;
    if (!B.cur) { if (s.drag) return; const w = this.target(g); if (!w) return; const it = s.tray.find(o => !o.used && o.k === w); if (!it) return; B.cur = { a: [it.hx, it.hy], t: g.t + 0.1, key: 'f' + B.n }; }
    if (SK.bot.drag(g, synth, B.cur.key, B.cur.t, B.cur.a, [BOOTH.x - 20, BOOTH.y - 20], 0.4)) { B.n++; B.cur = null; }
  },
});
