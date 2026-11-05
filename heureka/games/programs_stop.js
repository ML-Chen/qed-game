// STOP! (cs RD-03) — an infinite loop: the code says i = 0 / while i < 3: / wave(), and nothing ever changes i, so
// the glow goes round and round and the frog on its lily pad waves on and on, getting dizzier (stars pile up over its
// head). Drag the card i += 1 into the loop, indented under wave(): now each lap adds one to i (the sign counts up),
// the check i < 3 turns False, and the frog stops and sits down, relieved. Drop it below the loop without the indent
// and it is never reached: the loop spins on and the frog's eyes spiral. Each round is a new loop (count up to 2, 3 or
// 4, or count down to 0 with -= 1). Level 0: two loops; level 1: three; level 2: three loops with two lines in the body.
(() => {
  const PX = 16, PY = 128, PW = 328, SIZE = 20, LH = 32, HOME = { x: 180, y: 566 }, CW = 132, CH = 40;
  const LOOPS = [
    { v: 'i', start: 0, op: '<', lim: 3, step: 1, act: 'wave' }, { v: 'n', start: 0, op: '<', lim: 2, step: 1, act: 'hop' },
    { v: 'k', start: 3, op: '>', lim: 0, step: -1, act: 'clap' }, { v: 'j', start: 0, op: '<', lim: 4, step: 1, act: 'wave' },
  ];
  const EXTRA = { wave: 'blink()', hop: 'croak()', clap: 'blink()' };
  const cond = (L, x) => L.op === '<' ? x < L.lim : x > L.lim;
  function paintPond(o) {
    const sk = o.createLinearGradient(0, 0, 0, 640); sk.addColorStop(0, '#7ad0b8'); sk.addColorStop(0.5, '#b8ecd0'); sk.addColorStop(1, '#e8f8e0'); o.fillStyle = sk; o.fillRect(0, 0, 360, 640);
    const w = o.createLinearGradient(0, 360, 0, 640); w.addColorStop(0, '#5ab0c8'); w.addColorStop(1, '#2a6a90'); o.fillStyle = w; o.beginPath(); o.moveTo(0, 372); o.quadraticCurveTo(180, 356, 360, 372); o.lineTo(360, 640); o.lineTo(0, 640); o.closePath(); o.fill();
    o.strokeStyle = 'rgba(255,255,255,0.4)'; o.lineWidth = 2; const r = P.rng(9); for (let i = 0; i < 18; i++) { const x = r() * 340, y = 390 + r() * 230; o.beginPath(); o.ellipse(x, y, 10 + r() * 14, 2.5, 0, 0, 7); o.stroke(); }
    for (const [x, y, s] of [[300, 600, 0.8], [40, 520, 0.6], [330, 430, 0.5]]) { o.fillStyle = '#4aa050'; o.beginPath(); o.ellipse(x, y, 34 * s, 12 * s, 0, 0.3, 6); o.lineTo(x, y); o.closePath(); o.fill(); }
    // reeds on the bank
    for (let i = 0; i < 10; i++) { const x = 6 + i * 7 + (i > 4 ? 270 : 0), h = 50 + (i % 3) * 18; o.strokeStyle = '#3a8a3a'; o.lineWidth = 3; o.beginPath(); o.moveTo(x, 380); o.quadraticCurveTo(x + 4, 380 - h / 2, x + 2, 380 - h); o.stroke(); if (i % 2) { o.fillStyle = '#8a5a2a'; o.beginPath(); o.ellipse(x + 2, 380 - h + 6, 3, 9, 0, 0, 7); o.fill(); } }
  }
  function lines(s) { // the program as it now stands; each entry: { text, kind: 'code' | 'card', indent }
    const L = s.loop, out = [{ text: L.v + ' = ' + L.start }, { text: 'while ' + L.v + ' ' + L.op + ' ' + L.lim + ':' }, { text: '    ' + L.act + '()' }];
    if (s.L === 2) out.push({ text: '    ' + EXTRA[L.act] });
    if (s.ins) { const t = (s.ins.indent ? '    ' : '') + s.card; out.splice(s.ins.k, 0, { text: t, card: true, indent: s.ins.indent }); }
    return out;
  }
  function bodyEnd(s) { return 2 + (s.L === 2 ? 2 : 1) + (s.ins && s.ins.indent ? 1 : 0); } // index just past the loop body
  // where a dropped card goes: indented anywhere from under the while line down = in the body; not indented = after the loop
  function slotFor(s, cx, cy) {
    const n = 3 + (s.L === 2 ? 1 : 0), lineY = i => PY + 24 + LH / 2 + 2 + i * LH, left = cx - CW / 2, ind = left > PX + 30 + 1.6 * SIZE * 0.6;
    let k = 0, best = 1e9; for (let i = 0; i <= n; i++) { const gy = lineY(i) - LH / 2; if (Math.abs(cy - gy) < best) { best = Math.abs(cy - gy); k = i; } }
    if (ind) k = SK.clamp(k, 2, n); else k = n;
    return { k, indent: ind, y: lineY(k) - LH / 2 };
  }
  function newRound(g) { const s = g.s; s.loop = LOOPS[s.order[s.r]]; s.val = s.loop.start; s.card = s.loop.v + (s.loop.step > 0 ? ' += 1' : ' -= 1'); s.ins = null; s.pc = 1; s.pt = g.t; s.cx = HOME.x; s.cy = HOME.y; s.drag = false; s.res = ''; s.laps = 0; s.dizzy = 0; s.born = g.t; s.last = null; }
  MG.add({
    id: 'stoploop', stage: 'programs', cmd: 'MAKE THE LOOP STOP!', time: 7, mood: 'bright', winText: 'The loop stopped!', failText: 'Still looping!',
    card: { title: 'A loop needs a way to stop', kind: 'Computer science', ref: 'While loops and infinite loops',
      text: 'A while loop checks its test, here i < 3, and if it is True it runs the indented lines underneath, then checks again.\n\nIf nothing inside the loop ever changes i, the test stays True forever. That is an infinite loop: the program never moves on.\n\nAdding i += 1 inside the loop makes i grow by one each time round. After three laps the test is False and the loop ends. Put that line below the loop instead and it is never reached, because the loop never finishes.',
      note: 'A loop must change something each time round, so that its test eventually becomes False and it stops.' },
    init(g) { const s = g.s; s.L = Math.min(2, g.level); s.v = SK.variant(g, 4); const ord = [0, 1, 2, 3].map(i => (i + s.v) % 4); s.order = [ord[0], ...SK.shuffled(g, ord.slice(1))]; s.n = s.L === 0 ? 2 : 3; s.r = 0; newRound(g); },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.ins || s.res) return; if (Math.abs(x - s.cx) < CW / 2 + 12 && Math.abs(y - s.cy) < CH / 2 + 14) { s.drag = true; s.off = [s.cx - x, s.cy - y]; g.sfx('click'); } },
    move(g, x, y) { const s = g.s; if (!s.drag) return; s.cx = SK.clamp(x + s.off[0], 70, 290); s.cy = SK.clamp(y + s.off[1], 140, 600); },
    up(g) {
      const s = g.s; if (!s.drag) return; s.drag = false; const bottom = PY + 24 + (lines(s).length + 1) * LH + 10;
      if (s.cy > PY + 10 && s.cy < bottom + 6) { const sl = slotFor(s, s.cx, s.cy); s.ins = { k: sl.k, indent: sl.indent, t: g.t }; g.sfx('pop'); if (!sl.indent) { s.bad = g.t; } }
      else { s.cx = HOME.x; s.cy = HOME.y; g.sfx('swoosh', { pitch: 0.7 }); }
    },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      if (s.res === 'next') { if (g.t - s.resT > 0.75) { s.r++; if (s.r >= s.n) { g.win(); g.sfx('cheer'); } else newRound(g); } return; }
      if (s.res) return;
      // the computer runs the program: the while line checks, then each body line in turn
      if (s.ins && !s.bad) g.held += dt; // the fuse stands still while the fixed loop counts its way out
      const ls = lines(s), be = bodyEnd(s), step = (s.pc === 1 ? 0.26 : 0.36) * (s.ins && !s.bad ? 0.8 : 1);
      if (g.t - s.pt < step) return; s.pt = g.t;
      if (s.pc === 0) { s.pc = 1; return; }
      if (s.pc === 1) {
        if (cond(s.loop, s.val)) { s.pc = 2; s.laps++; s.dizzy = Math.min(10, s.dizzy + 1); g.sfx('tap', { pitch: 0.8 + Math.min(1, s.dizzy / 10) }); }
        else { s.pc = be; s.res = 'next'; s.resT = g.t; g.sfx('chime'); g.sfx('ribbit'); g.burst(130, 400, ['#ffd45a', '#fff6ea', '#7ee8a0'], 18, 150); }
        return;
      }
      const ln = ls[s.pc]; if (ln && ln.card && ln.indent) { s.val += s.loop.step; s.last = g.t; g.sfx('ding', { pitch: 1.2 }); }
      s.pc++; if (s.pc >= be) s.pc = 1;
      // a line dropped outside the loop body: the loop spins on, the frog's eyes spiral
      if (s.bad && g.t - s.bad > 1.8) { s.res = 'bad'; g.fail(); g.sfx('laugh'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', L = s.loop;
      c.drawImage(g.bake('stoploop_pond', paintPond), 0, 0, 360, 640);
      const ls = lines(s), cur = s.res === 'next' ? -1 : s.pc;
      const lay = N5.panel(c, g, { x: PX, y: PY, w: PW, lines: ls.map(q => q.text), cur, size: SIZE, lineH: LH, ok: s.res === 'next' ? [ls.findIndex(q => q.card)] : [] });
      // a line never reached is greyed with a "never runs" mark
      const ci = ls.findIndex(q => q.card); if (ci >= 0 && !ls[ci].indent) { const y = lay.lineY(ci); c.save(); c.fillStyle = 'rgba(30,14,36,0.5)'; c.beginPath(); c.roundRect(PX + 6, y - LH / 2 + 3, PW - 12, LH - 6, 8); c.fill(); c.restore(); SK.tag(c, 'Never runs', PX + PW - 70, y, 18, '#fff6ea', 'rgba(190,40,40,0.9)'); }
      // the frog on its lily pad: waves (or hops, or claps) each lap, dizzier and dizzier; sits down when the loop ends
      c.fillStyle = '#3a9a4a'; c.beginPath(); c.ellipse(130, 488, 74, 22, 0, 0.25, 6.05); c.lineTo(130, 488); c.closePath(); c.fill(); c.fillStyle = '#5aba5a'; c.beginPath(); c.ellipse(130, 484, 70, 19, 0, 0.25, 6.05); c.lineTo(130, 484); c.closePath(); c.fill();
      const acting = !s.res && s.pc >= 2, done = s.res === 'next' || won, wob = Math.min(1, s.dizzy / 10);
      const pose = done ? 'idle' : lost ? 'sad' : acting ? (L.act === 'wave' ? 'wave' : L.act === 'hop' ? 'hop' : 'cheer') : 'idle';
      c.save(); c.translate(130, 480 - (acting && L.act === 'hop' ? Math.abs(Math.sin((t - s.pt) / 0.36 * Math.PI)) * 22 : 0)); c.rotate(done ? 0 : Math.sin(t * 5) * 0.12 * wob);
      SK.animal(c, 'frog', 0, 0, 1.25, { t, pose, expr: done ? 'laugh' : lost || wob > 0.6 ? 'wow' : 'happy' }); c.restore();
      if (!done) { const n = Math.ceil(s.dizzy / 2); for (let i = 0; i < n; i++) { const a = t * 3 + i * 6.283 / Math.max(1, n); c.fillStyle = '#ffe27a'; N5.text(c, '★', 130 + Math.cos(a) * 40, 384 + Math.sin(a) * 10, 20, '#ffe27a'); } }
      if (s.res === 'bad' || (s.bad && !s.res)) { for (const ex of [-14, 14]) { c.save(); c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); for (let a = 0; a < 12; a += 0.3) { const r = a * 0.7; const x = 130 + ex * 1.15 + Math.cos(a + t * 8) * r, y = 386 + Math.sin(a + t * 8) * r; a ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore(); } }
      if (done) SK.tag(c, 'Phew!', 130, 372, 20);
      // the variable and the loop's test
      const ok = cond(L, s.val), bump = s.last ? Math.max(0, 1 - (t - s.last) * 4) : 0;
      c.save(); c.fillStyle = 'rgba(30,14,36,0.78)'; c.beginPath(); c.roundRect(226, 392, 116, 92, 14); c.fill(); c.restore();
      N5.text(c, L.v + ' = ' + s.val, 284, 416, 24 + bump * 8, bump ? '#ffe27a' : '#fff6ea', { mono: true });
      SK.tag(c, L.v + ' ' + L.op + ' ' + L.lim + ' ? ' + (ok ? 'True' : 'False'), 284, 460, 17, '#fff6ea', ok ? 'rgba(40,140,80,0.95)' : 'rgba(200,50,50,0.95)');
      if (!g.done) N5.slots(c, s.r, s.n, 70, 600);
      // the card (at home, being dragged, or a preview of where it will drop)
      if (!s.ins) {
        if (s.drag) { const bottom = PY + 24 + (ls.length + 1) * LH + 10; if (s.cy > PY + 10 && s.cy < bottom + 6) { const sl = slotFor(s, s.cx, s.cy), x0 = PX + 30 + (sl.indent ? 4 * lay.charW : 0); c.save(); c.strokeStyle = sl.indent ? '#7ee8a0' : '#ff8a7a'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, sl.y); c.lineTo(PX + PW - 14, sl.y); c.stroke(); c.restore(); } }
        c.save(); c.fillStyle = 'rgba(16,8,30,0.35)'; c.beginPath(); c.roundRect(s.cx - CW / 2 + 3, s.cy - CH / 2 + 5, CW, CH, 10); c.fill();
        c.fillStyle = '#3a3470'; c.beginPath(); c.roundRect(s.cx - CW / 2, s.cy - CH / 2, CW, CH, 10); c.fill(); c.strokeStyle = '#ffd45a'; c.lineWidth = 3; c.stroke(); c.restore();
        N5.text(c, s.card, s.cx, s.cy + 1, SIZE + 1, '#c4f08a', { mono: true, lw: 0 });
      }
      // guidance: drag the card into the loop, indented under its last line
      if (!s.ins && !s.res && !g.done) { const k = bodyEnd(s), ty = lay.lineY(k - 1) + LH / 2 + 2, tx = PX + 30 + 4 * lay.charW + CW / 2 - 4;
        SK.grab(c, g, s.cx, s.cy, 34); SK.target(c, g, tx, ty, 0, { w: CW + 10, h: CH }); SK.arrow(c, g, s.cx, s.cy, tx, ty, { from: 36, to: 30 });
        SK.demo(g, c, 'drag', [s.cx, s.cy], [tx, ty]); }
    },
    // the bot drags each card into the loop body, indented
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.ins || s.res || g.t - s.born < 0.6) return; const k = bodyEnd(s), ty = PY + 24 + LH / 2 + 2 + (k - 1) * LH + LH / 2 + 2, tx = typeof window !== 'undefined' && window.N5FAIL ? 76 : PX + 30 + 4 * SIZE * 0.602 + CW / 2;
      SK.bot.drag(g, synth, 'card' + s.r, s.born + 0.6, [HOME.x, HOME.y], [tx, ty], 0.5);
    },
  });
})();
