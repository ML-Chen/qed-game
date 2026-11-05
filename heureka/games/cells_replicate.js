// REPLICATE! (chem_bio APB-19) — a DNA ladder stands in the cell's nucleus, its rungs made of letter pairs (A with T,
// G with C). Drag the helicase (the zipper pull at the top) down the ladder: the rungs split and the two strands swing
// apart. Then drag each polymerase along its strand: as it passes each letter it snaps on the matching partner (A to T,
// G to C) and a new backbone grows. The two strands run opposite ways, so the left polymerase builds downward and the
// right one upward. Built on both halves, the result is two identical ladders, each with one old strand and one new.
// Build only one and the other half is left lonely. Level 0: six rungs; level 1: eight, with the right strand built in
// two short pieces; level 2: ten rungs, three pieces.
(() => {
  const PAIR = { A: 'T', T: 'A', G: 'C', C: 'G' }, COL = { A: '#4aa860', T: '#e0504a', G: '#e89a30', C: '#4a7ae0' };
  const SEQS = ['ATGCGTACCTGA', 'GCTAACGTTAGC', 'TTAGCCGATCAG', 'CGATTGCAGTCA'];
  const Y0 = 196, BOT = 520, SPLIT = 60, TW = 26;
  const ss = k => { k = SK.clamp(k, 0, 1); return k * k * (3 - 2 * k); };
  function paintBg(o) {
    const gr = o.createRadialGradient(180, 360, 30, 180, 360, 380); gr.addColorStop(0, '#f8f0d8'); gr.addColorStop(0.7, '#f0d8c0'); gr.addColorStop(1, '#d8b8a8'); o.fillStyle = gr; o.fillRect(0, 0, 360, 640);
    o.strokeStyle = 'rgba(160,110,90,0.4)'; o.lineWidth = 6; o.beginPath(); o.ellipse(180, 370, 200, 300, 0, 0, 7); o.stroke();
    const r = P.rng(8); for (let i = 0; i < 26; i++) { o.fillStyle = `rgba(${r() < 0.5 ? '230,160,140' : '200,170,220'},0.35)`; o.beginPath(); o.arc(r() * 360, r() * 640, 3 + r() * 6, 0, 7); o.fill(); }
    for (let i = 0; i < 4; i++) { o.strokeStyle = 'rgba(180,130,170,0.25)'; o.lineWidth = 3; o.beginPath(); const x = r() * 360, y = 120 + r() * 460; o.moveTo(x, y); for (let k = 0; k < 6; k++) o.quadraticCurveTo(x + k * 14 + 10, y + (k % 2 ? 16 : -16), x + k * 14 + 20, y); o.stroke(); }
  }
  function tile(c, x, y, w, ch, alpha = 1, glow) { c.save(); c.globalAlpha = alpha; c.fillStyle = COL[ch]; c.strokeStyle = P.shade(COL[ch], -0.5); c.lineWidth = 1.5; c.beginPath(); c.roundRect(Math.min(x, x + w), y - 11, Math.abs(w), 22, 5); c.fill(); c.stroke();
    if (glow) { c.strokeStyle = '#fff6a0'; c.lineWidth = 2; c.stroke(); }
    c.fillStyle = '#fff'; c.font = '900 18px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(ch, x + w / 2, y + 1); c.restore(); }
  function enzyme(c, x, y, col, t, face, shake) { c.save(); c.translate(x + shake, y); const gr = c.createRadialGradient(-6, -8, 2, 0, 0, 24); gr.addColorStop(0, P.shade(col, 0.4)); gr.addColorStop(1, col); c.fillStyle = gr; c.strokeStyle = P.shade(col, -0.5); c.lineWidth = 2.5;
    c.beginPath(); c.ellipse(0, 0, 22, 17, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#2a1424'; c.beginPath(); c.arc(-6, -3, 2.5, 0, 7); c.arc(6, -3, 2.5, 0, 7); c.fill(); c.strokeStyle = '#2a1424'; c.lineWidth = 2; c.beginPath(); c.arc(0, 2, 6, 0.2, Math.PI - 0.2); c.stroke();
    c.fillStyle = '#fff6ea'; c.beginPath(); c.moveTo(0, face * 26); c.lineTo(-6, face * 18); c.lineTo(6, face * 18); c.closePath(); c.fill(); c.restore(); }
  MG.add({
    id: 'replicate', stage: 'cells', cmd: 'UNZIP, THEN COPY BOTH HALVES!', time: 8, mood: 'sea', winText: 'Two copies, each half old, half new!', failText: 'Only half copied!',
    card: { title: 'Copying DNA', kind: 'Biology', ref: 'DNA replication',
      text: 'DNA is a ladder with two strands. Its rungs are pairs of letters: A always pairs with T, and G always pairs with C.\n\nTo copy it, an enzyme called helicase unzips the ladder down the middle. Then an enzyme called polymerase moves along each half and adds the matching partner for every letter. Because the pairing rule never changes, each half is enough to rebuild the whole ladder.\n\nThe two strands point opposite ways, so one half is built smoothly and the other in short pieces that are joined up. The result is two identical ladders, each with one old strand and one new.',
      note: 'DNA is copied by unzipping it and building a matching new partner on each strand, so each copy is half old and half new.' },
    init(g) {
      const s = g.s, lv = Math.min(2, g.level); s.lv = lv; s.v = SK.variant(g, 4);
      const n = [6, 8, 10][lv]; s.seq = SEQS[s.v].slice(0, n).split(''); s.n = n; s.dy = (BOT - Y0) / (n - 1);
      s.fork = Y0 - 40; s.zip = { x: 180, y: Y0 - 40, k: 'zip' };
      s.L = { x: 180 - SPLIT - 2 + TW, y: Y0 - 34, k: 'L', built: new Array(n).fill(0) };
      const pieces = lv === 0 ? [[0, n - 1]] : lv === 1 ? [[4, 7], [0, 3]] : [[7, 9], [3, 6], [0, 2]];
      s.R = { pieces, p: 0, built: new Array(n).fill(0), k: 'R' }; s.R.x = 180 + SPLIT + 2 - TW; s.R.y = Y0 + pieces[0][1] * s.dy + 34;
      s.shake = 0; s.shakeT = -9; s.doneT = 0; s.drag = null;
    },
    down(g, x, y) { const s = g.s; SK.touched(g); if (g.done || s.doneT) return;
      const open = s.fork >= BOT + 30, cand = [s.zip.y < BOT + 30 ? s.zip : null, open && s.L.built.some(b => !b) ? s.L : null, open && s.R.p < s.R.pieces.length ? s.R : null];
      const o = SK.pick(cand.filter(Boolean), x, y, 50); if (o) { s.drag = o; s.dy0 = o.y - y; g.sfx('pop'); } },
    move(g, x, y) { const s = g.s, o = s.drag; if (!o || g.done) return; const want = y + s.dy0;
      if (o.k === 'zip') { if (want > o.y) { o.y = Math.min(BOT + 40, want); s.fork = Math.max(s.fork, o.y); if (g.t - (s.zipT || 0) > 0.12) { s.zipT = g.t; g.sfx('stretch', { vol: 0.3 }); } } else if (want < o.y - 30 && g.t - s.shakeT > 0.5) { s.shakeT = g.t; g.sfx('boing', { vol: 0.4 }); } return; }
      if (o.k === 'L') { if (want > o.y) { o.y = Math.min(BOT + 34, want); for (let i = 0; i < s.n; i++) if (!o.built[i] && o.y > Y0 + i * s.dy) { o.built[i] = g.t; g.sfx('click'); } } else if (want < o.y - 30 && g.t - s.shakeT > 0.5) { s.shakeT = g.t; g.sfx('boing', { vol: 0.4 }); } return; }
      if (o.k === 'R') { const [a] = o.pieces[o.p]; if (want < o.y) { o.y = Math.max(Y0 + a * s.dy - 34, want); for (let i = a; i <= o.pieces[o.p][1]; i++) if (!o.built[i] && o.y < Y0 + i * s.dy) { o.built[i] = g.t; g.sfx('click'); } } else if (want > o.y + 30 && g.t - s.shakeT > 0.5) { s.shakeT = g.t; g.sfx('boing', { vol: 0.4 }); } }
    },
    up(g) { const s = g.s, o = s.drag; s.drag = null; if (!o) return;
      if (o.k === 'R') { const [a, b] = o.pieces[o.p]; let all = true; for (let i = a; i <= b; i++) if (!o.built[i]) all = false;
        if (all) { o.p++; g.sfx('ding'); if (o.p < o.pieces.length) o.y = Y0 + o.pieces[o.p][1] * s.dy + 34; } } },
    update(g, dt) {
      const s = g.s, t = g.t;
      // a piece of the right strand is finished as soon as all its letters have partners
      const R = s.R; if (R.p < R.pieces.length) { const [a, b] = R.pieces[R.p]; let all = true; for (let i = a; i <= b; i++) if (!R.built[i]) all = false; if (all && s.drag !== R) { R.p++; g.sfx('ding'); if (R.p < R.pieces.length) R.y = Y0 + R.pieces[R.p][1] * s.dy + 34; } }
      if (!s.doneT && !g.done && s.L.built.every(Boolean) && R.built.every(Boolean)) { s.doneT = t; s.drag = null; g.sfx('chime'); g.sfx('magic'); }
      if (s.doneT && !g.done && t - s.doneT > 0.6) { g.win(); g.sfx('cheer'); }
    },
    draw(g, c) {
      const s = g.s, t = g.t, won = g.result === 'win', lost = g.result === 'fail', n = s.n;
      c.drawImage(g.bake('replicate_bg', paintBg), 0, 0, 360, 640);
      const sep = s.doneT ? SK.easeOut((t - s.doneT) / 0.6) * 18 : 0;
      // where each strand sits at rung i: together above the fork's reach, apart once unzipped
      const off = y => SPLIT * ss((s.fork - y) / 50 + 0.2);
      const lx = i => 180 - off(Y0 + i * s.dy) - 2 - sep, rx = i => 180 + off(Y0 + i * s.dy) + 2 + sep;
      // backbones: old strands dark, new strands bright
      const line = (fx, col, w, from = 0, to = n - 1, mask) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); let on = false; for (let i = from; i <= to; i++) { if (mask && !mask[i]) { on = false; continue; } const x = fx(i), y = Y0 + i * s.dy; if (!on) { c.moveTo(x, y - (i === from ? 14 : 0)); on = true; } else c.lineTo(x, y); } c.stroke(); };
      line(i => lx(i) - TW, '#5a2a6a', 8); line(i => rx(i) + TW, '#5a2a6a', 8);
      for (let i = 0; i < n; i++) { const y = Y0 + i * s.dy, b = s.seq[i], p = PAIR[b];
        tile(c, lx(i) - TW, y, TW, b); tile(c, rx(i) + TW, y, -TW, p);
        if (s.L.built[i]) { const k = SK.clamp((t - s.L.built[i]) / 0.2, 0, 1); tile(c, lx(i) + (1 - k) * 30, y, TW, p, k, true); }
        if (s.R.built[i]) { const k = SK.clamp((t - s.R.built[i]) / 0.2, 0, 1); tile(c, rx(i) - (1 - k) * 30, y, -TW, b, k, true); } }
      line(i => lx(i) + TW, '#3ad0e8', 7, 0, n - 1, s.L.built); line(i => rx(i) - TW, '#3ad0e8', 7, 0, n - 1, s.R.built);
      // the enzymes: helicase (the zipper pull), and a polymerase on each half
      const sh = t - s.shakeT < 0.3 ? Math.sin(t * 60) * 3 : 0;
      if (s.zip.y < BOT + 30) { enzyme(c, 180, s.zip.y, '#e8a030', t, 1, s.drag === s.zip ? sh : 0); SK.tag(c, 'Helicase', 180 + 74, s.zip.y, 18); }
      const open = s.fork >= BOT + 30;
      if (open && !s.doneT) { if (s.L.built.some(b => !b)) enzyme(c, s.L.x, s.L.y, '#a85ae8', t, 1, s.drag === s.L ? sh : 0);
        if (s.R.p < s.R.pieces.length) enzyme(c, s.R.x, s.R.y, '#a85ae8', t, -1, s.drag === s.R ? sh : 0);
        SK.tag(c, 'Polymerase', 180, BOT + 74, 18, '#fff6ea', 'rgba(110,50,150,0.9)'); }
      if (!g.done) { SK.tag(c, 'DNA', 52, Y0 - 34, 18); }
      if (s.doneT) { SK.tag(c, 'Old', lx(0) - TW, Y0 - 34, 18, '#fff6ea', 'rgba(90,42,106,0.9)'); SK.tag(c, 'New', lx(0) + TW + 6, Y0 - 34, 18, '#1a4a5a', 'rgba(140,240,255,0.95)'); SK.tag(c, 'New', rx(0) - TW - 6, Y0 + n * s.dy + 6, 18, '#1a4a5a', 'rgba(140,240,255,0.95)'); SK.tag(c, 'Old', rx(0) + TW, Y0 + n * s.dy + 6, 18, '#fff6ea', 'rgba(90,42,106,0.9)'); }
      SK.animal(c, 'ant', 322, 630, 0.8, { t, pose: won ? 'cheer' : lost ? 'sad' : 'idle', expr: won ? 'laugh' : lost ? 'wow' : 'happy', facing: -1 });
      // guidance: unzip first, then each polymerase along its strand, the way its arrow points
      if (g.done || s.doneT) return; let a = null, b = null;
      if (!open) { a = [180, s.zip.y]; b = [180, BOT + 34]; }
      else if (s.L.built.some(v => !v)) { a = [s.L.x, s.L.y]; b = [s.L.x, BOT + 30]; }
      else if (s.R.p < s.R.pieces.length) { const [pa] = s.R.pieces[s.R.p]; a = [s.R.x, s.R.y]; b = [s.R.x, Y0 + pa * s.dy - 30]; }
      if (a && !s.drag) { SK.grab(c, g, a[0], a[1], 26); SK.arrow(c, g, a[0], a[1], b[0], b[1], { from: 30, to: 6 }); SK.target(c, g, b[0], b[1], 16); }
      SK.demo(g, c, 'drag', a || [180, 300], b || [180, 300], { never: !a });
    },
    auto(g, dt, synth) {
      const s = g.s; if (g.done || g.t < 0.7 || s.doneT) return; const B = s._rb = s._rb || { n: 0, at: 0 };
      if (B.cur) { if (SK.bot.drag(g, synth, 'q' + B.n, B.cur.t0, B.cur.a, B.cur.b, 0.5)) { B.n++; B.cur = null; B.at = g.t + 0.1; } return; }
      if (g.t < B.at) return; const open = s.fork >= BOT + 30;
      if (!open) B.cur = { t0: g.t, a: [180, s.zip.y], b: [180, BOT + 40] };
      else if (s.L.built.some(v => !v)) B.cur = { t0: g.t, a: [s.L.x, s.L.y], b: [s.L.x, BOT + 34] };
      else if (s.R.p < s.R.pieces.length) { const [pa] = s.R.pieces[s.R.p]; B.cur = { t0: g.t, a: [s.R.x, s.R.y], b: [s.R.x, Y0 + pa * s.dy - 34] }; }
    },
  });
})();
