# Q.E.D.! — notes for working on this repo

Q.E.D.! is a WarioWare-style math game for grade 3 through college. Each microgame shows one real math problem, and the player solves it by tapping parts of the problem and dragging parts onto other parts, in any mathematically valid order. Every move plays an animation that does the arithmetic in real time, with animals doing the work. Medium mode also asks the player to pick each computed result from a tray. It is one self-contained HTML page with all art drawn in code. The engine and the art library come from the owner's earlier game Holy Moly! (ML-Chen/holy-moly).

## Build and check
- `python3 src/build.py dist/qed.html` inlines every module into one page. Each module and each microgame gets its own `<script>` tag.
- `python3 tests/run.py` builds the page and runs the whole suite in headless Chromium (about a minute). `--only NAME` runs one test; `--out DIR` saves screenshots of every screen. Run it before reporting back on any change under `src/`.
- `python3 tools/mgtest.py OUT [id ...]` plays microgames with their bots and writes a contact sheet per microgame. Look at the sheets after every change. `HM_ONLY=prefix_` and `HM_PAGE=path` let parallel workers test only their own files.

## Module map (src/)
| File | What it does |
|---|---|
| game.html | Page template with inline markers |
| paint.js | The art library `P` (from Holy Moly!): skies, hills, water, plants, the shouted-command lettering |
| animals.js | The animal cast `ANI` (frog, ant, penguin, duck, turtle, octopus, owl, ...) and the acorn lives icon |
| title.js | The animated title painting; `GAME_NAME` |
| mathkit.js | `MK`: typesetting expressions, tap and drag moves, the medium-mode answer tray, guidance (glow and ghost hand), flying numbers, timers, stars, the generic bot |
| engine.js | Topics (`STAGES`), the microgame registry `MG`, the run loop (acorns, speed-ups, the owl's second chance, pause), screens, cards, saving, test hooks `HM` |
| audio.js, music_tracks.js | Synthesized grooves, jingles and sound effects; two pre-rendered tracks (from Holy Moly!) |
| games/*.js | One microgame per file, `<stage>_<id>.js`. `games/PENDING` (optional) lists files left out of builds |

How to write a microgame: docs/MICROGAMES.md. The reference microgame is `src/games/calc_power.js`.

## Rules the owner asked for
- Commands use the real names of the operations ("POWER RULE!", "REGROUP!", "DOT PRODUCT!").
- Gorgeous graphics with animals in the background. No clutter: no explanatory subtitles, eyebrow text or long instructions.
- Easy for someone who doesn't know the math (level-0 guidance shows what to tap), educational for a smart kid who learns patterns fast (guidance fades, fast answers earn stars).
- Coverage goal: everything in Khan Academy's math courses from 3rd grade through college, and more (abstract algebra, number theory, discrete math).

## Publishing
- `.github/workflows/pages.yml` publishes `index.html` to the `gh-pages` branch on pushes to `main` that touch `src/`. The owner turns on Pages (Settings > Pages > Deploy from a branch > gh-pages).
- `.github/workflows/test.yml` runs the test suite on every push and pull request.
