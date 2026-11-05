// derivs_lhopital.js — L'HÔPITAL! A limit of the form 0/0: differentiate the top and the bottom separately, then
// substitute. lim x→2 (x³ − 8)/(x − 2) = lim x→2 3x²/1 = 12.
// A stone tablet on a moonlit reef, with an octopus. Under the tablet floats a bubble holding d/dx. The moves:
//   1. Drag the 2 from "x → 2" onto the fraction: "(2³ − 8)/(2 − 2) = 0/0" writes itself under the tablet; the 0/0
//      turns red and wobbles (the limit cannot be read off yet). The octopus looks puzzled.
//   2. Drag d/dx onto the top: a d/dx chip lands over it, the exponent 3 comes down in front of the x (a "3" arcs over),
//      the exponent rolls 3 → 2, and the constant − 8 is crossed out (its derivative is 0): 3x².
//   3. Drag d/dx onto the bottom: the same for the bottom (x − 2 → 1). 2 and 3 may come in either order.
//      Dropping d/dx on the whole fraction is the quotient-rule mix-up: a wrong move that only wobbles.
//   4. Drag the 2 onto the new fraction: the x's roll over to 2s, "3 · 2² = 12" writes itself above the top, the top
//      and the bottom roll into numbers, and the value flies into the answer: = 12.
// Level 0: (x² − a²)/(x − a). Level 1: (x³ − a³)/(x − a) and bigger a. Level 2: (xᵐ − aᵐ)/(x² − a²), answers like 3/2.
// Medium mode: the tray asks for each derivative and for the final value.
const M = MK, INK = '#f4fbff', CH = '#9af0e0', RED = '#ff7a6a', GOLD = '#ffd45a', FY = 300, FX = 176, FS = 50;
function pick(g) {
  const L = g.level, r = a => a[Math.floor(g.rand() * a.length)];
  if (L === 0) return r([[2, 1, 1], [2, 1, 2], [2, 1, 3]]);
  if (L === 1) return r([[3, 1, 1], [3, 1, 2], [2, 1, 4], [2, 1, 5]]);
  return r([[3, 2, 1], [3, 2, 2], [4, 2, 1], [4, 2, 2]]);
}
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const pw = (x, n) => n === 1 ? M.vr('x', x) : M.sup(M.vr('x', x), M.num(n, x + 'e'));

MG.add({
  id: 'derivs_lhopital', stage: 'derivs', cmd: "L'HÔPITAL!", hint: 'drag', time: 10, mood: 'sea', winText: 'Limit found!', hold: 1.6,
  card: {
    title: "L'Hôpital's rule", ref: 'Calculus', kind: 'Calculus',
    text: 'A limit asks what a fraction gets close to as x gets close to a number. Sometimes putting the number in gives 0/0, which tells you nothing: the top and the bottom both shrink to 0.\n\nL\'Hôpital\'s rule says: when you get 0/0, take the derivative of the top and the derivative of the bottom, separately, and try again. Do not use the quotient rule here.\n\nFor example, (x³ − 8)/(x − 2) at x = 2 gives 0/0. The top\'s derivative is 3x² and the bottom\'s is 1. Now put in 2: 3 · 2² / 1 = 12. So the limit is 12.',
    note: 'If f(a)/g(a) is 0/0, then the limit of f(x)/g(x) as x → a equals the limit of f′(x)/g′(x).',
    ask: 'Find the limit of (x² − 9)/(x − 3) as x → 3. Find the limit of (x³ − 1)/(x² − 1) as x → 1.',
  },
  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g); const [m, n, a] = pick(g); Object.assign(S, { m, n, a, face: 'happy' });
    const am = a ** m, an = a ** n, top = m * a ** (m - 1), bot = n * a ** (n - 1), gd = gcd(top, bot); S.vt = top; S.vb = bot; S.ans = bot / gd === 1 ? top / gd : [top / gd, bot / gd];
    S.ansNode = () => Array.isArray(S.ans) ? M.frac(M.num(S.ans[0]), M.num(S.ans[1])) : M.num(S.ans);
    // the tablet: lim (with x → a under it), the fraction, = ?
    S.lim = M.txt('lim', 'limw'); M.place(g, 'lim', S.lim, 52, FY + 14, 34, { col: INK });
    S.sub = M.row(M.vr('x', 'sx'), M.txt('→', 'sar'), M.num(a, 'av')); M.place(g, 'sub', S.sub, 52, FY + 46, 22, { col: INK });
    S.T = M.row(pw('xt', m), M.op('-', 'tm'), M.num(am, 'tc')); S.T.id = 'top';
    S.B = M.row(pw('xb', n), M.op('-', 'bm'), M.num(an, 'bc')); S.B.id = 'bot';
    S.slot = M.slot('ans', { col: '#7ac0d0' });
    S.fr = M.frac(S.T, S.B, 'fr'); S.relay = () => { S.fr.n = S.T; S.fr.d = S.B; S.row = M.row(S.fr, M.op('=', 'eqs'), S.slot); M.place(g, 'ex', S.row, FX + 18, FY + 14, FS, { col: INK }); };
    S.relay(); M.inert(g, ['limw', 'sx', 'sar', 'eqs', 'tm', 'bm', 'tc', 'bc', 'xt', 'xb', 'xte', 'xbe', 'zn', 'res']);
    // the bubble with d/dx
    S.dd = M.ddx('x', 'dd'); M.place(g, 'dd', M.row(S.dd), 92, 500, 46, { col: INK });
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    const chip = (g, part) => M.fly(g, { node: M.ddx('x'), from: 'dd', to: part, dur: 0.38 * T, arc: -60, s0: 46, s1: 30, col: CH, keep: false,
      then(g) { const b = M.box(g, part); S.chips.push({ x: b.x, y: part === 'top' ? b.y - b.h / 2 - 20 : b.y + b.h / 2 + 22, t0: g.t }); g.sfx('pop'); } });
    S.chips = [];
    // differentiate one side: the exponent comes down in front, rolls down by one, the constant is crossed out
    const diff = (part) => {
      const k = part === 'top' ? m : n, X = part === 'top' ? 'xt' : 'xb', R = part === 'top' ? 'T' : 'B', C = part === 'top' ? 'tc' : 'bc';
      const v = k === 1 ? M.num(1) : M.row(M.num(k), k - 1 === 1 ? M.vr('x') : M.sup(M.vr('x'), M.num(k - 1)));
      const wrong = k === 1 ? [0, M.vr('x'), M.row(M.num(1), M.op('-'), M.num(part === 'top' ? am : an))]
        : [k - 1 === 1 ? M.vr('x') : M.sup(M.vr('x'), M.num(k - 1)), M.row(M.num(k), M.sup(M.vr('x'), M.num(k))), M.row(M.num(k), k - 1 === 1 ? M.vr('x') : M.sup(M.vr('x'), M.num(k - 1)), M.op('-'), M.num(part === 'top' ? am : an))];
      return { drag: 'dd', to: part, busy: 0.1, askAt: 0.95 * T, after: 0.65 * T, ask: { v, wrong },
        then(g) { S[part] = true; M.show(g, 0.95 * T); hop(g, 'wow'); S.point = true; g.sfx('swoosh');
          chip(g, part); M.circle(g, part, { delay: 0.3 * T, dur: 0.45 * T, col: CH });
          if (k > 1) M.at(g, [[0.45 * T, g => { const e = M.box(g, X + 'e'), xb = M.box(g, X); M.indicate(g, X + 'e', { dur: 0.3 * T, col: GOLD, sc: 1.4 });
            S.kNote = M.num(k, part + 'k'); M.note(g, { node: M.num(k), at: X + 'e', s: 24, col: GOLD, write: 0.01, hold: 0.05, fly: 0.3 * T, to: [xb.x - xb.w / 2 - 8, xb.y], s1: FS * 0.82 * 0.9, arc: 26 }); }]]);
          M.at(g, [[0.7 * T, g => { M.strike(g, C, { dur: 0.2 * T, col: RED }); M.strike(g, part === 'top' ? 'tm' : 'bm', { dur: 0.15 * T, col: RED }); g.sfx('tap'); }]]);
        },
        resolve(g) { M.show(g, 0.65 * T); const xn = M.node(g, X);
          M.tween(g, C, { alpha: 0 }, 0.2 * T); M.tween(g, part === 'top' ? 'tm' : 'bm', { alpha: 0 }, 0.2 * T);
          M.at(g, [[0.2 * T, g => {
            if (k === 1) { S[R] = M.num(1, part + 'd', { col: CH, _born: -1, pop: g.t }); }
            else { const coef = M.num(k, part + 'k', { col: CH, _born: -1 }), base = M.node(g, X), ex = M.node(g, X + 'e');
              if (k - 1 === 1) S[R] = M.row(coef, base); else { S[R] = M.row(coef, M.sup(base, ex)); M.roll(g, ex, k - 1, { dur: 0.3 * T }); }
              base.col = CH; S[R].id = part + 'd'; }
            if (k === 1) S[R].id = part + 'd'; S.relay(); M.inert(g, [part + 'd', part + 'k']); M.sparkle(g, part + 'd', { n: 8, cols: [CH, '#fff'] }); g.sfx('ding'); hop(g); }],
            [0.65 * T, g => { S.point = false; }]]); } };
    };
    M.play(g, {
      moves(g) {
        if (!S.checked) return [{ drag: 'av', to: ['fr', 'top', 'bot'], area: [90, FY - 70, 330, FY + 80], busy: 0.1,
          then(g) { S.checked = true; M.show(g, 1.25 * T); hop(g, 'wow'); S.point = true; g.sfx('swoosh');
            M.circle(g, 'av', { dur: 0.35 * T, col: GOLD }); M.circle(g, 'fr', { delay: 0.2 * T, dur: 0.45 * T, col: GOLD });
            const n0 = M.num(0, 'z0'), n1 = M.num(0, 'z1'), sv = k => k === 1 ? M.num(a) : M.sup(M.num(a), M.num(k));
            S.zero = M.row(M.frac(M.row(sv(m), M.op('-'), M.num(am)), M.row(sv(n), M.op('-'), M.num(an))), M.op('='), M.frac(n0, n1, 'zz')); S.zero.id = 'zn';
            M.place(g, 'zn', S.zero, 196, 424, 32, { col: GOLD }); M.writeIn(g, S.zero, { delay: 0.25 * T, dur: 0.5 * T }); S.zero.alpha = 0; M.tween(g, S.zero, { alpha: 1 }, 0.1 * T, { delay: 0.2 * T });
            M.at(g, [[0.8 * T, g => { n0.col = RED; n1.col = RED; M.indicate(g, 'zz', { dur: 0.35 * T, col: RED, sc: 1.35 }); g.sfx('boing'); hop(g, 'think'); }],
              [1.25 * T, g => { S.point = false; M.tween(g, S.zero, { alpha: 0 }, 0.4 * T, { delay: 0.3 * T }); }]]); } }];
        const out = [];
        if (!S.top) out.push(diff('top'));
        if (!S.bot) out.push(diff('bot'));
        if (S.top && S.bot && !S.done) out.push({ drag: 'av', to: ['fr', 'topd', 'botd'], area: [90, FY - 70, 330, FY + 80], busy: 0.1, askAt: 1.05 * T, after: 0.8 * T,
          ask: { v: Array.isArray(S.ans) ? S.ansNode() : S.ans, wrong: [S.vt, S.vt + S.vb, 0, M.frac(M.num(S.vb), M.num(S.vt))] },
          then(g) { S.done = true; M.show(g, 1.05 * T); hop(g, 'wow'); S.point = true; g.sfx('swoosh'); delete g.s.mk.ex.zn;
            M.circle(g, 'av', { dur: 0.35 * T, col: GOLD });
            // every x in the new fraction rolls over to a
            M.at(g, [[0.25 * T, g => { for (const id of ['xt', 'xb']) { const xn = M.node(g, id); if (!xn) continue; const nn = M.paren(M.num(a, id + 'n', { col: GOLD, _born: -1 }), id + 'p', { col: GOLD, _born: -1, pop: g.t });
                const sw = p => { if (!p) return; for (const key of ['base', 'n', 'd', 'inner']) if (p[key] === xn) p[key] = nn; if (p.items) p.items = p.items.map(q => q === xn ? nn : q); for (const key of ['base', 'n', 'd', 'inner']) sw(p[key]); if (p.items) p.items.forEach(sw); };
                sw(S.T); sw(S.B); if (S.T === xn) S.T = nn; if (S.B === xn) S.B = nn; }
              S.relay(); g.sfx('pop'); M.inert(g, ['xtn', 'xbn', 'xtp', 'xbp']); }],
              [0.45 * T, g => { const sideNote = (part, k, val, dy) => { if (k === 1) return; const b = M.box(g, part + 'd'); const nd = M.row(M.num(k), M.op('·'), k - 1 === 1 ? M.num(a) : M.sup(M.num(a), M.num(k - 1)), M.op('='), M.num(val));
                  nd.id = part + 'w'; M.place(g, part + 'w', nd, b.x, b.y + dy, 25, { col: GOLD }); M.writeIn(g, nd, { dur: 0.35 * T }); M.inert(g, [part + 'w']); };
                sideNote('top', m, S.vt, -44); sideNote('bot', n, S.vb, 50); }],
              [0.9 * T, g => { S.T = M.num(S.vt, 'tv', { col: GOLD, _born: -1, pop: g.t }); S.B = M.num(S.vb, 'bv', { col: GOLD, _born: -1, pop: g.t }); S.relay(); M.inert(g, ['tv', 'bv']);
                for (const k of ['topw', 'botw']) { const e = g.s.mk.ex[k]; if (e) M.tween(g, e.node, { alpha: 0 }, 0.2 * T); } g.sfx('ding'); }]]); },
          resolve(g) { M.show(g, 0.8 * T); M.circle(g, 'fr', { dur: 0.4 * T, col: GOLD });
            M.at(g, [[0.25 * T, g => { const b = M.box(g, 'fr'); M.fly(g, { node: S.ansNode(), from: [b.x, b.y], to: 'ans', dur: 0.4 * T, arc: -50, s0: 34, s1: FS, col: '#9af0b0',
                then(g) { S.slot = S.ansNode(); S.slot.id = 'res'; S.slot.col = '#9af0b0'; S.slot._born = -1; S.slot.pop = g.t; S.relay(); M.sparkle(g, 'res', { n: 16, cols: ['#9af0b0', '#fff', GOLD] }); g.sfx('coin'); g.sfx('sparkle'); hop(g, 'laugh'); } }); g.sfx('swoosh'); }],
              [0.7 * T, g => { delete g.s.mk.ex.topw; delete g.s.mk.ex.botw; S.point = false; }]]); } });
        return out;
      },
      area(g) { return !S.checked ? ['av', 'fr'] : !S.top ? ['dd', 'top'] : !S.bot ? ['dd', 'bot'] : ['av', 'fr']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, T = M.pace(g);
    SCN.bg(g, c, 'reef');
    // moonlight from above and two jellyfish drifting
    c.save(); c.globalCompositeOperation = 'lighter'; const mg = c.createRadialGradient(250, -40, 10, 250, -40, 300); mg.addColorStop(0, 'rgba(200,230,255,0.35)'); mg.addColorStop(1, 'rgba(200,230,255,0)'); c.fillStyle = mg; c.fillRect(0, 0, 360, 360); c.restore();
    for (let i = 0; i < 2; i++) { const x = 40 + i * 270 + Math.sin(t * 0.5 + i * 2) * 14, y = 140 + i * 360 + Math.sin(t * 0.8 + i) * 20 - (i ? 0 : 0), pul = 1 + Math.sin(t * 2.4 + i) * 0.1;
      c.save(); c.translate(x, y); c.fillStyle = i ? 'rgba(255,170,220,0.55)' : 'rgba(170,220,255,0.55)'; c.beginPath(); c.ellipse(0, 0, 16 * pul, 12 / pul, 0, Math.PI, 0); c.closePath(); c.fill();
      c.strokeStyle = i ? 'rgba(255,190,230,0.5)' : 'rgba(190,230,255,0.5)'; c.lineWidth = 1.5; for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(k * 6, 0); c.quadraticCurveTo(k * 6 + Math.sin(t * 3 + k) * 5, 14, k * 6, 28); c.stroke(); } c.restore(); }
    // the stone tablet
    c.save(); c.fillStyle = 'rgba(0,20,40,0.35)'; c.beginPath(); c.roundRect(18, 196, 330, 196, 18); c.fill();
    const tg = c.createLinearGradient(0, 188, 0, 388); tg.addColorStop(0, '#3a5a6a'); tg.addColorStop(1, '#24404e'); c.fillStyle = tg; c.beginPath(); c.roundRect(14, 188, 332, 196, 18); c.fill();
    c.strokeStyle = '#6a9aa8'; c.lineWidth = 3; c.stroke(); c.fillStyle = 'rgba(120,200,160,0.35)'; for (const [x, y, r] of [[30, 200, 14], [330, 372, 18], [40, 380, 10], [310, 196, 9]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
    c.restore();
    M.drawEx(g, c, 'lim'); M.drawEx(g, c, 'sub'); M.drawEx(g, c, 'ex');
    // the d/dx chips that landed on the top and bottom: they glow and fade
    for (const ch of S.chips) { const k = (t - ch.t0) / (1.1 * T); if (k > 1) continue; const al = k < 0.7 ? 1 : (1 - k) / 0.3, nd = M.ddx('x'), mm = M.lay(nd, 30);
      c.save(); c.globalAlpha = al; c.shadowColor = CH; c.shadowBlur = 12; M.draw(c, nd, ch.x - mm.w / 2, ch.y + (mm.a - mm.d) / 2, 30, { t, col: CH }); c.restore(); }
    for (const k of ['topw', 'botw']) M.drawEx(g, c, k);
    // the 0/0 check note under the tablet
    const zb = M.box(g, 'zn'); if (zb && g.s.mk.ex.zn && (S.zero.alpha ?? 1) > 0.02) { c.save(); c.globalAlpha = S.zero.alpha ?? 1; c.fillStyle = 'rgba(10,30,50,0.6)'; c.beginPath(); c.roundRect(zb.x - zb.w / 2 - 12, zb.y - zb.h / 2 - 6, zb.w + 24, zb.h + 12, 12); c.fill(); c.restore(); M.drawEx(g, c, 'zn'); }
    // the bubble holding d/dx
    const db = M.box(g, 'dd'); if (db) { const r = Math.max(db.w, db.h) / 2 + 14, by = Math.sin(t * 1.7) * 3; c.save(); c.translate(0, by);
      const bg = c.createRadialGradient(db.x - r * 0.35, db.y - r * 0.4, 2, db.x, db.y, r); bg.addColorStop(0, 'rgba(255,255,255,0.45)'); bg.addColorStop(0.7, 'rgba(150,220,255,0.18)'); bg.addColorStop(1, 'rgba(200,240,255,0.5)');
      c.fillStyle = bg; c.beginPath(); c.arc(db.x, db.y, r, 0, 7); c.fill(); c.strokeStyle = 'rgba(220,250,255,0.85)'; c.lineWidth = 2; c.stroke(); c.restore(); }
    M.drawEx(g, c, 'dd');
    // the octopus points at the tablet while the work is shown
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.8 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    try { if (typeof ANI !== 'undefined') ANI.draw(c, 'octopus', 280, 600 - hopK * 22, 1.3, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'octopus', 280, 600, 1.3); } catch (e) { SCN.host(g, c, 'octopus', 280, 600, 1.3); }
    M.drawUI(g, c);
  },
});
