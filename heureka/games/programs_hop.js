// HOP! (cs EL-02) — a pond of lily pads, a fly, a rock in the way, and an empty program. Drag the arrow cards into the
// program in the right order, then tap the green run button: the glow walks down the lines and the frog hops one pad per
// line. In the wrong order the frog bonks the rock or hops into open water. A program is a list of steps, in order.
const STEP = 0.55; // seconds per line while the program runs
const LAYOUTS = [ // grid rows top to bottom: S start pad, o pad, R rock on a pad, . water, 1 / 2 flies (in the order to catch)
  { rows: ['R.1', 'Soo'], cards: ['up', 'right', 'right'] },  // right, right, up
  { rows: ['oo1', 'SR.'], cards: ['right', 'up', 'right'] },  // up, right, right
  { rows: ['..o2', 'R1o.', 'So..'], cards: ['up', 'right', 'right', 'up', 'right'] }, // right, up, right, up, right
];
const DIRS = { right: [1, 0], up: [0, -1], left: [-1, 0], down: [0, 1] };
const PX = 14, PY = 126, PW = 222; // the code panel
function solve(L) { // the one order that works (the bot and the demo hand use it)
  const R = L.rows.length, C = L.rows[0].length, cell = (x, y) => (y < 0 || y >= R || x < 0 || x >= C) ? '.' : L.rows[y][x];
  let start; L.rows.forEach((r, y) => { const x = r.indexOf('S'); if (x >= 0) start = [x, y]; });
  const flies = []; L.rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === '1' || ch === '2') flies[+ch - 1] = [x, y]; }));
  const n = L.cards.length, pool = L.cards.slice(); let best = null;
  const rec = (pos, seq, left, got) => {
    if (best) return; if (!left.length) { if (got === flies.length) best = seq.slice(); return; }
    const tried = new Set();
    for (let i = 0; i < left.length; i++) {
      const k = left[i]; if (tried.has(k)) continue; tried.add(k);
      const [dx, dy] = DIRS[k], nx = pos[0] + dx, ny = pos[1] + dy, ch = cell(nx, ny);
      if (ch === '.' || ch === 'R') continue; let g2 = got; if (ch === '1' || ch === '2') { if (+ch - 1 !== got) continue; g2++; }
      rec([nx, ny], seq.concat(k), left.slice(0, i).concat(left.slice(i + 1)), g2);
    }
  };
  rec(start, [], pool, 0); return { start, flies, answer: best, R, C, cell, n };
}
function geo(s) { // where the pond grid sits, under the code panel
  const top = s.panelB + 12, bot = 540, cs = Math.min(88, (bot - top) / s.S.R, 300 / s.S.C);
  const x0 = 180 - cs * s.S.C / 2, y0 = top + (bot - top - cs * s.S.R) / 2;
  return { cs, x0, y0, at: (cx, cy) => [x0 + (cx + 0.5) * cs, y0 + (cy + 0.5) * cs] };
}
function paintPond(o, s) {
  const G = geo(s), { cs } = G;
  const sky = o.createLinearGradient(0, 0, 0, 640); sky.addColorStop(0, '#9fdcc8'); sky.addColorStop(0.22, '#5fb8b0'); sky.addColorStop(1, '#2f7f8a');
  o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
  const rnd = P.rng(7);
  // far bank with reeds
  o.fillStyle = '#6fae5a'; o.beginPath(); o.moveTo(0, 120); for (let x = 0; x <= 360; x += 20) o.lineTo(x, 112 + Math.sin(x * 0.05) * 6); o.lineTo(360, 0); o.lineTo(0, 0); o.closePath(); o.fill();
  o.fillStyle = '#8fd07a'; o.fillRect(0, 0, 360, 60);
  for (let i = 0; i < 26; i++) { const x = rnd() * 360, h = 30 + rnd() * 40; o.strokeStyle = rnd() < 0.5 ? '#3f8a4a' : '#5aa456'; o.lineWidth = 3; o.beginPath(); o.moveTo(x, 122); o.quadraticCurveTo(x + 4, 122 - h * 0.6, x + (rnd() - 0.5) * 12, 122 - h); o.stroke(); if (rnd() < 0.35) { o.fillStyle = '#8a5a3a'; o.beginPath(); o.ellipse(x + 1, 122 - h * 0.8, 3.5, 9, 0, 0, 7); o.fill(); } }
  // ripples in the water
  o.strokeStyle = 'rgba(255,255,255,0.16)'; o.lineWidth = 2;
  for (let i = 0; i < 30; i++) { const x = rnd() * 360, y = 140 + rnd() * 480, w = 14 + rnd() * 30; o.beginPath(); o.ellipse(x, y, w, w * 0.25, 0, 0, Math.PI); o.stroke(); }
  // the lily pads (and the rock's pad)
  s.L.rows.forEach((r, y) => [...r].forEach((ch, x) => {
    if (ch === '.') return; const [px, py] = G.at(x, y), R = cs * 0.43;
    o.fillStyle = 'rgba(10,40,50,0.25)'; o.beginPath(); o.ellipse(px + 3, py + 5, R, R * 0.8, 0, 0, 7); o.fill();
    const a0 = 0.25 + rnd() * 5; o.fillStyle = '#5cb84e'; o.beginPath(); o.moveTo(px, py); o.ellipse(px, py, R, R * 0.8, 0, a0 + 0.35, a0 + Math.PI * 2 - 0.05); o.closePath(); o.fill();
    o.strokeStyle = '#3f8a3a'; o.lineWidth = 2; o.stroke();
    o.strokeStyle = 'rgba(200,255,170,0.45)'; o.lineWidth = 1.5; for (let k = 0; k < 6; k++) { const a = a0 + 0.8 + k * 0.9; o.beginPath(); o.moveTo(px, py); o.lineTo(px + Math.cos(a) * R * 0.85, py + Math.sin(a) * R * 0.68); o.stroke(); }
    if (ch === 'o' && rnd() < 0.4) { o.fillStyle = '#ffb8d8'; for (let k = 0; k < 6; k++) { const a = k * 1.05; o.beginPath(); o.ellipse(px + R * 0.5 + Math.cos(a) * 5, py - R * 0.3 + Math.sin(a) * 4, 5, 3, a, 0, 7); o.fill(); } o.fillStyle = '#ffe27a'; o.beginPath(); o.arc(px + R * 0.5, py - R * 0.3, 3, 0, 7); o.fill(); }
    if (ch === 'R') P.rock(o, px, py + R * 0.35, cs / 70, '#9a8e88');
  }));
  P.vignette(o, 360, 640, 0.25, '#103040');
}
function drawCard(c, kind, x, y, sc = 1, lift = 0) {
  c.save(); c.translate(x, y - lift); c.scale(sc, sc);
  c.fillStyle = 'rgba(20,30,30,0.3)'; c.beginPath(); c.roundRect(-27, -25 + 4 + lift * 0.4, 54, 54, 10); c.fill();
  c.fillStyle = '#fff4dc'; c.strokeStyle = '#8a5a3a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-27, -27, 54, 54, 10); c.fill(); c.stroke();
  c.rotate(Math.atan2(DIRS[kind][1], DIRS[kind][0]));
  c.fillStyle = '#3fae5a'; c.strokeStyle = '#1f6a34'; c.lineWidth = 2; c.beginPath(); c.moveTo(-15, -6); c.lineTo(2, -6); c.lineTo(2, -14); c.lineTo(17, 0); c.lineTo(2, 14); c.lineTo(2, 6); c.lineTo(-15, 6); c.closePath(); c.fill(); c.stroke();
  c.restore();
}
function fly(c, x, y, t, k = 0) { // k > 0: being caught (shrinks toward the frog's mouth)
  const by = y - 26 + Math.sin(t * 5 + x) * 4, bx = x + Math.sin(t * 3.3 + y) * 5; c.save(); c.translate(bx, by); c.scale(1 - k, 1 - k);
  const fl = Math.sin(t * 60) * 0.5; c.fillStyle = 'rgba(220,240,255,0.75)'; c.strokeStyle = 'rgba(60,80,100,0.5)'; c.lineWidth = 1;
  for (const sd of [-1, 1]) { c.save(); c.rotate(sd * (0.5 + fl)); c.beginPath(); c.ellipse(sd * 6, -6, 7, 4, sd * 0.4, 0, 7); c.fill(); c.stroke(); c.restore(); }
  c.fillStyle = '#2a2430'; c.beginPath(); c.ellipse(0, 0, 6, 4.5, 0, 0, 7); c.fill(); c.fillStyle = '#c83a3a'; c.beginPath(); c.arc(4, -2, 2.4, 0, 7); c.arc(4, 2, 2.4, 0, 7); c.fill();
  c.restore();
}
function startRun(g) { // tap go: work out the whole run now, then play it line by line
    const s = g.s, S = s.S; let pos = S.start.slice(), got = 0; const steps = [];
    for (let i = 0; i < s.prog.length; i++) {
      const k = s.cards[s.prog[i]].kind, [dx, dy] = DIRS[k], to = [pos[0] + dx, pos[1] + dy], ch = S.cell(to[0], to[1]);
      let type = ch === '.' ? 'water' : ch === 'R' ? 'rock' : 'pad';
      if (ch === '1' || ch === '2') { if (+ch - 1 === got) { type = 'fly'; got++; } }
      steps.push({ from: pos, to, type, kind: k }); if (type === 'water' || type === 'rock') break; pos = to;
    }
    s.run = { t0: g.t, steps, got }; g.sfx('magic');
  }
MG.add({
  id: 'cs_hop', stage: 'programs', cmd: 'HOP!', time: 7, mood: 'bright', winText: 'Sequence!', failText: 'Plop!',
  card: { title: 'A program is steps in order', kind: 'Computer science', ref: 'Sequencing (Code.org CS Fundamentals)',
    text: 'A program is a list of steps. The computer does them one at a time, from the top line down, exactly as written.\n\nThe same three steps in a different order make a different program. "Right, right, up" takes the frog around the water to the fly. "Up, right, right" sends it into the rock, because the first step already goes the wrong way.\n\nWhen a program goes wrong, look for the first line where the world stopped matching your plan.',
    note: 'A program is a list of steps, and the computer does them in exactly the order you write them.' },
  init(g) {
    const s = g.s, L = LAYOUTS[Math.min(2, g.level)], S = solve(L);
    s.S = S; s.L = L; s.prog = new Array(S.n).fill(null); s.run = null; s.res = null; s.eaten = 0;
    const lay = B7.layout({ x: PX, y: PY, w: PW, lines: s.prog.map(() => '') }); s.panelB = lay.y + lay.h; s.lay = lay;
    s.go = { x: 298, y: lay.y + lay.h / 2 + 6, r: 30 };
    const n = L.cards.length, gap = Math.min(66, 320 / n);
    s.cards = L.cards.map((k, i) => { const hx = 180 + (i - (n - 1) / 2) * gap, hy = 580; return { i, kind: k, hx, hy, x: hx, y: hy, slot: -1 }; });
    s.frog = S.start.slice(); s.fly = S.flies.map(f => ({ x: f[0], y: f[1], eatenAt: 0 }));
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.run) return;
    if (SK.dist(x, y, s.go.x, s.go.y) < s.go.r + 10) { if (s.prog.every(p => p != null)) startRun(g); else { g.sfx('wrong'); s.goNo = g.t; } return; }
    const free = s.cards.filter(cd => cd.slot < 0), cd = SK.pick(free, x, y, 38);
    if (cd) { SK.dragStart(g, cd, x, y); g.sfx('tap'); return; }
    // a tap on a filled line sends its card back to the tray
    if (x > PX && x < PX + PW) for (let i = 0; i < s.prog.length; i++) if (s.prog[i] != null && Math.abs(y - s.lay.lineY(i)) < s.lay.lineH / 2) {
      const c2 = s.cards[s.prog[i]]; c2.slot = -1; c2.x = PX + 80; c2.y = s.lay.lineY(i); s.prog[i] = null; g.sfx('swoosh'); return;
    }
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const cd = d.obj;
    const slot = s.prog.indexOf(null);
    if (slot >= 0 && cd.y < s.panelB + 30 && cd.x < PX + PW + 20) { cd.slot = slot; s.prog[slot] = cd.i; s.dropT = g.t; s.dropSlot = slot; g.sfx('click'); }
  },
  update(g, dt) {
    const s = g.s; if (!s.run || g.done) return;
    for (const cd of s.cards) if (cd.slot >= 0) { const ty = s.lay.lineY(cd.slot); cd.x = SK.lerp(cd.x, PX + 150, 0.4); cd.y = SK.lerp(cd.y, ty, 0.4); }
    const e = (g.t - s.run.t0) / STEP, i = Math.floor(e), k = e - i, st = s.run.steps[i];
    if (st && k > 0.75 && !st.landed) {
      st.landed = true;
      if (st.type === 'fly') { const f = s.fly.find(f2 => f2.x === st.to[0] && f2.y === st.to[1]); if (f) f.eatenAt = g.t; s.eaten++; g.sfx('slurp'); g.sfx('ribbit'); }
      else if (st.type === 'pad') g.sfx('boing');
    }
    if (st && (st.type === 'rock' || st.type === 'water') && k > (st.type === 'rock' ? 0.7 : 0.8) && !s.res) {
      s.res = { t: g.t, type: st.type, line: i }; B7.flash(g, i); g.sfx(st.type === 'rock' ? 'thud' : 'splash'); if (st.type === 'rock') g.sfx('splash'); g.shake(4, 0.2); g.fail();
    }
    if (!st && i >= s.run.steps.length && !s.res) {
      if (s.eaten === s.fly.length) { s.res = { t: g.t, type: 'win' }; g.win(); g.sfx('cheer'); const [fx, fy] = geo(s).at(...s.run.steps[s.run.steps.length - 1].to); g.burst(fx, fy - 30, ['#ffe27a', '#7ee8a0', '#fff'], 18, 160); }
      else { s.res = { t: g.t, type: 'hungry', line: s.prog.length - 1 }; B7.flash(g, s.prog.length - 1); g.fail(); }
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, G = geo(s), { cs } = G;
    c.drawImage(g.bake('cs_hop' + Math.min(2, g.level), o => paintPond(o, s)), 0, 0, 360, 640);
    // live water shimmer
    c.save(); c.globalAlpha = 0.12; c.strokeStyle = '#fff'; c.lineWidth = 2; for (let i = 0; i < 6; i++) { const y = 180 + i * 75 + Math.sin(t + i) * 6, x = (i * 97 + t * 14) % 400 - 20; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 20, y - 4, x + 40, y); c.stroke(); } c.restore();
    // the code panel: each filled line reads the card's step
    const run = s.run, e = run ? (t - run.t0) / STEP : -1, cur = run && !s.res ? Math.min(Math.floor(e), s.prog.length - 1) : -1;
    const lines = s.prog.map(p => p == null ? '' : s.cards[p].kind + '()');
    const done = run ? s.prog.map((p, i) => i).filter(i => i < Math.floor(e) && (!s.res || i < s.res.line)) : [];
    B7.panel(c, g, { x: PX, y: PY, w: PW, lines, cur, flash: g.s.b7flash, done, icons: s.prog.map(p => p == null ? null : s.cards[p].kind), iconLevel: 1 });
    // empty slots: dashed boxes, the next one glowing while a card is held
    const dragC = SK.dragging(g), nextSlot = s.prog.indexOf(null);
    s.prog.forEach((p, i) => { if (p != null) return; const ly = s.lay.lineY(i), hot = dragC && i === nextSlot; c.save(); c.strokeStyle = hot ? '#ffe27a' : 'rgba(255,255,255,0.3)'; c.lineWidth = hot ? 3 : 2; c.setLineDash([6, 5]); c.lineDashOffset = -t * 20; c.beginPath(); c.roundRect(PX + 34, ly - 12, 100, 24, 6); c.stroke(); c.restore(); });
    if (s.dropT && t - s.dropT < 0.35) { const ly = s.lay.lineY(s.dropSlot), k = (t - s.dropT) / 0.35; c.save(); c.globalAlpha = 1 - k; c.strokeStyle = '#ffe27a'; c.lineWidth = 3; c.beginPath(); c.roundRect(PX + 30 - k * 6, ly - 14 - k * 4, 110 + k * 12, 28 + k * 8, 8); c.stroke(); c.restore(); }
    // the run button
    const full = s.prog.every(p => p != null), gp = full && !run ? 1 + Math.sin(t * 7) * 0.06 : 1, no = s.goNo && t - s.goNo < 0.3 ? Math.sin((t - s.goNo) * 50) * 4 : 0;
    c.save(); c.translate(s.go.x + no, s.go.y); c.scale(gp, gp);
    c.fillStyle = 'rgba(10,30,30,0.3)'; c.beginPath(); c.arc(2, 5, s.go.r, 0, 7); c.fill();
    c.fillStyle = full ? '#3fcf6a' : '#7a9a8a'; c.strokeStyle = full ? '#1a7a3a' : '#4a6a5a'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, s.go.r, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#fff'; c.beginPath(); c.moveTo(-9, -13); c.lineTo(14, 0); c.lineTo(-9, 13); c.closePath(); c.fill(); c.restore();
    if (full && !run) SK.glow(c, g, s.go.x, s.go.y, 36);
    // the flies
    for (const f of s.fly) { const [fx, fy] = G.at(f.x, f.y), k = f.eatenAt ? Math.min(1, (t - f.eatenAt) * 5) : 0; if (k < 1) fly(c, fx, fy, t, k); }
    // the frog
    let [fx, fy] = G.at(...s.frog), lift = 0, pose = 'idle', wet = 0, sink = 0;
    if (run) {
      const i = Math.min(Math.floor(e), run.steps.length - 1), st = run.steps[i];
      if (st) {
        const k = Math.min(1, e - i), [ax, ay] = G.at(...st.from), [bx, by] = G.at(...st.to);
        if (st.type === 'rock') { // hop toward the rock, bonk, and drop into the water beside it
          const m = k < 0.45 ? k / 0.45 * 0.42 : 0.42 + (0.5 - 0.42) * Math.min(1, (k - 0.45) / 0.3), side = k < 0.45 ? 0 : Math.min(1, (k - 0.45) / 0.3) * cs * 0.5;
          const ux = (bx - ax) / cs, uy = (by - ay) / cs; fx = SK.lerp(ax, bx, m) - uy * side; fy = SK.lerp(ay, by, m) + ux * side; // bounce off sideways into the water between the pads
          lift = k < 0.45 ? Math.sin(k / 0.45 * Math.PI) * 20 : Math.sin(Math.min(1, (k - 0.45) / 0.3) * Math.PI) * 26; pose = 'hop';
          if (k > 0.45 && k < 0.75) { c.save(); c.fillStyle = '#ffe27a'; for (let j = 0; j < 4; j++) { const a = t * 6 + j * 1.57; c.beginPath(); c.arc(fx + Math.cos(a) * 18, fy - 40 + Math.sin(a) * 6, 3, 0, 7); c.fill(); } c.restore(); }
        } else { const m = SK.easeInOut(k); fx = SK.lerp(ax, bx, m); fy = SK.lerp(ay, by, m); lift = Math.sin(m * Math.PI) * cs * 0.4; pose = k < 0.95 ? 'hop' : 'idle'; }
        if (i === run.steps.length - 1 && k >= 1 && st.type !== 'rock' && st.type !== 'water') { [fx, fy] = G.at(...st.to); }
      }
    }
    if (s.res && (s.res.type === 'rock' || s.res.type === 'water')) { const k = Math.min(1, (t - s.res.t) * 2.5); sink = k; wet = 1; B7.splash(c, fx, fy, Math.min(1, (t - s.res.t) * 1.6)); }
    const won = s.res && s.res.type === 'win', sad = s.res && !won;
    SK.shadow(c, fx, fy + 4, 20 * (1 - lift / 80), 6, lift ? 0.15 : 0.25);
    c.save(); if (sink) { c.beginPath(); c.rect(0, 0, 360, fy - 6 + 2); c.clip(); }
    SK.animal(c, 'frog', fx, fy - lift + sink * 30, 0.72, { t, pose: won ? 'cheer' : sad ? 'sad' : pose, expr: won ? 'laugh' : sad ? 'wow' : 'happy', noShadow: true });
    c.restore();
    if (sink) { c.save(); c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2; for (let j = 0; j < 3; j++) { const q = ((t - s.res.t) * 1.2 + j * 0.33) % 1; c.globalAlpha = 1 - q; c.beginPath(); c.ellipse(fx, fy - 4, 10 + q * 26, 3 + q * 7, 0, 0, 7); c.stroke(); } c.restore(); }
    if (s.res && s.res.type === 'hungry') { c.save(); c.globalAlpha = Math.min(1, (t - s.res.t) * 3); SK.tag(c, '?', fx + 24, fy - 62, 22); c.restore(); }
    // the cards: in the tray, or tucked against their line in the program
    c.fillStyle = 'rgba(90,56,30,0.85)'; c.beginPath(); c.roundRect(14, 546, 332, 64, 14); c.fill(); c.strokeStyle = '#c89a62'; c.lineWidth = 2; c.stroke();
    for (const cd of s.cards) {
      if (cd === dragC) continue;
      if (cd.slot >= 0) { const ly = s.lay.lineY(cd.slot); if (!run) { cd.x = SK.lerp(cd.x, PX + 150, 0.35); cd.y = SK.lerp(cd.y, ly, 0.35); } continue; }
      cd.x = SK.lerp(cd.x, cd.hx, 0.3); cd.y = SK.lerp(cd.y, cd.hy, 0.3); drawCard(c, cd.kind, cd.x, cd.y);
    }
    if (dragC) drawCard(c, dragC.kind, dragC.x, dragC.y, 1.12, 6);
    // guidance: glow the next card the program needs (level 0); the ghost hand drags the first one up
    if (!run && !dragC && nextSlot >= 0 && g.level === 0) { const want = s.S.answer[nextSlot], cd = s.cards.find(c2 => c2.slot < 0 && c2.kind === want); if (cd) SK.glow(c, g, cd.hx, cd.hy, 30, '#ffe27a', { level: 0 }); }
    // the hand shows the next step: drag the card the next line needs, take back a wrong line, or tap run
    if (!run) {
      const bad = s.prog.findIndex((p, i) => p != null && s.cards[p].kind !== s.S.answer[i]);
      if (bad >= 0) SK.demo(g, c, 'tap', [PX + 80, s.lay.lineY(bad)]);
      else if (nextSlot >= 0) { const cd = s.cards.find(c2 => c2.slot < 0 && c2.kind === s.S.answer[nextSlot]); if (cd) SK.demo(g, c, 'drag', [cd.hx, cd.hy], [PX + 90, s.lay.lineY(nextSlot)]); }
      else SK.demo(g, c, 'tap', [s.go.x, s.go.y]);
    }
  },
  // the bot: drag the cards up in the solved order, then tap run
  auto(g, dt, synth) {
    const s = g.s, ans = (typeof window !== 'undefined' && window.B7FAIL) ? s.S.answer.slice().reverse() : s.S.answer; if (g.done || s.run) return; const used = new Set();
    for (let i = 0; i < ans.length; i++) {
      const t0 = 1.0 + i * 0.55, B = g.s._bot || {};
      if (B['c' + i] === 2) { used.add(s.prog[i]); continue; }
      if (i > 0 && B['c' + (i - 1)] !== 2) return;
      const cd = s.cards.find(c2 => c2.slot < 0 && c2.kind === ans[i] && !used.has(c2.i)); if (!cd && !B['c' + i]) return;
      const from = B['c' + i] ? s._from : (s._from = [cd.hx, cd.hy]);
      SK.bot.drag(g, synth, 'c' + i, t0, from, [PX + 90, s.lay.lineY(i)], 0.35); return;
    }
    SK.bot.tap(g, synth, 'go', 1.0 + ans.length * 0.55 + 0.2, s.go.x, s.go.y);
  },
});
