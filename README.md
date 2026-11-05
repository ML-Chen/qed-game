# Q.E.D.!

Q.E.D.! is a free math game that runs in a web browser and on Android phones. It covers math from grade 3 arithmetic to college topics such as calculus, linear algebra and abstract algebra.

**Play it:** https://ml-chen.github.io/qed-game/ (works on phones and computers; nothing to install)

**Android app:** https://github.com/ML-Chen/qed-game/releases/latest/download/qed.apk

<p>
<img src="docs/screenshots/title.jpg" width="216" alt="Title screen">
<img src="docs/screenshots/topics.jpg" width="216" alt="Topic list, grouped by school level">
<img src="docs/screenshots/power.jpg" width="216" alt="POWER RULE!: numbers on lily pads in a pond seen from above">
<img src="docs/screenshots/chain.jpg" width="216" alt="CHAIN RULE!: the outer and inner functions as glowing bubbles in a night marsh">
</p>
<p>
<img src="docs/screenshots/compose.jpg" width="216" alt="COMPOSE!: rotating and flipping a turtle's triangular shell on a sunset beach">
<img src="docs/screenshots/dice.jpg" width="216" alt="PROBABILITY!: a duck stall at a night fair with all 36 outcomes of two dice">
<img src="docs/screenshots/solve.jpg" width="216" alt="SOLVE FOR x!: an equation on a penguin seesaw">
<img src="docs/screenshots/dot.jpg" width="216" alt="DOT PRODUCT!: matrices made of bubbles and jellyfish on a night reef">
</p>
<p>
<img src="docs/screenshots/regroup.jpg" width="216" alt="REGROUP!: column addition in an ant hill">
<img src="docs/screenshots/tangent.jpg" width="216" alt="TANGENT!: turning reeds to match the curve's slope; the derivative appears in the pond">
<img src="docs/screenshots/vecadd.jpg" width="216" alt="VECTOR ADD!: arrows tip to tail in a lagoon">
</p>

## How it plays

The game is built like the WarioWare video games: a round is a fast series of tiny games, called microgames, each lasting a few seconds. In Q.E.D.!, every microgame is one real math problem, such as 368 + 587, 2x + 5 = 13, or the integral of 3x².

1. You pick a topic, for example "Fractions" or "Derivatives". A round in that topic is 12 microgames in a row.
2. Each microgame shows a command with the name of the operation, such as "REGROUP!", "SOLVE FOR x!" or "POWER RULE!", and one problem.
3. You solve the problem by tapping and dragging parts of it, the way you would point at the steps on paper. For example, to solve 2x + 5 = 13 you drag the + 5 to the other side of the = sign, tap 13 − 5 to work it out, then drag the 2 across to divide. Any order that is mathematically valid works.
4. A timer bar runs along the bottom of the screen. You start a round with four acorns, and you lose one each time the timer runs out before you finish a problem. Every 4 games the round speeds up.

The game teaches as you go. The next correct move always glows. In the first four microgames of a round, a ghost hand also acts each move out, so someone who has never seen the topic can still play; later in the round, the hand appears only if you pause. A wrong move only makes the part wobble, so you can try again. Every microgame unlocks a card that explains in plain words why the rule works, with a worked example.

In easy mode, the game does all the arithmetic for you. In medium mode, the game also stops at each calculation and asks you to pick its result from a few choices.

## The math is shown step by step

After each tap or drag, the game shows the working on screen automatically, the way a teacher would write it on a board, and animals act it out. The timer pauses while the working plays, so watching it never costs time. Some examples:

- **Column addition:** the digits of a column light up one by one, "8 + 7 = 15" writes itself under the column, the 5 drops into the answer, and the carried 1 lifts off and arcs over to the top of the next column, where it is added in.
- **Long multiplication:** each product is written out ("6 × 7 = 42"), the 2 drops into the answer, and the 4 is carried above the next column and added at the next step.
- **Solving an equation:** the + 5 hops over the = sign and turns into − 5 at the top of its arc, and "÷ 2" writes itself under both sides before each side is divided.
- **Integrating a power:** a "+1" writes itself next to the exponent, the exponent reads "2 + 1" for a moment and then rolls over to 3 like a car's odometer, and the new power drops under a fraction bar.

As a player gets faster later in a round, the working plays faster too.

## Topics

Topics are grouped by school level. They include adding and subtracting, multiplying and dividing, fractions, decimals, factors and primes, area and perimeter, ratios and percents, expressions and equations, exponents, polynomials, logarithms, complex numbers, vectors, matrices, linear algebra, probability, derivatives, integrals, number theory and symmetry groups. New microgames are added as they pass review. The full plan maps every unit of Khan Academy's math courses from grade 3 to college to a microgame: [docs/CURRICULUM.md](docs/CURRICULUM.md).

## Android app

The Android app is the same game, packaged so it works offline. Download the newest version from https://github.com/ML-Chen/qed-game/releases/latest/download/qed.apk and open the file on your phone to install it (Android asks once to allow installs from your browser). Saved progress stays on the phone. When a new version of the game is published, the app downloads it by itself. How the app is built and signed: [docs/ANDROID.md](docs/ANDROID.md).

## For developers

The whole game is one self-contained web page. All the art is drawn in code, so there are no image files to load.

- **Build:** `python3 src/build.py dist/qed.html`, then open `dist/qed.html` in a browser.
- **Test:** `python3 tests/run.py`. It needs Playwright and Chromium, and it plays every microgame with a robot player.
- **Film one microgame:** `python3 tools/film.py OUTDIR <id>` saves a frame-by-frame picture sheet and a GIF of a robot playing it, which is the easiest way to check an animation.
- **Write a microgame:** see [docs/MICROGAMES.md](docs/MICROGAMES.md). Microgames still in progress are listed in `src/games/PENDING` and are left out of the published game until they pass review.
- **Publishing:** every push to the `main` branch that changes `src/` rebuilds the website automatically.

The game engine and the drawing library come from the author's earlier game Holy Moly!. Fonts: Fredoka and Nunito, under the SIL Open Font License (`src/OFL-*.txt`).
