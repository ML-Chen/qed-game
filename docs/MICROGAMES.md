# Writing a Q.E.D.! microgame

Q.E.D.! is a WarioWare-style math game for grade 3 through college. Each microgame shows one real math problem. The player solves it only by tapping parts of the problem and dragging parts onto other parts, never by choosing an answer from a list (in easy mode). Every move starts an animation that does the arithmetic in real time and rewrites the expression, so the player watches how the operation works. Examples:
- Long addition: drag the digits of each column down into the answer, right to left; the column adds up in front of you, and a ten is carried over as a 1.
- Power rule: drag the exponent onto the coefficient; they multiply, and the exponent drops by one.
- Chain rule: drag the d/dx onto each layer of the function.
- Solving 2x + 5 = 13: drag the + 5 across the = sign (it becomes − 5), tap 13 − 5 to compute it, then drag the 2 across to divide.

**Pace.** The player never waits on an animation. Every computation happens because the player taps it (or drags something), and its result appears at once with a quick pop. For example, in the power rule, dragging the exponent onto the coefficient instantly turns 3x⁴ into (4 · 3) x^(4 − 1); tapping 4 · 3 makes 12 and tapping 4 − 1 makes 3, in either order. Animations last at most about 0.25 s and never block input (`busy` ≈ 0.1). Scale `g.dur` in init with the number of moves (calc_power.js: `g.dur *= (2.6 + 1.05 * nMoves) / 8`) so the fuse is tight but fair.

The player may do things in any order that is mathematically valid. The microgame's `moves(g)` lists every valid move at each moment.

**Modes.** `g.mode` is 'easy' or 'medium' (the player picks it on the topic screen). In medium mode, when an animation reaches a computation (4 · 3), it pauses and the player picks the result from a tray of 3–4 tiles; wrong tiles are the results of real mistakes. Write each computation as a move with `ask` and `resolve` (see `src/mathkit.js`); easy mode just runs `resolve` by itself. Medium mode gets 40% more time.

Copy the reference microgame `src/games/calc_power.js`, and read `src/mathkit.js` (global `MK`) completely before you start.

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
The work happens where the player is already looking. Don't send the player's gaze to a side area to do or watch the work: no plates, napkins, benches, side tallies or second working lines in another part of the screen. The expression itself changes in place, and the animals act on the expression.
- Gestures match how people do the math by hand. Long addition is one swipe down a column; the column adds itself up and the carried 1 hops to the next column by itself (no separate "carry" tap).
- Drops are forgiving. A part dropped near its target counts (the kit accepts drops within `reach`, 64 px by default), and a move can accept a whole region with `area: [x0, y0, x1, y1]`: moving a term to the other side of an equation works anywhere on that side, not only on top of a number. Accept every natural way of doing a move: for vector addition, dragging the second arrow's tail to the first arrow's tip, or the first's tip to the second's tail.
- Keep each microgame to the few moves that carry the idea. If a procedure feels long or confusing to an adult, cut it down.

## Rules
- Always use real math notation (xⁿ, d/dx, f ∘ r, P(A), matrices in brackets), never made-up symbols. When a symbol may be new to a player, add a small key in the scene that names it in words (COMPOSE! shows "r = rotate 120°   f = flip").
- The command (`cmd`) is the real name of the operation, ALL CAPS, ending in "!", at most about 15 characters: `POWER RULE!`, `REGROUP!`, `SOLVE FOR x!`, `DOT PRODUCT!`.
- Two to five moves per microgame. `time` 8–11 seconds at speed 1 (the engine shortens it as the run speeds up). Set `hold: 1.4` so the result stays up long enough to show the right move after a miss.
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
