// modular_mod.js — MODULO! Find a mod n by walking a clock hand a steps around an n-hour clock.
// A moonlit clock with n hours, 0 at the top. The player spins the hand clockwise (anywhere on the dial works) and lets
// go; the hand then walks on by itself, one tick per hour (show your work). Every time it passes 0 a full turn is done:
// 0 flashes, a ring of light is added round the dial, and a "17 − 5 = 12" note writes itself under "17 mod 5" and stays
// while the 17 rolls down to 12 (then 7, then 2). The hand stops after a steps, on the remainder; "17 = 3 × 5 + ?" writes itself under
// the clock, and the hour the hand points at lifts off the dial and flies up into "= ?". A drag backwards walks it back.
// Level 0: n = 4 or 5, two turns and a bit. Level 1: n = 5 or 6, two or three turns. Level 2: n = 6 or 7.
// Medium mode: when the hand stops, the player picks the remainder from the tray.
// Wrong parts: the numbers of the problem (a tap on them wobbles).
const M = MK, CX = 180, CY = 368, R = 100, INK = '#fff4dc', GOLD = '#ffd45a', PY = 218;
// MK.slot strokes its dashed box without beginPath, so it would also dash the symbol drawn just before it (=, ×, +).
// An empty op starts a fresh path; the gap takes its width back.
const clr = s => [M.op('', null), M.gap(-0.44 * s)];
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), n = [[4, 5], [5, 6], [6, 7]][L][r(2)];
  const turns = L === 0 ? 2 : 2 + r(2), rem = 1 + r(n - 1);
  return { n, a: n * turns + rem, rem, turns };
}
const ang = (S, u) => u * 2 * Math.PI / S.n - Math.PI / 2;
const pt = (S, u, r) => ({ x: CX + Math.cos(ang(S, u)) * r, y: CY + Math.sin(ang(S, u)) * r });
const ptrU = (S, x, y) => ((Math.atan2(y - CY, x - CX) + Math.PI / 2) / (2 * Math.PI) * S.n + S.n) % S.n;
function placeProb(g) { const S = g.s; M.place(g, 'prob', S.prob, 180, PY, 46, { col: INK }); const h = pt(S, S.cont, R - 52); M.zone(g, 'hand', { x: h.x, y: h.y, w: 34, h: 34 }); }
// the hand has walked k hours: every full turn takes n away from the number in the problem (a "− 5" note writes itself
// beside it and flies in, and the number rolls down: 17 → 12 → 7 → 2), and a ring of light is added round the dial
function setSteps(g, k) {
  const S = g.s, T = M.pace(g); if (k === S.steps) return;
  const before = Math.floor(S.steps / S.n), after = Math.floor(k / S.n); S.steps = k; g.sfx('tap', { p: 1 + (k % S.n) * 0.04 });
  if (after !== before) {
    S.shown = S.a - S.n * after; const nd = M.node(g, 'a'), v = S.shown;
    if (after > before) { S.turnAt = g.t; S.wrapAt = g.t; g.sfx('coin'); S.mk.lastMove = g.t;
      // the reason is written out beside the number ("13 − 5 = 8"), and the number rolls down while it is still there
      const prev = S.a - S.n * before;
      M.note(g, { node: M.row(M.num(prev), M.op('−'), M.num(S.n), M.op('='), M.num(v)), at: 'a', off: [0, 48], s: 26, col: GOLD, pill: true, write: 0.3 * T, hold: 0.85 * T, fade: 0.25 * T });
      M.at(g, [[0.4 * T, g => { M.indicate(g, nd, { dur: 0.3 * T, col: GOLD }); M.roll(g, nd, S.shown, { dur: 0.3 * T }); placeProb(g); M.sparkle(g, 'a', { n: 6, cols: [GOLD, '#fff'] }); }]]); }
    else { M.roll(g, nd, v, { dur: 0.16 }); placeProb(g); }
  }
  if (k === S.a) land(g);
}
// once spun, the hand walks on by itself, one hour per tick, pausing a moment at every full turn
const ST = 0.1, PT = 1.4; // PT: the pause at 0 while "13 − 5 = 8" is written and read
function walkTime(S, from) { let t = 0; for (let k = from + 1; k <= S.a; k++) t += ST + (k % S.n === 0 ? PT : 0); return t; }
function startWalk(g) { const S = g.s, T = M.pace(g); S.walk = { next: g.t + 0.05 * T }; M.show(g, walkTime(S, S.steps) * T + 0.2 * T); }
function land(g) {
  const S = g.s, K = S.mk, T = M.pace(g); S.landed = true; S.drag = null; S.walk = null; S.cont = S.a; S.landAt = g.t; K.lastMove = g.t; g.sfx('ding');
  const p = pt(S, S.a, R - 26); g.burst(p.x, p.y, [GOLD, '#fff', '#a8c8ff'], 14, 140); S.point = true;
  // the working: 17 = 3 × 5 + ? writes itself under the clock (the key steps aside for it)
  S.nslot = M.slot('nr', { w: 26, col: GOLD });
  S.note = M.row(M.num(S.a), M.op('='), M.num(S.turns, null, { col: '#c8d0ff' }), M.op('×'), M.num(S.n), M.op('+'), clr(26), S.nslot); S.note.id = 'note';
  M.tween(g, S.key, { alpha: 0 }, 0.2 * T); M.place(g, 'note', S.note, 180, 518, 26, { col: INK }); M.writeIn(g, S.note, { dur: 0.4 * T, delay: 0.1 * T }); M.inert(g, ['note']);
  M.indicate(g, 'a', { delay: 0.1 * T, dur: 0.35 * T, col: GOLD });
  const askAt = 0.6 * T; M.show(g, askAt);
  const fill = g => { M.show(g, 1.1 * T); const rn = M.num(S.rem, 'nrv', { col: GOLD }); S.nslot.fill = rn; M.place(g, 'note', S.note, 180, 518, 26, { col: INK }); M.writeIn(g, rn, { dur: 0.16 * T }); g.sfx('coin');
    // the remainder lifts off the dial, flies up into the "?", and the number rolls back to the problem's
    const h = pt(S, S.a, R - 26);
    M.fly(g, { node: M.num(S.rem, null, { col: GOLD }), from: [h.x, h.y], to: 'ans', delay: 0.18 * T, dur: 0.45 * T, arc: -70, s0: 30, s1: 46,
      then(g) { const sl = M.node(g, 'ans'); sl.fill = M.num(S.rem, 'r', { pop: g.t, col: GOLD }); M.inert(g, ['r']); placeProb(g); M.sparkle(g, 'r', { n: 12, cols: [GOLD, '#fff', '#a8c8ff'] }); g.sfx('ding'); K.lastMove = g.t;
        const nd = M.node(g, 'a'); M.at(g, [[0.1 * T, g => { nd.v = String(S.a); placeProb(g); M.writeIn(g, nd, { dur: 0.3 * T }); }]]); } });
    M.at(g, [[0.75 * T, g => { S.answered = true; S.ansAt = g.t; S.point = false; M.tween(g, S.note, { alpha: 0 }, 0.3 * T); M.tween(g, S.key, { alpha: 1 }, 0.3 * T, { delay: 0.2 * T }); }]]); };
  if (g.mode === 'medium') M.at(g, [[askAt, g => { M.openAsk(g, { ask: { v: S.rem, wrong: [S.turns, S.n - S.rem, S.a - S.n, S.rem + 1] }, after: 1.1 * T, resolve: fill }); K.busyT = 1e9; }]]);
  else M.at(g, [[askAt, fill]]);
}

MG.add({
  id: 'modular_mod', stage: 'modular', cmd: 'MODULO!', hint: 'drag', time: 9, mood: 'night', winText: 'Wrapped!', hold: 1.4,
  card: {
    title: 'Modular arithmetic', ref: 'College', kind: 'Number theory',
    text: 'a mod n means the remainder when you divide a by n. The number n is called the modulus.\n\nYou can find a mod n on a clock with n hours, numbered 0 to n − 1. Start at 0 and step forward a hours. The hour where you stop is a mod n.\n\nFor example, take 17 mod 5. On a 5-hour clock, every 5 steps bring you back to 0, so each full turn takes 5 away from 17: 17, 12, 7, 2. The last 2 steps stop at hour 2, so 17 mod 5 = 2. Check it: 17 = 3 × 5 + 2.\n\nThis is why it is called clock arithmetic. A 24-hour day works mod 24: 30 hours after midnight it is 6 in the morning, because 30 mod 24 = 6.',
    note: 'a mod n is the remainder of a ÷ n. Take n away as many times as you can. What is left, a number from 0 to n − 1, is the answer.',
    ask: 'What is 23 mod 6? What is 40 mod 7?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); S.steps = 0; S.cont = 0; S.shown = S.a; S.drag = null;
    S.prob = M.row(M.num(S.a, 'a'), M.gap(10), M.txt('mod', 'md'), M.gap(10), M.num(S.n, 'n'), M.op('=', 'eq'), clr(46), M.slot('ans'));
    placeProb(g); M.inert(g, ['md', 'eq', 'ans']);
    S.key = M.txt(`${S.a} mod ${S.n} = the remainder of ${S.a} ÷ ${S.n}`, 'key'); M.place(g, 'key', S.key, 180, 512, 18, { col: '#c8d0ff' }); M.inert(g, ['key']);
    g.dur *= (2.6 + 1.05 * (S.turns + 1)) / 8;
    M.play(g, { moves(g) { return S.answered ? [] : [{ drag: 'hand', to: 'hand' }]; }, area(g) { return 'hand'; } });
  },
  update(g, dt) {
    const S = g.s, T = M.pace(g); M.update(g, dt);
    if (S.walk && !S.landed && g.t >= S.walk.next) { const k = S.steps + 1; S.walk.next = g.t + (ST + (k % S.n === 0 ? PT : 0)) * T; S.stepAt = g.t; S.stepFrom = S.cont; setSteps(g, k); }
    // the hand ticks: each step it swings on to the next hour with a little overshoot
    if (S.walk && !S.landed && S.stepAt != null) { const k = M.clamp((g.t - S.stepAt) / (ST * 0.85 * T), 0, 1), e = 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2); S.cont = M.lerp(S.stepFrom, S.steps, Math.min(1.06, e)); }
  },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask && !K.ask.closing) { M.down(g, x, y); return; }
    const d = Math.hypot(x - CX, y - CY);
    if (!S.landed && !S.walk && d < R + 36 && d > 14) { S.drag = { last: ptrU(S, x, y) }; g.sfx('tap'); return; }
    M.down(g, x, y);
  },
  move(g, x, y) {
    const S = g.s, D = S.drag; if (!D || g.done) { M.move(g, x, y); return; }
    if (Math.hypot(x - CX, y - CY) < 12) return;
    const u = ptrU(S, x, y); let d = u - D.last; if (d > S.n / 2) d -= S.n; if (d < -S.n / 2) d += S.n; D.last = u;
    S.cont = M.clamp(S.cont + d, 0, S.a); setSteps(g, Math.floor(S.cont + 0.5));
    if (!S.landed) { const h = pt(S, S.cont, R - 52); M.zone(g, 'hand', { x: h.x, y: h.y, w: 34, h: 34 }); }
  },
  up(g, x, y) {
    const S = g.s; if (g.done) return;
    if (S.drag) { S.drag = null; S.cont = S.steps; S.mk.moveT = g.t; placeProb(g); if (!S.landed && S.steps > 0) { S.mk.lastMove = g.t; g.sfx('swoosh'); startWalk(g); } return; }
    M.up(g, x, y);
  },
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { if (!K.ask.closing) M.auto(g, dt, synth); return; }
    if (S.landed || S.walk) return;
    if (!S.bot) { if (g.t < 0.4) return; const p = pt(S, S.cont, R - 40); synth('down', p.x, p.y); S.bot = { u: S.cont }; return; }
    const goal = Math.min(S.a, 1.4); S.bot.u = Math.min(goal, S.bot.u + dt * S.n * 1.2); const p = pt(S, S.bot.u, R - 40); synth('move', p.x, p.y);
    if (S.landed || S.bot.u >= goal) { synth('up', p.x, p.y); S.bot = null; }
  },
  draw(g, c) {
    const S = g.s, K = S.mk, t = g.t; SCN.bg(g, c, 'night');
    // moonlight halo and the rings: one ring of light for every full turn walked
    const halo = c.createRadialGradient(CX, CY, R * 0.6, CX, CY, R + 70); halo.addColorStop(0, 'rgba(160,180,255,0.25)'); halo.addColorStop(1, 'rgba(160,180,255,0)'); c.fillStyle = halo; c.fillRect(0, CY - R - 70, 360, 2 * R + 140);
    const full = Math.floor(S.steps / S.n);
    for (let i = 0; i < full; i++) { const fresh = S.turnAt && i === full - 1 ? M.clamp((t - S.turnAt) / 0.3, 0, 1) : 1; c.strokeStyle = `rgba(255,212,90,${0.75 * fresh})`; c.lineWidth = 4; c.beginPath(); c.arc(CX, CY, R + 10 + i * 8, 0, 7); c.stroke(); }
    // the clock face
    c.fillStyle = 'rgba(0,0,20,0.35)'; c.beginPath(); c.arc(CX + 3, CY + 6, R, 0, 7); c.fill();
    const fg = c.createRadialGradient(CX - 30, CY - 40, 10, CX, CY, R); fg.addColorStop(0, '#34407a'); fg.addColorStop(1, '#161c44'); c.fillStyle = fg; c.beginPath(); c.arc(CX, CY, R, 0, 7); c.fill();
    c.strokeStyle = '#e8e0c0'; c.lineWidth = 4; c.stroke();
    // the steps walked in this turn, as a glowing arc
    const part = S.cont - full * S.n; if (part > 0.01 && !S.landed) { c.strokeStyle = 'rgba(255,212,90,0.55)'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.arc(CX, CY, R - 8, ang(S, 0), ang(S, S.cont)); c.stroke(); }
    const here = ((Math.round(S.cont) % S.n) + S.n) % S.n;
    for (let k = 0; k < S.n; k++) {
      const p = pt(S, k, R - 26), on = k === here, pk = S.landed ? M.clamp((t - S.landAt) / 0.4, 0, 1) : S.stepAt != null ? M.clamp((t - S.stepAt) / 0.16, 0, 1) : 1, pop = on ? 1 + Math.sin(pk * Math.PI) * (S.landed ? 0.5 : 0.18) : 1;
      const tk = pt(S, k, R - 4); c.fillStyle = '#e8e0c0'; c.beginPath(); c.arc(tk.x, tk.y, 2.5, 0, 7); c.fill();
      c.save(); c.translate(p.x, p.y); c.scale(pop, pop); c.fillStyle = on ? GOLD : INK; c.font = M.NUMF(on ? 30 : 26); c.textAlign = 'center'; c.textBaseline = 'middle';
      if (on) { c.shadowColor = GOLD; c.shadowBlur = 12; } c.fillText(String(k), 0, 1); c.restore();
    }
    // the hand: a golden arrow from the centre
    const th = ang(S, S.cont), tip = R - 48; c.save(); c.translate(CX, CY); c.rotate(th);
    c.fillStyle = GOLD; c.strokeStyle = '#8a5a1a'; c.lineWidth = 2; c.beginPath(); c.moveTo(-14, -5); c.lineTo(tip - 14, -4); c.lineTo(tip - 14, -10); c.lineTo(tip + 4, 0); c.lineTo(tip - 14, 10); c.lineTo(tip - 14, 4); c.lineTo(-14, 5); c.closePath(); c.fill(); c.stroke(); c.restore();
    c.fillStyle = '#fff6d8'; c.beginPath(); c.arc(CX, CY, 11, 0, 7); c.fill(); c.fillStyle = '#34407a'; c.beginPath(); c.arc(CX + 4, CY - 3, 9, 0, 7); c.fill();
    // passing 0 again: a flash of light at the top of the dial
    if (S.wrapAt != null && t - S.wrapAt < 0.45) { const k = (t - S.wrapAt) / 0.45, p = pt(S, 0, R - 26); c.save(); c.globalAlpha = 1 - k; c.strokeStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 14; c.lineWidth = 3; c.beginPath(); c.arc(p.x, p.y, 16 + k * 22, 0, 7); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'prob'); c.save(); c.globalAlpha = 0.85; M.drawEx(g, c, 'key'); c.restore(); M.drawEx(g, c, 'note');
    // the owl counts along: it hops at every full turn, and points while the working is written
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', 302, 606 - hopK * 22, 1.2, { t, pose: won ? 'cheer' : hopK > 0 ? 'hop' : S.point ? 'point' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : S.walk ? 'wow' : 'happy', facing: -1 }); else SCN.host(g, c, 'owl', 302, 606, 1.2);
    // guidance: the hand glows, and a ghost hand sweeps clockwise round the dial
    const failed = g.done && g.result === 'fail';
    if (!S.landed && !S.drag && !S.walk && !K.ask && (!g.done || failed)) {
      const h = pt(S, S.cont, R - 52); M.glowBox(c, { x: h.x, y: h.y, w: 30, h: 30 }, t, 1, true);
      if (failed || g.level === 0 || t - K.moveT > 2) { const k = ((t - K.moveT) * 0.7) % 1, p = pt(S, S.cont + k * S.n * 0.8, R - 40); M.hand(c, p.x + 4, p.y + 6, 1, k < 0.1 ? 1 : 0); }
    }
    M.drawAnims(g, c); M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});
