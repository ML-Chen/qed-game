// ORIENT! (hardware MK-07) — a 3D printer below, a wall above where the printed part will go to work, the turtle napping
// underneath. A printer always stacks its layers flat, bottom to top, and a printed part is weakest between layers.
// The part (a shelf peg, or a hanging rod for a lamp) starts standing up on the bed, so its layer lines (drawn on it)
// cross it like a stack of pancakes. Drag round it to lay it down until the lines run along its length (it turns
// green), press Print, and the part goes up on the wall and takes its load: the pot sits on the peg, the lamp hangs
// from the rod. Printed standing up, it snaps cleanly between two layers and the pot lands on the turtle.
// Level 0-1: two parts. Level 2: three.
const OR = (() => {
  const BED = 500, PIV = [180, 430], BTN = { x: 180, y: 570, w: 200, h: 58 }, LEN = 150, TH = 26, OKA = 20 * Math.PI / 180;
  const KINDS = { Peg: { col: '#3a9ae8', use: 0, load: 'pot' }, Rod: { col: '#e8803a', use: Math.PI / 2, load: 'lamp' } };
  const SETS = [[['Peg', 90], ['Rod', 70], ['Peg', 115]], [['Rod', 90], ['Peg', 120], ['Rod', 60]], [['Peg', 60], ['Rod', 110], ['Peg', 90]], [['Rod', 75], ['Peg', 90], ['Rod', 105]]];
  // the part's outline in its own frame: a bar along +x with a wall plate (peg) or a ring (rod) at x = 0
  function shape(kind) { const h = TH / 2; return kind === 'Peg' ? [[-8, -34], [6, -34], [6, -h], [LEN, -h], [LEN, h], [6, h], [6, 34], [-8, 34]] : [[0, -h], [LEN, -h], [LEN, h], [0, h]]; }
  const rot = (pts, a) => pts.map(([x, y]) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]);
  // on the bed at angle a (screen, y down; a = 0 lies flat), resting on its lowest point, centred
  function onBed(kind, a) { const r = rot(shape(kind), -a); let x0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of r) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return r.map(([x, y]) => [x - (x0 + x1) / 2 + 180, y - y1 + BED]); }
  const strong = a => Math.abs(Math.sin(a)) < Math.sin(OKA);
  function poly(c, pts) { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); }
  // layer lines: horizontal on the bed; on the wall they turn with the part
  function layers(c, pts, ang, cx, cy, col) { c.save(); poly(c, pts); c.clip(); c.translate(cx, cy); c.rotate(ang); c.strokeStyle = col; c.lineWidth = 1.6; for (let y = -200; y <= 200; y += 7) { c.beginPath(); c.moveTo(-220, y); c.lineTo(220, y); c.stroke(); } c.restore(); }
  function paint(o) {
    N4.vgrad(o, 0, 0, 360, 340, ['#f2e2c8', '#f8eedc']); o.fillStyle = 'rgba(160,120,80,0.12)'; for (let x = 0; x < 360; x += 24) o.fillRect(x, 0, 2, 340);
    o.fillStyle = '#c8a070'; o.fillRect(0, 326, 360, 14); o.fillStyle = '#8a6a48'; o.fillRect(0, 340, 360, 10);
    // the turtle's rug
    o.fillStyle = '#d86a6a'; o.beginPath(); o.ellipse(250, 322, 70, 9, 0, 0, 7); o.fill();
    // the printer below
    N4.vgrad(o, 0, 350, 360, 290, ['#2a3442', '#3a4656', '#2a3240']);
    o.fillStyle = '#1a1e26'; o.fillRect(22, 356, 12, 160); o.fillRect(326, 356, 12, 160);
    const bg = o.createLinearGradient(0, BED, 0, BED + 16); bg.addColorStop(0, '#8a9aa8'); bg.addColorStop(1, '#5a6a78'); o.fillStyle = bg; o.fillRect(34, BED, 292, 16); o.fillStyle = '#1a1e26'; o.fillRect(22, BED + 16, 316, 22);
    P.grain(o, 360, 640, 0.025);
  }
  return { BED, PIV, BTN, LEN, TH, KINDS, SETS, shape, rot, onBed, strong, poly, layers, paint };
})();
MG.add({
  id: 'build_orient', stage: 'build', cmd: 'LAY IT DOWN, PRINT, THEN LOAD!', time: 8, mood: 'desert', winText: 'Strong along the layers!', failText: 'Snapped between layers!',
  card: { title: 'Weak between the layers', kind: 'Engineering', ref: '3D print orientation and layer strength',
    text: 'A 3D printer builds a part from flat layers of melted plastic, stacked bottom to top. Along a layer, the plastic is one long strong strand. Between layers, it is only stuck together, so that is where it breaks first.\n\nPrint a peg standing up and its layers stack across it like pancakes. Load it and it snaps cleanly between two layers. Print it lying down and the strands run along its length, so the load pulls along them and it holds.\n\nEngineers turn a part so the force runs along the layers, not across them.',
    note: 'Printed parts are weakest between layers, so lay a part so the force runs along its layers.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.queue = OR.SETS[s.v].slice(0, L >= 2 ? 3 : 2).map(([k, d]) => ({ kind: k, a0: d * Math.PI / 180 }));
    s.i = 0; s.a = s.queue[0].a0; s.phase = 'turn'; s.drag = null; s.t0 = 0; s.mounted = [];
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.phase !== 'turn') return;
    if (N4.inBox(OR.BTN, x, y, 12)) { s.phase = 'print'; s.t0 = g.t; s.ok = OR.strong(s.a); g.sfx('click'); g.sfx('sweep'); return; }
    if (y > 350 && y < OR.BED + 20) { s.drag = Math.atan2(y - OR.PIV[1], x - OR.PIV[0]); SK.dragStart(g, null, x, y); g.sfx('tap'); }
  },
  move(g, x, y) { const s = g.s; if (s.drag == null || g.done) return; SK.dragMove(g, x, y); const a = Math.atan2(y - OR.PIV[1], x - OR.PIV[0]); let d = a - s.drag; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; s.drag = a; s.a -= d; },
  up(g) { const s = g.s; if (s.drag == null) return; s.drag = null; SK.dragEnd(g); s.a = Math.round(s.a / (Math.PI / 36)) * (Math.PI / 36); },
  update(g, dt) {
    const s = g.s; if (g.done) return; const u = g.t - s.t0;
    if (s.phase === 'print' && u > 1.0) { s.phase = 'mount'; s.t0 = g.t; g.sfx('whoosh'); }
    if (s.phase === 'mount' && u > 0.5) { s.phase = 'load'; s.t0 = g.t; g.sfx('thud'); }
    if (s.phase === 'load' && u > 0.45) {
      if (!s.ok) { s.phase = 'snap'; s.t0 = g.t; g.sfx('snap'); g.sfx('crunch'); g.shake(4, 0.2); g.sfx('laugh'); g.fail(); return; }
      s.mounted.push({ kind: s.queue[s.i].kind, a: s.a }); g.sfx('ding'); g.burst(200, 220, ['#fff6ea', '#8affb0', '#ffd45a'], 12, 120);
      if (s.i >= s.queue.length - 1) { s.phase = 'won'; g.sfx('cheer'); g.win(); } else { s.i++; s.a = s.queue[s.i].a0; s.phase = 'turn'; g.sfx('pop'); }
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', Q = s.queue[s.i], K = OR.KINDS[Q.kind];
    c.drawImage(g.bake('orient_bg', OR.paint), 0, 0, 360, 640);
    // parts already working on the wall (small, at the left)
    s.mounted.forEach((m, j) => { const x = 40 + j * 40; c.fillStyle = OR.KINDS[m.kind].col; c.fillRect(x - 4, 150, 8, 40); c.fillStyle = '#5ac06a'; c.beginPath(); c.arc(x, 200, 9, 0, 7); c.fill(); });
    // the wall: the mount where this part will work, and its load
    const mountP = Q.kind === 'Peg' ? [150, 220] : [200, 140], useA = K.use, u = g.t - s.t0;
    const onWall = s.phase === 'mount' || s.phase === 'load' || s.phase === 'snap' || won;
    if (!onWall && !g.done) { const gp = OR.rot(OR.shape(Q.kind), useA).map(([x, y]) => [x + mountP[0], y + mountP[1]]); c.save(); c.setLineDash([6, 5]); c.strokeStyle = 'rgba(120,90,60,0.6)'; c.lineWidth = 2.5; OR.poly(c, gp); c.stroke(); c.restore(); }
    c.fillStyle = '#8a7a6a'; if (Q.kind === 'Rod') c.fillRect(170, 128, 60, 10); else { c.beginPath(); c.arc(mountP[0], mountP[1], 6, 0, 7); c.fill(); }
    if (onWall) {
      const k = s.phase === 'mount' ? SK.easeInOut(u / 0.5) : 1, local = OR.shape(Q.kind), wallPts = OR.rot(local, useA).map(([x, y]) => [x + mountP[0], y + mountP[1]]);
      const sn = s.phase === 'snap' ? SK.clamp(u * 2, 0, 1) : 0;
      c.save(); c.globalAlpha = k; if (sn > 0) { c.beginPath(); if (useA === 0) c.rect(0, 0, mountP[0] + OR.LEN * 0.55, 640); else c.rect(0, 0, 360, mountP[1] + OR.LEN * 0.55); c.clip(); } OR.poly(c, wallPts); c.fillStyle = K.col; c.fill(); c.strokeStyle = P.shade(K.col, -0.5); c.lineWidth = 2.5; c.stroke();
      OR.layers(c, wallPts, useA + s.a, mountP[0], mountP[1], 'rgba(255,255,255,0.45)'); c.restore();
      // the load arriving: a pot dropped onto the peg's tip, a lamp hung from the rod's end
      const tip = [mountP[0] + Math.cos(useA) * (OR.LEN - 14), mountP[1] + Math.sin(useA) * (OR.LEN - 14)];
      const lk = s.phase === 'load' ? SK.clamp(u / 0.3, 0, 1) : s.phase === 'mount' ? 0 : 1, fall = Math.min(sn * sn * 200, (K.load === 'pot' ? 300 : 250) - tip[1]);
      if (lk > 0) { const ly = tip[1] - (1 - lk) * 80 + fall;
        if (K.load === 'pot') { c.fillStyle = '#c8603a'; c.strokeStyle = '#6a2a1a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(tip[0] - 22, ly - 44); c.lineTo(tip[0] + 22, ly - 44); c.lineTo(tip[0] + 16, ly - 12); c.lineTo(tip[0] - 16, ly - 12); c.closePath(); c.fill(); c.stroke();
          c.fillStyle = '#4a9a3a'; for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(tip[0] - 14 + i * 7, ly - 56 - (i % 2) * 8, 6, 12, (i - 2) * 0.3, 0, 7); c.fill(); } }
        else { c.strokeStyle = '#3a3a48'; c.lineWidth = 2; c.beginPath(); c.moveTo(tip[0], ly); c.lineTo(tip[0], ly + 18); c.stroke(); c.fillStyle = '#ffd45a'; c.strokeStyle = '#8a6a10'; c.beginPath(); c.moveTo(tip[0] - 26, ly + 46); c.lineTo(tip[0] - 12, ly + 18); c.lineTo(tip[0] + 12, ly + 18); c.lineTo(tip[0] + 26, ly + 46); c.closePath(); c.fill(); c.stroke(); } }
      if (sn > 0) { // the snapped-off end falls too
        c.save(); c.translate(tip[0], tip[1] + fall * 0.9); c.rotate(sn * 2); c.fillStyle = K.col; c.fillRect(-30, -OR.TH / 2, 50, OR.TH); c.restore(); }
    }
    // the turtle, napping under the wall
    SK.animal(c, 'turtle', 250, 322, 0.9, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    SK.tag(c, (s.i + 1) + ' / ' + s.queue.length, 310, 150, 18);
    // the part on the bed, with its layer lines (always flat on the bed); it prints from the bed up
    if (!onWall) {
      const pts = OR.onBed(Q.kind, s.a), ok = OR.strong(s.a); let y0 = 1e9; for (const [, y] of pts) y0 = Math.min(y0, y);
      const k = s.phase === 'print' ? SK.clamp(u / 0.9, 0, 1) : 0, ly = OR.BED - (OR.BED - y0) * k;
      OR.poly(c, pts); c.fillStyle = P.shade(K.col, 0.45) + '66'; c.fill(); c.save(); c.setLineDash([5, 4]); c.strokeStyle = ok ? '#5ad07a' : '#e85a4a'; c.lineWidth = 3; c.stroke(); c.restore();
      OR.layers(c, pts, 0, 180, OR.BED, ok ? 'rgba(120,255,160,0.7)' : 'rgba(255,140,120,0.75)');
      if (k > 0) { c.save(); c.beginPath(); c.rect(0, ly, 360, OR.BED - ly); c.clip(); OR.poly(c, pts); c.fillStyle = K.col; c.fill(); OR.layers(c, pts, 0, 180, OR.BED, 'rgba(255,255,255,0.4)'); c.restore(); }
      if (s.phase === 'turn' && !g.done) SK.tag(c, 'Layers', 300, 384, 18, '#fff6ea', ok ? 'rgba(40,150,70,0.95)' : 'rgba(190,50,40,0.92)');
      SK.tag(c, Q.kind, 62, 384, 18);
      const hx = s.phase === 'print' ? 180 + Math.sin(t * 14) * 80 : 180, hy = s.phase === 'print' ? ly - 22 : 372; c.fillStyle = '#4a5260'; c.fillRect(34, hy - 4, 292, 6); c.fillStyle = '#e8e8f0'; c.strokeStyle = '#1a1e26'; c.lineWidth = 2; c.beginPath(); c.roundRect(hx - 16, hy - 14, 32, 24, 5); c.fill(); c.stroke(); c.fillStyle = '#c8a040'; c.beginPath(); c.moveTo(hx - 5, hy + 10); c.lineTo(hx + 5, hy + 10); c.lineTo(hx, hy + 19); c.closePath(); c.fill();
    }
    const ok = OR.strong(s.a), turning = s.phase === 'turn' && !g.done;
    N4.button(c, OR.BTN, s.phase === 'print' ? 'Printing...' : 'Print', { pressed: s.phase === 'print', on: turning && ok, col: turning && ok ? '#3ac06a' : '#6a7a8a', size: 24 });
    // guidance: turn it to lie flat (the nearer way), then Print
    let h = null;
    if (turning && s.drag == null) {
      if (!ok) { const tgt = Math.round(s.a / Math.PI) * Math.PI, d = -(tgt - s.a), r = 74, a0 = -Math.PI / 2 - 0.5 * Math.sign(d || 1), a1 = a0 + SK.clamp(d, -2.9, 2.9); h = { k: 'drag', a: [OR.PIV[0] + Math.cos(a0) * r, OR.PIV[1] + Math.sin(a0) * r], b: [OR.PIV[0] + Math.cos(a1) * r, OR.PIV[1] + Math.sin(a1) * r] };
        c.save(); c.strokeStyle = '#ffd45a'; c.fillStyle = '#ffd45a'; c.lineWidth = 6; c.lineCap = 'round'; c.globalAlpha = 0.85; c.beginPath(); c.arc(OR.PIV[0], OR.PIV[1], r + 16, Math.min(a0, a1), Math.max(a0, a1)); c.stroke(); c.translate(OR.PIV[0] + Math.cos(a1) * (r + 16), OR.PIV[1] + Math.sin(a1) * (r + 16)); c.rotate(a1 + Math.sign(d) * Math.PI / 2); c.beginPath(); c.moveTo(11, 0); c.lineTo(-6, -10); c.lineTo(-6, 10); c.closePath(); c.fill(); c.restore(); }
      else { h = { k: 'tap', a: [OR.BTN.x + 30, OR.BTN.y + 4] }; SK.glow(c, g, OR.BTN.x, OR.BTN.y, 54, '#a8ffb8', { level: 2 }); }
    }
    SK.demo(g, c, h ? h.k : 'tap', h ? h.a : [0, 0], h ? h.b : null, { never: !h });
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._b = s._b || { n: 0, next: 1.0 }; if (g.done || s.phase !== 'turn' || g.t < B.next) return;
    if (OR.strong(s.a) && !(s._bot && s._bot['r' + B.n] === 1)) { B.next = g.t + 0.2; synth('down', OR.BTN.x, OR.BTN.y); synth('up', OR.BTN.x, OR.BTN.y); return; }
    if (B.abn !== B.n) { const tgt = Math.round(s.a / Math.PI) * Math.PI, d = -(tgt - s.a), r = 74, a0 = -Math.PI / 2 - 0.5 * Math.sign(d || 1), a1 = a0 + SK.clamp(d, -2.9, 2.9); B.abn = B.n; B.ab = [[OR.PIV[0] + Math.cos(a0) * r, OR.PIV[1] + Math.sin(a0) * r], [OR.PIV[0] + Math.cos(a1) * r, OR.PIV[1] + Math.sin(a1) * r]]; }
    if (SK.bot.drag(g, synth, 'r' + B.n, B.next, B.ab[0], B.ab[1], 0.4)) { B.n++; B.next = g.t + 0.3; }
  },
});
