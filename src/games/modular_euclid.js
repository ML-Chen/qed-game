// modular_euclid.js — EUCLID! Find gcd(a, b) with the Euclidean algorithm, as cutting squares off a rectangle.
// A rectangle a × b is laid out in tiles on the desert sand, under a wooden sign reading gcd(48, 18). The player drags
// the smaller number onto the larger (or onto the rectangle): as many b × b squares as fit are cut off the long side
// at once, and the larger number becomes what is left (48 − 18 − 18 = 12, so gcd(48, 18) becomes gcd(12, 18)). The
// next drag cuts 12 × 12 squares off the 12 × 18 rectangle, and so on. When a cut leaves nothing, the last squares
// fit exactly, their side is the gcd, and the sign reads gcd(48, 18) = 6.
// Level 0: two cuts. Level 1: three cuts. Level 2: three or four cuts with bigger numbers.
// Medium mode: each cut asks for what is left of the larger number.
// Wrong parts: the larger number (it cannot be cut by the smaller one the other way round).
const M = MK, PANEL = 'sign', INK = SCN.ink(PANEL), PY = 226, BOX = [24, 268, 336, 448];
const POOL = [[[12, 8], [15, 6], [20, 8], [18, 12], [21, 9], [14, 4]], [[48, 18], [42, 30], [50, 35], [30, 18], [40, 24]], [[45, 33], [52, 36], [70, 26], [66, 42]]];
const COLS = ['#e89a50', '#5ab0c8', '#9ac860', '#d87aa0', '#c8a0f0'];
function geom(S) { const sc = Math.min((BOX[2] - BOX[0]) / S.a, (BOX[3] - BOX[1]) / S.b); return { sc, x0: 180 - S.a * sc / 2, y0: (BOX[1] + BOX[3]) / 2 - S.b * sc / 2 }; }

MG.add({
  id: 'modular_euclid', stage: 'modular', cmd: 'EUCLID!', hint: 'drag', time: 9, mood: 'desert', winText: 'Greatest!', hold: 1.4,
  card: {
    title: 'The Euclidean algorithm', ref: 'College', kind: 'Number theory',
    text: 'The greatest common divisor of two numbers, written gcd, is the biggest number that divides both of them exactly. Euclid found a fast way to get it, more than 2,000 years ago.\n\nTake away the smaller number from the bigger one as many times as you can. Keep what is left, and do it again with the two smaller numbers. When nothing is left, the last number you took away is the gcd.\n\nFor gcd(48, 18): 48 − 18 − 18 = 12, then 18 − 12 = 6, then 12 − 6 − 6 = 0. So gcd(48, 18) = 6.\n\nWhy it works: any number that divides both 48 and 18 also divides 48 − 18 − 18 = 12, so the common divisors never change. On a 48 × 18 rectangle, each step cuts off squares, and the last squares, 6 × 6, tile the whole rectangle.',
    note: 'gcd(a, b) = gcd(a mod b, b). Keep replacing the bigger number by its remainder after dividing by the smaller one. When a remainder is 0, the other number is the gcd.',
    ask: 'What is gcd(30, 12)? What is gcd(35, 21)?',
  },
  init(g) {
    const S = g.s; M.setup(g); const pool = POOL[g.level]; let [a, b] = pool[Math.floor(g.rand() * pool.length)];
    Object.assign(S, { a, b, v: [a, b], rect: { x: 0, y: 0, w: a, h: b }, sq: [], step: 0, done: false });
    S.ex = () => M.row(M.txt('gcd', 'gcd'), M.paren(M.row(M.num(S.done ? a : S.v[0], 'n0', { pop: S.pop0 }), M.op(',', 'cm'), M.gap(6), M.num(S.done ? b : S.v[1], 'n1', { pop: S.pop1 })), 'par'), S.done ? M.op('=', 'eq') : null, S.done ? M.num(S.gcd, 'res', { pop: g.t, col: '#ffe08a' }) : null);
    const place = () => M.place(g, 'ex', S.ex(), 180, PY + 14, 40, { col: INK }); S.place = place; place();
    M.inert(g, ['gcd', 'cm', 'par', 'eq', 'res']);
    let p = a, q = b, n = 0; while (q) { [p, q] = [q, p % q]; n++; } S.gcd = p; g.dur *= (2.6 + 1.05 * n) / 8;
    const G = geom(S);
    M.play(g, {
      moves(g) {
        if (S.done) return [];
        const big = S.v[0] > S.v[1] ? 0 : 1, sm = 1 - big, L = S.v[big], s = S.v[sm], rem = L % s, cnt = Math.floor(L / s);
        return [{ drag: 'n' + sm, to: 'n' + big, busy: 0.1, area: [BOX[0], BOX[1] - 10, BOX[2], BOX[3] + 10], askAt: 0, after: 0.1,
          ask: { v: rem, wrong: [L - s, s, rem + s, rem ? rem - 1 : s - 1] },
          then(g) {
            const r = S.rect, wide = r.w >= r.h;
            for (let k = 0; k < cnt; k++) S.sq.push({ x: wide ? r.x + k * s : r.x, y: wide ? r.y : r.y + k * s, s, step: S.step, at: g.t + k * 0.06 });
            if (wide) { r.x += cnt * s; r.w -= cnt * s; } else { r.y += cnt * s; r.h -= cnt * s; }
            S.step++; g.sfx('crunch'); S.cutAt = g.t;
          },
          resolve(g) {
            S.v[big] = rem; S['pop' + big] = g.t; if (!rem) { S.done = true; g.sfx('magic'); } else g.sfx('coin'); place();
            const bx = M.box(g, 'n' + big); if (bx) g.burst(bx.x, bx.y, ['#ffe08a', '#fff', '#e89a50'], 10, 110);
          } }];
      },
      area(g) { return ['n0', 'n1']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, G = geom(S), X = u => G.x0 + u * G.sc, Y = u => G.y0 + u * G.sc;
    SCN.std(g, c, { scene: 'desert', panel: PANEL, panelY: PY, panelH: 74, panelW: S.done ? 300 : 230, host: 'hedgehog', hostX: 300, hostY: 600, hostS: 1.2 });
    // the slab of sand-stone: the part not cut yet, with its two sides written along its edges
    c.fillStyle = 'rgba(90,50,20,0.25)'; c.fillRect(X(0) + 4, Y(0) + 6, S.a * G.sc, S.b * G.sc);
    const r = S.rect;
    if (r.w > 0 && r.h > 0) {
      c.fillStyle = '#f6e2b0'; c.fillRect(X(r.x), Y(r.y), r.w * G.sc, r.h * G.sc);
      c.strokeStyle = 'rgba(150,100,50,0.25)'; c.lineWidth = 1; for (let u = r.x + 1; u < r.x + r.w; u++) { c.beginPath(); c.moveTo(X(u), Y(r.y)); c.lineTo(X(u), Y(r.y + r.h)); c.stroke(); } for (let u = r.y + 1; u < r.y + r.h; u++) { c.beginPath(); c.moveTo(X(r.x), Y(u)); c.lineTo(X(r.x + r.w), Y(u)); c.stroke(); }
      if (!S.done) { c.save(); c.setLineDash([7, 5]); c.lineDashOffset = -t * 20; c.strokeStyle = '#a0602a'; c.lineWidth = 2.5; c.strokeRect(X(r.x), Y(r.y), r.w * G.sc, r.h * G.sc); c.restore(); }
      c.fillStyle = '#6a3a1a'; c.font = M.NUMF(16); c.textAlign = 'center'; c.textBaseline = 'middle';
      if (r.w * G.sc > 24) c.fillText(String(r.w), X(r.x + r.w / 2), Y(r.y + r.h) + 12); if (r.h * G.sc > 18) { c.save(); c.translate(X(r.x + r.w) + 12, Y(r.y + r.h / 2)); c.fillText(String(r.h), 0, 0); c.restore(); }
    }
    // the squares cut off so far, each step in its own colour, with its side written in it
    for (const q of S.sq) {
      const k = M.clamp((t - q.at) / 0.22, 0, 1); if (k <= 0) continue; const sz = q.s * G.sc, cx = X(q.x + q.s / 2), cy = Y(q.y + q.s / 2), sc = 0.7 + 0.3 * M.ease(k) + Math.sin(k * Math.PI) * 0.08;
      const last = S.done && q.s === S.gcd;
      c.save(); c.translate(cx, cy); c.scale(sc, sc); c.fillStyle = COLS[q.step % COLS.length]; c.fillRect(-sz / 2 + 1, -sz / 2 + 1, sz - 2, sz - 2);
      c.strokeStyle = last ? '#fff6c0' : 'rgba(80,40,20,0.55)'; c.lineWidth = last ? 3 : 1.5; c.strokeRect(-sz / 2 + 1, -sz / 2 + 1, sz - 2, sz - 2);
      if (sz >= 22) { c.fillStyle = '#fffaf0'; c.font = M.NUMF(Math.min(26, sz * 0.4)); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(q.s), 0, 1); }
      c.restore();
    }
    M.drawEx(g, c, 'ex'); M.drawUI(g, c);
  },
});
