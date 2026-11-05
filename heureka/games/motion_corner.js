// CORNER! (physics AP1-06) — a country road seen from above with three bends, round hay bales stacked on the outside of
// each bend, and icy patches on some bends. Hold the big pedal to drive the fox's car; let go and the brakes slow it.
// On a bend the tyres' grip (a green arrow) pulls the car toward the bend's centre; the faster the car, the more pull
// it needs (v²/r). On ice the tyres can give much less. Too fast for the grip: the arrow snaps and the car slides
// straight on (it keeps its motion) into the hay. The speedometer's green band shows the speed the next bend can take.
// Level 0: one icy bend; level 1: two; level 2: every bend is icy (the curriculum's "the whole curve is icy").
(() => {
  const RW = 46, ACC = 150, BRK = 270, VROLL = 58, VMAX = 240, GD = 230, GI = 88, SKD = 70;
  // the track, unmirrored: straights (L) and quarter bends (A: centre, radius, start and end angle)
  function track(v, lv) {
    const R = [[60, 52, 62], [56, 62, 50], [62, 50, 58], [52, 60, 56]][v], [R1, R2, R3] = R;
    const y1 = 440 - R1, x2 = 300, Y3 = 238;
    const segs = [
      { k: 'L', a: [60, 560], b: [60, 440] },
      { k: 'A', c: [60 + R1, 440], r: R1, a0: Math.PI, a1: 1.5 * Math.PI },
      { k: 'L', a: [60 + R1, y1], b: [x2 - R2, y1] },
      { k: 'A', c: [x2 - R2, y1 - R2], r: R2, a0: 0.5 * Math.PI, a1: 0 },
      { k: 'L', a: [x2, y1 - R2], b: [x2, Y3] },
      { k: 'A', c: [x2 - R3, Y3], r: R3, a0: 0, a1: -0.5 * Math.PI },
      { k: 'L', a: [x2 - R3, Y3 - R3], b: [20, Y3 - R3] },
    ];
    // which bends are icy: level 0 one, level 1 two, level 2 all
    const ice = lv >= 2 ? [1, 1, 1] : lv === 1 ? [[1, 0, 1], [0, 1, 1], [1, 1, 0], [0, 1, 1]][v] : [[0, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0]][v];
    let s = 0, bi = 0;
    for (const g of segs) { g.len = g.k === 'L' ? Math.hypot(g.b[0] - g.a[0], g.b[1] - g.a[1]) : g.r * Math.abs(g.a1 - g.a0); g.s0 = s; s += g.len; if (g.k === 'A') { g.bend = bi; g.ice = !!ice[bi]; g.vs = Math.sqrt((g.ice ? GI : GD) * g.r); bi++; } }
    return { segs, len: s, finish: segs[6].s0 + 120, ice };
  }
  const segAt = (T, s) => { for (const g of T.segs) if (s < g.s0 + g.len) return g; return T.segs[T.segs.length - 1]; };
  function posAt(T, s) { // unmirrored position and heading at arc length s
    const g = segAt(T, s), k = SK.clamp((s - g.s0) / g.len, 0, 1.5);
    if (g.k === 'L') return { x: SK.lerp(g.a[0], g.b[0], k), y: SK.lerp(g.a[1], g.b[1], k), h: Math.atan2(g.b[1] - g.a[1], g.b[0] - g.a[0]), g };
    const an = g.a0 + (g.a1 - g.a0) * k, d = Math.sign(g.a1 - g.a0); return { x: g.c[0] + g.r * Math.cos(an), y: g.c[1] + g.r * Math.sin(an), h: an + d * Math.PI / 2, g };
  }
  const nextBend = (T, s) => { const g = segAt(T, s); if (g.k === 'A') return g; for (const q of T.segs) if (q.k === 'A' && q.s0 >= s) return q; return null; };
  // is it still safe to keep the pedal down for another `lead` seconds? (letting go then must bring the car to the next
  // bend slowly enough; on a bend, the car must stay under the speed its grip can take)
  function safeToHold(T, s, v, m = 0.9, lead = 0) {
    const v1 = Math.min(VMAX, v + ACC * lead), s1 = s + (v + v1) / 2 * lead, g = segAt(T, s1);
    if (g.k === 'A' && v1 > g.vs * m) return false;
    const nb = nextBend(T, s1 + (g.k === 'A' ? g.len - (s1 - g.s0) + 1 : 0)); if (!nb) return true;
    const cur = segAt(T, s); if (cur.k === 'L' && cur !== g && nextBend(T, s) !== nb) return false; // the hold would carry it into a bend
    const D = nb.s0 - s1, v2 = v1 * v1 - 2 * BRK * Math.max(0, D); return v2 <= (nb.vs * m) * (nb.vs * m);
  }
  // how long holding stays safe from (s, v), leaving a quarter of a second to react: what the ghost hand shows
  function holdFor(T, s, v) { let t = 0; const h = 1 / 60; while (t < 4 && safeToHold(T, s, v, 0.85, 0.25)) { v = Math.min(VMAX, v + ACC * h); s += v * h; t += h; if (s > T.finish) return 4; } return t; }
  function paintRoad(o, T, m) {
    const X = x => m ? 360 - x : x;
    N1.vgrad(o, 0, 0, 360, 640, ['#86c25a', '#74b24a', '#8cc860']);
    for (let i = 0; i < 9; i++) { o.fillStyle = i % 2 ? 'rgba(255,255,255,0.05)' : 'rgba(30,80,20,0.05)'; o.fillRect(0, i * 72, 360, 36); } // mowing stripes
    const r = P.rng(31); for (let i = 0; i < 160; i++) { o.fillStyle = r() < 0.5 ? 'rgba(40,90,30,0.25)' : 'rgba(200,240,150,0.3)'; o.beginPath(); o.ellipse(r() * 360, r() * 640, 2 + r() * 3, 1 + r() * 1.5, r() * 3, 0, 7); o.fill(); }
    P.flowers(o, 360, 130, 620, 26);
    // a pond and trees seen from above
    o.fillStyle = '#4a9ac8'; o.beginPath(); o.ellipse(X(190), 300, 34, 22, 0.2, 0, 7); o.fill(); o.fillStyle = 'rgba(255,255,255,0.35)'; o.beginPath(); o.ellipse(X(182), 294, 16, 5, 0.2, 0, 7); o.fill();
    for (const [x, y, rr] of [[200, 510, 22], [330, 600, 18], [150, 250, 16], [330, 150, 14], [20, 300, 18]]) { o.fillStyle = 'rgba(20,50,20,0.25)'; o.beginPath(); o.arc(X(x) + 5, y + 6, rr, 0, 7); o.fill(); const tg = o.createRadialGradient(X(x) - rr * 0.3, y - rr * 0.3, 2, X(x), y, rr); tg.addColorStop(0, '#7ec45a'); tg.addColorStop(1, '#2e7030'); o.fillStyle = tg; o.beginPath(); o.arc(X(x), y, rr, 0, 7); o.fill(); }
    // the road: a dark verge, the tarmac, white edge lines and a dashed centre line
    const path = (w, col, dash) => { o.save(); o.strokeStyle = col; o.lineWidth = w; o.lineCap = 'butt'; o.lineJoin = 'round'; if (dash) o.setLineDash(dash); o.beginPath(); let first = true;
      for (const g of T.segs) { if (g.k === 'L') { if (first) o.moveTo(X(g.a[0]), g.a[1]); o.lineTo(X(g.b[0]), g.b[1]); } else { const n = 18; for (let i = 0; i <= n; i++) { const an = g.a0 + (g.a1 - g.a0) * i / n; o.lineTo(X(g.c[0] + g.r * Math.cos(an)), g.c[1] + g.r * Math.sin(an)); } } first = false; }
      o.stroke(); o.restore(); };
    path(RW + 12, '#5a6a3a'); path(RW, '#4a4a58'); path(RW - 6, '#5a5a68'); path(RW - 8, '#f4f0e8'); path(RW - 12, '#55555f'); path(2.5, '#f4e070', [10, 10]);
    // start line and chequered finish
    o.fillStyle = '#f4f0e8'; o.fillRect(X(60) - RW / 2 + 4, 548, RW - 8, 4);
    const fy = T.segs[6].a[1], fx = T.segs[6].a[0] - 120; for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) { o.fillStyle = (i + j) % 2 ? '#222' : '#fff'; o.fillRect(X(fx + j * 6) - (m ? 6 : 0), fy - RW / 2 + 4 + i * 6.5, 6, 6.5); }
    // ice on the icy bends
    for (const g of T.segs) if (g.k === 'A' && g.ice) {
      o.save(); o.strokeStyle = 'rgba(220,245,255,0.78)'; o.lineWidth = RW - 4; o.lineCap = 'round'; o.beginPath(); const n = 16; for (let i = 0; i <= n; i++) { const an = g.a0 + (g.a1 - g.a0) * (-0.12 + 1.24 * i / n); const px = X(g.c[0] + g.r * Math.cos(an)), py = g.c[1] + g.r * Math.sin(an); i ? o.lineTo(px, py) : o.moveTo(px, py); } o.stroke();
      o.strokeStyle = 'rgba(255,255,255,0.9)'; o.lineWidth = 1.5; for (let i = 0; i < 9; i++) { const an = g.a0 + (g.a1 - g.a0) * r(), rr = g.r + (r() - 0.5) * RW * 0.7; const px = X(g.c[0] + rr * Math.cos(an)), py = g.c[1] + rr * Math.sin(an); o.beginPath(); o.moveTo(px - 6, py - 2); o.lineTo(px + 6, py + 2); o.stroke(); }
      o.restore();
    }
  }
  function hay(c, x, y, rr, t, hit) { // a round bale seen from above: a golden disc with a spiral
    SK.shadow(c, x + 3, y + 4, rr, rr * 0.8, 0.25);
    const hg = c.createRadialGradient(x - rr * 0.3, y - rr * 0.3, 2, x, y, rr); hg.addColorStop(0, '#ffe8a0'); hg.addColorStop(1, '#d0a040'); c.fillStyle = hg; c.beginPath(); c.arc(x, y, rr, 0, 7); c.fill();
    c.strokeStyle = '#a87a28'; c.lineWidth = 1.5; c.beginPath(); for (let a = 0; a < 14; a += 0.3) { const q = rr * a / 14; c.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } c.stroke();
  }
  function car(c, x, y, h, t, o = {}) { // the fox's little red car from above
    c.save(); c.translate(x, y); c.rotate(h + Math.PI / 2); c.scale(1.25, 1.25);
    c.fillStyle = 'rgba(20,20,30,0.3)'; c.beginPath(); c.roundRect(-11, -16, 26, 40, 9); c.fill();
    c.fillStyle = '#2a2a34'; for (const [wx, wy] of [[-13, -11], [9, -11], [-13, 8], [9, 8]]) { c.beginPath(); c.roundRect(wx, wy, 5, 10, 2); c.fill(); }
    const bg = c.createLinearGradient(-11, 0, 11, 0); bg.addColorStop(0, '#ff6a5a'); bg.addColorStop(1, '#c02a3a'); c.fillStyle = bg; c.strokeStyle = '#5a1020'; c.lineWidth = 2; c.beginPath(); c.roundRect(-11, -19, 22, 38, 9); c.fill(); c.stroke();
    c.fillStyle = '#9ad8f0'; c.beginPath(); c.roundRect(-8, -12, 16, 7, 3); c.fill();
    if (o.brake) { c.fillStyle = '#ff2a2a'; c.shadowColor = '#ff4040'; c.shadowBlur = 10; c.fillRect(-9, 16, 5, 3); c.fillRect(4, 16, 5, 3); c.shadowBlur = 0; }
    // the fox in the open top: orange head, pointy ears
    c.fillStyle = '#e8803a'; c.strokeStyle = '#5a2a14'; c.lineWidth = 1.5; c.beginPath(); c.arc(0, 2, 6.5, 0, 7); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-6, 0); c.lineTo(-6, -8); c.lineTo(-1, -3); c.closePath(); c.moveTo(6, 0); c.lineTo(6, -8); c.lineTo(1, -3); c.closePath(); c.fill(); c.stroke();
    c.restore();
  }
  MG.add({
    id: 'corner', stage: 'motion', cmd: 'DRIVE ROUND WITHOUT SKIDDING!', time: 7, mood: 'bright', winText: 'Round the bends!', failText: 'Skidded!',
    card: { title: 'Grip turns the car', kind: 'Physics', ref: 'Friction and circular motion',
      text: 'A moving car wants to keep going straight. To turn, something must pull it toward the middle of the bend. That pull is the grip of the tyres on the road, a kind of friction.\n\nThe faster the car, the harder the pull it needs. Ice gives much less grip than dry road. If the car needs more pull than the tyres can give, it slides straight on.\n\nThat is why drivers slow down before a bend, not in it, and slow down even more on ice.',
      note: 'A car needs grip to turn. Too fast, or on ice, the tyres cannot pull hard enough and the car slides straight on.' },
    init(g) {
      const s = g.s; s.v0 = SK.variant(g, 4); s.m = s.v0 % 2 === 1; s.T = track(s.v0, Math.min(2, g.level));
      s.pos = 0; s.v = 0; s.hold = false; s.skid = null; s.crash = 0; s.fin = 0; s.bendsDone = 0; s.snapT = 0; s.prevBend = -1;
      s.BTN = { x: s.m ? 120 : 240, y: 584, w: 196, h: 58 }; s.DIAL = { x: s.m ? 116 : 244, y: 500 };
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.skid) return; s.hold = true; g.sfx('tap', { pitch: 0.6, vol: 0.5 }); },
    up(g) { g.s.hold = false; },
    update(g, dt) {
      const s = g.s, T = s.T;
      if (s.skid) { const k = s.skid; const sp = Math.hypot(k.vx, k.vy), d = Math.max(0, sp - SKD * dt); if (sp > 0) { k.vx *= d / sp; k.vy *= d / sp; } k.x += k.vx * dt; k.y += k.vy * dt; k.rot += k.spin * dt * d / 100;
        if (!s.crash && (Math.hypot(k.x - k.c[0], k.y - k.c[1]) > k.r + RW / 2 + 6 || d < 5)) { s.crash = g.t; k.vx *= 0.1; k.vy *= 0.1; g.sfx('thud'); g.sfx('crunch'); g.sfx('laugh'); g.shake(5, 0.3); const X = s.m ? 360 - k.x : k.x; g.burst(X, k.y, ['#ffe8a0', '#d0a040', '#fff6ea'], 26, 200); g.fail(); }
        if (s.crash) { k.vx = k.vy = 0; } return; }
      if (g.done) { s.v = Math.max(0, s.v - BRK * dt); s.pos += s.v * dt; return; }
      if (s.hold) s.v = Math.min(VMAX, s.v + ACC * dt); else if (s.v > VROLL) s.v = Math.max(VROLL, s.v - BRK * dt); else if (segAt(T, s.pos).k === 'L') s.v = Math.max(0, s.v - 14 * dt); else s.v = Math.min(VROLL, s.v + 60 * dt); // on a bend the fox keeps a gentle roll going
      s.pos += s.v * dt; const p = posAt(T, s.pos), sg = p.g;
      if (s.hold && s.v > 30 && g.rand() < 0.08) g.sfx('tap', { pitch: 0.4 + s.v / 400, vol: 0.15 });
      if (sg.k === 'A') {
        if (s.v * s.v / sg.r > (sg.ice ? GI : GD)) { // not enough grip: it slides straight on along the way it was going
          s.skid = { x: p.x, y: p.y, vx: Math.cos(p.h) * s.v, vy: Math.sin(p.h) * s.v, rot: 0, spin: sg.a1 > sg.a0 ? -2.4 : 2.4, h: p.h, c: sg.c, r: sg.r, bend: sg.bend };
          s.snapT = g.t; g.sfx('snap'); g.sfx('swoosh'); return; }
        s.prevBend = sg.bend;
      } else if (s.prevBend >= 0 && s.bendsDone <= s.prevBend) { s.bendsDone = s.prevBend + 1; g.sfx('chime'); }
      if (s.pos >= T.finish) { s.fin = g.t; g.win(); g.sfx('cheer'); g.sfx('ding'); g.burst(s.m ? 360 - (T.segs[6].a[0] - 120) : T.segs[6].a[0] - 120, T.segs[6].a[1], ['#ffd45a', '#ff6a5a', '#fff6ea'], 22, 180); }
    },
    draw(g, c) {
      const s = g.s, T = s.T, t = g.t, X = x => s.m ? 360 - x : x, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('corner_' + s.v0 + '_' + T.ice.join(''), o => paintRoad(o, T, s.m)), 0, 0, 360, 640);
      // hay bales on the outside of each bend, and a warning sign before it
      for (const sg of T.segs) if (sg.k === 'A') {
        const am = (sg.a0 + sg.a1) / 2, rr = sg.r + RW / 2 + 16;
        for (let i = -2; i <= 2; i++) { const an = am + i * 0.38; let hx = sg.c[0] + Math.cos(an) * rr * (1 + Math.abs(i) * 0.08), hy = sg.c[1] + Math.sin(an) * rr * (1 + Math.abs(i) * 0.08); hx = SK.clamp(hx, 14, 346); hy = Math.max(132, hy); hay(c, X(hx), hy, 12, t); }
        if (sg.ice) { const ai = sg.a0 + (sg.a1 - sg.a0) * 0.5; SK.tag(c, 'Ice', X(sg.c[0] + Math.cos(ai) * (sg.r - 38)), sg.c[1] + Math.sin(ai) * (sg.r - 38), 18, '#1e4a6a', 'rgba(235,250,255,0.9)'); }
      }
      // the car (or the skidding car), with its grip arrow on a bend
      let cx, cy, ch, brake = !s.hold && s.v > VROLL + 2 && !g.done;
      if (s.skid) { cx = s.skid.x; cy = s.skid.y; ch = s.skid.h + s.skid.rot; } else { const p = posAt(T, s.pos); cx = p.x; cy = p.y; ch = p.h; }
      const p = posAt(T, s.pos), sg = p.g;
      if (!s.skid && sg.k === 'A' && s.v > 5) { // the grip: a pull toward the bend's centre, as long as the car needs
        const need = s.v * s.v / sg.r, max = sg.ice ? GI : GD, L = 18 + 46 * need / max, ux = (sg.c[0] - cx) / sg.r, uy = (sg.c[1] - cy) / sg.r;
        c.save(); c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath(); c.arc(X(cx + ux * 64), cy + uy * 64, 5, 0, 7); c.stroke(); c.restore();
        N1.farrow(c, X(cx + ux * 14), cy + uy * 14, X(cx + ux * (14 + L)), cy + uy * (14 + L), need / max > 0.85 ? '#ffb040' : '#6ae07a', 6);
        SK.tag(c, 'Grip', X(cx + ux * (14 + L + 26)), cy + uy * (14 + L + 26), 18);
      }
      if (s.skid && t - s.snapT < 0.8) { // the snapped grip arrow: two broken halves flying apart
        const k = (t - s.snapT) / 0.8, ux = (s.skid.c[0] - s.skid.x), uy = (s.skid.c[1] - s.skid.y), L = Math.hypot(ux, uy) || 1;
        c.save(); c.globalAlpha = 1 - k; for (const d of [-1, 1]) { const bx = s.skid.x + ux / L * (30 + d * 16) + d * k * 30, by = s.skid.y + uy / L * (30 + d * 16) - k * 20; c.strokeStyle = '#ff6a5a'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(X(bx - 8), by - 4); c.lineTo(X(bx + 8), by + 4); c.stroke(); } c.restore();
        N1.word(c, 'Snap!', X(s.skid.x) + 0, s.skid.y - 40, 22, '#ffb040');
      }
      car(c, X(cx), cy, s.m ? Math.PI - ch : ch, t, { brake });
      // the fox's friends at the finish
      SK.animal(c, 'bird', X(40), T.segs[6].a[1] - 34, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: s.m ? -1 : 1 });
      SK.animal(c, 'frog', X(128), 350, 0.85, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : s.skid ? 'wow' : 'happy', facing: s.m ? 1 : -1 });
      // the speedometer: the needle, with the green band the next bend can take
      if (!g.done) {
        const D = s.DIAL, nb = s.skid ? null : nextBend(T, s.pos), vs = nb ? nb.vs : VMAX, a0 = Math.PI * 0.85, a1 = Math.PI * 2.15, va = v => a0 + (a1 - a0) * SK.clamp(v / VMAX, 0, 1);
        c.save(); c.fillStyle = 'rgba(30,14,36,0.72)'; c.beginPath(); c.arc(D.x, D.y, 52, 0, 7); c.fill(); c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.stroke();
        c.lineWidth = 10; c.strokeStyle = '#e84a4a'; c.beginPath(); c.arc(D.x, D.y, 38, va(vs), a1); c.stroke(); c.strokeStyle = '#5ad07a'; c.beginPath(); c.arc(D.x, D.y, 38, a0, va(vs)); c.stroke();
        const na = va(s.v); c.strokeStyle = '#fff6ea'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(D.x, D.y); c.lineTo(D.x + Math.cos(na) * 40, D.y + Math.sin(na) * 40); c.stroke(); c.fillStyle = '#fff6ea'; c.beginPath(); c.arc(D.x, D.y, 5, 0, 7); c.fill(); c.restore();
        N1.word(c, 'Speed', D.x, D.y + 30, 18);
        // too fast for the bend ahead: say so
        if (!s.skid && s.hold && !safeToHold(T, s.pos, s.v, 0.85, 0.25)) SK.tag(c, 'Let go!', D.x, D.y - 72, 20, '#fff6ea', 'rgba(200,40,40,0.95)');
        const hf = s.skid ? 0 : holdFor(T, s.pos, s.v), go = hf >= 0.33;
        N1.button(c, s.BTN, s.hold ? 'Driving...' : 'Hold to drive', '#3a9a5a', { pressed: s.hold, lit: go && !s.hold, t });
        if (go && !s.hold) SK.glow(c, g, s.BTN.x, s.BTN.y, 40, undefined, { level: 2 });
        SK.demo(g, c, 'hold', [s.BTN.x + 30, s.BTN.y + 4], null, { never: !go, period: SK.clamp(hf / 0.65, 0.5, 4) });
      }
    },
    // the bot keeps the pedal down while letting go now would still make the next bend, and lets go otherwise
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.skid || g.t < 1.0) return; const want = safeToHold(s.T, s.pos, s.v, 0.9, 0.05);
      if (want && !s.hold) synth('down', s.BTN.x, s.BTN.y); else if (!want && s.hold) synth('up', s.BTN.x, s.BTN.y);
    },
  });
})();
