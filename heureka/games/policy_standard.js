// SET A STANDARD! (policy GP-07) — roads into a smoggy town, each with a smoke-test gate (seen from the side). Every
// car's exhaust rises in a plume as tall as it is dirty. A gate's bar is the standard: drag it down. A car whose plume
// reaches the bar is stopped, a mechanic fits a filter (a coin pops: the car now costs a bit more), and it drives on with
// a small clean puff. Plumes under the bar drive straight through, and dirty ones darken the smog over the town. Lower
// each road's bar until only clean cars get through, and the smog clears. Lower it too far (below even a filtered car's
// puff) and nobody can pass: the road jams and the drivers get out and walk. Small cars, buses and trucks need different
// bars. Two roads at level 0, three at level 1; at level 2 three roads, faster traffic and no green band on the gauges.
const TAU = Math.PI * 2;
const LANE_Y = [338, 458, 578], GATE = 200, KINDS = {
  car: { dirty: 46, clean: 12, w: 46, col: '#e8563a' }, bus: { dirty: 62, clean: 24, w: 62, col: '#f6c445' }, truck: { dirty: 78, clean: 36, w: 66, col: '#3a8ad8' } };
const BAR_MIN = 6, BAR_MAX = 98;
function paintRoads(o, n) {
  P.sky(o, 360, 640, ['#8ab8d8', '#c8dcec', '#f0f0e0']);
  // the town on the hill at the top
  for (let i = 0; i < 9; i++) { const x = 8 + i * 40, h = 40 + (i * 53) % 60; o.fillStyle = ['#8a9ab8', '#a8b0c8', '#7a8aa8'][i % 3]; o.fillRect(x, 232 - h, 34, h); o.fillStyle = 'rgba(255,240,180,0.8)'; for (let r = 0; r < h / 16 - 1; r++) for (let k = 0; k < 2; k++) o.fillRect(x + 6 + k * 14, 232 - h + 8 + r * 16, 7, 7); }
  o.fillStyle = '#6a9a58'; o.fillRect(0, 232, 360, 16);
  // the roads, one per lane, each with its gate posts
  for (let i = 0; i < 3; i++) { const y = LANE_Y[i];
    o.fillStyle = '#7aa860'; o.fillRect(0, y - 112, 360, i < 2 ? 112 : 172); o.fillStyle = 'rgba(255,255,255,0.08)'; o.fillRect(0, y - 112, 360, 3);
    if (i >= n) { P.flowers(o, 360, y - 100, y + 40, 30, undefined, 8); P.grassTufts(o, 360, y - 100, y + 50, 24, '#4a7a40', 9); for (const [x, sc] of [[60, 0.7], [300, 0.8]]) P.tree(o, x, y + 10, sc); continue; }
    P.grassTufts(o, 360, y - 100, y - 4, 10, '#4a7a40', i + 3);
    o.fillStyle = '#5a5a6a'; o.fillRect(0, y, 360, 20); o.fillStyle = '#f6e8a0'; for (let x = 6; x < 360; x += 30) o.fillRect(x, y + 9, 16, 3);
    o.fillStyle = '#3a3a4a'; o.fillRect(0, y + 20, 360, 4);
    for (const px of [GATE - 30, GATE + 30]) { o.fillStyle = '#d8d0c0'; o.fillRect(px - 4, y - BAR_MAX - 12, 8, BAR_MAX + 14); o.fillStyle = '#e8403a'; for (let k = 0; k < 5; k++) o.fillRect(px - 4, y - BAR_MAX - 12 + k * 22, 8, 10); }
  }
  P.grain(o, 360, 640, 0.03); P.vignette(o, 360, 640, 0.22);
}
function vehicle(c, kind, x, y, t, stop) {
  const K = KINDS[kind], w = K.w, bob = stop ? 0 : Math.sin(t * 14 + x) * 0.8; c.save(); c.translate(x, y + bob);
  c.fillStyle = 'rgba(20,20,30,0.3)'; c.beginPath(); c.ellipse(0, 2, w / 2 + 4, 4, 0, 0, TAU); c.fill();
  c.fillStyle = K.col; c.strokeStyle = P.shade(K.col, -0.5); c.lineWidth = 2;
  if (kind === 'car') { c.beginPath(); c.roundRect(-w / 2, -16, w, 12, 4); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-w / 2 + 8, -16); c.lineTo(-w / 2 + 14, -27); c.lineTo(w / 2 - 12, -27); c.lineTo(w / 2 - 4, -16); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#c8ecff'; c.fillRect(-w / 2 + 15, -25, w / 2 - 14, 8); c.fillRect(2, -25, w / 2 - 15, 8); }
  else if (kind === 'bus') { c.beginPath(); c.roundRect(-w / 2, -34, w, 30, 5); c.fill(); c.stroke(); c.fillStyle = '#c8ecff'; for (let i = 0; i < 4; i++) c.fillRect(-w / 2 + 6 + i * 14, -29, 10, 10); }
  else { c.beginPath(); c.roundRect(-w / 2, -36, w * 0.62, 32, 3); c.fill(); c.stroke(); c.fillStyle = P.shade(K.col, 0.2); c.beginPath(); c.roundRect(w * 0.14, -26, w * 0.36, 22, 4); c.fill(); c.stroke(); c.fillStyle = '#c8ecff'; c.fillRect(w * 0.3, -22, w * 0.16, 9); }
  for (const wx of [-w / 2 + 10, w / 2 - 10]) { c.fillStyle = '#2a2a3a'; c.beginPath(); c.arc(wx, -3, 6, 0, TAU); c.fill(); c.fillStyle = '#a8a8b8'; c.beginPath(); c.arc(wx, -3, 2.5, 0, TAU); c.fill(); }
  c.fillStyle = '#4a4a5a'; c.fillRect(-w / 2 - 6, -8, 7, 3);
  c.restore();
}
function plume(c, x, y, h, clean, t, ph) { // a column of puffs rising from the tailpipe to height h above the road
  const n = Math.max(1, Math.round(h / 16)); for (let i = 0; i < n; i++) { const k = (i + 0.5) / n, py = y - 8 - k * (h - 8), r = 5 + k * (clean ? 4 : 9), wob = Math.sin(t * 4 + i + ph) * 3;
    c.fillStyle = clean ? `rgba(255,255,255,${0.75 - k * 0.3})` : `rgba(${70 + i * 6},${60 + i * 5},${60 + i * 5},${0.8 - k * 0.25})`; c.beginPath(); c.arc(x - 10 - k * 12 + wob, py, r, 0, TAU); c.fill(); } }
function laneOrder(g, n) { const v = SK.variant(g, 4), perms = [['car', 'bus', 'truck'], ['truck', 'car', 'bus'], ['bus', 'truck', 'car'], ['car', 'truck', 'bus']]; return perms[v].slice(0, n); }
const inBand = (L, b) => b < KINDS[L.kind].dirty - 2 && b > KINDS[L.kind].clean + 2;
MG.add({
  id: 'setstandard', stage: 'policy', cmd: 'LOWER EACH BAR TILL THE AIR CLEARS!', time: 7, mood: 'bright', winText: 'Clean air!', failText: 'Wrong standard!',
  card: { title: 'A rule for how things are made', kind: 'Civics', ref: 'Regulations and standards',
    text: 'The bar was a standard: a rule that every car\'s exhaust must stay under a limit. Cars that were too dirty got a filter before they could drive on. The filter cost money, so those cars cost a little more. The air in town got cleaner.\n\nA standard set too strict, below what even a filtered car can reach, stops everyone, and people have to walk.\n\nGovernments set standards for cars, food, toys and buildings. Choosing the limit means weighing cleaner or safer things against higher prices, and people often disagree about where the limit should be.',
    note: 'A standard is a rule for how things must be made; meeting it costs money, and too strict a rule can stop everything.' },
  init(g) {
    const s = g.s, n = g.level ? 3 : 2, kinds = laneOrder(g, n);
    s.lanes = kinds.map((kind, i) => ({ kind, y: LANE_Y[i], bar: BAR_MAX - 4, cars: [], next: 0.4 + i * 0.55, jam: 0, passed: 0 }));
    s.n = n; s.smog = 0.85; s.spd = [80, 92, 120][Math.min(2, g.level)]; s.gap = [1.9, 1.7, 1.35][Math.min(2, g.level)]; s.coins = []; s.clearT = 0;
  },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; let best = null, bd = 50;
    for (const L of s.lanes) { const by = L.y - L.bar, d = Math.hypot((x - (GATE + 30)) * 0.6, y - by); if (d < bd && x > GATE - 70 && x < GATE + 110) { bd = d; best = L; } }
    if (best) { s.drag = { L: best, oy: (best.y - best.bar) - y }; SK.dragStart(g, null, x, y); g.sfx('click'); } },
  move(g, x, y) { const s = g.s; if (!s.drag) return; SK.dragMove(g, x, y); const L = s.drag.L; L.bar = SK.clamp(L.y - (y + s.drag.oy), BAR_MIN, BAR_MAX); },
  up(g) { const s = g.s; SK.dragEnd(g); s.drag = null; },
  update(g, dt) {
    const s = g.s; let dirtyFlow = 0;
    for (const L of s.lanes) {
      const K = KINDS[L.kind];
      L.next -= dt; if (L.next <= 0) { const last = L.cars[L.cars.length - 1]; if (!last || last.x > 30 + K.w) { L.cars.push({ x: -K.w, clean: false, st: 'go', fix: 0 }); L.next = s.gap; } else L.next = 0.2; }
      let ahead = null; L.blocked = false;
      for (const car of L.cars) {
        const stopX = GATE - 30 - K.w / 2 - 8; let tx = 999;
        if (car.st !== 'pass') { const h = car.clean ? K.clean : K.dirty;
          if (car.x >= stopX - 1) { if (h >= L.bar) { if (!car.clean) { if (!car.fixT) { car.fixT = g.t; g.sfx('click'); } if (g.t - car.fixT > 0.6) { car.clean = true; g.sfx('coin'); s.coins.push({ x: GATE - 40, y: L.y - 40, t: g.t }); } } else L.blocked = true; tx = stopX; }
            else { car.st = 'pass'; if (!car.clean) { s.smog = Math.min(1, s.smog + 0.13); g.sfx('fail'); } else g.sfx('whoosh'); L.passed++; } }
          else tx = stopX; }
        if (ahead) tx = Math.min(tx, ahead.x - K.w - 12);
        car.x = Math.min(car.x + s.spd * dt, Math.max(car.x, tx)); ahead = car;
      }
      L.cars = L.cars.filter(c0 => c0.x < 420);
      L.jam = L.blocked ? L.jam + dt : Math.max(0, L.jam - dt * 2);
      if (!inBand(L, L.bar) && L.bar >= KINDS[L.kind].dirty - 2) dirtyFlow++;
    }
    s.smog = Math.max(0, s.smog - dt * (dirtyFlow ? 0.04 : 0.22));
    if (!g.done && s.lanes.some(L => L.jam > 2.6)) { g.sfx('laugh'); g.fail(); s.walk = g.t; }
    if (!g.done && s.smog < 0.22 && s.lanes.every(L => inBand(L, L.bar))) { g.win(); g.sfx('cheer'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('setstandard' + s.n, o => paintRoads(o, s.n)), 0, 0, 360, 640);
    // the smog over the town
    const sg = c.createLinearGradient(0, 110, 0, 250); sg.addColorStop(0, `rgba(90,80,70,${0.2 + s.smog * 0.6})`); sg.addColorStop(1, `rgba(120,100,80,${s.smog * 0.5})`); c.fillStyle = sg; c.fillRect(0, 118, 360, 132);
    for (let i = 0; i < 6; i++) { c.fillStyle = `rgba(80,70,60,${s.smog * 0.35})`; c.beginPath(); c.arc((i * 70 + t * 8) % 400 - 20, 160 + (i % 2) * 30, 40, 0, TAU); c.fill(); }
    SK.tag(c, s.smog > 0.22 ? 'Smog' : 'Clear air', 180, 176, 18, s.smog > 0.22 ? '#fff6ea' : '#b8ffc8');
    for (const L of s.lanes) {
      const K = KINDS[L.kind], by = L.y - L.bar, band = g.level <= 1;
      // the gauge on the gate: a green band where this road's standard works
      if (band) { c.fillStyle = 'rgba(90,220,120,0.35)'; c.fillRect(GATE - 26, L.y - K.dirty + 2, 52, K.dirty - K.clean - 4); }
      for (const car of L.cars) { const h = car.clean ? K.clean : K.dirty; plume(c, car.x - K.w / 2, L.y, h, car.clean, t, car.x); vehicle(c, L.kind, car.x, L.y, t, car.x < GATE && car.st !== 'pass');
        if (car.fixT && !car.clean) { const k = (t - car.fixT) * 10; c.fillStyle = '#ffe27a'; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(car.x + K.w / 2 + 4, L.y - 20 + Math.sin(k + i * 2) * 8, 2.5, 0, TAU); c.fill(); } }
        if (lost && car.x < GATE && L.jam > 2.6) SK.animal(c, 'rabbit', car.x - 10 + (t - g.doneAt) * 60, L.y + 2, 0.4, { t, pose: 'walk', expr: 'sad', facing: 1, noShadow: true }); }
      // the bar itself, with its handle on the right post
      c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.roundRect(GATE - 36, by - 5, 72, 10, 5); c.fill(); c.stroke(); c.fillStyle = '#e8403a'; for (let i = 0; i < 3; i++) c.fillRect(GATE - 30 + i * 24, by - 5, 10, 10);
      SK.ball(c, GATE + 40, by, 11, '#f6c445');
      if (L.blocked && L.jam > 0.4) SK.tag(c, 'Too strict!', GATE + 92, L.y - 60, 18, '#ffd0d0');
      else if (L.bar >= K.dirty - 2) { const near = L.cars.some(c0 => !c0.clean && c0.x > GATE - 60 && c0.x < GATE + 90 && c0.st === 'pass'); if (near) SK.tag(c, 'Dirty!', GATE + 92, L.y - 60, 18, '#ffe0c0'); }
    }
    if (!g.s.touched || g.level === 0) SK.tag(c, 'Standard', GATE - 84, s.lanes[0].y - s.lanes[0].bar, 18);
    if (lost && s.walk) SK.tag(c, 'Everyone walks!', 180, 300, 20, '#ffd0d0');
    for (const co of s.coins) { const k = (t - co.t) / 0.8; if (k > 1) continue; c.globalAlpha = 1 - k; B8.coin(c, co.x, co.y - k * 36, 10, t * 8); SK.tag(c, '+1', co.x + 22, co.y - k * 36, 18, '#ffe9a0'); c.globalAlpha = 1; }
    SK.animal(c, 'owl', 330, 252, 0.6, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'think', noShadow: true });
    G2.count(c, 60, 44, s.lanes.filter(L => inBand(L, L.bar)).length, s.n);
    // guidance: the first gate whose bar is not yet right; the hand drags its handle into the band
    const L = !g.done ? s.lanes.find(q => !inBand(q, q.bar)) : null;
    if (L && !s.drag) { const K = KINDS[L.kind], hx = GATE + 40, hy = L.y - L.bar, ty = L.y - (K.dirty + K.clean) / 2; SK.grab(c, g, hx, hy, 16);
      if (g.level <= 1 || G2.vis(g) > 0) { SK.target(c, g, hx, ty, 14); if (Math.abs(ty - hy) > 22) SK.arrow(c, g, hx, hy, hx, ty, { from: 18, to: 20 }); G2.dir(c, hx + 34, hy, ty < hy ? 1 : -1, { s: 0.8 }); }
      SK.demo(g, c, 'drag', [hx, hy], [hx, ty]); }
    else SK.demo(g, c, 'drag', [0, 0], [1, 1], { never: true });
  },
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < 1.0) return;
    if (s._bt) { if (SK.bot.drag(g, synth, s._bt.key, s._bt.t, s._bt.a, s._bt.b, 0.35)) s._bt = null; return; }
    const L = s.lanes.find(q => !inBand(q, q.bar)); if (!L) return; const K = KINDS[L.kind]; s._bn = (s._bn || 0) + 1;
    s._bt = { key: 'b' + s._bn, t: g.t + 0.2, a: [GATE + 40, L.y - L.bar], b: [GATE + 40, L.y - (K.dirty + K.clean) / 2] };
  },
});
