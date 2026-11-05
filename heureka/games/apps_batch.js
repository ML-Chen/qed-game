// BATCH! (cs SP-01) — a phone's friends page is waiting for its pictures: the screen is covered in little request notes
// ("send me this picture"). A bird carries a sack of requests to the server and back, and every trip takes the same
// time however full the sack is. Sweep your finger across the notes to scoop them into the sack, then tap the bird:
// one trip with every request brings every picture back at once and the screen fills. Send a half-empty sack and the
// bird returns with only those pictures and has to go again, while the rabbit waiting on the page gets bored.
// Level 0: 18 requests in rows; level 1: 24; level 2: 28 scattered at random.
(() => {
  const SCR = { x: 22, y: 292, w: 224, h: 292 }, SACK = [300, 556], SERVER = [296, 214], TRIP = 1.7, R = 30;
  const FACE = ['#e8a060', '#8ac0e8', '#f0c040', '#a0d080', '#e88ab0', '#b09ae0'];
  function paintRoom(o) {
    const bg = o.createLinearGradient(0, 0, 0, 640); bg.addColorStop(0, '#ffc8a0'); bg.addColorStop(0.5, '#ffe2c0'); bg.addColorStop(1, '#f0d0e0'); o.fillStyle = bg; o.fillRect(0, 0, 360, 640);
    P.cloud(o, 90, 200, 0.6); P.cloud(o, 200, 250, 0.4);
    // the path the bird flies: a dotted arc up to the server
    o.strokeStyle = 'rgba(120,70,90,0.35)'; o.lineWidth = 3; o.setLineDash([4, 10]); o.beginPath(); o.moveTo(SACK[0], SACK[1] - 40); o.quadraticCurveTo(352, 380, SERVER[0], SERVER[1] + 50); o.stroke(); o.setLineDash([]);
    const fl = o.createLinearGradient(0, 600, 0, 640); fl.addColorStop(0, '#c8906a'); fl.addColorStop(1, '#a06a4a'); o.fillStyle = fl; o.fillRect(0, 604, 360, 36);
  }
  function server(c, x, y, t, busy) {
    c.fillStyle = 'rgba(30,14,36,0.25)'; c.beginPath(); c.roundRect(x - 30, y - 36, 66, 84, 10); c.fill();
    c.fillStyle = '#4a4a6a'; c.beginPath(); c.roundRect(x - 33, y - 40, 66, 84, 10); c.fill(); c.strokeStyle = '#22223a'; c.lineWidth = 2; c.stroke();
    for (let k = 0; k < 3; k++) { c.fillStyle = '#5a5a80'; c.beginPath(); c.roundRect(x - 25, y - 32 + k * 24, 50, 18, 4); c.fill(); c.fillStyle = Math.sin(t * (busy ? 18 : 5) + k * 2) > 0 ? '#6aff8a' : '#2a6a3a'; c.beginPath(); c.arc(x + 15, y - 23 + k * 24, 3.5, 0, 7); c.fill(); }
  }
  function note(c, x, y, rot) { c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = 'rgba(30,14,36,0.2)'; c.fillRect(-12, -9, 26, 20); c.fillStyle = '#fff6ea'; c.strokeStyle = '#8a7aa8'; c.lineWidth = 1.5; c.beginPath(); c.roundRect(-13, -11, 26, 20, 3); c.fill(); c.stroke();
    c.fillStyle = '#b8a8d8'; c.beginPath(); c.arc(-4, -2, 4, 0, 7); c.fill(); c.fillRect(-9, 3, 10, 3); c.fillStyle = '#e8563a'; c.font = '900 11px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 7, -1); c.restore(); }
  function face(c, x, y, i, k) { const s = SK.easeOut(k); if (s <= 0) return; c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = FACE[i % 6]; c.beginPath(); c.roundRect(-15, -15, 30, 30, 7); c.fill(); c.fillStyle = P.shade(FACE[i % 6], -0.35); c.beginPath(); c.arc(0, -2, 6, 0, 7); c.fill(); c.beginPath(); c.ellipse(0, 11, 10, 6, 0, Math.PI, 0); c.fill(); c.restore(); }
  function sack(c, x, y, n, t, carried) {
    const f = Math.min(1, n / 18), w = 26 + f * 20, h = 28 + f * 18; c.save(); c.translate(x, y);
    c.fillStyle = 'rgba(30,14,36,0.25)'; if (!carried) { c.beginPath(); c.ellipse(4, h * 0.5 + 4, w * 0.8, 6, 0, 0, 7); c.fill(); }
    const g2 = c.createRadialGradient(-w * 0.3, -h * 0.1, 3, 0, 0, w); g2.addColorStop(0, '#e8c890'); g2.addColorStop(1, '#a8804a'); c.fillStyle = g2;
    c.beginPath(); c.moveTo(-w * 0.35, -h * 0.5); c.quadraticCurveTo(-w, -h * 0.2, -w * 0.8, h * 0.4); c.quadraticCurveTo(0, h * 0.7, w * 0.8, h * 0.4); c.quadraticCurveTo(w, -h * 0.2, w * 0.35, -h * 0.5); c.closePath(); c.fill(); c.strokeStyle = '#6a4a24'; c.lineWidth = 2; c.stroke();
    c.strokeStyle = '#c84a3a'; c.lineWidth = 4; c.beginPath(); c.moveTo(-w * 0.4, -h * 0.5); c.lineTo(w * 0.4, -h * 0.5); c.stroke(); c.restore();
  }
  function layout(g) { // where the request notes sit on the screen
    const s = g.s, out = []; if (s.L < 2) { const rows = s.L === 0 ? 3 : 4, cols = 6, y0 = SCR.y + 60, dy = s.L === 0 ? 74 : 56;
      for (let r = 0; r < rows; r++) for (let i = 0; i < cols; i++) out.push({ x: SCR.x + 26 + i * 34 + (r % 2) * 6 + (g.rand() - 0.5) * 6, y: y0 + r * dy + (g.rand() - 0.5) * 8, rot: (g.rand() - 0.5) * 0.5, row: r }); }
    else for (let i = 0; i < 28; i++) { let x, y, ok = false; for (let k = 0; k < 40 && !ok; k++) { x = SCR.x + 22 + g.rand() * (SCR.w - 44); y = SCR.y + 50 + g.rand() * (SCR.h - 80); ok = out.every(o => Math.hypot(o.x - x, o.y - y) > 30); } out.push({ x, y, rot: (g.rand() - 0.5) * 0.6, row: -1 }); }
    out.forEach((o, i) => { o.i = i; o.st = 'wait'; }); return out;
  }
  function sweepTo(g, x, y) {
      const s = g.s; if (!s.sweep || g.done) return; const [px, py] = s.sweep; s.sweep = [x, y];
      // scoop every note the finger passes near
      for (const n of s.notes) { if (n.st !== 'wait') continue; const L = Math.max(1, Math.hypot(x - px, y - py)), k = SK.clamp(((n.x - px) * (x - px) + (n.y - py) * (y - py)) / (L * L), 0, 1), d = Math.hypot(px + (x - px) * k - n.x, py + (y - py) * k - n.y);
        if (d < R) { n.st = 'go'; n.t = g.t; g.sfx('pop', { pitch: 1 + (s.inSack.length % 8) * 0.06, vol: 0.4 }); } }
  }
  MG.add({
    id: 'batch', stage: 'apps', cmd: 'FILL THE SACK, THEN SEND IT!', time: 8, mood: 'party', winText: 'Loaded in one trip!', failText: 'Too slow!',
    card: { title: 'Ask for everything at once', kind: 'Computer science', ref: 'Batching requests',
      text: 'Every time an app asks a server for something, the request has to travel there and the answer has to travel back. That round trip takes about the same time whether it carries one thing or fifty.\n\nAn app that asks for fifty pictures one at a time makes fifty round trips, and the person waits for all of them. An app that sends one batch, a single request for all fifty, makes one trip.\n\nReal apps batch requests so pages load quickly. A batch can be too big, though, so they also keep batches to a sensible size.',
      note: 'One request for fifty things is far faster than fifty separate requests, because each round trip takes time.' },
    init(g) { const s = g.s; s.L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.notes = layout(g); s.inSack = []; s.fly = null; s.got = []; s.trips = 0; s.sweep = null; s.flash = []; s.pal = s.v; },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done) return;
      if (!s.fly && SK.dist(x, y, SACK[0], SACK[1] - 34) < 50) { if (!s.inSack.length) { g.sfx('wrong'); return; } s.fly = { t: g.t, load: s.inSack.slice() }; s.inSack = []; s.trips++; g.sfx('whoosh'); g.sfx('tweet'); return; }
      s.sweep = [x, y]; sweepTo(g, x, y);
    },
    move(g, x, y) { sweepTo(g, x, y); },
    up(g) { g.s.sweep = null; },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      for (const n of s.notes) if (n.st === 'go' && g.t - n.t > 0.35) { n.st = 'sack'; s.inSack.push(n.i); }
      if (s.fly) { const k = (g.t - s.fly.t) / TRIP; if (k >= 0.5 && !s.fly.srv) { s.fly.srv = 1; g.sfx('click'); }
        if (k >= 1) { for (const i of s.fly.load) s.got.push({ i, t: g.t }); s.fly = null; g.sfx('chime'); if (s.got.length >= s.notes.length) { s.winAt = g.t; } } }
      if (s.winAt && g.t - s.winAt > 0.45) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('batch_room', paintRoom), 0, 0, 360, 640);
      server(c, SERVER[0], SERVER[1], t, s.fly && (t - s.fly.t) / TRIP > 0.4 && (t - s.fly.t) / TRIP < 0.6); SK.tag(c, 'Server', SERVER[0], SERVER[1] + 64, 18);
      // the phone and its friends page
      c.fillStyle = 'rgba(30,14,36,0.3)'; c.beginPath(); c.roundRect(SCR.x - 6, SCR.y - 26, SCR.w + 12, SCR.h + 44, 22); c.fill();
      c.fillStyle = '#2a2440'; c.beginPath(); c.roundRect(SCR.x - 10, SCR.y - 30, SCR.w + 12, SCR.h + 44, 22); c.fill();
      c.fillStyle = '#f4f0ff'; c.beginPath(); c.roundRect(SCR.x, SCR.y, SCR.w - 8, SCR.h, 12); c.fill();
      c.fillStyle = '#7a5ab8'; c.beginPath(); c.roundRect(SCR.x, SCR.y, SCR.w - 8, 34, [12, 12, 0, 0]); c.fill(); N5.text(c, 'Friends', SCR.x + (SCR.w - 8) / 2, SCR.y + 17, 18, '#fff6ea', { lw: 0 });
      for (const n of s.notes) { const got = s.got.find(q => q.i === n.i); if (got) face(c, n.x, n.y, n.i + s.pal, (t - got.t) / 0.3); }
      for (const n of s.notes) { if (n.st === 'wait') note(c, n.x, n.y, n.rot); else if (n.st === 'go') { const k = SK.easeInOut((t - n.t) / 0.35); note(c, SK.lerp(n.x, SACK[0], k), SK.lerp(n.y, SACK[1] - 20, k) - Math.sin(k * Math.PI) * 40, n.rot + k * 3); } }
      // the rabbit waiting for the page: happy, then bored as the fuse runs down (it walks off if it runs out)
      const bored = g.fuse() / g.dur; SK.animal(c, 'rabbit', 50, 262, 0.82, { t, pose: won ? 'cheer' : lost ? 'walk' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : bored > 0.6 ? 'sad' : 'happy', facing: 1 });
      if (!won && bored > 0.55 && !g.done) SK.tag(c, 'Waiting...', 150, 196, 18);
      // the sack and the bird: on the sack, or flying it to the server and back
      const flyK = s.fly ? (t - s.fly.t) / TRIP : -1;
      if (flyK < 0) { sack(c, SACK[0], SACK[1], s.inSack.length, t); SK.animal(c, 'bird', SACK[0] + 4, SACK[1] - 34, 0.7, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : 'happy', facing: -1, noShadow: true }); }
      else { const k = flyK < 0.5 ? SK.easeInOut(flyK * 2) : SK.easeInOut((1 - flyK) * 2), a = [SACK[0], SACK[1] - 40], b = [SERVER[0], SERVER[1] + 50], cx = 352, cy = 380;
        const x = (1 - k) * (1 - k) * a[0] + 2 * (1 - k) * k * cx + k * k * b[0], y = (1 - k) * (1 - k) * a[1] + 2 * (1 - k) * k * cy + k * k * b[1];
        sack(c, x, y + 30, s.fly.load.length, t, true); SK.animal(c, 'bird', x, y, 0.7, { t, pose: 'cheer', expr: 'happy', facing: flyK < 0.5 ? 1 : -1, noShadow: true }); }
      SK.tag(c, s.inSack.length + (s.fly ? '' : '') + ' in sack', SACK[0], 610, 18);
      if (!g.done) { const left = s.notes.length - s.got.length; SK.tag(c, left + ' to load', 150, SCR.y - 50, 18, '#fff6ea', 'rgba(122,90,184,0.92)'); }
      // guidance: sweep across the notes still waiting (a row at a time); when none are left, tap the bird
      const wait = s.notes.filter(n => n.st === 'wait');
      if (!g.done && wait.length) { let a, b; if (s.L < 2) { const r = wait[0].row, row = wait.filter(n => n.row === r); a = [row[0].x - 16, row[0].y]; b = [row[row.length - 1].x + 16, row[row.length - 1].y]; }
        else { const n0 = wait.slice().sort((p, q) => p.y - q.y || p.x - q.x)[0], near = wait.filter(n => Math.abs(n.y - n0.y) < 30).sort((p, q) => p.x - q.x); a = [near[0].x - 14, near[0].y]; b = [near[near.length - 1].x + 14, near[near.length - 1].y]; if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 30) b = [a[0] + 60, a[1]]; }
        SK.demo(g, c, 'drag', a, b, { period: 1.4 }); }
      else if (!g.done && !s.fly && s.inSack.length) { SK.glow(c, g, SACK[0], SACK[1] - 30, 46, '#e8563a', { level: 2 }); SK.demo(g, c, 'tap', [SACK[0], SACK[1] - 20], null); }
    },
    // the bot sweeps each row (or band of notes), then sends the bird once
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.fly) return; const wait = s.notes.filter(n => n.st === 'wait'), B = s._b = s._b || { k: 0 };
      if (B.on) { const k = SK.clamp((g.t - B.t0) / 0.35, 0, 1); synth('move', SK.lerp(B.a[0], B.b[0], k), SK.lerp(B.a[1], B.b[1], k)); if (k >= 1) { synth('up', B.b[0], B.b[1]); B.on = false; B.next = g.t + 0.15; } return; }
      if (g.t < (B.next || 0.8)) return;
      if (wait.length) { const n0 = wait.slice().sort((p, q) => p.y - q.y || p.x - q.x)[0], near = wait.filter(n => Math.abs(n.y - n0.y) < 26).sort((p, q) => p.x - q.x);
        B.a = [near[0].x - 14, near[0].y]; B.b = [near[near.length - 1].x + 14, near[near.length - 1].y]; B.on = true; B.t0 = g.t; synth('down', B.a[0], B.a[1]); return; }
      if (s.notes.every(n => n.st === 'sack') && s.inSack.length) { synth('down', SACK[0], SACK[1] - 30); synth('up', SACK[0], SACK[1] - 30); B.next = g.t + 1; }
    },
  });
})();
