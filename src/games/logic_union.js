// logic_union.js — INCL-EXCL! Inclusion–exclusion: |A ∪ B| = |A| + |B| − |A ∩ B|.
// Low tide on a beach: two rope loops A and B lie on the wet sand and overlap; seashells lie inside them. The slate gives
// |A| = 7, |B| = 5, |A ∩ B| = 3 and asks |A ∪ B| = ?. Each move is acted out (show your work):
//   Drag |A| onto loop A (or |B| onto loop B, either order): the loop glows, a blue (orange) ring pops onto each of its
//      shells one after another while a counter rolls 1 … 7, and the 7 flies down into the working line "= 7 + 5".
//      Once both are counted, the shells in the overlap wear two rings and "×2" writes itself beside them.
//   Drag |A ∩ B| onto the overlap: the second ring lifts off each overlap shell and flies into the working line, which
//      reads "= 7 + 5 − 3". Then 7 + 5 merges into 12, 12 − 3 into 9, and every shell lights up once as the answer counts
//      to 9: each shell is now counted exactly once.
// Level 0: small sets, overlap 1–2. Level 1: up to 8, overlap 2–3. Level 2: up to 10, overlap 2–4.
// Medium mode: |A| + |B| − |A ∩ B| is picked from the tray (wrong tiles: |A| + |B|, |A| + |B| + |A ∩ B|, one overlap too many).
// Wrong moves: a count dropped on the other loop, |A ∩ B| before both loops are counted, the answer slot.
const M = MK, INK = '#2a2440', DY = 214, WY = 266, CA = { x: 128, y: 418 }, CB = { x: 232, y: 418 }, R = 88;
const COL = { A: '#2a7ad8', B: '#e8742a', I: '#c04ac0' }, HX = 312, HY = 610;
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  const i = L === 0 ? 1 + r(2) : L === 1 ? 2 + r(2) : 2 + r(3), a = i + (L === 0 ? 2 + r(3) : L === 1 ? 2 + r(4) : 3 + r(4)), b = i + (L === 0 ? 1 + r(3) : L === 1 ? 2 + r(3) : 2 + r(4));
  return { a, b, i: i };
}
const inA = p => Math.hypot(p.x - CA.x, p.y - CA.y) < R - 14, inB = p => Math.hypot(p.x - CB.x, p.y - CB.y) < R - 14;
const outA = p => Math.hypot(p.x - CA.x, p.y - CA.y) > R + 14, outB = p => Math.hypot(p.x - CB.x, p.y - CB.y) > R + 14;
function place(g, n, ok) { for (let sp = 34; sp >= 20; sp -= 2) { const out = []; for (let tries = 0; out.length < n && tries < 3000; tries++) {
    const p = { x: 30 + g.rand() * 300, y: 320 + g.rand() * 200 }; if (!ok(p) || out.some(q => Math.hypot(q.x - p.x, q.y - p.y) < sp)) continue; out.push(p); }
  if (out.length === n) return out.sort((p, q) => p.y - q.y || p.x - q.x); }
  return [...Array(n)].map((_, k) => ({ x: 180, y: 380 + k * 24 })); }
// ∩ and ∪, painted (the fonts have neither): cup = true draws ∪
function capCup(c, b, s, col, cup) { const a = s * 0.2, x = b.x, y = b.y - s * 0.3 + (cup ? -a * 0.3 : a * 0.3); c.save(); c.strokeStyle = col; c.lineWidth = s * 0.085; c.lineCap = 'round'; c.beginPath();
  if (cup) { c.moveTo(x - a, y - a * 1.2); c.lineTo(x - a, y); c.arc(x, y, a, Math.PI, 0, true); c.lineTo(x + a, y - a * 1.2); }
  else { c.moveTo(x - a, y + a * 1.2); c.lineTo(x - a, y); c.arc(x, y, a, Math.PI, 0); c.lineTo(x + a, y + a * 1.2); } c.stroke(); c.restore(); }
function shell(c, x, y, s, col, t) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = 'rgba(80,50,30,0.2)'; c.beginPath(); c.ellipse(1, 6, 11, 4, 0, 0, 7); c.fill();
  const gr = c.createLinearGradient(0, -10, 0, 8); gr.addColorStop(0, '#fff4ea'); gr.addColorStop(1, col); c.fillStyle = gr; c.strokeStyle = '#8a5a5a'; c.lineWidth = 1.3;
  c.beginPath(); c.moveTo(-3, 7); c.lineTo(-10, -2); c.quadraticCurveTo(0, -16, 10, -2); c.lineTo(3, 7); c.closePath(); c.fill(); c.stroke();
  c.beginPath(); for (let k = -2; k <= 2; k++) { c.moveTo(0, 6); c.lineTo(k * 4.2, -8 + Math.abs(k) * 1.6); } c.stroke();
  c.fillStyle = col; c.fillRect(-4, 6, 8, 3); c.restore();
}

MG.add({
  id: 'logic_union', stage: 'logic', cmd: 'INCL-EXCL!', hint: 'drag', time: 10, mood: 'bright', winText: 'Counted!', hold: 1.8,
  card: {
    title: 'Inclusion–exclusion', ref: 'Discrete math', kind: 'Sets',
    text: 'A ∪ B (the union) holds everything that is in A, in B, or in both. |A| means how many things are in A.\n\nTo count A ∪ B, start with |A| + |B|. But the things in both sets, A ∩ B, were counted once for A and once again for B. So take them away once: |A ∪ B| = |A| + |B| − |A ∩ B|.\n\nFor example, 7 shells lie in loop A, 5 lie in loop B, and 3 of them lie in both. Then 7 + 5 = 12 counts those 3 shells twice, so there are 12 − 3 = 9 shells in all.\n\nThe name says it: include each set, then exclude what was counted twice.',
    note: '|A ∪ B| = |A| + |B| − |A ∩ B|: add both sets, then subtract the overlap, which was counted twice.',
    ask: '20 students play soccer, 15 play chess and 5 do both. How many play soccer or chess?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); const T = M.pace(g), { a, b, i } = S;
    S.u = a + b - i; S.order = [];
    const pts = [...place(g, a - i, p => inA(p) && outB(p)).map(p => ({ ...p, r: 'A' })), ...place(g, i, p => inA(p) && inB(p)).map(p => ({ ...p, r: 'I' })), ...place(g, b - i, p => inB(p) && outA(p)).map(p => ({ ...p, r: 'B' }))];
    S.sh = pts.map((p, k) => ({ ...p, k, ph: g.rand() * 6, rings: [], col: ['#f8b0a0', '#f8d890', '#c8d8f8', '#f0c0e0'][k % 4] }));
    const bar = () => M.txt('|'), lbl = (parts, n, id) => M.row(bar(), ...parts, bar(), M.op('='), M.num(n, id, { col: COL[id[1]] }));
    S.dA = lbl([M.vr('A')], a, 'nA'); S.dB = lbl([M.vr('B')], b, 'nB'); S.dI = lbl([M.vr('A'), { ...M.gap(16), id: 'capI' }, M.vr('B')], i, 'nI');
    S.data = M.row(S.dA, M.gap(14), S.dB, M.gap(14), S.dI);
    S.ans = M.slot('ans', { w: 30, col: '#8a70a0' }); S.terms = [];
    S.work = M.row(bar(), M.vr('A'), { ...M.gap(18), id: 'cupU' }, M.vr('B'), bar(), M.op('=', 'weq'), S.ans);
    S.placeD = () => M.place(g, 'data', S.data, 180, DY, 28, { col: INK }); S.placeW = () => M.place(g, 'work', S.work, 180, WY, 34, { col: INK });
    S.placeD(); S.placeW();
    M.zone(g, 'zA', { x: CA.x - 34, y: CA.y, w: 100, h: 150 }); M.zone(g, 'zB', { x: CB.x + 34, y: CB.y, w: 100, h: 150 }); M.zone(g, 'zI', { x: 180, y: CA.y, w: 56, h: 120 });
    M.inert(g, ['capI', 'cupU', 'weq', 'tA', 'tB', 'tI', 'mn', 'pl', 'res', 'run']);
    g.dur *= (2.6 + 1.05 * 3.6) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    // count one loop: its shells get a ring each, one after another, while a counter rolls
    const countLoop = (g, L, n) => { const mine = S.sh.filter(q => q.r === L || q.r === 'I'), gap = Math.min(0.13, 0.9 / n) * T, t0 = 0.3 * T, C = L === 'A' ? CA : CB;
      S.loopAt = S.loopAt || {}; S.loopAt[L] = g.t; S.point = true; hop(g, 'wow'); g.sfx('swoosh');
      const cnt = M.num(1, 'cnt' + L, { alpha: 0, col: COL[L] }); M.place(g, 'cnt' + L, cnt, C.x + (L === 'A' ? -62 : 62), C.y - 84, 30, { col: COL[L] });
      M.at(g, mine.map((q, j) => [t0 + j * gap, g => { q.rings.push({ L, t: g.t }); g.sfx('pop', { p: 1 + j * 0.06, vol: 0.5 });
        if (j === 0) { cnt.alpha = 1; M.writeIn(g, cnt, { dur: 0.1 * T }); } else M.roll(g, cnt, j + 1, { dur: 0.1 * T }); cnt.pop = g.t; }]));
      const tf = t0 + n * gap + 0.12 * T;
      // the count flies into the working line
      M.at(g, [[tf, g => { const tn = M.num(n, 't' + L, { col: COL[L], alpha: 0 }); const first = !S.terms.length; S.terms.push(tn);
        if (first) S.work.items.pop(); S.work.items.push(...(first ? [tn] : [M.op('+', 'pl'), tn])); S.placeW(); M.tween(g, cnt, { alpha: 0 }, 0.12 * T);
        M.fly(g, { node: M.num(n, null, { col: COL[L] }), from: [C.x + (L === 'A' ? -62 : 62), C.y - 94], to: 't' + L, dur: 0.36 * T, arc: -30, s0: 30, s1: 34, then(g) { tn.alpha = 1; tn.pop = g.t; M.sparkle(g, 't' + L, { n: 6 }); delete g.s.mk.ex['cnt' + L]; hop(g); } }); }]]);
      let te = tf + 0.4 * T;
      if (S.order.length === 2) M.at(g, [[te, g => { S.twiceAt = g.t; g.sfx('boing', { vol: 0.35 }); hop(g, 'think');
        M.note(g, { node: M.row(M.op('×'), M.num(2)), at: [180, CA.y - 96], s: 26, col: COL.I, write: 0.2 * T, hold: 0.5 * T, fade: 0.25 * T }); }]]), te += 0.5 * T;
      return te; };

    M.play(g, {
      moves(g) {
        const out = [];
        for (const L of ['A', 'B']) if (!S.order.includes(L)) out.push({ drag: 'n' + L, to: ['z' + L, 'zI'], busy: 0.1, area: L === 'A' ? [30, 330, 160, 510] : [200, 330, 330, 510],
          then(g) { S.order.push(L); M.inert(g, ['n' + L]); M.tween(g, 'n' + L, { alpha: 0.7 }, 0.3 * T); M.show(g, countLoop(g, L, L === 'A' ? a : b)); } });
        if (S.order.length === 2 && !S.sub) out.push({ drag: 'nI', to: 'zI', busy: 0.1, get askAt() { return S.askT; }, get after() { return S.afterLen || 1.5 * T; },
          ask: { v: S.u, wrong: [a + b, a + b + i, a + b - 2 * i] },
          then(g) { S.sub = true; M.inert(g, ['nI']); M.tween(g, 'nI', { alpha: 0.7 }, 0.3 * T); S.point = true; hop(g, 'wow'); S.lensAt = g.t;
            const lens = S.sh.filter(q => q.r === 'I'), gap = Math.min(0.16, 0.6 / i) * T, t0 = 0.3 * T;
            const mn = M.op('-', 'mn', { alpha: 0 }), tI = M.num(0, 'tI', { col: COL.I, alpha: 0 }); let shown = 0;
            S.work.items.push(mn, tI); S.placeW();
            // the second ring lifts off each overlap shell and flies into the working line
            M.at(g, lens.map((q, j) => [t0 + j * gap, g => { const rg = q.rings[1]; rg.off = g.t; g.sfx('whoosh', { vol: 0.4 });
              if (j === 0) { mn.alpha = 1; mn._born = g.t; }
              M.fly(g, { node: M.txt('○'), from: [q.x, q.y - 4], to: 'tI', dur: 0.32 * T, arc: -40, s0: 22, s1: 18, col: COL.B,
                then(g) { shown++; if (shown === 1) { tI.v = '1'; tI.alpha = 1; tI.pop = g.t; } else M.roll(g, tI, shown, { dur: 0.1 * T }); tI.pop = g.t; g.sfx('tap'); } }); }]));
            const tw = t0 + (i - 1) * gap + 0.4 * T;
            // 7 + 5 merges into 12
            M.at(g, [[tw, g => { M.circle(g, ['tA', 'tB'], { dur: 0.4 * T, col: '#ffb21f' }); hop(g, 'think'); }],
              [tw + 0.35 * T, g => { const [t1, t2] = S.terms, it = S.work.items, k1 = it.indexOf(t1), k2 = it.indexOf(t2), b1 = M.box(g, t1.id);
                for (const q of [it[Math.min(k1, k2) + 1], t2]) { const bq = M.box(g, q.id); if (bq && b1) M.tween(g, q, { dx: b1.x - bq.x, alpha: 0, sc: 0.6 }, 0.22 * T); }
                M.roll(g, t1, a + b, { delay: 0.14 * T, dur: 0.2 * T }); t1.col = INK; }],
              [tw + 0.58 * T, g => { const [t1, t2] = S.terms; S.work.items = S.work.items.filter(q => q !== t2 && q.id !== 'pl'); t1.id = 'run'; S.placeW(); t1.pop = g.t; g.sfx('ding'); }]]);
            S.askT = tw + 0.95 * T; M.show(g, S.askT); },
          resolve(g) { hop(g, 'happy'); const it = S.work.items, run = S.terms[0], k = it.indexOf(run), b1 = M.box(g, run.id);
            for (const q of [it[k + 1], it[k + 2]]) { const bq = M.box(g, q.id); if (bq && b1) M.tween(g, q, { dx: b1.x - bq.x, alpha: 0, sc: 0.6 }, 0.22 * T); }
            M.roll(g, run, S.u, { delay: 0.14 * T, dur: 0.2 * T });
            M.at(g, [[0.37 * T, g => { S.work.items = it.filter(q => q !== it[k + 1] && q !== it[k + 2]); run.col = '#1a8a4a'; run.id = 'res'; S.placeW(); run.pop = g.t; g.sfx('ding'); }]]);
            // the check: every shell lights up once while the answer counts up to it
            const gap = Math.min(0.1, 0.9 / S.u) * T, t0 = 0.55 * T, order = S.sh.slice().sort((p, q) => p.x - q.x);
            M.at(g, order.map((q, j) => [t0 + j * gap, g => { q.flash = g.t; g.sfx('chime', { vol: 0.3, p: 1 + j * 0.04 }); }]));
            const te = t0 + S.u * gap + 0.1 * T;
            M.at(g, [[te, g => { M.indicate(g, 'res', { dur: 0.35 * T, sc: 1.4 }); M.sparkle(g, 'res', { n: 16 }); g.sfx('coin'); hop(g, 'laugh'); S.point = false; }]]);
            S.afterLen = te + 0.45 * T; M.show(g, S.afterLen); } });
        return out;
      },
      area(g) { return S.order.length < 2 ? ['nA', 'nB'].filter(id => !S.order.includes(id[1])) : ['nI', 'zI']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, T = M.pace(g);
    SCN.bg(g, c, 'beach');
    // wet sand, with a shimmer where the tide just went out
    c.drawImage(g.bake('ie_sand', (cc, W, H) => { const gr = cc.createLinearGradient(0, 300, 0, H); gr.addColorStop(0, '#d8bc88'); gr.addColorStop(1, '#c8a46a'); cc.fillStyle = gr; cc.fillRect(0, 312, W, H - 312);
      cc.fillStyle = 'rgba(255,255,255,0.35)'; cc.beginPath(); cc.moveTo(0, 312); for (let x = 0; x <= W; x += 20) cc.lineTo(x, 312 + Math.sin(x * 0.04) * 5); cc.lineTo(W, 300); cc.lineTo(0, 300); cc.fill();
      cc.fillStyle = 'rgba(120,80,40,0.12)'; for (let k = 0; k < 120; k++) { cc.beginPath(); cc.arc((k * 97) % W, 330 + (k * 53) % 300, 1.4, 0, 7); cc.fill(); } }), 0, 0, 360, 640);
    SCN.panel(c, 'glass', 180, 238, 332, 104, t);
    // the rope loops
    const glowL = L => S.loopAt && S.loopAt[L] != null ? Math.max(0, 1 - (t - S.loopAt[L]) / (1.2 * T)) : 0;
    for (const [L, C] of [['A', CA], ['B', CB]]) { const gl = glowL(L), miss = K.missInfo && K.missInfo.to === 'z' + L && t - K.missAt < 0.6, wob = miss ? Math.sin((t - K.missAt) * 40) * 4 : 0;
      c.save(); c.lineWidth = 7; c.strokeStyle = '#a8804a'; if (gl > 0) { c.shadowColor = COL[L]; c.shadowBlur = 20 * gl; } c.beginPath(); c.arc(C.x + wob, C.y, R, 0, 7); c.stroke();
      c.lineWidth = 2.2; c.strokeStyle = miss ? '#d8454a' : M.mix('#e8d0a0', COL[L], 0.55 + 0.45 * gl); c.setLineDash([7, 6]); c.lineDashOffset = L === 'A' ? 0 : 3; c.beginPath(); c.arc(C.x + wob, C.y, R, 0, 7); c.stroke(); c.restore();
      c.save(); c.font = M.VARF(28); c.fillStyle = COL[L]; c.textAlign = 'center'; c.fillText(L, C.x + (L === 'A' ? -62 : 62), C.y + R + 6); c.restore(); }
    // the overlap glows while it is counted twice, and while its extra rings leave
    const twK = S.twiceAt != null && !S.sub ? 0.5 + 0.5 * Math.sin((t - S.twiceAt) * 6) : S.lensAt != null ? Math.max(0, 1 - (t - S.lensAt) / (0.9 * T)) : 0;
    if (twK > 0) { c.save(); c.beginPath(); c.arc(CA.x, CA.y, R, 0, 7); c.clip(); c.globalAlpha = 0.25 * twK; c.fillStyle = COL.I; c.beginPath(); c.arc(CB.x, CB.y, R, 0, 7); c.fill(); c.restore(); }
    // the shells, with a ring for every time they have been counted
    for (const q of S.sh) { const fl = q.flash != null ? Math.max(0, 1 - (t - q.flash) / 0.4) : 0, bob = Math.sin(t * 1.5 + q.ph) * 0.8;
      if (fl > 0) { c.save(); c.fillStyle = `rgba(255,240,150,${0.8 * fl})`; c.shadowColor = '#ffe08a'; c.shadowBlur = 16; c.beginPath(); c.arc(q.x, q.y - 2, 15, 0, 7); c.fill(); c.restore(); }
      q.rings.forEach((rg, j) => { if (rg.off != null && t - rg.off > 0.05) return; const k = M.clamp((t - rg.t) / 0.2, 0, 1), rr = (16 + j * 5) * (1 + Math.sin(k * Math.PI) * 0.4);
        c.save(); c.strokeStyle = COL[rg.L]; c.lineWidth = 2.6; c.globalAlpha = k; c.beginPath(); c.arc(q.x, q.y - 2, rr, 0, 7); c.stroke(); c.restore(); });
      shell(c, q.x, q.y + bob, 1.2 + fl * 0.3, q.col, t); }
    M.drawEx(g, c, 'data'); M.drawEx(g, c, 'work'); M.drawEx(g, c, 'cntA'); M.drawEx(g, c, 'cntB');
    for (const id of ['capI', 'cupU']) { const b = M.box(g, id), n = M.node(g, id); if (b) capCup(c, { x: b.x + (n && n._ax || 0), y: b.y + (n && n._ay || 0) }, b.s, INK, id === 'cupU'); }
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'turtle', HX, HY - hopK * 20, 1.15, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'turtle', HX, HY, 1.15);
    M.drawUI(g, c);
  },
});
