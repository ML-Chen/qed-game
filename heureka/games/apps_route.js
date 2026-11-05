// ROUTE! (cs WB-08) — a map with two towers and a river between them. A message (a word) is chopped into numbered
// packets that arrive one by one at your router tower. Three roads cross the river to the far tower. Tap a working road to send each packet: packets take different
// roads, arrive out of order and click back together into the word by their numbers. The storm cloud drifts from
// bridge to bridge and knocks out whichever bridge it is over, so send each packet down a road whose bridge will still
// be standing when the packet gets there. Send one onto the broken bridge
// and it tumbles into the river: the word has a hole until the packet is sent again. Level 0: four packets; level 1:
// five; level 2: six, and one road is jammed with slow traffic (a snail crawls along it).
(() => {
  const R = [52, 404], D = [308, 404], ROADS = [[180, 150], [180, 404], [180, 660]], SPEED = 300, SLOW = 70;
  const WORDS = [['FROG', 'HOME', 'CAKE', 'STAR'], ['HELLO', 'PIZZA', 'MOUSE', 'PARTY'], ['ROCKET', 'GARDEN', 'PLANET', 'CASTLE']];
  const STORM = [{ dw: 3.0, gl: 0.8 }, { dw: 2.4, gl: 0.7 }, { dw: 2.0, gl: 0.6 }];
  // where the storm is (0, 1, 2 = over the top, middle, bottom bridge, in between while it drifts) at time t
  function stormF(s, t) { const P0 = STORM[s.L], per = P0.dw + P0.gl, q = Math.max(0, t) / per, i = Math.floor(q), ph = (q - i) * per, a = s.seq[i % s.seq.length], b = s.seq[(i + 1) % s.seq.length]; return ph < P0.dw ? a : SK.lerp(a, b, SK.easeInOut((ph - P0.dw) / P0.gl)); }
  function brokenAt(s, t) { const f = stormF(s, t), r = Math.round(f); return Math.abs(f - r) < 0.45 ? r : -1; }
  const at = (i, k) => { const C = ROADS[i], a = (1 - k) * (1 - k), b = 2 * (1 - k) * k, d = k * k; return [a * R[0] + b * C[0] + d * D[0], a * R[1] + b * C[1] + d * D[1]]; };
  const len = i => { let L = 0, p = at(i, 0); for (let k = 1; k <= 20; k++) { const q = at(i, k / 20); L += Math.hypot(q[0] - p[0], q[1] - p[1]); p = q; } return L; };
  function paintMap(o) {
    o.fillStyle = '#9ad07a'; o.fillRect(0, 0, 360, 640); const r = P.rng(4);
    for (let i = 0; i < 60; i++) { o.fillStyle = r() < 0.5 ? 'rgba(60,120,40,0.18)' : 'rgba(255,255,200,0.15)'; o.beginPath(); o.ellipse(r() * 360, 220 + r() * 420, 8 + r() * 16, 4 + r() * 6, 0, 0, 7); o.fill(); }
    // the river, running top to bottom between the towers
    o.fillStyle = '#4aa0d0'; o.beginPath(); o.moveTo(150, 220); o.bezierCurveTo(130, 330, 214, 430, 168, 640); o.lineTo(222, 640); o.bezierCurveTo(262, 430, 178, 330, 206, 220); o.closePath(); o.fill();
    o.strokeStyle = 'rgba(255,255,255,0.5)'; o.lineWidth = 2; for (let i = 0; i < 12; i++) { const y = 240 + i * 34, x = 176 + Math.sin(i) * 14; o.beginPath(); o.moveTo(x - 8, y); o.lineTo(x + 8, y); o.stroke(); }
    // the roads: sandy tracks
    for (let i = 0; i < 3; i++) { o.strokeStyle = '#c8a060'; o.lineWidth = 26; o.lineCap = 'round'; o.beginPath(); o.moveTo(...R); o.quadraticCurveTo(...ROADS[i], ...D); o.stroke(); o.strokeStyle = '#e8c888'; o.lineWidth = 18; o.stroke(); o.strokeStyle = 'rgba(255,255,255,0.6)'; o.lineWidth = 2; o.setLineDash([8, 10]); o.stroke(); o.setLineDash([]); }
    for (const [x, y, s] of [[40, 560, 0.7], [320, 260, 0.6], [300, 600, 0.8], [30, 250, 0.55]]) P.tree(o, x, y, s);
  }
  function tower(c, x, y, col, t, flash) {
    SK.shadow(c, x + 4, y + 30, 30, 8, 0.3);
    c.fillStyle = '#5a5a7a'; c.beginPath(); c.moveTo(x - 22, y + 30); c.lineTo(x - 12, y - 54); c.lineTo(x + 12, y - 54); c.lineTo(x + 22, y + 30); c.closePath(); c.fill(); c.strokeStyle = '#2a2a40'; c.lineWidth = 2; c.stroke();
    c.strokeStyle = '#8a8aaa'; c.lineWidth = 2; for (let k = 0; k < 4; k++) { const yy = y + 20 - k * 18; c.beginPath(); c.moveTo(x - 20 + k * 2.4, yy); c.lineTo(x + 20 - k * 2.4, yy - 18); c.moveTo(x + 20 - k * 2.4, yy); c.lineTo(x - 20 + k * 2.4, yy - 18); c.stroke(); }
    c.fillStyle = col; c.beginPath(); c.arc(x, y - 60, 10, 0, 7); c.fill(); c.strokeStyle = '#fff6ea'; c.lineWidth = 2; c.stroke();
    const p = (t * 1.5) % 1; c.strokeStyle = `rgba(255,255,255,${(1 - p) * (flash ? 1 : 0.6)})`; c.lineWidth = 2.5; for (const s of [-1, 1]) { c.beginPath(); c.arc(x, y - 60, 14 + p * 16, s > 0 ? -0.7 : Math.PI - 0.7, s > 0 ? 0.7 : Math.PI + 0.7); c.stroke(); }
  }
  function bridge(c, i, broken, slow, t) {
    const [x, y] = at(i, 0.5), [x1, y1] = at(i, 0.52), a = Math.atan2(y1 - y, x1 - x);
    c.save(); c.translate(x, y); c.rotate(a);
    if (!broken) { c.fillStyle = '#8a5a30'; c.fillRect(-34, -15, 68, 30); c.fillStyle = '#b07a44'; for (let k = -30; k < 32; k += 9) c.fillRect(k, -13, 6, 26); c.fillStyle = '#5a3418'; c.fillRect(-34, -17, 68, 4); c.fillRect(-34, 13, 68, 4); }
    else { c.fillStyle = '#8a5a30'; c.save(); c.rotate(0.35); c.fillRect(-36, -13, 22, 26); c.restore(); c.save(); c.rotate(-0.3); c.fillRect(14, -13, 22, 26); c.restore(); c.fillStyle = '#4aa0d0'; c.fillRect(-12, -18, 24, 36); }
    c.restore();
    if (broken) { const [sx, sy] = at(i, 0.5);
      SK.tag(c, 'Broken', sx + (i === 1 ? 0 : 0), sy + 32, 18, '#fff6ea', 'rgba(200,40,40,0.92)'); }
    if (slow) { const [sx, sy] = at(i, 0.3); SK.tag(c, 'Slow', sx - 6, sy + (i === 2 ? 30 : -30), 18, '#3a1640', 'rgba(255,212,90,0.95)'); }
  }
  function snail(c, x, y, t) { c.save(); c.translate(x, y); c.fillStyle = '#e8c890'; c.beginPath(); c.ellipse(4, 4, 12, 4, 0, 0, 7); c.fill(); const sg = c.createRadialGradient(0, -4, 1, 0, -2, 9); sg.addColorStop(0, '#f0a0c0'); sg.addColorStop(1, '#b0507a'); c.fillStyle = sg; c.beginPath(); c.arc(0, -2, 8, 0, 7); c.fill(); c.strokeStyle = '#6a2a4a'; c.lineWidth = 1.2; c.beginPath(); c.arc(0, -2, 4, 0, 5); c.stroke(); c.strokeStyle = '#8a6a3a'; c.beginPath(); c.moveTo(13, 2); c.lineTo(16, -6); c.stroke(); c.restore(); }
  // a road whose bridge is standing now and will still stand when a packet sent now gets there (the quick roads first)
  function safeRoad(s, t) { for (const i of [1, 0, 2].filter(i => i !== s.slow).concat(s.slow >= 0 ? [s.slow] : [])) { const tt = 0.47 / ((i === s.slow ? SLOW : SPEED) / len(i)); let ok = true; for (let d = 0; d <= tt + 0.15; d += 0.05) if (brokenAt(s, t + d) === i) ok = false; if (ok) return i; } return 1; }
  function nextPacket(g) { const s = g.s; if (s.queue.length) { s.cur = { n: s.queue.shift(), born: g.t }; } else s.cur = null; }
  MG.add({
    id: 'route', stage: 'apps', cmd: 'SEND EVERY PACKET ACROSS!', time: 7, mood: 'party', winText: 'Message complete!', failText: 'Message lost!',
    card: { title: 'Messages travel in packets', kind: 'Computer science', ref: 'Packet switching (how the internet moves data)',
      text: 'The internet does not send a message in one piece. It chops it into small packets, and gives each packet a number.\n\nMachines called routers pass each packet along whichever road works at that moment. Packets from one message can take different roads and arrive out of order. The far end puts them back together by their numbers.\n\nIf a road breaks, the routers send packets another way. A lost packet leaves a hole in the message until it is sent again.',
      note: 'Data travels as numbered packets that can take different paths and are put back together at the end.' },
    init(g) {
      const s = g.s; s.L = Math.min(2, g.level); s.v = SK.variant(g, 4); s.word = WORDS[s.L][s.v]; s.n = s.word.length;
      s.queue = []; for (let i = 0; i < s.n; i++) s.queue.push(i); s.got = []; s.fly = []; s.lost = []; s.seq = [Math.floor(g.rand() * 3)]; for (let i = 1; i < 40; i++) { let b = Math.floor(g.rand() * 2); const p0 = s.seq[i - 1]; s.seq.push(b >= p0 ? b + 1 : b); } s.sends = 0;
      s.slow = s.L === 2 ? Math.floor(g.rand() * 3) : -1; s.cur = null; s.nextAt = 0.6; s.hole = null;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || !s.cur || g.t - s.cur.born < 0.2) return;
      let best = -1, bd = 40; for (let i = 0; i < 3; i++) for (let k = 0.12; k <= 0.88; k += 0.04) { const [px, py] = at(i, k), d = Math.hypot(px - x, py - y); if (d < bd) { bd = d; best = i; } }
      if (best < 0) return;
      s.fly.push({ n: s.cur.n, road: best, k: 0, st: 'go', sp: (best === s.slow ? SLOW : SPEED) / len(best) }); s.cur = null; s.nextAt = g.t + 0.25; s.sends++; g.sfx('swoosh'); g.sfx('tap');
    },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      const br = brokenAt(s, g.t); if (br !== s.lastBr) { if (br >= 0) g.sfx('thunder', { vol: 0.3 }); s.lastBr = br; }
      if (!s.cur && g.t >= s.nextAt && s.queue.length) { nextPacket(g); g.sfx('pop', { pitch: 1.2 }); }
      for (const f of s.fly) {
        if (f.st === 'go') { const k0 = f.k; f.k += f.sp * dt; if (k0 < 0.47 && f.k >= 0.47 && f.road === brokenAt(s, g.t)) { f.st = 'fall'; f.ft = g.t; f.xy = at(f.road, 0.47); g.sfx('splash'); g.sfx('laugh', { vol: 0.5 }); s.hole = { n: f.n, t: g.t }; }
          if (f.k >= 1) { f.st = 'arrive'; f.at = g.t; g.sfx('ding', { pitch: 1 + f.n * 0.08 }); } }
        else if (f.st === 'fall' && g.t - f.ft > 0.9) { f.st = 'gone'; s.queue.unshift(f.n); s.resent = { n: f.n, t: g.t }; }
        else if (f.st === 'arrive' && g.t - f.at > 0.35) { f.st = 'gone'; s.got.push(f.n); if (s.hole && s.hole.n === f.n) s.hole = null; g.sfx('click'); }
      }
      s.fly = s.fly.filter(f => f.st !== 'gone');
      if (s.got.length >= s.n && !s.fly.length) { g.win(); g.sfx('cheer'); g.burst(180, 166, ['#ffd45a', '#fff6ea', '#7ee8a0'], 24, 180); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('route_map', paintMap), 0, 0, 360, 640);
      const brk = brokenAt(s, t); for (let i = 0; i < 3; i++) bridge(c, i, i === brk, i === s.slow, t);
      { const f = stormF(s, t), i0 = Math.floor(SK.clamp(f, 0, 1.999)), k = f - i0, [ax, ay] = at(i0, 0.5), [bx, by] = at(i0 + 1, 0.5); const cx = SK.lerp(ax, bx, k), cy = SK.lerp(ay, by, k) - 46; c.save(); c.globalAlpha = 0.95; P.cloud(c, cx - 14, cy, 0.5); P.cloud(c, cx + 16, cy + 4, 0.42); c.fillStyle = 'rgba(70,70,100,0.55)'; c.beginPath(); c.ellipse(cx, cy + 6, 40, 14, 0, 0, 7); c.fill(); c.restore();
        if (brk >= 0 && Math.sin(t * 9) > 0.3) { const [lx, ly] = at(brk, 0.5); c.strokeStyle = '#ffe27a'; c.lineWidth = 3.5; c.beginPath(); c.moveTo(lx - 4, ly - 34); c.lineTo(lx + 8, ly - 18); c.lineTo(lx - 2, ly - 14); c.lineTo(lx + 8, ly + 2); c.stroke(); } }
      if (s.slow >= 0) for (let k = 0; k < 3; k++) { const [x, y] = at(s.slow, ((t * 0.04 + k / 3) % 1) * 0.8 + 0.1); snail(c, x, y - 4, t); }
      tower(c, R[0], R[1], '#ffd45a', t, !!s.cur); tower(c, D[0], D[1], '#7ee8a0', t, false);
      SK.tag(c, 'Router', R[0] + 6, R[1] + 52, 18); SK.tag(c, 'Server', D[0] - 6, D[1] + 52, 18);
      // the word, rebuilt from packets by their numbers
      const n = s.n, tw = 40, x0 = 180 - (n - 1) * (tw + 6) / 2; c.save(); c.fillStyle = 'rgba(30,14,36,0.75)'; c.beginPath(); c.roundRect(x0 - tw / 2 - 12, 132, (n - 1) * (tw + 6) + tw + 24, 70, 16); c.fill(); c.restore();
      for (let i = 0; i < n; i++) { const x = x0 + i * (tw + 6), have = s.got.includes(i), hole = s.hole && s.hole.n === i;
        c.fillStyle = have ? '#fff6ea' : hole ? `rgba(255,90,80,${0.5 + 0.4 * Math.sin(t * 8)})` : 'rgba(255,255,255,0.14)'; c.beginPath(); c.roundRect(x - tw / 2, 140, tw, 42, 8); c.fill();
        if (have) N5.text(c, s.word[i], x, 162, 26, '#3a1640', { lw: 0 }); else N5.text(c, String(i + 1), x, 162, 18, hole ? '#fff6ea' : 'rgba(255,255,255,0.55)', { lw: 0 });
        N5.text(c, String(i + 1), x + tw / 2 - 6, 194, 12, 'rgba(255,255,255,0.7)', { lw: 0 }); }
      // packets on the roads, falling in the river, or flying up into their places
      for (const f of s.fly) {
        if (f.st === 'go') { const [x, y] = at(f.road, f.k); N5.envelope(c, x, y - 6, 42, { col: '#fff6ea', text: String(f.n + 1) }); }
        else if (f.st === 'fall') { const k = SK.clamp((t - f.ft) / 0.6, 0, 1); c.save(); c.globalAlpha = 1 - k * 0.8; N5.envelope(c, f.xy[0], f.xy[1] - 6 + k * 40, 34 * (1 - k * 0.4), { col: '#fff6ea', text: String(f.n + 1), rot: k * 3 }); c.restore();
          c.strokeStyle = `rgba(255,255,255,${1 - k})`; c.lineWidth = 2; c.beginPath(); c.ellipse(f.xy[0], f.xy[1] + 20, 8 + k * 26, 3 + k * 7, 0, 0, 7); c.stroke(); }
        else if (f.st === 'arrive') { const k = SK.easeInOut((t - f.at) / 0.35), tx = x0 + f.n * (tw + 6); N5.envelope(c, SK.lerp(D[0], tx, k), SK.lerp(D[1] - 6, 162, k), 34, { col: '#fff6ea', text: String(f.n + 1) }); }
      }
      // the packet waiting at the router
      if (s.cur) { const b = Math.abs(Math.sin((t - s.cur.born) * 5)) * 5; N5.envelope(c, R[0] + 8, R[1] - 96 - b, 46, { col: '#fff6ea', text: String(s.cur.n + 1), seal: null }); if (s.resent && s.resent.n === s.cur.n && t - s.resent.t < 1.6) SK.tag(c, 'Resend', R[0] + 30, R[1] - 130, 18, '#fff6ea', 'rgba(200,40,40,0.9)'); }
      SK.animal(c, 'fox', 318, 560, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : s.hole ? 'idle' : 'idle', expr: won ? 'laugh' : s.hole || lost ? 'wow' : 'happy', facing: -1 });
      // guidance: tap a road whose bridge is standing (the quickest one)
      if (s.cur && !g.done) { const i = safeRoad(s, g.t), [x, y] = at(i, 0.3);
        SK.glow(c, g, x, y, 30); SK.demo(g, c, 'tap', [x, y + 4], null); }
    },
    // the bot sends each packet down a road with a standing bridge
    auto(g, dt, synth) {
      const s = g.s; if (g.done || !s.cur || g.t - s.cur.born < 0.35) return; const i = safeRoad(s, g.t), [x, y] = at(i, 0.3); if (brokenAt(s, g.t + 0.47 / ((i === s.slow ? SLOW : SPEED) / len(i))) === i) return;
      synth('down', x, y); synth('up', x, y);
    },
  });
})();
