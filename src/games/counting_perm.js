// counting_perm.js — PERMUTATION! Count the ways to fill 3 podium places from 5 animals, one place at a time.
// A city race at sunset: a podium for 1st, 2nd and 3rd, a scoreboard reading P(5, 3) = □ × □ × □, and five animals
// waiting in a row. The player drags an animal onto a podium place (or taps it to send it to the next free place): the
// block shows how many animals could have gone there (5, then 4, then 3), and that number fills the next box on the
// scoreboard (medium mode: picked from the tray). When the podium is full, a tap on 5 × 4 × 3 makes 60.
// Level 0: 2 places from 4 animals. Level 1: 3 places from 5. Level 2: 3 places from 6.
const M = MK, INK = '#ffe9b0';
const SPOTS = [{ x: 180, top: 386 }, { x: 110, top: 406 }, { x: 250, top: 420 }], NAMES = ['1st', '2nd', '3rd'];
const KINDS = ['rabbit', 'duck', 'frog', 'hedgehog', 'fox', 'penguin'];

MG.add({
  id: 'counting_perm', stage: 'counting', cmd: 'PERMUTATION!', hint: 'drag', time: 9, mood: 'party', winText: 'Ranked!', hold: 1.4,
  card: {
    title: 'Permutations', ref: 'Grade 11 and up', kind: 'Counting',
    text: 'A permutation is an arrangement where order matters. P(5, 3) is the number of ways to put 3 of 5 animals on the 1st, 2nd and 3rd places of a podium.\n\nFill the places one at a time. Any of the 5 animals can win 1st place. Once it stands there, only 4 are left for 2nd place, and then only 3 for 3rd place. Each choice can be combined with every other choice, so you multiply: 5 × 4 × 3 = 60.\n\nIn general, P(n, k) = n × (n − 1) × … with k factors, which is the same as n! ÷ (n − k)!.',
    note: 'Count the choices for each place, one place at a time, and multiply them. Each place has one choice fewer than the one before.',
    ask: 'In how many ways can 2 of 6 runners win gold and silver? What is P(4, 3)?',
  },
  init(g) {
    const S = g.s; M.setup(g); const L = g.level;
    [S.n, S.k] = L === 0 ? [4, 2] : L === 1 ? [5, 3] : [6, 3];
    const kinds = KINDS.slice(); for (let i = kinds.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]]; }
    S.ani = [...Array(S.n)].map((_, i) => ({ kind: kinds[i], qx: S.n === 1 ? 180 : 34 + i * 292 / (S.n - 1), spot: -1 }));
    S.spots = SPOTS.slice(0, S.k).map(p => ({ ...p, who: -1, ch: null })); S.fill = []; S.done = false; S.prod = S.fill;
    S.ans = 1; for (let i = 0; i < S.k; i++) S.ans *= S.n - i;
    g.dur *= (2.6 + 1.05 * (S.k + 1)) / 8;
    S.build = () => {
      const f = S.done ? [M.num(S.ans, null, { pop: g.t })] : S.spots.flatMap((_, i) => [i ? M.op('×', 'x' + i) : null, i < S.fill.length ? M.num(S.fill[i], 'v' + i, { pop: S.fillAt[i] }) : M.slot('q' + i)]);
      const right = M.row(...f); if (!S.done && S.fill.length === S.k) right.id = 'prod';
      M.place(g, 'ex', M.row(M.vr('P'), M.paren(M.row(M.num(S.n), M.op(','), M.num(S.k)), 'pk'), M.op('=', 'eq'), right), 180, 238, 34, { col: INK });
    };
    S.fillAt = []; S.build(); M.inert(g, ['pk', 'eq', 'x1', 'x2', 'v0', 'v1', 'v2']);
    S.ani.forEach((a, i) => M.zone(g, 'a' + i, { x: a.qx, y: 556, w: 48, h: 62 }));
    S.spots.forEach((p, j) => M.zone(g, 's' + j, { x: p.x, y: p.top - 30, w: 64, h: 70 }));
    const place = (g, i, j) => {
      const a = S.ani[i], p = S.spots[j], ch = S.n - S.fill.length; a.spot = j; a.flyAt = g.t; p.who = i;
      delete g.s.mk.zones['a' + i]; delete g.s.mk.box['a' + i]; S.pending = { j, ch }; g.sfx('whoosh');
    };
    const write = g => { const { j, ch } = S.pending; S.spots[j].ch = ch; S.spots[j].chAt = g.t; S.fillAt.push(g.t); S.fill.push(ch); S.pending = null; S.build(); g.sfx('coin'); };
    M.play(g, {
      moves(g) {
        const out = [], placed = S.fill.length;
        if (placed < S.k) {
          const free = S.spots.map((p, j) => j).filter(j => S.spots[j].who < 0), ch = S.n - placed;
          const ask = { v: ch, wrong: [ch + 1, ch - 1, S.k, S.n] };
          S.ani.forEach((a, i) => { if (a.spot >= 0) return; for (const j of free) out.push({ drag: 'a' + i, to: 's' + j, busy: 0.12, ask, then(g) { place(g, i, j); }, resolve: write }); });
          S.ani.forEach((a, i) => { if (a.spot < 0) out.push({ tap: 'a' + i, busy: 0.12, ask, then(g) { place(g, i, free[0]); }, resolve: write }); });
          return out;
        }
        if (!S.done) return [{ tap: 'prod', busy: 0.1, ask: { v: S.ans, wrong: S.k === 2 ? [S.n + S.n - 1, S.n * S.n, S.ans / 2] : [S.ans / 6, S.n * S.n * S.n, S.ans + S.n] }, then() {}, resolve(g) { S.done = true; S.build(); g.sfx('coin'); g.burst(180, 238, ['#ffd45a', '#ff7aa8', '#fff'], 16, 160); } }];
        return [];
      },
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
    // the podium: each block shows how many choices its place had
    S.spots.forEach((p, j) => {
      const h = 452 - p.top, x0 = p.x - 34; const gr = c.createLinearGradient(0, p.top, 0, 452); gr.addColorStop(0, ['#ffd45a', '#d8dce8', '#e0a070'][j]); gr.addColorStop(1, ['#c89a2a', '#9aa0b0', '#b0703a'][j]);
      c.fillStyle = 'rgba(30,20,40,0.3)'; c.fillRect(x0 + 4, p.top + 4, 68, h); c.fillStyle = gr; c.fillRect(x0, p.top, 68, h);
      c.fillStyle = '#3a2440'; c.textAlign = 'center'; c.font = M.NUMF(14); c.fillText(NAMES[j], p.x, p.top + 18);
      if (p.ch != null) { const pk = 1 + Math.sin(M.clamp((t - p.chAt) / 0.3, 0, 1) * Math.PI) * 0.4; c.save(); c.translate(p.x, p.top + 40); c.scale(pk, pk); c.font = M.NUMF(24); c.fillStyle = '#3a1640'; c.fillText(String(p.ch), 0, 8); c.restore(); }
    });
    // the animals: in the queue, flying to the podium, or standing on it
    const pr = K.press && K.press.dragging ? K.press : null;
    S.ani.forEach((a, i) => {
      let x = a.qx, y = 586, pose = 'idle', expr = 'happy', s = 0.78;
      if (a.spot >= 0) { const p = S.spots[a.spot], k = M.easeIO((t - a.flyAt) / 0.22); x = M.lerp(a.qx, p.x, k); y = M.lerp(586, p.top, k) - Math.sin(k * Math.PI) * 60; s = 0.82; pose = won ? 'cheer' : k < 1 ? 'hop' : 'idle'; expr = won ? 'laugh' : 'happy'; }
      else if (pr && pr.id === 'a' + i) { x = pr.x; y = pr.y + 24; pose = 'hop'; expr = 'wow'; }
      else if (won) { pose = 'wave'; }
      try { ANI.draw(c, a.kind, x, y, s, { t, pose, expr, phase: i * 1.3, facing: x > 180 ? -1 : 1 }); } catch (e) { P.sheep(c, x, y, s * 0.7, { t }); }
    });
    M.drawUI(g, c);
  },
});
