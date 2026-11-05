// longway_skip.js — SKIP COUNT! 5 × 4 = ? as 5 equal hops of 4 along a number line: a frog on a log bridge at dusk.
// The number line is painted on a long log over a stream; the frog sits at 0. The working plays by itself:
//   1. drag the 4 (the size of one hop) onto the frog (or anywhere on the log): the 4 flies onto the frog, and a dashed
//      golden arc draws itself from 0 to 4 with "4" on top: one hop is 4 long.
//   2. tap the 5 (how many hops): the 5 swells and the frog hops 5 times along the arc. Each hop leaves a solid arc
//      with a numbered badge on top (1, 2, 3, ...), and the number it lands on writes itself under the log: 4, 8, 12,
//      16, 20 (the skip count), with a rising plink on every landing.
//   3. tap the ? : the hop badges flash in turn, "5 hops of 4" is circled, and the 20 the frog stands on flies up into
//      the ? : 5 × 4 = 20.
// The roles may be swapped (4 × 5 = 5 × 4): drag the 5 onto the frog and tap the 4 to make 4 hops of 5.
// Level 0: hops of 2, 3 or 5, two to four of them. Level 1: hops of 3 to 6. Level 2: hops of 6 to 9.
// Medium mode: step 3 asks for the product.
const M = MK, LY = 404, X0 = 30, X1 = 330, EY = 222, INK = '#fff4dc', GOLD = '#ffd25a', ARC = '#ffe7a0';
function pick(g) {
  const L = g.level, ri = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  if (L === 0) return { a: ri(2, 4), b: [2, 3, 5][ri(0, 2)] };
  if (L === 1) return { a: ri(3, 5), b: ri(3, 6) };
  return { a: ri(3, 5), b: ri(6, 9) };
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

// ---------------- the stream at dusk (baked) ----------------
function dusk(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 430); sk.addColorStop(0, '#1e1a4a'); sk.addColorStop(0.45, '#5a3a7a'); sk.addColorStop(0.8, '#d0708a'); sk.addColorStop(1, '#f6b07a'); c.fillStyle = sk; c.fillRect(0, 0, W, 430);
  P.stars(c, W, 200, 40, 11, 0);
  c.fillStyle = '#fff2c8'; c.beginPath(); c.arc(276, 132, 15, 0, 7); c.fill(); c.fillStyle = '#4a3472'; c.beginPath(); c.arc(283, 127, 13, 0, 7); c.fill();
  // far hills and a line of dark trees
  c.fillStyle = '#4a2e5e'; c.beginPath(); c.moveTo(0, 380); for (let x = 0; x <= W; x += 24) c.lineTo(x, 352 + Math.sin(x * 0.02) * 16 + Math.sin(x * 0.07) * 5); c.lineTo(W, 430); c.lineTo(0, 430); c.fill();
  const R = P.rng(7); c.fillStyle = '#2e1c40'; for (let i = 0; i < 16; i++) { const x = i * 24 + R() * 10, h = 30 + R() * 36; c.beginPath(); c.moveTo(x - 12, 400); c.lineTo(x, 400 - h); c.lineTo(x + 12, 400); c.fill(); }
  // the stream
  const wg = c.createLinearGradient(0, 410, 0, 560); wg.addColorStop(0, '#5a4a8a'); wg.addColorStop(0.4, '#3a3a72'); wg.addColorStop(1, '#22284e'); c.fillStyle = wg; c.fillRect(0, 410, W, 160);
  c.fillStyle = 'rgba(246,176,122,0.25)'; for (let i = 0; i < 14; i++) { const y = 430 + i * 9, w = 60 - i * 3; c.fillRect(200 - w / 2 + R() * 30, y, w, 2); }
  // the near bank with reeds
  c.fillStyle = '#2a3a2a'; c.beginPath(); c.moveTo(0, 560); for (let x = 0; x <= W; x += 20) c.lineTo(x, 552 + Math.sin(x * 0.05) * 5); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  c.strokeStyle = '#3a5a3a'; c.lineWidth = 3; c.lineCap = 'round'; for (let i = 0; i < 26; i++) { const x = R() * W, h = 20 + R() * 40; c.beginPath(); c.moveTo(x, 600); c.quadraticCurveTo(x + 6, 600 - h / 2, x + (R() - 0.5) * 14, 600 - h); c.stroke(); }
  for (let i = 0; i < 5; i++) { const x = 30 + R() * 300, y = 572 + R() * 50; c.fillStyle = '#6a3a2a'; c.beginPath(); c.ellipse(x, y - 20, 3, 8, 0, 0, 7); c.fill(); c.strokeStyle = '#4a6a3a'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y - 12); c.lineTo(x, y + 14); c.stroke(); }
}
// the log the number line is painted on
function log(c) {
  c.fillStyle = 'rgba(10,8,30,0.35)'; c.beginPath(); c.ellipse(180, LY + 26, 176, 9, 0, 0, 7); c.fill();
  const lg = c.createLinearGradient(0, LY - 8, 0, LY + 18); lg.addColorStop(0, '#a8784a'); lg.addColorStop(0.5, '#7a4e2c'); lg.addColorStop(1, '#4a2c18'); c.fillStyle = lg;
  rr(c, 8, LY - 8, 344, 26, 12); c.fill(); c.strokeStyle = 'rgba(40,20,10,0.4)'; c.lineWidth = 1.2; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(20 + i * 56, LY + 2 + (i % 2) * 6); c.lineTo(60 + i * 56, LY + 3 + (i % 2) * 6); c.stroke(); }
  c.fillStyle = '#c89a68'; c.beginPath(); c.ellipse(350, LY + 5, 6, 13, 0, 0, 7); c.fill(); c.strokeStyle = '#7a4e2c'; c.lineWidth = 1; c.beginPath(); c.ellipse(350, LY + 5, 3, 7, 0, 0, 7); c.stroke();
}

MG.add({
  id: 'longway_skip', stage: 'longway', cmd: 'SKIP COUNT!', hint: 'drag', time: 9, mood: 'bright', winText: 'Hop hop hop!', hold: 1.6,
  card: {
    title: 'Skip counting', ref: 'Grade 3', kind: 'Multiplication',
    text: 'Multiplying adds equal groups. 5 × 4 means 5 groups of 4.\n\nOn a number line you can show it as equal hops. Start at 0 and make 5 hops, each 4 long. Count where you land: 4, 8, 12, 16, 20. Counting like this, by the same jump each time, is called skip counting. After 5 hops you are at 20, so 5 × 4 = 20.\n\nYou can also make 4 hops of 5: 5, 10, 15, 20. You land on the same number, because 4 × 5 = 5 × 4. The order of the numbers does not change the answer.',
    note: 'To multiply, skip count by one number as many times as the other number says. Where you land is the answer.',
    ask: 'Skip count by 3, six times. Where do you land? What is 4 × 6?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a, b } = S, P0 = a * b;
    S.N = P0 + Math.min(a, b); S.u = (X1 - X0) / S.N; S.pos = 0; S.size = 0; S.count = 0; S.hops = []; S.labels = [{ v: 0, t0: -9 }]; S.hop = null; S.point = false;
    S.slot = M.slot('ans'); S.ex = M.row(M.num(a, 'fa'), M.op('×', 'mul'), M.num(b, 'fb'), M.op('=', 'eq'), S.slot);
    M.place(g, 'ex', S.ex, 180, EY, 52, { col: INK }); M.inert(g, ['mul', 'eq']);
    S.fx = () => X0 + S.pos * S.u;
    S.zone = () => M.zone(g, 'frog', { x: S.fx(), y: LY - 26, w: 54, h: 56 });
    S.zone();
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const face = (e) => { g.s.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    const setSize = (g, from) => { // step 1: one hop is this long
      const T = M.pace(g), v = from === 'fb' ? b : a; S.size = v; S.times = from === 'fb' ? a : b; S.countId = from === 'fb' ? 'fa' : 'fb'; S.sizeId = from;
      M.show(g, 1.0 * T); face('think');
      const fb = { ...M.box(g, from) }; M.light(g, from, { col: GOLD });
      M.fly(g, { node: M.num(v, null, { col: GOLD }), from: [fb.x, fb.y], to: [S.fx(), LY - 50], dur: 0.4 * T, arc: -50, s0: 52, s1: 30,
        then(g) { g.sfx('pop'); face(); S.preview = { t0: g.t, dur: 0.45 * T }; g.burst(S.fx(), LY - 40, [GOLD, '#fff'], 8, 90); } });
      M.at(g, [[0.9 * T, g => { g.sfx('ding', { pitch: 1.2 }); }]]);
    };
    const hopAll = (g) => { // step 2: hop that many times
      const T = M.pace(g), n = S.times, hd = Math.max(0.2, 0.32 * T * (n > 5 ? 5 / n : 1)), gap = 0.05 * T;
      M.show(g, 0.3 * T + n * (hd + gap) + 0.35 * T); S.point = true;
      M.indicate(g, S.countId, { sc: 1.35, dur: 0.4 * T, col: '#9ae0ff' }); M.light(g, S.countId, { col: '#9ae0ff', delay: 0.3 * T });
      const steps = []; for (let i = 0; i < n; i++) steps.push([0.3 * T + i * (hd + gap), g => {
        const from = S.pos, to = from + S.size; S.hop = { from, to, t0: g.t, dur: hd, i: i + 1 }; g.sfx('whoosh', { vol: 0.35, pitch: 1.3 });
        M.later(g, hd, g => { S.pos = to; S.hop = null; S.hops.push({ from, to, i: i + 1, t0: g.t }); S.labels.push({ v: to, t0: g.t }); S.count = i + 1; S.zone();
          g.sfx('ding', { pitch: 0.8 + i * 0.12, vol: 0.6 }); g.burst(X0 + to * S.u, LY - 4, ['#9ae0ff', '#fff', GOLD], 6, 70); face(i + 1 === n ? 'laugh' : 'happy'); }, true); }]);
      steps.push([0.3 * T + n * (hd + gap) + 0.1 * T, g => { S.point = false; M.unlight(g, S.countId); }]);
      M.at(g, steps);
    };
    M.play(g, {
      moves(g) {
        const area = [0, LY - 90, 360, LY + 60], T = M.pace(g);
        if (!S.size) return [{ drag: 'fb', to: 'frog', area, busy: 0.1, then: g => setSize(g, 'fb') }, { drag: 'fa', to: 'frog', area, busy: 0.1, then: g => setSize(g, 'fa') }];
        if (!S.count) return [{ tap: S.countId, busy: 0.1, then: g => hopAll(g) }];
        if (S.done) return [];
        return [{ tap: 'ans', busy: 0.1, askAt: 0.75 * T, after: 0.9 * T, ask: { v: P0, wrong: [a + b, P0 + S.size, P0 - S.size, S.times + S.size + 10].filter(w => w > 0) },
          then(g) { S.done = true; M.show(g, 0.75 * T); S.point = true; face('think');
            // the badges flash in turn: that many hops of that size
            S.flash = { t0: g.t, dur: 0.5 * T }; M.circle(g, [S.countId], { dur: 0.5 * T, col: '#9ae0ff' }); M.circle(g, [S.sizeId], { dur: 0.5 * T, col: GOLD, delay: 0.15 * T });
            M.note(g, { node: M.row(M.num(S.times, null, { col: '#9ae0ff' }), M.txt(S.times === 1 ? ' hop of ' : ' hops of '), M.num(S.size, null, { col: GOLD })), at: [S.fx() > 220 ? 230 : Math.max(110, S.fx()), LY - 132], s: 28, col: INK, write: 0.35 * T, hold: 0.7 * T, fade: 0.25 * T }); },
          resolve(g) { M.show(g, 0.9 * T); const x = X0 + P0 * S.u; g.sfx('swoosh'); face();
            S.lift = g.t; // the landing number lifts off the log and flies into the ?
            M.fly(g, { node: M.num(P0, null, { col: '#9ae0ff' }), from: [x, LY + 38], to: 'ans', dur: 0.5 * T, arc: -60, s0: 24, s1: 52,
              then(g) { S.slot.fill = M.num(P0, 'res', { _born: -1, col: '#bff0ff' }); S.slot.fill.pop = g.t; M.relayout(g, 'ex'); M.inert(g, ['res']); M.sparkle(g, 'ans', { n: 16, cols: ['#9ae0ff', GOLD, '#fff'] }); g.sfx('coin'); face('laugh'); S.point = false; } });
            M.at(g, [[0.75 * T, g => { M.unlight(g, S.sizeId); }]]); } }];
      },
      area(g) { const mv = M.current(g)[0]; return mv ? [].concat(mv.tap || mv.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); g.s.zone(); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, u = S.u, X = v => X0 + v * u;
    c.drawImage(g.bake('longway_skip_dusk', dusk), 0, 0, 360, 640);
    // fireflies drifting over the stream
    for (let i = 0; i < 14; i++) { const x = (i * 53 + Math.sin(t * 0.6 + i) * 24 + 400) % 360, y = 300 + (i * 37) % 260 + Math.cos(t * 0.8 + i * 1.7) * 12, a = 0.3 + 0.6 * Math.abs(Math.sin(t * 1.8 + i));
      c.fillStyle = `rgba(230,255,150,${a * 0.3})`; c.beginPath(); c.arc(x, y, 6, 0, 7); c.fill(); c.fillStyle = `rgba(240,255,170,${a})`; c.beginPath(); c.arc(x, y, 2, 0, 7); c.fill(); }
    // the sign with the problem
    SCN.panel(c, 'sign', 180, EY - 18, 236, 78, t); M.drawEx(g, c, 'ex');
    log(c);
    // the number line: a tick for every whole number, a taller one every 5, and 0 labelled
    c.strokeStyle = 'rgba(255,240,210,0.9)'; c.lineCap = 'round'; c.lineWidth = 3; c.beginPath(); c.moveTo(X0 - 6, LY); c.lineTo(X1 + 12, LY); c.stroke();
    c.beginPath(); c.moveTo(X1 + 12, LY); c.lineTo(X1 + 4, LY - 5); c.moveTo(X1 + 12, LY); c.lineTo(X1 + 4, LY + 5); c.stroke();
    for (let v = 0; v <= S.N; v++) { const big = v % 5 === 0, x = X(v); c.lineWidth = big ? 2.5 : 1.4; c.strokeStyle = big ? 'rgba(255,240,210,0.95)' : 'rgba(255,240,210,0.55)'; c.beginPath(); c.moveTo(x, LY - (big ? 8 : 5)); c.lineTo(x, LY + (big ? 8 : 5)); c.stroke(); }
    // the landing numbers write themselves under the log: the skip count
    c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    for (const L of S.labels) { if (S.lift && L.v === S.a * S.b && t - S.lift < 0.5) continue; const k = M.clamp((t - L.t0) / 0.3, 0, 1), sc = 1 + Math.sin(k * Math.PI) * 0.5, x = X(L.v);
      c.save(); c.translate(x, LY + 46); c.scale(sc, sc); c.font = M.NUMF(L.v ? Math.min(26, Math.max(19, (S.size || 9) * u * 0.85)) : 22, 700); c.shadowColor = 'rgba(10,6,30,0.85)'; c.shadowBlur = 6; c.shadowOffsetY = 2; c.lineWidth = 5; c.lineJoin = 'round'; c.strokeStyle = 'rgba(20,14,40,0.85)'; c.strokeText(String(L.v), 0, 0); c.shadowColor = 'transparent'; c.fillStyle = L.v ? '#bff0ff' : 'rgba(255,240,210,0.8)'; c.fillText(String(L.v), 0, 0); c.restore();
      if (L.v) { c.fillStyle = '#9ae0ff'; c.beginPath(); c.arc(x, LY, 4, 0, 7); c.fill(); } }
    // hop arcs: the golden preview of one hop, then a solid arc with a numbered badge for every hop made
    const hh = len => M.clamp(len * u * 0.42, 26, 64);
    const arcPath = (from, to, k) => { const x0 = X(from), x1 = X(to), h = hh(to - from); c.beginPath(); for (let i = 0; i <= 24 * k; i++) { const q = i / 24; c.lineTo(x0 + (x1 - x0) * q, LY - 10 - Math.sin(q * Math.PI) * h); } };
    if (S.preview && S.size) { const k = M.easeIO((t - S.preview.t0) / S.preview.dur), fade = S.count ? 0.35 : 1;
      c.save(); c.globalAlpha = fade; c.setLineDash([7, 6]); c.strokeStyle = GOLD; c.lineWidth = 3; arcPath(0, S.size, k); c.stroke(); c.restore();
      if (k > 0.5 && !S.count) { c.save(); c.globalAlpha = Math.min(1, (k - 0.5) * 3); c.font = M.NUMF(28); c.fillStyle = GOLD; c.lineWidth = 4; c.strokeStyle = 'rgba(30,14,40,0.75)'; const x = X(S.size / 2), y = LY - 18 - hh(S.size); c.strokeText(String(S.size), x, y); c.fillText(String(S.size), x, y); c.restore(); } }
    const flash = S.flash ? (t - S.flash.t0) / S.flash.dur : -1;
    for (const H of S.hops) { const k = M.clamp((t - H.t0) / 0.2, 0, 1); c.strokeStyle = '#9ae0ff'; c.lineWidth = 3; c.setLineDash([]); arcPath(H.from, H.to, 1); c.stroke();
      const x = X((H.from + H.to) / 2), y = LY - 12 - hh(H.to - H.from), on = flash >= 0 && flash < 1.6 && Math.abs(flash * S.times - (H.i - 0.5)) < 0.8, r = 11 * (0.4 + 0.6 * M.ease(k)) * (on ? 1.25 : 1);
      c.fillStyle = on ? '#fff6c0' : '#2a4a8a'; c.strokeStyle = '#9ae0ff'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke();
      c.fillStyle = on ? '#2a1a40' : '#e8f8ff'; c.font = M.NUMF(15); c.textBaseline = 'middle'; c.fillText(String(H.i), x, y + 1); c.textBaseline = 'alphabetic'; }
    // the frog: mid-hop it flies along the arc; otherwise it sits on its number
    let fx = S.fx(), fy = LY - 6, pose = 'idle';
    if (S.hop) { const k = M.easeIO((t - S.hop.t0) / S.hop.dur); fx = X(S.hop.from + (S.hop.to - S.hop.from) * k); fy = LY - 6 - Math.sin(k * Math.PI) * hh(S.hop.to - S.hop.from) - 12 * Math.sin(k * Math.PI); pose = 'hop'; }
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missK = K.missAt >= 0 && t - K.missAt < 0.5;
    const hopK = !S.hop && K.lastMove != null && t - K.lastMove < 0.3 ? Math.sin((t - K.lastMove) / 0.3 * Math.PI) : 0;
    const expr = won ? 'laugh' : lost || missK ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy';
    if (won) pose = 'cheer'; else if (!S.hop && S.point && M.showing(g) && !S.count) pose = 'point';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'frog', fx + (missK ? Math.sin((t - K.missAt) * 40) * 3 : 0), fy - hopK * 10, 0.72, { t, pose, expr, noShadow: !!S.hop }); else SCN.host(g, c, 'frog', fx, fy, 0.72);
    // the hop size rides on the frog's back once it is set
    if (S.size && !S.count && !S.hop) { const y = fy - 60 - hopK * 10; c.fillStyle = 'rgba(40,20,50,0.8)'; c.beginPath(); c.arc(fx, y, 13, 0, 7); c.fill(); c.font = M.NUMF(18); c.fillStyle = GOLD; c.textBaseline = 'middle'; c.fillText(String(S.size), fx, y + 1); c.textBaseline = 'alphabetic'; }
    M.drawUI(g, c);
  },
});
