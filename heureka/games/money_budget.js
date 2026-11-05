// GIVE EVERY BILL A JOB! (business PF-01) — a budget. The paycheck bursts open and its bills come out one at a time.
// Three jars wait below, each with a fill line: Needs (rent, food: the highest line), Wants (fun: lower) and Savings
// (lowest). Swipe or drag each bill into a jar. A jar at its line glows green. Fill all three exactly to their lines and
// every dollar has a job: the jars glow and the ant tucks the savings away. Put a bill in a jar that is already full and it
// overflows: the wants jar spills into a heap of takeout boxes, and the rent note in the needs jar flaps empty.
// Level 1: the next bill swings on its string; level 2: a bigger paycheck and a wider swing.
(() => {
  const JARS = [{ x: 66, name: 'Needs', col: '#5aa8e8' }, { x: 180, name: 'Wants', col: '#f08a5a' }, { x: 294, name: 'Savings', col: '#5ac87a' }];
  const LV = [{ lines: [3, 2, 1] }, { lines: [3, 2, 1] }, { lines: [4, 2, 2] }], J0 = 562, U = 30, JH = 160, JW = 96, HANG = { x: 180, y: 262 };
  const SPLITS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [2, 0, 1]]; // which jar stands where (a new layout each play)
  function paint(o) {
    N6.vgrad(o, 0, 0, 360, 640, ['#a8d8a0', '#d8f0c8', '#fffbe0']);
    // a kitchen wall with a window and a calendar; the counter the jars stand on
    o.fillStyle = 'rgba(255,255,255,0.35)'; for (let y = 120; y < 590; y += 30) for (let x = (y / 30) % 2 ? 0 : 15; x < 360; x += 30) o.fillRect(x, y, 28, 28);
    o.fillStyle = '#8a6a4a'; o.beginPath(); o.roundRect(16, 128, 88, 70, 6); o.fill(); N6.vgrad(o, 22, 134, 76, 58, ['#8ad0f0', '#d8f0f8']); o.fillStyle = '#8a6a4a'; o.fillRect(58, 134, 4, 58);
    o.fillStyle = '#fff6ea'; o.beginPath(); o.roundRect(268, 130, 70, 70, 6); o.fill(); o.fillStyle = '#e8563a'; o.fillRect(268, 130, 70, 16); o.fillStyle = '#c8b8a8'; for (let i = 0; i < 12; i++) o.fillRect(274 + (i % 4) * 16, 152 + Math.floor(i / 4) * 14, 10, 9);
    N6.vgrad(o, 0, J0 - 4, 360, 60, ['#c88a5a', '#9a6a40']); o.fillStyle = '#e0a878'; o.fillRect(0, J0 - 6, 360, 6);
  }
  function icon(c, k, x, y) {
    c.save(); c.translate(x, y);
    if (k === 0) { c.fillStyle = '#fff6ea'; c.strokeStyle = '#2a3a5a'; c.lineWidth = 2; c.beginPath(); c.moveTo(-12, 0); c.lineTo(0, -11); c.lineTo(12, 0); c.lineTo(12, 11); c.lineTo(-12, 11); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#5aa8e8'; c.fillRect(-3, 3, 6, 8); }
    if (k === 1) { c.fillStyle = '#f5c890'; c.beginPath(); c.moveTo(-7, -2); c.lineTo(7, -2); c.lineTo(0, 14); c.closePath(); c.fill(); c.fillStyle = '#ff9ac0'; c.beginPath(); c.arc(0, -5, 8, 0, 7); c.fill(); c.fillStyle = '#e84a4a'; c.beginPath(); c.arc(0, -13, 2.5, 0, 7); c.fill(); }
    if (k === 2) { c.fillStyle = '#ff9ab0'; c.strokeStyle = '#a84a6a'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 2, 13, 10, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(-4, -6, 4, Math.PI, 0); c.fill(); c.fillStyle = '#a84a6a'; c.fillRect(-4, -8, 8, 2); c.fillRect(-8, 10, 4, 4); c.fillRect(4, 10, 4, 4); }
    c.restore();
  }
  function takeout(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#fff6ea'; c.strokeStyle = '#8a6a4a'; c.lineWidth = 2; c.beginPath(); c.moveTo(-14, -16); c.lineTo(14, -16); c.lineTo(10, 10); c.lineTo(-10, 10); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#e8403a'; c.fillRect(-6, -8, 12, 8); c.strokeStyle = '#8a6a4a'; c.beginPath(); c.arc(0, -16, 9, Math.PI, 0); c.stroke(); c.restore(); }
  function billPos(g) { const s = g.s, sw = Math.sin(g.t * 2.2) * s.swing; return { x: HANG.x + sw, y: HANG.y + Math.abs(Math.sin(g.t * 2.2)) * (s.swing ? 8 : 0) }; }
  function jarFor(s, x, y) { // dropped on a jar, or flung toward one
    for (const j of s.jars) if (Math.abs(x - j.x) < JW / 2 + 14 && y > J0 - JH - 40 && y < J0 + 10) return j; return null;
  }
  MG.add({
    id: 'money_budget', stage: 'money', cmd: 'GIVE EVERY BILL A JOB!', time: 9, mood: 'bright', winText: 'Every dollar has a job!', failText: 'The jar overflowed!', hold: 1.7,
    card: { title: 'Give every dollar a job', kind: 'Money', ref: 'Budgeting',
      text: 'A budget splits your pay into jobs before you spend any of it. Needs come first: rent, food, bills. Then wants: fun things. Then savings, for later and for surprises.\n\nWhen every dollar has a job, nothing slips away. Without a plan, wants tend to grow until the rent money is gone.\n\nOne common rule of thumb is 50/30/20: half for needs, 30% for wants and 20% for savings. Real budgets change with your life; the point is to choose the split on purpose.',
      note: 'A budget gives every dollar of a paycheck a job before you spend it.' },
    init(g) {
      const s = g.s, L = LV[Math.min(2, g.level)]; s.v = SK.variant(g, 4); const lay = SPLITS[s.v];
      s.jars = lay.map((k, i) => ({ k, x: JARS[i].x, name: JARS[k].name, col: JARS[k].col, line: L.lines[k], n: 0, over: 0 }));
      s.left = L.lines.reduce((a, b) => a + b, 0); s.total = s.left; s.fly = []; s.held = null; s.spill = null; s.bornT = 0.4; s.swing = [0, 24, 46][Math.min(2, g.level)];
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || !s.left || s.held) return; const b = billPos(g); if (SK.dist(x, y, b.x, b.y) < 60) { s.held = { x: b.x, y: b.y, x0: b.x, y0: b.y }; SK.dragStart(g, s.held, x, y); g.sfx('rustle'); } },
    move(g, x, y) { if (g.s.held) SK.dragMove(g, x, y); },
    up(g, x, y) {
      const s = g.s; if (!s.held) return; const d = SK.dragEnd(g), h = s.held; s.held = null;
      let j = jarFor(s, h.x, h.y);
      if (!j) { const dx = h.x - h.x0, dy = h.y - h.y0, L = Math.hypot(dx, dy); if (L > 26) { let best = -0.3; for (const jj of s.jars) { const ex = jj.x - h.x0, ey = J0 - 60 - h.y0, el = Math.hypot(ex, ey), cs = (dx * ex + dy * ey) / (L * el); if (cs > best) { best = cs; j = jj; } } } }
      if (!j) return; s.left--; s.fly.push({ j, x: h.x, y: h.y, t: g.t }); g.sfx('swoosh'); s.bornT = g.t + 0.15;
    },
    update(g, dt) {
      const s = g.s;
      for (const f of s.fly) if (!f.done && g.t - f.t > 0.3) { f.done = true; const j = f.j; if (g.done) continue;
        if (j.n >= j.line) { j.over++; s.spill = { j, t: g.t }; g.sfx('crunch'); g.sfx('laugh'); g.shake(4, 0.25); g.fail(); }
        else { j.n++; g.sfx(j.n === j.line ? 'chime' : 'coin'); if (j.n === j.line) g.burst(j.x, J0 - j.line * U - 16, ['#8affb0', '#fff6ea'], 10, 110); }
        if (!g.done && s.jars.every(q => q.n === q.line)) { g.win(); g.sfx('cheer'); } }
      s.fly = s.fly.filter(f => !f.done);
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('n6budget_bg', paint), 0, 0, 360, 640);
      // the paycheck, with the bills still in it
      c.save(); c.fillStyle = '#fff6ea'; c.strokeStyle = '#8a6a4a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(116, 128, 128, 62, 8); c.fill(); c.stroke(); c.beginPath(); c.moveTo(116, 130); c.lineTo(180, 166); c.lineTo(244, 130); c.stroke(); c.restore();
      for (let i = 0; i < Math.max(0, s.left - 1); i++) N6.bill(c, 150 + (i % 4) * 20, 128 - Math.floor(i / 4) * 6 - (i % 2) * 3, 40, 20, -0.2 + (i % 3) * 0.2);
      SK.tag(c, 'Paycheck', 180, 206, 18);
      // the jars
      for (const j of s.jars) {
        const top = J0 - JH, full = j.n === j.line, ly = J0 - 8 - j.line * U;
        N6.jarBack(c, j.x, top, J0, JW);
        for (let i = 0; i < j.n; i++) N6.bill(c, j.x + (i % 2 ? 4 : -4), J0 - 22 - i * U, 62, 26, i % 2 ? 0.06 : -0.06, '#7ac87a');
        if (j.k === 0 && s.spill && j.n === 0) { c.save(); c.translate(j.x, J0 - 40); c.rotate(Math.sin(t * 9) * 0.3); c.fillStyle = '#fff6ea'; c.fillRect(-14, -10, 28, 20); c.fillStyle = '#3a1a10'; c.font = '900 10px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.fillText('RENT', 0, 4); c.restore(); }
        N6.jarFront(c, j.x, top, J0, JW, j.col);
        c.save(); c.strokeStyle = full ? '#2aa84a' : '#3a1640'; c.lineWidth = 3.5; c.setLineDash(full ? [] : [8, 5]); c.beginPath(); c.moveTo(j.x - JW / 2 - 8, ly); c.lineTo(j.x + JW / 2 + 8, ly); c.stroke(); c.restore();
        if (full) { c.save(); c.globalAlpha = 0.25 + 0.15 * Math.sin(t * 6); c.fillStyle = '#8affb0'; c.beginPath(); c.roundRect(j.x - JW / 2 - 6, top + 4, JW + 12, JH, 16); c.fill(); c.restore(); N6.text(c, '✓', j.x + JW / 2 - 4, ly - 14, 22, '#2aa84a'); }
        icon(c, j.k, j.x, top - 18); SK.tag(c, j.name, j.x, J0 + 20, 18, '#fff6ea', 'rgba(30,14,36,0.78)');
      }
      // an overflow: bills spill out, and the wants jar becomes a heap of takeout boxes
      if (s.spill) { const k = SK.clamp((t - s.spill.t) * 2.5, 0, 1), j = s.spill.j; for (let i = 0; i < 4; i++) N6.bill(c, j.x - 30 + i * 22, J0 - JH - 20 + k * (100 + i * 12), 40, 20, i + t * 3);
        if (j.k === 1) for (let i = 0; i < 5; i++) takeout(c, j.x - 40 + i * 20, J0 - 8 - (i % 2) * 14, k); }
      // bills flying to their jars
      for (const f of s.fly) { const q = SK.clamp((t - f.t) / 0.3, 0, 1), tx = f.j.x, ty = J0 - 22 - Math.min(f.j.n, f.j.line) * U; N6.bill(c, SK.lerp(f.x, tx, q), SK.lerp(f.y, ty, q) - Math.sin(q * Math.PI) * 30, 62, 26, q * 6); }
      // the next bill, hanging from the paycheck
      if (s.left > 0 && !g.done) { const b = s.held || billPos(g), pop = SK.clamp((t - s.bornT) * 6, 0, 1);
        if (!s.held) { c.save(); c.strokeStyle = 'rgba(90,60,40,0.6)'; c.lineWidth = 2; c.beginPath(); c.moveTo(180, 190); c.lineTo(b.x, b.y - 14); c.stroke(); c.restore(); }
        c.save(); c.translate(b.x, b.y); c.scale(pop, pop); N6.bill(c, 0, 0, 74, 34, s.held ? 0 : Math.sin(t * 3) * 0.08); c.restore(); }
      SK.tag(c, (s.total - s.left) + ' / ' + s.total + ' bills', 300, 236, 18);
      SK.animal(c, 'ant', 40, 300, 1.0, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
      // guidance: fling the bill toward a jar that is still below its line
      if (s.left > 0 && !s.held && !g.done) { const b = billPos(g), j = s.jars.find(q => q.n + s.fly.filter(f => f.j === q).length < q.line) || s.jars[0];
        SK.grab(c, g, b.x, b.y, 34); SK.target(c, g, j.x, J0 - JH / 2, 0, { w: JW + 12, h: JH + 10 }); SK.arrow(c, g, b.x, b.y, j.x, J0 - JH / 2 - 20, { from: 40, to: 70 });
        SK.demo(g, c, 'drag', [b.x, b.y], [j.x, J0 - 70]); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || (!s.left && !s.held)) return; const B = s._a = s._a || { n: 1.0, k: 0 }; if (g.t < B.n && !B.p) return;
      if (!B.p) { const j = s.jars.find(q => q.n + s.fly.filter(f => f.j === q).length < q.line); if (!j) return; const b = billPos(g); B.p = [[b.x, b.y], [j.x, J0 - 70]]; B.t = g.t; }
      if (SK.bot.drag(g, synth, 'b' + B.k, B.t, B.p[0], B.p[1], 0.25)) { B.k++; B.p = null; B.n = g.t + 0.2; }
    },
  });
})();
