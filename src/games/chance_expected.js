// chance_expected.js — EXPECTED VALUE! E = Σ value × probability, on a prize wheel at a twilight boardwalk fair.
// The wheel has equal sectors: gold ones win money, plum ones lose some. The stall's sign reads E = 12 · ¼ + (−4) · ¾.
// A frog runs the stall. Coins are shown as chips on the boards: gold for winnings, red for losses.
// Moves: 1. Drag each value onto its probability (or the probability onto the value), in either order: the value and
//           its probability are circled, that outcome's sectors flash one by one (they are its share of the wheel),
//           "12 × ¼ = 3" writes itself under the term, then 3 flies up into the sign in place of the term, and 3 gold
//           chips spin out of the sectors onto the boards. Dragging a value onto the other outcome's probability is a miss.
//        2. Drag one result onto another: "3 + (−3) = 0" writes itself, every red chip pairs off with a gold chip and
//           both vanish in a puff, the chips left over hop, and the expected value lands in the sign.
// Level 0: 4 sectors, win on 1, lose on 3. Level 1: 6 sectors, win on 2, lose on 4. Level 2: three outcomes on 4 sectors.
// Medium mode: each product and the sum are picked from the tray. The classic mistake (averaging the values without
// their weights) is offered there.
const M = MK, WX = 150, WY = 428, WR = 78, SIGNY = 240, BOARD = 604, GOLD = '#ffcf4a', PLUM = '#8a4ab0', WINC = '#f4b630', LOSEC = '#7a3aa0';
const fr = (a, b) => { const gcd = (x, y) => y ? gcd(y, x % y) : x, d = gcd(a, b); return [a / d, b / d]; };
function pick(g) {
  const L = g.level, r = a => a[Math.floor(g.rand() * a.length)];
  if (L === 0) { const w = r([8, 12, 16, 20]); return { d: 4, out: [{ v: w, k: 1 }, { v: -4, k: 3 }] }; }
  if (L === 1) { const l = r([3, 6]), w = r(l === 6 ? [12, 15] : [6, 9, 12]); return { d: 6, out: [{ v: w, k: 2 }, { v: -l, k: 4 }] }; }
  const a = r([12, 16, 20]), b = r([4, 8]), l = r([2, 4]); return { d: 4, out: [{ v: a, k: 1 }, { v: b, k: 1 }, { v: -l, k: 2 }] };
}
function boardwalk(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 470); [[0, '#1a1a4a'], [0.4, '#5a3a7a'], [0.75, '#d8708a'], [1, '#ffb88a']].forEach(([k, col]) => sk.addColorStop(k, col)); c.fillStyle = sk; c.fillRect(0, 0, W, 470);
  for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,250,230,${0.3 + (i % 5) / 10})`; c.beginPath(); c.arc((i * 97) % W, (i * 41) % 170 + 6, 0.6 + (i % 3) * 0.4, 0, 7); c.fill(); }
  // the sea and a far pier with a ferris wheel
  const sea = c.createLinearGradient(0, 430, 0, 500); sea.addColorStop(0, '#b06a8a'); sea.addColorStop(1, '#4a2a5a'); c.fillStyle = sea; c.fillRect(0, 432, W, 70);
  c.strokeStyle = 'rgba(255,220,200,0.35)'; c.lineWidth = 1.5; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo((i * 53) % W, 445 + i * 6); c.lineTo((i * 53) % W + 24, 445 + i * 6); c.stroke(); }
  c.strokeStyle = 'rgba(40,20,60,0.6)'; c.lineWidth = 2; c.beginPath(); c.arc(300, 378, 46, 0, 7); c.stroke(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.beginPath(); c.moveTo(300, 378); c.lineTo(300 + Math.cos(a) * 46, 378 + Math.sin(a) * 46); c.stroke(); }
  c.beginPath(); c.moveTo(300, 378); c.lineTo(280, 436); c.moveTo(300, 378); c.lineTo(320, 436); c.stroke();
  c.fillStyle = 'rgba(40,20,60,0.7)'; c.fillRect(220, 430, 140, 6);
  // the boardwalk
  const bd = c.createLinearGradient(0, 496, 0, H); bd.addColorStop(0, '#a86a4a'); bd.addColorStop(1, '#6a3a2a'); c.fillStyle = bd; c.fillRect(0, 496, W, H - 496);
  c.strokeStyle = 'rgba(50,20,15,0.45)'; c.lineWidth = 2; for (let y = 512; y < H; y += 18 + (y - 512) * 0.12) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  c.fillStyle = '#5a2a1a'; c.fillRect(0, 494, W, 6);
}
// a chip (coin) centred at x, y
function chip(c, x, y, neg, a = 1, sc = 1) {
  c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(sc, sc);
  c.fillStyle = neg ? '#a83a3a' : '#c8901a'; c.beginPath(); c.ellipse(0, 3, 13, 5.5, 0, 0, 7); c.fill();
  c.fillStyle = neg ? '#e8605a' : GOLD; c.beginPath(); c.ellipse(0, 0, 13, 5.5, 0, 0, 7); c.fill(); c.strokeStyle = neg ? '#ffd0c8' : '#fff4c0'; c.lineWidth = 1.2; c.beginPath(); c.ellipse(0, 0, 8, 3.2, 0, 0, 7); c.stroke();
  c.fillStyle = neg ? '#ffe0dc' : '#8a5a0a'; c.font = M.NUMF(8, 700); c.textAlign = 'center'; c.fillText(neg ? '−1' : '+1', 0, 3); c.restore();
}

MG.add({
  id: 'expected', stage: 'chance', cmd: 'EXP. VALUE!', hint: 'drag', time: 10, mood: 'party', winText: 'On average!', hold: 1.8,
  card: {
    title: 'Expected value', ref: 'High school statistics', kind: 'Probability',
    text: 'The expected value of a game is what you win per play on average, if you could play it many, many times.\n\nMultiply each outcome by its probability, then add up the results. Each product is that outcome\'s fair share of the average.\n\nA wheel has 4 equal parts: one wins $12 and three lose $4. Then E = 12 × ¼ + (−4) × ¾ = 3 − 3 = 0. Over 4 spins you would expect one win (+$12) and three losses (−$12), so on average you break even: a fair game.\n\nJust averaging $12 and −$4 gives $4, which is wrong: it ignores that losing is three times as likely.',
    note: 'E = Σ value × probability: weight each outcome by its probability and add.',
    ask: 'A die pays $6 on a 6 and costs $1 otherwise. What is the expected value per roll?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g), m = p.out.length, d = p.d;
    p.out.forEach(o => { [o.pn, o.pd] = fr(o.k, d); o.prod = o.v * o.k / d; o.col = o.v > 0 ? WINC : LOSEC; });
    p.E = p.out.reduce((s, o) => s + o.prod, 0);
    // sectors: outcome i takes k of them, laid out around the wheel
    S.sec = []; p.out.forEach((o, i) => { for (let j = 0; j < o.k; j++) S.sec.push({ o: i }); });
    if (m === 2 && p.out[0].k > 1) { const a = S.sec.filter(s => s.o === 0), b = S.sec.filter(s => s.o === 1); S.sec = []; while (a.length || b.length) { if (a.length) S.sec.push(a.pop()); if (b.length) S.sec.push(b.pop()); if (b.length) S.sec.push(b.pop()); } }
    S.sec.forEach((s, j) => { s.a0 = -Math.PI / 2 + j * 2 * Math.PI / d; s.a1 = s.a0 + 2 * Math.PI / d; s.flash = -9; });
    S.terms = p.out.map((o, i) => { const v = o.v < 0 ? M.paren(M.num(o.v), 'v' + i) : M.num(o.v, 'v' + i); const pr = M.frac(M.num(o.pn), M.num(o.pd), 'p' + i); return M.row(v, M.op('·', 'x' + i), pr); });
    const sz = m === 3 ? 28 : 36;
    S.top = M.row(M.vr('E', 'ev'), M.op('=', 'eq'), ...S.terms.map((tm, i) => [i ? M.op('+', 'pl' + i) : null, tm]).flat());
    const relay = () => M.place(g, 'top', S.top, 180, SIGNY + 12, sz, { col: '#fff4dc' }); S.relay = relay; relay();
    M.inert(g, ['ev', 'eq', 'x0', 'x1', 'x2', 'pl1', 'pl2', 'nq', 'eres']);
    S.done = {}; S.coins = []; S.spin = 0; S.face = (g, e) => { S.ex = e; S.faceT = g.t; g.s.mk.lastMove = g.t; };
    S.pileX = i => m === 3 ? [70, 150, 230][i] : [92, 208][i];
    g.dur *= (2.6 + 1.05 * (m + 1)) / 8;
    const fmtE = v => (v < 0 ? '−' : '') + Math.abs(v);
    M.play(g, {
      moves(g) {
        const out = [];
        p.out.forEach((o, i) => { if (S.done[i]) return;
          const len = (0.35 + 0.16 * o.k + 0.35) * T, go = { busy: 0.1, askAt: len, after: 1.0 * T, ask: { v: o.prod, wrong: [o.v, o.v * o.pd, o.v * o.pn + o.pd, o.prod + (o.prod > 0 ? 1 : -1)] },
            then(g) { S.done[i] = 'w'; M.show(g, len); S.face(g, 'think'); g.sfx('swoosh');
              M.circle(g, ['v' + i, 'p' + i], { dur: 0.5 * T, col: o.col === WINC ? GOLD : '#d8a8ff' });
              // that outcome's sectors flash in turn: its share of the wheel
              S.sec.filter(s => s.o === i).forEach((s, j) => M.at(g, [[(0.3 + 0.16 * j) * T, g => { s.flash = g.t; g.sfx('tap'); }]]));
              S.spinTo = S.sec.findIndex(s => s.o === i);
              S.q = M.num(o.prod, 'nq', { alpha: 0, col: '#fff4c0' });
              S.note = M.row(M.num(o.v), M.op('×'), M.frac(M.num(o.pn), M.num(o.pd)), M.op('='), S.q);
              const b = M.box(g, 'v' + i), b2 = M.box(g, 'p' + i), cx = M.clamp((b.x + b2.x) / 2, 90, 270);
              M.place(g, 'note', S.note, cx, SIGNY + 74, 30, { col: '#fff4dc' }); M.writeIn(g, S.note, { delay: 0.2 * T, dur: 0.5 * T }); },
            resolve(g) { M.show(g, 1.0 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); M.indicate(g, S.q, { delay: 0.15 * T, dur: 0.3 * T }); g.sfx('ding');
              M.at(g, [[0.4 * T, g => { const bq = { ...M.box(g, 'nq') }; M.tween(g, S.note, { alpha: 0 }, 0.25 * T);
                const rn = M.num(o.prod, o.v > 0 ? 'r' + i : null, { alpha: 0, col: o.v > 0 ? '#ffe070' : '#e8b8ff' }), r = o.v > 0 ? rn : M.paren(rn, 'r' + i, { col: '#e8b8ff' }), k = S.top.items.indexOf(S.terms[i]); S.top.items[k] = r; S.terms[i] = r; relay();
                M.fly(g, { node: M.num(o.prod, null, { col: '#fff4c0' }), from: [bq.x, bq.y], to: 'r' + i, dur: 0.35 * T, arc: -20, s0: 30, s1: sz,
                  then(g) { rn.alpha = 1; r.pop = g.t; M.sparkle(g, 'r' + i, { n: 8 }); g.sfx('pop'); } });
                // chips spin out of the outcome's sectors onto the boards
                const secs = S.sec.filter(s => s.o === i); for (let c = 0; c < Math.abs(o.prod); c++) { const s = secs[c % secs.length], a = (s.a0 + s.a1) / 2 + S.spin;
                  S.coins.push({ x0: WX + Math.cos(a) * WR * 0.6, y0: WY + Math.sin(a) * WR * 0.6, pile: i, idx: c, neg: o.v < 0, t0: g.t + (0.1 + c * 0.07) * T, dur: 0.4 * T }); } }],
                [0.95 * T, g => { delete g.s.mk.ex.note; if (g.s.mk.prevNodes) delete g.s.mk.prevNodes.note; S.done[i] = true; }]]); } };
          out.push({ drag: 'v' + i, to: 'p' + i, ...go }, { drag: 'p' + i, to: 'v' + i, ...go }); });
        if (out.length) return out;
        // 2. add the shares
        if (!S.sumAt) {
          const rs = p.out.map((o, i) => 'r' + i), go = { busy: 0.1, askAt: 0.75 * T, after: 1.45 * T, ask: { v: p.E, wrong: [Math.round(p.out.reduce((s, o) => s + o.v, 0) / m * 100) / 100, p.out.reduce((s, o) => s + Math.abs(o.prod), 0), p.E + 1, -p.E || 2] },
            then(g) { S.sumAt = g.t; M.show(g, 0.75 * T); S.face(g, 'think'); g.sfx('swoosh'); M.circle(g, rs, { dur: 0.5 * T, col: GOLD });
              S.q = M.num(fmtE(p.E), 'nq', { alpha: 0, col: '#fff4c0' });
              S.note = M.row(...p.out.map((o, i) => [i ? M.op('+') : null, o.prod < 0 ? M.paren(M.num(o.prod)) : M.num(o.prod)]).flat(), M.op('='), S.q);
              M.place(g, 'note', S.note, 180, SIGNY + 74, 30, { col: '#fff4dc' }); M.writeIn(g, S.note, { delay: 0.15 * T, dur: 0.5 * T }); },
            resolve(g) { M.show(g, 1.45 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); g.sfx('ding');
              // every red chip pairs off with a gold chip and both vanish
              const gold = S.coins.filter(c => !c.neg).sort((a, b) => b.idx - a.idx), red = S.coins.filter(c => c.neg).sort((a, b) => b.idx - a.idx), n = Math.min(gold.length, red.length);
              for (let k = 0; k < n; k++) { const a = gold[k], b = red[k], t0 = g.t + (0.1 + k * 0.1) * T; a.pair = b.pair = { t0, dur: 0.35 * T, x: 150 + (k % 3 - 1) * 26, y: BOARD - 40 - Math.floor(k / 3) * 10 };
                M.at(g, [[(0.1 + k * 0.1 + 0.35) * T, g => { g.burst(a.pair.x, a.pair.y, ['#fff', '#ffe9a0', '#ffb0a8'], 6, 70); g.sfx(k % 2 ? 'pop' : 'tap'); }]]); }
              const endK = (0.1 + n * 0.1 + 0.4) * T;
              M.at(g, [[endK, g => { for (const c of S.coins) if (!c.pair) c.hop = g.t + c.idx * 0.03; S.face(g, 'wow'); }],
                [endK + 0.15 * T, g => { const bq = { ...M.box(g, 'nq') }; M.tween(g, S.note, { alpha: 0 }, 0.25 * T);
                  const res = M.num(fmtE(p.E), 'eres', { alpha: 0 }); S.top.items = [S.top.items[0], S.top.items[1], res]; relay();
                  M.fly(g, { node: M.num(fmtE(p.E), null, { col: '#fff4c0' }), from: [bq.x, bq.y], to: 'eres', dur: 0.4 * T, arc: -30, s0: 30, s1: 44,
                    then(g) { res.alpha = 1; res.pop = g.t; M.sparkle(g, 'eres', { n: 14 }); g.sfx('coin'); S.face(g, 'laugh'); } }); }],
                [endK + 0.6 * T, g => { delete g.s.mk.ex.note; }]]); } };
          const mv = []; for (const a of rs) for (const b of rs) if (a !== b) mv.push({ drag: a, to: b, ...go }); return mv;
        }
        return [];
      },
      area(g) { const m0 = M.current(g)[0]; return m0 ? [].concat(m0.drag, m0.to) : null; },
    });
  },
  update(g, dt) { const S = g.s; if (S.spinTo != null) { const s = S.sec[S.spinTo], target = -((s.a0 + s.a1) / 2 + Math.PI / 2); let d = target - S.spin; d = Math.atan2(Math.sin(d), Math.cos(d)); S.spin += d * Math.min(1, dt * 5); } M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, p = S.p, T = M.pace(g), E = M.easeIO;
    c.drawImage(g.bake('chance_expected_boardwalk', boardwalk), 0, 0, 360, 640);
    // a string of fair lights
    for (let i = 0; i < 14; i++) { const x = i * 28 + 4, y = 168 + Math.sin(i * 0.9) * 4 + (i % 7) * 0; const on = 0.5 + 0.5 * Math.sin(t * 3 + i * 1.3); c.fillStyle = ['#ffd860', '#ff8a8a', '#8ad0ff', '#a8f08a'][i % 4]; c.globalAlpha = 0.5 + on * 0.5; c.beginPath(); c.arc(x, y, 3.5, 0, 7); c.fill(); c.globalAlpha = 1; }
    c.strokeStyle = 'rgba(30,10,30,0.5)'; c.lineWidth = 1; c.beginPath(); for (let i = 0; i < 14; i++) { const x = i * 28 + 4, y = 166 + Math.sin(i * 0.9) * 4; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
    SCN.panel(c, 'sign', 180, SIGNY, 340, 92, t);
    // the wheel on its post
    c.save(); c.fillStyle = '#5a2a3a'; c.fillRect(WX - 6, WY, 12, 100); c.fillStyle = '#3a1a2a'; c.fillRect(WX - 22, 494, 44, 10);
    c.fillStyle = 'rgba(20,10,20,0.35)'; c.beginPath(); c.arc(WX + 4, WY + 6, WR + 8, 0, 7); c.fill();
    c.fillStyle = '#ffe9c0'; c.beginPath(); c.arc(WX, WY, WR + 8, 0, 7); c.fill();
    for (let i = 0; i < 20; i++) { const a = i * Math.PI / 10 + t * 0.6; c.fillStyle = i % 2 ? '#ffd860' : '#ff8a6a'; c.globalAlpha = 0.6 + 0.4 * Math.sin(t * 6 + i); c.beginPath(); c.arc(WX + Math.cos(a) * (WR + 4), WY + Math.sin(a) * (WR + 4), 2.6, 0, 7); c.fill(); } c.globalAlpha = 1;
    for (const s of S.sec) { const o = p.out[s.o], fk = t - s.flash < 0.45 ? Math.sin((t - s.flash) / 0.45 * Math.PI) : 0, a0 = s.a0 + S.spin, a1 = s.a1 + S.spin, pop = fk * 6;
      const mid = (a0 + a1) / 2, ox = Math.cos(mid) * pop, oy = Math.sin(mid) * pop;
      c.fillStyle = M.mix(o.v > 0 ? (s.o === 1 ? '#f08a3a' : WINC) : LOSEC, '#ffffff', fk * 0.55); c.beginPath(); c.moveTo(WX + ox, WY + oy); c.arc(WX + ox, WY + oy, WR, a0, a1); c.closePath(); c.fill();
      c.strokeStyle = '#fff4dc'; c.lineWidth = 2.5; c.stroke();
      const lx = WX + ox + Math.cos(mid) * WR * 0.62, ly = WY + oy + Math.sin(mid) * WR * 0.62, nd = M.num(o.v > 0 ? '+' + o.v : o.v), s0 = p.d === 6 ? 17 : 20, mm = M.lay(nd, s0);
      M.draw(c, nd, lx - mm.w / 2, ly + (mm.a - mm.d) / 2, s0 * (1 + fk * 0.3), { t, col: o.v > 0 ? '#5a2a0a' : '#fff0ff' }); }
    c.fillStyle = '#ffe9c0'; c.beginPath(); c.arc(WX, WY, 11, 0, 7); c.fill(); c.strokeStyle = '#a86a2a'; c.lineWidth = 2; c.stroke();
    // the pointer at the top
    c.fillStyle = '#e8404a'; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(WX, WY - WR + 12); c.lineTo(WX - 10, WY - WR - 14); c.lineTo(WX + 10, WY - WR - 14); c.closePath(); c.fill(); c.stroke(); c.restore();
    // chips: flying out, stacked in piles on the boards, pairing off
    for (const cn of S.coins) { if (t < cn.t0) continue; const k = M.clamp((t - cn.t0) / cn.dur, 0, 1), e = E(k), px = S.pileX(cn.pile), py = BOARD - cn.idx * 7;
      let x = M.lerp(cn.x0, px, e), y = M.lerp(cn.y0, py, e) - Math.sin(e * Math.PI) * 50, a = 1, sc = 1;
      if (cn.pair && t > cn.pair.t0) { const q = M.clamp((t - cn.pair.t0) / cn.pair.dur, 0, 1), qe = E(q); x = M.lerp(px, cn.pair.x, qe); y = M.lerp(py, cn.pair.y, qe) - Math.sin(qe * Math.PI) * 30; if (q >= 1) continue; sc = 1 - 0.3 * qe; }
      const hk = cn.hop != null ? t - cn.hop : -1; if (hk > 0 && hk < 0.3) y -= Math.sin(hk / 0.3 * Math.PI) * 10;
      chip(c, x, y, cn.neg, a, sc); }
    // the frog host
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.ex : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'frog', 302, 600 - hopK * 20, 1.1, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'frog', 302, 600, 1.1);
    M.drawEx(g, c, 'top');
    if (K.ex.note) { const e = K.ex.note, m = M.lay(e.node, e.s), wr = e.node.write, wk = wr ? E((t - wr.t0) / wr.dur) : 1; if (wk > 0) { c.save(); c.globalAlpha = (e.node.alpha ?? 1) * 0.55; c.fillStyle = 'rgba(40,15,50,0.9)'; c.beginPath(); c.roundRect(e.x - 12, e.y - m.a - 8, (m.w + 24) * wk, m.a + m.d + 16, 14); c.fill(); c.restore(); } }
    M.drawEx(g, c, 'note');
    M.drawUI(g, c);
  },
});
