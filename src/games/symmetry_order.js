// symmetry_order.js — ELEMENT ORDER! Find the order of a turn by doing it again and again until the shape is back.
// A glowing glass tile floats in the night sky with a little bird perched on one corner; a star marks where that
// corner started. The player taps the round turn button: the tile turns by the angle in the key, and the glass panel
// counts the turns as a power (r, r², r³...). When the bird is back by its star, the panel reads r⁴ = e and |r| = 4.
// Tapping the tile itself (instead of the button) only wobbles.
// Level 0: a square turned 90° (order 4). Level 1: a square turned 180° (2) or a triangle turned 120° (3).
// Level 2: a hexagon turned 120° or 240° (3), or 180° (2): the order depends on the turn, not on the number of sides.
// Medium mode: the turn that brings the bird home asks for |r| in the tray.
const M = MK, PANEL = 'glass', INK = SCN.ink(PANEL), CX = 180, CY = 448, RAD = 80, BTN = { x: 290, y: 556, r: 34 };

MG.add({
  id: 'symmetry_order', stage: 'symmetry', cmd: 'ELEMENT ORDER!', hint: 'tap', time: 8, mood: 'desert', winText: 'Back home!', hold: 1.4,
  card: {
    title: 'The order of an element', ref: 'College', kind: 'Abstract algebra',
    text: 'In a group, the order of a move r is the smallest number of times you must do r in a row to get back to e, the move that changes nothing. The order of r is written |r|, and doing r three times in a row is written r³.\n\nLet r be a quarter turn (90°) of a square. After r, r² and r³ the square is still turned, but r⁴ is a full turn of 360°, so the square is back where it started. So r⁴ = e and |r| = 4.\n\nThe order belongs to the move, not to the shape. A hexagon turned by 120° is back after 3 turns, because 3 × 120° = 360°. So that turn has order 3, even though a hexagon has 6 sides.',
    note: 'Repeat the move until everything is back at the start. The number of moves it took is the order.',
    ask: 'What is the order of a 180° turn of a square? What is the order of a 60° turn of a hexagon?',
  },
  init(g) {
    const S = g.s; M.setup(g); const R = a => a[Math.floor(g.rand() * a.length)];
    [S.sides, S.deg] = g.level === 0 ? [4, 90] : g.level === 1 ? R([[4, 180], [3, 120]]) : R([[6, 120], [6, 240], [6, 180]]);
    S.ord = 360 / gcd(S.deg, 360); S.k = 0; S.ang = 0; S.spin = null; S.home = -9;
    function gcd(a, b) { return b ? gcd(b, a % b) : a; }
    S.line = () => { const pw = S.k === 0 ? M.vr('e') : S.k === 1 ? M.vr('r') : M.sup(M.vr('r'), M.num(S.k, null, { pop: g.t })), done = S.k === S.ord;
      M.place(g, 'pw', done ? M.row(pw, M.op('='), M.vr('e', null, { col: M.GOOD })) : M.row(pw), 180, 236, 42, { col: INK }); };
    S.line();
    M.place(g, 'ord', M.row(M.txt('|'), M.vr('r'), M.txt('|'), M.op('='), M.slot('q')), 180, 288, 32, { col: INK });
    M.place(g, 'key', M.row(M.vr('r'), M.op('='), M.txt('turn ' + S.deg + '°'), M.gap(18), M.txt('|'), M.vr('r'), M.txt('|'), M.op('='), M.txt('order of'), M.gap(5), M.vr('r')), 180, 320, 14, { col: '#5a3a6a' });
    M.inert(g, ['q']);
    M.zone(g, 'rot', { x: BTN.x, y: BTN.y, w: BTN.r * 2, h: BTN.r * 2 }); M.zone(g, 'tile', { x: CX, y: CY, w: RAD * 1.5, h: RAD * 1.5 });
    g.dur *= (2.6 + 1.05 * S.ord) / 8;
    const fill = g => { M.place(g, 'ord', M.row(M.txt('|'), M.vr('r'), M.txt('|'), M.op('='), M.num(S.ord, 'qa', { pop: g.t, col: M.GOOD })), 180, 288, 32, { col: INK }); M.inert(g, ['qa']); g.sfx('coin'); };
    M.play(g, {
      moves(g) {
        if (S.k >= S.ord) return [];
        const last = S.k + 1 === S.ord;
        return [{ tap: 'rot', busy: last ? 0.3 : 0.12, askAt: last ? 0.22 : undefined, after: 0.1,
          ask: last ? { v: S.ord, wrong: [S.ord - 1, S.ord + 1, S.sides, S.deg === 180 ? 4 : 2] } : undefined, resolve: last ? fill : undefined,
          then(g) { S.spin = { from: S.ang, t0: g.t }; S.ang -= S.deg * Math.PI / 180; S.k++; S.line(); g.sfx('swoosh');
            if (S.k === S.ord) { S.home = g.t + 0.2; M.later(g, 0.2, g => { g.sfx('ding'); g.burst(CX, CY - RAD - 20, ['#fff4b0', '#ffd45a', '#a8d8ff'], 16, 140); }); } } }];
      },
      area(g) { return ['rot']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth, { wait: 0.2 }); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.std(g, c, { scene: 'night', panel: PANEL, panelY: 262, panelH: 140, host: 'owl', hostX: 66, hostY: 604, hostS: 1.2 });
    M.drawEx(g, c, 'pw'); M.drawEx(g, c, 'ord'); M.drawEx(g, c, 'key');
    // the tile: a glowing glass polygon, turned by S.ang (smoothly while it spins)
    const sk = S.spin ? M.clamp((t - S.spin.t0) / 0.2, 0, 1) : 1, ang = S.spin ? M.lerp(S.spin.from, S.ang, M.ease(sk)) : S.ang;
    const wob = K.missInfo && K.missInfo.tap === 'tile' && t - K.missAt < 0.4 ? Math.sin(t * 50) * 0.05 : 0, n = S.sides;
    const V = j => { const a = -Math.PI / 2 + ang + wob + j * 2 * Math.PI / n; return [CX + Math.cos(a) * RAD, CY + Math.sin(a) * RAD]; };
    c.save(); c.shadowColor = 'rgba(140,200,255,0.9)'; c.shadowBlur = 30;
    const gr = c.createRadialGradient(CX - 20, CY - 26, 6, CX, CY, RAD); gr.addColorStop(0, 'rgba(210,240,255,0.95)'); gr.addColorStop(1, 'rgba(90,140,230,0.85)');
    c.fillStyle = gr; c.beginPath(); for (let j = 0; j < n; j++) c.lineTo(...V(j)); c.closePath(); c.fill(); c.restore();
    c.strokeStyle = '#eaf6ff'; c.lineWidth = 4; c.lineJoin = 'round'; c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 2; c.beginPath(); for (let j = 0; j < n; j++) { c.moveTo(CX, CY); c.lineTo(...V(j)); } c.stroke();
    // a dashed ring and a star where the bird's corner started
    const home = S.home > 0 && t > S.home, hk = home ? Math.sin(Math.min(1, (t - S.home) / 0.3) * Math.PI) : 0;
    c.save(); c.strokeStyle = home ? '#9ae07a' : '#fff27a'; c.lineWidth = 3; c.setLineDash([5, 4]); c.lineDashOffset = -t * 14; c.beginPath(); c.arc(CX, CY - RAD, 15 + hk * 6, 0, 7); c.stroke(); c.restore();
    c.save(); c.translate(CX + 34, CY - RAD - 8); const st = 1 + hk * 0.6 + 0.1 * Math.sin(t * 4); c.scale(st, st); c.fillStyle = '#fff27a'; c.shadowColor = '#ffe080'; c.shadowBlur = 12;
    c.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 3.5 : 9, a = j * Math.PI / 5 - Math.PI / 2; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); c.restore();
    // a gold mark on the bird's corner, and the bird
    const [bx, by] = V(0); c.fillStyle = '#ffd23a'; c.beginPath(); c.arc(bx, by, 7, 0, 7); c.fill();
    const won = g.done && g.result === 'win';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'bird', bx, by - 4, 0.6, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : 'happy' });
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
