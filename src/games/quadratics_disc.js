// quadratics_disc.js — DISCRIMINANT! Work out b² − 4ac and read off how many roots ax² + bx + c = 0 has.
// Deep space: the numbers glow like starlight, and the parabola y = ax² + bx + c hangs faintly below them.
// Every move acts out its working (show your work):
//   1-3. Drag a, b and c from the key onto their letters in b² − 4ac (any order): the letter is circled, a copy of the
//        number flies down and the letter gives way to it (4ac opens up into 4 · a · c).
//   4. Tap the expression: "(−4)² = 16" writes itself above b² and flies into its place, then "4 · 1 · 3 = 12" above
//      4ac; the line reads 16 − 12, the 12 slides into the 16, which rolls over to 4, and the letters write themselves
//      back in front: b² − 4ac = 4.
//   5. Drag the value onto its sign: it lands in front of "> 0", the label lights, and the parabola draws itself across
//      the sky; each place it crosses the x-axis flashes with a count (1, 2). With no roots, a gap opens under the curve.
// Level 0: a = 1, small numbers. Level 1: a = 1 or 2. Level 2: a = 2 or 3, bigger numbers.
// Medium mode: the value of b² − 4ac is picked from the tray once the line reads "16 − 12".
const M = MK, INK = '#f4f0ff', LET = '#a8d8ff', NEW = '#ffe68a', WK = '#ffb27a', DY = 312;
// fresh(node): the copy of an expression that is actually placed. The kit glides every node whose box moved, wrappers
// too, and a wrapper's glide adds to its symbols' own glides, so rows get new wrappers (views) at every placement and
// only symbols glide. Brackets keep their identity; what is inside them rides along as views.
const STRUCT = ['items', 'base', 'exp', 'inner', 'n', 'd', 'fill', 'rows'], OWN = new Set([...STRUCT, 'k', '_pid', '_glide', '_gx', '_gy', '_m', '_born']);
const DELEG = ['id', 'v', 'col', 'hl', 'hlc', 'sc', 'alpha', 'pop', 'strike', 'write', 'bar', 'roll', 'mark', 'dx', 'dy', 'hide', 'small', 'br', 'w'];
const hid = (o, k, v) => Object.defineProperty(o, k, { value: v, writable: true, configurable: true, enumerable: false });
function view(n, deep, born) {
  if (!n || typeof n !== 'object') return n; const c = { k: n.k };
  for (const k of new Set([...Object.keys(n), ...DELEG])) if (!OWN.has(k)) Object.defineProperty(c, k, { get: () => n[k], set: v => { n[k] = v; }, enumerable: true, configurable: true });
  const sub = x => deep ? view(x, true, born) : fresh(x);
  if (n.items) c.items = n.items.map(sub); for (const k of ['base', 'exp', 'inner', 'n', 'd', 'fill']) if (n[k]) c[k] = sub(n[k]); if (n.rows) c.rows = n.rows.map(r => r.map(sub));
  if (deep && born) c._born = -1; return c;
}
function walkAll(n, f) { if (!n || typeof n !== 'object') return; f(n); for (const k of ['base', 'exp', 'inner', 'n', 'd', 'fill']) walkAll(n[k], f); (n.items || []).forEach(q => walkAll(q, f)); }
function fresh(n) {
  if (!n || typeof n !== 'object' || /^(num|var|txt|op|gap|mat)$/.test(n.k)) return n;
  if (n.k === 'paren' || n.k === 'slot') { const key = n.k === 'paren' ? 'inner' : 'fill';
    if (!n._vw || n[key] !== n._vw) hid(n, '_mdl', n[key]);
    if (n._vw) walkAll(n._vw, q => Object.defineProperty(q, 'alpha', { value: 0, writable: true, configurable: true }));
    const v = view(n._mdl, true, !!n._seen || n._born === -1); hid(n, '_vw', v); hid(n, '_seen', true); n[key] = v; return n; }
  return view(n, false);
}
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c, kind, x, y, s, facing) { // the host hops on beats and points at the work while it is shown
  const S = g.s, mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hk * 24, s, { t: g.t, pose, expr, facing }); else SCN.host(g, c, kind, x, y, s);
}
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), kind = ['+', '0', '-'][r(0, 2)];
  for (;;) {
    const a = L === 0 ? 1 : L === 1 ? r(1, 2) : r(2, 3);
    let b, c;
    if (kind === '0') { const m = r(-3, 3); if (!m) continue; b = -2 * a * m; c = a * m * m; }
    else { b = r(-(L ? 8 : 6), L ? 8 : 6); c = L === 2 ? r(-6, 9) : r(-4, 9); }
    const D = b * b - 4 * a * c; if (!b || !c || Math.abs(D) > 100) continue;
    if (kind === '+' ? D > 0 : kind === '-' ? D < 0 : D === 0) return { a, b, c, D, kind };
  }
}
function poly(a, b, c) { return M.row(M.vr('y'), M.op('='), a === 1 ? null : M.num(a), M.sup(M.vr('x'), M.num(2)), M.op(b < 0 ? '-' : '+'), Math.abs(b) === 1 ? null : M.num(Math.abs(b)), M.vr('x'), M.op(c < 0 ? '-' : '+'), M.num(Math.abs(c))); }
const sn = (v, o) => v < 0 ? M.paren(M.num(v, null, o), null, o) : M.num(v, null, o);
const gone = n => walkAll(n, q => { q.alpha = 0; if (q._mdl) walkAll(q._mdl, w => { w.alpha = 0; }); });
const born = n => { walkAll(n, q => { q._born = -1; }); return n; };
const R = (id, ...items) => { const r = M.row(...items); r.id = id; return r; };
const CL = [['cg', '>', 2, '2 roots'], ['ce', '=', 1, '1 root'], ['cl', '<', 0, 'no roots']];

MG.add({
  id: 'quadratics_disc', stage: 'quadratics', cmd: 'DISCRIMINANT!', hint: 'drag', time: 10, mood: 'night', winText: 'Counted!', hold: 1.4,
  card: {
    title: 'The discriminant', ref: 'Algebra 1–2', kind: 'Algebra',
    text: 'For a quadratic ax² + bx + c, the discriminant is the number b² − 4ac. It is the part under the square root in the quadratic formula.\n\nIts sign tells you how many solutions ax² + bx + c = 0 has. If b² − 4ac is more than 0, there are two, and the graph crosses the x-axis twice. If it is 0, there is one, and the graph just touches the x-axis. If it is less than 0, there are none, and the graph never reaches the x-axis.\n\nFor example, x² − 4x + 3 has a = 1, b = −4 and c = 3, so b² − 4ac = 16 − 12 = 4, which is more than 0: two solutions.\n\nWhy: a negative number has no real square root.',
    note: 'b² − 4ac > 0: two roots. b² − 4ac = 0: one root. b² − 4ac < 0: no real roots.',
    ask: 'How many solutions does x² + 2x + 5 = 0 have? How many does x² − 6x + 9 = 0 have?',
  },
  init(g) {
    const S = g.s; M.setup(g); const Q = S.q = pick(g), T = S.T = M.pace(g), o = { col: NEW };
    M.place(g, 'prob', poly(Q.a, Q.b, Q.c), 180, 208, 30, { col: INK });
    const key = (L, v) => [M.vr(L, null, { col: LET }), M.op('='), M.num(v, 'k' + L, { col: NEW })];
    M.place(g, 'key', M.row(...key('a', Q.a), M.gap(22), ...key('b', Q.b), M.gap(22), ...key('c', Q.c)), 180, 250, 24, { col: INK });
    // the symbols of the line, kept from step to step so they glide as it changes
    const lt = (L, id) => M.vr(L, id, { col: LET });
    const X = S.X = { b: lt('b', 'sb'), two: M.num(2), mn: M.op('-', 'mn'), four: M.num(4, 'n4'), a: lt('a', 'sa'), c: lt('c', 'sc'), da: M.op('·'), dc: M.op('·'),
      B: sn(Q.b, o), A: sn(Q.a, o), C: sn(Q.c, o), V1: M.num(Q.b * Q.b, 'V1', { col: WK }), V2: sn(4 * Q.a * Q.c, { col: WK }), e: M.op('=', 'de') };
    S.V2id = 'V2'; X.V2.id = 'V2';
    S.st = 'sub'; // 'sub' (letters and numbers), 'b2' (b² worked out), 'v' (both terms worked out), 'D' (b² − 4ac = D)
    const line = () => {
      if (S.st === 'D') return M.row(M.sup(X.b, X.two), X.mn, X.four, X.a, X.c, X.e, X.V1);
      const t1 = S.st === 'b2' || S.st === 'v' ? X.V1 : M.sup(S.f.b ? X.B : X.b, X.two);
      const t2 = S.st === 'v' ? [X.V2] : S.f.a || S.f.c ? [X.four, X.da, S.f.a ? X.A : X.a, X.dc, S.f.c ? X.C : X.c] : [X.four, X.a, X.c];
      return R('dx', R('t1', t1), X.mn, R('t2', ...t2));
    };
    // one font size for every form of the line (sized for the widest), so it never rescales
    S.f = { a: true, b: true, c: true }; let z = 38; while (z > 18 && M.lay(line(), z).w > 300) z -= 1; S.z = z; S.f = {};
    const fit = S.fit = () => M.place(g, 'dx', fresh(line()), 180, DY, S.z, { col: INK });
    fit();
    CL.forEach(([id, op], i) => { const n = M.row(M.op(op), M.num(0)); n.id = id; M.place(g, id, n, 70 + i * 110, 362, 28, { col: INK }); });
    CL.forEach(([id, , , lab], i) => M.place(g, 'l' + id, M.txt(lab, 'l' + id), 70 + i * 110, 392, 14, { col: 'rgba(220,210,255,0.75)' }));
    M.inert(g, [...CL.map(q => 'l' + q[0]), 'mn', 'n4', 'V1', 'V2', 'de']);
    g.dur *= (2.6 + 1.05 * 5) / 8;
    // a number from the key flies down into its letter, and the letter gives way to it
    const subst = (L) => ({ drag: 'k' + L, to: 's' + L, busy: 0.1, then(g) {
      S.f[L] = 'go'; M.show(g, 0.8 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh'); M.inert(g, ['k' + L]);
      const letter = X[L], from = { ...M.box(g, 'k' + L) };
      M.circle(g, letter, { col: LET, dur: 0.45 * T }); M.light(g, letter, { col: LET }); M.tween(g, 'k' + L, { alpha: 0.35 }, 0.4 * T, { delay: 0.3 * T });
      M.fly(g, { node: sn(Q[L], o), from: [from.x, from.y], to: 's' + L, delay: 0.12 * T, dur: 0.42 * T, arc: -30, s0: 24, s1: 34, col: NEW });
      M.tween(g, letter, { alpha: 0, sc: 0.5 }, 0.15 * T, { delay: 0.42 * T });
      M.at(g, [[0.56 * T, g => { const n = born(X[L.toUpperCase()]); letter.hl = 0; S.f[L] = true; if (L !== 'b') { born(X.da); born(X.dc); } fit();
        n.pop = g.t; M.sparkle(g, n, { n: 8, cols: [NEW, '#fff'] }); g.sfx('pop'); hop(g); S.point = false; }]]); } });
    const right = CL.find(q => (q[1] === '>' && Q.D > 0) || (q[1] === '=' && Q.D === 0) || (q[1] === '<' && Q.D < 0));
    const ac = 4 * Q.a * Q.c;
    M.play(g, {
      moves(g) {
        const out = [];
        for (const L of ['a', 'b', 'c']) if (!S.f[L]) out.push(subst(L));
        if (out.length || ['a', 'b', 'c'].some(L => S.f[L] !== true)) return out;
        // 4. work out b² and 4ac (written as notes that fly into place), then subtract
        if (!S.dDone) return [{ tap: ['dx', 't1', 't2'], busy: 0.1, askAt: 1.2 * T, after: 1.15 * T, ask: { v: Q.D, wrong: [Q.b * Q.b + 4 * Q.a * Q.c, -Q.b * Q.b - 4 * Q.a * Q.c, Q.D + 4, Q.D - 2, 2 * Q.b - ac] },
          then(g) { S.dDone = true; M.show(g, 1.2 * T); S.point = true; hop(g, 'think'); M.circle(g, 'dx', { col: NEW, dur: 0.5 * T }); M.tween(g, g.s.mk.ex.key.node, { alpha: 0 }, 0.4 * T);
            // each term's working is written above it ("(−4)² = 16"); then just its value drops into the line
            const nt = (id, nd, v, d, land, olds) => { const note = M.row(nd, M.op('='), M.num(v)), w = M.lay(note, 22).w, wv = M.lay(M.num(v), 22).w, b = M.box(g, id), ox = b ? M.clamp(b.x, 20 + w / 2, 340 - w / 2) - b.x : 0;
              M.note(g, { node: note, at: id, off: [ox, -40], s: 22, col: WK, delay: d, write: 0.3 * T, hold: 0.2 * T, fade: 0.2 * T });
              M.at(g, [[d + 0.5 * T, g => { const bb = M.box(g, id); if (!bb) return; M.fly(g, { node: M.num(v), from: [bb.x + ox + w / 2 - wv / 2, bb.y - 40], to: id, dur: 0.26 * T, arc: 10, s0: 22, s1: S.z, col: WK, then: land }); for (const q of olds) M.tween(g, q, { alpha: 0.15 }, 0.24 * T); }]]); };
            nt('t1', M.sup(sn(Q.b), M.num(2)), Q.b * Q.b, 0.1 * T, g => { S.st = 'b2'; for (const q of [X.B, X.two]) gone(q); fit(); X.V1._born = -1; X.V1.pop = g.t; g.sfx('pop'); hop(g); }, [X.B, X.two]);
            nt('t2', M.row(M.num(4), M.op('·'), sn(Q.a), M.op('·'), sn(Q.c)), ac, 0.42 * T, g => { S.st = 'v'; for (const q of [X.four, X.da, X.A, X.dc, X.C]) gone(q); fit(); born(X.V2); X.V2.pop = g.t; g.sfx('pop'); hop(g); }, [X.four, X.da, X.A, X.dc, X.C]); },
          resolve(g) { M.show(g, 1.15 * T); M.indicate(g, X.V1, { dur: 0.3 * T, sc: 1.2 }); M.indicate(g, 'V2', { delay: 0.1 * T, dur: 0.3 * T, sc: 1.2 });
            M.at(g, [[0.35 * T, g => { // the second term slides into the first, which rolls over to the difference
              const b0 = M.box(g, 'V1'); for (const id of ['mn', 'V2']) { const b = M.box(g, id); if (b && b0) M.tween(g, id, { dx: b0.x - b.x, alpha: 0, sc: 0.5 }, 0.3 * T); }
              M.roll(g, X.V1, Q.D, { delay: 0.12 * T, dur: 0.32 * T }); g.sfx('ding'); }],
              [0.8 * T, g => { // and the letters write themselves back in front: b² − 4ac = D
                X.mn.dx = 0; X.mn.sc = 1; X.mn.alpha = 1; S.st = 'D'; X.V1.id = 'dv'; X.V1.col = NEW; for (const q of [X.b, X.a, X.c]) Object.assign(q, { alpha: 1, sc: 1, hl: 0 }); fit();
                for (const q of [X.b, X.two, X.mn, X.four, X.a, X.c, X.e]) { q.alpha = 1; q._born = null; }
                [X.b, X.two, X.mn, X.four, X.a, X.c, X.e].forEach((q, i) => M.writeIn(g, q, { delay: i * 0.04 * T, dur: 0.16 * T }));
                X.V1.pop = g.t; M.sparkle(g, 'dv', { n: 10, cols: [NEW, '#fff'] }); g.sfx('coin'); hop(g); S.point = false; }]]); } }];
        // 5. the sign of the value tells how many roots
        if (!S.cDone) return [{ drag: 'dv', to: right[0], reach: 40, busy: 0.1, then(g) { S.cDone = true; const T2 = 1.5 * T; M.show(g, T2); S.point = true; hop(g, 'think');
          const n = M.node(g, right[0]); n.items.unshift(M.num(Q.D, null, { col: NEW, _born: -1, pop: g.t })); const w = M.lay(n, 28).w; M.place(g, right[0], n, M.clamp(70 + CL.indexOf(right) * 110, 14 + w / 2, 346 - w / 2), 362, 28, { col: INK });
          n.mark = 'good'; n.pop = g.t; g.sfx('snap'); M.indicate(g, 'l' + right[0], { delay: 0.15 * T, dur: 0.4 * T, col: NEW, sc: 1.3 });
          const b = M.box(g, right[0]); if (b) g.burst(b.x, b.y, [NEW, '#fff', '#a8d8ff'], 14, 130);
          // the parabola draws itself from left to right; each crossing of the x-axis flashes as it is reached
          S.litAt = g.t + 0.3 * T; S.trace = 0.8 * T; const h = -Q.b / (2 * Q.a), roots = S.roots();
          M.at(g, [[0.3 * T, g => g.sfx('sweep')], ...roots.map((r, i) => [0.3 * T + (r - (h - 7)) / 14 * 0.8 * T, g => { S.hit[i] = g.t; g.sfx('chime'); hop(g, 'wow'); const X0 = S.rx(r); g.burst(X0, S.AY, [NEW, '#fff', '#a8d8ff'], 12, 120); }]),
            [1.15 * T, g => { S.gapAt = roots.length ? null : g.t; if (!roots.length) g.sfx('tap'); }], [1.4 * T, g => { hop(g, 'laugh'); S.point = false; }]]); } }];
        return [];
      },
      area(g) { const L = ['a', 'b', 'c'].find(L => !S.f[L]); return L ? ['k' + L, 's' + L] : !S.dDone ? ['dx'] : ['dv', right[0]]; },
    });
    // the parabola in the sky: scaled around its vertex so its crossings (if any) are on screen
    const h = -Q.b / (2 * Q.a), k = Q.c - Q.b * Q.b / (4 * Q.a);
    S.AY = Q.D > 0 ? 448 : Q.D === 0 ? 500 : 538; S.sy = Q.D === 0 ? 10 : Math.min(14, 96 / Math.abs(k)); S.rx = x => 180 + (x - h) * 26; S.hit = [];
    S.roots = () => Q.D > 0 ? [h - Math.sqrt(Q.D) / (2 * Q.a), h + Math.sqrt(Q.D) / (2 * Q.a)] : Q.D === 0 ? [h] : [];
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, Q = S.q, t = g.t; SCN.bg(g, c, 'space');
    // a soft nebula behind the writing
    c.save(); const nb = c.createRadialGradient(190, 290, 10, 190, 290, 210); nb.addColorStop(0, 'rgba(120,70,200,0.35)'); nb.addColorStop(1, 'rgba(120,70,200,0)'); c.fillStyle = nb; c.fillRect(0, 160, 360, 280); c.restore();
    // the parabola: faint and dashed until the count, then it draws itself in light from left to right
    const h = -Q.b / (2 * Q.a), AY = S.AY, sy = S.sy, px = S.rx, f = x => Q.a * x * x + Q.b * x + Q.c;
    const on = S.litAt != null ? M.clamp((t - S.litAt) / 0.25, 0, 1) : 0, tr = S.litAt != null ? M.easeIO(M.clamp((t - S.litAt) / S.trace, 0, 1)) : 0;
    c.save(); c.strokeStyle = 'rgba(220,210,255,0.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(14, AY); c.lineTo(346, AY); c.stroke();
    c.beginPath(); c.rect(0, 404, 360, 150); c.clip();
    const curve = (x0, x1) => { c.beginPath(); for (let x = x0; x <= x1 + 1e-9; x += 0.05) { const y = AY - f(x) * sy; x > x0 ? c.lineTo(px(x), y) : c.moveTo(px(x), y); } c.stroke(); };
    c.strokeStyle = `rgba(150,220,255,${0.3 * (1 - on * 0.6)})`; c.lineWidth = 2.5; c.setLineDash([5, 6]); curve(h - 7, h + 7); c.setLineDash([]);
    if (tr > 0) { c.strokeStyle = 'rgba(150,220,255,0.95)'; c.lineWidth = 3.5; c.shadowColor = '#7ad0ff'; c.shadowBlur = 16; curve(h - 7, h - 7 + 14 * tr);
      const xe = h - 7 + 14 * tr; if (tr < 1) { c.fillStyle = '#fffbe0'; c.beginPath(); c.arc(px(xe), AY - f(xe) * sy, 5, 0, 7); c.fill(); } }
    c.restore();
    // each crossing flashes as the curve reaches it, with its count
    S.roots().forEach((r, i) => { const at = S.hit[i]; if (at == null) return; const x = px(r), k = M.clamp((t - at) / 0.3, 0, 1), p = 1 + 0.2 * Math.sin(t * 7);
      c.save(); const gr = c.createRadialGradient(x, AY, 0, x, AY, 22 * p); gr.addColorStop(0, 'rgba(255,240,170,0.95)'); gr.addColorStop(1, 'rgba(255,240,170,0)');
      c.fillStyle = gr; c.beginPath(); c.arc(x, AY, 22 * p, 0, 7); c.fill(); c.fillStyle = '#fffbe0'; c.beginPath(); c.arc(x, AY, 5, 0, 7); c.fill();
      const by = AY + 24 - Math.sin(k * Math.PI) * 6; c.globalAlpha = k; c.fillStyle = 'rgba(30,16,60,0.85)'; c.beginPath(); c.arc(x, by, 11, 0, 7); c.fill(); c.strokeStyle = NEW; c.lineWidth = 2; c.stroke();
      c.fillStyle = NEW; c.font = '700 14px Fredoka, Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(i + 1), x, by + 1); c.restore(); });
    // no roots: a gap opens between the lowest point and the axis
    if (S.gapAt != null) { const k = M.ease((t - S.gapAt) / 0.3), x = px(h), y0 = AY - f(h) * sy, y1 = M.lerp(y0, AY, k);
      c.save(); c.strokeStyle = '#ff9aa8'; c.lineWidth = 2.5; c.setLineDash([4, 5]); c.beginPath(); c.moveTo(x, y0 + 6); c.lineTo(x, y1 - 4); c.stroke(); c.setLineDash([]);
      c.globalAlpha = k; c.font = '700 13px Fredoka, Nunito, sans-serif'; c.textAlign = 'center'; c.fillStyle = 'rgba(30,16,60,0.85)'; c.beginPath(); c.arc(x + 20, (y0 + AY) / 2, 11, 0, 7); c.fill(); c.strokeStyle = '#ff9aa8'; c.lineWidth = 2; c.stroke();
      c.fillStyle = '#ff9aa8'; c.textBaseline = 'middle'; c.fillText('0', x + 20, (y0 + AY) / 2 + 1); c.restore(); }
    for (const id of ['prob', 'key', 'dx', ...CL.flatMap(q => [q[0], 'l' + q[0]])]) M.drawEx(g, c, id);
    host(g, c, 'bird', 314, 612, 1.0, -1);
    M.drawUI(g, c);
  },
});
