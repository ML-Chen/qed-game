// ratios_table.js — RATIO TABLE! "2 : 3 = 8 : ?". A ratio table starts with one column, 2 over 3. The player grabs
// the table's right edge and stretches it: each new column is the first one times 2, times 3, ... with both rows
// scaling together. Letting go at the column whose known number matches (×4: 8 over 12) fills the ? with 12.
// Letting go at another column only wobbles, and the table springs back. The gesture runs on the kit: the edge is a
// zone ('grip') dragged onto column zones ('c2', 'c3', ...), so the kit's glow, ghost hand, bot and tray all work.
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
  const S = g.s, pp = id => ({ pop: S.pops[id] });
  const items = [M.num(S.a, 'ea'), M.op(':', 'k0'), M.num(S.b, 'eb')];
  S.tg.forEach((q, i) => { const known = M.num(q.row ? q.k * S.b : q.k * S.a, 'g' + i), blank = q.done ? M.num(q.row ? q.k * S.a : q.k * S.b, 'u' + i, { col: GOLD, ...pp('u' + i) }) : M.slot('u' + i, { w: 30, col: LIGHT });
    items.push(M.op('=', 'q' + i), ...(q.row ? [blank, M.op(':', 'k' + (i + 1)), known] : [known, M.op(':', 'k' + (i + 1)), blank])); });
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
    M.play(g, {
      moves(g) {
        // stretch the table's edge to the column whose known number matches; the blank fills in
        return S.tg.filter(q => !q.done).map(q => ({ drag: 'grip', to: 'c' + q.k, reach: 8, busy: 0.1, askAt: 0, after: 0.1,
          ask: { v: q.row ? q.k * S.a : q.k * S.b, wrong: q.row ? [q.k * S.b - (S.b - S.a), q.k * S.a + S.a, q.k * S.a - 1] : [q.k * S.a + (S.b - S.a), q.k * S.b + S.b, q.k * S.b + 1] },
          then(g) { S.len = S.base = q.k; S.hitK = q.k; S.hitAt = g.t; g.sfx('sparkle'); zones(g); },
          resolve(g) { q.done = true; S.pops['u' + S.tg.indexOf(q)] = g.t; g.sfx('coin'); build(g); const b = M.box(g, 'u' + S.tg.indexOf(q)); if (b) g.burst(b.x, b.y, [GOLD, '#fff', '#7ad0ff'], 12, 130); } }));
      },
      area(g) { return ['grip']; },
    });
  },
  update(g, dt) {
    const S = g.s, Pr = S.mk.press; M.update(g, dt);
    if (Pr && Pr.id === 'grip' && Pr.dragging) S.len = M.clamp((Pr.x - 8 - X0 - S.cw / 2) / S.cw + 1, 1, S.maxK);
    else if (S.len !== S.base) { S.len += (S.base - S.len) * Math.min(1, dt * 14); if (Math.abs(S.len - S.base) < 0.01) S.len = S.base; }
    const sh = Math.floor(S.len + 0.35); if (sh > S.shown) g.sfx('tap'); S.shown = sh; zones(g);
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.std(g, c, { scene: 'reef', panel: 'none', host: 'octopus', hostX: 286, hostY: 604, hostS: 1.3 });
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
      c.globalAlpha = ap; c.fillStyle = j === 1 ? LIGHT : hit ? GOLD : '#c8f0ff'; c.font = M.NUMF(S.cw < 40 ? 20 : 24);
      c.fillText(String(j * S.a), x, RY[0] + 8); c.fillText(String(j * S.b), x, RY[1] + 8);
      if (j > 1) { c.font = M.NUMF(14, 500); c.fillStyle = 'rgba(200,240,255,0.85)'; c.fillText('×' + j, x, 296); }
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
