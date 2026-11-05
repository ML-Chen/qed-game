// decimals_round.js — ROUND! Rounding a decimal to a given place: look at the next digit.
// Glass panels in the desert hold one or two numbers. A small tag names the place to round to ("tenths") and underlines
// that digit. The player taps the deciding digit, the one just after the rounding place: a number line opens under the
// number, from the rounded-down value to the rounded-up value, with a ball sitting at the number's true position.
// The player rolls the ball to the nearer end (a drop anywhere on the nearer half counts): the rounding digit changes
// in place (3.462 becomes 3.5) and the dropped digits fade. Rows can be done in either order.
// Level 0: one number, to the nearest tenth. Level 1: two numbers, to tenths, ones or hundredths.
// Level 2: two numbers, one where a 9 rounds up and carries (4.97 to 5.0), and deciding digits of 5.
// Medium mode: after the ball rolls, the player picks the rounded number from a tray.
const M = MK, INK = SCN.ink('glass'), TAG = '#d8702a', X0 = 62, X1 = 298, SZ = 54;
const clean = (m, d) => d <= 0 ? String(m) + '0'.repeat(-d) : (s => s.slice(0, -d) + '.' + s.slice(-d))(String(m).padStart(d + 1, '0'));
const PLACE = ['ones', 'tenths', 'hundredths'], WORD = ['the nearest whole number', 'the nearest tenth', 'the nearest hundredth'];
function gen(g, q, carry, five) {
  const r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (let tries = 0; ; tries++) {
    const d = q + 1 + (g.rand() < 0.5 ? 1 : 0), unit = 10 ** (d - q), m = r(10 ** d + 1, 10 ** (d + 1) - 1);
    if (m % 10 === 0) continue; const lo = Math.floor(m / unit), rem = m % unit, dec = Math.floor(rem / (unit / 10)), up = rem * 2 > unit;
    if (rem * 2 === unit || (dec === 5) !== !!five && tries < 400) continue;
    if (carry !== (up && lo % 10 === 9) && tries < 400) continue;
    return { m, d, q, unit, lo, rem, up, frac: rem / unit };
  }
}

MG.add({
  id: 'decimals_round', stage: 'decimals', cmd: 'ROUND!', hint: 'tap', time: 8, mood: 'bright', winText: 'Rounded!', hold: 1.4,
  card: {
    title: 'Rounding decimals', ref: 'Grade 5', kind: 'Decimals',
    text: 'Rounding replaces a number with a simpler one that is close to it. To round 3.462 to the nearest tenth, ask which of the two tenths next to it is closer: 3.4 or 3.5.\n\nYou only need to look at the next digit, the one just after the tenths place. Here it is 6. If the next digit is 5 or more, the number is past the halfway point 3.45, so round up to 3.5. If it is 4 or less, round down and keep the digit. The digits after the rounding place are dropped.\n\nWhen a 9 rounds up, it carries like in addition: 4.97 to the nearest tenth is 5.0.',
    note: 'Look at the digit just after the rounding place. 5 or more rounds up; 4 or less rounds down.',
    ask: 'Round 7.38 to the nearest tenth. Round 12.5 to the nearest whole number.',
  },
  init(g) {
    const S = g.s, L = g.level; M.setup(g);
    const plan = L === 0 ? [[1]] : L === 1 ? [[[0, 1, 2][Math.floor(g.rand() * 3)]], [1]] : [[1, true], [Math.floor(g.rand() * 2), false, true]];
    S.R = plan.map(([q, carry, five], i) => ({ ...gen(g, q, carry, five), i, y: plan.length === 1 ? 286 : 236 + i * 170 }));
    if (L === 1 && g.rand() < 0.5) [S.R[0].y, S.R[1].y] = [S.R[1].y, S.R[0].y];
    g.dur *= (2.6 + 1.05 * 2 * S.R.length) / 8;
    const build = R => {
      const s = clean(R.m, R.d), dot = s.indexOf('.'), ri = dot < 0 ? s.length - 1 : R.q ? dot + R.q : dot - 1, di = R.q ? ri + 1 : ri + 2;
      R.ri = ri; R.di = di;
      let items;
      if (!R.done) items = s.split('').map((ch, j) => ch === '.' ? M.num('.', 'pt' + R.i) : M.num(ch, `d${R.i}_${j}`, { col: j === ri ? TAG : undefined, pop: j === di ? R.open : null }));
      else { const k = clean(R.up ? R.lo + 1 : R.lo, R.q), rest = s.slice(R.q ? ri + 1 : dot < 0 ? s.length : dot);
        items = [...k.split('').map((ch, j) => M.num(ch, `k${R.i}_${j}`, { pop: R.done, col: '#1e7a4a' })), ...rest.split('').map(ch => M.num(ch, null, { alpha: 0.2, dy: 6 }))]; }
      const e = M.place(g, 'n' + R.i, M.row(...items), 180, R.y + 12, SZ, { col: INK });
      M.inert(g, ['pt' + R.i, ...items.map(n => n.id).filter(id => id && id[0] === 'k')]);
      return e;
    };
    S.R.forEach(build);
    const ly = R => R.y + 82;
    M.play(g, {
      moves(g) {
        const out = [];
        for (const R of S.R) {
          if (!R.open) out.push({ tap: `d${R.i}_${R.di}`, busy: 0.1, then(g) { R.open = g.t; g.sfx('pop'); build(R);
            M.zone(g, 'ball' + R.i, { x: X0 + R.frac * (X1 - X0), y: ly(R) - 16, w: 40, h: 40 }); M.zone(g, 'lo' + R.i, { x: X0, y: ly(R) + 8, w: 64, h: 50 }); M.zone(g, 'hi' + R.i, { x: X1, y: ly(R) + 8, w: 64, h: 50 }); } });
          else if (!R.rolled) {
            const k = clean(R.up ? R.lo + 1 : R.lo, R.q), other = clean(R.up ? R.lo : R.lo + 1, R.q), cut = clean(Math.floor(R.m / 10 ** (R.d - R.q - 1)), R.q + 1);
            out.push({ drag: 'ball' + R.i, to: (R.up ? 'hi' : 'lo') + R.i, busy: 0.1, area: R.up ? [180, ly(R) - 70, 350, ly(R) + 50] : [10, ly(R) - 70, 180, ly(R) + 50],
              ask: { v: M.num(k), wrong: [M.num(other), M.num(cut), M.num(clean(R.m, R.d))] },
              then(g) { R.rolled = g.t; R.from = M.clamp(g.s.mk.dropX ?? (X0 + R.frac * (X1 - X0)), X0, X1); g.sfx('whoosh'); },
              resolve(g) { R.done = g.t; build(R); g.sfx(R.up ? 'magic' : 'coin'); const b = M.box(g, 'n' + R.i); g.burst(180, R.y - 6, ['#ffd45a', '#ff9a5a', '#fff'], 12, 120); } });
          }
        }
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [m.tap || m.drag] : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { g.s.mk.dropX = x; M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, Mk = S.mk, t = g.t;
    SCN.bg(g, c, 'desert');
    for (const R of S.R) SCN.panel(c, 'glass', 180, R.y + 34, 324, 150, t);
    SCN.host(g, c, 'turtle', 66, 612, 1.15);
    for (const R of S.R) {
      // the tag naming the place to round to, over its digit
      const rb = M.box(g, R.done ? `k${R.i}_${R.ri}` : `d${R.i}_${R.ri}`);
      if (rb) { c.save(); c.font = '800 15px Nunito, system-ui, sans-serif'; const w = c.measureText(PLACE[R.q]).width + 16, tx = M.clamp(rb.x, 30 + w / 2, 330 - w / 2);
        c.fillStyle = TAG; c.beginPath(); c.roundRect(tx - w / 2, rb.y - rb.h / 2 - 30, w, 22, 11); c.fill(); c.beginPath(); c.moveTo(rb.x - 6, rb.y - rb.h / 2 - 9); c.lineTo(rb.x + 6, rb.y - rb.h / 2 - 9); c.lineTo(rb.x, rb.y - rb.h / 2 - 2); c.fill();
        c.fillStyle = '#fff'; c.textAlign = 'center'; c.fillText(PLACE[R.q], tx, rb.y - rb.h / 2 - 14); c.restore(); }
      M.drawEx(g, c, 'n' + R.i);
      if (!R.open) continue;
      // the number line between the two neighbours, its halfway tick, and the ball at the true value
      const k = M.ease((t - R.open) / 0.25), y = R.y + 82, xm = (X0 + X1) / 2;
      c.save(); c.globalAlpha = k; c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = 'round';
      c.beginPath(); c.moveTo(xm - (xm - X0) * k, y); c.lineTo(xm + (X1 - xm) * k, y); c.stroke();
      for (const [x, h] of [[X0, 12], [X1, 12], [xm, 6]]) { c.beginPath(); c.moveTo(x, y - h); c.lineTo(x, y + h); c.stroke(); }
      c.font = M.NUMF(22); c.textAlign = 'center'; c.fillStyle = INK;
      c.fillText(clean(R.lo, R.q), X0, y + 34); c.fillText(clean(R.lo + 1, R.q), X1, y + 34);
      const pr = Mk.press && Mk.press.dragging && Mk.press.id === 'ball' + R.i ? Mk.press : null, home = X0 + R.frac * (X1 - X0), end = R.up ? X1 : X0;
      const bx = pr ? M.clamp(pr.x, X0, X1) : R.rolled ? M.lerp(R.from, end, M.ease((t - R.rolled) / 0.25)) : home;
      if (!R.rolled) { c.globalAlpha = 0.35 * k; c.beginPath(); c.arc(home, y, 4, 0, 7); c.fillStyle = TAG; c.fill(); }
      c.globalAlpha = k; const gr = c.createRadialGradient(bx - 4, y - 20, 2, bx, y - 15, 14); gr.addColorStop(0, '#ffe0a0'); gr.addColorStop(1, '#e0602a');
      c.fillStyle = gr; c.beginPath(); c.arc(bx, y - 15, 13, 0, 7); c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2; c.beginPath(); c.arc(bx, y - 15, 8, bx / 13, bx / 13 + 2); c.stroke();
      c.restore();
    }
    M.drawUI(g, c);
  },
});
