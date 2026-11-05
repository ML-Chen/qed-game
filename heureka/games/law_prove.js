// PROVE IT! (law LW-42) — a courtroom: the owl judge at the bench, a jury, the fox in the dock, and a big balance.
// The left pan holds the defence's "Doubt" weight; drag evidence blocks (a video, a photo, a fingerprint, a footprint,
// a letter; bigger is stronger) from the evidence table onto the right pan. The beam tips and the dial's needle swings.
// Each case has its own mark on the dial: a civil case is won as soon as the needle tips just past the middle (more
// likely than not), a criminal case only near the top (beyond a reasonable doubt). Past the civil mark in a criminal
// case the jury still shakes its heads. Two cases per game, a civil and a criminal one (in either order). Level 2: the
// table also holds shaky rumour blocks, which wobble and slide off the pan (weak evidence doesn't count). Time out and the
// fox strolls out of the courtroom.
const TAU = Math.PI * 2;
const PIV = [180, 336], BEAM = 112, HANG = 66, TRAY_Y = 560, MARK = { civil: 0.56, criminal: 0.9 };
const KINDS = ['video', 'photo', 'print', 'foot', 'letter'], WT = { video: 0.32, photo: 0.26, print: 0.26, foot: 0.22, letter: 0.22, rumour: 0.2 };
const SLOTS = [[62, TRAY_Y - 26], [180, TRAY_Y - 26], [298, TRAY_Y - 26], [62, TRAY_Y + 14], [180, TRAY_Y + 14], [298, TRAY_Y + 14]];
function paintCourt(o) {
  // a warm wooden courtroom: panelled walls, tall windows, the bench, the jury box and the dock
  const wl = o.createLinearGradient(0, 0, 0, 640); wl.addColorStop(0, '#6a3a2a'); wl.addColorStop(0.5, '#8a5038'); wl.addColorStop(1, '#5a2e20'); o.fillStyle = wl; o.fillRect(0, 0, 360, 640);
  for (let x = 0; x < 360; x += 60) { o.fillStyle = 'rgba(255,220,170,0.07)'; o.fillRect(x + 6, 0, 48, 470); o.strokeStyle = 'rgba(30,10,5,0.3)'; o.lineWidth = 2; o.strokeRect(x + 6, 10, 48, 460); }
  for (const x of [30, 300]) { const wg = o.createLinearGradient(0, 20, 0, 170); wg.addColorStop(0, '#ffe9b0'); wg.addColorStop(1, '#f0b878'); o.fillStyle = wg; o.beginPath(); o.roundRect(x, 20, 30, 150, [15, 15, 2, 2]); o.fill(); o.fillStyle = 'rgba(90,40,20,0.5)'; o.fillRect(x + 14, 20, 2, 150); }
  const lg = o.createRadialGradient(180, 220, 20, 180, 260, 260); lg.addColorStop(0, 'rgba(255,230,170,0.35)'); lg.addColorStop(1, 'rgba(255,230,170,0)'); o.fillStyle = lg; o.fillRect(0, 0, 360, 640);
  // the bench
  const bg = o.createLinearGradient(0, 168, 0, 214); bg.addColorStop(0, '#b0703a'); bg.addColorStop(1, '#6a3a1a'); o.fillStyle = bg; o.beginPath(); o.roundRect(96, 168, 168, 46, 6); o.fill(); o.fillStyle = '#d8984a'; o.fillRect(92, 164, 176, 8);
  o.fillStyle = '#f6c445'; o.beginPath(); o.arc(180, 192, 12, 0, TAU); o.fill(); o.strokeStyle = '#8a5a10'; o.lineWidth = 2; o.stroke();
  // the jury box (left) and the dock (right)
  for (const [x, w] of [[6, 92], [276, 78]]) { const jg = o.createLinearGradient(0, 238, 0, 270); jg.addColorStop(0, '#a86a3a'); jg.addColorStop(1, '#6a3a1a'); o.fillStyle = jg; o.beginPath(); o.roundRect(x, 238, w, 34, 5); o.fill(); o.fillStyle = '#c8884a'; o.fillRect(x - 2, 234, w + 4, 6); }
  // the floor and the evidence table
  const fl = o.createLinearGradient(0, 470, 0, 640); fl.addColorStop(0, '#4a2a1a'); fl.addColorStop(1, '#2a160e'); o.fillStyle = fl; o.fillRect(0, 470, 360, 170);
  o.fillStyle = 'rgba(160,30,40,0.55)'; o.beginPath(); o.moveTo(130, 470); o.lineTo(230, 470); o.lineTo(260, 640); o.lineTo(100, 640); o.closePath(); o.fill();
  o.fillStyle = 'rgba(0,0,0,0.3)'; o.beginPath(); o.ellipse(184, 604, 172, 12, 0, 0, TAU); o.fill();
  const tg = o.createLinearGradient(0, TRAY_Y - 40, 0, TRAY_Y + 44); tg.addColorStop(0, '#c8904a'); tg.addColorStop(1, '#8a5a2a'); o.fillStyle = tg; o.beginPath(); o.roundRect(8, TRAY_Y - 50, 344, 80, 10); o.fill(); o.fillStyle = '#e0a860'; o.fillRect(8, TRAY_Y - 50, 344, 6);
  o.fillStyle = '#5a3018'; o.fillRect(8, TRAY_Y + 30, 344, 12);
  // the balance's stand
  o.fillStyle = '#c8a040'; o.beginPath(); o.moveTo(PIV[0] - 8, PIV[1]); o.lineTo(PIV[0] + 8, PIV[1]); o.lineTo(PIV[0] + 12, 486); o.lineTo(PIV[0] - 12, 486); o.closePath(); o.fill();
  o.beginPath(); o.ellipse(PIV[0], 490, 46, 10, 0, 0, TAU); o.fill(); o.fillStyle = '#e8c860'; o.fillRect(PIV[0] - 3, PIV[1], 3, 150);
  P.grain(o, 360, 640, 0.04); P.vignette(o, 360, 640, 0.35);
}
function evIcon(c, k, w, h) { // the picture on an evidence block
  c.lineWidth = 2; c.strokeStyle = '#3a1640'; c.lineCap = 'round';
  if (k === 'video') { c.fillStyle = '#3a3a4a'; c.beginPath(); c.roundRect(-16, -9, 24, 18, 3); c.fill(); c.beginPath(); c.moveTo(9, -2); c.lineTo(18, -8); c.lineTo(18, 8); c.lineTo(9, 2); c.fill(); c.fillStyle = '#e8403a'; c.beginPath(); c.arc(-10, -4, 2.5, 0, TAU); c.fill(); }
  else if (k === 'photo') { c.fillStyle = '#fff6ea'; c.beginPath(); c.roundRect(-14, -11, 28, 22, 2); c.fill(); c.stroke(); c.fillStyle = '#6ab8e8'; c.fillRect(-11, -8, 22, 12); c.fillStyle = '#5a9a48'; c.beginPath(); c.moveTo(-11, 4); c.lineTo(-3, -4); c.lineTo(6, 4); c.fill(); }
  else if (k === 'print') { c.strokeStyle = '#3a2a5a'; for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse(0, 0, 4 + i * 3.5, 6 + i * 3.5, 0, Math.PI * 0.15, Math.PI * 1.85); c.stroke(); } }
  else if (k === 'foot') { c.fillStyle = '#3a2a2a'; c.beginPath(); c.ellipse(0, 3, 7, 9, 0, 0, TAU); c.fill(); for (const [px, py] of [[-7, -9], [-2, -12], [3, -12], [8, -9]]) { c.beginPath(); c.arc(px, py, 2.6, 0, TAU); c.fill(); } }
  else if (k === 'letter') { c.fillStyle = '#fff6ea'; c.beginPath(); c.rect(-14, -9, 28, 18); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-14, -9); c.lineTo(0, 2); c.lineTo(14, -9); c.stroke(); }
  else { c.fillStyle = '#fff6ea'; c.font = '900 20px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 0, 1); }
}
function block(c, b, x, y, rot) {
  c.save(); c.translate(x, y); c.rotate(rot || 0); const shaky = b.k === 'rumour';
  c.fillStyle = 'rgba(20,10,5,0.35)'; c.beginPath(); c.roundRect(-b.w / 2 + 3, -b.h / 2 + 4, b.w, b.h, 6); c.fill();
  const bg = c.createLinearGradient(0, -b.h / 2, 0, b.h / 2); bg.addColorStop(0, shaky ? '#c8b8d8' : '#fff0c8'); bg.addColorStop(1, shaky ? '#8a7aa0' : '#e0b870'); c.fillStyle = bg; c.beginPath(); c.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 6); c.fill();
  c.strokeStyle = shaky ? '#4a3a6a' : '#8a5a20'; c.lineWidth = 2.5; c.stroke();
  if (shaky) { c.strokeStyle = 'rgba(40,20,60,0.7)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-b.w / 2 + 6, -4); c.lineTo(-6, 2); c.lineTo(0, -6); c.lineTo(b.w / 2 - 5, 6); c.stroke(); }
  evIcon(c, b.k, b.w, b.h); c.restore();
}
function newCase(g) {
  const s = g.s, kind = s.cases[s.ci], L2 = g.level >= 2, ks = SK.shuffled(g, KINDS), set = kind === 'civil' ? ks.slice(0, 4) : [...ks, ks[0]].slice(0, L2 ? 4 : 5);
  if (L2) set.splice(1, 0, 'rumour'), set.push('rumour');
  const slots = SK.shuffled(g, SLOTS.map((p, i) => i));
  s.blocks = set.map((k, i) => { const wt = WT[k], w = Math.round(52 + wt * 60), h = Math.round(22 + wt * 30), [x, y] = SLOTS[slots[i]]; return { k, w, h, wt, x, y, hx: x, hy: y, st: 'tray', at: 0 }; });
  s.E = 0; s.stack = []; s.ph = 'case'; s.at = g.t;
}
function beamAng(E) { return SK.clamp((E - 0.5) * 2, -1, 1) * 0.3; }
function panPos(s, side) { const a = s.ang, ex = PIV[0] + side * Math.cos(a) * BEAM, ey = PIV[1] + side * Math.sin(a) * BEAM; return [ex, ey + HANG]; }
function nextBlock(s) { let best = null; for (const b of s.blocks) if (b.st === 'tray' && b.k !== 'rumour' && (!best || b.wt > best.wt)) best = b; return best; }
MG.add({
  id: 'proveit', stage: 'law', cmd: 'STACK EVIDENCE PAST THE MARK!', time: 9, mood: 'desert', winText: 'Proven!', failText: 'Not proven!',
  card: { title: 'How sure must the court be?', kind: 'Law', ref: 'Burden of proof',
    text: 'In court, the side that brings the case must prove it with evidence. How much evidence it needs depends on the kind of case.\n\nIn a civil case, such as a fight about money or a broken window, the evidence only has to tip the scale just past half: more likely true than not. This is called a preponderance of the evidence.\n\nIn a criminal case, someone could be punished, so the bar is near the top: proof beyond a reasonable doubt. Weak evidence, like a rumour, does not count.\n\nGeneral information about US law, not legal advice.',
    note: 'A civil case needs evidence just past half; a criminal case needs proof beyond a reasonable doubt.' },
  init(g) { const s = g.s, v = SK.variant(g, 4); s.cases = v % 2 ? ['criminal', 'civil'] : ['civil', 'criminal']; s.ci = 0; s.ang = 0; s.ed = 0; s.won = 0; newCase(g); s.ed = 0; },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.ph !== 'case') return; let best = null, bd = 44; for (const b of s.blocks) { if (b.st !== 'tray') continue; const d = SK.dist(x, y, b.x, b.y); if (d < bd) { bd = d; best = b; } } if (best) { best.st = 'drag'; SK.dragStart(g, best, x, y); g.sfx('tap'); } },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g, x, y) {
    const s = g.s, r = SK.dragEnd(g); if (!r || !r.obj) return; const b = r.obj; if (b.st !== 'drag') return;
    const [px, py] = panPos(s, 1), top = py - 8 - s.stack.reduce((a, q) => a + q.h, 0);
    if (s.ph === 'case' && Math.abs(b.x - px) < 74 && b.y > top - 150 && b.y < py + 40) {
      b.st = 'pan'; b.at = g.t; b.off = s.stack.reduce((a, q) => a + q.h, 0) + b.h / 2; s.stack.push(b); g.sfx('thud');
      if (b.k === 'rumour') { b.shake = true; g.sfx('wrong'); } else { s.E += b.wt; g.sfx('click'); }
    } else { b.st = 'back'; b.at = g.t; b.fx = b.x; b.fy = b.y; g.sfx('boing'); }
  },
  update(g, dt) {
    const s = g.s, kind = s.cases[s.ci];
    s.ed += (s.E - s.ed) * Math.min(1, dt * 6); s.ang = beamAng(s.ed);
    for (const b of s.blocks) {
      if (b.st === 'back') { const k = SK.easeOut((g.t - b.at) / 0.25); b.x = SK.lerp(b.fx, b.hx, k); b.y = SK.lerp(b.fy, b.hy, k); if (k >= 1) b.st = 'tray'; }
      if (b.st === 'pan' && b.shake && g.t - b.at > 0.55) { b.st = 'fall'; b.at = g.t; s.stack.splice(s.stack.indexOf(b), 1); let o = 0; for (const q of s.stack) { q.off = o + q.h / 2; o += q.h; } g.sfx('whoosh'); }
    }
    if (s.ph === 'case' && s.ed >= MARK[kind] - 0.004 && s.E >= MARK[kind]) { s.ph = 'gavel'; s.at = g.t; s.won++; g.sfx('drum'); g.shake(4, 0.15); g.burst(PIV[0], 230, ['#ffd45a', '#fff6ea'], 16, 170);
      if (s.won >= s.cases.length && !g.done) { g.win(); g.sfx('cheer'); } else g.sfx('chime'); }
    if (s.ph === 'case' && kind === 'criminal' && s.E >= MARK.civil && !s.shookAt) s.shookAt = g.t;
    if (s.ph === 'gavel' && g.t - s.at > 0.9 && s.won < s.cases.length) { s.ci++; s.shookAt = 0; newCase(g); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, kind = s.cases[s.ci], won = g.result === 'win', lost = g.result === 'fail', lt = lost ? t - g.doneAt : 0, e = t - s.at;
    c.drawImage(g.bake('proveit', paintCourt), 0, 0, 360, 640);
    // the judge, banging the gavel when a case is proven
    const bang = s.ph === 'gavel' ? Math.max(0, 1 - e / 0.25) : 0;
    SK.animal(c, 'owl', 180, 172, 1.05, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : s.ph === 'gavel' ? 'happy' : 'think', noShadow: true });
    c.save(); c.translate(236, 160); c.rotate(-0.9 + (1 - bang) * 0.9 * (s.ph === 'gavel' ? 1 : 0) - (s.ph === 'gavel' ? 0 : 0.0)); c.fillStyle = '#7a4a2a'; c.fillRect(-3, -30, 6, 30); c.fillStyle = '#a86a3a'; c.beginPath(); c.roundRect(-14, -40, 28, 14, 4); c.fill(); c.strokeStyle = '#3a1a0a'; c.lineWidth = 2; c.stroke(); c.restore();
    // the jury: they shake their heads while the evidence falls short of this case's mark, and nod once it is proven
    const shook = s.shookAt && s.ph === 'case' && t - s.shookAt < 1.2;
    ['rabbit', 'duck', 'hedgehog'].forEach((k, i) => { const x = 22 + i * 30, wob = shook || lost ? Math.sin(t * 16 + i) * 5 : 0; SK.animal(c, k, x + wob, 246, 0.5, { t, phase: i, pose: won || s.ph === 'gavel' ? 'cheer' : 'idle', expr: shook || lost ? 'sad' : s.ph === 'gavel' || won ? 'laugh' : 'think', noShadow: true }); });
    // the fox in the dock (strolling out of the door when time runs out)
    const fx = lost ? 316 + SK.clamp(lt / 0.7, 0, 1) * 80 : 316; SK.animal(c, 'fox', fx, 246, 0.62, { t, pose: lost ? 'walk' : s.ph === 'gavel' || won ? 'sad' : 'idle', expr: lost ? 'laugh' : s.ph === 'gavel' || won ? 'wow' : 'happy', facing: lost ? 1 : -1, noShadow: true });
    // the dial: the needle follows the beam; this case's mark glows, the other is dim
    const R = 74, ang = s.ang / 0.3 * 1.15; c.save(); c.translate(PIV[0], PIV[1]);
    c.fillStyle = 'rgba(255,246,234,0.92)'; c.beginPath(); c.arc(0, 0, R, Math.PI, 0); c.closePath(); c.fill(); c.strokeStyle = '#8a5a20'; c.lineWidth = 3; c.stroke();
    const A = E => -Math.PI / 2 + SK.clamp((E - 0.5) * 2, -1, 1) * 1.15;
    c.fillStyle = 'rgba(90,200,120,0.35)'; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, R - 4, A(0), A(s.ed)); c.closePath(); c.fill();
    for (let i = 0; i <= 10; i++) { const a = A(i / 10); c.strokeStyle = '#8a6a4a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(Math.cos(a) * (R - 10), Math.sin(a) * (R - 10)); c.lineTo(Math.cos(a) * (R - 3), Math.sin(a) * (R - 3)); c.stroke(); }
    for (const m of ['civil', 'criminal']) { const a = A(MARK[m]), on = m === kind; c.strokeStyle = on ? (m === 'civil' ? '#2a9a4a' : '#d83a3a') : 'rgba(120,90,60,0.35)'; c.lineWidth = on ? 6 : 3; c.beginPath(); c.moveTo(Math.cos(a) * 14, Math.sin(a) * 14); c.lineTo(Math.cos(a) * (R + 8), Math.sin(a) * (R + 8)); c.stroke(); }
    c.rotate(ang); c.fillStyle = '#3a1640'; c.beginPath(); c.moveTo(-4, 0); c.lineTo(0, -R + 6); c.lineTo(4, 0); c.closePath(); c.fill(); c.restore();
    // the beam and the two pans
    const [lx, ly] = panPos(s, -1), [rx, ry] = panPos(s, 1);
    c.save(); c.translate(PIV[0], PIV[1]); c.rotate(s.ang); c.fillStyle = '#e8c050'; c.strokeStyle = '#8a6010'; c.lineWidth = 2; c.beginPath(); c.roundRect(-BEAM - 6, -6, BEAM * 2 + 12, 12, 6); c.fill(); c.stroke(); c.restore();
    SK.ball(c, PIV[0], PIV[1], 9, '#f6c445');
    for (const [px, py] of [[lx, ly], [rx, ry]]) { c.strokeStyle = '#c8a040'; c.lineWidth = 2; c.beginPath(); c.moveTo(px, py - HANG); c.lineTo(px - 40, py); c.moveTo(px, py - HANG); c.lineTo(px + 40, py); c.stroke(); c.fillStyle = '#d8a83a'; c.beginPath(); c.ellipse(px, py, 46, 9, 0, 0, Math.PI); c.fill(); c.strokeStyle = '#8a6010'; c.stroke(); c.fillStyle = '#f0c860'; c.beginPath(); c.ellipse(px, py, 46, 5, 0, 0, TAU); c.fill(); }
    // the defence's doubt weight on the left pan
    c.fillStyle = '#6a6a7a'; c.beginPath(); c.moveTo(lx - 26, ly); c.lineTo(lx + 26, ly); c.lineTo(lx + 18, ly - 38); c.lineTo(lx - 18, ly - 38); c.closePath(); c.fill(); c.strokeStyle = '#3a3a4a'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#8a8a9a'; c.beginPath(); c.roundRect(lx - 8, ly - 48, 16, 12, 5); c.fill();
    SK.tag(c, 'Doubt', lx, ly + 26, 18); SK.tag(c, 'Evidence', rx, ry + 26, 18);
    // the evidence stacked on the right pan (a rumour block wobbles, then slides off)
    for (const b of s.stack) { const wob = b.shake ? Math.sin((t - b.at) * 30) * 0.12 * SK.clamp((t - b.at) * 3, 0, 1) : 0; block(c, b, rx + (b.shake ? Math.sin((t - b.at) * 30) * 3 : 0), ry - 6 - b.off, wob); }
    for (const b of s.blocks) if (b.st === 'fall') { const k = t - b.at; if (k < 0.8) block(c, b, rx + 30 + k * 120, ry - 30 + k * k * 900, k * 3); }
    // this case's name
    SK.tag(c, kind === 'civil' ? 'Civil case' : 'Criminal case', PIV[0], 286 - R + 8 > 220 ? 222 : 222, 20, kind === 'civil' ? '#b8ffc8' : '#ffc8c8');
    if (shook) SK.tag(c, 'Not enough!', 54, 202, 18, '#ffd0d0');
    // the evidence table
    for (const b of s.blocks) if (b.st === 'tray' || b.st === 'back') block(c, b, b.x, b.y, 0);
    for (const b of s.blocks) if (b.st === 'drag') block(c, b, b.x, b.y, 0);
    G2.count(c, 60, 44, s.won, s.cases.length);
    // guidance: the strongest solid block, the evidence pan, and the arrow between
    const nb = s.ph === 'case' && !g.done ? nextBlock(s) : null;
    if (nb && !SK.dragging(g)) { const tx = rx, ty = ry - 20 - s.stack.reduce((a, q) => a + q.h, 0); SK.grab(c, g, nb.x, nb.y, Math.max(nb.w, nb.h) / 2 + 4); SK.target(c, g, tx, ty, 0, { w: 96, h: 50 }); SK.arrow(c, g, nb.x, nb.y, tx, ty); SK.demo(g, c, 'drag', [nb.x, nb.y], [tx, ty]); }
    else SK.demo(g, c, 'drag', [0, 0], [1, 1], { never: true });
  },
  auto(g, dt, synth) {
    const s = g.s; if (g.done) return;
    if (s._bt) { if (SK.bot.drag(g, synth, s._bt.key, s._bt.t, s._bt.a, s._bt.b, 0.3)) s._bt = null; return; }
    if (s.ph !== 'case' || g.t - s.at < 0.3 || g.t < 1.0) return; const nb = nextBlock(s); if (!nb) return;
    const [rx, ry] = panPos(s, 1); s._bn = (s._bn || 0) + 1;
    s._bt = { key: 'b' + s._bn, t: g.t + 0.15, a: [nb.x, nb.y], b: [rx, ry - 30 - s.stack.reduce((q, z) => q + z.h, 0)] };
  },
});
