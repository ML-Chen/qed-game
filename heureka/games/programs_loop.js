// RUN THE LOOP, THEN BEEP! (cs PR-02, was LOOP!) — you are the computer at the for line. The robot runs the loop's body
// by itself (forward, pick a gem) while the glow walks the lines. Each time the glow comes back to `for i in range(3):`
// you decide: tap the lap counter for another lap, or, when range(3) has given 0, 1 and 2, tap the beep() line to leave
// the loop. One lap too many and the robot rolls off the path into the pond; beep too soon and gems are left behind.
const F = 'forward()', G_ = 'pick_gem()';
const LV = [ // per level, four variants (SK.variant): how many laps, and the loop body (gems where the body picks)
  [{ n: 3, body: [F, G_] }, { n: 2, body: [F, G_] }, { n: 4, body: [F, G_] }, { n: 3, body: [G_, F] }],
  [{ n: 4, body: [F, G_] }, { n: 5, body: [F, G_] }, { n: 3, body: [F, F, G_] }, { n: 4, body: [G_, F] }],
  [{ n: 2, body: [F, F, G_] }, { n: 3, body: [F, F, G_] }, { n: 2, body: [F, G_, F] }, { n: 3, body: [F, G_, F] }],
];
const PX = 14, PY = 126, PW = 332, CX = 130; // code panel; the counter board's centre x (under the panel)
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
  id: 'cs_loop', stage: 'programs', cmd: 'RUN THE LOOP, THEN BEEP!', time: 7, mood: 'bright', winText: 'Loop done!', failText: 'Wrong lap count!',
  card: { title: 'A loop repeats its body', kind: 'Computer science', ref: 'for loops and range() (Python)',
    text: 'A for loop runs the indented lines under it, called its body, once for each value it is given. range(3) gives 0, 1 and 2, then stops. That is three values, starting from 0, so the body runs three times.\n\nEach time the computer reaches the for line, it takes the next value. When there are none left, it skips past the body to the first line after the loop.\n\nA very common mistake is to run one lap too many, or one too few. It is called an off-by-one error. Here one lap too many walks the robot off the end of the path.',
    note: 'A for loop runs its body once per value; range(3) gives 0, 1, 2 and then the loop ends.' },
  init(g) {
    const s = g.s, v = SK.variant(g, 4), L = LV[Math.min(2, g.level)][v]; s.v = v; s.L = L; s.lines = prog(L); s.pc = 0; s.i = -1; s.pos = 0; s.anim = null; s.cAt = null; s.res = null; s.done = []; s.bt = 0;
    const fw = L.body.filter(b => b === 'forward()').length; s.tiles = L.n * fw;
    s.gems = []; let p = 0; for (let k = 0; k < L.n; k++) for (const b of L.body) { if (b === 'forward()') p++; else s.gems.push({ at: p, got: 0 }); }
    const lay = B7.layout({ x: PX, y: PY, w: PW, lines: s.lines }); s.lay = lay; s.panelB = lay.y + lay.h; s.cY = lay.y + lay.h + 28;
  },
  // at the for line you decide: tap the counter for another lap, or tap the beep() line when the laps are used up
  choose(g, a) {
    const s = g.s; if (g.done || s.anim || s.pc !== 0) return; const n = s.L.n, G = pathGeo(s);
    if (a === 'counter') {
      s.i++; s.cAt = g.t; g.sfx('click');
      if (s.i < n) { s.pc = 1; s.bt = g.t + 0.3; s.done = [0]; return; }
      B7.flash(g, 0); g.sfx('whoosh'); s.anim = { from: s.pos, to: s.pos + 1.4, t0: g.t + 0.3, dunk: true }; return; // one lap too many: off the end into the pond
    }
    if (s.i === n - 1) { s.pc = s.lines.length - 1; s.res = { t: g.t, win: true }; g.sfx('bell'); g.sfx('cheer'); g.win(); g.burst(G.at(s.pos), G.y - 80, ['#ffd45a', '#7ee8a0', '#fff'], 18, 150); return; }
    s.pc = s.lines.length - 1; s.res = { t: g.t, win: false, early: true }; B7.flash(g, 0); g.sfx('bell'); g.sfx('wrong'); g.fail(); // beeped with gems left on the path
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    if (Math.abs(x - CX) < 110 && Math.abs(y - s.cY) < 34) { this.choose(g, 'counter'); return; }
    const by = s.lay.lineY(s.lines.length - 1); if (x > PX && x < PX + PW && Math.abs(y - by) < s.lay.lineH / 2 + 4) this.choose(g, 'beep');
  },
  update(g, dt) {
    const s = g.s, a = s.anim; if (g.done) return; const G = pathGeo(s);
    if (a) { const k = (g.t - a.t0) / (a.dunk ? 0.7 : 0.35); if (a.dunk && k >= 0.75 && !s.res) { s.res = { t: g.t, win: false }; g.sfx('splash'); g.sfx('quack'); g.shake(5, 0.3); g.fail(); } if (k >= 1 && !a.dunk) s.anim = null; return; }
    // the computer runs the body by itself, one line at a time, while you watch the glow
    if (s.pc > 0 && s.pc < s.lines.length - 1 && g.t >= s.bt) {
      const ln = s.lines[s.pc].trim();
      if (ln === 'forward()') { s.anim = { from: s.pos, to: s.pos + 1, t0: g.t }; s.pos++; g.sfx('whoosh'); }
      else { const gm = s.gems.find(q => q.at === s.pos && !q.got); if (gm) { gm.got = g.t; g.sfx('sparkle'); g.burst(G.at(s.pos), G.y - 90, ['#5ee0ff', '#fff'], 10, 110); } }
      s.done.push(s.pc); s.pc = s.pc + 1 >= s.lines.length - 1 ? 0 : s.pc + 1; s.bt = g.t + 0.45;
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, G = pathGeo(s);
    c.drawImage(g.bake('cs_loop' + Math.min(2, g.level) + '_' + s.v, o => paintGarden(o, s)), 0, 0, 360, 640);
    B7.panel(c, g, { x: PX, y: PY, w: PW, lines: s.lines, cur: s.res && s.res.win ? -1 : s.pc, flash: s.b7flash, done: s.done, icons: ['loop', ...s.L.body.map(b => b === 'forward()' ? 'right' : 'gem'), 'say'] });
    counterBoard(c, g, s, CX, s.cY); SK.tag(c, 'Lap counter', CX, s.cY + 38, 18);
    if (s.i >= s.L.n) { c.save(); c.fillStyle = '#ff5a6a'; const ox = CX - (46 + s.L.n * 40) / 2 + 44 + s.L.n * 40 + 16; c.beginPath(); c.roundRect(ox - 16, s.cY - 14, 32, 28, 6); c.fill(); c.fillStyle = '#fff'; c.font = `800 20px ${B7.MONO}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(s.L.n), ox, s.cY + 1); c.restore(); }
    for (const gm of s.gems) { const gx = G.at(gm.at); if (!gm.got) { const blink = s.res && s.res.early && Math.sin(t * 14) > 0; if (!blink) B7.gem(c, gx, G.y - 100 + Math.sin(t * 3 + gm.at) * 4, 1.3, '#5ee0ff', t); } else { const k = Math.min(1, (t - gm.got) * 3); if (k < 1) B7.gem(c, SK.lerp(gx, 300, k), SK.lerp(G.y - 100, s.panelB + 76, k), 1.3 * (1 - k * 0.5), '#5ee0ff', t); } }
    s.gems.filter(q => q.got && t - q.got > 0.33).forEach((q, i) => B7.gem(c, 250 + i * 22, s.panelB + 76, 0.8, '#5ee0ff', t));
    let rx = G.at(s.pos), ry = G.y, sink = 0, bob = 0;
    if (s.anim && t >= s.anim.t0) { const a = s.anim, k = Math.min(1, (t - a.t0) / (a.dunk ? 0.7 : 0.35)); rx = SK.lerp(G.at(a.from), G.at(a.from) + (a.to - a.from) * G.w * (a.dunk ? 1.3 : 1), SK.easeInOut(k)); bob = k * 4; if (a.dunk && k > 0.6) sink = Math.min(1, (k - 0.6) / 0.4); }
    if (s.res && !s.res.win && !s.res.early) { sink = 1; rx = G.at(s.anim.from) + 1.4 * G.w * 1.3; B7.splash(c, rx, ry + 6, Math.min(1, (t - s.res.t) * 1.3)); }
    const won = s.res && s.res.win;
    c.save(); if (sink) { c.beginPath(); c.rect(0, 0, 360, ry - 4); c.clip(); }
    B7.robot(c, rx, ry + sink * 40, 0.8, { t, dir: 0, mood: won ? 'happy' : s.res ? 'wow' : 'idle', bob, wet: sink });
    c.restore();
    if (sink) { c.save(); c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2; for (let j = 0; j < 3; j++) { const q = ((t - (s.res ? s.res.t : t)) * 1.2 + j * 0.33) % 1; c.globalAlpha = 1 - q; c.beginPath(); c.ellipse(rx, ry - 2, 10 + q * 30, 3 + q * 8, 0, 0, 7); c.stroke(); } c.restore(); }
    if (s.res && (won || s.res.early)) { const k = Math.min(1, (t - s.res.t) * 4); c.save(); c.globalAlpha = k; SK.tag(c, 'beep!', rx + 10, ry - 112, 20); c.restore(); }
    const dk = s.res && !s.res.win && !s.res.early;
    SK.animal(c, 'duck', Math.min(334, G.pond + 30), G.y + 36 + Math.sin(t * 2) * 2, 0.6, { t, pose: dk ? 'cheer' : 'idle', expr: dk ? 'wow' : 'happy', facing: -1, noShadow: true });
    // guidance: at the first for line the counter glows; after that you read range() and the counter yourself.
    // The hand (after a pause, or at level 0 from the start) shows the right tap.
    if (!g.done && !s.anim && s.pc === 0) {
      // the next tap glows (levels 0 and 1): the counter while range() still has values, the beep() line once they are used up
      const last = s.i === s.L.n - 1, by = s.lay.lineY(s.lines.length - 1);
      if (last) SK.glow(c, g, PX + 70, by, 26); else SK.glow(c, g, CX + 10, s.cY, 46); SK.demo(g, c, 'tap', last ? [PX + 60, s.lay.lineY(s.lines.length - 1)] : [CX, s.cY]);
    }
  },
  // the bot taps the counter for each lap, then the beep() line (B7FAIL: one lap too many)
  auto(g, dt, synth) {
    const s = g.s; if (g.done || s.anim || s.pc !== 0 || g.t < (s.nextBot || 1.0)) return; s.nextBot = g.t + 0.3;
    const fail = typeof window !== 'undefined' && window.B7FAIL, last = s.i === s.L.n - 1 && !fail;
    if (last) { const y = s.lay.lineY(s.lines.length - 1); synth('down', PX + 60, y); synth('up', PX + 60, y); } else { synth('down', CX, s.cY); synth('up', CX, s.cY); }
  },
});
