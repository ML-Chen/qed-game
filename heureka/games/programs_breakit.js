// BREAK IT! (cs RD-10) — a sign-up machine has passed its easy tests. Fling input cards into its hopper and find the
// bugs: the empty name makes it cough smoke, the mile-long name jams its gears, the emoji name comes out garbled; each
// bug crawls out as a beetle and lands in the bug jar row. Normal names just get a green light. Run out of time having
// thrown only normal names and real users arrive: the machine explodes in garbled letters. Weird inputs find bugs.
const HOP = { y: 246, w: 92 }, GRAV = 900;
const SETS = [
  ['Ann', 'empty', 'long', 'Bo', 'emoji'],
  ['Bo', 'long', 'Ann', 'emoji', 'Max', 'empty'],
  ['empty', 'Ann', 'neg', 'long', 'Bo', 'emoji'],
];
const isBug = k => ['empty', 'long', 'emoji', 'neg'].includes(k);
function hopX(g, s, t) { return s.L === 2 ? 180 + Math.sin(t * 1.3) * 70 : 180; }
function paintWorkshop(o) {
  const w = o.createLinearGradient(0, 0, 0, 640); w.addColorStop(0, '#3a5a6a'); w.addColorStop(0.6, '#5a7a7a'); w.addColorStop(1, '#3a4a4a'); o.fillStyle = w; o.fillRect(0, 0, 360, 640);
  o.strokeStyle = 'rgba(255,255,255,0.06)'; o.lineWidth = 2; for (let y = 120; y < 500; y += 40) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); }
  // pipes on the wall
  o.strokeStyle = '#8a6a4a'; o.lineWidth = 10; o.beginPath(); o.moveTo(0, 200); o.lineTo(60, 200); o.lineTo(60, 300); o.stroke(); o.beginPath(); o.moveTo(360, 230); o.lineTo(300, 230); o.lineTo(300, 330); o.stroke();
  // the floor
  o.fillStyle = '#8a7058'; o.fillRect(0, 500, 360, 140); o.strokeStyle = 'rgba(40,20,10,0.3)'; for (let x = 0; x < 380; x += 48) { o.beginPath(); o.moveTo(x, 500); o.lineTo(x - 30, 640); o.stroke(); }
  // the tray for the cards
  o.fillStyle = '#5a3a24'; o.beginPath(); o.roundRect(10, 540, 340, 72, 12); o.fill(); o.fillStyle = '#7a5434'; o.beginPath(); o.roundRect(16, 546, 328, 60, 9); o.fill();
}
function inCard(c, kind, x, y, s = 1, rot = 0, t = 0, tail = true) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  if (kind === 'long' && tail) { c.fillStyle = '#fff6ea'; c.strokeStyle = '#a08060'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-30, -6); for (let i = 0; i <= 10; i++) c.lineTo(-30 - i * 3.2, -6 + Math.sin(i * 1.3 + t * 3) * 5); c.lineTo(-62, 8); for (let i = 10; i >= 0; i--) c.lineTo(-30 - i * 3.2, 8 + Math.sin(i * 1.3 + t * 3) * 5); c.closePath(); c.fill(); c.stroke(); }
  c.fillStyle = 'rgba(20,10,10,0.3)'; c.beginPath(); c.roundRect(-30, -20, 64, 44, 8); c.fill();
  c.fillStyle = kind === 'empty' ? '#f4f4f4' : '#fffaf0'; c.strokeStyle = '#6a4a3a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-32, -22, 64, 44, 8); c.fill(); c.stroke();
  c.textAlign = 'center'; c.textBaseline = 'middle';
  if (kind === 'empty') { c.setLineDash([4, 4]); c.strokeStyle = '#a0a0a0'; c.strokeRect(-22, -11, 44, 22); c.setLineDash([]); }
  else if (kind === 'long') { c.fillStyle = '#3a2440'; c.font = '800 15px Nunito, system-ui'; c.save(); c.beginPath(); c.rect(-30, -20, 60, 40); c.clip(); c.fillText('Aaaaaaaaaa', 6, 1); c.restore(); }
  else if (kind === 'emoji') { const f = (fx, col) => { c.fillStyle = col; c.beginPath(); c.arc(fx, 0, 10, 0, 7); c.fill(); c.fillStyle = '#3a2440'; c.beginPath(); c.arc(fx - 3.5, -2, 1.8, 0, 7); c.arc(fx + 3.5, -2, 1.8, 0, 7); c.fill(); c.strokeStyle = '#3a2440'; c.lineWidth = 1.6; c.beginPath(); c.arc(fx, 1, 5, 0.3, 2.8); c.stroke(); }; f(-12, '#ffd040'); f(12, '#7ad87a'); }
  else if (kind === 'neg') { c.fillStyle = '#e83a5a'; c.font = '900 22px Nunito, system-ui'; c.fillText('-3', -6, 1); c.fillStyle = '#ffb0c8'; c.fillRect(12, -2, 14, 10); c.fillStyle = '#ffe27a'; c.fillRect(18, -10, 2, 8); }
  else { c.fillStyle = '#3a2440'; c.font = '900 21px Nunito, system-ui'; c.fillText(kind, 0, 1); }
  c.restore();
}
function beetle(c, x, y, s, t, col = '#5ad06a') { c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = '#2a2a2a'; c.lineWidth = 2; for (let i = -1; i <= 1; i++) { const w = Math.sin(t * 20 + i) * 2; c.beginPath(); c.moveTo(-8, i * 5); c.lineTo(-14, i * 6 + w); c.moveTo(8, i * 5); c.lineTo(14, i * 6 - w); c.stroke(); } c.fillStyle = col; c.beginPath(); c.ellipse(0, 2, 9, 11, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.moveTo(0, -8); c.lineTo(0, 13); c.stroke(); c.fillStyle = '#2a2a2a'; c.beginPath(); c.arc(0, -10, 5, 0, 7); c.fill(); c.restore(); }
function machine(c, s, t, hx) {
  const shake = s.proc && s.proc.bug ? Math.sin(t * 50) * 2 * Math.max(0, 1 - (t - s.proc.t)) : 0;
  c.save(); c.translate(shake, 0);
  // the hopper (it slides along a rail at level 2)
  if (s.L === 2) { c.fillStyle = '#4a4a5a'; c.fillRect(90, HOP.y - 6, 180, 6); }
  c.fillStyle = '#c84a3a'; c.strokeStyle = '#5a1a14'; c.lineWidth = 3; c.beginPath(); c.moveTo(hx - HOP.w / 2 - 6, HOP.y); c.lineTo(hx + HOP.w / 2 + 6, HOP.y); c.lineTo(hx + 16, HOP.y + 34); c.lineTo(hx - 16, HOP.y + 34); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#3a1a14'; c.beginPath(); c.ellipse(hx, HOP.y, HOP.w / 2, 7, 0, 0, 7); c.fill();
  c.strokeStyle = '#6a6a7a'; c.lineWidth = 12; c.beginPath(); c.moveTo(hx, HOP.y + 34); c.quadraticCurveTo(hx, HOP.y + 60, 180, 300); c.stroke();
  // the body
  c.fillStyle = '#e8a83a'; c.strokeStyle = '#6a4010'; c.lineWidth = 3; c.beginPath(); c.roundRect(90, 296, 180, 150, 14); c.fill(); c.stroke();
  // the gears (spin while it works, stick when jammed)
  const jam = s.proc && s.proc.k === 'long' && t - s.proc.t < 2, sp = jam ? Math.sin(t * 40) * 0.05 : t * 2;
  for (const [gx, gy, r, d] of [[118, 330, 18, 1], [146, 318, 12, -1.5]]) { c.save(); c.translate(gx, gy); c.rotate(sp * d); c.fillStyle = '#8a8a9a'; c.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, rr = i % 2 ? r : r + 5; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.fillStyle = '#4a4a5a'; c.beginPath(); c.arc(0, 0, 4, 0, 7); c.fill(); c.restore(); }
  // the screen: what came through
  c.fillStyle = '#1a2a2a'; c.beginPath(); c.roundRect(170, 316, 86, 58, 8); c.fill();
  const p = s.proc; if (p && t - p.t < 1.4) {
    c.save(); c.beginPath(); c.roundRect(170, 316, 86, 58, 8); c.clip(); c.textAlign = 'center'; c.textBaseline = 'middle';
    if (!p.bug) { c.fillStyle = '#7ee8a0'; c.font = '900 20px Nunito, system-ui'; c.fillText(p.k, 213, 336); c.strokeStyle = '#7ee8a0'; c.lineWidth = 3.5; c.beginPath(); c.moveTo(203, 358); c.lineTo(210, 365); c.lineTo(224, 351); c.stroke(); }
    else if (p.k === 'emoji') { c.fillStyle = '#ff7a8a'; c.font = '900 20px monospace'; c.fillText('□□?Ã', 213 + Math.sin(t * 30) * 2, 345); }
    else if (p.k === 'neg') { c.fillStyle = '#ff7a8a'; c.font = '900 22px Nunito, system-ui'; c.fillText('-3 ?!', 213, 345); }
    else if (p.k === 'long') { c.fillStyle = '#ff7a8a'; c.font = '900 15px Nunito, system-ui'; c.fillText('Aaaaaaaaaaaa', 213 - ((t - p.t) * 80 % 60), 345); }
    else { c.fillStyle = '#ff7a8a'; c.font = '900 26px Nunito, system-ui'; c.fillText('!', 213, 345); }
    c.restore();
  }
  // the lights
  const ok = p && !p.bug && t - p.t < 1, bad = p && p.bug && t - p.t < 1.2;
  c.fillStyle = ok ? '#5aff8a' : '#2a5a3a'; c.beginPath(); c.arc(190, 404, 9, 0, 7); c.fill(); c.fillStyle = bad && Math.sin(t * 20) > 0 ? '#ff4a5a' : '#5a2a2a'; c.beginPath(); c.arc(220, 404, 9, 0, 7); c.fill();
  // legs
  c.fillStyle = '#6a4010'; c.fillRect(104, 446, 14, 50); c.fillRect(242, 446, 14, 50);
  c.restore();
  // smoke from the empty name, sparks from the jam
  if (p && p.bug && t - p.t < 1.6) {
    const q = t - p.t;
    if (p.k === 'empty') for (let i = 0; i < 6; i++) { const k = (q * 0.8 + i / 6) % 1; c.fillStyle = `rgba(80,80,90,${0.5 * (1 - k)})`; c.beginPath(); c.arc(240 + Math.sin(i * 2 + q * 3) * 10 + k * 20, 296 - k * 90, 10 + k * 18, 0, 7); c.fill(); }
    if (p.k === 'long') { inCard(c, 'long', 60 + q * 10, 380, 0.9, 0, t); c.fillStyle = '#ffe27a'; for (let i = 0; i < 6; i++) { const a = t * 13 + i, r = 14 + (i * 7 % 10); c.beginPath(); c.arc(132 + Math.cos(a) * r, 324 + Math.sin(a) * r, 2.2, 0, 7); c.fill(); } }
  }
}
MG.add({
  id: 'cs_breakit', stage: 'programs', cmd: 'BREAK IT WITH WEIRD INPUTS!', time: 7, mood: 'bright', winText: 'Bugs found!', failText: 'Bugs escaped!',
  card: { title: 'Test with weird inputs', kind: 'Computer science', ref: 'Edge cases in software testing',
    text: 'A program that works for "Ann" and "Bo" can still break. Bugs hide in the inputs nobody tried: an empty name, a name a thousand letters long, a name made of emoji, an age below zero.\n\nThese are called edge cases. A good tester tries to break the program on purpose, by feeding it the strangest inputs they can think of, before real users do.\n\nEvery bug found this way can be fixed early, when it is cheap. A bug found by users is found late.',
    note: 'Bugs hide in unusual inputs, so test with empty, huge and strange ones, not just normal ones.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level), set = SETS[L]; s.L = L;
    const n = set.length, gap = 320 / n; s.cards = set.map((k, i) => { const hx = 20 + gap * (i + 0.5); return { i, k, hx, hy: 576, x: hx, y: 576, state: 'tray', vx: 0, vy: 0, rot: 0 }; });
    s.need = set.filter(isBug).length; s.trayS = n > 5 ? 0.8 : 0.9; s.bugs = []; s.proc = null; s.throws = 0;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    const cd = SK.pick(s.cards.filter(c2 => c2.state === 'tray'), x, y, 40); if (cd) { cd.state = 'held'; SK.dragStart(g, cd, x, y); g.sfx('tap'); }
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const cd = d.obj;
    let { vx, vy } = d; const sp = Math.hypot(vx, vy); if (sp < 250 || vy > -100) { cd.state = 'back'; return; }
    if (sp > 1400) { vx *= 1400 / sp; vy *= 1400 / sp; }
    cd.vx = vx; cd.vy = vy; cd.state = 'fly'; cd.spin = vx / 400; s.throws++; g.sfx('whoosh');
  },
  update(g, dt) {
    const s = g.s; if (g.done) return; const hx = hopX(g, s, g.t);
    for (const cd of s.cards) {
      if (cd.state === 'fly') {
        const py = cd.y; cd.vy += GRAV * dt; cd.x += cd.vx * dt; cd.y += cd.vy * dt; cd.rot += cd.spin * dt * 6;
        if (py < HOP.y && cd.y >= HOP.y && cd.vy > 0) { // crossing the hopper mouth on the way down
          if (Math.abs(cd.x - hx) < HOP.w / 2) { cd.state = 'in'; cd.it = g.t; cd.ix = cd.x; g.sfx('crunch'); continue; }
          if (Math.abs(cd.x - hx) < HOP.w / 2 + 14) { cd.vx = -cd.vx * 0.4 + (cd.x < hx ? -60 : 60); cd.vy = -cd.vy * 0.3; g.sfx('thud'); } // hit the rim
        }
        if (cd.y > 600 || cd.x < -60 || cd.x > 420) { cd.state = 'back'; g.sfx('thud'); }
      }
      if (cd.state === 'back') { cd.x = SK.lerp(cd.x, cd.hx, 0.2); cd.y = SK.lerp(cd.y, cd.hy, 0.2); cd.rot *= 0.8; if (SK.dist(cd.x, cd.y, cd.hx, cd.hy) < 2) { cd.state = 'tray'; cd.x = cd.hx; cd.y = cd.hy; cd.rot = 0; } }
      if (cd.state === 'in' && g.t - cd.it > 0.3) {
        cd.state = 'gone'; const bug = isBug(cd.k); s.proc = { k: cd.k, bug, t: g.t };
        if (bug) { s.bugs.push({ k: cd.k, t: g.t }); g.sfx(cd.k === 'empty' ? 'rumble' : cd.k === 'long' ? 'crunch' : 'boing'); g.sfx('buzz'); g.shake(3, 0.3); }
        else g.sfx('ding');
      }
    }
    if (!g.done && s.bugs.length >= s.need && g.t - s.bugs[s.bugs.length - 1].t > 0.8) { g.win(); g.sfx('cheer'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, hx = hopX(g, s, t);
    c.drawImage(g.bake('cs_breakit', paintWorkshop), 0, 0, 360, 640);
    // the bug jars along the top: one per bug to find, a beetle in each one found
    const n = s.need, jw = 52; for (let i = 0; i < n; i++) {
      const jx = 180 + (i - (n - 1) / 2) * (jw + 10), jy = 162; c.fillStyle = 'rgba(200,240,255,0.25)'; c.strokeStyle = 'rgba(220,250,255,0.8)'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(jx - jw / 2, jy - 24, jw, 48, 10); c.fill(); c.stroke(); c.fillStyle = '#8a6a4a'; c.fillRect(jx - jw / 2 + 4, jy - 30, jw - 8, 8);
      const b = s.bugs[i]; if (b) { const k = Math.min(1, (t - b.t) / 0.8), bx = SK.lerp(240, jx, SK.easeInOut(k)), by = SK.lerp(380, jy + 4, SK.easeInOut(k)) - Math.sin(k * Math.PI) * 60; beetle(c, bx, by, 1.1, t, ['#5ad06a', '#ff7a5a', '#7ab0ff', '#ffd040'][i % 4]); }
    }
    machine(c, s, t, hx);
    SK.tag(c, 'Sign-up form', 180, 470, 18); SK.tag(c, 'Bugs found', 180, 126, 18);
    // the beaver engineer
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'beaver', 318, 512, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    // the cards
    const dc = SK.dragging(g);
    for (const cd of s.cards) {
      if (cd.state === 'gone' || cd === dc) continue;
      if (cd.state === 'in') { const k = Math.min(1, (t - cd.it) / 0.3); inCard(c, cd.k, SK.lerp(cd.ix, hx, k), HOP.y + k * 30, 1 - k * 0.7, cd.rot, t); continue; }
      inCard(c, cd.k, cd.x, cd.y, cd.state === 'tray' ? s.trayS : 1, cd.rot, t, cd.state !== 'tray');
    }
    if (dc) inCard(c, dc.k, dc.x, dc.y, 1.1, 0, t);
    // levels 0-1, while you drag a card: the arc it would fly on if you let go now (green if it drops into the hopper)
    if (dc && g.level <= 1 && !g.done) { const D = g.s._drag, pts = D.pts, n = pts.length, last = pts[n - 1]; let i = n - 1; while (i > 0 && last.t - pts[i - 1].t < 0.1) i--;
      const dtv = Math.max(1 / 60, last.t - pts[i].t); let vx = (last.x - pts[i].x) / dtv, vy = (last.y - pts[i].y) / dtv; const sp = Math.hypot(vx, vy);
      if (sp >= 250 && vy <= -100) { if (sp > 1400) { vx *= 1400 / sp; vy *= 1400 / sp; } let x = dc.x, y = dc.y, py = y, hit = false; const dots = [];
        for (let k = 0; k < 90; k++) { const h = 1 / 60; vy += GRAV * h; x += vx * h; py = y; y += vy * h; if (k % 3 === 0) dots.push([x, y]); if (py < HOP.y && y >= HOP.y && vy > 0) { hit = Math.abs(x - hx) < HOP.w / 2; break; } if (y > 600) break; }
        c.save(); c.fillStyle = hit ? 'rgba(110,240,130,0.95)' : 'rgba(255,246,234,0.7)'; for (const [px, qy] of dots) { c.beginPath(); c.arc(px, qy, 3, 0, 7); c.fill(); } c.restore(); }
      else SK.tag(c, 'Flick it up!', dc.x, dc.y - 52, 18); }
    // time ran out with bugs still hiding: real users pour in and the machine blows up in garbled letters
    if (lost) { const q = t - g.doneAt; c.save(); c.globalAlpha = Math.max(0, 1 - q * 0.6); c.font = '900 22px monospace'; c.textAlign = 'center'; for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, r = q * 220; c.fillStyle = ['#ff7a8a', '#ffd45a', '#7ee8ff'][i % 3]; c.fillText('□Ã?#'[i % 4], 180 + Math.cos(a) * r, 370 + Math.sin(a) * r * 0.8 + q * q * 80); } c.restore(); }
    // guidance: glow the weird cards; the ghost hand flings the first one into the hopper
    // the hand flings the next weird card still in the tray up at the hopper
    const next = s.cards.find(cd => isBug(cd.k) && cd.state === 'tray');
    if (next && !SK.dragging(g)) { SK.grab(c, g, next.hx, next.hy, 34); SK.target(c, g, hx, HOP.y + 6, 0, { w: HOP.w + 10, h: 36 }); SK.arrow(c, g, next.hx, next.hy - 30, hx, HOP.y + 20); }
    if (next) SK.demo(g, c, 'swipe', [next.hx, next.hy], [SK.lerp(next.hx, hx, 0.15), next.hy - 190], { period: 0.95 }); // a quick flick, about as fast as a throw that lands
  },
  // the bot flings each weird card on an arc that drops into the hopper (B7FAIL: throws only the normal names)
  auto(g, dt, synth) {
    const s = g.s; if (g.done) return; const B = g.s._bot || {}, dur = 0.2, T = 0.85;
    if (s._bp && B[s._bp.key] === 1) { SK.bot.drag(g, synth, s._bp.key, s._bp.t, s._bp.a, s._bp.b, dur); return; }
    if (g.t < (s.nb || 1.0) || SK.dragging(g) || s.cards.some(cd => cd.state === 'fly' || cd.state === 'in')) return;
    const fail = typeof window !== 'undefined' && window.B7FAIL, cd = s.cards.find(c2 => c2.state === 'tray' && (fail ? !isBug(c2.k) : isBug(c2.k))); if (!cd) return;
    const K = 1.2, hx = hopX(g, s, g.t + dur + T), vx = (hx - cd.x) / (T + K * dur), vy = (HOP.y + 4 - cd.y - 0.5 * GRAV * T * T) / (T + K * dur); // the release speed reads about 1/K of the finger's
    s._bp = { key: 'f' + s.throws + '_' + cd.i, t: g.t, a: [cd.x, cd.y], b: [cd.x + vx * dur * K, cd.y + vy * dur * K] }; SK.bot.drag(g, synth, s._bp.key, g.t, s._bp.a, s._bp.b, dur); s.nb = g.t + 0.25;
  },
});
