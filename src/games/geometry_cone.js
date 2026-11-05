// geometry_cone.js — CONE VOLUME! A cone holds one third of the cylinder with the same base and height: V = ⅓πr²h.
// A beach on a golden afternoon, with an octopus. A waffle-pattern cone full of sand stands in the sand next to a
// clear pail (a cylinder) with the same radius and height; dashed lines join their rims and their bases, and shell
// tags say r = 3 and h = 4. A driftwood sign reads "V = ?πr²h". Every move's working plays by itself:
//   1. Drag the cone onto the pail: it flies over, tips and pours, and the pail fills to its first third mark; it goes
//      back, refills and pours twice more (pebbles count 1, 2, 3) until the pail is exactly full. Then "⅓" writes
//      itself beside the cone and flies into the sign: V = ⅓πr²h.
//   2. Drag the r tag onto the sign: the radius line glows, a 3 flies into the r, "3 × 3 = 9" writes itself under the
//      sign and 3² rolls into 9: V = ⅓π · 9h.
//   3. Drag the h tag onto the sign: the height line glows and a 4 flies into the h: V = ⅓π · 9 · 4.
//   4. Tap the sign: "9 × 4 = 36" writes itself while the 4 slides into the 9, which rolls to 36; then "36 ÷ 3 = 12"
//      and the ⅓ slides into the 36, which rolls to 12, and the π glides round behind it: V = 12π.
// Moves 1–3 may come in any order. Level 0: r = 3, h = 2, 4 or 5. Level 1: r from 2 to 4. Level 2: r up to 6, h up to 9
// (r²h is always a multiple of 3). Medium mode: the tray asks for r² and for the final number.
// The fonts have no π, so the π is drawn by hand over a gap in the expression (it follows the gap when it glides).
const M = MK, INK = '#3a2414', SAND = '#f0c878', SAND2 = '#d8a858', CX = 88, BX = 218, TOPY = 384, BOTY = 492, RAD = 52, ERY = 13, FY = 252, NOTEY = 318;
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  if (L === 0) return { r: 3, h: [2, 4, 5][r(3)] };
  if (L === 1) { const rr = 2 + r(3); return { r: rr, h: rr === 3 ? 2 + r(5) : [3, 6][r(2)] }; }
  for (;;) { const rr = 2 + r(5), h = 2 + r(8); if ((rr * rr * h) % 3 === 0) return { r: rr, h }; }
}
function pi(c, x, y, s, col) { // a hand-drawn π standing on the baseline y, centred on x
  c.save(); c.translate(x, y - s * 0.3); c.strokeStyle = col; c.lineWidth = s * 0.085; c.lineCap = 'round'; c.beginPath();
  c.moveTo(-s * 0.3, -s * 0.18); c.quadraticCurveTo(-s * 0.2, -s * 0.28, 0, -s * 0.26); c.lineTo(s * 0.32, -s * 0.27);
  c.moveTo(-s * 0.13, -s * 0.26); c.quadraticCurveTo(-s * 0.12, s * 0.1, -s * 0.22, s * 0.3);
  c.moveTo(s * 0.13, -s * 0.26); c.quadraticCurveTo(s * 0.1, s * 0.22, s * 0.18, s * 0.3); c.quadraticCurveTo(s * 0.24, s * 0.33, s * 0.3, s * 0.24); c.stroke(); c.restore();
}
// a beach on a golden afternoon: sky, sea with glints, the sand
function beach(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 330); sk.addColorStop(0, '#5ab4e8'); sk.addColorStop(0.6, '#a8dcf0'); sk.addColorStop(1, '#ffe8bc'); c.fillStyle = sk; c.fillRect(0, 0, W, 330);
  const sg = c.createRadialGradient(300, 60, 4, 300, 60, 130); sg.addColorStop(0, 'rgba(255,250,220,1)'); sg.addColorStop(0.2, 'rgba(255,240,200,0.6)'); sg.addColorStop(1, 'rgba(255,240,200,0)'); c.fillStyle = sg; c.fillRect(150, 0, 210, 220);
  c.fillStyle = '#fffbe4'; c.beginPath(); c.arc(300, 60, 18, 0, 7); c.fill();
  const sea = c.createLinearGradient(0, 300, 0, 400); sea.addColorStop(0, '#3a9ac8'); sea.addColorStop(1, '#6ad0d8'); c.fillStyle = sea; c.fillRect(0, 300, W, 100);
  c.fillStyle = '#2a7aa8'; c.fillRect(0, 300, W, 3);
  // wet sand, foam and dry sand
  c.fillStyle = '#e2c48a'; c.beginPath(); c.moveTo(0, 396); for (let x = 0; x <= W; x += 12) c.lineTo(x, 392 + Math.sin(x * 0.04) * 4); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  const sd = c.createLinearGradient(0, 410, 0, H); sd.addColorStop(0, '#f4dca8'); sd.addColorStop(1, '#e8c88a'); c.fillStyle = sd; c.beginPath(); c.moveTo(0, 414); for (let x = 0; x <= W; x += 12) c.lineTo(x, 410 + Math.sin(x * 0.03 + 1) * 5); c.lineTo(W, H); c.lineTo(0, H); c.fill();
  const R = P.rng(23); c.fillStyle = 'rgba(160,120,70,0.25)'; for (let i = 0; i < 70; i++) { c.beginPath(); c.arc(R() * W, 420 + R() * 220, 1 + R() * 1.5, 0, 7); c.fill(); }
  // a starfish and shells
  c.fillStyle = '#f08a6a'; c.save(); c.translate(36, 560); c.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? 5 : 13; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.fill(); c.restore();
  c.fillStyle = '#fbe8e0'; for (const [x, y] of [[150, 600], [214, 560]]) { c.beginPath(); c.ellipse(x, y, 8, 6, 0.3, 0, 7); c.fill(); }
}
// the cone (apex down), drawn with its rim centre at the origin; f = how full of sand it is (by volume)
function coneShape(c, f, glow) {
  c.save(); c.fillStyle = 'rgba(60,30,10,0.0)';
  c.fillStyle = '#e8b064'; c.beginPath(); c.moveTo(-RAD, 0); c.lineTo(0, BOTY - TOPY); c.lineTo(RAD, 0); c.closePath(); c.fill();
  c.save(); c.clip(); c.strokeStyle = 'rgba(150,90,30,0.55)'; c.lineWidth = 1.5; for (let k = -6; k < 9; k++) { c.beginPath(); c.moveTo(-RAD + k * 15, 0); c.lineTo(-RAD + k * 15 + 70, 108); c.moveTo(RAD - k * 15, 0); c.lineTo(RAD - k * 15 - 70, 108); c.stroke(); } c.restore();
  c.strokeStyle = glow ? '#ffd040' : '#8a5420'; c.lineWidth = glow ? 4 : 2.5; c.beginPath(); c.moveTo(-RAD, 0); c.lineTo(0, BOTY - TOPY); c.lineTo(RAD, 0); c.stroke();
  // the opening, then the sand inside (up to height hf above the apex)
  c.fillStyle = '#9a6430'; c.beginPath(); c.ellipse(0, 0, RAD, ERY, 0, 0, 7); c.fill();
  if (f > 0.005) { const Hh = BOTY - TOPY, hf = Hh * Math.cbrt(Math.min(1, f)), ys = Hh - hf, w = RAD * hf / Hh;
    c.fillStyle = SAND; c.beginPath(); c.moveTo(-w, ys); c.lineTo(0, Hh); c.lineTo(w, ys); c.closePath(); c.fill(); c.beginPath(); c.ellipse(0, ys, w, w * ERY / RAD, 0, 0, 7); c.fill();
    if (f >= 0.999) { c.fillStyle = '#f6d690'; c.beginPath(); c.ellipse(0, -3, RAD * 0.86, 13, 0, Math.PI, 0); c.fill(); c.beginPath(); c.ellipse(0, 0, RAD * 0.98, ERY, 0, 0, 7); c.fill(); } }
  c.strokeStyle = '#8a5420'; c.lineWidth = 2.5; c.beginPath(); c.ellipse(0, 0, RAD, ERY, 0, 0, 7); c.stroke(); c.restore();
}

MG.add({
  id: 'geometry_cone', stage: 'geometry', cmd: 'CONE VOLUME!', hint: 'drag', time: 10, mood: 'bright', winText: 'Poured!', hold: 1.7,
  card: {
    title: 'Volume of a cone', ref: 'Grade 8', kind: 'Geometry',
    text: 'A cylinder\'s volume is the area of its circle base times its height: πr²h.\n\nNow take a cone with the same base and the same height. Fill it with sand and pour it into the cylinder. It takes exactly 3 cones to fill the cylinder, so one cone holds a third: V = ⅓πr²h.\n\nFor r = 3 and h = 4: r² = 3 × 3 = 9, then 9 × 4 = 36, and a third of 36 is 12. The cone holds 12π cubic units, about 37.7.\n\nDon\'t forget the ⅓! Without it you get the whole cylinder.',
    note: 'Cone volume = ⅓ × π × r² × h, one third of the cylinder with the same base and height.',
    ask: 'A cone has r = 2 and h = 6. What is its volume? A cone has r = 3 and h = 5?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const T = M.pace(g), { r, h } = S; S.face = 'happy'; S.tally = [];
    S.V = M.vr('V', 'vV'); S.eq = M.op('=', 'eq'); S.F = M.slot('fs', { col: '#8a6a4a' }); S.PI = { ...M.gap(38 * 0.66), id: 'pi' };
    S.rS = M.sup(M.vr('r', 'rv'), M.num(2, 'r2e'), 'r2'); S.hS = M.vr('h', 'hv'); S.rDot = M.op('·', 'd1'); S.hDot = M.op('·', 'd2');
    S.relay = () => { const items = [S.V, S.eq, S.F, S.PI]; if (!S.done) { items.push(...(S.rDone ? [S.rDot, S.rS] : [S.rS])); items.push(...(S.hDone ? [S.hDot, S.hS] : [S.hS])); } else items.splice(2, 2, S.rS, S.PI);
      S.row = M.row(...items); M.place(g, 'F', S.row, 180, FY, 38, { col: INK }); };
    S.relay();
    M.place(g, 'rt', Object.assign(M.row(M.vr('r'), M.op('='), M.num(r)), { id: 'rt' }), 302, 358, 26, { col: INK });
    M.place(g, 'ht', Object.assign(M.row(M.vr('h'), M.op('='), M.num(h)), { id: 'ht' }), 318, 448, 26, { col: INK });
    M.zone(g, 'cone', { x: CX, y: (TOPY + BOTY) / 2 - 6, w: 112, h: 124 }); M.zone(g, 'buck', { x: BX, y: (TOPY + BOTY) / 2, w: 112, h: 124 });
    M.inert(g, ['vV', 'eq', 'pi', 'd1', 'd2', 'r2e']);
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    const work = (g, parts) => { S.wk = M.row(...parts); S.wk.alpha = 1; S.wkAt = g.t; M.place(g, 'wk', S.wk, 180, NOTEY, 28, { col: '#fff4dc' }); };
    const fadeWork = (g, d) => { const w = S.wk; if (!w) return; M.tween(g, w, { alpha: 0 }, 0.3 * T, { delay: d }); M.at(g, [[d + 0.32 * T, g => { if (S.wk === w) { delete g.s.mk.ex.wk; S.wk = null; } }]]); };
    const glowLine = (g, which, d) => { S.glow = S.glow || {}; M.at(g, [[d || 0, g => { S.glow[which] = g.t; }]]); };
    S.PP = 0.5 * T; // one pour
    g.dur *= (2.6 + 1.05 * 4) / 8;
    const signArea = [16, FY - 60, 344, FY + 34];
    M.play(g, {
      moves(g) {
        const out = [];
        // 1. pour the cone into the pail three times
        if (!S.poured) out.push({ drag: 'cone', to: 'buck', area: [160, 300, 352, 530], busy: 0.1,
          then(g) {
            S.poured = true; const P0 = 0.2 * T, PP = S.PP; S.pourT0 = g.t + P0; M.show(g, P0 + 3 * PP + 0.95 * T); S.point = true; hop(g, 'wow'); g.sfx('swoosh');
            for (let i = 0; i < 3; i++) M.at(g, [[P0 + (i + 0.45) * PP, g => { g.sfx('whoosh'); }], [P0 + (i + 0.8) * PP, g => { S.tally.push(g.t); g.sfx('pop'); hop(g, i === 2 ? 'laugh' : null); }]]);
            M.at(g, [[P0 + 3 * PP + 0.1 * T, g => { M.circle(g, 'buck', { dur: 0.4 * T, col: '#ffe080' }); g.sfx('ding'); }],
              [P0 + 3 * PP + 0.15 * T, g => { M.note(g, { node: M.frac(M.num(1), M.num(3)), at: [CX, TOPY - 40], s: 34, col: '#fff4dc', pill: 'rgba(60,30,20,0.75)', write: 0.25 * T, hold: 0.15 * T, fly: 0.35 * T, to: 'fs', s1: 38, arc: 40,
                then(g) { S.F = M.frac(M.num(1), M.num(3), 'fr', { _born: -1, pop: g.t }); S.relay(); M.sparkle(g, 'fr', { n: 10 }); g.sfx('coin'); hop(g, 'laugh'); S.point = false; } }); }]]);
          } });
        // 2. r into the formula: r² becomes 9
        if (!S.rDone) out.push({ drag: 'rt', to: ['r2', 'rv'], area: signArea, busy: 0.1, askAt: 0.85 * T, after: 0.85 * T, ask: { v: r * r, wrong: [2 * r, r + 2, r * r + r, r] },
          then(g) {
            S.rDone = true; M.show(g, 0.85 * T); S.point = true; hop(g, 'wow'); glowLine(g, 'r'); M.circle(g, 'rt', { dur: 0.4 * T, col: '#ffd040' });
            const nb = M.num(r, 'rb', { alpha: 0 }); S.rS.base = nb; S.relay();
            M.fly(g, { node: M.num(r, null, { col: INK }), from: 'rt', to: 'rb', dur: 0.36 * T, delay: 0.1 * T, arc: -50, s0: 26, s1: 38, then(g) { nb.alpha = 1; nb.pop = g.t; M.sparkle(g, 'rb', { n: 6 }); g.sfx('pop'); } });
            S.q = M.num(r * r, 'q', { alpha: 0, col: '#ffd86a' }); M.at(g, [[0.4 * T, g => { work(g, [M.num(r), M.op('×'), M.num(r), M.op('='), S.q]); M.writeIn(g, S.wk, { dur: 0.35 * T }); }]]);
          },
          resolve(g) {
            M.show(g, 0.85 * T); S.q.alpha = 1; M.writeIn(g, S.q, { dur: 0.2 * T }); g.sfx('ding');
            M.at(g, [[0.25 * T, g => { const e = S.rS.exp, b = M.box(g, 'r2e'), bb = M.box(g, 'rb'); M.tween(g, e, { dx: bb.x - b.x, dy: 8, alpha: 0, sc: 0.5 }, 0.25 * T); M.roll(g, S.rS.base, r * r, { delay: 0.12 * T, dur: 0.3 * T }); }],
              [0.55 * T, g => { const n = S.rS.base; n.id = 'rn'; S.rS = n; S.relay(); M.sparkle(g, 'rn', { n: 8 }); hop(g); fadeWork(g, 0); S.point = false; }]]);
          } });
        // 3. h into the formula
        if (!S.hDone) out.push({ drag: 'ht', to: ['hv'], area: signArea, busy: 0.1,
          then(g) {
            S.hDone = true; M.show(g, 0.7 * T); S.point = true; hop(g, 'wow'); glowLine(g, 'h'); M.circle(g, 'ht', { dur: 0.4 * T, col: '#ffd040' });
            const nh = M.num(h, 'hn', { alpha: 0 }); S.hS = nh; S.hDot._born = g.t; S.relay();
            M.fly(g, { node: M.num(h, null, { col: INK }), from: 'ht', to: 'hn', dur: 0.4 * T, delay: 0.1 * T, arc: -60, s0: 26, s1: 38, then(g) { nh.alpha = 1; nh.pop = g.t; M.sparkle(g, 'hn', { n: 6 }); g.sfx('pop'); hop(g); S.point = false; } });
          } });
        if (out.length || S.done) return out;
        // 4. multiply it out: r² × h, then a third of it
        const r2 = r * r, all = r2 * h, v = all / 3;
        return [{ tap: ['fr', 'rn', 'hn'], busy: 0.1, askAt: 0.95 * T, after: 1.0 * T, ask: { v, wrong: [all, r * h, v + 3, r2 + h] },
          then(g) {
            S.done0 = true; M.show(g, 0.95 * T); S.point = true; hop(g, 'think');
            M.circle(g, ['rn', 'hn'], { dur: 0.45 * T, col: '#ffd040' });
            M.note(g, { node: M.row(M.num(r2), M.op('×'), M.num(h), M.op('='), M.num(all)), at: [180, NOTEY], s: 28, col: '#fff4dc', pill: 'rgba(60,30,20,0.78)', write: 0.3 * T, hold: 0.2 * T, fade: 0.15 * T });
            M.at(g, [[0.35 * T, g => { const a = M.box(g, 'rn'), b = M.box(g, 'hn'); M.tween(g, S.hS, { dx: a.x - b.x, alpha: 0 }, 0.25 * T); M.tween(g, S.hDot, { alpha: 0 }, 0.2 * T); M.roll(g, S.rS, all, { delay: 0.1 * T, dur: 0.3 * T }); g.sfx('pop'); }],
              [0.66 * T, g => { S.hS = null; S.hDone = 'merged'; S.row.items = S.row.items.filter(q => q !== S.hS && q.id !== 'hn' && q.id !== 'd2'); M.place(g, 'F', S.row, 180, FY, 38, { col: INK }); }],
              [0.68 * T, g => { S.q2 = M.num(v, 'q2', { alpha: 0, col: '#ffd86a' }); work(g, [M.num(all), M.op('÷'), M.num(3), M.op('='), S.q2]); M.writeIn(g, S.wk, { dur: 0.25 * T }); M.indicate(g, 'fr', { dur: 0.3 * T }); }]]);
          },
          resolve(g) {
            M.show(g, 1.0 * T); S.q2.alpha = 1; M.writeIn(g, S.q2, { dur: 0.2 * T }); g.sfx('ding');
            M.at(g, [[0.25 * T, g => { const a = M.box(g, 'fr'), b = M.box(g, 'rn'); M.tween(g, 'fr', { dx: b.x - a.x, alpha: 0, sc: 0.6 }, 0.28 * T); M.roll(g, S.rS, v, { delay: 0.1 * T, dur: 0.3 * T }); }],
              [0.55 * T, g => { S.done = true; S.relay(); M.sparkle(g, 'rn', { n: 14, cols: ['#ffd86a', '#fff', '#7ad0ff'] }); g.sfx('coin'); hop(g, 'laugh'); fadeWork(g, 0.1 * T); }],
              [0.8 * T, g => { M.indicate(g, S.row, { sc: 1.1, dur: 0.35 * T }); S.point = false; g.sfx('sparkle'); }]]);
          } }];
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.drag || m.tap).slice(0, 1) : []; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t;
    c.drawImage(g.bake('cone_beach', beach), 0, 0, 360, 640);
    // waves rolling in and glints on the sea
    c.save(); for (let i = 0; i < 12; i++) { const x = (i * 41 + t * 10) % 380 - 10, y = 312 + (i % 4) * 18, a = 0.3 + 0.3 * Math.sin(t * 3 + i); c.fillStyle = `rgba(255,255,255,${a})`; c.fillRect(x, y, 12 + (i % 3) * 5, 2); }
    const wv = Math.sin(t * 0.9) * 5; c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 3; c.beginPath(); for (let x = 0; x <= 360; x += 10) c.lineTo(x, 394 + wv + Math.sin(x * 0.05 + t * 2) * 2); c.stroke(); c.restore();
    // the driftwood sign
    c.save(); c.fillStyle = '#8a6440'; c.fillRect(54, FY + 20, 10, 50); c.fillRect(296, FY + 20, 10, 50);
    c.fillStyle = 'rgba(40,20,10,0.3)'; c.beginPath(); c.roundRect(22, FY - 56, 324, 86, 16); c.fill();
    const wg = c.createLinearGradient(0, FY - 60, 0, FY + 26); wg.addColorStop(0, '#f6e4c0'); wg.addColorStop(1, '#dcc094'); c.fillStyle = wg; c.beginPath(); c.roundRect(18, FY - 62, 324, 86, 16); c.fill();
    c.strokeStyle = 'rgba(120,80,40,0.35)'; c.lineWidth = 1.5; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(30, FY - 40 + k * 22); c.bezierCurveTo(120, FY - 36 + k * 22, 240, FY - 44 + k * 22, 330, FY - 40 + k * 22); c.stroke(); }
    c.strokeStyle = '#8a6440'; c.lineWidth = 3; c.beginPath(); c.roundRect(18, FY - 62, 324, 86, 16); c.stroke(); c.restore();
    M.drawEx(g, c, 'F');
    const pb = M.box(g, 'pi'), pn = S.PI; if (pb) pi(c, pb.x + (pn._ax || 0), pb.y + (pn._ay || 0), 38, INK);
    // the pail: back, sand, thirds marks, front glass
    const T = M.pace(g), PP = S.PP, P0 = S.pourT0, u = P0 != null ? (t - P0) / PP : -1;
    let lev = 0; if (u > 0) for (let i = 0; i < 3; i++) lev += M.clamp((u - i - 0.42) / 0.36, 0, 1) / 3;
    const glow = S.glow || {}, gl = k => glow[k] != null && t - glow[k] < 1.0 ? Math.sin(M.clamp((t - glow[k]) / 1.0, 0, 1) * Math.PI) : 0;
    c.save(); c.fillStyle = 'rgba(80,50,20,0.25)'; c.beginPath(); c.ellipse(BX + 6, BOTY + 6, RAD + 8, ERY + 3, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(CX + 4, BOTY + 4, 20, 6, 0, 0, 7); c.fill();
    c.fillStyle = 'rgba(200,236,255,0.35)'; c.beginPath(); c.ellipse(BX, TOPY, RAD, ERY, 0, 0, 7); c.fill(); c.fillRect(BX - RAD, TOPY, RAD * 2, BOTY - TOPY);
    if (lev > 0.003) { const sy = BOTY - lev * (BOTY - TOPY); c.fillStyle = SAND2; c.beginPath(); c.ellipse(BX, BOTY, RAD, ERY, 0, 0, Math.PI); c.lineTo(BX - RAD, sy); c.lineTo(BX + RAD, sy); c.closePath(); c.fill(); c.fillRect(BX - RAD, sy, RAD * 2, BOTY - sy);
      c.fillStyle = SAND; c.beginPath(); c.ellipse(BX, sy, RAD, ERY, 0, 0, 7); c.fill(); }
    c.setLineDash([5, 4]); c.strokeStyle = 'rgba(30,90,140,0.7)'; c.lineWidth = 1.6; for (const k of [1, 2]) { const y = BOTY - k / 3 * (BOTY - TOPY); c.beginPath(); c.ellipse(BX, y, RAD, ERY, 0, 0.1, Math.PI - 0.1); c.stroke(); } c.setLineDash([]);
    c.strokeStyle = '#2a7ab8'; c.lineWidth = 3; c.beginPath(); c.moveTo(BX - RAD, TOPY); c.lineTo(BX - RAD, BOTY); c.ellipse(BX, BOTY, RAD, ERY, 0, Math.PI, 0, true); c.lineTo(BX + RAD, TOPY); c.stroke();
    c.beginPath(); c.ellipse(BX, TOPY, RAD, ERY, 0, 0, 7); c.stroke(); c.fillStyle = 'rgba(255,255,255,0.5)'; c.fillRect(BX - RAD + 8, TOPY + 12, 6, 84);
    c.strokeStyle = '#2a7ab8'; c.lineWidth = 2.5; c.beginPath(); c.arc(BX, TOPY - 4, RAD - 4, Math.PI * 1.08, Math.PI * 1.92); c.stroke();
    // the shared rims and bases (dashed), the radius line and the height line
    c.setLineDash([6, 5]); c.strokeStyle = 'rgba(90,60,30,0.55)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(CX + RAD + 4, TOPY); c.lineTo(BX - RAD - 4, TOPY); c.moveTo(CX + 6, BOTY); c.lineTo(BX - RAD - 4, BOTY); c.stroke(); c.setLineDash([]);
    const rg = gl('r'), hg = gl('h');
    c.strokeStyle = M.mix('#ffffff', '#ffc020', rg); c.lineWidth = 3 + rg * 3; c.shadowColor = '#ffc020'; c.shadowBlur = rg * 14; c.beginPath(); c.moveTo(BX, TOPY); c.lineTo(BX + RAD, TOPY); c.stroke();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(BX, TOPY, 3, 0, 7); c.fill();
    c.strokeStyle = M.mix('#5a4030', '#ffc020', hg); c.lineWidth = 2.5 + hg * 3; c.shadowBlur = hg * 14; c.beginPath(); c.moveTo(BX + RAD + 10, TOPY); c.lineTo(BX + RAD + 10, BOTY); c.moveTo(BX + RAD + 5, TOPY); c.lineTo(BX + RAD + 15, TOPY); c.moveTo(BX + RAD + 5, BOTY); c.lineTo(BX + RAD + 15, BOTY); c.stroke(); c.restore();
    // the shell tags
    for (const id of ['rt', 'ht']) { const b = M.box(g, id); if (!b) continue; c.save(); c.fillStyle = 'rgba(80,50,20,0.25)'; c.beginPath(); c.roundRect(b.x - b.w / 2 - 9, b.y - b.h / 2 - 6, b.w + 18, b.h + 14, 14); c.fill();
      c.fillStyle = '#fff4ec'; c.beginPath(); c.roundRect(b.x - b.w / 2 - 11, b.y - b.h / 2 - 9, b.w + 18, b.h + 14, 14); c.fill(); c.strokeStyle = '#e89a8a'; c.lineWidth = 2; c.stroke(); c.restore(); }
    c.save(); c.translate(-2, -3); M.drawEx(g, c, 'rt'); M.drawEx(g, c, 'ht'); c.restore();
    // the cone: in its spot, or flying to the pail, tipping and pouring three times
    let cx = CX, cy = TOPY, rot = 0, fill = 1;
    if (u > 0 && u < 3) { const i = Math.floor(u), k = u - i, to = [206, 312];
      if (k < 0.3) { const e = M.easeIO(k / 0.3); cx = M.lerp(CX, to[0], e); cy = M.lerp(TOPY, to[1], e) - Math.sin(e * Math.PI) * 30; }
      else if (k < 0.8) { cx = to[0]; cy = to[1]; rot = 2.0 * M.easeIO(M.clamp((k - 0.3) / 0.15, 0, 1)) * (k < 0.72 ? 1 : 1 - (k - 0.72) / 0.08); fill = 1 - M.clamp((k - 0.42) / 0.36, 0, 1); }
      else { const e = M.easeIO((k - 0.8) / 0.2); cx = M.lerp(to[0], CX, e); cy = M.lerp(to[1], TOPY, e) - Math.sin(e * Math.PI) * 20; fill = i < 2 ? e : 0; }
      // the sand stream
      if (k > 0.42 && k < 0.8) { const lp = [cx + Math.cos(rot) * -RAD, cy + Math.sin(rot) * -RAD], sy = BOTY - lev * (BOTY - TOPY);
        c.save(); c.strokeStyle = SAND; c.lineWidth = 7 - Math.max(0, k - 0.7) * 40; c.lineCap = 'round'; c.beginPath(); c.moveTo(lp[0], lp[1]); for (let j = 1; j <= 8; j++) { const yy = M.lerp(lp[1], sy, j / 8); c.lineTo(lp[0] + Math.sin(t * 30 + j) * 1.5 + j * 1.2, yy); } c.stroke();
        c.fillStyle = SAND; for (let j = 0; j < 6; j++) { c.beginPath(); c.arc(lp[0] + 10 + Math.sin(t * 13 + j * 2) * 12, sy - 3 - Math.abs(Math.sin(t * 9 + j)) * 6, 2, 0, 7); c.fill(); } c.restore(); } }
    else if (u >= 3) fill = 0;
    c.save(); c.translate(cx, cy); c.rotate(rot); coneShape(c, fill, false); c.restore();
    // the pebbles that count the pours
    S.tally.forEach((t0, i) => { const k = M.clamp((t - t0) / 0.25, 0, 1), x = BX - 36 + i * 36, y = 528, sc = 1 + Math.sin(k * Math.PI) * 0.4; c.save(); c.translate(x, y); c.scale(sc, sc); c.globalAlpha = k;
      c.fillStyle = '#5a7a9a'; c.beginPath(); c.ellipse(0, 0, 15, 13, 0, 0, 7); c.fill(); c.fillStyle = '#fff'; c.font = M.NUMF(20, 700); c.textAlign = 'center'; c.fillText(String(i + 1), 0, 7); c.restore(); });
    // the working note, on a dark pill under the sign
    if (S.wk && g.s.mk.ex.wk) { const m = M.lay(S.wk, 28); c.save(); c.globalAlpha = (S.wk.alpha ?? 1) * M.clamp((t - S.wkAt) / 0.15, 0, 1); c.fillStyle = 'rgba(60,30,20,0.78)'; c.beginPath(); c.roundRect(180 - m.w / 2 - 14, NOTEY - 30, m.w + 28, 42, 21); c.fill(); c.restore(); M.drawEx(g, c, 'wk'); }
    // the octopus watches from the sand, and a crab scuttles
    const mk = S.mk, hopK = mk.lastMove != null && t - mk.lastMove < 0.35 ? Math.sin((t - mk.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : S.faceT != null && t - S.faceT < 0.6 ? S.face : 'happy';
    const pose = won ? 'cheer' : hopK > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    try { if (typeof ANI !== 'undefined') ANI.draw(c, 'octopus', 76, 610 - hopK * 22, 1.2, { t, pose, expr, tint: '#e86a7a' }); else SCN.host(g, c, 'octopus', 76, 610, 1.2); } catch (e) { SCN.host(g, c, 'octopus', 76, 610, 1.2); }
    M.drawUI(g, c);
  },
});
