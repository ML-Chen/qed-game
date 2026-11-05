// numbers_div.js — DIVISIBILITY! Decide whether a number is divisible by 3, 9 or 4 with the digit tests.
// On a library chalkboard: "387 divisible by 3?" and, below it, the digits of 387 as separate chalk tiles.
// By 3 or by 9: the player drags digits onto each other to add them (any pair, any order) until one number is left,
// the digit sum (3 + 8 + 7 = 18). A tap on it checks it: 18 = 3 × 6, so a green YES is stamped (or a red NO with
// the remainder written out, such as 16 = 3 × 5 + 1).
// By 4: a tap on the hundreds digit crosses out everything but the last two digits (any multiple of 100 is a
// multiple of 4), and a tap on the two-digit number left checks it.
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
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { d, digits } = S, N = +digits.join('');
    S.four = d === 4; S.cut = false; S.tiles = digits.map((v, i) => ({ id: 't' + i, v }));
    M.place(g, 'prob', M.row(M.num(N, 'N'), M.gap(12), M.txt('divisible by', 'dv'), M.gap(10), M.num(d, 'd'), M.txt('?', 'q')), 180, 228, 28, { col: '#ffe8a8' }); M.inert(g, ['dv', 'q']);
    const build = () => { S.work = M.row(...S.tiles.flatMap((t, i) => [i ? M.gap(S.four ? 10 : 22) : null,
      t.pair ? M.row(M.num(t.pair[0]), M.op('+'), M.num(t.pair[1]), { id: t.id }) : M.num(t.v, t.id, { pop: t.at, alpha: t.out ? 0.3 : 1 })]));
      S.work.items.forEach(n => { if (n.k === 'row' && !n.id) n.id = null; }); const w = S.work; S.tiles.forEach(t => { if (t.pair) { const n = w.items.find(q => q.items && q.items.length === 3 && !q.id); } });
      M.place(g, 'work', S.work, 180, WY, S.tiles.length > 3 ? 54 : 62, { col: INK }); };
    S.build = build; build();
    const nMoves = S.four ? 2 : digits.length; g.dur *= (2.6 + 1.05 * nMoves) / 8;
    const verdict = (t) => ({ tap: t.id, busy: 0.1, askAt: 0, after: 0.1, ask: { v: M.txt(t.v % d ? 'NO' : 'YES'), wrong: [M.txt(t.v % d ? 'YES' : 'NO')] },
      then(g) { S.asked = true; },
      resolve(g) { const v = t.v, q = Math.floor(v / d), r = v % d; S.done = true; S.yes = !r; S.stampAt = g.t; g.sfx(r ? 'thud' : 'magic');
        M.place(g, 'why', r ? M.row(M.num(v), M.op('='), M.num(d), M.op('×'), M.num(q), M.op('+'), M.num(r)) : M.row(M.num(v), M.op('='), M.num(d), M.op('×'), M.num(q)), 180, 404, 30, { col: r ? NO : YES }); } });
    M.play(g, {
      moves(g) {
        if (S.done) return [];
        if (S.four) {
          if (!S.cut) return [{ tap: S.tiles.slice(0, -2).map(t => t.id), busy: 0.1, then(g) { S.cut = true; const last = S.tiles.slice(-2), v = last[0].v * 10 + last[1].v;
            S.tiles = [...S.tiles.slice(0, -2).map(t => ({ ...t, out: true })), { id: 'tl', v, at: g.t }]; M.inert(g, S.tiles.filter(t => t.out).map(t => t.id)); g.sfx('swoosh'); S.cutAt = g.t; build(); } }];
          return [verdict(S.tiles[S.tiles.length - 1])];
        }
        if (S.tiles.length === 1) return S.asked ? [] : [verdict(S.tiles[0])];
        const out = [];
        S.tiles.forEach((p, i) => S.tiles.forEach((q, j) => { if (i === j || p.pair || q.pair) return; out.push({ drag: p.id, to: q.id, busy: 0.1, askAt: 0, after: 0.1,
          ask: { v: p.v + q.v, wrong: [p.v * q.v, p.v + q.v + 1, +(String(q.v) + String(p.v)), p.v + q.v - 1] },
          then(g) { S.tiles.splice(S.tiles.indexOf(p), 1); q.pair = [p.v, q.v]; g.sfx('whoosh'); build(); },
          resolve(g) { q.v = p.v + q.pair[1]; q.pair = null; q.at = g.t; g.sfx('coin'); build(); const b = M.box(g, q.id); if (b) g.burst(b.x, b.y, ['#fff', '#ffe8a8'], 10, 100); } }); }));
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
    for (const tl of S.tiles) { const b = M.box(g, tl.id); if (!b) continue;
      c.save(); c.strokeStyle = tl.out ? 'rgba(251,248,238,0.25)' : 'rgba(251,248,238,0.55)'; c.lineWidth = 2; c.setLineDash([6, 4]); c.beginPath(); c.roundRect(b.x - b.w / 2 - 10, b.y - b.h / 2 - 8, b.w + 20, b.h + 16, 10); c.stroke(); c.restore();
      if (tl.out) { const k = M.clamp((t - S.cutAt) / 0.2, 0, 1); c.strokeStyle = '#ffb0a0'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(b.x - b.w / 2 - 4, b.y + b.h / 2); c.lineTo(b.x - b.w / 2 - 4 + (b.w + 8) * k, b.y - b.h / 2); c.stroke(); } }
    M.drawEx(g, c, 'prob'); M.drawEx(g, c, 'work'); M.drawEx(g, c, 'why');
    // the stamp
    if (S.done) { const k = M.clamp((t - S.stampAt) / 0.18, 0, 1), sc = 1.8 - 0.8 * M.ease(k), col = S.yes ? '#3ac06a' : '#e0503a';
      c.save(); c.translate(268, 300); c.rotate(-0.22); c.scale(sc, sc); c.globalAlpha = k; c.strokeStyle = col; c.fillStyle = 'rgba(255,255,255,0.12)'; c.lineWidth = 5;
      c.beginPath(); c.roundRect(-52, -24, 104, 48, 10); c.fill(); c.stroke(); c.fillStyle = col; c.font = M.NUMF(32, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(S.yes ? 'YES' : 'NO', 0, 2); c.restore(); }
    M.drawUI(g, c);
  },
});
