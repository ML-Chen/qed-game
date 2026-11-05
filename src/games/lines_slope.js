// lines_slope.js — SLOPE! The slope through two points: m = (y₂ − y₁) / (x₂ − x₁), on a notebook page in the city.
// Moves (any valid order): drag one y-value onto the other: the numerator becomes y₂ − y₁ (the rise). Drag one x-value
// onto the other: the denominator becomes x₂ − x₁ (the run). Tap each subtraction to compute it, then tap the
// fraction to divide. A small graph beside the formula draws the two points, the run and the rise as they are made,
// and the whole line once the slope is found.
// Level 0: small positive points, rising line. Level 1: the line may fall. Level 2: negative coordinates, and the
// points may be listed right to left (both differences come out negative).
// Medium mode: the rise, the run and the quotient open a tray.
const M = MK, INK = SCN.ink('paper'), CA = '#d8642a', CB = '#2a72b0', RISE = '#b0307a', RUN = '#2f8a4a';
function pick(g) {
  const L = g.level, r = (a, b) => a + Math.floor(g.rand() * (b - a + 1));
  for (;;) {
    let m = L === 0 ? r(1, 3) : [-3, -2, -1, 2, 3][r(0, 4)], run = L === 0 ? r(1, 3) : r(2, 4);
    let x1 = L === 2 ? r(-4, 0) : r(0, 3), y1 = L === 2 ? r(-4, 2) : m < 0 ? -m * run + r(0, 2) : r(0, 3);
    if (L === 2 && g.rand() < 0.5) m = -m;
    let x2 = x1 + run, y2 = y1 + m * run;
    if (Math.abs(y2) > 12 || (L < 2 && y2 < 0)) continue;
    if (L === 2 && g.rand() < 0.5) [x1, y1, x2, y2] = [x2, y2, x1, y1]; // listed right to left
    if (L === 2 && Math.min(x1, x2, y1, y2) >= 0) continue;
    return { x1, y1, x2, y2, rise: y2 - y1, run: x2 - x1, m };
  }
}
const sub = (a, b, col, id) => { const r = M.row(M.num(a, null, { col }), M.op('-', null, { col }), b < 0 ? M.paren(M.num(b), null, { col }) : M.num(b, null, { col })); r.id = id; return r; };

MG.add({
  id: 'lines_slope', stage: 'lines', cmd: 'SLOPE!', hint: 'drag', time: 10, winText: 'Steep!', hold: 1.4,
  card: {
    title: 'Slope from two points', ref: 'Grade 8', kind: 'Algebra 1',
    text: 'The slope of a line tells you how steep it is. It is the rise divided by the run. The rise is how far the line goes up, and the run is how far it goes to the right.\n\nTo find the slope through two points, subtract the y-values to get the rise. Subtract the x-values in the same order to get the run. Then divide.\n\nFor example, for (1, 2) and (4, 8), the rise is 8 − 2 = 6 and the run is 4 − 1 = 3. The slope is 6/3 = 2: the line goes up 2 for every 1 step to the right.\n\nA straight line climbs at the same rate everywhere, so any two of its points give the same slope. A negative slope means the line goes down.',
    note: 'm = (y₂ − y₁) / (x₂ − x₁). Subtract the y-values and the x-values in the same order, then divide.',
    ask: 'What is the slope through (2, 1) and (5, 10)? What is the slope through (0, 4) and (2, 0)?',
  },
  init(g) {
    const S = g.s; M.setup(g); const p = S.p = pick(g);
    const pt = (x, y, k, col) => M.paren(M.row(M.num(x, 'x' + k, { col }), M.op(',', 'cm' + k, { col }), M.gap(6), M.num(y, 'y' + k, { col })), 'p' + k, { col });
    S.pa = pt(p.x1, p.y1, 1, CA); S.pb = pt(p.x2, p.y2, 2, CB);
    S.fr = M.frac(M.slot('ns', { col: RISE }), M.slot('ds', { col: RUN }), 'fr');
    S.eq = M.row(M.vr('m', 'mv'), M.op('=', 'eq'), S.fr);
    const place = S.place = () => { M.place(g, 'pa', S.pa, 112, 236, 30, { col: INK }); M.place(g, 'pb', S.pb, 264, 236, 30, { col: INK }); M.place(g, 'eq', S.eq, 112, 344, 38, { col: INK }); };
    place(); M.inert(g, ['p1', 'p2', 'cm1', 'cm2', 'mv', 'eq']);
    g.dur *= (2.6 + 1.05 * 5) / 8;
    const pop = (g, id, col) => { const b = M.box(g, id); if (b) g.burst(b.x, b.y, [col, '#fff', '#ffd45a'], 10, 110); };
    M.play(g, {
      moves(g) {
        const out = [];
        const dy = { busy: 0.1, then(g) { S.ny = g.t; S.fr.n = sub(p.y2, p.y1, RISE, 'nc'); place(); pop(g, 'nc', RISE); g.sfx('sweep'); } };
        const dx = { busy: 0.1, then(g) { S.nx = g.t; S.fr.d = sub(p.x2, p.x1, RUN, 'dc'); place(); pop(g, 'dc', RUN); g.sfx('sweep'); } };
        if (!S.ny) out.push({ drag: 'y1', to: ['y2', 'ns'], ...dy }, { drag: 'y2', to: ['y1', 'ns'], ...dy });
        if (!S.nx) out.push({ drag: 'x1', to: ['x2', 'ds'], ...dx }, { drag: 'x2', to: ['x1', 'ds'], ...dx });
        if (S.ny && !S.ty) out.push({ tap: 'nc', busy: 0.1, ask: { v: p.rise, wrong: [p.y2 + p.y1, -p.rise, p.run] }, then() { S.ty = 1; },
          resolve(g) { S.fr.n = M.num(p.rise, 'nv', { col: RISE, pop: g.t }); S.vy = g.t; place(); g.sfx('coin'); } });
        if (S.nx && !S.tx) out.push({ tap: 'dc', busy: 0.1, ask: { v: p.run, wrong: [p.x2 + p.x1, -p.run, p.rise] }, then() { S.tx = 1; },
          resolve(g) { S.fr.d = M.num(p.run, 'dv', { col: RUN, pop: g.t }); S.vx = g.t; place(); g.sfx('coin'); } });
        if (S.vy && S.vx && !S.tm) out.push({ tap: ['fr', 'nv', 'dv'], busy: 0.1, ask: { v: p.m, wrong: [p.rise === p.run ? null : M.frac(M.num(p.run), M.num(p.rise)), -p.m, p.rise - p.run, p.rise * p.run] },
          then() { S.tm = 1; }, resolve(g) { S.eq = M.row(M.vr('m', 'mv'), M.op('=', 'eq'), M.num(p.m, 'mres', { pop: g.t })); M.inert(g, ['mres']); S.win = g.t; place(); pop(g, 'mres', '#ffd45a'); g.sfx('chime'); } });
        return out;
      },
      area(g) { return !S.ny ? ['y1', 'y2'] : !S.nx ? ['x1', 'x2'] : !S.vy ? ['nc'] : !S.vx ? ['dc'] : ['fr']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, p = S.p, t = g.t;
    SCN.std(g, c, { scene: 'city', panel: 'paper', host: 'bird', hostX: 300, hostY: 590, hostS: 1.3, panelY: 292, panelH: 228 });
    // the little graph: a square grid fitted around both points, with the axes when they are in view
    const X0 = 204, X1 = 338, Y0 = 262, Y1 = 396;
    const xa = Math.min(p.x1, p.x2) - 1, xb = Math.max(p.x1, p.x2) + 1, ya = Math.min(p.y1, p.y2) - 1, yb = Math.max(p.y1, p.y2) + 1;
    let ux = (X1 - X0) / (xb - xa), uy = (Y1 - Y0) / (yb - ya); ux = Math.min(ux, uy * 2.2); uy = Math.min(uy, ux * 2.2); // cells at most a little stretched
    const ox = (X0 + X1) / 2 - (xa + xb) / 2 * ux, oy = (Y0 + Y1) / 2 + (ya + yb) / 2 * uy;
    const PX = x => ox + x * ux, PY = y => oy - y * uy;
    c.save(); c.beginPath(); c.rect(PX(xa), PY(yb), (xb - xa) * ux, (yb - ya) * uy); c.clip();
    c.fillStyle = 'rgba(230,242,255,0.8)'; c.fillRect(PX(xa), PY(yb), (xb - xa) * ux, (yb - ya) * uy);
    c.strokeStyle = 'rgba(80,140,200,0.35)'; c.lineWidth = 1;
    for (let x = xa; x <= xb; x++) { c.beginPath(); c.moveTo(PX(x), PY(ya)); c.lineTo(PX(x), PY(yb)); c.stroke(); }
    for (let y = ya; y <= yb; y++) { c.beginPath(); c.moveTo(PX(xa), PY(y)); c.lineTo(PX(xb), PY(y)); c.stroke(); }
    c.strokeStyle = 'rgba(42,36,64,0.7)'; c.lineWidth = 2;
    if (xa <= 0 && xb >= 0) { c.beginPath(); c.moveTo(PX(0), PY(ya)); c.lineTo(PX(0), PY(yb)); c.stroke(); }
    if (ya <= 0 && yb >= 0) { c.beginPath(); c.moveTo(PX(xa), PY(0)); c.lineTo(PX(xb), PY(0)); c.stroke(); }
    // the whole line, once the slope is found
    if (S.win) { const k = M.ease((t - S.win) / 0.3), cx = (p.x1 + p.x2) / 2, cy = (p.y1 + p.y2) / 2, L = (xb - xa) * k;
      c.strokeStyle = '#ffb02a'; c.lineWidth = 3; c.beginPath(); c.moveTo(PX(cx - L), PY(cy - L * p.m)); c.lineTo(PX(cx + L), PY(cy + L * p.m)); c.stroke(); }
    c.restore();
    // run (along from the first point) and rise (up to the second point), drawn as they are written
    c.save(); c.lineCap = 'round'; c.lineWidth = 4;
    if (S.nx) { const k = M.ease((t - S.nx) / 0.25); c.strokeStyle = RUN; c.beginPath(); c.moveTo(PX(p.x1), PY(p.y1)); c.lineTo(PX(p.x1 + p.run * k), PY(p.y1)); c.stroke(); }
    if (S.ny) { const k = M.ease((t - S.ny) / 0.25); c.strokeStyle = RISE; c.beginPath(); c.moveTo(PX(p.x2), PY(p.y1)); c.lineTo(PX(p.x2), PY(p.y1 + p.rise * k)); c.stroke(); }
    c.font = '700 14px Fredoka, Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    const lab = (s, x, y, col) => { c.fillStyle = 'rgba(255,253,244,0.9)'; c.beginPath(); c.arc(x, y, 10, 0, 7); c.fill(); c.fillStyle = col; c.fillText(String(s).replace('-', '−'), x, y + 1); };
    if (S.vx) lab(p.run, PX(p.x1 + p.run / 2), PY(p.y1) + (p.rise > 0 ? 12 : -12), RUN);
    if (S.vy) lab(p.rise, PX(p.x2) + (p.run > 0 ? 13 : -13), PY(p.y1 + p.rise / 2), RISE);
    for (const [x, y, col] of [[p.x1, p.y1, CA], [p.x2, p.y2, CB]]) { c.fillStyle = '#fff'; c.beginPath(); c.arc(PX(x), PY(y), 6.5, 0, 7); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(PX(x), PY(y), 4.5 + Math.sin(t * 4) * 0.6, 0, 7); c.fill(); }
    c.restore();
    M.drawEx(g, c, 'pa'); M.drawEx(g, c, 'pb'); M.drawEx(g, c, 'eq');
    M.drawUI(g, c);
  },
});
