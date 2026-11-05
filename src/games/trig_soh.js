// trig_soh.js — SOH CAH TOA! Find a side of a right triangle from an angle and one other side.
// A windy hillside at noon. A fox flies a kite: the string is the hypotenuse, the kite's height above the ground is the
// side opposite the angle at the peg, and the ground to the point under the kite is the adjacent side. Across the sky hang
// the three ratios as little paper cards, the key: sin θ = O/H, cos θ = A/H, tan θ = O/A.
// Moves (show your work: each plays its working by itself while the fuse stands still):
//   1. Tap the angle at the peg: it is circled, then the sides are named one after another: a dashed arrow runs from the
//      angle across to the opposite side, which glows coral and gets an "O" badge; the adjacent side glows teal ("A"),
//      the string glows violet ("H"); the same letters on the cards light up in those colours.
//   2. Drag the card that links the known side and x onto the angle (or anywhere on the triangle): the other cards blow
//      away, the chosen card glides to the middle, θ becomes the angle (flying from the peg), and the letters become the
//      side lengths (flying from the triangle): sin 30° = x/10.
//   3. Tap the equation: "sin 30° = ½" writes itself under it and ½ flies in, then "x = 10 × ½" writes itself; x is
//      found, and on the triangle a gold copy of the known side swings onto the unknown one, shrinking (or growing) to fit.
// Level 0: sin 30° with the string known. Level 1: sin 30°, cos 60°, tan 45°. Level 2: also the string unknown.
// Medium mode: x is picked from the tray. Wrong moves: dragging a card that uses the wrong sides (it only wobbles).
const M = MK, INK = '#2a2a52', OC = '#f0604a', AC = '#1aa39a', HC = '#8a5ad8', GOLD = '#ffc23a', NOTE = '#fff6e6', EQY = 226, GY = 488, HX = 44, HY = 540;
const RAT = { S: ['sin', 'O', 'H'], C: ['cos', 'A', 'H'], T: ['tan', 'O', 'A'] };
function pick(g) {
  const L = g.level, r = k => Math.floor(g.rand() * k), ev = [6, 8, 10, 12][r(4)], sm = [3, 4, 5, 6][r(4)];
  const types = L === 0 ? ['sinO'] : L === 1 ? ['sinO', 'cosA', 'tanO'] : ['sinO', 'cosA', 'tanO', 'sinH', 'cosH'], ty = types[r(types.length)];
  // which ratio, the angle, the known side and its length, the unknown side and its length
  if (ty === 'sinO') return { key: 'S', deg: 30, kn: 'H', kv: ev, un: 'O', x: ev / 2 };
  if (ty === 'cosA') return { key: 'C', deg: 60, kn: 'H', kv: ev, un: 'A', x: ev / 2 };
  if (ty === 'tanO') return { key: 'T', deg: 45, kn: 'A', kv: sm + 2, un: 'O', x: sm + 2 };
  if (ty === 'sinH') return { key: 'S', deg: 30, kn: 'O', kv: sm, un: 'H', x: 2 * sm };
  return { key: 'C', deg: 60, kn: 'A', kv: sm, un: 'H', x: 2 * sm };
}
const VAL = deg => deg === 45 ? M.num(1) : M.frac(M.num(1), M.num(2)); // sin 30° = cos 60° = ½, tan 45° = 1
const kk = (g, a) => a ? M.clamp((g.t - a.t0) / a.dur, 0, 1) : 0;
function put(g, c, n, cx, cy, s, col, alpha = 1) { const m = M.lay(n, s); c.save(); c.globalAlpha *= alpha; M.draw(c, n, cx - m.w / 2, cy + (m.a - m.d) / 2, s, { t: g.t, col }); c.restore(); }
function badge(g, c, letter, x, y, col, k) { if (k <= 0) return; const r = 12 * (1 + Math.sin(Math.min(1, k) * Math.PI) * 0.5); c.save(); c.globalAlpha *= Math.min(1, k * 3); c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 2; c.stroke(); c.restore(); put(g, c, M.txt(letter), x, y + 0.5, 16, '#fff', Math.min(1, k * 3)); }
function tagv(g, c, n, x, y, s, col, alpha = 1) { const m = M.lay(n, s); x = M.clamp(x, m.w / 2 + 10, 350 - m.w / 2); c.save(); c.globalAlpha *= alpha; c.fillStyle = 'rgba(255,255,255,0.88)'; c.beginPath(); c.roundRect(x - m.w / 2 - 6, y - (m.a + m.d) / 2 - 4, m.w + 12, m.a + m.d + 8, 9); c.fill(); c.restore(); put(g, c, n, x, y, s, col, alpha); }

MG.add({
  id: 'soh_cah_toa', stage: 'trig', cmd: 'SOH CAH TOA!', hint: 'drag', time: 10, winText: 'Sky high!', hold: 1.8,
  card: {
    title: 'Sine, cosine and tangent', ref: 'Geometry', kind: 'Trigonometry',
    text: 'In a right triangle, pick one of the sharp angles and call it θ. The longest side is the hypotenuse (H). The side across from θ is the opposite side (O). The side next to θ is the adjacent side (A).\n\nFor a given angle, the ratios of the sides are always the same, however big the triangle is. They have names: sin θ = O/H, cos θ = A/H, tan θ = O/A. SOH CAH TOA helps you remember them.\n\nA kite on a 10 m string at 30° is how high? Use sin, because it links O and H: sin 30° = x/10. Since sin 30° = ½, x = 10 × ½ = 5 m.',
    note: 'SOH CAH TOA: sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent. Pick the one with the side you know and the side you want.',
    ask: 'A ramp is 12 m long and rises at 30°. How high does it go? (sin 30° = ½)',
  },

  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g), th = p.deg * Math.PI / 180;
    // the triangle: the peg (angle), the point under the kite (right angle), the kite
    const Lh = Math.min(250, 190 / Math.sin(th), 236 / Math.cos(th)), ap = Lh * Math.cos(th), op = Lh * Math.sin(th), x0 = 180 - ap / 2 + 4;
    S.V = { P: [x0, GY], R: [x0 + ap, GY], K: [x0 + ap, GY - op] };
    S.sides = { O: ['R', 'K'], A: ['P', 'R'], H: ['P', 'K'] };
    S.len = { [p.kn]: p.kv, [p.un]: 'x' };
    M.zone(g, 'ang', { x: x0 + 26, y: GY - 14, w: 60, h: 48 });
    // the three ratio cards, in one expression so the chosen one glides when the others leave
    S.cards = {}; S.lt = {};
    for (const k of ['S', 'C', 'T']) { const [fn, a, b] = RAT[k];
      const na = M.vr(a, 'n' + k), nb = M.vr(b, 'd' + k); S.lt[k] = [na, nb];
      const th0 = M.vr('θ', 'h' + k), fr = M.frac(na, nb, 'q' + k);
      S.cards[k] = { row: M.row(M.txt(fn, 'f' + k), M.gap(5), th0, M.op('='), fr), th: th0, fr }; S.cards[k].row.id = 'c' + k; }
    S.list = ['S', 'C', 'T'];
    S.relay = () => { const items = []; S.list.forEach((k, i) => { if (i) items.push(M.gap(18)); items.push(S.cards[k].row); }); M.place(g, 'cards', M.row(items), 180, EQY, S.fs, { col: INK }); };
    const wide = M.lay(M.row(...['S', 'C', 'T'].map(k => M.row(M.txt(RAT[k][0]), M.gap(5), M.vr('θ'), M.op('='), M.frac(M.vr('O'), M.vr('H')))), M.gap(36)), 30).w;
    S.fs = Math.min(30, 30 * 318 / wide);
    S.relay(); M.inert(g, ['nt', 'xa']);
    S.face = 'happy'; S.faceT = -9; S.hopT = -9; S.point = false;
    const hop = (g, e) => { S.hopT = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    S.glow = {}; S.badge = {};
    g.dur *= (2.6 + 1.05 * 3) / 8;
    const mid = s => { const [a, b] = S.sides[s].map(v => S.V[v]); return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
    S.mid = mid;
    // where each side's label sits: outside the triangle
    S.lpos = s => { const [mx, my] = mid(s); return s === 'O' ? [mx + 26, my] : s === 'A' ? [mx, my + 24] : [mx - 22 * Math.sin(th) - 4, my - 22 * Math.cos(th) - 4]; };
    S.bpos = s => { const [mx, my] = mid(s); return s === 'O' ? [mx + 26, my - 30] : s === 'A' ? [mx + 46, my + 24] : [mx - 22 * Math.sin(th) - 30, my - 22 * Math.cos(th) - 22]; };
    const noteAt = (g, node, y) => { node.id = 'nt'; M.place(g, 'note', node, 180, y, 24, { col: NOTE }); M.writeIn(g, node, { dur: 0.4 * T, delay: 0.05 * T }); };
    const noteOff = (g, d) => { const e = g.s.mk.ex.note; if (!e) return; M.tween(g, e.node, { alpha: 0 }, 0.25 * T, { delay: d });
      M.at(g, [[d + 0.3 * T, g => { if (g.s.mk.ex.note && g.s.mk.ex.note.node === e.node) { delete g.s.mk.ex.note; if (g.s.mk.prevNodes) delete g.s.mk.prevNodes.note; } }]]); };
    const COL = { O: OC, A: AC, H: HC };
    M.play(g, {
      moves(g) {
        const out = [];
        // 1. name the sides from the angle
        if (!S.named) out.push({ tap: 'ang', busy: 0.1,
          then(g) { S.named = true; M.show(g, 1.35 * T); S.point = true; hop(g, 'think'); M.circle(g, 'ang', { col: GOLD, dur: 0.45 * T }); S.angT = g.t;
            M.arrow(g, 'ang', [S.mid('O')[0] - 8, S.mid('O')[1]], { col: OC, bend: 30, dur: 0.4 * T, delay: 0.2 * T, linger: 0.4 });
            ['O', 'A', 'H'].forEach((s, i) => M.at(g, [[(0.5 + 0.3 * i) * T, g => { S.glow[s] = g.t; S.badge[s] = g.t; g.sfx('tap'); hop(g);
              for (const k of ['S', 'C', 'T']) for (const n of S.lt[k]) if (n.v === s) { n.col = COL[s]; M.indicate(g, n, { col: COL[s], dur: 0.35 * T }); } }]]));
            M.at(g, [[1.3 * T, g => { S.point = false; }]]); } });
        // 2. drag the right card onto the angle
        else if (!S.chosen) { const k = p.key, X = [S.V.P[0] - 30, S.V.K[1] - 30, S.V.R[0] + 40, GY + 30];
          out.push({ drag: ['c' + k, 'f' + k, 'h' + k, 'n' + k, 'd' + k, 'q' + k], to: 'ang', area: X, busy: 0.1,
            then(g) { S.chosen = true; M.show(g, 1.5 * T); S.point = true; hop(g, 'think'); g.sfx('whoosh'); const C = S.cards[k];
              for (const o of ['S', 'C', 'T']) if (o !== k) { M.tween(g, S.cards[o].row, { alpha: 0, dy: -30, sc: 0.7 }, 0.3 * T); }
              M.at(g, [[0.3 * T, g => { for (const o of ['S', 'C', 'T']) if (o !== k) (function hide(n) { if (!n) return; n.alpha = 0; for (const ch of [n.n, n.d, ...(n.items || [])]) hide(ch); })(S.cards[o].row); S.list = [k]; S.relay(); g.sfx('swoosh'); }], // faded cards leave no ghosts
                [0.6 * T, g => { const a = M.box(g, 'ang'); C.deg = M.txt(p.deg + '°', 'dg', { alpha: 0 });
                  M.fly(g, { node: M.txt(p.deg + '°'), from: [a.x + 12, a.y - 6], to: 'h' + k, dur: 0.4 * T, arc: -60, s0: 20, s1: S.fs, col: GOLD,
                    then(g) { C.th.alpha = 0; C.row.items[2] = C.deg; C.deg.alpha = 1; C.deg.pop = g.t; S.relay(); g.sfx('pop'); } }); }],
                [0.85 * T, g => { // the side letters become lengths, flying from the triangle
                  const [na, nb] = S.lt[k]; [na, nb].forEach((n, i) => { const s = n.v, v = S.len[s]; if (v == null) return; const lp = S.lpos(s), id = n.id;
                    const nn = v === 'x' ? M.vr('x', 'xv', { alpha: 0 }) : M.num(v, 'k' + i, { alpha: 0 });
                    M.fly(g, { node: v === 'x' ? M.vr('x') : M.num(v), from: lp, to: id, delay: i * 0.12 * T, dur: 0.4 * T, arc: -50, s0: 20, s1: S.fs * 0.82, col: COL[s],
                      then(g) { if (i === 0) C.fr.n = nn; else C.fr.d = nn; nn.alpha = 1; nn.pop = g.t; S.relay(); g.sfx('pop'); M.sparkle(g, nn.id, { n: 6, cols: [COL[s], '#fff'] }); } }); }); }],
                [1.45 * T, g => { hop(g, 'laugh'); S.point = false; }]]); } }); }
        // 3. solve for x
        else if (!S.solved) { const k = p.key, C = S.cards[k], half = p.deg !== 45, mul = p.un !== 'H';
          const step = M.row(M.vr('x'), M.op('='), M.num(p.kv), M.op(mul ? '×' : '÷'), half ? M.frac(M.num(1), M.num(2)) : M.num(1));
          out.push({ tap: ['c' + k, 'xv', 'k0', 'k1', 'dg', 'q' + k, 'f' + k, 'vv'], busy: 0.1, askAt: 1.2 * T, after: 1.35 * T,
            ask: { v: p.x, wrong: [mul ? p.kv * 2 : p.kv / 2, p.kv, p.x + 1, half ? p.x * 4 : p.x * 2].filter(v => v !== p.x && Number.isInteger(v)) },
            then(g) { S.solved = true; M.show(g, 1.2 * T); S.point = true; hop(g, 'think'); M.circle(g, ['f' + k, 'dg'], { col: GOLD, dur: 0.45 * T });
              noteAt(g, M.row(M.txt(RAT[k][0]), M.gap(5), M.txt(p.deg + '°'), M.op('='), VAL(p.deg)), EQY + 52);
              M.at(g, [[0.5 * T, g => { // the value flies up into the equation in place of sin 30°
                  const v = M.row(VAL(p.deg)); v.id = 'vv'; v.alpha = 0; const fb = M.box(g, 'nt');
                  M.fly(g, { node: VAL(p.deg), from: [fb.x + fb.w / 2 - 14, fb.y], to: 'f' + k, dur: 0.35 * T, arc: -30, s0: 24, s1: S.fs, col: GOLD,
                    then(g) { C.row.items = [v, M.op('='), C.fr]; v.alpha = 1; v.pop = g.t; S.relay(); g.sfx('pop'); } });
                  noteOff(g, 0.05 * T); }],
                [0.95 * T, g => { noteAt(g, step, EQY + 56); hop(g); }]]); },
            resolve(g) { M.show(g, 1.35 * T); g.sfx('ding');
              const xv = M.node(g, 'xv') || M.vr('x', 'xv'), ans = M.num(p.x, 'xa', { col: GOLD, _born: -1, alpha: 0 });
              M.at(g, [[0.15 * T, g => { const fb = M.box(g, 'nt'); noteOff(g, 0.1 * T);
                  for (const q of C.row.items) if (q !== C.fr) M.tween(g, q, { alpha: 0 }, 0.2 * T);
                  C.row.items = [xv, M.op('='), ans]; C.row.items[1].alpha = 0; M.tween(g, C.row.items[1], { alpha: 1 }, 0.2 * T, { delay: 0.15 * T }); S.relay();
                  M.fly(g, { node: M.num(p.x), from: [fb.x + fb.w / 2, fb.y], to: 'xa', dur: 0.35 * T, arc: -40, s0: 24, s1: S.fs, col: GOLD, then(g) { ans.alpha = 1; ans.pop = g.t; M.sparkle(g, 'xa', { n: 10 }); g.sfx('pop'); } }); }],
                [0.35 * T, g => { S.swing = { t0: g.t, dur: 0.7 * T }; g.sfx('sweep'); }],
                [1.05 * T, g => { S.found = g.t; S.glow[p.un] = g.t; hop(g, 'laugh'); const lp = S.lpos(p.un); g.burst(lp[0], lp[1], [GOLD, '#fff', COL[p.un]], 14, 140); g.sfx('coin'); S.point = false; }]]); } }); }
        return out;
      },
      area(g) { return !S.named ? ['ang'] : !S.chosen ? ['c' + p.key, 'ang'] : ['c' + p.key]; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, p = S.p, V = S.V, COL = { O: OC, A: AC, H: HC };
    c.drawImage(g.bake('soh_bg', (cc, W, H) => paintBg(cc, W, H)), 0, 0, 360, 640);
    ambient(c, t);
    // white cards behind the ratios (the paper kites of the key), then the cards
    const cb = M.box(g, 'cards');
    for (const k of S.list) { const C = S.cards[k], b = M.box(g, 'c' + k); if (!b) continue; const al = C.row.alpha ?? 1; if (al <= 0) continue;
      // the backing follows the card when it glides to the middle (the same ease and length as the kit's glide)
      const lb = (S.lastB = S.lastB || {})[k]; if (lb && (Math.abs(lb.x - b.x) > 1.5 || Math.abs(lb.y - b.y) > 1.5)) (S.bgl = S.bgl || {})[k] = { dx: lb.x - b.x, dy: lb.y - b.y, t0: t }; S.lastB[k] = { x: b.x, y: b.y };
      const q = S.bgl && S.bgl[k], gk = q ? M.ease(M.clamp((t - q.t0) / 0.32, 0, 1)) : 1, gx = q ? q.dx * (1 - gk) : 0, gy = q ? q.dy * (1 - gk) : 0;
      c.save(); c.globalAlpha *= al; c.translate((C.row.dx || 0) + gx, (C.row.dy || 0) + gy); const w = b.w + 16, h = Math.max(b.h + 12, 50);
      c.strokeStyle = 'rgba(90,70,60,0.5)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(b.x, b.y - h / 2); c.lineTo(b.x, 150); c.stroke();
      c.fillStyle = 'rgba(40,40,80,0.18)'; c.beginPath(); c.roundRect(b.x - w / 2 + 2, b.y - h / 2 + 4, w, h, 10); c.fill();
      c.fillStyle = '#fffaf0'; c.beginPath(); c.roundRect(b.x - w / 2, b.y - h / 2, w, h, 10); c.fill(); c.strokeStyle = 'rgba(160,120,90,0.6)'; c.lineWidth = 1.5; c.stroke(); c.restore(); }
    void cb;
    // the triangle: the ground side, the plumb line under the kite, and the string
    const gl = s => { const t0 = S.glow[s]; if (t0 == null) return 0; const d = t - t0; return d < 0 ? 0 : d < 0.6 ? Math.sin(Math.min(1, d / 0.3) * Math.PI / 2) : Math.max(0.35, 1 - (d - 0.6) / 0.6); };
    const side = (s, dash, w) => { const [a, b] = S.sides[s].map(v => V[v]), k = S.named ? gl(s) : 0, col = S.named ? M.mix('#5a4a40', COL[s], Math.max(0.55, k)) : '#5a4a40';
      c.save(); c.strokeStyle = col; c.lineWidth = w + k * 2.5; c.lineCap = 'round'; if (k > 0) { c.shadowColor = COL[s]; c.shadowBlur = 14 * k; } if (dash) c.setLineDash(dash); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore(); };
    c.save(); c.fillStyle = 'rgba(255,255,255,0.22)'; c.beginPath(); c.moveTo(...V.P); c.lineTo(...V.R); c.lineTo(...V.K); c.closePath(); c.fill(); c.restore();
    side('A', null, 3.5); side('O', [7, 6], 3); side('H', null, 2.5);
    // right-angle mark and the angle arc at the peg
    c.save(); c.strokeStyle = '#4a3a30'; c.lineWidth = 2; c.strokeRect(V.R[0] - 14, V.R[1] - 14, 14, 14); c.restore();
    const ak = S.angT != null ? Math.max(0, 1 - (t - S.angT) / 0.8) : 0, th = p.deg * Math.PI / 180;
    c.save(); c.strokeStyle = M.mix('#d07a10', GOLD, ak); c.lineWidth = 3 + ak * 2; if (ak) { c.shadowColor = GOLD; c.shadowBlur = 14 * ak; } c.beginPath(); c.arc(V.P[0], V.P[1], 34, -th, 0); c.stroke(); c.restore();
    tagv(g, c, M.txt(p.deg + '°'), V.P[0] + 58 * Math.cos(th / 2), V.P[1] - 58 * Math.sin(th / 2), 17, '#a05a08');
    // the peg in the ground
    c.fillStyle = '#7a4a28'; c.fillRect(V.P[0] - 3, V.P[1] - 6, 6, 16); c.fillStyle = '#5a3418'; c.beginPath(); c.arc(V.P[0], V.P[1] - 6, 4, 0, 7); c.fill();
    // the gold copy of the known side swings onto the unknown side, shrinking or growing to fit
    if (S.swing) { const k = M.easeIO(kk(g, S.swing)), [ka, kb] = S.sides[p.kn], [ua, ub] = S.sides[p.un], sh = [ka, kb].find(v => v === ua || v === ub);
      const kf = V[[ka, kb].find(v => v !== sh)], uf = V[[ua, ub].find(v => v !== sh)], o = V[sh];
      const a0 = Math.atan2(kf[1] - o[1], kf[0] - o[0]), a1 = Math.atan2(uf[1] - o[1], uf[0] - o[0]), l0 = Math.hypot(kf[0] - o[0], kf[1] - o[1]), l1 = Math.hypot(uf[0] - o[0], uf[1] - o[1]);
      let da = a1 - a0; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
      const an = a0 + da * k, ln = M.lerp(l0, l1, k), ex = o[0] + Math.cos(an) * ln, ey = o[1] + Math.sin(an) * ln, fade = S.found != null ? Math.max(0, 1 - (t - S.found) / 0.5) : 1;
      if (fade > 0) { c.save(); c.globalAlpha = fade; c.strokeStyle = GOLD; c.lineWidth = 6; c.lineCap = 'round'; c.shadowColor = GOLD; c.shadowBlur = 16; c.beginPath(); c.moveTo(o[0], o[1]); c.lineTo(ex, ey); c.stroke(); c.restore();
        const half = p.deg !== 45, lab = half ? M.row(M.op(p.un === 'H' ? '÷' : '×'), M.frac(M.num(1), M.num(2))) : M.row(M.op('×'), M.num(1));
        tagv(g, c, lab, M.clamp(ex + 16, 40, 320), ey - 30, 18, '#a06a00', fade * M.clamp(k * 4, 0, 1)); } }
    // side labels: the known length, and x (which becomes its value once found)
    for (const s of ['O', 'A', 'H']) { const v = S.len[s]; if (v == null) continue; const [lx, ly] = S.lpos(s);
      if (v === 'x') { const f = S.found != null && t >= S.found, pk = f ? M.clamp((t - S.found) / 0.35, 0, 1) : 0; tagv(g, c, f ? M.row(M.vr('x'), M.op('='), M.num(p.x)) : M.vr('x'), lx + (f && s === 'O' ? 18 : 0), ly, 20 * (1 + Math.sin(pk * Math.PI) * 0.35), f ? '#b06a00' : INK); }
      else tagv(g, c, M.num(v), lx, ly, 20, INK); }
    for (const s of ['O', 'A', 'H']) if (S.badge[s] != null) { const [bx, by] = S.bpos(s); badge(g, c, s, bx, by, COL[s], (t - S.badge[s]) / 0.3); }
    // the kite at the top corner, its tail streaming in the wind
    drawKite(c, V.K[0], V.K[1], t, S.found != null ? t - S.found : -1);
    M.drawEx(g, c, 'cards');
    const ne = S.mk.ex.note; if (ne) { const b0 = M.box(g, 'nt'), w = ne.node.write, wk = w ? M.easeIO(M.clamp((t - w.t0) / w.dur, 0, 1)) : 1;
      if (b0) { c.save(); c.globalAlpha *= (ne.node.alpha ?? 1) * Math.min(1, wk * 4); c.fillStyle = 'rgba(42,42,82,0.85)'; c.beginPath(); c.roundRect(b0.x - b0.w / 2 - 10, b0.y - b0.h / 2 - 6, Math.max(24, (b0.w + 20) * wk), b0.h + 12, 12); c.fill(); c.restore(); }
      M.drawEx(g, c, 'note'); }
    // the fox holds the kite string at the peg, points at the work while it is shown, and hops when a step lands
    const hk = t - S.hopT < 0.35 ? Math.sin((t - S.hopT) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'fox', HX, HY - hk * 24, 1.0, { t, pose, expr }); else SCN.host(g, c, 'fox', HX, HY, 1.0);
    M.drawUI(g, c);
  },
});
function drawKite(c, x, y, t, cheer) {
  const sw = Math.sin(t * 2.2) * 0.12 + (cheer >= 0 && cheer < 1 ? Math.sin(cheer * Math.PI * 2) * 0.5 : 0);
  // the tail first, with bows
  c.save(); c.strokeStyle = '#4a3a30'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y + 30); const pts = [];
  for (let i = 1; i <= 6; i++) { const px = x - 8 * i + Math.sin(t * 4 + i) * 6, py = y + 30 + i * 10; pts.push([px, py]); c.lineTo(px, py); } c.stroke();
  pts.forEach(([px, py], i) => { if (i % 2) return; c.fillStyle = ['#ff6a8a', '#ffd23a', '#6ad0ff'][i / 2 % 3]; c.beginPath(); c.moveTo(px - 6, py - 4); c.lineTo(px + 6, py + 4); c.lineTo(px + 6, py - 4); c.lineTo(px - 6, py + 4); c.closePath(); c.fill(); }); c.restore();
  c.save(); c.translate(x, y); c.rotate(sw);
  const q = [[0, -26], [18, 0], [0, 32], [-18, 0]], cols = ['#ff5a5a', '#ffd23a', '#3aa0ff', '#3ad08a'];
  for (let i = 0; i < 4; i++) { c.fillStyle = cols[i]; c.beginPath(); c.moveTo(0, 0); c.lineTo(...q[i]); c.lineTo(...q[(i + 1) % 4]); c.closePath(); c.fill(); }
  c.strokeStyle = '#5a3a20'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(...q[0]); c.lineTo(...q[2]); c.moveTo(...q[1]); c.lineTo(...q[3]); c.stroke();
  c.beginPath(); q.forEach((pp, i) => i ? c.lineTo(...pp) : c.moveTo(...pp)); c.closePath(); c.stroke(); c.restore();
}
function paintBg(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 420); sk.addColorStop(0, '#3a8ae0'); sk.addColorStop(0.6, '#8acaf4'); sk.addColorStop(1, '#d8f0fa'); c.fillStyle = sk; c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(255,255,240,0.9)'; c.shadowColor = '#fff8c0'; c.shadowBlur = 60; c.beginPath(); c.arc(306, 70, 22, 0, 7); c.fill(); c.shadowBlur = 0;
  // far hills with a windmill
  c.fillStyle = '#8ac87a'; c.beginPath(); c.moveTo(0, 470); for (let x = 0; x <= W; x += 8) c.lineTo(x, 420 - 26 * Math.sin(x * 0.012 + 1) - 10 * Math.sin(x * 0.04)); c.lineTo(W, 500); c.lineTo(0, 500); c.closePath(); c.fill();
  c.save(); c.translate(300, 392); c.fillStyle = '#f2ead8'; c.beginPath(); c.moveTo(-7, 0); c.lineTo(7, 0); c.lineTo(4, -34); c.lineTo(-4, -34); c.closePath(); c.fill(); c.fillStyle = '#c8604a'; c.beginPath(); c.moveTo(-6, -34); c.lineTo(6, -34); c.lineTo(0, -42); c.closePath(); c.fill(); c.restore();
  // the near hillside
  const hg = c.createLinearGradient(0, 470, 0, H); hg.addColorStop(0, '#6ab84a'); hg.addColorStop(1, '#3e8a34'); c.fillStyle = hg; c.beginPath(); c.moveTo(0, H); c.lineTo(0, 480); for (let x = 0; x <= W; x += 8) c.lineTo(x, 486 + Math.sin(x * 0.02) * 4); c.lineTo(W, H); c.closePath(); c.fill();
  P.flowers(c, W, 506, 640, 30, undefined, 11);
  for (let i = 0; i < 60; i++) { const x = (i * 59) % W, y = 500 + (i * 37) % 140; c.strokeStyle = 'rgba(30,80,20,0.4)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 3, y - 6, x + 6, y - 9); c.stroke(); }
}
function ambient(c, t) {
  // clouds drift with the wind, and grass blades streak by
  for (let i = 0; i < 3; i++) { const x = (i * 150 + t * (8 + i * 3)) % 480 - 80, y = 50 + i * 60; if (typeof P !== 'undefined' && P.cloud) P.cloud(c, x, y, 0.5 + i * 0.12, '#ffffff', '#d8e8f4', 0.85); }
  c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 1.5; for (let i = 0; i < 5; i++) { const x = (i * 97 + t * 160) % 440 - 40, y = 270 + i * 46 + Math.sin(t * 2 + i) * 6; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 14, y - 3, x + 30, y); c.stroke(); }
}
