# Heurēka! build plan: which microgames to build first

Status: Wave 1 is final and ready to build. Waves 2 and 3 follow below. Written 2026-11-05 from all seven curriculum files (physics, chem_bio, earth_eng, cs, business, law_policy, hardware: 1,669 rows). Extra chem_bio courses may still arrive; they slot into Wave 3 by the same scoring. Change log: at 07:20 UTC the provisional law, policy and problems picks were replaced by law_policy rows; at 07:25 UTC the three `robots` Wave 1 picks moved from earth_eng signals rows (now Wave 2) to hardware rows, so a builder who already started SC-02, SC-04 or SC-01 can finish it as a Wave 2 game. `motion_slide` (PHY PMS-01 `SLIDE!`) is already built and counts as one of the motion games.

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
| robots | HW GE-01 | `BUILD A BOT!` | drag parts into a shell | Drag the three parts into the shell. | Elementary; HW build-first #1; eye, brain, wheel loop that later robot games reuse |
| robots | HW RO-14 | `E-STOP!` | slam (tap in time) | Slam the red button. | HW build-first #8; the hardware emergency stop |
| robots | HW EB-08 | `SPIN LIDAR!` | hold | Hold to spin the lidar. | HW build-first #7; lidar draws the room |
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

**Mechanics used in Wave 1** (each topic uses three different ones): hold-and-release (GOAL!), flick (SLIDE!, SPLIT!), tap timing (SWING!, UNLEASH!, CURL UP!, TREAT!, CATCH UP!, RESOLVE!), swipe (PLUCK!, SMOTHER!, HIDE!), slider or dial (SHATTER!, FUZZ!, CLEAR STALL!), rhythm tap (PUMP!, CYCLE!), drag-and-release (KNOCK DOWN!), tap toggle (SWITCH OFF!), mash (PEDAL!, TUG!, WASH HANDS!, ROLL DICE!), pinch/shape (FLOAT!), slide-to-position (LIFT!), hold steady (CONTROL!), tap repeat (FIRE ONE!), stir (STIR!), hold (MELT IT!, ROLL!), herd (HERD!), tilt/tip (FIZZ!), drag-to-target (BALANCE!, PUT IT OUT!, FEED!, EQUIP!, DILUTE!, IGNORE!, SAVE!, TRADE!), steer (STAY LOW!, GOBBLE!), tap fast (HUNT!), pull (INHALE!, NEXT!), hold then swipe (DIVIDE!), sweep (SCREEN!), tap to place (PLANT!), drag-push (PLOUGH!), trace (TRACE!), pull-and-release (LAUNCH!), stack (SHAKE!), draw a line (BRACE!), rotate (STAND IT UP!), two-finger hold (UNLOCK!), drag parts into a shell (BUILD A BOT!), slam (E-STOP!), hold to spin (SPIN LIDAR!), connect (WIRE UP!), card sequence (HOP!), act-out stepping (LOOP!), fling (BREAK IT!), nudge (ROLL DOWN!), stop the dial (SET THE PRICE!), whack (PLUG!), tap then stop (STOP EATING!), tap with a limit (STAY ABOVE!), tap before acting (KNOCK FIRST!), encircle (WRAP THE SHOP!), swipe away (CATCH COPIES!), tap each (DROP A COIN!), pull a lever (CLEAR THE RATS!), drag to place (SPLIT THE VOTE!), swipe to split (BREAK IT UP!), drag tiles (TILE IT!), tap fast (SQUASH BEETLES!). That is about 45 distinct mechanics; the most reused are drag-to-target (8), tap timing (6) and mash (4), spread over different topics.

**Builders' shared kit implied by Wave 1** (build once, reuse): a release-into-physics body (GOAL!, SLIDE!, SWING!, KNOCK DOWN!, LAUNCH!, SPLIT!), a fill bar or tank (MELT IT!, STAY ABOVE!, WASH HANDS!, PEDAL!), a slider or dial with live feedback (SHATTER!, FUZZ!, CLEAR STALL!), a small robot with eye, brain and wheels (BUILD A BOT!, E-STOP!, SPIN LIDAR!), a rhythm cue (PUMP!, CYCLE!), a pie (DILUTE!), a circuit with glowing dots (CLOSE!, UNLOCK!, FUZZ!), a code panel with a glowing line (LOOP!, HOP!).

**Wave 1 command collisions.** No two Wave 1 games share a command, and the nine law_policy and three hardware picks are unique across all seven files. Each of these Wave 1 commands also appears in another file; the other row must be renamed when it is scheduled: SLIDE! (CS IV-06), SWING! (CB AN-07, EE EL-06), PLUCK! (CB OR-08, EE ME-22), PUMP! (CB APB-05, EE MSE-17), LIFT! (CB AN-05, EE MSE-12), TUG! (CB OC-04), SPLIT! (EE HES-30), STIR! (EE ME-41), BALANCE! (BUS AC-02, CS DS-04, EE HES-12, PHY AP1-13), FEED! (CS UH-15, EE ES-38), TREAT! (EE ES-17), TRACE! (BUS AC-40, CB HB-18, PHY AP2-08), BRACE! (PHY UP1-09), CLOSE! (BUS AC-14), UNLOCK! (CS IV-11), HOP! (PHY PHS-24), LOOP! (CB HB-08, PHY AP2-13), HIDE! (EE HE-12), WIRE UP! (PHY UP2-10), RESOLVE! (PHY UP3-06), ROLL DOWN! (PHY AP2-10), IGNORE! (BUS AC-34), ROLL! (CB HC-23, EE MSE-21, PHY AP1-28), PLUG! (EE CE-04).

**Topics with no Elementary row yet:** `atoms`, `fire`, `medicine`, `ai`. For these the entry game is the one needing the least background (SPLIT!, SMOTHER!, WASH HANDS!, NEXT!). Curriculum authors could add one Elementary row to each.

## 3. Wave 2: 101 games (3 more per topic, plus extras for the career-heavy topics)

Heavier topics get more: `programs`, `apps`, `ai`, `money` and `startups` get 6 each; `medicine`, `build`, `circuits` and `robots` get 5 each; every other topic gets 3. No mechanic repeats within a topic inside this wave. Renamed commands are marked.

| Topic | Curriculum ID | Command | Mechanic | One-line action | Why chosen |
|---|---|---|---|---|---|
| motion | PHY PMS-07 | `THROW!` | swipe throw | Swipe to throw the ball sideways; throw again, faster each time. | build-first #4; orbits as falling around |
| motion | PHY AP1-06 | `CORNER!` | hold brake, then steer | Hold the brake to slow down before the curve, then steer round. | owner-requested cornering; safe driving |
| motion | PHY PHS-09 | `CRUMPLE!` | drag-to-target | Drag a part onto the car's front before it hits. | crumple zones; safety engineering |
| waves | PHY PE-09 | `BIG SHADOW!` | slide | Slide the puppet between the lamp and the wall. | Elementary; light travels straight, shadows |
| waves | PHY PMS-18 | `LOUDER!` | stretch the wave | Drag the wave taller (you hear it get louder). | build-first #5; amplitude is loudness |
| waves | PHY UP3-01 | `CUT GLARE!` | rotate | Turn the sunglasses. | polarised sunglasses |
| energy | PHY PMS-14 | `SKATE!` | drag-and-release | Drag the skater up the ramp to a starting height and let go. | skate-park energy, a classic |
| energy | PHY PP-20 | `INSULATE!` | drag-to-target | Drag insulation onto the house. | home insulation, a real money saver |
| energy | PHY PP-11 | `TILT!` | tilt | Tilt the panel to follow the sun. | solar panel angle |
| forces | PHY PE-05 | `FIND KEYS!` | sweep | Swipe the magnet over the sand. | Elementary; magnets pick iron |
| forces | PHY AP1-23 | `SEESAW!` | slide | Slide the light fox along the other side. | torque balance |
| forces | PHY AP1-39 | `PINCH!` | pinch | Pinch the nozzle narrower. | narrow nozzle speeds flow |
| atoms | PHY PHS-36 | `HALVE!` | tap step and stop | Tap to run one half-life at a time; stop when about a quarter are left. | build-first #10; half-life |
| atoms | PHY UP3-16 | `DOPE!` | drop to place | Drop a few phosphorus atoms into the grid. | doping makes chips work |
| atoms | CB HC-02 | `GIVE!` | drag-to-target | Drag sodium's outer electron into chlorine's gap. | ionic bond: an electron changes hands |
| matter | CB EL-12 | `POUR!` | tilt | Tilt each into a cup until every cup is full. | Elementary; liquids take the shape of the cup |
| matter | CB MC-05 | `RAFT!` | push under | Push something into the water for the duck to ride. | density decides what floats |
| matter | CB OC-08 | `SALT THE ROAD!` | sprinkle | Sprinkle the road until the ice melts. | salt lowers freezing point |
| reactions | CB HC-13 | `ASSEMBLE!` | tap to build | Make as many sandwiches (then water molecules) as you can. | build-first #7; limiting reactant |
| reactions | CB HC-25 | `LOWER!` | drag under | Drag the catalyst under the hill. | catalysts lower the hill |
| reactions | CB MT-09 | `COAT IT!` | paint | Paint every bit of the frame before the rain arrives. | coatings stop rust |
| fire | CB FP-04 | `FIREBREAK!` | trace | Rake a strip of bare earth across the meadow before the fire reaches it. | firebreaks |
| fire | CB FP-02 | `LID ON!` | slide cover | Slide the lid over the pan, then twist the knob off. | grease fire: lid, never water |
| fire | CB FP-06 | `MOUNT!` | drag to place | Stick the alarm somewhere in the hall before the smoke arrives. | smoke alarm placement |
| life | CB EL-09 | `PASS IT ON!` | drag along a chain | Drag the glowing dot from the sun down the chain to the fox. | Elementary; food chains pass energy |
| life | CB MB-07 | `POLLINATE!` | steer | Fly the bee from a flower on one tree to a flower on the other. | pollination |
| life | CB MB-12 | `FENCE!` | trace (drag a fence) | Drag a fence along the riverbank. | habitat protection |
| body | CB AN-12 | `BEAT!` | rhythm tap | Tap the heart in time with the beat cue. | the heartbeat |
| body | CB HB-12 | `STAY COOL!` | two-button tap | Tap sweat when it's hot and shiver when it's cold, to keep the needle in the band. | homeostasis: sweat and shiver |
| body | CB AN-05 | `FLEX!` (renamed from `LIFT!`) | pull | Pull the biceps until the acorn reaches the mouth. | muscles pull, never push |
| cells | CB APB-04 | `SLIP THROUGH!` | drag-to-target | Get each molecule into the cell. | what crosses a membrane |
| cells | CB HB-10 | `DUNK!` | dip and hold | Dunk the cell until it stays plump and healthy. | osmosis |
| cells | CB HB-21 | `READ!` | slide along | Slide the ribosome along, three letters at a step. | ribosome reads three letters at a step |
| medicine | CB MED-11 | `COMPRESS!` | rhythm press | Press in time with the cue, fast and steady. | CPR; life-saving |
| medicine | CB AN-16 | `REMEMBER!` | show then send | Show the poster to the immune cells, then send in the real germ. | build-first #8; vaccines |
| medicine | CB MED-01 | `DOSE!` | tap to a band | Give pills until the meter sits in the green band. | dosing window |
| medicine | CB MED-03 | `SET DRIP!` | dial | Adjust the drip speed until the level holds in the green band. | IV drip rate holds a level |
| medicine | CB MED-05 | `WASH OUT!` | hold | Pull the plug and hold until the water is pale. | clearance: a drug washes out |
| earth | EE ES-02 | `OVERFLOW!` | hold to melt | Melt the ice to make a glass overflow. | build-first #2; floating ice does not raise water |
| earth | EE HE-12 | `BURROW!` (renamed from `HIDE!`) | drag-to-target | Drag the small mammals into their burrows before it hits. | build-first #10; the asteroid and the mammals |
| earth | EE ES-27 | `SOAK IN!` | tap to swap | Swap paving tiles for grass and rain gardens. | permeable ground stops floods; city planning |
| space | EE EL-07 | `WAIT FOR IT!` | hold-and-release | Hold to let the nights pass; let go on the full Moon. | Elementary; Moon phases |
| space | EE AS-05 | `SLINGSHOT!` | aim | Aim the probe to pass just behind Jupiter. | gravity assist |
| space | EE MSE-19 | `BLOCK!` | drag-to-target | Drag the Moon between the Sun and Earth. | eclipses |
| build | EE ME-13 | `BEND BACK!` | mash | Mash to bend the paperclip back and forth. | fatigue: bending back and forth breaks metal |
| build | EE ME-25 | `LOAD LOW!` | stack | Stack the heavy crates low and in the middle. | load low and centred |
| build | EE ME-07 | `HOIST!` | thread | Thread the rope through more pulleys, then pull. | pulleys trade distance for force |
| build | EE ME-31 | `BUILD UP!` | paint thicker | Thicken the wall where the water pushes hardest. | dams are thicker at the bottom |
| circuits | EE EE-23 | `CHARGE!` | hold to fill | Hold to fill it to the line. | capacitors store charge |
| circuits | EE EE-21 | `LATCH!` | tap on the tick | Tap on each clock tick. | a flip-flop remembers a bit |
| circuits | EE EE-02 | `DIM!` | squeeze | Squeeze the wire until the bulb glows softly for a bedtime story. | resistance dims the bulb |
| robots | EE SC-02 | `HOLD TEMP!` | tap toggle | Tap the heater on when the room gets cold and off when it gets warm. | thermostat on/off control |
| robots | EE SC-04 | `STOP THE HOWL!` | pull back | Pull the microphone back until the squeal dies. | EE build-first #6; feedback loops |
| robots | EE SC-01 | `APPROACH!` | dial | Turn the gain until the robot stops right at the line. | gain tuning: stop at the line, do not crash |
| robots | HW RO-08 | `SPOT LANDMARK!` | tap when seen | Tap the poster when it comes into the robot's camera view. | HW build-first #6; drift and landmark correction |
| robots | HW RO-21 | `SHOW ME!` | drag through a motion | Drag the robot's hand through folding the towel. | HW build-first #10; robots learn from demonstrations |
| circuits | HW EB-01 | `BLINK!` | drag legs into holes | Drag the LED's legs into the pin hole and the ground hole. | HW build-first #2; hello world of hardware |
| circuits | HW EB-03 | `DIAL IN!` | turn a knob | Turn the knob until the seedling perks up. | a knob sets a value the board reads |
| build | HW MK-03 | `TILT IT!` | rotate | Rotate the model until no part hangs out further than a 45-degree slope (or flip it... | HW build-first #4; 3D-print overhangs |
| programs | CS EL-04 | `REPEAT!` | tap to add | Tap the ribbon to add dots, one per repeat, then tap go. | Elementary; repeating |
| programs | CS PR-19 | `CALL!` | push and pop | At each call, push a plate with a note of the line to come back to; act out the... | build-first #3; the call stack |
| programs | CS PR-15 | `TAG ALONG!` | tie a tag | Tie tag b to the same row of cups, then add the kite cup through b. | build-first #2; aliasing |
| programs | CS RD-03 | `STOP!` | drag a line in | Drag the line `i += 1` into the loop body. | the infinite loop |
| programs | CS RD-06 | `TRACE BACK!` | trace back | Swipe along the thread back to where it starts, and drop the "turn into a number"... | read an error back to its cause |
| programs | CS PR-24 | `WAIT!` | wait, then act | Do nothing until the bird pecks; then run the handler and ring the bell. | events: do nothing until something happens |
| apps | CS SC-01 | `HIDE KEY!` | drag-to-box | Drag the key into a locked environment box and put its file on the ignore list before... | build-first #7; leaked API keys |
| apps | CS SC-04 | `CHECK BADGE!` | fit a gate | Fit the "is this order yours?" check on the server's door, then try order 42. | build-first #8; missing authorisation |
| apps | CS AP-06 | `CATCH!` | catch with a net | Catch the falling error envelope in the net before it hits the screen. | handle errors |
| apps | CS WB-08 | `ROUTE!` | tap a road | Tap a working road for each envelope as it arrives. | format example ROUTE!; packets |
| apps | CS SC-10 | `LENGTHEN!` | tap to add | Tap to add random words to your password while the fox reads. | long passphrases |
| apps | CS SP-01 | `BATCH!` | gather | Gather the fifty requests into one sack and send the bird once. | batching requests |
| ai | CS AI-01 | `CHOP!` | slice | Swipe the knife where the model's pieces split. | tokens |
| ai | CS AI-03 | `HEAT UP!` | dial | Turn the dial until the poem is fresh but still makes sense. | sampling temperature |
| ai | CS AI-20 | `ATTEND!` | pull strings | Pull the strings from "it" to the words it should look at. | attention |
| ai | CS BA-11 | `RETRIEVE!` | drag to shelf | Drag the question to the shelf; the closest pages fly out; drop them into the prompt. | retrieval (RAG) |
| ai | CS AI-33 | `DENOISE!` | hold to wipe | Hold to wipe away noise, one layer at a time. | diffusion image models |
| ai | CS BA-14 | `APPROVE!` | let through or pull | Let safe cards through, and pull risky ones into the "ask me first" tray. | human approval for agent actions |
| money | BUS PF-35 | `HOLD ON!` | hold through | Hold the safety bar through the dive. | build-first #5; do not sell in a crash |
| money | BUS PF-09 | `PLANT EARLY!` | mash | Mash to plant coins under your tree during the first ten years. | start saving early |
| money | BUS PF-31 | `SPREAD!` | drag to spread | Drag eggs into many baskets before a basket cracks. | diversify |
| money | BUS PF-01 | `BUDGET!` | swipe sort | Swipe the falling bills into the jars until each reaches its line. | budget jars |
| money | BUS PF-19 | `PAY IN FULL!` | deadline tap | Tap "pay in full" before the calendar reaches the gremlin. | pay the card in full |
| money | BUS PF-30 | `PLUG THE LEAK!` | tap to swap | Tap to plug the leak (switch to a low-fee fund). | fees eat returns |
| startups | BUS SV-35 | `PAY OUT!` | hold to pour | Hold to pour the sale money into the top bucket. | build-first #2; liquidation preference |
| startups | BUS SV-36 | `SWITCH!` | flip at the moment | Flip the investor's switch at the moment the slice bucket grows bigger than the... | build-first #3; convert or take preference |
| startups | BUS AC-29 | `FILL BUCKET!` | mash | Mash to make sales until the bucket overflows. | build-first #7; break-even |
| startups | BUS AC-03 | `COLLECT!` | tap to collect | Tap each envelope to collect it before the payroll tap empties the tank. | build-first #6; profitable but out of cash |
| startups | BUS SV-16 | `SPLIT FAIRLY!` | alternate flick | Flick the switch fast and evenly as visitors arrive, hats and all. | runner-up; randomised A/B tests |
| startups | BUS SV-12 | `PRICE IT!` | drag up a scale | Drag the price tag up the scale, keeping it below the gold. | pricing |
| markets | BUS MI-03 | `SPECIALIZE!` | drag-to-target | Drag each worker to the task where their ghost is smaller. | specialise by comparative advantage |
| markets | BUS MI-15 | `MAKE LOTS!` | mash | Mash to make cups. | economies of scale |
| markets | BUS MA-19 | `PRINT!` | crank | Crank the press. | printing money causes inflation |
| law | LP LW-01 | `ACCEPT!` | stamp in time | Stamp the card with your paw-print before it is pulled back. | build-first #2; a counteroffer kills the offer |
| law | LP LW-16 | `ADD YOUR TOUCH!` | drag in | Drag the human artist in to rearrange, repaint and add parts. | build-first #8; who owns AI-made work |
| law | LP LW-42 | `PROVE IT!` | stack until it tips | Stack evidence blocks until the scale tips past the mark for this case. | burden of proof |
| policy | LP GP-05 | `ADD A DEPOSIT!` | stamp each | Stamp a deposit coin onto each bottle as it is sold. | build-first #9; deposits change behaviour |
| policy | LP GP-14 | `PILOT IT!` | drop at random | Drop the program on a few towns picked by the spinning wheel. | randomised pilots before rollout |
| policy | LP GP-07 | `SET A STANDARD!` | lower a bar | Lower the bar to let only cleaner cars through. | standards |
| problems | LP PS-08 | `START AT ZERO!` | drag an axis | Drag the bottom of the axis down to zero. | build-first #10; honest charts start at zero |
| problems | LP PS-04 | `STOP POLISHING!` | hold, let go to ship | Hold to polish; let go to ship it. | good enough beats perfect |
| problems | LP PS-16 | `DIG DEEPER!` | tap to dig | Tap to dig down a layer at a time, then pull. | root cause, not symptom |

Wave 2 renames (the earlier-scheduled game keeps the verb): CB AN-05 `LIFT!` becomes `FLEX!` (PHY PE-22 `LIFT!` is in Wave 1); EE HE-12 `HIDE!` becomes `BURROW!` (CS EL-12 `HIDE!` is in Wave 1). Note that PHY PP-20 `INSULATE!`, CB HB-10 `DUNK!`, CB EL-12 `POUR!`, EE EE-23 `CHARGE!`, CS AP-06 `CATCH!`, CS PR-24 `WAIT!`, CS RD-03 `STOP!`, BUS PF-31 `SPREAD!`, BUS PF-35 `HOLD ON!` and BUS SV-36 `SWITCH!` keep their verbs; the same verbs in other files must be renamed if those rows are ever scheduled.

Borderline reading load in Wave 2, to watch in playtests: CS PR-15 `TAG ALONG!`, PR-19 `CALL!` and RD-03 `STOP!` show a short code line (the CS file's signature style); CS AI-20 `ATTEND!` shows a few words. Keep the on-screen code to one line and three words where possible.

## 4. Wave 3: the next 102, ranked

Ranked by the same score. The order interleaves the career-heavy topics first and then gives every topic at least two more. Within a topic, games can be built in any order; across topics, take them top to bottom. New chem_bio courses that are still being written slot in here.

| Rank | Topic | Curriculum ID | Command | Why |
|---|---|---|---|---|
| 1 | circuits | HW EB-11 | `DRIVE IT!` | HW build-first #3; motor drivers |
| 2 | build | HW MK-07 | `ORIENT!` | HW build-first #5; print orientation |
| 3 | robots | EE SC-12 | `STOP THE WHEEL!` | EE build-first #9; aliasing |
| 4 | build | HW SH-04 | `MASS PRODUCE!` | HW build-first #9; moulding for volume |
| 5 | circuits | EE EE-10 | `FUSE IT!` | fuses |
| 6 | robots | HW EB-24 | `JOIN THE BUS!` | I2C bus addresses |
| 7 | build | HW SH-09 | `FIX IT EARLY!` | late changes cost more |
| 8 | robots | PHY AP2-20 | `MOTOR!` | electric motors |
| 9 | robots | EE SC-15 | `FLICKER!` | PWM |
| 10 | build | EE ME-19 | `SUPPORT!` | support the middle |
| 11 | robots | EE SC-11 | `SAMPLE!` | sampling |
| 12 | robots | EE SC-08 | `STACK WAVES!` | signals are stacks of waves |
| 13 | money | BUS PF-22 | `FILL THE TOWER!` | build-first #9; the tax-bracket myth |
| 14 | markets | BUS MI-27 | `SHARE THE POND!` | tragedy of the commons |
| 15 | startups | BUS SV-31 | `RAISE ENOUGH!` | raise enough to reach the next milestone |
| 16 | ai | CS AI-10 | `SET BAR!` | classifier threshold |
| 17 | apps | CS VC-05 | `BISECT!` | bisect a bad commit |
| 18 | programs | CS ST-01 | `POP!` | the stack |
| 19 | medicine | CB MED-09 | `RETEST!` | a second test clears false positives |
| 20 | circuits | PHY AP2-12 | `SHORT!` | short circuits |
| 21 | robots | EE SC-07 | `SMOOTH OUT!` | smoothing noisy sensors |
| 22 | build | EE ME-26 | `SHOVE!` | friction: push until it slides |
| 23 | problems | LP PS-05 | `ANSWER ON TOP!` | answer first, then support |
| 24 | law | LP LW-19 | `DON'T MIX!` | do not mix business and personal money |
| 25 | policy | LP GP-32 | `MOVE THE VOTES!` | ranked-choice counting |
| 26 | ai | CS AI-13 | `CLUSTER!` | clustering |
| 27 | apps | CS SC-06 | `HASH!` | hash passwords |
| 28 | startups | BUS SV-23 | `CARVE!` | option pool |
| 29 | money | BUS PF-12 | `PARK IT!` | where to park emergency money |
| 30 | programs | CS PR-13 | `SKIP!` | short-circuit skip |
| 31 | medicine | CB FB-01 | `LOCK ON!` | antibodies lock on |
| 32 | circuits | EE EE-05 | `WIRE!` | parallel wiring |
| 33 | robots | EE SC-03 | `ADJUST!` | control with a delay: adjust, then wait |
| 34 | build | EE ME-12 | `PROP UP!` | columns |
| 35 | markets | BUS MI-08 | `CAP THE RENT!` | price ceilings |
| 36 | policy | BUS MI-26 | `CLEAN THE AIR!` | a pollution tax |
| 37 | law | LP LW-09 | `FILE FIRST!` | file the patent first |
| 38 | problems | LP PS-21 | `STRESS TEST!` | stress test the plan |
| 39 | ai | CS AI-27 | `THINK!` | more thinking time |
| 40 | apps | CS DM-15 | `BACK UP!` | backups |
| 41 | startups | BUS AC-37 | `WALK BACK!` | money later is worth less (walk back to today) |
| 42 | money | BUS PF-18 | `PAY IT OFF!` | pay down debt |
| 43 | programs | CS RD-08 | `NARROW!` | narrow a fault by halves |
| 44 | apps | CS PV-03 | `ERASE!` | erase user data everywhere |
| 45 | earth | EE MSE-09 | `BUILD HIGH!` | build above the flood line |
| 46 | space | EE AS-19 | `WARN!` | space weather |
| 47 | fire | CB FP-09 | `SWEEP UP!` | dust explosions |
| 48 | reactions | CB HC-30 | `TITRATE!` | titration |
| 49 | matter | CB EL-13 | `MELT!` | Elementary; melting and freezing |
| 50 | cells | CB APB-19 | `REPLICATE!` | DNA replication |
| 51 | body | CB AN-21 | `FILTER!` | kidneys filter |
| 52 | life | CB HB-05 | `REMOVE!` | invasive species |
| 53 | motion | PHY AP1-01 | `FIRE!` | horizontal and vertical motion are independent |
| 54 | waves | PHY AP2-26 | `FOCUS!` | focusing a lens |
| 55 | energy | EE ME-39 | `MOVE HEAT!` | heat pumps move heat |
| 56 | forces | PHY PE-06 | `PUSH AWAY!` | like poles push |
| 57 | atoms | PHY QP-09 | `TUNNEL!` | tunnelling |
| 58 | problems | CB LB-13 | `MAKE IT FAIR!` | a fair test changes one thing |
| 59 | problems | BUS BP-16 | `BREAK IT DOWN!` | Fermi estimate |
| 60 | programs | CS RD-14 | `RENAME!` | clear names |
| 61 | apps | CS SP-03 | `STASH!` | caching |
| 62 | ai | CS AI-09 | `HOLD OUT!` | hold-out data |
| 63 | ai | CS AI-39 | `REBALANCE!` | biased training data |
| 64 | ai | CS BA-19 | `DOWNSIZE!` | route to a smaller model |
| 65 | apps | CS SC-12 | `SPOT!` | read the real owner of a link |
| 66 | startups | BUS SV-03 | `KEEP THEM!` | retention |
| 67 | startups | BUS BP-05 | `MEET!` | negotiation: the zone of agreement |
| 68 | startups | BUS SV-26 | `FILE IN TIME!` | the 83(b) deadline |
| 69 | money | BUS PF-46 | `AUTOMATE!` | automate saving |
| 70 | money | BUS PF-44 | `CANCEL!` | cancel unused subscriptions |
| 71 | medicine | CB MED-06 | `REDOSE!` | redose at the trough |
| 72 | medicine | CB FB-04 | `FIX THE GENE!` | gene editing |
| 73 | circuits | EE EE-17 | `TUNE!` | impedance matching |
| 74 | build | EE EL-20 | `FOLD!` | Elementary; folding makes paper strong |
| 75 | programs | CS PR-22 | `OPEN!` | recursion as nested boxes |
| 76 | programs | CS ST-07 | `DESCEND!` | binary search tree |
| 77 | apps | CS AP-09 | `ENQUEUE!` | background jobs |
| 78 | apps | CS VC-10 | `FLIP!` | feature flags |
| 79 | ai | CS AI-24 | `RANK!` | preference ranking (RLHF) |
| 80 | ai | CS BA-04 | `PIN!` | pin the key fact in context |
| 81 | markets | BUS MI-20 | `BUY UP!` (renamed from `CORNER!`) | monopoly |
| 82 | law | LP LW-28 | `PULL BAD ONES!` | product recalls |
| 83 | law | LP LW-44 | `GET A WARRANT!` | warrants |
| 84 | policy | LP GP-34 | `DRAW DISTRICTS!` | district lines |
| 85 | policy | LP GP-09 | `FLIP DEFAULT!` | defaults |
| 86 | problems | LP PS-13 | `PARK THE TOPIC!` | park side topics |
| 87 | problems | BUS BP-17 | `WIGGLE!` | sensitivity |
| 88 | fire | CB FP-07 | `LIGHT THE WICK!` | what burns is the vapour |
| 89 | reactions | CB HC-29 | `NEUTRALIZE!` | neutralising |
| 90 | reactions | CB MT-04 | `RECHARGE!` | charging a battery |
| 91 | matter | CB APC-10 | `DISTILL!` | distillation |
| 92 | cells | CB APB-20 | `SPLICE!` | splicing |
| 93 | body | CB AN-08 | `FIRE NERVE!` (renamed from `FIRE!`) | nerve signals |
| 94 | life | CB MB-18 | `BREED!` | artificial selection |
| 95 | motion | PHY PHS-08 | `YANK!` | inertia: yank the tablecloth |
| 96 | energy | PHY PP-19 | `FIND LEAKS!` | find heat leaks |
| 97 | forces | PHY AP1-08 | `TIP RAMP!` | friction on a ramp |
| 98 | medicine | CB FB-08 | `JAM THE SWITCH!` | targeted drugs |
| 99 | startups | BUS SV-40 | `PLANT 20!` | power law in venture |
| 100 | money | BUS PF-29 | `OUTRUN!` | inflation erodes cash |
| 101 | apps | CS WB-06 | `ENCRYPT!` | encryption in transit |
| 102 | programs | CS ST-02 | `SERVE!` | queues |

Wave 3 renames: BUS MI-20 `CORNER!` becomes `BUY UP!` (PHY AP1-06 `CORNER!` is in Wave 2); CB AN-08 `FIRE!` becomes `FIRE NERVE!` (PHY AP1-01 `FIRE!` ranks higher).

### Rows to cut or merge

**Same idea in two or more files (keep the first, cut or merge the rest; a merged row can become the kept game's Level 2):**
- Reactor control rods: keep PHY PHS-38 `CONTROL!`; cut CB HC-34 `CHAIN!` and EE ES-12 `STEADY!`.
- Half-life: keep PHY PHS-36 `HALVE!`; merge PHY UP3-20 `DATE!` in as its Level 2 (dating a bone); cut CB HC-32 `WAIT!`, EE HES-31 `TICK!` and CB OC-15 `DATE!`.
- Fusion: keep PHY AP2-44 `FUSE!`; cut CB OC-16 `FUSE!` and EE AS-18 `FUSE!` (same verb three times).
- Photoelectric effect: keep PHY AP2-40 `KNOCK OUT!`; cut CB APC-12 `KNOCK OFF!`.
- Electron drops a level and glows: keep PHY AP2-41 `DROP DOWN!`; cut CB OC-03 `DROP DOWN!` (same verb) and EE AS-08 `DROP!`; PHY UP3-14 `BUMP UP!` becomes its Level 2.
- Spectral barcodes: keep PHY UP3-15 `IDENTIFY!`; merge EE AS-09 `SCAN!`.
- Entropy: keep CB APC-27 `HERD!` (Wave 1); cut PHY AP2-04 `SPREAD!`.
- Insulating a house: keep PHY PP-20 `INSULATE!` (Wave 2); cut EE ME-42 `INSULATE!`. CB AN-09 `INSULATE!` (nerves) is a different idea; rename it `WRAP NERVE!` if scheduled.
- Superconductor levitation: keep CB MT-01 `LEVITATE!`; cut PHY UP2-09 `FREEZE!`.
- Lightning rod: keep PHY PCE-03 `PROTECT!`; cut CB FP-12 `STRIKE!`.
- Mark and recapture: keep CB HB-02 `TAG!`; cut EE ES-31 `TAG!` (same verb).
- Nitrogen fixing: keep CB HB-04 `FIX!`; cut EE ES-40 `GRAB!`.
- Wildlife corridor: keep EE ES-06 `BRIDGE!`; cut CB OB-12 `BRIDGE!` (same verb).
- Commons: keep BUS MI-27 `SHARE THE POND!`; merge EE ES-25 `FISH!` and CB APB-28 `HARVEST!` as levels; cut EE ES-28 `HOLD BACK!`.
- Compound growth: keep BUS PF-07 `ROLL!` (Wave 1); cut BUS PF-06 `GROW!`; PF-08 `DOUBLE IT!` becomes a Level 2.
- Pulleys: keep EE ME-07 `HOIST!` (Wave 2); merge PHY PP-14 `THREAD!`; PHY PE-24 `HOIST!` stays as the Elementary version only if renamed (`RAISE IT UP!`).
- Bike gears: keep EE ME-06 `GEAR DOWN!`; cut PHY UP1-05 `SHIFT!`.
- Wrench torque: keep PHY AP1-22 `LOOSEN!`; cut EE ME-05 `LOOSEN!` (same verb).
- Fast air between two objects: keep PHY AP1-40 `BLOW!`; cut EE ME-33 `PUFF!`.
- Thumb over a hose: keep PHY AP1-39 `PINCH!` (Wave 2); cut EE ME-32 `SPRAY!`.
- Gap for heat expansion: keep EE ME-28 `MIND THE GAP!`; cut PHY UP2-01 `MIND THE GAP!` (same verb).
- Water pressure with depth: keep PHY AP1-36 `POKE!`; cut EE ME-30 `SQUIRT!`.
- Heat pump: keep EE ME-39 `MOVE HEAT!` (Wave 3); cut PHY UP2-06 `CHILL OUT!`.
- Satellite clocks and relativity: keep PHY UP3-09 `CORRECT!`; cut EE AS-25 `SYNC!`.
- Dark matter halo: keep PHY UP3-26 `SPIN GALAXY!`; cut EE AS-38 `HOLD TOGETHER!`.
- Expanding universe: keep PHY UP3-27 `EXPAND!`; cut EE AS-39 `INFLATE!` and EE HU-02 `BLOW UP!`.
- Orbit as falling around: keep PHY PMS-07 `THROW!` (Wave 2); cut PHY PHS-15 `FALL AROUND!`.
- Diode direction: keep HW EB-01 `BLINK!` (Wave 2; its fail is the backwards LED); cut EE EE-37 `TURN AROUND!` and PHY UP3-17 `ONE WAY!`.
- AC back and forth: keep EE EE-32 `WIGGLE!` only if renamed (`ALTERNATE!`), since BUS BP-17 `WIGGLE!` ranks higher; cut PHY UP2-12 `WIGGLE!`.
- Tuning a radio: keep EE EE-27 `TUNE IN!`; cut PHY PHS-31 `TUNE IN!` (same verb) and PHY PCE-13 `TUNE RADIO!`.
- Consent and data erasure: keep LP LW-33 `FAIR CHOICE!` and CS PV-03 `ERASE!`; cut CS PV-02 `ASK FIRST!` and LP LW-35 `FIND AND ERASE!`.
- Thermostat on/off: EE SC-02 `HOLD TEMP!` (robots) and CB HB-12 `STAY COOL!` (body) teach the same loop in two settings; keep both, but share one code base.

**Really a question, a sort, or answering (cut, or rewrite as a goal):**
- CB EL-05 `SENSE!` (tap the body part that should catch each clue).
- BUS AC-06 `SNIFF OUT!` (tap the bar that grows strangely) and AC-09 `FIX IT!` (tap the line whose number does not match): spot-the-odd-one and number reading.
- BUS PF-43 `SPOT THE SCAM!` (tap the three warning signs): reads like a quiz and needs text.
- Classification bins that read as a quiz: BUS PF-02 `PAY NEEDS!`, AC-22 `FILE!`, AC-28 `FIXED OR FLEX!`, MI-13 `PAIR UP!`; CS DM-01 `SHAPE IT!`, AP-02 `PLACE!`, AI-16 `LAYER!`; HW EB-05 `CHOOSE A BRAIN!`.
- EE EM-12 `SPOT IT!` (tap the impossible number): number reading.
- CS BA-06 `FACT-CHECK!`: needs reading claims and passages.

**Weak fits the authors flagged:** CB OR-14 `REPAIR!`, CS PV-12 `WEIGH UP!`, CS UH-16 `OUTWIT!`, CB MC-16 `UNRAVEL!` (partly). Defer all rows the authors marked [TRIMMED].

**Too hard to read in one second (defer; rework before building):**
- Multi-line "act it out" code rows: CS PR-07 `BOX IT!`, PR-08 `SWAP!`, PR-11 `GLUE!`, PR-21 `KEEP LOCAL!`, DM-08 `FILTER!`, UH-09 `POINT!`, and the whole coding-interview pilot CS IV-01 to IV-12 (it belongs in its own app).
- Diagram and graph rows: PHY PHS-03 `HANG!`, PHS-06 `GO HOME!`, AP2-29 `DRAW RAYS!`, PCM-01 `SLOPE!`, PCM-02 `PAINT!`; EE HES-02 `RING!`, APH-14 `BUILD LADDER!`; CB HB-27 `BRANCH!`, AN-01 `PAT LEFT!`, AN-02 `SLICE!`.

## 5. Balance

Games per topic per wave:

| Subject | Topic | Wave 1 | Wave 2 | Wave 3 | Total |
|---|---|---|---|---|---|
| Physics | motion | 3 | 3 | 2 | 8 |
| Physics | waves | 3 | 3 | 1 | 7 |
| Physics | energy | 3 | 3 | 2 | 8 |
| Physics | forces | 3 | 3 | 2 | 8 |
| Physics | atoms | 3 | 3 | 1 | 7 |
| Chemistry | matter | 3 | 3 | 2 | 8 |
| Chemistry | reactions | 3 | 3 | 3 | 9 |
| Chemistry | fire | 3 | 3 | 2 | 8 |
| Biology and medicine | life | 3 | 3 | 2 | 8 |
| Biology and medicine | body | 3 | 3 | 2 | 8 |
| Biology and medicine | cells | 3 | 3 | 2 | 8 |
| Biology and medicine | medicine | 3 | 5 | 5 | 13 |
| Earth and space | earth | 3 | 3 | 1 | 7 |
| Earth and space | space | 3 | 3 | 1 | 7 |
| Engineering and hardware | build | 3 | 5 | 7 | 15 |
| Engineering and hardware | circuits | 3 | 5 | 5 | 13 |
| Engineering and hardware | robots | 3 | 5 | 8 | 16 |
| Computer science | programs | 3 | 6 | 7 | 16 |
| Computer science | apps | 3 | 6 | 9 | 18 |
| Computer science | ai | 3 | 6 | 8 | 17 |
| Money and business | money | 3 | 6 | 6 | 15 |
| Money and business | startups | 3 | 6 | 7 | 16 |
| Money and business | markets | 3 | 3 | 3 | 9 |
| Law, government and consulting | law | 3 | 3 | 4 | 10 |
| Law, government and consulting | policy | 3 | 3 | 4 | 10 |
| Law, government and consulting | problems | 3 | 3 | 6 | 12 |
| **All** | 26 | 78 | 101 | 102 | 281 |

Games per subject:

| Subject | Topics | Wave 1 | Wave 2 | Wave 3 | Total | Share of all |
|---|---|---|---|---|---|---|
| Physics | 5 | 15 | 15 | 8 | 38 | 14% |
| Chemistry | 3 | 9 | 9 | 7 | 25 | 9% |
| Biology and medicine | 4 | 12 | 14 | 11 | 37 | 13% |
| Earth and space | 2 | 6 | 6 | 2 | 14 | 5% |
| Engineering and hardware | 3 | 9 | 15 | 20 | 44 | 16% |
| Computer science | 3 | 9 | 18 | 24 | 51 | 18% |
| Money and business | 3 | 9 | 15 | 16 | 40 | 14% |
| Law, government and consulting | 3 | 9 | 9 | 14 | 32 | 11% |
| **All** | 26 | 78 | 101 | 102 | 281 | 100% |

The career-heavy topics (programs, apps, ai, money, startups, medicine, build, circuits, robots) are 9 of 26 topics and hold 139 of 281 games. Rows drawn from each curriculum file across all three waves: BUS 43, CB 64, CS 51, EE 43, HW 13, LP 28, PHY 39.

## 6. Command uniqueness

Across all seven files, 234 commands are used by more than one file (563 rows in all; for example `POUR!`, `CATCH!`, `GROW!`, `ROLL!`, `SHIELD!`, `MATCH!`, `SPREAD!` and `BALANCE!` appear four or more times). The files only de-duplicated within themselves. Rule: the row in the earliest wave (or highest rank) keeps the verb; any other row gets a new verb when it is scheduled, and the curriculum file should be updated at the same time. Within Waves 1 to 3 all 281 commands are unique after these four renames:

| Row | Was | Now | Because |
|---|---|---|---|
| CB AN-05 | `LIFT!` | `FLEX!` | PHY PE-22 `LIFT!` is Wave 1 |
| EE HE-12 | `HIDE!` | `BURROW!` | CS EL-12 `HIDE!` is Wave 1 |
| BUS MI-20 | `CORNER!` | `BUY UP!` | PHY AP1-06 `CORNER!` is Wave 2 |
| CB AN-08 | `FIRE!` | `FIRE NERVE!` | PHY AP1-01 `FIRE!` ranks higher in Wave 3 |

Suggested names for kept duplicates listed in section 4: CB AN-09 `WRAP NERVE!`, PHY PE-24 `RAISE IT UP!`, EE EE-32 `ALTERNATE!`.
