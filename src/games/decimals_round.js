// decimals_round.js — ROUND! Rounding a decimal to a given place: look at the next digit.
// Glass panels in the desert hold one or two numbers. A small tag names the place to round to ("tenths") and underlines
// that digit. The player taps the deciding digit, the one just after the rounding place: a number line opens under the
// number, from the rounded-down value to the rounded-up value (the halfway value marked faintly), and a ball drops from
// the deciding digit onto the number's true position. The player rolls the ball to the nearer end (a drop anywhere on
// the nearer half counts). The working plays by itself: "6 ≥ 5" (or "4 < 5") writes itself under the deciding digit as
// the ball rolls; then the rounding digit rolls over like an odometer (a 9 rolls to 0 and a "+1" hops to the place on
// its left, which rolls too: 4.97 becomes 5.0), the dropped digits fall away, and the kept digits glide together and
// turn green (3.462 becomes 3.5). Rows can be done in either order.
// Level 0: one number, to the nearest tenth. Level 1: two numbers, to tenths, ones or hundredths.
// Level 2: two numbers, one where a 9 rounds up and carries (4.97 to 5.0), and deciding digits of 5.
// Medium mode: after the ball rolls, the player picks the rounded number from a tray.
const M = MK, INK = SCN.ink('glass'), TAG = '#d8702a', X0 = 62, X1 = 298, SZ = 54, STEP = 0.6; // STEP: seconds per rolled place
const rollLen = n => Math.max(0.35, (n - 1) * STEP + (n > 1 ? 0.46 : 0) + 0.4); // how long n rolled places take (in units of T)
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

function roundRow(g, R, T, build) {
  const kept = R.nodes.slice(0, R.keepEnd), drop = R.nodes.slice(R.keepEnd), k = R.k; g.sfx(R.up ? 'magic' : 'coin');
  // line the new digits up with the old ones from the right; a change rolls, right to left, one place per beat
  const ch = []; for (let j = 1; j <= k.length; j++) { const n = kept[kept.length - j], v = k[k.length - j]; if (!n) ch.push({ add: v }); else if (n.v !== v) ch.push({ n, v }); }
  ch.forEach((c, j) => M.at(g, [[j * STEP * T, g => {
    // a carried 1: a small "+1" lifts off the digit that rolled to 0 and hops onto the place to its left
    if (j > 0 && ch[j - 1].n) { M.indicate(g, ch[j - 1].n, { dur: 0.25 * T, sc: 1.15, col: '#c8501a' }); M.note(g, { node: M.row(M.op('+'), M.num(1)), at: ch[j - 1].n.id, off: [0, 34], s: 26, col: '#c8501a', write: 0.14 * T, hold: 0.08 * T, fly: 0.24 * T, arc: 26, to: (c.n || ch[j - 1].n).id, toOff: c.n ? [0, 34] : [-30, 34], s1: 24 }); }
    const go = g => { if (c.add) { const nn = M.num(c.add, `d${R.i}_n`, { col: '#1e7a4a' }); R.nodes.unshift(nn); R.keepEnd++; build(R); M.writeIn(g, nn, { dur: 0.22 * T }); M.sparkle(g, nn.id, { n: 8 }); }
      else { M.roll(g, c.n, c.v, { dur: 0.28 * T }); M.indicate(g, c.n, { dur: 0.32 * T, sc: 1.2, col: '#ffb21f' }); } g.sfx('tap'); };
    if (j > 0) M.at(g, [[0.46 * T, go]]); else go(g);
    g.s.mk.lastMove = g.t; }]]));
  if (!ch.length) M.indicate(g, R.tag, { dur: 0.35 * T, sc: 1.15, col: '#2a6ab0' }); // rounding down keeps the digit
  const t1 = rollLen(ch.length) * T;
  drop.forEach((n, j) => M.tween(g, n, { alpha: 0, dy: 14 }, 0.3 * T, { delay: t1 - 0.25 * T + j * 0.05 * T }));
  M.at(g, [[t1 + 0.12 * T, g => { R.nodes = R.nodes.slice(0, R.keepEnd); for (const n of R.nodes) { if (n.id) n.col = '#1e7a4a'; } R.done = g.t; build(R);
    M.inert(g, R.nodes.map(n => n.id).filter(Boolean)); g.burst(180, R.y - 6, ['#ffd45a', '#ff9a5a', '#fff'], 12, 120); g.sfx('ding'); g.s.mk.lastMove = g.t; }]]);
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
    const S = g.s, L = g.level; M.setup(g); const T = S.T = M.pace(g);
    const plan = L === 0 ? [[1]] : L === 1 ? [[[0, 1, 2][Math.floor(g.rand() * 3)]], [1]] : [[1, true], [Math.floor(g.rand() * 2), false, true]];
    S.R = plan.map(([q, carry, five], i) => ({ ...gen(g, q, carry, five), i, y: plan.length === 1 ? 286 : 236 + i * 170 }));
    if (L === 1 && g.rand() < 0.5) [S.R[0].y, S.R[1].y] = [S.R[1].y, S.R[0].y];
    g.dur *= (2.6 + 1.05 * 2 * S.R.length) / 8;
    // each row keeps the same digit nodes all the way through, so the rounding digit can roll over like an odometer
    // and the kept digits glide together when the dropped ones leave
    S.R.forEach(R => { const s = R.s = clean(R.m, R.d), dot = s.indexOf('.'); R.dot = dot;
      R.ri = dot < 0 ? s.length - 1 : R.q ? dot + R.q : dot - 1; R.di = R.q ? R.ri + 1 : R.ri + 2; R.keepEnd = R.q ? R.ri + 1 : dot < 0 ? s.length : dot;
      R.nodes = s.split('').map((ch, j) => ch === '.' ? M.num('.', 'pt' + R.i) : M.num(ch, `d${R.i}_${j}`, { col: j === R.ri ? TAG : undefined }));
      R.k = clean(R.up ? R.lo + 1 : R.lo, R.q); R.tag = R.nodes[R.ri]; });
    const build = R => { M.place(g, 'n' + R.i, M.row(...R.nodes), 180, R.y + 12, SZ, { col: INK }); M.inert(g, ['pt' + R.i]); };
    S.R.forEach(build);
    const ly = R => R.y + 82, hop = g => { g.s.mk.lastMove = g.t; };
    M.play(g, {
      moves(g) {
        const out = [];
        for (const R of S.R) {
          // 1. the deciding digit: it is circled, the number line between the two neighbours draws itself, and a ball
          //    drops from the digit to where the number really sits on the line
          if (!R.open) out.push({ tap: `d${R.i}_${R.di}`, busy: 0.1, then(g) { M.show(g, 0.95 * T); R.open = g.t + 0.15 * T; R.ballAt = g.t + 0.55 * T; g.sfx('pop'); hop(g);
            const dn = R.nodes[R.di]; M.circle(g, dn.id, { dur: 0.55 * T, col: TAG }); M.indicate(g, dn, { dur: 0.45 * T, col: TAG, sc: 1.25 });
            M.at(g, [[0.55 * T, g => g.sfx('tap')], [0.85 * T, g => { g.sfx('coin'); const x = X0 + R.frac * (X1 - X0); g.burst(x, ly(R) - 4, ['#ffe0a0', '#fff'], 6, 60); }]]);
            M.zone(g, 'ball' + R.i, { x: X0 + R.frac * (X1 - X0), y: ly(R) - 16, w: 40, h: 40 }); M.zone(g, 'lo' + R.i, { x: X0, y: ly(R) + 8, w: 64, h: 50 }); M.zone(g, 'hi' + R.i, { x: X1, y: ly(R) + 8, w: 64, h: 50 }); } });
          else if (!R.rolled) {
            const k = R.k, other = clean(R.up ? R.lo : R.lo + 1, R.q), cut = clean(Math.floor(R.m / 10 ** (R.d - R.q - 1)), R.q + 1);
            const nch = (() => { const kept = R.s.slice(0, R.keepEnd); let n = 0; for (let j = 1; j <= R.k.length; j++) if (kept[kept.length - j] !== R.k[R.k.length - j]) n++; return n; })(), after = (rollLen(nch) + 0.5) * T;
            out.push({ drag: 'ball' + R.i, to: (R.up ? 'hi' : 'lo') + R.i, busy: 0.1, area: R.up ? [180, ly(R) - 70, 350, ly(R) + 50] : [10, ly(R) - 70, 180, ly(R) + 50],
              askAt: 0.65 * T, after, ask: { v: M.num(k), wrong: [M.num(other), M.num(cut), M.num(clean(R.m, R.d))] },
              // 2. the ball rolls to the nearer end while "6 ≥ 5" (or "4 < 5") writes itself under the deciding digit
              then(g) { R.rolled = g.t; R.from = M.clamp(g.s.mk.dropX ?? (X0 + R.frac * (X1 - X0)), X0, X1); g.sfx('whoosh'); M.show(g, 0.65 * T); hop(g);
                const dv = +R.s[R.di], col = R.up ? '#c8501a' : '#2a6ab0';
                M.note(g, { node: M.row(M.num(dv), M.op(R.up ? '≥' : '<'), M.num(5)), at: `d${R.i}_${R.di}`, off: [0, 46], s: 26, col, write: 0.3 * T, hold: 0.7 * T, fade: 0.25 * T });
                M.at(g, [[0.55 * T, g => { const x = R.up ? X1 : X0; g.burst(x, ly(R) - 14, ['#ffd45a', '#fff'], 8, 90); g.sfx('tap'); }]]); },
              // 3. the rounding digit rolls over (a 9 rolls to 0 and carries a 1 into the place on its left), the dropped
              //    digits fall away, and the kept digits glide together and turn green
              resolve(g) { M.show(g, after); roundRow(g, R, T, build); } });
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
      const rb = M.box(g, R.tag.id);
      if (rb) { c.save(); c.font = '800 15px Nunito, system-ui, sans-serif'; const w = c.measureText(PLACE[R.q]).width + 16, tx = M.clamp(rb.x, 30 + w / 2, 330 - w / 2);
        c.fillStyle = TAG; c.beginPath(); c.roundRect(tx - w / 2, rb.y - rb.h / 2 - 30, w, 22, 11); c.fill(); c.beginPath(); c.moveTo(rb.x - 6, rb.y - rb.h / 2 - 9); c.lineTo(rb.x + 6, rb.y - rb.h / 2 - 9); c.lineTo(rb.x, rb.y - rb.h / 2 - 2); c.fill();
        c.fillStyle = '#fff'; c.textAlign = 'center'; c.fillText(PLACE[R.q], tx, rb.y - rb.h / 2 - 14); c.restore(); }
      M.drawEx(g, c, 'n' + R.i);
      if (!R.open) continue;
      // the number line between the two neighbours, its halfway tick, and the ball at the true value
      const k = M.ease((t - R.open) / (0.35 * S.T)), y = R.y + 82, xm = (X0 + X1) / 2; if (k <= 0) continue;
      c.save(); c.globalAlpha = k; c.strokeStyle = INK; c.lineWidth = 4; c.lineCap = 'round';
      c.beginPath(); c.moveTo(xm - (xm - X0) * k, y); c.lineTo(xm + (X1 - xm) * k, y); c.stroke();
      for (const [x, h] of [[X0, 12], [X1, 12], [xm, 6]]) { c.beginPath(); c.moveTo(x, y - h); c.lineTo(x, y + h); c.stroke(); }
      c.font = M.NUMF(22); c.textAlign = 'center'; c.fillStyle = INK;
      c.fillText(clean(R.lo, R.q), X0, y + 34); c.fillText(clean(R.lo + 1, R.q), X1, y + 34);
      c.font = M.NUMF(15); c.globalAlpha = 0.55 * k; c.fillText(clean(R.lo * 10 + 5, R.q + 1), xm, y + 30); c.globalAlpha = k; // the halfway mark
      const pr = Mk.press && Mk.press.dragging && Mk.press.id === 'ball' + R.i ? Mk.press : null, home = X0 + R.frac * (X1 - X0), end = R.up ? X1 : X0;
      const rk = R.rolled ? M.easeIO((t - R.rolled) / (0.55 * S.T)) : 0, bx = pr ? M.clamp(pr.x, X0, X1) : R.rolled ? M.lerp(R.from, end, rk) : home;
      if (!R.rolled) { c.globalAlpha = 0.35 * k; c.beginPath(); c.arc(home, y, 4, 0, 7); c.fillStyle = TAG; c.fill(); }
      // the ball drops from the deciding digit onto its true place on the line, with a little bounce
      let by = y - 15; const dk = (t - R.ballAt) / (0.3 * S.T); if (dk < 0) { c.restore(); continue; }
      if (dk < 1 && !R.rolled) { const db = M.box(g, `d${R.i}_${R.di}`), sx = db ? db.x : home, sy = db ? db.y + 18 : y - 60, e = M.easeIO(dk);
        by = M.lerp(sy, y - 15, e * e) - Math.sin(Math.min(1, dk * 1.3) * Math.PI) * 10; }
      else if (dk < 1.6 && !R.rolled) by = y - 15 - Math.abs(Math.sin((dk - 1) / 0.6 * Math.PI)) * 6 * (1.6 - dk);
      const bxx = dk < 1 && !R.rolled ? M.lerp((M.box(g, `d${R.i}_${R.di}`) || { x: home }).x, home, M.easeIO(dk)) : bx;
      c.globalAlpha = 1; const gr = c.createRadialGradient(bxx - 4, by - 5, 2, bxx, by, 14); gr.addColorStop(0, '#ffe0a0'); gr.addColorStop(1, '#e0602a');
      c.fillStyle = gr; c.beginPath(); c.arc(bxx, by, 13, 0, 7); c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2; c.beginPath(); c.arc(bxx, by, 8, bxx / 13, bxx / 13 + 2); c.stroke(); // it spins as it rolls
      c.restore();
    }
    M.drawUI(g, c);
  },
});
