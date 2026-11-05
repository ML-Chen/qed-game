// MELT, THEN SET EACH CHOCOLATE! (chemistry CB EL-13 MELT!) — a sunny kitchen: a hot sunbeam on the windowsill, an open
// fridge, and chocolates waiting on the counter. Drag a chocolate into the sunbeam: it slumps and melts into a runny
// puddle in the mould dish there. Drag the dish into the fridge: the chocolate cools and sets hard again in the mould's
// shape (a heart, a star, a fish), and pops out onto the plate. It is still chocolate: melting and setting can be undone.
// The fried egg on the counter is the other kind of change: put it in the fridge and it just stays fried, now cold.
// Two chocolates at level 0, three at level 1; at level 2 the cold box is a freezer and the three things are an ice
// cube (it melts to water and freezes again), butter and chocolate.
(() => {
  const SUN = { x: 28, y: 214, w: 132, h: 118 }, FR = { x: 212, y: 196, w: 134, h: 262 }, SPOTS = [[66, 548], [140, 552], [214, 548]], PLATE = { x: 296, y: 560 }, EGG = { x: 40, y: 566 };
  const MOULDS = ['heart', 'star', 'fish'];
  const KINDS = { choc: { col: '#7a4a2a', melt: '#9a5a30', name: 'Chocolate' }, ice: { col: '#d8f0ff', melt: '#8ac8f0', name: 'Ice' }, butter: { col: '#f8e08a', melt: '#f0c850', name: 'Butter' } };
  const inR = (r, x, y) => x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h;
  function paintKitchen(o, freezer) {
    o.fillStyle = '#f4dcc0'; o.fillRect(0, 0, 360, 640); o.fillStyle = 'rgba(200,150,120,0.15)'; for (let x = 0; x < 360; x += 24) for (let y = 0; y < 470; y += 24) if ((x + y) % 48 === 0) o.fillRect(x, y, 24, 24);
    // the window with the sun outside
    o.fillStyle = '#8ad0f0'; o.fillRect(20, 120, 148, 110); const sg = o.createRadialGradient(60, 150, 4, 60, 150, 60); sg.addColorStop(0, '#fff8d0'); sg.addColorStop(0.3, '#ffe070'); sg.addColorStop(1, 'rgba(255,224,112,0)'); o.fillStyle = sg; o.fillRect(20, 120, 148, 110);
    o.strokeStyle = '#fff6ea'; o.lineWidth = 8; o.strokeRect(20, 120, 148, 110); o.lineWidth = 4; o.beginPath(); o.moveTo(94, 120); o.lineTo(94, 230); o.stroke();
    o.fillStyle = '#c8a070'; o.fillRect(12, 326, 164, 12); // the sill
    // the fridge (or freezer)
    o.fillStyle = '#e8eef4'; o.beginPath(); o.roundRect(FR.x - 6, FR.y - 16, FR.w + 12, FR.h + 30, 12); o.fill(); o.strokeStyle = '#8a9aaa'; o.lineWidth = 3; o.stroke();
    const ins = o.createLinearGradient(0, FR.y, 0, FR.y + FR.h); ins.addColorStop(0, freezer ? '#c8e8ff' : '#dff2ff'); ins.addColorStop(1, freezer ? '#a8d0f0' : '#c0e0f4'); o.fillStyle = ins; o.fillRect(FR.x, FR.y, FR.w, FR.h);
    o.strokeStyle = '#a8c0d8'; o.lineWidth = 3; for (const y of [FR.y + 88, FR.y + 176]) { o.beginPath(); o.moveTo(FR.x, y); o.lineTo(FR.x + FR.w, y); o.stroke(); }
    // a few things already inside: milk, a jar, a carrot (pushed to the sides, leaving room in the middle)
    o.fillStyle = '#ffffff'; o.fillRect(FR.x + 8, FR.y + 50, 16, 38); o.fillStyle = '#5a8ad8'; o.fillRect(FR.x + 8, FR.y + 62, 16, 10); o.fillStyle = '#e8563a'; o.beginPath(); o.roundRect(FR.x + FR.w - 26, FR.y + 146, 20, 30, 4); o.fill(); o.fillStyle = '#f0f0f0'; o.fillRect(FR.x + FR.w - 28, FR.y + 140, 24, 7);
    o.fillStyle = '#f08a30'; o.beginPath(); o.moveTo(FR.x + 10, FR.y + 250); o.lineTo(FR.x + 40, FR.y + 244); o.lineTo(FR.x + 40, FR.y + 254); o.closePath(); o.fill(); o.fillStyle = '#5aa840'; o.fillRect(FR.x + 40, FR.y + 245, 8, 3);
    if (freezer) { o.fillStyle = 'rgba(255,255,255,0.7)'; for (let i = 0; i < 14; i++) { o.beginPath(); o.arc(FR.x + (i * 37) % FR.w, FR.y + (i * 53) % FR.h, 3, 0, 7); o.fill(); } }
    // the counter
    o.fillStyle = '#a0704a'; o.fillRect(0, 478, 360, 162); o.fillStyle = '#c89a6a'; o.fillRect(0, 470, 360, 14);
    o.fillStyle = '#f4f4fa'; o.beginPath(); o.ellipse(PLATE.x, PLATE.y + 6, 50, 14, 0, 0, 7); o.fill(); o.strokeStyle = '#c8c8d8'; o.lineWidth = 2; o.stroke();
  }
  function shapePath(c, kind, x, y, s) {
    c.beginPath();
    if (kind === 'heart') { c.moveTo(x, y + 12 * s); c.bezierCurveTo(x - 22 * s, y - 2 * s, x - 12 * s, y - 18 * s, x, y - 8 * s); c.bezierCurveTo(x + 12 * s, y - 18 * s, x + 22 * s, y - 2 * s, x, y + 12 * s); }
    else if (kind === 'star') { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = (i % 2 ? 7 : 16) * s; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } }
    else { c.ellipse(x - 3 * s, y, 13 * s, 8 * s, 0, 0, 7); c.moveTo(x + 8 * s, y); c.lineTo(x + 18 * s, y - 8 * s); c.lineTo(x + 18 * s, y + 8 * s); c.closePath(); }
    c.closePath();
  }
  function whole(c, it, x, y, t) { // the thing before melting: a chocolate bunny, an ice cube, a pat of butter
    const K = KINDS[it.kind]; c.save();
    if (it.kind === 'ice') { c.fillStyle = 'rgba(220,240,255,0.9)'; c.strokeStyle = '#8ab8e0'; c.lineWidth = 2; c.beginPath(); c.roundRect(x - 16, y - 32, 32, 32, 6); c.fill(); c.stroke(); c.fillStyle = 'rgba(255,255,255,0.8)'; c.fillRect(x - 10, y - 26, 8, 4); }
    else if (it.kind === 'butter') { c.fillStyle = K.col; c.strokeStyle = '#c8a040'; c.lineWidth = 2; c.beginPath(); c.roundRect(x - 22, y - 20, 44, 20, 4); c.fill(); c.stroke(); c.fillStyle = '#ffffff'; c.fillRect(x - 26, y - 4, 52, 6); }
    else { c.fillStyle = K.col; c.strokeStyle = '#4a2a14'; c.lineWidth = 2; c.beginPath(); c.ellipse(x, y - 14, 15, 14, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.arc(x + 4, y - 34, 9, 0, 7); c.fill(); c.stroke();
      for (const dx of [-1, 8]) { c.beginPath(); c.ellipse(x + dx, y - 50, 4, 10, dx > 0 ? 0.25 : -0.1, 0, 7); c.fill(); c.stroke(); } c.fillStyle = '#2a1408'; c.beginPath(); c.arc(x + 8, y - 36, 1.6, 0, 7); c.fill(); }
    c.restore();
  }
  function dish(c, it, x, y, t) { // the mould dish with whatever is in it: slumping, runny, or setting
    const K = KINDS[it.kind]; c.fillStyle = '#c8c8d8'; c.beginPath(); c.ellipse(x, y + 2, 30, 9, 0, 0, 7); c.fill();
    c.save(); c.strokeStyle = '#8a8aa0'; c.lineWidth = 2; shapePath(c, it.mould, x, y - 10, 1.05); c.stroke(); c.restore();
    if (it.st === 'melting' && it.k < 1) { const k = it.k; c.save(); c.translate(x, y); c.scale(1 + k * 0.6, Math.max(0.15, 1 - k)); whole(c, it, 0, 0, t); c.restore(); }
    if (it.k > 0.4 || it.st !== 'melting') { const liquid = it.st === 'setting' ? 1 - it.sk : 1, a = it.st === 'melting' ? SK.clamp((it.k - 0.4) / 0.6, 0, 1) : 1;
      c.save(); c.globalAlpha = a; c.fillStyle = P.mix(K.col, K.melt, liquid); shapePath(c, it.mould, x, y - 10, 1); c.fill();
      if (liquid > 0.3) { c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(x - 5, y - 14, 5, 2, -0.4, 0, 7); c.fill(); } c.restore(); }
  }
  function egg(c, x, y, cold, t) { c.save(); c.translate(x, y); c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(-20, 0); c.bezierCurveTo(-24, -14, -6, -18, 0, -12); c.bezierCurveTo(10, -20, 26, -10, 20, 0); c.closePath(); c.fill(); c.strokeStyle = '#d8d0c0'; c.lineWidth = 1.5; c.stroke();
    c.fillStyle = '#ffb820'; c.beginPath(); c.arc(0, -7, 6.5, 0, 7); c.fill(); c.fillStyle = 'rgba(200,120,40,0.4)'; c.beginPath(); c.arc(-10, -4, 3, 0, 7); c.fill(); if (cold) { c.fillStyle = 'rgba(200,230,255,0.6)'; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(-16 + i * 6, -8 + (i % 2) * 5, 1.6, 0, 7); c.fill(); } } c.restore(); }
  MG.add({
    id: 'matter_chocmelt', stage: 'matter', cmd: 'MELT, THEN SET EACH CHOCOLATE!', cmdAt: [null, null, 'MELT, THEN FREEZE EACH ONE!'], time: 9, mood: 'sea', winText: 'Melted and set again!', failText: 'Not set yet!',
    card: { title: 'Melt it, set it again', kind: 'Chemistry', ref: 'Reversible and irreversible changes',
      text: "Warm chocolate melts into a runny liquid. Cool it down and it sets hard again, in whatever shape it was poured into. It is still chocolate the whole time. A change you can undo like this is called a reversible change. Ice melting into water and freezing again is another one.\n\nCooking an egg is different. Heat changes what the egg is made of, so cooling it down doesn't turn it back into runny egg. A change like that can't be undone.",
      note: 'Melting and setting can be undone by heating and cooling, but cooking changes a thing for good.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level), v = SK.variant(g, 4), mo = SK.shuffled(g, MOULDS);
      const kinds = L === 2 ? SK.shuffled(g, ['ice', 'butter', 'choc']) : ['choc', 'choc', 'choc']; const n = L === 0 ? 2 : 3;
      s.items = []; for (let i = 0; i < n; i++) s.items.push({ kind: kinds[i], mould: mo[i], st: 'counter', x: SPOTS[(i + v) % 3][0], y: SPOTS[(i + v) % 3][1], hx: SPOTS[(i + v) % 3][0], hy: SPOTS[(i + v) % 3][1], k: 0, sk: 0 });
      s.freezer = L === 2; s.done = 0; s.drag = null; s.egg = { x: EGG.x, y: EGG.y, cold: 0, inFr: false };
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return;
      const it = SK.pick(s.items.filter(q => q.st === 'counter' || q.st === 'melted'), x, y + 16, 46); if (it) { s.drag = { it, ox: it.x - x, oy: it.y - y }; it.st = it.st === 'melted' ? 'carryM' : 'carry'; g.sfx('pop'); return; }
      if (SK.dist(x, y, s.egg.x, s.egg.y - 8) < 36) s.drag = { egg: true, ox: s.egg.x - x, oy: s.egg.y - y };
    },
    move(g, x, y) { const s = g.s, d = s.drag; if (!d) return; const o = d.egg ? s.egg : d.it; o.x = x + d.ox; o.y = y + d.oy; },
    up(g) {
      const s = g.s, d = s.drag; if (!d) return; s.drag = null;
      if (d.egg) { const e = s.egg; if (inR(FR, e.x, e.y - 10)) { e.inFr = true; e.x = FR.x + FR.w / 2; e.y = FR.y + 170; g.sfx('click'); g.sfx('laugh'); } else { e.x = EGG.x; e.y = EGG.y; e.inFr = false; } return; }
      const it = d.it;
      if (it.st === 'carry' && inR(SUN, it.x, it.y - 20)) { it.st = 'melting'; it.x = SUN.x + SUN.w / 2; it.y = SUN.y + SUN.h - 10; g.sfx('drip'); return; }
      if (it.st === 'carryM' && inR(FR, it.x, it.y - 10)) { it.st = 'setting'; const slot = s.items.filter(q => q.st === 'setting').length - 1; it.x = FR.x + FR.w / 2; it.y = FR.y + 74 + 88 * (slot % 3); g.sfx('click'); return; }
      if (it.st === 'carry') { it.st = 'counter'; it.x = it.hx; it.y = it.hy; } else { it.st = 'melted'; it.x = SUN.x + SUN.w / 2; it.y = SUN.y + SUN.h - 10; }
    },
    update(g, dt) {
      const s = g.s;
      for (const it of s.items) {
        if (it.st === 'melting') { it.k = Math.min(1, it.k + dt / 1.1); if (g.rand() < dt * 3) g.sfx('drip', { vol: 0.3 }); if (it.k >= 1) { it.st = 'melted'; g.sfx('slurp'); } }
        if (it.st === 'setting') { it.sk = Math.min(1, it.sk + dt / 1.0); if (it.sk >= 1) { it.st = 'done'; it.doneT = g.t; s.done++; g.sfx('pop'); g.sfx('chime'); g.burst(PLATE.x, PLATE.y - 10, ['#ffd45a', '#fff6ea'], 10, 100); if (s.done >= s.items.length && !g.done) { g.win(); g.sfx('cheer'); } } }
      }
      if (s.egg.inFr) s.egg.cold = Math.min(1, s.egg.cold + dt);
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('chocmelt_bg' + (s.freezer ? 'f' : ''), o => paintKitchen(o, s.freezer)), 0, 0, 360, 640);
      // the hot sunbeam on the sill
      c.save(); c.globalCompositeOperation = 'lighter'; const sb = c.createLinearGradient(40, 140, 120, 330); sb.addColorStop(0, `rgba(255,220,120,${0.32 + 0.06 * Math.sin(t * 2)})`); sb.addColorStop(1, 'rgba(255,200,100,0.1)'); c.fillStyle = sb; c.beginPath(); c.moveTo(30, 130); c.lineTo(150, 130); c.lineTo(170, 334); c.lineTo(24, 334); c.closePath(); c.fill(); c.restore();
      c.save(); c.strokeStyle = 'rgba(255,170,80,0.45)'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { const y = 300 - ((t * 30 + i * 18) % 50); c.beginPath(); c.moveTo(60 + i * 30, y); c.quadraticCurveTo(66 + i * 30, y - 8, 60 + i * 30, y - 16); c.stroke(); } c.restore(); // heat shimmer
      SK.tag(c, 'Sun', 94, 112 + 40, 18); SK.tag(c, s.freezer ? 'Freezer' : 'Fridge', FR.x + FR.w / 2, FR.y - 34, 18);
      // finished shapes on the plate
      s.items.filter(q => q.st === 'done').forEach((q, i) => { const x = PLATE.x - 26 + i * 26, y = PLATE.y - 2, K = KINDS[q.kind]; c.fillStyle = K.col; c.strokeStyle = P.shade(K.col, -0.4); c.lineWidth = 1.5; shapePath(c, q.mould, x, y, 0.8); c.fill(); c.stroke(); });
      // the fried egg (and its frosty fridge stay)
      egg(c, s.egg.x, s.egg.y, s.egg.cold > 0.5, t); if (s.egg.inFr && s.egg.cold > 0.4) SK.tag(c, 'Still fried', s.egg.x, s.egg.y + 22, 18);
      for (const it of s.items) { if (it.st === 'done') continue; if (it.st === 'counter' || it.st === 'carry') whole(c, it, it.x, it.y, t); else dish(c, it, it.x, it.y, t);
        if (it.st === 'setting') { c.fillStyle = `rgba(230,245,255,${0.5 * it.sk})`; for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(it.x - 16 + i * 8, it.y - 20 - (i % 2) * 6, 1.8, 0, 7); c.fill(); } } }
      const first = s.items.find(q => q.st === 'counter'); if (first && !g.done) SK.tag(c, KINDS[first.kind].name, first.x, first.y + 28, 18);
      if (!won) SK.tag(c, s.done + ' / ' + s.items.length, 296, 506, 18);
      SK.animal(c, 'hedgehog', 182, 474, 0.6, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
      // guidance: a runny dish goes to the fridge; otherwise the next chocolate goes into the sunbeam
      if (!g.done && !s.drag) { const m = s.items.find(q => q.st === 'melted'), c0 = s.items.find(q => q.st === 'counter'), busy = s.items.some(q => q.st === 'melting');
        if (m) { const tx = FR.x + FR.w / 2, ty = FR.y + 120; SK.grab(c, g, m.x, m.y - 12, 30); SK.target(c, g, tx, ty, 0, { w: FR.w - 10, h: FR.h - 20, col: '#3a8ae8' }); SK.arrow(c, g, m.x, m.y - 12, tx, ty, { from: 34, to: 40, col: '#c0502a' }); SK.demo(g, c, 'drag', [m.x, m.y - 12], [tx, ty]); }
        else if (c0 && !busy) { const tx = SUN.x + SUN.w / 2, ty = SUN.y + SUN.h / 2; SK.grab(c, g, c0.x, c0.y - 20, 30, { col: '#e8563a' }); SK.target(c, g, tx, ty, 0, { w: SUN.w, h: SUN.h, col: '#e8563a' }); SK.arrow(c, g, c0.x, c0.y - 20, tx, ty, { from: 34, to: 40, col: '#c0502a' }); SK.demo(g, c, 'drag', [c0.x, c0.y - 20], [tx, ty]); }
        else SK.demo(g, c, 'tap', [0, 0], null, { never: true }); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 1.0) return; const B = s._bot = s._bot || {}; if (B.busy) { if (SK.bot.drag(g, synth, B.key, B.t0, B.a, B.b, 0.35)) B.busy = 0; return; }
      const m = s.items.find(q => q.st === 'melted'), c0 = s.items.find(q => q.st === 'counter'), melting = s.items.some(q => q.st === 'melting');
      if (m) { B.key = 'm' + s.items.indexOf(m); B.a = [m.x, m.y - 12]; B.b = [FR.x + FR.w / 2, FR.y + 120]; }
      else if (c0 && !melting) { B.key = 'c' + s.items.indexOf(c0); B.a = [c0.x, c0.y - 20]; B.b = [SUN.x + SUN.w / 2, SUN.y + SUN.h / 2]; } else return;
      B.t0 = g.t; B.busy = 1; SK.bot.drag(g, synth, B.key, B.t0, B.a, B.b, 0.35);
    },
  });
})();
