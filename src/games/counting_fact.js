// counting_fact.js — FACTORIAL! Write n! out as a product and multiply it down.
// A sunny kitchen; the problem is written on a recipe card and a hedgehog bakes alongside. Show your work:
//   1. Tap 5!: 5! glows, and the product writes itself one factor at a time, 5, 4, 3, 2, 1, with a small "−1" hop arc
//      from each factor to the next (each factor is one less than the one before).
//   2. Drag any factor onto any other: both light up, a note "5 × 4 =" writes itself above them, the answer writes in,
//      the dragged factor fades and the rest close up, and the product flies down into the other factor, which rolls
//      over to the new number (medium mode: the product is picked from the tray). Repeat until only 120 is left. Any
//      order works, because multiplication can be done in any order. Each product bakes one cookie on the counter.
// Level 0: 4!. Level 1: 5!. Level 2: 7!/5! (or 6!/4!, 8!/6!): tapping 7! writes it as 7 × 6 × 5! over 5!; dragging one
// 5! onto the other crosses both out and they leave, and 7 × 6 is left to multiply (in either order).
const M = MK, INK = SCN.ink('paper'), NOTE = '#c8502a', HOP = '#2a8ac0';
const factN = (m, id, o) => { const r = M.row(M.num(m), M.txt('!')); r.id = id; Object.assign(r, o || {}); return r; };
function host(g, c, kind, x, y, s, facing) {
  const S = g.s, mk = S.mk, t = g.t, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hopK * 24, s, { t, pose, expr, facing }); else SCN.host(g, c, kind, x, y, s);
}

// a small hop arc under two neighbouring factors, labelled −1: each factor is one less than the one before
function hopArc(g, from, to, dur, linger) {
  M.anim(g, { dur, linger, draw(c, g, k, t) { const a = M.box(g, from), b = M.box(g, to); if (!a || !b) return; const e = M.easeIO(k), y0 = Math.max(a.y + a.h / 2, b.y + b.h / 2) + 4, x0 = a.x, x1 = b.x;
    c.globalAlpha = t > dur ? Math.max(0, 1 - (t - dur) / linger) : 1; c.strokeStyle = HOP; c.fillStyle = HOP; c.lineWidth = 2.5; c.lineCap = 'round'; c.beginPath();
    for (let u = 0; u <= e + 1e-6; u += 0.05) { const x = M.lerp(x0, x1, u), y = y0 + Math.sin(u * Math.PI) * 14; u ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
    if (e > 0.5) { c.globalAlpha *= Math.min(1, (e - 0.5) * 3); c.font = M.NUMF(16); c.textAlign = 'center'; c.fillText('−1', (x0 + x1) / 2, y0 + 32); } } });
}

MG.add({
  id: 'counting_fact', stage: 'counting', cmd: 'FACTORIAL!', hint: 'drag', time: 9, mood: 'bright', winText: 'Cooked!', hold: 1.5,
  card: {
    title: 'Factorials', ref: 'Grade 11 and up', kind: 'Counting',
    text: 'The factorial of a whole number n, written n!, is n multiplied by every whole number below it, down to 1. For example, 5! = 5 × 4 × 3 × 2 × 1 = 120.\n\nFactorials count arrangements. Five books can stand on a shelf in 5! = 120 orders: there are 5 choices for the first spot, then 4 for the next, and so on.\n\nA fraction of two factorials is easy to work out, because most of the factors cancel. Since 7! = 7 × 6 × 5!, the fraction 7! ÷ 5! is just 7 × 6 = 42.\n\nBy agreement, 0! = 1, because there is exactly one way to arrange nothing.',
    note: 'Multiply n by every whole number below it, down to 1. To divide factorials, write the bigger one as a product that ends in the smaller one, and cancel.',
    ask: 'What is 4!? What is 6! ÷ 4!?',
  },
  init(g) {
    const S = g.s; M.setup(g); const L = g.level, r = k => Math.floor(g.rand() * k), T = M.pace(g);
    S.L2 = L === 2; S.uid = 0; S.st = 0; S.baked = 0;
    if (S.L2) { [S.n, S.m] = [[7, 5], [6, 4], [8, 6]][r(3)]; S.ans = S.n * (S.n - 1); }
    else { S.n = L === 0 ? 4 : 5; S.ans = S.n === 4 ? 24 : 120; }
    g.dur *= (2.6 + 1.05 * (S.L2 ? 3 : S.n)) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // every symbol is a node object that lives for the whole game, so rewriting the line makes the symbols glide
    S.left = S.L2 ? M.frac(factN(S.n, 'nf'), factN(S.m, 'df')) : factN(S.n, 'nf'); S.eq = M.op('=', 'eq'); S.q = M.slot('q');
    S.size = S.L2 ? 44 : S.n === 4 ? 46 : 42;
    S.build = () => {
      let right = S.q;
      if (S.st) { const prod = M.row(...S.F.flatMap((f, i) => [i ? f.x : null, f.n])); right = S.den ? (S.fr = S.fr || M.frac(prod, S.denN, 'fr')) : prod; if (S.den) S.fr.n = prod; }
      M.place(g, 'ex', M.row(S.left, S.eq, right), 180, S.L2 ? 302 : 296, S.size, { col: INK });
    };
    S.build(); M.inert(g, ['eq', 'fr', 'df', 'nt']);
    const fac = (v, o) => { const id = 'f' + S.uid++; return { v, id, n: o && o.fact ? factN(v, id, { alpha: 0 }) : M.num(v, id, { alpha: 0 }), x: M.op('×', 'x' + id, { alpha: 0 }), fact: o && o.fact }; };
    M.play(g, {
      moves(g) {
        // 1. write n! out as a product, one factor at a time, each one less than the one before
        if (S.st === 0) return [{ tap: 'nf', busy: 0.12, then(g) {
          S.st = 1; S.expAt = g.t; S.F = [];
          if (S.L2) { S.F = [fac(S.n), fac(S.n - 1), fac(S.m, { fact: true })]; S.den = true; S.denN = factN(S.m, 'den', { alpha: 0 }); } else for (let k = S.n; k >= 1; k--) S.F.push(fac(k));
          S.build(); M.inert(g, S.F.map(f => 'x' + f.id)); g.sfx('whoosh'); S.point = true; hop(g, 'think');
          const per = Math.min(0.3, 1.2 / S.F.length) * T, k0 = 0.2 * T;
          M.indicate(g, 'nf', { dur: 0.45 * T, col: '#ffb21f' }); M.show(g, k0 + S.F.length * per + 0.25 * T);
          if (S.L2) M.at(g, [[0.1 * T, g => { S.denN.alpha = 1; M.writeIn(g, S.denN, { dur: 0.25 * T }); }]]); // the bottom 5! copies itself down
          S.F.forEach((f, i) => M.at(g, [[k0 + i * per, g => {
            f.n.alpha = 1; f.x.alpha = 1; M.writeIn(g, f.n, { dur: 0.6 * per }); f.n.pop = g.t; g.sfx('tap'); if (i) M.writeIn(g, f.x, { dur: 0.3 * per }); if (i && !f.fact) { hopArc(g, S.F[i - 1].id, f.id, 0.7 * per, 0.5 * T); }
            if (i === S.F.length - 1) M.at(g, [[0.6 * per, g => { M.sparkle(g, f.id, { n: 8 }); hop(g); }]]); }]]));
          M.at(g, [[k0 + S.F.length * per + 0.2 * T, g => { S.point = false; }]]);
        } }];
        const out = [], plain = S.F.filter(f => !f.fact);
        // L2: the same factorial on top and bottom cancels
        if (S.den) { const nf = S.F.find(f => f.fact), cancel = { busy: 0.12, then(g) {
            M.show(g, 0.85 * T); S.point = true; hop(g, 'think'); M.circle(g, nf.id, { dur: 0.45 * T, col: '#d8454a', pad: 4 }); M.circle(g, 'den', { dur: 0.45 * T, col: '#d8454a', pad: 4 });
            M.strike(g, nf.n, { delay: 0.2 * T, dur: 0.22 * T }); M.strike(g, S.denN, { delay: 0.3 * T, dur: 0.22 * T }); g.sfx('swoosh');
            M.at(g, [[0.5 * T, g => { for (const q of [nf.n, nf.x, S.denN, ...nf.n.items, ...S.denN.items]) M.tween(g, q, { alpha: 0 }, 0.18 * T); for (const q of [nf.n, S.denN]) M.tween(g, q, { dy: -10 }, 0.18 * T); g.sfx('pop'); }],
              [0.7 * T, g => { S.F = S.F.filter(f => f !== nf); S.den = false; S.cancelAt = g.t; S.build(); hop(g); const b = M.box(g, 'ex'); g.burst(180, S.L2 ? 302 : 296, ['#d8454a', '#fff', '#ffd45a'], 10, 120); }],
              [0.85 * T, g => { S.point = false; }]]); } };
          out.push({ drag: nf.id, to: 'den', ...cancel }, { drag: 'den', to: nf.id, ...cancel }); }
        // 2. multiply two factors: either one onto the other
        for (const a of plain) for (const b of plain) if (a !== b) out.push({
          drag: a.id, to: b.id, busy: 0.1, askAt: 0.5 * T, after: 0.85 * T, ask: { v: a.v * b.v, wrong: [a.v + b.v, a.v * b.v + a.v, a.v * (b.v + 1), a.v * b.v - 1] },
          then(g) { M.show(g, 0.5 * T); S.point = true; hop(g, 'think'); g.sfx('pop');
            for (const q of [a, b]) { M.light(g, q.n, { col: NOTE, dur: 0.2 * T }); M.indicate(g, q.n, { dur: 0.35 * T, sc: 1.2 }); }
            const A = M.box(g, a.id), B = M.box(g, b.id), [lo, hi] = S.F.indexOf(a) < S.F.indexOf(b) ? [a, b] : [b, a];
            S.res = M.num(a.v * b.v, null, { alpha: 0 }); S.note = Object.assign(M.row(M.num(lo.v), M.op('×'), M.num(hi.v), M.op('='), S.res), { id: 'nt' });
            const m = M.lay(S.note, 30), nx = M.clamp((A.x + B.x) / 2 + m.w * 0.12, m.w / 2 + 26, 334 - m.w / 2);
            S.nk = 'note' + S.uid++; M.place(g, S.nk, S.note, nx, A.y - 44, 30, { col: NOTE }); M.writeIn(g, S.note, { dur: 0.35 * T, delay: 0.05 * T }); },
          resolve(g) { M.show(g, 0.85 * T); S.res.alpha = 1; M.writeIn(g, S.res, { dur: 0.2 * T }); g.sfx('ding');
            { const A = M.box(g, a.id), B = M.box(g, b.id); M.tween(g, a.n, { alpha: 0, sc: 0.6, dx: (B.x - A.x) * 0.6 }, 0.16 * T, { delay: 0.04 * T }); } M.tween(g, (S.F[0] === a ? S.F[1] : a).x, { alpha: 0 }, 0.16 * T, { delay: 0.04 * T });
            M.at(g, [[0.2 * T, g => { const i = S.F.indexOf(a); S.F.splice(i, 1); if (i === 0 && S.F[0]) S.F[0].x.alpha = 1; S.build(); }]]);
            M.at(g, [
              [0.32 * T, g => { // the used factor leaves and the rest close up; the product drops into the other factor
                const rb = M.box(g, 'nt'), m = M.lay(S.note, 30), rw = M.lay(S.res, 30).w, from = [rb.x + m.w / 2 - rw / 2, rb.y];
                M.tween(g, S.note, { alpha: 0 }, 0.2 * T);
                M.fly(g, { node: M.num(a.v * b.v, null, { col: NOTE }), from, to: b.id, dur: 0.3 * T, arc: -16, s0: 30, s1: S.size,
                  then(g) { M.roll(g, b.n, a.v * b.v, { dur: 0.22 * T }); b.v *= a.v; M.unlight(g, b.n, { dur: 0.3 * T }); b.n.pop = g.t; M.sparkle(g, b.id, { n: 9, cols: ['#ffd45a', '#ff9a6a', '#fff'] }); g.sfx('coin'); S.baked++; S.bakeAt = g.t; hop(g); } }); }],
              [0.85 * T, g => { for (const k in g.s.mk.ex) if (k.startsWith('note')) delete g.s.mk.ex[k]; S.point = false; }]]); },
        });
        if (S.den) return out;
        // put the move that pairs neighbours from the left first, so the guidance shows the most natural one
        const at = id => S.F.findIndex(f => f.id === id);
        return out.sort((p, q) => (at(p.drag) * 10 + at(p.to)) - (at(q.drag) * 10 + at(q.to)));
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || [m.drag, m.to]) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'kitchen', panel: 'paper', panelH: 190 });
    host(g, c, 'hedgehog', 92, 456, 1.2, 1);
    // a pot on the counter, and a row of cookies: one bakes for every product
    c.fillStyle = '#5a5a6a'; c.beginPath(); c.roundRect(222, 416, 92, 40, [0, 0, 16, 16]); c.fill(); c.fillStyle = '#7a7a8a'; c.fillRect(214, 410, 108, 10); c.fillRect(316, 420, 18, 6);
    for (let k = 0; k < 3; k++) { const ph = (t * 0.7 + k / 3) % 1; c.fillStyle = `rgba(255,255,255,${0.35 * (1 - ph)})`; c.beginPath(); c.arc(250 + k * 18 + Math.sin(t * 2 + k) * 4, 404 - ph * 40, 6 + ph * 8, 0, 7); c.fill(); }
    const nC = S.L2 ? 1 : S.n - 1;
    for (let i = 0; i < nC; i++) { const x = 180 - (nC - 1) * 22 + i * 44, y = 540 + Math.sin(t * 2 + i) * 1.5, on = i < S.baked, pk = on && i === S.baked - 1 && S.bakeAt != null ? 1 + Math.sin(M.clamp((t - S.bakeAt) / 0.35, 0, 1) * Math.PI) * 0.35 : 1;
      c.save(); c.translate(x, y); c.scale(pk, pk); c.fillStyle = on ? '#d89a4a' : 'rgba(255,255,255,0.25)'; c.beginPath(); c.arc(0, 0, 15, 0, 7); c.fill(); if (on) { c.fillStyle = '#5a3218'; for (const [dx, dy] of [[-5, -4], [4, -2], [-1, 5]]) { c.beginPath(); c.arc(dx, dy, 2.2, 0, 7); c.fill(); } } c.restore(); }
    M.drawEx(g, c, 'ex'); for (const k in S.mk.ex) if (k.startsWith('note')) M.drawEx(g, c, k);
    M.drawUI(g, c);
  },
});
