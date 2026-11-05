// PASS IT ON! (chem_bio EL-09) — a sunny meadow. A glowing dot of the Sun's energy sits in the Sun. Drag it down the
// food chain: into the grass (it grows green), on to the rabbit that eats the grass (it munches and hops), on to the fox
// that eats the rabbit (it eats and naps). The dot shrinks at every step, because each living thing uses most of the
// energy it gets just to live. Skip a step and it will not go: the rabbit only sniffs the sunbeam and stays hungry, so
// the dot slides back. Then a second chain: Sun, leaf, caterpillar, bird. Level 2: each chain ends at a mushroom that
// turns the leftovers back into soil.
(() => {
  const CHAINS = [
    [{ k: 'sun', x: 64, y: 176 }, { k: 'grass', x: 118, y: 330 }, { k: 'rabbit', x: 226, y: 410 }, { k: 'fox', x: 290, y: 540 }],
    [{ k: 'sun', x: 64, y: 176 }, { k: 'leaf', x: 286, y: 262 }, { k: 'caterpillar', x: 186, y: 352 }, { k: 'bird', x: 84, y: 520 }],
  ];
  const MUSH = [{ k: 'mushroom', x: 186, y: 556 }, { k: 'mushroom', x: 210, y: 560 }];
  const NAME = { sun: 'Sun', grass: 'Grass', rabbit: 'Rabbit', fox: 'Fox', leaf: 'Leaf', caterpillar: 'Caterpillar', bird: 'Bird', mushroom: 'Mushroom' };
  function chain(g, i) { const c = CHAINS[i].map(n => ({ ...n })); if (g.level >= 2) c.push({ ...MUSH[i] }); return c; }
  function paintBg(o) {
    P.sky(o, 360, 640, ['#7ec8ea', '#c0e6f2', '#fff4dc'], null);
    P.hills(o, 360, 300, 26, '#a8d870', '#80b850', { seed: 6 });
    const gr = o.createLinearGradient(0, 300, 0, 640); gr.addColorStop(0, '#9ad468'); gr.addColorStop(1, '#5a9a3c'); o.fillStyle = gr; o.fillRect(0, 312, 360, 328);
    // the tree whose leaf feeds the caterpillar
    o.fillStyle = '#7a5030'; o.beginPath(); o.moveTo(318, 470); o.lineTo(306, 300); o.quadraticCurveTo(300, 270, 270, 250); o.lineTo(276, 244); o.quadraticCurveTo(306, 258, 318, 282); o.lineTo(330, 470); o.fill();
    o.fillStyle = '#4a9a3a'; for (const [x, y, r] of [[300, 220, 46], [262, 214, 30], [336, 236, 30], [310, 186, 30]]) { o.beginPath(); o.arc(x, y, r, 0, 7); o.fill(); }
    o.fillStyle = 'rgba(255,255,255,0.15)'; o.beginPath(); o.arc(290, 200, 22, 0, 7); o.fill();
    P.grassTufts(o, 360, 330, 620, 30, '#4f8a38', 12); P.flowers(o, 360, 360, 610, 10, undefined, 4);
  }
  function node(c, n, t, fed, g) {
    const x = n.x, y = n.y, k = fed ? SK.easeOut(Math.min(1, (t - fed) * 2)) : 0;
    if (n.k === 'sun') { const r = 30 + Math.sin(t * 2) * 1.5; B3.glow(c, x, y, 90, '255,220,120', 0.5); c.fillStyle = '#ffe070'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = '#ffd040'; c.lineWidth = 4; c.lineCap = 'round'; for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28 + t * 0.3; c.beginPath(); c.moveTo(x + Math.cos(a) * (r + 6), y + Math.sin(a) * (r + 6)); c.lineTo(x + Math.cos(a) * (r + 16), y + Math.sin(a) * (r + 16)); c.stroke(); } }
    if (n.k === 'grass') { const col = P.mix('#a8a058', '#3aa030', k), h = 30 + k * 18; c.fillStyle = col; for (let i = 0; i < 9; i++) { const bx = x - 28 + i * 7, lean = Math.sin(t * 2 + i) * 3 + (1 - k) * (i - 4) * 2; c.beginPath(); c.moveTo(bx - 3, y + 14); c.quadraticCurveTo(bx + lean, y + 14 - h * 0.6, bx + lean * 2, y + 14 - h * (0.7 + 0.3 * B3.hash(i))); c.lineTo(bx + 3, y + 14); c.fill(); } }
    if (n.k === 'leaf') { c.save(); c.translate(x, y); c.rotate(-0.4 + Math.sin(t * 1.5) * 0.06); c.fillStyle = P.mix('#b8c060', '#3aa030', k); c.strokeStyle = '#2a6a20'; c.lineWidth = 2; c.beginPath(); c.moveTo(-24, 0); c.quadraticCurveTo(0, -18 - k * 4, 24, 0); c.quadraticCurveTo(0, 18 + k * 4, -24, 0); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-24, 0); c.lineTo(22, 0); c.stroke(); c.restore(); }
    if (n.k === 'caterpillar') { const s = 1 + k * 0.3; for (let i = 0; i < 6; i++) { const bx = x - 24 * s + i * 9 * s, by = y + Math.sin(t * 6 + i) * 2 - (fed && i % 2 ? 2 : 0); c.fillStyle = i === 5 ? '#4aa030' : i % 2 ? '#7ac850' : '#6ab840'; c.beginPath(); c.arc(bx, by, 8 * s, 0, 7); c.fill(); } c.fillStyle = '#2a1424'; c.beginPath(); c.arc(x + 23 * s, y - 2, 2.2, 0, 7); c.fill(); }
    if (n.k === 'rabbit' || n.k === 'fox' || n.k === 'bird') { const nap = n.k === 'fox' && fed && t - fed > 0.8;
      SK.animal(c, n.k, x, y + 26 - (fed && !nap ? Math.abs(Math.sin((t - fed) * 8)) * 10 * Math.max(0, 1 - (t - fed)) : 0), n.k === 'bird' ? 1.1 : 0.95, { t, facing: n.k === 'fox' ? -1 : 1, pose: fed ? (nap ? 'idle' : 'hop') : 'idle', expr: nap ? 'laugh' : fed ? 'laugh' : n.sniff && t - n.sniff < 1 ? 'sad' : 'wow' });
      if (nap) { c.fillStyle = '#fff6ea'; c.font = '900 18px Nunito, sans-serif'; c.textAlign = 'center'; for (let i = 0; i < 2; i++) { const q = (t * 0.6 + i * 0.5) % 1; c.globalAlpha = 1 - q; c.fillText('z', x + 26 + q * 14, y - 30 - q * 20); } c.globalAlpha = 1; } }
    if (n.k === 'mushroom') { const s = 0.7 + k * 0.4; c.fillStyle = '#7a5030'; c.beginPath(); c.ellipse(x, y + 10, 34, 7, 0, 0, 7); c.fill(); c.fillStyle = '#f4e8d0'; c.fillRect(x - 5 * s, y - 14 * s + 10, 10 * s, 14 * s); c.fillStyle = '#c87a4a'; c.beginPath(); c.ellipse(x, y - 14 * s + 10, 18 * s, 12 * s, 0, Math.PI, 0); c.fill(); if (fed) { c.fillStyle = 'rgba(90,60,30,0.6)'; for (let i = 0; i < 8; i++) c.fillRect(x - 30 + B3.hash(i) * 60, y + 6 + B3.hash(i * 2) * 6, 3, 3); } }
  }
  MG.add({
    id: 'passiton', stage: 'life', cmd: 'PASS THE ENERGY DOWN THE CHAIN!', time: 6, mood: 'bright', winText: 'The energy fed everyone!', failText: 'Still hungry!',
    card: { title: 'Energy flows along a food chain', kind: 'Biology', ref: 'Food chains and energy flow',
      text: 'Almost all the energy for life on land starts in the Sun. Plants catch sunlight and use it to make food. A rabbit gets that energy by eating the grass, and a fox gets it by eating the rabbit. That line of who eats whom is a food chain.\n\nAt every step most of the energy is used up just living: moving, breathing and keeping warm. Only about a tenth is passed on, so there is less and less to share. A rabbit cannot eat sunlight; it needs the plant in between. Mushrooms and other decomposers break down leftovers and return them to the soil.',
      note: 'Energy passes from the Sun to plants to plant-eaters to meat-eaters, and a lot is used up at each step.' },
    init(g) { const s = g.s; s.ci = 0; s.ch = chain(g, 0); s.at = 0; s.dot = { x: s.ch[0].x, y: s.ch[0].y }; s.drag = false; s.fed = {}; s.next = 0; s.r = 14; },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.next) return; if (SK.dist(x, y, s.dot.x, s.dot.y) < 50) { s.drag = true; s.dot.x = x; s.dot.y = y; } },
    move(g, x, y) {
      const s = g.s; if (!s.drag || g.done) return; s.dot.x = x; s.dot.y = y;
      for (let j = s.at + 1; j < s.ch.length; j++) { const n = s.ch[j]; if (SK.dist(x, y, n.x, n.y) > 40) continue;
        if (j === s.at + 1) { s.at = j; n.fedT = g.t; s.r = 14 * Math.pow(0.72, j); g.sfx(n.k === 'grass' || n.k === 'leaf' ? 'grow' : n.k === 'mushroom' ? 'rustle' : 'munch'); if (n.k === 'bird') g.sfx('tweet'); g.burst(n.x, n.y, ['#ffe070', '#fff6ea'], 8, 90); }
        else if (!n.sniff || g.t - n.sniff > 0.6) { n.sniff = g.t; s.drag = false; s.back = g.t; g.sfx('wrong'); } // it cannot eat this: the dot slides back
        break; }
      if (s.at === s.ch.length - 1) { s.drag = false; s.next = g.t; }
    },
    up(g) { const s = g.s; if (s.drag) { s.drag = false; s.back = g.t; } },
    update(g, dt) {
      const s = g.s; if (g.done) return;
      const home = s.ch[s.at]; if (!s.drag && !s.next) { s.dot.x += (home.x - s.dot.x) * Math.min(1, dt * 10); s.dot.y += (home.y - s.dot.y) * Math.min(1, dt * 10); }
      if (s.next && g.t - s.next > 1.0) {
        if (s.ci + 1 < CHAINS.length) { s.done = s.done || []; s.done.push(s.ch); s.ci++; s.ch = chain(g, s.ci); s.at = 0; s.dot = { x: s.ch[0].x, y: s.ch[0].y }; s.r = 14; s.next = 0; g.sfx('sparkle'); }
        else { g.win(); g.sfx('cheer'); }
      }
    },
    draw(g, c) {
      const s = g.s, t = g.t;
      c.drawImage(g.bake('passiton_bg', paintBg), 0, 0, 360, 640);
      const show = s.ch;
      // arrows along the links already passed
      for (let j = 1; j <= s.at; j++) { const a = show[j - 1], b = show[j]; c.save(); c.strokeStyle = 'rgba(255,224,112,0.9)'; c.lineWidth = 5; c.lineCap = 'round'; c.setLineDash([10, 8]); c.lineDashOffset = -t * 40; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); c.restore(); }
      for (const n of show) node(c, n, t, n.fedT, g);
      for (const n of show) if (n.k !== 'sun') SK.tag(c, NAME[n.k], n.x, n.y + (n.k === 'grass' ? 34 : n.k === 'leaf' ? 30 : n.k === 'caterpillar' ? 26 : n.k === 'mushroom' ? 30 : 44), 18);
      // the energy dot, smaller after every step
      if (!s.next || t - s.next < 0.6) { const r = s.r * (s.next ? 1 - (t - s.next) / 0.6 : 1) + Math.sin(t * 8) * 1.2; B3.glow(c, s.dot.x, s.dot.y, r * 3.2, '255,230,120', 0.7); c.fillStyle = '#fff8c8'; c.beginPath(); c.arc(s.dot.x, s.dot.y, Math.max(1, r), 0, 7); c.fill(); }
      const nx = show[s.at + 1]; if (nx && !s.drag) { SK.glow(c, g, s.dot.x, s.dot.y, 30); c.save(); c.globalAlpha = 0.5; c.setLineDash([6, 8]); c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.beginPath(); c.arc(nx.x, nx.y, 34, 0, 7); c.stroke(); c.restore(); }
      for (let i = 0; i < CHAINS.length; i++) { const x = 24 + i * 22, y = 604, d = i < s.ci || (i === s.ci && s.next); c.fillStyle = d ? '#ffe070' : 'rgba(255,255,255,0.5)'; c.beginPath(); c.arc(x, y, 7, 0, 7); c.fill(); }
      SK.demo(g, c, 'drag', [s.dot.x, s.dot.y], nx ? [nx.x, nx.y] : [180, 400], { never: !nx || !!s.next });
    },
    // the bot carries the dot from node to node
    auto(g, dt, synth) {
      const s = g.s; const B = s._b = s._b || {}; if (s.next) { if (B.on) { synth('up', s.dot.x, s.dot.y); B.on = false; } return; } if (g.done || g.t < 1.0) return;
      if (!B.on) { B.on = true; B.t0 = g.t; B.ci = s.ci; synth('down', s.dot.x, s.dot.y); return; }
      if (B.ci !== s.ci) { B.on = false; return; }
      const k = (g.t - B.t0) / 0.25, j = Math.min(s.ch.length - 1, Math.floor(k) + 1), a = s.ch[j - 1], b = s.ch[j], f = Math.min(1, k - (j - 1));
      synth('move', SK.lerp(a.x, b.x, f), SK.lerp(a.y, b.y, f));
      if (s.next) { synth('up', b.x, b.y); B.on = false; }
    },
  });
})();
