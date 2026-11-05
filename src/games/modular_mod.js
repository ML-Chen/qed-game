// modular_mod.js — MODULO! Find a mod n by walking a clock hand a steps around an n-hour clock.
// A moonlit clock with n hours, 0 at the top. The player drags the hand clockwise (anywhere on the dial works, so one
// long circular swipe spins it); it ticks one hour per step. Every full turn takes n away from the number in
// "17 mod 5", which drops 17 → 12 → 7 → 2, and a ring of light is added round the dial. The hand cannot go past a:
// after a steps it stops on the remainder and "= 2" is written. Dragging backwards walks the hand back.
// Level 0: n = 4 or 5, two turns and a bit. Level 1: n = 5 or 6, two or three turns. Level 2: n = 6 or 7.
// Medium mode: when the hand stops, the player picks the remainder from the tray.
// Wrong parts: the numbers of the problem (a tap on them wobbles).
const M = MK, CX = 180, CY = 368, R = 100, INK = '#fff4dc', GOLD = '#ffd45a', PY = 218;
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), n = [[4, 5], [5, 6], [6, 7]][L][r(2)];
  const turns = L === 0 ? 2 : 2 + r(2), rem = 1 + r(n - 1);
  return { n, a: n * turns + rem, rem, turns };
}
const ang = (S, u) => u * 2 * Math.PI / S.n - Math.PI / 2;
const pt = (S, u, r) => ({ x: CX + Math.cos(ang(S, u)) * r, y: CY + Math.sin(ang(S, u)) * r });
const ptrU = (S, x, y) => ((Math.atan2(y - CY, x - CX) + Math.PI / 2) / (2 * Math.PI) * S.n + S.n) % S.n;
function placeProb(g) { const S = g.s; M.place(g, 'prob', S.prob, 180, PY, 46, { col: INK }); const h = pt(S, S.cont, R - 52); M.zone(g, 'hand', { x: h.x, y: h.y, w: 34, h: 34 }); }
function setSteps(g, k) {
  const S = g.s; if (k === S.steps) return;
  const before = Math.floor(S.steps / S.n), after = Math.floor(k / S.n); S.steps = k; g.sfx('click');
  if (after !== before) {
    S.shown = S.a - S.n * after; const nd = M.node(g, 'a'); nd.v = String(S.shown); nd.pop = g.t; placeProb(g);
    if (after > before) { const b = M.box(g, 'a'); M.fly(g, { node: M.row(M.op('-'), M.num(S.n)), from: [b.x, b.y], to: [b.x - 40, 160], dur: 0.45, arc: -20, s0: 30, s1: 24, col: GOLD }); g.sfx('coin'); S.turnAt = g.t; }
  }
  if (k === S.a) land(g);
}
function land(g) {
  const S = g.s, K = S.mk; S.landed = true; S.drag = null; S.cont = S.a; K.lastMove = g.t; g.sfx('ding');
  const p = pt(S, S.a, R - 26); g.burst(p.x, p.y, [GOLD, '#fff', '#a8c8ff'], 14, 140);
  const fill = g => { const sl = M.node(g, 'ans'); sl.fill = M.num(S.rem, 'r', { pop: g.t }); const nd = M.node(g, 'a'); nd.v = String(S.a); nd.pop = g.t; S.answered = true; S.ansAt = g.t; M.inert(g, ['r']); placeProb(g); };
  if (g.mode === 'medium') { M.openAsk(g, { ask: { v: S.rem, wrong: [S.turns, S.n - S.rem, S.a - S.n, S.rem + 1] }, after: 0.05, resolve: fill }); K.busyT = 1e9; }
  else fill(g);
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
    S.prob = M.row(M.num(S.a, 'a'), M.gap(10), M.txt('mod', 'md'), M.gap(10), M.num(S.n, 'n'), M.op('=', 'eq'), M.slot('ans'));
    placeProb(g); M.inert(g, ['md', 'eq', 'ans']);
    M.place(g, 'key', M.txt(`${S.a} mod ${S.n} = the remainder of ${S.a} ÷ ${S.n}`, 'key'), 180, 510, 15, { col: '#c8d0ff' }); M.inert(g, ['key']);
    g.dur *= (2.6 + 1.05 * (S.turns + 1)) / 8;
    M.play(g, { moves(g) { return S.answered ? [] : [{ drag: 'hand', to: 'hand' }]; }, area(g) { return 'hand'; } });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask && !K.ask.closing) { M.down(g, x, y); return; }
    const d = Math.hypot(x - CX, y - CY);
    if (!S.landed && d < R + 36 && d > 14) { S.drag = { last: ptrU(S, x, y) }; g.sfx('tap'); return; }
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
    if (S.drag) { S.drag = null; S.cont = S.steps; S.mk.moveT = g.t; placeProb(g); return; }
    M.up(g, x, y);
  },
  auto(g, dt, synth) {
    const S = g.s, K = S.mk; if (g.done) return;
    if (K.ask) { if (!K.ask.closing) M.auto(g, dt, synth); return; }
    if (S.landed) return;
    if (!S.bot) { if (g.t < 0.4) return; const p = pt(S, S.cont, R - 40); synth('down', p.x, p.y); S.bot = { u: S.cont }; return; }
    S.bot.u = Math.min(S.a + 0.3, S.bot.u + dt * S.n * 1.8); const p = pt(S, S.bot.u, R - 40); synth('move', p.x, p.y);
    if (S.landed || S.bot.u >= S.a + 0.3) { synth('up', p.x, p.y); S.bot = null; }
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
      const p = pt(S, k, R - 26), on = k === here, pop = S.landed && on ? 1 + Math.sin(M.clamp((t - (S.ansAt || t)) / 0.35, 0, 1) * Math.PI) * 0.4 : 1;
      const tk = pt(S, k, R - 4); c.fillStyle = '#e8e0c0'; c.beginPath(); c.arc(tk.x, tk.y, 2.5, 0, 7); c.fill();
      c.save(); c.translate(p.x, p.y); c.scale(pop, pop); c.fillStyle = on ? GOLD : INK; c.font = M.NUMF(on ? 30 : 26); c.textAlign = 'center'; c.textBaseline = 'middle';
      if (on) { c.shadowColor = GOLD; c.shadowBlur = 12; } c.fillText(String(k), 0, 1); c.restore();
    }
    // the hand: a golden arrow from the centre
    const th = ang(S, S.cont), tip = R - 48; c.save(); c.translate(CX, CY); c.rotate(th);
    c.fillStyle = GOLD; c.strokeStyle = '#8a5a1a'; c.lineWidth = 2; c.beginPath(); c.moveTo(-14, -5); c.lineTo(tip - 14, -4); c.lineTo(tip - 14, -10); c.lineTo(tip + 4, 0); c.lineTo(tip - 14, 10); c.lineTo(tip - 14, 4); c.lineTo(-14, 5); c.closePath(); c.fill(); c.stroke(); c.restore();
    c.fillStyle = '#fff6d8'; c.beginPath(); c.arc(CX, CY, 11, 0, 7); c.fill(); c.fillStyle = '#34407a'; c.beginPath(); c.arc(CX + 4, CY - 3, 9, 0, 7); c.fill();
    M.drawEx(g, c, 'prob'); c.save(); c.globalAlpha = 0.85; M.drawEx(g, c, 'key'); c.restore();
    SCN.host(g, c, 'owl', 302, 606, 1.2);
    // guidance: the hand glows, and a ghost hand sweeps clockwise round the dial
    const failed = g.done && g.result === 'fail';
    if (!S.landed && !S.drag && !K.ask && (!g.done || failed)) {
      const h = pt(S, S.cont, R - 52); M.glowBox(c, { x: h.x, y: h.y, w: 30, h: 30 }, t, 1, true);
      if (failed || g.level === 0 || t - K.moveT > 2) { const k = ((t - K.moveT) * 0.7) % 1, p = pt(S, S.cont + k * S.n * 0.8, R - 40); M.hand(c, p.x + 4, p.y + 6, 1, k < 0.1 ? 1 : 0); }
    }
    M.drawAsk(g, c); M.drawFlies(g, c); M.drawFx(g, c);
  },
});
