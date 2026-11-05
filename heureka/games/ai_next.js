// NEXT! (cs AI-02) — "The cat sat on the ..." and a prize wheel of possible next words, each slice as big as the chance
// a language model gives that word: mat is huge, moon is a sliver. Tap to stop the wheel; the word it lands on joins the
// sentence, the picture changes, and a new wheel appears for the word after that. Land on a sliver and the cat ends up
// on the moon. A language model writes by picking the next word again and again from a list of likely next words.
const WEIRD = new Set(['moon', 'banana', 'exploded', 'spoon', 'pizza', 'sock']);
const NEXTS = { // after the words so far: [word, chance]; the odd word's chance is set per level (WEIRD_P) and the rest share what is left
  start: [['mat', 0.52], ['sofa', 0.27], ['floor', 0.21], ['moon', 0]],
  place: [['and', 0.64], ['all', 0.36], ['banana', 0]],
  and: [['purred', 0.62], ['slept', 0.38], ['exploded', 0]],
  all: [['day', 0.66], ['night', 0.34], ['spoon', 0]],
  verb: [['softly', 0.66], ['again', 0.34], ['pizza', 0]],
  time: [['long', 0.75], ['.', 0.25], ['sock', 0]],
};
const WEIRD_P = [0.08, 0.12, 0.15];
const SLICE = ['#ff9a5a', '#5ac8e8', '#b48ae8', '#ffd45a', '#7ed88a', '#ff7ab0'];
const WX = 180, WY = 484, WR = 112, STOP = 0.38; // the wheel, and how long it takes to coast to a stop
function nextKey(s) { // which list of chances comes after the words picked so far
  const w = s.words, n = w.length; if (n === 0) return 'start'; if (n === 1) return 'place'; if (n === 2) return w[1] === 'and' ? 'and' : 'all'; return w[1] === 'and' ? 'verb' : 'time';
}
function startWheel(g) {
  const s = g.s; s.key = nextKey(s); s.slices = []; let a = 0; for (const [w, p0] of NEXTS[s.key]) { const p = WEIRD.has(w) ? s.wp : p0 * (1 - s.wp); s.slices.push({ w, a0: a, a1: a + p * Math.PI * 2, weird: WEIRD.has(w) }); a += p * Math.PI * 2; }
  s.th = g.rand() * Math.PI * 2; s.state = 'spin'; s.wt = g.t;
}
function landed(s, th) { // the slice under the pointer (straight up) when the wheel's turn is th
  let a = (-Math.PI / 2 - th) % (Math.PI * 2); if (a < 0) a += Math.PI * 2; return s.slices.find(sl => a >= sl.a0 && a < sl.a1) || s.slices[0];
}
function paintNextRoom(o) {
  const w = o.createLinearGradient(0, 0, 0, 640); w.addColorStop(0, '#3a2a5a'); w.addColorStop(0.45, '#5a3a6a'); w.addColorStop(1, '#2a1a3a'); o.fillStyle = w; o.fillRect(0, 0, 360, 640);
  // a soft lamp glow behind the wheel and dots of light
  const gl = o.createRadialGradient(WX, WY, 20, WX, WY, 220); gl.addColorStop(0, 'rgba(255,200,140,0.35)'); gl.addColorStop(1, 'rgba(255,200,140,0)'); o.fillStyle = gl; o.fillRect(0, 240, 360, 400);
  const rnd = P.rng(3); for (let i = 0; i < 40; i++) { o.fillStyle = `rgba(255,230,200,${0.08 + rnd() * 0.2})`; o.beginPath(); o.arc(rnd() * 360, 330 + rnd() * 300, 1 + rnd() * 2.5, 0, 7); o.fill(); }
  // the wheel's stand
  o.fillStyle = '#6a4a3a'; o.beginPath(); o.moveTo(WX - 16, WY); o.lineTo(WX - 40, 616); o.lineTo(WX + 40, 616); o.lineTo(WX + 16, WY); o.closePath(); o.fill();
  o.fillStyle = '#4a3028'; o.beginPath(); o.roundRect(WX - 60, 606, 120, 14, 6); o.fill();
}
function sceneCat(c, s, t, x, y) { // the picture of the sentence: where the cat is and what it is doing
  const w = s.words, place = w[0], end = w[w.length - 1], last = s.lastAt != null ? t - s.lastAt : 9;
  c.save(); c.beginPath(); c.roundRect(20, 214, 320, 116, 16); c.clip();
  const night = place === 'moon' || end === 'night';
  const bg = c.createLinearGradient(0, 214, 0, 330); bg.addColorStop(0, night ? '#1a1a4a' : '#ffe8c8'); bg.addColorStop(1, night ? '#3a2a6a' : '#f8caa0'); c.fillStyle = bg; c.fillRect(20, 214, 320, 116);
  if (night) { const r = P.rng(9); c.fillStyle = '#fff'; for (let i = 0; i < 24; i++) { c.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i)); c.beginPath(); c.arc(24 + r() * 312, 218 + r() * 100, 1.2, 0, 7); c.fill(); } c.globalAlpha = 1; }
  else { c.fillStyle = '#c89a78'; c.fillRect(20, 300, 320, 30); c.fillStyle = '#fff6ea'; c.beginPath(); c.roundRect(40, 228, 60, 46, 4); c.fill(); c.fillStyle = '#9ad8f0'; c.fillRect(44, 232, 52, 38); }
  if (end === 'day' || w[2] === 'day') { c.fillStyle = '#ffd040'; c.beginPath(); c.arc(70, 250, 14, 0, 7); c.fill(); }
  // the place
  if (place === 'mat') { c.fillStyle = '#e8564a'; c.beginPath(); c.ellipse(x, y + 2, 62, 11, 0, 0, 7); c.fill(); c.strokeStyle = '#ffd45a'; c.lineWidth = 2; c.setLineDash([5, 4]); c.beginPath(); c.ellipse(x, y + 2, 52, 7, 0, 0, 7); c.stroke(); c.setLineDash([]); }
  if (place === 'sofa') { c.fillStyle = '#5a8ad8'; c.beginPath(); c.roundRect(x - 80, y - 52, 160, 44, 14); c.fill(); c.fillStyle = '#4a74c0'; c.beginPath(); c.roundRect(x - 92, y - 22, 184, 30, 12); c.fill(); c.fillStyle = '#3a5aa0'; c.fillRect(x - 84, y + 8, 10, 8); c.fillRect(x + 74, y + 8, 10, 8); y -= 18; }
  if (place === 'floor') { c.fillStyle = '#b07a52'; c.fillRect(20, y - 2, 320, 40); c.strokeStyle = 'rgba(80,40,20,0.4)'; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(20 + i * 60, y - 2); c.lineTo(i * 60, 330); c.stroke(); } }
  if (place === 'moon') { const k = Math.min(1, last * 2); y -= 12; c.fillStyle = '#f4ecc8'; c.beginPath(); c.arc(x, y + 66 - k * 10, 70, 0, 7); c.fill(); c.fillStyle = '#d8ccA0'; c.beginPath(); c.arc(x - 30, y + 30, 10, 0, 7); c.arc(x + 34, y + 44, 7, 0, 7); c.fill(); y -= k * 8; }
  if (['banana', 'spoon', 'pizza', 'sock'].includes(end)) { const k = Math.min(1, last * 3), bx = x + 70, by = y - 20 - (1 - k) * 80; c.save(); c.translate(bx, by); c.rotate(-0.5 + Math.sin(t * 3) * 0.1);
    if (end === 'pizza') { c.fillStyle = '#f0c060'; c.strokeStyle = '#a0602a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-26, -60); c.lineTo(26, -60); c.lineTo(0, 0); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#e8463a'; [[-8, -48], [8, -44], [0, -24]].forEach(([a, b]) => { c.beginPath(); c.arc(a, b, 5, 0, 7); c.fill(); }); }
    else if (end === 'sock') { c.fillStyle = '#7ac0ff'; c.strokeStyle = '#3a6aa0'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-8, -64); c.lineTo(10, -64); c.lineTo(10, -20); c.quadraticCurveTo(10, -4, -10, -4); c.lineTo(-22, -4); c.quadraticCurveTo(-30, -14, -20, -22); c.lineTo(-8, -26); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#fff'; c.fillRect(-8, -60, 18, 6); }
    else if (end === 'banana') { c.fillStyle = '#ffe040'; c.strokeStyle = '#a88a10'; c.lineWidth = 2.5; c.beginPath(); c.arc(0, -30, 38, 0.6, 2.4); c.arc(0, -42, 34, 2.3, 0.7, true); c.closePath(); c.fill(); c.stroke(); }
    else { c.fillStyle = '#c8d0e0'; c.strokeStyle = '#6a7080'; c.lineWidth = 2.5; c.beginPath(); c.ellipse(0, -30, 14, 20, 0, 0, 7); c.fill(); c.stroke(); c.fillRect(-3, -12, 6, 40); c.strokeRect(-3, -12, 6, 40); }
    c.restore(); }
  // the cat
  const weird = s.fail, puff = end === 'exploded' ? Math.min(1, last * 3) : 0, sleepy = ['slept', 'night', 'purred', 'softly', 'again'].includes(end) || w[2] === 'slept' || w[2] === 'night';
  c.save(); c.translate(x, y); const sc = 1 + puff * 0.35; c.scale(sc, sc);
  c.fillStyle = 'rgba(40,20,30,0.2)'; c.beginPath(); c.ellipse(0, 0, 26, 5, 0, 0, 7); c.fill();
  c.strokeStyle = '#d07a2c'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(14, -6); c.quadraticCurveTo(34, -8, 30 + Math.sin(t * 3) * 4, -30); c.stroke();
  c.fillStyle = '#f09a4a'; c.beginPath(); c.ellipse(0, -18, 20 + puff * 6, 19 + puff * 6, 0, 0, 7); c.fill();
  if (puff) { c.strokeStyle = '#f09a4a'; c.lineWidth = 3; for (let i = 0; i < 14; i++) { const a = i / 14 * 6.28; c.beginPath(); c.moveTo(Math.cos(a) * 22, -18 + Math.sin(a) * 22); c.lineTo(Math.cos(a) * 30, -18 + Math.sin(a) * 30); c.stroke(); } }
  c.beginPath(); c.arc(0, -46, 16, 0, 7); c.fill(); c.beginPath(); c.moveTo(-14, -52); c.lineTo(-12, -68); c.lineTo(-3, -60); c.moveTo(14, -52); c.lineTo(12, -68); c.lineTo(3, -60); c.fill();
  c.fillStyle = '#fff1e0'; c.beginPath(); c.ellipse(0, -40, 8, 5, 0, 0, 7); c.fill();
  c.strokeStyle = '#3a2028'; c.fillStyle = '#3a2028'; c.lineWidth = 2;
  if (weird) { for (const sd of [-1, 1]) { c.fillStyle = '#fff'; c.beginPath(); c.arc(sd * 6, -49, 5.5, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#3a2028'; c.beginPath(); c.arc(sd * 6, -49, 2, 0, 7); c.fill(); } c.beginPath(); c.arc(0, -38, 3, 0, 7); c.stroke(); }
  else if (sleepy || s.won) { for (const sd of [-1, 1]) { c.beginPath(); c.arc(sd * 6, -48, 3.5, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); } c.beginPath(); c.moveTo(-3, -41); c.quadraticCurveTo(0, -38, 3, -41); c.stroke(); }
  else { for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * 6, -49, 2.4, 3.4, 0, 0, 7); c.fill(); } c.beginPath(); c.moveTo(-3, -41); c.quadraticCurveTo(0, -38, 3, -41); c.stroke(); }
  c.fillStyle = 'rgba(255,110,130,0.4)'; c.beginPath(); c.ellipse(-11, -42, 3.5, 2, 0, 0, 7); c.ellipse(11, -42, 3.5, 2, 0, 0, 7); c.fill();
  c.restore();
  if (weird) { c.save(); c.globalAlpha = Math.min(1, last * 3); SK.tag(c, '?!', x + 34, y - 74, 22); c.restore(); }
  else if (end === 'purred') { c.fillStyle = '#ff6a8a'; for (let i = 0; i < 3; i++) { const q = (t * 0.8 + i / 3) % 1; c.globalAlpha = 1 - q; c.font = '900 18px Nunito, system-ui'; c.fillText('♥', x + 24 + i * 6, y - 60 - q * 30); } c.globalAlpha = 1; }
  else if (end === 'slept' || end === 'night' || end === 'softly') { c.fillStyle = '#fff6ea'; c.font = '900 18px Nunito, system-ui'; for (let i = 0; i < 3; i++) { const q = (t * 0.6 + i / 3) % 1; c.globalAlpha = 1 - q; c.fillText('z', x + 22 + q * 20, y - 60 - q * 30); } c.globalAlpha = 1; }
  c.restore();
  c.strokeStyle = 'rgba(255,240,220,0.5)'; c.lineWidth = 3; c.beginPath(); c.roundRect(20, 214, 320, 116, 16); c.stroke();
}
MG.add({
  id: 'cs_next', stage: 'ai', cmd: 'STOP THE WHEEL FOR EACH WORD!', time: 7, mood: 'night', winText: 'Word by word!', failText: 'Odd word!',
  card: { title: 'One word at a time', kind: 'Artificial intelligence', ref: 'Next-token prediction (language models)',
    text: 'A language model writes one piece of text at a time. Each piece is called a token: a word or part of a word.\n\nFor each step, the model gives every possible next token a chance. After "The cat sat on the", "mat" gets a big chance and "moon" a tiny one. Then one token is drawn, like stopping a prize wheel, and added to the text.\n\nThen it starts again with the longer text, so every new word changes the chances for the next one. Usually a likely word comes up. Now and then a tiny slice wins, and the sentence goes strange.',
    note: 'A language model writes by drawing the next token again and again, each one picked by its chance of coming next.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level); s.words = []; s.need = L === 2 ? 4 : 3; s.wp = WEIRD_P[L];
    s.om = [4.6, 6.4, 8.4][L]; s.fly = null; s.fail = false; s.won = false; s.lastAt = null; s.taps = 0;
    startWheel(g); s.wt = -1; // the first wheel is there from the first frame
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.state !== 'spin') return;
    s.state = 'stop'; s.st0 = g.t; s.th0 = s.th; s.taps++; g.sfx('click');
  },
  update(g, dt) {
    const s = g.s; if (g.done) return;
    if (s.state === 'spin') s.th += s.om * dt;
    else if (s.state === 'stop') { // coast to a stop: speed falls evenly to zero over STOP seconds
      const k = Math.min(1, (g.t - s.st0) / STOP); s.th = s.th0 + s.om * STOP * (k - k * k / 2);
      if (k >= 1) { const sl = landed(s, s.th); s.state = 'fly'; s.fly = { w: sl.w, t: g.t, weird: sl.weird }; g.sfx(sl.weird ? 'boing' : 'ding'); }
    } else if (s.state === 'fly' && g.t - s.fly.t > 0.5) {
      s.words.push(s.fly.w); s.lastAt = g.t;
      if (s.fly.weird) { s.fail = true; s.state = 'end'; g.sfx('laugh'); g.shake(4, 0.25); g.fail(); return; }
      if (s.words.length >= s.need) { s.won = true; s.state = 'end'; g.sfx('meow'); g.win(); g.burst(180, 270, ['#ffd45a', '#ff9a5a', '#fff6ea'], 18, 150); return; }
      s.state = 'gap'; s.gt = g.t; g.sfx('pop');
    } else if (s.state === 'gap' && g.t - s.gt > 0.35) startWheel(g);
  },
  draw(g, c) {
    const s = g.s, t = g.t;
    c.drawImage(g.bake('cs_next', paintNextRoom), 0, 0, 360, 640);
    // the sentence so far: the prompt in cream, the model's words in gold
    c.save(); c.fillStyle = 'rgba(255,248,236,0.96)'; c.beginPath(); c.roundRect(16, 124, 328, 82, 14); c.fill(); c.font = '800 23px Nunito, system-ui'; c.textBaseline = 'middle'; c.textAlign = 'left';
    c.fillStyle = '#4a3050'; c.fillText('The cat sat on the', 30, 148);
    let x = 30; const words = s.words.slice(); for (let i = 0; i < words.length; i++) { const w = words[i], sp = w === '.' ? '' : (i ? ' ' : ''), txt = sp + w; const fresh = s.lastAt != null && i === words.length - 1 ? B7.pop((t - s.lastAt) * 4) : 1;
      c.save(); c.fillStyle = WEIRD.has(w) ? '#e83a5a' : '#c86a10'; c.translate(x, 184); c.scale(fresh, fresh); c.fillText(txt, 0, 0); c.restore(); x += c.measureText(txt).width; }
    if (s.state !== 'end' && Math.sin(t * 8) > 0) { c.fillStyle = '#c86a10'; c.fillRect(x + 4, 172, 3, 24); } // the cursor where the next word goes
    c.restore(); s.curX = x;
    // the picture of the sentence
    sceneCat(c, s, t, 180, 312);
    // the wheel
    const sl = s.slices, th = s.th, appear = s.state === 'spin' ? Math.min(1, (t - s.wt) * 5) : 1;
    c.save(); c.translate(WX, WY); c.scale(appear, appear);
    c.fillStyle = 'rgba(20,10,30,0.4)'; c.beginPath(); c.arc(4, 8, WR + 10, 0, 7); c.fill();
    c.fillStyle = '#ffe8b0'; c.beginPath(); c.arc(0, 0, WR + 9, 0, 7); c.fill(); c.strokeStyle = '#8a5a3a'; c.lineWidth = 3; c.stroke();
    for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2 + th; c.fillStyle = Math.floor(t * 6 + i) % 3 === 0 ? '#fff6c0' : '#d8a050'; c.beginPath(); c.arc(Math.cos(a) * (WR + 5), Math.sin(a) * (WR + 5), 2.6, 0, 7); c.fill(); }
    sl.forEach((p, i) => {
      const col = p.weird ? '#5a4a6a' : SLICE[i % SLICE.length]; c.fillStyle = col; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, WR, th + p.a0, th + p.a1); c.closePath(); c.fill(); c.strokeStyle = '#fff6ea'; c.lineWidth = 2.5; c.stroke();
      // the word, written outward along the middle of its slice
      const am = th + (p.a0 + p.a1) / 2; c.save(); c.rotate(am); const flip = Math.cos(am) < 0; c.font = `900 ${p.w === '.' ? 40 : p.a1 - p.a0 < 0.6 ? 18 : 22}px Nunito, system-ui`; c.textBaseline = 'middle';
      c.fillStyle = p.weird ? '#e8d8ff' : '#3a2040'; if (flip) { c.rotate(Math.PI); c.textAlign = 'left'; c.fillText(p.w, -WR + 12, 0); } else { c.textAlign = 'right'; c.fillText(p.w, WR - 12, 0); } c.restore();
    });
    c.fillStyle = '#fff6ea'; c.beginPath(); c.arc(0, 0, 16, 0, 7); c.fill(); c.strokeStyle = '#8a5a3a'; c.lineWidth = 3; c.stroke();
    c.restore();
    // the pointer at the top, ticking against the pegs
    const tick = s.state === 'spin' || s.state === 'stop' ? Math.sin(th * 8) * 0.12 : 0;
    c.save(); c.translate(WX, WY - WR - 14); c.rotate(tick); c.fillStyle = '#e83a5a'; c.strokeStyle = '#7a1428'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-14, -12); c.lineTo(14, -12); c.lineTo(0, 16); c.closePath(); c.fill(); c.stroke(); c.restore();
    // the landed word flies up into the sentence
    if (s.state === 'fly') { const k = SK.easeInOut((t - s.fly.t) / 0.5); c.save(); c.font = '900 26px Nunito, system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle'; const fx = SK.lerp(WX, s.curX + 30, k), fy = SK.lerp(WY - WR - 40, 184, k) - Math.sin(k * Math.PI) * 30;
      c.fillStyle = 'rgba(30,14,36,0.7)'; const w = c.measureText(s.fly.w).width + 22; c.beginPath(); c.roundRect(fx - w / 2, fy - 18, w, 36, 18); c.fill(); c.fillStyle = s.fly.weird ? '#ff9ab0' : '#ffd45a'; c.fillText(s.fly.w, fx, fy + 1); c.restore(); }
    // the fox host, beside the wheel
    const won = g.result === 'win', lost = g.result === 'fail';
    B7.robot(c, 44, 616, 0.8, { t, dir: 0, mood: g.result === 'win' ? 'happy' : g.result === 'fail' ? 'wow' : 'idle' }); SK.tag(c, 'AI model', 52, 520, 18);
    SK.animal(c, 'fox', 316, 612, 0.75, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    if (s.state === 'spin') SK.glow(c, g, WX, WY, 40);
    SK.demo(g, c, 'tap', [WX, WY]);
  },
  // the bot taps when the wheel will coast to the middle of the biggest slice (B7FAIL: aims for the sliver)
  auto(g, dt, synth) {
    const s = g.s; if (g.done || s.state !== 'spin' || g.t - s.wt < 0.5) return;
    const fail = typeof window !== 'undefined' && window.B7FAIL, best = fail ? s.slices.find(p => p.weird) : s.slices.reduce((a, b) => (b.a1 - b.a0 > a.a1 - a.a0 ? b : a));
    const coast = s.om * STOP / 2, th = s.th + coast, sl = landed(s, th), mid = (best.a0 + best.a1) / 2;
    let a = (-Math.PI / 2 - th) % (Math.PI * 2); if (a < 0) a += Math.PI * 2;
    if (sl === best && Math.abs(a - mid) < (best.a1 - best.a0) * (fail ? 0.5 : 0.25)) synth('down', WX, WY), synth('up', WX, WY);
  },
});
