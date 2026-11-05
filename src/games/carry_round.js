// carry_round.js — ROUND! Round numbers to the nearest ten by flicking balls off a hill.
// A grassy hill in a city park stands on a number line from one ten to the next (40 to 50); its top is exactly halfway
// (45). Balls with numbers on them rest on the slope above their places. The player flicks each ball (a short drag)
// toward the nearer ten: it rolls down to that ten and the glass sign reads 47 ≈ 50. Flicking a ball the wrong way
// (dropping it on the farther ten) only wobbles it.
// Level 0: two balls in 40–50, one rounds down and one up. Level 1: three balls, one of them exactly on the top (45),
// which rounds up. Level 2: three-digit numbers (263 between 260 and 270).
// Medium mode: the flick writes "47 ≈ ?" and the tray asks for the ten (wrong tiles: the other ten, the number itself).
const M = MK, PANEL = 'glass', INK = SCN.ink(PANEL), X0 = 40, X1 = 320, BASE = 476, HILL = 74, BR = 18;
const vx = (S, v) => X0 + (v - S.lo) / 10 * (X1 - X0);
const hy = (S, v) => BASE - HILL * (1 - Math.cos(2 * Math.PI * (v - S.lo) / 10)) / 2; // the hill's surface; top at lo + 5

MG.add({
  id: 'carry_round', stage: 'carry', cmd: 'ROUND!', hint: 'swipe', time: 8, mood: 'bright', winText: 'Rounded!', hold: 1.4,
  card: {
    title: 'Rounding to the nearest ten', ref: 'Grade 3', kind: 'Place value',
    text: 'Rounding a number to the nearest ten means finding the multiple of ten that is closest to it. The multiples of ten are 10, 20, 30, 40, 50 and so on.\n\n47 lies between 40 and 50. It is 7 away from 40 but only 3 away from 50, so 47 rounds to 50. We write 47 ≈ 50, where ≈ means "is about". In the same way, 42 rounds to 40.\n\nYou only need the ones digit. If it is 0, 1, 2, 3 or 4, round down to the ten below. If it is 5, 6, 7, 8 or 9, round up to the ten above. A number ending in 5, like 45, is exactly halfway, and the rule is to round it up, to 50.\n\nThe hill shows this: its top is at 45, so each ball rolls down to the nearer ten.',
    note: 'Look at the ones digit. 0 to 4: round down. 5 to 9: round up.',
    ask: 'Round 38 to the nearest ten. Round 65 to the nearest ten. Round 264 to the nearest ten.',
  },
  init(g) {
    const S = g.s; M.setup(g); const r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
    S.lo = g.level === 2 ? r(1, 9) * 100 + r(0, 9) * 10 : r(2, 8) * 10;
    let offs;
    if (g.level === 0) offs = [r(1, 3), r(6, 9)];
    else if (g.level === 1) offs = [r(1, 3), 5, r(7, 9)];
    else for (;;) { offs = [r(1, 9), r(1, 9), r(1, 9)].sort((a, b) => a - b); if (offs[1] - offs[0] >= 2 && offs[2] - offs[1] >= 2 && offs.some(o => o < 5) && offs.some(o => o >= 5)) break; }
    S.balls = offs.map((o, i) => ({ v: S.lo + o, to: o >= 5 ? S.lo + 10 : S.lo, pos: S.lo + o, done: false, roll: null, i }));
    S.build = () => {
      const parts = S.balls.flatMap((b, i) => [i ? M.gap(26) : null, M.num(b.v, 'v' + i), M.op('≈'), b.shown != null ? M.num(b.shown, 'r' + i, { pop: b.popT, col: '#2f7a4a' }) : M.slot('q' + i)]);
      const node = M.row(...parts), w = M.lay(M.row(...S.balls.flatMap((b, i) => [i ? M.gap(26) : null, M.num(b.v), M.op('≈'), M.num(b.to)])), 32).w;
      M.place(g, 'eq', node, 180, 252, Math.min(32, 32 * 316 / w), { col: INK });
    };
    S.build();
    M.place(g, 'key', M.row(M.op('≈'), M.gap(6), M.txt('means'), M.gap(6), M.txt('“is about”')), 180, 290, 15, { col: '#5a3a6a' });
    M.inert(g, S.balls.flatMap((b, i) => ['v' + i, 'q' + i, 'r' + i]));
    M.zone(g, 'tlo', { x: X0, y: BASE + 34, w: 54, h: 40 }); M.zone(g, 'thi', { x: X1, y: BASE + 34, w: 54, h: 40 });
    S.zones = () => S.balls.forEach((b, i) => M.zone(g, 'b' + i, { x: vx(S, b.pos), y: hy(S, b.pos) - BR, w: BR * 2 + 8, h: BR * 2 + 8 }));
    S.zones(); g.dur *= (2.6 + 1.05 * S.balls.length) / 8;
    M.play(g, {
      moves(g) {
        return S.balls.map((b, i) => {
          if (b.done) return null; const up = b.to > S.lo, x = vx(S, b.v);
          const others = S.balls.filter(q => q !== b && !q.done && (up ? q.v > b.v : q.v < b.v)).map(q => 'b' + q.i);
          return { drag: 'b' + i, to: [up ? 'thi' : 'tlo', ...others], area: up ? [x + 8, 300, 360, 540] : [0, 300, x - 8, 540], busy: 0.1, askAt: 0, after: 0.1,
            ask: { v: b.to, wrong: [up ? S.lo : S.lo + 10, b.v, S.lo + 5, b.to + (up ? 10 : -10)] },
            then(g) { b.done = true; M.inert(g, ['b' + i]); b.roll = { from: b.pos, t0: g.t }; g.sfx('whoosh'); },
            resolve(g) { b.shown = b.to; b.popT = g.t; S.build(); g.sfx('coin'); } };
        }).filter(Boolean);
      },
      area(g) { const b = S.balls.find(q => !q.done); return b ? ['b' + b.i] : null; },
    });
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    for (const b of S.balls) if (b.roll) { const k = M.clamp((g.t - b.roll.t0) / 0.35, 0, 1); b.pos = M.lerp(b.roll.from, b.to, k * k); if (k >= 1 && !b.landed) { b.landed = true; g.burst(vx(S, b.to), BASE - 6, ['#fff4dc', '#ffd45a', '#9ae07a'], 10, 110); g.sfx('thud'); } }
    S.zones();
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.std(g, c, { scene: 'city', panel: PANEL, panelY: 262, panelH: 100, host: 'fox', hostX: 304, hostY: 612, hostS: 1.0 });
    M.drawEx(g, c, 'eq'); M.drawEx(g, c, 'key');
    // the hill
    c.beginPath(); c.moveTo(0, BASE); c.lineTo(X0, BASE); for (let i = 0; i <= 60; i++) { const v = S.lo + i / 6; c.lineTo(vx(S, v), hy(S, v)); } c.lineTo(360, BASE); c.lineTo(360, BASE + 14); c.lineTo(0, BASE + 14); c.closePath();
    const gr = c.createLinearGradient(0, BASE - HILL, 0, BASE); gr.addColorStop(0, '#8ad06a'); gr.addColorStop(1, '#4e9a48'); c.fillStyle = gr; c.fill();
    c.strokeStyle = '#d8f4a0'; c.lineWidth = 3; c.beginPath(); for (let i = 0; i <= 60; i++) { const v = S.lo + i / 6; c[i ? 'lineTo' : 'moveTo'](vx(S, v), hy(S, v)); } c.stroke();
    // the number line under it
    c.fillStyle = '#f4ecd8'; c.fillRect(X0 - 14, BASE + 8, X1 - X0 + 28, 6);
    c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    for (let k = 0; k <= 10; k++) { const x = vx(S, S.lo + k), big = k === 0 || k === 10; c.fillStyle = '#f4ecd8'; c.fillRect(x - 1.5, BASE + 2, 3, big ? 20 : k === 5 ? 15 : 10);
      if (k === 5 || big) { c.font = big ? '700 24px Fredoka, Nunito, sans-serif' : '600 15px Fredoka, Nunito, sans-serif'; c.fillStyle = big ? '#fff6dc' : 'rgba(255,246,220,0.75)'; c.fillText(String(S.lo + k), x, BASE + (big ? 46 : 36)); } }
    // a flag at each ten
    for (const v of [S.lo, S.lo + 10]) { const x = vx(S, v); c.strokeStyle = '#5a4a3a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x, BASE); c.lineTo(x, BASE - 42); c.stroke(); c.fillStyle = v === S.lo ? '#ff8a5a' : '#5ab0f0'; c.beginPath(); c.moveTo(x, BASE - 42); c.lineTo(x + (v === S.lo ? 16 : -16), BASE - 36 + Math.sin(t * 5) * 2); c.lineTo(x, BASE - 30); c.fill(); }
    // the balls (a dragged ball leans along the slope toward the finger)
    const drag = K.press && K.press.dragging ? K.press : null;
    S.balls.forEach((b, i) => {
      let p = b.pos; if (drag && drag.id === 'b' + i) p = M.clamp(b.v + (drag.x - drag.x0) / 28, b.v - 1.5, b.v + 1.5);
      const miss = K.missInfo && K.missInfo.drag === 'b' + i && t - K.missAt < 0.5; if (miss) p = b.v + Math.sin((t - K.missAt) / 0.5 * Math.PI) * (b.to > S.lo ? -1.2 : 1.2);
      const x = vx(S, p), y = hy(S, p) - BR, spin = (p - b.v) * 1.2;
      c.fillStyle = 'rgba(30,40,20,0.3)'; c.beginPath(); c.ellipse(x, hy(S, p) + 1, BR * 0.9, 4, 0, 0, 7); c.fill();
      const bg = c.createRadialGradient(x - 6, y - 7, 2, x, y, BR); bg.addColorStop(0, '#fffaf0'); bg.addColorStop(1, ['#ffb070', '#ffd45a', '#ff8ab0'][i]); c.fillStyle = bg; c.beginPath(); c.arc(x, y, BR, 0, 7); c.fill();
      c.strokeStyle = miss ? M.BAD : '#7a4a3a'; c.lineWidth = 2; c.stroke();
      c.strokeStyle = 'rgba(122,74,58,0.4)'; c.beginPath(); c.arc(x, y, BR - 3, spin, spin + 1.2); c.stroke();
      c.fillStyle = '#3a1640'; c.font = `700 ${S.lo >= 100 ? 14 : 17}px Fredoka, Nunito, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(b.v), x, y + 1);
    });
    M.drawUI(g, c);
  },
});
