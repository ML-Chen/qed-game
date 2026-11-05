// CHECK BADGE! (cs SC-04) — you are the server. Requests arrive at the hatch one by one: each shows who is asking (their
// login badge) and which drawer of orders they want. Everyone is logged in, so that is not enough: carry a request to
// its drawer only if the badge matches the drawer's owner, and the order flies back to them. When the fox asks for the
// rabbit's drawer, slap it on the red stamp pad instead. Deliver it and the fox scribbles down the rabbit's address.
// Being logged in is not enough: the server must check that the thing asked for belongs to the one asking.
const HATCH = { x: 88, y: 336 }, PAD = { x: 88, y: 492 }, CAB = { x: 204, w: 136, y0: 160, h: 96 };
const OWN = ['frog', 'rabbit', 'duck'], TINT = { frog: '#7ac860', rabbit: '#f4a0c0', duck: '#ffd45a', fox: '#f0904a' };
const QUEUES = [
  [['frog', 'frog'], ['fox', 'rabbit'], ['rabbit', 'rabbit']],
  [['duck', 'duck'], ['fox', 'frog'], ['rabbit', 'rabbit'], ['fox', 'duck']],
  [['rabbit', 'rabbit'], ['fox', 'duck'], ['frog', 'frog'], ['fox', 'rabbit'], ['duck', 'duck']],
];
const drawerY = i => CAB.y0 + i * CAB.h + CAB.h / 2;
function paintRoom2(o) {
  const w = o.createLinearGradient(0, 0, 0, 640); w.addColorStop(0, '#3a4a6a'); w.addColorStop(1, '#2a3048'); o.fillStyle = w; o.fillRect(0, 0, 360, 640);
  o.strokeStyle = 'rgba(255,255,255,0.05)'; o.lineWidth = 2; for (let x = 0; x < 360; x += 30) { o.beginPath(); o.moveTo(x, 120); o.lineTo(x, 640); o.stroke(); }
  // the hatch: a window onto the street, with a counter
  o.fillStyle = '#9ad0f0'; o.beginPath(); o.roundRect(18, 150, 140, 140, 10); o.fill(); o.fillStyle = '#c8e8f8'; o.fillRect(18, 250, 140, 40);
  P.house(o, 40, 250, 40, 34, '#e6c79a'); P.house(o, 112, 250, 36, 30, '#c8a0d8');
  o.strokeStyle = '#5a3a24'; o.lineWidth = 8; o.beginPath(); o.roundRect(18, 150, 140, 140, 10); o.stroke();
  o.fillStyle = '#8a5a34'; o.fillRect(8, 292, 160, 16); o.fillStyle = '#6a4024'; o.fillRect(8, 308, 160, 6);
  // the stamp table
  o.fillStyle = '#6a4024'; o.fillRect(30, 520, 116, 10); o.fillRect(40, 530, 8, 70); o.fillRect(128, 530, 8, 70);
  o.fillStyle = '#4a3a2a'; o.fillRect(0, 600, 360, 40);
}
function drawerBox(c, i, owner, open, t, flash) {
  const y = drawerY(i), x = CAB.x, out = open * 26;
  c.save(); c.fillStyle = '#8a94a8'; c.strokeStyle = '#2a3040'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(x - 6, y - CAB.h / 2 - 2, CAB.w + 8, CAB.h + 4, 6); c.fill(); c.stroke();
  c.fillStyle = flash ? (Math.sin(t * 20) > 0 ? '#ff7a8a' : '#c8d0dc') : '#c8d0dc'; c.beginPath(); c.roundRect(x - out, y - CAB.h / 2 + 6, CAB.w - 4, CAB.h - 12, 5); c.fill(); c.stroke();
  c.fillStyle = '#6a7080'; c.fillRect(x - out + CAB.w / 2 - 14, y + 18, 28, 7);
  // the owner's face on the drawer's label
  c.fillStyle = '#fff6ea'; c.beginPath(); c.roundRect(x - out + 16, y - 34, 66, 48, 8); c.fill(); c.strokeStyle = TINT[owner]; c.lineWidth = 3; c.stroke();
  c.save(); c.beginPath(); c.roundRect(x - out + 16, y - 34, 66, 48, 8); c.clip(); SK.animal(c, owner, x - out + 49, y + 34, 0.62, { t, expr: 'happy', noShadow: true }); c.restore();
  // order slips inside
  if (open > 0.2) { for (let k = 0; k < 3; k++) { c.fillStyle = '#fff'; c.fillRect(x - out + 90 + k * 8, y - 30 - k * 2, 10, 20); } }
  c.restore();
}
function request(c, r, x, y, s, t) { // an envelope: the asker's badge on the left, the drawer it wants on the right
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = 'rgba(10,10,20,0.35)'; c.beginPath(); c.roundRect(-58, -34, 120, 72, 9); c.fill();
  c.fillStyle = '#fffaf0'; c.strokeStyle = '#5a4a6a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-60, -36, 120, 72, 9); c.fill(); c.stroke();
  c.fillStyle = '#e8e0f0'; c.beginPath(); c.moveTo(-58, -34); c.lineTo(0, 0); c.lineTo(58, -34); c.closePath(); c.fill();
  // the badge: a round tag with the asker's face and a green "logged in" dot
  c.fillStyle = '#fff'; c.strokeStyle = TINT[r.who]; c.lineWidth = 3.5; c.beginPath(); c.arc(-30, 6, 24, 0, 7); c.fill(); c.stroke();
  c.save(); c.beginPath(); c.arc(-30, 6, 22, 0, 7); c.clip(); SK.animal(c, r.who, -30, 40, 0.5, { t, expr: r.who === 'fox' ? 'think' : 'happy', noShadow: true }); c.restore();
  c.fillStyle = '#4ae87a'; c.strokeStyle = '#1a6a3a'; c.lineWidth = 2; c.beginPath(); c.arc(-12, -14, 6, 0, 7); c.fill(); c.stroke();
  // the drawer it asks for
  c.fillStyle = '#c8d0dc'; c.strokeStyle = '#2a3040'; c.lineWidth = 2; c.beginPath(); c.roundRect(10, -16, 42, 40, 5); c.fill(); c.stroke();
  c.save(); c.beginPath(); c.roundRect(12, -14, 38, 36, 4); c.clip(); SK.animal(c, r.want, 31, 20, 0.42, { t, expr: 'happy', noShadow: true }); c.restore();
  if (r.stamp) { const k = B7.pop((t - r.stamp) * 5); c.save(); c.rotate(-0.2); c.scale(k, k); c.strokeStyle = '#e83a4a'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(-24, -20); c.lineTo(24, 20); c.moveTo(24, -20); c.lineTo(-24, 20); c.stroke(); c.restore(); }
  c.restore();
}
MG.add({
  id: 'cs_badge', stage: 'apps', cmd: 'ONLY SEND ORDERS TO THEIR OWNER!', time: 7, mood: 'party', winText: 'Authorized!', failText: 'Data leak!',
  card: { title: 'Logged in is not enough', kind: 'Computer science', ref: 'Authorization (broken access control)',
    text: 'Logging in proves who you are. That is called authentication. It does not prove that you may see a particular thing.\n\nSo every time a request asks the server for something, like order 42, the server must also check that order 42 belongs to the person asking. That check is called authorization.\n\nForgetting it is one of the most common security mistakes in real apps. A stranger just changes the number in the address and sees someone else\'s order, with their name and address on it.',
    note: 'The server checks every request: is this thing yours? Being logged in only proves who you are.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.q = QUEUES[L].map(([who, want], i) => ({ i, who, want, st: 'wait' })); s.cur = 0; s.arr = 0.2; s.drag = null; s.res = null; s.anim = null;
    s.q[0].st = 'here'; s.q[0].t = 0;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.anim) return; const r = s.q[s.cur]; if (!r || r.st !== 'here') return;
    if (Math.abs(x - HATCH.x) < 66 && Math.abs(y - HATCH.y) < 44) { s.drag = { x, y, ox: HATCH.x - x, oy: HATCH.y - y }; g.sfx('tap'); }
  },
  move(g, x, y) { const d = g.s.drag; if (d) { d.x = x; d.y = y; } },
  up(g, x, y) {
    const s = g.s, d = s.drag; if (!d) return; s.drag = null; const r = s.q[s.cur], ex = x + d.ox, ey = y + d.oy;
    if (SK.dist(ex, ey, PAD.x, PAD.y) < 70) { r.stamp = g.t; s.anim = { kind: 'deny', t: g.t, r, ok: r.who !== r.want }; g.sfx('thud'); return; }
    if (ex > CAB.x - 40) { let di = 0, bd = 999; OWN.forEach((o, i) => { const dd = Math.abs(ey - drawerY(i)); if (dd < bd) { bd = dd; di = i; } });
      s.anim = { kind: 'give', t: g.t, r, di, ok: r.who === OWN[di] && OWN[di] === r.want, stranger: r.who !== OWN[di] }; g.sfx('swoosh'); return; }
  },
  update(g, dt) {
    const s = g.s, a = s.anim; if (g.done || !a) return; const e = g.t - a.t;
    if (!a.sfx && e > 0.4) { a.sfx = 1; g.sfx(a.ok ? 'ding' : a.kind === 'give' ? 'laugh' : 'wrong'); }
    if (e > 1.0) {
      s.anim = null; a.r.st = 'done';
      if (!a.ok) { s.res = { t: g.t, win: false, a }; g.shake(3, 0.2); g.fail(); return; }
      s.cur++; if (s.cur >= s.q.length) { s.res = { t: g.t, win: true }; g.win(); g.sfx('cheer'); g.burst(270, 300, ['#7ee8a0', '#ffd45a', '#fff'], 18, 150); return; }
      s.q[s.cur].st = 'here'; s.q[s.cur].t = g.t;
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, a = s.anim, r = s.q[s.cur];
    c.drawImage(g.bake('cs_badge', paintRoom2), 0, 0, 360, 640);
    // whoever is asking stands at the hatch (behind the counter), holding a phone
    const asker = r || s.q[s.q.length - 1], askIn = r ? Math.min(1, (t - (r.t || 0)) * 3) : 1;
    const happy = a && a.ok && a.kind === 'give', foxWin = s.res && !s.res.win && s.res.a.kind === 'give';
    c.save(); c.beginPath(); c.rect(18, 150, 140, 142); c.clip();
    SK.animal(c, asker.who, 88 - (1 - askIn) * 120, 300, 0.95, { t, pose: happy || foxWin ? 'cheer' : 'idle', expr: happy || foxWin ? 'laugh' : asker.who === 'fox' ? 'think' : 'happy' });
    c.restore();
    // the cabinet of orders, one drawer per owner
    OWN.forEach((o, i) => { const open = a && a.kind === 'give' && a.di === i ? Math.min(1, Math.sin(Math.min(1, (t - a.t) / 0.9) * Math.PI) * 1.4) : foxWin && s.res.a.di === i ? 1 : 0; drawerBox(c, i, o, open, t, foxWin && s.res.a.di === i); });
    SK.tag(c, 'Database', CAB.x + CAB.w / 2 - 2, 136, 18); SK.tag(c, 'Denied', PAD.x, PAD.y + 40, 18); SK.tag(c, 'Server: you', 250, 560, 18);
    // the red stamp pad
    c.save(); c.translate(PAD.x, PAD.y); c.fillStyle = '#5a2a2a'; c.beginPath(); c.roundRect(-52, -22, 104, 44, 8); c.fill(); c.fillStyle = '#c83a4a'; c.beginPath(); c.roundRect(-44, -15, 88, 30, 6); c.fill();
    c.strokeStyle = 'rgba(255,220,220,0.7)'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(-12, -9); c.lineTo(12, 9); c.moveTo(12, -9); c.lineTo(-12, 9); c.stroke(); c.restore();
    // the request: on the counter, in your hand, or on its way
    if (r && r.st === 'here') {
      let x = HATCH.x, y = HATCH.y, sc = askIn;
      if (s.drag) { x = s.drag.x + s.drag.ox; y = s.drag.y + s.drag.oy; sc = 1.05; }
      if (a) { const k = Math.min(1, (t - a.t) / 0.3); const tx = a.kind === 'deny' ? PAD.x : CAB.x + 40, ty = a.kind === 'deny' ? PAD.y - 6 : drawerY(a.di); x = SK.lerp(a.px ?? (a.px = x), tx, k); y = SK.lerp(a.py ?? (a.py = y), ty, k); sc = a.kind === 'give' && t - a.t > 0.3 ? Math.max(0, 1 - (t - a.t - 0.3) * 3) : 1; }
      if (sc > 0) request(c, r, x, y, sc, t);
    }
    // the order slip flying back out of the drawer to the hatch
    if (a && a.kind === 'give' && t - a.t > 0.45) { const k = Math.min(1, (t - a.t - 0.45) / 0.45), x = SK.lerp(CAB.x + 20, 100, k), y = SK.lerp(drawerY(a.di), 250, k) - Math.sin(k * Math.PI) * 50; c.save(); c.translate(x, y); c.rotate(k * 4); c.fillStyle = '#fff'; c.strokeStyle = '#6a6a8a'; c.lineWidth = 1.5; c.fillRect(-12, -16, 24, 32); c.strokeRect(-12, -16, 24, 32); c.fillStyle = '#e83a5a'; c.fillRect(-7, -9, 14, 3); c.restore(); }
    // a leak: the fox scribbles down the address; a refused owner looks sad
    if (s.res && !s.res.win) { const q = Math.min(1, (t - s.res.t) * 3); c.save(); c.globalAlpha = q; SK.tag(c, s.res.a.kind === 'give' ? '!' : '?', 120, 190, 24, '#fff', '#e83a4a'); c.restore(); }
    // the owl, the server's boss, watching from the floor
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'owl', 250, 612, 0.7, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    // guidance: the next step glows and the hand shows it (to the asker's own drawer, or to the stamp pad)
    if (r && r.st === 'here' && !a && !s.drag) {
      const deny = r.who !== r.want, to = deny ? [PAD.x, PAD.y] : [CAB.x + 50, drawerY(OWN.indexOf(r.want))];
      SK.glow(c, g, HATCH.x, HATCH.y, 50); if (g.level === 0) SK.glow(c, g, to[0], to[1], 44, deny ? '#ff8a9a' : '#7ee8a0');
      SK.demo(g, c, 'drag', [HATCH.x, HATCH.y], to);
    }
  },
  // the bot: deliver when the badge matches the drawer, stamp otherwise (B7FAIL: delivers everything)
  auto(g, dt, synth) {
    const s = g.s; if (g.done || s.anim || g.t < (s.nb || 1.0)) return; const r = s.q[s.cur]; if (!r || r.st !== 'here' || g.t - (r.t || 0) < 0.4) return; s.nb = g.t + 0.4;
    const fail = typeof window !== 'undefined' && window.B7FAIL, deny = r.who !== r.want && !fail, to = deny ? [PAD.x, PAD.y] : [CAB.x + 50, drawerY(OWN.indexOf(r.want))];
    synth('down', HATCH.x, HATCH.y); synth('move', (HATCH.x + to[0]) / 2, (HATCH.y + to[1]) / 2); synth('move', to[0], to[1]); synth('up', to[0], to[1]);
  },
});
