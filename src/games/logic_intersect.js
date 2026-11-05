// logic_intersect.js — INTERSECT! Sort animals into a Venn diagram: circle A, circle B and their overlap A ∩ B.
// Each animal waits in the grass wearing a tag: "A", "B" or "A B". The player drags each one into its region: A only,
// the overlap (both tags), or B only, in any order. A drop in the wrong region wobbles. On a right drop the animal hops
// from where it was dropped to its spot, its tag letters light up, and the circle (or both circles, for the overlap)
// rings in its colour as it lands. When every animal is placed, tapping the overlap (or the ? in |A ∩ B| = ?) counts
// it: the overlap glows, the animals in it hop one by one with "1", "2", "3" popping above them, and the count flies
// up into the ? from the last one.
// Level 0: 4 animals. Level 1: 5. Level 2: 6. Every region gets one to three animals (three spots per region).
// ∩ is drawn as a stroke over an invisible placeholder token. Medium mode: the animals hop without numbers, then the
// count opens a tray.
const M = MK, CA = { x: 128, y: 330 }, CB = { x: 232, y: 330 }, R = 94, QY = 548;
const COL = { A: '#2f7ad0', B: '#e0702a' };
const KINDS = ['duck', 'frog', 'penguin', 'rabbit', 'hedgehog', 'fox', 'owl', 'beaver', 'turtle', 'bird'];
const REG = { A: { x: 82, y: 330, w: 76, h: 150 }, AB: { x: 180, y: 330, w: 60, h: 130 }, B: { x: 278, y: 330, w: 76, h: 150 } };
const SLOTS = { A: [[86, 352], [76, 304], [104, 400]], AB: [[180, 352], [180, 404], [180, 300]], B: [[274, 352], [284, 304], [256, 400]] };
function glyph(c, x, y, s, col) { const a = s * 0.2; c.save(); c.strokeStyle = col; c.lineWidth = s * 0.085; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - a, y + a * 1.2); c.lineTo(x - a, y); c.arc(x, y, a, Math.PI, 0); c.lineTo(x + a, y + a * 1.2); c.stroke(); c.restore(); }
function gen(g) {
  const n = 4 + g.level, tags = ['A', 'AB', 'B']; // each region has three spots, so no region gets a fourth animal
  while (tags.length < n) { const k = ['A', 'AB', 'B'][Math.floor(g.rand() * 3)]; if (tags.filter(q => q === k).length < 3) tags.push(k); }
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [tags[i], tags[j]] = [tags[j], tags[i]]; }
  const kinds = KINDS.slice(); for (let i = kinds.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]]; }
  return tags.map((tag, i) => ({ i, tag, kind: kinds[i], hx: 180 + (i - (n - 1) / 2) * 56, hy: QY, x: 180 + (i - (n - 1) / 2) * 56, y: QY, placed: false }));
}
const zoneOf = a => ({ x: a.x, y: a.y - 26, w: 48, h: 62 });

MG.add({
  id: 'logic_intersect', stage: 'logic', cmd: 'INTERSECT!', hint: 'drag', time: 9, mood: 'bright', winText: 'Sorted!', hold: 1.4,
  card: {
    title: 'Intersection of sets', ref: 'Discrete math', kind: 'Sets',
    text: 'A set is a collection of things, called its members. A Venn diagram draws each set as a circle. Here A is the set of animals with an A tag, and B is the set of animals with a B tag.\n\nThe intersection A ∩ B (say "A intersect B") is the set of members that are in both A and B. It is where the two circles overlap. A member of only one set goes in its own circle, outside the overlap.\n\nThe bars | | mean "how many members". For example, if A = {duck, frog, owl} and B = {owl, fox}, then A ∩ B = {owl}, so |A ∩ B| = 1.',
    note: 'A ∩ B holds exactly the things that are in A and also in B. In a Venn diagram it is the overlap of the two circles.',
    ask: 'If A = {1, 2, 3, 4} and B = {3, 4, 5}, what is A ∩ B? What is |A ∩ B|?',
  },

  init(g) {
    const S = g.s; M.setup(g); S.ani = gen(g); S.used = { A: 0, AB: 0, B: 0 }; S.nAB = S.ani.filter(a => a.tag === 'AB').length;
    for (const a of S.ani) M.zone(g, 'a' + a.i, zoneOf(a));
    for (const k of ['A', 'AB', 'B']) M.zone(g, 'z' + k, REG[k]);
    S.cnt = M.slot('cnt', { w: 40 });
    M.place(g, 'top', M.row(M.txt('|', 'b1'), M.vr('A', 'tA'), M.op('+', 'cap', { alpha: 0 }), M.vr('B', 'tB'), M.txt('|', 'b2'), M.op('=', 'eq'), S.cnt), 180, 210, 36, { col: '#3a1640' });
    M.inert(g, ['b1', 'tA', 'cap', 'tB', 'b2', 'eq']);
    g.dur *= (2.6 + 1.05 * (S.ani.length + 1)) / 8;
    const T = S.T = M.pace(g), hop = e => { S.mk.lastMove = g.t; S.face = e || 'wow'; S.faceT = g.t; };
    M.play(g, {
      moves(g) {
        const out = S.ani.filter(a => !a.placed).map(a => {
          const r = REG[a.tag];
          return { drag: 'a' + a.i, to: 'z' + a.tag, reach: 14, area: [r.x - r.w / 2 - 8, r.y - r.h / 2 - 8, r.x + r.w / 2 + 8, r.y + r.h / 2 + 8], busy: 0.1, then(g) {
            // the animal hops from where it was dropped to its spot; its circle (or both) rings as it lands
            const [x, y] = SLOTS[a.tag][S.used[a.tag]++ % 3], d = S.lastUp || { x: a.x, y: a.y }; M.show(g, 0.75 * T);
            a.from = { x: d.x, y: d.y + 14 }; a.x = x; a.y = y; a.placed = true; a.moveAt = g.t; a.moveDur = 0.42 * T; a.tagAt = g.t; hop();
            M.inert(g, ['a' + a.i]); M.zone(g, 'a' + a.i, zoneOf(a)); g.sfx('swoosh');
            M.at(g, [[0.42 * T, g => { a.landAt = g.t; S.ring = { tag: a.tag, t0: g.t }; g.sfx(a.kind === 'duck' ? 'quack' : 'pop'); g.burst(x, y - 20, a.tag === 'AB' ? [COL.A, COL.B, '#fff'] : [COL[a.tag], '#fff'], 10, 100); hop('laugh'); }]]);
          } };
        });
        // the count: the overlap glows and its animals hop one by one ("1", "2", "3"), then the number flies up
        const CT = 0.32 * T, C0 = 0.2 * T, cEnd = C0 + S.nAB * CT;
        if (!out.length && !S.counted) out.push({ tap: ['zAB', 'cnt'], busy: 0.1, askAt: cEnd, after: 0.6 * T,
          ask: { v: S.nAB, wrong: [S.nAB + 1, S.ani.filter(a => a.tag !== 'B').length, Math.max(0, S.nAB - 1)] },
          then(g) { S.countAt = g.t; S.countC0 = C0; S.countCT = CT; M.show(g, cEnd); g.sfx('tap'); hop('think');
            S.ani.filter(a => a.tag === 'AB').sort((p, q) => p.y - q.y).forEach((a, k) => { a.ck = k; M.at(g, [[C0 + k * CT, g => { g.sfx('pop', { p: 1 + k * 0.15 }); hop(); }]]); }); },
          resolve(g) { M.show(g, 0.6 * T); const last = S.ani.filter(a => a.tag === 'AB').sort((p, q) => q.y - p.y)[0];
            M.fly(g, { node: M.num(S.nAB), from: [last.x - 30, last.y - 30], to: 'cnt', dur: 0.4 * T, arc: -40, s0: 26, s1: 36, col: '#6a3a9a',
              then(g) { S.counted = true; S.cnt.fill = M.num(S.nAB, null, { pop: g.t }); g.sfx('coin'); hop('laugh'); const b = M.box(g, 'cnt'); if (b) g.burst(b.x, b.y, ['#ffd970', '#fff', '#c89ae8'], 12, 110); } }); } });
        return out;
      },
      area(g) { const m = M.current(g)[0]; return m ? [].concat(m.tap || m.drag) : null; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { g.s.lastUp = { x, y }; M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, K = g.s.mk;
    SCN.std(g, c, { scene: 'meadow', panel: 'none' });
    // the universe: a picnic blanket on the grass, and the two circles on it
    c.save(); c.fillStyle = 'rgba(40,60,30,0.25)'; c.beginPath(); c.roundRect(18, 228, 324, 214, 16); c.fill();
    c.fillStyle = '#fffaf0'; c.beginPath(); c.roundRect(14, 222, 324, 214, 16); c.fill(); c.strokeStyle = '#e8c8a0'; c.lineWidth = 3; c.stroke(); c.restore();
    const miss = K.missInfo && K.missInfo.to && t - K.missAt < 0.6 ? K.missInfo.to : null;
    for (const [k, C] of [['A', CA], ['B', CB]]) {
      const sh = miss === 'z' + k ? Math.sin((t - K.missAt) * 50) * 4 : 0;
      c.save(); c.fillStyle = COL[k] + '30'; c.beginPath(); c.arc(C.x + sh, C.y, R, 0, 7); c.fill(); c.lineWidth = 4; c.strokeStyle = miss === 'z' + k ? M.BAD : COL[k]; c.stroke(); c.restore();
    }
    // the overlap is drawn a second time, purple, so A ∩ B reads as its own region; it glows while it is counted
    const T = S.T || 1, cg = S.countAt != null ? M.clamp((t - S.countAt) / (0.2 * T), 0, 1) * (S.counted ? 0.5 + 0.5 * Math.abs(Math.sin(t * 3)) : 1) : 0;
    c.save(); c.beginPath(); c.arc(CA.x, CA.y, R, 0, 7); c.clip(); c.beginPath(); c.arc(CB.x, CB.y, R, 0, 7);
    c.fillStyle = miss === 'zAB' ? 'rgba(216,69,74,0.35)' : `rgba(150,90,200,${0.22 + 0.2 * cg})`; c.fill();
    if (cg > 0) { c.shadowColor = '#c89ae8'; c.shadowBlur = 16 * cg; c.strokeStyle = `rgba(150,90,200,${0.8 * cg})`; c.lineWidth = 4; c.stroke(); c.restore(); c.save(); c.beginPath(); c.arc(CB.x, CB.y, R, 0, 7); c.clip(); c.shadowColor = '#c89ae8'; c.shadowBlur = 16 * cg; c.strokeStyle = `rgba(150,90,200,${0.8 * cg})`; c.lineWidth = 4; c.beginPath(); c.arc(CA.x, CA.y, R, 0, 7); c.stroke(); }
    c.restore();
    // a landing rings its circle (or, for the overlap, both circles) in its colour
    if (S.ring) { const k = M.clamp((t - S.ring.t0) / (0.5 * T), 0, 1);
      if (k < 1) for (const [key, C] of [['A', CA], ['B', CB]]) { if (!S.ring.tag.includes(key)) continue;
        c.save(); c.globalAlpha = 1 - k; c.strokeStyle = COL[key]; c.shadowColor = COL[key]; c.shadowBlur = 14; c.lineWidth = 6 * (1 - k) + 2; c.beginPath(); c.arc(C.x, C.y, R + k * 10, 0, 7); c.stroke(); c.restore(); } }
    c.save(); c.font = M.VARF(30); c.textAlign = 'center'; c.fillStyle = COL.A; c.fillText('A', 40, 262); c.fillStyle = COL.B; c.fillText('B', 320, 262); c.restore();
    M.drawEx(g, c, 'top'); const cb = M.box(g, 'cap'); if (cb) glyph(c, cb.x, cb.y, cb.s, '#3a1640');
    // the animals, each with its tag above its head
    const P0 = K.press, held = P0 && P0.dragging ? P0.id : null;
    for (const a of S.ani) {
      let x = a.x, y = a.y, s = a.placed ? 0.52 : 0.6, mv = 0;
      if (held === 'a' + a.i) { x = P0.x; y = P0.y + 14; s = 0.66; }
      // the hop from the drop point to its spot, on an arc
      else if (a.moveAt != null && t - a.moveAt < a.moveDur) { const e = M.easeIO((t - a.moveAt) / a.moveDur); x = M.lerp(a.from.x, a.x, e); y = M.lerp(a.from.y, a.y, e) - Math.sin(e * Math.PI) * 46; s = M.lerp(0.66, 0.52, e); mv = 1; }
      const ck = S.countAt != null && a.ck != null ? (t - S.countAt) - S.countC0 - a.ck * S.countCT : -1, CH = 0.3 * T;
      const hop = a.landAt != null && t - a.landAt < 0.3 ? Math.sin((t - a.landAt) / 0.3 * Math.PI) * 14 : ck > 0 && ck < CH ? Math.sin(ck / CH * Math.PI) * 18 : 0;
      const sh = K.missInfo && K.missInfo.drag === 'a' + a.i && t - K.missAt < 0.5 ? Math.sin((t - K.missAt) * 50) * 4 : 0;
      try { ANI.draw(c, a.kind, x + sh, y - hop, s, { t, phase: a.i, pose: g.done && g.result === 'win' ? 'cheer' : hop || mv ? 'hop' : 'idle', expr: g.done && g.result === 'win' ? 'laugh' : 'happy' }); } catch (e) { P.sheep(c, x, y - hop, s * 0.8, { t }); }
      // while counting, each animal in the overlap gets a number as it hops (easy mode; medium asks for the count)
      if (ck > 0 && g.mode !== 'medium') { const k = M.clamp(ck / (0.18 * T), 0, 1), fade = S.counted ? M.clamp(1 - (t - S.countAt - S.countC0 - S.nAB * S.countCT - 0.5 * T) / (0.3 * T), 0, 1) : 1;
        c.save(); c.globalAlpha = fade; c.font = M.NUMF(20 * (0.6 + 0.4 * k + Math.sin(k * Math.PI) * 0.3), 700); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#6a3a9a'; c.strokeStyle = '#fffdf6'; c.lineWidth = 4;
        c.strokeText(String(a.ck + 1), x - 30, y - 30 - hop); c.fillText(String(a.ck + 1), x - 30, y - 30 - hop); c.restore(); }
      const ty = y - hop - 64 * s - 12, tw = a.tag === 'AB' ? 40 : 24;
      const tg = a.tagAt != null ? Math.sin(M.clamp((t - a.tagAt) / (0.7 * T), 0, 1) * Math.PI) : 0;
      c.save(); if (tg > 0) { c.shadowColor = a.tag === 'AB' ? '#c89ae8' : COL[a.tag]; c.shadowBlur = 14 * tg; c.translate(x + sh, ty); c.scale(1 + 0.3 * tg, 1 + 0.3 * tg); c.translate(-x - sh, -ty); }
      c.fillStyle = '#fffdf6'; c.strokeStyle = tg > 0 ? (a.tag === 'AB' ? '#9a5ac8' : COL[a.tag]) : 'rgba(58,22,64,0.5)'; c.lineWidth = 1.5 + tg * 1.5; c.beginPath(); c.roundRect(x + sh - tw / 2, ty - 11, tw, 22, 6); c.fill(); c.stroke(); c.shadowBlur = 0;
      c.font = M.VARF(17); c.textAlign = 'center'; c.textBaseline = 'middle';
      if (a.tag === 'AB') { c.fillStyle = COL.A; c.fillText('A', x + sh - 9, ty + 1); c.fillStyle = COL.B; c.fillText('B', x + sh + 9, ty + 1); }
      else { c.fillStyle = COL[a.tag]; c.fillText(a.tag, x + sh, ty + 1); }
      c.restore();
    }
    M.drawUI(g, c);
  },
});
