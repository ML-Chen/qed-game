// _b7.js — B7, shared pieces for the "you are the computer" games (programs, apps, ai): the code panel (a tiny real
// Python program whose current line glows and whose misread line flashes), a small robot host, and the line icons
// that let a newcomer follow the code at level 0. Everything is drawn from g.t and the arguments, so it is deterministic.
const B7 = (() => {
  const TAU = Math.PI * 2;
  const MONO = 'ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", "Roboto Mono", "Droid Sans Mono", monospace';
  const KW = new Set(['for', 'in', 'def', 'if', 'else', 'elif', 'return', 'while', 'not', 'and', 'or', 'import', 'from', 'True', 'False', 'None', 'is', 'pass', 'break']);
  const BI = new Set(['range', 'print', 'len', 'input', 'int', 'str', 'list']);
  const COL = { kw: '#ff8fd0', fn: '#7fdcff', bi: '#9cf0c4', str: '#ffd27a', num: '#c4f08a', com: '#8f8ab0', id: '#f4f0ff', op: '#c9c2e4', self: '#ffb38a' };
  // split one line of Python into coloured pieces
  function tokens(line) {
    const out = []; let i = 0;
    while (i < line.length) {
      const ch = line[i], rest = line.slice(i);
      let m;
      if (ch === '#') { out.push([rest, 'com']); break; }
      if ((m = rest.match(/^("[^"]*"?|'[^']*'?)/))) { out.push([m[0], 'str']); i += m[0].length; continue; }
      if ((m = rest.match(/^\d+(\.\d+)?/))) { out.push([m[0], 'num']); i += m[0].length; continue; }
      if ((m = rest.match(/^[A-Za-z_][A-Za-z_0-9]*/))) {
        const w = m[0], next = line.slice(i + w.length).trimStart()[0];
        out.push([w, KW.has(w) ? 'kw' : BI.has(w) ? 'bi' : next === '(' ? 'fn' : 'id']); i += w.length; continue;
      }
      out.push([ch, ch === ' ' ? 'sp' : 'op']); i++;
    }
    return out;
  }
  // the editor panel. o: { x, y, w, lines, cur (index of the glowing line, or -1), size (font px, >= 18), lineH,
  //   flash: { line, t } (a line flashing red since g.t = t), icons: [name per line] (drawn at level <= iconLevel),
  //   iconLevel (default 0), done: [indices already run, drawn with a tick], dim (0..1 greys the whole panel),
  //   edit: { line, t } (a gold ring around a line being edited), hideTop (no window bar) }
  // Returns the layout: { x, y, w, h, top (y of the first line's centre), lineH, lineY(i), charW, textX }.
  function layout(o) {
    const size = o.size || 19, lineH = o.lineH || Math.round(size * 1.62), bar = o.hideTop ? 8 : 26;
    const n = o.lines.length, h = bar + n * lineH + 10, top = o.y + bar + lineH / 2 + 2;
    return { x: o.x, y: o.y, w: o.w, h, top, lineH, size, lineY: i => top + i * lineH, charW: size * 0.602, textX: o.x + 36 };
  }
  function panel(c, g, o) {
    const L = layout(o), { x, y, w, h, lineH, size } = L, t = g.t;
    c.save();
    // shadow and body
    c.fillStyle = 'rgba(16,8,30,0.35)'; c.beginPath(); c.roundRect(x + 3, y + 6, w, h, 14); c.fill();
    const bg = c.createLinearGradient(0, y, 0, y + h); bg.addColorStop(0, '#2b2650'); bg.addColorStop(1, '#1c1838');
    c.fillStyle = bg; c.beginPath(); c.roundRect(x, y, w, h, 14); c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.14)'; c.lineWidth = 2; c.stroke();
    if (!o.hideTop) { // window bar: three dots
      c.fillStyle = 'rgba(255,255,255,0.06)'; c.beginPath(); c.roundRect(x, y, w, 22, [14, 14, 0, 0]); c.fill();
      ['#ff6b6b', '#ffcc5a', '#5ad88a'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(x + 16 + i * 15, y + 11, 4.5, 0, TAU); c.fill(); });
    }
    c.font = `700 ${size}px ${MONO}`; c.textBaseline = 'middle';
    for (let i = 0; i < o.lines.length; i++) {
      const ly = L.lineY(i), isCur = i === o.cur;
      const fl = o.flash && o.flash.line === i ? t - o.flash.t : -1, flashing = fl >= 0 && fl < 1.6;
      if (isCur && !flashing) { // the glow: a warm bar with a soft halo, pulsing gently
        const p = 0.5 + 0.5 * Math.sin(t * 6);
        c.save(); c.shadowColor = 'rgba(255,214,90,0.9)'; c.shadowBlur = 12 + p * 8;
        const gr = c.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, 'rgba(255,206,84,0.5)'); gr.addColorStop(1, 'rgba(255,206,84,0.16)');
        c.fillStyle = gr; c.beginPath(); c.roundRect(x + 5, ly - lineH / 2 + 2, w - 10, lineH - 4, 8); c.fill(); c.restore();
        c.strokeStyle = `rgba(255,226,130,${0.6 + 0.4 * p})`; c.lineWidth = 2; c.beginPath(); c.roundRect(x + 5, ly - lineH / 2 + 2, w - 10, lineH - 4, 8); c.stroke();
        // the pointer in the gutter
        c.fillStyle = '#ffd45a'; const ax = x + 9 + p * 3; c.beginPath(); c.moveTo(ax, ly - 7); c.lineTo(ax + 11, ly); c.lineTo(ax, ly + 7); c.closePath(); c.fill();
      }
      if (flashing) { const on = Math.floor(fl * 7) % 2 === 0 ? 1 : 0.45; c.fillStyle = `rgba(255,70,90,${0.55 * on})`; c.beginPath(); c.roundRect(x + 5, ly - lineH / 2 + 2, w - 10, lineH - 4, 8); c.fill(); c.strokeStyle = `rgba(255,140,150,${on})`; c.lineWidth = 2.5; c.stroke(); }
      if (o.edit && o.edit.line === i) { const p = 0.5 + 0.5 * Math.sin(t * 7); c.save(); c.strokeStyle = `rgba(255,226,120,${0.5 + 0.5 * p})`; c.lineWidth = 3; c.setLineDash([7, 5]); c.lineDashOffset = -t * 30; c.beginPath(); c.roundRect(x + 4, ly - lineH / 2 + 1, w - 8, lineH - 2, 9); c.stroke(); c.restore(); }
      // line number, or a tick when the line has run
      if (!isCur || flashing) {
        if (o.done && o.done.includes(i)) { c.strokeStyle = '#7ee8a0'; c.lineWidth = 2.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + 11, ly); c.lineTo(x + 15, ly + 4); c.lineTo(x + 22, ly - 5); c.stroke(); }
        else { c.fillStyle = 'rgba(200,190,235,0.4)'; c.font = `700 ${Math.round(size * 0.72)}px ${MONO}`; c.textAlign = 'center'; c.fillText(String(i + 1), x + 18, ly + 1); c.font = `700 ${size}px ${MONO}`; }
      }
      // the code, coloured
      c.textAlign = 'left'; let cx = L.textX; const shake = flashing && fl < 0.5 ? Math.sin(fl * 60) * 3 * (1 - fl * 2) : 0;
      for (const [txt, k] of tokens(o.lines[i])) { if (k !== 'sp') { c.fillStyle = COL[k] || COL.id; c.fillText(txt, cx + shake, ly + 1); } cx += c.measureText(txt).width; }
      // the picture beside the line (level 0)
      const ic = o.icons && o.icons[i]; if (ic && g.level <= (o.iconLevel ?? 0)) icon(c, ic, x + w - 22, ly, 0.9, t);
    }
    if (o.dim) { c.fillStyle = `rgba(20,14,40,${0.5 * o.dim})`; c.beginPath(); c.roundRect(x, y, w, h, 14); c.fill(); }
    c.restore();
    return L;
  }
  // flash a misread line: set it in g.s so the panel draws it
  function flash(g, line) { g.s.b7flash = { line, t: g.t }; }

  // ---------- small pictures for lines ----------
  function arrow(c, ang, col) { c.save(); c.rotate(ang); c.fillStyle = col; c.strokeStyle = 'rgba(20,10,30,0.6)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-9, -4); c.lineTo(2, -4); c.lineTo(2, -9); c.lineTo(11, 0); c.lineTo(2, 9); c.lineTo(2, 4); c.lineTo(-9, 4); c.closePath(); c.fill(); c.stroke(); c.restore(); }
  function gem(c, x, y, s, col = '#5ee0ff', t = 0) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = P.shade(col, -0.25); c.beginPath(); c.moveTo(-10, -3); c.lineTo(-5, -9); c.lineTo(5, -9); c.lineTo(10, -3); c.lineTo(0, 11); c.closePath(); c.fill();
    c.fillStyle = col; c.beginPath(); c.moveTo(-10, -3); c.lineTo(10, -3); c.lineTo(0, 11); c.closePath(); c.fill();
    c.fillStyle = P.shade(col, 0.5); c.beginPath(); c.moveTo(-5, -9); c.lineTo(5, -9); c.lineTo(3, -3); c.lineTo(-3, -3); c.closePath(); c.fill();
    c.strokeStyle = P.shade(col, -0.55); c.lineWidth = 1.4; c.beginPath(); c.moveTo(-10, -3); c.lineTo(-5, -9); c.lineTo(5, -9); c.lineTo(10, -3); c.lineTo(0, 11); c.closePath(); c.stroke();
    const tw = 0.5 + 0.5 * Math.sin(t * 4 + x); c.fillStyle = `rgba(255,255,255,${0.5 + 0.5 * tw})`; c.beginPath(); c.arc(-4, -5, 1.8, 0, TAU); c.fill();
    c.restore();
  }
  function icon(c, name, x, y, s = 1, t = 0) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = 'rgba(255,255,255,0.1)'; c.beginPath(); c.roundRect(-15, -13, 30, 26, 7); c.fill();
    if (name === 'right' || name === 'fwd') arrow(c, 0, '#7ee8a0');
    else if (name === 'left') arrow(c, Math.PI, '#7ee8a0');
    else if (name === 'up') arrow(c, -Math.PI / 2, '#7ee8a0');
    else if (name === 'down') arrow(c, Math.PI / 2, '#7ee8a0');
    else if (name === 'gem') gem(c, 0, 0, 0.85, '#5ee0ff', t);
    else if (name === 'loop' || name === 'turnL' || name === 'turnR') {
      c.strokeStyle = name === 'loop' ? '#ffd45a' : '#ff9ad0'; c.lineWidth = 3.2; c.lineCap = 'round'; const d = name === 'turnR' ? -1 : 1;
      c.beginPath(); if (name === 'loop') c.arc(0, 0, 7.5, -2.6, 1.9); else c.arc(0, 0, 7.5, d > 0 ? -0.2 : Math.PI + 0.2, d > 0 ? -Math.PI * 1.3 : Math.PI * 2.3, d > 0); c.stroke();
      c.fillStyle = c.strokeStyle; const a = name === 'loop' ? 1.9 : d > 0 ? -Math.PI * 1.3 : Math.PI * 2.3, ex = Math.cos(a) * 7.5, ey = Math.sin(a) * 7.5;
      c.save(); c.translate(ex, ey); c.rotate(a + (name === 'turnL' ? -Math.PI / 2 : Math.PI / 2)); c.beginPath(); c.moveTo(-5, -1); c.lineTo(5, -1); c.lineTo(0, 6); c.closePath(); c.fill(); c.restore();
    }
    else if (name === 'plate') { c.fillStyle = '#fff6ea'; c.beginPath(); c.ellipse(0, 2, 11, 5, 0, 0, TAU); c.fill(); c.fillStyle = '#ffd45a'; c.fillRect(-4, -8, 9, 8); }
    else if (name === 'say') { c.fillStyle = '#fff6ea'; c.beginPath(); c.roundRect(-10, -8, 20, 13, 5); c.fill(); c.beginPath(); c.moveTo(-4, 5); c.lineTo(-7, 10); c.lineTo(1, 5); c.fill(); }
    else if (name === 'stop') { c.fillStyle = '#ff6b6b'; c.beginPath(); for (let k = 0; k < 8; k++) { const a = k / 8 * TAU + TAU / 16; c.lineTo(Math.cos(a) * 9, Math.sin(a) * 9); } c.fill(); }
    else if (name === 'check') { c.strokeStyle = '#7ee8a0'; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(-7, 0); c.lineTo(-2, 5); c.lineTo(8, -6); c.stroke(); }
    else if (name === 'lock') { c.strokeStyle = '#ffd45a'; c.lineWidth = 3; c.beginPath(); c.arc(0, -3, 5, Math.PI, 0); c.stroke(); c.fillStyle = '#ffd45a'; c.fillRect(-7, -3, 14, 11); }
    c.restore();
  }

  // ---------- the robot host ----------
  // feet at (x, y); o: { t, dir: 0 right, 1 down, 2 left, 3 up (where it looks), mood: 'idle' | 'happy' | 'sad' | 'wow',
  //   wet (0..1, dripping after a dunk), bob (walk phase), col (body colour), tilt (radians) }
  function robot(c, x, y, s = 1, o = {}) {
    const t = o.t || 0, dir = o.dir ?? 0, mood = o.mood || 'idle', col = o.col || '#4ac4cc';
    const dx = [1, 0, -1, 0][dir], dy = [0, 1, 0, -1][dir], bob = Math.abs(Math.sin((o.bob || 0) * Math.PI)) * 3 + (mood === 'happy' ? Math.abs(Math.sin(t * 9)) * 5 : 0);
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = 'rgba(20,10,30,0.25)'; c.beginPath(); c.ellipse(0, 0, 22, 6, 0, 0, TAU); c.fill();
    c.translate(0, -bob); if (o.tilt) c.rotate(o.tilt);
    // treads
    c.fillStyle = '#3a3448'; c.beginPath(); c.roundRect(-19, -12, 38, 12, 6); c.fill();
    c.fillStyle = '#6a6280'; for (let k = -1; k <= 1; k++) { c.beginPath(); c.arc(k * 11, -6, 3.6, 0, TAU); c.fill(); }
    // arms
    const up = mood === 'happy' ? 1 : 0, wv = Math.sin(t * 10) * 0.3 * up;
    c.strokeStyle = '#3a3448'; c.lineWidth = 4.5; c.lineCap = 'round';
    for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(sd * 16, -26); const ax = sd * (22 + up * 2), ay = up ? -44 + wv * sd * 10 : mood === 'sad' ? -14 : -18; c.lineTo(ax, ay); c.stroke(); c.fillStyle = '#ffb84a'; c.beginPath(); c.arc(ax, ay, 4, 0, TAU); c.fill(); }
    // body
    const bg = c.createLinearGradient(-18, -38, 18, -10); bg.addColorStop(0, P.shade(col, 0.35)); bg.addColorStop(1, P.shade(col, -0.2));
    c.fillStyle = bg; c.strokeStyle = P.shade(col, -0.6); c.lineWidth = 2; c.beginPath(); c.roundRect(-17, -36, 34, 26, 8); c.fill(); c.stroke();
    c.fillStyle = '#ffd45a'; c.beginPath(); c.arc(-7, -23, 3, 0, TAU); c.fill(); c.fillStyle = '#ff6b8a'; c.beginPath(); c.arc(2, -23, 3, 0, TAU); c.fill();
    // neck and head
    c.fillStyle = '#3a3448'; c.fillRect(-4, -40, 8, 5);
    c.fillStyle = '#f2f5fa'; c.strokeStyle = '#3a3448'; c.lineWidth = 2; c.beginPath(); c.roundRect(-20, -68, 40, 30, 10); c.fill(); c.stroke();
    // antenna with a blinking light
    c.beginPath(); c.moveTo(0, -68); c.lineTo(0, -78); c.stroke(); const bl = mood === 'sad' ? '#7a8aa0' : Math.sin(t * 5) > 0 ? '#ff5a6a' : '#ffb0b8';
    c.fillStyle = bl; c.beginPath(); c.arc(0, -80, 4, 0, TAU); c.fill();
    // the face screen
    if (dir === 3) { c.fillStyle = '#c8d0dc'; c.beginPath(); c.roundRect(-14, -63, 28, 20, 6); c.fill(); c.fillStyle = '#9aa4b4'; c.fillRect(-8, -56, 16, 3); }
    else {
      c.fillStyle = '#1d2a3a'; c.beginPath(); c.roundRect(-15, -64, 30, 22, 7); c.fill();
      const ex = dx * 4, ey = dy * 3, eyeC = mood === 'sad' ? '#7ab0ff' : '#7ff0ff';
      c.fillStyle = eyeC; c.strokeStyle = eyeC; c.lineWidth = 2.6; c.lineCap = 'round';
      for (const sd of [-1, 1]) {
        const qx = sd * 6 + ex, qy = -54 + ey;
        if (mood === 'happy') { c.beginPath(); c.arc(qx, qy + 2, 3.6, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
        else if (mood === 'wow') { c.beginPath(); c.arc(qx, qy, 4.2, 0, TAU); c.stroke(); }
        else if (mood === 'sad') { c.beginPath(); c.moveTo(qx - 3.5, qy - 1 - sd * 1.5); c.lineTo(qx + 3.5, qy - 1 + sd * 1.5); c.stroke(); }
        else { const blink = (t * 0.7 + 0.3) % 3 < 0.08; c.beginPath(); c.ellipse(qx, qy, 2.8, blink ? 0.6 : 3.6, 0, 0, TAU); c.fill(); }
      }
      c.strokeStyle = eyeC; c.lineWidth = 2; c.beginPath();
      if (mood === 'sad') c.arc(ex, -44 + ey, 4, Math.PI * 1.2, Math.PI * 1.8); else if (mood === 'wow') c.arc(ex, -47 + ey, 2.5, 0, TAU); else c.arc(ex, -50 + ey, 4, 0.2 * Math.PI, 0.8 * Math.PI);
      c.stroke();
    }
    // wet: a blue sheen and drips
    if (o.wet) {
      c.fillStyle = `rgba(90,170,255,${0.25 * o.wet})`; c.beginPath(); c.roundRect(-20, -68, 40, 58, 10); c.fill();
      for (let k = 0; k < 4; k++) { const q = (t * 1.3 + k * 0.27) % 1, px = -14 + k * 9; c.fillStyle = `rgba(120,190,255,${(1 - q) * o.wet})`; c.beginPath(); c.ellipse(px, -30 + q * 34, 2.2, 3.2, 0, 0, TAU); c.fill(); }
    }
    c.restore();
  }
  // a splash of water rising from (x, y), k = 0..1 through the splash
  function splash(c, x, y, k) {
    if (k <= 0 || k >= 1) return; c.save(); c.globalAlpha = 1 - k;
    c.fillStyle = '#bfe8ff'; for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.32, r = 14 + k * 50, h = Math.sin(k * Math.PI) * 30; c.beginPath(); c.arc(x + Math.cos(a) * r, y - h * (1 - Math.abs(i - 4) / 5) + Math.sin(a) * 6, 5 * (1 - k * 0.5), 0, TAU); c.fill(); }
    c.strokeStyle = '#e8f8ff'; c.lineWidth = 3; c.beginPath(); c.ellipse(x, y, 16 + k * 40, 5 + k * 10, 0, 0, TAU); c.stroke(); c.restore();
  }
  // a "found it" stamp or tag popping in (k = 0..1)
  function pop(k) { k = Math.max(0, Math.min(1, k)); return k < 0.7 ? 1.15 * (k / 0.7) : 1.15 - 0.15 * ((k - 0.7) / 0.3); }
  return { TAU, MONO, tokens, layout, panel, flash, icon, gem, robot, splash, pop, COL };
})();
