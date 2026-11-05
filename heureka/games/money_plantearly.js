// PLANT EARLY TO GROW TALLEST! (business PF-09) — saving early beats saving more later. Two money trees: yours, and a
// ghostly late saver's. A year ruler runs along the ground from age 25 to 65. Your first tap starts the years; mash to
// plant coins under your tree during your planting years (25 to 35). Each coin grows 7% a year (compound growth), so a
// coin planted at 25 grows for 40 years. At 35 your planting stops and the late saver starts: it plants three times as
// many coins from 35 to 65. A dashed line shows how tall the late saver's tree will be at 65, and a dashed crown shows how
// tall yours will be: plant until your crown is above the line. Then the years race to 65: your tree, with far fewer
// coins, ends taller. Plant too few and the late saver's tree towers over yours.
// Level 1: shorter planting years; level 2: shorter still, and the late saver plants more.
(() => {
  const GY = 500, RULER = { x0: 34, x1: 326, y: 582 }, R = 0.07;
  const LV = [{ win: 3.4, G: 24, late: 2.2 }, { win: 2.9, G: 27, late: 2.0 }, { win: 2.6, G: 30, late: 1.9 }];
  const KINDS = [{ leaf: '#5aa84a', leaf2: '#3a8a3a' }, { leaf: '#e88aa8', leaf2: '#c05a80' }, { leaf: '#7ac860', leaf2: '#4a9a40' }, { leaf: '#e8a040', leaf2: '#c07020' }];
  const MAXH = 320;
  const ageAt = (s, t) => !s.t0 ? 25 : t < s.t0 + s.L.win ? 25 + 10 * (t - s.t0) / s.L.win : Math.min(65, 35 + 30 * (t - s.t0 - s.L.win) / s.L.late);
  const val = (coins, age) => coins.reduce((a, c) => a + (age >= c ? Math.pow(1 + R, age - c) : 0), 0);
  function paint(o) {
    P.sky(o, 360, 640, ['#f0b080', '#f8d0a8', '#fff4e0']); P.cloud(o, 70, 150, 0.7); P.cloud(o, 280, 200, 0.55);
    P.hills(o, 360, 440, 50, '#c8d890', '#98b060', { seed: 7 }); P.hills(o, 360, 480, 30, '#a8c870', '#789a48', { seed: 3 });
    N6.vgrad(o, 0, GY - 6, 360, 140, ['#a87a4a', '#7a5030', '#5a3820']);
    o.fillStyle = '#8ac860'; o.fillRect(0, GY - 8, 360, 10); P.grassTufts(o, 360, GY - 10, GY + 2, 26, '#5a9a40', 4);
  }
  function tree(c, x, h, kind, t, alpha, coins, dashed) { // a trunk and a round crown whose top is h px above the ground
    c.save(); c.globalAlpha = alpha; const top = GY - h, cr = SK.clamp(18 + h * 0.28, 18, 72), cy = top + cr;
    const tw = 6 + h * 0.05; c.fillStyle = '#7a4a2a'; c.strokeStyle = '#4a2a14'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(x - tw, GY); c.quadraticCurveTo(x - tw * 0.6, (GY + cy) / 2, x - tw * 0.5, cy); c.lineTo(x + tw * 0.5, cy); c.quadraticCurveTo(x + tw * 0.6, (GY + cy) / 2, x + tw, GY); c.closePath(); c.fill(); c.stroke();
    const sway = Math.sin(t * 1.5 + x) * 2;
    for (const [dx, dy, r] of [[-0.55, 0.2, 0.62], [0.55, 0.25, 0.6], [0, -0.2, 0.75], [0, 0.35, 0.7]]) { const gr = c.createRadialGradient(x + dx * cr - r * cr * 0.3 + sway, cy + dy * cr - r * cr * 0.4, 2, x + dx * cr + sway, cy + dy * cr, r * cr); gr.addColorStop(0, P.shade(kind.leaf, 0.3)); gr.addColorStop(1, kind.leaf2); c.fillStyle = gr; c.beginPath(); c.arc(x + dx * cr + sway, cy + dy * cr, r * cr, 0, 7); c.fill(); }
    // coins hanging in the crown: more as it grows
    const n = Math.min(14, Math.floor(h / 22)); for (let i = 0; i < n; i++) { const a = i * 2.4, rr = cr * (0.25 + 0.55 * ((i * 37) % 10) / 10); N6.coin(c, x + Math.cos(a) * rr + sway, cy + Math.sin(a) * rr * 0.8, 6, ''); }
    c.restore();
  }
  function crownOutline(c, x, h, col, t) { const top = GY - h, cr = SK.clamp(18 + h * 0.28, 18, 72); c.save(); c.strokeStyle = col; c.lineWidth = 3; c.setLineDash([7, 6]); c.lineDashOffset = -t * 20; c.beginPath(); c.arc(x, top + cr, cr, Math.PI * 1.05, Math.PI * 1.95); c.stroke(); c.restore(); }
  MG.add({
    id: 'money_plantearly', stage: 'money', cmd: 'PLANT EARLY TO GROW TALLEST!', time: 6, mood: 'bright', winText: 'Early coins grew more!', failText: 'Not enough early coins!', hold: 1.7,
    card: { title: 'Start saving early', kind: 'Money', ref: 'Compound growth over time',
      text: 'Money you invest can grow each year, and next year the growth grows too. This game uses 7% a year, a rough long-run guess for a stock fund, not a promise.\n\nA coin planted at 25 grows for 40 years and ends about 15 times bigger. A coin planted at 50 grows for only 15 years and ends about 3 times bigger.\n\nSo you planted for ten years and stopped. The late saver planted three times as many coins over thirty years, and your tree still ended taller. Time does most of the work.',
      note: 'Money saved early grows for longer, so a little saved young can beat a lot saved later.' },
    init(g) {
      const s = g.s; s.L = LV[Math.min(2, g.level)]; s.v = SK.variant(g, 4); s.kind = KINDS[s.v]; s.side = s.v % 2; // which side your tree stands on
      s.mx = s.side ? 262 : 98; s.gx = s.side ? 98 : 262; s.t0 = 0; s.mine = []; s.ghost = []; s.pops = []; s.endT = 0;
      s.ghostAges = Array.from({ length: s.L.G }, (_, i) => 35 + 30 * (i + 0.5) / s.L.G); s.gi = 0;
      s.ghostFinal = val(s.ghostAges, 65); s.k = 230 / s.ghostFinal;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return; if (!s.t0) s.t0 = g.t;
      const age = ageAt(s, g.t); if (age >= 35) return;
      s.mine.push(age); s.pops.push({ x: s.mx + (s.mine.length % 5 - 2) * 9, t: g.t }); g.sfx('coin', { pitch: 1 + (s.mine.length % 6) * 0.05 }); g.sfx('tap', { vol: 0.4 });
    },
    update(g, dt) {
      const s = g.s; if (!s.t0 || g.done) return; const age = ageAt(s, g.t);
      while (s.gi < s.ghostAges.length && s.ghostAges[s.gi] <= age) { s.ghost.push(s.ghostAges[s.gi]); s.gi++; s.pops.push({ x: s.gx + (s.gi % 5 - 2) * 9, t: g.t, ghost: true }); if (s.gi % 3 === 0) g.sfx('coin', { vol: 0.25, pitch: 0.8 }); }
      s.pops = s.pops.filter(p => g.t - p.t < 0.5);
      if (age >= 65) { if (val(s.mine, 65) > s.ghostFinal) { g.win(); g.sfx('cheer'); g.burst(s.mx, GY - Math.min(MAXH, s.k * val(s.mine, 65)), ['#ffd45a', '#fff6ea', '#8affb0'], 22, 200); } else { g.fail(); g.sfx('laugh'); } }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', age = ageAt(s, g.t), planting = !g.done && age < 35;
      c.drawImage(g.bake('n6plant_bg', paint), 0, 0, 360, 640);
      const hm = 26 + Math.min(MAXH, s.k * val(s.mine, age)), hg = 26 + Math.min(MAXH, s.k * val(s.ghost, age));
      const projM = 26 + Math.min(MAXH, s.k * val(s.mine, 65)), lineY = GY - 26 - s.k * s.ghostFinal;
      // the late saver's tree at 65: a dashed line across, so you know how tall to grow
      if (!g.done) { c.save(); c.strokeStyle = 'rgba(90,60,120,0.75)'; c.lineWidth = 3; c.setLineDash([10, 7]); c.beginPath(); c.moveTo(14, lineY); c.lineTo(346, lineY); c.stroke(); c.restore(); SK.tag(c, 'Late saver at 65', s.gx, lineY - 18, 18, '#fff6ea', 'rgba(90,60,120,0.85)'); }
      tree(c, s.gx, hg, { leaf: '#b8b0d8', leaf2: '#8a80b0' }, t, 0.62, s.ghost.length);
      tree(c, s.mx, hm, s.kind, t, 1, s.mine.length);
      // how tall your tree will be at 65 with the coins planted so far
      if (!g.done && s.mine.length && age < 35) crownOutline(c, s.mx, projM, projM > GY - lineY + 0 ? '#2aa84a' : '#e8803a', t);
      for (const p of s.pops) { const q = (t - p.t) / 0.5; c.save(); c.globalAlpha = (1 - q) * (p.ghost ? 0.6 : 1); N6.coin(c, p.x, GY - 40 + q * 40, 10); c.restore(); }
      // the two savers
      const pose = planting ? (Math.floor(t * 8) % 2 ? 'hop' : 'idle') : won ? 'cheer' : lost ? 'sad' : 'idle';
      SK.animal(c, 'rabbit', s.mx + (s.side ? 52 : -52), GY + 6, 1.0, { t, pose: s.t0 && planting ? pose : won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: s.side ? -1 : 1 });
      c.save(); c.globalAlpha = 0.6; SK.animal(c, 'turtle', s.gx + (s.side ? -52 : 52), GY + 6, 0.95, { t, pose: age >= 35 && !g.done ? 'hop' : lost ? 'cheer' : 'idle', expr: lost ? 'laugh' : won ? 'wow' : age < 35 ? 'think' : 'happy', facing: s.side ? 1 : -1 }); c.restore();
      SK.tag(c, 'You', s.mx, GY + 26, 18); SK.tag(c, 'Late saver', s.gx, GY + 26, 18);
      N6.text(c, s.mine.length + (s.mine.length === 1 ? ' coin' : ' coins'), s.mx, GY - 6 - (hm > 60 ? 0 : 0) + 0, 17, '#fff6ea'); if (s.ghost.length || age >= 35) N6.text(c, s.ghost.length + ' coins', s.gx, GY - 6, 17, '#fff6ea');
      // the years
      const ax = a => SK.lerp(RULER.x0, RULER.x1, (a - 25) / 40), y = RULER.y;
      c.save(); c.fillStyle = 'rgba(30,14,36,0.55)'; c.beginPath(); c.roundRect(RULER.x0 - 14, y - 12, RULER.x1 - RULER.x0 + 28, 24, 12); c.fill();
      c.fillStyle = '#7ad070'; c.beginPath(); c.roundRect(ax(25), y - 6, ax(35) - ax(25), 12, 6); c.fill(); c.fillStyle = '#b8b0d8'; c.beginPath(); c.roundRect(ax(35), y - 6, ax(65) - ax(35), 12, 6); c.fill();
      c.fillStyle = '#ffd45a'; c.beginPath(); c.roundRect(ax(25), y - 3, ax(age) - ax(25), 6, 3); c.fill(); c.restore();
      for (const a of [25, 35, 45, 55, 65]) N6.text(c, '' + a, ax(a), y + 19, 15, '#fff6ea');
      c.save(); c.translate(ax(age), y); c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, 10, 0, 7); c.fill(); c.stroke(); c.restore();
      SK.tag(c, 'Age ' + Math.floor(age), SK.clamp(ax(age), 50, 310), y - 30, 18);
      // guidance: mash on your tree's soil during the planting years
      if (planting) { SK.glow(c, g, s.mx, GY - 6, 38, '#ffe27a', { level: 2 }); SK.demo(g, c, 'tap', [s.mx + 6, GY - 2], null, { period: 0.5 }); }
    },
    auto(g, dt, synth) { const s = g.s, B = s._b = s._b || { n: 1.0 }; if (g.done || g.t < B.n || ageAt(s, g.t) >= 34.6 || val(s.mine, 65) > s.ghostFinal * 1.12) return; B.n = g.t + 0.13; synth('down', s.mx, GY - 6); synth('up', s.mx, GY - 6); },
  });
})();
