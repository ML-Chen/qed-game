// decimals_align.js — ALIGN DECIMALS! Adding decimals: write one number under the other with the decimal points lined up.
// The two numbers start side by side on a recipe card (3.4 + 1.25). The player drags one number onto the other (a drop
// anywhere on the card counts): it settles underneath with its decimal point under the other's point, and empty places
// show a faint 0. Then the player taps each column to add it. Columns with no carry coming in may be added in any order;
// a column that receives a carried 1 waits for the column to its right, and the 1 hops up over the next column by itself.
// Level 0: a tenths number plus a hundredths number, no carrying. Level 1: one carry. Level 2: a two-digit whole part,
// one or two carries. Medium mode: each column tap opens a tray to pick the column total.
const M = MK, INK = SCN.ink('paper'), CARRY = '#d8504a', ANS = '#2a7a5a', SZ = 50, DW = 40, PW = 18;
const Y = { carry: 214, top: 264, bot: 324, line: 342, ans: 396 };
const fmt = (m, d) => { const s = String(m).padStart(d + 1, '0'); return d ? s.slice(0, -d) + '.' + s.slice(-d) : s; };
const K = p => p < 0 ? 'm' + -p : '' + p;
const topPlace = (X, D) => String(Math.floor(X / 10 ** D)).length - 1;
const dig = (X, D, p) => Math.floor(X / 10 ** (p + D)) % 10;
function gen(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (;;) {
    let a = L === 2 ? { m: r(101, 899), d: 1 } : { m: r(11, 89), d: 1 }, b = { m: r(101, 899), d: 2 };
    if (L === 1 && g.rand() < 0.5) a = { m: r(101, 899), d: 2 }, b = { m: r(11, 89), d: 1 };
    if (a.m % 10 === 0 || b.m % 10 === 0) continue;
    const D = 2, A = a.m * 10 ** (D - a.d), B = b.m * 10 ** (D - b.d);
    let carries = 0, c = 0; for (let x = A, y = B; x || y; x = Math.floor(x / 10), y = Math.floor(y / 10)) { c = x % 10 + y % 10 + c >= 10 ? 1 : 0; carries += c; }
    if (L === 0 ? carries : L === 1 ? carries !== 1 : carries < 1 || carries > 2) continue;
    return { a, b, D, A, B };
  }
}

MG.add({
  id: 'decimals_align', stage: 'decimals', cmd: 'ALIGN DECIMALS!', hint: 'drag', time: 9, mood: 'bright', winText: 'Lined up!', hold: 1.4,
  card: {
    title: 'Adding decimals', ref: 'Grade 5', kind: 'Decimals',
    text: 'A decimal point separates the whole number from the parts of one. The first digit after the point counts tenths, and the next digit counts hundredths.\n\nTo add decimals, write one number under the other so that the decimal points line up. Then each column holds one kind of place: ones under ones, tenths under tenths. An empty place counts as 0. Add each column from the right, the way you add whole numbers, and carry a ten into the next column.\n\nFor example, for 3.4 + 1.25, write 3.40 over 1.25. The hundredths give 0 + 5 = 5, the tenths give 4 + 2 = 6, and the ones give 3 + 1 = 4, so the sum is 4.65.\n\nThe points must line up because a tenth and a hundredth are different sizes, and only equal sizes can be added in one column.',
    note: 'Line up the decimal points, treat an empty place as 0, and add each column starting from the right.',
    ask: 'What is 2.5 + 1.34? What is 6.08 + 0.7?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = gen(g); S.done = {}; S.pops = {};
    S.ptop = Math.max(topPlace(p.A + p.B, p.D), topPlace(p.A, p.D), topPlace(p.B, p.D));
    S.places = []; for (let q = -p.D; q <= S.ptop; q++) S.places.push(q); // right to left
    S.carry = {}; let c = 0; for (const q of S.places) { S.carry[q] = c; c = dig(p.A, p.D, q) + dig(p.B, p.D, q) + c >= 10 ? 1 : 0; }
    const xr = q => q >= 0 ? -PW / 2 - DW / 2 - q * DW : PW / 2 + DW / 2 + (-q - 1) * DW, off = -(xr(S.ptop) + xr(-p.D)) / 2;
    S.X = q => 180 + off + xr(q); S.PX = 180 + off;
    g.dur *= (2.6 + 1.05 * (1 + S.places.length)) / 8;
    const has = (n, q) => q >= -n.d && q <= topPlace(n.m, n.d);
    const build = S.build = () => {
      const Mk = g.s.mk; Mk.ex = {};
      if (!S.al) { M.place(g, 'line', M.row(M.num(fmt(p.a.m, p.a.d), 'A'), M.gap(8), M.op('+', 'plus'), M.gap(8), M.num(fmt(p.b.m, p.b.d), 'B')), 180, 314, SZ, { col: INK }); return; }
      const [T, B] = S.flip ? [p.b, p.a] : [p.a, p.b];
      for (const q of S.places) {
        for (const [n, row, y] of [[T, 't', Y.top], [B, 'b', Y.bot]]) {
          if (has(n, q)) M.place(g, row + K(q), M.num(Math.floor(n.m / 10 ** (q + n.d)) % 10, row + K(q), { pop: S.pops.al }), S.X(q), y, SZ, { col: INK });
          else if (q < 0) M.place(g, row + K(q), M.num(0, 'z' + row + K(q), { alpha: 0.32, pop: S.pops.al }), S.X(q), y, SZ, { col: INK });
        }
        if (S.done[q]) M.place(g, 'r' + K(q), M.num(dig(p.A + p.B, p.D, q), 'r' + K(q), { pop: S.done[q] }), S.X(q), Y.ans, SZ, { col: ANS });
        if (S.carry[q] && S.done[q - 1]) M.place(g, 'k' + K(q), M.num(1, null, { pop: S.done[q - 1] }), S.X(q), Y.carry, 26, { col: CARRY });
        M.zone(g, 'c' + K(q), { x: S.X(q), y: (Y.top + Y.ans) / 2 - 20, w: DW - 2, h: 170 });
      }
      for (const [key, y] of [['p1', Y.top], ['p2', Y.bot], ['p3', Y.ans]]) M.place(g, key, M.num('.', null, { alpha: key === 'p3' && !S.done[-1] ? 0.35 : 1 }), S.PX, y, SZ, { col: key === 'p3' ? ANS : INK });
      M.place(g, 'plus', M.op('+', 'plus2'), S.X(S.ptop) - DW - 4, Y.bot, SZ, { col: INK });
      M.inert(g, ['plus2', ...S.places.flatMap(q => ['r' + K(q), 'zt' + K(q), 'zb' + K(q)])]);
    };
    build(); M.inert(g, ['plus']);
    const align = flip => ({ busy: 0.1, area: [12, 170, 348, 440], then(g) { S.al = true; S.flip = flip; S.pops.al = g.t; g.sfx('whoosh'); build(); g.burst(S.PX, Y.bot - 16, ['#ffd45a', '#7ad0ff', '#fff'], 12, 120); } });
    M.play(g, {
      moves(g) {
        if (!S.al) return [{ drag: 'B', to: 'A', ...align(false) }, { drag: 'A', to: 'B', ...align(true) }];
        const out = [];
        for (const q of S.places) {
          if (S.done[q] || S.tapped?.[q] || (S.carry[q] && !S.done[q - 1])) continue;
          const tot = dig(p.A, p.D, q) + dig(p.B, p.D, q) + S.carry[q], sum0 = dig(p.A, p.D, q) + dig(p.B, p.D, q);
          out.push({ tap: ['c' + K(q), 't' + K(q), 'b' + K(q)], busy: 0.1, ask: { v: tot, wrong: [tot + 1, tot - 1, S.carry[q] ? sum0 : tot + 10, tot % 10 === tot ? tot + 2 : tot % 10] },
            then() { (S.tapped = S.tapped || {})[q] = 1; },
            resolve(g) { S.done[q] = g.t; g.sfx(tot >= 10 ? 'magic' : 'coin'); build(); g.burst(S.X(q), Y.ans - 16, ['#9ae07a', '#ffd45a', '#fff'], 8, 90); } });
        }
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap ? m.tap[0] : m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, Mk = S.mk, t = g.t;
    SCN.std(g, c, { scene: 'kitchen', panel: 'paper', host: 'beaver', hostX: 292, hostY: 604, hostS: 1.3, panelY: 304, panelH: 256 });
    if (S.al) {
      // the line under the sum, and the column of decimal points marked as one straight line
      const x0 = S.X(S.ptop) - DW - 22, x1 = S.X(-S.p.D) + DW / 2 + 6;
      c.save(); c.strokeStyle = INK; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, Y.line); c.lineTo(x1, Y.line); c.stroke();
      const k = M.ease((t - S.pops.al) / 0.3); c.strokeStyle = 'rgba(232,90,80,0.45)'; c.lineWidth = 3; c.setLineDash([5, 6]);
      c.beginPath(); c.moveTo(S.PX, Y.top - 46); c.lineTo(S.PX, M.lerp(Y.top - 46, Y.ans + 10, k)); c.stroke(); c.restore();
      // a tapped column that is not ready yet (a 1 is still coming from the right) flashes red
      const mi = Mk.missInfo, q = mi && mi.tap && S.places.find(q => [`c${K(q)}`, `t${K(q)}`, `b${K(q)}`].includes(mi.tap));
      if (q != null && t - Mk.missAt < 0.6) { c.save(); c.fillStyle = `rgba(216,69,74,${0.25 * (1 - (t - Mk.missAt) / 0.6)})`; c.beginPath(); c.roundRect(S.X(q) - DW / 2, Y.top - 46, DW, Y.ans - Y.top + 56, 10); c.fill(); c.restore(); }
    }
    for (const k in Mk.ex) M.drawEx(g, c, k);
    M.drawUI(g, c);
  },
});
