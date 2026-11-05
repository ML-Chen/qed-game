// QUAKE-PROOF IT! (build EE EL-18, curriculum command SHAKE!) — a toy table, a pile of sticky wooden blocks and a flag. Drag blocks onto the table to build a
// tower up to the flag; then the table shakes like an earthquake. A tower with a wide base wobbles and stands; a tall
// thin stack tips over and the beaver ducks.
// Tipping is worked out for real: a rigid block tips when the shaking acceleration (as a fraction of gravity) is more
// than (distance from its centre of mass to the base's edge) / (height of its centre of mass).
const SH_U = 50, SH_X0 = 80, SH_COLS = 4, SH_TOP = 470, SH_A = 0.65;
const SH_LV = [{ n: 3, flag: 2 }, { n: 4, flag: 2 }, { n: 5, flag: 3 }]; // a thin stack can always reach the flag too: the tempting way
const SH_Q = 2.0; // seconds of earthquake
const SH_COLS_C = ['#e8563a', '#ffc93a', '#4ab0e0', '#7ac456', '#c87ae0', '#ff8a5a'];
function shPaint(o) {
  B5.vgrad(o, 0, 0, 360, 640, ['#f4d0a0', '#fbe6c4', '#fff4e0']);
  // a cosy workshop wall: planks and a window
  o.strokeStyle = 'rgba(160,110,60,0.18)'; o.lineWidth = 2; for (let y = 40; y < 560; y += 34) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); }
  o.fillStyle = '#9ad0e8'; o.strokeStyle = '#8a5a34'; o.lineWidth = 6; o.beginPath(); o.roundRect(220, 150, 110, 90, 8); o.fill(); o.stroke(); o.lineWidth = 3; o.beginPath(); o.moveTo(275, 150); o.lineTo(275, 240); o.moveTo(220, 195); o.lineTo(330, 195); o.stroke();
  P.cloud(o, 260, 185, 0.35);
  // the floor
  B5.vgrad(o, 0, 548, 360, 92, ['#b07a48', '#9a6a3e', '#8a5a34']);
  o.strokeStyle = 'rgba(70,40,20,0.3)'; o.lineWidth = 2; for (let x = -40; x < 400; x += 60) { o.beginPath(); o.moveTo(x, 548); o.lineTo(x - 30, 640); o.stroke(); }
  P.grain(o, 360, 640, 0.03);
}
function shBlock(c, x, y, col, u = SH_U) { // a toy block with its top-left corner at (x, y)
  c.fillStyle = col; c.strokeStyle = P.shade(col, -0.55); c.lineWidth = 2.5; c.beginPath(); c.roundRect(x + 1, y + 1, u - 2, u - 2, 6); c.fill(); c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.roundRect(x + 6, y + 5, u - 12, 7, 3); c.fill();
  c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 3; c.beginPath(); c.arc(x + u / 2, y + u / 2 + 3, u * 0.18, 0, 7); c.stroke();
}
// the groups of blocks stuck together on the table, each with whether it survives the shaking
function shGroups(s) {
  const seen = new Set(), out = [];
  for (const b of s.placed) { if (seen.has(b)) continue; const grp = [], st = [b]; seen.add(b);
    while (st.length) { const q = st.pop(); grp.push(q); for (const o of s.placed) if (!seen.has(o) && Math.abs(o.c - q.c) + Math.abs(o.r - q.r) === 1) { seen.add(o); st.push(o); } }
    const base = grp.filter(q => q.r === 0), l = Math.min(...base.map(q => q.c)), r = Math.max(...base.map(q => q.c)) + 1;
    const xc = grp.reduce((a, q) => a + q.c + 0.5, 0) / grp.length, hc = grp.reduce((a, q) => a + q.r + 0.5, 0) / grp.length;
    const lean = Math.min(xc - l, r - xc) / hc; // what shaking it can take, as a fraction of gravity
    out.push({ grp, l, r, xc, hc, top: Math.max(...grp.map(q => q.r)) + 1, ok: lean > SH_A, dir: xc - l < r - xc ? -1 : 1 });
  }
  return out;
}
MG.add({
  id: 'shake', stage: 'build', cmd: 'BUILD A QUAKE-PROOF TOWER!', time: 6, mood: 'desert', winText: 'Wide base!', failText: 'Toppled!',
  card: { title: 'Wide towers stand up to shaking', kind: 'Engineering', ref: 'Earthquake design (base width and bracing)',
    text: 'When the ground shakes sideways, it jerks the bottom of a tower one way while the top lags behind. A tall, thin tower then leans so far that its weight moves past the edge of its base, and it tips over.\n\nA tower with a wide base can lean much further before that happens, so it wobbles and stands. Diagonal braces help too, because they stop the frame from bending.\n\nEngineers in earthquake zones give buildings wide, strong bases, cross braces and light tops.',
    note: 'A wide base keeps a tower\'s weight over its feet when the ground shakes, so it does not tip.' },
  init(g) {
    const s = g.s, L = SH_LV[Math.min(2, g.level)]; s.L = L; s.placed = []; s.pile = [];
    for (let i = 0; i < L.n; i++) s.pile.push({ x: 170 - (L.n - 1) * 23 + i * 46, y: 588, col: SH_COLS_C[i % 6], k: i });
    s.held = null; s.shakeT = 0; s.reachT = 0; s.top = 0; s.fall = 0;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.shakeT) return; const b = SK.pick(s.pile, x, y, 40); if (b) { s.held = b; SK.dragStart(g, b, x, y); g.sfx('tap'); } },
  move(g, x, y) { if (g.s.held) SK.dragMove(g, x, y); },
  up(g, x, y) {
    const s = g.s, b = s.held; SK.dragEnd(g); s.held = null; if (!b) return;
    const c = Math.floor((b.x - SH_X0) / SH_U), h = s.placed.filter(q => q.c === c).length;
    if (!s.shakeT && c >= 0 && c < SH_COLS && b.y < SH_TOP + 20 && h < 5) { s.pile = s.pile.filter(q => q !== b); s.placed.push({ c, r: h, col: b.col }); g.sfx('thud'); g.sfx('click');
      s.top = Math.max(s.top, h + 1); if (s.top >= s.L.flag && !s.reachT) { s.reachT = g.t; g.sfx('ding'); } }
    else { b.x = 170 - (s.L.n - 1) * 23 + b.k * 46; b.y = 588; g.sfx('boing'); }
  },
  update(g, dt) {
    const s = g.s;
    if (!s.shakeT) { if ((s.reachT && g.t - s.reachT > 0.45 && !s.held) || (!B5.patient() && g.t > SK.clamp(g.dur * 0.7, 4.5, 9))) { s.shakeT = g.t; s.held = null; SK.dragEnd(g); g.sfx('rumble'); g.sfx('thunder'); g.shake(5, 1.2); s.G = shGroups(s); } return; }
    const k = g.t - s.shakeT;
    if (!g.done && k > 0.5) { const bad = s.G.find(G => !G.ok); if (bad) { s.fall = g.t; g.fail(); g.sfx('crunch'); g.sfx('laugh'); g.shake(4, 0.3); } }
    if (!g.done && k > SH_Q) { if (s.G.some(G => G.ok && G.top >= s.L.flag)) { g.win(); g.sfx('cheer'); } else { g.fail(); g.sfx('wrong'); } }
  },
  draw(g, c) {
    const s = g.s, t = g.t, L = s.L, k = s.shakeT ? t - s.shakeT : 0, quake = s.shakeT && k < SH_Q ? Math.sin(k * 30) * 15 * Math.min(1, k * 4) * Math.min(1, (SH_Q - k) * 3) : Math.sin(t * 40) * 1.2; // a faint rumble warns of the quake to come
    c.drawImage(g.bake('shake_bg', shPaint), 0, 0, 360, 640);
    // the seismograph on the wall: its pen draws the shaking, a little now, a lot in the quake
    const amp = tt => { const kq = tt - (s.shakeT || 1e9); return kq >= 0 && kq < SH_Q ? 16 : 1.5 + Math.sin(tt * 2) * 0.5; };
    c.save(); c.fillStyle = '#6a5a5a'; c.beginPath(); c.roundRect(14, 150, 150, 62, 8); c.fill(); c.fillStyle = '#fffdf4'; c.fillRect(22, 158, 134, 46);
    c.beginPath(); c.rect(22, 158, 134, 46); c.clip(); c.strokeStyle = '#e8403a'; c.lineWidth = 1.6; c.beginPath();
    for (let i = 0; i <= 120; i++) { const tt = t - (120 - i) * 0.025; c.lineTo(22 + i * 1.1, 181 + Math.sin(tt * 37) * amp(tt) * (0.6 + 0.4 * Math.sin(tt * 11))); } c.stroke(); c.restore();
    c.fillStyle = '#3a2a2a'; c.beginPath(); c.arc(154, 181 + Math.sin(t * 37) * amp(t) * (0.6 + 0.4 * Math.sin(t * 11)), 3.5, 0, 7); c.fill();
    // a cup on the window sill rattles along
    const cupj = s.shakeT && k < SH_Q ? Math.sin(t * 50) * 3 : 0; c.save(); c.translate(250 + cupj, 246); c.rotate(cupj * 0.04); c.fillStyle = '#4ab0e0'; c.strokeStyle = '#1e5a80'; c.lineWidth = 2; c.beginPath(); c.moveTo(-9, -16); c.lineTo(9, -16); c.lineTo(7, 0); c.lineTo(-7, 0); c.closePath(); c.fill(); c.stroke(); c.beginPath(); c.arc(11, -9, 4, -1.4, 1.4); c.stroke(); c.restore();
    // the flag marks how tall the tower must be
    const fy = SH_TOP - L.flag * SH_U, reached = s.top >= L.flag;
    c.strokeStyle = '#6a4a3a'; c.lineWidth = 4; c.beginPath(); c.moveTo(316, SH_TOP); c.lineTo(316, fy - 26); c.stroke();
    c.fillStyle = reached ? '#ffd45a' : '#e8403a'; c.beginPath(); c.moveTo(316, fy - 26); c.quadraticCurveTo(334, fy - 22 + Math.sin(t * 5) * 3, 346, fy - 16); c.lineTo(316, fy - 6); c.fill();
    c.save(); c.strokeStyle = 'rgba(232,64,58,0.5)'; c.lineWidth = 2; c.setLineDash([6, 6]); c.beginPath(); c.moveTo(SH_X0 - 6, fy); c.lineTo(316, fy); c.stroke(); c.restore();
    // the table, shaking
    c.save(); c.translate(quake, 0);
    c.fillStyle = '#8a5a34'; for (const lx of [SH_X0 + 4, SH_X0 + SH_COLS * SH_U - 16]) c.fillRect(lx, SH_TOP + 12, 12, 548 - SH_TOP - 12);
    c.fillStyle = '#c48a54'; c.strokeStyle = '#5a3420'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(SH_X0 - 12, SH_TOP, SH_COLS * SH_U + 24, 14, 4); c.fill(); c.stroke();
    // the blocks: each group wobbles (and a weak one tips over its base's edge)
    const groups = s.G || [{ grp: s.placed, l: 0, r: 0, ok: true, dir: 1 }];
    for (const G of groups) {
      let ang = 0, px = 0; if (s.shakeT) { const pv = G.dir > 0 ? G.r : G.l; px = SH_X0 + pv * SH_U;
        ang = G.ok ? Math.sin(k * 30 + 1) * 0.05 * Math.min(1, k * 4) * (k < SH_Q ? 1 : 0) : G.dir * Math.min(1.5, 0.03 + Math.max(0, k - 0.3) ** 2 * 3); }
      c.save(); if (ang) { c.translate(px, SH_TOP); c.rotate(ang); c.translate(-px, -SH_TOP); }
      for (const b of G.grp) shBlock(c, SH_X0 + b.c * SH_U, SH_TOP - (b.r + 1) * SH_U, b.col);
      c.restore();
    }
    c.restore();
    if (s.shakeT && k < SH_Q) { c.save(); c.strokeStyle = 'rgba(90,60,40,0.5)'; c.lineWidth = 3; c.lineCap = 'round'; for (const sd of [-1, 1]) { const x = sd < 0 ? SH_X0 - 26 : SH_X0 + SH_COLS * SH_U + 26; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(x + sd * i * 7, SH_TOP + 10 + i * 24); c.lineTo(x + sd * i * 7, SH_TOP + 26 + i * 24); c.stroke(); } }
      c.fillStyle = 'rgba(200,170,130,0.6)'; for (let i = 0; i < 8; i++) { const q = ((k * 2 + i / 8) % 1), lx = (i % 2 ? SH_X0 + 10 : SH_X0 + SH_COLS * SH_U - 10) + (i % 4 - 1.5) * 10 * q; c.globalAlpha = 1 - q; c.beginPath(); c.arc(lx, 548 - q * 18, 4 + q * 8, 0, 7); c.fill(); } c.restore(); }
    // where a held block will land
    if (s.held) { const col = Math.floor((s.held.x - SH_X0) / SH_U); if (col >= 0 && col < SH_COLS && s.held.y < SH_TOP + 20) { const h = s.placed.filter(q => q.c === col).length; c.save(); c.globalAlpha = 0.35; shBlock(c, SH_X0 + col * SH_U, SH_TOP - (h + 1) * SH_U, s.held.col); c.restore(); } }
    for (const b of s.pile) { if (b !== s.held) shBlock(c, b.x - 20, b.y - 20, b.col, 40); }
    if (s.held) shBlock(c, s.held.x - 25, s.held.y - 25, s.held.col);
    if (!s.held && s.pile.length && !s.shakeT) SK.glow(c, g, s.pile[0].x, s.pile[0].y, 26, '#ffe27a', { level: 2 });
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'beaver', 334, 612, 0.62, { t, facing: -1, pose: won ? 'cheer' : lost ? 'sad' : s.shakeT ? 'balance' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : s.shakeT ? 'wow' : 'happy' });
    // guidance: the next block goes on the lowest of the middle columns, so the base grows wide before the tower grows tall
    const mid = g.level >= 2 ? [0, 1, 2] : [1, 2], hs = mid.map(cc => s.placed.filter(q => q.c === cc).length), cn = mid[hs.indexOf(Math.min(...hs))], hn = Math.min(...hs);
    if (s.pile.length) SK.demo(g, c, 'drag', [s.pile[0].x, s.pile[0].y], [SH_X0 + (cn + 0.5) * SH_U, SH_TOP - (hn + 0.5) * SH_U], { never: !!s.shakeT });
  },
  // the bot builds a wide base first, then the top: (cols 1,2 then 1) or, at level 2, (cols 0,1,2 then 1,1)
  auto(g, dt, synth) {
    const s = g.s, plan = g.level >= 2 ? [0, 1, 2, 1, 1] : [1, 2, 1], B = s._bot = s._bot || {}; const n = B.n || 0; if (n >= plan.length || g.done) return;
    const b = s.pile[0]; if (!b) return; if (!B['t' + n]) { B['t' + n] = Math.max(0.9 + n * 0.32, g.t); B['a' + n] = [b.x, b.y]; }
    if (SK.bot.drag(g, synth, 'k' + n, B['t' + n], B['a' + n], [SH_X0 + (plan[n] + 0.5) * SH_U, SH_TOP - 120], 0.2)) B.n = n + 1;
  },
});
