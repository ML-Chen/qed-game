// stats_median.js — MEDIAN! The median is the middle value once the data is in order.
// A Kalahari sunset: meerkats stand at their burrows, each as tall as its value, with the value painted on a pebble at
// its feet. The sign above reads "median = ?".
// Moves: 1. Tap the sort stone (ascending bars): the meerkats scurry into order, smallest to largest, and a sweep runs
//           up the staircase of heights. Tapping a meerkat before sorting is the classic miss (the middle of an
//           unsorted list is not the median).
//        2. Tap either end of the line: a rope loops over the two ends as a pair, both pebbles are crossed out and the
//           two meerkats dive into their burrows. Repeat until one meerkat is left (or two, for an even count).
//        3. Odd count: the last meerkat stretches up and its value flies into the sign. Even count: drag one middle
//           meerkat onto the other: "(a + b) ÷ 2 = m" writes itself above them, a flag plants itself halfway between
//           them, and m flies into the sign.
// Level 0: 5 values 1–9. Level 1: 7 values 1–12. Level 2: 6 values 1–12 (the median may end in .5).
// Medium mode: the median (odd) or the average of the middle pair (even) is picked from the tray.
const M = MK, GY = 444, SIGNY = 224, INK = '#fff4dc', ROPE = '#ffe0a0', BAD = '#e0504a';
const fmt = v => String(Math.round(v * 100) / 100);
function pick(g) {
  const L = g.level, n = [5, 7, 6][L], hi = L === 0 ? 9 : 12;
  for (let tries = 0; tries < 200; tries++) {
    const pool = [...Array(hi)].map((_, i) => i + 1);
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const vals = pool.slice(0, n), s = vals.slice().sort((a, b) => a - b);
    const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
    const raw = n % 2 ? vals[(n - 1) / 2] : (vals[n / 2 - 1] + vals[n / 2]) / 2;
    if (raw === med || vals.every((v, i) => v === s[i])) continue; // the unsorted middle must not already be the answer
    return { vals, sorted: s, med, n };
  }
  return { vals: [7, 2, 9, 4, 5], sorted: [2, 4, 5, 7, 9], med: 5, n: 5 };
}
// a meerkat standing with its feet at (x, y), h px tall to the top of its head
function meerkat(c, x, y, h, o) {
  const t = o.t || 0, r = 8.5 + h * 0.025, bw = 8 + h * 0.06, bob = Math.sin(t * 2.4 + (o.phase || 0)) * 1.2, top = y - h + bob;
  const fur = o.red ? '#e08a6a' : '#c99a62', dark = '#5a3a24', belly = '#efd8ae';
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
  // tail, curled on the sand behind
  c.strokeStyle = dark; c.lineWidth = 4.5; c.beginPath(); c.moveTo(x + bw * 0.4, y - 6); c.quadraticCurveTo(x + bw + 10, y - 2, x + bw + 14, y - 12 - Math.sin(t * 3 + (o.phase || 0)) * 2); c.stroke();
  c.strokeStyle = fur; c.lineWidth = 3; c.stroke();
  // body: a tall soft capsule
  const by0 = top + r * 1.6, by1 = y; c.fillStyle = fur; c.strokeStyle = '#6a4228'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(x - bw * 0.7, by0); c.bezierCurveTo(x - bw * 1.2, by0 + (by1 - by0) * 0.4, x - bw * 1.25, by1, x - bw * 0.6, by1);
  c.lineTo(x + bw * 0.6, by1); c.bezierCurveTo(x + bw * 1.25, by1, x + bw * 1.2, by0 + (by1 - by0) * 0.4, x + bw * 0.7, by0); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = belly; c.beginPath(); c.ellipse(x, by0 + (by1 - by0) * 0.58, bw * 0.62, (by1 - by0) * 0.38, 0, 0, 7); c.fill();
  // paws: held together on the chest, or up in a cheer
  c.strokeStyle = '#6a4228'; c.lineWidth = 3.4;
  if (o.cheer) { const w = Math.sin(t * 14) * 3; c.beginPath(); c.moveTo(x - bw * 0.7, by0 + 6); c.lineTo(x - bw - 6, by0 - 10 + w); c.moveTo(x + bw * 0.7, by0 + 6); c.lineTo(x + bw + 6, by0 - 10 - w); c.stroke(); }
  else { c.beginPath(); c.moveTo(x - bw * 0.6, by0 + 6); c.quadraticCurveTo(x - 3, by0 + 12, x - 1, by0 + 14); c.moveTo(x + bw * 0.6, by0 + 6); c.quadraticCurveTo(x + 3, by0 + 12, x + 1, by0 + 14); c.stroke(); }
  // head with dark eye patches
  const hx = x + (o.look || 0) * 2, hy = top + r;
  c.fillStyle = fur; c.strokeStyle = '#6a4228'; c.lineWidth = 2; c.beginPath(); c.ellipse(hx, hy, r, r * 0.95, 0, 0, 7); c.fill(); c.stroke();
  c.fillStyle = dark; for (const s of [-1, 1]) { c.beginPath(); c.arc(hx + s * r * 0.95, hy - r * 0.35, 2.6, 0, 7); c.fill(); }
  c.fillStyle = belly; c.beginPath(); c.ellipse(hx, hy + r * 0.35, r * 0.55, r * 0.45, 0, 0, 7); c.fill();
  for (const s of [-1, 1]) { c.fillStyle = dark; c.beginPath(); c.ellipse(hx + s * r * 0.4, hy - r * 0.08, 3.2, 3.8, s * 0.4, 0, 7); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(hx + s * r * 0.4 - 0.8 + (o.look || 0) * 0.8, hy - r * 0.2, o.wow ? 1.6 : 1.1, 0, 7); c.fill(); }
  c.fillStyle = '#2a1a14'; c.beginPath(); c.ellipse(hx, hy + r * 0.22, 2, 1.5, 0, 0, 7); c.fill();
  if (o.wow) { c.fillStyle = '#7a2a2a'; c.beginPath(); c.ellipse(hx, hy + r * 0.55, 1.8, 2.2, 0, 0, 7); c.fill(); }
  c.restore();
}
function sky(c, W, H) {
  const g = c.createLinearGradient(0, 0, 0, GY); [[0, '#2c2660'], [0.38, '#8a3f78'], [0.7, '#e6705a'], [1, '#ffc27a']].forEach(([k, col]) => g.addColorStop(k, col)); c.fillStyle = g; c.fillRect(0, 0, W, GY + 4);
  const sun = c.createRadialGradient(262, 392, 6, 262, 392, 190); sun.addColorStop(0, 'rgba(255,236,170,0.95)'); sun.addColorStop(0.2, 'rgba(255,190,120,0.45)'); sun.addColorStop(1, 'rgba(255,160,110,0)'); c.fillStyle = sun; c.fillRect(0, 160, W, GY);
  c.fillStyle = '#fff0c0'; c.beginPath(); c.arc(262, 392, 30, 0, 7); c.fill();
  for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,250,230,${0.25 + (i * 37 % 10) / 20})`; c.beginPath(); c.arc((i * 89) % W, (i * 53) % 150 + 8, 0.6 + (i % 3) * 0.4, 0, 7); c.fill(); }
  // far dunes and an acacia tree, in silhouette
  c.fillStyle = '#b4584a'; c.beginPath(); c.moveTo(0, 410); c.bezierCurveTo(90, 372, 160, 400, 230, 384); c.bezierCurveTo(290, 372, 330, 392, W, 380); c.lineTo(W, GY); c.lineTo(0, GY); c.fill();
  c.fillStyle = '#5a2a3a'; c.fillRect(52, 336, 5, 70); c.beginPath(); c.ellipse(54, 334, 46, 11, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(36, 340, 22, 7, -0.2, 0, 7); c.fill();
  c.strokeStyle = '#5a2a3a'; c.lineWidth = 3; c.beginPath(); c.moveTo(55, 370); c.lineTo(34, 342); c.moveTo(55, 360); c.lineTo(78, 338); c.stroke();
  // the near sand
  const s = c.createLinearGradient(0, GY - 30, 0, H); s.addColorStop(0, '#e89a5a'); s.addColorStop(0.3, '#d8824a'); s.addColorStop(1, '#a8582e'); c.fillStyle = s;
  c.beginPath(); c.moveTo(0, GY - 22); c.bezierCurveTo(120, GY - 34, 240, GY - 14, W, GY - 26); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  c.strokeStyle = 'rgba(255,220,170,0.25)'; c.lineWidth = 2; for (let i = 0; i < 9; i++) { const y = GY + 52 + i * 18; c.beginPath(); c.moveTo(0, y); c.bezierCurveTo(120, y - 6, 240, y + 6, W, y - 2); c.stroke(); }
  for (const [x, y] of [[22, 600], [330, 580], [300, 620], [40, 520]]) { c.strokeStyle = '#8a6a2a'; c.lineWidth = 2; for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + k * 3, y - 10, x + k * 6, y - 16); c.stroke(); } }
}
function bars(c, x, y, s, col) { c.fillStyle = col; for (let i = 0; i < 4; i++) { const h = s * (0.3 + i * 0.23); c.beginPath(); c.roundRect(x - s * 0.72 + i * s * 0.38, y + s * 0.5 - h, s * 0.28, h, 2); c.fill(); } }

MG.add({
  id: 'median', stage: 'stats', cmd: 'MEDIAN!', hint: 'tap', time: 9, mood: 'warm', winText: 'Middle found!', hold: 1.6,
  card: {
    title: 'The median', ref: 'Grade 6 and up', kind: 'Statistics',
    text: 'The median of a list of numbers is the middle value once the numbers are in order.\n\nFirst sort the list from smallest to largest. Then cross off the smallest and the largest together, again and again. Whatever is left in the middle is the median.\n\nFor 7, 2, 9, 4, 5: sorted, that is 2, 4, 5, 7, 9. Cross off 2 and 9, then 4 and 7. The median is 5.\n\nWith an even count, two numbers are left in the middle. The median is halfway between them: for 2, 4, 6, 9 it is (4 + 6) ÷ 2 = 5. A single huge value barely moves the median, which is why it is often used for things like house prices.',
    note: 'Sort the numbers, then take the middle one. With an even count, average the middle two.',
    ask: 'What is the median of 8, 3, 6, 1, 9? What is the median of 5, 1, 7, 3?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g), n = p.n;
    const sp = Math.min(54, 300 / (n - 1)), slotX = i => 180 + (i - (n - 1) / 2) * sp; S.slotX = slotX; S.sp = sp;
    const hk = g.level === 0 ? 8.6 : 6.6;
    S.mk_ = p.vals.map((v, i) => ({ i, v, h: 30 + v * hk, slot: i, x: slotX(i), node: M.num(v), phase: i * 1.7, look: 0, cheerAt: -9, hopAt: -9 }));
    S.lo = 0; S.hi = n - 1; S.sortedDone = false; S.rows = []; // rows: removed pairs, in order
    S.ans = M.slot('ans', { w: 56 }); S.top = M.row(M.txt('median', 'mtx'), M.op('=', 'meq'), S.ans);
    M.place(g, 'top', S.top, 180, SIGNY + 14, 38, { col: INK }); M.inert(g, ['mtx', 'meq', 'qa', 'qb', 'qp', 'qd', 'qq', 'qe', 'q1', 'q2', 'q3']);
    const zones = () => { for (const m of S.mk_) { const id = 'm' + m.i; if (m.gone) { delete g.s.mk.box[id]; if (g.s.mk.zones) delete g.s.mk.zones[id]; continue; } M.zone(g, id, { x: m.x, y: GY - (m.h - 30) / 2, w: Math.min(44, sp - 4), h: m.h + 30, s: 30 }); } };
    S.zones = zones; zones(); M.zone(g, 'sort', { x: 180, y: 532, w: 120, h: 50 });
    S.face = (g, ex) => { S.faceT = g.t; S.ex = ex; };
    const moveTo = (g, m, slot, t0, dur, arc) => { m.mv = { x0: m.x, x1: slotX(slot), t0: g.t + t0, dur, arc }; m.slot = slot; };
    const order = S.mk_.slice().sort((a, b) => a.v - b.v);
    const active = () => order.filter(m => !m.gone);
    S.order = order;
    g.dur *= (2.6 + 1.05 * (n % 2 ? 1 + (n - 1) / 2 : 1 + (n - 2) / 2 + 1)) / 8;
    // the last meerkat standing: it stretches up and its value flies into the sign
    const crown = (g, m, len) => { const from = { x: m.x, y: GY + 24 }; m.hl = g.t; m.cheerAt = g.t; M.indicate(g, m.node, { dur: 0.4 * T, sc: 1.35, col: '#ffe070' }); g.sfx('ding');
      M.fly(g, { node: M.num(p.med, null, { col: '#fff4c0' }), from: [from.x, from.y], to: 'ans', delay: 0.3 * T, dur: 0.5 * T, arc: -70, s0: 26, s1: 38,
        then(g) { S.ans.fill = M.num(fmt(p.med), null, { pop: g.t }); M.sparkle(g, 'ans', { n: 14 }); g.sfx('coin'); for (const q of S.mk_) q.cheerAt = g.t + q.i * 0.03; } });
      // the crossed-off pairs flash two at a time, outside in: as many below the middle as above it
      S.rows.forEach((pr, k) => M.at(g, [[(0.85 + k * 0.12) * T, g => { for (const q of pr) { q.flash = g.t; } g.sfx('tap'); }]])); return len; };
    M.play(g, {
      moves(g) {
        if (!S.sortedDone) return [{ tap: 'sort', busy: 0.1, then(g) {
          S.sortedDone = true; S.sortAt = g.t; g.sfx('whoosh'); S.face(g, 'wow'); delete g.s.mk.box.sort; g.s.mk.zones.sort = false;
          const len = (0.15 + 0.045 * (n - 1) + 0.5 + 0.055 * n + 0.2) * T; M.show(g, len);
          order.forEach((m, r) => { const right = r > m.slot; moveTo(g, m, r, (0.15 + 0.045 * r) * T, 0.5 * T, r === m.slot ? 10 : right ? 30 : 8); m.look = right ? 1 : r === m.slot ? 0 : -1; });
          M.at(g, [[(0.2 + 0.045 * (n - 1) + 0.5) * T, g => { order.forEach((m, r) => M.at(g, [[r * 0.055 * T, g => { m.hopAt = g.t; m.look = 0; g.sfx(r % 2 ? 'tap' : 'pop'); const b = { x: m.x, y: GY - m.h - 6 }; g.burst(b.x, b.y, ['#ffe9a0', '#fff'], 4, 60); }]])); }]]); } }];
        const act = active();
        if (act.length >= 3) {
          const a = act[0], b = act[act.length - 1], last = act.length === 3, odd = n % 2 === 1;
          const len = 0.85 * T;
          const mv = { tap: ['m' + a.i, 'm' + b.i], busy: 0.1, then(g) {
            M.show(g, len); S.face(g, 'think'); S.rows.push([a, b]); g.sfx('swoosh');
            M.circle(g, 'm' + a.i, { dur: 0.45 * T, col: ROPE }); M.circle(g, 'm' + b.i, { dur: 0.45 * T, col: ROPE, delay: 0.05 * T });
            // a rope loops over the pair: the smallest and the largest go together
            M.anim(g, { dur: 0.35 * T, linger: 0.35 * T, draw(c, g, k, tt) { const top = GY - Math.max(a.h, b.h) - 22, fade = tt > 0.35 * T ? 1 - (tt - 0.35 * T) / (0.35 * T) : 1;
              c.globalAlpha = Math.max(0, fade); c.strokeStyle = ROPE; c.lineWidth = 3; c.setLineDash([7, 5]); c.shadowColor = ROPE; c.shadowBlur = 8; c.beginPath();
              const e = M.easeIO(k); for (let i = 0; i <= 30 * e; i++) { const u = i / 30, x = M.lerp(a.x, b.x, u), y = M.lerp(GY - a.h - 8, GY - b.h - 8, u) - Math.sin(u * Math.PI) * (top < 300 ? 30 : 46); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); } });
            M.strike(g, a.node, { delay: 0.3 * T, dur: 0.22 * T, col: BAD }); M.strike(g, b.node, { delay: 0.38 * T, dur: 0.22 * T, col: BAD });
            M.at(g, [[0.5 * T, g => { for (const m of [a, b]) { m.duck = { t0: g.t, dur: 0.3 * T }; } g.sfx('thud'); }],
              [0.8 * T, g => { a.gone = b.gone = true; zones(); for (const m of [a, b]) g.burst(m.x, GY, ['#f2c890', '#d8a060'], 7, 70); }]]);
          } };
          if (last && odd) Object.assign(mv, { askAt: 0.82 * T, after: 1.3 * T, ask: { v: p.med, wrong: [p.vals[(n - 1) / 2], act[0].v, act[2].v, Math.round(p.vals.reduce((s, v) => s + v, 0) / n)] },
            resolve(g) { M.show(g, 1.3 * T); crown(g, act[1]); } });
          return [mv];
        }
        if (act.length === 2 && !S.avg) {
          const [a, b] = act, q = (a.v + b.v) / 2, len = 0.75 * T;
          const go = { busy: 0.1, askAt: len, after: 1.25 * T, ask: { v: q, wrong: [a.v + b.v, a.v, b.v, q + 1] },
            then(g) { S.avg = g.t; M.show(g, len); S.face(g, 'think'); g.sfx('swoosh'); a.look = 1; b.look = -1;
              // the two middle meerkats lean toward each other; the working writes itself above them
              S.q = M.num(fmt(q), 'qq', { alpha: 0, col: '#fff4c0' });
              S.note = M.row(M.paren(M.row(M.num(a.v, 'qa'), M.op('+', 'qp'), M.num(b.v, 'qb'))), M.op('÷', 'qd'), M.num(2, 'q2'), M.op('=', 'qe'), S.q);
              M.place(g, 'note', S.note, (a.x + b.x) / 2, GY - Math.max(a.h, b.h) - 36, 30, { col: INK }); M.writeIn(g, S.note, { dur: 0.55 * T, delay: 0.1 * T });
              M.indicate(g, a.node, { dur: 0.35 * T, col: '#ffe070' }); M.indicate(g, b.node, { dur: 0.35 * T, delay: 0.12 * T, col: '#ffe070' }); },
            resolve(g) { M.show(g, 1.25 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); M.indicate(g, S.q, { delay: 0.15 * T, dur: 0.35 * T }); g.sfx('ding');
              // a flag plants itself halfway between them: the median sits in the middle
              M.at(g, [[0.25 * T, g => { S.flag = { t0: g.t, x: (a.x + b.x) / 2 }; g.sfx('pop'); a.cheerAt = b.cheerAt = g.t; }],
                [0.5 * T, g => { const bq = M.box(g, 'qq'); M.tween(g, S.note, { alpha: 0 }, 0.3 * T);
                  M.fly(g, { node: M.num(fmt(q), null, { col: '#fff4c0' }), from: [bq.x, bq.y], to: 'ans', dur: 0.45 * T, arc: -40, s0: 26, s1: 38,
                    then(g) { S.ans.fill = M.num(fmt(q), null, { pop: g.t }); M.sparkle(g, 'ans', { n: 14 }); g.sfx('coin'); for (const m of S.mk_) m.cheerAt = g.t + m.i * 0.03; delete g.s.mk.ex.note; } }); }]]); } };
          return [{ drag: 'm' + a.i, to: 'm' + b.i, ...go }, { drag: 'm' + b.i, to: 'm' + a.i, ...go }];
        }
        return [];
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || m.drag) : null; },
    });
  },
  update(g, dt) {
    const S = g.s;
    for (const m of S.mk_) if (m.mv) { const k = M.clamp((g.t - m.mv.t0) / m.mv.dur, 0, 1); if (g.t < m.mv.t0) continue; m.x = M.lerp(m.mv.x0, m.mv.x1, M.easeIO(k)); m.lift = Math.sin(k * Math.PI) * m.mv.arc; if (k >= 1) { m.mv = null; m.lift = 0; } }
    S.zones(); M.update(g, dt);
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, p = S.p;
    c.drawImage(g.bake('stats_median_kalahari', sky), 0, 0, 360, 640);
    // drifting dust in the low sun
    for (let i = 0; i < 14; i++) { const x = (i * 71 + t * (8 + i % 4 * 3)) % 380 - 10, y = 300 + (i * 37) % 140 + Math.sin(t + i) * 8; c.fillStyle = `rgba(255,230,180,${0.25 + 0.25 * Math.sin(t * 2 + i)})`; c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); }
    SCN.panel(c, 'sign', 180, SIGNY, 236, 66, t);
    c.fillStyle = '#6e4524'; c.fillRect(176, SIGNY + 33, 8, 36);
    // burrows at every slot
    for (let i = 0; i < p.n; i++) { const x = S.slotX(i); c.fillStyle = '#f0b070'; c.beginPath(); c.ellipse(x, GY + 3, 22, 8, 0, 0, 7); c.fill(); c.fillStyle = '#3a1a14'; c.beginPath(); c.ellipse(x, GY + 3, 15, 5, 0, 0, 7); c.fill(); }
    // the sort stone
    if (!S.sortedDone || t - S.sortAt < 0.4) { const k = S.sortedDone ? 1 - (t - S.sortAt) / 0.4 : 1, w = 108 * (0.7 + 0.3 * k);
      c.save(); c.globalAlpha = k; c.fillStyle = 'rgba(60,20,10,0.3)'; c.beginPath(); c.ellipse(180, 556, w / 2, 8, 0, 0, 7); c.fill();
      c.fillStyle = '#8a6a5a'; c.beginPath(); c.roundRect(180 - w / 2, 510, w, 44, 16); c.fill(); c.fillStyle = '#a88878'; c.beginPath(); c.roundRect(180 - w / 2 + 4, 512, w - 8, 18, 9); c.fill();
      bars(c, 180, 532, 30, '#fff0c8'); c.restore(); }
    const miss = K.missInfo && K.missInfo.tap && t - K.missAt < 0.6 ? K.missInfo.tap : null;
    const won = g.done && g.result === 'win';
    // the meerkats, then their pebbles
    for (const m of S.mk_) {
      const dk = m.duck ? M.clamp((t - m.duck.t0) / m.duck.dur, 0, 1) : 0;
      const pop = won && m.gone ? M.clamp((t - g.doneAt - 0.2 - m.i * 0.05) / 0.3, 0, 0.55) : 0; // at the win, every head pops back up
      const sink = m.gone ? m.h * (1 - pop) + 6 : m.h * M.easeIO(dk) * 1.05;
      const hop = t - m.hopAt < 0.28 ? Math.sin((t - m.hopAt) / 0.28 * Math.PI) * 10 : 0, ch = t - m.cheerAt < 0.9 && t > m.cheerAt;
      const sh = miss === 'm' + m.i ? Math.sin((t - K.missAt) * 50) * 4 : 0, grow = m.hl != null ? 1 + 0.12 * Math.sin(M.clamp((t - m.hl) / 0.5, 0, 1) * Math.PI) : 1;
      if (m.hl != null && !m.gone) { const k = 0.5 + 0.5 * Math.sin(t * 4), gr = c.createRadialGradient(m.x, GY - m.h / 2, 4, m.x, GY - m.h / 2, m.h / 2 + 30); gr.addColorStop(0, `rgba(255,236,150,${0.5 + 0.2 * k})`); gr.addColorStop(1, 'rgba(255,236,150,0)'); c.fillStyle = gr; c.beginPath(); c.arc(m.x, GY - m.h / 2, m.h / 2 + 30, 0, 7); c.fill(); }
      c.save(); c.beginPath(); c.rect(m.x - 60, 0, 120, GY + 4); c.clip();
      meerkat(c, m.x + sh, GY + sink - (m.lift || 0) - hop, m.h * grow, { t, phase: m.phase, look: m.look, cheer: ch || (won && !m.gone), wow: ch || (S.faceT != null && t - S.faceT < 0.5 && S.ex === 'wow'), red: !!sh });
      c.restore();
    }
    for (const m of S.mk_) {
      const x = m.x, y = GY + 26 - (m.lift || 0) * 0.6, fl = m.flash != null && t - m.flash < 0.35 ? Math.sin((t - m.flash) / 0.35 * Math.PI) : 0;
      c.save(); c.fillStyle = 'rgba(60,20,10,0.3)'; c.beginPath(); c.ellipse(x, y + 14, 19, 5, 0, 0, 7); c.fill();
      c.fillStyle = m.gone ? '#b89a88' : '#f4eadc'; c.beginPath(); c.ellipse(x, y, 20 + fl * 3, 15 + fl * 2, 0, 0, 7); c.fill(); c.strokeStyle = fl ? ROPE : 'rgba(90,50,40,0.5)'; c.lineWidth = 2; c.stroke();
      const s = 24, mm = M.lay(m.node, s); M.draw(c, m.node, x - mm.w / 2, y + (mm.a - mm.d) / 2, s, { t, col: m.gone ? '#6a4a40' : '#3a1a20' }); c.restore();
    }
    // the flag halfway between the middle pair
    if (S.flag) { const k = M.ease((t - S.flag.t0) / 0.3), x = S.flag.x, y = GY + 6; c.save(); c.strokeStyle = '#5a3a24'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 54 * k); c.stroke();
      c.fillStyle = '#ffe070'; c.beginPath(); c.moveTo(x, y - 54 * k); c.lineTo(x + 18 * k + Math.sin(t * 6) * 2, y - 47 * k); c.lineTo(x, y - 40 * k); c.fill(); c.restore(); }
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'note');
    // a dragged middle value follows the finger
    const P0 = K.press; if (P0 && P0.dragging) { const m = S.mk_.find(q => 'm' + q.i === P0.id); if (m) { const mm = M.lay(m.node, 30); c.save(); c.fillStyle = '#f4eadc'; c.beginPath(); c.ellipse(P0.x, P0.y - 20, 24, 18, 0, 0, 7); c.fill(); M.draw(c, { ...m.node, strike: null }, P0.x - mm.w / 2, P0.y - 20 + (mm.a - mm.d) / 2, 30, { t, col: '#3a1a20' }); c.restore(); } }
    M.drawUI(g, c);
  },
});
