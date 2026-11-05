// decimals_mult.js — DECIMAL PLACES! Multiplying decimals: multiply as whole numbers, then count the decimal places.
// A frog pond at night. The problem (2.4 × 0.3) glows in the sky over the water; the answer will sit on lily pads.
//   1. Tap the × sign: both decimal points lift out of their numbers and hover as fireflies, the digits close up
//      (2.4 × 0.3 reads 24 × 03, the 0 going faint), each number pulses, and 72 writes itself onto the lily pads.
//   2-3. Drag each firefly down to the pond, in either order. It lands at the right end of 72 and hops left one digit
//      for every digit that came after it in its own number: the counted digit lights up in the firefly's colour, the
//      hopped-over digit lights up too, and a little arc with a running count (1, 2, ...) draws over it. When the point
//      runs out of digits a 0 writes itself in. After the second firefly, a leading 0 writes in if needed, the digits
//      close up around the point, and the points come back into the problem: 2.4 × 0.3 = 0.72.
// Level 0: 2.4 × 0.3 style (tenths × tenths). Level 1: 0.6 × 0.7 or 0.6 × 0.08. Level 2: 0.24 × 0.3 (a padding 0).
// Medium mode: the tray asks for the whole-number product, then for the final answer once the second firefly lands.
const M = MK, INK = '#fff4dc', COLS = ['#ffe27a', '#ffa8d8'], PY = 250, AY = 388, SZ = 54, HOV = 66, FX = 292, FY = 590;
const clean = (m, d) => d <= 0 ? String(m) + '0'.repeat(-d) : (s => s.slice(0, -d) + '.' + s.slice(-d))(String(m).padStart(d + 1, '0'));
function gen(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1)); let A, B;
  for (let i = 0; i < 80; i++) {
    if (L === 0) { A = { m: r(12, 25), d: 1 }; B = { m: r(2, 4), d: 1 }; }
    else if (L === 1) { A = { m: r(2, 9), d: 1 }; B = g.rand() < 0.5 ? { m: r(2, 9), d: 1 } : { m: r(2, 9), d: 2 }; }
    else { A = { m: r(11, 29), d: 2 }; B = { m: r(2, 6), d: 1 }; }
    if (A.m % 10 && (A.m * B.m) % 10) break;
  }
  return [A, B];
}
const FIREFLY = (c, x, y, col, r = 6, t = 0) => { c.save(); const gl = c.createRadialGradient(x, y, 0, x, y, r * 4); gl.addColorStop(0, P.rgba(col, 0.55)); gl.addColorStop(1, P.rgba(col, 0)); c.fillStyle = gl; c.beginPath(); c.arc(x, y, r * 4, 0, 7); c.fill();
  c.fillStyle = 'rgba(220,240,255,0.5)'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(x + s * r * 0.9, y - r * 0.9, r * 0.8, r * 0.4, s * (0.6 + Math.sin(t * 40) * 0.3), 0, 7); c.fill(); }
  c.fillStyle = '#fffbe8'; c.shadowColor = col; c.shadowBlur = 14; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.restore(); };

MG.add({
  id: 'decimals_mult', stage: 'decimals', cmd: 'DECIMAL PLACES!', hint: 'drag', time: 10, mood: 'night', winText: 'Pointed!', hold: 1.7,
  card: {
    title: 'Multiplying decimals', ref: 'Grade 5', kind: 'Decimals',
    text: 'To multiply decimals, first ignore the decimal points and multiply the whole numbers. For 2.4 × 0.3, work out 24 × 3 = 72.\n\nThen put the point back. Count the digits after the point in each number: 2.4 has one and 0.3 has one, so the answer needs 1 + 1 = 2 digits after its point. Start at the right end of 72 and hop the point 2 places left: 0.72.\n\nWhy? 2.4 is 24 tenths and 0.3 is 3 tenths. Tenths times tenths make hundredths, so the answer is 72 hundredths, or 0.72. If the point runs out of digits, write zeros in front.',
    note: 'Multiply as if there were no points. The answer has as many digits after its point as the two numbers have together.',
    ask: 'What is 1.2 × 0.4? What is 0.5 × 0.07?',
  },
  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g); S.F = gen(g); S.P = S.F[0].m * S.F[1].m; S.p = S.F[0].d + S.F[1].d;
    g.dur *= (2.6 + 1.05 * 3) / 8;
    S.F.forEach((F, i) => { const s = String(F.m).padStart(F.d + 1, '0'); F.i = i; F.col = COLS[i]; F.ip = s.length - F.d; F.st = 'in';
      F.digits = [...s].map((ch, j) => M.num(ch, `f${i}_${j}`)); F.zero = []; for (let j = 0; j < s.length - 1 && s[j] === '0'; j++) F.zero.push(F.digits[j]);
      F.gap = { ...M.gap(17), id: 'fg' + i }; });
    S.x = M.op('×', 'x');
    const facItems = F => F.st === 'in' || F.st === 'back' ? [...F.digits.slice(0, F.ip), F.gap, ...F.digits.slice(F.ip)] : F.digits;
    const relayP = () => { S.pr = M.row(...facItems(S.F[0]), S.x, ...facItems(S.F[1])); M.place(g, 'pr', S.pr, 180, PY, SZ, { col: INK }); };
    relayP(); M.inert(g, ['fg0', 'fg1']);
    // the answer row: = and the digits on lily pads, with a gap between every two digits where the point can sit
    S.eq = M.op('=', 'aeq'); S.cells = []; S.gaps = []; S.pk = 0; S.arcs = [];
    const relayA = () => { const items = [S.eq, M.gap(14)]; if (!S.cells.length) items.push(M.slot('aq', { col: '#9ab8d8' }));
        else S.cells.forEach((cn, j) => items.push(S.gaps[j], cn)), items.push(S.gaps[S.cells.length]);
      S.ans = M.row(...items); M.place(g, 'ans', S.ans, 180, AY, SZ, { col: INK }); M.inert(g, ['aeq', ...S.cells.map(q => q.id), ...S.gaps.map(q => q.id)]); };
    relayA(); S.relayA = relayA;
    let gid = 0; const newGap = w => ({ ...M.gap(w), id: 'ag' + gid++ });
    // where the answer's point is drawn: r = digits to its right
    S.gapX = r => { const gn = S.gaps[S.cells.length - r], b = gn && M.box(g, gn.id); return b ? b.x + (gn._gx || 0) : 180; };
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    M.zone(g, 'pond', { x: 180, y: AY - 16, w: 300, h: 96 }); M.inert(g, ['pond']); // a drop target only (the move's area); tapping the water is not a mistake
    const HT = 0.36 * T, HD = 0.27 * T;
    // one firefly's places: hop the point left once per digit after its point in its own number
    const hops = (g, F) => { const list = [];
      for (let k = 0; k < F.d; k++) list.push([k * HT, g => {
        const go = () => { const r0 = S.pk; S.ap = { r0, r1: r0 + 1, t0: g.t, dur: HD }; g.sfx('swoosh');
          M.at(g, [[HD, g => { S.pk = r0 + 1; S.ap = { r0: S.pk }; S.arcs.push({ r: S.pk, col: F.col, t0: g.t }); g.sfx('pop'); hop(g);
            const fd = F.digits[F.digits.length - 1 - k], ad = S.cells[S.cells.length - S.pk]; M.indicate(g, fd, { col: F.col, sc: 1.35, dur: 0.32 * T }); if (ad) M.indicate(g, ad, { col: F.col, sc: 1.25, dur: 0.3 * T }); }]]); };
        // out of digits: a 0 writes itself in front, then the point hops over it
        if (S.pk >= S.cells.length) { const z = M.num(0, 'az' + gid, { col: '#cfe8ff' }); S.cells.unshift(z); S.gaps.unshift(newGap(12)); S.gaps[1].w = 14; relayA(); M.writeIn(g, z, { dur: 0.16 * T }); M.at(g, [[0.12 * T, go]]); } else go(); }]);
      M.at(g, list); return F.d * HT + 0.16 * T; }; // + the time a written-in 0 adds to the last hop
    const finale = g => { const list = [];
      list.push([0, g => { if (S.pk >= S.cells.length) { const z = M.num(0, 'az' + gid, { col: '#cfe8ff' }); S.cells.unshift(z); S.gaps.unshift(newGap(12)); S.gaps[1].w = 14; relayA(); M.writeIn(g, z, { dur: 0.2 * T }); g.sfx('tap'); } }]);
      list.push([0.28 * T, g => { // the digits close up around the point, which settles into the ink
        S.gaps.forEach((gp, j) => { gp.w = j === S.cells.length - S.pk ? 15 : 2; }); relayA(); S.arcFade = g.t; S.settle = g.t;
        for (const F of S.F) { F.st = 'back'; F.backT = g.t; for (const q of F.zero) M.tween(g, q, { alpha: 1 }, 0.25 * T); for (const q of F.digits) M.unlight(g, q); } relayP();
        S.cells.forEach((q, j) => M.indicate(g, q, { delay: j * 0.06 * T, dur: 0.3 * T, sc: 1.2, col: '#c8f0ff' })); }]);
      list.push([0.62 * T, g => { M.sparkle(g, 'ans', { n: 16, cols: ['#ffe27a', '#ffa8d8', '#fff', '#a8e0ff'] }); g.sfx('coin'); hop(g, 'laugh'); S.won = true; }]);
      M.at(g, list); return 0.75 * T; };
    M.play(g, {
      moves(g) {
        if (!S.mult) return [{ tap: 'x', busy: 0.1, askAt: 0.8 * T, after: 0.7 * T, ask: { v: S.P, wrong: [S.P + 10, S.P - 10, S.F[0].m + S.F[1].m, S.P * 10] },
          then(g) { S.mult = true; M.show(g, 0.8 * T); hop(g, 'think'); M.indicate(g, 'x', { dur: 0.4 * T, col: '#ffe27a' }); g.sfx('swoosh');
            // the points lift out and hover; the digits close up; leading zeros go faint (024 is just 24)
            for (const F of S.F) { const b = M.box(g, F.gap.id); F.home = { x: b.x, y: PY - 4 }; F.hov = { x: b.x, y: PY - HOV }; F.st = 'lift'; F.t0 = g.t; }
            M.at(g, [[0.3 * T, g => { relayP(); for (const F of S.F) for (const q of F.zero) M.tween(g, q, { alpha: 0.28 }, 0.25 * T); }],
              [0.5 * T, g => { S.F.forEach((F, i) => F.digits.forEach(q => { if (!F.zero.includes(q)) M.indicate(g, q, { delay: i * 0.12 * T, dur: 0.3 * T, sc: 1.15 }); })); }]]); },
          resolve(g) { M.show(g, 0.7 * T); S.cells = [...String(S.P)].map((ch, j) => M.num(ch, 'ac' + j)); S.gaps = []; for (let j = 0; j <= S.cells.length; j++) S.gaps.push(newGap(j === 0 || j === S.cells.length ? 12 : 14)); relayA();
            S.cells.forEach((q, j) => { q._born = -1; M.writeIn(g, q, { delay: j * 0.14 * T, dur: 0.2 * T }); M.sparkle(g, q, { delay: j * 0.14 * T + 0.18 * T, n: 5 }); });
            S.padT = g.t; g.sfx('ding'); hop(g);
            M.at(g, [[0.5 * T, g => { S.F.forEach((F, i) => M.zone(g, 'p' + i, { x: F.hov.x, y: F.hov.y, w: 46, h: 46 })); }]]); } }];
        if (S.won || !S.cells.length) return [];
        const left = S.F.filter(F => !F.dropped);
        return left.map(F => { const last = left.length === 1, rest = F.d * HT + 0.16 * T + (last ? 0.8 * T : 0.1 * T);
          const mv = { drag: 'p' + F.i, to: 'pond', area: [0, 312, 360, 480], busy: 0.1,
            then(g) { F.dropped = true; F.st = 'fly'; F.t0 = g.t; const d = S.dropXY || [F.hov.x, F.hov.y]; F.from = { x: d[0], y: d[1] - 20 }; F.dur = 0.4 * T;
              delete g.s.mk.box['p' + F.i]; delete g.s.mk.zones['p' + F.i]; g.sfx('whoosh'); M.show(g, 0.45 * T);
              // the digits after this point in its own number light up in its colour: those are the places to count
              F.digits.slice(F.ip).forEach((q, j) => M.light(g, q, { col: F.col, delay: j * 0.05 * T }));
              M.at(g, [[0.4 * T, g => { F.st = 'gone'; if (S.ap) S.apPop = g.t; else S.ap = { r0: 0 }; S.apPop = g.t; M.sparkle(g, [S.gapX(S.pk), AY - 6], { n: 7, cols: [F.col, '#fff'] }); g.sfx('pop'); hop(g, 'wow'); }]]);
              if (!last) { M.show(g, 0.4 * T + rest); M.at(g, [[0.45 * T, g => hops(g, F)]]); } } };
          if (last) Object.assign(mv, { askAt: 0.45 * T, after: rest, ask: { v: clean(S.P, S.p), wrong: [clean(S.P, S.p - 1), clean(S.P, S.p + 1), String(S.P), clean(S.P, S.p + 2)] },
            resolve(g) { M.show(g, rest); const h = hops(g, F); M.at(g, [[h, finale]]); } });
          return mv; });
      },
      area(g) { return !S.mult ? 'x' : S.F.filter(F => !F.dropped).map(F => 'p' + F.i).concat(['pond']); },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { g.s.dropXY = [x, y]; M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, Mk = S.mk;
    c.drawImage(g.bake('dmult_pond', (cc, W, H) => {
      const sk = cc.createLinearGradient(0, 0, 0, 320); sk.addColorStop(0, '#0e1236'); sk.addColorStop(0.6, '#2a2760'); sk.addColorStop(1, '#5a3f78'); cc.fillStyle = sk; cc.fillRect(0, 0, W, 320);
      const R = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(91); for (let i = 0; i < 90; i++) { cc.fillStyle = `rgba(255,250,230,${0.25 + R() * 0.6})`; cc.beginPath(); cc.arc(R() * W, R() * 300, R() * 1.3 + 0.3, 0, 7); cc.fill(); }
      const mg = cc.createRadialGradient(64, 132, 4, 64, 132, 70); mg.addColorStop(0, 'rgba(255,246,210,0.5)'); mg.addColorStop(1, 'rgba(255,246,210,0)'); cc.fillStyle = mg; cc.fillRect(0, 60, 140, 150); cc.fillStyle = '#fff4d0'; cc.beginPath(); cc.arc(64, 132, 20, 0, 7); cc.fill();
      cc.fillStyle = '#1a1838'; cc.beginPath(); cc.moveTo(0, 318); for (let x = 0; x <= W; x += 12) cc.lineTo(x, 300 - Math.abs(Math.sin(x * 0.045)) * 22 - Math.sin(x * 0.13) * 5); cc.lineTo(W, 330); cc.lineTo(0, 330); cc.fill();
      const wg = cc.createLinearGradient(0, 316, 0, H); wg.addColorStop(0, '#24406a'); wg.addColorStop(0.5, '#173252'); wg.addColorStop(1, '#0c2038'); cc.fillStyle = wg; cc.fillRect(0, 316, W, H - 316);
      cc.fillStyle = 'rgba(255,240,200,0.12)'; for (let i = 0; i < 8; i++) cc.fillRect(64 - 30 + R() * 20, 330 + i * 14, 40 - i * 3, 2);
      for (const [x, y, rx] of [[34, 470, 30], [70, 600, 36], [330, 455, 24], [210, 560, 22], [130, 520, 18]]) { cc.fillStyle = '#2e6a4a'; cc.beginPath(); cc.ellipse(x, y, rx, rx * 0.36, 0, 0.25, Math.PI * 2 - 0.05); cc.lineTo(x, y); cc.fill(); cc.fillStyle = 'rgba(160,220,170,0.25)'; cc.beginPath(); cc.ellipse(x - rx * 0.2, y - rx * 0.08, rx * 0.5, rx * 0.12, 0, 0, 7); cc.fill(); }
      cc.strokeStyle = '#1c3a2c'; cc.lineWidth = 4; cc.lineCap = 'round'; for (const [x, h] of [[8, 120], [20, 90], [348, 130], [336, 96], [356, 70]]) { cc.beginPath(); cc.moveTo(x, H); cc.quadraticCurveTo(x + 6, H - h / 2, x - 3, H - h); cc.stroke(); cc.fillStyle = '#5a3a24'; cc.beginPath(); cc.ellipse(x - 3, H - h + 10, 4, 12, 0, 0, 7); cc.fill(); }
    }), 0, 0, 360, 640);
    // ripples and drifting fireflies
    for (let i = 0; i < 4; i++) { const k = (t * 0.35 + i / 4) % 1, x = [70, 250, 140, 310][i], y = [440, 500, 610, 560][i]; c.strokeStyle = `rgba(200,230,255,${0.25 * (1 - k)})`; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y, 8 + k * 30, (8 + k * 30) * 0.3, 0, 0, 7); c.stroke(); }
    for (let i = 0; i < 7; i++) { const x = (i * 61 + Math.sin(t * 0.6 + i) * 24 + 400) % 360, y = 150 + (i * 47) % 160 + Math.cos(t * 0.8 + i * 2) * 10, a = 0.3 + 0.5 * Math.abs(Math.sin(t * 1.7 + i)); c.fillStyle = `rgba(230,255,150,${a})`; c.beginPath(); c.arc(x, y, 2, 0, 7); c.fill(); }
    // lily pads under the answer digits
    for (const q of S.cells) { const b = M.box(g, q.id); if (!b) continue; const x = b.x + (q._gx || 0), y = AY + 12 + Math.sin(t * 1.6 + b.x * 0.05) * 1.5, k = S.padT != null ? M.ease((t - S.padT) / 0.3) : 1, rx = 27 * k;
      c.save(); c.fillStyle = 'rgba(0,10,20,0.35)'; c.beginPath(); c.ellipse(x + 2, y + 4, rx, rx * 0.34, 0, 0, 7); c.fill(); c.fillStyle = '#3f8a58'; c.beginPath(); c.ellipse(x, y, rx, rx * 0.34, 0, 0.3, Math.PI * 2 - 0.1); c.lineTo(x, y); c.fill();
      c.strokeStyle = 'rgba(190,240,190,0.35)'; c.lineWidth = 1.2; c.beginPath(); c.ellipse(x, y, rx * 0.8, rx * 0.26, 0, 3.4, 5.6); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'pr'); M.drawEx(g, c, 'ans');
    // the hop arcs with their running count
    const fadeA = S.arcFade != null ? 1 - M.clamp((t - S.arcFade) / 0.3, 0, 1) : 1;
    if (fadeA > 0) for (const a of S.arcs) { const x0 = S.gapX(a.r - 1), x1 = S.gapX(a.r), k = M.ease((t - a.t0) / 0.2), y = AY - SZ * 0.82;
      c.save(); c.globalAlpha = fadeA; c.strokeStyle = a.col; c.lineWidth = 3; c.lineCap = 'round'; c.shadowColor = a.col; c.shadowBlur = 8; c.beginPath(); c.moveTo(x0, y);
      for (let i = 1; i <= 16; i++) { const u = i / 16 * k; c.lineTo(M.lerp(x0, x1, u), y - Math.sin(u * Math.PI) * 16); } c.stroke();
      c.shadowBlur = 0; c.fillStyle = a.col; c.font = M.NUMF(23, 700); c.textAlign = 'center'; c.globalAlpha = fadeA * k; c.fillText(a.r, (x0 + x1) / 2, y - 22); c.restore(); }
    // the answer's point: a firefly while it works, then a plain point in the ink
    if (S.ap) { let x, y = AY - 5; const sk = S.settle != null ? M.ease((t - S.settle) / 0.35) : 0;
      if (S.ap.r1 != null) { const k = M.easeIO((t - S.ap.t0) / S.ap.dur); x = M.lerp(S.gapX(S.ap.r0), S.gapX(S.ap.r1), k); y -= Math.sin(k * Math.PI) * 34; } else x = S.gapX(S.ap.r0);
      const pop = S.apPop != null ? Math.sin(M.clamp((t - S.apPop) / 0.3, 0, 1) * Math.PI) * 3 : 0;
      if (sk < 1) { c.save(); c.globalAlpha = 1 - sk; FIREFLY(c, x, y, COLS[S.F.every(F => F.st === 'gone') ? 1 : 0], 5.5 + pop, t); c.restore(); }
      if (sk > 0) { c.save(); c.globalAlpha = sk; c.fillStyle = INK; c.beginPath(); c.arc(x, AY - 4, 4.6, 0, 7); c.fill(); c.restore(); } }
    // the problem's points: in the ink, lifting into fireflies, hovering, dragged, flying down, coming back at the end
    for (const F of S.F) { const col = F.col;
      if (F.st === 'in' || F.st === 'back') { const b = M.box(g, F.gap.id); if (!b) continue; c.save(); c.globalAlpha = F.st === 'back' ? M.clamp((t - F.backT) / 0.3, 0, 1) : 1; c.fillStyle = INK; c.beginPath(); c.arc(b.x + (F.gap._gx || 0), PY - 4, 4.6, 0, 7); c.fill(); c.restore(); continue; }
      let x, y;
      if (F.st === 'lift') { const k = M.easeIO((t - F.t0) / (0.35 * M.pace(g))); x = F.home.x; y = M.lerp(F.home.y, F.hov.y, k); if (k >= 1) F.st = 'hover'; }
      else if (F.st === 'hover') { const pr = Mk.press && Mk.press.dragging && Mk.press.id === 'p' + F.i ? Mk.press : null; x = pr ? pr.x : F.hov.x + Math.sin(t * 2 + F.i * 2) * 2; y = pr ? pr.y - 20 : F.hov.y + Math.sin(t * 3 + F.i) * 3; }
      else if (F.st === 'fly') { const k = M.easeIO((t - F.t0) / F.dur), tx = S.gapX(S.pk); x = M.lerp(F.from.x, tx, k); y = M.lerp(F.from.y, AY - 5, k) - Math.sin(k * Math.PI) * 40; }
      else continue;
      FIREFLY(c, x, y, col, 6, t);
    }
    // the frog on its lily pad: points at the work, hops with every hop of the point
    c.save(); c.fillStyle = '#3f8a58'; c.beginPath(); c.ellipse(FX, FY + 4, 52, 15, 0, 0.3, Math.PI * 2 - 0.1); c.lineTo(FX, FY + 4); c.fill(); c.restore();
    const hk = Mk.lastMove != null && t - Mk.lastMove < 0.32 ? Math.sin((t - Mk.lastMove) / 0.32 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hk > 0 ? 'hop' : M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'frog', FX, FY - hk * 22, 1.3, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'frog', FX, FY, 1.3);
    M.drawUI(g, c);
  },
});
