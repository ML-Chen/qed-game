// ratios_discount.js — DISCOUNT! "20% off $35": find the discount, then take it off the price.
// A toy-shop window on a snowy blue-hour street, lit warm from inside, with a fox shopper outside. A long price tag
// hangs in the window: it stands for the whole price. A chalk sign above it reads "$35" and a red sticker says
// "20% OFF". Every move's working plays by itself:
//   1. Drag the sticker onto the tag (or onto the price): the tag is cut into equal pieces by dashed lines (5 pieces
//      for 20%, 4 for 25%, 10 for 30%...), the pieces that make the percent turn red and get a "20%" label, and the
//      note "35 ÷ 5 = 7" writes itself under the tag; the $7 flies up into the sign, which reads "$35 − $7".
//   2. Tap "− $7" (or the red part of the tag): scissors snip at the red part, which falls off the tag into the snow,
//      the note "35 − 7 = 28" writes itself, and the price rolls down from 35 to 28 while the "− $7" is crossed out.
// Tapping the price first acts out the classic mistake: "35 − 20?" appears in red and wobbles.
// Level 0: 10%, 20%, 25% or 50% off. Level 1: 20%, 25%, 30%, 40% or 75% off. Level 2: 15%, 35%, 45%, 60% or 75% off.
// Medium mode: the tray asks for the discount once "35 ÷ 5 =" is written, and for the sale price once "35 − 7 =" is.
const M = MK, CHALK = '#fbf6e6', RED = '#e2483e', TAGC = '#fff3d6', TAGE = '#6a4428', SIGNY = 232, BX0 = 52, BW = 256, BY = 330, BH = 46, NOTEY = 400;
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  const pct = L === 0 ? [10, 20, 25, 50][r(4)] : L === 1 ? [20, 25, 30, 40, 75][r(5)] : [15, 35, 45, 60, 75][r(5)];
  const d = gcd(pct, 100), p = pct / d, n = 100 / d; // pct% = p/n
  const lo = L === 0 ? 2 : 2, hi = L === 0 ? (n >= 10 ? 9 : 12) : L === 1 ? (n >= 10 ? 9 : 15) : (n >= 20 ? 6 : 15);
  let m = lo + r(hi - lo + 1); if (n === 2) m = 5 + r(20); if (n === 20) m = 2 + r(5);
  return { pct, p, n, price: n * m, unit: m, disc: p * m };
}
// a toy-shop window at blue hour: a navy street, a warm interior with shelves of toys, garland lights, a snowy sill
function shop(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, '#1c2a5a'); sk.addColorStop(0.6, '#3a4a8a'); sk.addColorStop(1, '#6a6aa8'); c.fillStyle = sk; c.fillRect(0, 0, W, H);
  // the brick front of the shop
  c.fillStyle = '#5a2e3a'; c.fillRect(0, 150, W, 330);
  c.strokeStyle = 'rgba(30,10,20,0.35)'; c.lineWidth = 1.5; for (let y = 156; y < 480; y += 14) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); for (let x = (y / 14) % 2 ? 0 : 14; x < W; x += 28) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 14); c.stroke(); } }
  // the awning edge above the window
  for (let i = 0; i < 12; i++) { c.fillStyle = i % 2 ? '#f4ecd8' : '#c83a3a'; c.beginPath(); c.moveTo(i * 30, 140); c.lineTo(i * 30, 160); c.arc(i * 30 + 15, 160, 15, Math.PI, 0, true); c.lineTo(i * 30 + 30, 140); c.fill(); }
  c.fillStyle = '#c83a3a'; c.fillRect(0, 128, W, 14);
  // the window: a warm interior
  const wi = c.createLinearGradient(0, 178, 0, 446); wi.addColorStop(0, '#ffe2a8'); wi.addColorStop(1, '#f2a860'); c.fillStyle = wi; c.fillRect(22, 178, 316, 266);
  // shelves of toys, softly out of focus
  const R = P.rng(77);
  for (const sy of [270, 380]) { c.fillStyle = 'rgba(140,80,40,0.45)'; c.fillRect(22, sy, 316, 6);
    for (let i = 0; i < 9; i++) { const x = 34 + i * 34 + R() * 6, h = 16 + R() * 20, col = ['#7ab0e0', '#e8706a', '#8ad08a', '#f0d060', '#c890e0'][i % 5]; c.fillStyle = P.rgba ? P.rgba(col, 0.45) : col;
      if (i % 3 === 0) { c.beginPath(); c.arc(x + 10, sy - 10, 10, 0, 7); c.fill(); } else c.fillRect(x, sy - h, 20, h); } }
  // the frame and the snowy sill
  c.strokeStyle = '#3a1e14'; c.lineWidth = 10; c.strokeRect(22, 178, 316, 266); c.strokeStyle = '#8a5a34'; c.lineWidth = 5; c.strokeRect(22, 178, 316, 266);
  c.fillStyle = '#4a2a1a'; c.fillRect(12, 444, 336, 14); c.fillStyle = '#f6f8ff'; c.beginPath(); c.moveTo(12, 446); for (let x = 12; x <= 348; x += 12) c.quadraticCurveTo(x + 6, 436 - (x % 24 ? 2 : 5), x + 12, 446); c.fill();
  // the sidewalk with snow
  const sw = c.createLinearGradient(0, 480, 0, H); sw.addColorStop(0, '#dfe6f6'); sw.addColorStop(1, '#b4c0e0'); c.fillStyle = sw; c.fillRect(0, 480, W, H - 480);
  c.fillStyle = 'rgba(255,220,160,0.25)'; c.beginPath(); c.moveTo(22, 480); c.lineTo(338, 480); c.lineTo(360, 560); c.lineTo(0, 560); c.fill();
  c.fillStyle = 'rgba(90,100,150,0.2)'; for (const [x, y, rx] of [[70, 610, 80], [260, 590, 70]]) { c.beginPath(); c.ellipse(x, y, rx, 8, 0, 0, 7); c.fill(); }
}
function scissors(c, x, y, open, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const sgn of [-1, 1]) { c.save(); c.rotate(sgn * open); c.fillStyle = '#c8d0dc'; c.strokeStyle = '#3a3a4a'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(4, 0); c.lineTo(-30, sgn * 1); c.quadraticCurveTo(-24, sgn * 7, 0, sgn * 5); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = '#d8453a'; c.lineWidth = 4; c.beginPath(); c.ellipse(13, sgn * 6, 8, 5, 0, 0, 7); c.stroke(); c.restore(); }
  c.fillStyle = '#3a3a4a'; c.beginPath(); c.arc(0, 0, 2.5, 0, 7); c.fill(); c.restore();
}

MG.add({
  id: 'ratios_discount', stage: 'ratios', cmd: 'DISCOUNT!', hint: 'drag', time: 9, mood: 'bright', winText: 'Bargain!', hold: 1.6,
  card: {
    title: 'Discounts', ref: 'Grade 7', kind: 'Ratios and percents',
    text: 'A discount takes a percent off the price. "20% off" means you pay 20 dollars less for every 100 dollars of price.\n\nFirst find the discount. 20% is 20 out of 100, which is 1 out of 5. So cut the price into 5 equal parts: $35 ÷ 5 = $7. One part, $7, is the discount.\n\nThen take it off the price: $35 − $7 = $28. That is the sale price.\n\nDon\'t take away 20 dollars! The 20 is a percent of the price, not a number of dollars.',
    note: 'Discount = percent × price. Sale price = price − discount. 20% off $35: 35 ÷ 5 = 7, and 35 − 7 = $28.',
    ask: 'What is 25% off $40? What is 10% off $60?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const T = M.pace(g), { pct, p, n, price, unit, disc } = S;
    S.face = 'happy'; S.cutAt = null; S.splitAt = null; S.litAt = null; S.snipAt = null;
    S.pN = M.num(price, 'p'); S.row = M.row(M.txt('$', 'dl'), S.pN);
    S.relay = () => M.place(g, 'sign', S.row, 150, SIGNY + 14, 42, { col: CHALK }); S.relay();
    const stkRow = M.row(M.num(pct), M.txt('%')); stkRow.id = 'pct'; M.place(g, 'stk', stkRow, 290, 232, 28, { col: '#fff' });
    M.zone(g, 'bar', { x: BX0 + BW / 2, y: BY, w: BW, h: BH + 10 });
    M.inert(g, ['dl', 'mi', 'd2']);
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    const work = (g, parts) => { S.wk = M.row(...parts); S.wk.alpha = 1; M.place(g, 'wk', S.wk, 180, NOTEY, 28, { col: CHALK }); S.wkAt = g.t; };
    const fadeWork = (g, d) => { const w = S.wk; M.tween(g, w, { alpha: 0 }, 0.3 * T, { delay: d }); M.at(g, [[d + 0.32 * T, g => { if (S.wk === w) { delete g.s.mk.ex.wk; S.wk = null; } }]]); };
    M.onMiss(g, (g, info) => { if (info.tap === 'p' && !S.dN) M.note(g, { node: M.row(M.num(price), M.op('−'), M.num(pct), M.txt('?')), at: [180, NOTEY], s: 28, col: '#ff9a8a', pill: true, write: 0.25, hold: 0.4, fade: 0.25 }); });
    g.dur *= (2.6 + 1.05 * 2) / 8;
    const uniq = (v, list) => [...new Set(list.filter(w => w > 0 && w !== v))];
    M.play(g, {
      moves(g) {
        // 1. the percent onto the tag: cut it into n equal pieces; p of them are the discount
        if (!S.split) return [{ drag: 'pct', to: ['bar', 'p'], area: [20, 180, 340, 444], busy: 0.1, askAt: 1.0 * T, after: 0.95 * T,
          ask: { v: disc, wrong: uniq(disc, [pct, price - pct, disc * 2, unit + 1, disc + p]) },
          then(g) {
            S.split = true; M.show(g, 1.0 * T); S.point = true; hop(g, 'wow'); g.sfx('swoosh');
            M.tween(g, 'pct', { alpha: 0 }, 0.2 * T); M.circle(g, [[BX0 + BW / 2, BY, 30]], { dur: 0.4 * T, pad: 0, col: '#ffe9a0' });
            M.fly(g, { node: M.row(M.num(pct), M.txt('%')), from: 'pct', to: [BX0 + BW - BW * p / n / 2, BY - 46], dur: 0.36 * T, arc: -30, s0: 28, s1: 24, col: RED, then(g) { S.litAt = g.t; g.sfx('pop'); } });
            S.splitAt = g.t + 0.15 * T; S.splitDur = 0.45 * T;
            for (let i = 1; i < n; i++) M.at(g, [[0.15 * T + i / n * 0.45 * T, g => g.sfx('tap')]]);
            S.q = M.num(disc, 'q', { alpha: 0, col: '#ffd86a' });
            M.at(g, [[0.62 * T, g => { work(g, p === 1 ? [M.num(price), M.op('÷'), M.num(n), M.op('='), S.q] : [M.num(price), M.op('÷'), M.num(n), M.op('×'), M.num(p), M.op('='), S.q]); M.writeIn(g, S.wk, { dur: 0.35 * T }); hop(g, 'think'); }]]);
          },
          resolve(g) {
            M.show(g, 0.95 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.22 * T }); M.indicate(g, S.q, { delay: 0.2 * T, dur: 0.3 * T }); g.sfx('ding');
            if (n <= 5) S.unitAt = g.t;
            M.at(g, [
              [0.4 * T, g => { const from = { ...M.box(g, 'q') }; S.q.alpha = 0;
                S.dN = M.num(disc, 'd', { alpha: 0 }); S.dRow = M.row(M.op('−', 'mi'), M.txt('$', 'd2'), S.dN); S.dRow.id = 'dsc'; S.row.items.push(S.dRow); S.relay();
                for (const q of S.dRow.items.slice(0, 2)) M.writeIn(g, q, { dur: 0.2 * T });
                M.fly(g, { node: M.num(disc, null, { col: '#ffd86a' }), from: [from.x, from.y], to: 'd', dur: 0.36 * T, arc: -50, s0: 28, s1: 42,
                  then(g) { S.dN.alpha = 1; S.dN.pop = g.t; M.sparkle(g, 'd', { n: 8 }); g.sfx('coin'); hop(g, 'laugh'); } });
                fadeWork(g, 0.1 * T); }],
              [0.9 * T, g => { S.point = false; M.zone(g, 'cut', { x: BX0 + BW * (1 - p / n / 2), y: BY, w: BW * p / n, h: BH }); }],
            ]);
          } }];
        // 2. take the discount off: the red part is snipped off and the price rolls down
        if (!S.dN || S.snipped) return [];
        return [{ tap: ['d', 'dsc', 'cut'], busy: 0.1, askAt: 0.7 * T, after: 1.1 * T, ask: { v: price - disc, wrong: uniq(price - disc, [price - pct, price + disc, disc, price - disc + 1]) },
          then(g) {
            S.snipped = true; M.show(g, 0.7 * T); S.point = true; hop(g, 'wow');
            M.circle(g, 'dsc', { dur: 0.45 * T, col: '#ffe9a0' }); S.scAt = g.t; S.snipAt = g.t + 0.45 * T; M.at(g, [[0.45 * T, g => g.sfx('pop')]]);
            S.q2 = M.num(price - disc, 'q2', { alpha: 0, col: '#ffd86a' }); M.at(g, [[0.2 * T, g => { work(g, [M.num(price), M.op('−'), M.num(disc), M.op('='), S.q2]); M.writeIn(g, S.wk, { dur: 0.4 * T }); }]]);
          },
          resolve(g) {
            M.show(g, 1.1 * T); S.q2.alpha = 1; M.writeIn(g, S.q2, { dur: 0.22 * T }); g.sfx('ding'); S.fallAt = g.t; hop(g, 'laugh');
            M.strike(g, S.dRow, { delay: 0.15 * T, dur: 0.25 * T });
            M.at(g, [
              [0.45 * T, g => { M.tween(g, S.dRow, { alpha: 0 }, 0.25 * T); M.roll(g, S.pN, price - disc, { dur: 0.4 * T }); M.indicate(g, S.pN, { delay: 0.3 * T, dur: 0.35 * T, sc: 1.2 }); fadeWork(g, 0.1 * T); }],
              [0.75 * T, g => { S.row.items.pop(); S.relay(); M.sparkle(g, 'p', { n: 14, cols: ['#ffd86a', '#fff', '#ff9a8a'] }); g.sfx('coin'); hop(g, 'laugh'); S.point = false; }],
            ]);
          } }];
      },
      area(g) { return !S.split ? ['pct', 'bar'] : ['d']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, { n, p, unit, pct } = S, T = M.pace(g);
    c.drawImage(g.bake('discount_shop', shop), 0, 0, 360, 640);
    // garland lights twinkle along the top of the window
    for (let i = 0; i < 13; i++) { const x = 34 + i * 24.5, y = 190 + Math.sin(i * 0.9) * 4, a = 0.55 + 0.45 * Math.sin(t * 3 + i * 1.3); c.fillStyle = ['#ffd84a', '#ff7a6a', '#8ae0ff', '#a8f08a'][i % 4]; c.globalAlpha = a; c.beginPath(); c.arc(x, y, 3.5, 0, 7); c.fill(); c.globalAlpha = 1; }
    // the chalk sign
    c.save(); c.fillStyle = 'rgba(20,10,10,0.3)'; c.beginPath(); c.roundRect(46, SIGNY - 26, 216, 64, 10); c.fill(); c.fillStyle = '#8a5a34'; c.beginPath(); c.roundRect(40, SIGNY - 32, 220, 64, 10); c.fill();
    c.fillStyle = '#2e4a3e'; c.beginPath(); c.roundRect(46, SIGNY - 26, 208, 52, 6); c.fill(); c.restore();
    M.drawEx(g, c, 'sign');
    // the sticker, until it is dragged onto the tag
    const sb = M.box(g, 'pct'), sn = M.node(g, 'pct'); if (sb && sn && (sn.alpha ?? 1) > 0.02) { c.save(); c.globalAlpha = sn.alpha ?? 1; c.translate(sb.x, sb.y + 6); c.rotate(-0.12 + Math.sin(t * 2) * 0.03);
      c.fillStyle = 'rgba(40,10,10,0.3)'; c.beginPath(); c.arc(2, 4, 38, 0, 7); c.fill(); c.fillStyle = RED; c.beginPath(); for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12, r = i % 2 ? 34 : 39; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill();
      c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, 29, 0, 7); c.stroke(); c.font = M.NUMF(15, 700); c.textAlign = 'center'; c.fillStyle = '#fff'; c.fillText('OFF', 0, 22); c.restore(); }
    M.drawEx(g, c, 'stk');
    // the price tag: a string to the hole, the body cut into n pieces, the discount pieces red
    const pw = BW / n, x0 = BX0, top = BY - BH / 2, fall = S.fallAt != null ? t - S.fallAt : -1, cutX = x0 + BW * (1 - p / n);
    c.save(); c.strokeStyle = '#d8c8a0'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 - 6, BY); c.quadraticCurveTo(40, 260, 60, 186); c.stroke(); c.restore();
    const body = (xa, xb, col) => { c.fillStyle = col; c.fillRect(xa, top, xb - xa, BH); };
    c.save(); c.fillStyle = 'rgba(60,20,10,0.25)'; c.fillRect(x0 - 14, top + 5, (fall >= 0 ? cutX : x0 + BW) - x0 + 18, BH);
    c.fillStyle = TAGC; c.beginPath(); c.moveTo(x0 + 1, top); c.lineTo(x0 - 16, BY - 12); c.lineTo(x0 - 16, BY + 12); c.lineTo(x0 + 1, top + BH); c.closePath(); c.fill(); c.strokeStyle = TAGE; c.lineWidth = 2.5; c.stroke();
    c.fillStyle = '#b89a70'; c.beginPath(); c.arc(x0 - 6, BY, 3.5, 0, 7); c.fill();
    const litK = S.litAt != null ? M.clamp((t - S.litAt) / 0.25, 0, 1) : 0;
    body(x0, cutX, TAGC);
    if (fall < 0) { body(cutX, x0 + BW, litK > 0 ? M.mix(TAGC, RED, litK) : TAGC); c.strokeStyle = TAGE; c.lineWidth = 2.5; c.strokeRect(x0, top, BW, BH); }
    else { c.strokeStyle = TAGE; c.lineWidth = 2.5; c.strokeRect(x0, top, cutX - x0, BH); }
    // the cut lines draw themselves one after another
    if (S.splitAt != null) for (let i = 1; i < n; i++) { const k = M.clamp((t - S.splitAt - (i - 1) / n * S.splitDur) / 0.15, 0, 1); if (k <= 0) continue; const x = x0 + i * pw;
      if (fall >= 0 && x > cutX + 0.5) continue; c.setLineDash([5, 4]); c.strokeStyle = TAGE; c.lineWidth = 2; c.beginPath(); c.moveTo(x, top); c.lineTo(x, top + BH * k); c.stroke(); c.setLineDash([]); }
    // each piece's dollar value, when the pieces are wide enough
    if (S.unitAt != null && fall < 0) { const k = M.clamp((t - S.unitAt) / 0.25, 0, 1); c.globalAlpha = k; c.font = M.NUMF(20, 700); c.textAlign = 'center';
      for (let i = 0; i < n; i++) { const red = i >= n - p; c.fillStyle = red ? '#fff' : '#6a3a1a'; c.fillText('$' + unit, x0 + (i + 0.5) * pw, BY + 7); } c.globalAlpha = 1; }
    c.restore();
    // the percent label over the red pieces
    if (litK > 0 && fall < 0) { c.save(); c.globalAlpha = litK; c.font = M.NUMF(24, 700); c.textAlign = 'center'; c.fillStyle = '#fff'; c.strokeStyle = RED; c.lineWidth = 5; c.lineJoin = 'round';
      const lx = Math.min(330 - 30, cutX + (x0 + BW - cutX) / 2); c.strokeText(pct + '%', lx, BY - 34); c.fillText(pct + '%', lx, BY - 34);
      c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(cutX + 2, BY - 30); c.lineTo(cutX + 2, BY - 26); c.lineTo(x0 + BW - 2, BY - 26); c.lineTo(x0 + BW - 2, BY - 30); c.stroke(); c.restore(); }
    // the red part falls off the tag after the snip, tumbling into the snow
    if (fall >= 0 && fall < 1.4) { const k = fall, y = k * k * 520, rot = k * 2.2; c.save(); c.globalAlpha = M.clamp(1 - (k - 0.9) / 0.5, 0, 1); c.translate((cutX + x0 + BW) / 2 + k * 30, BY + y); c.rotate(rot);
      const w = x0 + BW - cutX; c.fillStyle = RED; c.fillRect(-w / 2, -BH / 2, w, BH); c.strokeStyle = TAGE; c.lineWidth = 2.5; c.strokeRect(-w / 2, -BH / 2, w, BH);
      c.font = M.NUMF(22, 700); c.textAlign = 'center'; c.fillStyle = '#fff'; if (w > 40) c.fillText('$' + S.disc, 0, 8); c.restore(); }
    // the scissors snip at the cut
    if (S.scAt != null && t - S.scAt < 1.0 * T + 0.3) { const k = (t - S.scAt) / (0.45 * T), open = k < 1 ? 0.5 * (1 - Math.max(0, k - 0.5) * 2) : 0, al = M.clamp(1 - (t - S.scAt - 0.8 * T) / 0.3, 0, 1);
      c.save(); c.globalAlpha = Math.min(M.clamp(k * 3, 0, 1), al); c.translate(cutX, top - 34 + Math.min(1, k) * 26); c.rotate(-Math.PI / 2); scissors(c, 0, 0, Math.max(0, open), 1.6); c.restore(); }
    // the working note, on a dark pill under the tag
    if (S.wk && g.s.mk.ex.wk) { const m = M.lay(S.wk, 28), a = S.wk.alpha ?? 1; c.save(); c.globalAlpha = a * M.clamp((t - S.wkAt) / 0.15, 0, 1); c.fillStyle = 'rgba(40,20,30,0.8)'; c.beginPath(); c.roundRect(180 - m.w / 2 - 14, NOTEY - 31, m.w + 28, 44, 22); c.fill(); c.restore(); M.drawEx(g, c, 'wk'); }
    // snow falling in front of the shop
    c.save(); for (let i = 0; i < 34; i++) { const x = (i * 97 + Math.sin(t * 0.8 + i) * 14 + t * 7) % 370 - 5, y = (i * 61 + t * (24 + (i % 5) * 6)) % 660 - 10; c.fillStyle = 'rgba(255,255,255,0.85)'; c.beginPath(); c.arc(x, y, 1.3 + (i % 3) * 0.7, 0, 7); c.fill(); } c.restore();
    // the fox shopper, and a duck friend with a shopping bag
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    try { if (typeof ANI !== 'undefined') { ANI.draw(c, 'duck', 286, 600 - hopK * 10, 1.0, { t, phase: 1.5, facing: -1, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : 'happy' }); ANI.draw(c, 'fox', 92, 606 - hopK * 22, 1.45, { t, pose, expr }); }
      else SCN.host(g, c, 'fox', 92, 606, 1.4); } catch (e) { SCN.host(g, c, 'fox', 92, 606, 1.4); }
    M.drawUI(g, c);
  },
});
