// fractions_add.js — ADD FRACTIONS! Add fractions with the same denominator by counting pieces of the same size:
// 2/7 + 3/7 = (2 + 3)/7 = 5/7. The pieces stay sevenths, so the bottom stays 7.
// A coral reef at noon with an octopus. The sum floats on a dark glass plate; below it, two glass tubes are divided into
// equal cells, and the cells each fraction counts glow with jelly (pink for the first, gold for the second).
// Every move's working plays by itself (show your work):
//   0. (level 2 only, unlike denominators such as 1/2 + 1/4) drag one denominator onto the other: "× 2" writes itself
//      beside the top and bottom of the first fraction, both roll (1/2 becomes 2/4), and its tube is re-cut: new cut lines
//      draw down each cell, so 1 half becomes 2 quarters.
//   1. drag one fraction onto the other (or one tube onto the other): the gold pieces lift out of their tube one by one
//      and slide into the empty cells after the pink ones; on the plate the two 7s glide together into one, and the tops
//      gather over it: (2 + 3)/7.
//   2. tap the top (or the full tube): "2 + 3 = 5" writes itself beside it, the + 3 slides into the 2, which rolls to 5,
//      the glowing cells pulse one by one as they are counted, and the plate reads 2/7 + 3/7 = 5/7.
// Level 0: sevenths and smaller, small tops. Level 1: up to twelfths. Level 2: halves, thirds or quarters plus a
// denominator that is a multiple (1/2 + 1/4, 2/3 + 1/6), with answers in simplest form.
// Medium mode: the tray asks for the re-cut fraction (level 2) and for the sum (5/7 among 5/14 and others).
const M = MK, INK = '#f4fbff', EY = 226, X0 = 40, BW = 280, BH = 48, YA = 340, YB = 426, OX = 292, OY = 612;
const PINK = '#ff7ab0', GOLD = '#ffd84a', PINKD = '#c03a78', GOLDD = '#b88a10';
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function pick(g) {
  const L = g.level, R = k => Math.floor(g.rand() * k);
  if (L < 2) { for (let tries = 0; ; tries++) { const d = L === 0 ? 4 + R(4) : 6 + R(7), a1 = 1 + R(Math.max(1, Math.floor((d - 1) / 2))), a2 = 1 + R(d - 1 - a1); if (gcd(a1 + a2, d) === 1 || tries > 40) return { a1, d1: d, a2, d2: d, k: 1 }; } }
  const ok = []; for (const d1 of [2, 3, 4]) for (let k = 2; d1 * k <= 12; k++) for (let a1 = 1; a1 < d1; a1++) for (let a2 = 1; a2 < d1 * k; a2++) { const s = a1 * k + a2, d2 = d1 * k; if (s < d2 && gcd(s, d2) === 1 && gcd(a1, d1) === 1) ok.push({ a1, d1, a2, d2, k }); }
  return ok[R(ok.length)];
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
const F = (a, b, col) => M.frac(M.num(a, null, col ? { col } : undefined), M.num(b));

// ---------------- the reef (baked) ----------------
function reef(c, W, H) {
  const wg = c.createLinearGradient(0, 0, 0, H); wg.addColorStop(0, '#3ac8d8'); wg.addColorStop(0.35, '#1a8ab0'); wg.addColorStop(0.75, '#0e5a88'); wg.addColorStop(1, '#0a3a64'); c.fillStyle = wg; c.fillRect(0, 0, W, H);
  // sunbeams through the surface
  c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const x = 20 + i * 62; const gr = c.createLinearGradient(x, 0, x + 80, 480); gr.addColorStop(0, 'rgba(200,255,250,0.16)'); gr.addColorStop(1, 'rgba(200,255,250,0)'); c.fillStyle = gr; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 30, 0); c.lineTo(x + 110, 480); c.lineTo(x + 50, 480); c.fill(); } c.restore();
  c.strokeStyle = 'rgba(255,255,255,0.25)'; c.lineWidth = 2; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(i * 44, 14 + (i % 2) * 6); c.quadraticCurveTo(i * 44 + 22, 6, i * 44 + 44, 14 + ((i + 1) % 2) * 6); c.stroke(); }
  // far reef silhouettes
  c.fillStyle = 'rgba(10,60,100,0.6)'; c.beginPath(); c.moveTo(0, 520); for (let x = 0; x <= W; x += 24) c.lineTo(x, 480 + Math.sin(x * 0.05) * 16 + Math.sin(x * 0.13) * 8); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  // sand
  const sd = c.createLinearGradient(0, 540, 0, H); sd.addColorStop(0, '#e8d0a0'); sd.addColorStop(1, '#c8a870'); c.fillStyle = sd; c.beginPath(); c.moveTo(0, 556); for (let x = 0; x <= W; x += 20) c.lineTo(x, 548 + Math.sin(x * 0.04) * 6); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  const R = P.rng(77); c.fillStyle = 'rgba(160,120,70,0.35)'; for (let i = 0; i < 40; i++) { c.beginPath(); c.arc(R() * W, 560 + R() * 80, 1 + R() * 2, 0, 7); c.fill(); }
  // coral fans and branches
  for (const [x, col, s] of [[30, '#ff7a6a', 1], [86, '#ffb04a', 0.7], [214, '#c86ad8', 0.8], [340, '#ff6a9a', 1.1]]) { c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = 6 * s;
    const br = (x0, y0, a, len, d) => { if (d > 3) return; const x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len; c.lineWidth = (6 - d * 1.3) * s; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); br(x1, y1, a - 0.45, len * 0.72, d + 1); br(x1, y1, a + 0.4, len * 0.72, d + 1); };
    br(x, 566, -Math.PI / 2, 34 * s, 0); }
  for (let i = 0; i < 7; i++) { const x = 120 + i * 14 + R() * 8; c.strokeStyle = '#3aa86a'; c.lineWidth = 4; c.beginPath(); c.moveTo(x, 570); c.quadraticCurveTo(x + 10, 530, x - 4, 500 - R() * 20); c.stroke(); }
  // shells and a starfish
  c.fillStyle = '#ffd0b0'; c.beginPath(); c.ellipse(170, 600, 9, 6, 0.3, 0, 7); c.fill(); c.fillStyle = '#ff8a5a'; c.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, r = i % 2 ? 5 : 13; c.lineTo(230 + Math.cos(a) * r, 616 + Math.sin(a) * r); } c.fill();
}

MG.add({
  id: 'fractions_add', stage: 'fractions', cmd: 'ADD FRACTIONS!', hint: 'drag', time: 9, mood: 'sea', winText: 'Added!', hold: 1.7,
  card: {
    title: 'Adding fractions', ref: 'Grade 4', kind: 'Fractions',
    text: 'The bottom of a fraction says how big the pieces are. 2/7 means 2 pieces, each one seventh of the whole. The top counts the pieces.\n\nTo add 2/7 + 3/7, put the pieces together: 2 sevenths and 3 sevenths make 5 sevenths. The pieces are still sevenths, so the bottom stays 7: 2/7 + 3/7 = 5/7. Adding the bottoms (5/14) would be wrong, because that would make every piece smaller.\n\nWhen the pieces are different sizes, cut them to match first. 1/2 is the same as 2/4, so 1/2 + 1/4 = 2/4 + 1/4 = 3/4.',
    note: 'When the bottoms match, add the tops and keep the bottom. When they don\'t, make them match first.',
    ask: 'What is 3/8 + 4/8? What is 1/3 + 1/6?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a1, d1, a2, d2, k } = S;
    S.dA = d1; S.aA = a1; S.got = 0; S.bLeft = a2; S.pcs = []; S.recut = null; S.face = 'happy'; S.count = null;
    S.n1 = M.num(a1, 'n1', { col: PINK }); S.d1n = M.num(d1, 'd1'); S.n2 = M.num(a2, 'n2', { col: GOLD }); S.d2n = M.num(d2, 'd2');
    S.f1 = M.frac(S.n1, S.d1n, 'f1'); S.f2 = M.frac(S.n2, S.d2n, 'f2'); S.pl = M.op('+', 'p0'); S.eq = M.op('=', 'eq'); S.Q = M.slot('ans', { col: '#8ad8f0' });
    S.set = items => { S.row = M.row(...items); M.place(g, 'ex', S.row, 180, EY, 44, { col: INK }); };
    S.set([S.f1, S.pl, S.f2, S.eq, S.Q]); M.inert(g, ['p0', 'eq', 'res']);
    S.cellX = (i, d) => X0 + (i + 0.5) * BW / d;
    const zones = () => { M.zone(g, 'barA', { x: X0 + BW / 2, y: YA, w: BW, h: BH }); M.zone(g, 'barB', { x: X0 + BW / 2, y: YB, w: BW, h: BH }); }; zones();
    g.dur *= (2.6 + 1.05 * (k > 1 ? 3 : 2)) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };

    // 0. make the pieces the same size (level 2)
    const commonMove = () => { const T = M.pace(g);
      return { busy: 0.1, askAt: 0.55 * T, after: 0.9 * T, ask: { v: F(a1 * k, d2), wrong: [F(a1, d2), F(a1 + k, d2), F(a1 * k, d1)] },
        then(g) { S.common = true; M.show(g, 0.55 * T); hop(g, 'think'); S.point = true; g.sfx('swoosh');
          M.circle(g, 'd1', { dur: 0.45 * T, col: '#8af0ff' }); M.circle(g, 'd2', { dur: 0.45 * T, col: '#8af0ff', delay: 0.08 * T });
          for (const id of ['n1', 'd1']) M.note(g, { node: M.row(M.op('×'), M.num(k)), at: id, off: [-40, 0], s: 26, col: '#8af0ff', write: 0.3 * T, hold: 0.5 * T + 0.3 * T, fade: 0.2 * T, delay: 0.15 * T }); },
        resolve(g) { M.show(g, 0.9 * T); M.roll(g, S.n1, a1 * k, { dur: 0.35 * T }); M.roll(g, S.d1n, d2, { dur: 0.35 * T, delay: 0.06 * T }); g.sfx('tap');
          S.recut = { t0: g.t + 0.1 * T, dur: 0.45 * T, from: d1 };
          M.at(g, [[0.1 * T, g => { S.dA = d2; S.aA = a1 * k; }], [0.55 * T, g => { g.sfx('ding'); hop(g); M.sparkle(g, [X0 + BW / 2, YA], { n: 10, cols: ['#8af0ff', '#fff'] }); M.indicate(g, S.f1, { dur: 0.35 * T, sc: 1.15, col: '#8af0ff' }); }],
            [0.85 * T, g => { S.point = false; S.recut = null; }]]); } };
    };
    // 1. put the pieces together
    const mergeMove = () => { const T = M.pace(g), per = Math.min(0.14, 0.7 / a2) * T, land = 0.25 * T + a2 * per + 0.3 * T;
      return { busy: 0.1, then(g) { S.merged = true; M.show(g, land + 0.15 * T); hop(g, 'wow'); S.point = true; g.sfx('swoosh');
          M.circle(g, 'f1', { dur: 0.45 * T, col: PINK }); M.circle(g, 'f2', { dur: 0.45 * T, col: GOLD, delay: 0.06 * T });
          const st = []; for (let j = 0; j < a2; j++) st.push([0.25 * T + j * per, g => { const from = a2 - 1 - j; S.bLeft = from; const to = S.aA + j;
            S.pcs.push({ x0: S.cellX(from, d2), y0: YB, x1: S.cellX(to, d2), y1: YA, t0: g.t, dur: 0.3 * T, then: g => { S.got++; g.sfx('tap', { pitch: 1 + j * 0.08, vol: 0.5 }); } }); }]);
          // on the plate: the second bottom glides onto the first, and the tops gather over one bottom
          st.push([0.3 * T, g => { const b1 = M.box(g, 'd1'), b2 = M.box(g, 'd2'); if (b1 && b2) M.tween(g, S.d2n, { dx: b1.x - b2.x, alpha: 0 }, 0.35 * T); M.indicate(g, S.d1n, { delay: 0.25 * T, dur: 0.35 * T, sc: 1.3, col: '#8af0ff' }); }]);
          st.push([0.75 * T, g => { S.top = M.row(S.n1, S.pl, S.n2); S.top.id = 'top'; S.pl.id = 'p1'; S.F = M.frac(S.top, S.d1n, 'F'); S.set([S.F, S.eq, S.Q]); g.sfx('pop'); hop(g); }]);
          st.push([land, g => { S.point = false; hop(g); }]);
          M.at(g, st); } };
    };
    // 2. add the tops
    const sumMove = () => { const T = M.pace(g), s = a1 * k + a2;
      return { tap: ['top', 'n1', 'p1', 'n2', 'barA', 'F'], busy: 0.1, askAt: 0.55 * T, after: 1.45 * T, ask: { v: F(s, d2), wrong: [F(s, 2 * d2), F(s + 1, d2), F(a1 + a2, d1 + d2)] },
        then(g) { S.summed = true; M.show(g, 0.55 * T); hop(g, 'think'); S.point = true; M.circle(g, 'top', { dur: 0.5 * T });
          M.note(g, { node: M.row(M.num(a1 * k, null, { col: PINK }), M.op('+'), M.num(a2, null, { col: GOLD }), M.op('='), M.num(s)), at: [180, EY + 58], s: 28, col: INK, pill: 'rgba(6,30,60,0.75)', write: 0.4 * T, hold: 0.7 * T, fade: 0.25 * T, delay: 0.1 * T }); },
        resolve(g) { M.show(g, 1.45 * T); const per = Math.min(0.09, 0.6 / s) * T;
          M.at(g, [
            [0.2 * T, g => { const b0 = M.box(g, 'n1'); for (const q of [S.pl, S.n2]) { const b = M.box(g, q.id); if (b && b0) M.tween(g, q, { dx: b0.x - b.x, alpha: 0, sc: 0.6 }, 0.3 * T); } M.roll(g, S.n1, s, { delay: 0.02 * T, dur: 0.26 * T }); S.count = { t0: g.t + 0.1 * T, per }; }],
            [0.5 * T, g => { S.n1.col = '#ffb0e0'; S.F = M.frac(S.n1, S.d1n, 'res'); S.set([S.F, S.eq, S.Q]); M.sparkle(g, 'res', { n: 10, cols: [PINK, GOLD, '#fff'] }); g.sfx('ding'); hop(g); }],
            [0.5 * T + s * per + 0.1 * T, g => { // the plate reads the whole sum again, and the answer settles after the =
              S.n1.col = INK; S.Q.fill = S.F; S.set([F(a1, d1, PINK), M.op('+'), F(a2, d2, GOLD), S.eq, S.Q]); M.sparkle(g, 'ans', { n: 16, cols: [PINK, GOLD, '#8af0ff', '#fff'] }); g.sfx('coin'); g.sfx('sparkle'); hop(g, 'laugh'); S.point = false; }],
          ]); } };
    };
    M.play(g, {
      moves(g) {
        if (k > 1 && !S.common) { const cm = commonMove(); return [{ ...cm, drag: 'd1', to: 'd2' }, { ...cm, drag: 'd2', to: 'd1' }]; }
        if (k > 1 && S.dA !== d2) return [];
        if (!S.merged) { const mm = mergeMove(); return [{ ...mm, drag: 'f2', to: ['f1', 'n1', 'd1'] }, { ...mm, drag: ['n2', 'd2'], to: ['f1', 'n1', 'd1'] }, { ...mm, drag: ['f1', 'n1', 'd1'], to: ['f2', 'n2', 'd2'] }, { ...mm, drag: 'barB', to: 'barA' }, { ...mm, drag: 'barA', to: 'barB' }]; }
        if (!S.top || S.got < a2) return [];
        if (S.summed) return [];
        return [sumMove()];
      },
      area(g) { const mv = M.current(g)[0]; return mv ? [].concat(mv.drag || mv.tap).slice(0, 1) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); const S = g.s; S.pcs = S.pcs.filter(p => { if (g.t - p.t0 >= p.dur) { if (p.then) p.then(g); return false; } return true; }); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    c.drawImage(g.bake('fracadd_reef', reef), 0, 0, 360, 640);
    // rising bubbles and a drifting school of tiny fish
    for (let i = 0; i < 14; i++) { const x = (i * 59 + Math.sin(t + i) * 8) % 360, y = 640 - ((t * (22 + (i % 4) * 8) + i * 97) % 640); c.strokeStyle = 'rgba(220,250,255,0.55)'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, 2 + (i % 3) * 1.5, 0, 7); c.stroke(); }
    for (let i = 0; i < 6; i++) { const x = (t * 26 + i * 18) % 460 - 50, y = 470 + Math.sin(t * 2 + i) * 6 + (i % 3) * 8; c.fillStyle = '#ffd86a'; c.beginPath(); c.ellipse(x, y, 6, 3, 0, 0, 7); c.fill(); c.beginPath(); c.moveTo(x - 5, y); c.lineTo(x - 10, y - 3); c.lineTo(x - 10, y + 3); c.fill(); }
    // the glass plate with the sum
    c.save(); c.fillStyle = 'rgba(4,20,44,0.6)'; rr(c, 26, EY - 62, 308, 92, 18); c.fill(); c.strokeStyle = 'rgba(140,240,255,0.7)'; c.lineWidth = 2.5; c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.12)'; rr(c, 34, EY - 56, 292, 12, 6); c.fill(); c.restore();
    M.drawEx(g, c, 'ex');
    // the two glass tubes
    const tube = (y, d, fill, recut) => {
      c.save(); c.fillStyle = 'rgba(4,20,44,0.45)'; rr(c, X0 - 6, y - BH / 2 - 6, BW + 12, BH + 12, 14); c.fill();
      c.fillStyle = 'rgba(200,245,255,0.18)'; rr(c, X0, y - BH / 2, BW, BH, 9); c.fill();
      for (let i = 0; i < d; i++) { const col = fill(i); if (!col) continue; const x = X0 + i * BW / d, w = BW / d;
        const gr = c.createLinearGradient(0, y - BH / 2, 0, y + BH / 2); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.25, col[0]); gr.addColorStop(1, col[1]);
        c.fillStyle = gr; c.shadowColor = col[2] ? '#ffffff' : col[0]; c.shadowBlur = col[2] ? 22 : 10; rr(c, x + 2, y - BH / 2 + 2 - (col[2] ? 4 : 0), w - 4, BH - 4, 6); c.fill(); if (col[2]) { c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.stroke(); } c.shadowBlur = 0; }
      c.strokeStyle = 'rgba(230,252,255,0.9)'; c.lineWidth = 2;
      const dd = recut ? recut.from : d; for (let i = 1; i < dd; i++) { const x = X0 + i * BW / dd; c.beginPath(); c.moveTo(x, y - BH / 2); c.lineTo(x, y + BH / 2); c.stroke(); }
      if (recut) { const kk = M.easeIO((t - recut.t0) / recut.dur); c.strokeStyle = '#8af0ff'; c.shadowColor = '#8af0ff'; c.shadowBlur = 8; c.lineWidth = 2.5;
        for (let i = 1; i < d; i++) { if (i % (d / dd) === 0) continue; const x = X0 + i * BW / d; c.beginPath(); c.moveTo(x, y - BH / 2); c.lineTo(x, y - BH / 2 + BH * kk); c.stroke(); } }
      c.shadowBlur = 0; c.strokeStyle = '#d8faff'; c.lineWidth = 3; rr(c, X0, y - BH / 2, BW, BH, 9); c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.4)'; rr(c, X0 + 8, y - BH / 2 + 4, BW - 16, 5, 2.5); c.fill(); c.restore(); };
    const cnt = S.count, lit = i => cnt && t >= cnt.t0 + i * cnt.per && t < cnt.t0 + i * cnt.per + 0.25;
    tube(YA, S.dA, i => { const col = i < S.aA ? [PINK, PINKD] : i < S.aA + S.got ? [GOLD, GOLDD] : null; return col && lit(i) ? [col[0], col[1], 1] : col; }, S.recut && S.dA !== S.recut.from ? S.recut : null);
    tube(YB, S.d2, i => i < S.bLeft ? [GOLD, GOLDD] : null);
    // the count of glowing cells, as each is counted
    if (cnt) { const n = Math.min(S.a1 * S.k + S.a2, Math.floor((t - cnt.t0) / cnt.per) + 1); if (n > 0 && t - cnt.t0 < (S.a1 * S.k + S.a2) * cnt.per + 0.6) { const i = n - 1, x = S.cellX(i, S.dA);
      c.save(); c.font = M.NUMF(22, 700); c.textAlign = 'center'; c.lineWidth = 4; c.strokeStyle = 'rgba(4,20,44,0.9)'; c.strokeText(String(n), x, YA + BH / 2 + 24); c.fillStyle = '#fff'; c.fillText(String(n), x, YA + BH / 2 + 24); c.restore(); } }
    // pieces in flight from one tube to the other
    for (const p of S.pcs) { const kk = M.easeIO((t - p.t0) / p.dur), x = M.lerp(p.x0, p.x1, kk), y = M.lerp(p.y0, p.y1, kk) - Math.sin(kk * Math.PI) * 34, w = BW / S.d2 - 4;
      c.save(); c.fillStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 14; rr(c, x - w / 2, y - BH / 2 + 2, w, BH - 4, 6); c.fill(); c.restore(); }
    // a dragged tube shows a ghost of itself under the finger
    const P0 = K.press; if (P0 && P0.dragging && /^bar/.test(P0.id)) { c.save(); c.globalAlpha = 0.5; c.strokeStyle = '#d8faff'; c.lineWidth = 3; rr(c, P0.x - 70, P0.y - 30, 140, BH, 9); c.stroke(); c.restore(); }
    // the octopus
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missK = K.missAt >= 0 && t - K.missAt < 0.5;
    const expr = won ? 'laugh' : lost || missK ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'octopus', OX + (missK ? Math.sin((t - K.missAt) * 40) * 3 : 0), OY - hopK * 18 + Math.sin(t * 1.5) * 3, 1.25, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'octopus', OX, OY, 1.25);
    M.drawUI(g, c);
  },
});
