// READ! (chem_bio HB-21) — inside a cell: a strand of mRNA, its letters (A, U, G, C) in coloured tiles, and a ribosome
// clamped over the first three, AUG. Drag the ribosome along the strand and let go exactly three letters further on:
// its window lights green when it sits on the next three-letter word. Each word read brings in a tRNA carrying the
// matching amino acid, which joins the growing chain. When the ribosome reaches a stop word, the finished protein chain
// is let go and folds up. Let go one or two letters off and the ribosome is reading nonsense: it jams, sputters, and
// shuffles back. Level 0: three steps; level 1: four; level 2: five, with smaller letters and no shading between words.
(() => {
  const Y = 404, AA = { AUG: ['Met', '#e8a030'], UUU: ['Phe', '#e85a8a'], GGC: ['Gly', '#5ac0a0'], CUG: ['Leu', '#5a8ae8'], AAA: ['Lys', '#a85ae8'], GCU: ['Ala', '#e8d040'], UGG: ['Trp', '#e8703a'], CAU: ['His', '#40b0e0'], GAA: ['Glu', '#d04a5a'], ACC: ['Thr', '#7ac04a'] };
  const STOPS = ['UAA', 'UAG', 'UGA'], BASE = { A: '#4aa860', U: '#e0504a', G: '#e89a30', C: '#4a7ae0' };
  const MSGS = [['AUG', 'UUU', 'GGC', 'CUG', 'AAA', 'GCU'], ['AUG', 'GCU', 'CAU', 'UGG', 'GGC', 'ACC'], ['AUG', 'CUG', 'AAA', 'GAA', 'UUU', 'CAU'], ['AUG', 'GGC', 'ACC', 'UUU', 'GCU', 'CUG']];
  function paintBg(o) {
    const gr = o.createRadialGradient(180, 300, 40, 180, 320, 420); gr.addColorStop(0, '#fbe8f0'); gr.addColorStop(0.6, '#e8d0e8'); gr.addColorStop(1, '#c8a8d8'); o.fillStyle = gr; o.fillRect(0, 0, 360, 640);
    const r = P.rng(21);
    for (let i = 0; i < 9; i++) { const x = r() * 360, y = 140 + r() * 480, rr = 18 + r() * 30; o.fillStyle = 'rgba(200,150,210,0.35)'; o.beginPath(); o.ellipse(x, y, rr, rr * 0.6, r() * 3, 0, 7); o.fill(); o.strokeStyle = 'rgba(160,110,180,0.4)'; o.lineWidth = 2; o.stroke(); }
    for (let i = 0; i < 40; i++) { o.fillStyle = 'rgba(255,255,255,0.5)'; o.beginPath(); o.arc(r() * 360, r() * 640, 1 + r() * 2.5, 0, 7); o.fill(); }
    // the nucleus edge, where the message came from
    o.fillStyle = 'rgba(150,100,190,0.35)'; o.beginPath(); o.ellipse(-40, 640, 170, 120, 0, 0, 7); o.fill(); o.strokeStyle = 'rgba(120,70,160,0.5)'; o.lineWidth = 4; o.stroke();
  }
  function trna(c, x, y, col, name, codon) {
    c.save(); c.translate(x, y);
    c.fillStyle = '#f0e0c8'; c.strokeStyle = '#8a6a4a'; c.lineWidth = 2.5; c.beginPath(); c.roundRect(-20, -40, 40, 40, 10); c.fill(); c.stroke();
    c.font = '900 14px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#5a3a2a'; c.fillText(codon, 0, -10);
    SK.ball(c, 0, -56, 15, col); c.fillStyle = '#fff'; c.font = '900 12px Nunito, system-ui, sans-serif'; c.fillText(name, 0, -56);
    c.restore();
  }
  const anti = cod => cod.split('').map(b => ({ A: 'U', U: 'A', G: 'C', C: 'G' })[b]).join('');
  MG.add({
    id: 'read', stage: 'cells', cmd: 'SLIDE 3 LETTERS AT A TIME!', time: 7, mood: 'sea', winText: 'The protein is built!', failText: 'Jammed!',
    card: { title: 'Reading the recipe', kind: 'Biology', ref: 'Translation: ribosomes and codons',
      text: 'A gene is copied into a messenger molecule called mRNA. It is a long string of four letters: A, U, G and C.\n\nA ribosome clamps onto the message and reads it three letters at a time. Each three-letter word, called a codon, stands for one building block, an amino acid. A helper molecule, tRNA, brings the matching amino acid, and the ribosome joins it to the growing chain.\n\nThe ribosome starts at the word AUG. When it reaches a stop word, it lets the chain go. The chain folds up into a protein.',
      note: 'A ribosome reads the message three letters at a time and joins one matching amino acid for each three-letter word.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.lv = lv; s.v = SK.variant(g, 4);
      const n = [3, 4, 5][lv], words = MSGS[s.v].slice(0, n).concat([STOPS[(s.v + lv) % 3]]); s.words = words; s.letters = words.join('');
      s.LW = [24, 21, 18][lv]; s.x0 = 180 - s.letters.length * s.LW / 2; s.j = 0; s.rx = s.x0 + 1.5 * s.LW; s.from = s.rx; s.chain = [AA.AUG[1]]; s.names = ['Met'];
      s.jam = 0; s.jamX = 0; s.arrive = []; s.doneT = 0; s.drag = null; s.snapT = 0; s.snapFrom = s.rx;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.jam || s.doneT) return; if (Math.abs(x - s.rx) < 70 && Math.abs(y - Y) < 90) { s.drag = { dx: s.rx - x }; g.sfx('pop'); } },
    move(g, x, y) { const s = g.s; if (!s.drag) return; s.rx = SK.clamp(x + s.drag.dx, s.x0 + 1.5 * s.LW - 10, s.x0 + (s.letters.length - 1.5) * s.LW + 10); },
    up(g) {
      const s = g.s; if (!s.drag) return; s.drag = null; const cur = s.x0 + (3 * s.j + 1.5) * s.LW, d = (s.rx - cur) / s.LW, n = Math.round(d), off = Math.abs(d - n) * s.LW;
      if (n === 0 && off < s.LW * 0.5) { s.snapT = g.t; s.snapFrom = s.rx; return; } // back where it was: nothing read
      if (n === 3 && off <= s.LW * 0.45) { // exactly the next word: read it
        s.j++; s.snapT = g.t; s.snapFrom = s.rx; const w = s.words[s.j]; g.sfx('click');
        if (STOPS.includes(w)) { s.doneT = g.t; g.sfx('chime'); g.sfx('magic'); }
        else { s.arrive.push({ t: g.t, w }); g.sfx('ding'); }
        return; }
      s.jam = g.t; s.jamX = s.rx; g.sfx('wrong'); g.sfx('boing'); // one or two letters off (or a word skipped): nonsense
    },
    update(g, dt) {
      const s = g.s, t = g.t, cur = s.x0 + (3 * s.j + 1.5) * s.LW;
      if (s.jam && t - s.jam > 0.9) { s.jam = 0; s.snapT = t; s.snapFrom = s.rx; }
      if (!s.drag && !s.jam) { const k = SK.easeOut((t - s.snapT) / 0.2); s.rx = SK.lerp(s.snapFrom, cur, k); }
      for (const a of s.arrive) if (!a.joined && t - a.t > 0.5) { a.joined = true; s.chain.push(AA[a.w][1]); s.names.push(AA[a.w][0]); g.sfx('pop'); }
      if (s.doneT && !g.done && t - s.doneT > 0.55) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, LW = s.LW, won = g.result === 'win', lost = g.result === 'fail';
      c.drawImage(g.bake('read_bg', paintBg), 0, 0, 360, 640);
      // the mRNA strand: a backbone with its letters; words already read fade, the stop word is marked
      c.strokeStyle = '#7a4a8a'; c.lineWidth = 5; c.beginPath(); c.moveTo(s.x0 - 20, Y + 18); for (let x = s.x0 - 20; x <= s.x0 + s.letters.length * LW + 20; x += 6) c.lineTo(x, Y + 18 + Math.sin(x * 0.1 + t) * 1.5); c.stroke();
      for (let i = 0; i < s.letters.length; i++) { const b = s.letters[i], x = s.x0 + (i + 0.5) * LW, w = Math.floor(i / 3), read = w < s.j;
        if (s.lv < 2 && w % 2 === 1) { c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(s.x0 + i * LW, Y - 18, LW, 44); }
        c.globalAlpha = read ? 0.45 : 1; c.fillStyle = BASE[b]; c.strokeStyle = P.shade(BASE[b], -0.5); c.lineWidth = 1.5; c.beginPath(); c.roundRect(x - LW / 2 + 2, Y - 14, LW - 4, 30, 5); c.fill(); c.stroke();
        c.fillStyle = '#fff'; c.font = `900 ${LW >= 21 ? 19 : 18}px Nunito, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(b, x, Y + 2); c.globalAlpha = 1; }
      const stopX = s.x0 + (s.letters.length - 1.5) * LW;
      
      // the ribosome: a big subunit above the strand and a small one below, with a three-letter window
      const jam = s.jam ? Math.sin((t - s.jam) * 50) * 4 : 0, rx = s.rx + jam, cur = s.x0 + (3 * s.j + 1.5) * LW, nxt = cur + 3 * LW, d = (s.rx - cur) / LW, aligned = s.drag && Math.abs(s.rx - nxt) <= LW * 0.45;
      const gr = c.createRadialGradient(rx - 20, Y - 70, 6, rx, Y - 50, 80); gr.addColorStop(0, '#a8e0d8'); gr.addColorStop(1, '#3a9a98');
      c.fillStyle = gr; c.strokeStyle = '#1a5a5a'; c.lineWidth = 3; c.beginPath(); c.ellipse(rx, Y - 50, 58, 38, 0, Math.PI * 0.95, Math.PI * 2.05); c.quadraticCurveTo(rx + 36, Y - 18, rx, Y - 22); c.quadraticCurveTo(rx - 36, Y - 18, rx - 58 * Math.cos(0.05 * Math.PI), Y - 50 + 38 * Math.sin(0.05 * Math.PI)); c.fill(); c.stroke();
      const g2 = c.createRadialGradient(rx - 10, Y + 40, 4, rx, Y + 44, 60); g2.addColorStop(0, '#b8e8e0'); g2.addColorStop(1, '#4aa8a0'); c.fillStyle = g2; c.beginPath(); c.ellipse(rx, Y + 44, 48, 20, 0, 0, 7); c.fill(); c.stroke();
      const wc = s.jam ? '#ff5a5a' : aligned ? '#5aff8a' : s.drag ? '#ffd45a' : '#fff6ea';
      c.strokeStyle = wc; c.lineWidth = 4; c.beginPath(); c.roundRect(rx - 1.5 * LW - 3, Y - 19, 3 * LW + 6, 40, 8); c.stroke();
      if (s.jam) { c.fillStyle = `rgba(120,120,130,${0.6 - (t - s.jam) * 0.6})`; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(rx - 30 + i * 20, Y - 96 - (t - s.jam) * 40, 10 + i * 2, 0, 7); c.fill(); } SK.tag(c, 'Nonsense!', rx, Y - 112, 18, '#fff6ea', 'rgba(190,40,40,0.9)'); }
      SK.tag(c, 'Ribosome', SK.clamp(rx, 60, 300), Y + 100, 18, '#fff6ea', 'rgba(26,90,90,0.9)');
      if (!s.doneT) SK.tag(c, 'Stop', stopX, Y - 40, 18, '#fff6ea', 'rgba(190,40,40,0.9)');
      if (!s.doneT) SK.tag(c, 'mRNA', SK.clamp(stopX - 20, 40, 300), Y + 62, 18);
      // tRNAs arriving with their amino acids
      for (const a of s.arrive) { if (a.joined && t - a.t > 1.1) continue; const k = SK.clamp((t - a.t) / 0.5, 0, 1), out = SK.clamp((t - a.t - 0.6) / 0.5, 0, 1);
        trna(c, s.rx + out * 120, SK.lerp(150, Y - 22, SK.easeOut(k)) - out * 120, a.joined ? '#ccc' : AA[a.w][1], a.joined ? '' : AA[a.w][0], anti(a.w)); }
      // the growing chain of amino acids, coming out of the top of the ribosome (and let go at the stop)
      const rel = s.doneT ? SK.clamp((t - s.doneT) / 0.6, 0, 1) : 0;
      let tx = 0, ty = 0;
      for (let i = 0; i < s.chain.length; i++) { const k = s.chain.length - 1 - i, wob = rel ? Math.sin(t * 4 + i) * 6 * rel : 0;
        const bx = s.rx - 46 - k * 21 - rel * 50 + wob, by = Y - 100 - k * 15 + Math.sin(k * 1.3) * 7 - rel * 90;
        if (i + 1 < s.chain.length) { const k2 = k - 1, bx2 = s.rx - 46 - k2 * 21 - rel * 50, by2 = Y - 100 - k2 * 15 + Math.sin(k2 * 1.3) * 7 - rel * 90; c.strokeStyle = '#8a6a8a'; c.lineWidth = 4; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx2, by2); c.stroke(); }
        SK.ball(c, bx, by, 13, s.chain[i]); c.fillStyle = '#fff'; c.font = '900 11px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s.names[i], bx, by); if (i === 0) { tx = bx; ty = by; } }
      if (!g.done && s.chain.length > 1) SK.tag(c, 'Protein chain', SK.clamp(tx, 74, 286), ty - 34, 18);
      SK.animal(c, 'ant', 320, 628, 0.85, { t, pose: won ? 'cheer' : lost ? 'sad' : s.jam ? 'sad' : 'idle', expr: won ? 'laugh' : s.jam ? 'wow' : 'happy', facing: -1 });
      // guidance: slide the ribosome exactly one word (three letters) to the right
      if (g.done || s.doneT || s.jam) return;
      if (!s.drag) { SK.grab(c, g, s.rx, Y - 50, 40); SK.target(c, g, nxt, Y + 2, 0, { w: 3 * LW + 10, h: 46 }); SK.arrow(c, g, s.rx, Y - 70, nxt, Y - 70, { from: 30, to: 10 }); }
      SK.demo(g, c, 'drag', [s.rx, Y - 40], [nxt, Y - 40]);
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 0.7 || s.doneT || s.jam) return; const B = s._rb = s._rb || { n: 0, at: 0 };
      if (B.cur) { if (SK.bot.drag(g, synth, 'r' + B.n, B.cur.t0, B.cur.a, B.cur.b, 0.35)) { B.n++; B.cur = null; B.at = g.t + 0.3; } return; }
      if (g.t < B.at) return; B.cur = { t0: g.t, a: [s.rx, Y - 40], b: [s.rx + 3 * s.LW, Y - 40] };
    },
  });
})();
