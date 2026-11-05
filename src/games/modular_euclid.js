// modular_euclid.js — EUCLID! Find gcd(a, b) with the Euclidean algorithm, as cutting squares off a rectangle.
// A rectangle a × b is laid out in tiles on the desert sand, under a wooden sign reading gcd(48, 18). The player drags
// the smaller number onto the larger (or onto the rectangle), and the cut is acted out (show your work): the two numbers
// are circled, b × b squares are chopped off the long side one after another, and the note "48 = 2 × 18 + 12" writes
// itself under the rectangle. The remainder 12 flies up into the sign, where 48 rolls over to 12, and the camera zooms in
// on the leftover 12 × 18 rectangle, so what is left always fills the view and its sides match the sign. When a cut
// leaves nothing, the camera pulls back out to the whole rectangle, a grid of gcd × gcd squares sweeps across it (they
// tile all of it), and the sign reads gcd(48, 18) = 6.
// Level 0: two cuts. Level 1: three cuts. Level 2: three or four cuts with bigger numbers.
// Medium mode: each cut asks for what is left of the larger number (the note shows "48 = 2 × 18 + ?").
// Wrong parts: the larger number (it cannot be cut by the smaller one the other way round).
const M = MK, PANEL = 'sign', INK = SCN.ink(PANEL), PY = 226, BOX = [24, 270, 336, 446], NOTEY = 484, NCOL = '#5a2a0a', HX = 300, HY = 600;
const POOL = [[[12, 8], [15, 6], [20, 8], [18, 12], [21, 9], [14, 4]], [[48, 18], [42, 30], [50, 35], [30, 18], [40, 24]], [[45, 33], [52, 36], [70, 26], [66, 42]]];
const COLS = ['#e89a50', '#5ab0c8', '#9ac860', '#d87aa0', '#c8a0f0'];
// the camera: the part of the slab (in tile units) that is fitted into BOX
function geom(V) { const sc = Math.min((BOX[2] - BOX[0]) / V.w, (BOX[3] - BOX[1]) / V.h); return { sc, x0: 180 - (V.x + V.w / 2) * sc, y0: (BOX[1] + BOX[3]) / 2 - (V.y + V.h / 2) * sc }; }
function view(g) { const S = g.s, Z = S.zoom; if (!Z) return S.V; const k = M.easeIO((g.t - Z.t0) / Z.dur); return { x: M.lerp(Z.a.x, Z.b.x, k), y: M.lerp(Z.a.y, Z.b.y, k), w: M.lerp(Z.a.w, Z.b.w, k), h: M.lerp(Z.a.h, Z.b.h, k) }; }
function zoomTo(g, V, dur) { const S = g.s; S.zoom = { a: view(g), b: V, t0: g.t, dur }; S.V = V; }
// a view of the rectangle with a margin round it, so its edge labels and a sliver of the cut squares show
const around = r => { const m = Math.max(r.w, r.h) * 0.08; return { x: r.x - m, y: r.y - m, w: r.w + 2 * m, h: r.h + 2 * m }; };

MG.add({
  id: 'modular_euclid', stage: 'modular', cmd: 'EUCLID!', hint: 'drag', time: 9, mood: 'desert', winText: 'Greatest!', hold: 1.6,
  card: {
    title: 'The Euclidean algorithm', ref: 'College', kind: 'Number theory',
    text: 'The greatest common divisor of two numbers, written gcd, is the biggest number that divides both of them exactly. Euclid found a fast way to get it, more than 2,000 years ago.\n\nTake away the smaller number from the bigger one as many times as you can. Keep what is left, and do it again with the two smaller numbers. When nothing is left, the last number you took away is the gcd.\n\nFor gcd(48, 18): 48 − 18 − 18 = 12, then 18 − 12 = 6, then 12 − 6 − 6 = 0. So gcd(48, 18) = 6.\n\nWhy it works: any number that divides both 48 and 18 also divides 48 − 18 − 18 = 12, so the common divisors never change. On a 48 × 18 rectangle, each step cuts off squares, and the last squares, 6 × 6, tile the whole rectangle.',
    note: 'gcd(a, b) = gcd(a mod b, b). Keep replacing the bigger number by its remainder after dividing by the smaller one. When a remainder is 0, the other number is the gcd.',
    ask: 'What is gcd(30, 12)? What is gcd(35, 21)?',
  },
  init(g) {
    const S = g.s; M.setup(g); const pool = POOL[g.level], [a, b] = pool[Math.floor(g.rand() * pool.length)], T = M.pace(g);
    Object.assign(S, { a, b, v: [a, b], rect: { x: 0, y: 0, w: a, h: b }, sq: [], step: 0, done: false });
    S.V = around(S.rect);
    S.nums = [M.num(a, 'n0'), M.num(b, 'n1')];
    S.sign = M.row(M.txt('gcd', 'gcd'), M.paren(M.row(S.nums[0], M.op(',', 'cm'), M.gap(6), S.nums[1]), 'par')); S.sign.id = 'sign'; S.pw = 230;
    const place = () => M.place(g, 'ex', S.sign, 180, PY + 14, 40, { col: INK }); S.place = place; place();
    M.inert(g, ['gcd', 'cm', 'par', 'eq', 'res', 'note', 'sign']);
    let p = a, q = b, n = 0; while (q) { [p, q] = [q, p % q]; n++; } S.gcd = p; g.dur *= (2.6 + 1.05 * n) / 8;
    const hop = g => { g.s.mk.lastMove = g.t; };
    M.play(g, {
      moves(g) {
        if (S.cutting || S.done) return [];
        const big = S.v[0] > S.v[1] ? 0 : 1, sm = 1 - big, L = S.v[big], s = S.v[sm], rem = L % s, cnt = Math.floor(L / s);
        const tCut = 0.12 * T, gapT = (cnt > 2 ? 0.17 : 0.22) * T, tNote = tCut + cnt * gapT - 0.05 * T, askAt = tNote + 0.42 * T;
        return [{ drag: 'n' + sm, to: 'n' + big, busy: 0.1, area: [BOX[0], BOX[1] - 10, BOX[2], BOX[3] + 10], askAt, after: 0.95 * T,
          ask: { v: rem, wrong: [L - s, s, rem + s, rem ? rem - 1 : s - 1] },
          then(g) {
            S.cutting = true; M.show(g, askAt); hop(g); g.sfx('swoosh');
            M.circle(g, ['n' + big, 'n' + sm], { dur: 0.55 * T, col: '#fff0b0' }); M.light(g, 'n' + sm, { col: '#ffe08a' });
            // the squares are chopped off the long side one after another
            const r = S.rect, wide = r.w >= r.h;
            for (let k = 0; k < cnt; k++) S.sq.push({ x: wide ? r.x + k * s : r.x, y: wide ? r.y : r.y + k * s, s, step: S.step, at: g.t + tCut + k * gapT, n: k + 1 });
            if (wide) { r.x += cnt * s; r.w -= cnt * s; } else { r.y += cnt * s; r.h -= cnt * s; }
            S.step++;
            M.at(g, [...Array(cnt)].map((_, k) => [tCut + k * gapT, g => { g.sfx('crunch'); hop(g); }]));
            // the note: 48 = 2 × 18 + 12 (the remainder waits as a ? in medium mode)
            S.rem = M.slot('nr', { w: 30, col: NCOL });
            S.note = M.row(M.num(L, 'nL'), M.op('='), M.num(cnt, 'nc'), M.op('×'), M.num(s, 'ns'), M.op('+'), S.rem); S.note.id = 'note';
            M.at(g, [[tNote, g => { M.place(g, 'note', S.note, 180, NOTEY, 30, { col: NCOL }); M.writeIn(g, S.note, { dur: 0.36 * T }); }]]);
          },
          resolve(g) {
            M.show(g, 0.95 * T); const rn = M.num(rem, 'nrv', { col: '#b8400a' }); S.rem.fill = rn; M.place(g, 'note', S.note, 180, NOTEY, 30, { col: NCOL });
            M.writeIn(g, rn, { dur: 0.18 * T }); M.indicate(g, rn, { delay: 0.12 * T, dur: 0.3 * T, sc: 1.4 }); g.sfx('ding');
            M.at(g, [
              [0.3 * T, g => { // the remainder flies up into the sign and the big number rolls over to it
                const from = { ...M.box(g, 'nrv') }; rn.alpha = 0;
                M.fly(g, { node: M.num(rem, null, { col: '#b8400a' }), from: [from.x, from.y], to: 'n' + big, dur: 0.32 * T, arc: -40, s0: 30, s1: 40,
                  then(g) { M.unlight(g, 'n' + sm); M.roll(g, S.nums[big], rem, { dur: 0.3 * T }); S.v[big] = rem; place(); M.sparkle(g, 'n' + big, { n: 8 }); g.sfx(rem ? 'coin' : 'pop'); hop(g); } });
                M.tween(g, S.note, { alpha: 0 }, 0.3 * T, { delay: 0.2 * T }); }],
              [0.62 * T, g => { delete g.s.mk.ex.note; S.cutting = false;
                if (rem) { zoomTo(g, around(S.rect), 0.36 * T); return; }
                // the end: pull back out to the whole slab; the last squares' side tiles all of it
                S.done = true; zoomTo(g, around({ x: 0, y: 0, w: a, h: b }), 0.4 * T); S.gridAt = g.t + 0.4 * T; }],
            ]);
            if (!rem) M.at(g, [[0.95 * T, g => { // gcd(48, 18) = 6: the numbers roll back to the problem's, then the answer drops in
              M.show(g, 1.05 * T); M.roll(g, S.nums[0], a, { dur: 0.3 * T }); M.roll(g, S.nums[1], b, { dur: 0.3 * T }); place(); g.sfx('magic'); hop(g); }],
              [1.35 * T, g => { S.res = M.num(S.gcd, 'res', { col: '#ffe08a', alpha: 0 }); S.sign.items.push(M.op('=', 'eq'), S.res); place();
                const lq = S.sq[S.sq.length - 1], G = geom(S.V);
                M.fly(g, { node: M.num(S.gcd, null, { col: '#ffe08a' }), from: [G.x0 + (lq.x + lq.s / 2) * G.sc, G.y0 + (lq.y + lq.s / 2) * G.sc], to: 'res', delay: 0.12 * T, dur: 0.4 * T, arc: -50, s0: 24, s1: 40,
                  then(g) { S.res.alpha = 1; S.res.pop = g.t; M.sparkle(g, 'res', { n: 14, cols: ['#ffe08a', '#fff', '#e89a50'] }); g.sfx('ding'); hop(g); } }); }]]);
          } }];
      },
      area(g) { return ['n0', 'n1']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, G = geom(view(g)), X = u => G.x0 + u * G.sc, Y = u => G.y0 + u * G.sc;
    SCN.std(g, c, { scene: 'desert', panel: PANEL, panelY: PY, panelH: 74, panelW: S.pw });
    const sb = M.box(g, 'sign'); if (sb) S.pw += (Math.max(230, sb.w + 64) - S.pw) * 0.2;
    c.save(); c.beginPath(); c.rect(0, BOX[1] - 4, 360, BOX[3] - BOX[1] + 20); c.clip();
    // the slab of sand-stone: the part not cut yet (squares still waiting to be cut count as uncut)
    c.fillStyle = 'rgba(90,50,20,0.25)'; c.fillRect(X(0) + 4, Y(0) + 6, S.a * G.sc, S.b * G.sc);
    const pend = S.sq.filter(q => t < q.at), r = S.rect, U = pend.length ? M.unionBox([r, ...pend.map(q => ({ w: q.s, h: q.s, x: q.x, y: q.y }))].map(q => ({ x: q.x + q.w / 2, y: q.y + q.h / 2, w: q.w, h: q.h }))) : null;
    const uc = U ? { x: U.x - U.w / 2, y: U.y - U.h / 2, w: U.w, h: U.h } : r;
    if (uc.w > 0 && uc.h > 0) {
      c.fillStyle = '#f6e2b0'; c.fillRect(X(uc.x), Y(uc.y), uc.w * G.sc, uc.h * G.sc);
      if (G.sc >= 5) { c.strokeStyle = 'rgba(150,100,50,0.25)'; c.lineWidth = 1; c.beginPath(); for (let u = Math.ceil(uc.x + 0.01); u < uc.x + uc.w; u++) { c.moveTo(X(u), Y(uc.y)); c.lineTo(X(u), Y(uc.y + uc.h)); } for (let u = Math.ceil(uc.y + 0.01); u < uc.y + uc.h; u++) { c.moveTo(X(uc.x), Y(u)); c.lineTo(X(uc.x + uc.w), Y(u)); } c.stroke(); }
      if (!S.done) { c.save(); c.setLineDash([7, 5]); c.lineDashOffset = -t * 20; c.strokeStyle = '#a0602a'; c.lineWidth = 2.5; c.strokeRect(X(uc.x), Y(uc.y), uc.w * G.sc, uc.h * G.sc); c.restore(); }
    }
    // the squares cut off so far, each step in its own colour, with its side written in it; a saw line flashes as it is cut
    for (const q of S.sq) {
      const k = M.clamp((t - q.at) / 0.24, 0, 1); if (k <= 0) continue; const sz = q.s * G.sc, cx = X(q.x + q.s / 2), cy = Y(q.y + q.s / 2), sc = 0.82 + 0.18 * M.ease(k) + Math.sin(k * Math.PI) * 0.1;
      const last = S.done && q.s === S.gcd;
      c.save(); c.translate(cx, cy); c.scale(sc, sc); c.fillStyle = COLS[q.step % COLS.length]; c.fillRect(-sz / 2 + 1, -sz / 2 + 1, sz - 2, sz - 2);
      c.strokeStyle = last ? '#fff6c0' : 'rgba(80,40,20,0.55)'; c.lineWidth = last ? 3 : 1.5; c.strokeRect(-sz / 2 + 1, -sz / 2 + 1, sz - 2, sz - 2);
      if (sz >= 22) { c.fillStyle = '#fffaf0'; c.font = M.NUMF(Math.min(26, sz * 0.4)); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(q.s), 0, 1); }
      c.restore();
      if (k < 1) { c.save(); c.globalAlpha = 1 - k; c.strokeStyle = '#fffbe0'; c.shadowColor = '#fff0a0'; c.shadowBlur = 12; c.lineWidth = 4; c.strokeRect(X(q.x), Y(q.y), sz, sz); c.restore(); }
    }
    // the finale: the gcd's squares sweep across the whole slab and tile it exactly
    if (S.gridAt != null && t > S.gridAt) {
      const k = M.clamp((t - S.gridAt) / 0.6, 0, 1), d = S.gcd, xe = S.a * M.easeIO(k);
      c.save(); c.strokeStyle = 'rgba(255,250,225,0.9)'; c.shadowColor = '#fff0a0'; c.shadowBlur = 6; c.lineWidth = 2; c.beginPath();
      for (let u = d; u < S.a; u += d) if (u <= xe) { c.moveTo(X(u), Y(0)); c.lineTo(X(u), Y(S.b)); }
      for (let u = d; u < S.b; u += d) { c.moveTo(X(0), Y(u)); c.lineTo(X(xe), Y(u)); } c.stroke();
      c.strokeStyle = '#fff6c0'; c.lineWidth = 3; c.strokeRect(X(0), Y(0), S.a * G.sc, S.b * G.sc); c.restore();
    }
    // the sides of what is left (or of the whole slab at the end), written along its edges
    const lab = S.done ? { x: 0, y: 0, w: S.a, h: S.b } : uc;
    if (lab.w > 0 && lab.h > 0) { c.fillStyle = '#6a3a1a'; c.font = M.NUMF(16); c.textAlign = 'center'; c.textBaseline = 'middle';
      if (lab.w * G.sc > 24) c.fillText(String(lab.w), X(lab.x + lab.w / 2), Math.min(BOX[3] + 10, Y(lab.y + lab.h) + 11)); if (lab.h * G.sc > 18) c.fillText(String(lab.h), Math.min(350, X(lab.x + lab.w) + 12), Y(lab.y + lab.h / 2)); }
    c.restore();
    M.drawEx(g, c, 'ex'); M.drawEx(g, c, 'note');
    SCN.host(g, c, 'hedgehog', HX, HY, 1.2);
    M.drawUI(g, c);
  },
});
