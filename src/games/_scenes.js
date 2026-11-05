// _scenes.js — reusable scenery for microgames (global SCN), so a new microgame can be mostly its problem, its moves
// and its card. Not every microgame needs a bespoke world: pick a scene, a panel style for the math, and a host animal.
//   SCN.bg(g, c, scene)            paints a baked backdrop plus gentle ambient motion
//   SCN.panel(c, style, cx, cy, w, h, t)   a surface to write the math on: 'chalk' | 'glass' | 'paper' | 'sign' | 'none'
//   SCN.ink(style)                 the ink colour that reads on that panel (pass it to MK.place(..., { col }))
//   SCN.host(g, c, kind, x, y, s)  an ANI animal that hops on each move, cheers on a win and droops on a miss
//   SCN.std(g, c, o)               all of the above in one call: { scene, panel, host, hostX, hostY, hostS, panelY, panelH }
// Scenes: meadow, dusk, night, reef, snow, desert, forest, beach, space, city, kitchen, library. Each has its own palette.
const SCN = (() => {
  const W = 360, H = 640;
  const rng = seed => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const SC = {
    meadow: { sky: ['#6ab8e8', '#b8e2f2', '#fff2cc'], sun: { x: 290, y: 130, r: 26, color: '#fff4c8', glow: 180 }, ground: ['#9ad070', '#6aa048'], amb: 'clouds' },
    dusk: { sky: ['#2a2a6a', '#8a4a8a', '#f2a066'], sun: { x: 90, y: 420, r: 30, color: '#ffd8a0', glow: 220 }, ground: ['#4a3a6a', '#2a2048'], amb: 'fireflies' },
    night: { sky: ['#0c1030', '#1e2458', '#3a3a7a'], ground: ['#1e2a3a', '#101826'], amb: 'stars' },
    reef: { water: ['#1a6a9a', '#0c3a6a', '#062448'], amb: 'bubbles' },
    snow: { sky: ['#6a8ac8', '#a8c4e8', '#e8f2fa'], ground: ['#f2f6fa', '#c8d8e8'], amb: 'snow' },
    desert: { sky: ['#f0a070', '#f8c890', '#fff0d0'], sun: { x: 270, y: 300, r: 34, color: '#fff0c0', glow: 200 }, ground: ['#e8b870', '#c08848'], amb: 'heat' },
    forest: { sky: ['#8ac0a0', '#c8e0c0', '#f0f4d8'], ground: ['#4a7a40', '#2e5a2e'], amb: 'leaves' },
    beach: { sky: ['#4ab0e8', '#9ad8f0', '#fff4dc'], sun: { x: 300, y: 110, r: 24, color: '#fffbe0', glow: 160 }, ground: ['#f2dca8', '#e0c080'], amb: 'gulls' },
    space: { sky: ['#05040f', '#120c30', '#2a1450'], amb: 'stars' },
    city: { sky: ['#f6a87a', '#f8c8a0', '#fde8d0'], ground: ['#7a6a8a', '#4a3a5a'], amb: 'birds' },
    kitchen: { wall: ['#fff2dc', '#f6d8b0'], amb: 'steam' },
    library: { wall: ['#6a3a2a', '#4a2418'], amb: 'dust' },
  };
  // ---------------- backdrops (baked once per scene) ----------------
  function paint(c, name) {
    const s = SC[name] || SC.meadow, R = rng(name.length * 977 + 13);
    if (s.water) {
      const g = c.createLinearGradient(0, 0, 0, H); s.water.forEach((col, i) => g.addColorStop(i / (s.water.length - 1), col)); c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 7; i++) { const x = 30 + i * 52 + R() * 20; const gr = c.createLinearGradient(x, 0, x + 60, H * 0.7); gr.addColorStop(0, 'rgba(160,230,255,0.14)'); gr.addColorStop(1, 'rgba(160,230,255,0)'); c.fillStyle = gr; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 26, 0); c.lineTo(x + 90, H * 0.7); c.lineTo(x + 40, H * 0.7); c.fill(); } c.restore();
      c.fillStyle = '#d8c090'; c.beginPath(); c.moveTo(0, 590); for (let x = 0; x <= W; x += 20) c.lineTo(x, 586 + Math.sin(x * 0.05) * 6); c.lineTo(W, H); c.lineTo(0, H); c.fill();
      for (let i = 0; i < 9; i++) { const x = R() * W, h = 40 + R() * 70; c.strokeStyle = ['#2e8a5a', '#4aa86a', '#d86a8a'][i % 3]; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, 600); c.quadraticCurveTo(x + 14, 600 - h / 2, x - 4, 600 - h); c.stroke(); }
      return;
    }
    if (s.wall) {
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, s.wall[0]); g.addColorStop(1, s.wall[1]); c.fillStyle = g; c.fillRect(0, 0, W, H);
      if (name === 'kitchen') { c.fillStyle = 'rgba(255,255,255,0.35)'; for (let y = 470; y < H; y += 26) for (let x = (y / 26) % 2 ? 0 : 13; x < W; x += 26) c.fillRect(x, y, 24, 24); c.fillStyle = '#c88a5a'; c.fillRect(0, 456, W, 16); c.fillStyle = '#a8683a'; c.fillRect(0, 472, W, 6);
        c.fillStyle = '#8ad0e8'; c.fillRect(250, 40, 90, 110); c.strokeStyle = '#fff6ea'; c.lineWidth = 6; c.strokeRect(250, 40, 90, 110); c.beginPath(); c.moveTo(295, 40); c.lineTo(295, 150); c.moveTo(250, 95); c.lineTo(340, 95); c.stroke(); }
      else { for (let row = 0; row < 3; row++) { const y = 470 + row * 56; c.fillStyle = '#3a1a10'; c.fillRect(0, y + 44, W, 10); for (let x = 4; x < W; ) { const w = 10 + R() * 12, h = 30 + R() * 14; c.fillStyle = ['#a83a3a', '#3a6aa8', '#c8a03a', '#4a8a5a', '#8a4a9a'][Math.floor(R() * 5)]; c.fillRect(x, y + 44 - h, w, h); c.fillStyle = 'rgba(255,255,255,0.18)'; c.fillRect(x + 2, y + 50 - h, w - 4, 3); x += w + 2; } } }
      return;
    }
    P.sky(c, W, H, s.sky, s.sun);
    if (name === 'night' || name === 'space') { for (let i = 0; i < 140; i++) { c.fillStyle = `rgba(255,255,240,${0.3 + R() * 0.6})`; c.beginPath(); c.arc(R() * W, R() * H * (name === 'space' ? 1 : 0.7), R() * 1.4 + 0.3, 0, 7); c.fill(); }
      if (name === 'night') { c.fillStyle = '#fff6d8'; c.beginPath(); c.arc(286, 120, 24, 0, 7); c.fill(); c.fillStyle = s.sky[1]; c.beginPath(); c.arc(276, 112, 22, 0, 7); c.fill(); }
      else { const pl = c.createRadialGradient(70, 520, 10, 70, 560, 160); pl.addColorStop(0, '#d88a5a'); pl.addColorStop(1, '#5a2a4a'); c.fillStyle = pl; c.beginPath(); c.arc(70, 600, 150, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,220,180,0.5)'; c.lineWidth = 4; c.beginPath(); c.ellipse(70, 600, 210, 34, -0.2, Math.PI * 1.05, Math.PI * 1.95); c.stroke(); } }
    if (name === 'city') { for (let i = 0; i < 14; i++) { const x = i * 28 - 6, h = 80 + R() * 160; c.fillStyle = i % 2 ? '#8a6a8a' : '#7a5a7a'; c.fillRect(x, 470 - h, 26, h); c.fillStyle = 'rgba(255,230,160,0.7)'; for (let y = 480 - h; y < 460; y += 14) for (let k = 0; k < 2; k++) if (R() < 0.5) c.fillRect(x + 4 + k * 10, y, 6, 7); } }
    if (s.ground) {
      if (name === 'desert') { P.hills(c, W, 470, 40, '#e8b070', '#c88848', { seed: 3, dabs: 40 }); }
      else if (name !== 'night' && name !== 'city') P.hills(c, W, 450, 46, P.shade(s.ground[0], 0.1), s.ground[1], { seed: 3, dabs: 60 });
      P.hills(c, W, 520, 30, s.ground[0], P.shade(s.ground[1], -0.1), { seed: 9, dabs: 80 });
      if (name === 'meadow') { P.flowers(c, W, 540, 640, 26, undefined, 5); P.tree(c, 40, 470, 0.8); P.tree(c, 325, 462, 0.7); }
      if (name === 'forest') { for (let i = 0; i < 6; i++) P.tree(c, 20 + i * 66, 500 + (i % 2) * 14, 1.1 - (i % 3) * 0.15, ['#3e6a3a', '#4a7a40', '#2e5a32'][i % 3], i + 2); }
      if (name === 'desert') { for (const [x, s2] of [[50, 0.8], [318, 0.6]]) { c.fillStyle = '#4a8a4a'; c.fillRect(x - 8 * s2, 500 - 70 * s2, 16 * s2, 70 * s2); c.fillRect(x - 26 * s2, 470 - 30 * s2, 10 * s2, 34 * s2); c.fillRect(x - 26 * s2, 494 - 10 * s2, 26 * s2, 8 * s2); } }
      if (name === 'snow') { c.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 5; i++) { const x = 30 + i * 80; c.beginPath(); c.moveTo(x - 30, 470); c.lineTo(x, 400 - (i % 2) * 30); c.lineTo(x + 30, 470); c.fill(); } }
      if (name === 'dusk') { for (let i = 0; i < 22; i++) { const x = R() * W; c.strokeStyle = '#1a1430'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, 600); c.lineTo(x + (R() - 0.5) * 16, 520 - R() * 50); c.stroke(); } }
    }
    if (name === 'beach') { P.water(c, W, 430, 520, '#2a8ac0', '#7ad0e8', 0); c.fillStyle = '#f2dca8'; c.fillRect(0, 520, W, 120); c.fillStyle = 'rgba(255,255,255,0.7)'; c.fillRect(0, 516, W, 6); P.palm && P.palm(c, 330, 600, 0.9); }
  }
  // ---------------- ambient motion ----------------
  function ambient(g, c, name) {
    const s = SC[name] || SC.meadow, t = g.t, R = rng(7);
    switch (s.amb) {
      case 'clouds': for (let i = 0; i < 3; i++) P.cloud(c, ((t * (6 + i * 3) + i * 140) % 460) - 50, 70 + i * 50, 0.5 + i * 0.12, '#fffaf0', '#d8e8f2', 0.9); break;
      case 'stars': for (let i = 0; i < 30; i++) { const x = R() * W, y = R() * 420, a = 0.4 + 0.6 * Math.abs(Math.sin(t * (1 + R() * 2) + i)); c.fillStyle = `rgba(255,255,230,${a})`; c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); } break;
      case 'fireflies': case 'dust': for (let i = 0; i < 18; i++) { const x = (R() * W + Math.sin(t * 0.7 + i) * 20), y = (R() * 560 + 60 + Math.cos(t * 0.5 + i * 2) * 14), a = 0.3 + 0.6 * Math.abs(Math.sin(t * 2 + i)); c.fillStyle = s.amb === 'dust' ? `rgba(255,230,180,${a * 0.5})` : `rgba(230,255,140,${a})`; c.beginPath(); c.arc(x, y, s.amb === 'dust' ? 1.5 : 2.4, 0, 7); c.fill(); } break;
      case 'bubbles': for (let i = 0; i < 16; i++) { const x = R() * W + Math.sin(t + i) * 6, y = H - ((t * (20 + R() * 30) + R() * H) % H); c.strokeStyle = 'rgba(200,240,255,0.55)'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, 2 + R() * 4, 0, 7); c.stroke(); } break;
      case 'snow': for (let i = 0; i < 40; i++) { const x = (R() * W + Math.sin(t + i) * 12 + t * 8) % W, y = (R() * H + t * (20 + R() * 25)) % H; c.fillStyle = 'rgba(255,255,255,0.85)'; c.beginPath(); c.arc(x, y, 1.2 + R() * 1.8, 0, 7); c.fill(); } break;
      case 'leaves': for (let i = 0; i < 10; i++) { const x = (R() * W + t * 14 + Math.sin(t + i) * 20) % W, y = (R() * H + t * 30) % H; c.save(); c.translate(x, y); c.rotate(t * 2 + i); c.fillStyle = ['#e8a040', '#c8603a', '#a8b040'][i % 3]; c.beginPath(); c.ellipse(0, 0, 5, 2.5, 0, 0, 7); c.fill(); c.restore(); } break;
      case 'gulls': case 'birds': for (let i = 0; i < 3; i++) { const x = ((t * (18 + i * 5) + i * 120) % 440) - 40, y = 80 + i * 26 + Math.sin(t * 2 + i) * 6, f = Math.sin(t * 8 + i) * 4; c.strokeStyle = '#3a3040'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 8, y - f); c.quadraticCurveTo(x - 4, y - 4, x, y); c.quadraticCurveTo(x + 4, y - 4, x + 8, y - f); c.stroke(); } break;
      case 'heat': c.fillStyle = `rgba(255,240,200,${0.05 + 0.03 * Math.sin(t * 3)})`; c.fillRect(0, 420, W, 100); break;
      case 'steam': for (let i = 0; i < 6; i++) { const k = ((t * 0.4 + i / 6) % 1); c.fillStyle = `rgba(255,255,255,${0.35 * (1 - k)})`; c.beginPath(); c.arc(60 + Math.sin(t + i) * 10, 450 - k * 120, 8 + k * 14, 0, 7); c.fill(); } break;
    }
  }
  function bg(g, c, name) { c.drawImage(g.bake('scn_' + name, cc => paint(cc, name)), 0, 0, W, H); ambient(g, c, name); }

  // ---------------- panels for the math ----------------
  const INK = { chalk: '#fbf8ee', glass: '#2a1840', paper: '#2a2440', sign: '#fff4dc', none: '#fff6e0', dark: '#2a1840' };
  function ink(style) { return INK[style] || INK.glass; }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function panel(c, style, cx, cy, w, h, t = 0) {
    const x = cx - w / 2, y = cy - h / 2; c.save();
    if (style === 'chalk') {
      c.fillStyle = 'rgba(20,10,10,0.3)'; rr(c, x + 4, y + 8, w, h, 10); c.fill();
      c.fillStyle = '#8a5a34'; rr(c, x - 8, y - 8, w + 16, h + 16, 12); c.fill();
      const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#2f5a48'); g.addColorStop(1, '#244a3a'); c.fillStyle = g; rr(c, x, y, w, h, 6); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.05)'; for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(x + w * (0.2 + i * 0.16), y + h * 0.5, 40, 12, 0.3, 0, 7); c.fill(); }
      c.fillStyle = '#f4f0e0'; c.fillRect(x + w - 40, y + h + 2, 22, 5);
    } else if (style === 'glass') {
      c.fillStyle = 'rgba(20,10,40,0.18)'; rr(c, x + 3, y + 6, w, h, 20); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.72)'; rr(c, x, y, w, h, 20); c.fill(); c.strokeStyle = 'rgba(255,255,255,0.95)'; c.lineWidth = 2; c.stroke();
      const g = c.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, 'rgba(255,255,255,0.4)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); c.fillStyle = g; rr(c, x, y, w, h, 20); c.fill();
    } else if (style === 'paper') {
      c.fillStyle = 'rgba(40,20,30,0.22)'; c.translate(cx, cy); c.rotate(-0.012); c.fillRect(-w / 2 + 4, -h / 2 + 6, w, h);
      c.fillStyle = '#fffdf4'; c.fillRect(-w / 2, -h / 2, w, h); c.strokeStyle = 'rgba(80,140,200,0.25)'; c.lineWidth = 1; for (let yy = -h / 2 + 22; yy < h / 2; yy += 22) { c.beginPath(); c.moveTo(-w / 2, yy); c.lineTo(w / 2, yy); c.stroke(); }
      c.strokeStyle = 'rgba(220,80,80,0.35)'; c.beginPath(); c.moveTo(-w / 2 + 26, -h / 2); c.lineTo(-w / 2 + 26, h / 2); c.stroke();
      c.fillStyle = 'rgba(255,220,120,0.7)'; c.fillRect(-26, -h / 2 - 8, 52, 16);
    } else if (style === 'sign') {
      c.fillStyle = 'rgba(30,15,5,0.3)'; rr(c, x + 4, y + 7, w, h, 12); c.fill();
      const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#a8703f'); g.addColorStop(1, '#6e4524'); c.fillStyle = g; rr(c, x, y, w, h, 12); c.fill();
      c.strokeStyle = 'rgba(50,25,8,0.35)'; c.lineWidth = 1.5; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(x + 10, y + k * h / 4); c.bezierCurveTo(x + w * 0.3, y + k * h / 4 + 3, x + w * 0.7, y + k * h / 4 - 3, x + w - 10, y + k * h / 4); c.stroke(); }
      c.fillStyle = '#d8c090'; for (const px of [x + 12, x + w - 12]) { c.beginPath(); c.arc(px, y + 12, 3.5, 0, 7); c.fill(); }
    }
    c.restore();
  }
  // ---------------- the host animal ----------------
  function host(g, c, kind, x, y, s = 1.4) {
    const M = g.s.mk || {}, hop = M.lastMove != null && g.t - M.lastMove < 0.35 ? Math.sin((g.t - M.lastMove) / 0.35 * Math.PI) : 0;
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail';
    try { if (typeof ANI !== 'undefined') return ANI.draw(c, kind, x, y - hop * 26, s, { t: g.t, pose: won ? 'cheer' : hop > 0 ? 'hop' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'happy' }); } catch (e) { }
    P.sheep(c, x, y - hop * 26, s * 0.8, { t: g.t });
  }
  // everything at once: backdrop, panel behind the math, host. Returns the ink colour for the panel.
  function std(g, c, o = {}) {
    bg(g, c, o.scene || 'meadow');
    if (o.panel !== 'none') panel(c, o.panel || 'glass', 180, o.panelY || 285, o.panelW || 336, o.panelH || 200, g.t);
    if (o.host) host(g, c, o.host, o.hostX ?? 70, o.hostY ?? 590, o.hostS ?? 1.3);
    return ink(o.panel || 'glass');
  }
  return { bg, panel, ink, host, std, scenes: Object.keys(SC), paint };
})();
