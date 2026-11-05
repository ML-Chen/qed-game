// SPLIT THEM EVENLY, HATS AND ALL! (business SV-16, a fair A/B test) — the fox is testing two versions of its sign-up
// page: Version A (a blue button) behind the left door and Version B (a green button) behind the right. Visitors walk
// down the path to a fork; some wear party hats (eager people who sign up for almost anything). Tap to flip the switch
// at the fork: each visitor goes the way it points. Under each door, a tally counts the hats and the plain visitors who
// went in. When everyone is through, each door's sign-up meter fills. If both doors got the same mix, the meters
// compare only the buttons: a fair test. Send the hats mostly one way and that door "wins" because of who walked in.
// Level 1: more visitors, faster. Level 2: smaller hats, faster still.
(() => {
  const FORK = { x: 180, y: 380 }, DOOR = [{ x: 70, y: 520 }, { x: 290, y: 520 }], TOP = 206;
  const LV = [{ n: 10, every: 1.5, walk: 1.8, hat: 1 }, { n: 12, every: 1.35, walk: 1.6, hat: 1 }, { n: 12, every: 0.8, walk: 1.2, hat: 0.6 }];
  const SEQ = ['HHPPHPPPHH', 'PHHHPPHPPH', 'HPPHHHPPPH', 'PPHHPHHPHP', 'HHHPPPHPPH'];
  const KINDS = ['rabbit', 'frog', 'penguin', 'duck', 'hedgehog', 'bird', 'turtle', 'beaver'];
  const RATE = { H: 0.8, P: 0.3 }, LIFT = [0, 0.08]; // what really happens: hats sign up far more; the green button helps a little
  function paintPark(o) {
    const sky = o.createLinearGradient(0, 0, 0, 300); sky.addColorStop(0, '#88b8e0'); sky.addColorStop(1, '#fff4e0'); o.fillStyle = sky; o.fillRect(0, 0, 360, 640);
    P.hills(o, 360, 250, 40, '#8ab060', '#5a8040', { seed: 5 });
    const gr = o.createLinearGradient(0, 240, 0, 640); gr.addColorStop(0, '#9ad070'); gr.addColorStop(1, '#6aa048'); o.fillStyle = gr; o.fillRect(0, 240, 360, 400);
    // the path: down the middle, then forking to the two doors
    o.strokeStyle = '#e8d0a0'; o.lineWidth = 46; o.lineCap = 'round'; o.beginPath(); o.moveTo(FORK.x, TOP - 20); o.lineTo(FORK.x, FORK.y); o.stroke();
    for (const d of DOOR) { o.beginPath(); o.moveTo(FORK.x, FORK.y); o.quadraticCurveTo((FORK.x + d.x) / 2, FORK.y + 10, d.x, d.y - 30); o.stroke(); } o.lineCap = 'butt';
    P.flowers(o, 360, 260, 600, 22, undefined, 7); P.grassTufts(o, 360, 260, 610, 20, '#4a8a38', 9);
    // the two doors, with their buttons on the sign
    for (let i = 0; i < 2; i++) { const d = DOOR[i]; o.fillStyle = '#e8e0f0'; o.fillRect(d.x - 50, d.y - 70, 100, 90); o.fillStyle = '#5a3a6a'; o.beginPath(); o.moveTo(d.x - 58, d.y - 70); o.lineTo(d.x, d.y - 104); o.lineTo(d.x + 58, d.y - 70); o.closePath(); o.fill();
      o.fillStyle = '#6a4a3a'; o.fillRect(d.x - 18, d.y - 40, 36, 60); o.fillStyle = i ? '#4ac060' : '#4a8ae0'; o.beginPath(); o.roundRect(d.x - 30, d.y - 64, 60, 18, 9); o.fill(); o.strokeStyle = '#fff6ea'; o.lineWidth = 2; o.stroke(); }
  }
  function hat(c, x, y, s, t) { c.save(); c.translate(x, y); c.scale(s, s); c.rotate(-0.15); c.fillStyle = '#ff5a8a'; c.strokeStyle = '#8a1a4a'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-9, 0); c.lineTo(0, -24); c.lineTo(9, 0); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#ffe27a'; for (const [dx, dy] of [[-3, -6], [2, -12], [-1, -17]]) { c.beginPath(); c.arc(dx, dy, 2, 0, 7); c.fill(); } c.fillStyle = '#fff6ea'; c.beginPath(); c.arc(0, -25, 3, 0, 7); c.fill(); c.restore(); }
  MG.add({
    id: 'splitfair', stage: 'startups', cmd: 'SPLIT THEM EVENLY, HATS AND ALL!', time: 8, mood: 'party', winText: 'A fair test!', failText: 'Not a fair test!', hold: 1.9,
    card: { title: 'A fair test', kind: 'Startups', ref: 'Randomised A/B testing',
      text: 'To learn which version of a page works better, companies show version A to some visitors and version B to others, then compare how many sign up. This is an A/B test.\n\nIt is only fair if both groups are alike. Eager visitors sign up for almost anything. If more of them go to one version, that version looks better even if its button is no better at all.\n\nSo real tests send each visitor to A or B at random. With enough visitors, both groups get the same mix, and any difference left comes from the page itself.',
      note: 'A fair test splits people so both groups have the same mix; then any difference is caused by what you changed.' },
    init(g) {
      const s = g.s, L = Math.min(2, g.level);
      s.v = SK.variant(g, 5); s.L = L; s.lv = LV[L]; let q = SEQ[s.v]; while (q.length < s.lv.n) q += SEQ[(s.v + 2) % 5]; s.seq = q.slice(0, s.lv.n);
      s.sw = 0; s.vis = []; s.sent = 0; s.tally = [{ H: 0, P: 0 }, { H: 0, P: 0 }]; s.next = 0.9; s.phase = 'run'; s.flipT = -9;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.phase !== 'run') return; s.sw = 1 - s.sw; s.flipT = g.t; g.sfx('click'); },
    // the side that keeps both doors' mix even for a visitor of type k
    fair(s, k) { const T = s.tally, pend = [0, 1].map(i => s.vis.filter(v => v.side === i && v.k === k && !v.in).length); const a = T[0][k] + pend[0], b = T[1][k] + pend[1]; if (a !== b) return a < b ? 0 : 1; const ta = T[0].H + T[0].P, tb = T[1].H + T[1].P; return ta <= tb ? 0 : 1; },
    nextUp(s) { return s.vis.filter(v => v.side == null).sort((a, b) => b.y - a.y)[0]; },
    update(g, dt) {
      const s = g.s, lv = s.lv;
      if (g.done) return;
      if (s.sent < lv.n && g.t >= s.next) { s.vis.push({ k: s.seq[s.sent], kind: KINDS[(s.sent + s.v) % KINDS.length], y: TOP, x: FORK.x, side: null, p: 0, in: false, i: s.sent }); s.sent++; s.next = g.t + lv.every; }
      const sp = (FORK.y - TOP) / lv.walk;
      for (const v of s.vis) {
        if (v.in) continue;
        if (v.side == null) { v.y += sp * dt; if (v.y >= FORK.y) { v.y = FORK.y; v.side = s.sw; g.sfx('pop', { vol: 0.4 }); } }
        else { v.p = Math.min(1, v.p + dt / 0.7); const d = DOOR[v.side], m = v.p; v.x = SK.lerp(FORK.x, d.x, m); v.y = SK.lerp(FORK.y, d.y - 30, m) + Math.sin(m * Math.PI) * 10; if (v.p >= 1) { v.in = true; s.tally[v.side][v.k]++; g.sfx(v.k === 'H' ? 'tweet' : 'tap', { vol: 0.4 }); } }
      }
      if (s.sent >= lv.n && s.vis.every(v => v.in)) {
        const T = s.tally, fair = Math.abs(T[0].H - T[1].H) <= 1 && Math.abs(T[0].P - T[1].P) <= 1;
        s.phase = 'result'; s.pt = g.t; s.fairOK = fair;
        if (fair) { g.win(); g.sfx('cheer'); } else { g.fail(); g.sfx('laugh'); }
      }
    },
    draw(g, c) {
      const s = g.s, t = g.t, lv = s.lv, res = s.phase === 'result';
      c.drawImage(g.bake('n7park', paintPark), 0, 0, 360, 640);
      SK.tag(c, 'Version A', DOOR[0].x, DOOR[0].y - 122, 18, '#fff6ea', 'rgba(50,100,190,0.92)'); SK.tag(c, 'Version B', DOOR[1].x, DOOR[1].y - 122, 18, '#fff6ea', 'rgba(40,150,70,0.92)');
      // the tallies under each door: hats and plain visitors who went in
      for (let i = 0; i < 2; i++) { const d = DOOR[i], T = s.tally[i]; c.fillStyle = 'rgba(30,14,36,0.6)'; c.beginPath(); c.roundRect(d.x - 62, d.y + 26, 124, 56, 12); c.fill();
        for (let j = 0; j < T.H; j++) hat(c, d.x - 48 + j * 16, d.y + 52, 0.8, t); for (let j = 0; j < T.P; j++) { c.fillStyle = '#e8e0d0'; c.strokeStyle = '#5a4a5a'; c.lineWidth = 1.5; c.beginPath(); c.arc(d.x - 48 + j * 16, d.y + 68, 6, 0, 7); c.fill(); c.stroke(); }
        const other = s.tally[1 - i], off = T.H - other.H > 1 || T.P - other.P > 1; if (off && !g.done) { c.strokeStyle = '#e8503a'; c.lineWidth = 3; c.beginPath(); c.roundRect(d.x - 62, d.y + 26, 124, 56, 12); c.stroke(); } }
      // the result: each door's sign-up meter
      if (res) { const k = SK.easeOut(Math.min(1, (t - s.pt) / 0.8));
        for (let i = 0; i < 2; i++) { const T = s.tally[i], n = T.H + T.P, rate = n ? (T.H * (RATE.H + LIFT[i]) + T.P * (RATE.P + LIFT[i])) / n : 0, d = DOOR[i];
          c.fillStyle = 'rgba(30,14,36,0.6)'; c.beginPath(); c.roundRect(d.x - 16, 200, 32, 120, 10); c.fill(); const h = 112 * rate * k; c.fillStyle = i ? '#4ac060' : '#4a8ae0'; c.beginPath(); c.roundRect(d.x - 12, 316 - h, 24, h, 8); c.fill(); }
        SK.tag(c, 'Sign-ups', 180, 214, 18); }
      // the visitors
      for (const v of s.vis) { if (v.in) continue; const walk = v.side != null || v.y < FORK.y;
        SK.animal(c, v.kind, v.x, v.y, 0.72, { t, phase: v.i, pose: walk ? 'walk' : 'idle', expr: v.k === 'H' ? 'laugh' : 'happy', facing: v.side === 0 ? -1 : 1,
          hold: null }); if (v.k === 'H') hat(c, v.x + (v.side === 0 ? 2 : -2), v.y - 46, 0.9 * lv.hat, t); }
      // the switch at the fork
      const ang = s.sw ? 0.7 : -0.7, fl = t - s.flipT < 0.1 ? 1 : 0;
      c.fillStyle = '#5a3a2a'; c.beginPath(); c.roundRect(FORK.x - 26, FORK.y + 20, 52, 18, 6); c.fill();
      c.save(); c.translate(FORK.x, FORK.y + 28); c.rotate(ang); c.strokeStyle = '#c8c8d4'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -40 - fl * 4); c.stroke(); c.restore();
      SK.ball(c, FORK.x + Math.sin(ang) * 40, FORK.y + 28 - Math.cos(ang) * 40, 11, '#e8503a');
      c.save(); c.fillStyle = 'rgba(255,246,234,0.9)'; c.translate(FORK.x + (s.sw ? 46 : -46), FORK.y + 52); c.scale(s.sw ? 1 : -1, 1); c.beginPath(); c.moveTo(-14, -6); c.lineTo(2, -6); c.lineTo(2, -13); c.lineTo(16, 0); c.lineTo(2, 13); c.lineTo(2, 6); c.lineTo(-14, 6); c.closePath(); c.fill(); c.restore();
      SK.tag(c, 'Switch', FORK.x, FORK.y + 72, 18);
      SK.animal(c, 'fox', 330, 300, 0.75, { t, facing: -1, pose: g.result === 'win' ? 'cheer' : g.result === 'fail' ? 'sad' : 'idle', expr: g.result === 'win' ? 'laugh' : g.result === 'fail' ? 'sad' : 'happy' });
      if (!g.done) SK.tag(c, 'Visitors ' + Math.min(s.sent, lv.n) + ' / ' + lv.n, 270, 160, 18);
      // guidance: flip the switch when it points the unfair way for the next visitor
      const nv = this.nextUp(s), need = nv && !g.done && this.fair(s, nv.k) !== s.sw;
      if (need) SK.glow(c, g, FORK.x, FORK.y + 10, 40);
      SK.demo(g, c, 'tap', [FORK.x + 4, FORK.y + 14], null, { never: !need, delay: 0.5, period: 0.8 });
    },
    auto(g, dt, synth) { const s = g.s; if (g.done) return; const nv = this.nextUp(s); if (!nv || FORK.y - nv.y > 120) return; if (this.fair(s, nv.k) !== s.sw && g.t - s.flipT > 0.15) { synth('down', FORK.x, FORK.y); synth('up', FORK.x, FORK.y); } },
  });
})();
