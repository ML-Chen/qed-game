// WAIT FOR IT! (space EE EL-07) — an owl on a branch wants a full Moon to hunt by, and tonight's Moon is a thin sliver.
// Hold to let the nights pass: the Moon grows a little each night (lit from the right as it waxes) until it is round and
// bright, then shrinks again (the left side lit as it wanes). Let go on the full Moon and the owl swoops off over the
// moonlit meadow. Let go on a half Moon and it squints into the gloom and bumps a branch. Catch two full Moons in a row
// (three at level 2, where the nights pass faster and "full" is a shorter moment).
const WF_M = [232, 214], WF_MR = 46, WF_MONTH = 29.53;
const WF_LV = [{ need: 2, night: 0.1, win: 1.6 }, { need: 2, night: 0.09, win: 1.3 }, { need: 3, night: 0.062, win: 1.1 }];
function wfPaint(o) {
  B5.vgrad(o, 0, 0, 360, 640, ['#0a0c2a', '#1c1c4a', '#2e2a5e', '#3a3468']);
  // hills and a meadow
  o.fillStyle = '#1e2a3a'; o.beginPath(); o.moveTo(0, 470); for (let x = 0; x <= 360; x += 8) o.lineTo(x, 440 - 24 * Math.sin(x / 60 + 1) - 8 * Math.sin(x / 17)); o.lineTo(360, 640); o.lineTo(0, 640); o.fill();
  B5.vgrad(o, 0, 470, 360, 170, ['#2a4a3a', '#1e3a2e', '#142a22']);
  P.grassTufts(o, 360, 480, 620, 50, '#2e5a3e', 14);
  // the owl's tree on the left
  o.fillStyle = '#2a1e1e'; o.beginPath(); o.moveTo(30, 640); o.lineTo(44, 300); o.lineTo(64, 300); o.lineTo(72, 640); o.fill();
  o.strokeStyle = '#2a1e1e'; o.lineCap = 'round'; o.lineWidth = 12; o.beginPath(); o.moveTo(56, 420); o.quadraticCurveTo(100, 410, 150, 418); o.stroke();
  o.lineWidth = 6; o.beginPath(); o.moveTo(52, 330); o.lineTo(14, 290); o.moveTo(58, 350); o.lineTo(110, 300); o.moveTo(120, 416); o.lineTo(140, 396); o.stroke();
  o.fillStyle = '#1e3a2a'; for (const [x, y, r] of [[20, 286, 30], [60, 290, 36], [108, 296, 28], [40, 320, 26]]) { o.beginPath(); o.arc(x, y, r, 0, 7); o.fill(); }
}
// the Moon at a given age (days since new Moon): the lit part shown exactly as it looks from the northern hemisphere
function wfMoon(c, x, y, r, age) {
  const ph = (age % WF_MONTH) / WF_MONTH * Math.PI * 2, wax = ph <= Math.PI, a = wax ? ph : Math.PI * 2 - ph, rx = r * Math.cos(a), lit = (1 - Math.cos(ph)) / 2;
  c.save(); c.globalCompositeOperation = 'lighter'; const gl = c.createRadialGradient(x, y, r * 0.8, x, y, r * 3); gl.addColorStop(0, `rgba(220,230,255,${0.35 * lit})`); gl.addColorStop(1, 'rgba(220,230,255,0)'); c.fillStyle = gl; c.beginPath(); c.arc(x, y, r * 3, 0, 7); c.fill(); c.restore();
  c.fillStyle = '#2a2a48'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); // the dark part (earthshine)
  c.save(); c.translate(x, y); if (!wax) c.scale(-1, 1);
  c.beginPath(); c.moveTo(0, -r); c.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
  if (rx >= 0) c.ellipse(0, 0, Math.max(0.01, rx), r, 0, Math.PI / 2, -Math.PI / 2, true); else c.ellipse(0, 0, -rx, r, 0, Math.PI / 2, Math.PI * 1.5, false);
  c.closePath(); const mg = c.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r); mg.addColorStop(0, '#fffdf0'); mg.addColorStop(1, '#e0dcc8'); c.fillStyle = mg; c.fill();
  c.clip(); c.fillStyle = 'rgba(170,165,150,0.45)'; for (const [dx, dy, rr] of [[-0.3, -0.2, 0.18], [0.25, 0.2, 0.14], [0.1, -0.45, 0.1], [-0.15, 0.4, 0.12], [0.45, -0.1, 0.09]]) { c.beginPath(); c.arc(dx * r * (wax ? 1 : -1), dy * r, rr * r, 0, 7); c.fill(); }
  c.restore();
  c.strokeStyle = 'rgba(255,255,240,0.25)'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
}
MG.add({
  id: 'waitforit', stage: 'space', cmd: 'LET GO ON THE FULL MOON!', time: 6, mood: 'night', winText: 'Full Moon!', failText: 'Bonk!',
  card: { title: 'The Moon\'s phases', kind: 'Astronomy', ref: 'Lunar phases',
    text: 'The Moon makes no light of its own. The Sun always lights half of it, and as the Moon travels around the Earth we see different amounts of that sunlit half.\n\nNight by night the bright part grows from a thin crescent to a half Moon to a full, round Moon. Then it shrinks again, from the other side, back to nothing. One whole cycle takes about 29 and a half days, roughly a month.\n\nAt full Moon, the Moon is on the far side of the Earth from the Sun, so we see all of its lit face.',
    note: 'The Moon\'s shape changes night by night because we see different amounts of its sunlit half. The cycle takes about a month.' },
  init(g) { const s = g.s; s.L = WF_LV[Math.min(2, g.level)]; s.age = 3; s.got = 0; s.swoopT = 0; s.bonkT = 0; s.hold = false; s.spin = 0; },
  down(g) { const s = g.s; SK.touched(g); if (g.done || (s.swoopT && g.t - s.swoopT < 1.0)) return; s.hold = true; s.t0 = g.t; s.a0 = s.age; g.sfx('magic'); },
  up(g) {
    const s = g.s; if (!s.hold) return; s.hold = false; if (g.done || s.age - s.a0 < 0.6) return; // a quick tap lets no nights pass
    const d = Math.abs(((s.age % WF_MONTH) + WF_MONTH) % WF_MONTH - WF_MONTH / 2);
    if (d <= s.L.win) { s.got++; s.swoopT = g.t; g.sfx('whoosh'); g.sfx('chime'); if (s.got >= s.L.need) { g.win(); g.sfx('cheer'); } }
    else { s.bonkT = g.t; g.sfx('thud'); g.sfx('laugh'); g.shake(4, 0.3); g.fail(); }
  },
  update(g, dt) { const s = g.s; if (s.hold && !g.done) { s.age += dt / s.L.night; s.spin += dt / s.L.night * 0.4; } },
  draw(g, c) {
    const s = g.s, t = g.t, lit = (1 - Math.cos((s.age % WF_MONTH) / WF_MONTH * Math.PI * 2)) / 2;
    c.drawImage(g.bake('waitforit_bg', wfPaint), 0, 0, 360, 640);
    // the stars wheel round as the nights fly past
    c.save(); c.translate(180, 700); c.rotate(-s.spin); c.fillStyle = '#fff6e0'; const r = P.rng(4);
    for (let i = 0; i < 90; i++) { const a = r() * 6.28, d = 250 + r() * 520, x = Math.cos(a) * d, y = Math.sin(a) * d, tw = 0.5 + 0.5 * Math.sin(t * 3 + i); c.globalAlpha = 0.4 + 0.5 * tw; c.beginPath(); c.arc(x, y, 0.8 + r() * 1.4, 0, 7); c.fill(); }
    c.restore(); c.globalAlpha = 1;
    wfMoon(c, WF_M[0], WF_M[1], WF_MR, s.age);
    // moonlight on the meadow, and the mouse it shows up
    const mlg = c.createLinearGradient(0, 410, 0, 500); mlg.addColorStop(0, 'rgba(200,215,255,0)'); mlg.addColorStop(1, `rgba(200,215,255,${0.28 * lit})`); c.fillStyle = mlg; c.fillRect(0, 410, 360, 230);
    const mx = 250 + Math.sin(t * 1.3) * 30, my = 556; c.globalAlpha = 0.25 + 0.75 * lit; c.fillStyle = '#b8a898'; c.beginPath(); c.ellipse(mx, my, 12, 7, 0, 0, 7); c.fill(); c.beginPath(); c.arc(mx + 10, my - 5, 5, 0, 7); c.fill(); c.strokeStyle = '#b8a898'; c.lineWidth = 2; c.beginPath(); c.moveTo(mx - 12, my); c.quadraticCurveTo(mx - 24, my - 8, mx - 28, my + 2); c.stroke(); c.globalAlpha = 1;
    // the owl: perched; swooping off over the meadow after a full Moon; bumping a branch in the gloom after a wrong one
    const won = g.result === 'win', lost = g.result === 'fail';
    let ox = 100, oy = 412, rot = 0, pose = s.hold ? 'idle' : 'idle', expr = s.hold ? 'think' : 'happy';
    if (s.swoopT && t - s.swoopT < 1.0) { const k = (t - s.swoopT) / 1.0; ox = 100 + Math.sin(k * Math.PI) * 160; oy = 412 + Math.sin(k * Math.PI) * 130 - k * 0; rot = Math.cos(k * Math.PI) * 0.4; pose = 'cheer'; expr = 'laugh'; }
    if (s.bonkT) { const k = Math.min(1, (t - s.bonkT) / 0.35); ox = 100 + k * 34; oy = 412 - k * 40; pose = 'sad'; expr = 'wow'; }
    if (won && !(s.swoopT && t - s.swoopT < 1.0)) { pose = 'cheer'; expr = 'laugh'; }
    c.save(); c.translate(ox, oy); c.rotate(rot); SK.animal(c, 'owl', 0, 0, 0.85, { t, pose, expr, noShadow: true }); c.restore();
    if (s.bonkT) { const k = (t - s.bonkT) * 6; c.fillStyle = '#ffd45a'; for (let i = 0; i < 3; i++) B5.star(c, ox + Math.cos(k + i * 2.1) * 22, oy - 70 + Math.sin(k + i * 2.1) * 6, 6); }
    // how many full Moons to catch: little moons along the top
    for (let i = 0; i < s.L.need; i++) { const x = 180 + (i - (s.L.need - 1) / 2) * 34; c.fillStyle = i < s.got ? '#fff6d0' : 'rgba(255,255,255,0.18)'; c.beginPath(); c.arc(x, 146, 11, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 2; c.stroke(); }
    if (!s.hold && !g.done) SK.glow(c, g, WF_M[0], WF_M[1], WF_MR + 12, '#e8f0ff', { level: 2 });
    // what holding does, and while holding, how close the Moon is to full: a dashed ring that turns green in the full window
    if (!g.done) { const d = Math.abs(((s.age % WF_MONTH) + WF_MONTH) % WF_MONTH - WF_MONTH / 2), full = d <= s.L.win;
      if (!s.hold) SK.tag(c, 'Hold: nights pass', WF_M[0] - 20, WF_M[1] + WF_MR + 30, 18);
      else { c.save(); c.strokeStyle = full ? '#7aff9a' : 'rgba(255,246,234,0.6)'; c.lineWidth = full ? 4 : 2.5; c.setLineDash([6, 6]); c.lineDashOffset = -t * 20; c.beginPath(); c.arc(WF_M[0], WF_M[1], WF_MR + 8, 0, 7); c.stroke(); c.restore();
        SK.tag(c, full ? 'Let go!' : 'Not full yet', WF_M[0] - 20, WF_M[1] + WF_MR + 30, 18, full ? '#8affa8' : '#fff6ea'); } }
    SK.demo(g, c, 'hold', [WF_M[0], WF_M[1] + 4], null, { period: 2.4, never: !!(s.swoopT && t - s.swoopT < 1.0) || s.hold });
  },
  // the bot holds until the Moon is full, lets go, waits for the owl, and holds again
  auto(g, dt, synth) {
    const s = g.s, B = s._bot = s._bot || {}; if (g.done || g.t < 0.9) return;
    if (!s.hold) { if (!s.swoopT || g.t - s.swoopT > 1.05) synth('down', WF_M[0], WF_M[1]); return; }
    const d = ((s.age % WF_MONTH) + WF_MONTH) % WF_MONTH - WF_MONTH / 2; if (s.age - s.a0 > 0.6 && Math.abs(d) < 0.3) synth('up', WF_M[0], WF_M[1]);
  },
});
