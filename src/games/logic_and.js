// logic_and.js — TRUTH TABLE! A chalked truth table for P ∧ Q (level 1: P ∨ Q, level 2: P → Q) with all four rows.
// Some cells of the result column are filled in (correctly, as worked examples) and the rest are blank. The player
// taps each blank cell, and the working plays by itself in that row: a chalk band sweeps across the row, its P and Q
// glow and fly into the cell, where they read like the header ("T ∧ F"), then that merges into the value, which pops
// in with a tick. Tapping a filled cell is a wrong move (it only wobbles). Rows can be done in any order. ∧, ∨ and →
// are drawn as strokes (the fonts lack them). (The owner asked for blank cells instead of wrong values to correct.)
// Level 0: P ∧ Q, 2 blank cells. Level 1: P ∨ Q, 2–3 blank cells. Level 2: P → Q, 2–3 blank cells.
// Medium mode: once "T ∧ F" is in the cell, the player picks T or F from the tray.
const M = MK, INK = SCN.ink('chalk'), TCOL = '#ffe27a', FCOL = '#9ad4ff';
const OPS = { and: (p, q) => p && q, or: (p, q) => p || q, imp: (p, q) => !p || q };
const WORD = { and: 'and', or: 'or', imp: 'if … then' };
const XP = 90, XQ = 148, XR = 256, HEADY = 212, ROWY = [256, 296, 336, 376];
// ∧ ∨ → drawn as strokes, centred on (x, y), for a font size s
function glyph(c, kind, x, y, s, col) {
  const a = s * 0.22; c.save(); c.strokeStyle = col; c.lineWidth = s * 0.085; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
  if (kind === 'and') { c.moveTo(x - a, y + a); c.lineTo(x, y - a); c.lineTo(x + a, y + a); }
  else if (kind === 'or') { c.moveTo(x - a, y - a); c.lineTo(x, y + a); c.lineTo(x + a, y - a); }
  else { const w = s * 0.34; c.moveTo(x - w, y); c.lineTo(x + w, y); c.moveTo(x + w - a * 0.8, y - a * 0.75); c.lineTo(x + w, y); c.lineTo(x + w - a * 0.8, y + a * 0.75); }
  c.stroke(); c.restore();
}
function gen(g) {
  const op = ['and', 'or', 'imp'][g.level] || 'and';
  const rows = [[1, 1], [1, 0], [0, 1], [0, 0]].map(([p, q], i) => ({ i, p: !!p, q: !!q, want: OPS[op](!!p, !!q) }));
  const ix = [0, 1, 2, 3]; for (let i = 3; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [ix[i], ix[j]] = [ix[j], ix[i]]; }
  const nBad = g.level === 0 ? 2 : 2 + Math.floor(g.rand() * 2);
  ix.slice(0, nBad).forEach(i => { rows[i].bad = true; });
  rows.forEach(r => { r.val = r.bad ? null : r.want; }); // a blank cell has no value yet
  return { op, rows };
}
const tf = v => M.num(v ? 'T' : 'F');

MG.add({
  id: 'logic_and', stage: 'logic', cmd: 'TRUTH TABLE!', hint: 'tap', time: 8, mood: 'night', winText: 'Table done!', hold: 1.4,
  card: {
    title: 'Truth tables', ref: 'Discrete math', kind: 'Logic',
    text: 'A statement is a sentence that is either true (T) or false (F). Here P and Q stand for two statements, such as P = "it is sunny" and Q = "we swim".\n\nP ∧ Q means "P and Q". It is true only when both are true. P ∨ Q means "P or Q". It is true when at least one of them is true. P → Q means "if P, then Q". It is false only when P is true and Q is false.\n\nA truth table has one row for each way P and Q can be true or false, so it has 2 × 2 = 4 rows. For example, in the row where P is T and Q is F, P ∧ Q is F and P ∨ Q is T.\n\nWhy is P → Q true when P is false? "If it is sunny, we swim" is a promise, and it is broken only on a sunny day with no swim.',
    note: 'P ∧ Q is true only when both are true. P ∨ Q is false only when both are false. P → Q is false only when P is true and Q is false.',
    ask: 'If P is F and Q is T, what are P ∧ Q, P ∨ Q and P → Q?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g));
    S.rows.forEach(r => M.zone(g, 'r' + r.i, { x: XR, y: ROWY[r.i], w: 72, h: 34 }));
    g.dur *= (2.6 + 1.05 * S.rows.filter(r => r.bad).length) / 8;
    const T = S.T = M.pace(g), hop = e => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    M.play(g, {
      moves(g) {
        return S.rows.filter(r => r.val !== r.want && !r.pend).map(r => ({
          tap: 'r' + r.i, busy: 0.1, askAt: 0.8 * T, after: 0.75 * T, ask: { v: tf(r.want), wrong: [tf(!r.want)] },
          // the row is checked in place: the wrong value is struck out, the row's P and Q light up and fly into the
          // cell, where they read like the header ("T ∧ F")
          then(g) { r.pend = true; r.workAt = g.t; S.point = true; hop('think'); M.show(g, 0.8 * T); g.sfx('swoosh');
            const y = ROWY[r.i];
            M.at(g, [[0.12 * T, g => { r.pAt = g.t; g.sfx('tap'); M.fly(g, { node: tf(r.p), from: [XP, y], to: [XR - 23, y], dur: 0.34 * T, arc: -34, s0: 28, s1: 22, col: r.p ? TCOL : FCOL, then(g) { r.landP = g.t; } }); }],
              [0.3 * T, g => { r.qAt = g.t; g.sfx('tap', { p: 1.2 }); M.fly(g, { node: tf(r.q), from: [XQ, y], to: [XR + 23, y], dur: 0.34 * T, arc: -26, s0: 28, s1: 22, col: r.q ? TCOL : FCOL, then(g) { r.landQ = g.t; hop(); } }); }]]); },
          // "T ∧ F" merges into its value, which pops in with a tick
          resolve(g) { M.show(g, 0.75 * T); r.mergeAt = g.t + 0.25 * T;
            M.at(g, [[0.25 * T, g => { g.sfx('pop'); }],
              [0.41 * T, g => { r.val = r.want; r.pend = false; r.okAt = g.t; g.sfx('coin'); hop('laugh'); g.burst(XR, ROWY[r.i], ['#ffe27a', '#fff', '#9ae07a'], 12, 120); }],
              [0.75 * T, g => { S.point = false; }]]); },
        }));
      },
      area(g) { const m = M.current(g)[0]; return m ? [m.tap] : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = g.s.mk;
    SCN.std(g, c, { scene: 'forest', panel: 'chalk', panelY: 300, panelW: 300, panelH: 252 });
    // the owl points at the board while a row is checked, and hops when a value lands
    { const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
      const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
      if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', 296, 606 - hopK * 22, 1.25, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'owl', 296, 606, 1.25); }
    // chalk grid: a line under the header, and one between the inputs and the result
    c.save(); c.strokeStyle = 'rgba(251,248,238,0.6)'; c.lineWidth = 2.5; c.lineCap = 'round';
    c.beginPath(); c.moveTo(48, 234); c.lineTo(312, 234); c.moveTo(196, 188); c.lineTo(196, 394); c.stroke(); c.restore();
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = INK; c.font = M.VARF(32);
    c.fillText('P', XP, HEADY); c.fillText('Q', XQ, HEADY);
    c.fillText('P', XR - 46, HEADY); c.fillText('Q', XR + 46, HEADY); glyph(c, S.op, XR, HEADY, 32, INK);
    const cell = (v, x, y, s, col) => { c.font = M.NUMF(s, 700); c.fillStyle = col || (v ? TCOL : FCOL); c.fillText(v ? 'T' : 'F', x, y + 2); };
    const T = S.T || 1;
    for (const r of S.rows) {
      const y = ROWY[r.i], ok = r.okAt != null ? M.clamp(1 - (t - r.okAt) / 0.7, 0, 1) : 0;
      // while a row is checked, a chalk band sweeps across it and its P and Q glow as they are read
      const wk = r.workAt != null && r.okAt == null ? M.easeIO((t - r.workAt) / (0.25 * T)) : r.okAt != null ? ok : 0;
      if (wk > 0) { c.save(); c.globalAlpha = 0.18 * (r.okAt != null ? ok : 1); c.fillStyle = '#fbf8ee'; c.beginPath(); c.roundRect(52, y - 18, (258) * (r.okAt != null ? 1 : wk), 36, 10); c.fill(); c.restore(); }
      for (const [x, t0] of [[XP, r.pAt], [XQ, r.qAt]]) { if (t0 == null) continue; const k = M.clamp((t - t0) / (0.45 * T), 0, 1); if (k >= 1) continue;
        c.save(); c.globalAlpha = Math.sin(k * Math.PI); c.strokeStyle = '#ffe27a'; c.shadowColor = '#ffe27a'; c.shadowBlur = 10; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 18 + k * 4, 0, 7); c.stroke(); c.restore(); }
      if (ok > 0) for (const x of [XP, XQ]) { c.save(); c.globalAlpha = ok; c.fillStyle = 'rgba(255,226,122,0.35)'; c.beginPath(); c.arc(x, y, 20 + (1 - ok) * 6, 0, 7); c.fill(); c.restore(); }
      cell(r.p, XP, y, 28); cell(r.q, XQ, y, 28);
      // the result cell: a chalk box; it wobbles red after a wrong tap
      const miss = K.missInfo && K.missInfo.tap === 'r' + r.i && t - K.missAt < 0.6, sh = miss ? Math.sin((t - K.missAt) * 50) * 5 : 0;
      c.save(); c.translate(XR + sh, y);
      c.fillStyle = miss ? 'rgba(216,69,74,0.4)' : 'rgba(255,255,255,0.08)'; c.strokeStyle = 'rgba(251,248,238,0.5)'; c.lineWidth = 2; c.setLineDash([5, 5]);
      c.beginPath(); c.roundRect(-34, -16, 68, 32, 8); c.fill(); c.stroke(); c.setLineDash([]);
      if (r.workAt != null && r.okAt == null) {
        // "T ∧ F", built from the flown-in values; it slides together and fades when it merges
        const mk = r.mergeAt != null ? M.easeIO((t - r.mergeAt) / (0.2 * T)) : 0, sp = 23 * (1 - mk);
        c.globalAlpha = 1 - mk;
        if (r.landP != null) { cell(r.p, -sp, 0, 22); const gk = M.ease((t - r.landP) / (0.15 * T)); c.globalAlpha = (1 - mk) * gk; glyph(c, S.op, 0, 0, S.op === 'imp' ? 17 : 22, INK); c.globalAlpha = 1 - mk; }
        if (r.landQ != null) cell(r.q, sp, 0, 22);
        c.globalAlpha = 1;
      } else if (r.val != null) { const pk = r.okAt != null ? M.clamp((t - r.okAt) / 0.3, 0, 1) : 1, sc = 1 + Math.sin(pk * Math.PI) * 0.45; c.scale(sc, sc); cell(r.val, 0, 0, 30, miss ? '#ffb0a8' : null); }
      c.restore();
      if (r.okAt != null) { const k = M.ease((t - r.okAt) / 0.25); c.save(); c.strokeStyle = '#9ae07a'; c.lineWidth = 4; c.lineCap = 'round'; c.globalAlpha = k;
        c.beginPath(); c.moveTo(298, y); c.lineTo(298 + 6 * Math.min(1, k * 2), y + 7 * Math.min(1, k * 2)); if (k > 0.5) c.lineTo(304 + 10 * (k - 0.5) * 2, y + 7 - 15 * (k - 0.5) * 2); c.stroke(); c.restore(); }
    }
    // a small key that names the symbol in words
    c.font = M.NUMF(17, 500); c.fillStyle = 'rgba(251,248,238,0.8)'; c.textAlign = 'left';
    const kw = c.measureText('= ' + WORD[S.op]).width, kx = 180 - (kw + 22) / 2;
    glyph(c, S.op, kx + 7, 408, S.op === 'imp' ? 14 : 18, 'rgba(251,248,238,0.85)'); c.fillText('= ' + WORD[S.op], kx + 22, 409);
    c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    M.drawUI(g, c);
  },
});
