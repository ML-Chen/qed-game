// decimals_tofrac.js — TO FRACTION! Write a decimal as a fraction: count tenths or hundredths.
// A city street in the evening. A billboard on a roof reads 0.47 = ?, and the building under it has a 10 × 10 grid of
// dark windows: the whole building is 1, each floor (a row of 10 windows) is a tenth and each window is a hundredth.
//   1-2. Tap each non-zero digit after the point, in either order. The tenths digit (4) lights 4 whole floors, from the
//        ground up, each floor sweeping on left to right; the hundredths digit (7) lights 7 single windows on the next
//        floor, one after another. A counter at the right of the building keeps the running total of lit windows (47).
//        When the number stops at tenths (0.3), the counter counts floors instead (3).
//   3.   Tap the ? on the billboard: a fraction bar draws itself, the counter flies up into the top (47), then the floors
//        are counted down the side of the building (10, 20, ... 100, or 1, 2, ... 10 floors) and that total flies under
//        the bar: 0.47 = 47/100.
//   4.   (level 2) Tap the fraction to simplify it: "÷ 5" writes itself beside the top and the bottom and both roll over:
//        35/100 = 7/20.
// Level 0: 0.47 style (two non-zero hundredths digits). Level 1: 0.3 or 0.07. Level 2: 0.35 style, then simplify.
// Medium mode: the tray asks for the bottom number (100, not 10), and at level 2 for the simplified fraction.
// Tapping the ones 0 or a 0 after the point is a slip (it lights nothing): it wobbles.
const M = MK, INK = '#2a1a3a', GX0 = 68, GY0 = 302, CW = 22.4, CH = 22.2, EY = 238, CX = 318, HX = 322, HY = 604;
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function pick(g) {
  const r = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), L = g.level;
  for (let i = 0; i < 300; i++) {
    if (L === 0) { const n = r(11, 69); if (n % 10 && n % 2 && n % 5) return { d: [Math.floor(n / 10), n % 10] }; }
    else if (L === 1) { const x = [1, 3, 7, 9][r(0, 3)]; return g.rand() < 0.5 ? { d: [x] } : { d: [0, x] }; }
    else { const n = r(11, 99); if (n % 10 && gcd(n, 100) > 1 && Math.floor(n / 10)) return { d: [Math.floor(n / 10), n % 10] }; }
  }
  return { d: [4, 7] };
}

MG.add({
  id: 'decimals_tofrac', stage: 'decimals', cmd: 'TO FRACTION!', hint: 'tap', time: 10, mood: 'night', winText: 'Lit up!', hold: 1.7,
  card: {
    title: 'Decimals as fractions', ref: 'Grade 4', kind: 'Decimals',
    text: 'The digits after a decimal point count tenths, hundredths, and so on. Think of a building with 100 windows: each floor of 10 windows is one tenth, and each single window is one hundredth.\n\n0.47 means 4 tenths and 7 hundredths. That is 4 full floors (40 windows) and 7 more windows, so 47 of the 100 windows are lit: 0.47 = 47/100.\n\nThe last digit tells you the bottom number. If it is in the tenths place, the bottom is 10 (0.3 = 3/10). If it is in the hundredths place, the bottom is 100 (0.07 = 7/100). Then you can simplify: 0.35 = 35/100 = 7/20.',
    note: 'Read the digits after the point as a whole number on top, and put 10 or 100 underneath, depending on the place of the last digit.',
    ask: 'Write 0.9 as a fraction. Write 0.23 as a fraction. Write 0.25 in simplest form.',
  },
  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g); const { d } = pick(g); S.d = d; S.hund = d.length === 2;
    S.n = S.hund ? d[0] * 10 + d[1] : d[0]; S.den = S.hund ? 100 : 10; S.gc = g.level === 2 ? gcd(S.n, S.den) : 1;
    S.dg = d.map((v, j) => M.num(v, 'dg' + j)); S.slot = M.slot('sl', { col: '#8a6a9a' });
    S.u0 = M.num(0, 'u0'); S.pt = M.txt('.', 'pt'); S.eq = M.op('=', 'eq'); S.lit = []; for (let r = 0; r < 10; r++) S.lit.push(Array(10).fill(null)); S.total = 0;
    const relay = () => { S.row = M.row(S.u0, S.pt, ...S.dg, S.eq, S.rhs || S.slot); M.place(g, 'ex', S.row, S.simp ? 146 : 180, EY, 52, { col: INK }); };
    S.relay = relay; relay(); M.inert(g, ['pt', 'eq', 'cnt', 'fn', 'fd']);
    g.dur *= (2.6 + 1.05 * (2 + (S.gc > 1 ? 1 : 0))) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    // the counter at the right of the building: windows lit (or floors, when the number stops at tenths)
    S.cnt = M.num(0, 'cnt'); S.cntY = GY0 + 10 * CH - CH / 2;
    const bump = (g, v, row) => { const first = !M.box(g, 'cnt'); if (row != null) S.cntY = GY0 + row * CH + CH / 2;
      if (first) { S.cnt.v = String(v); S.cnt._born = -1; S.cnt.pop = g.t; } else M.roll(g, S.cnt, v, { dur: 0.12 * T }); M.place(g, 'cnt', M.row(S.cnt), CX, S.cntY + 8, 24, { col: '#fff1b0' }); };
    const floorsLit = () => S.d[0] && S.done0 ? S.d[0] : 0;
    M.play(g, {
      moves(g) {
        const out = [];
        S.d.forEach((v, j) => { if (!v || S['done' + j]) return;
          out.push({ tap: 'dg' + j, busy: 0.1,
            then(g) { S['done' + j] = true; M.inert(g, ['dg' + j]); S.point = true; hop(g, 'think'); g.sfx('tap');
              M.circle(g, 'dg' + j, { dur: 0.45 * T, col: '#ffd25a' }); M.light(g, 'dg' + j, { col: '#ffd25a' });
              if (j === 0) { // tenths: whole floors from the ground up
                const st = Math.min(0.16 * T, 0.9 * T / v), list = [];
                for (let k = 0; k < v; k++) { const r = 9 - k; list.push([0.15 * T + k * st, g => { for (let c = 0; c < 10; c++) S.lit[r][c] = g.t + c * 0.012 * T; S.total += S.hund ? 10 : 1; bump(g, S.total, r); g.sfx('pop'); }]); }
                list.push([0.15 * T + v * st + 0.1 * T, g => { M.unlight(g, 'dg' + j); S.point = false; hop(g, 'wow'); g.sfx('ding'); }]);
                M.at(g, list); M.show(g, 0.3 * T + v * st); }
              else { // hundredths: single windows on the floor above the lit floors (the floor is chosen now; the tenths keep the floors below)
                const r = 9 - S.d[0], st = Math.min(0.1 * T, 0.8 * T / v), list = [];
                for (let k = 0; k < v; k++) list.push([0.15 * T + k * st, g => { S.lit[r][k] = g.t; S.total += 1; bump(g, S.total, r); g.sfx('tap'); }]);
                list.push([0.15 * T + v * st + 0.1 * T, g => { M.unlight(g, 'dg' + j); S.point = false; hop(g, 'wow'); g.sfx('ding'); }]);
                M.at(g, list); M.show(g, 0.3 * T + v * st); } } }); });
        if (out.length) return out;
        // write the fraction
        if (!S.rhs) return [{ tap: 'sl', busy: 0.1, askAt: 0.5 * T, after: 0.95 * T, ask: { v: S.den, wrong: [S.hund ? 10 : 100, 1000, S.n] },
          then(g) { S.point = true; hop(g, 'think'); M.show(g, 0.5 * T);
            S.fn = M.num(S.n, 'fn', { alpha: 0 }); S.fd = M.num(S.den, 'fd', { alpha: 0 }); S.rhs = M.frac(S.fn, S.fd, 'fr', { bar: { t0: g.t, dur: 0.3 * T } }); S.relay(); g.sfx('swoosh');
            M.at(g, [[0.12 * T, g => { const b = M.box(g, 'cnt'); S.cntGone = true; M.indicate(g, S.cnt, { dur: 0.2 * T });
              M.fly(g, { node: M.num(S.n, null, { col: '#fff1b0' }), from: b ? [b.x, b.y] : [CX, S.cntY], to: 'fn', dur: 0.32 * T, arc: 60, s0: 24, s1: M.box(g, 'fn').s,
                then(g) { S.fn.alpha = 1; S.fn.pop = g.t; M.sparkle(g, 'fn', { n: 8 }); g.sfx('pop'); } }); delete g.s.mk.ex.cnt; }]]); },
          resolve(g) { M.show(g, 0.95 * T); const st = 0.05 * T;
            // the floors are counted down the side of the building: 10, 20, ..., 100 windows (or 1, 2, ..., 10 floors)
            S.tick = { t0: g.t, st, unit: S.hund ? 10 : 1 }; for (let k = 0; k < 10; k++) M.at(g, [[k * st, g => g.sfx('tap')]]);
            M.at(g, [[10 * st + 0.05 * T, g => { S.bldGlow = g.t;
                M.fly(g, { node: M.num(S.den, null, { col: '#fff1b0' }), from: [GX0 - 30, GY0 + 0.5 * CH], to: 'fd', dur: 0.32 * T, arc: 70, s0: 18, s1: M.box(g, 'fd').s,
                  then(g) { S.fd.alpha = 1; S.fd.pop = g.t; M.sparkle(g, 'fr', { n: 12, cols: ['#fff1b0', '#fff', '#ffb0d8'] }); g.sfx('ding'); hop(g, 'laugh'); if (S.gc === 1) S.point = false; } }); }],
              [0.95 * T, g => { S.tick.fade = g.t; }]]); } }];
        if (S.gc > 1 && !S.simp) { const a = S.n / S.gc, b = S.den / S.gc;
          return [{ tap: ['fr', 'fn', 'fd'], busy: 0.1, askAt: 0.55 * T, after: 0.7 * T, ask: { v: M.frac(M.num(a), M.num(b)), wrong: [M.frac(M.num(a), M.num(S.den)), M.frac(M.num(S.n), M.num(b)), M.frac(M.num(S.n - S.gc), M.num(S.den - S.gc))] },
            then(g) { S.simp = true; S.relay(); M.show(g, 0.55 * T); S.point = true; hop(g, 'think'); M.circle(g, 'fr', { dur: 0.45 * T, col: '#ffd25a' });
              for (const id of ['fn', 'fd']) M.note(g, { node: M.row(M.op('÷'), M.num(S.gc)), at: id, off: [M.box(g, 'fr').w / 2 + 16, 0], s: 24, col: '#d0306a', delay: 0.18 * T + (id === 'fd' ? 0.12 * T : 0), write: 0.25 * T, hold: 0.6 * T, fade: 0.2 * T }); },
            resolve(g) { M.show(g, 0.7 * T); M.roll(g, S.fn, a, { dur: 0.3 * T }); M.roll(g, S.fd, b, { delay: 0.08 * T, dur: 0.3 * T }); g.sfx('swoosh');
              M.at(g, [[0.4 * T, g => { S.relay(); M.indicate(g, 'fr', { dur: 0.35 * T, col: '#ffd25a', sc: 1.15 }); M.sparkle(g, 'fr', { n: 12 }); g.sfx('coin'); hop(g, 'laugh'); S.point = false; }]]); } }];
        }
        return [];
      },
      area(g) { const ds = S.d.map((v, j) => v && !S['done' + j] ? 'dg' + j : null).filter(Boolean); return ds.length ? ds : !S.rhs ? 'sl' : 'fr'; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, Mk = S.mk;
    c.drawImage(g.bake('dtof_city', (cc, W, H) => {
      const sk = cc.createLinearGradient(0, 0, 0, 560); sk.addColorStop(0, '#1e1a4a'); sk.addColorStop(0.5, '#5a3a7a'); sk.addColorStop(0.85, '#e0807a'); sk.addColorStop(1, '#f6b080'); cc.fillStyle = sk; cc.fillRect(0, 0, W, H);
      const R = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(63);
      for (let i = 0; i < 60; i++) { cc.fillStyle = `rgba(255,250,230,${0.3 + R() * 0.5})`; cc.beginPath(); cc.arc(R() * W, R() * 200, R() * 1.2 + 0.3, 0, 7); cc.fill(); }
      cc.fillStyle = '#fff2d0'; cc.beginPath(); cc.arc(300, 150, 16, 0, 7); cc.fill(); cc.fillStyle = '#2a2258'; cc.beginPath(); cc.arc(292, 145, 15, 0, 7); cc.fill();
      // far skyline with a few lit windows
      for (let i = 0; i < 12; i++) { const x = i * 32 - 8, h = 160 + R() * 180; cc.fillStyle = i % 2 ? '#3a2a5a' : '#46325e'; cc.fillRect(x, 560 - h, 30, h); for (let y = 570 - h; y < 540; y += 14) for (let k = 0; k < 3; k++) if (R() < 0.18) { cc.fillStyle = 'rgba(255,210,130,0.6)'; cc.fillRect(x + 4 + k * 8, y, 5, 7); } }
      // the building: brick facade, a cornice, the roof with the billboard's poles
      cc.fillStyle = 'rgba(10,5,20,0.4)'; cc.fillRect(GX0 - 22, 284, 10 * CW + 48, 300);
      const bg = cc.createLinearGradient(0, 284, 0, 560); bg.addColorStop(0, '#8a4a4a'); bg.addColorStop(1, '#6a3438'); cc.fillStyle = bg; cc.fillRect(GX0 - 18, 286, 10 * CW + 36, 300);
      cc.fillStyle = 'rgba(40,10,10,0.18)'; for (let y = 290; y < 560; y += 7) for (let x = GX0 - 18 + ((y / 7) % 2) * 8; x < GX0 + 10 * CW + 18; x += 16) cc.fillRect(x, y, 14, 1);
      cc.fillStyle = '#b8a090'; cc.fillRect(GX0 - 24, 280, 10 * CW + 48, 8);
      cc.fillStyle = '#3a2a2a'; for (const x of [96, 264]) cc.fillRect(x - 3, 272, 6, 12);
      // the billboard
      cc.fillStyle = 'rgba(10,5,20,0.4)'; cc.beginPath(); cc.roundRect(26, 182, 316, 108, 12); cc.fill();
      cc.fillStyle = '#fff4e0'; cc.beginPath(); cc.roundRect(22, 176, 316, 106, 12); cc.fill(); cc.strokeStyle = '#e8a050'; cc.lineWidth = 4; cc.stroke();
      // the street
      cc.fillStyle = '#2a2436'; cc.fillRect(0, 556, W, 84); cc.fillStyle = '#4a4058'; cc.fillRect(0, 548, W, 10);
      cc.fillStyle = 'rgba(255,240,200,0.5)'; for (let x = 10; x < W; x += 50) cc.fillRect(x, 604, 26, 4);
    }), 0, 0, 360, 640);
    // the billboard's bulbs twinkle
    for (let k = 0; k < 14; k++) { const x = 30 + k * 23, a = 0.5 + 0.5 * Math.sin(t * 4 + k * 1.3); c.fillStyle = `rgba(255,220,120,${0.4 + 0.6 * a})`; c.beginPath(); c.arc(x, 176, 2.5, 0, 7); c.fill(); }
    // the windows: dark, or lit in a warm glow; the floors of the tenths are counted down the side at the end
    const glow = S.bldGlow != null ? Math.max(0, 1 - (t - S.bldGlow) / 0.6) : 0;
    for (let r = 0; r < 10; r++) for (let k = 0; k < 10; k++) { const x = GX0 + k * CW + 3, y = GY0 + r * CH + 3, w = CW - 6, h = CH - 7, L = S.lit[r][k];
      const e = L != null ? M.clamp((t - L) / 0.12, 0, 1) : 0;
      c.fillStyle = M.mix('#26304e', '#ffd88a', e); c.fillRect(x, y, w, h);
      if (e > 0) { c.save(); c.globalAlpha = e * (0.35 + 0.65 * Math.max(0, 1 - (t - L) / 0.4)); c.shadowColor = '#ffcc66'; c.shadowBlur = 12; c.fillStyle = '#fff2c0'; c.fillRect(x + 2, y + 2, w - 4, h - 4); c.restore(); c.fillStyle = 'rgba(200,120,60,0.45)'; c.fillRect(x + w / 2 - 0.75, y, 1.5, h); }
      else { c.fillStyle = 'rgba(160,190,255,0.12)'; c.fillRect(x + 1, y + 1, w * 0.4, 2); }
      if (glow > 0) { c.strokeStyle = `rgba(255,240,180,${glow})`; c.lineWidth = 1.5; c.strokeRect(x - 1, y - 1, w + 2, h + 2); } }
    if (S.tick) { const fa = S.tick.fade != null ? Math.max(0, 1 - (t - S.tick.fade) / 0.3) : 1;
      for (let k = 0; k < 10; k++) { const e = M.clamp((t - S.tick.t0 - k * S.tick.st) / 0.1, 0, 1); if (e <= 0) continue; const r = 9 - k, y = GY0 + r * CH + CH / 2;
        c.save(); c.globalAlpha = fa * e * (k === 9 ? 1 : 0.55 + 0.45 * Math.max(0, 1 - (t - S.tick.t0 - k * S.tick.st) / 0.3)); c.fillStyle = '#fff1b0'; c.font = M.NUMF(18, 700); c.textAlign = 'right'; c.shadowColor = 'rgba(0,0,0,0.7)'; c.shadowBlur = 4; c.fillText((k + 1) * S.tick.unit, GX0 - 21, y + 5); c.restore();
        c.save(); c.globalAlpha = fa * e * 0.5; c.strokeStyle = '#fff1b0'; c.lineWidth = 2; c.beginPath(); c.moveTo(GX0 - 17, y); c.lineTo(GX0 - 4, y); c.stroke(); c.restore(); } }
    M.drawEx(g, c, 'cnt');
    M.drawEx(g, c, 'ex');
    // the decimal point is a dot, drawn bigger than the font's
    // cars pass on the street
    for (let i = 0; i < 2; i++) { const dirn = i ? -1 : 1, x = dirn > 0 ? ((t * 60 + i * 200) % 520) - 80 : 440 - ((t * 45 + 130) % 520), y = i ? 592 : 622, col = i ? '#5aa0d8' : '#e8604a';
      c.save(); c.translate(x, y); c.scale(dirn, 1); c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(-26, 6, 52, 5); c.fillStyle = col; c.beginPath(); c.roundRect(-26, -8, 52, 14, 5); c.fill(); c.beginPath(); c.roundRect(-14, -18, 26, 12, 5); c.fill();
      c.fillStyle = '#bfe0ff'; c.fillRect(-10, -15, 9, 7); c.fillRect(2, -15, 8, 7); c.fillStyle = '#222'; for (const wx of [-15, 15]) { c.beginPath(); c.arc(wx, 6, 5, 0, 7); c.fill(); }
      c.fillStyle = 'rgba(255,240,170,0.35)'; c.beginPath(); c.moveTo(26, -2); c.lineTo(70, -10); c.lineTo(70, 8); c.closePath(); c.fill(); c.restore(); }
    // the hedgehog on the pavement points up at the building and hops as lights go on
    const hk = Mk.lastMove != null && t - Mk.lastMove < 0.35 ? Math.sin((t - Mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'hedgehog', HX, HY - hk * 18, 1.05, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'hedgehog', HX, HY, 1.05);
    M.drawUI(g, c);
  },
});
