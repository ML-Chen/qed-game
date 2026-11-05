// TILT IT! (hardware MK-03) — a 3D printer with a model on its bed, ready to print. A 3D printer builds a part in thin
// layers from the bottom up, and each layer must sit on the one below. Any face of the model that points down at more
// than 45 degrees off the vertical hangs over thin air: those faces glow red, labelled "Overhang". Drag round the model
// to turn it (it always rests on its lowest point) until no red is left, then press Print: the nozzle lays it down
// layer by layer and it comes out clean. Print it with overhangs and those parts droop down like wet noodles.
// Level 0-1: two models (a T, an arch, a mushroom, a hook...). Level 2: three.
const TI = (() => {
  const BED = 470, CX = 180, SC = 1.25, PIV = [180, 360], BTN = { x: 180, y: 566, w: 200, h: 60 }, COS45 = 0.76;
  const arc = (cx, cy, r, a0, a1, n) => { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; };
  const MODELS = {
    T: { col: '#e8603a', pts: [[-55, -110], [55, -110], [55, -80], [15, -80], [15, 0], [-15, 0], [-15, -80], [-55, -80]] },
    Hook: { col: '#3a9ae8', pts: [[-15, 0], [15, 0], [15, -80], [62, -80], [62, -110], [-15, -110]] },
    Arch: { col: '#8a5ae8', pts: [[-60, 0], [-30, 0], ...arc(0, -30, 30, Math.PI, 2 * Math.PI, 10).slice(1, -1), [30, 0], [60, 0], [60, -90], [-60, -90]] },
    Mushroom: { col: '#e84a7a', pts: [[-12, 0], [12, 0], [12, -48], [54, -60], [40, -96], [-40, -96], [-54, -60], [-12, -48]] },
  };
  const SETS = [['T', 'Hook', 'Arch'], ['Arch', 'Mushroom', 'T'], ['Hook', 'Arch', 'Mushroom'], ['Mushroom', 'T', 'Hook']];
  // the model turned by angle a, resting on the bed, centred: screen points
  function place(name, a) {
    const P0 = MODELS[name].pts, c = Math.cos(a), s = Math.sin(a), r = P0.map(([x, y]) => [x * c - y * s, x * s + y * c].map(v => v * SC));
    let x0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of r) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    return r.map(([x, y]) => [x - (x0 + x1) / 2 + CX, y - y1 + BED]);
  }
  // the faces that point down too steeply and do not rest on the bed
  function overhangs(pts) {
    let A = 0; for (let i = 0; i < pts.length; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length]; A += x0 * y1 - x1 * y0; }
    const sg = A > 0 ? 1 : -1, out = [];
    for (let i = 0; i < pts.length; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length], L = Math.hypot(x1 - x0, y1 - y0); if (L < 1) continue;
      const nx = sg * (y1 - y0) / L, ny = -sg * (x1 - x0) / L; // outward normal (screen y is down)
      const onBed = y0 > BED - 14 && y1 > BED - 14; if (ny > COS45 && !onBed) out.push([[x0, y0], [x1, y1]]); }
    return out;
  }
  // the nearest angle (in 5-degree steps) with no overhangs
  function goodAngle(name, from) { let best = null, bd = 1e9; for (let k = 0; k < 72; k++) { const a = k * Math.PI / 36; if (overhangs(place(name, a)).length) continue; let d = a - from; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; if (Math.abs(d) < bd) { bd = Math.abs(d); best = from + d; } } return best; }
  function paint(o) {
    N4.vgrad(o, 0, 0, 360, 640, ['#2a3a4a', '#3a5066', '#2a3442']);
    o.fillStyle = 'rgba(255,255,255,0.05)'; for (let x = 20; x < 360; x += 40) for (let y = 130; y < 470; y += 40) { o.beginPath(); o.arc(x, y, 2, 0, 7); o.fill(); }
    // the printer's frame
    o.fillStyle = '#1a1e26'; o.fillRect(30, 150, 12, 360); o.fillRect(318, 150, 12, 360); o.fillRect(30, 140, 300, 16);
    o.fillStyle = '#4a5260'; o.fillRect(36, 150, 4, 360); o.fillRect(320, 150, 4, 360);
    // the bed
    const bg = o.createLinearGradient(0, BED, 0, BED + 20); bg.addColorStop(0, '#8a9aa8'); bg.addColorStop(1, '#5a6a78'); o.fillStyle = bg; o.fillRect(42, BED, 276, 18);
    o.strokeStyle = 'rgba(255,255,255,0.15)'; o.lineWidth = 1; for (let x = 52; x < 318; x += 16) { o.beginPath(); o.moveTo(x, BED + 2); o.lineTo(x, BED + 16); o.stroke(); }
    o.fillStyle = '#1a1e26'; o.fillRect(30, BED + 18, 300, 40); o.fillStyle = '#5ad0ff'; o.fillRect(250, BED + 30, 50, 14); // a little screen
    N4.vgrad(o, 0, 530, 360, 110, ['#5a4a3a', '#3a3026']);
    P.grain(o, 360, 640, 0.03);
  }
  function poly(c, pts) { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); }
  return { BED, CX, PIV, BTN, MODELS, SETS, place, overhangs, goodAngle, paint, poly };
})();
MG.add({
  id: 'build_tiltit', stage: 'build', cmd: 'TURN IT TILL NO RED, THEN PRINT!', time: 8, mood: 'desert', winText: 'Clean prints!', failText: 'Wet noodles!',
  card: { title: 'Nothing prints on thin air', kind: 'Engineering', ref: '3D printing overhangs (the 45-degree rule)',
    text: 'A 3D printer builds a part from the bottom up, one thin layer of melted plastic at a time. Each new layer has to rest on the layer below it.\n\nA wall that leans out gently is fine, because each layer still sits half on the one below. Lean it out more than about 45 degrees, or stick an arm straight out, and the plastic is laid on thin air. It sags and droops.\n\nTurning the part so its faces slope 45 degrees or less, or flipping it over, lets it print cleanly with nothing extra holding it up.',
    note: 'Faces that overhang more than about 45 degrees droop, so turn the part until every layer has something to rest on.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.queue = TI.SETS[s.v].slice(0, L >= 2 ? 3 : 2);
    s.i = 0; s.a = 0; s.phase = 'turn'; s.printT = 0; s.drag = null; s.nextT = 0; s.done = [];
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.phase !== 'turn') return;
    if (N4.inBox(TI.BTN, x, y, 12)) { s.phase = 'print'; s.printT = g.t; s.bad = TI.overhangs(TI.place(s.queue[s.i], s.a)).length > 0; g.sfx('click'); g.sfx('sweep'); return; }
    if (y < TI.BED + 20 && y > 130) { s.drag = Math.atan2(y - TI.PIV[1], x - TI.PIV[0]); SK.dragStart(g, null, x, y); g.sfx('tap'); }
  },
  move(g, x, y) { const s = g.s; if (s.drag == null || g.done) return; SK.dragMove(g, x, y); const a = Math.atan2(y - TI.PIV[1], x - TI.PIV[0]); let d = a - s.drag; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; s.drag = a; s.a += d; },
  up(g) { const s = g.s; if (s.drag == null) return; s.drag = null; SK.dragEnd(g); s.a = Math.round(s.a / (Math.PI / 36)) * (Math.PI / 36); g.sfx('click', { vol: 0.5 }); },
  update(g, dt) {
    const s = g.s; if (g.done) return;
    if (s.phase === 'print' && g.t - s.printT > 1.3) {
      if (s.bad) { s.phase = 'droop'; g.sfx('boing'); g.sfx('laugh'); g.fail(); return; }
      s.done.push(s.queue[s.i]); g.burst(TI.CX, TI.BED - 60, ['#fff6ea', '#ffd45a', '#8affb0'], 14, 140); g.sfx('ding');
      if (s.i >= s.queue.length - 1) { s.phase = 'won'; g.sfx('cheer'); g.win(); } else { s.phase = 'next'; s.nextT = g.t + 0.4; }
    }
    if (s.phase === 'next' && g.t >= s.nextT) { s.i++; s.a = 0; s.phase = 'turn'; g.sfx('pop'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', name = s.queue[s.i], M = TI.MODELS[name];
    c.drawImage(g.bake('tiltit_bg', TI.paint), 0, 0, 360, 640);
    const pts = TI.place(name, s.a), oh = TI.overhangs(pts), printing = s.phase === 'print' || s.phase === 'droop' || (s.phase === 'won' || s.phase === 'next');
    let y0 = 1e9; for (const [, y] of pts) y0 = Math.min(y0, y);
    const k = s.phase === 'print' ? SK.clamp((t - s.printT) / 1.2, 0, 1) : printing ? 1 : 0, layerY = TI.BED - (TI.BED - y0) * k;
    // the model: a see-through ghost until it prints; printed layers fill in solid from the bed up
    TI.poly(c, pts); c.fillStyle = P.shade(M.col, 0.5) + '55'; c.fill(); c.save(); c.setLineDash([5, 4]); c.strokeStyle = P.shade(M.col, 0.3); c.lineWidth = 2.5; c.stroke(); c.restore();
    if (k > 0) { c.save(); c.beginPath(); c.rect(0, layerY, 360, TI.BED - layerY); c.clip(); TI.poly(c, pts); c.fillStyle = M.col; c.fill(); c.strokeStyle = P.shade(M.col, -0.5); c.lineWidth = 2.5; c.stroke();
      c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = 1; for (let y = TI.BED - 4; y > layerY; y -= 5) { c.beginPath(); c.moveTo(40, y); c.lineTo(320, y); c.stroke(); } c.restore(); }
    // wet noodles: plastic laid on air droops down from every overhang
    if (s.phase === 'droop' || (lost && s.bad)) { const d = SK.clamp((t - s.printT - 1.3) * 2.5, 0, 1); c.strokeStyle = M.col; c.lineWidth = 5; c.lineCap = 'round';
      for (const [[ax, ay], [bx, by]] of oh) for (let j = 0; j <= 4; j++) { const f = j / 4, x = SK.lerp(ax, bx, f), y = SK.lerp(ay, by, f), L = (24 + 30 * ((j * 7) % 3) / 2) * d; c.beginPath(); c.moveTo(x, y); for (let q = 1; q <= 6; q++) c.lineTo(x + Math.sin(q * 1.3 + j + t * 3) * 5, Math.min(TI.BED - 2, y + L * q / 6)); c.stroke(); } }
    // the overhangs, glowing red, while you turn it
    if (s.phase === 'turn' && !g.done) { const p = 0.6 + 0.4 * Math.sin(t * 6); c.save(); c.strokeStyle = `rgba(255,60,60,${p})`; c.lineWidth = 7; c.lineCap = 'round'; for (const [[ax, ay], [bx, by]] of oh) { c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); } c.restore();
      if (oh.length && g.level <= 1) { let mx = 0, my = 0; for (const [[ax, ay], [bx, by]] of oh) { mx += (ax + bx) / 2; my += (ay + by) / 2; } mx /= oh.length; my /= oh.length; SK.tag(c, 'Overhang', SK.clamp(mx, 70, 290), my + 26, 18, '#fff6ea', 'rgba(200,40,40,0.92)'); } }
    // the print head: moves across the current layer while printing
    const hx = s.phase === 'print' ? TI.CX + Math.sin(t * 14) * 70 : TI.CX, hy = s.phase === 'print' ? layerY - 26 : 182;
    c.fillStyle = '#4a5260'; c.fillRect(42, hy - 6, 276, 8); c.fillStyle = '#e8e8f0'; c.strokeStyle = '#1a1e26'; c.lineWidth = 2; c.beginPath(); c.roundRect(hx - 18, hy - 18, 36, 28, 6); c.fill(); c.stroke();
    c.fillStyle = '#c8a040'; c.beginPath(); c.moveTo(hx - 6, hy + 10); c.lineTo(hx + 6, hy + 10); c.lineTo(hx, hy + 22); c.closePath(); c.fill();
    if (s.phase === 'print') { c.fillStyle = '#ffb040'; c.beginPath(); c.arc(hx, hy + 24, 3, 0, 7); c.fill(); }
    // prints already done, on the shelf below
    s.done.forEach((n, j) => { c.save(); c.translate(56 + j * 46, 606); c.scale(0.3, 0.3); c.translate(-180, -470); TI.poly(c, TI.place(n, Math.PI)); c.fillStyle = TI.MODELS[n].col; c.fill(); c.restore(); });
    SK.tag(c, (s.i + 1) + ' / ' + s.queue.length, 300, 120 + 0 * 0, 18);
    SK.animal(c, 'owl', 322, 612, 0.7, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : oh.length ? 'think' : 'happy', facing: -1 });
    // the print button: lit once there is no red
    const ok = s.phase === 'turn' && !oh.length && !g.done;
    N4.button(c, TI.BTN, s.phase === 'print' ? 'Printing...' : 'Print', { pressed: s.phase === 'print', on: ok, col: ok ? '#3ac06a' : '#6a7a8a', size: 24 });
    // guidance: turn it to the nearest angle with no overhangs, then press Print
    let h = null;
    if (s.phase === 'turn' && !g.done && s.drag == null) {
      if (oh.length) { const ga = TI.goodAngle(name, s.a), d = SK.clamp(ga - s.a, -2.9, 2.9), r = 110, a0 = -Math.PI / 2 - 0.6 * Math.sign(d || 1), a1 = a0 + d; h = { kind: 'drag', a: [TI.PIV[0] + Math.cos(a0) * r, TI.PIV[1] + Math.sin(a0) * r], b: [TI.PIV[0] + Math.cos(a1) * r, TI.PIV[1] + Math.sin(a1) * r] };
        // a curved arrow round the model, the way to turn
        c.save(); c.strokeStyle = '#ffd45a'; c.fillStyle = '#ffd45a'; c.lineWidth = 6; c.lineCap = 'round'; c.globalAlpha = 0.85; c.beginPath(); c.arc(TI.PIV[0], TI.PIV[1], r + 14, Math.min(a0, a1), Math.max(a0, a1)); c.stroke();
        c.translate(TI.PIV[0] + Math.cos(a1) * (r + 14), TI.PIV[1] + Math.sin(a1) * (r + 14)); c.rotate(a1 + Math.sign(d) * Math.PI / 2); c.beginPath(); c.moveTo(11, 0); c.lineTo(-6, -10); c.lineTo(-6, 10); c.closePath(); c.fill(); c.restore(); }
      else { h = { kind: 'tap', a: [TI.BTN.x + 30, TI.BTN.y + 4] }; SK.glow(c, g, TI.BTN.x, TI.BTN.y, 56, '#a8ffb8', { level: 2 }); }
    }
    SK.demo(g, c, h ? h.kind : 'tap', h ? h.a : [0, 0], h ? h.b : null, { never: !h });
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._b = s._b || { n: 0, next: 1.0 }; if (g.done || s.phase !== 'turn' || g.t < B.next) return;
    const name = s.queue[s.i], oh = TI.overhangs(TI.place(name, s.a));
    if (!oh.length && !(s._bot && s._bot['r' + B.n] === 1)) { B.next = g.t + 0.2; synth('down', TI.BTN.x, TI.BTN.y); synth('up', TI.BTN.x, TI.BTN.y); return; }
    if (!B.ab || B.abn !== B.n) { const ga = TI.goodAngle(name, s.a), d = SK.clamp(ga - s.a, -2.9, 2.9), r = 110, a0 = -Math.PI / 2 - 0.6 * Math.sign(d || 1), a1 = a0 + d; B.abn = B.n; B.ab = [[TI.PIV[0] + Math.cos(a0) * r, TI.PIV[1] + Math.sin(a0) * r], [TI.PIV[0] + Math.cos(a1) * r, TI.PIV[1] + Math.sin(a1) * r]]; } // fixed for the whole drag
    if (SK.bot.drag(g, synth, 'r' + B.n, B.next, B.ab[0], B.ab[1], 0.4)) { B.n++; B.next = g.t + 0.3; }
  },
});
