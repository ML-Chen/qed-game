// STOP THE FIRE! (chem_bio FP-01, row command SMOTHER!) — a campfire in a night clearing, inside a glowing fire triangle
// whose three sides are pictures: logs (fuel), a flame (heat) and a puff of air (oxygen). Drag a tool onto the fire:
// the bucket of water cools it (the heat side breaks), the bucket of sand smothers it (the air side breaks), the rake
// pulls the logs apart (the fuel side breaks). The flames shrink to smoke. The bellows is the trap: it blows in more
// air, the flames leap and the fox's marshmallow burns to charcoal.
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
  const TOOLS = { heat: { x: 40, y: 262 }, air: { x: 320, y: 262 }, fuel: { x: 286, y: 552 }, fan: { x: 188, y: 560 } };
  // a tool at (x, y); spent tools are empty or broken
  function tool(c, id, x, y, rot, spent, t) {
    c.save(); c.translate(x, y); c.rotate(rot || 0);
    if (id === 'heat' || id === 'air') { const body = id === 'heat' ? '#8aa0b8' : '#d8503a', edge = id === 'heat' ? '#3a4a5a' : '#6a1a10';
      c.fillStyle = body; c.strokeStyle = edge; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-20, -18); c.lineTo(20, -18); c.lineTo(15, 20); c.lineTo(-15, 20); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.arc(0, -18, 20, Math.PI, 0); c.stroke(); c.fillStyle = 'rgba(255,255,255,0.3)'; c.fillRect(-14, -12, 5, 26);
      if (!spent) { c.fillStyle = id === 'heat' ? '#5ab0f0' : '#e8c880'; c.beginPath(); c.ellipse(0, -18, 19, 5, 0, 0, 7); c.fill(); if (id === 'heat') { c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.ellipse(-6, -19, 6, 1.5, 0, 0, 7); c.fill(); } }
      else { c.fillStyle = 'rgba(20,10,20,0.6)'; c.beginPath(); c.ellipse(0, -18, 19, 5, 0, 0, 7); c.fill(); } }
    if (id === 'fuel') { c.rotate(-1.2); c.fillStyle = '#8a5a30'; c.fillRect(-3, -4, 6, spent ? 34 : 74); if (spent) { c.save(); c.translate(0, 44); c.rotate(0.7); c.fillRect(-3, 0, 6, 30); c.restore(); }
      c.fillStyle = '#7a8a9a'; c.fillRect(-26, -8, 52, 6); for (let i = 0; i < 7; i++) c.fillRect(-25 + i * 8, -20, 3, 13); }
    if (id === 'fan') { c.fillStyle = '#b8803a'; c.strokeStyle = '#5a3a14'; c.lineWidth = 2; c.beginPath(); c.moveTo(-26, -16); c.quadraticCurveTo(-34, 0, -26, 16); c.lineTo(10, 6); c.lineTo(10, -6); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#7a4a20'; c.fillRect(10, -4, 18, 8); c.fillStyle = '#5a3a14'; c.fillRect(-40, -18, 14, 5); c.fillRect(-40, 13, 14, 5);
      c.strokeStyle = 'rgba(90,58,20,0.6)'; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-22 + i * 7, -12 + i * 2); c.lineTo(-22 + i * 7, 12 - i * 2); c.stroke(); } }
    c.restore();
  }
  MG.add({
    id: 'smother', stage: 'fire', cmd: 'PUT OUT EACH CAMPFIRE!', time: 6, mood: 'storm', winText: 'No heat, air or fuel: out!', failText: 'More air, bigger fire!',
    card: { title: 'The fire triangle', kind: 'Chemistry', ref: 'The fire triangle (combustion)',
      text: 'A fire needs three things at the same time: fuel to burn, heat, and oxygen from the air. These are the three sides of the fire triangle. Take away any one side and the fire goes out.\n\nRaking the logs apart takes away the fuel. Sand over the fire smothers it: it keeps the air out. Water cools the fire until it is too cold to keep burning. Bellows do the opposite: they blow in more oxygen, so the flames grow.\n\nEmbers can stay hot for hours and start a fire again. Put out a campfire with an adult, and keep cooling and stirring it until it feels cold.',
      note: 'Fire needs fuel, heat and oxygen at once. Remove any one and it goes out.' },
    init(g) { const s = g.s; s.fire = 1; s.broken = {}; s.act = null; s.ember = 0; s.fan = 0; s.out = 0; s.mallow = 0; s.n = g.level >= 1 ? 3 : 2; s.k = 0; s.used = {}; s.litT = 0; s.dud = null; s.lightT = -9;
      const v = s.v = SK.variant(g, 4), SPOTS = [[40, 262], [320, 262], [286, 552], [188, 560]], ORD = [['heat', 'air', 'fuel', 'fan'], ['air', 'heat', 'fan', 'fuel'], ['fan', 'fuel', 'heat', 'air'], ['fuel', 'fan', 'air', 'heat']][v];
      s.tools = ORD.map((id, i) => ({ id, x: SPOTS[i][0], y: SPOTS[i][1], hx: SPOTS[i][0], hy: SPOTS[i][1] })); s.order = [['fuel', 'air', 'heat'], ['air', 'heat', 'fuel'], ['heat', 'fuel', 'air'], ['fuel', 'heat', 'air']][v]; },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.act || s.out || s.fan) return; const tl = SK.pick(s.tools, x, y, 48); if (!tl) return;
      if (s.used[tl.id]) { s.dud = { id: tl.id, t: g.t }; g.sfx('wrong'); g.sfx('thud'); return; } SK.dragStart(g, tl, x, y); g.sfx('tap'); },
    move(g, x, y) { SK.dragMove(g, x, y); },
    up(g) {
      const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj || g.done) return; const tl = d.obj;
      if (SK.dist(tl.x, tl.y, FIRE.x, FIRE.y - 20) < 100 && !s.out && !s.act) {
        if (tl.id === 'fan') { s.fan = g.t; s.fanTool = { x: tl.x, y: tl.y }; g.sfx('wind'); g.sfx('fire'); tl.back = true; return; }
        s.act = { id: tl.id, t0: g.t, x0: tl.x, y0: tl.y }; tl.hidden = true; g.sfx('swoosh');
      } else tl.back = true;
    },
    update(g, dt) {
      const s = g.s, A = s.act;
      for (const tl of s.tools) if (tl.back && !SK.dragging(g)) { tl.x += (tl.hx - tl.x) * Math.min(1, dt * 12); tl.y += (tl.hy - tl.y) * Math.min(1, dt * 12); if (SK.dist(tl.x, tl.y, tl.hx, tl.hy) < 1) tl.back = false; }
      if (A) {
        const k = g.t - A.t0;
        if (k > 0.45 && !A.hit) { A.hit = true; s.broken[A.id] = s.broken[A.id] || g.t; s.used[A.id] = true; g.sfx(A.id === 'heat' ? 'splash' : A.id === 'air' ? 'crunch' : 'rustle'); if (A.id === 'heat') g.sfx('sweep'); }
        if (k > 0.45) s.fire = Math.max(0, s.fire - dt * 2.2);
        if (k > 0.95) { s.act = null; const tl = s.tools.find(t => t.id === A.id); tl.hidden = false; tl.x = A.x0; tl.y = A.y0; tl.back = true; if (!s.out) { s.out = g.t; s.ember = 0.4; } }
      }
      if (s.fan) { s.fire = Math.min(1.9, s.fire + dt * 2.5); s.mallow = Math.min(1, s.mallow + dt * 1.6); if (g.t - s.fan > 0.9 && !g.done) { g.sfx('laugh'); g.fail(); } }
      if (!s.out && !s.act && !s.fan && g.level >= 2 && g.t - s.litT > 3.4 && !g.done) { s.fan = g.t; g.sfx('fire'); } // left too long, it spreads
      if (s.out) {
        if (s.k + 1 < s.n) { if (g.t - s.out > 0.6) { s.k++; s.fire = 1; s.broken = {}; s.out = 0; s.ember = 0; s.litT = g.t; s.lightT = g.t; g.sfx('fire'); g.sfx('whoosh'); } }
        else if (!g.done && g.t - s.out > 0.3) { g.win(); g.sfx('cheer'); }
      }
    },
    draw(g, c) {
      const s = g.s, t = g.t, A = s.act;
      c.drawImage(g.bake('smother_bg', paintBg), 0, 0, 360, 640);
      const fk = s.fire;
      B3.glow(c, FIRE.x, FIRE.y - 20, 150 * (0.3 + 0.7 * Math.min(1.4, fk)), '255,140,60', 0.35);
      // the triangle: three glowing sides, the broken one gone (the air side flares while the bellows blow)
      for (const sd of SIDES) { if (s.broken[sd.id]) continue; const [ax, ay] = V[sd.a], [bx, by] = V[sd.b], hot = sd.id === 'air' && s.fan ? 1 : 0;
        c.save(); c.lineCap = 'round'; c.strokeStyle = sd.col; c.globalAlpha = 0.85; c.lineWidth = 8 + hot * 6 + Math.sin(t * 4) * 1.5; c.shadowColor = sd.col; c.shadowBlur = 16 + hot * 20; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); c.restore(); }
      for (const sd of SIDES) { const bt = s.broken[sd.id]; if (!bt) continue; const q = SK.clamp((t - bt) * 1.5, 0, 1); if (q >= 1) continue; const [ax, ay] = V[sd.a], [bx, by] = V[sd.b];
        c.save(); c.globalAlpha = 1 - q; c.strokeStyle = sd.col; c.lineWidth = 8; c.lineCap = 'round'; for (const [x0, y0, x1, y1] of [[ax, ay, (ax + bx) / 2, (ay + by) / 2], [(ax + bx) / 2, (ay + by) / 2, bx, by]]) { const mx = (x0 + x1) / 2 - FIRE.x, my = (y0 + y1) / 2 - FIRE.y; c.save(); c.translate(mx * q * 0.5, my * q * 0.5 + q * q * 60); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.restore(); } c.restore(); }
      // the campfire
      stones(c, false);
      logs(c, s.broken.fuel ? SK.easeOut((t - s.broken.fuel) * 3) : 0, t);
      if (s.broken.air) { const q = SK.clamp((t - s.broken.air) * 3, 0, 1); c.fillStyle = '#d8b878'; c.beginPath(); c.ellipse(FIRE.x, FIRE.y, 46 * q, 22 * q, 0, Math.PI, 0); c.fill(); c.fillStyle = 'rgba(255,240,200,0.4)'; c.beginPath(); c.ellipse(FIRE.x - 10, FIRE.y - 10 * q, 18 * q, 6 * q, 0, 0, 7); c.fill(); }
      if (s.ember > 0.02) { const e = Math.min(1, s.ember); for (let i = 0; i < 9; i++) { const x = FIRE.x - 30 + B3.hash(i) * 60, y = FIRE.y - 2 + B3.hash(i * 2) * 8, p = 0.6 + 0.4 * Math.sin(t * 5 + i * 1.7); c.fillStyle = `rgba(255,${80 + 80 * p | 0},40,${e * p})`; c.beginPath(); c.arc(x, y, 3 + B3.hash(i * 3) * 3, 0, 7); c.fill(); } }
      for (let i = 0; i < 3; i++) B3.flame(c, FIRE.x + (i - 1) * 20, FIRE.y + 2, (i === 1 ? 1.6 : 1.1) * (0.5 + 0.5 * Math.min(1.5, fk)), t, Math.min(1.4, fk), i * 1.9);
      if (s.out || (A && A.hit)) B3.smoke(c, FIRE.x, FIRE.y - 10, t, Math.max(0.3, 1 - fk), '150,140,150', 7, 160);
      stones(c, true);
      if (s.fan) { for (let i = 0; i < 10; i++) { const q = ((t - s.fan) * 1.5 + i / 10) % 1; c.fillStyle = `rgba(255,${200 - q * 120 | 0},80,${1 - q})`; c.beginPath(); c.arc(FIRE.x + Math.sin(i * 2.3 + t * 3) * 30 * q, FIRE.y - 60 - q * 150, 3, 0, 7); c.fill(); }
        c.strokeStyle = 'rgba(220,240,255,0.7)'; c.lineWidth = 3; for (let i = 0; i < 3; i++) { const q = ((t - s.fan) * 3 + i / 3) % 1; c.beginPath(); c.moveTo(FIRE.x + 70 - q * 50, FIRE.y - 10 - i * 10); c.lineTo(FIRE.x + 50 - q * 50, FIRE.y - 10 - i * 10); c.stroke(); } }
      // the side pictures
      for (const sd of SIDES) { const bt = s.broken[sd.id]; icon(c, sd, t, 1, bt ? SK.clamp((t - bt) * 1.5, 0, 1) : 0); }
      for (let i = 0; i < s.n; i++) { const x = 26 + i * 28, y = 150, done = i < s.k || (i === s.k && s.out); if (done) { c.fillStyle = 'rgba(150,140,150,0.8)'; c.beginPath(); c.arc(x, y, 8, 0, 7); c.fill(); } else B3.flame(c, x, y + 9, 0.3, t, 1, i); }
      if (t - s.lightT < 0.5) { c.fillStyle = `rgba(255,200,120,${0.5 * (1 - (t - s.lightT) * 2)})`; c.fillRect(0, 0, 360, 640); }
      // the tools waiting (spent ones empty or broken), the one being dragged, the one at work
      for (const tl of s.tools) { if (tl.hidden) continue; const w = s.dud && s.dud.id === tl.id ? Math.sin((t - s.dud.t) * 40) * 6 * Math.max(0, 1 - (t - s.dud.t) * 2) : 0; tool(c, tl.id, tl.x + w, tl.y, tl.id === 'fan' && s.fan ? Math.sin(t * 20) * 0.1 : 0, s.used[tl.id], t); }
      if (A) { const k = SK.clamp((t - A.t0) / 0.45, 0, 1), e = SK.easeInOut(k);
        const to = A.id === 'heat' ? [FIRE.x - 46, FIRE.y - 90, 1.6] : A.id === 'air' ? [FIRE.x + 46, FIRE.y - 80, -1.6] : [FIRE.x + 10, FIRE.y + 10, 0];
        tool(c, A.id, SK.lerp(A.x0, to[0], e), SK.lerp(A.y0, to[1], e), to[2] * e, false, t);
        if (k >= 1 && A.id === 'heat') for (let i = 0; i < 18; i++) { const q = ((t - A.t0 - 0.45) * 2 + i / 18) % 1; c.fillStyle = `rgba(120,200,255,${0.9 - q * 0.6})`; c.beginPath(); c.arc(SK.lerp(FIRE.x - 30, FIRE.x + 10 * Math.sin(i), q), FIRE.y - 80 + q * q * 80, 4, 0, 7); c.fill(); }
        if (k >= 1 && A.id === 'air') for (let i = 0; i < 20; i++) { const q = ((t - A.t0 - 0.45) * 2.5 + i / 20) % 1; c.fillStyle = '#d8b878'; c.fillRect(FIRE.x + 30 - q * 30 + Math.sin(i) * 12, FIRE.y - 70 + q * 70, 3, 3); } }
      // the fox with a marshmallow on a stick
      const won = g.result === 'win', lost = g.result === 'fail';
      const hn = SK.animal(c, 'fox', 70, 604, 1, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost || s.fan ? 'wow' : 'happy' });
      { const hx = hn ? hn.hands[1].x : 96, hy = hn ? hn.hands[1].y : 570, mx = 140, my = FIRE.y - 34; c.strokeStyle = '#8a6040'; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(hx, hy); c.lineTo(mx, my); c.stroke();
        const m = s.mallow; c.fillStyle = P.mix('#fff6ea', '#2a1a1a', m); c.strokeStyle = P.mix('#d8c8b0', '#100808', m); c.lineWidth = 2; c.beginPath(); c.roundRect(mx - 9, my - 12, 18, 20, 6); c.fill(); c.stroke();
        if (m > 0.5) B3.smoke(c, mx, my - 12, t, m, '60,50,60', 4, 50); }
      // guidance: the next unused tool glows, and a dashed ring marks the fire as where it goes
      const nx = s.tools.find(tl => tl.id === s.order.find(id => !s.used[id])), busy = !!A || !!s.out || !!s.fan;
      if (nx && !busy && !SK.dragging(g)) { SK.grab(c, g, nx.x, nx.y, 34); SK.target(c, g, FIRE.x, FIRE.y - 20, 60); SK.arrow(c, g, nx.x, nx.y, FIRE.x, FIRE.y - 20, { from: 40, to: 80 }); }
      for (const sd of SIDES) if (!s.broken[sd.id]) SK.tag(c, { heat: 'Heat', air: 'Air', fuel: 'Fuel' }[sd.id], sd.x, sd.y + 44, 18);
      // the tools' names, so the scene says what each one is
      if (!g.done) for (const tl of s.tools) if (!tl.hidden && SK.dragging(g) !== tl && !tl.back) SK.tag(c, { heat: 'Water', air: 'Sand', fuel: 'Rake', fan: 'Bellows' }[tl.id], SK.clamp(tl.hx, 52, 308), tl.hy + 42, 18);
      SK.tag(c, `Fires out: ${s.k + (s.out ? 1 : 0)} / ${s.n}`, 190, 150, 18);
      SK.demo(g, c, 'drag', nx ? [nx.hx, nx.hy] : [180, 400], [FIRE.x, FIRE.y - 20], { never: !nx || busy });
    },
    // the bot drags the next unused tool (rake, then sand, then water) onto the fire
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 1.0) return; const B = s._b = s._b || {};
      if (B.job) { const J = B.job, k = Math.min(1, (g.t - J.t0) / 0.3); synth('move', SK.lerp(J.a[0], FIRE.x, k), SK.lerp(J.a[1], FIRE.y - 20, k)); if (k >= 1) { synth('up', FIRE.x, FIRE.y - 20); B.job = null; } return; }
      if (s.act || s.out || s.fan || g.t < s.litT + 0.45) return; const id = s.order.find(id => !s.used[id]), tl = s.tools.find(t => t.id === id); if (!tl || tl.back) return;
      B.job = { a: [tl.x, tl.y], t0: g.t }; synth('down', tl.x, tl.y);
    },
  });
})();
