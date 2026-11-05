// HELP THE DUCK ACROSS! (cs AI-20) — attention. A duck wants to cross a busy road to its pond. Above, the AI reads a
// sentence about it: "The duck / can't cross / the road / because / it / is too wide." The word "it" means nothing on
// its own. Drag a string from "it" to the word it should look at: the string grows thick, "it" lights up with that
// word's meaning, and the AI acts on what it understood. "Too wide" means the road: a bridge unfolds and the duck walks
// across. "Too tired" means the duck: the owl flies down and carries it. Tie "it" to the wrong word and the AI gets
// the sentence wrong in a funny way (the duck puffs up wide; the road yawns and snores) and you tie again.
// Two ducks (three at level 2), each with a different sentence.
(() => {
  const SENT = [ // the last chunk, and which word "it" should look at: 'road' or 'duck'
    { end: 'is too wide', ref: 'road' }, { end: 'is too tired', ref: 'duck' }, { end: 'is too busy', ref: 'road' }, { end: 'is too small', ref: 'duck' },
  ];
  const ROAD = { y0: 380, y1: 484 }, POND = { x: 180, y: 300 }, DUCK0 = { x: 180, y: 556 };
  const ROWS = [150, 198], TH = 38;
  function tilesFor(sent) { // word chunks laid out in two centred rows; w estimated from the text length (hit-testing needs no canvas)
    const rows = [['The duck', "can't cross", 'the road'], ['because', 'it', sent.end]], out = [];
    rows.forEach((r, ri) => { const ws = r.map(t => t === 'it' ? 78 : Math.max(44, t.length * 9.2 + 20)), W = ws.reduce((a, b) => a + b, 0) + 10 * (r.length - 1); let x = 180 - W / 2;
      r.forEach((t, i) => { out.push({ t, x: x + ws[i] / 2, y: ROWS[ri], w: ws[i], ref: t === 'The duck' ? 'duck' : t === 'the road' ? 'road' : null, it: t === 'it' }); x += ws[i] + 10; }); });
    return out;
  }
  function paint(o) {
    P.sky(o, 360, 640, ['#2a2860', '#6a4a8a', '#c88a9a']);
    // the far meadow and the pond
    N6.vgrad(o, 0, 236, 360, 150, ['#7ab860', '#5a9a48']); P.grassTufts(o, 360, 250, 372, 20, '#4a8a3a', 6);
    const pg = o.createRadialGradient(POND.x - 20, POND.y - 10, 6, POND.x, POND.y, 90); pg.addColorStop(0, '#9ae0f0'); pg.addColorStop(1, '#3a8ab0'); o.fillStyle = pg; o.beginPath(); o.ellipse(POND.x, POND.y, 92, 34, 0, 0, 7); o.fill();
    o.strokeStyle = 'rgba(255,255,255,0.5)'; o.lineWidth = 2; o.beginPath(); o.ellipse(POND.x, POND.y, 92, 34, 0, 0, 7); o.stroke();
    for (const [x, y] of [[106, 286], [262, 294], [250, 318]]) { o.fillStyle = '#4a9a3a'; o.beginPath(); o.ellipse(x, y, 12, 6, 0.2, 0, 7); o.fill(); }
    for (let i = 0; i < 5; i++) { o.fillStyle = '#5a8a3a'; o.beginPath(); o.ellipse(70 + i * 4, 290 - i * 6, 2.5, 14, -0.2 + i * 0.1, 0, 7); o.fill(); }
    // the road
    N6.vgrad(o, 0, ROAD.y0, 360, ROAD.y1 - ROAD.y0, ['#5a5468', '#47425a']); o.fillStyle = '#d8d0c0'; o.fillRect(0, ROAD.y0, 360, 4); o.fillRect(0, ROAD.y1 - 4, 360, 4);
    o.fillStyle = '#f5d040'; for (let x = 6; x < 360; x += 38) o.fillRect(x, (ROAD.y0 + ROAD.y1) / 2 - 2, 22, 4);
    // the near meadow
    N6.vgrad(o, 0, ROAD.y1, 360, 640 - ROAD.y1, ['#8ac860', '#5a9a40']); P.grassTufts(o, 360, 500, 610, 24, '#4a8a3a', 9); P.flowers(o, 360, 520, 610, 10);
  }
  function car(c, x, y, col, dir) { c.save(); c.translate(x, y); c.scale(dir, 1); c.fillStyle = 'rgba(20,10,30,0.3)'; c.beginPath(); c.ellipse(0, 14, 34, 6, 0, 0, 7); c.fill();
    c.fillStyle = col; c.strokeStyle = P.shade(col, -0.5); c.lineWidth = 2; c.beginPath(); c.roundRect(-34, -6, 68, 20, 7); c.fill(); c.stroke(); c.beginPath(); c.roundRect(-18, -20, 34, 16, 6); c.fill(); c.stroke();
    c.fillStyle = '#bfe6f8'; c.fillRect(-14, -17, 12, 10); c.fillRect(2, -17, 11, 10); c.fillStyle = '#fff2a0'; c.beginPath(); c.arc(32, 3, 3, 0, 7); c.fill();
    c.fillStyle = '#2a2430'; for (const wx of [-20, 20]) { c.beginPath(); c.arc(wx, 14, 7, 0, 7); c.fill(); } c.restore(); }
  function cars(c, t, busy, stop) { // two lanes, always moving (the sentence decides how busy)
    const n = busy ? 4 : 2, cols = ['#e8563a', '#4a8ad8', '#f5c23a', '#9a5ad0'];
    for (let lane = 0; lane < 2; lane++) for (let i = 0; i < n; i++) { const sp = lane ? -120 : 140, per = 360 / n + 60; let x = ((i * per + t * sp * (stop ? 0.15 : 1)) % (per * n)); if (x < 0) x += per * n; x -= 60; if (lane) x = 360 - x; car(c, x, lane ? 458 : 406, cols[(i + lane) % 4], lane ? -1 : 1); }
  }
  function tile(c, tl, t, lit, glowIt) {
    c.save(); const x = tl.x - tl.w / 2, y = tl.y - TH / 2;
    c.fillStyle = 'rgba(20,10,30,0.4)'; c.beginPath(); c.roundRect(x + 2, y + 4, tl.w, TH, 10); c.fill();
    c.fillStyle = tl.it ? (lit ? (lit === 'road' ? '#8a86a8' : '#ffe07a') : '#fff6ea') : '#f4e6cc'; c.strokeStyle = tl.it ? '#e8563a' : '#8a5a3a'; c.lineWidth = tl.it ? 3.5 : 2; c.beginPath(); c.roundRect(x, y, tl.w, TH, 10); c.fill(); c.stroke();
    c.font = '900 19px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#3a1a10'; c.fillText(tl.t, tl.x + (tl.it && lit ? 14 : 0), tl.y + 1); c.restore();
  }
  function drawDuck(c, x, y, o) { // o: { sx (width puff), zzz, t, pose, expr }
    c.save(); c.translate(x, y); c.scale(o.sx || 1, 1); SK.animal(c, 'duck', 0, 0, 0.95, { t: o.t, pose: o.pose || 'idle', expr: o.expr || 'happy', facing: o.face || 1 }); c.restore();
    if (o.zzz) N6.text(c, 'z z', x + 30, y - 70 - Math.sin(o.t * 3) * 4, 18, '#fff6ea');
  }
  function newRound(g) { const s = g.s; s.sent = SENT[s.order[s.round]]; s.tiles = tilesFor(s.sent); s.phase = 'tie'; s.tie = null; s.out = null; s.actT = 0; s.duck = { x: DUCK0.x, y: DUCK0.y }; s.roundT = g.t; }
  MG.add({
    id: 'ai_attend', stage: 'ai', cmd: 'HELP THE DUCK ACROSS!', time: 6, mood: 'night', winText: 'It understood!', failText: 'Still stuck!', hold: 1.6,
    card: { title: 'Which word does "it" mean?', kind: 'AI', ref: 'Attention (transformers)',
      text: 'A word like "it" means nothing on its own. To understand it, a language model lets each word look at the other words in the sentence and borrow meaning from the ones that help. This is called attention.\n\nIn "the road is too wide", "it" should look at "road". In "too tired", it should look at "duck". Look at the wrong word and the model gets the sentence wrong.\n\nA real model spreads its attention over many words at once, in many layers. This game shows the strongest string.',
      note: 'Attention lets each word look at the other words that explain it, so the model knows what "it" means.' },
    init(g) {
      const s = g.s; s.need = g.level >= 2 ? 3 : 2; s.v = SK.variant(g, 4);
      const roadFirst = [[0, 1, 2], [1, 0, 3], [2, 3, 0], [3, 2, 1]][s.v]; s.order = roadFirst; s.round = 0; s.across = []; s.drag = null; newRound(g);
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || s.phase !== 'tie') return; const it = s.tiles.find(t => t.it);
      if (Math.abs(x - it.x) < it.w / 2 + 22 && Math.abs(y - it.y) < 34) { s.drag = { x, y }; SK.dragStart(g, null, x, y); g.sfx('stretch', { vol: 0.4 }); }
    },
    move(g, x, y) { const s = g.s; if (s.drag) { s.drag.x = x; s.drag.y = y; SK.dragMove(g, x, y); } },
    up(g, x, y) {
      const s = g.s; if (!s.drag) return; SK.dragEnd(g); s.drag = null; if (g.done || s.phase !== 'tie') return;
      const tl = s.tiles.find(t => !t.it && Math.abs(x - t.x) < t.w / 2 + 10 && Math.abs(y - t.y) < 30); if (!tl) { g.sfx('boing', { vol: 0.4 }); return; }
      s.tie = tl; s.phase = 'act'; s.actT = g.t; s.out = tl.ref === s.sent.ref ? 'good' : tl.ref ? 'wrong_' + tl.ref : 'none'; g.sfx('snap'); g.sfx(s.out === 'good' ? 'magic' : 'boing');
    },
    update(g, dt) {
      const s = g.s; if (g.done || s.phase !== 'act') return; const k = g.t - s.actT;
      if (s.out === 'good') {
        const helper = s.sent.ref === 'road' ? 'bridge' : 'owl', T0 = helper === 'bridge' ? 0.7 : 0.6, T1 = 1.6;
        if (k > T0) { const q = SK.clamp((k - T0) / (T1 - T0), 0, 1); s.duck.x = DUCK0.x + (helper === 'owl' ? Math.sin(q * Math.PI) * 40 : 0); s.duck.y = SK.lerp(DUCK0.y, POND.y + 6, SK.easeInOut(q)); }
        if (k > T1) { s.across.push(s.sent.ref); g.sfx('splash'); g.sfx('quack'); g.burst(POND.x, POND.y, ['#ffffff', '#9ae0f0', '#ffd45a'], 14, 140); s.round++;
          if (s.round >= s.need) { s.phase = 'done'; g.win(); g.sfx('cheer'); } else newRound(g); }
      } else if (k > 1.3) { s.phase = 'tie'; s.tie = null; s.out = null; }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', k = s.phase === 'act' ? t - s.actT : 0;
      c.drawImage(g.bake('n6attend_bg', paint), 0, 0, 360, 640);
      // the ducks already across, swimming
      s.across.forEach((r, i) => SK.animal(c, 'duck', POND.x - 40 + i * 40 + Math.sin(t * 2 + i) * 6, POND.y + 12, 0.7, { t, pose: won ? 'cheer' : 'idle', expr: 'laugh', noShadow: true }));
      const out = s.out, busy = s.sent.end === 'is too busy' || out === 'wrong_road' && false, snoring = out === 'wrong_road' && s.phase === 'act';
      // the helper: a bridge unfolding across the road, or the owl swooping down to carry the duck
      const good = out === 'good' && s.phase === 'act', bridge = good && s.sent.ref === 'road', owl = good && s.sent.ref === 'duck';
      cars(c, t, s.sent.end === 'is too busy', bridge || snoring);
      if (bridge) { const q = SK.clamp(k / 0.6, 0, 1), y1 = SK.lerp(ROAD.y1 + 14, ROAD.y0 - 14, q); c.save(); c.fillStyle = 'rgba(20,10,30,0.3)'; c.fillRect(150, y1 + 8, 64, ROAD.y1 + 14 - y1);
        for (let y = ROAD.y1 + 10; y > y1; y -= 12) { c.fillStyle = (Math.floor(y / 12) % 2) ? '#c88a50' : '#b87a40'; c.fillRect(146, y - 10, 68, 11); c.strokeStyle = '#6a3a1a'; c.lineWidth = 1.5; c.strokeRect(146, y - 10, 68, 11); }
        c.fillStyle = '#7a4a2a'; c.fillRect(142, y1 - 4, 6, ROAD.y1 + 14 - y1); c.fillRect(212, y1 - 4, 6, ROAD.y1 + 14 - y1); c.restore(); }
      // the road, if "it" looked at the road in a "tired" sentence: sleepy eyes and a yawn
      if (snoring) { const q = SK.clamp(k * 3, 0, 1); c.save(); c.globalAlpha = q; for (const ex of [120, 240]) { c.fillStyle = '#fff6ea'; c.beginPath(); c.ellipse(ex, 432, 22, 10, 0, 0, 7); c.fill(); c.strokeStyle = '#2a1430'; c.lineWidth = 3; c.beginPath(); c.arc(ex, 428, 14, 0.3, Math.PI - 0.3); c.stroke(); } c.restore(); N6.text(c, 'Z z z', 300, 400 - k * 20, 22, '#fff6ea'); }
      // the duck
      const puff = out === 'wrong_duck' && s.phase === 'act' && (s.sent.ref === 'road') ? 1 + 1.3 * Math.sin(SK.clamp(k / 1.3, 0, 1) * Math.PI) : 1;
      const tiredDuck = s.sent.end === 'is too tired', smallDuck = s.sent.end === 'is too small';
      if (s.phase !== 'done' && !owl) drawDuck(c, s.duck.x, s.duck.y, { t, sx: puff, zzz: tiredDuck && !good, pose: good ? 'walk' : out && out !== 'good' && s.phase === 'act' ? 'sad' : 'idle', expr: puff > 1.1 ? 'wow' : out === 'none' || snoring ? 'sad' : tiredDuck ? 'sad' : 'happy', face: 1 });
      if (owl) { const q = SK.clamp(k / 0.6, 0, 1), ox = q < 1 ? SK.lerp(-40, s.duck.x, q) : s.duck.x, oy = q < 1 ? SK.lerp(260, s.duck.y - 64, q) : s.duck.y - 64;
        drawDuck(c, s.duck.x, s.duck.y, { t, pose: 'cheer', expr: 'laugh' }); SK.animal(c, 'owl', ox, oy, 1.0, { t, pose: 'cheer', expr: 'happy', noShadow: true }); }
      if (smallDuck && !good && s.phase !== 'done') SK.tag(c, 'Duckling', s.duck.x + 64, s.duck.y - 30, 18);
      // ducks still waiting their turn
      for (let i = s.round + 1; i < s.need; i++) SK.animal(c, 'duck', 40 + (i - s.round - 1) * 34, 600, 0.6, { t, pose: 'idle', expr: 'happy', phase: i });
      SK.tag(c, 'Duck ' + Math.min(s.round + 1, s.need) + ' / ' + s.need, 296, 600, 18);
      // the sentence the AI reads
      c.save(); c.fillStyle = 'rgba(20,10,40,0.55)'; c.beginPath(); c.roundRect(10, 124, 340, 100, 16); c.fill(); c.restore();
      const it = s.tiles.find(tl => tl.it), lit = s.tie && s.tie.ref ? s.tie.ref : null;
      // the attention string: from "it" to the finger, or tied to a word and thickening
      const string = (bx, by, w, col) => { c.save(); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(it.x, it.y - 4); c.quadraticCurveTo((it.x + bx) / 2, Math.min(it.y, by) - 60, bx, by); c.stroke(); c.restore(); };
      if (s.drag) string(s.drag.x, s.drag.y, 4, '#ffd45a');
      if (s.tie) { const th = 3 + 9 * SK.clamp(k / 0.4, 0, 1), col = out === 'good' ? '#ffd45a' : '#e8563a'; string(s.tie.x, s.tie.y - 12, th, col); }
      for (const tl of s.tiles) tile(c, tl, t, tl.it ? lit : null);
      if (s.tie && s.tie.ref) { // "it" now carries the meaning it looked at
        c.save(); c.globalAlpha = SK.clamp(k * 3, 0, 1); const ix = it.x - 18, iy = it.y; c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.arc(ix, iy, 14, 0, 7); c.fill(); c.stroke();
        if (s.tie.ref === 'road') { c.fillStyle = '#5a5468'; c.fillRect(ix - 11, iy - 6, 22, 12); c.fillStyle = '#f5d040'; c.fillRect(ix - 8, iy - 1, 6, 2); c.fillRect(ix + 2, iy - 1, 6, 2); } else SK.animal(c, 'duck', ix, iy + 9, 0.26, { t, noShadow: true }); c.restore(); }
      if (s.tie) SK.tag(c, 'Attention', SK.clamp((it.x + s.tie.x) / 2, 70, 290), 250, 18, '#3a1640', 'rgba(255,212,90,0.92)');
      if (out === 'none' && s.phase === 'act') N6.text(c, '?', it.x + 34, it.y - 30, 30, '#fff6ea');
      // the host
      SK.animal(c, 'owl', 318, 560, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : out && out !== 'good' ? 'wow' : 'think', facing: -1 });
      // guidance: drag a string from "it" to the word the sentence is about
      if (s.phase === 'tie' && !g.done) { const tg = s.tiles.find(tl => tl.ref === s.sent.ref);
        SK.grab(c, g, it.x, it.y, 24); SK.target(c, g, tg.x, tg.y, 0, { w: tg.w + 8, h: TH + 8 }); SK.arrow(c, g, it.x, it.y, tg.x, tg.y, { from: 24, to: 30 });
        SK.demo(g, c, 'drag', [it.x, it.y], [tg.x, tg.y], { arc: 50 }); }
    },
    auto(g, dt, synth) { const s = g.s; if (g.done || s.phase !== 'tie' || g.t - s.roundT < 0.5) return; const it = s.tiles.find(t => t.it), tg = s.tiles.find(t => t.ref === s.sent.ref);
      SK.bot.drag(g, synth, 'tie' + s.round, Math.max(1.0, s.roundT + 0.4), [it.x, it.y], [tg.x, tg.y], 0.45); },
  });
})();
