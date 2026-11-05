// SHIP IT EARLY! (business SV-00b, minimum viable product) — the beaver's workshop on the left, a street with users
// waiting on the right. In the workshop sits v1 of a go-kart: a crate on wheels, missing things the users need. Drag the
// kart out of the door to the user who is waiting: they hop in and try it, and the problem happens for real (square
// wheels clunk, splinters poke, it can't steer and bonks a cone, the shopping falls out, the rain soaks them). They
// point, a bubble shows the fix, the kart rolls back in and the beaver builds exactly that. Ship the fixed version
// again until a user loves it and rides off. Leave the kart in the workshop and the beaver only polishes it (gold
// paint, sparkles): when time runs out the shiny kart rolls out still clunking, and the users walk away.
// Level 0: two fixes (three try-outs). Level 1: the users stand farther apart. Level 2: three fixes, users walk about.
(() => {
  const GY = 500, HOME = 86, DOOR = 150, KR = 12;
  const FIX = ['wheel', 'seat', 'steer', 'basket', 'roof'];
  const ORDERS = [['wheel', 'steer', 'seat'], ['seat', 'roof', 'wheel'], ['steer', 'basket', 'roof'], ['basket', 'wheel', 'steer'], ['roof', 'seat', 'basket']];
  const SPOTS = [[214, 286, 246, 300], [292, 222, 270, 236], [250, 300, 214, 280], [236, 270, 300, 222], [280, 230, 292, 250]];
  const USERS = ['rabbit', 'duck', 'frog', 'penguin', 'hedgehog', 'bird'];
  function paintShop(o) {
    const sky = o.createLinearGradient(0, 0, 0, GY); sky.addColorStop(0, '#ff9ac0'); sky.addColorStop(0.55, '#ffc890'); sky.addColorStop(1, '#fff2d0'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    P.cloud(o, 250, 150, 0.7); P.cloud(o, 330, 230, 0.5);
    P.hills(o, 360, 410, 50, '#b8d870', '#80a848', { seed: 33 });
    for (const [x, s] of [[200, 0.6], [338, 0.75]]) P.tree(o, x, 420, s, '#6a9a4a', 7);
    // the street
    const rd = o.createLinearGradient(0, 420, 0, 640); rd.addColorStop(0, '#e8d0a8'); rd.addColorStop(1, '#c8a478'); o.fillStyle = rd; o.fillRect(0, 430, 360, 210);
    o.fillStyle = '#b89468'; o.fillRect(0, GY + 2, 360, 6); o.fillStyle = 'rgba(255,255,255,0.25)'; for (let x = 170; x < 360; x += 44) o.fillRect(x, 560, 24, 5);
    P.grassTufts(o, 360, 590, 615, 16, '#8a9a48', 12); P.flowers(o, 360, 596, 614, 8, undefined, 5);
    // the workshop: a red barn cut away to show inside
    o.fillStyle = '#7a2e26'; o.beginPath(); o.moveTo(-10, 262); o.lineTo(80, 196); o.lineTo(170, 262); o.closePath(); o.fill();
    o.fillStyle = '#5a1e1a'; o.fillRect(-10, 258, 180, 10);
    const wall = o.createLinearGradient(0, 268, 0, GY); wall.addColorStop(0, '#7a4a30'); wall.addColorStop(1, '#a8744a'); o.fillStyle = wall; o.fillRect(0, 268, DOOR, GY - 268);
    o.strokeStyle = 'rgba(80,40,20,0.35)'; o.lineWidth = 2; for (let x = 18; x < DOOR; x += 22) { o.beginPath(); o.moveTo(x, 268); o.lineTo(x, GY); o.stroke(); }
    // tools on the wall: a saw, a hammer, a wrench
    o.fillStyle = '#d8dce4'; o.beginPath(); o.moveTo(18, 300); o.lineTo(62, 300); o.lineTo(62, 316); o.lineTo(18, 322); o.closePath(); o.fill(); o.fillStyle = '#8a4a2a'; o.fillRect(60, 298, 14, 20);
    o.fillStyle = '#8a4a2a'; o.fillRect(92, 292, 6, 34); o.fillStyle = '#5a5a68'; o.fillRect(84, 288, 22, 9);
    o.strokeStyle = '#6a6a78'; o.lineWidth = 5; o.lineCap = 'round'; o.beginPath(); o.moveTo(118, 296); o.lineTo(128, 330); o.stroke(); o.lineCap = 'butt';
    o.fillStyle = '#6a3a20'; o.fillRect(0, GY - 2, DOOR + 4, 8);
    const lamp = o.createRadialGradient(80, 290, 4, 80, 300, 120); lamp.addColorStop(0, 'rgba(255,230,150,0.55)'); lamp.addColorStop(1, 'rgba(255,230,150,0)'); o.fillStyle = lamp; o.fillRect(0, 268, DOOR, GY - 268);
    o.strokeStyle = '#3a2418'; o.lineWidth = 2; o.beginPath(); o.moveTo(80, 268); o.lineTo(80, 282); o.stroke(); o.fillStyle = '#ffe9a0'; o.beginPath(); o.arc(80, 288, 7, 0, 7); o.fill(); o.fillStyle = '#5a3a28'; o.beginPath(); o.moveTo(68, 286); o.lineTo(92, 286); o.lineTo(86, 278); o.lineTo(74, 278); o.closePath(); o.fill();
    // the open door on its hinge
    o.fillStyle = '#9a3a2e'; o.beginPath(); o.moveTo(DOOR, 268); o.lineTo(DOOR + 26, 280); o.lineTo(DOOR + 26, GY - 6); o.lineTo(DOOR, GY); o.closePath(); o.fill();
    o.strokeStyle = '#f4e8d8'; o.lineWidth = 3; o.beginPath(); o.moveTo(DOOR + 3, 276); o.lineTo(DOOR + 23, GY - 12); o.moveTo(DOOR + 23, 286); o.lineTo(DOOR + 3, GY - 8); o.stroke();
    o.fillStyle = '#5a1e1a'; o.fillRect(DOOR - 4, 264, 8, GY - 262);
  }
  // the fix icons (what the user asks for) and the parts on the kart
  function icon(c, k, x, y, s = 1) {
    c.save(); c.translate(x, y); c.scale(s, s); c.lineJoin = 'round';
    if (k === 'wheel') { c.fillStyle = '#2a2430'; c.beginPath(); c.arc(0, 0, 15, 0, 7); c.fill(); c.fillStyle = '#c8c8d4'; c.beginPath(); c.arc(0, 0, 7, 0, 7); c.fill(); c.strokeStyle = '#2a2430'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { const a = i * 2.09; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * 7, Math.sin(a) * 7); c.stroke(); } }
    if (k === 'seat') { c.fillStyle = '#e8503a'; c.strokeStyle = '#8a2a1a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-16, -8, 32, 16, 8); c.fill(); c.stroke(); c.fillStyle = 'rgba(255,255,255,0.4)'; c.beginPath(); c.ellipse(-5, -3, 7, 2.5, 0, 0, 7); c.fill(); }
    if (k === 'steer') { c.strokeStyle = '#3a3a48'; c.lineWidth = 4; c.beginPath(); c.arc(0, 0, 13, 0, 7); c.stroke(); c.lineWidth = 3; c.beginPath(); c.moveTo(-13, 0); c.lineTo(13, 0); c.moveTo(0, 0); c.lineTo(0, 13); c.stroke(); c.fillStyle = '#e8503a'; c.beginPath(); c.arc(0, 0, 4, 0, 7); c.fill(); }
    if (k === 'basket') { c.fillStyle = '#c89048'; c.strokeStyle = '#7a5020'; c.lineWidth = 2; c.beginPath(); c.moveTo(-15, -4); c.lineTo(15, -4); c.lineTo(11, 12); c.lineTo(-11, 12); c.closePath(); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-13, 3); c.lineTo(13, 3); c.stroke(); c.beginPath(); c.arc(0, -4, 12, Math.PI, 0); c.stroke(); SK.ball(c, -5, -8, 5, '#e84a3a', { lw: 1 }); SK.ball(c, 5, -8, 5, '#8ac040', { lw: 1 }); }
    if (k === 'roof') { c.fillStyle = '#5ab8e8'; c.beginPath(); c.moveTo(-18, 2); c.quadraticCurveTo(0, -24, 18, 2); c.closePath(); c.fill(); c.fillStyle = '#fff6ea'; c.beginPath(); c.moveTo(-6, 2); c.quadraticCurveTo(0, -22, 6, 2); c.closePath(); c.fill(); c.strokeStyle = '#3a3a48'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, 2); c.lineTo(0, 16); c.quadraticCurveTo(0, 20, -4, 18); c.stroke(); }
    c.restore();
  }
  function bubble(c, x, y, k, a) {
    c.save(); c.globalAlpha = a; c.fillStyle = '#fff'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5; c.beginPath(); c.arc(x, y, 27, 0, 7); c.fill(); c.stroke();
    c.beginPath(); c.arc(x + 10, y + 31, 5, 0, 7); c.fill(); c.stroke(); icon(c, k, x, y + 1, 1.1); c.restore();
  }
  // the kart, wheels at the ground (x, y); has: the parts it has; pol: 0..1 polish; rot: wheel turn; rider: a draw callback
  function kart(c, x, y, has, pol, rot, t, rider, tilt = 0) {
    c.save(); c.translate(x, y); c.rotate(tilt);
    SK.shadow(c, 0, 2, 44, 6, 0.25);
    if (has.roof) { c.strokeStyle = '#3a3a48'; c.lineWidth = 3; c.beginPath(); c.moveTo(-8, -40); c.lineTo(-8, -104); c.stroke(); c.fillStyle = '#5ab8e8'; c.beginPath(); c.moveTo(-55, -100 + 4); c.quadraticCurveTo(-8, -150, 39, -96); c.closePath(); c.fill(); c.fillStyle = '#fff6ea'; c.beginPath(); c.moveTo(-24, -98); c.quadraticCurveTo(-8, -150, 8, -98); c.closePath(); c.fill(); }
    if (rider) rider(c);
    // the crate body
    const body = P.mix('#b8834a', '#f0c040', pol), edge = P.mix('#6a4020', '#a07010', pol);
    c.fillStyle = body; c.strokeStyle = edge; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-40, -46, 80, 34, 4); c.fill(); c.stroke();
    c.strokeStyle = P.rgba(edge, 0.6); c.lineWidth = 1.5; c.beginPath(); c.moveTo(-40, -35); c.lineTo(40, -35); c.moveTo(-40, -24); c.lineTo(40, -24); c.stroke();
    if (pol > 0.05) { c.fillStyle = `rgba(255,255,255,${0.35 * pol})`; c.beginPath(); c.moveTo(-30, -44); c.lineTo(-18, -44); c.lineTo(-30, -14); c.lineTo(-38, -14); c.closePath(); c.fill(); // a spoiler and stripes the users never asked for
      if (pol > 0.4) { c.fillStyle = '#e8403a'; c.fillRect(-40, -31, 80, 4); } if (pol > 0.7) { c.fillStyle = '#3a3a48'; c.fillRect(-46, -62, 4, 16); c.fillStyle = P.mix('#3a3a48', '#f0c040', pol); c.beginPath(); c.roundRect(-58, -66, 26, 6, 3); c.fill(); } }
    // seat: a red cushion, or splinters poking up from the plank
    if (has.seat) { c.fillStyle = '#e8503a'; c.strokeStyle = '#8a2a1a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-24, -54, 34, 12, 6); c.fill(); c.stroke(); }
    else { c.strokeStyle = '#8a5a2a'; c.lineWidth = 2; for (let i = 0; i < 6; i++) { const sx = -24 + i * 6; c.beginPath(); c.moveTo(sx, -46); c.lineTo(sx + 2, -53 - (i % 2) * 3); c.lineTo(sx + 4, -46); c.stroke(); } }
    if (has.steer) { c.strokeStyle = '#3a3a48'; c.lineWidth = 3; c.beginPath(); c.moveTo(26, -44); c.lineTo(32, -62); c.stroke(); c.save(); c.translate(33, -66); c.scale(0.55, 0.9); c.lineWidth = 4; c.beginPath(); c.arc(0, 0, 11, 0, 7); c.stroke(); c.restore(); }
    if (has.basket) { c.save(); c.translate(48, -26); icon(c, 'basket', 0, 0, 0.95); c.restore(); }
    // wheels: round rubber tyres, or square wooden blocks
    for (const wx of [-26, 26]) { c.save(); c.translate(wx, -KR); c.rotate(rot);
      if (has.wheel) { c.fillStyle = '#2a2430'; c.beginPath(); c.arc(0, 0, KR, 0, 7); c.fill(); c.fillStyle = '#c8c8d4'; c.beginPath(); c.arc(0, 0, 5, 0, 7); c.fill(); c.strokeStyle = '#c8c8d4'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-KR + 3, 0); c.lineTo(KR - 3, 0); c.stroke(); }
      else { c.fillStyle = '#8a5a2a'; c.strokeStyle = '#4a2a10'; c.lineWidth = 2; c.fillRect(-KR, -KR, KR * 2, KR * 2); c.strokeRect(-KR, -KR, KR * 2, KR * 2); c.fillStyle = '#4a2a10'; c.beginPath(); c.arc(0, 0, 3, 0, 7); c.fill(); }
      c.restore(); }
    if (pol > 0.15) for (let i = 0; i < 4; i++) { const q = (t * 0.9 + i * 0.27) % 1, sx = -34 + ((i * 37) % 70), sy = -40 + ((i * 23) % 26), r = 5 * Math.sin(q * Math.PI) * pol; c.fillStyle = '#fffbe0'; c.beginPath(); c.moveTo(sx, sy - r * 2); c.lineTo(sx + r * 0.5, sy); c.lineTo(sx, sy + r * 2); c.lineTo(sx - r * 0.5, sy); c.closePath(); c.fill(); c.beginPath(); c.moveTo(sx - r * 2, sy); c.lineTo(sx, sy - r * 0.5); c.lineTo(sx + r * 2, sy); c.lineTo(sx, sy + r * 0.5); c.closePath(); c.fill(); }
    c.restore();
  }
  const lost = g => g.result === 'fail';
  const TT = [1.5, 1.35, 1.1], BACK = [380, 420, 480], FIXT = [0.75, 0.65, 0.5];
  MG.add({
    id: 'shipit', stage: 'startups', cmd: 'SHIP EACH VERSION TO A USER!', time: 7, mood: 'party', winText: 'Users love it!', failText: 'Shiny, but nobody wants it!', hold: 1.6,
    card: { title: 'Ship a small version first', kind: 'Startups', ref: 'Minimum viable product (MVP)',
      text: 'A minimum viable product is the smallest version of an idea that real people can try. It is rough, but it works well enough to learn from.\n\nWhen users try it, they show you what is wrong: the wheels clunk, the seat pokes, they cannot steer. You could never guess all of that alone in the workshop.\n\nSo ship early, watch, fix the thing they hit, and ship again. Polishing a version nobody has tried spends your time on things users may not care about.',
      note: 'Put a small, rough version in front of real users early, and let what they do tell you what to fix next.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 5); s.L = L;
      s.need = ORDERS[s.v].slice(0, L === 2 ? 3 : 2); s.has = {}; for (const k of FIX) s.has[k] = !s.need.includes(k);
      s.spots = SPOTS[s.v].map(x => Math.round(196 + (x - 214) * 0.77)); if (L === 1) s.spots = s.spots.map((x, i) => i % 2 ? Math.min(266, x + 10) : Math.max(198, x - 8)); if (L === 2) s.spots = s.spots.map(x => Math.min(244, Math.max(212, x)));
      s.trips = s.need.length + 1; s.trip = 0; s.k = { x: HOME, rot: 0, tilt: 0, by: 0 }; s.phase = 'ready'; s.pt = 0; s.pol = 0; s.fixed = []; s.fly = null; s.drag = false; s.users = USERS.slice(s.v).concat(USERS.slice(0, s.v));
      s.walk = L === 2 ? 22 : 0; s.wph = g.rand() * 6;
    },
    spot(g, t = g.t) { const s = g.s; return s.spots[s.trip % s.spots.length] + (s.walk ? s.walk * Math.sin(t * 0.9 + s.wph) : 0); },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || s.phase !== 'ready') return;
      if (Math.abs(x - s.k.x) < 56 && y > GY - 100 && y < GY + 30) { s.drag = true; SK.dragStart(g, s.k, x, y); g.sfx('tap'); }
    },
    move(g, x, y) { const s = g.s; if (!s.drag) return; const k = s.k, x0 = k.x; SK.dragMove(g, x, y); k.y = undefined; k.x = SK.clamp(k.x, 50, 330); k.rot += (k.x - x0) / KR; },
    up(g) {
      const s = g.s; if (!s.drag) return; s.drag = false; SK.dragEnd(g); if (g.done) return;
      if (Math.abs(s.k.x - this.spot(g)) < 38) { s.phase = 'test'; s.pt = g.t; s.k.x0 = s.k.x; s.ux = this.spot(g) + 40; g.sfx('pop'); g.sfx(['ribbit', 'quack', 'tweet', 'meow'][s.trip % 4], { vol: 0.5 }); }
      else g.sfx('swoosh');
    },
    update(g, dt) {
      const s = g.s, k = s.k, L = s.L;
      if (lost(g) && s.phase === 'ready') { const x0 = k.x, tx = this.spot(g) - 10; if (k.x < tx) { k.x = Math.min(tx, k.x + 300 * dt); k.rot += (k.x - x0) / KR; } }
      if (s.phase === 'ready' && !s.drag && k.x < DOOR - 20 && !g.done) s.pol = Math.min(1, s.pol + dt * 0.12); // left inside, it only gets polished
      if (s.phase === 'test') {
        const q = (g.t - s.pt) / TT[L], prob = s.need[s.trip];
        if (!prob) { // every fix is in: the user loves it and drives off
          k.x = k.x0 + Math.max(0, g.t - s.pt - 0.15) * 260; k.rot += 260 * dt / KR * (g.t - s.pt > 0.15 ? 1 : 0);
          if (!g.done && g.t - s.pt > 0.5) { g.win(); g.sfx('cheer'); g.burst(k.x, GY - 70, ['#ffe27a', '#ff8aa0', '#fff6ea', '#5ab8a8'], 26, 220); }
          return;
        }
        const d = 36 * Math.sin(Math.min(1, q / 0.7) * Math.PI), x1 = k.x0 + d; k.rot += (x1 - k.x) / KR; k.x = x1;
        k.by = prob === 'wheel' ? -Math.abs(Math.sin(k.rot * 2)) * 8 : 0;
        k.tilt = prob === 'steer' ? -0.18 * SK.clamp((q - 0.25) / 0.1, 0, 1) * SK.clamp((0.75 - q) / 0.1, 0, 1) : 0;
        if (!s.fx && q > 0.28) { s.fx = 1; g.sfx({ wheel: 'thud', seat: 'boing', steer: 'thud', basket: 'crunch', roof: 'rain' }[prob]); if (prob === 'seat') g.burst(k.x - 6, GY - 70, ['#ffe27a', '#fff6ea'], 10, 140); if (prob === 'basket') g.burst(k.x + 30, GY - 40, ['#e84a3a', '#8ac040', '#f0c040'], 8, 120); if (prob === 'steer') g.shake(4, 0.2); }
        if (prob === 'wheel' && Math.floor(k.rot * 2 / Math.PI) !== s.lastB) { s.lastB = Math.floor(k.rot * 2 / Math.PI); if (q < 0.7) g.sfx('thud', { vol: 0.35 }); }
        if (q >= 1) { s.phase = 'ask'; s.pt = g.t; s.fx = 0; k.tilt = 0; k.by = 0; g.sfx('pop'); }
      } else if (s.phase === 'ask' && g.t - s.pt > 0.55) { s.phase = 'back'; s.pt = g.t; s.fly = { k: s.need[s.trip], x: s.ux + 14, y: GY - 136, t: g.t }; g.sfx('swoosh'); }
      else if (s.phase === 'back') { const x0 = k.x; k.x = Math.max(HOME, k.x - BACK[L] * dt); k.rot += (k.x - x0) / KR; if (k.x <= HOME) { s.phase = 'fix'; s.pt = g.t; g.sfx('click'); } }
      else if (s.phase === 'fix') { const n = Math.floor((g.t - s.pt) / 0.16); if (n !== s.ham) { s.ham = n; g.sfx('tap', { pitch: 0.8 }); }
        if (g.t - s.pt > FIXT[L]) { const f = s.need[s.trip]; s.has[f] = true; s.fixed.push(f); s.trip++; s.phase = 'ready'; s.fly = null; g.sfx('magic'); g.burst(HOME, GY - 50, ['#ffe27a', '#fff6ea', '#5ab8a8'], 16, 160); } }
    },
    draw(g, c) {
      const s = g.s, t = g.t, k = s.k, won = g.result === 'win', lost = g.result === 'fail', L = s.L;
      c.drawImage(g.bake('n7ship', paintShop), 0, 0, 360, 640);
      const prob = s.need[s.trip], q = s.phase === 'test' ? (t - s.pt) / TT[L] : 0;
      // the user waiting at their spot (or the one trying the kart)
      const ui = s.users[s.trip % s.users.length], sp = s.phase === 'ready' || g.done ? this.spot(g) : s.ux - 40;
      // the beaver: hammering while it fixes, rubbing polish on while the kart waits inside
      const fixing = s.phase === 'fix', rub = s.phase === 'ready' && k.x < DOOR - 20 && !g.done;
      SK.animal(c, 'beaver', 34, GY, 1.05, { t, pose: won ? 'cheer' : fixing ? 'carry' : rub ? 'wave' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : fixing ? 'think' : 'happy',
        hold: fixing ? (h => { h.save(); h.rotate(Math.sin(t * 22) * 0.6); h.fillStyle = '#8a4a2a'; h.fillRect(-2, -18, 5, 20); h.fillStyle = '#5a5a68'; h.fillRect(-8, -22, 17, 8); h.restore(); }) : rub ? (h => { h.fillStyle = '#fff6ea'; h.beginPath(); h.ellipse(0, 0, 8, 5, Math.sin(t * 12), 0, 7); h.fill(); }) : null });
      // the kart, with the user riding in it during a try-out
      const riding = s.phase === 'test' || (won && !prob);
      const rider = riding ? (h => { const hop = prob === 'seat' && q > 0.28 && q < 0.6 ? -26 * Math.sin((q - 0.28) / 0.32 * Math.PI) : 0;
        SK.animal(h, ui, -4, -30 + hop, 0.74, { t, phase: 2, pose: won ? 'cheer' : prob === 'basket' ? 'carry' : 'idle', expr: won ? 'laugh' : q > 0.28 ? (prob === 'roof' || prob === 'steer' ? 'sad' : 'wow') : 'happy', noShadow: true }); }) : null;
      kart(c, k.x, GY + k.by, s.has, s.pol, k.rot, t, rider, k.tilt);
      if (s.phase === 'test' && q > 0.28) { // the problem, for real
        if (prob === 'steer') { const cx = k.x0 + 82; c.fillStyle = '#ff7a2a'; c.beginPath(); c.moveTo(cx - 12, GY); c.lineTo(cx, GY - 34); c.lineTo(cx + 12, GY); c.closePath(); c.fill(); c.fillStyle = '#fff6ea'; c.fillRect(cx - 7, GY - 20, 14, 5); }
        if (prob === 'roof') { const cx = k.x - 4; c.save(); c.translate(cx, GY - 150); P.cloud(c, 0, 0, 0.42, '#c8c8d8', '#8a8aa0'); c.restore(); c.strokeStyle = 'rgba(90,140,220,0.8)'; c.lineWidth = 2; for (let i = 0; i < 9; i++) { const rx = cx - 34 + i * 9, ry = GY - 136 + ((t * 300 + i * 23) % 70); c.beginPath(); c.moveTo(rx, ry); c.lineTo(rx - 3, ry + 10); c.stroke(); } }
        if (prob === 'basket') for (let i = 0; i < 3; i++) { const a = SK.clamp((q - 0.28) * 2.2 - i * 0.12, 0, 1); SK.ball(c, k.x + 10 + i * 16 + a * 30, GY - 70 + a * a * 62, 7, ['#e84a3a', '#8ac040', '#f0c040'][i]); }
      }
      if (s.phase !== 'test' && !(won && !prob)) {
        const asking = s.phase === 'ask' || s.phase === 'back' || s.phase === 'fix';
        const ux = asking ? s.ux : sp + 40;
        SK.animal(c, ui, ux, GY, 0.95, { t, phase: 1, facing: -1, pose: asking ? 'point' : lost ? 'sad' : 'wave', expr: asking ? 'think' : lost ? 'sad' : 'happy' });
        if (s.phase === 'ask') bubble(c, ux + 14, GY - 136, prob, Math.min(1, (t - s.pt) * 5));
        if (!g.done && s.phase === 'ready') SK.tag(c, 'User', ux, GY + 32, 18);
      }
      // the note flies from the user to the beaver: the fix it will build
      if (s.fly) { const f = s.fly, m = SK.easeInOut(Math.min(1, (t - f.t) / 0.6)), fx = SK.lerp(f.x, 92, m), fy = SK.lerp(f.y, 340, m) - Math.sin(m * Math.PI) * 40; bubble(c, fx, fy, f.k, 1); }
      SK.tag(c, 'Workshop', 76, 236, 18);
      if (!g.done) { if (!riding) SK.tag(c, 'v' + (s.trip + 1), k.x, GY + k.by - 29, 18, '#fff6ea', 'rgba(60,120,110,0.9)'); SK.tag(c, 'Try-out ' + Math.min(s.trip + 1, s.trips) + ' / ' + s.trips, 268, 200, 18); }
      // guidance: drag the kart out to the waiting user
      if (s.phase === 'ready' && !g.done && !s.drag) {
        const tx = this.spot(g);
        SK.grab(c, g, k.x, GY - 34, 34); SK.target(c, g, tx, GY - 28, 0, { w: 92, h: 66 }); SK.arrow(c, g, k.x, GY - 34, tx, GY - 30, { from: 40, to: 52 });
        SK.demo(g, c, 'drag', [k.x, GY - 30], [tx, GY - 30], { delay: 0.7 });
      }
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.phase !== 'ready') return; const B = s._n7 = s._n7 || {};
      if (B.trip !== s.trip) { B.trip = s.trip; B.at = g.t + 0.25; B.a = s.k.x; }
      const dur = 0.45, tx = this.spot(g, Math.max(g.t, B.at) + dur);
      SK.bot.drag(g, synth, 'ship' + s.trip, B.at, [B.a, GY - 30], [tx, GY - 30], dur);
    },
  });
})();
