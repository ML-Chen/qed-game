// decimals_convert.js — CONVERT! 2.5 km = ? m. A trail signpost in the mountains at noon; a fox hiker.
// The sign reads "2.5 km = ? m" and a small plaque under it gives the fact "1 km = 1000 m". Two luggage tags hang
// below: "× 1000" and "÷ 1000". Two moves, each acted out by itself (show your work):
//   1. drag the right tag onto 2.5 (or onto the work line): the 2.5 is circled and a copy of it drops onto the work line,
//      and the tag flies in after it: "2.5 × 1000". Then the tag glows and the decimal point hops one place per
//      × 10 (1000 = 10 × 10 × 10), each hop drawing an arc labelled "×10"; an empty place it passes fills with a 0 that
//      writes itself in. Finally the tag fades and the leftover point (and any extra zeros) fade: 2500.
//   2. tap the ?: the 2500 is circled and flies up into the ?: 2.5 km = 2500 m.
// The classic mistake, dividing when going to a smaller unit (or multiplying when going to a bigger one), is the other
// tag: dragging it only wobbles. Level 0: one decimal place, × 1000 or × 100 (m to cm). Level 1: two decimal places.
// Level 2: half the time a small unit to a big one (450 m = 0.45 km: the point hops left and a leading 0 writes in).
// Medium mode: the tray asks for the converted number once "2.5 × 1000" is on the work line.
const M = MK, EY = 238, KEYY = 292, WY = 370, TAGY = 482, INK = '#3a2414', HOP = '#e8701a', WINK = '#2a3a5a';
const UNITS = [['km', 'm', 3], ['kg', 'g', 3], ['L', 'mL', 3], ['m', 'cm', 2]];
// the exact decimal string of mant × 10^exp (no floating point), without trailing zeros after the point
function fmt(mant, exp) {
  let s = String(mant); if (exp >= 0) return s + '0'.repeat(exp);
  s = s.padStart(-exp + 1, '0'); s = s.slice(0, s.length + exp) + '.' + s.slice(s.length + exp);
  return s.replace(/0+$/, '').replace(/\.$/, '');
}
function pick(g) {
  const L = g.level, ri = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), nz = (a, b) => { let m; do m = ri(a, b); while (m % 10 === 0); return m; };
  const [big, small, k] = UNITS[ri(0, 3)];
  if (L === 2 && g.rand() < 0.5) { // small unit to big unit: divide
    const m = nz(11, 99), z = ri(0, k - 1); return { mant: m * 10 ** z, d: 0, k, mul: false, from: small, to: big };
  }
  const d = L === 0 ? 1 : 2, m = d === 1 ? nz(11, 99) : nz(101, 999); return { mant: m, d, k, mul: true, from: big, to: small };
}
function rr(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// ---------------- the mountain trail at noon (baked) ----------------
function trail(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 420); sk.addColorStop(0, '#3a8ae0'); sk.addColorStop(0.6, '#8ac8f4'); sk.addColorStop(1, '#d8f0fa'); c.fillStyle = sk; c.fillRect(0, 0, W, H);
  const peak = (x, y, w, col, snow) => { c.fillStyle = col; c.beginPath(); c.moveTo(x - w, 470); c.lineTo(x, y); c.lineTo(x + w, 470); c.fill();
    c.fillStyle = snow; c.beginPath(); c.moveTo(x, y); c.lineTo(x - w * 0.28, y + (470 - y) * 0.28); c.lineTo(x - w * 0.1, y + (470 - y) * 0.22); c.lineTo(x + w * 0.05, y + (470 - y) * 0.3); c.lineTo(x + w * 0.28, y + (470 - y) * 0.28); c.fill(); };
  peak(60, 250, 150, '#7a8ab8', '#f4f8ff'); peak(300, 230, 170, '#6a7aa8', '#ffffff'); peak(180, 300, 130, '#8a9ac0', '#f4f8ff');
  P.hills(c, W, 470, 30, '#8ac860', '#5a9a40', { seed: 4, dabs: 50 });
  const gr = c.createLinearGradient(0, 480, 0, H); gr.addColorStop(0, '#7ab850'); gr.addColorStop(1, '#4a8a34'); c.fillStyle = gr; c.fillRect(0, 500, W, H - 500);
  // the dirt trail winding toward the peaks
  c.fillStyle = '#d8b480'; c.beginPath(); c.moveTo(150, H); c.bezierCurveTo(170, 590, 250, 560, 210, 520); c.bezierCurveTo(185, 495, 190, 485, 200, 470); c.lineTo(208, 470); c.bezierCurveTo(206, 490, 214, 505, 236, 522); c.bezierCurveTo(290, 566, 260, 600, 250, H); c.fill();
  P.flowers(c, W, 520, 640, 30, undefined, 3); P.grassTufts(c, W, 520, 640, 26, '#3e7a2e', 6);
  // pine trees at the sides
  for (const [x, y, s] of [[22, 520, 1.1], [338, 530, 1], [56, 548, 0.8]]) { c.fillStyle = '#6a4a2a'; c.fillRect(x - 3 * s, y - 10 * s, 6 * s, 14 * s); c.fillStyle = '#2e6a3a'; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(x - (22 - i * 5) * s, y - (10 + i * 18) * s); c.lineTo(x, y - (44 + i * 18) * s); c.lineTo(x + (22 - i * 5) * s, y - (10 + i * 18) * s); c.fill(); } }
}

MG.add({
  id: 'decimals_convert', stage: 'decimals', cmd: 'CONVERT!', hint: 'drag', time: 9, mood: 'bright', winText: 'Converted!', hold: 1.7,
  card: {
    title: 'Converting units', ref: 'Grade 5', kind: 'Measurement',
    text: 'A kilometer is 1000 meters. To change 2.5 km into meters, ask how many meters are in 2.5 km: 2.5 × 1000 = 2500. So 2.5 km = 2500 m.\n\nMultiplying by 10 moves the decimal point one place to the right. Multiplying by 1000 is the same as multiplying by 10 three times, so the point moves three places. Empty places fill with zeros.\n\nGoing from a big unit to a small unit, you need more of the small units, so you multiply. Going from a small unit to a big unit, you need fewer of them, so you divide: 450 m = 450 ÷ 1000 km = 0.45 km.',
    note: 'Big unit to small unit: multiply. Small unit to big unit: divide. × 1000 moves the decimal point 3 places to the right; ÷ 1000 moves it 3 places to the left.',
    ask: 'How many meters is 3.2 km? How many kilograms is 750 g?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { mant, d, k, mul } = S, f = 10 ** k;
    S.val = fmt(mant, -d); S.res = fmt(mant, mul ? k - d : -d - k); S.point = false;
    S.slot = M.slot('ans'); S.ex = M.row(M.num(S.val, 'n0'), M.gap(6), M.txt(S.from, 'u0'), M.op('=', 'eq'), S.slot, M.gap(6), M.txt(S.to, 'u1'));
    S.relay = () => M.place(g, 'ex', S.ex, 172, EY, 40, { col: INK }); S.relay();
    M.place(g, 'key', Object.assign(M.row(M.num(1, 'k1'), M.gap(4), M.txt(mul ? S.from : S.to, 'k2'), M.op('=', 'k3'), M.num(f, 'k4'), M.gap(4), M.txt(mul ? S.to : S.from, 'k5')), { id: 'kr' }), 180, KEYY, 24, { col: '#fff6e0' });
    M.inert(g, ['kr', 'u0', 'eq', 'u1', 'k1', 'k2', 'k3', 'k4', 'k5']);
    // the two tags, in random order: the right operation and its opposite
    const right = mul ? '×' : '÷', wrong = mul ? '÷' : '×', swap = g.rand() < 0.5;
    S.tags = [{ id: 'tR', op: right, x: swap ? 250 : 110 }, { id: 'tW', op: wrong, x: swap ? 110 : 250 }];
    for (const T0 of S.tags) M.place(g, T0.id, Object.assign(M.row(M.op(T0.op, T0.id + 'o'), M.num(f, T0.id + 'n')), { id: T0.id }), T0.x, TAGY, 34, { col: '#3a2414' });
    M.inert(g, ['tRo', 'tRn', 'tWo', 'tWn']);
    M.zone(g, 'work', { x: 180, y: WY - 14, w: 300, h: 70 });
    g.dur *= (2.6 + 1.05 * 2) / 8;
    const face = (e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // the working number: digit nodes plus the point, rebuilt from D (digit nodes) and p (digits before the point)
    const build = () => { S.wrow.items = [...S.D.slice(0, S.p), S.pt, ...S.D.slice(S.p)]; M.place(g, 'work', S.wrow, 150, WY, 52, { col: WINK }); if (S.op && g.s.mk.ex.wop) { const wb = M.box(g, 'wrow'); M.place(g, 'wop', S.op, wb.x + wb.w / 2 + 14, WY, 40, { col: HOP, left: true }); } };
    const hop = (g, T) => { // one ×10 (or ÷10): the point hops one place, an empty place fills with 0
      const dir = mul ? 1 : -1;
      if (!mul && S.p === 0) { const z = M.num(0, null, { _born: -1 }); S.D.unshift(z); S.p = 1; build(); M.writeIn(g, z, { dur: 0.22 * T }); } // 45 ÷ 1000: a 0 in front gives the point room
      const a = { ...M.box(g, 'pt') };
      if (mul && S.p === S.D.length) { const z = M.num(0, null, { _born: -1 }); S.D.push(z); M.writeIn(g, z, { dur: 0.22 * T, delay: 0.1 * T }); }
      S.p += dir; build(); const b = M.box(g, 'pt');
      M.tween(g, S.pt, { dy: -30 }, 0.3 * T, { yoyo: true }); g.sfx('tap', { pitch: 1.2 + S.hops * 0.15 });
      M.arrow(g, [a.x, WY + 8, 20], [b.x, WY + 8, 20], { bend: -24 * dir, col: HOP, dur: 0.26 * T, linger: 0.35 * T }); // the hop's arc swings under the digits, with its ×10 under it
      M.note(g, { node: (mul ? '×' : '÷') + '10', at: [(a.x + b.x) / 2, WY + 36], s: 22, col: HOP, write: 0.14 * T, hold: 0.22 * T, fade: 0.2 * T });
      S.hops++;
    };
    M.play(g, {
      moves(g) {
        const T = M.pace(g);
        if (!S.conv) {
          const land = 0.85 * T;
          return [{ drag: 'tR', to: ['n0', 'work'], area: [0, EY - 50, 360, WY + 40], busy: 0.1, askAt: land, after: (0.25 + k * 0.38 + 0.5) * T,
            ask: { v: M.num(S.res), wrong: [fmt(mant, mul ? k - d - 1 : -d - k + 1), fmt(mant, mul ? k - d + 1 : -d - k - 1), fmt(mant, mul ? -d - k : k - d)].filter(w => w.length <= 5).map(w => M.num(w)) },
            then(g) { S.conv = true; M.show(g, land); S.point = true; face('think');
              M.circle(g, 'n0', { dur: 0.5 * T, col: HOP }); M.light(g, 'n0', { col: HOP });
              // a copy of the number drops onto the work line, digit by digit, with its point
              const digs = String(mant).split(''); S.D = digs.map(ch => M.num(ch, null, { alpha: 0 })); S.p = digs.length - d;
              S.pt = M.txt('.', 'pt', { alpha: 0, col: 'rgba(0,0,0,0)' }); /* the point is drawn as a big glowing dot (see draw) */ S.wrow = M.row(); S.wrow.id = 'wrow'; build(); M.inert(g, ['pt', 'wrow']);
              const from = { ...M.box(g, 'n0') };
              M.fly(g, { node: M.num(S.val, null, { col: WINK }), from: [from.x, from.y], to: 'wrow', dur: 0.38 * T, arc: 10, s0: 46, s1: 52, delay: 0.15 * T,
                then(g) { for (const q of S.D) q.alpha = 1; if (d) S.pt.alpha = 1; else { S.pt.alpha = 1; M.writeIn(g, S.pt, { dur: 0.2 * T }); } S.wrow.pop = g.t; g.sfx('pop'); M.unlight(g, 'n0'); } });
              // the tag flies in after the number: "2.5 × 1000"
              const tb = { ...M.box(g, 'tR') }; delete g.s.mk.ex.tR; delete g.s.mk.box.tR; S.tags = S.tags.filter(q => q.id !== 'tR');
              M.at(g, [[0.5 * T, g => { const wb = M.box(g, 'wrow'); S.op = M.row(M.op(mul ? '×' : '÷', 'wo', { col: HOP }), M.num(f, 'wf', { col: HOP })); S.op.id = 'wop'; S.op.alpha = 0;
                M.place(g, 'wop', S.op, wb.x + wb.w / 2 + 16, WY, 40, { col: HOP, left: true }); M.inert(g, ['wo', 'wf', 'wop']); g.sfx('swoosh');
                M.fly(g, { node: M.row(M.op(mul ? '×' : '÷', null, { col: HOP }), M.num(f, null, { col: HOP })), from: [tb.x, tb.y], to: 'wop', dur: 0.3 * T, arc: -40, s0: 32, s1: 40,
                  then(g) { S.op.alpha = 1; S.op.pop = g.t; M.sparkle(g, 'wop', { n: 8, cols: [HOP, '#fff'] }); face(); } }); }]]); },
            resolve(g) { const hd = 0.38 * T; S.hops = 0; M.show(g, (0.25 + k * 0.38 + 0.5) * T); M.light(g, S.op, { col: '#ffd040' }); M.indicate(g, S.op, { sc: 1.2, dur: 0.3 * T });
              const steps = []; for (let i = 0; i < k; i++) steps.push([0.25 * T + i * hd, g => hop(g, T)]);
              steps.push([0.25 * T + k * hd, g => { // tidy: a leading 0 when the point reached the front, then the extra zeros and a final point fade
                if (S.p === 0) { const z = M.num(0, null, { _born: -1 }); S.D.unshift(z); S.p = 1; build(); M.writeIn(g, z, { dur: 0.2 * T }); g.sfx('tap'); }
                M.tween(g, S.op, { alpha: 0 }, 0.25 * T); face('laugh');
                const drop = []; if (S.p < S.D.length) { for (let j = S.D.length - 1; j >= S.p && S.D[j].v === '0'; j--) drop.push(S.D[j]); }
                const allGone = S.p + drop.length === S.D.length; for (const q of drop) M.tween(g, q, { alpha: 0 }, 0.2 * T); if (allGone) M.tween(g, S.pt, { alpha: 0 }, 0.2 * T);
                M.later(g, 0.24 * T, g => { S.D = S.D.slice(0, S.D.length - drop.length); if (allGone) { S.wrow.items = S.D.slice(); M.place(g, 'work', S.wrow, 160, WY, 52, { col: WINK }); } else build();
                  delete g.s.mk.ex.wop; M.place(g, 'work', S.wrow, 180, WY, 52, { col: WINK }); M.sparkle(g, 'wrow', { n: 12, cols: [HOP, '#fff', '#ffd040'] }); g.sfx('ding'); S.point = false; }, true); }]);
              M.at(g, steps); } }];
        }
        if (S.done) return [];
        return [{ tap: 'ans', busy: 0.1, then(g) { S.done = true; M.show(g, 0.9 * T); S.point = true; face('think');
          M.circle(g, 'wrow', { dur: 0.45 * T, col: HOP });
          M.at(g, [[0.35 * T, g => { const from = { ...M.box(g, 'wrow') }; S.wrow.alpha = 0; S.stripOff = g.t; g.sfx('swoosh');
            M.fly(g, { node: M.num(S.res, null, { col: '#2a6a2a' }), from: [from.x, from.y], to: 'ans', dur: 0.4 * T, arc: -40, s0: 52, s1: 46,
              then(g) { S.slot.fill = M.num(S.res, 'rv', { col: '#2a6a2a', _born: -1 }); S.slot.fill.pop = g.t; S.relay(); M.inert(g, ['rv']); M.sparkle(g, 'ans', { n: 14, cols: ['#9ae07a', '#fff', HOP] }); g.sfx('coin'); face('laugh'); S.point = false;
                M.indicate(g, 'k4', { sc: 1.3, dur: 0.4 * T, col: '#ffd040' }); } }); }]]); } }];
      },
      area(g) { const mv = M.current(g)[0]; return mv ? [].concat(mv.tap || mv.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    c.drawImage(g.bake('decimals_convert_trail', trail), 0, 0, 360, 640);
    // drifting clouds and a soaring bird
    for (let i = 0; i < 2; i++) P.cloud(c, ((t * (8 + i * 4) + i * 200) % 480) - 60, 150 + i * 46, 0.5 + i * 0.1, '#ffffff', '#d8e8f4', 0.85);
    { const x = 60 + Math.sin(t * 0.4) * 40, y = 120 + Math.cos(t * 0.5) * 10, f = Math.sin(t * 5) * 3; c.strokeStyle = '#2a3040'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 9, y - f); c.quadraticCurveTo(x - 4, y - 4, x, y); c.quadraticCurveTo(x + 4, y - 4, x + 9, y - f); c.stroke(); }
    // the signpost: a post, the big arrow sign with the problem, the plaque with the fact
    c.fillStyle = '#6a4424'; c.fillRect(172, 300, 16, 220); c.fillStyle = 'rgba(0,0,0,0.15)'; c.fillRect(182, 300, 6, 220);
    c.save(); c.fillStyle = 'rgba(40,20,10,0.3)'; c.beginPath(); c.moveTo(22, 202); c.lineTo(312, 202); c.lineTo(346, 240); c.lineTo(312, 278); c.lineTo(22, 278); c.closePath(); c.fill();
    const sg = c.createLinearGradient(0, 196, 0, 274); sg.addColorStop(0, '#f0c88a'); sg.addColorStop(1, '#d09a5a'); c.fillStyle = sg; c.beginPath(); c.moveTo(18, 196); c.lineTo(308, 196); c.lineTo(342, 235); c.lineTo(308, 274); c.lineTo(18, 274); c.closePath(); c.fill();
    c.strokeStyle = '#8a5a2a'; c.lineWidth = 3; c.stroke(); c.strokeStyle = 'rgba(120,70,30,0.25)'; c.lineWidth = 1.5; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(28, 212 + i * 22); c.bezierCurveTo(120, 216 + i * 22, 220, 208 + i * 22, 300, 212 + i * 22); c.stroke(); } c.restore();
    M.drawEx(g, c, 'ex');
    const kb = M.box(g, 'kr'); if (kb) { c.fillStyle = '#3a6a4a'; rr(c, kb.x - kb.w / 2 - 14, KEYY - 22, kb.w + 28, 34, 8); c.fill(); c.strokeStyle = '#d8c890'; c.lineWidth = 2; c.stroke(); }
    M.drawEx(g, c, 'key');
    // the work line: a pale strip of birch bark nailed to the post
    if (K.ex.work) { c.save(); c.globalAlpha *= S.stripOff ? M.clamp(1 - (t - S.stripOff) / 0.3, 0, 1) : 1; c.fillStyle = 'rgba(40,20,10,0.25)'; rr(c, 30, WY - 46, 300, 92, 12); c.fill(); c.fillStyle = '#f6f0e2'; rr(c, 28, WY - 50, 300, 92, 12); c.fill(); c.strokeStyle = 'rgba(60,40,30,0.25)'; c.lineWidth = 1.5; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(44 + i * 60, WY - 40 + (i % 2) * 30); c.lineTo(70 + i * 60, WY - 40 + (i % 2) * 30); c.stroke(); } c.restore(); }
    M.drawEx(g, c, 'work'); M.drawEx(g, c, 'wop');
    // the decimal point: a big glowing dot that hops
    const pb = K.ex.work && M.box(g, 'pt'); if (pb && S.pt.alpha > 0.01 && !S.stripOff) { const x = pb.x + (S.pt._ax || 0), y = WY - 4 + (S.pt._ay || 0) + (S.pt.dy || 0); c.save(); c.globalAlpha *= S.pt.alpha; c.fillStyle = HOP; c.shadowColor = '#ffb040'; c.shadowBlur = 10; c.beginPath(); c.arc(x, y, 5.5, 0, 7); c.fill(); c.restore(); }
    // the luggage tags swing on strings from a rope
    c.strokeStyle = '#8a6a4a'; c.lineWidth = 3; c.beginPath(); c.moveTo(20, TAGY - 56); c.quadraticCurveTo(180, TAGY - 40, 340, TAGY - 56); c.stroke();
    for (const T0 of S.tags) { const b = M.box(g, T0.id), n = M.node(g, T0.id); if (!b || !n) continue; const gone = false, sw = Math.sin(t * 1.6 + T0.x) * 0.05;
      c.save(); c.globalAlpha *= gone ? 0.25 : (n.alpha ?? 1); c.translate(b.x, TAGY - 50); c.rotate(sw); c.translate(-b.x, -(TAGY - 50));
      c.strokeStyle = '#6a4a2a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(b.x, TAGY - 50); c.lineTo(b.x - b.w / 2 - 8, TAGY - 22); c.stroke();
      c.fillStyle = 'rgba(40,20,10,0.25)'; rr(c, b.x - b.w / 2 - 14, TAGY - 22, b.w + 30, 42, 8); c.fill(); c.fillStyle = '#ffe8b0'; rr(c, b.x - b.w / 2 - 16, TAGY - 26, b.w + 30, 42, 8); c.fill(); c.strokeStyle = '#b07a3a'; c.lineWidth = 2; c.stroke();
      c.fillStyle = '#b07a3a'; c.beginPath(); c.arc(b.x - b.w / 2 - 8, TAGY - 5, 3, 0, 7); c.fill();
      if (!gone) M.drawEx(g, c, T0.id); c.restore(); }
    // the fox hiker points at the sign while the work is shown, hops when a step lands
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 && S.face !== 'think' ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', 300, 612 - (S.face !== 'think' ? hopK * 22 : 0), 1.2, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'fox', 300, 612, 1.2);
    M.drawUI(g, c);
  },
});
