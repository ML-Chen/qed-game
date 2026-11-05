// CHOP! (cs AI-01) — tokens. A word is carved on a log; the model's token list hangs on the board above. Swipe the
// knife down through the log between letters so every piece is a token on the list: "un", "believ", "able". Each good
// piece drops onto the token train. Chop in the wrong place and the model cannot read that piece, so it falls apart
// into single letters, the train grows too long for the station, and the beaver groans. Level 2: a word in another
// language needs more pieces.
const WORDS = [
  { w: 'unbelievable', toks: ['un', 'believ', 'able'], extra: ['be', 'lie'] },
  { w: 'unfriendliness', toks: ['un', 'friend', 'li', 'ness'], extra: ['end', 'fri'] },
  { w: 'Schmetterling', toks: ['Sch', 'met', 'ter', 'ling'], extra: ['me', 'ring'] },
];
const LOGY = 352, FS = 30, TRAINY = 548;
function canSplit(seg, vocab) { const ok = [true]; for (let i = 1; i <= seg.length; i++) { ok[i] = false; for (const v of vocab) if (i >= v.length && ok[i - v.length] && seg.slice(i - v.length, i) === v) { ok[i] = true; break; } } return ok[seg.length]; }
function logGeo(s) { const n = s.word.length, cw = Math.min(22, 300 / n), x0 = 180 - n * cw / 2; return { cw, x0, gapX: k => x0 + k * cw }; }
function carW(txt) { return txt.length * 11.2 + 16; }
function paintForest(o) {
  const sk = o.createLinearGradient(0, 0, 0, 640); sk.addColorStop(0, '#f8d8a0'); sk.addColorStop(0.5, '#e8c088'); sk.addColorStop(1, '#a8885a'); o.fillStyle = sk; o.fillRect(0, 0, 360, 640);
  for (let i = 0; i < 9; i++) P.tree(o, 20 + i * 42, 300 + (i % 3) * 8, 0.7 + (i % 2) * 0.2, '#6a9a4a', i + 3);
  o.fillStyle = '#9a7a4a'; o.fillRect(0, 300, 360, 340); const rnd = P.rng(9); for (let i = 0; i < 60; i++) { o.fillStyle = `rgba(70,50,20,${0.1 + rnd() * 0.15})`; o.beginPath(); o.ellipse(rnd() * 360, 300 + rnd() * 330, 4 + rnd() * 8, 2 + rnd() * 2, 0, 0, 7); o.fill(); }
  // the chopping stump under the log
  o.fillStyle = '#6a4a2a'; o.beginPath(); o.roundRect(10, LOGY + 26, 340, 40, 10); o.fill(); o.fillStyle = '#c8a070'; o.beginPath(); o.ellipse(180, LOGY + 28, 170, 10, 0, 0, 7); o.fill();
  // the station platform for the token train
  o.fillStyle = '#8a8a98'; o.fillRect(0, TRAINY + 18, 360, 4); o.fillRect(0, TRAINY + 28, 360, 4);
  o.fillStyle = '#5a4030'; for (let x = 2; x < 360; x += 16) o.fillRect(x, TRAINY + 15, 7, 20);
}
MG.add({
  id: 'cs_chop', stage: 'ai', cmd: 'CHOP THE WORD INTO TOKENS!', time: 7, mood: 'night', winText: 'Tokens!', failText: 'Too long!',
  card: { title: 'Words in pieces', kind: 'Artificial intelligence', ref: 'Tokenization (subword tokens)',
    text: 'A language model does not read letters one by one, and it does not know every whole word. It reads tokens: pieces from a fixed list it learned. Common words are often one token. Rarer words are built from a few pieces, like "un" + "believ" + "able".\n\nIf a piece is not on the list, the model has to fall back to smaller pieces, sometimes single letters. Then the same text takes many more tokens, which costs more and fills the model\'s memory sooner.\n\nWords from languages that were rarer in the training text often need more pieces.',
    note: 'Models read tokens: common words whole, rarer words in a few pieces from a fixed list.' },
  init(g) {
    const s = g.s, L = Math.min(2, g.level), W = WORDS[L]; s.word = W.w; s.vocab = W.toks.concat(W.extra);
    s.board = s.vocab.slice().sort((a, b) => ((a.length * 7 + a.charCodeAt(0)) % 5) - ((b.length * 7 + b.charCodeAt(0)) % 5));
    s.cuts = [0, W.w.length]; s.segs = [{ a: 0, b: W.w.length, st: 'log' }]; s.toks = W.toks; s.res = null; s.swipe = null; s.chops = [];
    let ideal = 16; for (const tk of W.toks) ideal += carW(tk) + 6; s.cap = ideal + 52; // the station fits the right tokens and a little more
    s.answer = []; let p = 0; for (const tk of W.toks.slice(0, -1)) { p += tk.length; s.answer.push(p); }
  },
  down(g, x, y) { SK.touched(g); g.s.swipe = { x0: x, y0: y, x, y }; },
  move(g, x, y) { const sw = g.s.swipe; if (sw) { sw.x = x; sw.y = y; } },
  up(g, x, y) {
    const s = g.s, sw = s.swipe; s.swipe = null; if (!sw || g.done) return;
    if (y - sw.y0 < 40 || Math.max(sw.y0, y) < LOGY - 10 || Math.min(sw.y0, y) > LOGY + 10) return; // a downward stroke through the log
    const G = logGeo(s), mx = (sw.x0 + x) / 2, k = Math.round((mx - G.x0) / G.cw);
    if (k <= 0 || k >= s.word.length || s.cuts.includes(k)) return;
    const seg = s.segs.find(q => q.a < k && q.b > k && q.st === 'log'); if (!seg) return;
    s.cuts.push(k); s.chops.push({ k, t: g.t }); g.sfx('crunch'); g.shake(2, 0.1);
    const parts = [{ a: seg.a, b: k }, { a: k, b: seg.b }]; s.segs.splice(s.segs.indexOf(seg), 1);
    for (const p of parts) { const txt = s.word.slice(p.a, p.b); p.st = s.vocab.includes(txt) && s.toks.includes(txt) ? 'tok' : canSplit(txt, s.toks) ? 'log' : 'bad'; p.t = g.t; s.segs.push(p); if (p.st === 'tok') g.sfx('ding'); if (p.st === 'bad') g.sfx('wrong'); }
    s.segs.sort((a, b) => a.a - b.a);
  },
  update(g, dt) {
    const s = g.s; if (g.done) return;
    // the train: each token as one car, each crumbled piece as one car per letter
    let len = 16; for (const q of s.segs) { if (q.st === 'tok') len += carW(s.word.slice(q.a, q.b)) + 6; else if (q.st === 'bad') len += (q.b - q.a) * (carW('a') + 6); }
    s.len = len;
    if (len > s.cap && !s.res) { s.res = { t: g.t, win: false }; g.sfx('thud'); g.fail(); return; }
    if (!s.res && s.segs.every(q => q.st === 'tok') && g.t - Math.max(...s.segs.map(q => q.t || 0)) > 0.5) { s.res = { t: g.t, win: true }; g.win(); g.sfx('cheer'); g.burst(180, TRAINY - 30, ['#ffd45a', '#7ee8a0', '#fff'], 18, 150); }
  },
  draw(g, c) {
    const s = g.s, t = g.t, G = logGeo(s);
    c.drawImage(g.bake('cs_chop', paintForest), 0, 0, 360, 640);
    // the model's token list: carved tiles on a board
    c.fillStyle = '#6a4428'; c.beginPath(); c.roundRect(16, 130, 328, 108, 12); c.fill(); c.fillStyle = '#8a5a34'; c.beginPath(); c.roundRect(22, 136, 316, 96, 9); c.fill();
    { let x = 32, y = 160; c.font = `700 19px ${B7.MONO}`; c.textBaseline = 'middle'; c.textAlign = 'center'; for (const v of s.board) { const w = carW(v); if (x + w > 330) { x = 32; y += 44; } const used = s.segs.some(q => q.st === 'tok' && s.word.slice(q.a, q.b) === v);
      c.fillStyle = used ? '#a8e8a0' : '#f4dcb0'; c.strokeStyle = '#4a2a14'; c.lineWidth = 2; c.beginPath(); c.roundRect(x, y - 16, w, 32, 6); c.fill(); c.stroke(); c.fillStyle = '#3a2010'; c.fillText(v, x + w / 2, y + 1); x += w + 8; } }
    SK.tag(c, "AI model's token list", 180, 252, 18);
    // the log: still-uncut parts sit here; tokens and crumbs leave for the train
    for (const q of s.segs) {
      const txt = s.word.slice(q.a, q.b), x0 = G.gapX(q.a), x1 = G.gapX(q.b), age = q.t ? t - q.t : 9;
      if (q.st !== 'log' && age > 0.25) continue;
      const lift = q.st === 'log' ? 0 : age * 80;
      c.save(); c.translate(0, -lift);
      c.fillStyle = '#b07a44'; c.strokeStyle = '#5a3a1a'; c.lineWidth = 2; c.beginPath(); c.roundRect(x0 + 1, LOGY - 26, x1 - x0 - 2, 52, 10); c.fill(); c.stroke();
      c.strokeStyle = 'rgba(90,58,26,0.35)'; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(x0 + 4, LOGY - 14 + i * 13); c.lineTo(x1 - 4, LOGY - 14 + i * 13 + (i - 1) * 2); c.stroke(); }
      c.font = `800 ${FS}px ${B7.MONO}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff2d8'; for (let i = 0; i < txt.length; i++) c.fillText(txt[i], G.gapX(q.a + i) + G.cw / 2, LOGY + 1);
      c.restore();
    }
    // fresh cuts: a flash of wood chips
    for (const ch of s.chops) { const k = (t - ch.t) / 0.4; if (k > 1) continue; const x = G.gapX(ch.k); c.save(); c.globalAlpha = 1 - k; c.fillStyle = '#e8c080'; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.4; c.beginPath(); c.ellipse(x + Math.cos(a) * k * 40, LOGY - 20 + Math.sin(a) * k * 40 + k * k * 30, 4, 2, a, 0, 7); c.fill(); } c.strokeStyle = '#fff'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, LOGY - 40); c.lineTo(x, LOGY + 40); c.stroke(); c.restore(); }
    // the token train at the station: the platform's end is marked; cars past it hang over the edge
    const capX = 20 + s.cap; c.fillStyle = '#d8c8a8'; c.fillRect(14, TRAINY + 36, s.cap + 6, 10); c.fillStyle = '#e83a4a'; c.fillRect(capX, TRAINY - 30, 6, 76); c.fillStyle = '#fff'; c.fillRect(capX, TRAINY - 22, 6, 8);
    c.fillStyle = '#4a7ad8'; c.strokeStyle = '#1a3a6a'; c.lineWidth = 2; c.beginPath(); c.roundRect(14, TRAINY - 26, 40, 40, 6); c.fill(); c.stroke(); c.fillStyle = '#2a2a3a'; c.fillRect(20, TRAINY - 40, 10, 14);
    let x = 60; for (const q of s.segs) {
      if (q.st === 'log') continue; const txt = s.word.slice(q.a, q.b), k = Math.min(1, ((t - q.t) - 0.2) / 0.4); if (k <= 0) { if (q.st === 'tok') x += carW(txt) + 6; else x += (q.b - q.a) * (carW('a') + 6); continue; }
      const pieces = q.st === 'tok' ? [txt] : txt.split('');
      pieces.forEach((pc, i) => { const w = carW(pc), fx = G.gapX(q.a + (q.st === 'tok' ? 0 : i)) + w / 2, tx = x + w / 2, cx = SK.lerp(fx, tx, SK.easeInOut(k)), cy = SK.lerp(LOGY - 30, TRAINY - 6, SK.easeInOut(k)) - Math.sin(k * Math.PI) * 50;
        c.fillStyle = q.st === 'tok' ? '#a8e8a0' : '#ffb0a0'; c.strokeStyle = '#3a2a2a'; c.lineWidth = 2; c.beginPath(); c.roundRect(cx - w / 2, cy - 16, w, 30, 5); c.fill(); c.stroke();
        c.fillStyle = '#2a1a1a'; c.font = `700 18px ${B7.MONO}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(pc, cx, cy - 1); c.fillStyle = '#2a2a3a'; c.beginPath(); c.arc(cx - w / 2 + 8, cy + 16, 4, 0, 7); c.arc(cx + w / 2 - 8, cy + 16, 4, 0, 7); c.fill(); x += w + 6; });
    }
    // the beaver at the station
    const won = s.res && s.res.win, lost = s.res && !s.res.win;
    B7.robot(c, 324, 606, 0.82, { t, dir: 2, mood: won ? 'happy' : lost ? 'wow' : 'idle' }); SK.tag(c, 'AI model', 300, 500, 18); if (lost) { c.save(); c.globalAlpha = Math.min(1, (t - s.res.t) * 3); SK.tag(c, '?', 344, 520, 22); c.restore(); }
    SK.animal(c, 'beaver', 338, 346, 0.6, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
    // the knife stroke while swiping
    if (s.swipe) { c.save(); c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(s.swipe.x0, s.swipe.y0); c.lineTo(s.swipe.x, s.swipe.y); c.stroke(); c.restore(); }
    // guidance: a dashed cut line at the next place the model splits (levels 0-1), and the hand swipes down through it
    const next = s.answer.find(k => !s.cuts.includes(k));
    if (next != null && !g.done) { const gx = G.gapX(next); if (g.level <= 1) { c.save(); c.strokeStyle = `rgba(255,240,150,${0.5 + 0.4 * Math.sin(t * 6)})`; c.lineWidth = 3; c.setLineDash([6, 6]); c.lineDashOffset = -t * 30; c.beginPath(); c.moveTo(gx, LOGY - 46); c.lineTo(gx, LOGY + 46); c.stroke(); c.restore(); }
      SK.demo(g, c, 'swipe', [gx, LOGY - 70], [gx, LOGY + 50]); }
  },
  // the bot chops at each place the model splits (B7FAIL: chops after the first letter)
  auto(g, dt, synth) {
    const s = g.s; if (g.done || g.t < (s.nb || 1.0)) return; s.nb = g.t + 0.5; const G = logGeo(s);
    const k = (typeof window !== 'undefined' && window.B7FAIL) ? 1 : s.answer.find(q => !s.cuts.includes(q)); if (k == null || s.cuts.includes(k)) return;
    const x = G.gapX(k); synth('down', x, LOGY - 70); synth('move', x, LOGY); synth('move', x, LOGY + 50); synth('up', x, LOGY + 50);
  },
});
