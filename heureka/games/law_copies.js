// CATCH COPIES! (law LW-07) — the frog's comic about a space duck hangs at the top. Copycats set up their easels one
// after another. Some traced the frog's exact pages (at level 2, one only changed the colours); others drew their own,
// different space-duck comic. Swipe the copiers away before they run off with their copies, and leave the others be:
// swipe one who drew its own comic and the owl judge drops in and puts it back, because nobody owns the idea of a
// space duck. Copyright protects how an idea is drawn, not the idea.
const TAU = Math.PI * 2, PAGE = { x: 52, y: 150, w: 256, h: 96 }, EASEL = { x: 180, y: 410 }, EW = 270, EH = 100;
const SEQ = [['trace', 'own', 'trace'], ['own', 'trace', 'trace', 'own'], ['trace', 'own', 'recolor', 'trace']];
const WHO = ['rabbit', 'fox', 'hedgehog', 'bird'];
const PAL = { orig: ['#e84a4a', '#f6c445', '#4a8ae8', '#1a1a4a'], recolor: ['#4ab070', '#e870c0', '#f08a3a', '#3a1a2a'] };
function duck(c, x, y, s, col = '#f6d040') { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.beginPath(); c.ellipse(0, 4, 9, 7, 0, 0, TAU); c.fill(); c.beginPath(); c.arc(5, -5, 5.5, 0, TAU); c.fill(); c.fillStyle = '#f08a2a'; c.beginPath(); c.moveTo(9, -5); c.lineTo(15, -3); c.lineTo(9, -1); c.closePath(); c.fill(); c.fillStyle = '#1a1020'; c.beginPath(); c.arc(6, -6, 1.3, 0, TAU); c.fill(); c.restore(); }
// a three-panel comic. 'orig' and 'trace' are identical; 'recolor' is the same drawing in other colours; 'own' is a
// different comic about the same idea (a duck in space)
function comic(c, x, y, w, h, kind, t) {
  const pw = (w - 16) / 3, pal = kind === 'recolor' ? PAL.recolor : PAL.orig;
  c.fillStyle = '#fffdf6'; c.beginPath(); c.roundRect(x, y, w, h, 6); c.fill(); c.strokeStyle = '#3a2440'; c.lineWidth = 2; c.stroke();
  for (let i = 0; i < 3; i++) {
    const px = x + 4 + i * (pw + 4), py = y + 4, ph = h - 8, cx = px + pw / 2, cy = py + ph / 2, k = Math.min(pw, ph) / 80;
    c.save(); c.beginPath(); c.rect(px, py, pw, ph); c.clip();
    c.fillStyle = kind === 'own' ? '#2a3a6a' : pal[3]; c.fillRect(px, py, pw, ph);
    c.fillStyle = 'rgba(255,255,255,0.8)'; for (let j = 0; j < 6; j++) { c.beginPath(); c.arc(px + ((j * 37 + i * 11) % pw), py + ((j * 23 + i * 7) % ph), 1.2, 0, TAU); c.fill(); }
    if (kind !== 'own') {
      if (i === 0) { c.save(); c.translate(cx, cy + 4 * k); c.rotate(0.6); c.fillStyle = pal[0]; c.beginPath(); c.moveTo(0, -26 * k); c.quadraticCurveTo(12 * k, -6 * k, 9 * k, 16 * k); c.lineTo(-9 * k, 16 * k); c.quadraticCurveTo(-12 * k, -6 * k, 0, -26 * k); c.fill(); c.fillStyle = pal[1]; c.beginPath(); c.moveTo(-7 * k, 16 * k); c.lineTo(0, (28 + Math.sin(t * 20) * 3) * k); c.lineTo(7 * k, 16 * k); c.closePath(); c.fill(); c.fillStyle = '#bfe8ff'; c.beginPath(); c.arc(0, -6 * k, 5 * k, 0, TAU); c.fill(); c.restore(); }
      else if (i === 1) { c.fillStyle = pal[1]; c.beginPath(); c.arc(cx, cy + 8 * k, 22 * k, 0, TAU); c.fill(); c.fillStyle = 'rgba(0,0,0,0.15)'; c.beginPath(); c.arc(cx - 8 * k, cy + 4 * k, 5 * k, 0, TAU); c.arc(cx + 8 * k, cy + 14 * k, 4 * k, 0, TAU); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(cx, cy - 14 * k); c.lineTo(cx, cy - 34 * k); c.stroke(); c.fillStyle = pal[0]; c.beginPath(); c.moveTo(cx, cy - 34 * k); c.lineTo(cx + 14 * k, cy - 29 * k); c.lineTo(cx, cy - 24 * k); c.closePath(); c.fill(); }
      else { c.fillStyle = pal[2]; c.beginPath(); for (let j = 0; j < 10; j++) { const a = j * TAU / 10 - Math.PI / 2, r = (j % 2 ? 10 : 24) * k; c.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } c.closePath(); c.fill(); duck(c, cx, cy + 2 * k, 1.3 * k, kind === 'recolor' ? '#a8e0ff' : '#f6d040'); }
    } else {
      if (i === 0) { c.fillStyle = '#9ad050'; c.beginPath(); c.ellipse(cx, cy + 6 * k, 26 * k, 8 * k, 0, 0, TAU); c.fill(); c.fillStyle = '#bfe8ff'; c.beginPath(); c.arc(cx, cy, 11 * k, Math.PI, TAU); c.fill(); duck(c, cx - 2 * k, cy - 2 * k, 0.9 * k); c.fillStyle = '#fff6a0'; for (const d of [-14, 0, 14]) { c.beginPath(); c.arc(cx + d * k, cy + 10 * k, 2 * k, 0, TAU); c.fill(); } }
      else if (i === 1) { c.fillStyle = '#b070d0'; c.beginPath(); c.arc(cx, cy, 16 * k, 0, TAU); c.fill(); c.strokeStyle = '#f0c8ff'; c.lineWidth = 3 * k; c.beginPath(); c.ellipse(cx, cy, 30 * k, 7 * k, -0.3, 0, TAU); c.stroke(); }
      else { c.fillStyle = '#fff'; c.beginPath(); c.moveTo(cx + 26 * k, cy - 22 * k); c.lineTo(cx + 4 * k, cy - 4 * k); c.lineTo(cx + 10 * k, cy - 18 * k); c.closePath(); c.fill(); c.strokeStyle = '#bfe8ff'; c.lineWidth = 2; c.beginPath(); c.arc(cx - 4 * k, cy + 8 * k, 14 * k, 0, TAU); c.stroke(); duck(c, cx - 4 * k, cy + 9 * k, 1.1 * k); }
    }
    c.restore();
  }
}
function paintStudio(o) {
  const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#f0d8b8'); bg.addColorStop(1, '#d8b890'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  o.fillStyle = 'rgba(255,255,255,0.2)'; for (let x = 0; x < 360; x += 40) o.fillRect(x, 0, 20, 300);
  o.fillStyle = '#a87850'; o.fillRect(0, 300, 360, 340); B9.wood(o, 0, 300, 360, 340, '#b88a5a', 7); o.fillStyle = 'rgba(40,20,10,0.25)'; o.fillRect(0, 298, 360, 6);
  // the frog's own page, framed on the wall, with a little fence around it (its copyright)
  o.fillStyle = '#6a3a24'; o.beginPath(); o.roundRect(PAGE.x - 10, PAGE.y - 10, PAGE.w + 20, PAGE.h + 20, 8); o.fill();
  P.grain(o, 360, 640, 0.04); P.vignette(o, 360, 640, 0.3);
}
function easel(c, x, y, kind, t) {
  c.strokeStyle = '#6a3a24'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 70, y + 110); c.lineTo(x - 40, y - 10); c.moveTo(x + 70, y + 110); c.lineTo(x + 40, y - 10); c.moveTo(x, y + 116); c.lineTo(x, y + 40); c.stroke();
  c.fillStyle = '#8a5a3a'; c.fillRect(x - EW / 2 - 6, y + EH / 2 + 6, EW + 12, 8);
  comic(c, x - EW / 2, y - EH / 2, EW, EH, kind, t);
}
MG.add({
  id: 'catchcopies', stage: 'law', cmd: 'CATCH COPIES!', time: 6, mood: 'desert', winText: 'Copyright!', failText: 'Objection!',
  card: { title: 'You own your drawing, not the idea', kind: 'Law', ref: 'Copyright: expression, not ideas (17 U.S.C. 102(b))',
    text: 'Copyright protects a creative work, such as a comic, from the moment it is written down or drawn. The frog owns its own pictures and the way it put them together. Nobody owns the idea of a duck in space.\n\nThe copiers traced the frog\'s pages, and changing only the colours still copies the drawing. The other artists drew their own space-duck comics, which the law allows. Copyright also has exceptions, such as fair use for things like reviews and teaching.\n\nGeneral information about US law, not legal advice.',
    note: 'Copyright protects the way an idea is expressed, not the idea itself.' },
  init(g) {
    const s = g.s; s.seq = SEQ[Math.min(2, g.level)].map((k, i) => ({ kind: k, who: WHO[(i + g.level) % 4], st: 'wait' })); s.i = 0; s.at = 0.4;
    s.dwell = SK.clamp(0.2 * g.dur, 1.6, 4.2); s.kept = [];
  },
  down(g, x, y) { const s = g.s; SK.touched(g); s.sw = { x, y, t: g.t }; },
  move(g, x, y) { if (g.s.sw) g.s.sw.cx = x, g.s.sw.cy = y; },
  up(g, x, y) {
    const s = g.s, w = s.sw; s.sw = null; if (!w || g.done) return; const cp = s.seq[s.i]; if (!cp || cp.st !== 'here') return;
    const dx = x - w.x, dy = y - w.y; if (Math.hypot(dx, dy) < 50 || g.t - w.t > 0.8 || w.y < 300) return;
    if (cp.kind === 'own') { cp.st = 'judge'; cp.at = g.t; g.sfx('whoosh'); return; }
    cp.st = 'swept'; cp.at = g.t; cp.dir = dx >= 0 ? 1 : -1; g.sfx('swoosh'); g.sfx('boing'); g.burst(EASEL.x, EASEL.y, ['#fffdf6', '#e84a4a'], 10, 160);
  },
  update(g, dt) {
    const s = g.s, cp = s.seq[s.i]; if (!cp) return; const e = g.t - s.at;
    if (cp.st === 'wait' && e >= 0) { cp.st = 'in'; cp.at = g.t; g.sfx('pop'); }
    else if (cp.st === 'in' && g.t - cp.at > 0.4) { cp.st = 'here'; cp.at = g.t; }
    else if (cp.st === 'here' && g.t - cp.at > s.dwell) {
      if (cp.kind === 'own') { cp.st = 'stay'; s.kept.push(cp); g.sfx('ding'); s.i++; s.at = g.t + 0.2; }
      else { cp.st = 'escape'; cp.at = g.t; g.sfx('laugh'); }
    }
    else if (cp.st === 'swept' && g.t - cp.at > 0.45) { s.i++; s.at = g.t + 0.1; }
    else if (cp.st === 'escape' && g.t - cp.at > 0.9 && !g.done) g.fail();
    else if (cp.st === 'judge') { const k = g.t - cp.at; if (k > 0.35 && !cp.bonk) { cp.bonk = true; g.sfx('thud'); g.sfx('bell'); g.shake(4, 0.2); } if (k > 1.2 && !g.done) g.fail(); }
    if (!g.done && s.i >= s.seq.length) { g.win(); g.sfx('cheer'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t;
    c.drawImage(g.bake('catchcopies', paintStudio), 0, 0, 360, 640);
    comic(c, PAGE.x, PAGE.y, PAGE.w, PAGE.h, 'orig', t);
    // a little picket fence along the frame: the frog's copyright on its own pages
    c.fillStyle = '#fff6ea'; for (let x = PAGE.x - 8; x <= PAGE.x + PAGE.w + 4; x += 14) { c.beginPath(); c.moveTo(x, PAGE.y + PAGE.h + 26); c.lineTo(x, PAGE.y + PAGE.h + 12); c.lineTo(x + 4, PAGE.y + PAGE.h + 8); c.lineTo(x + 8, PAGE.y + PAGE.h + 12); c.lineTo(x + 8, PAGE.y + PAGE.h + 26); c.closePath(); c.fill(); } c.fillRect(PAGE.x - 8, PAGE.y + PAGE.h + 16, PAGE.w + 16, 4);
    // artists who drew their own comic keep drawing at the sides
    s.kept.forEach((cp, k) => { const x = k ? 318 : 40; c.save(); c.translate(x, 352); c.scale(0.32, 0.32); comic(c, -EW / 2, -EH / 2, EW, EH, 'own', t); c.restore(); SK.animal(c, cp.who, x, 410, 0.6, { t, pose: 'idle', expr: 'happy', phase: k }); });
    const cp = s.seq[s.i];
    if (cp && cp.st !== 'wait') {
      const k = cp.st === 'in' ? SK.easeOut((t - cp.at) / 0.4) : 1; let x = SK.lerp(420, EASEL.x, k), y = EASEL.y, rot = 0;
      if (cp.st === 'swept') { const q = (t - cp.at) / 0.45; x = EASEL.x + cp.dir * q * q * 420; rot = cp.dir * q * 1.2; y -= q * 80; }
      if (cp.st === 'escape') { const q = (t - cp.at) / 0.9; x = EASEL.x - q * 300; }
      c.save(); c.translate(x, y); c.rotate(rot); c.translate(-x, -y);
      if (cp.st !== 'escape') easel(c, x, y, cp.kind, t);
      SK.animal(c, cp.who, x + 92, y + 130, 0.9, { t, pose: cp.st === 'escape' ? 'walk' : cp.st === 'judge' ? 'idle' : 'idle', expr: cp.st === 'escape' ? 'laugh' : cp.st === 'swept' ? 'wow' : 'happy', facing: cp.st === 'escape' ? -1 : -1 });
      c.restore();
      // the copier runs off with a stack of copies
      if (cp.st === 'escape') { const q = (t - cp.at) / 0.9; for (let j = 0; j < 4; j++) { c.save(); c.translate(EASEL.x - q * 300 + 70 - j * 4, EASEL.y + 60 - j * 6); c.rotate(-0.1 + j * 0.05); c.scale(0.32, 0.32); comic(c, -EW / 2, -EH / 2, EW, EH, cp.kind, t); c.restore(); } }
      // the owl judge drops in with its gavel and sets the easel back
      if (cp.st === 'judge') { const q = SK.clamp((t - cp.at) / 0.35, 0, 1); SK.animal(c, 'owl', 74, SK.lerp(250, 560, SK.easeOut(q)), 1.1, { t, pose: 'idle', expr: 'think', noShadow: q < 1 }); c.save(); c.translate(120, SK.lerp(220, 500, SK.easeOut(q))); c.rotate(cp.bonk ? -0.2 + Math.sin(t * 30) * 0.1 : -1); c.fillStyle = '#6a3a24'; c.fillRect(-3, -4, 6, 36); c.fillStyle = '#8a5a3a'; c.beginPath(); c.roundRect(-16, -14, 32, 14, 4); c.fill(); c.restore(); }
    }
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'frog', 304, 290, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    if (cp && cp.st === 'here' && cp.kind !== 'own' && !g.done) SK.glow(c, g, EASEL.x, EASEL.y, 70, '#ffe27a', { level: 0 });
    if (cp && cp.st === 'here' && cp.kind !== 'own') SK.demo(g, c, 'swipe', [EASEL.x - 40, EASEL.y + 10], [EASEL.x + 110, EASEL.y - 10], { delay: 0.6 });
  },
  auto(g, dt, synth) {
    const s = g.s, cp = s.seq[s.i]; if (!cp || cp.st !== 'here' || cp.kind === 'own' || g.done || g.t - cp.at < 0.3) return;
    const Q = s._plan = s._plan || {}; if (Q[s.i] == null) Q[s.i] = g.t;
    SK.bot.drag(g, synth, 'sw' + s.i, Q[s.i], [EASEL.x - 40, EASEL.y + 10], [EASEL.x + 100, EASEL.y - 10], 0.15);
  },
});
