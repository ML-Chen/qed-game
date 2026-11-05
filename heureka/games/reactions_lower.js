// LOWER! (chem_bio HC-25) — terraces of sand at sunset, each with a tall "energy hill". On the left of every hill two
// ants push a pair of molecules uphill; the hill is too tall, so the pair rolls back on them and they try again. Drag
// the glowing catalyst under a hill: the hump sinks (a dashed ghost shows its old height), the ants roll the pair over
// the top, the two join into a new molecule that rolls down the far side, and the catalyst slides back out unchanged
// to its pad, ready for the next hill. Dropped beside a hill it does nothing and the ants keep straining.
// Level 0: two hills; level 1: three; level 2: three hills whose slots have shapes (round or pointed), and two enzymes
// of those shapes: only the one that fits the slot works (a wrong one bounces out).
(() => {
  const W = 92, PAD = { x: 180, y: 596 }, CR = 24;
  const LANES = [[300, 482], [236, 386, 536], [236, 386, 536]];
  const COLS = [['#e8503a', '#3a8ae8'], ['#f0b030', '#40b070'], ['#d850a8', '#40c0d0'], ['#7a5ae8', '#f08a30']];
  const sstep = k => { k = SK.clamp(k, 0, 1); return k * k * (3 - 2 * k); };
  const bump = u => Math.abs(u) >= 1 ? 0 : Math.pow(Math.cos(u * Math.PI / 2), 2);
  function groundY(L, x, h) { return L.base + 16 * sstep((x - L.cx + W) / (2 * W)) - h * bump((x - L.cx) / W); }
  function slope(L, x, h) { return Math.atan2(groundY(L, x + 2, h) - groundY(L, x - 2, h), 4); }
  function paintBg(o, bases) {
    const sk = o.createLinearGradient(0, 0, 0, 640); sk.addColorStop(0, '#f39a6a'); sk.addColorStop(0.28, '#f8c890'); sk.addColorStop(0.5, '#fbe2b0'); sk.addColorStop(1, '#f6d8a0');
    o.fillStyle = sk; o.fillRect(0, 0, 360, 640);
    const sun = o.createRadialGradient(286, 130, 6, 286, 130, 90); sun.addColorStop(0, 'rgba(255,250,220,1)'); sun.addColorStop(0.25, 'rgba(255,236,170,0.9)'); sun.addColorStop(1, 'rgba(255,220,150,0)');
    o.fillStyle = sun; o.fillRect(180, 30, 220, 220);
    P.cloud(o, 70, 150, 0.6, '#fff4e4', '#f2c0a8'); P.cloud(o, 200, 190, 0.45, '#fff4e4', '#f2c0a8');
    // a terrace of warm sand under every lane, darker toward the front
    bases.forEach((b, i) => {
      const top = b - 4, bot = i < bases.length - 1 ? bases[i + 1] + 30 : 640;
      const gr = o.createLinearGradient(0, top, 0, bot); const k = i / Math.max(1, bases.length - 1);
      gr.addColorStop(0, P.mix('#e8c07a', '#d8a060', k)); gr.addColorStop(1, P.mix('#c89a58', '#a8743c', k));
      o.fillStyle = gr; o.beginPath(); o.moveTo(0, top); for (let x = 0; x <= 360; x += 12) o.lineTo(x, top + 16 * sstep((x - 180 + W) / (2 * W)) + Math.sin(x * 0.05 + i) * 1.5); o.lineTo(360, bot); o.lineTo(0, bot); o.closePath(); o.fill();
      const r = P.rng(7 + i); for (let j = 0; j < 40; j++) { o.fillStyle = r() < 0.5 ? 'rgba(120,70,30,0.22)' : 'rgba(255,240,200,0.4)'; o.beginPath(); o.arc(r() * 360, top + 20 + r() * (bot - top - 26), 1 + r() * 1.6, 0, 7); o.fill(); }
      o.fillStyle = 'rgba(90,50,20,0.18)'; o.fillRect(0, top - 2, 360, 3);
    });
    P.grain(o, 360, 640, 0.04);
  }
  function hill(c, L, h, t) {
    const x0 = L.cx - W - 4, x1 = L.cx + W + 4;
    const gr = c.createLinearGradient(0, L.base - L.H, 0, L.base + 16); gr.addColorStop(0, '#e07a4a'); gr.addColorStop(0.6, '#c45a36'); gr.addColorStop(1, '#a8482c');
    const body = () => { c.beginPath(); c.moveTo(x0, groundY(L, x0, h) + 1); for (let x = x0; x <= x1; x += 4) c.lineTo(x, groundY(L, x, h)); for (let x = x1; x >= x0; x -= 4) c.lineTo(x, groundY(L, x, 0) + 3); c.closePath(); };
    c.fillStyle = gr; c.strokeStyle = '#6a2a1a'; c.lineWidth = 2.5; body(); c.fill();
    c.beginPath(); for (let x = x0; x <= x1; x += 4) c[x === x0 ? 'moveTo' : 'lineTo'](x, groundY(L, x, h)); c.stroke();
    // strata on the hill
    c.save(); body(); c.clip();
    c.strokeStyle = 'rgba(255,220,180,0.25)'; c.lineWidth = 3; for (let k = 1; k < 5; k++) { c.beginPath(); for (let x = x0; x <= x1; x += 6) c[x === x0 ? 'moveTo' : 'lineTo'](x, groundY(L, x, h * (1 - k * 0.2)) + k * 3); c.stroke(); }
    c.restore();
  }
  function ghost(c, L) { c.save(); c.setLineDash([6, 6]); c.strokeStyle = 'rgba(110,40,30,0.55)'; c.lineWidth = 2.5; c.beginPath(); for (let x = L.cx - W; x <= L.cx + W; x += 4) c[x === L.cx - W ? 'moveTo' : 'lineTo'](x, groundY(L, x, L.H)); c.stroke(); c.restore(); }
  // the catalyst: a glowing violet block; shape 0 has a round bump on top, 1 a pointed one (level 2's enzymes)
  function shapePath(c, x, y, sh, r) { c.beginPath(); if (sh === 1) { c.moveTo(x - r, y); c.lineTo(x, y - r * 1.1); c.lineTo(x + r, y); } else c.arc(x, y, r, Math.PI, 0); }
  function catalyst(c, x, y, sh, t, glowK) {
    c.save(); const p = 0.5 + 0.5 * Math.sin(t * 5);
    const halo = c.createRadialGradient(x, y, 4, x, y, 46); halo.addColorStop(0, `rgba(230,190,255,${0.35 + 0.25 * p * glowK})`); halo.addColorStop(1, 'rgba(230,190,255,0)'); c.fillStyle = halo; c.beginPath(); c.arc(x, y, 46, 0, 7); c.fill();
    const gr = c.createLinearGradient(x, y - 20, x, y + 16); gr.addColorStop(0, '#d8a8ff'); gr.addColorStop(1, '#7a3ad0');
    c.fillStyle = gr; c.strokeStyle = '#3a1660'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(x - 30, y - 8, 60, 22, 7); c.fill(); c.stroke();
    if (sh != null) { shapePath(c, x, y - 7, sh, 13); c.closePath(); c.fill(); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.ellipse(x - 14, y - 2, 9, 3, -0.2, 0, 7); c.fill();
    for (let i = 0; i < 3; i++) { const a = t * 2 + i * 2.1, rr = 30 + 4 * Math.sin(t * 3 + i); c.fillStyle = '#fff6ff'; c.beginPath(); c.arc(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.5, 2, 0, 7); c.fill(); }
    c.restore();
  }
  function molecule(c, x, y, cols, joined, rot) {
    const d = joined ? 13 : 17; c.save(); c.translate(x, y); c.rotate(rot);
    if (joined) { c.strokeStyle = '#fff6ea'; c.lineWidth = 5; c.beginPath(); c.moveTo(-d, 0); c.lineTo(d, 0); c.stroke(); }
    SK.ball(c, -d, 0, 13, cols[0]); SK.ball(c, d, 0, 13, cols[1]);
    if (joined) { c.globalCompositeOperation = 'lighter'; c.fillStyle = 'rgba(255,240,180,0.25)'; c.beginPath(); c.ellipse(0, 0, 34, 18, 0, 0, 7); c.fill(); }
    c.restore();
  }
  // where a pair stands: x along the lane
  function pairPos(L, x, h) { const y = groundY(L, x, h); return [x, y - 14]; }
  MG.add({
    id: 'lower', stage: 'reactions', cmd: 'CATALYST UNDER EVERY HILL!', time: 6, mood: 'desert', winText: 'Easier path, more reactions!', failText: 'Too steep!',
    card: { title: 'A shortcut over the hill', kind: 'Chemistry', ref: 'Catalysts and activation energy',
      text: 'Molecules must bump together hard enough before they can react. That energy they need is like a hill they must push something over. Most tries fall short and roll back.\n\nA catalyst gives the reaction an easier path with a lower hill, so many more tries make it over and the reaction goes faster. The catalyst itself is not used up. It comes out unchanged and can help again and again.\n\nEnzymes are the catalysts in living things. Each has a shape that fits only its own molecules.',
      note: 'A catalyst lowers the energy hill a reaction must climb, so it goes faster, and the catalyst is not used up.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.v = SK.variant(g, 4);
      const bases = LANES[lv], H = lv === 0 ? 118 : 104;
      const shapes = [[0, 1, 0], [1, 0, 1], [0, 0, 1], [1, 1, 0]][s.v];
      s.lanes = bases.map((b, i) => ({ base: b, cx: 180 + [[-8, 12, -4], [10, -10, 6], [0, 14, -12], [-12, 0, 10]][s.v][i], H, h: H, x: 76 + i * 4, state: 'strain', ph: g.rand() * 2, cols: COLS[(s.v + i) % 4], sh: lv >= 2 ? shapes[i] : null, joinT: 0, done: false }));
      s.bases = bases; s.lv = lv;
      s.cats = lv >= 2 ? [{ x: PAD.x - 64, y: PAD.y, hx: PAD.x - 64, sh: 0 }, { x: PAD.x + 64, y: PAD.y, hx: PAD.x + 64, sh: 1 }] : [{ x: PAD.x, y: PAD.y, hx: PAD.x, sh: null }];
      for (const k of s.cats) { k.st = 'home'; k.lane = -1; k.t = 0; k.y0 = PAD.y; }
      s.made = 0; s.need = bases.length; s.winAt = 0;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; const k = SK.pick(s.cats.filter(k => k.st === 'home' || k.st === 'beside'), x, y, 52); if (k) { k.st = 'drag'; SK.dragStart(g, k, x, y); g.sfx('pop'); } },
    move(g, x, y) { const k = SK.dragging(g); if (k) { SK.dragMove(g, x, y); k.x = SK.clamp(k.x, 30, 330); k.y = SK.clamp(k.y, 130, 610); } },
    up(g) {
      const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const k = d.obj; if (k.st !== 'drag') return;
      const i = s.lanes.findIndex(L => !L.done && L.state !== 'go' && Math.abs(k.x - L.cx) < W * 0.9 && k.y > L.base - L.H - 10 && k.y < L.base + 34 && !s.cats.some(o => o !== k && o.lane === s.lanes.indexOf(L)));
      if (i >= 0) {
        const L = s.lanes[i];
        if (L.sh != null && L.sh !== k.sh) { k.st = 'bounce'; k.t = g.t; k.bx = k.x; k.by = k.y; g.sfx('boing'); g.sfx('wrong'); return; } // the wrong shape does not fit the slot
        k.st = 'in'; k.lane = i; k.t = g.t; k.bx = k.x; k.by = k.y; L.state = 'lower'; L.lowT = g.t; g.sfx('click'); g.sfx('magic');
      } else { // beside a hill: it just sits on the sand and nothing changes
        const b = s.bases.reduce((a, v) => Math.abs(v + 14 - k.y) < Math.abs(a + 14 - k.y) ? v : a, s.bases[0]); k.st = 'beside'; k.y = Math.min(610, b + 22); g.sfx('thud');
      }
    },
    update(g, dt) {
      const s = g.s, t = g.t;
      s.lanes.forEach((L, i) => {
        if (L.done) return;
        const cat = s.cats.find(k => k.lane === i && k.st === 'in');
        if (L.state === 'lower' || L.state === 'go') L.h = Math.max(L.H * 0.3, L.h - L.H * 2.2 * dt);
        if (L.state === 'lower' && L.h <= L.H * 0.3 + 0.1) L.state = 'go';
        if (L.state === 'strain' || L.state === 'lower') { // push up, falter at about half height, roll back down
          L.ph += dt; const per = 2.2, q = L.ph % per;
          if (q < 1.5) { const k = q / 1.5, top = L.cx - W * 0.42; L.x = SK.lerp(76 + i * 4, top, SK.easeOut(k) * 0.98 + Math.sin(t * 30) * 0.004); L.back = false; }
          else { const k = (q - 1.5) / 0.7; L.x = SK.lerp(L.cx - W * 0.42, 76 + i * 4, SK.easeInOut(k)); if (!L.back) { L.back = true; g.sfx('boing', { pitch: 0.7, vol: 0.35 }); } }
        } else if (L.state === 'go') {
          L.x += (L.x < L.cx ? 210 : 260) * dt;
          if (L.x >= L.cx && !L.joinT) { L.joinT = t; g.sfx('chime'); g.burst(L.cx, groundY(L, L.cx, L.h) - 16, ['#fff6c0', '#ffd45a', '#ffffff'], 14, 150);
            if (cat) { cat.st = 'out'; cat.t = t; cat.bx = cat.x; cat.by = cat.y; } }
          if (L.x >= L.cx + W + 40) { L.x = L.cx + W + 40; L.done = true; s.made++; g.sfx('pop');
            if (s.made >= s.need && !g.done) { g.win(); g.sfx('cheer'); } }
        }
      });
      for (const k of s.cats) {
        if (k.st === 'in') { const L = s.lanes[k.lane], e = SK.easeOut((t - k.t) / 0.25); k.x = SK.lerp(k.bx, L.cx, e); k.y = SK.lerp(k.by, L.base - 2, e); }
        if (k.st === 'out' || k.st === 'bounce') { const e = SK.easeInOut((t - k.t) / 0.45); k.x = SK.lerp(k.bx, k.hx, e); k.y = SK.lerp(k.by, PAD.y, e) - Math.sin(e * Math.PI) * 30;
          if (e >= 1) { k.st = 'home'; k.lane = -1; k.x = k.hx; k.y = PAD.y; if (!g.done) g.sfx('sparkle'); } }
      }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('lower_bg' + s.lv, o => paintBg(o, s.bases)), 0, 0, 360, 640);
      // the pad the catalyst rests on
      c.fillStyle = 'rgba(70,30,90,0.35)'; c.beginPath(); c.ellipse(PAD.x, PAD.y + 18, s.cats.length > 1 ? 120 : 52, 10, 0, 0, 7); c.fill();
      s.lanes.forEach((L, i) => {
        const cat = s.cats.find(k => k.lane === i && k.st === 'in');
        hill(c, L, L.h, t);
        if (L.h < L.H - 2) ghost(c, L);
        // the slot under the hill, with its shape at level 2
        if (!L.done && !cat) { c.save(); c.fillStyle = 'rgba(60,20,30,0.45)'; c.beginPath(); c.roundRect(L.cx - 32, L.base - 14, 64, 22, 8); c.fill();
          if (L.sh != null) { c.strokeStyle = '#ffe2c0'; c.lineWidth = 2.5; c.setLineDash([4, 3]); shapePath(c, L.cx, L.base - 14, L.sh, 13); c.stroke(); } c.restore(); }
        // products already made, resting in the right valley
        if (L.done) molecule(c, L.cx + W + 40, groundY(L, L.cx + W + 40, L.h) - 14, L.cols, true, 0);
        else {
          const [mx, my] = pairPos(L, L.x, L.h), a = slope(L, L.x, L.h), joined = L.x >= L.cx;
          // two ants behind the pair, pushing; they sweat while straining
          for (const j of [0, 1]) { const ax = L.x - 40 - j * 22, ay = groundY(L, ax, L.h); c.save(); c.translate(ax, ay); c.rotate(slope(L, ax, L.h));
            SK.animal(c, 'ant', 0, 0, 0.62, { t: t * (L.state === 'go' ? 1.5 : 1), phase: i + j, pose: L.back ? 'sad' : 'walk', expr: L.back ? 'wow' : L.state === 'go' ? 'happy' : 'think', noShadow: true }); c.restore();
            if (L.state !== 'go' && !L.back && Math.sin(t * 6 + j + i) > 0.2) { c.fillStyle = '#8ad0ff'; c.beginPath(); c.arc(ax + 8, ay - 30 - ((t * 30 + j * 9) % 12), 2.5, 0, 7); c.fill(); } }
          if (joined) molecule(c, mx, my, L.cols, true, a);
          else for (const [j, dx] of [[0, -14], [1, 14]]) { const bx = L.x + dx, by = groundY(L, bx, L.h) - 13; c.save(); c.translate(bx, by); c.rotate((L.x - 76) / 13); SK.ball(c, 0, 0, 13, L.cols[j]); c.restore(); }
        }
        if (cat) catalyst(c, cat.x, cat.y, cat.sh, t, 1);
      });
      // labels: one energy hill, the catalyst
      const nx = s.lanes.find(L => !L.done);
      if (nx && !g.done) SK.tag(c, 'Energy hill', nx.cx + 108, nx.base - nx.H * 0.62, 18);
      for (const k of s.cats) if (k.st !== 'in') catalyst(c, k.x, k.y, k.sh, t, k.st === 'home' ? 1 : 0.5);
      const hk = s.cats.find(k => k.st === 'home' || k.st === 'beside');
      if (hk && !g.done) SK.tag(c, s.cats.length > 1 ? 'Enzymes' : 'Catalyst', s.cats.length > 1 ? PAD.x : PAD.x + 96, PAD.y - 2, 18, '#fff6ea', 'rgba(80,30,120,0.85)');
      if (!won) SK.tag(c, s.made + " / " + s.need, 40, 150, 18);
      // the ant foreman cheers or slumps
      SK.animal(c, 'ant', 38, 628, 0.9, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'happy' });
      if (lost) s.lanes.forEach(L => { if (!L.done) { c.save(); c.fillStyle = 'rgba(255,255,255,0.8)'; c.font = '900 20px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.fillText('phew...', L.cx - W * 0.6, L.base - 56); c.restore(); } });
      // guidance: drag a catalyst (the one that fits) under the next hill still to react
      if (g.done) return;
      const L = s.lanes.find((L, i) => !L.done && L.state === 'strain' && !s.cats.some(k => k.lane === i));
      const k = L && s.cats.find(k => (k.st === 'home' || k.st === 'beside') && (L.sh == null || k.sh === L.sh));
      if (L && k && !SK.dragging(g)) { SK.grab(c, g, k.x, k.y, 34); SK.target(c, g, L.cx, L.base + 4, 0, { w: 76, h: 40 }); SK.arrow(c, g, k.x, k.y, L.cx, L.base + 4, { from: 40, to: 44 }); }
      SK.demo(g, c, 'drag', k ? [k.x, k.y] : [PAD.x, PAD.y], L ? [L.cx, L.base + 4] : [PAD.x, PAD.y], { never: !(L && k) });
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 0.8) return; const B = s._ab = s._ab || { n: 0, at: 0 };
      if (g.t < B.at) return;
      if (B.cur) { if (SK.bot.drag(g, synth, 'd' + B.n, B.cur.t0, B.cur.a, B.cur.b, 0.35)) { B.n++; B.at = g.t + 0.1; B.cur = null; } return; }
      const i = s.lanes.findIndex((L, i) => !L.done && L.state === 'strain' && !s.cats.some(k => k.lane === i)); if (i < 0) return; const L = s.lanes[i];
      const k = s.cats.find(k => k.st === 'home' && (L.sh == null || k.sh === L.sh)); if (!k && !B.cur) return;
      if (!B.cur) B.cur = { t0: g.t, a: [k.x, k.y], b: [L.cx, L.base + 4] };
      if (SK.bot.drag(g, synth, 'd' + B.n, B.cur.t0, B.cur.a, B.cur.b, 0.35)) { B.n++; B.at = g.t + 0.1; B.cur = null; }
    },
  });
})();
