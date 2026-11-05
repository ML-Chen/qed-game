// SWING! (physics PHS-01) — a frog on a frozen pond whirls a snowball on a string. The string's pull (a red arrow) points
// to the centre and keeps bending the ball's path into a circle. Tap to let go: the ball flies off in a straight line
// along the edge of the circle (the tangent), not straight outward. Hit the target board. Let go when the ball points at
// the board and it flies off sideways and knocks the snowman's hat off.
// Level 2: the frog spins faster and faster; the pull arrow grows until the string snaps by itself.
(() => {
  const C = { x: 180, y: 392 }, R = 84, BR = 13, TD = 236, TR = 38;
  function paintPond(o) {
    // snowy banks with pines along the top, a frozen pond seen from above
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#f6eefa'); bg.addColorStop(1, '#e4def4'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    const rnd = P.rng(23);
    o.fillStyle = 'rgba(170,160,210,0.35)'; for (let i = 0; i < 26; i++) { o.beginPath(); o.ellipse(rnd() * 360, rnd() * 640, 20 + rnd() * 40, 6 + rnd() * 8, 0, 0, 7); o.fill(); }
    const ice = o.createRadialGradient(180, 380, 40, 180, 380, 300); ice.addColorStop(0, '#d8f2fb'); ice.addColorStop(0.7, '#a9d8ef'); ice.addColorStop(1, '#8cc4e6');
    o.fillStyle = '#fbf8ff'; o.beginPath(); o.ellipse(180, 386, 184, 262, 0, 0, 7); o.fill();
    o.fillStyle = ice; o.beginPath(); o.ellipse(180, 386, 172, 250, 0, 0, 7); o.fill();
    o.save(); o.beginPath(); o.ellipse(180, 386, 172, 250, 0, 0, 7); o.clip();
    o.strokeStyle = 'rgba(255,255,255,0.65)'; o.lineWidth = 1.3; // cracks and skate marks
    for (let i = 0; i < 34; i++) { const x = 30 + rnd() * 300, y = 150 + rnd() * 460, a = rnd() * 6.28, l = 18 + rnd() * 46; o.beginPath(); o.moveTo(x, y); o.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + 6, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); o.stroke(); }
    o.fillStyle = 'rgba(255,255,255,0.35)'; for (let i = 0; i < 7; i++) { o.beginPath(); o.ellipse(40 + rnd() * 280, 160 + rnd() * 440, 30 + rnd() * 30, 5, -0.5, 0, 7); o.fill(); }
    o.restore();
    // pines along the top bank, drawn small and rounded
    for (let i = 0; i < 7; i++) { const x = 8 + i * 58 + rnd() * 10, y = 70 + rnd() * 10, s = 0.55 + rnd() * 0.2; pine(o, x, y, s); }
    for (const [x, y, s] of [[22, 560, 0.75], [338, 600, 0.7], [16, 300, 0.55], [346, 210, 0.6]]) pine(o, x, y, s);
  }
  function pine(o, x, y, s) {
    o.save(); o.translate(x, y); o.scale(s, s);
    o.fillStyle = 'rgba(90,70,140,0.18)'; o.beginPath(); o.ellipse(6, 4, 30, 8, 0, 0, 7); o.fill();
    o.fillStyle = '#7a4a3a'; o.fillRect(-4, -12, 8, 14);
    const tiers = [[0, -12, 30], [0, -34, 24], [0, -54, 17]];
    for (const [tx, ty, w] of tiers) { o.fillStyle = '#3f7a6a'; o.beginPath(); o.moveTo(tx - w, ty); o.quadraticCurveTo(tx, ty - w * 1.5, tx + w, ty); o.closePath(); o.fill(); o.fillStyle = '#fbf8ff'; o.beginPath(); o.moveTo(tx - w * 0.75, ty - w * 0.35); o.quadraticCurveTo(tx, ty - w * 1.55, tx + w * 0.75, ty - w * 0.35); o.quadraticCurveTo(tx, ty - w * 0.7, tx - w * 0.75, ty - w * 0.35); o.fill(); }
    o.restore();
  }
  function board(c, x, y, wob, hit) { // a round target board on a post, seen from the front
    c.save(); c.translate(x, y); c.rotate(Math.sin(wob * 30) * wob * 0.6);
    SK.shadow(c, 0, TR + 22, 26, 7, 0.2);
    c.fillStyle = '#8a5a3a'; c.fillRect(-4, 0, 8, TR + 22);
    const rings = ['#e8403a', '#fff6ea', '#e8403a', '#fff6ea', '#ffd45a'];
    for (let i = 0; i < rings.length; i++) { c.fillStyle = rings[i]; c.beginPath(); c.arc(0, 0, TR * (1 - i * 0.19), 0, 7); c.fill(); }
    c.strokeStyle = '#7a2414'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, TR, 0, 7); c.stroke();
    c.restore();
  }
  function snowman(c, x, y, hat, t) { // hat: null on the head, or { x, y, a } flying off
    SK.shadow(c, x, y + 2, 30, 8, 0.2);
    for (const [dy, r] of [[-20, 22], [-54, 16]]) { const gr = c.createRadialGradient(x - r * 0.4, y + dy - r * 0.4, 2, x, y + dy, r); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#cfd0ee'); c.fillStyle = gr; c.beginPath(); c.arc(x, y + dy, r, 0, 7); c.fill(); c.strokeStyle = '#8a86b8'; c.lineWidth = 2; c.stroke(); }
    c.fillStyle = '#2a1424'; for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * 6, y - 58, 2.4, 0, 7); c.fill(); }
    c.fillStyle = '#f08a3a'; c.beginPath(); c.moveTo(x, y - 53); c.lineTo(x + 14, y - 50); c.lineTo(x, y - 49); c.fill();
    c.strokeStyle = '#7a4a3a'; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 18, y - 26); c.lineTo(x - 36, y - 40 + Math.sin(t * 3) * 3); c.moveTo(x + 18, y - 26); c.lineTo(x + 34, y - 42); c.stroke();
    c.fillStyle = '#d8405a'; c.fillRect(x - 15, y - 42, 30, 6);
    const h = hat || { x, y: y - 70, a: 0 };
    c.save(); c.translate(h.x, h.y); c.rotate(h.a); c.fillStyle = '#2a2430'; c.fillRect(-15, 0, 30, 5); c.fillRect(-10, -20, 20, 21); c.fillStyle = '#d8405a'; c.fillRect(-10, -6, 20, 4); c.restore();
  }
  function arrow(c, x0, y0, x1, y1, col, w) {
    const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0); if (L < 4) return;
    c.save(); c.translate(x0, y0); c.rotate(a); c.fillStyle = col; c.strokeStyle = 'rgba(40,10,30,0.6)'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(0, -w / 2); c.lineTo(L - w * 1.6, -w / 2); c.lineTo(L - w * 1.6, -w * 1.3); c.lineTo(L, 0); c.lineTo(L - w * 1.6, w * 1.3); c.lineTo(L - w * 1.6, w / 2); c.lineTo(0, w / 2); c.closePath(); c.fill(); c.stroke(); c.restore();
  }
  const ball = (s, th) => ({ x: C.x + Math.cos(th) * R, y: C.y + Math.sin(th) * R });
  MG.add({
    id: 'swing', stage: 'motion', cmd: 'SWING!', time: 5, mood: 'bright', winText: 'Bullseye!', failText: 'Whoops!',
    card: { title: 'Going round needs a pull', kind: 'Physics', ref: 'Centripetal force',
      text: 'A moving ball wants to go straight. To make it go round in a circle, something has to pull it toward the middle all the time. Here the string does the pulling. That pull toward the centre is called centripetal force.\n\nWhen you let go, the pull stops. The ball then flies off in a straight line in the direction it was moving at that moment. That line just touches the circle. The ball does not fly straight outward.\n\nSpin faster and the string has to pull much harder, until it snaps.',
      note: 'Going round in a circle needs a pull toward the centre. Without the pull, the ball goes straight on.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.phi = -Math.PI / 2 + (L ? (g.rand() - 0.5) * 0.6 : 0); // direction of the target from the centre
      s.T = { x: C.x + Math.cos(s.phi) * TD, y: C.y + Math.sin(s.phi) * TD };
      s.relTh = s.phi - Math.acos(R / TD); // the point on the circle where the ball heads straight for the target
      s.w = (Math.PI * 2) / [1.8, 1.5, 1.45][L]; s.th = s.relTh + 2.4; // start well away from the release point
      // the snowman stands where a ball let go while pointing at the target would go (sideways)
      const nx = C.x + Math.cos(s.phi) * R, ny = C.y + Math.sin(s.phi) * R, vx = -Math.sin(s.phi), vy = Math.cos(s.phi);
      s.S = { x: nx + vx * 118, y: ny + vy * 118 + 40 };
      s.free = null; s.trail = []; s.hitT = 0; s.hat = null; s.snapT = 0; s.missT = 0; s.wob = 0;
    },
    down(g) { const s = g.s; SK.touched(g); if (s.free || g.done) return; release(g, false); },
    update(g, dt) {
      const s = g.s;
      if (!s.free) {
        if (g.level >= 2 && g.t > 0.8) s.w += 0.55 * dt; // level 2: spinning up
        s.th += s.w * dt;
        if (g.level >= 2 && s.w > 8.6 && !g.done) { s.snapT = g.t; g.sfx('snap'); release(g, true); }
        if (Math.floor(s.th / Math.PI) !== Math.floor((s.th - s.w * dt) / Math.PI)) g.sfx('swoosh', { vol: 0.35 });
      } else {
        const b = s.free;
        for (let i = 0; i < 4; i++) { // straight line, steady speed: nothing pushes it on the ice
          const h = dt / 4; b.x += b.vx * h; b.y += b.vy * h;
          if (!b.done && SK.dist(b.x, b.y, s.T.x, s.T.y) < TR + BR - 4) { b.done = 'board'; b.vx = b.vy = 0; s.hitT = g.t; g.sfx('thud'); g.sfx('cheer'); g.burst(b.x, b.y, ['#ffd45a', '#e8403a', '#fff6ea'], 24, 220); g.win(); }
          if (!b.done && Math.abs(b.x - s.S.x) < 26 && b.y > s.S.y - 82 && b.y < s.S.y) { b.done = 'snowman'; s.hat = { x: s.S.x, y: s.S.y - 70, a: 0, vx: b.vx * 0.5, vy: -260, va: 7 }; b.vx *= 0.3; b.vy *= 0.3; g.sfx('crunch'); g.sfx('laugh'); g.burst(b.x, b.y, ['#ffffff', '#cfd0ee'], 16, 160); if (!g.done) g.fail(); }
        }
        if (!b.done && (b.x < -20 || b.x > 380 || b.y < 40 || b.y > 660)) { b.done = 'out'; s.missT = g.t; g.sfx('thud'); if (!g.done) g.fail(); }
        if (b.done === 'snowman') { b.vx *= 0.9; b.vy *= 0.9; }
        s.trail.push([b.x, b.y]); if (s.trail.length > 30) s.trail.shift();
      }
      if (s.hat) { const h = s.hat; h.vy += 900 * dt; h.x += h.vx * dt; h.y += h.vy * dt; h.a += h.va * dt; if (h.y > s.S.y - 4) { h.y = s.S.y - 4; h.vy = 0; h.vx *= 0.8; h.va = 0; } }
      if (s.hitT) s.wob = Math.max(0, 0.4 - (g.t - s.hitT)) ;
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('swing_pond', paintPond), 0, 0, 360, 640);
      // the path the ball keeps to while the string pulls
      c.save(); c.strokeStyle = 'rgba(80,110,170,0.28)'; c.lineWidth = 2; c.setLineDash([4, 7]); c.beginPath(); c.arc(C.x, C.y, R, 0, 7); c.stroke(); c.restore();
      board(c, s.T.x, s.T.y, s.wob, s.hitT);
      snowman(c, s.S.x, s.S.y, s.hat, t);
      // the frog in the middle, arms up, holding the string
      const fr = SK.animal(c, 'frog', C.x, C.y + 58, 1.1, { t, pose: won ? 'cheer' : 'carry', expr: won ? 'laugh' : lost ? 'wow' : 'happy' });
      const hx = fr && fr.hold ? fr.hold.x : C.x, hy = fr && fr.hold ? fr.hold.y : C.y;
      if (!s.free) {
        const p = ball(s, s.th), vx = -Math.sin(s.th), vy = Math.cos(s.th);
        // level 0: a faint dotted line shows where the ball would go if you let go now
        if (g.level === 0 && !g.done) { c.save(); c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 3; c.setLineDash([3, 9]); c.lineCap = 'round'; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x + vx * 260, p.y + vy * 260); c.stroke(); c.restore(); }
        // blur ghosts behind the ball
        for (let i = 1; i <= 4; i++) { const q = ball(s, s.th - i * 0.09); c.fillStyle = `rgba(255,255,255,${0.32 - i * 0.07})`; c.beginPath(); c.arc(q.x, q.y, BR, 0, 7); c.fill(); }
        c.strokeStyle = '#5a3a2a'; c.lineWidth = 2; c.beginPath(); c.moveTo(hx, hy); c.lineTo(p.x, p.y); c.stroke();
        snowball(c, p.x, p.y);
        // the pull of the string: an arrow toward the centre, growing as the spin speeds up
        const pull = Math.min(R - 20, 14 + s.w * s.w * 1.5), hot = SK.clamp((s.w - 6.5) / 2, 0, 1);
        arrow(c, p.x - Math.cos(s.th) * (BR + 2), p.y - Math.sin(s.th) * (BR + 2), p.x - Math.cos(s.th) * (BR + 2 + pull), p.y - Math.sin(s.th) * (BR + 2 + pull), P.mix('#ff7a5a', '#e01a2a', hot), 7 + hot * 3);
        if (!g.done) { const r = ball(s, s.relTh); SK.glow(c, g, r.x, r.y, 18); }
      } else {
        const b = s.free;
        for (let i = 1; i < s.trail.length; i++) { const [x0, y0] = s.trail[i - 1], [x1, y1] = s.trail[i]; c.strokeStyle = `rgba(255,255,255,${0.1 + 0.6 * i / s.trail.length})`; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
        // the loose string, flopping
        const fl = SK.clamp((t - s.freeT) * 3, 0, 1); c.strokeStyle = '#5a3a2a'; c.lineWidth = 2; c.beginPath(); c.moveTo(hx, hy);
        c.quadraticCurveTo(hx + Math.cos(s.relAt) * 30, hy + Math.sin(s.relAt) * 30 + fl * 30, hx + Math.cos(s.relAt) * (s.snapT ? 34 : 54) * (1 - fl * 0.4), hy + Math.sin(s.relAt) * 40 + fl * 46); c.stroke();
        if (b.done !== 'board') snowball(c, b.x, b.y); else snowball(c, b.x, b.y, 0.8);
        if (s.missT) { const k = SK.clamp((t - s.missT) * 2, 0, 1); c.save(); c.globalAlpha = 1 - k; c.fillStyle = '#fff'; for (let i = 0; i < 6; i++) { const a = i * 1.05; c.beginPath(); c.arc(SK.clamp(b.x, 10, 350) + Math.cos(a) * 30 * k, SK.clamp(b.y, 50, 630) + Math.sin(a) * 30 * k, 9 * (1 - k) + 3, 0, 7); c.fill(); } c.restore(); }
      }
      if (s.snapT && t - s.snapT < 0.8) SK.tag(c, 'Snap!', hx, hy - 34, 20);
      if (!s.free) { const per = Math.PI * 2 / s.w, ph = ((((s.relTh - (s.th - s.w * t)) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / s.w, r = ball(s, s.relTh);
        let d0 = ph - 0.45 * per; while (d0 < 0.7) d0 += per; SK.demo(g, c, 'tap', [r.x - 6, r.y + 16], null, { delay: d0, period: per }); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (s.free || g.done || g.t < 1.0) return;
      const d = ((s.th - s.relTh) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      if (d < s.w * dt * 1.2 || d > Math.PI * 2 - 0.02) synth('down', 180, 560), synth('up', 180, 560);
    },
  });
  function snowball(c, x, y, sq = 1) { SK.shadow(c, x + 3, y + 8, BR * 0.9, 3.5, 0.2); c.save(); c.translate(x, y); c.scale(1, sq); SK.ball(c, 0, 0, BR, '#f4f6ff', { edge: '#8a86b8' }); c.restore(); }
  function release(g, snapped) {
    const s = g.s, p = ball(s, s.th), v = s.w * R;
    s.free = { x: p.x, y: p.y, vx: -Math.sin(s.th) * v, vy: Math.cos(s.th) * v, done: null }; s.freeT = g.t; s.relAt = s.th;
    if (!snapped) g.sfx('whoosh');
  }
})();
