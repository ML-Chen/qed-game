# Q.E.D.! and Heurēka!

This repo holds two free learning games that run in a web browser and on Android phones. Both are built like the WarioWare video games: a round is a fast series of tiny games, called microgames, each lasting a few seconds.

- **Q.E.D.!** covers math, from grade 3 arithmetic to college topics such as calculus, linear algebra and abstract algebra. Play it at https://ml-chen.github.io/qed-game/ or install the Android app from https://github.com/ML-Chen/qed-game/releases/latest/download/qed.apk.
- **Heurēka!** covers the rest of science and engineering, plus the practical subjects people use at work: physics, chemistry, biology and medicine, earth and space, engineering, robotics and hardware, computer science and AI, personal finance, startups and economics, law, government and consulting. It has 209 microgames in 26 topics so far. Play it at https://ml-chen.github.io/qed-game/heureka/ or install the Android app from https://github.com/ML-Chen/qed-game/releases/download/heureka-android-v1.2/heureka.apk.

## Heurēka!

In Heurēka!, each microgame is one short command, such as SLIDE 3 PUCKS IN!, and a few seconds of tapping, dragging or holding. The idea behind the game happens on screen as a result of what you do. There are no questions to answer and nothing to calculate. Some examples:

- **SLIDE 3 PUCKS IN!** You flick three pucks across an ice rink. On the ice a puck glides at the same speed in a straight line into the net. A puck flicked across a patch of sand scrapes to a stop. That is Newton's first law: a moving thing keeps moving until something pushes or rubs on it.
- **BLOW OUT THE CANDLES!** You pull a bunny's diaphragm down to breathe in, then let it go to blow out a row of candles. Air moves into the lungs only while the diaphragm moves down, and out only while it moves back up.
- **PRESS THE CHEST ON EVERY BEAT!** Two hands press on a chest in time with the beat. Each press squeezes the heart between the breastbone and the spine, and blood flows up to the brain, which turns from grey to pink.
- **BUILD WHAT THEY WANT!** You run a smoothie booth. Each customer tries a cup, walks off and shows in a thought bubble what they wanted, such as ice or berries, and you drag that onto the product. Once it has everything they asked for, customers come back by themselves and bring friends. Advertise too early and a crowd tries it once and leaves. Startups call this product-market fit.
- **RUN THE LOOP, THEN BEEP!** A short Python loop sits on screen, and you act as the computer: you tap the lap counter once per lap and run the `beep()` line when the loop ends.

Every game shows what to do without any reading. The thing to tap glows, a drag shows what to grab and where it goes, and a hold is a labelled button such as "Hold to heat". A ghost hand shows the next step at the start of every level and again whenever you stop for a moment. Counters such as "2 / 3" show what is left. After a microgame, a "How it works" button opens a card that explains the idea in plain words. Every card is also collected under Cards on the title screen.

The plan for every subject is in [docs/science/](docs/science/): one curriculum file per subject, about 1,500 microgame ideas in all, mapped to standard courses (NGSS, AP, OpenStax, MIT and others) and ordered by how useful each topic is for real jobs and projects. The order in which they are being built is in [docs/science/BUILD_PLAN.md](docs/science/BUILD_PLAN.md).

## Q.E.D.!

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

## How Q.E.D.! plays

In Q.E.D.!, every microgame is one real math problem, such as 368 + 587, 2x + 5 = 13, or the integral of 3x².

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

Each game also comes as an Android app, packaged so it works offline:

- **Q.E.D.!:** https://github.com/ML-Chen/qed-game/releases/latest/download/qed.apk
- **Heurēka!:** https://github.com/ML-Chen/qed-game/releases/download/heureka-android-v1.2/heureka.apk (newer versions, if any, are on the [releases page](https://github.com/ML-Chen/qed-game/releases) under tags that start with `heureka-android-v`)

Open the file on your phone to install it (Android asks once to allow installs from your browser). The two apps install side by side. Saved progress stays on the phone. When a new version of a game is published, its app downloads it by itself, so you don't need to reinstall. How the apps are built and signed: [docs/ANDROID.md](docs/ANDROID.md).

## For developers

Each game is one self-contained web page. All the art is drawn in code, so there are no image files to load. The two games share one engine, art library, animal cast and sound library in `src/`; Heurēka!'s own topics, scene kit, title screen and microgames are in `heureka/`.

- **Build:** `python3 src/build.py dist/qed.html` (Q.E.D.!) or `python3 src/build.py --app heureka` (Heurēka!, written to `dist/heureka.html`), then open the page in a browser.
- **Test:** `python3 tests/run.py`. It needs Playwright and Chromium, and it plays every microgame with a robot player.
- **Film one microgame:** `python3 tools/film.py OUTDIR <id>` saves a frame-by-frame picture sheet and a GIF of a robot playing it, which is the easiest way to check an animation.
- **Write a microgame:** see [docs/MICROGAMES.md](docs/MICROGAMES.md) for Q.E.D.! and [docs/HEUREKA_MICROGAMES.md](docs/HEUREKA_MICROGAMES.md) for Heurēka!. Set `HM_APP=heureka` to make the test and filming tools build Heurēka!. Microgames still in progress are listed in `src/games/PENDING` and are left out of the published game until they pass review.
- **Publishing:** every push to the `main` branch that changes `src/` or `heureka/` rebuilds both websites automatically.

The game engine and the drawing library come from the author's earlier game Holy Moly!. Fonts: Fredoka and Nunito, under the SIL Open Font License (`src/OFL-*.txt`).
