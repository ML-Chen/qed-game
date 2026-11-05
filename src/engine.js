// engine.js — the microgame engine (adapted from Holy Moly!): screens, input, the microgame loop, lives (acorns),
// the owl's second chance, stars, cards and saving.
// Microgames register themselves with MG.add({...}); see docs/MICROGAMES.md for the full contract.
const W = 360, H = 640;
// a jingle's length, kept finite and short so a strange audio value can never stall the run
function waitOf(w) { return Number.isFinite(w) && w > 0 ? Math.min(w, 4) : 1; }
const A = { // safe audio wrapper: the game works silently if audio.js is missing or fails
  call(fn, ...a) { try { if (typeof AUD !== 'undefined' && AUD[fn]) return AUD[fn](...a); } catch (e) { console.warn('audio', fn, e); } return 0; },
  sfx(n, o) { return A.call('sfx', n, o); }, jingle(n, s) { return A.call('jingle', n, s) || ({ ready: 1.6, win: 1.1, fail: 1.1, speedup: 1.8, grace: 2.2, gameover: 2.5, stagestart: 2, cleared: 2.5 }[n] || 1) / (s || 1); },
  music(n) { A.call('music', n); }, beat(on, o) { A.call('beat', on, o); }, tempo(b) { A.call('setTempo', b); }, babble(t, v) { return A.call('babble', t, v); },
};

// ---------------- microgame registry ----------------
const MG = {
  list: [], byId: {},
  add(def) { if (this.byId[def.id]) console.warn('duplicate microgame', def.id); def.time = def.time || 5; this.list.push(def); this.byId[def.id] = def; },
  forStage(st) { return this.list.filter(m => m.stage === st); },
};

// ---------------- stages ----------------
// host: person() options for the stage's host character. sky/ground: colours for the between-screen page.
// animal: the host's ANI kind (src/animals.js). grade: shown on the topic tile. sky/ground: colours for the between-screen page.
// An app built from this engine (Heurēka!, heureka/app.js) defines APP before the engine loads: its own topics, save
// key, card label and hidden settings. Q.E.D.! defines no APP and uses the list below.
const APPC = typeof APP !== 'undefined' ? APP : {};
const STAGES = APPC.stages || [ // ordered by grade; ids are stable (saves use them). Stages with no microgames yet are hidden.
  { id: 'carry', name: 'Adding and subtracting', grade: 'Grade 3', group: 'Grades 3–5', animal: 'ant', mood: 'bright', sky: ['#7ec8e8', '#bfe6f0', '#fff1c8'], ground: ['#c8a870', '#9a7a48'], line: 'When a column adds up to 10 or more, write the ones digit and carry the ten to the next column.' },
  { id: 'fractions', name: 'Fractions', grade: 'Grade 4', group: 'Grades 3–5', animal: 'rabbit', mood: 'bright', sky: ['#ffb0a0', '#ffd8b8', '#fff4e0'], ground: ['#a8d870', '#70a848'], line: 'To add fractions, first give them the same bottom number.' },
  { id: 'longway', name: 'Multiplying', grade: 'Grades 3–5', group: 'Grades 3–5', animal: 'ant', mood: 'party', sky: ['#8ac8f0', '#c8e8f8', '#fff8e0'], ground: ['#9ad070', '#6aa048'], line: 'Multiply one digit at a time, starting with the ones.' },
  { id: 'decimals', name: 'Decimals', grade: 'Grade 5', group: 'Grades 3–5', animal: 'owl', mood: 'bright', sky: ['#8ad0f0', '#c8e8f8', '#fffbe8'], ground: ['#a8d870', '#70a848'], line: "A decimal point separates the whole number from the parts of one." },
  { id: 'numbers', name: 'Factors and primes', grade: 'Grades 5–6', group: 'Grades 6–8', animal: 'owl', mood: 'night', sky: ['#1a1a48', '#3a3a7a', '#7a6aa0'], ground: ['#4a5a6a', '#2a3a4a'], line: 'Every whole number above 1 can be built by multiplying primes.' },
  { id: 'geometry', name: 'Area and angles', grade: 'Grades 3–8', group: 'Grades 6–8', animal: 'beaver', mood: 'bright', sky: ['#9ad0e8', '#d0ecf4', '#fff6e0'], ground: ['#b8c870', '#88984a'], line: "Area counts the unit squares inside a shape." },
  { id: 'integers', name: 'Negative numbers', grade: 'Grades 6–7', group: 'Grades 6–8', animal: 'penguin', mood: 'sea', sky: ['#7ab8e0', '#c0e0f2', '#f4fbff'], ground: ['#e8f2f8', '#b8d0e0'], line: "A number and its opposite add up to zero." },
  { id: 'letters', name: 'Expressions', grade: 'Grade 6', group: 'Grades 6–8', animal: 'fox', mood: 'bright', sky: ['#f0a070', '#f8c890', '#fff0d0'], ground: ['#c8b070', '#9a8048'], line: "A letter stands for a number we don't know yet." },
  { id: 'ratios', name: 'Ratios and percents', grade: 'Grades 6–7', group: 'Grades 6–8', animal: 'fox', mood: 'bright', sky: ['#f0b080', '#f8d0a8', '#fff4e0'], ground: ['#c8b070', '#9a8048'], line: "A percent is a number out of 100." },
  { id: 'stats', name: 'Data and dice', grade: 'Grades 6–7', group: 'Grades 6–8', animal: 'duck', mood: 'party', sky: ['#ff9ac0', '#ffc890', '#fff2d0'], ground: ['#a8d870', '#70a848'], line: 'Probability = ways it can happen ÷ all the equally likely outcomes.' },
  { id: 'twostep', name: 'Equations', grade: 'Grades 7–8', group: 'Grades 6–8', animal: 'penguin', mood: 'sea', sky: ['#6ab0e0', '#b8e0f0', '#f4fbff'], ground: ['#e8f2f8', '#b8d0e0'], line: 'Whatever you do to one side of an equation, do to the other side too.' },
  { id: 'powers', name: 'Exponents', grade: 'Grade 8', group: 'Grades 6–8', animal: 'rabbit', mood: 'bright', sky: ['#a8d8a0', '#d8f0c8', '#fffbe0'], ground: ['#8ac860', '#5a9a40'], line: 'When you multiply powers of the same number, add the exponents.' },
  { id: 'lines', name: 'Lines and systems', grade: 'Grade 8 · Algebra 1', group: 'High school', animal: 'bird', mood: 'bright', sky: ['#6ab8e8', '#b8e2f2', '#fff2cc'], ground: ['#9ad070', '#6aa048'], line: "Slope is how much a line rises for each step to the right." },
  { id: 'foil', name: 'Polynomials', grade: 'Algebra 1', group: 'High school', animal: 'hedgehog', mood: 'desert', sky: ['#e8a0c0', '#f8c8d8', '#fff0f0'], ground: ['#c8a870', '#9a7a48'], line: 'To multiply two brackets, multiply every term in one by every term in the other.' },
  { id: 'quadratics', name: 'Quadratics', grade: 'Algebra 1–2', group: 'High school', animal: 'hedgehog', mood: 'desert', sky: ['#e8a0c0', '#f8c8d8', '#fff0f0'], ground: ['#c8a870', '#9a7a48'], line: "A quadratic is zero where its graph crosses the x-axis." },
  { id: 'logs', name: 'Logarithms', grade: 'Algebra 2', group: 'High school', animal: 'beaver', mood: 'bright', sky: ['#7ab0d8', '#b8d8ec', '#f0f6e8'], ground: ['#7aa860', '#4a7a40'], line: 'A logarithm answers: what power do I need?' },
  { id: 'complex', name: 'Complex numbers', grade: 'Algebra 2', group: 'High school', animal: 'owl', mood: 'night', sky: ['#1a1a48', '#3a3a7a', '#7a6aa0'], ground: ['#4a5a6a', '#2a3a4a'], line: "i is a number whose square is −1." },
  { id: 'trig', name: 'Unit circle', grade: 'Trigonometry', group: 'High school', animal: 'owl', mood: 'night', sky: ['#1a2050', '#3a3a80', '#8a6ab0'], ground: ['#3a4a6a', '#1e2a40'], line: 'On the unit circle, cos is how far across and sin is how far up.' },
  { id: 'counting', name: 'Sequences and counting', grade: 'Precalculus', group: 'High school', animal: 'rabbit', mood: 'party', sky: ['#ff9ac0', '#ffc890', '#fff2d0'], ground: ['#a8d870', '#70a848'], line: "Counting carefully means counting every case exactly once." },
  { id: 'arrows', name: 'Vectors', grade: 'Precalculus', group: 'High school', animal: 'octopus', mood: 'sea', sky: ['#4ab0e8', '#9ad8f0', '#e8f8ff'], ground: ['#f2dca8', '#e0c080'], line: 'To add two arrows, put the tail of the second on the tip of the first.' },
  { id: 'matrices', name: 'Matrices', grade: 'Precalculus', group: 'High school', animal: 'octopus', mood: 'sea', sky: ['#2a6ab0', '#4a9ad0', '#a8e0f0'], ground: ['#e8d0a0', '#c0a070'], line: 'Each cell of a matrix product is a row times a column.' },
  { id: 'chance', name: 'Probability', grade: 'Statistics', group: 'Statistics', animal: 'owl', mood: 'night', sky: ['#2a2860', '#6a4a8a', '#c88a9a'], ground: ['#6a5a7a', '#4a3a5a'], line: "When two events don't affect each other, multiply their chances." },
  { id: 'limits', name: 'Limits', grade: 'Calculus', group: 'Calculus', animal: 'frog', mood: 'bright', sky: ['#88c8e8', '#c0e4f2', '#fff4e0'], ground: ['#8ac860', '#5a9a40'], line: "A limit is the value a function gets close to." },
  { id: 'derivs', name: 'Derivatives', grade: 'Calculus', group: 'Calculus', animal: 'frog', mood: 'bright', sky: ['#5aa8d8', '#9ad0e8', '#fbe8c0'], ground: ['#8ac860', '#5a9a40'], line: 'A derivative tells you how fast something is changing.' },
  { id: 'integrals', name: 'Integrals', grade: 'Calculus', group: 'Calculus', animal: 'beaver', mood: 'bright', sky: ['#88b8e0', '#c0dcf0', '#fff4e0'], ground: ['#8ab060', '#5a8040'], line: 'An integral adds up lots of tiny pieces.' },
  { id: 'series', name: 'Series', grade: 'Calculus', group: 'Calculus', animal: 'beaver', mood: 'bright', sky: ['#88b8e0', '#c0dcf0', '#fff4e0'], ground: ['#8ab060', '#5a8040'], line: "A series adds up the terms of a sequence." },
  { id: 'linalg', name: 'Linear algebra', grade: 'College', group: 'College', animal: 'octopus', mood: 'sea', sky: ['#2a6ab0', '#4a9ad0', '#a8e0f0'], ground: ['#e8d0a0', '#c0a070'], line: "A matrix moves every vector in the plane at once." },
  { id: 'modular', name: 'Number theory', grade: 'College', group: 'College', animal: 'owl', mood: 'night', sky: ['#1a2050', '#3a3a80', '#8a6ab0'], ground: ['#3a4a6a', '#1e2a40'], line: "Clock arithmetic wraps around when it reaches the modulus." },
  { id: 'logic', name: 'Logic and sets', grade: 'Discrete math', group: 'College', animal: 'fox', mood: 'night', sky: ['#2a2860', '#6a4a8a', '#c88a9a'], ground: ['#6a5a7a', '#4a3a5a'], line: "AND is true only when both parts are true." },
  { id: 'symmetry', name: 'Symmetry groups', grade: 'Abstract algebra', group: 'College', animal: 'turtle', mood: 'desert', sky: ['#f0a070', '#f8c890', '#fff0d0'], ground: ['#d8c080', '#a89050'], line: 'Doing one move and then another always equals a single move.' },
];

const STAGE = Object.fromEntries(STAGES.map(s => [s.id, s]));

// ---------------- save data ----------------
// Saves: written to this browser's local storage at once, and to the viewer's private storage on Claude's
// servers (the artifact 'db' capability, data/users/<id>/save) when the page runs inside Claude. On load the two
// are merged so nothing earned in either place is lost.
// settings: timer (false: the fuse never runs out and no acorn is lost), anim ('slow' | 'normal' | 'fast': how long the
// working animations take), speedups (false: the run never gets faster), steps ('auto' | 'tap': tap through the working beat by beat). Mode and sound are SAVE.d.mode and SAVE.d.muted.
// learn: { [microgame id]: { s: 'got' | 'confused', at } } from the check-in after each microgame.
const SETTINGS_DEFAULT = { timer: true, anim: 'normal', speedups: true, steps: 'auto' };
const SAVE = {
  key: APPC.saveKey || 'qed1', d: { best: {}, cleared: {}, cards: {}, remixBest: 0, muted: false, mode: 'easy', settings: { ...SETTINGS_DEFAULT }, learn: {}, savedAt: 0 },
  db: null, uid: null, busy: false, again: false, timer: null,
  // merge(a, b): union of cards and cleared stages, best scores, the newer settings, and per microgame the newer check-in
  merge(a, b) {
    a = a || {}; b = b || {}; const out = { best: {}, cleared: {}, cards: {}, learn: {}, remixBest: Math.max(a.remixBest || 0, b.remixBest || 0), savedAt: Math.max(a.savedAt || 0, b.savedAt || 0) };
    for (const k of ['cards', 'cleared']) out[k] = Object.assign({}, a[k] || {}, b[k] || {});
    for (const k of new Set([...Object.keys(a.best || {}), ...Object.keys(b.best || {})])) out.best[k] = Math.max((a.best || {})[k] || 0, (b.best || {})[k] || 0);
    const newer = (b.savedAt || 0) >= (a.savedAt || 0) ? b : a, older = newer === b ? a : b;
    out.muted = (newer.muted ?? older.muted) || false;
    out.mode = newer.mode || older.mode || 'easy';
    out.settings = { ...SETTINGS_DEFAULT, ...(older.settings || {}), ...(newer.settings || {}) };
    for (const src of [a.learn, b.learn]) for (const [id, v] of Object.entries(src || {})) if (v && (v.s === 'got' || v.s === 'confused') && (!out.learn[id] || (v.at || 0) >= (out.learn[id].at || 0))) out.learn[id] = { s: v.s, at: v.at || 0 };
    return out;
  },
  load() { try { const v = JSON.parse(localStorage.getItem(this.key) || 'null'); if (v) this.d = this.merge(this.d, v); } catch (e) { } },
  save() {
    this.d.savedAt = Date.now();
    try { localStorage.setItem(this.key, JSON.stringify(this.d)); } catch (e) { }
    clearTimeout(this.timer); this.timer = setTimeout(() => this.push(), 600);
  },
  async push() {
    if (!this.db || !this.uid) return; if (this.busy) { this.again = true; return; }
    this.busy = true;
    try { await this.db.doc('data/users/' + this.uid + '/save').set({ json: JSON.stringify(this.d), savedAt: this.d.savedAt }); } catch (e) { console.warn('cloud save failed', e && (e.code || e.message)); }
    this.busy = false; if (this.again) { this.again = false; this.push(); }
  },
  async connect() {
    try {
      if (!window.claude || !claude.use) return;
      const [db, user] = await Promise.all([claude.use('db'), claude.use('user')]); if (!db || !user) return;
      const uid = await user.id(); if (!uid) return;
      const snap = await Promise.race([db.doc('data/users/' + uid + '/save').get(), new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 10000))]);
      let remote = null; if (snap && snap.exists) { try { remote = JSON.parse(snap.data().json); } catch (e) { } }
      this.db = db; this.uid = uid;
      const before = JSON.stringify(this.d); this.d = this.merge(this.d, remote);
      try { localStorage.setItem(this.key, JSON.stringify(this.d)); } catch (e) { }
      if (!remote || JSON.stringify(remote) !== JSON.stringify(this.d)) this.push();
      if (before !== JSON.stringify(this.d)) { A.call('mute', !!this.d.muted); }
    } catch (e) { console.warn('cloud save unavailable', e && (e.code || e.message)); }
  },
};

function setting(k) { const s = SAVE.d.settings || {}; return s[k] ?? SETTINGS_DEFAULT[k]; }
function setSetting(k, v) { SAVE.d.settings = { ...SETTINGS_DEFAULT, ...(SAVE.d.settings || {}), [k]: v }; SAVE.save(); }
function timerOn() { return setting('timer') !== false; }
function learnOf(id) { const v = (SAVE.d.learn || {})[id]; return v ? v.s : null; }
// how much slower than normal a microgame's working plays (MK.pace multiplies by g.paceMul): the animation-speed
// setting, times 1.6 while the player's last check-in on it was "Confused", or 2 for a "Replay slower"
const ANIM_MUL = { slow: 1.5, normal: 1, fast: 0.75 }, CONFUSED_MUL = 1.6, REPLAY_MUL = 2;
// step mode (tap through the working): the Steps setting, or while the player's last check-in on this microgame was
// "Confused", or a "Replay slower"
function stepsFor(def, replay) { return setting('steps') === 'tap' || !!replay || learnOf(def.id) === 'confused'; }
function paceMulFor(def, replay) { return (ANIM_MUL[setting('anim')] || 1) * (replay ? REPLAY_MUL : learnOf(def.id) === 'confused' ? CONFUSED_MUL : 1); }

// ---------------- canvas, scaling and input ----------------
const cv = document.getElementById('game'), ctx = cv.getContext('2d');
let scale = 1, offX = 0, offY = 0, DPR = 1;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 3); const vw = window.innerWidth, vh = window.innerHeight;
  scale = Math.min(vw / W, vh / H); cv.width = Math.round(vw * DPR); cv.height = Math.round(vh * DPR); cv.style.width = vw + 'px'; cv.style.height = vh + 'px';
  offX = (vw - W * scale) / 2; offY = (vh - H * scale) / 2;
}
window.addEventListener('resize', resize); resize();
const ptr = { x: 0, y: 0, down: false, sx: 0, sy: 0, st: 0, path: [] };
function toLogical(e) { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left - offX) / scale, (e.clientY - r.top - offY) / scale]; }
cv.addEventListener('pointerdown', e => { e.preventDefault(); A.call('unlock'); const [x, y] = toLogical(e); if (!CV.list && !SET.open && (tryPause(x, y) || tryRewind(x, y))) return; ptr.x = x; ptr.y = y; ptr.down = true; ptr.sx = x; ptr.sy = y; ptr.st = performance.now(); ptr.path = [[x, y, ptr.st]]; input('down', x, y); try { cv.setPointerCapture(e.pointerId); } catch (_) { } });
cv.addEventListener('pointermove', e => { const [x, y] = toLogical(e); ptr.x = x; ptr.y = y; if (ptr.down) { ptr.path.push([x, y, performance.now()]); if (ptr.path.length > 12) ptr.path.shift(); input('move', x, y); } });
const endPtr = e => { if (!ptr.down) return; const [x, y] = toLogical(e); ptr.down = false; input('up', x, y); const dt = performance.now() - ptr.st, dx = x - ptr.sx, dy = y - ptr.sy; if (Math.hypot(dx, dy) > 28 && dt < 650) input('swipe', dx, dy, dx / Math.max(dt, 1) * 1000, dy / Math.max(dt, 1) * 1000); };
cv.addEventListener('pointerup', endPtr); cv.addEventListener('pointercancel', endPtr);
// iPhones and iPads only allow audio to start on a touch-up or tap, not on touch-down
for (const ev of ['touchend', 'click', 'pointerup', 'keydown']) window.addEventListener(ev, () => A.call('unlock'), { passive: true });
window.addEventListener('keydown', e => { if (e.key !== 'Escape' && e.key !== 'p' && e.key !== 'P') return; if (SET.open) { if (e.key === 'Escape') closeSettings(); return; } if (run && run.rewind) { if (e.key === 'Escape') closeRewind(); return; } if (run && run.paused) resumeRun(); else if (scene === 'run' && run && run.phase !== 'over' && !CV.list) pauseRun(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { A.call('pause'); if (scene === 'run' && run && run.phase !== 'over' && !CV.list && !SET.open) pauseRun(); } else if (!(run && run.paused)) A.call('resume'); });

// ---------------- shared effects (particles, floating text, shake) ----------------
const FX = {
  parts: [], texts: [], shakeT: 0, shakeA: 0,
  burst(x, y, cols = ['#ffd45a', '#ff8a5a', '#fff'], n = 14, spd = 160) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = spd * (0.4 + Math.random() * 0.8); this.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, life: 0.7 + Math.random() * 0.5, age: 0, col: cols[i % cols.length], r: 2 + Math.random() * 3, star: Math.random() < 0.3 }); } },
  float(text, x, y, col = '#fff6dc', size = 26) { this.texts.push({ text, x, y, col, size, age: 0 }); },
  shake(a = 6, t = 0.25) { this.shakeA = a; this.shakeT = t; },
  clear() { this.parts = []; this.texts = []; this.shakeT = 0; },
  update(dt) { for (const p of this.parts) { p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 380 * dt; p.vx *= 0.99; } this.parts = this.parts.filter(p => p.age < p.life); for (const t of this.texts) t.age += dt; this.texts = this.texts.filter(t => t.age < 1.1); if (this.shakeT > 0) this.shakeT -= dt; },
  draw(c) {
    for (const p of this.parts) { c.globalAlpha = Math.max(0, 1 - p.age / p.life); c.fillStyle = p.col; if (p.star) drawStar(c, p.x, p.y, p.r * 1.8, p.age * 6); else { c.beginPath(); c.arc(p.x, p.y, p.r, 0, 7); c.fill(); } }
    c.globalAlpha = 1;
    for (const t of this.texts) { const k = t.age / 1.1; c.globalAlpha = 1 - k * k; P.command(c, t.text, t.x, t.y - k * 40, t.size, 0.8 + Math.min(1, t.age * 8) * 0.2, { tilt: 0 }); }
    c.globalAlpha = 1;
  },
};
function drawStar(c, x, y, r, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.beginPath(); for (let i = 0; i < 10; i++) { const rr = i % 2 ? r * 0.45 : r, a = i * Math.PI / 5 - Math.PI / 2; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function button(c, x, y, w, h, text, opts = {}) {
  const { top = '#ffe08a', bot = '#f2a33a', edge = '#7a3a1a', ink = '#5a2414', size = 22, pressed = false } = opts;
  c.save(); c.translate(0, pressed ? 3 : 0); c.fillStyle = 'rgba(60,20,60,0.3)'; roundRect(c, x - w / 2, y - h / 2 + 5, w, h, h / 2); c.fill();
  const g = c.createLinearGradient(0, y - h / 2, 0, y + h / 2); g.addColorStop(0, top); g.addColorStop(1, bot); c.fillStyle = g; roundRect(c, x - w / 2, y - h / 2, w, h, h / 2); c.fill(); c.strokeStyle = edge; c.lineWidth = 3; c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.35)'; roundRect(c, x - w / 2 + 8, y - h / 2 + 4, w - 16, h * 0.32, h * 0.16); c.fill();
  P.label(c, text, x, y + 1, size, ink, 'center', 900); c.restore();
}

// bake(key, drawFn): paint a static background once into an offscreen canvas (2x for crispness) and reuse it every frame.
const BAKED = {};
function bake(key, drawFn, w = W, h = H) {
  if (BAKED[key]) return BAKED[key];
  const off = document.createElement('canvas'); off.width = w * 2; off.height = h * 2; const o = off.getContext('2d'); o.scale(2, 2);
  try { drawFn(o, w, h); } catch (e) { console.error('bake', key, e); }
  return BAKED[key] = off;
}

// ---------------- input-type icons (help kids who can't read the command yet) ----------------
function hintIcon(c, kind, x, y, t) {
  c.save(); c.translate(x, y); c.globalAlpha = 0.95;
  const hand = (hx, hy, s = 1) => { c.save(); c.translate(hx, hy); c.scale(s, s); c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(-4, -18); c.quadraticCurveTo(-4, -24, 0, -24); c.quadraticCurveTo(4, -24, 4, -18); c.lineTo(4, -6); c.lineTo(12, -4); c.quadraticCurveTo(16, -2, 15, 6); c.lineTo(12, 14); c.lineTo(-6, 14); c.lineTo(-12, 2); c.quadraticCurveTo(-13, -2, -9, -2); c.lineTo(-4, 2); c.closePath(); c.fill(); c.stroke(); c.restore(); };
  if (kind === 'tap' || kind === 'mash') { const k = kind === 'mash' ? 10 : 4, p = Math.abs(Math.sin(t * k)); c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 3; c.beginPath(); c.arc(0, -26, 8 + p * 8, 0, 7); c.stroke(); hand(0, p * 4, 1); }
  else if (kind === 'swipe') { const p = (t * 1.5) % 1; c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(-26, -26); c.lineTo(26, -26); c.stroke(); hand(-24 + p * 48, 0, 1); }
  else if (kind === 'drag') { const p = (Math.sin(t * 3) + 1) / 2; hand(-18 + p * 36, -p * 10, 1); }
  else if (kind === 'hold') { const p = Math.min(1, (t * 0.8) % 1.2); c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineWidth = 4; c.beginPath(); c.arc(0, -26, 12, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2); c.stroke(); hand(0, 2, 1); }
  else if (kind === 'still') { hand(0, 0, 1); c.strokeStyle = '#e04a4a'; c.lineWidth = 5; c.beginPath(); c.arc(0, -4, 24, 0, 7); c.moveTo(-17, 13); c.lineTo(17, -21); c.stroke(); }
  c.restore();
}

// ---------------- the run (one stage, or remix) ----------------
const RUN_LEN = 12, SPEED_EVERY = 4;
let scene = 'title', run = null, ui = { pressed: null, cardOpen: null, cardScroll: 0 }, T = 0;
const testMode = /[?&]test=1/.test(location.search);

// Time is generous so players can learn what is happening: 3x the microgame's base time at level 0, 2.2x at level 1,
// 1.6x at level 2, and another 1.4x until the player has won it once (its card is unlocked). Medium mode adds 40%.
// Speed-ups shorten it gently. Stars are measured against the base time (g.par), not the fuse, so fast play still shows.
function timeFactor(def, level, mode) {
  return [3, 2.2, 1.6][Math.min(2, level)] * (SAVE.d.cards[def.id] ? 1 : 1.4) * (mode === 'medium' ? 1.4 : 1);
}
// mode: 'easy' (taps and drags; the animations do the arithmetic) or 'medium' (also pick each result from a tray; more time)
// paceMul: how much longer the working animations take (MK.pace); by default from the settings and the check-ins
function makeG(def, level, speed, silent, mode, paceMul) {
  mode = mode || SAVE.d.mode || 'easy';
  const g = {
    W, H, def, level, speed, mode, t: 0, paceMul: paceMul ?? paceMulFor(def), dur: def.time * timeFactor(def, level, mode) / (1 + (speed - 1) * 0.35), tf: timeFactor(def, level, mode), s: {}, done: false, result: null, doneAt: 0, ptr, held: 0, // held: seconds the fuse stood still while a show-your-work animation played
    fuse() { return this.t - this.held; },
    win() { if (this.done) return; this.done = true; this.result = 'win'; this.doneAt = this.t; if (!silent) A.sfx('chime'); },
    fail() { if (this.done) return; this.done = true; this.result = 'fail'; this.doneAt = this.t; if (!silent) A.sfx('fail'); },
    sfx: (n, o) => silent ? 0 : A.sfx(n, o), burst: (...a) => FX.burst(...a), float: (...a) => FX.float(...a), shake: (...a) => FX.shake(...a),
    bake, left() { return Math.max(0, this.dur - this.fuse()); },
  };
  // rec: everything the rewind scrubber needs to re-play this microgame exactly: each frame's dt, every input event
  // (k = how many updates came before it) and every random number drawn outside drawing
  g.rec = { dts: [], ev: [], rand: [] };
  g.rand = () => { const v = Math.random(); if (!g._norec) g.rec.rand.push(v); return v; };
  return g;
}
// The run's order: shuffled rounds of the pool. A microgame the player marked "Got it" joins each round only
// 40% of the time, so the ones still being learned come up more often (a round is never empty).
const MASTERED_ODDS = 0.4;
function playlist(stageId, only) {
  const pool = only ? [MG.byId[only]] : stageId === 'remix' ? MG.list.slice() : MG.forStage(stageId);
  const out = []; let last = null;
  while (out.length < (stageId === 'remix' ? 400 : RUN_LEN)) {
    let sh = pool.filter(d => learnOf(d.id) !== 'got' || Math.random() < MASTERED_ODDS); if (!sh.length) sh = [pool[Math.floor(Math.random() * pool.length)]];
    if (sh.length === 1 && sh[0] === last && pool.length > 1) { const others = pool.filter(d => d !== last); sh.push(others[Math.floor(Math.random() * others.length)]); }
    sh.sort(() => Math.random() - 0.5); if (sh[0] === last && sh.length > 1) sh.push(sh.shift()); out.push(...sh); last = out[out.length - 1];
  }
  return out;
}
function holdOf(g) { return g.def.hold ?? 1.3; } // seconds the result stays on screen (math games show the right answer)
function startRun(stageId, only) {
  const st = STAGE[stageId] || { id: 'remix', name: 'Remix', mood: 'party', sky: ['#ff9ac0', '#ffc890', '#fff2d0'], ground: ['#b8d870', '#80a848'], animal: 'owl', line: 'Every topic, all mixed up.' };
  run = { stage: st, only: only || null, list: playlist(st.id, only), i: 0, loaves: 4, graceUsed: false, speed: 1, cleared: 0, phase: 'intro', pt: 0, wait: 0, g: null, newCards: [], lostLoafAt: -1, bpm: 108, stars: 0, last: null, checkin: null, final: null, replays: 0 };
  scene = 'run'; A.music(null); run.wait = waitOf(A.jingle('stagestart', 1)); A.babble(st.line, 'woman');
}
// replay: play the microgame just finished again (a new problem at the same level) with its working at half speed.
// A replay costs no acorn and does not count toward the 12 games, the speed-ups, the score or the stars.
function nextMicro(replay) {
  let def, level;
  if (replay && run.last) { def = run.last.def; level = run.last.level; run.replays++; }
  else {
    if (run.stage.id !== 'remix' && run.i >= RUN_LEN) return finishRun(true);
    if (!run.list[run.i]) run.list.push(...playlist(run.stage.id, run.only)); // remix ran past its list
    def = run.list[run.i]; level = Math.min(2, Math.floor(run.i / 4)); // guidance fades: games 1-4 level 0, 5-8 level 1, 9-12 level 2
  }
  run.g = makeG(def, level, run.speed, false, undefined, paceMulFor(def, replay)); run.g.replay = !!replay; run.g.steps = stepsFor(def, replay); run.checkin = null; FX.clear();
  try { def.init && def.init(run.g); } catch (e) { console.error(def.id, 'init', e); run.g.win(); }
  run.phase = 'play'; run.pt = 0; A.beat(true, { bpm: run.bpm, mood: def.mood || run.stage.mood });
}
// The screen between microgames. After a microgame it also shows the check-in (Got it / Confused / Replay slower) and
// waits a little longer. final: 'won' or 'lost' when the run ends after this screen.
const CHECKIN_WAIT = APPC.checkin === false ? 1.8 : 2.5, CHECKIN_GO = 0.35;
function between(final) {
  run.phase = 'between'; run.pt = 0; run.final = final || null; A.beat(false); run.wait = final ? 0 : waitOf(A.jingle('ready', run.speed));
  run.checkin = run.last ? { def: run.last.def, choice: null, at: 0 } : null;
  if (final && !run.checkin) return finishRun(final === 'won');
}
function betweenDone() {
  if (run.checkin && run.checkin.choice) return run.pt > run.checkin.at + CHECKIN_GO;
  return run.pt > Math.max(run.checkin ? CHECKIN_WAIT : 1.0, run.wait * 0.92);
}
function leaveBetween() {
  const ck = run.checkin;
  if (ck && ck.choice === 'replay') return nextMicro(true);
  if (run.final) return finishRun(run.final === 'won');
  nextMicro();
}
// the player's answer to the check-in. got: saved, and the microgame comes up less often. confused: saved, the
// microgame comes back later in this run, and its working plays slower until a later "Got it". replay: play it again now.
// An app with APP.checkin === false (Heurēka!: "all of these should be very intuitive") shows one button instead, which
// opens the microgame's card for a curious player; the run waits while the card is open.
const CHECKIN = APPC.checkin === false ? [{ id: 'card', label: 'How it works', y: 526 }] : [{ id: 'got', label: 'Got it!', y: 466 }, { id: 'confused', label: 'Confused', y: 526 }, { id: 'replay', label: 'Replay slower', y: 586 }], CHECKIN_BOX = { x: 248, w: 184, h: 52 };
function checkIn(choice) {
  const ck = run && run.checkin; if (!ck || ck.choice) return;
  if (choice === 'card') { if (ck.def.card && ck.def.card.text) { openCards([ck.def], 0, 'browse'); A.sfx('chime'); } return; }
  ck.choice = choice; ck.at = run.pt; const id = ck.def.id;
  if (choice === 'got' || choice === 'confused') { SAVE.d.learn = SAVE.d.learn || {}; SAVE.d.learn[id] = { s: choice, at: Date.now() }; SAVE.save(); }
  if (choice === 'confused') requeue(ck.def);
  A.sfx(choice === 'got' ? 'chime' : 'pop');
}
// put a microgame back into the run a couple of games from now (within the 12 games of a topic run)
function requeue(def) {
  if (run.final || run.only) return;
  const end = run.stage.id === 'remix' ? run.i + 3 : RUN_LEN; if (run.i >= end) return;
  const at = Math.max(run.i, Math.min(run.i + 2, end - 1)); run.list.splice(at, 0, def); run.requeued = (run.requeued || 0) + 1;
}
function endMicro() {
  const g = run.g; A.beat(false); run.phase = 'result'; run.pt = 0; run.last = { def: g.def, level: g.level, result: g.result, g };
  const unlock = () => { const id = g.def.id; if (!SAVE.d.cards[id]) { SAVE.d.cards[id] = 1; run.newCards.push(id); SAVE.save(); } };
  if (g.replay) { A.jingle(g.result === 'win' ? 'win' : 'fail', run.speed); if (g.result === 'win') unlock(); return; } // a replay changes nothing in the run
  if (g.result === 'win') { run.cleared++; run.stars += g.stars || 0; A.jingle('win', run.speed); unlock(); }
  else { if (timerOn()) { run.loaves--; run.lostLoafAt = T; } A.jingle('fail', run.speed); } // with the timer off no acorn is ever lost
  run.i++;
}
function afterResult() {
  if (run.g && run.g.replay) return between(run.final); // back to the check-in, without a speed-up
  if (run.loaves <= 0 && !run.graceUsed) { run.graceUsed = true; run.phase = 'grace'; run.pt = 0; run.wait = waitOf(A.jingle('grace', 1)); return; }
  if (run.loaves <= 0) return between('lost');
  continueRun();
}
// after a result (or after grace gives a loaf back): end the stage after game 12, speed up every 4 games (unless the
// speed-ups setting is off), else show the next number
function continueRun() {
  if (run.stage.id !== 'remix' && run.i >= RUN_LEN) return between('won');
  if (run.i % SPEED_EVERY === 0 && setting('speedups') !== false) { run.speed = +(run.speed + 0.25).toFixed(2); run.bpm = Math.round(108 * (1 + (run.speed - 1) * 0.7)); run.phase = 'speedup'; run.pt = 0; run.wait = waitOf(A.jingle('speedup', run.speed)); return; }
  between();
}
function finishRun(cleared) {
  run.phase = 'over'; run.pt = 0; run.won = cleared; A.beat(false);
  const id = run.stage.id;
  if (id === 'remix') SAVE.d.remixBest = Math.max(SAVE.d.remixBest, run.cleared); else if (!run.only) { SAVE.d.best[id] = Math.max(SAVE.d.best[id] || 0, run.cleared); if (cleared) SAVE.d.cleared[id] = 1; }
  SAVE.save(); A.jingle(cleared ? 'cleared' : 'gameover', 1);
  if (run.newCards.length) { const ids = run.newCards.slice(), r0 = run; setTimeout(() => { if (scene === 'run' && run === r0 && run.phase === 'over') { openCards(ids.map(id => MG.byId[id]), 0, 'reward'); A.sfx('chime'); } }, 1600); } setTimeout(() => { if (scene === 'run' && run && run.phase === 'over') A.music('results'); }, 2600);
}
function updateRun(dt) {
  if (CV.list && run.phase === 'between') return; // the player is reading the card they opened from the screen between games
  run.pt += dt;
  if (run.phase === 'intro' && run.pt > Math.max(2.2, run.wait, 1.2 + run.stage.line.split(' ').length * 0.3)) between(); // time to read the host's sentence (a tap skips it)
  else if (run.phase === 'between' && betweenDone()) leaveBetween();
  else if (run.phase === 'play') {
    const g = run.g;
    tickMicro(g, dt, (g, d) => { g.t += d; g.rec.dts.push(d);
      try { g.def.update && g.def.update(g, d); } catch (e) { console.error(g.def.id, 'update', e); }
      if (testMode && g.def.auto && window.HM_AUTO) { g._norec = true; try { g.def.auto(g, d, synth); } catch (e) { console.error(g.def.id, 'auto', e); } g._norec = false; } }); // the bot's own random numbers are not part of the replay (its moves are recorded as input)
    if (!g.done && timerOn() && g.fuse() >= g.dur) { /* timer off: the fuse (hidden) never runs out */ g.rec.ev.push({ k: g.rec.dts.length, type: 'timeout' }); if (g.def.winOnTimeout) g.win(); else g.fail(); }
    if (g.done && g.t - g.doneAt > holdOf(g)) endMicro();
  }
  else if (run.phase === 'result' && run.pt > 0.9 / Math.sqrt(run.speed)) afterResult();
  else if (run.phase === 'speedup' && run.pt > Math.max(1.6, run.wait)) between();
  else if (run.phase === 'grace' && run.pt > 3.6) { run.loaves = 1; continueRun(); }
  // watchdog: no screen between games may last more than 8 seconds, and no game may run 3 seconds past its fuse
  else if (run.phase === 'play' && !run.g.done && timerOn() && run.g.fuse() > run.g.dur + 3) { console.error(run.g.def.id, 'watchdog'); run.g.rec.ev.push({ k: run.g.rec.dts.length, type: 'fail' }); run.g.fail(); }
  else if (run.phase === 'play' && run.g.done && run.g.t - run.g.doneAt > 3) endMicro();
  else if (run.phase !== 'over' && run.phase !== 'play' && run.pt > 8) { console.error('watchdog', run.phase); if (run.phase === 'between') leaveBetween(); else if (run.phase === 'result') afterResult(); else if (run.phase === 'grace') { run.loaves = 1; continueRun(); } else between(); }
}
// ---------------- step mode: tap through the working ----------------
// The owner: "maybe if I had to tap through every step, it would be clearer." With g.steps on, the microgame's clock
// stops just before each beat of working (MK.stepStop) and waits for a tap anywhere; a small "tap ▸" cue pulses at
// the bottom. Everything runs on g.t, so while it waits nothing moves and the fuse stands still. A tap while a beat is
// still playing fast-forwards it to the next stop. Step taps are not moves (never misses) and are not recorded, and
// neither are the frames spent waiting, so the rewind copy (which plays without stops) matches the live game exactly.
const STEP_EPS = 1e-4, STEP_FF = 8, STEP_BOT_WAIT = 0.3;
// tickMicro(g, dt, adv): one frame of a live microgame; adv(g, d) advances its clock by d and updates it once
function tickMicro(g, dt, adv) {
  if (!g.steps || g.done || typeof MK === 'undefined' || !g.s.mk) { adv(g, dt); return; }
  if (g.stepWait) { g.stepWaitT = (g.stepWaitT || 0) + dt; if (testMode && window.HM_AUTO && g.stepWaitT > STEP_BOT_WAIT) { synth('down', 180, 600); synth('up', 180, 600); } return; } // the test bot taps through
  let left = g.stepFF ? Math.max(dt, 1 / 60) * STEP_FF : dt;
  while (left > 1e-9 && !g.stepWait && !g.done) {
    const d = Math.min(left, 1 / 60), stop = MK.stepStop(g);
    if (g.t + d >= stop - STEP_EPS) { adv(g, Math.max(0, stop - STEP_EPS - g.t)); g.stepWait = true; g.stepAt = stop; g.stepWaitT = 0; g.stepFF = false; g.stepCount = (g.stepCount || 0) + 1; break; }
    adv(g, d); left -= d;
    if (g.stepFF && !MK.stepBusy(g)) g.stepFF = false;
  }
}
// a tap in step mode: go on from the stop, or finish the beat that is playing
function stepTap(g) { if (g.stepWait) { MK.stepGo(g, g.stepAt); g.stepWait = false; A.sfx('tap'); } else g.stepFF = true; }
// true when this input event is a step tap (or the rest of one) rather than a move
function stepInput(g, type) {
  if (!g.steps || typeof MK === 'undefined' || !g.s.mk) return false;
  if (type === 'down') { g.stepSwallow = false; if (g.stepWait || (MK.stepBusy(g) && g.s.mk.busyT > 0)) { stepTap(g); g.stepSwallow = true; return true; } return false; }
  if (g.stepSwallow) { if (type === 'swipe') g.stepSwallow = false; return true; }
  return false;
}
// the cue that says the game is waiting for a tap: small, at the bottom centre, pulsing gently
function drawStepCue(c, g, t) {
  if (!g.stepWait || g.done) return; const k = Math.min(1, (g.stepWaitT || 0) * 5), p = 0.5 + 0.5 * Math.sin(t * 4);
  c.save(); c.globalAlpha = k * (0.78 + 0.22 * p); c.translate(180, 596); c.scale(1 + 0.04 * p, 1 + 0.04 * p);
  c.fillStyle = 'rgba(30,14,36,0.74)'; roundRect(c, -38, -15, 76, 30, 15); c.fill(); c.strokeStyle = 'rgba(255,246,234,0.5)'; c.lineWidth = 1.5; c.stroke();
  P.label(c, 'tap', -8, 1, 18, '#fff6ea', 'center', 900);
  c.fillStyle = '#ffd45a'; c.beginPath(); c.moveTo(14 + 3 * p, -7); c.lineTo(25 + 3 * p, 0); c.lineTo(14 + 3 * p, 7); c.closePath(); c.fill();
  c.restore();
}
// synthetic input for automated tests: synth('down', x, y) etc.
function synth(type, ...a) { if (type === 'down') { ptr.down = true; ptr.x = a[0]; ptr.y = a[1]; ptr.sx = a[0]; ptr.sy = a[1]; } if (type === 'move') { ptr.x = a[0]; ptr.y = a[1]; } if (type === 'up') ptr.down = false; input(type, ...a); }

function input(type, x, y, vx, vy) {
  if (SET.open) { settingsInput(type, x, y); return; }
  if (CV.list) { cardInput(type, x, y); return; }
  if (scene === 'run' && run) {
    if (run.rewind) { rewindInput(type, x, y); return; }
    if (run.paused) { pauseInput(type, x, y); return; }
    if (run.phase === 'intro' && type === 'down' && run.pt > 0.6 && !hit(x, y, 336, 24, 52, 52)) { between(); return; }
    if (run.phase === 'between' && type === 'down' && run.checkin && !run.checkin.choice) { for (const b of CHECKIN) if (hit(x, y, CHECKIN_BOX.x, b.y, CHECKIN_BOX.w + 8, CHECKIN_BOX.h + 6)) { press('ck:' + b.id); checkIn(b.id); return; } return; }
    if (run.phase === 'play') { const g = run.g, d = g.def; if (g.done) return; if (stepInput(g, type)) return; g.rec.ev.push({ k: g.rec.dts.length, type, a: [x, y, vx, vy] }); const nr = g._norec; g._norec = false; try { if (d[type]) d[type](g, x, y, vx, vy); } catch (e) { console.error(d.id, type, e); } g._norec = nr; return; }
    if (run.phase === 'over' && type === 'down') { if (hit(x, y, 180, 548, 220, 56)) { press('again'); A.sfx('pop'); setTimeout(() => startRun(run.stage.id, run.only), 140); } else if (hit(x, y, 180, 612, 160, 40)) { press('home'); A.sfx('click'); setTimeout(() => goStages(), 120); } }
    return;
  }
  // Cards grid: open a card on a tap (finger up without much movement), so a drag that starts on a card scrolls the grid
  if (scene === 'cards') {
    if (type === 'down') { ui.tapStart = { x, y }; if (hit(x, y, 30, 30, 44, 44)) { scene = 'title'; A.sfx('click'); } return; }
    if (type === 'up' && ui.tapStart) { const st = ui.tapStart; ui.tapStart = null; if (Math.hypot(x - st.x, y - st.y) > 10) return;
      const owned = storyOrder().filter(d => SAVE.d.cards[d.id]); for (const c of cardTiles()) if (hit(x, y, c.x, c.y, c.w, c.h) && SAVE.d.cards[c.def.id]) { openCards(owned, owned.indexOf(c.def), 'browse'); A.sfx('chime'); return; } }
    return;
  }
  if (scene === 'stages' && ui.stageTap && (type === 'move' || type === 'up')) {
    const st = ui.stageTap; if (type === 'move') { ui.stageScroll = Math.max(0, Math.min(stageScrollMax(), st.sc - (y - st.y))); return; }
    ui.stageTap = null; if (Math.hypot(x - st.x, y - st.y) > 10) return;
    if (y > LIST_BOT) return;
    if (y < 62) return;
    for (const r of stageRows()) { if (y < r.y || y > r.y + r.h || x < 18 || x > 342) continue; press(r.id);
      if (r.kind === 'remix') { A.sfx('pop'); setTimeout(() => startRun('remix'), 140); }
      else if (r.kind === 'stage') { A.sfx('click'); ui.openStage = ui.openStage === r.id ? null : r.id; ui.stageScroll = Math.min(ui.stageScroll || 0, stageScrollMax()); }
      else if (r.kind === 'all') { A.sfx('pop'); setTimeout(() => startRun(r.st.id), 140); }
      else if (r.kind === 'mg') { A.sfx('pop'); setTimeout(() => startRun(r.st.id, r.def.id), 140); }
      return; }
    return;
  }
  if (type !== 'down') return;
  if (scene === 'title') { if (hit(x, y, 180, 300, 180, 60)) { press('play'); A.sfx('pop'); A.music('title'); setTimeout(goStages, 120); } else if (hit(x, y, 180, 372, 150, 46)) { press('cards'); A.sfx('click'); setTimeout(() => { scene = 'cards'; }, 120); } else if (hit(x, y, 330, 30, 44, 44)) toggleMute(); else if (hit(x, y, 30, 30, 44, 44)) openSettings(); else A.music('title'); return; }
  if (scene === 'stages') {
    if (hit(x, y, 30, 30, 44, 44)) { scene = 'title'; A.sfx('click'); return; }
    if (hit(x, y, 330, 30, 44, 44)) { openSettings(); return; }
    ui.stageTap = { x, y, sc: ui.stageScroll || 0 }; return;
  }
}
function hit(x, y, cx, cy, w, h) { return Math.abs(x - cx) <= w / 2 && Math.abs(y - cy) <= h / 2; }
function press(id) { ui.pressed = id; setTimeout(() => { if (ui.pressed === id) ui.pressed = null; }, 160); }
// ---------------- pause ----------------
// The pause bar: a compact bar along the top edge, so the paused microgame stays fully visible (the owner's rule).
// Only its buttons do anything; a tap on the game itself does not resume.
const PAUSE_BTN = { x: 336, y: 24, r: 26 }, PAUSE_BAR = { y: 38, h: 54, x0: 8, x1: 352 };
const PAUSE_ITEMS = [{ id: 'resume', w: 128 }, { id: 'rewind', w: 56 }, { id: 'settings', w: 56 }, { id: 'quit', w: 80 }];
function pauseItems() { // laid out left to right; the rewind button only when there is something to rewind
  const list = PAUSE_ITEMS.filter(b => b.id !== 'rewind' || rewindAvailable()), gap = 8, total = list.reduce((a, b) => a + b.w, 0) + gap * (list.length - 1);
  let x = (W - total) / 2; return list.map(b => { const o = { ...b, x: x + b.w / 2, y: PAUSE_BAR.y, h: PAUSE_BAR.h - 10 }; x += b.w + gap; return o; });
}
function tryPause(x, y) { if (scene !== 'run' || !run || run.paused || run.rewind || run.phase === 'over') return false; if (Math.hypot(x - PAUSE_BTN.x, y - PAUSE_BTN.y) > PAUSE_BTN.r) return false; pauseRun(); return true; }
function pauseRun() { if (!run || run.paused) return; run.paused = true; run.pausedAt = T; ptr.down = false; A.sfx('click'); A.beat(false); setTimeout(() => { if (run && run.paused) A.call('pause'); }, 120); }
function resumeRun() { if (!run || !run.paused) return; run.paused = false; A.call('resume'); A.sfx('pop'); if (run.phase === 'play') A.beat(true, { bpm: run.bpm, mood: run.g.def.mood || run.stage.mood }); }
function pauseInput(type, x, y) {
  if (type !== 'down') return;
  for (const b of pauseItems()) { if (!hit(x, y, b.x, b.y, b.w + 4, PAUSE_BAR.h)) continue; press('p:' + b.id);
    if (b.id === 'resume') setTimeout(resumeRun, 120);
    else if (b.id === 'quit') { A.call('resume'); A.sfx('click'); setTimeout(goStages, 120); }
    else if (b.id === 'settings') openSettings();
    else if (b.id === 'rewind') openRewind();
    return; }
}
function pauseIcon(c, x, y) { c.save(); c.translate(x, y); c.fillStyle = 'rgba(40,20,50,0.38)'; c.beginPath(); c.arc(0, 0, 18, 0, 7); c.fill(); c.fillStyle = '#fff6ea'; roundRect(c, -7, -8, 5, 16, 2); c.fill(); roundRect(c, 2, -8, 5, 16, 2); c.fill(); c.restore(); }
function drawPause(c, t) {
  const B = PAUSE_BAR; c.save(); c.fillStyle = 'rgba(30,14,36,0.3)'; roundRect(c, B.x0, B.y - B.h / 2 + 4, B.x1 - B.x0, B.h, 20); c.fill();
  c.fillStyle = 'rgba(46,22,54,0.86)'; roundRect(c, B.x0, B.y - B.h / 2, B.x1 - B.x0, B.h, 20); c.fill(); c.strokeStyle = 'rgba(255,246,234,0.35)'; c.lineWidth = 1.5; c.stroke(); c.restore();
  const light = { size: 19, top: '#fff6ea', bot: '#e8d2b0', edge: '#7a4a3a' };
  for (const b of pauseItems()) {
    const pr = ui.pressed === 'p:' + b.id;
    if (b.id === 'resume') { button(c, b.x, b.y, b.w, b.h, '', { pressed: pr }); const dy = pr ? 3 : 0; c.fillStyle = '#5a2414'; c.beginPath(); c.moveTo(b.x - 47, b.y - 9 + dy); c.lineTo(b.x - 34, b.y + dy); c.lineTo(b.x - 47, b.y + 9 + dy); c.closePath(); c.fill(); P.label(c, 'Resume', b.x + 13, b.y + 1 + dy, 21, '#5a2414', 'center', 900); }
    else if (b.id === 'quit') button(c, b.x, b.y, b.w, b.h, 'Quit', { ...light, pressed: pr });
    else { button(c, b.x, b.y, b.w, b.h, '', { ...light, pressed: pr }); const dy = pr ? 3 : 0; if (b.id === 'settings') gearGlyph(c, b.x, b.y + dy, 1, '#5a2414', '#f3e0c4'); else rewindGlyph(c, b.x, b.y + dy, 1, '#5a2414'); }
  }
}
// ---------------- rewind: scrub back through the microgame's working ----------------
// The owner: "a rewind button that lets you scrub through the previous steps and see the animations undo in real time".
// A microgame's state is full of closures, so it can't be copied. Instead every frame's dt, every input event and every
// random number of the live microgame are recorded (g.rec), and the scrubber shows time t by re-playing a hidden copy
// from init with the same inputs up to t (updates only; for the last 0.45 s MK.track also runs, so symbols are caught
// mid-glide), then drawing that copy. Going forward steps the same copy on; going back rebuilds it. It is view only:
// closing returns to the live microgame exactly as it was.
const REWIND_BTN = { x: 288, y: 24, r: 24 }, RW = { y: 600, x0: 82, x1: 334, play: [40, 600], close: [336, 24] }, RW_TRACK = 0.45;
function rewindTarget() { // the microgame the scrubber would show: the one being played, or the one just finished
  if (!run) return null;
  if ((run.phase === 'play' || run.phase === 'result') && run.g && run.g.rec) return run.g;
  if (run.phase === 'between' && run.last && run.last.g && run.last.g.rec && !(run.checkin && run.checkin.choice)) return run.last.g;
  return null;
}
function rewindAvailable() { const g = rewindTarget(); return !!g && g.rec.dts.length > 20; }
function tryRewind(x, y) { if (scene !== 'run' || !run || run.paused || run.rewind || !rewindAvailable()) return false; if (Math.hypot(x - REWIND_BTN.x, y - REWIND_BTN.y) > REWIND_BTN.r) return false; openRewind(); return true; }
function openRewind() {
  const g = rewindTarget(); if (!g) return;
  run.rewind = { g, tEnd: g.t, t: g.t, sim: null, playing: false, drag: null, marks: ((g.s.mk && g.s.mk.log) || []).filter(m => m <= g.t), cost: 0 };
  ptr.down = false; A.beat(false); A.sfx('swoosh');
}
function closeRewind() { if (!run || !run.rewind) return; run.rewind = null; A.sfx('click'); if (run.phase === 'play' && !run.paused) A.beat(true, { bpm: run.bpm, mood: run.g.def.mood || run.stage.mood }); }
// a hidden copy of the microgame, re-played from init with the recorded inputs
function simNew(live) {
  const def = live.def, rec = live.rec, sg = makeG(def, live.level, live.speed, true, live.mode, live.paceMul); sg.replay = live.replay; sg.sim = true;
  let ri = 0; sg.rand = () => sg._norec ? Math.random() : ri < rec.rand.length ? rec.rand[ri++] : Math.random();
  const fx = Object.assign(Object.create(FX), { parts: [], texts: [], shakeT: 0, shakeA: 0 });
  sg.burst = (...a) => fx.burst(...a); sg.float = (...a) => fx.float(...a); sg.shake = () => { };
  sg.ptr = { x: 0, y: 0, down: false, sx: 0, sy: 0, st: 0, path: [] };
  const S = { g: sg, fx, rec, def, n: 0, ei: 0 };
  try { def.init && def.init(sg); } catch (e) { console.error(def.id, 'rewind init', e); }
  return S;
}
function simEvents(S) { // apply the input recorded after S.n updates
  const g = S.g, ev = S.rec.ev;
  while (S.ei < ev.length && ev[S.ei].k <= S.n) { const e = ev[S.ei++];
    if (e.type === 'timeout') { if (!g.done) { if (S.def.winOnTimeout) g.win(); else g.fail(); } continue; }
    if (e.type === 'fail') { g.fail(); continue; }
    const [x, y] = e.a; if (e.type === 'down') Object.assign(g.ptr, { down: true, x, y, sx: x, sy: y }); else if (e.type === 'move') Object.assign(g.ptr, { x, y }); else if (e.type === 'up') g.ptr.down = false;
    if (!g.done && S.def[e.type]) { try { S.def[e.type](g, ...e.a); } catch (err) { console.error(S.def.id, 'rewind', e.type, err); } } }
}
function simStep(S, track) {
  simEvents(S); const dt = S.rec.dts[S.n]; if (dt == null) return false;
  const g = S.g; g.t += dt; try { S.def.update && S.def.update(g, dt); } catch (e) { console.error(S.def.id, 'rewind update', e); }
  S.fx.update(dt); S.n++; if (track) MK.track(g); return true;
}
// the copy at time t (rebuilt from init if it is already past t)
function simAt(R, t) {
  if (!R.sim || R.sim.g.t > t + 1e-6) { const t0 = performance.now(); R.sim = simNew(R.g); R.builds = (R.builds || 0) + 1; R.cost = performance.now() - t0; }
  const S = R.sim, d = S.rec.dts; const t0 = performance.now();
  while (S.n < d.length && S.g.t + d[S.n] <= t + 1e-6) simStep(S, t - S.g.t < RW_TRACK);
  if (S.n >= d.length || t >= R.tEnd - 1e-6) simEvents(S);
  R.cost += performance.now() - t0; return S;
}
function updateRewind(dt) {
  const R = run.rewind; if (!R.playing) return;
  R.t = Math.min(R.tEnd, R.t + dt * (setting('anim') === 'slow' ? 0.5 : 1)); if (R.t >= R.tEnd) R.playing = false;
}
function rwTimeAt(x) { return MK.clamp((x - RW.x0) / (RW.x1 - RW.x0), 0, 1) * run.rewind.tEnd; }
function rwX(t) { return RW.x0 + (RW.x1 - RW.x0) * (run.rewind.tEnd ? t / run.rewind.tEnd : 1); }
function rewindInput(type, x, y) {
  const R = run.rewind;
  if (type === 'down') {
    if (Math.hypot(x - RW.close[0], y - RW.close[1]) < 26) { press('rwclose'); setTimeout(closeRewind, 100); return; }
    if (Math.hypot(x - RW.play[0], y - RW.play[1]) < 28) { press('rwplay'); if (R.playing) R.playing = false; else { if (R.t >= R.tEnd - 0.05) R.t = 0; R.playing = true; } return; }
    if (y > RW.y - 34 && y < RW.y + 34 && x > RW.x0 - 20 && x < RW.x1 + 18) {
      R.playing = false; const mk = R.marks.find(m => Math.abs(rwX(m) - x) < 14);
      R.drag = { x0: x, mark: mk ?? null, moved: false }; if (mk == null) R.t = rwTimeAt(x); }
    return;
  }
  if (!R.drag) return;
  if (type === 'move') { if (Math.abs(x - R.drag.x0) > 8) R.drag.moved = true; if (R.drag.moved || R.drag.mark == null) R.t = rwTimeAt(x); return; }
  if (type === 'up') { if (!R.drag.moved && R.drag.mark != null) R.t = Math.max(0, R.drag.mark - 0.05); R.drag = null; } // a tap on a move's mark: just before that move
}
function rewindSeek(t) { const R = run && run.rewind; if (!R) return null; R.playing = false; R.t = MK.clamp(t, 0, R.tEnd); return R.t; }
function drawRewind(c, t) {
  const R = run.rewind, S = simAt(R, R.t), g = S.g;
  g._norec = true; try { g.def.draw(g, c); } catch (e) { console.error(g.def.id, 'rewind draw', e); c.fillStyle = '#ccc'; c.fillRect(0, 0, W, H); } g._norec = false;
  S.fx.draw(c); drawPlayOverlay(c, g, t);
  // a soft film-like edge says "this is a replay, not the live game"
  c.save(); c.strokeStyle = 'rgba(122,170,255,0.55)'; c.lineWidth = 6; c.strokeRect(3, 3, W - 6, H - 6); c.restore();
  // the scrubber
  c.save(); c.fillStyle = 'rgba(30,14,36,0.3)'; roundRect(c, 8, RW.y - 30 + 4, W - 16, 60, 24); c.fill(); c.fillStyle = 'rgba(46,22,54,0.88)'; roundRect(c, 8, RW.y - 30, W - 16, 60, 24); c.fill();
  const pr = ui.pressed === 'rwplay'; c.fillStyle = '#ffd45a'; c.beginPath(); c.arc(RW.play[0], RW.play[1] + (pr ? 2 : 0), 22, 0, 7); c.fill(); c.strokeStyle = '#7a3a1a'; c.lineWidth = 2.5; c.stroke();
  c.fillStyle = '#5a2414'; const px = RW.play[0], py = RW.play[1] + (pr ? 2 : 0);
  if (R.playing) { roundRect(c, px - 8, py - 9, 6, 18, 2); c.fill(); roundRect(c, px + 2, py - 9, 6, 18, 2); c.fill(); } else { c.beginPath(); c.moveTo(px - 6, py - 10); c.lineTo(px + 10, py); c.lineTo(px - 6, py + 10); c.closePath(); c.fill(); }
  c.fillStyle = 'rgba(255,246,234,0.25)'; roundRect(c, RW.x0, RW.y - 4, RW.x1 - RW.x0, 8, 4); c.fill();
  const kx = rwX(R.t); c.fillStyle = '#9ad0ff'; roundRect(c, RW.x0, RW.y - 4, Math.max(8, kx - RW.x0), 8, 4); c.fill();
  for (const m of R.marks) { const mx = rwX(m), past = m <= R.t; c.save(); c.translate(mx, RW.y); c.rotate(Math.PI / 4); c.fillStyle = past ? '#ffd45a' : '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2; c.fillRect(-6, -6, 12, 12); c.strokeRect(-6, -6, 12, 12); c.restore(); }
  c.fillStyle = '#fff6ea'; c.strokeStyle = '#3a1640'; c.lineWidth = 2.5; c.beginPath(); c.arc(kx, RW.y, 11, 0, 7); c.fill(); c.stroke();
  c.restore();
  // close: back to the live game
  c.save(); c.translate(...RW.close); if (ui.pressed === 'rwclose') c.translate(0, 2); c.fillStyle = 'rgba(40,20,50,0.55)'; c.beginPath(); c.arc(0, 0, 19, 0, 7); c.fill(); c.strokeStyle = '#fff6ea'; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(-7, -7); c.lineTo(7, 7); c.moveTo(7, -7); c.lineTo(-7, 7); c.stroke(); c.restore();
}
function rewindIcon(c, x, y) { c.save(); c.fillStyle = 'rgba(40,20,50,0.38)'; c.beginPath(); c.arc(x, y, 18, 0, 7); c.fill(); c.restore(); rewindGlyph(c, x - 1, y, 0.85, '#fff6ea'); }
function goStages() { scene = 'stages'; run = null; A.beat(false); A.music('title'); FX.clear(); }
function toggleMute() { SAVE.d.muted = !SAVE.d.muted; SAVE.save(); A.call('mute', SAVE.d.muted); }

// ---------------- settings (a full-screen page over the title, the topic list or the pause menu) ----------------
// Each row is a label over a row of big choices. Changes apply at once and are saved; the timer applies to the
// microgame being played, the other settings from the next microgame on.
const SET = { open: false, t0: 0 };
const SET_ROWS = [
  { id: 'timer', label: 'Timer', opts: [['on', 'On'], ['off', 'Off']], get: () => timerOn() ? 'on' : 'off', set: v => setSetting('timer', v === 'on') },
  { id: 'anim', label: 'Animations', opts: [['slow', 'Slow'], ['normal', 'Normal'], ['fast', 'Fast']], get: () => setting('anim'), set: v => setSetting('anim', v) },
  { id: 'steps', label: 'Steps', opts: [['auto', 'Auto'], ['tap', 'Tap']], get: () => setting('steps') === 'tap' ? 'tap' : 'auto', set: v => setSetting('steps', v) },
  { id: 'speedups', label: 'Speed-ups', opts: [['on', 'On'], ['off', 'Off']], get: () => setting('speedups') !== false ? 'on' : 'off', set: v => setSetting('speedups', v === 'on') },
  { id: 'mode', label: 'Mode', opts: [['easy', 'Easy'], ['medium', 'Medium']], get: () => SAVE.d.mode || 'easy', set: v => { SAVE.d.mode = v; SAVE.save(); } },
  { id: 'sound', label: 'Sound', opts: [['on', 'On'], ['off', 'Off']], get: () => SAVE.d.muted ? 'off' : 'on', set: v => { SAVE.d.muted = v === 'off'; SAVE.save(); A.call('mute', SAVE.d.muted); } },
].filter(r => !(APPC.hideSettings || []).includes(r.id));
const SET_LAYOUT = { y0: 80, dy: 82, x0: 28, w: 304, h: 50, back: [180, 594, 180, 54] };
function setRowY(i) { return SET_LAYOUT.y0 + i * SET_LAYOUT.dy; } // the label's centre; the choices sit 38 px below
function setOptBox(i, j) { const L = SET_LAYOUT, n = SET_ROWS[i].opts.length, w = L.w / n; return { x: L.x0 + w * (j + 0.5), y: setRowY(i) + 40, w, h: L.h }; }
function openSettings() { SET.open = true; SET.t0 = T; ui.pressed = null; A.sfx('click'); }
function closeSettings() { SET.open = false; A.sfx('click'); }
function settingsInput(type, x, y) {
  if (type !== 'down') return;
  if (hit(x, y, ...SET_LAYOUT.back)) { press('setback'); setTimeout(closeSettings, 120); return; }
  SET_ROWS.forEach((r, i) => r.opts.forEach(([v], j) => { const b = setOptBox(i, j); if (hit(x, y, b.x, b.y, b.w, b.h + 8) && r.get() !== v) { r.set(v); A.sfx('click'); } }));
}
function drawSettings(c, t) {
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#fff3dc'); g.addColorStop(1, '#f2d2a8'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  const k = Math.min(1, (T - SET.t0) * 4);
  P.command(c, 'Settings', 180, 34, 30, 0.85 + 0.15 * easeOut(k), { tilt: 0 });
  if (typeof ANI !== 'undefined') try { ANI.draw(c, 'owl', 322, 52, 0.62, { t, pose: 'idle', expr: 'happy', noShadow: true }); } catch (e) { }
  SET_ROWS.forEach((r, i) => {
    const y = setRowY(i), L = SET_LAYOUT, cur = r.get();
    P.label(c, r.label, L.x0 + 4, y, 20, '#3a1640', 'left', 900);
    const by = y + 40; c.fillStyle = 'rgba(90,40,50,0.14)'; roundRect(c, L.x0, by - L.h / 2, L.w, L.h, L.h / 2); c.fill();
    r.opts.forEach(([v, label], j) => {
      const b = setOptBox(i, j), on = cur === v;
      if (on) { c.fillStyle = 'rgba(80,40,40,0.2)'; roundRect(c, b.x - b.w / 2 + 3, by - L.h / 2 + 6, b.w - 6, L.h - 6, (L.h - 6) / 2); c.fill();
        const gr = c.createLinearGradient(0, by - L.h / 2, 0, by + L.h / 2); gr.addColorStop(0, '#ffe08a'); gr.addColorStop(1, '#f2a33a'); c.fillStyle = gr; roundRect(c, b.x - b.w / 2 + 3, by - L.h / 2 + 3, b.w - 6, L.h - 6, (L.h - 6) / 2); c.fill(); c.strokeStyle = '#7a3a1a'; c.lineWidth = 2.5; c.stroke(); }
      P.label(c, label, b.x, by + 1, 19, on ? '#5a2414' : '#7a4a3a', 'center', 900);
    });
  });
  button(c, SET_LAYOUT.back[0], SET_LAYOUT.back[1], SET_LAYOUT.back[2], SET_LAYOUT.back[3], 'Back', { size: 24, pressed: ui.pressed === 'setback' });
}
function gearIcon(c, x, y) { c.save(); c.fillStyle = 'rgba(40,20,50,0.35)'; c.beginPath(); c.arc(x, y, 18, 0, 7); c.fill(); c.restore(); gearGlyph(c, x, y, 1, '#fff6ea', 'rgba(90,50,80,0.9)'); }
function gearGlyph(c, x, y, s, col, hole) {
  c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.beginPath(); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 + Math.PI / 16, r = i % 2 ? 8.2 : 11.2; c.lineTo(Math.cos(a - 0.12) * r, Math.sin(a - 0.12) * r); c.lineTo(Math.cos(a + 0.12) * r, Math.sin(a + 0.12) * r); } c.closePath(); c.fill();
  if (hole) { c.fillStyle = hole; c.beginPath(); c.arc(0, 0, 3.8, 0, 7); c.fill(); } else { c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.arc(0, 0, 3.8, 0, 7); c.fill(); } c.restore();
}
// two left-pointing triangles (rewind)
function rewindGlyph(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; for (const dx of [-10, 1]) { c.beginPath(); c.moveTo(dx, 0); c.lineTo(dx + 11, -8); c.lineTo(dx + 11, 8); c.closePath(); c.fill(); } c.restore(); }

// ---------------- drawing: shared page backdrop ----------------
const bgCache = {};
function stagePage(c, st, t) {
  // cache the static painted part per stage
  const key = st.id; if (!bgCache[key]) { const off = document.createElement('canvas'); off.width = W * 2; off.height = H * 2; const o = off.getContext('2d'); o.scale(2, 2);
    P.sky(o, W, H, st.sky, { x: 270, y: 150, r: 24, color: '#fff2c4', glow: 200 });
    P.cloud(o, 80, 120, 0.8, '#fffaf0', P.shade(st.sky[1], -0.1), 0.9); P.cloud(o, 280, 210, 0.55, '#fffaf0', P.shade(st.sky[1], -0.1), 0.8);
    P.hills(o, W, 430, 50, P.shade(st.ground[0], 0.1), st.ground[1], { seed: 3, dabs: 60 });
    P.hills(o, W, 520, 34, st.ground[0], P.shade(st.ground[1], -0.1), { seed: 9, dabs: 90, rim: P.shade(st.ground[0], 0.4) });
    P.flowers(o, W, 540, 640, 24, undefined, 5); P.grassTufts(o, W, 530, 640, 30, P.shade(st.ground[0], -0.1), 4);
    bgCache[key] = off; }
  c.drawImage(bgCache[key], 0, 0, W, H);
}

// ---------------- drawing: screens ----------------
function drawTitle(c, t) {
  if (typeof PANEL_TITLE === 'function') PANEL_TITLE(c, t);
  else { stagePage(c, STAGES[3], t); P.command(c, typeof GAME_NAME !== 'undefined' ? GAME_NAME : 'Q.E.D.!', 180, 170, 64, 1); } // until title.js is painted
  button(c, 180, 300, 172, 56, 'Play', { size: 28, pressed: ui.pressed === 'play' });
  button(c, 180, 372, 140, 42, 'Cards', { size: 20, top: '#fff6ea', bot: '#e8d2b0', edge: '#7a4a3a', pressed: ui.pressed === 'cards' });
  muteIcon(c, 330, 30); gearIcon(c, 30, 30);
}
function muteIcon(c, x, y) { c.save(); c.translate(x, y); c.fillStyle = 'rgba(40,20,50,0.35)'; c.beginPath(); c.arc(0, 0, 18, 0, 7); c.fill(); c.fillStyle = '#fff6ea'; c.beginPath(); c.moveTo(-9, -4); c.lineTo(-4, -4); c.lineTo(3, -10); c.lineTo(3, 10); c.lineTo(-4, 4); c.lineTo(-9, 4); c.closePath(); c.fill(); c.strokeStyle = '#fff6ea'; c.lineWidth = 2; c.lineCap = 'round'; if (SAVE.d.muted) { c.beginPath(); c.moveTo(6, -5); c.lineTo(13, 5); c.moveTo(13, -5); c.lineTo(6, 5); c.stroke(); } else { c.beginPath(); c.arc(4, 0, 6, -0.8, 0.8); c.stroke(); c.beginPath(); c.arc(4, 0, 10, -0.8, 0.8); c.stroke(); } c.restore(); }
function backIcon(c, x, y) { c.save(); c.translate(x, y); c.fillStyle = 'rgba(40,20,50,0.35)'; c.beginPath(); c.arc(0, 0, 18, 0, 7); c.fill(); c.strokeStyle = '#fff6ea'; c.lineWidth = 3.5; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(4, -8); c.lineTo(-5, 0); c.lineTo(4, 8); c.stroke(); c.restore(); }
// The topic list: "Mix them all", then topics grouped by school level. Tapping a topic opens it: "Play all" plus a row
// for each of its microgames, which can be played on their own.
function stageRows() {
  const rows = [], live = STAGES.filter(s => MG.forStage(s.id).length); let y = 76 - (ui.stageScroll || 0), grp = null;
  const add = (r, h) => { rows.push({ ...r, y, h }); y += h + 8; };
  add({ kind: 'remix', id: 'remix' }, 52);
  for (const st of live) {
    if (st.group !== grp) { grp = st.group; add({ kind: 'head', label: grp }, 18); }
    add({ kind: 'stage', id: st.id, st }, 62);
    if (ui.openStage === st.id) { add({ kind: 'all', id: 'all:' + st.id, st }, 42); for (const d of MG.forStage(st.id)) add({ kind: 'mg', id: 'mg:' + d.id, st, def: d }, 42); }
  }
  rows.end = y + (ui.stageScroll || 0); return rows;
}
function stageScrollMax() { return Math.max(0, stageRows().end - (LIST_BOT - 8)); }
const LIST_BOT = 634; // the topic list runs to the bottom of the screen (the mode switch moved to the settings)
function drawStages(c, t) {
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#fff3dc'); g.addColorStop(1, '#f2d2a8'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.save(); c.beginPath(); c.rect(0, 62, W, LIST_BOT - 62); c.clip();
  for (const r of stageRows()) {
    if (r.y + r.h < 50 || r.y > LIST_BOT) continue;
    const pr = ui.pressed === r.id, x0 = 18, w = 324, cy = r.y + r.h / 2;
    c.save(); c.translate(0, pr ? 2 : 0);
    if (r.kind === 'head') { P.label(c, r.label.toUpperCase(), x0 + 4, cy + 2, 13, '#9a5a4a', 'left', 900); c.restore(); continue; }
    const card = (fill, edge) => { c.fillStyle = 'rgba(80,40,40,0.16)'; roundRect(c, x0, r.y + 3, w, r.h, 16); c.fill(); c.fillStyle = fill; roundRect(c, x0, r.y, w, r.h, 16); c.fill(); c.strokeStyle = edge; c.lineWidth = 2; c.stroke(); };
    if (r.kind === 'remix') {
      const sg = c.createLinearGradient(x0, 0, x0 + w, 0); ['#e53b3b', '#f28c28', '#f6d23a', '#3aa655', '#3b6fd6', '#7a3fb0'].forEach((col, i) => sg.addColorStop(i / 5, col)); card(sg, 'rgba(90,40,50,0.5)');
      c.fillStyle = 'rgba(255,255,255,0.4)'; roundRect(c, x0, r.y, w, r.h, 16); c.fill();
      P.label(c, 'Mix them all', 180, cy, 20, '#3a1640', 'center', 900); if (SAVE.d.remixBest) P.label(c, 'Best ' + SAVE.d.remixBest, x0 + w - 44, cy, 12, '#3a1640', 'center', 800);
    } else if (r.kind === 'stage') {
      const open = ui.openStage === r.id; card(open ? '#fff8ea' : '#fffaf2', open ? '#b8541f' : 'rgba(122,74,58,0.4)');
      c.save(); roundRect(c, x0 + 6, r.y + 6, 50, r.h - 12, 12); c.clip(); const sg = c.createLinearGradient(0, r.y, 0, r.y + r.h); sg.addColorStop(0, r.st.sky[0]); sg.addColorStop(0.65, r.st.sky[2]); sg.addColorStop(0.66, r.st.ground[0]); sg.addColorStop(1, r.st.ground[1]); c.fillStyle = sg; c.fillRect(x0 + 6, r.y + 6, 50, r.h - 12);
      host(c, r.st, x0 + 31, r.y + r.h - 9, 0.58, { expr: 'happy', t, phase: r.y }); c.restore();
      P.label(c, r.st.name, x0 + 68, cy - 9, 18, '#3a1640', 'left', 900);
      const n = MG.forStage(r.id).length; P.label(c, `${r.st.grade} · ${n} ${n === 1 ? 'game' : 'games'}`, x0 + 68, cy + 13, 12, '#9a5a4a', 'left', 800);
      if (SAVE.d.cleared[r.id]) { c.fillStyle = '#ffd45a'; drawStar(c, x0 + w - 48, cy, 9); }
      c.strokeStyle = '#9a5a4a'; c.lineWidth = 3; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); const ax = x0 + w - 22;
      if (open) { c.moveTo(ax - 7, cy - 3); c.lineTo(ax, cy + 4); c.lineTo(ax + 7, cy - 3); } else { c.moveTo(ax - 3, cy - 7); c.lineTo(ax + 4, cy); c.lineTo(ax - 3, cy + 7); } c.stroke();
    } else {
      const ix = x0 + 22, iw = w - 22; c.fillStyle = r.kind === 'all' ? '#ffe9b0' : 'rgba(255,250,242,0.9)'; roundRect(c, ix, r.y, iw, r.h, 12); c.fill(); c.strokeStyle = 'rgba(122,74,58,0.3)'; c.lineWidth = 1.5; c.stroke();
      if (r.kind === 'all') { const n = MG.forStage(r.st.id).length; P.label(c, n > 1 ? `Play all ${n}` : 'Play', ix + 16, cy, 15, '#5a2414', 'left', 900); }
      else { P.label(c, r.def.cmd, ix + 16, cy, 15, '#3a1640', 'left', 900);
        // the card title sits on the right; it shrinks to fit the space left by the command, and is left out if it still can't fit
        if (r.def.card && r.def.card.title) { c.save(); c.font = '900 15px Nunito, system-ui, sans-serif'; const room = (ix + iw - 34) - (ix + 16 + c.measureText(r.def.cmd).width + 14); let fs = 12;
          for (; fs >= 9.5; fs -= 0.5) { c.font = `800 ${fs}px Nunito, system-ui, sans-serif`; if (c.measureText(r.def.card.title).width <= room) break; } c.restore();
          if (fs >= 9.5) P.label(c, r.def.card.title, ix + iw - 34, cy, fs, '#9a5a4a', 'right', 800); } if (SAVE.d.cards[r.def.id]) { c.fillStyle = '#7ab05a'; c.beginPath(); c.arc(ix + iw - 18, cy, 5, 0, 7); c.fill(); } }
      c.fillStyle = '#b8541f'; c.beginPath(); const px = r.kind === 'all' ? ix + iw - 22 : null; if (px) { c.moveTo(px - 5, cy - 7); c.lineTo(px + 7, cy); c.lineTo(px - 5, cy + 7); c.fill(); }
    }
    c.restore();
  }
  c.restore();
  const hg = c.createLinearGradient(0, 0, 0, 64); hg.addColorStop(0, '#fff3dc'); hg.addColorStop(1, 'rgba(255,243,220,0.92)'); c.fillStyle = hg; c.fillRect(0, 0, W, 62);
  backIcon(c, 30, 30); gearIcon(c, 330, 30); P.command(c, 'Pick a topic', 180, 32, 26, 1, { tilt: 0 });
}
function storyOrder() { const ix = Object.fromEntries(STAGES.map((st, i) => [st.id, i])); return MG.list.slice().sort((a, b) => (ix[a.stage] ?? 99) - (ix[b.stage] ?? 99)); }
function cardTiles() { const out = []; storyOrder().forEach((d, i) => out.push({ def: d, x: 64 + (i % 3) * 116, y: 120 + Math.floor(i / 3) * 132 - ui.cardScroll, w: 104, h: 120 })); return out; }
function drawCards(c, t) {
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#fff3dc'); g.addColorStop(1, '#f2d2a8'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  const have = MG.list.filter(d => SAVE.d.cards[d.id]).length;
  for (const tile of cardTiles()) {
    if (tile.y < -70 || tile.y > H + 70) continue; const got = SAVE.d.cards[tile.def.id];
    c.save(); c.fillStyle = 'rgba(80,40,40,0.18)'; roundRect(c, tile.x - tile.w / 2, tile.y - tile.h / 2 + 4, tile.w, tile.h, 14); c.fill();
    roundRect(c, tile.x - tile.w / 2, tile.y - tile.h / 2, tile.w, tile.h, 14); c.save(); c.clip();
    if (got) { const th = thumb(tile.def, true); if (th) c.drawImage(th, 0, 260 * 1.5, 540, 340 * 1.5, tile.x - tile.w / 2, tile.y - tile.h / 2, tile.w, tile.h * 0.86); else { c.fillStyle = '#ead6b8'; c.fillRect(tile.x - tile.w / 2, tile.y - tile.h / 2, tile.w, tile.h); } }
    else { c.fillStyle = '#d8c0a0'; c.fillRect(tile.x - tile.w / 2, tile.y - tile.h / 2, tile.w, tile.h); P.label(c, '?', tile.x, tile.y - 8, 40, 'rgba(90,50,40,0.5)', 'center', 900); }
    c.fillStyle = '#fff8ea'; c.fillRect(tile.x - tile.w / 2, tile.y + tile.h / 2 - 22, tile.w, 22); c.restore();
    c.strokeStyle = 'rgba(90,40,50,0.5)'; c.lineWidth = 2; c.stroke();
    P.label(c, got ? tile.def.cmd : '', tile.x, tile.y + tile.h / 2 - 11, 13, '#5a2a3a', 'center', 900); c.restore();
  }
  c.fillStyle = 'rgba(255,243,220,0.95)'; c.fillRect(0, 0, W, 58); backIcon(c, 30, 30); P.command(c, `Cards ${have}/${MG.list.length}`, 190, 32, 24, 1, { tilt: 0 });
}
function wrap(c, text, x, y, maxW, lh, size, col, weight = 700) {
  c.font = `${weight} ${size}px Nunito, system-ui, sans-serif`; c.fillStyle = col; c.textAlign = 'left'; c.textBaseline = 'top';
  const words = text.split(' '); let line = '', yy = y; for (const w of words) { const test = line ? line + ' ' + w : w; if (c.measureText(test).width > maxW && line) { c.fillText(line, x, yy); line = w; yy += lh; } else line = test; } if (line) c.fillText(line, x, yy); return yy + lh;
}
// ---------------- card pictures: each microgame played by its bot to the winning moment ----------------
const thumbCache = {}; let thumbBudget = 2;
function thumb(def, lazy) {
  if (thumbCache[def.id]) return thumbCache[def.id];
  if (lazy && thumbBudget <= 0) return null; thumbBudget--;
  const off = document.createElement('canvas'); off.width = 540; off.height = 960; const o = off.getContext('2d'); o.scale(1.5, 1.5);
  const saved = { parts: FX.parts, texts: FX.texts, shakeT: FX.shakeT }; FX.parts = []; FX.texts = [];
  const pd = { down: ptr.down, x: ptr.x, y: ptr.y };
  try {
    const g = makeG(def, 0, 1, true, 'easy', 1); def.init && def.init(g);
    const sy = (type, ...a) => { if (type === 'down') { ptr.down = true; ptr.x = a[0]; ptr.y = a[1]; } if (type === 'move') { ptr.x = a[0]; ptr.y = a[1]; } if (type === 'up') ptr.down = false; if (!g.done && def[type]) def[type](g, ...a); };
    const dt = 1 / 30;
    for (let i = 0; i < 330; i++) {
      g.t += dt; def.update && def.update(g, dt); if (def.auto) def.auto(g, dt, sy); FX.update(dt);
      if (!g.done && g.fuse() >= g.dur) { if (def.winOnTimeout) g.win(); else g.fail(); }
      if (g.done && g.t - g.doneAt > 0.4) break; if (!def.auto && g.t > 1.2) break;
    }
    def.draw(g, o); FX.draw(o);
  } catch (e) { o.fillStyle = '#d8c0a0'; o.fillRect(0, 0, 360, 640); }
  FX.parts = saved.parts; FX.texts = saved.texts; FX.shakeT = saved.shakeT; ptr.down = pd.down; ptr.x = pd.x; ptr.y = pd.y;
  return thumbCache[def.id] = off;
}

// ---------------- card viewer (the Cards screen, and new cards after a level) ----------------
const CV = { list: null, i: 0, scroll: 0, mode: 'browse', drag: null, slide: 0 };
const CARD = { x: 12, y: 18, w: 336, h: 604, img: { x: 24, y: 30, w: 312, h: 214 }, body: { x: 34, y: 258, w: 292, h: 270 }, nav: 574 };
function openCards(defs, i, mode) { CV.list = defs; CV.i = i; CV.scroll = 0; CV.mode = mode; CV.slide = 0; CV.drag = null; }
function closeCards() { CV.list = null; CV.drag = null; A.sfx('click'); }
function stepCard(d) { const n = CV.list.length, j = CV.i + d; if (j < 0 || j >= n) { CV.slide = 0; return; } CV.i = j; CV.scroll = 0; CV.slide = -d * 60; A.sfx('swoosh'); }
const bodyCache = {};
function textLines(c, text, maxW) { const out = []; let line = ''; for (const w of String(text).split(' ')) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
// the card's words, laid out once into a tall canvas that the viewer scrolls
function cardBody(def) {
  if (bodyCache[def.id]) return bodyCache[def.id];
  const cd = def.card || {}, Wd = CARD.body.w, S2 = 2, m = document.createElement('canvas').getContext('2d');
  const blocks = []; let y = 2;
  const add = (lines, font, lh, col, align, box) => { blocks.push({ lines, font, lh, col, align, y, box }); y += lines.length * lh; };
  m.font = '900 23px Nunito, system-ui, sans-serif'; add(textLines(m, cd.title || def.cmd, Wd - 10), m.font, 29, '#3a1640', 'center'); y += 4;
  m.font = '800 14px Nunito, system-ui, sans-serif'; add([[cd.ref, cd.kind].filter(Boolean).join(' · ')], m.font, 20, '#9a5a4a', 'center'); y += 12;
  m.font = '700 17px Nunito, system-ui, sans-serif'; String(cd.text || '').split('\n\n').forEach((para, i) => { if (i) y += 12; add(textLines(m, para, Wd), m.font, 25, '#3a2a30', 'left'); }); y += 16;
  if (cd.note) { const top = y; y += 12; m.font = '900 12px Nunito, system-ui, sans-serif'; add([APPC.noteLabel || 'THE PATTERN'], m.font, 18, '#4a7a52', 'left'); y += 2; m.font = '700 15px Nunito, system-ui, sans-serif'; add(textLines(m, cd.note, Wd - 32), m.font, 22, '#2f5a38', 'left'); y += 12; blocks.push({ rect: [0, top, Wd, y - top], fill: '#e7f2df' }); y += 14; }
  if (cd.ask) { const top = y; y += 12; m.font = '800 16px Nunito, system-ui, sans-serif'; add(textLines(m, cd.ask, Wd - 32), m.font, 23, '#7a3a2a', 'left'); y += 12; blocks.push({ rect: [0, top, Wd, y - top], fill: '#fbe6c8' }); y += 6; }
  const cv2 = document.createElement('canvas'); cv2.width = Wd * S2; cv2.height = Math.ceil(y * S2); const o = cv2.getContext('2d'); o.scale(S2, S2);
  for (const b of blocks) if (b.rect) { o.fillStyle = b.fill; roundRect(o, ...b.rect, 14); o.fill(); }
  o.textBaseline = 'top';
  for (const b of blocks) if (b.lines) { const inBox = b.font.includes('15px') || b.font.includes('12px') || (b.font.includes('800 16px')); o.font = b.font; o.fillStyle = b.col; o.textAlign = b.align === 'center' ? 'center' : 'left';
    b.lines.forEach((l, i) => o.fillText(l, b.align === 'center' ? Wd / 2 : (inBox ? 16 : 0), b.y + i * b.lh + (b.lh - parseInt(b.font.match(/(\d+)px/)[1])) / 2)); }
  return bodyCache[def.id] = { canvas: cv2, h: y };
}
function drawCardViewer(c, t) {
  const def = CV.list[CV.i], K = CARD, bd = cardBody(def), maxS = Math.max(0, bd.h - K.body.h);
  CV.scroll = Math.max(0, Math.min(maxS, CV.scroll)); if (!CV.drag) CV.slide *= 0.75;
  c.fillStyle = 'rgba(40,20,40,0.66)'; c.fillRect(0, 0, W, H);
  c.save(); c.translate(CV.slide, 0);
  c.fillStyle = 'rgba(30,10,30,0.35)'; roundRect(c, K.x, K.y + 6, K.w, K.h, 24); c.fill();
  c.fillStyle = '#fff8ea'; roundRect(c, K.x, K.y, K.w, K.h, 24); c.fill(); c.strokeStyle = '#7a4a3a'; c.lineWidth = 3; c.stroke();
  // picture from the winning moment
  const th = thumb(def), I = K.img, sh = 360 * I.h / I.w, sy = Math.max(0, Math.min(640 - sh, (def.cardY ?? 400) - sh / 2));
  c.save(); roundRect(c, I.x, I.y, I.w, I.h, 16); c.clip(); c.drawImage(th, 0, sy * 1.5, 540, sh * 1.5, I.x, I.y, I.w, I.h); c.restore();
  if (CV.mode === 'reward') { c.save(); c.translate(I.x + 14, I.y + 14); c.fillStyle = '#ffd45a'; roundRect(c, 0, 0, 74, 28, 14); c.fill(); c.strokeStyle = '#7a3a1a'; c.lineWidth = 2; c.stroke(); P.label(c, 'New!', 37, 15, 16, '#5a2414', 'center', 900); c.restore(); }
  // scrolling words
  const B = K.body; c.save(); c.beginPath(); c.rect(B.x - 6, B.y, B.w + 12, B.h); c.clip(); c.drawImage(bd.canvas, B.x, B.y - CV.scroll, B.w, bd.h); c.restore();
  if (CV.scroll > 2) { const gr = c.createLinearGradient(0, B.y, 0, B.y + 22); gr.addColorStop(0, 'rgba(255,248,234,1)'); gr.addColorStop(1, 'rgba(255,248,234,0)'); c.fillStyle = gr; c.fillRect(B.x - 6, B.y, B.w + 12, 22); }
  if (CV.scroll < maxS - 2) { const gr = c.createLinearGradient(0, B.y + B.h - 34, 0, B.y + B.h); gr.addColorStop(0, 'rgba(255,248,234,0)'); gr.addColorStop(1, 'rgba(255,248,234,1)'); c.fillStyle = gr; c.fillRect(B.x - 6, B.y + B.h - 34, B.w + 12, 34);
    c.save(); c.globalAlpha = 0.6 + 0.4 * Math.sin(t * 4); c.strokeStyle = '#9a5a4a'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(W / 2 - 8, B.y + B.h - 10); c.lineTo(W / 2, B.y + B.h - 3); c.lineTo(W / 2 + 8, B.y + B.h - 10); c.stroke(); c.restore(); }
  // navigation
  const n = CV.list.length, ny = K.nav + 16;
  c.strokeStyle = 'rgba(122,74,58,0.25)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(K.x + 20, K.nav - 14); c.lineTo(K.x + K.w - 20, K.nav - 14); c.stroke();
  const arrow = (x, dir, on) => { c.save(); c.globalAlpha = on ? 1 : 0.25; c.fillStyle = '#f2dcbc'; c.beginPath(); c.arc(x, ny, 20, 0, 7); c.fill(); c.strokeStyle = '#7a4a3a'; c.lineWidth = 3.5; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(x - dir * 4, ny - 8); c.lineTo(x + dir * 5, ny); c.lineTo(x - dir * 4, ny + 8); c.stroke(); c.restore(); };
  if (n > 1) { arrow(54, -1, CV.i > 0); arrow(306, 1, CV.i < n - 1); }
  if (CV.mode === 'reward') button(c, 180, ny, 132, 44, CV.i < n - 1 ? 'Next' : 'Done', { size: 19, pressed: ui.pressed === 'cvbtn' });
  else P.label(c, `${CV.i + 1} of ${n}`, 180, ny, 16, '#7a4a3a', 'center', 900);
  // close
  c.fillStyle = 'rgba(40,20,50,0.55)'; c.beginPath(); c.arc(K.x + K.w - 26, K.y + 26, 17, 0, 7); c.fill(); c.strokeStyle = '#fff6ea'; c.lineWidth = 3; c.lineCap = 'round'; const cx = K.x + K.w - 26, cy = K.y + 26; c.beginPath(); c.moveTo(cx - 6, cy - 6); c.lineTo(cx + 6, cy + 6); c.moveTo(cx + 6, cy - 6); c.lineTo(cx - 6, cy + 6); c.stroke();
  c.restore();
}
function cardInput(type, x, y) {
  const K = CARD, d = CV.drag;
  if (type === 'down') { CV.drag = { x, y, sx: CV.scroll, moved: false, axis: null }; return; }
  if (!d) return;
  const dx = x - d.x, dy = y - d.y;
  if (type === 'move') { if (!d.axis && Math.hypot(dx, dy) > 8) d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; if (d.axis === 'y') { CV.scroll = d.sx - dy; d.moved = true; } if (d.axis === 'x') { CV.slide = dx * 0.6; d.moved = true; } return; }
  if (type !== 'up') return;
  CV.drag = null;
  if (d.axis === 'x' && Math.abs(dx) > 50) { stepCard(dx < 0 ? 1 : -1); return; }
  if (d.moved) return;
  const n = CV.list.length, ny = K.nav + 16;
  if (Math.hypot(x - (K.x + K.w - 26), y - (K.y + 26)) < 24) { closeCards(); return; }
  if (n > 1 && Math.hypot(x - 54, y - ny) < 26) { stepCard(-1); return; }
  if (n > 1 && Math.hypot(x - 306, y - ny) < 26) { stepCard(1); return; }
  if (CV.mode === 'reward' && hit(x, y, 180, ny, 140, 50)) { press('cvbtn'); if (CV.i < n - 1) stepCard(1); else closeCards(); return; }
  if (CV.mode === 'browse' && (x < K.x || x > K.x + K.w || y < K.y || y > K.y + K.h)) closeCards();
}
function drawRun(c, t) {
  const r = run, st = r.stage;
  if (r.rewind) { drawRewind(c, t); return; }
  if (r.phase === 'play' || r.phase === 'result' && r.g) {
    const g = r.g; c.save();
    if (FX.shakeT > 0) c.translate((Math.random() - 0.5) * FX.shakeA, (Math.random() - 0.5) * FX.shakeA);
    g._norec = true; try { g.def.draw(g, c); } catch (e) { console.error(g.def.id, 'draw', e); c.fillStyle = '#ccc'; c.fillRect(0, 0, W, H); } g._norec = false; // random numbers drawn while drawing are not part of the replay
    FX.draw(c); c.restore();
    if (r.phase === 'play') drawPlayOverlay(c, g, t); // the paused game stays fully visible, fuse and all
    if (r.phase === 'result') { const k = Math.min(1, r.pt * 5); c.fillStyle = g.result === 'win' ? `rgba(255,236,170,${0.25 * k})` : `rgba(60,30,80,${0.3 * k})`; c.fillRect(0, 0, W, H); }
    if (r.paused) drawPause(c, t); else { pauseIcon(c, PAUSE_BTN.x, PAUSE_BTN.y); if (rewindAvailable()) rewindIcon(c, REWIND_BTN.x, REWIND_BTN.y); }
    return;
  }
  stagePage(c, st, t);
  const k = Math.min(1, r.pt * 3);
  if (r.phase === 'intro') {
    P.command(c, st.name, 180, 150, st.name.length > 12 ? 34 : 42, 0.6 + 0.4 * easeOut(k));
    host(c, st, 180, 560, 2.6, { expr: 'laugh', pose: 'wave', t: T });
    speech(c, st.line, 180, 270, k);
  } else if (r.phase === 'over') {
    P.command(c, r.won ? 'Topic clear!' : 'Well done!', 180, 110, 40, 0.6 + 0.4 * easeOut(k));
    host(c, st, 100, 470, 1.9, { expr: 'laugh', pose: 'cheer', t: T });
    c.fillStyle = 'rgba(255,248,234,0.92)'; roundRect(c, 180, 190, 160, 190, 18); c.fill(); c.strokeStyle = '#7a4a3a'; c.lineWidth = 2.5; c.stroke();
    P.label(c, String(r.cleared), 260, 252, 64, '#3a1640', 'center', 900); P.label(c, r.cleared === 1 ? 'game won' : 'games won', 260, 300, 16, '#7a4a3a', 'center', 800); c.fillStyle = '#ffd23a'; c.strokeStyle = '#a8641a'; c.lineWidth = 2.5; drawStar(c, 232, 346, 15); c.stroke(); P.label(c, String(r.stars || 0), 274, 347, 28, '#3a1640', 'center', 900);
    if (r.newCards.length) { P.label(c, `${r.newCards.length} new card${r.newCards.length > 1 ? 's' : ''}`, 260, 404, 17, '#3a1640', 'center', 900); r.newCards.slice(0, 3).forEach((id, i) => { const th = thumb(MG.byId[id]); c.save(); c.translate(205 + i * 55, 452); c.rotate((i - 1) * 0.12); c.fillStyle = '#fff'; c.fillRect(-24, -32, 48, 64); c.drawImage(th, 0, 80, 360, 480, -21, -29, 42, 58); c.restore(); }); }
    button(c, 180, 548, 220, 56, 'Play again', { size: 24, pressed: ui.pressed === 'again' });
    button(c, 180, 612, 150, 40, 'Topics', { size: 18, top: '#fff6ea', bot: '#e8d2b0', edge: '#7a4a3a', pressed: ui.pressed === 'home' });
    FX.draw(c); return;
  } else {
    // between, speedup, grace, result-less transitions: the host and the loaves
    const beat = Math.abs(Math.sin(T * Math.PI * (r.bpm / 60) / 1));
    const withCk = r.phase === 'between' && r.checkin; // the host steps aside for the check-in buttons
    host(c, st, withCk ? 62 : 84, 596, withCk ? 1.75 : 2.0, { expr: r.phase === 'grace' ? 'wow' : 'laugh', pose: r.phase === 'speedup' ? 'cheer' : 'wave', t: T });
    const ck = r.phase === 'between' && r.checkin, replaying = ck && ck.choice === 'replay';
    if (!(r.phase === 'between' && r.final && !replaying)) { // the next game's number (a replay arrow before a replay; nothing after the last game)
      const py = ck ? 300 : 330; c.fillStyle = 'rgba(255,248,234,0.9)'; roundRect(c, 150, py, 190, 90, 20); c.fill(); c.strokeStyle = '#7a4a3a'; c.lineWidth = 2.5; c.stroke();
      if (replaying) replayGlyph(c, 245, py + 45, 26, '#3a1640'); else P.label(c, String(r.i + (r.phase === 'between' ? 1 : 0)), 245, py + 45, 58, '#3a1640', 'center', 900); }
    if (ck) drawCheckin(c, r);
    for (let i = 0; i < 4; i++) { const gone = i >= r.loaves, popping = gone && i === r.loaves && T - r.lostLoafAt < 0.8; const by = 230 + (gone ? 0 : -beat * 6 * (i % 2 ? 1 : 0.6));
      if (popping) { const q = (T - r.lostLoafAt) / 0.8; c.save(); c.globalAlpha = 1 - q; life(c, 66 + i * 76, by - q * 60, 2 + q, false); c.restore(); } else life(c, 66 + i * 76, by, 2, gone); }
    if (r.phase === 'speedup') P.command(c, 'Faster!', 180, 120, 56, 0.7 + 0.3 * Math.abs(Math.sin(r.pt * 8)), { fill2: '#ff8a5a' });
    if (r.phase === 'between' && r.i === 0) P.command(c, 'Get ready!', 180, 120, 44, 0.6 + 0.4 * easeOut(k));
    if (r.phase === 'grace') drawGrace(c, r.pt);
  }
  if (r.paused) drawPause(c, t); else { pauseIcon(c, PAUSE_BTN.x, PAUSE_BTN.y); if (rewindAvailable()) rewindIcon(c, REWIND_BTN.x, REWIND_BTN.y); }
}
// the stage's host animal (src/animals.js), or a sheep if the animals failed to load
function host(c, st, x, y, s, o) { try { if (typeof ANI !== 'undefined' && st.animal) return ANI.draw(c, st.animal, x, y, s, o); } catch (e) { console.error('host', e); } P.sheep(c, x, y, s, { t: o.t }); }
// one life: an acorn (src/animals.js), or a loaf if the animals failed to load
function life(c, x, y, s, gone) { try { if (typeof ANI !== 'undefined' && ANI.acorn) return ANI.acorn(c, x, y, s, gone); } catch (e) { } P.loaf(c, x, y, s, gone); }
// the check-in after a microgame: three big buttons on the right, beside the host. After a choice, the chosen one
// stays lit with a tick and the others fade.
const CHECKIN_LOOK = {
  got: { top: '#d8f6b8', bot: '#7ccf5e', edge: '#2f6a2a', ink: '#1e4a1a' },
  confused: { top: '#ece2ff', bot: '#b49cf0', edge: '#4a3a8a', ink: '#2a1a5a' },
  replay: { top: '#ffe08a', bot: '#f2a33a', edge: '#7a3a1a', ink: '#5a2414' },
  card: { top: '#d6eeff', bot: '#7ab8ee', edge: '#1e4a7a', ink: '#12325a' },
};
function drawCheckin(c, r) {
  const ck = r.checkin, B = CHECKIN_BOX;
  CHECKIN.forEach((b, i) => {
    const k = easeOut(Math.min(1, Math.max(0, (r.pt - 0.1 - i * 0.07) * 4))), chosen = ck.choice === b.id, fade = ck.choice && !chosen ? Math.max(0.25, 1 - (r.pt - ck.at) * 4) : 1;
    if (k <= 0) return; const L = CHECKIN_LOOK[b.id];
    c.save(); c.globalAlpha = fade * Math.min(1, k); c.translate(B.x, b.y); c.scale(0.7 + 0.3 * k, 0.7 + 0.3 * k); c.translate(-B.x, -b.y);
    button(c, B.x, b.y, B.w, B.h, '', { ...L, pressed: chosen || ui.pressed === 'ck:' + b.id });
    const ix = B.x - B.w / 2 + 26, dy = chosen || ui.pressed === 'ck:' + b.id ? 3 : 0;
    checkinGlyph(c, b.id, ix, b.y + dy, L.ink);
    P.label(c, b.label, ix + 20, b.y + 1 + dy, b.label.length > 9 ? 18 : 21, L.ink, 'left', 900);
    c.restore();
  });
}
function checkinGlyph(c, id, x, y, col) {
  c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 3.5; c.lineCap = 'round'; c.lineJoin = 'round';
  if (id === 'got') { c.beginPath(); c.moveTo(x - 8, y); c.lineTo(x - 2, y + 6); c.lineTo(x + 8, y - 7); c.stroke(); }
  else if (id === 'confused') P.label(c, '?', x, y + 1, 24, col, 'center', 900);
  else if (id === 'card') { c.lineWidth = 2.5; roundRect(c, x - 8, y - 10, 16, 20, 3); c.stroke(); for (const dy of [-4, 1, 6]) { c.beginPath(); c.moveTo(x - 4, y + dy); c.lineTo(x + 4, y + dy); c.stroke(); } }
  else replayGlyph(c, x, y, 9, col);
  c.restore();
}
// a circular "again" arrow
function replayGlyph(c, x, y, r, col) {
  c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = Math.max(3, r * 0.32); c.lineCap = 'round';
  c.beginPath(); c.arc(x, y, r, -Math.PI * 0.35, Math.PI * 1.35); c.stroke();
  const a = -Math.PI * 0.35, hx = x + Math.cos(a) * r, hy = y + Math.sin(a) * r, s = r * 0.6;
  c.beginPath(); c.moveTo(hx + s, hy - s * 0.1); c.lineTo(hx - s * 0.2, hy - s * 0.9); c.lineTo(hx - s * 0.1, hy + s * 0.7); c.closePath(); c.fill(); c.restore();
}
function drawGrace(c, pt) {
  const p = Math.min(1, pt / 1.6), x = -40 + p * 106, y = 120 + Math.sin(p * Math.PI) * -40 + p * 60;
  c.save(); const glow = c.createRadialGradient(66, 230, 2, 66, 230, 120); glow.addColorStop(0, `rgba(255,240,180,${0.6 * Math.min(1, pt)})`); glow.addColorStop(1, 'rgba(255,240,180,0)'); c.fillStyle = glow; c.fillRect(0, 80, W, 320); c.restore();
  if (typeof ANI !== 'undefined') ANI.draw(c, 'owl', x, y + 30, 1.1, { t: pt, pose: 'cheer', expr: 'happy', noShadow: true }); else P.dove(c, x, y, 1.6, { t: pt });
  if (pt > 1.6) { const q = Math.min(1, (pt - 1.6) * 3); life(c, 66, 120 + q * 110, 2); } else life(c, x + 12, y + 34, 1.6);
  if (pt > 1.2) { c.globalAlpha = Math.min(1, (pt - 1.2) * 2); c.fillStyle = 'rgba(255,248,234,0.95)'; roundRect(c, 60, 448, 240, 60, 18); c.fill(); P.label(c, 'Second chance!', 180, 478, 26, '#b8541f', 'center', 900); c.globalAlpha = 1; }
}
function speech(c, text, x, y, k) {
  // the host's line: wraps onto as many lines as needed; the bubble and its tail are one outlined shape
  c.save(); c.globalAlpha = k; const size = 19, lh = 25, maxW = 280; c.font = `800 ${size}px Nunito, system-ui, sans-serif`;
  const lines = []; let line = ''; for (const w of text.split(' ')) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; } if (line) lines.push(line);
  const w = Math.max(...lines.map(l => c.measureText(l).width)) + 44, h = lines.length * lh + 26, top = y - h / 2, l = x - w / 2, r = x + w / 2, b = top + h, rad = 20;
  c.beginPath(); c.moveTo(l + rad, top); c.arcTo(r, top, r, b, rad); c.arcTo(r, b, l, b, rad);
  c.lineTo(x + 12, b); c.lineTo(x + 2, b + 18); c.lineTo(x - 10, b); // the tail, pointing down at the host
  c.arcTo(l, b, l, top, rad); c.arcTo(l, top, r, top, rad); c.closePath();
  c.fillStyle = 'rgba(255,250,240,0.97)'; c.fill(); c.strokeStyle = '#7a4a3a'; c.lineWidth = 2.5; c.lineJoin = 'round'; c.stroke();
  lines.forEach((ln, i) => P.label(c, ln, x, top + 13 + lh / 2 + i * lh, size, '#3a1640', 'center', 800)); c.restore();
}
function easeOut(k) { return 1 - Math.pow(1 - k, 3) + Math.sin(k * Math.PI) * 0.15; }
// command banner, input hint and the fuse timer over a running microgame
function drawPlayOverlay(c, g, t) {
  const d = g.def, a = g.t; drawStepCue(c, g, t);
  if (a < 1.25) { const pop = a < 0.18 ? a / 0.18 * 1.15 : a < 0.3 ? 1.15 - (a - 0.18) / 0.12 * 0.15 : 1; const fade = a > 1.0 ? 1 - (a - 1.0) / 0.25 : 1;
    c.save(); c.globalAlpha = Math.max(0, fade); P.command(c, d.cmd, 180, 92, d.cmd.length > 9 ? 40 : 48, pop); /* no input icon: the math kit shows what to tap or drag */ c.restore(); }
  // fuse (hidden when the timer is off)
  const frac = Math.max(0, 1 - g.fuse() / g.dur), x0 = 20, x1 = 340, y = 622;
  if (timerOn()) { c.save(); c.fillStyle = 'rgba(40,20,50,0.35)'; roundRect(c, x0, y - 6, x1 - x0, 12, 6); c.fill();
  const fx = x0 + (x1 - x0) * frac; const gr = c.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, '#ffe08a'); gr.addColorStop(1, '#ff8a4a'); c.fillStyle = gr; if (frac > 0) { roundRect(c, x0, y - 6, Math.max(12, fx - x0), 12, 6); c.fill(); }
  if (!g.done && frac > 0) { for (let i = 0; i < 4; i++) { c.fillStyle = ['#fff6c0', '#ffd45a', '#ff8a4a', '#fff'][i]; c.beginPath(); c.arc(fx + (Math.random() - 0.5) * 8, y + (Math.random() - 0.5) * 8, 2 + Math.random() * 2, 0, 7); c.fill(); } }
  c.restore(); }
  if (g.done && g.t - g.doneAt < holdOf(g)) { const q = (g.t - g.doneAt) / holdOf(g); c.save(); c.globalAlpha = Math.min(1, q * 4) * (q > 0.8 ? (1 - q) * 5 : 1); P.command(c, g.result === 'win' ? (d.winText || 'Yes!') : (d.failText || 'Oops!'), 180, 92, 50, 0.8 + Math.min(0.2, q), { fill2: g.result === 'win' ? '#ffcf5a' : '#c8b8ff' }); c.restore(); }
}

// ---------------- main loop ----------------
let last = performance.now();
function frame(now) {
  const dt = Math.min(1 / 30, (now - last) / 1000); last = now; T += dt;
  requestAnimationFrame(frame); // asked first, so an error below can never stop the game loop
  try { step(dt); } catch (e) { console.error('step', e); recover(); }
  try { render(); } catch (e) { console.error('render', e); }
}
function step(dt) { if (scene === 'run' && run && run.rewind) updateRewind(dt); else if (scene === 'run' && run && !run.paused) updateRun(dt); FX.update(dt); }
// if the run itself throws, move on instead of freezing: end a broken game as a win, or go back to the story list
let recoverN = 0;
function recover() { if (scene !== 'run' || !run) return; if (++recoverN > 30) { recoverN = 0; goStages(); return; } if (run.phase === 'play' && run.g) { run.g.done = true; run.g.result = 'win'; run.g.doneAt = run.g.t; } else if (run.phase !== 'over') { run.phase = 'result'; run.pt = 0; } }
// On phones taller or wider than 9:16, the bands around the game continue the scene: its edge rows are stretched outward and softly darkened.
function render() {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#2a1830'; ctx.fillRect(0, 0, cv.width, cv.height);

  ctx.setTransform(scale * DPR, 0, 0, scale * DPR, offX * DPR, offY * DPR);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  thumbBudget = 2;
  if (scene === 'title') drawTitle(ctx, T); else if (scene === 'stages') drawStages(ctx, T); else if (scene === 'cards') drawCards(ctx, T); else if (scene === 'run' && run) drawRun(ctx, T);
  if (CV.list) drawCardViewer(ctx, T);
  if (SET.open) drawSettings(ctx, T);
  ctx.restore();
  fillBands();
}
const BW = 18, BH = 32, blur1 = document.createElement('canvas'), blur2 = document.createElement('canvas'); blur1.width = BW; blur1.height = BH; blur2.width = BW * 4; blur2.height = BH * 4;
const blx1 = blur1.getContext('2d'), blx2 = blur2.getContext('2d'); blx1.imageSmoothingEnabled = blx2.imageSmoothingEnabled = true; // two small canvases make a cheap blur
const bandStrip = document.createElement('canvas'); bandStrip.width = 40; bandStrip.height = 1; const bsx = bandStrip.getContext('2d');
function strip(sx, sy, sw, sh, dx, dy, dw, dh) { bsx.clearRect(0, 0, 40, 1); bsx.drawImage(cv, sx, sy, sw, sh, 0, 0, 40, 1); ctx.drawImage(bandStrip, 0, 0, 40, 1, dx, dy, dw, dh); }
function fillBands() {
  const fx = Math.round(offX * DPR), fy = Math.round(offY * DPR), fw = Math.round(W * scale * DPR), fh = Math.round(H * scale * DPR), e = Math.max(2, Math.round(2 * DPR));
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = true;
  try {
    if (fy > 1) {
      strip(fx, fy, fw, e * 3, fx, 0, fw, fy); strip(fx, fy + fh - e * 3, fw, e * 3, fx, fy + fh, fw, cv.height - fy - fh);
      let g = ctx.createLinearGradient(0, 0, 0, fy); g.addColorStop(0, 'rgba(30,14,36,0.55)'); g.addColorStop(1, 'rgba(30,14,36,0.12)'); ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, fy);
      g = ctx.createLinearGradient(0, fy + fh, 0, cv.height); g.addColorStop(0, 'rgba(30,14,36,0.12)'); g.addColorStop(1, 'rgba(30,14,36,0.55)'); ctx.fillStyle = g; ctx.fillRect(0, fy + fh, cv.width, cv.height - fy - fh);
    }
    // side bands (wide screens): a soft, darkened, blurred copy of the whole scene fills them. Stretching the edge column
    // sideways smeared whatever stood at the edge (a fox's tail became a long streak).
    if (fx > 1) {
      blx1.drawImage(cv, fx, fy, fw, fh, 0, 0, BW, BH); blx2.drawImage(blur1, 0, 0, BW, BH, 0, 0, BW * 4, BH * 4);
      const k = Math.max(cv.width / (BW * 4), cv.height / (BH * 4)), w = BW * 4 * k, h = BH * 4 * k;
      for (const [x0, x1] of [[0, fx], [fx + fw, cv.width]]) { ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, x1 - x0, cv.height); ctx.clip();
        ctx.drawImage(blur2, (cv.width - w) / 2, (cv.height - h) / 2, w, h); ctx.fillStyle = 'rgba(30,14,36,0.42)'; ctx.fillRect(x0, 0, x1 - x0, cv.height); ctx.restore(); }
      const sh = Math.round(14 * DPR); // a soft shadow where the bands meet the game
      let g = ctx.createLinearGradient(fx - sh, 0, fx, 0); g.addColorStop(0, 'rgba(20,8,24,0)'); g.addColorStop(1, 'rgba(20,8,24,0.35)'); ctx.fillStyle = g; ctx.fillRect(fx - sh, 0, sh, cv.height);
      g = ctx.createLinearGradient(fx + fw, 0, fx + fw + sh, 0); g.addColorStop(0, 'rgba(20,8,24,0.35)'); g.addColorStop(1, 'rgba(20,8,24,0)'); ctx.fillStyle = g; ctx.fillRect(fx + fw, 0, sh, cv.height);
    }
  } catch (err) { }
}
// card list scrolling (drag)
let dragY = null; cv.addEventListener('pointerdown', e => { if (scene === 'cards' && !CV.list) dragY = toLogical(e)[1]; });
cv.addEventListener('pointermove', e => { if (scene === 'cards' && !CV.list && dragY !== null && ptr.down) { const y = toLogical(e)[1]; ui.cardScroll = Math.max(0, Math.min(Math.max(0, Math.ceil(MG.list.length / 3) * 132 - 460), ui.cardScroll - (y - dragY))); dragY = y; } });
cv.addEventListener('pointerup', () => { dragY = null; });
// mouse wheels and touchpads scroll the topic list, the card collection and an open card's text (for computers without a touchscreen)
cv.addEventListener('wheel', e => {
  e.preventDefault(); const dy = (e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * 400 : e.deltaY) / (scale || 1);
  if (CV.list) CV.scroll += dy; // clamped where the card is drawn
  else if (scene === 'stages') ui.stageScroll = Math.max(0, Math.min(stageScrollMax(), (ui.stageScroll || 0) + dy));
  else if (scene === 'cards') ui.cardScroll = Math.max(0, Math.min(Math.max(0, Math.ceil(MG.list.length / 3) * 132 - 460), ui.cardScroll + dy));
}, { passive: false });

// ---------------- test hooks (used by tools/mgtest.py) ----------------
window.HM = {
  // run one microgame headless with a fixed timestep; returns {result, t} and optional frames as data URLs
  test(id, opts = {}) {
    const def = MG.byId[id]; if (!def) return { error: 'no such microgame ' + id };
    const { level = 0, speed = 1, auto = false, frames = [], overlay = true, events = [], mode = 'easy', paceMul = 1, timer = true, maxT = 45, steps = false, wall = false } = opts; // paceMul: working slower (2) or faster; timer: false never times out; steps: tap through the working (the bot taps); wall: frames at wall-clock times (step mode waits too), not game times
    const errors = []; const oe = console.error; console.error = (...a) => { errors.push(a.map(String).join(' ')); oe(...a); };
    scene = 'run'; run = { stage: STAGE[def.stage] || STAGES[0], list: [def], i: 0, loaves: 4, phase: 'play', pt: 0, speed, bpm: 108, newCards: [] };
    window.HM_AUTO = auto; FX.clear(); const g = makeG(def, level, speed, false, mode, paceMul); g.steps = !!steps; run.g = g; let wallDone = null; try { def.init && def.init(g); } catch (e) { errors.push('init: ' + e); }
    const shots = [], dt = 1 / 60; let fi = 0; const ev = events.slice().sort((a, b) => a.t - b.t); let ei = 0;
    const off = document.createElement('canvas'); off.width = W * 2; off.height = H * 2; const oc = off.getContext('2d');
    for (let step = 0; step < 60 * maxT; step++) {
      while (ei < ev.length && ev[ei].t <= g.t) { const e = ev[ei++]; synth(e.type, ...(e.args || [])); }
      const now = wall ? step * dt : g.t;
      while (fi < frames.length && frames[fi] <= now) { oc.setTransform(2, 0, 0, 2, 0, 0); oc.clearRect(0, 0, W, H); try { def.draw(g, oc); } catch (e) { errors.push('draw: ' + e); } FX.draw(oc); if (overlay) drawPlayOverlay(oc, g, g.t); shots.push(off.toDataURL('image/jpeg', 0.85)); fi++; }
      tickMicro(g, dt, (g, d) => { g.t += d; try { def.update && def.update(g, d); } catch (e) { errors.push('update: ' + e); }
        if (auto && def.auto) { try { def.auto(g, d, synth); } catch (e) { errors.push('auto: ' + e); } } });
      FX.update(dt); if (g.done && wallDone == null) wallDone = (step + 1) * dt;
      if (!g.done && timer && g.fuse() >= g.dur) { if (def.winOnTimeout) g.win(); else g.fail(); }
      if (g.done && g.t - g.doneAt > 0.8 && fi >= frames.length) break;
    }
    console.error = oe; window.HM_AUTO = false; scene = 'title'; run = null;
    return { result: g.result, doneAt: +g.doneAt.toFixed(2), dur: +g.dur.toFixed(2), t: +g.t.toFixed(2), held: +(g.held || 0).toFixed(2), stops: g.stepCount || 0, moves: (g.s.mk && g.s.mk.log || []).length, wallDoneAt: wallDone == null ? null : +wallDone.toFixed(2), errors, shots };
  },
  list() { return MG.list.map(d => ({ id: d.id, stage: d.stage, cmd: d.cmd, hint: d.hint, time: d.time, winOnTimeout: !!d.winOnTimeout, hasAuto: !!d.auto, card: !!(d.card && d.card.text) })); },
  goto(s, arg) { if (s === 'run') startRun(arg); else { scene = s; } },
  step(n = 1, dt = 1 / 60) { for (let i = 0; i < n; i++) { T += dt; step(dt); } render(); },
  state() { return { scene, phase: run && run.phase, i: run && run.i, loaves: run && run.loaves, speed: run && run.speed, graceUsed: run && run.graceUsed, won: run && run.won, cleared: run && run.cleared, paused: !!(run && run.paused), cardViewerOpen: !!CV.list, settingsOpen: SET.open, checkin: !!(run && run.checkin), choice: run && run.checkin ? run.checkin.choice : null, final: run && run.final, replay: !!(run && run.g && run.g.replay), replays: run ? run.replays : 0, gameId: run && run.g ? run.g.def.id : null, paceMul: run && run.g ? run.g.paceMul : null, steps: !!(run && run.g && run.g.steps), next: run && run.list && run.list.slice(run.i, run.i + 4).map(d => d.id) }; },
  pause() { pauseRun(); }, resume() { resumeRun(); },
  // the rewind scrubber: open it, show time t (re-playing the hidden copy), read where it is, close it
  rewind: { open() { openRewind(); return !!(run && run.rewind); }, seek(t) { const v = rewindSeek(t); if (v != null) render(); return v; }, close() { closeRewind(); },
    info() { const R = run && run.rewind; return R ? { t: R.t, tEnd: R.tEnd, marks: R.marks.slice(), simT: R.sim ? R.sim.g.t : null, builds: R.builds || 0, cost: R.cost, playing: R.playing } : null; } },
  resetSave() { try { localStorage.removeItem(SAVE.key); } catch (e) { } SAVE.d = SAVE.merge({}, {}); },
  ready: false,
  synth,
};

function boot() {
  SAVE.load(); if (SAVE.d.muted) A.call('mute', true); SAVE.connect();
  if (!testMode) requestAnimationFrame(frame); else render();
  HM.ready = true;
}
