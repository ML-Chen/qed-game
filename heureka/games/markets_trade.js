// TRADE! (business EL-16) — a picnic. You (the bird) have two apples and dream of a pear; your friend the frog has two
// pears and dreams of an apple. Drag one apple to the frog: a pear slides back, both lunch boxes now hold an apple and a
// pear, and two hearts pop. Give away both apples and the frog is left juggling three apples while you have none.
// Level 2: three friends. The frog wants a banana, the owl has bananas and wants an apple: trade around the circle.
const ME = { x: 76, y: 470 }, FRIENDS = { frog: { x: 284, y: 470 }, owl: { x: 180, y: 318 } };
function fruit(c, kind, x, y, s = 1, rot = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  if (kind === 'apple') { c.fillStyle = '#e8403a'; c.beginPath(); c.arc(-6, 2, 13, 0, 7); c.arc(6, 2, 13, 0, 7); c.fill(); c.strokeStyle = '#8a1a14'; c.lineWidth = 2; c.stroke(); c.strokeStyle = '#5a3a1a'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -9); c.lineTo(2, -18); c.stroke(); c.fillStyle = '#5ab050'; c.beginPath(); c.ellipse(9, -16, 8, 4, -0.4, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.ellipse(-9, -3, 4, 2.5, -0.5, 0, 7); c.fill(); }
  if (kind === 'pear') { c.fillStyle = '#b8d040'; c.strokeStyle = '#6a7a1a'; c.lineWidth = 2; c.beginPath(); c.arc(0, 6, 13, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.ellipse(0, -8, 8, 11, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(0, 6, 12, 0, 7); c.fill(); c.strokeStyle = '#5a3a1a'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -18); c.lineTo(3, -25); c.stroke(); c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(-6, 2, 3.5, 2.5, -0.5, 0, 7); c.fill(); }
  if (kind === 'banana') { c.strokeStyle = '#7a5a10'; c.lineWidth = 2; c.fillStyle = '#f8d838'; c.beginPath(); c.moveTo(-16, -8); c.quadraticCurveTo(-10, 16, 18, 8); c.quadraticCurveTo(-2, 4, -12, -12); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#5a3a1a'; c.fillRect(-17, -14, 5, 6); }
  c.restore();
}
function lunchbox(c, x, y, col) {
  c.fillStyle = 'rgba(40,20,40,0.22)'; c.beginPath(); c.ellipse(x, y + 30, 58, 9, 0, 0, 7); c.fill();
  c.fillStyle = col; c.strokeStyle = P.shade(col, -0.5); c.lineWidth = 2.5; c.beginPath(); c.roundRect(x - 54, y - 6, 108, 36, 8); c.fill(); c.stroke();
  c.fillStyle = P.shade(col, 0.3); c.fillRect(x - 50, y - 2, 100, 6);
}
function heart(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#ff5a8a'; c.strokeStyle = '#a81a4a'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 8); c.bezierCurveTo(-18, -4, -10, -18, 0, -8); c.bezierCurveTo(10, -18, 18, -4, 0, 8); c.fill(); c.stroke(); c.restore(); }
function bubble(c, x, y, kind, ok, t) {
  c.save(); c.fillStyle = ok ? '#e8ffe8' : '#ffffff'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5;
  c.beginPath(); c.arc(x, y, 26, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(x + 14, y + 34, 6, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(x + 22, y + 46, 3.5, 0, 7); c.fill(); c.stroke();
  fruit(c, kind, x, y + 2, 0.95, Math.sin(t * 2) * 0.1); c.restore();
}
function paintPicnic(o) {
  const sky = o.createLinearGradient(0, 0, 0, 360); sky.addColorStop(0, '#e8a0c0'); sky.addColorStop(0.6, '#f8d0d8'); sky.addColorStop(1, '#fff4e8'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
  P.hills(o, 360, 300, 40, '#c8e090', '#98c068', { seed: 12 }); P.tree(o, 330, 300, 1.1, '#6a9a4a', 3); P.tree(o, 30, 290, 0.9, '#7aa850', 6);
  const gr = o.createLinearGradient(0, 300, 0, 640); gr.addColorStop(0, '#a8d070'); gr.addColorStop(1, '#78a848'); o.fillStyle = gr; o.fillRect(0, 300, 360, 340);
  P.flowers(o, 360, 330, 630, 26, undefined, 4);
  // the checked blanket
  o.save(); o.translate(180, 520); o.scale(1, 0.42); o.rotate(0.08); for (let i = -6; i < 6; i++) for (let j = -6; j < 6; j++) { o.fillStyle = (i + j) % 2 ? '#e8566a' : '#fff4e8'; o.fillRect(i * 34, j * 34, 34, 34); } o.restore();
}
MG.add({
  id: 'tradefruit', stage: 'markets', cmd: 'TRADE!', time: 5, mood: 'desert', winText: 'Both happy!', failText: 'Oops!', hold: 1.6,
  card: { title: 'A trade helps both sides', kind: 'Economics', ref: 'Voluntary exchange',
    text: 'You have two apples and want a pear. Your friend has two pears and wants an apple. Swap one for one, and each of you ends up with what you wanted. Nobody lost, and both of you are better off.\n\nA trade only happens when each side wants what the other has. With three friends, it can take a chain of swaps. Money makes this easier: you sell an apple for coins and buy a pear from someone else.',
    note: 'When both sides choose to trade, both can end up better off.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level);
    s.three = L >= 2;
    // what each one holds, and what it wants
    s.box = { me: ['apple', 'apple'], frog: s.three ? ['pear', 'pear'] : ['pear', 'pear'], owl: ['banana', 'banana'] };
    s.want = { me: 'pear', frog: s.three ? 'banana' : 'apple', owl: 'apple' };
    s.got = { me: 0, frog: 0, owl: 0 }; s.fly = []; s.drag = null; s.juggle = 0; s.lastGive = null;
  },
  boxPos(who) { return who === 'me' ? ME : FRIENDS[who]; },
  slots(g, who) { const p = this.boxPos(who), n = g.s.box[who].length; return g.s.box[who].map((k, i) => ({ k, x: p.x + (i - (n - 1) / 2) * 34, y: p.y })); },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.fly.length) return;
    const sl = this.slots(g, 'me'); let best = -1, bd = 46; sl.forEach((o, i) => { const d = SK.dist(o.x, o.y, x, y); if (d < bd) { bd = d; best = i; } });
    if (best >= 0) { const k = s.box.me.splice(best, 1)[0]; s.drag = { k, x: sl[best].x, y: sl[best].y }; SK.dragStart(g, s.drag, x, y); g.sfx('tap'); }
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !s.drag) return; const it = s.drag; s.drag = null;
    const to = ['frog', 'owl'].filter(w => w === 'frog' || s.three).find(w => { const p = this.boxPos(w); return SK.dist(it.x, it.y, p.x, p.y - 30) < 84; });
    if (!to) { s.box.me.push(it.k); g.sfx('boing'); return; }
    if (s.want[to] !== it.k) { s.fly.push({ k: it.k, from: [it.x, it.y], to: 'me', t: g.t, back: true }); g.sfx('wrong'); s.shake = { who: to, t: g.t }; return; } // "no thanks": it bounces back
    if (s.got[to]) { s.box[to].push(it.k); s.juggle = g.t; g.sfx('boing'); g.sfx('laugh'); g.fail(); return; } // a second one: too many!
    // the trade: your fruit goes in, one of theirs slides back
    s.box[to].push(it.k); s.got[to] = g.t; g.sfx('pop');
    const give = s.box[to].shift(); const p = this.boxPos(to); s.fly.push({ k: give, from: [p.x - 20, p.y], to: 'me', t: g.t + 0.15 });
  },
  update(g, dt) {
    const s = g.s;
    for (const f of s.fly) if (!f.done && g.t > f.t + 0.55) { f.done = true; s.box.me.push(f.k); if (!f.back) { g.sfx('ding'); if (f.k === s.want.me) s.got.me = g.t; } }
    s.fly = s.fly.filter(f => !f.done);
    if (!g.done && s.got.me && g.t > s.got.me + 0.2) { g.win(); g.sfx('cheer'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('b8trade_p', paintPicnic), 0, 0, 360, 640);
    const happy = w => won && (w === 'me' || s.got[w]);
    const who = [['me', 'bird', ME, 1], ['frog', 'frog', FRIENDS.frog, -1]]; if (s.three) who.push(['owl', 'owl', FRIENDS.owl, 1]);
    for (const [w, kind, p, face] of who) {
      const sh = s.shake && s.shake.who === w && t - s.shake.t < 0.6 ? Math.sin((t - s.shake.t) * 40) * 5 : 0;
      const juggling = lost && w === 'frog';
      SK.animal(c, kind, p.x + sh, p.y - 14, 1.05, { t, phase: face, facing: face, pose: happy(w) ? 'cheer' : juggling ? 'balance' : 'idle', expr: happy(w) ? 'laugh' : juggling ? 'wow' : lost && w === 'me' ? 'sad' : 'happy' });
      lunchbox(c, p.x, p.y, w === 'me' ? '#5aa8e8' : w === 'frog' ? '#f5c23a' : '#b88ae0');
      for (const o of this.slots(g, w)) if (!(juggling)) fruit(c, o.k, o.x, o.y + 2, 0.9);
      if (juggling) { const n = s.box.frog.length; s.box.frog.forEach((k, i) => { const a = (t - s.juggle) * 7 + i * 2.1; fruit(c, k, p.x + Math.cos(a) * 26, p.y - 100 - Math.abs(Math.sin(a)) * 40, 0.9, a); }); }
      // the dream bubble: what each one wants (green once they have it)
      const has = s.box[w].includes(s.want[w]) || (w !== 'me' && s.got[w]);
      bubble(c, p.x + (face > 0 ? -6 : 6) + (w === 'owl' ? 62 : 0), p.y - (w === 'owl' ? 120 : 150), s.want[w], has, t + face);
      if (happy(w)) { const q = SK.clamp((t - g.doneAt) * 2, 0, 1); heart(c, p.x, p.y - 96 - q * 30, 0.6 + q * 0.8); }
    }
    // fruit sliding back across the blanket
    for (const f of s.fly) { const q = SK.clamp((t - f.t) / 0.55, 0, 1); if (q <= 0 && !f.back) continue; const tx = ME.x + 17, ty = ME.y; fruit(c, f.k, SK.lerp(f.from[0], tx, SK.easeInOut(q)), SK.lerp(f.from[1], ty, SK.easeInOut(q)) - Math.sin(q * Math.PI) * 50, 0.9, q * 6); }
    // the fruit in your hand
    if (s.drag) fruit(c, s.drag.k, s.drag.x, s.drag.y, 1.1);
    // guidance: drag an apple to the friend who wants it
    const mine = this.slots(g, 'me');
    if (!s.drag && !s.fly.length && !g.done && mine.length) { const want = this.target(g); const m = mine.find(o => o.k === want.k) || mine[0]; SK.glow(c, g, m.x, m.y, 24); SK.demo(g, c, 'drag', [m.x, m.y], [want.p.x, want.p.y - 30], { delay: 0.7, arc: 50 }); }
  },
  // which of my fruits to give, and to whom (for the guidance and the bot)
  target(g) {
    const s = g.s;
    if (s.three && !s.got.owl) return { k: 'apple', p: FRIENDS.owl };
    if (s.three) return { k: 'banana', p: FRIENDS.frog };
    return { k: 'apple', p: FRIENDS.frog };
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._b8 = s._b8 || { n: 0, next: 1.0 }; if (g.done) return;
    if (!B.cur) { if (s.drag || s.fly.length || g.t < B.next) return; const tg = this.target(g), m = this.slots(g, 'me').find(o => o.k === tg.k); if (!m) return; B.cur = { a: [m.x, m.y], b: [tg.p.x, tg.p.y - 30], t: g.t, key: 'tr' + B.n }; }
    if (SK.bot.drag(g, synth, B.cur.key, B.cur.t, B.cur.a, B.cur.b, 0.45)) { B.n++; B.cur = null; B.next = g.t + 0.2; }
  },
});
