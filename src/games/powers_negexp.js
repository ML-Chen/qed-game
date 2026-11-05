// powers_negexp.js — NEGATIVE EXP! A negative exponent moves its power across the fraction bar: x⁻ⁿ = 1/xⁿ, 1/x⁻ⁿ = xⁿ.
// The player drags each power with a negative exponent across the fraction bar (anywhere on the other side counts).
// The working plays by itself: the negative exponent glows, the power glides across (a bar draws itself and a 1 writes
// itself on top if needed), and as it lands its minus sign flicks off and the exponent turns positive. Before there is a fraction, a dashed bar and slot wait under the expression.
// Level 0: x⁻³. Level 1: 2x⁻³ (only the power moves; the 2 stays). Level 2: a/b⁻² (flips up) or x⁻²/y⁻³ (both move).
// No arithmetic happens, so medium mode plays the same as easy mode.
const M = MK, INK = SCN.ink('sign'), NEG = '#ffb0a0', POS = '#b8f0a0', HX = 288, HY = 590;
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), n = () => 2 + r(4), v = () => ['x', 'y', 'a'][r(3)];
  if (L === 0) return { top: [{ b: v(), e: -n() }], bot: [] };
  if (L === 1) return { top: [{ b: String(2 + r(4)) }, { b: v(), e: -n() }], bot: [] };
  if (g.rand() < 0.5) return { top: [{ b: 'a' }], bot: [{ b: 'b', e: -n() }] };
  return { top: [{ b: 'x', e: -n() }], bot: [{ b: 'y', e: -n() }] };
}
// each part keeps its nodes for the whole game, so it glides across the bar instead of popping; a negative exponent is
// written as its own minus sign and digits, so the minus can flick off when the power crosses the bar
// (the wrappers are made fresh on every layout: only the leaf symbols glide, so nested glides never add up)
function mkPart(p) {
  p.base = /\d/.test(p.b) ? M.num(p.b) : M.vr(p.b);
  if (p.e != null) { p.mn = M.num('-', null, { col: NEG }); p.en = M.num(-p.e, null, { col: NEG }); }
}
function partNode(p) {
  if (p.e == null) { p.base.id = 'p' + p.u; return p.base; }
  p.ex = M.row(p.e < 0 || p.moving ? p.mn : null, p.en); p.ex.id = 'xe' + p.u; return M.sup(p.base, p.ex, 'p' + p.u);
}
function build(g, fresh) {
  const S = g.s, top = S.parts.filter(p => !p.down), bot = S.parts.filter(p => p.down), was = S.isFrac, oldBar = was ? { ...M.box(g, 'bar') } : null;
  const T = top.length ? M.row(...top.map(partNode)) : S.one;
  S.isFrac = bot.length > 0;
  const node = S.isFrac ? M.frac(T, M.row(...bot.map(partNode)), 'bar', fresh && !was ? { bar: { t0: g.t, dur: 0.32 * M.pace(g) } } : {}) : T;
  const e = M.place(g, 'ex', node, 180, S.isFrac ? 318 : 272, S.isFrac ? 70 : 60, { col: INK });
  if (fresh && !top.length && !S.oneShown) { S.oneShown = true; M.writeIn(g, S.one, { delay: 0.12 * M.pace(g), dur: 0.3 * M.pace(g) }); }
  if (top.length) S.oneShown = false;
  // the bottom has emptied: the old fraction bar shrinks away
  if (fresh && was && !S.isFrac && oldBar && oldBar.w) { const d = 0.3 * M.pace(g); M.anim(g, { dur: d, draw(c, g, k) { const w = oldBar.w * (1 - M.easeIO(k)); c.globalAlpha = 1 - k; c.fillStyle = INK; c.fillRect(oldBar.x - w / 2, oldBar.y - 2.5, w, 5); } }); }
  // where the fraction bar is (or will be): drops below it go down, drops above it go up
  const bs = S.parts.map(p => M.box(g, 'p' + p.u)).filter(Boolean);
  S.barY = S.isFrac ? e.y - e.s * 0.3 : Math.max(...bs.map(b => b.y + b.h / 2)) + 14;
  const plain = !S.isFrac && S.parts.some(p => p.e < 0 && !(p.moving && !p.down));
  M.zone(g, 'slot', { x: 180, y: S.barY + 32, w: 80, h: 46 }); g.s.mk.zones.slot = plain;
}
// the owl hops on each beat and points at the board while the work is shown
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };
function host(g, c) {
  const S = g.s, mk = S.mk, hk = mk.lastMove != null && g.t - mk.lastMove < 0.35 ? Math.sin((g.t - mk.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missed = mk.missAt > 0 && g.t - mk.missAt < 0.7;
  const expr = won ? 'laugh' : lost ? 'sad' : missed ? 'think' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hk > 0 ? 'hop' : M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', HX, HY - hk * 24, 1.4, { t: g.t, pose, expr, facing: -1 }); else SCN.host(g, c, 'owl', HX, HY, 1.4);
}

MG.add({
  id: 'negexp', stage: 'powers', cmd: 'NEGATIVE EXP!', hint: 'drag', time: 8, mood: 'night', winText: 'Flipped!', hold: 1.4,
  card: {
    title: 'Negative exponents', ref: 'Grade 8', kind: 'Exponents',
    text: 'An exponent says how many copies of the base are multiplied. A negative exponent says how many copies we divide by. So x⁻³ means 1 divided by x · x · x, which is 1/x³.\n\nTo get rid of a negative exponent, move that power to the other side of the fraction bar and drop the minus sign. A power on top moves to the bottom, and a power on the bottom moves to the top, so 1/y⁻² = y². Parts without a negative exponent stay where they are: 2x⁻³ = 2/x³.\n\nWhy? Each time the exponent goes down by 1, we divide by x once more: x² = x · x, x¹ = x, x⁰ = 1, x⁻¹ = 1/x, x⁻² = 1/x².',
    note: 'x⁻ⁿ = 1/xⁿ and 1/x⁻ⁿ = xⁿ. Move a power across the fraction bar and change the sign of its exponent.',
    ask: 'Write 5x⁻² without a negative exponent. What is 1/a⁻⁴?',
  },

  init(g) {
    const S = g.s; M.setup(g); const p = gen(g); let u = 0;
    S.parts = [...p.top.map(q => ({ ...q, u: u++ })), ...p.bot.map(q => ({ ...q, u: u++, down: true }))]; S.parts.forEach(mkPart);
    S.one = M.num(1, 'one');
    build(g); M.inert(g, ['bar', ...S.parts.map(q => 'xe' + q.u)]);
    const nMoves = S.parts.filter(q => q.e < 0).length; g.dur *= (2.6 + 1.05 * Math.max(2, nMoves)) / 8;
    M.play(g, {
      moves(g) {
        const out = [], ids = list => list.map(q => 'p' + q.u);
        for (const q of S.parts) {
          if (!(q.e < 0) || q.moving) continue;
          const others = S.parts.filter(o => o.down !== q.down && o !== q);
          // across the bar: onto a part on the other side, onto the waiting slot, or anywhere past the bar
          const to = q.down ? (others.length ? ids(others) : ['one']) : (S.isFrac ? ids(others) : ['slot']);
          out.push({ drag: 'p' + q.u, to, area: q.down ? [0, 150, 360, S.barY - 4] : [0, S.barY + 4, 360, 470], busy: 0.1, then(g) {
            const T = M.pace(g); q.moving = true; M.show(g, 1.35 * T); hop(g, 'think');
            // the negative exponent lights up: it is what sends the power across
            M.circle(g, 'xe' + q.u, { col: NEG, dur: 0.34 * T }); for (const n of [q.mn, q.en]) M.indicate(g, n, { col: NEG, sc: 1.35, dur: 0.36 * T });
            M.at(g, [
              [0.38 * T, g => { q.down = !q.down; build(g, true); g.sfx('swoosh'); hop(g); }], // the power glides across the bar
              [0.78 * T, g => { // as it lands, the minus sign flicks off and the exponent turns positive
                M.tween(g, q.mn, { dy: -30, dx: 12, alpha: 0, sc: 1.9 }, 0.3 * T); q.en.col = POS; M.indicate(g, q.en, { col: POS, sc: 1.5, dur: 0.4 * T }); g.sfx('pop'); hop(g, 'wow'); }],
              [1.1 * T, g => { q.e = -q.e; q.moving = false; build(g); M.sparkle(g, 'p' + q.u, { cols: ['#fff4c0', POS, '#fff'], n: 12 }); g.sfx('ding'); hop(g, 'laugh'); }],
            ]);
          } });
        }
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s;
    SCN.std(g, c, { scene: 'night', panel: 'sign' }); host(g, c);
    // the empty fraction bar and slot, waiting for the power to come down
    if (g.s.mk.zones && g.s.mk.zones.slot) {
      const p = 0.5 + 0.5 * Math.sin(g.t * 4); c.save(); c.strokeStyle = `rgba(255,244,220,${0.45 + p * 0.25})`; c.lineWidth = 4; c.lineCap = 'round'; c.setLineDash([10, 9]);
      c.beginPath(); c.moveTo(118, S.barY); c.lineTo(242, S.barY); c.stroke(); c.lineWidth = 2.5; c.setLineDash([7, 6]);
      c.beginPath(); c.roundRect(180 - 34, S.barY + 10, 68, 44, 10); c.stroke(); c.restore();
    }
    M.drawEx(g, c, 'ex'); M.drawUI(g, c);
  },
});
