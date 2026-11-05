// TRADE! (business EL-16) — a picnic. You (the bird) have a box of apples and dream of a pear, a banana and grapes.
// Three friends each have one of those and dream of an apple. Drag an apple to each friend: their fruit slides back,
// and every lunch box ends up with more variety than it started with. Give one friend a second apple and it is left
// juggling apples it didn't want. Level 2: the frog wants a banana, not an apple, so first trade an apple for the owl's
// banana, then the banana for the frog's pear (a chain of trades).
const ME = { x: 150, y: 566 }, POS = { frog: { x: 62, y: 418 }, owl: { x: 180, y: 336 }, duck: { x: 298, y: 418 } };
const BOXCOL = { me: '#5aa8e8', frog: '#7ac870', owl: '#b88ae0', duck: '#f5c23a' };
const SETUP = [
  { me: ['apple', 'apple', 'apple'], dream: ['pear', 'banana', 'grapes'], f: { frog: ['pear', 'apple'], owl: ['banana', 'apple'], duck: ['grapes', 'apple'] } },
  { me: ['apple', 'apple', 'apple'], dream: ['pear', 'banana', 'grapes'], f: { frog: ['pear', 'apple'], owl: ['banana', 'apple'], duck: ['grapes', 'apple'] } },
  { me: ['apple', 'apple'], dream: ['pear', 'grapes'], f: { frog: ['pear', 'banana'], owl: ['banana', 'apple'], duck: ['grapes', 'apple'] } },
]; // f: [what the friend has, what it wants]
function fruit(c, kind, x, y, s = 1, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  if (kind === 'apple') { c.fillStyle = '#e8403a'; c.beginPath(); c.arc(-6, 2, 13, 0, 7); c.arc(6, 2, 13, 0, 7); c.fill(); c.strokeStyle = '#8a1a14'; c.lineWidth = 2; c.stroke(); c.strokeStyle = '#5a3a1a'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -9); c.lineTo(2, -18); c.stroke(); c.fillStyle = '#5ab050'; c.beginPath(); c.ellipse(9, -16, 8, 4, -0.4, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.ellipse(-9, -3, 4, 2.5, -0.5, 0, 7); c.fill(); }
  if (kind === 'pear') { c.fillStyle = '#b8d040'; c.strokeStyle = '#6a7a1a'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, -8, 8, 11, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(0, 6, 13, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.ellipse(0, -6, 7, 9, 0, 0, 7); c.fill(); c.strokeStyle = '#5a3a1a'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -18); c.lineTo(3, -25); c.stroke(); c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(-6, 2, 3.5, 2.5, -0.5, 0, 7); c.fill(); }
  if (kind === 'banana') { c.strokeStyle = '#7a5a10'; c.lineWidth = 2; c.fillStyle = '#f8d838'; c.beginPath(); c.moveTo(-16, -8); c.quadraticCurveTo(-10, 16, 18, 8); c.quadraticCurveTo(-2, 4, -12, -12); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#5a3a1a'; c.fillRect(-17, -14, 5, 6); }
  if (kind === 'grapes') { c.fillStyle = '#9a5ad0'; c.strokeStyle = '#4a1a70'; c.lineWidth = 1.5; for (const [gx, gy] of [[-8, -6], [0, -8], [8, -6], [-4, 2], [4, 2], [0, 10]]) { c.beginPath(); c.arc(gx, gy, 6, 0, 7); c.fill(); c.stroke(); } c.strokeStyle = '#5a3a1a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, -12); c.lineTo(2, -20); c.stroke(); c.fillStyle = '#5ab050'; c.beginPath(); c.ellipse(8, -16, 7, 3.5, -0.4, 0, 7); c.fill(); }
  c.restore();
}
function lunchbox(c, x, y, col, w = 96) {
  c.fillStyle = 'rgba(40,20,40,0.22)'; c.beginPath(); c.ellipse(x, y + 30, w * 0.55, 9, 0, 0, 7); c.fill();
  c.fillStyle = col; c.strokeStyle = P.shade(col, -0.5); c.lineWidth = 2.5; c.beginPath(); c.roundRect(x - w / 2, y - 6, w, 34, 8); c.fill(); c.stroke();
  c.fillStyle = P.shade(col, 0.3); c.fillRect(x - w / 2 + 4, y - 2, w - 8, 6);
}
function heart(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#ff5a8a'; c.strokeStyle = '#a81a4a'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 8); c.bezierCurveTo(-18, -4, -10, -18, 0, -8); c.bezierCurveTo(10, -18, 18, -4, 0, 8); c.fill(); c.stroke(); c.restore(); }
function bubble(c, x, y, kinds, okList, t, tailDir = 1) { // a dream bubble with one or more fruits (each glows green once owned)
  const n = kinds.length, w = 30 + n * 36; c.save(); c.fillStyle = '#ffffff'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5;
  c.beginPath(); c.roundRect(x - w / 2, y - 26, w, 52, 26); c.fill(); c.stroke(); c.beginPath(); c.arc(x + tailDir * 12, y + 34, 6, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(x + tailDir * 18, y + 46, 3.5, 0, 7); c.fill(); c.stroke();
  kinds.forEach((k, i) => { const fx = x + (i - (n - 1) / 2) * 36; if (okList[i]) { c.fillStyle = 'rgba(90,208,122,0.35)'; c.beginPath(); c.arc(fx, y, 17, 0, 7); c.fill(); } fruit(c, k, fx, y + 2, 0.8, Math.sin(t * 2 + i) * 0.1); });
  c.restore();
}
function paintPicnic(o) {
  const sky = o.createLinearGradient(0, 0, 0, 300); sky.addColorStop(0, '#e8a0c0'); sky.addColorStop(0.6, '#f8d0d8'); sky.addColorStop(1, '#fff4e8'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
  P.hills(o, 360, 250, 40, '#c8e090', '#98c068', { seed: 12 }); P.tree(o, 336, 250, 1.0, '#6a9a4a', 3); P.tree(o, 24, 244, 0.85, '#7aa850', 6);
  const gr = o.createLinearGradient(0, 250, 0, 640); gr.addColorStop(0, '#a8d070'); gr.addColorStop(1, '#78a848'); o.fillStyle = gr; o.fillRect(0, 250, 360, 390);
  P.flowers(o, 360, 270, 630, 26, undefined, 4);
  o.save(); o.translate(180, 480); o.scale(1, 0.5); o.rotate(0.06); for (let i = -6; i < 6; i++) for (let j = -6; j < 6; j++) { o.fillStyle = (i + j) % 2 ? '#e8566a' : '#fff4e8'; o.fillRect(i * 34, j * 34, 34, 34); } o.restore();
}
MG.add({
  id: 'tradefruit', stage: 'markets', cmd: 'TRADE FOR WHAT YOU WANT!', time: 6, mood: 'desert', winText: 'Win-win!', failText: 'Too many!', hold: 1.6,
  card: { title: 'A trade helps both sides', kind: 'Economics', ref: 'Voluntary exchange',
    text: 'You have apples and want other fruit. Each friend has a fruit you want and wants an apple. Swap one for one, and each of you ends up with something you wanted more than what you gave. Nobody lost, and both sides are better off.\n\nA trade only happens when each side wants what the other has. Sometimes it takes a chain of swaps to get there. Money makes this easier: you sell an apple for coins and buy a pear from anyone.',
    note: 'When both sides choose to trade, both can end up better off.' },
  init(g) {
    const S = SETUP[Math.min(2, g.level)], s = g.s;
    s.box = { me: S.me.slice() }; s.has = {}; s.want = {}; s.got = {};
    for (const w in S.f) { s.box[w] = [S.f[w][0], S.f[w][0]]; s.has[w] = S.f[w][0]; s.want[w] = S.f[w][1]; s.got[w] = 0; }
    s.dream = S.dream; s.fly = []; s.drag = null; s.juggle = 0; s.jugWho = null;
  },
  slots(g, who) { const p = who === 'me' ? ME : POS[who], n = g.s.box[who].length, sp = who === 'me' ? 34 : 28; return g.s.box[who].map((k, i) => ({ k, x: p.x + (i - (n - 1) / 2) * sp, y: p.y })); },
  owned(g) { return g.s.dream.map(k => g.s.box.me.includes(k)); },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.drag) return;
    const sl = this.slots(g, 'me'); let best = -1, bd = 44; sl.forEach((o, i) => { const d = SK.dist(o.x, o.y, x, y); if (d < bd) { bd = d; best = i; } });
    if (best >= 0) { const k = s.box.me.splice(best, 1)[0]; s.drag = { k, x: sl[best].x, y: sl[best].y }; SK.dragStart(g, s.drag, x, y); g.sfx('tap'); }
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !s.drag) return; const it = s.drag; s.drag = null;
    const to = Object.keys(POS).find(w => SK.dist(it.x, it.y, POS[w].x, POS[w].y - 30) < 64);
    if (!to) { s.box.me.push(it.k); g.sfx('boing'); return; }
    if (s.want[to] !== it.k) { s.fly.push({ k: it.k, from: [it.x, it.y], t: g.t, back: true }); g.sfx('wrong'); s.shake = { who: to, t: g.t }; return; } // "no thanks": it bounces back
    if (s.got[to]) { s.box[to].push(it.k); s.juggle = g.t; s.jugWho = to; g.sfx('boing'); g.sfx('laugh'); g.fail(); return; } // a second one it doesn't need
    // the trade: your fruit goes in, one of theirs slides back
    s.box[to].push(it.k); s.got[to] = g.t; g.sfx('pop');
    s.box[to].splice(s.box[to].indexOf(s.has[to]), 1); s.fly.push({ k: s.has[to], from: [POS[to].x, POS[to].y], t: g.t + 0.1 });
  },
  update(g, dt) {
    const s = g.s;
    for (const f of s.fly) if (!f.done && g.t > f.t + 0.5) { f.done = true; s.box.me.push(f.k); if (!f.back) g.sfx('ding'); }
    s.fly = s.fly.filter(f => !f.done);
    if (!g.done && this.owned(g).every(Boolean)) { g.win(); g.sfx('cheer'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('b8trade_p2', paintPicnic), 0, 0, 360, 640);
    for (const [w, kind] of [['owl', 'owl'], ['frog', 'frog'], ['duck', 'duck']]) {
      const p = POS[w], sh = s.shake && s.shake.who === w && t - s.shake.t < 0.6 ? Math.sin((t - s.shake.t) * 40) * 5 : 0, juggling = lost && s.jugWho === w, happy = !!s.got[w] && !juggling;
      SK.animal(c, kind, p.x + sh, p.y - 12, 0.9, { t, phase: p.x, facing: p.x > 180 ? -1 : 1, pose: juggling ? 'balance' : happy && (won || t - s.got[w] < 0.8) ? 'cheer' : 'idle', expr: juggling ? 'wow' : happy ? 'laugh' : sh ? 'sad' : 'happy' });
      lunchbox(c, p.x, p.y, BOXCOL[w], 80);
      if (juggling) s.box[w].forEach((k, i) => { const a = (t - s.juggle) * 7 + i * 2.1; fruit(c, k, p.x + Math.cos(a) * 26, p.y - 96 - Math.abs(Math.sin(a)) * 36, 0.8, a); });
      else for (const o of this.slots(g, w)) fruit(c, o.k, o.x, o.y + 2, 0.75);
      bubble(c, p.x + (w === 'owl' ? 74 : 0), p.y - (w === 'owl' ? 112 : 126), [s.want[w]], [!!s.got[w]], t + p.x, w === 'owl' ? -1 : 1);
      if (s.got[w] && !juggling) { const q = SK.clamp((t - s.got[w]) * 2, 0, 1); heart(c, p.x + 30, p.y - 60 - q * 20, 0.4 + q * 0.4); }
    }
    // you, your box and your dream
    SK.animal(c, 'bird', ME.x, ME.y - 14, 1.05, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'happy' });
    lunchbox(c, ME.x, ME.y, BOXCOL.me, 118);
    for (const o of this.slots(g, 'me')) fruit(c, o.k, o.x, o.y + 2, 0.85);
    bubble(c, 286, 520, s.dream, this.owned(g), t, -1);
    if (won) { const q = SK.clamp((t - g.doneAt) * 2, 0, 1); heart(c, ME.x, ME.y - 100 - q * 30, 0.6 + q * 0.8); }
    // fruit sliding back to you (or bouncing back)
    for (const f of s.fly) { const q = SK.clamp((t - f.t) / 0.5, 0, 1); if (q <= 0) continue; fruit(c, f.k, SK.lerp(f.from[0], ME.x + 40, SK.easeInOut(q)), SK.lerp(f.from[1], ME.y, SK.easeInOut(q)) - Math.sin(q * Math.PI) * 50, 0.85, q * 6); }
    if (s.drag) fruit(c, s.drag.k, s.drag.x, s.drag.y, 1.05);
    const tg = this.target(g);
    if (tg && !s.drag && !g.done) { const m = this.slots(g, 'me').find(o => o.k === tg.k); if (m) { SK.glow(c, g, m.x, m.y, 22); SK.demo(g, c, 'drag', [m.x, m.y], [POS[tg.w].x, POS[tg.w].y - 20], { delay: 0.7, arc: 40 }); } }
  },
  // the next useful trade (for the guidance and the bot): a friend not yet traded with who wants something you hold
  target(g) {
    const s = g.s; for (const w of ['owl', 'frog', 'duck']) if (!s.got[w] && s.box.me.includes(s.want[w])) return { k: s.want[w], w };
    return null;
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._b8 = s._b8 || { n: 0, next: 1.0 }; if (g.done) return;
    if (!B.cur) { if (s.drag || s.fly.length || g.t < B.next) return; const tg = this.target(g); if (!tg) return; const m = this.slots(g, 'me').find(o => o.k === tg.k); B.cur = { a: [m.x, m.y], b: [POS[tg.w].x, POS[tg.w].y - 30], t: g.t, key: 'tr' + B.n }; }
    if (SK.bot.drag(g, synth, B.cur.key, B.cur.t, B.cur.a, B.cur.b, 0.4)) { B.n++; B.cur = null; B.next = g.t + 0.1; }
  },
});
