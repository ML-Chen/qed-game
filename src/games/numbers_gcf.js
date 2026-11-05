// numbers_gcf.js — GCF! The greatest common factor of two numbers: grow both factor trees, pair up the primes they
// share, and multiply the shared primes.
// A coral reef at noon, with an octopus. Two numbers sit on coral knobs (12 and 18), and an open clam lies between them
// on the sand. Every move acts its working out:
//   1-2. Tap a number (either one first): its factor tree grows like coral. Each split is circled, "12 = 2 × 6" writes
//        itself beside it, and the two factors slide down their new branches; every prime glows as a pearl.
//   3+.  Drag a pearl onto the same prime in the other tree (or into the clam): both pearls are ringed in gold, a bright
//        strand links them, and one copy of the shared prime floats down into the clam: 2 × 3. After the last pair the
//        primes nobody shares fade, the clam's product is circled, and "= 6" writes itself with a sparkle.
// Wrong moves: a composite number cannot be paired, and a prime with no partner (5, or a 2 that is already used) wobbles
// and flashes a red strand. Level 0: 12 and 18, 8 and 12, 18 and 30. Level 1: up to 42 (24 has three splits). Level 2:
// three shared primes (24 and 36, 40 and 60). Medium mode: the tray asks for the first split's other factor (12 = 2 × ?)
// in each tree and for the GCF itself.
const M = MK, INK = '#3a1640', NOTE = '#fff3c4', GOLD = '#ffd45a', Y0 = 206, DY = 66, PILEY = 486;
const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const spf = n => { for (let d = 2; d * d <= n; d++) if (n % d === 0) return d; return n; };
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function pick(g) {
  const R = a => a[Math.floor(g.rand() * a.length)];
  const p = g.level === 0 ? R([[12, 18], [8, 12], [18, 30]]) : g.level === 1 ? R([[20, 30], [18, 24], [12, 20], [30, 42], [12, 30]]) : R([[24, 36], [40, 60], [28, 42], [36, 60], [45, 60]]);
  return g.rand() < 0.5 ? p : [p[1], p[0]];
}
// the tree of n: composites run down the spine, the prime peeled off at each split goes to the outer side
function tree(n, side, sx, ox) {
  const nodes = [{ id: 't' + side + '_0', v: n, x: sx, y: Y0, prime: isPrime(n), par: null, d: 0 }], splits = [];
  let cur = nodes[0], d = 0;
  while (!cur.prime) { d++; const p = spf(cur.v), q = cur.v / p;
    const a = { id: `t${side}_${d}a`, v: p, x: ox, y: Y0 + d * DY, prime: true, par: cur, d }, b = { id: `t${side}_${d}b`, v: q, x: sx, y: Y0 + d * DY, prime: isPrime(q), par: cur, d };
    nodes.push(a, b); splits.push({ n: cur, p, q, a, b }); cur = b; }
  return { nodes, splits, leaves: nodes.filter(q => q.prime && q.par), root: nodes[0] };
}
function paintBg(c, W, H) {
  const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#3ec0d8'); gr.addColorStop(0.45, '#1c8ab0'); gr.addColorStop(1, '#0c4a78'); c.fillStyle = gr; c.fillRect(0, 0, W, H);
  c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const x = 20 + i * 64; const g2 = c.createLinearGradient(x, 0, x + 80, 520); g2.addColorStop(0, 'rgba(200,250,255,0.16)'); g2.addColorStop(1, 'rgba(200,250,255,0)'); c.fillStyle = g2; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 30, 0); c.lineTo(x + 110, 520); c.lineTo(x + 50, 520); c.fill(); } c.restore();
  // far rocks and sand
  c.fillStyle = 'rgba(10,50,80,0.45)'; c.beginPath(); c.moveTo(0, 470); c.quadraticCurveTo(60, 400, 120, 455); c.quadraticCurveTo(200, 420, 260, 460); c.quadraticCurveTo(320, 410, 360, 450); c.lineTo(360, 640); c.lineTo(0, 640); c.fill();
  const sd = c.createLinearGradient(0, 500, 0, H); sd.addColorStop(0, '#e8d4a0'); sd.addColorStop(1, '#c8a870'); c.fillStyle = sd; c.beginPath(); c.moveTo(0, 520); for (let x = 0; x <= W; x += 20) c.lineTo(x, 514 + Math.sin(x * 0.04) * 7); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  c.fillStyle = 'rgba(160,120,70,0.35)'; for (let i = 0; i < 40; i++) { c.beginPath(); c.arc((i * 97) % W, 540 + (i * 53) % 100, 1.5 + (i % 3), 0, 7); c.fill(); }
  // seaweed and little corals at the sides
  for (const [x, h, col] of [[14, 120, '#2e8a5a'], [30, 80, '#4aa86a'], [338, 110, '#2e8a5a'], [322, 70, '#4aa86a'], [350, 60, '#d86a8a']]) { c.strokeStyle = col; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, 600); c.bezierCurveTo(x + 14, 600 - h / 3, x - 12, 600 - h * 0.66, x + 4, 600 - h); c.stroke(); }
  for (const [x, col] of [[250, '#f2a03a'], [292, '#c85aa8']]) { c.fillStyle = col; for (let k = 0; k < 5; k++) { c.beginPath(); c.ellipse(x + (k - 2) * 7, 590 - Math.abs(k - 2) * -4 - 14, 4, 16 - Math.abs(k - 2) * 3, (k - 2) * 0.3, 0, 7); c.fill(); } }
}
function clam(c, x, y, t, open) {
  c.save(); c.translate(x, y);
  c.fillStyle = 'rgba(20,40,60,0.3)'; c.beginPath(); c.ellipse(0, 26, 96, 14, 0, 0, 7); c.fill();
  // the top shell, tipped back
  c.save(); c.translate(0, -4); c.scale(1, 0.55 + 0.05 * open); c.fillStyle = '#c87a9a'; c.beginPath(); c.moveTo(-88, 0); c.quadraticCurveTo(-80, -86, 0, -92); c.quadraticCurveTo(80, -86, 88, 0); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(255,220,235,0.5)'; c.lineWidth = 3; for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(0, -6); c.lineTo(k * 25, -84 + Math.abs(k) * 8); c.stroke(); } c.restore();
  // the inside and the bottom shell
  c.fillStyle = '#ffe8f0'; c.beginPath(); c.ellipse(0, 0, 84, 22, 0, 0, 7); c.fill();
  c.fillStyle = '#e898b4'; c.beginPath(); c.moveTo(-90, 0); c.quadraticCurveTo(-80, 40, 0, 42); c.quadraticCurveTo(80, 40, 90, 0); c.quadraticCurveTo(0, 18, -90, 0); c.fill();
  c.strokeStyle = 'rgba(160,60,100,0.4)'; c.lineWidth = 2; for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(k * 22, 12); c.lineTo(k * 26, 38); c.stroke(); }
  c.restore();
}

MG.add({
  id: 'numbers_gcf', stage: 'numbers', cmd: 'GCF!', hint: 'tap', time: 10, mood: 'sea', winText: 'Shared!', hold: 1.7,
  card: {
    title: 'Greatest common factor', ref: 'Grade 6', kind: 'Number theory',
    text: 'A factor of a number divides it with nothing left over. The greatest common factor (GCF) of two numbers is the biggest number that is a factor of both.\n\nOne sure way to find it: break both numbers into primes with factor trees. 12 = 2 × 2 × 3 and 18 = 2 × 3 × 3.\n\nNow pair up the primes the two numbers share. They share one 2 and one 3. Multiply the shared primes: 2 × 3 = 6, so the GCF of 12 and 18 is 6.\n\nThe primes that are left over (a 2 from 12, a 3 from 18) belong to only one number, so they cannot be in a common factor.',
    note: 'Break both numbers into primes, pair up the primes they share, and multiply one of each pair.',
    ask: 'What is the GCF of 8 and 20? What is the GCF of 15 and 25?',
  },
  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g); const [A, B] = pick(g); S.A = A; S.B = B; S.gcf = gcd(A, B);
    S.trees = [tree(A, 0, 100, 38), tree(B, 1, 260, 322)];
    S.on = {}; S.shown = {}; S.grown = [false, false]; S.done = {}; S.ring = {}; S.links = []; S.pile = []; S.dim = null;
    for (const tr of S.trees) for (const q of tr.nodes) { q.node = M.num(q.v, q.id); q.node.hide = !!q.par; M.place(g, q.id, M.row(q.node), q.x, q.y + (q.par ? 11 : 13), q.par ? 32 : 38, { col: INK }); }
    for (const tr of S.trees) S.shown[tr.root.id] = -9;
    M.zone(g, 'clam', { x: 180, y: PILEY - 2, w: 170, h: 60 });
    S.pileRow = M.row(); S.relayPile = () => M.place(g, 'pile', S.pileRow, 180, PILEY + 13, 40, { col: INK });
    M.inert(g, ['pile', 'peq', 'pres']);
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    const shared = []; { const r = S.trees[1].leaves.map(q => q.v); for (const q of S.trees[0].leaves) { const i = r.indexOf(q.v); if (i >= 0) { shared.push(q.v); r.splice(i, 1); } } }
    S.shared = shared;
    // one split acted out: the number is circled, "12 = 2 × 6" writes itself in the gap between the trees, and the two
    // factors slide down their branches (the note's last factor waits for the tray in medium mode)
    const noteFor = (g, sp, withQ) => { const nd = M.row(M.num(sp.n.v), M.op('='), M.num(sp.p), M.op('×'), withQ ? M.num(sp.q, null, { col: GOLD }) : M.txt('?', null, { col: GOLD }));
      if (S.note) delete g.s.mk.ex[S.note.key]; S.note = { node: nd, y: sp.n.y + DY / 2 + 8, t0: g.t, key: 'note' + (S.nk = (S.nk || 0) + 1) }; M.place(g, S.note.key, nd, 180, S.note.y, 22, { col: NOTE }); M.writeIn(g, nd, { dur: 0.32 * M.pace(g) }); };
    const growKids = (g, sp) => { for (const q of [sp.a, sp.b]) S.shown[q.id] = g.t; g.sfx('pop'); hop(g); M.at(g, [[0.32 * T, g => { for (const q of [sp.a, sp.b]) if (q.prime) { M.sparkle(g, q.id, { n: 6, cols: ['#fff', '#ffe9f0', GOLD] }); } if (sp.a.prime && sp.b.prime) g.sfx('ding'); }]]); };
    const SPL = 0.62;
    const grow = side => {
      const tr = S.trees[side], sp0 = tr.splits[0], rest = tr.splits.length * SPL * T + 0.35 * T;
      return { tap: tr.root.id, busy: 0.1, askAt: 0.5 * T, after: rest, ask: { v: sp0.q, wrong: [sp0.n.v - sp0.p, sp0.q + 1, sp0.q - sp0.p, sp0.n.v * sp0.p].filter(v => v > 1 && v !== sp0.q) },
        then(g) { S.grown[side] = true; M.show(g, 0.5 * T); M.circle(g, tr.root.id, { dur: 0.45 * T, col: GOLD }); M.indicate(g, tr.root.node, { dur: 0.4 * T, sc: 1.15 }); g.sfx('swoosh'); hop(g, 'think');
          M.at(g, [[0.15 * T, g => noteFor(g, sp0, false)]]); },
        resolve(g) { M.show(g, rest);
          const nd = S.note.node; nd.items[4] = M.num(sp0.q, null, { col: GOLD, _born: -1, pop: g.t }); M.place(g, S.note.key, nd, 180, S.note.y, 22, { col: NOTE }); M.writeIn(g, nd.items[4], { dur: 0.15 * T });
          const steps = [[0.12 * T, g => growKids(g, sp0)]];
          tr.splits.forEach((sp, i) => { if (!i) return; const t0 = i * SPL * T;
            steps.push([t0, g => { M.circle(g, sp.n.id, { dur: 0.4 * T, col: GOLD }); M.indicate(g, sp.n.node, { dur: 0.35 * T, sc: 1.15 }); noteFor(g, sp, true); }],
              [t0 + 0.3 * T, g => growKids(g, sp)]); });
          steps.push([tr.splits.length * SPL * T + 0.1 * T, g => { S.note.out = g.t; }]);
          steps.push([rest - 0.02, g => { if (S.note) delete g.s.mk.ex[S.note.key]; S.note = null; hop(g, 'happy'); }]);
          M.at(g, steps); } };
    };
    // a shared prime: ring both pearls, link them, and float one copy into the clam
    const mateOf = q => S.trees[q.side ? 0 : 1].leaves.find(r => !S.done[r.id] && r.v === q.v);
    const pairMove = (last) => {
      const len = 1.2 * T, rest = 1.1 * T;
      const mv = { busy: 0.1,
        then(g, from, to) { const q0 = S.leafById[from], q1 = to && to !== 'clam' && S.leafById[to] ? S.leafById[to] : mateOf(q0); S.done[q0.id] = S.done[q1.id] = true; M.show(g, len); hop(g, 'wow'); g.sfx('swoosh');
          S.ring[q0.id] = g.t; S.ring[q1.id] = g.t + 0.12 * T; M.indicate(g, q0.node, { dur: 0.4 * T }); M.indicate(g, q1.node, { dur: 0.4 * T, delay: 0.12 * T });
          S.links.push({ a: q0, b: q1, t0: g.t + 0.2 * T });
          const first = !S.pile.length, nd = M.num(q0.v, 'pp' + S.pile.length, { alpha: 0 }); S.pile.push(nd);
          M.at(g, [[0.5 * T, g => { if (!first) S.pileRow.items.push(M.op('×', null, { _born: -1 })); S.pileRow.items.push(nd); S.relayPile();
            for (const [src, d] of [[q0, 0], [q1, 0.08 * T]]) M.fly(g, { node: M.num(q0.v, null, { col: '#fff8e8' }), from: [src.x, src.y], to: nd.id, delay: d, dur: 0.5 * T, arc: -50, s0: 32, s1: 40,
              then(g) { if (nd.alpha < 1) { nd.alpha = 1; nd.pop = g.t; M.sparkle(g, nd.id, { n: 8 }); g.sfx('ding'); hop(g); } } }); }]]);
          if (last) M.at(g, [[0.95 * T, g => { // the primes nobody shares fade back; the clam's product is circled
            S.dim = g.t; M.circle(g, 'pile', { dur: 0.5 * T, col: GOLD });
            if (S.pile.length > 1) { S.pileRow.items.push(M.op('=', 'peq', { _born: -1 })); S.relayPile(); } }]]); } };
      if (last) Object.assign(mv, { askAt: len, after: rest, ask: { v: S.gcf, wrong: [shared.reduce((s, v) => s + v, 0), S.A * S.B / S.gcf, S.gcf * 2, shared[0]].filter(v => v !== S.gcf) },
        resolve(g) { M.show(g, rest); const r = M.num(S.gcf, 'pres', { col: '#c8401a' });
          S.pileRow.items.push(r); S.relayPile(); M.writeIn(g, r, { dur: 0.3 * T });
          M.at(g, [[0.3 * T, g => { M.indicate(g, r, { dur: 0.5 * T, sc: 1.35, col: GOLD }); M.sparkle(g, 'pile', { n: 16, cols: ['#ffe9a0', '#fff', '#ff9ac0'] }); g.sfx('coin'); hop(g, 'laugh'); }]]); } });
      return mv;
    };
    S.leafById = {}; S.trees.forEach((tr, side) => { for (const q of tr.leaves) { S.leafById[q.id] = q; q.side = side; } });
    M.play(g, {
      moves(g) {
        const out = [];
        for (const s of [0, 1]) if (!S.grown[s]) out.push(grow(s));
        if (out.length) return out;
        // every pairing still possible: a pearl onto the same prime in the other tree, or into the clam
        const free = s => S.trees[s].leaves.filter(q => !S.done[q.id]);
        const left = S.pile.length;
        if (left >= shared.length) return [];
        const last = left === shared.length - 1;
        for (const s of [0, 1]) for (const q of free(s)) { const mates = free(1 - s).filter(r => r.v === q.v); if (mates.length) out.push({ ...pairMove(last), drag: q.id, to: [...mates.map(r => r.id), 'clam'] }); }
        return out;
      },
      area(g) { if (!S.grown[0] || !S.grown[1]) return S.trees.filter((tr, s) => !S.grown[s]).map(tr => tr.root.id); return S.trees[0].leaves.filter(q => !S.done[q.id] && S.trees[1].leaves.some(r => !S.done[r.id] && r.v === q.v)).map(q => q.id); },
    });
  },
  update(g, dt) { M.update(g, dt); const S = g.s, t = g.t, T = M.pace(g);
    // where each factor is right now (a new factor slides out of its parent along the branch); kept here, not in draw
    for (const tr of S.trees) for (const q of tr.nodes) { const s0 = S.shown[q.id]; if (s0 == null) { q.o = null; q.node.hide = true; continue; }
      const k = q.par ? M.ease(M.clamp((t - s0) / (0.34 * T), 0, 1)) : 1, dimK = S.dim != null && q.prime && q.par && !S.done[q.id] ? M.clamp((t - S.dim) / (0.4 * T), 0, 1) : 0;
      q.o = q.par ? [(q.par.x - q.x) * (1 - k), (q.par.y - q.y) * (1 - k), k] : [0, 0, 1]; q.node.hide = false; q.node.dx = q.o[0]; q.node.dy = q.o[1]; q.node.alpha = q.o[2] * (1 - 0.55 * dimK); } },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, T = M.pace(g), mk = S.mk;
    c.drawImage(g.bake('gcf_reef', paintBg), 0, 0, 360, 640);
    for (let i = 0; i < 14; i++) { const x = (i * 53 + Math.sin(t + i) * 8) % 360, y = 640 - ((t * (18 + (i % 5) * 7) + i * 83) % 640); c.strokeStyle = 'rgba(220,250,255,0.5)'; c.lineWidth = 1.4; c.beginPath(); c.arc(x, y, 2 + (i % 4), 0, 7); c.stroke(); }
    // a slide offset per node: a new factor slides out of its parent along the branch
    const off = q => q.o;
    // coral branches
    for (const tr of S.trees) for (const q of tr.nodes) { if (!q.par) continue; const o = off(q); if (!o) continue;
      c.save(); c.strokeStyle = '#e8687e'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(q.par.x, q.par.y); c.lineTo(q.x + o[0], q.y + o[1]); c.stroke();
      c.strokeStyle = 'rgba(255,200,210,0.5)'; c.lineWidth = 3; c.beginPath(); c.moveTo(q.par.x - 2, q.par.y); c.lineTo(q.x + o[0] - 2, q.y + o[1]); c.stroke(); c.restore(); }
    // the strands that link each shared pair
    for (const L of S.links) { const k = M.clamp((t - L.t0) / (0.3 * T), 0, 1); if (k <= 0) continue; const mx = (L.a.x + L.b.x) / 2, my = Math.max(L.a.y, L.b.y) + 40;
      c.save(); c.strokeStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 10; c.lineWidth = 3; c.setLineDash([2, 7]); c.lineCap = 'round'; c.globalAlpha = 0.85; c.beginPath();
      for (let i = 0; i <= 20 * k; i++) { const u = i / 20, x = (1 - u) * (1 - u) * L.a.x + 2 * u * (1 - u) * mx + u * u * L.b.x, y = (1 - u) * (1 - u) * L.a.y + 2 * u * (1 - u) * my + u * u * L.b.y; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore(); }
    // a wrong pairing flashes a red strand
    if (mk.missInfo && mk.missInfo.drag && mk.missInfo.to && t - mk.missAt < 0.7) { const a = M.box(g, mk.missInfo.drag), b = M.box(g, mk.missInfo.to); if (a && b) { c.save(); c.globalAlpha = 1 - (t - mk.missAt) / 0.7; c.strokeStyle = '#ff5a5a'; c.lineWidth = 3; c.setLineDash([6, 5]); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); c.restore(); } }
    clam(c, 180, PILEY + 8, t, 1);
    // the knobs and pearls
    for (const tr of S.trees) for (const q of tr.nodes) { const o = off(q); if (!o) continue; const al = q.node.alpha;
      const x = q.x + o[0], y = q.y + o[1], r = q.par ? 25 : 31; c.save(); c.globalAlpha = al;
      if (q.prime && q.par) { const gr = c.createRadialGradient(x - 6, y - 7, 2, x, y, r); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.6, '#f4ecf8'); gr.addColorStop(1, '#c8b8e0'); c.fillStyle = gr; c.shadowColor = 'rgba(255,255,255,0.8)'; c.shadowBlur = 12; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
      else { c.fillStyle = '#f08ca0'; c.beginPath(); for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, rr = r + (i % 2 ? 3 : -1); c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); c.fillStyle = 'rgba(255,230,236,0.65)'; c.beginPath(); c.arc(x - 5, y - 6, r * 0.55, 0, 7); c.fill(); }
      c.restore();
      if (S.ring[q.id] != null && t >= S.ring[q.id]) { const k = M.clamp((t - S.ring[q.id]) / (0.35 * T), 0, 1); c.save(); c.strokeStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 12; c.lineWidth = 3.5; c.beginPath(); c.arc(x, y, r + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * M.easeIO(k)); c.stroke(); c.restore(); }
      M.drawEx(g, c, q.id); }
    // the working note between the trees
    if (S.note) { const a = S.note.out ? 1 - M.clamp((t - S.note.out) / (0.25 * T), 0, 1) : 1; c.save(); c.globalAlpha = a; const b = M.unionBox(S.note.node.items.map(n => M.box(g, n.id || n._pid)).filter(Boolean)); if (b) { c.fillStyle = 'rgba(8,40,70,0.72)'; c.beginPath(); c.roundRect(b.x - b.w / 2 - 8, b.y - b.h / 2 - 5, b.w + 16, b.h + 10, 12); c.fill(); } M.drawEx(g, c, S.note.key); c.restore(); }
    M.drawEx(g, c, 'pile');
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const expr = won ? 'laugh' : lost || t - mk.missAt < 0.5 ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'octopus', 66, 612 - hopK * 20, 1.15, { t, pose: won ? 'cheer' : hopK > 0 ? 'hop' : M.showing(g) ? 'point' : 'idle', expr }); else SCN.host(g, c, 'octopus', 66, 612, 1.15);
    M.drawUI(g, c);
  },
});
