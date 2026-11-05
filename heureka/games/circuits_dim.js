// DIM! (earth_eng EE-02) — bedtime in a house with three rooms, each lit by a bulb on its own branch from one battery.
// Every bulb is far too bright. Drag each clamp down to squeeze its wire narrower: the narrow part resists the flow,
// fewer charges get through each second, and the bulb's glow shrinks. Match each glow to its dashed ring (a soft
// night-light for the sleepy rabbit, a reading light for the owl, a cosy glow for the hedgehog). Squeeze a wire shut
// and that room goes dark. Level 2: the rings ask for a closer match.
const SQ = 90, BUS = { l: 34, r: 340 }, ROWS = [230, 372, 514], CLAMP_X = 118, BULB_X = 214;
const ROOM = [{ kind: 'rabbit', want: 0.12, wall: '#3a3a6a' }, { kind: 'owl', want: 0.3, wall: '#5a3a5a' }, { kind: 'hedgehog', want: 0.5, wall: '#3a5a5a' }];
const TOL = [0.13, 0.11, 0.09]; // forgiving: the owner kept dimming and brightening without landing on the ring
function paintHouse(o) {
  o.fillStyle = '#141428'; o.fillRect(0, 0, 360, 640);
  for (let i = 0; i < 3; i++) { const y = ROWS[i]; o.fillStyle = ROOM[i].wall; o.beginPath(); o.roundRect(10, y - 66, 340, 128, 14); o.fill(); o.fillStyle = 'rgba(0,0,0,0.25)'; o.fillRect(10, y + 40, 340, 22); }
  // the battery at the top feeding both rails
  o.fillStyle = '#1e1e26'; o.beginPath(); o.roundRect(140, 118, 80, 38, 8); o.fill(); o.fillStyle = '#e8b83a'; o.beginPath(); o.roundRect(146, 122, 50, 30, 4); o.fill(); o.fillStyle = '#888'; o.fillRect(220, 130, 6, 14);
  o.fillStyle = '#fff6ea'; o.font = '900 20px Nunito, system-ui, sans-serif'; o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillText('+', 160, 138); o.fillStyle = '#c8d0e0'; o.fillText('−', 208, 138);
  o.strokeStyle = '#8a6a4a'; o.lineWidth = 6; o.lineCap = 'round'; o.lineJoin = 'round';
  o.beginPath(); o.moveTo(140, 137); o.lineTo(BUS.l, 137); o.lineTo(BUS.l, ROWS[2]); o.stroke();
  o.beginPath(); o.moveTo(226, 137); o.lineTo(BUS.r, 137); o.lineTo(BUS.r, ROWS[2]); o.stroke();
}
const hy = k => ROWS[k.i] - 40 + (k.y - (ROWS[k.i] - 40)) * 26 / SQ; // the handle moves 26 px for a 90 px drag, so it can be set finely
function bulb(c, x, y, b, t) {
  const R = 14 + 56 * Math.sqrt(b);
  if (b > 0.01) { const gr = c.createRadialGradient(x, y, 4, x, y, R); gr.addColorStop(0, `rgba(255,240,170,${0.55 + 0.4 * b})`); gr.addColorStop(0.5, `rgba(255,210,110,${0.25 + 0.3 * b})`); gr.addColorStop(1, 'rgba(255,200,90,0)'); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = gr; c.beginPath(); c.arc(x, y, R, 0, 7); c.fill(); c.restore(); }
  c.fillStyle = '#8a8a96'; c.fillRect(x - 7, y + 12, 14, 12);
  c.fillStyle = b > 0.01 ? `rgb(255,${200 + 50 * b},${120 + 110 * b})` : '#4a4a5a'; c.beginPath(); c.arc(x, y, 14, 0, 7); c.fill(); c.strokeStyle = 'rgba(0,0,0,0.3)'; c.lineWidth = 1.5; c.stroke();
  c.strokeStyle = b > 0.01 ? '#fff' : '#2a2a34'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - 5, y + 10); c.lineTo(x - 3, y - 2); c.lineTo(x + 3, y - 2); c.lineTo(x + 5, y + 10); c.stroke();
  return R;
}
MG.add({
  id: 'dim', stage: 'circuits', cmd: 'DIM EACH BULB TO ITS RING!', time: 7, mood: 'night', winText: 'Just right!', failText: 'Too bright!',
  card: { title: 'A narrow wire lets less through', kind: 'Engineering', ref: 'Resistance',
    text: 'A battery pushes electric charges round the loop. The charges have to squeeze through every part of it. Where the wire is narrow, fewer can pass each second. That slowing is called resistance.\n\nSqueeze a wire and its resistance goes up, so less current flows round that branch and the bulb glows more dimly. Squeeze it shut and no current flows at all, so the bulb goes out. A long, thin wire resists even more. Old dimmer switches worked like this, and every resistor in a circuit uses the same idea to set how much current flows.',
    note: 'Resistance slows the flow of charge: the narrower or longer the path, the less current gets through.' },
  init(g) { const s = g.s; s.v = SK.variant(g, 6); s.room = [[0, 1, 2], [1, 2, 0], [2, 0, 1], [0, 2, 1], [1, 0, 2], [2, 1, 0]][s.v].map(i => ROOM[i]); s.tol = TOL[Math.min(2, g.level)]; s.cl = ROWS.map((y, i) => ({ i, x: CLAMP_X, y: y - 40, w: 1, ok: false, okT: 0 })); s.flow = ROWS.map(() => 0); },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; const k = SK.pick(s.cl.map(q => ({ q, x: CLAMP_X, y: hy(q) })), x, y, 46); if (k) { SK.dragStart(g, k.q, x, y); g.sfx('tap'); } },
  move(g, x, y) {
    const s = g.s, k = SK.dragMove(g, x, y); if (!k) return; const y0 = ROWS[k.i] - 40;
    k.x = CLAMP_X; k.y = SK.clamp(k.y, y0, y0 + SQ); k.w = SK.clamp(1 - (k.y - y0) / SQ, 0, 1); if (k.w < 0.04) k.w = 0;
  },
  up(g) { SK.dragEnd(g); },
  update(g, dt) {
    const s = g.s;
    for (const k of s.cl) {
      const b = k.w * k.w; s.flow[k.i] += dt * (0.3 + 2.2 * k.w);
      const ok = k.w > 0 && Math.abs(b - s.room[k.i].want) <= s.tol; if (ok && !k.ok) { g.sfx('chime', { vol: 0.5, pitch: 0.8 + k.i * 0.2 }); } if (ok) k.okT += dt; else k.okT = 0; k.ok = ok;
    }
    if (!g.done && s.cl.every(k => k.okT > 0.25) && !SK.dragging(g)) { g.win(); g.sfx('cheer'); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win';
    c.drawImage(g.bake('dim_house', paintHouse), 0, 0, 360, 640);
    for (const k of s.cl) {
      const y = ROWS[k.i], R = s.room[k.i], b = k.w * k.w, ww = 1.5 + 12.5 * k.w;
      // the branch wire, narrow where the clamp squeezes it
      c.strokeStyle = '#8a6a4a'; c.lineCap = 'round'; c.lineWidth = 14; c.beginPath(); c.moveTo(BUS.l, y); c.lineTo(CLAMP_X - 26, y); c.moveTo(CLAMP_X + 26, y); c.lineTo(BUS.r, y); c.stroke();
      c.lineWidth = ww; c.strokeStyle = '#c88a5a'; c.beginPath(); c.moveTo(CLAMP_X - 26, y); c.lineTo(CLAMP_X + 26, y); c.stroke();
      c.fillStyle = '#8a6a4a'; c.beginPath(); c.moveTo(CLAMP_X - 32, y - 7); c.lineTo(CLAMP_X - 20, y - ww / 2); c.lineTo(CLAMP_X - 20, y + ww / 2); c.lineTo(CLAMP_X - 32, y + 7); c.fill(); c.beginPath(); c.moveTo(CLAMP_X + 32, y - 7); c.lineTo(CLAMP_X + 20, y - ww / 2); c.lineTo(CLAMP_X + 20, y + ww / 2); c.lineTo(CLAMP_X + 32, y + 7); c.fill();
      // charges: they march at a rate set by the current, squeezing into single file through the narrow part
      if (k.w > 0) for (let d = (s.flow[k.i] * 40) % 22; d < BUS.r - BUS.l; d += 22) { const x = BUS.l + d, inN = Math.abs(x - CLAMP_X) < 26, jy = inN ? 0 : Math.sin(d * 1.7) * 2.5; c.fillStyle = '#ffe27a'; c.beginPath(); c.arc(x, y + jy, inN ? 2.5 : 3.5, 0, 7); c.fill(); }
      // the clamp: two jaws and a handle you push down
      const sq = 1 - k.w, jawGap = ww / 2;
      c.fillStyle = '#c0c4cc'; c.strokeStyle = '#3a3e48'; c.lineWidth = 2;
      c.beginPath(); c.roundRect(CLAMP_X - 24, y - jawGap - 14, 48, 14, 4); c.fill(); c.stroke(); c.beginPath(); c.roundRect(CLAMP_X - 24, y + jawGap, 48, 14, 4); c.fill(); c.stroke();
      const hY = hy(k); c.strokeStyle = '#3a3e48'; c.lineWidth = 4; c.beginPath(); c.moveTo(CLAMP_X, hY); c.lineTo(CLAMP_X, y - jawGap - 14); c.stroke();
      c.fillStyle = '#e8323e'; c.beginPath(); c.roundRect(CLAMP_X - 26, hY - 14, 52, 18, 8); c.fill(); c.strokeStyle = '#7a0a14'; c.lineWidth = 2; c.stroke();
      void sq;
      // the bulb and the glow it should have (dashed ring)
      const Rt = 14 + 56 * Math.sqrt(R.want);
      bulb(c, BULB_X, y - 6, b, t);
      c.save(); c.fillStyle = k.ok ? 'rgba(120,255,150,0.12)' : 'rgba(255,240,200,0.10)'; c.beginPath(); c.arc(BULB_X, y - 6, Rt, 0, 7); c.fill(); c.restore();
      c.save(); c.strokeStyle = k.ok ? '#7aff9a' : 'rgba(255,240,200,0.8)'; c.lineWidth = 2.5; c.setLineDash([6, 6]); c.lineDashOffset = -t * 12; c.beginPath(); c.arc(BULB_X, y - 6, Rt, 0, 7); c.stroke(); c.restore();
      // the room's animal: squinting at a glare, sad in the dark, content when it's right
      const tooBright = b > R.want + s.tol, dark = k.w === 0;
      SK.animal(c, R.kind, 296, y + 40, R.kind === 'owl' ? 0.85 : 0.9, { t, pose: won ? 'cheer' : 'idle', expr: won || k.ok ? (R.kind === 'rabbit' ? 'happy' : 'laugh') : dark ? 'sad' : tooBright ? 'wow' : 'think', facing: -1 });
      if (R.kind === 'rabbit' && (k.ok || won)) { c.fillStyle = '#d8d0ff'; c.font = '900 18px Nunito, system-ui, sans-serif'; c.fillText('z', 316 + Math.sin(t * 2) * 3, y - 34); }
      if (k.i === 0) SK.tag(c, 'Narrow wire', CLAMP_X + 4, y + 36, 18);
    }
    SK.tag(c, 'Battery', 180, 137, 18);
    // guidance: push down the first clamp whose bulb is off its ring
    const nx = s.cl.find(k => !k.ok); if (nx && !g.done && !SK.dragging(g)) { const y0 = ROWS[nx.i] - 40, hT = y0 + (1 - Math.sqrt(s.room[nx.i].want)) * 26 - 5; SK.grab(c, g, CLAMP_X, hy(nx) - 5, 24); SK.target(c, g, CLAMP_X, hT, 0, { w: 60, h: 24 }); if (Math.abs(hT - hy(nx)) > 6) SK.arrow(c, g, CLAMP_X + 40, hy(nx) - 5, CLAMP_X + 40, hT, { from: 0, to: 0 }); }
    if (nx) { const y0 = ROWS[nx.i] - 40, wt = Math.sqrt(s.room[nx.i].want), ty = y0 + (1 - wt) * SQ; SK.demo(g, c, 'drag', [CLAMP_X, hy(nx) - 4], [CLAMP_X, ty - (nx.y - hy(nx)) - 4]); }
  },
  auto(g, dt, synth) {
    const s = g.s; s.cl.forEach((k, i) => { const y0 = ROWS[i] - 40, ty = y0 + (1 - Math.sqrt(s.room[i].want)) * SQ; SK.bot.drag(g, synth, 'c' + i, 1.0 + i * 0.6, [CLAMP_X, y0 - 4], [CLAMP_X, ty - 4], 0.4); });
  },
});
