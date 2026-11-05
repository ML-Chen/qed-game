// SKIM THE TIP OVER THE ATOMS! (physics PHY QP-09 TUNNEL!, as a scanning tunnelling microscope) — a sharp metal
// tip hangs over a row of big atoms. The gap between them is empty space that an electron doesn't have the energy to
// cross, yet now and then one appears on the far side: it tunnels. The thinner the gap, the more get through (each bit
// thinner multiplies the rate), so the current meter jumps when you drag the tip closer. Keep the current in the green
// band while the atoms slide past underneath, rising over each bump and dipping between them, and the screen draws a
// picture of the atoms. Hold the current in the band over each atom for a moment and the scan moves on to the next. Pull the tip away
// and no electrons cross; push it into an atom and the tip crunches.
// Level 0: four atoms; level 1: four, with a narrower band; level 2: five, narrower still. Between atoms the stage slides and
// the microscope backs the tip off, so each atom needs its own careful approach.
(() => {
  const TX = 180, AR = 37, SP = 66, BASE = 520, PIC = { x: 24, y: 140, w: 312, h: 84 }, MET = { x: 330, t: 300, b: 470 };
  const HTS = [[0, -14, 4, -8, 12, -4, 0, -10], [-10, 6, -16, 0, 8, -12, -2, 6], [6, -6, 10, -16, -2, 4, -12, 0], [-4, 10, -10, 2, -14, 8, -6, 4]];
  const LV = [{ n: 4, lo: 8, hi: 26 }, { n: 4, lo: 9, hi: 22 }, { n: 5, lo: 10, hi: 20 }], HOLD = 0.4, SLIDE = 0.45;
  const rateOf = gap => gap <= 0 ? 0 : 60 * Math.exp(-(gap - 6) / 6); // electrons per second: thinner gap, many more
  const lg = r => Math.log(1 + r); // the meter reads the rate on a squashed scale so the band is easy to see
  function surfaceY(s, x) { let y = BASE + 40; for (let i = 0; i < s.hts.length; i++) { const cx = s.off + i * SP, dx = x - cx; if (Math.abs(dx) < AR) y = Math.min(y, BASE + s.hts[i] - Math.sqrt(AR * AR - dx * dx)); } return y; }
  function paintBg(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#10183a'); bg.addColorStop(1, '#2a1a40'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    const r = P.rng(9); for (let i = 0; i < 30; i++) { const x = r() * 360, y = 250 + r() * 380, gr = o.createRadialGradient(x, y, 0, x, y, 30); gr.addColorStop(0, 'rgba(120,140,255,0.08)'); gr.addColorStop(1, 'rgba(120,140,255,0)'); o.fillStyle = gr; o.fillRect(x - 30, y - 30, 60, 60); }
    o.fillStyle = '#3a2a4a'; o.fillRect(0, BASE + 40, 360, 120);
  }
  function tip(c, y, t, bent) {
    c.save(); c.translate(TX, y); if (bent) c.rotate(0.35);
    const g2 = c.createLinearGradient(-40, 0, 40, 0); g2.addColorStop(0, '#6a6a7a'); g2.addColorStop(0.45, '#e8e8f4'); g2.addColorStop(1, '#5a5a6a'); c.fillStyle = g2; c.strokeStyle = '#2a2a3a'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(0, 0); c.lineTo(-34, -150); c.lineTo(-40, -400); c.lineTo(40, -400); c.lineTo(34, -150); c.closePath(); c.fill(); c.stroke();
    // the very end of the tip is a single atom
    SK.ball(c, 0, -7, 7, '#c8c8d8'); c.restore();
  }
  MG.add({
    id: 'atoms_tunnel', stage: 'atoms', cmd: 'SKIM THE TIP OVER THE ATOMS!', time: 7, mood: 'night', winText: 'Pictured the atoms!', failText: 'Lost the picture!',
    card: { title: 'Electrons that go through walls', kind: 'Physics', ref: 'Quantum tunnelling',
      text: "An electron near a gap or a thin wall it doesn't have the energy to cross can still turn up on the other side. It doesn't climb over or drill through. In quantum physics, an electron is spread out like a wave, and a little of the wave reaches past the wall. This is called tunnelling.\n\nThe thinner the wall, the more often it happens: a tiny bit thinner lets through many more.\n\nA scanning tunnelling microscope uses this. It holds a sharp tip just above a surface and keeps the tunnelling current steady, so the tip rises and falls over every single atom and draws a picture of them.",
      note: 'Electrons can pass through a gap they cannot climb over, and a thinner gap lets many more through.' },
    init(g) {
      const s = g.s, L = LV[Math.min(2, g.level)], v = SK.variant(g, 4);
      s.L = L; s.hts = HTS[v].slice(); s.off = TX; s.idx = 0; s.slideT = 0; s.total = L.n; s.tipY = BASE - 110; s.drag = null; s.hops = []; s.acc = 0; s.crashT = 0; s.inT = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; s.drag = { y0: y, t0: s.tipY }; },
    move(g, x, y) { const s = g.s; if (s.drag && !g.done) s.tipY = SK.clamp(s.drag.t0 + (y - s.drag.y0), 270, BASE + 20); },
    up(g) { g.s.drag = null; },
    update(g, dt) {
      const s = g.s, L = s.L; if (s.crashT) return;
      const sy = surfaceY(s, TX), gap = sy - s.tipY, rate = rateOf(gap), inBand = gap >= L.lo && gap <= L.hi;
      if (gap <= 1 && !g.done) { s.crashT = g.t; g.fail(); g.sfx('crunch'); g.sfx('laugh'); g.shake(5, 0.3); return; }
      // electrons tunnel across the gap at random moments, more often when it is thin
      s.acc += rate * dt; while (s.acc >= 1) { s.acc -= 1; s.hops.push({ t: g.t, x: TX + (g.rand() - 0.5) * 8, y0: s.tipY, y1: sy }); if (s.hops.length > 40) s.hops.shift(); }
      s.hops = s.hops.filter(h => g.t - h.t < 0.35);
      // the scan: hold the current in the band over this atom for a moment, then the atoms slide on to the next one
      // (while they slide, the microscope backs the tip off, so it never hits the next atom and must come close again)
      if (s.slideT) { const k = SK.clamp((g.t - s.slideT) / SLIDE, 0, 1); s.off = TX - SK.lerp(s.idx - 1, s.idx, SK.easeInOut(k)) * SP; s.tipY = Math.min(s.tipY, surfaceY(s, TX) - L.hi - 10); if (k >= 1) s.slideT = 0; return; }
      if (g.done) return;
      s.inT = inBand ? s.inT + dt : 0;
      if (s.inT >= HOLD) { s.inT = 0; s.idx++; g.sfx('click'); g.sfx('sparkle', { vol: 0.4 }); if (s.idx >= s.total) { g.win(); g.sfx('chime'); g.sfx('cheer'); } else s.slideT = g.t; }
    },
    draw(g, c) {
      const s = g.s, t = g.t, L = s.L, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('tunnel_bg', paintBg), 0, 0, 360, 640);
      // the atoms sliding past
      for (let i = 0; i < s.hts.length; i++) { const cx = s.off + i * SP, cy = BASE + s.hts[i]; if (cx < -40 || cx > 400) continue; SK.ball(c, cx, cy, AR, '#e8b84a', { edge: '#8a5a1a' }); }
      SK.tag(c, 'Atoms', 290, BASE + 66, 18);
      const sy = surfaceY(s, TX), gap = sy - s.tipY, rate = rateOf(gap), inBand = gap >= L.lo && gap <= L.hi;
      // electrons hopping across the gap
      for (const h of s.hops) { const k = SK.clamp((t - h.t) / 0.12, 0, 1), y = SK.lerp(h.y0, h.y1, k), a = 1 - SK.clamp((t - h.t - 0.12) / 0.23, 0, 1); c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(120,230,255,0.4)'; c.beginPath(); c.arc(h.x, y, 7, 0, 7); c.fill(); SK.ball(c, h.x, y, 3.5, '#5ad8ff', { lw: 1 }); c.restore(); }
      tip(c, s.tipY, t, !!s.crashT);
      // the picture so far: the tip's path, as bright bumps (drawn over the tip's shaft)
      c.fillStyle = '#0a0a1a'; c.beginPath(); c.roundRect(PIC.x - 6, PIC.y - 6, PIC.w + 12, PIC.h + 12, 10); c.fill(); c.strokeStyle = '#5a6a9a'; c.lineWidth = 2; c.stroke();
      c.save(); c.beginPath(); c.rect(PIC.x, PIC.y, PIC.w, PIC.h); c.clip(); const span = (s.total - 1) * SP + SP, px = d => PIC.x + 8 + d / span * (PIC.w - 16), py = y => PIC.y + PIC.h * 0.62 + (y - (BASE - AR)) * 1.6, upto = (s.idx + (s.slideT ? 0 : s.inT / HOLD) - 0.5) * SP + SP / 2;
      if (upto > 0) { const at = d => { const save = s.off; s.off = TX; const y = surfaceY(s, TX + d - SP / 2); s.off = save; return y; }; c.beginPath(); c.moveTo(px(0), PIC.y + PIC.h); for (let d = 0; d <= Math.min(upto, span); d += 3) c.lineTo(px(d), py(at(d))); c.lineTo(px(Math.min(upto, span)), PIC.y + PIC.h); c.closePath();
        const gr = c.createLinearGradient(0, PIC.y, 0, PIC.y + PIC.h); gr.addColorStop(0, '#ffe890'); gr.addColorStop(1, '#a04a20'); c.fillStyle = gr; c.fill(); }
      c.restore(); SK.tag(c, 'Picture', PIC.x + 50, PIC.y + PIC.h + 18, 18);
      SK.tag(c, 'Atom ' + Math.min(s.idx + 1, s.total) + ' / ' + s.total, PIC.x + PIC.w - 52, PIC.y + PIC.h + 18, 18);
      SK.tag(c, 'Tip', TX - 70, s.tipY - 70, 18);
      if (gap > 6 && !s.crashT) { c.save(); c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 1.5; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(TX + 16, s.tipY); c.lineTo(TX + 30, s.tipY); c.moveTo(TX + 16, sy); c.lineTo(TX + 30, sy); c.moveTo(TX + 24, s.tipY); c.lineTo(TX + 24, sy); c.stroke(); c.restore(); SK.tag(c, 'Gap', TX + 58, (s.tipY + sy) / 2, 18); }
      if (s.crashT) { c.fillStyle = 'rgba(255,240,200,0.8)'; for (let i = 0; i < 6; i++) { const a = i * 1.05 + t * 3; c.beginPath(); c.arc(TX + Math.cos(a) * 18, sy + Math.sin(a) * 10, 3, 0, 7); c.fill(); } }
      // the current meter with its band (and which way to move the tip)
      const mY = r => MET.b - SK.clamp(lg(r) / lg(rateOf(2)), 0, 1) * (MET.b - MET.t);
      c.fillStyle = 'rgba(10,10,30,0.75)'; c.beginPath(); c.roundRect(MET.x - 14, MET.t - 8, 28, MET.b - MET.t + 16, 12); c.fill();
      c.fillStyle = 'rgba(90,210,120,0.85)'; c.fillRect(MET.x - 9, mY(rateOf(L.lo)), 18, mY(rateOf(L.hi)) - mY(rateOf(L.lo)));
      c.fillStyle = inBand ? '#c8ffc8' : '#ffd45a'; const my = mY(rate); c.beginPath(); c.moveTo(MET.x - 16, my); c.lineTo(MET.x - 28, my - 8); c.lineTo(MET.x - 28, my + 8); c.closePath(); c.fill();
      SK.tag(c, 'Current', MET.x - 18, MET.t - 26, 18);
      if (!g.done && !inBand) { const up = gap < L.lo, p = 0.5 + 0.5 * Math.sin(t * 7), ax = TX - 50, ay = s.tipY - 30 + (up ? -1 : 1) * 6 * p; c.save(); c.fillStyle = '#ffe27a'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; const d = up ? -1 : 1;
        c.beginPath(); c.moveTo(ax, ay + d * 18); c.lineTo(ax - 12, ay); c.lineTo(ax - 4, ay); c.lineTo(ax - 4, ay - d * 14); c.lineTo(ax + 4, ay - d * 14); c.lineTo(ax + 4, ay); c.lineTo(ax + 12, ay); c.closePath(); c.fill(); c.stroke(); c.restore(); }
      SK.animal(c, 'frog', 46, 612, 0.6, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : rate < 0.5 ? 'sad' : 'happy' });
      // guidance: drag the tip to the middle of the band for the atom under it now
      if (!g.done && !s.slideT) { const want = sy - (L.lo + L.hi) / 2, d = want - s.tipY; SK.grab(c, g, TX, s.tipY - 40, 22); if (Math.abs(d) > 6) SK.arrow(c, g, TX - 80, s.tipY - 40, TX - 80, s.tipY - 40 + d, { from: 0, to: 0 });
        SK.demo(g, c, 'drag', [TX, s.tipY - 40], [TX, s.tipY - 40 + d]); }
    },
    auto(g, dt, synth) {
      const s = g.s, L = s.L; if (g.done || g.t < 1.0) return; const B = s._bot = s._bot || {};
      // look a little ahead so the tip rises before each bump arrives
      if (s.slideT) return; const want = surfaceY(s, TX) - (L.lo + L.hi) / 2;
      if (B.down) { if (g.t - B.t > 0.3) { B.down = 0; synth('up', 300, 400); } else synth('move', 300, 400 + (want - B.t0)); return; } if (g.t - (B.upT ?? 0) < 0.2) return; B.down = 1; B.t = g.t; B.t0 = s.tipY; synth('down', 300, 400);
    },
  });
})();
