// _n5.js — N5, small shared pieces for builder n5's games (robots, programs, apps): a code panel with a glowing line,
// a row of progress slots, a big push button, a paper envelope and a text pill. All drawn from g.t and the arguments.
const N5 = (() => {
  const TAU = Math.PI * 2;
  const MONO = 'ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", "Roboto Mono", monospace';
  const KW = new Set(['for', 'in', 'def', 'if', 'else', 'while', 'return', 'not', 'and', 'or', 'True', 'False', 'None', 'try', 'except', 'import']);
  const BI = new Set(['range', 'print', 'len', 'int', 'str', 'input', 'list']);
  const COL = { kw: '#ff8fd0', fn: '#7fdcff', bi: '#9cf0c4', str: '#ffd27a', num: '#c4f08a', com: '#8f8ab0', id: '#f4f0ff', op: '#c9c2e4' };
  function tokens(line) {
    const out = []; let i = 0;
    while (i < line.length) {
      const ch = line[i], rest = line.slice(i); let m;
      if (ch === '#') { out.push([rest, 'com']); break; }
      if ((m = rest.match(/^("[^"]*"?|'[^']*'?)/))) { out.push([m[0], 'str']); i += m[0].length; continue; }
      if ((m = rest.match(/^\d+/))) { out.push([m[0], 'num']); i += m[0].length; continue; }
      if ((m = rest.match(/^[A-Za-z_][A-Za-z_0-9]*/))) { const w = m[0], nx = line.slice(i + w.length).trimStart()[0]; out.push([w, KW.has(w) ? 'kw' : BI.has(w) ? 'bi' : nx === '(' ? 'fn' : 'id']); i += w.length; continue; }
      out.push([ch, 'op']); i++;
    }
    return out;
  }
  // panel(c, g, { x, y, w, lines, cur, size, lineH, flash: { line, t }, ok: [line indices drawn green] })
  // returns { lineY(i), lineH, h, textX, charW }
  function panel(c, g, o) {
    const size = o.size || 19, lineH = o.lineH || Math.round(size * 1.6), bar = 24, n = o.lines.length, h = bar + n * lineH + 10;
    const { x, y, w } = o, top = y + bar + lineH / 2 + 2, lineY = i => top + i * lineH, t = g.t;
    c.save();
    c.fillStyle = 'rgba(16,8,30,0.35)'; c.beginPath(); c.roundRect(x + 3, y + 6, w, h, 14); c.fill();
    const bg = c.createLinearGradient(0, y, 0, y + h); bg.addColorStop(0, '#2b2650'); bg.addColorStop(1, '#1c1838'); c.fillStyle = bg; c.beginPath(); c.roundRect(x, y, w, h, 14); c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.16)'; c.lineWidth = 2; c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.06)'; c.beginPath(); c.roundRect(x, y, w, 20, [14, 14, 0, 0]); c.fill();
    ['#ff6b6b', '#ffcc5a', '#5ad88a'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(x + 16 + i * 14, y + 10, 4, 0, TAU); c.fill(); });
    c.font = `700 ${size}px ${MONO}`; c.textBaseline = 'middle'; const charW = c.measureText('M').width, textX = x + 30;
    for (let i = 0; i < n; i++) {
      const ly = lineY(i), fl = o.flash && o.flash.line === i ? t - o.flash.t : -1;
      if (fl >= 0 && fl < 1.6) { c.fillStyle = `rgba(255,80,80,${0.55 * (0.5 + 0.5 * Math.cos(fl * 12))})`; c.beginPath(); c.roundRect(x + 5, ly - lineH / 2 + 2, w - 10, lineH - 4, 8); c.fill(); }
      else if (o.ok && o.ok.includes(i)) { c.fillStyle = 'rgba(90,216,138,0.28)'; c.beginPath(); c.roundRect(x + 5, ly - lineH / 2 + 2, w - 10, lineH - 4, 8); c.fill(); }
      else if (i === o.cur) {
        const p = 0.5 + 0.5 * Math.sin(t * 6); c.save(); c.shadowColor = 'rgba(255,214,90,0.9)'; c.shadowBlur = 10 + p * 8;
        c.fillStyle = 'rgba(255,206,84,0.38)'; c.beginPath(); c.roundRect(x + 5, ly - lineH / 2 + 2, w - 10, lineH - 4, 8); c.fill(); c.restore();
        c.strokeStyle = `rgba(255,226,130,${0.6 + 0.4 * p})`; c.lineWidth = 2; c.beginPath(); c.roundRect(x + 5, ly - lineH / 2 + 2, w - 10, lineH - 4, 8); c.stroke();
        c.fillStyle = '#ffd45a'; const ax = x + 8 + p * 3; c.beginPath(); c.moveTo(ax, ly - 7); c.lineTo(ax + 10, ly); c.lineTo(ax, ly + 7); c.closePath(); c.fill();
      }
      if (o.lines[i] == null) continue;
      let cx = textX; for (const [s, k] of tokens(o.lines[i])) { c.fillStyle = COL[k] || COL.id; c.fillText(s, cx, ly + 1); cx += c.measureText(s).width; }
    }
    c.restore();
    return { lineY, lineH, h, textX, charW, x, y, w };
  }
  // slots(c, done, n, x, y): n small circles, the first `done` filled with a tick (what's left to do)
  function slots(c, done, n, x, y, col = '#5ad88a') {
    const gap = 30, x0 = x - (n - 1) * gap / 2;
    c.save(); c.fillStyle = 'rgba(30,14,36,0.6)'; c.beginPath(); c.roundRect(x0 - 20, y - 16, (n - 1) * gap + 40, 32, 16); c.fill();
    for (let i = 0; i < n; i++) { const cx = x0 + i * gap; c.beginPath(); c.arc(cx, y, 10, 0, TAU); c.fillStyle = i < done ? col : 'rgba(255,255,255,0.14)'; c.fill(); c.strokeStyle = '#fff6ea'; c.lineWidth = 2; c.stroke();
      if (i < done) { c.strokeStyle = '#123a20'; c.lineWidth = 2.6; c.lineCap = 'round'; c.beginPath(); c.moveTo(cx - 4.5, y); c.lineTo(cx - 1, y + 4); c.lineTo(cx + 5, y - 4); c.stroke(); } }
    c.restore();
  }
  // a chunky push button with a label (pressed 0..1 sinks it)
  function button(c, x, y, w, h, label, col = '#e8803a', pressed = 0, size = 20) {
    c.save(); c.fillStyle = P.shade(col, -0.45); c.beginPath(); c.roundRect(x - w / 2, y - h / 2 + 5, w, h, h / 2); c.fill();
    const dy = pressed * 4; c.fillStyle = col; c.beginPath(); c.roundRect(x - w / 2, y - h / 2 + dy, w, h, h / 2); c.fill(); c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.stroke();
    c.font = `900 ${size}px Nunito, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff6ea'; c.fillText(label, x, y + dy + 1); c.restore();
  }
  // a paper envelope centred at (x, y), w wide; o: { col, seal, rot, text }
  function envelope(c, x, y, w = 40, o = {}) {
    const h = w * 0.66; c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot);
    c.fillStyle = 'rgba(30,14,36,0.22)'; c.beginPath(); c.roundRect(-w / 2 + 2, -h / 2 + 4, w, h, 4); c.fill();
    c.fillStyle = o.col || '#fff6ea'; c.strokeStyle = o.edge || '#6a5a8a'; c.lineWidth = 2; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 4); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-w / 2 + 2, -h / 2 + 2); c.lineTo(0, h * 0.12); c.lineTo(w / 2 - 2, -h / 2 + 2); c.stroke();
    if (o.seal) { c.fillStyle = o.seal; c.beginPath(); c.arc(0, h * 0.1, w * 0.12, 0, TAU); c.fill(); }
    if (o.text) { c.font = `900 ${Math.round(w * 0.36)}px Nunito, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = o.tcol || '#3a1640'; c.fillText(o.text, 0, h * 0.22); }
    c.restore();
  }
  // outlined bold text (for big numbers on a scene)
  function text(c, s, x, y, size = 20, col = '#fff6ea', o = {}) {
    c.save(); c.font = `900 ${size}px ${o.mono ? MONO : 'Nunito, system-ui, sans-serif'}`; c.textAlign = o.align || 'center'; c.textBaseline = 'middle';
    c.lineJoin = 'round'; c.lineWidth = o.lw ?? Math.max(3, size * 0.2); c.strokeStyle = o.edge || 'rgba(30,14,36,0.8)'; c.strokeText(s, x, y); c.fillStyle = col; c.fillText(s, x, y); c.restore();
  }
  return { TAU, MONO, panel, slots, button, envelope, text, tokens };
})();
