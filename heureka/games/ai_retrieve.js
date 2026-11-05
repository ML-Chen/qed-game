// FETCH PAGES, THEN ASK THE AI! (cs BA-11) — retrieval (RAG). The rabbit asks the library's AI a question ("When does it
// close on Sunday?"). The question is a magnet card. Drag it along the library's shelf of pages: pages that match the
// question glow as it passes, and the closest one jumps out and sticks to it (near misses only wiggle). Then drop the
// card with its page into the robot's Prompt tray: the robot answers from the page, and points to it, and the rabbit hops
// in through the open door. Drop the bare question in without fetching a page and the robot guesses ("Midnight!"): the
// rabbit bonks into a locked door and the question comes back.
// Two questions (three at level 2), each answered by a page somewhere else on the shelf.
(() => {
  const PAGES = ['Sunday', 'Saturday', 'Pets', 'Bikes', 'Wi-Fi', 'Events', 'Café', 'Printing', 'Toilets'];
  const QS = [
    { q: ['When does it close', 'on Sunday?'], hit: 'Sunday', near: ['Saturday'], a: 'At 5 pm.', guess: 'Midnight!' },
    { q: ['Can I bring', 'my dog?'], hit: 'Pets', near: ['Café'], a: 'Yes, on a leash.', guess: 'Never!' },
    { q: ['Where can I', 'park my bike?'], hit: 'Bikes', near: ['Events'], a: 'By the side door.', guess: 'On the roof!' },
    { q: ['Is the Wi-Fi', 'free?'], hit: 'Wi-Fi', near: ['Printing'], a: 'Yes, it is free.', guess: '$10 an hour!' },
    { q: ['When is the', 'book sale?'], hit: 'Events', near: ['Saturday'], a: 'Saturday at 10.', guess: 'Last year!' },
    { q: ['Can I print', 'my homework?'], hit: 'Printing', near: ['Wi-Fi'], a: 'Yes, 10 cents a page.', guess: 'Only on Mars!' },
  ];
  const COLS = [66, 180, 294], ROWS = [164, 232, 300], CW = 100, CH = 54, START = { x: 180, y: 392 }, TRAY = { x: 262, y: 494, w: 156, h: 46 }, DOOR = { x: 74, y: 600 };
  function paint(o) {
    N6.vgrad(o, 0, 0, 360, 640, ['#2a2860', '#5a3a6a', '#8a5a6a']);
    // the bookcase behind the pages
    o.fillStyle = '#5a3420'; o.beginPath(); o.roundRect(8, 126, 344, 214, 12); o.fill(); o.fillStyle = '#3a2010'; o.fillRect(16, 134, 328, 198);
    for (const y of ROWS) { o.fillStyle = '#7a4a2a'; o.fillRect(16, y + CH / 2 + 4, 328, 8); }
    // the floor, the library building and its door
    N6.vgrad(o, 0, 420, 360, 220, ['#6a4a5a', '#3a2a3a']);
    o.fillStyle = '#c8a880'; o.beginPath(); o.moveTo(6, 470); o.lineTo(74, 432); o.lineTo(142, 470); o.closePath(); o.fill(); o.fillStyle = '#e8d0a8'; o.fillRect(14, 470, 120, 140);
    for (const x of [24, 114]) { o.fillStyle = '#f4e4c8'; o.fillRect(x, 476, 10, 134); }
    o.fillStyle = '#3a2a1a'; o.font = '900 13px Nunito, system-ui, sans-serif'; o.textAlign = 'center'; o.fillText('LIBRARY', 74, 462);
  }
  function page(c, x, y, name, glow, t, wig) {
    c.save(); c.translate(x, y); c.rotate(wig); if (glow > 0.05) { c.shadowColor = `rgba(255,226,122,${glow})`; c.shadowBlur = 22 * glow; }
    c.fillStyle = '#fff6ea'; c.strokeStyle = '#8a6a4a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-CW / 2, -CH / 2, CW, CH, 6); c.fill(); c.stroke(); c.shadowBlur = 0;
    c.fillStyle = 'rgba(138,106,74,0.35)'; for (let i = 0; i < 2; i++) c.fillRect(-CW / 2 + 10, 8 + i * 7, CW - 20, 3);
    c.fillStyle = '#3a1a10'; c.font = '900 18px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(name, 0, -8); c.restore();
  }
  function robot(c, x, y, t, mood) {
    c.save(); c.translate(x, y); const bob = Math.sin(t * 3) * 2;
    c.fillStyle = '#8a9ab8'; c.strokeStyle = '#2a2440'; c.lineWidth = 3; c.beginPath(); c.roundRect(-30, -10 + bob, 60, 46, 10); c.fill(); c.stroke();
    c.fillStyle = '#b8c8e0'; c.beginPath(); c.roundRect(-36, -64 + bob, 72, 50, 14); c.fill(); c.stroke();
    c.strokeStyle = '#2a2440'; c.beginPath(); c.moveTo(0, -64 + bob); c.lineTo(0, -78 + bob); c.stroke(); c.fillStyle = mood === 'bad' ? '#ff6a5a' : '#ffd45a'; c.beginPath(); c.arc(0, -80 + bob, 5, 0, 7); c.fill();
    c.fillStyle = '#1a1a30'; c.beginPath(); c.roundRect(-28, -56 + bob, 56, 32, 8); c.fill();
    c.fillStyle = mood === 'bad' ? '#ff8a6a' : '#8affd0'; for (const ex of [-12, 12]) { c.beginPath(); if (mood === 'good') c.arc(ex, -38 + bob, 6, Math.PI, 0); else c.arc(ex, -40 + bob, 5, 0, 7); mood === 'good' ? (c.lineWidth = 3, c.strokeStyle = '#8affd0', c.stroke()) : c.fill(); }
    c.restore();
  }
  function bubble(c, x, y, w, txt, col) { c.save(); c.fillStyle = col; c.strokeStyle = '#2a1430'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(x - w / 2, y - 22, w, 44, 14); c.fill(); c.stroke(); c.beginPath(); c.moveTo(x + 20, y + 22); c.lineTo(x + 34, y + 36); c.lineTo(x + 36, y + 22); c.fill(); c.restore(); N6.text(c, txt, x, y, 19, '#2a1430', { stroke: false }); }
  function newQ(g) { const s = g.s; s.Q = QS[s.qs[s.qi]]; s.card = { x: START.x, y: START.y, pages: [] }; s.phase = 'drag'; s.actT = 0; s.qT = g.t; for (const p of s.pages) if (!p.gone) p.wig = 0; }
  MG.add({
    id: 'ai_retrieve', stage: 'ai', cmd: 'FETCH PAGES, THEN ASK THE AI!', time: 7, mood: 'night', winText: 'Answered from the page!', failText: 'The AI just guessed!', hold: 1.6,
    card: { title: 'Look it up before answering', kind: 'AI', ref: 'Retrieval (RAG)',
      text: 'A language model only knows what it learned in training. It does not know this library\'s opening hours, so if you just ask, it may make up an answer that sounds sure.\n\nRetrieval fixes that. First a search finds the pages whose meaning is closest to the question. Those pages go into the prompt, the text the model reads, and the model answers from them and can point to where the answer came from.\n\nThis is called retrieval-augmented generation, or RAG.',
      note: 'Retrieval puts the right pages in front of the model, so it answers from facts instead of guessing.' },
    init(g) {
      const s = g.s; s.need = g.level >= 2 ? 3 : 2; s.v = SK.variant(g, 4);
      s.qs = SK.shuffled(g, [0, 1, 2, 3, 4, 5]); if (s.qs.indexOf(s.v) > 0) { s.qs.splice(s.qs.indexOf(s.v), 1); s.qs.unshift(s.v); }
      const names = SK.shuffled(g, PAGES); s.pages = names.map((n, i) => ({ name: n, x: COLS[i % 3], y: ROWS[Math.floor(i / 3)], hx: COLS[i % 3], hy: ROWS[Math.floor(i / 3)], wig: 0, gone: false, glow: 0 }));
      s.qi = 0; s.inside = 0; s.drag = false; newQ(g);
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.phase !== 'drag') return; if (Math.abs(x - s.card.x) < 124 && Math.abs(y - s.card.y) < 44) { s.drag = true; SK.dragStart(g, s.card, x, y); g.sfx('pop'); } },
    move(g, x, y) { const s = g.s; if (!s.drag) return; SK.dragMove(g, x, y); s.card.x = SK.clamp(s.card.x, 60, 300); s.card.y = SK.clamp(s.card.y, 150, 560); },
    up(g, x, y) {
      const s = g.s; if (!s.drag) return; s.drag = false; SK.dragEnd(g); const cd = s.card;
      if (Math.abs(cd.x - TRAY.x) < TRAY.w / 2 + 30 && Math.abs(cd.y - TRAY.y) < 56) { s.phase = 'read'; s.actT = g.t; cd.x = TRAY.x - 10; cd.y = TRAY.y - 2; g.sfx('click'); }
    },
    update(g, dt) {
      const s = g.s, cd = s.card;
      if (s.phase === 'drag') for (const p of s.pages) { // the question pulls on pages whose meaning is close to it
        if (p.gone) continue; const sim = p.name === s.Q.hit ? 1 : s.Q.near.includes(p.name) ? 0.45 : 0.08, d = SK.dist(cd.x, cd.y, p.x, p.y), pull = sim * SK.clamp(1 - (d - 40) / 90, 0, 1);
        p.glow = pull; p.wig = pull > 0.05 ? Math.sin(g.t * 30 + p.x) * 0.12 * pull : 0;
        if (s.drag && sim === 1 && d < 70) { p.gone = true; cd.pages.push(p.name); g.sfx('magic'); g.sfx('swoosh'); g.burst(p.x, p.y, ['#ffe27a', '#fff6ea'], 10, 120); }
      }
      if (g.done) return; const k = g.t - s.actT;
      if (s.phase === 'read' && k > 0.45) { s.phase = cd.pages.length ? 'good' : 'bad'; s.actT = g.t; g.sfx(cd.pages.length ? 'chime' : 'boing'); }
      if (s.phase === 'good' && k > 1.0) { s.inside++; s.qi++; g.sfx('ding'); if (s.qi >= s.need) { s.phase = 'won'; g.win(); g.sfx('cheer'); } else newQ(g); }
      if (s.phase === 'bad' && k > 0.55 && !s.bonk) { s.bonk = g.t; g.sfx('thud'); g.shake(4, 0.2); g.sfx('laugh'); }
      if (s.phase === 'bad' && k > 1.3) { s.bonk = 0; s.card.x = START.x; s.card.y = START.y; s.phase = 'drag'; }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', cd = s.card, k = g.t - s.actT;
      c.drawImage(g.bake('n6retr_bg', paint), 0, 0, 360, 640);
      for (const p of s.pages) if (!p.gone) page(c, p.x, p.y, p.name, p.glow, t, p.wig);
      for (const p of s.pages) if (p.gone && !cd.pages.includes(p.name)) { c.save(); c.strokeStyle = 'rgba(255,246,234,0.25)'; c.lineWidth = 2; c.setLineDash([5, 5]); c.strokeRect(p.hx - CW / 2, p.hy - CH / 2, CW, CH); c.restore(); }
      SK.tag(c, 'Library pages', 180, 128, 18);
      // the door: open for a good answer, locked for a guess
      const open = s.phase === 'good' || s.phase === 'won';
      c.save(); c.fillStyle = open ? '#2a1a14' : '#8a4a2a'; c.strokeStyle = '#3a1a10'; c.lineWidth = 3; c.beginPath(); c.roundRect(DOOR.x - 26, DOOR.y - 84, 52, 84, [24, 24, 0, 0]); c.fill(); c.stroke();
      if (open) { c.fillStyle = '#ffe9a0'; c.globalAlpha = 0.5; c.beginPath(); c.roundRect(DOOR.x - 20, DOOR.y - 78, 40, 78, [20, 20, 0, 0]); c.fill(); c.globalAlpha = 1; } else { c.fillStyle = '#ffd45a'; c.beginPath(); c.arc(DOOR.x + 14, DOOR.y - 40, 4, 0, 7); c.fill(); }
      if (s.phase === 'bad' && k > 0.5) { c.fillStyle = '#c0c0c8'; c.strokeStyle = '#3a3a4a'; c.lineWidth = 2; c.beginPath(); c.roundRect(DOOR.x - 10, DOOR.y - 50, 20, 18, 3); c.fill(); c.stroke(); c.beginPath(); c.arc(DOOR.x, DOOR.y - 50, 7, Math.PI, 0); c.stroke(); }
      c.restore();
      // the rabbit: waits by the door, hops in for a good answer, bonks a locked door for a guess
      let rx = 132, ry = 608, rp = 'idle', re = 'think';
      if (s.phase === 'good') { const q = SK.clamp(k / 0.9, 0, 1); rx = SK.lerp(132, DOOR.x, q); ry = 608 - Math.sin(q * Math.PI * 2) * 14; rp = 'hop'; re = 'laugh'; }
      if (s.phase === 'bad') { const q = SK.clamp(k / 0.55, 0, 1); rx = SK.lerp(132, DOOR.x + 22, q); rp = k > 0.55 ? 'sad' : 'walk'; re = k > 0.55 ? 'wow' : 'happy'; }
      if (s.phase !== 'good' || k < 0.85) SK.animal(c, 'rabbit', rx, ry, 0.85, { t, pose: won ? 'cheer' : lost ? 'sad' : rp, expr: won ? 'laugh' : lost ? 'sad' : re, facing: -1 });
      for (let i = 0; i < s.inside; i++) N6.text(c, '♥', 40 + i * 20, 494, 18, '#ff8aa8');
      // the robot and its prompt tray
      robot(c, TRAY.x, 600, t, s.phase === 'good' ? 'good' : s.phase === 'bad' ? 'bad' : '');
      c.save(); c.fillStyle = 'rgba(140,255,210,0.18)'; c.strokeStyle = '#8affd0'; c.lineWidth = 3; c.beginPath(); c.roundRect(TRAY.x - TRAY.w / 2, TRAY.y - TRAY.h / 2, TRAY.w, TRAY.h, 12); c.fill(); c.stroke(); c.restore();
      SK.tag(c, 'Prompt', TRAY.x, TRAY.y + TRAY.h / 2 + 2, 18, '#1a2a30', 'rgba(140,255,210,0.92)');
      SK.tag(c, 'AI', TRAY.x + 54, 556, 18);
      // the question card (a magnet), with any pages it has fetched hanging under it
      if (s.phase !== 'won') { const sc = s.phase === 'drag' ? 1 : 0.62; c.save(); c.translate(cd.x, cd.y); c.scale(sc, sc); c.translate(-cd.x, -cd.y);
        cd.pages.forEach((n, i) => page(c, cd.x + 78 + i * 8, cd.y + 26 + i * 6, n, 0.6, t, 0.12));
        c.save(); c.translate(cd.x, cd.y); c.fillStyle = 'rgba(20,10,30,0.35)'; c.beginPath(); c.roundRect(-112, -27, 224, 60, 10); c.fill();
        c.fillStyle = '#ffe98a'; c.strokeStyle = '#8a6a1a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-112, -32, 224, 60, 10); c.fill(); c.stroke();
        c.fillStyle = '#e8403a'; c.beginPath(); c.arc(-96, -32, 10, Math.PI, 0); c.lineTo(-86, -24); c.lineTo(-90, -24); c.arc(-96, -32, 6, 0, Math.PI, true); c.lineTo(-106, -24); c.lineTo(-102, -24); c.closePath(); c.fill(); c.restore();
        N6.text(c, s.Q.q[0], cd.x + 6, cd.y - 13, 18, '#3a1a10', { stroke: false }); N6.text(c, s.Q.q[1], cd.x + 6, cd.y + 10, 18, '#3a1a10', { stroke: false });
        c.restore(); if (s.phase === 'drag' && !s.drag && cd.x === START.x && cd.y === START.y) SK.tag(c, 'Question', cd.x - 64, cd.y - 44, 18);
      }
      // the robot's answer
      if (s.phase === 'good') { bubble(c, 196, 432, 236, s.Q.a, '#d8ffe8'); SK.tag(c, 'From: ' + s.Q.hit, 230, 464, 18, '#fff6ea', 'rgba(40,140,90,0.92)'); }
      if (s.phase === 'bad') bubble(c, 210, 432, 180, s.Q.guess, '#ffe0d8');
      SK.tag(c, 'Question ' + Math.min(s.qi + 1, s.need) + ' / ' + s.need, 290, 362, 18);
      // guidance: sweep the question to the page it matches, then drop it in the prompt
      if (s.phase === 'drag' && !g.done) { const hit = s.pages.find(p => p.name === s.Q.hit), to = cd.pages.length ? [TRAY.x, TRAY.y] : [hit.x, hit.y];
        SK.grab(c, g, cd.x, cd.y, 30); SK.target(c, g, to[0], to[1], 0, cd.pages.length ? { w: TRAY.w + 8, h: TRAY.h + 8 } : { w: CW + 10, h: CH + 10 }); SK.arrow(c, g, cd.x, cd.y, to[0], to[1], { from: 36, to: 40 });
        SK.demo(g, c, 'drag', [cd.x, cd.y], to); }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.phase !== 'drag' || g.t - s.qT < 0.4) return; const B = s._a = s._a || {}, hit = s.pages.find(p => p.name === s.Q.hit), t0 = Math.max(1.0, s.qT + 0.4), key = s.qi + '_' + Math.floor(s.qT * 10);
      if (!s.card.pages.length) SK.bot.drag(g, synth, 'a' + key, t0, [s.card.x, s.card.y], [hit.x, hit.y], 0.5);
      else { if (B['bt' + key] == null) B['bt' + key] = g.t + 0.25; if (!B['bp' + key] && g.t >= B['bt' + key]) B['bp' + key] = [s.card.x, s.card.y]; if (B['bp' + key]) SK.bot.drag(g, synth, 'b' + key, B['bt' + key], B['bp' + key], [TRAY.x, TRAY.y], 0.45); }
    },
  });
})();
