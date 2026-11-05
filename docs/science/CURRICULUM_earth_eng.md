# Heurēka! microgame map: Earth and space science, and engineering

Compiled 2026-11-05 (agent s3). This file maps the units of Earth-and-space and engineering courses to microgames for Heurēka!, the science, engineering and business sibling of Q.E.D.! (see README.md in this folder). It uses the final Heurēka! microgame shape (the lead's heureka_format.md, November 2026).

## How to read this file

- **A microgame is a 3 to 6 second moment, not a question.** The game shouts one verb, the player does one action (tap, mash, hold, swipe, drag, aim, tilt, trace, or stop at the right moment), and something happens on screen that makes one idea visible. The idea is the reason the action works: the canyon gets deep only because the river keeps cutting; the bridge holds only because its members make triangles.
- **No questions.** Every game is a goal that the command names (DRESS!, HOIST!, TIP!), achieved by acting on the world, with an immediate physical result. No game asks the player to guess, predict or pick the right answer. Choosing between objects happens only as part of reaching the goal (grabbing the heavier rock because the light one did not tip the balance).
- **Failure is funny and shows the idea too.** The cold air dragged over the top just sinks back down; the tower built top-heavy topples into the sea.
- **No numbers to work out, no formulas, and no more than three words to read during play.** The card shown after the game says the idea in plain words. Sizes and amounts appear only as things the player can see: a bigger splash, a longer shadow, a fuller jar.
- **Level 2** makes the same action harder or adds one twist. It never adds a calculation.
- **Clear to a newcomer.** A young child who has never seen the topic should know what to do within a second and see what happened.
- **Courses are playlists.** Each course is a set of these moments that together cover the course's important ideas. Units keep the real course's structure and sources. Each unit's games are listed with the most useful idea first.
- **Unit names** come from real course outlines. The "Source:" line under each course says where each name was checked, which titles were verified on a fetched page, and which were reconstructed from memory.
- **Order.** Units are ordered by how much the ideas matter to people who work in the field or build real things, not in the textbook's order. The textbook's chapter or unit number is in square brackets after each unit title. **[ADDED]** marks practical topics the standard course skips (flood odds, reading a datasheet, tolerances, safety). **[SHORT]** marks units that are mostly exam or survey material.
- **Why it matters**: the italic line under each unit heading says where the idea is used in real work or projects.
- **Columns** (one row per microgame):
  - **ID**: a stable reference. EL = Elementary, MSE = middle school Earth and space, HES = high school Earth science, HE = History of the Earth, ES = AP Environmental Science, AS = astronomy, APH = astrophysics, HU = History of the universe, EM = engineering math and estimation, EE = electrical engineering, ME = mechanical and civil engineering, CE = chemical engineering, SC = signals and control.
  - **Command**: a verb the player does, one or two words, in capitals, ending in "!".
  - **Concept**: the one plain sentence the player comes to see.
  - **Scene**: what is on screen.
  - **Action**: the one thing the player does.
  - **What happens**: success, with the idea made visible.
  - **Funny fail**: the common wrong move, what goes comically wrong, and what that shows.
  - **Level 2**: the harder version or the twist.
  - **Host**: the animal in the game, from the cast (frog, ant, penguin, duck, turtle, octopus, owl, beaver, bird, rabbit, hedgehog, fox).
- **Story courses.** History of the Earth and History of the universe are told as a run of these moments in order. After each beat, a timeline bar fills in to show how long that step took, scaled so that the whole story is one day (Earth) or one year (the universe).
- **"See X"** means the idea was mapped earlier in this file or in a sibling file (the physics file's PP rows, the math app's rows such as G8-06). Rows whose ID cell is "—" are cross-references and are not counted.
- **Overlap.** Physics, chemistry and biology are mapped in parallel files in docs/science/. A row that another file probably also has ends its Concept cell with "(Overlap: physics)" or "(Overlap: chemistry)" so that the lead can keep one copy.

## Coverage summary

| Course | Units mapped | Microgames | Unit-list source |
|---|---|---|---|
| Elementary: Earth, sky and engineering design | 5 | 23 | NGSS K–5 Earth and space and engineering-design performance expectations; reconstructed from memory (nextgenscience.org refused the fetch) |
| Middle school Earth and space science | 5 | 27 | NGSS MS-ESS (all 15 performance expectations verified in the Alaska Department of Education copy); 4 KA unit labels seen in video breadcrumbs |
| High school Earth science | 13 (all 26 chapters) | 34 | Wikibooks / CK-12 "High School Earth Science" (26 of 26 chapter titles verified); NGSS HS-ESS (9 of 19 verified) |
| History of the Earth (story) | 5 | 16 | Geologic time scale dates (ICS chart, from memory, not fetched); HES chapter 12 |
| AP Environmental Science | 9 | 45 | College Board course overview (9 of 9 unit titles verified); topics from UWorld |
| Introductory astronomy | 13 (all 30 chapters) | 44 | OpenStax Astronomy 2e (30 of 30 chapter titles verified) |
| Astrophysics | 7 | 19 | The owner's topic list, taught from OpenStax Astronomy 2e chapters |
| History of the universe (story) | 3 | 13 | OpenStax Astronomy 2e chapter 29 and others; dates from memory |
| Engineering math and estimation | 5 | 12 | OpenStax University Physics 1 chapter 1 (7 of 7 sections verified); MIT RES.6-011 "The Art of Insight" (9 of 9 chapters verified) |
| Intro electrical engineering | 11 | 39 | KA topics via a static mirror; spinningnumbers.org sections (verified); MIT 6.002 calendar (25 of 25 lectures verified); 6.01SC units |
| Mechanical and civil engineering | 13 | 44 | Engineering Statics: Open and Interactive (10 of 10 chapters verified); MIT 2.001, 2.002, 2.005, 2.006 catalog descriptions (fetched) |
| Chemical engineering | 6 | 17 | Felder and Rousseau (12 of 12 chapter titles verified) |
| Signals and control | 5 | 15 | MIT 6.003 Fall 2011 (25 of 25 lectures verified); 6.01SC units |
| **Total** | **100** | **348** | |

Every unit has at least one microgame or a "See" cross-reference. Two units are cross-references only: HES Unit 6 (human actions, covered by AP Environmental Science) and EE Unit 11 (electrostatics, covered by the physics file). No row is marked [WEAK FIT].

## Course order

1. Elementary: Earth, sky and engineering design (NGSS K–5)
2. Middle school Earth and space science (NGSS MS-ESS; Khan Academy)
3. High school Earth science (CK-12 / Wikibooks "High School Earth Science"; NGSS HS-ESS)
4. History of the Earth (story course)
5. AP Environmental Science (College Board CED, 9 units)
6. Introductory astronomy (OpenStax Astronomy 2e, 30 chapters)
7. Astrophysics (stars, compact objects, distances, cosmology, exoplanets)
8. History of the universe (story course)
9. Engineering math and estimation (OpenStax University Physics 1, ch. 1; MIT "The Art of Insight")
10. Intro electrical engineering (Khan Academy; MIT OCW 6.002 and 6.01)
11. Mechanical and civil engineering (Engineering Statics: Open and Interactive; MIT 2.001, 2.005, 2.006)
12. Chemical engineering (Felder and Rousseau)
13. Signals and control (MIT OCW 6.003; 6.01)

---

## Elementary: Earth, sky and engineering design (NGSS K–5)

Source: the NGSS performance expectations for kindergarten to grade 5 in Earth and space science (K-ESS2-1, K-ESS2-2, K-ESS3-1 to 3-3, 1-ESS1-1, 1-ESS1-2, 2-ESS1-1, 2-ESS2-1 to 2-3, 3-ESS2-1, 3-ESS2-2, 3-ESS3-1, 4-ESS1-1, 4-ESS2-1, 4-ESS2-2, 4-ESS3-1, 4-ESS3-2, 5-ESS1-1, 5-ESS1-2, 5-ESS2-1, 5-ESS2-2, 5-ESS3-1) and in engineering design (K-2-ETS1-1 to 1-3, 3-5-ETS1-1 to 1-3), plus K-PS3-1 and K-PS3-2 (sunlight warms the ground; build a shade). nextgenscience.org refused the fetch, so these codes and their topics are reconstructed from memory of NGSS and not verified. Every word on screen is one a young child reads easily. Pushes, magnets, light, sound and simple machines are in the physics file's Elementary course.

### Unit 1: Weather [K-ESS2-1, K-ESS3-2, 3-ESS2-1, 3-ESS2-2, 3-ESS3-1, K-PS3-1, K-PS3-2]
*Why it matters:* everyone uses the weather daily to decide what to wear, when to take shelter and how to stay cool.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EL-01 | `DRESS!` | We dress for the weather we see. | Snow falls outside the window; a rabbit stands by a heap of clothes. | Drag the coat and hat onto the rabbit. | The rabbit hops out and builds a snowman. | Shorts in the snow: the rabbit's teeth chatter and it dives back indoors. | Rain or hot sun at random; boots, umbrella or sun hat. | Rabbit |
| EL-02 | `SHELTER!` | In a storm, get inside a building, not under a tree. | Dark clouds roll over a field of animals; lightning flickers far away. | Drag each animal into the barn. | Rain hammers down; the animals peek out dry, and a rainbow comes after. | Hiding under the lone tree: a cartoon zap frizzes the duck's feathers. | A faster storm and more animals. | Duck |
| EL-03 | `SHADE!` | Shade blocks sunlight, so the ground under it stays cooler. | A sandbox glows hot red in the sun; ants won't come out. | Drag a big leafy branch over the sandbox. | The sand under the shadow fades from red to cool blue, and the ants pour out to play. | Putting the branch beside the box: the sand stays red and an ant fans itself. | The Sun moves across the sky; keep the shade on the sand. | Ant |
| EL-04 | `MOVE IN!` | Each animal lives where the weather suits it. | A snowy pole, a rainy jungle and a hot desert; a penguin, a frog and a fox. | Drag each animal to its home. | Each one settles in: the penguin slides on the ice, the frog splashes, the fox naps in the sand. | The penguin in the desert pants and melts into a puddle of sulk. | A fourth home and a fourth animal. | Penguin |

### Unit 2: Sun, Moon and stars [1-ESS1-1, 1-ESS1-2, 5-ESS1-1, 5-ESS1-2]
*Why it matters:* people tell the time of day by the Sun, plan for dark winter evenings, and learn that stars are distant suns.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EL-05 | `TRACE!` | The Sun rises on one side, climbs high at noon and sets on the other side. | A farm at dawn; the Sun peeks over one hill. | Trace the Sun's path across the sky with a finger. | The day plays along the trace: the rooster crows, lunch at the top, the owl wakes at sunset. | Tracing straight up and down: the Sun drops back where it rose and the owl blinks, confused. | A winter day: the path is lower and shorter. | Owl |
| EL-06 | `SWING!` | A shadow points away from the Sun and is shortest at noon. | A stick in the sand and a flower; the Sun moves when you hold. | Hold to move the Sun; let go when the stick's shadow covers the flower. | The shadow swings round opposite the Sun and lands on the flower, which closes for a nap. | Moving the Sun toward the flower: the shadow swings the other way. | The flower is close to the stick: wait for the short noon shadow. | Turtle |
| EL-07 | `WAIT FOR IT!` | The Moon's shape changes night by night, from thin to full and back. | An owl on a branch wants a full Moon to hunt by; tonight's Moon is a thin sliver. | Hold to let the nights pass; let go on the full Moon. | The Moon grows a little each night until it is round and bright, and the owl swoops off. | Letting go on a half Moon: the owl squints into the gloom and bumps a branch. | Keep holding: it shrinks again; catch the next full Moon. | Owl |
| EL-08 | `BRING IT!` | A far-away light looks dim; stars are suns very far away. | Two lamps the same size, one near and one far down a long road. | Drag the far lamp toward you. | It grows brighter and brighter until it matches the near one; then the sky zooms out and the stars look like far lamps. | Dragging it away: it fades to a speck. | A big lamp far away and a small lamp close. | Owl |

### Unit 3: Land, water and how they change [2-ESS1-1, 2-ESS2-1, 2-ESS2-2, 2-ESS2-3, 4-ESS1-1, 4-ESS2-1, 4-ESS2-2, 5-ESS2-1, 5-ESS2-2]
*Why it matters:* farmers, builders and towns protect land and water by knowing why soil washes away and where water is stored.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EL-09 | `FAST-FORWARD!` | Some changes to the land happen in seconds and others take a very long time. | A hillside with a river, a cliff and a loose slope; a clock in the corner. | Hold to fast-forward time. | The loose slope slides in a blink; the river takes a long, long hold to carve a canyon while the clock spins and spins. | Letting go quickly: the landslide has happened, but the canyon is just a scratch, and the turtle says "keep going" by tapping the clock. | A volcano erupts suddenly midway. | Turtle |
| EL-10 | `PLANT!` | Plant roots hold soil so rain can't wash it away. | A bare hill above a house; rain clouds coming. | Tap the hill to plant grass and bushes before the rain. | Rain falls; the roots grip the soil and only clear water runs past the house. | Planting at the bottom only: mud slides down and splats on the door. | A ditch to dig too. | Beaver |
| EL-11 | `FREEZE!` | Cold turns water into solid ice; warmth melts it back. | A pond; a penguin waits with skates; a dial with a sun and a snowflake. | Turn the dial toward the snowflake. | Ice spreads from the edges and the penguin twirls across it. | Turning toward the sun: the penguin steps out and sinks with a splash. | Melt it again in spring so the duck can swim. | Penguin |
| EL-12 | `MAP!` | A map is the land seen from above. | A bird's-eye picture of an island next to a blank map. | Drag the mountain, river and lake tiles onto the map. | The bird flies over the island and over the map; they match. | Putting the river on the mountain top running uphill: the water pours off the map. | The river must reach the sea. | Bird |
| EL-13 | `DIG!` | Deeper rock layers are older, and fossils show what lived there. | A tall cliff with stripes of rock. | Swipe down to dig. | The beaver digs past layer after layer and finds a fish fossil high in the mountain: this was once sea. | Swiping up instead: the beaver piles dirt on top and finds yesterday's lost sandwich, because the top layer is the newest. | Match the stripes of two cliffs. | Beaver |
| EL-14 | `SMOOTH!` | Moving water wears rough rocks smooth and round. | A sharp rock in a stream. | Swipe the water back and forth over it. | The corners wear away until a round pebble shines in the stream. | Swiping the air above the water: the rock stays sharp and pokes the duck. | Wind for a desert rock. | Duck |
| EL-15 | `POUR!` | Almost all of Earth's water is salty sea; very little is fresh water we can drink. | A big jar of 100 drops and three cups: sea, ice, drinking water. | Tilt the jar to pour into the cups. | 97 drops race into the sea cup, 2 into the ice cup, and only 1 into the drinking cup. | Pouring it all into the drinking cup: it turns salty and the duck spits it out. | Find where the 1 drop hides (underground, rivers, lakes). | Duck |
| EL-16 | `RAIN!` | Rain changes the air, the land, the water and living things all at once. | A dry meadow, a dusty rock, a shallow river, a thirsty frog. | Tap the cloud to make it rain. | Dust clears, the ground turns to mud, the river rises, and the frog gulps a drink. | Tapping the sun instead: everything stays dusty and the frog wilts. | A wind storm instead. | Frog |

### Unit 4: Resources and hazards [K-ESS2-2, K-ESS3-1, K-ESS3-3, 4-ESS3-1, 4-ESS3-2, 5-ESS3-1]
*Why it matters:* every town chooses its energy, builds for earthquakes and floods, and cleans up its waste.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EL-17 | `CHOOSE!` | Sunshine and wind don't run out; coal and oil do. | A town's power plant with a hopper; cards for sun, wind, coal and oil. | Drag the sun or wind card into the hopper. | The town lights up and stays lit all day. | Feeding it coal: the pile shrinks to nothing and the lights flicker out. | Wood: it lasts only if trees are replanted. | Owl |
| EL-18 | `SHAKE!` | Towers with wide bases and cross braces survive earthquakes. | A table about to shake, a pile of blocks and sticks. | Drag blocks to build a tower, then the table shakes. | The wide, braced tower wobbles and stands. | A tall thin stack: it topples and the beaver ducks. | The tower must reach a flag. | Beaver |
| EL-19 | `CLEAN!` | Litter left on a beach can hurt sea animals. | A beach with bottles, cans and a plastic bag; a turtle swims nearby. | Drag the litter into the bins. | The beach clears and the turtle swims safely ashore. | Missing the bag: the turtle almost eats it, thinking it is a jellyfish, and spits it out. | Recycling, compost and trash bins. | Turtle |

### Unit 5: Engineering design [K-2-ETS1-1 to 1-3, 3-5-ETS1-1 to 1-3]
*Why it matters:* engineers work this way every day: say the problem, try designs, test them fairly, and improve the best one.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EL-20 | `FOLD!` | Folding paper into ridges makes it much stronger. | A sheet of paper across two books; ants waiting with coins. | Swipe back and forth to fold the paper into a fan. | The folded bridge holds a tall stack of coins as the ants march across. | Leaving it flat: it sags under two coins and the ants slide into the gap. | Use the fewest folds that still hold. | Ant |
| EL-21 | `RACE!` | A fair test changes only one thing. | Two toy boats; a calm pond and a windy pond. | Drag both boats into the same pond. | They race side by side; the better boat wins fairly. | Putting them in different ponds: the wind pushes the slow boat to a fake win and the duck shrugs. | Three boats. | Duck |
| EL-22 | `FIX!` | Engineers find the part that fails and change it. | A toy car flies off the end of a ramp instead of landing in its box. | Tap the bump that launches it. | The bump flattens; the car rolls into the box. | Tapping the car's paint: it turns pink and still flies off. | Two parts to fix. | Rabbit |
| EL-23 | `CONNECT!` | A bulb lights only when the wires make a full loop. | A battery, a bulb and a wire with a loose end. | Drag the loose end to the battery. | Dots run around the loop and the bulb lights. (Overlap: physics) | Touching the end to the bulb's glass: no loop, and the dots stop at the gap. | Two bulbs. | Ant |

---

## Middle school Earth and space science (NGSS MS-ESS; Khan Academy "Middle school Earth and space science")

Source: the units follow the NGSS middle school Earth and space science performance expectations MS-ESS1-1 to 1-4, MS-ESS2-1 to 2-6 and MS-ESS3-1 to 3-5. All 15 codes and their statements were checked in the Alaska Department of Education's copy of the standards (fetched; it splits MS-ESS1-1 into 1a and 1b but otherwise matches NGSS) and on the UCSB Science Curriculum page (fetched; it lists the same 15 codes). nextgenscience.org refused the fetch. Khan Academy's course page could not be fetched. Its unit labels "Earth in space", "Weather and climate", "The geosphere" and "Earth and society" were seen as breadcrumbs on mirrored KA video pages, with lesson titles including "Weather", "Regional climates", "The water cycle", "Earth's changing climate", "Global winds and currents", "Natural hazards", "Weathering and erosion" and "The carbon cycle". The five units below follow the NGSS topic arrangement; the KA label for each is a best match, not verified.

### Unit 1: Weather and climate [NGSS MS-ESS2-5, 2-6, 3-5; KA "Weather and climate"]
*Why it matters:* farmers, pilots, sailors and event planners read the weather every day, and voters and town planners need to read climate data.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MSE-01 | `PLOUGH!` | Heavy cold air pushes under warm air and lifts it, and lifted air makes storm clouds. | A blue wedge of cold air beside warm, damp orange air over a town. | Drag the cold air into the warm air. | The cold air slides underneath like a snowplough, the warm air is shoved up, a tall cloud boils up and rain hits the town. | Dragging the cold air over the top: it sinks straight back down with a thud. | Two fronts: pick the one that makes the thunderstorm. | Penguin |
| MSE-02 | `RISE!` | Air cools as it rises, so mountain tops are cold. | A puff of air with a thermometer at the foot of a mountain. | Drag the puff up the slope. | Its thermometer sinks as it climbs; near the top the puff turns into a cloud and snows on the peak. | Expecting it to warm near the Sun: the bird riding it shivers and pulls on a scarf. | Let it sink down the far side and warm into a dry wind. | Bird |
| MSE-03 | `CHILL!` | Warm air holds more water vapour; cooling it squeezes the extra out as droplets. | A jar of warm air; its invisible vapour is drawn as faint dots buzzing around. | Drag the jar into the fridge. | As it cools it can hold fewer dots, and the extra dots bead up as fog and drops on the glass. | Putting it in the oven: the dots spread out and the glass stays clear. | A cold can sweats on a summer day. | Frog |
| MSE-04 | `BLOW!` | Earth turns under moving air, so winds curve. | Earth seen from above the North Pole; a town to the south. | Swipe a gust straight at the town. | The Earth turns beneath it and the gust's trail curves to the right, missing the town. | Aiming straight: the gust lands in the sea and a fish gets a hairdo. | Aim off to one side so the curve lands on the town. | Owl |
| MSE-05 | `FLY!` | On sunny days land heats faster than the sea, so cool sea air blows in. | A beach in the afternoon; a kite on the sand. | Tap the sun to start the day, then point the kite. | The sand heats up, warm air rises over it, and cool sea air rushes in; the kite soars inland. | Pointing the kite out to sea: it nosedives into the sand. | Night: the breeze turns around. | Duck |
| MSE-06 | `TRAP!` | Greenhouse gases let sunlight in but catch heat going out. | Yellow sunlight arrows fall on Earth; red heat arrows rise away. A CO₂ slider. | Slide the CO₂ up. | More red arrows bounce back down and the thermometer climbs; the yellow arrows pass straight through. | Expecting CO₂ to block sunlight: the yellow arrows sail through untouched. | Methane too. | Turtle |
| MSE-07 | `SPIN!` **[ADDED]** | "30% chance of rain" means rain on about 3 of every 10 days like today. | A row of ten picnic days; a weather wheel with 3 of its 10 slices rainy. | Flick the wheel once for each picnic day. | Rain falls on about 3 of the 10 picnics; the rest stay sunny. | Hoping for a dry streak and flicking only once: it lands on rain and the rabbit's sandwich floats away. | A 70% wheel: pack the umbrella. | Rabbit |

### Unit 2: Natural hazards, resources and human impact [NGSS MS-ESS3-1 to 3-4; KA "Earth and society"]
*Why it matters:* planners, engineers and emergency services decide where to build, how much water a town needs and how to warn people.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MSE-08 | `CLIMB!` | When the sea suddenly pulls back, a tsunami is coming: go to high ground. | A beach town; the sea drains far out and leaves fish flapping on the sand. | Drag the villagers up the hill path. | The wave rushes in and stops below the hill; everyone waves from the top. | Walking down to collect the fish: a wave splashes them (safe, cartoon) and the warning replays. | Two paths, one to a low bridge. | Penguin |
| MSE-09 | `BUILD HIGH!` | Rivers flood their flat valley floor, so safe houses sit on higher ground. | A river in a wide flat valley with terraces up the sides. | Drop three houses, then the flood comes. | Water spreads across the flat floor and stops at the terrace; houses on the terrace stay dry. | Building on the flat land by the river: the house floats away with a duck on the roof. | A levee that holds until it doesn't. | Beaver |
| MSE-10 | `CUT DOWN!` | Cutting the biggest sources makes the biggest difference. | A family's carbon dioxide drawn as a stack of blocks: flights, car, heating, beef, lights. | Swipe blocks smaller until the stack fits under a line. | Shrinking the big flight and car blocks drops the stack fast. | Shrinking only the tiny lights block: the stack barely moves. | Some blocks cost money to shrink. | Fox |
| MSE-11 | `DRAIN!` | More people use more water. | A town's water tower and houses, each with a bucket. | Drag new houses into the town. | Each house adds a bucket a day and the tower drains faster. | Expecting the tower to last as long: it runs dry and the houses' taps cough. | A dry year refills the tower less. | Beaver |

### Unit 3: The water cycle and Earth's materials [NGSS MS-ESS2-1, 2-4, 3-1; KA "The geosphere"]
*Why it matters:* water supply, wells, building stone and mining all depend on how water and rock move.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MSE-12 | `LIFT!` | The Sun lifts water from the sea as vapour; it falls as rain on land and flows back. | A sea, a mountain and a dry valley. | Tap the sun over the sea, then drag the cloud over the mountain. | Vapour rises, the cloud fattens, rain falls on the mountain, and a river runs through the valley back to the sea. | Raining the cloud back onto the sea: the valley stays dry and a frog sighs. | Snow on the peak melts in spring. | Frog |
| MSE-13 | `FILL!` | A lake rises when water comes in faster than it leaves. | A lake with a river in and the hot sun evaporating it. | Turn the river tap until the lake level stays steady. | The level stops moving when what flows in matches what leaves. | Turning up the sun to fill it: the lake shrinks and a duck lands on mud. | A town pumps water out too. | Duck |
| MSE-14 | `SQUEEZE!` | Buried sand is squeezed and glued into sandstone. | Layers of loose sand pile up in a basin. | Hold to pile more layers on top. | The weight presses the bottom layers into solid sandstone, stripe by stripe. | Letting go too soon: the sand stays loose and the beaver sinks in it. | Heat and squeeze limestone into marble. | Beaver |
| MSE-15 | `HARDEN!` | Melted rock cools into new rock: slowly underground makes big crystals. | Magma in a chamber deep underground; a volcano above. | Hold to keep it underground, or swipe up to erupt it. | Held: it cools slowly into speckled granite. Erupted: it freezes fast into smooth basalt. | Erupting it when granite was asked for: tiny crystals, and the owl squints through a magnifier. | Obsidian (glass, no crystals). | Owl |
| MSE-16 | `SCRATCH!` | A harder mineral scratches a softer one. | An unknown crystal and a steel nail. | Drag the nail across the crystal. | A scratch line shows the crystal is softer than steel; it slides down the hardness ladder. | Scratching the nail with the crystal and reading it backwards: the ladder flips upside down. | Pick between quartz and calcite. | Hedgehog |
| MSE-17 | `PUMP!` | Pumping a well too fast lowers the water underground. | A cut-away: sand full of water, a well and a hand pump. | Mash to pump; stop before the well runs dry. | The water table dips into a cone around the well and refills when you stop. | Pumping on and on: the pump coughs air and the bucket stays half full. | A neighbour's well nearby drops too. | Beaver |

### Unit 4: Earth, Sun and Moon; the solar system [NGSS MS-ESS1-1, 1-2, 1-3; KA "Earth in space"]
*Why it matters:* seasons drive farming and energy use, tides and eclipses are everyday questions, and the size of the solar system teaches how big space is.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MSE-18 | `ORBIT!` | The Moon's shape changes because we see different parts of its sunlit half. | From above: the Sun, Earth, and the Moon on its orbit, half lit. A small window shows Earth's view. | Drag the Moon around its orbit. | Its sunlit half always faces the Sun, and Earth's window shows a crescent, a half, a full Moon. | Expecting Earth's shadow to make the shapes: the shadow points the other way. | Stop it at the half Moon. | Owl |
| MSE-19 | `BLOCK!` | A solar eclipse happens when the Moon's shadow falls on Earth. | The Sun, Earth and the Moon; a town on Earth. | Drag the Moon between the Sun and Earth. | Its small shadow sweeps over the town; it goes dark at midday and the rooster crows. | Dragging it behind Earth: the Moon turns red (a lunar eclipse) instead. | The tilted orbit: most passes miss. | Owl |
| MSE-20 | `WARM UP!` | Seasons come from Earth's tilt: the half tilted toward the Sun gets steep, strong sunlight. | Earth on its orbit with its tilted axis; a fox shivers in a snowy northern town; a flashlight beam from the Sun. | Drag Earth around its orbit until the fox's snow melts. | Where the north is tilted toward the Sun, the beam hits the town steeply in a small bright patch, and the snow melts. | Stopping at the point closest to the Sun: it is January there, the beam is slanted and the fox is buried in snow. | A southern penguin wants winter at the same moment. | Fox |
| MSE-21 | `ROLL!` | Planets are tiny and very far apart. | A football field; the Sun is a beach ball on the goal line; Earth's orbit is a faint ring far down the field; Earth is a marble. | Swipe again and again to roll the marble out to Earth's ring. | It rolls and rolls past the end zone before it reaches the ring; the camera pulls back and the marble is a speck in a huge empty space. | Stopping after a few swipes: the marble sits near the ball, and the ring blinks far away. | Roll Jupiter's cherry-sized ball out to its ring, much further. | Ant |
| MSE-22 | `LAUNCH!` | An orbit is falling all the way round without hitting the ground. | Newton's cannon on a mountain on a small round planet. | Pull back and let go. | Just the right speed: the ball falls, misses the ground, and keeps circling. | Too slow: it plops into a lake. Too fast: it vanishes into space. | A narrower "just right" band. | Rabbit |
| MSE-23 | `STEP ON!` | Weight changes with gravity, but the amount of stuff (mass) does not. | An astronaut beside a scale on Earth and a scale on Mars. | Drag the astronaut onto the Mars scale. | The needle reads less on Mars; the suit, and the astronaut inside it, stay the same size. (Overlap: physics) | Expecting the astronaut to shrink: the suit fits exactly the same. | The Moon and Jupiter. | Penguin |

### Unit 5: Earth's history and plate motion [NGSS MS-ESS1-4, 2-2, 2-3; KA "The geosphere"]
*Why it matters:* geologists read rock layers to find water, oil and earthquake faults; plate motion explains where earthquakes and volcanoes happen.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MSE-24 | `PILE ON!` | Each new layer lands on top of the older ones, so lower layers are older. | An empty basin; a sea, then a desert, then a swamp come and go. | Tap to drop each new layer as its time arrives. | Shells, then sand, then mud pile up in stripes; a dinosaur bone lands in the sand, and today's soda can lands on top. | Tapping too fast: the layers smoosh into one muddy stripe and the turtle can't read them. | A lava wall cuts through the stack later. | Turtle |
| MSE-25 | `SPREAD!` | New sea floor forms at a crack and moves outward on both sides. | A crack in the ocean floor with magma glowing below. | Hold to let magma rise and spread. | New rock freezes at the crack and slides away on both sides like two conveyor belts, older rock moving further out. | Letting go: the crack seals and the octopus taps its watch. | Match the magnetic stripes on both sides. | Octopus |
| MSE-26 | `FIT!` | The continents were once joined: their fossils and rocks line up. | Four continents with fossil stripes and rock belts. | Drag the continents together. | Edges lock where the stripes match and glow across the joins; then the map runs forward to today. | Fitting by outline only: the stripes don't match and the turtle shakes its head. | India too. | Turtle |
| MSE-27 | `CARVE!` | Slow processes, given millions of years, make huge landforms. | A river on a flat plain; a year counter. | Hold to run time. | The river saws down a hair each year; a thousand years barely scratch it; after millions of years a deep canyon stands. | Letting go early: a ditch, and the beaver measures it with a tiny ruler. | The plain rises while the river cuts. | Beaver |

---

## High school Earth science (CK-12 "Earth Science for High School"; Wikibooks "High School Earth Science"; NGSS HS-ESS)

Source: the chapter list of Wikibooks "High School Earth Science" (fetched in full from a Kiwix mirror of the March 2021 Wikibooks dump), which is the CK-12 "Earth Science for High School" FlexBook: 26 chapters, from 1 "What is Earth Science?" to 26 "Stars, Galaxies, and the Universe". All 26 titles are verified. The NGSS high school performance expectations were used to check emphasis. Nine of them (HS-ESS1-1, 1-4, 1-5, 2-2, 2-3, 2-5, 3-1, 3-3, 3-6) were seen in the California Department of Education's assessment document (fetched). The other ten (HS-ESS1-2, 1-3, 1-6, 2-1, 2-4, 2-6, 2-7, 3-2, 3-4, 3-5) are reconstructed from memory and not verified. The 26 chapters are grouped into 13 units, and each unit names its chapters. Chapter 12 (Earth's History) is told in full in the History of the Earth story course.

### Unit 1: Earthquakes, volcanoes and the odds of disaster [Ch. 7 Earthquakes, Ch. 8 Volcanoes; HS-ESS3-1]
*Why it matters:* building codes, insurance, emergency planning and choosing where to live rest on locating earthquakes, comparing their sizes and understanding rare events.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HES-01 | `OUTRUN!` | A quake's fast and slow waves arrive further apart the farther away you are. | A quake, a fast rabbit wave and a slow turtle wave, and a track to a town. | Drag the town along the track until the gap between arrivals matches the seismograph. | The farther the town, the further the turtle falls behind; the gap matches and the quake's distance is found. | Dragging the town right next to the quake: they arrive together and crash into each other. | Three towns at once. | Rabbit |
| HES-02 | `RING!` | Three distance circles meet at one spot: the quake. | A map with three towns; each knows how far away the quake was. | Drag each town's circle out to its distance, then tap where all three meet. | The circles cross at one point and a red star pops up there. | Tapping where only two circles cross: the third circle misses and the star fizzles. | One town's circle is wrong. | Owl |
| HES-03 | `RUMBLE!` | Each step up in magnitude means much bigger shaking. | A seismograph pen and a toy town; a magnitude dial. | Turn the dial up one step at a time. | Each step the pen's swing gets many times wider and more of the toy town wobbles. | Expecting a small step: the pen flies off the paper and the hedgehog curls up. | The energy grows even faster: a lightning bar. | Hedgehog |
| HES-04 | `SWAY!` | A building shakes most when its own sway matches the ground's rhythm. | The ground rocks with a steady beat; a building you can make taller or shorter. | Drag the building's height up or down until it stops swinging wildly. | Off-beat, it barely moves; at the matching height its sway grows huge. | Stopping at the match: the top floor's sofa slides out the window. | Two ground rhythms at once. | Beaver |
| HES-05 | `ERUPT!` | Thick, gassy magma traps bubbles and explodes; runny magma lets them out and flows. | A volcano with a magma chamber full of gas bubbles; a slider from runny (honey) to thick (toothpaste). | Slide the magma to thick, then let the bubbles build. | The bubbles can't escape, the top bulges, and it bursts in an ash cloud. | Leaving it runny: the bubbles fizz away and lava dribbles out while the penguin waits for a bang with fingers in its ears. | A dome that blows sideways. | Penguin |
| HES-06 | `ROLL DICE!` **[ADDED]** | A rare yearly event becomes likely over many years. | 100 copies of a house in a "1 in 100 each year" flood zone; one die per house. | Mash to roll 30 years of dice for all 100 houses. | Floods splash at random; by year 30 about a quarter of the houses have flooded at least once. | Thinking "100-year flood" means once a century: one house floods twice in a row and its duck owner faints. | Roll 100 years: still not every house floods. | Beaver |

### Unit 2: Weather and the atmosphere [Ch. 15 Earth's Atmosphere, Ch. 16 Weather]
*Why it matters:* pilots, sailors, farmers and event planners read weather maps and cloud heights.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HES-07 | `HIDE THE PEAK!` | Damp air forms clouds lower down than dry air. | A mountain; air rising up its side; a humidity dial that adds faint water dots to the air. | Turn up the dampness until clouds form low enough to hide the peak. | The rising air reaches its fog point sooner, so the cloud base drops and swallows the peak. | Drying the air: the cloud base rises far above the peak and a hiker gets sunburnt. | A thunderstorm grows from the low base. | Bird |
| HES-08 | `TRACE THE WIND!` | Wind spirals into a low-pressure centre, fastest where the pressure lines crowd. | A weather map with a low and its pressure lines; a leaf. | Trace the leaf's path around the low. | The leaf swirls anticlockwise and inward, racing where the lines are close. | Tracing straight into the middle: the wind curves away (see MSE-04 BLOW!). | A high (clockwise and outward). | Owl |
| HES-09 | `FLOAT UP!` | Air thins with height because less air is pressing down from above. | A tall stack of air blocks pressing on the ground; a sealed snack bag tied to a balloon. | Drag the balloon up. | Fewer blocks are above it as it rises, so the bag puffs up. | Expecting a sharp edge of the sky: the balloon keeps going. | A climber's breathing gets harder. | Bird |
| HES-10 | `STOP!` | Air cools upward until the ozone layer, where it starts warming again. | A weather balloon rising with a thermometer. | Hold to rise; let go when the temperature starts climbing. | The thermometer falls steadily, then turns at the ozone layer; the layer name fades in. | Letting go at the first cloud: the thermometer is still falling. | Find the next turn. | Penguin |

### Unit 3: Climate and Earth's energy budget [Ch. 17 Climate; HS-ESS2-4, 3-6]
*Why it matters:* engineering codes, insurers and banks now plan for climate risk, and anyone reading the news needs to tell a trend from a single hot year.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HES-11 | `PAINT!` | White surfaces bounce sunlight away; dark ones soak it up and warm. | Sunbeams hit a patch of ground; snow, grass and ocean brushes. | Paint the patch white with snow. | Most beams bounce off and the thermometer stays low. | Painting it dark ocean: the beams soak in and the penguin's ice cube melts. | Melting snow exposes dark ground that warms the rest. | Penguin |
| HES-12 | `BALANCE!` | Earth's temperature settles where the heat it glows away equals the sunlight it absorbs. | Sunlight pours onto Earth; Earth glows heat back to space; a temperature slider. | Slide until the outgoing glow matches the incoming sunlight. | The thermometer stops drifting at the balance point. A greenhouse blanket shifts the balance warmer. (Overlap: physics) | Stopping too cold: the glow is too weak, and Earth keeps warming on its own back to the balance. | Add the blanket. | Turtle |
| HES-13 | `MELT A FLOE!` | Melting ice exposes dark water, which absorbs more sunlight and melts more ice. | Arctic sea ice in late summer. | Tap one floe to melt it. | The dark water warms and melts the next floes; the melting spreads by itself for a while. | Tapping far from any ice: nothing spreads and the fox yawns. | A cloud that pushes back. | Fox |
| HES-14 | `TILT!` **[ADDED]** | Climate is the long-term slope; weather is the wiggle around it. | Forty years of noisy temperature dots; a ruler. | Tilt the ruler through the middle of the dots. | The ruler slopes up; single hot and cold years scatter on both sides. | Lining the ruler up with one hot and one cold year: half the dots pile up on one side. | A short record too noisy to tell. | Owl |

### Unit 4: Fresh water and the oceans [Ch. 13 Earth's Fresh Water, Ch. 14 Earth's Oceans]
*Why it matters:* water supply, flood control, shipping and coastal safety.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HES-15 | `SOAK!` | Water flows easily through gravel and sand but gets stuck in clay. | A cut-away of the ground with layers of gravel, sand and clay; a well must fill a bucket. | Drag the well's pipe down into a layer until water comes up. | Water rushes up from the gravel or sand layer and fills the bucket. | Drilling into clay: a sad drip, then nothing. | A cut-away with layers to find. | Frog |
| HES-16 | `SURF!` | A tsunami is fast in deep water and slows and towers up near shore. | A wave out at sea, a jet plane flying beside it, and a coast. | Swipe the wave toward the coast. | Over deep water it keeps up with the jet; near shore the sea floor rises and the wave slows and rears up tall. | Expecting a slow little wave: the octopus on its surfboard is suddenly very high up. | The beach drains before it hits. | Octopus |
| HES-17 | `SAIL!` | The Moon's pull makes two high tides a day. | A harbour gauge rising and falling; a boat that needs high water to leave. | Tap at each high tide to cast off. | The Moon's pull bulges the ocean on both sides of Earth and the harbour turns through both bulges. | Tapping at low tide: the boat scrapes the mud and the duck captain hops out to push. | Spring and neap tides. | Duck |
| HES-18 | `SINK!` | Cold, salty water sinks and drives a slow ocean conveyor belt. | The North Atlantic; warm water flowing north. | Drag cold, salty water near Greenland downward. | It sinks because it is heavy, and the whole conveyor starts turning, pulling warm water north. | Dragging warm fresh water down: it bobs back up like a cork. | Add meltwater and the conveyor slows. | Penguin |

### Unit 5: Maps and Earth's surface [Ch. 2 Studying Earth's Surface]
*Why it matters:* hikers, surveyors, civil engineers and anyone placing a road or a house read contour maps, latitude and time zones.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HES-19 | `SLED!` | Contour lines close together mean a steep slope. | A contour map of a hill; the ant has a sled at the top and the finish flag is at the bottom. | Drag the sled's path down the hill. | The map tilts up into 3-D; down the side where the lines crowd, the slope is steep and the sled races to the flag. | Sledding where the lines are far apart: the sled creeps and stops halfway. | Find which way a stream flows. | Ant |
| HES-20 | `TURN!` **[ADDED]** | Earth turns west to east, so places to the west see noon later. | A globe with noon sunlight on London and a city far to the west. | Spin the globe until noon reaches the city. | The globe turns eastward and noon sweeps west to the city: it was morning there when London had noon. | Spinning it the wrong way: the Sun rises in the west and the owl rubs its eyes. | Cross the date line. | Owl |
| HES-21 | `SIGHT!` | The Pole Star sits higher in the sky the farther north you are. | A night sky over a ship and a sextant. | Drag the sextant arm up to the Pole Star. | The angle shows; the map pin slides north as the star climbs. | Aiming at a bright planet: it wanders and the pin jumps around the map. | The Southern Hemisphere. | Owl |

### Unit 6: Human actions and Earth's resources [Ch. 18 Ecosystems and Human Populations, Ch. 19 Human Actions and the Land, Ch. 20 Human Actions and Earth's Resources, Ch. 21 Human Actions and Earth's Waters, Ch. 22 Human Actions and the Atmosphere]
*Why it matters:* environmental consultants, resource planners and pollution-control engineers use these ideas daily.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | See ES (AP Environmental Science) | Population (ES Unit 6), land use (ES Unit 5), energy (ES Unit 2), water pollution (ES Unit 3), air pollution (ES Unit 4). | These chapters cover the same ideas at a lower level; the APES games are used at level 0. | | | | | |

### Unit 7: Energy resources [Ch. 5 Earth's Energy]
*Why it matters:* geoscientists in the energy industry decide where to drill by working out where fuels formed.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HES-22 | `BURY!` | Buried plankton turns into oil only in a middle band of heat; deeper, it becomes gas. | Mud full of dead plankton; it gets hotter the deeper it goes. | Drag the mud down and let go in the oil zone. | In the middle band, oil droplets seep out of the darkening mud. | Burying it as deep as possible: it fizzes into gas bubbles. | It also needs millions of years. | Beaver |
| — | See ES Unit 2 | Power plants, solar, wind, hydropower and payback. | | | | | | |

### Unit 8: Weathering, soil, erosion and deposition [Ch. 9 Weathering and Formation of Soil, Ch. 10 Erosion and Deposition]
*Why it matters:* farming, foundations, road cuts and dams filling with silt.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HES-23 | `CRACK!` | Water expands when it freezes and splits rock apart. | A rock with a water-filled crack; night and day cycle fast. | Tap each time night freezes the water. | Each freeze widens the crack; on the last tap a block cracks off. | Tapping in the warm day: nothing happens. | Faster days. | Penguin |
| HES-24 | `SHAKE THE JAR!` | Soil is a mix of sand, silt and clay, which settle at different speeds. | A jar of muddy water. | Shake the jar, then set it down. | Sand sinks first to the bottom, silt settles on it, and clay clears slowly on top; the soil's mix shows in stripes. | Not letting it settle: everything stays murky. | Which soil drains fastest. | Rabbit |
| HES-25 | `SLOW!` | When a river slows, it drops its heaviest load first. | A fast river carrying gravel, sand and clay into a still lake. | Drag a dam across to slow the river. | Gravel drops first near the mouth, sand further out, clay drifts far before settling. | Speeding it up instead: everything shoots out to sea. | A flood carries everything further. | Duck |

### Unit 9: Plate tectonics [Ch. 6 Plate Tectonics; HS-ESS1-5, 2-1, 2-3]
*Why it matters:* plate motion explains where earthquakes, volcanoes, mountains and many ore deposits are.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HES-26 | `PULL APART!` | Where plates separate, magma rises and makes new crust. | Two plates on the ocean floor. | Drag the plates apart. | Magma wells up into a ridge of new crust between them. | Pushing them together: a trench opens instead and the turtle peers in. | Make a trench and a volcanic arc. | Turtle |
| HES-27 | `CRUSH!` | Where two continents collide, the crust crumples into high mountains. | India drifts toward Asia. | Drag India into Asia. | The crust buckles and folds up into the Himalaya. | Dragging it sideways: the plates scrape past and a fault jolts instead. | Slide two plates sideways (a fault). | Fox |
| HES-28 | `PILE!` | Mountains float on denser rock below, like icebergs, with deep roots. | A block of crust floating in denser mantle rock, like an iceberg in water. | Pile rock onto the mountain. | The block sinks a little and grows a deep root as the mountain rises. | Expecting a flat base: the block sinks lower until it floats. | Erode the top and watch the block rise. | Penguin |

### Unit 10: Minerals and rocks [Ch. 3 Earth's Minerals, Ch. 4 Rocks]
*Why it matters:* geologists and builders identify building stone, gravel and ore with these tests.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HES-29 | `TIP!` | Some minerals are much heavier than others of the same size. | A balance with a weight on one pan; three same-sized rocks: quartz, hematite and galena. | Drag one rock onto the empty pan to tip the balance down. | The galena tips the pan down with a clunk, though all three rocks are the same size. | Trying the quartz: the pan barely moves and the beaver jumps on it to help. See GE-21 DENSITY!. | A heavier weight: only galena works. | Beaver |
| HES-30 | `SPLIT!` | Many minerals split along flat planes. | A crystal of mica and a chisel. | Tap the chisel against its side. | It peels into thin flat sheets. | Hitting a quartz crystal: it shatters into curved chips. | Halite splits into little cubes. | Hedgehog |
| — | See MSE-14 to MSE-16 | Rock cycle, cooling rate and scratch test. | | | | | | |

### Unit 11: Earth's past and dating [Ch. 11 Evidence About Earth's Past, Ch. 12 Earth's History; HS-ESS1-6]
*Why it matters:* geologists date rocks to find resources and to judge whether a fault is still active.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HES-31 | `TICK!` | Radioactive atoms change at a steady rate: half of them in each half-life. | A crystal holding a jar of blue atoms. | Tap the clock to advance one half-life. | Half the blue atoms flip orange each tick: full, half, a quarter. A rock's jar tells its age. (Overlap: chemistry) | Expecting them all to flip in one go: only half change, and the turtle keeps tapping. | Match a rock's jar to the clock. | Turtle |
| HES-32 | `MATCH!` | Matching layers and fossils across places shows they formed at the same time. | Two cliffs far apart with stripes, an ash layer and a shell fossil in both. | Drag lines between matching layers. | Matched layers glow across the gap; a missing layer shows where rock wore away. | Matching by colour only: the fossils clash. | One cliff is tilted. | Owl |

### Unit 12: Earth, Moon, Sun and space [Ch. 23 Observing and Exploring Space, Ch. 24 Earth, Moon, and Sun, Ch. 25 The Solar System, Ch. 26 Stars, Galaxies, and the Universe] [SHORT]
*Why it matters:* solar installers set panel angles from the Sun's height; the rest is in the astronomy course.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HES-33 | `AIM!` | A solar panel makes the most power when it faces the Sun. | A solar panel on a roof; the summer Sun high in the sky. | Tilt the panel to face the Sun. | Its power meter peaks. In winter the Sun is lower and the best tilt is steeper. | Leaving it flat: the meter sags and the fox's phone charger blinks. | One tilt for the whole year. | Fox |
| — | See MSE-18 to MSE-22 and the astronomy course (AS) | Phases, eclipses, seasons, scale, orbits; telescopes, planets, stars and galaxies. | | | | | | |

### Unit 13: How Earth scientists know [Ch. 1 What is Earth Science?] [SHORT]
*Why it matters:* a fair test, with one thing changed and a comparison kept, is how every field study and lab report earns trust.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HES-34 | `TEST!` | A fair test changes only one thing and keeps a comparison. | Two rock trays, one salted; a freezer and a shelf. | Drag both trays into the freezer. | A month in fast-forward: only the salted tray cracks, so the salt did it. | Putting the plain tray on the shelf: it stays whole, but nobody can tell if that was the salt or the cold, and the owl's thought bubble fills with question marks. | Four setups; one uses a single rock. | Owl |

---

## History of the Earth (story course)

Source: the story follows the geologic time scale. The dates below are the commonly cited values from the International Commission on Stratigraphy's International Chronostratigraphic Chart (for example, the Cambrian begins 538.8 million years ago, the end-Permian extinction 251.9 million years ago, the end-Cretaceous asteroid impact 66.0 million years ago, the Quaternary ice ages 2.58 million years ago), recalled from memory and not fetched. The early dates (the Moon-forming impact, the oldest life, the first complex cells) are less certain, and each row's card should say so. The chapter outline matches HES chapter 12 "Earth's History" (verified title above). The owner asked for this course to be told as scenes with a scaled timeline.

**The timeline.** All 4.54 billion years of Earth's history are squeezed into one day, from midnight to midnight. After each beat, a 24-hour clock bar fills in to the moment of that beat, so the player feels how long each step took. One second of the clock is about 52,500 years.

### Unit 1: A young planet [4.54 to 4.4 billion years ago]
*Why it matters:* where Earth's water and Moon came from is a question that planetary scientists and space agencies still work on.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HE-01 | `GATHER!` | Earth grew from dust and rocks that crashed together around the young Sun. | A disc of dust and rocks swirls around a newborn Sun. | Swipe the rocks into one growing clump. | The clump grows into a glowing, molten ball. Clock: 00:00. | Swiping them apart: they drift off and the Sun looks lonely. | Rocks come in faster. | Turtle (narrator) |
| HE-02 | `CRASH!` | A Mars-sized planet hit the young Earth; the splashed-out rock made the Moon. | The molten Earth and a smaller planet, Theia, on a crossing path. | Aim Theia so it strikes Earth's edge. | A huge splash of rock flies out, forms a ring, and the ring clumps into the Moon. Clock: about 00:13. | Missing completely: Theia sails past and the night sky stays empty. | Aim so the Moon forms close, then watch it drift away over time. | Owl |
| HE-03 | `POUR DOWN!` | As Earth cooled, steam in the air rained down and filled the first oceans. | A steaming Earth under thick clouds. | Hold to cool the planet, then tap the clouds. | Rain pours for ages and the oceans fill the low places. Clock: about 00:45. | Raining too soon: drops hiss on hot rock and puff back into steam. | Comets bring some water too. | Duck |

### Unit 2: Life begins and changes the planet [about 3.7 to 1.8 billion years ago]
*Why it matters:* the oxygen we breathe was made by tiny living things, and the energy machinery in our own cells came from a swallowed bacterium.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HE-04 | `WRAP!` | Life may have begun as a self-copying strand wrapped in a tiny bubble. | A warm vent on the sea floor; a wriggling strand and floating fatty bubbles. | Drag a bubble over the strand. | Wrapped up, the strand copies itself and the bubble splits in two, again and again. Clock: by about 05:30, maybe earlier. | Leaving the strand bare: it drifts apart in the current. | Feed the bubbles to make them grow. | Frog |
| HE-05 | `BREATHE OUT!` | Tiny green microbes made oxygen; it first rusted the iron in the sea, then filled the air. | Green mats of microbes in a shallow sea full of dissolved iron. | Mash to make the mats work in the sunlight. | Oxygen bubbles rise; first they turn the iron to red rust that sinks in stripes, then the sky fills with oxygen. Clock: about 11:20. | Stopping early: all the oxygen goes into rust and the air stays empty. | Some old microbes are poisoned by oxygen and hide. | Frog |
| HE-06 | `SWALLOW!` | A big cell swallowed a small bacterium that stayed inside as its power plant. | A big round cell and a small bacterium that uses oxygen. | Drag the bacterium into the big cell. | It settles inside and starts glowing as a power plant; the big cell zips about. Clock: about 14:30. | Digesting it instead (tap the cell's mouth twice): it dissolves and the big cell is sluggish again. | A second swallow makes a green plant cell. | Octopus |

### Unit 3: Ice and the explosion of animals [720 to 375 million years ago]
*Why it matters:* the history of climate swings and mass extinctions tells scientists how Earth responds to big changes.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HE-07 | `THAW!` | Earth froze nearly pole to pole; volcanoes slowly filled the air with carbon dioxide until the ice melted. | A white Snowball Earth with a few volcanoes poking through. | Tap the volcanoes to puff gas into the sky. | The gas builds up, traps heat, and the ice suddenly melts back. Clock: about 20:10 to 20:40. | Tapping the ice: it just squeaks. | It took millions of years; hold for a long time. | Penguin |
| HE-08 | `BUILD!` | In the Cambrian explosion, animals quickly gained eyes, shells and legs in many new shapes. | Blank, wormy sea creatures and a tray of parts: eyes, shells, spines, legs. | Drag parts onto the creatures as fast as you can. | Strange new animals swim off; a predator with big eyes chases one with a shell. Clock: about 21:10. | Sticking the shell over the eyes: it bumps into a rock. | Hungry predators appear. | Octopus |
| HE-09 | `CRAWL!` | Plants, then animals with leg-like fins, moved from water onto land. | A drying pond and a fish with stubby leg-like fins; a full pond across the mud. | Drag the fish across the mud to the full pond. | It heaves itself across on its fins and splashes in; ferns already grow on the bank. Clock: plants about 21:30, legs about 22:00. | Using a thin-finned fish: it flops in place. | Breathe air on the way. | Frog |

### Unit 4: Dinosaurs, the asteroid and mammals [252 to 2.6 million years ago]
*Why it matters:* the five mass extinctions are the benchmark scientists compare today's species losses with.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HE-10 | `TAKE COVER!` | Giant volcanoes heated the world, and about nine in ten sea species died out (the Great Dying). | Huge eruptions in Siberia; the sea warms and turns sour. | Drag a few creatures into cool, deep refuges. | Most kinds of life vanish, but the sheltered ones survive to start again. Clock: about 22:40. | Leaving them in the shallows: they get too hot and fade. | Fewer refuges. | Turtle |
| HE-11 | `BREAK UP!` | The supercontinent Pangaea split while the dinosaurs spread across it. | One big landmass with dinosaurs walking about. | Drag the continents apart. | Oceans open between them and dinosaur herds ride away on different continents. Clock: about 22:50. | Pushing them together: they just squish. | Drag them to today's places. | Bird (a dinosaur's descendant) |
| HE-12 | `HIDE!` | An asteroid wiped out the big dinosaurs; small burrowing mammals and birds survived. | An asteroid streaks in; dinosaurs, small furry mammals and birds below. | Drag the small mammals into their burrows before it hits. | Fire and darkness sweep the land; the burrowers peek out afterward into a world without big dinosaurs. Clock: about 23:39. | Trying to hide the giant dinosaur: it doesn't fit and its tail sticks out. | Birds fly to safety too. | Hedgehog |
| HE-13 | `FILL THE GAPS!` | With the dinosaurs gone, mammals spread into every kind of place. | An empty world: sea, sky, grassland, forest; small mammals waiting. | Drag mammals into each empty place. | They change over time: a whale in the sea, a bat in the sky, a horse on the grass. Clock: from 23:39 on. | Putting the bat in the sea: it bobs, offended. | Add a mountain. | Rabbit |

### Unit 5: Ice ages and people [2.6 million years ago to today]
*Why it matters:* the ice ages shaped today's coastlines, soils and lakes, and they show how much Earth's climate can change.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HE-14 | `ADVANCE!` | Slow wobbles in Earth's orbit made ice sheets grow and shrink again and again. | A map of the north; a slow drumbeat marks Earth's wobble cycle. | Tap on each cold beat to push the ice sheet south. | The ice grows and melts back many times; the sea level falls and rises with it. Clock: from 23:59:11. | Tapping on warm beats: the ice melts away under the penguin. | The beat speeds up. | Penguin |
| HE-15 | `WALK!` | Modern humans spread out of Africa across the world. | A world map during an ice age, with land bridges where the sea is low. | Trace a path for the walkers from Africa to every continent. | They cross land bridges while the sea is low and reach every continent. Clock: modern humans from about 23:59:54. | Tracing across open ocean: the walkers stop at the shore and look for a boat. | Build a raft for the last crossing. | Fox |
| HE-16 | `ZOOM OUT!` | All of written history fits into the last split second of Earth's day. | The 24-hour clock with every beat marked; today's city at the far right edge. | Pinch to zoom out from today to the whole day. | The city, the pyramids and all of history shrink to a hairline at the last tick of midnight. | Zooming in instead: the hairline fills the screen and hides the dinosaurs. | Zoom out further to the age of the universe (see HU). | Turtle |

---

## AP Environmental Science (College Board, AP Environmental Science Course and Exam Description)

Source: the College Board's "AP Environmental Science Course Overview" PDF (fetched from apcentral.collegeboard.org; © 2026) lists the nine units verbatim: 1 The Living World: Ecosystems; 2 The Living World: Biodiversity; 3 Populations; 4 Earth Systems and Resources; 5 Land and Water Use; 6 Energy Resources and Consumption; 7 Atmospheric Pollution; 8 Aquatic and Terrestrial Pollution; 9 Global Change. The topic lists inside each unit and the exam weightings (Unit 9, at 15–20%, is the largest) come from UWorld's "AP Environmental Science units, topics and key concepts" page (fetched), which matches the CED's topic order as far as could be checked; the CED itself was not fetched. All nine unit titles are verified; the topics are verified against UWorld only. The CED's calculation topics (energy conversions, population growth rates) are taught here as the ideas behind them, not as sums.

### Unit 1: Global change [CED Unit 9: Topics 9.1–9.10]
*Why it matters:* carbon accounting, climate-risk reports and sea-level planning are now routine jobs in companies, cities and engineering firms.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ES-01 | `KEEP WARM!` | Some gases (carbon dioxide, methane, water vapour) catch outgoing heat; nitrogen and oxygen let it pass. | A chilly planet with red heat arrows leaving it; gas molecules float by. | Drag gas molecules into the planet's sky until it warms to the green line. | Carbon dioxide and methane wiggle and catch the heat arrows; the thermometer rises. | Filling the sky with nitrogen: the heat arrows sail straight out and the penguin's breath freezes. | Too much warming: stop at the line. | Penguin |
| ES-02 | `OVERFLOW!` | Melting land ice raises the sea; melting floating ice does not. | Two full glasses: one with an ice cube floating, one with an ice cube on a rock above the water. | Melt the ice to make a glass overflow. | Melting the ice on the rock pours new water in and the glass spills over. | Melting the floating cube: the level stays exactly the same and the duck waits for a splash. | Greenland and Antarctica as the "rock" ice. | Duck |
| ES-03 | `BUILD SHELL!` | Carbon dioxide dissolving in the sea makes it more acidic, which makes shells harder to build. | A sea snail gathering shell bits from the water; smokestacks on the shore. | Tap to collect shell bits and grow the shell. | With clean air the shell grows thick; as carbon dioxide pours in, fewer bits float about and the shell thins. | Building near a busy smokestack: the shell comes out see-through and the snail blushes. | Turn the smokestacks down. | Octopus |
| ES-04 | `SHIELD!` | CFC gases destroy the ozone layer that blocks the Sun's harmful UV light. | A beach under a thin ozone layer with a hole; CFC spray cans float up. | Drag the cans into the recycling bin before they reach the ozone. | The hole closes and the UV rays bounce off the layer. | Letting one through: its chlorine atom chomps one ozone molecule after another. | Cans rise faster. | Penguin |
| ES-05 | `CLEAN HULL!` | Invasive species hitch rides to new places and crowd out native ones. | A boat about to launch in a new lake, zebra mussels clinging to its hull. | Tap each mussel off before the boat launches. | The boat launches clean; the lake's native clams stay happy. | Missing one: mussels spread and coat the clams in seconds. | Hidden mussels under the propeller. | Duck |
| ES-06 | `BRIDGE!` | Animals need connected habitat to find mates and food. | Two forest patches split by farms and a road; a jaguar in one, a mate in the other. | Drag forest tiles to make a green corridor, with a bridge over the road. | The jaguar walks across and the two meet. | A corridor that ends at the road: the jaguar stops and stares at the traffic. | Fewer tiles. | Fox |
| — | See MSE-06 TRAP!, HES-11 PAINT!, HES-12 BALANCE!, HES-13 MELT A FLOE! | Greenhouse effect, albedo, energy balance and feedback (Topics 9.3–9.5). | | | | | | |

### Unit 2: Energy resources and consumption [CED Unit 6: Topics 6.1–6.13]
*Why it matters:* energy engineers, installers and facility managers work with plant efficiency, energy bills, solar and wind every day.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ES-07 | `UPGRADE!` | A power plant loses energy as heat at every stage, so only part of the fuel's energy reaches your lamp. | Glowing energy flows from a coal pile through a boiler, turbine, generator and power lines to a lamp; each stage leaks heat. | Tap the leakiest stage to upgrade it. | Its leak shrinks and the lamp glows brighter; the biggest leak (the turbine's waste heat) matters most. | Upgrading the tiny leak in the wires: the lamp barely changes. | Upgrade two stages with one coin. | Beaver |
| ES-08 | `WARM THE ROOM!` | Power is how fast energy flows; a small heater can do the same job, it just takes longer. | A cold room, a small heater, a big heater and an electricity meter. | Plug in a heater and hold until the room is warm. | The big heater spins the meter fast and warms quickly; the small one spins it slowly for longer. The meter's total is about the same. | Expecting the small heater to be free: the meter keeps spinning the whole time. | A leaky window wastes energy either way. | Hedgehog |
| ES-09 | `UNSHADE!` | Shading even part of a solar panel cuts its power a lot. | A solar panel on a roof with leaves landing on it; a power meter. | Swipe the leaves off. | The meter jumps back up. | Leaving one leaf: the meter stays low, because one shaded cell holds back its whole row. | Leaves keep falling. | Rabbit |
| ES-10 | `CATCH WIND!` | Faster wind gives much more power, and wind is stronger higher up. | A wind turbine on a short tower in a village. | Drag the tower taller. | The blades reach faster wind and spin much faster; the whole village lights up. | Shortening it into the trees: the blades barely turn. | Gusty days. | Bird |
| ES-11 | `DAM!` | Water falling from higher up makes more electricity. | A river, a dam and a dark town. | Stack the dam higher. | Water drops further through the turbine and more of the town lights up. | Building it too low: a trickle, and one porch light. | A dry year lowers the lake. | Beaver |
| ES-12 | `STEADY!` | Control rods keep a reactor's chain reaction steady by catching neutrons. | A reactor core with neutrons multiplying; control rods above. | Slide the rods in or out until the power line stays flat. | Each split atom causes exactly one more split and the power line goes flat. | Pulling them all out: alarms flash and the rods drop in by themselves. | The fuel ages and the reaction drifts. | Owl |
| ES-13 | `PAY OFF!` **[ADDED]** | Solar panels pay for themselves over years, faster where the sun shines more. | A piggy bank shaped like a solar panel; the panel's price tag hangs above it. | Hold to run the years; savings coins drop in. | The bank fills and the price tag pops off; on a sunny roof it pops sooner. | Putting the panel on a shady roof: the coins trickle in and the rabbit grows a beard waiting. | Electricity prices rise. | Rabbit |

### Unit 3: Aquatic and terrestrial pollution [CED Unit 8: Topics 8.1–8.15]
*Why it matters:* water treatment operators, toxicologists and environmental consultants handle doses, food chains and runoff every day.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ES-14 | `SHUT OFF!` | Poisons build up as they pass up a food chain, so top predators get the most. | A pipe drips pesticide into a lake; plankton, small fish, big fish and an osprey with an egg. | Tap the valve to shut off the pipe before the food chain passes the poison up. | The chain plays with only a few dots; the osprey's egg hatches. | Shutting it too late: the dots pile up and glow inside each bigger animal, and the osprey's egg comes out thin and cracks (the chick is fine next time). | Two pipes. | Bird |
| ES-15 | `DOSE!` | The dose makes the poison: a little can be safe, too much harms. | A sick mouse and a medicine dropper. | Squeeze drops into the mouse's water until it perks up. | A few drops: it sneezes, then bounces around. | Squeezing the whole bottle: it gets woozy and lies down (cartoon). | A small mouse needs fewer drops. | Hedgehog |
| ES-16 | `BUFFER!` | Plants beside a field catch fertiliser before it reaches a lake. | A farm sloping to a lake with fish; rain clouds coming. | Plant a strip of reeds along the field's edge. | The rain washes fertiliser into the reeds, not the lake; the lake stays clear. | Skipping it: algae bloom, die and use up the oxygen, and the fish gasp at the surface. | A sewage pipe to close too. | Frog |
| ES-17 | `TREAT!` | Sewage is cleaned in steps: settle the solids, let bacteria eat the waste, then kill germs. | Three treatment tanks scattered beside a pipe from town to river. | Drag the tanks into order along the pipe. | Dirty water settles, then bacteria munch, then UV light zaps germs; clear water reaches the river. | Disinfecting first: the germs hide in the dirt and the river frog holds its nose. | A fourth tank removes nutrients. | Duck |
| ES-18 | `RECYCLE!` | Recycling and composting make a landfill last much longer. | Garbage trucks heading to a landfill; a recycling yard and a compost heap. | Swipe trucks toward the recycling yard and compost heap. | The landfill fills much more slowly. | Sending them all to the landfill: it overflows into the fox's garden. | Trucks come faster. | Fox |
| ES-19 | `COOL!` | Warm water holds less oxygen, so hot water from a power plant can harm fish. | A power plant's warm outflow pipe enters a trout stream. | Turn up the cooling tower until the outflow is cool. | Oxygen bubbles return to the stream and the trout swim back. | Turning it off: the bubbles fizz away and the trout float up gasping. | A heat wave. | Frog |

### Unit 4: Atmospheric pollution [CED Unit 7: Topics 7.1–7.8]
*Why it matters:* air-quality engineers and regulators monitor smog, permit factories and set noise rules.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ES-20 | `CLEAR THE AIR!` | Sunlight turns car exhaust into smog. | A city at rush hour; the sun climbs toward noon. | Swap cars for bikes and buses before the afternoon sun. | The afternoon stays clear and blue. | Leaving the cars: a brown haze builds through the sunny afternoon. | A hot day makes it worse. | Bird |
| ES-21 | `LIFT THE LID!` | A warm layer of air above cooler air traps smoke in a valley. | A smoky valley under a warm "lid" of air. | Tap the sun to heat the valley floor. | The ground warms, the air underneath rises and breaks the lid, and the smoke escapes. | Adding more smoke: it spreads flat under the lid and the owl coughs. | A cold night rebuilds the lid. | Owl |
| ES-22 | `SCRUB!` | Smokestack gas makes acid rain unless it is cleaned out. | A smokestack, a cloud, a marble statue and a lake of fish. | Drag the limestone scrubber onto the smokestack. | The smoke turns clean, the rain stays gentle, and the statue keeps its nose. | Skipping it: acid rain fizzes the statue's nose away and the fish sulk. (Overlap: chemistry) | Two smokestacks. | Frog |
| ES-23 | `HUSH!` | Each step up the loudness scale is much louder, so the loudest sources matter most. | A baby rabbit trying to sleep near a leaf blower, a lawnmower and a ticking clock. | Switch off machines until the baby sleeps. | Switching off the leaf blower first makes the biggest difference and the baby dozes. | Switching off the clock first: the baby still bounces awake. | Earmuffs. | Rabbit |

### Unit 5: Land and water use [CED Unit 5: Topics 5.1–5.17]
*Why it matters:* farmers, fishery managers, stormwater engineers and city planners work with these trade-offs.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ES-24 | `DRIP!` | Drip irrigation puts water at the roots, so much less is wasted. | A dry field, a flood ditch and a coil of drip hose. | Lay the drip hose along the crop rows. | Water beads at each plant's roots and the crops green up while the barrel stays mostly full. | Flooding the field: most water runs off or steams away and the barrel empties. | A dry spell. | Frog |
| ES-25 | `FISH!` | Catching too many fish crashes the population; a moderate catch lasts for ever. | A fishing boat over a school of fish; a net-size slider. | Set the net size and fish for ten seasons. | A medium net keeps the school healthy and the catch steady. | A giant net: one great season, then an empty sea. | A bad breeding year. | Penguin |
| ES-26 | `PROTECT CROPS!` | Natural predators can control pests; spraying everything kills the predators too. | Aphids on crops; ladybugs in a jar; a spray can. | Release the ladybugs. | They eat the aphids and stay; the crop recovers. | Spraying: the ladybugs die too and the aphids bounce back stronger. | Use the spray only on one hot spot. | Ant |
| ES-27 | `SOAK IN!` | Hard surfaces send rain rushing into drains; soil and plants soak it up. | A parking lot; rain clouds; a storm drain about to overflow. | Swap paving tiles for grass and rain gardens. | The rain soaks in and the drain stays calm. | Paving more: the drain gushes over and floods the street. | A bigger storm. | Duck |
| ES-28 | `HOLD BACK!` | A shared field gets ruined if everyone takes more than it can regrow. | Four herders share a meadow; each wants to add sheep. | Hold back your sheep each round. | When everyone holds back, the grass regrows and all the herds stay fat. | Adding sheep every round: the grass vanishes and every herd goes hungry. | A rule the herders can vote for. | Rabbit |
| — | See MSE-10 CUT DOWN! | Ecological footprint (Topic 5.11). | | | | | | |

### Unit 6: Populations [CED Unit 3: Topics 3.1–3.9]
*Why it matters:* planners use population growth to build schools and hospitals, and wildlife managers use it to set hunting and fishing limits.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ES-29 | `DOUBLE!` | Steady growth by doubling starts slow and then explodes. | A jar with two bacteria; a clock ticks. | Tap each tick to let them double. | For a while the jar looks empty; then it fills in just the last few ticks, half full one tick before full. | Expecting it to fill steadily: it is still nearly empty at the halfway mark, then overflows. | A bigger jar barely buys time. | Frog |
| ES-30 | `FILL UP!` | A population grows until food runs short, then levels off. | A meadow with a few rabbits and lots of grass. | Hold to let the rabbits breed. | They multiply fast, then the grass thins and the numbers level off at what the meadow can feed. | Adding rabbits past that: the grass vanishes and the population crashes. | A dry year shrinks the meadow. | Rabbit |
| ES-31 | `TAG!` | You can estimate a population by tagging some animals and seeing how many you catch again. | A murky pond full of fish; a net. | Tag the fish in one netful, release them, then net again. | If few of the second catch have tags, the pond holds many fish; the pond's hidden fish fade in to show it. | Netting twice in the same spot without letting them mix: every fish is tagged and the pond looks tiny. | A pond twice as big. | Duck |
| ES-32 | `AGE!` | A population with many children will grow as they become parents. | An age pyramid with a wide base of children. | Hold to age the population twenty years. | The wide base moves up and becomes a big group of parents with many children of their own. | Expecting the population to shrink: the next base is even wider. | A pyramid with a narrow base. | Owl |
| ES-33 | `FOLLOW!` | When death rates fall, birth rates usually fall later, and the population grows in between. | A birth-rate line and a death-rate line; the death line has just dropped. | Drag the birth-rate line down to meet it. | The gap between them (the growth) closes, and the population curve levels off. | Dragging the death line back up: a sad, wrong fix, and the owl shakes its head. | Stage five: births fall below deaths. | Owl |
| ES-34 | `GUARD!` | Some animals raise a few young carefully; others make thousands and most don't survive. | An oyster scatters a cloud of eggs; a penguin guards one chick. | Swipe away the gulls swooping at the penguin's chick. | The chick grows up safely; meanwhile most of the oyster's eggs get eaten, but a few survive. | Leaving the chick: the gull grabs it (cartoon, it's put back) and the penguin flaps. | Two chicks. | Penguin |

### Unit 7: Earth systems and resources [CED Unit 4: Topics 4.1–4.8]
*Why it matters:* solar siting, water management and seasonal forecasts.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ES-35 | `SLANT!` | Slanted sunlight spreads over more ground, so it warms less. | A flashlight beam shining straight down on a frosty patch. | Tilt the flashlight until the frost stays frozen. | The beam's patch stretches wider and dimmer and the frost stays. | Tilting it back straight: the patch shrinks, brightens and melts the frost. | The poles get slanted light all year. | Turtle |
| ES-36 | `FLOW TO TOWN!` | Rain flows to whichever river is downhill of where it lands; ridges divide watersheds. | Hills with a ridge between two rivers; a town reservoir on one river. | Drop raindrops on the hills to fill the town's reservoir. | Drops on the town's side of the ridge roll into its river and fill the reservoir. | Dropping on the far side: the drops roll to the other river and the reservoir stays low. | A factory upstream: whose water does it reach? | Frog |
| ES-37 | `WEAKEN!` | When the Pacific trade winds weaken, warm water sloshes east: El Niño. | The Pacific; trade winds push warm water west. | Tap the trade winds to weaken them. | The warm pool slides east to South America, the rain follows it, and the fish there leave. | Strengthening them: the warm water piles up in the west instead (La Niña). | Make La Niña on purpose. | Penguin |
| — | See HES-24 SHAKE THE JAR!, HES-26 PULL APART!, MSE-04 BLOW!, MSE-20 WARM UP! | Soil, plates, winds and seasons (Topics 4.1–4.6). | | | | | | |

### Unit 8: Ecosystems [CED Unit 1: Topics 1.1–1.11]
*Why it matters:* fisheries, farming and conservation work all use energy flow and nutrient cycles.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ES-38 | `FEED!` | Only a small share of the energy at each level of a food chain reaches the next, so there are few top predators. | A big field of grass, some rabbits and one hungry fox. | Drag grass to the rabbits and rabbits to the fox. | It takes a lot of grass to feed the rabbits and a lot of rabbits to feed one fox; most energy drifts off as heat wisps. | Trying to feed ten foxes: the rabbits run out and nine foxes sulk. | Add a hawk on top. | Fox |
| ES-39 | `LEVEL OFF!` | Carbon dioxide in the air rises when more goes in than oceans and forests take out. | The atmosphere as a bathtub; taps for fossil fuels; drains for oceans and forests. | Close taps or plant forests until the level stops rising. | The level steadies when the inflow matches the drains. | Opening another tap: the tub creeps up and the turtle's beach floods. | Warm oceans drain less. | Turtle |
| ES-40 | `GRAB!` | Bacteria in bean roots grab nitrogen from the air and turn it into plant food. | Nitrogen molecules in the air above a bean field. | Drag nitrogen into the root nodules. | The bacteria crack it into plant food and the beans green up. | Dragging it straight into the leaves: it bounces off; plants can't use it from the air. | Lightning fixes a little too. | Ant |
| — | See EL-04 MOVE IN!, MSE-12 LIFT!, MSE-13 FILL! | Biomes (harder version), the water cycle and water budget. | | | | | | |

### Unit 9: Biodiversity [CED Unit 2: Topics 2.1–2.7]
*Why it matters:* environmental impact assessments and conservation plans measure species diversity, habitat size and recovery.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ES-41 | `PLANT MORE!` | A community with many species is more stable when trouble comes. | A meadow of only one kind of flower; a pest is coming. | Plant other kinds of flowers among them. | The pest eats only its favourite flower; the mixed meadow stays mostly green. | Planting more of the same flower: the pest eats the whole meadow. | A drought too. | Rabbit |
| ES-42 | `COLONIZE!` | Big islands close to the mainland collect more species. | A mainland full of birds; a big near island and a small far island. | Fling birds toward the islands until one has a full flock. | The big near island fills quickly; birds trying for the small far one splash down short. | Aiming only at the far one: birds flop into the sea and paddle back. | A bridge of stepping-stone islands. | Bird |
| ES-43 | `GROW BACK!` | After a disaster, life returns in stages: lichens, then moss, grass, shrubs and trees. | Bare rock after a glacier retreats. | Drag lichen onto the rock first, then each next plant. | Soil thickens at each stage until a forest stands. | Dropping an oak on bare rock: it topples, with no soil to grip. | A burned forest: the soil is already there. | Rabbit |
| ES-44 | `SHADE IT!` | Each species can live only within a range of conditions. | A trout stream getting warmer under the open sun. | Plant trees along the bank. | Their shade cools the water into the trout's comfortable range and the trout perk up. | Cutting the trees: the stream warms and the trout lie still. | Two species with different ranges. | Frog |
| ES-45 | `SPONGE!` | Wetlands soak up floods for free. | A river heading for a town; drained fields where marshes used to be. | Drag marsh tiles back along the river. | The flood spreads into the marsh and the town stays dry. | Paving the marsh: the flood rushes straight into the town and the duck rows down the street. | A bigger flood. | Duck |

---

## Introductory astronomy (OpenStax "Astronomy 2e")

Source: the table of contents of OpenStax Astronomy 2e (Fraknoi, Morrison, Wolff; 30 chapters), fetched in full from the Universitas Pendidikan Indonesia open-access library's record of the book. All 30 titles are verified, from 1 "Science and the Universe: A Brief Tour" to 30 "Life in the Universe" (the record misspells chapter 10 as "Earthlike Planets: Venus and Marks"; the book says Mars). The section list of chapter 1 was also checked on openstax.org. The chapters are grouped into 13 units, ordered by real-world use: orbits and light first (satellites, sensors, telescopes), then timekeeping, distance, the Sun and space weather, and the survey chapters last. Chapter 8 "Earth as a Planet" is covered by the Earth science units above. The astrophysics course below goes deeper into stars, black holes and cosmology.

### Unit 1: Orbits, gravity and satellites [Ch. 3 Orbits and Gravity; ADDED: satellites]
*Why it matters:* every satellite (GPS, weather, TV, phone networks) is placed and steered with the laws of orbits.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AS-01 | `CATCH UP!` | A lower orbit is faster, so to catch something ahead you drop lower. | A capsule orbiting Earth behind a space station. | Tap the brake to drop into a lower orbit, then boost back up. | The capsule dips low, speeds round the inside track, and rises to meet the station. | Boosting forward: the capsule climbs to a higher, slower orbit and falls further behind. | Dock gently at the end. | Rabbit |
| AS-02 | `PARK!` | A satellite at just the right height circles once a day and stays over one spot. | A TV dish on spinning Earth; a satellite whose orbit height you can change. | Drag the satellite's height until it hovers above the dish. | It locks above the dish and the TV picture comes on. | Too low: it races round many times a day and the TV flickers to snow. | Two dishes far apart. | Penguin |
| AS-03 | `ESCAPE!` | A rocket fast enough leaves Earth for good; slower ones fall back or orbit. | A rocket on a pad; a throttle. | Hold the throttle and let go at the right speed. | Below orbit speed it falls back; a bit faster it circles; fast enough it sails away into space. | Letting go too early: it arcs back and splashes into the sea. | Escape from the Moon (much easier). | Rabbit |
| AS-04 | `SWOOP!` | Orbiting things speed up as they fall close to the Sun and slow down far away. | A comet on a long, stretched orbit. | Swipe the comet around the Sun. | It crawls far out, then whips around the Sun and flings back out. | Swiping at the same speed all the way: the comet falls into the Sun with a fizz. | A planet with a rounder orbit. | Bird |
| AS-05 | `SLINGSHOT!` | A probe can steal speed from a planet by swinging past it. | A probe heading out; Jupiter crossing its path; Saturn far beyond. | Aim the probe to pass just behind Jupiter. | It swings round Jupiter, speeds up and flies on to Saturn. | Aiming too close: it crashes into Jupiter's clouds with a puff. | Two slingshots in a row. | Owl |

### Unit 2: Light, spectra and telescopes [Ch. 5 Radiation and Spectra, Ch. 6 Astronomical Instruments, Ch. 17 Analyzing Starlight]
*Why it matters:* the same physics runs thermal cameras, lab spectrometers, remote-sensing satellites and camera lenses; it is how astronomers learn anything about stars.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AS-06 | `GLOW!` | Hotter things glow a different colour: red, then yellow, then white, then blue. | A cold iron ball in a forge; a dial of heat. | Pump the bellows until the ball glows blue-white. | It glows dull red, then orange, yellow, white and finally blue-white. Star colours tell their temperature. | Pumping only a little: it glows red, and the owl calls it a cool star. | Match three stars' colours. | Owl |
| AS-07 | `STRETCH!` | Light from something moving away stretches toward red. | A star with a wave drawn coming off it. | Drag the star away from you. | Its waves stretch out and it looks redder; dragging it closer squeezes them bluer. | Expecting no change: a siren in the background stretches its sound too. | Make one star red and one blue. | Duck |
| AS-08 | `DROP!` | An electron dropping to a lower level gives off light of one exact colour. | A glowing atom with an electron on a high ring. | Drag the electron down one ring. | A red photon pops out; a bigger drop gives a blue one. | Dragging it up: the atom swallows light instead and a dark line appears. | Make a blue photon. | Owl |
| AS-09 | `SCAN!` | A star's dark lines are a fingerprint of the elements in it. | A star's rainbow with dark lines; element barcodes. | Slide barcodes along until one lines up with the star's lines. | Hydrogen and sodium click into place; the star's ingredients light up. | Forcing a barcode that doesn't fit: lines clash red. | Find three elements. | Owl |
| AS-10 | `CATCH LIGHT!` | A bigger telescope mirror catches more light, so faint things show up. | Starlight falls like rain on a small mirror; a faint galaxy is hidden in the dark. | Drag the mirror bigger. | It catches more drops and the faint galaxy appears. | Zooming in with a small mirror: the image just gets bigger and dimmer. | A city's glow hides the galaxy. | Owl |
| AS-11 | `SHARPEN!` | A bigger telescope can separate two stars that look like one. | Two close stars blur into one blob in a small telescope. | Drag the telescope bigger until the blob splits. | The blob splits cleanly into two stars. | Turning up the zoom instead: the blob just gets bigger. | Air wobble blurs them; move to a mountain. | Owl |
| AS-12 | `GO HIGHER!` | Earth's air blocks X-rays and much infrared light, so some telescopes must go to space. | An X-ray telescope on the ground; a black hole glows in X-rays behind the sky. | Drag the telescope up out of the atmosphere. | Above the air, the black hole's X-ray glow pops into view. | Pointing it harder from the ground: the screen stays blank. | Radio telescopes work fine on the ground. | Bird |

### Unit 3: Earth, Moon and sky; timekeeping [Ch. 2 Observing the Sky, Ch. 4 Earth, Moon, and Sky]
*Why it matters:* calendars, time zones and navigation came from watching the sky, and the first measurement of Earth's size used only shadows.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AS-13 | `CURVE!` | Shadows of the same length at noon would mean a flat Earth; different shadows prove it is curved. | Two sticks in two cities far apart at noon; one shadow is short, one longer. | Bend the ground under the cities until the sunlight matches both shadows. | The ground curves into a globe and both shadows fit; the curve gives Earth's size. | Leaving it flat: the two shadows can't both be right and one stick shrugs. | Match three cities. | Owl |
| AS-14 | `LEAP!` | The year is about a quarter day longer than 365 days, so we add a leap day every four years. | A calendar beside the seasons; the seasons slowly drift. | Tap to add a leap day each time the drift reaches a full day. | The seasons snap back onto the calendar. | Never leaping: after a long time, snow falls in July. | Skip a few leap days per 400 years. | Frog |
| AS-15 | `OVERTAKE!` | Mars seems to loop backwards when Earth passes it on the inside track. | Earth and Mars on their orbits; Mars' position against the stars. | Drive Earth past Mars. | The line of sight swings back and Mars traces a loop on the starry sky. | Expecting Mars to reverse: Mars keeps going forward on the overhead view. | Venus. | Owl |
| — | See MSE-18 ORBIT!, MSE-19 BLOCK!, MSE-20 WARM UP!, HES-17 SAIL!, HES-20 TURN!, HES-21 SIGHT! | Phases, eclipses, seasons, tides, time and latitude. | | | | | | |

### Unit 4: Distances and scale [Ch. 1 Science and the Universe, Ch. 19 Celestial Distances]
*Why it matters:* light-travel time matters to every space mission, and parallax is the same geometry used in surveying and stereo cameras.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AS-16 | `WINK!` | Near things seem to jump more than far things when you change viewpoint. | A thumb held up in front of a far tree. | Tap left eye, right eye, back and forth. | The thumb jumps against the tree; then Earth's orbit does the same trick and a near star jumps against far ones. | Holding the thumb far away: it barely moves, like a distant star. | Find which of three stars is nearest. | Owl |
| AS-17 | `CATCH!` | Light takes time to travel, so we see the Sun as it was minutes ago. | The Sun flares; a telescope on Earth; a light pulse speeds across. | Tap when the flare's light arrives. | The pulse crosses the gap and the telescope flashes; the flare already ended on the Sun. | Tapping when the flare happens: the telescope sees nothing yet. | A star's light that left years ago. | Rabbit |

### Unit 5: The Sun and space weather [Ch. 15 The Sun: A Garden-Variety Star, Ch. 16 The Sun: A Nuclear Powerhouse]
*Why it matters:* solar storms can knock out satellites and power grids; grid operators and satellite teams act on the warnings.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AS-18 | `FUSE!` | The Sun shines by squeezing hydrogen into helium, and a tiny bit of mass becomes light. | Four hydrogen balls in the hot core. | Squeeze them together. | They snap into one helium ball that is a little lighter, and a flash of light bursts out. (Overlap: physics) | Squeezing too gently: they bounce apart. | Keep the flashes coming. | Owl |
| AS-19 | `WARN!` | A solar storm takes a day or more to reach Earth, so there is time to protect the grid. | A plasma cloud leaving the Sun toward Earth; a power grid with a big switch. | Flip the grid to safe mode before the cloud arrives. | The storm hits; transformers stay safe and the lights stay on. | Waiting: sparks fly from a transformer and a town goes dark. | Two storms close together. | Beaver |
| AS-20 | `GUIDE!` | Earth's magnetic field steers solar particles to the poles, where they make auroras. | Solar-wind particles streaming toward Earth's field lines. | Drag particles onto the field lines. | They spiral down to the poles and light green curtains in the sky. | Dropping them at the equator: the field shoves them away. | A storm sends many at once. | Penguin |

### Unit 6: Stars from birth to death [Ch. 18 The Stars: A Celestial Census, Ch. 21 (star birth), Ch. 22 Stars from Adolescence to Old Age, Ch. 23 The Death of Stars]
*Why it matters:* the elements in everything we build were made in stars.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AS-21 | `CLUMP!` | Stars form when gravity pulls a cold gas cloud together until its centre ignites. | A cold dark cloud of gas and dust. | Swipe the gas toward the centre. | The cloud shrinks, spins, flattens into a disc, and a new star lights in the middle. | Swiping a hot cloud: it puffs back out. | The disc makes planets. | Owl |
| AS-22 | `BURN!` | Big stars burn their fuel much faster and die young. | A small red star and a big blue star, each with a fuel tank. | Hold to run time and keep a star shining as long as possible. | The small star sips its fuel and glows for ages; the big one guzzles it and goes out fast. | Choosing the big star to last: its tank drains in a flash. | Pick a Sun-like star. | Turtle |
| AS-23 | `GATHER STARS!` | Most stars sit on one band where hotter stars are brighter. | A starry sky above an empty chart (hot on the left, bright at the top). | Tap stars in the sky to add them to the chart. | Each tapped star drops into its own spot by colour and brightness; after a dozen, a long diagonal band appears, with giants and dwarfs off to the sides. | Tapping only the red stars: they all huddle in one corner and the band never shows. | A star cluster: its band bends where the big stars have died. | Owl |
| AS-24 | `COLLAPSE!` | What a star leaves behind depends on how big it was. | A dying star; you can add mass to it. | Add mass until it collapses into a black hole. | Small: it puffs into a white dwarf. Bigger: a supernova leaves a neutron star. Huge: a black hole. | Stopping small: it becomes a white dwarf and the black-hole meter stays empty. | Make a neutron star exactly. | Owl |

### Unit 7: Black holes and relativity [Ch. 24 Black Holes and Curved Spacetime; ADDED: GPS clocks]
*Why it matters:* GPS works only because engineers correct its clocks for relativity.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AS-25 | `SYNC!` **[ADDED]** | Satellite clocks run at a slightly different rate from ground clocks, so GPS must correct them. | A car following a GPS map; a satellite's clock ticks a little fast. | Tap to correct the satellite clock each time it drifts. | The map pin stays on the road. | Ignoring it: the pin drifts off the road into a lake and the fox drives in circles. | Several satellites. | Fox |
| AS-26 | `COMPRESS!` | Squeeze anything small enough and not even light can escape: a black hole. | A star; a light beam trying to leave it. | Squeeze the star smaller. | The light beam bends more and more, then can't get out; a black shadow forms. | Letting go: it bounces back to a star. | Squeeze Earth to a marble. | Owl |

### Unit 8: Exoplanets [Ch. 21 The Birth of Stars and the Discovery of Planets outside the Solar System]
*Why it matters:* finding planets by their dips in starlight is sensor data analysis, the same skill as reading any signal over time.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AS-27 | `SPOT!` | A planet crossing its star dims the starlight a little. | A star's brightness line scrolling by; somewhere a planet orbits. | Tap each time the line dips. | Each dip lines up with the planet passing in front; the planet appears. | Tapping random wiggles: noise, not a planet, and the owl frowns. | A small planet's tiny dip. | Owl |
| AS-28 | `SETTLE!` | A planet can have liquid water only at the right distance from its star. | A planet you can drag closer to or farther from its star. | Drag it until its oceans are liquid. | Too close, the oceans boil; too far, they freeze; in between, waves lap and a frog swims. | Parking it next to the star: the oceans boil away in puffs. | A brighter star moves the zone out. | Frog |

### Unit 9: Planets, moons and small bodies [Ch. 7 Other Worlds, Ch. 9 Cratered Worlds, Ch. 10 Earthlike Planets: Venus and Mars, Ch. 11 The Giant Planets, Ch. 12 Rings, Moons, and Pluto, Ch. 13 Comets and Asteroids, Ch. 14 Cosmic Samples and the Origin of the Solar System]
*Why it matters:* mission teams live with signal delay, planetary defence watches for asteroids, and the frost line explains where Earth's water came from.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AS-29 | `STEER!` | Radio signals take minutes to reach Mars, so a rover must be steered ahead of time. | A Mars rover rolling toward a rock; your command pulses take a while to arrive. | Tap "turn" well before the rover reaches the rock. | The pulse crawls across space, arrives just in time, and the rover turns. | Tapping at the rock: the command arrives late and the rover bonks it. | Jupiter is even further. | Rabbit |
| AS-30 | `DUNK!` | Saturn is light for its size: it would float in a big enough bath. | A giant bathtub; Earth, Jupiter and Saturn. | Drop the planets in. | Earth and Jupiter sink; Saturn bobs on top like a rubber duck. | Expecting the biggest to float: Jupiter sinks with a gloop. | Make a ring of bubbles. | Duck |
| AS-31 | `SMASH!` | A faster asteroid hits much harder than a slower one of the same size. | A rock, a sandy plain and a crater outline to match. | Fling the rock to dig a crater as big as the outline. | A fast throw blasts out a big crater that fills the outline. | Lobbing it slowly: it makes a tiny dent. | Make a crater with a central peak. | Hedgehog |
| AS-32 | `FLOOD!` | Older surfaces have more craters, because rocks have been hitting them for longer. | Two regions of the Moon being hit by small rocks over time. | Pour lava over one region partway through. | The flooded region ends up smoother, with fewer craters: it is younger. | Flooding at the very end: both look the same. | Count which is older at a glance. | Owl |
| AS-33 | `SHRED!` | A moon that gets too close to a giant planet is pulled apart into rings. | A moon spiralling toward a giant planet. | Drag the moon inward. | Past a dashed line it stretches and breaks into a ring. | Expecting it to crash whole: it shreds first. | A small, strong moon survives. | Owl |
| AS-34 | `FLY BY!` | A comet's tail always points away from the Sun. | A comet near the Sun. | Fly the comet around the Sun. | The tail swings so it always points away from the Sun, even when the comet heads outward tail-first. | Expecting the tail to trail behind: it leads on the way out. | Two tails. | Bird |
| AS-35 | `SNOWBALL!` | Far from the Sun, ice can survive, so giant planets formed out there. | A young solar system disc with ice grains and rock grains. | Gather ice grains into a growing core. | Beyond the frost line ice piles up into a giant core that grabs gas. | Gathering near the Sun: the ice melts away and the core stays small and rocky. | Bring a comet's water to Earth. | Penguin |
| AS-36 | `THICKEN!` | A thick greenhouse atmosphere makes Venus hotter than Mercury, even though it is farther from the Sun. | Mercury, Venus and Mars with thermometers. | Pile gas onto Venus' air. | Venus' thermometer climbs past Mercury's. | Stripping Venus' air: it cools, like Mars. | Give Mars more air. | Turtle |

### Unit 10: Between the stars [Ch. 20 Between the Stars: Gas and Dust in Space] [SHORT]
*Why it matters:* dust reddens starlight the same way the air reddens sunsets.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AS-37 | `REDDEN!` | Dust between the stars scatters blue light, so stars behind it look dimmer and redder. | A white star and a dust cloud. | Drag the dust cloud in front of the star. | The star dims and turns red, like a sunset. | Expecting it to turn blue. | A thick cloud hides it, but an infrared camera still sees it. | Bird |

### Unit 11: The Milky Way and galaxies [Ch. 25 The Milky Way Galaxy, Ch. 26 Galaxies, Ch. 27 Active Galaxies, Quasars, and Supermassive Black Holes, Ch. 28 The Evolution and Distribution of Galaxies]
*Why it matters:* dark matter is one of the biggest open questions in science, and it was found by noticing that galaxies spin too fast.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AS-38 | `HOLD TOGETHER!` | Galaxies spin so fast that they need unseen dark matter to hold them together. | A spiral galaxy spinning faster and faster; its outer stars start to fly off. | Wrap an invisible halo around the galaxy. | With the halo, the outer stars stay on their orbits and the galaxy holds. | Adding only visible stars at the centre: the edges still fly away. | Keep a galaxy cluster together. | Owl |
| AS-39 | `INFLATE!` | Space is expanding, so farther galaxies move away faster. | A balloon with galaxy dots drawn on it. | Blow up the balloon. | Every dot moves away from every other, and the far ones move fastest. | Expecting one centre: every dot sees the same. | Pick a different dot as home. | Bird |
| AS-40 | `MERGE!` | Galaxies collide and merge, making bigger galaxies. | Two spiral galaxies drifting near each other. | Drag them together. | They swirl, fling out tails of stars, and settle into one big round galaxy. | Pushing them apart: nothing happens, and the owl waits a billion years. | Our galaxy and Andromeda. | Owl |
| AS-41 | `FUEL!` | A giant black hole shines as a quasar when gas falls into it. | A sleepy galaxy centre with a giant black hole. | Drop gas clouds onto the black hole. | The gas swirls into a glowing disc and two jets blast out: a quasar. | Missing the black hole: the gas orbits and nothing lights. | Too much gas blows the rest away. | Owl |

### Unit 12: Cosmology [Ch. 29 The Big Bang]
*Why it matters:* the age of the universe comes from rewinding its expansion, a classic example of reasoning from evidence.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AS-42 | `REWIND!` | Running the expansion backward brings every galaxy together at the Big Bang. | Galaxies drifting apart. | Swipe backward to rewind time. | All the galaxies rush together into one hot point. | Rewinding only some galaxies: they don't meet. | Rewind faster to the first atoms. | Turtle |
| AS-43 | `COOL DOWN!` | The early universe's bright glow has stretched into faint microwaves. | A white-hot glow filling a tiny early universe. | Pull to expand the universe. | The glow stretches from white to red to invisible microwaves; an old TV shows the static. | Expecting the glow to vanish: it is still everywhere, just stretched. | The glow's tiny ripples. | Owl |

### Unit 13: Life in the universe [Ch. 30 Life in the Universe]
*Why it matters:* the search for life uses the same kind of rough estimate engineers make with uncertain numbers (see EM).
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AS-44 | `SEARCH!` | Whether we have neighbours depends strongly on how long civilisations last. | A galaxy with sliders for stars with planets, planets with life, and how long civilisations last. | Slide the sliders until another glowing civilisation appears at the same time as ours. | Making civilisations last longer fills the galaxy with many glows at once. | Pushing only "planets with life": glows blink on and off before they can meet. | Two glows close enough to talk. | Owl |

---

## Astrophysics

Source: the owner asked for an astrophysics course covering stars' life cycles, the H–R diagram, fusion, black holes, light-years and parallax, redshift and expansion, dark matter and dark energy, and exoplanets and transits. The units below follow that list. The material matches OpenStax Astronomy 2e chapters 16, 18, 19, 21 to 24, 26 and 29 (titles verified above) taught one level deeper, as in a first university astrophysics course; no separate astrophysics syllabus was fetched. Ideas already played in the astronomy course are referenced, not repeated.

### Unit 1: How a star works [Astronomy 2e Ch. 16, 22]
*Why it matters:* the balance of gravity and pressure inside a star is the same balance engineers design for in fusion reactors.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| APH-01 | `HOLD UP!` | A star is a balance: gravity squeezes in and the heat of fusion pushes out. | A star with arrows of gravity pressing in and a core fire pushing out; a fire knob. | Turn the core fire until the star stops shrinking or swelling. | At the balance the star settles to a steady size. | Too little fire: the star shrinks and heats until fire wins. Too much: it puffs up and cools. The star finds its balance on its own. | The fuel runs low and the balance shifts. | Owl |
| APH-02 | `CHAIN!` | In the Sun, protons fuse step by step into helium, releasing energy at each step. | Loose protons in the hot core; slots for each step of the chain. | Snap the protons together, step by step, into a helium nucleus. | Each snap gives a flash; the last step makes helium and sends two protons back to start again. | Snapping four at once: they bounce apart; it only works in steps. | Keep the chain running fast. | Ant |
| APH-03 | `BOUNCE OUT!` | Light made in the Sun's core bounces around for a very long time before it escapes; then it reaches Earth in minutes. | A photon in the Sun's crowded core. | Tap to bounce the photon toward the surface. | It ricochets through a dense crowd, wandering back and forth, and finally escapes; then it zips to Earth in a blink. A timeline shows the huge wait inside and the short trip outside. | Expecting a straight path: every tap sends it off at random. | Make the crowd thinner near the surface. | Rabbit |

### Unit 2: Life cycles and the H–R diagram [Astronomy 2e Ch. 18, 22, 23]
*Why it matters:* astronomers age star clusters, and so the galaxy, by reading the H–R diagram.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| APH-04 | `AGE IT!` | A Sun-like star moves on the H–R diagram as it ages: main sequence, red giant, white dwarf. | The H–R chart with the Sun sitting on the main band. | Drag the Sun along its life path. | It sits on the band for most of its life, swells up and right into a red giant, then shrinks down to a white dwarf. | Dragging it straight to a black hole: it can't; the Sun is too small. | A big star's path. | Owl |
| APH-05 | `TURN OFF!` | In an ageing star cluster, the biggest stars leave the main sequence first, so the bend shows the cluster's age. | A cluster of stars on the H–R chart. | Hold to age the cluster. | Blue stars peel off the top of the band first; the bend point creeps down as the cluster ages, and an age clock follows it. | Letting go at once: the cluster looks newborn. | Match two clusters' ages. | Turtle |
| APH-06 | `FORGE!` | Big stars fuse heavier and heavier elements in layers until iron, which gives no energy; then the core collapses. | A big star's core; each element layer fuses into the next. | Mash to fuse each layer into the next heavier one. | Helium to carbon to oxygen to silicon to iron, like onion layers; at iron the fire stops and the core caves in. | Trying to fuse iron: the core gets colder, not hotter. | Faster layers. | Beaver |
| APH-07 | `BLAST!` | When the iron core collapses, it rebounds and blows the star apart, scattering new elements. | A collapsing star core. | Tap at the moment of the bounce. | The shock wave blasts the outer layers into space, sprinkling carbon, oxygen and iron for future planets. | Tapping late: the star falls into a black hole and the elements stay inside. | Tap the rhythm of two supernovae. | Owl |

### Unit 3: Black holes and dead stars [Astronomy 2e Ch. 23, 24]
*Why it matters:* gravitational waves and pulsars are now measured by detectors around the world, and pulsar timing is among the most precise clocks known.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| APH-08 | `OVERLOAD!` | A white dwarf that gains too much mass blows up as a supernova. | A white dwarf pulling gas from a companion star. | Drag gas onto the white dwarf. | It grows heavier and heavier and then explodes in a flash brighter than a galaxy. | Pulling gas off it: it shrinks and nothing happens. | Exactly when to stop. | Owl |
| APH-09 | `SPIN UP!` | A collapsing star spins faster as it shrinks, making a pulsar. | A big slow-spinning star core, like a skater with arms out. | Pinch the core smaller. | It spins faster and faster into a tiny neutron star; its beam sweeps past Earth like a lighthouse. | Spreading it out: it slows to a lazy turn. | Tap in rhythm with the pulsar's beat. | Penguin (skating) |
| APH-10 | `SLOW TIME!` | Clocks near a black hole tick slower than clocks far away. | Two clocks: one far away, one you can lower toward a black hole. | Lower the clock toward the black hole. | Its ticks slow down compared with the far clock, and its light turns redder. | Dropping it in: it freezes at the edge and fades. | Bring it back up: it has fallen behind. | Owl |
| APH-11 | `LENS!` | Heavy things bend light, so a galaxy cluster can magnify galaxies behind it. | A faint galaxy far away and a telescope; a heavy galaxy cluster you can move. | Drag the cluster between the galaxy and the telescope. | The faint galaxy's light bends around the cluster into bright arcs and a ring. | Putting the cluster off to the side: the light goes straight and stays faint. | Use the lens to find a hidden planet. | Owl |
| APH-12 | `CHIRP!` | Two black holes spiralling together send out ripples in space that speed up and get higher. | Two black holes circling each other; a detector beeps with each ripple. | Tap in time with the ripples as they speed up. | The beats get faster and higher until the two black holes merge with a final chirp. | Tapping at the old slow beat: you fall behind as the chirp races. | Two neutron stars (longer chirp). | Bird |

### Unit 4: Light-years and the distance ladder [Astronomy 2e Ch. 19, 26]
*Why it matters:* every size and age in astronomy depends on measuring distance, one rung at a time.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| APH-13 | `SHINE!` | A light-year is a distance: how far light travels in a year. | A light pulse leaves Earth; the Moon, the Sun and the nearest star lie ahead. | Hold to let the light travel. | It reaches the Moon in about a second, the Sun in about eight minutes, and the nearest star only after about four years. | Calling a light-year a time: the year clock keeps running while the pulse keeps moving. | A galaxy millions of light-years away. | Rabbit |
| APH-14 | `BUILD LADDER!` | Astronomers measure far distances by building a ladder: each method is checked with the one below. | A ladder of rungs: radar to planets, parallax to near stars, pulsing stars, exploding stars, galaxy redshift. | Stack the rungs in order, from nearest to farthest. | Each rung locks onto the one below and the ladder reaches the far galaxies. | Pulling out the parallax rung: everything above it wobbles and drops. | Fix a cracked rung. | Owl |
| — | See AS-16 WINK! | Parallax. | | | | | | |

### Unit 5: Redshift and the expanding universe [Astronomy 2e Ch. 26, 29]
*Why it matters:* the expansion of space is measured from redshift, and it sets the age of the universe.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| APH-15 | `STRETCH SPACE!` | As space expands, light travelling through it stretches redder. | A light wave travelling across a grid of space. | Pull the grid wider while the wave crosses. | The wave stretches with the grid and arrives redder; the longer the trip, the redder. | Stretching it after the wave has arrived: the wave stays blue. | A wave from the early universe. | Owl |
| — | See AS-07 STRETCH!, AS-39 INFLATE!, AS-42 REWIND! | Doppler redshift, Hubble's law and the age of the universe. | | | | | | |

### Unit 6: Dark matter and dark energy [Astronomy 2e Ch. 26, 28, 29]
*Why it matters:* most of the universe is made of things we cannot see, and finding out what they are is among the biggest open questions in physics.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| APH-16 | `COLLIDE!` | When two galaxy clusters crash, the gas slows down but most of the mass passes through: that unseen mass is dark matter. | Two galaxy clusters, each with pink hot gas and a blue mass glow mapped by bent light. | Smash the clusters together. | The pink gas clouds slam and stall in the middle; the blue mass sails on past with the galaxies. | Expecting the mass to stay with the gas: the bent-light map shows it far ahead. | Map the mass with the lensing game (APH-11). | Owl |
| APH-17 | `SPEED UP!` | The universe's expansion is speeding up, pushed by dark energy. | Far exploding stars that look fainter than expected; an expansion slider. | Slide the expansion until the far stars look exactly as faint as they really are. | Only an expansion that speeds up over time pushes them that far away; a "dark energy" push fades in. | Slowing the expansion: the stars come out too bright. | Watch the galaxies drift apart for billions of years. | Turtle |
| — | See AS-38 HOLD TOGETHER! | Galaxy rotation and dark matter. | | | | | | |

### Unit 7: Exoplanets [Astronomy 2e Ch. 21]
*Why it matters:* planet-hunting instruments are some of the most precise light sensors ever built.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| APH-18 | `WOBBLE!` | A planet tugs its star, making it wobble, which shifts the star's light toward blue and red. | A star with a planet; you can make the planet heavier or bring it closer. | Change the planet until the star wobbles enough for the telescope's light to shift. | The star swings toward and away from us; its light shifts blue, red, blue, and the telescope beeps. | Making the planet tiny and far: the star barely wiggles and the telescope stays quiet. | Two planets at once. | Owl |
| APH-19 | `SNIFF!` | Starlight passing through a planet's air loses colours that reveal its gases. | A planet crossing its star; a spectrum bar on the telescope. | Shine the starlight through the planet's edge. | Water-vapour colours go dark in the spectrum: the planet has water in its air. | Shining it past the planet: the spectrum stays full. | Find methane too. | Frog |
| — | See AS-27 SPOT!, AS-28 SETTLE! | Transits and the habitable zone. | | | | | | |

---

## History of the universe (story course)

Source: OpenStax Astronomy 2e chapter 29 "The Big Bang" and chapters 21, 25 and 28 (titles verified above), with commonly cited dates recalled from memory and not fetched: the universe's age of about 13.8 billion years; the first nuclei within the first 20 minutes; the first atoms and the release of the cosmic background light at about 380,000 years; the first stars after roughly 100 to 200 million years; galaxies seen by the James Webb Space Telescope at about 300 million years; reionization complete by about 1 billion years; the Sun 4.6 billion years ago. The early-time dates are uncertain, and each card should say so. The owner asked for this course to be told as scenes with a scaled timeline.

**The timeline.** All 13.8 billion years are squeezed into one calendar year, from 1 January to midnight on 31 December. After each beat, the calendar fills in to the date of that beat. One day of the calendar is about 38 million years.

### Unit 1: The first moments [the first few minutes]
*Why it matters:* the helium in party balloons was made in the first few minutes of the universe.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HU-01 | `BEGIN!` | The universe began hot and dense and has been expanding ever since. | A single glowing point on a dark calendar page: 1 January. | Tap the point. | Everything bursts outward; it is the same stuff everywhere, getting cooler as it spreads. Calendar: 1 January, 00:00. | Tapping off to the side: there is no outside, and the camera zooms back to the point. | Hold to see it cool. | Owl (narrator) |
| HU-02 | `BLOW UP!` | In the first instant, space stretched enormously, smoothing it out and leaving tiny ripples. | A tiny, wrinkled patch of space. | Spread your fingers fast to stretch it huge. | The wrinkles flatten into gentle ripples, the seeds of every future galaxy. Calendar: still the first instant. | Stretching slowly: the patch stays lumpy. | Find the ripples in the cosmic glow later. | Owl |
| HU-03 | `SNAP!` | In the first minutes, protons and neutrons snapped together into helium, until it got too cool. | Protons and neutrons zipping about; a cooling thermometer. | Snap protons and neutrons into helium before the thermometer drops too low. | About a quarter of the matter becomes helium and the rest stays hydrogen. Calendar: 1 January, still before 00:00:01. | Waiting too long: it cools and the pieces won't stick. | Make a few lithium too. | Ant |

### Unit 2: Light and the first stars [380,000 years to 1 billion years]
*Why it matters:* the cosmic background light is the oldest light we can see, and telescopes like Webb are built to find the first galaxies.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HU-04 | `CLEAR!` | When the universe cooled enough, electrons joined nuclei into atoms and the fog cleared, freeing the light. | A glowing fog of loose electrons; light bounces around in it. | Drag electrons onto nuclei. | Atoms form, the fog clears, and the light streams away; it is still arriving today as the cosmic glow. Calendar: 1 January, about 00:14. | Dragging electrons away: the fog thickens. | Find the glow's ripples. | Owl |
| HU-05 | `PULL IN!` | Gravity pulled gas into the clumps of dark matter, and the first stars lit up. | A dark, smooth universe with faint clumps. | Swipe gas into the clumps. | The clumps fill, the gas heats up, and huge first stars ignite one by one. Calendar: about 3 to 6 January. | Swiping gas out of the clumps: everything stays dark. | The first stars explode quickly. | Owl |
| HU-06 | `JOIN!` | Small clumps of stars merged into the first small galaxies. | Small clusters of stars scattered about. | Drag clusters together. | They merge into small, bright baby galaxies. Calendar: about 9 to 11 January. | Flinging them apart: they drift off alone. | Make a galaxy with a black hole centre. | Owl |
| HU-07 | `LIGHT UP!` | Starlight from the first galaxies cleared the leftover hydrogen fog. | Galaxies glowing inside a thin fog. | Tap galaxies to make them shine. | Clear bubbles grow around each galaxy and join up until the fog is gone. Calendar: done by about 27 January. | Tapping empty space: nothing grows. | More galaxies, faster. | Owl |

### Unit 3: Galaxies, stars and the Sun [1 billion years to today]
*Why it matters:* the carbon and iron in us were made by earlier generations of stars.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HU-08 | `SEED!` | Stars that explode spread heavy elements, and later stars and planets form from that enriched gas. | A gas cloud with a few big stars. | Tap a star to explode it. | Its blast sprinkles carbon, oxygen and iron into the gas; new stars form, sparkling with the new elements. Calendar: from January through the year. | Never exploding them: the gas stays plain hydrogen and helium, and no rocky planets can form. | Keep three generations going. | Beaver |
| HU-09 | `SWIRL!` | Our galaxy settled into a spinning disc with spiral arms. | A big, lumpy spinning cloud of stars and gas. | Spin it faster with a circular swipe. | It flattens into a disc and spiral arms wind out. Calendar: the disc forms around May. | Swiping back and forth: it stays a lumpy ball. | Add a bar in the middle. | Owl |
| HU-10 | `PUSH APART!` | Since a few billion years ago, dark energy has been speeding up the expansion. | Galaxies drifting apart more and more slowly. | Hold to switch on dark energy's push. | The drift stops slowing and starts speeding up. Calendar: from about August. | Letting go: the galaxies coast and slow, which is not what telescopes see. | See APH-17 SPEED UP!. | Turtle |
| HU-11 | `IGNITE!` | The Sun formed when a cloud of gas, perhaps squeezed by a nearby exploding star, collapsed. | A quiet gas cloud; a supernova shock wave approaching. | Push the shock wave into the cloud. | The cloud collapses and the Sun lights up in its centre. Calendar: about 1 September. | Pushing too hard: the cloud is blown apart. | Two clouds; one becomes a twin star. | Owl |
| HU-12 | `STICK!` | Dust around the young Sun stuck together into pebbles, rocks and then planets. | A disc of dust around the newborn Sun. | Swipe dust grains into each other. | They stick into pebbles, pebbles into boulders, boulders into planets; icy giants grow far out. Calendar: about 1 to 2 September. | Swiping too hard: they shatter and you start again. | See HE-01 GATHER! for Earth's own story. | Ant |
| HU-13 | `UNROLL!` | All of human history fits into the last few minutes of the cosmic year. | The cosmic calendar rolled up like a scroll. | Swipe to unroll it to 31 December. | Earth appears in early September, life in late September, dinosaurs on 25 December, and modern humans only in the last eleven minutes before midnight. | Stopping early: the dinosaurs haven't appeared yet and the owl taps its watch. | Zoom into the last second (all of written history). | Owl |

---

## Engineering math and estimation

Source: there is no single standard course with this name, so two real sources set the units. (1) OpenStax "University Physics Volume 1", chapter 1 "Units and Measurement" (fetched on openstax.org): 1.1 The Scope and Scale of Physics, 1.2 Units and Standards, 1.3 Unit Conversion, 1.4 Dimensional Analysis, 1.5 Estimates and Fermi Calculations, 1.6 Significant Figures, 1.7 Solving Problems in Physics. All seven titles are verified. (2) Sanjoy Mahajan's "The Art of Insight in Science and Engineering" (MIT OCW RES.6-011, the textbook for MIT 6.055J "The Art of Approximation in Science and Engineering"): its table of contents (fetched on ocw.mit.edu) is Divide and conquer; Abstraction; Symmetry and conservation; Proportional reasoning; Dimensions; Lumping; Probabilistic reasoning; Easy cases; Spring models. All nine chapter titles are verified. Tolerance stack-up and measurement error are **[ADDED]**. This course teaches the ideas behind estimation, not arithmetic, so some games are about seeing how things scale.

### Unit 1: Estimating by breaking a problem into pieces [UP1 1.5 Estimates and Fermi Calculations; Art of Insight "Divide and conquer", "Probabilistic reasoning"]
*Why it matters:* engineers estimate first to check whether a design is possible and to catch mistakes in long calculations.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EM-01 | `SCOOP!` | You can estimate a huge number by counting a small sample and scaling up. | A giant jar of jelly beans and one small cup. | Scoop one cup, then pour the whole jar into cups. | One cup's beans are counted for you; the jar fills a row of identical cups, so the total is that many cupfuls. | Trying to count every bean: the hedgehog is buried in beans. | Beans of two sizes. | Hedgehog |
| EM-02 | `SLICE!` | A big unknown becomes easy when you split it into pieces you know. | A giant question block "How much pizza does a city eat?" | Swipe to slice the block into smaller blocks: people, slices per person, days. | Each small block shows a picture you can judge; they stack back into an answer about the right size. | Slicing it into blocks you can't judge either: they stay grey question marks. | Find the biggest uncertain slice. | Fox |
| — | See PP-02 ORDER OF MAG! (physics file) | Orders of magnitude on a powers-of-ten ladder. | | | | | | |

### Unit 2: Units and dimensions [UP1 1.2 Units and Standards, 1.3 Unit Conversion, 1.4 Dimensional Analysis; Art of Insight "Dimensions"]
*Why it matters:* unit mistakes are among the most expensive errors in engineering: NASA lost the Mars Climate Orbiter in 1999 when one team's software used pound-force seconds and another expected newton-seconds.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EM-03 | `FILL THE CUBE!` | A bigger unit for volume holds far more of the small ones than you expect, because it grows in three directions. | A 1-metre box and a pile of 1-centimetre cubes. | Swipe to fill one row, then a layer, then the whole box. | One row takes 100 cubes, a layer takes a whole carpet of them, and the box takes a mountain: a million. | Filling only one row and calling it full: the box is still empty above. | Fill a square metre with square centimetres. | Beaver |
| EM-04 | `TIME IT!` | A pendulum's swing time depends on its length, not on its weight. | A pendulum beside a ticking metronome; the bob can be swapped heavier or lighter, and the string made longer or shorter. | Change the pendulum until it swings in time with the metronome. | Changing the string length changes the beat until it matches. | Swapping in a heavier bob: the beat doesn't change at all, and the owl looks puzzled. | A slower metronome. | Owl |
| — | See PP-01 PREFIX! and PP-03 UNIT CHECK! (physics file), A1-04 CANCEL UNITS! (math app) | Prefixes, unit checks and conversions. | | | | | | |

### Unit 3: Tolerances and measurement error [ADDED; UP1 1.6 Significant Figures]
*Why it matters:* every manufactured part has a tolerance, and parts that are each within tolerance can still fail to fit together; every measurement has an error that decides whether a test passes.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EM-05 | `SLOT IN!` | Small size errors add up when parts stack, so a stack can jam even if each part is fine. | Four blocks, each a hair different in size, and a slot they must fit into. | Stack the blocks and slide the stack into the slot. | Mixing long and short blocks, the stack slides in. | Stacking all four long ones: each is fine alone, but together they jam, and the beaver pushes with its tail. | Five blocks. | Beaver |
| EM-06 | `AVERAGE!` | Repeated measurements scatter; averaging many of them homes in on the true value. | A ruler with a wobbly reading; each measurement drops a dot near the true mark. | Tap to measure again and again. | The dots scatter, but their average marker settles close to the true value. | Trusting the first dot: it is off, and the shelf you build is crooked. | A ruler that always reads a bit long (averaging doesn't fix it). | Ant |
| EM-07 | `READ IT!` | A measurement is only as precise as the tool. | A pencil next to a ruler marked only in centimetres. | Drag the reading pin to where the pencil ends. | The pin snaps to the nearest sensible mark; extra digits blur away. | Typing a long string of digits: the extra digits fall off the screen. | A finer ruler gives one more digit. | Ant |

### Unit 4: Scaling [Art of Insight "Proportional reasoning"]
*Why it matters:* scaling a design up or down (a model bridge, a reactor, a drone) changes its strength, weight and heat loss at different rates.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EM-08 | `GROW!` | Making something bigger raises its weight faster than its strength. | A tiny ant lifting a crumb. | Stretch the ant bigger and bigger. | Its weight grows faster than its legs' strength; the legs bow and then buckle. | Expecting it to stay just as strong: the giant ant flops flat. | How much thicker the legs must get. | Ant |
| EM-09 | `HUDDLE!` | Bigger lumps lose heat more slowly for their size, which is why penguins huddle. | Penguins shivering in a blizzard. | Drag the penguins into a tight huddle. | The huddle has less outside surface per penguin, the frost on them melts, and they stop shivering. | Spreading them out: every penguin is all edge and turns blue. | Swap penguins on the cold edge. | Penguin |

### Unit 5: Simple models and sanity checks [Art of Insight "Lumping", "Easy cases", "Symmetry and conservation", "Abstraction", "Spring models"; UP1 1.7 Solving Problems in Physics]
*Why it matters:* engineers replace messy shapes with simple ones to get quick answers, and check results against common sense before anything is built.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EM-10 | `LUMP!` | A simple shape is often close enough to model a complicated one. | A cow in a wind tunnel; the computer is too slow to model every detail. | Drag a simple shape (a box or a ball) over the cow. | The wind test runs instantly and gives almost the same push as the full cow. | Picking a flat sheet: it acts nothing like the cow and flips over. | A bird. | Duck |
| EM-11 | `KEEP LEVEL!` | What goes in, minus what goes out, is what builds up. | A bathtub with a tap and a drain. | Turn the tap until the water level holds still. | The level stops moving when the tap's flow matches the drain's. | Opening the tap all the way: the tub overflows and the duck surfs out. | The drain flows faster when the tub is fuller. | Duck |
| EM-12 | `SPOT IT!` | A result that breaks common sense means there is a mistake somewhere. | A spreadsheet's garden pond drawing floods half the town. | Tap the impossible number. | The bad cell glows; the units were wrong, and the pond shrinks back to garden size. | Accepting it: the town's streets flood, and the frog paddles to work. | A subtler slip: ten times too big. | Frog |
| — | See ME-01 HANG! (abstraction to a free-body diagram) and EE-26 DAMP! (spring model) | | | | | | | |

---

## Intro electrical engineering (Khan Academy "Electrical engineering"; MIT OCW 6.002 and 6.01)

Source: Khan Academy's course "Electrical engineering" (/science/electrical-engineering) could not be fetched. Its topic list was read from a static mirror of KA's site (zubairlk.github.io/ka-static-demo, fetched): Introduction to electrical engineering, Circuit analysis, Amplifiers, Semiconductor devices, Electrostatics, Signals and systems, Home-made robots, Lego robotics, Reverse engineering. KA's circuit-analysis lessons are written by Willy McAllister, whose site spinningnumbers.org (fetched) lists Circuit elements, Resistor circuits, DC circuit analysis, Special topics in DC analysis, Natural and forced response, AC circuit analysis, Special topics in AC analysis, Amplifiers, Semiconductors, Electrostatics and Digital electronics. Those titles are verified on spinningnumbers.org; that KA uses identical titles is likely but not verified. MIT OCW 6.002 "Circuits and Electronics" (Spring 2007) calendar (fetched): 25 lectures, from L1 "Lumped abstraction relationship to physics, KVL, KCL" to L25 "Breaking the abstraction barrier", all verified. MIT OCW 6.01SC "Introduction to EECS I" (fetched): units Software Engineering, Signals and Systems, Circuits (Circuits; Op-Amps; Circuit Abstractions), Probability and Planning. The robotics and reverse-engineering topics are project videos and are not mapped. Practical units added: ratings, fuses, meters and shorts.

### Unit 1: Push, flow and resistance [KA "Introduction to electrical engineering", spinningnumbers "Circuit elements"; 6.002 L1]
*Why it matters:* every electronics project starts with how voltage, current and resistance trade off, and with checking that nothing overheats.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EE-01 | `PUSH!` | A battery's voltage is a push; more push makes more charge flow. | A bulb in a loop with one battery; charges drawn as ants marching through the wire. | Stack batteries into the holder. | Each battery pushes the ants faster and the bulb brightens. (Overlap: physics) | Stacking one backwards: the pushes cancel and the ants stand still. | Too many: the bulb pops (cartoon). | Ant |
| EE-02 | `DIM!` | Resistance slows the flow: a narrower or longer path lets less charge through. | A bright bulb in a loop; a slider that squeezes part of the wire narrow. | Squeeze the wire until the bulb glows softly for a bedtime story. | The ants bunch up at the narrow part and fewer get through; the bulb dims. | Pinching it shut: the bulb goes out and the hedgehog reads in the dark. | A dimmer with a long coiled wire. | Hedgehog |
| EE-03 | `TOAST!` | Current through resistance makes heat; more current makes a lot more heat. | A toaster's thin wires and a slice of bread. | Turn up the current until the bread toasts golden. | The wires glow orange and the bread browns. | Turning it to full: the toast turns to charcoal and the smoke alarm beeps. | Thick wires stay cool at the same current. | Beaver |
| EE-04 | `LAST LONGER!` | A battery holds a fixed amount of charge; a bigger draw empties it faster. | A camping torch with a big bulb; night is long; a battery tank drains. | Swap in a small LED bulb. | The tank drains slowly and the light lasts till dawn. | Keeping the big bulb: the tank empties at midnight and the rabbit is in the dark. | Two lights at once. | Rabbit |

### Unit 2: Series, parallel and dividing the push [KA / spinningnumbers "Resistor circuits"]
*Why it matters:* LED strings, sensors and household wiring are series and parallel circuits, and the voltage divider is one of the most common circuits in electronics.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EE-05 | `WIRE!` | Bulbs side by side (in parallel) each get the full push and stay bright; in a chain (in series) they share it. | Two bulbs, a battery and wires. | Wire both bulbs so they shine brightly. | In parallel, the ants split into two paths and both bulbs glow brightly. | Wiring them in a chain: both glow dimly, and unscrewing one puts out the other. | Three bulbs. | Ant |
| EE-06 | `OPEN A ROAD!` | Adding a parallel path lets more total charge flow. | Ants crowded on one narrow road from the battery. | Drag a second road alongside the first. | The traffic jam clears and more ants arrive each second. | Adding the road in a chain after the first: it gets even slower. | Three roads. | Ant |
| EE-07 | `SHARE!` | Two resistors in a chain share the battery's push, and the bigger one takes the bigger share. | A slide from the battery's top down to ground with two resistor sections; a sensor sits halfway down. | Drag the split point until the sensor gets just enough push to switch on. | The bigger resistor is a longer slide and takes more of the drop; the sensor's light turns on. | Making the top resistor huge: the sensor gets almost nothing and stays dark. | A light sensor that changes the split as the sun sets. | Beaver |

### Unit 3: Ratings, fuses, meters and shorts [ADDED]
*Why it matters:* real parts have limits; choosing parts by their ratings and fusing every circuit prevents fires and dead boards.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EE-08 | `PROTECT!` | An LED needs a resistor in its path, or too much current burns it out. | An LED wired straight to a battery, about to light. | Drag a resistor into its path before you switch on. | The LED glows steadily. | Switching on without it: the LED flashes and pops with a puff. | Pick a resistor that isn't too dim. | Owl |
| EE-09 | `COOL IT!` | A part rated for too little power overheats. | A small resistor in a circuit, starting to smoke. | Swap in the bigger, higher-power resistor. | It stays cool to the touch. | Leaving the small one: it smokes and goes black. | Three sizes; pick the smallest that stays cool. | Hedgehog |
| EE-10 | `FUSE IT!` | A fuse melts first so a short circuit can't overheat the wires. | A wire touches another by accident and starts to glow. | Drag a fuse into the line. | The fuse melts in a blink and the circuit stops; the wires stay cool. | Using a thick wire instead of a fuse: the wire glows red and the wall gets scorched (cartoon). | A fuse that blows too easily at switch-on. | Beaver |
| EE-11 | `PROBE!` | To measure current, the meter must be part of the path; to measure voltage, it goes across. | A bulb in a circuit and a meter with two leads. | Connect the meter so the current runs through it. | The meter's needle swings and shows the current. | Clipping it across the bulb on the current setting: the meter's own fuse pops. | Measure voltage too. | Owl |
| EE-12 | `FIND IT!` | A short circuit is an accidental shortcut that lets current bypass the load. | A circuit where the bulb is dark and the battery is getting hot. | Tap the stray wire that bridges the bulb. | The short is cut; the bulb lights and the battery cools. | Tapping the bulb: it is fine, and the battery keeps heating. | A short hidden under a part. | Fox |

### Unit 4: Kirchhoff's laws [KA / spinningnumbers "DC circuit analysis"; 6.002 L1–L3]
*Why it matters:* every circuit check, by hand or by simulator, rests on charge being conserved at junctions and around loops.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EE-13 | `DIRECT!` | Charge doesn't pile up at a junction: as much flows out as flows in. | Ants pouring into a junction; exit roads with gates. | Open exit gates until the junction stops jamming. | When the ants leave as fast as they arrive, the junction flows smoothly. | Closing all the exits: ants pile up and the junction bursts. | One road flows back in. | Ant |
| EE-14 | `RIDE!` | Around any loop, the battery's lift equals all the drops. | A loop drawn as a hill: the battery is a lift, each bulb is a slide down. | Ride an ant all the way around the loop. | The lift raises it, each slide drops it, and it ends exactly where it started. | Adding a slide with no lift: the ant ends up underground. | Two batteries. | Ant |
| EE-15 | `ONE AT A TIME!` | When two batteries drive a circuit, their effects simply add. | A circuit with two batteries and a bulb. | Switch the batteries on one at a time, then both. | Each battery alone makes a partial glow; both together make the two glows add up. | Pulling a battery out and leaving a gap instead of a plain wire: the circuit breaks. | A battery pushing the other way. | Owl |

### Unit 5: Black boxes and matching [KA / spinningnumbers "Special topics in DC analysis"; 6.002 L3]
*Why it matters:* any battery, sensor or amplifier output can be treated as one push with one resistance, and matching it to the load gets the most power out.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EE-16 | `REPLACE!` | Any messy box of batteries and resistors acts like one battery and one resistor. | A box full of tangled parts powering a bulb; a simple battery-and-resistor pair. | Swap the box for the simple pair. | The bulb glows exactly the same: from outside you can't tell them apart. | Swapping in a bare battery: the bulb glows too brightly. | Three loads; it still matches. | Beaver |
| EE-17 | `TUNE!` | A speaker gets the most power when its resistance matches the amplifier's. | An amplifier and a speaker whose resistance you can change. | Turn the speaker's knob until the music is loudest. | The loudness peaks at the matching setting. | Turning it far either way: the music fades. | A different amplifier. | Bird |

### Unit 6: Digital logic [spinningnumbers "Digital electronics"; 6.002 L4–L5, L15, L24; 6.01 "State machines"]
*Why it matters:* every computer, phone and microcontroller is built from logic gates and memory, and makers wire buttons and sensors to logic inputs every day.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EE-18 | `UNLOCK!` | An AND gate is two switches in a row: both must be on. An OR gate is two side by side: either will do. | A vault door wired to two buttons in a row. | Press both buttons. | The light passes both switches and the vault opens. | Pressing only one: the light stops at the second switch. | An OR door that opens with either button. | Fox |
| EE-19 | `ADD!` | Logic gates can add numbers: a sum light and a carry light. | Two input switches, a sum light and a carry light, and two gates to place. | Drag the right gates onto the lights. | All four input pairs play; switching both on lights the carry, the first step of counting in binary. See X-31 BINARY ADD!. | Using an OR for the sum: one plus one lights "1" and the owl's calculator explodes. | Chain two adders. | Owl |
| EE-20 | `PULL UP!` | An input left unconnected floats and reads random values; a pull-up resistor holds it steady. | A button wired to a chip; the chip's light flickers on its own. | Drag a resistor from the input to the power line. | The light holds steady until the button is pressed. | Leaving it floating: the light flickers like a disco. | A pull-down instead. | Rabbit |
| EE-21 | `LATCH!` | A flip-flop remembers its input only at the tick of the clock. | A data line wiggling up and down; a clock ticking; a memory light. | Tap on each clock tick. | The memory light copies the data only at each tick and holds it in between. | Tapping between ticks: the memory doesn't change. | A faster clock. | Frog |
| EE-22 | `PASS!` | A state machine changes state depending on what happens: a turnstile is locked until a coin comes. | A turnstile and a coin. | Drop a coin, then push through. | The coin unlocks it, you push through, and it locks again behind you. | Pushing without a coin: it stays locked and the penguin bounces off. | A second person tries to sneak through behind you. | Penguin |

### Unit 7: Capacitors, coils and timing [spinningnumbers "Natural and forced response"; 6.002 L13–L14, L16–L17, L20]
*Why it matters:* timers, camera flashes, power-supply smoothing, button debouncing and radio tuning all use capacitors and coils.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EE-23 | `CHARGE!` | A capacitor fills like a bucket through a narrow pipe: fast at first, then slower. | A capacitor drawn as a bucket, filled from the battery through a narrow pipe. | Hold to fill it to the line. | The level shoots up, then creeps more and more slowly. | Letting go early: it is only partly full. | A narrower pipe takes longer. | Beaver |
| EE-24 | `FLASH!` | A capacitor stores energy and can release it all at once. | A camera flash with a charged capacitor. | Tap to fire the flash. | The capacitor dumps its charge in a blink and the flash lights the scene. | Tapping before it charges: a weak flicker. | Faster shots. | Rabbit |
| EE-25 | `SPARK!` | A coil resists sudden changes in current, so breaking its circuit makes a spark. | A coil in a circuit with a switch; current flows like a spinning flywheel. | Flip the switch off. | The flywheel keeps spinning for a moment and a spark jumps across the switch. | Expecting it to stop instantly: the spark makes the hedgehog's spines stand up. | Add a diode to catch the spark. | Hedgehog |
| EE-26 | `DAMP!` | Too little resistance makes a circuit ring; too much makes it slow; just right settles fastest. | A circuit's output bouncing like a car on bad springs. | Turn the resistance until it settles quickly without bouncing. | The output rises and settles smoothly. | Turning it to full: no bounce, but it creeps up very slowly. | A target settling time. | Rabbit |
| EE-27 | `TUNE IN!` | A coil and capacitor ring at one frequency, so a radio can pick one station. | An old radio with crackle; a tuning knob. | Turn the knob until a station comes in clearly. | At the circuit's own ringing frequency, the station's music swells and the crackle fades. | Stopping between stations: two songs mumble over each other. | Two stations close together. | Bird |

### Unit 8: Amplifiers [KA "Amplifiers"; spinningnumbers "Amplifiers"; 6.002 L21–L23; 6.01 "Op-Amps"]
*Why it matters:* op-amps (operational amplifiers) boost sensor signals, mix audio and build filters; they are on almost every analogue board.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EE-28 | `AMPLIFY!` | An amplifier makes a copy of a signal that is bigger. | A mouse's whisper as a tiny wave; a gain knob; a crowd far away. | Turn up the gain until the crowd hears it. | The wave grows taller in the same shape, and the crowd cheers. | Turning it down: the whisper shrinks to nothing and the crowd cups its ears. | Use as little gain as possible. | Bird |
| EE-29 | `FLIP!` | One kind of amplifier turns its input upside down. | A wave going in; a switch between two amplifier wirings. | Wire it the flipping way. | The output wave comes out upside down, peaks where the input had dips. | Wiring the other way: the wave comes out the right way up. | Flip and double the size. | Owl |
| EE-30 | `FUZZ!` | An amplifier can't go past its power rails, so too much gain flattens the wave's tops. | A guitar's clean wave; an amplifier with a gain knob. | Turn up the gain until the guitar sounds fuzzy. | The wave's tops slice flat against the rails and the sound turns into rock-and-roll fuzz. | Leaving it low: clean, gentle strumming. | Find the most gain that stays clean. | Fox |
| EE-31 | `MIX!` | Signals can be added together into one. | Two songs as waves; a mixer. | Drag both songs into the mixer. | One combined wave comes out with both tunes in it. | Unplugging one: only one tune plays. | Turn one song down. | Bird |

### Unit 9: Alternating current [spinningnumbers "AC circuit analysis", "Special topics in AC analysis"; 6.002 L18–L20]
*Why it matters:* mains power, motors, audio and radio use alternating current; electricians and power engineers work with it daily.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EE-32 | `WIGGLE!` | Alternating current pushes charge back and forth, and a bulb still lights. | A bulb on a mains plug; ants in the wire. | Swing the switch to "AC". | The ants rock back and forth instead of marching, and the bulb still glows. | Expecting the ants to need to travel far: they barely move, yet the bulb glows. | A motor turns with the wiggle. | Ant |
| EE-33 | `MATCH THE GLOW!` | A steady current and a wiggling current heat a heater the same when their average effect matches. | An AC heater glowing; a DC heater beside it with a knob. | Turn the DC heater up until it glows the same. | The two glows match, and a label names the AC heater's "effective" voltage. | Matching the AC's peak: the DC heater glows too bright. | A different wave shape. | Hedgehog |
| EE-34 | `TWIRL!` | A spinning arrow's shadow traces a smooth wave, which is how engineers draw alternating current. | An arrow spinning on a dial; a screen beside it. | Spin the arrow. | Its shadow on the screen goes up and down and traces a smooth wave. | Spinning it unevenly: the wave comes out lumpy. | Two arrows add tip to tail. | Owl |
| EE-35 | `FILTER!` | A capacitor and resistor can let slow wiggles through and block fast ones. | A voice signal with a high-pitched hum on top. | Turn the filter knob until the hum is gone but the voice stays. | The fast hum wiggles fade away and the slow voice wave passes. | Turning too far: the voice gets muffled too. | Remove a low rumble instead. | Owl |
| EE-36 | `STRAIGHTEN!` | Current that is out of step with the voltage does less useful work. | A horse on a towpath pulling a barge with a rope at a steep angle. | Swing the rope to point straight along the canal. | Now the whole pull moves the barge and it glides fast. | Pulling straight sideways: the barge bumps the bank and doesn't move forward. | A motor's out-of-step current. | Beaver |

### Unit 10: Semiconductors and transistors [KA "Semiconductor devices", spinningnumbers "Semiconductors"; 6.002 L5–L12]
*Why it matters:* diodes protect circuits and make DC from AC; transistors let a tiny signal switch a big load.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EE-37 | `TURN AROUND!` | A diode lets current through only one way. | An LED in a circuit, not lighting. | Flip the LED around. | Its long leg now faces the battery's plus side and it lights. | Leaving it: the one-way gate blocks the ants. | A diode protecting a circuit from a backward battery. | Ant |
| EE-38 | `SWITCH!` | A transistor lets a tiny signal switch a big current. | A microcontroller's weak pin and a big motor. | Drag the transistor between them. | A tiny trickle from the pin opens the transistor's big gate and the motor roars. | Wiring the motor straight to the pin: the pin's fuse pops. | Add a diode to catch the motor's spark. | Beaver |
| EE-39 | `RECTIFY!` | Diodes turn back-and-forth current into one-way bumps, and a capacitor smooths them. | An AC wave going into a phone charger; four diodes and a capacitor to place. | Drag the diodes into a diamond, then the capacitor across the output. | The wave's bottom halves flip up into bumps, and the capacitor fills the gaps into a smooth line. | Skipping the capacitor: the output is bumpy and the phone screen flickers. | A heavy load drains the capacitor between bumps. | Owl |

### Unit 11: Electrostatics [KA "Electrostatics"] [SHORT]
*Why it matters:* static discharge destroys chips, and electrostatics underlies capacitors and touchscreens.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | See the physics file (charge, field and potential) and EE-24 FLASH! | KA's electrostatics unit is the same material as AP Physics 2 and Physics C: E&M. | | | | | | |

---

## Mechanical and civil engineering (statics, mechanics of materials, thermal-fluids)

Source: three real courses. (1) Statics: the table of contents of "Engineering Statics: Open and Interactive" by Daniel Baker and William Haynes (engineeringstatics.org; fetched from the UPI open-access library record): 1 Introduction to Statics, 2 Forces and Other Vectors, 3 Equilibrium of Particles, 4 Moments and Static Equivalence, 5 Rigid Body Equilibrium, 6 Equilibrium of Structures, 7 Centroids and Centers of Gravity, 8 Internal Loadings, 9 Friction, 10 Moments of Inertia. All ten verified. (2) Mechanics of materials: the MIT catalog description of 2.001 "Mechanics and Materials I" (fetched from MIT's course-search mirror): stress and strain, linear elasticity with thermal expansion, failure modes, applied to rods, shafts, beams and trusses; and of 2.002 "Mechanics and Materials II": plasticity, fatigue, fracture, creep, materials selection. These are catalog topics, not lecture titles. (3) Thermal-fluids: the MIT catalog descriptions of 2.005 "Thermal-Fluids Engineering I" (first and second laws, hydrostatics, Bernoulli, pipe flow, conduction, convection, radiation) and 2.006 "Thermal-Fluids Engineering II" (drag, heat exchangers, power and refrigeration cycles), both fetched; the MITx 2.005.1x page (fetched) confirms the thermodynamics and hydrostatics part. The OCW calendar pages for 2.001 and 2.005 failed to load. Practical units added: safety margins and material choice, failure modes, gears and pulleys.

### Unit 1: Forces in balance [Statics Ch. 1, 3, 5]
*Why it matters:* every structure, machine and lifting job starts with a free-body diagram (one object with every force on it) and the check that the forces balance.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ME-01 | `HANG!` | Something hanging still has forces that balance exactly. | A shop sign and two loose cables. | Drag each cable up to a hook on the wall. | Force arrows appear on the knot: weight down, two cable pulls up; they close into a triangle and the sign hangs still. | Hooking only one cable off to the side: the sign swings and clonks the owl. | Add a gust of wind. | Owl |
| ME-02 | `TIGHTEN!` | A flatter cable needs far more pull to hold the same weight. | A washing line with one wet shirt sagging in the middle. | Pull the line tighter and flatter. | The tension arrows grow huge as the sag shrinks; near flat, the line strains. | Pulling it dead flat: the line snaps and the shirt lands on the duck. | A heavier load. | Duck |
| ME-03 | `SPARE!` | The support closer to a load carries more of it. | A plank on two supports; the right support is cracked. A heavy crate on the plank. | Slide the crate along the plank to keep the cracked support from breaking. | Near the strong left support, it creaks and the cracked one barely notices. | Sliding the crate onto the cracked side: it splinters and the crate slides off. | Two crates. | Beaver |
| ME-04 | `LET IT SLIDE!` | One end of a bridge sits on rollers so it can grow and shrink with temperature. | A bridge deck pinned at both ends; summer is coming. | Swap one pin for a roller. | The deck grows in the heat and rolls a little, staying flat. | Leaving both ends pinned: the deck buckles into a hump and the turtle slides off. | Winter shrinks it back. | Turtle |

### Unit 2: Levers, moments and machines [Statics Ch. 2, 4; ADDED: gears and pulleys]
*Why it matters:* wrenches, gearboxes, bikes and cranes trade force for distance; turning force (moment) decides whether a bolt turns or a crane tips.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ME-05 | `LOOSEN!` | A push farther from the bolt, and at right angles to the handle, turns it more easily. | A stuck bolt and a long wrench. | Push the wrench; choose where and at what angle to push. | Pushing at the end, straight across the handle, the bolt squeaks loose. | Pushing near the bolt, or along the handle: nothing turns and the beaver sweats. | A rusty bolt needs a longer handle. | Beaver |
| ME-06 | `GEAR DOWN!` | A small gear driving a big gear turns slower but stronger. | A bike at the bottom of a steep hill. | Shift to the biggest rear gear and pedal. | The pedals spin easily, the wheel turns slowly and strongly, and the bike climbs. | Staying in the small gear: the rabbit strains and rolls backwards. | A flat road: shift back up for speed. | Rabbit |
| ME-07 | `HOIST!` | More pulleys mean less pulling force, but you pull more rope. | A heavy crate and a set of pulleys. | Thread the rope through more pulleys, then pull. | The crate rises with a gentle pull while a long tail of rope piles up. | Pulling with no pulleys: the beaver lifts its own feet off the ground instead. | A heavier crate. | Beaver |
| — | See P-08 TIP-TO-TAIL! and P-12 COMPONENTS! (math app) | Adding and splitting force arrows. | | | | | | |

### Unit 3: Strength, stretch and choosing materials [MIT 2.001; ADDED: safety margin and choosing a material]
*Why it matters:* "will it break, and how much will it stretch?" is the core question in structural and mechanical design.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ME-08 | `HOLD!` | A thicker rod spreads the load over more material, so it carries more. | A heavy weight to hang from a rod; rods of different thickness. | Hang the weight from a rod that holds. | The thick rod holds steady. | The thin rod: it stretches, necks down and snaps. | A hollow tube that is light and strong. | Ant |
| ME-09 | `PULL!` | Metal springs back when stretched a little, but past a limit it stays bent. | A metal bar with a pull handle. | Pull the bar, then let go. | A gentle pull springs back to its old length. | Pulling past the limit: it stays stretched and droopy, like taffy. | Stop exactly at the limit. | Hedgehog |
| ME-10 | `BEEF UP!` | Engineers make parts stronger than the normal load, because surprises happen. | A crane hook rated for a car; an elephant arrives. | Add material to the hook before the elephant is lifted. | The beefed-up hook lifts the elephant safely. | Leaving it just strong enough for a car: it bends and the elephant lands gently in a pool. | Too much material makes it too heavy to lift itself. | Beaver |
| ME-11 | `PICK!` | Good materials are strong enough and as light as possible for the job. | A bike frame and three materials: nylon, steel and aluminium. | Drag a material onto the frame, then ride. | Aluminium: light and strong, and the rabbit zooms off. | Nylon: the frame folds. Steel: it holds, but the rabbit puffs up the hill. | Add cost. | Rabbit |

### Unit 4: How things break [MIT 2.001 failure modes, 2.002 fatigue and fracture; ADDED]
*Why it matters:* machine parts in service often fail by buckling, fatigue, corrosion or cracking at a sharp corner, so designers check for each one.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ME-12 | `PROP UP!` | Long thin columns bend sideways (buckle) long before they crush. | A sagging roof; a long thin column and a short thick one. | Drag a column under the roof. | The short thick column holds the roof up straight. | The long thin one: it bows sideways and the roof sags. | Add a brace halfway up the thin one. | Penguin |
| ME-13 | `BEND BACK!` | Many small bends break metal that one big pull would not (fatigue). | A paperclip and no tools. | Mash to bend the paperclip back and forth. | A tiny crack grows with each bend and it snaps in two. | Pulling it once, hard: it only straightens. | A spring that must survive a million bends. | Hedgehog |
| ME-14 | `SEPARATE!` | Two different metals touching in salt water corrode. | A steel bolt in an aluminium boat fitting, sprayed with sea water. | Slip a plastic washer between the metals. | The fitting stays shiny through a year of salt spray. | Leaving them touching: the aluminium fizzes away around the bolt. | A scratch in the paint. | Duck |
| ME-15 | `ROUND OFF!` | Cracks start at sharp corners; rounded corners spread the stress. | A bracket with a sharp inside corner, loaded until it starts to crack. | Swipe the corner round. | The stress lines spread smoothly around the curve and the bracket holds. | Leaving it sharp: the stress lines bunch at the point and a crack races in. | A hole in a plate. | Fox |

### Unit 5: Beams [Statics Ch. 8 Internal Loadings, Ch. 10 Moments of Inertia; 2.001 beams]
*Why it matters:* shelves, floors, bridges and machine frames are beams, and a beam's stiffness depends far more on its depth than on its width.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ME-16 | `STAND IT UP!` | A plank is much stiffer on its edge than lying flat. | A plank across a stream; the beaver wants to cross with a heavy log. | Turn the plank onto its edge. | It barely sags as the beaver trundles across. | Leaving it flat: it bends into the water and the beaver gets wet feet. | A narrow plank that tips over sideways. | Beaver |
| ME-17 | `BEND!` | A bent beam squeezes on one side and stretches on the other. | A foam beam with grid lines drawn on its side. | Press down on the middle. | The top lines squeeze together, the bottom lines stretch apart, and the middle line stays the same length. | Pressing at a support: it barely bends. | Press up from below: the sides swap. | Owl |
| ME-18 | `BREAK!` | A beam loaded in the middle breaks in the middle, where the bending is greatest. | A wooden board on two blocks; a karate-chopping fox. | Chop the board. | A chop in the middle snaps it cleanly. | Chopping near a block: the fox's paw stings and the board holds. | A board fixed at one end (a diving board). | Fox |
| ME-19 | `SUPPORT!` | A longer span sags far more, so long shelves need a middle bracket. | A long bookshelf sagging under books. | Drag a bracket under the middle. | The sag vanishes. | Adding more books instead: the shelf droops into a smile and books slide off. | Two brackets. | Owl |
| ME-20 | `HOLLOW OUT!` | Material near a beam's middle does little, so I-beams remove it to save weight. | A heavy solid steel beam. | Swipe away material from the middle of the beam. | It becomes an I shape, much lighter and still as stiff. | Carving from the top and bottom: it goes floppy. | Make the lightest beam that still holds. | Beaver |

### Unit 6: Trusses [Statics Ch. 6 Equilibrium of Structures]
*Why it matters:* roofs, cranes, towers and bridges are trusses: triangles whose members each carry only a pull (tension) or a push (compression).
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ME-21 | `BRACE!` | Triangles hold their shape; squares fold. | A square frame bridge across a gap; a truck is coming. | Drag a diagonal across each square. | The frame becomes triangles and the truck crosses. | Leaving the squares: the frame folds flat and the truck rolls to a stop. | Use the fewest diagonals. | Beaver |
| ME-22 | `PLUCK!` | In a truss some members are pulled tight and some are pushed. | A loaded bridge truss. | Pluck members to find one you can swap for a rope. | Pulled members twang; swapping one for a rope works. | Swapping a pushed member for a rope: it goes slack and the bridge sags. | Two ropes. | Bird |
| ME-23 | `REMOVE!` | Some members in a truss carry nothing under a given load. | A loaded truss with every member painted. | Tap a member to remove it without the truss changing. | The idle member lifts out and nothing moves. | Removing a working one: the truss sags and creaks. | Two idle members. | Owl |

### Unit 7: Balance points and tipping [Statics Ch. 7 Centroids and Centers of Gravity]
*Why it matters:* forklifts, cranes, shelves and trucks tip over when their balance point moves outside their base.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ME-24 | `BALANCE IT!` | Every object has a balance point where its weight acts. | An L-shaped plate and a pencil tip. | Slide the plate until it balances on the pencil. | It balances at a point that isn't the middle of either arm; a dot marks it. | Putting the pencil in the middle of the long arm: it tips over. | A shape with a hole. | Hedgehog |
| ME-25 | `LOAD LOW!` | A low balance point keeps a vehicle from tipping on a turn. | A truck and crates; a sharp bend ahead. | Stack the heavy crates low and in the middle. | The truck leans a little in the bend and keeps going. | Stacking them high: it tips over and crates bounce down the road. | A steeper bend. | Fox |

### Unit 8: Friction [Statics Ch. 9 Friction]
*Why it matters:* brakes, belts, bolts and conveyors all depend on friction, and a rope wrapped round a post can hold a huge load.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ME-26 | `SHOVE!` | Friction pushes back just as hard as you push, up to a limit; then the crate slides. | A heavy crate on a floor. | Push harder and harder until it slides. | The friction arrow grows to match your push, then gives way, and the crate slides. | A tiny push: nothing moves and the beaver thinks the floor is glue. | A rug under the crate. | Beaver |
| ME-27 | `LOOP THE ROPE!` | Each extra wrap of rope around a post multiplies the grip. | A boat tugging at a rope; a post on the dock. | Wrap the rope around the post. | With a couple of wraps, the duck holds the big boat with one wing. | No wraps: the boat drags the duck along the dock. | A stormy gust. | Duck |

### Unit 9: Heat expansion and spinning shafts [MIT 2.001 thermal expansion, shafts]
*Why it matters:* rails, bridges and pipes need room to grow in the heat, and motor shafts must carry their twist.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ME-28 | `MIND THE GAP!` | Metal grows when it gets hot, so rails need small gaps. | Railway rails laid end to end; summer is coming. | Leave a small gap between each rail. | In the heat the rails grow and just close the gaps. | Butting them tight: they buckle into a wiggle and the train wobbles. | Winter: the gaps open wider. | Turtle |
| ME-29 | `TWIST!` | A slow, strong motor twists its shaft hard; a thin shaft can snap. | A motor turning a heavy wheel through a shaft. | Swap in a thicker shaft before the motor starts. | The thick shaft turns the wheel without twisting much. | A thin shaft: it twists like a candy cane and snaps. | Gear the motor down (more twist). | Beaver |

### Unit 10: Water pressure and flow [MIT 2.005 hydrostatics, Bernoulli]
*Why it matters:* dams, water mains, hydraulics and pumps are designed with these ideas.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ME-30 | `SQUIRT!` | Water pushes harder the deeper it is. | A tall bottle with holes at different heights; a thirsty plant far away. | Unplug the hole that reaches the plant. | The bottom hole squirts the farthest and waters the plant. | Unplugging the top hole: it dribbles onto the beaver's feet. | Keep the bottle topped up. | Beaver |
| ME-31 | `BUILD UP!` | Dams are thicker at the bottom because the water pushes hardest there. | A reservoir filling behind a thin wall. | Thicken the wall where the water pushes hardest. | Pressure arrows grow with depth; thickening the base holds them back. | Thickening only the top: the bottom bulges and leaks. | A higher lake. | Beaver |
| ME-32 | `SPRAY!` | When water is squeezed through a smaller opening, it speeds up. | A garden hose dribbling short of the far flowers. | Press your thumb over the hose end. | The water speeds up and sprays across to the flowers. | Opening the end wider: it just glugs out. | Reach two flower beds. | Frog |
| ME-33 | `PUFF!` | Fast-moving air has lower pressure. | Two sheets of paper hanging side by side. | Blow between them. | Instead of flying apart, they swing together. | Blowing on the outsides: they flap away. | A ping-pong ball floating in a hair dryer's stream. | Bird |

### Unit 11: Pipes, flow and drag [MIT 2.005 pipe flow; 2.006 drag]
*Why it matters:* engineers size pumps and fans and estimate how much power cars, cyclists and drones need to push through air.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ME-34 | `OPEN UP!` | Slow flow is smooth; fast flow turns swirly. | A tap pouring a glassy stream; a trickle of dye in a pipe. | Open the tap until the flow turns swirly. | Past a certain speed the glassy stream breaks up and the dye swirls into eddies. | Opening it a crack: the stream stays glassy. | A narrower pipe. | Octopus |
| ME-35 | `SHORTEN!` | Long, narrow pipes rob water of pressure through friction. | A weak shower at the end of a long, skinny pipe. | Replace the pipe with a shorter, wider one. | The shower blasts strongly. | Adding more pipe: the shower drips. | Many bends in the pipe. | Duck |
| ME-36 | `TUCK!` | Air pushes back harder the faster you go, and smooth shapes cut through it. | A cyclist into a headwind. | Tuck the cyclist low and narrow. | The air streams around smoothly and the cyclist speeds up. | Sitting up with arms out: the wind pushes like a wall. | A cape that flaps. | Rabbit |

### Unit 12: Heat, engines and heat pumps [MIT 2.005 first and second laws; 2.006 cycles]
*Why it matters:* every engine, power plant, fridge and heat pump is limited by these laws: energy is conserved, heat flows from hot to cold, and no engine turns all its heat into work.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ME-37 | `HEAT!` | Heat added to a gas can warm it and push a piston. | A gas in a cylinder with a piston and a weight on top. | Hold a flame under the cylinder. | The gas dots speed up and the piston lifts the weight. | Clamping the piston: the gas just gets hotter and the pressure gauge spins. (Overlap: physics) | Lift two weights. | Penguin |
| ME-38 | `POWER UP!` | An engine works by letting heat flow from hot to cold, and a bigger gap does more work. | A heat engine between a hot tank and a cold tank, lifting a weight. | Make the hot side hotter or the cold side colder until the weight lifts. | Heat flows through the engine and lifts the weight; a bigger gap lifts it higher. | Making both sides the same temperature: the engine stops dead. | Lift with the least fuel. | Beaver |
| ME-39 | `MOVE HEAT!` | A heat pump carries heat from cold outdoors into a warm house. | A cold garden, a chilly house and a heat pump between them. | Switch on the heat pump. | It scoops heat out of the cold garden and pours it into the house; the house warms using little electricity. | Expecting the garden to have no heat to give: the pump finds some anyway. | A freezing night. | Hedgehog |
| ME-40 | `RELEASE!` | Heat and gas spread out by themselves and do not un-spread on their own. | A box with gas on one side behind a divider. | Pull out the divider. | The gas spreads evenly through the whole box. | Trying to push it back: it springs right back out. | A hot and a cold block touching. | Owl |

### Unit 13: Heat transfer and insulation [MIT 2.005 conduction, convection, radiation; 2.006 heat exchangers]
*Why it matters:* building and mechanical engineers insulate buildings, cool electronics and design heat exchangers every day.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| ME-41 | `STIR!` | Metal carries heat quickly; wood carries it slowly. | A pot of hot soup; a metal spoon and a wooden spoon. | Stir with a spoon. | The wooden spoon stays cool in the fox's paw. | The metal spoon: heat races up it and the fox yelps. | A spoon with a plastic handle. | Fox |
| ME-42 | `INSULATE!` | Insulation slows heat leaking out of a home. | A cosy burrow losing heat through its walls on a snowy night. | Drag insulation layers into the walls. | The heat arrows leaking out shrink and the burrow stays warm. | Leaving a gap: the heat streams out of the gap. | A window. | Hedgehog |
| ME-43 | `FAN!` | Moving air carries heat away faster. | A hot computer chip glowing red. | Spin up a fan over it. | The flowing air carries the heat away and the chip cools. | Blocking the airflow: it glows hotter. | A heat sink with fins. | Owl |
| ME-44 | `REVERSE!` | Running two pipes in opposite directions swaps heat better. | A hot pipe and a cold pipe side by side, both flowing the same way. | Flip the cold pipe's direction. | The cold water now leaves almost as hot as the hot water arrived. | Leaving them the same way: the two only meet in the middle temperature. | A shorter exchanger. | Beaver |
| — | See AS-06 GLOW! and HES-12 BALANCE! | Heat radiation. | | | | | | |

---

## Chemical engineering: mass and energy balances (Felder and Rousseau, "Elementary Principles of Chemical Processes")

Source: the table of contents of Felder, Rousseau and Bullard, "Elementary Principles of Chemical Processes" (4th edition), read from the Wentworth Institute library catalogue record (fetched): What some chemical engineers do for a living; Introduction to engineering calculations; Processes and process variables; Fundamentals of material balances; Single-phase systems; Multiphase systems; Energy and energy balances; Balances on nonreactive processes; Balances on reactive processes; Balances on transient processes; Computational techniques; Physical property tables. All 12 titles are verified; the record does not number them, so the chapter numbers below are by order. This book is the standard text for the first chemical engineering course. Chapter 1 is a career overview, chapter 11 is numerical methods and chapter 12 is reference tables, so they get no games. Practical units added: scale-up, dilution and process safety.

### Unit 1: What goes in comes out [Ch. 4 Fundamentals of Material Balances]
*Why it matters:* "what goes in must come out, or build up" is the first check on any plant, recipe scale-up, water treatment step or pharmaceutical batch.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| CE-01 | `BLEND!` | A mix ends up closest to whichever stream you put more of. | Two pipes of juice, one weak and one strong, flowing into a jug with a target sweetness mark. | Open the two valves to hit the target. | More of the strong pipe tips the colour to the target, and the frog sips happily. | Opening only the weak pipe: the juice is watery and the frog pulls a face. | Three pipes. | Frog |
| CE-02 | `BOIL DOWN!` | Boiling off water leaves everything else behind, more concentrated. | A pan of thin sugar water over a flame. | Hold the heat until it thickens into syrup. | Steam rises, the sugar grains stay, and the syrup turns thick and golden. | Boiling too long: the syrup burns to toffee rock. | Stop exactly at syrup. | Hedgehog |
| CE-03 | `LOOP BACK!` | Recycling what didn't react means nothing is wasted. | A reactor that changes only some of its marbles each pass; leftovers spill into a bin. | Connect a pipe from the leftovers back to the reactor's inlet. | The leftover marbles circle back until every one has reacted. | Sending them to the bin: half the marbles pile up as waste. | A purge for an unwanted marble type. | Beaver |
| CE-04 | `PLUG!` | If more goes in than comes out, it is leaking or building up somewhere. | A pipe network where the outflow is less than the inflow. | Find and tap the leak. | The drip stops and the in and out flows match. | Turning up the inflow instead: more water sprays from the leak. | A tank quietly filling instead of a leak. | Duck |

### Unit 2: Reactions and burning [Ch. 9 Balances on Reactive Processes, and the reaction sections of Ch. 4]
*Why it matters:* furnaces, boilers, engines and fertiliser plants depend on the right fuel-to-air ratio and on which ingredient runs out first.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| CE-05 | `PAIR UP!` | A reaction stops when one ingredient runs out; the others are left over. | Nitrogen and hydrogen balls; each ammonia needs one nitrogen pair and three hydrogen pairs. | Snap sets together into ammonia until you can't. | The nitrogen runs out first and extra hydrogen is left over. (Overlap: chemistry) | Adding more hydrogen: it just piles up with nothing to pair with. | Start with too little hydrogen instead. | Ant |
| CE-06 | `ADD AIR!` | Burning cleanly needs enough air; too little makes soot and poisonous carbon monoxide. | A gas burner with a smoky yellow flame. | Open the air valve until the flame burns blue. | The flame turns crisp and blue and the pot heats faster. | Closing it: the flame turns yellow, soot coats the pot, and a carbon monoxide alarm beeps. | Too much air cools the flame. | Hedgehog |

### Unit 3: Heating, boiling and mixing [Ch. 7 Energy and Energy Balances, Ch. 8 Balances on Nonreactive Processes]
*Why it matters:* heating, boiling and cooling are the biggest energy costs in a plant, and the same ideas size a home water heater.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| CE-07 | `SLOW THE FLOW!` | A heater warms slow-flowing water more than fast-flowing water. | A shower with a small heater; the water comes out cold. | Turn down the flow. | Each bit of water spends longer in the heater and the shower runs hot. | Turning the flow up: it gets icier and the penguin loves it, everyone else doesn't. | Two showers at once. | Penguin |
| CE-08 | `BOIL!` | While water boils, its temperature stays put; the heat goes into turning it to steam. | A kettle on a stove with a thermometer. | Hold the heat on. | The thermometer climbs, then stops at boiling and stays there while steam pours out. | Letting go when it stops rising: the water was boiling all along. | A mountain kettle boils cooler. | Duck |
| CE-09 | `RUN A BATH!` | Mixed water ends up between the two temperatures, closer to whichever you add more of. | A bath with a hot tap and a cold tap; a duck that likes it warm. | Run both taps to make it just right. | More hot than cold makes it warm; the duck floats in bliss. | Only cold: the duck shivers. Only hot: it hops out steaming. | A bath with ice cubes. | Duck |
| — | See ME-37 HEAT!, ME-44 REVERSE! | Energy into gases; heat exchangers. | | | | | | |

### Unit 4: Filling and flushing tanks [Ch. 10 Balances on Transient Processes]
*Why it matters:* filling and draining tanks, starting up a plant and flushing a contaminated tank are everyday operating jobs.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| CE-10 | `TOP UP!` | A tank fills only if more flows in than flows out. | A tank with an inlet tap and a leaky outlet. | Open the inlet until the level climbs to the line. | When the inflow beats the outflow, the level rises to the line. | Opening the outlet instead: the tank empties. | The outlet flows faster as the tank fills. | Beaver |
| CE-11 | `FLUSH!` | Flushing a tank with clean water clears it fast at first, then slowly; it never reaches perfectly clean. | A tank of dyed water with a clean inlet and a drain. | Hold to flush with clean water. | The colour fades quickly, then more and more slowly. | Letting go early: the tank is still pink. | Flush two tanks in a row. | Octopus |

### Unit 5: Vapours and separation [Ch. 5 Single-Phase Systems, Ch. 6 Multiphase Systems]
*Why it matters:* distillation, drying and air conditioning all depend on how liquids turn to vapour.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| CE-12 | `DISTILL!` | Liquids that boil at lower temperatures can be boiled off first and separated. | A still with a mix of two liquids; a heat knob; a collecting jar at the top. | Turn the heat until only the first liquid boils up. | Its vapour climbs and drips into the jar, and the other liquid stays below. | Turning the heat to full: both boil over and the jar gets a muddle. | Separate three liquids. | Beaver |
| CE-13 | `PRESSURE COOK!` | Water boils at a higher temperature under higher pressure. | A pot of beans on a high mountain, boiling but still hard. | Clamp a pressure-cooker lid on. | The pressure rises, the water gets hotter before boiling, and the beans cook soft. | Taking the lid off: the beans stay crunchy. | Open the valve safely. | Fox |
| — | See MSE-03 CHILL!, HES-07 HIDE THE PEAK! | Water vapour, humidity and dew point. | | | | | | |

### Unit 6: Scale-up, dilution and safety [ADDED]
*Why it matters:* engineers estimate plant sizes and costs, prepare solutions in the lab, and design every process so one failure cannot cause a disaster.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| CE-14 | `GO BIG!` | A bigger tank holds more for each bit of wall, but it is harder to cool. | A small tank of warm reacting liquid; a size slider. | Grow the tank to make more product. | It holds much more product for not much more steel; its cooling jacket has to work harder. | Growing it without more cooling: it overheats and the alarm flashes. | Add cooling coils inside. | Beaver |
| CE-15 | `WATER DOWN!` | Adding water spreads the same amount of dye through more liquid, so it gets paler. | A small flask of dark dye and a big flask with a fill line. | Pour the dye into the big flask and top it up with water. | The colour pales as water rises to the line; the same dye is now spread out. (Overlap: chemistry) | Pouring water into a full small flask: it overflows. | Make it exactly half as dark. | Frog |
| CE-16 | `VENT!` | A relief valve lets out pressure safely before a tank bursts. | A reactor's pressure needle climbing as its cooling fails. | Fit a relief valve on the tank. | The valve pops open at its limit and vents safely to a catch tank. | Fitting it on the cooling pipe: the tank bulges like a balloon. | Two failures at once. | Owl |
| CE-17 | `KEEP COOL!` | Some reactions make heat that speeds them up, so cooling must keep up or they run away. | A reactor whose temperature creeps up; a cooling valve. | Open the cooling to hold the temperature steady. | The temperature levels off and the reaction runs calmly. | Waiting: the reaction heats itself faster and faster and the needle races. | A faster reaction. | Penguin |

---

## Signals and control (MIT OCW 6.003 "Signals and Systems"; 6.01 "Signals and Systems")

Source: the lecture notes page of MIT OCW 6.003 "Signals and Systems" (Fall 2011), fetched: 25 lectures, from 1 "Signals and Systems" and 3 "Feedback, Poles, and Fundamental Modes" through 9 "Frequency Response", 10 "Feedback and Control", 12–13 "CT Feedback and Control", 14–20 Fourier representations, 21 "Sampling", 22 "Sampling and Quantization", 23–24 "Modulation" and 25 "Audio CD". All 25 titles are verified. MIT OCW 6.01SC's unit "Signals and Systems" (fetched) adds "Characterizing System Performance" and "Designing Control Systems"; its wall-finding robot is the model for SC-01. KA's "Signals and systems" topic (seen on the static mirror) covers the same ideas. Pulse-width modulation and moving-average smoothing are **[ADDED]**: they are what makers and embedded engineers use most.

### Unit 1: Feedback and control [6.003 L3, L10, L12–13; 6.01 "Designing Control Systems"]
*Why it matters:* thermostats, cruise control, drones, robots and chemical plants all hold their targets with feedback.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| SC-01 | `APPROACH!` | Feedback steers by the error: the farther from the target, the harder the correction. | A robot driving toward a wall using its distance sensor; a gain knob. | Turn the gain until the robot stops right at the line. | Medium gain: it slows as it nears the line and stops on it. | Too little: it creeps for ever. Too much: it overshoots, bumps the wall and backs up again and again. | A slippery floor. | Rabbit |
| SC-02 | `HOLD TEMP!` | An on-off thermostat keeps a room near the target by switching the heater on and off. | A chilly room, a heater and a thermostat. | Tap the heater on when the room gets cold and off when it gets warm. | The temperature wiggles in a narrow band around the target. | Leaving it on: the room gets stuffy. | Automate it with a dead band so it doesn't flicker. | Hedgehog |
| SC-03 | `ADJUST!` | A delay in the loop makes people and controllers overshoot. | A shower whose temperature takes a few seconds to respond to the tap. | Turn the tap a little, wait, then adjust again until the water is just right. | Small, patient turns settle on warm water. | Spinning the tap every time the water feels wrong: scalding, freezing, scalding, and the duck hops in and out. | A longer delay. | Duck |
| SC-04 | `STOP THE HOWL!` | When feedback makes each echo bigger than the last, the system runs away. | A microphone too close to a loudspeaker; a squeal is building. | Pull the microphone back until the squeal dies. | Each loop round now comes back smaller and the squeal fades away. | Pushing it closer: the squeal screeches and the bird covers its ears. | A gain knob instead of distance. | Bird |
| SC-05 | `CLOSE THE GAP!` | A controller that only reacts to the error leaves a small gap; adding a "remember the past error" part closes it. | A water tank that must hold a level while a drain leaks steadily; a controller with a P knob and an I knob. | Turn up the I knob until the level sits exactly on the line. | The leftover gap slowly fills in and the level settles right on the mark. | Turning up only the P knob: the level sits just below the line no matter what. | Too much I: it overshoots and sloshes. | Beaver |

### Unit 2: How systems respond [6.003 L1–2, L4–8; 6.01 "Signals and Systems", "Characterizing System Performance"]
*Why it matters:* every sensor reading is smoothed, filtered or delayed by a system, and engineers need to know what it does to the signal.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| SC-06 | `CLAP!` | A system's reaction to one quick kick (its impulse response) tells you how it will react to anything. | A canyon with echoing walls. | Clap once. | The echoes come back softer and softer; the echo pattern is the canyon's fingerprint. | Clapping nonstop: the echoes blur together and you can't hear the pattern. | A canyon whose echoes grow (unstable). | Fox |
| SC-07 | `SMOOTH OUT!` **[ADDED]** | Averaging the last few readings smooths a jittery sensor, but makes it react later. | A jumpy temperature line on a screen; a window-width slider. | Widen the averaging window until the line is smooth. | The jitter melts into a smooth line that lags slightly behind real changes. | Making the window huge: the line is smooth but reacts far too late to a real jump. | A sudden real jump to catch. | Owl |

### Unit 3: Frequencies [6.003 L9, L11, L14–20]
*Why it matters:* audio equalisers, noise filters, music apps and vibration analysis all work by splitting signals into frequencies.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| SC-08 | `STACK WAVES!` | Any repeating shape can be built by adding smooth waves of different speeds. | A target square wave and a tray of smooth waves, each faster and smaller. | Drag waves onto the stack. | Each wave added makes the shape squarer, with steeper sides and flatter tops. | Adding only the slow wave: a gentle hill, not a square. | Build a sawtooth. | Octopus |
| SC-09 | `UNTANGLE!` | A sound can be split into the pitches that make it. | A chord playing as one wiggly wave; a prism. | Drag the wave through the prism. | It fans out into three separate pitches, each with its own bar. | Dragging it around the prism: it stays one tangled wave. | Find the off-key note. | Bird |
| SC-10 | `SWEEP!` | A filter lets some frequencies through and cuts others. | A tone generator and a filter; a speaker. | Slide the tone from low to high. | Low tones pass loud; above the cut-off point they fade quickly. | Expecting every tone to pass: the high squeak goes silent. | Find the cut-off by ear. | Rabbit |

### Unit 4: Sampling [6.003 L21–22, L25]
*Why it matters:* every microphone, camera and sensor turns smooth signals into numbers by sampling them, and sampling too slowly gives false results.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| SC-11 | `SAMPLE!` | To capture a wave you must sample it often enough, at least twice per wiggle. | A wave rolling past; each tap drops a dot on it. | Tap fast to catch the wave's shape. | Connecting the dots redraws the wave faithfully. | Tapping too slowly: the dots trace a slow, wrong wave. | A faster wave. | Frog |
| SC-12 | `STOP THE WHEEL!` | Sampling too slowly can make fast motion look slow, still or backwards. | A spinning wagon wheel filmed by a camera with a frame-rate knob. | Turn the frame rate until the wheel looks frozen. | At just the right rate, the wheel looks still on screen though it is spinning fast. | Going a bit slower: the wheel seems to roll backwards and the fox rubs its eyes. | Make it look backwards on purpose. | Fox |
| SC-13 | `ADD BITS!` | More bits per sample make finer steps, so recordings sound smoother. | A smooth song wave redrawn as a coarse staircase. | Add bits until the staircase looks smooth. | The steps shrink and the crunchy sound turns clear. | Removing bits: the song turns into a robot's crackle. | Balance bits against file size. | Bird |

### Unit 5: Carrying signals [6.003 L23–24; ADDED: pulse-width modulation]
*Why it matters:* radio broadcasting uses modulation, and nearly every LED dimmer and motor speed controller uses pulse-width modulation.
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| SC-14 | `BROADCAST!` | A voice can ride on a fast radio wave by changing the wave's size. | A fast carrier wave on a radio tower; a microphone. | Sing into the microphone. | The carrier's top and bottom edges ripple in the shape of the voice and fly out to a radio, which plays the song. | Not singing: the radio hisses with nothing to play. | Two stations on different carriers. | Bird |
| SC-15 | `FLICKER!` **[ADDED]** | Switching an LED on and off very fast dims it: the longer the on-time, the brighter it looks. | An LED and a switch you can tap in rhythm. | Tap a fast rhythm with short or long on-times to set the brightness to a target. | Short on-times look dim and long ones bright; too fast to see flicker, it looks smooth. | Tapping slowly: the LED blinks like a disco. | Fade it up and down smoothly. | Frog |

---

## Build these first

Ten games that look most fun and teach the most, one per idea, spread across the courses:

| Rank | Game | Why |
|---|---|---|
| 1 | MSE-01 `PLOUGH!` | A big, satisfying shove that makes a thunderstorm; weather fronts are an idea people use every day. |
| 2 | ES-02 `OVERFLOW!` | A real surprise (melting floating ice doesn't raise the water) that players remember and repeat to friends. |
| 3 | AS-01 `CATCH UP!` | Braking to go faster is the most counter-intuitive fact about orbits, and the player discovers it with one tap. |
| 4 | ME-21 `BRACE!` | Squares folding and triangles holding is the core idea of every bridge and roof, with a truck as the test. |
| 5 | HES-06 `ROLL DICE!` | Mashing dice for 100 houses gives a feel for rare risks that no formula does, and it matters to every homeowner. |
| 6 | SC-04 `STOP THE HOWL!` | Everyone has heard microphone feedback; pulling the mic back makes feedback loops obvious. |
| 7 | EE-30 `FUZZ!` | Turning a clean guitar into rock fuzz teaches clipping, and the "fail" is the fun part. |
| 8 | ME-16 `STAND IT UP!` | Turning a sagging plank on its edge is the simplest way to show why beam depth matters. |
| 9 | SC-12 `STOP THE WHEEL!` | The wagon-wheel effect is a real illusion the player creates and controls; it explains aliasing in every camera and sensor. |
| 10 | HE-12 `HIDE!` | The asteroid scene is the most dramatic beat of the Earth story, and saving the small mammals shows why mammals took over. |

---

## Self-review

Every row was checked against the owner's rules (a goal the command names, one action, the idea visible on screen, a funny fail that also shows the idea, no question, no calculation, clear to a newcomer). The file was rewritten in full three times as the owner's rules changed (earlier drafts are in the session scratchpad, not in the repo). In the last pass these rows were rewritten:

- **Guessing or "which one" games turned into goals:** MSE-07 `SPIN!` (was "tap umbrella or not"), MSE-20 `WARM UP!` (was "drag Earth to where the town has summer"), MSE-21 `ROLL!` (was "place the marble where you think"), HES-05 `ERUPT!` (was "tap the volcano that will explode"), HES-07 `HIDE THE PEAK!` (was "drag a cloud to where clouds start"), HES-15 `SOAK!` (was "the layer you think will give water"), HES-19 `SLED!` (was "drop the ball where it rolls fastest"), HES-29 `TIP!` (was "drag the rocks onto a balance").
- **Sorting that read like a quiz turned into actions:** EL-07 `WAIT FOR IT!` (was putting Moon shapes in order), EL-09 `FAST-FORWARD!` (was sorting cards into fast and slow), MSE-24 `PILE ON!` (was dropping layers in the right order), AS-23 `GATHER STARS!` (was dragging stars to the right place on the H–R chart).
- **Weak fails fixed:** EL-13 `DIG!` had no fail; ES-14 `SHUT OFF!` had a fail that was really the fix; EE-28 `AMPLIFY!` pointed to another game instead of having its own fail.
- **Commands:** 21 commands that repeated across courses were renamed so that each verb names one game (for example HES-03 `RUMBLE!`, HES-13 `MELT A FLOE!`, ME-27 `LOOP THE ROPE!`), and ES-44 was shortened to `SHADE IT!` to fit 15 characters.
- **Claims:** "the most-used circuit", "most machine parts fail by" and "depends most on" were softened to statements that can be backed.

Rows that pass the rules but should be play-tested early, because their goal may be less obvious from the first frame: EL-04 `MOVE IN!`, EL-17 `CHOOSE!`, ES-17 `TREAT!`, HES-32 `MATCH!`, EM-02 `SLICE!`, APH-14 `BUILD LADDER!`, APH-17 `SPEED UP!` and AS-44 `SEARCH!`.

---

## Sources

Pages fetched for this file (unit titles quoted above came from these):
- College Board, "AP Environmental Science Course Overview": https://apcentral.collegeboard.org/media/pdf/ap-environmental-science-course-overview.pdf
- UWorld, "AP Environmental Science units, topics and key concepts": https://collegeprep.uworld.com/ap/ap-environmental-science/units-topics-and-key-concepts/
- Alaska Department of Education, "Middle School Earth and Space Science" standards: https://education.alaska.gov/standards/science/Middle%20School%20Earth%20and%20Space%20Science.pdf
- UCSB Science Curriculum, Earth science page (MS-ESS codes): https://scsp.chem.ucsb.edu/earth
- Khan Academy MS Earth and space science lesson and unit labels (mirrored video pages): https://trade.zatu.com/weather-weather-and-climate-middle-school-earth-and-space-science-khan-academy.html and https://trade.zatu.com/the-solar-system-earth-in-space-middle-school-earth-and-space-science-khan-academy.html
- California Department of Education, CAA science HS-ESS document: https://www.cde.ca.gov/ta/TG/ca/documents/caa-sci-hsess.docx
- Wikibooks "High School Earth Science" table of contents (Kiwix mirror): https://kwx.liehendr.com/content/wikibooks_en_all_maxi_2021-03/A/High_School_Earth_Science
- OpenStax Astronomy 2e table of contents (UPI library record): https://oalib-perpustakaan.upi.edu/Record/OTLid0000390/TOC
- OpenStax University Physics Volume 1, chapter 1: https://openstax.org/books/university-physics-volume-1/pages/1-introduction
- MIT OCW RES.6-011 "The Art of Insight in Science and Engineering": https://ocw.mit.edu/courses/res-6-011-the-art-of-insight-in-science-and-engineering-mastering-complexity-fall-2014/pages/open-textbook/
- MIT OCW 6.055J syllabus: https://ocw.mit.edu/courses/6-055j-the-art-of-approximation-in-science-and-engineering-spring-2008/pages/syllabus
- Khan Academy electrical engineering topics (static mirror): https://zubairlk.github.io/ka-static-demo/Science/Electrical_engineering/index.html
- spinningnumbers.org (Willy McAllister's circuit-analysis site): https://spinningnumbers.org/
- MIT OCW 6.002 calendar: https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/pages/calendar/
- MIT OCW 6.01SC: https://ocw.mit.edu/courses/6-01sc-introduction-to-electrical-engineering-and-computer-science-i-spring-2011/
- MIT OCW 6.003 lecture notes: https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/pages/lecture-notes/
- Engineering Statics: Open and Interactive table of contents (UPI library record): https://oalib-perpustakaan.upi.edu/Record/OTLid0001047/TOC
- MIT catalog, 2.001 and 2.002: https://stuff.mit.edu/afs/sipb/project/course-search/web_scripts/search/urls-sp25/cat/2.001.html
- MIT catalog, 2.005 and 2.006: https://stuff.mit.edu/afs/sipb/project/course-search/web_scripts/search/urls-sp20/cat/2.005.html
- MITx 2.005.1x: https://openlearning.mit.edu/courses-programs/mitx-courses/thermal-fluids-engineering-1-basics-thermodynamics-and-hydrostatics
- Felder and Rousseau table of contents (Wentworth library record): https://vufind.wit.edu/Record/w2978751/TOC

Not fetched (refused or failed): nextgenscience.org, khanacademy.org course pages, MIT OCW 2.001 and 2.005 calendars, the College Board CED PDF itself.
