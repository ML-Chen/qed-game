// fractions_line.js — FRACTION LINE! Put a fraction on the number line: cut each whole into equal parts, then count parts.
// A garden fence at dusk, with fireflies. The top rail of the fence is the number line from 0 to 1 (0 to 2 at level 2),
// the fraction hangs above it on a wooden sign, and a rabbit sits on the rail at 0. Every move acts its working out:
//   1. Drag the bottom number (4) onto the rail (or tap it): the 4 is circled, the rail glows from 0 to 1, pegs drop
//      into the rail one by one at the cut points, and the equal parts light up in turn while they are counted 1, 2, 3, 4.
//   2. Drag the top number (3) onto the rabbit (or tap it): the 3 is circled and the rabbit hops one part at a time; at
//      each landing the peg sparkles and its name writes itself underneath: 1/4, 2/4, 3/4. On the last peg a glowing
//      point drops onto the rail, its label is circled, and the fraction on the sign lights up to match.
// Wrong moves: dragging the top number onto the rail first (cutting into 3 parts) flashes red cuts and wobbles; dragging
// the bottom number onto the rabbit wobbles. Level 0: thirds, quarters or fifths. Level 1: up to eighths. Level 2: a rail
// from 0 to 2 and a fraction greater than 1 (5/4). Medium mode: the tray asks how many parts, then how many hops.
const M = MK, INK = '#fff4dc', GOLD = '#ffd45a', SIGNHL = '#e8660a', LY = 358, X0 = 30, X1 = 330, LABY = LY + 58;
function pick(g) {
  const r = k => Math.floor(g.rand() * k), L = g.level;
  if (L === 0) { const d = 3 + r(3); return { den: d, num: d === 3 ? 2 : 2 + r(d - 2), W: 1 }; }
  if (L === 1) { const d = 5 + r(4); return { den: d, num: 2 + r(d - 2), W: 1 }; }
  const d = 3 + r(2); return { den: d, num: d + 1 + r(d - 1), W: 2 };
}
// the dusk backdrop: a violet-to-apricot sky, a low sun, far hills, a field of carrot rows
function paintBg(c, W, H) {
  const sk = c.createLinearGradient(0, 0, 0, 470); sk.addColorStop(0, '#2b2160'); sk.addColorStop(0.45, '#7a3f86'); sk.addColorStop(0.78, '#e47a7a'); sk.addColorStop(1, '#ffc27a');
  c.fillStyle = sk; c.fillRect(0, 0, W, H);
  const sun = c.createRadialGradient(276, 446, 4, 276, 446, 190); sun.addColorStop(0, 'rgba(255,236,170,0.95)'); sun.addColorStop(0.18, 'rgba(255,200,130,0.55)'); sun.addColorStop(1, 'rgba(255,170,120,0)');
  c.fillStyle = sun; c.fillRect(0, 200, W, 300); c.fillStyle = '#fff0c0'; c.beginPath(); c.arc(276, 446, 30, 0, 7); c.fill();
  const R = P.rng ? P.rng(11) : Math.random; for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(255,250,230,${0.25 + 0.5 * R()})`; c.beginPath(); c.arc(R() * W, R() * 180, R() * 1.2 + 0.3, 0, 7); c.fill(); }
  P.hills(c, W, 452, 26, '#6a3a6e', '#4a2a58', { seed: 5, dabs: 30 });
  P.hills(c, W, 478, 16, '#3e3a5a', '#2a2440', { seed: 8, dabs: 40 });
  const gr = c.createLinearGradient(0, 470, 0, H); gr.addColorStop(0, '#3a3046'); gr.addColorStop(1, '#241c30'); c.fillStyle = gr; c.fillRect(0, 476, W, H - 476);
  for (let row = 0; row < 4; row++) { const y = 500 + row * 36; c.fillStyle = 'rgba(20,12,24,0.45)'; c.fillRect(0, y + 6, W, 8);
    for (let x = 10 + (row % 2) * 14; x < W; x += 28) { c.strokeStyle = row % 2 ? '#4f8a4a' : '#5f9a52'; c.lineWidth = 3; c.lineCap = 'round'; for (const a of [-0.5, 0, 0.5]) { c.beginPath(); c.moveTo(x, y + 6); c.quadraticCurveTo(x + a * 8, y - 4, x + a * 12, y - 12); c.stroke(); }
      c.fillStyle = '#f08a3a'; c.beginPath(); c.moveTo(x - 4, y + 6); c.lineTo(x + 4, y + 6); c.lineTo(x, y + 14); c.fill(); } }
  // a branch across the top, which the sign hangs from
  c.strokeStyle = '#2a1830'; c.lineCap = 'round'; c.lineWidth = 10; c.beginPath(); c.moveTo(-10, 182); c.quadraticCurveTo(120, 168, 250, 176); c.stroke();
  c.lineWidth = 4; c.beginPath(); c.moveTo(170, 172); c.quadraticCurveTo(200, 150, 226, 146); c.moveTo(70, 176); c.quadraticCurveTo(54, 156, 40, 150); c.stroke();
  c.fillStyle = '#3a2a4a'; for (const [x, y] of [[226, 146], [40, 150], [250, 176], [120, 170]]) { c.beginPath(); c.ellipse(x, y, 12, 6, 0.4, 0, 7); c.fill(); }
}

MG.add({
  id: 'fractions_line', stage: 'fractions', cmd: 'FRACTION LINE!', hint: 'drag', time: 9, mood: 'night', winText: 'Right on!', hold: 1.6,
  card: {
    title: 'Fractions on a number line', ref: 'Grade 3', kind: 'Fractions',
    text: 'A fraction is a number, so it has its own place on the number line.\n\nThe bottom number says how many equal parts to cut each whole into. The top number says how many of those parts to count from 0.\n\nFor example, to find 3/4, cut the space from 0 to 1 into 4 equal parts. Each part is 1/4. Then hop 3 parts from 0: 1/4, 2/4, 3/4. That is where 3/4 lives.\n\nIf the top number is bigger than the bottom, you hop past 1. For 5/4 you count all 4 parts of the first whole and 1 more, so 5/4 is a little more than 1.',
    note: 'To place a/b: cut each whole into b equal parts, then count a parts from 0.',
    ask: 'Where is 2/3: closer to 0 or to 1? How many fifths are there from 0 to 1?',
  },
  init(g) {
    const S = g.s; M.setup(g); Object.assign(S, pick(g)); const { num, den, W } = S, T = M.pace(g);
    S.X = v => X0 + v * (X1 - X0) / W;
    S.nu = M.num(num, 'nu'); S.de = M.num(den, 'de');
    M.place(g, 'fr', M.frac(S.nu, S.de, 'frac'), 180, 228, 58, { col: '#3a1a10' });
    for (let w = 0; w <= W; w++) M.place(g, 'w' + w, M.num(w, 'w' + w), S.X(w), LABY + 14, 38, { col: INK });
    M.inert(g, ['frac', 'lbx']);
    M.zone(g, 'seg', { x: (X0 + X1) / 2, y: LY + 6, w: X1 - X0, h: 30 });
    S.bx = S.X(0); S.pegAt = {}; S.partAt = []; S.pos = 0;
    const setBun = () => M.zone(g, 'bun', { x: S.bx, y: LY - 32, w: 56, h: 66 });
    setBun(); S.setBun = setBun;
    const hop = (g, e) => { S.mk.lastMove = g.t; if (e) { S.face = e; S.faceT = g.t; } };
    const pegs = []; for (let k = 1; k < W * den; k++) if (k % den) pegs.push(k);
    // 1: cut into equal parts
    const pegT = Math.min(0.18, 0.75 / pegs.length) * T, cntT = Math.min(0.11, 0.7 / (W * den)) * T, cutLen = 0.15 * T + pegs.length * pegT + 0.15 * T + W * den * cntT + 0.35 * T;
    const cut = {
      busy: 0.1, askAt: 0.45 * T, after: cutLen, ask: { v: den, wrong: [num % den || num, den + 1, den - 1, 2 * den].filter(v => v > 1 && v !== den) },
      then(g) { S.cutStart = true; M.show(g, 0.45 * T); M.circle(g, 'de', { dur: 0.5 * T, col: GOLD }); M.light(g, 'de', { col: SIGNHL });
        S.glowAt = g.t; g.sfx('swoosh'); hop(g, 'think'); },
      resolve(g) { S.cut = true; M.show(g, cutLen); M.unlight(g, 'de', { delay: cutLen * 0.6 });
        const steps = pegs.map((k, i) => [0.15 * T + i * pegT, g => { S.pegAt[k] = g.t; g.sfx('tap'); }]);
        const c0 = 0.15 * T + pegs.length * pegT + 0.15 * T;
        for (let j = 0; j < W * den; j++) steps.push([c0 + j * cntT, g => { S.partAt[j] = g.t; if (j % 2 === 0) g.sfx('pop'); }]);
        steps.push([c0 + W * den * cntT + 0.05 * T, g => { hop(g, 'wow'); }]);
        M.at(g, steps); },
    };
    // 2: hop the top number of parts
    const hopT = Math.min(0.34, Math.max(0.24, 1.3 / num)) * T, hopLen = 0.1 * T + num * hopT + 0.9 * T;
    const hops = {
      busy: 0.1, askAt: 0.45 * T, after: hopLen, ask: { v: num, wrong: [den, num + 1, num - 1, den - num].filter(v => v > 0 && v !== num) },
      then(g) { S.hopStart = true; M.show(g, 0.45 * T); M.circle(g, 'nu', { dur: 0.5 * T, col: GOLD }); M.light(g, 'nu', { col: SIGNHL }); hop(g, 'happy'); g.sfx('swoosh'); },
      resolve(g) { S.hopped = true; M.show(g, hopLen);
        const steps = [];
        for (let k = 1; k <= num; k++) steps.push([0.1 * T + (k - 1) * hopT, g => { S.hop = { t0: g.t, dur: hopT * 0.92, xa: S.X((k - 1) / den), xb: S.X(k / den) }; g.sfx('whoosh'); },
        ], [0.1 * T + k * hopT - 0.02, g => { S.bx = S.X(k / den); S.pos = k; S.landAt = g.t; setBun(); g.sfx(k === num ? 'ding' : 'pop');
          if (k % den) { const lab = M.frac(M.num(k), M.num(den), 'lb' + k); M.place(g, 'lb' + k, lab, S.X(k / den), LABY + (k === num ? 4 : 0), k === num ? 40 : 31, { col: k === num ? '#ffe9a0' : INK }); M.writeIn(g, lab, { dur: Math.min(0.26, hopT * 0.8) }); M.inert(g, ['lb' + k]); }
          else M.indicate(g, 'w' + k / den, { dur: 0.35 * T, col: GOLD });
          M.sparkle(g, [S.X(k / den), LY + 2], { n: 6 }); }]);
        const e = 0.1 * T + num * hopT;
        steps.push([e + 0.1 * T, g => { S.dotAt = g.t; g.sfx('coin'); hop(g, 'laugh'); g.burst(S.X(num / den), LY + 6, ['#ffe9a0', '#fff', GOLD], 14, 140);
          const lb = num % den ? 'lb' + num : 'w' + num / den; M.circle(g, lb, { dur: 0.6 * T, col: GOLD }); M.indicate(g, 'frac', { delay: 0.15 * T, dur: 0.5 * T, sc: 1.12, col: SIGNHL }); }]);
        steps.push([e + 0.6 * T, g => { M.unlight(g, 'nu'); }]);
        M.at(g, steps); },
    };
    M.play(g, {
      moves(g) {
        if (!S.cutStart) return [{ drag: 'de', to: 'seg', area: [X0 - 20, LY - 70, X1 + 20, LY + 70], ...cut }, { tap: 'de', ...cut }];
        if (!S.hopStart) return [{ drag: 'nu', to: 'bun', area: [X0 - 30, LY - 110, X1 + 30, LY + 40], ...hops }, { tap: 'nu', ...hops }];
        return [];
      },
      area(g) { return !S.cutStart ? ['de', 'seg'] : ['nu', 'bun']; },
    });
  },
  update(g, dt) { M.update(g, dt); },
  down(g, x, y) { M.down(g, x, y); }, move(g, x, y) { M.move(g, x, y); }, up(g, x, y) { M.up(g, x, y); },
  auto(g, dt, synth) { M.auto(g, dt, synth); },
  draw(g, c) {
    const S = g.s, t = g.t, T = M.pace(g), mk = S.mk, { den, num, W } = S;
    c.drawImage(g.bake('fracline_bg', paintBg), 0, 0, 360, 640);
    // fireflies drifting over the field
    for (let i = 0; i < 14; i++) { const x = (i * 71 + Math.sin(t * 0.6 + i) * 24 + 360) % 360, y = 300 + (i * 37) % 260 + Math.cos(t * 0.8 + i * 2) * 12, a = 0.3 + 0.6 * Math.abs(Math.sin(t * 1.7 + i));
      c.fillStyle = `rgba(230,255,150,${a * 0.35})`; c.beginPath(); c.arc(x, y, 6, 0, 7); c.fill(); c.fillStyle = `rgba(240,255,170,${a})`; c.beginPath(); c.arc(x, y, 2, 0, 7); c.fill(); }
    // the fence: posts at the whole numbers, the top rail is the number line
    for (let w = 0; w <= W; w++) { const x = S.X(w); c.fillStyle = 'rgba(20,10,20,0.35)'; c.fillRect(x - 7, LY + 4, 18, 500 - LY); c.fillStyle = '#6a4630'; c.fillRect(x - 9, LY - 4, 18, 504 - LY); c.fillStyle = '#86603e'; c.fillRect(x - 9, LY - 4, 6, 504 - LY);
      c.fillStyle = '#5a3a26'; c.beginPath(); c.moveTo(x - 9, LY - 4); c.lineTo(x, LY - 14); c.lineTo(x + 9, LY - 4); c.fill(); }
    c.fillStyle = '#5a3a26'; c.fillRect(X0 - 18, 462, X1 - X0 + 36, 10);
    c.fillStyle = 'rgba(20,10,20,0.3)'; c.fillRect(X0 - 18, LY + 4, X1 - X0 + 36, 16);
    c.fillStyle = '#8a6040'; c.fillRect(X0 - 18, LY, X1 - X0 + 36, 14); c.fillStyle = '#b08058'; c.fillRect(X0 - 18, LY, X1 - X0 + 36, 3);
    // the glow running along the line from 0 to the end when the cut is chosen
    if (S.glowAt != null) { const k = M.clamp((t - S.glowAt) / (0.45 * T), 0, 1), fade = S.cut ? M.clamp(1 - (t - S.glowAt - 0.9 * T) / (0.4 * T), 0, 1) : 1;
      if (fade > 0) { c.save(); c.globalAlpha = fade; c.strokeStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 14; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(X0, LY + 6); c.lineTo(X0 + (X1 - X0) * M.easeIO(k), LY + 6); c.stroke(); c.restore(); } }
    // the equal parts light up one after another while they are counted
    const pw = (X1 - X0) / (W * den);
    for (let j = 0; j < S.partAt.length; j++) { const k = (t - S.partAt[j]) / (0.5 * T); if (k < 0 || k > 2.2) continue; const a = k < 1 ? 1 : 1 - (k - 1) / 1.2;
      c.save(); c.globalAlpha = M.clamp(a, 0, 1); c.fillStyle = j % 2 ? 'rgba(255,212,90,0.55)' : 'rgba(150,230,255,0.55)'; c.fillRect(X0 + j * pw + 2, LY - 2, pw - 4, 16);
      const sz = 24 * (1 + Math.max(0, 0.4 - k) * 1.2); c.font = M.NUMF(sz, 700); c.textAlign = 'center'; c.fillStyle = '#fff8e0'; c.shadowColor = 'rgba(20,8,30,0.9)'; c.shadowBlur = 6;
      c.fillText(String(j % den + 1), X0 + (j + 0.5) * pw, LY + 46); c.restore(); }
    // pegs at the cut points drop in from above and stick in the rail
    for (const k in S.pegAt) { const e = M.clamp((t - S.pegAt[k]) / (0.16 * T), 0, 1), x = S.X(k / den), y = LY - 18 - (1 - M.ease(e)) * 40, lit = S.pos == k && t - S.landAt < 0.5 ? 1 - (t - S.landAt) / 0.5 : 0;
      c.save(); c.globalAlpha = Math.min(1, e * 2); if (lit > 0) { c.shadowColor = GOLD; c.shadowBlur = 16 * lit; }
      c.fillStyle = lit > 0 ? M.mix('#f4ead8', GOLD, lit) : '#f4ead8'; c.fillRect(x - 3, y, 6, 38); c.fillStyle = '#c8a070'; c.fillRect(x - 3, y + 28, 6, 10); c.restore(); }
    // the point where the fraction lives
    if (S.dotAt != null) { const k = M.clamp((t - S.dotAt) / (0.25 * T), 0, 1), x = S.X(num / den), r = 9 * (1 + Math.sin(k * Math.PI) * 0.5);
      c.save(); c.shadowColor = GOLD; c.shadowBlur = 18; c.fillStyle = GOLD; c.strokeStyle = '#7a3a10'; c.lineWidth = 2.5; c.beginPath(); c.arc(x, LY + 6, r, 0, 7); c.fill(); c.stroke(); c.restore(); }
    // a wrong move acted out: the top number dropped onto the rail cuts it into the wrong number of parts (red, for a moment)
    if (mk.missInfo && mk.missInfo.drag === 'nu' && mk.missInfo.to === 'seg' && t - mk.missAt < 0.9) { const a = 1 - (t - mk.missAt) / 0.9, n = num % den || num;
      c.save(); c.globalAlpha = a; c.strokeStyle = '#ff6a5a'; c.lineWidth = 3; c.setLineDash([5, 4]); for (let k = 1; k < n * W; k++) { const x = X0 + k * (X1 - X0) / (n * W); c.beginPath(); c.moveTo(x, LY - 18); c.lineTo(x, LY + 22); c.stroke(); } c.restore(); }
    c.save(); c.shadowColor = 'rgba(20,8,30,0.9)'; c.shadowBlur = 7; for (let w = 0; w <= W; w++) M.drawEx(g, c, 'w' + w);
    for (let k = 1; k <= num; k++) M.drawEx(g, c, 'lb' + k); c.restore();
    // the fraction on a sign hanging from the branch
    const sw = 0; c.strokeStyle = '#d8c090'; c.lineWidth = 2; c.beginPath(); c.moveTo(148, 176); c.lineTo(150 + sw, 184); c.moveTo(212, 175); c.lineTo(210 + sw, 184); c.stroke();
    SCN.panel(c, 'sign', 180 + sw, 226, 94, 92, t);
    c.fillStyle = 'rgba(255,244,220,0.85)'; c.beginPath(); c.roundRect(145 + sw, 189, 70, 74, 10); c.fill();
    M.drawEx(g, c, 'fr');
    // the rabbit on the rail
    let bx = S.bx, by = LY - 1, pose = 'idle';
    if (S.hop && t < S.hop.t0 + S.hop.dur) { const k = M.clamp((t - S.hop.t0) / S.hop.dur, 0, 1); bx = M.lerp(S.hop.xa, S.hop.xb, M.easeIO(k)); by -= Math.sin(k * Math.PI) * 16; pose = 'hop'; }
    const won = g.done && g.result === 'win', lost = g.done && g.result === 'fail', missK = t - mk.missAt < 0.5;
    const expr = won ? 'laugh' : lost || missK ? 'sad' : S.faceT != null && t - S.faceT < 0.7 ? S.face : 'happy';
    if (won) pose = 'cheer'; else if (pose === 'idle' && mk.lastMove != null && t - mk.lastMove < 0.3) pose = 'hop';
    if (typeof ANI !== 'undefined') ANI.draw(c, 'rabbit', bx, by, 1.05, { t, pose, expr, noShadow: pose === 'hop' }); else P.sheep(c, bx, by, 0.6, { t });
    M.drawUI(g, c);
  },
});
