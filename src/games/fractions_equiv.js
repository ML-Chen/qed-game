// fractions_equiv.js — EQUIVALENT! 2/3 = ?/12, shown with a chocolate bar in a candy shop: 2 of its 3 pieces are
// frosted pink. Three moves, each acted out by itself (show your work):
//   1. drag the 3 onto the 12 (or the 12 onto the 3): both are circled and "3 × ? = 12" writes itself under them; the ?
//      rolls over to 4, and the "× 4" lifts out of the note as a little candy tag.
//   2. drag the "× 4" tag onto the bar (or onto 2/3): the tag splits in two and a "× 4" flies onto the top and onto the
//      bottom of 2/3, which reads (2 × 4)/(3 × 4); then a knife cuts every piece of the bar into 4, one groove at a
//      time, while the bottom "3 × 4" glows: 3 pieces become 12, and the frosting stays exactly the same size.
//   3. tap the ?: the frosted pieces are counted one by one with little badges (1, 2, ... 8) while the top "2 × 4"
//      glows, the last badge (8) flies up into the ?, and the "× 4"s fade so the board reads 2/3 = 8/12.
// Mistakes: dragging the top 2 onto the 12, or tapping the ? first, only wobble.
// Level 0: halves, thirds and quarters times 2 or 3. Level 1: times up to 4. Level 2: fifths and sixths too.
// Medium mode: the tray asks for the multiplier (4) and for the new top (8).
const M = MK, BX0 = 34, BX1 = 326, BY = 408, BH = 56, EY = 262, TAGY = 330, INK = '#4a1e3a', PINK = '#ff7aa8', GOLD = '#e88a10';
function pick(g) {
  const L = g.level, ri = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (let i = 0; i < 100; i++) {
    const d = L === 2 ? ri(3, 6) : ri(2, 4), k = L === 0 ? ri(2, 3) : ri(2, 4), n = ri(1, d - 1);
    const gcd = (x, y) => y ? gcd(y, x % y) : x;
    if (d * k > (L === 0 ? 12 : L === 1 ? 16 : 24) || gcd(n, d) !== 1 || (L === 2 && d < 5 && g.rand() < 0.5)) continue;
    return { n, d, k };
  }
  return { n: 2, d: 3, k: 4 };
}
function rr(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// ---------------- the candy shop (baked) ----------------
function shop(c, W, H) {
  const wall = c.createLinearGradient(0, 0, 0, H); wall.addColorStop(0, '#c8f0e0'); wall.addColorStop(1, '#a0dcc8'); c.fillStyle = wall; c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(255,255,255,0.35)'; for (let x = 0; x < W; x += 36) c.fillRect(x, 0, 16, H);
  // the striped awning
  for (let i = 0; i < 10; i++) { c.fillStyle = i % 2 ? '#fff6f0' : '#ff6a8a'; c.fillRect(i * 36, 0, 36, 44); c.beginPath(); c.arc(i * 36 + 18, 44, 18, 0, Math.PI); c.fill(); }
  c.fillStyle = 'rgba(120,30,60,0.18)'; c.fillRect(0, 62, W, 4);
  // shelves of candy jars at the sides
  const R = P.rng(12);
  for (const [y, x0, x1] of [[176, 0, 52], [176, 308, 360], [470, 0, 360]]) { c.fillStyle = '#b07a4a'; c.fillRect(x0, y, x1 - x0, 7); c.fillStyle = 'rgba(80,40,20,0.25)'; c.fillRect(x0, y + 7, x1 - x0, 4); }
  for (const x of [8, 32, 316, 340]) { const col = ['#ffb84a', '#7ad0ff', '#ff7aa8', '#9ae07a'][Math.floor(R() * 4)];
    c.fillStyle = 'rgba(255,255,255,0.55)'; rr(c, x - 10, 140, 20, 36, 6); c.fill(); for (let k = 0; k < 6; k++) { c.fillStyle = col; c.beginPath(); c.arc(x - 5 + (k % 2) * 10, 168 - Math.floor(k / 2) * 8, 4, 0, 7); c.fill(); }
    c.fillStyle = '#d06a8a'; c.fillRect(x - 8, 134, 16, 6); }
  // the counter the bar sits on
  const top = c.createLinearGradient(0, 360, 0, 470); top.addColorStop(0, '#e8c090'); top.addColorStop(1, '#c8965a'); c.fillStyle = top; c.fillRect(0, 368, W, 102);
  c.fillStyle = 'rgba(255,255,255,0.25)'; c.fillRect(0, 368, W, 4);
  const front = c.createLinearGradient(0, 470, 0, H); front.addColorStop(0, '#ff9ab8'); front.addColorStop(1, '#e8608a'); c.fillStyle = front; c.fillRect(0, 477, W, H - 477);
  c.fillStyle = 'rgba(255,255,255,0.3)'; for (let x = 12; x < W; x += 48) { rr(c, x, 500, 30, 120, 10); c.fill(); }
  // a striped paper the bar lies on
  c.fillStyle = 'rgba(90,40,20,0.2)'; rr(c, 20, 382, 320, 64, 10); c.fill(); c.fillStyle = '#fff8ee'; rr(c, 18, 376, 324, 64, 10); c.fill();
  c.strokeStyle = 'rgba(255,106,138,0.35)'; c.lineWidth = 3; for (let x = 30; x < 340; x += 18) { c.beginPath(); c.moveTo(x, 378); c.lineTo(x - 10, 438); c.stroke(); }
}

MG.add({
  id: 'fractions_equiv', stage: 'fractions', cmd: 'EQUIVALENT!', hint: 'drag', time: 10, mood: 'bright', winText: 'Same amount!', hold: 1.7,
  card: {
    title: 'Equivalent fractions', ref: 'Grade 3', kind: 'Fractions',
    text: 'Equivalent fractions are different names for the same amount. For example, 2/3 and 8/12 are equivalent.\n\nPicture a bar cut into 3 equal pieces, with 2 of them frosted. Now cut every piece into 4 smaller pieces. The bar has 3 × 4 = 12 pieces, and the frosting covers 2 × 4 = 8 of them. The frosting did not change, so 2/3 = 8/12.\n\nSo the rule is: multiply the top and the bottom by the same number. To find that number, ask what the old bottom must be multiplied by to make the new bottom. Here 3 × 4 = 12, so you multiply by 4.',
    note: 'Multiply the top and the bottom of a fraction by the same number, and you get an equivalent fraction.',
    ask: 'Fill in: 1/2 = ?/8. Fill in: 3/4 = ?/12.',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { n, d, k } = S;
    S.m = d; S.cuts = null; S.badges = null; S.point = false;
    S.na = M.num(n, 'na'); S.da = M.num(d, 'da'); S.fl = M.frac(S.na, S.da, 'fl');
    S.slot = M.slot('ans'); S.db = M.num(d * k, 'db'); S.fr = M.frac(S.slot, S.db, 'fr');
    S.ex = M.row(S.fl, M.op('=', 'eq'), S.fr);
    S.relay = () => M.place(g, 'ex', S.ex, 180, EY, 62, { col: INK }); S.relay();
    M.inert(g, ['eq', 'fl', 'fr']);
    M.zone(g, 'bar', { x: 180, y: BY, w: BX1 - BX0, h: BH });
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const face = (e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    M.play(g, {
      moves(g) {
        const T = M.pace(g);
        // 1. what turns the old bottom into the new bottom?
        if (!S.found) {
          const go = { busy: 0.1, askAt: 0.75 * T, after: 0.95 * T, ask: { v: k, wrong: [d * k - d, k + 1, k - 1, d].filter(w => w > 0 && w !== k) },
            then(g) { S.found = true; M.show(g, 0.75 * T); S.point = true; face('think');
              M.circle(g, 'da', { dur: 0.5 * T, col: GOLD }); M.circle(g, 'db', { dur: 0.5 * T, col: GOLD, delay: 0.12 * T }); M.light(g, 'da', { col: GOLD }); M.light(g, 'db', { col: GOLD });
              S.qk = M.num('?', 'qk', { col: GOLD }); S.note = M.row(M.num(d, 'q1'), M.op('×', 'qx', { col: GOLD }), S.qk, M.op('=', 'qe'), M.num(d * k, 'q2')); S.note.id = 'qn';
              M.place(g, 'note', S.note, 180, TAGY + 12, 36, { col: INK }); M.inert(g, ['qn', 'q1', 'qx', 'qk', 'qe', 'q2']); M.writeIn(g, S.note, { dur: 0.45 * T, delay: 0.2 * T }); },
            resolve(g) { M.show(g, 0.95 * T); M.roll(g, S.qk, k, { dur: 0.3 * T }); M.indicate(g, S.qk, { delay: 0.25 * T, dur: 0.3 * T, sc: 1.4 }); g.sfx('ding'); face();
              M.at(g, [[0.55 * T, g => { // the "× k" lifts out of the note as a candy tag; the rest of the note fades
                for (const id of ['q1', 'qe', 'q2']) M.tween(g, id, { alpha: 0 }, 0.2 * T);
                const bx = M.box(g, 'qx'), bk = M.box(g, 'qk'); for (const id of ['qx', 'qk']) M.tween(g, id, { alpha: 0 }, 0.12 * T);
                S.tag = M.row(M.op('×', 'tx', { col: '#ffffff' }), M.num(k, 'tk', { col: '#ffffff' })); S.tag.id = 'kc'; S.tag.alpha = 0;
                M.place(g, 'tag', S.tag, 180, TAGY + 12, 34, { col: '#ffffff' }); M.inert(g, ['tx', 'tk']);
                M.fly(g, { node: M.row(M.op('×', null, { col: GOLD }), M.num(k, null, { col: GOLD })), from: [(bx.x + bk.x) / 2, bk.y], to: 'kc', dur: 0.3 * T, arc: -26, s0: 32, s1: 34,
                  then(g) { S.tag.alpha = 1; S.tag.pop = g.t; S.tagOn = g.t; M.sparkle(g, 'kc', { n: 10, cols: [PINK, '#fff', GOLD] }); g.sfx('pop'); face('laugh'); } });
                M.unlight(g, 'da'); M.unlight(g, 'db'); }],
                [0.9 * T, g => { delete g.s.mk.ex.note; S.point = false; }]]); } };
          return [{ drag: 'da', to: 'db', ...go }, { drag: 'db', to: 'da', ...go }];
        }
        // 2. multiply top and bottom: the tag splits onto 2/3 and the knife cuts every piece into k
        if (!S.cut) {
          const area = [0, BY - BH / 2 - 26, 360, BY + BH / 2 + 26];
          const go = { busy: 0.1, area, then(g) { S.cut = true; const T = M.pace(g), cutDur = 0.12 * T, per = Math.min(0.1 * T, 0.9 * T / (d * (k - 1)));
            M.show(g, 0.55 * T + d * (k - 1) * per + cutDur + 0.35 * T); S.point = true; face('think');
            const from = { ...M.box(g, 'kc') }; S.tag.alpha = 0; S.tagOn = null; g.sfx('swoosh');
            S.kt = M.num(k, 'kt', { col: GOLD, alpha: 0, _born: -1 }); S.kb = M.num(k, 'kb', { col: GOLD, alpha: 0, _born: -1 });
            S.xt = M.op('×', 'xt', { col: GOLD, alpha: 0, _born: -1 }); S.xb = M.op('×', 'xb', { col: GOLD, alpha: 0, _born: -1 });
            S.fl.n = M.row(S.na, S.xt, S.kt); S.fl.n.id = 'top'; S.fl.d = M.row(S.da, S.xb, S.kb); S.fl.d.id = 'bot'; S.fl.bar = { t0: g.t, dur: 0.32 * T }; S.relay(); M.inert(g, ['kt', 'kb', 'xt', 'xb', 'top', 'bot']);
            for (const [x, kk, id] of [[S.xt, S.kt, 'kt'], [S.xb, S.kb, 'kb']]) M.fly(g, { node: M.row(M.op('×', null, { col: GOLD }), M.num(k, null, { col: GOLD })), from: [from.x, from.y], to: id, toOff: [-14, 0], dur: 0.4 * T, arc: id === 'kt' ? -70 : -20, s0: 34, s1: 38,
              then(g) { x.alpha = 1; kk.alpha = 1; kk.pop = g.t; M.sparkle(g, id, { n: 6, cols: [GOLD, '#fff'] }); g.sfx('tap'); } });
            M.at(g, [[0.5 * T, g => { // the knife: every piece is cut into k, groove by groove, while the bottom glows
              S.cuts = { t0: g.t, per, dur: cutDur }; M.light(g, S.fl.d, { col: GOLD }); M.indicate(g, S.fl.d, { sc: 1.15, dur: 0.4 * T }); face(); }],
              [0.5 * T + d * (k - 1) * per + cutDur, g => { S.m = d * k; g.sfx('ding'); face('laugh'); g.burst(180, BY, [PINK, '#fff', '#7a4a2a'], 12, 130); M.unlight(g, S.fl.d); S.point = false; }]]);
            // a soft tick for every groove
            for (let i = 0; i < d * (k - 1); i++) M.later(g, 0.5 * T + i * per, g => g.sfx('tap', { vol: 0.3, pitch: 1.4 }));
          } };
          return [{ drag: 'kc', to: ['bar', 'na', 'da'], ...go }];
        }
        // 3. count the frosted pieces: that is the new top
        if (S.done) return [];
        const nk = n * k, per = Math.min(0.12 * T, 0.7 * T / nk), cnt = 0.25 * T + nk * per;
        return [{ tap: 'ans', busy: 0.1, askAt: cnt + 0.1 * T, after: 1.0 * T, ask: { v: nk, wrong: [n + k, d * k - nk, nk + k, nk + 1].filter(w => w > 0 && w !== nk) },
          then(g) { S.done = true; M.show(g, cnt + 0.1 * T); S.point = true; face('think');
            M.light(g, S.fl.n, { col: PINK }); M.circle(g, S.fl.n, { dur: 0.5 * T, col: PINK });
            M.at(g, [[0.25 * T, g => { S.badges = { t0: g.t, per, n: nk }; }]]);
            for (let i = 0; i < nk; i++) M.later(g, 0.25 * T + i * per, g => g.sfx('tap', { vol: 0.4, pitch: 0.9 + i * 0.05 }), true); },
          resolve(g) { M.show(g, 1.0 * T); g.sfx('swoosh'); face();
            const w = (BX1 - BX0) / (d * k), x = BX0 + (nk - 0.5) * w;
            S.flyLast = true; // the last badge lifts off the bar and flies into the ?
            M.fly(g, { node: M.num(nk, null, { col: '#d0306a' }), from: [x, BY - BH / 2 - 4], to: 'ans', dur: 0.45 * T, arc: -50, s0: 22, s1: 44,
              then(g) { S.slot.fill = M.num(nk, 'res', { col: '#d0306a', _born: -1 }); S.slot.fill.pop = g.t; S.relay(); M.inert(g, ['res']); M.sparkle(g, 'ans', { n: 14, cols: [PINK, '#fff', GOLD] }); g.sfx('coin'); face('laugh'); } });
            M.at(g, [[0.6 * T, g => { // the multipliers have done their job: 2/3 is back, equal to 8/12
              for (const q of [S.xt, S.kt, S.xb, S.kb]) M.tween(g, q, { alpha: 0 }, 0.22 * T); M.unlight(g, S.fl.n); }],
              [0.85 * T, g => { S.fl.n = S.na; S.fl.d = S.da; S.fl.bar = { t0: g.t, dur: 0.3 * T }; S.relay(); S.point = false; S.badges = null; S.flyLast = false; }]]); } }];
      },
      area(g) { const mv = M.current(g)[0]; return mv ? [].concat(mv.tap || mv.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, { n, d, k } = S, W = BX1 - BX0;
    c.drawImage(g.bake('fractions_equiv_shop', shop), 0, 0, 360, 640);
    // the menu board with the problem
    c.fillStyle = 'rgba(90,30,60,0.25)'; rr(c, 34, 196, 296, 160, 18); c.fill(); c.fillStyle = '#fffaf2'; rr(c, 32, 190, 296, 160, 18); c.fill(); c.strokeStyle = PINK; c.lineWidth = 5; c.stroke();
    c.strokeStyle = 'rgba(255,122,168,0.3)'; c.lineWidth = 2; c.setLineDash([5, 5]); rr(c, 42, 200, 276, 140, 12); c.stroke(); c.setLineDash([]);
    M.drawEx(g, c, 'ex'); M.drawEx(g, c, 'note');
    // the "× k" candy tag
    if (K.ex.tag && S.tag.alpha > 0) { const b = M.box(g, 'kc'), wob = S.tagOn ? Math.sin(t * 4) * 0.04 : 0; if (b) { c.save(); c.translate(b.x, b.y); c.rotate(wob); c.fillStyle = 'rgba(90,30,60,0.25)'; rr(c, -b.w / 2 - 12, -b.h / 2 - 5, b.w + 24, b.h + 12, 14); c.fill();
      c.fillStyle = PINK; rr(c, -b.w / 2 - 12, -b.h / 2 - 8, b.w + 24, b.h + 12, 14); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 2; c.setLineDash([4, 3]); rr(c, -b.w / 2 - 8, -b.h / 2 - 4, b.w + 16, b.h + 4, 10); c.stroke(); c.restore(); } M.drawEx(g, c, 'tag'); }
    // the chocolate bar: d pieces (k times as many once cut), the first n of the d pieces frosted pink
    const pw = W / d, gap = 4;
    for (let i = 0; i < d; i++) { const x = BX0 + i * pw + gap / 2, w = pw - gap, y = BY - BH / 2;
      c.fillStyle = 'rgba(60,20,10,0.3)'; rr(c, x + 2, y + 4, w, BH, 8); c.fill();
      const cg = c.createLinearGradient(0, y, 0, y + BH); cg.addColorStop(0, '#8a5232'); cg.addColorStop(1, '#5a301a'); c.fillStyle = cg; rr(c, x, y, w, BH, 8); c.fill();
      c.fillStyle = 'rgba(255,220,180,0.18)'; rr(c, x + 4, y + 4, w - 8, 8, 4); c.fill();
      if (i < n) { c.fillStyle = PINK; rr(c, x + 3, y + 3, w - 6, BH - 14, 7); c.fill(); c.fillStyle = '#ffb0cc'; rr(c, x + 6, y + 6, w - 12, 6, 3); c.fill();
        c.fillStyle = PINK; for (let j = 0; j < 3; j++) { c.beginPath(); c.ellipse(x + w * (0.2 + j * 0.3), y + BH - 11, 5, 6, 0, 0, 7); c.fill(); }
        const R = P.rng(i * 31 + 5); for (let j = 0; j < 7; j++) { c.fillStyle = ['#fff', '#7ad0ff', '#ffe07a'][j % 3]; c.save(); c.translate(x + 8 + R() * (w - 16), y + 10 + R() * (BH - 30)); c.rotate(R() * 3); c.fillRect(-3, -1, 6, 2.2); c.restore(); } } }
    // the grooves the knife cuts (each piece into k): a dark line with a light edge, plus a glinting knife tip
    if (S.cuts || S.m > d) { const C = S.cuts || { t0: -99, per: 0, dur: 0.01 }; let idx = 0;
      for (let i = 0; i < d; i++) for (let j = 1; j < k; j++, idx++) { const p = M.clamp((t - C.t0 - idx * C.per) / C.dur, 0, 1); if (p <= 0) continue; const x = BX0 + i * pw + j * pw / k, y0 = BY - BH / 2 - 2, y1 = y0 + (BH + 4) * M.easeIO(p);
        c.strokeStyle = 'rgba(40,10,10,0.75)'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y1); c.stroke(); c.strokeStyle = 'rgba(255,230,210,0.5)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x + 2, y0); c.lineTo(x + 2, y1); c.stroke();
        if (p < 1) { c.save(); c.translate(x, y1); c.fillStyle = '#e8eef4'; c.strokeStyle = '#7a8a9a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-3, -46); c.lineTo(3, -46); c.lineTo(3, 0); c.lineTo(-3, -6); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#7a4a2a'; rr(c, -4, -72, 8, 26, 3); c.fill(); c.restore(); } } }
    // counting badges on the frosted small pieces
    if (S.badges) { const B = S.badges, w = W / (d * k); for (let i = 0; i < B.n; i++) { const kk = M.clamp((t - B.t0 - i * B.per) / 0.18, 0, 1); if (kk <= 0) continue; if (S.flyLast && i === B.n - 1 && g.t > B.t0 + B.n * B.per + 0.05) continue;
      const x = BX0 + (i + 0.5) * w, y = BY - BH / 2 - 4, r = Math.min(12, w * 0.4 + 1) * (1 + Math.sin(kk * Math.PI) * 0.35); c.fillStyle = '#fff'; c.strokeStyle = '#d0306a'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#d0306a'; c.font = M.NUMF(Math.min(15, r * 1.2)); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(i + 1), x, y + 1); } }
    // the hedgehog shopkeeper points while the work is shown and hops when a step lands
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 && S.face !== 'think' ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'hedgehog', 296, 612 - (S.face !== 'think' ? hopK * 20 : 0), 1.25, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'hedgehog', 296, 612, 1.25);
    M.drawUI(g, c);
  },
});
