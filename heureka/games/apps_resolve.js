// KEEP BOTH CHANGES! (cs VC-03, was RESOLVE!) — a merge conflict as trains. The grey train on top is the original line,
// draw("frog", "red", 2), and beside every train is the picture its line draws. The fox's branch changed the colour (a
// blue frog), the rabbit's branch changed the size (a big red frog). Drag carriages onto the empty merge train so its
// picture keeps BOTH changes (a big blue frog), then tap its picture to run it. Drop a change and that driver fumes.
const SETS = [
  { base: ['"frog"', '"red"', '2'], a: ['"frog"', '"blue"', '2'], b: ['"frog"', '"red"', '5'], pre: [0] },
  { base: ['"frog"', '"red"', '2'], a: ['"duck"', '"red"', '2'], b: ['"frog"', '"blue"', '5'], pre: [] },
  { base: ['"duck"', '"red"', '2'], a: ['"frog"', '"blue"', '2'], b: ['"duck"', '"red"', '5'], pre: [] },
];
const TY = { o: 176, a: 282, m: 400, b: 518 }, EW = 58, CW = 70, PICX = 318;
const COLS = { a: '#ff7ab0', b: '#5ab0ff' };
const LABEL = { o: 'Original', a: "Fox's branch", b: "Rabbit's branch", m: 'Merged' };
const carX = i => 10 + EW + i * CW + CW / 2;
function paintYard(o) {
  const sk = o.createLinearGradient(0, 0, 0, 640); sk.addColorStop(0, '#f8c890'); sk.addColorStop(0.4, '#f0d8a8'); sk.addColorStop(1, '#c8b080'); o.fillStyle = sk; o.fillRect(0, 0, 360, 640);
  for (const [y, main] of [[TY.o, 0], [TY.a, 0], [TY.m, 1], [TY.b, 0]]) { // gravel, sleepers and rails
    o.fillStyle = main ? '#b8a080' : '#a89070'; o.fillRect(0, y + 14, 290, 22);
    o.fillStyle = '#6a4a30'; for (let x = 4; x < 290; x += 18) o.fillRect(x, y + 16, 8, 18);
    o.fillStyle = '#8a8a98'; o.fillRect(0, y + 18, 290, 4); o.fillRect(0, y + 28, 290, 4);
  }
  o.strokeStyle = '#8a8a98'; o.lineWidth = 4; for (const [y0, d] of [[TY.a, 1], [TY.b, -1]]) { o.beginPath(); o.moveTo(250, y0 + 20); o.quadraticCurveTo(286, y0 + 20, 290, y0 + 20 + d * 50); o.stroke(); }
}
function token(c, txt, x, y, col, s = 1, glow = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (glow) { c.shadowColor = col; c.shadowBlur = 10 + glow * 8; }
  c.fillStyle = col; c.strokeStyle = 'rgba(40,20,30,0.7)'; c.lineWidth = 2; c.beginPath(); c.roundRect(-CW / 2 + 2, -18, CW - 4, 30, 6); c.fill(); c.shadowBlur = 0; c.stroke();
  c.font = `700 18px ${B7.MONO}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#2a1830'; c.fillText(txt, 0, -2);
  c.restore();
}
function train(c, key, y, n, t, roll = 0, driver) {
  const x0 = 10 + roll;
  for (let i = 0; i < n; i++) { const cx = x0 + EW + i * CW; c.fillStyle = '#7a5a3a'; c.fillRect(cx + 2, y + 6, CW - 4, 8); c.fillStyle = '#3a3040'; for (const wx of [cx + 14, cx + CW - 14]) { c.beginPath(); c.arc(wx, y + 16, 6, 0, 7); c.fill(); } }
  const col = { o: '#9a9aa8', a: '#e8508a', b: '#3a8ad8', m: '#4aa86a' }[key];
  c.fillStyle = col; c.strokeStyle = 'rgba(30,20,30,0.7)'; c.lineWidth = 2; c.beginPath(); c.roundRect(x0, y - 30, EW - 4, 44, 6); c.fill(); c.stroke();
  c.fillStyle = '#2a2030'; c.fillRect(x0 + 6, y - 44, 11, 14);
  c.font = `700 18px ${B7.MONO}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff6ea'; c.fillText('draw(', x0 + EW / 2 - 2, y + 2);
  c.fillStyle = '#3a3040'; for (const wx of [x0 + 12, x0 + 42]) { c.beginPath(); c.arc(wx, y + 16, 7, 0, 7); c.fill(); }
  if (driver) SK.animal(c, driver.kind, x0 + 36, y - 22, 0.34, { t, pose: driver.pose, expr: driver.expr, noShadow: true });
  c.fillStyle = '#3a2440'; c.font = `700 22px ${B7.MONO}`; c.fillText(')', x0 + EW + n * CW + 6, y - 2);
  if (roll > 0) for (let i = 0; i < 3; i++) { const q = (t * 2 + i / 3) % 1; c.fillStyle = `rgba(240,240,240,${0.6 * (1 - q)})`; c.beginPath(); c.arc(x0 + 12 - q * 20, y - 50 - q * 30, 6 + q * 10, 0, 7); c.fill(); }
}
function picture(c, vals, x, y, t, o = {}) { // the frame beside a train: what its line draws
  c.save(); c.fillStyle = o.hot ? '#fff8d0' : 'rgba(255,250,236,0.95)'; c.strokeStyle = o.border || '#8a6a4a'; c.lineWidth = 3; c.beginPath(); c.roundRect(x - 34, y - 46, 68, 64, 10); c.fill(); c.stroke();
  c.beginPath(); c.roundRect(x - 32, y - 44, 64, 60, 9); c.clip();
  if (vals.every(v => v)) { const kind = vals[0] === '"duck"' ? 'duck' : 'frog', col = vals[1] === '"blue"' ? '#4a8ae8' : '#e8564a', sz = vals[2] === '5' ? 0.82 : 0.48; SK.animal(c, kind, x, y + 14, sz * (o.pop || 1), { t, tint: col, expr: o.sad ? 'sad' : 'happy', noShadow: true }); }
  else { c.fillStyle = 'rgba(120,90,60,0.35)'; c.font = '900 30px Nunito, system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', x, y - 14); }
  c.restore();
}
function label(c, txt, x, y) { c.save(); c.font = '800 18px Nunito, system-ui'; const w = c.measureText(txt).width + 16; c.fillStyle = 'rgba(40,24,40,0.72)'; c.beginPath(); c.roundRect(x, y - 13, w, 26, 13); c.fill(); c.fillStyle = '#fff6ea'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(txt, x + 8, y + 1); c.restore(); }
MG.add({
  id: 'cs_resolve', stage: 'apps', cmd: 'KEEP BOTH CHANGES!', time: 7, mood: 'party', winText: 'Both changes kept!', failText: 'Lost change!',
  card: { title: 'Merging two changes', kind: 'Computer science', ref: 'Merge conflicts (version control with git)',
    text: 'In version control, people work on separate copies called branches and later merge them back together. Usually the computer combines the changes by itself.\n\nWhen two branches change the same line, it cannot tell which version to keep. That is a merge conflict, and a person has to decide what the line should say.\n\nOften the right answer keeps both changes. Here the fox made the frog blue and the rabbit made it bigger, so the merged line draws a big blue frog.',
    note: 'When two branches change the same line, a person writes the merged line, usually keeping both changes.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level), S = SETS[L]; s.S = S; s.L = L;
    s.slots = S.base.map((v, i) => S.pre.includes(i) ? { v, from: 'o' } : null); s.drag = null; s.go = null; s.res = null;
    s.want = S.base.map((v, i) => S.a[i] !== v ? S.a[i] : S.b[i]);
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.go) return;
    if (Math.abs(x - PICX) < 38 && Math.abs(y - (TY.m - 14)) < 38) { if (s.slots.every(v => v)) { s.go = { t: g.t }; g.sfx('bell'); g.sfx('whoosh'); } else { g.sfx('wrong'); s.no = g.t; } return; }
    for (const k of ['o', 'a', 'b']) if (Math.abs(y - (TY[k] - 2)) < 24) for (let i = 0; i < 3; i++) if (Math.abs(x - carX(i)) < CW / 2) { s.drag = { k, i, v: s.S[k === 'o' ? 'base' : k][i], x, y }; g.sfx('tap'); return; }
  },
  move(g, x, y) { const d = g.s.drag; if (d) { d.x = x; d.y = y; } },
  up(g, x, y) {
    const s = g.s, d = s.drag; if (!d) return; s.drag = null;
    if (Math.abs(y - TY.m) < 56) { let bi = -1, bd = 56; for (let i = 0; i < 3; i++) { const dd = Math.abs(x - carX(i)); if (dd < bd) { bd = dd; bi = i; } } if (bi >= 0) { s.slots[bi] = { v: d.v, from: d.k, t: g.t, ch: d.v !== s.S.base[d.i] }; g.sfx('click'); } }
  },
  update(g, dt) {
    const s = g.s; if (!s.go || g.done) return;
    if (g.t - s.go.t > 1.1 && !s.res) {
      const ok = s.slots.every((v, i) => v.v === s.want[i]);
      const lostA = s.S.a.some((v, i) => v !== s.S.base[i] && s.slots[i].v !== v), lostB = s.S.b.some((v, i) => v !== s.S.base[i] && s.slots[i].v !== v);
      s.res = { t: g.t, ok, lostA, lostB }; if (ok) { g.win(); g.sfx('cheer'); g.burst(PICX, TY.m - 20, ['#ff7ab0', '#5ab0ff', '#ffd45a'], 22, 170); } else { g.sfx('honk'); g.shake(3, 0.2); g.fail(); }
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, S = s.S, R = s.res;
    c.drawImage(g.bake('cs_resolve', paintYard), 0, 0, 360, 640);
    const mood = lost => R ? (R.ok ? { pose: 'cheer', expr: 'laugh' } : lost ? { pose: 'wave', expr: 'sad' } : { pose: 'idle', expr: 'happy' }) : { pose: 'idle', expr: 'happy' };
    // the original line (grey), the two branches, each with the picture it draws
    train(c, 'o', TY.o, 3, t); train(c, 'a', TY.a, 3, t, 0, { kind: 'fox', ...mood(R && R.lostA) }); train(c, 'b', TY.b, 3, t, 0, { kind: 'rabbit', ...mood(R && R.lostB) });
    for (let i = 0; i < 3; i++) token(c, S.base[i], carX(i), TY.o - 2, '#e0dcd4');
    for (const k of ['a', 'b']) for (let i = 0; i < 3; i++) { const v = S[k][i], ch = v !== S.base[i], lost = R && !R.ok && ch && s.slots[i].v !== v; token(c, v, carX(i), TY[k] - 2, lost && Math.sin(t * 14) > 0 ? '#ff4a4a' : ch ? COLS[k] : '#e8e0d0', 1, ch ? 0.5 + 0.5 * Math.sin(t * 5) : 0); }
    picture(c, S.base, PICX, TY.o - 6, t); picture(c, S.a, PICX, TY.a - 6, t, { border: COLS.a }); picture(c, S.b, PICX, TY.b - 6, t, { border: COLS.b });
    for (const k of ['o', 'a', 'm', 'b']) label(c, LABEL[k], 12, TY[k] - 56);
    if (R && !R.ok) for (const k of ['a', 'b']) if (k === 'a' ? R.lostA : R.lostB) { const q = Math.min(1, (t - R.t) * 4); c.save(); c.globalAlpha = q; SK.tag(c, '!', 180, TY[k] - 56 - Math.abs(Math.sin(t * 8)) * 4, 22, '#fff', '#e83a4a'); c.restore(); }
    // the merge train: its picture builds as you load it; tap the picture to run the merged line
    const roll = s.go ? Math.max(0, (t - s.go.t - 0.3)) ** 2 * 200 : 0;
    train(c, 'm', TY.m, 3, t, roll, { kind: 'owl', pose: R && R.ok ? 'cheer' : 'idle', expr: 'happy' });
    for (let i = 0; i < 3; i++) { const sl = s.slots[i], x = carX(i) + roll; if (sl) token(c, sl.v, x, TY.m - 2, sl.ch ? COLS[sl.from] : '#e8e0d0', sl.t ? B7.pop((t - sl.t) * 5) : 1); else { c.save(); c.strokeStyle = s.drag ? '#ffe27a' : 'rgba(80,50,30,0.6)'; c.lineWidth = 2.5; c.setLineDash([6, 5]); c.lineDashOffset = -t * 20; c.beginPath(); c.roundRect(x - CW / 2 + 3, TY.m - 19, CW - 6, 32, 6); c.stroke(); c.restore(); } }
    const full = s.slots.every(v => v), nx = s.no && t - s.no < 0.3 ? Math.sin((t - s.no) * 50) * 3 : 0;
    picture(c, s.slots.map(q => q && q.v), PICX + nx, TY.m - 14, t, { border: '#4aa86a', hot: full && !s.go, pop: R ? 1 + Math.min(0.25, (t - R.t)) : 1, sad: R && !R.ok });
    if (full && !s.go) { c.save(); c.fillStyle = '#3fcf6a'; c.beginPath(); c.arc(PICX + 26, TY.m + 8, 13, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(PICX + 22, TY.m + 1); c.lineTo(PICX + 32, TY.m + 8); c.lineTo(PICX + 22, TY.m + 15); c.closePath(); c.fill(); c.restore(); SK.glow(c, g, PICX, TY.m - 14, 40); }
    if (s.drag) token(c, s.drag.v, s.drag.x, s.drag.y, s.drag.k !== 'o' && s.drag.v !== S.base[s.drag.i] ? COLS[s.drag.k] : '#e8e0d0', 1.1);
    // guidance: glow the changed carriages (levels 0-1); the hand loads the next empty car, or taps the picture to run
    if (!s.go && !s.drag) { const i = s.slots.findIndex(v => !v); if (i >= 0) { const k = S.a[i] !== S.base[i] ? 'a' : S.b[i] !== S.base[i] ? 'b' : 'o'; SK.grab(c, g, carX(i), TY[k] - 2, 30); SK.target(c, g, carX(i), TY.m - 2, 0, { w: CW, h: 34 }); SK.arrow(c, g, carX(i), TY[k] - 2, carX(i), TY.m - 2); } }
    if (!s.go && !s.drag) { const i = s.slots.findIndex(v => !v); if (i < 0) SK.demo(g, c, 'tap', [PICX, TY.m - 14]); else { const k = S.a[i] !== S.base[i] ? 'a' : S.b[i] !== S.base[i] ? 'b' : 'o'; SK.demo(g, c, 'drag', [carX(i), TY[k] - 2], [carX(i), TY.m - 2]); } }
  },
  // the bot loads each slot with the changed version, then runs it (B7FAIL: takes everything from the fox's train)
  auto(g, dt, synth) {
    const s = g.s; if (g.done || s.go || g.t < (s.nb || 1.0)) return; s.nb = g.t + 0.5; const fail = typeof window !== 'undefined' && window.B7FAIL;
    const i = s.slots.findIndex(v => !v);
    if (i < 0) { synth('down', PICX, TY.m - 14); synth('up', PICX, TY.m - 14); return; }
    const k = fail ? 'a' : s.S.a[i] !== s.S.base[i] ? 'a' : s.S.b[i] !== s.S.base[i] ? 'b' : 'o', x = carX(i);
    synth('down', x, TY[k] - 2); synth('move', x, (TY[k] + TY.m) / 2); synth('move', x, TY.m); synth('up', x, TY.m);
  },
});
