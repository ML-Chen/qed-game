// HIDE! (cs EL-12) — picture cards float up toward a friendly noticeboard: a cat drawing, a rainbow, a sun... and a
// door key, your house, your phone. Flick the private ones into the treasure chest; let the fun ones float up and get
// pinned. A private card that reaches the board is plucked off by a sly fox. Some things about you stay private online.
const KINDS = {
  cat: { priv: false, bg: '#ffe9c8' }, rainbow: { priv: false, bg: '#e4f4ff' }, sun: { priv: false, bg: '#fff3b8' }, flower: { priv: false, bg: '#f0ffe0' },
  key: { priv: true, bg: '#ffe0e6' }, house: { priv: true, bg: '#ffe0e6' }, phone: { priv: true, bg: '#ffe0e6' },
};
const ORDERS = [
  ['cat', 'key', 'rainbow', 'house', 'sun'],
  ['rainbow', 'house', 'cat', 'phone', 'key', 'sun'],
  ['sun', 'key', 'cat', 'house', 'rainbow', 'phone'],
];
const BOARD_Y = 296, CHEST = { x: 296, y: 486 }, CW = 84, CH = 70;
function paintRoom(o) {
  const wall = o.createLinearGradient(0, 0, 0, 640); wall.addColorStop(0, '#ffd9a8'); wall.addColorStop(0.6, '#ffc69a'); wall.addColorStop(1, '#f3a982');
  o.fillStyle = wall; o.fillRect(0, 0, 360, 640);
  o.strokeStyle = 'rgba(255,255,255,0.18)'; o.lineWidth = 8; for (let x = -40; x < 400; x += 46) { o.beginPath(); o.moveTo(x, 0); o.lineTo(x + 60, 640); o.stroke(); }
  // the noticeboard: cork in a wooden frame
  o.fillStyle = '#8a5a34'; o.beginPath(); o.roundRect(14, 126, 332, 178, 14); o.fill();
  const ck = o.createLinearGradient(0, 136, 0, 294); ck.addColorStop(0, '#d9a56a'); ck.addColorStop(1, '#c48c52'); o.fillStyle = ck; o.beginPath(); o.roundRect(24, 136, 312, 158, 8); o.fill();
  const rnd = P.rng(5); for (let i = 0; i < 260; i++) { o.fillStyle = rnd() < 0.5 ? 'rgba(120,70,30,0.35)' : 'rgba(255,230,190,0.35)'; o.beginPath(); o.arc(26 + rnd() * 308, 138 + rnd() * 154, 0.8 + rnd() * 1.4, 0, 7); o.fill(); }
  // floor and a rug
  o.fillStyle = '#b8794a'; o.fillRect(0, 560, 360, 80); o.strokeStyle = 'rgba(80,40,20,0.3)'; o.lineWidth = 2; for (let x = 0; x < 360; x += 60) { o.beginPath(); o.moveTo(x, 560); o.lineTo(x - 20, 640); o.stroke(); }
  o.fillStyle = '#7ab8d8'; o.beginPath(); o.ellipse(160, 600, 140, 22, 0, 0, 7); o.fill(); o.strokeStyle = '#fff6ea'; o.lineWidth = 3; o.setLineDash([8, 6]); o.beginPath(); o.ellipse(160, 600, 124, 16, 0, 0, 7); o.stroke(); o.setLineDash([]);
  P.vignette(o, 360, 640, 0.22, '#5a2a20');
}
function boardDeco(c, t) { // the board already shows one fun thing, and a little bird sits on its frame
  card(c, 'flower', 70, 182, 0.78, t, -0.06); c.fillStyle = '#e83a4a'; c.beginPath(); c.arc(70, 158, 5, 0, 7); c.fill();
  SK.animal(c, 'bird', 300, 130, 0.6, { t, pose: 'idle', expr: 'happy', facing: -1 });
}
function pic(c, kind, t) { // the picture on a card, centred on (0, 0), about 60 x 46
  c.lineCap = 'round'; c.lineJoin = 'round';
  if (kind === 'cat') { c.strokeStyle = '#6a4a3a'; c.lineWidth = 2.5; c.fillStyle = '#ffb860'; c.beginPath(); c.ellipse(0, 6, 15, 12, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(0, -8, 11, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-9, -14); c.lineTo(-8, -24); c.lineTo(-2, -18); c.moveTo(9, -14); c.lineTo(8, -24); c.lineTo(2, -18); c.fill(); c.stroke(); c.fillStyle = '#3a2a2a'; c.beginPath(); c.arc(-4, -9, 1.8, 0, 7); c.arc(4, -9, 1.8, 0, 7); c.fill(); c.beginPath(); c.moveTo(15, 10); c.quadraticCurveTo(28, 4, 22, -6); c.stroke(); }
  else if (kind === 'rainbow') { ['#ff5a5a', '#ffa040', '#ffe040', '#5ad06a', '#4aa0ff', '#9a6aff'].forEach((col, i) => { c.strokeStyle = col; c.lineWidth = 4; c.beginPath(); c.arc(0, 14, 26 - i * 4, Math.PI, 0); c.stroke(); }); c.fillStyle = '#fff'; c.beginPath(); c.arc(-22, 14, 6, 0, 7); c.arc(-15, 15, 5, 0, 7); c.arc(22, 14, 6, 0, 7); c.arc(15, 15, 5, 0, 7); c.fill(); }
  else if (kind === 'sun') { c.save(); c.rotate(t * 0.8); c.strokeStyle = '#ffa020'; c.lineWidth = 3; for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; c.beginPath(); c.moveTo(Math.cos(a) * 15, Math.sin(a) * 15); c.lineTo(Math.cos(a) * 22, Math.sin(a) * 22); c.stroke(); } c.restore(); c.fillStyle = '#ffd030'; c.beginPath(); c.arc(0, 0, 12, 0, 7); c.fill(); c.fillStyle = '#8a4a20'; c.beginPath(); c.arc(-4, -2, 1.6, 0, 7); c.arc(4, -2, 1.6, 0, 7); c.fill(); c.strokeStyle = '#8a4a20'; c.lineWidth = 1.8; c.beginPath(); c.arc(0, 2, 5, 0.3, 2.8); c.stroke(); }
  else if (kind === 'flower') { c.strokeStyle = '#3a8a3a'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 22); c.lineTo(0, 0); c.stroke(); c.fillStyle = '#ff7ab0'; for (let i = 0; i < 6; i++) { const a = i * 1.047; c.beginPath(); c.ellipse(Math.cos(a) * 9, -6 + Math.sin(a) * 9, 7, 5, a, 0, 7); c.fill(); } c.fillStyle = '#ffe040'; c.beginPath(); c.arc(0, -6, 5, 0, 7); c.fill(); }
  else if (kind === 'key') { // the password: a key and four secret dots
    c.fillStyle = '#e8b030'; c.strokeStyle = '#8a5a10'; c.lineWidth = 2; c.beginPath(); c.arc(-14, -6, 9, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#ffe0e6'; c.beginPath(); c.arc(-14, -6, 3.5, 0, 7); c.fill(); c.fillStyle = '#e8b030';
    c.beginPath(); c.rect(-6, -9, 28, 6); c.rect(14, -3, 4, 7); c.rect(20, -3, 3, 5); c.fill(); c.stroke();
    c.fillStyle = '#3a2440'; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(-15 + i * 10, 15, 3.4, 0, 7); c.fill(); }
  }
  else if (kind === 'house') { // your home: a house with a map pin over it
    c.fillStyle = '#fff6ea'; c.strokeStyle = '#6a3a3a'; c.lineWidth = 2; c.beginPath(); c.rect(-15, -2, 30, 22); c.fill(); c.stroke(); c.fillStyle = '#e8564a'; c.beginPath(); c.moveTo(-19, -1); c.lineTo(0, -17); c.lineTo(19, -1); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#8a5a3a'; c.fillRect(-4, 8, 8, 12); c.fillStyle = '#7ac0ff'; c.fillRect(6, 3, 6, 6);
    c.save(); c.translate(17, -16); c.fillStyle = '#e83a5a'; c.beginPath(); c.arc(0, -4, 7, Math.PI, 0); c.lineTo(0, 9); c.closePath(); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(0, -4, 2.6, 0, 7); c.fill(); c.restore();
  }
  else if (kind === 'phone') { c.fillStyle = '#3a3a5a'; c.beginPath(); c.roundRect(-11, -20, 22, 40, 5); c.fill(); c.fillStyle = '#9ad8ff'; c.fillRect(-8, -15, 16, 26); c.fillStyle = '#3a2440'; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { c.beginPath(); c.arc(-5 + i * 5, -9 + j * 7, 1.6, 0, 7); c.fill(); } c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 16, 2, 0, 7); c.fill(); }
}
function card(c, kind, x, y, s, t, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  c.fillStyle = 'rgba(60,20,20,0.25)'; c.beginPath(); c.roundRect(-CW / 2 + 3, -CH / 2 + 5, CW, CH, 9); c.fill();
  c.fillStyle = '#fffaf0'; c.strokeStyle = '#a07050'; c.lineWidth = 2; c.beginPath(); c.roundRect(-CW / 2, -CH / 2, CW, CH, 9); c.fill(); c.stroke();
  c.fillStyle = KINDS[kind].bg; c.beginPath(); c.roundRect(-CW / 2 + 6, -CH / 2 + 6, CW - 12, CH - 12, 6); c.fill();
  pic(c, kind, t); c.restore();
}
function chest(c, x, y, open, locked, t) {
  c.save(); c.translate(x, y);
  SK.shadow(c, 0, 30, 46, 9, 0.3);
  c.fillStyle = '#8a4a24'; c.strokeStyle = '#4a2410'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-42, -8, 84, 40, 6); c.fill(); c.stroke();
  c.fillStyle = '#e8b030'; c.fillRect(-42, 4, 84, 6); c.fillRect(-30, -8, 6, 40); c.fillRect(24, -8, 6, 40);
  // the lid swings open on its back hinge
  c.save(); c.translate(0, -8); c.scale(1, Math.cos(open * 1.3)); c.translate(0, 8);
  c.fillStyle = '#a05a2c'; c.beginPath(); c.moveTo(-44, -8); c.lineTo(-44, -20); c.quadraticCurveTo(0, -44, 44, -20); c.lineTo(44, -8); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#e8b030'; c.fillRect(-30, -34, 6, 26); c.fillRect(24, -34, 6, 26); c.restore();
  if (open > 0.3) { c.fillStyle = 'rgba(255,230,140,0.5)'; c.beginPath(); c.ellipse(0, -10, 36 * open, 8 * open, 0, 0, 7); c.fill(); }
  // the padlock
  const ls = locked ? B7.pop(locked) : 0.8; c.save(); c.translate(0, 6); c.scale(ls, ls); c.strokeStyle = '#c89a20'; c.lineWidth = 3.5; c.beginPath(); c.arc(0, -6 + (locked ? 0 : -3), 6, Math.PI, 0); c.stroke(); c.fillStyle = '#ffd040'; c.strokeStyle = '#8a5a10'; c.lineWidth = 2; c.beginPath(); c.roundRect(-9, -6, 18, 15, 3); c.fill(); c.stroke(); c.fillStyle = '#4a2410'; c.beginPath(); c.arc(0, 0, 2.4, 0, 7); c.fill(); c.restore();
  c.restore();
}
function pinSpot(i) { const col = (i + 1) % 4, row = Math.floor((i + 1) / 4); return [70 + col * 74, 182 + row * 72]; } // spot 0 holds the board's own drawing
MG.add({
  id: 'cs_hide', stage: 'apps', cmd: 'HIDE!', time: 7, mood: 'party', winText: 'Private!', failText: 'Snatched!',
  card: { title: 'Keep private things private', kind: 'Computer science', ref: 'Personal information online (Code.org CS Fundamentals)',
    text: 'Some things about you are fine to share online, like a drawing of your cat or your favourite colour. Other things should stay private: your password, where you live and your phone number.\n\nOnce something is posted, anyone who can see the page can copy it, including strangers. A password lets someone pretend to be you. An address tells a stranger where to find you.\n\nIf someone online asks for one of these, keep it to yourself and tell a grown-up you trust.',
    note: 'Share the fun things; keep your password, address and phone number private.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level), ord = ORDERS[L];
    s.gap = [1.0, 0.9, 0.8][L]; s.rise = [85, 95, 105][L];
    s.cards = ord.map((k, i) => ({ i, kind: k, x: 180 + (i % 2 ? 12 : -12), y: i ? 690 : 590, t0: i * s.gap, state: 'wait', ph: g.rand() * 6 }));
    s.pins = 0; s.chestOpen = 0; s.fox = null; s.lock = 0;
    s.stranger = L >= 2; // level 2: a stranger's message tugs the house card toward it
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    const cd = SK.pick(s.cards.filter(c2 => c2.state === 'float'), x, y, 52); if (cd) { cd.state = 'held'; SK.dragStart(g, cd, x, y); g.sfx('tap'); }
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const cd = d.obj;
    const sp = Math.hypot(d.vx, d.vy), toward = ((CHEST.x - cd.x) * d.vx + (CHEST.y - cd.y) * d.vy) / (sp * SK.dist(cd.x, cd.y, CHEST.x, CHEST.y) || 1); // flung roughly toward the chest, or dropped on it
    if ((toward > 0.5 && sp > 280) || SK.dist(cd.x, cd.y, CHEST.x, CHEST.y) < 70) { cd.state = 'fly'; cd.fx = cd.x; cd.fy = cd.y; cd.ft = g.t; g.sfx('swoosh'); }
    else cd.state = 'float';
  },
  update(g, dt) {
    const s = g.s; if (g.done) return;
    let near = 0;
    for (const cd of s.cards) {
      if (cd.state === 'wait' && g.t >= cd.t0) cd.state = 'float';
      if (cd.state === 'float') {
        cd.y -= s.rise * dt; cd.x += Math.sin(g.t * 1.6 + cd.ph) * 12 * dt;
        if (s.stranger && cd.kind === 'house' && cd.y < 580) { cd.x -= 55 * dt; if (cd.x < 70 && !g.done) { cd.state = 'stolen'; s.fox = { t: g.t, cd, by: 'stranger' }; g.sfx('laugh'); g.fail(); } }
        if (cd.y < BOARD_Y && !g.done) {
          if (KINDS[cd.kind].priv) { cd.state = 'stolen'; s.fox = { t: g.t, cd }; cd.pin = pinSpot(s.pins); g.sfx('laugh'); g.fail(); }
          else { cd.state = 'pin'; cd.pin = pinSpot(s.pins++); cd.pt = g.t; cd.px = cd.x; cd.py = cd.y; g.sfx('ding'); }
        }
      }
      if (cd.state === 'fly') {
        near = 1; const k = (g.t - cd.ft) / 0.35; if (k >= 1) {
          cd.state = 'kept'; g.sfx('thud');
          if (!KINDS[cd.kind].priv && !g.done) { s.sulk = { t: g.t, cd }; g.sfx('wrong'); g.fail(); } else g.burst(CHEST.x, CHEST.y - 20, ['#ffd040', '#fff6ea'], 8, 90);
        }
      }
      if (cd.state === 'held' && SK.dist(cd.x, cd.y, CHEST.x, CHEST.y) < 120) near = 1;
    }
    s.chestOpen = SK.lerp(s.chestOpen, near, 0.25);
    if (!g.done && s.cards.every(cd => cd.state === 'kept' || (cd.state === 'pin' && g.t - cd.pt > 0.3))) { s.lock = g.t; g.win(); g.sfx('cheer'); g.burst(180, 220, ['#ff7ab0', '#ffe040', '#7ac0ff'], 20, 160); }
  },
  draw(g, c) {
    const s = g.s, t = g.t;
    c.drawImage(g.bake('cs_hide', paintRoom), 0, 0, 360, 640);
    boardDeco(c, t);
    // pinned cards (with a red pin), then the chest, then the floating cards
    for (const cd of s.cards) if (cd.state === 'pin') {
      const k = SK.easeOut((t - cd.pt) / 0.4), x = SK.lerp(cd.px, cd.pin[0], k), y = SK.lerp(cd.py, cd.pin[1], k);
      card(c, cd.kind, x, y, SK.lerp(1, 0.78, k), t, Math.sin(cd.i * 2.3) * 0.08 * k);
      if (k > 0.9) { c.fillStyle = '#e83a4a'; c.beginPath(); c.arc(x, y - 24, 5, 0, 7); c.fill(); c.fillStyle = '#ffb0b8'; c.beginPath(); c.arc(x - 1.5, y - 25.5, 1.8, 0, 7); c.fill(); }
    }
    chest(c, CHEST.x, CHEST.y, s.chestOpen, s.lock ? Math.min(1, (t - s.lock) * 3) : 0, t);
    // the stranger (level 2): a hooded fox at the left, its message asking for your house
    if (s.stranger) {
      const pull = s.cards.some(cd => cd.kind === 'house' && cd.state === 'float' && cd.y < 560);
      SK.animal(c, 'fox', 40, 500, 0.75, { t, pose: s.fox && s.fox.by ? 'cheer' : 'wave', expr: s.fox && s.fox.by ? 'laugh' : 'happy', tint: '#8a7aa0' });
      c.save(); c.translate(64, 400 + Math.sin(t * 3) * 3); c.fillStyle = '#fff'; c.strokeStyle = '#6a4a8a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-34, -26, 68, 52, 14); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-14, 26); c.lineTo(-24, 42); c.lineTo(0, 26); c.fill();
      c.save(); c.scale(0.7, 0.7); c.translate(-8, 2); pic(c, 'house', t); c.restore(); c.fillStyle = '#e83a5a'; c.font = '900 24px Nunito, system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 22, 0); c.restore();
      if (pull) { c.save(); c.strokeStyle = 'rgba(140,100,180,0.5)'; c.lineWidth = 3; c.setLineDash([4, 8]); c.lineDashOffset = t * 40; const h = s.cards.find(cd => cd.kind === 'house'); c.beginPath(); c.moveTo(80, 410); c.lineTo(h.x, h.y); c.stroke(); c.restore(); }
    }
    for (const cd of s.cards) {
      if (cd.state === 'float' || cd.state === 'held') card(c, cd.kind, cd.x, cd.y, cd.state === 'held' ? 1.08 : 1, t, Math.sin(t * 1.6 + cd.ph) * 0.06);
      if (cd.state === 'fly') { const k = SK.easeInOut((t - cd.ft) / 0.35); card(c, cd.kind, SK.lerp(cd.fx, CHEST.x, k), SK.lerp(cd.fy, CHEST.y - 18, k) - Math.sin(k * Math.PI) * 40, 1 - k * 0.6, t, k * 2); }
    }
    // the fox plucks the private card off the board and runs off with it
    if (s.fox) {
      const k = (t - s.fox.t), cd = s.fox.cd;
      if (!s.fox.by) {
        const run = Math.max(0, k - 0.6), fx = cd.pin[0] + 60 + run * 260, fy = 330;
        const cx = k < 0.6 ? SK.lerp(cd.x, cd.pin[0] + 40, k / 0.6) : fx + 10, cy = k < 0.6 ? SK.lerp(cd.y, 300, k / 0.6) : fy - 70;
        SK.animal(c, 'fox', k < 0.6 ? 400 - k / 0.6 * (400 - cd.pin[0] - 60) : fx, fy, 0.9, { t, pose: k < 0.6 ? 'walk' : 'carry', expr: 'laugh', facing: k < 0.6 ? -1 : 1 });
        card(c, cd.kind, cx, cy, 0.8, t, Math.sin(t * 9) * 0.2);
      } else { card(c, cd.kind, Math.max(30, cd.x - k * 60), cd.y - k * 30, Math.max(0.5, 1 - k * 0.4), t, Math.sin(t * 9) * 0.2); }
    }
    // the owl host, on the rug
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'owl', 48, 612, 0.85, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
    // guidance: glow the private cards; the ghost hand flicks the first one into the chest
    for (const cd of s.cards) if (cd.state === 'float' && KINDS[cd.kind].priv) SK.glow(c, g, cd.x, cd.y, 44, '#ff8aa0', { level: 0 });
    const first = s.cards.find(cd => KINDS[cd.kind].priv && cd.state === 'float');
    if (first) SK.demo(g, c, 'swipe', [first.x, first.y], [CHEST.x - 10, CHEST.y - 20], { delay: first.t0 + 0.6 });
  },
  // the bot: fling each private card at the chest once it is well up on screen (B7FAIL: lets the key float up)
  auto(g, dt, synth) {
    const s = g.s; if (g.done) return; const fail = typeof window !== 'undefined' && window.B7FAIL;
    for (const cd of s.cards) {
      if (!KINDS[cd.kind].priv || (fail && cd.kind === 'key')) continue; const B = g.s._bot || {}, key = 'k' + cd.i;
      if (B[key] === 1 || (cd.state === 'float' && cd.y < 520 && !B[key])) { if (!B[key]) cd._a = [cd.x, cd.y]; const dx = CHEST.x - cd._a[0], dy = CHEST.y - cd._a[1], L = Math.hypot(dx, dy); SK.bot.drag(g, synth, key, 0, cd._a, [cd._a[0] + dx / L * 60, cd._a[1] + dy / L * 60], 0.12); return; }
    }
  },
});
