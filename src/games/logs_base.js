// logs_base.js — CHANGE OF BASE! logₐ N = log_b N / log_b a, with b = 2 or 3 so both are easy powers.
// The problem is chalked on an ice slab at a snowy dawn; a penguin holds the base-2 (or base-3) converter, an ice cube
// marked log₂. Moves:
//   1. Drag the converter onto the log (or the log onto the converter): a working line "= log₂ 64 / log₂ 4" builds
//      itself under the problem: the fraction bar draws, 64 and the small 4 fly down into top and bottom, and two copies
//      of the converter fly in and stamp "log₂" on each.
//   2. Tap the top (and 3. the bottom, either order): 64 rewrites itself as 2⁶ with a pen, log₂ and the 2 light up
//      together and fade (log₂ undoes "2 to the power"), and the exponent 6 glides down to stand alone: log₂ 64 = 6.
//   4. Tap the fraction: "6 ÷ 2 = 3" writes itself under it, the 3 flies into the working line and then up into the ?.
//      At level 2 the answer is a fraction (log₄ 8 = 3/2), which glides up into the ? as it is.
// Wrong moves (they only wobble): tapping 64 or the ? before converting, tapping the fraction before top and bottom are
// worked out. Level 0: answers 2 or 3. Level 1: bigger powers. Level 2: fraction answers.
// Medium mode: each log and the quotient are picked from the tray.
const M = MK, INK = '#1d3358', CONV = '#1f86c8', RES = '#d0406a', NOTE = '#3a5a8a', HX = 280, HY = 594, TOPY = 262, WORKY = 352, NOTEY = 412, SUB = 0.62;
const TX = 92, TY = 486; // the converter cube
function pick(g) {
  const L = g.level, R = a => a[Math.floor(g.rand() * a.length)];
  const [a, N, b] = R(L === 0 ? [[4, 16, 2], [8, 64, 2], [9, 81, 3], [4, 64, 2]] : L === 1 ? [[4, 64, 2], [8, 512, 2], [4, 256, 2], [9, 729, 3], [16, 256, 2], [27, 729, 3]] : [[4, 8, 2], [8, 16, 2], [9, 27, 3], [8, 32, 2]]);
  const lg = v => Math.round(Math.log(v) / Math.log(b)), kN = lg(N), ka = lg(a);
  return { a, N, b, kN, ka, whole: kN % ka === 0 };
}
// log with a small base: the kit has no subscript, so the base is an exponent pushed down (dy is in px at size fs)
const logb = (b, fs, id, o = {}) => M.sup(M.txt('log', null, o), M.num(b, null, { ...o, dy: fs * SUB }), id);
const leaves = (n, out = []) => { if (!n) return out; if (/^(num|var|txt|op)$/.test(n.k)) out.push(n); for (const ch of [n.base, n.exp, n.n, n.d, n.inner, n.fill, ...(n.items || [])]) leaves(ch, out); return out; };
const hop = (g, e) => { g.s.mk.lastMove = g.t; g.s.face = e || 'wow'; g.s.faceT = g.t; };

MG.add({
  id: 'logs_base', stage: 'logs', cmd: 'CHANGE BASE!', hint: 'drag', time: 9, mood: 'bright', winText: 'Rebased!', hold: 1.6,
  card: {
    title: 'Change of base', ref: 'Algebra 2', kind: 'Algebra',
    text: 'log₄ 64 asks: 4 to what power makes 64? If you can\'t see it at once, ask the question in a base you know better. The change of base rule says log₄ 64 = log₂ 64 ÷ log₂ 4. Both logs use the same new base, 2.\n\nBase 2 is easy here. 64 = 2⁶, so log₂ 64 = 6. And 4 = 2², so log₂ 4 = 2. So log₄ 64 = 6 ÷ 2 = 3. Check: 4³ = 64.\n\nWhy does it work? Each 4 is two 2s, so you need half as many 4s as 2s to make 64. The answer can also be a fraction: log₄ 8 = 3 ÷ 2 = 3/2.',
    note: 'logₐ N = (log N) ÷ (log a), with the same base on top and bottom. Pick a base in which both numbers are easy powers.',
    ask: 'What is log₈ 64? What is log₉ 27?',
  },

  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { a, N, b, kN, ka, whole } = S, T = M.pace(g), TS = 48, WS = 48, FS = WS * 0.82;
    // the problem: logₐ N = ?
    S.Nn = M.num(N, 'N'); S.ab = M.num(a, 'ab', { dy: TS * SUB }); S.q = M.slot('q', { col: RES });
    S.L = M.row(M.sup(M.txt('log', 'lg'), S.ab), M.gap(8), S.Nn); S.L.id = 'L';
    S.top = M.row(S.L, M.op('=', 'eq'), S.q);
    M.place(g, 'top', S.top, 180, TOPY, TS, { col: INK });
    // the converter the penguin holds
    M.place(g, 'tool', logb(b, 34, 'conv', { col: CONV }), TX, TY + 10, 34, { col: CONV });
    M.inert(g, ['lg', 'ab', 'eq', 'eq2', 'tl', 'bl', 'tb', 'bb', 'tk', 'bk', 'tn', 'bn', 'res']);
    const relay = () => M.place(g, 'work', S.work, 180, WORKY, WS, { col: INK });
    g.dur *= (2.6 + 1.05 * 4) / 8;

    // 1. convert: "= log₂ N / log₂ a" builds itself under the problem
    const convert = g => { S.conv = true; M.show(g, 1.35 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh');
      M.circle(g, 'L', { col: CONV, dur: 0.55 * T });
      const o = { col: CONV, alpha: 0 };
      S.tl = logb(b, FS, 'tl', o); S.bl = logb(b, FS, 'bl', o);
      S.tn = M.num(N, 'tn', { alpha: 0 }); S.bn = M.num(a, 'bn', { alpha: 0 });
      S.tp = M.row(S.tl, M.gap(6), S.tn); S.tp.id = 'tp'; S.bt = M.row(S.bl, M.gap(6), S.bn); S.bt.id = 'bt';
      S.fr = M.frac(S.tp, S.bt, 'fr', { bar: { t0: g.t + 0.1 * T, dur: 0.35 * T } }); S.eq2 = M.op('=', 'eq2');
      S.work = M.row(S.eq2, M.gap(6), S.fr); relay();
      const land = (n, id) => g => { n.alpha = 1; n.pop = g.t; M.sparkle(g, id, { n: 6, cols: ['#fff', '#bfe6ff'] }); g.sfx('pop'); hop(g); };
      M.fly(g, { node: M.num(N), from: 'N', to: 'tn', delay: 0.2 * T, dur: 0.38 * T, arc: 30, s1: FS, col: INK, then: land(S.tn, 'tn') });
      const ab = M.box(g, 'ab');
      M.fly(g, { node: M.num(a), from: [ab.x, ab.y + TS * SUB], to: 'bn', delay: 0.38 * T, dur: 0.42 * T, arc: 20, s0: TS * 0.62, s1: FS, col: INK, then: land(S.bn, 'bn') });
      // two copies of the converter fly from the cube and stamp log₂ on the top and the bottom
      for (const [n, id, d] of [[S.tl, 'tl', 0.72], [S.bl, 'bl', 0.88]]) M.fly(g, { node: logb(b, 30, null, { col: CONV }), from: 'conv', to: id, delay: d * T, dur: 0.38 * T, arc: -50, s0: 34, s1: FS, col: CONV,
        then(g) { for (const l of leaves(n)) l.alpha = 1; n.pop = g.t; M.sparkle(g, id, { n: 8, cols: [CONV, '#fff'] }); g.sfx('tap'); hop(g); } });
      M.at(g, [[1.35 * T, g => { S.point = false; }]]);
    };
    // 2/3. log₂ N: N rewrites itself as 2^k, log₂ and the 2 cancel, and k glides down to stand alone
    const evalMove = (side) => { const top = side === 't', k = top ? kN : ka, v = top ? N : a, row = top ? 'tp' : 'bt';
      const wrong = [v / b, k + 1, k - 1, b * k].filter(w => Number.isInteger(w) && w > 0 && w !== k);
      return { tap: row, busy: 0.1, askAt: 0.45 * T, after: 1.3 * T, ask: { v: k, wrong },
        then(g) { S[side + 'Go'] = true; M.show(g, 0.45 * T); S.point = true; hop(g, 'think');
          M.circle(g, row, { col: CONV, dur: 0.5 * T }); M.light(g, top ? S.tn : S.bn, { col: RES }); },
        resolve(g) { M.show(g, 1.3 * T); const R = top ? S.tp : S.bt, lg = top ? S.tl : S.bl, old = top ? S.tn : S.bn;
          // v = b^k, written in place
          const base = M.num(b, side + 'b', { col: CONV }), kn = M.num(k, side + 'k', { col: RES }), pw = M.sup(base, kn);
          R.items[2] = pw; relay(); M.writeIn(g, pw, { dur: 0.32 * T }); g.sfx('tap');
          M.at(g, [
            [0.42 * T, g => { M.circle(g, [side + 'l', side + 'b'], { col: CONV, dur: 0.5 * T }); M.indicate(g, lg, { col: CONV, sc: 1.15, dur: 0.4 * T }); M.indicate(g, base, { col: CONV, sc: 1.25, dur: 0.4 * T }); M.indicate(g, kn, { col: RES, sc: 1.4, dur: 0.45 * T, delay: 0.1 * T }); }],
            [0.85 * T, g => { for (const l of [...leaves(lg), base]) M.tween(g, l, { alpha: 0 }, 0.22 * T); g.sfx('swoosh'); }],
            [1.08 * T, g => { // the exponent glides down and becomes the whole top (or bottom)
              kn.id = side + 'v'; kn.pop = g.t; if (top) S.fr.n = kn; else S.fr.d = kn; relay(); M.sparkle(g, kn.id, { n: 10, cols: [RES, '#fff', '#ffd0dc'] }); g.sfx('ding'); hop(g); S[side + 'Done'] = true; S.point = false; }],
          ]); } }; };
    // 4. the quotient
    const answerNode = () => S.whole ? M.num(kN / ka) : M.frac(M.num(kN), M.num(ka));
    const divMove = { tap: 'fr', busy: 0.1, askAt: 0.45 * T, after: whole ? 1.45 * T : 1.0 * T,
      ask: whole ? { v: kN / ka, wrong: [kN - ka, kN * ka, kN + ka] } : { v: M.frac(M.num(kN), M.num(ka)), wrong: [M.frac(M.num(ka), M.num(kN)), M.num(kN - ka), M.num(kN * ka)] },
      then(g) { S.divGo = true; M.show(g, 0.45 * T); S.point = true; hop(g, 'think');
        M.circle(g, 'fr', { col: RES, dur: 0.5 * T }); M.light(g, S.fr.n, { col: RES }); M.light(g, S.fr.d, { col: RES }); },
      resolve(g) { M.show(g, whole ? 1.45 * T : 1.0 * T);
        const toSlot = (from, d) => M.fly(g, { node: answerNode(), from, to: 'q', delay: d, dur: 0.42 * T, arc: -40, s0: WS, s1: TS, col: RES,
          then(g) { const an = Object.assign(answerNode(), { id: 'q', pop: g.t }); for (const l of leaves(an)) l.col = RES; S.top.items[2] = an; M.place(g, 'top', S.top, 180, TOPY, 48, { col: INK }); M.sparkle(g, 'q', { n: 16, cols: [RES, '#fff', '#ffe08a'] }); g.sfx('coin'); hop(g, 'laugh'); S.point = false; S.won = true; for (const l of leaves(S.work)) M.tween(g, l, { alpha: 0 }, 0.3 * T); } });
        if (whole) {
          const qv = M.num(kN / ka, 'nq', { alpha: 0, col: RES });
          S.note = M.row(M.num(kN), M.op('÷'), M.num(ka), M.op('='), qv); M.place(g, 'note', S.note, 180, NOTEY, 30, { col: NOTE }); M.writeIn(g, S.note, { dur: 0.42 * T });
          M.at(g, [
            [0.45 * T, g => { qv.alpha = 1; M.writeIn(g, qv, { dur: 0.18 * T }); M.indicate(g, qv, { delay: 0.15 * T, dur: 0.3 * T, col: RES }); g.sfx('ding'); }],
            [0.8 * T, g => { const from = { ...M.box(g, 'nq') }; M.tween(g, S.note, { alpha: 0 }, 0.3 * T); S.res = M.num(kN / ka, 'res', { alpha: 0, col: RES });
              S.work.items[2] = S.res; for (const l of leaves(S.fr)) l.alpha = 0; relay();
              M.fly(g, { node: M.num(kN / ka), from: [from.x, from.y], to: 'res', dur: 0.3 * T, arc: 16, s0: 30, s1: WS, col: RES, then(g) { S.res.alpha = 1; S.res.pop = g.t; g.sfx('pop'); } }); }],
            [1.0 * T, g => toSlot('res', 0)],
            [1.4 * T, g => { delete g.s.mk.ex.note; }],
          ]);
        } else { M.indicate(g, S.fr, { col: RES, sc: 1.12, dur: 0.4 * T }); g.sfx('ding'); M.at(g, [[0.45 * T, g => toSlot('fr', 0)]]); }
      } };
    M.play(g, {
      moves(g) {
        if (!S.conv) return [{ drag: 'conv', to: ['N', 'L'], area: [8, 190, 352, 296], busy: 0.1, then: convert }, { drag: 'N', to: 'conv', busy: 0.1, then: convert }];
        const out = [];
        if (!S.tGo) out.push(evalMove('t'));
        if (!S.bGo) out.push(evalMove('b'));
        if (S.tDone && S.bDone && !S.divGo) out.push(divMove);
        return out;
      },
      area(g) { return !S.conv ? ['conv', 'L'] : !S.tGo ? 'tp' : !S.bGo ? 'bt' : 'fr'; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('lb_snow', (cc, W, H) => paintBg(cc, W, H)), 0, 0, 360, 640);
    ambient(c, t);
    slab(c, t);
    // the penguin holds out the converter cube on its pedestal and points at the slab while the work is shown
    const mk = S.mk, hk = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missed = mk.missAt > 0 && t - mk.missAt < 0.7;
    const expr = won ? 'laugh' : lost ? 'sad' : missed ? 'think' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    cube(c, g, t);
    if (typeof ANI !== 'undefined') ANI.draw(c, 'penguin', HX, HY - hk * 22, 1.45, { t, pose, expr, facing: -1 }); else SCN.host(g, c, 'penguin', HX, HY, 1.45);
    M.drawEx(g, c, 'tool'); M.drawEx(g, c, 'top'); M.drawEx(g, c, 'work'); M.drawEx(g, c, 'note');
    M.drawUI(g, c);
  },
});

// ---------------- the scene: a snowfield at dawn ----------------
function paintBg(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 420); sk.addColorStop(0, '#5a6ab8'); sk.addColorStop(0.42, '#c89ac8'); sk.addColorStop(0.75, '#ffc8a8'); sk.addColorStop(1, '#ffe8c8'); c.fillStyle = sk; c.fillRect(0, 0, W, H);
  // the low sun just rising behind the far peaks
  const sg = c.createRadialGradient(250, 420, 6, 250, 420, 220); sg.addColorStop(0, 'rgba(255,240,200,0.95)'); sg.addColorStop(0.2, 'rgba(255,214,170,0.5)'); sg.addColorStop(1, 'rgba(255,214,170,0)'); c.fillStyle = sg; c.fillRect(0, 160, W, 340);
  // far mountains with snowy tops
  const peaks = (y0, pts, col, snow) => { c.fillStyle = col; c.beginPath(); c.moveTo(0, H); c.lineTo(0, y0); for (const [x, y] of pts) c.lineTo(x, y); c.lineTo(W, y0); c.lineTo(W, H); c.fill();
    if (snow) { c.fillStyle = snow; for (let i = 0; i < pts.length; i++) { const [x, y] = pts[i]; if (y > y0 - 30) continue; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 16, y + 20); c.lineTo(x - 6, y + 16); c.lineTo(x + 2, y + 24); c.lineTo(x + 9, y + 15); c.lineTo(x + 17, y + 21); c.closePath(); c.fill(); } } };
  peaks(440, [[30, 400], [80, 352], [120, 392], [170, 336], [215, 386], [260, 360], [300, 396], [340, 350]], '#8a86b8', '#f6f0fa');
  peaks(470, [[20, 452], [60, 420], [110, 456], [150, 430], [200, 462], [250, 424], [300, 458], [345, 432]], '#a4a6cc', '#fbf8ff');
  // snow ground with soft blue shadows
  const gr = c.createLinearGradient(0, 470, 0, H); gr.addColorStop(0, '#f4f2fa'); gr.addColorStop(1, '#d4dcf0'); c.fillStyle = gr;
  c.beginPath(); c.moveTo(0, 488); c.quadraticCurveTo(90, 466, 180, 482); c.quadraticCurveTo(270, 498, 360, 476); c.lineTo(360, H); c.lineTo(0, H); c.fill();
  c.fillStyle = 'rgba(150,160,210,0.25)'; for (let i = 0; i < 7; i++) { c.beginPath(); c.ellipse(30 + i * 55, 540 + (i % 3) * 30, 40, 7, 0, 0, 7); c.fill(); }
  // snowy pines on both edges
  const pine = (x, y, s) => { c.fillStyle = '#4a5a7a'; c.fillRect(x - 3 * s, y - 8 * s, 6 * s, 10 * s);
    for (let k = 0; k < 4; k++) { const yy = y - 8 * s - k * 16 * s, w = (26 - k * 5) * s; c.fillStyle = '#3e6a6a'; c.beginPath(); c.moveTo(x - w, yy); c.lineTo(x, yy - 24 * s); c.lineTo(x + w, yy); c.fill();
      c.fillStyle = '#fbfaff'; c.beginPath(); c.moveTo(x - w * 0.8, yy - 4 * s); c.quadraticCurveTo(x, yy - 12 * s, x + w * 0.8, yy - 4 * s); c.lineTo(x + w * 0.4, yy - 14 * s); c.lineTo(x, yy - 24 * s); c.lineTo(x - w * 0.4, yy - 14 * s); c.fill(); } };
  pine(22, 520, 1.0); pine(338, 506, 0.85); pine(352, 560, 1.1); pine(8, 600, 1.2);
  // the pedestal the converter sits on
  c.fillStyle = 'rgba(120,130,190,0.3)'; c.beginPath(); c.ellipse(TX, TY + 52, 46, 9, 0, 0, 7); c.fill();
  const pd = c.createLinearGradient(TX - 34, 0, TX + 34, 0); pd.addColorStop(0, '#dff0fb'); pd.addColorStop(1, '#a8c8e8'); c.fillStyle = pd; c.beginPath(); c.roundRect(TX - 32, TY + 30, 64, 22, 6); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.7)'; c.fillRect(TX - 28, TY + 32, 56, 3);
}
// falling snow and glints on the ice
function ambient(c, t) {
  c.save(); c.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 34; i++) { const sp = 14 + (i % 5) * 6, x = ((i * 67 + Math.sin(t * 0.8 + i) * 18) % 380 + 380) % 380 - 10, y = ((i * 97 + t * sp) % 700) - 30, r = 1 + (i % 3) * 0.7;
    c.globalAlpha = 0.5 + (i % 4) * 0.12; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  c.restore();
}
// the ice slab the problem is written on
function slab(c, t) {
  const x = 14, y = 190, w = 332, h = 246; c.save();
  c.fillStyle = 'rgba(60,70,130,0.25)'; c.beginPath(); c.roundRect(x + 4, y + 8, w, h, 18); c.fill();
  const gr = c.createLinearGradient(x, y, x + w * 0.4, y + h); gr.addColorStop(0, '#f4fbff'); gr.addColorStop(0.55, '#dcefff'); gr.addColorStop(1, '#bcdaf4'); c.fillStyle = gr; c.beginPath(); c.roundRect(x, y, w, h, 18); c.fill();
  c.strokeStyle = 'rgba(255,255,255,0.95)'; c.lineWidth = 3; c.stroke();
  c.strokeStyle = 'rgba(120,170,220,0.45)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x + 40, y + h - 10); c.lineTo(x + 70, y + h - 40); c.lineTo(x + 64, y + h - 60); c.moveTo(x + w - 30, y + 14); c.lineTo(x + w - 52, y + 44); c.stroke();
  // a slow glint sweeping across the ice
  const gx = x + ((t * 60) % (w + 200)) - 100; c.beginPath(); c.roundRect(x, y, w, h, 18); c.clip();
  const sh = c.createLinearGradient(gx - 40, 0, gx + 40, 0); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(0.5, 'rgba(255,255,255,0.45)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = sh; c.translate(gx, y + h / 2); c.rotate(0.35); c.fillRect(-40, -h, 80, h * 2); c.restore();
}
// the converter: a clear ice cube with the base inside
function cube(c, g, t) {
  const b = M.box(g, 'conv'); if (!b) return; const P = g.s.mk.press, lift = P && P.id === 'conv' && P.dragging ? 0.4 : 1, bob = Math.sin(t * 2.2) * 2;
  const w = Math.max(76, b.w + 26), h = 58, x = b.x - w / 2, y = TY - 20 + bob; c.save(); c.globalAlpha = lift;
  c.shadowColor = 'rgba(31,134,200,0.6)'; c.shadowBlur = 14 + 6 * Math.sin(t * 3);
  const gr = c.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, '#eefaff'); gr.addColorStop(1, '#a6d4f2'); c.fillStyle = gr; c.beginPath(); c.roundRect(x, y, w, h, 10); c.fill();
  c.shadowBlur = 0; c.strokeStyle = '#ffffff'; c.lineWidth = 2.5; c.stroke(); c.fillStyle = 'rgba(255,255,255,0.75)'; c.beginPath(); c.roundRect(x + 6, y + 5, w - 12, 8, 4); c.fill();
  c.restore();
}
