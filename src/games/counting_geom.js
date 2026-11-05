// counting_geom.js — GEOMETRIC SEQ! Find the common ratio of a geometric sequence and use it.
// Deep space: the terms glow as stars of a constellation, with an owl watching from the planet below. The player drags one
// term onto the next term: the division "6 ÷ 2" appears above that gap and becomes the ratio "× 3" (medium mode: picked
// from the tray), and the constellation lines light up, each labelled × 3. Then the player drags the × 3 onto the last
// term (or the empty slot): the slot reads "18 × 3", and a tap on it makes 54.
// Level 0: ratio 2 or 3. Level 1: ratio 2–4. Level 2: a negative ratio, or the ratio ½ (the terms shrink).
const M = MK, INK = '#fff6e0';
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  if (L === 0) return { a: 1 + r(3), q: 2 + r(2) };
  if (L === 1) return { a: 1 + r(3), q: 2 + r(3) };
  return g.rand() < 0.5 ? { a: 1 + r(3), q: -(2 + r(2)) } : { a: [48, 64, 80, 96][r(4)], q: 0.5 };
}
const half = q => q === 0.5;
const qNode = q => half(q) ? M.frac(M.num(1), M.num(2)) : q < 0 ? M.paren(M.num(q)) : M.num(q);
const qTile = q => half(q) ? M.frac(M.num(1), M.num(2)) : q;
const qText = q => '× ' + (half(q) ? '½' : q < 0 ? '(−' + -q + ')' : q);

MG.add({
  id: 'counting_geom', stage: 'counting', cmd: 'GEOMETRIC SEQ!', hint: 'drag', time: 9, mood: 'night', winText: 'Stellar!', hold: 1.4,
  card: {
    title: 'Geometric sequences', ref: 'Grade 10 and up', kind: 'Sequences',
    text: 'In a geometric sequence, you get each term by multiplying the term before it by the same number. That number is called the common ratio.\n\nTo find the common ratio, divide any term by the term before it. In 2, 6, 18, the ratio is 6 ÷ 2 = 3, so the next term is 18 × 3 = 54.\n\nThe ratio can be a fraction, which makes the terms shrink: in 80, 40, 20, the ratio is ½. It can also be negative, which makes the signs flip back and forth: 3, −6, 12 has the ratio −2.\n\nTerm number n is the first term times the ratio n − 1 times, which is a₁ · rⁿ⁻¹.',
    note: 'Divide a term by the term before it to get the common ratio r. Multiply the last term by r to get the next term.',
    ask: 'What comes after 5, 10, 20? What is the ratio of 81, 27, 9, and what comes next?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a, q } = S;
    S.T = [0, 1, 2].map(i => a * Math.pow(q, i)); S.next = S.T[2] * q;
    S.found = -1; S.qShown = false; S.st = 0; g.dur *= (2.6 + 1.05 * 3) / 8;
    S.build = () => {
      const items = [], pop = { pop: g.t };
      S.T.forEach((v, i) => { if (i) items.push(M.op(',', 'c' + i), M.gap(14)); items.push(M.num(v, 't' + i)); });
      const fill = [null, M.row(M.num(S.T[2], null, pop), M.op('×'), qNode(q)), M.num(S.next, null, pop)][S.st];
      items.push(M.op(',', 'c3'), M.gap(14), M.slot('q', { fill }));
      M.place(g, 'seq', M.row(...items), 180, 320, 42, { col: INK });
    };
    S.build(); M.inert(g, ['c1', 'c2', 'c3', 'dd']);
    const showRatio = (g, node) => { const b0 = M.box(g, 't' + S.found), b1 = M.box(g, 't' + (S.found + 1)); M.place(g, 'rat', node, (b0.x + b1.x) / 2, b0.y - b0.h / 2 - 34, 30, { col: '#bfe8ff' }); };
    M.play(g, {
      moves(g) {
        if (S.found < 0) {
          const out = [];
          for (let i = 0; i < 2; i++) for (const [p, k] of [[i, i + 1], [i + 1, i]]) out.push({
            drag: 't' + p, to: 't' + k, busy: 0.1,
            ask: { v: qTile(q), wrong: half(q) ? [2, -S.T[1], M.frac(M.num(1), M.num(4))] : [S.T[i + 1] - S.T[i], -q, q + 1, S.T[i + 1]] },
            then(g) { S.found = i; const dd = M.row(M.num(S.T[i + 1]), M.op('÷'), M.num(S.T[i])); dd.id = 'dd'; showRatio(g, dd); g.sfx('whoosh'); },
            resolve(g) { const s = M.row(M.op('×'), qNode(q)); s.id = 'r'; s.pop = g.t; showRatio(g, s); S.qShown = true; S.qAt = g.t; g.sfx('sparkle'); },
          });
          return out;
        }
        if (S.st === 0) return [{ drag: 'r', to: ['t2', 'q'], busy: 0.1, then(g) { S.st = 1; M.node(g, 'r').hide = true; S.build(); g.sfx('pop'); } }];
        if (S.st === 1) return [{ tap: 'q', busy: 0.1, ask: { v: S.next, wrong: [S.T[2] + q, -S.next, S.next * q, S.T[2] * 2 === S.next ? S.T[2] + 1 : S.T[2] * 2] }, then() {}, resolve(g) { S.st = 2; S.build(); g.sfx('coin'); } }];
        return [];
      },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    SCN.std(g, c, { scene: 'space', panel: 'none', host: 'owl', hostX: 84, hostY: 520, hostS: 1.2 });
    // each term glows as a star; once the ratio is known, constellation lines join them, labelled with the ratio
    const ids = ['t0', 't1', 't2', 'q'];
    if (S.qShown) {
      const n = S.st > 0 ? 3 : 2;
      for (let k = 0; k < n; k++) {
        const a = M.box(g, ids[k]), b = M.box(g, ids[k + 1]); if (!a || !b) continue; const kk = M.ease((t - S.qAt - k * 0.08) / 0.3); if (kk <= 0) continue;
        const y = a.y + a.h / 2 + 22, x1 = M.lerp(a.x, b.x, kk);
        c.save(); c.strokeStyle = 'rgba(190,232,255,0.8)'; c.lineWidth = 2; c.setLineDash([2, 6]); c.lineCap = 'round';
        c.beginPath(); c.moveTo(a.x, y); c.lineTo(x1, y); c.stroke(); c.setLineDash([]); c.globalAlpha = kk;
        c.fillStyle = '#bfe8ff'; c.font = M.NUMF(16); c.textAlign = 'center'; c.fillText(qText(S.q), (a.x + b.x) / 2, y + 22); c.restore();
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
