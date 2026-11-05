// counting_sigma.js — SIGMA! Expand a sum written in sigma notation and add it up.
// An old library at night; the sum is chalked on a blackboard and a beaver keeps watch. The player taps the Σ: one copy of
// the formula flies out for each value of k and lands as a term, with its k written under it (2k → 2 + 4 + 6 + 8).
// Then a tap on the written-out sum adds it up (medium mode: picked from the tray).
// Level 0: c·k for k = 1 to 3 or 4. Level 1: k + c for k = 1 to 4 or 5. Level 2: k² for k from 1 or 2 to 4.
// The Σ is painted here (the fonts have no Σ glyph); its token is an invisible placeholder that keeps its box.
const M = MK, INK = SCN.ink('chalk');
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  if (L === 0) { const c = 2 + r(2); return { lo: 1, hi: 3 + r(2), f: k => c * k, body: () => M.row(M.num(c), M.vr('k')) }; }
  if (L === 1) { const c = 1 + r(4); return { lo: 1, hi: 4 + r(2), f: k => k + c, body: () => M.paren(M.row(M.vr('k'), M.op('+'), M.num(c))) }; }
  return { lo: 1 + r(2), hi: 4, f: k => k * k, body: () => M.sup(M.vr('k'), M.num(2)) };
}

MG.add({
  id: 'counting_sigma', stage: 'counting', cmd: 'SIGMA!', hint: 'tap', time: 8, mood: 'night', winText: 'Summed!', hold: 1.4,
  card: {
    title: 'Sigma notation', ref: 'Grade 11 and up', kind: 'Sequences',
    text: 'The big Greek letter Σ, called sigma, is a short way to write "add these up". The letter k under it starts at the number written below Σ and counts up by 1 to the number written above Σ. For each value of k, you work out the formula next to Σ, and then you add all the results.\n\nFor example, the sum of 2k from k = 1 to 4 means 2·1 + 2·2 + 2·3 + 2·4, which is 2 + 4 + 6 + 8 = 20.\n\nSigma notation lets you write a long sum in a small space, even a sum with a hundred terms.',
    note: 'Put each value of k, from the bottom number to the top number, into the formula. Then add the results.',
    ask: 'What is the sum of 3k from k = 1 to 3? What is the sum of k² from k = 1 to 3?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g));
    S.ks = []; for (let k = S.lo; k <= S.hi; k++) S.ks.push(k); S.vals = S.ks.map(S.f); S.total = S.vals.reduce((p, v) => p + v, 0);
    S.st = 1; S.size = 46; S.landed = true; g.dur *= (2.6 + 1.05 * 2) / 8;
    S.build = () => {
      let fill = null;
      if (S.st === 1) { fill = M.row(...S.vals.flatMap((v, i) => [i ? M.op('+', 'p' + i) : null, M.num(v, 'e' + i, { alpha: S.landed ? 1 : 0 })])); fill.id = 'sum'; }
      if (S.st === 2) fill = M.num(S.total, null, { pop: g.t });
      const body = S.body(); body.id = 'body';
      M.place(g, 'ex', M.row(M.txt('M', 'sig', { alpha: 0 }), M.gap(S.size * 0.25), body, M.op('=', 'eq'), M.slot('q', { fill })), 180, 300, S.size, { col: INK });
    };
    // one size for every step, chosen so the widest step (the written-out sum) fits on the board
    for (S.build(); M.lay(g.s.mk.ex.ex.node, S.size).w > 300 && S.size > 26; S.build()) S.size -= 2;
    S.st = 0; S.landed = false; S.build(); M.inert(g, ['eq', ...S.vals.flatMap((v, i) => ['e' + i, 'p' + i])]);
    M.play(g, {
      moves(g) {
        if (S.st === 0) return [{ tap: 'sig', busy: 0.12, then(g) {
          S.st = 1; S.expAt = g.t; S.build(); g.sfx('whoosh');
          S.vals.forEach((v, i) => M.fly(g, { node: M.num(v), from: 'body', to: 'e' + i, dur: 0.22, delay: i * 0.05, arc: -40, then(g) { const n = M.node(g, 'e' + i); if (n) { n.alpha = 1; n.pop = g.t; } if (i === S.vals.length - 1) S.landed = true; g.sfx('pop'); } }));
        } }];
        if (S.st === 1) {
          const v = S.vals, last = v[v.length - 1];
          return [{ tap: ['sum', 'q'], busy: 0.1, ask: { v: S.total, wrong: [S.total - last, S.total + 1, S.total - 1, S.total + v[0]] }, then() {}, resolve(g) { S.st = 2; S.landed = true; S.build(); g.sfx('coin'); g.burst(180, 300, ['#fff6c0', '#ffd45a', '#bfe8ff'], 14, 140); } }];
        }
        return [];
      },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'library', panel: 'chalk', host: 'beaver', hostX: 280, hostY: 470, hostS: 1.2 });
    // a candle on the shelf, flickering
    const fl = 1 + 0.12 * Math.sin(t * 17) + 0.08 * Math.sin(t * 29);
    c.fillStyle = '#f4ead0'; c.fillRect(56, 432, 14, 34); const cg = c.createRadialGradient(63, 424, 0, 63, 424, 46 * fl); cg.addColorStop(0, 'rgba(255,220,140,0.55)'); cg.addColorStop(1, 'rgba(255,200,120,0)');
    c.fillStyle = cg; c.beginPath(); c.arc(63, 424, 46 * fl, 0, 7); c.fill(); c.fillStyle = '#ffcf5a'; c.beginPath(); c.ellipse(63, 424, 4, 8 * fl, 0, 0, 7); c.fill();
    M.drawEx(g, c, 'ex');
    // the Σ with its limits, in chalk
    const b = M.box(g, 'sig');
    if (b) {
      const pk = S.expAt != null ? Math.sin(M.clamp((t - S.expAt) / 0.3, 0, 1) * Math.PI) * 0.25 : 0, h = S.size * 1.15 * (1 + pk), w = S.size * 0.8 * (1 + pk), x0 = b.x - w / 2, y0 = b.y - h / 2;
      c.save(); c.strokeStyle = INK; c.lineWidth = S.size * 0.1; c.lineJoin = 'round'; c.lineCap = 'round';
      c.beginPath(); c.moveTo(x0 + w, y0 + h * 0.12); c.lineTo(x0 + w, y0); c.lineTo(x0, y0); c.lineTo(x0 + w * 0.55, y0 + h / 2); c.lineTo(x0, y0 + h); c.lineTo(x0 + w, y0 + h); c.lineTo(x0 + w, y0 + h * 0.88); c.stroke();
      c.fillStyle = INK; c.textAlign = 'center'; c.font = M.NUMF(S.size * 0.48); c.fillText(String(S.hi), b.x, y0 - 8);
      const ly = y0 + h + S.size * 0.5; c.font = M.VARF(S.size * 0.46); const kw = c.measureText('k').width; c.font = M.NUMF(S.size * 0.46); const rest = ' = ' + S.lo, rw = c.measureText(rest).width;
      c.textAlign = 'left'; c.font = M.VARF(S.size * 0.46); c.fillText('k', b.x - (kw + rw) / 2, ly); c.font = M.NUMF(S.size * 0.46); c.fillText(rest, b.x - (kw + rw) / 2 + kw, ly);
      c.restore();
    }
    // under each written-out term, the k it came from
    if (S.st === 1) S.ks.forEach((k, i) => { const e = M.box(g, 'e' + i); if (!e || !S.landed && t - S.expAt < 0.22 + i * 0.05) return; c.fillStyle = 'rgba(251,248,238,0.6)'; c.textAlign = 'center'; c.font = `italic 600 13px Georgia, serif`; c.fillText('k=' + k, e.x, e.y + e.h / 2 + 18); });
    M.drawUI(g, c);
  },
});
