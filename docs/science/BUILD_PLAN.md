# Heurēka! build plan: which microgames to build first

Status: Wave 1 is final and ready to build. Waves 2 and 3 follow below. Written 2026-11-05 from six curriculum files (physics, chem_bio, earth_eng, cs, business, law_policy: 1,669 rows). `CURRICULUM_hardware.md` had not landed yet, so `build`, `circuits` and `robots` come from earth_eng and physics rows; when the hardware file lands, its build-first picks go into Wave 2 for those topics (Wave 1 stays as it is so builders are not disrupted). `motion_slide` (PHY PMS-01 `SLIDE!`) is already built and counts as one of the motion games.

IDs are written with a file tag because several files reuse the same prefixes (`EL-` appears in four files, `SC-` in two): PHY = physics, CB = chem_bio, EE = earth_eng, CS = cs, BUS = business, LP = law_policy, HW = hardware.

## 1. How games are ranked

Score each row on four things, in this order of weight:

1. **Career use (weight 3).** Would knowing this idea help someone in a real job or project (building software or AI, running money or a company, engineering, medicine)? Life-safety ideas (fire, CPR, handwashing) count as career use.
2. **Fun and clear action (weight 2).** The goal is obvious from the command and the first frame, with no reading and no question. One action the player can see in under a second; a funny fail that shows the idea. Rows that are "act out several lines of code" or "drag each card to its slot" score lower than one-touch rows.
3. **Cheap to build (weight 1).** Simple shapes, one moving body, a slider, a fill bar or a tap target beat elaborate scenes with many characters or custom simulation. Reusing a scene another game already needs (the pie, the bucket, the circuit) counts as cheap.
4. **Balance (a hard rule, not a score).** Breadth first: every one of the 26 topics gets exactly 3 games in Wave 1, so a player can start in any topic. Within each topic, the Elementary-level game comes first, so newcomers can start anywhere. From Wave 2 on, the heavier topics get extra games: `programs`, `apps`, `ai`, `money`, `startups`, `circuits`, `robots`, `build` and `medicine`.

Two more rules apply to every wave:
- **No two games in the same topic share a core mechanic** in the same wave (fling, flick, drag-to-target, hold, hold-and-release, tap timing, rhythm, mash, trace, tilt, slider or dial, swipe, steer, stack, sort). Within a topic, Waves 1 and 2 together use at least five different mechanics.
- **Commands are unique across the app.** The curriculum files were de-duplicated only within each file, so many verbs repeat across files (`POUR!` and `ROLL!` four times each). The rule: the game in the earlier wave keeps the command; the later one is renamed. Renames are listed with each wave and in section 6.

## 2. Wave 1: 78 games, 3 per topic (build these now)

Order within each topic: the first row is the entry game. Build topic by topic in the order shown, or one game per topic in a round-robin, so that every topic is playable early.

| Topic | Curriculum ID | Command | Mechanic | One-line action | Why chosen |
|---|---|---|---|---|---|
| motion | PHY PE-01 | `GOAL!` | hold-and-release | Hold to wind up the paddle; let go. | Elementary entry; one push, ball flies |
| motion | PHY PMS-01 | `SLIDE!` | flick | Flick the puck. | ALREADY BUILT (motion_slide); build-first #2; inertia on ice vs sand |
| motion | PHY PHS-01 | `SWING!` | tap timing | Tap to let go of the string at any moment, to hit the target. | build-first #1; owner asked for circular motion |
| waves | PHY PE-12 | `PLUCK!` | swipe (pluck) | Swipe to pluck the band. | Elementary entry; vibration makes sound |
| waves | PHY PMS-21 | `SHATTER!` | slider tune | Slide the owl's note up or down until the glass starts to hum. | build-first #3; resonance with real audio |
| waves | PHY AP1-33 | `PUMP!` | rhythm tap | Tap to push each time the swing comes back to you. | build-first #6; driving at the natural frequency |
| energy | PHY PE-15 | `KNOCK DOWN!` | drag-and-release | Drag a ball onto the ramp and let it go; try again if the tower stands. | owner's own rewrite example; heavier/faster hits harder |
| energy | PHY PP-08 | `SWITCH OFF!` | tap toggle | Tap appliances to switch them off until the meter slows below the line. | home energy budget, a real-life skill |
| energy | PHY PP-09 | `PEDAL!` | mash | Mash to pedal and keep the bulb lit. | power felt in the body; mash is cheap to build |
| forces | PHY PE-25 | `FLOAT!` | pinch/shape | Pinch the clay out into a bowl shape, then let it go on the water. | Elementary; floating, the format example FLOAT! |
| forces | PHY PE-22 | `LIFT!` | slide-to-position | Slide the log toward the rock, then the frog hops on the other end. | levers, used in every machine |
| forces | PHY PMS-03 | `TUG!` | mash | Mash to pull; your arrow grows with every tap. | net force as a tug of war |
| atoms | PHY PHS-39 | `SPLIT!` | flick | Flick the neutron into the nucleus. | fission chain in one flick; nuclear power |
| atoms | PHY PHS-38 | `CONTROL!` | hold steady (drag) | Drag the control rods in or out to keep the neutron counter steady. | reactor control; also teaches feedback |
| atoms | PHY QP-05 | `FIRE ONE!` | tap repeat | Tap to fire electrons one at a time. | build-first #9; quantum stripes appear dot by dot |
| matter | CB EL-15 | `STIR!` | stir (circle trace) | Stir until the sugar is gone, then drag the magnifying glass over the glass. | Elementary; dissolving |
| matter | CB MC-08 | `MELT IT!` | hold | Hold the burner button until the last piece of ice is gone. | build-first #9; temperature stalls while ice melts |
| matter | CB APC-27 | `HERD!` | swipe herd | Pull the wall out, then try to herd the particles back into the left half. | build-first #4; entropy |
| reactions | CB EL-17 | `FIZZ!` | tilt/tip | Tip the dishes into the bottle until the balloon fills. | Elementary; gas from a reaction fills a balloon |
| reactions | CB HC-12 | `BALANCE!` | drag-to-pan | Add whole molecules to either pan until every colour matches. | build-first #2; balancing equations as a scale |
| reactions | CB APC-17 | `HURRY!` | tap the slow one | Tap an animal to speed it up until the fire is out in time. | build-first #10; rate-limiting step, also queues and factories |
| fire | CB FP-01 | `SMOTHER!` | swipe (remove) | Swipe one side of the triangle away (rake the logs apart, shovel sand over it, or... | fire triangle, life-safety |
| fire | CB FP-05 | `STAY LOW!` | steer path | Drag the fox to the door, keeping it under the smoke. | escaping smoke, life-safety |
| fire | CB FP-03 | `PUT IT OUT!` | drag-to-target | Drag an extinguisher to each fire until all three are out. | right extinguisher for the fire |
| life | CB EL-01 | `FEED!` | drag-to-target | Drag snacks and water to everything that needs them before time runs out. | Elementary; what living things need |
| life | CB MB-16 | `HUNT!` | tap fast | Tap every moth you can see in 5 seconds. | build-first #1; natural selection by the player's own hand |
| life | CB MB-09 | `UNLEASH!` | tap timing | Release foxes when the rabbits are plentiful, and watch the seasons. | predator and prey cycles |
| body | CB EL-06 | `CURL UP!` | tap timing | Tap the hedgehog at the right moment to curl it into a ball. | Elementary; a body reflex/defence |
| body | CB AN-17 | `INHALE!` | pull down (drag) | Pull the diaphragm down. | how breathing works |
| body | CB AN-15 | `GOBBLE!` | steer chase | Steer the white cell into the bacteria. | white cells eat bacteria |
| cells | CB MB-02 | `EQUIP!` | drag-to-target | Drag the parts in until the cell comes alive. | cell parts, middle-school entry |
| cells | CB HB-11 | `DIVIDE!` | hold then swipe | Hold to copy, swipe to line them up, then swipe apart. | the format example SPLIT!: copy then divide |
| cells | CB APB-23 | `CYCLE!` | rhythm tap | Tap heat, cool, heat, cool, in rhythm. | build-first #6; PCR doubling, used in every lab |
| medicine | CB FB-06 | `WASH HANDS!` | mash | Mash to scrub with soap until the song bar fills, then rinse. | handwashing; entry-level, life-useful |
| medicine | CB MED-07 | `SCREEN!` | sweep scan | Scan the crowd with the test. | build-first #5; false positives without numbers |
| medicine | CB HB-24 | `TREAT!` | tap timing | Tap the antibiotic button each time the dish regrows. | build-first #3; antibiotic resistance |
| earth | EE EL-10 | `PLANT!` | tap to plant | Tap the hill to plant grass and bushes before the rain. | Elementary; roots stop erosion |
| earth | EE MSE-01 | `PLOUGH!` | drag-push | Drag the cold air into the warm air. | build-first #1; fronts make storms |
| earth | EE HES-06 | `ROLL DICE!` | mash | Mash to roll 30 years of dice for all 100 houses. | build-first #5; rare-risk odds for homeowners |
| space | EE EL-05 | `TRACE!` | trace | Trace the Sun's path across the sky with a finger. | Elementary; the Sun's path across the sky |
| space | EE AS-01 | `CATCH UP!` | tap timing | Tap the brake to drop into a lower orbit, then boost back up. | build-first #3; brake to catch up in orbit |
| space | EE MSE-22 | `LAUNCH!` | pull-and-release | Pull back and let go. | launching; simple slingshot physics |
| build | EE EL-18 | `SHAKE!` | stack then shake | Drag blocks to build a tower, then the table shakes. | Elementary; design and test a tower |
| build | EE ME-21 | `BRACE!` | draw a line | Drag a diagonal across each square. | build-first #4; triangles hold, squares fold |
| build | EE ME-16 | `STAND IT UP!` | rotate | Turn the plank onto its edge. | build-first #8; beam depth |
| circuits | PHY PE-16 | `CLOSE!` | drag-to-close | Drag the loose wire end onto the bulb. | Elementary; the format example CLOSE! |
| circuits | EE EE-30 | `FUZZ!` | dial | Turn up the gain until the guitar sounds fuzzy. | build-first #7; clipping as guitar fuzz |
| circuits | EE EE-18 | `UNLOCK!` | two-finger hold | Press both buttons. | AND logic, the base of all chips |
| robots | EE SC-02 | `HOLD TEMP!` | tap toggle | Tap the heater on when the room gets cold and off when it gets warm. | thermostat on/off control; the simplest controller |
| robots | EE SC-04 | `STOP THE HOWL!` | pull back (drag) | Pull the microphone back until the squeal dies. | build-first #6; feedback loops |
| robots | EE SC-01 | `APPROACH!` | dial | Turn the gain until the robot stops right at the line. | gain tuning: robot stops at the wall instead of crashing |
| programs | CS EL-02 | `HOP!` | drag cards then run | Drag the arrow cards into the strip, then tap go. | Elementary; steps in order |
| programs | CS PR-02 | `LOOP!` | act out (tap step) | Act out the body, then click the wall counter when the glow jumps back to the `for` line. | build-first #1; the signature you-are-the-computer game |
| programs | CS RD-10 | `BREAK IT!` | fling inputs | Throw inputs into the machine until it breaks. | build-first #5; the habit that catches real bugs |
| apps | CS EL-12 | `HIDE!` | swipe sort | Swipe private cards into the chest; let the others float up to the board. | Elementary; keep private things private |
| apps | CS AP-01 | `WIRE UP!` | connect wires | Drag wires: phone to server, server to cabinet. | build-first #4; screen, server, database |
| apps | CS VC-03 | `RESOLVE!` | tap timing (switch) | Let one train through, or move carriages so the track carries the right combination,... | build-first #6; merge conflicts as trains |
| ai | CS AI-02 | `NEXT!` | pull down | Pull the next word down from the bars, then the next. | build-first #10; what a language model does |
| ai | CS AI-06 | `ROLL DOWN!` | tap nudge | Nudge the ball a step in the downhill direction each time. | gradient descent, how every model learns |
| ai | CS BA-15 | `IGNORE!` | drag-to-box | Drag the email's text into the "just data" box before the agent reads it, and put the... | build-first #9; prompt injection |
| money | BUS EL-08 | `SAVE!` | drag-to-jar | Drag each coin into the jar before the candy cart grabs it. | Elementary; save before the candy shop |
| money | BUS PF-07 | `ROLL!` | hold | Hold to keep the snowball rolling down the hill. | build-first #4; compound growth |
| money | BUS PF-11 | `STAY ABOVE!` | tap with a limit | Tap groceries into your cart while keeping the water above the floor. | overdrafts, the most common avoidable fee |
| startups | BUS EL-17 | `SET THE PRICE!` | stop the dial | Tap to stop the dial. | Elementary; set a price at a stand |
| startups | BUS SV-20 | `DILUTE!` | drag-to-target | Drag the investor's slice into the pie. | build-first #1; dilution and a bigger pie |
| startups | BUS SV-09 | `PLUG!` | whack (tap holes) | Tap the holes to plug them. | build-first #8; churn |
| markets | BUS EL-16 | `TRADE!` | drag one | Drag one apple to your friend. | Elementary; trade makes both better off |
| markets | BUS MI-06 | `CLEAR STALL!` | slider | Slide the price until every apple is sold and nobody is left waiting. | build-first #10; supply meets demand |
| markets | BUS MI-04 | `STOP EATING!` | tap then stop | Tap to eat slices; stop when the next heart is smaller than the coin. | marginal benefit falls |
| law | LP EC-12 | `KNOCK FIRST!` | tap before acting | Tap the bird's door before pressing play. | Elementary; ask before you use someone else's thing (consent) |
| law | LP LW-18 | `WRAP THE SHOP!` | encircle (drag a bubble) | Drag a bubble around the bakery before the letters arrive. | build-first #1; an LLC shields the owner's house |
| law | LP LW-07 | `CATCH COPIES!` | swipe away | Swipe away the copycat who copied your pages. | build-first #3; copyright protects expression, not ideas |
| policy | LP EC-10 | `DROP A COIN!` | tap each | Tap each animal so it drops its coin into the town jar. | Elementary; everyone chips in for the town (taxes, public goods) |
| policy | LP GP-02 | `CLEAR THE RATS!` | pull a lever | Pull a lever. | build-first #4; incentives backfire (the rat bounty) |
| policy | LP GP-31 | `SPLIT THE VOTE!` | drag to place | Plant the pasta flag beside the pizza flag. | build-first #5; the spoiler effect |
| problems | LP EC-13 | `BREAK IT UP!` | swipe to split | Swipe across the cloud to split it into small piles: toys, clothes, books. | Elementary; break a big mess into small piles |
| problems | LP PS-17 | `TILE IT!` | drag tiles | Drag tiles to cover the floor. | build-first #6; MECE: no gaps, no overlaps |
| problems | LP PS-01 | `SQUASH BEETLES!` | tap fast | Squash two bugs. | build-first #7; 80/20, fix the few big causes |

**Mechanics used in Wave 1** (each topic uses three different ones): hold-and-release (GOAL!), flick (SLIDE!, SPLIT!), tap timing (SWING!, UNLEASH!, CURL UP!, TREAT!, CATCH UP!, RESOLVE!), swipe (PLUCK!, SMOTHER!, HIDE!), slider or dial (SHATTER!, FUZZ!, APPROACH!, CLEAR STALL!), rhythm tap (PUMP!, CYCLE!), drag-and-release (KNOCK DOWN!), tap toggle (SWITCH OFF!, HOLD TEMP!), mash (PEDAL!, TUG!, WASH HANDS!, ROLL DICE!), pinch/shape (FLOAT!), slide-to-position (LIFT!), hold steady (CONTROL!), tap repeat (FIRE ONE!), stir (STIR!), hold (MELT IT!, ROLL!), herd (HERD!), tilt/tip (FIZZ!), drag-to-target (BALANCE!, PUT IT OUT!, FEED!, EQUIP!, DILUTE!, IGNORE!, SAVE!, TRADE!), steer (STAY LOW!, GOBBLE!), tap fast (HUNT!), pull (INHALE!, STOP THE HOWL!, NEXT!), hold then swipe (DIVIDE!), sweep (SCREEN!), tap to place (PLANT!), drag-push (PLOUGH!), trace (TRACE!), pull-and-release (LAUNCH!), stack (SHAKE!), draw a line (BRACE!), rotate (STAND IT UP!), two-finger hold (UNLOCK!), connect (WIRE UP!), card sequence (HOP!), act-out stepping (LOOP!), fling (BREAK IT!), nudge (ROLL DOWN!), stop the dial (SET THE PRICE!), whack (PLUG!), tap then stop (STOP EATING!), tap with a limit (STAY ABOVE!), tap before acting (KNOCK FIRST!), encircle (WRAP THE SHOP!), swipe away (CATCH COPIES!), tap each (DROP A COIN!), pull a lever (CLEAR THE RATS!), drag to place (SPLIT THE VOTE!), swipe to split (BREAK IT UP!), drag tiles (TILE IT!), tap fast (SQUASH BEETLES!). That is about 45 distinct mechanics; the most reused are drag-to-target (8), tap timing (6) and mash (4), spread over different topics.

**Builders' shared kit implied by Wave 1** (build once, reuse): a release-into-physics body (GOAL!, SLIDE!, SWING!, KNOCK DOWN!, LAUNCH!, SPLIT!), a fill bar or tank (MELT IT!, STAY ABOVE!, WASH HANDS!, PEDAL!), a slider or dial with live feedback (SHATTER!, FUZZ!, APPROACH!, CLEAR STALL!), a rhythm cue (PUMP!, CYCLE!), a pie (DILUTE!), a circuit with glowing dots (CLOSE!, UNLOCK!, FUZZ!), a code panel with a glowing line (LOOP!, HOP!).

**Wave 1 command collisions.** No two Wave 1 games share a command, and the nine law_policy picks are unique across all six files. Each of these Wave 1 commands also appears in another file; the other row must be renamed when it is scheduled: SLIDE! (CS IV-06), SWING! (CB AN-07, EE EL-06), PLUCK! (CB OR-08, EE ME-22), PUMP! (CB APB-05, EE MSE-17), LIFT! (CB AN-05, EE MSE-12), TUG! (CB OC-04), SPLIT! (EE HES-30), STIR! (EE ME-41), BALANCE! (BUS AC-02, CS DS-04, EE HES-12, PHY AP1-13), FEED! (CS UH-15, EE ES-38), TREAT! (EE ES-17), TRACE! (BUS AC-40, CB HB-18, PHY AP2-08), BRACE! (PHY UP1-09), CLOSE! (BUS AC-14), UNLOCK! (CS IV-11), HOP! (PHY PHS-24), LOOP! (CB HB-08, PHY AP2-13), HIDE! (EE HE-12), WIRE UP! (PHY UP2-10), RESOLVE! (PHY UP3-06), ROLL DOWN! (PHY AP2-10), IGNORE! (BUS AC-34), ROLL! (CB HC-23, EE MSE-21, PHY AP1-28), PLUG! (EE CE-04).

**Topics with no Elementary row yet:** `atoms`, `fire`, `medicine`, `robots`, `ai`. For these the entry game is the one needing the least background (SPLIT!, SMOTHER!, WASH HANDS!, HOLD TEMP!, NEXT!). Curriculum authors could add one Elementary row to each.

