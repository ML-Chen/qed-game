// RESOLVE! (cs VC-03) — a merge conflict as trains. Two branches changed the same line of code: the fox's train (top)
// and the rabbit's train (bottom) each carry their version of draw(...), one carriage per argument, and the carriages
// each driver changed glow in their colour. Drag carriages onto the empty merge train in the middle so it keeps BOTH
// changes, then tap the signal: the merged line runs and draws the picture. Drop a change and its driver is furious.
const SETS = [
  { base: ['"frog"', '"red"', '2'], a: ['"frog"', '"blue"', '2'], b: ['"frog"', '"red"', '5'], pre: [0] },
  { base: ['"frog"', '"red"', '2'], a: ['"duck"', '"red"', '2'], b: ['"frog"', '"blue"', '5'], pre: [] },
  { base: ['"frog"', '"red"', '2', 'None'], a: ['"frog"', '"blue"', '5', 'None'], b: ['"duck"', '"red"', '2', '"hat"'], pre: [] },
];
const TY = { a: 196, m: 350, b: 504 }, EW = 60, CWD = [78, 78, 66];
const COLS = { a: '#ff7ab0', b: '#5ab0ff' };
function carX(s, i) { return 10 + EW + i * s.cw + s.cw / 2; }
function paintYard(o) {
  const sk = o.createLinearGradient(0, 0, 0, 640); sk.addColorStop(0, '#f8c890'); sk.addColorStop(0.4, '#f0d8a8'); sk.addColorStop(1, '#c8b080'); o.fillStyle = sk; o.fillRect(0, 0, 360, 640);
  o.fillStyle = 'rgba(160,120,80,0.25)'; for (let i = 0; i < 6; i++) { o.beginPath(); o.ellipse(40 + i * 64, 132, 40, 10, 0, 0, 7); o.fill(); }
  for (const y of [TY.a, TY.m, TY.b]) { // gravel, sleepers and rails
    o.fillStyle = '#a89070'; o.fillRect(0, y + 14, 360, 22);
    o.fillStyle = '#6a4a30'; for (let x = 4; x < 360; x += 18) o.fillRect(x, y + 16, 8, 18);
    o.fillStyle = '#8a8a98'; o.fillRect(0, y + 18, 360, 4); o.fillRect(0, y + 28, 360, 4);
  }
  // the sidings curving in toward the main line on the right
  o.strokeStyle = '#8a8a98'; o.lineWidth = 4; for (const [y0, d] of [[TY.a, 1], [TY.b, -1]]) { o.beginPath(); o.moveTo(300, y0 + 20); o.quadraticCurveTo(340, y0 + 20, 360, y0 + 20 + d * 60); o.stroke(); }
}
function token(c, txt, x, y, w, col, s = 1, glow = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (glow) { c.shadowColor = col; c.shadowBlur = 12 + glow * 6; }
  c.fillStyle = col; c.strokeStyle = 'rgba(40,20,30,0.7)'; c.lineWidth = 2; c.beginPath(); c.roundRect(-w / 2 + 3, -18, w - 6, 30, 6); c.fill(); c.shadowBlur = 0; c.stroke();
  c.font = `700 18px ${B7.MONO}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#2a1830'; c.fillText(txt, 0, -2);
  c.restore();
}
function train(c, s, key, y, t, roll = 0, driver) {
  const L = s.S, n = L.base.length, cw = s.cw, x0 = 10 + roll;
  // flatcars with wheels
  for (let i = 0; i < n; i++) { const cx = x0 + EW + i * cw; c.fillStyle = '#7a5a3a'; c.fillRect(cx + 2, y + 6, cw - 4, 8); c.fillStyle = '#3a3040'; for (const wx of [cx + 14, cx + cw - 14]) { c.beginPath(); c.arc(wx, y + 16, 6, 0, 7); c.fill(); } c.fillStyle = '#4a3a2a'; c.fillRect(cx - 3, y + 8, 6, 4); }
  // the engine, with "draw(" on its side and its driver in the cab
  const col = key === 'a' ? '#e8508a' : key === 'b' ? '#3a8ad8' : '#4aa86a';
  c.fillStyle = col; c.strokeStyle = 'rgba(30,20,30,0.7)'; c.lineWidth = 2; c.beginPath(); c.roundRect(x0, y - 30, EW - 4, 44, 6); c.fill(); c.stroke();
  c.fillStyle = '#2a2030'; c.fillRect(x0 + 8, y - 44, 12, 14); c.fillStyle = 'rgba(255,255,255,0.75)'; c.beginPath(); c.roundRect(x0 + 30, y - 26, 24, 18, 4); c.fill();
  c.font = `700 18px ${B7.MONO}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff6ea'; c.fillText('draw(', x0 + EW / 2 - 2, y + 2);
  c.fillStyle = '#3a3040'; for (const wx of [x0 + 14, x0 + 46]) { c.beginPath(); c.arc(wx, y + 16, 7, 0, 7); c.fill(); }
  if (driver) SK.animal(c, driver.kind, x0 + 42, y - 8, 0.36, { t, pose: driver.pose, expr: driver.expr, noShadow: true });
  // the closing bracket on the last car
  const ex = x0 + EW + n * cw; c.fillStyle = '#fff6ea'; c.font = `700 22px ${B7.MONO}`; c.fillText(')', ex + 6, y - 2);
  if (roll > 0) { for (let i = 0; i < 3; i++) { const q = (t * 2 + i / 3) % 1; c.fillStyle = `rgba(240,240,240,${0.6 * (1 - q)})`; c.beginPath(); c.arc(x0 + 14 - q * 20, y - 50 - q * 30, 6 + q * 10, 0, 7); c.fill(); } }
}
MG.add({
  id: 'cs_resolve', stage: 'apps', cmd: 'RESOLVE!', time: 7, mood: 'party', winText: 'Merged!', failText: 'Lost change!',
  card: { title: 'Merging two changes', kind: 'Computer science', ref: 'Merge conflicts (version control with git)',
    text: 'In version control, people work on separate copies called branches and later merge them back together. Usually the computer combines the changes by itself.\n\nWhen two branches change the same line, it cannot tell which version to keep. That is a merge conflict, and a person has to decide what the line should say.\n\nOften the right answer keeps both changes: here the fox made the frog blue and the rabbit made it bigger, so the merged line draws a big blue frog.',
    note: 'When two branches change the same line, a person writes the merged line, usually keeping both changes.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level), S = SETS[L]; s.S = S; s.L = L; const n = S.base.length; s.cw = n > 3 ? 70 : 80;
    s.slots = S.base.map((v, i) => S.pre.includes(i) ? { v, from: 'base' } : null); s.drag = null; s.go = null; s.res = null;
    s.want = S.base.map((v, i) => S.a[i] !== v ? S.a[i] : S.b[i]);
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.go) return;
    if (SK.dist(x, y, 334, TY.m - 62) < 34) { if (s.slots.every(v => v)) { s.go = { t: g.t }; g.sfx('bell'); g.sfx('whoosh'); } else { g.sfx('wrong'); s.no = g.t; } return; }
    for (const k of ['a', 'b']) if (Math.abs(y - (TY[k] - 2)) < 24) for (let i = 0; i < s.S.base.length; i++) if (Math.abs(x - carX(s, i)) < s.cw / 2) {
      s.drag = { k, i, v: s.S[k][i], x, y }; g.sfx('tap'); return;
    }
  },
  move(g, x, y) { const d = g.s.drag; if (d) { d.x = x; d.y = y; } },
  up(g, x, y) {
    const s = g.s, d = s.drag; if (!d) return; s.drag = null;
    if (Math.abs(y - TY.m) < 60) { let bi = -1, bd = 60; for (let i = 0; i < s.S.base.length; i++) { const dd = Math.abs(x - carX(s, i)); if (dd < bd) { bd = dd; bi = i; } } if (bi >= 0) { s.slots[bi] = { v: d.v, from: d.k, t: g.t, ch: d.v !== s.S.base[d.i] }; g.sfx('click'); } }
  },
  update(g, dt) {
    const s = g.s; if (!s.go || g.done) return;
    if (g.t - s.go.t > 1.3 && !s.res) {
      const ok = s.slots.every((v, i) => v.v === s.want[i]);
      const lostA = s.S.a.some((v, i) => v !== s.S.base[i] && s.slots[i].v !== v), lostB = s.S.b.some((v, i) => v !== s.S.base[i] && s.slots[i].v !== v);
      s.res = { t: g.t, ok, lostA, lostB }; if (ok) { g.win(); g.sfx('cheer'); g.burst(180, 330, ['#ff7ab0', '#5ab0ff', '#ffd45a'], 22, 170); } else { g.sfx(lostA ? 'honk' : 'honk'); g.shake(3, 0.2); g.fail(); }
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, S = s.S, n = S.base.length, cw = s.cw;
    c.drawImage(g.bake('cs_resolve', paintYard), 0, 0, 360, 640);
    const R = s.res;
    // the two branch trains, each driver cheering or fuming at the end
    const mood = lost => R ? (R.ok ? { pose: 'cheer', expr: 'laugh' } : lost ? { pose: 'wave', expr: 'sad' } : { pose: 'idle', expr: 'happy' }) : { pose: 'idle', expr: 'happy' };
    train(c, s, 'a', TY.a, t, 0, { kind: 'fox', ...mood(R && R.lostA) });
    train(c, s, 'b', TY.b, t, 0, { kind: 'rabbit', ...mood(R && R.lostB) });
    for (const k of ['a', 'b']) for (let i = 0; i < n; i++) { const v = S[k][i], ch = v !== S.base[i], lost = R && !R.ok && ch && s.slots[i].v !== v; token(c, v, carX(s, i), TY[k] - 2, cw, lost && Math.sin(t * 14) > 0 ? '#ff4a4a' : ch ? COLS[k] : '#e8e0d0', 1, ch ? 0.5 + 0.5 * Math.sin(t * 5) : 0); }
    if (R && !R.ok) for (const k of ['a', 'b']) if (k === 'a' ? R.lostA : R.lostB) { const q = Math.min(1, (t - R.t) * 4); c.save(); c.globalAlpha = q; SK.tag(c, '!', 52, TY[k] - 50 - Math.abs(Math.sin(t * 8)) * 4, 22, '#fff', '#e83a4a'); c.restore(); }
    // the merge train: rolls off to the right when the signal clears
    const roll = s.go ? Math.max(0, (t - s.go.t - 0.3)) ** 2 * 260 : 0;
    c.save(); train(c, s, 'm', TY.m, t, roll, { kind: 'owl', pose: R && R.ok ? 'cheer' : 'idle', expr: 'happy' });
    for (let i = 0; i < n; i++) { const sl = s.slots[i], x = carX(s, i) + roll; if (sl) { const pop = sl.t ? B7.pop((t - sl.t) * 5) : 1; token(c, sl.v, x, TY.m - 2, cw, sl.from === 'base' ? '#e8e0d0' : sl.ch ? COLS[sl.from] : '#e8e0d0', pop); } else { c.save(); c.strokeStyle = s.drag ? '#ffe27a' : 'rgba(80,50,30,0.6)'; c.lineWidth = 2.5; c.setLineDash([6, 5]); c.lineDashOffset = -t * 20; c.beginPath(); c.roundRect(x - cw / 2 + 4, TY.m - 19, cw - 8, 32, 6); c.stroke(); c.restore(); } }
    c.restore();
    // the signal: red until all the cars are loaded, tap it to send the train
    const full = s.slots.every(v => v), sx = 334 + (s.no && t - s.no < 0.3 ? Math.sin((t - s.no) * 50) * 3 : 0), sy = TY.m - 62;
    c.fillStyle = '#3a3040'; c.fillRect(sx - 3, sy, 6, 60); c.beginPath(); c.roundRect(sx - 16, sy - 30, 32, 52, 8); c.fill();
    c.fillStyle = s.go ? '#3a1a1a' : '#ff4a4a'; c.beginPath(); c.arc(sx, sy - 16, 9, 0, 7); c.fill(); c.fillStyle = s.go ? '#5aff8a' : '#1a3a2a'; c.beginPath(); c.arc(sx, sy + 8, 9, 0, 7); c.fill();
    if (full && !s.go) SK.glow(c, g, sx, sy - 4, 30);
    // the merged line runs: draw(...) paints its picture
    if (R) { const k = Math.min(1, (t - R.t) * 3), v = s.slots.map(q => q.v), kind = v[0] === '"duck"' ? 'duck' : 'frog', col = v[1] === '"blue"' ? '#4a8ae8' : '#e8564a', sz = v[2] === '5' ? 1.5 : 0.8;
      c.save(); c.globalAlpha = k; c.fillStyle = 'rgba(255,250,236,0.95)'; c.beginPath(); c.roundRect(106, 270, 148, 124, 14); c.fill(); c.strokeStyle = '#8a6a4a'; c.lineWidth = 3; c.stroke();
      SK.animal(c, kind, 180, 384, sz * k, { t, tint: col, pose: 'idle', expr: 'happy' });
      if (v[3] === '"hat"') { const hy = 384 - 64 * sz * k; c.fillStyle = '#ffd45a'; c.beginPath(); c.moveTo(168, hy); c.lineTo(192, hy); c.lineTo(180, hy - 26); c.closePath(); c.fill(); }
      c.restore(); }
    // guidance: the ghost hand drags the fox's glowing change down to its slot
    const ai = S.a.findIndex((v, i) => v !== S.base[i]);
    if (!s.go) for (let i = 0; i < n; i++) if (!s.slots[i]) { const k = S.a[i] !== S.base[i] ? 'a' : S.b[i] !== S.base[i] ? 'b' : null; if (k) SK.glow(c, g, carX(s, i), TY[k] - 2, 30, COLS[k], { level: 0 }); }
    if (s.drag) token(c, s.drag.v, s.drag.x, s.drag.y, cw, s.drag.v !== S.base[s.drag.i] ? COLS[s.drag.k] : '#e8e0d0', 1.1);
    SK.demo(g, c, 'drag', [carX(s, ai), TY.a - 2], [carX(s, ai), TY.m - 2]);
  },
  // the bot loads each slot with the changed version (B7FAIL: takes everything from the fox's train)
  auto(g, dt, synth) {
    const s = g.s; if (g.done || s.go || g.t < (s.nb || 1.0)) return; s.nb = g.t + 0.5; const fail = typeof window !== 'undefined' && window.B7FAIL;
    const i = s.slots.findIndex(v => !v);
    if (i < 0) { synth('down', 334, TY.m - 62); synth('up', 334, TY.m - 62); return; }
    const k = fail ? 'a' : s.S.a[i] !== s.S.base[i] ? 'a' : 'b', x = carX(s, i);
    synth('down', x, TY[k] - 2); synth('move', x, (TY[k] + TY.m) / 2); synth('move', x, TY.m); synth('up', x, TY.m);
  },
});
