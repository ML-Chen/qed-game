// LOAD LOW! (earth_eng ME-25) — a delivery truck seen from behind on a mountain road, a sharp-bend sign ahead. Heavy
// steel crates and light cardboard boxes wait in a pile by the road; drag each one onto the truck's bed (a crate drops
// to the lowest free spot in its column). A dot on the truck marks its balance point (centre of mass), and it moves as
// the load goes on; a dashed line shows how high it can sit before this bend tips the truck. When the last crate is
// on, the truck drives into the bend: the turn throws the load outward (a big arrow at the balance point). Heavy
// crates low: the truck leans a little and drives on. Heavy crates on top: it tips over its outer wheels and the
// boxes bounce down the road. The tipping rule is the real one: it tips when (bend sharpness x balance height) is more
// than the distance from the balance point to the outer wheel.
// Level 0: 2 heavy + 2 light, 2 columns. Level 1: a sharper bend. Level 2: 3 heavy + 3 light, 3 columns, sharper still.
const LL = (() => {
  const GY = 500, CX = 180, T = 100, BED = 430, M0 = 4, MH = 3, ML = 0.4, H0 = 62;
  const SETS = [
    { dir: 1, sky: ['#f4b87a', '#fbd8a0', '#fff1d0'], rock: '#c0784a', truck: '#d8483a' },
    { dir: -1, sky: ['#8ec8e8', '#c8e6f0', '#fff4dc'], rock: '#a8885a', truck: '#3a7ad8' },
    { dir: 1, sky: ['#c8a0d8', '#f0c8c8', '#fff0dc'], rock: '#9a6a6a', truck: '#e8a02a' },
    { dir: -1, sky: ['#f0a0a0', '#f8d0a0', '#fff4e0'], rock: '#b0704a', truck: '#3aa878' },
  ];
  function layout(L) { const cols = L >= 2 ? 3 : 2, sz = L >= 2 ? 58 : 70; const xs = []; for (let i = 0; i < cols; i++) xs.push(CX + (i - (cols - 1) / 2) * sz); return { cols, sz, xs, ys: [BED - sz / 2, BED - sz * 1.5] }; }
  // the balance point of truck + load: x offset toward the outside of the bend, height above the road
  function com(s) {
    let m = M0, mx = 0, mh = M0 * H0;
    for (const k of s.crates) if (k.slot) { const w = k.heavy ? MH : ML; m += w; mx += w * (s.Y.xs[k.slot[0]] - CX); mh += w * (GY - s.Y.ys[k.slot[1]]); }
    return { x: mx / m, h: mh / m, xo: mx / m * s.S.dir };
  }
  const tips = (s, c) => s.k * c.h + c.xo > T;
  function paint(o, S, L) {
    N4.vgrad(o, 0, 0, 360, GY, S.sky);
    o.fillStyle = 'rgba(255,250,230,0.8)'; o.beginPath(); o.arc(S.dir > 0 ? 70 : 290, 170, 26, 0, 7); o.fill();
    // red-rock mesas and a cliff on the outside of the bend
    const r = P.rng(7 + L);
    for (let i = 0; i < 4; i++) { const x = i * 110 - 20 + r() * 30, w = 90 + r() * 50, h = 60 + r() * 70; o.fillStyle = P.shade(S.rock, 0.25 - i * 0.04); o.beginPath(); o.moveTo(x, 330); o.lineTo(x + 12, 330 - h); o.lineTo(x + w - 12, 330 - h); o.lineTo(x + w, 330); o.closePath(); o.fill(); o.fillStyle = 'rgba(255,255,255,0.18)'; o.fillRect(x + 12, 330 - h, w - 24, 6); }
    N4.vgrad(o, 0, 320, 360, 40, [P.shade(S.rock, 0.1), P.shade(S.rock, -0.1)]);
    // the road: curving away toward the bend
    N4.vgrad(o, 0, 352, 360, 300, ['#b8a080', '#8a7458']);
    const fx = 180 - S.dir * 110; o.fillStyle = '#4a4650'; o.beginPath(); o.moveTo(-10, 640); o.bezierCurveTo(60, 470, 150, 380, fx - 16, 352); o.lineTo(fx + 16, 352); o.bezierCurveTo(230, 380, 300, 470, 370, 640); o.closePath(); o.fill();
    o.strokeStyle = 'rgba(255,255,255,0.5)'; o.lineWidth = 3; o.beginPath(); o.moveTo(8, 640); o.bezierCurveTo(70, 474, 152, 384, fx - 13, 354); o.moveTo(352, 640); o.bezierCurveTo(290, 474, 228, 384, fx + 13, 354); o.stroke();
    o.fillStyle = '#5a5662'; o.fillRect(0, GY + 2, 360, 4);
    // the roadside verge where the crates wait
    N4.vgrad(o, 0, 520, 360, 120, ['#c8a878', '#a8885a']); o.fillStyle = 'rgba(90,60,30,0.25)'; for (let i = 0; i < 40; i++) { o.beginPath(); o.ellipse(r() * 360, 530 + r() * 100, 3 + r() * 4, 1.5 + r(), 0, 0, 7); o.fill(); }
    for (let i = 0; i < 3; i++) P.rock(o, 30 + i * 150 + r() * 40, 600, 0.7 + r() * 0.3, P.shade(S.rock, -0.1));
    P.grain(o, 360, 640, 0.03);
  }
  function sign(c, x, y, dir) { // a yellow diamond warning sign: sharp bend
    c.fillStyle = '#6a5a4a'; c.fillRect(x - 3, y, 6, 70);
    c.save(); c.translate(x, y); c.rotate(Math.PI / 4); c.fillStyle = '#ffd43a'; c.strokeStyle = '#2a2430'; c.lineWidth = 4; c.beginPath(); c.roundRect(-24, -24, 48, 48, 6); c.fill(); c.stroke(); c.restore();
    c.save(); c.translate(x, y); c.scale(dir, 1); c.strokeStyle = '#2a2430'; c.lineWidth = 6; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(6, 18); c.lineTo(6, 0); c.quadraticCurveTo(6, -10, -6, -10); c.stroke(); c.fillStyle = '#2a2430'; c.beginPath(); c.moveTo(-14, -10); c.lineTo(-4, -19); c.lineTo(-4, -1); c.closePath(); c.fill(); c.restore();
  }
  function crate(c, x, y, sz, heavy, lift = 0) {
    const h = sz / 2; c.save(); c.translate(x, y - lift);
    if (heavy) {
      const g = c.createLinearGradient(-h, -h, h, h); g.addColorStop(0, '#8a96a8'); g.addColorStop(1, '#4a5466'); c.fillStyle = g; c.strokeStyle = '#1e2430'; c.lineWidth = 3; c.beginPath(); c.roundRect(-h, -h, sz, sz, 6); c.fill(); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,0.25)'; c.lineWidth = 3; c.beginPath(); c.moveTo(-h + 6, -h + 6); c.lineTo(h - 6, h - 6); c.moveTo(h - 6, -h + 6); c.lineTo(-h + 6, h - 6); c.stroke();
      c.fillStyle = '#c8d0dc'; for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { c.beginPath(); c.arc(a * (h - 6), b * (h - 6), 2.6, 0, 7); c.fill(); }
      // a kettlebell weight on the front
      c.fillStyle = '#1e2430'; c.beginPath(); c.arc(0, 4, sz * 0.2, 0, 7); c.fill(); c.strokeStyle = '#1e2430'; c.lineWidth = 4; c.beginPath(); c.arc(0, -sz * 0.12, sz * 0.1, Math.PI, 0); c.stroke();
    } else {
      const g = c.createLinearGradient(-h, -h, h, h); g.addColorStop(0, '#f2cf96'); g.addColorStop(1, '#d4a666'); c.fillStyle = g; c.strokeStyle = '#8a5a2a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-h, -h, sz, sz, 4); c.fill(); c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(-6, -h, 12, sz); // tape
      // a feather on the front
      c.save(); c.rotate(-0.6); c.fillStyle = '#fff'; c.strokeStyle = '#a8a0b8'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(0, 2, sz * 0.09, sz * 0.24, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.moveTo(0, -sz * 0.2); c.lineTo(0, sz * 0.3); c.stroke(); c.restore();
    }
    c.restore();
  }
  function truck(c, S, s, t, go) { // rear view: wheels, chassis, bed walls, the cab behind, the beaver at the wheel
    const col = S.truck, bw = s.Y.cols * s.Y.sz + 22, bx = CX - bw / 2, rum = go ? Math.sin(t * 40) * 0.8 : 0;
    c.save(); c.translate(0, rum);
    // cab behind the load, its back window showing the driver
    c.fillStyle = P.shade(col, -0.15); c.strokeStyle = P.shade(col, -0.6); c.lineWidth = 3; c.beginPath(); c.roundRect(CX - 72, 262, 144, 172, 16); c.fill(); c.stroke();
    c.fillStyle = '#9ad0e8'; c.beginPath(); c.roundRect(CX - 52, 276, 104, 50, 10); c.fill(); c.stroke();
    c.save(); c.beginPath(); c.roundRect(CX - 52, 276, 104, 50, 10); c.clip(); SK.animal(c, 'beaver', CX + 4, 352, 0.9, { t, expr: s.res === 'fail' ? 'wow' : 'happy', noShadow: true, facing: -1 }); c.restore();
    // tyres, axle and chassis
    for (const sx of [-1, 1]) { const x = CX + sx * T; c.fillStyle = '#2a2630'; c.beginPath(); c.roundRect(x - 22, GY - 58, 44, 58, 10); c.fill(); c.fillStyle = '#4a4650'; c.fillRect(x - 22, GY - 40, 44, 5); c.fillRect(x - 22, GY - 22, 44, 5); }
    c.fillStyle = '#3a3640'; c.fillRect(CX - T, GY - 46, 2 * T, 12);
    c.fillStyle = col; c.strokeStyle = P.shade(col, -0.6); c.beginPath(); c.roundRect(Math.min(bx, CX - T - 26), BED, Math.max(bw, 2 * T + 52), 26, 6); c.fill(); c.stroke();
    c.fillStyle = '#ff5a4a'; c.fillRect(CX - T - 20, BED + 6, 14, 10); c.fillRect(CX + T + 6, BED + 6, 14, 10); // tail lights
    c.fillStyle = '#fff6ea'; c.fillRect(CX - 24, BED + 8, 48, 12); c.fillStyle = '#2a2430'; c.font = '900 11px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('LOAD', CX, BED + 14.5);
    // bed sides
    c.fillStyle = P.shade(col, 0.15); c.fillRect(bx - 6, BED - s.Y.sz * 2 - 6, 8, s.Y.sz * 2 + 6); c.fillRect(bx + bw - 2, BED - s.Y.sz * 2 - 6, 8, s.Y.sz * 2 + 6);
    c.restore();
  }
  return { GY, CX, T, BED, SETS, layout, com, tips, paint, sign, crate, truck };
})();
MG.add({
  id: 'build_loadlow', stage: 'build', cmd: 'LOAD THE HEAVY CRATES LOW!', time: 7, mood: 'desert', winText: 'Round the bend!', failText: 'Tipped over!',
  card: { title: 'Keep the weight low', kind: 'Engineering', ref: 'Centre of mass and rollover',
    text: 'Every truck has a balance point, called its centre of mass. On a bend, the turn throws everything outward, as if a hand pushed sideways at that point.\n\nThe higher the balance point, the more leverage that push has to roll the truck over its outer wheels. Heavy crates on top raise it a lot. Heavy crates on the floor keep it low, so the push only makes the truck lean.\n\nThis is why heavy things go at the bottom of a lorry, a backpack or a ship, and why tall vehicles take bends slowly.',
    note: 'A low centre of mass keeps a vehicle from tipping over in a turn.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.S = LL.SETS[s.v]; s.L = L; s.Y = LL.layout(L);
    const nH = s.Y.cols, nL = s.Y.cols, kinds = SK.shuffled(g, [...Array(nH).fill(true), ...Array(nL).fill(false)]);
    if (kinds[0]) { const j = kinds.indexOf(false); [kinds[0], kinds[j]] = [kinds[j], kinds[0]]; } // a light box comes first in the pile, so the choice is real
    const n = kinds.length, sp = Math.min(62, 330 / n);
    s.crates = kinds.map((heavy, i) => { const hx = 180 + (i - (n - 1) / 2) * sp, hy = 554; return { i, heavy, x: hx, y: hy, hx, hy, slot: null }; });
    // the bend's sharpness: the good load (heavy below) clears the tip with a margin; the margin shrinks with level
    const good = { h: 0 }, M = [4, 3, 0.4], hb = LL.GY - s.Y.ys[0], ht = LL.GY - s.Y.ys[1], m = M[0] + s.Y.cols * (M[1] + M[2]);
    good.h = (M[0] * 62 + s.Y.cols * (M[1] * hb + M[2] * ht)) / m; s.k = LL.T / (good.h * [1.13, 1.07, 1.06][L]);
    s.phase = 'load'; s.goT = 0; s.res = null; s.fly = [];
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.phase !== 'load') return;
    const free = s.crates.filter(k => !k.slot || !s.crates.some(o => o.slot && o.slot[0] === k.slot[0] && o.slot[1] === k.slot[1] + 1));
    const k = SK.pick(free, x, y, s.Y.sz * 0.75); if (!k) return;
    if (k.slot) k.slot = null; k.drag = true; SK.dragStart(g, k, x, y); g.sfx('tap');
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const k = d.obj; k.drag = false;
    const Y = s.Y, bw = Y.cols * Y.sz; let placed = false;
    if (Math.abs(k.x - LL.CX) < bw / 2 + 30 && k.y < LL.BED + 30 && k.y > 150) { // over the bed: drop into the nearest column, to its lowest free spot
      let col = 0, bd = 1e9; Y.xs.forEach((cx, i) => { const dd = Math.abs(cx - k.x); if (dd < bd) { bd = dd; col = i; } });
      const used = s.crates.filter(o => o !== k && o.slot && o.slot[0] === col).length;
      if (used < 2) { k.slot = [col, used]; k.x = Y.xs[col]; k.y = Y.ys[used]; placed = true; g.sfx(k.heavy ? 'thud' : 'tap'); if (k.heavy) g.shake(2, 0.12); }
    }
    if (!placed) { k.x = k.hx; k.y = k.hy; g.sfx('swoosh'); }
    if (s.crates.every(o => o.slot)) { s.phase = 'go'; s.goT = g.t + 0.3; const c = LL.com(s); s.willTip = LL.tips(s, c); g.sfx('rumble'); }
  },
  update(g, dt) {
    const s = g.s; if (s.phase !== 'go' || g.t < s.goT) { for (const f of s.fly) { f.vy += 1200 * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.r += f.vr * dt; if (f.y > 600) { f.y = 600; f.vy *= -0.4; f.vx *= 0.7; } } return; }
    const u = g.t - s.goT;
    if (!s.willTip && u > 1.05 && !g.done) { s.res = 'win'; g.sfx('honk'); g.sfx('cheer'); g.win(); }
    if (s.willTip && u > 0.55 && !s.flown) { // the crates come loose as it rolls
      s.flown = true; const dir = s.S.dir;
      for (const k of s.crates) s.fly.push({ x: k.x + dir * 40, y: k.y - 30, vx: dir * (160 + g.rand() * 160), vy: -200 - g.rand() * 200, r: 0, vr: dir * (4 + g.rand() * 6), heavy: k.heavy });
      g.sfx('crunch'); g.sfx('thud'); g.shake(6, 0.3);
    }
    if (s.willTip && u > 0.9 && !g.done) { s.res = 'fail'; g.sfx('laugh'); g.fail(); }
    for (const f of s.fly) { f.vy += 1200 * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.r += f.vr * dt; if (f.y > 600) { f.y = 600; f.vy *= -0.45; f.vx *= 0.7; f.vr *= 0.6; if (Math.abs(f.vy) > 80) g.sfx('thud'); } }
  },
  draw(g, c) {
    const s = g.s, t = g.t, S = s.S, Y = s.Y, won = g.result === 'win', lost = g.result === 'fail';
    c.drawImage(g.bake('loadlow_bg' + s.v + '_' + s.L, o => LL.paint(o, S, s.L)), 0, 0, 360, 640);
    const going = s.phase === 'go' && t >= s.goT, u = going ? t - s.goT : 0;
    // road dashes rushing toward us while it drives
    c.save(); c.strokeStyle = '#f4e8c0'; c.lineWidth = 4; c.setLineDash([16, 18]); c.lineDashOffset = going ? -u * 260 : 0; c.beginPath(); c.moveTo(180, 640); c.bezierCurveTo(182, 520, 184, 420, 180 - S.dir * 110, 354); c.stroke(); c.restore();
    // the bend sign, sliding closer as the truck drives
    const sk = going ? SK.clamp(u / 0.6, 0, 1) : 0; c.save(); const sx = S.dir > 0 ? 310 : 50, sy = 236; c.translate(sx, sy); c.scale(1 + sk * 0.5, 1 + sk * 0.5); LL.sign(c, 0, 0, S.dir); c.restore();
    // the truck: leans out in the bend; if the balance point is too high, rolls over its outer wheels
    const c0 = LL.com(s), dir = S.dir; let th = 0;
    if (going && u > 0.35) { const v = u - 0.35; th = s.willTip ? dir * Math.min(1.45, 2.6 * v * v + 0.3 * v) : dir * 0.07 * Math.sin(Math.min(1, v / 0.7) * Math.PI); }
    c.save(); const px = LL.CX + dir * LL.T, py = LL.GY; c.translate(px, py); c.rotate(th); c.translate(-px, -py);
    LL.truck(c, S, s, t, going);
    if (!s.flown) for (const k of s.crates) if (k.slot && !k.drag) LL.crate(c, k.x, k.y, Y.sz - 4, k.heavy);
    // the balance point and (levels 0-1) the height it may reach before this bend tips the truck
    const bx = LL.CX + c0.x, by = LL.GY - c0.h, bad = LL.tips(s, c0);
    if (!lost) {
      if (g.level <= 1 && !going) { const ty = LL.GY - (LL.T - c0.xo) / s.k; c.save(); c.strokeStyle = '#e8303a'; c.lineWidth = 3; c.setLineDash([8, 6]); c.beginPath(); c.moveTo(LL.CX - LL.T - 10, ty); c.lineTo(LL.CX + LL.T + 10, ty); c.stroke(); c.restore(); SK.tag(c, 'Tips over', LL.CX - dir * (LL.T + 4), ty - 18, 18, '#fff6ea', 'rgba(190,40,50,0.9)'); }
      c.fillStyle = bad ? '#e8303a' : '#3ac06a'; c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.beginPath(); c.arc(bx, by, 10, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#2a2430'; c.beginPath(); c.arc(bx, by, 3, 0, 7); c.fill();
    }
    c.restore();
    if (!going && !lost) SK.tag(c, 'Balance point', SK.clamp(bx + (bx < 180 ? -6 : 6), 80, 280), by + 26, 18, '#fff6ea', bad ? 'rgba(190,40,50,0.9)' : 'rgba(30,110,60,0.9)');
    // the bend's outward push at the balance point
    if (going && u > 0.3 && u < 1.2 && !lost) { const k = SK.clamp((u - 0.3) * 4, 0, 1), L = 70 * k; c.save(); c.strokeStyle = '#ffd45a'; c.fillStyle = '#ffd45a'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + dir * L, by); c.stroke(); c.beginPath(); c.moveTo(bx + dir * (L + 18), by); c.lineTo(bx + dir * L, by - 14); c.lineTo(bx + dir * L, by + 14); c.closePath(); c.fill(); c.restore(); }
    // crates bouncing down the road
    for (const f of s.fly) { c.save(); c.translate(f.x, f.y); c.rotate(f.r); LL.crate(c, 0, 0, Y.sz - 4, f.heavy); c.restore(); }
    // the pile, and any crate being dragged
    for (const k of s.crates) if (!k.slot && !k.drag) { SK.shadow(c, k.x, k.y + 30, 26, 6); LL.crate(c, k.x, k.y, 52, k.heavy); }
    for (const k of s.crates) if (!k.slot && !k.drag) SK.tag(c, k.heavy ? 'Heavy' : 'Light', k.x, k.y + 40, 16 + 2, '#fff6ea', k.heavy ? 'rgba(30,36,48,0.85)' : 'rgba(138,90,42,0.85)');
    for (const k of s.crates) if (k.drag) LL.crate(c, k.x, k.y, Y.sz - 4, k.heavy, 0);
    SK.animal(c, 'fox', S.dir > 0 ? 40 : 320, 512, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'point', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: S.dir > 0 ? 1 : -1 });
    // guidance: the next crate to move and where it goes
    const h = !g.done && s.phase === 'load' ? LL.hint(s) : null;
    if (h) { SK.grab(c, g, h.k.x, h.k.y, 30); SK.target(c, g, h.to[0], h.to[1], 0, { w: Y.sz, h: Y.sz }); SK.arrow(c, g, h.k.x, h.k.y, h.to[0], h.to[1]); }
    SK.demo(g, c, 'drag', h ? [h.k.x, h.k.y] : [0, 0], h ? h.to : [0, 0], { never: !h });
  },
  auto(g, dt, synth) {
    const s = g.s, B = s._b = s._b || { n: 0, next: 1.0 }; if (g.done || s.phase !== 'load' || g.t < B.next) return;
    const h = LL.hint(s); if (!h) return; const key = 'd' + B.n;
    if (SK.bot.drag(g, synth, key, B.next, [h.k.x, h.k.y], h.to, 0.35)) { B.n++; B.next = g.t + 0.15; }
  },
});
// the next step: clear a light box off a bottom spot if one is there; else a heavy crate onto the free bottom spot
// nearest the middle; else a light box onto the free top spot nearest the middle
LL.hint = function (s) {
  const Y = s.Y, at = (c, r) => s.crates.find(k => k.slot && k.slot[0] === c && k.slot[1] === r);
  const order = Y.xs.map((x, i) => i).sort((a, b) => Math.abs(Y.xs[a] - LL.CX) - Math.abs(Y.xs[b] - LL.CX) || (Y.xs[a] - Y.xs[b]) * s.S.dir);
  for (let c = 0; c < Y.cols; c++) { const b = at(c, 0); if (b && !b.heavy) { const top = at(c, 1), k = top || b; return { k, to: [k.hx, k.hy] }; } }
  const hv = s.crates.find(k => k.heavy && (!k.slot || k.slot[1] === 1));
  if (hv) { const c = order.find(c => !at(c, 0) && !(hv.slot && hv.slot[0] === c)); if (c != null) return { k: hv, to: [Y.xs[c], Y.ys[0]] }; }
  const lt = s.crates.find(k => !k.heavy && !k.slot);
  if (lt) { const c = order.find(c => at(c, 0) && !at(c, 1)); if (c != null) return { k: lt, to: [Y.xs[c], Y.ys[1]] }; }
  return null;
};
