// numbers_prime.js — PRIME OR NOT! Is 91 prime? Try to share it into equal groups: 2 groups, 3, 5, 7.
// A misty morning duck pond. A sign on the bank holds the number, and that many ducklings paddle about. Floating leaves
// carry the trial divisors: the primes p with p × p ≤ N (2 and 3 for 21; 2, 3, 5 and 7 for 91), so the leaves shown are
// exactly the tests that settle it. Every test is a drag of a leaf onto the number (or anywhere on the pond):
//   the leaf is circled, d lily pads open, "91 ÷ 7" writes itself at the pond's edge, and the ducklings are dealt out
//   one at a time onto the pads, round and round like cards, each pad's count ticking up. Then "= 13" writes itself.
//   If some are left over they stay in the water, turn red and splash, "r 1" writes itself in red, and the leaf and the
//   note are crossed out. If none are left over, every pad gets a gold ring, 7 and 13 fly up to the sign
//   (91 = 7 × 13) and a NOT PRIME stamp thumps down. When the last leaf fails, the ducklings all paddle onto one big pad
//   (23 = 1 × 23) and a PRIME stamp thumps down.
// Leaves may be tried in any order; the guidance shows the smallest first. A retried leaf or a tap on the number wobbles.
// Level 0: 9 to 23 (leaves 2, 3). Level 1: 25 to 49. Level 2: 53 to 97. Even numbers are never asked (one test).
// Medium mode: each test asks how many ducklings each pad gets (the quotient).
const M = MK, INK = '#3a2a1a', RED = '#e0483a', GOLD = '#ffc83a', GREEN = '#2f9a5a', NOTE = '#fff8e0';
const PRIMES = [2, 3, 5, 7];
function pick(g) {
  const r = a => a[Math.floor(g.rand() * a.length)], L = g.level, prime = g.rand() < 0.5;
  if (L === 0) return prime ? r([11, 13, 17, 19, 23]) : r([9, 15, 21]);
  if (L === 1) return prime ? r([29, 31, 37, 41, 43, 47]) : r([25, 33, 35, 39, 49]);
  return prime ? r([53, 59, 61, 67, 71, 73, 79, 83, 89, 97]) : r([55, 65, 77, 85, 91, 95]);
}
const POND = { x0: 26, y0: 270, x1: 334, y1: 452 };
// where d pads sit: one row for 2 or 3, two rows for 5 and 7
function padLayout(d) {
  const rows = d <= 3 ? [d] : d === 5 ? [3, 2] : [4, 3], one = rows.length === 1;
  const r = one ? Math.min(70, 146 / d) : d === 5 ? 44 : 37, out = [];
  rows.forEach((n, ri) => { const y = one ? 352 : 314 + ri * 92, gap = (300 - n * 2 * r) / (n + 1);
    for (let i = 0; i < n; i++) out.push({ x: 30 + gap * (i + 1) + r * (2 * i + 1), y, r }); });
  return out;
}
// sunflower packing: slot k of n on a pad of radius r
const GA = Math.PI * (3 - Math.sqrt(5));
const slot = (p, k, n) => { const c = p.r * 0.8 / Math.sqrt(Math.max(1, n)), rr = c * Math.sqrt(k + 0.5); return [p.x + Math.cos(k * GA) * rr, p.y + Math.sin(k * GA) * rr * 0.92]; };

// the pond at dawn: pink and gold mist, willows, reeds, the water
function pondArt(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 300); sk.addColorStop(0, '#8ab8d8'); sk.addColorStop(0.5, '#f4c8c0'); sk.addColorStop(1, '#ffe8c8'); c.fillStyle = sk; c.fillRect(0, 0, W, 300);
  const sg = c.createRadialGradient(240, 210, 6, 240, 210, 150); sg.addColorStop(0, 'rgba(255,248,220,0.95)'); sg.addColorStop(0.25, 'rgba(255,230,190,0.45)'); sg.addColorStop(1, 'rgba(255,230,190,0)'); c.fillStyle = sg; c.fillRect(80, 60, 300, 260);
  // far trees in mist
  for (const [base, col, seed] of [[250, 'rgba(150,170,170,0.55)', 3], [262, 'rgba(110,140,130,0.7)', 7]]) { const r = P.rng(seed); c.fillStyle = col; c.beginPath(); c.moveTo(0, 300); for (let x = 0; x <= W; x += 14) c.lineTo(x, base - 20 - r() * 34 - Math.sin(x * 0.03 + seed) * 10); c.lineTo(W, 300); c.closePath(); c.fill(); }
  // the bank and the pond
  c.fillStyle = '#7aa860'; c.fillRect(0, 252, W, 30);
  const wt = c.createLinearGradient(0, 262, 0, 560); wt.addColorStop(0, '#9ad0c8'); wt.addColorStop(0.4, '#5aa8a8'); wt.addColorStop(1, '#2e7a86'); c.fillStyle = wt;
  c.beginPath(); c.moveTo(0, 270); c.quadraticCurveTo(180, 256, W, 270); c.lineTo(W, 560); c.quadraticCurveTo(180, 580, 0, 560); c.closePath(); c.fill();
  c.fillStyle = 'rgba(255,240,220,0.35)'; for (let i = 0; i < 9; i++) c.fillRect(200 + (i % 3) * 14 - i * 2, 286 + i * 9, 50 - i * 4, 2);
  // the near bank: grass, a path of pebbles
  const gb = c.createLinearGradient(0, 548, 0, H); gb.addColorStop(0, '#8ac868'); gb.addColorStop(1, '#5a9a48'); c.fillStyle = gb;
  c.beginPath(); c.moveTo(0, 562); c.quadraticCurveTo(180, 582, W, 560); c.lineTo(W, H); c.lineTo(0, H); c.closePath(); c.fill();
  P.flowers(c, W, 590, 636, 16, ['#ffffff', '#ffe066', '#f4a8c8'], 3);
  // reeds and cattails at both sides
  for (const [x0, n, dir] of [[8, 7, 1], [338, 6, -1]]) for (let i = 0; i < n; i++) { const x = x0 + dir * i * 5, h = 60 + (i * 37 % 40), y = 300 + (i % 3) * 90 + 120;
    c.strokeStyle = i % 2 ? '#4a8a40' : '#5a9a48'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + dir * 6, y - h / 2, x + dir * 2, y - h); c.stroke();
    if (i % 2 === 0) { c.fillStyle = '#7a4a2a'; c.beginPath(); c.ellipse(x + dir * 2, y - h - 6, 3.5, 9, 0, 0, 7); c.fill(); } }
}
// a duckling seen from above, facing ang; red: a leftover that could not be shared
function duckling(c, x, y, s, ang, t, red, ph) {
  c.save(); c.translate(x, y); c.rotate(ang);
  c.fillStyle = 'rgba(20,60,70,0.25)'; c.beginPath(); c.ellipse(0, s * 0.35, s * 1.15, s * 0.7, 0, 0, 7); c.fill();
  const body = red ? '#ff8a72' : '#ffd84a', dark = red ? '#d0483a' : '#e8a82a';
  c.fillStyle = dark; c.beginPath(); c.ellipse(-s * 0.15, 0, s * 1.02, s * 0.82, 0, 0, 7); c.fill();
  c.fillStyle = body; c.beginPath(); c.ellipse(-s * 0.2, -s * 0.08, s * 0.9, s * 0.7, 0, 0, 7); c.fill();
  c.fillStyle = '#ff9a2e'; c.beginPath(); c.moveTo(s * 1.25, -s * 0.18); c.lineTo(s * 1.7, -s * 0.06); c.lineTo(s * 1.25, s * 0.12); c.fill();
  c.fillStyle = body; c.beginPath(); c.arc(s * 0.8, -s * 0.08, s * 0.55, 0, 7); c.fill();
  c.fillStyle = '#2a1a10'; c.beginPath(); c.arc(s * 0.98, -s * 0.3, Math.max(0.9, s * 0.13), 0, 7); c.fill();
  c.restore();
}

MG.add({
  id: 'numbers_prime', stage: 'numbers', cmd: 'PRIME OR NOT!', hint: 'drag', time: 10, mood: 'bright', winText: 'Tested!', hold: 1.6,
  card: {
    title: 'Prime numbers', ref: 'Grade 4', kind: 'Number theory',
    text: 'A prime number is a whole number bigger than 1 that cannot be shared into equal groups, except the dull way: 1 group, or groups of 1. Its only factors are 1 and itself.\n\nTo test a number, try sharing it into 2 equal groups, then 3, then 5, then 7. If one of them works with nothing left over, the number is not prime.\n\nFor example, 91 shared into 2, 3 or 5 groups always leaves some over. Shared into 7 groups, it gives 13 each with none left: 91 = 7 × 13, so 91 is not prime.\n\nYou can stop early: once a divisor times itself is bigger than the number, there is nothing left to try. For 91, 11 × 11 = 121 is already too big.',
    note: 'Try dividing by the primes 2, 3, 5, 7 … up to the square root. If none divides evenly, the number is prime.',
    ask: 'Is 51 prime? Is 53 prime?',
  },
  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g); const N = pick(g); S.N = N;
    S.tiles = PRIMES.filter(p => p * p <= N); S.tested = {}; S.verdict = null; S.pads = []; S.oldPads = []; S.face = 'happy';
    S.smallest = S.tiles.find(p => N % p === 0) || null; // the factor that settles it (null: prime)
    const need = S.smallest ? S.tiles.indexOf(S.smallest) + 1 : S.tiles.length;
    g.dur *= (2.6 + 1.05 * need) / 8;
    // ducklings start scattered about the pond
    const r = P.rng(N * 31 + 7), cols = Math.ceil(Math.sqrt(N * 2.1)), rows = Math.ceil(N / cols), cw = 280 / cols, ch = 150 / rows;
    S.ducks = []; for (let i = 0; i < N; i++) { const x = 40 + cw * ((i % cols) + 0.5) + (r() - 0.5) * cw * 0.6, y = 290 + ch * (Math.floor(i / cols) + 0.5) + (r() - 0.5) * ch * 0.5;
      S.ducks.push({ fx: x, fy: y, tx: x, ty: y, t0: -9, dur: 0.1, pad: -1, red: false, ph: r() * 7, ang: (r() - 0.5) * 0.8 + (r() < 0.5 ? Math.PI : 0) }); }
    // one size for every arrangement, so nothing jumps: the tightest pad packing decides it
    let cmin = 999; for (const d of S.tiles) { const p = padLayout(d)[0]; cmin = Math.min(cmin, p.r * 0.8 / Math.sqrt(Math.ceil(N / d))); }
    S.ds = Math.max(4.2, Math.min(7.5, cmin * 0.72, Math.sqrt(280 * 150 / N) * 0.3));
    // the sign: the number (it stays the same node, so it glides when the factors arrive)
    S.Nn = M.num(N, 'N'); S.setTop = items => { S.top = M.row(...items); S.top.id = 'topRow'; M.place(g, 'top', S.top, 180, 232, 50, { col: INK }); };
    S.setTop([S.Nn]); M.inert(g, ['topRow', 'noteRow', 'eq1', 'tx', 'fa', 'fb', 'n1', 'n2', 'n3', 'nq', 'nr', 'nE', 'nR']);
    const span = 300 / S.tiles.length; S.tiles.forEach((p, i) => M.place(g, 't' + p, M.row(M.num(p, 't' + p)), 30 + span * (i + 0.5), 525, 34, { col: '#2a4a1a' }));
    M.zone(g, 'pond', { x: 180, y: 361, w: 308, h: 182 });
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    const pos = (q, t) => { if (t <= q.t0) return [q.fx, q.fy, 0]; const k = M.clamp((t - q.t0) / q.dur, 0, 1), e = M.easeIO(k); return [M.lerp(q.fx, q.tx, e), M.lerp(q.fy, q.ty, e) - Math.sin(k * Math.PI) * 16, k]; };
    S.pos = pos;
    const sendAll = (g, targets, start, span, dur) => { // targets[i] = [x, y, pad]; ducks dealt in order of their x
      const order = S.ducks.map((q, i) => i).sort((a, b) => pos(S.ducks[a], g.t)[0] - pos(S.ducks[b], g.t)[0]);
      order.forEach((di, k) => { const q = S.ducks[di], [x, y] = pos(q, g.t + start + k * span / S.N), tg = targets[k]; q.fx = x; q.fy = y; q.tx = tg[0]; q.ty = tg[1]; q.pad = tg[2]; q.t0 = g.t + start + k * span / S.N; q.dur = dur; q.red = false; q.ang = Math.atan2(tg[1] - y, tg[0] - x); }); };
    // the sign row and stamp at the end
    const verdict = (g, prime, a, b) => {
      S.verdict = prime ? 'prime' : 'not'; const fa = M.num(a, 'fa', { alpha: 0 }), fb = M.num(b, 'fb', { alpha: 0 });
      S.setTop([S.Nn, M.op('=', 'eq1'), fa, M.op('×', 'tx'), fb]); g.sfx('swoosh');
      return [fa, fb];
    };
    const test = d => {
      const q = Math.floor(N / d), rem = N % d, rt = Math.min(0.8, 0.3 + N * 0.007) * T, deal = 0.18 * T, fly = 0.26 * T, askAt = deal + rt + fly + 0.1 * T;
      const last = !rem ? true : S.tiles.every(p => p === d || S.tested[p]);
      const after = rem ? (last ? 2.1 * T : 0.95 * T) : 1.6 * T;
      return { drag: 't' + d, to: ['N', 'pond'], area: [POND.x0, POND.y0, POND.x1, POND.y1], busy: 0.1, askAt, after,
        ask: { v: q, wrong: [q + 1, q - 1, N - d, q + 2].filter(v => v > 0) },
        then(g) {
          S.tested[d] = true; if (!rem) S.verdict = 'not'; else if (last) S.verdict = 'prime';
          M.show(g, askAt); hop(g, 'wow'); S.point = true; g.sfx('swoosh');
          M.circle(g, 't' + d, { dur: 0.45 * T, col: GOLD }); M.light(g, 't' + d, { col: '#c8500a' });
          // the old pads sink, the new ones open
          for (const p of S.pads) p.gone = g.t; S.oldPads = S.pads; S.pads = padLayout(d).map((p, i) => ({ ...p, born: g.t + 0.05 * T + i * 0.04 * T }));
          const tg = []; for (let k = 0; k < q * d; k++) { const pi = k % d, sl = Math.floor(k / d); tg.push([...slot(S.pads[pi], sl, q), pi]); }
          const P0 = S.pads[S.pads.length - 1], one = d <= 3;
          for (let k = 0; k < rem; k++) { const bx = one ? 180 + (k - (rem - 1) / 2) * S.ds * 2.8 : Math.min(318, P0.x + P0.r + 20 + (k % 2) * S.ds * 2.6), by = one ? 440 : P0.y - 14 + Math.floor(k / 2) * S.ds * 2.4; tg.push([bx, by, -1]); }
          sendAll(g, tg, deal, rt, fly); S.dealAt = g.t + deal; S.dealEnd = g.t + deal + rt + fly;
          S.note = M.row(M.num(N, 'n1'), M.op('÷', 'n2'), M.num(d, 'n3')); S.note.id = 'noteRow'; S.nk = 'note' + d; M.place(g, S.nk, S.note, 180, 478, 28, { col: NOTE }); M.writeIn(g, S.note, { dur: 0.35 * T, delay: 0.1 * T }); S.note.alpha = 0; M.tween(g, S.note, { alpha: 1 }, 0.12 * T, { delay: 0.06 * T });
          M.at(g, [[deal + rt * 0.5, g => g.sfx('tap')], [deal + rt + fly, g => { g.sfx('pop'); hop(g); for (const p of S.pads) p.pop = g.t; }]]);
        },
        resolve(g) {
          M.show(g, after); S.point = false;
          const qn = M.num(q, 'nq'); S.note.items.push(M.op('=', 'nE'), qn);
          if (rem) S.note.items.push(M.txt('r', 'nr', { col: RED }), M.num(rem, 'nR', { col: RED }));
          M.place(g, S.nk, S.note, 180, 478, 28, { col: NOTE }); M.writeIn(g, qn, { dur: 0.22 * T }); M.indicate(g, qn, { delay: 0.2 * T, dur: 0.3 * T });
          if (rem) {
            M.at(g, [
              [0.3 * T, g => { for (const q2 of S.ducks) if (q2.pad < 0) { q2.red = true; q2.splash = g.t; } S.leftAt = g.t; g.sfx('splash'); hop(g, 'think');
                M.writeIn(g, 'nr', { dur: 0.15 * T }); M.writeIn(g, 'nR', { dur: 0.15 * T, delay: 0.1 * T }); }],
              [0.6 * T, g => { M.strike(g, 't' + d, { dur: 0.2 * T, col: RED }); M.strike(g, S.note, { dur: 0.25 * T, col: RED }); M.unlight(g, 't' + d); M.tween(g, 't' + d, { alpha: 0.55 }, 0.2 * T); g.sfx('tap'); }],
              [0.85 * T, g => M.tween(g, S.note, { alpha: 0 }, 0.2 * T)],
            ]);
            if (last) M.at(g, [ // nothing worked: they all fit only as one group, so N is prime
              [1.05 * T, g => { for (const p of S.pads) p.gone = g.t; S.oldPads = S.pads; const big = { x: 180, y: 360, r: Math.min(84, 52 + N * 0.35), born: g.t }; S.pads = [big];
                const tg = []; for (let k = 0; k < N; k++) tg.push([...slot(big, k, N), 0]); sendAll(g, tg, 0.05, 0.45 * T, 0.24 * T); g.sfx('swoosh'); }],
              [1.6 * T, g => { const [fa, fb] = verdict(g, true, 1, N); M.writeIn(g, fa, { dur: 0.15 * T }); fa.alpha = 1; M.writeIn(g, fb, { dur: 0.25 * T, delay: 0.1 * T }); fb.alpha = 1; S.pads[0].pop = g.t; }],
              [1.85 * T, g => { S.stamp = { t0: g.t, txt: 'PRIME!', col: GREEN }; g.sfx('thud'); g.sfx('sparkle'); hop(g, 'laugh'); M.sparkle(g, [180, 360], { n: 18, cols: [GOLD, '#fff', '#9ae07a'] }); }],
            ]);
          } else M.at(g, [
            [0.3 * T, g => { S.ringAt = g.t; g.sfx('ding'); hop(g, 'laugh'); for (const p of S.pads) M.sparkle(g, [p.x, p.y], { n: 6 }); }],
            [0.75 * T, g => { const [fa, fb] = verdict(g, false, d, q), bd = M.box(g, 't' + d), bq = M.box(g, 'nq');
              M.fly(g, { node: M.num(d, null, { col: INK }), from: [bd.x, bd.y], to: 'fa', dur: 0.4 * T, arc: -50, s0: 34, s1: 50, then(g) { fa.alpha = 1; fa.pop = g.t; M.sparkle(g, 'fa', { n: 6 }); g.sfx('pop'); } });
              M.fly(g, { node: M.num(q, null, { col: INK }), from: [bq.x, bq.y], to: 'fb', delay: 0.08 * T, dur: 0.4 * T, arc: -50, s0: 28, s1: 50, then(g) { fb.alpha = 1; fb.pop = g.t; M.sparkle(g, 'fb', { n: 6 }); g.sfx('pop'); } });
              M.tween(g, S.note, { alpha: 0 }, 0.3 * T, { delay: 0.25 * T }); }],
            [1.3 * T, g => { S.stamp = { t0: g.t, txt: 'NOT PRIME', col: RED }; g.sfx('thud'); hop(g, 'laugh'); }],
          ]);
        } };
    };
    M.play(g, {
      moves(g) { if (S.verdict) return []; return S.tiles.filter(p => !S.tested[p]).map(test); },
      area(g) { const p = S.tiles.find(p => !S.tested[p]); return p ? ['t' + p, 'N'] : []; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, T = M.pace(g);
    c.drawImage(g.bake('prime_pond', pondArt), 0, 0, 360, 640);
    // ripples and drifting mist
    c.save(); for (let i = 0; i < 7; i++) { const k = ((t * 0.3 + i / 7) % 1), x = 50 + (i * 97) % 270, y = 300 + (i * 61) % 150; c.strokeStyle = `rgba(230,250,250,${0.35 * (1 - k)})`; c.lineWidth = 1.2; c.beginPath(); c.ellipse(x, y, 6 + k * 26, 2 + k * 8, 0, 0, 7); c.stroke(); }
    for (let i = 0; i < 3; i++) { const x = ((t * (8 + i * 3) + i * 150) % 520) - 100; c.fillStyle = 'rgba(255,245,240,0.22)'; c.beginPath(); c.ellipse(x, 262 + i * 10, 90, 9, 0, 0, 7); c.fill(); } c.restore();
    // lily pads: they open with a little swell and sink away
    const drawPad = (p, gone) => { const kb = M.clamp((t - p.born) / (0.25 * T), 0, 1), kg = gone != null ? 1 - M.clamp((t - gone) / (0.25 * T), 0, 1) : 1, sc = M.ease(kb) * kg; if (sc <= 0.01) return;
      const pop = p.pop != null && t - p.pop < 0.3 ? Math.sin((t - p.pop) / 0.3 * Math.PI) * 0.06 : 0, r = p.r * (sc + pop);
      c.save(); c.globalAlpha = kg; c.fillStyle = 'rgba(20,60,60,0.25)'; c.beginPath(); c.ellipse(p.x + 3, p.y + 5, r * 1.02, r * 0.95, 0, 0, 7); c.fill();
      const gr = c.createRadialGradient(p.x - r * 0.3, p.y - r * 0.3, 2, p.x, p.y, r); gr.addColorStop(0, '#9ad870'); gr.addColorStop(1, '#4a9a48'); c.fillStyle = gr;
      c.beginPath(); c.moveTo(p.x, p.y); c.arc(p.x, p.y, r, 0.15, Math.PI * 2 - 0.15); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(40,100,40,0.5)'; c.lineWidth = 1.2; for (let k = 0; k < 6; k++) { const a = 0.6 + k * 0.95; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x + Math.cos(a) * r * 0.85, p.y + Math.sin(a) * r * 0.85); c.stroke(); }
      if (S.ringAt && !gone && S.verdict === 'not') { const k = M.clamp((t - S.ringAt) / (0.4 * T), 0, 1); c.strokeStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 12; c.lineWidth = 4; c.beginPath(); c.arc(p.x, p.y, r + 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * M.easeIO(k)); c.stroke(); }
      c.restore(); };
    for (const p of S.oldPads) drawPad(p, p.gone); for (const p of S.pads) drawPad(p, p.gone);
    // the ducklings (their counts on each pad tick up as they land)
    const cnt = S.pads.map(() => 0);
    for (const q of S.ducks) { const [x, y, k] = S.pos(q, t), bob = Math.sin(t * 3 + q.ph) * 1.2, sp = q.splash != null && t - q.splash < 0.5 ? Math.abs(Math.sin((t - q.splash) * 18)) * 4 : 0, wig = q.red ? Math.sin(t * 9 + q.ph) * 0.35 : 0;
      if (q.pad >= 0 && k >= 1 && cnt[q.pad] != null) cnt[q.pad]++;
      const ang = k > 0 && k < 1 ? q.ang : (q.tx < 180 && q.pad < 0 && !q.red ? q.ang : 0.15 * Math.sin(t + q.ph));
      duckling(c, x, y + bob - sp, S.ds, ang + wig, t, q.red, q.ph);
      if (sp > 0) { c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y + S.ds, S.ds * 2 * (t - q.splash) / 0.5 + S.ds, S.ds * 0.6, 0, 0, 7); c.stroke(); } }
    if (S.dealAt != null && t > S.dealAt && S.pads.length > 1) S.pads.forEach((p, i) => { if (p.gone != null || !cnt[i]) return; const x = p.x + p.r * 0.72, y = p.y - p.r * 0.72;
      c.save(); c.fillStyle = 'rgba(30,40,20,0.3)'; c.beginPath(); c.arc(x + 1, y + 2, 13, 0, 7); c.fill(); c.fillStyle = S.ringAt && S.verdict === 'not' ? GOLD : '#fff8e0'; c.strokeStyle = '#6a5a2a'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, 13, 0, 7); c.fill(); c.stroke();
      c.fillStyle = INK; c.font = M.NUMF(15, 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(cnt[i], x, y + 1); c.restore(); });
    // the sign on the bank
    const tb = M.box(g, 'topRow'); const sw = Math.max(150, (tb ? tb.w : 80) + 50);
    c.save(); c.fillStyle = '#6a4424'; c.fillRect(176, 236, 8, 30); c.fillStyle = 'rgba(40,20,10,0.25)'; c.beginPath(); c.roundRect(180 - sw / 2 + 3, 186, sw, 66, 14); c.fill();
    const sg = c.createLinearGradient(0, 182, 0, 248); sg.addColorStop(0, '#fff6e4'); sg.addColorStop(1, '#f0dcb8'); c.fillStyle = sg; c.beginPath(); c.roundRect(180 - sw / 2, 182, sw, 66, 14); c.fill();
    c.strokeStyle = '#8a6a3a'; c.lineWidth = 3; c.stroke(); c.restore();
    M.drawEx(g, c, 'top');
    // the stamp thumps down on the corner of the sign
    if (S.stamp) { const k = M.clamp((t - S.stamp.t0) / 0.22, 0, 1), sc = 1 + (1 - M.ease(k)) * 0.8; c.save(); c.translate(258, 262); c.rotate(-0.12); c.scale(sc, sc); c.globalAlpha = Math.min(1, k * 2);
      c.font = M.NUMF(24, 700); const w = c.measureText(S.stamp.txt).width + 22; c.fillStyle = 'rgba(255,250,240,0.92)'; c.beginPath(); c.roundRect(-w / 2, -19, w, 38, 8); c.fill();
      c.strokeStyle = S.stamp.col; c.lineWidth = 3.5; c.stroke(); c.fillStyle = S.stamp.col; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(S.stamp.txt, 0, 2); c.restore(); }
    // the leaves with the divisors
    for (const p of S.tiles) { const b = M.box(g, 't' + p); if (!b) continue; const nd = M.node(g, 't' + p), al = nd && nd.alpha != null ? nd.alpha : 1, y = b.y + Math.sin(t * 1.8 + p) * 2;
      c.save(); c.globalAlpha = al; c.translate(b.x, y); c.rotate(Math.sin(t * 0.9 + p) * 0.08);
      c.fillStyle = 'rgba(20,60,50,0.3)'; c.beginPath(); c.ellipse(3, 5, 34, 23, 0, 0, 7); c.fill();
      const lg = c.createLinearGradient(0, -22, 0, 22); lg.addColorStop(0, '#c8ec8a'); lg.addColorStop(1, '#7ab84a'); c.fillStyle = lg;
      c.beginPath(); c.moveTo(-36, 0); c.quadraticCurveTo(-10, -30, 34, -4); c.quadraticCurveTo(38, 0, 34, 4); c.quadraticCurveTo(-10, 30, -36, 0); c.fill();
      c.strokeStyle = 'rgba(60,110,40,0.6)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-34, 0); c.lineTo(32, 0); c.stroke(); c.restore();
      M.drawEx(g, c, 't' + p); }
    // the working note at the pond's edge
    const nb = M.box(g, 'noteRow'); if (nb && S.note && (S.note.alpha ?? 1) > 0.02) { c.save(); c.globalAlpha = S.note.alpha ?? 1; c.fillStyle = 'rgba(20,60,70,0.55)'; c.beginPath(); c.roundRect(nb.x - nb.w / 2 - 12, nb.y - nb.h / 2 - 7, nb.w + 24, nb.h + 14, 12); c.fill(); c.restore(); }
    if (S.nk && S.note && (S.note.alpha ?? 1) > 0.02) M.drawEx(g, c, S.nk);
    // the mother duck and a drake on the near bank
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    try { if (typeof ANI !== 'undefined') { ANI.draw(c, 'duck', 62, 616 - hopK * 22, 1.3, { t, pose, expr }); ANI.draw(c, 'duck', 304, 610, 0.95, { t, phase: 1.5, facing: -1, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : 'happy', tint: '#e8e0d0' }); }
      else SCN.host(g, c, 'duck', 62, 616, 1.3); } catch (e) { SCN.host(g, c, 'duck', 62, 616, 1.3); }
    M.drawUI(g, c);
  },
});
