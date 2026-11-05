// BALANCE! (chem_bio HC-12) — a brass balance in a night-blue lab: methane and oxygen on the left pan, carbon dioxide
// and water on the right, all as coloured balls. Drag whole molecules from the trays onto either pan until every
// colour's tally matches; each matching row turns green, the beam levels (the masses match once the atoms do), and the
// equation appears with the counts in front: CH4 + 2O2 -> CO2 + 2H2O. A loose atom will not go on: the trays only give
// out whole molecules, so it bounces back. Tap a molecule you added to take it off again. Level 2: propane.
(() => {
  const PIV = { x: 180, y: 168 }, ARM = 104, CHAIN = 118, COL = { C: '#3a3a48', H: '#f4f4f0', O: '#e8483a' }, MASS = { C: 12, H: 1, O: 16 };
  const MOL = {
    CH4: { atoms: { C: 1, H: 4 }, w: 44, sub: 'CH₄' }, O2: { atoms: { O: 2 }, w: 38, sub: 'O₂' },
    CO2: { atoms: { C: 1, O: 2 }, w: 52, sub: 'CO₂' }, H2O: { atoms: { H: 2, O: 1 }, w: 38, sub: 'H₂O' },
    C3H8: { atoms: { C: 3, H: 8 }, w: 70, sub: 'C₃H₈' },
  };
  const CAP = { O2: 6, CO2: 4, H2O: 5 };
  function drawMol(c, kind, x, y, s = 1) {
    c.save(); c.translate(x, y); c.scale(s, s);
    const at = (dx, dy, e) => SK.ball(c, dx, dy, e === 'H' ? 7 : e === 'C' ? 11 : 11.5, COL[e], { lw: 1.6 });
    if (kind === 'CH4') { for (const [dx, dy] of [[-13, -9], [13, -9], [-12, 10], [12, 10]]) at(dx, dy, 'H'); at(0, 0, 'C'); }
    if (kind === 'O2') { at(-8, 0, 'O'); at(8, 0, 'O'); }
    if (kind === 'CO2') { at(-17, 0, 'O'); at(17, 0, 'O'); at(0, 0, 'C'); }
    if (kind === 'H2O') { at(-11, 8, 'H'); at(11, 8, 'H'); at(0, -1, 'O'); }
    if (kind === 'C3H8') { for (const [dx, dy] of [[-30, -6], [-24, 12], [-12, -15], [-8, 14], [8, -15], [12, 14], [24, 12], [30, -6]]) at(dx, dy, 'H'); at(-18, 0, 'C'); at(0, 0, 'C'); at(18, 0, 'C'); }
    c.restore();
  }
  function count(list) { const n = { C: 0, H: 0, O: 0 }; for (const m of list) for (const e in MOL[m.kind].atoms) n[e] += MOL[m.kind].atoms[e]; return n; }
  const mass = n => n.C * MASS.C + n.H * MASS.H + n.O * MASS.O;
  function panPos(s, side) { const a = s.tilt, sx = side === 'L' ? -1 : 1; return { x: PIV.x + sx * ARM * Math.cos(a), y: PIV.y + sx * ARM * Math.sin(a) + CHAIN }; }
  function slot(p, i) { const col = i % 3, row = Math.floor(i / 3); return { x: p.x + (col - 1) * 36 + (row % 2) * 8, y: p.y - 20 - row * 28 }; }
  function paintBg(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#1e2a50'); bg.addColorStop(0.55, '#3a3a70'); bg.addColorStop(1, '#5a4a78'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    // a chalkboard wall of faint hexagons (rings of atoms)
    o.strokeStyle = 'rgba(200,210,255,0.06)'; o.lineWidth = 2; for (let y = 0; y < 480; y += 52) for (let x = (y / 52) % 2 ? 26 : 0; x < 380; x += 52) { o.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; o[k ? 'lineTo' : 'moveTo'](x + Math.cos(a) * 20, y + Math.sin(a) * 20); } o.closePath(); o.stroke(); }
    // the lab bench
    const bn = o.createLinearGradient(0, 500, 0, 640); bn.addColorStop(0, '#8a6a9a'); bn.addColorStop(0.06, '#6a4a7a'); bn.addColorStop(1, '#3a2848'); o.fillStyle = bn; o.fillRect(0, 500, 360, 140);
    o.fillStyle = 'rgba(255,255,255,0.16)'; o.fillRect(0, 500, 360, 3);
    // the balance post and base
    o.fillStyle = '#b8862a'; o.beginPath(); o.moveTo(150, 500); o.lineTo(210, 500); o.lineTo(196, 486); o.lineTo(164, 486); o.fill();
    const pg = o.createLinearGradient(170, 0, 190, 0); pg.addColorStop(0, '#f2c860'); pg.addColorStop(1, '#a8761e'); o.fillStyle = pg; o.fillRect(172, PIV.y, 16, 318);
    P.vignette(o, 360, 640, 0.3, '#100a20');
  }
  function tray(c, x, y, kind, n) { // a little wooden tray holding a pile of one kind of molecule
    c.fillStyle = 'rgba(20,10,30,0.3)'; c.beginPath(); c.ellipse(x, y + 22, 40, 7, 0, 0, 7); c.fill();
    c.fillStyle = '#c08a50'; c.strokeStyle = '#6a4020'; c.lineWidth = 2; c.beginPath(); c.roundRect(x - 38, y + 4, 76, 16, 5); c.fill(); c.stroke();
    if (n > 0) { drawMol(c, kind, x - 12, y - 2, 0.75); drawMol(c, kind, x + 12, y - 2, 0.75); drawMol(c, kind, x, y - 14, 0.85); }
  }
  MG.add({
    id: 'balance_eq', stage: 'reactions', cmd: 'BALANCE THE ATOMS!', time: 6, mood: 'night', winText: 'Same atoms on both sides!', failText: 'Atoms missing!',
    card: { title: 'Atoms are never lost', kind: 'Chemistry', ref: 'Balancing chemical equations (conservation of mass)',
      text: 'When methane burns, its atoms join up with oxygen in new ways and make carbon dioxide and water. No atom is made or destroyed. Every atom on the left must turn up on the right.\n\nYou can only add whole molecules, so you change how many of each molecule there are. One methane needs two oxygen molecules, and it makes one carbon dioxide and two waters. Those counts are the numbers written in front: CH₄ + 2O₂ → CO₂ + 2H₂O. Because every atom is still there, the mass on both sides is the same too.',
      note: 'In a reaction, atoms rearrange but none are lost, so a balanced equation has the same atoms on both sides.' },
    init(g) {
      const s = g.s, L2 = g.level >= 2;
      // four starting set-ups (how many fuel molecules, and what is already on each pan); every one needs at least two molecules added
      const v = s.v = SK.variant(g, 4), START = L2 ? [[1, 1, 1, 1], [1, 2, 1, 1], [1, 1, 2, 1], [1, 1, 1, 2]][v] : [[1, 1, 1, 1], [2, 1, 1, 1], [2, 2, 1, 2], [2, 3, 1, 1]][v];
      const B = k => ({ kind: k, base: true }), rep = (k, n) => Array.from({ length: n }, () => B(k));
      s.L = [...rep(L2 ? 'C3H8' : 'CH4', START[0]), ...rep('O2', START[1])];
      s.R = [...rep('CO2', START[2]), ...rep('H2O', START[3])];
      s.trays = [{ kind: 'O2', side: 'L', x: 62, y: 546 }];
      s.trays.push({ kind: 'CO2', side: 'R', x: 236, y: 546 }); s.trays.push({ kind: 'H2O', side: 'R', x: 310, y: 546 });
      s.loose = { x: 130, y: 556, hx: 130, hy: 556 }; s.held = null; s.tilt = 0; s.done = 0; s.bounce = 0;
      const nl = count(s.L), nr = count(s.R); s.tilt = SK.clamp((mass(nr) - mass(nl)) * 0.006, -0.28, 0.28);
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return;
      const tr = s.trays.find(t => SK.dist(x, y, t.x, t.y) < 44);
      if (tr) { const list = tr.side === 'L' ? s.L : s.R; if (list.filter(m => m.kind === tr.kind).length >= CAP[tr.kind]) { g.sfx('wrong'); return; } s.held = { kind: tr.kind, side: tr.side, x: tr.x, y: tr.y - 8 }; SK.dragStart(g, s.held, x, y); g.sfx('tap'); return; }
      if (SK.dist(x, y, s.loose.x, s.loose.y) < 30) { s.held = { loose: true, x: s.loose.x, y: s.loose.y }; SK.dragStart(g, s.held, x, y); return; }
      for (const side of ['L', 'R']) { const list = side === 'L' ? s.L : s.R, p = panPos(s, side);
        for (let i = list.length - 1; i >= 0; i--) { const q = slot(p, i); if (!list[i].base && SK.dist(x, y, q.x, q.y) < 20) { list.splice(i, 1); g.sfx('pop'); return; } } }
    },
    move(g, x, y) { SK.dragMove(g, x, y); if (g.s.held && g.s.held.loose) { g.s.loose.x = g.s.held.x; g.s.loose.y = g.s.held.y; } },
    up(g) {
      const s = g.s, d = SK.dragEnd(g), h = s.held; s.held = null; if (!d || !h || g.done) return;
      if (h.loose) { if (h.y < 380) { s.bounce = g.t; g.sfx('boing'); } return; }
      const p = panPos(s, h.side);
      if (Math.abs(h.x - p.x) < 90 && h.y < p.y + 50 && h.y > p.y - 150) { (h.side === 'L' ? s.L : s.R).push({ kind: h.kind, t0: g.t }); g.sfx('click'); g.sfx('ding'); }
    },
    update(g, dt) {
      const s = g.s, nl = count(s.L), nr = count(s.R);
      const want = SK.clamp((mass(nr) - mass(nl)) * 0.006, -0.28, 0.28); s.tilt += (want - s.tilt) * Math.min(1, dt * 5);
      if (!s.held || !s.held.loose) { s.loose.x += (s.loose.hx - s.loose.x) * Math.min(1, dt * 8); s.loose.y += (s.loose.hy - s.loose.y) * Math.min(1, dt * 8); }
      if (!g.done && nl.C === nr.C && nl.H === nr.H && nl.O === nr.O && !s.held) { if (!s.done) s.done = g.t; if (g.t - s.done > 0.35) { g.win(); g.sfx('cheer'); g.burst(PIV.x, PIV.y, ['#7ae08a', '#ffd45a', '#fff6ea'], 22, 200); } }
      else if (!g.done) s.done = 0;
    },
    draw(g, c) {
      const s = g.s, t = g.t, nl = count(s.L), nr = count(s.R);
      c.drawImage(g.bake('balance_eq_bg', paintBg), 0, 0, 360, 640);
      // the beam and the pans
      const a = s.tilt, lp = panPos(s, 'L'), rp = panPos(s, 'R');
      c.save(); c.translate(PIV.x, PIV.y); c.rotate(a); const bg = c.createLinearGradient(0, -6, 0, 6); bg.addColorStop(0, '#ffe08a'); bg.addColorStop(1, '#b8862a'); c.fillStyle = bg; c.strokeStyle = '#6a4a10'; c.lineWidth = 2; c.beginPath(); c.roundRect(-ARM - 8, -6, ARM * 2 + 16, 12, 6); c.fill(); c.stroke(); c.restore();
      c.fillStyle = '#ffd45a'; c.beginPath(); c.arc(PIV.x, PIV.y, 10, 0, 7); c.fill(); c.strokeStyle = '#6a4a10'; c.stroke();
      // the arrow of the reaction on the post
      c.fillStyle = '#fff6ea'; c.beginPath(); c.moveTo(164, 250); c.lineTo(188, 250); c.lineTo(188, 242); c.lineTo(200, 255); c.lineTo(188, 268); c.lineTo(188, 260); c.lineTo(164, 260); c.fill();
      for (const [p, list] of [[lp, s.L], [rp, s.R]]) {
        c.strokeStyle = '#c8a040'; c.lineWidth = 2; c.beginPath(); c.moveTo(p.x, p.y - CHAIN); c.lineTo(p.x - 62, p.y); c.moveTo(p.x, p.y - CHAIN); c.lineTo(p.x + 62, p.y); c.stroke();
        list.forEach((m, i) => { const q = slot(p, i), k = m.t0 ? SK.easeOut((t - m.t0) * 5) : 1; drawMol(c, m.kind, q.x, q.y - (1 - k) * 30, 0.8 + 0.2 * k); });
        const pg = c.createLinearGradient(0, p.y, 0, p.y + 16); pg.addColorStop(0, '#ffe08a'); pg.addColorStop(1, '#a8761e'); c.fillStyle = pg; c.strokeStyle = '#6a4a10'; c.lineWidth = 2; c.beginPath(); c.moveTo(p.x - 68, p.y); c.quadraticCurveTo(p.x, p.y + 30, p.x + 68, p.y); c.closePath(); c.fill(); c.stroke();
      }
      // the tallies: one row of balls per colour, left atoms against right atoms
      c.save(); c.fillStyle = 'rgba(236,232,250,0.9)'; c.beginPath(); c.roundRect(8, 360, 344, 118, 18); c.fill(); c.restore();
      ['C', 'H', 'O'].forEach((e, r) => {
        const y = 382 + r * 37, ok = nl[e] === nr[e];
        c.save(); c.fillStyle = ok ? 'rgba(122,224,138,0.35)' : 'rgba(60,40,90,0.08)'; c.beginPath(); c.roundRect(14, y - 15, 332, 30, 15); c.fill(); c.strokeStyle = ok ? '#3aa04a' : 'rgba(60,40,90,0.2)'; c.lineWidth = ok ? 3 : 1.5; c.beginPath(); c.roundRect(14, y - 15, 332, 30, 15); c.stroke(); c.restore();
        for (let i = 0; i < nl[e]; i++) SK.ball(c, 160 - i * 12, y, 6, COL[e], { lw: 1.2 });
        for (let i = 0; i < nr[e]; i++) SK.ball(c, 200 + i * 12, y, 6, COL[e], { lw: 1.2 });
        c.save(); c.translate(180, y); if (ok) { c.strokeStyle = '#2a8a3a'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(-7, 0); c.lineTo(-2, 6); c.lineTo(8, -6); c.stroke(); } else { c.fillStyle = '#d0402a'; c.font = '900 22px Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(nl[e] > nr[e] ? '>' : '<', 0, 1); } c.restore();
      });
      // the trays and the loose atom
      for (const tr of s.trays) { tray(c, tr.x, tr.y, tr.kind, 1); }
      const bq = s.bounce ? SK.clamp((t - s.bounce) * 3, 0, 1) : 1, ly = s.loose.y - Math.sin(bq * Math.PI) * 40, lw = Math.sin(t * 7) * 0.25; c.save(); c.translate(s.loose.x, ly); c.rotate(lw); SK.ball(c, 0, 0, 11.5, COL.O, { lw: 1.6 }); c.restore(); c.save(); c.strokeStyle = 'rgba(255,140,120,0.8)'; c.lineWidth = 2; c.setLineDash([3, 4]); c.beginPath(); c.arc(s.loose.x, ly, 17, 0, 7); c.stroke(); c.restore();
      if (s.held && !s.held.loose) drawMol(c, s.held.kind, s.held.x, s.held.y, 1.1);
      // the equation, once balanced
      if (g.result === 'win') { const cL = {}, cR = {}; for (const m of s.L) cL[m.kind] = (cL[m.kind] || 0) + 1; for (const m of s.R) cR[m.kind] = (cR[m.kind] || 0) + 1;
        const term = o => Object.keys(o).map(k => (o[k] > 1 ? o[k] : '') + MOL[k].sub).join(' + ');
        c.save(); c.globalAlpha = SK.clamp((t - g.doneAt) * 3, 0, 1); SK.tag(c, term(cL) + ' → ' + term(cR), 180, 336, 19); c.restore(); }
      // the penguin
      const won = g.result === 'win', lost = g.result === 'fail';
      SK.animal(c, 'penguin', 180, 616, 0.75, { t, pose: won ? 'cheer' : lost ? 'sad' : 'balance', expr: won ? 'laugh' : lost ? 'wow' : 'think' });
      // the next useful molecule: carbon dioxide or water on the right, or oxygen on the left
      let need = null; if (nr.C < nl.C) need = 'CO2'; else if (nr.H < nl.H) need = 'H2O'; else if (nl.O < nr.O) need = 'O2';
      const tr = s.trays.find(t => t.kind === need) || s.trays[0], tp = tr.side === 'L' ? lp : rp;
      if (need && !s.held) { SK.grab(c, g, tr.x, tr.y - 6, 34); SK.target(c, g, tp.x, tp.y - 30, 58); SK.arrow(c, g, tr.x, tr.y - 6, tp.x, tp.y - 30, { to: 70 }); }
      const NAME = { O2: 'Oxygen', CO2: 'CO\u2082', H2O: 'Water' }; for (const tr of s.trays) SK.tag(c, NAME[tr.kind], tr.x, 598, 18);
      // too many of something you added: that molecule glows on its pan, and the hand taps it off
      const off = need ? null : nr.C > nl.C ? ['R', 'CO2'] : nr.H > nl.H ? ['R', 'H2O'] : nl.O > nr.O ? ['L', 'O2'] : null;
      let offAt = null; if (off && !s.held) { const list = off[0] === 'L' ? s.L : s.R, i = list.map(m => !m.base && m.kind === off[1]).lastIndexOf(true); if (i >= 0) { offAt = slot(off[0] === 'L' ? lp : rp, i); SK.glow(c, g, offAt.x, offAt.y, 22, '#ff9a7a', { level: 2 }); } }
      if (offAt) SK.demo(g, c, 'tap', [offAt.x, offAt.y]); else SK.demo(g, c, 'drag', [tr.x, tr.y], [tp.x, tp.y - 40], { never: !need });
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done) return; const B = s._bt = s._bt || { n: 0, next: 1.0 };
      if (g.t < B.next) return; if (B.st == null) B.st = g.t;
      const nl = count(s.L), nr = count(s.R), L2 = g.level >= 2;
      // what is still missing: oxygen on the left, carbon dioxide or water on the right
      let kind = null; if (nr.C < nl.C) kind = 'CO2'; else if (nr.H < nl.H) kind = 'H2O'; else if (nl.O < nr.O) kind = 'O2';
      if (!kind) return; const tr = s.trays.find(t => t.kind === kind), p = panPos(s, tr.side);
      SK.bot.drag(g, synth, 'm' + B.n, B.st, [tr.x, tr.y], [p.x, p.y - 40], 0.3); if (s._bot['m' + B.n] === 2) { B.n++; B.next = g.t + 0.15; B.st = null; }
      void L2;
    },
  });
})();
