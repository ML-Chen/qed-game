// ratios_table.js — RATIO TABLE! "2 : 3 = 8 : ?". A ratio table starts with one column, 2 over 3. The player grabs
// the table's right edge and stretches it: each new column is the first one times 2, times 3, ... with both rows
// scaling together. Letting go at the column whose known number matches (×4: 8 over 12) fills the ? with 12.
// Letting go at another column only wobbles, and the table springs back. The gesture runs on the kit: the edge is a
// zone ('grip') dragged onto column zones ('c2', 'c3', ...), so the kit's glow, ghost hand, bot and tray all work.
// The working is acted out after the drop (show your work): the table finishes stretching column by column, the known
// number in the equation and its match in the table are circled together, a "× 4" arrow arcs over the known row from
// the first column to the matching one, a second "× 4" arrow arcs under the other row, and that row's number swells,
// lifts out of the table and flies into the ?. The octopus points while it works and hops on every landing.
// Level 0: the top number is given, ×3 or ×4. Level 1: either row, up to ×5. Level 2: two blanks to fill, up to ×6.
const M = MK, LIGHT = '#fff6e0', GOLD = '#ffd970';
function gen(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k);
  let a = 1 + r(4), b = 2 + r(5); if (a === b) b++;
  const ks = L === 0 ? [3 + r(2)] : L === 1 ? [3 + r(3)] : (() => { const k1 = 2 + r(3); return [k1, k1 + 1 + r(2)]; })();
  return { a, b, tg: ks.map((k, i) => ({ k, row: L === 0 ? 0 : (L === 2 ? i : r(2)) })) };
}
const RY = [326, 368], X0 = 64; // the two rows, the centre of the first column
function geo(S) { S.maxK = Math.max(...S.tg.map(q => q.k)) + 2; S.cw = Math.min(54, (322 - X0) / (S.maxK - 0.5)); }
const colX = (S, j) => X0 + (j - 1) * S.cw, edgeX = (S, len) => colX(S, len) + S.cw / 2;
function build(g) {
  // nodes are kept between rebuilds so the equation never fades; the filled-in number appears at once (it lands from a flight)
  const S = g.s, N = S.nodes = S.nodes || {}, keep = (id, mk) => N[id] || (N[id] = mk());
  const items = [keep('ea', () => M.num(S.a, 'ea')), keep('k0', () => M.op(':', 'k0')), keep('eb', () => M.num(S.b, 'eb'))];
  S.tg.forEach((q, i) => { const known = keep('g' + i, () => M.num(q.row ? q.k * S.b : q.k * S.a, 'g' + i)), uid = 'u' + i;
    const blank = q.done ? keep(uid + 'v', () => M.num(q.row ? q.k * S.a : q.k * S.b, uid, { col: GOLD, pop: S.pops[uid], _born: -1 })) : keep(uid, () => M.slot(uid, { w: 30, col: LIGHT }));
    items.push(keep('q' + i, () => M.op('=', 'q' + i)), ...(q.row ? [blank, keep('k' + (i + 1), () => M.op(':', 'k' + (i + 1))), known] : [known, keep('k' + (i + 1), () => M.op(':', 'k' + (i + 1))), blank])); });
  M.place(g, 'eq', M.row(...items), 180, 238, S.tg.length > 1 ? 30 : 40, { col: LIGHT });
}
function zones(g) {
  const S = g.s; M.zone(g, 'grip', { x: edgeX(S, S.len) + 8, y: 347, w: 30, h: 96 });
  for (let j = 2; j <= S.maxK; j++) M.zone(g, 'c' + j, { x: edgeX(S, j) + 8, y: 347, w: S.cw, h: 150 });
}

MG.add({
  id: 'ratios_table', stage: 'ratios', cmd: 'RATIO TABLE!', hint: 'drag', time: 9, mood: 'bright', winText: 'Equal ratios!', hold: 1.4,
  card: {
    title: 'Ratio tables', ref: 'Grade 6', kind: 'Ratios and percents',
    text: 'A ratio compares two amounts. The ratio 2 : 3 (say "2 to 3") could mean 2 cups of juice for every 3 cups of water.\n\nA ratio table lists ratios that are all equal. Each new column multiplies both numbers of the first column by the same number. So 2 : 3 is equal to 4 : 6 (times 2), 6 : 9 (times 3) and 8 : 12 (times 4).\n\nTo find a missing number, find the column whose known number matches. For 2 : 3 = 8 : ?, the top row reaches 8 at times 4, so the bottom number is 3 × 4 = 12.\n\nBoth numbers must be multiplied by the same number. Adding the same amount to both would change the mix.',
    note: 'Multiply both parts of a ratio by the same number to get an equal ratio: 2 : 3 = (2 × 4) : (3 × 4) = 8 : 12.',
    ask: 'Fill in 3 : 5 = 9 : ?. Fill in 4 : 7 = ? : 21.',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, gen(g)); S.pops = {}; geo(S); S.len = 1; S.base = 1; S.shown = 1;
    build(g); zones(g); M.inert(g, ['k0', 'k1', 'k2', 'q0', 'q1']);
    g.dur *= (2.6 + 1.05 * 2 * S.tg.length) / 8;
    const T = S.T = M.pace(g), hop = (g, e) => { g.s.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    // a table cell as a box (for circles, arrows and flights): column j, row r
    // the "× k" of an arrow: over the top row it is the column's own ×k label, which swells and glows; under the
    // bottom row a chalk "× k" writes itself and fades
    const say = (g, up, col, o) => { const q = S.work; if (up) { S.labAt = g.t + (o.delay || 0); S.labCol = col; return; }
      M.note(g, { node: M.row(M.op('×'), M.num(q.k)), at: [(colX(S, 1) + colX(S, q.k)) / 2, 414], s: 20, col, ...o }); };
    const cell = (j, r) => ({ x: colX(S, j), y: RY[r], w: Math.min(S.cw - 6, 40), h: 30 });
    M.play(g, {
      moves(g) {
        // stretch the table's edge to the column whose known number matches; the blank fills in
        return S.tg.filter(q => !q.done).map(q => { const i = S.tg.indexOf(q), kr = q.row ? 1 : 0, ur = 1 - kr, v = q.row ? q.k * S.a : q.k * S.b;
          return { drag: 'grip', to: 'c' + q.k, reach: 8, busy: 0.1, askAt: 1, after: 0.62 * T,
          ask: { v, wrong: q.row ? [q.k * S.b - (S.b - S.a), q.k * S.a + S.a, q.k * S.a - 1] : [q.k * S.a + (S.b - S.a), q.k * S.b + S.b, q.k * S.b + 1] },
          then(g) {
            // the table finishes stretching out to the matching column, one column at a time
            const from = Math.min(S.len, q.k), g0 = Math.max(0, Math.ceil(q.k - from - 0.3)) * 0.14 * T;
            S.grow = { from, to: q.k, t0: g.t, dur: g0 }; S.base = q.k; S.hitK = q.k; S.hitAt = g.t + g0; S.work = q; S.point = true;
            this.askAt = g0 + 0.95 * T; M.show(g, this.askAt); g.sfx('whoosh'); hop(g, 'wow');
            M.at(g, [
              [g0 + 0.02 * T, g => { // the known number and its match in the table light up together
                M.circle(g, 'g' + i, { dur: 0.55 * T, col: GOLD }); M.circle(g, [cell(q.k, kr)], { dur: 0.55 * T, col: GOLD, pad: 3 });
                M.indicate(g, 'g' + i, { dur: 0.35 * T, col: GOLD }); S.lit = { [q.k + ':' + kr]: g.t }; g.sfx('sparkle'); }],
              [g0 + 0.28 * T, g => { // × k along the known row, then along the other row: both numbers scale together
                S.arrowAt = g.t; const up = kr === 0;
                M.arrow(g, [cell(1, kr)].map(b => ({ ...b, y: b.y + (up ? -16 : 16) })), [cell(q.k, kr)].map(b => ({ ...b, y: b.y + (up ? -16 : 16) })), { dur: 0.34 * T, bend: up ? 26 : -26, col: GOLD, linger: 0.7 * T });
                say(g, up, GOLD, { write: 0.2 * T, hold: 0.55 * T, fade: 0.25 * T, delay: 0.14 * T }); }],
              [g0 + 0.62 * T, g => { const up = ur === 0; g.sfx('swoosh');
                M.arrow(g, [cell(1, ur)].map(b => ({ ...b, y: b.y + (up ? -16 : 16) })), [cell(q.k, ur)].map(b => ({ ...b, y: b.y + (up ? -16 : 16) })), { dur: 0.3 * T, bend: up ? 26 : -26, col: '#9ae8ff', linger: 0.5 * T });
                say(g, up, '#9ae8ff', { write: 0.18 * T, hold: 0.35 * T, fade: 0.2 * T, delay: 0.12 * T }); }],
              [g0 + 0.92 * T, g => { S.lit = { ...S.lit, [q.k + ':' + ur]: g.t }; hop(g, 'think'); g.sfx('tap'); }],
            ]); },
          resolve(g) { M.show(g, 0.62 * T); const b = cell(q.k, ur); S.lift = { k: q.k, r: ur, t0: g.t };
            M.fly(g, { node: M.num(v), col: GOLD, from: [b.x, b.y], to: 'u' + i, dur: 0.42 * T, arc: -50, s0: 22, s1: S.tg.length > 1 ? 30 : 40,
              then(g) { q.done = true; S.pops['u' + i] = g.t; g.sfx('coin'); build(g); hop(g, 'laugh'); S.point = false; S.lift = null;
                const bb = M.box(g, 'u' + i); if (bb) g.burst(bb.x, bb.y, [GOLD, '#fff', '#7ad0ff'], 12, 130); } });
            M.at(g, [[0.6 * T, g => { S.work = null; }]]); } }; });
      },
      area(g) { return ['grip']; },
    });
  },
  update(g, dt) {
    const S = g.s, Pr = S.mk.press; M.update(g, dt);
    if (S.grow && g.t < S.grow.t0 + S.grow.dur + 0.05) S.len = M.lerp(S.grow.from, S.grow.to, M.clamp((g.t - S.grow.t0) / Math.max(0.01, S.grow.dur), 0, 1));
    else if (Pr && Pr.id === 'grip' && Pr.dragging) S.len = M.clamp((Pr.x - 8 - X0 - S.cw / 2) / S.cw + 1, 1, S.maxK);
    else if (S.len !== S.base) { S.len += (S.base - S.len) * Math.min(1, dt * 14); if (Math.abs(S.len - S.base) < 0.01) S.len = S.base; }
    const sh = Math.floor(S.len + 0.35); if (sh > S.shown) g.sfx('tap'); S.shown = sh; zones(g);
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.std(g, c, { scene: 'reef', panel: 'none' }); host(g, c, 286, 604, 1.3);
    // the equation on a strip of sea glass
    c.fillStyle = 'rgba(10,40,70,0.55)'; c.beginPath(); c.roundRect(24, 196, 312, 62, 16); c.fill(); c.strokeStyle = 'rgba(160,230,255,0.5)'; c.lineWidth = 2; c.stroke();
    // the table: a frame out to the edge, one column per multiple, the ×j above each column
    const ex = edgeX(S, S.len), x0 = X0 - S.cw / 2 - 6, wob = K.missAt > 0 && t - K.missAt < 0.4 ? Math.sin((t - K.missAt) * 50) * 4 : 0;
    c.save(); c.translate(wob, 0);
    c.fillStyle = 'rgba(8,30,60,0.6)'; c.beginPath(); c.roundRect(x0, 302, ex - x0, 90, 12); c.fill(); c.strokeStyle = 'rgba(180,235,255,0.8)'; c.lineWidth = 2; c.stroke();
    c.beginPath(); c.moveTo(x0 + 4, 347); c.lineTo(ex - 4, 347); c.stroke();
    c.textAlign = 'center';
    for (let j = 1; j <= Math.floor(S.len + 0.35); j++) {
      const x = colX(S, j), hit = S.tg.some(q => q.done && q.k === j) || (S.hitK === j && t - S.hitAt < 2), ap = M.clamp((S.len - j + 0.35) / 0.3, 0, 1);
      if (j > 1) { c.strokeStyle = 'rgba(180,235,255,0.35)'; c.beginPath(); c.moveTo(x - S.cw / 2, 306); c.lineTo(x - S.cw / 2, 388); c.stroke(); }
      if (hit) { c.fillStyle = 'rgba(255,217,112,0.25)'; c.fillRect(x - S.cw / 2 + 2, 304, S.cw - 4, 86); }
      c.globalAlpha = ap; c.font = M.NUMF(S.cw < 40 ? 20 : 24);
      for (let r = 0; r < 2; r++) { const lt = S.lit && S.lit[j + ':' + r], lk = lt != null ? M.clamp((t - lt) / 0.25, 0, 1) : 0, sw = lt != null ? 1 + 0.35 * Math.sin(Math.min(1, (t - lt) / 0.4) * Math.PI) : 1;
        if (S.lift && S.lift.k === j && S.lift.r === r && t - S.lift.t0 < 0.1) continue; // it is lifting out toward the ?
        c.save(); c.translate(x, RY[r] + 8); c.scale(sw, sw); if (lk > 0) { c.shadowColor = GOLD; c.shadowBlur = 14 * lk; }
        c.fillStyle = lk > 0.5 ? '#fff2b0' : j === 1 ? LIGHT : hit ? GOLD : '#c8f0ff'; c.fillText(String(j * (r ? S.b : S.a)), 0, 0); c.restore(); }
      if (j > 1) { const wk = S.work && S.work.k === j, dim = S.work && !wk ? 0.2 : 1; c.save(); c.globalAlpha *= dim; c.font = M.NUMF(wk ? 16 : 14, wk ? 700 : 500); c.fillStyle = wk ? (S.labCol || GOLD) : 'rgba(200,240,255,0.85)'; if (wk) { c.shadowColor = GOLD; c.shadowBlur = 10; }
        const ls = wk && S.labAt != null && t > S.labAt ? 1 + 0.5 * Math.sin(M.clamp((t - S.labAt) / (0.45 * S.T), 0, 1) * Math.PI) : 1; c.translate(x, 296); c.scale(ls, ls); c.fillText('×' + j, 0, 0); c.restore(); }
      c.globalAlpha = 1;
    }
    c.restore();
    // the grip on the edge: a tab with arrows
    const gx = ex + 8 + wob, p = 0.5 + 0.5 * Math.sin(t * 5);
    c.fillStyle = '#ff9a6a'; c.beginPath(); c.roundRect(gx - 9, 314, 18, 66, 9); c.fill(); c.strokeStyle = '#fff1e0'; c.lineWidth = 2; c.stroke();
    c.fillStyle = '#fff1e0'; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(gx + s * (14 + p * 3), 347); c.lineTo(gx + s * (8 + p * 3), 341); c.lineTo(gx + s * (8 + p * 3), 353); c.fill(); }
    M.drawEx(g, c, 'eq'); M.drawUI(g, c);
  },
});
// the octopus points at the table while the work is shown, and hops when a step lands
function host(g, c, x, y, s) {
  const S = g.s, K = S.mk, hop = K.lastMove != null && g.t - K.lastMove < 0.35 ? Math.sin((g.t - K.lastMove) / 0.35 * Math.PI) : 0;
  const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
  const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && g.t - S.faceT < 0.6 ? S.face : 'happy';
  const pose = won ? 'cheer' : hop > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
  if (typeof ANI !== 'undefined') ANI.draw(c, 'octopus', x, y - hop * 22, s, { t: g.t, pose, expr, facing: -1 }); else SCN.host(g, c, 'octopus', x, y, s);
}
