// INSULATE! (physics PP-20) — a house on a snowy night, seen the way a heat camera sees it: the parts that lose the most
// heat glow yellow and orange, and heat puffs stream out of them; parts that lose little glow dim purple. The heater on the
// side burns as hard as the house loses heat. Rub your finger over the house to lay pink insulation; you have only a few
// rolls (the pile shrinks as you use it). Covering the brightest, leakiest parts first brings the "Heat lost" bar down to
// the line; spending the rolls on dim parts barely helps, the rolls run out and the heater stays huge.
// Variants: an old roof, single-glazed windows, hollow walls, or a cold floor is the big leak. Level 2: windows take
// two rolls' worth (double glazing costs more).
(() => {
  const CS = 12, X0 = 36, Y0 = 192, NX = 24, NY = 30, BR = 21, APEX = [180, 196], EAVE = 332, WALL = [58, 302], FLOOR = [522, 540];
  const WINS = [[78, 368, 56, 52], [226, 368, 56, 52]], DOOR = [154, 430, 52, 92];
  const RATES = [ // heat lost per patch: roof, walls, windows, floor
    { roof: 3.0, walls: 0.7, windows: 2.6, floor: 0.6 }, { roof: 1.0, walls: 0.7, windows: 5.2, floor: 0.6 },
    { roof: 0.9, walls: 2.3, windows: 2.4, floor: 0.5 }, { roof: 2.6, walls: 0.6, windows: 1.4, floor: 3.4 } ];
  const NAMES = { roof: 'Roof', walls: 'Walls', windows: 'Windows', floor: 'Floor' };
  const inTri = (x, y) => y >= APEX[1] && y <= EAVE && Math.abs(x - APEX[0]) <= (y - APEX[1]) / (EAVE - APEX[1]) * 146;
  const inR = (r, x, y) => x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3];
  function partAt(x, y) {
    if (inTri(x, y)) return 'roof';
    if (x < WALL[0] || x > WALL[1]) return null;
    if (y >= FLOOR[0] && y <= FLOOR[1]) return 'floor';
    if (y > EAVE && y < FLOOR[0]) { if (WINS.some(w => inR(w, x, y))) return 'windows'; if (inR(DOOR, x, y)) return null; return 'walls'; }
    return null;
  }
  const heatCol = r => r >= 2.8 ? '#fff0a0' : r >= 2 ? '#ffb040' : r >= 1.2 ? '#f0603a' : r >= 0.8 ? '#a8308a' : '#4a2a8a';
  function paintNight(o) {
    N1.vgrad(o, 0, 0, 360, 640, ['#0a0c2a', '#1c1e4a', '#3a3a6a']); P.stars(o, 360, 300, 70, 9, 0);
    o.fillStyle = 'rgba(255,255,240,0.9)'; o.beginPath(); o.arc(322, 214, 16, 0, 7); o.fill(); o.fillStyle = '#1c1e4a'; o.beginPath(); o.arc(330, 209, 14, 0, 7); o.fill();
    for (const [x, s] of [[16, 0.7], [342, 0.6]]) { o.fillStyle = '#1a3040'; o.beginPath(); o.moveTo(x, 420 - 120 * s); o.lineTo(x + 40 * s, 520); o.lineTo(x - 40 * s, 520); o.closePath(); o.fill(); }
    N1.vgrad(o, 0, 540, 360, 100, ['#dde8f4', '#b8c8e0']); const r = P.rng(4); o.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 50; i++) { o.beginPath(); o.arc(r() * 360, 544 + r() * 90, 1 + r() * 1.5, 0, 7); o.fill(); }
    // the house, dark (its glow is drawn on top as the heat picture)
    o.fillStyle = '#2a2440'; o.fillRect(WALL[0], EAVE, WALL[1] - WALL[0], FLOOR[1] - EAVE);
    o.beginPath(); o.moveTo(APEX[0], APEX[1] - 4); o.lineTo(APEX[0] - 152, EAVE + 4); o.lineTo(APEX[0] + 152, EAVE + 4); o.closePath(); o.fill();
    o.fillStyle = '#4a3020'; o.fillRect(DOOR[0], DOOR[1], DOOR[2], DOOR[3]); o.fillStyle = '#ffd45a'; o.beginPath(); o.arc(DOOR[0] + 42, DOOR[1] + 50, 3, 0, 7); o.fill();
    o.fillStyle = '#e8eef8'; o.beginPath(); o.moveTo(APEX[0], APEX[1] - 12); o.lineTo(APEX[0] - 40, APEX[1] + 28); o.lineTo(APEX[0] + 40, APEX[1] + 28); o.closePath(); o.globalAlpha = 0.6; o.fill(); o.globalAlpha = 1; // snow on the ridge
  }
  function fluff(c, x, y, seed) { // a patch of pink insulation
    c.fillStyle = '#f0a0b8'; c.fillRect(x, y, CS, CS); c.fillStyle = 'rgba(255,220,230,0.8)';
    c.beginPath(); c.arc(x + 3 + (seed % 3) * 2, y + 4, 3, 0, 7); c.arc(x + 8, y + 8 - (seed % 2) * 2, 3.2, 0, 7); c.fill();
    c.fillStyle = 'rgba(160,60,100,0.35)'; c.fillRect(x, y + CS - 2, CS, 2);
  }
  function lossOf(s) { let L = 0; for (const k of s.cells) L += k.rate * (k.cov ? 0.12 : 1); return L; }
  // the best a careful insulator could do with these rolls (cover the leakiest patches first)
  function bestLoss(cells, M) { const q = cells.slice().sort((a, b) => b.rate / b.cost - a.rate / a.cost); let m = M, L = 0; for (const k of q) { if (m >= k.cost) { m -= k.cost; L += k.rate * 0.12; } else L += k.rate; } return L; }
  // the hand's next stroke: along the row with the most heat still escaping, in the leakiest part
  function nextStroke(s) { // the densest leak first (heat per roll), then the longest run of side-by-side patches in one row
    let best = null;
    for (let j = 0; j < NY; j++) { const row = s.cells.filter(k => k.j === j && !k.cov).sort((p, q) => p.i - q.i); let run = [];
      const flush = () => { if (run.length) { const sc = Math.round(run[0].rate / run[0].cost * 100) * 1000 + run.length; if (!best || sc > best.sc) best = { sc, a: [run[0].x + CS / 2, run[0].y + CS / 2], b: [run[run.length - 1].x + CS / 2, run[0].y + CS / 2] }; } run = []; };
      for (const k of row) { if (run.length && (k.i !== run[run.length - 1].i + 1 || Math.abs(k.rate - run[0].rate) > 0.01)) flush(); run.push(k); } flush(); }
    if (best && best.b[0] - best.a[0] < 30) { const m = (best.a[0] + best.b[0]) / 2; best.a[0] = m - 15; best.b[0] = m + 15; } return best;
  }
  function lay(g, ax, ay, bx, by) { // insulation goes on every patch the finger passes over, while there are rolls left
    const s = g.s; let n = 0; const L = Math.hypot(bx - ax, by - ay) || 1;
    for (const k of s.cells) { if (k.cov || s.left < k.cost) continue; const cx = k.x + CS / 2, cy = k.y + CS / 2, u = SK.clamp(((cx - ax) * (bx - ax) + (cy - ay) * (by - ay)) / (L * L), 0, 1);
      if (Math.hypot(cx - (ax + (bx - ax) * u), cy - (ay + (by - ay) * u)) <= BR) { k.cov = 1; s.left -= k.cost; n++; } }
    if (n) { s.loss = lossOf(s); if (g.rand() < 0.5) g.sfx('rustle', { vol: 0.4 }); }
  }
  MG.add({
    id: 'insulate', stage: 'energy', cmd: 'COVER WHERE MOST HEAT ESCAPES!', time: 7, mood: 'night', winText: 'Snug and warm!', failText: 'Out of rolls!',
    card: { title: 'Plug the biggest leak first', kind: 'Physics', ref: 'Heat loss and insulation',
      text: 'A warm house loses heat to the cold outside. The heater has to make up for every bit that escapes, and that costs money.\n\nInsulation is a fluffy layer that traps air, and trapped air lets heat through very slowly.\n\nSome parts of a house leak far more than others. A heat camera shows them glowing brightest. Old roofs and single-glass windows are often the worst. With only a few rolls, covering the biggest leaks first saves the most heat.',
      note: 'Insulation slows heat escaping. With a little insulation, cover the parts that leak most heat first.' },
    init(g) {
      const s = g.s, v = SK.variant(g, 4), R = RATES[v], lv = Math.min(2, g.level); s.v = v; s.cells = [];
      for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) { const x = X0 + i * CS, y = Y0 + j * CS, p = partAt(x + CS / 2, y + CS / 2); if (p) s.cells.push({ i, j, x, y, part: p, rate: R[p], cost: lv >= 2 && p === 'windows' ? 2 : 1, cov: 0 }); }
      s.L0 = lossOf(s); s.M = Math.round(s.cells.length * [0.36, 0.33, 0.3][lv]); s.left = s.M;
      const best = bestLoss(s.cells, s.M); s.goal = best + (s.L0 - best) * [0.32, 0.28, 0.26][lv];
      s.parts = []; s.drag = false; s.endT = 0; s.last = null; s.loss = s.L0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; s.drag = true; s.last = [x, y]; lay(g, x, y, x, y); },
    move(g, x, y) { const s = g.s; if (!s.drag || g.done) return; lay(g, s.last[0], s.last[1], x, y); s.last = [x, y]; },
    up(g) { g.s.drag = false; },
    update(g, dt) {
      const s = g.s;
      // heat puffs leave the uncovered patches, more from the leaky ones
      for (const k of s.cells) if (!k.cov && g.rand() < k.rate * 0.0045) { const up = k.part === 'roof', out = k.x + CS / 2 < 180 ? -1 : 1;
        s.parts.push({ x: k.x + CS / 2, y: k.y + CS / 2, vx: up ? out * 14 : out * (26 + g.rand() * 20), vy: up ? -30 - g.rand() * 20 : -8 - g.rand() * 10, life: 1, r: 2.5 + k.rate * 0.9 }); }
      for (const p of s.parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 0.9; } s.parts = s.parts.filter(p => p.life > 0); if (s.parts.length > 160) s.parts.splice(0, s.parts.length - 160);
      if (g.done) return;
      if (s.loss <= s.goal) { g.win(); g.sfx('cheer'); g.sfx('chime'); g.burst(180, 330, ['#f0a0b8', '#ffd45a', '#fff6ea'], 24, 180); return; }
      const minCost = Math.min(...s.cells.filter(k => !k.cov).map(k => k.cost), 9);
      if (s.left < minCost && !s.drag) { if (!s.endT) s.endT = g.t; if (g.t - s.endT > 0.4) { g.fail(); g.sfx('wrong'); g.sfx('laugh'); } }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', k01 = SK.clamp((s.loss - s.goal * 0.6) / (s.L0 - s.goal * 0.6), 0, 1);
      c.drawImage(g.bake('insulate_bg', paintNight), 0, 0, 360, 640);
      // the heat picture: each patch glows by how fast heat leaves it; insulated patches are pink fluff
      for (const k of s.cells) { if (k.cov) { fluff(c, k.x, k.y, k.i + k.j); continue; }
        const fl = 0.75 + 0.25 * Math.sin(t * 3 + k.i * 0.7 + k.j * 1.3); c.globalAlpha = (0.55 + 0.35 * Math.min(1, k.rate / 3)) * fl; c.fillStyle = heatCol(k.rate); c.fillRect(k.x + 0.5, k.y + 0.5, CS - 1, CS - 1); }
      c.globalAlpha = 1;
      // window frames and the door on top
      c.strokeStyle = '#1a1428'; c.lineWidth = 3; for (const w of WINS) { c.strokeRect(w[0], w[1], w[2], w[3]); c.beginPath(); c.moveTo(w[0] + w[2] / 2, w[1]); c.lineTo(w[0] + w[2] / 2, w[1] + w[3]); c.moveTo(w[0], w[1] + w[3] / 2); c.lineTo(w[0] + w[2], w[1] + w[3] / 2); c.stroke(); }
      c.fillStyle = '#4a3020'; c.fillRect(DOOR[0], DOOR[1], DOOR[2], DOOR[3]); c.strokeRect(DOOR[0], DOOR[1], DOOR[2], DOOR[3]);
      // the heat puffs
      c.save(); c.globalCompositeOperation = 'lighter'; for (const p of s.parts) { c.globalAlpha = p.life * 0.4; c.fillStyle = '#ff9a40'; c.beginPath(); c.arc(p.x, p.y, p.r * (1.4 - p.life * 0.4), 0, 7); c.fill(); } c.restore();
      // the parts' names
      if (!won) { const R = RATES[s.v]; for (const [p, x, y] of [['roof', 180, 258], ['walls', 268, 470], ['windows', 106, 344], ['floor', 84, 556]]) SK.tag(c, NAMES[p], x, y, 18, heatCol(R[p]) === '#4a2a8a' || heatCol(R[p]) === '#a8308a' ? '#fff6ea' : heatCol(R[p])); }
      // the heater: burns as hard as the house is losing heat
      const HX = 330, HY = 500; c.fillStyle = '#5a5a6a'; c.beginPath(); c.roundRect(HX - 18, HY - 66, 36, 70, 6); c.fill(); c.strokeStyle = '#1a1428'; c.lineWidth = 2; c.stroke();
      c.fillStyle = '#1a1020'; c.beginPath(); c.roundRect(HX - 12, HY - 40, 24, 32, 4); c.fill();
      const fh = 8 + 34 * k01, fw = Math.sin(t * 18) * 2; c.fillStyle = '#ff7a2a'; c.beginPath(); c.moveTo(HX - 9, HY - 10); c.quadraticCurveTo(HX - 8 + fw, HY - 10 - fh, HX + fw, HY - 12 - fh * 1.25); c.quadraticCurveTo(HX + 8 + fw, HY - 10 - fh, HX + 9, HY - 10); c.closePath(); c.fill();
      c.fillStyle = '#ffe07a'; c.beginPath(); c.moveTo(HX - 5, HY - 10); c.quadraticCurveTo(HX + fw, HY - 10 - fh * 0.8, HX + 5, HY - 10); c.closePath(); c.fill();
      SK.tag(c, 'Heater', HX - 22, HY - 82, 18);
      // the "Heat lost" bar with the goal line
      if (!g.done) { const BX = 40, BY = 150, BW = 280, f = SK.clamp(s.loss / s.L0, 0, 1), gf = s.goal / s.L0;
        c.fillStyle = 'rgba(30,14,36,0.75)'; c.beginPath(); c.roundRect(BX - 6, BY - 14, BW + 12, 28, 14); c.fill();
        c.fillStyle = f <= gf ? '#6ae07a' : '#ff8a3a'; c.beginPath(); c.roundRect(BX, BY - 8, BW * f, 16, 8); c.fill();
        c.fillStyle = '#6ae07a'; c.fillRect(BX + BW * gf - 2, BY - 16, 4, 32); N1.word(c, 'Heat lost', BX + BW / 2, BY + 30, 18);
        // the rolls left
        const n = Math.ceil(s.left / s.M * 6); for (let i = 0; i < 6; i++) { const x = 282 + (i % 3) * 22, y = 604 - Math.floor(i / 3) * 16; c.globalAlpha = i < n ? 1 : 0.25; c.fillStyle = '#f0a0b8'; c.beginPath(); c.ellipse(x, y, 11, 8, 0, 0, 7); c.fill(); c.strokeStyle = '#a04060'; c.lineWidth = 1.5; c.stroke(); c.beginPath(); c.arc(x, y, 3, 0, 7); c.stroke(); } c.globalAlpha = 1;
        SK.tag(c, 'Rolls', 304, 566, 18); }
      SK.animal(c, 'penguin', 190, 616, 0.85, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'think' });
      // guidance: rub along the brightest row that still leaks
      const st = !g.done && s.left > 0 ? nextStroke(s) : null;
      if (st) SK.demo(g, c, 'drag', st.a, st.b, { never: s.drag });
    },
    auto(g, dt, synth) {
      const s = g.s, B = s._bot = s._bot || {}; if (g.done || g.t < 1.0) return;
      if (B.st) { const k = SK.clamp((g.t - B.t0) / 0.35, 0, 1), x = SK.lerp(B.st.a[0], B.st.b[0], k), y = B.st.a[1]; synth('move', x, y); if (k >= 1) { synth('up', x, y); B.st = null; B.next = g.t + 0.1; } return; }
      if (B.next && g.t < B.next) return; const st = nextStroke(s); if (!st) return; B.st = st; B.t0 = g.t; synth('down', st.a[0], st.a[1]);
    },
  });
})();
