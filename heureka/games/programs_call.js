// CALL! (cs PR-19) — you are the computer, and the call stack is a pile of plates. Act out the glowing line: drag the
// robot right for forward(); at a call, drag a plate onto the pile (its sticky note says which line to come back to)
// and the glow jumps into the function; swipe up for jump() and the robot leaps a log; at return, tap the top plate and
// the glow goes back to the line on its note. Level 2: a function that calls another function needs two plates at once.
const PX = 14, PY = 124, PW = 332;
const PROGS = [
  { lines: ['def hop_log():', '    jump()', '    return', 'forward()', 'hop_log()', 'forward()', 'hop_log()', 'beep()'], start: 3, path: '. a L b c L d' },
  { lines: ['def hop_log():', '    jump()', '    return', 'forward()', 'hop_log()', 'hop_log()', 'beep()'], start: 3, path: '. a L b L c' },
  { lines: ['def hop_log():', '    jump()', '    return', 'def hop_two():', '    hop_log()', '    hop_log()', '    return', 'hop_two()', 'beep()'], start: 7, path: '. L b L c' },
];
const FN = { hop_log: 0, hop_two: 3 }; // where each function starts
function kindOf(ln) { const t = ln.trim(); if (t === 'forward()') return 'fwd'; if (t === 'jump()') return 'jump'; if (t === 'return') return 'pop'; if (t === 'beep()') return 'beep'; if (t.startsWith('def ')) return 'def'; return 'push'; }
function geoC(s) { const n = s.cells.length, w = Math.min(56, 300 / n); return { w, y: 590, at: k => 30 + w / 2 + k * w }; }
function plate(c, x, y, note, s = 1, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = 'rgba(30,20,40,0.25)'; c.beginPath(); c.ellipse(2, 5, 40, 9, 0, 0, 7); c.fill();
  c.fillStyle = '#f4f8ff'; c.strokeStyle = '#6a7aa0'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 0, 40, 10, 0, 0, 7); c.fill(); c.stroke();
  c.strokeStyle = '#a8c0e8'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(0, -1, 28, 6, 0, 0, 7); c.stroke();
  if (note != null) { c.save(); c.rotate(-0.08); c.fillStyle = '#ffe27a'; c.strokeStyle = '#c8a040'; c.lineWidth = 1.5; const nw = String(note).length > 2 ? 44 : 30; c.beginPath(); c.rect(-nw / 2, -30, nw, 24); c.fill(); c.stroke(); c.fillStyle = '#4a3010'; c.font = `800 18px ${B7.MONO}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(note), 0, -17); c.restore(); }
  c.restore();
}
function paintCallYard(o, s) {
  const g0 = o.createLinearGradient(0, 0, 0, 640); g0.addColorStop(0, '#d8eec0'); g0.addColorStop(0.5, '#b8dc98'); g0.addColorStop(1, '#88bc6a'); o.fillStyle = g0; o.fillRect(0, 0, 360, 640);
  o.fillStyle = '#f0e0c0'; o.fillRect(0, 116, 360, s.panelB - 100); // the kitchen wall behind the code
  o.fillStyle = 'rgba(180,140,100,0.25)'; for (let x = 0; x < 360; x += 24) for (let y = 116; y < s.panelB + 16; y += 24) if (((x + y) / 24) % 2 === 0) o.fillRect(x, y, 24, 24);
  // the counter where the plates live
  o.fillStyle = '#a0704a'; o.fillRect(0, s.panelB + 16, 360, 8);
  const G = geoC(s);
  P.grassTufts(o, 360, s.panelB + 40, 620, 18, '#5a9a46', 4);
  // the pond past the end of the path
  o.fillStyle = '#4a9ac8'; o.beginPath(); o.ellipse(G.at(s.cells.length) + 40, G.y + 10, 60, 26, 0, 0, 7); o.fill();
  // path tiles and the charger at the end
  s.cells.forEach((ch, k) => { const x = G.at(k); o.fillStyle = 'rgba(40,60,30,0.25)'; o.beginPath(); o.roundRect(x - G.w / 2 + 3, G.y - 8, G.w - 4, 24, 7); o.fill(); o.fillStyle = k === s.cells.length - 1 ? '#ffe08a' : '#d8cbb8'; o.beginPath(); o.roundRect(x - G.w / 2 + 2, G.y - 11, G.w - 4, 24, 7); o.fill(); });
  const ex = G.at(s.cells.length - 1); o.fillStyle = '#3a3a5a'; o.beginPath(); o.roundRect(ex + 6, G.y - 52, 18, 40, 4); o.fill(); o.fillStyle = '#7ee8a0'; o.fillRect(ex + 10, G.y - 46, 10, 8);
}
function logAt(c, x, y) { c.fillStyle = '#8a5a34'; c.strokeStyle = '#4a2a14'; c.lineWidth = 2; c.beginPath(); c.roundRect(x - 20, y - 26, 40, 22, 10); c.fill(); c.stroke(); c.fillStyle = '#c89a6a'; c.beginPath(); c.ellipse(x + 17, y - 15, 6, 10, 0, 0, 7); c.fill(); c.stroke(); c.strokeStyle = '#8a5a34'; c.beginPath(); c.ellipse(x + 17, y - 15, 2.5, 5, 0, 0, 7); c.stroke(); }
MG.add({
  id: 'cs_call', stage: 'programs', cmd: 'RETURN TO THE LINE ON THE PLATE!', time: 7, mood: 'bright', winText: 'Came back right!', failText: 'Went back wrong!',
  card: { title: 'Calling a function', kind: 'Computer science', ref: 'Function calls and the call stack',
    text: 'A function is a named set of steps, written once with def and used by calling its name. When the computer reaches a call, it notes the line to come back to, then jumps into the function.\n\nThe notes are kept in a pile called the call stack, like a pile of plates. Each call puts a plate on top. At return, the computer takes the top plate off and goes back to the line on its note.\n\nA function can call another function. Then two plates are on the pile, and the newest one comes off first.',
    note: 'A call jumps into the function and puts a note on the call stack; return takes the top note off and goes back.' },
  init(g) {
    const s = g.s, P0 = PROGS[Math.min(2, g.level)]; s.lines = P0.lines; s.pc = P0.start; s.cells = P0.path.split(' '); s.pos = 0; s.stack = []; s.anim = null; s.res = null; s.done = []; s.wrong = 0;
    const lay = B7.layout({ x: PX, y: PY, w: PW, lines: s.lines }); s.lay = lay; s.panelB = lay.y + lay.h;
    s.cup = { x: 64, y: s.panelB + 56 }; s.pile = { x: 280, y: s.panelB + 76 };
  },
  want(s) { return s.pc >= s.lines.length ? 'end' : kindOf(s.lines[s.pc]); },
  // the computer runs every line by itself, except return: there you tap the line written on the top plate
  update(g, dt) {
    const s = g.s; if (g.done) return; const a = s.anim, G = geoC(s);
    if (a && a.kind === 'dunk') { if (g.t - a.t0 > 0.8 && !s.res) { s.res = { t: g.t, win: false }; g.sfx('splash'); g.fail(); } return; }
    if (a && g.t - a.t0 > (a.kind === 'jump' ? 0.5 : 0.32)) s.anim = null;
    if (s.anim || g.t < (s.bt || 0.6)) return;
    const w = this.want(s); if (w === 'pop' || w === 'end') return;
    s.done = [s.pc];
    if (w === 'fwd') { s.anim = { kind: 'fwd', from: s.pos, to: s.pos + 1, t0: g.t }; s.pos++; g.sfx('whoosh'); s.pc++; }
    else if (w === 'jump') { s.anim = { kind: 'jump', from: s.pos, to: s.pos + 2, t0: g.t }; s.pos += 2; g.sfx('boing'); s.pc++; }
    else if (w === 'push') { const name = s.lines[s.pc].trim().replace('()', ''); s.stack.push({ back: s.pc + 1, t: g.t }); g.sfx('click'); s.jumpT = g.t; s.jumpFrom = s.pc; s.pc = FN[name] + 1; }
    else if (w === 'beep') { s.res = { t: g.t, win: true }; g.win(); g.sfx('bell'); g.sfx('cheer'); g.burst(G.at(s.pos), G.y - 60, ['#ffd45a', '#7ee8a0', '#fff'], 18, 150); return; }
    s.bt = g.t + 0.55;
  },
  down(g, x, y) {
    const s = g.s; SK.touched(g); if (g.done || s.anim || this.want(s) !== 'pop') return;
    if (x < PX || x > PX + PW) return; let li = -1; for (let i = 0; i < s.lines.length; i++) if (Math.abs(y - s.lay.lineY(i)) < s.lay.lineH / 2) li = i; if (li < 0) return;
    const top = s.stack[s.stack.length - 1];
    if (li === top.back) { s.stack.pop(); s.popped = { back: top.back, t: g.t, n: s.stack.length }; g.sfx('pop'); s.done = [s.pc]; s.pc = top.back; s.bt = g.t + 0.5; return; }
    // went back to the wrong line: the robot does that line's steps again from the wrong place and walks into the pond
    B7.flash(g, li); s.pc = li; g.sfx('wrong'); s.anim = { kind: 'dunk', from: s.pos, t0: g.t };
  },
  draw(g, c) {
    const s = g.s, t = g.t, G = geoC(s);
    c.drawImage(g.bake('cs_call' + Math.min(2, g.level), o => paintCallYard(o, s)), 0, 0, 360, 640);
    B7.panel(c, g, { x: PX, y: PY, w: PW, lines: s.lines, cur: s.res && s.res.win ? -1 : s.pc, flash: s.b7flash, done: s.done, icons: s.lines.map(l => ({ fwd: 'right', jump: 'up', push: 'plate', pop: 'plate', def: null }[kindOf(l)])) });
    // the jump into the function: a golden arc from the call line to the function's first line
    if (s.jumpT && t - s.jumpT < 0.5) { const k = (t - s.jumpT) / 0.5, from = s.lay.lineY(s.stack[s.stack.length - 1] ? s.stack[s.stack.length - 1].back - 1 : 0), to = s.lay.lineY(s.pc); c.save(); c.globalAlpha = 1 - k; c.strokeStyle = '#ffd45a'; c.lineWidth = 3; c.beginPath(); c.moveTo(PX + 30, from); c.quadraticCurveTo(PX - 6, (from + to) / 2, PX + 30, to); c.stroke(); c.restore(); }
    // logs on the path
    s.cells.forEach((ch, k) => { if (ch === 'L') logAt(c, G.at(k), G.y); });
    // the cupboard of clean plates, and the pile (the call stack) with its notes
    for (let i = 0; i < 4; i++) plate(c, s.cup.x, s.cup.y + 10 - i * 7, null, 0.9);
    s.stack.forEach((p, i) => { const k = Math.min(1, (t - p.t) / 0.25); plate(c, SK.lerp(s.cup.x, s.pile.x, k), SK.lerp(s.cup.y, s.pile.y - i * 12, k) - Math.sin(k * Math.PI) * 30, p.back + 1, 1, t); });
    if (s.popped && t - s.popped.t < 0.5) { const k = (t - s.popped.t) / 0.5; c.save(); c.globalAlpha = 1 - k; plate(c, s.pile.x + k * 60, s.pile.y - s.popped.n * 12 - k * 40, s.popped.back + 1, 1, t); c.restore();
      const ly = s.lay.lineY(s.popped.back); c.save(); c.globalAlpha = 1 - k; c.fillStyle = '#ffe27a'; c.font = `800 18px ${B7.MONO}`; c.fillText(String(s.popped.back + 1), SK.lerp(s.pile.x, PX + 12, k), SK.lerp(s.pile.y - 40, ly, k)); c.restore(); }
    SK.tag(c, 'Call stack', s.pile.x, s.pile.y + 30, 18);
    if (s.carry) plate(c, s.carry.x, s.carry.y, null, 1.05);
    // the robot
    let rx = G.at(s.pos), ry = G.y, lift = 0, sink = 0; const a = s.anim;
    if (a && a.kind !== 'dunk') { const k = Math.min(1, (t - a.t0) / (a.kind === 'jump' ? 0.5 : 0.32)); rx = SK.lerp(G.at(a.from), G.at(a.to), SK.easeInOut(k)); if (a.kind === 'jump') lift = Math.sin(k * Math.PI) * 56; }
    if (a && a.kind === 'dunk') { const k = Math.min(1, (t - a.t0) / 0.7); rx = SK.lerp(G.at(a.from), G.at(s.cells.length) + 40, k); lift = Math.sin(k * Math.PI) * 30; if (k > 0.8) sink = (k - 0.8) * 5; }
    if (s.res && !s.res.win) { rx = G.at(s.cells.length) + 40; sink = 1; B7.splash(c, rx, ry + 8, Math.min(1, (t - s.res.t) * 1.4)); }
    const oops = s.oops && t - s.oops < 0.5, won = s.res && s.res.win;
    c.save(); if (sink) { c.beginPath(); c.rect(0, 0, 360, ry); c.clip(); }
    B7.robot(c, rx, ry - lift + sink * 40, 0.78, { t, dir: 0, mood: won ? 'happy' : oops || s.res ? 'wow' : 'idle', wet: sink, tilt: oops ? Math.sin((t - s.oops) * 30) * 0.08 : 0 });
    c.restore();
    // guidance: at return the top plate glows, and the hand taps the line written on it
    if (!g.done && !s.anim && this.want(s) === 'pop') { const top = s.stack[s.stack.length - 1], py = s.pile.y - (s.stack.length - 1) * 12; SK.glow(c, g, s.pile.x, py - 16, 34); if (g.level === 0) SK.glow(c, g, PX + 120, s.lay.lineY(top.back), 26); SK.demo(g, c, 'tap', [PX + 90, s.lay.lineY(top.back)]); }
  },
  // the bot taps the line on the top plate at each return (B7FAIL: taps the first line of the program instead)
  auto(g, dt, synth) {
    const s = g.s; if (g.done || s.anim || this.want(s) !== 'pop' || g.t < (s.nb || 0)) return; s.nb = g.t + 0.3;
    const top = s.stack[s.stack.length - 1], li = typeof window !== 'undefined' && window.B7FAIL ? PROGS[Math.min(2, g.level)].start : top.back, y = s.lay.lineY(li);
    synth('down', PX + 90, y); synth('up', PX + 90, y);
  },
});
