// modular_binary.js — BINARY! Write a number in base 2 by switching on glowing jellyfish worth 8, 4, 2 and 1.
// Deep under the sea a row of jellyfish floats under a glass slate reading "13 = ?". Each jellyfish carries a place value
// (16,) 8, 4, 2, 1. The player taps a jellyfish whose value is part of the number, and the working is acted out (show
// your work): the 13 drops down from the slate into the working line, the jelly's 8 lifts off and flies in as "13 − 8",
// "= 5" writes itself, the jelly lights up and a 1 writes itself under it, and the line collapses to the 5 that is left.
// A jelly worth more than what is left can never be used: a "1 < 2" note writes itself over it, it shakes its bell and
// a 0 writes itself under it. When nothing is left, the digits under the jellies light up left to right and fly up into
// the slate: 13 = 1101₂. Any order of the needed jellies works; the glow shows the biggest first.
// Level 0: 4 jellies, 2 or 3 of them on. Level 1: 4 jellies, 3 or 4 on. Level 2: 5 jellies (16 to 1).
// Medium mode: each subtraction ("13 − 8 = ?") is picked from the tray.
// Wrong parts: a jelly worth more than what is left, or one that is not in the number (5 − 2 leaves 3, which needs a
// second 2), and the 13 on the slate.
const M = MK, PY = 228, WY = 292, BY = 354, DY = 452, INK = '#23264a', LITE = '#fff2a8', WINK = '#eaf6ff', GOLD = '#ffd45a', HX = 66, HY = 606;
const POOL = [[9, 10, 12, 13, 11, 14], [11, 13, 14, 15], [19, 21, 22, 25, 26, 28, 23, 27]];
const bits = (n, k) => [...Array(k)].map((_, i) => (n >> (k - 1 - i)) & 1);

MG.add({
  id: 'modular_binary', stage: 'modular', cmd: 'BINARY!', hint: 'tap', time: 9, mood: 'sea', winText: 'Base two!', hold: 1.7,
  card: {
    title: 'Binary numbers', ref: 'Grade 6 and up', kind: 'Number theory',
    text: 'We usually write numbers in base 10: each place is worth ten times the place to its right (1, 10, 100, ...). Computers use base 2, called binary. Each place is worth twice the place to its right: 1, 2, 4, 8, 16, ... and each digit is 0 or 1, like a light that is off or on.\n\nTo write 13 in binary, start with the biggest place that fits. 8 fits in 13, so its digit is 1, and 13 − 8 = 5 is left. 4 fits in 5: digit 1, and 1 is left. 2 does not fit in 1: digit 0. 1 fits: digit 1, and nothing is left.\n\nSo 13 = 1101 in base 2, written 1101₂. Check it: 8 + 4 + 0 + 1 = 13.',
    note: 'Go from the biggest place value down. If it fits in what is left, write 1 and take it away; if not, write 0.',
    ask: 'What is 10 in binary? What number is 111₂?',
  },

  init(g) {
    const S = g.s; M.setup(g); const pool = POOL[g.level], T = M.pace(g);
    S.n = pool[Math.floor(g.rand() * pool.length)]; S.k = g.level === 2 ? 5 : 4; S.b = bits(S.n, S.k);
    S.val = [...Array(S.k)].map((_, i) => 1 << (S.k - 1 - i)); S.left = S.n;
    const sp = S.k === 5 ? 64 : 76; S.x = S.val.map((_, i) => 180 + (i - (S.k - 1) / 2) * sp);
    S.st = S.val.map(() => ({ on: null, no: null, digit: null, tap: -9, used: false })); // on: g.t lit, no: g.t marked 0
    S.nn = M.num(S.n, 'n'); S.ans = M.slot('ans', { w: 30 + 26 * S.k, col: '#5a6aa0' });
    S.top = M.row(S.nn, M.op('=', 'eq'), S.ans);
    S.placeTop = () => M.place(g, 'top', S.top, 180, PY, 44, { col: INK }); S.placeTop();
    S.work = M.row(); S.placeWork = () => M.place(g, 'work', S.work, 180, WY, 38, { col: INK }); S.placeWork();
    S.val.forEach((v, i) => M.zone(g, 'b' + i, { x: S.x[i], y: BY - 6, w: 54, h: 70 }));
    M.inert(g, ['eq', 'ans', 'wl', 'wo', 'ws', 'we', 'wr', 'wr2', 'bits', 'two', ...S.val.map((v, i) => 'f' + i)]);
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    g.dur *= (2.6 + 1.05 * (S.b.filter(Boolean).length + 1)) / 8;

    // the digit under jelly i writes itself in
    const digit = (g, i, d) => { const nd = M.num(d, 'd' + i, { col: d ? LITE : '#8aa0c8' }); S.st[i].digit = d; M.place(g, 'd' + i, nd, S.x[i], DY, 40, { col: WINK }); M.writeIn(g, nd, { dur: 0.25 * T }); M.inert(g, ['d' + i]); if (d) M.sparkle(g, 'd' + i, { delay: 0.2 * T, n: 8, cols: [LITE, '#fff', '#8ae0ff'] }); };
    // jellies worth more than what is left can never be used: "1 < 2", a shake, and a 0
    const zeros = (g, t0) => { const list = S.val.map((v, i) => i).filter(i => !S.st[i].used && S.st[i].no == null && S.val[i] > S.left);
      list.forEach((i, k) => { S.st[i].no = 1e9; M.at(g, [[t0 + k * 0.42 * T, g => { S.st[i].no = g.t; g.sfx('boing', { vol: 0.4 });
        if (S.left > 0) M.note(g, { node: M.row(M.num(S.left), M.op('<'), M.num(S.val[i])), at: 'b' + i, off: [0, 62], s: 24, col: '#c8e0ff', write: 0.18 * T, hold: 0.22 * T, fade: 0.2 * T });
        M.at(g, [[0.16 * T, g => digit(g, i, 0)]]); }]]); });
      return list.length * 0.42 * T; };
    // the finale: the digits light up left to right and fly up into the slate as 1101₂
    const finale = (g, t0) => { M.at(g, [[t0, g => {
      M.tween(g, S.work, { alpha: 0 }, 0.25 * T); S.point = true; hop(g, 'wow');
      const ds = S.b.map((d, i) => M.num(d, 'f' + i, { alpha: 0 })); S.bitsRow = M.row(ds); S.bitsRow.id = 'bits';
      S.ans.fill = M.sup(S.bitsRow, M.num(2, 'two', { dy: 27, alpha: 0 })); S.placeTop();
      S.b.forEach((d, i) => { M.indicate(g, 'd' + i, { delay: i * 0.1 * T, dur: 0.3 * T, col: GOLD, sc: 1.35 });
        M.fly(g, { node: M.num(d, null, { col: d ? LITE : '#c8d8f0' }), from: 'd' + i, to: 'f' + i, delay: (0.1 + i * 0.1) * T, dur: 0.42 * T, arc: -30, s0: 40, s1: 44,
          then(g) { ds[i].alpha = 1; ds[i].pop = g.t; g.sfx('pop', { p: 1 + i * 0.08 }); } }); });
      const tl = (0.1 + (S.k - 1) * 0.1 + 0.42) * T;
      M.at(g, [[tl, g => { const two = M.node(g, 'two'); two.alpha = 1; two.pop = g.t; M.sparkle(g, 'bits', { n: 16, cols: [GOLD, '#fff', '#8ae0ff'] }); g.sfx('ding'); hop(g, 'laugh'); delete g.s.mk.ex.work; S.point = false; }]]);
    }]]); return 0.95 * T; };

    M.play(g, {
      moves(g) {
        if (S.left === 0) return [];
        // every jelly that is part of the number and not lit yet; the biggest first, so the glow follows the method
        return S.val.map((v, i) => i).filter(i => S.b[i] && !S.st[i].used && S.st[i].tap < 0 && S.val[i] <= S.left).map(i => {
          const v = S.val[i], r = S.left, first = !S.work.items.length, a0 = first ? 0.3 * T : 0, askAt = a0 + 0.62 * T;
          return { tap: 'b' + i, busy: 0.1, askAt, ask: { v: r - v, wrong: [r + v, r - v + 1, v, Math.abs(r - 2 * v)] },
            get after() { return S.afterLen || 1; },
            then(g) { S.st[i].tap = g.t; S.cur = i; M.show(g, askAt); S.point = true; hop(g, 'think'); M.inert(g, ['b' + i]);
              M.circle(g, 'b' + i, { dur: 0.5 * T, col: GOLD, pad: 4 });
              S.wl = first ? M.num(r, 'wl', { alpha: 0 }) : S.work.items[0]; S.wo = M.op('-', 'wo', { alpha: 0 }); S.ws = M.num(v, 'ws', { alpha: 0, col: '#b07a00' });
              S.we = M.op('=', 'we', { alpha: 0 }); S.wr = M.slot('wr', { w: 34, col: '#5a6aa0', alpha: 0 });
              S.work.items = [S.wl, S.wo, S.ws, S.we, S.wr]; S.placeWork();
              if (first) { M.indicate(g, 'n', { dur: 0.35 * T, col: GOLD, sc: 1.2 });
                M.fly(g, { node: M.num(r), from: 'n', to: 'wl', dur: 0.32 * T, arc: 10, s0: 44, s1: 38, col: INK, then(g) { S.wl.alpha = 1; S.wl.pop = g.t; } }); }
              else M.indicate(g, S.wl, { dur: 0.35 * T, col: GOLD, sc: 1.2 });
              // the jelly's place value lifts off its bell and flies in as "− 8"
              M.at(g, [[a0, g => { S.wo.alpha = 1; S.wo._born = g.t; g.sfx('swoosh');
                M.fly(g, { node: M.num(v, null, { col: '#b07a00' }), from: [S.x[i], BY - 8], to: 'ws', dur: 0.34 * T, arc: -50, s0: 26, s1: 38, then(g) { S.ws.alpha = 1; S.ws.pop = g.t; g.sfx('pop'); } }); }],
                [a0 + 0.38 * T, g => { S.we.alpha = 1; S.wr.alpha = 1; M.writeIn(g, S.we, { dur: 0.15 * T }); M.writeIn(g, S.wr, { dur: 0.2 * T, delay: 0.08 * T }); }]]);
            },
            resolve(g) {
              const nr = r - v; S.left = nr; S.st[i].used = true;
              const res = M.num(nr, 'wr2', { col: '#1a7a4a' }); S.wr.fill = res; S.placeWork(); M.writeIn(g, res, { dur: 0.2 * T }); M.indicate(g, res, { delay: 0.15 * T, dur: 0.3 * T, sc: 1.3 }); g.sfx('ding');
              // the jelly lights up and a 1 writes itself under it
              M.at(g, [[0.12 * T, g => { S.st[i].on = g.t; g.sfx('chime', { vol: 0.5 }); hop(g, 'happy'); const p = { x: S.x[i], y: BY - 10 }; g.burst(p.x, p.y, [LITE, '#fff', '#8ae0ff'], 12, 120); }],
                [0.3 * T, g => digit(g, i, 1)],
                // the line collapses to what is left
                [0.5 * T, g => { for (const q of [S.wl, S.wo, S.ws, S.we]) M.tween(g, q, { alpha: 0 }, 0.22 * T); }],
                // the result's own node is reused, so it glides to the middle of the line
                [0.76 * T, g => { res.id = 'wl'; res.col = INK; S.work.items = [res]; S.placeWork(); }]]);
              let t = 0.86 * T; t += zeros(g, t);
              if (nr === 0) t += finale(g, t);
              S.afterLen = t; M.show(g, t);
            } };
        });
      },
      area(g) { return S.val.map((v, i) => 'b' + i).filter((id, i) => !S.st[i].used && S.st[i].no == null); },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk;
    SCN.bg(g, c, 'reef');
    // a soft shaft of light falls on the jellies
    const sh = c.createRadialGradient(180, BY, 10, 180, BY, 220); sh.addColorStop(0, 'rgba(120,220,255,0.16)'); sh.addColorStop(1, 'rgba(120,220,255,0)'); c.fillStyle = sh; c.fillRect(0, 200, 360, 320);
    SCN.panel(c, 'glass', 180, 260, 300, 128, t);
    const miss = K.missInfo && K.missInfo.tap && t - K.missAt < 0.6 ? K.missInfo.tap : null;
    S.val.forEach((v, i) => {
      const st = S.st[i], bob = Math.sin(t * 1.4 + i * 1.3) * 4, onK = st.on != null ? M.clamp((t - st.on) / (0.3 * M.pace(g)), 0, 1) : 0;
      const noK = st.no != null && st.no < 1e8 ? t - st.no : -1, wob = miss === 'b' + i ? Math.sin((t - K.missAt) * 46) * 5 : noK >= 0 && noK < 0.45 ? Math.sin(noK * 40) * 4 * (1 - noK / 0.45) : 0;
      const tapK = t - st.tap < 0.3 ? Math.sin((t - st.tap) / 0.3 * Math.PI) : 0, x = S.x[i] + wob, y = BY + bob - tapK * 6, w = 26 + tapK * 3, pulse = 1 + Math.sin(t * 3 + i) * 0.04;
      c.save();
      if (onK > 0) { const gl = c.createRadialGradient(x, y - 8, 4, x, y - 8, 70); gl.addColorStop(0, `rgba(255,240,150,${0.6 * onK})`); gl.addColorStop(1, 'rgba(255,240,150,0)'); c.fillStyle = gl; c.fillRect(x - 70, y - 78, 140, 140); }
      // tentacles
      c.lineCap = 'round'; c.lineWidth = 2.2; c.strokeStyle = onK > 0.5 ? 'rgba(255,236,160,0.8)' : 'rgba(170,200,255,0.55)';
      for (let j = 0; j < 4; j++) { const tx = x - 15 + j * 10; c.beginPath(); c.moveTo(tx, y + 6); for (let s = 1; s <= 6; s++) c.lineTo(tx + Math.sin(t * 2.4 + s * 0.9 + j + i) * 3.5, y + 6 + s * 7); c.stroke(); }
      // the bell
      const bad = miss === 'b' + i, top = bad ? '#ffb0a8' : M.mix('#6a72c0', '#fff6c0', onK), bot = bad ? '#d8454a' : M.mix('#3a3a8a', '#ffc040', onK);
      const gr = c.createLinearGradient(0, y - w, 0, y + 8); gr.addColorStop(0, top); gr.addColorStop(1, bot); c.fillStyle = gr; c.globalAlpha = 0.72 + 0.28 * onK;
      c.beginPath(); c.moveTo(x - w * pulse, y + 6); c.bezierCurveTo(x - w * pulse, y - w * 1.25, x + w * pulse, y - w * 1.25, x + w * pulse, y + 6);
      for (let j = 4; j >= 0; j--) { const sx = x - w * pulse + (j + 0.5) * (2 * w * pulse / 5); c.quadraticCurveTo(sx + w * 0.2, y + 12, sx - w * 0.2 + (j === 0 ? -w * 0.2 : 0), y + 6); }
      c.closePath(); c.fill(); c.globalAlpha = 1;
      c.strokeStyle = onK > 0.5 ? 'rgba(255,255,230,0.9)' : 'rgba(200,220,255,0.6)'; c.lineWidth = 1.5; c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(x - w * 0.4, y - w * 0.55, w * 0.22, w * 0.12, -0.6, 0, 7); c.fill();
      // its place value
      c.font = M.NUMF(v >= 10 ? 22 : 26); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = onK > 0.5 ? '#6a4000' : '#eef2ff'; c.fillText(String(v), x, y - 9);
      c.restore();
      if (st.digit == null) { c.save(); c.globalAlpha = 0.35; c.strokeStyle = WINK; c.setLineDash([4, 5]); c.lineWidth = 2; c.beginPath(); c.moveTo(S.x[i] - 14, DY + 6); c.lineTo(S.x[i] + 14, DY + 6); c.stroke(); c.restore(); }
    });
    M.drawEx(g, c, 'top'); M.drawEx(g, c, 'work');
    S.val.forEach((v, i) => M.drawEx(g, c, 'd' + i));
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'octopus', HX, HY - hopK * 22, 1.2, { t, pose, expr }); else SCN.host(g, c, 'octopus', HX, HY, 1.2);
    M.drawUI(g, c);
  },
});
