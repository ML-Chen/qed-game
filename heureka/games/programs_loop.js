// LOOP! (cs PR-02) — you are the computer. A tiny Python loop glows line by line; do what the glowing line says:
// tap the wall counter for the `for` line, drag the robot one tile for forward(), tap the gem for pick_gem(). The
// counter lights 0, 1, 2; on the next tap range(3) has run out and the glow drops out of the loop to beep(). Do a
// fourth lap out of habit and the robot rolls off the end of the path into the pond while range(3) flashes.
const LV = [ // per level: how many laps, the loop body, and the path (tiles after the start; gems where the body picks)
  { n: 3, body: ['forward()', 'pick_gem()'] },
  { n: 4, body: ['forward()', 'pick_gem()'] },
  { n: 2, body: ['forward()', 'forward()', 'pick_gem()'] },
];
const PX = 14, PY = 126, PW = 332, CX = 130; // code panel; the counter board's centre x (under the panel)
const KIND = { 'forward()': 'fwd', 'pick_gem()': 'gem' };
function prog(L) { return [`for i in range(${L.n}):`, ...L.body.map(b => '    ' + b), 'beep()']; }
function pathGeo(s) { const tiles = s.tiles, w = Math.min(62, 236 / (tiles + 1)); return { w, x0: 20 + w / 2, y: 530, at: k => 20 + w / 2 + k * w, pond: 20 + (tiles + 1) * w + 58 }; }
function paintGarden(o, s) {
  const g0 = o.createLinearGradient(0, 0, 0, 640); g0.addColorStop(0, '#bfe8c8'); g0.addColorStop(0.45, '#9ad49a'); g0.addColorStop(1, '#6aae64'); o.fillStyle = g0; o.fillRect(0, 0, 360, 640);
  // a brick wall behind the panel and the counter
  o.fillStyle = '#e8c8a0'; o.fillRect(0, 118, 360, s.panelB - 64); const rnd = P.rng(4);
  for (let y = 118; y < s.panelB + 54; y += 18) for (let x = (y / 18) % 2 ? -20 : 0; x < 360; x += 40) { o.fillStyle = `rgba(200,140,100,${0.25 + rnd() * 0.2})`; o.beginPath(); o.roundRect(x + 2, y + 2, 36, 14, 3); o.fill(); }
  o.fillStyle = 'rgba(60,90,40,0.25)'; o.fillRect(0, s.panelB + 54, 360, 6);
  const G = pathGeo(s), pondX = G.pond - 70;
  // the pond at the end of the path
  o.fillStyle = '#3a8ab8'; o.beginPath(); o.ellipse(pondX + 70, G.y + 4, 92, 70, 0, 0, 7); o.fill();
  const pw = o.createRadialGradient(pondX + 60, G.y - 10, 10, pondX + 70, G.y + 4, 92); pw.addColorStop(0, '#7ac8e8'); pw.addColorStop(1, '#3a8ab8'); o.fillStyle = pw; o.beginPath(); o.ellipse(pondX + 70, G.y + 4, 84, 62, 0, 0, 7); o.fill();
  o.fillStyle = '#5cb84e'; o.beginPath(); o.ellipse(pondX + 100, G.y + 34, 16, 9, 0, 0.4, 6.0); o.lineTo(pondX + 100, G.y + 34); o.fill();
  // grass tufts and flowers
  P.grassTufts(o, 360, s.panelB + 70, 610, 26, '#4a9a46', 6); P.flowers(o, 300, 560, 610, 9, undefined, 3);
  // the path: stone tiles
  for (let k = 0; k <= s.tiles; k++) { const x = G.at(k); o.fillStyle = 'rgba(40,60,30,0.25)'; o.beginPath(); o.roundRect(x - G.w / 2 + 3, G.y - 12 + 5, G.w - 4, 30, 8); o.fill(); o.fillStyle = k ? '#d8cbb8' : '#f0d890'; o.beginPath(); o.roundRect(x - G.w / 2 + 2, G.y - 14, G.w - 4, 30, 8); o.fill(); o.strokeStyle = 'rgba(120,100,80,0.5)'; o.lineWidth = 1.5; o.stroke(); }
}
function counterBoard(c, g, s, x, y) { // the tally counter on the wall: one window per value range() gives, the current one lit
  const n = s.L.n, cw = 40, w = 46 + n * cw, x0 = x - w / 2, bump = s.cAt != null ? B7.pop((g.t - s.cAt) * 5) : 1;
  c.save(); c.translate(x, y); c.scale(bump, bump); c.translate(-x, -y);
  c.fillStyle = 'rgba(40,20,20,0.3)'; c.beginPath(); c.roundRect(x0 + 3, y - 20, w, 44, 12); c.fill();
  c.fillStyle = '#6a4a8a'; c.strokeStyle = '#3a2450'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(x0, y - 22, w, 44, 12); c.fill(); c.stroke();
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 20px ${B7.MONO}`; c.fillStyle = '#ffe8a0'; c.fillText('i', x0 + 22, y + 1);
  for (let k = 0; k < n; k++) {
    const cx = x0 + 44 + k * cw + cw / 2 - 4, on = s.i === k, used = s.i > k;
    c.fillStyle = on ? '#ffd45a' : used ? '#5a8a6a' : '#2a1c3a'; c.beginPath(); c.roundRect(cx - 16, y - 14, 32, 28, 6); c.fill();
    c.fillStyle = on ? '#3a2040' : used ? '#c8f0d0' : 'rgba(255,255,255,0.4)'; c.font = `800 20px ${B7.MONO}`; c.fillText(String(k), cx, y + 1);
  }
  if (s.i >= n) { c.strokeStyle = '#ff6b8a'; c.lineWidth = 3; c.beginPath(); c.roundRect(x0 + 40, y - 18, n * cw, 36, 8); c.stroke(); }
  c.restore();
}
MG.add({
  id: 'cs_loop', stage: 'programs', cmd: 'LOOP!', time: 7, mood: 'bright', winText: 'For loop!', failText: 'Off by one!',
  card: { title: 'A loop repeats its body', kind: 'Computer science', ref: 'for loops and range() (Python)',
    text: 'A for loop runs the indented lines under it, called its body, once for each value it is given. range(3) gives 0, 1 and 2, then stops. That is three values, starting from 0, so the body runs three times.\n\nEach time the computer reaches the for line, it takes the next value. When there are none left, it skips past the body to the first line after the loop.\n\nA very common mistake is to run one lap too many. Here that walks the robot right off the end of the path.',
    note: 'A for loop runs its body once per value; range(3) gives 0, 1, 2 and then the loop ends.' },
  init(g) {
    const s = g.s, L = LV[Math.min(2, g.level)]; s.L = L; s.lines = prog(L); s.pc = 0; s.i = -1; s.pos = 0; s.anim = null; s.cAt = null; s.res = null; s.done = [];
    const fw = L.body.filter(b => b === 'forward()').length; s.tiles = L.n * fw;
    s.gems = []; let p = 0; for (let k = 0; k < L.n; k++) for (const b of L.body) { if (b === 'forward()') p++; else s.gems.push({ at: p, got: 0 }); }
    const lay = B7.layout({ x: PX, y: PY, w: PW, lines: s.lines }); s.lay = lay; s.panelB = lay.y + lay.h; s.cY = lay.y + lay.h + 28;
  },
  want(s) { const ln = s.lines[s.pc]; if (s.pc === 0) return 'counter'; if (ln === 'beep()') return 'robot'; return KIND[ln.trim()]; },
  act(g, a) { // the player did action a; does it match the glowing line?
    const s = g.s; if (g.done || s.anim) return; const want = this.want(s), G = pathGeo(s);
    if (a === want) {
      if (a === 'counter') { s.i++; s.cAt = g.t; g.sfx('click'); if (s.i < s.L.n) s.pc = 1; else { s.pc = s.lines.length - 1; g.sfx('ding'); } s.done = []; return; }
      if (a === 'fwd') { s.anim = { from: s.pos, to: s.pos + 1, t0: g.t }; s.pos++; g.sfx('whoosh'); }
      if (a === 'gem') { const gm = s.gems.find(q => q.at === s.pos && !q.got); if (gm) { gm.got = g.t; g.sfx('sparkle'); g.burst(G.at(s.pos), G.y - 90, ['#5ee0ff', '#fff'], 10, 110); } }
      if (a === 'robot') { s.res = { t: g.t, win: true }; g.sfx('bell'); g.sfx('cheer'); g.win(); g.burst(G.at(s.pos), G.y - 80, ['#ffd45a', '#7ee8a0', '#fff'], 18, 150); return; }
      s.done.push(s.pc); s.pc = s.pc + 1 >= s.lines.length - 1 ? 0 : s.pc + 1; return;
    }
    // a fourth lap: the loop has ended, but the robot is driven on anyway, off the path into the pond
    if (a === 'fwd' && s.i >= s.L.n) { s.anim = { from: s.pos, to: s.pos + 1.4, t0: g.t, dunk: true }; B7.flash(g, 0); g.sfx('whoosh'); return; }
    if (a === 'counter' && s.i >= s.L.n) { B7.flash(g, 0); g.sfx('wrong'); return; }
    B7.flash(g, s.pc); g.sfx('wrong'); s.oops = g.t;
  },
  down(g, x, y) { SK.touched(g); g.s.p0 = { x, y }; },
  up(g, x, y) {
    const s = g.s, p0 = s.p0; if (!p0) return; s.p0 = null; const dx = x - p0.x, dy = y - p0.y, G = pathGeo(s);
    if (dx > 30 && Math.abs(dy) < dx) { this.act(g, 'fwd'); return; }
    if (Math.hypot(dx, dy) > 30) return;
    if (Math.abs(x - CX) < 110 && Math.abs(y - s.cY) < 34) { this.act(g, 'counter'); return; }
    const rx = G.at(s.pos);
    if (SK.dist(x, y, rx, G.y - 100) < 34) { this.act(g, s.gems.some(q => q.at === s.pos && !q.got) ? 'gem' : 'robot'); return; }
    if (SK.dist(x, y, rx, G.y - 34) < 40) { this.act(g, 'robot'); return; }
    const gm = s.gems.find(q => !q.got && SK.dist(x, y, G.at(q.at), G.y - 100) < 34); if (gm) this.act(g, 'gem'); // a gem further along: not yet
  },
  update(g, dt) {
    const s = g.s, a = s.anim; if (!a) return;
    const k = (g.t - a.t0) / (a.dunk ? 0.7 : 0.35);
    if (a.dunk && k >= 0.75 && !s.res) { s.res = { t: g.t, win: false }; g.sfx('splash'); g.sfx('quack'); g.shake(5, 0.3); g.fail(); }
    if (k >= 1) s.anim = a.dunk ? a : null;
  },
  draw(g, c) {
    const s = g.s, t = g.t, G = pathGeo(s);
    c.drawImage(g.bake('cs_loop' + Math.min(2, g.level), o => paintGarden(o, s)), 0, 0, 360, 640);
    // the code panel and the counter board
    const dl = s.done.slice(); B7.panel(c, g, { x: PX, y: PY, w: PW, lines: s.lines, cur: s.res ? -1 : s.pc, flash: s.b7flash, done: dl, icons: ['loop', ...s.L.body.map(b => b === 'forward()' ? 'right' : 'gem'), 'say'] });
    const cb = counterBoard(c, g, s, CX, s.cY);
    // the gems on their tiles (floating), the robot
    for (const gm of s.gems) { const gx = G.at(gm.at); if (!gm.got) { B7.gem(c, gx, G.y - 100 + Math.sin(t * 3 + gm.at) * 4, 1.3, '#5ee0ff', t); } else { const k = Math.min(1, (t - gm.got) * 3); if (k < 1) B7.gem(c, SK.lerp(gx, 262, k), SK.lerp(G.y - 100, s.cY, k), 1.3 * (1 - k * 0.5), '#5ee0ff', t); } }
    // the gems collected so far, in a little row
    s.gems.filter(q => q.got && t - q.got > 0.33).forEach((q, i) => B7.gem(c, 262 + i * 22, s.cY, 0.8, '#5ee0ff', t));
    let rx = G.at(s.pos), ry = G.y, sink = 0, bob = 0;
    if (s.anim) { const a = s.anim, k = Math.min(1, (t - a.t0) / (a.dunk ? 0.7 : 0.35)); rx = SK.lerp(G.at(a.from), G.at(a.from) + (a.to - a.from) * G.w * (a.dunk ? 1.3 : 1), SK.easeInOut(k)); bob = k * 4; if (a.dunk && k > 0.6) sink = Math.min(1, (k - 0.6) / 0.4); }
    if (s.res && !s.res.win) { sink = 1; rx = G.at(s.anim.from) + 1.4 * G.w * 1.3; B7.splash(c, rx, ry + 6, Math.min(1, (t - s.res.t) * 1.3)); }
    const won = s.res && s.res.win, oops = s.oops && t - s.oops < 0.5;
    c.save(); if (sink) { c.beginPath(); c.rect(0, 0, 360, ry - 4); c.clip(); }
    B7.robot(c, rx, ry + sink * 40, 0.8, { t, dir: 0, mood: won ? 'happy' : s.res ? 'wow' : oops ? 'wow' : 'idle', bob, wet: sink, tilt: oops ? Math.sin((t - s.oops) * 30) * 0.08 : 0 });
    c.restore();
    if (sink) { c.save(); c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2; for (let j = 0; j < 3; j++) { const q = ((t - (s.res ? s.res.t : t)) * 1.2 + j * 0.33) % 1; c.globalAlpha = 1 - q; c.beginPath(); c.ellipse(rx, ry - 2, 10 + q * 30, 3 + q * 8, 0, 0, 7); c.stroke(); } c.restore(); }
    if (won) { const k = Math.min(1, (t - s.res.t) * 4); c.save(); c.globalAlpha = k; SK.tag(c, 'beep!', rx + 10, ry - 112, 20); c.restore(); }
    // the duck in the pond, startled by a splash
    const dx = G.pond + 30, dk = s.res && !s.res.win;
    SK.animal(c, 'duck', Math.min(334, dx), G.y + 36 + Math.sin(t * 2) * 2, 0.6, { t, pose: dk ? 'cheer' : 'idle', expr: dk ? 'wow' : 'happy', facing: -1, noShadow: true });
    // guidance: glow the thing the glowing line asks for; the ghost hand taps the counter first
    if (!g.done) {
      const w = this.want(s);
      if (w === 'counter') SK.glow(c, g, CX + 10, s.cY, 46); else if (w === 'gem') SK.glow(c, g, rx, G.y - 100, 26); else if (w === 'robot') SK.glow(c, g, rx, G.y - 36, 34);
      else if (w === 'fwd' && g.level <= 1) { const p = (t * 1.5) % 1; c.save(); c.globalAlpha = 0.6 * (1 - p); c.fillStyle = '#fff6ea'; c.beginPath(); const ax = rx + 26 + p * 22; c.moveTo(ax, G.y - 44); c.lineTo(ax + 14, G.y - 34); c.lineTo(ax, G.y - 24); c.closePath(); c.fill(); c.restore(); }
    }
    SK.demo(g, c, 'tap', [CX, s.cY]);
  },
  // the bot does what the glowing line says, one action every 0.4 s (B7FAIL: drives one lap too many)
  auto(g, dt, synth) {
    const s = g.s; if (g.done || s.anim) return; if (g.t < (s.nextBot || 1.0)) return; s.nextBot = g.t + 0.4;
    const G = pathGeo(s), fail = typeof window !== 'undefined' && window.B7FAIL; let w = this.want(s); if (fail && w === 'robot') w = 'fwd';
    const rx = G.at(s.pos);
    if (w === 'counter') { synth('down', CX, s.cY); synth('up', CX, s.cY); }
    else if (w === 'gem') { synth('down', rx, G.y - 100); synth('up', rx, G.y - 100); }
    else if (w === 'robot') { synth('down', rx, G.y - 34); synth('up', rx, G.y - 34); }
    else { synth('down', rx, G.y - 30); synth('move', rx + 60, G.y - 30); synth('up', rx + 60, G.y - 30); }
  },
});
