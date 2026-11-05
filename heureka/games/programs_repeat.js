// REPEAT! (cs EL-04) — a bird on the first of a row of tree stumps in a pond; its nest sits a few stumps away. The
// program is one "hop" card wrapped in a repeat ribbon (and the same thing in real Python above: for _ in range(N):
// hop()). Tap the ribbon to add dots, one dot per repeat, then tap Go: each time round the loop one dot lights and the
// bird hops one stump. The right number of dots lands it in the nest. Too few and it stops short, flapping on a stump;
// too many and it sails past the nest into the bush. Two nests at levels 0 and 1, each at a new distance; a dotted
// preview shows where the dots will land it (level 1: only for the first nest). Level 2: three nests, no preview, and the loop body is two hops.
(() => {
  const SX = 40, DX = 46, NP = 7, GY = 372, CARD = { x: 30, y: 456, w: 196, h: 66 }, STRIP = { y: 548 }, GO = { x: 296, y: 490 }, MAXD = 7;
  const PLANS = [[[3, 2], [2, 4], [4, 3], [3, 4]], [[3, 4], [4, 3], [2, 5], [5, 2]], [[4, 6, 2], [6, 2, 4], [2, 6, 4], [6, 4, 2]]];
  const postX = i => SX + i * DX, postY = (s, i) => GY - (i % 2) * 6;
  function paintPond(o) {
    const sk = o.createLinearGradient(0, 0, 0, 340); sk.addColorStop(0, '#9adcc8'); sk.addColorStop(0.6, '#d8f4d8'); sk.addColorStop(1, '#fff6d8'); o.fillStyle = sk; o.fillRect(0, 0, 360, 640);
    P.cloud(o, 300, 240, 0.55); P.cloud(o, 70, 262, 0.4);
    P.hills(o, 360, 330, 50, '#9ad08a', '#6aa860', { seed: 3 });
    const w = o.createLinearGradient(0, 326, 0, 430); w.addColorStop(0, '#5ab8c8'); w.addColorStop(1, '#2a7a98'); o.fillStyle = w; o.fillRect(0, 328, 360, 104);
    o.strokeStyle = 'rgba(255,255,255,0.45)'; o.lineWidth = 2; const r = P.rng(5); for (let i = 0; i < 16; i++) { const x = r() * 340, y = 340 + r() * 76; o.beginPath(); o.moveTo(x, y); o.lineTo(x + 14 + r() * 14, y); o.stroke(); }
    // the grassy bank below, where the program lies
    const gb = o.createLinearGradient(0, 416, 0, 640); gb.addColorStop(0, '#8ac860'); gb.addColorStop(1, '#5a9a40'); o.fillStyle = gb; o.beginPath(); o.moveTo(0, 426); o.quadraticCurveTo(180, 414, 360, 426); o.lineTo(360, 640); o.lineTo(0, 640); o.closePath(); o.fill();
    P.grassTufts(o, 360, 590, 612, 20, '#3a7a28', 7);
    // the bush on the far bank
    for (let i = 0; i < 6; i++) { const x = 340 + (i % 3) * 12 - 8, y = 344 - Math.floor(i / 3) * 18, rr = 22 - Math.floor(i / 3) * 4; const hg = o.createRadialGradient(x - 6, y - 8, 2, x, y, rr); hg.addColorStop(0, '#6ab858'); hg.addColorStop(1, '#2a6a28'); o.fillStyle = hg; o.beginPath(); o.arc(x, y, rr, 0, 7); o.fill(); }
    o.fillStyle = '#ff7aa0'; for (const [x, y] of [[330, 332], [346, 320], [338, 348]]) { o.beginPath(); o.arc(x, y, 3, 0, 7); o.fill(); }
  }
  function stump(c, x, y) {
    c.fillStyle = 'rgba(20,60,80,0.35)'; c.beginPath(); c.ellipse(x, GY + 44, 20, 5, 0, 0, 7); c.fill();
    const g2 = c.createLinearGradient(x - 16, 0, x + 16, 0); g2.addColorStop(0, '#7a4a28'); g2.addColorStop(0.5, '#a86a3a'); g2.addColorStop(1, '#6a3a20'); c.fillStyle = g2; c.fillRect(x - 16, y, 32, GY + 44 - y);
    c.fillStyle = '#d8a870'; c.beginPath(); c.ellipse(x, y, 16, 6, 0, 0, 7); c.fill(); c.strokeStyle = '#8a5a30'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y, 10, 3.6, 0, 0, 7); c.stroke();
  }
  function nest(c, x, y, glow, t) {
    if (glow) { c.save(); c.strokeStyle = `rgba(120,255,150,${0.6 + 0.4 * Math.sin(t * 6)})`; c.lineWidth = 4; c.beginPath(); c.ellipse(x, y - 4, 30, 14, 0, 0, 7); c.stroke(); c.restore(); }
    c.fillStyle = '#8a5a2a'; c.beginPath(); c.ellipse(x, y - 4, 24, 10, 0, 0, 7); c.fill(); c.fillStyle = '#5a3418'; c.beginPath(); c.ellipse(x, y - 8, 16, 5, 0, 0, 7); c.fill();
    c.strokeStyle = '#b8884a'; c.lineWidth = 1.5; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(x + i * 6 - 6, y - 10); c.lineTo(x + i * 6 + 6, y + 2); c.stroke(); }
  }
  // the program card: hop arrows inside a red repeat ribbon that loops back round
  function ribbonCard(c, g, s) {
    const { x, y, w, h } = CARD, n = s.L === 2 ? 2 : 1;
    c.save(); c.strokeStyle = '#d83a4a'; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + w - 10, y + h + 10); c.lineTo(x + 10, y + h + 10); c.arc(x + 10, y + h / 2 + 5, h / 2 + 5, Math.PI / 2, -Math.PI / 2); c.lineTo(x + w - 20, y); c.stroke();
    c.fillStyle = '#d83a4a'; c.beginPath(); c.moveTo(x + w - 6, y); c.lineTo(x + w - 24, y - 12); c.lineTo(x + w - 24, y + 12); c.closePath(); c.fill(); c.restore();
    c.fillStyle = 'rgba(30,14,36,0.25)'; c.beginPath(); c.roundRect(x + 12, y + 10, w - 24, h - 14, 10); c.fill();
    c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(x + 10, y + 6, w - 24, h - 14, 10); c.fill(); c.stroke();
    for (let i = 0; i < n; i++) { const cx = x + 10 + (w - 24) * (n === 1 ? 0.5 : 0.28 + i * 0.44), cy = y + 6 + (h - 14) / 2, lit = s.ph === 'run' && s.sub === i && s.step === 'hop';
      c.fillStyle = lit ? '#ffd45a' : '#5aa8e8'; c.beginPath(); c.moveTo(cx - 26, cy - 7); c.lineTo(cx + 6, cy - 7); c.lineTo(cx + 6, cy - 16); c.lineTo(cx + 26, cy); c.lineTo(cx + 6, cy + 16); c.lineTo(cx + 6, cy + 7); c.lineTo(cx - 26, cy + 7); c.closePath(); c.fill(); c.strokeStyle = '#1a4a7a'; c.lineWidth = 2; c.stroke(); }
    // the dots: one per repeat, on the ribbon's tail
    const n0 = Math.max(s.dots, 1); for (let i = 0; i < MAXD; i++) { const dx = x + 22 + i * 25, dy = STRIP.y, on = i < s.dots;
      c.beginPath(); c.arc(dx, dy, 9, 0, 7); c.fillStyle = on ? (s.ph === 'run' && i <= s.k ? '#ffe27a' : '#fff6ea') : 'rgba(255,255,255,0.18)'; c.fill(); c.strokeStyle = on ? '#8a1a2a' : 'rgba(255,255,255,0.5)'; c.lineWidth = 2; c.stroke(); }
    return n0;
  }
  function newRound(g) { const s = g.s; s.d = s.plan[s.r]; s.dots = 0; s.pos = 0; s.ph = 'set'; s.k = -1; s.sub = 0; s.step = ''; s.hop = null; s.endT = 0; s.res = ''; s.born = g.t; }
  MG.add({
    id: 'repeat', stage: 'programs', cmd: 'HOP THE BIRD INTO ITS NEST!', time: 11, mood: 'bright', winText: 'Home!', failText: 'Wrong count!',
    card: { title: 'Loops repeat steps', kind: 'Computer science', ref: 'Loops (for, repeat)',
      text: 'Instead of writing hop() five times, a program can say "repeat this five times". That is a loop.\n\nIn Python it looks like for _ in range(5): with the steps to repeat written underneath. Each time round the loop, the computer runs those steps once more, then counts one repeat done.\n\nThe computer never guesses. Ask for too few repeats and the job stops early. Ask for too many and it keeps going past where you meant to stop.',
      note: 'A loop runs the same steps again and again, exactly as many times as you tell it.' },
    init(g) {
      const s = g.s; s.L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.plan = PLANS[s.L][s.v]; s.r = 0; s.flash = null; newRound(g);
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || s.ph !== 'set') return;
      if (x > CARD.x - 30 && x < CARD.x + CARD.w + 8 && y > CARD.y - 14 && y < CARD.y + CARD.h + 14) { if (s.dots < MAXD) { s.dots++; g.sfx('pop', { pitch: 0.9 + s.dots * 0.08 }); } else g.sfx('wrong'); return; }
      if (y > STRIP.y - 18 && y < STRIP.y + 18 && x > CARD.x && x < CARD.x + 20 + MAXD * 25) { if (s.dots > 0) { s.dots--; g.sfx('click'); } return; }
      if (SK.dist(x, y, GO.x, GO.y) < 52) { s.ph = 'run'; s.k = -1; s.next = g.t + 0.15; s.goT = g.t; g.sfx('click'); g.sfx('sweep', { vol: 0.4 }); }
    },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      if (s.ph === 'set' || s.ph === 'gap') { if (s.ph === 'gap' && g.t >= s.next) newRound(g); return; }
      g.held += dt; // the fuse stands still while the loop runs by itself
      const body = s.L === 2 ? 2 : 1;
      if (s.ph === 'run') {
        if (s.hop) { if (g.t - s.hop.t >= 0.4) { s.pos = s.hop.to; s.hop = null; g.sfx('tap', { pitch: 1.2 }); if (s.pos > NP - 1) { s.ph = 'end'; s.endT = g.t; s.res = 'over'; } } else return; }
        if (g.t < s.next || s.ph !== 'run') return;
        if (s.step === 'for' || (s.step === 'hop' && s.sub < body - 1)) { s.sub = s.step === 'for' ? 0 : s.sub + 1; s.step = 'hop'; s.hop = { t: g.t, from: s.pos, to: s.pos + 1 }; g.sfx('whoosh', { vol: 0.4 }); return; }
        // back to the for line: another repeat if there are dots left
        if (s.k + 1 < s.dots) { s.k++; s.step = 'for'; s.sub = -1; s.next = g.t + 0.16; g.sfx('ding', { pitch: 1 + s.k * 0.06, vol: 0.5 }); return; }
        s.ph = 'end'; s.endT = g.t; s.res = s.pos === s.d ? 'nest' : s.pos < s.d ? 'short' : 'over';
        if (s.res === 'nest') { g.sfx('chime'); g.sfx('tweet'); g.burst(postX(s.d), GY - 40, ['#ffd45a', '#fff6ea', '#7ee8a0'], 18, 150); } else if (s.res === 'short') { g.sfx('tweet'); } else g.sfx('whoosh');
        return;
      }
      if (s.ph === 'end') {
        const k = g.t - s.endT;
        if (s.res === 'nest' && k > 0.45) { s.r++; if (s.r >= s.plan.length) { g.win(); g.sfx('cheer'); } else { s.ph = 'gap'; s.next = g.t + 0.1; } }
        else if (s.res === 'over' && k > 0.2 && !s.bush) { s.bush = 1; g.sfx('rustle'); g.burst(340, 336, ['#6ab858', '#2a6a28', '#ff7aa0'], 16, 160); }
        if (s.res !== 'nest' && k > 0.85) { g.fail(); g.sfx('laugh'); }
      }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('repeat_pond', paintPond), 0, 0, 360, 640);
      // the code, with the number of repeats you set
      const lines = ['for _ in range(' + s.dots + '):', '    hop()'].concat(s.L === 2 ? ['    hop()'] : []);
      const cur = s.ph === 'run' ? (s.step === 'for' ? 0 : 1 + Math.max(0, s.sub)) : -1;
      N5.panel(c, g, { x: 20, y: 132, w: 250, lines, cur, size: 20 });
      SK.tag(c, 'Nest ' + Math.min(s.r + 1, s.plan.length) + ' / ' + s.plan.length, 314, 236, 18);
      for (let i = 0; i < NP; i++) stump(c, postX(i), postY(s, i));
      nest(c, postX(s.d), postY(s, s.d), false, t);
      // the preview: where these dots will land the bird (levels 0 and 1)
      if (s.ph === 'set' && (s.L === 0 || (s.L === 1 && s.r === 0)) && s.dots > 0 && !g.done) { const land = Math.min(s.dots, NP); c.save(); c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 2.5; c.setLineDash([4, 6]);
        for (let i = 0; i < land; i++) { const x0 = postX(i), x1 = postX(i + 1); c.beginPath(); c.moveTo(x0, postY(s, i) - 14); c.quadraticCurveTo((x0 + x1) / 2, GY - 64, x1, (i + 1 < NP ? postY(s, i + 1) : GY) - 14); c.stroke(); } c.restore();
        if (land === s.d) nest(c, postX(s.d), postY(s, s.d), true, t); else { c.save(); c.globalAlpha = 0.55; SK.animal(c, 'bird', land < NP ? postX(land) : 352, (land < NP ? postY(s, land) : GY) - 4, 0.75, { t, facing: 1, noShadow: true }); c.restore(); } }
      // the bird
      let bx = postX(Math.min(s.pos, NP)), by = postY(s, Math.min(s.pos, NP - 1)) - 4, pose = 'idle', expr = 'happy';
      if (s.hop) { const k = SK.clamp((t - s.hop.t) / 0.4, 0, 1), x0 = postX(s.hop.from), x1 = postX(s.hop.to); bx = SK.lerp(x0, x1, k); by = SK.lerp(postY(s, s.hop.from), postY(s, Math.min(s.hop.to, NP - 1)), k) - 4 - Math.sin(k * Math.PI) * 46; pose = 'cheer'; }
      if (s.ph === 'end') { const k = t - s.endT;
        if (s.res === 'short') { pose = 'cheer'; expr = 'wow'; by -= 10 + Math.abs(Math.sin(k * 14)) * 10; }
        if (s.res === 'over') { const q = SK.clamp(k / 0.3, 0, 1); bx = SK.lerp(bx, 340, q); by = SK.lerp(by, 338, q) - Math.sin(q * Math.PI) * 30; expr = 'wow'; pose = 'cheer'; }
        if (s.res === 'nest') { pose = 'cheer'; expr = 'laugh'; by -= 4; } }
      if (won) { pose = 'cheer'; expr = 'laugh'; }
      if (!(s.res === 'over' && s.ph === 'end' && t - s.endT > 0.3)) SK.animal(c, 'bird', bx, by, 0.9, { t, pose, expr, facing: 1, noShadow: true });
      else { SK.tag(c, 'Too far!', 300, 288, 18); }
      if (s.res === 'short' && s.ph === 'end') SK.tag(c, 'Short!', bx, by - 62, 18);
      SK.tag(c, 'Nest', postX(s.d), GY + 62, 18);
      // the turtle in the pond, watching
      SK.animal(c, 'turtle', 300, 612, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: 1 });
      // the program: the ribbon card and the Go button
      ribbonCard(c, g, s);
      N5.button(c, GO.x, GO.y, 96, 60, 'Go!', s.ph === 'set' ? '#3ab86a' : '#7a9a8a', s.ph === 'run' ? 1 : 0, 26);
      // guidance: tap the ribbon to add dots until they match the stumps to the nest, then Go
      if (s.ph === 'set' && !g.done && g.t - s.born > 0.1) {
        const need = s.d / (s.L === 2 ? 2 : 1);
        if (s.dots < need) { SK.glow(c, g, CARD.x + CARD.w / 2 - 6, CARD.y + 30, 50); SK.demo(g, c, 'tap', [CARD.x + CARD.w / 2, CARD.y + 34], null, { period: 0.9 }); }
        else if (s.dots > need) { SK.glow(c, g, CARD.x + 22 + (s.dots - 1) * 25, STRIP.y, 16); SK.demo(g, c, 'tap', [CARD.x + 22 + (s.dots - 1) * 25, STRIP.y], null, { period: 0.9 }); }
        else { SK.glow(c, g, GO.x, GO.y + 2, 48); SK.demo(g, c, 'tap', [GO.x, GO.y + 4], null); }
      }
    },
    // the bot: taps the ribbon once per stump (per two stumps at level 2), then Go
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.ph !== 'set' || g.t - s.born < 0.5) return; const need = s.d / (s.L === 2 ? 2 : 1) + (typeof window !== 'undefined' && window.N5FAIL ? window.N5FAIL : 0);
      s.bt = s.bt || 0; if (g.t < s.bt) return; s.bt = g.t + 0.28;
      if (s.dots < need) { synth('down', CARD.x + 100, CARD.y + 34); synth('up', CARD.x + 100, CARD.y + 34); }
      else { synth('down', GO.x, GO.y); synth('up', GO.x, GO.y); }
    },
  });
})();
