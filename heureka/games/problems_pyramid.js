// ANSWER ON TOP! (problems PS-05) — a busy owl boss on a perch glances at your message for just a moment. Build the
// message as a pyramid of blocks: drag each block over the stand and let go, and it drops into the lowest free spot
// below (blocks stack from the bottom up). Facts make the base, Reasons sit on the facts, and the gold Answer goes on
// top. When the pyramid is done the boss's eye dots land on the top block first, then flow down: with the Answer on top
// the boss gets it at a glance and stamps "Yes!". Drop the Answer in early and it ends up buried; the boss's eyes land
// on a fact, it yawns "So what?" and flies off. Level 2: two messages in a row.
const TAU = Math.PI * 2;
const BW = 100, BH = 46, BASE = 470, CX = 180;
const SLOT = [[CX - BW - 2, BASE], [CX, BASE], [CX + BW + 2, BASE], [CX - BW / 2 - 1, BASE - BH - 2], [CX + BW / 2 + 1, BASE - BH - 2], [CX, BASE - 2 * (BH + 2)]]; // 0-2 facts, 3-4 reasons, 5 top
const ROW = i => (i < 3 ? 0 : i < 5 ? 1 : 2), SUP = { 3: [0, 1], 4: [1, 2], 5: [3, 4] };
const TRAY = [[62, 560], [180, 560], [298, 560], [62, 610], [180, 610], [298, 610]];
const COL = { fact: ['#c8c0b8', '#7a7068', 'Fact'], reason: ['#5a9ae8', '#2a5aa8', 'Reason'], answer: ['#f6c445', '#a87a10', 'Answer'] };
function paintRoom(o) {
  const wl = o.createLinearGradient(0, 0, 0, 640); wl.addColorStop(0, '#5ab8e8'); wl.addColorStop(0.55, '#b8e2f2'); wl.addColorStop(1, '#fff2cc'); o.fillStyle = wl; o.fillRect(0, 0, 360, 640);
  P.cloud(o, 70, 150, 0.5); P.cloud(o, 260, 300, 0.4);
  P.hills(o, 360, 520, 18, '#9ad070', '#6aa048', { seed: 2 });
  for (const [x, sc] of [[24, 0.8], [336, 0.7]]) P.tree(o, x, 520, sc);
  o.fillStyle = '#6aa048'; o.fillRect(0, 520, 360, 120);
  // the stand the pyramid sits on, and the boss's perch
  o.fillStyle = 'rgba(30,20,10,0.3)'; o.beginPath(); o.ellipse(CX, BASE + 14, 166, 10, 0, 0, TAU); o.fill();
  const st = o.createLinearGradient(0, BASE, 0, BASE + 14); st.addColorStop(0, '#c8884a'); st.addColorStop(1, '#8a5a2a'); o.fillStyle = st; o.beginPath(); o.roundRect(CX - 160, BASE + 1, 320, 14, 5); o.fill();
  o.strokeStyle = '#8a5a2a'; o.lineWidth = 2; o.beginPath(); o.moveTo(0, 130); o.quadraticCurveTo(140, 175, 280, 140); o.stroke(); for (let i = 0; i < 9; i++) { const x = 14 + i * 30, y = 133 + Math.sin(i / 9 * Math.PI) * 32 - i * 0.6; o.fillStyle = ['#e8563a', '#f6c445', '#3a8ad8', '#3ac86a'][i % 4]; o.beginPath(); o.moveTo(x - 9, y); o.lineTo(x + 9, y); o.lineTo(x, y + 18); o.closePath(); o.fill(); }
  o.fillStyle = '#8a5a2a'; o.fillRect(318, 150, 8, 120); o.fillRect(290, 150, 60, 8);
  // the tray on the grass
  o.fillStyle = 'rgba(255,246,234,0.25)'; o.beginPath(); o.roundRect(8, 514, 344, 104, 16); o.fill();
  P.flowers(o, 360, 528, 616, 14, undefined, 3);
  P.grain(o, 360, 640, 0.035); P.vignette(o, 360, 640, 0.22);
}
function block(c, b, x, y, a = 1, rot = 0) {
  const [f, e, lab] = COL[b.k]; c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot);
  c.fillStyle = 'rgba(20,10,20,0.3)'; c.beginPath(); c.roundRect(-BW / 2 + 3, -BH + 4, BW, BH, 7); c.fill();
  const gr = c.createLinearGradient(0, -BH, 0, 0); gr.addColorStop(0, P.shade(f, 0.25)); gr.addColorStop(1, P.shade(f, -0.1)); c.fillStyle = gr; c.beginPath(); c.roundRect(-BW / 2, -BH, BW, BH, 7); c.fill(); c.strokeStyle = e; c.lineWidth = 2.5; c.stroke();
  if (b.k === 'answer') { c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.ellipse(-BW / 4, -BH + 9, 14, 4, -0.2, 0, TAU); c.fill(); }
  c.fillStyle = b.k === 'fact' ? '#3a2a2a' : '#fff6ea'; c.font = '900 18px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(lab, 0, -BH / 2 + 1); c.restore();
}
function newMsg(g) {
  const s = g.s, ks = SK.shuffled(g, ['fact', 'fact', 'fact', 'reason', 'reason', 'answer']), pos = SK.shuffled(g, TRAY.map((_, i) => i));
  s.blocks = ks.map((k, i) => ({ k, x: TRAY[pos[i]][0], y: TRAY[pos[i]][1], hx: TRAY[pos[i]][0], hy: TRAY[pos[i]][1], st: 'tray', slot: -1 }));
  s.slots = [null, null, null, null, null, null]; s.ph = 'build'; s.at = g.t;
}
// the lowest free slot near x whose supports are filled (blocks drop and stack from the bottom up)
function landing(s, x) { let best = -1, bd = 1e9; for (let i = 0; i < 6; i++) { if (s.slots[i] != null) continue; if (SUP[i] && SUP[i].some(j => s.slots[j] == null)) continue; const d = Math.abs(SLOT[i][0] - x) + ROW(i) * 30; if (Math.abs(SLOT[i][0] - x) < BW && d < bd) { bd = d; best = i; } } return best; }
function wantKind(i) { return i < 3 ? 'fact' : i < 5 ? 'reason' : 'answer'; }
MG.add({
  id: 'answertop', stage: 'problems', cmd: 'BUILD IT WITH THE ANSWER ON TOP!', time: 9.5, mood: 'party', winText: 'Got it at a glance!', failText: 'So what?',
  card: { title: 'Answer first', kind: 'Problem solving', ref: 'The pyramid principle',
    text: 'A busy reader looks at the top of a message first, and may not read much more. So the answer goes on top. The reasons go under it, and the facts that back up each reason go under those.\n\nWith the answer on top, the boss understood the message at a glance and could read down for the reasons. When the answer was buried at the bottom, the boss saw only a fact and asked "so what?"\n\nConsultants build reports, emails and talks this way. It is called the pyramid principle.',
    note: 'Put the answer first, then the reasons, then the facts that support them.' },
  init(g) { const s = g.s; SK.variant(g, 4); s.msgs = g.level >= 2 ? 2 : 1; s.mi = 0; s.won = 0; newMsg(g); },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.ph !== 'build') return; let best = null, bd = 46; for (const b of s.blocks) { if (b.st !== 'tray') continue; const d = SK.dist(x, y, b.x, b.y - BH / 2); if (d < bd) { bd = d; best = b; } } if (best) { best.st = 'drag'; SK.dragStart(g, best, x, y); g.sfx('tap'); } },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, r = SK.dragEnd(g); if (!r || !r.obj) return; const b = r.obj; if (b.st !== 'drag') return;
    const i = b.y < BASE + 30 ? landing(s, b.x) : -1;
    if (i < 0) { b.st = 'back'; b.at = g.t; b.fx = b.x; b.fy = b.y; g.sfx('boing'); return; }
    b.st = 'drop'; b.slot = i; b.at = g.t; b.fx = b.x; b.fy = b.y; s.slots[i] = s.blocks.indexOf(b); g.sfx('whoosh');
  },
  update(g, dt) {
    const s = g.s;
    for (const b of s.blocks) {
      if (b.st === 'back') { const k = SK.easeOut((g.t - b.at) / 0.25); b.x = SK.lerp(b.fx, b.hx, k); b.y = SK.lerp(b.fy, b.hy, k); if (k >= 1) b.st = 'tray'; }
      if (b.st === 'drop') { const k = SK.clamp((g.t - b.at) / 0.22, 0, 1), [sx, sy] = SLOT[b.slot]; b.x = SK.lerp(b.fx, sx, k); b.y = SK.lerp(b.fy, sy, k * k); if (k >= 1) { b.st = 'set'; g.sfx('thud'); } }
    }
    if (s.ph === 'build' && s.blocks.every(b => b.st === 'set')) { s.ph = 'read'; s.at = g.t; s.good = s.blocks[s.slots[5]].k === 'answer' && s.slots.every((bi, i) => s.blocks[bi].k === wantKind(i)); g.sfx(s.good ? 'magic' : 'wrong'); }
    if (s.ph === 'read') { const e = g.t - s.at;
      if (s.good && e > 0.45 && !s.ok) { s.ok = true; s.won++; g.sfx('ding'); g.burst(SLOT[5][0], SLOT[5][1] - 30, ['#ffd45a', '#fff6ea'], 16, 160); if (s.won >= s.msgs && !g.done) { g.win(); g.sfx('cheer'); } }
      if (s.good && e > 1.3 && s.won < s.msgs) { s.ok = false; s.mi++; newMsg(g); }
      if (!s.good && e > 1.0 && !g.done) { g.sfx('laugh'); g.fail(); } }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', e = t - s.at;
    c.drawImage(g.bake('answertop', paintRoom), 0, 0, 360, 640);
    // the pyramid outline: where each kind of block goes
    for (let i = 0; i < 6; i++) { if (s.slots[i] != null) continue; const [x, y] = SLOT[i], k = wantKind(i); c.save(); c.setLineDash([7, 6]); c.lineDashOffset = -t * 12; c.strokeStyle = k === 'answer' ? 'rgba(200,140,10,0.9)' : 'rgba(255,255,255,0.75)'; c.lineWidth = 3; c.beginPath(); c.roundRect(x - BW / 2, y - BH, BW, BH, 7); c.stroke(); c.restore();
      if (k === 'answer') { c.fillStyle = 'rgba(246,196,69,0.25)'; c.beginPath(); c.roundRect(x - BW / 2, y - BH, BW, BH, 7); c.fill(); } }
    // blocks: in the tray, being dragged, dropping, or set (the set ones wobble and fall when the boss walks off)
    const fallK = lost ? SK.clamp((t - g.doneAt) / 0.6, 0, 1) : 0;
    for (const b of s.blocks) if (b.st === 'set' || b.st === 'drop') block(c, b, b.x + fallK * (b.slot % 2 ? 30 : -30) * ROW(b.slot), b.y + fallK * fallK * 120 * (ROW(b.slot)), 1, fallK * (b.slot % 2 ? 0.5 : -0.5) * ROW(b.slot));
    for (const b of s.blocks) if (b.st === 'tray' || b.st === 'back') block(c, b, b.x, b.y);
    for (const b of s.blocks) if (b.st === 'drag') { const i = landing(s, b.x); if (i >= 0 && b.y < BASE + 30) { const [lx, ly] = SLOT[i]; c.save(); c.globalAlpha = 0.4; c.strokeStyle = '#fff6ea'; c.lineWidth = 2; c.setLineDash([4, 5]); c.beginPath(); c.moveTo(b.x, b.y); c.lineTo(lx, ly - BH / 2); c.stroke(); c.restore(); block(c, b, lx, ly, 0.35); } block(c, b, b.x, b.y); }
    // the owl boss on its perch; its eye dots read the pyramid from the top block down
    const fly = lost ? SK.clamp((t - g.doneAt - 0.2) / 0.8, 0, 1) : 0;
    SK.animal(c, 'owl', 322 + fly * 80, 152 - fly * 60, 0.9, { t, pose: won || (s.ph === 'read' && s.good) ? 'cheer' : lost ? 'hop' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : s.ph === 'read' ? 'wow' : 'think', facing: -1, noShadow: true });
    if (s.ph === 'read') { const order = s.good ? [5, 3, 4, 0, 1, 2] : [5]; order.forEach((si, n) => { const k = SK.clamp((e - n * 0.09) / 0.4, 0, 1); if (k <= 0) return; const fade = 1 - SK.clamp((e - n * 0.09 - 0.55) / 0.35, 0, 1); if (fade <= 0) return; c.globalAlpha = fade; const [sx, sy] = SLOT[si]; for (let d = 0; d < 3; d++) { const x = SK.lerp(306, sx - 20 + d * 20, k), y = SK.lerp(116, sy - BH / 2, k) - Math.sin(k * Math.PI) * 30; c.fillStyle = 'rgba(58,22,64,0.85)'; c.beginPath(); c.arc(x, y, 4.5, 0, TAU); c.fill(); c.fillStyle = '#fff6ea'; c.beginPath(); c.arc(x - 1.2, y - 1.2, 1.5, 0, TAU); c.fill(); } c.globalAlpha = 1; }); }
    if (s.ph === 'read' && s.good && e > 0.45) SK.tag(c, 'Yes!', 300, 196, 20, '#b8ffc8'); if (s.ph === 'read' && !s.good && e > 0.4) SK.tag(c, 'So what?', 290, 196, 20, '#ffd0d0');
    SK.tag(c, 'Boss', 322, 220, 18);
    if (s.msgs > 1) G2.count(c, 60, 44, s.won, s.msgs);
    // guidance: the next block to drop (from the bottom row up) and where it lands
    let next = null, ti = -1; if (s.ph === 'build' && !g.done) { for (let i = 0; i < 6; i++) if (s.slots[i] == null && !(SUP[i] && SUP[i].some(j => s.slots[j] == null))) { ti = i; break; } if (ti >= 0) next = s.blocks.find(b => b.st === 'tray' && b.k === wantKind(ti)); }
    if (next && !SK.dragging(g)) { const [tx, ty] = SLOT[ti]; SK.grab(c, g, next.x, next.y - BH / 2, 34); SK.target(c, g, tx, ty - BH / 2, 0, { w: BW + 6, h: BH + 6 }); SK.arrow(c, g, next.x, next.y - BH / 2, tx, ty - BH / 2); SK.demo(g, c, 'drag', [next.x, next.y - BH / 2], [tx, ty - BH / 2 - 30]); }
    else SK.demo(g, c, 'drag', [0, 0], [1, 1], { never: true });
  },
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < 1.0) return;
    if (s._bt) { if (SK.bot.drag(g, synth, s._bt.key, s._bt.t, s._bt.a, s._bt.b, 0.3)) s._bt = null; return; }
    if (s.ph !== 'build' || s.blocks.some(b => b.st === 'drop' || b.st === 'back')) return; let ti = -1; for (let i = 0; i < 6; i++) if (s.slots[i] == null && !(SUP[i] && SUP[i].some(j => s.slots[j] == null))) { ti = i; break; } if (ti < 0) return;
    const b = s.blocks.find(q => q.st === 'tray' && q.k === wantKind(ti)); if (!b) return; s._bn = (s._bn || 0) + 1;
    s._bt = { key: 'p' + s._bn, t: g.t + 0.1, a: [b.x, b.y - BH / 2], b: [SLOT[ti][0], SLOT[ti][1] - BH / 2 - 30] };
  },
});
