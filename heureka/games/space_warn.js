// SWITCH EACH STATION TO SAFE! (space EE AS-19 WARN!) — up in space, the Sun has just thrown a glowing cloud of charged
// gas toward the Earth; a countdown shows the hours until it arrives (a day and a half at first). Down in the town,
// power lines run to substations full of big transformers. Drag each station's lever down to Safe. Once every station is
// safe, the hours rush by: the storm hits, the Earth's magnetic field shakes, aurora ripples across the sky, and the
// lights stay on. Any station still on Normal when it hits sparks, smokes and blacks out its street. The cloud's journey
// follows the fuse, so it never arrives before a player copying the hand could finish.
// Level 0: three stations; level 1: three, with stiffer levers that must be pulled all the way; level 2: four stations.
(() => {
  const SUN = { x: -34, y: 232, r: 96 }, EARTH = { x: 306, y: 232, r: 26 }, LT = 438, LB = 492, HOURS = 36;
  const XS = { 3: [[62, 178, 296], [70, 186, 290], [58, 172, 300], [66, 182, 294]], 4: [[48, 132, 218, 304], [52, 138, 222, 306], [46, 130, 216, 302], [50, 136, 220, 304]] };
  function paintBg(o) {
    const sp = o.createLinearGradient(0, 0, 0, 340); sp.addColorStop(0, '#06081e'); sp.addColorStop(1, '#1a1440'); o.fillStyle = sp; o.fillRect(0, 0, 360, 340);
    P.stars(o, 360, 340, 90, 41, 0);
    const sg = o.createRadialGradient(SUN.x, SUN.y, SUN.r * 0.7, SUN.x, SUN.y, SUN.r * 1.8); sg.addColorStop(0, 'rgba(255,200,90,0.6)'); sg.addColorStop(1, 'rgba(255,150,60,0)'); o.fillStyle = sg; o.fillRect(0, 100, 220, 260);
    const sd = o.createRadialGradient(SUN.x + 20, SUN.y - 20, 10, SUN.x, SUN.y, SUN.r); sd.addColorStop(0, '#fff6d0'); sd.addColorStop(0.6, '#ffc040'); sd.addColorStop(1, '#ff7a20'); o.fillStyle = sd; o.beginPath(); o.arc(SUN.x, SUN.y, SUN.r, 0, 7); o.fill();
    // the town at dusk below
    const sk = o.createLinearGradient(0, 340, 0, 640); sk.addColorStop(0, '#2a2a5a'); sk.addColorStop(1, '#4a3a6a'); o.fillStyle = sk; o.fillRect(0, 340, 360, 300);
    o.fillStyle = '#2a3a3a'; o.beginPath(); o.moveTo(0, 520); o.quadraticCurveTo(120, 500, 200, 515); o.quadraticCurveTo(290, 530, 360, 505); o.lineTo(360, 640); o.lineTo(0, 640); o.closePath(); o.fill();
    o.fillStyle = '#1e2a2a'; o.fillRect(0, 540, 360, 100);
    // the power plant on the hill at the right, with its line along the top of the town
    o.fillStyle = '#4a4a5a'; o.fillRect(318, 372, 34, 50); o.fillRect(326, 350, 10, 26); o.fillStyle = 'rgba(200,200,220,0.25)'; o.beginPath(); o.arc(331, 342, 9, 0, 7); o.arc(336, 330, 12, 0, 7); o.fill();
    o.strokeStyle = '#8a8aa0'; o.lineWidth = 2; o.beginPath(); o.moveTo(318, 392); o.quadraticCurveTo(180, 404, 10, 392); o.stroke();
  }
  function cloud(c, x, y, k, t) { // the solar storm: a glowing, churning blob of charged gas
    const r = 28 + 18 * k; c.save(); for (let i = 0; i < 7; i++) { const a = i * 0.9 + t * 0.8, rr = r * (0.55 + 0.25 * Math.sin(t * 2 + i)); const gr = c.createRadialGradient(x + Math.cos(a) * r * 0.4, y + Math.sin(a) * r * 0.4, 0, x + Math.cos(a) * r * 0.4, y + Math.sin(a) * r * 0.4, rr);
      gr.addColorStop(0, 'rgba(255,200,120,0.75)'); gr.addColorStop(1, 'rgba(255,110,90,0)'); c.fillStyle = gr; c.beginPath(); c.arc(x + Math.cos(a) * r * 0.4, y + Math.sin(a) * r * 0.4, rr, 0, 7); c.fill(); } c.restore(); }
  function earth(c, t, shake) {
    const { x, y, r } = EARTH; c.save(); c.strokeStyle = `rgba(140,200,255,${0.25 + shake * 0.4})`; c.lineWidth = 1.8;
    for (const k of [1.7, 2.4, 3.1]) { const sq = 1 - shake * 0.25 * Math.sin(t * 20); c.beginPath(); c.ellipse(x + 6, y, r * k * sq * 0.9, r * k * 0.7, 0, 0, 7); c.stroke(); } c.restore();
    const eg = c.createRadialGradient(x - 8, y - 8, 3, x, y, r); eg.addColorStop(0, '#7ad0ff'); eg.addColorStop(1, '#1e5aa8'); c.fillStyle = eg; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.fillStyle = '#5aa84a'; c.beginPath(); c.ellipse(x - 6, y - 4, 10, 7, 0.4, 0, 7); c.ellipse(x + 9, y + 9, 7, 5, 0, 0, 7); c.fill();
  }
  function station(c, g, st, t, hit, lit) {
    const x = st.x, y = 470;
    // houses on its street
    for (let i = -1; i <= 1; i++) { const hx = x + i * 24, hy = 584; c.fillStyle = '#3a3a52'; c.fillRect(hx - 9, hy - 18, 18, 18); c.beginPath(); c.moveTo(hx - 11, hy - 18); c.lineTo(hx, hy - 28); c.lineTo(hx + 11, hy - 18); c.fill(); c.fillStyle = lit ? '#ffd870' : '#1a1a2a'; c.fillRect(hx - 4, hy - 13, 8, 7); }
    c.strokeStyle = '#8a8aa0'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - 10, 398); c.lineTo(x - 10, y - 20); c.moveTo(x, y + 18); c.lineTo(x, 556); c.stroke();
    // the transformer: a grey box with cooling fins and insulators
    const burnt = st.burnt; c.fillStyle = burnt ? '#3a3036' : '#7a8090'; c.strokeStyle = '#2a2a3a'; c.lineWidth = 2; c.beginPath(); c.roundRect(x - 26, y - 20, 34, 38, 4); c.fill(); c.stroke();
    c.fillStyle = burnt ? '#2a2026' : '#6a7080'; for (let i = 0; i < 4; i++) c.fillRect(x - 24 + i * 8, y - 14, 4, 26);
    c.fillStyle = '#c8b8a0'; for (const ix of [-18, -2]) { c.fillRect(ix - 2, y - 30, 4, 10); c.beginPath(); c.arc(ix, y - 30, 3.5, 0, 7); c.fill(); }
    // the lever: up is Normal, down is Safe
    const lx = x + 26; c.fillStyle = '#1a1a2a'; c.beginPath(); c.roundRect(lx - 6, LT - 8, 12, LB - LT + 16, 6); c.fill();
    c.fillStyle = 'rgba(90,210,120,0.8)'; c.fillRect(lx - 6, LB - 6, 12, 10);
    const hy = SK.lerp(LT, LB, st.lv); c.strokeStyle = '#c8c8d8'; c.lineWidth = 4; c.beginPath(); c.moveTo(lx, (LT + LB) / 2); c.lineTo(lx, hy); c.stroke();
    c.fillStyle = st.safe ? '#5ad07a' : '#e8563a'; c.strokeStyle = '#1a1030'; c.lineWidth = 2.5; c.beginPath(); c.arc(lx, hy, 11, 0, 7); c.fill(); c.stroke();
    if (st.safe) SK.tag(c, 'Safe', lx, LB + 30, 18, '#eaffea', 'rgba(30,110,60,0.9)');
    // sparks and smoke when the storm's currents hit a station left on Normal
    if (burnt) { const k = t - st.burnt; c.fillStyle = `rgba(120,120,130,${Math.max(0, 0.6 - k * 0.2)})`; c.beginPath(); c.arc(x - 8, y - 30 - k * 20, 10 + k * 8, 0, 7); c.fill();
      if (k < 1.2) for (let i = 0; i < 5; i++) { const a = i * 1.3 + t * 9; c.strokeStyle = '#fff6a0'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 8, y - 20); c.lineTo(x - 8 + Math.cos(a) * 18, y - 20 + Math.sin(a) * 18); c.stroke(); } }
  }
  MG.add({
    id: 'space_warn', stage: 'space', cmd: 'SWITCH EACH STATION TO SAFE!', time: 6, mood: 'night', winText: 'Lights stayed on!', failText: 'Blackout!',
    card: { title: 'A warning from the Sun', kind: 'Astronomy', ref: 'Space weather',
      text: "Sometimes the Sun throws out a huge cloud of electrically charged gas. It usually takes one to three days to cross the 150 million kilometres to the Earth.\n\nWhen it hits, it shakes the Earth's magnetic field. That pushes extra electric currents through long power lines, which can overheat big transformers, wreck them and black out a whole region. It also lights up the aurora.\n\nSpacecraft watching the Sun spot the cloud as it leaves, so power companies get a warning and have time to protect their grid before it arrives.",
      note: 'A solar storm takes a day or more to reach the Earth, so a warning gives time to protect the power grid.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level), v = SK.variant(g, 4), n = L === 2 ? 4 : 3;
      s.st = XS[n][v].map(x => ({ x, lv: 0, safe: false, burnt: 0 })); s.stiff = L >= 1 ? 0.9 : 0.6; s.drag = null; s.allT = 0; s.hitT = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.hitT) return; const st = s.st.find(q => !q.safe && Math.abs(x - (q.x + 26)) < 30 && y > LT - 40 && y < LB + 30); if (st) { s.drag = st; g.sfx('click'); } },
    move(g, x, y) { const s = g.s; if (s.drag) s.drag.lv = SK.clamp((y - LT) / (LB - LT), 0, 1); },
    up(g) {
      const s = g.s, st = s.drag; s.drag = null; if (!st) return;
      if (st.lv >= s.stiff) { st.lv = 1; st.safe = true; g.sfx('snap'); g.sfx('chime'); if (s.st.every(q => q.safe) && !s.allT) { s.allT = g.t; s.k0 = 0.08 + 0.82 * SK.clamp(g.fuse() / g.dur, 0, 1); g.sfx('whoosh'); } } else { st.lv = 0; g.sfx('boing', { vol: 0.4 }); }
    },
    update(g, dt) {
      const s = g.s;
      if (s.allT && !s.hitT && g.t - s.allT > 0.45) { s.hitT = g.t; g.sfx('rumble'); g.win(); g.sfx('cheer'); }
      if (g.result === 'fail' && !s.hitT) { s.hitT = g.t; for (const q of s.st) if (!q.safe) q.burnt = g.t; g.sfx('snap'); g.sfx('fire'); g.shake(5, 0.4); }
      for (const q of s.st) if (!q.safe && s.drag !== q && q.lv > 0) q.lv = Math.max(0, q.lv - dt * 3); // a lever let go halfway springs back up
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('warn_bg', paintBg), 0, 0, 360, 640);
      // the storm's trip from the Sun to the Earth: it follows the fuse, then rushes in once the grid is safe
      const fk = g.dur ? SK.clamp(g.fuse() / g.dur, 0, 1) : 0, base = 0.08 + 0.82 * fk; let k = base;
      if (s.allT) k = SK.lerp(s.k0 ?? base, 1, SK.clamp((t - s.allT) / 0.45, 0, 1)); if (s.hitT && !s.allT) k = 1;
      const cx = SK.lerp(SUN.x + SUN.r + 10, EARTH.x - EARTH.r - 18, k), shake = s.hitT ? Math.max(0, 1 - (t - s.hitT) * 0.6) : 0;
      if (!s.hitT || t - s.hitT < 0.8) cloud(c, cx, EARTH.y, k, t);
      earth(c, t, shake);
      // the aurora over the town once the storm arrives
      if (s.hitT) { const a = SK.clamp((t - s.hitT) * 1.5, 0, 1); c.save(); c.globalAlpha = 0.7 * a; for (let i = 0; i < 3; i++) { const gr = c.createLinearGradient(0, 350, 0, 470); gr.addColorStop(0, 'rgba(90,255,170,0)'); gr.addColorStop(0.5, i === 1 ? 'rgba(200,120,255,0.55)' : 'rgba(90,255,170,0.6)'); gr.addColorStop(1, 'rgba(90,255,170,0)'); c.fillStyle = gr; c.beginPath(); c.moveTo(0, 360 + i * 12); for (let x = 0; x <= 360; x += 20) c.lineTo(x, 360 + i * 12 + Math.sin(x * 0.03 + t * 2 + i) * 12); for (let x = 360; x >= 0; x -= 20) c.lineTo(x, 420 + i * 12 + Math.sin(x * 0.025 + t * 1.6 + i) * 10); c.closePath(); c.fill(); } c.restore(); }
      for (const q of s.st) station(c, g, q, t, s.hitT, !q.burnt);
      SK.tag(c, 'Sun', 40, 150, 18); SK.tag(c, 'Earth', EARTH.x, EARTH.y + 52, 18); if (!s.hitT) SK.tag(c, 'Solar storm', SK.clamp(cx, 70, 230), EARTH.y + 56, 18);
      SK.tag(c, 'Transformers', 120, 364, 18);
      const hrs = Math.max(0, Math.round(HOURS * (1 - k))); if (!s.hitT) SK.tag(c, 'Arrives in ' + hrs + ' h', 196, 162, 19, '#fff6ea', 'rgba(170,60,30,0.85)');
      SK.animal(c, 'beaver', 334, 620, 0.55, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'think', facing: -1 });
      // guidance: pull the next station's lever down to Safe
      if (!g.done && !s.allT) { const q = s.st.find(q => !q.safe); if (q) { const lx = q.x + 26, hy = SK.lerp(LT, LB, q.lv); SK.grab(c, g, lx, hy, 16); SK.target(c, g, lx, LB, 14); SK.arrow(c, g, lx + 18, LT - 6, lx + 18, LB + 6, { from: 0, to: 0 }); SK.demo(g, c, 'drag', [lx, hy], [lx, LB + 14]); } }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.allT || g.t < 1.0) return; const B = s._bot = s._bot || {}; const i = s.st.findIndex(q => !q.safe); if (i < 0) return; const key = 'L' + i;
      if (B[key + 't'] == null) B[key + 't'] = g.t + 0.1; const q = s.st[i]; SK.bot.drag(g, synth, key, B[key + 't'], [q.x + 26, LT], [q.x + 26, LB + 14], 0.3);
    },
  });
})();
