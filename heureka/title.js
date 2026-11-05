var GAME_NAME = window.GAME_NAME || 'Heurēka!';
// title.js — the animated title painting of Heurēka! (the engine draws Play at (180, 300), Cards at (180, 372), the gear
// at (30, 30) and the mute icon at (330, 30) on top). Archimedes' moment on a sunny Greek terrace by the sea: a frog in
// a claw-foot bathtub that is full to the brim. It ponders, a lightbulb flashes, it leaps for joy and splashes back in,
// and the water it pushes aside spills over the rim (more while it sits in the tub, a surge when it lands). Around it,
// small nods to the subjects: a ringed planet with its moon and a rocket lifting off the island (space), a bubbling
// flask and a turning DNA model (chemistry, biology), a robot arm on a gear train (engineering, robotics), a laptop
// with a blinking cursor (computer science), a circuit with a glowing bulb and a coin jar (money).
// The sky, sea's far shore, terrace and table are painted once into a 2x offscreen canvas; everything else moves.
const HK_TITLE = (() => {
  const W = 360, H = 640, TAU = Math.PI * 2, INK = '#3a1640';
  const FONT = s => `700 ${s}px Fredoka, Nunito, system-ui, sans-serif`;
  const hasAni = () => typeof ANI !== 'undefined';
  const an = (c, kind, x, y, s, o) => { if (!hasAni()) return null; try { return ANI.draw(c, kind, x, y, s, o); } catch (e) { console.error('title', kind, e); return null; } };
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = u => u * u * (3 - 2 * u);

  // ---------- layout ----------
  const SEA = { top: 402, bot: 446 };
  const TUB = { x: 176, y: 508, rx: 90, ry: 13, depth: 64 }; // rim centre, rim radii, rim-to-bottom
  const FLOOR = 590; // where the tub's feet stand
  const TABLE = { x: 40, y: 474 };
  const ARM = { x: 322, y: 526 };
  const ROCKET_PAD = { x: 336, y: 396 };

  // ---------- the static background (painted once at 2x) ----------
  let bg = null;
  function paintBg(o) {
    P.sky(o, W, H, ['#4aa6e4', '#8ccff4', '#d2f0f2', '#fff0c8'], { x: 292, y: 96, r: 22, color: '#fff2c0', glow: 200 });
    // a soft glow behind the lettering
    const tg = o.createRadialGradient(180, 172, 10, 180, 172, 190); tg.addColorStop(0, 'rgba(255,252,236,0.55)'); tg.addColorStop(1, 'rgba(255,252,236,0)');
    o.save(); o.translate(180, 172); o.scale(1, 0.5); o.translate(-180, -172); o.fillStyle = tg; o.fillRect(-20, -30, 400, 400); o.restore();
    // the far shore on the left: a low headland with cypresses
    o.fillStyle = '#9cc4b8'; o.beginPath(); o.moveTo(-10, SEA.top + 1); o.quadraticCurveTo(30, SEA.top - 18, 70, SEA.top - 10); o.quadraticCurveTo(100, SEA.top - 6, 128, SEA.top + 1); o.closePath(); o.fill();
    for (const [x, h] of [[22, 22], [34, 16], [58, 19]]) { o.fillStyle = '#6e9e8a'; o.beginPath(); o.ellipse(x, SEA.top - 8 - h / 2, 3.2, h / 2, 0, 0, TAU); o.fill(); }
    // the island on the right with a little white temple and the rocket's pad
    const isl = o.createLinearGradient(0, SEA.top - 28, 0, SEA.top); isl.addColorStop(0, '#b2cfa8'); isl.addColorStop(1, '#8ab494');
    o.fillStyle = isl; o.beginPath(); o.moveTo(226, SEA.top + 1); o.quadraticCurveTo(250, SEA.top - 22, 286, SEA.top - 24); o.quadraticCurveTo(330, SEA.top - 26, 352, SEA.top - 8); o.quadraticCurveTo(360, SEA.top - 3, 368, SEA.top + 1); o.closePath(); o.fill();
    o.fillStyle = 'rgba(255,250,230,0.35)'; o.beginPath(); o.moveTo(246, SEA.top - 12); o.quadraticCurveTo(270, SEA.top - 24, 300, SEA.top - 23); o.quadraticCurveTo(272, SEA.top - 20, 252, SEA.top - 9); o.closePath(); o.fill();
    // temple: steps, six columns, a pediment
    o.save(); o.translate(278, SEA.top - 23);
    o.fillStyle = '#f6efe2'; o.fillRect(-15, -2, 30, 3); o.fillRect(-13, -4, 26, 2.5);
    for (let i = 0; i < 6; i++) { o.fillStyle = '#fbf6ec'; o.fillRect(-11 + i * 4.3, -14, 2.2, 10); o.fillStyle = 'rgba(150,140,170,0.35)'; o.fillRect(-11 + i * 4.3 + 1.4, -14, 0.8, 10); }
    o.fillStyle = '#f6efe2'; o.fillRect(-13, -16.5, 26, 2.6); o.beginPath(); o.moveTo(-14, -16.5); o.lineTo(0, -22.5); o.lineTo(14, -16.5); o.closePath(); o.fill();
    o.fillStyle = 'rgba(150,140,170,0.3)'; o.fillRect(-13, -14.6, 26, 0.8);
    o.restore();
    // the launch tower beside the pad
    o.strokeStyle = '#8a8aa8'; o.lineWidth = 1; o.beginPath(); o.moveTo(ROCKET_PAD.x + 6, ROCKET_PAD.y); o.lineTo(ROCKET_PAD.x + 6, ROCKET_PAD.y - 20); for (let k = 0; k < 4; k++) { o.moveTo(ROCKET_PAD.x + 6, ROCKET_PAD.y - k * 5); o.lineTo(ROCKET_PAD.x + 9, ROCKET_PAD.y - k * 5 - 5); } o.stroke();
    o.fillStyle = '#a8a4b8'; o.fillRect(ROCKET_PAD.x - 6, ROCKET_PAD.y - 1, 15, 2.4);
    // the terrace: a marble ledge, then sandstone tiles in perspective
    const VY = 360, Y0 = SEA.bot + 6;
    const fg = o.createLinearGradient(0, Y0, 0, H); fg.addColorStop(0, '#f4dfba'); fg.addColorStop(0.5, '#eccc9c'); fg.addColorStop(1, '#ddb27e');
    o.fillStyle = fg; o.fillRect(0, Y0, W, H - Y0);
    const ys = []; for (let z = 1; ; z++) { const y = VY + (Y0 - VY) * Math.pow(1.36, z - 1); if (y > H + 40) break; ys.push(y); }
    const xAt = (k, y) => 180 + k * 34 * (y - VY) / (Y0 - VY);
    for (let r = 0; r < ys.length - 1; r++) for (let k = -14; k < 14; k++) {
      if ((r + k) % 2 === 0) continue;
      o.fillStyle = 'rgba(196,140,90,0.13)'; o.beginPath(); o.moveTo(xAt(k, ys[r]), ys[r]); o.lineTo(xAt(k + 1, ys[r]), ys[r]); o.lineTo(xAt(k + 1, ys[r + 1]), ys[r + 1]); o.lineTo(xAt(k, ys[r + 1]), ys[r + 1]); o.closePath(); o.fill();
    }
    o.strokeStyle = 'rgba(176,122,78,0.28)'; o.lineWidth = 1;
    for (const y of ys) { o.beginPath(); o.moveTo(0, y); o.lineTo(W, y); o.stroke(); }
    for (let k = -14; k <= 14; k++) { o.beginPath(); o.moveTo(xAt(k, Y0), Y0); o.lineTo(xAt(k, H + 40), H + 40); o.stroke(); }
    // warm light pooling on the terrace, cooler at the front corners
    const pool = o.createRadialGradient(200, 520, 10, 200, 520, 260); pool.addColorStop(0, 'rgba(255,250,226,0.35)'); pool.addColorStop(1, 'rgba(255,250,226,0)'); o.fillStyle = pool; o.fillRect(0, Y0, W, H - Y0);
    const vg = o.createLinearGradient(0, 560, 0, H); vg.addColorStop(0, 'rgba(120,70,60,0)'); vg.addColorStop(1, 'rgba(120,70,60,0.16)'); o.fillStyle = vg; o.fillRect(0, 560, W, 80);
    // the marble ledge along the sea
    o.fillStyle = 'rgba(80,60,60,0.18)'; o.fillRect(0, Y0, W, 4);
    const lg = o.createLinearGradient(0, SEA.bot - 2, 0, Y0 + 1); lg.addColorStop(0, '#fffaf0'); lg.addColorStop(1, '#e4d6c4'); o.fillStyle = lg; o.fillRect(0, SEA.bot - 2, W, Y0 - SEA.bot + 3);
    // potted plant at the far right of the ledge
    o.fillStyle = 'rgba(80,50,40,0.2)'; o.beginPath(); o.ellipse(356, Y0 + 2, 14, 3, 0, 0, TAU); o.fill();
    // the table on the left (flask and DNA stand on it)
    o.save(); o.translate(TABLE.x, TABLE.y);
    o.fillStyle = 'rgba(70,40,40,0.2)'; o.beginPath(); o.ellipse(2, 30, 36, 5, 0, 0, TAU); o.fill();
    o.strokeStyle = '#8a5a36'; o.lineWidth = 3.4; o.lineCap = 'round'; o.beginPath(); o.moveTo(-24, 4); o.lineTo(-27, 29); o.moveTo(24, 4); o.lineTo(27, 29); o.stroke();
    o.strokeStyle = '#a87046'; o.beginPath(); o.moveTo(-14, 5); o.lineTo(-15, 25); o.moveTo(14, 5); o.lineTo(15, 25); o.stroke();
    const tw = o.createLinearGradient(0, -3, 0, 6); tw.addColorStop(0, '#d8a066'); tw.addColorStop(1, '#9a6640');
    o.fillStyle = tw; o.strokeStyle = INK; o.lineWidth = 1.8; o.beginPath(); o.roundRect(-33, -2, 66, 8, 3); o.fill(); o.stroke();
    o.fillStyle = 'rgba(255,236,200,0.55)'; o.fillRect(-30, -1, 60, 1.4);
    o.restore();
  }
  function background(c) {
    if (!bg) { bg = document.createElement('canvas'); bg.width = W * 2; bg.height = H * 2; const o = bg.getContext('2d'); o.scale(2, 2); paintBg(o); }
    c.drawImage(bg, 0, 0, W, H);
  }

  // ---------- the frog's cycle ----------
  // 0 .. 2.0 s pondering in the tub, 2.0 the bulb lights, 2.2 .. 3.4 the leap, 3.4 the splash, then the next cycle
  const CYC = 5.2, BULB_ON = 2.0, LEAP0 = 2.2, LEAP1 = 3.4;
  function frogState(t) {
    const tau = ((t % CYC) + CYC) % CYC, n = Math.floor(t / CYC);
    let x = TUB.x + 6, y = TUB.y + 8 + Math.sin(t * 2.2) * 1.5, air = 0, u = 0;
    if (tau >= LEAP0 && tau < LEAP1) { u = (tau - LEAP0) / (LEAP1 - LEAP0); air = 1; const h = 4 * u * (1 - u); y = TUB.y + 8 - h * 50; x = TUB.x + 6 + Math.sin(u * Math.PI) * 14; }
    // since the splash; for the first cycle, as if one just happened long ago
    const since = tau >= LEAP1 ? tau - LEAP1 : tau + CYC - LEAP1 + (n === 0 && t < LEAP1 ? 99 : 0);
    return { tau, x, y, air, u, since };
  }

  // ---------- water ----------
  // the water's surface rises while the frog sits in the tub (it pushes aside its own volume) and surges after a splash
  function level(fs) {
    const inTub = fs.air ? clamp(1 - fs.u * 4) + clamp((fs.u - 0.85) / 0.15) : 1;
    return 3 + inTub * 3.5 + Math.max(0, Math.exp(-fs.since * 2.2) * Math.sin(fs.since * 9) * 2.5) + Math.exp(-fs.since * 1.5) * 2;
  }
  function spillRate(fs) { const inTub = fs.air ? clamp(1 - fs.u * 3) : 1; return 0.35 + inTub * 0.4 + Math.exp(-fs.since * 1.2) * 0.9; }
  const WATER = ['#bdeef6', '#7fd2ea', '#46a8d4'];
  function puddle(c, t, fs) {
    const grow = 1 + Math.exp(-fs.since * 0.9) * 0.05, cx = TUB.x, cy = FLOOR + 4;
    c.save();
    const g = c.createRadialGradient(cx - 30, cy - 4, 4, cx, cy, 150 * grow);
    g.addColorStop(0, 'rgba(190,238,250,0.92)'); g.addColorStop(0.6, 'rgba(120,204,236,0.85)'); g.addColorStop(1, 'rgba(84,176,220,0.8)');
    c.fillStyle = g; c.beginPath();
    for (let i = 0; i <= 48; i++) { const a = i / 48 * TAU, wob = 1 + 0.06 * Math.sin(a * 3 + 1.2) + 0.04 * Math.sin(a * 5 + t * 0.6), rx = 140 * grow * wob, ry = 20 * grow * wob; const px = cx + Math.cos(a) * rx, py = cy + Math.sin(a) * ry; i ? c.lineTo(px, py) : c.moveTo(px, py); }
    c.closePath(); c.fill();
    c.strokeStyle = 'rgba(40,120,170,0.45)'; c.lineWidth = 1.6; c.stroke();
    c.save(); c.clip(); c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 2; c.beginPath(); c.ellipse(cx, cy + 2, 136 * grow, 18 * grow, 0, Math.PI * 1.05, Math.PI * 1.95); c.stroke(); c.restore();
    // sky reflected in the puddle
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(cx + 60, cy - 6, 34, 3, -0.05, 0, TAU); c.fill(); c.beginPath(); c.ellipse(cx - 92, cy + 4, 20, 2.2, 0.05, 0, TAU); c.fill();
    // ripples where the streams land
    for (const [rx0, k] of [[TUB.x - 112, 0], [TUB.x + 112, 1]]) for (let j = 0; j < 2; j++) {
      const q = ((t * 0.9 + j * 0.5 + k * 0.25) % 1); c.strokeStyle = `rgba(255,255,255,${0.7 * (1 - q)})`; c.lineWidth = 1.2; c.beginPath(); c.ellipse(rx0, FLOOR + 2, 5 + q * 18, 1.6 + q * 4.2, 0, 0, TAU); c.stroke();
    }
    c.restore();
  }
  // a stream of water arcing off one end of the rim
  function stream(c, t, side, rate) {
    const x0 = TUB.x + side * (TUB.rx - 2), y0 = TUB.y - 1, vx = 34 + rate * 14, gy = 300, T = Math.sqrt(2 * (FLOOR - y0) / gy);
    const pt = q => [x0 + side * vx * q * T, y0 + 0.5 * gy * (q * T) * (q * T)];
    c.save(); c.lineCap = 'round';
    // a ribbon of water: a broad sheet where it pours over the rim, narrowing as it falls
    const N = 16, L = [], R = [];
    for (let i = 0; i <= N; i++) { const q = i / N, [x, y] = pt(q), [x2, y2] = pt(Math.min(1, q + 0.02)), dx = x2 - x, dy = y2 - y, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
      const hw = (3 + rate * 3.6) * (1 - 0.45 * q) + (q < 0.12 ? (0.12 - q) * 30 : 0), wob = Math.sin(q * 11 - t * 14 + side) * 0.7 * q;
      L.push([x + nx * hw + wob, y + ny * hw]); R.push([x - nx * hw + wob, y - ny * hw]); }
    const ribbon = () => { c.beginPath(); L.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); for (let i = R.length - 1; i >= 0; i--) c.lineTo(R[i][0], R[i][1]); c.closePath(); };
    const rg = c.createLinearGradient(x0, y0, x0 + side * 40, FLOOR); rg.addColorStop(0, 'rgba(190,240,252,0.95)'); rg.addColorStop(1, 'rgba(110,196,232,0.75)');
    c.fillStyle = rg; ribbon(); c.fill(); c.strokeStyle = 'rgba(40,110,160,0.55)'; c.lineWidth = 1; c.stroke();
    // streaks of light sliding down it
    c.save(); ribbon(); c.clip(); c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 1.3; c.setLineDash([5, 7]); c.lineDashOffset = -t * 60;
    c.beginPath(); for (let i = 0; i <= N; i++) { const [x, y] = pt(i / N); i ? c.lineTo(x - side * 1.2, y) : c.moveTo(x - side * 1.2, y); } c.stroke(); c.restore();
    // bright beads running down the stream
    c.fillStyle = 'rgba(255,255,255,0.9)';
    for (let k = 0; k < 4; k++) { const q = ((t * 1.6 + k / 4 + (side > 0 ? 0.12 : 0)) % 1), [x, y] = pt(q); c.beginPath(); c.arc(x, y, 1.1 + q * 0.6, 0, TAU); c.fill(); }
    // spray where it hits the floor
    const [lx] = pt(1);
    for (let k = 0; k < 5; k++) { const q = ((t * 1.8 + k * 0.21) % 1), a = -Math.PI / 2 + (k - 2) * 0.45, d = q * (8 + rate * 5), x = lx + Math.cos(a) * d, y = FLOOR + Math.sin(a) * d * 0.9 + q * q * 10;
      c.globalAlpha = 1 - q; c.fillStyle = '#e8fbff'; c.beginPath(); c.arc(x, y, 1.4, 0, TAU); c.fill(); }
    c.restore();
  }

  // ---------- the bathtub ----------
  function foot(c, x, y, s, flip) {
    c.save(); c.translate(x, y); c.scale(s * flip, s);
    const g = c.createLinearGradient(-6, -12, 6, 10); g.addColorStop(0, '#fff2b0'); g.addColorStop(0.45, '#e8b44a'); g.addColorStop(1, '#a86e22');
    c.fillStyle = g; c.strokeStyle = INK; c.lineWidth = 1.8; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(-5, -14); c.quadraticCurveTo(-8, -4, -4, 2); c.quadraticCurveTo(-9, 6, -8, 12); c.lineTo(9, 12); c.quadraticCurveTo(10, 6, 5, 3); c.quadraticCurveTo(8, -6, 6, -14); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(120,70,20,0.7)'; c.lineWidth = 1.1; c.beginPath(); c.moveTo(-3, 12); c.lineTo(-2, 7); c.moveTo(1.5, 12); c.lineTo(1.5, 7); c.moveTo(5.5, 12); c.lineTo(5, 7); c.stroke();
    c.fillStyle = 'rgba(255,255,240,0.7)'; c.beginPath(); c.ellipse(-2.5, -6, 1.4, 4, 0.1, 0, TAU); c.fill();
    c.restore();
  }
  function tubBody(c) {
    const { x, y, rx, depth } = TUB;
    c.save();
    // contact shadow
    c.fillStyle = 'rgba(40,40,80,0.22)'; c.beginPath(); c.ellipse(x + 4, FLOOR + 1, rx * 0.86, 8, 0, 0, TAU); c.fill();
    foot(c, x - 48, FLOOR - 13, 0.8, -1); foot(c, x + 52, FLOOR - 13, 0.8, 1);
    // the shell: a roll-top tub, its ends rising a little higher than the middle
    const body = () => { c.beginPath(); c.moveTo(x - rx, y); c.bezierCurveTo(x - rx + 2, y + depth * 0.7, x - rx + 26, y + depth, x - 40, y + depth); c.lineTo(x + 40, y + depth); c.bezierCurveTo(x + rx - 26, y + depth, x + rx - 2, y + depth * 0.7, x + rx, y); c.closePath(); };
    const g = c.createLinearGradient(x - rx, 0, x + rx, 0); g.addColorStop(0, '#f6a6a0'); g.addColorStop(0.28, '#ffd0c4'); g.addColorStop(0.62, '#f2948e'); g.addColorStop(1, '#c86270');
    c.fillStyle = g; body(); c.fill();
    c.save(); body(); c.clip();
    const v = c.createLinearGradient(0, y, 0, y + depth); v.addColorStop(0, 'rgba(255,255,255,0)'); v.addColorStop(0.7, 'rgba(120,40,80,0.08)'); v.addColorStop(1, 'rgba(90,30,70,0.3)'); c.fillStyle = v; c.fillRect(x - rx, y, rx * 2, depth);
    c.fillStyle = 'rgba(255,255,255,0.45)'; c.beginPath(); c.ellipse(x - 40, y + 26, 26, 8, -0.12, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(x - 52, y + 22, 9, 3, -0.2, 0, TAU); c.fill();
    // a gold band under the rim
    c.fillStyle = 'rgba(232,180,74,0.95)'; c.fillRect(x - rx, y + 9, rx * 2, 3); c.fillStyle = 'rgba(255,240,180,0.8)'; c.fillRect(x - rx, y + 9, rx * 2, 1);
    c.restore();
    c.strokeStyle = INK; c.lineWidth = 2.2; c.lineJoin = 'round'; body(); c.stroke();
    foot(c, x - 66, FLOOR - 9, 1, -1); foot(c, x + 70, FLOOR - 9, 1, 1);
    c.restore();
  }
  function tubRim(c, lev, t) {
    const { x, y, rx, ry } = TUB;
    c.save();
    // the inside, then the water standing up above the rim
    c.fillStyle = '#e8eef4'; c.strokeStyle = INK; c.lineWidth = 2.2; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill(); c.stroke();
    const wy = y - lev;
    const wg = c.createLinearGradient(0, wy - ry, 0, y + ry); wg.addColorStop(0, WATER[0]); wg.addColorStop(0.5, WATER[1]); wg.addColorStop(1, WATER[2]);
    c.fillStyle = wg; c.beginPath(); c.moveTo(x - rx - 1, y);
    c.bezierCurveTo(x - rx + 2, wy - ry * 0.9, x - rx * 0.4, wy - ry, x, wy - ry); c.bezierCurveTo(x + rx * 0.4, wy - ry, x + rx - 2, wy - ry * 0.9, x + rx + 1, y);
    c.bezierCurveTo(x + rx - 4, y + ry * 1.1, x - rx + 4, y + ry * 1.1, x - rx - 1, y); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(40,100,150,0.55)'; c.lineWidth = 1.4; c.stroke();
    // the rolled enamel lip shows through at the front where the water thins over it
    c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 2.4; c.beginPath(); c.ellipse(x, y + 1, rx - 2, ry - 1, 0, 0.15, Math.PI - 0.15); c.stroke();
    // glints and foam on the surface
    c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(x - 34, wy - ry * 0.55, 22, 2.2, -0.04, 0, TAU); c.fill();
    for (let i = 0; i < 9; i++) { const a = i * 0.71 + t * 0.25, px = x + Math.cos(a * 1.7) * rx * 0.72, py = wy - ry * 0.2 + Math.sin(a * 2.3) * ry * 0.45 + 2, r = 2 + (i % 3) * 1.3 + Math.sin(t * 2 + i) * 0.5;
      c.fillStyle = 'rgba(255,255,255,0.85)'; c.strokeStyle = 'rgba(120,190,220,0.7)'; c.lineWidth = 0.8; c.beginPath(); c.arc(px, py, r, 0, TAU); c.fill(); c.stroke(); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(px - r * 0.35, py - r * 0.35, r * 0.3, 0, TAU); c.fill(); }
    c.restore();
  }
  // thin sheets of water running down the front of the tub
  function rivulets(c, t, rate) {
    const { x, y, depth } = TUB;
    c.save(); c.lineCap = 'round';
    for (const [dx, k] of [[-50, 0], [22, 2], [62, 3]]) {
      const len = depth * (0.3 + 0.18 * Math.sin(t * 0.8 + k * 1.7) + rate * 0.14), x0 = x + dx, y0 = y + 11;
      const bend = Math.abs(dx) / TUB.rx;
      c.strokeStyle = 'rgba(150,220,246,0.42)'; c.lineWidth = 2.6; c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(x0 + Math.sign(dx) * bend * 4, y0 + len * 0.5, x0 + Math.sign(dx) * bend * 7, y0 + len); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 0.9; c.beginPath(); c.moveTo(x0 - 0.8, y0); c.quadraticCurveTo(x0 + Math.sign(dx) * bend * 4 - 0.8, y0 + len * 0.5, x0 + Math.sign(dx) * bend * 7 - 0.8, y0 + len); c.stroke();
      const q = (t * 0.7 + k * 0.29) % 1; c.fillStyle = 'rgba(190,240,255,0.95)'; c.beginPath(); c.ellipse(x0 + Math.sign(dx) * bend * 7 * q, y0 + len * q, 1.8, 2.4, 0, 0, TAU); c.fill();
    }
    c.restore();
  }
  // droplets thrown up by the splash
  const DROPS = Array.from({ length: 16 }, (_, i) => { const r = P.rng(i * 13 + 5); r(); return { a: -Math.PI / 2 + (r() - 0.5) * 2.4, v: 90 + r() * 110, s: 1.6 + r() * 2 }; });
  function splash(c, fs) {
    const s = fs.since; if (s > 1.3) return;
    c.save();
    for (const d of DROPS) { const x = TUB.x + 6 + Math.cos(d.a) * d.v * s, y = TUB.y - 4 + Math.sin(d.a) * d.v * s + 260 * s * s; if (y > FLOOR) continue;
      c.globalAlpha = clamp(1.4 - s); c.fillStyle = '#dff7ff'; c.strokeStyle = 'rgba(50,130,180,0.6)'; c.lineWidth = 0.8; c.beginPath(); c.ellipse(x, y, d.s, d.s * 1.25, 0, 0, TAU); c.fill(); c.stroke(); }
    // the crown of the splash
    if (s < 0.5) { const q = s / 0.5; c.globalAlpha = 1 - q; c.strokeStyle = '#ffffff'; c.lineWidth = 2.2; c.beginPath(); c.ellipse(TUB.x + 6, TUB.y - 6, 18 + q * 40, 4 + q * 7, 0, Math.PI, TAU); c.stroke(); }
    c.restore();
  }

  // ---------- the lightbulb ----------
  function bulb(c, x, y, k, t) {
    if (k <= 0) return;
    c.save(); c.translate(x, y); const pop = k < 1 ? ease(k) * (1 + 0.25 * Math.sin(k * Math.PI)) : 1; c.scale(pop, pop);
    // glow and rays
    c.save(); c.globalCompositeOperation = 'lighter';
    const gl = c.createRadialGradient(0, -2, 2, 0, -2, 46); gl.addColorStop(0, 'rgba(255,240,150,0.7)'); gl.addColorStop(0.4, 'rgba(255,220,100,0.25)'); gl.addColorStop(1, 'rgba(255,220,100,0)'); c.fillStyle = gl; c.fillRect(-46, -48, 92, 92);
    c.restore();
    c.strokeStyle = '#ffd84a'; c.lineWidth = 2.6; c.lineCap = 'round';
    for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + Math.sin(t * 2) * 0.08 - Math.PI / 2, r0 = 16 + Math.sin(t * 9 + i) * 1.5, r1 = r0 + 6 + (i % 2) * 3; c.beginPath(); c.moveTo(Math.cos(a) * r0, -2 + Math.sin(a) * r0); c.lineTo(Math.cos(a) * r1, -2 + Math.sin(a) * r1); c.stroke(); }
    // glass
    const g = c.createRadialGradient(-3, -6, 1, 0, -2, 12); g.addColorStop(0, '#fffef0'); g.addColorStop(0.5, '#fff19a'); g.addColorStop(1, '#ffc838');
    c.fillStyle = g; c.strokeStyle = INK; c.lineWidth = 1.8; c.beginPath(); c.arc(0, -3, 10, Math.PI * 0.78, Math.PI * 2.22); c.lineTo(4, 9); c.lineTo(-4, 9); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = '#e08a20'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-3, 8); c.lineTo(-2, 0); c.quadraticCurveTo(0, -4, 2, 0); c.lineTo(3, 8); c.stroke();
    c.fillStyle = '#b8b0c8'; c.strokeStyle = INK; c.lineWidth = 1.5; c.beginPath(); c.roundRect(-4.5, 9, 9, 6, 1.5); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(90,80,110,0.8)'; c.lineWidth = 1; c.beginPath(); c.moveTo(-4, 11); c.lineTo(4, 11); c.moveTo(-4, 13); c.lineTo(4, 13); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.85)'; c.beginPath(); c.ellipse(-4, -7, 2, 3.4, -0.5, 0, TAU); c.fill();
    c.restore();
  }

  // ---------- the props ----------
  function planet(c, t) {
    const x = 52, y = 262, R = 14, ma = t * 0.9, mx = x + Math.cos(ma) * 30, my = y + Math.sin(ma) * 9, back = Math.sin(ma) < 0;
    const moon = () => { c.fillStyle = '#f4f0ff'; c.strokeStyle = INK; c.lineWidth = 1.4; c.beginPath(); c.arc(mx, my, 4.2, 0, TAU); c.fill(); c.stroke(); c.fillStyle = 'rgba(160,150,200,0.6)'; c.beginPath(); c.arc(mx + 1.2, my + 0.8, 1.2, 0, TAU); c.fill(); };
    c.save();
    if (back) moon();
    // the ring's far half, the ball, the ring's near half
    c.save(); c.translate(x, y); c.rotate(-0.32);
    c.strokeStyle = INK; c.lineWidth = 5.4; c.beginPath(); c.ellipse(0, 0, R * 1.75, R * 0.48, 0, Math.PI, TAU); c.stroke(); c.strokeStyle = '#ffe2a0'; c.lineWidth = 3; c.stroke();
    const g = c.createRadialGradient(-R * 0.4, -R * 0.45, 1, 0, 0, R); g.addColorStop(0, '#ffd8c0'); g.addColorStop(0.55, '#f49a7a'); g.addColorStop(1, '#c8607a');
    c.fillStyle = g; c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill();
    c.save(); c.clip(); c.fillStyle = 'rgba(255,240,220,0.45)'; c.fillRect(-R, -R * 0.35, R * 2, 3); c.fillStyle = 'rgba(160,60,90,0.25)'; c.fillRect(-R, R * 0.3, R * 2, 3.5); c.restore();
    c.stroke();
    c.strokeStyle = INK; c.lineWidth = 5.4; c.beginPath(); c.ellipse(0, 0, R * 1.75, R * 0.48, 0, 0, Math.PI); c.stroke(); c.strokeStyle = '#ffe2a0'; c.lineWidth = 3; c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 1; c.beginPath(); c.ellipse(0, 0, R * 1.75, R * 0.48, 0, 0.3, 1.2); c.stroke();
    c.restore();
    if (!back) moon();
    c.restore();
  }
  // a rocket lifts off the island every 9 s, leaving puffs that linger and drift
  const RCYC = 9;
  function rocketPos(u) { const e = u * u; return [ROCKET_PAD.x - e * 22, ROCKET_PAD.y - 4 - e * 190, -e * 0.35]; }
  function rocket(c, t) {
    const tau = ((t % RCYC) + RCYC) % RCYC, u = clamp((tau - 1.5) / 4.5);
    c.save();
    // smoke puffs along the path
    for (let i = 0; i < 12; i++) { const ui = i / 12 * u; if (ui <= 0) continue; const [px, py] = rocketPos(ui), age = (u - ui) * 4.5;
      c.globalAlpha = clamp(0.75 - age * 0.16) * clamp(1.3 - tau / RCYC); if (c.globalAlpha <= 0) continue; const r = 2.4 + age * 1.6 + ui * 3;
      c.fillStyle = '#ffffff'; c.beginPath(); c.arc(px + Math.sin(i * 2.1 + age) * age * 2, py + 7 + age * 1.5, r, 0, TAU); c.fill(); }
    c.globalAlpha = 1;
    const [x, y, rot] = rocketPos(u), s = 0.9 - u * 0.35, a = u >= 1 ? 0 : tau < 0.6 ? tau / 0.6 : 1 - clamp((u - 0.85) / 0.15);
    if (a > 0) {
      c.globalAlpha = a; c.translate(x, y); c.rotate(rot); c.scale(s, s);
      if (u > 0) { const fl = 7 + Math.sin(t * 40) * 2 + u * 5; c.fillStyle = '#ffb030'; c.beginPath(); c.moveTo(-3, 6); c.quadraticCurveTo(0, 6 + fl * 1.4, 3, 6); c.closePath(); c.fill(); c.fillStyle = '#fff3a0'; c.beginPath(); c.moveTo(-1.6, 6); c.quadraticCurveTo(0, 6 + fl * 0.8, 1.6, 6); c.closePath(); c.fill(); }
      c.fillStyle = '#e8506a'; c.strokeStyle = INK; c.lineWidth = 1.4; c.lineJoin = 'round';
      c.beginPath(); c.moveTo(-4, 2); c.lineTo(-7.5, 8); c.lineTo(-3.5, 6.5); c.closePath(); c.fill(); c.stroke(); c.beginPath(); c.moveTo(4, 2); c.lineTo(7.5, 8); c.lineTo(3.5, 6.5); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#fbf6ff'; c.beginPath(); c.moveTo(0, -14); c.quadraticCurveTo(5.5, -7, 4.2, 6.5); c.lineTo(-4.2, 6.5); c.quadraticCurveTo(-5.5, -7, 0, -14); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#e8506a'; c.beginPath(); c.moveTo(0, -14); c.quadraticCurveTo(3.3, -10, 3.9, -7.5); c.lineTo(-3.9, -7.5); c.quadraticCurveTo(-3.3, -10, 0, -14); c.closePath(); c.fill();
      c.fillStyle = '#7cd0f0'; c.beginPath(); c.arc(0, -2, 2.2, 0, TAU); c.fill(); c.stroke();
    }
    c.restore();
  }
  function flask(c, t) {
    const x = TABLE.x - 14, y = TABLE.y - 2;
    c.save(); c.translate(x, y);
    // bubbles rising out of the neck
    for (let i = 0; i < 5; i++) { const q = ((t * 0.55 + i / 5) % 1), bx = Math.sin(q * 7 + i * 2) * 4 + (i - 2) * 1.2, by = -26 - q * 40, r = 1.6 + q * 3;
      c.globalAlpha = clamp((1 - q) * 2.2) * clamp(q * 6); c.fillStyle = 'rgba(214,255,206,0.6)'; c.strokeStyle = 'rgba(70,150,90,0.8)'; c.lineWidth = 1; c.beginPath(); c.arc(bx, by, r, 0, TAU); c.fill(); c.stroke(); c.fillStyle = '#fff'; c.beginPath(); c.arc(bx - r * 0.35, by - r * 0.35, r * 0.28, 0, TAU); c.fill(); }
    c.globalAlpha = 1;
    const shape = () => { c.beginPath(); c.moveTo(-3.5, -24); c.lineTo(-3.5, -14); c.lineTo(-13, 0); c.quadraticCurveTo(-14, 1.5, -12, 1.5); c.lineTo(12, 1.5); c.quadraticCurveTo(14, 1.5, 13, 0); c.lineTo(3.5, -14); c.lineTo(3.5, -24); c.closePath(); };
    c.fillStyle = 'rgba(235,250,255,0.55)'; shape(); c.fill();
    c.save(); shape(); c.clip();
    const ly = -7 + Math.sin(t * 3) * 0.8;
    const lg = c.createLinearGradient(0, ly, 0, 2); lg.addColorStop(0, '#9af07a'); lg.addColorStop(1, '#3aa45a'); c.fillStyle = lg; c.beginPath(); c.moveTo(-16, ly); for (let i = 0; i <= 8; i++) c.lineTo(-16 + i * 4, ly + Math.sin(t * 5 + i) * 0.8); c.lineTo(16, 3); c.lineTo(-16, 3); c.closePath(); c.fill();
    for (let i = 0; i < 4; i++) { const q = ((t * 1.3 + i * 0.27) % 1); c.fillStyle = 'rgba(255,255,255,0.75)'; c.beginPath(); c.arc(-6 + i * 4, 0 - q * 7, 0.9 + q * 0.6, 0, TAU); c.fill(); }
    c.restore();
    c.strokeStyle = INK; c.lineWidth = 1.8; c.lineJoin = 'round'; shape(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(-7, -5, 1.4, 4.2, 0.55, 0, TAU); c.fill();
    c.strokeStyle = INK; c.fillStyle = '#f4fbff'; c.beginPath(); c.roundRect(-5, -27, 10, 3.4, 1.5); c.fill(); c.stroke();
    c.restore();
  }
  function dna(c, t) {
    const x = TABLE.x + 16, y0 = TABLE.y - 4, h = 46, n = 9;
    c.save();
    c.fillStyle = '#9a6640'; c.strokeStyle = INK; c.lineWidth = 1.5; c.beginPath(); c.roundRect(x - 8, y0 - 3, 16, 4, 1.5); c.fill(); c.stroke();
    c.strokeStyle = '#8a8098'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x, y0 - 3); c.lineTo(x, y0 - h - 6); c.stroke();
    const pts = []; for (let i = 0; i <= n; i++) { const yy = y0 - 6 - i * (h - 4) / n, a = t * 1.6 + i * 0.75; pts.push({ y: yy, a, xa: x + Math.sin(a) * 8, xb: x - Math.sin(a) * 8, za: Math.cos(a) }); }
    const RUNG = ['#ff7a8a', '#ffd04a', '#6ad0f0', '#8ae06a'];
    // rungs first, then the strand behind and the strand in front
    for (let i = 0; i <= n; i++) { const p = pts[i]; c.strokeStyle = RUNG[i % 4]; c.lineWidth = 2; c.beginPath(); c.moveTo(p.xa, p.y); c.lineTo(p.xb, p.y); c.stroke(); }
    for (const [key, sign, col] of [['xa', 1, '#5a7ae0'], ['xb', -1, '#e0508a']]) {
      for (let i = 0; i < n; i++) { const p = pts[i], q = pts[i + 1], z = sign * (p.za + q.za) / 2; c.strokeStyle = z < 0 ? P.shade(col, -0.35) : col; c.lineWidth = z < 0 ? 2.4 : 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(p[key], p.y); c.lineTo(q[key], q.y); c.stroke(); }
    }
    c.restore();
  }
  function gear(c, x, y, r, teeth, ang, col) {
    c.save(); c.translate(x, y); c.rotate(ang);
    c.fillStyle = col; c.strokeStyle = INK; c.lineWidth = 1.5; c.lineJoin = 'round'; c.beginPath();
    for (let i = 0; i < teeth; i++) { const a0 = i * TAU / teeth, d = TAU / teeth; for (const [f, rr] of [[0, r - 2], [0.18, r + 2.2], [0.5, r + 2.2], [0.68, r - 2]]) { const a = a0 + f * d; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } }
    c.closePath(); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.arc(-r * 0.2, -r * 0.25, r * 0.5, 0, TAU); c.fill();
    c.fillStyle = '#5a4a6a'; c.beginPath(); c.arc(0, 0, r * 0.3, 0, TAU); c.fill(); c.stroke();
    c.restore();
  }
  function robotArm(c, t, fs) {
    const { x, y } = ARM;
    c.save();
    c.fillStyle = 'rgba(40,30,60,0.22)'; c.beginPath(); c.ellipse(x + 2, y + 2, 30, 5, 0, 0, TAU); c.fill();
    // the base, with a gear train turning on its side (big drives small, so the small one turns faster the other way)
    const bg2 = c.createLinearGradient(x - 24, 0, x + 24, 0); bg2.addColorStop(0, '#a8bcd8'); bg2.addColorStop(1, '#6a7ea4');
    c.fillStyle = bg2; c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.roundRect(x - 24, y - 26, 48, 27, 5); c.fill(); c.stroke();
    const w = t * 1.2;
    gear(c, x - 10, y - 13, 8, 10, w, '#f4c04a');
    gear(c, x + 6.2, y - 17, 5, 6, -w * 10 / 6 + 0.3, '#ff8a6a');
    gear(c, x + 11.6, y - 6, 4.2, 6, w * 10 / 6 * 1, '#7ad08a');
    // shoulder, upper arm, elbow, forearm and gripper, swinging gently and waving toward the tub when the frog leaps
    const cheer = fs.air ? Math.sin(fs.u * Math.PI) : 0;
    const a1 = -2.15 + Math.sin(t * 0.9) * 0.12 - cheer * 0.25, a2 = a1 + 0.9 + Math.sin(t * 1.3 + 1) * 0.25 - cheer * 0.4;
    const sx = x, sy = y - 30, ex = sx + Math.cos(a1) * 38, ey = sy + Math.sin(a1) * 38, hx = ex + Math.cos(a2) * 30, hy = ey + Math.sin(a2) * 30;
    const seg = (ax, ay, bx, by, wd) => { c.lineCap = 'round'; c.strokeStyle = INK; c.lineWidth = wd + 3.6; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); c.strokeStyle = '#ffb23e'; c.lineWidth = wd; c.stroke(); c.strokeStyle = 'rgba(255,240,190,0.8)'; c.lineWidth = wd * 0.3; c.beginPath(); c.moveTo(ax - 1, ay - 1.5); c.lineTo(bx - 1, by - 1.5); c.stroke(); };
    c.fillStyle = '#8a9cc0'; c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.roundRect(sx - 9, sy - 2, 18, 6, 2); c.fill(); c.stroke();
    seg(sx, sy, ex, ey, 8); seg(ex, ey, hx, hy, 6.5);
    for (const [jx, jy, r] of [[sx, sy, 6], [ex, ey, 5]]) { c.fillStyle = '#d8e2f2'; c.strokeStyle = INK; c.lineWidth = 1.8; c.beginPath(); c.arc(jx, jy, r, 0, TAU); c.fill(); c.stroke(); c.fillStyle = '#6a7ea4'; c.beginPath(); c.arc(jx, jy, r * 0.4, 0, TAU); c.fill(); }
    // the wrist stays level; its claw pinches a striped towel that hangs straight down, ready for the frog
    const sway = Math.sin(t * 1.7) * 0.06;
    c.save(); c.translate(hx, hy + 6); c.rotate(sway);
    c.fillStyle = '#ffb0c0'; c.strokeStyle = INK; c.lineWidth = 1.6; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(-7, 0); c.lineTo(7, 0); c.quadraticCurveTo(9, 12, 8 + Math.sin(t * 2) * 0.8, 24); c.lineTo(-8 + Math.sin(t * 2 + 1) * 0.8, 24); c.quadraticCurveTo(-9, 12, -7, 0); c.closePath(); c.fill();
    c.save(); c.clip(); c.fillStyle = '#ffffff'; c.fillRect(-10, 15, 20, 2.6); c.fillRect(-10, 19.5, 20, 1.4); c.fillStyle = 'rgba(160,60,100,0.18)'; c.fillRect(2, 0, 8, 26); c.restore(); c.stroke();
    c.restore();
    c.save(); c.translate(hx, hy);
    c.fillStyle = '#8a9cc0'; c.strokeStyle = INK; c.lineWidth = 1.6; c.beginPath(); c.roundRect(-6, -1, 12, 5, 2); c.fill(); c.stroke();
    c.strokeStyle = INK; c.lineWidth = 2.4; c.lineCap = 'round'; for (const sg of [-1, 1]) { c.beginPath(); c.moveTo(sg * 4.5, 3); c.quadraticCurveTo(sg * 6, 7, sg * 2.2, 8.5); c.stroke(); }
    c.strokeStyle = '#d8e2f2'; c.lineWidth = 1; for (const sg of [-1, 1]) { c.beginPath(); c.moveTo(sg * 4.5, 3); c.quadraticCurveTo(sg * 6, 7, sg * 2.2, 8.5); c.stroke(); }
    c.restore();
    c.fillStyle = '#d8e2f2'; c.strokeStyle = INK; c.lineWidth = 1.6; c.beginPath(); c.arc(hx, hy - 1, 3.4, 0, TAU); c.fill(); c.stroke();
    c.restore();
  }
  // the laptop's screen shows a few coloured lines of code and a blinking cursor at the end of the last one
  function laptop(c, t) {
    const x = 50, y = 622;
    c.save(); c.translate(x, y);
    c.fillStyle = 'rgba(50,30,50,0.22)'; c.beginPath(); c.ellipse(2, 3, 34, 4.5, 0, 0, TAU); c.fill();
    // the screen, tilted back
    c.fillStyle = '#4a4a6a'; c.strokeStyle = INK; c.lineWidth = 2; c.lineJoin = 'round'; c.beginPath(); c.moveTo(-25, -4); c.lineTo(-22, -38); c.lineTo(22, -38); c.lineTo(25, -4); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#1e2440'; c.beginPath(); c.moveTo(-21, -7); c.lineTo(-19, -34); c.lineTo(19, -34); c.lineTo(21, -7); c.closePath(); c.fill();
    const lines = [[['#ff8aa8', 7], ['#ffe08a', 12]], [['#8ae0ff', 5], ['#c0f0a0', 14]], [['#ffe08a', 9], ['#ff8aa8', 6]], [['#c0f0a0', 11]]];
    lines.forEach((ln, i) => { let lx = -16 + (i === 1 || i === 2 ? 4 : 0); const ly = -30 + i * 5.6; for (const [col, w] of ln) { c.fillStyle = col; c.fillRect(lx, ly, w, 2.4); lx += w + 2; } if (i === 3 && Math.floor(t * 2.2) % 2 === 0) { c.fillStyle = '#ffffff'; c.fillRect(lx, ly - 1, 3, 4.4); } });
    c.fillStyle = 'rgba(255,255,255,0.08)'; c.beginPath(); c.moveTo(-19, -34); c.lineTo(-4, -34); c.lineTo(-14, -7); c.lineTo(-21, -7); c.closePath(); c.fill();
    // the keyboard deck
    c.fillStyle = '#c8cce0'; c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.moveTo(-25, -4); c.lineTo(25, -4); c.lineTo(31, 3); c.lineTo(-31, 3); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = 'rgba(90,90,130,0.45)'; for (let i = 0; i < 9; i++) c.fillRect(-21 + i * 4.8, -2.2, 3.4, 1.6); for (let i = 0; i < 10; i++) c.fillRect(-25 + i * 5.2, 0.2, 3.8, 1.6);
    c.restore();
  }
  // a battery, two wires and a bulb that glows, with charges running round the loop
  function circuit(c, t) {
    const x = 262, y = 626;
    c.save(); c.translate(x, y);
    c.fillStyle = 'rgba(50,30,50,0.2)'; c.beginPath(); c.ellipse(0, 3, 30, 4, 0, 0, TAU); c.fill();
    const loop = [[-14, -2], [-14, -20], [10, -20], [10, -10]]; // battery top to bulb
    c.strokeStyle = INK; c.lineWidth = 3.6; c.lineJoin = 'round'; c.lineCap = 'round'; c.beginPath(); loop.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.stroke();
    c.beginPath(); c.moveTo(-8, 1); c.lineTo(10, 1); c.lineTo(10, -3); c.stroke();
    c.strokeStyle = '#e8803a'; c.lineWidth = 1.8; c.beginPath(); loop.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.stroke(); c.beginPath(); c.moveTo(-8, 1); c.lineTo(10, 1); c.lineTo(10, -3); c.stroke();
    // charges moving along the wire
    const path = [[-14, -2], [-14, -20], [10, -20], [10, -10]], segL = [18, 24, 10], tot = 52;
    for (let k = 0; k < 4; k++) { let d = ((t * 16 + k * 13) % tot), i = 0; while (i < 2 && d > segL[i]) { d -= segL[i]; i++; } const [ax, ay] = path[i], [bx, by] = path[i + 1], q = Math.min(1, d / segL[i]);
      c.fillStyle = '#fff6a0'; c.beginPath(); c.arc(ax + (bx - ax) * q, ay + (by - ay) * q, 1.3, 0, TAU); c.fill(); }
    // battery
    c.fillStyle = '#4a4a6a'; c.strokeStyle = INK; c.lineWidth = 1.6; c.beginPath(); c.roundRect(-20, -4, 13, 9, 2); c.fill(); c.stroke();
    c.fillStyle = '#ff8a4a'; c.beginPath(); c.roundRect(-20, -4, 5, 9, 2); c.fill(); c.stroke();
    c.fillStyle = '#d8d0e0'; c.fillRect(-23, -1.5, 3, 4);
    // the bulb
    const glow = 0.75 + 0.25 * Math.sin(t * 3);
    c.save(); c.globalCompositeOperation = 'lighter'; const gl = c.createRadialGradient(10, -14, 1, 10, -14, 22); gl.addColorStop(0, `rgba(255,236,140,${0.6 * glow})`); gl.addColorStop(1, 'rgba(255,220,120,0)'); c.fillStyle = gl; c.fillRect(-12, -36, 44, 44); c.restore();
    c.fillStyle = '#fff3a0'; c.strokeStyle = INK; c.lineWidth = 1.5; c.beginPath(); c.arc(10, -15, 5.5, 0, TAU); c.fill(); c.stroke();
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(8.4, -16.6, 1.6, 0, TAU); c.fill();
    c.fillStyle = '#b8b0c8'; c.beginPath(); c.roundRect(7, -10, 6, 4, 1); c.fill(); c.stroke();
    c.restore();
  }
  // a glass jar of coins; every 4 s one more coin flips in with a glint
  function coinJar(c, t) {
    const x = 326, y = 626;
    c.save(); c.translate(x, y);
    c.fillStyle = 'rgba(50,30,50,0.22)'; c.beginPath(); c.ellipse(1, 2, 18, 3.5, 0, 0, TAU); c.fill();
    const coin = (cx, cy, rx, ry) => { c.fillStyle = '#c88a20'; c.beginPath(); c.ellipse(cx, cy + 1.2, rx, ry, 0, 0, TAU); c.fill(); c.fillStyle = '#ffd24a'; c.strokeStyle = '#8a5a10'; c.lineWidth = 0.9; c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, TAU); c.fill(); c.stroke(); };
    for (const [cx, cy] of [[-7, -3], [1, -3.5], [8, -3], [-4, -6.5], [5, -7], [-1, -10], [-8, -9.5], [7, -10.5]]) coin(cx, cy, 4.6, 1.8);
    // the jar
    const jar = () => { c.beginPath(); c.moveTo(-11, -30); c.quadraticCurveTo(-15, -26, -14, -18); c.lineTo(-14, -2); c.quadraticCurveTo(-14, 1.5, -10, 1.5); c.lineTo(10, 1.5); c.quadraticCurveTo(14, 1.5, 14, -2); c.lineTo(14, -18); c.quadraticCurveTo(15, -26, 11, -30); c.closePath(); };
    c.fillStyle = 'rgba(220,244,255,0.35)'; jar(); c.fill(); c.strokeStyle = INK; c.lineWidth = 1.8; jar(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.ellipse(-9, -16, 1.6, 8, 0, 0, TAU); c.fill();
    c.fillStyle = '#c89a6a'; c.strokeStyle = INK; c.lineWidth = 1.6; c.beginPath(); c.roundRect(-12, -34, 24, 5, 2); c.fill(); c.stroke();
    c.fillStyle = '#4a2a40'; c.fillRect(-4, -33, 8, 1.6);
    // the coin flipping in through the slot
    const tau = t % 4;
    if (tau < 0.9) { const q = tau / 0.9, cx = 16 - q * 16, cy = -62 + 28 * q - 16 * Math.sin(q * Math.PI), sq = Math.abs(Math.cos(t * 14)); if (q < 0.95) { c.save(); c.translate(cx, cy); c.fillStyle = '#ffd24a'; c.strokeStyle = '#8a5a10'; c.lineWidth = 1; c.beginPath(); c.ellipse(0, 0, 5 * sq + 0.8, 5, 0, 0, TAU); c.fill(); c.stroke(); c.restore(); } }
    const gl = Math.pow(Math.max(0, Math.sin(((t % 4) - 0.9) * 3)), 2) * (t % 4 > 0.9 && t % 4 < 2 ? 1 : 0);
    if (gl > 0.02) { c.save(); c.translate(4, -38); c.globalAlpha = gl; c.fillStyle = '#ffffff'; c.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 1.4 : 6, a = i * Math.PI / 4; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); c.restore(); }
    c.restore();
  }

  // ---------- the lettering ----------
  // Each glyph is painted once into its own sprite (a soft drop shadow, a deep plum extrusion, a thick outline, a warm
  // gradient fill and a glossy top), then the glyphs bob and sway on their own. Neither bundled font has ē, so the
  // macron is painted as a slim bar in the same style, sitting just above the e and moving with it.
  const GLY = new Map();
  const FILLS = { letter: ['#fff8e2', '#ffd65e', '#ff9e3a'], bang: ['#ffe48a', '#ff9c4a', '#ff6a3a'] };
  function glyphSprite(ch, size, fill, k) {
    const key = ch + size + fill.join() + k; let g = GLY.get(key); if (g) return g;
    const m = document.createElement('canvas').getContext('2d'); m.font = FONT(size); const w = ch === '¯' ? m.measureText('e').width * 0.78 : m.measureText(ch).width;
    const pad = size * 0.32, cw = w + pad * 2, ch2 = size * 1.6;
    g = document.createElement('canvas'); g.width = Math.ceil(cw * k); g.height = Math.ceil(ch2 * k); g.cw = cw; g.ch = ch2; g.ox = pad + w / 2; g.oy = ch2 * 0.5;
    const o = g.getContext('2d'); o.scale(k, k); o.translate(g.ox, g.oy); o.font = FONT(size); o.textAlign = 'center'; o.textBaseline = 'middle'; o.lineJoin = 'round';
    const lw = size * 0.2;
    // the shape: a glyph of the font, or the macron's rounded bar
    const bar = (dx, dy) => { o.beginPath(); o.roundRect(-w / 2 + dx, -size * 0.05 + dy, w, size * 0.1, size * 0.05); };
    const strokeIt = (dx, dy) => { if (ch === '¯') { bar(dx, dy); o.stroke(); } else o.strokeText(ch, dx, dy); };
    const fillIt = (dx, dy) => { if (ch === '¯') { bar(dx, dy); o.fill(); } else o.fillText(ch, dx, dy); };
    o.save(); o.shadowColor = 'rgba(58,22,64,0.35)'; o.shadowBlur = size * 0.12; o.shadowOffsetY = size * 0.1; o.strokeStyle = INK; o.lineWidth = lw; strokeIt(size * 0.03, size * 0.09); o.restore();
    for (let i = 7; i >= 1; i--) { o.strokeStyle = o.fillStyle = i > 3 ? INK : '#5a2a66'; o.lineWidth = lw; strokeIt(i * size * 0.004, i * size * 0.012); fillIt(i * size * 0.004, i * size * 0.012); }
    o.strokeStyle = INK; o.lineWidth = lw; strokeIt(0, 0);
    const span = ch === '¯' ? [-size * 0.3, size * 0.5] : [-size * 0.38, size * 0.36];
    const fg = o.createLinearGradient(0, span[0], 0, span[1]); fg.addColorStop(0, fill[0]); fg.addColorStop(0.55, fill[1]); fg.addColorStop(1, fill[2]); o.fillStyle = fg; fillIt(0, 0);
    if (ch !== '¯') { o.save(); o.beginPath(); o.rect(-w, -size, w * 2, size * 0.66); o.clip(); o.globalAlpha = 0.45; o.fillStyle = '#ffffff'; fillIt(0, 0); o.restore(); }
    o.save(); o.globalCompositeOperation = 'source-atop'; o.fillStyle = 'rgba(255,255,255,0.7)'; o.beginPath(); o.ellipse(-w * 0.2, ch === '¯' ? -size * 0.03 : -size * 0.27, w * 0.16, size * 0.035, -0.2, 0, TAU); o.fill(); o.restore();
    GLY.set(key, g); if (GLY.size > 40) GLY.delete(GLY.keys().next().value); return g;
  }
  function lettering(c, text, cx, cy, t) {
    // split off combining or precomposed macrons: ē becomes e with a painted bar over it
    const chars = [], mac = [];
    for (const ch of [...text.normalize('NFD')]) { if (ch === '̄') { mac[chars.length - 1] = true; continue; } chars.push(ch); }
    c.save(); c.font = FONT(100); c.textBaseline = 'middle';
    const adv = chars.map(ch => c.measureText(ch).width); const total100 = adv.reduce((a, b) => a + b, 0) + 4 * (chars.length - 1);
    const size = Math.max(40, Math.min(104, 100 * 312 / total100)), sc = size / 100;
    let eAsc = size * 0.27; try { const mm = c.measureText('e'); if (mm.actualBoundingBoxAscent > 0) eAsc = mm.actualBoundingBoxAscent * sc; } catch (e) { }
    let k = 2; try { const tm = c.getTransform(); k = Math.min(4, Math.max(1, Math.ceil(Math.hypot(tm.a, tm.b) * 2) / 2)); } catch (e) { }
    let x = cx - total100 * sc / 2;
    c.translate(cx, cy); c.rotate(-0.05); c.translate(-cx, -cy);
    chars.forEach((ch, i) => {
      const a = adv[i] * sc, gx = x + a / 2; x += a + 4 * sc;
      const fill = ch === '!' ? FILLS.bang : FILLS.letter, g = glyphSprite(ch, Math.round(size), fill, k);
      const bob = Math.sin(t * 2.6 - i * 0.55) * 3.2, rot = Math.sin(t * 2 - i * 0.7) * 0.04, pop = 1 + 0.07 * Math.pow(Math.max(0, Math.sin(t * 1.6 - i * 0.45)), 12);
      c.save(); c.translate(gx, cy + bob + size * 0.04); c.rotate(rot); c.scale(pop, pop); c.drawImage(g, -g.ox, -g.oy, g.cw, g.ch);
      if (mac[i]) {
        // the macron sits just above the e, about as high as the top of the k
        const mg = glyphSprite('¯', Math.round(size), FILLS.letter, k), my = -(eAsc + size * 0.17);
        c.save(); c.translate(0, my); c.drawImage(mg, -mg.ox, -mg.oy, mg.cw, mg.ch); c.restore();
      }
      c.restore();
    });
    // a twinkle on the first letter
    const tw = Math.pow(Math.max(0, Math.sin(t * 1.3)), 6);
    if (tw > 0.02) { const sx = cx - total100 * sc / 2 + adv[0] * sc * 0.22, sy = cy - size * 0.36; c.save(); c.translate(sx, sy); c.rotate(t); c.globalAlpha = tw; c.fillStyle = '#ffffff'; c.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 2 : 10 * (0.6 + tw * 0.4), a = i * Math.PI / 4; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); c.restore(); }
    c.restore();
  }

  // ---------- the scene ----------
  function frog(c, t, fs) {
    const think = fs.tau < BULB_ON, wow = fs.tau >= BULB_ON && fs.tau < LEAP0;
    const o = { t, phase: 0.4, noShadow: true, pose: fs.air ? 'cheer' : wow ? 'idle' : 'idle', expr: fs.air ? 'laugh' : wow ? 'wow' : think && fs.since > 0.9 ? 'think' : 'laugh' };
    return an(c, 'frog', fs.x, fs.y, 0.96, o);
  }
  function draw(c, t) {
    background(c);
    for (const [x0, y, s, sp] of [[40, 92, 0.72, 3], [250, 52, 0.4, 4.2], [-60, 384, 0.3, 3.6]]) { const x = ((x0 + t * sp) % 520 + 520) % 520 - 80; P.cloud(c, x, y, s, '#ffffff', '#cfe0f2', 0.95); }
    P.water(c, W, SEA.top, SEA.bot - 1, '#2a7cb4', '#8ed4ea', t, { waves: 3 });
    // a sailboat drifting across the bay
    { const bx = ((t * 5 + 60) % 420) - 30, by = SEA.top + 14 + Math.sin(t * 1.4) * 0.8; c.save(); c.translate(bx, by); c.fillStyle = '#fff8ec'; c.beginPath(); c.moveTo(0, -1); c.lineTo(0, -15); c.lineTo(9, -2); c.closePath(); c.fill(); c.fillStyle = '#ffb0a0'; c.beginPath(); c.moveTo(-1, -2); c.lineTo(-1, -11); c.lineTo(-6, -2); c.closePath(); c.fill(); c.fillStyle = '#a05a4a'; c.beginPath(); c.moveTo(-8, 0); c.lineTo(10, 0); c.lineTo(7, 3); c.lineTo(-6, 3); c.closePath(); c.fill(); c.restore(); }
    rocket(c, t);
    planet(c, t);
    // seagull gliding high up
    an(c, 'bird', 300 + Math.sin(t * 0.5) * 16, 300 + Math.sin(t * 1.1) * 8, 0.62, { t, pose: 'cheer', expr: 'happy', facing: -1, phase: 2, noShadow: true });
    // mid-ground: the table's flask and DNA, the robot arm
    const fs = frogState(t);
    flask(c, t); dna(c, t);
    robotArm(c, t, fs);
    // the tub, its water and the frog
    const lev = level(fs), rate = spillRate(fs);
    puddle(c, t, fs);
    tubBody(c);
    rivulets(c, t, rate);
    tubRim(c, lev, t);
    const wl = TUB.y - lev - 2;
    if (!fs.air || fs.y > wl) {
      c.save(); c.beginPath(); c.rect(0, 0, W, wl + 1); c.clip(); const fr = frog(c, t, fs); c.restore();
      // a ring of ripples round the frog
      c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(fs.x, wl + 1, 22 + Math.sin(t * 2.6) * 1.5, 4, 0, 0, TAU); c.stroke();
    }
    stream(c, t, -1, rate); stream(c, t, 1, rate);
    splash(c, fs);
    if (fs.air && fs.y <= wl) frog(c, t, fs);
    // the idea: a lightbulb pops on beside the frog's head
    const bk = fs.tau >= BULB_ON && fs.tau < LEAP1 + 0.5 ? clamp((fs.tau - BULB_ON) / 0.25) * clamp((LEAP1 + 0.5 - fs.tau) / 0.3) : 0;
    bulb(c, fs.x + 50, Math.max(428, fs.y - 62), bk >= 1 ? 1 : bk, t);
    // the front row
    laptop(c, t);
    circuit(c, t);
    coinJar(c, t);
    lettering(c, typeof GAME_NAME !== 'undefined' ? GAME_NAME : 'Heurēka!', 180, 168, t);
  }
  return { draw, frogState, paintTub: { tubBody, tubRim, rivulets, stream, puddle, foot, bulb }, TUB, FLOOR };
})();
function PANEL_TITLE(c, t) { HK_TITLE.draw(c, t); }
