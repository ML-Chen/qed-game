// modular_fermat.js — FERMAT! Find 3¹⁰⁰ mod 7 with Fermat's little theorem: 3⁶ ≡ 1 (mod 7), 100 = 6 · 16 + 4,
// so 3¹⁰⁰ = (3⁶)¹⁶ · 3⁴ ≡ 1 · 3⁴ = 81 ≡ 4.
// A pond at twilight seen from above: a ring of p lily pads numbered 0 to p − 1 floats under the problem, and a frog sits
// on pad 1. Multiplying by 3 (mod 7) is a hop: from pad k the frog jumps to pad 3k mod 7. Every move's working plays by
// itself (show your work; the fuse stands still meanwhile):
//   1. Tap the prime 7 (or drag it onto the 3): "7 − 1 = 6" writes itself, then the frog hops six times, 1 → 3 → 2 → 6
//      → 4 → 5 → 1, while the key line under the problem counts along: 3¹ ≡ 3, 3² ≡ 2, ... and lands on 3⁶ ≡ 1, which
//      glows: six hops always bring the frog home.
//   2. Drag that 6 onto the exponent 100 (or tap 100): "100 = 6 · 16 + 4" writes itself, then the working line
//      ≡ (3⁶)¹⁶ · 3⁴ writes itself, the 16 and the 4 flying up into its exponents.
//   3. Tap (3⁶)¹⁶: the key 3⁶ ≡ 1 pulses, its 1 flies down and takes the place of 3⁶, "1¹⁶ = 1" writes itself and the
//      whole block melts away.
//   4. Tap 3⁴: the frog hops four times from pad 1 (1 → 3 → 2 → 6 → 4) while "3⁴ = 81 = 7 · 11 + 4" writes itself;
//      3⁴ rolls over to 4, which flies up into the answer slot.
// Moves 3 and 4 may come in either order. Level 0: p = 5. Level 1: p = 7, exponents up to 100. Level 2: p = 11 or 13.
// Medium mode: p − 1, the remainder of the exponent, 1¹⁶ and the final residue are picked from the tray; the wrong
// tiles are real mistakes (dividing by p instead of p − 1, 81 itself, 3 · 4 instead of 3⁴).
const M = MK;
const INK = '#f4fff4', GOLD = '#ffd86a', PAD = '#6ac46a', PADD = '#3a8a44', Y1 = 208, YK = 260, Y2 = 322, YN = 366, RC = 480, RR = 96, HX = 52, HY = 612;
const pw = (a, k, p) => { let v = 1; for (let i = 0; i < k; i++) v = v * a % p; return v; };

function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), one = a => a[r(a.length)];
  const p = L === 0 ? 5 : L === 1 ? 7 : one([11, 13]), a = L === 0 ? one([2, 3]) : L === 1 ? one([2, 3, 5]) : one([2, 3]);
  const q = L === 0 ? 3 + r(4) : L === 1 ? 5 + r(12) : 3 + r(6), rr = L === 0 ? 2 + r(2) : L === 1 ? 2 + r(3) : 2 + r(3);
  const N = (p - 1) * q + rr;
  return { p, a, q, r: rr, N, big: Math.pow(a, rr), ans: pw(a, rr, p) };
}

MG.add({
  id: 'fermat', stage: 'modular', cmd: 'FERMAT!', hint: 'tap', time: 10, winText: 'Fermat!', hold: 1.9,
  card: {
    title: "Fermat's little theorem", ref: 'Number theory', kind: 'Number theory',
    text: 'If p is a prime and a is not a multiple of p, then a to the power p − 1 leaves remainder 1 when divided by p. Mathematicians write a^(p−1) ≡ 1 (mod p).\n\nThat makes huge powers easy. For 3¹⁰⁰ mod 7: here p − 1 = 6, so 3⁶ ≡ 1. Write 100 = 6 · 16 + 4. Then 3¹⁰⁰ = (3⁶)¹⁶ · 3⁴, and every 3⁶ is worth 1, so only 3⁴ = 81 is left. 81 = 7 · 11 + 4, so the answer is 4.\n\nYou can watch it on a ring of 7 lily pads: hopping to "3 times the pad number, mod 7" brings the frog home after 6 hops.',
    note: 'For a prime p, a^(p−1) ≡ 1 (mod p). Divide the exponent by p − 1 and keep only the remainder.',
    ask: 'What is 2¹⁰ mod 11? What is 3²² mod 5?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { p, a, q, r, N, big, ans } = S, T = M.pace(g);
    S.slot = M.slot('ans');
    S.line1 = M.row(M.sup(M.num(a, 'b'), M.num(N, 'e')), M.gap(10), M.txt('mod', 'mod'), M.gap(8), M.num(p, 'p'), M.op('=', 'eq1'), S.slot);
    M.place(g, 'l1', S.line1, 180, Y1, 40, { col: INK });
    M.inert(g, ['mod', 'eq1', 'keq', 'kb', 'kv', 'eq2', 'dot2']);
    S.frog = 1; S.lit = {}; S.trail = [];
    const hop = e => { g.s.mk.lastMove = g.t; S.face = e; S.faceT = g.t; };
    // the frog hops from pad to pad: count hops, multiplying by a each time (mod p), starting at pad 1
    const hops = (g, count, step, each) => { let cur = 1;
      for (let k = 1; k <= count; k++) M.at(g, [[k * step - step * 0.85, g => { const to = cur * a % p; S.hopA = { from: cur, to, t0: g.t, dur: step * 0.8 }; cur = to; }],
        [k * step - step * 0.05, g => { S.frog = S.hopA.to; S.lit[S.frog] = g.t; S.trail.push({ to: S.frog, t: g.t }); g.sfx('tap', { pitch: 0.9 + k * 0.06 }); if (each) each(g, k, S.frog); }]]); };
    const step1 = Math.min(0.2, 1.0 / (p - 1)) * T;

    // ---- 1. p − 1, and the frog's round trip ----
    const fermat = {
      busy: 0.1, askAt: 0.5 * T, after: (p - 1) * step1 + 0.35 * T, ask: { v: p - 1, wrong: [p, p + 1, p - 2] },
      then(g) { S.st = 1; S.point = true; hop('think'); M.show(g, 0.5 * T); g.sfx('swoosh');
        M.circle(g, 'p', { col: GOLD, dur: 0.45 * T });
        S.n1v = M.num(p - 1, null, { alpha: 0 }); S.n1 = M.row(M.num(p), M.op('-'), M.num(1), M.op('='), S.n1v);
        const b = M.box(g, 'p'); M.place(g, 'n1', S.n1, M.clamp(b.x, 80, 290), YK, 26, { col: GOLD }); M.writeIn(g, S.n1, { dur: 0.3 * T, delay: 0.1 * T }); },
      resolve(g) { const dur = (p - 1) * step1 + 0.35 * T; M.show(g, dur); S.n1v.alpha = 1; M.writeIn(g, S.n1v, { dur: 0.14 * T }); g.sfx('ding');
        M.at(g, [[0.25 * T, g => { M.tween(g, S.n1, { alpha: 0 }, 0.15 * T);
            S.kk = M.num(0, 'kk'); S.kv = M.num(1, 'kv'); S.key = M.row(M.sup(M.num(a, 'kb'), S.kk), M.op('≡', 'keq'), S.kv); S.key.id = 'key';
            M.place(g, 'key', S.key, 180, YK, 32, { col: GOLD }); hop('wow'); }],
          [0.42 * T, g => { delete g.s.mk.ex.n1; }]]);
        M.at(g, [[0.25 * T, g => hops(g, p - 1, step1, (g, k, to) => { M.roll(g, S.kk, k, { dur: step1 * 0.6 }); M.roll(g, S.kv, to, { dur: step1 * 0.6 }); M.place(g, 'key', S.key, 180, YK, 32, { col: GOLD }); })]]);
        M.at(g, [[0.25 * T + (p - 1) * step1, g => { M.indicate(g, S.key, { sc: 1.15, dur: 0.35 * T, col: '#fff' }); M.sparkle(g, 'key', { n: 14 }); g.sfx('coin'); hop('laugh'); S.home = g.t; S.point = false; }]]); },
    };
    // ---- 2. divide the exponent by p − 1 ----
    const divide = {
      busy: 0.1, askAt: 0.6 * T, after: 1.0 * T, ask: { v: r, wrong: [q, N % p, p - 1, r + 1] },
      then(g) { S.st = 2; S.point = true; hop('think'); M.show(g, 0.6 * T); g.sfx('swoosh');
        M.circle(g, 'e', { col: GOLD, dur: 0.45 * T }); M.circle(g, 'kk', { col: GOLD, dur: 0.45 * T, delay: 0.05 * T });
        S.nr = M.num(r, 'nr', { alpha: 0 }); S.n2 = M.row(M.num(N), M.op('='), M.num(p - 1), M.op('·'), M.num(q, 'nq'), M.op('+'), S.nr);
        M.place(g, 'n2', S.n2, 180, Y2, 30, { col: GOLD }); M.writeIn(g, S.n2, { dur: 0.4 * T, delay: 0.12 * T }); },
      resolve(g) { M.show(g, 1.0 * T); S.nr.alpha = 1; M.writeIn(g, S.nr, { dur: 0.15 * T }); g.sfx('ding');
        M.at(g, [[0.32 * T, g => { const bq = { ...M.box(g, 'nq') }, br = { ...M.box(g, 'nr') }; M.tween(g, S.n2, { alpha: 0 }, 0.2 * T);
            // the working line: ≡ (a^(p−1))^q · a^r
            S.bq = M.num(q, 'bq', { alpha: 0 }); S.sr = M.num(r, 'sr', { alpha: 0 }); S.inner = M.sup(M.num(a), M.num(p - 1));
            S.bigN = M.sup(M.paren(S.inner), S.bq, 'big'); S.smallN = M.sup(M.num(a), S.sr, 'small'); S.dot = M.op('·', 'dot2');
            S.line2 = M.row(M.op('≡', 'eq2'), S.bigN, S.dot, S.smallN); S.relay2(); M.writeIn(g, S.line2, { dur: 0.35 * T });
            M.fly(g, { node: M.num(q, null, { col: GOLD }), from: [bq.x, bq.y], to: 'bq', dur: 0.36 * T, delay: 0.1 * T, arc: -40, s0: 30, s1: 26, then(g) { S.bq.alpha = 1; S.bq.pop = g.t; g.sfx('pop'); } });
            M.fly(g, { node: M.num(r, null, { col: GOLD }), from: [br.x, br.y], to: 'sr', dur: 0.36 * T, delay: 0.18 * T, arc: -40, s0: 30, s1: 26, then(g) { S.sr.alpha = 1; S.sr.pop = g.t; g.sfx('pop'); hop('wow'); } }); }],
          [0.75 * T, g => { delete g.s.mk.ex.n2; S.point = false; }]]); },
    };
    S.relay2 = () => M.place(g, 'l2', S.line2, 180, Y2, 40, { col: INK });
    // when both parts are simplified, the residue flies up into the answer slot
    const finish = g => { if (!(S.done3 && S.done4)) return;
      M.at(g, [[0.05 * T, g => { M.fly(g, { node: M.num(ans, null, { col: GOLD }), from: 'res', to: 'ans', dur: 0.36 * T, arc: -50, s0: 40, s1: 40,
        then(g) { S.slot.fill = M.num(ans, 'ansv', { col: GOLD }); M.place(g, 'l1', S.line1, 180, Y1, 40, { col: INK }); S.slot.fill.pop = g.t; M.sparkle(g, 'ansv', { n: 16 }); g.sfx('coin'); hop('laugh'); } }); }]]); };
    // ---- 3. (a^(p−1))^q ≡ 1^q = 1 ----
    const one = {
      busy: 0.1, askAt: 0.62 * T, after: 0.75 * T, ask: { v: 1, wrong: [q, 0, a] },
      then(g) { S.done3 = true; S.point = true; hop('think'); M.show(g, 0.62 * T); g.sfx('swoosh');
        M.circle(g, S.inner, { col: GOLD, dur: 0.4 * T }); M.indicate(g, 'key', { sc: 1.15, dur: 0.4 * T, col: '#fff' });
        M.at(g, [[0.22 * T, g => { const kb = { ...M.box(g, 'kv') }; M.tween(g, S.inner.base, { alpha: 0 }, 0.12 * T, { delay: 0.18 * T }); M.tween(g, S.inner.exp, { alpha: 0 }, 0.12 * T, { delay: 0.18 * T });
          M.fly(g, { node: M.num(1, null, { col: GOLD }), from: [kb.x, kb.y], to: S.inner.base.id || 'big', dur: 0.3 * T, arc: -30, s0: 32, s1: 40,
            then(g) { S.one1 = M.num(1, null, { _born: -1, col: GOLD, pop: g.t }); S.bigN.base = M.paren(S.one1); S.relay2(); g.sfx('pop');
              S.n3v = M.num(1, null, { alpha: 0 }); S.n3 = M.row(M.sup(M.num(1), M.num(q)), M.op('='), S.n3v); const b = M.box(g, 'big'); M.place(g, 'n3', S.n3, M.clamp(b.x, 70, 290), YN, 26, { col: GOLD }); M.writeIn(g, S.n3, { dur: 0.22 * T }); } }); }]]);
        S.inner.base.id = 'inb'; },
      resolve(g) { M.show(g, 0.75 * T); S.n3v.alpha = 1; M.writeIn(g, S.n3v, { dur: 0.12 * T }); g.sfx('ding');
        M.at(g, [[0.2 * T, g => { // the block melts away: (1)^q · becomes nothing
            for (const n of [S.bigN.base, S.one1, S.bq, S.dot]) M.tween(g, n, { alpha: 0 }, 0.2 * T); M.tween(g, S.n3, { alpha: 0 }, 0.2 * T, { delay: 0.1 * T }); S.melt = g.t; }],
          [0.45 * T, g => { S.line2.items = S.line2.items.filter(n => n !== S.bigN && n !== S.dot); S.relay2(); delete g.s.mk.ex.n3; hop('laugh'); S.point = false; finish(g); }]]); },
    };
    // ---- 4. a^r: hop it out and reduce ----
    const step4 = Math.min(0.2, 0.8 / r) * T, ask4 = 0.15 * T + r * step4 + 0.12 * T;
    const last = {
      busy: 0.1, askAt: ask4, after: 0.7 * T, ask: { v: ans, wrong: [big, a * r % p, (ans + 1) % p, big % (p - 1)] },
      then(g) { S.done4 = true; S.point = true; hop('think'); M.show(g, ask4); g.sfx('swoosh');
        M.circle(g, 'small', { col: GOLD, dur: 0.4 * T }); S.frog = 1;
        const k = Math.floor(big / p); S.n4v = M.num(ans, null, { alpha: 0 });
        S.n4 = M.row(M.sup(M.num(a), M.num(r)), M.op('='), M.num(big), ...(big >= p ? [M.op('='), M.num(p), M.op('·'), M.num(k), M.op('+'), S.n4v] : []));
        const b = M.box(g, 'small'); const m = M.lay(S.n4, 26); M.place(g, 'n4', S.n4, M.clamp(b.x, m.w / 2 + 10, 350 - m.w / 2), YN, 26, { col: GOLD }); M.writeIn(g, S.n4, { dur: 0.5 * T, delay: 0.1 * T });
        M.at(g, [[0.15 * T, g => hops(g, r, step4)]]); },
      resolve(g) { M.show(g, 0.7 * T); S.n4v.alpha = 1; M.writeIn(g, S.n4v, { dur: 0.12 * T }); g.sfx('ding'); S.lit[ans] = g.t;
        M.at(g, [[0.2 * T, g => { // a^r rolls over to the residue
            S.res = M.num(big, 'res', { _born: -1 }); S.line2.items[S.line2.items.indexOf(S.smallN)] = S.res; S.relay2(); M.roll(g, S.res, ans, { dur: 0.28 * T }); S.res.col = GOLD; M.tween(g, S.n4, { alpha: 0 }, 0.2 * T, { delay: 0.15 * T }); hop('wow'); }],
          [0.5 * T, g => { delete g.s.mk.ex.n4; S.point = false; finish(g); }]]); },
    };
    M.play(g, {
      moves(g) {
        if (!S.st) return [{ ...fermat, tap: 'p' }, { ...fermat, drag: 'p', to: 'b' }];
        if (S.st === 1) { const b = M.box(g, 'e'); return [{ ...divide, drag: 'kk', to: 'e', area: b ? [b.x - 50, b.y - 40, b.x + 50, b.y + 30] : null }, { ...divide, tap: 'e' }]; }
        const out = []; if (!S.done3) out.push({ ...one, tap: 'big' }); if (!S.done4) out.push({ ...last, tap: 'small' }); return out;
      },
      area(g) { return !S.st ? 'p' : S.st === 1 ? ['kk', 'e'] : !S.done3 ? 'big' : 'small'; },
    });
  },
  update(g, dt) { const S = g.s, K = S.mk; M.update(g, dt); if (K.missAt >= 0 && K.missAt !== S.seenMiss) { S.seenMiss = K.missAt; S.face = 'sad'; S.faceT = g.t; S.splash = g.t; } },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, p = S.p;
    c.drawImage(g.bake('modular_fermat_pond', pond), 0, 0, W, H);
    // ripples and fireflies
    c.save(); for (let i = 0; i < 4; i++) { const k = (t * 0.3 + i / 4) % 1, x = [70, 300, 250, 110][i], y = [560, 590, 380, 420][i]; c.strokeStyle = `rgba(200,255,230,${0.3 * (1 - k)})`; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y, 8 + k * 30, 3 + k * 10, 0, 0, 7); c.stroke(); }
    for (let i = 0; i < 14; i++) { const x = (i * 53 + Math.sin(t * 0.7 + i) * 18) % W, y = 120 + (i * 97) % 480 + Math.cos(t * 0.6 + i * 2) * 12, a = 0.3 + 0.6 * Math.abs(Math.sin(t * 1.8 + i)); c.fillStyle = `rgba(230,255,140,${a})`; c.shadowColor = '#e6ff8c'; c.shadowBlur = 8; c.beginPath(); c.arc(x, y, 2.2, 0, 7); c.fill(); } c.restore();
    // the ring of lily pads, one per residue, with a faint trail of the hops
    const pos = k => { const an = -Math.PI / 2 + 2 * Math.PI * k / p; return [180 + Math.cos(an) * RR, RC + Math.sin(an) * RR * 0.92]; }, pr = p > 7 ? 19 : 24;
    S.trail = S.trail.filter(h => t - h.t < 1.2);
    for (let k = 0; k < p; k++) { const [x, y] = pos(k), lit = S.lit[k] != null ? Math.max(0, 1 - (t - S.lit[k]) / 1.2) : 0, home = k === 1 && S.home != null ? Math.max(0, 1 - (t - S.home) / 1.5) : 0;
      c.save(); c.fillStyle = 'rgba(0,30,30,0.35)'; c.beginPath(); c.ellipse(x + 2, y + 4, pr, pr * 0.8, 0, 0, 7); c.fill();
      const gr = c.createRadialGradient(x - pr * 0.3, y - pr * 0.3, 2, x, y, pr); gr.addColorStop(0, P.mix('#9ae08a', '#ffe680', Math.max(lit, home))); gr.addColorStop(1, P.mix(PAD, '#e8b830', Math.max(lit, home) * 0.8)); c.fillStyle = gr;
      const a0 = 0.9 + k * 0.7; c.beginPath(); c.moveTo(x + Math.cos(a0 + 0.22) * pr * 0.55, y + Math.sin(a0 + 0.22) * pr * 0.55); c.arc(x, y, pr, a0 + 0.4, a0 + 2 * Math.PI); c.closePath(); c.fill(); c.strokeStyle = PADD; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, pr, a0 + 0.4, a0 + 2 * Math.PI); c.stroke();
      c.font = M.NUMF(pr > 20 ? 22 : 19, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#163a1a'; c.fillText(String(k), x, y + 1); c.restore(); }
    // the frog on its pad (or mid-hop)
    let fx, fy, air = 0; { const H = S.hopA; if (H && t < H.t0 + H.dur) { const k = M.easeIO(M.clamp((t - H.t0) / H.dur, 0, 1)), [x0, y0] = pos(H.from), [x1, y1] = pos(H.to); fx = M.lerp(x0, x1, k); fy = M.lerp(y0, y1, k) - Math.sin(k * Math.PI) * 34; air = Math.sin(k * Math.PI);
        c.save(); c.strokeStyle = 'rgba(255,240,170,0.6)'; c.setLineDash([4, 5]); c.lineWidth = 2; c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 - 50, x1, y1); c.stroke(); c.restore(); }
      else { [fx, fy] = pos(S.frog); } }
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', sad = S.splash != null && t - S.splash < 0.6;
    const expr = won ? 'laugh' : lost || sad ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    const pose = won ? 'cheer' : air > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'frog', fx, fy + 8, 0.62, { t, pose, expr, noShadow: air > 0.1 }); else SCN.host(g, c, 'frog', fx, fy, 0.62);
    // a soft dark band behind the math so it reads over the water
    c.save(); c.fillStyle = 'rgba(10,30,40,0.35)'; c.beginPath(); c.roundRect(18, Y1 - 46, 324, (S.line2 || S.mk.ex.n2 ? Y2 + 22 : YK + 24) - (Y1 - 46), 18); c.fill(); c.restore();
    M.drawEx(g, c, 'l1'); for (const k of ['key', 'n1', 'n2', 'l2', 'n3', 'n4']) M.drawEx(g, c, k);
    M.drawUI(g, c);
  },
});
// the pond at twilight, seen from above: deep teal water with the sky's colours in it, reeds and stones at the edges
function pond(c, W, H) {
  const wg = c.createLinearGradient(0, 0, 0, H); wg.addColorStop(0, '#2a2a5a'); wg.addColorStop(0.35, '#1e4a6a'); wg.addColorStop(1, '#0e3a42'); c.fillStyle = wg; c.fillRect(0, 0, W, H);
  // reflected sunset glow and stars in the water
  const rg = c.createRadialGradient(260, 120, 10, 260, 120, 260); rg.addColorStop(0, 'rgba(255,150,170,0.35)'); rg.addColorStop(1, 'rgba(255,150,170,0)'); c.fillStyle = rg; c.fillRect(0, 0, W, H);
  const R = P.rng(19); for (let i = 0; i < 60; i++) { c.fillStyle = `rgba(255,255,230,${0.15 + R() * 0.35})`; c.fillRect(R() * W, R() * 300, 1.5, 1.5); }
  c.strokeStyle = 'rgba(180,230,255,0.08)'; c.lineWidth = 2; for (let i = 0; i < 18; i++) { const y = 40 + i * 34 + R() * 10; c.beginPath(); c.moveTo(R() * 60, y); c.lineTo(80 + R() * 220, y + (R() - 0.5) * 4); c.stroke(); }
  // reeds and stones at the left and right edges
  for (const [x0, dir] of [[0, 1], [W, -1]]) { for (let i = 0; i < 9; i++) { const x = x0 + dir * (6 + R() * 26), y = 120 + i * 60 + R() * 30; c.fillStyle = '#2a4a30'; c.beginPath(); c.ellipse(x, y, 14 + R() * 10, 9 + R() * 6, R() * 3, 0, 7); c.fill(); c.strokeStyle = '#4a7a3a'; c.lineWidth = 3; c.lineCap = 'round'; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + dir * (8 + k * 6), y - 10 - k * 4); c.stroke(); } } }
  // the frog's home lily pad at the bottom left, and a lotus
  c.fillStyle = '#ffc0d8'; for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; c.beginPath(); c.ellipse(312 + Math.cos(a) * 8, 600 + Math.sin(a) * 6, 9, 5, a, 0, 7); c.fill(); } c.fillStyle = '#ffe680'; c.beginPath(); c.arc(312, 600, 4, 0, 7); c.fill();
}
