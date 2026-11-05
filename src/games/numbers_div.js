// numbers_div.js — DIVISIBILITY! Decide whether a number is divisible by 3, 9 or 4 with the digit tests.
// On a library chalkboard: "387 divisible by 3?" and, below it, the digits of 387 as separate chalk tiles.
// By 3 or by 9: the player drags digits onto each other to add them (any pair, any order) until one number is left,
// the digit sum (3 + 8 + 7 = 18). Each drop is acted out: the digit glides in beside the other with a "+", both light
// up, "= 11" writes itself, and the two digits slide into the sum, which stays as one tile. A tap on the last number
// checks it: it is circled, the divisor in the question swells, "18 = 3 × 6" writes itself under it and a green YES is
// stamped (or "16 = 3 × 5 + 1" with the remainder swelling in red, and a red NO).
// By 4: a tap on the front digits crosses them out one by one while "300 = 4 × 75" writes itself (every hundred is
// 4 × 25), the last two digits light up and join into one number, and a tap on it checks it.
// Level 0: by 3, three digits. Level 1: by 9 or by 4, three digits. Level 2: by 3, 9 or 4, four digits.
// Medium mode: each digit sum is picked from the tray, and so is the verdict (YES or NO).
// Wrong parts: the divisor and the number in the question; for the test by 4, the last two digits before the cut.
const M = MK, PANEL = 'chalk', INK = SCN.ink(PANEL), WY = 334, YES = '#8ae08a', NO = '#ff8a7a';
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), d = L === 0 ? 3 : L === 1 ? [9, 4][r(2)] : [3, 9, 4][r(3)], nd = L === 2 ? 4 : 3, yes = g.rand() < 0.6;
  if (d === 4) { const lead = [...Array(nd - 2)].map((_, i) => 1 + r(9)); const ok = []; for (let x = 10; x < 100; x++) if ((x % 4 === 0) === yes && (yes || x % 2 === 0 || g.rand() < 0.3)) ok.push(x);
    const x = ok[r(ok.length)]; return { d, digits: [...lead, Math.floor(x / 10), x % 10] }; }
  const digits = [1 + r(9), ...[...Array(nd - 2)].map(() => r(10))], s = digits.reduce((p, q) => p + q, 0), ok = [];
  for (let k = 1; k <= 9; k++) if (((s + k) % d === 0) === yes) ok.push(k);
  digits.push(ok[r(ok.length)]); return { d, digits };
}

MG.add({
  id: 'numbers_div', stage: 'numbers', cmd: 'DIVISIBILITY!', hint: 'drag', time: 9, mood: 'night', winText: 'Tested!', hold: 1.4,
  card: {
    title: 'Divisibility tests', ref: 'Grades 5–6', kind: 'Factors and multiples',
    text: 'A number is divisible by 3 when you can split it into 3 equal whole parts, with nothing left over. You can test this without dividing.\n\nBy 3: add up the digits. If the digit sum is divisible by 3, so is the number. For 387: 3 + 8 + 7 = 18, and 18 = 3 × 6, so 387 is divisible by 3. Indeed 387 = 3 × 129.\n\nBy 9: the same test with 9. 387 is divisible by 9 too, because 18 = 9 × 2.\n\nBy 4: look only at the last two digits. 316 is divisible by 4 because 16 = 4 × 4.\n\nWhy the digit sum works: 10 is 9 + 1, so 100 is 99 + 1, and 387 = 3 × 99 + 8 × 9 + (3 + 8 + 7). The 99s and 9s divide by 3 and by 9, so only the digit sum matters. For 4, every hundred is 4 × 25, so only the last two digits matter.',
    note: 'By 3 or by 9: test the sum of the digits. By 4: test the number made by the last two digits.',
    ask: 'Is 471 divisible by 3? Is 738 divisible by 9? Is 1,034 divisible by 4?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { d, digits } = S, N = +digits.join(''), T = S.T = M.pace(g);
    S.four = d === 4; S.cut = false; S.tiles = digits.map((v, i) => ({ id: 't' + i, v, node: M.num(v, 't' + i) }));
    M.place(g, 'prob', M.row(M.num(N, 'N'), M.gap(12), M.txt('divisible by', 'dv'), M.gap(10), M.num(d, 'd'), M.txt('?', 'q')), 180, 228, 28, { col: '#ffe8a8' }); M.inert(g, ['dv', 'q', 'N']);
    // the working line keeps the same node objects from step to step, so digits glide instead of popping
    const build = () => { S.work = M.row(...S.tiles.flatMap((t, i) => [i ? M.gap(S.four ? 10 : 22) : null, t.node]));
      let sz = S.tiles.length > 3 ? 54 : 62; const w = M.lay(S.work, sz).w; if (w > 290) sz *= 290 / w; // a long sum shrinks to stay on the board
      M.place(g, 'work', S.work, S.workX || 180, WY, sz, { col: INK }); };
    S.build = build; build();
    const hop = (g, e) => { g.s.mk.lastMove = g.t; };
    const nMoves = S.four ? 2 : digits.length; g.dur *= (2.6 + 1.05 * nMoves) / 8;
    // the verdict: the number left is circled, the divisor in the question lights up, and the division writes itself
    // underneath ("18 = 3 × 6", or "16 = 3 × 5 + 1" with the remainder in red); then the stamp comes down
    const verdict = (t) => ({ tap: t.id, busy: 0.1, askAt: 0.45 * T, after: 1.0 * T, ask: { v: M.txt(t.v % d ? 'NO' : 'YES'), wrong: [M.txt(t.v % d ? 'YES' : 'NO')] },
      then(g) { S.asked = true; M.show(g, 0.45 * T); M.circle(g, t.id, { dur: 0.5 * T, col: '#ffe8a8' }); M.light(g, t.node, { col: '#ffe8a8' }); M.indicate(g, 'd', { delay: 0.15 * T, dur: 0.4 * T, col: '#ffe8a8' }); hop(g); },
      resolve(g) { const v = t.v, q = Math.floor(v / d), r = v % d; M.show(g, 1.0 * T); S.yes = !r;
        const why = r ? M.row(M.num(v), M.op('='), M.num(d), M.op('×'), M.num(q), M.op('+', null, { col: NO }), M.num(r, 'rem', { col: NO })) : M.row(M.num(v), M.op('='), M.num(d), M.op('×'), M.num(q));
        M.place(g, 'why', why, 180, 404, 32, { col: r ? '#ffd0c8' : YES }); M.writeIn(g, why, { dur: 0.5 * T });
        if (r) M.indicate(g, 'rem', { delay: 0.55 * T, dur: 0.35 * T, sc: 1.4, col: NO });
        M.at(g, [[0.4 * T, g => { S.workX = 124; build(); }], [0.65 * T, g => { S.done = true; S.stampAt = g.t; M.unlight(g, t.node); t.node.col = r ? NO : YES; g.sfx(r ? 'thud' : 'magic'); g.shake && g.shake(4); hop(g);
          g.burst(236, 300, r ? ['#ff8a7a', '#fff'] : ['#8ae08a', '#fff', '#ffe8a8'], 14, 140); }]]); } });
    M.play(g, {
      moves(g) {
        if (S.done) return [];
        if (S.four) {
          // by 4: everything before the last two digits is a whole number of hundreds, and 100 = 4 × 25, so it is crossed out
          if (!S.cut) return [{ tap: S.tiles.slice(0, -2).map(t => t.id), busy: 0.1, then(g) { S.cut = true; M.show(g, 1.15 * T); const lead = S.tiles.slice(0, -2), last = S.tiles.slice(-2), v = last[0].v * 10 + last[1].v;
            lead.forEach((t, j) => { t.out = true; M.strike(g, t.node, { delay: j * 0.12 * T, dur: 0.25 * T, col: '#ffb0a0' }); M.tween(g, t.node, { alpha: 0.35 }, 0.3 * T, { delay: 0.2 * T }); });
            M.inert(g, lead.map(t => t.id)); g.sfx('swoosh'); hop(g);
            const hund = +lead.map(t => t.v).join('') * 100;
            M.note(g, { node: M.row(M.num(hund), M.op('='), M.num(4), M.op('×'), M.num(hund / 4)), at: [180, WY + 58], s: 26, col: '#ffe8a8', delay: 0.25 * T, write: 0.4 * T, hold: 0.3 * T, fade: 0.2 * T });
            last.forEach(t => M.light(g, t.node, { delay: 0.3 * T, col: '#ffe8a8' }));
            M.at(g, [[0.85 * T, g => { const tl = { id: 'tl', v, node: M.num(v, 'tl', { pop: g.t }) }; S.tiles = [...lead, tl]; build(); M.sparkle(g, 'tl', { n: 8 }); g.sfx('pop'); hop(g); }]]); } }];
          return [verdict(S.tiles[S.tiles.length - 1])];
        }
        if (S.tiles.length === 1) return S.asked ? [] : [verdict(S.tiles[0])];
        const out = [];
        S.tiles.forEach((p, i) => S.tiles.forEach((q, j) => { if (i === j || p.pair || q.pair) return; out.push({ drag: p.id, to: q.id, busy: 0.1, askAt: 0.5 * T, after: 0.75 * T,
          ask: { v: p.v + q.v, wrong: [p.v * q.v, p.v + q.v + 1, +(String(q.v) + String(p.v)), p.v + q.v - 1] },
          // the dragged digit slides in beside the other with a + between them, and both light up
          then(g) { M.show(g, 0.5 * T); S.tiles.splice(S.tiles.indexOf(p), 1); q.pair = [p.v, q.v]; g.sfx('whoosh'); hop(g);
            const pn = p.node, qn = q.node; pn.id = 'pa'; qn.id = 'pb'; S.plus = M.op('+', 'pp', { col: '#ffe8a8' });
            q.node = M.row(pn, S.plus, qn); q.node.id = q.id; build();
            M.light(g, pn, { col: '#ffe8a8' }); M.light(g, qn, { col: '#ffe8a8', delay: 0.15 * T }); },
          // "= 11" writes itself, then the sum swallows the two digits and stays as one tile
          resolve(g) { M.show(g, 0.75 * T); const sum = p.v + q.pair[1], [pn, pl, qn] = q.node.items, eq = M.op('=', 'pq', { col: '#ffe8a8' }), sn = M.num(sum, 'ps', { col: '#ffe8a8' });
            q.node.items.push(eq, sn); build(); M.writeIn(g, eq, { dur: 0.15 * T }); M.writeIn(g, sn, { delay: 0.1 * T, dur: 0.25 * T }); g.sfx('tap');
            M.at(g, [[0.4 * T, g => { const bs = M.box(g, 'ps'); for (const n of [pn, pl, qn, eq]) { const bb = M.box(g, n.id); if (bs && bb) M.tween(g, n, { dx: bs.x - bb.x, alpha: 0 }, 0.25 * T); } }],
              [0.68 * T, g => { q.v = sum; q.pair = null; sn.id = q.id; sn.col = undefined; sn.pop = g.t; q.node = sn; build(); g.sfx('coin'); hop(g); const b = M.box(g, q.id); if (b) g.burst(b.x, b.y, ['#fff', '#ffe8a8'], 10, 100); }]]); } }); }));
        return out;
      },
      area(g) { return S.tiles.filter(t => !t.out).map(t => t.id); },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'library', panel: PANEL, panelY: 316, panelH: 250, host: 'owl', hostX: 300, hostY: 604, hostS: 1.2 });
    // a chalk outline round every tile; crossed-out digits get a chalk stroke through them
    M.drawEx(g, c, 'work'); // first, so the outlines below follow the symbols' glides in this same frame
    for (const tl of S.tiles) { // the outline hugs the symbols still showing (a sum being formed shrinks into its result)
      const at = n => { const q = M.box(g, n.id); return q && { ...q, x: q.x + (n._gx || 0), y: q.y + (n._gy || 0) }; }; // follows a gliding symbol
      const vis = tl.node.items ? tl.node.items.filter(n => (n.alpha ?? 1) > 0.35 && !n.write).map(at) : [];
      const b = vis.length ? M.unionBox(vis) : at(tl.node); if (!b) continue;
      c.save(); c.strokeStyle = tl.out ? 'rgba(251,248,238,0.25)' : 'rgba(251,248,238,0.55)'; c.lineWidth = 2; c.setLineDash([6, 4]); c.beginPath(); c.roundRect(b.x - b.w / 2 - 10, b.y - b.h / 2 - 8, b.w + 20, b.h + 16, 10); c.stroke(); c.restore();
    }
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'why');
    // the stamp
    if (S.done) { const k = M.clamp((t - S.stampAt) / 0.18, 0, 1), sc = 1.8 - 0.8 * M.ease(k), col = S.yes ? '#3ac06a' : '#e0503a';
      const tb = M.box(g, S.tiles[S.tiles.length - 1].id), sx = tb ? M.clamp(tb.x + tb.w / 2 + 66, 236, 290) : 268;
      c.save(); c.translate(sx, 300); c.rotate(-0.22); c.scale(sc, sc); c.globalAlpha = k; c.strokeStyle = col; c.fillStyle = 'rgba(255,255,255,0.12)'; c.lineWidth = 5;
      c.beginPath(); c.roundRect(-52, -24, 104, 48, 10); c.fill(); c.stroke(); c.fillStyle = col; c.font = M.NUMF(32, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(S.yes ? 'YES' : 'NO', 0, 2); c.restore(); }
    M.drawUI(g, c);
  },
});
