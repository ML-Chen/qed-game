// HUNT! (chem_bio MB-16) — you are a hungry bird in a sooty forest. Pale and dark moths rest on the blackened tree
// trunks. Tap every moth you can see before they fly off. Three rounds: after each, the moths you missed lay eggs and
// their young have their parents' colour. The pale ones stand out, so they get eaten; the dark ones hide, survive and
// breed, and by the third round nearly every moth is dark and hard to find. The strip at the top shows each
// generation's mix. Fill your tummy to win. No moth ever changes colour; only the mix does.
// Level 2: clean, pale birch bark instead of soot: now the dark moths stand out and pale moths take over.
(() => {
  const TRUNKS = [62, 180, 298], TW = 78, N = 10, TOP = 196, BOT = 548;
  const TARGET = [7, 9, 9];
  function sched(g) { if (g.s.S) return g.s.S; const D = Math.min(g.dur - 0.4, [10.5, 8.5, 7.4][Math.min(2, g.level)]), R = D / 3; return (g.s.S = [0, 1, 2].map(i => ({ a: 0.6 + i * R, b: 0.6 + i * R + R - 0.75 }))); }
  function place(g, darks) {
    const ms = [];
    for (const dark of darks) { let x = 0, y = 0;
      for (let k = 0; k < 24; k++) { const tr = TRUNKS[Math.floor(g.rand() * 3)]; x = tr + (g.rand() - 0.5) * (TW - 34); y = TOP + g.rand() * (BOT - TOP); if (ms.every(m => SK.dist(m.x, m.y, x, y) > 40)) break; }
      ms.push({ x, y, dark, alive: true, ang: (g.rand() - 0.5) * 0.6, born: 0 }); }
    return ms;
  }
  function paintBg(o, clean) {
    const sk = o.createLinearGradient(0, 0, 0, 640);
    if (clean) { sk.addColorStop(0, '#a8d0e8'); sk.addColorStop(0.6, '#d8ecd8'); sk.addColorStop(1, '#a8c888'); } else { sk.addColorStop(0, '#6a6470'); sk.addColorStop(0.6, '#8a8278'); sk.addColorStop(1, '#5a5a48'); }
    o.fillStyle = sk; o.fillRect(0, 0, 360, 640);
    if (!clean) { o.fillStyle = 'rgba(40,36,40,0.5)'; for (const [x, w] of [[30, 30], [110, 20]]) { o.fillRect(x, 60, w, 200); } o.fillStyle = 'rgba(80,76,80,0.35)'; for (let i = 0; i < 6; i++) { o.beginPath(); o.arc(46 + i * 9, 50 - i * 12, 12 + i * 4, 0, 7); o.fill(); } }
    const r = P.rng(clean ? 31 : 17);
    // far trees
    for (let i = 0; i < 9; i++) { o.fillStyle = clean ? 'rgba(220,228,220,0.55)' : 'rgba(50,46,46,0.5)'; o.fillRect(i * 42 + r() * 20 - 10, 120, 12, 480); }
    // the ground
    o.fillStyle = clean ? '#7aa858' : '#4a4838'; o.fillRect(0, 568, 360, 72);
    // the three big trunks
    for (const x of TRUNKS) {
      const g2 = o.createLinearGradient(x - TW / 2, 0, x + TW / 2, 0);
      if (clean) { g2.addColorStop(0, '#d8d4c8'); g2.addColorStop(0.4, '#f4f2ea'); g2.addColorStop(1, '#b8b4a8'); } else { g2.addColorStop(0, '#2a2626'); g2.addColorStop(0.4, '#4a4442'); g2.addColorStop(1, '#221e1e'); }
      o.fillStyle = g2; o.beginPath(); o.moveTo(x - TW / 2, 640); o.lineTo(x - TW / 2 + 4, 120); o.lineTo(x + TW / 2 - 4, 120); o.lineTo(x + TW / 2, 640); o.fill();
      for (let i = 0; i < 70; i++) { const px = x - TW / 2 + 6 + r() * (TW - 12), py = 130 + r() * 430;
        if (clean) { o.fillStyle = r() < 0.5 ? 'rgba(60,56,50,0.55)' : 'rgba(150,170,120,0.45)'; o.fillRect(px, py, 6 + r() * 12, 2 + r() * 2); }
        else { o.fillStyle = r() < 0.5 ? 'rgba(15,12,12,0.5)' : 'rgba(90,84,80,0.35)'; o.beginPath(); o.ellipse(px, py, 2 + r() * 5, 1.5 + r() * 3, r() * 3, 0, 7); o.fill(); } }
    }
    // the bird's perch
    o.fillStyle = clean ? '#8a6a4a' : '#3a2e26'; o.beginPath(); o.moveTo(234, 592); o.quadraticCurveTo(300, 580, 360, 588); o.lineTo(360, 598); o.quadraticCurveTo(300, 592, 234, 600); o.fill();
  }
  function moth(c, m, t, s = 1) {
    const f = 0.85 + 0.15 * Math.sin(t * 7 + m.x), col = m.dark ? '#2c2828' : '#ebe4d2', sp = m.dark ? 'rgba(120,112,104,0.6)' : 'rgba(40,36,34,0.7)';
    c.save(); c.translate(m.x, m.y); c.rotate(m.ang); c.scale(s, s);
    c.fillStyle = col; c.strokeStyle = m.dark ? 'rgba(112,102,96,0.95)' : 'rgba(120,110,96,0.9)'; c.lineWidth = 1.5;
    for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(0, -6); c.quadraticCurveTo(sd * 18 * f, -8, sd * 17 * f, 6); c.quadraticCurveTo(sd * 8, 10, 0, 6); c.closePath(); c.fill(); c.stroke(); }
    c.fillStyle = sp; for (let i = 0; i < 8; i++) { const a = B3.hash(i * 2.7 + 1), b = B3.hash(i * 5.3 + 2), sd = i % 2 ? 1 : -1; c.fillRect(sd * (3 + a * 11) * f - 1, -4 + b * 9, 2, 1.6); }
    c.fillStyle = m.dark ? '#1a1616' : '#c8bca8'; c.beginPath(); c.ellipse(0, 1, 2.6, 8, 0, 0, 7); c.fill();
    c.restore();
  }
  MG.add({
    id: 'hunt', stage: 'life', cmd: 'HUNT!', time: 6, mood: 'bright', winText: 'Selection!', failText: 'Still hungry!',
    card: { title: 'Hidden moths survive', kind: 'Biology', ref: 'Natural selection (peppered moths)',
      text: 'In the 1800s, soot from factories blackened the tree trunks near English cities. Pale peppered moths stood out on the dark bark, so birds found and ate them. Dark moths were hard to see, so more of them lived long enough to lay eggs, and their young were dark too.\n\nWithin about fifty years, most moths near the cities were dark. No moth changed its colour. Each kept the colour it was born with; only the mix in the population changed. When clean-air laws cleared the soot, pale moths became common again. This is natural selection.',
      note: 'Living things that are better at surviving have more young, and the young are like their parents, so a population changes over generations.' },
    init(g) {
      const s = g.s, clean = g.level >= 2; s.clean = clean; s.round = 0; s.eaten = 0; s.target = TARGET[Math.min(2, g.level)];
      const darks = []; for (let i = 0; i < N; i++) darks.push(i % 2 === 0); s.moths = place(g, darks); s.gens = [darks.slice()]; s.pecks = []; s.phase = 'hunt'; s.fly = 0;
    },
    down(g, x, y) {
      const s = g.s; SK.touched(g); if (g.done || s.phase !== 'hunt') return;
      const m = SK.pick(s.moths.filter(m => m.alive), x, y, 30); s.pecks.push({ x, y, t: g.t, hit: !!m });
      if (m) { m.alive = false; m.eatT = g.t; s.eaten++; g.sfx('crunch'); g.burst(m.x, m.y, m.dark ? ['#2c2828', '#6a6260'] : ['#ebe4d2', '#c8bca8'], 6, 80); } else g.sfx('tap');
    },
    update(g, dt) {
      const s = g.s, S = sched(g), R = S[s.round]; if (!R) return;
      if (s.phase === 'hunt' && (g.t >= R.b || (g.t > R.a + 0.4 && !s.moths.some(m => m.alive)))) { if (g.t < R.b) { const d = R.b - g.t; for (let i = s.round; i < 3; i++) { if (i > s.round) S[i].a -= d; S[i].b -= d; } } s.phase = 'breed'; s.fly = g.t; g.sfx('rustle');
        if (s.round < 2) { // the survivors lay eggs: each young moth has its parent's colour
          const surv = s.moths.filter(m => m.alive).map(m => m.dark); let next = [];
          if (!surv.length) next = [true, false, true]; else while (next.length < N) for (const d of surv) if (next.length < N) next.push(d);
          s.next = next; s.gens.push(next.slice());
        }
      }
      if (s.phase === 'breed' && s.round < 2 && g.t >= S[s.round + 1].a) { s.round++; s.phase = 'hunt'; const old = s.moths.filter(m => m.alive); s.moths = place(g, s.next); s.moths.forEach(m => { m.born = g.t; }); void old; g.sfx('grow'); }
      if (s.phase === 'breed' && s.round === 2 && !g.done) { if (s.eaten >= s.target) { g.win(); g.sfx('cheer'); g.sfx('tweet'); } else { g.sfx('fail'); g.fail(); } }
      if (!g.done && s.eaten >= s.target && s.round === 2 && s.phase === 'hunt' && !s.moths.some(m => m.alive)) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t;
      c.drawImage(g.bake('hunt_bg' + (s.clean ? 1 : 0), o => paintBg(o, s.clean)), 0, 0, 360, 640);
      // the moths: resting, eaten, or flying off at the end of a round; new ones flutter in
      for (const m of s.moths) {
        if (!m.alive) continue;
        if (s.phase === 'breed') { const q = (t - s.fly) * 1.6; if (q > 1) continue; c.save(); c.globalAlpha = 1 - q; moth(c, { ...m, x: m.x + Math.sin(m.y) * 60 * q, y: m.y - 160 * q }, t * 4, 1.25); c.restore(); continue; }
        const b = m.born ? SK.clamp((t - m.born) * 3, 0, 1) : 1; c.save(); c.globalAlpha = b; moth(c, m, t, 0.75 + 0.5 * b); c.restore();
      }
      for (const p of s.pecks) { const q = (t - p.t) * 4; if (q > 1) continue; c.save(); c.globalAlpha = 1 - q; c.strokeStyle = p.hit ? '#ffd45a' : 'rgba(255,255,255,0.6)'; c.lineWidth = 3; for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28; c.beginPath(); c.moveTo(p.x + Math.cos(a) * (6 + q * 10), p.y + Math.sin(a) * (6 + q * 10)); c.lineTo(p.x + Math.cos(a) * (12 + q * 16), p.y + Math.sin(a) * (12 + q * 16)); c.stroke(); } c.restore(); }
      // the generations strip: each row is one generation's mix of moths
      c.save(); c.fillStyle = 'rgba(246,242,232,0.88)'; c.beginPath(); c.roundRect(44, 126, 272, 14 + 16 * s.gens.length, 10); c.fill(); c.restore();
      s.gens.forEach((gen, r) => gen.forEach((d, i) => { c.fillStyle = d ? '#2c2828' : '#fffaf0'; c.strokeStyle = d ? '#1a1616' : '#8a7a60'; c.lineWidth = 1; const x = 64 + i * 26, y = 140 + r * 16; c.beginPath(); c.moveTo(x, y - 4); c.lineTo(x - 8, y + 4); c.lineTo(x + 8, y + 4); c.closePath(); c.fill(); c.stroke(); }));
      // the bird, its tummy filling up
      const won = g.result === 'win', lost = g.result === 'fail', full = Math.min(1, s.eaten / s.target);
      SK.animal(c, 'bird', 300, 590, 1 + 0.25 * full, { t, facing: -1, pose: won ? 'cheer' : lost ? 'sad' : s.pecks.length && t - s.pecks[s.pecks.length - 1].t < 0.2 ? 'hop' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'happy' });
      const pale = s.moths.find(m => m.alive && m.dark === s.clean); if (s.phase === 'hunt' && pale) SK.glow(c, g, pale.x, pale.y, 22, '#ffe27a', { level: 0 });
      const p0 = s.moths.find(m => m.alive && m.dark === s.clean) || s.moths[0];
      SK.demo(g, c, 'tap', [p0.x, p0.y]);
    },
    // the bot hunts like a real bird: it finds the moths that stand out first and misses some of the hidden ones
    auto(g, dt, synth) {
      const s = g.s; if (g.done || s.phase !== 'hunt' || g.t < 1.0) return; const B = s._b = s._b || { next: 1.0 };
      if (g.t < B.next) return; const S = sched(g)[s.round]; if (!S || g.t < S.a + 0.3) return;
      const alive = s.moths.filter(m => m.alive), easy = alive.filter(m => m.dark === s.clean), hid = alive.filter(m => m.dark !== s.clean);
      const m = easy[0] || (hid.length > 2 || s.round === 2 ? hid[0] : null); if (!m) return;
      synth('down', m.x, m.y); synth('up', m.x, m.y); B.next = g.t + 0.2;
    },
  });
})();
