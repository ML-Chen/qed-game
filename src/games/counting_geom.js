// counting_geom.js — GEOMETRIC SEQ! Find the common ratio of a geometric sequence and use it.
// Deep space: the terms glow as stars of a constellation, with an owl watching from the planet below. Show your work:
//   1. Drag one term onto the next term: both light up, "6 ÷ 2 = 3" writes itself above that gap (medium mode: the 3 is
//      picked from the tray), the note shrinks into a "× 3" chip, and constellation lines labelled × 3 draw themselves
//      from star to star one after another.
//   2. Drag the × 3 onto the last term (or the empty slot): a copy of 18 and the × 3 fly into the slot, which reads
//      "18 × 3". Tap it: the × 3 slides into the 18, which rolls over to 54, a new star lights up and one more
//      constellation line reaches it.
// Level 0: ratio 2 or 3. Level 1: ratio 2–4. Level 2: a negative ratio, or the ratio ½ (the terms shrink).
const M = MK, INK = '#fff6e0', NOTE = '#bfe8ff';
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  if (L === 0) return { a: 1 + r(3), q: 2 + r(2) };
  if (L === 1) return { a: 1 + r(3), q: 2 + r(3) };
  return g.rand() < 0.5 ? { a: 1 + r(3), q: -(2 + r(2)) } : { a: [48, 64, 80, 96][r(4)], q: 0.5 };
}
const half = q => q === 0.5;
const qNode = (q, o) => half(q) ? M.frac(M.num(1), M.num(2), null, o) : q < 0 ? M.paren(M.num(q), null, o) : M.num(q, null, o);
const qTile = q => half(q) ? M.frac(M.num(1), M.num(2)) : q;
const qText = q => '× ' + (half(q) ? '½' : q < 0 ? '(−' + -q + ')' : q);
function host(g, c, kind, x, y, s, facing) {
  const S = g.s, mk = S.mk, t = g.t, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, kind, x, y - hopK * 24, s, { t, pose, expr, facing }); else SCN.host(g, c, kind, x, y, s);
}

MG.add({
  id: 'counting_geom', stage: 'counting', cmd: 'GEOMETRIC SEQ!', hint: 'drag', time: 9, mood: 'night', winText: 'Stellar!', hold: 1.6,
  card: {
    title: 'Geometric sequences', ref: 'Grade 10 and up', kind: 'Sequences',
    text: 'In a geometric sequence, you get each term by multiplying the term before it by the same number. That number is called the common ratio.\n\nTo find the common ratio, divide any term by the term before it. In 2, 6, 18, the ratio is 6 ÷ 2 = 3, so the next term is 18 × 3 = 54.\n\nThe ratio can be a fraction, which makes the terms shrink: in 80, 40, 20, the ratio is ½. It can also be negative, which makes the signs flip back and forth: 3, −6, 12 has the ratio −2.\n\nTerm number n is the first term times the ratio n − 1 times, which is a₁ · rⁿ⁻¹.',
    note: 'Divide a term by the term before it to get the common ratio r. Multiply the last term by r to get the next term.',
    ask: 'What comes after 5, 10, 20? What is the ratio of 81, 27, 9, and what comes next?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a, q } = S, T = M.pace(g);
    S.T = [0, 1, 2].map(i => a * Math.pow(q, i)); S.next = S.T[2] * q;
    S.found = -1; S.qShown = false; S.st = 0; S.extra = null; g.dur *= (2.6 + 1.05 * 3) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // every symbol is a node object that lives for the whole game, so the symbols glide when the line is rewritten
    const N = S.N = { q: M.slot('q'), last: M.num(S.T[2], 'w0'), op: M.op('×', 'w1'), rv: qNode(q, { id: 'w2' }) };
    const terms = S.T.map((v, i) => M.num(v, 't' + i)), commas = [1, 2, 3].map(i => [M.op(',', 'c' + i), M.gap(14)]);
    S.size = 42;
    S.build = () => {
      const items = [];
      terms.forEach((n, i) => { if (i) items.push(...commas[i - 1]); items.push(n); });
      N.q.fill = [null, Object.assign(M.row(N.last, N.op, N.rv), { id: 'sm' }), N.last][S.st];
      items.push(...commas[2], N.q);
      M.place(g, 'seq', M.row(...items), 180, 320, S.size, { col: INK });
    };
    // one size for every step, chosen so the widest step (the slot reading "18 × 3") fits on the screen
    S.st = 1; for (S.build(); M.lay(g.s.mk.ex.seq.node, S.size).w > 318 && S.size > 28; S.build()) S.size -= 2; S.st = 0;
    S.build(); M.inert(g, ['c1', 'c2', 'c3', 'nt', 'w0', 'w1', 'w2']);
    M.play(g, {
      moves(g) {
        // 1. the common ratio: a term divided by the one before it
        if (S.found < 0) {
          const out = [];
          for (let i = 0; i < 2; i++) for (const [p, k] of [[i, i + 1], [i + 1, i]]) out.push({
            drag: 't' + p, to: 't' + k, busy: 0.1, askAt: 0.5 * T, after: 1.3 * T,
            ask: { v: qTile(q), wrong: half(q) ? [2, -S.T[1], M.frac(M.num(1), M.num(4))] : [S.T[i + 1] - S.T[i], -q, q + 1, S.T[i + 1]] },
            then(g) { S.found = i; M.show(g, 0.5 * T); S.point = true; hop(g, 'think'); g.sfx('whoosh');
              M.indicate(g, 't' + (i + 1), { col: NOTE, dur: 0.4 * T }); M.indicate(g, 't' + i, { col: NOTE, dur: 0.4 * T, delay: 0.1 * T });
              const b0 = M.box(g, 't' + i), b1 = M.box(g, 't' + (i + 1)); S.res = qNode(q, { id: 'rn', alpha: 0 });
              S.note = Object.assign(M.row(M.num(S.T[i + 1]), M.op('÷'), M.num(S.T[i]), M.op('='), S.res), { id: 'nt' });
              const m = M.lay(S.note, 28), x = M.clamp((b0.x + b1.x) / 2, m.w / 2 + 20, 340 - m.w / 2);
              M.place(g, 'rat', S.note, x, b0.y - b0.h / 2 - 30, 28, { col: NOTE }); M.writeIn(g, S.note, { dur: 0.35 * T, delay: 0.08 * T }); },
            resolve(g) { M.show(g, 1.3 * T); S.res.alpha = 1; M.writeIn(g, S.res, { dur: 0.18 * T }); g.sfx('ding');
              M.at(g, [[0.3 * T, g => { for (const it of S.note.items) if (it !== S.res) M.tween(g, it, { alpha: 0 }, 0.18 * T); }],
                [0.5 * T, g => { // the note shrinks into the chip "× 3" over the gap
                  for (const it of S.note.items) if (it !== S.res) it.alpha = 0;
                  const chip = Object.assign(M.row(M.op('×', null, { _born: -1 }), S.res), { id: 'r', pop: g.t }); S.note = chip;
                  const e = g.s.mk.ex.rat; M.place(g, 'rat', chip, e.x + M.lay(e.node, 28).w / 2, e.y, 30, { col: NOTE });
                  S.qShown = true; S.qAt = g.t; g.sfx('sparkle'); hop(g); M.at(g, [[0.25 * T, g => g.sfx('tap')]]); }],
                [1.3 * T, g => { S.point = false; }]]); },
          });
          return out;
        }
        // 2. carry the ratio to the end of the sequence
        if (S.st === 0) return [{ drag: 'r', to: ['t2', 'q'], busy: 0.1, then(g) {
          M.show(g, 0.85 * T); S.point = true; hop(g, 'think'); const db = { ...M.box(g, 'r') }; M.node(g, 'r').hide = true; g.sfx('whoosh');
          for (const n of [N.last, N.op, N.rv]) n.alpha = 0; S.st = 1; S.build(); delete g.s.mk.ex.rat;
          M.fly(g, { node: M.num(S.T[2]), from: 't2', to: 'w0', dur: 0.4 * T, arc: -40, s0: S.size, s1: S.size, col: INK, then(g) { N.last.alpha = 1; N.last.pop = g.t; N.op.alpha = 1; } });
          M.fly(g, { node: M.row(M.op('×'), qNode(q)), from: [db.x, db.y], to: 'w2', dur: 0.45 * T, delay: 0.2 * T, arc: -50, s0: 30, s1: S.size, col: NOTE,
            then(g) { N.rv.alpha = 1; N.op.alpha = 1; M.sparkle(g, 'w2', { n: 8, cols: [NOTE, '#fff'] }); g.sfx('pop'); hop(g); } });
          M.at(g, [[0.85 * T, g => { S.point = false; }]]); } }];
        // 3. multiply: the × 3 slides into the 18, which rolls over to 54
        if (S.st === 1) return [{ tap: ['sm', 'q'], busy: 0.1, askAt: 0.4 * T, after: 0.75 * T, ask: { v: S.next, wrong: [S.T[2] + q, -S.next, S.next * q, S.T[2] * 2 === S.next ? S.T[2] + 1 : S.T[2] * 2] },
          then(g) { M.show(g, 0.4 * T); S.point = true; hop(g, 'think'); M.circle(g, 'sm', { dur: 0.4 * T, col: NOTE }); [N.last, N.op, N.rv].forEach((n, i) => M.light(g, n, { col: '#9ad8ff', delay: i * 0.05 * T })); },
          resolve(g) { M.show(g, 0.75 * T); const kb = M.box(g, 'w0');
            for (const n of [N.op, N.rv]) { const b = M.box(g, n.id); M.tween(g, n, { dx: (kb.x - b.x) * 0.7, alpha: 0 }, 0.22 * T); }
            M.at(g, [[0.24 * T, g => { for (const n of [N.op, N.rv]) { n.alpha = 0; n.dx = 0; } S.st = 2; S.build(); M.roll(g, N.last, S.next, { dur: 0.28 * T }); g.sfx('ding'); }],
              [0.4 * T, g => { S.extra = g.t; }],
              [0.55 * T, g => { N.last.pop = g.t; M.unlight(g, N.last); M.sparkle(g, N.last, { n: 10, cols: [NOTE, '#fff', '#ffe9a0'] }); g.sfx('coin'); hop(g, 'laugh'); }],
              [0.75 * T, g => { S.point = false; }]]); } }];
        return [];
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || [m.drag, m.to]) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'space', panel: 'none' });
    host(g, c, 'owl', 84, 520, 1.2, 1);
    // each term glows as a star; once the ratio is known, constellation lines join them one by one, labelled with the ratio
    const ids = ['t0', 't1', 't2', 'q'];
    if (S.qShown) {
      for (let k = 0; k < 3; k++) {
        const t0 = k < 2 ? S.qAt + k * 0.25 : S.extra; if (t0 == null) continue;
        const a = M.box(g, ids[k]), b = M.box(g, ids[k + 1]); if (!a || !b) continue; const kk = M.ease((t - t0) / 0.3); if (kk <= 0) continue;
        const y = a.y + a.h / 2 + 22, x1 = M.lerp(a.x, b.x, kk);
        c.save(); c.strokeStyle = 'rgba(190,232,255,0.85)'; c.lineWidth = 2.5; c.setLineDash([2, 6]); c.lineCap = 'round';
        c.beginPath(); c.moveTo(a.x, y); c.lineTo(x1, y); c.stroke(); c.setLineDash([]); c.globalAlpha = kk;
        c.fillStyle = NOTE; c.font = M.NUMF(19); c.textAlign = 'center'; c.shadowColor = 'rgba(0,0,30,0.8)'; c.shadowBlur = 4; c.fillText(qText(S.q), (a.x + b.x) / 2, y + 24); c.restore();
      }
    }
    ids.forEach((id, k) => {
      const b = M.box(g, id); if (!b || (id === 'q' && S.st === 0)) return; const r = Math.max(b.w, b.h) * 0.8, tw = 0.85 + 0.15 * Math.sin(t * 3 + k * 1.7);
      const gr = c.createRadialGradient(b.x, b.y, 0, b.x, b.y, r * tw); gr.addColorStop(0, 'rgba(255,240,190,0.45)'); gr.addColorStop(0.6, 'rgba(160,140,255,0.18)'); gr.addColorStop(1, 'rgba(120,100,255,0)');
      c.fillStyle = gr; c.beginPath(); c.arc(b.x, b.y, r * tw, 0, 7); c.fill();
      c.fillStyle = '#fff8d8'; for (let j = 0; j < 4; j++) { const an = j * Math.PI / 2 + t * 0.6 + k; c.beginPath(); c.arc(b.x + Math.cos(an) * r * 0.7, b.y + Math.sin(an) * r * 0.55, 1.6, 0, 7); c.fill(); }
    });
    // a shooting star now and then
    const sk = (t * 0.35) % 1; if (sk < 0.25) { const x = 320 - sk * 900, y = 60 + sk * 300; c.strokeStyle = 'rgba(255,255,230,0.7)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 40, y - 14); c.stroke(); }
    M.drawEx(g, c, 'seq'); M.drawEx(g, c, 'rat');
    M.drawUI(g, c);
  },
});
