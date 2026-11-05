// ratios_change.js — PERCENT CHANGE! "40 → 50": how much did it grow, compared with where it started? Every step is
// acted out (show your work), on a desert sign with two planks under it (the old and the new amount):
//   1. Drag the new value onto the old one: both glide up into "50 − 40", a fraction bar draws itself under them and a
//      copy of the old value drops beneath it (the change over the old value); the change lights up on the planks.
//   2. Tap the fraction: 50 and 40 light up, the "− 40" slides into the 50 and it rolls over to 10 (the change pulses
//      on the planks). Then "÷ 10" writes itself beside the top and the bottom, flies in, and 10/40 rolls to 1/4; the old
//      plank is marked off in quarters, and the change is exactly one of them.
//   3. Tap 1/4: "× 25" writes itself beside the top and the bottom and 1/4 rolls to 25/100; the "/100" folds into a "%"
//      and the word "increase" writes itself: 25% increase.
// The beaver points while the work is shown and hops on every landing.
// Level 0: increases by 1/2, 1/4, 1/5 or 1/10. Level 1: more fractions (3/4, 2/5, 3/5, 3/10). Level 2: decreases too.
// Medium mode: the simplified fraction and the percent are picked from the tray (wrong tiles: dividing by the new
// value, the flipped fraction, the wrong sign).
const M = MK, INK = SCN.ink('sign'), NEWC = '#ffd970';
const FR = [[1, 2], [1, 4], [1, 5], [1, 10], [3, 4], [2, 5], [3, 5], [3, 10]];
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), fs = L === 0 ? FR.slice(0, 4) : FR, [fn, fd] = fs[r(fs.length)];
  const ms = []; for (let m = 2; fd * m <= 80; m++) if (fd * m >= 10) ms.push(m);
  const m = ms[r(ms.length)], old = fd * m, ch = fn * m, dec = L === 2 && g.rand() < 0.5;
  return { old, nw: dec ? old - ch : old + ch, fn: dec ? -fn : fn, fd, pct: fn * 100 / fd, dec };
}
const F = (n, d) => M.frac(M.num(n), M.num(d));
const HX = 290, HY = 600, EXY = 262, FRY = 254;
function host(g, c, kind, x, y, s) {
  const S = g.s, K = S.mk, hop = K.lastMove != null && g.t - K.lastMove < 0.35 ? Math.sin((g.t - K.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hop > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hop * 24, s, { t: g.t, pose, expr, facing: -1 }); else SCN.host(g, c, kind, x, y, s);
}
// the old and the new amount as two planks; the change is the part that sticks out (or is missing). Once the fraction
// is simplified, both planks are marked off in pieces of old ÷ (bottom of the fraction), drawn one after another.
function drawBars(g, c, S) {
  const t = g.t, sc = 230 / Math.max(S.old, S.nw), x0 = 70, k = S.chgAt != null ? M.ease((t - S.chgAt) / 0.35) : 0;
  const bar = (y, v, col, lab) => { c.fillStyle = 'rgba(30,15,5,0.35)'; c.fillRect(x0 + 2, y + 3, v * sc, 16); c.fillStyle = col; c.fillRect(x0, y, v * sc, 16);
    c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(x0, y + 2, v * sc, 3); c.font = M.NUMF(16); c.textAlign = 'right'; c.fillStyle = lab; c.fillText(String(v), x0 - 8, y + 14); };
  bar(318, S.old, '#e8d0a0', INK); bar(346, S.nw, '#f0c060', NEWC);
  if (k > 0) {
    const a = x0 + Math.min(S.old, S.nw) * sc, b = x0 + Math.max(S.old, S.nw) * sc, y = 346, pk = S.pulseAt != null && t - S.pulseAt < 0.6 ? Math.sin((t - S.pulseAt) / 0.6 * Math.PI) : 0;
    c.save(); c.globalAlpha = k; c.strokeStyle = S.dec ? '#ff9a8a' : '#9af07a'; c.lineWidth = 3 + pk * 2; c.setLineDash(S.dec ? [5, 4] : []);
    if (pk) { c.shadowColor = S.dec ? '#ff9a8a' : '#9af07a'; c.shadowBlur = 16 * pk; }
    const wk = a + (b - a) * k; c.strokeRect(a, y - 2, wk - a, 20); c.fillStyle = S.dec ? `rgba(255,120,100,${0.25 + pk * 0.3})` : `rgba(150,240,120,${0.45 + pk * 0.3})`; c.fillRect(a, y, wk - a, 16);
    c.setLineDash([]); c.shadowBlur = 0; c.lineWidth = 2; c.strokeStyle = 'rgba(255,244,220,0.5)'; c.beginPath(); c.moveTo(x0 + S.old * sc, 312); c.lineTo(x0 + S.old * sc, 368); c.stroke(); c.restore();
  }
  if (S.tickAt != null) { // the pieces: one piece = old ÷ bottom
    const u = S.old / S.fd, n = Math.round(Math.max(S.old, S.nw) / u);
    for (let j = 1; j < n; j++) { const kk = M.clamp((t - S.tickAt - j * S.tickGap) / 0.15, 0, 1); if (kk <= 0) continue; const xx = x0 + j * u * sc;
      c.save(); c.strokeStyle = '#5a2a10'; c.lineWidth = 2.4; c.globalAlpha = kk; c.beginPath();
      if (j * u <= S.old + 1e-9) { c.moveTo(xx, 318 - 3 + 22 * (1 - kk)); c.lineTo(xx, 318 + 19); }
      if (j * u <= S.nw + 1e-9) { c.moveTo(xx, 346 - 3); c.lineTo(xx, 346 - 3 + 22 * kk); }
      c.stroke(); c.restore(); }
  }
}

MG.add({
  id: 'ratios_change', stage: 'ratios', cmd: 'PERCENT CHANGE!', hint: 'drag', time: 9, mood: 'bright', winText: 'Changed!', hold: 1.4,
  card: {
    title: 'Percent change', ref: 'Grade 7', kind: 'Ratios and percents',
    text: 'A percent change tells you how much an amount grew or shrank, compared with where it started.\n\nFirst find the change: the new value minus the old value. Then divide the change by the old value and write the answer as a percent. For example, going from 40 to 50 is a change of 50 − 40 = 10. Then 10/40 = 1/4, and 1/4 is 25%, so it is a 25% increase.\n\nIf the new value is smaller, the change is negative and the answer is a decrease. Going from 50 to 40 gives (40 − 50)/50 = −1/5, a 20% decrease. You always divide by the old value, because the change is measured against the starting amount.',
    note: 'Percent change = (new − old) ÷ old, written as a percent. A positive answer is an increase and a negative answer is a decrease.',
    ask: 'A price goes from $20 to $25. What is the percent change? What is the percent change from 80 to 60?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.st = 0; const T = M.pace(g);
    const ch = S.nw - S.old, m = Math.abs(ch) / Math.abs(S.fn), kx = 100 / S.fd, gn = gcd(Math.abs(ch), S.nw); S.ch = ch;
    // the same number nodes are kept all the way, so they glide and roll instead of popping
    S.oN = M.num(S.old, 'o'); S.nN = M.num(S.nw, 'nw', { col: NEWC }); S.ex = M.row(S.oN, M.op('→', 'ar'), S.nN);
    const relay = (y = EXY, s = 56) => M.place(g, 'ex', S.ex, 180, y, s, { col: INK }); S.relay = relay; S.mk.relay = () => relay(S.ry, S.rs); relay();
    const lay = (y, s) => { S.ry = y; S.rs = s; relay(y, s); };
    M.inert(g, ['ar', 'word', 'tn', 'to', 'mn', 'den', 'pc']);
    const hop = (g, e) => { g.s.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    const burst = id => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, ['#ffd970', '#fff', '#9ae07a'], 12, 130); };
    const side = (txt, n, at, then, o = {}) => M.note(g, { node: M.row(M.op(txt), M.num(n)), at, off: [o.dx ?? 74, 0], s: 26, col: '#ffe9a0', delay: o.delay, write: 0.28 * T, hold: 0.12 * T, fly: 0.24 * T, to: at, s1: 30, arc: 16, then });
    g.dur *= (2.6 + 1.05 * 3) / 8;
    M.play(g, {
      moves(g) {
        // 1. drag the new value onto the old one: (new − old) / old
        if (S.st === 0) return [{ drag: 'nw', to: 'o', busy: 0.1,
          then(g) { S.st = 1; M.show(g, 1.15 * T); S.point = true; hop(g, 'wow'); g.sfx('whoosh');
            S.nN.id = 'tn'; S.oN.id = 'to'; S.mn = M.op('-', 'mn', { col: INK }); S.den = M.num(S.old, 'den', { alpha: 0 });
            S.top = M.row(S.nN, S.mn, S.oN); S.ex = M.frac(S.top, S.den, 'q', { bar: { t0: g.t + 0.25 * T, dur: 0.3 * T } }); lay(FRY, 50);
            M.at(g, [[0.5 * T, g => { const b = M.box(g, 'to'); M.fly(g, { node: M.num(S.old), col: INK, from: [b.x, b.y], to: 'den', dur: 0.4 * T, arc: 40, s0: 41, s1: 41,
                then(g) { S.den.alpha = 1; S.den.pop = g.t; M.sparkle(g, 'den', { n: 6 }); g.sfx('pop'); hop(g); } }); }],
              [0.75 * T, g => { S.chgAt = g.t; }]]); } }];
        // 2. tap the fraction: subtract on top, then simplify
        if (S.st === 1) return [{ tap: 'q', busy: 0.1, askAt: 0.95 * T, after: 1.25 * T, ask: { v: F(S.fn, S.fd), wrong: [F(ch / gn, S.nw / gn), F(S.fd * Math.sign(S.fn), Math.abs(S.fn)), F(-S.fn, S.fd)] },
          then(g) { S.st = 2; M.show(g, 0.95 * T); S.point = true; hop(g, 'think');
            M.circle(g, 'q', { dur: 0.5 * T }); M.light(g, S.nN); M.light(g, S.oN);
            M.at(g, [[0.35 * T, g => { const b = M.box(g, 'tn'); for (const q of [S.mn, S.oN]) { const bq = M.box(g, q.id); M.tween(g, q, { dx: b.x - bq.x, alpha: 0, sc: 0.5 }, 0.28 * T); }
                M.roll(g, S.nN, ch, { delay: 0.12 * T, dur: 0.32 * T }); S.pulseAt = g.t + 0.2 * T; g.sfx('swoosh'); }],
              [0.75 * T, g => { S.mn.alpha = 0; S.oN.alpha = 0; S.top.items = [S.nN]; M.unlight(g, S.nN); lay(FRY, 50); M.sparkle(g, 'tn', { n: 8 }); g.sfx('ding'); hop(g); }]]); },
          resolve(g) { M.show(g, 1.25 * T); S.point = true;
            side('÷', m, 'tn', g => { M.roll(g, S.nN, S.fn, { dur: 0.3 * T }); M.indicate(g, S.nN, { dur: 0.3 * T }); g.sfx('tap'); });
            side('÷', m, 'den', g => { M.roll(g, S.den, S.fd, { dur: 0.3 * T }); M.indicate(g, S.den, { dur: 0.3 * T }); g.sfx('tap'); hop(g); }, { delay: 0.06 * T });
            M.at(g, [[0.72 * T, g => { S.ex.id = 'f'; lay(FRY, 50); S.tickAt = g.t; S.tickGap = Math.min(0.07, 0.45 / (S.fd + Math.abs(S.fn))) * T; g.sfx('coin'); burst('f'); }]]); } }];
        // 3. tap the simplified fraction: write it over 100, and that is the percent
        if (S.st === 2) return [{ tap: 'f', busy: 0.1, askAt: 0.4 * T, after: 1.45 * T, ask: { v: M.num(S.pct + '%'), wrong: [M.num(Math.round(Math.abs(ch) * 100 / S.nw) + '%'), M.num(100 - S.pct + '%'), M.num(Math.abs(ch) + '%')] },
          then(g) { S.st = 3; M.show(g, 0.4 * T); S.point = true; hop(g, 'think'); M.circle(g, 'f', { dur: 0.4 * T }); },
          resolve(g) { M.show(g, 1.45 * T);
            if (kx !== 1) { side('×', kx, 'tn', g => { M.roll(g, S.nN, S.fn * kx, { dur: 0.3 * T }); g.sfx('tap'); }, { dx: 80 });
              side('×', kx, 'den', g => { M.roll(g, S.den, 100, { dur: 0.3 * T }); g.sfx('tap'); hop(g); lay(FRY, 50); }, { delay: 0.06 * T, dx: 80 }); }
            M.at(g, [[0.75 * T, g => { lay(FRY, 50); M.indicate(g, S.den, { dur: 0.35 * T, col: '#ffe9a0' }); M.circle(g, 'den', { dur: 0.35 * T, col: '#ffe9a0' }); M.tween(g, S.den, { alpha: 0, sc: 0.6, dy: -14 }, 0.2 * T, { delay: 0.1 * T }); }],
              [1.05 * T, g => { // "out of 100" folds into a % sign; a minus sign turns into the word "decrease"
                S.den.alpha = 0; S.pc = M.txt('%', 'pc', { col: NEWC, pop: g.t }); S.word = M.txt(S.dec ? ' decrease' : ' increase', 'word');
                S.nN.id = 'res'; S.nN.col = NEWC; S.ex = M.row(S.nN, S.pc, S.word); lay(EXY, 40); if (S.dec) M.roll(g, S.nN, S.pct, { dur: 0.25 * T });
                M.writeIn(g, S.word, { dur: 0.32 * T, delay: 0.05 * T }); M.sparkle(g, 'res'); g.sfx('sparkle'); hop(g, 'laugh'); }],
              [1.4 * T, g => { S.point = false; burst('res'); }]]); } }];
        return [];
      },
      area(g) { return S.st === 0 ? ['nw', 'o'] : S.st === 1 ? ['q'] : ['f']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s;
    SCN.std(g, c, { scene: 'desert', panel: 'sign', panelY: 290, panelH: 200 });
    host(g, c, 'beaver', HX, HY, 1.4); drawBars(g, c, S); M.drawEx(g, c, 'ex'); M.drawUI(g, c);
  },
});
