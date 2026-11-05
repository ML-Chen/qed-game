// FILL EACH JAR BEFORE WATER BOILS! (chemistry CB APC-10 DISTILL!) — a lab bench: a flask of alcohol and water over a
// burner, a cold tube running down to a jar, and a big thermometer. Hold to heat. The mixture warms up, then starts to
// boil below 100 °C and the temperature stalls there (the heat goes into boiling): vapour that is mostly alcohol climbs
// into the cold tube, turns back into liquid and drips into the jar. As the alcohol runs low, the temperature creeps up
// toward 100 °C. Let go once the jar reaches its line: keep heating to 100 °C and the water boils too, froths over and
// clouds the jar. Each new flask is a new batch. Two jars at level 0, three at level 1; at level 2 the burner is
// fiercer, so the alcohol runs out sooner and the gap between a full jar and boiling water is shorter.
(() => {
  const FL = { x: 120, y: 420, r: 52 }, JAR = { x: 262, y: 428, w: 70, h: 104 }, TH = { x: 34, t: 168, b: 470 }, BTN = { x: 186, y: 586, w: 236, h: 48 };
  const LINE = 0.8, T0 = 24, LV = [{ n: 2, k: 1.3, up: 40 }, { n: 3, k: 1.4, up: 42 }, { n: 3, k: 2.0, up: 48 }];
  const tY = T => TH.b - (T - 20) / 90 * (TH.b - TH.t);
  const bpOf = A => 100 - 22 * Math.pow(SK.clamp(A / 0.25, 0, 1), 0.5); // the mixture boils hotter as its alcohol runs out
  function stepHeat(q, L, on, dt) { // q: { T, A, got } — temperature, alcohol left in the flask (1 = full), collected in the jar
    const bp = bpOf(q.A);
    if (on) { if (q.T < bp) q.T = Math.min(bp, q.T + L.up * dt); else { q.T = bp; const d = Math.min(q.A, (L.k * q.A + 0.06) * dt); q.A -= d; q.got += d / 0.75; } }
    else q.T = Math.max(T0, q.T - 9 * dt);
    return bp;
  }
  function holdNeed(s) { // how long holding from now takes to fill the jar just past its line (for the hand and the bot)
    const q = { T: s.T, A: s.A, got: s.got }; let t = 0; while (q.got < LINE + 0.07 && t < 12) { stepHeat(q, s.L, true, 1 / 60); t += 1 / 60; if (q.T >= 99.5) break; } return t;
  }
  function paintLab(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#2a3a5a'); bg.addColorStop(1, '#4a4a6a'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    o.fillStyle = 'rgba(255,255,255,0.05)'; for (let x = 0; x < 360; x += 40) o.fillRect(x, 0, 2, 540); // tiled wall
    for (let y = 0; y < 540; y += 40) o.fillRect(0, y, 360, 2);
    // shelf with bottles
    o.fillStyle = '#6a4a3a'; o.fillRect(190, 196, 160, 8); for (const [x, h, col] of [[206, 34, '#8ad0a0'], [236, 46, '#e8a0c0'], [270, 28, '#a0b8f0'], [306, 40, '#f0d080']]) { o.fillStyle = col; o.beginPath(); o.roundRect(x - 9, 196 - h, 18, h, 4); o.fill(); o.fillRect(x - 3, 196 - h - 8, 6, 9); }
    // the bench
    o.fillStyle = '#3a2a24'; o.fillRect(0, 540, 360, 100); o.fillStyle = '#6a4a3a'; o.fillRect(0, 534, 360, 10);
    // the burner and its stand
    o.fillStyle = '#5a5a6a'; o.fillRect(FL.x - 14, 506, 28, 30); o.fillRect(FL.x - 30, 528, 60, 8); o.strokeStyle = '#8a8a9a'; o.lineWidth = 3; o.beginPath(); o.moveTo(FL.x - 56, 534); o.lineTo(FL.x - 46, 474); o.lineTo(FL.x + 46, 474); o.lineTo(FL.x + 56, 534); o.stroke();
    // the cold tube (condenser): an outer water jacket around the inner tube
    o.save(); o.lineCap = 'round'; o.strokeStyle = 'rgba(140,200,255,0.35)'; o.lineWidth = 22; o.beginPath(); o.moveTo(178, 304); o.lineTo(270, 398); o.stroke();
    o.strokeStyle = 'rgba(230,245,255,0.7)'; o.lineWidth = 7; o.beginPath(); o.moveTo(FL.x, 306); o.lineTo(160, 286); o.lineTo(290, 418); o.stroke(); o.restore();
    o.fillStyle = 'rgba(200,230,255,0.9)'; o.font = '900 13px Nunito, system-ui, sans-serif';
    // the thermometer's scale
    o.fillStyle = '#e8eef8'; o.beginPath(); o.roundRect(TH.x - 9, TH.t - 8, 18, TH.b - TH.t + 16, 9); o.fill(); o.beginPath(); o.arc(TH.x, TH.b + 14, 14, 0, 7); o.fill();
    o.strokeStyle = 'rgba(40,30,60,0.5)'; o.lineWidth = 1.5; for (let T = 20; T <= 110; T += 10) { o.beginPath(); o.moveTo(TH.x + 9, tY(T)); o.lineTo(TH.x + 15, tY(T)); o.stroke(); }
  }
  function newBatch(s) { s.A = 1; s.got = 0; s.T = Math.max(T0, Math.min(s.T || T0, 60)); s.phase = 'run'; s.boilT = 0; s.drips = []; s.bubbles = []; s.jarDone = 0; }
  MG.add({
    id: 'matter_distill', stage: 'matter', cmd: 'FILL EACH JAR BEFORE WATER BOILS!', time: 8, mood: 'sea', winText: 'Alcohol, no water!', failText: 'Water boiled over!',
    card: { title: 'Boil off the lighter liquid', kind: 'Chemistry', ref: 'Distillation',
      text: 'Alcohol boils at 78 °C and water at 100 °C. Heat a mixture of the two and it starts to boil below 100 °C, giving off vapour that is mostly alcohol. While it boils, the temperature hardly rises, because the heat goes into making vapour.\n\nThe vapour climbs into a cold tube, turns back into liquid and drips into a jar. When the alcohol is nearly gone, the temperature climbs. Stop before 100 °C, or the water boils too and ends up in the jar.\n\nThis is called distillation. Oil refineries, perfume makers and labs use it to separate liquids.',
      note: 'When liquids boil at different temperatures, heating boils off the lower one first, and it can be cooled and collected.' },
    init(g) { const s = g.s, L = LV[Math.min(2, g.level)], v = SK.variant(g, 4); s.L = L; s.n = L.n; s.done = 0; s.T = [24, 30, 36, 28][v]; s.tint = ['#e8c0f0', '#c0e0f8', '#f0e0b0', '#d0f0c8'][v]; s.on = false; newBatch(s); s.T = [24, 30, 36, 28][v]; s.need = holdNeed(s); s.needT = 0; },
    down(g) { const s = g.s; SK.touched(g); if (g.done || s.phase !== 'run') return; SK.holdStart(g); s.on = true; g.sfx('fire', { vol: 0.4 }); },
    up(g) { const s = g.s; if (!s.on) return; SK.holdEnd(g); s.on = false; if (!g.done && s.phase === 'run' && s.got >= LINE) { s.phase = 'next'; s.jarDone = g.t; s.done++; g.sfx('chime'); if (s.done >= s.n) { g.win(); g.sfx('cheer'); } } },
    update(g, dt) {
      const s = g.s, L = s.L; if (s.phase === 'boiled') { s.T = Math.min(102, s.T + dt); return; }
      const on = s.on && s.phase === 'run' && !g.done, before = s.got, bp = stepHeat(s, L, on, dt);
      if (on && s.T >= bp - 0.01 && s.A > 0) { if (g.rand() < dt * 16) s.bubbles.push({ x: FL.x + (g.rand() - 0.5) * 60, y: FL.y + 30, t: g.t }); if (s.got - before > 0 && g.rand() < dt * 6) { s.drips.push({ t: g.t }); g.sfx('drip', { vol: 0.35, pitch: 1 + g.rand() * 0.3 }); } }
      s.bubbles = s.bubbles.filter(b => g.t - b.t < 0.6); s.drips = s.drips.filter(d => g.t - d.t < 0.5);
      // keep heating past the moment the alcohol is gone and the water itself boils
      if (on && s.T >= 99.5 && !g.done) { s.phase = 'boiled'; s.boilT = g.t; g.fail(); g.sfx('splash'); g.sfx('laugh'); g.shake(4, 0.3); }
      if (s.phase === 'next' && g.t - s.jarDone > 0.8 && !g.done) { newBatch(s); g.sfx('pop'); }
      if (g.t - s.needT > 0.2 && s.phase === 'run') { s.needT = g.t; s.need = holdNeed(s); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', boiled = s.phase === 'boiled';
      c.drawImage(g.bake('distill_bg', paintLab), 0, 0, 360, 640);
      // the flame
      if (s.on && !g.done) { const f = 0.8 + 0.2 * Math.sin(t * 30); c.fillStyle = '#5ab8ff'; c.beginPath(); c.moveTo(FL.x - 12, 506); c.quadraticCurveTo(FL.x, 506 - 40 * f, FL.x + 12, 506); c.fill(); c.fillStyle = '#e8f4ff'; c.beginPath(); c.moveTo(FL.x - 5, 506); c.quadraticCurveTo(FL.x, 506 - 20 * f, FL.x + 5, 506); c.fill(); }
      // the flask: glass, the mixture inside (its level drops as alcohol boils off), bubbles
      const lvl = FL.y + 10 - 30 * (0.55 + 0.45 * s.A);
      c.save(); c.beginPath(); c.arc(FL.x, FL.y, FL.r, 0, 7); c.clip(); c.fillStyle = boiled ? '#e8eef4' : P.mix('#9ad0f0', s.tint, s.A); c.fillRect(FL.x - FL.r, lvl + (boiled ? -20 + Math.sin(t * 20) * 4 : 0), FL.r * 2, FL.r * 2);
      for (const b of s.bubbles) { const k = (t - b.t) / 0.6; c.strokeStyle = `rgba(255,255,255,${0.8 * (1 - k)})`; c.lineWidth = 1.5; c.beginPath(); c.arc(b.x, b.y - k * 40, 3 + k * 2, 0, 7); c.stroke(); } c.restore();
      c.strokeStyle = 'rgba(230,245,255,0.85)'; c.lineWidth = 3; c.beginPath(); c.arc(FL.x, FL.y, FL.r, -Math.PI / 2 + 0.25, Math.PI * 1.5 - 0.25); c.stroke(); c.beginPath(); c.moveTo(FL.x - 12, FL.y - FL.r + 2); c.lineTo(FL.x - 10, 300); c.moveTo(FL.x + 12, FL.y - FL.r + 2); c.lineTo(FL.x + 10, 300); c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(FL.x - 22, FL.y - 20, 8, 14, 0.5, 0, 7); c.fill();
      // vapour rising up the neck and through the cold tube while it boils
      if ((s.on && s.T >= bpOf(s.A) - 0.01 && s.A > 0) || boiled) { c.save(); c.strokeStyle = boiled ? 'rgba(255,255,255,0.75)' : P.rgba(s.tint, 0.8); c.lineWidth = 4; c.setLineDash([6, 10]); c.lineDashOffset = -t * 80; c.beginPath(); c.moveTo(FL.x, FL.y - 30); c.lineTo(FL.x, 306); c.lineTo(160, 286); c.lineTo(290, 418); c.stroke(); c.restore(); }
      for (const d of s.drips) { const k = (t - d.t) / 0.5; c.fillStyle = P.rgba(s.tint, 0.95); c.beginPath(); c.ellipse(292, 420 + k * (JAR.y + JAR.h - 10 - 420 - s.got * 80), 3, 4, 0, 0, 7); c.fill(); }
      // the jar with its line
      const fillH = SK.clamp(s.got, 0, 1.1) * (JAR.h - 14) * 0.9;
      c.fillStyle = boiled ? 'rgba(210,215,220,0.9)' : P.rgba(s.tint, 0.9); c.fillRect(JAR.x + 4, JAR.y + JAR.h - 4 - fillH - (boiled ? SK.clamp((t - s.boilT) * 60, 0, 30) : 0), JAR.w - 8, fillH + (boiled ? SK.clamp((t - s.boilT) * 60, 0, 30) : 0));
      c.strokeStyle = 'rgba(230,245,255,0.85)'; c.lineWidth = 3; c.beginPath(); c.roundRect(JAR.x, JAR.y, JAR.w, JAR.h, 8); c.stroke();
      const ly = JAR.y + JAR.h - 4 - LINE * (JAR.h - 14) * 0.9; c.save(); c.strokeStyle = s.got >= LINE ? '#8affb0' : '#ffd45a'; c.lineWidth = 3; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(JAR.x - 6, ly); c.lineTo(JAR.x + JAR.w + 6, ly); c.stroke(); c.restore();
      SK.tag(c, 'Jar', JAR.x + JAR.w / 2, JAR.y + JAR.h + 22, 18);
      if (!won) SK.tag(c, 'Jar ' + Math.min(s.done + 1, s.n) + ' / ' + s.n, 296, 236, 18);
      // the thermometer
      const ty = tY(Math.min(110, s.T)); c.fillStyle = '#e8403a'; c.beginPath(); c.roundRect(TH.x - 4, ty, 8, TH.b - ty + 6, 4); c.fill(); c.beginPath(); c.arc(TH.x, TH.b + 14, 10, 0, 7); c.fill();
      for (const [T, label, bg] of [[78, 'Alcohol boils 78°', 'rgba(110,60,150,0.88)'], [100, 'Water boils 100°', 'rgba(30,90,170,0.9)']]) { c.fillStyle = '#fff6ea'; c.fillRect(TH.x - 12, tY(T) - 1.5, 30, 3); SK.tag(c, label, TH.x + 96, tY(T), 18, '#fff6ea', bg); }
      SK.tag(c, 'Alcohol + water', FL.x + 34, 524, 18);
      // the hold button and what to do now
      if (!g.done && s.phase === 'run') { const pr = s.on ? 1 : 0; c.fillStyle = '#7a3a1a'; c.beginPath(); c.roundRect(BTN.x - BTN.w / 2, BTN.y - BTN.h / 2 + 4, BTN.w, BTN.h, 18); c.fill(); c.fillStyle = '#e8803a'; c.beginPath(); c.roundRect(BTN.x - BTN.w / 2, BTN.y - BTN.h / 2 + pr * 4, BTN.w, BTN.h, 18); c.fill(); c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.stroke();
        c.save(); c.font = '900 20px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff6ea'; c.fillText(pr ? 'Heating...' : 'Hold to heat', BTN.x, BTN.y + 1 + pr * 4); c.restore();
        if (s.on) SK.tag(c, s.got < LINE ? 'Keep heating...' : 'Let go now!', 262, 296, 19, '#fff6ea', s.got < LINE ? 'rgba(30,14,36,0.8)' : 'rgba(40,150,70,0.95)'); }
      SK.animal(c, 'beaver', 318, 616, 0.55, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : s.T > 92 ? 'wow' : 'think', facing: -1 });
      // guidance: hold for just as long as this batch needs to fill the jar past its line
      if (!g.done && s.phase === 'run' && !s.on) { SK.glow(c, g, BTN.x, BTN.y, 46, undefined, { level: 2 }); SK.demo(g, c, 'hold', [BTN.x + 30, BTN.y + 6], null, { period: Math.max(1.0, s.need / 0.65) }); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 1.0) return; const B = s._bot = s._bot || {};
      if (s.on) { if (s.got >= LINE + 0.05) { synth('up', BTN.x, BTN.y); B.last = g.t; } return; }
      if (s.phase === 'run' && g.t - (B.last ?? 0) > 0.2) synth('down', BTN.x, BTN.y);
    },
  });
})();
