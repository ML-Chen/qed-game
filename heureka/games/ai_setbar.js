// SET THE SPAM BAR! (cs AI-10) — a classifier's threshold. The spam filter gives every email a spam score, and here
// the score is how high the email rides as it glides in from the left: junk ("WIN $$$", "Prize!") rides high, real mail
// (Grandma, Coach) rides low, and a few sit near the middle. A bar across the screen is the threshold: at the gate,
// everything above it drops into the Spam bin and everything below goes to the Inbox. Drag the bar's handle to set it.
// Too low and Grandma's letter lands in spam (she is sad, and the game is lost); too high and junk floods the inbox.
// One sneaky junk email always scores like real mail: catching it would cost real mail, so the inbox may keep one.
// Two batches of mail, each with its gap at a different height, so the bar must move once more.
// Level 1: the gap between junk and real mail is narrower; level 2: narrower still, and more mail.
(() => {
  const AX = { x0: 16, x1: 258, y0: 170, y1: 520 }, GATE = 246, SPAM = { x: 326, y: 196 }, INBOX = { x: 326, y: 488 }, HX = 280;
  const REAL = ['Grandma', 'Coach', 'Mom', 'Friend', 'Doctor', 'School'], JUNK = ['WIN $$$', 'Prize!', 'Pills', 'Crypto!', 'Click me', 'Free!!'];
  const LV = [{ mix: ['junk', 'junk', 'real'], gap: 0.2, sp: 96, every: 0.6 }, { mix: ['junk', 'junk', 'real'], gap: 0.14, sp: 104, every: 0.56 }, { mix: ['junk', 'junk', 'junk', 'real'], gap: 0.1, sp: 116, every: 0.5 }];
  const sy = sc => SK.lerp(AX.y1 - 16, AX.y0 + 16, sc); // score (0 = surely real, 1 = surely junk) to height
  function paint(o) {
    N6.vgrad(o, 0, 0, 360, 640, ['#2a2860', '#4a3a7a', '#6a4a8a']);
    // the score wall: hotter colours higher up
    const gr = o.createLinearGradient(0, AX.y0, 0, AX.y1); gr.addColorStop(0, 'rgba(232,80,60,0.28)'); gr.addColorStop(0.5, 'rgba(240,200,90,0.14)'); gr.addColorStop(1, 'rgba(90,200,130,0.24)');
    o.fillStyle = gr; o.beginPath(); o.roundRect(AX.x0, AX.y0, AX.x1 - AX.x0, AX.y1 - AX.y0, 14); o.fill();
    o.strokeStyle = 'rgba(255,255,255,0.12)'; o.lineWidth = 1; for (let y = AX.y0 + 35; y < AX.y1; y += 35) { o.beginPath(); o.moveTo(AX.x0 + 6, y); o.lineTo(AX.x1 - 6, y); o.stroke(); }
    o.strokeStyle = 'rgba(255,246,234,0.5)'; o.lineWidth = 3; o.setLineDash([6, 6]); o.beginPath(); o.moveTo(GATE, AX.y0); o.lineTo(GATE, AX.y1); o.stroke(); o.setLineDash([]);
    N6.vgrad(o, 0, 540, 360, 100, ['#3a3050', '#241c34']);
  }
  function bin(c, x, y, spam, n, t) { c.save(); c.translate(x, y); c.scale(0.78, 0.78);
    c.fillStyle = spam ? '#6a5a6a' : '#5a8ad8'; c.strokeStyle = '#1a1430'; c.lineWidth = 3; c.beginPath(); c.moveTo(-36, -30); c.lineTo(36, -30); c.lineTo(28, 34); c.lineTo(-28, 34); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = spam ? '#4a3a4a' : '#3a6ab8'; c.beginPath(); c.roundRect(-40, -38, 80, 10, 4); c.fill(); c.stroke();
    if (spam) { c.strokeStyle = 'rgba(160,220,100,0.7)'; c.lineWidth = 2.5; for (let i = 0; i < 3; i++) { const q = (t * 0.8 + i / 3) % 1; c.beginPath(); c.moveTo(-14 + i * 14, -42 - q * 26); c.quadraticCurveTo(-6 + i * 14, -50 - q * 26, -14 + i * 14, -58 - q * 26); c.stroke(); } }
    c.restore(); }
  function mail(c, m, x, y, t) { c.save(); c.translate(x, y); const w = 92, h = 38;
    c.fillStyle = 'rgba(10,6,20,0.35)'; c.beginPath(); c.roundRect(-w / 2 + 2, -h / 2 + 4, w, h, 8); c.fill();
    c.fillStyle = m.junk ? '#ffe0d0' : '#fff6ea'; c.strokeStyle = m.junk ? '#a83a2a' : '#3a1640'; c.lineWidth = 2; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 8); c.fill(); c.stroke();
    c.font = '900 17px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = m.junk ? '#a8201a' : '#2a1430'; c.fillText(m.name, 0, 1);
    if (!m.junk && m.name === 'Grandma') { c.fillStyle = '#e84a6a'; c.beginPath(); c.arc(w / 2 - 8, -h / 2 + 2, 6, 0, 7); c.fill(); }
    c.restore(); }
  MG.add({
    id: 'ai_setbar', stage: 'ai', cmd: 'SET THE SPAM BAR!', time: 6, mood: 'night', winText: 'Clean inbox, Grandma safe!', failText: 'Wrong side of the bar!', hold: 1.7,
    card: { title: 'Where to draw the line', kind: 'AI', ref: 'Classifier threshold',
      text: 'A spam filter is a classifier: a model that gives each email a score for how likely it is to be spam. On its own the score decides nothing. You pick a threshold, and everything scoring above it goes to the spam folder.\n\nSet it low and you catch every bit of spam, but real mail gets caught too. Set it high and real mail is safe, but spam floods in. Some spam always looks like real mail, so no setting is perfect.\n\nWhere you put the line depends on which mistake is worse.',
      note: 'A classifier\'s threshold trades catching more spam against wrongly flagging real mail.' },
    init(g) {
      const s = g.s, L = LV[Math.min(2, g.level)]; s.L = L; s.v = SK.variant(g, 4);
      // two batches of mail, each with its own gap between real mail and junk (a different kind of mail each time)
      const mids = [[0.5, 0.3], [0.42, 0.66], [0.62, 0.38], [0.36, 0.6]][s.v]; s.mails = []; let x = -60;
      const rn = SK.shuffled(g, REAL), jn = SK.shuffled(g, JUNK); let ri = 0, ji = 0;
      mids.forEach((mid, w) => { const lo = mid - L.gap / 2, hi = mid + L.gap / 2;
        const order = ['real', 'real', ...SK.shuffled(g, L.mix)]; const sneak = w === 0 ? order.lastIndexOf('real') : -1;
        order.forEach((k, i) => { const junk = k === 'junk' || i === sneak; let sc;
          if (i === sneak) sc = SK.lerp(0.06, Math.max(0.08, lo - 0.12), g.rand()); else if (junk) sc = SK.lerp(hi + 0.03, Math.min(0.97, hi + 0.35), g.rand()); else sc = SK.lerp(Math.max(0.03, lo - 0.35), lo - 0.03, g.rand());
          const m = { junk, name: junk ? jn[ji++ % 6] : rn[ri++ % 6], sc, mid, w, x, state: 'go' }; if (!junk && m.name === 'Grandma') m.sc = lo - 0.03; m.y = sy(m.sc); s.mails.push(m); x -= L.sp * L.every; });
        x -= L.sp * 2.6; });
      if (!s.mails.some(m => m.name === 'Grandma')) { const m = s.mails.find((m, i) => !m.junk && i > 1); if (m) { m.name = 'Grandma'; m.sc = m.mid - L.gap / 2 - 0.03; m.y = sy(m.sc); } }
      s.mid = mids[0];
      s.bar = 0.9; s.drag = false; s.spamN = 0; s.inJunk = 0; s.lostReal = null; s.flood = 0; s.allowed = 1;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; const by = sy(s.bar); if (Math.abs(y - by) < 50 && x > 150) { s.drag = true; s.dy = by - y; g.sfx('click'); } },
    move(g, x, y) { const s = g.s; if (!s.drag) return; s.bar = SK.clamp((AX.y1 - 16 - (y + s.dy)) / (AX.y1 - AX.y0 - 32), 0, 1); },
    up(g) { g.s.drag = false; },
    update(g, dt) {
      const s = g.s; if (g.done) return; const nx = s.mails.find(m => m.state === 'go'); if (nx) s.mid = nx.mid;
      for (const m of s.mails) {
        if (m.state === 'go') { m.x += s.L.sp * dt; if (m.x >= GATE) { m.state = m.sc > s.bar ? 'spam' : 'inbox'; m.t = g.t; m.x0 = m.x; m.y0 = m.y; g.sfx(m.state === 'spam' ? 'whoosh' : 'pop', { vol: 0.5 }); } }
        else if (!m.done && g.t - m.t > 0.35) { m.done = true;
          if (m.state === 'spam') { if (m.junk) s.spamN++; else { s.lostReal = m; g.sfx('wrong'); g.sfx('fail'); g.fail(); return; } }
          else if (m.junk) { s.inJunk++; g.sfx('boing', { vol: 0.5 }); if (s.inJunk > s.allowed) { s.flood = g.t; g.sfx('laugh'); g.fail(); return; } }
          else g.sfx('ding', { vol: 0.4 });
        }
      }
      if (s.mails.every(m => m.done)) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', by = sy(s.bar);
      c.drawImage(g.bake('n6setbar_bg', paint), 0, 0, 360, 640);
      SK.tag(c, 'Spam score', 74, AX.y0 - 18, 18); N6.text(c, 'High', 40, AX.y0 + 20, 16, '#ffb0a0'); N6.text(c, 'Low', 36, AX.y1 - 18, 16, '#a0f0c0');
      bin(c, SPAM.x, SPAM.y, true, s.spamN, t); bin(c, INBOX.x, INBOX.y, false, 0, t);
      SK.tag(c, 'Spam', SPAM.x - 4, SPAM.y + 44, 18, '#fff6ea', 'rgba(120,50,60,0.9)'); SK.tag(c, 'Inbox', INBOX.x - 4, INBOX.y + 44, 18, '#fff6ea', 'rgba(40,80,160,0.9)');
      // the threshold bar and its handle
      c.save(); c.strokeStyle = '#ffd45a'; c.lineWidth = 5; c.beginPath(); c.moveTo(AX.x0, by); c.lineTo(HX - 22, by); c.stroke();
      c.fillStyle = s.drag ? '#fff2a0' : '#ffd45a'; c.strokeStyle = '#3a1640'; c.lineWidth = 3; c.beginPath(); c.roundRect(HX - 24, by - 20, 48, 40, 12); c.fill(); c.stroke();
      c.fillStyle = '#3a1640'; for (const d of [-8, 0, 8]) c.fillRect(HX - 12, by + d - 1.5, 24, 3); c.restore();
      SK.tag(c, 'Threshold', 120, by - 22, 18, '#3a1640', 'rgba(255,212,90,0.92)');
      // the mail: gliding in at the height of its score, then dropping into a bin
      for (const m of s.mails) { if (m.done && !(m === s.lostReal)) continue; let x = m.x, y = m.y;
        if (m.state !== 'go') { const q = SK.clamp((t - m.t) / 0.35, 0, 1), tg = m.state === 'spam' ? SPAM : INBOX; x = SK.lerp(m.x0, tg.x, q); y = SK.lerp(m.y0, tg.y - 20, q) - Math.sin(q * Math.PI) * 30; if (m === s.lostReal) { x = tg.x; y = tg.y - 44; } }
        if (x > -50) mail(c, m, x, y, t); }
      // counts: junk caught, junk in the inbox
      const junkTotal = s.mails.filter(m => m.junk).length, wv = (s.mails.find(m => m.state === 'go') || s.mails[s.mails.length - 1]).w;
      SK.tag(c, 'Batch ' + (wv + 1) + ' / 2', 80, 132, 18);
      SK.tag(c, 'Caught ' + s.spamN + ' / ' + junkTotal, 290, 132, 18);
      if (s.inJunk) SK.tag(c, 'Junk in inbox: ' + s.inJunk, 238, 568, 18, '#fff6ea', s.inJunk > s.allowed ? 'rgba(190,40,40,0.9)' : 'rgba(30,14,36,0.75)');
      // Grandma, who mailed the letter
      const gm = s.lostReal && s.lostReal.name === 'Grandma';
      SK.animal(c, 'rabbit', 60, 610, 0.85, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'happy', tint: '#e8e0f0' });
      SK.tag(c, 'Grandma', 60, 548, 18); if (s.lostReal) SK.tag(c, gm ? 'My letter!' : 'Real mail lost!', 150, 590, 18, '#fff6ea', 'rgba(190,40,40,0.9)');
      if (s.flood) SK.tag(c, 'Inbox flooded!', INBOX.x - 30, INBOX.y - 70, 20, '#fff6ea', 'rgba(190,40,40,0.9)');
      // guidance: drag the handle into the gap between real mail and junk
      const ty = sy(s.mid), off = Math.abs(ty - by) > 14;
      if (!g.done && !s.drag) { SK.grab(c, g, HX, by, 28); if (off) { SK.target(c, g, HX, ty, 24); SK.arrow(c, g, HX, by, HX, ty, { from: 26, to: 30 }); } }
      SK.demo(g, c, 'drag', [HX, by], [HX, ty], { never: !off || s.drag });
    },
    auto(g, dt, synth) { const s = g.s; if (g.done) return; const by = sy(s.bar), ty = sy(s.mid); const B = s._a = s._a || {}; if (B.p) { if (SK.bot.drag(g, synth, 'bar' + B.k, B.t, B.p[0], B.p[1], 0.4)) B.p = null; return; } if (Math.abs(by - ty) > 6 && g.t > 1.0) { B.k = (B.k || 0) + 1; B.p = [[HX, by], [HX, ty]]; B.t = g.t; } },
  });
})();
