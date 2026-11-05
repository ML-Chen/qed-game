// BUILD 3 HOUSES ABOVE THE FLOOD! (earth EE MSE-09 BUILD HIGH!) — a river valley cut open like a cake: the river in its
// channel, the wide flat valley floor beside it, and narrow steps (terraces) up both sides. A muddy dashed line on the
// valley walls marks how high the last flood reached. Drag each house off the crane hook and let go: it drops onto the
// ground below its middle. A ledge holds one house, and a house dropped beside a ledge lands on the step below. Once all
// three are down the river rises: it spreads over the whole flat floor and stops at the terraces. Houses up high stay
// dry; a house on the floor floats away with a duck on its roof. Level 1 has narrower ledges; level 2 adds a levee along
// the river, which holds back the water for a moment and then gives way.
(() => {
  const RIVER = 470, FLOOD = 404, HOOK = { x: 180, y: 196 }, HW = 40;
  const PROF = [ // ground steps [x0, x1, y] from left to right; the river channel is the deepest one
    [[0, 46, 300], [46, 96, 368], [96, 152, 440], [152, 208, 498], [208, 266, 440], [266, 316, 362], [316, 360, 296]],
    [[0, 52, 312], [52, 100, 372], [100, 150, 440], [150, 206, 498], [206, 262, 440], [262, 312, 366], [312, 360, 300]],
    [[0, 48, 296], [48, 98, 366], [98, 154, 440], [154, 210, 498], [210, 264, 440], [264, 318, 370], [318, 360, 304]],
    [[0, 44, 306], [44, 94, 364], [94, 148, 440], [148, 204, 498], [204, 262, 440], [262, 314, 368], [314, 360, 292]],
  ];
  const COLS = ['#e8a87a', '#a8c8e8', '#f0d080', '#c8a8e0'];
  const segAt = (s, x) => s.segs.findIndex(([a, b]) => x >= a && x < b);
  const high = (s, i) => s.segs[i][2] < FLOOD - 8;
  function paintValley(o, segs, narrow) {
    const sky = o.createLinearGradient(0, 0, 0, 300); sky.addColorStop(0, '#8ac0e8'); sky.addColorStop(1, '#e8f0e0'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    P.cloud(o, 70, 140, 0.5); P.cloud(o, 300, 120, 0.45);
    o.fillStyle = '#9ab8a0'; o.beginPath(); o.moveTo(0, 300); o.quadraticCurveTo(90, 220, 180, 270); o.quadraticCurveTo(270, 230, 360, 290); o.lineTo(360, 330); o.lineTo(0, 330); o.closePath(); o.fill();
    const fm = o.createLinearGradient(0, 300, 0, 520); fm.addColorStop(0, '#9ab890'); fm.addColorStop(1, '#c8dcb0'); o.fillStyle = fm; o.fillRect(0, 326, 360, 314);
    for (let i = 0; i < 9; i++) { const x = 20 + i * 42, y = 330 + (i % 3) * 6; o.fillStyle = '#7a9a70'; o.beginPath(); o.arc(x, y, 12, 0, 7); o.fill(); }
  }
  function ground(c, s) { // the valley cross-section: grass on top, soil and rock layers below
    c.beginPath(); c.moveTo(0, 640); for (const [a, b, y] of s.segs) { c.lineTo(a, y); c.lineTo(b, y); } c.lineTo(360, 640); c.closePath();
    const gr = c.createLinearGradient(0, 290, 0, 640); gr.addColorStop(0, '#a07a4a'); gr.addColorStop(0.5, '#8a5a3a'); gr.addColorStop(1, '#5a3a2a'); c.fillStyle = gr; c.fill();
    c.save(); c.clip(); c.strokeStyle = 'rgba(60,30,20,0.25)'; c.lineWidth = 6; for (let y = 330; y < 640; y += 40) { c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= 360; x += 30) c.lineTo(x, y + Math.sin(x * 0.05 + y) * 6); c.stroke(); } c.restore();
    for (const [a, b, y] of s.segs) { if (y >= 498) continue; c.fillStyle = '#6ab84a'; c.fillRect(a, y - 3, b - a, 8); c.fillStyle = '#8ad060'; c.fillRect(a, y - 5, b - a, 3); }
  }
  function house(c, x, y, col, tilt = 0, duck = false, t = 0) {
    c.save(); c.translate(x, y); c.rotate(tilt);
    c.fillStyle = col; c.strokeStyle = '#4a2a2a'; c.lineWidth = 2; c.fillRect(-HW / 2, -30, HW, 30); c.strokeRect(-HW / 2, -30, HW, 30);
    c.fillStyle = '#c84a3a'; c.beginPath(); c.moveTo(-HW / 2 - 5, -30); c.lineTo(0, -52); c.lineTo(HW / 2 + 5, -30); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#ffe8a0'; c.fillRect(-13, -22, 9, 9); c.fillStyle = '#7a4a2a'; c.fillRect(4, -18, 9, 18);
    c.restore(); if (duck) SK.animal(c, 'duck', x + Math.sin(tilt) * 30, y - 50, 0.42, { t, pose: 'wave', expr: 'wow', noShadow: true });
  }
  MG.add({
    id: 'earth_buildhigh', stage: 'earth', cmd: 'BUILD 3 HOUSES ABOVE THE FLOOD!', time: 6, mood: 'storm', winText: 'High and dry!', failText: 'Washed away!',
    card: { title: 'Build above the flood', kind: 'Earth science', ref: 'Floodplains',
      text: "A river's flat valley floor is called its floodplain. The river built it: every big flood spreads water and mud across it, and the mud settles flat.\n\nSo the flat land beside a river is exactly where the next big flood will go. Higher steps up the valley side, called terraces, stay dry because the water can't climb that high.\n\nTowns use flood maps that show where water has reached before, and build homes above that line. A levee, a wall of earth along the river, can hold back small floods, but a big one can top it or break through.",
      note: 'The flat land beside a river floods again and again, so homes are safest on higher ground.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level), v = SK.variant(g, 4);
      s.segs = PROF[v].map(q => q.slice()); const n = s.segs.length;
      if (L >= 1) { s.segs[1][1] -= 6; s.segs[2][0] -= 6; s.segs[n - 2][0] += 6; s.segs[n - 3][1] += 6; } // narrower lower terraces, wider floor
      s.levee = L === 2; s.houses = []; s.n = 0; s.cur = { x: HOOK.x, y: HOOK.y, col: COLS[v % 4] }; s.drag = null; s.floodT = 0; s.water = RIVER; s.breakT = 0; s.next = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || !s.cur || s.floodT || s.next) return; if (SK.dist(x, y, s.cur.x, s.cur.y - 20) < 60) s.drag = { ox: s.cur.x - x, oy: s.cur.y - y }; },
    move(g, x, y) { const s = g.s; if (s.drag && s.cur) { s.cur.x = SK.clamp(x + s.drag.ox, HW / 2 + 2, 360 - HW / 2 - 2); s.cur.y = SK.clamp(y + s.drag.oy, 150, 260); } },
    up(g) {
      const s = g.s; if (!s.drag || !s.cur) return; s.drag = null; const h = s.cur; let i = segAt(s, h.x);
      // a ledge holds one house: if it is taken, the house slides down to the next step toward the river
      while (high(s, i) && s.houses.some(q => q.seg === i)) i += h.x < 180 ? 1 : -1;
      if (i === segAt(s, 180)) i += h.x < 180 ? -1 : 1; // never into the river itself
      const [a, b, gy] = s.segs[i], x = SK.clamp(h.x, Math.min(a + HW / 2, (a + b) / 2), Math.max(b - HW / 2, (a + b) / 2));
      s.houses.push({ x0: h.x, y0: h.y, x, y: gy, seg: i, col: h.col, t: g.t, float: 0 }); s.cur = null; s.n++; g.sfx('whoosh');
      if (s.n >= 3) s.floodT = g.t + 0.45; else s.next = g.t + 0.5;
    },
    update(g, dt) {
      const s = g.s;
      for (const q of s.houses) if (!q.landed && g.t - q.t > 0.35) { q.landed = true; g.sfx('thud'); g.burst(q.x, q.y, ['#c8a870', '#8ad060'], 8, 80); }
      if (s.next && g.t >= s.next && !g.done) { s.next = 0; s.cur = { x: HOOK.x, y: HOOK.y, col: COLS[(s.n + (g.s.segs[0][1] % 4)) % 4] }; g.sfx('pop'); }
      if (!s.floodT || g.t < s.floodT) return;
      // the flood: the river rises over the flat floor (held for a moment by the levee at level 2, then it gives way)
      const k = g.t - s.floodT, top = s.levee && !s.breakT ? 430 : FLOOD; s.water = Math.max(top, s.water - 90 * dt);
      if (s.levee && !s.breakT && s.water <= 431 && k > 0.6) { s.breakT = g.t; g.sfx('crunch'); g.sfx('splash'); g.shake(4, 0.3); }
      for (const q of s.houses) if (!high(s, q.seg) && s.water < q.y - 6) { if (!q.float) { q.float = g.t; g.sfx('splash'); } }
      if (!g.done && s.water <= FLOOD + 1) { if (s.houses.some(q => q.float)) { g.fail(); g.sfx('laugh'); } else { g.win(); g.sfx('cheer'); } }
      if (!g.done && !s.levee && s.houses.every(q => high(s, q.seg)) && k > 0.25) { g.win(); g.sfx('cheer'); } // all up high: no need to wait for the water to finish rising
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('buildhigh_sky', paintValley), 0, 0, 360, 640);
      // the water, then the ground in front of it, so water shows only where the ground is lower than its surface
      const wy = s.water + Math.sin(t * 2) * 1.5, wg = c.createLinearGradient(0, wy, 0, 520); wg.addColorStop(0, '#5aa8d0'); wg.addColorStop(1, '#2a6a90'); c.fillStyle = wg;
      if (s.levee && !s.breakT) { const [a, b] = s.segs[segAt(s, 180)]; c.fillRect(a, wy, b - a, 640); } else c.fillRect(0, wy, 360, 640);
      ground(c, s);
      if (s.levee) { const [a, b] = s.segs[segAt(s, 180)], br = s.breakT ? SK.clamp((t - s.breakT) * 3, 0, 1) : 0; for (const x of [a, b]) { c.save(); c.translate(x, 440); c.rotate(br * (x < 180 ? -0.7 : 0.7)); const hh = 30 - br * 14; c.fillStyle = '#8a6a44'; c.beginPath(); c.moveTo(-14, 0); c.lineTo(-5, -hh); c.lineTo(5, -hh); c.lineTo(14, 0); c.closePath(); c.fill(); c.fillStyle = '#6ab84a'; c.fillRect(-6, -hh - 3, 12, 4); c.restore(); }
        if (!s.floodT) SK.tag(c, 'Levee', a - 40, 472, 18); }
      // the flood mark on the valley walls
      c.save(); c.strokeStyle = 'rgba(120,80,40,0.75)'; c.lineWidth = 3; c.setLineDash([8, 6]); c.beginPath(); c.moveTo(0, FLOOD); c.lineTo(360, FLOOD); c.stroke(); c.restore();
      if (!s.floodT) { SK.tag(c, 'Last flood', 70, FLOOD - 18, 18, '#fff6ea', 'rgba(110,70,30,0.85)'); SK.tag(c, 'River', 180, 540, 18); }
      // the houses: falling into place, sitting, or floating away
      for (const q of s.houses) { const k = SK.clamp((t - q.t) / 0.35, 0, 1), x = SK.lerp(q.x0, q.x, k), y = SK.lerp(q.y0, q.y, k * k);
        if (q.float) { const f = t - q.float, fy = Math.min(q.y, s.water + 6) ; house(c, x + f * 40 * (x < 180 ? 1 : -1) * 0.6, fy + Math.sin(t * 3) * 2, q.col, Math.sin(t * 2.4) * 0.25, true, t); } else house(c, x, y, q.col); }
      // the crane hook and the next house
      c.strokeStyle = '#4a4a5a'; c.lineWidth = 6; c.beginPath(); c.moveTo(0, 132); c.lineTo(360, 132); c.stroke();
      if (s.cur) { const h = s.cur; c.strokeStyle = '#3a3a4a'; c.lineWidth = 2; c.beginPath(); c.moveTo(h.x, 132); c.lineTo(h.x, h.y - 52); c.stroke(); c.fillStyle = '#e8c040'; c.fillRect(h.x - 10, 128, 20, 8); house(c, h.x, h.y, h.col);
        if (s.drag) { const i = segAt(s, h.x), gy = s.segs[i][2]; c.save(); c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 2; c.setLineDash([4, 6]); c.beginPath(); c.moveTo(h.x, h.y + 4); c.lineTo(h.x, gy - 4); c.stroke(); c.restore(); } }
      if (!won) SK.tag(c, Math.min(s.n + (s.cur ? 1 : 0), 3) + ' / 3', 316, 170, 18);
      SK.animal(c, 'beaver', 34, 128, 0.6, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
      // guidance: drag the house over a free ledge above the flood line
      if (s.cur && !g.done && !s.floodT) { let best = -1, bd = 1e9; s.segs.forEach(([a, b, y], i) => { if (!high(s, i) || b - a < 30 || s.houses.some(q => q.seg === i)) return; const d = Math.abs((a + b) / 2 - s.cur.x); if (d < bd) { bd = d; best = i; } });
        if (best >= 0) { const [a, b, y] = s.segs[best], tx = (a + b) / 2; SK.grab(c, g, s.cur.x, s.cur.y - 22, 30); SK.target(c, g, tx, y - 22, 0, { w: b - a, h: 40 }); SK.arrow(c, g, s.cur.x, s.cur.y - 22, tx, y - 40, { from: 34, to: 30 }); SK.demo(g, c, 'drag', [s.cur.x, s.cur.y - 22], [tx, Math.min(250, y - 60)]); } }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || !s.cur || s.floodT || s.next || g.t < 1.0) return; const B = s._bot = s._bot || {}, key = 'h' + s.n;
      if (B[key + 's'] == null) { let best = -1; s.segs.forEach(([a, b], i) => { if (best < 0 && high(s, i) && b - a >= 30 && !s.houses.some(q => q.seg === i)) best = i; }); B[key + 's'] = best; B[key + 't'] = g.t; }
      const [a, b, y] = s.segs[B[key + 's']]; SK.bot.drag(g, synth, key, B[key + 't'], [s.cur.x, s.cur.y - 22], [(a + b) / 2, Math.min(250, y - 60) ], 0.45);
    },
  });
})();
