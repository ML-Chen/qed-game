// FIREBREAK! (chem_bio FP-04) — a dry meadow seen from above, split into fields by creeks, with a farm building at the
// foot of every field. A fire starts at the top of each field (one after another) and creeps tuft to tuft toward the
// farm: every burning tuft heats its neighbours until they catch. Drag across a field to rake a strip of bare earth.
// When the fire reaches the strip there is nothing left to heat and it dies there; the building stays safe (a green
// tick). A strip with a gap lets the fire through, the barn catches and the rabbit runs for the pond.
// Level 0: two fields; level 1: three; level 2: three fields and a wind that blows sparks two tufts ahead, so the
// strip must be two rows wide (two passes, or one along a row edge).
(() => {
  const C = 16, X0 = 4, Y0 = 150, ROWS = 23, COLS = 22, BR = 9;
  const cx = c => X0 + c * C + C / 2, cy = r => Y0 + r * C + C / 2;
  const GRASS = 0, BURN = 1, ASH = 2, BARE = 3, WATER = 4;
  function fieldsFor(lv) { const creeks = lv === 0 ? [11] : [7, 14], f = []; let a = 0; for (const k of creeks.concat([COLS])) { f.push([a, k - 1]); a = k + 1; } return { creeks, f }; }
  function paintBg(o, lv) {
    const { creeks } = fieldsFor(lv);
    // the forest edge at the top, seen from above: a canopy of dusky crowns under an evening haze
    const sk = o.createLinearGradient(0, 0, 0, Y0); sk.addColorStop(0, '#3a1830'); sk.addColorStop(1, '#6a3a3a'); o.fillStyle = sk; o.fillRect(0, 0, 360, Y0);
    const r = P.rng(31);
    for (let i = 0; i < 60; i++) { const x = r() * 380 - 10, y = 30 + r() * (Y0 - 28), rr = 14 + r() * 16; const gr = o.createRadialGradient(x - rr * 0.3, y - rr * 0.3, 2, x, y, rr); gr.addColorStop(0, '#6a7a3a'); gr.addColorStop(1, '#2a3a24'); o.fillStyle = gr; o.beginPath(); o.arc(x, y, rr, 0, 7); o.fill(); }
    // the meadow: a tuft of dry golden grass in every cell
    o.fillStyle = '#c89a48'; o.fillRect(0, Y0 - 4, 360, ROWS * C + 8);
    for (let rr = 0; rr < ROWS; rr++) for (let c = 0; c < COLS; c++) {
      const x = cx(c), y = cy(rr); if (creeks.includes(c)) continue;
      o.fillStyle = P.mix('#d8b060', '#b88a3a', r()); o.beginPath(); o.ellipse(x, y + 2, 8, 6, 0, 0, 7); o.fill();
      o.strokeStyle = P.mix('#f4d888', '#a87a30', r()); o.lineWidth = 1.6; o.lineCap = 'round';
      for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.45 + (r() - 0.5) * 0.3, L = 6 + r() * 4; o.beginPath(); o.moveTo(x, y + 4); o.quadraticCurveTo(x + Math.cos(a) * L * 0.5, y + 4 + Math.sin(a) * L * 0.5, x + Math.cos(a) * L, y + 3 + Math.sin(a) * L); o.stroke(); }
    }
    // creeks: water runs between the fields
    for (const k of creeks) { const x = X0 + k * C; const wg = o.createLinearGradient(x, 0, x + C, 0); wg.addColorStop(0, '#2a6a8a'); wg.addColorStop(0.5, '#5ab4d4'); wg.addColorStop(1, '#2a6a8a');
      o.fillStyle = wg; o.beginPath(); o.moveTo(x - 2, Y0 - 30); for (let y = Y0 - 30; y <= Y0 + ROWS * C + 16; y += 10) o.lineTo(x - 2 + Math.sin(y * 0.08) * 2, y); for (let y = Y0 + ROWS * C + 16; y >= Y0 - 30; y -= 10) o.lineTo(x + C + 2 + Math.sin(y * 0.08 + 1) * 2, y); o.closePath(); o.fill();
      o.strokeStyle = 'rgba(255,255,255,0.45)'; o.lineWidth = 1.2; for (let y = Y0; y < Y0 + ROWS * C; y += 22) { o.beginPath(); o.moveTo(x + 4, y); o.lineTo(x + 10, y + 6); o.stroke(); }
      for (let i = 0; i < 8; i++) { o.fillStyle = '#9a9080'; o.beginPath(); o.ellipse(x + (r() < 0.5 ? 0 : C), Y0 + r() * ROWS * C, 3, 2, 0, 0, 7); o.fill(); } }
    // the farmyard below: packed earth, a fence, and a pond on the left
    const yd = Y0 + ROWS * C + 4; const fg = o.createLinearGradient(0, yd, 0, 640); fg.addColorStop(0, '#8ab060'); fg.addColorStop(1, '#5a8a40'); o.fillStyle = fg; o.fillRect(0, yd, 360, 640 - yd);
    o.strokeStyle = '#7a5434'; o.lineWidth = 3; o.beginPath(); o.moveTo(0, yd + 4); o.lineTo(360, yd + 4); o.stroke(); for (let x = 6; x < 360; x += 24) { o.fillStyle = '#8a6440'; o.fillRect(x, yd - 2, 4, 12); }
    const pg = o.createRadialGradient(36, 604, 4, 36, 604, 40); pg.addColorStop(0, '#7ad0f0'); pg.addColorStop(1, '#2a7aa0'); o.fillStyle = pg; o.beginPath(); o.ellipse(34, 606, 40, 20, 0, 0, 7); o.fill();
    P.grassTufts(o, 360, yd + 20, 636, 18, '#3a7a28', 5);
  }
  function building(c, kind, x, y, t, burning, safe) {
    if (kind === 0) P.house(c, x - 30, y, 60, 40, '#f0d8b0', { door: '#5a6ab0' });
    else if (kind === 1) { // a red barn
      c.save(); c.translate(x, y); c.fillStyle = '#c83a30'; c.strokeStyle = '#5a1a14'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-30, 0); c.lineTo(-30, -34); c.lineTo(-18, -50); c.lineTo(18, -50); c.lineTo(30, -34); c.lineTo(30, 0); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = '#fff6ea'; c.lineWidth = 2.5; c.strokeRect(-11, -26, 22, 26); c.beginPath(); c.moveTo(-11, -26); c.lineTo(11, 0); c.moveTo(11, -26); c.lineTo(-11, 0); c.stroke(); c.restore();
    } else { // a haystack and a cart
      c.save(); c.translate(x, y); const hg = c.createLinearGradient(0, -44, 0, 0); hg.addColorStop(0, '#f8d870'); hg.addColorStop(1, '#c89a30'); c.fillStyle = hg; c.strokeStyle = '#7a5a1a'; c.lineWidth = 2; c.beginPath(); c.moveTo(-28, 0); c.quadraticCurveTo(-30, -44, 0, -46); c.quadraticCurveTo(30, -44, 28, 0); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = 'rgba(122,90,26,0.6)'; c.lineWidth = 1.2; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-22 + i * 9, -4); c.lineTo(-18 + i * 7, -34); c.stroke(); } c.restore();
    }
    if (burning) for (let i = 0; i < 4; i++) flame(c, x - 20 + i * 13, y - 26 - (i % 2) * 10, 1.6, t, i * 1.7);
    if (safe) { c.save(); c.fillStyle = '#3ab060'; c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.beginPath(); c.arc(x + 26, y - 50, 13, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.moveTo(x + 20, y - 50); c.lineTo(x + 25, y - 45); c.lineTo(x + 33, y - 56); c.stroke(); c.restore(); }
  }
  function flame(c, x, y, s, t, ph) {
    const f = Math.sin(t * 14 + ph) * 0.15, h = (12 + 4 * Math.sin(t * 9 + ph * 2)) * s;
    c.fillStyle = '#ff6a1a'; c.beginPath(); c.moveTo(x - 6 * s, y + 4 * s); c.quadraticCurveTo(x - 7 * s, y - h * 0.4, x + f * 10, y - h); c.quadraticCurveTo(x + 7 * s, y - h * 0.4, x + 6 * s, y + 4 * s); c.closePath(); c.fill();
    c.fillStyle = '#ffd45a'; c.beginPath(); c.moveTo(x - 3 * s, y + 3 * s); c.quadraticCurveTo(x - 3.5 * s, y - h * 0.3, x + f * 6, y - h * 0.62); c.quadraticCurveTo(x + 3.5 * s, y - h * 0.3, x + 3 * s, y + 3 * s); c.closePath(); c.fill();
  }
  function rake(c, x, y, a) { c.save(); c.translate(x, y); c.rotate(a); c.strokeStyle = '#8a5a2a'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.lineTo(30, -38); c.stroke(); c.strokeStyle = '#5a5a6a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-14, 4); c.lineTo(14, -4); c.stroke(); for (let i = 0; i < 6; i++) { const k = -14 + i * 5.6; c.beginPath(); c.moveTo(k, 4 - i * 1.6); c.lineTo(k - 2, 11 - i * 1.6); c.stroke(); } c.restore(); }
  // the neighbours a burning tuft can light: four around it, and with wind (level 2) the tuft two rows downwind
  function spreadTo(s, i) { const r = Math.floor(i / COLS), c = i % COLS, out = [];
    for (const [dr, dc, d] of [[1, 0, 1], [-1, 0, 1.6], [0, 1, 1.15], [0, -1, 1.15]]) { const rr = r + dr, cc = c + dc; if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) out.push([rr * COLS + cc, d]); }
    if (s.wind && r + 2 < ROWS) out.push([(r + 2) * COLS + c, 2.0]);
    return out; }
  // can the fire still reach the bottom row of field f?
  function reachable(s, f) { const [a, b] = s.fields[f], seen = new Uint8Array(ROWS * COLS), q = [];
    for (let r = 0; r < ROWS; r++) for (let c = a; c <= b; c++) { const i = r * COLS + c; if (s.st[i] === BURN || (s.st[i] === GRASS && s.ig[i] < 1e8)) { seen[i] = 1; q.push(i); } }
    while (q.length) { const i = q.pop(); if (Math.floor(i / COLS) === ROWS - 1) return true; for (const [j] of spreadTo(s, i)) if (!seen[j] && s.st[j] === GRASS) { seen[j] = 1; q.push(j); } }
    return false; }
  function ignite(g, i) { const s = g.s; s.st[i] = BURN; s.bt[i] = g.t; for (const [j, d] of spreadTo(s, i)) if (s.st[j] === GRASS) { const at = g.t + s.D * (s.ff ? 0.22 : 1) * d * (0.85 + 0.3 * g.rand()); if (at < s.ig[j]) { s.ig[j] = at; if (d === 2.0) s.sparks.push({ a: i, b: j, t: g.t }); } } }
  function rakeAt(g, x, y) { const s = g.s; let n = 0;
    const c0 = Math.max(0, Math.floor((x - X0 - BR) / C)), c1 = Math.min(COLS - 1, Math.floor((x - X0 + BR) / C)), r0 = Math.max(0, Math.floor((y - Y0 - BR) / C)), r1 = Math.min(ROWS - 1, Math.floor((y - Y0 + BR) / C));
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) { const i = r * COLS + c; if (s.st[i] === GRASS && SK.dist(x, y, cx(c), cy(r)) <= BR) { s.st[i] = BARE; s.rt[i] = g.t; n++; } }
    if (n) { s.raked += n; if (g.t - s.rustle > 0.12) { s.rustle = g.t; g.sfx('rustle', { vol: 0.5 }); } if (s.bits.length < 40) s.bits.push({ x, y, vx: (g.rand() - 0.5) * 80, vy: -40 - g.rand() * 50, life: 0.45 }); } }
  // the hint: the field in most danger, and the row (or two rows, with wind) to rake across it
  function plan(s) {
    let best = null;
    s.fields.forEach(([a, b], f) => { if (s.safe[f]) return; const start = s.start[f]; if (!best || start < best.start) best = { f, a, b, start }; });
    if (!best) return null; const { f, a, b } = best, w = s.wind ? 2 : 1;
    let front = -1; for (let r = 0; r < ROWS; r++) for (let c = a; c <= b; c++) { const st = s.st[r * COLS + c]; if (st === BURN || st === ASH) front = Math.max(front, r); }
    const lo = Math.max(9, front + 3), hi = ROWS - 1 - w;
    let rb = SK.clamp(17, lo, hi), score = -1; // prefer the rows the player has already started raking
    for (let r = Math.min(lo, hi); r <= hi; r++) { let n = 0; for (let k = 0; k < w; k++) for (let c = a; c <= b; c++) if (s.st[(r + k) * COLS + c] === BARE) n++; if (n > score) { score = n; rb = r; } }
    if (score <= 0) rb = SK.clamp(17, Math.min(lo, hi), hi);
    // the stretch of the band with grass still in it; with two rows, one pass along their shared edge rakes both
    let c0 = -1, c1 = -1; const rows = new Set();
    for (let k = 0; k < w; k++) for (let c = a; c <= b; c++) if (s.st[(rb + k) * COLS + c] === GRASS) { if (c0 < 0 || c < c0) c0 = c; c1 = Math.max(c1, c); rows.add(k); }
    if (c0 < 0) { c0 = a; c1 = b; }
    const y = rows.size === 1 ? cy(rb + [...rows][0]) : Y0 + rb * C + w * C / 2;
    return { f, rb, w, x0: Math.max(cx(c0) - 10, X0 + a * C + 2), x1: Math.min(cx(c1) + 10, X0 + (b + 1) * C - 2), y, bx0: X0 + a * C, bx1: X0 + (b + 1) * C };
  }
  MG.add({
    id: 'firebreak', stage: 'fire', cmd: 'RAKE A STRIP ACROSS EACH FIELD!', time: 6, mood: 'storm', winText: 'The fire ran out of fuel!', failText: 'The fire got through!',
    card: { title: 'A gap with nothing to burn', kind: 'Chemistry', ref: 'Firebreaks and how fire spreads',
      text: 'A grass fire moves because each burning tuft heats the tufts next to it until they catch fire too. So the fire walks from fuel to fuel.\n\nA firebreak is a strip with no fuel, such as raked bare earth, a road or a stream. When the fire reaches it, there is nothing next to the flames that can catch, so the fire dies there.\n\nWind carries sparks ahead of the flames. On windy days a firebreak must be wider, or a spark lands on the far side and starts a new fire. Firefighters cut firebreaks to protect homes and farms.',
      note: 'Fire spreads by heating the fuel next to it, so a strip with nothing to burn stops it.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.lv = lv; s.v = SK.variant(g, 4);
      const { creeks, f } = fieldsFor(lv); s.fields = f; s.wind = lv >= 2; s.D = [0.5, 0.46, 0.46][lv];
      s.st = new Array(ROWS * COLS).fill(GRASS); s.ig = new Array(ROWS * COLS).fill(1e9); s.bt = new Array(ROWS * COLS).fill(0); s.rt = new Array(ROWS * COLS).fill(0);
      for (let r = 0; r < ROWS; r++) for (const k of creeks) s.st[r * COLS + k] = WATER;
      const gaps = lv === 0 ? [0, 2.6] : [0, 2.6, 5.4], order = [[0, 1, 2], [1, 0, 2], [2, 0, 1], [1, 2, 0]][s.v].filter(i => i < f.length);
      s.start = f.map((_, i) => gaps[order.indexOf(i)]);
      f.forEach(([a, b], i) => { const c = a + 1 + Math.floor(g.rand() * (b - a - 1)); s.ig[c] = s.start[i]; });
      s.kinds = SK.shuffled(g, [0, 1, 2]).slice(0, f.length); s.safe = f.map(() => false); s.lost = -1;
      s.ff = 0; s.sparks = []; s.bits = []; s.raked = 0; s.rustle = -9; s.last = null; s.lostT = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (y > Y0 - 10 && y < Y0 + ROWS * C + 10) { s.last = [x, y]; s.ang = 0; rakeAt(g, x, y); } },
    move(g, x, y) { const s = g.s; if (!s.last || g.done) return; const [x0, y0] = s.last, L = SK.dist(x0, y0, x, y), n = Math.max(1, Math.ceil(L / 4));
      for (let k = 1; k <= n; k++) rakeAt(g, SK.lerp(x0, x, k / n), SK.lerp(y0, y, k / n)); s.ang = SK.lerp(s.ang || 0, SK.clamp((x - x0) * 0.02, -0.4, 0.4), 0.3); s.last = [x, y]; },
    up(g) { g.s.last = null; },
    update(g, dt) {
      const s = g.s, t = g.t;
      for (let i = 0; i < ROWS * COLS; i++) {
        if (s.st[i] === GRASS && s.ig[i] <= t) ignite(g, i);
        else if (s.st[i] === BURN && t - s.bt[i] > (s.ff && s.bt[i] > s.ff ? 1.0 : 1.7)) s.st[i] = ASH;
      }
      s.sparks = s.sparks.filter(p => t - p.t < 0.6);
      for (const p of s.bits) { p.vy += 300 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; } s.bits = s.bits.filter(p => p.life > 0);
      if (g.done) return;
      // a burning tuft in the bottom row sets that field's building alight
      s.fields.forEach(([a, b], f) => { for (let c = a; c <= b; c++) if (s.st[(ROWS - 1) * COLS + c] === BURN && s.lost < 0) { s.lost = f; s.lostT = t; g.fail(); g.sfx('fire'); g.sfx('laugh'); } });
      if (g.done) return;
      s.fields.forEach((_, f) => { if (!s.safe[f] && !reachable(s, f)) { s.safe[f] = true; g.sfx('chime'); } });
      // every field is safe: the fire races on to the strips (fast) and dies there, then the win
      if (s.safe.every(Boolean) && !s.ff) { s.ff = t; for (let i = 0; i < ROWS * COLS; i++) if (s.st[i] === GRASS && s.ig[i] < 1e8) s.ig[i] = t + (s.ig[i] - t) * 0.22; g.sfx('whoosh'); }
      if (s.ff && !s.ig.some((v, i) => v < 1e8 && s.st[i] === GRASS)) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('firebreak_bg' + s.lv, o => paintBg(o, s.lv)), 0, 0, 360, 640);
      // the tufts that changed: raked earth, burning grass, ash
      for (let i = 0; i < ROWS * COLS; i++) { const st = s.st[i]; if (st === GRASS || st === WATER) continue; const x = cx(i % COLS), y = cy(Math.floor(i / COLS));
        if (st === BARE) { c.fillStyle = '#8a5a34'; c.fillRect(x - C / 2, y - C / 2, C, C); c.strokeStyle = 'rgba(200,150,100,0.55)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - 7, y - 3); c.lineTo(x + 7, y - 3); c.moveTo(x - 7, y + 3); c.lineTo(x + 7, y + 3); c.stroke(); }
        else { c.fillStyle = st === ASH ? '#3a3034' : '#5a2a1a'; c.fillRect(x - C / 2, y - C / 2, C, C);
          if (st === ASH && t - s.bt[i] < 3.2 && Math.sin(i * 7.3 + t * 3) > 0.3) { c.fillStyle = 'rgba(255,120,40,0.7)'; c.beginPath(); c.arc(x + Math.sin(i) * 4, y + Math.cos(i) * 4, 1.8, 0, 7); c.fill(); } } }
      // flames on top, with a warm glow
      c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < ROWS * COLS; i++) if (s.st[i] === BURN) { c.fillStyle = 'rgba(255,120,40,0.16)'; c.beginPath(); c.arc(cx(i % COLS), cy(Math.floor(i / COLS)), 15, 0, 7); c.fill(); } c.restore();
      for (let i = 0; i < ROWS * COLS; i++) if (s.st[i] === BURN) { const k = SK.clamp((t - s.bt[i]) / 0.3, 0.3, 1) * SK.clamp((1.7 - (t - s.bt[i])) / 0.5, 0.2, 1); flame(c, cx(i % COLS), cy(Math.floor(i / COLS)) + 2, 0.75 * k + 0.2, t, i); }
      // sparks carried by the wind
      for (const p of s.sparks) { const k = (t - p.t) / 0.6, ax = cx(p.a % COLS), ay = cy(Math.floor(p.a / COLS)), bx = cx(p.b % COLS), by = cy(Math.floor(p.b / COLS)); c.fillStyle = `rgba(255,220,120,${1 - k})`; c.beginPath(); c.arc(SK.lerp(ax, bx, k) + Math.sin(k * 9) * 3, SK.lerp(ay, by, k) - Math.sin(k * Math.PI) * 10, 2.4, 0, 7); c.fill(); }
      // smoke drifting up from the fire front
      for (let i = 0; i < ROWS * COLS; i += 3) if (s.st[i] === BURN) { const x = cx(i % COLS), y = cy(Math.floor(i / COLS)), q = ((t * 0.8 + i * 0.37) % 1); c.fillStyle = `rgba(80,70,80,${0.28 * (1 - q)})`; c.beginPath(); c.arc(x + q * 14, y - 10 - q * 34, 6 + q * 10, 0, 7); c.fill(); }
      for (const p of s.bits) { c.fillStyle = `rgba(120,80,40,${p.life * 2})`; c.beginPath(); c.arc(p.x, p.y, 2.2, 0, 7); c.fill(); }
      // the farm buildings, one at the foot of every field
      const yb = Y0 + ROWS * C + 62;
      s.fields.forEach(([a, b], f) => building(c, s.kinds[f], (X0 + a * C + X0 + (b + 1) * C) / 2, yb, t, s.lost === f, s.safe[f] && s.lost !== f));
      // the rabbit: watches, cheers, or runs for the pond
      const hx = s.fields.length === 2 ? 180 : 120, rx = lost ? SK.lerp(hx, 44, SK.clamp((t - s.lostT) * 1.2, 0, 1)) : hx;
      SK.animal(c, 'rabbit', rx, 634, 0.75, { t, pose: won ? 'cheer' : lost ? 'hop' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'think', facing: lost ? -1 : 1 });
      if (s.wind && !g.done) { for (let i = 0; i < 3; i++) { const x = 30 + i * 150, y = Y0 + ((t * 120 + i * 140) % (ROWS * C)); c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x, y - 30); c.quadraticCurveTo(x + 8, y - 12, x, y); c.stroke(); c.beginPath(); c.moveTo(x - 6, y - 8); c.lineTo(x, y + 2); c.lineTo(x + 6, y - 8); c.stroke(); } SK.tag(c, 'Wind', 328, 134, 18); }
      // the raking tool under the finger
      if (s.last && !g.done) rake(c, s.last[0], s.last[1], s.ang || 0);
      const P0 = !g.done ? plan(s) : null;
      if (P0 && !s.last) {
        // the band to rake across the field in danger
        SK.target(c, g, (P0.bx0 + P0.bx1) / 2, Y0 + P0.rb * C + P0.w * C / 2, 0, { w: P0.bx1 - P0.bx0 - 4, h: P0.w * C + 8 });
        SK.grab(c, g, P0.x0, P0.y, 16); SK.arrow(c, g, P0.x0, P0.y, P0.x1, P0.y, { from: 18, to: 4 });
        SK.tag(c, 'Dry grass', (P0.bx0 + P0.bx1) / 2, Y0 + P0.rb * C - 30, 18);
      }
      SK.demo(g, c, 'drag', P0 ? [P0.x0, P0.y] : [180, 400], P0 ? [P0.x1, P0.y] : [180, 400], { never: !P0 });
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 0.6) return; const B = s._fb = s._fb || { n: 0, at: 0 };
      if (B.cur) { if (SK.bot.drag(g, synth, 'r' + B.n, B.cur.t0, B.cur.a, B.cur.b, 0.4)) { B.n++; B.cur = null; B.at = g.t + 0.1; } return; }
      if (g.t < B.at) return; const p = plan(s); if (!p) return; B.cur = { t0: g.t, a: [p.x0, p.y], b: [p.x1, p.y] };
    },
  });
})();
