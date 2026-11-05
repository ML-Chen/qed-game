// ratios_percent.js — PERCENT! "25% of 80": drag the 25% onto the 80. The problem rewrites itself in place as
// 25/100 × 80, and a bar of 100 squares (the whole 80) shades 25 of its squares. Tapping 25/100 × 80 computes it: 20.
// Level 0: 10%, 25% or 50% of a small number. Level 1: 10–75%. Level 2: 5%, 15%, 35%, ... of numbers up to 400.
// Medium mode: the tap on the product opens the tray.
const M = MK, INK = SCN.ink('chalk'), PC = '#ffd970';
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  const ps = L === 0 ? [10, 25, 50] : L === 1 ? [20, 25, 75, 10, 40] : [15, 30, 35, 60, 75, 5];
  const p = ps[r(ps.length)], unit = 100 / gcd(p, 100), ws = [];
  for (let w = unit; w <= (L === 0 ? 120 : 400); w += unit) { const v = p * w / 100; if (w >= 20 && w !== 100 && v >= 2 && v <= 60) ws.push(w); }
  const w = ws[r(ws.length)]; return { p, w, v: p * w / 100 };
}
function build(g) {
  const S = g.s, pp = id => ({ pop: S.pops[id] });
  const node = S.st === 0 ? M.row(M.num(S.p + '%', 'pc', { col: PC }), M.txt(' of ', 'of'), M.num(S.w, 'w'))
    : S.st === 1 ? Object.assign(M.row(M.frac(M.num(S.p, null, { col: PC }), M.num(100)), M.op('×'), M.num(S.w)), { id: 'calc', ...pp('calc') })
    : M.num(S.v, 'res', { col: PC, ...pp('res') });
  M.place(g, 'ex', node, 180, 246, S.st === 2 ? 64 : 48, { col: INK });
}
// the bar: 100 squares in 5 rows of 20, shaded column by column, so p squares cover p% of its length
const BX = 30, BY = 290, SQ = 15;
function drawBar(g, c, S) {
  const t = g.t, n = S.shadeAt == null ? 0 : Math.round(S.p * M.clamp((t - S.shadeAt) / 0.3, 0, 1)), done = S.st === 2, pk = done ? M.clamp((t - S.pops.res) / 0.35, 0, 1) : 1;
  for (let col = 0; col < 20; col++) for (let rw = 0; rw < 5; rw++) {
    const i = col * 5 + rw, x = BX + col * SQ, y = BY + rw * SQ, on = i < n, sw = on && done ? 1 + Math.sin(pk * Math.PI) * 0.2 : 1, h = (SQ - 3) * sw;
    c.fillStyle = on ? (done ? '#ffe680' : 'rgba(255,217,112,0.85)') : 'rgba(255,255,255,0.06)'; c.fillRect(x + SQ / 2 - h / 2, y + SQ / 2 - h / 2, h, h);
    c.strokeStyle = 'rgba(251,248,238,0.55)'; c.lineWidth = 1.2; c.strokeRect(x + 1.5, y + 1.5, SQ - 3, SQ - 3);
  }
  // the whole bar stands for the number; the shaded part's end gets its value once it is computed
  c.font = M.NUMF(15); c.textAlign = 'center'; c.fillStyle = 'rgba(251,248,238,0.8)';
  c.fillText('0', BX, BY + 5 * SQ + 18); c.fillText(String(S.w), BX + 20 * SQ, BY + 5 * SQ + 18);
  if (done) { c.fillStyle = PC; c.fillText(String(S.v), BX + S.p / 5 * SQ, BY + 5 * SQ + 18); }
  c.strokeStyle = 'rgba(251,248,238,0.7)'; c.lineWidth = 1.5; c.beginPath();
  for (const x of [BX, BX + 20 * SQ].concat(done ? [BX + S.p / 5 * SQ] : [])) { c.moveTo(x, BY + 5 * SQ + 1); c.lineTo(x, BY + 5 * SQ + 5); } c.stroke();
}

MG.add({
  id: 'ratios_percent', stage: 'ratios', cmd: 'PERCENT!', hint: 'drag', time: 8, mood: 'bright', winText: 'Percent!', hold: 1.4,
  card: {
    title: 'Percent of a number', ref: 'Grade 6', kind: 'Ratios and percents',
    text: 'Percent means "out of 100". So 25% means 25 out of every 100, which is the fraction 25/100.\n\nTo find a percent of a number, write the percent as a fraction over 100 and multiply it by the number. Here the word "of" means multiply. For example, 25% of 80 is 25/100 × 80 = 2000/100 = 20.\n\nTo see why, picture a bar cut into 100 equal squares that stands for the whole 80. Shading 25 of the 100 squares shades one quarter of the bar, and one quarter of 80 is 20.',
    note: 'p% of a number is p/100 × the number. For example, 25% of 80 = 25/100 × 80 = 20.',
    ask: 'What is 10% of 70? What is 50% of 36?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.st = 0; S.pops = {}; S.shadeAt = null;
    build(g); M.inert(g, ['of']);
    g.dur *= (2.6 + 1.05 * 2) / 8;
    M.play(g, {
      moves(g) {
        // drag the percent onto the number: p% of w is written as p/100 × w, and the bar shades p squares
        if (S.st === 0) return [{ drag: 'pc', to: 'w', busy: 0.1, then(g) { S.st = 1; S.pops.calc = g.t; S.shadeAt = g.t; g.sfx('sweep'); build(g); } }];
        // tap the product to compute it
        if (S.st === 1) return [{ tap: 'calc', busy: 0.1, askAt: 0, after: 0.1, ask: { v: S.v, wrong: [S.v * 10, S.w - S.p, S.v + 5, S.p, Math.round(S.w / 4)] },
          then() {}, resolve(g) { S.st = 2; S.pops.res = g.t; g.sfx('coin'); build(g); const b = M.box(g, 'res'); if (b) g.burst(b.x, b.y, ['#ffd970', '#fff', '#9ae07a'], 12, 130); } }];
        return [];
      },
      area(g) { return S.st === 0 ? ['pc', 'w'] : ['calc']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s;
    SCN.std(g, c, { scene: 'library', panel: 'chalk', panelY: 286, panelH: 220, host: 'owl', hostX: 296, hostY: 600, hostS: 1.4 });
    drawBar(g, c, S); M.drawEx(g, c, 'ex'); M.drawUI(g, c);
  },
});
