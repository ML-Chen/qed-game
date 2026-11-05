// symmetry_order.js — ELEMENT ORDER! Find the order of a turn by doing it again and again until the shape is back.
// A glowing glass tile floats in the night sky with a little bird perched on one corner; a star marks where that
// corner started. The player taps the round turn button, and each turn is acted out (show your work): the tile turns
// slowly while a curved arrow sweeps along behind the bird's corner with the angle written on it, the bird leaves a
// numbered footprint where it lands (1, 2, 3...), the angle counter in the middle of the tile rolls up (90°, 180°...)
// and the power on the glass panel rolls up with it (e, r, r², r³...). When the bird lands on its star the counter
// reads a whole number of full turns, "= e" writes itself after the power, and the exponent flies down into |r| = ?.
// Tapping the tile itself (instead of the button) only wobbles.
// Level 0: a square turned 90° (order 4). Level 1: a square turned 180° (2) or a triangle turned 120° (3).
// Level 2: a hexagon turned 120° or 240° (3), or 180° (2): the order depends on the turn, not on the number of sides.
// Medium mode: once the bird is home, the tray asks for |r|.
const M = MK, PANEL = 'glass', INK = SCN.ink(PANEL), CX = 180, CY = 448, RAD = 80, BTN = { x: 290, y: 556, r: 34 }, OWL = [40, 620];
const GOLD = '#ffd23a', ARC = '#ffe27a', DEG = '#1d3a7a';

MG.add({
  id: 'symmetry_order', stage: 'symmetry', cmd: 'ELEMENT ORDER!', hint: 'tap', time: 8, mood: 'desert', winText: 'Back home!', hold: 1.4,
  card: {
    title: 'The order of an element', ref: 'College', kind: 'Abstract algebra',
    text: 'In a group, the order of a move r is the smallest number of times you must do r in a row to get back to e, the move that changes nothing. The order of r is written |r|, and doing r three times in a row is written r³.\n\nLet r be a quarter turn (90°) of a square. After r, r² and r³ the square is still turned, but r⁴ is a full turn of 360°, so the square is back where it started. So r⁴ = e and |r| = 4.\n\nThe order belongs to the move, not to the shape. A hexagon turned by 120° is back after 3 turns, because 3 × 120° = 360°. So that turn has order 3, even though a hexagon has 6 sides.',
    note: 'Repeat the move until everything is back at the start. The number of moves it took is the order.',
    ask: 'What is the order of a 180° turn of a square? What is the order of a 60° turn of a hexagon?',
  },
  init(g) {
    const S = g.s; M.setup(g); const R = a => a[Math.floor(g.rand() * a.length)], T = M.pace(g);
    [S.sides, S.deg] = g.level === 0 ? [4, 90] : g.level === 1 ? R([[4, 180], [3, 120]]) : R([[6, 120], [6, 240], [6, 180]]);
    S.ord = 360 / gcd(S.deg, 360); S.k = 0; S.ang = 0; S.spin = null; S.home = -9; S.pips = []; S.hopAt = -9; S.face = 'happy'; S.faceT = -9;
    function gcd(a, b) { return b ? gcd(b, a % b) : a; }
    // the same node objects are kept between rewrites, so the kit glides them instead of fading them in again
    const rN = M.vr('r', 'pr'), eN = M.vr('e', 'pe'), expN = M.num(2, 'px'), supN = M.sup(rN, expN), eqN = M.op('=', 'peq', { alpha: 0 }), e2 = M.vr('e', 'pe2', { col: M.GOOD, alpha: 0 });
    S.line = () => { const pw = S.k === 0 ? eN : S.k === 1 ? rN : supN; M.place(g, 'pw', S.k === S.ord ? M.row(pw, eqN, e2) : M.row(pw), 180, 236, 42, { col: INK }); };
    S.line();
    S.ordRow = M.row(M.txt('|'), M.vr('r'), M.txt('|'), M.op('='), M.slot('q')); M.place(g, 'ord', S.ordRow, 180, 288, 32, { col: INK });
    M.place(g, 'key', M.row(M.vr('r'), M.op('='), M.txt('turn ' + S.deg + '°'), M.gap(18), M.txt('|'), M.vr('r'), M.txt('|'), M.op('='), M.txt('order of'), M.gap(5), M.vr('r')), 180, 320, 14, { col: '#5a3a6a' });
    // the angle turned so far, written on the glass in the middle of the tile; it rolls up like an odometer
    S.degN = M.num('0°', 'deg', { col: DEG, alpha: 0.55 }); M.place(g, 'deg', M.row(S.degN), CX, CY + 10, 26, { col: DEG });
    M.inert(g, ['q', 'deg', 'pr', 'pe', 'px', 'peq', 'pe2']);
    M.zone(g, 'rot', { x: BTN.x, y: BTN.y, w: BTN.r * 2, h: BTN.r * 2 }); M.zone(g, 'tile', { x: CX, y: CY, w: RAD * 1.5, h: RAD * 1.5 });
    g.dur *= (2.6 + 1.05 * S.ord) / 8;
    const TURN = 0.6 * T, LAND = 0.85 * T, END = 1.0 * T;
    const turn = g => {
      const from = S.ang; S.ang -= S.deg * Math.PI / 180; S.spin = { from, to: S.ang, t0: g.t, dur: TURN }; S.k++; const k = S.k, home = k === S.ord;
      g.sfx('swoosh'); S.face = 'wow'; S.faceT = g.t;
      M.at(g, [[TURN, g => { // the tile lands: footprint, counters roll up, everybody reacts
        S.hopAt = g.t; g.sfx(home ? 'ding' : 'tap'); S.degN.alpha = 1;
        M.roll(g, S.degN, k * S.deg + '°', { dur: 0.3 * T }); M.indicate(g, S.degN, { dur: 0.35 * T, sc: 1.25, col: home ? M.GOOD : '#5aa0ff', delay: 0.05 * T });
        if (k === 1) { S.line(); M.indicate(g, rN, { dur: 0.35 * T, sc: 1.3 }); } // e becomes r
        else if (k === 2) { expN.v = '2'; S.line(); M.writeIn(g, expN, { dur: 0.25 * T }); M.indicate(g, supN, { dur: 0.35 * T, sc: 1.2, delay: 0.1 * T }); }
        else { M.roll(g, expN, k, { dur: 0.3 * T }); M.indicate(g, expN, { dur: 0.35 * T, sc: 1.35, delay: 0.05 * T }); }
        if (!home) { const a = -Math.PI / 2 + S.ang; S.pips.push({ a, n: k, t0: g.t }); }
        else { S.home = g.t; S.face = 'laugh'; S.faceT = g.t; g.burst(CX, CY - RAD - 12, ['#fff4b0', GOLD, '#a8d8ff'], 18, 150); S.degN.col = M.GOOD; for (const p of S.pips) p.out = g.t; }
      }]]);
    };
    // the bird is home: "= e" writes itself after the power, and the exponent flies down into |r| = ?
    const fill = g => {
      M.show(g, END); S.line(); eqN.alpha = 1; e2.alpha = 1; M.writeIn(g, eqN, { dur: 0.15 * T }); M.writeIn(g, e2, { dur: 0.25 * T, delay: 0.12 * T });
      M.indicate(g, e2, { delay: 0.35 * T, dur: 0.35 * T, col: M.GOOD });
      const src = S.ord >= 2 ? (S.k >= 2 ? 'px' : 'pr') : 'pr';
      M.at(g, [[0.45 * T, g => { M.indicate(g, src === 'px' ? expN : rN, { dur: 0.3 * T, sc: 1.4 }); M.circle(g, src, { dur: 0.4 * T, col: GOLD }); g.sfx('whoosh');
        M.fly(g, { node: M.num(S.ord, null, { col: GOLD }), from: src, to: 'q', dur: 0.4 * T, arc: -30, s0: 26, s1: 32,
          then(g) { S.ordRow.items[4] = M.num(S.ord, 'qa', { pop: g.t, col: M.GOOD, _born: -1 }); M.place(g, 'ord', S.ordRow, 180, 288, 32, { col: INK }); M.inert(g, ['qa']); g.sfx('coin'); M.sparkle(g, 'qa', { n: 12 }); S.hopAt = g.t; } }); }]]);
    };
    M.play(g, {
      moves(g) {
        if (S.k >= S.ord) return [];
        const last = S.k + 1 === S.ord;
        return [{ tap: 'rot', busy: 0.1, askAt: last ? LAND : undefined, after: END,
          ask: last ? { v: S.ord, wrong: [S.ord - 1, S.ord + 1, S.sides, S.deg === 180 ? 4 : 2] } : undefined, resolve: last ? fill : undefined,
          then(g) { M.show(g, LAND); turn(g); } }];
      },
      area(g) { return ['rot']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth, { wait: 0.2 }); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    SCN.std(g, c, { scene: 'night', panel: PANEL, panelY: 262, panelH: 140 });
    // the owl watches: it points at the tile while it turns, hops when it lands, cheers on a win
    const hk = (t - S.hopAt) / 0.35, hop = hk > 0 && hk < 1 ? Math.sin(hk * Math.PI) : 0, spinning = S.spin && t < S.spin.t0 + S.spin.dur;
    const oexpr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.7 ? S.face : 'happy', opose = won ? 'cheer' : hop > 0 ? 'hop' : spinning ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', OWL[0], OWL[1] - hop * 22, 1.05, { t, pose: opose, expr: oexpr }); else SCN.host(g, c, 'owl', OWL[0], OWL[1], 1.2);
    M.drawEx(g, c, 'pw'); M.drawEx(g, c, 'ord'); M.drawEx(g, c, 'key');
    // the tile: a glowing glass polygon, turned by S.ang (slowly and smoothly while it turns)
    const sp = S.spin, sk = sp ? M.clamp((t - sp.t0) / sp.dur, 0, 1) : 1, ang = sp ? M.lerp(sp.from, sp.to, M.easeIO(sk)) : S.ang;
    const wob = K.missInfo && K.missInfo.tap === 'tile' && t - K.missAt < 0.4 ? Math.sin(t * 50) * 0.05 : 0, n = S.sides, lift = sp && sk < 1 ? Math.sin(sk * Math.PI) * 6 : 0;
    const cy = CY - lift, V = j => { const a = -Math.PI / 2 + ang + wob + j * 2 * Math.PI / n; return [CX + Math.cos(a) * RAD, cy + Math.sin(a) * RAD]; };
    c.save(); c.shadowColor = 'rgba(140,200,255,0.9)'; c.shadowBlur = 30 + lift * 3;
    const gr = c.createRadialGradient(CX - 20, cy - 26, 6, CX, cy, RAD); gr.addColorStop(0, 'rgba(210,240,255,0.95)'); gr.addColorStop(1, 'rgba(90,140,230,0.85)');
    c.fillStyle = gr; c.beginPath(); for (let j = 0; j < n; j++) c.lineTo(...V(j)); c.closePath(); c.fill(); c.restore();
    c.strokeStyle = '#eaf6ff'; c.lineWidth = 4; c.lineJoin = 'round'; c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 2; c.beginPath(); for (let j = 0; j < n; j++) { c.moveTo(CX, cy); c.lineTo(...V(j)); } c.stroke();
    // the angle counter on the glass, on a soft frosted disc so it reads
    c.save(); c.fillStyle = 'rgba(235,248,255,0.7)'; c.beginPath(); c.ellipse(CX, CY + 1, 34, 18, 0, 0, 7); c.fill(); c.restore();
    M.drawEx(g, c, 'deg');
    // the bird's footprints: where its corner landed after each turn (1, 2, 3 ...), around the tile
    for (const p of S.pips) {
      const kk = M.ease((t - p.t0) / 0.3), fo = p.out ? M.clamp(1 - (t - p.out - 0.6) / 0.5, 0, 1) : 1; if (fo <= 0) continue;
      const x = CX + Math.cos(p.a) * (RAD + 17), y = CY + Math.sin(p.a) * (RAD + 17), r = 10 * (0.4 + 0.6 * kk) * (p.out ? 1 + 0.25 * Math.sin(M.clamp((t - p.out) / 0.3, 0, 1) * Math.PI) : 1);
      c.save(); c.globalAlpha = kk * fo; c.fillStyle = 'rgba(255,226,122,0.25)'; c.beginPath(); c.arc(x, y, r + 4, 0, 7); c.fill();
      c.fillStyle = '#2a2a6a'; c.strokeStyle = ARC; c.lineWidth = 2; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke();
      c.fillStyle = ARC; c.font = '700 13px Fredoka, Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(p.n), x, y + 1); c.restore();
    }
    // a dashed ring and a star where the bird's corner started
    const home = S.home > 0 && t > S.home, hh = home ? Math.sin(Math.min(1, (t - S.home) / 0.3) * Math.PI) : 0;
    c.save(); c.strokeStyle = home ? '#9ae07a' : '#fff27a'; c.lineWidth = 3; c.setLineDash([5, 4]); c.lineDashOffset = -t * 14; c.beginPath(); c.arc(CX, CY - RAD, 15 + hh * 6, 0, 7); c.stroke(); c.restore();
    c.save(); c.translate(CX + 34, CY - RAD - 8); const st = 1 + hh * 0.6 + 0.1 * Math.sin(t * 4); c.scale(st, st); c.fillStyle = '#fff27a'; c.shadowColor = '#ffe080'; c.shadowBlur = 12;
    c.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 3.5 : 9, a = j * Math.PI / 5 - Math.PI / 2; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); c.restore();
    // the turn being made: a curved arrow sweeps behind the bird's corner, with the angle written on it; it fades after landing
    if (sp) { const age = t - sp.t0 - sp.dur, fade = age > 0 ? 1 - age / (0.35) : 1;
      if (fade > 0) { const a0 = -Math.PI / 2 + sp.from - 0.04, a1 = -Math.PI / 2 + M.lerp(sp.from, sp.to, M.easeIO(sk)), rr = RAD + 30;
        c.save(); c.globalAlpha = fade; c.lineCap = 'round'; c.shadowColor = ARC; c.shadowBlur = 10;
        c.strokeStyle = 'rgba(20,20,60,0.5)'; c.lineWidth = 8; c.beginPath(); c.arc(CX, CY, rr, a0, a1, true); c.stroke();
        c.strokeStyle = ARC; c.lineWidth = 4; c.beginPath(); c.arc(CX, CY, rr, a0, a1, true); c.stroke();
        if (a0 - a1 > 0.1) { const hx = CX + Math.cos(a1) * rr, hy = CY + Math.sin(a1) * rr, ta = a1 - Math.PI / 2; c.fillStyle = ARC; c.beginPath();
          c.moveTo(hx + Math.cos(ta) * 11, hy + Math.sin(ta) * 11); c.lineTo(hx + Math.cos(ta + 2.4) * 9, hy + Math.sin(ta + 2.4) * 9); c.lineTo(hx + Math.cos(ta - 2.4) * 9, hy + Math.sin(ta - 2.4) * 9); c.closePath(); c.fill(); }
        if (sk > 0.3) { const am = (a0 + a1) / 2, lx = CX + Math.cos(am) * (rr + 20), ly = CY + Math.sin(am) * (rr + 18);
          c.globalAlpha = fade * M.clamp((sk - 0.3) / 0.3, 0, 1); c.shadowBlur = 6; c.shadowColor = 'rgba(0,0,0,0.6)'; c.fillStyle = ARC; c.font = '700 19px Fredoka, Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
          c.fillText(S.deg + '°', lx, ly); }
        c.restore(); } }
    // a gold mark on the bird's corner, and the bird (holding on tight while it turns)
    const [bx, by] = V(0); c.fillStyle = GOLD; c.beginPath(); c.arc(bx, by, 7, 0, 7); c.fill();
    const bpose = won || (home && t - S.home < 0.8) ? 'cheer' : spinning ? 'balance' : 'idle', bexpr = won || home ? 'laugh' : spinning ? 'wow' : 'happy';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'bird', bx, by - 4, 0.6, { t, pose: bpose, expr: bexpr, noShadow: true });
    // the turn button
    const pr = K.lastMove != null && t - K.lastMove < 0.12 ? 3 : 0;
    c.fillStyle = 'rgba(10,10,30,0.4)'; c.beginPath(); c.arc(BTN.x, BTN.y + 5, BTN.r, 0, 7); c.fill();
    c.fillStyle = '#ff9a5a'; c.beginPath(); c.arc(BTN.x, BTN.y + pr, BTN.r, 0, 7); c.fill(); c.strokeStyle = '#fff4dc'; c.lineWidth = 3; c.stroke();
    // a counter-clockwise arrow (screen angles decrease going counter-clockwise)
    const a0 = 1.0, a1 = -Math.PI * 1.4, by0 = BTN.y + pr; c.strokeStyle = '#fff4dc'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.arc(BTN.x, by0, 19, a0, a1, true); c.stroke();
    const hx = BTN.x + Math.cos(a1) * 19, hy = by0 + Math.sin(a1) * 19, tx = Math.sin(a1), ty = -Math.cos(a1);
    c.fillStyle = '#fff4dc'; c.beginPath(); c.moveTo(hx + tx * 9, hy + ty * 9); c.lineTo(hx - ty * 7, hy + tx * 7); c.lineTo(hx + ty * 7, hy - tx * 7); c.closePath(); c.fill();
    c.font = M.VARF(22); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('r', BTN.x, BTN.y + pr + 1);
    M.drawUI(g, c);
  },
});
