// twostep_bothsides.js — BOTH SIDES! Solve an equation with x on both sides, such as 5x − 4 = 2x + 11.
// A bronze balance scale on a misty mountain terrace at dawn, with a turtle. Each side of the equation sits in its own
// pan as wooden tiles, one tile per term, and the = sign is the badge on the scale's post. Every move's working plays
// by itself, and always does the same thing to both sides:
//   1. Drag an x term across (2x onto the left pan): "− 2x" writes itself under BOTH pans. Under its own pan the note
//      flies onto the 2x, which flashes, is crossed out and vanishes (2x − 2x = 0); under the other pan it flies into
//      the pan as a new tile, "− 2x". The pans bob as tiles land, but the scale stays level.
//   2. Drag a number across the same way (− 4 onto the right pan): "+ 4" under both pans; − 4 + 4 cancels on the left,
//      "+ 4" joins the right. Moves 1 and 2 may come in either order, and either x term may be moved (moving 5x right
//      leaves −3x on the right, which is fine).
//   3. Tap a pan to combine like terms: "5x − 2x = 3x" writes itself under the x pan while the − 2x slides into the 5x,
//      which rolls to 3; "11 + 4 = 15" writes itself under the other pan and its tiles merge the same way.
//   4. Drag the 3 across: "÷ 3" writes itself under both pans, the 3 is crossed out and falls away, and "15 ÷ 3 = 5"
//      rolls the 15 over to 5: x = 5.
// Level 0: 3x + b = x + d with a positive answer. Level 1: bigger coefficients, constants of either sign, sides may be
// swapped. Level 2: negative answers too. Medium mode: the tray asks for the combined number and for x.
const M = MK, INK = '#3a2412', TILE = '#f4dfb4', TILE2 = '#e2c08a', BRONZE = '#b07a3a', CHALK = '#fff4dc';
const PANX = [90, 270], EXY = 326, NOTEY = 394, PIVX = 180, PIVY = 206, ARM = 90;
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level, nz = (lo, hi) => { let v = 0; while (!v) v = lo + r(hi - lo + 1); return v; };
  let X, a, c, b, d;
  for (let tries = 0; tries < 50; tries++) {
    if (L === 0) { X = 2 + r(4); c = 1; a = 3 + r(2); b = 1 + r(6); }
    else if (L === 1) { X = 2 + r(6); c = 1 + r(3); a = c + 2 + r(3); b = nz(-6, 7); }
    else { X = nz(-5, 6); c = 2 + r(3); a = c + 2 + r(3); b = nz(-8, 8); }
    d = b + (a - c) * X; if (d !== 0 && Math.abs(d) <= 30) break;
  }
  const swap = L > 0 && g.rand() < 0.5;
  return swap ? { X, sides: [[[c, 1], [d, 0]], [[a, 1], [b, 0]]] } : { X, sides: [[[a, 1], [b, 0]], [[c, 1], [d, 0]]] };
}
// a misty mountain terrace at dawn: a lilac sky, layered blue-violet ridges, mist, a wooden deck
function terrace(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 480); sk.addColorStop(0, '#6a6ab0'); sk.addColorStop(0.45, '#c8a0c8'); sk.addColorStop(0.8, '#f8c8b0'); sk.addColorStop(1, '#fde4c8'); c.fillStyle = sk; c.fillRect(0, 0, W, 480);
  const sg = c.createRadialGradient(250, 430, 4, 250, 430, 170); sg.addColorStop(0, 'rgba(255,240,210,0.95)'); sg.addColorStop(0.2, 'rgba(255,220,190,0.5)'); sg.addColorStop(1, 'rgba(255,220,190,0)'); c.fillStyle = sg; c.fillRect(60, 260, 300, 220);
  const ridge = (base, amp, f, ph, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(0, 480); for (let x = 0; x <= W; x += 6) c.lineTo(x, base - amp * Math.abs(Math.sin(x * f + ph)) - amp * 0.4 * Math.sin(x * f * 2.7 + ph)); c.lineTo(W, 480); c.closePath(); c.fill(); };
  ridge(330, 70, 0.011, 0.4, '#a08ac0'); ridge(380, 60, 0.016, 2.1, '#8a76b0'); ridge(430, 46, 0.022, 4.0, '#6a5a98');
  for (const [y, a] of [[352, 0.35], [404, 0.4], [452, 0.5]]) { const mg = c.createLinearGradient(0, y - 20, 0, y + 24); mg.addColorStop(0, 'rgba(255,240,250,0)'); mg.addColorStop(0.5, `rgba(255,240,250,${a})`); mg.addColorStop(1, 'rgba(255,240,250,0)'); c.fillStyle = mg; c.fillRect(0, y - 20, W, 44); }
  // a pine on a crag at the left
  c.fillStyle = '#4a3e6a'; c.beginPath(); c.moveTo(0, 470); c.lineTo(0, 300); c.lineTo(30, 330); c.lineTo(46, 470); c.fill();
  c.fillStyle = '#3a3058'; for (let i = 0; i < 4; i++) { const y = 250 + i * 16, w = 18 + i * 9; c.beginPath(); c.moveTo(22, y - 14); c.lineTo(22 - w, y + 10); c.lineTo(22 + w, y + 10); c.fill(); }
  // the wooden deck
  const dk = c.createLinearGradient(0, 470, 0, H); dk.addColorStop(0, '#a87a52'); dk.addColorStop(1, '#6e4a2e'); c.fillStyle = dk; c.fillRect(0, 470, W, H - 470);
  c.strokeStyle = 'rgba(50,25,10,0.35)'; c.lineWidth = 2; for (let y = 470; y < H; y += 24 + (y - 470) * 0.12) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  c.fillStyle = '#5a3a22'; c.fillRect(0, 462, W, 10); for (let x = 8; x < W; x += 44) { c.fillRect(x, 430, 7, 34); } c.fillRect(0, 426, W, 7);
}

MG.add({
  id: 'twostep_bothsides', stage: 'twostep', cmd: 'BOTH SIDES!', hint: 'drag', time: 10, mood: 'bright', winText: 'Balanced!', hold: 1.7,
  card: {
    title: 'Variables on both sides', ref: 'Grade 8', kind: 'Equations',
    text: 'An equation is like a balanced scale: both sides weigh the same. You can do anything you like to one side, as long as you do the same to the other side, and it stays balanced.\n\nIn 5x − 4 = 2x + 11 there are x\'s on both sides. Take 2x away from both sides: 3x − 4 = 11. Then add 4 to both sides: 3x = 15. Last, divide both sides by 3: x = 5.\n\nCheck it: 5 × 5 − 4 = 21 and 2 × 5 + 11 = 21. Both sides match.',
    note: 'Gather the x terms on one side and the numbers on the other, doing the same to both sides each time. A term that crosses the = sign changes its sign.',
    ask: 'Solve 4x + 1 = x + 13. Solve 6x − 2 = 2x + 10.',
  },
  init(g) {
    const S = g.s; M.setup(g); const T = M.pace(g), pk = pick(g); S.X = pk.X; S.face = 'happy'; S.tilt = 0; S.tv = 0; S.bob = [0, 0];
    let uid = 0;
    const mk = (v, x) => ({ id: 'k' + (uid++), v, x: !!x, sg: M.op(v < 0 ? '-' : '+'), cn: x && Math.abs(v) === 1 ? null : M.num(Math.abs(v)), xn: x ? M.vr('x') : null, node: { k: 'row', items: [] } });
    S.sides = pk.sides.map(sd => sd.map(([v, x]) => mk(v, x))); S.mkTerm = mk;
    S.rows = [{ k: 'row', items: [] }, { k: 'row', items: [] }];
    const show = t => t.final ? [t.xn] : t.merged ? [t.cn, t.xn].filter(Boolean) : null;
    S.relay = s => { const row = S.rows[s]; row.items = S.sides[s].map((t, i) => { t.node.id = t.id; t.node.items = show(t) || [i === 0 && t.v > 0 ? null : t.sg, t.cn, t.xn].filter(Boolean); return t.node; }).flatMap((n, i) => i ? [M.gap(10), n] : [n]);
      let sz = 32; const w = M.lay(row, sz).w; if (w > 146) sz = Math.max(26, sz * 146 / w); M.place(g, 'S' + s, row, PANX[s], EXY, sz, { col: INK }); };
    S.relay(0); S.relay(1);
    M.zone(g, 'pan0', { x: PANX[0], y: EXY - 4, w: 140, h: 70 }); M.zone(g, 'pan1', { x: PANX[1], y: EXY - 4, w: 140, h: 70 });
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    const bob = (s, k = 1) => { S.bobAt = S.bobAt || [0, 0]; S.bobAt[s] = g.t; S.bobK = S.bobK || [1, 1]; S.bobK[s] = k; };
    const fmtTerm = (v, x, lead) => { const out = []; if (v < 0 || !lead) out.push(M.op(v < 0 ? '-' : '+')); if (!(x && Math.abs(v) === 1)) out.push(M.num(Math.abs(v))); if (x) out.push(M.vr('x')); return M.row(...out); };
    // the working note under a pan, on a dark pill; its parts can be filled in later
    S.wk = [null, null];
    const work = (g, s, parts) => { const w = M.row(...parts); w.alpha = 1; S.wk[s] = w; S.wkAt = S.wkAt || []; S.wkAt[s] = g.t; M.place(g, 'w' + s, w, M.clamp(PANX[s], 20 + M.lay(w, 26).w / 2, 340 - M.lay(w, 26).w / 2), NOTEY, 26, { col: CHALK }); };
    const fadeWork = (g, s, d) => { const w = S.wk[s]; if (!w) return; M.tween(g, w, { alpha: 0 }, 0.3 * T, { delay: d }); M.at(g, [[d + 0.32 * T, g => { if (S.wk[s] === w) { delete g.s.mk.ex['w' + s]; S.wk[s] = null; } }]]); };
    const pill = { pill: 'rgba(40,24,40,0.8)' };
    g.dur *= (2.6 + 1.05 * 4) / 8;
    // move a term across: the opposite term is written under both pans; on its own side it cancels the term, on the other it joins
    const cross = (t, s) => ({ drag: t.id, to: [...S.sides[1 - s].map(q => q.id), 'pan' + (1 - s)], area: s === 0 ? [184, 230, 352, 420] : [8, 230, 176, 420], busy: 0.1,
      then(g) {
        const o = 1 - s; if (S.xside == null) S.xside = t.x ? o : s;
        M.show(g, 1.45 * T); S.point = true; hop(g, 'wow'); g.sfx('swoosh');
        M.circle(g, t.id, { dur: 0.45 * T, col: '#ffd86a' }); M.light(g, t.node, { col: '#ffe0a0' });
        const nt = mk(-t.v, t.x); nt.node.alpha = 0; S.sides[o].push(nt); S.relay(o);
        for (const side of [s, o]) M.note(g, { node: fmtTerm(-t.v, t.x, false), at: [PANX[side], NOTEY], s: 26, col: CHALK, ...pill, delay: 0.12 * T, write: 0.3 * T, hold: 0.18 * T, fly: 0.32 * T, arc: 30,
          to: side === s ? t.id : nt.id, s1: 30,
          then(g) { if (side === o) { nt.node.alpha = 1; nt.node.pop = g.t; M.sparkle(g, nt.id, { n: 8 }); g.sfx('pop'); bob(o); }
            else { M.strike(g, t.node, { dur: 0.22 * T }); M.indicate(g, t.node, { col: '#ff8a6a', dur: 0.35 * T, sc: 1.15 }); g.sfx('tap'); bob(s, 0.6); } } });
        M.at(g, [
          [1.1 * T, g => { M.tween(g, t.node, { alpha: 0, sc: 0.4 }, 0.22 * T); M.sparkle(g, t.id, { n: 6, cols: ['#fff', '#ffd0a0'] }); hop(g, 'laugh'); }],
          [1.36 * T, g => { S.sides[s].splice(S.sides[s].indexOf(t), 1); S.relay(s); S.point = false; }],
        ]);
      } });
    M.play(g, {
      moves(g) {
        const sd = S.sides, xs = S.xside;
        const gathered = xs != null && sd[xs].every(q => q.x) && sd[1 - xs].every(q => !q.x);
        if (!gathered) {
          const out = [];
          for (const s of [0, 1]) for (const t of sd[s]) { const o = 1 - s;
            if (t.x && (xs == null || xs === o) && sd[o].some(q => q.x)) out.push({ t, s, pri: Math.abs(t.v) < Math.abs(sd[o].find(q => q.x).v) ? 0 : 2 });
            if (!t.x && (xs == null || xs === s) && sd[o].some(q => !q.x)) out.push({ t, s, pri: 1 }); }
          return out.sort((p, q) => p.pri - q.pri).map(m => cross(m.t, m.s));
        }
        const xsd = sd[xs], csd = sd[1 - xs], cs = 1 - xs;
        if (!S.combined) {
          // 3. combine like terms on both sides at once
          const [x1, x2] = xsd, [c1, c2] = csd, xv = x1.v + x2.v, cv = c1.v + c2.v, moved = c1.moved ? c1 : c2;
          return [{ tap: [...xsd, ...csd].map(q => q.id).concat(['pan0', 'pan1']), busy: 0.1, askAt: 0.85 * T, after: 1.0 * T,
            ask: { v: cv, wrong: [c1.v - c2.v, cv + 1, -cv, c2.v - c1.v].filter(w => w !== cv) },
            then(g) {
              S.combined = true; M.show(g, 0.85 * T); S.point = true; hop(g, 'think');
              M.circle(g, S.rows[xs], { dur: 0.5 * T, col: '#ffd86a' }); M.circle(g, S.rows[cs], { dur: 0.5 * T, col: '#ffd86a', delay: 0.15 * T });
              M.note(g, { node: M.row(fmtTerm(x1.v, 1, true), fmtTerm(x2.v, 1, false), M.op('='), fmtTerm(xv, 1, true)), at: [PANX[xs], NOTEY], s: 26, col: CHALK, ...pill, write: 0.4 * T, hold: 0.9 * T, fade: 0.25 * T });
              M.at(g, [[0.45 * T, g => { const b1 = M.box(g, x1.id), b2 = M.box(g, x2.id); M.tween(g, x2.node, { dx: b1.x - b2.x, alpha: 0 }, 0.3 * T); M.indicate(g, x1.node, { delay: 0.2 * T, dur: 0.3 * T }); }],
                [0.6 * T, g => { x1.merged = true; x1.sg = null; if (!x1.cn) x1.cn = M.num(Math.abs(x1.v)); M.roll(g, x1.cn, xv, { dur: 0.3 * T }); x1.v = xv; x1.cn.id = 'co'; sd[xs].splice(1, 1); S.relay(xs); bob(xs); g.sfx('pop'); }]]);
              S.q = M.num(cv, 'q', { alpha: 0, col: '#ffd86a' }); M.at(g, [[0.3 * T, g => { work(g, cs, [fmtTerm(c1.v, 0, true), fmtTerm(c2.v, 0, false), M.op('='), S.q]); M.writeIn(g, S.wk[cs], { dur: 0.4 * T }); }]]);
            },
            resolve(g) {
              M.show(g, 1.0 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.22 * T }); g.sfx('ding');
              M.at(g, [[0.3 * T, g => { const b1 = M.box(g, c1.id), b2 = M.box(g, c2.id); M.tween(g, c2.node, { dx: b1.x - b2.x, alpha: 0 }, 0.3 * T); }],
                [0.55 * T, g => { c1.merged = true; M.roll(g, c1.cn, cv, { dur: 0.3 * T }); c1.v = cv; c1.cn.id = 'cv'; sd[cs].splice(1, 1); S.relay(cs); bob(cs); g.sfx('coin'); hop(g, 'laugh'); M.sparkle(g, 'cv', { n: 8 }); fadeWork(g, cs, 0.15 * T); }],
                [0.9 * T, g => { S.point = false; }]]);
            } }];
        }
        if (!S.divided) {
          // 4. divide both sides by the coefficient
          const xt = xsd[0], ct = csd[0], a = xt.v, cv = ct.v;
          const dv = () => M.row(M.op('÷'), a < 0 ? M.paren(M.num(a)) : M.num(a));
          return [{ drag: 'co', to: [ct.id, 'cv', 'pan' + cs], area: cs === 1 ? [184, 230, 352, 420] : [8, 230, 176, 420], busy: 0.1, askAt: 0.8 * T, after: 1.0 * T,
            ask: { v: S.X, wrong: [cv - a, cv * a, S.X + 1, -S.X].filter(w => w !== S.X) },
            then(g) {
              S.divided = true; M.show(g, 0.8 * T); S.point = true; hop(g, 'wow'); g.sfx('swoosh');
              M.circle(g, 'co', { dur: 0.45 * T, col: '#ffd86a' });
              M.note(g, { node: dv(), at: [PANX[xs], NOTEY], s: 26, col: CHALK, ...pill, write: 0.3 * T, hold: 0.9 * T, fade: 0.25 * T });
              M.strike(g, 'co', { delay: 0.4 * T, dur: 0.22 * T });
              S.q = M.num(S.X, 'q2', { alpha: 0, col: '#ffd86a' }); work(g, cs, [M.num(cv), dv(), M.op('='), S.q]); M.writeIn(g, S.wk[cs], { dur: 0.4 * T });
            },
            resolve(g) {
              M.show(g, 1.0 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.22 * T }); g.sfx('ding');
              M.at(g, [[0.3 * T, g => { M.tween(g, xt.cn, { alpha: 0, dy: 30, sc: 0.5 }, 0.3 * T); M.roll(g, ct.cn, S.X, { dur: 0.35 * T }); M.indicate(g, ct.cn, { delay: 0.3 * T, dur: 0.35 * T, sc: 1.25 }); }],
                [0.62 * T, g => { xt.final = true; S.relay(xs); bob(0); bob(1); fadeWork(g, cs, 0); M.sparkle(g, 'cv', { n: 12, cols: ['#ffd86a', '#fff', '#c8a0ff'] }); g.sfx('coin'); hop(g, 'laugh'); }],
                [0.85 * T, g => { M.sparkle(g, xt.id, { n: 10 }); g.sfx('sparkle'); S.point = false; }]]);
            } }];
        }
        return [];
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.drag || m.tap || []).slice(0, 1) : []; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('bothsides_terrace', terrace), 0, 0, 360, 640);
    // drifting mist and a few birds far away
    c.save(); for (let i = 0; i < 4; i++) { const x = ((t * (8 + i * 3) + i * 120) % 520) - 120, y = 360 + i * 26; const mg = c.createRadialGradient(x, y, 4, x, y, 90); mg.addColorStop(0, 'rgba(255,245,252,0.32)'); mg.addColorStop(1, 'rgba(255,245,252,0)'); c.fillStyle = mg; c.fillRect(x - 90, y - 40, 180, 80); }
    for (let i = 0; i < 3; i++) { const x = (t * 14 + i * 90) % 400 - 20, y = 250 + i * 14 + Math.sin(t * 2 + i) * 4, f = Math.sin(t * 7 + i) * 3; c.strokeStyle = '#4a3a6a'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x - 6, y - f); c.quadraticCurveTo(x - 3, y - 3, x, y); c.quadraticCurveTo(x + 3, y - 3, x + 6, y - f); c.stroke(); } c.restore();
    // the scale: post, beam, chains and pans. A pan bobs a little when a tile lands on it, but the beam stays level.
    const bobY = s => { const t0 = S.bobAt ? S.bobAt[s] : null; if (!t0) return 0; const k = t - t0; return k < 0.6 ? Math.sin(k * 18) * Math.exp(-k * 6) * 6 * (S.bobK ? S.bobK[s] : 1) : 0; };
    c.save();
    c.fillStyle = 'rgba(40,20,20,0.25)'; c.beginPath(); c.ellipse(PIVX, 472, 60, 8, 0, 0, 7); c.fill();
    const bz = c.createLinearGradient(PIVX - 8, 0, PIVX + 8, 0); bz.addColorStop(0, '#7a4a1e'); bz.addColorStop(0.5, '#e0a860'); bz.addColorStop(1, '#7a4a1e'); c.fillStyle = bz; c.fillRect(PIVX - 6, PIVY, 12, 260);
    c.fillStyle = BRONZE; c.beginPath(); c.moveTo(PIVX - 44, 470); c.quadraticCurveTo(PIVX, 440, PIVX + 44, 470); c.closePath(); c.fill(); c.strokeStyle = '#6a3e16'; c.lineWidth = 2; c.stroke();
    c.lineCap = 'round'; c.strokeStyle = '#6a3e16'; c.lineWidth = 9; c.beginPath(); c.moveTo(PIVX - ARM - 8, PIVY); c.lineTo(PIVX + ARM + 8, PIVY); c.stroke();
    c.strokeStyle = '#d89a50'; c.lineWidth = 4; c.beginPath(); c.moveTo(PIVX - ARM - 6, PIVY - 1); c.lineTo(PIVX + ARM + 6, PIVY - 1); c.stroke();
    c.fillStyle = '#e0a860'; c.beginPath(); c.arc(PIVX, PIVY, 9, 0, 7); c.fill(); c.strokeStyle = '#6a3e16'; c.lineWidth = 2; c.stroke();
    c.beginPath(); c.moveTo(PIVX, PIVY - 9); c.lineTo(PIVX - 6, PIVY - 26); c.lineTo(PIVX + 6, PIVY - 26); c.closePath(); c.fillStyle = '#d89a50'; c.fill(); c.stroke();
    // the = badge on the post
    c.fillStyle = '#6a3e16'; c.beginPath(); c.arc(PIVX, EXY - 10, 11, 0, 7); c.fill(); c.fillStyle = '#f0c070'; c.beginPath(); c.arc(PIVX, EXY - 10, 8.5, 0, 7); c.fill();
    c.fillStyle = INK; c.fillRect(PIVX - 5.5, EXY - 14, 11, 2.6); c.fillRect(PIVX - 5.5, EXY - 8.6, 11, 2.6);
    c.restore();
    for (const s of [0, 1]) {
      const px = PANX[s], dy = bobY(s); c.save(); c.translate(0, dy);
      c.strokeStyle = '#8a5a2a'; c.lineWidth = 2; for (const ex of [-72, 0, 72]) { c.beginPath(); c.moveTo(px, PIVY + 4 - dy); c.lineTo(px + ex, 348); c.stroke(); }
      c.fillStyle = '#6a3e16'; c.beginPath(); c.arc(px, PIVY + 4 - dy, 5, 0, 7); c.fill();
      // the pan
      const pg = c.createLinearGradient(0, 344, 0, 366); pg.addColorStop(0, '#e8b070'); pg.addColorStop(1, '#8a5424'); c.fillStyle = pg; c.beginPath(); c.moveTo(px - 80, 346); c.quadraticCurveTo(px, 382, px + 80, 346); c.closePath(); c.fill(); c.strokeStyle = '#5a3412'; c.lineWidth = 2; c.stroke();
      // a wooden tile under each term
      for (const tm of S.sides[s]) { const b = M.box(g, tm.id), a = tm.node.alpha ?? 1; if (!b || a < 0.02) continue; const w = b.w + 8, h = 46, x = b.x + (tm.node.dx || 0) + (tm.node._ax || 0), sc = tm.node.sc ?? 1;
        c.save(); c.globalAlpha = a; c.translate(x, EXY - 11); c.scale(sc, sc); c.fillStyle = 'rgba(60,30,10,0.3)'; c.beginPath(); c.roundRect(-w / 2 + 2, -h / 2 + 4, w, h, 8); c.fill();
        const tg = c.createLinearGradient(0, -h / 2, 0, h / 2); tg.addColorStop(0, TILE); tg.addColorStop(1, TILE2); c.fillStyle = tg; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 8); c.fill(); c.strokeStyle = '#7a4a24'; c.lineWidth = 2; c.stroke(); c.restore(); }
      M.drawEx(g, c, 'S' + s); c.restore();
      // the working note under this pan
      const w = S.wk && S.wk[s]; if (w && g.s.mk.ex['w' + s]) { const m = M.lay(w, 26), bx = M.box(g, 'w' + s) || null; c.save(); c.globalAlpha = (w.alpha ?? 1) * M.clamp((t - S.wkAt[s]) / 0.15, 0, 1); c.fillStyle = 'rgba(40,24,40,0.8)'; c.beginPath(); c.roundRect(g.s.mk.ex['w' + s].x - 12, NOTEY - 29, m.w + 24, 40, 20); c.fill(); c.restore(); M.drawEx(g, c, 'w' + s); }
    }
    // the turtle keeps the scale, and a small bird watches from the rail
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    try { if (typeof ANI !== 'undefined') { ANI.draw(c, 'bird', 318, 432 - hopK * 8, 0.75, { t, phase: 2, facing: -1, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : 'happy' }); ANI.draw(c, 'turtle', 100, 604 - hopK * 20, 1.5, { t, pose, expr }); }
      else SCN.host(g, c, 'turtle', 100, 604, 1.4); } catch (e) { SCN.host(g, c, 'turtle', 100, 604, 1.4); }
    M.drawUI(g, c);
  },
});
