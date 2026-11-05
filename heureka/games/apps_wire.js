// WIRE UP! (cs AP-01) — a notes app in pieces: your phone with a note, a server building with an owl at the door, and
// a filing cabinet. Drag wires between their plugs. Phone to server and server to cabinet: the note travels to the
// server, the owl checks it and files it, and when the fox's phone (running the same app) asks for your diary, the owl
// turns it away. Wire the phone straight to the cabinet and every copy of the app can open every drawer: the fox reads
// your diary. An app is a screen (front end), a server (back end) and a database, talking over the network.
const DEV = { // where each part stands and where its plug is
  phone: { x: 72, y: 452, px: 112, py: 446, front: true },
  laptop: { x: 92, y: 566, px: 148, py: 556, front: true },
  server: { x: 180, y: 252, px: 180, py: 318 },
  cab: { x: 292, y: 470, px: 250, py: 446, store: true },
  photo: { x: 300, y: 574, px: 254, py: 568, store: true },
};
const SETS = [['phone', 'server', 'cab'], ['phone', 'laptop', 'server', 'cab'], ['phone', 'laptop', 'server', 'cab', 'photo']];
const FOX = { x: 44, y: 352, px: 70, py: 330 };
function reach(s, from, to, skip) { // is there a path of wires from one part to another (optionally not through skip)?
  const seen = new Set([from]), q = [from];
  while (q.length) { const a = q.shift(); if (a === to) return true; for (const w of s.wires) { const b = w.a === a ? w.b : w.b === a ? w.a : null; if (b && !seen.has(b) && b !== skip) { seen.add(b); q.push(b); } } }
  return false;
}
function pathOf(s, from, to) { // the parts along the wires from one to the other
  const prev = { [from]: null }, q = [from];
  while (q.length) { const a = q.shift(); if (a === to) break; for (const w of s.wires) { const b = w.a === a ? w.b : w.b === a ? w.a : null; if (b && !(b in prev)) { prev[b] = a; q.push(b); } } }
  const out = []; for (let k = to; k != null; k = prev[k]) out.unshift(k); return out;
}
function plug(id) { return id === 'fox' ? [FOX.px, FOX.py] : [DEV[id].px, DEV[id].py]; }
function cable(c, ax, ay, bx, by, col, w = 6, dash) {
  const sag = Math.min(60, Math.hypot(bx - ax, by - ay) * 0.25), mx = (ax + bx) / 2, my = (ay + by) / 2 + sag;
  c.save(); c.lineCap = 'round'; if (dash) c.setLineDash(dash);
  c.strokeStyle = 'rgba(20,10,30,0.35)'; c.lineWidth = w + 3; c.beginPath(); c.moveTo(ax, ay + 3); c.quadraticCurveTo(mx, my + 3, bx, by + 3); c.stroke();
  c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(ax, ay); c.quadraticCurveTo(mx, my, bx, by); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = w * 0.3; c.beginPath(); c.moveTo(ax, ay - 1.5); c.quadraticCurveTo(mx, my - 1.5, bx, by - 1.5); c.stroke();
  c.restore(); return k => { const u = 1 - k; return [u * u * ax + 2 * u * k * mx + k * k * bx, u * u * ay + 2 * u * k * my + k * k * by]; };
}
function along(a, b, k) { const [ax, ay] = plug(a), [bx, by] = plug(b), sag = Math.min(60, Math.hypot(bx - ax, by - ay) * 0.25), mx = (ax + bx) / 2, my = (ay + by) / 2 + sag, u = 1 - k; return [u * u * ax + 2 * u * k * mx + k * k * bx, u * u * ay + 2 * u * k * my + k * k * by]; }
function envelope(c, x, y, col = '#fff6ea', s = 1) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.strokeStyle = '#6a4a3a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-13, -9, 26, 18, 3); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-13, -9); c.lineTo(0, 2); c.lineTo(13, -9); c.stroke(); c.fillStyle = '#e83a5a'; c.beginPath(); c.arc(0, 2, 3, 0, 7); c.fill(); c.restore(); }
function paintTown(o) {
  const sk = o.createLinearGradient(0, 0, 0, 640); sk.addColorStop(0, '#9ad0f0'); sk.addColorStop(0.5, '#cde8f4'); sk.addColorStop(1, '#f4e8d0'); o.fillStyle = sk; o.fillRect(0, 0, 360, 640);
  P.cloud(o, 60, 150, 0.8); P.cloud(o, 300, 180, 0.6);
  P.hills(o, 360, 380, 40, '#a8d88a', '#80b868', { seed: 3 });
  o.fillStyle = '#f0dcb8'; o.fillRect(0, 400, 360, 240); const rnd = P.rng(8); for (let i = 0; i < 70; i++) { o.fillStyle = `rgba(180,140,100,${0.1 + rnd() * 0.15})`; o.beginPath(); o.ellipse(rnd() * 360, 400 + rnd() * 230, 6 + rnd() * 10, 2 + rnd() * 3, 0, 0, 7); o.fill(); }
  P.vignette(o, 360, 640, 0.2, '#3a3050');
}
function drawPhone(c, x, y, t, o = {}) {
  c.save(); c.translate(x, y); c.fillStyle = 'rgba(20,10,30,0.25)'; c.beginPath(); c.ellipse(0, 50, 30, 6, 0, 0, 7); c.fill();
  c.fillStyle = o.col || '#ff7ab0'; c.strokeStyle = '#3a2440'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-26, -46, 52, 92, 10); c.fill(); c.stroke();
  c.fillStyle = '#fff6ea'; c.beginPath(); c.roundRect(-20, -38, 40, 70, 5); c.fill();
  if (o.note) { c.save(); c.rotate(-0.06); c.fillStyle = '#ffe27a'; c.fillRect(-14, -30, 28, 30); c.strokeStyle = '#c8a040'; c.lineWidth = 1.5; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-10, -22 + i * 8); c.lineTo(10, -22 + i * 8); c.stroke(); } c.fillStyle = '#e83a5a'; c.font = '900 14px Nunito'; c.textAlign = 'center'; c.fillText('♥', 0, 18); c.restore(); }
  c.fillStyle = '#3a2440'; c.beginPath(); c.arc(0, 39, 3, 0, 7); c.fill(); c.restore();
}
function drawLaptop(c, x, y, o = {}) {
  c.save(); c.translate(x, y); c.fillStyle = 'rgba(20,10,30,0.25)'; c.beginPath(); c.ellipse(0, 26, 50, 6, 0, 0, 7); c.fill();
  c.fillStyle = '#5a8ad8'; c.strokeStyle = '#2a3a6a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-40, -40, 80, 54, 6); c.fill(); c.stroke();
  c.fillStyle = '#eaf4ff'; c.fillRect(-33, -34, 66, 42); c.fillStyle = '#9ab8e8'; c.fillRect(-33, -34, 66, 8);
  if (o.note) { c.fillStyle = '#ffe27a'; c.fillRect(-12, -22, 24, 26); c.fillStyle = '#e83a5a'; c.font = '900 12px Nunito'; c.textAlign = 'center'; c.fillText('♥', 0, 0); }
  c.fillStyle = '#c8d0e0'; c.strokeStyle = '#6a7080'; c.beginPath(); c.moveTo(-48, 14); c.lineTo(48, 14); c.lineTo(54, 24); c.lineTo(-54, 24); c.closePath(); c.fill(); c.stroke(); c.restore();
}
function drawServer(c, x, y, t, check) {
  c.save(); c.translate(x, y); c.fillStyle = 'rgba(20,10,30,0.25)'; c.beginPath(); c.ellipse(0, 66, 70, 10, 0, 0, 7); c.fill();
  c.fillStyle = '#6a6a9a'; c.strokeStyle = '#2a2a4a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-58, -80, 116, 146, 8); c.fill(); c.stroke();
  for (let r = 0; r < 4; r++) { c.fillStyle = '#3a3a5a'; c.beginPath(); c.roundRect(-48, -70 + r * 26, 96, 20, 4); c.fill(); for (let k = 0; k < 4; k++) { const on = Math.sin(t * (3 + k) + r * 2 + k) > 0.2; c.fillStyle = on ? (k % 2 ? '#7ee8a0' : '#ffd45a') : '#2a2a3a'; c.beginPath(); c.arc(-36 + k * 10, -60 + r * 26, 3, 0, 7); c.fill(); } }
  c.fillStyle = '#4a3a5a'; c.beginPath(); c.roundRect(-16, 32, 32, 34, [12, 12, 0, 0]); c.fill(); c.restore();
  // the owl at the door, checking who asks
  SK.animal(c, 'owl', x + 46, y + 66, 0.62, { t, pose: check === 'no' ? 'wave' : check === 'yes' ? 'cheer' : 'idle', expr: check === 'no' ? 'think' : 'happy', facing: -1 });
}
function drawCab(c, x, y, open, t) {
  c.save(); c.translate(x, y); c.fillStyle = 'rgba(20,10,30,0.25)'; c.beginPath(); c.ellipse(0, 50, 40, 7, 0, 0, 7); c.fill();
  c.fillStyle = '#9aa4b4'; c.strokeStyle = '#3a4050'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-34, -56, 68, 106, 5); c.fill(); c.stroke();
  for (let r = 0; r < 3; r++) { const dy = -50 + r * 34, out = r === 1 ? open * 18 : 0; c.fillStyle = '#c0c8d4'; c.beginPath(); c.roundRect(-28 - out * 0.3, dy + out * 0.1, 56 + out * 0.6, 28, 3); c.fill(); c.stroke(); c.fillStyle = '#6a7080'; c.fillRect(-8, dy + 10, 16, 5); if (r === 1) { c.fillStyle = '#e83a5a'; c.font = '900 12px Nunito'; c.textAlign = 'center'; c.fillText('♥', 18, dy + 18); } }
  c.restore();
}
function drawPhotoBox(c, x, y) { c.save(); c.translate(x, y); c.fillStyle = 'rgba(20,10,30,0.25)'; c.beginPath(); c.ellipse(0, 26, 40, 6, 0, 0, 7); c.fill(); c.fillStyle = '#d8a060'; c.strokeStyle = '#6a4020'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-36, -26, 72, 50, 5); c.fill(); c.stroke(); c.fillStyle = '#fff'; c.fillRect(-16, -18, 32, 26); c.fillStyle = '#7ac0ff'; c.fillRect(-13, -15, 26, 14); c.fillStyle = '#5ab84e'; c.beginPath(); c.moveTo(-13, 5); c.lineTo(-4, -6); c.lineTo(4, 2); c.lineTo(13, -4); c.lineTo(13, 5); c.fill(); c.restore(); }
MG.add({
  id: 'cs_wire', stage: 'apps', cmd: 'WIRE UP!', time: 7, mood: 'party', winText: 'Back end!', failText: 'Leaked!',
  card: { title: 'Screen, server, database', kind: 'Computer science', ref: 'Client–server architecture',
    text: 'Most apps have three parts. The front end is the screen you touch. The back end is a server, a computer somewhere else that runs the app\'s rules. The database is where the data is kept.\n\nEvery phone runs the same copy of the app, including a stranger\'s. If the app could open the database itself, every copy could open every drawer. So the app sends its request to the server, and the server checks who is asking before it touches the data.',
    note: 'The screen talks to the server, and only the server talks to the database, so it can check every request.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.parts = SETS[L]; s.wires = []; s.run = null; s.res = null; s.cable = null;
    s.fronts = s.parts.filter(p => DEV[p].front); s.stores = s.parts.filter(p => DEV[p].store);
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.run) return;
    let best = null, bd = 34; for (const p of s.parts) { const d = SK.dist(x, y, DEV[p].px, DEV[p].py); if (d < bd) { bd = d; best = p; } }
    if (best) { s.cable = { from: best, x, y }; g.sfx('click'); }
  },
  move(g, x, y) { const s = g.s; if (s.cable) { s.cable.x = x; s.cable.y = y; } },
  up(g, x, y) {
    const s = g.s, cb = s.cable; if (!cb) return; s.cable = null;
    let best = null, bd = 44; for (const p of s.parts) { if (p === cb.from) continue; const d = SK.dist(x, y, DEV[p].px, DEV[p].py); if (d < bd) { bd = d; best = p; } }
    if (!best || s.wires.some(w => (w.a === cb.from && w.b === best) || (w.b === cb.from && w.a === best))) return;
    s.wires.push({ a: cb.from, b: best, t: g.t }); g.sfx('snap');
    // ready when every screen can reach every store: then the app runs
    if (s.fronts.every(f => s.stores.every(st => reach(s, f, st)))) {
      const leak = s.stores.find(st => s.fronts.some(f => reach(s, f, st, 'server')));
      s.run = { t0: g.t + 0.3, leak, steps: [] }; const R = s.run; let at = 0;
      const go = (path, what, dur) => { R.steps.push({ path, what, t0: at, t1: at + dur }); at += dur; };
      // your note: phone to the cabinet (and, at level 2, a photo to the photo box)
      go(pathOf(s, 'phone', 'cab'), 'note', 1.0);
      if (s.stores.includes('photo')) go(pathOf(s, 'phone', 'photo'), 'photo', 0.8);
      if (leak) { R.steps.push({ path: ['fox', leak], what: 'fox', t0: at, t1: at + 0.7 }); at += 0.7; R.end = at + 0.4; }
      else {
        R.steps.push({ path: ['fox', 'server'], what: 'fox', t0: at, t1: at + 0.6 }); at += 0.6; R.block = at; at += 0.3;
        if (s.fronts.includes('laptop')) go(pathOf(s, 'cab', 'laptop'), 'back', 0.9);
        R.end = at + 0.15;
      }
    }
  },
  update(g, dt) {
    const s = g.s, R = s.run; if (!R || g.done) return; const e = g.t - R.t0;
    for (const st of R.steps) { if (e >= st.t0 && !st.go) { st.go = 1; g.sfx(st.what === 'fox' ? 'whoosh' : 'swoosh'); } if (e >= st.t1 && !st.arr) { st.arr = 1; g.sfx(st.what === 'fox' && R.leak ? 'laugh' : 'pop'); } }
    if (R.block && e >= R.block && !R.blocked) { R.blocked = 1; g.sfx('wrong'); }
    if (e >= R.end) { if (R.leak) { s.res = { t: g.t, win: false }; g.fail(); g.shake(3, 0.2); } else { s.res = { t: g.t, win: true }; g.win(); g.sfx('cheer'); g.burst(180, 250, ['#7ee8a0', '#ffd45a', '#fff'], 18, 150); } }
  },
  draw(g, c) {
    const s = g.s, t = g.t, R = s.run, e = R ? t - R.t0 : -1;
    c.drawImage(g.bake('cs_wire', paintTown), 0, 0, 360, 640);
    const has = p => s.parts.includes(p);
    // what the owl is doing, whether a drawer is open, and where the note is
    const check = R && !R.leak && R.block && e >= R.block ? 'no' : R && e > 0.45 && e < 1.0 ? 'yes' : null;
    const cabOpen = R ? (R.steps.some(st => st.path[st.path.length - 1] === 'cab' && e > st.t1 - 0.15 && e < st.t1 + 0.5) || (R.leak === 'cab' && e > R.steps[R.steps.length - 1].t1 - 0.1) ? 1 : 0) : 0;
    s.cabK = SK.lerp(s.cabK || 0, cabOpen, 0.25);
    drawServer(c, DEV.server.x, DEV.server.y, t, check);
    if (has('cab')) drawCab(c, DEV.cab.x, DEV.cab.y, s.cabK, t);
    if (has('photo')) drawPhotoBox(c, DEV.photo.x, DEV.photo.y);
    const noteSent = R && e > 0;
    drawPhone(c, DEV.phone.x, DEV.phone.y, t, { note: !noteSent });
    if (has('laptop')) drawLaptop(c, DEV.laptop.x, DEV.laptop.y, { note: R && R.steps.some(st => st.what === 'back' && e > st.t1) });
    // the fox with the same app on its phone, watching
    const foxWin = R && R.leak && e > R.steps[R.steps.length - 1].t1, foxSad = R && R.blocked;
    SK.animal(c, 'fox', FOX.x, FOX.y + 40, 0.72, { t, pose: foxWin ? 'cheer' : foxSad ? 'sad' : 'idle', expr: foxWin ? 'laugh' : foxSad ? 'sad' : 'think' });
    c.save(); c.translate(FOX.px - 4, FOX.py + 4); c.rotate(0.2); c.fillStyle = '#ff9a3a'; c.strokeStyle = '#3a2440'; c.lineWidth = 2; c.beginPath(); c.roundRect(-9, -15, 18, 30, 4); c.fill(); c.stroke(); c.fillStyle = '#fff6ea'; c.fillRect(-6, -11, 12, 20); c.restore();
    // the wires, then the plugs
    for (const w of s.wires) { const [ax, ay] = plug(w.a), [bx, by] = plug(w.b), k = Math.min(1, (t - w.t) * 6); cable(c, ax, ay, SK.lerp(ax, bx, k), SK.lerp(ay, by, k), '#3a3a5a'); }
    if (R) for (const st of R.steps) if (st.what === 'fox' && e >= st.t0) { const [ax, ay] = plug('fox'), [bx, by] = plug(st.path[1]), k = Math.min(1, (e - st.t0) * 4); cable(c, ax, ay, SK.lerp(ax, bx, k), SK.lerp(ay, by, k), 'rgba(255,140,60,0.8)', 4, [8, 6]); }
    if (s.cable) { const [ax, ay] = plug(s.cable.from); cable(c, ax, ay, s.cable.x, s.cable.y, '#e83a5a'); c.fillStyle = '#ffd45a'; c.beginPath(); c.arc(s.cable.x, s.cable.y, 8, 0, 7); c.fill(); }
    for (const p of s.parts) { const d = DEV[p], used = s.wires.some(w => w.a === p || w.b === p); c.fillStyle = '#2a2440'; c.beginPath(); c.arc(d.px, d.py, 10, 0, 7); c.fill(); c.fillStyle = used ? '#7ee8a0' : '#ffd45a'; c.beginPath(); c.arc(d.px, d.py, 6, 0, 7); c.fill(); }
    // the envelopes on their way
    if (R) for (const st of R.steps) {
      if (e < st.t0 || e > st.t1 + (st.what === 'fox' && R.leak ? 9 : 0)) continue; const k = Math.min(1, (e - st.t0) / (st.t1 - st.t0)), n = st.path.length - 1;
      if (n < 1) continue; const seg = Math.min(n - 1, Math.floor(k * n)), kk = k * n - seg, [x, y] = along(st.path[seg], st.path[seg + 1], kk);
      if (st.what === 'fox' && R.leak && k >= 1) { // the fox pulls out your diary page and reads it
        const [cx, cy] = plug(st.path[1]), q = Math.min(1, (e - st.t1) * 2); c.save(); c.translate(SK.lerp(cx, FOX.px + 30, q), SK.lerp(cy, FOX.py - 30, q)); c.rotate(Math.sin(t * 6) * 0.1); c.fillStyle = '#ffe27a'; c.fillRect(-16, -18, 32, 36); c.fillStyle = '#e83a5a'; c.font = '900 16px Nunito'; c.textAlign = 'center'; c.fillText('♥', 0, 8); c.restore(); continue;
      }
      if (st.what === 'fox' && !R.leak && R.blocked) { const q = Math.min(1, (e - R.block) * 3); envelope(c, x - q * 30, y + q * 40, '#ffb070', 1 - q * 0.5); continue; }
      if (st.what === 'photo') { c.save(); c.translate(x, y); c.fillStyle = '#fff'; c.fillRect(-12, -10, 24, 20); c.fillStyle = '#7ac0ff'; c.fillRect(-9, -7, 18, 10); c.restore(); continue; }
      envelope(c, x, y, st.what === 'fox' ? '#ffb070' : '#fff6ea');
    }
    if (R && R.blocked) { const q = Math.min(1, (e - R.block) * 4); c.save(); c.globalAlpha = q; c.strokeStyle = '#e83a5a'; c.lineWidth = 6; c.lineCap = 'round'; const [bx, by] = plug('server'); c.beginPath(); c.moveTo(bx - 40, by - 12); c.lineTo(bx - 20, by + 8); c.moveTo(bx - 20, by - 12); c.lineTo(bx - 40, by + 8); c.stroke(); c.restore(); }
    // guidance: glow the plugs still to wire; the ghost hand drags phone to server
    if (!R) for (const p of s.parts) if (!s.wires.some(w => w.a === p || w.b === p)) SK.glow(c, g, DEV[p].px, DEV[p].py, 18, '#ffe27a', { level: 0 });
    SK.demo(g, c, 'drag', [DEV.phone.px, DEV.phone.py], [DEV.server.px, DEV.server.py]);
  },
  // the bot wires each screen to the server and the server to each store (B7FAIL: phone straight to the cabinet)
  auto(g, dt, synth) {
    const s = g.s; if (g.done || s.run) return; const fail = typeof window !== 'undefined' && window.B7FAIL;
    const plan = fail ? [['phone', 'cab'], ...s.fronts.filter(f => f !== 'phone').map(f => [f, 'server']), ['server', 'cab'], ...s.stores.filter(x => x !== 'cab').map(x => ['server', x])]
      : [...s.fronts.map(f => [f, 'server']), ...s.stores.map(x => ['server', x])];
    plan.forEach(([a, b], i) => SK.bot.drag(g, synth, 'w' + i, 1.0 + i * 0.6, plug(a), plug(b), 0.4));
  },
});
