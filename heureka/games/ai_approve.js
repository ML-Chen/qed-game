// PULL RISKY JOBS INTO THE TRAY! (cs BA-14) — human approval for an AI agent. The agent robot's to-do cards ride
// a conveyor into it, and it does each one as it arrives: reading the calendar, drafting an email, checking the weather
// are harmless (and can be undone). But some can't be undone: send the email to the boss, delete the folder, pay $500.
// Drag those off the belt into the "Ask me first" tray before the robot reaches them; they wait there for you. Let one
// through and the robot does it: the folder goes into the shredder, the half-written email rockets off, the money pours
// away and the owl is aghast. The tray has three spots: fill it with harmless cards and there is no room
// left when a risky one comes.
// Level 1: more cards, a faster belt; level 2: faster still.
(() => {
  const CARDS = { cal: ['Read', 'calendar', 0], draft: ['Draft', 'an email', 0], weather: ['Check', 'weather', 0], sort: ['Sort', 'photos', 0], notes: ['Write', 'notes', 0],
    send: ['Send email', 'to boss', 1], del: ['Delete', 'folder', 1], pay: ['Pay', '$500', 1], buy: ['Buy', 'a car', 1] };
  const STREAMS = [
    [['cal', 'send', 'weather', 'del', 'draft'], ['draft', 'notes', 'pay', 'cal', 'send', 'sort'], ['cal', 'del', 'weather', 'pay', 'notes', 'send', 'draft']],
    [['weather', 'pay', 'draft', 'send', 'cal'], ['cal', 'del', 'sort', 'weather', 'buy', 'draft'], ['notes', 'send', 'cal', 'del', 'sort', 'pay', 'weather']],
    [['draft', 'del', 'cal', 'buy', 'notes'], ['sort', 'send', 'cal', 'pay', 'draft', 'weather'], ['weather', 'pay', 'draft', 'del', 'cal', 'buy', 'sort']],
    [['notes', 'buy', 'sort', 'send', 'weather'], ['weather', 'cal', 'del', 'notes', 'send', 'draft'], ['draft', 'send', 'notes', 'buy', 'weather', 'del', 'cal']],
  ];
  const BELT = 404, CW = 140, CH = 62, GAP = 26, END = 112, TRAY = { x: 196, y: 240, w: 300, h: 92 }, SPEED = [62, 76, 96];
  const slotX = i => TRAY.x - 96 + i * 96;
  function paint(o) {
    N6.vgrad(o, 0, 0, 360, 640, ['#2a2860', '#4a3a7a', '#6a4a8a']);
    o.fillStyle = 'rgba(255,255,255,0.05)'; for (let y = 120; y < 640; y += 26) o.fillRect(0, y, 360, 1);
    // the conveyor
    o.fillStyle = '#2a2438'; o.fillRect(0, BELT + 32, 360, 26); o.fillStyle = '#4a4458'; o.fillRect(0, BELT + 30, 360, 6);
    for (let x = 10; x < 360; x += 30) { o.fillStyle = '#1a1428'; o.beginPath(); o.arc(x, BELT + 46, 8, 0, 7); o.fill(); }
    const r = P.rng(4); for (let i = 0; i < 14; i++) { const w = 20 + r() * 30, h = 40 + r() * 110, x = i * 27 - 10; o.fillStyle = '#1e1a40'; o.fillRect(x, 340 - h, w, h); for (let j = 0; j < 8; j++) if (r() < 0.5) { o.fillStyle = 'rgba(255,220,140,0.55)'; o.fillRect(x + 4 + (j % 2) * 10, 344 - h + 8 + Math.floor(j / 2) * 14, 5, 6); } }
    N6.vgrad(o, 0, 470, 360, 170, ['#3a3050', '#241c34']);
    o.fillStyle = '#6a4a3a'; o.fillRect(200, 560, 160, 14); o.fillStyle = '#4a3020'; o.fillRect(210, 574, 10, 50); o.fillRect(340, 574, 10, 50);
  }
  function card(c, k, x, y, o = {}) {
    const [a, b, risky] = CARDS[k]; c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot);
    c.fillStyle = 'rgba(10,6,20,0.4)'; c.beginPath(); c.roundRect(-CW / 2 + 3, -CH / 2 + 5, CW, CH, 10); c.fill();
    c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-CW / 2, -CH / 2, CW, CH, 10); c.fill(); c.stroke();
    icon(c, k, -CW / 2 + 20, 0);
    c.font = '900 17px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#2a1430'; c.fillText(a, 14, -11); c.fillText(b, 14, 12);
    if (o.wait) { c.fillStyle = '#ffd45a'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.arc(CW / 2 - 6, -CH / 2 + 4, 11, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#3a1640'; c.font = '900 15px Nunito, system-ui, sans-serif'; c.fillText('?', CW / 2 - 6, -CH / 2 + 5); }
    c.restore();
  }
  function icon(c, k, x, y) { c.save(); c.translate(x, y); c.strokeStyle = '#3a1640'; c.lineWidth = 1.8;
    if (k === 'cal') { c.fillStyle = '#fff'; c.fillRect(-10, -9, 20, 18); c.strokeRect(-10, -9, 20, 18); c.fillStyle = '#e8563a'; c.fillRect(-10, -9, 20, 5); }
    if (k === 'draft' || k === 'notes') { c.fillStyle = '#f5e8a0'; c.fillRect(-9, -11, 18, 22); c.strokeRect(-9, -11, 18, 22); c.fillStyle = '#8a7a6a'; for (let i = 0; i < 3; i++) c.fillRect(-6, -6 + i * 5, 12, 2); if (k === 'draft') { c.fillStyle = '#f5c23a'; c.save(); c.rotate(0.6); c.fillRect(2, -14, 5, 18); c.restore(); } }
    if (k === 'weather') { c.fillStyle = '#f5c23a'; c.beginPath(); c.arc(-3, -3, 7, 0, 7); c.fill(); c.fillStyle = '#e8eef8'; c.beginPath(); c.arc(2, 4, 6, 0, 7); c.arc(8, 3, 5, 0, 7); c.fill(); }
    if (k === 'sort') { c.fillStyle = '#8ad0f0'; c.fillRect(-10, -8, 20, 16); c.strokeRect(-10, -8, 20, 16); c.fillStyle = '#5aa84a'; c.beginPath(); c.moveTo(-10, 8); c.lineTo(-2, -2); c.lineTo(6, 8); c.fill(); }
    if (k === 'send') { c.fillStyle = '#fff'; c.fillRect(-10, -7, 20, 14); c.strokeRect(-10, -7, 20, 14); c.beginPath(); c.moveTo(-10, -7); c.lineTo(0, 1); c.lineTo(10, -7); c.stroke(); c.fillStyle = '#ff8a30'; c.beginPath(); c.moveTo(-10, -3); c.lineTo(-16, 0); c.lineTo(-10, 3); c.fill(); }
    if (k === 'del') { c.fillStyle = '#8a8a9a'; c.fillRect(-8, -6, 16, 16); c.strokeRect(-8, -6, 16, 16); c.fillRect(-10, -10, 20, 4); c.strokeRect(-10, -10, 20, 4); }
    if (k === 'pay') { N6.coin(c, -3, 2, 8, ''); N6.coin(c, 4, -4, 8, ''); }
    if (k === 'buy') { c.fillStyle = '#e8403a'; c.beginPath(); c.roundRect(-12, -3, 24, 9, 3); c.fill(); c.stroke(); c.beginPath(); c.roundRect(-6, -9, 12, 7, 3); c.fill(); c.stroke(); c.fillStyle = '#2a2430'; c.beginPath(); c.arc(-6, 7, 3, 0, 7); c.arc(6, 7, 3, 0, 7); c.fill(); }
    c.restore(); }
  function robot(c, x, y, t, work) { c.save(); c.translate(x, y); const b = Math.sin(t * (work ? 16 : 3)) * (work ? 3 : 2);
    c.fillStyle = '#8a9ab8'; c.strokeStyle = '#1a1430'; c.lineWidth = 3; c.beginPath(); c.roundRect(-42, -50 + b, 84, 92, 14); c.fill(); c.stroke();
    c.fillStyle = '#1a1a30'; c.beginPath(); c.roundRect(-32, -40 + b, 64, 34, 8); c.fill(); c.fillStyle = '#8affd0'; c.beginPath(); c.arc(-12, -23 + b, 5, 0, 7); c.arc(12, -23 + b, 5, 0, 7); c.fill();
    c.fillStyle = '#2a2438'; c.beginPath(); c.roundRect(28, -2 + b, 18, 34, 4); c.fill(); c.strokeStyle = '#1a1430'; c.beginPath(); c.moveTo(0, -50 + b); c.lineTo(0, -64 + b); c.stroke(); c.fillStyle = '#ffd45a'; c.beginPath(); c.arc(0, -66 + b, 5, 0, 7); c.fill(); c.restore(); }
  function effect(c, k, t0, t) { // what the robot just did with a card that can't be undone
    const q = SK.clamp((t - t0) / 0.8, 0, 1), x = 70, y = 300;
    if (k === 'del') { c.fillStyle = '#5a5a6a'; c.fillRect(x - 34, y + 8, 68, 30); c.fillStyle = '#f5c23a'; c.fillRect(x - 24, y - 30 + q * 30, 48, 34 * (1 - q)); for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#f5c23a' : '#fff6ea'; c.fillRect(x - 26 + i * 9, y + 38, 5, 26 * q); } SK.tag(c, 'Shredded!', x + 70, y - 30, 18, '#fff6ea', 'rgba(190,40,40,0.9)'); }
    if (k === 'send') { const rx = x + q * 260, ry = y - q * 160; c.save(); c.translate(rx, ry); c.rotate(-0.55); c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.beginPath(); c.roundRect(-20, -13, 40, 26, 3); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-20, -13); c.lineTo(0, 2); c.lineTo(20, -13); c.stroke(); c.fillStyle = '#ffb040'; c.beginPath(); c.moveTo(-20, -6); c.lineTo(-40 - Math.sin(t * 40) * 6, 0); c.lineTo(-20, 6); c.fill(); c.restore(); SK.tag(c, 'Sent half-written!', 180, y + 40, 18, '#fff6ea', 'rgba(190,40,40,0.9)'); }
    if (k === 'pay' || k === 'buy') { for (let i = 0; i < 8; i++) N6.coin(c, x - 20 + (i % 4) * 14, y - 20 + q * 120 + i * 9, 10); SK.tag(c, k === 'pay' ? '$500 gone!' : 'Bought a car!', x + 80, y - 20, 18, '#fff6ea', 'rgba(190,40,40,0.9)'); }
  }
  MG.add({
    id: 'ai_approve', stage: 'ai', cmd: 'PULL RISKY JOBS INTO THE TRAY!', time: 7, mood: 'night', winText: 'Nothing bad by surprise!', failText: 'Oops, can\'t undo that!', hold: 1.7,
    card: { title: 'Ask first before big moves', kind: 'AI', ref: 'Human approval for AI agents',
      text: 'An AI agent is a model that can take actions for you: read your calendar, write emails, move files, spend money.\n\nMost actions are harmless, or easy to undo. Some can\'t be undone: sending a message, deleting files, paying. A good agent stops before those and asks a person first.\n\nIf it asks about everything, people get tired of saying yes and stop reading. So the skill is to pick out the few actions that really matter.',
      note: 'An AI agent should ask a person before actions that can\'t be undone, like sending, deleting or paying.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.sp = SPEED[L];
      s.cards = STREAMS[s.v][L].map((k, i) => ({ k, x: 300 + i * (CW + GAP), y: BELT, state: 'belt' }));
      s.tray = []; s.drag = null; s.doneN = 0; s.workT = -9; s.boom = null; s.ask = 0;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return;
      const cd = s.cards.find(q => q.state === 'belt' && Math.abs(x - q.x) < CW / 2 + 6 && Math.abs(y - q.y) < CH / 2 + 14 && q.x < 352);
      if (cd) { cd.state = 'held'; s.drag = cd; SK.dragStart(g, cd, x, y); g.sfx('pop'); }
    },
    move(g, x, y) { if (g.s.drag) SK.dragMove(g, x, y); },
    up(g, x, y) {
      const s = g.s, cd = s.drag; if (!cd) return; SK.dragEnd(g); s.drag = null;
      if (cd.y < TRAY.y + TRAY.h / 2 + 40 && s.tray.length < 3) { cd.state = 'tray'; cd.slot = s.tray.length; s.tray.push(cd); g.sfx('click'); if (!CARDS[cd.k][2]) { s.ask = g.t; g.sfx('boing', { vol: 0.5 }); } }
      else { cd.state = 'belt'; cd.y = BELT; g.sfx('tap'); }
    },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      const riskyLeft = s.cards.some(q => (q.state === 'belt' || q.state === 'held') && CARDS[q.k][2]), sp = riskyLeft ? s.sp : 320; // once every risky card is caught the rest whiz through
      // the belt carries the cards along; a held card leaves a gap
      for (const q of s.cards) if (q.state === 'belt') {
        const ahead = s.cards.filter(o => o !== q && o.state === 'belt' && o.x < q.x).reduce((m, o) => Math.max(m, o.x), -999);
        q.x = Math.max(q.x - sp * dt, ahead > -999 ? ahead + CW + GAP : -999);
        if (q.x <= END) { q.state = 'done'; s.doneN++; s.workT = g.t; if (CARDS[q.k][2]) { s.boom = { k: q.k, t: g.t }; g.sfx(q.k === 'del' ? 'crunch' : q.k === 'send' ? 'whoosh' : 'coin'); g.sfx('fail'); g.shake(4, 0.3); g.fail(); return; } g.sfx('ding', { vol: 0.5 }); }
      }
      for (const q of s.tray) { q.x = SK.lerp(q.x, slotX(q.slot), 0.25); q.y = SK.lerp(q.y, TRAY.y + 6, 0.25); }
      if (s.cards.every(q => q.state === 'done' || q.state === 'tray')) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('n6approve_bg', paint), 0, 0, 360, 640);
      // the tray
      c.save(); c.fillStyle = 'rgba(255,212,90,0.14)'; c.strokeStyle = '#ffd45a'; c.lineWidth = 3; c.setLineDash([10, 6]); c.beginPath(); c.roundRect(TRAY.x - TRAY.w / 2 - 12, TRAY.y - TRAY.h / 2, TRAY.w + 24, TRAY.h, 16); c.fill(); c.stroke(); c.restore();
      for (let i = s.tray.length; i < 3; i++) { c.save(); c.strokeStyle = 'rgba(255,246,234,0.3)'; c.lineWidth = 2; c.beginPath(); c.roundRect(slotX(i) - 44, TRAY.y + 6 - 26, 88, 52, 8); c.stroke(); c.restore(); }
      SK.tag(c, 'Ask me first', TRAY.x, TRAY.y - TRAY.h / 2 - 2, 18, '#3a1640', 'rgba(255,212,90,0.95)');
      for (const q of s.tray) { c.save(); c.translate(q.x, q.y); c.scale(0.72, 0.72); card(c, q.k, 0, 0, { wait: true }); c.restore(); }
      // the robot at the end of the belt
      robot(c, 54, BELT - 4, t, t - s.workT < 0.4);
      SK.tag(c, 'AI agent', 54, BELT - 86, 18);
      // the cards on the belt
      for (const q of s.cards) if (q.state === 'belt' && q.x < 420) card(c, q.k, q.x, q.y, { rot: 0 });
      if (s.drag) card(c, s.drag.k, s.drag.x, s.drag.y, { rot: -0.06 });
      // what got done: a tick for harmless jobs, the disaster for one that can't be undone
      if (t - s.workT < 0.5 && !s.boom) N6.text(c, '✓', 92, BELT - 70 - (t - s.workT) * 30, 24, '#8affb0');
      if (s.boom) effect(c, s.boom.k, s.boom.t, t);
      if (t - s.ask < 1.0) SK.tag(c, '"Can I really do that?"', 196, TRAY.y + 66, 18, '#3a1640', 'rgba(255,246,234,0.92)');
      // you: the owl, aghast if something bad happened
      SK.animal(c, 'owl', 300, 600, 1.1, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'think', facing: -1 });
      SK.tag(c, s.cards.filter(q => q.state === 'done' || q.state === 'tray').length + ' / ' + s.cards.length + ' jobs', 90, 520, 18);
      // guidance: drag the next card that can't be undone up into the tray
      const nx = s.cards.filter(q => q.state === 'belt' && CARDS[q.k][2] && q.x < 340).sort((a, b) => a.x - b.x)[0];
      if (nx && !g.done && !s.drag) { SK.grab(c, g, nx.x, nx.y, 34); SK.target(c, g, slotX(s.tray.length), TRAY.y + 6, 0, { w: 96, h: 60 }); SK.arrow(c, g, nx.x, nx.y - 20, slotX(s.tray.length), TRAY.y + 30, { from: 24, to: 30 }); }
      SK.demo(g, c, 'drag', nx ? [nx.x, nx.y] : [0, 0], [slotX(Math.min(2, s.tray.length)), TRAY.y + 6], { never: !nx || !!s.drag });
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done) return; const B = s._a = s._a || { k: 0, n: 1.0 };
      if (B.p) { if (SK.bot.drag(g, synth, 'c' + B.k, B.t, B.p[0], B.p[1], 0.3)) { B.k++; B.p = null; B.n = g.t + 0.1; } return; }
      if (g.t < B.n) return; const nx = s.cards.filter(q => q.state === 'belt' && CARDS[q.k][2] && q.x < 330).sort((a, b) => a.x - b.x)[0];
      if (nx) { B.p = [[nx.x, nx.y], [slotX(s.tray.length), TRAY.y]]; B.t = g.t; }
    },
  });
})();
