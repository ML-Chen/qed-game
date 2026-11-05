// carry_time.js — ELAPSED TIME! How long is it from 2:45 to 4:10? Count on in jumps on the barn clock at sunrise.
// The header reads "2:45 → 4:10"; the big clock on the barn starts at 2:45, and a small digital sign beside it ticks
// along with the hands. Every jump is a drag of a clock hand, and its working plays by itself (show your work):
//   A. drag the minute hand to the 12: it sweeps round to the next hour (a coloured slice of the face fills behind it,
//      a counter beside the slice ticks "+5 min, +10 min, +15 min"), then "+15 min" flies down into the tally board.
//   B. drag the hour hand to the end hour (the 4): the minute hand spins a whole lap per hour while a blue ring draws
//      itself round the rim, "+1 h" writes beside it and flies into the tally.
//   C. drag the minute hand to the end minute (the 2 for :10): the last slice fills, "+10 min" flies into the tally.
//   D. tap the tally: the two minute jumps are circled, "15 + 10 = 25" writes itself under them, and the tally
//      collapses to "1 h 25 min" while the 25 flies up into it.
// Order: A, B, C is the usual way; the hour first (B, then A, then C) is accepted too: from 2:45 the hour hand moves
// on as many whole hours as fit (to 3:45). Dragging a hand to any other number is a wrong move (only wobbles).
// Level 0: one whole hour, start :30 to :50. Level 1: one whole hour, any start minute. Level 2: two whole hours.
// The minute jumps always add up to less than 60, so the answer never needs regrouping. Medium mode: the total asks.
const M = MK, CX = 180, CY = 318, R = 86, HY = 204, TY = 466, NOTEY = 512, TS = 28;
const INK = '#3a1a24', CREAM = '#fff6e2', COLS = ['#f0861e', '#2f8ae0', '#2aa05a'], HOURC = '#2f8ae0';
const hhmm = v => { const h = Math.floor(v / 60) % 12 || 12, m = Math.floor(v % 60); return h + ':' + String(m).padStart(2, '0'); };
const angM = v => (v % 60) / 60 * Math.PI * 2 - Math.PI / 2, angH = v => ((v / 60) % 12) / 12 * Math.PI * 2 - Math.PI / 2;
const numXY = (k, r = R - 19) => { const a = k / 12 * Math.PI * 2 - Math.PI / 2; return [CX + Math.cos(a) * r, CY + Math.sin(a) * r]; };
function pick(g) {
  const L = g.level, ri = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (let i = 0; i < 200; i++) {
    const hrs = L === 2 ? 2 : 1, sh = ri(1, 9 - hrs), sm = 5 * (L === 0 ? ri(6, 10) : ri(3, 11)), em = 5 * ri(1, L === 0 ? 5 : 7);
    if (60 - sm + em >= 60) continue;
    return { start: sh * 60 + sm, end: (sh + hrs + 1) * 60 + em };
  }
  return { start: 165, end: 250 };
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// ---------------- the barnyard at sunrise (baked) ----------------
function barnyard(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 520); sk.addColorStop(0, '#5a6ab8'); sk.addColorStop(0.35, '#e88aa0'); sk.addColorStop(0.7, '#ffb878'); sk.addColorStop(1, '#ffe2a0'); c.fillStyle = sk; c.fillRect(0, 0, W, H);
  const sg = c.createRadialGradient(52, 470, 6, 52, 470, 220); sg.addColorStop(0, 'rgba(255,246,200,0.95)'); sg.addColorStop(0.15, 'rgba(255,220,140,0.6)'); sg.addColorStop(1, 'rgba(255,200,120,0)'); c.fillStyle = sg; c.fillRect(0, 240, W, 400);
  c.fillStyle = '#fff3c4'; c.beginPath(); c.arc(52, 470, 26, 0, 7); c.fill();
  P.hills(c, W, 492, 26, '#9a9a6a', '#6a7a4a', { seed: 5, dabs: 40 });
  // the barn: a red gable with white trim, the clock in the gable, a hay-loft door below
  const bx0 = 44, bx1 = 316, eave = 262, peak = 168, base = 560;
  c.fillStyle = 'rgba(60,20,20,0.25)'; c.beginPath(); c.moveTo(bx0 - 14, eave + 8); c.lineTo(180, peak + 4); c.lineTo(bx1 + 18, eave + 8); c.lineTo(bx1 + 18, base); c.lineTo(bx0 - 14, base); c.fill();
  const wall = c.createLinearGradient(0, peak, 0, base); wall.addColorStop(0, '#c4473c'); wall.addColorStop(1, '#8e2e2a'); c.fillStyle = wall;
  c.beginPath(); c.moveTo(bx0, eave); c.lineTo(180, peak); c.lineTo(bx1, eave); c.lineTo(bx1, base); c.lineTo(bx0, base); c.closePath(); c.fill();
  c.save(); c.clip(); c.strokeStyle = 'rgba(70,16,16,0.35)'; c.lineWidth = 2; for (let x = bx0 + 17; x < bx1; x += 17) { c.beginPath(); c.moveTo(x, peak); c.lineTo(x, base); c.stroke(); }
  c.fillStyle = 'rgba(255,200,140,0.12)'; c.fillRect(bx0, peak, 70, base - peak); c.restore();
  c.strokeStyle = '#fbf2e2'; c.lineWidth = 9; c.lineJoin = 'round'; c.beginPath(); c.moveTo(bx0 - 16, eave + 10); c.lineTo(180, peak - 6); c.lineTo(bx1 + 16, eave + 10); c.stroke();
  c.lineWidth = 6; c.beginPath(); c.moveTo(bx0 + 3, eave + 6); c.lineTo(bx0 + 3, base); c.moveTo(bx1 - 3, eave + 6); c.lineTo(bx1 - 3, base); c.stroke();
  // the big barn door with its white X, under the tally board
  c.fillStyle = '#7a2622'; c.fillRect(96, 500, 168, 60); c.strokeStyle = '#fbf2e2'; c.lineWidth = 5; c.strokeRect(96, 500, 168, 60);
  c.beginPath(); c.moveTo(96, 500); c.lineTo(180, 560); c.lineTo(264, 500); c.moveTo(96, 560); c.lineTo(180, 500); c.lineTo(264, 560); c.stroke();
  // the yard: grass, a fence, hay
  const gr = c.createLinearGradient(0, 548, 0, H); gr.addColorStop(0, '#8ac05a'); gr.addColorStop(1, '#5a8a3a'); c.fillStyle = gr; c.fillRect(0, 552, W, H - 552);
  c.fillStyle = '#e8d8b8'; for (let x = 4; x < W; x += 30) { if (x > 30 && x < 330) continue; c.fillRect(x, 520, 8, 50); } c.fillRect(0, 530, 44, 6); c.fillRect(316, 530, 44, 6); c.fillRect(0, 550, 44, 6); c.fillRect(316, 550, 44, 6);
  c.fillStyle = '#e8c060'; c.beginPath(); c.ellipse(48, 590, 40, 22, 0, Math.PI, 0); c.fill(); c.strokeStyle = '#c89a40'; c.lineWidth = 1.5; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(14 + i * 8, 590); c.lineTo(20 + i * 7, 572 + (i % 3) * 3); c.stroke(); }
  P.grassTufts(c, W, 560, 640, 30, '#4a8a34', 4);
}

MG.add({
  id: 'carry_time', stage: 'carry', cmd: 'ELAPSED TIME!', hint: 'drag', time: 10, mood: 'bright', winText: 'Time found!', hold: 1.7,
  card: {
    title: 'Elapsed time', ref: 'Grade 3', kind: 'Time',
    text: 'Elapsed time is how much time passes between a start time and an end time.\n\nA good way to find it is to count on in jumps. First jump to the next whole hour. Then jump whole hours. Then jump the minutes that are left.\n\nFor example, from 2:45 to 4:10: from 2:45 to 3:00 is 15 minutes. From 3:00 to 4:00 is 1 hour. From 4:00 to 4:10 is 10 minutes. Add the jumps: 1 hour, and 15 + 10 = 25 minutes. So 1 h 25 min passes.\n\nYou cannot subtract 4.10 − 2.45 like decimals, because an hour has 60 minutes, not 100.',
    note: 'Count on: jump to the next hour, then whole hours, then the minutes that are left. Add up the jumps.',
    ask: 'How long is it from 1:50 to 3:20? From 9:30 to 11:15?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); S.cur = S.start; S.disp = S.start; S.arcs = []; S.chips = []; S.sw = null; S.live = null; S.point = false;
    S.head = M.row(M.txt(hhmm(S.start), 'st'), M.gap(10), M.txt('→', 'arr'), M.gap(10), M.txt(hhmm(S.end), 'en', { col: '#ffe08a' }));
    M.place(g, 'head', S.head, CX, HY, 32, { col: CREAM });
    S.tally = M.row(); S.tally.id = 'tally'; S.relay = () => M.place(g, 'tally', S.tally, CX, TY, TS, { col: INK }); S.relay();
    const inert = ['st', 'arr', 'en'];
    for (let k = 1; k <= 12; k++) { const [x, y] = numXY(k); M.zone(g, 'n' + k, { x, y, w: 26, h: 26 }); }
    M.inert(g, inert);
    S.zones = () => { const am = angM(S.disp), ah = angH(S.disp); M.zone(g, 'mh', { x: CX + Math.cos(am) * 50, y: CY + Math.sin(am) * 50, w: 30, h: 30 }); M.zone(g, 'hh', { x: CX + Math.cos(ah) * 34, y: CY + Math.sin(ah) * 34, w: 28, h: 28 }); };
    S.zones();
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const hop = (e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    S.hop = hop;
    // one jump of the clock: the hand sweeps from cur to cur + mins, the slice or ring fills, the counter ticks, and
    // the jump's note flies into the tally board
    const jump = (g, kind, mins, tgt) => {
      const T = M.pace(g), from = S.cur, to = from + mins; S.cur = to; S.point = true; hop('think');
      const col = kind === 'h' ? HOURC : COLS[S.chips.filter(q => q.kind === 'm').length ? 2 : 0];
      const dur = (kind === 'h' ? 0.55 + 0.35 * mins / 60 : 0.4 + 0.5 * mins / 60) * T, t0 = 0.22 * T;
      M.circle(g, kind === 'h' ? 'hh' : 'mh', { dur: 0.4 * T, col, pad: 4 });
      M.circle(g, tgt, { dur: 0.45 * T, col, delay: 0.08 * T, pad: 4 });
      // the chip waits invisibly in the tally, so everything already there slides over to make room
      const v = kind === 'h' ? mins / 60 : mins, id = 'c' + S.chips.length;
      const chip = M.row(M.num(v, id + 'v', { col }), M.gap(4), M.txt(kind === 'h' ? 'h' : 'min', id + 'u', { col })); chip.id = id; chip.alpha = 0;
      const plus = S.chips.length ? M.op('+', id + 'p', { alpha: 0 }) : null;
      S.chips.push({ kind, v, node: chip, plus, col }); M.inert(g, [id, id + 'v', id + 'u', id + 'p']);
      const arc = { from, to, col, kind }; S.arcs.push(arc);
      // where the counter sits: beside the clock, on the side of the slice (minutes) or of the hour hand's new place
      const mid = kind === 'h' ? angH(to) : angM((from + to) / 2), side = Math.cos(mid) >= -0.05 ? 1 : -1;
      S.live = { kind, from, to, col, x: CX + side * 134, y: M.clamp(CY + Math.sin(mid) * (R - 10), 250, 368) };
      M.at(g, [
        [t0, g => { S.sw = { from, to, t0: g.t, dur }; S.tick = from; g.sfx('whoosh', { vol: 0.5 }); }],
        [0.1 * T, g => { S.tally.items.push(...(plus ? [plus] : []), chip); S.relay(); }],
        [t0 + dur + 0.02, g => { const L = S.live; S.live = null; S.pill = { x: L.x, y: L.y, until: g.t + 0.22 * T }; g.sfx('ding'); hop();
          const txt = M.row(M.op('+', null, { col }), M.num(v, null, { col }), M.gap(4), M.txt(kind === 'h' ? 'h' : 'min', null, { col }));
          M.sparkle(g, tgt, { n: 8, cols: [col, '#fff'] });
          M.note(g, { node: txt, at: [L.x, L.y], s: 22, col, write: 0.01, hold: 0.22 * T, fly: 0.38 * T, to: id, s1: TS, arc: 30,
            then(g) { chip.alpha = 1; chip.pop = g.t; if (plus) { plus.alpha = 1; plus.pop = g.t; } M.sparkle(g, id, { n: 10, cols: [col, '#fff', '#ffe08a'] }); g.sfx('coin'); hop('laugh');
              if (S.cur === S.end) { const en = M.node(g, 'en'); M.indicate(g, en, { sc: 1.3, dur: 0.45 * T }); M.sparkle(g, 'en', { delay: 0.1 * T, n: 12 }); } } });
          S.point = false; }],
      ]);
      M.show(g, t0 + dur + 0.02 + (0.22 + 0.38) * T + 0.08);
    };
    const nextHour = 'n12';
    M.play(g, {
      moves(g) {
        const out = [], cur = S.cur, m = cur % 60, end = S.end, eh = Math.floor(end / 60);
        if (cur === end) {
          if (S.done) return [];
          const mins = S.chips.filter(q => q.kind === 'm'), hrs = S.chips.find(q => q.kind === 'h'), a = mins[0].v, b = mins[1].v, sum = a + b, T = M.pace(g);
          const dec = ((Math.floor(end / 60) * 100 + end % 60) - (Math.floor(S.start / 60) * 100 + S.start % 60)) % 100;
          return [{ tap: 'tally', busy: 0.1, askAt: 0.8 * T, after: 1.3 * T, ask: { v: sum, wrong: [dec, sum + 10, Math.abs(a - b) || sum + 5, sum - 5] }, // dec: the decimal mistake (4.10 − 2.45 → 65)
            then(g) { S.done = true; M.show(g, 0.8 * T); S.point = true; hop('think');
              for (const q of mins) M.circle(g, q.node.id, { dur: 0.55 * T, col: '#e8604a', pad: 5 }); for (const q of mins) M.indicate(g, q.node, { sc: 1.18, dur: 0.4 * T, delay: 0.1 * T });
              S.q = M.num(sum, 'q', { alpha: 0, col: '#e8604a' });
              S.note = M.row(M.num(a, 'qa', { col: COLS[0] }), M.op('+', 'qp'), M.num(b, 'qb', { col: COLS[2] }), M.op('=', 'qe'), S.q); S.note.id = 'qn';
              M.place(g, 'note', S.note, CX, NOTEY, 30, { col: CREAM }); M.inert(g, ['qn', 'qa', 'qp', 'qb', 'qe', 'q']); M.writeIn(g, S.note, { dur: 0.45 * T, delay: 0.2 * T }); },
            resolve(g) { M.show(g, 1.3 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); M.indicate(g, S.q, { delay: 0.18 * T, dur: 0.32 * T }); g.sfx('ding');
              M.at(g, [
                [0.4 * T, g => { for (const q of S.chips) if (q.kind === 'm') { for (const it of q.node.items) M.tween(g, it, { alpha: 0 }, 0.18 * T); if (q.plus) M.tween(g, q.plus, { alpha: 0 }, 0.18 * T); } for (const q of S.chips) if (q.kind === 'h' && q.plus) M.tween(g, q.plus, { alpha: 0 }, 0.18 * T); }],
                [0.6 * T, g => { // the two minute jumps leave the tally and the sum flies up to stand beside the hours
                  const from = { ...M.box(g, 'q') }; S.q.alpha = 0;
                  S.tm = M.num(sum, 'tm', { alpha: 0, col: '#e8604a', _born: -1 });
                  const hn = hrs.node; S.tally.items = [hn.items[0], hn.items[1], hn.items[2], M.gap(12), S.tm, M.gap(4), M.txt('min', 'tu', { col: '#e8604a' })];
                  M.inert(g, ['tm', 'tu']); S.relay(); g.sfx('swoosh'); hop();
                  M.fly(g, { node: M.num(sum, null, { col: '#e8604a' }), from: [from.x, from.y], to: 'tm', dur: 0.36 * T, arc: -30, s0: 30, s1: TS,
                    then(g) { S.tm.alpha = 1; S.tm.pop = g.t; M.sparkle(g, 'tally', { n: 16, cols: ['#e8604a', HOURC, '#fff', '#ffe08a'] }); g.sfx('coin'); hop('laugh'); } });
                  M.tween(g, S.note, { alpha: 0 }, 0.3 * T); }],
                [1.0 * T, g => { delete g.s.mk.ex.note; S.point = false; S.glowAll = g.t; M.indicate(g, S.tally, { sc: 1.15, dur: 0.4 * T }); }],
              ]); } }];
        }
        if (m !== 0 && cur + 60 - m <= end) out.push({ drag: 'mh', to: nextHour, busy: 0.1, then: g => jump(g, 'm', 60 - m, nextHour) });
        if (cur + 60 <= end) out.push({ drag: 'hh', to: 'n' + (eh % 12 || 12), busy: 0.1, then: g => jump(g, 'h', 60 * Math.floor((end - cur) / 60), 'n' + (eh % 12 || 12)) });
        if (Math.floor(cur / 60) === eh && m < end % 60) out.push({ drag: 'mh', to: 'n' + (end % 60) / 5, busy: 0.1, then: g => jump(g, 'm', end % 60 - m, 'n' + (end % 60) / 5) });
        return out;
      },
      area(g) { const mv = M.current(g)[0]; return mv ? [].concat(mv.tap || mv.drag) : null; },
    });
  },
  update(g, dt) {
    const S = g.s, T = M.pace(g);
    if (S.sw) { const k = M.clamp((g.t - S.sw.t0) / S.sw.dur, 0, 1); S.disp = S.sw.from + (S.sw.to - S.sw.from) * M.easeIO(k);
      const step = S.sw.to - S.sw.from >= 60 ? 15 : 5; while (S.tick + step <= S.disp + 0.001) { S.tick += step; g.sfx('tap', { vol: 0.35, pitch: 0.9 + (S.tick % 60) / 120 }); }
      if (k >= 1) S.sw = null; }
    S.zones(); M.update(g, dt);
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    c.drawImage(g.bake('carry_time_barn', barnyard), 0, 0, 360, 640);
    // sunbeams and a few swallows
    c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const a = -1.2 + i * 0.22 + Math.sin(t * 0.3 + i) * 0.03; c.fillStyle = 'rgba(255,230,170,0.06)'; c.beginPath(); c.moveTo(52, 470); c.lineTo(52 + Math.cos(a) * 520, 470 + Math.sin(a) * 520); c.lineTo(52 + Math.cos(a + 0.08) * 520, 470 + Math.sin(a + 0.08) * 520); c.fill(); } c.restore();
    for (let i = 0; i < 3; i++) { const x = ((t * (22 + i * 6) + i * 130) % 440) - 40, y = 120 + i * 22 + Math.sin(t * 2 + i) * 6, f = Math.sin(t * 9 + i) * 4; c.strokeStyle = '#3a2a40'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 7, y - f); c.quadraticCurveTo(x - 3, y - 3, x, y); c.quadraticCurveTo(x + 3, y - 3, x + 7, y - f); c.stroke(); }
    // header board
    const hb = M.box(g, 'head'); c.fillStyle = 'rgba(60,24,20,0.82)'; rr(c, 92, HY - 30, 176, 40, 12); c.fill(); c.strokeStyle = 'rgba(255,240,210,0.5)'; c.lineWidth = 2; c.stroke();
    M.drawEx(g, c, 'head');
    // the clock (it wobbles when a hand goes to a wrong number)
    const wob = K.missAt >= 0 && t - K.missAt < 0.45 ? Math.sin((t - K.missAt) * 40) * 0.035 * (1 - (t - K.missAt) / 0.45) : 0;
    c.save(); c.translate(CX, CY); c.rotate(wob); c.translate(-CX, -CY);
    c.fillStyle = 'rgba(40,10,10,0.3)'; c.beginPath(); c.arc(CX + 4, CY + 7, R + 10, 0, 7); c.fill();
    c.fillStyle = '#4a2a20'; c.beginPath(); c.arc(CX, CY, R + 9, 0, 7); c.fill(); c.strokeStyle = '#d8b070'; c.lineWidth = 3; c.stroke();
    const fg = c.createRadialGradient(CX - 20, CY - 26, 10, CX, CY, R); fg.addColorStop(0, '#fffdf4'); fg.addColorStop(1, '#f2e2c4'); c.fillStyle = fg; c.beginPath(); c.arc(CX, CY, R, 0, 7); c.fill();
    // the jumps so far: slices of the face for minutes, rings round the rim for hours
    for (const a of S.arcs) {
      const live = S.sw && a === S.arcs[S.arcs.length - 1], hi = live ? S.disp : a.to; if (hi <= a.from) continue;
      if (a.kind === 'm') { c.fillStyle = P.rgba(a.col, 0.28); c.beginPath(); c.moveTo(CX, CY); c.arc(CX, CY, R - 2, angM(a.from), angM(a.from) + (hi - a.from) / 60 * Math.PI * 2); c.closePath(); c.fill();
        c.strokeStyle = a.col; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.arc(CX, CY, R - 3, angM(a.from), angM(a.from) + (hi - a.from) / 60 * Math.PI * 2); c.stroke(); }
      else { const laps = (hi - a.from) / 60; c.strokeStyle = a.col; c.lineWidth = 5; c.lineCap = 'round';
        for (let L = 0; L < Math.ceil(laps - 1e-6); L++) { const f = Math.min(1, laps - L); c.beginPath(); c.arc(CX, CY, R + 15 + L * 8, angM(a.from), angM(a.from) + f * Math.PI * 2); c.stroke(); } }
    }
    // ticks and numbers
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, r0 = i % 5 ? R - 7 : R - 11; c.strokeStyle = i % 5 ? 'rgba(74,42,32,0.45)' : '#4a2a20'; c.lineWidth = i % 5 ? 1.5 : 3; c.beginPath(); c.moveTo(CX + Math.cos(a) * r0, CY + Math.sin(a) * r0); c.lineTo(CX + Math.cos(a) * (R - 3), CY + Math.sin(a) * (R - 3)); c.stroke(); }
    c.font = M.NUMF(19); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#3a1a24'; for (let k = 1; k <= 12; k++) { const [x, y] = numXY(k); c.fillText(String(k), x, y + 1); }
    // the digital window ticks along with the hands

    // the hands (a dragged hand follows the finger)
    const P0 = K.press, dragA = P0 && P0.dragging ? Math.atan2(P0.y - CY, P0.x - CX) : null;
    const hand = (a, len, w, col, ghost) => { c.save(); c.globalAlpha *= ghost ? 0.3 : 1; c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(CX - Math.cos(a) * 10, CY - Math.sin(a) * 10); c.lineTo(CX + Math.cos(a) * len, CY + Math.sin(a) * len); c.stroke();
      c.fillStyle = col; c.beginPath(); c.arc(CX + Math.cos(a) * len, CY + Math.sin(a) * len, w * 0.7, 0, 7); c.fill(); c.restore(); };
    const dh = dragA != null && P0.id === 'hh', dm = dragA != null && P0.id === 'mh';
    hand(angH(S.disp), 46, 8, '#2a1420', dh); if (dh) hand(dragA, 46, 8, '#2a1420');
    hand(angM(S.disp), 70, 5, '#7a2a3a', dm); if (dm) hand(dragA, 70, 5, '#7a2a3a');
    c.fillStyle = '#d8a040'; c.beginPath(); c.arc(CX, CY, 6, 0, 7); c.fill();
    c.restore();
    // a little digital sign on the barn ticks along with the hands
    c.fillStyle = 'rgba(30,10,10,0.35)'; rr(c, 14, 400, 68, 32, 8); c.fill(); c.fillStyle = '#2a1a20'; rr(c, 12, 396, 68, 32, 8); c.fill(); c.strokeStyle = '#d8b070'; c.lineWidth = 2; c.stroke();
    c.font = M.NUMF(20); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ffd86a'; c.fillText(hhmm(S.disp), 46, 413);
    // the live counter beside the clock while a hand sweeps
    const pill = (x, y, a) => { c.save(); c.globalAlpha *= a; c.fillStyle = 'rgba(42,16,24,0.85)'; rr(c, x - 44, y - 16, 88, 32, 16); c.fill(); c.restore(); };
    const L = S.live; if (L && S.sw) { const p = Math.round(S.disp - L.from); let s = null;
      if (L.kind === 'm') s = '+' + (Math.floor(p / 5) * 5) + ' min'; else if (p >= 60) s = '+' + Math.floor(p / 60) + ' h';
      if (s && (L.kind === 'h' || p >= 5)) { pill(L.x, L.y, 1); c.font = M.NUMF(22); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = P.mix(L.col, '#ffffff', 0.25); c.fillText(s, L.x, L.y + 1); } }
    if (S.pill && t < S.pill.until + 0.2) pill(S.pill.x, S.pill.y, M.clamp((S.pill.until + 0.2 - t) / 0.2, 0, 1));
    // the tally board, its colours matching the slices and rings
    c.fillStyle = 'rgba(40,14,14,0.3)'; rr(c, 24, TY - 34, 312, 50, 12); c.fill(); c.fillStyle = '#fbf2e0'; rr(c, 22, TY - 38, 316, 50, 12); c.fill(); c.strokeStyle = '#c8a070'; c.lineWidth = 2.5; c.stroke();
    if (S.glowAll && t - S.glowAll < 1) { c.save(); c.globalAlpha = 1 - (t - S.glowAll); c.strokeStyle = '#ffd040'; c.shadowColor = '#ffd040'; c.shadowBlur = 16; c.lineWidth = 4; rr(c, 22, TY - 38, 316, 50, 12); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'tally');
    const nb = K.ex.note && M.box(g, 'qn'); if (nb) { c.save(); c.globalAlpha *= S.note.alpha ?? 1; c.fillStyle = 'rgba(42,16,24,0.85)'; rr(c, nb.x - nb.w / 2 - 14, nb.y - 22, nb.w + 28, 44, 16); c.fill(); c.restore(); }
    M.drawEx(g, c, 'note');
    // the duck points at the clock while it works and hops when a jump lands
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 && S.face !== 'think' ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'duck', 306, 612 - (S.face !== 'think' ? hopK * 22 : 0), 1.15, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'duck', 306, 612, 1.15);
    M.drawUI(g, c);
  },
});
