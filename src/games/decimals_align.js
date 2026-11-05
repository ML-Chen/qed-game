// decimals_align.js — ALIGN DECIMALS! Adding decimals: write one number under the other with the decimal points lined up.
// The two numbers start side by side on a recipe card (3.4 + 1.25). The player drags one number onto the other (a drop
// anywhere on the card counts). The working plays by itself: both numbers glide into a column sum, digit by digit, the
// decimal points sliding into one straight dashed line, and every empty place writes in a faint 0. The line under the
// sum draws itself. Then the player taps each column to add it: the column's digits light up, a note writes itself
// just above the column ("4 + 2 = 6", or "7 + 8 + 1 = 16"), the ones digit drops into the answer row, and a tens digit
// lifts off and arcs over to the top of the next column, landing with a sparkle. When the tenths are added, the decimal
// point drops down the dashed line into the answer. Columns with no carry coming in may be added in any order; a
// column that receives a carried 1 waits for the column to its right (tapping it early flashes it red). A carry into a
// column with no digits drops straight into the answer by itself.
// Level 0: a tenths number plus a hundredths number, no carrying. Level 1: one carry. Level 2: a two-digit whole part,
// one or two carries. Medium mode: each column tap opens a tray to pick the column total.
const M = MK, INK = SCN.ink('paper'), CARRY = '#d8504a', ANS = '#2a7a5a', NOTE = '#c0502a', SZ = 50, DW = 40, PW = 18;
const Y = { note: 207, carry: 232, top: 280, bot: 336, line: 354, ans: 406 };
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
// a number's characters with their places (3.40: 3 → 0, '.' → null, 4 → −1)
const chars = n => { const s = fmt(n.m, n.d), dot = s.indexOf('.'); return s.split('').map((ch, i) => ({ ch, q: ch === '.' ? null : i < dot ? dot - 1 - i : -(i - dot) })); };

MG.add({
  id: 'decimals_align', stage: 'decimals', cmd: 'ALIGN DECIMALS!', hint: 'drag', time: 9, mood: 'bright', winText: 'Lined up!', hold: 1.4,
  card: {
    title: 'Adding decimals', ref: 'Grade 5', kind: 'Decimals',
    text: 'A decimal point separates the whole number from the parts of one. The first digit after the point counts tenths, and the next digit counts hundredths.\n\nTo add decimals, write one number under the other so that the decimal points line up. Then each column holds one kind of place: ones under ones, tenths under tenths. An empty place counts as 0. Add each column from the right, the way you add whole numbers, and carry a ten into the next column.\n\nFor example, for 3.4 + 1.25, write 3.40 over 1.25. The hundredths give 0 + 5 = 5, the tenths give 4 + 2 = 6, and the ones give 3 + 1 = 4, so the sum is 4.65.\n\nThe points must line up because a tenth and a hundredth are different sizes, and only equal sizes can be added in one column.',
    note: 'Line up the decimal points, treat an empty place as 0, and add each column starting from the right.',
    ask: 'What is 2.5 + 1.34? What is 6.08 + 0.7?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = gen(g); S.done = {}; S.cshow = {}; S.nd = {};
    S.ptop = Math.max(topPlace(p.A + p.B, p.D), topPlace(p.A, p.D), topPlace(p.B, p.D));
    S.places = []; for (let q = -p.D; q <= S.ptop; q++) S.places.push(q); // right to left
    S.carry = {}; let c = 0; for (const q of S.places) { S.carry[q] = c; c = dig(p.A, p.D, q) + dig(p.B, p.D, q) + c >= 10 ? 1 : 0; }
    const xr = q => q >= 0 ? -PW / 2 - DW / 2 - q * DW : PW / 2 + DW / 2 + (-q - 1) * DW, off = -(xr(S.ptop) + xr(-p.D)) / 2;
    S.X = q => 180 + off + xr(q); S.PX = 180 + off;
    g.dur *= (2.6 + 1.05 * (1 + S.places.length)) / 8;
    const has = S.has = (n, q) => q >= -n.d && q <= topPlace(n.m, n.d);
    const empty = q => q >= 0 && !has(p.a, q) && !has(p.b, q);
    // the side-by-side line: one node per character, so each can glide to its column
    S.ca = chars(p.a).map((x, i) => ({ ...x, n: M.num(x.ch, 'A_' + i) })); S.cb = chars(p.b).map((x, i) => ({ ...x, n: M.num(x.ch, 'B_' + i) }));
    const rA = M.row(...S.ca.map(x => x.n)), rB = M.row(...S.cb.map(x => x.n)); rA.id = 'A'; rB.id = 'B';
    S.plusN = M.op('+', 'plus');
    M.place(g, 'line', M.row(rA, M.gap(8), S.plusN, M.gap(8), rB), 180, 330, SZ, { col: INK });
    M.inert(g, ['plus', ...S.ca.map(x => x.n.id), ...S.cb.map(x => x.n.id)]);
    // the column sum: nodes are made once (S.nd) and placed in their own cells, so nothing fades or jumps on a rebuild
    const nd = (key, mk) => S.nd[key] || (S.nd[key] = mk());
    const build = S.build = () => {
      const Mk = g.s.mk;
      const [T, B] = S.flip ? [p.b, p.a] : [p.a, p.b];
      for (const q of S.places) {
        for (const [n, row, y] of [[T, 't', Y.top], [B, 'b', Y.bot]]) {
          if (has(n, q)) M.place(g, row + K(q), nd(row + K(q), () => M.num(dig(n.m * 10 ** (p.D - n.d), p.D, q), row + K(q), { _born: -1 })), S.X(q), y, SZ, { col: INK });
          else if (q < 0) M.place(g, row + K(q), nd('z' + row + K(q), () => M.num(0, 'z' + row + K(q), { _born: -1, alpha: 0 })), S.X(q), y, SZ, { col: INK });
        }
        if (S.done[q]) M.place(g, 'r' + K(q), nd('r' + K(q), () => M.num(dig(p.A + p.B, p.D, q), 'r' + K(q), { _born: -1, pop: g.t })), S.X(q), Y.ans, SZ, { col: ANS });
        if (S.cshow[q]) M.place(g, 'k' + K(q), nd('k' + K(q), () => M.num(1, 'k' + K(q), { _born: -1, pop: g.t })), S.X(q), Y.carry, 26, { col: CARRY });
        M.zone(g, 'c' + K(q), { x: S.X(q), y: (Y.top + Y.ans) / 2 - 20, w: DW - 2, h: 170 });
      }
      for (const [key, y] of [['p1', Y.top], ['p2', Y.bot], ['p3', Y.ans]]) M.place(g, key, nd(key, () => M.num('.', key, { _born: -1, alpha: key === 'p3' ? 0 : 1 })), S.PX, y, SZ, { col: key === 'p3' ? ANS : INK });
      M.place(g, 'plus', nd('plus2', () => M.op('+', 'plus2', { _born: -1 })), S.X(S.ptop) - DW - 4, Y.bot, SZ, { col: INK });
      M.inert(g, ['plus2', 'p1', 'p2', 'p3', ...S.places.flatMap(q => ['r' + K(q), 'k' + K(q), 'zt' + K(q), 'zb' + K(q)])]);
    };
    const hop = (g, e) => { g.s.mk.lastMove = g.t; };
    const align = flip => ({ busy: 0.1, area: [12, 170, 348, 440], then(g) { const T = M.pace(g); S.flip = flip; M.show(g, 1.15 * T); g.sfx('whoosh');
      const old = {}; for (const x of [...S.ca, ...S.cb]) { const b = M.box(g, x.n.id); old[x.n.id] = b && { x: b.x, y: b.y }; } const ob = M.box(g, 'plus');
      delete g.s.mk.ex.line; S.al = g.t; build();
      // every character glides from the line into its column; the number that moves down goes second
      const [TC, BC] = flip ? [S.cb, S.ca] : [S.ca, S.cb];
      for (const [list, row, y, dl] of [[TC, 't', Y.top, 0], [BC, 'b', Y.bot, 0.18 * T]]) list.forEach((x, i) => {
        const key = x.q == null ? (row === 't' ? 'p1' : 'p2') : row + K(x.q), n = S.nd[key], o = old[x.n.id], b = M.box(g, key); if (!n || !o || !b) return;
        n.dx = o.x - b.x; n.dy = o.y - b.y; M.tween(g, n, { dx: 0, dy: 0 }, 0.5 * T, { delay: dl + i * 0.03 * T }); });
      const pn = S.nd.plus2, pb = M.box(g, 'plus2'); if (pn && ob && pb) { pn.dx = ob.x - pb.x; pn.dy = ob.y - pb.y; M.tween(g, pn, { dx: 0, dy: 0 }, 0.5 * T, { delay: 0.1 * T }); }
      S.lineAt = g.t + 0.55 * T; S.dashAt = g.t + 0.6 * T; S.lineDur = 0.35 * T;
      M.at(g, [[0.6 * T, g => { M.indicate(g, 'p1', { sc: 1.6, dur: 0.35 * T, col: CARRY }); M.indicate(g, 'p2', { sc: 1.6, dur: 0.35 * T, delay: 0.05 * T, col: CARRY }); g.sfx('tap'); hop(g); }],
        [0.8 * T, g => { // empty places write in a faint 0
          let k = 0; for (const q of S.places) for (const r of ['t', 'b']) { const z = S.nd['z' + r + K(q)]; if (z) { z.alpha = 0.38; M.writeIn(g, z, { dur: 0.25 * T, delay: k * 0.08 * T }); M.sparkle(g, 'z' + r + K(q), { delay: k * 0.08 * T + 0.2 * T, n: 5, v: 60 }); k++; } }
          if (k) g.sfx('sparkle'); }]]); } });
    M.play(g, {
      moves(g) {
        if (!S.al) return [{ drag: 'B', to: 'A', ...align(false) }, { drag: 'A', to: 'B', ...align(true) }];
        const out = [];
        for (const q of S.places) {
          if (S.done[q] || S.tapped?.[q] || empty(q) || (S.carry[q] && !S.cshow[q])) continue;
          const [T0, B0] = S.flip ? [p.b, p.a] : [p.a, p.b], dt = dig(T0.m * 10 ** (p.D - T0.d), p.D, q), db = dig(B0.m * 10 ** (p.D - B0.d), p.D, q), cin = S.carry[q];
          const tot = dt + db + cin, sum0 = dt + db, T = M.pace(g);
          out.push({ tap: ['c' + K(q), 't' + K(q), 'b' + K(q)], busy: 0.1, askAt: 0.6 * T, after: 1.0 * T,
            ask: { v: tot, wrong: [tot + 1, tot - 1, cin ? sum0 : tot + 10, tot % 10 === tot ? tot + 2 : tot % 10] },
            then(g) { (S.tapped = S.tapped || {})[q] = 1; M.show(g, 0.6 * T); hop(g);
              const ids = ['t' + K(q), 'b' + K(q)]; if (cin) ids.push('k' + K(q));
              M.circle(g, [...ids, 'r' + K(q)].filter(id => M.box(g, id)).concat([[S.X(q), Y.ans, 30]]), { dur: 0.6 * T, col: '#ffb21f' });
              ids.forEach((id, i) => M.light(g, id, { delay: (0.12 + i * 0.14) * T, col: '#ffb21f' }));
              // the working note just above the column: "4 + 2 =", and the total once it is worked out
              S.res = String(tot).split('').map((ch, i) => M.num(ch, 'nr' + i, { alpha: 0 }));
              S.note = M.row(M.num(dt), M.op('+'), M.num(db), cin ? M.op('+') : null, cin ? M.num(1, null, { col: CARRY }) : null, M.op('='), ...S.res);
              const w = M.lay(S.note, 29).w, nx = M.clamp(S.X(q), 24 + w / 2, 336 - w / 2);
              M.place(g, 'note', S.note, nx, Y.note, 29, { col: NOTE }); M.writeIn(g, S.note, { dur: 0.4 * T, delay: 0.1 * T }); g.sfx('tap'); },
            resolve(g) { M.show(g, 1.0 * T); S.res.forEach(n => { n.alpha = 1; }); S.res.forEach((n, i) => M.writeIn(g, n, { dur: 0.16 * T, delay: i * 0.1 * T })); g.sfx('ding');
              const one = S.res[S.res.length - 1], ten = S.res.length > 1 ? S.res[0] : null;
              M.at(g, [
                [0.28 * T, g => { const b = M.box(g, one.id); one.alpha = 0; // the ones digit drops into the answer row
                  M.fly(g, { node: M.num(tot % 10, null, { col: ANS }), from: [b.x, b.y], to: [S.X(q), Y.ans - 17], dur: 0.38 * T, arc: 30, s0: 26, s1: SZ, col: ANS,
                    then(g) { S.done[q] = g.t; build(); M.sparkle(g, 'r' + K(q), { n: 8 }); g.sfx('coin'); hop(g); } }); }],
                ten && [0.42 * T, g => { const b = M.box(g, ten.id); ten.alpha = 0; g.sfx('whoosh'); // the ten lifts off and arcs over to the next column
                  M.fly(g, { node: M.num(1, null, { col: CARRY }), from: [b.x, b.y], to: [S.X(q + 1), Y.carry - 9], dur: 0.42 * T, arc: -50, s0: 26, s1: 26, col: CARRY,
                    then(g) { S.cshow[q + 1] = g.t; build(); M.sparkle(g, 'k' + K(q + 1), { n: 8, cols: ['#ffb0a0', '#fff', '#ffd45a'] }); g.sfx('pop'); hop(g);
                      if (empty(q + 1)) { M.show(g, 0.5 * T); M.at(g, [[0.12 * T, g => { const kb = M.box(g, 'k' + K(q + 1)); S.nd['k' + K(q + 1)].alpha = 0.25; // a carry into an empty column drops straight into the answer
                        M.fly(g, { node: M.num(1, null, { col: ANS }), from: [kb.x, kb.y], to: [S.X(q + 1), Y.ans - 17], dur: 0.3 * T, arc: 10, s0: 26, s1: SZ, col: ANS,
                          then(g) { S.done[q + 1] = g.t; build(); M.sparkle(g, 'r' + K(q + 1)); g.sfx('coin'); } }); }]]); } } }); }],
                q === -1 && [0.4 * T, g => { const b = M.box(g, 'p2'); // the point drops down the dashed line into the answer
                  M.fly(g, { node: M.num('.', null, { col: ANS }), from: [b.x, b.y], to: [S.PX, Y.ans - 17], dur: 0.35 * T, arc: 0, s0: SZ, s1: SZ, col: ANS,
                    then(g) { const n3 = S.nd.p3; n3.alpha = 1; n3.pop = g.t; M.sparkle(g, 'p3', { n: 6 }); } }); }],
                [0.72 * T, g => { M.tween(g, S.note, { alpha: 0 }, 0.25 * T); for (const id of ['t' + K(q), 'b' + K(q), 'k' + K(q)]) if (M.node(g, id)) M.unlight(g, id); }],
                [0.98 * T, g => { delete g.s.mk.ex.note; }],
              ].filter(Boolean)); } });
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
    SCN.std(g, c, { scene: 'kitchen', panel: 'paper', host: 'beaver', hostX: 300, hostY: 612, hostS: 1.2, panelY: 312, panelH: 272 });
    if (S.al) {
      // the line under the sum draws itself, and the column of decimal points is marked as one straight line
      const x0 = S.X(S.ptop) - DW - 22, x1 = S.X(-S.p.D) + DW / 2 + 6, lk = M.easeIO((t - S.lineAt) / S.lineDur), dk = M.easeIO((t - S.dashAt) / S.lineDur);
      c.save(); c.strokeStyle = INK; c.lineWidth = 3.5; c.lineCap = 'round'; if (lk > 0) { c.beginPath(); c.moveTo(x0, Y.line); c.lineTo(M.lerp(x0, x1, lk), Y.line); c.stroke(); }
      if (dk > 0) { c.strokeStyle = 'rgba(232,90,80,0.5)'; c.lineWidth = 3; c.setLineDash([5, 6]); c.beginPath(); c.moveTo(S.PX, Y.top - 46); c.lineTo(S.PX, M.lerp(Y.top - 46, Y.ans + 10, dk)); c.stroke(); }
      c.restore();
      // a tapped column that is not ready yet (a 1 is still coming from the right) flashes red
      const mi = Mk.missInfo, q = mi && mi.tap && S.places.find(q => [`c${K(q)}`, `t${K(q)}`, `b${K(q)}`].includes(mi.tap));
      if (q != null && t - Mk.missAt < 0.6) { c.save(); c.fillStyle = `rgba(216,69,74,${0.25 * (1 - (t - Mk.missAt) / 0.6)})`; c.beginPath(); c.roundRect(S.X(q) - DW / 2, Y.top - 46, DW, Y.ans - Y.top + 56, 10); c.fill(); c.restore(); }
    }
    for (const k in Mk.ex) if (k !== 'note') M.drawEx(g, c, k);
    M.drawEx(g, c, 'note');
    M.drawUI(g, c);
  },
});
