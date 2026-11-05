// logic_and.js — TRUTH TABLE! A chalked truth table for P ∧ Q (level 1: P ∨ Q, level 2: P → Q) with all four rows.
// The result column is already filled in, but some of its T/F cells are wrong. The player taps each wrong cell: it
// flips to the right value, and that row's P and Q cells flash to show the check. Tapping a cell that is already right
// is a wrong move (it only wobbles). Rows can be fixed in any order. ∧, ∨ and → are drawn as strokes (the fonts lack them).
// Level 0: P ∧ Q, 2 wrong cells. Level 1: P ∨ Q, 2–3 wrong cells. Level 2: P → Q, 2–3 wrong cells.
// Medium mode: each tapped cell shows "?" and the player picks T or F from the tray.
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
  rows.forEach(r => { r.val = r.bad ? !r.want : r.want; });
  return { op, rows };
}
const tf = v => M.num(v ? 'T' : 'F');

MG.add({
  id: 'logic_and', stage: 'logic', cmd: 'TRUTH TABLE!', hint: 'tap', time: 8, mood: 'night', winText: 'All true!', hold: 1.4,
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
    M.play(g, {
      moves(g) {
        return S.rows.filter(r => r.val !== r.want && !r.pend).map(r => ({
          tap: 'r' + r.i, busy: 0.1, askAt: 0, after: 0.1, ask: { v: tf(r.want), wrong: [tf(!r.want)] },
          then(g) { r.pend = true; r.flipAt = g.t; g.sfx('swoosh'); },
          resolve(g) { r.val = r.want; r.pend = false; r.okAt = g.t; g.sfx('coin'); g.burst(XR, ROWY[r.i], ['#ffe27a', '#fff', '#9ae07a'], 10, 110); },
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
    SCN.std(g, c, { scene: 'forest', panel: 'chalk', panelY: 300, panelW: 300, panelH: 252, host: 'owl', hostX: 296, hostY: 606, hostS: 1.25 });
    // chalk grid: a line under the header, and one between the inputs and the result
    c.save(); c.strokeStyle = 'rgba(251,248,238,0.6)'; c.lineWidth = 2.5; c.lineCap = 'round';
    c.beginPath(); c.moveTo(48, 234); c.lineTo(312, 234); c.moveTo(196, 188); c.lineTo(196, 394); c.stroke(); c.restore();
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = INK; c.font = M.VARF(32);
    c.fillText('P', XP, HEADY); c.fillText('Q', XQ, HEADY);
    c.fillText('P', XR - 46, HEADY); c.fillText('Q', XR + 46, HEADY); glyph(c, S.op, XR, HEADY, 32, INK);
    const cell = (v, x, y, s, col) => { c.font = M.NUMF(s, 700); c.fillStyle = col || (v ? TCOL : FCOL); c.fillText(v ? 'T' : 'F', x, y + 2); };
    for (const r of S.rows) {
      const y = ROWY[r.i], ok = r.okAt != null ? M.clamp(1 - (t - r.okAt) / 0.7, 0, 1) : 0;
      // the check happens in the row itself: its P and Q light up for a moment
      if (ok > 0) for (const x of [XP, XQ]) { c.save(); c.globalAlpha = ok; c.fillStyle = 'rgba(255,226,122,0.35)'; c.beginPath(); c.arc(x, y, 20 + (1 - ok) * 6, 0, 7); c.fill(); c.restore(); }
      cell(r.p, XP, y, 28); cell(r.q, XQ, y, 28);
      // the result cell: a chalk box; it wobbles red after a wrong tap and flips over when it changes
      const miss = K.missInfo && K.missInfo.tap === 'r' + r.i && t - K.missAt < 0.6, sh = miss ? Math.sin((t - K.missAt) * 50) * 5 : 0;
      const fk = r.flipAt != null ? M.clamp((t - r.flipAt) / 0.24, 0, 1) : 1, sx = Math.max(0.05, Math.abs(Math.cos(fk * Math.PI)));
      c.save(); c.translate(XR + sh, y); c.scale(sx, 1);
      c.fillStyle = miss ? 'rgba(216,69,74,0.4)' : 'rgba(255,255,255,0.08)'; c.strokeStyle = 'rgba(251,248,238,0.5)'; c.lineWidth = 2; c.setLineDash([5, 5]);
      c.beginPath(); c.roundRect(-34, -16, 68, 32, 8); c.fill(); c.stroke(); c.setLineDash([]);
      if (r.pend) { c.font = M.NUMF(28, 700); c.fillStyle = INK; c.fillText('?', 0, 2); }
      else { const shown = fk < 0.5 && r.flipAt != null ? !r.val : r.val; cell(shown, 0, 0, 30, miss ? '#ffb0a8' : null); }
      c.restore();
      if (r.okAt != null) { const k = M.ease((t - r.okAt) / 0.25); c.save(); c.strokeStyle = '#9ae07a'; c.lineWidth = 4; c.lineCap = 'round'; c.globalAlpha = k;
        c.beginPath(); c.moveTo(298, y); c.lineTo(304, y + 7); c.lineTo(314, y - 8); c.stroke(); c.restore(); }
    }
    // a small key that names the symbol in words
    c.font = M.NUMF(17, 500); c.fillStyle = 'rgba(251,248,238,0.8)'; c.textAlign = 'left';
    const kw = c.measureText('= ' + WORD[S.op]).width, kx = 180 - (kw + 22) / 2;
    glyph(c, S.op, kx + 7, 408, S.op === 'imp' ? 14 : 18, 'rgba(251,248,238,0.85)'); c.fillText('= ' + WORD[S.op], kx + 22, 409);
    c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    M.drawUI(g, c);
  },
});
