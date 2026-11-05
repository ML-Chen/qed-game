# Writing a Heurēka! microgame

Heurēka! is the repo's second app: WarioWare-style microgames for "the everything else of STEM, plus business": physics, chemistry, biology and medicine, earth and space, engineering and hardware, computer science and AI, money and startups, law, government and consulting. It shares Q.E.D.!'s engine (`src/engine.js`: the run loop, lives, speed-ups, settings, check-in, pause, rewind, cards, saving), art library (`P`, `src/paint.js`), animal cast (`ANI`, `src/animals.js`) and sounds. Its own files are in `heureka/`:
- `heureka/app.js`: `APP`, the topics (`stages`), the save key and the card label.
- `heureka/kit.js`: `SK`, the scene kit (ghost-hand demo, glowing targets, drag and fling, hold, a physics step, labels, bot helpers).
- `heureka/title.js`: the title painting.
- `heureka/games/<topic>_<id>.js`: one microgame per file. The topic is a stage id from `heureka/app.js`.

Build: `python3 src/build.py --app heureka` (writes `dist/heureka.html`), or `HM_APP=heureka` for any tool that builds.

## What a Heurēka! microgame is (the owner's rules)
A microgame is a 3–6 second WarioWare moment, never a question. The full format is in `docs/science/README.md` and each `docs/science/CURRICULUM_*.md` file gives every game as one row: Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host.
- **A clear shouted command** (`cmd`) that says what to do and the goal, never an enigma (the owner): ALL CAPS, ends in "!", up to about 30 characters ("SLIDE 3 PUCKS IN!", "CARRY MAIL TO THE DATABASE!"), unique across the app (`grep -h "cmd: '" heureka/games/*.js`). Longer than 15 characters, the engine wraps it onto 2–3 balanced lines.
- **Several actions, not one**: the player does the action 2–4 times, each a little different (three pucks, three leaks), or one action that needs real precision or timing. Nothing is won by one effortless move.
- **One action toward a goal that is obvious from the first frame**: flick, drag, hold and release, tap at the right moment, trace, mash, tilt, swipe. No text prompt is needed to know what to do.
- **The concept happens on screen as the result.** Success works *because of* the concept: the puck reaches the net because nothing rubs on it on the ice.
- **A vivid, funny fail that also shows the concept** (the puck stops dead in the sand and a crab pops out).
- **No questions, no "predict, then watch", no multiple choice or hidden right answer, no numbers to compute, no formulas.** Label the important objects with their real names ("Server", "Database", "Investor", "Nucleus") so the scene explains itself; labels name things, the command says what to do, the card explains. Choosing between objects is fine only as part of doing the goal (grabbing the heavy ball because the light one bounced off).
- **Act on the real thing, not symbols.** Atoms are balls you can see, money is coins and pies, code is a short real Python panel whose current line glows while you act it out.
- **Clear to a young newcomer**: the first frame, the command and the ghost hand must be enough.
- **Level 2** (`g.level`) makes the same action harder or adds one twist (the curriculum's Level 2 column); level 1 sits between.
- Physics must look right: things that should move in straight lines do, gravity pulls down at a steady rate, energy isn't created from nothing. Biology, chemistry, law and money must be exactly correct too, including the card.

## The contract
```js
MG.add({
  id: 'slide', stage: 'motion', cmd: 'SLIDE!', time: 5, mood: 'sea', winText: 'Goal!', failText: 'Stuck!',
  card: { title, kind, ref, text, note },   // see "The card"
  init(g) {},                   // set up g.s (all state lives in g.s)
  down(g, x, y) {}, move(g, x, y) {}, up(g, x, y) {}, swipe(g, dx, dy, vx, vy) {},
  update(g, dt) {},             // g.win() / g.fail() end it; g.t is the clock
  draw(g, c) {},                // 360 x 640 logical pixels
  auto(g, dt, synth) {},        // the test bot: must win at every level
  winOnTimeout: false,          // true for "survive until the time runs out" games
});
```
- `time`: base seconds at speed 1 (4–7). The engine gives 3x at level 0, 2.2x at level 1, 1.6x at level 2, more until the game has been won once, and shortens it as the run speeds up. Timer off in the settings: the fuse never runs out, so a game must also wait patiently.
- `g.sfx(name)`: tap pop whoosh swoosh splash drip bubble chime sparkle ding boing thud coin sweep rustle crunch munch slurp drum bell clap cheer laugh rumble wind rain thunder wave fire magic stretch snap click fail wrong grow shrink, plus animal calls (ribbit tweet buzz quack moo baa roar honk meow).
- `g.burst(x, y, colours, n, speed)`, `g.float(text, x, y)`, `g.shake(a, t)`; `g.bake(key, (o, W, H) => ...)` paints a static background once (2x resolution).
- **Deterministic (for the rewind scrubber):** draw every random number that affects play with `g.rand()` (never `Math.random()` outside `draw`), keep all state in `g.s`, never read the wall clock (use `g.t`), and read the pointer only from the handler arguments. The suite's rewind test replays the game from its recorded input and checks it matches.
- Guidance (the owner: "for every level, gesture to what you're supposed to do if the player is stuck"): call `SK.demo(g, c, kind, from, to)` last in `draw`, every frame, at every level, pointed at the NEXT thing to do in the current state. The kit decides when it shows: at level 0 from the start until the first touch, and at every level whenever the player hasn't touched for 2–2.8 s. The engine records the last touch in `g.lastIn`. `SK.glow(c, g, x, y, r)` marks the thing to act on at levels 0 and 1. Call `SK.touched(g)` in `down` (the drag and hold helpers do it for you).
- The command banner and win text are drawn at y ≈ 92 for the first 1.25 s; the fuse runs along y = 622; pause and rewind buttons sit at the top right (288–336, 24). Keep important art out of those strips.

## SK, the scene kit (`heureka/kit.js`)
- `SK.dragStart(g, obj, x, y)`, `SK.dragMove(g, x, y)` (moves `obj` with the finger), `SK.dragEnd(g)` → `{ obj, vx, vy, x, y }` (release velocity in px/s), `SK.dragging(g)`, `SK.pick(items, x, y, r)`.
- `SK.holdStart(g)`, `SK.held(g)` (seconds so far), `SK.holdEnd(g)` (seconds held).
- `SK.step(body, dt, { gy, floor, left, right, drag, mu })`: gravity, bounces (`body.e`) and floor friction (`body.mu`); returns 'floor' or 'wall' on a bounce.
- `SK.tag(c, text, x, y, size)`: a short label on a dark pill (at least 18 px). `SK.shadow`, `SK.ball(c, x, y, r, col)`, `SK.animal(c, kind, x, y, s, o)`, `SK.hand`.
- `SK.clamp`, `SK.lerp`, `SK.easeOut`, `SK.easeInOut`, `SK.dist`.
- Bot: `SK.bot.tap(g, synth, key, t, x, y)`, `SK.bot.drag(g, synth, key, t, [x0, y0], [x1, y1], dur)`, `SK.bot.hold(g, synth, key, t, x, y, dur)`; call them every frame from `auto`, each acts once at time `t`.

The reference microgame is `heureka/games/motion_slide.js` (a fling, physics sub-steps, a baked background, a funny fail, the demo hand and a bot that solves every level). Holy Moly!'s games (`/home/claude/ml-chen/holy-moly/src/games/`, if present) show the same contract with many other mechanics.

## Look and feel
- Gorgeous, painted, constant gentle motion, animals doing things; every microgame has its own world and palette. No clutter: no subtitles, no eyebrow text, no instructions on screen.
- Readable on a phone (360 x 640): any word the player must read is at least 18 px bold on a contrasting backing; at most three words on screen during play.
- The host animal reacts: cheers on a win, a funny "wow" or "sad" on a fail. Kinds: frog, ant, penguin, duck, turtle, octopus, owl, beaver, bird, rabbit, hedgehog, fox.

## The card
`card: { title, kind, ref, text, note }`, shown after the game is first won:
- `title`: a plain name for the idea ("Things keep moving"). `kind`: the subject ("Physics"). `ref`: the real name or source ("Newton's first law").
- `text`: what happens and why, in plain words a curious 10-year-old can follow, 50–110 words, paragraphs separated by a blank line.
- `note`: shown under THE IDEA: the idea in one or two sentences.
- Law cards add "This is general information, not legal advice." Policy cards show mechanisms and trade-offs and never take a side. Where evidence is debated, the card says so.
- Plain English (the owner's rule): lead with the point, one idea per sentence, active voice, define a term the first time, put a condition in the sentence it limits, no slogans, no "It's not X, it's Y". Read each sentence alone and ask what a newcomer would believe; rewrite it if that belief is false.

## Testing
- `HM_APP=heureka HM_ONLY=<your prefixes> HM_PAGE=<your own page path> python3 tools/mgtest.py OUTDIR` builds, runs the bot at level 0 and at level 2 double speed (both must win) and with no input (must fail, unless `winOnTimeout`), and writes a contact sheet `OUTDIR/<id>.jpg`. Open every sheet and fix anything that looks weak, cramped or unclear.
- `HM_APP=heureka HM_PAGE=<page> python3 tools/film.py OUTDIR <id> [level]` films the bot playing: a frame grid and a GIF. Look at it.
