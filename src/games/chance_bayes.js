// chance_bayes.js — BAYES! P(sick | +) from a frequency tree: picture 1,000 penguins instead of percentages.
// A pink winter morning on the ice: a tree of snowball tags hangs over the snow. The top tag holds 1000 penguins. The sign
// asks P(sick | +) = ?, the chance that a penguin who tests positive is really sick. A penguin doctor watches.
// Moves: 1. Drag the sickness rate (10%) onto 1000 (or onto the empty "sick" tag): the rate and 1000 are circled, a
//           stream of tiny penguins pours down the sick branch, "10% × 1000 = 100" writes itself beside it and 100 drops
//           into the tag; then "1000 − 100 = 900" fills the healthy tag as the rest pour down the other branch.
//        2. Drag the test's hit rate (90%) onto the sick 100, and the false-alarm rate (10%) onto the healthy 900, in
//           either order: each pours its positives into a "+" tag ("90% × 100 = 90"), and the negatives drop greyed out.
//        3. Drag one "+" tag onto the other: the two groups of positives are circled, "90 + 90 = 180" writes itself, and
//           the answer forms in the sign as 90/180 (sick positives over all positives), then simplifies (÷ 90) to 1/2 = 50%.
//           Answering 90% (the test's hit rate) is the classic mistake; it is a wrong tile in medium mode.
// Level 0: answers 1/2 or 3/5 or 2/5. Level 1: 4/5, 1/4, 3/4. Level 2: 25% sick, answers 3/5 or 1/2 or 2/5.
const M = MK, SIGNY = 212, INK = '#3a2450', SICK = '#e8586a', POSC = '#e8405a', SNOW = '#f4f8ff';
const SETS = [[[10, 90, 10], [20, 60, 10], [10, 60, 10]], [[20, 80, 5], [10, 60, 20], [20, 60, 5]], [[25, 90, 20], [25, 60, 20], [20, 80, 20]]];
const NODES = { n0: [180, 300], c1: [96, 406], c2: [264, 406], l1: [46, 516], l2: [134, 516], l3: [226, 516], l4: [314, 516] };
const PAR = { c1: 'n0', c2: 'n0', l1: 'c1', l2: 'c1', l3: 'c2', l4: 'c2' };
function pick(g) {
  const L = Math.min(2, g.level), [rate, sens, fpr] = SETS[L][Math.floor(g.rand() * SETS[L].length)];
  const sick = 1000 * rate / 100, well = 1000 - sick, tp = sick * sens / 100, fp = well * fpr / 100, pos = tp + fp;
  const gcd = (a, b) => b ? gcd(b, a % b) : a, d = gcd(tp, pos);
  return { rate, sens, fpr, sick, well, tp, fn: sick - tp, fp, tn: well - fp, pos, an: tp / d, ad: pos / d, k: d, pct: Math.round(tp / pos * 100) };
}
function ice(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 470); [[0, '#7a8ad8'], [0.45, '#d8a8d8'], [0.8, '#ffd0c0'], [1, '#fff0e0']].forEach(([k, col]) => sk.addColorStop(k, col)); c.fillStyle = sk; c.fillRect(0, 0, W, 470);
  const sun = c.createRadialGradient(290, 420, 4, 290, 420, 160); sun.addColorStop(0, 'rgba(255,250,230,0.95)'); sun.addColorStop(0.2, 'rgba(255,230,210,0.45)'); sun.addColorStop(1, 'rgba(255,220,210,0)'); c.fillStyle = sun; c.fillRect(0, 260, W, 220);
  // far icebergs and snowy hills
  c.fillStyle = '#c8d0f0'; c.beginPath(); c.moveTo(0, 440); c.lineTo(40, 404); c.lineTo(66, 418); c.lineTo(104, 380); c.lineTo(150, 440); c.fill();
  c.fillStyle = '#d8def6'; c.beginPath(); c.moveTo(190, 444); c.lineTo(232, 410); c.lineTo(262, 424); c.lineTo(300, 398); c.lineTo(360, 440); c.fill();
  const gr = c.createLinearGradient(0, 430, 0, H); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.5, '#e6eefc'); gr.addColorStop(1, '#c4d2f0'); c.fillStyle = gr;
  c.beginPath(); c.moveTo(0, 446); c.bezierCurveTo(120, 432, 240, 452, W, 438); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  c.strokeStyle = 'rgba(150,170,220,0.35)'; c.lineWidth = 2; for (let i = 0; i < 6; i++) { const y = 540 + i * 18; c.beginPath(); c.moveTo(0, y); c.bezierCurveTo(120, y - 8, 240, y + 6, W, y - 4); c.stroke(); }
  // pines on the left
  for (const [x, y, s] of [[18, 450, 1], [44, 462, 0.8]]) { c.fillStyle = '#4a6a7a'; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(x, y - 70 * s + k * 18 * s); c.lineTo(x - (14 + k * 6) * s, y - 40 * s + k * 18 * s); c.lineTo(x + (14 + k * 6) * s, y - 40 * s + k * 18 * s); c.fill(); }
    c.fillStyle = '#fff'; c.beginPath(); c.moveTo(x, y - 70 * s); c.lineTo(x - 6 * s, y - 58 * s); c.lineTo(x + 6 * s, y - 58 * s); c.fill(); }
}
// a tiny penguin dot (for the streams)
function pd(c, x, y, sick, a) { c.save(); c.translate(x, y); c.scale(1.6, 1.6); c.translate(-x, -y); c.globalAlpha = a; c.fillStyle = '#2a2a40'; c.beginPath(); c.ellipse(x, y, 3, 4, 0, 0, 7); c.fill(); c.fillStyle = sick ? '#ffb8c0' : '#fff'; c.beginPath(); c.ellipse(x, y + 1, 1.8, 2.6, 0, 0, 7); c.fill(); c.fillStyle = '#ffa030'; c.fillRect(x - 0.8, y - 2.5, 1.6, 1); c.restore(); }

MG.add({
  id: 'bayes', stage: 'chance', cmd: 'BAYES!', hint: 'drag', time: 10, mood: 'night', winText: 'Not so sure!', hold: 1.9,
  card: {
    title: "Bayes' rule", ref: 'High school statistics', kind: 'Probability',
    text: "A medical test can be good and a positive result can still be likely wrong. Picture 1,000 people instead of percentages.\n\nSay 10% are sick: that is 100 sick and 900 healthy. The test catches 90% of the sick, so 90 sick people test positive. But it also gives a false alarm to 10% of the healthy, so 90 healthy people test positive too.\n\nOf the 180 positives, only 90 are sick. So P(sick | +) = 90 / 180 = 1/2. The bar | means \"given that\".\n\nThis is Bayes' rule: P(sick | +) = P(+ | sick) · P(sick) ÷ P(+). Mixing up P(sick | +) with P(+ | sick), the 90%, is a very common mistake.",
    note: 'P(A | B) = (number with A and B) ÷ (number with B). Count the true positives and divide by all the positives.',
    ask: '20% of 1,000 are sick; the test catches 80% of them and wrongly flags 5% of the healthy. What is P(sick | +)?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g);
    S.slot = {}; for (const k of Object.keys(NODES)) { S.slot[k] = k === 'n0' ? M.num(1000, 'n0') : M.slot(k, { w: k[0] === 'c' ? 58 : 50 }); M.place(g, k, S.slot[k], NODES[k][0], NODES[k][1] + 11, k[0] === 'l' ? 28 : 31, { col: INK }); }
    // the rates sit on their branches
    const mid = (a, b, off) => [(NODES[a][0] + NODES[b][0]) / 2 + off, (NODES[a][1] + NODES[b][1]) / 2 + 4];
    S.rate = { r1: { v: p.rate, at: mid('n0', 'c1', -26), from: 'n0', to: 'c1' }, r2: { v: p.sens, at: mid('c1', 'l1', -24), from: 'c1', to: 'l1' }, r3: { v: p.fpr, at: mid('c2', 'l3', -32), from: 'c2', to: 'l3' } };
    for (const [id, r] of Object.entries(S.rate)) { r.node = M.txt(r.v + '%', id); M.place(g, id, r.node, r.at[0], r.at[1] + 8, 22, { col: '#fff' }); }
    S.ans = M.slot('ans', { w: 60 }); S.top = M.row(M.vr('P', 'pP'), M.paren(M.row(M.txt('sick', 'psk'), M.txt(' | ', 'pbar'), M.op('+', 'ppl'))), M.op('=', 'peq'), S.ans);
    S.sz = 36; const relay = () => M.place(g, 'top', S.top, 180, SIGNY + 12, S.sz, { col: '#fff4dc' }); relay(); S.relay = relay;
    M.inert(g, ['pP', 'psk', 'pbar', 'ppl', 'peq', 'l2', 'l4', 'ans', 'fa', 'fb', 'fr', 'pc', 'pe']);
    S.streams = []; S.face = (g, e) => { S.ex = e; S.faceT = g.t; g.s.mk.lastMove = g.t; }; S.fillAt = {};
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const stream = (g, from, to, n, sick, dur) => { for (let i = 0; i < n; i++) S.streams.push({ a: NODES[from], b: NODES[to], t0: g.t + i * dur / n * 0.6, dur: dur * 0.5, sick, jit: (i * 37 % 11) - 5 }); };
    const fill = (g, k, v, grey) => { S.slot[k].fill = M.num(v, null, { pop: g.t, col: grey ? '#8a90b0' : INK }); M.relayout(g, k); S.fillAt[k] = g.t; g.burst(NODES[k][0], NODES[k][1], ['#fff', '#d8e4ff', grey ? '#c0c8e0' : '#ffd0d8'], 6, 70); };
    // one "rate × count" step: circle, stream, note, fill; then the rest drops down the other branch greyed or plain
    const step = (rid, base, prod, rest, restK, sickStream) => ({ busy: 0.1, askAt: 0.85 * T, after: 1.15 * T, ask: { v: prod, wrong: [rest, prod * 10, base - prod + (prod > 10 ? 10 : 1), S.rate[rid].v] },
      then(g) { const r = S.rate[rid]; r.done = g.t; M.show(g, 0.85 * T); S.face(g, 'think'); g.sfx('swoosh');
        M.circle(g, [rid, r.from], { dur: 0.5 * T, col: '#fff' }); M.indicate(g, rid, { dur: 0.4 * T, col: '#ffe070' });
        stream(g, r.from, r.to, 14, sickStream, 0.8 * T); g.sfx('whoosh');
        S.q = M.num(prod, 'nq', { alpha: 0 }); S.note = M.row(M.txt(r.v + '%', 'na'), M.op('×'), M.num(base), M.op('='), S.q);
        const nx = M.clamp(NODES[r.to][0] + (NODES[r.to][0] < 180 ? 60 : -60), 88, 272); M.place(g, 'note', S.note, nx, NODES[r.to][1] - 48, 26, { col: '#fff' }); M.writeIn(g, S.note, { delay: 0.2 * T, dur: 0.45 * T }); },
      resolve(g) { M.show(g, 1.15 * T); const r = S.rate[rid]; S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); g.sfx('ding');
        M.at(g, [[0.25 * T, g => { const bq = { ...M.box(g, 'nq') }; M.tween(g, S.note, { alpha: 0 }, 0.25 * T);
          M.fly(g, { node: M.num(prod, null, { col: '#fff4c0' }), from: [bq.x, bq.y], to: r.to, dur: 0.35 * T, arc: -20, s0: 22, s1: 26, then(g) { fill(g, r.to, prod); g.sfx('pop'); S.face(g, 'wow'); } }); }],
          [0.6 * T, g => { stream(g, r.from, restK, 10, rid === 'r1' ? false : rid === 'r2', 0.5 * T); delete g.s.mk.ex.note; if (g.s.mk.prevNodes) delete g.s.mk.prevNodes.note; }],
          [0.95 * T, g => { fill(g, restK, rest, rid !== 'r1'); g.sfx('tap'); }]]); } });
    M.play(g, {
      moves(g) {
        if (!S.rate.r1.done) { const mv = step('r1', 1000, p.sick, p.well, 'c2', true); return [{ drag: 'r1', to: ['n0', 'c1'], ...mv }]; }
        const out = [];
        if (!S.rate.r2.done) out.push({ drag: 'r2', to: ['c1', 'l1'], ...step('r2', p.sick, p.tp, p.fn, 'l2', true) });
        if (!S.rate.r3.done) out.push({ drag: 'r3', to: ['c2', 'l3'], ...step('r3', p.well, p.fp, p.tn, 'l4', false) });
        if (out.length) return out;
        if (!S.sumAt) { const go = { busy: 0.1, askAt: 1.9 * T, after: 1.3 * T, ask: { v: p.pct + '%', wrong: [p.sens + '%', p.rate + '%', (100 - p.pct) + '%'] },
          then(g) { S.sumAt = g.t; M.show(g, 1.9 * T); S.face(g, 'think'); g.sfx('swoosh'); M.circle(g, ['l1', 'l3'], { dur: 0.6 * T, col: POSC });
            S.arc = { t0: g.t + 0.1 * T, dur: 0.45 * T };
            S.q = M.num(p.pos, 'nq', { alpha: 0 }); S.note = M.row(M.num(p.tp), M.op('+'), M.num(p.fp), M.op('='), S.q);
            M.place(g, 'note', S.note, 136, 596, 26, { col: '#fff' }); M.writeIn(g, S.note, { delay: 0.3 * T, dur: 0.4 * T });
            M.at(g, [[0.8 * T, g => { S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); g.sfx('ding'); }],
              // the answer forms: sick positives over all positives
              [1.05 * T, g => { S.fa = M.num(p.tp, 'fa', { alpha: 0 }); S.fb = M.num(p.pos, 'fb', { alpha: 0 }); S.ans.fill = M.frac(S.fa, S.fb, 'fr', { bar: { t0: g.t, dur: 0.3 * T } }); relay(); g.sfx('swoosh');
                M.fly(g, { node: M.num(p.tp, null, { col: '#fff4c0' }), from: 'l1', to: 'fa', dur: 0.4 * T, arc: -40, s0: 24, s1: 26, then(g) { S.fa.alpha = 1; S.fa.pop = g.t; } });
                const bq = { ...M.box(g, 'nq') }; M.fly(g, { node: M.num(p.pos, null, { col: '#fff4c0' }), from: [bq.x, bq.y], to: 'fb', delay: 0.15 * T, dur: 0.4 * T, arc: -40, s0: 24, s1: 26, then(g) { S.fb.alpha = 1; S.fb.pop = g.t; g.sfx('pop'); } });
                M.tween(g, S.note, { alpha: 0 }, 0.3 * T, { delay: 0.3 * T }); }],
              [1.6 * T, g => { delete g.s.mk.ex.note; M.note(g, { node: M.row(M.op('÷'), M.num(p.k)), at: 'fr', off: [0, 58], s: 24, col: '#ffe9a0', write: 0.25 * T, hold: 0.6 * T, fade: 0.25 * T }); }]]); },
          resolve(g) { M.show(g, 1.3 * T); M.roll(g, S.fa, p.an, { dur: 0.35 * T }); M.roll(g, S.fb, p.ad, { dur: 0.35 * T, delay: 0.08 * T }); g.sfx('tap');
            M.at(g, [[0.5 * T, g => { S.top.items.push(M.op('=', 'pe'), M.gap(6), M.txt(p.pct + '%', 'pc', { col: '#ffe070', pop: g.t, sc: 1.2 })); S.sz = 30; relay(); M.sparkle(g, 'pc', { n: 14 }); g.sfx('coin'); S.face(g, 'laugh'); S.cheer = g.t; }]]); } };
          return [{ drag: 'l1', to: 'l3', ...go }, { drag: 'l3', to: 'l1', ...go }]; }
        return [];
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = S.mk, p = S.p, T = M.pace(g), E = M.easeIO;
    c.drawImage(g.bake('chance_bayes_ice', ice), 0, 0, 360, 640);
    for (let i = 0; i < 24; i++) { const x = (i * 53 + Math.sin(t * 0.8 + i) * 12 + 400) % 360, y = (t * (14 + i % 5 * 4) + i * 61) % 640; c.fillStyle = 'rgba(255,255,255,0.75)'; c.beginPath(); c.arc(x, y, 1.2 + (i % 3) * 0.6, 0, 7); c.fill(); }
    SCN.panel(c, 'sign', 180, SIGNY, 336, 80, t);
    // branches
    c.save(); c.lineCap = 'round';
    for (const [k, par] of Object.entries(PAR)) { const a = NODES[par], b = NODES[k], lit = S.fillAt[k], neg = k === 'l2' || k === 'l4';
      c.strokeStyle = 'rgba(70,60,120,0.35)'; c.lineWidth = 7; c.beginPath(); c.moveTo(a[0], a[1] + 14); c.lineTo(b[0], b[1] - 14); c.stroke();
      c.strokeStyle = lit ? (neg ? '#c8d0e8' : '#fff') : 'rgba(255,255,255,0.55)'; c.lineWidth = 3.5; c.setLineDash(lit ? [] : [6, 6]); c.beginPath(); c.moveTo(a[0], a[1] + 14); c.lineTo(b[0], b[1] - 14); c.stroke(); c.setLineDash([]); }
    c.restore();
    // the streams of tiny penguins
    S.streams = S.streams.filter(s => t < s.t0 + s.dur + 0.05);
    c.save(); for (const s of S.streams) { if (t < s.t0) continue; const k = M.clamp((t - s.t0) / s.dur, 0, 1), e = E(k), x = M.lerp(s.a[0], s.b[0], e) + s.jit * Math.sin(k * Math.PI), y = M.lerp(s.a[1] + 14, s.b[1] - 10, e) - Math.abs(Math.sin(k * 10)) * 3; pd(c, x, y, s.sick, k > 0.85 ? (1 - k) / 0.15 : 1); } c.restore();
    // the arc joining the two positive groups
    if (S.arc) { const k = E((t - S.arc.t0) / S.arc.dur), a = NODES.l1, b = NODES.l3; c.save(); c.strokeStyle = POSC; c.lineWidth = 3; c.shadowColor = POSC; c.shadowBlur = 8; c.beginPath();
      for (let i = 0; i <= 30 * k; i++) { const u = i / 30, x = M.lerp(a[0], b[0], u), y = a[1] + 24 + Math.sin(u * Math.PI) * 26; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore(); }
    // snowball tags behind each count
    const miss = K.missInfo && t - K.missAt < 0.6 ? (K.missInfo.tap || K.missInfo.to || K.missInfo.drag) : null;
    for (const [k, [x, y]] of Object.entries(NODES)) { const w = k === 'n0' ? 96 : k[0] === 'c' ? 82 : 72, h = k[0] === 'l' ? 44 : 48, sh = miss === k ? Math.sin((t - K.missAt) * 50) * 3 : 0, neg = k === 'l2' || k === 'l4', pos = k === 'l1' || k === 'l3';
      const fk = S.fillAt[k] != null ? M.clamp((t - S.fillAt[k]) / 0.3, 0, 1) : 0;
      c.save(); c.translate(sh, 0); c.fillStyle = 'rgba(60,50,110,0.25)'; c.beginPath(); c.roundRect(x - w / 2 + 2, y - h / 2 + 4, w, h, h / 2); c.fill();
      c.fillStyle = neg && fk ? '#e4e8f4' : SNOW; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, h / 2); c.fill(); c.strokeStyle = pos && fk ? POSC : k === 'c1' && fk ? SICK : 'rgba(120,130,190,0.6)'; c.lineWidth = pos && fk ? 3 : 2; c.stroke();
      // little labels: sick / healthy under the middle tags, + / − badges on the leaves
      c.font = M.NUMF(16, 600); c.textAlign = 'center';
      if (k === 'c1' || k === 'c2') { const lb = k === 'c1' ? 'sick' : 'healthy', lx = x, ly = y + h / 2 + 17; c.lineWidth = 4; c.lineJoin = 'round'; c.strokeStyle = 'rgba(255,255,255,0.85)'; c.strokeText(lb, lx, ly); c.fillStyle = k === 'c1' ? '#c83a50' : '#4a5a9a'; c.fillText(lb, lx, ly); c.textAlign = 'center'; }
      if (k[0] === 'l') { const bx = x + w / 2 - 4, by = y - h / 2 + 2; c.fillStyle = pos ? POSC : '#9aa0c0'; c.beginPath(); c.arc(bx, by, 9, 0, 7); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(bx - 4, by); c.lineTo(bx + 4, by); if (pos) { c.moveTo(bx, by - 4); c.lineTo(bx, by + 4); } c.stroke(); }
      c.restore(); M.drawEx(g, c, k); }
    // the rate tags on the branches
    for (const [id, r] of Object.entries(S.rate)) { const b = M.box(g, id); if (!b) continue; const sh = miss === id ? Math.sin((t - K.missAt) * 50) * 3 : 0, used = r.done != null && t - r.done > 0.6;
      c.save(); c.globalAlpha = used ? 0.55 : 1; c.fillStyle = used ? '#8a80b0' : '#6a4ab8'; c.beginPath(); c.roundRect(b.x - b.w / 2 - 8 + sh, b.y - b.h / 2 - 5, b.w + 16, b.h + 10, 10); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.stroke(); c.restore();
      if (!(K.press && K.press.dragging && K.press.id === id)) M.drawEx(g, c, id); }
    // the penguin doctor
    const hopK = K.lastMove != null && t - K.lastMove < 0.35 ? Math.sin((t - K.lastMove) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.ex : 'happy', pose = won ? 'cheer' : hopK > 0 ? 'hop' : M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'penguin', 318, 626 - hopK * 8, 0.9, { t, pose, expr, facing: -1, hold: c2 => { c2.fillStyle = '#fff'; c2.strokeStyle = '#c84050'; c2.lineWidth = 1.5; c2.beginPath(); c2.roundRect(-7, -9, 14, 18, 2); c2.fill(); c2.stroke(); c2.fillStyle = '#c84050'; c2.fillRect(-1.5, -6, 3, 9); c2.fillRect(-4.5, -3, 9, 3); } });
    else SCN.host(g, c, 'penguin', 318, 626, 0.9);
    M.drawEx(g, c, 'top');
    if (K.ex.note) { const e = K.ex.note, m = M.lay(e.node, e.s), wr = e.node.write, wk = wr ? E((t - wr.t0) / wr.dur) : 1; if (wk > 0) { c.save(); c.globalAlpha = (e.node.alpha ?? 1) * 0.6; c.fillStyle = 'rgba(60,40,110,0.9)'; c.beginPath(); c.roundRect(e.x - 10, e.y - m.a - 7, (m.w + 20) * wk, m.a + m.d + 14, 12); c.fill(); c.restore(); } }
    M.drawEx(g, c, 'note');
    M.drawUI(g, c);
  },
});
