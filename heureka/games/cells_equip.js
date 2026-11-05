// EQUIP! (chem_bio MB-02) — an empty, sleepy cell floats in a sunlit pond under the microscope; its parts drift below.
// Drag each part into the cell: the nucleus lights up like a control room, a chloroplast catches the sunbeam and makes
// sugar, a mitochondrion sparks with energy, the vacuole fills and the wall stands firm. Once every part is in, the cell
// opens its eyes. Leave the chloroplast out and the cell sits in the sun, hungry. Level 1 adds the vacuole; level 2 is
// an animal cell (round, no wall) that needs two mitochondria and spits out the chloroplast it has no use for.
const CX = 180, CY = 322, SUN = [44, 164];
const PARTS = {
  nucleus: { r: 30 }, chloro: { r: 26 }, mito: { r: 24 }, vacuole: { r: 38 },
};
const LEVELS = [
  { animal: false, need: ['nucleus', 'chloro', 'mito'], extra: [] },
  { animal: false, need: ['nucleus', 'chloro', 'mito', 'vacuole'], extra: ['pebble'] },
  { animal: true, need: ['nucleus', 'mito', 'mito'], extra: ['chloro'] },
];
const SLOTS = { // where each part settles inside the cell (offsets from the centre)
  nucleus: [[-58, -46]], chloro: [[58, -78], [-70, 62]], mito: [[66, 82], [-8, 98]], vacuole: [[44, 24]],
};
const inCell = (an, x, y) => an ? ((x - CX) / 120) ** 2 + ((y - CY) / 124) ** 2 < 1.05 : Math.abs(x - CX) < 128 && Math.abs(y - CY) < 138;

function paintPond(o, SUN, v = 0) {
  const bg = o.createLinearGradient(0, 0, 0, 640); const TT = [['#bfeee8', '#7fd0d4', '#3f98b0'], ['#d8f0c8', '#90d0a8', '#3f9880']][v >> 1]; bg.addColorStop(0, TT[0]); bg.addColorStop(0.5, TT[1]); bg.addColorStop(1, TT[2]);
  o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
  const rnd = P.rng(7);
  // soft caustic light ripples
  o.strokeStyle = 'rgba(255,255,255,0.18)'; o.lineWidth = 2;
  for (let i = 0; i < 26; i++) { const x = rnd() * 360, y = rnd() * 640, r = 20 + rnd() * 40; o.beginPath(); o.ellipse(x, y, r, r * 0.45, rnd() * 3, 0, 5); o.stroke(); }
  // tiny drifting specks and faint neighbour cells at the edges
  for (let i = 0; i < 70; i++) { o.fillStyle = `rgba(255,255,255,${0.15 + rnd() * 0.3})`; o.beginPath(); o.arc(rnd() * 360, rnd() * 640, 1 + rnd() * 2.5, 0, 7); o.fill(); }
  o.fillStyle = 'rgba(80,170,120,0.18)'; o.strokeStyle = 'rgba(40,120,90,0.25)'; o.lineWidth = 4;
  for (const [x, y, w, h] of [[-50, 150, 80, 150], [330, 200, 90, 160], [-40, 460, 70, 120], [340, 440, 80, 110]]) { o.beginPath(); o.roundRect(x, y, w, h, 24); o.fill(); o.stroke(); }
  // the sun's glow in the corner
  const sg = o.createRadialGradient(SUN[0], SUN[1], 6, SUN[0], SUN[1], 150); sg.addColorStop(0, 'rgba(255,250,200,0.95)'); sg.addColorStop(0.3, 'rgba(255,236,150,0.45)'); sg.addColorStop(1, 'rgba(255,236,150,0)');
  o.fillStyle = sg; o.fillRect(0, 0, 360, 360);
  // the parts' resting shelf: a soft lighter band
  const sh = o.createLinearGradient(0, 486, 0, 610); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(0.3, 'rgba(255,255,255,0.16)'); sh.addColorStop(1, 'rgba(255,255,255,0.05)');
  o.fillStyle = sh; o.fillRect(0, 486, 360, 124);
  P.vignette(o, 360, 640, 0.35, '#0e3a4a');
}

function drawPart(c, kind, x, y, t, on, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (kind === 'nucleus') {
    if (on) { c.save(); c.globalCompositeOperation = 'lighter'; const gl = c.createRadialGradient(0, 0, 10, 0, 0, 52); gl.addColorStop(0, `rgba(200,150,255,${0.5 + 0.2 * Math.sin(t * 6)})`); gl.addColorStop(1, 'rgba(200,150,255,0)'); c.fillStyle = gl; c.beginPath(); c.arc(0, 0, 52, 0, 7); c.fill(); c.restore(); }
    SK.ball(c, 0, 0, 30, '#8a5ad0'); c.fillStyle = '#5a2e9a'; c.beginPath(); c.arc(6, 4, 11, 0, 7); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.55)'; for (let i = 0; i < 9; i++) { const a = i * 0.7; c.beginPath(); c.arc(Math.cos(a) * 25, Math.sin(a) * 25, 1.6, 0, 7); c.fill(); }
    if (on) { c.strokeStyle = '#fff2a0'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { const k = (t * 1.4 + i / 3) % 1; c.globalAlpha = 1 - k; c.beginPath(); c.arc(0, 0, 32 + k * 22, 0, 7); c.stroke(); } c.globalAlpha = 1;
      c.strokeStyle = '#ffe9ff'; c.lineWidth = 2.5; c.beginPath(); for (let i = 0; i < 12; i++) { const xx = -10 + i * 2, yy = Math.sin(i * 1.3 + t * 8) * 4 - 2; i ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke(); }
  } else if (kind === 'chloro') {
    c.rotate(-0.3);
    if (on) { c.save(); c.globalCompositeOperation = 'lighter'; const gl = c.createRadialGradient(0, 0, 8, 0, 0, 44); gl.addColorStop(0, `rgba(255,240,120,${0.55 + 0.2 * Math.sin(t * 7)})`); gl.addColorStop(1, 'rgba(255,240,120,0)'); c.fillStyle = gl; c.beginPath(); c.ellipse(0, 0, 44, 30, 0, 0, 7); c.fill(); c.restore(); }
    const gg = c.createLinearGradient(0, -14, 0, 14); gg.addColorStop(0, '#9ee06a'); gg.addColorStop(1, '#3a9a3a');
    c.fillStyle = gg; c.strokeStyle = '#1e6a2a'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 0, 26, 14, 0, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#2a7a2a'; for (const gx of [-14, -4, 6, 16]) for (let k = 0; k < 3; k++) { c.beginPath(); c.ellipse(gx, -5 + k * 4.5, 4, 1.8, 0, 0, 7); c.fill(); }
  } else if (kind === 'mito') {
    c.rotate(0.4); const mg = c.createLinearGradient(0, -12, 0, 12); mg.addColorStop(0, '#ffb07a'); mg.addColorStop(1, '#e0583a');
    c.fillStyle = mg; c.strokeStyle = '#8a2a1a'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 0, 24, 12, 0, 0, 7); c.fill(); c.stroke();
    c.strokeStyle = '#a83a24'; c.lineWidth = 1.8; c.beginPath(); for (let i = 0; i <= 16; i++) { const xx = -18 + i * 2.25, yy = (i % 2 ? 6 : -6); i ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke();
    if (on) { c.strokeStyle = '#fff36a'; c.lineWidth = 2.5; for (let i = 0; i < 2; i++) { const a = t * 5 + i * 3, r = 20; c.beginPath(); c.moveTo(Math.cos(a) * r, Math.sin(a) * r); c.lineTo(Math.cos(a) * (r + 8) + 3, Math.sin(a) * (r + 8) - 3); c.lineTo(Math.cos(a) * (r + 12), Math.sin(a) * (r + 14)); c.stroke(); } }
  } else if (kind === 'pebble') {
    c.fillStyle = '#9a8a7a'; c.strokeStyle = '#5a4a3a'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 0, 20, 15, 0.3, 0, 7); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(-6, -5, 7, 4, 0.3, 0, 7); c.fill(); c.fillStyle = '#7a6a5a'; c.beginPath(); c.arc(6, 4, 2.5, 0, 7); c.arc(-3, 6, 1.8, 0, 7); c.fill();
  } else if (kind === 'vacuole') {
    const sw = on ? 1.25 + Math.sin(t * 3) * 0.03 : 1; c.scale(sw, sw);
    const vg = c.createRadialGradient(-10, -10, 4, 0, 0, 40); vg.addColorStop(0, 'rgba(230,250,255,0.95)'); vg.addColorStop(1, 'rgba(120,190,240,0.85)');
    c.fillStyle = vg; c.strokeStyle = '#3a78b0'; c.lineWidth = 2; c.beginPath(); for (let i = 0; i <= 24; i++) { const a = i / 24 * 6.283, r = 36 + Math.sin(a * 3 + t * 2) * 3; i ? c.lineTo(Math.cos(a) * r * 1.15, Math.sin(a) * r * 0.9) : c.moveTo(Math.cos(a) * r * 1.15, Math.sin(a) * r * 0.9); } c.closePath(); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(-14, -14, 9, 5, -0.5, 0, 7); c.fill();
  }
  c.restore();
}

MG.add({
  id: 'cells_equip', stage: 'cells', cmd: 'PUT THE PARTS IN THE CELL!', time: 6, mood: 'sea', winText: 'The cell is alive!', failText: 'Hungry!',
  card: { title: 'Every part has a job', kind: 'Biology', ref: 'Organelles of plant and animal cells',
    text: 'A cell is the smallest living unit. Inside it, small parts called organelles each do one job.\n\nThe nucleus holds the DNA, the instructions that run the cell. Chloroplasts catch sunlight and use it to make sugar from water and carbon dioxide. Mitochondria break sugar down to release the energy the cell uses. In a plant cell, a big water-filled sac called the vacuole pushes out against a stiff cell wall, which keeps the plant firm.\n\nAnimal cells have a nucleus and mitochondria too, but no chloroplasts and no cell wall.',
    note: 'A cell stays alive because each of its parts does its own job. Plant cells also have chloroplasts and a wall; animal cells do not.' },
  init(g) {
    const s = g.s, L = LEVELS[Math.min(2, g.level)];
    s.v = SK.variant(g, 4); s.sun = s.v % 2 ? [316, 164] : [44, 164];
    s.L = L; s.parts = []; const kinds = L.need.concat(L.extra);
    // shuffle the waiting order with g.rand so it changes from game to game
    for (let i = kinds.length - 1; i > 0; i--) { const j = Math.floor(g.rand() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]]; }
    kinds.forEach((k, i) => { const hx = 44 + i * (232 / Math.max(1, kinds.length - 1)), hy = 548 + (i % 2 ? 14 : -6); s.parts.push({ kind: k, x: hx, y: hy, hx, hy, ph: g.rand() * 6, state: 'wait', at: 0 }); });
    s.used = {}; s.alive = -1; s.reject = -1; s.chain = -1;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    const p = SK.pick(s.parts.filter(q => q.state === 'wait' || q.state === 'home'), x, y, 46); if (p) { p.state = 'drag'; SK.dragStart(g, p, x, y); g.sfx('pop'); }
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj) return; const p = d.obj;
    if (g.done || !inCell(s.L.animal, p.x, p.y)) { p.state = 'home'; p.from = [p.x, p.y]; p.at = g.t; return; }
    if ((s.L.animal && p.kind === 'chloro') || p.kind === 'pebble') { p.state = 'spit'; p.from = [p.x, p.y]; p.at = g.t; s.reject = g.t; g.sfx('boing'); return; }
    const n = s.used[p.kind] || 0, slot = SLOTS[p.kind][n % SLOTS[p.kind].length]; s.used[p.kind] = n + 1;
    p.state = 'in'; p.from = [p.x, p.y]; p.to = [CX + slot[0], CY + slot[1]]; p.at = g.t; g.sfx('click');
    g.sfx({ nucleus: 'magic', chloro: 'sparkle', mito: 'ding', vacuole: 'bubble' }[p.kind]);
  },
  update(g, dt) {
    const s = g.s, L = s.L;
    for (const p of s.parts) {
      const k = Math.min(1, (g.t - p.at) / 0.3);
      if (p.state === 'wait') { p.x = p.hx + Math.sin(g.t * 0.8 + p.ph) * 12; p.y = p.hy + Math.cos(g.t * 1.1 + p.ph) * 6; }
      if (p.state === 'in') { p.x = SK.lerp(p.from[0], p.to[0], SK.easeOut(k)); p.y = SK.lerp(p.from[1], p.to[1], SK.easeOut(k)); }
      if (p.state === 'home' || p.state === 'spit') { const kk = Math.min(1, (g.t - p.at) / (p.state === 'spit' ? 0.6 : 0.35)); p.x = SK.lerp(p.from[0], p.hx, SK.easeOut(kk)); p.y = SK.lerp(p.from[1], p.hy, SK.easeOut(kk)) - (p.state === 'spit' ? Math.sin(kk * Math.PI) * 90 : 0); if (kk >= 1) p.state = 'wait'; }
    }
    if (s.alive < 0 && !g.done) {
      const have = {}; for (const p of s.parts) if (p.state === 'in' && g.t - p.at > 0.3) have[p.kind] = (have[p.kind] || 0) + 1;
      const need = {}; for (const k of L.need) need[k] = (need[k] || 0) + 1;
      if (s.chain < 0 && Object.keys(need).every(k => (have[k] || 0) >= need[k])) { s.chain = g.t; g.sfx('magic'); }
      // the parts work together (the fuse waits): the nucleus sends out instructions, sugar from the chloroplast (or,
      // in an animal cell, from food outside) travels to a mitochondrion, which turns it into energy; then the cell wakes
      if (s.chain >= 0) { g.held += dt; const k = g.t - s.chain; if (k > 0.45 && !s.sug) { s.sug = 1; g.sfx('pop'); } if (k > 1.0 && !s.zap) { s.zap = 1; g.sfx('sparkle'); g.sfx('ding'); }
        if (k > 1.5) { s.alive = g.t; g.win(); g.sfx('cheer'); g.burst(CX, CY, ['#b8ff7a', '#fff6a0', '#ffffff'], 26, 220); } }
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t, L = s.L, an = L.animal, alive = s.alive >= 0 ? Math.min(1, (t - s.alive) / 0.5) : 0, lost = g.result === 'fail';
    c.drawImage(g.bake('cells_equip_pond' + s.v, o => paintPond(o, s.sun, s.v)), 0, 0, 360, 640);
    // the sun
    c.save(); c.translate(s.sun[0], s.sun[1]); c.rotate(t * 0.3); c.fillStyle = '#ffe36a'; for (let i = 0; i < 10; i++) { c.rotate(Math.PI / 5); c.beginPath(); c.moveTo(18, -4); c.lineTo(30, 0); c.lineTo(18, 4); c.fill(); } c.restore();
    SK.ball(c, s.sun[0], s.sun[1], 17, '#ffd23a', { edge: '#e8a020' });
    const inn = s.parts.filter(p => p.state === 'in');
    // sunbeams: they reach the cell; a chloroplast inside turns them into sugar
    const chl = inn.filter(p => p.kind === 'chloro');
    c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 3; i++) { const tx = CX - 40 + i * 60, ty = CY - 40 + i * 30; c.strokeStyle = `rgba(255,240,160,${0.16 + 0.06 * Math.sin(t * 3 + i)})`; c.lineWidth = 16; c.beginPath(); c.moveTo(s.sun[0], s.sun[1]); c.lineTo(tx, ty); c.stroke(); } c.restore();
    for (const p of chl) { c.strokeStyle = 'rgba(255,240,150,0.75)'; c.lineWidth = 3; c.setLineDash([8, 8]); c.lineDashOffset = -t * 60; c.beginPath(); c.moveTo(s.sun[0], s.sun[1]); c.lineTo(p.x, p.y); c.stroke(); c.setLineDash([]);
      for (let i = 0; i < 3; i++) { const k = (t * 0.8 + i / 3 + p.ph) % 1; c.fillStyle = `rgba(255,255,255,${1 - k})`; c.strokeStyle = `rgba(200,150,40,${1 - k})`; c.lineWidth = 1.2; c.beginPath(); c.roundRect(p.x - 4 + Math.sin(k * 9 + i) * 10, p.y + 12 + k * 30, 7, 7, 1.5); c.fill(); c.stroke(); } }
    // the cell: wall and membrane, cytoplasm
    const breathe = 1 + Math.sin(t * 2) * 0.01 + alive * Math.sin(t * 8) * 0.012, vac = inn.some(p => p.kind === 'vacuole') || L.need.indexOf('vacuole') < 0;
    c.save(); c.translate(CX, CY); c.scale(breathe, breathe);
    const cyt = c.createRadialGradient(-30, -40, 20, 0, 0, 170); cyt.addColorStop(0, an ? 'rgba(255,230,230,0.85)' : 'rgba(236,255,214,0.85)'); cyt.addColorStop(1, an ? 'rgba(246,176,190,0.8)' : 'rgba(170,224,150,0.8)');
    c.fillStyle = cyt;
    const sag = !an && !vac ? 6 : 0; // a plant cell without its vacuole sags a little
    const shape = () => { c.beginPath(); if (an) { for (let i = 0; i <= 40; i++) { const a = i / 40 * 6.283, r = 1 + Math.sin(a * 4 + t * 1.5) * 0.025; i ? c.lineTo(Math.cos(a) * 118 * r, Math.sin(a) * 122 * r) : c.moveTo(Math.cos(a) * 118 * r, Math.sin(a) * 122 * r); } c.closePath(); } else { c.moveTo(-122, -132); c.quadraticCurveTo(0, -132 + sag, 122, -132); c.quadraticCurveTo(122 - sag, 0, 122, 132); c.quadraticCurveTo(0, 132 - sag, -122, 132); c.quadraticCurveTo(-122 + sag, 0, -122, -132); c.closePath(); } };
    shape(); c.fill();
    if (!an) { c.strokeStyle = '#3f8a3a'; c.lineWidth = 11; c.lineJoin = 'round'; shape(); c.stroke(); c.strokeStyle = '#8ad06a'; c.lineWidth = 3; shape(); c.stroke(); }
    else { c.strokeStyle = '#c0506a'; c.lineWidth = 4; shape(); c.stroke(); }
    // streaming specks in the cytoplasm (faster once alive)
    for (let i = 0; i < 14; i++) { const a = t * (0.3 + alive * 0.9) + i * 0.45, r = 70 + (i % 4) * 12; c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.arc(Math.cos(a) * r, Math.sin(a) * r * 1.05, 2.2, 0, 7); c.fill(); }
    c.restore();
    // the parts (inside ones do their jobs)
    for (const p of s.parts) { if (p.state === 'drag') continue; const bob = 0; drawPart(c, p.kind, p.x, p.y + bob, t, p.state === 'in' && t - p.at > 0.25); }
    c.save(); c.translate(CX, CY); c.scale(breathe, breathe);
    // the cell's face: asleep, awake once complete, sad and hungry when time runs out
    const ex = 34, ey = -6; c.strokeStyle = '#2a3a2a'; c.fillStyle = '#2a3a2a'; c.lineWidth = 3.5; c.lineCap = 'round';
    for (const sd of [-1, 1]) { const x = sd * ex - 6; if (alive > 0.3) { c.beginPath(); c.arc(x, ey, 7, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x - 2, ey - 3, 2.4, 0, 7); c.fill(); c.fillStyle = '#2a3a2a'; } else if (lost) { c.beginPath(); c.moveTo(x - 7, ey - 3 - sd * 3); c.lineTo(x + 7, ey - 3 + sd * 3); c.stroke(); } else { c.beginPath(); c.arc(x, ey - 2, 7, 0.2, Math.PI - 0.2); c.stroke(); } }
    c.beginPath(); if (alive > 0.3) c.arc(-6, 18, 14, 0.15, Math.PI - 0.15); else if (lost) c.arc(-6, 32, 11, Math.PI + 0.3, -0.3); else { c.moveTo(-12, 22); c.lineTo(0, 22); } c.stroke();
    if (!alive && !lost) { const k = (t * 0.7) % 1; c.fillStyle = `rgba(42,58,42,${0.7 * (1 - k)})`; c.font = '900 20px Nunito, system-ui, sans-serif'; c.fillText('z', 40 + k * 20, -40 - k * 30); }
    c.restore();
    if (lost && !an && !chl.length) { const k = (t * 2) % 1; c.strokeStyle = `rgba(120,60,20,${1 - k})`; c.lineWidth = 3; c.beginPath(); for (let i = 0; i < 6; i++) c.lineTo(CX - 20 + i * 8, CY + 70 + (i % 2 ? 6 : -6) + k * 10); c.stroke(); }
    if (s.chain >= 0) {
      const k = t - s.chain, nuc = inn.find(p => p.kind === 'nucleus'), mit = inn.find(p => p.kind === 'mito'), src = inn.find(p => p.kind === 'chloro');
      if (nuc && k < 0.8) for (const p of inn) { if (p === nuc) continue; const q = SK.clamp(k / 0.5, 0, 1); c.fillStyle = `rgba(220,170,255,${1 - Math.max(0, k - 0.5) * 3})`; for (let j = 0; j < 3; j++) { const qq = SK.clamp(q - j * 0.12, 0, 1); c.beginPath(); c.arc(SK.lerp(nuc.x, p.x, qq), SK.lerp(nuc.y, p.y, qq), 4, 0, 7); c.fill(); } }
      if (mit && k > 0.45 && k < 1.05) { const q = SK.easeInOut((k - 0.45) / 0.55), from = src ? [src.x, src.y] : [CX - 130, CY + 30]; const x = SK.lerp(from[0], mit.x, q), y = SK.lerp(from[1], mit.y, q) - Math.sin(q * Math.PI) * 30; c.fillStyle = '#fff'; c.strokeStyle = '#c89a30'; c.lineWidth = 2; c.beginPath(); c.roundRect(x - 7, y - 7, 14, 14, 3); c.fill(); c.stroke(); }
      if (mit && k > 1.0) { const q = SK.clamp((k - 1.0) / 0.5, 0, 1); c.save(); c.globalCompositeOperation = 'lighter'; const gl = c.createRadialGradient(mit.x, mit.y, 4, mit.x, mit.y, 40 + q * 80); gl.addColorStop(0, 'rgba(255,240,120,0.6)'); gl.addColorStop(1, 'rgba(255,240,120,0)'); c.fillStyle = gl; c.beginPath(); c.arc(mit.x, mit.y, 40 + q * 80, 0, 7); c.fill(); c.restore();
        c.strokeStyle = '#fff36a'; c.lineWidth = 3; for (let j = 0; j < 6; j++) { const a = j * 1.05 + k * 3, r0 = 22 + q * 20; c.beginPath(); c.moveTo(mit.x + Math.cos(a) * r0, mit.y + Math.sin(a) * r0); c.lineTo(mit.x + Math.cos(a + 0.2) * (r0 + 12), mit.y + Math.sin(a + 0.2) * (r0 + 12)); c.lineTo(mit.x + Math.cos(a) * (r0 + 22), mit.y + Math.sin(a) * (r0 + 22)); c.stroke(); } }
    }
    const dr = SK.dragging(g); if (dr) drawPart(c, dr.kind, dr.x, dr.y, t, false, 1.12);
    // the octopus host, bottom right
    SK.animal(c, 'octopus', 332, 614, 0.55, { t, pose: g.result === 'win' ? 'cheer' : 'idle', expr: g.result === 'win' ? 'laugh' : lost ? 'sad' : s.reject >= 0 && t - s.reject < 1 ? 'wow' : 'happy', facing: -1 });
    // guidance: glow on the next part to bring in, and a ghost hand dragging it into the cell
    const next = s.parts.find(p => p.state === 'wait' && !(an && p.kind === 'chloro') && p.kind !== 'pebble' && (s.used[p.kind] || 0) < L.need.filter(k => k === p.kind).length);
    const NAMES = { nucleus: 'Nucleus', chloro: 'Chloroplast', mito: 'Mitochondrion', vacuole: 'Vacuole', pebble: 'Pebble' }, shown = {};
    for (const p of s.parts) if (p.state === 'in' && !shown[p.kind]) { shown[p.kind] = 1; SK.tag(c, NAMES[p.kind], SK.clamp(p.x, 76, 284), p.y + 30, 18); }
    if (dr) SK.tag(c, NAMES[dr.kind], SK.clamp(dr.x, 76, 284), dr.y - 42, 18); else if (next) SK.tag(c, NAMES[next.kind], SK.clamp(next.x, 76, 284), next.y - 40, 18);
    if (next && !dr) { SK.target(c, g, CX, CY, 0, { w: 200, h: 220 }); SK.arrow(c, g, next.x, next.y, CX, CY + 60); SK.grab(c, g, next.x, next.y, 30); SK.demo(g, c, 'drag', [next.x, next.y], [CX, CY]); }
  },
  auto(g, dt, synth) {
    const s = g.s, L = s.L; if (g.done) return;
    if (s.botCur) { const b = s.botCur; if (!SK.bot.drag(g, synth, b.key, b.t, b.a, b.b, 0.35)) return; s.botCur = null; return; }
    const next = s.parts.find(p => p.state === 'wait' && !(L.animal && p.kind === 'chloro') && p.kind !== 'pebble' && (s.used[p.kind] || 0) < L.need.filter(k => k === p.kind).length);
    if (!next || g.t < 0.6) return; s.botN = (s.botN || 0) + 1;
    s.botCur = { key: 'd' + s.botN, t: g.t + 0.15, a: [next.x, next.y], b: [CX + (next.x < CX ? -10 : 10), CY] };
  },
});
