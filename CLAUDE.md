# Q.E.D.! — notes for working on this repo

Q.E.D.! is a WarioWare-style math game for grade 3 through college. Each microgame shows one real math problem, and the player solves it by tapping parts of the problem and dragging parts onto other parts, in any mathematically valid order. Every move plays a manim-style animation that shows the working step by step by itself (the fuse pauses while it plays), with animals doing the work. Medium mode also asks the player to pick each computed result from a tray. It is one self-contained HTML page with all art drawn in code. The engine and the art library come from the owner's earlier game Holy Moly! (ML-Chen/holy-moly).

## Build and check
- `python3 src/build.py dist/qed.html` inlines every module into one page. Each module and each microgame gets its own `<script>` tag.
- `python3 tests/run.py` builds the page and runs the whole suite in headless Chromium (a few minutes; longer when the machine is busy). `--only NAME` runs one test; `--out DIR` saves screenshots of every screen. Run it before reporting back on any change under `src/`.
- `python3 tools/film.py OUT id [level] [mode] [step]` films one microgame played by its bot: a frame grid every `step` seconds and a GIF. Use it to check every animation.
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
- Show your work: every operation animates its working automatically, slowly enough to follow, and delightfully (docs/MICROGAMES.md, "Show your work").
- Commands use the real names of the operations ("POWER RULE!", "REGROUP!", "DOT PRODUCT!").
- Gorgeous graphics with animals in the background. No clutter: no explanatory subtitles, eyebrow text or long instructions.
- Easy for someone who doesn't know the math (level-0 guidance shows what to tap), educational for a smart kid who learns patterns fast (guidance fades, fast answers earn stars).
- Coverage goal: everything in Khan Academy's math courses from 3rd grade through college, and more (abstract algebra, number theory, discrete math).

## Settings, check-in and pacing (src/engine.js, src/mathkit.js)
- Settings page (`SET`, `SET_ROWS`, `drawSettings`): a gear at the top left of the title (mute stays top right), the top right of the topic list, and Settings in the pause menu. Timer On/Off, Animations Slow/Normal/Fast, Speed-ups On/Off, Mode Easy/Medium (it used to sit at the bottom of the topic list), Sound On/Off; saved in `SAVE.d.settings` (`timer`, `anim`, `speedups`), `SAVE.d.mode`, `SAVE.d.muted`. Read them with `setting(k)` / `timerOn()`.
- Check-in after every microgame, on the between screen (`CHECKIN`, `checkIn`, `drawCheckin`): Got it! / Confused / Replay slower, saved per microgame in `SAVE.d.learn[id] = { s: 'got' | 'confused', at }`. Got it: picked less often (`MASTERED_ODDS` in `playlist`). Confused: requeued two games later in the run, working ×1.6 slower until a later Got it. Replay slower: `nextMicro(true)` replays it at the same level with working ×2 slower; a replay changes nothing in the run. No tap: nothing is saved and the run moves on after 2.5 s.
- Pacing: `MK.pace(g)` = level factor (1, 0.9, 0.8) × a speed-up factor of at most 10% × `g.paceMul` (`paceMulFor(def, replay)` in engine.js). Fading notes hold at least 0.6 s × pace; notes extend `MK.show`; the fuse stands still while `MK.at` beats are pending. Rules for microgames: docs/MICROGAMES.md, "Pacing rules".
- `SAVE.merge` keeps the newer settings and, per microgame, the newer check-in. Never rename the save key `qed1`.
- `HM.test(id, { paceMul, timer: false, maxT })` plays a microgame slower, with no time limit, or for longer; `HM.state()` reports the check-in.
- Pause (`drawPause`, `pauseItems`): a compact bar along the top edge (Resume, rewind, Settings, Quit) with no dimming, so the paused game stays visible; taps on the game don't resume.
- Rewind scrubber (`openRewind`, `simAt`, `drawRewind`): every live microgame records `g.rec` (frame dts, input events, random numbers drawn outside `draw`); the scrubber re-plays a hidden copy from `init` to the chosen time and draws it (`MK.track` for the last 0.45 s so glides show). View only; closing returns to the live game. Microgames must be deterministic (docs/MICROGAMES.md, "Rewind"). `HM.rewind.open/seek/close/info` drive it in tests.

## Publishing and the Android app
- `.github/workflows/pages.yml` (only when `github.repository == 'ML-Chen/qed-game'`): pushes to `main` that touch `src/` build `dist/qed.html` and force-push one commit to `gh-pages` with `index.html`, `.nojekyll` and `update/` (the same page, `manifest.json`, `manifest.sig`), signed with the `QED_UPDATE_KEY` secret by `tools/publish_pages.sh` and `tools/update_manifest.py`. Without the secret it publishes the site with a warning and no `update/`. Don't push `gh-pages` by hand. The owner turns on Pages (Settings > Pages > Deploy from a branch > gh-pages).
- `.github/workflows/android.yml` (same guard) runs on pushes to `main` that change `android/**`, on demand, or on an `android-v*` tag. It builds the APK with `android/build.sh` (secrets `QED_UPDATE_KEY`, `QED_KEYSTORE_B64`, `QED_KEYSTORE_PASSWORD`) and publishes release `android-v1.<run>`; the newest APK is at releases/latest/download/qed.apk. The owner reuses Holy Moly!'s keystore, so the key alias is `holymoly`, set once as `KEY_ALIAS_DEFAULT` in `android/build.sh`. Claude sessions don't create releases or push tags. Owner setup: docs/ANDROID.md.
- `android/src/app/qed/UpdateCheck.java` holds the placeholder `@@UPDATE_PUBKEY_B64@@`; `android/build.sh` fills it from the private key at build time. Never commit a key or replace the placeholder in the source. The app accepts only manifests with `"app": "qed"`.
- The app (`app.qed`, "Q.E.D.!") serves the game at `https://appassets.androidplatform.net/index.html` with a CSP that allows no outside hosts and no JS bridge, and checks https://ml-chen.github.io/qed-game/update/ for signed updates. Saves stay in localStorage (`qed1`) at that fixed address, so don't rename the save key. If the game ever needs a network resource, the CSP in `MainActivity.java` must change too. Check with `node tools/test_app_csp.js dist/qed.html /tmp/qed-app`.
- Launcher icons: `node tools/make_icon.js` renders `android/res/mipmap-*` from the frog in src/animals.js on a lily pad. Look at them after re-rendering.
- `.github/workflows/test.yml` runs the test suite on every push and pull request.
