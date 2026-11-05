// TRACE BACK! (cs RD-06) — a crashed program: three code boxes, top to bottom, joined by a red thread that carries the
// value from line to line. The last box has crashed (a red flag): it tried to add 1 to "33". Trace the thread with your
// finger from the crash back up to where it starts, box by box: it lights as you go (stray off it and the trace
// waits for you to come back). At the top you find the real cause: input() gave the text "3", not the number 3. The
// int() converter snaps onto that line, the program runs again and the right number pops out at the bottom.
// Two crashed programs per game; level 2: the thread runs through four boxes (the bad value is doubled twice).
(() => {
  const PROGS = [
    { v: 'age', d: '3', ops: [['x = age * 2', 2]], out: ['print(x + 1)', 1] }, { v: 'n', d: '2', ops: [['m = n * 3', 3]], out: ['print(m - 1)', -1] },
    { v: 'k', d: '4', ops: [['d = k * 2', 2]], out: ['print(d + 5)', 5] }, { v: 'p', d: '5', ops: [['q = p * 2', 2]], out: ['print(q - 3)', -3] },
  ];
  const XS = [[126, 234, 128, 232], [234, 126, 232, 128]], TOL = 36;
  function boxesFor(s) { // the code boxes for this round, top to bottom: the input line, the working lines, the print
    const P0 = PROGS[s.order[s.r]], lines = [P0.v + ' = ' + (s.fixed ? 'int(input())' : 'input()')], ops = s.L === 2 ? [P0.ops[0], [P0.ops[0][0].replace(/^(\w+) = \w+/, (m, a) => a + ' = ' + a), P0.ops[0][1]]] : P0.ops;
    // values: as text before the fix (repeated strings), as numbers after it
    const vals = []; let t = P0.d, n = +P0.d; vals.push(s.fixed ? String(n) : '"' + t + '"');
    for (const [ln, k] of ops) { lines.push(ln); t = t.repeat(k); n *= k; vals.push(s.fixed ? String(n) : '"' + t + '"'); }
    lines.push(P0.out[0]); vals.push(s.fixed ? String(n + P0.out[1]) : 'Crash!');
    const N = lines.length, y0 = 206, y1 = s.L === 2 ? 530 : 500, xs = XS[s.order[s.r] % 2];
    return lines.map((ln, i) => ({ ln, val: vals[i], x: xs[i % 4], y: y0 + (y1 - y0) * i / (N - 1) }));
  }
  // the thread: from the crash (bottom box) back up to the input (top box), with small wiggles; a polyline with lengths
  function threadFor(B) {
    const pts = []; for (let i = B.length - 1; i > 0; i--) { const a = B[i], b = B[i - 1], L = Math.hypot(b.x - a.x, b.y - a.y), nx = -(b.y - a.y) / L, ny = (b.x - a.x) / L;
      for (let k = 0; k < 1; k += 0.025) { const w = 11 * Math.sin(k * Math.PI * 6) * Math.sin(k * Math.PI); pts.push([SK.lerp(a.x, b.x, k) + nx * w, SK.lerp(a.y, b.y, k) + ny * w, B.length - 1 - i]); } }
    pts.push([B[0].x, B[0].y, B.length - 1]); const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, cum, len: cum[cum.length - 1] };
  }
  const pointAt = (T, d) => { let i = 1; while (i < T.cum.length - 1 && T.cum[i] < d) i++; const k = (d - T.cum[i - 1]) / Math.max(1e-6, T.cum[i] - T.cum[i - 1]); return [SK.lerp(T.pts[i - 1][0], T.pts[i][0], SK.clamp(k, 0, 1)), SK.lerp(T.pts[i - 1][1], T.pts[i][1], SK.clamp(k, 0, 1))]; };
  function boxDist(T, B, j) { let best = 0, bd = 1e9; for (let i = 0; i < T.pts.length; i++) { const d = Math.hypot(T.pts[i][0] - B[j].x, T.pts[i][1] - B[j].y); if (d < bd) { bd = d; best = T.cum[i]; } } return best; }
  function paintDesk(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#2a3a5a'); bg.addColorStop(1, '#141c30'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    o.strokeStyle = 'rgba(120,160,220,0.08)'; o.lineWidth = 1; for (let x = 0; x < 360; x += 24) { o.beginPath(); o.moveTo(x, 0); o.lineTo(x, 640); o.stroke(); } for (let y = 0; y < 640; y += 24) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); }
    const lg = o.createRadialGradient(180, 360, 20, 180, 360, 300); lg.addColorStop(0, 'rgba(255,230,170,0.16)'); lg.addColorStop(1, 'rgba(255,230,170,0)'); o.fillStyle = lg; o.fillRect(0, 0, 360, 640);
  }
  function newRound(g) { const s = g.s; s.fixed = false; s.B = boxesFor(s); s.T = threadFor(s.B); s.prog = 0; s.tr = false; s.fixT = 0; s.born = g.t; s.marks = s.B.map((b, j) => boxDist(s.T, s.B, j)); }
  MG.add({
    id: 'traceback', stage: 'programs', cmd: 'TRACE THE CRASH BACK!', time: 8, mood: 'night', winText: 'Bug fixed at the source!', failText: 'Still crashing!',
    card: { title: 'Find where a bug starts', kind: 'Computer science', ref: 'Debugging: tracing a bad value back',
      text: 'A program often crashes on one line because of a mistake made earlier. Here the last line tried to add 1 to "33", which is text, so Python stopped with an error.\n\nWhere did "33" come from? Follow the value back, line by line. The line before doubled it, and the first line got it from input(). input() always gives text, so the person\'s 3 arrived as the text "3".\n\nFixing the first line with int() turns the text into a number, and every line after it then works.',
      note: 'A crash often starts earlier, where a bad value first came in, so trace the value back to its source and fix it there.' },
    init(g) { const s = g.s; s.L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.order = [s.v, (s.v + 1 + Math.floor(g.rand() * 3)) % 4]; s.n = 2; s.r = 0; newRound(g); },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.fixed) return; const [tx, ty] = pointAt(s.T, s.prog); if (Math.hypot(x - tx, y - ty) < TOL + 14) { s.tr = true; s.fx = [x, y]; g.sfx('click'); } },
    move(g, x, y) {
      const s = g.s; if (!s.tr || s.fixed) return; s.fx = [x, y];
      // follow the thread: the nearest point a little ahead of the lit tip, if the finger is on the thread
      let best = -1, bd = TOL; for (let i = 0; i < s.T.pts.length; i++) { const c0 = s.T.cum[i]; if (c0 < s.prog - 10 || c0 > s.prog + 70) continue; const d = Math.hypot(s.T.pts[i][0] - x, s.T.pts[i][1] - y); if (d < bd) { bd = d; best = c0; } }
      if (best > s.prog) { const before = s.marks.filter(m => m <= s.prog).length; s.prog = best; const after = s.marks.filter(m => m <= s.prog + 1).length; if (after > before && s.prog < s.T.len - 2) g.sfx('ding', { pitch: 1 + after * 0.1, vol: 0.5 }); if (g.rand() < 0.3) g.sfx('rustle', { vol: 0.2 }); }
      s.off = best < 0;
      if (s.prog >= s.T.len - 6) { s.prog = s.T.len; s.tr = false; s.fixed = true; s.fixT = g.t; s.B = boxesFor(s); g.sfx('snap'); g.sfx('magic'); g.burst(s.B[0].x, s.B[0].y, ['#7ee8a0', '#fff6ea', '#ffd45a'], 18, 150); }
    },
    up(g) { g.s.tr = false; g.s.off = false; },
    update(g, dt) {
      const s = g.s; if (g.done || !s.fixed) return; g.held += dt; // the fuse waits while the fixed program runs again
      const k = (g.t - s.fixT) / 1.4; if (k > 1 && !s.rang) { s.rang = 1; g.sfx('chime'); g.sfx('tweet'); }
      if (k > 1.35) { s.rang = 0; s.r++; if (s.r >= s.n) { g.win(); g.sfx('cheer'); } else newRound(g); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', B = s.B, T = s.T;
      c.drawImage(g.bake('traceback_desk', paintDesk), 0, 0, 360, 640);
      // the thread: dull red ahead, bright where you have traced it; after the fix, a green pulse runs down it
      const path = (d0, d1) => { c.beginPath(); let first = true; for (let i = 0; i < T.pts.length; i++) { if (T.cum[i] < d0 || T.cum[i] > d1) continue; first ? c.moveTo(T.pts[i][0], T.pts[i][1]) : c.lineTo(T.pts[i][0], T.pts[i][1]); first = false; } };
      c.lineCap = 'round'; c.lineJoin = 'round'; path(0, T.len); c.strokeStyle = 'rgba(30,10,20,0.6)'; c.lineWidth = 11; c.stroke(); c.strokeStyle = s.fixed ? '#3aa86a' : '#8a2a3a'; c.lineWidth = 6; c.stroke();
      if (s.prog > 0 && !s.fixed) { path(0, s.prog); c.save(); c.shadowColor = '#ff6a5a'; c.shadowBlur = 12; c.strokeStyle = '#ff7a6a'; c.lineWidth = 7; c.stroke(); c.restore(); }
      // the code boxes
      const flowK = s.fixed ? SK.clamp((t - s.fixT) / 1.4, 0, 1) : 0;
      B.forEach((b, i) => {
        const last = i === B.length - 1, crashed = last && !s.fixed, reached = !s.fixed && s.prog >= s.marks[i] - 4, lit = s.fixed && flowK * (B.length - 1) >= i - 0.01;
        c.save(); c.font = `800 18px ${N5.MONO}`; const w = c.measureText(b.ln).width + 28, h = 40;
        c.fillStyle = 'rgba(10,6,20,0.45)'; c.beginPath(); c.roundRect(b.x - w / 2 + 3, b.y - h / 2 + 5, w, h, 10); c.fill();
        c.fillStyle = crashed ? '#4a1a2a' : lit ? '#1e4a34' : '#2b2650'; c.beginPath(); c.roundRect(b.x - w / 2, b.y - h / 2, w, h, 10); c.fill();
        c.strokeStyle = crashed ? '#ff5a4a' : reached ? '#ffd45a' : lit ? '#7ee8a0' : 'rgba(255,255,255,0.25)'; c.lineWidth = reached || crashed || lit ? 3 : 2; c.stroke();
        c.textAlign = 'center'; c.textBaseline = 'middle'; let cx = b.x - (w - 28) / 2; c.textAlign = 'left'; for (const [tx, k] of N5.tokens(b.ln)) { c.fillStyle = { kw: '#ff8fd0', fn: '#7fdcff', bi: '#9cf0c4', str: '#ffd27a', num: '#c4f08a', op: '#c9c2e4' }[k] || '#f4f0ff'; c.fillText(tx, cx, b.y + 1); cx += c.measureText(tx).width; }
        c.restore();
        // the value this line made, on a tag beside the box: text in quotes (paper) or a number (green), or the crash
        const vx = b.x + (b.x < 180 ? 1 : -1) * (w / 2 + 44), vy = b.y; const show = !s.fixed || lit;
        if (show) { if (crashed) { SK.tag(c, 'Crash!', vx, vy, 18, '#fff6ea', 'rgba(210,40,40,0.95)'); c.fillStyle = '#ff5a4a'; c.fillRect(b.x + (b.x < 180 ? -w / 2 - 8 : w / 2 + 4), b.y - 34, 4, 34); c.beginPath(); c.moveTo(b.x + (b.x < 180 ? -w / 2 - 4 : w / 2 + 8), b.y - 34); c.lineTo(b.x + (b.x < 180 ? -w / 2 + 18 : w / 2 + 30), b.y - 27); c.lineTo(b.x + (b.x < 180 ? -w / 2 - 4 : w / 2 + 8), b.y - 20); c.fill(); }
          else SK.tag(c, b.val, vx, vy, 18, s.fixed ? '#123a20' : '#3a1640', s.fixed ? 'rgba(126,232,160,0.95)' : 'rgba(255,240,200,0.95)'); }
      });
      if (s.fixed && t - s.fixT < 0.8) { const k = (t - s.fixT) / 0.8; c.save(); c.globalAlpha = 1 - k; SK.tag(c, 'int()', B[0].x, B[0].y - 40 - k * 20, 20, '#123a20', 'rgba(126,232,160,0.95)'); c.restore(); }
      if (!g.done) N5.slots(c, s.r, s.n, 180, 590);
      // the owl detective with its magnifying glass at your fingertip
      const tip = pointAt(T, s.prog); const mg = s.tr && s.fx ? s.fx : tip;
      SK.animal(c, 'owl', 318, 612, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'point', expr: won ? 'laugh' : lost ? 'think' : s.fixed ? 'happy' : 'think', facing: -1 });
      if (!s.fixed && !g.done) { c.save(); c.strokeStyle = s.off ? '#ff8a7a' : '#ffd45a'; c.lineWidth = 4; c.beginPath(); c.arc(mg[0], mg[1], 22, 0, 7); c.stroke(); c.strokeStyle = '#8a5a30'; c.lineWidth = 6; c.beginPath(); c.moveTo(mg[0] + 16, mg[1] + 16); c.lineTo(mg[0] + 32, mg[1] + 32); c.stroke(); c.fillStyle = 'rgba(255,255,255,0.12)'; c.beginPath(); c.arc(mg[0], mg[1], 20, 0, 7); c.fill(); c.restore(); }
      // guidance: drag along the thread from the lit tip up to the next box
      if (!s.fixed && !g.done) { const next = Math.min(T.len, ...s.marks.filter(m => m > s.prog + 4)), nb = pointAt(T, next);
        SK.grab(c, g, tip[0], tip[1], 22, { col: '#ffd45a' }); SK.target(c, g, nb[0], nb[1], 26); SK.demo(g, c, 'drag', tip, nb); }
    },
    // the bot slides its finger up the thread, box by box
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.fixed || g.t - s.born < 0.6) return;
      if (!s.tr) { const p = pointAt(s.T, s.prog); synth('down', p[0], p[1]); return; }
      const p = pointAt(s.T, Math.min(s.T.len, s.prog + 22)); synth('move', p[0], p[1]);
    },
  });
})();
