// CONTROL (physics PHS-38) — a reactor that powers a little town. Inside the core you see the chain reaction itself:
// a neutron (blue dot) hits a uranium atom, the atom splits with a flash and throws out 2 or 3 new neutrons, which fly
// straight on and split more atoms. Control rods (dark bars) soak up the neutrons that touch them. Drag the lever beside
// the core to push the rods in or pull them out. Too far in: the chain dies out and the town goes dark. Too far out:
// splits multiply, the core glows red, alarms ring and steam pours out. Just right: each split causes about one more,
// the power stays steady and the town's houses light up one by one. Level 2: some neutrons come out late, so the
// reaction answers the rods only after a delay.
(() => {
  const CORE = { l: 34, r: 286, t: 300, b: 548 }, LEV = { x: 322, t: 300, b: 548 }, RODS = [92, 160, 228], RW = 14;
  const ATOMS = []; for (let j = 0; j < 6; j++) for (let i = 0; i < 6; i++) ATOMS.push([56 + i * 42 - (i >= 3 ? 0 : 0), 322 + j * 42]);
  const SPEED = 230, LIFE = 1.5, HIT = 9, COOL = 0.35, BAND = [6, 22], MAXN = 70, HOUSES = 6;
  const town = [[150, 214], [182, 206], [214, 216], [246, 204], [278, 212], [310, 202]];
  function paintPlant(o) {
    const sky = o.createLinearGradient(0, 0, 0, 290); sky.addColorStop(0, '#0c1236'); sky.addColorStop(1, '#2a2a5a'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    const rnd = P.rng(8); for (let i = 0; i < 40; i++) { o.fillStyle = `rgba(255,250,220,${0.3 + rnd() * 0.5})`; o.beginPath(); o.arc(rnd() * 360, rnd() * 180, 0.6 + rnd() * 1.2, 0, 7); o.fill(); }
    o.fillStyle = '#1e2a3a'; o.beginPath(); o.moveTo(0, 250); o.quadraticCurveTo(120, 200, 230, 214); o.quadraticCurveTo(300, 222, 360, 196); o.lineTo(360, 290); o.lineTo(0, 290); o.fill();
    // the plant building that holds the core, and its cooling tower
    o.fillStyle = '#2a3a58'; o.fillRect(0, 262, 360, 378); o.fillStyle = '#3a4a6a'; o.fillRect(0, 262, 360, 6);
    o.fillStyle = '#4a5a7a'; o.beginPath(); o.moveTo(40, 262); o.quadraticCurveTo(52, 220, 44, 182); o.lineTo(96, 182); o.quadraticCurveTo(88, 220, 100, 262); o.fill();
    // the core: a thick steel tank with water inside
    o.fillStyle = '#5a6a88'; o.beginPath(); o.roundRect(CORE.l - 12, CORE.t - 12, CORE.r - CORE.l + 24, CORE.b - CORE.t + 24, 14); o.fill();
    o.fillStyle = '#0a2440'; o.beginPath(); o.roundRect(CORE.l, CORE.t, CORE.r - CORE.l, CORE.b - CORE.t, 8); o.fill();
    // the lever's track
    o.fillStyle = '#121a2a'; o.beginPath(); o.roundRect(LEV.x - 9, LEV.t - 6, 18, LEV.b - LEV.t + 12, 9); o.fill();
    o.fillStyle = 'rgba(255,255,255,0.25)'; for (let y = LEV.t; y <= LEV.b; y += 31) o.fillRect(LEV.x + 12, y - 1, 8, 2);
  }
  function house(c, x, y, b, i, t) {
    c.fillStyle = '#3a3048'; c.beginPath(); c.moveTo(x - 13, y); c.lineTo(x, y - 12); c.lineTo(x + 13, y); c.lineTo(x + 13, y + 18); c.lineTo(x - 13, y + 18); c.fill();
    const glow = b * (0.85 + 0.15 * Math.sin(t * 3 + i)); c.fillStyle = b > 0.05 ? `rgba(255,${200 + 30 * glow},${90 + 60 * glow},${0.25 + 0.75 * glow})` : '#1a1626';
    c.fillRect(x - 8, y + 3, 6, 6); c.fillRect(x + 2, y + 3, 6, 6);
    if (b > 0.3) { c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,210,120,${0.18 * b})`; c.beginPath(); c.arc(x, y + 6, 22, 0, 7); c.fill(); c.restore(); }
  }
  function splitAt(g, s, a, x, y) {
    a.cool = COOL; s.splits.push({ x, y, t: g.t }); s.count++;
    const k = g.rand() < 0.5 ? 2 : 3;
    for (let i = 0; i < k; i++) { const ang = g.rand() * Math.PI * 2, n = { x, y, vx: Math.cos(ang) * SPEED, vy: Math.sin(ang) * SPEED, age: 0, from: a }; if (s.late && i === 0) s.wait.push({ n, at: g.t + 0.9 }); else s.ns.push(n); }
  }
  MG.add({
    id: 'atoms_control', stage: 'atoms', cmd: 'MOVE THE RODS TO KEEP THE LIGHTS ON!', time: 8, mood: 'night', winText: 'Steady power!', failText: 'Lights out!',
    card: { title: 'A chain reaction under control', kind: 'Physics', ref: 'Nuclear reactor control',
      text: 'When a neutron hits a uranium atom, the atom splits, gives off heat, and throws out two or three new neutrons. Those can split more atoms: a chain reaction. If each split leads to more than one new split, the reaction grows faster and faster. If it leads to fewer than one, the reaction dies out.\n\nControl rods are made of a metal that soaks up neutrons. Operators move them so each split causes about one more, and the heat stays steady. That heat boils water to drive generators. Some neutrons come out a few seconds late, which gives people time to adjust the rods.',
      note: 'A reactor gives steady power when each split causes about one more split.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level);
      s.d = 0.92; s.late = lv >= 2; s.need = lv ? 3.0 : 2.6; s.atoms = ATOMS.map(([x, y]) => ({ x, y, cool: 0 }));
      s.ns = []; s.wait = []; s.splits = []; s.absorb = []; s.count = 0; s.P = 0; s.steady = 0; s.src = 0; s.hot = 0; s.lev = { x: LEV.x, y: 0 }; s.lev.y = LEV.t + s.d * (LEV.b - LEV.t);
      g.def.failText = 'Lights out!';
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (x > 250 && y > 250 && y < 600) { SK.dragStart(g, s.lev, x, y); this.move(g, x, y); } },
    move(g, x, y) { const s = g.s; if (!SK.dragging(g)) return; SK.dragMove(g, x, y); s.lev.x = LEV.x; s.lev.y = SK.clamp(s.lev.y, LEV.t, LEV.b); s.d = (s.lev.y - LEV.t) / (LEV.b - LEV.t); },
    up(g) { SK.dragEnd(g); },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      const tip = CORE.t + s.d * (CORE.b - CORE.t);
      // a weak neutron source keeps a few strays coming, so a dead core can always be restarted
      s.src -= dt; if (s.src <= 0) { s.src = 0.45; const a = g.rand() * Math.PI * 2; s.ns.push({ x: 80 + g.rand() * 160, y: 330 + g.rand() * 180, vx: Math.cos(a) * SPEED, vy: Math.sin(a) * SPEED, age: 0 }); }
      for (const w of s.wait) if (g.t >= w.at) s.ns.push(w.n); s.wait = s.wait.filter(w => g.t < w.at);
      for (const a of s.atoms) a.cool = Math.max(0, a.cool - dt);
      const keep = [];
      for (const n of s.ns) {
        n.x += n.vx * dt; n.y += n.vy * dt; n.age += dt;
        if (n.age > LIFE || n.x < CORE.l || n.x > CORE.r || n.y < CORE.t || n.y > CORE.b) continue; // escaped or slowed away
        if (n.y < tip && RODS.some(rx => Math.abs(n.x - rx) < RW / 2 + 1)) { s.absorb.push({ x: n.x, y: n.y, t: g.t }); continue; } // soaked up by a rod
        const a = s.atoms.find(q => !q.cool && q !== n.from && Math.abs(q.x - n.x) < HIT && Math.abs(q.y - n.y) < HIT);
        if (a) { splitAt(g, s, a, a.x, a.y); continue; }
        keep.push(n);
      }
      s.ns = keep; s.splits = s.splits.filter(p => g.t - p.t < 0.45); s.absorb = s.absorb.filter(p => g.t - p.t < 0.3);
      // power: splits per second, smoothed; the town's lights follow it
      s.rate = s.rate || []; s.rate.push(g.t); while (s.rate.length && s.rate[0] < g.t - 1) s.rate.shift();
      const inst = s.count / Math.max(dt, 1e-3); s.count = 0; s.P += (inst - s.P) * Math.min(1, dt / 0.7);
      const ok = s.P > BAND[0] && s.P < BAND[1]; s.ok = ok; s.steady = SK.clamp(s.steady + (ok ? dt : -dt * 0.4), 0, s.need);
      if (s.ns.length > MAXN || s.P > 40) { s.hot = g.t; g.def.failText = 'Overheating!'; g.fail(); g.sfx('rumble'); g.shake(10, 0.6); return; }
      if (s.steady >= s.need) { g.win(); g.sfx('cheer'); }
      if (ok && Math.floor(s.steady / s.need * HOUSES) > (s.lit || 0)) { s.lit = Math.floor(s.steady / s.need * HOUSES); g.sfx('ding'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, tip = CORE.t + s.d * (CORE.b - CORE.t), heat = SK.clamp((s.P - BAND[1]) / 20, 0, 1) + (s.hot ? 1 : 0);
      c.drawImage(g.bake('control_plant', paintPlant), 0, 0, 360, 640);
      // the town: its houses light up one by one while the power holds steady, and dim when it fails
      const supply = SK.clamp(s.P / BAND[0], 0, 1), lit = s.steady / s.need * HOUSES;
      town.forEach(([x, y], i) => house(c, x, y, supply * SK.clamp(lit - i + 0.35, 0.15, 1), i, t));
      c.strokeStyle = s.P > 1 ? `rgba(255,220,120,${0.4 + 0.5 * supply})` : '#3a3a50'; c.lineWidth = 2; c.beginPath(); c.moveTo(110, 262); c.quadraticCurveTo(130, 230, 140, 222); c.stroke();
      SK.tag(c, 'Power', 120, 242, 18);
      // steam from the cooling tower: a little when running, a lot when overheating
      for (let i = 0; i < 5; i++) { const q = (t * (0.4 + heat) + i / 5) % 1, a = (0.1 + 0.3 * supply + 0.4 * heat) * (1 - q); c.fillStyle = `rgba(230,235,250,${a})`; c.beginPath(); c.arc(70 + Math.sin(q * 5 + i) * 10, 182 - q * 70, 10 + q * 20 + heat * 10, 0, 7); c.fill(); }
      // inside the core: water glow, uranium atoms, neutrons, splits
      c.save(); c.beginPath(); c.roundRect(CORE.l, CORE.t, CORE.r - CORE.l, CORE.b - CORE.t, 8); c.clip();
      const wg = c.createRadialGradient(160, 424, 10, 160, 424, 180); wg.addColorStop(0, heat > 0 ? `rgba(255,${120 - 80 * Math.min(1, heat)},60,${0.3 + 0.4 * Math.min(1, heat)})` : `rgba(90,170,255,${0.1 + 0.35 * supply})`); wg.addColorStop(1, 'rgba(20,60,140,0)'); c.fillStyle = wg; c.fillRect(0, 0, 360, 640);
      for (const a of s.atoms) { if (a.cool > 0) { const k = a.cool / COOL; c.fillStyle = `rgba(120,140,90,${0.5 - 0.3 * k})`; c.beginPath(); c.arc(a.x - 4 * k, a.y, 4, 0, 7); c.arc(a.x + 4 * k, a.y, 4, 0, 7); c.fill(); } else SK.ball(c, a.x, a.y, 8, '#b8d84a', { lw: 1.2 }); }
      for (const p of s.splits) { const q = (t - p.t) / 0.45; c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 1 - q; c.fillStyle = '#fff2a0'; c.beginPath(); c.arc(p.x, p.y, 6 + q * 16, 0, 7); c.fill(); c.restore(); }
      for (const n of s.ns) { c.fillStyle = '#9ad8ff'; c.beginPath(); c.arc(n.x, n.y, 3.4, 0, 7); c.fill(); c.strokeStyle = 'rgba(154,216,255,0.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(n.x, n.y); c.lineTo(n.x - n.vx * 0.04, n.y - n.vy * 0.04); c.stroke(); }
      // the control rods, hanging from the top down to their tips
      for (const rx of RODS) { const rg = c.createLinearGradient(rx - RW / 2, 0, rx + RW / 2, 0); rg.addColorStop(0, '#22222c'); rg.addColorStop(0.5, '#5a5a6a'); rg.addColorStop(1, '#22222c'); c.fillStyle = rg; c.fillRect(rx - RW / 2, CORE.t, RW, tip - CORE.t); }
      for (const p of s.absorb) { const q = (t - p.t) / 0.3; c.fillStyle = `rgba(255,255,255,${0.8 * (1 - q)})`; c.beginPath(); c.arc(p.x, p.y, 3 + q * 5, 0, 7); c.fill(); }
      c.restore();
      if (heat > 0) { const on = Math.sin(t * 16) > 0; c.fillStyle = on ? 'rgba(255,50,30,0.22)' : 'rgba(255,50,30,0.06)'; c.fillRect(0, 262, 360, 378); for (const x of [16, 344]) { c.fillStyle = on ? '#ff4a3a' : '#6a1a1a'; c.beginPath(); c.arc(x, 280, 10, Math.PI, 0); c.fill(); } }
      // the lever that moves the rods: its handle sits level with the rods' tips
      c.strokeStyle = 'rgba(255,255,255,0.25)'; c.lineWidth = 2; c.setLineDash([4, 6]); c.beginPath(); c.moveTo(CORE.r - 4, tip); c.lineTo(LEV.x - 12, tip); c.stroke(); c.setLineDash([]);
      SK.ball(c, LEV.x, s.lev.y, 15, '#e8b83a'); c.fillStyle = '#7a5a1a'; c.fillRect(LEV.x - 8, s.lev.y - 2, 16, 4);
      // labels
      SK.tag(c, 'Control rods', 120, 282, 18); SK.tag(c, 'soak up neutrons', 120, 576, 18);
      SK.tag(c, 'Uranium', 270, 576, 18); if (s.ns.length) { const n = s.ns[0]; if (n.y > 330) SK.tag(c, 'Neutrons', SK.clamp(n.x, 70, 250), n.y - 22, 18); }
      // the town's progress: houses lit
      const won = g.result === 'win', lost = g.result === 'fail';
      SK.animal(c, 'beaver', 334, 626, 0.5, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost || heat > 0 ? 'wow' : 'happy', facing: -1 });
      const tooLow = s.P < BAND[0], ty = SK.clamp(s.lev.y + (tooLow ? -80 : 60), LEV.t, LEV.b);
      if (!s.ok) { SK.grab(c, g, LEV.x, s.lev.y, 18); SK.target(c, g, LEV.x, ty, 16); SK.arrow(c, g, LEV.x, s.lev.y, LEV.x, ty, { from: 22, to: 24 }); }
      SK.demo(g, c, 'drag', [LEV.x, s.lev.y], [LEV.x, ty], { period: 2, never: s.ok });
    },
    // the bot: watch the power and nudge the rods out when it's low, in when it's high
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 1) return; const B = s.bot = s.bot || { on: false };
      if (!B.on) { B.on = true; B.d = s.d; synth('down', LEV.x, s.lev.y); return; }
      const mid = (BAND[0] + BAND[1]) / 2; B.I = SK.clamp((B.I ?? 0.55) + (s.P - mid) * 0.004 * dt, 0.35, 0.8);
      B.d = SK.clamp(B.I + (s.P - mid) * 0.008 + (s.ns.length - 8) * 0.006, 0.05, 1);
      synth('move', LEV.x, LEV.t + B.d * (LEV.b - LEV.t));
    },
  });
})();
