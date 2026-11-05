// twostep_ineq.js — INEQUALITY! Solve a two-step inequality (2x + 3 < 11) and graph the answer on a number line.
// A pond at dawn. The inequality is written on a big lily pad, and a floating log below is the number line. Every
// move's working plays by itself (show your work; the fuse stands still meanwhile):
//   1. Drag the "+ 3" across the < sign (anywhere on the right side counts): it hops over the sign, its + flips to − at
//      the top of the hop, and it lands as "11 − 3". "11 − 3 = 8" writes itself below, the − 3 slides into the 11 and
//      it rolls down to 8.
//   2. Drag the 2 across: "÷ 2" writes itself under both sides; on the left it flies into the 2, which is crossed out,
//      on the right a fraction bar draws itself (8 / 2), then the 2 rises into the 8 and it rolls over to 4: x < 4.
//      Dividing by a negative number (level 2) flips the sign: it spins around like a coin and lands facing the other way.
//   3. Drag the answer down onto the log: a ring drops onto 4 with a splash (open for < and >, filled for ≤ and ≥), the
//      ray shoots out toward the solutions with an arrowhead, and the lily pads along it light up one after another.
// Dragging the 2 before the + 3 is the classic mistake (it divides only part of the left side): a wrong move.
// Level 0: 2x + 3 < 11 kinds, a positive answer. Level 1: ≤ and ≥, subtraction. Level 2: often a negative coefficient
// (the sign flips) and sometimes a negative answer. Medium mode: the two computations are picked from the tray.
const M = MK;
const Y = 270, ES = 46, INK = '#183a1e', NOTEY = 352, NOTEC = '#2a1a48', LY = 470, UNIT = 28, HX = 54, HY = 612, GOLD = '#ffd23a';
const flipRel = r => ({ '<': '>', '>': '<', '≤': '≥', '≥': '≤' })[r];

function pick(g) {
  const L = g.level, ri = (a, b) => a + Math.floor(g.rand() * (b - a + 1)), rels = L === 0 ? ['<', '>'] : ['<', '>', '≤', '≥'];
  for (let n = 0; n < 400; n++) {
    let a = L === 0 ? ri(2, 3) : ri(2, 5), b = L === 0 ? ri(1, 5) : L === 1 ? ri(1, 7) : ri(-4, 6), k = L === 0 ? ri(1, 8) : (g.rand() < 0.5 ? -1 : 1) * ri(1, 9);
    if (L === 2 && g.rand() < 0.65) a = -ri(2, 4);
    const c = a * b + k, rel = rels[ri(0, rels.length - 1)];
    if (b === 0 || Math.abs(c) > 30 || c === 0) continue;
    return { a, b, k, c, rel };
  }
  return { a: 2, b: 4, k: 3, c: 11, rel: '<' };
}

// the pond at dawn: peach sky, a low sun, misty far bank, still water with ripples, reeds and a mossy near bank
function pond(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 330); sk.addColorStop(0, '#6a8ac8'); sk.addColorStop(0.45, '#e8a8b8'); sk.addColorStop(0.8, '#ffd0a0'); sk.addColorStop(1, '#ffe8c0'); c.fillStyle = sk; c.fillRect(0, 0, W, 330);
  const sg = c.createRadialGradient(250, 320, 4, 250, 320, 150); sg.addColorStop(0, 'rgba(255,250,220,0.9)'); sg.addColorStop(0.2, 'rgba(255,230,170,0.45)'); sg.addColorStop(1, 'rgba(255,220,170,0)'); c.fillStyle = sg; c.fillRect(100, 170, 300, 160);
  c.fillStyle = '#fff6dc'; c.beginPath(); c.arc(250, 322, 20, Math.PI, 0); c.fill();
  // far bank: soft blue-green tree line
  c.fillStyle = '#7a8aa8'; const R = P.rng(14); c.beginPath(); c.moveTo(0, 330); for (let x = 0; x <= W; x += 14) c.lineTo(x, 316 - R() * 22 - Math.sin(x * 0.03) * 8); c.lineTo(W, 334); c.lineTo(0, 334); c.fill();
  // water
  const wg = c.createLinearGradient(0, 330, 0, H); wg.addColorStop(0, '#f2c4a8'); wg.addColorStop(0.15, '#9ab0c8'); wg.addColorStop(0.6, '#4a7a98'); wg.addColorStop(1, '#2e5a78'); c.fillStyle = wg; c.fillRect(0, 330, W, H - 330);
  c.fillStyle = 'rgba(255,240,200,0.5)'; for (let i = 0; i < 9; i++) c.fillRect(250 - 30 + R() * 20 - i * 3, 338 + i * 8, 40 + i * 6, 2); // the sun's path on the water
  c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = 1.2; for (let i = 0; i < 30; i++) { const x = R() * W, y = 360 + R() * 260; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 12 + R() * 24, y); c.stroke(); }
  // mist band
  const mg = c.createLinearGradient(0, 300, 0, 360); mg.addColorStop(0, 'rgba(255,240,230,0)'); mg.addColorStop(0.5, 'rgba(255,240,230,0.45)'); mg.addColorStop(1, 'rgba(255,240,230,0)'); c.fillStyle = mg; c.fillRect(0, 300, W, 60);
  // reeds and cattails at both sides
  for (const [x0, n] of [[0, 9], [318, 7]]) for (let i = 0; i < n; i++) { const x = x0 + R() * 42, h = 70 + R() * 80, y = 560 + R() * 30; c.strokeStyle = i % 2 ? '#3a5a2a' : '#4a6a34'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 6, y - h / 2, x + (R() - 0.5) * 14, y - h); c.stroke();
    if (i % 3 === 0) { c.fillStyle = '#6a3a1e'; c.beginPath(); c.ellipse(x + (R() - 0.5) * 4, y - h * 0.86, 3.5, 10, 0, 0, 7); c.fill(); } }
  // near bank
  c.fillStyle = '#3e5a2a'; c.beginPath(); c.moveTo(0, 590); c.quadraticCurveTo(60, 578, 120, 600); c.quadraticCurveTo(200, 626, 260, 610); c.quadraticCurveTo(310, 598, 360, 606); c.lineTo(360, H); c.lineTo(0, H); c.fill();
  c.fillStyle = '#5a7a3a'; c.beginPath(); c.moveTo(0, 594); c.quadraticCurveTo(60, 582, 120, 604); c.lineTo(120, 610); c.quadraticCurveTo(60, 590, 0, 602); c.fill();
}
// a lily pad (top view, a little squashed), with its notch pointing at angle `ang`
function pad(c, x, y, r, ang, col, lit) {
  c.save(); c.translate(x, y); c.scale(1, 0.42);
  c.fillStyle = 'rgba(20,40,40,0.25)'; c.beginPath(); c.arc(3, 5, r, 0, 7); c.fill();
  const base = lit > 0.01 ? P.mix(col, '#ffe066', lit * 0.75) : col, gr = c.createRadialGradient(-r * 0.3, -r * 0.3, 1, 0, 0, r); gr.addColorStop(0, P.shade(base, 0.25)); gr.addColorStop(1, P.shade(base, -0.12));
  c.fillStyle = gr; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r, ang + 0.22, ang + Math.PI * 2 - 0.22); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(30,60,30,0.3)'; c.lineWidth = 1.5; for (let i = 1; i < 7; i++) { const a = ang + 0.22 + i * (Math.PI * 2 - 0.44) / 7; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85); c.stroke(); }
  c.restore();
}
// a "÷ 3" working note, drawn by hand so the division sign can't be mistaken for a +: it writes itself beside `at`,
// waits, then flies to `to` and calls then(g) on landing
function divNote(g, at, off, to, toOff, o, then, a) {
  const s0 = 24, wr = o.write, hold = o.hold, fl = o.fly, dur = wr + hold + fl, lab = a < 0 ? '(−' + (-a) + ')' : String(a);
  M.at(g, [[(o.delay || 0) + dur, then]]);
  M.anim(g, { delay: o.delay, dur, draw(c, g, k, t) {
    const b0 = M.box(g, at); if (!b0) return; let x = b0.x + off[0], y = b0.y + off[1], sz = s0;
    if (t > wr + hold) { const kk = M.easeIO((t - wr - hold) / fl), b1 = M.box(g, to); if (!b1 || kk >= 1) return; x = M.lerp(x, b1.x + toOff[0], kk); y = M.lerp(y, b1.y + toOff[1], kk) - Math.sin(kk * Math.PI) * 30; sz = M.lerp(s0, 30, kk); }
    c.font = M.NUMF(sz, 700); const tw = c.measureText(lab).width, dw = sz * 0.6, gp = sz * 0.22, Wd = dw + gp + tw, x0 = x - Wd / 2, wk = M.clamp(t / wr, 0, 1);
    if (wk < 1) { c.beginPath(); c.rect(x0 - 4, y - sz, (Wd + 8) * M.easeIO(wk), sz * 2); c.clip(); }
    c.shadowColor = 'rgba(255,250,235,0.9)'; c.shadowBlur = 6; c.fillStyle = NOTEC; c.strokeStyle = NOTEC; c.lineWidth = sz * 0.11; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + dw, y); c.stroke();
    for (const d of [-1, 1]) { c.beginPath(); c.arc(x0 + dw / 2, y + d * sz * 0.24, sz * 0.085, 0, 7); c.fill(); }
    c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(lab, x0 + dw + gp, y + sz * 0.04);
  } });
}
// the relation sign drawn by hand, so it can spin: d = +1 points like ">", −1 like "<"; sx = horizontal squash (−1..1)
function relSign(c, x, y, s, rel, sx, col) {
  const d = rel === '<' || rel === '≤' ? -1 : 1, w = s * 0.24, h = s * 0.22, cy = y - s * 0.34;
  c.save(); c.translate(x, cy); c.scale(sx, 1); c.strokeStyle = col; c.lineWidth = s * 0.085; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(-d * w, -h); c.lineTo(d * w, 0); c.lineTo(-d * w, h); c.stroke();
  if (rel === '≤' || rel === '≥') { c.beginPath(); c.moveTo(-w, h + s * 0.17); c.lineTo(w, h + s * 0.17 - d * s * 0.04); c.stroke(); }
  c.restore();
}

MG.add({
  id: 'inequality', stage: 'twostep', cmd: 'INEQUALITY!', hint: 'drag', time: 10, winText: 'Solved!', hold: 1.8,
  card: {
    title: 'Solving inequalities', ref: 'Grade 7 and up', kind: 'Equations',
    text: 'An inequality compares two sides: < means "is less than", > means "is greater than", and ≤ and ≥ also allow "or equal to".\n\nYou solve it like an equation: do the same thing to both sides until x is alone. For 2x + 3 < 11, take 3 from both sides: 2x < 8. Then divide both sides by 2: x < 4. On a number line that is every number to the left of 4, with an open circle at 4 because 4 itself is not included.\n\nOne new rule: multiplying or dividing both sides by a negative number flips the sign. 2 < 3, but −2 > −3.',
    note: 'Solve like an equation, but flip the sign whenever you multiply or divide both sides by a negative number.',
    ask: 'Solve 3x − 4 ≥ 11. Solve −2x + 1 < 7.',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a, b, k, c, rel } = S, T = M.pace(g);
    S.rel = rel; S.mid = c - k;
    S.co = M.num(a, 'co'); S.xv = M.vr('x', 'xv'); S.pm = M.op(k < 0 ? '−' : '+', 'pm'); S.kk = M.num(Math.abs(k), 'kk');
    S.relN = M.op('<', 'rel', { hide: true }); S.rc = M.num(c, 'rc');
    S.L = [S.co, S.xv, S.pm, S.kk]; S.R = [S.rc];
    const relay = () => { S.ex = M.row(...S.L, S.relN, ...S.R); M.place(g, 'ex', S.ex, 180, Y, ES, { col: INK }); }; S.relay = relay; relay();
    M.zone(g, 'line', { x: 180, y: LY, w: 330, h: 60 });
    M.inert(g, ['rel', 'den', 'q1', 'q2']);
    const hop = e => { g.s.mk.lastMove = g.t; S.face = e; S.faceT = g.t; };
    const rside = () => { const rb = M.box(g, 'rel'); return [rb ? rb.x + 14 : 200, Y - 70, 360, Y + 60]; };
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const sgn = v => String(v).replace(/^-/, '−');
    // 1. move the constant across
    const kMove = {
      busy: 0.1, askAt: 0.95 * T, after: 0.95 * T, ask: { v: S.mid, wrong: [c + k, S.mid + 1, k - c] },
      then(g) {
        S.kDone = true; S.point = true; hop('wow'); M.show(g, 0.95 * T); g.sfx('swoosh');
        M.circle(g, ['pm', 'kk'], { dur: 0.4 * T, col: GOLD });
        M.at(g, [
          [0.22 * T, g => { S.L = [S.co, S.xv]; S.R = [S.rc, S.pm, S.kk]; relay(); for (const q of [S.pm, S.kk]) M.tween(g, q, { dy: -46 }, 0.32 * T, { yoyo: true }); g.sfx('whoosh'); }],
          [0.38 * T, g => { S.pm.v = k < 0 ? '+' : '−'; S.pm.pop = g.t; S.pm.col = '#c8401a'; S.kk.col = '#c8401a'; g.sfx('tap'); }],
          [0.6 * T, g => { const rb = M.unionBox([M.box(g, 'rc'), M.box(g, 'kk')]); hop('think');
            S.q1 = M.num(g.mode === 'medium' ? '?' : S.mid, 'q1', { alpha: 0 }); S.note = M.row(M.num(c), M.op(k < 0 ? '+' : '−'), M.num(Math.abs(k)), M.op('='), S.q1);
            M.place(g, 'note', S.note, M.clamp(rb.x, 110, 270), NOTEY, 30, { col: NOTEC }); M.writeIn(g, S.note, { dur: 0.3 * T });
            if (g.mode === 'medium') M.at(g, [[0.3 * T, g => { S.q1.alpha = 1; }]]); }],
        ]);
      },
      resolve(g) {
        M.show(g, 0.95 * T); const q = S.q1;
        if (g.mode === 'medium') M.roll(g, q, S.mid, { dur: 0.2 * T }); else { q.alpha = 1; M.writeIn(g, q, { dur: 0.18 * T }); }
        M.indicate(g, q, { delay: 0.12 * T, dur: 0.3 * T }); g.sfx('ding');
        M.at(g, [
          [0.3 * T, g => { const rb = M.box(g, 'rc'); for (const n of [S.pm, S.kk]) { const bb = M.box(g, n.id); M.tween(g, n, { dx: rb.x - bb.x, alpha: 0, sc: 0.5 }, 0.26 * T); } }],
          [0.45 * T, g => { M.roll(g, S.rc, S.mid, { dur: 0.3 * T }); M.sparkle(g, 'rc', { delay: 0.25 * T }); hop('laugh'); }],
          [0.7 * T, g => { S.R = [S.rc]; relay(); M.tween(g, S.note, { alpha: 0 }, 0.2 * T); }],
          [0.93 * T, g => { delete g.s.mk.ex.note; }],
        ]);
      },
    };
    // 2. divide both sides by the coefficient (a negative one flips the sign)
    const neg = a < 0, spinAt = 0.62 * T, askAt2 = (neg ? 1.2 : 0.85) * T;
    const aMove = {
      busy: 0.1, askAt: askAt2, after: 0.95 * T, ask: { v: b, wrong: [S.mid - a, S.mid * a, -b] },
      then(g) {
        S.aDone = true; S.point = true; hop('wow'); M.show(g, askAt2); g.sfx('swoosh');
        M.circle(g, 'co', { dur: 0.4 * T, col: GOLD });
        divNote(g, 'xv', [-6, 58], 'co', [0, 0], { delay: 0.12 * T, write: 0.25 * T, hold: 0.1 * T, fly: 0.22 * T },
          g => { M.strike(g, 'co', { dur: 0.15 * T }); M.tween(g, S.co, { alpha: 0 }, 0.15 * T, { delay: 0.15 * T }); M.at(g, [[0.32 * T, g => { S.L = [S.xv]; relay(); }]]); }, a);
        divNote(g, 'rc', [0, 58], 'rc', [0, 40], { delay: 0.12 * T, write: 0.25 * T, hold: 0.1 * T, fly: 0.22 * T },
          g => { S.den = M.num(a, 'den', { _born: -1, col: '#c8401a' }); S.fr = M.frac(S.rc, S.den, 'fr', { bar: { t0: g.t, dur: 0.2 * T } }); S.R = [S.fr]; relay(); g.sfx('pop'); }, a);
        if (neg) M.at(g, [[spinAt, g => { S.spin = { t0: g.t, dur: 0.5 * T }; g.sfx('magic'); hop('wow'); }],
          [spinAt + 0.5 * T, g => { S.rel = flipRel(S.rel); S.spin = null; S.relPop = g.t; M.sparkle(g, 'rel', { n: 14, cols: ['#ffd23a', '#fff', '#ff8a5a'] }); g.sfx('ding'); }]]);
      },
      resolve(g) {
        M.show(g, 0.95 * T); hop('think');
        M.at(g, [
          [0.05 * T, g => { const db = M.box(g, 'den'), nb = M.box(g, 'rc'); if (db && nb) M.tween(g, S.den, { dy: nb.y - db.y, alpha: 0, sc: 0.6 }, 0.28 * T); }],
          [0.25 * T, g => { M.roll(g, S.rc, b, { dur: 0.3 * T }); g.sfx('coin'); }],
          [0.5 * T, g => { S.R = [S.rc]; relay(); M.indicate(g, S.rc, { dur: 0.35 * T, col: GOLD }); M.sparkle(g, 'rc'); hop('laugh'); }],
        ]);
      },
    };
    // 3. graph the answer on the log
    const strict = () => S.rel === '<' || S.rel === '>';
    const gMove = {
      busy: 0.1, drag: 'rc', to: 'line', area: [10, LY - 70, 350, LY + 80],
      then(g) {
        S.gDone = true; S.point = true; hop('wow'); M.show(g, 1.45 * T); const from = { ...M.box(g, 'rc') }, X = 180;
        M.indicate(g, 'rel', { dur: 0.3 * T }); M.circle(g, ['xv', 'rel', 'rc'], { dur: 0.45 * T, col: GOLD });
        M.fly(g, { node: M.num(b, null, { col: '#fff6d8' }), from: [from.x, from.y], to: [X, LY - 30], delay: 0.12 * T, dur: 0.38 * T, arc: -30, s0: ES, s1: 26,
          then(g) { S.dot = { t0: g.t, open: strict() }; g.sfx('splash'); g.burst(X, LY, ['#cfe8ff', '#fff', '#9ad0f0'], 12, 110); hop('happy');
            M.at(g, [[0.2 * T, g => { S.ray = { t0: g.t, dur: 0.55 * T, dir: S.rel === '<' || S.rel === '≤' ? -1 : 1 }; g.sfx('sweep'); }],
              [0.85 * T, g => { hop('laugh'); g.sfx('ribbit'); S.point = false; }]]); } });
      },
    };
    M.play(g, {
      moves(g) {
        if (!S.kDone) return [{ ...kMove, drag: 'kk', to: 'rc', area: rside() }, { ...kMove, drag: 'pm', to: 'rc', area: rside() }];
        if (!S.aDone) return [{ ...aMove, drag: 'co', to: 'rc', area: rside() }];
        if (!S.gDone) return [gMove];
        return [];
      },
      area(g) { return !S.kDone ? ['pm', 'kk'] : !S.aDone ? 'co' : !S.gDone ? ['rc', 'line'] : null; },
      onWin(g) { S.rc.pop = g.t; S.xv.pop = g.t; M.sparkle(g, 'rc', { n: 12 }); },
    });
  },
  update(g, dt) {
    const S = g.s, K = S.mk; M.update(g, dt);
    // dividing before the constant has moved divides only part of the left side: a red "÷ 2" under the 2, crossed out
    if (K.missAt >= 0 && K.missAt !== S.seenMiss) { S.seenMiss = K.missAt; S.face = 'sad'; S.faceT = g.t; const info = K.missInfo || {};
      if (info.drag === 'co' && !S.kDone) { const nd = M.row(M.op('÷'), S.a < 0 ? M.paren(M.num(S.a)) : M.num(S.a)); nd.strike = { t0: g.t + 0.3, dur: 0.2, col: '#ff4a3a' };
        M.note(g, { node: nd, at: 'co', off: [0, 62], s: 26, col: '#c8201a', write: 0.25, hold: 0.4, fade: 0.25 }); } }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, X = v => 180 + (v - S.b) * UNIT;
    c.drawImage(g.bake('twostep_ineq_pond', pond), 0, 0, W, H);
    // ripples and a dragonfly
    for (let i = 0; i < 4; i++) { const k = ((t * 0.35 + i / 4) % 1), x = 60 + i * 80, y = 540 + (i % 2) * 24; c.strokeStyle = `rgba(255,255,255,${0.3 * (1 - k)})`; c.lineWidth = 1.2; c.beginPath(); c.ellipse(x, y, 6 + k * 30, (6 + k * 30) * 0.3, 0, 0, 7); c.stroke(); }
    { const dx = 300 + Math.sin(t * 0.9) * 30, dy = 380 + Math.sin(t * 2.1) * 14, f = Math.sin(t * 40) * 0.5; c.save(); c.translate(dx, dy); c.fillStyle = 'rgba(200,240,255,0.6)'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * 7, -2 + f, 8, 2.5, s * 0.2, 0, 7); c.fill(); } c.fillStyle = '#2a7aa8'; c.fillRect(-1.5, -6, 3, 16); c.restore(); }
    // the big lily pad the inequality is written on
    c.save(); c.translate(180, Y - 16); c.fillStyle = 'rgba(20,40,40,0.25)'; c.beginPath(); c.ellipse(4, 10, 166, 62, 0, 0, 7); c.fill();
    const pg = c.createRadialGradient(-40, -20, 10, 0, 0, 170); pg.addColorStop(0, '#b8e08a'); pg.addColorStop(1, '#6aa84a'); c.fillStyle = pg; c.beginPath(); c.moveTo(0, 0); c.ellipse(0, 0, 164, 60, 0, Math.PI * 0.27, Math.PI * 2.21); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(40,80,30,0.22)'; c.lineWidth = 2; for (let i = 0; i < 10; i++) { const an = Math.PI * 0.34 + i * Math.PI * 0.18; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(an) * 150, Math.sin(an) * 54); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,0.18)'; c.beginPath(); c.ellipse(-60, -26, 60, 14, -0.1, 0, 7); c.fill(); c.restore();
    // a pink water lily at the pad's edge
    { const fx = 318, fy = Y + 30; for (let i = 0; i < 7; i++) { const an = -Math.PI / 2 + (i - 3) * 0.42; c.fillStyle = i % 2 ? '#f6a8c8' : '#ffc8dc'; c.beginPath(); c.ellipse(fx + Math.cos(an) * 9, fy + Math.sin(an) * 7, 9, 4, an, 0, 7); c.fill(); } c.fillStyle = '#ffd84a'; c.beginPath(); c.arc(fx, fy - 2, 4, 0, 7); c.fill(); }
    M.drawEx(g, c, 'ex');
    // the relation sign, drawn by hand so it can spin
    const rn = S.relN, rb = M.box(g, 'rel');
    if (rb) { let sx = 1, col = INK, lift = 0; if (S.spin) { const k = M.clamp((t - S.spin.t0) / S.spin.dur, 0, 1); sx = Math.cos(M.easeIO(k) * Math.PI); lift = Math.sin(k * Math.PI) * 16; col = '#c8401a'; }
      const pk = S.relPop != null ? 1 + Math.sin(M.clamp((t - S.relPop) / 0.35, 0, 1) * Math.PI) * 0.35 : 1; if (S.relPop != null && t - S.relPop < 0.6) col = '#c8401a';
      c.save(); c.translate(rb.x + (rn._ax || 0), rb.y + 0.275 * ES - lift - ES * 0.34); c.scale(pk * (rn.sc ?? 1), pk * (rn.sc ?? 1)); if (rn.hl > 0.01) { c.shadowColor = '#ffb21f'; c.shadowBlur = 16 * rn.hl; }
      relSign(c, 0, ES * 0.34, ES, S.rel, sx, rn.mark === 'good' ? M.GOOD : col); c.restore(); }
    // the floating log: the number line
    const x0 = 22, x1 = 338;
    c.fillStyle = 'rgba(20,40,50,0.3)'; c.beginPath(); c.ellipse(180, LY + 16, 172, 10, 0, 0, 7); c.fill();
    const lg = c.createLinearGradient(0, LY - 14, 0, LY + 14); lg.addColorStop(0, '#b8885a'); lg.addColorStop(0.5, '#8a5a34'); lg.addColorStop(1, '#5a3a1e'); c.fillStyle = lg; c.beginPath(); c.roundRect(x0 - 6, LY - 13, x1 - x0 + 12, 26, 13); c.fill();
    c.fillStyle = '#d8b080'; c.beginPath(); c.ellipse(x1 + 4, LY, 6, 12, 0, 0, 7); c.fill(); c.strokeStyle = '#8a5a34'; c.lineWidth = 1; c.beginPath(); c.ellipse(x1 + 4, LY, 3, 6, 0, 0, 7); c.stroke();
    // the solution's ray (gold along the log) and the pads it lights
    const ray = S.ray, rk = ray ? M.easeIO(M.clamp((t - ray.t0) / ray.dur, 0, 1)) : 0, end = ray ? (ray.dir > 0 ? x1 - 6 : x0 + 6) : 0;
    for (let v = S.b - 5; v <= S.b + 5; v++) { const x = X(v), inSol = ray && (ray.dir > 0 ? v > S.b : v < S.b) && Math.abs(x - X(S.b)) <= Math.abs(end - X(S.b)) * rk;
      pad(c, x, LY + 34, 12, Math.PI * 0.5 + v, '#5a9a4a', inSol ? 1 : 0); }
    if (ray && rk > 0) { const xa = X(S.b), xb = M.lerp(xa, end, rk); c.save(); c.strokeStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 12; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(xa, LY); c.lineTo(xb, LY); c.stroke();
      if (rk > 0.9) { c.fillStyle = GOLD; c.beginPath(); c.moveTo(xb + ray.dir * 12, LY); c.lineTo(xb - ray.dir * 2, LY - 10); c.lineTo(xb - ray.dir * 2, LY + 10); c.closePath(); c.fill(); } c.restore(); }
    c.strokeStyle = '#3a200e'; c.lineWidth = 2; c.textAlign = 'center';
    for (let v = S.b - 5; v <= S.b + 5; v++) { const x = X(v); c.beginPath(); c.moveTo(x, LY - 8); c.lineTo(x, LY + 8); c.stroke(); }
    // the numbers above the log: bold, with a dark shadow so they read against the water
    c.save(); c.font = M.NUMF(18, 700); c.shadowColor = 'rgba(20,30,50,0.85)'; c.shadowBlur = 4; c.shadowOffsetY = 1.5; c.fillStyle = '#fff6e0'; c.lineWidth = 3; c.strokeStyle = 'rgba(30,40,60,0.55)'; c.lineJoin = 'round';
    for (let v = S.b - 5; v <= S.b + 5; v++) { const x = X(v), s = String(v).replace('-', '−'); c.strokeText(s, x, LY - 19); c.fillText(s, x, LY - 19); } c.restore();
    // the ring at the answer: open for < and >, filled for ≤ and ≥
    if (S.dot) { const k = M.clamp((t - S.dot.t0) / 0.2, 0, 1), y = LY - (1 - M.ease(k)) * 30, x = X(S.b); c.save(); c.lineWidth = 4; c.strokeStyle = '#c8401a'; c.fillStyle = S.dot.open ? '#fff6e6' : '#c8401a'; c.shadowColor = GOLD; c.shadowBlur = 10;
      c.beginPath(); c.arc(x, y, 9, 0, 7); c.fill(); c.stroke(); c.restore(); }
    M.drawEx(g, c, 'note');
    // the frog on the bank; it hops onto the log at the win
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'frog', HX, HY - hopK * 22, 1.3, { t, pose, expr, facing: 1 }); else SCN.host(g, c, 'frog', HX, HY, 1.3);
    M.drawUI(g, c);
  },
});
