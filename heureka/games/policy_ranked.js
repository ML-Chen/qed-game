// MOVE THE VOTES! (policy GP-32) — a lunch vote counted the ranked-choice way. Every ballot ranks the foods 1, 2, 3.
// The ballots stand in piles under each food, by their first choice, and a "Half" line marks a majority. Nobody passes
// it, so the smallest pile is out: its flag drops and its ballots fan out below, each showing its stickers. Drag each
// ballot onto the pile of its next choice still in the race (its glowing sticker); a ballot dropped on any other pile
// squeaks and jumps back. When a pile climbs past the Half line its flag rises and that food wins, even though another
// food had more first choices. Level 0: three foods, three ballots to move; level 1: four ballots, split two ways;
// level 2: four foods and two rounds (a ballot moved in round one can move again in round two).
const TAU = Math.PI * 2;
const FOODS = ['pizza', 'tacos', 'pasta', 'soup', 'salad'], FCOL = { pizza: '#e8563a', tacos: '#f6c445', pasta: '#b87ae8', soup: '#3a9ad8', salad: '#5ac85a' };
const CH = 21, BASE = 452, CW = 72, TRAY_Y = 566;
function paintMeadow(o) {
  P.sky(o, 360, 640, ['#7ab0d8', '#b8d8ec', '#f0f6e8']);
  P.cloud(o, 300, 150, 0.5); P.cloud(o, 60, 200, 0.4);
  P.hills(o, 360, 300, 24, '#9ac870', '#6a9a48', { seed: 8 });
  const gr = o.createLinearGradient(0, 300, 0, 640); gr.addColorStop(0, '#8ac060'); gr.addColorStop(1, '#4a7a40'); o.fillStyle = gr; o.fillRect(0, 300, 360, 340);
  o.fillStyle = 'rgba(255,255,255,0.18)'; o.beginPath(); o.roundRect(8, 520, 344, 96, 16); o.fill();
  P.flowers(o, 360, 310, 340, 20, undefined, 6); P.grassTufts(o, 360, 470, 520, 16, '#3a6a30', 2);
  P.grain(o, 360, 640, 0.03); P.vignette(o, 360, 640, 0.22);
}
function food(c, f, x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s); c.lineWidth = 1.6; c.strokeStyle = '#3a1640';
  if (f === 'pizza') { c.fillStyle = '#f6c445'; c.beginPath(); c.moveTo(-10, -8); c.lineTo(10, -8); c.lineTo(0, 11); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#c8803a'; c.fillRect(-11, -10, 22, 4); c.fillStyle = '#e8403a'; for (const [px, py] of [[-4, -3], [4, -2], [0, 3]]) { c.beginPath(); c.arc(px, py, 2.2, 0, TAU); c.fill(); } }
  else if (f === 'tacos') { c.fillStyle = '#f6c445'; c.beginPath(); c.arc(0, 4, 11, Math.PI, 0); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#5ac85a'; c.fillRect(-8, -4, 16, 3); c.fillStyle = '#e8403a'; c.fillRect(-6, -6, 4, 3); c.fillRect(2, -6, 4, 3); }
  else if (f === 'pasta') { c.fillStyle = '#fff6ea'; c.beginPath(); c.arc(0, 0, 11, 0, Math.PI); c.closePath(); c.fill(); c.stroke(); c.strokeStyle = '#f0c040'; c.lineWidth = 2; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(-4 + i * 4, -2, 4, Math.PI, 0); c.stroke(); } c.fillStyle = '#e8403a'; c.beginPath(); c.arc(2, -4, 2.5, 0, TAU); c.fill(); }
  else if (f === 'soup') { c.fillStyle = '#3a9ad8'; c.beginPath(); c.arc(0, 0, 11, 0, Math.PI); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#e8803a'; c.fillRect(-9, -2, 18, 3); c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 1.5; for (const sx of [-4, 3]) { c.beginPath(); c.moveTo(sx, -5); c.quadraticCurveTo(sx + 3, -9, sx, -13); c.stroke(); } }
  else { c.fillStyle = '#5ac85a'; c.beginPath(); c.arc(0, 0, 11, 0, Math.PI); c.closePath(); c.fill(); c.stroke(); for (const [px, py, col] of [[-5, -3, '#3a9a3a'], [3, -4, '#8ae85a'], [0, -6, '#e8403a']]) { c.fillStyle = col; c.beginPath(); c.arc(px, py, 3.5, 0, TAU); c.fill(); } }
  c.restore();
}
function setup(g) {
  const s = g.s, v = SK.variant(g, 4), L = Math.min(2, g.level), names = SK.shuffled(g, FOODS);
  const nC = L >= 2 ? 4 : 3, roles = names.slice(0, nC); // roles[0] = most first choices, [1] = the eventual winner, [2], [3] = knocked out
  const [A, B, C, D] = [0, 1, 2, 3], bl = [];
  const add = (n, ranks) => { for (let i = 0; i < n; i++) bl.push({ ranks: ranks.slice() }); };
  if (L === 0) { add(6, [A, C, B]); add(4, [B, C, A]); add(3, [C, B, A]); }
  else if (L === 1) { add(6, [A, C, B]); add(5, [B, C, A]); add(3, [C, B, A]); add(1, [C, A, B]); }
  else { add(6, [A, C, B]); add(5, [B, A, C]); add(2, [C, B, A]); add(1, [C, A, B]); add(1, [D, C, B]); add(1, [D, B, A]); }
  const order = SK.shuffled(g, [...Array(nC).keys()]); order.unshift(...order.splice(order.indexOf(v % nC), 1)); // column order varies; a different role leads off each play
  s.cands = roles.map((f, i) => ({ f, x: 0, out: false, outAt: 0, i })); const xs = nC === 3 ? [70, 180, 290] : [50, 137, 223, 310]; order.forEach((ci, k) => { s.cands[ci].x = xs[k]; });
  s.ballots = bl.map(b => ({ ranks: b.ranks, col: b.ranks[0], st: 'pile', x: 0, y: 0 })); s.N = bl.length; s.round = 0; s.ph = 'count'; s.at = g.t; s.winner = -1;
}
const count = (s, ci) => s.ballots.filter(b => b.col === ci && b.st !== 'tray' && b.st !== 'drag' && b.st !== 'back').length;
const nextChoice = (s, b) => b.ranks.find(r => !s.cands[r].out);
function pileTop(s, ci) { return BASE - count(s, ci) * CH; }
function eliminate(g) { const s = g.s; let lo = null; for (const c0 of s.cands) { if (c0.out) continue; if (!lo || count(s, c0.i) < count(s, lo.i)) lo = c0; } lo.out = true; lo.outAt = g.t; g.sfx('drum');
  const moving = s.ballots.filter(b => b.col === lo.i); moving.forEach((b, k) => { b.st = 'tray'; b.hx = moving.length > 1 ? SK.lerp(92, 316, k / (moving.length - 1)) : 200; b.hy = TRAY_Y; b.x = lo.x; b.y = BASE - k * CH; b.fx = b.x; b.fy = b.y; b.at = g.t; }); s.ph = 'move'; s.round++; }
function card(c, s, b, x, y, big, t) {
  const w = big ? 74 : CW - 6, h = big ? 52 : CH - 3; c.save(); c.translate(x, y);
  c.fillStyle = 'rgba(30,20,30,0.25)'; c.beginPath(); c.roundRect(-w / 2 + 2, -h / 2 + 3, w, h, 5); c.fill();
  c.fillStyle = '#fff6ea'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 5); c.fill(); c.strokeStyle = '#8a7a6a'; c.lineWidth = 1.5; c.stroke();
  if (!big) { food(c, s.cands[b.col].f, 0, 0, 0.78); c.restore(); return; }
  const nx = nextChoice(s, b);
  b.ranks.forEach((r, k) => { const sx = -23 + k * 23, out = s.cands[r].out, isNext = r === nx;
    if (isNext) { c.fillStyle = 'rgba(90,220,120,0.45)'; c.beginPath(); c.arc(sx, 2, 14 + Math.sin(t * 6) * 1.5, 0, TAU); c.fill(); }
    food(c, s.cands[r].f, sx, 4, 0.86); c.globalAlpha = 1;
    c.fillStyle = isNext ? '#2a9a4a' : '#5a4a6a'; c.beginPath(); c.arc(sx + 9, -14, 7, 0, TAU); c.fill(); c.fillStyle = '#fff6ea'; c.font = '900 11px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(k + 1), sx + 9, -13.5);
    if (out) { c.strokeStyle = '#e8403a'; c.lineWidth = 3; c.beginPath(); c.moveTo(sx - 9, -6); c.lineTo(sx + 9, 12); c.stroke(); } });
  c.restore();
}
MG.add({
  id: 'movevotes', stage: 'policy', cmd: 'MOVE EACH BALLOT TO ITS NEXT CHOICE!', time: 8, mood: 'bright', winText: 'A majority!', failText: 'No winner yet!',
  card: { title: 'Ranked-choice counting', kind: 'Civics', ref: 'Instant-runoff (ranked-choice) voting',
    text: 'Each voter ranked the foods: 1 for the favourite, then 2, then 3. First, every ballot counts for its number 1. A food needs more than half of all the ballots to win.\n\nWhen nobody had more than half, the food with the fewest votes was knocked out. Its ballots moved to each voter\'s next choice that was still in the race. That repeats until one food passes half.\n\nThe winner was not the food with the most first choices, because more voters ranked it above the leader. People disagree about it: some like that votes move instead of being wasted, others find it harder to count.',
    note: 'In ranked-choice voting, the last-place choice is knocked out and its ballots move to their next choice, until one has more than half.' },
  init(g) { setup(g); },
  down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.ph !== 'move') return; const b = s.ballots.find(q => q.st === 'tray' && Math.abs(q.x - x) < 44 && Math.abs(q.y - y) < 34); if (b) { b.st = 'drag'; SK.dragStart(g, b, x, y); g.sfx('tap'); } },
  move(g, x, y) { SK.dragMove(g, x, y); },
  up(g) {
    const s = g.s, r = SK.dragEnd(g); if (!r || !r.obj) return; const b = r.obj; if (b.st !== 'drag') return;
    const tgt = s.cands.find(c0 => !c0.out && Math.abs(b.x - c0.x) < 40 && b.y < BASE + 30 && b.y > pileTop(s, c0.i) - 90);
    if (tgt && tgt.i === nextChoice(s, b)) { b.col = tgt.i; b.st = 'land'; b.at = g.t; b.fx = b.x; b.fy = b.y; g.sfx('pop'); }
    else { b.st = 'back'; b.at = g.t; b.fx = b.x; b.fy = b.y; g.sfx(tgt ? 'wrong' : 'boing'); if (tgt) s.squeak = { x: tgt.x, t: g.t }; }
  },
  update(g, dt) {
    const s = g.s;
    if (s.ph === 'count' && g.t - s.at > 1.2) eliminate(g);
    for (const b of s.ballots) {
      if (b.st === 'tray' && b.at != null) { const k = SK.easeInOut((g.t - b.at) / 0.6); b.x = SK.lerp(b.fx, b.hx, k); b.y = SK.lerp(b.fy, b.hy, k); if (k >= 1) b.at = null; }
      if (b.st === 'back') { const k = SK.easeOut((g.t - b.at) / 0.25); b.x = SK.lerp(b.fx, b.hx, k); b.y = SK.lerp(b.fy, b.hy, k); if (k >= 1) { b.st = 'tray'; b.at = null; } }
      if (b.st === 'land' && g.t - b.at > 0.18) { b.st = 'pile'; g.sfx('click'); }
    }
    if (s.ph === 'move' && s.winner < 0) { for (const c0 of s.cands) if (!c0.out && count(s, c0.i) * 2 > s.N) { s.winner = c0.i; s.wonAt = g.t; g.sfx('cheer'); if (!g.done) g.win(); } }
    if (s.ph === 'move' && s.winner < 0 && s.ballots.every(b => b.st === 'pile')) { s.ph = 'count'; s.at = g.t - 0.5; }
  },
  draw(g, c) {
    const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', halfY = BASE - (s.N / 2) * CH;
    c.drawImage(g.bake('movevotes', paintMeadow), 0, 0, 360, 640);
    // the Half line: more ballots than this wins
    c.save(); c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.setLineDash([10, 7]); c.beginPath(); c.moveTo(14, halfY); c.lineTo(346, halfY); c.stroke(); c.restore(); SK.tag(c, 'Half', 34, halfY - 16, 18);
    for (const c0 of s.cands) {
      const n = count(s, c0.i), top = BASE - n * CH, outK = c0.out ? SK.clamp((t - c0.outAt) / 0.4, 0, 1) : 0, win = s.winner === c0.i;
      // the pile of ballots
      for (const b of s.ballots) if (b.col === c0.i && (b.st === 'pile' || b.st === 'land')) { const k = s.ballots.filter(q => q.col === c0.i && (q.st === 'pile' || q.st === 'land')).indexOf(b); const ty = BASE - k * CH - CH / 2; if (b.st === 'land') { const q = SK.clamp((t - b.at) / 0.18, 0, 1); card(c, s, b, SK.lerp(b.fx, c0.x, q), SK.lerp(b.fy, ty, q), false, t); } else card(c, s, b, c0.x, ty, false, t); }
      // its flag on a pole beside the pile (rises with the pile; falls when knocked out)
      const fy = SK.lerp(top - 18, BASE + 10, outK) - (win ? 30 + Math.sin(t * 6) * 4 : 0);
      c.strokeStyle = '#6a4a2a'; c.lineWidth = 3; c.beginPath(); c.moveTo(c0.x - CW / 2 + 2, BASE + 8); c.lineTo(c0.x - CW / 2 + 2, fy - 22); c.stroke();
      c.save(); c.translate(c0.x - CW / 2 + 2, fy - 22); c.rotate(outK * 1.2); c.fillStyle = c0.out ? '#8a8a8a' : FCOL[c0.f]; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(18, 4 + Math.sin(t * 5 + c0.i) * 3, 34, 2); c.lineTo(34, 22); c.quadraticCurveTo(18, 24 + Math.sin(t * 5 + c0.i) * 3, 0, 22); c.closePath(); c.fill(); c.strokeStyle = '#3a1640'; c.lineWidth = 1.5; c.stroke(); food(c, c0.f, 17, 11, 0.6); c.restore();
      // the food's badge at the foot of its pile
      c.fillStyle = c0.out ? 'rgba(80,80,80,0.6)' : 'rgba(30,14,36,0.72)'; c.beginPath(); c.roundRect(c0.x - 26, BASE + 6, 52, 30, 15); c.fill(); food(c, c0.f, c0.x, BASE + 22, 1.15);
      if (c0.out && outK > 0.5) SK.tag(c, 'Out', c0.x, BASE - 20, 18, '#ffd0d0'); if (win) SK.tag(c, 'Winner!', c0.x, top - 70, 18, '#b8ffc8');
    }
    if (s.squeak && t - s.squeak.t < 0.6) SK.tag(c, 'Not its next!', s.squeak.x, BASE + 60, 18, '#ffd0d0');
    // the knocked-out ballots in the tray, big, with their 1-2-3 stickers
    for (const b of s.ballots) if (b.st === 'tray' || b.st === 'back') card(c, s, b, b.x, b.y, true, t);
    for (const b of s.ballots) if (b.st === 'drag') card(c, s, b, b.x, b.y, true, t);
    SK.animal(c, 'ant', 30, 608, 0.55, { t, pose: won ? 'cheer' : 'idle', expr: won ? 'laugh' : lost ? 'sad' : 'think', facing: -1 });
    // guidance: the first ballot in the tray, the pile of its next choice, and the arrow between
    const b = s.ph === 'move' && !g.done ? s.ballots.find(q => q.st === 'tray' && q.at == null) : null;
    if (b && !SK.dragging(g)) { const tc = s.cands[nextChoice(s, b)], ty = pileTop(s, tc.i) - 16; SK.grab(c, g, b.x, b.y, 40); SK.target(c, g, tc.x, ty, 0, { w: CW + 4, h: 34 }); SK.arrow(c, g, b.x, b.y, tc.x, ty); SK.demo(g, c, 'drag', [b.x, b.y], [tc.x, ty]); }
    else SK.demo(g, c, 'drag', [0, 0], [1, 1], { never: true });
  },
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < 1.0) return;
    if (s._bt) { if (SK.bot.drag(g, synth, s._bt.key, s._bt.t, s._bt.a, s._bt.b, 0.3)) s._bt = null; return; }
    if (s.ph !== 'move') return; const b = s.ballots.find(q => q.st === 'tray' && q.at == null); if (!b) return; const tc = s.cands[nextChoice(s, b)]; s._bn = (s._bn || 0) + 1;
    s._bt = { key: 'v' + s._bn, t: g.t + 0.1, a: [b.x, b.y], b: [tc.x, pileTop(s, tc.i) - 16] };
  },
});
