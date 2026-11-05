// WATCH WHERE USERS GET STUCK! (business SV-00c, talking to users) — the fox's new ticket machine in a station hall.
// Users come up one at a time and work down the machine: read the screen, press Buy, put a coin in, take the ticket.
// Each user gets stuck somewhere different, trying the same spot again and again (tap rings, sweat). Drag the
// magnifying glass over the spot where they are stuck and hold it there: the lens shows the problem up close (tiny
// words, a button too high, a slot that spits coins, a ticket that drops out of the back), a note flies to the fox and
// the fox fixes exactly that part. The user then gets a ticket, and the fix helps everyone after them. The "Like it?"
// clipboard asks instead of watching: every user smiles and says "Yes!", and nothing gets fixed.
// Level 0 and 1: three users (the lens needs longer at level 1). Level 2: the stuck user moves around, so follow them.
(() => {
  const GY = 528, UX = 76, FOX = { x: 312, y: GY }, LHOME = { x: 296, y: 566 }, LR = 40;
  const STEPS = ['screen', 'button', 'coin', 'tray'];
  const SPOT = { screen: [186, 282], button: [186, 352], coin: [214, 414], tray: [186, 486] };
  const ORDERS = [['button', 'coin', 'tray'], ['screen', 'tray', 'button'], ['coin', 'screen', 'tray'], ['tray', 'button', 'screen'], ['screen', 'coin', 'button']];
  const WHO = [['rabbit', 'duck', 'hedgehog'], ['penguin', 'frog', 'bird'], ['duck', 'hedgehog', 'rabbit'], ['frog', 'rabbit', 'penguin'], ['bird', 'penguin', 'frog']];
  function paintHall(o) {
    const w = o.createLinearGradient(0, 0, 0, GY); w.addColorStop(0, '#2a6a78'); w.addColorStop(0.5, '#4a9a9a'); w.addColorStop(1, '#a8d8c8'); o.fillStyle = w; o.fillRect(0, 0, 360, 640);
    // tall arched windows with a train outside
    for (const ax of [30, 210]) {
      o.fillStyle = '#ffd8a8'; o.beginPath(); o.moveTo(ax, 330); o.lineTo(ax, 190); o.arc(ax + 60, 190, 60, Math.PI, 0); o.lineTo(ax + 120, 330); o.closePath(); o.fill();
      const sk = o.createLinearGradient(0, 130, 0, 330); sk.addColorStop(0, '#ff9ac0'); sk.addColorStop(1, '#fff2d0'); o.fillStyle = sk; o.beginPath(); o.moveTo(ax + 8, 324); o.lineTo(ax + 8, 190); o.arc(ax + 60, 190, 52, Math.PI, 0); o.lineTo(ax + 112, 324); o.closePath(); o.fill();
      o.fillStyle = '#e8503a'; o.beginPath(); o.roundRect(ax + 8, 268, 104, 40, 8); o.fill(); o.fillStyle = '#fff6ea'; for (let i = 0; i < 4; i++) o.fillRect(ax + 16 + i * 24, 276, 16, 14); o.fillStyle = '#3a2a3a'; o.fillRect(ax + 8, 308, 104, 6);
      o.strokeStyle = '#2a5a60'; o.lineWidth = 4; o.beginPath(); o.moveTo(ax + 60, 130); o.lineTo(ax + 60, 324); o.moveTo(ax + 8, 230); o.lineTo(ax + 112, 230); o.stroke();
    }
    // the floor: warm tiles
    const f = o.createLinearGradient(0, GY - 40, 0, 640); f.addColorStop(0, '#e8c898'); f.addColorStop(1, '#c89868'); o.fillStyle = f; o.fillRect(0, GY - 10, 360, 160);
    o.strokeStyle = 'rgba(120,80,40,0.25)'; o.lineWidth = 2; for (let x = -40; x < 400; x += 44) { o.beginPath(); o.moveTo(x, GY - 10); o.lineTo(x - 30, 640); o.stroke(); } for (const y of [560, 600]) { o.beginPath(); o.moveTo(0, y); o.lineTo(360, y); o.stroke(); }
    o.fillStyle = '#2a5a60'; o.fillRect(0, GY - 14, 360, 6);
  }
  // the ticket machine; fixed: the parts the fox has fixed; L: the step a user is pressing now (for a press glint)
  function machine(c, s, t) {
    const f = s.fixed;
    c.fillStyle = 'rgba(30,14,36,0.25)'; c.beginPath(); c.ellipse(186, GY, 82, 9, 0, 0, 7); c.fill();
    const mg = c.createLinearGradient(118, 0, 254, 0); mg.addColorStop(0, '#f0a040'); mg.addColorStop(0.5, '#ffc860'); mg.addColorStop(1, '#d88028'); c.fillStyle = mg; c.strokeStyle = '#7a3a10'; c.lineWidth = 3; c.beginPath(); c.roundRect(120, 232, 132, GY - 230, 14); c.fill(); c.stroke();
    c.fillStyle = '#7a3a10'; c.beginPath(); c.roundRect(112, 222, 148, 18, 8); c.fill();
    // screen: tiny grey words, or after the fix a big bright train and arrow
    c.fillStyle = '#1e2a3a'; c.beginPath(); c.roundRect(140, 254, 92, 56, 6); c.fill();
    if (f.screen) { c.fillStyle = '#5ad07a'; c.beginPath(); c.roundRect(146, 260, 80, 44, 4); c.fill(); c.fillStyle = '#fff6ea'; c.beginPath(); c.roundRect(158, 268, 40, 22, 5); c.fill(); c.fillStyle = '#e8503a'; c.fillRect(160, 272, 36, 6); c.fillStyle = '#3a2a3a'; c.beginPath(); c.arc(166, 292, 3.5, 0, 7); c.arc(190, 292, 3.5, 0, 7); c.fill(); c.fillStyle = '#fff6ea'; c.beginPath(); c.moveTo(206, 270); c.lineTo(220, 282); c.lineTo(206, 294); c.closePath(); c.fill(); }
    else { c.fillStyle = '#6a7a8a'; for (let r = 0; r < 6; r++) for (let i = 0; i < 9; i++) if ((r * 7 + i * 3) % 5) c.fillRect(146 + i * 9, 262 + r * 7, 6, 2); }
    // the Buy button: a tiny dot up high, or a big green button within reach
    if (f.button) { SK.ball(c, 186, 352, 17, '#4ac060'); c.fillStyle = '#fff6ea'; c.beginPath(); c.moveTo(180, 344); c.lineTo(194, 352); c.lineTo(180, 360); c.closePath(); c.fill(); }
    else { c.fillStyle = '#5a2a10'; c.beginPath(); c.arc(186, 334, 6, 0, 7); c.fill(); c.fillStyle = '#c84030'; c.beginPath(); c.arc(186, 333, 4, 0, 7); c.fill(); c.fillStyle = '#c07020'; c.beginPath(); c.roundRect(170, 344, 32, 16, 4); c.fill(); }
    // the coin slot: a thin bent slit, or a wide funnel
    if (f.coin) { c.fillStyle = '#5a5a68'; c.beginPath(); c.moveTo(194, 398); c.lineTo(234, 398); c.lineTo(222, 424); c.lineTo(206, 424); c.closePath(); c.fill(); c.fillStyle = '#1e1e28'; c.fillRect(206, 420, 16, 5); SK.ball(c, 214, 404 + ((t * 30) % 12), 6, '#f0c040'); }
    else { c.fillStyle = '#5a5a68'; c.beginPath(); c.roundRect(206, 404, 16, 22, 4); c.fill(); c.strokeStyle = '#1e1e28'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(214, 407); c.lineTo(212, 414); c.lineTo(216, 418); c.lineTo(214, 423); c.stroke(); }
    // the ticket tray: flush and empty (tickets drop out of the back), or a big tray at the front
    if (f.tray) { c.fillStyle = '#3a2a2a'; c.beginPath(); c.roundRect(150, 466, 72, 34, 8); c.fill(); c.fillStyle = '#e0e0e8'; c.beginPath(); c.moveTo(150, 490); c.lineTo(222, 490); c.lineTo(230, 506); c.lineTo(142, 506); c.closePath(); c.fill(); }
    else { c.fillStyle = '#3a2a2a'; c.fillRect(168, 479, 36, 7); }
  }
  // the little things a stuck user does at their spot (seen better through the lens)
  function trouble(c, s, t, p) {
    const [x, y] = s.spotNow;
    if (p === 'coin') for (let i = 0; i < 3; i++) { const q = (t * 1.3 + i / 3) % 1; SK.ball(c, x - 14 - q * 50, y - 6 + q * q * (GY - y - 4) * 0.9, 5, '#f0c040', { lw: 1 }); }
    if (p === 'tray') { const w = Math.sin(t * 14) * 1.5; c.save(); c.translate(186 + w, 480); c.fillStyle = '#fff6ea'; c.strokeStyle = '#7a3a10'; c.lineWidth = 1.5; c.fillRect(-12, -9, 24, 9); c.strokeRect(-12, -9, 24, 9); c.fillStyle = '#e8503a'; c.fillRect(-8, -6, 16, 2.5); c.restore(); c.fillStyle = '#3a2a2a'; c.fillRect(168, 479, 36, 7); }
    // tap rings where they keep trying
    const q = (t * 2.2) % 1; c.strokeStyle = `rgba(232,64,58,${1 - q})`; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 6 + q * 18, 0, 7); c.stroke();
  }
  function lens(c, x, y, k, hot) {
    c.save(); c.strokeStyle = '#5a3a1a'; c.lineWidth = 11; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + LR * 0.7, y + LR * 0.7); c.lineTo(x + LR * 1.45, y + LR * 1.45); c.stroke();
    c.strokeStyle = '#3a2a3a'; c.lineWidth = 7; c.beginPath(); c.arc(x, y, LR + 2, 0, 7); c.stroke(); c.strokeStyle = hot ? '#5ad07a' : '#d8c8a0'; c.lineWidth = 4; c.beginPath(); c.arc(x, y, LR + 2, 0, 7); c.stroke();
    if (k > 0) { c.strokeStyle = '#5ad07a'; c.lineWidth = 7; c.beginPath(); c.arc(x, y, LR + 9, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,0.25)'; c.beginPath(); c.ellipse(x - 14, y - 16, 12, 6, -0.7, 0, 7); c.fill(); c.restore();
  }
  const FIND = [0.6, 0.85, 0.7], STEP = [0.26, 0.22, 0.16], WALK = [0.6, 0.5, 0.4], FIXT = [0.6, 0.5, 0.4];
  MG.add({
    id: 'watchusers', stage: 'startups', cmd: 'WATCH WHERE USERS GET STUCK!', time: 8, mood: 'party', winText: 'Everyone got a ticket!', failText: 'Still stuck!', hold: 1.6,
    card: { title: 'Watch your users', kind: 'Startups', ref: 'Talking to users',
      text: 'Ask people "Do you like it?" and most will smile and say yes, to be kind. That tells you nothing about what to fix.\n\nWatch them use it instead. Where do they stop? What do they try again and again? Each user here got stuck somewhere different: tiny words, a button too high, a slot that spat coins, a ticket that fell out the back.\n\nEach spot you saw became a fix, and the fix helped everyone after. Founders learn what to build by asking about real problems and watching real use.',
      note: 'Watching what users actually do shows you problems they would never mention.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 5); s.L = L; s.probs = ORDERS[s.v]; s.who = WHO[s.v]; s.fixed = {}; s.ui = 0; s.u = this.newUser(g, -40); s.lx = LHOME.x; s.ly = LHOME.y; s.find = 0; s.phase = 'go'; s.pt = 0; s.note = null; s.ask = -9; s.spotNow = [0, 0]; s.fixes = 0; s.zip = [];
      s.mv = L === 2 ? 34 : 0; s.mph = g.rand() * 6;
    },
    newUser(g, x) { return { x, step: -1, st: 'walk', t: g.t, done: false }; },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return;
      if (SK.dist(x, y, s.lx, s.ly) < LR + 14 || SK.dist(x, y, s.lx + LR, s.ly + LR) < 26) { s.drag = true; SK.dragStart(g, { x: s.lx, y: s.ly }, x, y); g.sfx('tap'); return; }
      if (Math.abs(x - FOX.x + 6) < 48 && Math.abs(y - 404) < 26) { s.ask = g.t; g.sfx('laugh', { vol: 0.5 }); }
    },
    move(g, x, y) { const s = g.s; if (!s.drag) return; const o = SK.dragMove(g, x, y); s.lx = SK.clamp(o.x, 40, 320); s.ly = SK.clamp(o.y, 200, 580); },
    up(g) { const s = g.s; if (!s.drag) return; s.drag = false; SK.dragEnd(g); },
    update(g, dt) {
      const s = g.s, u = s.u, L = s.L, prob = s.probs[s.ui];
      // where the stuck spot is right now (at level 2 the user keeps moving to try another way)
      const sp = SPOT[prob] || SPOT.tray; s.spotNow = [sp[0] + (s.mv ? s.mv * Math.sin(g.t * 1.5 + s.mph) : 0), sp[1]];
      for (const z of s.zip) z.x += 260 * dt; s.zip = s.zip.filter(z => z.x < 420);
      if (g.done) return;
      if (u.st === 'walk') { u.x = Math.min(UX, u.x + (UX + 40) / WALK[L] * dt); if (u.x >= UX) { u.st = 'try'; u.step = 0; u.t = g.t; } }
      else if (u.st === 'try') {
        const st = STEPS[u.step];
        if (st === prob && !s.fixed[st]) { u.st = 'stuck'; u.t = g.t; g.sfx('wrong', { vol: 0.5 }); }
        else if (g.t - u.t > STEP[L]) { g.sfx('ding', { vol: 0.35, pitch: 1 + u.step * 0.12 }); u.step++; u.t = g.t; if (u.step >= STEPS.length) { u.st = 'ticket'; u.t = g.t; g.sfx('coin'); } }
      } else if (u.st === 'stuck') {
        const on = SK.dist(s.lx, s.ly, s.spotNow[0], s.spotNow[1]) < 32;
        if (on) { s.find += dt / FIND[L]; if (Math.floor(s.find * 4) !== s.fb) { s.fb = Math.floor(s.find * 4); g.sfx('tap', { pitch: 1.4, vol: 0.3 }); } }
        if (s.find >= 1) { s.find = 0; u.st = 'note'; u.t = g.t; s.note = { k: prob, x: s.spotNow[0], y: s.spotNow[1], t: g.t }; g.sfx('sparkle'); }
      } else if (u.st === 'note' && g.t - u.t > 0.45) { u.st = 'fix'; u.t = g.t; s.note = null; g.sfx('click'); }
      else if (u.st === 'fix' && g.t - u.t > FIXT[L]) { s.fixed[prob] = true; s.fixes++; u.st = 'try'; u.t = g.t; g.sfx('magic'); g.burst(SPOT[prob][0], SPOT[prob][1], ['#ffe27a', '#5ad07a', '#fff6ea'], 16, 160); }
      else if (u.st === 'ticket' && g.t - u.t > 0.3) {
        if (s.ui >= s.probs.length - 1) { g.win(); g.sfx('cheer'); for (let i = 0; i < 4; i++) s.zip.push({ x: -40 - i * 50, k: ['ant', 'owl', 'turtle', 'beaver'][i] }); g.burst(186, 480, ['#ffe27a', '#fff6ea', '#ff8aa0'], 24, 200); return; }
        s.ui++; s.u = this.newUser(g, -50); g.sfx('pop');
      }
    },
    world(g, c) {
      const s = g.s, t = g.t, u = s.u, prob = s.probs[s.ui], won = g.result === 'win', lost = g.result === 'fail';
      machine(c, s, t);
      if (u.st === 'stuck' || u.st === 'note') trouble(c, s, t, prob);
      const kind = s.who[s.ui % s.who.length], stuck = u.st === 'stuck' || u.st === 'note' || u.st === 'fix';
      const asked = t - s.ask < 1.6, hopY = stuck && prob === 'button' && !s.fixed.button ? -Math.abs(Math.sin(t * 6)) * 22 : 0;
      SK.animal(c, kind, u.x, GY + hopY, 1.0, { t, phase: 1, pose: won || u.st === 'ticket' ? 'cheer' : u.st === 'walk' ? 'walk' : asked ? 'wave' : 'point', expr: won || u.st === 'ticket' || asked ? 'laugh' : stuck ? (prob === 'screen' ? 'think' : 'wow') : 'happy',
        hold: u.st === 'ticket' || won ? (h => { h.fillStyle = '#fff6ea'; h.strokeStyle = '#7a3a10'; h.lineWidth = 1.5; h.fillRect(-12, -16, 24, 14); h.strokeRect(-12, -16, 24, 14); h.fillStyle = '#e8503a'; h.fillRect(-8, -12, 16, 3); }) : null });
      if (stuck && !asked && !won) { const q = (t * 1.4) % 1; c.fillStyle = `rgba(140,210,255,${1 - q})`; c.beginPath(); c.ellipse(u.x + 18, GY - 66 + q * 14, 3, 5, 0, 0, 7); c.fill(); }
      if (asked) { c.save(); c.fillStyle = '#fff'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(u.x - 30, GY - 132, 60, 34, 14); c.fill(); c.stroke(); c.font = '900 20px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#3a1640'; c.fillText('Yes!', u.x, GY - 114); c.restore(); }
      if (lost) for (let i = 0; i < 3; i++) SK.animal(c, ['ant', 'owl', 'turtle'][i], 24 - i * 30 + 40, GY + 40, 0.6, { t, phase: i, pose: 'sad', expr: 'sad' });
    },
    draw(g, c) {
      const s = g.s, t = g.t, u = s.u, won = g.result === 'win', lost = g.result === 'fail', L = s.L;
      c.drawImage(g.bake('n7hall', paintHall), 0, 0, 360, 640);
      this.world(g, c);
      for (const z of s.zip) SK.animal(c, z.k, z.x, GY + 46, 0.7, { t, phase: z.x, pose: 'hop', expr: 'laugh' });
      // the fox, who fixes what you saw, with its "Like it?" clipboard
      const fixing = u.st === 'fix';
      const fx = fixing ? 268 : FOX.x;
      SK.animal(c, 'fox', fx, FOX.y, 1.0, { t, facing: -1, pose: won ? 'cheer' : fixing ? 'carry' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : fixing ? 'think' : 'happy',
        hold: fixing ? (h => { h.save(); h.rotate(Math.sin(t * 22) * 0.6); h.fillStyle = '#8a4a2a'; h.fillRect(-2, -18, 5, 20); h.fillStyle = '#5a5a68'; h.fillRect(-8, -22, 17, 8); h.restore(); }) : null });
      if (!g.done) { c.fillStyle = '#c89048'; c.strokeStyle = '#6a4020'; c.lineWidth = 2; c.beginPath(); c.roundRect(FOX.x - 52, 382, 92, 44, 6); c.fill(); c.stroke(); c.fillStyle = '#fff6ea'; c.fillRect(FOX.x - 47, 388, 82, 32); c.fillStyle = '#8a8a9a'; c.fillRect(FOX.x - 16, 378, 20, 8); c.save(); c.font = '900 18px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#3a1640'; c.fillText('Like it?', FOX.x - 6, 405); c.restore(); }
      // the note of what you saw, flying to the fox
      if (s.note) { const n = s.note, m = SK.easeInOut(Math.min(1, (t - n.t) / 0.45)); const nx = SK.lerp(n.x, fx - 20, m), ny = SK.lerp(n.y, GY - 110, m) - Math.sin(m * Math.PI) * 50; c.save(); c.translate(nx, ny); c.rotate(-0.1); c.fillStyle = '#fff27a'; c.strokeStyle = '#a08a20'; c.lineWidth = 2; c.fillRect(-16, -14, 32, 28); c.strokeRect(-16, -14, 32, 28); c.strokeStyle = '#e8403a'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 8, 0, 7); c.stroke(); c.restore(); }
      // the magnifying glass: a zoomed view of what is under it
      const tgt = s.spotNow, stuck = u.st === 'stuck', hot = stuck && SK.dist(s.lx, s.ly, tgt[0], tgt[1]) < 32;
      c.save(); c.beginPath(); c.arc(s.lx, s.ly, LR, 0, 7); c.clip(); c.fillStyle = '#e8f4f0'; c.fill();
      c.translate(s.lx, s.ly); c.scale(2, 2); c.translate(-s.lx, -s.ly); c.drawImage(g.bake('n7hall', paintHall), 0, 0, 360, 640); this.world(g, c); c.restore();
      lens(c, s.lx, s.ly, stuck ? s.find : 0, hot);
      if (!g.done) SK.tag(c, 'Stuck spots fixed ' + s.fixes + ' / ' + s.probs.length, 180, 178, 18);
      SK.tag(c, 'Ticket machine', 186, 452, 18);
      if (u.st === 'stuck' && !g.done) SK.tag(c, 'User', u.x, GY + 34, 18);
      // guidance: drag the lens onto the spot where the user is stuck, and hold it there
      if (stuck && !g.done && !s.drag && !hot) {
        SK.grab(c, g, s.lx, s.ly, LR + 6); SK.target(c, g, tgt[0], tgt[1], 28); SK.arrow(c, g, s.lx, s.ly, tgt[0], tgt[1], { from: LR + 10, to: 44 });
        SK.demo(g, c, 'drag', [s.lx, s.ly], [tgt[0], tgt[1]], { delay: 0.6 });
      }
    },
    auto(g, dt, synth) {
      const s = g.s, B = s._n7 = s._n7 || {}; if (g.done || s.u.st !== 'stuck') return;
      if (B.ui !== s.ui) { B.ui = s.ui; B.at = g.t + 0.2; B.a = [s.lx, s.ly]; }
      if (s.mv) { // follow the moving spot: keep the lens held on it
        if (!B.down && g.t >= B.at) { B.down = 1; synth('down', s.lx, s.ly); B.off = [0, 0]; return; }
        if (B.down) { synth('move', s.spotNow[0], s.spotNow[1]); if (s.u.st !== 'stuck') { synth('up', s.lx, s.ly); B.down = 0; } }
        return;
      }
      SK.bot.drag(g, synth, 'lens' + s.ui, B.at, B.a, s.spotNow.slice(), 0.4);
    },
  });
})();
