# Heurēka! microgame map: physics

Compiled 2026-11-05. This file maps the units of physics courses, from an elementary course through introductory university physics, to proposed microgames for Heurēka!, the science, engineering and business companion to Q.E.D.!. It adds two courses that the standard sequence does not have: "Physics in practice" (sizes, estimating, measuring, energy use, everyday mechanics, electrical safety, heat loss in buildings) and "Quantum physics" (photons, energy levels, wave–particle duality, uncertainty, superposition and measurement, tunnelling, spin, entanglement and quantum computing). Chemistry and biology are mapped in CURRICULUM_chem_bio.md in this folder. Astronomy and the history of the universe belong to the Earth and space file, so this file leaves them out.

## How to read this file

- **What a Heurēka! microgame is** (the owner's final format, scratchpad file heureka_format.md). A 3 to 6 second WarioWare moment: one shouted verb, one action, and something happens on screen that makes a physics idea visible. There are no questions, no multiple choice, no numbers to compute and no formulas to rearrange. Every game is a goal that the command names ("KNOCK DOWN!", "FLOAT!", "FOCUS!"), and the player reaches it by acting on the world. The player learns by doing it, seeing it happen, failing in a funny way, doing it again faster, and reading the card afterwards, which says the idea in plain words.
- **Do a thing, watch it behave.** In physics the natural action is to push, spin, throw, release, tilt or pluck something and then watch the objects move by real simulated physics, often on frictionless ice, so the idea is seen in the motion itself.
- **The thing itself.** The main thing on screen is the physical thing: a cart, a spring, a force drawn as an arrow on an object, charge as dots flowing in a wire, light as rays, a sound as a wave you can stretch and hear, a nucleus as a cluster of balls. The first frame shows the goal and the tools (the tower, the ramp, the balls), so no text prompt is needed, and no game needs more than three words of reading during play.
- **Sound you can hear.** Sound and resonance games use the game's synthesizer (src/audio.js): as the player drags a wave taller, wider or closer together, the sound changes loudness and pitch at the same moment.
- **Unit names** come from each course's own published unit list. The "Source:" line under each course says where each name was checked and which names are reconstructed. Khan Academy's (KA) course pages are rendered by JavaScript and returned only a "Client Challenge" page to the fetch tools, so KA unit titles were confirmed from KA's blog, from URL slugs and page titles in search results, and from KA video descriptions that link to unit pages. The College Board unit lists were fetched from the AP Central course pages. The OpenStax chapter lists were read from the table of contents embedded in OpenStax's own book pages. The NGSS performance expectations were fetched from nextgenscience.org. All sources are listed at the end.
- **One row is one microgame.** Columns:
  - **ID**: a stable reference. PE = Elementary, PMS = middle school physics, PP = Physics in practice, PHS = high school physics, AP1 = AP Physics 1, AP2 = AP Physics 2, PCM = AP Physics C: Mechanics, PCE = AP Physics C: Electricity and Magnetism, UP1 and UP2 = OpenStax University Physics volumes 1 and 2, QP = Quantum physics, UP3 = OpenStax University Physics volume 3.
  - **Command**: a verb the player does, one or two words, in capitals, ending in "!" (STICK! POUR! FOCUS!), 15 characters or fewer.
  - **Concept**: the one plain sentence the player comes to see. The card after the game says it.
  - **Scene**: what is on screen in the first frame.
  - **Action**: the one thing the player does (tap, mash, hold, swipe, drag, aim, tilt, trace, or stop at the right moment).
  - **What happens**: the success, with the concept made visible.
  - **Funny fail**: a vivid, funny failure that also shows the concept.
  - **Level 2**: the same action made harder, or one new twist; never a calculation.
  - **Host**: the animal that acts it out, from the cast (frog, ant, penguin, duck, turtle, octopus, owl, fox, rabbit, beaver, hedgehog, bird).
- **Why it matters**: each unit opens with a one-line note saying where the idea is used in real work or real projects. Following the owner's fourth update, games inside a unit are ordered by that use, the most useful first.
- **[TRIMMED]** marks topics that are mostly exam material with little use outside school. They keep one short game so that the course is still covered, but they are left out of the first build stages.
- **"See X"** means the idea already has a game earlier in this file. A row whose ID cell is "—" is a cross-reference only and is not counted.
- **Course order.** Elementary comes first. Physics in practice comes right after middle school physics, because people who build things use sizes, estimates, measurement and energy budgets every day. Quantum physics comes after University Physics volume 2 and before volume 3, so that volume 3's modern-physics chapters can point back to it.
- **Calculations** that go with these ideas (unit conversion, solving equations, derivatives and integrals) belong to the math app, Q.E.D.!; see /home/claude/qed-game/docs/CURRICULUM.md. This file does not repeat them.

## Coverage summary

| Course | Units mapped | New games | Unit-list source |
|---|---|---|---|
| Elementary | 9 | 26 | NGSS elementary physical-science expectations (fetched), plus simple machines and floating |
| Middle school physics | 4 | 24 | KA blog, 2025-08-18 (4 unit titles); NGSS MS-PS2, MS-PS3, MS-PS4 (fetched) |
| Physics in practice | 7 | 20 | Not a published course; chosen for real-world use |
| High school physics | 8 | 39 | KA unit slugs and numbers from search results and links; full title list from a third-party guide |
| AP Physics 1 | 8 | 41 | College Board AP Central (fetched) |
| AP Physics 2 | 7 | 44 | College Board AP Central (fetched) |
| AP Physics C: Mechanics | 7 | 13 | College Board AP Central (fetched) |
| AP Physics C: Electricity and Magnetism | 6 | 14 | College Board AP Central (fetched) |
| University Physics volume 1 | 17 chapters | 14 | OpenStax table of contents (fetched) |
| University Physics volume 2 | 16 chapters | 13 | OpenStax table of contents (fetched) |
| Quantum physics | 8 | 15 | Not a published course; the owner's topic list, matched to University Physics volume 3, chapters 6 to 9 |
| University Physics volume 3 | 11 chapters | 27 | OpenStax table of contents (fetched) |
| **Total** | **108 units and chapters** | **290** | |

Every unit and chapter has at least one game or a "See X" cross-reference to an earlier game that teaches its core idea. The tables also hold 38 cross-reference rows (ID "—"), which are not counted. One game is marked [TRIMMED] (UP1-10 DROP IN!), so it waits for a later build stage.

---

## Elementary (NGSS elementary physical science, K-PS2 to 5-PS2, plus simple machines and floating)

Source: the NGSS elementary performance expectations, fetched from nextgenscience.org: K-PS2 (pushes and pulls), K-PS3 (sunlight warms the ground), 1-PS4 (sound and light), 3-PS2 (balanced forces, patterns of motion, magnets), 4-PS3 (energy), 4-PS4 (waves, seeing by reflected light, sending patterns), 5-PS2 (gravity pulls down). Heating and melting come from 2-PS1-4 (reversible changes). Simple machines and sinking and floating are not NGSS physical-science expectations; they are added because the owner asked for them and because they are the everyday physics of tools, boats and play. On-screen words in this course are short and common.

### Unit 1: Pushes and pulls (K-PS2-1, K-PS2-2, 3-PS2-1, 3-PS2-2)

Why it matters: aiming, steering and stopping things safely start with knowing that a harder push makes a bigger change and a push from the side changes direction.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PE-01 | `GOAL!` | A harder push makes a ball go faster and farther. | A ball in front of a little goal far across the grass. | Hold to wind up the paddle; let go. | The ball rolls as far as the push was hard and trickles into the net. | A tiny tap: the ball stops halfway and a snail overtakes it. | A pond behind the goal, so too hard a push splashes in | Hedgehog |
| PE-02 | `STEER!` | A push from the side changes which way a thing moves. | A ball rolling past a hole in the ground. | Swipe sideways at the ball as it passes. | The ball curves and drops into the hole with a plop. | Swiping from behind: the ball zooms straight past the hole into a flowerpot. | Two holes in a row | Frog |
| PE-03 | `HOLD STILL!` | Equal pulls on both sides keep a thing still. | Tug of war over a toy box; the left team is bigger and the box creeps left. | Drag friends onto the right side of the rope. | When both sides pull the same, the box stops and both teams wobble in place. | Too many friends: the box slides right and the left team tumbles into the mud. | Big and small friends pull different amounts | Penguins |
| PE-04 | `CATCH!` | A swing repeats the same path, so you can tell where it will be. | A rabbit on a swing tosses an apple at the end of each swing. | Tap to hold out the basket at the end of the swing. | The apple drops into the basket every time the swing reaches its end. | Holding the basket out in the middle: the apple bonks the rabbit's head. | A faster swing | Rabbit |

### Unit 2: Magnets (3-PS2-3, 3-PS2-4)

Why it matters: magnets hold fridge doors, point compasses north and spin every electric motor.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PE-05 | `FIND KEYS!` | Magnets pull things made of iron, not wood or plastic. | A sandbox hides keys, nails, a toy duck, a wooden block and a plastic cup. | Swipe the magnet over the sand. | Keys and nails jump up and click onto the magnet; the duck and the block stay buried. | Swiping over the duck: it bonks off the magnet and squeaks. | Coins: only some kinds stick | Fox |
| PE-06 | `PUSH AWAY!` | Matching magnet ends push each other away. | A toy train with a magnet on its back. | Turn the hand magnet so the same colours face, then bring it close. | The train rolls away without being touched. | Turning it the other way: the train rolls toward the hand and sticks with a clack. | Ends with no colours: test first | Duck |
| PE-07 | `FIND NORTH!` | A compass needle is a magnet that points north. | A boat lost in fog; an island is to the north. | Turn the boat until its nose lines up with the compass needle; then it sails. | The boat sails out of the fog to the island. | Following a seagull instead: the boat sails in a circle back into the fog. | A magnet on deck pulls the needle the wrong way | Bird |

### Unit 3: Light and seeing (1-PS4-2, 1-PS4-3, 4-PS4-2)

Why it matters: lamps, windows, mirrors and cameras all depend on light reaching our eyes, passing through some things and being blocked by others.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PE-08 | `SHINE!` | We see a thing only when light bounces off it into our eyes. | A dark cave. A frog with a torch is looking for its owl friend. | Drag the torch beam around the cave. | When the beam lands on the owl, light bounces from the owl to the frog's eyes (a dotted path) and the frog waves. | Shining the torch into the frog's own eyes: it is dazzled and still cannot see the owl. | Two friends hiding | Frog |
| PE-09 | `BIG SHADOW!` | A shadow is where light is blocked; closer to the lamp, the shadow grows. | A shadow puppet, a lamp and a door the shadow must cover. | Slide the puppet between the lamp and the wall. | Closer to the lamp, the shadow grows until it covers the door. | Sliding it to the wall: the shadow shrinks to a tiny rabbit. | A shadow that must fit a small window | Rabbit |
| PE-10 | `BLOCK SUN!` | Glass lets light through; wood and card block it. | A sunbeam falls on a sleeping owl. A glass pane, a piece of card and a wax-paper sheet lie nearby. | Drag something into the sunbeam to shade the owl. | The card blocks the beam and the owl sleeps on. | Holding up the glass: the beam shines straight through and the owl squints awake. | Wax paper lets some light through: a dim glow | Owl |
| PE-11 | `SEE CAKE!` | A mirror bounces light at the same angle it arrives. | A turtle behind a wall cannot see a cake. | Turn the mirror. | Light from the cake bounces off the mirror into the turtle's eye, and the turtle grins. | Pointing the mirror at the turtle: the turtle sees its own face. | Two mirrors | Turtle |

### Unit 4: Sound (1-PS4-1, 1-PS4-4, 4-PS4-3)

Why it matters: speakers, phones, instruments and alarms all make sound by shaking something, and people send messages with patterns of sound and light.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PE-12 | `PLUCK!` | Sound is shaking; a shaking thing can make other things shake. | A rubber band beside a drum with rice on top. | Swipe to pluck the band. | The band blurs as it shakes, a twang plays, and the rice on the drum hops. | Pressing the band flat: no sound and the rice sits still. | Make the rice hop into a bowl | Bird |
| PE-13 | `SING ALONG!` | A shorter string makes a higher note. | A bird sings a note. A string can play it. | Slide your finger along the string; hear the note change. | When the string's note matches the bird's, the two notes blend and the bird sings along. | Sliding the wrong way: the note grumbles down low and the bird covers its ears. | Two notes in a row | Bird |
| PE-14 | `FLASH!` | A pattern of flashes can carry a message. | A lighthouse far away; a boat with a lamp. | Tap long and short flashes to copy the pattern shown. | The lighthouse flashes the pattern back and its light turns green. | Wrong rhythm: the lighthouse blinks a puzzled pattern. | A longer message | Owl |

### Unit 5: Energy (4-PS3-1 to 4-PS3-4)

Why it matters: faster things carry more energy, which is why speed matters in crashes and sport, and wires carry the energy that lights and warms homes.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PE-15 | `KNOCK DOWN!` | Heavier or faster things hit harder. | A tower of blocks at the bottom of a ramp; a ping-pong ball and a bowling ball at the top. | Drag a ball onto the ramp and let it go; try again if the tower stands. | The bowling ball, or any ball let go from high up, scatters the tower. | The ping-pong ball bounces off the tower with a "tik". | A taller tower | Hedgehog |
| PE-16 | `CLOSE!` | Electricity flows only around a complete loop. | A battery, a bulb and a wire with a gap. A hedgehog is trying to read in the dark. | Drag the loose wire end onto the bulb. | Glowing dots race around the loop and the bulb lights up; the hedgehog turns the page. | Dropping it on the plastic handle: the dots stop at the gap and the room stays dark. | A switch in the loop to flip too | Hedgehog |
| PE-17 | `CLACK!` | A bump can pass energy through a row of things. | A row of marbles touching; one marble at the top of a slope. | Let the marble go down the slope. | It clacks into the row; the row stays still and only the last marble rolls away into the cup. | Letting it go from too low: a gentle clack and the last marble stops short of the cup. | A cup farther away | Frog |

### Unit 6: Sun and heat (K-PS3-1, K-PS3-2, 2-PS1-4)

Why it matters: shade, clothing colour and insulation keep people cool or warm, and heating or cooling changes materials, sometimes for good.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PE-18 | `SHADE!` | Shade blocks sunlight and keeps the ground cooler. | Hot sun on a beach; a turtle's eggs in the sand. | Drag the umbrella over the eggs. | Sunbeams stop at the umbrella; the sand under it stays a cool colour while the rest turns orange. | Putting the umbrella beside the eggs: the beams still reach them and the eggs sweat. | The sun moves, so the umbrella must follow | Turtle |
| PE-19 | `REFREEZE!` | Some changes from heating can be undone; some cannot. | An ice lolly melting in the sun, and a freezer. | Drag the puddle back into the freezer before the penguin cries. | The puddle freezes into a lolly again. | Trying it with a fried egg: it stays fried, now cold. | Chocolate that melts and sets again | Penguin |
| PE-20 | `WARM UP!` | Dark things soak up sunlight and get warmer than light things. | A shivering penguin, a dark scarf and a white scarf, and a patch of sun. | Drag a scarf onto the penguin in the sun. | The dark scarf warms up (its colour glows) and the penguin stops shivering. | The white scarf: sunlight bounces off it and the penguin keeps shivering. | A cloud drifts over | Penguin |

### Unit 7: Gravity (5-PS2-1)

Why it matters: gravity pulls everything toward the middle of the Earth, wherever you stand on the planet.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PE-21 | `DROP!` | Gravity pulls things toward the middle of the Earth, everywhere on it. | A round Earth with animals standing all around it; a basket sits at each animal's feet. | Tap each animal to drop its apple. | Every apple falls toward the middle of the Earth and lands in the basket at that animal's feet, even for the fox at the bottom. | Holding the basket over the fox's head (as if apples fall "down the screen"): the apple drops past its feet instead. | Animals at the sides | Fox |

### Unit 8: Simple machines

Why it matters: levers, ramps and pulleys let people lift and move heavy things by hand, from crowbars to wheelchair ramps to cranes.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PE-22 | `LIFT!` | A lever lifts more when the pivot is close to the load. | A little frog, a big rock, a plank and a log under the plank. | Slide the log toward the rock, then the frog hops on the other end. | The plank tips and the rock lifts. | Sliding the log toward the frog: the frog is flung into the air and the rock stays put. | A heavier rock | Frog |
| PE-23 | `ROLL UP!` | A long, gentle ramp makes lifting easier. | A barrel and a truck; a short steep plank and a long gentle plank. | Drag a plank to the truck, then push the barrel up it. | On the long plank the beaver rolls the barrel up easily. | On the steep plank the barrel rolls back and flattens the beaver like a pancake (it pops back up). | A higher truck | Beaver |
| PE-24 | `HOIST!` | A pulley wheel lets you lift by pulling down. | A bird needs a basket of fish in its tree house. | Drag the rope over the wheel, then pull down. | Pulling down lifts the basket up to the tree house. | Pulling without the wheel: the bird flaps upward holding the heavy basket and wobbles. | A second wheel: pull twice as far, half as hard | Bird |

### Unit 9: Sinking and floating

Why it matters: boats, life jackets and submarines work because shape and weight decide whether water can hold a thing up.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PE-25 | `FLOAT!` | A boat shape floats when a ball of the same clay sinks. | A lump of clay by a bath; a penguin needs a boat. | Pinch the clay out into a bowl shape, then let it go on the water. | The bowl sits low but floats; the water in the bath rises a little. | Dropping the lump as a ball: plop, straight to the bottom. | Load pebbles until just before it sinks | Penguin |
| PE-26 | `RESCUE!` | Some things float and some sink. | Toys fall into a pond. | Tap the toys that are sinking to scoop them out before they reach the bottom. | The key and the coin are saved; the cork and the leaf bob safely on top. | Scooping the cork while the key sinks: a bubble rises from the bottom with a sad "bloop". | A big log (floats) and a small pebble (sinks) | Duck |

## Middle school physics (KA: "Middle school physics", /science/ms-physics; NGSS MS-PS2, MS-PS3, MS-PS4)

Source: KA blog "Fresh Updates to Khan Academy's Physics Courses Bring More Rigor and Flexibility" (2025-08-18, fetched) lists the four units of the redesigned NGSS-aligned course: Motion and Forces, Non-Contact Interactions, Energy, Waves. The unit slug "ms-physics/…:energy" (page "Energy: Unit test") was seen in search results; the other three titles are verified from the blog only. The NGSS performance expectations MS-PS2-1 to 2-5, MS-PS3-1 to 3-5 and MS-PS4-1 to 4-3 were fetched from nextgenscience.org, and every one is mapped below.

### Unit 1: Motion and Forces (MS-PS2-1, MS-PS2-2)

Why it matters: "a moving thing keeps moving until a force changes it" and "the bigger total push wins" are the base of driving, sport, machines and every later physics topic.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PMS-01 | `SLIDE!` | A moving thing keeps going in a straight line until something pushes or rubs on it. | A long ice rink with a net at the far end; a patch of sand covers part of the rink. | Flick the puck. | On the ice the puck glides on and on, perfectly straight, into the net. | Flicking it across the sand: it stops dead after a short scrape and a crab peeks out at it. | Bank the puck off a wall to get round the sand | Penguin |
| PMS-02 | `RACE!` | Speed is how far you go in each second. | A race track; a stopwatch drops a flag where each runner is at every tick. A turtle is racing too. | Mash to run. | The faster you mash, the farther apart your flags land; your flags spread out past the turtle's evenly spaced ones and you win. | Mashing in bursts: your flags bunch up, then spread, and the steady turtle wins by a nose. | Keep a steady pace: flags must be evenly spaced | Rabbit |
| PMS-03 | `TUG!` | A thing moves the way of the bigger total pull. | Tug of war on a sled across ice; the fox pulls with a long arrow. | Mash to pull; your arrow grows with every tap. | When your arrow outgrows the fox's, the leftover arrow points your way and the sled slides to your side. | Stopping to rest: the fox's arrow wins and you skid face-first across the ice. | Two foxes | Rabbit |
| PMS-04 | `PUSH OFF!` | When you push something, it pushes back on you just as hard. | Two skaters stand still in the middle of the ice: a big penguin and a little one. | Swipe to make the small penguin push the big one. | Both slide apart in opposite directions; the small penguin zooms off fast, the big one drifts slowly. Equal arrows appear on both. | Pushing toward the wall the small penguin wants to reach: it slides away from it instead. | A cannon on ice firing a ball | Penguins |
| PMS-05 | `SHOVE!` | The same push speeds up a heavy thing less than a light one. | Two carts on ice, one empty and one loaded with boxes; a finish line and a bell. | Hold to push the loaded cart; release when it reaches the line. | The loaded cart speeds up slowly; you must hold longer than for the empty cart beside it, which shoots ahead from a short push. | Pushing for the same short time as the empty cart: the loaded cart creeps and stops short of the line. | Add penguins to push harder | Penguin |
| PMS-06 | `BUMP!` | In a bump, both things are pushed equally, and the lighter one's motion changes more. | A small puck, a big puck and a goal behind the big puck. | Flick the small puck into the big one. Then flick the big one into the small one. | The small puck bounces back and the big one barely moves; the big puck shoves the small one straight into the goal. | Flicking the small puck harder and harder: it keeps bouncing back like a ping-pong ball off a fridge. | Two big pucks in a row | Penguin |

### Unit 2: Non-Contact Interactions (MS-PS2-3, MS-PS2-4, MS-PS2-5)

Why it matters: motors, speakers, compasses, satellites and the safe handling of electronics all depend on forces that act at a distance.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PMS-07 | `THROW!` | Throw something fast enough sideways and it falls all the way around a planet: that is an orbit. | A tiny planet with a frog on a mountain top holding a ball. | Swipe to throw the ball sideways; throw again, faster each time. | Slow throws land nearby, faster ones land farther round; the right speed makes the ball fall all the way round and hit the frog on the back of the head. | Throwing straight up: the ball falls straight back down on the frog. | Too fast escapes into space; find the band in between | Frog |
| PMS-08 | `DOCK!` | Opposite ends of magnets pull together; matching ends push apart. | A toy boat with a magnet on its bow drifts away from the dock. | Turn the dock's magnet and slide it out to meet the boat. | Opposite ends face, field lines join them, and the boat glides in and clicks to the dock. | Matching ends: the boat is shoved away and spins round. | The labels are hidden; test one end first | Duck |
| PMS-09 | `WIND!` | More turns of wire make an electromagnet stronger. | A nail wrapped in wire, joined to a battery, over a bucket of paper clips. | Tap to wind more turns, then lower it onto the clips. | Field lines around the nail thicken with each turn, and the magnet lifts a longer and longer chain of clips until the bucket comes up too. | Winding the wire round a plastic straw instead: almost nothing sticks. | Add a second battery as well | Ant |
| PMS-10 | `RUB!` | Rubbing can move charge from one thing to another, and charged things pull on paper and hair. | A balloon, a rabbit's fur and a pile of paper bits. | Rub the balloon back and forth on the fur, then hold it over the paper. | Minus signs hop onto the balloon with each rub and the fur stands up; the paper bits leap up and stick. | Holding the balloon over the paper before rubbing: nothing moves, and the rabbit yawns. | Lift a heavier paper snake | Rabbit |
| PMS-11 | `SPRINKLE!` | A magnet's invisible field can be seen with iron filings; it is strongest at the ends. | A table with a magnet hidden under it. | Swipe to sprinkle iron filings over the table. | The filings slide into curves that show the hidden magnet's shape, crowding at its two ends; then the table turns see-through. | Sprinkling one corner only: the filings lie flat and tell you nothing. | Two hidden magnets | Owl |
| PMS-12 | `CAPTURE!` | Bigger masses pull harder, and closer things pull much harder. | A rock drifts past in space. A planet sits far away. | Drag the planet closer to the rock's path. | When the planet is close enough, the rock's path bends and it falls in; a bigger planet catches it from farther away. | Dragging a tiny moon right up to it: the rock bends a little and drifts on. | Catch it into an orbit instead of a crash | Bird |

### Unit 3: Energy (MS-PS3-1 to MS-PS3-5)

Why it matters: energy is the budget behind food, fuel, electricity bills, batteries and machines, and twice the speed carries four times the energy, which is why speeding crashes do so much more damage.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PMS-13 | `WRECK!` | Faster things carry much more energy: twice the speed smashes about four times as much. | A wrecking ball on a crane beside a brick wall. | Pull the ball back and let go; the higher you pull it back, the faster it swings. | A big pull-back flattens the whole wall; the bricks fly. | A small pull-back: the ball taps the wall, one brick wobbles, and the crane driver sighs. | A thicker wall | Beaver |
| PMS-14 | `SKATE!` | Energy of height turns into speed and back: a skater rises about as high as she started. | A half-pipe skate park with a ledge on the far side. | Drag the skater up the ramp to a starting height and let go. | She rolls down, speeds up at the bottom and rises on the other side to just about her starting height, landing on the ledge if she started higher than it. | Starting below the ledge: she rises, stops just short, and slides back with a wobble. | A rough patch steals a little height each pass | Rabbit |
| PMS-15 | `MIX!` | Heat flows from hot to cold until both are the same temperature. | A bath for a duck: a cold tap and a hot kettle. | Pour from the kettle into the bath (hold). | Fast-jiggling hot particles mix with slow cold ones until the whole bath jiggles at one speed, and the thermometer settles in the green "just right" band. | Pouring too much: the duck leaps out with a red bottom. | A bigger bath needs more hot water | Duck |
| PMS-16 | `WRAP!` | Some materials slow heat flow (insulators); metal speeds it up. | A cup of hot cocoa, a long snowy walk, and a pile of wraps: wool, foam, foil-thin metal, a wet cloth. | Drag wraps onto the cup. | Heat arrows leaving the cup shrink with wool and foam; the cocoa is still steaming at the end. | Wrapping it in metal: the arrows grow and the cocoa freezes into a lolly. | Only two wraps allowed | Penguin |
| PMS-17 | `WIND UP!` | Energy stored in a spring turns into motion, sound and warmth. | A wind-up toy rabbit and a finish line. | Mash to wind the key, then let go. | The spring unwinds, the toy hops across, squeaks and warms; a bar of energy shrinks from "spring" into "motion" and "sound and warmth". | Winding it only a little: it hops twice and falls over asleep. | Over-winding: the spring goes "boing" and the key spins off | Rabbit |

### Unit 4: Waves (MS-PS4-1 to MS-PS4-3)

Why it matters: sound, light, wifi, ultrasound and fibre optics are all waves; a wave's height sets how loud or bright it is, and how close its crests are sets its pitch or colour.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PMS-18 | `LOUDER!` | A taller sound wave is a louder sound with the same pitch. | An owl asleep in a tree; a speaker shows its sound as a wave on a screen. | Drag the wave taller (you hear it get louder). | The speaker cone moves farther in and out, the sound gets louder at the same pitch, and the owl wakes with a hoot. | Dragging the wave sideways instead: the note slides lower but stays quiet, and the owl snores on. | Wake the owl without knocking the nest off: stop before the red line | Owl |
| PMS-19 | `HIGHER!` | Waves packed closer together make a higher pitch. | A bird sings a high note; your wave plays a low hum. | Squeeze the wave so its crests come closer together (you hear the pitch rise). | When your pitch matches, the bird sings back a duet. | Squeezing too far: a squeak so high that a dog howls in the distance. | A two-note tune | Bird |
| PMS-20 | `MATCH!` | Two notes that nearly match wobble (beats); when they match, the wobble disappears. | A target wave and your wave; together they make a wobbling "wah-wah" sound. | Stretch or squeeze your wave until it lines up with the target. | The wobble slows and disappears, and the two sounds merge into one steady note; the waves lock together. | Overshooting: the wobble speeds up again and a frog covers its ears. | The target note drifts slowly | Frog |
| PMS-21 | `SHATTER!` | Everything has its own natural note; matching it makes it shake more and more (resonance). | A wine glass on a table; an opera-singing owl. | Slide the owl's note up or down until the glass starts to hum. | At the glass's own note, it wobbles more and more with each wave until it shatters with a crash. | Singing a note that is close but not right: the glass trembles a little, then calms down, and the owl runs out of breath. | Thicker glasses have lower notes | Owl |
| PMS-22 | `WAKE!` | A mirror bounces light off at the same angle it arrives. | A sunbeam, a mirror on a pivot and a frog asleep in the shade. | Turn the mirror. | The bounced beam lands on the frog, who wakes up stretching. | Pointing the mirror straight at the frog: the beam skims off into a bush and a bird blinks. | Two mirrors | Frog |
| PMS-23 | `MELT!` | Dark materials soak up light and warm up; white and shiny ones bounce it away. | An ice block in the sun; a black cloth, a white cloth and a sheet of foil. | Drag a cloth over the ice. | The black cloth soaks up the sunbeams and warms; the ice melts into a puddle for the duck to splash in. | Foil: the beams bounce off and the ice sits there smugly. | The sun is setting | Duck |
| PMS-24 | `SEND!` | On/off pulses carry a message through noise better than a wavy signal does. | A noisy wire between two towers; your message wave turns fuzzy on the way. | Tap each time your wave is above the line to send it as on/off pulses. | The pulses arrive clean through the static and the far owl's lamp blinks the message. | Not tapping: the wavy message arrives as a hiss and the owl shrugs. | A faster message | Owl |

## Physics in practice: skills the standard courses skip

Source: not a published course. Chosen by the owner's fourth update ("estimation, energy budgets, everyday mechanics" for physics), and drawn from the parts of the courses below that engineers, technicians, builders and scientists use daily: sizes, prefixes and estimates (OpenStax University Physics volume 1, chapter 1), measurement and fair tests (lab practice in every AP Physics course), energy use and electrical safety (KA high school physics, "Energy" and "Electromagnetics"), heat loss (University Physics volume 2, chapter 1).

### Unit 1: Sizes and prefixes

Why it matters: datasheets, wiring diagrams and lab notebooks are full of kilo, milli and micro, and a slipped prefix (a dose, a resistor or a bolt torque off by a factor of 1,000) is an expensive mistake in real projects.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PP-01 | `ZOOM OUT!` | Each step up the size ladder is ten times bigger. | An atom fills the screen; somewhere far out, a whole Earth is waiting. | Pinch out, one ten-times step per pinch, until the Earth fits the frame. | A cell, an ant, a person, a mountain and the Earth swim into view in turn, each beside a scale bar. | Pinching too far: the Earth shrinks to a dot and the ant waves from somewhere off screen. | Zoom in instead, from a person to an atom | Ant |
| PP-02 | `UNPACK!` | Kilo means a thousand; milli means one thousandth. | Delivery boxes tagged "kilo", "1" and "milli" arrive at a bead shop; the order needs exactly one bead. | Open boxes until you hold exactly one bead. | "Kilo" bursts into a thousand beads; "milli" holds a sliver so small the ant needs a magnifier; "1" holds the bead. | Opening "kilo" in a hurry: an avalanche of beads buries the ant. | "Mega" and "micro" boxes arrive too | Ant |

### Unit 2: Estimating before calculating

Why it matters: engineers and scientists check results against a rough estimate first; the estimate catches wrong formulas, bad inputs and slipped decimal points before they cost money.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PP-03 | `FILL!` | Estimate a big number by counting a small part and repeating it. | A huge jar of jelly beans and a small cup. | Fill the cup from the jar once, then tap to stack copies of the cup's outline until they fill the jar's outline. | The cup outlines fill the jar, and the estimate appears beside the real count, close to it. | Guessing from the front of the jar: only the front layer is counted and the estimate comes out far too small. | A jar with a big empty hollow inside | Rabbit |

### Unit 3: Measuring and testing

Why it matters: every measurement in a lab, workshop or factory has some uncertainty, and a fair test changes only one thing at a time; together they decide whether a result can be trusted.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PP-04 | `LINE UP!` | A fair test changes only one thing at a time. | Two lanes for a toy-car race to test steep against gentle ramps; the lanes also differ in car size and floor. | Drag the mismatched things (the big car, the rough mat) until the lanes match except for the ramp. | Everything that differs glows orange; when only the ramp glows, the race runs and the judge owl stamps the result. | Racing with two differences: the judge throws the result in the bin. | Three differences to fix | Owl |
| PP-05 | `EYE LEVEL!` | Read a measuring scale straight on, at the bottom of the liquid's curve. | A measuring cylinder of water and an owl's eye looking down from above. | Drag the owl's eye down level with the water. | The curved surface (the meniscus) comes into view and the reading line sits on its bottom. | Reading from above: the line seems to sit higher and the potion recipe fizzes over. | A tilted cylinder to level first | Owl |
| PP-06 | `REPEAT!` | Measuring several times shows how sure you can be. | A wobbly jelly on a scale; the reading jumps around. | Tap to take a reading; take several. | Each reading drops a dot on a line; the dots spread into a band, and the middle of the band is the best value. | Taking just one reading at a jump: the band is a single dot that lands far from the middle. | A steadier scale gives a narrower band | Beaver |
| PP-07 | `FIT!` | A line through the middle of the data shows the trend, and a point far off it is suspicious. | Lab dots: the longer the pendulum, the slower it swings. One dot is far off. | Drag the ruler line through the cloud of dots. | The line snaps to the best fit and the stray dot flashes "measure again". | Pinning the line to the stray dot: every other dot sits off the line and the graph wobbles. | Two stray dots | Owl |

### Unit 4: Energy budgets

Why it matters: sizing batteries, solar panels, heaters and power supplies, and cutting running costs, start from knowing what uses a lot of energy and what uses a little.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PP-08 | `SWITCH OFF!` | Heaters and kettles gulp energy; LEDs and chargers only sip it. | A house at night with everything on; the electricity meter spins fast past a red line. | Tap appliances to switch them off until the meter slows below the line. | Each appliance pours energy from a tap: the heater and kettle gush, the LED drips. Switching off the gushers slows the meter. | Switching off every LED first: the meter barely changes and the cat still sits by the roaring heater. | Keep the fridge on | Penguin |
| PP-09 | `PEDAL!` | A person's steady power is about enough for one bright old-style bulb. | A bike connected to a generator, wired to a bulb and a kettle. | Mash to pedal and keep the bulb lit. | Steady pedalling keeps one bright bulb glowing. | Switching on the kettle: the fox pedals in a blur, the kettle stays cold and the bulb dims. | Two bulbs; pedal harder for a few seconds | Fox |
| PP-10 | `PACK!` | A bigger battery, or a dimmer lamp, lasts longer. | A tent at dusk; a torch, a small and a big battery, a bright and a dim bulb. | Drag a battery and a bulb into the torch so it lasts until sunrise. | The battery is drawn as a tank and the bulb as a tap; with the big tank or the small tap, the torch glows until the sun comes up. | Brightest bulb with the small battery: the torch dies at midnight and an owl hoots in the dark. | A cold night drains the tank faster | Fox |
| PP-11 | `TILT!` | A solar panel makes the most power when it faces the sun squarely and stays out of shade. | A rooftop panel, a sun moving across the sky and a tree. | Tilt the panel to follow the sun. | Sunbeams hit the panel squarely, the battery beside it fills, and a fan starts spinning. | Letting the tree's shadow fall across one corner: the whole panel's output drops sharply. | The shadow moves through the day | Bird |

### Unit 5: Everyday mechanics

Why it matters: stopping distances, levers, pulleys and safe lifting are the physics of driving, building, moving furniture and staying uninjured.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PP-12 | `BRAKE!` | At twice the speed, a car needs much more than twice the distance to stop. | A car on a road; a duck family will step out ahead. | Tap the brake when the ducks appear. | The road marks the distance while the driver reacts, then the skid, and the car stops before the ducks. Faster rounds make both marks grow, the skid most of all. | Driving fast and braking late: the car skids, the ducks scatter in a flurry of feathers, all safe but furious. | A wet road | Fox (driving) |
| PP-13 | `PRY!` | A lever lifts more when you push far from the pivot. | A heavy rock, a crowbar and a small stone as the pivot. | Slide your hands along the bar and push down. | Far from the pivot, a small push lifts the rock. | Pushing near the pivot: the beaver strains, turns red, and the rock does not budge. | Move the pivot too | Beaver |
| PP-14 | `THREAD!` | More rope strands holding a load means less pull, but more rope to pull. | A heavy piano, a block and tackle, and a beaver with a weak pull. | Drag the rope over more pulleys, then pull. | Each strand takes a share of the weight; with enough strands the piano rises, and a long pile of pulled rope builds up. | One pulley that only turns the rope's direction: the beaver is lifted off its feet instead. | A heavier load | Beaver |
| PP-15 | `LIFT CLOSE!` | A load held close to your body strains your back far less. | A heavy box on the floor and a rabbit ready to lift. | Drag the box against the rabbit's body before it stands up. | The strain bar on its back stays green and the rabbit stands up easily. | Lifting at arm's length: the strain bar shoots to red and the rabbit's ears flop. | A heavier box | Rabbit |

### Unit 6: Electricity at home and safety

Why it matters: overloaded circuits and missing earth wires cause house fires and shocks; electricians, makers and anyone plugging in a heater meet this daily.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PP-16 | `UNPLUG!` | Every appliance on a power strip adds to the current in the one cord to the wall. | A power strip with a kettle, a toaster and a heater; the wall cord glows warmer and warmer. | Unplug appliances until the cord stops glowing. | Ants marching in the cord thin out as each appliance comes out; the cord cools. | Leaving everything in: the fuse pops with a puff and the lights go out. | A lamp barely adds any ants | Ant |
| PP-17 | `EARTH!` | An earth wire carries a fault safely away so the metal case stays safe to touch. | A washing machine with a loose live wire touching its metal case; a duck is about to touch it. | Drag the green-and-yellow earth wire from the wall to the case. | The fault current rushes into the earth wire, the breaker clicks off and the duck touches a safe case. | Clipping it to the plastic lid: the sparks keep fizzing and the duck backs away. | The wire must go to the one bare metal screw | Duck |
| PP-18 | `PERCH!` | Birds on one wire are safe; touching two wires lets current flow through them. | Power lines; a bird coming in to land. | Tap to land the bird where it touches only one wire. | It perches happily. | Landing with one foot on each wire: a spark puffs its feathers into a fluffball. | Wind sways the wires closer | Bird |

### Unit 7: Heat loss in buildings

Why it matters: sizing a heater or air conditioner and deciding where insulation pays off are everyday jobs for builders and energy auditors.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PP-19 | `FIND LEAKS!` | A heat camera shows where a house loses heat. | A house on a cold night, and a heat camera. | Swipe the camera over the house. | The roof and windows glow brightest where heat streams out. | Swiping at the sky: the camera shows a cold blue nothing and a confused owl. | Find a leak under a door | Penguin |
| PP-20 | `INSULATE!` | Insulating the biggest leak first saves the most heat. | A cold house with heat arrows leaking out of the roof, windows, walls and floor, and three rolls of insulation. | Drag insulation onto the house. | The roof's big arrows shrink most, and the heater beside the house shrinks to match. | Insulating the small floor first: the rolls run out and the heater stays huge. | Double-glazing costs two rolls | Penguin |

## High school physics (KA: "High school physics", /science/highschool-physics; NGSS HS-PS2, HS-PS3, HS-PS4)

Source: KA's current NGSS-aligned course (launched 2024-08-08, KA blog "Introducing Khan Academy's NGSS-Aligned High School Biology and Physics Courses"). Unit order and titles: a 2026 third-party course guide lists the nine units (Motion and forces; Force pairs and momentum; Gravitation; Electrostatics; Energy; Electromagnetics; Electromagnetic radiation; Nuclear physics; Teacher resources). Verified on khanacademy.org links: the unit slugs "motion-and-forces", "force-pairs-and-momentum", "gravitation", "electrostatics", "energy", "electromagnetic-radiation" and "nuclear-physics" (from KA video descriptions and search results), and the numbers "Unit 4: Electrostatics", "Unit 5: Energy" and "Unit 8: Nuclear physics" (a Schoolhouse study series that links each unit). "Electromagnetics" is verified only from the third-party list. "Teacher resources" holds no content and is not mapped.

### Unit 1: Motion and forces

Why it matters: predicting motion from forces is the core of vehicle design, sport science, robotics and game physics.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PHS-01 | `SWING!` | A ball going round in a circle needs a pull toward the centre; let go and it flies off straight, along the edge of the circle. | A frog on ice whirls a ball on a string round its head. The string's pull is an arrow pointing to the centre. A target sits off to one side. | Tap to let go of the string at any moment, to hit the target. | The ball flies off in a straight line along the edge of the circle (not straight outward) and smacks the target. | Letting go when the ball points at the target: it flies off at right angles and knocks a snowman's hat off. | Spin faster: the pull arrow grows fast and a weak string snaps | Frog |
| PHS-02 | `GLIDE!` | Friction slows things down, and it depends on the surfaces rubbing. | A block must slide to a flag across a floor that can be ice, wood or carpet. | Flick the block across each floor in turn, switching floors with a tap. | On ice it glides all the way; on wood it slows; on carpet it stops almost at once. A backward friction arrow grows from ice to carpet. | Flicking hard on carpet: the block tumbles end over end and stops anyway. | A ramp: find the floor where it just stays put | Penguin |
| PHS-03 | `HANG!` | A thing stays still when the forces on it cancel. | A lamp swaying on a cord; a tray of force arrows. | Drag a gravity arrow (down) and a cord arrow (up) onto the lamp and stretch them. | When the arrows are equal and opposite, the lamp stops swaying and the owl perches on it. | Adding a sideways arrow: the lamp swings off sideways and the owl flaps. | Two slanted cords | Owl |
| PHS-04 | `FLOOR IT!` | Speeding up means covering more distance each second than the second before. | A car on a road; a camera flashes once a second and leaves a ghost image. | Hold the pedal. | The ghost images spread farther and farther apart: the car is accelerating. | Tapping the brake: the ghosts bunch up and the car stops short of the finish. | Speed up, then cruise: the ghosts stop spreading | Fox |
| PHS-05 | `CATCH CARROT!` | A falling thing speeds up as it falls. | A carrot falls from a tall tower; you hold a basket that can slide down the side. | Drag the basket down to meet the carrot. | The carrot falls slowly at first, then faster and faster; you catch it only if you move the basket down faster and faster too. | Moving the basket at a steady speed: the carrot overtakes it and bonks the rabbit on the ground. | A ball thrown upward first | Rabbit |
| PHS-06 | `GO HOME!` | Displacement is the straight arrow from start to finish, however far you walked. | A fox has wandered a long, winding path away from its den. | Drag one arrow from the fox to its den. | The fox walks straight home along the arrow, much shorter than the winding path (an odometer shows how far it walked). | Retracing the whole winding path: the fox arrives exhausted and the moon is up. | A path that ends back at the den: no arrow at all | Fox |
| PHS-07 | `WEIGH!` | Mass stays the same everywhere; weight depends on gravity. | A rover on a balance scale and on a spring scale, on Earth; the Moon hangs in the sky. | Drag the rover and both scales to the Moon. | The balance stays level (mass), but the spring scale drops to about a sixth (weight), and the rover bounces lightly. | Trying to make the rover lighter by taking off its wheels: the balance tips, because now there is less stuff. | Jupiter: the spring scale reads more | Penguin |
| PHS-08 | `YANK!` | Still things stay still unless a force acts for long enough to move them (inertia). | A table set with dishes on a tablecloth. | Swipe fast to yank the tablecloth out. | The cloth flies out in a blur; the dishes stay put. | Swiping slowly: the dishes ride along and crash to the floor. | A heavier tablecloth | Duck |

### Unit 2: Force pairs and momentum

Why it matters: crumple zones, airbags, helmets, rockets and sports equipment are designed around momentum and how long a stop takes.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PHS-09 | `CRUMPLE!` | A crushable front makes a crash last longer, so the push on the driver is gentler. | A toy car with an egg driver, rolling toward a wall; a crushable box and a steel bar lie by the track. | Drag a part onto the car's front before it hits. | The box crumples slowly, the push on the egg is spread out, and the egg survives with a wobble. | The steel bar: the car stops instantly and the egg splats on the windscreen. | The car must also stay short enough to park | Duck |
| PHS-10 | `GIVE!` | Stopping something slowly takes a gentler force than stopping it fast. | A water balloon falls toward your hands. | Drag your hands down with the balloon as you catch it. | Moving with it stretches the stop out and the balloon wobbles but holds. | Holding your hands still: splash, and the duck is soaked. | An egg instead | Duck |
| PHS-11 | `STOP IT!` | A slow, heavy thing can have more momentum than a fast, light one. | A ping-pong ball whizzing and a truck creeping toward a row of sandcastles; one soft barrier. | Drag the barrier in front of the one that would do the most damage. | The barrier stops the creeping truck just in time; the ping-pong ball pings off a sandcastle harmlessly. | Blocking the ping-pong ball: the slow truck flattens every sandcastle. | Three movers | Beaver |
| PHS-12 | `COUPLE!` | When moving things join, they share their momentum and move on more slowly. | A moving train car and a parked one with a hook. | Drag the moving car's hook onto the parked car as they meet. | They couple with a clank and roll on together at half the speed. | Missing the hook: the cars bounce apart and the parked car rolls off alone. | Couple to two parked cars | Beaver |
| PHS-13 | `ROW!` | Forces come in pairs: the oars push the water back, and the water pushes the boat forward. | A rowing boat on a lake; the far shore has a jetty. | Swipe the oars backward through the water, again and again. | Each stroke draws two equal arrows: one on the water (backward), one on the boat (forward), and the boat glides to the jetty. | Swiping the oars forward: the boat goes backward and bumps into a swan. | A crosswind: row harder on one side | Duck |

### Unit 3: Gravitation

Why it matters: satellite orbits, GPS, launch planning and tides come from gravity's pull growing weaker with distance.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PHS-14 | `SPRAY!` | Gravity spreads out like spray paint, so three times farther is nine times weaker. | A spray can and a wall you can pull back; the tiles on the wall are the size of the paint patch close up. | Drag the wall back, step by step, until the paint patch is as pale as the probe's swatch. | Three steps back, the same paint spreads over 9 tiles, each one ninth as strong; the pull arrow on a probe shrinks to match. | Spraying longer instead of moving the wall: the patch only gets darker and drips. | Twice as far: 4 tiles | Bird |
| PHS-15 | `FALL AROUND!` | Astronauts float because they and the station are falling around Earth together. | A space station on a tower above Earth, with astronauts standing on its floor. | Swipe to give the station a huge sideways push off the tower. | The station falls but keeps missing Earth; inside, the astronauts lift off the floor and float, though gravity there is almost as strong as on the ground. | A weak push: the station falls back to Earth with a splash in the sea. | Make an elevator on Earth fall to feel the same float | Penguin |
| PHS-16 | `PUMP OUT!` | Without air, everything falls at the same rate. | A tall glass tube with a feather and a hammer inside, and a pump. | Hold to pump out the air, then tap to drop both. | With the air gone, the feather and the hammer fall side by side and land together. | Dropping before pumping: the feather drifts and lands long after the hammer. | The same drop on the Moon | Penguin |
| PHS-17 | `MOVE IN!` | Closer orbits go round faster. | Two moons race round a planet; yours is the far one and is losing. | Drag your moon to a closer orbit. | Closer in, it speeds up and laps the other moon. | Dragging it farther out to "get a run-up": it slows and falls even further behind. | Five moons | Bird |

### Unit 4: Electrostatics

Why it matters: static sparks destroy electronics and ignite fuel vapour; laser printers, air filters, paint sprayers and touchscreens use electric charge.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PHS-18 | `REPEL!` | Like charges push apart, opposite charges pull together, and both get much stronger up close. | Two balloons on threads; fur and a plastic sheet to rub them on. | Rub both balloons on the fur, then push them toward each other. | They swing apart, more and more strongly the closer you push. | Rubbing one on fur and one on plastic: they swing together and stick. | Make them hover apart at a set gap | Rabbit |
| PHS-19 | `LURE!` | A charged thing pulls on a neutral can by shifting the can's charges. | A charged balloon and an empty can lying on its side; a course with a bend. | Hold the balloon near the can, without touching, and lead it round the course. | The can's charges shift (opposite ones gather on the near side), and it rolls after the balloon. | Touching the can: the charges share and the can stops following. | A tighter bend | Fox |
| PHS-20 | `DISCHARGE!` | Touching metal with a key first lets static jump harmlessly through the key. | A fox slides across a car seat, all charged up, and reaches for the door. | Drag a key to touch the metal frame first. | A little spark jumps at the key's tip, not the fox's finger. | Touching with a bare paw: zap, and its tail frizzes into a bottle brush. | Discharge before refuelling | Fox |

### Unit 5: Energy

Why it matters: following where energy goes is how engineers size motors, roller coasters, heating systems and power stations, and find where a machine wastes energy.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PHS-21 | `JUMP!` | Height energy becomes speed: start higher to go faster at the bottom. | A cart on a hill track with a gap to jump at the bottom. | Drag the cart's starting point up the hill and let go. | An energy bar drains from "height" into "motion" on the way down; from high enough, the cart flies over the gap. | Starting low: the cart dribbles off the edge into a hay bale. | A bumpy track steals some energy as heat | Beaver |
| PHS-22 | `HAUL!` | Power is how fast energy is used: lifting faster takes more power. | Logs to lift up a cliff before the rain; a rope winch. | Mash to wind the winch. | The faster you mash, the faster the logs rise; the power gauge climbs with your speed, while the total energy bar ends the same. | Mashing slowly: the logs arrive soaked as the rain starts. | A heavier load | Beaver |
| PHS-23 | `OIL!` | Machines waste some energy as heat; less friction means more useful work. | A squeaky machine lifting a bucket; hot spots glow at its gears. | Tap each glowing gear to oil it. | The heat glows fade, less energy leaks away, and the bucket lifts higher on the same crank. | Oiling the bucket instead: it slips out of the claw with a clang. | More gears | Ant |
| PHS-24 | `HOP!` | Sand heats up much faster than water in the same sun. | A beach at noon: hot sand between a duck and the cool sea. | Tap to hop across the sand quickly. | The sand under each footstep glows orange-hot while the sea stays cool; the duck reaches the water with a sigh. | Dawdling: the duck's feet glow and it hops on one leg. | At night the sand cools faster than the sea | Duck |
| PHS-25 | `OPEN!` | A power station passes energy along a chain, losing a little as heat at every step. | A dam holding back water above a dark town. | Swipe to open the dam gates. | Water falls, the turbine spins, electricity runs down the wires and the town lights up; a heat wisp rises at each step. | Opening the gates before the turbine is connected: water rushes past and the town stays dark. | A gas power station that starts by burning fuel | Beaver |

### Unit 6: Electromagnetics

Why it matters: circuits are the daily work of electricians and electronics designers, and motors, generators and transformers run the power grid.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PHS-26 | `BRIGHTEN!` | More push (voltage) or less resistance makes more current flow. | A dim bulb in a loop; ants are the charge. The battery is a hill the ants climb, the bulb a narrow gate. | Swap in a taller battery or widen the gate. | More ants flow through the gate each second and the bulb brightens. | Adding a second narrow gate: fewer ants get through and the bulb dims. | Too much current blows the bulb | Ant |
| PHS-27 | `BRANCH!` | Bulbs on separate branches each get the full push; bulbs in one loop share it. | One glowing bulb; a second bulb and some wire. | Wire the second bulb onto its own branch. | Each branch gets its own stream of ants and both bulbs shine brightly. | Wiring it into the same loop: both bulbs dim to a glow. | Unscrew one bulb: on branches the other stays lit | Ant |
| PHS-28 | `PLUNGE!` | Moving a magnet in a coil makes electric current. | A bulb wired to a coil, and a bar magnet. | Swipe the magnet in and out of the coil. | The faster you swipe, the brighter the bulb glows. | Holding the magnet still inside the coil: the bulb goes dark, because only a changing field makes current. | Keep the bulb lit for 3 seconds | Frog |
| PHS-29 | `SPIN!` | A generator turns spinning into electricity. | A wind turbine wired to a village at night. | Mash to spin the turbine. | The coil spins between magnets and the village lights flicker on; faster spinning, brighter lights. | Stopping: the lights fade and the village sighs. | Lights switch on in more houses, so spin faster | Bird |
| PHS-30 | `STEP DOWN!` | A transformer changes voltage: fewer turns on the output coil give a lower voltage. | A phone charger fed from a high-voltage wire; the phone glows red "too much". | Tap to remove turns from the output coil. | The voltage at the phone falls into the green and it starts charging. | Adding turns: the voltage climbs and the phone smokes. | Step up the voltage for a long power line | Octopus |

### Unit 7: Electromagnetic radiation

Why it matters: radio, wifi, microwave ovens, X-rays, solar cells and heat cameras all use the same spectrum of light.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PHS-31 | `TUNE IN!` | Radio, microwaves, infrared, visible light, X-rays and gamma rays are all light with different wave lengths. | A wave dial and a row of gadgets: radio, microwave oven, TV remote, eye, X-ray machine. | Slide the dial to stretch or squeeze the wave; each gadget wakes when its wave length arrives. | Long waves play the radio; shorter ones warm the oven; then the remote, then colours for the eye, then the X-ray glows. | Turning the dial to X-ray on the radio: it crackles and the owl puts on a lead apron. | Wake them in order without skipping one | Owl |
| PHS-32 | `EXTEND!` | An aerial picks up a radio station best when its length suits the wave. | A radio crackling; its aerial can slide in and out. | Slide the aerial longer or shorter. | At the right length the music comes in clear and the bird dances. | Pushing the aerial all the way in: the radio only hisses. | A station with shorter waves | Bird |
| PHS-33 | `TRIGGER!` | Light comes in packets, and only packets with enough energy (bluer light) can trigger a sensor. | A door with a light sensor; a lamp with a colour dial and a brightness dial. | Turn the dials until the door opens. | Light is drawn as packets; bluer packets glow bigger. Blue light opens the door at once. | Turning red light up to full brightness: a flood of small packets, and the door stays shut. | An infrared sensor (a TV remote) | Owl |
| PHS-34 | `FORGE!` | Hotter things glow with bluer light: red, then orange, then white. | A metal bar in a forge. | Hold to heat it until it glows white. | It glows dull red, then orange, then yellow-white as it gets hotter. | Stopping at red: the beaver taps the bar and it is not ready to shape. | Match a cooler orange glow exactly | Beaver |

### Unit 8: Nuclear physics

Why it matters: nuclear power, radiocarbon dating, medical imaging and radiation safety rest on what nuclei are made of and how they change.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PHS-35 | `SHIELD!` | Paper stops alpha, aluminium stops beta, and only thick lead slows gamma. | Three beams of radiation aimed at a sleeping duck; a sheet of paper, a sheet of aluminium and a block of lead. | Drag a shield into each beam. | Each beam stops at the right shield and the duck sleeps on. | Paper in front of the gamma beam: it goes straight through and the duck's feathers stand on end. | The shields must be shared between moving beams | Duck |
| PHS-36 | `HALVE!` | In each half-life, about half of the unstable atoms left decay. | A jar of curled-up hedgehogs (unstable atoms); each step, some uncurl and turn grey (decayed). | Tap to run one half-life at a time; stop when about a quarter are left. | Each tap, about half of the remaining hedgehogs uncurl; the pile shrinks by halves, never in a straight line. | Tapping on and on to empty the jar: a few curled hedgehogs are always left, snoring. | Date a bone by how many are left | Hedgehog |
| PHS-37 | `PULL OUT!` | A nucleus that loses protons becomes a different element. | A nucleus drawn as a cluster of red protons and grey neutrons, with its element name above. | Pull a clump of 2 protons and 2 neutrons out of the cluster. | The clump flies off as an alpha particle and the name changes to a new element, two places down. | Pulling out only neutrons: the name stays the same; it is the same element, just lighter. | Tap a neutron to turn it into a proton (beta decay): the name moves one place up | Hedgehog |
| PHS-38 | `CONTROL!` | A steady chain reaction needs each split to cause exactly one more. | A reactor core with splitting nuclei and control rods. | Drag the control rods in or out to keep the neutron counter steady. | Each split releases 2 or 3 neutrons; the rods soak up the extras and the glow stays steady. | Pulling every rod out: the counter runs away, alarms flash and the beaver hides under the desk. | The reaction responds with a delay | Beaver |
| PHS-39 | `SPLIT!` | When a big nucleus splits, the pieces weigh a little less, and that missing mass becomes a lot of energy. | A big nucleus on a balance scale, and a neutron. | Flick the neutron into the nucleus. | It splits; the pieces on the scale weigh a touch less, and a huge flash of energy lights the room. | Missing the nucleus: the neutron bounces around the room and the beaver ducks. | Join two small nuclei (fusion): they also weigh less together | Owl |

## AP Physics 1: Algebra-Based (College Board CED, 2024 revision; KA "AP®︎/College Physics 1", /science/ap-physics-1)

Source: College Board AP Central course page "AP Physics 1: Algebra-Based" (fetched): Unit 1 Kinematics; Unit 2 Force and Translational Dynamics; Unit 3 Work, Energy, and Power; Unit 4 Linear Momentum; Unit 5 Torque and Rotational Dynamics; Unit 6 Energy and Momentum of Rotating Systems; Unit 7 Oscillations; Unit 8 Fluids. All eight titles verified. KA's course follows the same eight units (KA blog, 2025-08-18, which gives the count and topics but not the titles). KA's older AP Physics 1 unit list (including DC circuits and waves, from a Classtime mirror of KA's catalogue) predates the 2024 revision and is not used; those topics are mapped under AP Physics 2.

### Unit 1: Kinematics

Why it matters: aiming, launching, drone paths and sports analytics rest on one fact: a thrown thing's sideways motion and its falling motion happen independently.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AP1-01 | `FIRE!` | A ball fired sideways falls at the same rate as a ball simply dropped. | A cannon on a cliff edge; beside it, a penguin holds a snowball over the edge. | Tap to fire at the moment the penguin lets go. | Each ball casts a shadow on the cliff face; the two shadows fall side by side and both balls land at the same moment, one far out, one at the foot of the cliff. | Firing upward: that ball rises first and lands long after, so the falls no longer match. | Fire from a moving boat | Penguin |
| AP1-02 | `SHOOT!` | A thrown ball's path curves down because gravity pulls it the whole way. | A basketball hoop; the throw speed is fixed. | Drag the throw angle and release. | The arc draws as the ball flies, rising, flattening and falling into the hoop with a swish. | Aiming straight at the hoop: the ball curves down under it and bounces off a sleeping cat. | No preview of the arc | Rabbit |
| AP1-03 | `LEAP!` | On flat ground, a jump goes farthest at a middle angle, about halfway between flat and straight up. | A frog on a bank, a stream, and lily pads at different distances. | Slide the jump angle and tap to leap. | Low angles skim short, steep angles go high but land close; in between, the frog reaches the farthest pad. | Leaping straight up: the frog lands back on its own spot with a splash. | Leap off a high ledge, where a lower angle is best | Frog |
| AP1-04 | `CROSS!` | Your motion adds to the motion of what you are moving through. | A duck must swim to a dock straight across a river that flows to the right. | Turn the duck's heading, then let it swim. | Heading partly upstream, the current and the swimming add up to a path straight across and the duck lands at the dock. | Heading straight across: the current carries the duck downstream to a bakery, which it does not mind. | A faster current | Duck |
| AP1-05 | `FOLLOW!` | A speed graph tells the story of a motion: flat means steady, rising means speeding up. | A skateboarder on a track; a speed graph is drawn above with a dotted target line. | Tilt to speed up or slow down so your own speed trace follows the target line. | Your trace rides along the line: rising where the line rises, flat where it is flat. | Tilting hard on the flat part: your trace shoots off the top and the skateboarder flies off the ramp. | A line that falls to zero and rises again | Fox |

### Unit 2: Force and Translational Dynamics

Why it matters: friction, ramps, springs and turning are how structures, vehicles, cranes and rides are checked for safety.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AP1-06 | `CORNER!` | A car needs grip (friction) to turn; too fast or too icy and it skids straight on. | A car racing toward a curve; part of the road is icy. | Hold the brake to slow down before the curve, then steer round. | Slow enough, the tyres' grip pulls the car round the bend; the grip arrow points to the centre of the curve. | Too fast on ice: the grip arrow breaks, and the car slides straight on into a hay bale. | The whole curve is icy | Fox |
| AP1-07 | `BUDGE!` | Friction holds a thing still up to a limit; once it slides, friction is weaker. | A heavy crate on a floor. | Hold to push harder and harder. | The friction arrow grows to match your push and the crate stays put, until it breaks free; then it lurches forward and slides on a lighter push. | Letting go just before it budges: it sits there and the beaver kicks it. | A rubber mat raises the limit | Beaver |
| AP1-08 | `TIP RAMP!` | On a steeper ramp, more of gravity pulls along the slope. | A sled on a ramp that can tilt. | Tilt the ramp slowly until the sled slides into the snowbank. | The gravity arrow splits into a part along the slope and a part into it; the along part grows with the angle until it beats friction. | Tilting too fast: the sled flips off the top. | A heavier sled starts sliding at the same angle | Penguin |
| AP1-09 | `COUNTERWEIGHT!` | Two weights over a pulley move toward the heavier side, slowly if they are nearly equal. | A lift box hangs on a rope over a pulley; a heavy rock drops if released. | Drag weights onto the counterweight side until the box rises gently to the top. | Nearly equal sides make a slow, gentle rise. | One huge counterweight: the box rockets up and the beaver bonks its head. | Lower a load gently instead | Owl |
| AP1-10 | `STRETCH!` | Each equal weight stretches a spring the same extra amount, until it is overstretched. | A spring beside a ruler; a tray of identical weights; a mark to reach. | Hang weights one at a time until the pointer reaches the mark. | Each weight adds the same stretch, marked by evenly spaced ticks. | Hanging the whole tray at once: the spring stretches out straight and stays like that. | Find where it stops springing back | Frog |
| AP1-11 | `WHIRL!` | Going round faster needs a much stronger pull toward the centre. | A hedgehog whirls a ball on a string; the string's pull is an arrow with a red "snap" line. | Mash to whirl faster until the ball lifts over the fence, without snapping the string. | The faster it whirls, the longer the pull arrow grows; keep it just under the red line. | Whirling too fast: snap, and the ball flies off along the edge of its circle into a pond. | A shorter string | Hedgehog |
| AP1-12 | `GOING UP!` | A scale reads more while a lift speeds up going up, and less while it speeds up going down. | A rabbit on a bathroom scale in a lift; it wants the scale to read "light" for a photo. | Press the down button. | As the lift starts down, the scale's needle drops and the rabbit snaps a happy photo; once it moves steadily, the needle returns. | Pressing up: the needle swings high and the rabbit looks horrified. | Take the photo while the lift stops at the bottom | Rabbit |
| AP1-13 | `BALANCE!` | A thing balances at its centre of mass, which sits nearer the heavy end. | A rod with a heavy ball at one end and a light ball at the other, on a fingertip. | Slide the fingertip until the rod balances. | It balances much nearer the heavy ball; then it is tossed and spins about that same point. | Balancing it in the middle: it tips toward the heavy ball and bonks the beaver. | Three balls | Beaver |

### Unit 3: Work, Energy, and Power

Why it matters: energy accounting is the quickest way to size motors and batteries, design springs and rides, and find where a machine wastes energy.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AP1-14 | `PULL LOW!` | Only the part of a pull along the motion does work. | A penguin pulls a heavy sled with a rope; the rope's angle can change. | Slide the rope lower and pull. | The part of the pull along the ground (its shadow on the snow) grows and the sled moves. | Pulling straight up: the sled lifts its nose and goes nowhere. | A slope to pull up | Penguin |
| AP1-15 | `COAST!` | Friction turns motion energy into heat. | A sled sliding down a hill toward a flag far out on the flat; a rough patch on the way. | Swipe the rough patch away (sweep it) before the sled reaches it. | With less friction, fewer energy blocks turn into heat and the sled coasts past the flag. | Leaving the patch: the sled's runners glow warm and it stops short. | Two rough patches, sweep in time | Penguin |
| AP1-16 | `LOAD SPRING!` | A spring squeezed twice as far stores about four times the energy. | A frog on a spring launcher; lily pads at different distances. | Pull back to squeeze the spring and release. | Squeezing a bit farther sends the frog much farther; it lands on the target pad. | Squeezing all the way for a near pad: the frog sails over it into the reeds. | Two pads in a row | Frog |
| AP1-17 | `STREAMLINE!` | A car's top speed comes where air drag grows to match the engine's push. | A car on a long straight; its speed levels off below the finish banner's line. | Tap to fold in the mirrors, lower the roof box and close the windows. | Each change shrinks the drag arrow, and the top speed climbs past the line. | Opening the boot: drag grows and the car slows; a dog pokes its head out. | A stronger headwind | Fox |

### Unit 4: Linear Momentum

Why it matters: crash reconstruction, safety design, rocket staging and robot collision planning use the fact that momentum is shared, not lost.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AP1-18 | `CLICK!` | In Newton's cradle, momentum and energy pass through the balls. | Newton's cradle with five steel balls. | Drag one ball out and let go; then drag two. | One ball in, one ball out at the same speed; two in, two out. | Drag a ball and push it gently: one ball barely swings out at the other end, so the cradle sighs. | Three balls in | Owl |
| AP1-19 | `CLUNK!` | When things collide and stick, momentum is kept but some energy turns to heat and sound. | Two carts on a track with sticky pads. | Push one cart into the other. | They clunk together and roll on more slowly; a puff of warmth and a "clunk" show where the missing energy went. | Removing the sticky pads: they bounce apart with a "boing" and lose less. | A heavy cart into a light one | Beaver |
| AP1-20 | `POT!` | When a ball hits an equal still ball off-centre, the two roll away at right angles. | A pool table with a cue ball and one target ball near a pocket. | Aim the cue and strike. | The target ball rolls into the pocket and the cue ball heads off at a right angle to it. | Hitting dead centre at an angle: the target ball rolls away from the pocket. | Two target balls | Penguin |
| AP1-21 | `FOLLOW THRU!` | A push that lasts longer gives more speed, even at the same strength. | A football and a goal at the end of a long field. | Kick: hold the kick to keep your foot on the ball longer. | The longer contact sends the ball sailing into the goal; the area under the push-time graph beside it grows. | A quick jab at the same strength: the ball dribbles a short way. | A wind pushing back | Rabbit |

### Unit 5: Torque and Rotational Dynamics

Why it matters: wrenches, cranes, bike gears, door hinges and robot arms are designed around turning forces and where the mass sits.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AP1-22 | `LOOSEN!` | A push far from the bolt and straight across the handle turns it most easily. | A stuck bolt and a long wrench. | Slide your grip along the wrench and set the push direction, then push. | Far out and square-on, the bolt gives with a creak. | Gripping near the bolt: the wrench does not budge and the beaver's face turns red. | A shorter wrench | Beaver |
| AP1-23 | `SEESAW!` | A light rider balances a heavy one by sitting farther from the pivot. | A seesaw with a heavy beaver on one end. | Slide the light fox along the other side. | Farther out, the fox's turning arrow grows and the seesaw levels. | The fox sits at the same distance: the seesaw slams down on the beaver's side and the fox flies up. | Three riders | Fox |
| AP1-24 | `SPIN UP!` | Mass far from the axle makes a wheel harder to spin up. | A wheel with sliding weights on its spokes; a string to pull. | Slide the weights toward the hub, then pull. | With the mass near the hub, the wheel spins up fast. | Weights at the rim: the hedgehog pulls hard and the wheel crawls round. | Stop it spinning instead | Hedgehog |
| AP1-25 | `HOLD ON!` | On a spinning ride, the edge moves fastest. | A merry-go-round with a rabbit at the edge and a frog in the middle. | Spin it up by swiping, but drag the rabbit toward the middle before its hold slips. | Nearer the middle the rabbit moves slower and holds on comfortably. | Leaving the rabbit at the edge: it slides off along the edge of the circle into the sandpit. | Spin faster | Rabbit |

### Unit 6: Energy and Momentum of Rotating Systems

Why it matters: flywheels, rolling wheels, spinning satellites, figure skating and diving follow rotational energy and the conservation of spin.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AP1-26 | `PULL IN!` | A spinner speeds up when it pulls its mass inward. | A penguin skater spinning slowly; music beats faster than its spin. | Slide its flippers inward until its spin matches the beat. | The spin arrow on its head stays the same length while the spin speeds up. | Throwing its flippers wide: the spin slows to a wobble. | Slow down to a stop at the end of the song | Penguin |
| AP1-27 | `TUCK!` | Tucking up makes a diver spin faster; opening out slows the spin. | A diver leaves the board spinning slowly. | Hold to tuck; release to open out before the water. | Tucked, the diver whirls; opened at the right moment, it slices into the water straight. | Never tucking: a belly flop. Opening late: a back flop. | Two and a half somersaults | Bird |
| AP1-28 | `ROLL!` | Rolling things with mass near the rim roll down more slowly. | A wheel must roll down a ramp to a door before it shuts. | Slide the wheel's weights from the rim to the hub, then let it roll. | With the mass near the hub, less energy goes into spinning and it rolls through the door in time. | Mass at the rim: it trundles slowly and the door shuts in its face. | A sliding ice block races it | Hedgehog |
| AP1-29 | `BOOST!` | Lower orbits need more speed. | A satellite in a high orbit must drop to a lower one without falling. | Drag it down to the lower ring and swipe to speed it up. | The lower orbit closes only at the higher speed. | Keeping the old speed: it spirals down and burns up like a firework. | A planet with more mass | Bird |

### Unit 7: Oscillations

Why it matters: clocks, car suspensions, building sway, loudspeakers and sensors are oscillators; what sets their rhythm tells you how to tune them.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AP1-30 | `TICK!` | A pendulum's rhythm depends on its length, not its weight. | A clock's pendulum ticks faster than its metronome; a heavier bob lies nearby. | Slide the string longer or shorter until the ticks match. | A longer string swings slower and the clock keeps time. | Clipping on the heavier bob: the rhythm stays exactly the same and the owl taps it, puzzled. | The same clock on the Moon | Owl |
| AP1-31 | `BOUNCE!` | A heavier mass or a softer spring bounces more slowly. | A frog bouncing on a spring to a drumbeat that is slower than its bounce. | Swap in heavier backpacks or a softer spring until the bounce matches the drum. | The bounce slows into step and the frog dances. | Swapping in a stiffer spring: the frog bounces like a pogo stick at top speed. | A faster drum | Frog |
| AP1-32 | `GRAB!` | A swinging thing stops for an instant at each end of its swing and moves fastest in the middle. | A swinging pendulum bob with a ring on it. | Tap to grab the ring. | Grabbed at the end of the swing, where it is still for an instant, it comes away gently. | Grabbing at the bottom, where it is fastest: it yanks the owl off its perch. | A faster swing | Owl |
| AP1-33 | `PUMP!` | Pushing in time with a swing's own rhythm makes it go higher and higher (resonance). | A rabbit on a swing; a high flag. | Tap to push each time the swing comes back to you. | In-time pushes add height until the rabbit touches the flag. | Pushing as it swings toward you: the swing stops dead and the rabbit glares. | No beat cue | Fox |
| AP1-34 | `STEADY!` | A crowd stepping in time with a bridge's own sway can make it rock; a damper calms it. | A footbridge with a crowd walking; the bridge starts to sway with their steps. | Drag dampers (shock absorbers) under the bridge until the sway dies down. | The sway shrinks with each damper and the crowd walks across happily. | Waiting it out: the sway grows and everyone walks like penguins (the penguins don't mind). | More walkers | Penguins |

### Unit 8: Fluids

Why it matters: plumbing, dams, diving, hydraulics, ships, aircraft lift and blood flow are all pressure, buoyancy and flow.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AP1-35 | `SNOWSHOE!` | Spreading a weight over a bigger area lowers the pressure. | A fox must cross deep, soft snow; snowshoes, boots and stilts lie by the path. | Drag footwear onto the fox, then it walks. | Snowshoes spread its weight and it walks on top. | Stilts: it sinks to its ears with a muffled yip. | Thinner snow crust | Fox |
| AP1-36 | `POKE!` | Water pressure grows with depth. | A tall bottle of water and a thirsty plant far away. | Poke a hole in the bottle. | A hole near the bottom squirts farthest and waters the plant. | A hole near the top dribbles onto the duck's feet. | The jet shrinks as the bottle drains: water fast | Duck |
| AP1-37 | `LOAD!` | A boat sinks deeper as it is loaded, until it pushes aside water as heavy as itself plus its load. | A barge with a waterline mark; crates on the dock. | Drag crates onto the barge until the waterline reaches the mark. | The barge settles deeper with each crate and the water in the harbour rises a little. | One crate too many: water pours over the edge and the barge sinks with a gurgle (the crew wades out). | Salt water floats the barge higher | Beaver |
| AP1-38 | `DUNK!` | Water pushes up on a sunken thing with the weight of the water it pushes aside. | A rock hangs from a spring scale over a full tank; a cup catches spills. | Lower the rock into the tank. | Water spills into the cup and the scale reading drops by exactly the cup's weight (shown by putting the cup on a second scale). | Dunking the scale too: it fizzes and the reading jumps about. | A floating block: it spills its own weight | Duck |
| AP1-39 | `PINCH!` | A narrower pipe makes water flow faster. | A garden hose and a flower bed far away. | Pinch the nozzle narrower. | The jet speeds up and reaches the flowers. | Opening the nozzle wide: the water slows to a dribble on the duck's feet. | A river through a narrow gorge | Duck |
| AP1-40 | `BLOW!` | Fast-moving air has lower pressure, so the still air around pushes in. | Two balloons hanging side by side. | Hold to blow between them. | They swing together and bump. | Blowing on the outside of one: it swings away and boings off the wall. | Lift a paper strip by blowing over its top | Bird |
| AP1-41 | `JACK UP!` | Pressure in a liquid spreads evenly, so a small push on a small piston lifts a car on a big one. | A car lift: a small piston and a big piston joined by oil. | Pump the small piston down again and again. | Each pump lifts the car a little; the same pressure arrows act on every patch of the big piston. | Pushing once and waiting: the car rises a sliver and the beaver sighs. | Two cars | Beaver |

## AP Physics 2: Algebra-Based (College Board CED, 2024 revision; KA "AP®︎/College Physics 2", /science/ap-physics-2)

Source: College Board AP Central course page "AP Physics 2: Algebra-Based" (fetched): Unit 9 Thermodynamics; Unit 10 Electric Force, Field, and Potential; Unit 11 Electric Circuits; Unit 12 Magnetism and Electromagnetism; Unit 13 Geometric Optics; Unit 14 Waves, Sound, and Physical Optics; Unit 15 Modern Physics. All seven titles verified (the numbering continues from AP Physics 1). KA's AP Physics 2 unit titles could not be read and are not used.

### Unit 9: Thermodynamics

Why it matters: engines, refrigerators, heat pumps, tyres, scuba tanks and weather run on how gases behave and on heat flowing from hot to cold.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AP2-01 | `HEAT!` | A gas pushes harder when it is hotter, because its particles move faster and hit the walls harder. | A piston with weights on top; gas particles bounce inside. | Hold the heater on until the piston lifts the weights to the line. | The particles speed up, their wall hits flash harder and more often, and the piston rises. | Cooling instead: the particles slow, the piston sinks and the weights topple. | Add weights while heating | Octopus |
| AP2-02 | `CHILL!` | A gas shrinks as it cools; at absolute zero its particles would stop. | A balloon too big to fit through a small door; a freezer. | Drag the balloon into the freezer, then out to the door. | Its particles slow down, the balloon shrinks and squeezes through the door; outside it warms and swells back. | Leaving it in the sun: it swells and gets stuck in the door frame. | Find the coldest setting: the particles almost stop | Penguin |
| AP2-03 | `COMPRESS!` | Pushing on a gas (doing work on it) warms it up. | A bike pump and a flat tyre. | Mash to pump. | The tyre fills, and the pump's barrel glows warm from the work done on the air. | Pumping with the valve open: air just whooshes back out. | Let air out fast: the valve gets cold | Fox |
| AP2-04 | `SPREAD!` | Things spread out and mix on their own and never un-mix by themselves (entropy grows). | A box split by a wall: blue particles on the left, empty on the right. | Lift the wall; then try to swipe the particles back into the left half. | They spread through the whole box; your swipes push some back but more drift out again. | Swiping hard and fast: the particles bounce off your hand and spread even more. | Two colours mixing | Octopus |
| AP2-05 | `RUN!` | An engine works by letting heat flow from hot to cold, and some heat always leaves at the cold side. | A little engine between a fire and an ice block. | Drag the ice block against the engine's cold end. | Heat flows from the fire, through the engine (which turns a wheel), into the ice; some heat always reaches the ice. | Taking the ice away: the engine warms all over and stops, though the fire is still burning. | A colder ice block makes it run faster | Beaver |
| AP2-06 | `GLAZE!` | Heat flows through solids, and a gap of still air slows it. | A cold window with heat arrows streaming out. | Drag a second pane in front, leaving a gap. | The trapped air between the panes slows the heat and the arrows shrink. | Pressing the second pane flat against the first: the arrows barely shrink. | A metal window frame leaks heat | Penguin |

### Unit 10: Electric Force, Field, and Potential

Why it matters: capacitors, sensors, printers and lightning protection, and every voltage in electronics, come from electric fields.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AP2-07 | `HOVER!` | Like charges push apart, much more strongly when close. | A charged ball fixed on the floor and another charged ball to float above it. | Lower the top ball until it hovers. | The push grows sharply as you come closer, until it holds the ball up in the air. | Dropping it fast: it shoots back up and bonks the ceiling. | Opposite charges: keep them from snapping together | Rabbit |
| AP2-08 | `TRACE!` | Electric field lines start on positive charges and end on negative ones. | A plus charge and a minus charge on a sheet; a small test charge. | Drop the test charge near the plus and let it go; then trace its path. | It slides along a curved line from plus to minus; more traces fill in the field's shape. | Dropping it on the far side of the minus: it shoots off the sheet. | Two plus charges: lines bend apart | Ant |
| AP2-09 | `SHARE!` | Touching conductors share their charge until it is spread evenly. | Two metal balls: one packed with charge dots, one empty. | Touch them together. | The dots flow across until both look the same. | Touching with a rubber glove in between: nothing flows. | Three balls in a row | Hedgehog |
| AP2-10 | `ROLL DOWN!` | Voltage is like height: a positive charge rolls from high voltage to low. | A landscape with a hill around a plus charge and a pit around a minus charge. | Drop a positive marble anywhere. | It rolls downhill from the plus hill into the minus pit. | Dropping a negative marble: it rolls the other way, uphill, which surprises everyone. | Find the flat spot between two hills | Frog |
| AP2-11 | `WALK LEVEL!` | Along an equipotential line, the voltage stays the same and no work is done. | A charged landscape and a voltmeter carried by an ant. | Trace a path where the meter stays still. | The path curls around the charge like a contour line on a map, crossing every field line at right angles. | Walking toward the charge: the meter swings wildly. | Two charges | Ant |

### Unit 11: Electric Circuits

Why it matters: designing, fixing and measuring any circuit, from a toy to a solar installation, uses current, voltage, resistance and capacitors.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AP2-12 | `SHORT!` | Current takes the easiest path; a bare wire across a bulb steals all the current. | A glowing bulb and a loose bare wire nearby; a fuse in the loop. | Drag the wire across the bulb's two ends. | The ants all take the wire, the bulb goes dark, the wire glows hot and the fuse pops: the circuit is protected. | Using a rubber band instead: nothing changes and the bulb stays lit. | Find which bulb in a string has a short | Ant |
| AP2-13 | `LOOP!` | The battery lifts the charge up, and the bulbs let it all back down by the time it returns. | A battery as a lift and bulbs as slides; an ant rides the loop. | Drag the ant round the circuit. | It rides up in the battery and slides down through each bulb, ending exactly where it started. | Adding a bulb that is "uphill": the ant gets stuck at the top. | Two batteries | Ant |
| AP2-14 | `FORK!` | At a junction, the current splits, and all of it comes back together. | A stream of ants reaches a fork with two gates. | Open the second gate. | The ants divide between the branches and every one of them rejoins after the fork. | Opening a gate to nowhere: ants pile up at the dead end. | Gates of different widths | Ant |
| AP2-15 | `HOOK UP!` | An ammeter goes in the loop; a voltmeter goes across the part. | A bulb circuit; an ammeter and a voltmeter. | Drag each meter into place. | Both needles swing to steady readings. | The ammeter across the bulb: it short-circuits and its fuse pops with a puff. | Measure just one of two bulbs | Beaver |
| AP2-16 | `THICKEN!` | Longer and thinner wires resist current more. | A long wire to a lamp in a shed glows dim. | Swap in a thicker wire, or move the shed closer. | The lamp brightens. | Using a long, thin wire: the wire itself warms and the lamp barely glows. | A cheaper wire that is still thick enough | Beaver |
| AP2-17 | `CHARGE!` | A capacitor stores charge on its plates and can let it all go at once. | A camera flash with a capacitor between two plates. | Hold to charge until the ready light comes on, then tap to flash. | Charge dots pile onto the plates, fast at first, then slower; the flash empties them in a bright pop. | Tapping before it is charged: a weak flicker and a blurry photo. | A bigger capacitor takes longer and flashes brighter | Owl |
| AP2-18 | `FADE!` | A capacitor and resistor set how fast a light fades: a bigger resistor makes it slower. | A night-light that must fade out slowly as an owl falls asleep. | Turn the resistor dial bigger. | The glow fades gently over a few seconds and the owl drifts off. | A tiny resistor: the light snaps off and the owl jumps awake. | Make it fade on, too | Owl |

### Unit 12: Magnetism and Electromagnetism

Why it matters: motors, generators, MRI, speakers, induction cooktops and wireless chargers use magnetic forces and induction.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AP2-19 | `FLIP!` | A moving charge in a magnetic field is pushed sideways. | A proton shoots across a magnetic field; a catcher sits above its path. | Flip the field's direction. | The proton curves up into the catcher. | Leaving the field off: it flies straight and pings off a wall. | An electron curves the other way | Bird |
| AP2-20 | `MOTOR!` | A motor spins because the push on its coil flips at just the right moment. | A coil between two magnets turns half a turn and stops. | Tap to flip the current each time the coil is upright. | The coil keeps spinning; push arrows on its sides show why. | Tapping at the wrong moment: the coil rocks back and forth like a nervous pendulum. | The motor speeds up, so the taps come faster | Beaver |
| AP2-21 | `FLICK!` | A faster change in the magnetic field makes more voltage. | A coil, a bulb and a magnet. | Flick the magnet through the coil faster and faster until the bulb glows bright. | A fast flick gives a bright flash; a slow push gives a faint glow. | Leaving the magnet inside the coil: darkness. | A coil with more turns | Frog |
| AP2-22 | `ZAP!` | A changing field makes currents that push back against the change (Lenz's law). | A metal ring on top of a coil. | Tap the switch. | The current in the coil makes a current in the ring that pushes back, and the ring leaps into the air. | A ring with a cut in it: no current can flow round it and it just sits there. | Catch the ring as it comes down | Frog |
| AP2-23 | `SLOW FALL!` | A magnet falling through a copper pipe makes currents that slow it down. | A magnet over a copper pipe, and a sleeping duck on a pillow at the bottom. | Drop the magnet down the copper pipe. | It drifts down slowly and lands softly on the pillow. | Using the plastic pipe: it drops like a stone and bonks the duck awake. | A thicker copper pipe makes it slower still | Duck |
| AP2-24 | `KICK!` | A wire carrying current in a magnetic field gets a push. | A wire hangs between magnet poles with a ball beside it, and a goal. | Flip the current's direction, then switch on. | The wire kicks sideways and knocks the ball into the goal. | The wrong direction: it kicks the ball into its own net. | Wire along the field: no kick at all | Octopus |
| AP2-25 | `CIRCLE!` | Current in a wire makes a magnetic field that circles the wire. | A wire through a table and a pile of compasses. | Drag compasses around the wire, then switch the current on. | All the needles swing to point round the wire in a circle. | Putting them all in a line along the wire: they point every which way. | Reverse the current: they all flip | Owl |

### Unit 13: Geometric Optics

Why it matters: cameras, glasses, microscopes, projectors, fibre optics and phone lenses are designed with how light bends and focuses.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AP2-26 | `FOCUS!` | A lens brings light from each point back to a point at one distance only. | A projector throws a blurry frog onto the wall. | Slide the lens back and forth. | At the right spot the rays meet and the picture snaps sharp. | Overshooting: the picture blurs again on the other side. | The wall moves | Frog |
| AP2-27 | `SPEAR!` | Light bends at the water's surface, so a fish looks shallower than it is. | A fish in a pond, seen from the bank. | Aim the net into the water and lunge. | Aiming below where the fish appears, the net scoops it up; a ray picture shows the bend. | Aiming right at the fish's image: the net splashes above it and the fish winks. | A deeper pond | Bird |
| AP2-28 | `TRAP LIGHT!` | Light hitting a surface at a shallow enough angle bounces back inside (total internal reflection). | A laser at one end of a bent glass fibre and an igloo at the other. | Tilt the laser's entry angle. | The beam zigzags along inside the fibre and lights the igloo. | Too steep: the beam leaks out at the first bend and lights a snowman's nose. | A tighter bend | Penguin |
| AP2-29 | `DRAW RAYS!` | Three easy rays find where a lens makes its image. | A lens, an object arrow and two focus dots. | Drag a ray parallel to the axis (it bends through the far focus) and a ray through the centre (it goes straight). | Where they cross, the image appears, upside down. | Bending the parallel ray through the near focus: no image forms and the owl shrugs. | A spreading lens: the image is on the same side | Owl |
| AP2-30 | `MAGNIFY!` | A lens held close to a thing shows it bigger and upright. | An ant reading a tiny letter. | Slide the magnifying glass toward the letter. | Close enough, the letter appears big and upright and the ant reads it. | Holding the glass too far away: the letter turns upside down and blurry. | Read the small print on a stamp | Ant |
| AP2-31 | `SPOON!` | A curved-in mirror can flip your face; a curved-out mirror shows it small and upright. | A shiny spoon and a fox's face. | Turn the spoon over and move it closer and farther. | The inside of the spoon shows the fox upside down until very close; the back shows it small and upright. | Holding the inside very close: a giant blurry fox nose fills the screen. | A shop's security mirror | Fox |

### Unit 14: Waves, Sound, and Physical Optics

Why it matters: musical instruments, noise cancelling, ultrasound, radar speed guns, spectrometers and anti-reflection coatings use standing waves, the Doppler effect and interference.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AP2-32 | `STANDING WAVE!` | A string vibrates in whole loops only at special rates; you hear each as a note. | A frog shakes one end of a rope tied to a post. | Slide the shaking rate up until the rope locks into one big loop, then two, then three (you hear the notes). | At each special rate the rope stands still in loops and a clear note rings out. | Shaking between the special rates: the rope thrashes about and the note squawks. | Make exactly three loops | Frog |
| AP2-33 | `POUR!` | A shorter column of air sings a higher note. | Bottles in a row; a tune to play by blowing across them. | Pour water into each bottle until its note matches the tune's note. | More water, shorter air column, higher note; the tune plays. | Overfilling: the bottle overflows and goes "glug". | A longer tune | Owl |
| AP2-34 | `WHOOSH!` | A siren sounds higher as it comes toward you and lower as it goes away (the Doppler effect). | An ambulance racing toward a fox at the roadside. | Tap at the moment the siren's pitch drops. | The sound waves are drawn bunched in front and stretched behind; the pitch falls just as it passes. | Tapping early: the ambulance is still coming and the fox jumps back. | A faster ambulance: a bigger drop | Fox |
| AP2-35 | `RING!` | A tuning fork can make another fork with the same note ring on its own (resonance). | Two tuning forks on boxes across a room, one with a slider weight. | Slide the weight on the second fork until it rings when the first one is struck. | At the matching note, the far fork starts ringing all by itself. | A note close but not equal: it shivers and falls silent. | Three forks, only one can match | Owl |
| AP2-36 | `SPREAD BANDS!` | Light through two slits makes bright and dark bands; slits closer together spread them out. | A laser, two slits and a screen with target marks. | Slide the slits closer together or farther apart. | The bright bands spread or squeeze until they land on the marks. | Covering one slit: the bands vanish into one soft glow. | Change the laser colour too | Duck |
| AP2-37 | `BUBBLE!` | A soap film's colours come from light reflecting off its two surfaces; the colour changes as it thins. | A soap film on a loop, and a target colour. | Hold to let the film drain thinner. | Bands of colour slide down the film; release when it shows the target colour. | Waiting too long: the film turns black at the top and pops. | Blow a whole bubble | Duck |
| AP2-38 | `HUSH!` | Two sound waves can cancel where a crest meets a trough. | Two speakers playing the same hum; a rabbit wants to sleep. | Drag the rabbit's bed to a quiet spot. | Where crest meets trough the rings vanish and the rabbit snores. | The spot exactly between the speakers: loud, and its ears ring. | Noise-cancelling headphones: tune a second wave to cancel the first | Rabbit |
| AP2-39 | `RAINBOW!` | A grating (or a CD) spreads white light into its colours. | A CD, a torch and a target spot on the wall. | Tilt the CD. | A rainbow fans out and lands on the target. | Tilting the CD's plain label side: only a white blob. | Hit the target with green only | Owl |

### Unit 15: Modern Physics

Why it matters: solar cells, LEDs, lasers, electron microscopes, medical imaging and nuclear power depend on photons, energy levels and nuclear physics.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AP2-40 | `KNOCK OUT!` | Light knocks electrons out of a metal only if each light packet has enough energy (the photoelectric effect). | A metal plate with electrons resting on a step; a lamp with colour and brightness dials. | Turn the dials until electrons fly off. | Bluer light sends bigger packets that knock electrons straight off the step. | Red light at full brightness: a hail of small packets, and not one electron leaves. | A metal with a taller step needs violet | Owl |
| AP2-41 | `DROP DOWN!` | An electron falling to a lower energy level gives off light of one exact colour. | An atom drawn as a ladder of energy levels with an electron on a high rung; a lamp needs red light. | Drag the electron down one rung at a time. | Each drop shoots out a photon whose colour depends on the size of the drop; the red one lights the lamp. | Dropping it all the way down at once: an ultraviolet flash, and the lamp stays dark. | Make a blue-green photon | Frog |
| AP2-42 | `SHARPEN!` | Fast electrons have tiny waves, small enough to see atoms. | An electron microscope with a blurry picture of atoms. | Turn up the electron speed. | The electrons' waves shrink and the atoms come into focus as neat dots. | Turning the speed down: the waves stretch and the picture turns to fog. | Pick out a missing atom | Ant |
| AP2-43 | `WEIGH PARTS!` | A joined nucleus weighs less than its separate parts; the missing mass was released as energy. | A balance with a loose proton and neutron on one pan. | Drag the joined pair (a deuteron) onto the other pan. | The joined pair is lighter and the balance tips; the missing mass shows as a flash of energy. | Putting the deuteron on the same pan as the loose pair: the scale crashes over and the hedgehog ducks. | A helium nucleus is lighter still for its parts | Hedgehog |
| AP2-44 | `FUSE!` | Small nuclei join (fusion) only if they crash together fast enough to overcome their push apart. | Two hydrogen nuclei that push each other away. | Swipe hard to slam them together. | A fast swipe gets them over the push-apart hill; they fuse with a flash. | A gentle swipe: they bounce apart like magnets. | A taller hill | Bird |

## AP Physics C: Mechanics (College Board CED, 2024 revision)

Source: College Board AP Central course page "AP Physics C: Mechanics" (fetched): Unit 1 Kinematics; Unit 2 Force and Translational Dynamics; Unit 3 Work, Energy, and Power; Unit 4 Linear Momentum; Unit 5 Torque and Rotational Dynamics; Unit 6 Energy and Momentum of Rotating Systems; Unit 7 Oscillations. All seven titles verified. The units match AP Physics 1 units 1 to 7. This course adds calculus, so its new games show the ideas calculus describes: a rate is the steepness of a graph, a total is the area under one, and forces that change from moment to moment. The calculus itself is the math app's (C-07 POWER RULE!, C-24 FTC!).

### Unit 1: Kinematics

Why it matters: robot controllers, phone motion sensors and flight software turn position into speed (steepness) and acceleration into speed gained (area).

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PCM-01 | `SLOPE!` | Speed at an instant is how steep the position graph is at that moment. | A drone's height graph curving upward; a ruler can be laid on it; a speedometer. | Tilt the ruler so it just touches the curve at the marked moment. | The speedometer follows the ruler's steepness; when the ruler touches the curve just right, the drone's speed and the ruler agree and a light turns green. | Laying the ruler from the start of the graph to the point: it shows the average, and the speedometer disagrees. | Find the moment the drone is not moving at all (the flat spot) | Bird |
| PCM-02 | `PAINT!` | The speed gained is the area under the acceleration graph. | A rocket sled; an acceleration graph to paint as bars; a speed target. | Paint acceleration bars under the graph, second by second, until the sled reaches the target speed by the flag. | Each painted bar adds its area to the speed bar beside it. | Painting one huge tall bar at the very end: the sled jolts and overshoots the flag. | Some bars below the line slow it down | Fox |
| — | `FIRE!` |  See AP1-01 to AP1-05 for projectile and relative motion. | | | | | | |

### Unit 2: Force and Translational Dynamics

Why it matters: drag, banked roads and continuous bodies are everyday problems in vehicle, sports-equipment and structure design.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PCM-03 | `OPEN CHUTE!` | A falling thing speeds up until air drag grows to match its weight; then its speed stays steady. | A skydiving bird falling past a speed gauge; a soft landing target below. | Tap to open the parachute. | The drag arrow grows with speed until it equals the weight arrow; with the chute open the steady speed drops low and the bird lands gently. | Opening too late: it lands in a haystack at full speed and pops out, dazed. | Steer to the target while falling | Bird |
| PCM-04 | `BANK!` | A tilted road can turn a car with no friction at all. | An icy curve and a car coming in fast. | Tilt the road's surface as the car arrives. | At the right tilt, the road's push leans in toward the centre and turns the car round the bend. | Too steep: the car slides down the inside. Too flat: it slides off the outside into the snow. | A faster car needs more tilt | Penguin |
| — | `CORNER!` | See AP1-06 to AP1-13. | | | | | | |

### Unit 3: Work, Energy, and Power

Why it matters: real forces change with position (springs, magnets, gravity far from Earth), and an energy landscape shows at a glance which way things will move.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PCM-05 | `SETTLE!` | Things settle at the bottom of an energy valley; a hilltop is a balance point that does not last. | An energy landscape of hills and valleys, and a marble. | Place the marble so it stays still for 3 seconds. | In a valley it rolls back whenever nudged, and stays. | Balancing it on a hilltop: a breeze, and it rolls off, bouncing down the valleys. | A tiny shake every second | Hedgehog |
| PCM-06 | `PUSH HARDER!` | A spring pushes back harder the more it is squeezed, so the last bit of squeeze takes the most work. | A long spring and a toy car to launch. | Hold to squeeze the spring; the push arrow grows as you go. | The area under the push graph beside it fills fastest at the end; release, and all of that work launches the car. | Squeezing only a little: the car rolls off and stops. | Two springs side by side | Beaver |

### Unit 4: Linear Momentum

Why it matters: crash forces, rocket thrust and sports impacts change from moment to moment; the area under the force graph tells you the total effect.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | `FOLLOW THRU!` | See AP1-21 (the area under a push-time graph) and AP1-18 to AP1-20. | | | | | | |
| PCM-07 | `SOFT CATCH!` | The same stop can be a short spike or a long, gentle push; the total (the area) is the same. | A baseball falling into a glove; the force on the hand is drawn as a graph. | Drag the glove back as you catch. | The graph's spike flattens into a long low hump with the same area, and the hand does not sting. | A stiff hand: a tall spike and a cartoon "OW". | A faster ball | Rabbit |

### Unit 5: Torque and Rotational Dynamics

Why it matters: sizing motors for robot arms, wheels and turbines depends on how hard a shape is to spin about a given axis.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PCM-08 | `TWIRL!` | A rod is much easier to spin about its middle than about its end. | A baton and a beat to twirl it to. | Swipe to twirl it, holding it at the middle or the end. | Held at the middle, it spins fast and easy to the beat. | Held at the end: it lumbers round and clonks the beaver's head. | A baton with weights at the ends | Beaver |
| PCM-09 | `LIGHTEN!` | A heavy pulley wheel slows a falling bucket, because spinning it up takes energy too. | A bucket on a rope over a big iron pulley; a delivery must arrive before a bell. | Swap the iron pulley for a light one. | The bucket falls faster and arrives in time. | Adding a second iron pulley: the bucket crawls down. | Lift a bucket instead | Owl |

### Unit 6: Energy and Momentum of Rotating Systems

Why it matters: spacecraft, planets and spinning machines all keep their spin unless something twists them, and rockets must beat a planet's pull to leave it.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PCM-10 | `WIND IN!` | A thing on a string speeds up as the string winds shorter, because its spin is kept. | A puck on ice tied to a post by a string. | Hold to wind the string in. | As the circle shrinks, the puck whirls faster and faster. | Letting it out: it slows to a lazy loop. | Wind it to just the right speed to hit a bell | Penguin |
| PCM-11 | `SWEEP!` | A comet moves fastest when closest to the Sun, sweeping out equal areas in equal times. | A comet on a long oval orbit; equal-time wedges are drawn. | Tap at each tick to drop a wedge. | Near the Sun the wedges are short and fat, far away long and thin; all have the same area, so the comet races close in and dawdles far out. | Tapping off the beat: the wedges come out unequal and the comet seems to stutter. | A rounder orbit | Bird |
| PCM-12 | `ESCAPE!` | Launch fast enough and a rocket leaves a planet for good. | A rocket on a planet, with a speed dial. | Turn up the launch speed and fire. | Below the escape speed it rises, slows and falls back; at the escape speed it slows forever but never returns. | Launching just under: it climbs very high, then falls back slowly with a sad whistle. | A heavier planet | Bird |

### Unit 7: Oscillations

Why it matters: vibration analysis of machines, bridges and phones starts with the natural rhythm of a spring and a mass.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | `BOUNCE!` | See AP1-30 to AP1-34: a stiffer spring bounces faster; a heavier mass bounces slower. | | | | | | |
| PCM-13 | `SMOOTH RIDE!` | A shock absorber damps a bounce; too little and it bounces, too much and it is stiff. | A car about to hit a bump; a damper dial. | Turn the damper dial before the bump. | Just right, the car settles after one gentle dip. | No damping: it bounces down the road like a kangaroo. | A bigger bump | Frog |

## AP Physics C: Electricity and Magnetism (College Board CED, 2024 revision)

Source: College Board AP Central course page "AP Physics C: Electricity and Magnetism" (fetched): Unit 8 Electric Charges, Fields, and Gauss's Law; Unit 9 Electric Potential; Unit 10 Conductors and Capacitors; Unit 11 Electric Circuits; Unit 12 Magnetic Fields and Electromagnetism; Unit 13 Electromagnetic Induction. All six titles verified. Ideas already met in AP Physics 2 are cross-referenced; the new games show Gauss's law, conductors, capacitors in real devices, and coils that resist change.

### Unit 8: Electric Charges, Fields, and Gauss's Law

Why it matters: shielding cables, protecting buildings from lightning and designing sensors use how field lines leave charges and how metal shields them.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PCE-01 | `SURROUND!` | The field lines through any closed bubble count only the charge inside it. | Charges on a sheet; a stretchy bubble. | Drag the bubble around different charges. | Lines from charges inside leave the bubble and are counted; lines from charges outside go in and out again and cancel. | Wrapping a charge outside: its lines poke in and straight back out, and the counter stays put. | Make the count zero with a plus and a minus inside | Octopus |
| PCE-02 | `SHELTER!` | Inside a closed metal cage the electric field is zero, even in a lightning strike. | A thunderstorm; a wooden box and a metal cage. | Drag the bird into a shelter before the flash. | The lightning's charge spreads over the cage's outside; inside, the bird preens. | The wooden box: a cartoon frizz. | The cage has a gap to close first | Bird |
| PCE-03 | `PROTECT!` | Charge crowds onto sharp points, so sparks leap from points first. | A barn on a hill in a storm; a pointed metal rod. | Drag the rod onto the barn's roof and connect it to the ground. | The lightning strikes the rod's point and runs safely to the ground. | Putting the rod beside the barn: lightning hits the weathervane and the rooster spins. | Two barns, one rod | Owl |
| — | `TRACE!` | See AP2-07 to AP2-11 for charges, fields and voltage. | | | | | | |

### Unit 9: Electric Potential

Why it matters: voltage maps of circuits and machines tell where charges will flow and where insulation must be thickest.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PCE-04 | `CONTOUR!` | Equipotential lines are like contour lines; the field is strongest where they crowd together. | A charged landscape seen from above, with contour lines; a charged marble. | Drop the marble where it will race the fastest. | Where the contour lines crowd together, the slope is steepest and the marble shoots off. | Dropping it where the lines are far apart: it creeps along. | Find the flat spot between two equal charges | Frog |

### Unit 10: Conductors and Capacitors

Why it matters: capacitors smooth power supplies, store energy in camera flashes and defibrillators, and sense your finger on every touchscreen.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PCE-05 | `TOUCH!` | A touchscreen senses your finger because your finger changes how much charge the screen's tiny plates can hold. | A phone screen shown as a grid of tiny plates holding charge dots; an app icon. | Tap the icon. | Charge shifts toward your fingertip at that spot, the grid lights there, and the app opens. | Tapping with a gloved finger: no charge shifts and the frog taps and taps. | Swipe across the screen | Frog |
| PCE-06 | `SLIDE IN!` | Putting an insulator between capacitor plates lets them hold more charge. | A capacitor on a battery with charge dots on its plates; a plastic slab. | Slide the slab between the plates. | More dots flow in from the battery and the plates fill up. | Sliding in a metal sheet: it shorts the plates and a spark snaps. | Disconnect the battery first: then the voltage drops instead | Beaver |
| PCE-07 | `CLOSE GAP!` | Capacitor plates that are bigger and closer together hold more charge. | Two plates and a charge meter. | Drag the plates closer together and stretch them wider. | The meter fills as the plates hold more charge. | Pulling them apart: charge drains away and the meter empties. | Fill it without the plates touching | Owl |

### Unit 11: Electric Circuits

Why it matters: real batteries have hidden resistance and capacitors take time to fill, which decides how phones, cameras and timers behave.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PCE-08 | `EASE OFF!` | A battery's voltage sags under a heavy load because of resistance inside it. | A phone on a cold day; its torch, screen and camera all on; the battery voltage dips toward "shutdown". | Switch off the heavy loads. | The voltage recovers above the line and the phone stays on. | Turning on the camera flash too: the voltage dips under the line and the phone dies mid-selfie. | A colder day | Penguin |
| — | `CHARGE!` | See AP2-12 to AP2-18. | | | | | | |

### Unit 12: Magnetic Fields and Electromagnetism

Why it matters: MRI magnets, mass spectrometers and electromagnets are designed with the fields that coils and currents make.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PCE-09 | `COIL!` | A tight coil of wire makes a strong, even magnetic field inside it. | A loose loop of wire with weak field lines; a compass. | Drag the loops closer together into a tight coil. | The field lines inside line up straight and strong, and the compass inside snaps to point along the coil. | Spreading the loops out: the field inside weakens and wanders. | More current as well | Octopus |
| PCE-10 | `SEPARATE!` | In a magnetic field, heavier charged atoms curve in wider circles. | A beam of mixed atoms entering a magnetic field; two collection bins. | Turn the field strength until each kind lands in its own bin. | Light atoms curve tightly into the near bin, heavy ones curve wide into the far bin. | Too weak a field: everything lands in a heap at the back wall. | Three kinds of atom | Bird |
| PCE-11 | `PULL TOGETHER!` | Wires carrying current the same way pull toward each other. | Two hanging wires that must pull together to close a gate. | Flip one wire's current direction. | With both currents the same way, the wires pull together and the gate shuts. | Opposite currents: they push apart and the gate swings open. | Three wires | Octopus |

### Unit 13: Electromagnetic Induction

Why it matters: generators, transformers, induction chargers and the coils in every power supply work because coils resist changes in current.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| PCE-12 | `SNAP!` | A coil resists sudden changes in current, and snapping a switch open makes it spark. | A big coil in a circuit with a switch. | Snap the switch open fast. | The coil's stored energy jumps the gap as a bright spark. | Opening it slowly through a resistor: just a gentle fade, which is the safe way (and the duck applauds). | Add a diode to catch the spark safely | Duck |
| PCE-13 | `TUNE RADIO!` | A coil and a capacitor together ring at one rate, and a radio uses that to pick one station. | A radio dial and several stations playing at once. | Turn the dial (the capacitor) slowly. | When the circuit's ring matches a station, that station comes in loud and clear and the others fade. | Spinning the dial fast: snatches of music and static. | Two stations close together | Bird |
| PCE-14 | `SWITCH ON!` | Current through a coil rises slowly, while a plain lamp lights at once. | Two lamps on one switch: one in series with a big coil. | Flip the switch on, then off, then on. | The plain lamp lights instantly; the coil's lamp glows up slowly. | Flicking the switch on and off fast: the coil's lamp never gets bright before it is switched off again. | A bigger coil lags more | Owl |

## University Physics Volume 1 (OpenStax: mechanics, sound, oscillations, waves)

Source: OpenStax, University Physics Volume 1 (Ling, Sanny, Moebs; first published 2016-09-19, updated 2026-06-11). The 17 chapter titles were read from the table of contents embedded in the book's own page at openstax.org/books/university-physics-volume-1 and are all verified. Chapters 1 to 15 cover the same physics as AP Physics 1 and C: Mechanics, so many chapters are cross-references; the new games cover what the AP courses leave out (scaling, gears, gyroscopes, ladders, materials, siphons, thunder and noise).

### Chapter 1: Units and Measurement

Why it matters: knowing how things change when they are scaled up explains why model bridges and toy robots behave differently from full-size ones.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP1-01 | `SCALE UP!` | When a thing is made bigger, its weight grows much faster than its strength. | An ant lifting a crumb far heavier than itself. | Drag the size slider to grow the ant. | As it grows, its weight swells much faster than its legs thicken; at elephant size it needs elephant legs. | Growing it huge with thin ant legs: the legs buckle and the giant ant sits down with a thump. | Shrink an elephant to ant size: it could leap | Ant |
| — | `ZOOM OUT!` | See PP-01 to PP-07 for sizes, prefixes, estimates and measurement. | | | | | | |

### Chapter 2: Vectors

Why it matters: forces, velocities and winds are arrows that add tip to tail, which is how navigation, cranes and game physics work.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP1-02 | `TOW!` | Pulls add up tip to tail into one total pull. | A ship must pass through a harbour mouth; three tugboats pull it with ropes. | Drag one tug to change the direction of its rope. | The three pull arrows chain tip to tail; when the total arrow points at the harbour mouth, the ship glides through. | Pulling all three in different directions: the arrows go round in a triangle, the total is zero, and the ship sits still while the tugs churn. | A crosswind adds a fourth arrow | Duck |

### Chapter 3: Motion Along a Straight Line

Why it matters: speed and acceleration along a line are what speedometers, phone step counters and train timetables measure.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | `RACE!` | See PMS-02, PHS-04, PHS-05, AP1-05, PCM-01 and PCM-02 for speed, acceleration and motion graphs. | | | | | | |

### Chapter 4: Motion in Two and Three Dimensions

Why it matters: projectiles, crosswinds, river crossings and circular motion are everyday problems in sport, aviation and vehicle design.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | `FIRE!` | See AP1-01 to AP1-04 and PHS-01 for projectiles, relative motion and circles. | | | | | | |

### Chapter 5: Newton's Laws of Motion

Why it matters: a nearly flat cable or washing line must pull enormously hard to hold up even a small weight, which riggers and climbers must know.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP1-03 | `HANG SIGN!` | A rope pulled nearly flat must pull very hard to hold up a weight. | A shop sign hanging from two ropes tied to two posts; each rope has a strain meter. | Slide the posts apart. | As the ropes flatten, their strain meters climb fast; stop while they are still green. | Pulling the ropes almost flat: they snap and the sign lands on a passing rabbit's toes. | A heavier sign | Owl |
| — | `SLIDE!` | See PMS-01, PMS-03 to PMS-06, PHS-03, PHS-07 and PHS-08 for Newton's laws. | | | | | | |

### Chapter 6: Applications of Newton's Laws

Why it matters: friction, drag and turning decide tyre grip, conveyor design and how fast a car can take a curve.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | `CORNER!` | See AP1-06 to AP1-11, PCM-03 and PCM-04 for friction, drag and circular motion. | | | | | | |

### Chapter 7: Work and Kinetic Energy

Why it matters: work done by a force is how engineers account for every joule a motor or a muscle delivers.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | `PULL LOW!` | See AP1-14, AP1-17 and PCM-06. | | | | | | |

### Chapter 8: Potential Energy and Conservation of Energy

Why it matters: energy conservation is the quickest check on any machine, ride or simulation.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | `SKATE!` | See PMS-14, PHS-21, AP1-15, AP1-16 and PCM-05. | | | | | | |

### Chapter 9: Linear Momentum and Collisions

Why it matters: rockets, jet engines and even garden hoses move by throwing mass one way to go the other.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP1-04 | `THRUST!` | A rocket speeds up by throwing exhaust out of the back, and dropping empty tanks helps it go faster. | A rocket with two fuel tanks, and a far planet. | Mash to fire; swipe to drop each tank when it is empty. | Every burst of exhaust shoots back and the rocket shoots forward; dropping the empty tank, it speeds up even more. | Keeping the empty tanks: the rocket lugs them along and runs out of fuel short of the planet. | Three tanks | Bird |
| — | `BUMP!` | See PMS-04, PMS-06, PHS-09 to PHS-12 and AP1-18 to AP1-21. | | | | | | |

### Chapter 10: Fixed-Axis Rotation

Why it matters: bike gears, car gearboxes and power tools trade speed for turning force.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP1-05 | `SHIFT!` | A big rear gear turns the wheel more slowly but with more force, which helps up hills. | A bike at the bottom of a steep hill; gear buttons. | Tap to shift to a bigger rear gear before the climb. | The pedals turn easily and the bike creeps up and over. | Staying in the small gear: the rabbit stands on the pedals, stalls and topples over sideways. | Shift back down for the flat | Rabbit |
| — | `LOOSEN!` | See AP1-22 to AP1-25, PCM-08 and PCM-09. | | | | | | |

### Chapter 11: Angular Momentum

Why it matters: gyroscopes keep phones, drones and satellites pointing the right way, and spinning tops and bikes stay up for the same reason.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP1-06 | `SPIN TOP!` | A fast-spinning top stays upright and circles instead of falling over. | A top on a table. | Mash to spin it up, then let go. | Spun fast, it stays upright and its tip traces slow circles. | A weak spin: it wobbles, falls over and rolls off the table. | Keep it up on a tilted table | Hedgehog |
| — | `PULL IN!` | See AP1-26, AP1-27, PCM-10 and PCM-11. | | | | | | |

### Chapter 12: Static Equilibrium and Elasticity

Why it matters: builders, riggers and engineers check that ladders, shelves, beams and cables neither tip, slip, bend nor break, with a margin to spare.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP1-07 | `LEAN!` | A ladder slips if its foot is too far from the wall. | A ladder against a wall; a beaver must climb to a window. | Drag the ladder's foot out from the wall, then the beaver climbs. | At a steep, safe angle, the floor's grip holds and the beaver climbs in. | Foot too far out: the ladder slides down the wall and the beaver ends up lying on it. | A slippery floor | Beaver |
| UP1-08 | `PULL!` | Materials spring back up to a limit, then stay bent, then break. | A metal wire and a pull handle; the wire's shape is shown on a graph. | Pull, and release before the wire stays stretched. | Below the limit it springs back like new. | Pulling past the limit: it stays long and floppy; farther, it snaps with a twang. | Rubber stretches far but springs back | Owl |
| UP1-09 | `BRACE!` | Engineers build things several times stronger than the heaviest expected load (a safety margin). | A shelf with books piling on; a thin bracket and a thick bracket. | Swap brackets so the shelf still has plenty of strength to spare when full. | The strength bar of the thick bracket stays far above the load bar and the shelf holds. | The thin bracket: it holds the first books, bends with the last one, and the books slide onto the cat. | A surprise heavy dictionary | Beaver |

### Chapter 13: Gravitation

Why it matters: satellite orbits, launch planning and tides follow from gravity weakening with distance.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP1-10 | `DROP IN!` **[TRIMMED]** | Gravity weakens toward the centre of a planet, so a fall through a tunnel would swing back and forth. | A tunnel straight through a planet; a rabbit at the top. | Drop the rabbit in. | It speeds up to the middle, slows, pops out on the far side, and falls back again and again. | Dropping it into a hole that stops halfway: bonk. | A tunnel off-centre | Rabbit |
| — | `THROW!` | See PMS-07, PMS-12, PHS-14 to PHS-17, AP1-29, PCM-11 and PCM-12. | | | | | | |

### Chapter 14: Fluid Mechanics

Why it matters: siphons drain tanks and aquariums, and plumbing, hydraulics and ships use pressure and buoyancy.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP1-11 | `SIPHON!` | A siphon empties a tank only if the outlet is lower than the water in the tank. | A full fish tank to empty into a bucket, and a tube. | Drag the tube's free end down below the tank. | Once the outlet is lower, water climbs over the rim and pours steadily into the bucket. | Holding the outlet above the tank's water: it stops and dribbles back. | Empty it without sucking up the fish | Duck |
| — | `SNOWSHOE!` | See AP1-35 to AP1-41. | | | | | | |

### Chapter 15: Oscillations

Why it matters: suspensions, clocks, buildings in earthquakes and loudspeakers are oscillators that engineers tune and damp.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | `PUMP!` | See AP1-30 to AP1-34, PMS-21 and PCM-13 for rhythm, resonance and damping. | | | | | | |

### Chapter 16: Waves

Why it matters: tuning instruments, cables and strings, and sending signals along wires, depend on how fast a wave runs along them.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP1-12 | `TIGHTEN!` | A tighter string carries waves faster. | A long rope with a bell at the far end; a drumbeat. | Turn the peg to tighten, then flick the rope. | The pulse races along the tighter rope and rings the bell on the beat. | Leaving it slack: the pulse wobbles along and arrives late. | A heavier rope | Frog |

### Chapter 17: Sound

Why it matters: noise limits at work, hearing protection, sonar, room acoustics and speaker design depend on how sound travels and how loudness adds up.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP1-13 | `COUNT!` | Light arrives almost at once, but sound takes about three seconds to travel each kilometre. | A storm on the horizon; lightning flashes, then thunder rolls. | Tap at the flash, then tap again at the thunder. | The gap between your taps grows as the storm is farther away; a little map shows the storm's distance. | Tapping the thunder at the flash: the thunder rumbles in later anyway. | The storm comes closer | Owl |
| UP1-14 | `COVER EARS!` | Each step up the decibel scale is many times more sound; loud sound damages hearing. | A concert; the sound level climbs. | Drag ear defenders onto the rabbit before the level reaches red. | The sound bars stack up, each step ten times the one before; with defenders on, the rabbit dances safely. | Too late: its ears ring with stars. | A drill on a building site | Rabbit |
| — | `WHOOSH!` | See AP2-32 to AP2-35 and PMS-18 to PMS-21 for pitch, loudness, Doppler and resonance. | | | | | | |

## University Physics Volume 2 (OpenStax: thermodynamics, electricity and magnetism)

Source: OpenStax, University Physics Volume 2 (Ling, Moebs, Sanny; first published 2016-10-06, updated 2026-06-11). The 16 chapter titles were read from the table of contents embedded in the book's own page and are all verified. Chapters 5 to 14 overlap AP Physics 2 and C: Electricity and Magnetism and are mostly cross-references.

### Chapter 1: Temperature and Heat

Why it matters: bridges, rails and pipes need room to expand; cooking, de-icing and climate control depend on melting and the three ways heat moves.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP2-01 | `MIND THE GAP!` | Things expand when heated, so bridges need gaps. | A bridge in winter with a small gap at one end; summer is coming. | Drag the gap wider before summer arrives. | In the heat the bridge grows and closes the gap neatly. | Leaving no gap: the bridge buckles into a hump and a car bounces over it. | A railway line | Beaver |
| UP2-02 | `THAW!` | While ice melts, the heat goes into melting, so the temperature stays flat until it is all water. | A pot of ice on a stove; a thermometer. | Hold the heat on; tap when the thermometer starts climbing again. | The thermometer stays put while the ice melts, then climbs once the last cube is gone. | Tapping while ice is left: the penguin's iced tea still has a cube in it. | Boiling: a second flat part | Penguin |
| UP2-03 | `WARM ME!` | Heat moves by touch (conduction), by moving air or water (convection) and by glowing rays (radiation). | A cold penguin and three heaters: a warm stone to sit on, a fan heater, a glowing lamp. | Drag the penguin to each heater in turn until it is warm all over. | Its body glows warm where each kind of heat reaches it: underneath from the stone, all round from the fan, on the facing side from the lamp. | Standing behind the lamp: no rays reach it and it shivers. | Warm it with only two heaters | Penguin |

### Chapter 2: The Kinetic Theory of Gases

Why it matters: helium leaks from balloons and tanks faster than air because light molecules move faster at the same temperature.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP2-04 | `LEAK!` | At the same temperature, light gas particles move faster than heavy ones. | Two balloons, one of helium and one of air, with tiny holes. | Poke a hole in each and race them to empty. | The helium particles zip about faster, escape sooner, and the helium balloon shrinks first. | Poking only the air balloon: the helium balloon floats off with a giggle. | Heat one balloon to speed it up | Bird |
| — | `HEAT!` | See AP2-01 and AP2-02 for pressure and temperature. | | | | | | |

### Chapter 3: The First Law of Thermodynamics

Why it matters: pumps, spray cans, engines and refrigerators all heat or cool gas by squeezing it or letting it expand.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP2-05 | `FROST!` | A gas that expands quickly cools down. | A spray can and a hot day. | Hold to spray. | The can turns cold and frosty as the gas inside expands. | Spraying in short bursts: the can stays warm, so no frost. | Make frost appear on the can | Fox |
| — | `COMPRESS!` | See AP2-03. | | | | | | |

### Chapter 4: The Second Law of Thermodynamics

Why it matters: fridges, heat pumps and air conditioners move heat from cold to hot, which only happens when they are given work.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP2-06 | `CHILL OUT!` | A fridge moves heat from its cold inside to the warm kitchen, but only while its pump runs. | A fridge full of melting ice cream. | Hold to run the pump. | Heat arrows flow out of the fridge to the coils at the back, against the usual direction; the ice cream freezes. | Opening the fridge door to cool the kitchen: the kitchen gets warmer and the ice cream melts. | A hotter kitchen | Penguin |
| — | `RUN!` | See AP2-04 and AP2-05 for entropy and engines. | | | | | | |

### Chapter 5: Electric Charges and Fields

Why it matters: microwave ovens heat food by twisting water molecules back and forth with an electric field.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP2-07 | `MICROWAVE!` | Water molecules twist back and forth in a flipping electric field, and that heats food. | A bowl of soup in a microwave; water molecules shown as tiny two-ended magnets. | Tap in rhythm to flip the field. | The molecules twist back and forth, jostle and heat the soup until it steams. | Tapping slowly: the molecules turn lazily and the soup stays cold. | A plate of dry crackers barely warms | Owl |
| — | `HOVER!` | See AP2-07 to AP2-09. | | | | | | |

### Chapters 6 to 8: Gauss's Law, Electric Potential, Capacitance

Why it matters: shielding, voltage maps and capacitors are daily tools in electronics design.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | `SURROUND!` | See PCE-01 to PCE-07 and AP2-10, AP2-11, AP2-17. | | | | | | |

### Chapter 9: Current and Resistance

Why it matters: electrons drift slowly but the push travels at nearly light speed, which is why lights come on at once; superconductors carry current with no loss in MRI magnets.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP2-08 | `PUSH THROUGH!` | In a wire, electrons crawl, but the push passes along almost instantly. | A tube packed end to end with marbles (electrons); a bulb at the far end. | Push one marble in at the near end. | One marble pops out at the far end at once and the bulb lights, though each marble moved only a tiny step. | Pushing into an empty tube: the marble rolls slowly all the way and the bulb waits. | A longer tube | Ant |
| UP2-09 | `FREEZE!` | Some materials lose all resistance when cooled enough (superconductors). | A wire with a resistance meter, and a magnet resting on a disc. | Hold to pour cold liquid over the disc. | At a sharp point the resistance falls to zero and the magnet lifts and floats above the disc. | Stopping just short: the magnet sits there and the frog taps it. | Spin the floating magnet | Frog |

### Chapter 10: Direct-Current Circuits

Why it matters: house wiring puts every outlet on its own branch so each gets the full voltage.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP2-10 | `WIRE UP!` | Outlets in a house are wired side by side, so each gets the full voltage. | A house with three outlets and two main wires. | Drag each outlet's wires to the two main wires. | Each outlet gets its own branch and every lamp plugged in glows brightly. | Chaining the outlets one after another: every lamp glows dim and the toaster won't toast. | Add a switch that controls only one outlet | Beaver |
| — | `SHORT!` | See AP2-12 to AP2-16, PCE-08 and PP-16 to PP-18. | | | | | | |

### Chapters 11 and 12: Magnetic Forces and Fields; Sources of Magnetic Fields

Why it matters: motors, speakers, MRI magnets and mass spectrometers use magnetic forces on currents and the fields that currents make.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | `FLIP!` | See AP2-19, AP2-20, AP2-24, AP2-25, PCE-09 to PCE-11. | | | | | | |

### Chapter 13: Electromagnetic Induction

Why it matters: induction hobs, wireless chargers and metal detectors make currents in metal without touching it.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP2-11 | `COOK!` | An induction hob heats metal pans by making currents flow inside them. | An induction hob, a steel pan of soup and a glass bowl of soup. | Drag a pan onto the hob and switch it on. | Swirling currents glow inside the steel pan and the soup bubbles. | The glass bowl: no currents can flow in glass and the soup stays cold. | An aluminium pan barely warms | Fox |
| — | `PLUNGE!` | See PHS-28, PHS-29, AP2-21 to AP2-23. | | | | | | |

### Chapter 14: Inductance

Why it matters: coils in power supplies and radios store energy in their magnetic field and resist sudden changes in current.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | `SNAP!` | See PCE-12 to PCE-14. | | | | | | |

### Chapter 15: Alternating-Current Circuits

Why it matters: the mains supply is alternating current, which is easy to step up and down with transformers for long-distance power lines.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP2-12 | `WIGGLE!` | In alternating current, the charges jiggle back and forth instead of flowing round, and a bulb still lights. | A bulb circuit with ants flowing round; a switch from "DC" to "AC". | Flip to AC. | The ants stop flowing round and jiggle back and forth in place; the bulb flickers very fast and still glows. | Plugging a battery-only toy into the AC: its motor buzzes back and forth instead of spinning. | Step it up with a transformer, which works only with AC | Ant |

### Chapter 16: Electromagnetic Waves

Why it matters: every radio, phone and wifi link sends energy by shaking charges in one aerial and catching the ripple in another.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP2-13 | `WAVE!` | Shaking a charge sends out a ripple of electric and magnetic field: a light or radio wave. | A charge on an aerial; another aerial far away with a sleeping bird on it. | Swipe the charge up and down. | Ripples of field spread out at light speed; the far aerial's charge starts to jiggle and the bird wakes. | Holding the charge still: no ripple, and the bird sleeps on. | Shake faster: the ripples get shorter | Bird |
| — | `TUNE IN!` | See PHS-31 to PHS-33. | | | | | | |

## Quantum physics: what a newcomer and a working engineer need

Source: not a single published course. The owner asked for the quantum ideas that matter most to a newcomer and in real work, in this order: photons and the photoelectric effect; energy levels, spectra, LEDs and lasers; wave–particle duality and the double slit; uncertainty; superposition and measurement; tunnelling and transistors; spin and MRI; entanglement and the basics of quantum computing (qubits, gates, and why a quantum computer is not simply a faster computer). The topics match OpenStax University Physics volume 3, chapters 6 to 9 (verified chapter titles below), where those chapters cross-reference this course.

### Unit 1: Light comes in packets

Why it matters: camera sensors, solar cells and the light meters in phones count light packet by packet.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| QP-01 | `DIM!` | Very dim light arrives as single packets (photons), one dot at a time. | A lamp shining on a screen, with a brightness dial. | Turn the lamp down and down. | The smooth glow breaks up into single dots landing one by one, each a whole photon. | Turning it up instead: the screen glows white and the owl shades its eyes. | Count photons arriving in one second | Owl |
| — | `KNOCK OUT!` | See AP2-40 (the photoelectric effect) and PHS-33. | | | | | | |

### Unit 2: Energy levels, spectra, LEDs and lasers

Why it matters: LEDs, lasers, neon signs and the chemical analysis of stars and samples all come from electrons jumping between fixed energy levels.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| QP-02 | `GLOW BLUE!` | An LED's colour is set by the size of the energy drop its electrons make: a bigger drop gives bluer light. | An LED that glows red; the size of its energy gap is drawn as a step. | Drag the step taller. | As the step grows, each electron falls farther and the light turns orange, green and then blue. | Shrinking the step: the LED glows infrared, invisible, and the frog thinks it is broken. | Make white light by mixing | Frog |
| QP-03 | `LASE!` | In a laser, one photon makes excited atoms release identical photons, all in step. | A row of atoms between two mirrors. | Mash to pump the atoms up to their high level, then tap to release one photon. | The photon passes an excited atom and copies of itself cascade out, all in step, bouncing between the mirrors into a beam. | Releasing before pumping: the photon passes sleepy atoms and fizzles out. | Keep the beam on by pumping in rhythm | Owl |
| QP-04 | `REVEAL!` | Fluorescent things soak up invisible ultraviolet light and give out visible colours of lower energy. | A dark room, a blank-looking poster and an ultraviolet torch. | Sweep the torch over the poster. | A hidden glowing message appears wherever the light lands. | Using an ordinary torch: the poster stays blank. | Find the secret mark on a banknote | Fox |
| — | `DROP DOWN!` | See AP2-41. | | | | | | |

### Unit 3: Wave–particle duality

Why it matters: electron microscopes, and the design of every modern chip, depend on particles that travel as waves.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| QP-05 | `FIRE ONE!` | Single electrons sent through two slits build up a striped pattern, as waves would. | An electron gun, a wall with two slits and a screen. | Tap to fire electrons one at a time. | Each electron lands as one dot, but the dots slowly build up bright and dark stripes. | Firing at only one slit (covering the other): the dots pile into one plain blob. | Fire faster to build the stripes in time | Ant |
| QP-06 | `PEEK!` | Checking which slit each electron goes through wipes out the stripes. | The same two-slit set-up with stripes building up, and a little detector. | Drag the detector next to the slits. | The moment you watch which slit is used, the stripes fade into two plain blobs. | Leaving the detector on and firing longer: still two blobs, and the ant scratches its head. | Remove the detector: the stripes come back | Ant |

### Unit 4: Uncertainty

Why it matters: the uncertainty principle limits how small transistors can be made and sets the "fuzz" in atomic clocks and sensors.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| QP-07 | `SQUEEZE!` | The more tightly you pin down where a particle is, the more spread out its motion becomes. | A beam of particles through an adjustable slit onto a screen. | Narrow the slit. | At first the spot shrinks; then, as the slit gets very narrow, the spot spreads out wider and wider. | Narrowing to almost nothing: the spot smears across the whole screen. | Find the width that gives the smallest spot | Owl |

### Unit 5: Superposition and measurement

Why it matters: every quantum sensor and quantum computer depends on states that are a mix of two outcomes until they are measured.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| QP-08 | `MEASURE!` | A qubit can point between "up" and "down"; measuring it snaps it to one, at random. | A qubit drawn as an arrow pointing sideways, halfway between up and down; a tally. | Tap to measure, again and again (each tap uses a fresh, identical qubit). | Each tap snaps the arrow up or down at random; the tally fills about half and half. | Measuring the same qubit twice: after the first snap it stays where it landed. | Tilt the arrow toward up first: the tally leans to up | Octopus |

### Unit 6: Tunnelling and transistors

Why it matters: flash memory, tunnelling microscopes and the transistors in every chip depend on electrons crossing barriers and being switched on and off by a voltage.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| QP-09 | `TUNNEL!` | A particle can sometimes pass through a barrier too high for it to climb, more often when the barrier is thin. | Electrons bouncing off a wall; a few appear on the far side. | Drag the wall thinner. | As it thins, more and more electrons appear on the far side and the counter there climbs. | Making the wall thicker: none get through and a lone electron sulks. | A taller wall | Frog |
| QP-10 | `SWITCH!` | A transistor is a switch: a small voltage on its gate lets current flow through. | A transistor drawn as a channel with a gate; an LED; a blink pattern to copy. | Tap the gate on and off in the pattern. | Each tap opens the channel, the current flows and the LED blinks. | Tapping the LED itself: nothing happens, because the gate controls the flow. | Two transistors make a logic gate | Ant |

### Unit 7: Spin and MRI

Why it matters: MRI scanners image the body by tipping the spins of hydrogen nuclei and listening as they relax.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| QP-11 | `TIP!` | In MRI, spinning nuclei line up in a magnet, are tipped by radio pulses in time with their wobble, and give out a signal as they relax. | Many tiny spinning tops (nuclei) lined up in a big magnet; a radio pulse button. | Tap the pulse in time with the tops' wobble. | In-time pulses tip them over together; when you stop, they swing back, and a picture builds up from the signal. | Tapping off-beat: the tops barely tip and the picture stays blank. | Image a hidden shape | Owl |

### Unit 8: Entanglement and quantum computing

Why it matters: quantum computers are expected to help with simulating molecules and materials and with some codes, and entangled photons already carry secure keys in quantum key distribution.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| QP-12 | `UNBOX!` | Entangled pairs give linked results, even far apart, but each result alone looks random, so no message is sent. | Pairs of sealed boxes; one box of each pair goes to the fox, the other to the rabbit, far away. | Tap to open pairs of boxes. | Each box alone is red or blue at random, but every time the fox gets red, the rabbit's box is blue. | Trying to send "red" by wishing: the fox's results are still random and the rabbit learns nothing. | Measure at different angles: the link weakens | Fox and rabbit |
| QP-13 | `ROTATE!` | Quantum gates turn the qubit's arrow; a program is a sequence of turns. | A qubit arrow and a target direction; gate tiles: flip, quarter turn, half turn. | Drag gates onto the qubit's track until the arrow points at the target. | Each gate turns the arrow as you watch, and it lands on the target. | Using flip on an arrow pointing sideways: nothing happens, and the octopus shrugs. | A target that needs three gates | Octopus |
| QP-14 | `CANCEL!` | A quantum computer wins by making wrong answers cancel out and right answers add up, not by trying every answer faster. | Light waves along paths to several answer boxes; one box is the right answer. | Turn the phase dial on one path. | Waves to the wrong boxes meet crest to trough and cancel; the right box glows brighter. | Turning the dial at random: all the boxes glow dimly, as if guessing. | More boxes | Owl |
| QP-15 | `KEEP QUIET!` | Qubits lose their quantum state when the outside world bumps into them, so they are kept cold and isolated. | A qubit arrow in a cold box; heat particles and vibrations try to get in. | Swipe away the bumps before they reach the qubit. | The arrow stays sharp and its program finishes. | Letting a bump through: the arrow blurs into a fuzzy ball. | Colder box, faster bumps | Penguin |

## University Physics Volume 3 (OpenStax: optics and modern physics)

Source: OpenStax, University Physics Volume 3 (Ling, Sanny, Moebs; first published 2016-09-29, updated 2026-06-11). The 11 chapter titles were read from the table of contents embedded in the book's own page and are all verified. Chapters 6 and 7 are covered by the Quantum physics course above. Chapter 11 also includes cosmology; the games here are about its physics (gravity, light and expansion). Stellar life cycles, astrophysics and the history of the universe are in the astronomy (Earth and space) file.

### Chapter 1: The Nature of Light

Why it matters: polarising sunglasses, camera filters and phone screens use polarised light; prisms and spectrometers split light by colour.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP3-01 | `CUT GLARE!` | Polarising sunglasses block glare reflected off water. | Glare off a lake hides a fish under the surface. | Turn the sunglasses. | At the right angle the glare fades and the fish appears. | Turning them the wrong way: the glare grows blinding and the bird squints. | Two filters at right angles block all light | Bird |
| UP3-02 | `FAN OUT!` | A prism bends each colour by a different amount, red least and violet most. | A beam of white light, a prism and a canvas. | Turn the prism. | The beam fans into a rainbow that lands on the canvas, red at the top. | Turning it edge-on: the light passes as a white streak. | Put green on a target spot | Owl |

### Chapter 2: Geometric Optics and Image Formation

Why it matters: glasses, contact lenses, cameras and telescopes put images in the right place with lenses.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP3-03 | `FIX EYES!` | Glasses move the image onto the back of the eye: one lens shape for near-sighted eyes, another for far-sighted. | An eye drawn from the side, with the image of a distant tree landing in front of the back of the eye; two lenses. | Drag a lens in front of the eye. | The right lens moves the image back onto the retina and the blurry tree turns sharp. | The wrong lens: the image moves even farther off and the tree turns to soup. | A far-sighted eye | Owl |
| UP3-04 | `SPY!` | Two lenses together make a telescope. | A ship far out at sea; a tube with two lenses. | Slide the eyepiece until the ship is sharp. | The ship fills the view, clear enough to read its flag. | Looking through the wrong end: the ship shrinks to a speck. | Find a second ship | Bird |
| — | `FOCUS!` | See AP2-26 to AP2-31. | | | | | | |

### Chapter 3: Interference

Why it matters: interferometers measure distances smaller than a wavelength of light, from engineering parts to the gravitational-wave detectors.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP3-05 | `NUDGE!` | Light waves can measure distances far smaller than a hair. | Light split into two paths that rejoin on a screen of stripes. | Nudge one mirror a tiny bit. | The stripes march across the screen; each stripe passed means the mirror moved a fraction of a wavelength. | Bumping the table: the stripes jitter wildly and the ant holds its breath. | Count the stripes as the mirror creeps | Ant |
| — | `BUBBLE!` | See AP2-36 to AP2-38. | | | | | | |

### Chapter 4: Diffraction

Why it matters: the size of a lens limits how finely a camera, telescope or eye can see detail.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP3-06 | `RESOLVE!` | A wider lens can tell apart two lights that a small one blurs into one. | Two headlights far away look like one blob through a small lens. | Drag the lens wider. | The blob splits into two separate lights. | Squinting (narrowing the opening): the blob spreads even wider. | Three lights in a row | Owl |
| — | `SQUEEZE!` | See QP-07 (a narrow gap spreads light) and AP2-39. | | | | | | |

### Chapter 5: Relativity

Why it matters: GPS satellites' clocks must be corrected for relativity, or the map dot would drift kilometres every day.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP3-07 | `SPEED UP!` | A clock moving very fast ticks slowly compared with one at rest. | Two twin rabbits with light clocks: one on Earth, one on a ship. | Slide the ship's speed up toward light speed. | The ship's clock light zigzags on a longer path, so it ticks slower; when the ship returns, its rabbit is younger. | Riding at bicycle speed: the clocks stay together and the twins look disappointed. | The ship also looks shorter along its motion | Rabbit |
| UP3-08 | `CHASE!` | Nothing with mass can reach the speed of light, however hard it is pushed. | A rocket chasing a beam of light. | Mash to fire the engines. | The rocket speeds up quickly at first, then gains less and less; its speed creeps toward the beam's but never reaches it. | Mashing even harder near the end: the speed needle barely twitches. | A heavier rocket | Bird |
| UP3-09 | `CORRECT!` | GPS clocks on satellites run at a slightly different rate, so they must be corrected. | A car on a map using GPS; the dot drifts off the road. | Tap the satellite clock's correction when the dot drifts. | Corrected, the dot snaps back onto the road. | Ignoring it: the dot drives through a lake while the car sits on the road. | Several satellites at once | Fox |
| UP3-10 | `CONVERT!` | A tiny mass can turn into an enormous amount of energy (E = mc²). | A raisin-sized speck of mass on a scale; a dark city. | Drag the speck into the converter. | The speck disappears and the energy bar lights a small city for a day. | Burning the raisin instead: it lights one bulb for a moment. | Show how little mass the Sun turns to light each second (still huge) | Owl |

### Chapter 6: Photons and Matter Waves

Why it matters: X-ray imaging and solar cells depend on photons behaving as particles that carry energy and push.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP3-11 | `SCATTER!` | An X-ray photon bouncing off an electron gives it some energy and comes out redder (with a longer wavelength); the bigger the turn, the redder. | An X-ray photon heading for an electron; detectors placed round about. | Aim the photon so it bounces into a far detector. | The more it turns, the more energy it hands to the electron and the redder it comes out. | Aiming straight past: the photon flies on unchanged. | Hit a detector right behind the electron | Ant |
| — | `DIM!` | See QP-01 to QP-06 and AP2-40 to AP2-42. | | | | | | |

### Chapter 7: Quantum Mechanics

Why it matters: quantum dots in TV screens get their colours from how small the box is that traps their electrons.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP3-12 | `SHRINK BOX!` | An electron trapped in a smaller box has bigger energy steps, so a smaller quantum dot glows bluer. | A quantum dot drawn as a box with an electron wave inside; it glows red. | Drag the box smaller. | Only whole half-waves fit; as the box shrinks the waves shorten, the energy steps grow and the glow shifts to green, then blue. | Making it bigger: the glow slides into dull infrared. | Make it glow exactly green | Frog |
| — | `TUNNEL!` | See QP-07 to QP-15. | | | | | | |

### Chapter 8: Atomic Structure

Why it matters: atoms are mostly empty space with a tiny nucleus, and each element's colours of light are a barcode used to identify materials and stars.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP3-13 | `ZOOM IN!` | An atom is mostly empty space: the nucleus is tiny compared with the electron cloud. | An atom the size of a stadium, drawn as a fuzzy electron cloud. | Pinch to zoom toward the centre. | You zoom and zoom through empty space until the nucleus appears, the size of a pea in the middle of the stadium. | Stopping too early: nothing but empty space, and the ant waves from the cloud's edge. | Count how many electrons the cloud has | Ant |
| UP3-14 | `BUMP UP!` | Bump an electron up to a higher level and it drops back with a flash of one exact colour. | An atom with an electron on its lowest level; a lamp. | Tap to bump the electron up a level. | It falls back with a flash of colour; each atom has its own set of colours. | Bumping it too hard: it flies off the atom altogether (ionised), and no flash comes. | Make a flash of a chosen colour | Frog |
| UP3-15 | `IDENTIFY!` | Every element glows with its own pattern of coloured lines, like a barcode. | A glowing gas lamp's line pattern and a shelf of element barcodes. | Drag the lamp's pattern onto the matching barcode. | The lines click into place and the element's name lights up. | Matching by one line only: the other lines do not match and the barcode buzzes. | A mix of two gases | Owl |

### Chapter 9: Condensed Matter Physics

Why it matters: semiconductors, diodes and solar cells are the basis of every electronic device and of solar power.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP3-16 | `DOPE!` | Adding a few atoms of another element to silicon gives it spare electrons that can carry current. | A grid of silicon atoms in which electrons are stuck; a dim bulb. | Drop a few phosphorus atoms into the grid. | Each one brings a spare electron that drifts freely, and the bulb brightens. | Dropping in too many: the crystal grid jumbles and it stops being a neat semiconductor. | Make the opposite kind with boron | Ant |
| UP3-17 | `ONE WAY!` | A diode lets current through in one direction only. | A circuit with a bulb and a diode drawn as a one-way gate. | Turn the diode round until the bulb lights. | Facing the right way, the gate swings open and the ants flow. | Facing the wrong way: the ants pile up against the closed gate. | Turn alternating current into one-way current | Ant |
| UP3-18 | `HARVEST!` | In a solar cell, each photon frees an electron, and the junction inside sweeps it out into the wire. | A solar cell in sunlight wired to a fan. | Tilt the cell toward the sun. | Photons free electrons, the junction pushes them into the wire, and the fan spins. | Covering the cell: no photons, no electrons, the fan stops. | A cloudy day | Bird |

### Chapter 10: Nuclear Physics

Why it matters: radiocarbon dating, nuclear medicine and radiation safety use how nuclei decay and how radiation weakens with distance.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP3-19 | `STEP BACK!` | Radiation from a source falls off quickly with distance: twice as far gets a quarter as much. | A worker near a radioactive source with a dose meter in the red. | Drag the worker away from the source. | Each step back drops the meter much more than the one before, until it is green. | Stepping sideways round the source: the meter stays in the red. | Add a shield as well | Beaver |
| UP3-20 | `DATE!` | The less carbon-14 is left in a bone, the older it is. | An old bone with a carbon-14 meter, and a jar of hedgehog atoms. | Tap to run half-lives until the jar matches the bone's meter. | Each tap halves the curled hedgehogs; when they match, the bone's age appears. | Tapping too many times: the jar has fewer than the bone, so the bone looks older than it is. | A very old bone with almost none left | Hedgehog |
| UP3-21 | `GLUE!` | The strong force holds protons together in the nucleus, though their charges push them apart. | Protons in a nucleus pushing apart; strong-force springs can be added between neighbours. | Drag springs between the protons and neutrons. | The springs grab only very close neighbours and hold the nucleus together against the push. | Adding only protons, no neutrons: the push wins and the nucleus flies apart. | A big nucleus that needs extra neutrons | Hedgehog |
| — | `SHIELD!` | See PHS-35 to PHS-39 and AP2-43, AP2-44 for radiation, half-life, fission and fusion. | | | | | | |

### Chapter 11: Particle Physics and Cosmology

Why it matters: PET scanners use antimatter, particle accelerators make medical isotopes, and the physics of gravity and light explains what we see in the sky. (Stars and the history of the universe: see the astronomy file.)

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| UP3-22 | `BUILD PROTON!` | Protons and neutrons are made of quarks: two up and one down make a proton; one up and two down make a neutron. | A bag and a pile of up and down quarks; each quark's charge is a slice of a charge bar. | Drag three quarks into the bag to make a proton. | Two ups and a down fill the charge bar to one whole positive charge and the bag glows as a proton. | Three ups: the charge bar overfills and the bag pops. | Build a neutron (charge zero) | Octopus |
| UP3-23 | `MEET!` | When a particle meets its antiparticle, both vanish into a flash of light. | An electron and a positron (its antimatter twin) drifting apart. | Drag them together. | They meet and vanish in two flashes of light that fly off in opposite directions, as in a PET scanner. | Pushing two electrons together: they push each other away. | Find the hidden positron in a crowd | Owl |
| UP3-24 | `FLIP QUARK!` | The weak force can turn one kind of quark into another; that is what happens in beta decay. | A neutron drawn as a bag of one up quark and two down quarks; a nucleus that has too many neutrons. | Tap a down quark to flip it. | It turns into an up quark: the neutron becomes a proton, and an electron and a tiny neutrino shoot out of the nucleus. | Tapping an up quark in a lone proton: nothing happens, because a free proton is stable, and the quark yawns. | Find the one neutron in a big nucleus that is ready to flip | Owl |
| UP3-25 | `SMASH!` | Smashing particles together hard turns their energy into new particles, including rare heavy ones like the Higgs boson. | A ring-shaped collider with two protons racing in opposite directions; a detector around the crash point. | Swipe the two protons into each other as fast as you can. | They burst into a shower of other particles (electrons, muons, light, jets of quarks), each leaving its own kind of track; at the very highest speed, a rare Higgs boson flashes for an instant. | A gentle swipe: they bounce off each other and the detector stays dark. | Drag particles through a crowd (the Higgs field): heavy ones are slowed more, which is how the Higgs field gives them mass | Octopus |
| UP3-26 | `SPIN GALAXY!` | Galaxies spin too fast for the matter we can see; extra unseen mass (dark matter) holds them together. | A spinning galaxy flinging stars off its edge. | Drag an invisible halo of dark matter around the galaxy and stretch it. | With enough unseen mass, the outer stars stay in orbit and the galaxy spins steadily. | Adding only visible stars to the middle: the outer stars still fly off. | A galaxy cluster | Bird |
| UP3-27 | `EXPAND!` | Space is expanding, so far galaxies move apart, and the farther away, the faster. | Galaxies drawn on a rubber sheet. | Drag the sheet's edges outward. | Every galaxy moves away from every other; distant ones move apart faster; light crossing the sheet stretches redder. | Pushing galaxies by hand instead: they bump together and the sheet does not stretch. | Run it backward: everything was closer together long ago (see the astronomy file) | Owl |


---

## Suggested first build

These ten games teach big ideas with a strong "aha" in a few seconds, and between them they try out every core mechanic (a release into simulated motion, a slider with live sound, a build, a rhythm):

1. PHS-01 `SWING!` (let go and the ball flies off along the edge of the circle)
2. PMS-01 `SLIDE!` (a puck glides forever on ice and stops dead on sand)
3. PMS-21 `SHATTER!` (sing the glass's own note until it shatters; real audio)
4. PMS-07 `THROW!` (throw faster and faster until the ball falls all the way round the planet)
5. PMS-18 to PMS-20 `LOUDER!` / `HIGHER!` / `MATCH!` (drag a sound wave and hear it change)
6. AP1-33 `PUMP!` (push a swing in rhythm to send it high)
7. PE-16 `CLOSE!` (close the loop and the bulb lights)
8. AP1-01 `FIRE!` (a ball fired sideways lands with the one dropped)
9. QP-05 `FIRE ONE!` (single electrons build up stripes, as waves would)
10. PHS-36 `HALVE!` (a jar of atoms halves, step by step, at random)

## Self-review

The owner's rules changed several times while this file was drafted (concepts only, the thing itself, words before symbols, then the final verb-and-goal format with no questions). Each change was applied to the whole file, so every row now in the file was rewritten from scratch in the final format, and none of the earlier drafts' rows survive unchanged. The review against the four tests (interactive, obvious goal, clear, fun) then led to these specific rewrites:

- **Removed every question and calculation.** Earlier drafts had "Working" rows (plugging numbers into formulas) and "Predict" rows ("tap the ball that will knock down more blocks"). All were replaced by goals the player reaches by acting: for example the ball race became PE-15 `KNOCK DOWN!` (roll balls until the tower falls), and "which ball hits the ground first?" became AP1-01 `FIRE!` (fire as the penguin drops its snowball and watch them land together).
- **Replaced sorting quizzes with actions.** "Sort the forces" became UP3-24 `FLIP QUARK!` (the weak force, acted out) and UP3-21 `GLUE!` (the strong force); "pair the force arrows" became PHS-13 `ROW!`; sorting magnetic objects became PE-05 `FIND KEYS!`; ordering the spectrum became PHS-31 `TUNE IN!`.
- **Made every funny fail an action.** Fails that described a wrong belief ("expecting both lamps together") were rewritten as something the player does that goes wrong on screen: PCE-14 `SWITCH ON!`, PCM-11 `SWEEP!`, AP1-41 `JACK UP!`, AP2-43 `WEIGH PARTS!`, UP2-12 `WIGGLE!`, QP-06 `PEEK!`, UP3-07 `SPEED UP!`, PHS-36 `HALVE!`.
- **Made the goal visible.** PHS-14 `SPRAY!` now has a swatch to match, so the player knows when to stop moving the wall.
- **One command, one game.** Twenty-five games shared a command with another game (for example three `STRETCH!` games); each was given its own verb (`EXTEND!`, `PULL!`, `EXPAND!`).
- **Added the owner's requested games.** Centripetal force (PHS-01 `SWING!`, AP1-06 `CORNER!`, AP1-11 `WHIRL!`), motion on ice (PMS-01 `SLIDE!`, PMS-04 `PUSH OFF!`, PMS-06 `BUMP!`, PHS-02 `GLIDE!`), orbits (PMS-07 `THROW!`), the skate park (PMS-14 `SKATE!`), sound you can hear and resonance (PMS-18 to PMS-21, AP1-33 `PUMP!`, AP1-34 `STEADY!`, AP2-35 `RING!`), a quantum course (QP-01 to QP-15), and atoms, particles, forces, relativity and the large-scale universe (UP3-07 to UP3-27).

Misreading test on the concept sentences: each one was read alone, asking what a newcomer would believe from it. Sentences were tightened where they overstated: "twice as far gets a quarter as much" (UP3-19) is stated for a small source; "a person's steady power is about enough for one bright old-style bulb" (PP-09) says "about"; "a tiny mass can turn into an enormous amount of energy" (UP3-10) says "can", because only nuclear and particle reactions convert mass that way.

## Sources

**College Board (unit lists fetched)**
- AP Physics 1: Algebra-Based, course page: https://apcentral.collegeboard.org/courses/ap-physics-1
- AP Physics 2: Algebra-Based, course page: https://apcentral.collegeboard.org/courses/ap-physics-2
- AP Physics C: Mechanics, course page: https://apcentral.collegeboard.org/courses/ap-physics-c-mechanics
- AP Physics C: Electricity and Magnetism, course page: https://apcentral.collegeboard.org/courses/ap-physics-c-electricity-and-magnetism

**Khan Academy (course pages returned only "Client Challenge"; titles from these)**
- KA Blog, "Fresh Updates to Khan Academy's Physics Courses Bring More Rigor and Flexibility" (2025-08-18; the four middle school physics units): https://blog.khanacademy.org/fresh-updates-to-khan-academys-physics-courses-bring-more-rigor-and-flexibility
- KA Blog, "Introducing Khan Academy's NGSS-Aligned High School Biology and Physics Courses" (2024-08-08): https://blog.khanacademy.org/introducing-khan-academys-ngss-aligned-high-school-biology-and-physics-courses/
- KA Blog, "Everything You Need for Science Class—Free on Khan Academy" (2025-08-14; course list): https://blog.khanacademy.org/everything-you-need-for-science-class/
- Middle school physics unit slug, "Energy: Unit test": https://en.khanacademy.org/science/ms-physics/x1baed5db7c1bb50b:energy/test/x1baed5db7c1bb50b:energy-unit-test
- High school physics unit slugs from KA video descriptions and search results: …/highschool-physics/x6679aa2c65c01e53:motion-and-forces, …:force-pairs-and-momentum, …:gravitation, …:energy, …:electromagnetic-radiation (https://www.khanacademy.org/science/highschool-physics/x6679aa2c65c01e53:electromagnetic-radiation)
- Schoolhouse.world, "High School Physics Series" (links "Unit 4: Electrostatics", "Unit 5: Energy", "Unit 8: Nuclear physics"): https://schoolhouse.world/series/43059
- TechBloat, "Best Free Physics Videos" (2026-08-14; third-party list of the nine high school physics units): https://www.techbloat.com/the-ultimate-collection-of-free-physics-videos-organized-by-level-and-goal.html
- Classtime mirror of KA's older AP Physics 1 catalogue (not used for titles; shows the pre-2024 unit list): https://www.classtime.com/curriculum/c/khan-academy-khan-academy-(english---us-curriculum)-science--engineering-ap®︎-physics-1/5550

**OpenStax (chapter lists read from each book's embedded table of contents)**
- University Physics Volume 1: https://openstax.org/books/university-physics-volume-1/pages/preface
- University Physics Volume 2: https://openstax.org/books/university-physics-volume-2/pages/preface
- University Physics Volume 3: https://openstax.org/books/university-physics-volume-3/pages/preface

**NGSS (performance expectations fetched)**
- MS-PS2: https://www.nextgenscience.org/dci-arrangement/ms-ps2-motion-and-stability-forces-and-interactions
- MS-PS3: https://www.nextgenscience.org/dci-arrangement/ms-ps3-energy
- MS-PS4: https://www.nextgenscience.org/dci-arrangement/ms-ps4-waves-and-their-applications-technologies-information-transfer
- K-PS2: https://www.nextgenscience.org/dci-arrangement/k-ps2-motion-and-stability-forces-and-interactions
- K-PS3: https://www.nextgenscience.org/dci-arrangement/k-ps3-energy
- 1-PS4: https://www.nextgenscience.org/dci-arrangement/1-ps4-waves-and-their-applications-technologies-information-transfer
- 3-PS2: https://www.nextgenscience.org/dci-arrangement/3-ps2-motion-and-stability-forces-and-interactions
- 4-PS3: https://www.nextgenscience.org/dci-arrangement/4-ps3-energy
- 4-PS4: https://www.nextgenscience.org/dci-arrangement/4-ps4-waves-and-their-applications-technologies-information-transfer
- 2-PS1 and 5-PS2 were not fetched; their codes and topics (reversible changes from heating; gravity pulls down) are reconstructed from the NGSS numbering.
