// CATCH! (cs AP-06) — a phone app shows three panels filled by three servers above it (Weather, Maps, News). Replies
// fall from the servers into their panels. Some servers are down: a server shakes, smokes, and drops a red error
// envelope. Slide the net (it is the code's except: handler) under each one before it lands: the net catches the
// error and turns it into a friendly "Try again" card for that panel. Good replies fall straight through the net's
// mesh, because except only catches errors. Miss one and the error crashes the whole app: the screen goes blank and
// the bird reading the weather on top of the phone falls off. Level 0: three errors one at a time; level 1: four,
// faster; level 2: four, in pairs from two servers at once.
(() => {
  const COLX = [62, 180, 298], NETY = 436, TOPY = 262, PH = { x: 30, y: 476, w: 300, h: 132 };
  const NAMES = ['Weather', 'Maps', 'News'], COL = ['#ffb030', '#4ac07a', '#5a9ae8'];
  const PLANS = [{ n: 3, fall: 3.6, pairs: false }, { n: 4, fall: 2.9, pairs: false }, { n: 4, fall: 2.3, pairs: true }];
  function paintSky(o) {
    const sk = o.createLinearGradient(0, 0, 0, 640); sk.addColorStop(0, '#6aa8e0'); sk.addColorStop(0.55, '#b8dcf0'); sk.addColorStop(1, '#ffe8c8'); o.fillStyle = sk; o.fillRect(0, 0, 360, 640);
    P.cloud(o, 60, 260, 0.5); P.cloud(o, 290, 300, 0.45); P.cloud(o, 180, 360, 0.35);
    // the wires the replies travel down, faint dotted lines from each server to its panel
    o.strokeStyle = 'rgba(255,255,255,0.55)'; o.lineWidth = 2; o.setLineDash([3, 9]); for (const x of COLX) { o.beginPath(); o.moveTo(x, 214); o.lineTo(x, PH.y); o.stroke(); } o.setLineDash([]);
    // a desk under the phone
    const d = o.createLinearGradient(0, 560, 0, 640); d.addColorStop(0, '#c88a58'); d.addColorStop(1, '#8a5a34'); o.fillStyle = d; o.fillRect(0, 586, 360, 54);
  }
  function server(c, x, y, i, down, shake, t) {
    const dx = shake ? Math.sin(t * 60) * 3 : 0; c.save(); c.translate(x + dx, y); c.scale(1.18, 1.18);
    c.fillStyle = 'rgba(30,14,36,0.25)'; c.beginPath(); c.roundRect(-34, -40, 72, 86, 10); c.fill();
    c.fillStyle = '#3a3a5a'; c.beginPath(); c.roundRect(-36, -44, 72, 84, 10); c.fill(); c.strokeStyle = '#1a1a30'; c.lineWidth = 2; c.stroke();
    for (let k = 0; k < 3; k++) { c.fillStyle = '#4a4a70'; c.beginPath(); c.roundRect(-28, -36 + k * 24, 56, 18, 4); c.fill(); c.fillStyle = down ? (Math.sin(t * 10 + k) > 0 ? '#ff4a3a' : '#6a2a2a') : (Math.sin(t * 7 + k * 2 + i) > -0.3 ? '#6aff8a' : '#2a6a3a'); c.beginPath(); c.arc(18, -27 + k * 24, 3.5, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,0.2)'; c.fillRect(-22, -29 + k * 24, 26, 3); }
    // the service's badge
    c.fillStyle = COL[i]; c.beginPath(); c.arc(-16, -48, 15, 0, 7); c.fill(); c.strokeStyle = '#fff6ea'; c.lineWidth = 2.5; c.stroke(); icon(c, i, -16, -48, 0.8);
    if (down) { for (let k = 0; k < 3; k++) { const q = (t * 0.8 + k / 3) % 1; c.fillStyle = `rgba(90,80,90,${0.5 * (1 - q)})`; c.beginPath(); c.arc(14 + Math.sin(q * 6 + k) * 6, -50 - q * 40, 8 + q * 10, 0, 7); c.fill(); } }
    c.restore();
  }
  function icon(c, i, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#fff6ea'; c.strokeStyle = '#fff6ea'; c.lineWidth = 2.5;
    if (i === 0) { c.beginPath(); c.arc(0, 0, 6, 0, 7); c.fill(); for (let k = 0; k < 8; k++) { const a = k * 0.785; c.beginPath(); c.moveTo(Math.cos(a) * 9, Math.sin(a) * 9); c.lineTo(Math.cos(a) * 12, Math.sin(a) * 12); c.stroke(); } }
    else if (i === 1) { c.beginPath(); c.arc(0, -3, 7, Math.PI, 0); c.lineTo(0, 10); c.closePath(); c.fill(); c.fillStyle = COL[1]; c.beginPath(); c.arc(0, -3, 3, 0, 7); c.fill(); }
    else { c.fillRect(-8, -8, 16, 16); c.fillStyle = COL[2]; c.fillRect(-5, -5, 10, 3); c.fillRect(-5, 0, 10, 2); c.fillRect(-5, 4, 7, 2); }
    c.restore(); }
  function net(c, x, glow, t) {
    c.save(); c.strokeStyle = '#7a4a2a'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + 44, NETY + 4); c.lineTo(x + 78, NETY + 34); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.22)'; c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x - 44, NETY); c.quadraticCurveTo(x, NETY + 54, x + 44, NETY); c.closePath(); c.fill();
    for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(x + k * 12, NETY); c.quadraticCurveTo(x + k * 8, NETY + 30, x + k * 4, NETY + 40 - Math.abs(k) * 4); c.stroke(); }
    for (let k = 1; k <= 3; k++) { c.beginPath(); c.ellipse(x, NETY + k * 9, 44 - k * 10, 4, 0, 0, Math.PI); c.stroke(); }
    c.strokeStyle = glow ? '#ffe27a' : '#e8563a'; c.lineWidth = 5; c.beginPath(); c.ellipse(x, NETY, 44, 10, 0, 0, 7); c.stroke(); c.restore();
  }
  function phone(c, s, t, blank) {
    const { x, y, w, h } = PH; c.fillStyle = 'rgba(30,14,36,0.3)'; c.beginPath(); c.roundRect(x + 4, y + 6, w, h + 20, 18); c.fill();
    c.fillStyle = '#2a2440'; c.beginPath(); c.roundRect(x, y, w, h + 20, 18); c.fill();
    c.fillStyle = blank ? '#ffffff' : '#f4f0ff'; c.beginPath(); c.roundRect(x + 10, y + 10, w - 20, h - 4, 10); c.fill();
    if (blank) return;
    for (let i = 0; i < 3; i++) { const px = COLX[i] - 46, py = y + 16, pw = 92, ph = h - 16, st = s.panel[i];
      c.fillStyle = st === 'ok' ? P.mix(COL[i], '#ffffff', 0.55) : st === 'sorry' ? '#fff4d0' : '#e8e4f0'; c.beginPath(); c.roundRect(px + 2, py, pw - 4, ph, 8); c.fill();
      if (st === 'ok') { c.fillStyle = COL[i]; c.beginPath(); c.arc(COLX[i], py + 36, 20, 0, 7); c.fill(); icon(c, i, COLX[i], py + 36, 1.2); N5.text(c, ['22°', '2 km', 'Hi!'][i], COLX[i], py + 84, 20, '#3a1640', { edge: 'rgba(255,255,255,0.8)' }); }
      else if (st === 'sorry') { c.strokeStyle = '#c08a10'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.arc(COLX[i], py + 36, 14, 0.5, 5.6); c.stroke(); c.fillStyle = '#c08a10'; c.beginPath(); c.moveTo(COLX[i] + 18, py + 30); c.lineTo(COLX[i] + 8, py + 26); c.lineTo(COLX[i] + 14, py + 40); c.fill();
        N5.text(c, 'Try', COLX[i], py + 72, 18, '#7a4a10', { edge: 'rgba(255,255,255,0.9)' }); N5.text(c, 'again', COLX[i], py + 92, 18, '#7a4a10', { edge: 'rgba(255,255,255,0.9)' }); }
      else { c.fillStyle = '#c8c0d8'; for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(COLX[i] - 14 + k * 14, py + 50, 4 + Math.max(0, Math.sin(t * 6 - k)) * 2, 0, 7); c.fill(); } }
    }
  }
  function schedule(g) { // the drop times for every error, and good replies from the working servers in between
    const s = g.s, pl = s.pl, order = SK.shuffled(g, [0, 1, 2]); s.drops = []; let t = 1.0;
    for (let k = 0; k < pl.n; k++) {
      if (pl.pairs && k % 2 === 1) continue;
      const a = order[k % 3], b = order[(k + 1) % 3];
      s.drops.push({ col: a, err: true, at: null, wait: k === 0 ? t : 0.35, y: TOPY, st: 'queue' });
      if (pl.pairs) s.drops.push({ col: b, err: true, at: null, wait: 0.75, y: TOPY, st: 'queue', pair: true });
    }
    s.good = [];
  }
  MG.add({
    id: 'catch', stage: 'apps', cmd: 'CATCH THE ERRORS IN THE NET!', time: 7, mood: 'party', winText: 'The app kept going!', failText: 'The app crashed!',
    card: { title: 'Plan for things going wrong', kind: 'Computer science', ref: 'Error handling (try / except)',
      text: 'An app often asks other computers, called servers, for things like the weather. Sometimes a server is down, and the answer that comes back is an error.\n\nIf nothing catches that error, the app crashes, and the person sees a blank screen. So programmers wrap the request in try, and write an except part that runs only when an error comes back.\n\nHere the net is that except part. It lets good answers through and catches the errors, so the app can show "Try again" and keep working.',
      note: 'Calls to other machines sometimes fail, so an app needs code that catches the error and shows something useful instead of crashing.' },
    init(g) {
      const s = g.s; s.L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.pl = PLANS[s.L];
      s.netX = COLX[s.v % 3]; s.netT = s.netX; s.panel = ['wait', 'wait', 'wait']; s.caught = 0; s.miss = null; s.flash = []; s.fx = []; schedule(g);
      s.qi = 0; s.lastEnd = 0; s.goodT = 0.6 + g.rand() * 0.5;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done) return; if (y > 300 && y < 600) { s.drag = true; s.netT = SK.clamp(x, 40, 320); } },
    move(g, x, y) { const s = g.s; if (s.drag) s.netT = SK.clamp(x, 40, 320); },
    up(g) { g.s.drag = false; },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      s.netX += (s.netT - s.netX) * Math.min(1, dt * 16);
      const speed = (NETY - TOPY) / s.pl.fall;
      // start the next error (or pair) once the one before has been dealt with
      const live = s.drops.filter(d => d.st === 'shake' || d.st === 'fall');
      if (!live.length && s.qi < s.drops.length) { const d = s.drops[s.qi]; if (d.at == null) d.at = g.t + d.wait; if (g.t >= d.at) { d.st = 'shake'; d.t0 = g.t; s.qi++; g.sfx('rumble', { vol: 0.4 });
        const nx = s.drops[s.qi]; if (nx && nx.pair) { nx.at = g.t + nx.wait; } } }
      const nx = s.drops[s.qi]; if (nx && nx.pair && nx.at != null && g.t >= nx.at) { nx.st = 'shake'; nx.t0 = g.t; s.qi++; g.sfx('rumble', { vol: 0.4 }); }
      for (const d of s.drops) {
        if (d.st === 'shake' && g.t - d.t0 > 0.55) { d.st = 'fall'; g.sfx('whoosh', { vol: 0.4 }); }
        if (d.st !== 'fall') continue;
        const y0 = d.y; d.y += speed * dt;
        if (y0 < NETY && d.y >= NETY && Math.abs(COLX[d.col] - s.netX) < 46) { d.st = 'caught'; d.ct = g.t; s.caught++; g.sfx('swoosh'); g.sfx('ding'); g.burst(COLX[d.col], NETY, ['#ffe27a', '#fff6ea'], 12, 120); }
        else if (d.y >= PH.y + 14) { d.st = 'crash'; s.miss = { t: g.t, col: d.col }; g.sfx('crunch'); g.sfx('fail'); g.shake(6, 0.4); }
      }
      for (const d of s.drops) if (d.st === 'caught' && g.t - d.ct > 0.45) { d.st = 'done'; s.panel[d.col] = 'sorry'; g.sfx('pop'); }
      // good replies from working servers fall straight through the net's mesh
      if (g.t >= s.goodT) { const busy = s.drops.filter(d => d.st === 'shake' || d.st === 'fall').map(d => d.col), free = [0, 1, 2].filter(i => !busy.includes(i) && s.panel[i] !== 'sorry');
        if (free.length) { const col = free[Math.floor(g.rand() * free.length)]; s.good.push({ col, y: TOPY, st: 'fall' }); } s.goodT = g.t + 1.4 + g.rand() * 1.2; }
      for (const q of s.good) if (q.st === 'fall') { q.y += speed * 1.3 * dt; if (q.y >= PH.y + 14) { q.st = 'done'; if (s.panel[q.col] !== 'sorry') s.panel[q.col] = 'ok'; g.sfx('tap', { pitch: 1.3, vol: 0.4 }); } }
      if (s.miss && g.t - s.miss.t > 0.8) { g.fail(); g.sfx('laugh'); }
      if (!s.miss && s.drops.every(d => d.st === 'done')) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', blank = !!s.miss;
      c.drawImage(g.bake('catch_sky', paintSky), 0, 0, 360, 640);
      for (let i = 0; i < 3; i++) { const d = s.drops.find(q => q.col === i && (q.st === 'shake' || q.st === 'fall')), down = s.drops.some(q => q.col === i && q.st !== 'queue');
        server(c, COLX[i], 176, i, down, d && d.st === 'shake', t); SK.tag(c, NAMES[i], COLX[i], 244, 18); }
      phone(c, s, t, blank);
      // the bird on top of the phone, reading; it falls off when the app crashes
      let bx = 306, by = PH.y + 2, rot = 0; if (s.miss) { const k = SK.clamp((t - s.miss.t) / 0.7, 0, 1); bx += k * 50; by += k * k * 160; rot = k * 2; }
      c.save(); c.translate(bx, by); c.rotate(rot); SK.animal(c, 'bird', 0, 0, 0.75, { t, pose: won ? 'cheer' : s.miss ? 'cheer' : 'idle', expr: won ? 'laugh' : s.miss ? 'wow' : 'happy', facing: -1, noShadow: true }); c.restore();
      if (s.miss) { const k = SK.clamp((t - s.miss.t) * 3, 0, 1); c.save(); c.globalAlpha = k; SK.tag(c, 'Crash!', 180, PH.y + 66, 22, '#fff6ea', 'rgba(200,40,40,0.92)'); c.restore(); }
      // good replies pass behind the net; errors are caught in front of it
      for (const q of s.good) if (q.st === 'fall') N5.envelope(c, COLX[q.col], q.y, 36, { col: '#ffffff', seal: COL[q.col] });
      net(c, s.netX, s.drops.some(d => d.st === 'caught'), t);
      if (g.level <= 1 && !g.done) SK.tag(c, 'except', s.netX + (s.netX > 220 ? -84 : 84), NETY + 18, 18);
      for (const d of s.drops) {
        if (d.st === 'fall' || d.st === 'crash') { N5.envelope(c, COLX[d.col], Math.min(d.y, PH.y + 14), 40, { col: '#ff5a4a', edge: '#7a1a1a', text: '!', tcol: '#fff6ea', rot: Math.sin(t * 8 + d.col) * 0.12 }); if (d.st === 'fall' && s.caught === 0 && d === s.drops[0]) SK.tag(c, 'Error', COLX[d.col] + (d.col === 2 ? -58 : 56), d.y, 18, '#fff6ea', 'rgba(170,30,30,0.9)'); }
        if (d.st === 'caught') { const k = SK.clamp((t - d.ct) / 0.45, 0, 1); N5.envelope(c, COLX[d.col], SK.lerp(NETY + 10, PH.y + 30, k), 40 - k * 6, { col: P.mix('#ff5a4a', '#ffe27a', k), edge: '#7a4a10', text: k > 0.5 ? '↻' : '!', tcol: '#7a1a1a' }); }
      }
      if (!g.done) N5.slots(c, s.caught, s.drops.length, 180, 300);
      // guidance: slide the net under the next error that is falling (or about to fall)
      const nextD = s.drops.filter(d => d.st === 'shake' || d.st === 'fall').sort((a, b) => b.y - a.y).find(d => Math.abs(COLX[d.col] - s.netX) > 30) || null;
      if (nextD && !g.done) { const tx = COLX[nextD.col]; SK.grab(c, g, s.netX, NETY + 8, 40); SK.target(c, g, tx, NETY + 8, 40); SK.arrow(c, g, s.netX, NETY + 8, tx, NETY + 8, { from: 44, to: 48 });
        SK.demo(g, c, 'drag', [s.netX, NETY + 10], [tx, NETY + 10], { period: 1.2 }); }
      else SK.demo(g, c, 'drag', [s.netX, NETY], [s.netX, NETY], { never: true });
    },
    // the bot taps under each error as it starts to shake
    auto(g, dt, synth) {
      const s = g.s; if (g.done) return; const d = s.drops.filter(q => q.st === 'shake' || q.st === 'fall').sort((a, b) => b.y - a.y).find(q => Math.abs(COLX[q.col] - s.netT) > 20);
      if (!d || g.t < (s.bt || 0)) return; s.bt = g.t + 0.25; const x = COLX[d.col]; synth('down', x, NETY); synth('up', x, NETY);
    },
  });
})();
