// FILL THE GAPS WITH ELECTRONS! (chemistry CB HC-02 GIVE!) — two grumpy atoms float in a dark lab sky: a metal (sodium,
// potassium) with one lonely electron in its outer shell, and a non-metal (chlorine, fluorine) with one empty gap in its
// outer shell. Drag the lonely electron into the gap: the metal's outer shell is gone, so its full inner shell is now
// its outside; the other's outer shell is full. Both cheer, turn opposite charges (+ and −) and snap together into a
// salt crystal that drops into the dish. Two pairs at level 0, three at level 1; level 2 ends with magnesium and oxygen
// (two electrons, two gaps). The funny fail: drag one of chlorine's electrons onto sodium instead and both shells get
// worse; chlorine yanks its electron straight back and they glare at each other.
(() => {
  const EL = {
    Na: { name: 'Sodium', shells: [2, 8, 1], R: 66, col: '#f0a040' },
    K: { name: 'Potassium', shells: [2, 8, 8, 1], R: 72, col: '#c890f0' },
    Mg: { name: 'Magnesium', shells: [2, 8, 2], R: 62, col: '#9ad070' },
    Cl: { name: 'Chlorine', shells: [2, 8, 7], R: 56, col: '#5ad0a0' },
    F: { name: 'Fluorine', shells: [2, 7], R: 48, col: '#8ae0e8' },
    O: { name: 'Oxygen', shells: [2, 6], R: 50, col: '#ff7a7a' },
  };
  const SEQ = [[['Na', 'Cl'], ['K', 'F'], ['Na', 'F']], [['K', 'Cl'], ['Na', 'F'], ['Na', 'Cl']], [['Na', 'F'], ['K', 'Cl'], ['K', 'F']], [['K', 'F'], ['Na', 'Cl'], ['K', 'Cl']]];
  const Y = [330, 366, 346], DISH = { x: 140, y: 560 }, ER = 9;
  const ringR = (A, j) => { const k = A.shells.length; return k === 1 ? A.R : SK.lerp(32, A.R, j / (k - 1)); };
  function makePair(g) {
    const s = g.s, [d, a] = s.seq[s.round], D = EL[d], A = EL[a], y = Y[s.round % 3];
    s.D = { k: d, ...D, x: 90, y, out: D.shells[D.shells.length - 1], gone: 0, mood: -1 };
    const nA = A.shells[A.shells.length - 1], gaps = 8 - nA;
    // the acceptor's outer shell: 8 slots, the gaps face the metal (angle π)
    const slots = []; for (let i = 0; i < 8; i++) slots.push(true);
    const gi = gaps === 1 ? [4] : [3, 5]; for (const i of gi) slots[i] = false;
    s.A = { k: a, ...A, x: 272, y: y + 6, slots, mood: -1 };
    s.phase = 'play'; s.born = g.t; s.snapT = 0; s.drag = null; s.back = null;
  }
  function slotXY(A, i, t) { const a = Math.PI + (i - 4) * Math.PI / 4 + Math.sin(t * 0.9) * 0.05; return [A.x + Math.cos(a) * A.R, A.y + Math.sin(a) * A.R]; }
  function donorXY(D, i, t) { // the metal's outer electrons sit on the side facing the other atom
    const n = D.out, a = (n === 1 ? 0 : (i - (n - 1) / 2) * 0.7) + Math.sin(t * 0.9 + 1) * 0.05; return [D.x + Math.cos(a) * D.R, D.y + Math.sin(a) * D.R];
  }
  const gapsLeft = A => A.slots.filter(v => !v).length;
  const nextGap = A => { const i = A.slots.indexOf(false); return i; };
  function paintBg(o) {
    const bg = o.createRadialGradient(180, 300, 40, 180, 330, 460); bg.addColorStop(0, '#3a2c78'); bg.addColorStop(0.55, '#1c1a4e'); bg.addColorStop(1, '#0a0a26'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    const r = P.rng(31);
    for (let i = 0; i < 26; i++) { const x = r() * 360, y = 120 + r() * 400, rr = 10 + r() * 40, gr = o.createRadialGradient(x, y, 0, x, y, rr); const hue = ['120,160,255', '200,120,255', '120,230,210'][i % 3]; gr.addColorStop(0, `rgba(${hue},${0.08 + r() * 0.1})`); gr.addColorStop(1, `rgba(${hue},0)`); o.fillStyle = gr; o.beginPath(); o.arc(x, y, rr, 0, 7); o.fill(); }
    P.stars(o, 360, 520, 70, 8, 0);
    // a faint salt-crystal lattice in the background
    o.save(); o.globalAlpha = 0.07; for (let i = 0; i < 10; i++) for (let j = 0; j < 14; j++) { o.fillStyle = (i + j) % 2 ? '#ffffff' : '#9ad0ff'; o.beginPath(); o.arc(18 + i * 36, 130 + j * 32, (i + j) % 2 ? 4 : 7, 0, 7); o.fill(); } o.restore();
    // the lab shelf and the dish
    const sh = o.createLinearGradient(0, 548, 0, 640); sh.addColorStop(0, '#7a4e34'); sh.addColorStop(1, '#4a2a1c'); o.fillStyle = sh; o.fillRect(0, 556, 360, 84); o.fillStyle = '#a06a44'; o.fillRect(0, 552, 360, 8);
    o.fillStyle = 'rgba(0,0,0,0.25)'; o.beginPath(); o.ellipse(DISH.x, DISH.y + 6, 78, 10, 0, 0, 7); o.fill();
  }
  function crystal(c, x, y, sz) { // a tiny salt cube, seen from above at an angle
    c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(x, y - sz); c.lineTo(x + sz, y - sz * 0.5); c.lineTo(x, y); c.lineTo(x - sz, y - sz * 0.5); c.closePath(); c.fill();
    c.fillStyle = '#c8d8f0'; c.beginPath(); c.moveTo(x - sz, y - sz * 0.5); c.lineTo(x, y); c.lineTo(x, y + sz * 0.9); c.lineTo(x - sz, y + sz * 0.4); c.closePath(); c.fill();
    c.fillStyle = '#9ab0d8'; c.beginPath(); c.moveTo(x + sz, y - sz * 0.5); c.lineTo(x, y); c.lineTo(x, y + sz * 0.9); c.lineTo(x + sz, y + sz * 0.4); c.closePath(); c.fill();
  }
  function electron(c, x, y, r = ER, a = 1) {
    c.save(); c.globalAlpha *= a; const gr = c.createRadialGradient(x, y, 0, x, y, r * 2.4); gr.addColorStop(0, 'rgba(120,230,255,0.55)'); gr.addColorStop(1, 'rgba(120,230,255,0)'); c.fillStyle = gr; c.beginPath(); c.arc(x, y, r * 2.4, 0, 7); c.fill();
    SK.ball(c, x, y, r, '#5ad8ff', { edge: '#1a4a7a' }); c.restore();
  }
  function face(c, x, y, mood, t, ph) { // mood: -1 grumpy, 0 plain, 1 delighted, -2 furious
    const bl = ((t + ph) % 3.4) < 0.12;
    c.fillStyle = '#2a1424'; c.strokeStyle = '#2a1424'; c.lineWidth = 2.4; c.lineCap = 'round';
    for (const s of [-1, 1]) { if (mood > 0.5 || bl) { c.beginPath(); c.arc(x + s * 8, y - 3, 3.6, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); } else { c.beginPath(); c.arc(x + s * 8, y - 3, 3.4, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x + s * 8 - 1, y - 4.2, 1.2, 0, 7); c.fill(); c.fillStyle = '#2a1424'; } }
    if (mood < 0) for (const s of [-1, 1]) { c.beginPath(); c.moveTo(x + s * 13, y - 12 + (mood < -1 ? -1 : 0)); c.lineTo(x + s * 4, y - 9 + (mood < -1 ? 3 : 0)); c.stroke(); }
    c.beginPath(); if (mood > 0.5) { c.fillStyle = '#8a2a44'; c.arc(x, y + 5, 6, 0, Math.PI); c.fill(); } else if (mood < 0) c.arc(x, y + 11, 5, Math.PI * 1.15, Math.PI * 1.85); else { c.moveTo(x - 4, y + 7); c.lineTo(x + 4, y + 7); } c.stroke();
  }
  function atom(c, g, A, isD, t) {
    const { x, y } = A, k = A.shells.length, done = isD ? A.gone : 0;
    // inner shells: faint rings with small electrons; the metal's last inner shell lights up once its outer one is gone
    for (let j = 0; j < k - 1; j++) {
      const r = ringR(A, j), lit = isD && j === k - 2 ? done : 0, n = A.shells[j];
      c.strokeStyle = `rgba(200,215,255,${0.16 + 0.5 * lit})`; c.lineWidth = 1.5 + lit * 1.5; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
      for (let i = 0; i < n; i++) { const a = i * Math.PI * 2 / n + t * (0.4 + j * 0.15) * (j % 2 ? -1 : 1); if (lit > 0.3) electron(c, x + Math.cos(a) * r, y + Math.sin(a) * r, 4 + 2 * lit, 0.5 + 0.5 * lit); else { c.fillStyle = 'rgba(150,220,255,0.55)'; c.beginPath(); c.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, 3, 0, 7); c.fill(); } }
    }
    // the outer shell
    const outA = isD ? 1 - done : 1;
    if (outA > 0.02) { c.save(); c.globalAlpha = outA; c.strokeStyle = isD ? 'rgba(255,220,170,0.65)' : 'rgba(190,255,220,0.7)'; c.lineWidth = 2.5; c.beginPath(); c.arc(x, y, A.R, 0, 7); c.stroke(); c.restore(); }
    // the nucleus with a face
    const gl = c.createRadialGradient(x, y, 4, x, y, 40); gl.addColorStop(0, P.rgba(A.col, 0.5)); gl.addColorStop(1, P.rgba(A.col, 0)); c.fillStyle = gl; c.beginPath(); c.arc(x, y, 40, 0, 7); c.fill();
    SK.ball(c, x, y, 22, A.col); face(c, x, y + 1, A.mood, t, isD ? 0 : 1.7);
  }
  function chargeBadge(c, x, y, txt, col, k) {
    if (k <= 0) return; c.save(); c.translate(x, y); c.scale(k, k); c.fillStyle = col; c.strokeStyle = '#1a1030'; c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, 15, 0, 7); c.fill(); c.stroke();
    c.font = '900 19px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText(txt, 0, 1); c.restore();
  }
  MG.add({
    id: 'atoms_give', stage: 'atoms', cmd: 'FILL THE GAPS WITH ELECTRONS!', time: 6, mood: 'night', winText: 'Full shells, they stick!', failText: 'Still not full!',
    card: { title: 'Atoms trade electrons', kind: 'Chemistry', ref: 'Ionic bonding',
      text: "Electrons sit in shells around the centre of an atom. These atoms are happiest when their outer shell holds eight electrons.\n\nSodium has just one electron in its outer shell. Chlorine has seven, one short of eight. When sodium gives that one electron to chlorine, sodium's full inner shell becomes its outside, and chlorine's outer shell is full. Both are now full.\n\nSodium now has a plus charge and chlorine a minus charge. Opposite charges pull together, so the two stick. Billions of these pairs stacked up make a grain of salt. This is called an ionic bond.",
      note: 'A metal atom gives electrons to a non-metal atom, so both get full outer shells and opposite charges that hold them together.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level), v = SK.variant(g, 4);
      s.seq = SEQ[v].slice(0, L === 1 ? 3 : 2).map(p => p.slice()); if (L === 2) s.seq.push(['Mg', 'O']);
      s.round = 0; s.salt = []; s.failT = 0; makePair(g);
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || s.phase !== 'play' || s.back) return;
      const D = s.D, A = s.A;
      if (D.out > 0 && SK.dist(x, y, D.x, D.y) < D.R + 24 && SK.dist(x, y, A.x, A.y) > A.R + 4) { const [ex, ey] = donorXY(D, D.out - 1, g.t); s.drag = { from: 'D', x: ex, y: ey, ox: ex - x, oy: ey - y }; g.sfx('pop'); return; }
      if (SK.dist(x, y, A.x, A.y) < A.R + 22) { // grab the nearest of the other atom's electrons (the funny fail)
        let bi = -1, bd = 1e9; A.slots.forEach((f, i) => { if (!f) return; const [ex, ey] = slotXY(A, i, g.t), d = SK.dist(x, y, ex, ey); if (d < bd) { bd = d; bi = i; } });
        if (bi >= 0) { const [ex, ey] = slotXY(A, bi, g.t); A.slots[bi] = false; s.drag = { from: 'A', i: bi, x: ex, y: ey, ox: ex - x, oy: ey - y }; g.sfx('pop'); }
      }
    },
    move(g, x, y) { const d = g.s.drag; if (d) { d.x = x + d.ox; d.y = y + d.oy; } },
    up(g, x, y) {
      const s = g.s, d = s.drag; if (!d) return; s.drag = null; if (g.done) return; const D = s.D, A = s.A;
      if (d.from === 'D') {
        if (SK.dist(d.x, d.y, A.x, A.y) < A.R + 30 && gapsLeft(A) > 0) {
          A.slots[nextGap(A)] = true; D.out--; g.sfx('click'); g.sfx('sparkle'); g.burst(d.x, d.y, ['#5ad8ff', '#ffffff'], 10, 120);
          if (D.out === 0 && gapsLeft(A) === 0) { s.phase = 'snap'; s.snapT = g.t; D.mood = 1; A.mood = 1; g.sfx('chime');
            if (s.round === s.seq.length - 1) { g.win(); g.sfx('cheer'); } }
        } else s.back = { from: 'D', x: d.x, y: d.y, t: g.t }; // let go somewhere else: it springs home
      } else {
        if (SK.dist(d.x, d.y, D.x, D.y) < D.R + 30) { // chlorine's electron pushed onto sodium: both shells get worse, and chlorine yanks it straight back
          s.failT = g.t; D.mood = -2; A.mood = -2; s.back = { from: 'A', i: d.i, x: d.x, y: d.y, t: g.t + 0.35, wrong: true }; D.extra = 1; g.sfx('boing'); g.sfx('wrong'); g.shake(4, 0.3);
          g.fail(); g.sfx('laugh');
        } else s.back = { from: 'A', i: d.i, x: d.x, y: d.y, t: g.t };
      }
    },
    update(g, dt) {
      const s = g.s, D = s.D, A = s.A;
      if (s.back && g.t >= s.back.t + 0.25) { if (s.back.from === 'A') { A.slots[s.back.i] = true; D.extra = 0; } s.back = null; }
      if (s.phase === 'snap') {
        D.gone = SK.clamp((g.t - s.snapT) / 0.3, 0, 1);
        const k = SK.clamp((g.t - s.snapT - 0.3) / 0.3, 0, 1), rd = ringR(D, D.shells.length - 2), touch = A.x - (rd + A.R + 2);
        D.x = SK.lerp(90, touch, SK.easeInOut(k));
        if (g.t - s.snapT > 0.95 && !s.dropT) { s.dropT = g.t; g.sfx('drip'); }
        if (s.dropT && g.t - s.dropT > 0.35) { s.dropT = 0; s.salt.push(s.round); s.round++; g.sfx('pop'); if (s.round < s.seq.length && !g.done) makePair(g); else s.phase = 'over'; }
      }
    },
    draw(g, c) {
      const s = g.s, t = g.t, D = s.D, A = s.A, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('give_bg', paintBg), 0, 0, 360, 640);
      // the dish with the salt made so far
      c.save(); c.fillStyle = 'rgba(210,235,255,0.18)'; c.strokeStyle = 'rgba(230,245,255,0.75)'; c.lineWidth = 2.5; c.beginPath(); c.ellipse(DISH.x, DISH.y, 76, 16, 0, 0, Math.PI); c.lineTo(DISH.x - 76, DISH.y); c.fill(); c.stroke(); c.beginPath(); c.ellipse(DISH.x, DISH.y, 76, 12, 0, 0, 7); c.stroke(); c.restore();
      s.salt.forEach((r, i) => { for (let j = 0; j < 5; j++) crystal(c, DISH.x - 44 + i * 30 + (j % 3) * 9, DISH.y - 2 - Math.floor(j / 3) * 8 + (j % 2) * 2, 6); });
      SK.tag(c, 'Crystals', DISH.x + 104, DISH.y - 8, 18);
      const total = s.seq.length; if (!won) SK.tag(c, Math.min(s.round + 1, total) + ' / ' + total, 180, 172, 19);
      if (s.phase === 'over') { SK.animal(c, 'fox', 326, 606, 0.8, { t, pose: won ? 'cheer' : 'sad', expr: won ? 'laugh' : 'wow', facing: -1 }); return; }
      // the pair dropping into the dish
      let dy = 0, sc = 1; if (s.dropT) { const k = SK.clamp((t - s.dropT) / 0.35, 0, 1); dy = (DISH.y - 30 - D.y) * k * k; sc = 1 - 0.7 * k; }
      c.save(); if (sc !== 1) { const cx = (D.x + A.x) / 2, cy = D.y; c.translate(cx, cy + dy); c.scale(sc, sc); c.translate(-cx, -cy); }
      const shk = lost ? Math.sin(t * 50) * 2 * Math.max(0, 1 - (t - s.failT)) : 0;
      c.save(); c.translate(-shk, 0); atom(c, g, D, true, t); c.restore(); c.save(); c.translate(shk, 0); atom(c, g, A, false, t); c.restore();
      // outer electrons: the metal's lonely one(s), the other atom's shell with its gaps
      for (let i = 0; i < D.out; i++) { const [ex, ey] = donorXY(D, i, t); if (s.drag && s.drag.from === 'D' && i === D.out - 1) continue; if (s.back && s.back.from === 'D' && i === D.out - 1) { const k = SK.clamp((t - s.back.t) / 0.25, 0, 1); electron(c, SK.lerp(s.back.x, ex, SK.easeOut(k)), SK.lerp(s.back.y, ey, SK.easeOut(k))); continue; } electron(c, ex, ey); }
      if (D.extra) { const [ex, ey] = [D.x + D.R * Math.cos(-0.9), D.y + D.R * Math.sin(-0.9)]; if (!s.back || t < s.back.t) electron(c, ex, ey); }
      A.slots.forEach((f, i) => { const [ex, ey] = slotXY(A, i, t); if (f) electron(c, ex, ey); else { const p = 0.5 + 0.5 * Math.sin(t * 6); c.save(); c.fillStyle = `rgba(255,226,122,${0.12 + 0.15 * p})`; c.beginPath(); c.arc(ex, ey, ER + 2, 0, 7); c.fill(); c.strokeStyle = '#ffe27a'; c.lineWidth = 2.5; c.setLineDash([3, 3]); c.beginPath(); c.arc(ex, ey, ER + 1, 0, 7); c.stroke(); c.restore(); } });
      if (s.back && s.back.from === 'A' && t >= s.back.t) { const k = SK.clamp((t - s.back.t) / 0.25, 0, 1), [ex, ey] = slotXY(A, s.back.i, t), sx = s.back.wrong ? D.x + D.R * Math.cos(-0.9) : s.back.x, sy = s.back.wrong ? D.y + D.R * Math.sin(-0.9) : s.back.y; electron(c, SK.lerp(sx, ex, SK.easeOut(k)), SK.lerp(sy, ey, SK.easeOut(k))); }
      // charges, once the electron has changed hands
      if (s.phase === 'snap') { const k = SK.clamp((t - s.snapT - 0.15) * 5, 0, 1), two = D.k === 'Mg'; chargeBadge(c, D.x - 26, D.y - ringR(D, D.shells.length - 2) - 6, two ? '2+' : '+', '#e8803a', k); chargeBadge(c, A.x + 30, A.y - A.R - 8, two ? '2−' : '−', '#3a8ae8', k); }
      c.restore();
      // names
      if (!s.dropT) { SK.tag(c, D.name, D.x, D.y + D.R + 26, 18); SK.tag(c, A.name, A.x, A.y + A.R + 26, 18); }
      if (s.drag) electron(c, s.drag.x, s.drag.y, ER + 2);
      SK.animal(c, 'fox', 326, 606, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
      // guidance: grab the lonely electron, drop it in the gap
      if (s.phase === 'play' && !g.done && !s.back && D.out > 0) {
        const [ex, ey] = donorXY(D, D.out - 1, t), [gx, gy] = slotXY(A, nextGap(A), t);
        SK.tag(c, 'Electron', ex - 4, ey + 36, 18);
        SK.grab(c, g, ex, ey, 16); SK.target(c, g, gx, gy, 14); SK.arrow(c, g, ex, ey, gx, gy, { from: 22, to: 24 });
        SK.demo(g, c, 'drag', [ex, ey], [gx, gy]);
      }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.phase !== 'play' || s.back) return; const D = s.D, A = s.A; if (D.out <= 0) return;
      const [ex, ey] = donorXY(D, D.out - 1, g.t), [gx, gy] = slotXY(A, nextGap(A), g.t), key = 'e' + s.round + '_' + D.out;
      const BT = (s._bot = s._bot || {}).T = (s._bot.T || {}); if (BT[key] == null) BT[key] = Math.max(g.t + 0.25, s.round === 0 && D.out === EL[D.k].shells.slice(-1)[0] ? 1.0 : 0);
      SK.bot.drag(g, synth, key, BT[key], [ex, ey], [gx, gy], 0.45);
    },
  });
})();
