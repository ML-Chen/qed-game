// HIDE KEY! (cs SC-01) — your code is about to be pushed to a public site where a fox-bot sniffs for secrets. Drag the
// secret API key out of the code into the .env safe (the line now reads the key from the environment), drag the safe
// onto the .gitignore list so it stays on your computer, then tap push. The fox-bot finds nothing. Push too early and
// it plucks the key off the public page and spends your money. Level 2: yesterday's push already leaked the old key, so
// also cut a new one. Secrets like API keys must stay out of the code you share.
const PX = 14, PY = 124, PW = 332;
const LV2 = [
  { lines: ['import os', 'key = "sk-9f2c7a"', 'pay(key, 5)'], keys: [1], old: false },
  { lines: ['import os', 'key = "sk-9f2c7a"', 'maps = "mk-41b8"', 'pay(key, 5)'], keys: [1, 2], old: false },
  { lines: ['import os', 'key = "sk-3d7e1b"', 'pay(key, 5)'], keys: [1], old: true },
];
const SAFE0 = { x: 196, y: 372 }, FENCE = { x: 300, y: 372 }, PUSH = { x: 64, y: 548 }, BOARD = { x: 236, y: 540 }, CUTTER = { x: 70, y: 372 };
function strSpan(s, i) { // where the key's text sits on its line (x from, x to)
  const ln = s.lines[i], a = ln.indexOf('"'), b = ln.lastIndexOf('"') + 1; return [s.lay.textX + a * s.lay.charW, s.lay.textX + b * s.lay.charW];
}
function envName(ln) { return ln.startsWith('maps') ? 'MAPS' : 'KEY'; }
function paintDesk(o) {
  const w = o.createLinearGradient(0, 0, 0, 640); w.addColorStop(0, '#2a3a5a'); w.addColorStop(0.5, '#3a5a7a'); w.addColorStop(1, '#2a3a4a'); o.fillStyle = w; o.fillRect(0, 0, 360, 640);
  // your desk (top half) and the public internet (bottom), split by a dashed line
  o.fillStyle = '#7a5a3a'; o.fillRect(0, 410, 360, 12); o.fillStyle = '#5a4028'; o.fillRect(0, 422, 360, 6);
  o.fillStyle = '#1e2a40'; o.fillRect(0, 428, 360, 212);
  const rnd = P.rng(6); for (let i = 0; i < 40; i++) { o.fillStyle = `rgba(120,200,255,${0.06 + rnd() * 0.12})`; o.beginPath(); o.arc(rnd() * 360, 440 + rnd() * 190, 1 + rnd() * 2, 0, 7); o.fill(); }
  o.strokeStyle = 'rgba(120,200,255,0.2)'; o.lineWidth = 1; for (let i = 0; i < 5; i++) { o.beginPath(); o.ellipse(300, 600, 30 + i * 40, 12 + i * 14, 0, Math.PI, 0); o.stroke(); }
}
function safeBox(c, x, y, s, keys, t, tag) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = 'rgba(10,10,20,0.35)'; c.beginPath(); c.roundRect(-34, -28, 72, 64, 8); c.fill();
  c.fillStyle = '#7a8aa0'; c.strokeStyle = '#2a3040'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-36, -32, 72, 62, 8); c.fill(); c.stroke();
  c.fillStyle = '#5a6a80'; c.beginPath(); c.roundRect(-28, -24, 56, 46, 5); c.fill();
  c.save(); c.translate(0, -2); c.rotate(keys * 1.2 + (tag ? 0 : Math.sin(t) * 0.05)); c.fillStyle = '#c8d0dc'; c.beginPath(); c.arc(0, 0, 11, 0, 7); c.fill(); c.strokeStyle = '#2a3040'; c.lineWidth = 2; c.stroke(); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -9); c.stroke(); c.restore();
  for (let i = 0; i < keys; i++) { c.fillStyle = '#ffd45a'; c.beginPath(); c.arc(-18 + i * 9, 16, 3.5, 0, 7); c.fill(); }
  SK.tag(c, 'Secret file', 0, 50, 18);
  if (tag) { c.save(); c.translate(26, -30); c.fillStyle = '#e83a4a'; c.beginPath(); c.arc(0, 0, 11, 0, 7); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 3; c.beginPath(); c.moveTo(-6, 0); c.lineTo(6, 0); c.stroke(); c.restore(); }
  c.restore();
}
function foxBot(c, x, y, t, mood) {
  SK.animal(c, 'fox', x, y, 0.75, { t, pose: mood === 'got' ? 'cheer' : mood === 'none' ? 'sad' : 'walk', expr: mood === 'got' ? 'laugh' : mood === 'none' ? 'think' : 'happy', tint: '#c87a5a', facing: -1 });
  if (mood === 'look') { const a = Math.sin(t * 2.2) * 0.4; c.save(); c.translate(x - 34, y - 40 + Math.sin(t * 3) * 3); c.rotate(a); c.strokeStyle = '#3a3040'; c.lineWidth = 4; c.beginPath(); c.moveTo(8, 8); c.lineTo(18, 18); c.stroke(); c.fillStyle = 'rgba(200,240,255,0.6)'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 10, 0, 7); c.fill(); c.stroke(); c.restore(); } // sniffing the public site with a magnifier
  c.save(); c.translate(x - 6, y - 52); c.fillStyle = '#9aa4b4'; c.strokeStyle = '#3a4050'; c.lineWidth = 2; c.beginPath(); c.roundRect(-14, -12, 28, 12, 4); c.fill(); c.stroke(); c.fillStyle = '#ff5a5a'; c.beginPath(); c.arc(0, -16, 3, 0, 7); c.fill(); c.restore(); // a robot visor and antenna
}
MG.add({
  id: 'cs_hidekey', stage: 'apps', cmd: 'KEEP YOUR KEY SECRET, THEN PUSH!', time: 7, mood: 'party', winText: 'Secret kept!', failText: 'Key leaked!',
  card: { title: 'Keep keys out of your code', kind: 'Computer science', ref: 'Secrets management (.env and .gitignore)',
    text: 'An API key is a secret password that lets your app use a paid service. Anyone who has it can spend your money.\n\nBots scan public code sites all day looking for keys. So the key goes in a separate file, often called .env, and the code reads it from there. The file .gitignore lists files that git must never upload, and .env goes on that list.\n\nIf a key was ever pushed, hiding it later is not enough: copies may already exist. Make a new key and switch the old one off.',
    note: 'Keep secret keys out of shared code: store them in an ignored file, and replace any key that leaked.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level), D = LV2[L]; s.L = L; s.lines = D.lines.slice(); s.keys = D.keys.slice(); s.old = D.old; s.cut = !D.old;
    s.safe = { x: SAFE0.x, y: SAFE0.y, n: 0, ign: false }; s.drag = null; s.push = null; s.res = null;
    const lay = B7.layout({ x: PX, y: PY, w: PW, lines: s.lines }); s.lay = lay; s.panelB = lay.y + lay.h;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.push) return;
    if (SK.dist(x, y, PUSH.x, PUSH.y) < 40) { s.push = { t: g.t }; g.sfx('whoosh'); return; }
    if (s.old && !s.cut && SK.dist(x, y, CUTTER.x, CUTTER.y) < 40) { s.cut = g.t; g.sfx('crunch'); g.sfx('sparkle'); return; }
    for (const i of s.keys) { const [a, b] = strSpan(s, i); if (x > a - 8 && x < b + 8 && Math.abs(y - s.lay.lineY(i)) < s.lay.lineH / 2 + 4) { s.drag = { kind: 'key', i, x, y, txt: s.lines[i].slice(s.lines[i].indexOf('"')) }; g.sfx('tap'); return; } }
    if (!s.safe.ign && s.safe.n > 0 && SK.dist(x, y, s.safe.x, s.safe.y) < 44) { s.drag = { kind: 'safe', ox: s.safe.x - x, oy: s.safe.y - y }; g.sfx('tap'); }
  },
  move(g, x, y) { const s = g.s, d = s.drag; if (!d) return; if (d.kind === 'key') { d.x = x; d.y = y; } else { s.safe.x = x + d.ox; s.safe.y = y + d.oy; } },
  up(g, x, y) {
    const s = g.s, d = s.drag; if (!d) return; s.drag = null;
    if (d.kind === 'key') { if (SK.dist(x, y, s.safe.x, s.safe.y) < 60) { const ln = s.lines[d.i]; s.lines[d.i] = ln.slice(0, ln.indexOf('"')) + `os.getenv("${envName(ln)}")`; s.keys = s.keys.filter(k => k !== d.i); s.safe.n++; s.safe.t = g.t; s.fixT = { i: d.i, t: g.t }; g.sfx('click'); g.sfx('sparkle'); } else g.sfx('swoosh'); return; }
    if (SK.dist(s.safe.x, s.safe.y, FENCE.x, FENCE.y) < 64) { s.safe.ign = g.t; s.safe.x = FENCE.x; s.safe.y = FENCE.y; g.sfx('snap'); } else { s.safe.x = SAFE0.x; s.safe.y = SAFE0.y; }
  },
  update(g, dt) {
    const s = g.s, P0 = s.push; if (!P0 || g.done) return; const e = g.t - P0.t;
    if (e > 1.0 && !P0.scan) { P0.scan = 1; P0.leak = s.keys.length ? 'code' : !s.safe.ign ? 'safe' : s.old && !s.cut ? 'old' : null; g.sfx(P0.leak ? 'laugh' : 'boing'); }
    if (e > 2.0 && !s.res) { if (P0.leak) { s.res = { win: false, t: g.t }; g.sfx('coin'); g.fail(); } else { s.res = { win: true, t: g.t }; g.win(); g.sfx('cheer'); g.burst(180, 380, ['#ffd45a', '#7ee8a0', '#fff'], 18, 150); } }
  },
  draw(g, c) {
    const s = g.s, t = g.t, P0 = s.push, e = P0 ? t - P0.t : -1;
    c.drawImage(g.bake('cs_hidekey', paintDesk), 0, 0, 360, 640);
    B7.panel(c, g, { x: PX, y: PY, w: PW, lines: s.lines, cur: -1, flash: s.b7flash, edit: s.fixT && t - s.fixT.t < 0.6 ? { line: s.fixT.i } : null });
    // the secret keys glow pink inside the code
    for (const i of s.keys) { const [a, b] = strSpan(s, i), ly = s.lay.lineY(i), p = 0.5 + 0.5 * Math.sin(t * 6); c.save(); c.strokeStyle = `rgba(255,120,170,${0.6 + 0.4 * p})`; c.lineWidth = 2.5; c.beginPath(); c.roundRect(a - 4, ly - 13, b - a + 8, 26, 6); c.stroke(); c.restore(); }
    // the .gitignore list: a clipboard with a no-entry sign, where the safe goes to stay home
    c.save(); c.translate(FENCE.x, FENCE.y); c.fillStyle = '#c89a5a'; c.strokeStyle = '#5a3a1a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-40, -44, 80, 92, 8); c.fill(); c.stroke(); c.fillStyle = '#fff6ea'; c.fillRect(-32, -34, 64, 74);
    c.strokeStyle = 'rgba(232,58,74,0.5)'; c.lineWidth = 5; c.beginPath(); c.arc(0, 2, 22, 0, 7); c.moveTo(-15, 17); c.lineTo(15, -13); c.stroke(); c.restore();
    c.fillStyle = '#fff6ea'; c.font = `700 18px ${B7.MONO}`; c.textAlign = 'center'; c.textBaseline = 'middle'; SK.tag(c, "Don't upload", FENCE.x - 10, FENCE.y - 60, 18);
    // the key cutter (level 2): makes a fresh key and switches the leaked one off
    if (s.old) { c.save(); c.translate(CUTTER.x, CUTTER.y); c.fillStyle = s.cut ? '#5a8a6a' : '#8a6aa0'; c.strokeStyle = '#2a2040'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-34, -30, 68, 60, 10); c.fill(); c.stroke(); c.fillStyle = '#ffd45a'; c.beginPath(); c.arc(-10, 0, 9, 0, 7); c.fill(); c.fillRect(-2, -3, 26, 6); c.fillRect(14, 3, 4, 6); c.restore(); }
    SK.tag(c, 'Push', PUSH.x, PUSH.y + 40, 18); if (s.old) SK.tag(c, s.cut ? 'New key made' : 'Make new key', CUTTER.x + 4, CUTTER.y - 48, 18);
    SK.tag(c, 'Your computer', 96, s.panelB + 18, 18); SK.tag(c, 'Public site', BOARD.x, BOARD.y - 82, 18);
    if (s.keys.length) { const [a, b] = strSpan(s, s.keys[0]); SK.tag(c, 'API key', Math.min(300, b + 52), s.lay.lineY(s.keys[0]), 18, '#fff', '#c83a6a'); }
    // the push button (a cloud with an arrow up)
    c.save(); c.translate(PUSH.x, PUSH.y); const pp = P0 ? 0.9 : 1 + Math.sin(t * 5) * 0.03; c.scale(pp, pp); c.fillStyle = '#5ab0ff'; c.strokeStyle = '#1a4a8a'; c.lineWidth = 3; c.beginPath(); c.arc(-14, 4, 16, 0, 7); c.arc(12, 2, 20, 0, 7); c.arc(-2, -12, 18, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#5ab0ff'; c.beginPath(); c.arc(-14, 4, 15, 0, 7); c.arc(12, 2, 19, 0, 7); c.arc(-2, -12, 17, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(0, -14); c.lineTo(11, -2); c.lineTo(4, -2); c.lineTo(4, 12); c.lineTo(-4, 12); c.lineTo(-4, -2); c.lineTo(-11, -2); c.closePath(); c.fill(); c.restore();
    // the public site: a board showing the pushed code
    c.save(); c.translate(BOARD.x, BOARD.y); c.fillStyle = '#f4f0e8'; c.strokeStyle = '#8a8aa0'; c.lineWidth = 3; c.beginPath(); c.roundRect(-76, -64, 152, 104, 10); c.fill(); c.stroke(); c.fillStyle = '#5ab0ff'; c.beginPath(); c.arc(-62, -50, 6, 0, 7); c.fill(); c.restore();
    const shown = P0 && e > 0.6 ? s.lines : s.old ? ['import os', 'key = "sk-77aa01"', 'pay(key, 5)'] : [];
    c.save(); c.beginPath(); c.rect(BOARD.x - 72, BOARD.y - 60, 144, 96); c.clip();
    shown.forEach((ln, i) => { const ly = BOARD.y - 40 + i * 20; c.font = `700 12px ${B7.MONO}`; c.textAlign = 'left'; const q = ln.indexOf('"'); const hot = q >= 0 && !ln.includes('getenv'); c.fillStyle = '#3a3a5a'; c.fillText(ln.slice(0, Math.min(18, hot ? q : ln.length)), BOARD.x - 66, ly); if (hot) { c.fillStyle = s.old && !P0 && s.cut ? '#a0a0a0' : '#e83a5a'; c.fillText(ln.slice(q, q + 11), BOARD.x - 66 + q * 7.2, ly); if (s.cut && s.old && !(P0 && e > 0.6)) { c.strokeStyle = '#3a3a5a'; c.lineWidth = 2; c.beginPath(); c.moveTo(BOARD.x - 66 + q * 7.2, ly); c.lineTo(BOARD.x - 66 + (q + 11) * 7.2, ly); c.stroke(); } } });
    c.restore();
    if (P0 && e > 0.6 && !s.safe.ign) safeBox(c, BOARD.x + 44, BOARD.y + 12, 0.55, s.safe.n, t, false);
    // files flying up to the internet
    if (P0 && e < 0.7) { const k = e / 0.7; for (let i = 0; i < 3; i++) { const q = Math.max(0, Math.min(1, k * 1.4 - i * 0.2)); c.fillStyle = '#fff6ea'; c.strokeStyle = '#5a6a8a'; const x = SK.lerp(180, BOARD.x, q), y = SK.lerp(300, BOARD.y - 20, q) - Math.sin(q * Math.PI) * 50; c.beginPath(); c.roundRect(x - 10, y - 13, 20, 26, 3); c.fill(); c.stroke(); } }
    // the safe (dragged, or home on the ignore list)
    if (s.safe.n > 0 || !s.drag) safeBox(c, s.safe.x, s.safe.y, s.drag && s.drag.kind === 'safe' ? 1.08 : 1, s.safe.n, t, !!s.safe.ign);
    if (s.safe.t && t - s.safe.t < 0.4) { const k = (t - s.safe.t) / 0.4; c.save(); c.globalAlpha = 1 - k; c.strokeStyle = '#ffd45a'; c.lineWidth = 3; c.beginPath(); c.arc(s.safe.x, s.safe.y, 40 + k * 20, 0, 7); c.stroke(); c.restore(); }
    // the fox-bot prowling the public site: grabs a key it finds and spends your money
    const leak = P0 && P0.scan ? P0.leak : null, fx = P0 && e > 0.6 ? SK.lerp(334, BOARD.x + 62, Math.min(1, (e - 0.6) * 3)) : 330 + Math.sin(t * 1.5) * 6;
    foxBot(c, fx, 612, t, leak ? 'got' : P0 && P0.scan ? 'none' : 'look');
    if (leak && e > 1.0) { for (let i = 0; i < 8; i++) { const q = ((e - 1.0) * 1.5 - i * 0.1); if (q < 0 || q > 1) continue; c.fillStyle = '#ffd45a'; c.strokeStyle = '#a07a10'; c.lineWidth = 1.5; const x = SK.lerp(60, fx, q), y = SK.lerp(470, 560, q) - Math.sin(q * Math.PI) * 60; c.beginPath(); c.arc(x, y, 7, 0, 7); c.fill(); c.stroke(); } }
    if (P0 && P0.scan && !leak) { c.save(); c.globalAlpha = Math.min(1, (e - 1) * 3); SK.tag(c, '?', fx - 10, 520, 22); c.restore(); }
    // the key being dragged
    if (s.drag && s.drag.kind === 'key') { c.save(); c.font = `700 19px ${B7.MONO}`; const w = c.measureText(s.drag.txt).width + 18; c.fillStyle = '#ff9ac0'; c.strokeStyle = '#8a2a4a'; c.lineWidth = 2; c.beginPath(); c.roundRect(s.drag.x - w / 2, s.drag.y - 15, w, 30, 8); c.fill(); c.stroke(); c.fillStyle = '#3a1428'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s.drag.txt, s.drag.x, s.drag.y + 1); c.restore(); }
    // guidance: the next step glows and the hand shows it
    if (!P0 && !s.drag) {
      if (s.keys.length) { const i = s.keys[0], [a, b] = strSpan(s, i), ly = s.lay.lineY(i); SK.grab(c, g, (a + b) / 2, ly, 30); SK.target(c, g, s.safe.x, s.safe.y, 44); SK.arrow(c, g, (a + b) / 2, ly, s.safe.x, s.safe.y); SK.demo(g, c, 'drag', [(a + b) / 2, ly], [s.safe.x, s.safe.y]); }
      else if (!s.safe.ign) { SK.grab(c, g, s.safe.x, s.safe.y, 40); SK.target(c, g, FENCE.x, FENCE.y, 0, { w: 90, h: 100 }); SK.arrow(c, g, s.safe.x, s.safe.y, FENCE.x, FENCE.y); SK.demo(g, c, 'drag', [s.safe.x, s.safe.y], [FENCE.x, FENCE.y]); }
      else if (s.old && !s.cut) { SK.glow(c, g, CUTTER.x, CUTTER.y, 40, '#ffe27a', { level: 2 }); SK.demo(g, c, 'tap', [CUTTER.x, CUTTER.y]); }
      else { SK.glow(c, g, PUSH.x, PUSH.y, 40, '#ffe27a', { level: 2 }); SK.demo(g, c, 'tap', [PUSH.x, PUSH.y]); }
    }
  },
  // the bot: keys into the safe, the safe onto the ignore list, a new key at level 2, then push (B7FAIL: pushes at once)
  auto(g, dt, synth) {
    const s = g.s; if (g.done || s.push || g.t < (s.nb || 1.0)) return; s.nb = g.t + 0.5; const fail = typeof window !== 'undefined' && window.B7FAIL;
    const drag = (a, b) => { synth('down', a[0], a[1]); synth('move', (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); synth('move', b[0], b[1]); synth('up', b[0], b[1]); };
    if (fail || (!s.keys.length && s.safe.ign && s.cut)) { synth('down', PUSH.x, PUSH.y); synth('up', PUSH.x, PUSH.y); return; }
    if (s.keys.length) { const i = s.keys[0], [a, b] = strSpan(s, i); drag([(a + b) / 2, s.lay.lineY(i)], [s.safe.x, s.safe.y]); return; }
    if (!s.safe.ign) { drag([s.safe.x, s.safe.y], [FENCE.x, FENCE.y]); return; }
    synth('down', CUTTER.x, CUTTER.y); synth('up', CUTTER.x, CUTTER.y);
  },
});
