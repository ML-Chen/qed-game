// integers_addopp.js — ADD OPPOSITE! Subtracting a negative number is adding its opposite: 5 − (−3) = 5 + 3.
// Underwater on a reef: every number floats in its own bubble, and an octopus bobs below. Every move acts its working
// out (show your work):
//   1. Drag the minus sign onto the negative sign (or the other way): both signs are circled and slide together; one bar
//      turns upright and crosses the other, so the two minuses become one +, the brackets fall away and the 3 glides
//      over: 5 + 3. (At level 2, a + (−b): the plus's upright bar drops off and the minus is left: a − b.)
//   2. Tap the + (or a number): copies of the two terms' bubbles lift off, drift together and merge into one bigger
//      bubble, which shows the sum and floats down into the answer.
// Level 0: a − (−b) with small positive a. Level 1: a may be negative. Level 2: a − (−b) or a + (−b).
// Wrong moves: dragging a sign onto a number, tapping the numbers before the signs are merged.
// Medium mode: the final tap opens a tray once the bubbles merge; wrong tiles are the answer with the signs not merged
// (5 − 3), the opposite, ±1.
const M = MK, INK = '#f2fbff', GOLD = '#ffe27a';
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  const b = 2 + r(L === 0 ? 6 : 8); let a = 2 + r(L === 0 ? 7 : 9);
  if (L > 0 && g.rand() < 0.5) a = -a;
  const o = L === 2 && g.rand() < 0.5 ? '+' : '-';
  return { a, b, o, s: o === '-' ? '+' : '-', v: o === '-' ? a + b : a - b, naive: o === '-' ? a - b : a + b };
}
// where a gliding node is drawn right now (the kit's glide: 0.32 s, ease-out), for art drawn under or over it
const glideOff = (n, t) => { const q = n && n._glide; if (!q) return { x: 0, y: 0 }; const k = 1 - MK.ease(MK.clamp((t - q.t0) / 0.32, 0, 1)); return { x: q.dx * k, y: q.dy * k }; };
MG.add({
  id: 'integers_addopp', stage: 'integers', cmd: 'ADD OPPOSITE!', hint: 'drag', time: 8, mood: 'sea', winText: 'Opposite!', hold: 1.4,
  card: {
    title: 'Subtracting a negative', ref: 'Grades 6–7', kind: 'Negative numbers',
    text: 'The opposite of a number is the number the same distance from 0 on the other side. The opposite of 3 is −3, and the opposite of −3 is 3.\n\nSubtracting a number is the same as adding its opposite. So subtracting a negative number is the same as adding a positive number. Two minus signs next to each other become one plus sign.\n\nFor example, 5 − (−3) = 5 + 3 = 8.\n\nHere is why. Subtraction asks how far it is from one number to another. From −3 up to 5 is 8 steps, so 5 − (−3) = 8. Taking away a debt of 3 leaves you 3 richer.',
    note: 'Subtracting a negative is adding its opposite: a − (−b) = a + b. Adding a negative is subtracting: a + (−b) = a − b.',
    ask: 'What is 7 − (−2)? What is −4 − (−6)?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const T = M.pace(g);
    S.slot = M.slot('ans', { col: '#bfeaff' });
    S.aN = M.num(S.a, 'a'); S.bN = M.num(S.b, 'b'); S.o1 = M.op(S.o, 'o1'); S.neg = M.op('-', 'neg'); S.par = M.paren(M.row(S.neg, M.gap(4), S.bN), 'par'); S.eqN = M.op('=', 'eq');
    S.ex = M.row(S.aN, M.gap(12), S.o1, M.gap(12), S.par, M.gap(12), S.eqN, M.gap(10), S.slot);
    const place = () => M.place(g, 'ex', S.ex, 180, 300, 44, { col: INK }); place();
    M.inert(g, ['eq', 'par', 'ans']);
    g.dur *= (2.6 + 1.05 * 2) / 8;
    const hop = g => { S.mk.lastMove = g.t; };
    const merge = (g, from, to) => {
      S.merged = true; M.show(g, 1.15 * T); g.sfx('swoosh'); hop(g);
      M.circle(g, ['o1', 'neg'], { dur: 0.5 * T, col: GOLD });
      const A = { ...M.box(g, 'o1') }, B = { ...M.box(g, 'neg') }, mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, sz = 44 * 0.2;
      const pb = { ...M.box(g, 'par') };
      // the two signs (drawn as bars) slide together; for − (−) one bar turns upright to make a +, for + (−) the plus's
      // upright bar drops away and leaves a −
      M.at(g, [[0.3 * T, g => { S.o1.alpha = 0; S.neg.alpha = 0; g.sfx('tap');
        M.anim(g, { dur: 0.65 * T, draw(c, g, k) { const e = M.easeIO(Math.min(1, k / 0.45)), f = M.easeIO(M.clamp((k - 0.45) / 0.4, 0, 1));
          c.strokeStyle = f > 0 ? GOLD : INK; c.lineWidth = 44 * 0.08; c.lineCap = 'round'; c.shadowColor = GOLD; c.shadowBlur = 10 * f;
          const ax = M.lerp(A.x, mx, e), bx = M.lerp(B.x, mx, e), ay = M.lerp(A.y, my, e), by = M.lerp(B.y, my, e);
          c.beginPath(); c.moveTo(bx - sz, by); c.lineTo(bx + sz, by); c.stroke(); // the negative sign's bar stays flat
          if (S.o === '-') { const r = f * Math.PI / 2; c.beginPath(); c.moveTo(ax - Math.cos(r) * sz, ay - Math.sin(r) * sz); c.lineTo(ax + Math.cos(r) * sz, ay + Math.sin(r) * sz); c.stroke(); }
          else { c.beginPath(); c.moveTo(ax - sz, ay); c.lineTo(ax + sz, ay); c.stroke(); c.globalAlpha = 1 - f; c.beginPath(); c.moveTo(ax, ay - sz + f * 40); c.lineTo(ax, ay + sz + f * 40); c.stroke(); }
        } }); }],
        // the brackets fall away
        [0.75 * T, g => { S.par.col = 'rgba(0,0,0,0)'; g.sfx('pop');
          M.anim(g, { dur: 0.45 * T, draw(c, g, k) { c.globalAlpha = 1 - k; c.fillStyle = INK; c.font = M.NUMF(44, 500); c.textAlign = 'center';
            for (const [x, d] of [[pb.x - pb.w / 2 + 7, -1], [pb.x + pb.w / 2 - 7, 1]]) { c.save(); c.translate(x + d * k * 14, pb.y + 15 + k * k * 80); c.rotate(d * k * 1.2); c.fillText(d < 0 ? '(' : ')', 0, 0); c.restore(); } } }); }],
        [0.95 * T, g => { S.o2 = M.op(S.s, 'o2', { _born: -1, pop: g.t, col: GOLD }); S.old = { a: { ...M.box(g, 'a') }, b2: { ...M.box(g, 'b') } }; S.relaidAt = g.t; S.bN.id = 'b2';
          S.ex.items.splice(2, 3, S.o2, M.gap(12), S.bN); place(); M.sparkle(g, 'o2', { n: 10, cols: ['#bfeaff', GOLD, '#fff'] }); g.sfx('magic'); hop(g); }]]);
    };
    M.play(g, {
      moves(g) {
        if (!S.merged) return [{ drag: 'o1', to: 'neg', busy: 0.1, then: merge }, { drag: 'neg', to: 'o1', busy: 0.1, then: merge }];
        if (S.done) return [];
        return [{ tap: ['o2', 'a', 'b2'], busy: 0.1, askAt: 0.75 * T, after: 0.9 * T, ask: { v: S.v, wrong: [S.naive, -S.v, S.v + 1, S.v - 1] },
          then(g) { S.done = true; M.show(g, 0.75 * T); g.sfx('swoosh'); hop(g); M.indicate(g, 'o2', { dur: 0.4 * T, col: GOLD });
            // copies of both terms' bubbles lift off and drift together above the sum
            const A = { ...M.box(g, 'a') }, B = { ...M.box(g, 'b2') }, mid = { x: (A.x + B.x) / 2, y: 224 };
            S.blob = { A, B, mid, t0: g.t + 0.1 * T, dur: 0.6 * T, av: S.a, bv: S.s === '+' ? S.b : -S.b }; },
          resolve(g) { M.show(g, 0.9 * T); S.blob.res = g.t; g.sfx('ding'); hop(g);
            M.at(g, [[0.4 * T, g => { const bl = S.blob; bl.gone = g.t; g.sfx('bubble');
              M.fly(g, { node: M.num(S.v, null, { col: GOLD }), from: [bl.mid.x, bl.mid.y], to: 'ans', dur: 0.42 * T, arc: 20, s0: 34, s1: 44,
                then(g) { S.slot.fill = M.num(S.v, null, { pop: g.t, col: GOLD, _born: -1 }); place(); g.sfx('coin'); hop(g); const b = M.box(g, 'ans'); if (b) g.burst(b.x, b.y, [GOLD, '#7ad8ff', '#fff'], 14, 140); } }); }]]); } }];
      },
      area(g) { return S.merged ? 'o2' : ['o1', 'neg']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'reef', panel: 'none', host: 'octopus', hostX: 180, hostY: 560, hostS: 1.5 });
    // light rays and a school of little fish drifting past
    for (let i = 0; i < 7; i++) { const x = ((t * 22 + i * 52) % 440) - 40, y = 470 + Math.sin(t * 1.5 + i) * 8 + (i % 3) * 14; fish(c, x, y, i % 2 ? '#ffb04a' : '#ffe27a'); }
    // every number floats in its own bubble
    for (const id of ['a', 'b', 'b2', 'ans']) {
      const b = M.box(g, id), n = M.node(g, id); if (!b || !n || n.hide) continue;
      const o = glideOff(n, t), q = t === S.relaidAt && S.old[id] ? S.old[id] : { x: b.x + o.x, y: b.y + o.y }; bubble(c, q.x, q.y + Math.sin(t * 1.8 + b.x * 0.03) * 2.5, Math.max(b.w, b.h) / 2 + (id === 'ans' ? 6 : 3));
    }
    // move 2: two bubble copies drift up and merge into one, which shows the sum, then the sum floats down into the answer
    const bl = S.blob; if (bl && t >= bl.t0 && !(bl.gone && t > bl.gone + 0.05)) { const k = M.clamp((t - bl.t0) / bl.dur, 0, 1), e = M.easeIO(k), T = M.pace(g);
      const pos = (P0, side) => ({ x: M.lerp(P0.x, bl.mid.x + side * M.lerp(30, 0, M.clamp((k - 0.6) / 0.4, 0, 1)), e), y: M.lerp(P0.y, bl.mid.y, e) - Math.sin(e * Math.PI) * 20 });
      const pa = pos(bl.A, -1), pb = pos(bl.B, 1), mk = M.clamp((k - 0.8) / 0.2, 0, 1), r0 = 24;
      if (mk < 1) { c.save(); c.globalAlpha = 1 - mk; for (const [p, v] of [[pa, bl.av], [pb, bl.bv]]) { bubble(c, p.x, p.y, r0); c.save(); c.globalAlpha *= M.clamp(1 - (k - 0.55) / 0.2, 0, 1); txt(c, v, p.x, p.y, 24, INK); c.restore(); } c.restore(); }
      if (mk > 0) { const rk = bl.res != null ? M.clamp((t - bl.res) / (0.3 * T), 0, 1) : 0, r = r0 * (1 + 0.35 * M.ease(mk)) * (1 + Math.sin(rk * Math.PI) * 0.15);
        bubble(c, bl.mid.x, bl.mid.y, r); if (bl.res != null) { c.save(); c.globalAlpha = rk; txt(c, S.v, bl.mid.x, bl.mid.y, 32, GOLD); c.restore(); } }
    }
    M.drawEx(g, c, 'ex');
    M.drawUI(g, c);
  },
});
function bubble(c, x, y, r) {
  const gr = c.createRadialGradient(x - r * 0.35, y - r * 0.4, 1, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,0.35)'); gr.addColorStop(0.7, 'rgba(120,200,255,0.12)'); gr.addColorStop(1, 'rgba(200,240,255,0.45)');
  c.save(); c.fillStyle = gr; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = 'rgba(220,250,255,0.7)'; c.lineWidth = 1.5; c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(x - r * 0.45, y - r * 0.5, r * 0.18, r * 0.1, -0.6, 0, 7); c.fill(); c.restore();
}
function txt(c, v, x, y, s, col) { const n = M.num(v), m = M.lay(n, s); M.draw(c, n, x - m.w / 2, y + (m.a - m.d) / 2, s, { col }); }
function fish(c, x, y, col) {
  c.save(); c.fillStyle = col; c.globalAlpha = 0.85; c.beginPath(); c.ellipse(x, y, 9, 4.5, 0, 0, 7); c.fill();
  c.beginPath(); c.moveTo(x - 8, y); c.lineTo(x - 15, y - 5); c.lineTo(x - 15, y + 5); c.closePath(); c.fill();
  c.fillStyle = '#1a2a3a'; c.beginPath(); c.arc(x + 5, y - 1, 1.3, 0, 7); c.fill(); c.restore();
}
