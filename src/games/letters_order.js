// letters_order.js — ORDER OF OPS! Work out 3 + 4 × 2 − 6 ÷ 3 one operation at a time, in the right order:
// multiplication and division first, then addition and subtraction, each from left to right.
// A lantern garden at night. The expression hangs from a string between two poles: every number glows on a paper
// lantern and every operation sign on a small round light. The player taps the operation to do next, and the working
// plays by itself (show your work; the fuse stands still meanwhile):
//   the sign and its two numbers are circled and light up, "4 × 2 = ?" writes itself under them, the answer writes
//   itself in, the two lanterns slide together into the sign and fade, and the answer flies up onto a new lantern in
//   their place while the rest of the string closes up. The owl points at the work and hops when the answer lands.
// Valid moves: any × or ÷ that is the leftmost of its chain (in 4 × 2 − 6 ÷ 3 both may go first, since they don't touch;
// in 12 ÷ 3 × 2 the ÷ must come first); once no × or ÷ is left, the leftmost + or −. Tapping another sign is the classic
// mistake (3 + 4 first): a red "3 + 4" writes itself under it and is crossed out.
// Level 0: a + b × c or a − b × c (two taps). Level 1: three operations. Level 2: four operations.
// Medium mode: every tap opens the tray to pick that operation's result.
const M = MK;
const Y = 322, NOTEY = 398, INK = '#3a0f1e', GOLD = '#ffe08a', BADC = '#ff8a7a';
const LANT = ['#ff6a4a', '#ff9a3a', '#ff5a7a', '#f6b23a', '#ff7a5a'];
const SCRATCH = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 1; return cv.getContext('2d'); })();
const isMD = v => v === '×' || v === '÷';
const calc = (a, o, b) => o === '+' ? a + b : o === '−' ? a - b : o === '×' ? a * b : a / b;
const sagY = x => 202 + 26 * (1 - Math.pow((x - 180) / 186, 2)); // the string the lanterns hang from

// the operations that may be done next: a × or ÷ with no × or ÷ just to its left; otherwise the leftmost + or −
function validOps(toks) {
  const ops = toks.filter((_, i) => i % 2 === 1), md = ops.filter(q => isMD(q.v));
  if (md.length) return md.filter(q => { const l = toks[toks.indexOf(q) - 2]; return !l || !isMD(l.v); });
  return ops.slice(0, 1);
}
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), ri = (a, b) => a + r(b - a + 1);
  const T = L === 0 ? [['+', '×'], ['−', '×'], ['+', '÷']] : L === 1 ? [['+', '×', '−'], ['−', '÷', '+'], ['+', '×', '÷'], ['×', '+', '÷'], ['+', '÷', '×']] : [['+', '×', '−', '÷'], ['−', '×', '+', '÷'], ['÷', '×', '+', '×'], ['+', '÷', '×', '−'], ['×', '−', '÷', '+']];
  for (let n = 0; n < 4000; n++) {
    const ops = T[r(T.length)], vals = [];
    for (let i = 0; i <= ops.length; i++) {
      const prev = ops[i - 1], next = ops[i];
      vals.push(prev === '÷' ? ri(2, 4) : next === '÷' ? ri(2, L === 2 ? 24 : 18) : prev === '×' || next === '×' ? ri(2, L === 0 ? 6 : 7) : ri(1, L === 0 ? 20 : 15));
    }
    // play it in the right order and check every step is a whole number of sensible size
    let t = vals.flatMap((v, i) => i < ops.length ? [{ v }, { v: ops[i] }] : [{ v }]), ok = true;
    while (t.length > 1) { const o = validOps(t)[0], i = t.indexOf(o), v = calc(t[i - 1].v, o.v, t[i + 1].v); if (v < 0 || v !== Math.floor(v) || v > 60) { ok = false; break; } t.splice(i - 1, 3, { v }); }
    if (!ok) continue;
    // the order must matter: straight left to right would give a different answer
    let lr = vals[0]; ops.forEach((o, i) => { lr = calc(lr, o, vals[i + 1]); });
    if (lr === t[0].v || !fits(vals, ops)) continue;
    return { vals, ops };
  }
  return { vals: [3, 4, 2], ops: ['+', '×'] };
}
const GAP = 8, sizeOf = n => n >= 4 ? 40 : n === 3 ? 44 : 50;
const strip = toks => M.row(...toks.flatMap((q, i) => i ? [M.gap(GAP), q] : [q]));
// does the string of lanterns fit across the garden?
const fits = (vals, ops) => M.lay(strip(vals.flatMap((v, i) => i < ops.length ? [M.num(v), M.op(ops[i])] : [M.num(v)])), sizeOf(ops.length)).w + 16 <= 330;

// a paper lantern hanging at (x, y) (its centre); w, h = its size; k = how lit up it is (0..1)
function lantern(c, x, y, w, h, col, k, t, seed) {
  const top = y - h / 2, bot = y + h / 2;
  // glow
  c.save(); c.globalCompositeOperation = 'lighter';
  const R = w * (1.05 + k * 0.45), gr = c.createRadialGradient(x, y, 2, x, y, R); gr.addColorStop(0, P.rgba(col, 0.28 + k * 0.2)); gr.addColorStop(1, P.rgba(col, 0)); c.fillStyle = gr;
  c.beginPath(); c.arc(x, y, R, 0, 7); c.fill(); c.restore();
  // body
  const bg = c.createRadialGradient(x - w * 0.12, y - h * 0.08, 2, x, y, Math.max(w, h) * 0.62);
  bg.addColorStop(0, k > 0.3 ? '#fffbe8' : '#fff4d0'); bg.addColorStop(0.45, P.mix('#ffe0a0', col, 0.35)); bg.addColorStop(1, P.shade(col, -0.25));
  c.fillStyle = bg; c.beginPath(); c.ellipse(x, y, w / 2, h / 2, 0, 0, 7); c.fill();
  c.strokeStyle = P.rgba(P.shade(col, -0.5), 0.45); c.lineWidth = 1.2;
  for (const f of [-0.55, 0, 0.55]) { c.beginPath(); c.ellipse(x, y, Math.abs(f) * w / 2 + 0.01, h / 2, 0, f < 0 ? Math.PI / 2 : -Math.PI / 2, f < 0 ? Math.PI * 1.5 : Math.PI / 2); c.stroke(); }
  for (const f of [-0.3, 0.3]) { c.beginPath(); c.moveTo(x - w * 0.47 * Math.sqrt(1 - f * f * 4 * 0.9), y + f * h); c.lineTo(x + w * 0.47 * Math.sqrt(1 - f * f * 4 * 0.9), y + f * h); c.stroke(); }
  // caps and tassel
  c.fillStyle = '#3a1a22'; c.beginPath(); c.roundRect(x - w * 0.26, top - 3, w * 0.52, 6, 2); c.fill(); c.beginPath(); c.roundRect(x - w * 0.26, bot - 3, w * 0.52, 6, 2); c.fill();
  const sw = Math.sin(t * 2 + seed) * 2; c.strokeStyle = P.shade(col, -0.2); c.lineWidth = 2; c.beginPath(); c.moveTo(x, bot + 3); c.lineTo(x + sw, bot + 15); c.stroke();
  c.fillStyle = P.shade(col, -0.1); c.beginPath(); c.ellipse(x + sw, bot + 17, 2.5, 4, 0, 0, 7); c.fill();
}
// a small round paper light for an operation sign
function bulb(c, x, y, r, k, t) {
  c.save(); c.globalCompositeOperation = 'lighter'; const gr = c.createRadialGradient(x, y, 1, x, y, r * (2.2 + k)); gr.addColorStop(0, `rgba(255,240,200,${0.25 + k * 0.35})`); gr.addColorStop(1, 'rgba(255,240,200,0)'); c.fillStyle = gr; c.beginPath(); c.arc(x, y, r * (2.2 + k), 0, 7); c.fill(); c.restore();
  const bg = c.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r * 1.1); bg.addColorStop(0, '#fffdf2'); bg.addColorStop(0.7, k > 0.3 ? '#ffe9a8' : '#f4e4c4'); bg.addColorStop(1, '#c8a878');
  c.fillStyle = bg; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = 'rgba(120,80,50,0.45)'; c.lineWidth = 1; c.beginPath(); c.ellipse(x, y, r * 0.45, r, 0, 0, 7); c.stroke();
  c.fillStyle = '#3a1a22'; c.fillRect(x - 4, y - r - 3, 8, 4);
}

// the garden at night: indigo sky, moon, dark hills and trees, two poles for the string, a pond in front
function garden(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 480); sk.addColorStop(0, '#0a0722'); sk.addColorStop(0.5, '#1f1444'); sk.addColorStop(1, '#3e2358'); c.fillStyle = sk; c.fillRect(0, 0, W, 480);
  P.stars(c, W, 320, 90, 17, 0);
  const mg = c.createRadialGradient(306, 150, 4, 306, 150, 70); mg.addColorStop(0, 'rgba(255,240,210,0.45)'); mg.addColorStop(1, 'rgba(255,240,210,0)'); c.fillStyle = mg; c.fillRect(230, 80, 150, 150);
  c.fillStyle = '#fff4dc'; c.beginPath(); c.arc(306, 150, 17, 0, 7); c.fill(); c.fillStyle = 'rgba(220,200,170,0.5)'; c.beginPath(); c.arc(300, 146, 4, 0, 7); c.arc(311, 156, 3, 0, 7); c.fill();
  // far hills, a pagoda roof and round garden trees
  P.hills(c, W, 452, 34, '#2a1a48', '#1c1236', { seed: 5, dabs: 0 });
  c.fillStyle = '#160e2c'; const px = 270; c.fillRect(px - 9, 380, 18, 72);
  for (const [yy, w] of [[392, 40], [414, 34], [436, 30]]) { c.beginPath(); c.moveTo(px - w, yy + 6); c.quadraticCurveTo(px - w * 0.5, yy, px, yy - 8); c.quadraticCurveTo(px + w * 0.5, yy, px + w, yy + 6); c.lineTo(px + w * 0.7, yy + 8); c.lineTo(px - w * 0.7, yy + 8); c.closePath(); c.fill(); }
  c.fillRect(px - 1.5, 362, 3, 22);
  const R = P.rng(12); // (trees) for (let i = 0; i < 9; i++) { const x = R() * W, r = 22 + R() * 26; c.fillStyle = i % 2 ? '#1a1032' : '#140c28'; c.beginPath(); c.arc(x, 466 - r * 0.4, r, 0, 7); c.fill(); }
  // the pond
  const pg = c.createLinearGradient(0, 470, 0, H); pg.addColorStop(0, '#1e1a46'); pg.addColorStop(1, '#0c0a24'); c.fillStyle = pg; c.fillRect(0, 470, W, H - 470);
  c.fillStyle = 'rgba(255,240,210,0.18)'; for (let i = 0; i < 6; i++) c.fillRect(296 - 10 + R() * 20 - i * 2, 480 + i * 9, 20 + i * 4, 1.5); // the moon's reflection
  // near bank with reeds, and a mossy rock for the owl
  c.fillStyle = '#120a22'; c.beginPath(); c.moveTo(0, 560); c.quadraticCurveTo(70, 548, 130, 580); c.lineTo(130, H); c.lineTo(0, H); c.fill();
  c.beginPath(); c.moveTo(W, 586); c.quadraticCurveTo(300, 576, 250, 612); c.lineTo(250, H); c.lineTo(W, H); c.fill();
  c.strokeStyle = '#1e1436'; c.lineWidth = 2.5; for (let i = 0; i < 14; i++) { const x = 4 + R() * 120, h = 30 + R() * 40; c.beginPath(); c.moveTo(x, 590); c.quadraticCurveTo(x + 4, 590 - h / 2, x - 2 + R() * 8, 590 - h); c.stroke(); }
  c.fillStyle = '#2a2240'; c.beginPath(); c.ellipse(70, 612, 46, 18, 0, 0, 7); c.fill(); c.fillStyle = '#2e4a3a'; c.beginPath(); c.ellipse(64, 600, 34, 7, 0, Math.PI, 0); c.fill();
  // the two poles
  for (const x of [12, 348]) { const pgr = c.createLinearGradient(x - 5, 0, x + 5, 0); pgr.addColorStop(0, '#4a2a1c'); pgr.addColorStop(0.5, '#7a4a2c'); pgr.addColorStop(1, '#3a1e14'); c.fillStyle = pgr; c.fillRect(x - 5, 196, 10, 300); c.fillStyle = '#2a140c'; c.beginPath(); c.arc(x, 196, 7, 0, 7); c.fill(); }
}

MG.add({
  id: 'orderops', stage: 'letters', cmd: 'ORDER OF OPS!', hint: 'tap', time: 9, winText: 'In order!', hold: 1.7,
  card: {
    title: 'Order of operations', ref: 'Grade 5 and up', kind: 'Expressions',
    text: 'When an expression has several operations, everyone has to do them in the same order, or two people would get different answers.\n\nThe rule: first multiply and divide, working from left to right. Then add and subtract, again from left to right. (Anything in brackets comes before all of that.)\n\nFor example, 3 + 4 × 2 − 6 ÷ 3. First 4 × 2 = 8 and 6 ÷ 3 = 2, which leaves 3 + 8 − 2. Then 3 + 8 = 11, and 11 − 2 = 9.\n\nGoing straight from left to right would give 3 + 4 = 7, then 7 × 2 = 14, and a wrong answer.',
    note: 'Brackets first, then × and ÷ from left to right, then + and − from left to right.',
    ask: 'What is 5 + 3 × 4? What is 20 − 12 ÷ 4 × 2?',
  },

  init(g) {
    const S = g.s; M.setup(g); const pr = pick(g), T = M.pace(g); S.uid = 0;
    S.size = sizeOf(pr.ops.length); S.born = {};
    S.toks = []; pr.vals.forEach((v, i) => { S.toks.push(M.num(v, 'n' + (S.uid++))); if (i < pr.ops.length) S.toks.push(M.op(pr.ops[i], 'o' + (S.uid++))); });
    S.relay = () => { S.ex = strip(S.toks); M.place(g, 'ex', S.ex, 180, Y, S.size, { col: INK }); };
    S.relay(); S.seed = {};
    S.toks.forEach((n, i) => { S.seed[n.id] = i; });
    M.inert(g, S.toks.filter((_, i) => i % 2 === 0).map(n => n.id).concat(['qa', 'qo', 'qb', 'qe', 'q']));
    const hop = (e) => { g.s.mk.lastMove = g.t; S.face = e; S.faceT = g.t; };
    S.hop = hop;
    g.dur *= (3 + 1.2 * pr.ops.length) / 8;
    const askAt = 0.62 * T, after = 1.15 * T;
    const opMove = (o) => {
      const i = S.toks.indexOf(o), Ln = S.toks[i - 1], Rn = S.toks[i + 1], a = +Ln.v, b = +Rn.v, v = calc(a, o.v, b);
      const wrong = o.v === '×' ? [a + b, a * b + 1, a * b - b] : o.v === '÷' ? [a - b, a * b, v + 1] : o.v === '+' ? [a + b + 1, a + b - 1, Math.abs(a - b)] : [a + b, v + 1, Math.max(0, v - 1)];
      return { tap: o.id, busy: 0.1, askAt, after, ask: { v, wrong },
        then(g) {
          M.show(g, askAt); S.point = true; hop('think'); g.sfx('swoosh');
          M.circle(g, [Ln.id, o.id, Rn.id], { dur: 0.55 * T, col: GOLD, pad: 9 });
          for (const q of [Ln, o, Rn]) M.light(g, q, { dur: 0.2 * T, col: '#c0300a' });
          S.q = M.num(g.mode === 'medium' ? '?' : v, 'q', { alpha: 0 });
          S.note = M.row(M.num(a, 'qa'), M.op(o.v, 'qo'), M.num(b, 'qb'), M.op('=', 'qe'), S.q);
          const gb = M.unionBox([M.box(g, Ln.id), M.box(g, Rn.id)]), w = M.lay(S.note, 32).w;
          M.place(g, 'note', S.note, M.clamp(gb.x, 18 + w / 2, 342 - w / 2), NOTEY, 32, { col: GOLD });
          M.writeIn(g, S.note, { dur: 0.4 * T, delay: 0.18 * T });
          if (g.mode === 'medium') M.at(g, [[0.58 * T, g => { S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.1 }); }]]);
          S.work = { L: Ln, o, R: Rn, v, i };
        },
        resolve(g) {
          M.show(g, after); const W0 = S.work, q = S.q;
          if (g.mode === 'medium') M.roll(g, q, v, { dur: 0.22 * T }); else { q.alpha = 1; M.writeIn(g, q, { dur: 0.2 * T }); }
          M.indicate(g, q, { delay: 0.16 * T, dur: 0.3 * T, sc: 1.35 }); g.sfx('ding'); hop('wow');
          M.at(g, [
            // the two lanterns slide together into the sign and fade
            [0.3 * T, g => { const cb = M.box(g, W0.o.id); for (const nd of [W0.L, W0.o, W0.R]) { const b = M.box(g, nd.id); M.tween(g, nd, { dx: cb.x - b.x, alpha: 0, sc: 0.5 }, 0.3 * T); } g.sfx('whoosh'); }],
            // one new lantern takes their place, and the answer flies up onto it
            [0.56 * T, g => {
              const nv = M.num(v, 'n' + (S.uid++), { alpha: 0, _born: -1 }); S.seed[nv.id] = S.uid; S.born[nv.id] = g.t; S.toks.splice(W0.i - 1, 3, nv); S.relay(); M.inert(g, [nv.id]);
              const from = { ...M.box(g, 'q') }; M.tween(g, S.note, { alpha: 0 }, 0.28 * T);
              M.fly(g, { node: M.num(v, null, { col: GOLD }), from: [from.x, from.y], to: nv.id, dur: 0.34 * T, arc: -26, s0: 32, s1: S.size,
                then(g) { nv.alpha = 1; nv.pop = g.t; M.sparkle(g, nv.id, { n: 12, cols: ['#ffe08a', '#fff', '#ff9a5a'] }); g.sfx('pop'); hop('laugh'); if (S.toks.length === 1) S.point = false; } });
            }],
            [after - 0.04, g => { delete g.s.mk.ex.note; }],
          ]);
        } };
    };
    M.play(g, {
      moves(g) { return S.toks.length > 1 ? validOps(S.toks).map(opMove) : []; },
      area(g) { const v = validOps(S.toks)[0]; if (!v) return null; const i = S.toks.indexOf(v); return [S.toks[i - 1].id, v.id, S.toks[i + 1].id]; },
      onWin(g) { const n = S.toks[0]; if (n) { n.pop = g.t; S.wonLit = true; M.sparkle(g, n.id, { n: 16, cols: ['#ffe08a', '#fff', '#7ae08a'] }); } },
    });
  },
  update(g, dt) {
    const S = g.s, K = S.mk; M.update(g, dt);
    // the classic mistake acted out: the wrong sign's sum writes itself in red under it and is crossed out
    if (K.missAt >= 0 && K.missAt !== S.seenMiss) { S.seenMiss = K.missAt; S.face = 'sad'; S.faceT = g.t;
      const id = K.missInfo && K.missInfo.tap, o = S.toks.find(q => q.id === id);
      if (o) { const i = S.toks.indexOf(o), a = S.toks[i - 1], b = S.toks[i + 1];
        const nd = M.row(M.num(a.v), M.op(o.v), M.num(b.v)); nd.strike = { t0: g.t + 0.3, dur: 0.2, col: '#ff5a4a' };
        M.note(g, { node: nd, at: id, off: [0, 72], s: 28, col: BADC, write: 0.25, hold: 0.35, fade: 0.25 }); } }
  },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('letters_order_garden', garden), 0, 0, W, H);
    // fireflies drifting over the pond
    for (let i = 0; i < 16; i++) { const x = (i * 53 + Math.sin(t * 0.6 + i) * 24 + 400) % 360, y = 430 + (i * 37) % 150 + Math.cos(t * 0.8 + i * 2) * 10, a = 0.3 + 0.6 * Math.abs(Math.sin(t * 1.7 + i)); c.fillStyle = `rgba(230,255,150,${a})`; c.beginPath(); c.arc(x, y, 2, 0, 7); c.fill(); }
    // the string
    c.strokeStyle = 'rgba(40,20,20,0.9)'; c.lineWidth = 2; c.beginPath(); for (let x = 12; x <= 348; x += 8) { const y = sagY(x); x === 12 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
    // lanterns behind every number and sign; they follow the symbols as they glide and merge (a first pass into a
    // scratch canvas brings each symbol's glide offset up to date before the lanterns are placed)
    M.drawEx(g, SCRATCH, 'ex');
    const pos = n => { const b = M.box(g, n.id); if (!b) return null; const pk = n.pop != null ? M.clamp((t - n.pop) / 0.35, 0, 1) : 1; return { x: b.x + (n._ax || 0) + (n.dx || 0), y: b.y + (n._ay || 0) + (n.dy || 0), sc: (1 + Math.sin(pk * Math.PI) * 0.3) * (n.sc ?? 1), a: n.alpha ?? 1, k: n.hl || 0 }; };
    for (const n of S.toks) {
      n.dy = Math.sin(t * 1.6 + (S.seed[n.id] || 0) * 1.3) * 2.2; // a gentle sway in the night air
      const p = pos(n); if (!p) continue; const isNum = n.k === 'num';
      // a new lantern swings in at once; its number flies onto it a moment later
      const la = S.born[n.id] != null ? Math.min(1, (t - S.born[n.id]) / 0.2) : p.a; if (la <= 0.01) continue;
      c.save(); c.globalAlpha = la;
      const LH = S.size * 1.25, top = p.y - (isNum ? LH / 2 + 2 : S.size * 0.3 + 2) * p.sc; c.strokeStyle = 'rgba(30,14,14,0.85)'; c.lineWidth = 1.3; c.beginPath(); c.moveTo(p.x, sagY(p.x)); c.lineTo(p.x, top); c.stroke();
      c.translate(p.x, p.y); c.scale(p.sc, p.sc);
      if (isNum) { const b = M.box(g, n.id), w = Math.max(S.size * 0.8, b.w + 14); lantern(c, 0, 0, S.wonLit ? w + 4 : w, LH, n.mark === 'bad' ? '#ff3a3a' : S.wonLit ? '#ffc23a' : LANT[(S.seed[n.id] || 0) % LANT.length], p.k, t, S.seed[n.id] || 0); }
      else bulb(c, 0, 0, S.size * 0.3, p.k, t);
      c.restore();
    }
    M.drawEx(g, c, 'ex');
    // the owl on its mossy rock
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', 70, 604 - hopK * 22, 1.3, { t, pose, expr, facing: 1 }); else SCN.host(g, c, 'owl', 70, 604, 1.3);
    // lantern light on the water
    c.save(); c.globalCompositeOperation = 'lighter';
    for (const n of S.toks) { if (n.k !== 'num' || (n.alpha ?? 1) < 0.1) continue; const b = M.box(g, n.id); if (!b) continue; const x = b.x + (n._ax || 0) + Math.sin(t * 2 + b.x) * 3;
      const gr = c.createRadialGradient(x, 520, 1, x, 520, 22); gr.addColorStop(0, 'rgba(255,160,90,0.28)'); gr.addColorStop(1, 'rgba(255,160,90,0)'); c.fillStyle = gr; c.fillRect(x - 24, 500, 48, 40);
      c.fillStyle = 'rgba(255,190,120,0.35)'; for (let k = 0; k < 3; k++) c.fillRect(x - 8 + Math.sin(t * 3 + k + b.x) * 3, 508 + k * 9, 16 - k * 3, 1.5); }
    c.restore();
    M.drawEx(g, c, 'note');
    M.drawUI(g, c);
  },
});
