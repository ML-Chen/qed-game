// HALVE! (physics PHS-36) — a jar of curled-up hedgehogs, each one an unstable atom. Hold to let time run: each hedgehog
// uncurls (decays) at a random moment, but in every half-life (one turn of the clock ring) about half of those still
// curled uncurl. Let go when the jar is down to the marked fraction: a half, a quarter, an eighth. Hold too long and
// you overshoot, and the last few curled-up ones just snore on. Two or three jars, each with a new mark; level 2 has a
// shorter half-life and an eighth to hit.
(() => {
  const JAR = { cx: 150, l: 48, r: 252, t: 220, b: 540 }, BAR = { x: 300, t: 236, b: 528 }, N = 24, HR = 15;
  const LV = [{ fr: [[2, 4], [4, 2], [2, 8], [8, 2]], hl: 1.0 }, { fr: [[4, 2, 8], [2, 8, 4], [8, 4, 2], [2, 4, 8]], hl: 0.9 }, { fr: [[4, 8, 2], [8, 2, 4], [2, 8, 4], [8, 4, 8]], hl: 0.7 }];
  function slots() { const out = []; for (let r = 0; out.length < N; r++) { const n = r % 2 ? 4 : 5; for (let c = 0; c < n && out.length < N; c++) out.push([JAR.l + 30 + c * 36 + (r % 2 ? 18 : 0), JAR.b - 24 - r * 31]); } return out; }
  const SLOTS = slots();
  function paintShelf(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#1e2a50'); bg.addColorStop(1, '#3a3a6a'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    const rnd = P.rng(6); for (let i = 0; i < 40; i++) { o.fillStyle = `rgba(255,250,220,${0.15 + rnd() * 0.4})`; o.beginPath(); o.arc(rnd() * 360, rnd() * 640, 0.6 + rnd() * 1.2, 0, 7); o.fill(); }
    o.fillStyle = '#6a4a3a'; o.fillRect(0, 548, 360, 92); o.fillStyle = '#8a6a4a'; o.fillRect(0, 548, 360, 8);
    // the jar
    o.fillStyle = 'rgba(200,230,255,0.16)'; o.strokeStyle = 'rgba(220,240,255,0.7)'; o.lineWidth = 4; o.beginPath(); o.moveTo(JAR.l, JAR.t + 20); o.lineTo(JAR.l, JAR.b - 12); o.quadraticCurveTo(JAR.l, JAR.b, JAR.l + 12, JAR.b); o.lineTo(JAR.r - 12, JAR.b); o.quadraticCurveTo(JAR.r, JAR.b, JAR.r, JAR.b - 12); o.lineTo(JAR.r, JAR.t + 20); o.fill(); o.stroke();
    o.fillStyle = '#c84a3a'; o.beginPath(); o.roundRect(JAR.l - 6, JAR.t, JAR.r - JAR.l + 12, 22, 6); o.fill(); o.fillStyle = '#e86a5a'; o.fillRect(JAR.l - 2, JAR.t + 3, JAR.r - JAR.l + 4, 4);
    o.fillStyle = 'rgba(255,255,255,0.25)'; o.fillRect(JAR.l + 8, JAR.t + 34, 8, 220);
    // the count bar beside the jar
    o.fillStyle = '#121a30'; o.beginPath(); o.roundRect(BAR.x - 18, BAR.t - 8, 36, BAR.b - BAR.t + 16, 10); o.fill();
  }
  function curled(c, x, y, t, i) { // a brown spiky ball
    c.save(); c.translate(x, y); c.rotate(Math.sin(t * 2 + i) * 0.08); c.fillStyle = '#6a4a2a'; c.beginPath();
    for (let k = 0; k < 18; k++) { const a = k * Math.PI / 9, r = k % 2 ? HR : HR + 5; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill();
    SK.ball(c, 0, 0, HR - 3, '#9a7048', { lw: 1 }); c.fillStyle = '#f2d8b8'; c.beginPath(); c.arc(4, 4, 5, 0, 7); c.fill(); c.fillStyle = '#2a1a10'; c.beginPath(); c.arc(7, 4, 1.6, 0, 7); c.fill(); c.restore();
  }
  function flat(c, x, y, t) { // an uncurled, grey hedgehog lying stretched out
    c.save(); c.translate(x, y + 5); c.fillStyle = '#8a8a96'; c.beginPath(); for (let k = 0; k <= 10; k++) { const a = Math.PI + k * Math.PI / 10, r = k % 2 ? 10 : 14; c.lineTo(Math.cos(a) * r * 1.4, Math.sin(a) * r * 0.8); } c.closePath(); c.fill();
    c.fillStyle = '#c8c8d0'; c.beginPath(); c.ellipse(16, 1, 7, 5, 0, 0, 7); c.fill(); c.fillStyle = '#2a2a30'; c.beginPath(); c.arc(21, 0, 1.6, 0, 7); c.fill(); c.restore();
  }
  MG.add({
    id: 'atoms_halve', stage: 'atoms', cmd: 'DECAY THEM DOWN TO THE MARK!', time: 7, mood: 'night', winText: 'Half gone each time!', failText: 'Overshot!',
    card: { title: 'Half-life', kind: 'Physics', ref: 'Radioactive decay',
      text: 'An unstable atom decays at a random moment, and nobody can say when one particular atom will go. But in a big crowd of them, about half decay in a fixed time, called the half-life.\n\nAfter one half-life, half are left. After two, a quarter. After three, an eighth. The pile shrinks by halves, so it never quite reaches zero in a straight line. Scientists date old bones this way: they measure how much carbon-14 is left and count how many half-lives have passed.',
      note: 'In each half-life, about half of the unstable atoms still left decay.' },
    init(g) {
      const s = g.s, L = LV[Math.min(2, g.level)]; s.fr = L.fr[SK.variant(g, 4)]; s.hl = L.hl; s.round = 0; s.held = false; s.overT = 0; this.fill(g);
    },
    fill(g) { const s = g.s; s.tau = 0; s.ticks = []; s.born = g.t; s.okT = 0; s.hogs = SLOTS.map(([x, y], i) => ({ x, y, life: -s.hl * Math.log(1 - g.rand()) / Math.LN2, gone: 0 })); s.target = Math.round(N / s.fr[s.round]); },
    down(g) { const s = g.s; SK.holdStart(g); if (g.done || s.okT) return; s.held = true; g.sfx('click'); },
    up(g) {
      const s = g.s; SK.holdEnd(g); if (!s.held) return; s.held = false; if (g.done || s.okT) return;
      const left = s.hogs.filter(h => !h.gone).length, tol = Math.max(1, Math.round(s.target * 0.2));
      if (Math.abs(left - s.target) <= tol && left < N) { s.okT = g.t; g.sfx('ding'); g.burst(BAR.x, this.barY(left), ['#ffd45a', '#fff6ea'], 14, 140); }
      else if (left > s.target) g.sfx('wrong');
    },
    barY(n) { return SK.lerp(BAR.b, BAR.t, n / N); },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      if (s.held && !s.okT) { const k0 = Math.floor(s.tau / s.hl); s.tau += dt; if (Math.floor(s.tau / s.hl) > k0) { s.ticks.push(s.hogs.filter(h => !h.gone || h.gone === g.t).length); g.sfx('bell'); } for (const h of s.hogs) if (!h.gone && s.tau > h.life) { h.gone = g.t; g.sfx('pop'); } }
      const left = s.hogs.filter(h => !h.gone).length, tol = Math.max(1, Math.round(s.target * 0.2));
      if (!s.okT && left < s.target - tol) { s.overT = g.t; g.fail(); g.sfx('laugh'); }
      if (s.okT && g.t - s.okT > 0.8) { if (s.round + 1 >= s.fr.length) { g.win(); g.sfx('cheer'); } else { s.round++; this.fill(g); g.sfx('sweep'); } }
    },
    draw(g, c) {
      const s = g.s, t = g.t, left = s.hogs.filter(h => !h.gone).length;
      c.drawImage(g.bake('halve_shelf', paintShelf), 0, 0, 360, 640);
      // the hedgehogs: curled (unstable) or uncurled and grey (decayed); new jars drop in from above
      const dk = SK.easeOut(SK.clamp((t - s.born) / 0.4, 0, 1));
      for (const [i, h] of s.hogs.entries()) {
        const y = h.y - (1 - dk) * 40; c.globalAlpha = dk;
        if (!h.gone) { curled(c, h.x, y, t, i); c.globalAlpha = 1; continue; }
        // a decayed one uncurls, turns grey, climbs out over the rim and walks away
        const age = t - h.gone; if (age < 0.25) { curled(c, h.x, y - age * 30, t, i); c.globalAlpha = 1; continue; }
        const w = (age - 0.25) / 1.4; if (w >= 1) { c.globalAlpha = 1; continue; }
        const up = SK.clamp(w / 0.35, 0, 1), along = SK.clamp((w - 0.35) / 0.65, 0, 1), rimY = JAR.t - 2;
        const x = SK.lerp(h.x, -40, SK.easeInOut(along)), yy = SK.lerp(y, rimY, SK.easeOut(up)) - Math.abs(Math.sin(age * 14)) * 3;
        c.save(); c.filter = 'grayscale(1) brightness(1.15)'; SK.animal(c, 'hedgehog', x, yy, 0.55, { t: t + i, pose: 'walk', expr: 'happy', facing: -1 }); c.restore(); c.globalAlpha = 1;
      }
      // the curled ones left snore when you overshoot
      if (g.result === 'fail') for (const [i, h] of s.hogs.entries()) if (!h.gone) { const q = (t * 0.8 + i * 0.3) % 1; c.fillStyle = `rgba(255,255,255,${1 - q})`; c.font = '900 18px Nunito, system-ui, sans-serif'; c.fillText('z', h.x + 10 + q * 10, h.y - 14 - q * 20); }
      // the count bar and its mark
      const fy = this.barY(left); c.fillStyle = '#9a7048'; c.fillRect(BAR.x - 13, fy, 26, BAR.b - fy);
      for (const d of [2, 4, 8]) { const ny = this.barY(N / d), lit = left <= N / d; c.strokeStyle = lit ? '#9ad8ff' : 'rgba(255,255,255,0.3)'; c.lineWidth = 2; c.beginPath(); c.moveTo(BAR.x - 16, ny); c.lineTo(BAR.x + 16, ny); c.stroke(); }
      for (const k of s.ticks) { const ky = this.barY(k); c.fillStyle = '#9ad8ff'; c.beginPath(); c.moveTo(BAR.x - 30, ky - 6); c.lineTo(BAR.x - 19, ky); c.lineTo(BAR.x - 30, ky + 6); c.fill(); } // one arrow per half-life turn
      const tol = Math.max(1, Math.round(s.target * 0.2)), inBand = Math.abs(left - s.target) <= tol && left < N;
      c.fillStyle = inBand ? 'rgba(90,232,138,0.45)' : 'rgba(90,232,138,0.18)'; c.fillRect(BAR.x - 16, this.barY(s.target + tol + 0.5), 32, this.barY(s.target - tol - 0.5) - this.barY(s.target + tol + 0.5)); // the band to stop in
      const ty = this.barY(s.target); c.strokeStyle = inBand ? '#5ae88a' : '#ffd45a'; c.lineWidth = 4; c.beginPath(); c.moveTo(BAR.x - 22, ty); c.lineTo(BAR.x + 22, ty); c.stroke();
      SK.tag(c, '1/' + s.fr[s.round], BAR.x, ty - 24, 18);
      // the clock ring: one full turn per half-life
      const ang = (s.tau / s.hl) * Math.PI * 2, DY = JAR.t + 11; c.fillStyle = '#fff6ea'; c.beginPath(); c.arc(JAR.cx, DY, 24, 0, 7); c.fill(); c.strokeStyle = '#2a3a60'; c.lineWidth = 8; c.beginPath(); c.arc(JAR.cx, DY, 17, 0, 7); c.stroke();
      c.strokeStyle = s.held ? '#4ab0f0' : '#6a8ab0'; c.lineCap = 'round'; c.beginPath(); c.arc(JAR.cx, DY, 17, -Math.PI / 2, -Math.PI / 2 + (ang % (Math.PI * 2))); c.stroke();
      const turns = Math.floor(s.tau / s.hl); for (let i = 0; i < Math.min(4, turns); i++) { c.fillStyle = '#9ad8ff'; c.beginPath(); c.arc(JAR.cx + 34 + i * 12, DY - 24, 4, 0, 7); c.fill(); }
      // jars still to go
      for (let i = 0; i < s.fr.length; i++) { c.fillStyle = i < s.round || (i === s.round && s.okT) ? '#ffd45a' : 'rgba(255,255,255,0.3)'; c.beginPath(); c.arc(300 + (i - (s.fr.length - 1) / 2) * 20, 170, 6, 0, 7); c.fill(); }
      SK.tag(c, 'Unstable atoms', JAR.cx, JAR.b + 30, 18);
      const won = g.result === 'win', lost = g.result === 'fail';
      SK.animal(c, 'owl', 300, 614, 0.72, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : s.held ? 'think' : 'happy', facing: -1 });
      if (!s.held && !s.okT) SK.glow(c, g, JAR.cx, JAR.t + 11, 30, '#ffe27a', { level: 2 });
      if (!g.done && !s.okT) { if (s.held && inBand) SK.tag(c, 'Let go!', JAR.cx, JAR.t - 30 - Math.abs(Math.sin(t * 8)) * 4, 22, '#9affb0', 'rgba(20,90,50,0.9)'); else SK.tag(c, s.held ? 'Time running...' : 'Hold to run time', JAR.cx, JAR.t - 30, 18); }
      if (!g.done) SK.tag(c, 'Jar ' + Math.min(s.fr.length, s.round + 1) + ' / ' + s.fr.length, 300, 196, 18);
      SK.demo(g, c, 'hold', [JAR.cx, JAR.t + 14], null, { never: !!s.okT });
    },
    // the bot: hold until the jar is down to the mark, then let go
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 1 || s.okT) return; const left = s.hogs.filter(h => !h.gone).length;
      if (!s.held && left > s.target && g.t - (s.born || 0) > 0.5) synth('down', JAR.cx, 300);
      else if (s.held && left <= s.target) synth('up', JAR.cx, 300);
    },
  });
})();
