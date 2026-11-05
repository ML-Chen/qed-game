// ratios_change.js — PERCENT CHANGE! "40 → 50": drag the new value onto the old one. The problem rewrites itself in
// place as (50 − 40)/40, the change over the old value. A tap simplifies it to 1/4, and a second tap writes it as a
// percent: 25% increase. Two bars on the sign show the old and the new amount, with the change lit up.
// Level 0: increases by 1/2, 1/4, 1/5 or 1/10. Level 1: more fractions (3/4, 2/5, 3/5, 3/10). Level 2: decreases too.
// Medium mode: both taps open the tray (wrong tiles: dividing by the new value, the flipped fraction, the wrong sign).
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
function build(g) {
  const S = g.s, pp = id => ({ pop: S.pops[id] });
  const node = S.st === 0 ? M.row(M.num(S.old, 'o'), M.op('→', 'ar'), M.num(S.nw, 'nw', { col: NEWC }))
    : S.st === 1 ? M.frac(M.row(M.num(S.nw, null, { col: NEWC }), M.op('-'), M.num(S.old)), M.num(S.old), 'q', pp('q'))
    : S.st === 2 ? M.frac(M.num(S.fn), M.num(S.fd), 'f', pp('f'))
    : M.row(M.num(S.pct + '%', 'res', { col: NEWC, ...pp('res') }), M.txt(S.dec ? ' decrease' : ' increase', 'word'));
  M.place(g, 'ex', node, 180, S.st === 0 || S.st === 3 ? 262 : 252, S.st === 0 ? 56 : S.st === 3 ? 40 : 50, { col: INK });
}
// the old and the new amount as two planks; the change is the part that sticks out (or is missing)
function drawBars(g, c, S) {
  const t = g.t, sc = 230 / Math.max(S.old, S.nw), x0 = 70, k = S.st >= 1 ? M.ease((t - S.pops.q) / 0.3) : 0;
  const bar = (y, v, col, lab) => { c.fillStyle = 'rgba(30,15,5,0.35)'; c.fillRect(x0 + 2, y + 3, v * sc, 16); c.fillStyle = col; c.fillRect(x0, y, v * sc, 16);
    c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(x0, y + 2, v * sc, 3); c.font = M.NUMF(16); c.textAlign = 'right'; c.fillStyle = lab; c.fillText(String(v), x0 - 8, y + 14); };
  bar(318, S.old, '#e8d0a0', INK); bar(346, S.nw, '#f0c060', NEWC);
  if (k > 0) {
    const a = x0 + Math.min(S.old, S.nw) * sc, b = x0 + Math.max(S.old, S.nw) * sc, y = 346;
    c.save(); c.globalAlpha = k; c.strokeStyle = S.dec ? '#ff9a8a' : '#9af07a'; c.lineWidth = 3; c.setLineDash(S.dec ? [5, 4] : []);
    c.strokeRect(a, y - 2, b - a, 20); if (S.dec) { c.fillStyle = 'rgba(255,120,100,0.25)'; c.fillRect(a, y, b - a, 16); } else { c.fillStyle = 'rgba(150,240,120,0.45)'; c.fillRect(a, y, b - a, 16); }
    c.setLineDash([]); c.lineWidth = 2; c.strokeStyle = 'rgba(255,244,220,0.5)'; c.beginPath(); c.moveTo(x0 + S.old * sc, 312); c.lineTo(x0 + S.old * sc, 368); c.stroke(); c.restore();
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
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.st = 0; S.pops = {};
    build(g); M.inert(g, ['ar', 'word']);
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const burst = id => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, ['#ffd970', '#fff', '#9ae07a'], 12, 130); };
    const ch = S.nw - S.old, gn = gcd(Math.abs(ch), S.nw);
    M.play(g, {
      moves(g) {
        // drag the new value onto the old one: (new − old) / old
        if (S.st === 0) return [{ drag: 'nw', to: 'o', busy: 0.1, then(g) { S.st = 1; S.pops.q = g.t; g.sfx('whoosh'); build(g); } }];
        // tap the fraction: subtract and simplify
        if (S.st === 1) return [{ tap: 'q', busy: 0.1, askAt: 0, after: 0.1, ask: { v: F(S.fn, S.fd), wrong: [F(ch / gn, S.nw / gn), F(S.fd * Math.sign(S.fn), Math.abs(S.fn)), F(-S.fn, S.fd)] },
          then() {}, resolve(g) { S.st = 2; S.pops.f = g.t; g.sfx('coin'); build(g); burst('f'); } }];
        // tap the simplified fraction: write it as a percent
        if (S.st === 2) return [{ tap: 'f', busy: 0.1, askAt: 0, after: 0.1, ask: { v: M.num(S.pct + '%'), wrong: [M.num(Math.round(Math.abs(ch) * 100 / S.nw) + '%'), M.num(100 - S.pct + '%'), M.num(Math.abs(ch) + '%')] },
          then() {}, resolve(g) { S.st = 3; S.pops.res = g.t; g.sfx('coin'); build(g); burst('res'); } }];
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
    SCN.std(g, c, { scene: 'desert', panel: 'sign', panelY: 290, panelH: 200, host: 'beaver', hostX: 290, hostY: 600, hostS: 1.4 });
    drawBars(g, c, S); M.drawEx(g, c, 'ex'); M.drawUI(g, c);
  },
});
