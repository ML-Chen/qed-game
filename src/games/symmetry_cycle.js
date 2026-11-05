// symmetry_cycle.js — CYCLE NOTATION! Act out a permutation written in cycle notation.
// Four tree stumps in a meadow are seats 1 to 4, each with an animal on it. The chalkboard shows a permutation such as
// (1 2 3). The player drags each animal to the seat the cycle sends it to (seat 1's animal to seat 2, and so on).
// An animal that arrives at a seat that is still taken climbs onto the head of the animal sitting there, and drops
// into the seat once that animal has moved on. Each number turns green in the cycle once its animal has moved.
// Seats that are not in the cycle stay put: dragging their animal, or dropping an animal on the wrong seat, only wobbles.
// Level 0: a 3-cycle on four seats. Level 1: a 4-cycle. Level 2: two swaps, a 4-cycle or a 3-cycle.
// Medium mode: there is no computation to pick, so the tray is not used; medium mode only adds time.
// a chalk arrow from a to b along a quadratic curve (bend: how far its middle bows, negative = up), drawn to progress k
function chalkArrow(c, a, b, bend, k, col, lw, alpha = 1, outline = false) {
  if (k <= 0) return; const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) / L * 0, my = (a[1] + b[1]) / 2 + bend;
  const q = u => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * mx + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * my + u * u * b[1]];
  c.save(); c.globalAlpha *= alpha; c.lineCap = 'round'; c.lineJoin = 'round';
  const path = () => { c.beginPath(); for (let i = 0; i <= 28; i++) { const p = q(k * i / 28); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } };
  const p1 = q(k), p0 = q(Math.max(0, k - 0.06)), an = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]), head = () => { c.beginPath(); c.moveTo(p1[0] + Math.cos(an) * 9, p1[1] + Math.sin(an) * 9); c.lineTo(p1[0] + Math.cos(an + 2.5) * 9, p1[1] + Math.sin(an + 2.5) * 9); c.lineTo(p1[0] + Math.cos(an - 2.5) * 9, p1[1] + Math.sin(an - 2.5) * 9); c.closePath(); };
  if (outline) { c.strokeStyle = 'rgba(40,60,20,0.45)'; c.lineWidth = lw + 3; path(); c.stroke(); head(); c.lineWidth = 3; c.stroke(); }
  c.strokeStyle = col; c.fillStyle = col; c.lineWidth = lw; c.shadowColor = col; c.shadowBlur = 6; if (outline) c.setLineDash([10, 6]); path(); c.stroke(); c.setLineDash([]); head(); c.fill();
  c.restore();
}
const M = MK, PANEL = 'chalk', INK = SCN.ink(PANEL), SX = [60, 140, 220, 300], SY = 478, KINDS = ['frog', 'duck', 'rabbit', 'hedgehog'];

MG.add({
  id: 'symmetry_cycle', stage: 'symmetry', cmd: 'CYCLE NOTATION!', hint: 'drag', time: 9, mood: 'desert', winText: 'Permuted!', hold: 1.4,
  card: {
    title: 'Cycle notation', ref: 'College', kind: 'Abstract algebra',
    text: 'A permutation is a way of shuffling things: it says where each one goes. Cycle notation writes a permutation as lists in brackets. The cycle (1 2 3) means: whatever is in seat 1 moves to seat 2, whatever is in seat 2 moves to seat 3, and whatever is in seat 3 goes back around to seat 1. A seat that is not written, like seat 4 here, stays put.\n\nA permutation can have more than one cycle. (1 3)(2 4) swaps seats 1 and 3, and at the same time swaps seats 2 and 4.\n\nCycle notation is short, and it shows the structure: (1 2 3) moves three things around a loop, so doing it three times puts everything back where it started.',
    note: 'In a cycle, each number goes to the number after it, and the last number goes back to the first. Numbers that are not written stay where they are.',
    ask: 'Where does (1 4 2) send 4? Where does it send 3?',
  },
  init(g) {
    const S = g.s; M.setup(g); const R = a => a[Math.floor(g.rand() * a.length)], sh = a => a.slice().sort(() => g.rand() - 0.5);
    const four = () => [1, ...sh([2, 3, 4])];
    const three = () => { const out = 1 + Math.floor(g.rand() * 4), rest = [1, 2, 3, 4].filter(v => v !== out); return [rest[0], ...sh(rest.slice(1))]; };
    S.cyc = g.level === 0 ? [three()] : g.level === 1 ? [four()] : R([() => { const p = R([2, 3, 4]), q = [2, 3, 4].filter(v => v !== p); return [[1, p], q]; }, () => [four()], () => [three()]])();
    if (!Array.isArray(S.cyc[0])) S.cyc = [S.cyc];
    S.sig = [0, 1, 2, 3]; for (const cy of S.cyc) cy.forEach((v, i) => { S.sig[v - 1] = cy[(i + 1) % cy.length] - 1; });
    S.occ = [[0], [1], [2], [3]]; S.moved = [false, false, false, false];
    S.pos = SX.map(x => ({ x, y: SY, hopT: -9, fl: null })); S.arcs = []; S.landT = [-9, -9, -9, -9]; S.closed = S.cyc.map(() => -9); const T = M.pace(g);
    M.place(g, 'cyc', M.row(...S.cyc.map((cy, ci) => M.paren(M.row(...cy.flatMap((v, i) => [i ? M.gap(16) : null, M.num(v, 'c' + v)])), 'cy' + ci))), 180, 258, 52, { col: INK });
    M.place(g, 'key', M.row(M.paren(M.row(M.vr('a'), M.gap(6), M.vr('b'), M.gap(6), M.vr('c'))), M.txt(':'), M.gap(10), M.vr('a'), M.op('→'), M.vr('b'), M.op('→'), M.vr('c'), M.op('→'), M.vr('a')), 180, 312, 17, { col: '#d8e8d0' });
    M.inert(g, [...[1, 2, 3, 4].map(v => 'c' + v), 'cy0', 'cy1']);
    SX.forEach((x, j) => M.zone(g, 's' + j, { x, y: SY + 18, w: 72, h: 40 }));
    const nMoves = S.sig.filter((v, i) => v !== i).length; g.dur *= (2.6 + 1.05 * nMoves) / 8;
    M.play(g, {
      moves(g) {
        const out = [];
        for (let a = 0; a < 4; a++) {
          const j = S.sig[a]; if (S.moved[a] || j === a) continue;
          out.push({ drag: 'a' + a, to: ['s' + j, ...S.occ[j].map(b => 'a' + b)], area: [SX[j] - 40, 330, SX[j] + 40, SY + 40], busy: 0.1,
            then(g) {
              const from = S.occ.findIndex(o => o.includes(a)); S.occ[from] = S.occ[from].filter(b => b !== a); S.occ[j].push(a);
              S.moved[a] = true; const p = S.pos[a], FL = 0.55 * T, ci = S.cyc.findIndex(cy => cy.includes(a + 1)), cy = S.cyc[ci], last = cy.every(v => S.moved[v - 1]);
              const under = S.occ[j].length > 1 ? S.occ[j][0] : -1; M.show(g, FL + (last ? 0.75 : 0.15) * T);
              // the animal hops along an arc from its old stump to the new one (it starts from where it was sitting)
              p.fl = { x0: SX[from], y0: p.y, t0: g.t, dur: FL }; p.x = SX[from];
              // the working: circle the number, draw the arrow to the number after it (looping back below for the last one),
              // and draw the same arrow in the meadow, from stump to stump, under the hopping animal
              const ix = cy.indexOf(a + 1), wrap = ix === cy.length - 1;
              M.circle(g, 'c' + (a + 1), { dur: 0.45 * T, col: '#fff27a', pad: 5 });
              S.arcs.push({ kind: 'board', a: 'c' + (a + 1), b: 'c' + (j + 1), wrap, t0: g.t + 0.1 * T, dur: 0.45 * T, cy: ci });
              S.arcs.push({ kind: 'ground', from, to: j, t0: g.t, dur: FL, cy: ci });
              g.sfx(['coo', 'honk', 'pop', 'tap'][a]); g.sfx('whoosh');
              M.at(g, [[FL, g => { const n = M.node(g, 'c' + (a + 1)); n.col = '#b4f59a'; n.pop = g.t; M.indicate(g, n, { dur: 0.3 * T, col: '#9ae07a' });
                p.hopT = g.t; S.landT[a] = g.t; if (under >= 0) S.landT[under] = g.t; g.sfx('tap'); g.burst(SX[j], SY - 4, ['#fff6c0', '#9ae07a', '#ffffff'], 8, 90); }]]);
              // the cycle is closed: its arrows light up green one after another, and its animals cheer
              if (last) M.at(g, [[FL + 0.1 * T, g => { S.closed[ci] = g.t; g.sfx('ding'); M.indicate(g, M.node(g, 'cy' + ci), { dur: 0.45 * T, sc: 1.12, col: '#9ae07a' });
                for (const v of cy) S.landT[v - 1] = g.t + 0.1 * T * cy.indexOf(v); M.sparkle(g, 'cy' + ci, { n: 14, delay: 0.3 * T, cols: ['#9ae07a', '#fff6c0', '#fff'] }); }]]);
            } });
        }
        return out;
      },
      area(g) { const a = [0, 1, 2, 3].find(b => !S.moved[b] && S.sig[b] !== b); return a == null ? null : ['a' + a]; },
    });
    S.zones = () => [0, 1, 2, 3].forEach(a => { const p = S.pos[a]; M.zone(g, 'a' + a, { x: p.x, y: p.y - 30, w: 56, h: 58 }); });
    S.zones();
  },
  update(g, dt) {
    const S = g.s; M.update(g, dt);
    // every animal glides to its seat (stacked on the head of an animal that has not left yet)
    S.occ.forEach((o, j) => o.forEach((a, h) => { const p = S.pos[a], tx = SX[j], ty = SY - h * 50;
      if (p.fl) { const k = M.clamp((g.t - p.fl.t0) / p.fl.dur, 0, 1), e = M.easeIO(k); p.x = M.lerp(p.fl.x0, tx, e); p.y = M.lerp(p.fl.y0, ty, e) - Math.sin(e * Math.PI) * 74; if (k >= 1) p.fl = null; return; }
      const k = Math.min(1, dt * 10); p.x += (tx - p.x) * k; p.y += (ty - p.y) * k; }));
    S.zones();
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, won = g.done && g.result === 'win';
    SCN.std(g, c, { scene: 'meadow', panel: PANEL, panelY: 272, panelH: 120 });
    M.drawEx(g, c, 'cyc'); M.drawEx(g, c, 'key');
    // the chalk arrows on the board: number to next number above, the closing one loops back underneath
    for (const r of S.arcs) if (r.kind === 'board') { const A = M.box(g, r.a), B = M.box(g, r.b); if (!A || !B || t < r.t0) continue;
      const k = M.easeIO((t - r.t0) / r.dur), cl = S.closed[r.cy] > 0 ? M.clamp((t - S.closed[r.cy]) / 0.25, 0, 1) : 0, fade = S.closed[r.cy] > 0 ? M.clamp(1 - (t - S.closed[r.cy] - 1.1) / 0.4, 0, 1) : 1;
      if (fade <= 0) continue; const back = B.x < A.x, dy = back ? A.h * 0.5 + 2 : -A.h * 0.5 - 2;
      const a = [A.x + (back ? -4 : 6), A.y + dy], b = [B.x + (back ? 4 : -6), B.y + dy], d = Math.abs(b[0] - a[0]), bend = back ? 10 + d * 0.22 : -10 - d * 0.12;
      chalkArrow(c, a, b, bend, k, M.mix('#fff27a', '#9ae07a', cl), 3.2, fade); }

    // the stumps, numbered on the front
    SX.forEach((x, j) => {
      c.fillStyle = 'rgba(40,30,10,0.25)'; c.beginPath(); c.ellipse(x, SY + 38, 38, 8, 0, 0, 7); c.fill();
      c.fillStyle = '#8a5a34'; c.fillRect(x - 30, SY, 60, 38); c.fillStyle = '#6e4524'; c.fillRect(x - 30, SY + 30, 60, 8);
      c.fillStyle = '#d8b07a'; c.beginPath(); c.ellipse(x, SY, 30, 9, 0, 0, 7); c.fill(); c.strokeStyle = '#a8804a'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, SY, 18, 5, 0, 0, 7); c.stroke();
      c.fillStyle = '#fff4dc'; c.font = '700 22px Fredoka, Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(j + 1), x, SY + 21);
    });
    // the same arrows in the meadow: each animal's path from its stump to the new one draws itself as it hops
    for (const r of S.arcs) if (r.kind === 'ground' && t >= r.t0) { const k = M.easeIO((t - r.t0) / r.dur), cl = S.closed[r.cy] > 0 ? M.clamp((t - S.closed[r.cy]) / 0.25, 0, 1) : 0;
      const fade = S.closed[r.cy] > 0 ? M.clamp(1 - (t - S.closed[r.cy] - 1.1) / 0.4, 0, 1) : 1; if (fade <= 0) continue;
      const a = [SX[r.from], SY - 8], b = [SX[r.to], SY - 8], up = -Math.max(60, Math.abs(b[0] - a[0]) * 0.55) * 1.0;
      chalkArrow(c, a, b, up, k, M.mix('#fff6c0', '#9ae07a', cl), 4, fade * 0.95, true); }
    // the animals, lowest first (so one standing on a head is drawn in front)
    const order = []; S.occ.forEach(o => o.forEach((a, h) => order.push([h, a]))); order.sort((p, q) => p[0] - q[0]);
    const drag = K.press && K.press.dragging ? K.press : null;
    for (const [, a] of order) {
      const p = S.pos[a], hk = (t - p.hopT) / 0.3, hop = hk > 0 && hk < 1 ? Math.sin(hk * Math.PI) * 30 : 0;
      const bad = K.missInfo && (K.missInfo.drag === 'a' + a || K.missInfo.to === 'a' + a) && t - K.missAt < 0.45;
      let x = p.x + (bad ? Math.sin(t * 50) * 4 : 0), y = p.y - hop + (won ? -Math.abs(Math.sin(t * 6 + a)) * 10 : 0);
      if (drag && drag.id === 'a' + a) { c.globalAlpha = 0.3; }
      const flying = !!p.fl, lk = t - S.landT[a], cheer = lk > 0 && lk < 0.7, onHead = S.occ.some(o => o.indexOf(a) > 0), under = S.occ.some(o => o.length > 1 && o[0] === a);
      const pose = won || cheer ? 'cheer' : flying || hop > 0 ? 'hop' : onHead ? 'balance' : 'idle', expr = won || cheer ? 'laugh' : bad ? 'sad' : flying || under ? 'wow' : 'happy';
      if (typeof ANI !== 'undefined') ANI.draw(c, KINDS[a], x, y, 0.95, { t, phase: a, pose, expr, noShadow: flying || onHead });
      c.globalAlpha = 1;
    }
    if (drag && /^a\d$/.test(drag.id) && typeof ANI !== 'undefined') ANI.draw(c, KINDS[+drag.id[1]], drag.x, drag.y + 24, 1.05, { t, pose: 'hop', expr: 'wow' });
    M.drawUI(g, c);
  },
});
