// SPLIT THE VOTE! (policy GP-31) — a lunch vote on a meadow: a big crowd stands at the pizza flag, a smaller one at the
// tacos flag, and the flags rise on their poles to show who is ahead. The fox wants tacos and holds look-alike flags
// (pasta, ravioli). Plant them beside the pizza flag: the pizza fans spread out over the similar flags, and tacos wins
// with fewer than half the votes (the spoiler effect). Plant one beside tacos and the fox splits its own crowd.
const TAU = Math.PI * 2, BASE = 392, FOODS = ['pizza', 'tacos', 'pasta', 'ravioli', 'lasagne'];
const LEVELS = [{ pizza: 7, tacos: 4, extra: 2 }, { pizza: 7, tacos: 4, extra: 2 }, { pizza: 9, tacos: 4, extra: 3 }];
const KINDS = ['rabbit', 'hedgehog', 'frog', 'duck', 'bird', 'turtle', 'ant', 'owl', 'beaver', 'penguin'];
const HOLD = [[196, 574], [248, 566], [300, 574]]; // where the fox's spare flags wait
function paintMeadow(o) {
  P.sky(o, 360, 640, ['#7ab0d8', '#b8d8ec', '#f0f6e8'], { x: 290, y: 60, r: 22, color: '#fff2c0' });
  P.hills(o, 360, 250, 34, '#9ac878', '#7aa860', { seed: 5 });
  P.hills(o, 360, 300, 20, '#88b868', '#6a9a50', { seed: 8, freq: 0.018 });
  const gr = o.createLinearGradient(0, 300, 0, 640); gr.addColorStop(0, '#8ac068'); gr.addColorStop(1, '#5a9048'); o.fillStyle = gr; o.fillRect(0, 300, 360, 340);
  P.tree(o, 34, 300, 0.8, '#5f8f4a', 3); P.tree(o, 330, 296, 0.7, '#5f8f4a', 6);
  P.grassTufts(o, 360, 320, 630, 40, '#6aa34f', 4); P.flowers(o, 360, 330, 620, 18, undefined, 6);
  // the fox's picnic blanket at the bottom
  o.save(); o.translate(180, 572); o.fillStyle = '#e8605a'; o.beginPath(); o.ellipse(0, 0, 160, 40, 0, 0, TAU); o.fill(); o.clip();
  o.fillStyle = 'rgba(255,246,234,0.7)'; for (let i = -8; i < 8; i++) { o.fillRect(i * 24, -40, 10, 80); } o.restore();
  P.grain(o, 360, 640, 0.04); P.vignette(o, 360, 640, 0.25);
}
function food(c, kind, x, y, s = 1) { // the food picture on a flag
  c.save(); c.translate(x, y); c.scale(s, s); c.lineJoin = 'round';
  if (kind === 'pizza') { c.fillStyle = '#f0c060'; c.beginPath(); c.moveTo(-14, -10); c.lineTo(14, -10); c.lineTo(0, 16); c.closePath(); c.fill(); c.fillStyle = '#d88a3a'; c.fillRect(-15, -13, 30, 5); c.fillStyle = '#d0303a'; for (const [px, py] of [[-5, -3], [5, -2], [0, 6]]) { c.beginPath(); c.arc(px, py, 3, 0, TAU); c.fill(); } }
  else if (kind === 'tacos') { c.fillStyle = '#70c040'; c.beginPath(); c.ellipse(0, -2, 15, 7, 0, Math.PI, TAU); c.fill(); c.fillStyle = '#e04040'; c.beginPath(); c.arc(-5, -6, 3, 0, TAU); c.arc(5, -7, 3, 0, TAU); c.fill(); c.fillStyle = '#f0c040'; c.beginPath(); c.arc(0, 2, 15, Math.PI, TAU); c.lineTo(15, 4); c.lineTo(-15, 4); c.closePath(); c.fill(); c.strokeStyle = '#c8901a'; c.lineWidth = 2; c.stroke(); }
  else if (kind === 'pasta') { c.fillStyle = '#fff6ea'; c.beginPath(); c.ellipse(0, 6, 16, 8, 0, 0, Math.PI); c.fill(); c.strokeStyle = '#f0d070'; c.lineWidth = 2.5; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(-6 + i * 4, 2, 6, Math.PI, TAU); c.stroke(); } c.fillStyle = '#d0303a'; c.beginPath(); c.arc(0, -2, 5, 0, TAU); c.fill(); }
  else if (kind === 'ravioli') { for (const [px, py] of [[-7, -4], [7, -4], [0, 7]]) { c.fillStyle = '#f0d890'; c.beginPath(); c.roundRect(px - 7, py - 7, 14, 14, 3); c.fill(); c.strokeStyle = '#c8a050'; c.lineWidth = 1.5; c.setLineDash([2, 2]); c.stroke(); c.setLineDash([]); c.fillStyle = '#d0603a'; c.beginPath(); c.arc(px, py, 2.5, 0, TAU); c.fill(); } }
  else { c.fillStyle = '#e8a040'; c.fillRect(-14, -10, 28, 20); c.fillStyle = '#d0303a'; c.fillRect(-14, -4, 28, 4); c.fillStyle = '#fff2c0'; c.fillRect(-14, 3, 28, 3); }
  c.restore();
}
function flag(c, f, t, h, o = {}) { // a pole planted at (f.x, BASE), its flag raised to h px (or held, tilted, at x, y)
  const x = f.x, y = f.y, top = y - 150;
  c.save(); if (o.tilt) { c.translate(x, y); c.rotate(o.tilt); c.translate(-x, -y); }
  c.fillStyle = 'rgba(30,40,20,0.25)'; c.beginPath(); c.ellipse(x, y + 2, 12, 4, 0, 0, TAU); c.fill();
  c.strokeStyle = '#6a4a2a'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(x, top); c.stroke();
  c.fillStyle = '#f6c445'; c.beginPath(); c.arc(x, top - 3, 5, 0, TAU); c.fill();
  const fy = SK.clamp(y - 40 - h, top + 4, y - 40), wav = Math.sin(t * 5 + x) * 3;
  c.fillStyle = f.col; c.beginPath(); c.moveTo(x + 2, fy - 18); c.quadraticCurveTo(x + 26, fy - 22 + wav, x + 52, fy - 18 + wav); c.lineTo(x + 52, fy + 18 + wav); c.quadraticCurveTo(x + 26, fy + 14 - wav, x + 2, fy + 18); c.closePath(); c.fill();
  c.strokeStyle = P.shade(f.col, -0.4); c.lineWidth = 2; c.stroke(); food(c, f.kind, x + 27, fy + wav * 0.5, 0.95);
  if (o.crown) { c.save(); c.translate(x + 27, fy - 32 - Math.abs(Math.sin(t * 6)) * 4); c.fillStyle = '#f6c445'; c.strokeStyle = '#a8701a'; c.lineWidth = 2; c.beginPath(); c.moveTo(-14, 8); c.lineTo(-14, -6); c.lineTo(-7, 2); c.lineTo(0, -10); c.lineTo(7, 2); c.lineTo(14, -6); c.lineTo(14, 8); c.closePath(); c.fill(); c.stroke(); c.restore(); }
  c.restore();
}
function spot(f, k) { return [f.x + 18 + ((k % 3) - 1) * 30 + (Math.floor(k / 3) % 2) * 12, BASE + 34 + Math.floor(k / 3) * 32]; }
MG.add({
  id: 'splitvote', stage: 'policy', cmd: 'MAKE TACOS WIN THE VOTE!', time: 6, mood: 'bright', winText: 'Pizza split, tacos win!', failText: 'Pizza wins!',
  card: { title: 'Look-alikes split the vote', kind: 'Civics', ref: 'The spoiler effect in plurality voting',
    text: 'In this vote, the flag with the most fans wins, even with less than half. That rule is called plurality voting, or "first past the post."\n\nThe pizza fans were the biggest group. When similar choices joined, the pizza fans spread out across pizza, pasta and ravioli, and tacos won with a smaller crowd. A similar choice that pulls votes away like this is called a spoiler.\n\nSome places use other counting rules, such as runoffs or ranked-choice voting, partly to avoid spoilers. Each rule has its own trade-offs, and people disagree about which is best.',
    note: 'When the most votes wins, similar candidates can split their supporters and let a less popular one win.' },
  init(g) {
    const s = g.s, L = LEVELS[Math.min(2, g.level)];
    s.flags = [{ kind: 'pizza', x: 34, y: BASE, col: '#e85a4a', side: 0, planted: true }, { kind: 'tacos', x: 278, y: BASE, col: '#4ab070', side: 1, planted: true }];
    for (let i = 0; i < L.extra; i++) s.flags.push({ kind: FOODS[2 + i], x: HOLD[i][0], y: HOLD[i][1], col: ['#f0a040', '#b070d0', '#5a9ad8'][i], side: -1, planted: false, hold: i });
    s.voters = []; let n = 0;
    for (const [fi, cnt] of [[0, L.pizza], [1, L.tacos]]) for (let k = 0; k < cnt; k++) { const [x, y] = spot(s.flags[fi], k); s.voters.push({ f: fi, x, y, kind: KINDS[(n * 3 + fi) % KINDS.length], ph: g.rand() * 6, side: fi }); n++; }
    s.h = s.flags.map((f, i) => i < 2 ? (i ? L.tacos : L.pizza) * 13 : 0); s.check = 0;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done) return;
    let f = null, bd = 46; for (const q of s.flags) if (!q.planted) { const d = Math.min(SK.dist(x, y, q.x + 40, q.y - 96), SK.dist(x, y, q.x + 10, q.y - 40)); if (d < bd) { bd = d; f = q; } } if (f) { SK.dragStart(g, f, x, y); g.sfx('pop'); }
  },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, d = SK.dragEnd(g); if (!d || !d.obj || g.done) return; const f = d.obj;
    if (f.y > 500 || f.y < 300) { f.x = HOLD[f.hold][0]; f.y = HOLD[f.hold][1]; g.sfx('boing'); return; }
    f.y = BASE; f.side = f.x < 196 ? 0 : 1;
    // find the free slot nearest the drop, on the same side: pizza's side has room for three more flags, tacos' side for one
    const slots = f.side ? [222] : [88, 142, 196].filter(x => x < 222); let bx = null, bd = 1e9; for (const x of slots) if (!s.flags.some(o => o.planted && Math.abs(o.x - x) < 20) && Math.abs(x - f.x) < bd) { bd = Math.abs(x - f.x); bx = x; }
    if (bx == null) { f.x = HOLD[f.hold][0]; f.y = HOLD[f.hold][1]; g.sfx('boing'); return; }
    f.x = bx; f.planted = true; g.sfx('thud'); g.burst(f.x, BASE, ['#8a6a3a', '#a8d878'], 8, 90);
    // the fans on that side spread evenly over the similar flags there, the nearest ones walking over
    const fl = s.flags.map((q, i) => i).filter(i => s.flags[i].planted && s.flags[i].side === f.side), vs = s.voters.filter(v => v.side === f.side), per = Math.floor(vs.length / fl.length), extra = vs.length % fl.length;
    const want = fl.map((i, k) => per + (k < extra ? 1 : 0)), fi = s.flags.indexOf(f);
    // the ones nearest the new flag go to it; keep the rest where they are, filling up to the quotas
    vs.sort((a, b) => Math.abs(a.x - f.x) - Math.abs(b.x - f.x)); const take = want[fl.indexOf(fi)];
    vs.forEach((v, k) => { if (k < take) v.f = fi; });
    for (const i of fl) if (i !== fi) { const mine = vs.filter(v => v.f === i), w = want[fl.indexOf(i)]; if (mine.length > w) { const spare = mine.slice(w); const short = fl.filter(j => j !== fi && vs.filter(v => v.f === j).length < want[fl.indexOf(j)]); for (const v of spare) { const j = short.find(j => vs.filter(q => q.f === j).length < want[fl.indexOf(j)]); if (j != null) v.f = j; } } }
    s.check = g.t + 1.1; g.sfx('rustle');
  },
  update(g, dt) {
    const s = g.s;
    s.flags.forEach((f, i) => { const members = s.voters.filter(v => v.f === i); members.forEach((v, k) => { const [tx, ty] = spot(f, k); v.x += (tx - v.x) * Math.min(1, dt * 4); v.y += (ty - v.y) * Math.min(1, dt * 4); }); s.h[i] += (members.length * 13 - s.h[i]) * Math.min(1, dt * 3); });
    if (s.check && g.t >= s.check && !g.done) {
      s.check = 0; const cnt = s.flags.map((f, i) => s.voters.filter(v => v.f === i).length), best = Math.max(...cnt), top = cnt.filter(c => c === best).length;
      if (cnt[1] === best && top === 1) { g.win(); g.sfx('cheer'); g.burst(s.flags[1].x + 27, BASE - 100, ['#4ab070', '#f6c445', '#fff6ea'], 24, 200); }
      else if (s.flags.every(f => f.planted) || s.flags.some((f, i) => i >= 2 && f.planted && f.side === 1)) { s.lost = true; g.sfx('laugh'); g.fail(); }
      else g.sfx('drum'); // a tie: keep going
    }
  },
  draw(g, c) {
    const s = g.s, t = g.t;
    c.drawImage(g.bake('splitvote', paintMeadow), 0, 0, 360, 640);
    const cnt = s.flags.map((f, i) => s.voters.filter(v => v.f === i).length), best = Math.max(...cnt), lead = cnt.filter(x => x === best).length === 1 ? cnt.indexOf(best) : -1;
    const held = SK.dragging(g);
    for (const [i, f] of s.flags.entries()) if (f.planted) flag(c, f, t, s.h[i], { crown: (g.done || !s.check) && i === lead });
    // name each planted flag at the top of its pole, and the crowd
    const NAMES = { pizza: 'Pizza', tacos: 'Tacos', pasta: 'Pasta', ravioli: 'Ravioli', lasagne: 'Lasagne' };
    for (const f of s.flags) if (f.planted) { const slot = Math.round((f.x - 34) / 54); SK.tag(c, NAMES[f.kind] + ' ' + s.voters.filter(v => s.flags[v.f] === f).length, SK.clamp(f.x + 14, 40, 320), BASE - 168 - (slot % 2) * 28, 18, f.kind === 'tacos' ? '#c8f0d0' : '#fff6ea'); }
    SK.tag(c, 'Voters', 180, 524, 18);
    const vs = s.voters.slice().sort((a, b) => a.y - b.y);
    for (const v of vs) { const mine = v.f === lead; SK.animal(c, v.kind, v.x, v.y, 0.64, { t, phase: v.ph, pose: g.done && mine ? 'cheer' : 'idle', expr: g.done && mine ? 'laugh' : 'happy', facing: v.x < s.flags[v.f].x + 20 ? 1 : -1 }); }
    // the fox on the blanket with the spare flags
    const won = g.result === 'win', lost = g.result === 'fail';
    SK.animal(c, 'fox', 120, 602, 0.95, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', hold: c2 => food(c2, 'tacos', 0, -4, 1) });
    // the fox wants tacos: a thought bubble over its head
    c.save(); c.fillStyle = 'rgba(255,255,255,0.92)'; c.beginPath(); c.ellipse(70, 488, 30, 22, 0, 0, TAU); c.fill(); c.beginPath(); c.arc(96, 516, 6, 0, TAU); c.fill(); c.beginPath(); c.arc(106, 530, 3.5, 0, TAU); c.fill(); c.restore(); food(c, 'tacos', 70, 490, 1.3);
    // where a look-alike flag can go: a dashed ring by the pizza crowd
    const nf = s.flags.find(f => !f.planted); if (nf && !g.done) { const free = [88, 142, 196].find(x => !s.flags.some(o => o.planted && Math.abs(o.x - x) < 20)); if (free != null) { c.save(); c.strokeStyle = 'rgba(255,246,234,0.8)'; c.lineWidth = 3; c.setLineDash([6, 6]); c.lineDashOffset = -t * 20; c.beginPath(); c.ellipse(free, BASE, 22, 8, 0, 0, TAU); c.stroke(); c.restore(); } }
    for (const f of s.flags) if (!f.planted && f !== held) flag(c, f, t, 60, { tilt: 0.25 });
    if (held) flag(c, held, t, 60, { tilt: 0.1 });
    const nx = s.flags.find(f => !f.planted), fs = [88, 142, 196].find(x => !s.flags.some(o => o.planted && Math.abs(o.x - x) < 20));
    if (nx && !held && !g.done && fs != null) { const a = [nx.x + 40, nx.y - 96], b = [fs + 40, BASE - 96]; SK.grab(c, g, a[0], a[1], 32); SK.target(c, g, b[0], b[1], 34); SK.arrow(c, g, a[0], a[1], b[0], b[1]); SK.demo(g, c, 'drag', a, b); }
  },
  auto(g, dt, synth) {
    const s = g.s; s.flags.forEach((f, i) => { if (i < 2) return; const k = i - 2; SK.bot.drag(g, synth, 'f' + k, 1.0 + k * 1.3, [HOLD[k][0] + 40, HOLD[k][1] - 96], [110 + k * 50, BASE - 96], 0.4); });
  },
});
