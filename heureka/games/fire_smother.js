// SMOTHER! (chem_bio FP-01) — a campfire in a night clearing, inside a glowing fire triangle whose three sides are
// pictures: logs (fuel), a flame (heat) and a puff of air (oxygen). Swipe across any side to take it away: the rake
// pulls the logs apart, a shovel of sand cuts off the air, or a bucket of water cools it. The flames shrink to smoke.
// Swiping through the fire itself fans it: more air, the flames leap and the fox's marshmallow burns to charcoal.
// Each tool works once (the bucket is empty, the sand is used, the rake is stuck), so the next campfire needs another
// side. Level 0: two campfires; level 1: three; level 2: three, and each spreads if it burns too long.
(() => {
  const V = [[180, 178], [44, 470], [316, 470]], FIRE = { x: 180, y: 418 };
  const SIDES = [ // which side, its two corners, its picture's centre
    { id: 'heat', a: 0, b: 1, x: 112, y: 324, col: '#ff5a3a' },
    { id: 'air', a: 0, b: 2, x: 248, y: 324, col: '#8ad8ff' },
    { id: 'fuel', a: 1, b: 2, x: 180, y: 470, col: '#f2b860' },
  ];
  function segDist(px, py, ax, ay, bx, by) { const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy || 1, k = SK.clamp(((px - ax) * dx + (py - ay) * dy) / L, 0, 1); return Math.hypot(px - ax - dx * k, py - ay - dy * k); }
  function pathNear(pts, x, y, r) { for (let i = 1; i < pts.length; i++) if (segDist(x, y, pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y) < r) return true; return false; }
  function paintBg(o) {
    const sk = o.createLinearGradient(0, 0, 0, 420); sk.addColorStop(0, '#1e1030'); sk.addColorStop(0.55, '#4a2040'); sk.addColorStop(1, '#8a3a3a'); o.fillStyle = sk; o.fillRect(0, 0, 360, 640);
    const r = P.rng(21); for (let i = 0; i < 50; i++) { o.fillStyle = `rgba(255,240,220,${0.3 + r() * 0.6})`; o.beginPath(); o.arc(r() * 360, r() * 260, r() * 1.4 + 0.3, 0, 7); o.fill(); }
    o.fillStyle = '#fff2d8'; o.beginPath(); o.arc(300, 150, 16, 0, 7); o.fill(); o.fillStyle = '#2a1430'; o.beginPath(); o.arc(308, 144, 14, 0, 7); o.fill();
    // pine silhouettes
    for (let i = 0; i < 11; i++) { const x = i * 36 - 10 + r() * 14, h = 120 + r() * 90, b = 430; o.fillStyle = i % 2 ? '#24142a' : '#2e1a32'; o.beginPath(); o.moveTo(x, b - h); for (let k = 1; k <= 4; k++) { o.lineTo(x - 10 - k * 7, b - h + k * h / 4.4); o.lineTo(x - 4, b - h + k * h / 4.4 - 6); } o.lineTo(x, b); for (let k = 4; k >= 1; k--) { o.lineTo(x + 4, b - h + k * h / 4.4 - 6); o.lineTo(x + 10 + k * 7, b - h + k * h / 4.4); } o.closePath(); o.fill(); }
    const gr = o.createLinearGradient(0, 420, 0, 640); gr.addColorStop(0, '#5a3a2a'); gr.addColorStop(1, '#2e1c16'); o.fillStyle = gr; o.beginPath(); o.moveTo(0, 430); o.quadraticCurveTo(180, 400, 360, 430); o.lineTo(360, 640); o.lineTo(0, 640); o.fill();
    for (let i = 0; i < 30; i++) { o.fillStyle = 'rgba(120,90,60,0.35)'; o.beginPath(); o.ellipse(r() * 360, 450 + r() * 180, 3 + r() * 6, 1.5 + r() * 2, 0, 0, 7); o.fill(); }
    P.vignette(o, 360, 640, 0.3, '#100818');
  }
  function stones(c, front) { for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, x = FIRE.x + Math.cos(a) * 50, y = FIRE.y + 6 + Math.sin(a) * 12; if ((Math.sin(a) > 0) !== front) continue; c.fillStyle = front ? '#8a7a80' : '#6a5a64'; c.beginPath(); c.ellipse(x, y, 13, 8, 0, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.18)'; c.beginPath(); c.ellipse(x - 3, y - 3, 6, 3, 0, 0, 7); c.fill(); } }
  function logs(c, apart, t) {
    const sp = apart * 46;
    for (const [dx, ang, col] of [[-1, 0.45, '#8a5430'], [1, -0.45, '#7a4826'], [0, 0.05, '#9a6038']]) {
      c.save(); c.translate(FIRE.x + dx * (sp + 4), FIRE.y + 2 + (dx === 0 ? -4 + apart * 26 : 0)); c.rotate(ang * (1 - apart * 0.6) + (dx === 0 ? apart * 0.25 : 0));
      c.fillStyle = col; c.beginPath(); c.roundRect(-30, -7, 60, 14, 7); c.fill(); c.strokeStyle = '#3a2010'; c.lineWidth = 2; c.stroke();
      c.fillStyle = '#e8b878'; c.beginPath(); c.ellipse(30, 0, 4, 7, 0, 0, 7); c.fill(); c.stroke(); c.restore();
    }
  }
  function icon(c, sd, t, k, broken) { // the picture on a triangle side, in a disc
    c.save(); c.translate(sd.x, sd.y);
    if (broken) { c.globalAlpha = Math.max(0, 1 - broken * 2); c.translate(0, broken * 40); c.rotate(broken * 2); }
    c.fillStyle = 'rgba(30,14,36,0.85)'; c.beginPath(); c.arc(0, 0, 27, 0, 7); c.fill(); c.strokeStyle = sd.col; c.lineWidth = 3.5; c.stroke();
    if (sd.id === 'heat') B3.flame(c, 0, 14, 0.42, t, 1, 2);
    if (sd.id === 'air') { c.strokeStyle = '#e8f8ff'; c.lineWidth = 3.5; c.lineCap = 'round'; for (let i = 0; i < 3; i++) { const y = -9 + i * 9, w = Math.sin(t * 6 + i) * 2; c.beginPath(); c.moveTo(-15, y); c.bezierCurveTo(-6, y - 6 + w, 2, y + 6 - w, 10, y); c.arc(10, y - 4, 4, Math.PI / 2, -Math.PI * 0.6, true); c.stroke(); } }
    if (sd.id === 'fuel') { for (const [ang, col] of [[0.3, '#8a5430'], [-0.3, '#a86a3a']]) { c.save(); c.rotate(ang); c.fillStyle = col; c.beginPath(); c.roundRect(-17, -5, 34, 10, 5); c.fill(); c.fillStyle = '#e8b878'; c.beginPath(); c.ellipse(17, 0, 3, 5, 0, 0, 7); c.fill(); c.restore(); } }
    c.restore();
  }
  MG.add({
    id: 'smother', stage: 'fire', cmd: 'SMOTHER!', time: 6, mood: 'storm', winText: 'Fire triangle!', failText: 'Toasted!',
    card: { title: 'The fire triangle', kind: 'Chemistry', ref: 'The fire triangle (combustion)',
      text: 'A fire needs three things at the same time: fuel to burn, heat, and oxygen from the air. These are the three sides of the fire triangle. Take away any one side and the fire goes out.\n\nRaking the logs apart takes away the fuel. Sand over the fire keeps the air out. Water cools the fire until it is too cold to keep burning. Fanning does the opposite: it brings more oxygen, so the flames grow.\n\nEmbers can stay hot for hours and start a fire again. Put out a campfire with an adult, and keep cooling and stirring it until it feels cold.',
      note: 'Fire needs fuel, heat and oxygen at once. Remove any one and it goes out.' },
    init(g) { const s = g.s; s.fire = 1; s.broken = {}; s.act = null; s.ember = 0; s.fan = 0; s.out = 0; s.coolT = 0; s.mallow = 0; s.relit = 0; s.n = g.level >= 1 ? 3 : 2; s.k = 0; s.used = {}; s.litT = 0; s.dud = null; s.lightT = -9; },
    down(g, x, y) { SK.touched(g); g.s.path = [{ x, y }]; },
    move(g, x, y) { const p = g.s.path; if (p) { p.push({ x, y }); if (p.length > 40) p.shift(); } },
    up(g, x, y) {
      const s = g.s, p = s.path; s.path = null; if (!p || g.done || s.act) return; p.push({ x, y });
      const len = Math.hypot(p[p.length - 1].x - p[0].x, p[p.length - 1].y - p[0].y); if (len < 40) return;
      const needCool = false;
      for (const sd of SIDES) if (pathNear(p, sd.x, sd.y, 42)) {
        if (s.out && !needCool) return;
        if (s.used[sd.id]) { s.dud = { id: sd.id, t: g.t }; g.sfx('wrong'); g.sfx('thud'); return; }
        if (needCool && sd.id !== 'heat') return;
        s.act = { id: sd.id, t0: g.t }; g.sfx('swoosh'); return;
      }
      if (!s.out && pathNear(p, FIRE.x, FIRE.y - 30, 60)) { s.fan = g.t; g.sfx('wind'); g.sfx('fire'); }
    },
    update(g, dt) {
      const s = g.s, A = s.act;
      if (A) {
        const k = g.t - A.t0;
        if (k > 0.45 && !A.hit) { A.hit = true; s.broken[A.id] = s.broken[A.id] || g.t; s.used[A.id] = true;
          g.sfx(A.id === 'heat' ? 'splash' : A.id === 'air' ? 'crunch' : 'rustle'); if (A.id === 'heat') g.sfx('sweep');
          if (s.out && A.id === 'heat') s.coolT = g.t; }
        if (k > 0.45) s.fire = Math.max(0, s.fire - dt * 2.2);
        if (k > 0.95) { s.act = null; if (!s.out) { s.out = g.t; s.ember = g.level >= 2 && A.id !== 'heat' ? 1 : 0.4; if (g.level >= 2 && A.id === 'heat') s.ember = 1; } }
      }
      if (s.fan) { s.fire = Math.min(1.9, s.fire + dt * 2.5); s.mallow = Math.min(1, s.mallow + dt * 1.6); if (g.t - s.fan > 0.9 && !g.done) { g.sfx('laugh'); g.fail(); } }
      if (!s.out && !s.act && !s.fan && g.level >= 2 && g.t - s.litT > 3.2 && !g.done) { s.fan = g.t; g.sfx('fire'); } // left too long, it spreads
      if (s.out) {
        if (s.k + 1 < s.n) { if (g.t - s.out > 0.6) { s.k++; s.fire = 1; s.broken = {}; s.out = 0; s.ember = 0; s.litT = g.t; s.lightT = g.t; g.sfx('fire'); g.sfx('whoosh'); } }
        else if (!g.done && g.t - s.out > 0.3) { g.win(); g.sfx('cheer'); }
        else if (s.coolT) { s.ember = Math.max(0, s.ember - dt * 1.5); if (!g.done && g.t - s.coolT > 0.6) { g.win(); g.sfx('cheer'); } }
        else { s.ember = Math.min(1.3, s.ember + dt * 0.25); s.relit = SK.clamp((g.t - s.out - 0.6) / 2.4, 0, 1); if (s.relit > 0) s.fire = Math.max(s.fire, s.relit * 0.6); if (s.relit >= 1 && !g.done) { g.sfx('fire'); g.fail(); } }
      }
    },
    draw(g, c) {
      const s = g.s, t = g.t, A = s.act;
      c.drawImage(g.bake('smother_bg', paintBg), 0, 0, 360, 640);
      const fk = s.fire;
      B3.glow(c, FIRE.x, FIRE.y - 20, 150 * (0.3 + 0.7 * Math.min(1.4, fk)), '255,140,60', 0.35);
      // the triangle: three glowing sides, the broken one gone
      for (const sd of SIDES) { if (s.broken[sd.id] && sd.id !== 'heat') continue; if (sd.id === 'heat' && s.broken.heat && !(false)) continue;
        const [ax, ay] = V[sd.a], [bx, by] = V[sd.b], hot = sd.id === 'air' && s.fan ? 1 : 0, relit = sd.id === 'heat' && false;
        c.save(); c.lineCap = 'round'; c.strokeStyle = sd.col; c.globalAlpha = relit ? 0.35 + 0.5 * Math.min(1, s.relit * 2 + 0.3) : 0.85; c.lineWidth = 8 + hot * 6 + Math.sin(t * 4) * 1.5; c.shadowColor = sd.col; c.shadowBlur = 16 + hot * 20; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); c.restore(); }
      // broken sides fly apart as two stubs
      for (const sd of SIDES) { const bt = s.broken[sd.id]; if (!bt) continue; const q = SK.clamp((t - bt) * 1.5, 0, 1); if (q >= 1) continue; const [ax, ay] = V[sd.a], [bx, by] = V[sd.b];
        c.save(); c.globalAlpha = 1 - q; c.strokeStyle = sd.col; c.lineWidth = 8; c.lineCap = 'round'; for (const [x0, y0, x1, y1] of [[ax, ay, (ax + bx) / 2, (ay + by) / 2], [(ax + bx) / 2, (ay + by) / 2, bx, by]]) { const mx = (x0 + x1) / 2 - FIRE.x, my = (y0 + y1) / 2 - FIRE.y; c.save(); c.translate(mx * q * 0.5, my * q * 0.5 + q * q * 60); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.restore(); } c.restore(); }
      // the campfire
      stones(c, false);
      logs(c, s.broken.fuel ? SK.easeOut((t - s.broken.fuel) * 3) : 0, t);
      if (s.broken.air) { const q = SK.clamp((t - s.broken.air) * 3, 0, 1); c.fillStyle = '#d8b878'; c.beginPath(); c.ellipse(FIRE.x, FIRE.y, 46 * q, 22 * q, 0, Math.PI, 0); c.fill(); c.fillStyle = 'rgba(255,240,200,0.4)'; c.beginPath(); c.ellipse(FIRE.x - 10, FIRE.y - 10 * q, 18 * q, 6 * q, 0, 0, 7); c.fill(); }
      if (s.ember > 0.02) { const e = Math.min(1, s.ember); for (let i = 0; i < 9; i++) { const x = FIRE.x - 30 + B3.hash(i) * 60, y = FIRE.y - 2 + B3.hash(i * 2) * 8, p = 0.6 + 0.4 * Math.sin(t * 5 + i * 1.7); c.fillStyle = `rgba(255,${80 + 80 * p | 0},40,${e * p})`; c.beginPath(); c.arc(x, y, 3 + B3.hash(i * 3) * 3, 0, 7); c.fill(); } B3.glow(c, FIRE.x, FIRE.y, 50, '255,90,40', 0.4 * e); }
      for (let i = 0; i < 3; i++) B3.flame(c, FIRE.x + (i - 1) * 20, FIRE.y + 2, (i === 1 ? 1.6 : 1.1) * (0.5 + 0.5 * Math.min(1.5, fk)), t, Math.min(1.4, fk), i * 1.9);
      if (s.out || (A && A.hit)) B3.smoke(c, FIRE.x, FIRE.y - 10, t, Math.max(0.3, 1 - fk), '150,140,150', 7, 160);
      stones(c, true);
      if (s.fan) for (let i = 0; i < 10; i++) { const q = ((t - s.fan) * 1.5 + i / 10) % 1; c.fillStyle = `rgba(255,${200 - q * 120 | 0},80,${1 - q})`; c.beginPath(); c.arc(FIRE.x + Math.sin(i * 2.3 + t * 3) * 30 * q, FIRE.y - 60 - q * 150, 3, 0, 7); c.fill(); }
      // the side pictures
      for (const sd of SIDES) { const bt = s.broken[sd.id]; const relit = sd.id === 'heat' && false; icon(c, sd, t, 1, bt && !relit ? SK.clamp((t - bt) * 1.5, 0, 1) : 0); }
      for (const sd of SIDES) if (s.used[sd.id] && !s.broken[sd.id]) { const w = s.dud && s.dud.id === sd.id ? Math.sin((t - s.dud.t) * 40) * 6 * Math.max(0, 1 - (t - s.dud.t) * 2) : 0;
        c.save(); c.translate(sd.x + w, sd.y); c.fillStyle = 'rgba(30,14,36,0.62)'; c.beginPath(); c.arc(0, 0, 28, 0, 7); c.fill(); c.strokeStyle = 'rgba(200,190,200,0.8)'; c.lineWidth = 3; c.setLineDash([5, 5]); c.beginPath(); c.arc(0, 0, 31, 0, 7); c.stroke(); c.restore(); }
      for (let i = 0; i < s.n; i++) { const x = 26 + i * 28, y = 150, done = i < s.k || (i === s.k && s.out); if (done) { c.fillStyle = 'rgba(150,140,150,0.8)'; c.beginPath(); c.arc(x, y, 8, 0, 7); c.fill(); } else B3.flame(c, x, y + 9, 0.3, t, 1, i); }
      if (t - s.lightT < 0.5) { c.fillStyle = `rgba(255,200,120,${0.5 * (1 - (t - s.lightT) * 2)})`; c.fillRect(0, 0, 360, 640); }
      // the tool that does the job, flying in
      if (A) { const k = SK.clamp((t - A.t0) / 0.45, 0, 1), e = SK.easeInOut(k);
        if (A.id === 'heat') { const x = SK.lerp(30, FIRE.x - 46, e), y = SK.lerp(250, FIRE.y - 90, e); c.save(); c.translate(x, y); c.rotate(e * 1.6); c.fillStyle = '#8aa0b8'; c.beginPath(); c.moveTo(-18, -20); c.lineTo(18, -20); c.lineTo(13, 18); c.lineTo(-13, 18); c.closePath(); c.fill(); c.strokeStyle = '#3a4a5a'; c.lineWidth = 2; c.stroke(); c.beginPath(); c.arc(0, -20, 18, Math.PI, 0); c.stroke(); c.restore();
          if (k >= 1) for (let i = 0; i < 18; i++) { const q = ((t - A.t0 - 0.45) * 2 + i / 18) % 1; c.fillStyle = `rgba(120,200,255,${0.9 - q * 0.6})`; c.beginPath(); c.arc(SK.lerp(FIRE.x - 30, FIRE.x + 10 * Math.sin(i), q), FIRE.y - 80 + q * q * 80, 4, 0, 7); c.fill(); } }
        if (A.id === 'air') { const x = SK.lerp(330, FIRE.x + 40, e), y = SK.lerp(250, FIRE.y - 70, e); c.save(); c.translate(x, y); c.rotate(-0.6 - e * 0.9); c.fillStyle = '#7a5030'; c.fillRect(-3, -60, 6, 54); c.fillStyle = '#9aa8b8'; c.beginPath(); c.moveTo(-16, -6); c.lineTo(16, -6); c.quadraticCurveTo(16, 20, 0, 26); c.quadraticCurveTo(-16, 20, -16, -6); c.fill(); c.strokeStyle = '#4a5a6a'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#d8b878'; c.beginPath(); c.ellipse(0, 0, 14, 7, 0, 0, 7); c.fill(); c.restore();
          if (k >= 1) for (let i = 0; i < 20; i++) { const q = ((t - A.t0 - 0.45) * 2.5 + i / 20) % 1; c.fillStyle = '#d8b878'; c.fillRect(FIRE.x + 30 - q * 30 + Math.sin(i) * 12, FIRE.y - 60 + q * 60, 3, 3); } }
        if (A.id === 'fuel') { const x = SK.lerp(180, FIRE.x, e), y = SK.lerp(560, FIRE.y + 20, e); c.save(); c.translate(x, y); c.fillStyle = '#7a5030'; c.fillRect(-3, 0, 6, 70); c.fillStyle = '#6a7a8a'; c.fillRect(-26, -4, 52, 6); for (let i = 0; i < 7; i++) c.fillRect(-25 + i * 8, -14, 3, 12); c.restore(); }
      }
      // the fox with a marshmallow on a stick
      const won = g.result === 'win', lost = g.result === 'fail';
      const hn = SK.animal(c, 'fox', 70, 604, 1, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost || s.fan ? 'wow' : 'happy' });
      { const hx = hn ? hn.hands[1].x : 96, hy = hn ? hn.hands[1].y : 570, mx = 140, my = FIRE.y - 34; c.strokeStyle = '#8a6040'; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(hx, hy); c.lineTo(mx, my); c.stroke();
        const m = s.mallow; c.fillStyle = P.mix('#fff6ea', '#2a1a1a', m); c.strokeStyle = P.mix('#d8c8b0', '#100808', m); c.lineWidth = 2; c.beginPath(); c.roundRect(mx - 9, my - 12, 18, 20, 6); c.fill(); c.stroke();
        if (m > 0.5) B3.smoke(c, mx, my - 12, t, m, '60,50,60', 4, 50); }
      // guidance
      if (!A && !s.out && !s.fan) SK.glow(c, g, SIDES[2].x, SIDES[2].y, 32);
      if (false && !A) SK.glow(c, g, SIDES[0].x, SIDES[0].y, 32, '#ffe27a', { level: 2 });
      if (s.path && s.path.length > 1) { c.save(); c.strokeStyle = 'rgba(255,246,234,0.6)'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(s.path[0].x, s.path[0].y); for (const p of s.path) c.lineTo(p.x, p.y); c.stroke(); c.restore(); }
      SK.demo(g, c, 'swipe', [148, 432], [212, 512]);
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.act || s.out || s.fan) return;
      const P0 = [[[148, 432], [212, 512]], [[218, 296], [282, 350]], [[78, 300], [146, 350]]][s.k], B = s._b = s._b || {};
      if (B[s.k] || g.t < Math.max(1.0, s.litT + 0.45)) return; B[s.k] = 1;
      synth('down', P0[0][0], P0[0][1]); synth('move', (P0[0][0] + P0[1][0]) / 2, (P0[0][1] + P0[1][1]) / 2); synth('up', P0[1][0], P0[1][1]);
    },
  });
})();
