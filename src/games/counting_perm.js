// counting_perm.js — PERMUTATION! Count the ways to fill 3 podium places from 5 animals, one place at a time.
// A city race at sunset: a podium for 1st, 2nd and 3rd, a scoreboard reading P(5, 3) = □ × □ × □, and five animals
// waiting in a row. Show your work:
//   1. Drag an animal onto a podium place (or tap it to send it to the next free place). First the animals still
//      waiting are counted: a numbered tag pops over each one in turn (1, 2, 3, 4, 5), because any of them could have
//      taken this place (medium mode: the count is picked from the tray). Then the animal hops onto the podium, the count
//      writes itself on its block, and lifts off and flies up into the next box on the scoreboard. Each place has one
//      animal fewer to choose from, so the counts go 5, 4, 3.
//   2. Tap 5 × 4 × 3: it multiplies left to right with notes under the scoreboard ("5 × 4 = 20", the 4 slides into the
//      5, which rolls over to 20; then "20 × 3 = 60"), and the 60 flies up into the scoreboard.
// Level 0: 2 places from 4 animals. Level 1: 3 places from 5. Level 2: 3 places from 6.
const M = MK, INK = '#ffe9b0', NOTE = '#fff2a0', TAG = '#ff7aa8';
const SPOTS = [{ x: 180, top: 386 }, { x: 110, top: 406 }, { x: 250, top: 420 }], NAMES = ['1st', '2nd', '3rd'];
const KINDS = ['rabbit', 'duck', 'frog', 'hedgehog', 'fox', 'penguin'];

MG.add({
  id: 'counting_perm', stage: 'counting', cmd: 'PERMUTATION!', hint: 'drag', time: 9, mood: 'party', winText: 'Ranked!', hold: 1.5,
  card: {
    title: 'Permutations', ref: 'Grade 11 and up', kind: 'Counting',
    text: 'A permutation is an arrangement where order matters. P(5, 3) is the number of ways to put 3 of 5 animals on the 1st, 2nd and 3rd places of a podium.\n\nFill the places one at a time. Any of the 5 animals can win 1st place. Once it stands there, only 4 are left for 2nd place, and then only 3 for 3rd place. Each choice can be combined with every other choice, so you multiply: 5 × 4 × 3 = 60.\n\nIn general, P(n, k) = n × (n − 1) × … with k factors, which is the same as n! ÷ (n − k)!.',
    note: 'Count the choices for each place, one place at a time, and multiply them. Each place has one choice fewer than the one before.',
    ask: 'In how many ways can 2 of 6 runners win gold and silver? What is P(4, 3)?',
  },
  init(g) {
    const S = g.s; M.setup(g); const L = g.level, T = M.pace(g);
    [S.n, S.k] = L === 0 ? [4, 2] : L === 1 ? [5, 3] : [6, 3];
    const kinds = KINDS.slice(); for (let i = kinds.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]]; }
    S.ani = [...Array(S.n)].map((_, i) => ({ kind: kinds[i], qx: S.n === 1 ? 180 : 34 + i * 292 / (S.n - 1), spot: -1 }));
    S.spots = SPOTS.slice(0, S.k).map(p => ({ ...p, who: -1, ch: null })); S.fill = []; S.done = false; S.merged = 0;
    S.ans = 1; for (let i = 0; i < S.k; i++) S.ans *= S.n - i;
    g.dur *= (2.6 + 1.05 * (S.k + 1)) / 8;
    const hop = (g, e) => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    // every symbol is a node object that lives for the whole game, so symbols glide when the line is rewritten
    S.N = { v: S.spots.map((_, i) => M.num(S.n - i, 'v' + i)), x: S.spots.map((_, i) => i ? M.op('×', 'x' + i) : null), q: S.spots.map((_, i) => M.slot('q' + i)), ans: M.num(S.ans, 'ans', { alpha: 0, _born: -1 }) };
    S.left = [M.vr('P'), M.paren(M.row(M.num(S.n), M.op(','), M.num(S.k)), 'pk'), M.op('=', 'eq')];
    S.build = () => {
      const N = S.N, f = S.done ? [N.ans] : S.spots.flatMap((_, i) => i && i <= S.merged ? [] : [N.x[i], i < S.fill.length ? N.v[i] : N.q[i]]);
      const right = M.row(...f); right._born = -1; if (!S.done && S.fill.length === S.k) right.id = 'prod';
      M.place(g, 'ex', M.row(...S.left, right), 180, 238, 34, { col: INK });
    };
    S.build(); M.inert(g, ['pk', 'eq', 'x1', 'x2', 'v0', 'v1', 'v2', 'ans', 'nt']);
    S.ani.forEach((a, i) => M.zone(g, 'a' + i, { x: a.qx, y: 556, w: 48, h: 62 }));
    S.spots.forEach((p, j) => M.zone(g, 's' + j, { x: p.x, y: p.top - 30, w: 64, h: 70 }));
    // the working of one place: count the animals still waiting, then the chosen one hops up and its count flies to the board
    const count = (g, i, j) => { const ch = S.n - S.fill.length, per = Math.min(0.17, 0.85 / ch) * T, wait = S.ani.map((a, k) => k).filter(k => S.ani[k].spot < 0);
      M.show(g, ch * per + 0.15 * T); S.pick = { i, j, ch }; S.tags = { t0: g.t + 0.05 * T, per, list: wait, i }; S.point = true; hop(g, 'think');
      wait.forEach((k, m) => M.at(g, [[0.05 * T + m * per, g => g.sfx('tap')]])); return ch * per + 0.15 * T; };
    const land = g => { const { i, j, ch } = S.pick, a = S.ani[i], p = S.spots[j], slot = S.fill.length; M.show(g, 0.95 * T);
      a.spot = j; a.flyAt = g.t; a.flyDur = 0.32 * T; p.who = i; delete g.s.mk.zones['a' + i]; delete g.s.mk.box['a' + i]; g.sfx('whoosh'); S.tags.out = g.t;
      M.at(g, [[0.3 * T, g => { p.ch = ch; p.chAt = g.t; g.sfx('pop'); hop(g); }],
        [0.45 * T, g => { M.fly(g, { node: M.num(ch, null, { col: '#3a1640' }), from: [p.x, 474], to: 'q' + slot, dur: 0.35 * T, arc: -60, s0: 24, s1: 34, col: NOTE,
          then(g) { S.fill.push(ch); S.build(); const v = S.N.v[slot]; v.pop = g.t; M.sparkle(g, v, { n: 8, cols: [NOTE, '#fff', TAG] }); g.sfx('coin'); } }); }],
        [0.95 * T, g => { S.pick = null; S.tags = null; S.point = false; }]]); };
    // a note under the scoreboard ("5 × 4 = 20") whose result is written later
    const note = (g, a, b) => { S.res = M.num(a * b, null, { alpha: 0 }); S.note = Object.assign(M.row(M.num(a), M.op('×'), M.num(b), M.op('='), S.res), { id: 'nt' });
      S.nk = 'n' + S.merged + (S.done ? 'd' : ''); M.place(g, S.nk, S.note, M.box(g, 'prod').x, 312, 28, { col: NOTE }); M.writeIn(g, S.note, { dur: 0.3 * T }); g.sfx('tap'); };
    const noteOut = g => { const q = S.note; M.tween(g, q, { alpha: 0 }, 0.2 * T); for (const it of q.items) M.tween(g, it, { alpha: 0 }, 0.2 * T); const k = S.nk; M.at(g, [[0.25 * T, g => { delete g.s.mk.ex[k]; }]]); };
    const resPos = g => { const b = M.box(g, 'nt'), m = M.lay(S.note, 28), rw = M.lay(S.res, 28).w; return [b.x + m.w / 2 - rw / 2, b.y]; };
    M.play(g, {
      moves(g) {
        const out = [], placed = S.fill.length;
        if (placed < S.k) {
          const free = S.spots.map((p, j) => j).filter(j => S.spots[j].who < 0), ch = S.n - placed;
          const ask = { v: ch, wrong: [ch + 1, ch - 1, S.k, S.n] }, at = Math.min(0.17, 0.85 / ch) * T * ch + 0.15 * T;
          const mk = (o, i, j) => ({ ...o, busy: 0.12, ask, askAt: at, after: 0.95 * T, then(g) { count(g, i, j); }, resolve: land });
          S.ani.forEach((a, i) => { if (a.spot >= 0) return; for (const j of free) out.push(mk({ drag: 'a' + i, to: 's' + j }, i, j)); });
          S.ani.forEach((a, i) => { if (a.spot < 0) out.push(mk({ tap: 'a' + i }, i, free[0])); });
          return out;
        }
        if (!S.done) {
          const f = S.spots.map((_, i) => S.n - i), pre = S.k === 3 ? 0.95 * T : 0, askAt = pre + 0.45 * T;
          return [{ tap: 'prod', busy: 0.1, askAt, after: 0.8 * T, ask: { v: S.ans, wrong: S.k === 2 ? [S.n + S.n - 1, S.n * S.n, S.ans / 2] : [S.ans / 6, S.n * S.n * S.n, S.ans + S.n] },
            then(g) { M.show(g, askAt); M.circle(g, 'prod', { dur: 0.45 * T, col: NOTE }); S.point = true; hop(g, 'think');
              const last = g => { const a = S.k === 3 ? f[0] * f[1] : f[0], b = f[S.k - 1]; M.indicate(g, 'v0', { col: NOTE, dur: 0.4 * T }); M.indicate(g, 'v' + (S.k - 1), { col: NOTE, dur: 0.4 * T }); note(g, a, b); };
              if (S.k === 2) { M.at(g, [[0.1 * T, last]]); return; }
              // 5 × 4 first: the note, then the 4 slides into the 5, which rolls over to 20
              M.at(g, [[0.1 * T, g => { M.indicate(g, 'v0', { col: NOTE, dur: 0.4 * T }); M.indicate(g, 'v1', { col: NOTE, dur: 0.4 * T }); note(g, f[0], f[1]); }],
                [0.4 * T, g => { S.res.alpha = 1; M.writeIn(g, S.res, { dur: 0.15 * T }); g.sfx('ding'); }],
                [0.55 * T, g => { const a = M.box(g, 'v0'), b = M.box(g, 'v1'); M.tween(g, 'v1', { dx: a.x - b.x, alpha: 0 }, 0.12 * T); M.tween(g, 'x1', { alpha: 0 }, 0.15 * T);
                  M.fly(g, { node: M.num(f[0] * f[1], null, { col: NOTE }), from: resPos(g), to: 'v0', dur: 0.25 * T, arc: 20, s0: 28, s1: 34 }); noteOut(g); }],
                [0.64 * T, g => { S.N.v[1].alpha = 0; S.N.x[1].alpha = 0; S.merged = 1; S.build(); }],
                [0.8 * T, g => { M.roll(g, 'v0', f[0] * f[1], { dur: 0.2 * T }); M.sparkle(g, 'v0', { n: 6, cols: [NOTE, '#fff'] }); g.sfx('pop'); hop(g); }],
                [pre + 0.05 * T, last]]); },
            resolve(g) { M.show(g, 0.8 * T); S.res.alpha = 1; M.writeIn(g, S.res, { dur: 0.18 * T }); g.sfx('ding');
              M.at(g, [[0.3 * T, g => { const from = resPos(g); for (const it of S.N.v.concat(S.N.x)) if (it) M.tween(g, it, { alpha: 0 }, 0.2 * T); noteOut(g);
                  M.fly(g, { node: M.num(S.ans, null, { col: NOTE }), from, to: 'prod', dur: 0.3 * T, arc: 24, s0: 28, s1: 34,
                    then(g) { S.done = true; S.N.ans.alpha = 1; S.N.ans.pop = g.t; S.build(); g.sfx('coin'); hop(g, 'laugh'); g.burst(180, 238, ['#ffd45a', '#ff7aa8', '#fff'], 16, 160); } }); }],
                [0.8 * T, g => { S.point = false; }]]); } }];
        }
        return [];
      },
      area(g) { return S.fill.length < S.k ? S.ani.map((a, i) => a.spot < 0 ? 'a' + i : null).filter(Boolean) : 'prod'; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, won = g.done && g.result === 'win';
    SCN.bg(g, c, 'city');
    // bunting over the street
    for (let i = 0; i < 12; i++) { const x = i * 32 + 4, y = 182 + Math.sin(i * 0.9) * 3; c.fillStyle = ['#ff6a8a', '#ffd45a', '#6ad0ff', '#8ae07a'][i % 4]; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 26, y); c.lineTo(x + 13, y + 16 + Math.sin(t * 3 + i) * 2); c.fill(); }
    // the scoreboard, framed in bulbs
    c.fillStyle = '#2a2040'; c.beginPath(); c.roundRect(24, 202, 312, 64, 12); c.fill(); c.strokeStyle = '#8a6a3a'; c.lineWidth = 5; c.stroke();
    for (let i = 0; i < 16; i++) { const x = 32 + i * 19.7, on = (Math.floor(t * 6) + i) % 3 === 0 || won; c.fillStyle = on ? '#fff2a0' : '#8a7a5a'; c.beginPath(); c.arc(x, 204, 3, 0, 7); c.arc(x, 264, 3, 0, 7); c.fill(); }
    M.drawEx(g, c, 'ex');
    // a dark pill behind the working note under the scoreboard, so it reads against the city
    for (const k in S.mk.ex) if (/^n\d/.test(k)) { const e = S.mk.ex[k], b = M.box(g, 'nt'); if (b && e.node === S.note) { const al = S.note.alpha ?? 1; c.save(); c.globalAlpha = al * 0.8; c.fillStyle = '#2a2040'; const wk = S.note.write ? M.easeIO((t - S.note.write.t0) / S.note.write.dur) : 1, pw = Math.max(30, (b.w + 24) * wk); c.beginPath(); c.roundRect(b.x - b.w / 2 - 12, b.y - b.h / 2 - 7, pw, b.h + 14, 12); c.fill(); c.restore(); } M.drawEx(g, c, k); }
    // the podium: each block shows how many choices its place had
    S.spots.forEach((p, j) => {
      const h = 452 - p.top, x0 = p.x - 34; const gr = c.createLinearGradient(0, p.top, 0, 452); gr.addColorStop(0, ['#ffd45a', '#d8dce8', '#e0a070'][j]); gr.addColorStop(1, ['#c89a2a', '#9aa0b0', '#b0703a'][j]);
      c.fillStyle = 'rgba(30,20,40,0.3)'; c.fillRect(x0 + 4, p.top + 4, 68, h); c.fillStyle = gr; c.fillRect(x0, p.top, 68, h);
      c.fillStyle = '#3a2440'; c.textAlign = 'center'; c.font = M.NUMF(18); c.fillText(NAMES[j], p.x, p.top + 20);
      if (p.ch != null) { const pk = 1 + Math.sin(M.clamp((t - p.chAt) / 0.3, 0, 1) * Math.PI) * 0.4, wk = M.clamp((t - p.chAt) / 0.2, 0, 1); c.save(); c.translate(p.x, 474); c.scale(pk, pk); c.fillStyle = ['#ffd45a', '#e8ecf4', '#f0b080'][j]; c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 17, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.rect(-20, -20, 40 * wk, 40); c.clip(); c.font = M.NUMF(24); c.fillStyle = '#3a1640'; c.fillText(String(p.ch), 0, 8); c.restore(); }
    });
    // the animals: in the queue, flying to the podium, or standing on it
    const pr = K.press && K.press.dragging ? K.press : null, tg = S.tags;
    S.ani.forEach((a, i) => {
      let x = a.qx, y = 586, pose = 'idle', expr = 'happy', s = 0.78;
      if (a.spot >= 0) { const p = S.spots[a.spot], k = M.easeIO((t - a.flyAt) / (a.flyDur || 0.22)); x = M.lerp(a.qx, p.x, k); y = M.lerp(586, p.top, k) - Math.sin(k * Math.PI) * 60; s = 0.82; pose = won ? 'cheer' : k < 1 ? 'hop' : 'idle'; expr = won ? 'laugh' : 'happy'; }
      else if (pr && pr.id === 'a' + i) { x = pr.x; y = pr.y + 24; pose = 'hop'; expr = 'wow'; }
      else if (won) { pose = 'wave'; }
      else if (tg && tg.i === i) { pose = 'hop'; expr = 'wow'; }
      if (tg && tg.i === i && a.spot < 0) M.glowBox(c, { x, y: y - 26, w: 44, h: 54 }, t, 0.7, true);
      try { ANI.draw(c, a.kind, x, y, s, { t, pose, expr, phase: i * 1.3, facing: x > 180 ? -1 : 1 }); } catch (e) { P.sheep(c, x, y, s * 0.7, { t }); }
    });
    // the count: a numbered tag pops over each animal that could take this place
    if (tg) tg.list.forEach((k, m) => { const k0 = (t - tg.t0 - m * tg.per) / 0.18; if (k0 <= 0) return; const out = tg.out != null ? M.clamp((t - tg.out) / 0.25, 0, 1) : 0; if (out >= 1) return;
      const a = S.ani[k], x = a.qx, y = 520, pk = 1 + Math.sin(M.clamp(k0, 0, 1) * Math.PI) * 0.35;
      c.save(); c.globalAlpha = Math.min(1, k0) * (1 - out); c.translate(x, y - (k === tg.i ? out * 10 : 0)); c.scale(pk, pk);
      c.fillStyle = k === tg.i ? '#ffd45a' : TAG; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, 15, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#3a1640'; c.font = M.NUMF(19); c.textAlign = 'center'; c.fillText(String(m + 1), 0, 7); c.restore(); });
    M.drawUI(g, c);
  },
});
