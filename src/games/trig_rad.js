// trig_rad.js — RADIANS! Turn degrees into radians: d° = d × π/180, then simplify the fraction.
// A round pond at dusk, seen from above, with fireflies. A frog sits on a lily pad at the pond's edge. A green measuring tape
// is the pond's radius; the angle to convert is a dashed ray from the centre with its arc marked "150°".
// Moves (show your work: each one plays its working by itself while the fuse stands still):
//   1. Drag the radius tape onto the rim: copies of it peel off and wrap round the rim one after another, numbered 1, 2, 3,
//      then a little sliver (0.14) reaches exactly halfway round: half a turn is π radii. A sign writes itself: 180° = π.
//   2. Drag that sign onto the degrees: a copy of the number flies into the answer and π/180 flies in from the sign:
//      150° = 150 × π/180.
//   3. Tap the fraction: "÷ 30" writes itself beside the top and the bottom, they roll over to 5 and 6, the × melts, the
//      fraction folds into 5π/6, and on the pond a gold wedge sweeps out the angle with 5π/6 written at its rim.
// Level 0: 90°, 60°, 45°, 120°. Level 1: 30°, 135°, 150°, 270°. Level 2: 210°, 225°, 240°, 300°, 315°, 330°.
// Medium mode: the simplified answer is picked from the tray.
const M = MK, INK = '#fff4dc', TAPE = '#7ae08a', GOLD = '#ffd25a', NOTE = '#fff6e2', EQY = 226, CX = 180, CY = 412, R = 104, HX = 58, HY = 612, KEYY = 566;
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function pick(g) {
  const L = g.level, list = L === 0 ? [90, 60, 45, 120] : L === 1 ? [30, 135, 150, 270] : [210, 225, 240, 300, 315, 330], d = list[Math.floor(g.rand() * list.length)], k = gcd(d, 180);
  return { d, k, n: d / k, m: 180 / k };
}
// MK draws an empty slot without starting a new path, so it re-strokes the symbol before it dashed; a zero-width op first
// starts a fresh path.
const fresh = (slot, s) => M.row(M.op(''), M.gap(-0.44 * s), slot);
const kk = (g, a) => a ? M.clamp((g.t - a.t0) / a.dur, 0, 1) : 0;
const piFrac = (n, m) => M.frac(n === 1 ? M.vr('π') : M.row(M.num(n), M.vr('π')), M.num(m));
function put(g, c, n, cx, cy, s, col, alpha = 1) { const m = M.lay(n, s); c.save(); c.globalAlpha *= alpha; M.draw(c, n, cx - m.w / 2, cy + (m.a - m.d) / 2, s, { t: g.t, col }); c.restore(); }
function glowTag(g, c, n, cx, cy, s, col, alpha = 1) { if (alpha <= 0) return; c.save(); c.shadowColor = 'rgba(10,10,40,0.95)'; c.shadowBlur = 6; put(g, c, n, cx, cy, s, col, alpha); put(g, c, n, cx, cy, s, col, alpha); c.restore(); }
const RIM = a => [CX + Math.cos(a) * R, CY - Math.sin(a) * R]; // a point on the rim at angle a (radians, counter-clockwise)

MG.add({
  id: 'radians', stage: 'trig', cmd: 'RADIANS!', hint: 'drag', time: 9, winText: 'Wrapped!', hold: 1.8,
  card: {
    title: 'Radians', ref: 'Trigonometry', kind: 'Trigonometry',
    text: 'Degrees cut a full turn into 360 parts. Radians measure an angle with the circle itself: lay the radius along the rim, and the angle it covers is 1 radian (about 57°).\n\nHow many radii fit round half a circle? A little more than 3: exactly π of them. So half a turn, 180°, is π radians.\n\nThat gives the rule: multiply degrees by π/180. For example, 150° = 150 × π/180 = 150π/180. Divide the top and bottom by 30 to simplify: 5π/6.',
    note: '180° = π radians, so multiply by π/180 and simplify: d° = dπ/180.',
    ask: 'How many radians is 90°? How many is 300°?',
  },

  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g), T = M.pace(g), { d, k, n, m } = p;
    S.dv = M.num(d, 'dv'); S.dg = M.txt('°', 'dg'); S.deg = M.row(S.dv, S.dg); S.deg.id = 'deg'; S.eqN = M.op('=', 'eq'); S.ans = M.slot('ans', { w: 40 });
    S.fs = Math.min(42, 42 * 300 / M.lay(M.row(M.num(d), M.txt('°'), M.op('='), M.num(d), M.op('×'), M.frac(M.vr('π'), M.num(180))), 42).w);
    S.rhs = [fresh(S.ans, S.fs)];
    S.relay = () => M.place(g, 'eq', M.row(S.deg, S.eqN, ...S.rhs), 180, EQY, S.fs, { col: INK });
    S.relay(); M.inert(g, ['eq', 'dg']);
    M.zone(g, 'radius', { x: CX + R / 2, y: CY, w: R * 0.9, h: 34 });
    M.zone(g, 'rim', { x: CX, y: CY - R, w: 70, h: 40 });
    S.face = 'happy'; S.faceT = -9; S.hopT = -9; S.point = false;
    const hop = (g, e) => { S.hopT = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    g.dur *= (2.6 + 1.05 * 3) / 8;
    M.play(g, {
      moves(g) {
        const out = [];
        // 1. wrap radii round the rim: half a turn takes π of them
        if (!S.wrap) out.push({ drag: 'radius', to: 'rim', area: [CX - R - 30, CY - R - 30, CX + R + 30, CY + R + 20], busy: 0.1,
          then(g) { S.wrap = { t0: g.t + 0.1 * T, seg: 0.3 * T }; M.show(g, 1.65 * T); S.point = true; hop(g, 'think'); g.sfx('whoosh');
            for (let i = 0; i < 4; i++) M.at(g, [[0.1 * T + 0.3 * T * (i + 1), g => { g.sfx(i < 3 ? 'tap' : 'pop'); if (i < 3) hop(g); }]]);
            M.at(g, [[1.3 * T, g => { S.halfT = g.t; g.sfx('chime'); hop(g, 'laugh'); g.burst(...RIM(Math.PI), [TAPE, '#fff', GOLD], 12, 120); }],
              [1.25 * T, g => { S.key = M.row(M.num(180), M.txt('°'), M.op('='), M.vr('π')); S.key.id = 'key'; M.place(g, 'key', S.key, 222, KEYY, 30, { col: '#3a2410' }); M.writeIn(g, S.key, { dur: 0.35 * T }); S.keyT = g.t; }],
              [1.6 * T, g => { S.point = false; }]]); } });
        // 2. multiply by π/180
        else if (!S.conv) out.push({ drag: 'key', to: ['deg', 'dv', 'ans'], area: [10, EQY - 50, 350, EQY + 40], busy: 0.1,
          then(g) { S.conv = true; M.show(g, 1.0 * T); S.point = true; hop(g, 'think'); g.sfx('swoosh');
            const kb = { ...M.box(g, 'key') }, db = { ...M.box(g, 'dv') }; S.keyOut = g.t;
            S.c1 = M.num(d, 'c1', { alpha: 0 }); S.mx = M.op('×', 'mx', { alpha: 0 }); S.pi = M.vr('π', 'pi'); S.den = M.num(180, 'den'); S.fr = M.frac(S.pi, S.den, 'fr', { alpha: 0 });
            S.ans.alpha = 0; S.rhs = [S.c1, S.mx, S.fr]; S.relay();
            M.indicate(g, S.dv, { dur: 0.35 * T, col: GOLD });
            M.fly(g, { node: M.num(d), from: [db.x, db.y], to: 'c1', delay: 0.1 * T, dur: 0.4 * T, arc: -40, s0: S.fs, s1: S.fs, col: GOLD, then(g) { S.c1.alpha = 1; S.c1.pop = g.t; S.mx.alpha = 1; g.sfx('pop'); } });
            M.fly(g, { node: M.frac(M.vr('π'), M.num(180)), from: [kb.x + 20, kb.y], to: 'fr', delay: 0.3 * T, dur: 0.5 * T, arc: -80, s0: 30, s1: S.fs, col: TAPE,
              then(g) { S.fr.alpha = 1; S.fr.pop = g.t; M.sparkle(g, 'fr', { n: 10, cols: [TAPE, '#fff'] }); g.sfx('ding'); hop(g); } });
            M.at(g, [[0.35 * T, g => { delete g.s.mk.ex.key; }], [0.95 * T, g => { S.point = false; }]]); } });
        // 3. simplify: divide the top and bottom by their common factor
        else if (!S.simp) out.push({ tap: ['fr', 'c1', 'mx', 'pi', 'den'], busy: 0.1, askAt: 0.7 * T, after: 1.5 * T,
          ask: { v: piFrac(n, m), wrong: [piFrac(m, n), M.frac(M.num(n), M.num(m)), piFrac(n, m * 2)] },
          then(g) { S.simp = true; M.show(g, 0.7 * T); S.point = true; hop(g, 'think');
            M.circle(g, ['c1', 'fr'], { col: GOLD, dur: 0.5 * T }); M.light(g, S.c1, { col: GOLD }); M.light(g, S.den, { col: GOLD });
            M.note(g, { node: M.row(M.op('÷'), M.num(k)), at: 'c1', off: [0, 42], s: 20, col: NOTE, delay: 0.2 * T, write: 0.3 * T, hold: 0.85 * T, fade: 0.25 * T });
            M.note(g, { node: M.row(M.op('÷'), M.num(k)), at: 'den', off: [0, 40], s: 20, col: NOTE, delay: 0.3 * T, write: 0.3 * T, hold: 0.75 * T, fade: 0.25 * T }); },
          resolve(g) { M.show(g, 1.5 * T); g.sfx('ding');
            M.roll(g, S.c1, n, { delay: 0.1 * T, dur: 0.35 * T }); M.roll(g, S.den, m, { delay: 0.2 * T, dur: 0.35 * T });
            M.at(g, [[0.5 * T, g => { M.unlight(g, S.c1); M.unlight(g, S.den); M.tween(g, S.mx, { alpha: 0, sc: 0.5 }, 0.2 * T); if (n === 1) M.tween(g, S.c1, { alpha: 0, sc: 0.5 }, 0.2 * T); g.sfx('sweep'); }],
              [0.72 * T, g => { // the fraction folds into nπ/m: the number slides up beside π
                const top = n === 1 ? S.pi : M.row(S.c1, S.pi); S.res = M.frac(top, S.den, 'res'); S.rhs = [S.res]; S.relay(); M.inert(g, ['res']); g.sfx('swoosh'); hop(g); }],
              [0.9 * T, g => { S.wedge = { t0: g.t, dur: 0.5 * T }; g.sfx('whoosh'); }],
              [1.42 * T, g => { S.done = g.t; M.sparkle(g, 'res', { n: 12 }); const a = d * Math.PI / 180; g.burst(...RIM(a), [GOLD, '#fff', TAPE], 16, 150); g.sfx('coin'); hop(g, 'laugh'); S.point = false; }]]); } });
        return out;
      },
      area(g) { return !S.wrap ? ['radius'] : !S.conv ? ['key'] : ['fr']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, p = S.p, a = p.d * Math.PI / 180;
    c.drawImage(g.bake('rad_bg', (cc, W, H) => paintBg(cc, W, H)), 0, 0, 360, 640);
    ambient(c, t);
    // the gold wedge for the answer, sweeping from 0 to the angle
    if (S.wedge) { const k = M.easeIO(kk(g, S.wedge)); c.save(); c.fillStyle = 'rgba(255,210,90,0.35)'; c.strokeStyle = GOLD; c.lineWidth = 2; c.beginPath(); c.moveTo(CX, CY); c.arc(CX, CY, R, 0, -a * k, true); c.closePath(); c.fill(); c.restore(); }
    // the angle to convert: a dashed ray and a small arc near the centre, labelled in degrees
    c.save(); c.strokeStyle = 'rgba(255,244,220,0.85)'; c.lineWidth = 2.5; c.setLineDash([7, 6]); c.beginPath(); c.moveTo(CX, CY); c.lineTo(...RIM(a)); c.stroke(); c.setLineDash([]);
    c.strokeStyle = GOLD; c.lineWidth = 2.5; c.beginPath(); c.arc(CX, CY, 24, 0, -a, true); c.stroke(); c.restore();
    const la = a / 2; glowTag(g, c, M.row(M.num(p.d), M.txt('°')), CX + Math.cos(la) * 44, CY - Math.sin(la) * 44, 16, GOLD, S.done ? Math.max(0, 1 - (t - S.done) / 0.3) : 1);
    // the radius tape (it stays put; copies of it wrap round the rim)
    const tape = (pts, col, w = 7) => { c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = 'rgba(10,30,20,0.4)'; c.lineWidth = w + 3; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y + 2) : c.moveTo(x, y + 2)); c.stroke();
      c.strokeStyle = col; c.lineWidth = w; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = 1.5; c.setLineDash([2, 6]); c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore(); };
    tape([[CX, CY], [CX + R, CY]], TAPE);
    glowTag(g, c, M.vr('r'), CX + R / 2, CY + 16, 18, TAPE);
    // wrapping: each copy starts as the radius at the end of the last one and bends onto the rim, one radian long
    if (S.wrap) { const W = S.wrap, cols = ['#7ae08a', '#5ac8e8', '#c88af0', '#ff9a6a'], lens = [1, 1, 1, Math.PI - 3];
      let a0 = 0; for (let i = 0; i < 4; i++) { const k = M.easeIO(M.clamp((t - W.t0 - W.seg * i) / (W.seg * (i < 3 ? 1 : 0.7)), 0, 1)); if (k <= 0) break; const L = lens[i], pts = [];
        for (let j = 0; j <= 16; j++) { const s = j / 16, st = [CX + Math.cos(a0) * R * (1 - s * L), CY - Math.sin(a0) * R * (1 - s * L)], ar = RIM(a0 + s * L); pts.push([M.lerp(st[0], ar[0], k), M.lerp(st[1], ar[1], k)]); }
        tape(pts, cols[i], 6);
        if (k > 0.85) { const mid = a0 + L / 2, al = (k - 0.85) / 0.15; glowTag(g, c, i < 3 ? M.num(i + 1) : M.txt('0.14'), CX + Math.cos(mid) * (R + (i < 3 ? 18 : 30)), CY - Math.sin(mid) * (R + (i < 3 ? 18 : 22)), i < 3 ? 18 : 14, cols[i], al); }
        a0 += L; } }
    // half a turn: the diameter lights up and "π" sits over the top of the half circle
    if (S.halfT != null) { const k = M.clamp((t - S.halfT) / 0.35, 0, 1), fade = S.done ? 0.5 : 1; c.save(); c.globalAlpha = fade; c.strokeStyle = '#fff'; c.lineWidth = 2; c.setLineDash([3, 5]); c.beginPath(); c.moveTo(CX + R, CY); c.lineTo(CX + R - 2 * R * k, CY); c.stroke(); c.restore();
      glowTag(g, c, M.vr('π'), CX - R * 0.42, CY - R * 0.42, 30 * (1 + Math.sin(k * Math.PI) * 0.4), '#fff', k * fade); }
    c.fillStyle = '#fff4dc'; c.beginPath(); c.arc(CX, CY, 4, 0, 7); c.fill();
    // the answer at the rim once found
    if (S.done) { const k = M.clamp((t - S.done) / 0.35, 0, 1), lx = CX + Math.cos(a) * (R + 30), ly = CY - Math.sin(a) * (R + 26);
      glowTag(g, c, piFrac(p.n, p.m), M.clamp(lx, 40, 320), ly, 22 * (1 + Math.sin(k * Math.PI) * 0.35), GOLD, k); }
    // the key sign by the pond: 180° = π
    if (S.mk.ex.key) { const b = M.box(g, 'key'), out = S.keyOut ? M.clamp((t - S.keyOut) / 0.3, 0, 1) : 0, inn = M.clamp((t - S.keyT) / 0.25, 0, 1);
      if (b) { c.save(); c.globalAlpha = inn * (1 - out); c.fillStyle = 'rgba(20,10,30,0.35)'; c.beginPath(); c.roundRect(b.x - b.w / 2 - 14, b.y - b.h / 2 - 6, b.w + 28, b.h + 16, 10); c.fill();
        c.fillStyle = '#d8b07a'; c.beginPath(); c.roundRect(b.x - b.w / 2 - 14, b.y - b.h / 2 - 10, b.w + 28, b.h + 16, 10); c.fill(); c.fillStyle = '#8a5a30'; c.fillRect(b.x - 3, b.y + b.h / 2 + 6, 6, 20); c.restore();
        if (!out) M.drawEx(g, c, 'key'); } }
    M.drawEx(g, c, 'eq');
    // the frog points while the work is shown, and hops when a step lands
    const hk = t - S.hopT < 0.35 ? Math.sin((t - S.hopT) / 0.35 * Math.PI) : 0, won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    const expr = won ? 'laugh' : lost ? 'sad' : t - S.faceT < 0.6 ? S.face : 'happy', pose = won ? 'cheer' : hk > 0 ? 'hop' : S.point && M.showing(g) ? 'point' : 'idle';
    c.save(); c.fillStyle = '#3a8a4a'; c.beginPath(); c.ellipse(HX, HY + 4, 44, 16, 0, 0.3, Math.PI * 2 - 0.1); c.lineTo(HX, HY + 4); c.closePath(); c.fill(); c.restore();
    if (typeof ANI !== 'undefined') ANI.draw(c, 'frog', HX, HY - hk * 24, 1.1, { t, pose, expr }); else SCN.host(g, c, 'frog', HX, HY, 1.1);
    M.drawUI(g, c);
  },
});
function paintBg(c, W, H) {
  // dusk over the marsh: indigo to peach
  const sk = c.createLinearGradient(0, 0, 0, 260); sk.addColorStop(0, '#1e1a4a'); sk.addColorStop(0.55, '#5a3a7a'); sk.addColorStop(1, '#d88a7a'); c.fillStyle = sk; c.fillRect(0, 0, W, H);
  for (let i = 0; i < 30; i++) { c.fillStyle = `rgba(255,255,255,${0.3 + (i % 3) * 0.2})`; c.beginPath(); c.arc((i * 73) % W, (i * 41) % 140, 0.8 + (i % 2) * 0.6, 0, 7); c.fill(); }
  // the marsh bank, seen from above, with reeds
  const bk = c.createLinearGradient(0, 250, 0, H); bk.addColorStop(0, '#2e4a3a'); bk.addColorStop(1, '#1e3428'); c.fillStyle = bk; c.fillRect(0, 252, W, H - 252);
  for (let i = 0; i < 90; i++) { const x = (i * 41) % W, y = 262 + (i * 67) % (H - 270); c.strokeStyle = i % 2 ? 'rgba(120,170,100,0.45)' : 'rgba(70,120,70,0.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 3, y - 8, x + 1, y - 16); c.stroke(); }
  // the round pond
  c.fillStyle = 'rgba(10,20,15,0.5)'; c.beginPath(); c.arc(CX, CY + 4, R + 12, 0, 7); c.fill();
  const pg = c.createRadialGradient(CX - 30, CY - 30, 10, CX, CY, R + 8); pg.addColorStop(0, '#3a7a9a'); pg.addColorStop(1, '#1a3a5a'); c.fillStyle = pg; c.beginPath(); c.arc(CX, CY, R + 8, 0, 7); c.fill();
  c.strokeStyle = '#8a7a5a'; c.lineWidth = 5; c.beginPath(); c.arc(CX, CY, R + 8, 0, 7); c.stroke();
  for (let i = 0; i < 18; i++) { const an = i / 18 * Math.PI * 2; c.fillStyle = i % 2 ? '#9a8a6a' : '#7a6a4a'; c.beginPath(); c.ellipse(CX + Math.cos(an) * (R + 12), CY + Math.sin(an) * (R + 12), 9, 6, an, 0, 7); c.fill(); }
  // the dock sign for the problem
  c.fillStyle = 'rgba(10,6,20,0.4)'; c.beginPath(); c.roundRect(16, 188, 336, 64, 12); c.fill();
  c.fillStyle = '#6a4228'; c.beginPath(); c.roundRect(10, 180, 340, 66, 12); c.fill();
  for (let k = 0; k < 3; k++) { c.fillStyle = k % 2 ? '#7a4e30' : '#704630'; c.fillRect(16, 186 + k * 18, 328, 17); }
  c.fillStyle = '#c8a070'; for (const x of [24, 336]) for (const y of [194, 232]) { c.beginPath(); c.arc(x, y, 2.5, 0, 7); c.fill(); }
}
function ambient(c, t) {
  // fireflies drift and blink; ripples spread on the pond
  for (let i = 0; i < 12; i++) { const x = (i * 67 + Math.sin(t * 0.5 + i) * 30 + 400) % 360, y = 270 + (i * 53) % 340 + Math.sin(t * 0.8 + i * 2) * 12, b = 0.5 + 0.5 * Math.sin(t * 3 + i * 1.7);
    c.save(); c.globalAlpha = 0.3 + 0.7 * b; c.fillStyle = '#fff6a0'; c.shadowColor = '#ffe860'; c.shadowBlur = 10; c.beginPath(); c.arc(x, y, 1.8, 0, 7); c.fill(); c.restore(); }
  for (let i = 0; i < 2; i++) { const k = ((t * 0.4 + i * 0.5) % 1), x = CX - 40 + i * 70, y = CY + 40 - i * 70; c.save(); c.globalAlpha = 0.35 * (1 - k); c.strokeStyle = '#bfe6f0'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y, 6 + k * 26, 3 + k * 13, 0, 0, 7); c.stroke(); c.restore(); }
}
