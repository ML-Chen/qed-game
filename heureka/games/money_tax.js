// FILL THE JAR TO THE LINE! (business PF-22) — tax brackets. Your income is water poured into a tax tower whose floors
// are the brackets (10%, 12%, 22%). Hold to earn: the water fills the tower from the bottom, and each floor keeps only its
// own share as tax (it drips into the Tax bucket in that floor's colour) and sends the rest to your Take-home jar. Let go
// when the jar reaches its green band (the bike, the laptop, the trip). The jar keeps rising even after the water reaches
// a higher floor, just a little slower: a higher rate only applies to the money on that floor. Stop short "to stay in the
// lower bracket" and a ghost jar shows the take-home you left behind; hold far too long and you worked overtime for nothing.
// Two goals (three at level 2), each further up the tower; the band is narrower at higher levels.
(() => {
  const BR = [[0, 12.4, 0.10, '#7ac8f0'], [12.4, 50.4, 0.12, '#7ad08a'], [50.4, 105.7, 0.22, '#f5c23a']], TOP = 105.7;
  const BASE = 560, TK = 2.5, JK = 3.05, TWR = { x: 150, w: 104 }, JAR = { x: 292, w: 92 }, BUCK = { x: 44 }, BTN = { x: 180, y: 600, w: 260, h: 40 };
  const GOALS = [['Bike', 'Laptop', 'Trip'], ['Guitar', 'Scooter', 'Camera'], ['Phone', 'Bike', 'Laptop'], ['Skates', 'Trip', 'Guitar']];
  const LV = [{ inc: [32, 72], band: 6, rate: 26 }, { inc: [40, 80], band: 4.5, rate: 30 }, { inc: [28, 60, 92], band: 3.6, rate: 34 }];
  const tax = I => BR.reduce((a, [lo, hi, r]) => a + Math.max(0, Math.min(I, hi) - lo) * r, 0), take = I => I - tax(I);
  const floorAt = I => BR.findIndex(([lo, hi]) => I < hi) < 0 ? 2 : BR.findIndex(([lo, hi]) => I < hi);
  function paint(o) {
    N6.vgrad(o, 0, 0, 360, 640, ['#9ad0e8', '#d0ecf4', '#fff6e0']); P.cloud(o, 300, 150, 0.5);
    P.hills(o, 360, 480, 40, '#b8c870', '#88984a', { seed: 9 });
    N6.vgrad(o, 0, BASE, 360, 80, ['#a87a4a', '#7a5030']); o.fillStyle = '#c89a68'; o.fillRect(0, BASE, 360, 5);
    // the tower's floors
    BR.forEach(([lo, hi, r, col]) => { const y0 = BASE - lo * TK, y1 = BASE - hi * TK; o.fillStyle = P.rgba(col, 0.22); o.fillRect(TWR.x - TWR.w / 2, y1, TWR.w, y0 - y1); o.strokeStyle = P.shade(col, -0.4); o.lineWidth = 2; o.strokeRect(TWR.x - TWR.w / 2, y1, TWR.w, y0 - y1); });
    o.fillStyle = '#8a5a3a'; o.beginPath(); o.moveTo(TWR.x - TWR.w / 2 - 10, BASE - TOP * TK); o.lineTo(TWR.x, BASE - TOP * TK - 26); o.lineTo(TWR.x + TWR.w / 2 + 10, BASE - TOP * TK); o.closePath(); o.fill();
    // the tap at the top, the pipe to the jar, the bucket
    o.fillStyle = '#8a8a9a'; o.fillRect(TWR.x - 70, 230, 64, 14); o.fillRect(TWR.x - 14, 230, 14, 34);
  }
  function newGoal(g) { const s = g.s; s.I = 0; s.phase = 'ready'; s.ghost = null; s.drips = []; s.relT = 0; s.inc = s.L.inc[s.gi]; s.line = take(s.inc); }
  MG.add({
    id: 'money_tax', stage: 'money', cmd: 'FILL THE JAR TO THE LINE!', time: 7, mood: 'desert', winText: 'More pay, more take-home!', failText: 'Missed the line!', hold: 1.7,
    card: { title: 'A raise never lowers your take-home pay', kind: 'Money', ref: 'Tax brackets (United States)',
      text: 'Income tax in the United States works in floors called brackets. In 2026, for a single person, roughly the first $12,000 of taxable income is taxed at 10%, the part up to about $50,000 at 12%, and the part above that at 22%, with higher floors after.\n\nEach rate only applies to the money on its own floor. Earning more never pushes the money you already had into a higher rate.\n\nSo a raise that crosses into a new bracket still leaves you with more money. Only the new dollars pay the higher rate.',
      note: 'Each tax rate applies only to the income on its own floor, so earning more always leaves you with more.' },
    init(g) { const s = g.s; s.L = LV[Math.min(2, g.level)]; s.v = SK.variant(g, 4); s.names = GOALS[s.v]; s.gi = 0; s.held = false; s.done = []; s.taxP = 0; newGoal(g); },
    down(g) { const s = g.s; SK.touched(g); if (g.done || s.phase !== 'ready') return; s.held = true; s.phase = 'pour'; g.sfx('drip'); },
    up(g) {
      const s = g.s; if (!s.held) return; s.held = false; if (g.done || s.phase !== 'pour') return; const th = take(s.I);
      if (th >= s.line && th <= s.line + s.L.band) { s.phase = 'got'; s.relT = g.t; s.done.push(s.names[s.gi]); g.sfx('chime'); g.burst(JAR.x, BASE - th * JK, ['#ffd45a', '#fff6ea', '#8affb0'], 16, 160); if (s.gi + 1 >= s.L.inc.length) { g.win(); g.sfx('cheer'); } }
      else if (th < s.line) { const fl = BR.find(([lo]) => lo > 0 && lo <= s.inc && s.I < lo + 6 && s.I >= lo - 8); s.ghost = take(s.inc); s.phase = 'short'; s.relT = g.t; g.sfx('wrong'); g.fail(); }
    },
    update(g, dt) {
      const s = g.s;
      if (s.phase === 'pour' && !g.done) { const d = s.L.rate * dt; s.I = Math.min(TOP, s.I + d); s.taxP += d * BR[floorAt(s.I)][2];
        if (g.rand() < 0.5) s.drips.push({ t: g.t, f: floorAt(s.I) }); if (take(s.I) > s.line + s.L.band) { s.held = false; s.phase = 'over'; s.relT = g.t; g.sfx('laugh'); g.fail(); } }
      s.drips = s.drips.filter(d => g.t - d.t < 0.5);
      if (s.phase === 'got' && !g.done && g.t - s.relT > 0.7) { s.gi++; newGoal(g); g.sfx('pop'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', th = take(s.I), fi = floorAt(s.I);
      c.drawImage(g.bake('n6tax_bg', paint), 0, 0, 360, 640);
      // the water in the tower, coloured floor by floor
      BR.forEach(([lo, hi, r, col], i) => { if (s.I <= lo) return; const y0 = BASE - lo * TK, y1 = BASE - Math.min(s.I, hi) * TK; c.fillStyle = P.rgba(col, 0.85); c.fillRect(TWR.x - TWR.w / 2 + 2, y1, TWR.w - 4, y0 - y1);
        if (s.I < hi && s.phase === 'pour') { c.fillStyle = 'rgba(255,255,255,0.5)'; c.fillRect(TWR.x - TWR.w / 2 + 2, y1, TWR.w - 4, 3); } });
      BR.forEach(([lo, hi, r, col]) => N6.text(c, Math.round(r * 100) + '%', TWR.x, BASE - (lo + hi) / 2 * TK, lo === 0 ? 16 : 22, P.shade(col, -0.55), { stroke: 'rgba(255,255,255,0.8)' }));
      // the goal's pay level on the tower, for reference (a tick on the side)
      // the stream from the tap while you earn
      if (s.phase === 'pour') { c.save(); c.strokeStyle = 'rgba(90,170,230,0.85)'; c.lineWidth = 8; c.beginPath(); c.moveTo(TWR.x - 7, 264); c.lineTo(TWR.x - 7, BASE - s.I * TK); c.stroke(); c.restore(); }
      SK.tag(c, 'Your pay', TWR.x - 52, 216, 18);
      // tax dripping into the bucket in the current floor's colour, take-home flowing to the jar
      for (const d of s.drips) { const q = (t - d.t) / 0.5, y = BASE - s.I * TK; c.fillStyle = BR[d.f][3]; c.beginPath(); c.arc(SK.lerp(TWR.x - TWR.w / 2, BUCK.x, q), SK.lerp(y, BASE - 40, q) - Math.sin(q * Math.PI) * 20, 4, 0, 7); c.fill();
        c.fillStyle = '#5ab0e8'; c.beginPath(); c.arc(SK.lerp(TWR.x + TWR.w / 2, JAR.x - 20, q), SK.lerp(y, BASE - th * JK - 10, q) - Math.sin(q * Math.PI) * 24, 4.5, 0, 7); c.fill(); }
      // the tax bucket
      c.save(); c.fillStyle = '#8a8a9a'; c.strokeStyle = '#3a3a4a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(BUCK.x - 26, BASE - 54); c.lineTo(BUCK.x + 26, BASE - 54); c.lineTo(BUCK.x + 20, BASE); c.lineTo(BUCK.x - 20, BASE); c.closePath(); c.fill(); c.stroke();
      const tl = Math.min(50, tax(s.I) * 1.6); c.fillStyle = BR[fi][3]; c.fillRect(BUCK.x - 20, BASE - tl, 40, tl); c.restore(); SK.tag(c, 'Tax', BUCK.x, BASE - 72, 18);
      // the take-home jar and its goal band
      const jt = BASE - 260; N6.jarBack(c, JAR.x, jt, BASE, JAR.w);
      c.save(); c.beginPath(); c.roundRect(JAR.x - JAR.w / 2 + 2, jt + 12, JAR.w - 4, BASE - jt - 14, [8, 8, 20, 20]); c.clip(); const wy = BASE - th * JK; N6.vgrad(c, JAR.x - 50, wy, 100, BASE - wy, ['#7ac8f0', '#3a8ac8']); c.restore();
      if (s.ghost) { const gy = BASE - s.ghost * JK; c.save(); c.globalAlpha = 0.45 + 0.2 * Math.sin(t * 6); c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.setLineDash([5, 4]); c.strokeRect(JAR.x - JAR.w / 2 + 6, gy, JAR.w - 12, BASE - gy - 4); c.restore(); SK.tag(c, 'Left behind', JAR.x, gy - 16, 18, '#fff6ea', 'rgba(190,40,40,0.9)'); }
      N6.jarFront(c, JAR.x, jt, BASE, JAR.w, '#5aa8e8');
      const ly = BASE - s.line * JK, uy = BASE - (s.line + s.L.band) * JK, inB = th >= s.line && th <= s.line + s.L.band;
      if (s.phase === 'ready' || s.phase === 'pour') { c.save(); c.fillStyle = inB ? 'rgba(90,220,120,0.6)' : 'rgba(90,208,120,0.35)'; c.fillRect(JAR.x - JAR.w / 2 - 6, uy, JAR.w + 12, ly - uy); c.strokeStyle = '#2a8a4a'; c.lineWidth = 3; c.strokeRect(JAR.x - JAR.w / 2 - 6, uy, JAR.w + 12, ly - uy); c.restore();
        SK.tag(c, s.names[s.gi], JAR.x, uy - 18, 18, '#fff6ea', 'rgba(40,140,70,0.92)'); }
      SK.tag(c, 'Take-home', JAR.x, jt - 16, 18);
      // goals reached so far
      s.done.forEach((n, i) => SK.tag(c, '✓ ' + n, 60 + i * 96, 132, 18, '#fff6ea', 'rgba(40,140,70,0.9)'));
      if (!s.done.length && !g.done) SK.tag(c, 'Goal ' + (s.gi + 1) + ' / ' + s.L.inc.length, 66, 132, 18);
      if (s.phase === 'pour') SK.tag(c, inB ? 'Let go now!' : 'Keep holding...', JAR.x - 10, ly + 26, 18, '#fff6ea', inB ? 'rgba(40,150,70,0.95)' : 'rgba(30,14,36,0.75)');
      if (s.phase === 'over') SK.tag(c, 'Overtime for nothing!', 200, 300, 20, '#fff6ea', 'rgba(190,40,40,0.9)');
      SK.animal(c, 'beaver', 44, 452, 1.0, { t, pose: won ? 'cheer' : lost ? 'sad' : s.phase === 'pour' ? 'walk' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
      // the hold button
      N6.button(c, BTN.x, BTN.y, BTN.w, BTN.h, s.held ? 'Earning...' : 'Hold to earn', s.held ? '#e8803a' : '#c8803a', s.held, { size: 20 });
      if (s.phase === 'ready' && !g.done) { SK.glow(c, g, BTN.x, BTN.y, 34, '#ffe27a', { level: 1 });
        let I = 0; while (I < TOP && take(I) < s.line + s.L.band / 2) I += 0.2; SK.demo(g, c, 'hold', [BTN.x + 10, BTN.y + 4], null, { period: (I / s.L.rate) / 0.65 }); }
    },
    auto(g, dt, synth) { const s = g.s; if (g.done) return; if (s.phase === 'ready' && g.t > 1.0) synth('down', BTN.x, BTN.y); else if (s.phase === 'pour' && take(s.I) >= s.line + s.L.band * 0.45) synth('up', BTN.x, BTN.y); },
  });
})();
