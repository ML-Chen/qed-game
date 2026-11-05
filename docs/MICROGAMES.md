# Writing a Q.E.D.! microgame

Q.E.D.! is a WarioWare-style math game for grade 3 through college. Each microgame shows one real math problem. The player solves it only by tapping parts of the problem and dragging parts onto other parts, never by choosing an answer from a list (in easy mode). Every move starts an animation that does the arithmetic in real time and rewrites the expression, so the player watches how the operation works. Examples:
- Long addition: drag the digits of each column down into the answer, right to left; the column adds up in front of you, and a ten is carried over as a 1.
- Power rule: drag the exponent onto the coefficient; they multiply, and the exponent drops by one.
- Chain rule: drag the d/dx onto each layer of the function.
- Solving 2x + 5 = 13: drag the + 5 across the = sign (it becomes − 5), tap 13 − 5 to compute it, then drag the 2 across to divide.

**Show your work (the owner's rule, November 2026).** Every operation is acted out slowly enough that a player who doesn't know the math can see what happens, and it plays by itself: the player makes the move (a tap or a drag), and the working then animates automatically, manim-style, the way a 3Blue1Brown video would show it. The animation should make the math feel alive and delightful, not just correct. Examples:
- Power rule ∫/d/dx: the exponent grows, a chalk "+1" writes itself beside it, the exponent reads "2 + 1", the "+ 1" slides in and the 2 rolls over to 3 like an odometer (see `src/games/integrals_reverse.js`, the reference for this style).
- Column addition: the column's digits light up one after another, their sum writes itself as a small working note ("7 + 8 = 15"), the 5 drops into the answer row and the 1 visibly lifts off and arcs over to the top of the next column, where it lands with a sparkle.
- Long multiplication: each partial product is written as a note ("6 × 7 = 42"), the 2 drops into place and the 4 is carried up and over, then added in (the note shows "+ 4") at the next step.
- Dividing both sides: a "÷ 2" writes itself under both sides, then each side collapses into its result.

Timing: each move's working lasts about 0.6–1.6 s at level 0. Multiply every beat, every `dur`, `delay`, `hold`, `write`, `fade` and `linger`, and every clock you run yourself in `update`/`draw`, by `const T = MK.pace(g)`. Mark the length with `MK.show(g, seconds)`: input waits and the fuse stands still while it runs (the engine counts `g.held`), so the animation never costs the player time, and the microgame is not won until the show and every timer scheduled with `MK.at` have run. Keep beats overlapping and lively; never make the player stare at a still screen.

**Pacing rules (the owner's rule: "too many things happening too quickly").**
- `MK.pace(g)` is 1 at level 0, 0.9 at level 1 and 0.8 at level 2. The run's speed-ups shorten the fuse, not the explanations: they take at most 10% off the pace (at speed 2).
- `MK.pace(g)` is multiplied by `g.paceMul`, which the engine sets per microgame: the player's Animations setting (Slow ×1.5, Normal ×1, Fast ×0.75), times 1.6 while the player's last check-in on this microgame was "Confused", or ×2 for a "Replay slower". So a beat that is not multiplied by `T` does not slow down when the player asks for slower working: never hard-code a duration in the working. (Wrong-move reactions may stay short and unpaced.)
- A note that fades (no `to`) stays fully written and still for at least 0.6 s × pace before it fades, whatever `hold` it is given. A note that flies into the expression keeps the timing you give it, because later beats are usually lined up with its landing; give it a `hold` of at least `0.3 * T`.
- Every `MK.note` extends `MK.show` to cover itself, and the fuse also stands still while any `MK.at` beat is still to come, so slower working never costs time.
- Check a microgame at slow pace: `HM.test(id, { auto: true, paceMul: 2 })` must still win, and the working must still line up (film it).

Kit helpers (all in `src/mathkit.js`; targets are ids or node objects; every helper takes `delay` and `dur`):
- `MK.show(g, sec)` — mark the working's length (fuse frozen, input waits).
- `MK.at(g, [[t, fn], ...])` — run steps at times (holds the win until they run).
- `MK.indicate(g, target, { sc, col })` — the part swells and glows, then settles (manim Indicate). `MK.light` / `MK.unlight` — a lasting highlight.
- `MK.circle(g, target | [targets], { col })` — a glowing loop draws itself around the part, then fades (Circumscribe).
- `MK.roll(g, numNode, newValue)` — odometer: the number rolls over to its new value.
- `MK.writeIn(g, target)` — the node writes itself left to right with a pen tip. A fraction node with `bar: { t0: g.t, dur }` draws its bar.
- `MK.strike(g, target)` — the part is crossed out (cancelling, a term leaving).
- `MK.note(g, { node, at, off, s, col, write, hold, to, toOff, s1, then })` — a working note writes itself next to the problem, then flies into its place in the expression (calls `then` on landing) or fades. This is the "showing your work" voice.
- `MK.arrow(g, from, to, { label, bend, col })` — a curved arrow with a label draws itself.
- `MK.tween(g, target, { sc, hl, alpha, dx, dy }, dur, { yoyo })` — animate node properties; `MK.sparkle(g, target)` — a burst of sparkles.
- Every helper that takes a target accepts an id, a node object, a list of either, or `[x, y]`. Notes stay inside the screen while they are written.
- `MK.note(g, { ..., pill: true })` puts a dark rounded panel behind a note so it reads on a busy scene.
- `MK.onMiss(g, fn)` — `fn(g, info)` runs after every wrong move (`info` is `{ tap }`, `{ drag, to }`, or `{ ask }` for a wrong tray tile), so a game can act out the mistake.
- `MK.place(g, key, node, x, y, s, { still: true })` — turns off the automatic glide for an expression the game moves itself every frame (a turning dial, a label riding a moving arrow).
- Node properties the renderer understands: `sc` (scale), `hl` (0–1 highlight, colour `hlc`), `roll`, `write`, `strike`, `bar`, plus `alpha`, `dx`, `dy`, `pop`. A node created with `_born: -1` appears at once instead of fading in (use it for symbols that land from a note). A node faded to `alpha: 0` leaves no ghost when removed.
- When an expression is rewritten, symbols that are still there glide to their new places by themselves (reuse the same node objects to get a glide; new symbols fade in; removed symbols fly into the nearest new one and fade).
In medium mode, the tray opens at `askAt` (when the working has reached the computation, for example "3 + 1"), and `resolve` plays the rest; set `after` to the length of that rest. Film a microgame with `python3 tools/film.py OUTDIR id [level] [mode] [step]`, which writes a frame grid and a GIF of the bot playing it; look at the frames and fix anything that is unclear, cramped or glitchy.

The player may do things in any order that is mathematically valid. The microgame's `moves(g)` lists every valid move at each moment.

**Modes.** `g.mode` is 'easy' or 'medium' (the player picks it on the settings page). In medium mode, when an animation reaches a computation (4 · 3), it pauses and the player picks the result from a tray of 3–4 tiles; wrong tiles are the results of real mistakes. Write each computation as a move with `ask` and `resolve` (see `src/mathkit.js`); easy mode just runs `resolve` by itself. Medium mode gets 40% more time.

Copy the reference microgame `src/games/calc_power.js`, and read `src/mathkit.js` (global `MK`) completely before you start.

## Settings and the check-in (the engine handles these; a microgame needs nothing extra)
- Settings (the gear at the top left of the title screen, the top right of the topic list, or Settings in the pause menu), saved in `SAVE.d.settings` and `SAVE.d.mode` / `SAVE.d.muted`: Timer On/Off (Off: the fuse is hidden and never runs out, and a lost microgame costs no acorn; stars still use time), Animations Slow/Normal/Fast (`g.paceMul`), Speed-ups On/Off (Off: the run stays at speed 1), Mode Easy/Medium, Sound On/Off.
- After every microgame the screen between games shows three buttons for 2.5 s: **Got it!** (saved in `SAVE.d.learn[id]`; that microgame then joins each shuffled round only 40% of the time, in topic runs and in Mix them all), **Confused** (saved; the microgame comes back two games later in the same run, and its working plays ×1.6 slower in every run until the player taps Got it on it), **Replay slower** (the same microgame again at once, a new problem at the same level, working at half speed; it costs no acorn and does not count toward the 12 games, the speed-ups, the score or the stars). No tap records nothing and the run moves on. The check-in also follows the last microgame of a run.
- So every microgame must work at any `g.paceMul` from 0.75 to about 3, and with the timer off it may run for as long as the player likes.
- Pause is a compact bar along the top edge (Resume, rewind, Settings, Quit); the paused microgame stays fully visible, so don't rely on anything covering it.
- **Rewind.** A button beside pause (also in the pause bar and on the check-in screen) opens a scrubber: the player drags back and forth through the microgame's working, taps a move's mark to jump to just before it, or plays it again. It works by re-playing a hidden copy of the microgame from `init` with the recorded frame times, input and random numbers. So a microgame must be **deterministic**: draw every random number that affects the problem or its animation with `g.rand()` (never `Math.random()`; random numbers drawn inside `draw` are fine either way), keep all state in `g.s` (no module-level variables that change during play), never read the wall clock (use `g.t`), and read the pointer only from the handler arguments or `g.ptr`. The suite's `rewind` test checks that the copy matches the live game.

## Goals
- Very fun: juicy animation on every move, constant gentle motion in a gorgeous painted scene with animals, funny never-shameful misses.
- Easy for someone who doesn't know the math: at guidance level 0 the kit glows the first valid move and a ghost hand demonstrates it (a tap, or a drag along an arc). A wrong move at level 0 only wobbles.
- Educational for a smart kid who learns patterns fast: the same operation repeats with new numbers; guidance fades with the level (games 1–4 level 0, 5–8 level 1 where only `area(g)` glows, 9–12 level 2 with no help); a wrong move from level 1 up is a miss; fast solves earn up to 3 stars.

## Visual variety (the owner's rule)
Dragging numbers in similar-looking equations gets monotonous fast, so every microgame must look and feel different from the others, the way every Holy Moly! microgame does:
- Its own world, palette, time of day and framing: underwater, snow, night with fireflies, a desert at sunset, a top-down pond, a close-up of an anthill, a starry sky, a circus, a kitchen. No two microgames share a palette or a layout.
- No generic cream paper card. The math lives inside the world: digits painted on lily pads seen from above, numbers in bubbles rising around an octopus, chalk on a board an owl holds, numbers carried by ants, written in the sand, on balloons, on hanging lanterns, glowing in the night sky. Draw each token's own backing with its box from `MK.box(g, id)` (`{ x, y, w, h }`, centre) and use `MK.drawEx` with a colour that suits the scene (e.g. `MK.place(..., { col: '#fff6e0' })` for light ink on a dark scene).
- The animals do things on every move (hop, carry, splash, cheer), and the scene has constant motion.
- Expression size and placement can vary too: big and bold for a short problem, spread across the scene when the parts have a place in the world (a seesaw's two sides, a grid, a graph).

## Where the player looks (the owner's rule)
Readable on a phone: the screen is 360 × 640, so every number the player must read is at least 18 px (bold, with a shadow or on a contrasting panel), working notes are at least 22 px, the problem line is at least 28 px, nothing runs past the screen edge, the win banner is one or two short words, and the solved line stays bright and large.

The work happens where the player is already looking. Don't send the player's gaze to a side area to do or watch the work: no plates, napkins, benches, side tallies or second working lines in another part of the screen. The expression itself changes in place, and the animals act on the expression. A working note (`MK.note`, "6 ÷ 3 = 2") is fine when it writes itself right beside the part being worked on and then flies into the expression or fades.
- Gestures match how people do the math by hand. Long addition is one swipe down a column; the column adds itself up and the carried 1 hops to the next column by itself (no separate "carry" tap).
- Drops are forgiving. A part dropped near its target counts (the kit accepts drops within `reach`, 64 px by default), and a move can accept a whole region with `area: [x0, y0, x1, y1]`: moving a term to the other side of an equation works anywhere on that side, not only on top of a number. Accept every natural way of doing a move: for vector addition, dragging the second arrow's tail to the first arrow's tip, or the first's tip to the second's tail.
- Keep each microgame to the few moves that carry the idea. If a procedure feels long or confusing to an adult, cut it down.

## Rules
- Always use real math notation (xⁿ, d/dx, f ∘ r, P(A), matrices in brackets), never made-up symbols. When a symbol may be new to a player, add a small key in the scene that names it in words (COMPOSE! shows "r = rotate 120°   f = flip").
- The command (`cmd`) is the real name of the operation, ALL CAPS, ending in "!", at most about 15 characters: `POWER RULE!`, `REGROUP!`, `SOLVE FOR x!`, `DOT PRODUCT!`.
- Two to five moves per microgame. `time` 8–11 seconds at speed 1 (the engine shortens it as the run speeds up); shown working doesn't count against it. Set `hold` to 1.4–1.9 so the result stays up long enough to show the right move after a miss.
- Give every meaningful part of the problem an id, so that wrong moves are possible (the classic mistakes: the wrong column first, the wrong order of operations, the wrong row). Use `MK.inert(g, ids)` for parts that are never tappable (= signs, brackets, labels), and `MK.zone(g, id, box)` for tappable/droppable areas that are not tokens (a grid region, a seesaw pan).
- Wrong moves never end a microgame: the kit turns the part red, wobbles it and counts it (`g.s.mk.wrong`, which costs a star), and the next move keeps glowing. To act a mistake out, watch `g.s.mk.missAt` / `g.s.mk.missInfo` (`{ tap }` or `{ drag, to }`) in `update`/`draw` and play a short (≤ 1 s) temporary animation that changes nothing permanently. The kit no longer calls `onMiss`.
- The next valid move always glows, at every level (the owner's rule). The ghost hand demonstrates it at level 0, or after a 2-second pause.
- The problem sits on a paper card (`MK.card`) roughly between y = 180 and y = 390. The command banner and the win text are drawn at y ≈ 92 and stars at y ≈ 156, so keep that strip clear of important art. The medium-mode tray sits at y = 566. Animals and scenery live behind and below.
- Numbers get harder with `g.level` (0, 1, 2) but stay mental-math sized: the point is the pattern, not arithmetic endurance.
- Math must be exactly correct, including the card text.
- Animals come from `ANI.draw(c, kind, x, y, s, { t, pose, expr, facing, hold })` in `src/animals.js` (kinds: frog, ant, penguin, duck, turtle, octopus, owl, beaver, bird, rabbit, hedgehog, fox; poses idle, cheer, wave, hop, point; expressions happy, laugh, wow, sad, think). Guard with `typeof ANI !== 'undefined'` and fall back to a `P` animal. Scenery comes from `P` in `src/paint.js`; bake static backgrounds with `g.bake(key, (c, W, H) => ...)`.
- No clutter: no explanatory subtitles or instructions on screen. The problem, the animals and the guidance say everything.

## The card
`card: { title, ref, kind, text, note, ask }`
- `title`: the real name ("The power rule"). `ref`: the grade ("Grade 11 and up"). `kind`: the area ("Calculus").
- `text`: what the rule says and why it works, in plain words a curious 10-year-old can follow, with one worked example. About 60–110 words.
- `note`: shown under THE PATTERN: the shortcut rule in one or two sentences.
- `ask`: one or two practice questions.

## Testing
`HM_ONLY=<your file prefix> HM_PAGE=<your own page path> python3 tools/mgtest.py OUTDIR` builds the page, runs the bot at level 0 and at level 2 double speed (both must WIN), and with no input (must FAIL), and writes a contact sheet `OUTDIR/<id>.jpg`. Open every sheet and fix anything that looks weak or unclear. `python3 tests/run.py --page <your page> --only microgames` also checks medium mode and that a wrong move at level 1 fails.
