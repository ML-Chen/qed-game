// DIVIDE! (chem_bio HB-11) — a glowing cell under a fluorescence microscope, each chromosome its own colour. Hold the
// cell to copy every chromosome (each becomes an X); the nucleus melts away and spindle fibres from the two poles line
// the Xs up across the middle. Then swipe sideways to pull them apart: each half of every X goes to its own pole and the
// cell pinches in two, each new cell with one of every colour. Swipe before they are lined up and the halves go
// astray: one new cell gets two of a colour, the other none, and both wilt. Level 2: eight chromosomes, slower to line up.
const CX = 180, CY = 350, R0 = 112, POLE = 128;
const COLS = ['#ff5ab0', '#ffd23a', '#6af07a', '#ff9a3a', '#5ae0ff', '#b07aff', '#ff6a5a', '#e8ecff'];

function paintDark(o) {
  const bg = o.createRadialGradient(180, 340, 30, 180, 340, 420); bg.addColorStop(0, '#1a2a5a'); bg.addColorStop(0.6, '#0e1638'); bg.addColorStop(1, '#060a1e');
  o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  const rnd = P.rng(31);
  for (let i = 0; i < 120; i++) { o.fillStyle = `rgba(140,180,255,${0.05 + rnd() * 0.15})`; o.beginPath(); o.arc(rnd() * 360, rnd() * 640, 0.6 + rnd() * 1.8, 0, 7); o.fill(); }
  // faint neighbouring cells, out of focus
  for (const [x, y, r] of [[30, 150, 70], [340, 560, 90], [320, 170, 50], [40, 560, 60]]) { const g2 = o.createRadialGradient(x, y, r * 0.5, x, y, r); g2.addColorStop(0, 'rgba(90,180,255,0.04)'); g2.addColorStop(0.85, 'rgba(90,200,255,0.14)'); g2.addColorStop(1, 'rgba(90,200,255,0)'); o.fillStyle = g2; o.beginPath(); o.arc(x, y, r, 0, 7); o.fill(); }
  // the microscope's round field of view
  o.strokeStyle = 'rgba(120,160,255,0.12)'; o.lineWidth = 3; o.beginPath(); o.arc(180, 350, 172, 0, 7); o.stroke();
}
// one chromatid: a glowing rounded rod
function rod(c, x, y, a, L, col, alpha = 1) {
  c.save(); c.globalAlpha *= alpha; c.translate(x, y); c.rotate(a);
  c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = P.rgba(col, 0.35); c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, -L / 2); c.lineTo(0, L / 2); c.stroke(); c.restore();
  c.strokeStyle = col; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, -L / 2); c.lineTo(0, L / 2); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-1.5, -L / 2 + 2); c.lineTo(-1.5, L / 2 - 6); c.stroke();
  c.restore();
}
function cellBody(c, pts, r, t, mood) {
  // the union of the (one or two) cell circles: outline first, then fill on top
  c.save();
  for (const [x, y] of pts) { c.save(); c.globalCompositeOperation = 'lighter'; const gl = c.createRadialGradient(x, y, r * 0.8, x, y, r * 1.25); gl.addColorStop(0, 'rgba(80,200,255,0)'); gl.addColorStop(0.5, 'rgba(80,200,255,0.25)'); gl.addColorStop(1, 'rgba(80,200,255,0)'); c.fillStyle = gl; c.beginPath(); c.arc(x, y, r * 1.25, 0, 7); c.fill(); c.restore(); }
  c.fillStyle = '#7ae0ff'; for (const [x, y] of pts) { c.beginPath(); c.arc(x, y, r + 3, 0, 7); c.fill(); }
  for (const [i, [x, y]] of pts.entries()) { const m = mood[i]; const fg = c.createRadialGradient(x - r * 0.3, y - r * 0.3, 4, x, y, r); fg.addColorStop(0, m === 'sad' ? '#3a3a4a' : '#24407a'); fg.addColorStop(1, m === 'sad' ? '#22222e' : '#152a5a'); c.fillStyle = fg; c.beginPath(); c.arc(x, y + (m === 'sad' ? 6 : 0), r - 1 - (m === 'sad' ? 4 : 0), 0, 7); c.fill(); }
  c.restore();
}

MG.add({
  id: 'cells_divide', stage: 'cells', cmd: 'COPY, THEN SPLIT THE CELL!', time: 7, mood: 'sea', winText: 'Mitosis!', failText: 'Mixed up!',
  card: { title: 'One cell becomes two', kind: 'Biology', ref: 'Mitosis',
    text: 'Before a cell divides, it copies every chromosome, the long strands of DNA that carry its genes. Each copy stays joined to its original, making an X shape.\n\nNext, fibres from the two ends of the cell grab every X and line them all up across the middle. The cell checks that every X is attached before it goes on. Then the fibres pull the two halves of each X apart, and the cell pinches in two.\n\nBecause everything was lined up first, each new cell gets exactly one copy of every chromosome.',
    note: 'A cell copies its chromosomes, lines them up and pulls them apart, so both new cells get a full set.' },
  init(g) {
    const s = g.s; s.round = 0; s.rounds = 2; s.press = null; newCell(g); s.appear = -1;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.split >= 0) return; s.press = { x, y, t: g.t, moved: false }; },
  move(g, x, y) { const s = g.s, p = s.press; if (!p) return; if (SK.dist(x, y, p.x, p.y) > 34) p.moved = true; p.cx = x; p.cy = y; },
  up(g, x, y) {
    const s = g.s, p = s.press; s.press = null; if (!p || g.done || s.split >= 0) return;
    const along = s.axis ? Math.abs(y - p.y) : Math.abs(x - p.x), across = s.axis ? Math.abs(x - p.x) : Math.abs(y - p.y); if (along > 60 && along > across) divide(g);
  },
  update(g, dt) {
    const s = g.s;
    // holding still on the cell copies the chromosomes
    if (s.press && !s.press.moved && s.copied < 0 && SK.dist(s.press.x, s.press.y, CX, CY) < R0 + 30) { s.copy = Math.min(1, s.copy + dt / s.holdDur); if (Math.floor(s.copy * 8) !== Math.floor((s.copy - dt / s.holdDur) * 8)) g.sfx('tap'); if (s.copy >= 1) { s.copied = g.t; g.sfx('magic'); } }
    if (s.copied >= 0 && s.lined < 0 && g.t - s.copied > s.lineDur + 0.1) { s.lined = g.t; g.sfx('click'); }
    if (s.split >= 0 && !g.done && g.t - s.split > 0.75) { if (s.ok && s.round < s.rounds - 1) { s.round++; newCell(g); s.appear = g.t; g.sfx('chime'); } else if (s.ok) { g.win(); g.sfx('cheer'); g.burst(CX - 80, CY, COLS.slice(0, 4), 12, 160); g.burst(CX + 80, CY, COLS.slice(0, 4), 12, 160); } else { g.fail(); g.sfx('fail'); g.sfx('laugh'); } }
  },
  draw(g, c) {
    const s = g.s, t = g.t, n = s.n, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('cells_divide_dark', paintDark), 0, 0, 360, 640);
    const sk = s.split >= 0 ? SK.easeInOut((t - s.split) / 0.7) : 0, grow = s.appear >= 0 ? SK.easeOut((t - s.appear) / 0.35) : 1;
    c.save(); c.translate(CX, CY); c.rotate(s.axis * Math.PI / 2); c.scale(grow, grow); c.translate(-CX, -CY);
    const lk = s.copied >= 0 ? SK.clamp((t - s.copied) / s.lineDur, 0, 1) : 0;
    // the two poles and their spindle fibres (they appear once copying is done)
    const poles = [[CX - POLE - sk * 10, CY], [CX + POLE + sk * 10, CY]];
    const plate = i => CY + (i - (n - 1) / 2) * (s.len + (n > 4 ? 4 : 12));
    const cellR = SK.lerp(R0, 74, sk), cells = sk > 0 ? [[CX - 84 * sk, CY], [CX + 84 * sk, CY]] : [[CX, CY]];
    const mood = sk >= 1 ? (s.ok ? ['happy', 'happy'] : ['sad', 'sad']) : ['ok', 'ok'];
    cellBody(c, cells, cellR + (sk > 0 ? 0 : Math.sin(t * 2) * 2), t, mood);
    // cytoplasm specks
    for (let i = 0; i < 16; i++) { const a = t * 0.4 + i * 0.39, r = 40 + (i % 5) * 14; c.fillStyle = 'rgba(160,220,255,0.25)'; c.beginPath(); c.arc(CX + Math.cos(a) * r * (1 + sk * 0.3), CY + Math.sin(a) * r * 0.9, 1.8, 0, 7); c.fill(); }
    // the nucleus envelope, dissolving as the chromosomes line up
    if (lk < 1 && sk === 0) { c.strokeStyle = `rgba(180,200,255,${0.55 * (1 - lk)})`; c.lineWidth = 3; c.setLineDash([10 + lk * 10, 4 + lk * 20]); c.beginPath(); c.arc(CX, CY, 70 + lk * 10, 0, 7); c.stroke(); c.setLineDash([]); }
    if (lk > 0 || sk > 0) {
      for (const p of poles) { c.save(); c.globalCompositeOperation = 'lighter'; const gl = c.createRadialGradient(p[0], p[1], 1, p[0], p[1], 22); gl.addColorStop(0, 'rgba(255,255,210,0.95)'); gl.addColorStop(1, 'rgba(255,255,210,0)'); c.fillStyle = gl; c.beginPath(); c.arc(p[0], p[1], 22, 0, 7); c.fill(); c.restore(); }
    }
    // chromosome positions
    const chromo = s.ch.map((h, i) => {
      const px = SK.lerp(h.x0, CX, SK.easeInOut(lk)), py = SK.lerp(h.y0, plate(i), SK.easeInOut(lk)), a = SK.lerp(h.a0, 0, SK.easeInOut(lk));
      return { px, py, a };
    });
    // spindle fibres to each chromosome's middle
    if (lk > 0 && sk < 1) { c.strokeStyle = `rgba(230,240,255,${0.35 * Math.min(lk * 2, 1) * (1 - sk)})`; c.lineWidth = 1.2; for (const [i, q] of chromo.entries()) for (const [j, p] of poles.entries()) { if (s.copied < 0) continue; const tx = sk > 0 ? SK.lerp(q.px, p[0] + (j ? -30 : 30), sk) : q.px + (j ? 6 : -6); c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(tx, sk > 0 ? q.py : q.py); c.stroke(); } }
    // chromatids
    for (const [i, h] of s.ch.entries()) {
      const q = chromo[i], ca = Math.cos(q.a), sa = Math.sin(q.a), off = 5.5 * Math.min(1, s.copy * 1.3);
      for (const side of [0, 1]) {
        if (side === 1 && (s.copy <= 0 || (s.copy < 1 && sk > 0))) continue;
        const xs = s.copy >= 1 && sk === 0, sx = (side ? off : -off) * (xs ? 0.6 : 1); let x = q.px + ca * sx, y = q.py + sa * sx, a = q.a + (xs ? (side ? -0.3 : 0.3) : 0);
        if (s.copy < 1 && side === 1) { rod(c, x, y, a, s.len * s.copy, h.col, s.copy); continue; }
        if (sk > 0) { // pulled to the pole it was sent to; slot it into the new cell
          const d = h.dest[side], cellC = [CX + (d ? 84 : -84), CY], k = i / n * 6.283 + (side ? 0.3 : 0), rr = n > 4 ? 34 : 26, tx = cellC[0] + Math.cos(k) * rr, ty = cellC[1] + Math.sin(k) * rr;
          x = SK.lerp(x, tx, sk); y = SK.lerp(y, ty, sk); a = SK.lerp(a, k, sk);
        }
        if (s.copy === 0 && side === 0) { x = q.px; y = q.py; }
        rod(c, x, y, a, s.len, h.col);
      }
      if (s.copy > 0 && sk === 0) { c.fillStyle = '#fff'; c.beginPath(); c.arc(q.px, q.py, 3, 0, 7); c.fill(); }
    }
    // arrows showing which way to pull, once lined up (levels 0 and 1)
    if (s.lined >= 0 && s.split < 0 && !g.done && g.level <= 1) { c.save(); c.globalAlpha = 0.5 + 0.3 * Math.sin(t * 6); c.strokeStyle = '#fff6a0'; c.lineWidth = 4; c.lineCap = 'round'; for (const d of [-1, 1]) { c.beginPath(); c.moveTo(CX + d * 30, CY + R0 + 34); c.lineTo(CX + d * 80, CY + R0 + 34); c.lineTo(CX + d * 68, CY + R0 + 24); c.moveTo(CX + d * 80, CY + R0 + 34); c.lineTo(CX + d * 68, CY + R0 + 44); c.stroke(); } c.restore(); }
    c.restore();
    // faces on the new cells: happy with a full set, wilting with a wrong set
    if (sk >= 1) for (const [i, [x0, y0]] of cells.entries()) { const x = s.axis ? CX : x0, y = s.axis ? CY + (i ? 84 : -84) * sk : y0;
      const sad = mood[i] === 'sad', fy = y + 50; c.strokeStyle = '#e8f6ff'; c.fillStyle = '#e8f6ff'; c.lineWidth = 3; c.lineCap = 'round';
      for (const e of [-1, 1]) { if (sad) { c.beginPath(); c.moveTo(x + e * 12 - 5, fy - 4); c.lineTo(x + e * 12 + 5, fy - 4 + e * 2); c.stroke(); } else { c.beginPath(); c.arc(x + e * 12, fy - 4, 3.5, 0, 7); c.fill(); } }
      c.beginPath(); if (sad) c.arc(x, fy + 12, 7, Math.PI + 0.4, -0.4); else c.arc(x, fy + 2, 8, 0.3, Math.PI - 0.3); c.stroke();
    }
    // holding: a ring fills around the cell as it copies
    if (s.copy > 0 && s.copied < 0) { c.strokeStyle = '#fff6a0'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.arc(CX, CY, R0 + 14, -Math.PI / 2, -Math.PI / 2 + s.copy * 6.283); c.stroke(); }
    // the octopus host, peering through the eyepiece edge
    SK.animal(c, 'octopus', 316, 600, 0.6, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    // guidance: hold the cell, then swipe sideways once lined up
    if (s.split < 0) SK.tag(c, 'Chromosomes', CX, CY + R0 + (s.axis ? 70 : 72), 18);
    if (s.copied < 0 && !g.done) { SK.glow(c, g, CX, CY, 60); SK.demo(g, c, 'hold', [CX, CY + 10], null); }
    if (s.lined >= 0 && s.split < 0 && !g.done) SK.demo(g, c, 'swipe', s.axis ? [CX + 60, CY - 50] : [CX - 50, CY + 60], s.axis ? [CX + 60, CY + 80] : [CX + 80, CY + 60], { delay: 0 });
  },
  // the bot: hold until copied, wait for the line-up, then swipe
  auto(g, dt, synth) {
    const s = g.s; if (g.done) return; if (!s._b || s._b.r !== s.round) s._b = { ph: 0, r: s.round }; const B = s._b;
    if (B.ph === 0 && g.t > 0.7 && (s.appear < 0 || g.t - s.appear > 0.4)) { synth('down', CX, CY); B.ph = 1; }
    else if (B.ph === 1 && s.copied >= 0) { synth('up', CX, CY); B.ph = 2; }
    else if (B.ph === 2 && s.lined >= 0) SK.bot.drag(g, synth, 'apart' + s.round, (B.at = B.at ?? g.t + 0.1), s.axis ? [CX + 40, CY - 50] : [CX - 50, CY + 40], s.axis ? [CX + 40, CY + 70] : [CX + 70, CY + 40], 0.18);
  },
});
// a fresh cell for each round: new chromosome positions; the second cell divides top to bottom
function newCell(g) {
  const s = g.s, L = Math.min(2, g.level), n = [4, 6, 8][L];
  s.n = n; s.len = n > 4 ? 22 : 32; s.copy = 0; s.copied = -1; s.lined = -1; s.split = -1; s.axis = s.round % 2;
  s.lineDur = n > 4 ? 1.0 : 0.8; s.holdDur = L >= 2 ? 0.8 : 1.0;
  s.ch = []; for (let i = 0; i < n; i++) { const a = (i + g.rand() * 0.6) / n * 6.283, d = 18 + g.rand() * 36; s.ch.push({ col: COLS[i], x0: CX + Math.cos(a) * d, y0: CY + Math.sin(a) * d * 0.9, a0: g.rand() * 3.14, dest: [0, 1] }); }
  s.ok = true;
}
// pull the chromosomes apart: lined up, each X sends one half to each pole; otherwise they go astray
function divide(g) {
  const s = g.s; s.split = g.t; g.sfx('stretch'); g.sfx('whoosh');
  if (s.lined >= 0) { s.ok = true; for (const h of s.ch) h.dest = [0, 1]; return; }
  s.ok = false;
  if (s.copy < 1) { for (const h of s.ch) { const d = h.x0 < CX ? 0 : 1; h.dest = [d, d]; } s.copy = s.copy > 0 ? s.copy : 0; return; }
  let any = false; for (const h of s.ch) { if (g.rand() < 0.5) { const d = h.x0 < CX ? 0 : 1; h.dest = [d, d]; any = true; } else h.dest = [0, 1]; }
  if (!any) s.ch[0].dest = [1, 1];
}
