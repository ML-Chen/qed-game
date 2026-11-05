# Heurēka! microgame map: chemistry, biology and medicine

Compiled 2026-11-05. This file maps the units of chemistry and biology courses, from elementary school to introductory university, to proposed microgames for Heurēka!, the science, engineering and business companion to Q.E.D.!. It adds courses that standard curricula skip: "Lab bench" (practical lab skills), "Medicine: doses and tests", and three advanced courses the owner asked for: fire, plasma and extreme matter; materials chemistry for modern technology; and frontiers of biology and medicine. Physics, engineering, computer science and business are mapped in other files in this folder.

## How to read this file

- **A microgame is a moment, not a question.** Each game is a 3 to 6 second WarioWare moment: one shouted verb, one action, and something happens on screen that makes a concept visible. The player learns by doing it, seeing it happen, failing in a funny way, doing it again faster, and reading the card afterwards. There are no numbers to compute, no formulas to rearrange, and no more than three words to read during play. The card shown after the game says the idea in plain words.
- **The real thing on screen.** The main thing on screen is the concrete thing: atoms as coloured balls, liquid that pours, cells and organs as pictures, medicine as dots spreading through a body. Names and formulas appear only as small labels that follow the picture after it has made them obvious.
- **The bar every row must pass.** The player does the key step with their own hands. A young child who has never seen the topic knows what to do from the command and the first frame, and can follow what happens. Success makes the concept happen on screen, and the funny fail shows the concept too. The "Self-review" section at the end lists the rows that were rewritten to meet this bar.
- **A course is a playlist.** The games in a course cover its important ideas together. Short, sharp games are preferred over long ones, so most units have several.
- **Unit names** come from each course's own published unit list. The "Source:" line under each course says where each name was checked and which names are reconstructed. Khan Academy's (KA) course pages are rendered by JavaScript, so the fetch tool could not read them directly. KA unit titles were confirmed from page titles and URL slugs in search results, the College Board unit lists were fetched from the AP "Course at a Glance" PDFs, and the OpenStax chapter lists were fetched from OpenStax's own book files. All sources are listed at the end.
- **Columns** (one row per microgame):
  - **ID**: a stable reference (EL = Elementary, MC = middle school chemistry, LB = Lab bench, HC = high school chemistry, APC = AP Chemistry, OC = OpenStax *Chemistry 2e* additions, OR = organic chemistry and biochemistry, MB = middle school biology, HB = high school biology, APB = AP Biology, OB = OpenStax *Biology 2e* additions, AN = OpenStax *Anatomy and Physiology 2e*, MED = Medicine: doses and tests, FP = Advanced chemistry: fire, plasma and extreme matter, MT = Materials chemistry for modern technology, FB = Frontiers of biology and medicine).
  - **Command**: the verb the player does, one or two words, in capitals, ending in "!".
  - **Concept**: the one plain sentence the player comes to see.
  - **Scene**: what is on screen at the start.
  - **Action**: the one thing the player does (tap, mash, hold, swipe, drag, aim, tilt, trace, or stop at the right moment).
  - **What happens**: the success, with the concept made visible.
  - **Funny fail**: what happens after the common wrong move, and what it shows.
  - **Level 2**: the same action made harder, or one new twist.
  - **Host**: the animal from the cast (frog, ant, penguin, duck, turtle, octopus, owl, fox, rabbit, beaver, hedgehog, bird).
- **Why it matters**: each unit opens with a one-line note saying where the idea is used in real work or real projects. Topics are chosen and weighted by that use, not only by what the standard courses test.
- **[TRIMMED]** marks topics that are mostly exam material with little use outside school. They keep at most one game and are left out of the first build stages. Topics that are only calculation practice in the source course (for example ICE tables, empirical formulas, dosage arithmetic and unit conversions) are not mapped; the concept behind them is mapped instead.
- **[WEAK FIT]** marks the few topics that no single action shows well. Each one still gives the best playable idea.
- **"See X"** means the idea was already mapped earlier in this file, and the earlier game is reused. Rows whose ID cell is "—" are cross-references only and are not counted.
- The medicine games show how doses and tests behave. They are not clinical guidance, and each card says so.

## Coverage summary

| Course | Units mapped | New microgames | Unit-list source |
|---|---|---|---|
| Elementary (NGSS K–5 life science and matter) | 6 | 17 | NGSS codes; 5-PS1 fetched, others standard codes not re-fetched; grouping is this file's own |
| Middle school chemistry | 5 | 16 | KA course: 1 unit title and 2 unit slugs verified, 2 units reconstructed; all 6 NGSS MS-PS1 expectations fetched |
| Lab bench (practical skills) | 6 | 22 | Not from a course; this file's own selection |
| High school chemistry | 10 | 34 | KA course: 6 unit titles verified, 4 reconstructed (one of them verified in the TX version) |
| AP Chemistry | 9 | 32 | College Board Course at a Glance (all 9 verified); 4 KA titles or slugs verified |
| Introductory university chemistry (OpenStax *Chemistry 2e*) | 21 chapters | 16 | OpenStax book file (all 21 verified) |
| Organic chemistry and biochemistry (OpenStax *Organic Chemistry*) | 7 (grouping 31 chapters) | 21 | OpenStax book file (all 31 verified); grouping is this file's own |
| Middle school biology | 5 | 19 | KA course: 4 units verified (titles or slug), 1 reconstructed; NGSS MS-LS used as a check |
| High school biology | 6 | 28 | KA course: 4 titles and 2 slugs verified; order reconstructed; older 9-unit course also checked |
| AP Biology | 8 | 30 | College Board Course at a Glance (all 8 verified); 2 KA titles verified |
| Introductory university biology (OpenStax *Biology 2e*) | 8 units, 47 chapters | 12 | OpenStax book file (all verified) |
| Anatomy and physiology (OpenStax *A&P 2e*) | 6 units, 28 chapters | 24 | OpenStax preface page (all verified) |
| Medicine: doses and tests | 4 | 11 | Not from a course; the topics the assignment named, as concepts |
| Advanced chemistry: fire, plasma and extreme matter | 3 | 21 | Not from a course; the owner's request (fire, plasma, advanced topics); safety and plasma sources per topic |
| Materials chemistry for modern technology | 5 | 14 | Not from a course; OpenStax *Chemistry 2e* sections and agency pages per topic |
| Frontiers of biology and medicine | 6 | 16 | Not from a course; OpenStax *Biology 2e* chapters, CDC and Nobel pages per topic |
| **Total** | | **333** | |

The tables hold 333 microgame rows, all new (282 in the first thirteen courses and 51 in the three advanced courses). Rows whose ID cell is "—" are cross-references only and are not counted. 3 rows are marked [TRIMMED] and 2 are marked [WEAK FIT] or [partly WEAK FIT]. Every unit or chapter in the courses above has at least one game or cross-reference.


---

## Elementary (NGSS K–5: life science and matter)

Source: the NGSS performance expectations for kindergarten to grade 5 (nextgenscience.org). The page for 5-PS1 "Matter and its interactions" was fetched in this session and its four expectations (5-PS1-1 to 5-PS1-4) are mapped below. The other codes named in the unit headings (K-LS1-1, 1-LS1-1, 1-LS3-1, 2-LS2-1, 2-LS2-2, 2-LS4-1, 2-PS1-1, 2-PS1-2, 2-PS1-4, 3-LS1-1, 3-LS3-1, 3-LS4-3, 4-LS1-1, 4-LS1-2, 5-LS2-1) are the standard NGSS codes but were not re-fetched. The unit grouping is this file's own. Physical science for young children other than matter (pushes and pulls, magnets, light, sound) is mapped in the physics file. These games use pictures and actions only, and every word on screen is one a young child reads easily.

### Unit 1: Living things and what they need (K-LS1-1, 2-LS2-1)
Why it matters: caring for pets, gardens and farm animals starts with knowing what living things need.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EL-01 | `FEED!` | Living things need food and water; things that aren't alive don't. | A puppy, a sapling, a mushroom, a rock and a toy robot in a garden. A bowl of snacks and a watering can. | Drag snacks and water to everything that needs them before time runs out. | The puppy wags and grows, the sapling sprouts a leaf, the mushroom pops up a baby mushroom. | Feeding the rock: the crumbs just sit on it, and a bird eats them. The robot's battery runs down, but it never grows. | A seed (alive, waiting) and a campfire (it grows, but isn't alive) | Frog |
| EL-02 | `GROW!` | Plants need light and water to grow. | A pale, droopy seedling in a pot inside a dark cupboard. | Drag the pot into the sunbeam and tap the watering can over it. | The seedling stands up, turns green and grows a new leaf with each drink. | Watering it in the dark: it grows long, pale and floppy, and flops over the pot's edge. | Three plants, and the cactus wants only a little water | Rabbit |
| EL-03 | `NEST!` | Animals need shelter. | A duckling on open ground, twigs scattered around, rain clouds rolling in. | Drag twigs into a ring around the duckling before the rain arrives. | The nest closes, the duckling snuggles in, and the rain runs off. | Too few twigs: rain drips through the gap onto the duckling's head. | A wind that blows loose twigs away | Duck |

### Unit 2: Body parts and senses (1-LS1-1, 4-LS1-1, 4-LS1-2)
Why it matters: knowing what each body part does is the first step toward first aid and health care, and engineers copy animal body parts when they design tools.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EL-04 | `PLANT IT!` | Each part of a plant has a job: roots drink, leaves catch sunlight. | A plant in pieces beside a pot: roots, stem, leaves, flower. | Drag each part into place on the plant. | Roots pull water up from the soil, the stem carries it, leaves catch the sun and the flower calls a bee. | Leaves stuck underground: they can't reach the sun, and the plant stays brown. | Add fruit and seeds | Bird |
| EL-05 | `SENSE!` | Each sense has its own body part. | A fox in a dark wood. A twig snaps, berries smell sweet, a moth flutters. | Tap the fox's body part that should catch each clue as it comes: ears, nose, eyes. | Ears swivel to the snap, the nose finds the berries, the eyes spot the moth, and the fox gets a snack. | Tapping its eyes for the twig snap: it stares the wrong way and a rabbit hops past behind it. | Taste and touch clues too | Fox |
| EL-06 | `CURL UP!` | Animals have body parts that help them survive. | A hedgehog snuffling in leaves; a fox creeps closer. | Tap the hedgehog at the right moment to curl it into a ball. | Spines bristle out, and the fox sniffs, gets a prickle on its nose and backs off. | Curling too late: the fox gives the hedgehog a playful nudge, and it rolls downhill. | An owl dives from above, and the duck must paddle away with its webbed feet | Hedgehog |

### Unit 3: Life cycles and families (3-LS1-1, 1-LS3-1, 3-LS3-1)
Why it matters: farmers, vets and gardeners plan their work around life cycles, and families notice which features children share with their parents.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EL-07 | `GROW UP!` | A frog changes shape as it grows: egg, tadpole, froglet, frog. | Frog eggs in a pond. A lily pad waits at the edge. | Tap each time the little one is ready to change (it wiggles), until it can hop onto the lily pad. | Egg → tadpole → legs sprout → tail shrinks → frog hops onto the pad and lays new eggs. | Tapping too early: a tadpole with no legs tries to hop and flops back into the water. | A butterfly (caterpillar, chrysalis, wings) | Frog |
| EL-08 | `FIND MUM!` | Babies grow up to look like their parents. | A duckling, a kitten and a tadpole wander lost in a park; three parents call. | Drag each baby to its parent. | Each family snuggles, and the features they share glow (beak, stripes). | Taking the tadpole to a fish: it grows legs, hops out and joins the frog. | Two kittens of one mother with different colours | Duck |

### Unit 4: Food chains and habitats (5-LS2-1, 2-LS2-2, 2-LS4-1, 3-LS4-3)
Why it matters: gardeners, farmers and park rangers keep habitats and food chains healthy so that plants and animals survive.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EL-09 | `PASS IT ON!` | Energy from the sun passes from plants to the animals that eat them. | The sun, a patch of grass, a rabbit and a fox, with a glowing dot of energy in the sun. | Drag the glowing dot from the sun down the chain to the fox. | Grass grows green, the rabbit munches and hops, the fox eats and naps. | Skipping the grass: the rabbit sniffs the sunbeam and stays hungry. | A mushroom turns the leftovers back into soil | Fox |
| EL-10 | `MOVE IN!` | Each animal lives where it can find what it needs. | A penguin, a frog, an owl and a turtle, and four homes: ice, pond, forest, sea. | Drag every animal to a home where it is happy. | The penguin slides, the frog catches a fly, the owl hoots, the turtle swims. | The penguin at the warm pond: it pants and fans itself with a flipper. | The pond dries up and the frog must find a new pond | Penguin |
| EL-11 | `BLOW!` | Seeds travel to new places so that young plants aren't crowded. | A dandelion gone to seed in the middle of bare ground. | Swipe hard to blow the seeds away. | Seeds float off on their parachutes, land far apart and sprout into a field. | A weak puff: the seeds drop in a clump and the seedlings jostle for light. | Burrs that hitch a ride on the fox's fur | Bird |

### Unit 5: Solids, liquids and gases (2-PS1-1, 2-PS1-2, 2-PS1-4, 5-PS1-1, 5-PS1-3)
Why it matters: cooks, builders and makers choose materials by what they are like (hard, bendy, waterproof, runny), and freezing and melting are part of cooking and weather.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EL-12 | `POUR!` | Liquids flow and take the shape of their cup; solids keep their own shape. | Juice, a pebble and a pile of jelly cubes, and a row of oddly shaped cups. | Tilt each into a cup until every cup is full. | The juice fills the star-shaped cup to its tips. The pebble stays a pebble and rattles. | Tilting the pebble into the star cup: it plinks in, and the star stays empty. | Sand: a solid that pours, but its grains keep their shape | Penguin |
| EL-13 | `MELT!` | Heat melts some things and cold sets them again; other changes can't go back. | A chocolate bunny in the sun, a fridge, and a fried egg. | Drag the bunny into the sun, then into the fridge. | The bunny melts into a puddle and sets again as a flat chocolate bunny-puddle. | Putting the fried egg in the fridge: it stays fried, now cold. | Ice cubes, butter and toast | Hedgehog |
| EL-14 | `KEEP DRY!` | Some materials keep water out and some soak it up. | A frog under a rain cloud; paper, plastic and a sponge lie nearby. | Drag a material over the frog as a hat. | The plastic hat sheds the rain and the frog stays dry. | The sponge hat: it fills up and drips on the frog's head. | A boat that must float and keep water out | Frog |
| EL-15 | `STIR!` | Sugar dissolves into bits too small to see, but it is still there. | A glass of water, a spoonful of sugar, a magnifying glass. | Stir until the sugar is gone, then drag the magnifying glass over the glass. | The sugar disappears; under the glass, its tiny bits are spread among the water's bits. The fox sips and smiles. | Stirring sand: it swirls and settles back to the bottom. | Warm water and cold water: sugar vanishes faster in warm | Fox |

### Unit 6: Mixing and new substances (5-PS1-2, 5-PS1-4)
Why it matters: cooks, cleaners and gardeners mix things every day, and knowing which mixes make something new keeps them safe.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EL-16 | `DON'T SPILL!` | When things are mixed, the total weight stays the same. | A cup of water and a spoon of sugar on a kitchen scale. | Tip the sugar into the water without spilling any. | The sugar disappears into the water, and the scale's arrow doesn't move. | Spilling some: the spilled sugar lands beside the scale, and the arrow drops a little. | An ice cube melts on the scale | Owl |
| EL-17 | `FIZZ!` | Some mixes make a brand-new substance, like a gas. | A bottle of vinegar with a balloon ready, a dish of baking soda and a dish of sand. | Tip the dishes into the bottle until the balloon fills. | Baking soda fizzes and bubbles, and new gas blows up the balloon. | Tipping in sand: it sinks, and the balloon hangs limp. | Milk and lemon juice (it curdles) | Frog |

---

## Middle school chemistry (KA: "Middle school chemistry", /science/ms-chemistry; NGSS MS-PS1 "Matter and its interactions")

Source: KA launched this NGSS-aligned course on 2025-08-20 (KA blog, "Explore Khan Academy's New NGSS-Aligned Middle School Chemistry Course"). The course page itself could not be read. Verified from khanacademy.org search results: the unit "Classifying matter" (page title), and the unit slugs "physical-properties-of-matter" (lesson "Density") and "chemical-changes" (lessons "Chemical reactions" and "Energy changes in chemical reactions"). Reconstructed (unverified): "States of matter and thermal energy" and "Synthetic materials", which cover NGSS MS-PS1-4 and MS-PS1-3. The NGSS performance expectations MS-PS1-1 to MS-PS1-6 were fetched from nextgenscience.org, and every one is mapped below.

### Unit 1: Classifying matter (MS-PS1-1)
Why it matters: everything is built from a small set of atoms joined in different ways. That idea is the starting point for reading product labels and safety sheets and for all later chemistry.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MC-01 | `COUNT!` | Water is made of tiny molecules, each two hydrogen atoms stuck to one oxygen atom. | A drop of water zooms in until three molecules show: small white balls stuck to a red ball. | Tap every ball, in any order; each hops into its colour's pile. | The piles end at 6 white and 3 red, and the label H₂O writes itself beside one molecule. | Tapping the empty space between molecules: a "nothing here" puff, and the clock keeps ticking. | Build three molecules from loose balls to match the label 3H₂O | Frog |
| MC-02 | `BUILD!` | A molecule is atoms joined in a set shape. | A picture of methane (one black ball with four white balls) and a tray of balls. | Drag balls onto the frame until it matches the picture. | Each ball snaps on with a stick, and the label CH₄ fills in as it grows. | Four black balls and one white: the model sags and falls apart. | Build from the label alone (NH₃, CO₂) | Beaver |
| MC-03 | `PULL APART!` | A mixture can be separated easily; a compound can't. | Two dishes: iron filings mixed with yellow sulfur powder, and grey iron sulfide made from them. | Swipe the magnet through each dish. | The iron filings leap out of the mixture and leave yellow sulfur behind. | The magnet through the iron sulfide: nothing jumps, because the iron is joined to the sulfur in a new substance. | Salt water: boil it off to get the salt back | Owl |
| MC-04 | `TILE!` | Salt is a repeating pattern of two kinds of ion. | A patch of table salt zooms in to a grid of purple and green balls; a 3 × 3 patch is empty. | Drag purple and green balls into the gap so that neighbours alternate. | The patch fills and repeats outward into a perfect salt cube. | Two purple balls side by side: they push apart and one pops out of the grid. | A 4 × 4 patch against the clock | Penguin |

### Unit 2: Physical properties of matter (MS-PS1-2)
Why it matters: how heavy a material is for its size (its density) identifies it and checks its purity. Recycling plants sort plastics by sinking and floating, and brewers check sugar with a floating gauge.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MC-05 | `RAFT!` | Whether a thing floats depends on how heavy it is for its size, not on its total weight. | A duck on the bank of a pond; a huge log and a small pebble lie nearby. | Push something into the water for the duck to ride. | The huge log floats, and the duck climbs aboard and paddles off. | Pushing in the pebble: the duck hops on and sinks to its neck, spluttering. | A steel bowl (floats) and a steel bolt (sinks) | Duck |
| MC-06 | `SINK IT!` | Same-size blocks of different materials pack their particles differently. | A turtle's treasure chest needs weighting down; same-size blocks of wood, ice, stone and gold. | Drop blocks onto the chest's lid until it sinks to the seabed. | Stone and gold drag the chest down; a zoom shows their tightly packed particles. | Piling on wood and ice: they float up and lift the lid open. | Layers of oil and syrup in the tank | Turtle |
| MC-07 | `MATCH WEIGHT!` | Equal-size pieces of different metals weigh different amounts, so weight for size identifies a metal. | A balance, an unknown silver block, and same-size blocks of aluminium, iron and gold. | Drag reference blocks onto the other pan until the balance sits level. | It levels only with aluminium, and the unknown block takes aluminium's name. | Putting on gold: the pan thumps down and the owl's spectacles fly off. | Blocks of different sizes: cut a same-size piece first | Owl |

### Unit 3: States of matter and thermal energy (MS-PS1-4; title reconstructed)
Why it matters: phase changes and heat explain cooking, refrigeration, sweating and weather, and why boiling water stays at 100 °C however high the flame is.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MC-08 | `MELT IT!` | While ice melts, the heat goes into breaking particles free, so the temperature stops rising. | A beaker of ice over a burner, a thermometer, and a penguin who wants a drink. | Hold the burner button until the last piece of ice is gone. | The ice's particles jiggle faster, then break out of their rows one by one while the thermometer stands still at 0 °C. When the last piece melts, the temperature climbs again. | Letting go when the thermometer stops: ice still floats, and the penguin skates across it. | Boil it: a second pause at 100 °C | Penguin |
| MC-09 | `INFLATE!` | Warm particles move faster and push harder. | A floppy balloon on top of a flask of air; a warm bath. | Dunk the flask in the warm bath until the balloon stands up. | Particles inside speed up, hit harder, and the balloon swells. | Dunking it in the ice bucket: the balloon shrivels and flops over. | Inflate it to exactly fill a ring | Bird |
| MC-10 | `FOG UP!` | Cold surfaces turn water vapour back into droplets. | A glass of water in a steamy kitchen; vapour particles bounce around it. | Drop ice cubes into the glass until droplets cover the outside. | Vapour particles slow down near the cold glass, stick together and trickle down as drops. The frog licks them. | Dropping the ice beside the glass: it melts on the table and the glass stays clear. | Keep going until frost forms | Frog |

### Unit 4: Chemical changes (MS-PS1-2, MS-PS1-5, MS-PS1-6)
Why it matters: in every reaction the atoms are rearranged, never lost, which is the mass balance that chemists and process engineers use every day. Whether a reaction gives out or takes in heat decides whether a process needs cooling, and how hand warmers and cold packs work.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MC-11 | `CHANGE IT!` | A chemical change makes a new substance; a physical change doesn't. | A detective's notebook wants three new substances. On the bench: ice, an iron nail, baking soda and vinegar, sugar and water, a match. | Do things to the objects (melt, wet, mix, strike) until three new substances appear. | Rust grows on the wet nail, the soda fizzes out gas, the match burns to ash, and each one ticks a box. | Melting the ice or dissolving the sugar: the zoom shows the same particles before and after, and no box ticks. | Five new substances, with an egg to cook | Owl |
| MC-12 | `SEAL IT!` | In a sealed container, mass stays the same through a reaction. | A flask of baking soda on a scale, with a cup of vinegar inside, and a cap. | Cap the flask, then tilt it to mix. | It fizzes, a balloon on the cap fills with gas, and the scale's arrow never moves. | Forgetting the cap: the gas puffs out and the arrow drops. | A burning candle under a glass jar | Beaver |
| MC-13 | `REARRANGE!` | Atoms aren't made or destroyed in a reaction; they swap partners. | Two white pairs (hydrogen) and a red pair (oxygen) on the left; empty space on the right. | Pull the pairs apart and snap the balls into water molecules on the right. | Two waters click together, using every ball, and both sides show the same balls. | Making one water and stopping: two white balls and a red one wave from the left, left out. | Burn methane into carbon dioxide and water | Ant |
| MC-14 | `WARM PAWS!` | Some reactions give out heat, and others take it in. | A shivering hedgehog in the snow holding two packs: a hand warmer and a cold pack. | Squeeze packs until the hedgehog's paws are warm. | The hand warmer glows and its thermometer climbs; the hedgehog stops shivering. | Squeezing the cold pack: frost creeps over its paws and its teeth chatter. | Fill the warmer with just enough powder to be warm, not hot | Hedgehog |

### Unit 5: Synthetic materials (MS-PS1-3; title reconstructed)
Why it matters: plastics and synthetic fibres make up much of what people use. They are long chains of small molecules made from oil or gas, which is the basis of recycling and product design.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MC-15 | `LINK!` | Plastic is long chains of small molecules joined end to end. | A short chain of small molecules; more float nearby. A torn plastic bag waits. | Drag each small molecule onto the end of the chain until the chain reaches the bag. | Each one clicks on, and the long chain coils into a strand that mends the bag. | Dropping one on the middle of the chain: only the ends can join, and it bounces off. | Add cross-links to make a stiff plastic | Ant |
| MC-16 | `UNRAVEL!` **[partly WEAK FIT]** | Some materials come from plants and animals; synthetic ones are made from oil. | A sweater, a nylon rope, a cotton shirt and a plastic bottle. | Pull a thread from each to unravel it back to its source. | The cotton runs back to a cotton plant, the wool to a sheep, the nylon and plastic to an oil drop. | Pulling the rubber band: it stretches back to a rubber tree, not oil. | More materials. The "impact on society" part of MS-PS1-3 is a discussion topic; the card covers it. | Fox |

---

## Lab bench: practical skills the standard courses skip

Source: not from a course outline. The owner asked for practical topics that standard courses skip (lab technique, dilutions and concentrations, reading a paper's figure, controls and confounders, safety). The unit list below is this file's own selection of the everyday skills of a chemistry or biology lab.

### Unit 1: Measuring
Why it matters: every result in a lab starts with a measured amount, and a measuring error at the start spoils everything after it, from a school experiment to a hospital blood test.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| LB-01 | `FILL!` | Liquid in a thin tube curves; you read the bottom of the curve at eye level. | A glass pipette with one line on it, dipped in coloured water. | Hold the bulb to draw liquid up, and let go when the bottom of the curve sits on the line. | The camera zooms in on the line, and a dashed eye-level line shows a perfect fill. | Stopping when the top edge of the curve touches the line: the zoom shows it short, and the next tube is underfilled. | A faster rise and a thinner tube | Octopus |
| LB-02 | `CLICK!` | A micropipette's plunger has two stops: the first measures, the second pushes out the last drop. | A micropipette over a tube of red liquid and an empty tube. | Press to the first click, dip, let go to draw, then press to the second click over the empty tube. | The tip fills exactly, and the drop lands cleanly in the empty tube. | Pressing to the second click before drawing: the tip slurps up too much and a drop splashes on the bench. | Pick the pipette whose size fits the drop | Octopus |
| LB-03 | `TELL APART!` | A measurement is only as exact as the marks on the tool. | Twin leaves that differ by a hair, a ruler marked only in centimetres and one marked in millimetres. | Lay the leaves against rulers until you can show which is longer. | The millimetre ruler shows a one-mark gap, and the longer leaf gets a ribbon. | Using the centimetre ruler: both leaves read "about 4", and the ribbon wobbles between them. | Weigh twin pebbles on a kitchen scale and a lab balance | Owl |
| LB-04 | `CLIMB!` | Sizes in science range so widely that each step on the ladder is ten times bigger. | A ladder with pictures of a bacterium, a cell, a salt grain, an ant, a hand and a whale. | Help the ant climb by dragging each picture onto its rung, smallest first. | Each rung sits beside the one below so the "ten times bigger" step can be seen. | Putting the bacterium and the cell on one rung: side by side, the cell is visibly far bigger and the rung cracks. | A virus and a mountain | Ant |

### Unit 2: Solutions and dilutions
Why it matters: making a solution of the right strength is the most common task in chemistry, biology and pharmacy labs, and it is also used in brewing, gardening and cleaning.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| LB-05 | `MATCH IT!` | Strength means how crowded the dissolved stuff is. | A target jar of blue water and your jar. Zoomed in, dye dots are spaced out in the target. | Add dye or water until your jar's colour matches the target. | The dots crowd or spread until the colours match, and the jars clink. | Adding equal amounts of dye and water: the colour doesn't change, because the crowding doesn't. | Match a jar that is paler than your starting jar | Beaver |
| LB-06 | `PASS ALONG!` | Each dilution step makes the next tube the same step paler. | Four tubes in a row: the first dark blue, the others holding clear water. | Drag a small scoop from each tube into the next, down the row. | Each tube is one step paler, and a row of dots under each shows ten times fewer dots each time. | Scooping every tube from the first: all three come out the same pale shade. | A "ten times too strong" bottle to bring to normal strength | Duck |
| LB-07 | `ADJUST!` | A buffer resists change, so each drop moves the pH less near the target. | A pH meter with its needle on "too acidic" and a green target band. | Tap the dropper of base, one drop at a time, until the needle sits in the band. | The needle moves quickly at first, then in smaller steps, and settles in the band. | Squirting a handful of drops: the needle swings past the band and the frog fans the beaker. | A narrower band | Frog |

### Unit 3: Instruments
Why it matters: many lab measurements are indirect. A protein test or a cell count only means something after it is compared with known samples or scaled up from a small sample.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| LB-08 | `SLOT IN!` | An unknown sample is measured by comparing it with known samples. | A rack of tubes from pale to deep blue, each with a known amount of protein, and one unlabelled tube. | Slide the unknown tube along the rack until it fits between its neighbours in colour. | It settles between two tubes, takes their range as its label, and a curve through the rack draws itself. | Slotting it by cap colour: the tube clashes with its neighbours and glows red. | Two unknowns, one paler than the palest known tube | Owl |
| LB-09 | `SAMPLE!` | Counting a small part tells you about the whole. | A microscope grid crowded with cells, with one small square lit. | Tap the cells in the lit square, then swipe to copy your square across the grid. | Copies of your count tile the grid, and a bar fills up to the total. | Swiping before counting: blank copies tile the grid and the bar stays empty. | An uneven grid: count several squares | Rabbit |
| LB-10 | `SPIN UP!` | A spinning rotor must be balanced. | A centrifuge with six slots and three tubes. | Drag the tubes into slots and press start. | Evenly spaced tubes spin smoothly, and a balance dot stays in the centre. | Three tubes side by side: the centrifuge shakes and walks across the bench. | Five tubes in a twelve-slot rotor | Penguin |
| LB-11 | `FOCUS!` | Focus at low power first, then fine-tune at high power. | A blurry slide of cheek cells under a microscope. | Turn the big knob at the low-power lens, switch lenses, then turn the small knob. | The cells snap sharp. A side view shows the lens staying clear of the slide. | Using the big knob at high power: the lens creeps down toward the slide and the owl winces just before it touches. | Centre the cell before switching lenses | Owl |
| LB-12 | `FILL ALL!` | Make a little extra mix, because every transfer leaves some behind. | Ten empty tubes and a mixing tube; each pipette tip keeps a droplet. | Make the mix (exact or a bit extra), then fill all ten tubes. | With a little extra, all ten tubes fill to the line. | Making exactly enough: droplets cling to each tip and the tenth tube comes up short. | Twenty tubes | Ant |

### Unit 4: Fair tests and reading results
Why it matters: knowing whether a result is real (with a fair control, enough repeats and no hidden cause) is the core of doing science, of reading a paper and of judging news reports and health claims.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| LB-13 | `MAKE IT FAIR!` | A fair test changes only one thing at a time. | Two plants: one gets plant food in the sun, the other none in the shade. | Drag things between the two setups until only the plant food differs. | When the lamp moves over, every other detail ticks green and the test starts. | Moving the plant food: now nothing is being tested, and both plants shrug. | Spot the pot-size difference too | Rabbit |
| LB-14 | `BLAME!` | Two things can rise together because a third thing causes both. | Ice-cream sales and swimming accidents rise and fall together on two graphs; a sun hides behind a cloud. | Drag the blame arrows onto the real cause. | The cloud slides off the sun, both graphs line up under it, and the ice cream is cleared. | Blaming the ice cream: the duck refuses to eat it, and accidents keep happening in winter at the pool. | Three possible causes | Duck |
| LB-15 | `REPEAT!` | One small experiment can fool you; more repeats give a steadier answer. | Two groups of plants whose averages differ a little, shown as bars with whiskers that overlap. | Slide the number of plants per group up until the whiskers stop overlapping. | Each step adds plants, the whiskers shrink, and the bars separate. | Stopping at two plants: a rerun flips which bar is taller. | A smaller difference that needs many more plants | Hedgehog |
| LB-16 | `FIT IT!` | A "ten times per step" axis fits fast-growing data on one screen. | A graph of doubling bacteria shoots off the top of a plain axis. | Swipe the side axis to change it to the "ten times per step" ladder. | The curve becomes a straight line and every point fits. | Stretching the plain axis instead: early points squash into the floor. | Compare two growing lines | Owl |

### Unit 5: Safety
Why it matters: every lab, workshop, farm and kitchen uses these rules, and the hazard pictures (the GHS symbols) are printed on household cleaners as well as on lab bottles.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| LB-17 | `LABEL!` | Hazard pictures warn what a chemical can do. | Unlabelled bottles: alcohol, strong acid, a gas cylinder, a pesticide. | Stick a hazard picture on each bottle before the cleaner arrives. | Each label plays its warning: a flame near the alcohol, acid eating a coin, a dead fish beside the pesticide. | The flame on the acid: the cartoon shows it eating metal, not catching fire, and the label peels off. | Bottles with two hazards | Fox |
| LB-18 | `ACID TO WATER!` | Always add acid to water, slowly. | A beaker of strong acid and a big beaker of water. | Pour the acid into the water. | It slides in and the water warms gently. | Pouring water into the acid: a cartoon puff spatters the penguin's goggles (it is unharmed, but startled). | Pour slowly while stirring | Penguin |
| LB-19 | `GEAR UP!` | Goggles, gloves and a lab coat protect you. | A hedgehog at the bench, with gear and some wrong items around it. | Tap the goggles, gloves and coat before the timer starts. | Each snaps on with a click and the experiment begins. | Tapping the sandals: the hedgehog looks down at its toes, worried. | Also tie back long hair | Hedgehog |
| LB-20 | `CLEAN UP!` | Each lab accident has its own safe fix. | A small acid spill, a broken beaker, and a splash near an eye. | Drag the right fix to each: baking soda, a dustpan, the eyewash station. | The spill fizzes harmlessly away, the glass is swept up, and the eye is rinsed. | Picking up glass by hand: a cartoon bandage appears on the owl's wing. | Four accidents at once | Owl |

### Unit 6: Sterile technique
Why it matters: food safety, hospitals, microbiology and brewing all rely on keeping unwanted microbes out of a culture or a wound.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| LB-21 | `STREAK!` | Spreading bacteria thinner and thinner leaves single colonies apart. | A jelly plate and a loop carrying bacteria from a swab. | Swipe three zigzag streaks, turning the plate between them, each starting in the last. | Growth plays overnight in fast motion: thick, thinner, then separate sparkling dots. | Streaking every zone from the swab: the whole plate grows into one lawn. | Heat the loop between zones | Rabbit |
| LB-22 | `COVER!` | Dust carries microbes, so open containers are shielded. | An open culture tube, its lid in your hand, dust specks drifting. | Hold the lid over the tube as a shield until the transfer is done, then close it. | Specks bounce off the lid, and the culture grows clean. | Putting the lid face up on the bench: a speck lands inside and fuzzy mould grows. | A breeze from the side | Bird |

---

## High school chemistry (KA: "High school chemistry", /science/hs-chemistry)

Source: KA lists "High school chemistry" (/science/hs-chemistry) among its high school courses (KA blog, "Everything You Need for Science Class—Free on Khan Academy", 2025-08-14). The course page itself could not be read. Verified as unit titles from khanacademy.org search results (page titles, or unit and quiz titles under /science/hs-chemistry/x2613d8165d88df5e:…): "Chemical bonding", "Stoichiometry and the mole", "Chemical reactions", "Reaction rates and equilibrium", "Solutions, acids, and bases" and "Nuclear chemistry". Reconstructed (unverified): "Atomic structure" (this title was verified in the Texas version of the course, /science/hs-chemistry-tx), "Periodic table", "Gases and intermolecular forces" and "Thermochemistry". The course order is also reconstructed.

### Unit 1: Atomic structure (title from the TX TEKS version)
Why it matters: isotopes are used in carbon dating, medical scans and nuclear power, and charged atoms (ions) carry the current in batteries, nerves and sports drinks.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HC-01 | `LOAD!` | The number of protons decides the element; extra neutrons make a heavier version (an isotope). | A carbon nucleus with 6 red protons, three empty balance pans, and a pile of grey neutrons and red protons. | Load neutrons into three carbon nuclei so that each pan sits at a different height. | Carbon-12, -13 and -14 sit lower and lower, and all keep the name carbon. | Loading a proton: the atom turns into nitrogen, its label flips, and it hops off the carbon shelf. | Overload one until it wobbles and decays (see HC-31) | Turtle |
| HC-02 | `GIVE!` | Atoms can give or take electrons, becoming charged ions that stick together. | A sodium atom with one lonely outer electron, a chlorine atom with one gap. Both look grumpy. | Drag sodium's outer electron into chlorine's gap. | Both cheer as their outer rings become full, turn opposite charges and snap together into salt. | Dragging an electron from chlorine to sodium: both get worse, and they push apart. | Magnesium and oxygen (two electrons) | Fox |
| HC-03 | `SEAT!` **[TRIMMED]** | Electrons fill the inner rings first, and spread out before they pair up. | A cartoon bus of electron seats, inner rows first; eight oxygen electrons wait to board. | Drag each electron to a seat. | They fill the inner row, then one per seat in the next row before any doubling up. | Doubling up next to an empty seat: the pair squabble and one moves. | Formal 1s 2s 2p labels | Penguin |

### Unit 2: Periodic table (title reconstructed)
Why it matters: the table predicts how an element behaves (how reactive it is, which charge it takes) without memorising each element. Battery makers, metallurgists and anyone storing chemicals safely use it.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HC-04 | `GROUP!` | Elements in a column have the same number of outer electrons, so they behave alike. | An empty column frame and a jumble of atoms with their outer electrons glowing. | Drag atoms with one outer electron into the column. | When the column is full, all its atoms dive into water together and fizz the same way. | Putting chlorine in the column: it refuses to fizz and sulks at the bottom. | A second column of atoms with seven outer electrons | Owl |
| HC-05 | `SPLASH!` | Lower in the column, the outer electron is farther away and easier to lose, so the metal reacts more. | A duck wants a big splash; lumps of lithium, sodium and potassium on the bank. | Throw lumps into the pond until you get a big splash. | Potassium bursts with a lilac flame and a big splash, and the duck cheers. | Lithium first: a polite fizz, and the duck yawns. | Rank them all: lithium, sodium, potassium, rubidium | Duck |
| HC-06 | `PULL IN!` | More protons pull the electron rings in, so atoms shrink across a row. | An atom with a big, loose electron cloud and a pile of protons. | Drag protons into the nucleus until the cloud fits through a small hoop. | The cloud tightens with each proton and squeezes through the hoop. | Adding a whole new ring instead: the atom balloons and jams in the hoop. | Down a column, new rings make atoms bigger | Hedgehog |

### Unit 3: Chemical bonding (verified)
Why it matters: how atoms hold together decides a substance's shape, what it dissolves in, how soap lifts grease and how a medicine fits its target in the body.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HC-07 | `FIT!` | In an ionic compound, the charges add up to zero. | Aluminium ions with three bumps and oxide ions with two dents, like puzzle pieces. | Fit pieces together until there are no bumps or dents left. | Two aluminium and three oxide pieces lock into a flat tile, and the label Al₂O₃ appears. | One of each: a bump sticks out, and the tile wobbles off the table. | Calcium and chloride, against the clock | Beaver |
| HC-08 | `SHARE!` | Atoms can share pairs of electrons to fill their outer rings. | An oxygen atom with six outer electrons and two hydrogen atoms with one each. | Drag each hydrogen to the oxygen. | Each shared pair glows between the atoms, and every outer ring is full: water. | Adding a third hydrogen: oxygen is already full and the extra one bounces off. | Carbon dioxide, which needs double bonds | Owl |
| HC-09 | `TIE!` | Electron groups push apart, which sets a molecule's shape. | A centre knot and four balloons: three with hydrogens and one empty (a lone pair). | Tie all four balloons to the centre and let go. | They spring into a pyramid, and the hydrogens sit like a three-legged stool. | Leaving out the empty balloon: the hydrogens lie flat, then pop down when it is added. | Water (two empty balloons, bent) | Bird |
| HC-10 | `BEND!` | Molecules with uneven charge are drawn to a charged object. | A charged balloon and two thin streams: water and an oily liquid. | Swing the balloon close to the streams until one bends. | The water stream curves toward the balloon. A zoom shows water's lopsided charge, and the oily liquid's even charge. | Holding the balloon at the oily stream: it pours straight down, unbothered. | Two molecules of the same atoms, one bent and one straight | Duck |

### Unit 4: Stoichiometry and the mole (verified)
Why it matters: chemists count atoms by weighing them, using the mole as their "dozen". Every recipe in chemistry, pharmacy and manufacturing is scaled this way.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HC-11 | `WEIGH!` | Atoms of different elements weigh different amounts, so equal counts don't weigh the same. | A balance with one gold atom on one pan and a bin of carbon atoms. | Drop carbon atoms onto the other pan until the balance is level. | It takes many carbons to balance one gold, and the card explains that a mole (a huge counting number) of gold outweighs a mole of carbon the same way. | Dropping in one carbon: the pans don't budge, and the ants groan. | A water molecule against an oxygen molecule | Ant |

### Unit 5: Chemical reactions (verified)
Why it matters: a balanced reaction tells a factory how much raw material to buy and how much waste and carbon dioxide come out, and the material that runs out first limits how much product is made.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HC-12 | `BALANCE!` | In a reaction, every atom on the left appears on the right. | A scale with two pans: methane and oxygen molecules on the left, carbon dioxide and water on the right, all as coloured balls. Trays of whole molecules. | Add whole molecules to either pan until every colour matches. | Each colour's tally turns green as it matches, the scale levels, and the counts become the numbers in front: CH₄ + 2O₂ → CO₂ + 2H₂O. | Trying to add one loose ball: the tray only gives out whole molecules, and the ball bounces back. | Balance propane | Penguin |
| HC-13 | `ASSEMBLE!` | The ingredient that runs out first limits how much you can make. | A sandwich line: 2 slices of bread and 1 of cheese per sandwich, with 8 slices of bread and 3 of cheese. Then 4 hydrogen molecules and 3 oxygen molecules for water. | Make as many sandwiches (then water molecules) as you can. | The cheese runs out first and bread is left over. In the water version, hydrogen runs out and an oxygen is left over. | Grabbing a third bread slice: the sandwich gets too tall and falls over. | A three-ingredient recipe | Fox |
| HC-14 | `TRANSFER!` | Real reactions make less product than the recipe's maximum, because some is lost on the way. | A bowl of fresh product, three dishes to pour through, and an empty jar. | Pour the product through each dish into the jar, as carefully as you can. | The jar fills, though not to the top, because a little sticks to every dish. | Rushing: half sloshes onto the bench and the rabbit licks it. | Find the step that loses the most | Rabbit |
| HC-15 | `DIP!` | A more reactive metal pushes a less reactive one out of solution. | A blue copper solution, a zinc strip and a silver spoon. | Dip strips in until the solution turns clear. | Copper coats the zinc strip and the blue fades. | Dipping the silver spoon: nothing happens and the frog checks its reflection. | Iron and copper, and why zinc-coated steel resists rust | Frog |
| HC-16 | `CLOUD IT!` | Some ions lock together into a solid when two solutions mix. | Two clear solutions, one with silver ions and one with chloride ions, and a jar of plain water. | Pour solutions together until a white cloud forms. | The silver and chloride ions lock together into a white solid that settles. | Pouring silver solution into plain water: it stays clear. | Three solutions, two of which cloud together | Octopus |

### Unit 6: Gases and intermolecular forces (title reconstructed)
Why it matters: gas behaviour governs scuba tanks, tyres, airbags, weather balloons and cooking at altitude. Attractions between molecules explain why sweat cools you and why some liquids evaporate quickly.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HC-17 | `SQUEEZE!` | Squeezing a gas into less room makes its particles hit the walls more often, so the pressure rises. | A sealed syringe of air with a pressure gauge, and a cork that pops when the gauge is high. | Push the plunger in until the cork pops. | The particles crowd, the hit counter and gauge climb, and the cork flies off. | Pulling the plunger out: particles spread, the gauge drops, and the cork stays put. | A diver's balloon shrinking as it goes deeper | Penguin |
| HC-18 | `SHRINK!` | Cold particles move slower, so a gas takes up less room. | A balloon too big to fit through a small mousehole, and a freezer. | Put the balloon in the freezer, then push it through the hole. | It shrinks in the cold and slips through, then swells back on the other side. | Pushing it through warm: it squeaks and gets stuck. | A hot-air balloon that must rise above a tree | Bird |
| HC-19 | `DRY OFF!` | Molecules that hold each other weakly escape (evaporate) faster. | A wet frog with drops of rubbing alcohol on one leg and water on the other; a fan. | Fan the frog until both legs are dry. | The alcohol drop vanishes first, and its leg feels cold; the water clings longer. | Fanning from the wrong side: the drops wobble but stay. | Add nail-polish remover (very fast) | Frog |
| HC-20 | `BOIL!` | Less air pressing down lets water boil at a lower temperature. | A pot of water with a thermometer at the beach, and a mountain path. | Carry the pot up the mountain until it boils on a small flame. | Near the top it boils below 100 °C, and the rabbit's pasta stays crunchy. | Staying at the beach on the small flame: the water just steams. | A pressure cooker boils hotter | Rabbit |

### Unit 7: Thermochemistry (title reconstructed)
Why it matters: heating and cooling budgets are used in engine and building design and in cooking, and water's ability to soak up heat is why it is used as a coolant and why coasts have mild weather.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HC-21 | `TOAST!` | Water soaks up much more heat than sand for each degree it warms. | A cold penguin, a pan of sand and a pan of water on one flame. | Move the penguin between the pans until its feet are warm. | On the sand pan its feet warm quickly and it wiggles its toes. | Waiting on the water pan: it stays cool for ages and the penguin sneezes. | At night, which pan cools faster | Penguin |
| HC-22 | `COOL OFF!` | Heat flows from hot to cold until both are the same temperature. | A glowing hot metal ball, a small cup of water and a big tub of water. | Dunk the ball until it is cool enough for the hedgehog to hold. | In the big tub the ball cools and the water barely warms. | Dunking it in the small cup: the cup boils dry and the ball is still warm. | Mix hot and cold water to reach bath temperature | Hedgehog |
| HC-23 | `ROLL!` | Some reactions roll downhill and give out heat; others must be pushed uphill and take it in. | A ball on an energy hill, a campfire at the bottom of one slope and a sun lamp beside the uphill slope. | Roll the ball to the bottom, then push it back up. | Rolling down, it glows out heat into the fire (burning wood). Going up, it needs the sun lamp (photosynthesis). | Pushing uphill without the lamp: the ball rolls back and bonks the rabbit. | Hills of different heights | Rabbit |

### Unit 8: Reaction rates and equilibrium (verified)
Why it matters: fridges slow food spoilage, catalytic converters clean car exhaust, and shifting an equilibrium is how the Haber process makes the fertiliser that grows much of the world's food.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HC-24 | `HEAT UP!` | Reactions go faster when particles move faster and hit harder. | Particles drifting in a flask; a product jar to fill before time runs out. | Slide the temperature up until the jar fills in time. | Particles zip about, more hits spark into product, and the jar fills. | Sliding it down: the particles crawl and the jar stays nearly empty (which is why fridges slow spoilage). | Crowding and crushing a solid into powder also speed it | Ant |
| HC-25 | `LOWER!` | A catalyst gives the reaction an easier path, and isn't used up. | Ants push molecules up a tall energy hill. | Drag the catalyst under the hill. | The hump lowers, many more ants get over, and the catalyst slides back out unchanged. | Dropping it beside the hill: nothing changes, and the ants keep straining. | Pick the right-shaped catalyst, like an enzyme | Ant |
| HC-26 | `MAKE MORE!` | When an equilibrium is disturbed, it shifts to undo the change. | A flask where nitrogen and hydrogen make ammonia and ammonia breaks down again. A farmer's sack wants filling with ammonia. | Do things to the flask (add nitrogen, take ammonia out, heat, cool) until the sack is full. | Adding nitrogen or removing ammonia makes the flask produce more ammonia. | Heating it: ammonia breaks back down, because forming it gives off heat, and the sack empties. | Squeezing the flask also helps | Frog |
| HC-27 | `HOLD STEADY!` | At equilibrium, both directions go at the same rate, so the amounts stop changing. | Rabbits hop between two fields; a gate controls one direction. | Adjust the gate until the number in each field stops changing. | The two hop rates match, the counts freeze, and the rabbits keep hopping both ways. | Stopping all hopping: the rabbits sit bored, and the card says equilibrium never stops moving. | Counts settle unevenly | Rabbit |

### Unit 9: Solutions, acids, and bases (verified)
Why it matters: concentration and pH are used in medicine, pool and aquarium care, soil and gardening, food preservation and mixing cleaners safely.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | See LB-05 (strength as crowding) and LB-06 (dilution) | | | | | | |
| HC-28 | `DISSOLVE!` | Stirring, warmth and smaller pieces all make things dissolve faster. | A sugar cube in a cup of tea; a spoon, a warmer and a hammer. | Use any of them until the sugar is gone before the tea cools. | Crushed, stirred, warm sugar vanishes, and a zoom shows water molecules pulling sugar molecules away. | Tapping the cube gently with the spoon: it sits there, intact. | Iced tea: only stirring and crushing work | Bird |
| HC-29 | `NEUTRALIZE!` | An acid and a base cancel each other out, making water. | A beaker of acid with orange dots (H⁺), and a dropper of blue dots (OH⁻). A fish waits for a safe pond. | Drip base in until the orange dots are gone. | Each blue dot grabs an orange one and they become water; the indicator turns green and the fish dives in. | Too much base: blue dots are left, the water turns purple, and the fish jumps back out. | A weak acid that neutralises more slowly | Owl |
| HC-30 | `TITRATE!` | An indicator changes colour at the moment the acid is used up. | A flask of acid with an indicator, under a burette of base. | Tap the tap for drops until the first faint pink that stays. | Pink swirls fade more and more slowly, and the flask settles at pale pink. | Holding the tap open: the flask flashes hot pink. | Half-drops near the end | Octopus |

### Unit 10: Nuclear chemistry (verified)
Why it matters: radioactive isotopes are used in medical scans and cancer treatment, in carbon dating and in power stations, and radiation safety depends on knowing what stops each kind of radiation.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HC-31 | `FLING!` | In alpha decay, a nucleus throws out a chunk of 2 protons and 2 neutrons and becomes a different element. | A wobbling uranium nucleus and a strip of the periodic table. | Flick the chunk out of the nucleus. | The chunk flies off, and the nucleus's label hops two places back to thorium. | Flicking out a lone neutron: the label stays uranium, and it keeps wobbling. | Beta decay: a neutron flips into a proton, and the label hops forward | Hedgehog |
| HC-32 | `WAIT!` | In each half-life, half of the remaining radioactive atoms decay. | A tray of glowing atoms and a clock. | Hold to let time pass, and let go when only a quarter still glow. | In each tick, half of the glowing atoms go grey, and a curve draws itself that flattens and never quite reaches zero. | Holding too long: the tray is nearly all grey, and the turtle taps a lonely glowing atom. | A medical isotope; see MED-05 | Turtle |
| HC-33 | `SHIELD!` | Alpha is stopped by paper, beta by metal, and gamma needs thick lead. | Rays fly toward a sleeping turtle. Paper, aluminium and lead sheets lie nearby. | Drop a barrier in front of each ray before it arrives. | Each ray stops at its barrier and the turtle snoozes on. | Paper against gamma: it zips through and the turtle's shell glows briefly. | Mixed rays, faster | Turtle |
| HC-34 | `CHAIN!` | Splitting a uranium nucleus releases neutrons that can split others. | A grid of uranium nuclei in a reactor, with control rods. | Fire one neutron in, then tap control rods to keep the glow steady. | Each split releases more neutrons and energy; the rods soak up the extra and the glow stays steady. | No rods: the glow races up and alarms flash (cartoon, and the card says how reactors prevent it). | A gust of extra neutrons | Owl |

---

## AP Chemistry (College Board CED; KA: "AP®︎ Chemistry", /science/ap-chemistry-beta)

Source: the College Board's "AP Chemistry Course at a Glance" PDF (fetched 2026-11-05), which lists 9 units and their numbered topics. All unit titles and topic numbers below are verified from it. Its titles for Units 2, 3 and 9 ("Compound Structure and Properties", "Properties of Substances and Mixtures", "Thermodynamics and Electrochemistry") are newer than the titles in KA's course. KA's titles verified from khanacademy.org search results: "Atomic structure and properties" (Unit 1 test), "Unit 3: Intermolecular forces and properties", and the unit slugs "thermodynamics" (Unit 6) and "applications-of-thermodynamics" (Unit 9). Topics that are only calculation practice (ICE tables, Hess's-law and Faraday's-law arithmetic, the Henderson–Hasselbalch equation) are mapped to the concept behind them.

### Unit 1: Atomic Structure and Properties
Why it matters: mass spectrometers identify drugs, pollutants and proteins in real labs, and the pull between charges explains why some materials melt in a pan and others line furnaces.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | See HC-01 to HC-06 and HC-11 (isotopes, ions, electron rings, periodic trends, the mole) | | | | | | |
| APC-01 | `SORT BY WEIGHT!` | A mass spectrometer bends heavy atoms less than light ones, which separates them. | A mixed beam of light and heavy boron atoms heads for one bin; two bins sit at the far wall. | Swing the magnet into place so that the beam lands in both bins. | The beam splits: light atoms curve more, heavy ones less, and two piles grow, one much bigger. | No magnet: everything lands in one bin. | A molecule that breaks into fragments | Bird |
| APC-02 | `MELT IT DOWN!` | Ions with bigger charges, packed closer, hold together more strongly. | A block of table salt and a block of magnesium oxide; a blowtorch. | Hold the torch on each block until both melt. | Salt melts quickly; the magnesium oxide only melts when the torch glows white. Thicker pull lines join its doubly charged ions. | Giving up on the magnesium oxide: it sits there, solid, and the owl polishes it. | Three salts | Owl |

### Unit 2: Compound Structure and Properties
Why it matters: bond strength and length set how much energy fuels release, and alloys such as steel and brass are stronger than the pure metals they are made from.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | See HC-07 to HC-10 (ionic and covalent bonds, shapes). Formal charge (2.6) and hybridisation labels (2.7) are exam bookkeeping and are not mapped **[TRIMMED]**. | | | | | | |
| APC-03 | `BOND!` | Two atoms bond at the distance where they are most comfortable: closer pushes, farther lets go. | Two hydrogen atoms and a comfort meter shaped like a valley. | Drag one atom toward the other and let go at the valley's bottom. | The clouds merge into a bond that holds. | Pushing too close: they spring apart like magnets pushed together. | Chlorine's wider, shallower valley | Frog |
| APC-04 | `HAMMER!` | Odd atoms mixed into a metal jam its layers, so alloys are harder. | A sheet of pure copper, a hammer, and a scoop of zinc atoms. | Mix zinc into the copper, then hammer the sheet without denting it. | Brass shrugs off the hammer, because the odd atoms stop the layers sliding. | Hammering pure copper: it dents into a bowl. | Steel: small carbon atoms tucked into iron's gaps | Beaver |
| APC-05 | `BLEND!` | Some molecules are a blend of two drawings, with in-between bonds. | Ozone drawn with a double bond on the left; a ghost drawing with it on the right. | Swipe the drawings together. | They merge into one picture with two equal "one-and-a-half" bonds. | Swiping too slowly: the two drawings flicker back and forth, and the bird gets dizzy. | Nitrate, three drawings | Bird |

### Unit 3: Properties of Substances and Mixtures
Why it matters: separating mixtures (chromatography, distillation), choosing solvents and measuring concentration with light are routine in pharmaceutical, environmental, food and clinical labs.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | See MC-08, HC-17 to HC-20 (phases and gases) | | | | | | |
| APC-06 | `FREEZE!` | Water molecules link by hydrogen bonds into an open lattice, which is why ice floats. | Six loose water molecules and a ring-shaped frame on a pond. | Turn and drag each molecule so a hydrogen points at a neighbour's oxygen until the ring closes. | Dotted bonds form, the ring stacks into a lattice with gaps, and the ice floats so the penguin can stand on it. | Hydrogen to hydrogen: they push apart and the penguin falls in. | Twelve molecules against the clock | Penguin |
| APC-07 | `PUMP UP!` | In a gas mixture, each gas pushes on the walls as if it were alone. | A tank with a pressure gauge and two pumps: nitrogen and oxygen. | Pump gases in until the gauge reaches the green mark. | Two stacked bars beside the tank grow, one per gas, and add to the total. | Expecting the second gas to do nothing: the gauge jumps when it goes in. | Thin air on a mountain (see AN-20) | Penguin |
| APC-08 | `RACE!` | Lighter gas particles move faster at the same temperature. | Two balloons at a starting line, one of helium and one of air, with pinholes. | Prick both balloons at the same time. | The helium rushes out and its balloon flattens first. | Pricking only one: there's no race, and the turtle naps. | Hydrogen against carbon dioxide | Rabbit |
| APC-09 | `SEPARATE INK!` | Water carries different dyes up paper at different speeds. | A black ink spot on a paper strip, a dish of water, and a mystery note. | Dip the strip into the water and hold it until the colours split apart. | The black ink spreads into blue, red and yellow bands, and they match the mystery note. | Dipping the ink spot itself under the water: the ink washes out into the dish. | Find which of three pens wrote the note | Fox |
| APC-10 | `DISTILL!` | A liquid that boils at a lower temperature can be boiled off and collected. | A flask of alcohol and water, a heater and a collecting jar. | Keep the heater just warm enough to boil the alcohol but not the water. | Alcohol vapour climbs, cools and drips into the jar; the water stays behind. | Full heat: water boils over too and the jar turns cloudy. | A narrower temperature window | Beaver |
| APC-11 | `DISSOLVE IT!` | Like dissolves like: charged and polar things in water, oily things in oil. | Salt, sugar, cooking oil and iodine; a beaker of water and a beaker of oily hexane. | Drop each solute in until every one has dissolved somewhere. | Salt and sugar vanish in water; oil and iodine vanish in hexane. | Oil into water: it floats as a layer and the duck skates on it. | Alcohol dissolves in both | Duck |
| APC-12 | `KNOCK OFF!` | Light comes in packets, and only blue-enough packets have the energy to knock electrons out of metal. | A metal plate with electrons stuck on it, and a lamp whose colour slides from red to violet. | Shine the lamp on the plate until electrons fly off. | At blue and violet, electrons pop off at once. | Turning the red lamp brighter and brighter: not one electron moves. | Ultraviolet and sunburn | Bird |
| APC-13 | `DIM IT!` | More dye in the light's path lets less light through. | A beam through a tube of dyed water onto a sensor that is too bright for the owl. | Add dye or use a longer tube until the sensor dims to the mark. | The beam fades as it crosses more dye. | Making the tube wider instead of longer: the beam's path through the dye doesn't change and the sensor stays bright. | Match an unknown's dimming to find its strength (see LB-08) | Owl |

### Unit 4: Chemical Reactions
Why it matters: precipitation, acid–base and electron-transfer reactions are how water is treated, metals are refined and batteries work.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | See HC-12 to HC-16, HC-29, HC-30 (balancing, limiting reactants, precipitates, neutralising, titration) | | | | | | |
| APC-14 | `PASS!` | An acid gives a proton (H⁺) to a base. | A hydrogen fluoride molecule holding a small ball (the proton), and a water molecule with open hands. | Toss the proton from the acid to the water. | The water catches it and becomes H₃O⁺; what's left of the acid can catch one back. Matching colours link the pairs. | Tossing it the other way: the fluoride already has nothing to give. | Ammonia takes a proton from water | Frog |
| APC-15 | `HAND OVER!` | In a redox reaction, one atom gives electrons and another takes them. | A zinc strip in a solution of copper ions; zinc atoms hold spare electrons. | Drag electrons from zinc atoms to copper ions until the strip is copper-coated. | Each zinc atom drifts off as an ion, and each copper ion becomes metal on the strip. | Dragging from copper to zinc: the copper won't let go. | Rust: iron giving electrons to oxygen | Beaver |

### Unit 5: Kinetics
Why it matters: reaction speed sets the shelf life of medicines and foods, the timing of industrial reactors and how fast a drug is cleared from the body.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | See HC-24, HC-25 (temperature and catalysts) | | | | | | |
| APC-16 | `AIM!` | Molecules react only when they meet the right way round. | Two molecules, each with one glowing reactive end. | Turn one with a drag and launch it at the other. | The glowing ends meet and snap into product. | Hitting the dull end: it bounces off with a boing. | The target spins | Ant |
| APC-17 | `HURRY!` | The slowest step sets the pace of a multi-step process. | A bucket brigade: a fast frog passes buckets to a slow turtle, who passes them on. A fire to put out. | Tap an animal to speed it up until the fire is out in time. | Speeding up the turtle makes the whole line faster, and the fire goes out. | Speeding up the frog: buckets pile up in front of the turtle and the fire keeps burning. | Three steps: find the slow one | Turtle |

### Unit 6: Thermochemistry
Why it matters: the energy stored in bonds sets how much heat fuels and foods release, which engineers use to size boilers and cooling systems.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | See MC-14, HC-21 to HC-23, MC-08 | | | | | | |
| APC-18 | `BREAK AND MAKE!` | Breaking bonds takes energy, making bonds releases it, and the difference is the heat of the reaction. | Hydrogen and chlorine molecules, an energy bar, and a cold beaver by a campfire. | Pull the old bonds apart, then snap the new ones together. | The bar rises as bonds break, then drops even lower as stronger bonds form, and the extra warms the beaver. | Expecting breaking to release energy: the bar rises and the beaver shivers. | A reaction whose new bonds are weaker (it gets colder) | Beaver |
| APC-19 | `HIKE!` | The total energy change depends only on the start and the finish, not the route. | A valley, a summit and two trails: one straight up and one over a smaller hill first. | Walk a hiker up each trail. | Both reach the same height in the end; the detour's extra up and down cancels. | Stopping at the small hill: the hiker is not at the summit yet. | Combine two known reactions to reach a third | Rabbit |

### Unit 7: Equilibrium
Why it matters: equilibrium sets how much product a factory can make, how much of a mineral dissolves (scale in pipes, kidney stones) and how tightly a drug binds its target.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | See HC-26, HC-27 (shifting and holding equilibrium) | | | | | | |
| APC-20 | `TIP!` | The equilibrium constant says how far a reaction goes toward products. | A flask where A turns into B and back, and a jar that wants mostly B. | Slide the dial that sets how strongly the reaction favours B until the jar fills with B. | At a big setting the flask settles mostly B, and the reaction still runs both ways. | Expecting a big setting to make it faster: a clock beside it shows the same speed. | Show the K label after the picture | Beaver |
| APC-21 | `SATURATE!` | Water can hold only so much dissolved salt. | A glass of water and a pile of salt. | Stir in spoonfuls until a spoonful stays on the bottom. | Each spoonful vanishes until the water is full; then crystals settle and stay. | Shaking the whole pile in at once: a heap sits at the bottom, undissolved. | Chalk barely dissolves at all | Duck |
| APC-22 | `CROWD OUT!` | Adding more of one ion makes a dissolved salt come back out as solid. | A clear silver chloride solution and a salt shaker. | Shake salt in until white solid falls. | Extra chloride crowds the solution and silver chloride snows out. | Shaking in sugar: nothing happens. | Ammonia pulls the silver back into solution | Duck |

### Unit 8: Acids and Bases
Why it matters: blood, soil, swimming pools, fermentation and cell cultures all need their pH held steady by buffers, and whether a drug holds its proton decides where in the body it is absorbed.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | See HC-28 to HC-30 | | | | | | |
| APC-23 | `POP!` | A strong acid lets go of all its protons; a weak acid lets go of only a few. | Two beakers of acid molecules, each holding a proton. | Tap the protons to pop them off until one beaker's pH meter turns red. | The strong acid's protons pop off at a touch and its meter goes red fast. | Tapping the weak acid: its protons spring back on, and the fox's taps barely move the meter. | Vinegar against stomach acid | Fox |
| APC-24 | `PROTECT!` | A buffer grabs added acid, so the pH barely changes. | Acid rain falls toward a pond of fish; a sack of buffer. | Stir buffer into the pond before the rain arrives. | Each falling proton is grabbed and the pH needle hardly moves; the fish keep swimming. | No buffer: the needle dives and the fish frown. | Keep adding rain until the buffer runs out | Frog |
| APC-25 | `ABSORB!` | A drug crosses the gut wall only when it is uncharged, which depends on the pH. | An aspirin tablet, a very acidic stomach and a less acidic gut, each with a wall. | Drag the aspirin along the gut until it passes through a wall. | In the stomach it keeps its proton, stays uncharged and slips through. | In the gut it loses its proton, becomes charged and bounces off the wall. | A basic drug, which does the opposite | Hedgehog |
| APC-26 | `FIZZ AWAY!` | Acid dissolves a carbonate antacid, which neutralises the acid. | A chalky antacid tablet and a cartoon stomach full of acid. | Drop the tablet in and stir until the acid is calmed. | It fizzes out carbon dioxide and the stomach's acid meter falls. | Dropping it in plain water: it sits there. | Tooth enamel in acidic drinks | Duck |

### Unit 9: Thermodynamics and Electrochemistry
Why it matters: these rules decide which reactions can happen at all, which matters for batteries, fuel cells, corrosion and how living cells drive uphill reactions. Electroplating protects and decorates metals.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| APC-27 | `HERD!` | Particles spread out by themselves and never gather back on their own (entropy). | A box of gas particles held in its left half by a wall. | Pull the wall out, then try to herd the particles back into the left half. | They spread out and stay spread out; herding works only for a moment. | Waiting for them to return: the timer runs out and they're still everywhere. | Ink in water | Ant |
| APC-28 | `THAW!` | Whether something happens depends on both energy and spreading out, and heat helps spreading win. | An ice block in a tug-of-war: "hold together" pulls one way, "spread out" pulls the other. | Slide the temperature until the ice melts. | Above 0 °C the "spread out" side wins and the ice melts. | Sliding colder: "hold together" wins and the ice grows. | A reaction that only goes when hot | Penguin |
| APC-29 | `HITCH!` | A downhill reaction can drive an uphill one. | A cart stuck at the foot of a hill (a reaction cells need) and a cart at the top of another (ATP). | Hitch the downhill cart to the uphill one. | The downhill cart pulls the other over the top. | Hitching two uphill carts: neither moves. | See APB-08 | Ant |
| APC-30 | `LIGHT UP!` | A battery pushes electrons from a metal that gives them up to one that takes them. | Zinc and copper strips, two solutions, a wire, a salt bridge and a dark bulb. | Put the pieces together until the bulb lights. | Electrons flow from zinc to copper through the wire; the zinc thins and copper builds up. | No salt bridge: the flow stops at once. | Pairs far apart on the metal ladder light brighter | Frog |
| APC-31 | `RUN DOWN!` | A battery dies as it reaches equilibrium. | A glowing battery-powered lamp. | Hold to run the lamp until it goes out, then drag the charger on. | The bulb dims steadily, not all at once. Charging pushes electrons back the other way. | Letting go early: the lamp is still dimly on. | Which side's metal runs out first | Frog |
| APC-32 | `PLATE!` | Each electron that flows deposits metal, so more current or time gives a thicker coat. | A key hanging in copper solution, wired to a battery. | Slide the current and hold until the key is fully coated. | Copper atoms land on the key and it turns shiny copper. | Turning the current off: the key stays dull. | Silver plating | Beaver |

---

## Introductory university chemistry (OpenStax, *Chemistry 2e*)

Source: the chapter list of OpenStax *Chemistry 2e* (21 chapters), read from OpenStax's own book file (github.com/openstax/osbooks-chemistry-bundle, collections/chemistry-2e.collection.xml). All 21 chapter titles are verified. Most of the book's ideas are already mapped in the high school and AP courses above. The first table maps those chapters to their games; the tables after it add games for ideas those courses leave out. Chapter 20 (Organic Chemistry) is mapped in the next course.

### Chapters already covered
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Ch. 3 Composition of Substances and Solutions: see HC-11, LB-05, LB-06 | | | | | | |
| — | — | Ch. 4 Stoichiometry of Chemical Reactions: see HC-12 to HC-16, APC-14, APC-15 | | | | | | |
| — | — | Ch. 5 Thermochemistry: see HC-21 to HC-23, APC-18, APC-19 | | | | | | |
| — | — | Ch. 9 Gases: see HC-17, HC-18, APC-07, APC-08 (and OC-05 below) | | | | | | |
| — | — | Ch. 12 Kinetics: see HC-24, HC-25, APC-16, APC-17 | | | | | | |
| — | — | Ch. 13 Fundamental Equilibrium Concepts: see HC-26, HC-27, APC-20 | | | | | | |
| — | — | Ch. 14 Acid-Base Equilibria: see HC-29, HC-30, APC-23 to APC-26 | | | | | | |
| — | — | Ch. 15 Equilibria of Other Reaction Classes: see APC-21, APC-22 | | | | | | |
| — | — | Ch. 16 Thermodynamics: see APC-27 to APC-29 | | | | | | |
| — | — | Ch. 20 Organic Chemistry: see the next course | | | | | | |

### Ch. 1: Essential Ideas
Why it matters: knowing whether a measurement is accurate (on target) or precise (repeatable) is part of every lab report and every quality check in a factory.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| OC-01 | `THROW!` | Accurate means close to the target; precise means close to each other. | A dartboard and a fox with a wobbly dart arm and a steady one. | Throw darts until three land together on the bullseye. | Tight cluster on the bullseye: accurate and precise, and the crowd cheers. | A tight cluster off to one side: precise but not accurate, and the crowd claps politely at the wall. | A balance that reads the same wrong weight every time | Fox |

### Ch. 2: Atoms, Molecules, and Ions; Ch. 6: Electronic Structure and Periodic Properties
Why it matters: each element gives off its own colours of light. That is how fireworks are coloured, how streetlights glow and how astronomers learn what stars are made of.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Atoms, isotopes, ions and periodic trends: see HC-01 to HC-06 | | | | | | |
| OC-02 | `COLOUR THE SKY!` | Each metal glows its own colour in a flame. | A night sky, a fireworks rocket, and dishes of salts. | Dip the wire loop in salts and hold it in the flame until the rocket's colours match a picture: red, yellow, green. | Lithium burns crimson, sodium yellow and copper green, and the rocket bursts in those colours. | Dipping the same salt three times: the whole show comes out yellow. | A mix where yellow hides lilac | Fox |
| OC-03 | `DROP DOWN!` | An electron falling from a higher energy rung to a lower one gives out light; a bigger drop gives bluer light. | An electron at the top of a ladder of energy rungs, and a dark lantern. | Drag the electron down rungs until the lantern glows blue. | A big drop flashes blue light; a small drop flashes red. | Dragging it up: the lantern dims, because climbing takes energy in. | Make a red and a blue lantern | Frog |

### Ch. 7: Chemical Bonding and Molecular Geometry; Ch. 8: Advanced Theories of Covalent Bonding
Why it matters: how evenly atoms share electrons predicts whether a substance dissolves in water or oil, which matters for drugs, dyes, cleaning and stains.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Bonds and shapes: see HC-07 to HC-10 | | | | | | |
| OC-04 | `TUG!` | Atoms that pull harder on shared electrons make a lopsided bond; a big difference pulls the electron right over. | A tug-of-war rope with a shared electron pair in the middle; pick two atoms to pull. | Choose pullers until the electrons slide all the way to one side. | Sodium against chlorine: the pair slides over completely, an ionic bond. | Two hydrogens: the pair stays dead centre, and both pullers fall over backwards. | Liquid oxygen sticks to a magnet (a property explained by Ch. 8) **[TRIMMED]** | Owl |

### Ch. 9: Gases; Ch. 10: Liquids and Solids
Why it matters: car airbags inflate from a small pellet, freeze-drying makes instant coffee and vaccines, and the way atoms pack sets how dense and strong a metal is.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| OC-05 | `CUSHION!` | A small amount of solid can turn into a large volume of gas. | A crash-test penguin, a steering wheel and a tiny pellet. | Tap the crash button at the moment of impact. | The pellet reacts into a huge cloud of gas particles that fill the airbag, and the penguin bounces softly. | Tapping too late: the penguin bonks the wheel (cartoon, unhurt). | Two passengers | Penguin |
| OC-06 | `PACK!` | Staggering layers packs more spheres into the same space. | A crate and a pile of oranges. | Stack oranges in the crate until no more fit. | Staggered layers, each orange sitting in the dip of the row below, pack the crate tightly. | Stacking straight up in columns: gaps open, and the lid won't close on the last oranges. | Metal atoms packed the same ways | Beaver |
| OC-07 | `FREEZE-DRY!` | At very low pressure, ice turns straight into vapour without melting. | A tray of frozen strawberries in a chamber with a pump. | Pump the air out until the strawberries are dry. | Ice puffs straight off as vapour, and the strawberries stay frozen-shaped and crunchy. | Warming instead of pumping: they melt into mush. | Coffee | Rabbit |

### Ch. 11: Solutions and Colloids
Why it matters: road salt, antifreeze, IV drips that must match blood, and fizzy drinks all depend on how dissolved particles change a liquid.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| OC-08 | `SALT THE ROAD!` | Dissolved particles get in the way of freezing, so salty water freezes at a lower temperature. | An icy road below freezing and a penguin trying to walk; salt and sand. | Sprinkle the road until the ice melts. | Salt dissolves into the ice and it melts to slush, though the air is still below freezing. | Sprinkling sand: the penguin grips better, but the ice stays ice. | Antifreeze in a car | Penguin |
| OC-09 | `UNCAP!` | Gas dissolves better in cold liquid under pressure, and fizzes out when warm or opened. | A warm soda bottle and a cold one. A duck wants to open one without a mess. | Twist the cap off a bottle. | The cold soda hisses gently and stays in the bottle. | Opening the warm one: it fizzes over and soaks the duck. | Shake one first | Duck |
| OC-10 | `BEAM!` | Particles in a colloid are big enough to scatter light; a true solution isn't. | A laser pointer and glasses of salt water, diluted milk and fog. | Shine the beam through the glasses until it shows as a line. | In the milk and the fog the beam becomes a glowing line. | Shining through salt water: the beam stays invisible. | Gelatin and smoke | Fox |

### Ch. 17: Electrochemistry; Ch. 18: Representative Metals, Metalloids, and Nonmetals
Why it matters: protecting ships, bridges and pipes from rust saves huge sums, and silicon's in-between conductivity is why computer chips are made from it.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Batteries and plating: see APC-30 to APC-32 | | | | | | |
| OC-11 | `SAVE THE SHIP!` | A more reactive metal attached to steel corrodes instead of the steel. | A steel ship's hull rusting in sea water; blocks of zinc and copper. | Bolt a block onto the hull until the rust stops spreading. | Zinc corrodes slowly in place of the hull, and the rust stops. | Copper: the hull rusts faster, and the turtle shakes its head. | A buried pipe | Turtle |
| OC-12 | `ZAP!` | Metals conduct well, nonmetals don't, and metalloids such as silicon conduct a little. | A bulb tester and samples: aluminium, silicon, sulfur and copper. | Touch the tester to samples until you've found a bright, a dim and a dark bulb. | Aluminium and copper glow bright, silicon glows dim, sulfur stays dark. | Expecting shiny silicon to glow brightly: the bulb only flickers. | Graphite, a nonmetal that conducts | Beaver |

### Ch. 19: Transition Metals and Coordination Chemistry
Why it matters: metal ions held by surrounding molecules carry oxygen in blood (iron in haemoglobin), act as cancer drugs and colour paints and gems.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| OC-13 | `GRAB!` | A metal ion can be held by several molecules around it, and that changes its colour. | A pale cobalt ion in water and a crowd of ammonia molecules. | Drag ammonia molecules onto the ion until six hold it. | The six molecules lock around the ion and the solution's colour changes. | Only three: the colour stays halfway and the octopus keeps juggling. | Haemoglobin's iron grabs oxygen | Octopus |
| OC-14 | `TINT!` | A coloured thing looks the colour that is left after it soaks up the others. | A white lamp, a glass of a coloured complex, and a target that should glow blue. | Slide filters in until the light that comes through is blue. | Taking out orange light leaves blue, and the target glows blue. | Taking out blue: the light turns orange. | A complex that soaks up red | Bird |

### Ch. 21: Nuclear Chemistry
Why it matters: radiocarbon dating dates archaeological finds, and the energy that holds nuclei together is the energy of the Sun and of nuclear power.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Decay, half-life, shielding and fission: see HC-31 to HC-34 | | | | | | |
| OC-15 | `DATE!` | Older remains have less carbon-14 left, because it decays at a steady pace. | Three bones in a museum case, each with a few glowing carbon-14 atoms, and a timeline. | Hang each bone on the timeline so that the ones with fewer glowing atoms hang further back. | The bones line up from youngest to oldest, and an Ice Age mammoth appears behind the oldest. | Hanging them by size: the biggest bone is labelled "newest", and the mammoth looks offended. | Too old to date: nothing glows | Fox |
| OC-16 | `FUSE!` | When small nuclei fuse, a little mass turns into a lot of energy. | Two small hydrogen nuclei and a balance in the core of a sun. | Push the nuclei together until they fuse. | They fuse into helium, which is a tiny bit lighter on the balance, and the missing bit flashes out as sunlight. | Pushing too gently: they bounce apart. | Why fusion needs huge heat and pressure | Owl |

---

## Organic chemistry and biochemistry (OpenStax, *Organic Chemistry*, with *Chemistry 2e* Ch. 20)

Source: the chapter list of OpenStax *Organic Chemistry* (31 chapters), read from OpenStax's own book file (github.com/openstax/osbooks-organic-chemistry, collections/organic-chemistry.collection.xml). All chapter titles are verified. The chapters are grouped into 7 units below (this grouping is this file's own), and each heading names the chapters it covers. Chapters that are mainly catalogues of reactions for synthesis get one game per idea.

### Unit 1: Reading structures and naming (Ch. 1 Structure and Bonding; Ch. 2 Polar Covalent Bonds, Acids and Bases; Ch. 3 to 5 Alkanes, Cycloalkanes and Stereochemistry)
Why it matters: skeletal drawings are the everyday language of drug labels, patents and biology papers, and a medicine's mirror-image forms can act very differently in the body.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| OR-01 | `FILL IN!` | In a skeletal drawing, each corner is a carbon, and hydrogens are hidden until you fill them in. | A zigzag line with six corners and ends. | Tap each corner and end. | Each becomes a carbon and fills with hydrogens until it has four bonds, and the label C₆H₁₄ appears. | Tapping the middle of a line: a bond, not an atom, so nothing appears. | A ring with a branch | Ant |
| OR-02 | `CRAWL!` | A molecule's name is built around its longest carbon chain. | A branched carbon skeleton and an ant at one end. | Drag the ant along the longest path of carbons. | The chain lights up and the name's root (but-, pent-) writes itself, then the branch's position. | Walking a shorter path: the name comes out longer than it should and blinks. | Two branches | Ant |
| OR-03 | `MIRROR!` | A carbon with four different groups has a mirror image that won't line up with it, like a left and a right hand. | A molecule with a carbon holding four different coloured groups, and a mirror. | Drag the mirror image onto the original and try to line it up. | It never fits, however it's turned, and the frog holds up its two hands. | Choosing a carbon with two identical groups: its mirror image lines up perfectly. | Find the special carbon in a bigger molecule | Frog |
| OR-04 | `TOSS!` | Acids give protons to stronger grabbers. | A proton ball held by an acetic acid molecule and a hydroxide ion with open hands. | Toss the proton toward the stronger grabber. | Hydroxide catches it and keeps it, making water. | Tossing it to a weak grabber: it bounces straight back. | Rank three grabbers | Frog |

### Unit 2: Reactions with curved arrows (Ch. 6 to 9: An Overview of Organic Reactions; Alkenes; Alkynes)
Why it matters: chemists reason about reactions they've never seen by following where the electrons go, and alkene reactions make plastics and fuels.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| OR-05 | `PUSH!` | Electrons flow from where there are many to where there are few. | Propene's double bond (a glowing pair of electrons) next to an H–Br molecule. | Drag the electron pair from the double bond to the hydrogen. | The pair grabs the hydrogen, the H–Br bond's pair leaves with the bromine, and a positive carbon is left glowing. | Dragging from the hydrogen to the double bond: the hydrogen has no electrons to give, and the arrow fizzles. | Then let the bromide attack the positive carbon | Fox |
| OR-06 | `ATTACH!` | Bromine ends up where the steadier positive carbon forms (Markovnikov's rule). | Propene and HBr; two possible positive carbons wobble. | Put the hydrogen on an end so the other carbon becomes the steady one, then drop in the bromine. | The middle carbon holds steady and bromine bonds there. | Hydrogen on the middle: the end carbon wobbles and collapses. | A larger alkene | Bird |

### Unit 3: Substitution and elimination (Ch. 10 Organohalides; Ch. 11 Reactions of Alkyl Halides)
Why it matters: substitution reactions build many drug molecules, and the backside attack explains why a reaction can flip a molecule's handedness.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| OR-07 | `BACKSTAB!` | In an SN2 reaction, the attacker hits the carbon from behind as the leaving group leaves. | A carbon with a bromine on its front; a hydroxide flies in. | Aim the hydroxide at the carbon's back and launch it. | The three other groups flip inside out like an umbrella in the wind, and the bromine flies off. | Aiming at the bromine side: the hydroxide bounces off its cloud. | Big crowded groups block the back, so the reaction takes the other route (SN1) | Duck |

### Unit 4: Identifying molecules with spectra (Ch. 12 Mass Spectrometry and Infrared Spectroscopy; Ch. 13 NMR; Ch. 14 Conjugated Compounds and UV Spectroscopy)
Why it matters: labs identify unknown compounds, check purity and catch fake medicines with IR and NMR spectra every day.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| OR-08 | `PLUCK!` | Each kind of bond vibrates at its own pitch, like a guitar string, and that pitch identifies it. | A molecule with bonds drawn as strings, and a spectrum with two empty peak slots. | Pluck bonds until the spectrum's peaks are filled. | The stiff C=O bond rings a high note that fills one slot; the O–H bond rings a broad note that fills the other. | Plucking a C–H bond for the C=O slot: the note is wrong and the slot stays empty. | Identify an unknown from three peaks | Fox |
| OR-09 | `LISTEN!` | In NMR, a hydrogen's signal splits into one more peak than it has hydrogen neighbours. | Ethanol, with its CH₃ hydrogens glowing and their signal on a screen. | Tap the neighbouring hydrogens one by one. | Each neighbour splits the signal once more, until it shows three peaks. | Tapping its own hydrogens: the signal doesn't change. | The CH₂ signal splits into four | Rabbit |

### Unit 5: Rings, functional groups and their reactions (Ch. 15 to 24: aromatics, alcohols, ethers, carbonyl compounds, carboxylic acids and derivatives, amines)
Why it matters: functional groups tell you how a molecule behaves. Joining acids and alcohols makes fragrances and flavours, soap making is the reverse of that reaction, and a breath-alcohol test oxidises ethanol.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| OR-10 | `CIRCLE!` | A functional group is a small part of a molecule that decides how it behaves. | An aspirin molecule, with three glowing outlines waiting to be filled. | Trace a circle around each group: the acid, the ester and the ring. | Each circled group shows its behaviour in a mini-clip (the acid fizzes in base, the ester smells). | Circling a single carbon: it does nothing interesting. | Caffeine's groups | Owl |
| OR-11 | `SNIFF!` | An acid and an alcohol join into an ester, often with a fruity smell, and give off water. | A beaker of vinegar (an acid), a beaker of alcohol, and a nose waiting at the top. | Drag the acid's OH and the alcohol's H together to make water, then join the two halves. | Water drips away, the ester clicks shut and a banana-scented cloud puffs up. | Taking the OH from the alcohol: the pieces don't fit and a sour smell comes out. | Make a pear smell | Bird |
| OR-12 | `LATHER!` | Soap molecules have an oily tail and a watery head, so they lift grease into water. | A greasy plate, plain water, and a pot of fat and lye. | Stir the pot to make soap, then scrub the plate. | Soap molecules surround each grease drop, oily tails in, and carry it away. | Scrubbing with plain water: the grease smears around. | Hard water makes scum | Beaver |
| OR-13 | `BREATHE OUT!` | Oxidising ethanol changes the test crystals from orange to green. | An old breath-alcohol tester with orange crystals. | Blow into the tube (hold) until the crystals change colour. | Ethanol in the breath is oxidised, and the crystals turn green. | Blowing a breath with no alcohol: the crystals stay orange. | Which alcohol shapes resist being oxidised | Fox |
| OR-14 | `REPAIR!` **[WEAK FIT]** | A synthesis is a chain of reactions, and one wrong step breaks it. | A three-step conveyor making a product, with one step that keeps failing. | Swap the reagent on the broken step until the product comes off the end. | Each step plays its reaction, and the full product drops out. | Swapping a working step: it breaks too. Planning a whole synthesis is open-ended; fixing one step is the playable part. | Four steps | Owl |

### Unit 6: Biomolecules (Ch. 25 Carbohydrates; Ch. 26 Amino Acids, Peptides, and Proteins; Ch. 27 Lipids; Ch. 28 Nucleic Acids)
Why it matters: food labels, protein purification in biotech labs, cholesterol and diet advice all rest on how these four kinds of molecule are built.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| OR-15 | `JOIN!` | Sugars and amino acids link into chains by giving off a molecule of water at each link. | Two glucose rings (or two amino acids) floating apart. | Drag one onto the other until they link. | An OH and an H pop off as a water drop, and the two are joined through one atom. | Joining them without the water leaving: a drop stays stuck in the middle and sparks. | Build a chain of five | Rabbit |
| OR-16 | `MELT THE FAT!` | Straight fat chains stack into a solid; kinked ones can't, so they stay liquid. | Butter and olive oil on a cold plate; zoomed in, straight and kinked chains. | Stack each fat's chains into a block. | The straight butter chains stack tightly and stay solid. | Trying to stack the kinked oil chains: they slide apart and the oil runs off the plate. | A trans fat (straight despite its double bond) | Penguin |
| OR-17 | `PARK!` | An amino acid's charge depends on the pH, and at one pH it is neutral. | An amino acid on a gel with a plus end and a minus end, and a pH slider. | Slide the pH until the amino acid stops drifting. | At its neutral pH it parks in the middle of the gel. | Sliding to one extreme: it races to an end and bumps off the gel. | Separate two proteins this way | Owl |
| — | — | Nucleic acids (Ch. 28): see HB-19 to HB-22 below | | | | | | |

### Unit 7: Metabolism and polymers (Ch. 29 The Organic Chemistry of Metabolic Pathways; Ch. 30 Pericyclic Reactions; Ch. 31 Synthetic Polymers)
Why it matters: an enzyme's top speed is used to dose drugs and design tests, fat breakdown explains energy use in the body, and nylon and polyester are made by joining molecules.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| OR-18 | `LOAD UP!` | An enzyme has a top speed: once every enzyme is busy, adding more substrate doesn't help. | A beaver at a conveyor, chewing logs one at a time, and a log pile. | Drop logs onto the conveyor until the output reaches its fastest. | Output rises, then levels off when the beaver works flat out. | Dumping the whole pile: logs pile up and the output stays the same. | Add a second beaver | Beaver |
| OR-19 | `SNIP!` | Fats are broken down two carbons at a time to release energy. | A long fatty-acid chain and a pair of scissors; a running rabbit's energy bar is low. | Snip two-carbon pieces off the end until the chain is gone. | Each piece flies off to power the rabbit, whose bar fills. | Snipping in the middle: the scissors jam. | A chain with a kink | Hedgehog |
| OR-20 | `PULL!` | Joining two kinds of molecule end to end makes a long fibre, such as nylon. | A beaker with two layers of liquid and tweezers. | Pull the film at the boundary up and out. | A rope of nylon pulls out of the beaker, growing as new links form at the boundary. | Pulling too fast: the rope snaps. | Polyester | Ant |
| OR-21 | `CLOSE THE RING!` **[TRIMMED]** | Some reactions form a ring in one smooth step. | A curved diene and a small molecule. | Drag the small molecule into the diene's open arms. | Three bonds shift at once and a six-membered ring clicks shut. | Approaching end-on: nothing joins. | A molecule with a side group | Octopus |

---

## Middle school biology (KA: "Middle school biology", /science/ms-biology; NGSS MS-LS)

Source: KA's "Middle school biology" course (listed in the KA blog post of 2025-08-14). The course page itself could not be read. Verified from khanacademy.org search results: the units "Cells and organisms" (quiz title), "Inheritance and variation" (page title), "Interactions in ecosystems" (page title) and the unit slug "matter-and-energy-in-organisms" (lesson "Food and energy in organisms"). Reconstructed (unverified): a unit on natural selection and evolution, covering NGSS MS-LS4. The NGSS middle school life science standards (MS-LS1 to MS-LS4) were used to check that every important idea is mapped.

### Unit 1: Cells and organisms (MS-LS1-1, 1-2, 1-3, 1-8)
Why it matters: knowing what cells are and how organs work together is the base of medicine, nursing, food science and every later biology course.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MB-01 | `ZOOM!` | Living things are made of cells. | A leaf under a microscope, blurry and plain green. | Turn the zoom dial up until the leaf's surface is clear. | The green breaks into tiny boxes with green dots inside: cells. | Zooming the sky behind the leaf: plain blue, no cells. | Onion skin and your own cheek | Owl |
| MB-02 | `EQUIP!` | Each part of a cell has a job. | An empty plant cell outline; a nucleus, mitochondria, chloroplasts, a vacuole and a wall float nearby. | Drag the parts in until the cell comes alive. | The nucleus lights up like a control room, chloroplasts catch sunlight, mitochondria spark and the wall stiffens. | Leaving out the chloroplasts: the cell sits in the sun and stays hungry. | An animal cell (no wall or chloroplasts) | Beaver |
| MB-03 | `DELIVER!` | Body systems work together: lungs take in oxygen, blood carries it, muscles use it. | A rabbit at a race start; an oxygen token at its nose. | Drag the token from the nose to the lungs, into the blood and to a leg muscle. | The muscle sparks and the rabbit sprints off. | Dragging it straight from the lungs to the leg: it gets stuck with no blood to carry it. | Carry carbon dioxide back out too | Rabbit |
| MB-04 | `YANK!` | Nerves carry signals fast, and a reflex acts before the brain even notices. | A fox's paw rests on a stone that starts to glow hot. | Tap the paw the instant the stone glows. | A spark races up a nerve to the spinal cord and back, and the paw jerks away before the "ouch" thought bubble appears. | Waiting: the paw lingers, and the fox hops about blowing on it. | A shorter glow warning | Fox |

### Unit 2: Matter and energy in organisms (MS-LS1-4 to 1-7)
Why it matters: photosynthesis and respiration explain food, farming, exercise and diet, and the carbon cycle that affects climate.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MB-05 | `SOAK UP!` | Plants build their bodies from carbon dioxide in the air and water, using sunlight. | A small tree in sunlight, carbon dioxide bubbles drifting, water in the soil, and a bag of soil. | Drag carbon dioxide and water into the leaf until the tree grows a new ring. | Sugar forms in the leaf, oxygen bubbles out, and the trunk thickens. | Stuffing soil into the leaf: it falls straight out, and the tree doesn't grow. | Keep it growing through a cloudy day | Bird |
| MB-06 | `POWER UP!` | Cells release energy by combining food with oxygen. | A tired rabbit; a mitochondrion; sugar and oxygen floating nearby. | Feed sugar and oxygen into the mitochondrion until the rabbit can run. | Energy sparks flow to the legs, carbon dioxide and water drift out, and the rabbit runs. | Sugar with no oxygen: a little fizzle of energy, and the rabbit tires after two hops. | Keep up with a sprint | Rabbit |
| MB-07 | `POLLINATE!` | Flowers make fruit when pollen is carried from flower to flower. | Two apple trees in blossom and a bee. | Fly the bee from a flower on one tree to a flower on the other. | Pollen rubs off and the second flower swells into an apple. | Flying back to the same flower: no apple. | A breeze and a hungry bird | Bird |

### Unit 3: Interactions in ecosystems (MS-LS2-1 to 2-5)
Why it matters: farming, fisheries, pest control and conservation all depend on how energy and food move between living things.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MB-08 | `HAND UP!` | Only a small part of the energy at each level of a food chain reaches the next. | A big glowing ball of energy in the grass, a rabbit above it and a fox above that. | Carry the ball up the chain to the fox. | At each step most of the ball steams off as heat, and the fox gets a small glow. | Expecting the fox to get the whole ball: the bar ends up tiny. | Add an owl on top: it gets almost nothing | Fox |
| MB-09 | `UNLEASH!` | Predator and prey numbers rise and fall in a chase. | A meadow full of rabbits and a den of foxes. | Release foxes when the rabbits are plentiful, and watch the seasons. | The foxes grow in number, the rabbits fall, then the foxes fall and the rabbits recover. | Releasing too many foxes at once: rabbits vanish, then the foxes go hungry and leave. | Keep both populations going for three cycles | Fox |
| MB-10 | `ROT!` | Decomposers turn dead things back into soil food for plants. | A fallen log, mushrooms and worms, and a seedling beside it. | Tap the mushrooms and worms to wake them. | The log crumbles into soil, and the nutrients flow into the seedling's roots. | Tapping the seedling: it waits, still hungry. | A leaf pile and three seedlings | Hedgehog |
| MB-11 | `RAIN!` | A habitat can support only so many animals, and the limit changes with resources. | Frogs in a pond, a rain cloud you can move. | Rain on the pond to grow the frog population as large as it can go. | Frogs multiply and then level off at what the pond can feed. More rain raises the level. | Too little rain: the pond shrinks and the frogs crowd onto one lily pad. | A dry year | Frog |
| MB-12 | `FENCE!` | Fixing the cause of a problem in an ecosystem lets it recover. | A muddy river with few fish; cows trampling its bank. | Drag a fence along the riverbank. | Plants regrow on the bank, the water clears and the fish return. | Adding more fish instead: they swim into the mud and the duck shrugs. | Two causes | Duck |

### Unit 4: Inheritance and variation (MS-LS3-1, 3-2)
Why it matters: genetics is used in plant and animal breeding, in medicine and in genetic counselling for families.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MB-13 | `CROSS!` | Each parent gives one copy of each gene, so two brown parents can have a white baby. | Two brown rabbits, each holding a "brown" card and a hidden "white" card. A 2 × 2 nest. | Drag one card from each parent into each nest box. | Four baby rabbits appear: three brown and one white. | Putting both cards from one parent into a box: the baby comes out with two heads of fur and tips over. | Rabbits with two genes at once | Rabbit |
| MB-14 | `MUTATE!` | Changing one letter of DNA can change a protein's shape and what it does. | A strand of DNA beads, and the key-shaped protein it makes, which opens a lock. | Swap one bead and watch the protein fold. | The new key folds slightly differently and no longer turns the lock. | Swapping a bead that changes nothing: the key still works (a silent change). | A change that makes a better key | Fox |
| MB-15 | `CLONE!` | Offspring from one parent are copies; from two parents, a mix. | A strawberry plant with a runner, and its seeds. | Snip the runner and plant it, then plant a seed. | The runner grows into an exact copy; the seedling grows a little different. | Expecting the seedling to be a copy: its leaves come out a different shape. | Bacteria splitting | Rabbit |

### Unit 5: Natural selection and evolution (MS-LS4-1 to 4-6; title reconstructed)
Why it matters: evolution explains antibiotic resistance, pesticide resistance and how crops and animals were bred, and it is the organising idea of all of biology.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MB-16 | `HUNT!` | Animals that are hard to spot survive and pass on their colour, so the population changes. | Pale and dark moths on sooty tree trunks. You are a hungry bird. | Tap every moth you can see in 5 seconds. | The ones you miss survive and breed; after three rounds most moths are dark. | Expecting moths to change colour to hide: each keeps its own colour, and only the mix changes. | Clean the soot, and pale moths return | Bird |
| MB-17 | `DIG!` | Deeper rock layers are older, so their fossils are older. | A cliff with five rock layers, and a dig site. | Dig down through the layers. | Fossils appear from youngest at the top (a mammal) to oldest at the bottom (a trilobite). | Digging sideways: you hit the same layer again and again. | A folded layer | Turtle |
| MB-18 | `BREED!` | Choosing which plants have offspring changes a crop over generations. | A field of corn with cobs of different sizes. | Plant seeds from the biggest cobs each season. | After three seasons the cobs are much bigger. | Planting random cobs: the cobs stay the same. | Breed for two traits at once | Rabbit |
| MB-19 | `COLOUR IN!` | Different animals' limbs share the same bones, a sign of common ancestry. | A human arm, a bat wing, a whale flipper and a bird wing, all grey. | Paint each bone in one limb, then drag the colours onto the matching bones of the others. | The same colours line up in every limb: the same plan, reshaped. | Matching by job (wing to wing): the colours clash. | A frog's leg | Bird |

---

## High school biology (KA: "High school biology", /science/hs-bio)

Source: KA's NGSS-aligned "High school biology" course (/science/hs-bio). The course page itself could not be read. Verified from khanacademy.org search results and a third-party listing (s4me.info): the units "From cells to organisms", "Gene expression and regulation", "Inheritance and variation of traits" and "Mechanisms of evolution" (page and unit-test titles), and the unit slugs "ecology-and-natural-systems" (which holds the course's welcome video) and "energy-and-matter-in-biological-systems". The order of the units is reconstructed. KA's older course of the same name (/science/hs-biology) has 9 units, listed by Classtime: Biology foundations, Cells, Energy and transport, Reproduction and cell division, Classical genetics, Molecular genetics, Evolution, Ecology and Human body systems. Every one of those topics is covered by the 6 units below.

### Unit 1: Ecology and natural systems
Why it matters: wildlife managers count populations, food-safety rules depend on how fast bacteria multiply, and farmers depend on the nitrogen cycle.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HB-01 | `MULTIPLY!` | Bacteria double again and again, so their numbers explode. | A sandwich left out on a picnic blanket; a few bacteria on it; a clock. | Tap the clock to jump forward, and get the sandwich back into the cooler before the bacteria cover it. | Each tap doubles the bacteria: 2, 4, 8, 16, … and the patch spreads across the bread. | Waiting too long: the sandwich turns green and fuzzy and the rabbit holds its nose. | A warm day doubles faster | Rabbit |
| HB-02 | `TAG!` | Tagging some animals and catching a sample later tells you how many there are. | A murky lake; a net, and tags. | Tag fish in a first catch, release them, then cast the net again. | The second catch shows a few tagged fish among many untagged, and the lake fills with silhouettes in the same mix. | Casting the second net right where you released the tagged fish: it's all tagged, and the estimate is far too small. | Fish that hide after tagging | Duck |
| HB-03 | `FOLLOW!` | Carbon cycles from air to plants to animals and back. | A glowing carbon atom in the air above a meadow. | Drag the atom along its path: into a leaf, into a rabbit that eats it, and back out in its breath. | Each stop plays its process, and the atom stays the same glowing dot. | Dragging it into the soil and stopping: it sits there and the loop never closes. | Burning coal adds old carbon to the air | Rabbit |
| HB-04 | `FIX!` | Bacteria on some plant roots turn nitrogen from the air into food for plants. | A pale bean plant; nitrogen molecules in the air; bacteria in bumps on its roots. | Drag nitrogen molecules to the root bumps. | The bacteria break the nitrogen apart into plant food, and the bean plant turns green. | Dragging nitrogen straight to the leaves: plants can't use it, and it drifts off. | Next year's wheat grows better after beans | Rabbit |
| HB-05 | `REMOVE!` | A new species brought in from elsewhere can crowd out the native ones. | A lake where an introduced fish is spreading among native fish. | Net the introduced fish before they outnumber the natives. | The native fish return and the turtle swims easy. | Netting native fish: their numbers crash. | The invaders breed faster | Turtle |

### Unit 2: Energy and matter in biological systems
Why it matters: enzymes are used in washing powder, cheese making and medicine, and a fever changes how fast enzymes work in the body.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HB-06 | `COOK!` | Enzymes work fastest at body temperature and break when too hot. | A beaver (the enzyme) chewing starch logs into sugar, and a temperature dial. | Turn the dial to get the most logs chewed in 5 seconds. | Near body temperature the beaver chews fastest. | Turning it all the way up: the beaver's teeth melt into a puddle (the enzyme unfolds) and stops for good. | Add a pH dial | Beaver |
| HB-07 | `SNAP!` | Cells use ATP like a battery: snapping off its last phosphate releases energy. | A tired muscle and a string of ATP molecules. | Snap the last phosphate off each ATP to flex the muscle. | The muscle flexes with each snap, and spent ADP floats off to be recharged. | Snapping the middle phosphate: it won't come off. | Keep up with fast contractions | Rabbit |
| HB-08 | `LOOP!` | Plants and animals pass matter back and forth: oxygen and sugar one way, carbon dioxide and water the other. | A chloroplast and a mitochondrion side by side, with molecules waiting. | Drag each product from one into the other until both keep running. | A loop of arrows closes; sunlight enters one side and heat leaves the other. | Sending sunlight around the loop: it leaves as heat and the loop stalls. | Faster loop | Frog |

### Unit 3: From cells to organisms
Why it matters: cell size limits explain why bodies are made of many small cells, osmosis decides which IV drips are safe, and feedback loops such as blood sugar control are what fail in diseases such as diabetes.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HB-09 | `SPLIT UP!` | Small cells have more surface for their size, so food can reach their middles. | A growing cell with food drifting in through its surface; its centre starts to darken. | Split the cell in two before its centre goes dark. | Two small cells: food reaches every part and they glow. | Letting it grow huge: food can't reach the middle and its centre goes grey. | A long thin cell (a nerve) | Hedgehog |
| HB-10 | `DUNK!` | Water moves into or out of a cell toward the saltier side. | A red blood cell, a glass of pure water, a glass of salty water, and a glass of matching saline. | Dunk the cell until it stays plump and healthy. | In the matching saline it bobs happily. | Pure water: it swells and pops like a balloon. Salty water: it shrivels like a raisin. | A plant cell, whose wall stops it bursting | Octopus |
| HB-11 | `DIVIDE!` | A cell copies its chromosomes, lines them up and pulls them apart into two new cells. | A cell with four coloured chromosomes. | Hold to copy, swipe to line them up, then swipe apart. | Each new cell gets one copy of each colour. | Pulling apart before lining up: one cell gets two of the same colour and wilts. | Eight chromosomes and a timer | Beaver |
| HB-12 | `STAY COOL!` | The body keeps its temperature steady by sweating and shivering. | A penguin walks from a snowstorm into a desert; a thermometer with a green band. | Tap sweat when it's hot and shiver when it's cold, to keep the needle in the band. | Each response pushes the needle back to the middle. | Shivering in the desert: the needle climbs and the penguin turns red. | Faster weather changes | Penguin |
| HB-13 | `OPEN!` | Insulin opens doors so that cells take in sugar from the blood. | Blood full of sugar after a meal; muscle cells with closed doors. | Send insulin keys to the doors until the blood sugar falls into the green band. | The doors open, sugar flows in and the cells glow. | Sending too many keys: blood sugar drops too low and the rabbit gets dizzy. | Glucagon pushes it back up | Rabbit |

### Unit 4: Inheritance and variation of traits
Why it matters: genetic counsellors, plant and animal breeders and doctors use these rules to work out the chance that a child, seedling or calf will have a trait.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | One-gene crosses: see MB-13 | | | | | | |
| HB-14 | `HALVE!` | Egg and sperm cells get one chromosome from each pair, so the baby ends up with full pairs. | A cell with three pairs of chromosomes, and two empty "egg" and "sperm" bubbles. | Pull the pairs apart so that each bubble gets one of each. | The egg and the sperm meet and their chromosomes pair up again into a healthy baby cell. | Putting both copies of a pair in one bubble: the baby cell has three of one kind and wobbles. | Mixing up which copy goes where (many combinations) | Frog |
| HB-15 | `PASS DOWN!` | Genes on the X chromosome pass from mothers to sons differently. | A mother carrying a colour-blindness gene on one X, a father and four children's cradles. | Pass an X from the mother and an X or Y from the father into each cradle. | The sons who get her marked X are colour-blind; the daughters get a normal X from their father and see normally. | Passing the father's X to a son: the son becomes a daughter, and the owl shrugs. | Haemophilia in a royal family tree | Owl |
| HB-16 | `TYPE!` | Blood types are named after markers on red blood cells, which antibodies clump. | Four blood samples and two droppers of testing antibodies. | Drop antibodies into samples until all four types are found. | Samples clump with one dropper, both, or neither: A, B, AB and O. | Mixing a sample with the wrong antibody: no clumping, and the vial is labelled "?". | See AN-14 for transfusions | Owl |
| HB-17 | `DUST!` | Some traits blend: neither version hides the other. | A red snapdragon, a white one, and a pollen brush. | Dust pollen from one onto the other and grow the seeds. | All the new flowers bloom pink. | Dusting red onto red: just red, and the bird yawns. | Cross two pinks: red, pink and white return | Bird |
| HB-18 | `TRACE!` | A hidden gene can pass through healthy carriers and appear in their child. | A family tree where two healthy parents have a child with a trait. | Trace the hidden gene back up from the child to its parents. | Both parents light up as carriers, half-glowing. | Tracing it to only one parent: the child's glow flickers out. | Three generations | Fox |

### Unit 5: Gene expression and regulation
Why it matters: reading DNA and RNA sequences is daily work in biotech, medical genetics and vaccine design (mRNA vaccines carry a message that cells read into a protein).

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| HB-19 | `PAIR!` | DNA's letters pair up: A with T, and G with C. | One half of a DNA ladder and a bin of letter rungs. | Snap the matching letter onto each rung. | The ladder zips closed and twists into a helix. | A with G: the rung bulges and the ladder kinks. | Against the clock | Ant |
| HB-20 | `WRITE!` | A gene's DNA is copied into a messenger (mRNA), which uses U instead of T. | A gene on a DNA strand and a copying machine sliding along it. | Drag the machine along the gene. | Each letter pulls in its partner, a U appears wherever T would, and the message peels off. | Putting T into the message: it bounces out and a U snaps in. | Copy only the gene, not its neighbours | Bird |
| HB-21 | `READ!` | A ribosome reads the message three letters at a time and joins the matching building blocks. | An mRNA message and a ribosome at its start. | Slide the ribosome along, three letters at a step. | Each step brings in one amino acid and the chain grows until a "stop" word releases it. | Sliding one letter at a time: the ribosome jams. | A message with a stop in the middle | Ant |
| HB-22 | `INSERT!` | Adding one letter shifts every three-letter word after it. | A gene shown as words: THE CAT ATE THE RAT. | Insert one extra letter after the first word. | Every word after it is garbled (THE CCA TAT ETH ERA T), and the protein comes out a jumble. | Swapping a letter instead: only one word changes (THE BAT ATE THE RAT). | Delete three letters | Fox |
| HB-23 | `SWITCH ON!` | Every cell has the same genes; different cells switch on different ones. | A muscle cell and a nerve cell with identical switchboards. | Switch on the muscle genes in the muscle cell. | It builds muscle proteins and starts to twitch. | Switching on everything: the cell becomes a confused blob. | Also switch on the nerve cell's genes | Owl |

### Unit 6: Mechanisms of evolution
Why it matters: evolution by natural selection explains why bacteria become resistant to antibiotics and insects to pesticides, and how flu viruses change from year to year.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Selection by predators: see MB-16 | | | | | | |
| HB-24 | `TREAT!` | An antibiotic kills the bacteria it can, so the few resistant ones take over. | A dish of bacteria; a few have armour. | Tap the antibiotic button each time the dish regrows. | Unarmoured bacteria die; armoured ones survive and multiply, and after three rounds the dish is full of armour. | Expecting the drug to teach bacteria to resist: the armour was there before the drug, and the zoom shows it. | Add a second drug the armour doesn't stop | Hedgehog |
| HB-25 | `SHUFFLE!` | Random mating keeps gene proportions steady, and a hidden gene can be common in carriers. | A population of cats, a few white; each cat's genes shown as two beads. | Shuffle the cats into random pairs for a new generation. | Each generation has about the same mix, and many coloured cats carry a hidden white bead. | Pairing only white cats: white suddenly booms, which shows that choosing mates changes the mix. | A predator that eats white kittens | Fox |
| HB-26 | `TOPPLE!` | In a small population, chance alone can change which genes survive. | A small island of red and green beetles; a boulder on the hill. | Push the boulder down the hill. | It crushes a random patch of beetles; the survivors happen to be mostly green, and so are their babies. | Pushing it on a huge island: the mix barely changes. | Repeat it and get a different result | Turtle |
| HB-27 | `BRANCH!` | Shared features show which animals share ancestors. | An empty family tree and a fish, a frog, a lizard and a rabbit. | Hang each feature (backbone, legs, shelled eggs, fur) on the branch where it first appears. | The tree grows branch by branch, and each animal shows every feature below its branch. | Fur below the frog: the frog suddenly grows fur. | Add a bird | Rabbit |
| HB-28 | `PART!` | When a population is split for a long time, the two groups become separate species. | A squirrel population; a river ready to flood through the middle. | Drag the river across the population, then fast-forward. | Each side changes colour and call; when the river dries, the two groups ignore each other. | Removing the river too soon: they mix again. | A mountain range and three groups | Fox |

---

## AP Biology (College Board CED; KA: "AP®︎/College Biology", /science/ap-biology)

Source: the College Board's "AP Biology Course at a Glance" PDF (fetched 2026-11-05), which lists 8 units and their numbered topics; all unit titles and topic numbers are verified from it. KA's course uses the same units; the titles "Cell Structure and Function" and "Gene Expression and Regulation" and their URLs were verified from a third-party listing (s4me.info). The games below add the ideas that the high school course leaves out.

### Unit 1: Chemistry of Life
Why it matters: water's stickiness lets trees lift water and insects walk on ponds, and how proteins fold decides how every enzyme and medicine target works.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| APB-01 | `SKATE!` | Water molecules cling to each other, making a surface skin strong enough to hold an insect. | A pond skater insect at one edge of a pond; a lily pad at the other. | Drag the skater across the surface to the lily pad. | Its feet dimple the surface but don't break it, and a zoom shows water molecules holding hands. | Dragging it through a soapy patch: the skin breaks and it sinks with a glug. | A paperclip floated on water | Frog |
| APB-02 | `ZIP!` | Building a chain gives off water; breaking it takes water in. | A chain of sugar beads and a cup of water. | Zip beads onto the chain, then unzip them with water drops. | Each new link pops out a water drop; each drop added breaks a link (as in digestion). | Unzipping without water: the chain won't break and the beaver chews it in vain. | A protein chain | Beaver |
| APB-03 | `FOLD!` | A protein folds so that its oily parts hide inside, and its shape makes it work. | A floppy chain of beads, some oily (yellow), floating in water. | Fold the chain until no yellow bead touches the water. | It folds into a compact shape with a pocket that grabs its target molecule. | Leaving yellow beads outside: the protein clumps with others into a useless tangle. | Heat unfolds it again | Owl |

### Unit 2: Cells
Why it matters: how molecules cross cell membranes decides how drugs get into cells, how nerves fire and why salty soil kills crops.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Cell size and osmosis: see HB-09, HB-10 | | | | | | |
| APB-04 | `SLIP THROUGH!` | Small oily molecules cross a membrane directly; others need a channel or a pump. | A cell membrane with a channel and a pump; oxygen, glucose and sodium molecules outside. | Get each molecule into the cell. | Oxygen slips straight through, glucose goes through its channel, and sodium needs the pump. | Pushing glucose straight at the membrane: it bounces off with a boing. | Water channels | Octopus |
| APB-05 | `PUMP!` | Pumps use energy to move ions against the flow, uphill. | Sodium ions crowded inside a cell; a pump; ATP batteries. | Tap ATP into the pump to push sodium out until the inside is clear. | Each tap pumps sodium out against the crowd. | Tapping without ATP: the pump sags and sodium leaks back in. | Pump potassium in at the same time | Ant |
| APB-06 | `WATER!` | Water flows out of roots into salty soil, so salty soil makes plants wilt. | A droopy plant, a can of fresh water and a can of salty water. | Water the plant until it stands up. | Fresh water flows into the roots and the stem stiffens. | Salty water: water flows out of the roots and the plant flops flat. | A salt-tolerant plant | Rabbit |
| APB-07 | `ENGULF!` | Mitochondria began as bacteria living inside bigger cells. | A big ancient cell and small energy-making bacteria swimming past. | Engulf a bacterium without digesting it. | It settles inside, starts making energy for its host, and becomes a mitochondrion with its own DNA. | Digesting it: a burp, and no new energy. | A second engulfing that makes a chloroplast | Fox |

### Unit 3: Cellular Energetics
Why it matters: many drugs work by blocking enzymes, and the way cells make ATP explains exercise, cyanide poisoning and how bread rises.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Enzymes, ATP and the matter loop: see HB-06 to HB-08 | | | | | | |
| APB-08 | `SPIN!` | Cells pump protons uphill, and the protons rushing back spin a turbine that makes ATP. | A membrane like a dam, protons on the low side, and a turbine (ATP synthase). | Mash to pump protons up behind the dam, then let them flow. | They rush back through the turbine, it spins and ATP pops out. | Poking a hole in the dam: protons leak around the turbine and it stops (like some poisons). | Keep the turbine spinning steadily | Beaver |
| APB-09 | `JAM!` | An inhibitor that fits the enzyme's pocket blocks its real target. | An enzyme pocket, its target molecules and look-alike blockers. | Flood the enzyme with target molecules until it works again. | Targets outnumber the blockers and the enzyme gets back to work. | Adding more blockers: the enzyme jams completely. | A blocker that grabs the side of the enzyme, which flooding can't fix | Octopus |
| APB-10 | `CATCH LIGHT!` | Chlorophyll catches light, which splits water and releases oxygen. | A leaf in sunlight; photons rain down on chlorophyll antennas. | Tap the photons as they hit the antennas. | Each catch excites an electron; water splits and oxygen bubbles rise. | Tapping the green light: chlorophyll reflects it (which is why leaves look green), and nothing happens. | Red and blue light both work | Bird |
| APB-11 | `HOLD BREATH!` | Without oxygen, cells switch to fermentation, which makes much less energy. | A rabbit sprinting uphill; a breathing button. | Hold your breath for the rabbit and keep it running. | It keeps running on fermentation, slower and slower. | Holding too long: the legs burn and the rabbit flops; bread dough rises from the same process. | Yeast in bread | Rabbit |

### Unit 4: Cell Communication and Cell Cycle
Why it matters: hormone signals and cell-cycle checkpoints are what cancer drugs, blood thinners and many other medicines act on.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Negative feedback: see HB-12, HB-13 | | | | | | |
| APB-12 | `RELAY!` | A signal at a cell's surface is passed inside and gets stronger at every step. | One hormone molecule taps a receptor; a relay of runners waits inside. | Pass the baton down the relay. | Each runner hands it to several more, so a crowd of messengers reaches the nucleus. | Dropping the baton: the message stops at the door. | A drug that blocks one runner | Ant |
| APB-13 | `CHECK!` | Checkpoints stop cells with damaged DNA from dividing. | Cells pass through a gate on a dividing conveyor; some have cracked DNA. | Close the gate on every damaged cell. | Damaged cells stop for repair, healthy ones divide. | Letting a damaged cell through: it divides into a growing clump (a tumour). | Faster conveyor | Owl |
| APB-14 | `PILE ON!` | In positive feedback, each step brings more of the same, as when blood clots. | A cut in a blood vessel; platelets flow past. | Tap the first platelets at the cut. | Each stuck platelet calls more, until a plug seals the cut. | Tapping platelets away from the cut: a clump forms in the wrong place. | Birth contractions | Hedgehog |

### Unit 5: Heredity
Why it matters: meiosis's shuffling is why siblings differ, and mistakes in it cause conditions such as Down syndrome, which prenatal tests look for.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Halving chromosomes, crosses, sex-linked traits and pedigrees: see HB-14 to HB-18 | | | | | | |
| APB-15 | `DEAL!` | Each egg or sperm gets a random mix of the parent's chromosomes. | A parent's three chromosome pairs, each pair one red and one blue, like cards. | Deal one card from each pair into each of four egg cells. | Every egg gets a different mix of red and blue. | Dealing all reds into one egg: possible, but the next eggs show how rare it is. | Five pairs: many more mixes | Fox |
| APB-16 | `CROSS OVER!` | Paired chromosomes swap pieces, mixing genes on the same chromosome. | A red and a blue chromosome lying side by side. | Swipe across them to swap a segment. | Each now carries red and blue pieces, and the baby rabbits show new combinations. | Swapping a whole chromosome: nothing new, just the same two. | Genes far apart swap more often | Rabbit |
| APB-17 | `SEPARATE!` | If a chromosome pair fails to separate, a cell ends up with an extra copy. | A pair of chromosomes stuck together in a dividing cell. | Pull the pair apart before the cell splits. | Each new cell gets one copy. | Pulling too late: one cell gets both copies and an extra-copy label appears. | Three pairs at once | Frog |
| APB-18 | `CHILL!` | The environment can change how a gene shows. | A white Himalayan rabbit, whose fur grows dark where it is cold, and an ice pack. | Hold the ice pack on its back until the patch grows in. | A dark patch of fur grows exactly where the ice was. | Holding it on the warm tummy too briefly: no change. | Hydrangeas change colour with soil | Rabbit |

### Unit 6: Gene Expression and Regulation
Why it matters: PCR, gel electrophoresis and gene editing are everyday tools in hospitals, forensics and biotech, and gene switches explain how one genome makes many cell types.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Base pairing, copying a gene, reading a message and mutations: see HB-19 to HB-23 | | | | | | |
| APB-19 | `REPLICATE!` | DNA is copied by unzipping it and building a new partner for each strand. | A DNA ladder and a zipper pull. | Pull the zipper and snap partners onto both halves. | Two identical ladders form, each with one old and one new strand. | Snapping onto only one half: one ladder, and a lonely half-strand. | One strand is built in short pieces | Ant |
| APB-20 | `SPLICE!` | Messages are edited: some pieces (introns) are cut out before reading. | A message with coloured parts and grey filler pieces. | Cut out the grey pieces and join the coloured ones. | The edited message slides into a ribosome and makes a working protein. | Cutting out a coloured piece: the protein comes out missing a chunk. | Two ways to splice one message | Fox |
| APB-21 | `UNBLOCK!` | A gene can be held off by a blocker that its trigger molecule lifts away. | A bacterial gene blocked by a repressor; a lactose sugar floats nearby. | Drop the lactose onto the blocker. | The blocker lets go, the gene switches on and lactose-eating enzymes appear. | Pushing the blocker off by hand: it snaps back. | Glucose present: the gene stays low anyway | Owl |
| APB-22 | `RUN!` | Small DNA pieces move faster through a gel than big ones. | A gel slab with a well of mixed DNA pieces and an electric switch. | Switch on the current until the pieces spread out into bands. | Small pieces race ahead; big ones lag, and bands appear. | Running it too long: the small pieces run off the end of the gel. | Match a crime-scene sample to a suspect | Fox |
| APB-23 | `CYCLE!` | Repeated heating and cooling copies DNA, doubling it each time (PCR). | One DNA strand in a tube, with a heater and a cooler. | Tap heat, cool, heat, cool, in rhythm. | Each cycle doubles the copies: 1, 2, 4, 8 … and the tube glows. | Skipping the cool step: nothing copies, and the strands float apart. | Faster rhythm | Ant |
| APB-24 | `CUT!` | Gene editing finds a matching sequence and cuts there. | A long DNA strand and a pair of guided scissors with a short code. | Slide the scissors along until their code matches, then snip. | They lock onto the matching spot and cut, and a repair patch slides in. | Snipping at a mismatch: the scissors bounce. | Two cuts to remove a piece | Hedgehog |

### Unit 7: Natural Selection
Why it matters: selection explains drug and pesticide resistance and the breeding of crops and animals.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Selection, resistance, drift, family trees and new species: see MB-16, HB-24 to HB-28 | | | | | | |
| APB-25 | `PICK OFF!` | Which individuals survive changes how the whole population is spread out. | Birds with beaks of many sizes, spread on a hill-shaped bar chart. Some seeds are only cracked by big beaks. | Drop hard seeds until the population's hump moves toward big beaks. | Small-beaked birds go hungry and the hump shifts to the right. | Dropping soft seeds: every beak eats and the hump stays put. | Two seed types, so the hump splits in two | Bird |
| APB-26 | `SPARK!` | Lightning in early Earth's gases can make the building blocks of life. | A flask of early-Earth gases with electrodes. | Mash the spark button. | Brown goo with amino acids collects at the bottom. | Sparking an empty flask: nothing forms. | Clay surfaces helping chains form | Owl |

### Unit 8: Ecology
Why it matters: fisheries set catch limits, conservation groups protect key species, and farmers plant mixtures so that one disease can't wipe out a crop.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Energy flow, predators and prey, carrying capacity: see MB-08, MB-09, MB-11 | | | | | | |
| APB-27 | `OPEN GATE!` | Animals move toward the conditions they need. | A box half damp and half dry, with a gate; pill bugs on the dry side. | Open the gate. | The pill bugs wander until most gather on the damp side. | Opening a gate to a hot, dry box: they curl up and stay put. | Light and dark too | Hedgehog |
| APB-28 | `HARVEST!` | Taking too many fish crashes a population; taking fewer lets it keep growing back. | A fish population that regrows each season, and a net. | Net fish each season and keep the catch going for five seasons. | A moderate catch leaves enough fish to breed, and the net fills every season. | Netting everything: next season the sea is empty and the duck stares into it. | A warm year with slower growth | Duck |
| APB-29 | `TAKE AWAY!` | Some species hold a whole ecosystem together. | A kelp forest with sea otters, sea urchins and fish. | Take away one species and watch. | Taking away the urchins: the kelp thrives. | Taking away the otters: urchins multiply and eat the kelp forest bare. | Bring the otters back | Turtle |
| APB-30 | `SOW!` | A mix of species survives a disease that wipes out a single crop. | A bare field, seed bags of one crop and of a mixture, and a blight cloud on its way. | Sow the field before the blight arrives. | With a mixture, some plants survive and the field stays green. | All one crop: the blight wipes it out and the rabbit cries. | Bees that need different flowers | Rabbit |

---

## Introductory university biology (OpenStax, *Biology 2e*)

Source: the unit and chapter list of OpenStax *Biology 2e* (8 units, 47 chapters), read from OpenStax's own book file (github.com/openstax/osbooks-biology-bundle, collections/biology-2e.collection.xml). All titles are verified. Most chapters are already covered by the courses above or by Anatomy and Physiology below; the tables add games for the rest, mainly biological diversity and plants.

### Unit 1: The Chemistry of Life (Ch. 1 to 3); Unit 2: The Cell (Ch. 4 to 10); Unit 3: Genetics (Ch. 11 to 17); Unit 4: Evolutionary Processes (Ch. 18 to 20)
| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Ch. 1 The Study of Life: see LB-13 to LB-15 (fair tests, causes, repeats); Ch. 2 and 3: see MC-01, HB-06, APB-01 to APB-03 | | | | | | |
| — | — | Ch. 4 to 10 (cells, membranes, metabolism, respiration, photosynthesis, communication, reproduction): see MB-01 to MB-06, HB-06 to HB-11, APB-04 to APB-14 | | | | | | |
| — | — | Ch. 11 to 17 (meiosis, Mendel, inheritance, DNA, genes, expression, biotechnology): see MB-13 to MB-15, HB-14 to HB-23, APB-15 to APB-24 | | | | | | |
| — | — | Ch. 18 to 20 (evolution, populations, phylogenies): see MB-16 to MB-19, HB-24 to HB-28, APB-25, APB-26 | | | | | | |

### Unit 5: Biological Diversity (Ch. 21 to 29: viruses, prokaryotes, protists, fungi, seedless and seed plants, animal diversity, invertebrates, vertebrates)
Why it matters: telling microbes, fungi, plants and animals apart is how doctors choose treatments (an antibiotic does nothing against a virus), how farmers fight pests, and how ecologists survey a habitat.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| OB-01 | `INFECT!` | A virus can't copy itself; it injects its genes into a cell, which makes new viruses until it bursts. | A virus landing on a bacterium. | Push the virus's genes into the cell. | The cell fills with new viruses and bursts, releasing them. Antibiotic pills float by and do nothing to the viruses. | Pushing genes into a rock: nothing happens, because a virus needs a living cell. | The cell defends itself by cutting the viral genes | Fox |
| OB-02 | `STAIN!` | Bacteria with thick walls hold a purple stain; thin-walled ones wash pink. | A slide with two kinds of bacteria, a purple dye, a rinse and a pink dye. | Dab purple, rinse, then dab pink. | Thick-walled bacteria stay purple, thin-walled ones turn pink, and two different medicines slide in to match. | Skipping the rinse: everything stays purple and they can't be told apart. | Three kinds on one slide | Owl |
| OB-03 | `KEY OUT!` | Living things are identified by a chain of yes-or-no features. | A mystery leaf and a path of gates, each asking about one feature by picture (jagged edge, needles, veins). | Walk the leaf through the gates, taking the path its features match. | It reaches the end of the right path and the tree it came from grows up. | Taking the "needles" path for a broad leaf: a pine tree appears and the leaf looks embarrassed. | A mystery insect | Fox |
| OB-04 | `PUFF!` | Fungi spread by releasing clouds of tiny spores. | A puffball mushroom on a forest floor. | Tap it with a raindrop (tap the cloud above it). | A cloud of spores puffs out and drifts, and new mushrooms pop up across the floor. | Tapping it on a dry day with no rain: a weak puff. | Bread mould spreading across a slice | Hedgehog |
| OB-05 | `SPROUT!` | Seeds carry a baby plant and food, so they survive dry times; spores need water. | A dry desert patch, fern spores and a pine seed. | Scatter both across the patch, then wait for one rain. | The seed waits safely and sprouts after the rain; the spores dry up first. | Scattering only spores: nothing grows, and a tumbleweed rolls past. | Flowers and fruit carry seeds further | Rabbit |
| OB-06 | `X-RAY!` | Animals with backbones (vertebrates) are a small group among all animals. | A row of animals: a worm, an insect, a snail, a fish, a frog and a bird, and an X-ray lamp. | Sweep the X-ray across the row. | Backbones light up in the fish, the frog and the bird; the rest have none. | Expecting the snail's shell to be a backbone: it shows up as a hard outside coat instead. | Starfish and squid | Turtle |

### Unit 6: Plant Structure and Function (Ch. 30 to 32)
Why it matters: farmers and gardeners manage water, light and fertiliser by these rules, and knowing why leaves close their pores helps breed drought-tolerant crops.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| OB-07 | `DRINK!` | Water evaporating from leaves pulls water all the way up from the roots. | A tall tree with a water level at its roots; the sun is behind a cloud. | Drag the cloud off the sun. | Water vapour escapes from the leaves and the water column climbs the trunk to replace it. | Wrapping the leaves in plastic: nothing evaporates and the water stops climbing. | A windy day | Bird |
| OB-08 | `LEAN!` | Plants grow toward light. | A seedling in a box with one window. | Move the lamp around the box. | The seedling bends toward the lamp, and its shady side grows faster. | Putting the lamp right on top: it grows straight up, unimpressed. | Roots grow down, whatever way the pot is turned | Frog |
| OB-09 | `CLOSE UP!` | Leaves close their pores in a drought to save water. | A leaf's pores, shown as tiny mouths, on a hot dry day. | Close the pores until the leaf stops wilting. | Water stops escaping and the leaf stands up again. | Closing all of them all day: the leaf can't take in carbon dioxide and stops making food. | Open them at night (some desert plants do) | Rabbit |
| OB-10 | `FERTILIZE!` | Plants need minerals from the soil; lacking one, leaves turn yellow. | A yellowing tomato plant and three fertiliser bags: nitrogen, phosphorus and potassium. | Sprinkle fertiliser until the leaves are green again. | Nitrogen turns the old yellow leaves green, and fruit sets. | Dumping the whole lot: the roots burn and the plant droops. | A different deficiency | Beaver |

### Unit 7: Animal Structure and Function (Ch. 33 to 43)
Why it matters: how animals keep warm, move, sense and fight disease is the base of veterinary work and of human medicine.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Nerves, senses, hormones, muscles and bones, breathing, circulation, kidneys, immunity and reproduction: see Anatomy and Physiology (AN-01 to AN-24) below | | | | | | |
| OB-11 | `HUDDLE!` | Animals lose heat through their surface, so huddling together keeps them warm. | A snowstorm and five scattered penguins with frosty thermometers. | Drag the penguins together into a huddle. | Their outside surface shrinks, and the thermometers warm. | Leaving one out: it frosts over and shuffles back in. | Take turns on the cold edge | Penguin |

### Unit 8: Ecology (Ch. 44 to 47)
Why it matters: road builders and conservation groups add wildlife corridors so that animals can reach mates and food across a broken-up landscape.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Populations, communities and ecosystems: see MB-08 to MB-12, HB-01 to HB-05, APB-27 to APB-30 | | | | | | |
| OB-12 | `BRIDGE!` | Connecting patches of habitat lets animals move, find mates and survive. | Two patches of forest split by a highway; foxes on one side, a fox on the other. | Drag a green bridge across the highway. | The foxes cross, meet, and the population grows on both sides. | Building it too narrow: the foxes refuse to step onto it. | A river and a field | Fox |

---

## Anatomy and physiology (OpenStax, *Anatomy and Physiology 2e*)

Source: the unit and chapter list of OpenStax *Anatomy and Physiology 2e* (6 units, 28 chapters), fetched from the book's preface page on openstax.org. All titles are verified. Each heading names the chapters it covers.

### Unit 1: Levels of Organization (Ch. 1 to 4)
Why it matters: doctors, nurses and paramedics describe the body with shared words for position and direction, so that "the left side" means the same thing to everyone.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Chemicals, cells and tissues (Ch. 2 to 4): see MC-01, MB-01 to MB-03, HB-09 to HB-11 | | | | | | |
| AN-01 | `PAT LEFT!` | "Left" and "right" always mean the patient's own left and right. | A rabbit patient facing you, a bandage, and a chart that says "LEFT PAW". | Put the bandage on the paw the chart means. | The bandage goes on the paw on your right side, which is the patient's left, and the rabbit smiles. | Bandaging the paw on your left: the rabbit holds up its other, sore paw. | The patient turns around | Rabbit |
| AN-02 | `SLICE!` | The body can be cut into views along three planes: side to side, front to back, top to bottom. | A loaf-shaped cartoon body and a knife; a target view shows the brain from above. | Slice the body so that the cut face matches the target. | A flat top-to-bottom cut shows the brain from above, matching the target. | Slicing down the middle: you see the brain from the side and the knife blushes. | Match a front view | Beaver |

### Unit 2: Support and Movement (Ch. 5 to 11)
Why it matters: physiotherapists, trainers and doctors use how bones, joints and muscles work to treat injuries and design exercises.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AN-03 | `COOL DOWN!` | Skin cools the body by sweating and by sending more blood to the surface. | A hot, red-faced runner. | Tap to open sweat glands and widen skin blood vessels until the thermometer drops. | Sweat evaporates and warm blood flows near the surface to lose heat. | Tapping on a cold day: the runner shivers. | A humid day, when sweat can't dry | Fox |
| AN-04 | `MEND!` | A broken bone heals by forming a soft bridge that hardens into new bone. | A cracked bone and repair cells waiting. | Drag repair cells into the crack, then hold to harden it. | A soft callus bridges the gap, then hardens into bone. | Moving the bone before it hardens: the bridge cracks again. | A splint keeps it still | Beaver |
| AN-05 | `LIFT!` | Muscles pull on bones like levers; a muscle attached near the joint must pull hard to lift a load in the hand. | An arm with a biceps attached near the elbow, and a heavy acorn in the hand. | Pull the biceps until the acorn reaches the mouth. | A small pull of the muscle swings the hand a long way, but needs a big force. | Attaching the muscle at the wrist: the arm lifts easily but only moves a little. | A heavier acorn | Hedgehog |
| AN-06 | `CONTRACT!` | Muscle contracts when calcium lets tiny heads grab and pull filaments past each other. | A zoomed muscle fibre: thick filaments with heads, thin filaments, and calcium drops. | Drop calcium onto the fibre and mash to make the heads pull. | The heads grab and pull, the filaments slide together and the muscle shortens. | Mashing with no calcium: the heads can't reach and the muscle stays slack. | Run out of ATP: the heads stay stuck (cramp) | Ant |
| AN-07 | `SWING!` | Different joints allow different movements. | A puppet with an elbow (a hinge) and a shoulder (a ball and socket). | Swing each limb to wave. | The shoulder swings all round; the elbow bends one way only. | Bending the elbow backwards: the puppet says "nope" and the elbow locks. | Knee and wrist | Owl |

### Unit 3: Regulation, Integration, and Control (Ch. 12 to 17)
Why it matters: nerve signals and hormones are what anaesthetics, painkillers, insulin and many other medicines act on.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Reflexes: see MB-04 | | | | | | |
| AN-08 | `FIRE!` | A nerve signal travels as gates open along the nerve: sodium rushes in, then potassium rushes out. | A nerve fibre with sodium and potassium gates in a row. | Tap the first gate open; then keep the wave going. | The wave of open gates races down the nerve and lights up a muscle at the end. | Opening gates out of order: the signal fizzles halfway. | A painkiller blocks some gates | Fox |
| AN-09 | `INSULATE!` | Insulation around a nerve lets the signal jump from gap to gap, much faster. | A bare nerve and a wrapped one race to ring a bell. | Wrap insulation along the bare nerve before the race. | The signal hops gap to gap and rings the bell first. | Leaving gaps too wide: the signal fades between them. | Damaged insulation, as in some diseases | Hedgehog |
| AN-10 | `FLEE!` | In danger, the body speeds the heart and breathing and slows digestion. | A rabbit eating; a fox appears at the edge. | Hit the alarm button to get the rabbit running. | Its heart speeds, its pupils widen, its lunch pauses and it bolts. | Pressing "rest" instead: the rabbit keeps munching and the fox tiptoes closer. | Calm down after the fox leaves | Rabbit |
| AN-11 | `POST!` | Hormones travel in the blood and act only on cells with a matching receptor. | Hormone envelopes in a blood stream; cells with different mailboxes. | Drop each envelope into a matching mailbox. | Matching cells open the envelope and switch on. | Forcing an envelope into a wrong mailbox: it won't fit and floats on. | Thyroid hormone turns down its own supply | Bird |

### Unit 4: Fluids and Transport (Ch. 18 to 21)
Why it matters: blood typing, heart rhythm and vaccines are everyday medicine, and CPR and safe transfusions save lives.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AN-12 | `BEAT!` | The heart pumps in a steady rhythm and speeds up when the body works harder. | A cartoon heart and a sleeping, then running, rabbit. | Tap the heart in time with the beat cue. | Each beat pushes a pulse of blood along. When the rabbit runs, the cue speeds up. | Tapping too slowly during the run: the rabbit flags and sits down. | An irregular beat to steady | Rabbit |
| AN-13 | `ROUTE!` | Blood goes from the body to the right side of the heart, to the lungs, back to the left side and out to the body. | A red blood cell in a vein and a map of the heart's four rooms and the lungs. | Drag the cell through the rooms in order. | It turns bright red in the lungs and leaves through the big artery. | Skipping the lungs: it goes out still dark and the toes turn blue. | Valves that only open one way | Owl |
| AN-14 | `TRANSFUSE!` | Giving the wrong blood type makes the patient's antibodies clump the new cells. | A patient with type A blood and bags of A, B and O blood. | Drip a bag into the patient. | A or O blood flows smoothly. | Type B: cartoon clumps form in the tube. | Type O as the emergency donor | Owl |
| AN-15 | `GOBBLE!` | White blood cells swallow invading bacteria. | Bacteria swim through a cut; a white blood cell waits. | Steer the white cell into the bacteria. | It wraps around each one and digests it. | Chasing the body's own cells: they wave a "friend" badge and it backs off. | Bacteria that hide in a capsule | Octopus |
| AN-16 | `REMEMBER!` | A vaccine teaches the immune system to recognise a germ, so the next real attack is stopped fast. | A body that meets a harmless "wanted poster" copy of a germ, then the real germ later. | Show the poster to the immune cells, then send in the real germ. | The memory cells recognise it and flood out antibodies at once. | Skipping the poster: the germ spreads for a long time before the defence wakes up. | A germ that changes its face (why some vaccines are yearly) | Hedgehog |

### Unit 5: Energy, Maintenance, and Environmental Exchange (Ch. 22 to 26)
Why it matters: breathing, digestion and the kidneys are what doctors check first, and thin mountain air affects climbers, pilots and athletes.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| AN-17 | `INHALE!` | Pulling the diaphragm down makes room in the chest, so air rushes into the lungs. | A cartoon chest with a dome-shaped diaphragm and floppy lungs. | Pull the diaphragm down. | The chest's space grows and air rushes in, filling the lungs. | Pushing it up: air rushes out and the cheeks puff. | Breathe out slowly to blow out candles | Frog |
| AN-18 | `SWAP!` | In the lungs' tiny air sacs, oxygen moves into the blood and carbon dioxide moves out. | An air sac beside a blood vessel full of dark blood cells. | Swipe oxygen into the blood and carbon dioxide out of it. | The blood cells turn bright red as they pick up oxygen. | Swiping carbon dioxide into the blood: the cells stay dark and the frog yawns. | A smoky air sac with thicker walls | Frog |
| AN-19 | `DIGEST!` | Each digestive enzyme breaks down its own kind of food. | Bread, cheese and butter floating in a stomach and gut; three enzyme scissors. | Drag each enzyme to the food it cuts. | Starch breaks into sugars, protein into amino acids and fat into fatty acids, and they're absorbed. | The fat enzyme on bread: it slides off. | Bile helps break up fat first | Hedgehog |
| AN-20 | `ASCEND!` | Higher up, the air is thinner, so each breath brings in less oxygen. | A climber at the foot of a mountain and an oxygen meter. | Climb, and breathe faster whenever the meter drops. | Each breath holds fewer oxygen dots; breathing faster keeps the meter up. | Climbing fast without breathing faster: the climber gets dizzy and sits down. | Bottled oxygen near the top | Bird |
| AN-21 | `FILTER!` | The kidneys let small things out of the blood, keep cells and proteins, and take back what's useful. | Blood flowing through a kidney filter, carrying cells, proteins, sugar, salt and waste. | Open the filter, then grab back the useful things before they reach the bladder. | Waste flows on as urine; sugar and most water are taken back. | Opening the filter too wide: blood cells leak into the urine. | Too little water to drink: darker urine | Beaver |
| AN-22 | `PANT!` | Breathing out carbon dioxide makes the blood less acidic. | A pH needle drifting acidic after a sprint. | Breathe faster until the needle returns to the green band. | Each breath blows off carbon dioxide and the needle moves back. | Holding the breath: carbon dioxide builds up and the needle swings further. | The kidneys correct it slowly | Rabbit |

### Unit 6: Human Development and the Continuity of Life (Ch. 27 and 28)
Why it matters: fertility doctors, midwives and genetic counsellors work with how a single cell becomes a person.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Inheritance (Ch. 28): see MB-13, HB-14 to HB-18 | | | | | | |
| AN-23 | `MEET!` | One sperm fertilises the egg, and the egg then seals itself against others. | A swarm of sperm and an egg cell. | Steer one sperm into the egg. | It enters, the egg's coat hardens and the other sperm bounce off. | Steering two at once: the second bounces off the hardened coat. | A tougher journey | Duck |
| AN-24 | `SPECIALIZE!` | Cells of an early embryo become different kinds by switching on different genes. | A ball of identical cells and three switches: muscle, nerve, skin. | Flip switches so that each cell becomes something. | Cells turn into muscle, nerve and skin and take their shapes. | Flipping every switch on one cell: it turns into a confused blob. | Build a tiny heart from muscle cells | Owl |

---

## Medicine: doses and tests

Source: not from a course outline. The assignment asked for a short course on medical calculations (dose by weight, IV drip rates, dilutions, BMI, the sensitivity, specificity and positive predictive value of a test, and a drug's half-life). Following the owner's tenth update, each of those topics is mapped to the concept behind the calculation, shown as a picture. These games are not clinical guidance, and each card says so.

### Unit 1: What a dose does in the body
Why it matters: nurses, pharmacists, vets and parents giving children's medicine all work with the idea that the right dose depends on the body and on how long the drug stays in it.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MED-01 | `DOSE!` | A medicine works in a window: too little does nothing, too much causes harm. | A rabbit with a sore leg and a meter of medicine in its blood, with a green band in the middle. | Give pills until the meter sits in the green band. | The leg stops aching while the meter is green. | Too many pills: the meter goes red and the rabbit gets dizzy. Too few: the ache stays. | A narrow window | Rabbit |
| MED-02 | `SIZE UP!` | The same dose is stronger in a small body than in a big one. | A small fish tank and a big one, each needing to reach the same tint, and drops of dye. | Drop dye into each tank until both match the target tint. | The small tank needs only a few drops; the big tank needs many. | Giving the small tank as many drops as the big one: it turns far too dark and the fish swims in circles. | A child and an adult | Duck |
| MED-03 | `SET DRIP!` | With a steady drip in and the body clearing some out, the level rises and then holds steady. | An IV bag dripping into a body that drains a little all the time, and a level meter. | Adjust the drip speed until the level holds in the green band. | The level climbs and then flattens, as much going in as coming out. | Opening the drip wide: the level overshoots into the red. | A body that clears it faster (higher drip needed) | Octopus |
| MED-04 | `MIX UP!` | Strong medicine is diluted with a set amount of liquid before it is given. | A vial of concentrated medicine powder and a bag of fluid. | Add liquid until the colour matches the label. | The mix turns the label's shade, ready to use. | Not enough liquid: it stays too dark and the bag flashes red. | Draw up only part of the mix | Owl |

### Unit 2: How a drug leaves the body
Why it matters: how quickly a drug leaves the body decides how often it is taken, and why some medicines are once a day and others every few hours.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MED-05 | `WASH OUT!` | The body removes a fixed fraction of a drug in each period, so the level halves and halves again. | A bathtub of coloured water (the drug in the body) with a plug that drains half each tick. | Pull the plug and hold until the water is pale. | The level halves each tick, fast at first and then slowly, never quite empty. | Expecting it to empty in two ticks: there's still a quarter left. | Two drugs, one draining faster | Turtle |
| MED-06 | `REDOSE!` | Taking a dose each time the level falls keeps it in the window. | A drug-level line that rises with each dose and falls between them, and a green band. | Tap to take each dose when the line drops to the bottom of the band. | The line zigzags inside the green band all day. | Dosing too early: the peaks stack up into the red. Too late: the line dips out and the ache returns. | A longer-lasting drug | Rabbit |

### Unit 3: Medical tests
Why it matters: doctors, public-health officials and patients decide what to do from test results, and a test can be positive when you are healthy.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MED-07 | `SCREEN!` | When a disease is rare, many positive results are false alarms. | A crowd of 100 animals; 1 is sick. The test lights up the sick one and, by mistake, a few healthy ones. | Scan the crowd with the test. | The sick animal and a handful of healthy ones light up, so most lit animals are healthy. | Treating everyone who lit up: healthy animals get medicine they don't need and grumble. | A common disease, where most lit animals are sick | Owl |
| MED-08 | `CAST NET!` | Making a test catch more sick people also flags more healthy people. | A pond of fish, a few sick (spotted); a net whose mesh you can tighten. | Set the mesh to catch all the spotted fish. | A tight mesh catches every spotted fish, and many healthy ones too. | A loose mesh: healthy fish slip through, but so does a spotted fish. | Balance catching the sick against bothering the healthy | Duck |
| MED-09 | `RETEST!` | A second, different test removes most false alarms. | The animals that lit up in MED-07. | Scan them again with a second test. | The false alarms fade and the truly sick animal stays lit. | Retesting with the same test: the same healthy animals light up again. | A test with fewer false alarms | Owl |

### Unit 4: Body measures and first aid
Why it matters: clinics screen weight against height, and anyone can learn chest compressions.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MED-10 | `LINE UP!` | Weight only means something compared with height, and even that is a rough guide. | A chart with height across and weight up, with a green band, and animals of different sizes. | Stand each animal on the chart. | Each lands by its weight for its height; the tall heavy fox is in the green. | Judging by weight alone: the tall fox gets a "too heavy" sticker it doesn't deserve. | A muscular rabbit that the chart wrongly flags | Fox |
| MED-11 | `COMPRESS!` | Chest compressions pump blood when the heart has stopped; they must be fast and steady. | A training dummy with a beat cue. | Press in time with the cue, fast and steady. | A cartoon pulse of blood flows to the brain with each press. | Pressing too slowly: the flow sputters. The card says to take a real first-aid course. | Keep the rhythm while counting | Beaver |

---

## Advanced chemistry: fire, plasma and extreme matter

Source: not from a course outline. The owner asked for fire, plasma and other advanced topics; this course collects them, chosen and ordered by their use in real jobs and everyday safety. The ideas come from OpenStax *Chemistry 2e* (Ch. 10 Liquids and Solids, for supercritical fluids and crystalline versus amorphous solids), fire-safety pages from CCOHS, the US Fire Administration and OSHA, UCAR and ITER pages on plasma, and NASA JPL on aerogel. Sources are listed per topic in "Sources" at the end.

**Safety rule for this course.** Fire, plasma and cold-liquid games teach the concept and the safe response only. No game or card gives a recipe, a quantity, a mixture or a procedure for making anything burn, explode or give off a toxic gas. Fire-colour games are about colour only, never about what is in a firework. Every fire fail is a cartoon: the host is startled and singed but unhurt, and the card says what to do in real life.

### Unit 1: Fire and how to stop it
Why it matters: every home, kitchen, workshop, farm and factory needs people who know why fires start and spread and how to put out a small one safely. Firefighters, safety officers and facility managers use these ideas daily.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| FP-01 | `SMOTHER!` | A fire needs fuel, heat and oxygen at once (the fire triangle), and taking away any one puts it out. | A campfire inside a glowing triangle whose three sides are pictures: a log, a flame, a puff of air. A shovel of sand, a rake and a bucket of water lie nearby. | Swipe one side of the triangle away (rake the logs apart, shovel sand over it, or splash water to cool it). | The triangle breaks where you swiped, and the flames shrink to smoke and go out. | Fanning the fire: the air side glows brighter, and the flames leap up and toast the fox's marshmallow to charcoal. | The fire is out, but the embers are still hot: stir and cool them too | Fox |
| FP-02 | `LID ON!` | A burning pan of oil is put out by cutting off its air with a lid and turning off the heat; water makes it far worse. | A cooking pot with oil on fire on a stove. A lid, the stove knob and a cup of water sit beside it. | Slide the lid over the pan, then twist the knob off. | The flames vanish under the lid, the pan stops smoking, and the penguin leaves the lid on while it cools. | Tossing the cup of water in: the water sinks, boils into steam at once and throws burning oil up in a cartoon whoosh; the penguin's eyebrows smoke (unhurt). The card says never use water on an oil fire and never carry the pan. | An oven fire: turn it off and keep the door shut | Penguin |
| FP-03 | `PUT IT OUT!` | Each kind of fire needs its own kind of extinguisher: water for wood and paper, never water on live electrics or cooking oil. | A workshop with three small fires: a waste-paper bin, a plugged-in toaster and a deep fryer. A rack holds a water extinguisher, a carbon dioxide one and a wet-chemical one, each with a picture label. | Drag an extinguisher to each fire until all three are out. | Water soaks the paper bin, carbon dioxide smothers the toaster without wetting it, and the wet chemical forms a soapy crust over the fryer. | Water on the toaster: sparks crackle along the stream, the beaver hops back, and the toaster keeps burning. The card says to unplug first and leave large fires to firefighters. | A shelf of metal shavings that needs the special powder for metals | Beaver |
| FP-04 | `FIREBREAK!` | Fire spreads because burning things heat their neighbours until those catch, so a gap with no fuel stops it. | A dry meadow of grass tufts with a small fire at one end, a farmhouse at the other, and a rake. | Rake a strip of bare earth across the meadow before the fire reaches it. | The fire creeps tuft to tuft, reaches the bare strip, finds nothing to heat and dies out. The farmhouse is safe. | A strip too narrow: sparks hop across, the grass on the far side catches, and the rabbit runs for the pond. | Wind blows sparks further, so the strip must be wider | Rabbit |
| FP-05 | `STAY LOW!` | Hot smoke rises and fills a room from the ceiling down, so the cleanest air in a fire is near the floor. | A smoky hallway, a grey layer thickening from the ceiling; a fox at one end and an open door at the other. | Drag the fox to the door, keeping it under the smoke. | Crawling, the fox breathes clear air and reaches the door quickly. | Walking upright: its head disappears into the smoke, it coughs, slows down and bumps a wall. | The smoke layer drops lower as time passes | Fox |
| FP-06 | `MOUNT!` | Smoke reaches the ceiling first, so smoke alarms go high up, where they warn you soonest. | A bedroom with a sleeping hedgehog, a toaster smoking in the next room, and a smoke alarm in your hand. | Stick the alarm somewhere in the hall before the smoke arrives. | Stuck on the ceiling, the alarm beeps as soon as the smoke rolls along the top, and the hedgehog wakes and walks out. | Stuck low on the wall: the smoke fills the ceiling first and the alarm stays quiet until late, while the hedgehog snores. | Test the alarm by pressing its button | Hedgehog |
| FP-07 | `LIGHT THE WICK!` | Solids and liquids don't burn directly; their vapour does. A wick melts and evaporates the wax so its vapour can burn. | A candle on a table at a birthday party and a lit match. | Hold the match to the candle until it stays lit. | At the wick, the wax melts, climbs the wick, turns to vapour and burns with a steady flame. | Holding the match against the side of the candle: wax drips, but no flame catches, and the birthday duck waits. | A cold puddle of oil won't light from a spark, but warmed oil gives off vapour that can (the card explains flashpoint as concept only) | Duck |
| FP-08 | `SHAVE!` | Small pieces burn faster than big ones because more of their surface touches the air. | A cold night, an unlit fire pit, one thick log, a knife and a match. | Swipe the knife along the log to shave off curls, then tap the match. | The thin curls catch at once, and their flames warm the log until it burns too. | Holding the match to the whole log: it blackens a little and goes out, and the owl shivers. | Wet curls: they must dry first | Owl |
| FP-09 | `SWEEP UP!` | Fine dust from flour, sugar, wood or metal can burn almost all at once when it is stirred into a cloud, so factories clean it up before it builds up. | A bakery factory with flour dust settling on beams and machines; a broom and a vacuum on one side, an air hose on the other, and a machine that sometimes sparks. | Sweep and vacuum the dust from every surface before the timer ends. | The beams and machines shine, the spark happens with nothing to catch, and the bakery keeps working. | Blasting the dust with the air hose: it rises into a cloud, the spark flashes through it with a cartoon "whoomph", the alarm sounds and everyone runs out (unhurt). The card says why dust clouds are dangerous, as a concept only. | Dust hiding on top of a high pipe | Ant |
| — | — | Smoke, soot and carbon monoxide from burning with too little air: see CE-06 `ADD AIR!` in the earth and engineering file. Flame colours of metals, which colour fireworks: see OC-02. Reactions that heat themselves up and run away: see CE-17. | | | | | | |

### Unit 2: Plasma, the fourth state of matter
Why it matters: plasma lights signs and streetlamps, cuts steel in workshops, carves the patterns on every computer chip and is what fusion power plants will burn. It is also most of the visible matter in the universe.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| FP-10 | `IONIZE!` | Heating a gas hard enough tears electrons off its atoms, making plasma: a glowing gas of charged particles that a magnet can steer. | A sealed jar of gas atoms (each a ball with an electron circling it), a heat dial and a magnet beside the jar. | Hold the heat on until the gas glows, then wave the magnet. | The atoms speed up, collide, and their electrons fly free; the jar glows, and the glowing cloud bends toward the magnet. | Letting go too soon: the gas is hot but still plain gas; it stays dark and ignores the magnet. | Freeze back down through liquid and solid | Owl |
| FP-11 | `LIGHT THE SIGN!` | Electricity through a thin gas in a tube turns it into plasma that glows a colour set by the gas. | A dark café at night with an unlit glass-tube sign in the window, two tubes of gas and a power switch. | Fit the tubes into the sign and flip the switch until the sign glows. | Each tube glows its gas's colour (neon red-orange, argon blue) and customers walk in. | Fitting a tube with no gas in it: the electricity has nothing to turn into plasma, so that letter stays dark. | Fluorescent tubes: plasma's invisible light makes the coating glow white | Frog |
| FP-12 | `STRIKE!` | Lightning is air turned into plasma by a huge build-up of charge; it takes the easiest path, so a rod and wire can guide it safely into the ground. | A storm cloud crackling above a barn; a metal rod and a cable lie on the ground. | Drag the rod onto the barn roof and the cable down to the ground before the bolt. | The bolt strikes the rod, its glowing plasma channel runs down the cable into the soil, and the cows don't even wake. | Leaving the rod lying in the field: the bolt hits the barn's weathervane and the roof gets a cartoon scorch mark. | Two barns and one rod | Duck |
| — | — | Auroras (solar plasma guided to the poles): see AS-20 `GUIDE!`. The Sun and stars as balls of plasma held up by fusion: see AS-18, APH-01. Lightning making life's building blocks: see APB-26. | | | | | | |
| FP-13 | `SLICE STEEL!` | A plasma cutter blows a thin jet of plasma so hot it melts straight through steel. | A steel plate in a workshop with a star outline drawn on it, and a plasma torch. | Trace the star outline with the torch, steadily. | A bright jet melts a thin line through the plate, and the star drops out clean. | Rushing round the corners: bits stay joined and the star hangs by a thread. | Thicker steel needs a slower trace | Beaver |
| FP-14 | `ETCH!` | Chip makers use plasma to carve patterns: its charged particles eat away the surface wherever a mask doesn't cover it. | A shiny silicon wafer, a stencil mask with a circuit pattern, and a plasma chamber. | Lay the mask on the wafer, then hold the plasma on. | Glowing particles rain down, eat into the bare parts only, and the mask lifts off to show a perfect circuit. | Running the plasma with no mask: the whole surface is eaten evenly, and the wafer is just thinner. | A mask with finer lines | Ant |
| FP-15 | `BOTTLE IT!` | Fusion plasma is far too hot for any wall, so a fusion reactor holds it in a "magnetic bottle" that keeps it from touching the sides. | A doughnut-shaped chamber with a ring of glowing plasma drifting toward one wall; magnet coils around it. | Tap the coils on the side the plasma drifts toward to push it back into the middle. | The plasma ring settles in the centre and glows brighter, and fusion flashes start. | Missing a drift: the plasma touches the wall, cools in an instant and fizzles out. The card says a touch simply stops the reaction; it can't run away. | The plasma wobbles faster | Hedgehog |
| — | — | Why fusion needs huge heat and gives out energy: see OC-16, AP2-43 and AP2-44. | | | | | | |

### Unit 3: Extreme and unusual matter
Why it matters: food makers, labs, hospitals and screen makers use matter in strange states: decaffeinated coffee, frozen samples, MRI coolers, insulation on spacecraft and the screen you are reading.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| FP-16 | `DECAF!` | Squeezed hard and warmed, carbon dioxide becomes a supercritical fluid: it seeps through things like a gas and dissolves things like a liquid. | A tank of jittery coffee beans (each with bouncing caffeine dots), a carbon dioxide pump and a pressure dial. | Pump until the dial reaches its glowing zone, and hold it there. | The carbon dioxide turns into a shimmering in-between fluid, seeps into every bean and carries the caffeine dots out; the beans calm down. | Pumping too little: the carbon dioxide stays a thin gas, whistles past the beans, and the beans keep bouncing. | Then lower the pressure: the fluid turns back to gas and drops the caffeine in a dish | Owl |
| FP-17 | `CREEP UP!` | Cooled almost to absolute zero, liquid helium flows with no friction at all (a superfluid) and creeps up and over the wall of its cup. | A cup of liquid helium inside a very cold chamber, an empty dish beside it, and a cooling dial. | Turn the cooling down and hold it until the dish fills, without touching the cup. | Below a certain temperature the helium climbs the cup's wall in a thin film, drips over the rim and fills the dish. | Not cold enough: the helium just sits and boils gently, and the penguin taps the cup. | A cup with a tiny hole that only a superfluid can leak through | Penguin |
| FP-18 | `FLASH FREEZE!` | Liquid nitrogen is about 200 degrees below freezing, so it freezes soft things solid in seconds, and it boils off into a lot of gas. | A flask of liquid nitrogen giving off fog, a banana, and a nail to hammer into a plank. | Dip the banana in the flask and hold, then use it to hammer the nail. | The banana freezes rock hard and drives the nail in with a clink. | Pulling it out too soon: the banana squishes on the nail head. The card says liquid nitrogen burns skin like fire, needs gloves and goggles, and must never be sealed in a closed bottle or used in a small closed room. | A flower: it shatters like glass when tapped | Rabbit |
| FP-19 | `CRYSTALLIZE!` | Melted material cooled slowly gives its atoms time to line up into a crystal; cooled fast, they freeze in a jumble, which is glass. | A glowing blob of melted sugar (atoms shown as dots), and a cooling slider from slow to fast. A sparkly crystal is pictured on a jar label. | Slide the cooling slow and hold it until the blob sets. | The dots shuffle into neat rows and the blob sets into a sparkly crystal that matches the label. | Cooling fast: the dots freeze where they are, and you get a smooth, clear blob of candy glass. | Metal cooled ultra-fast makes a springy metallic glass for a golf club | Fox |
| FP-20 | `BLACK OUT!` | Liquid-crystal molecules flow like a liquid but line up like a crystal, and a small voltage turns them so each pixel blocks or lets through light. | A screen of glowing pixels, zoomed in on rod-shaped molecules in a twist, and a smiley face outline. | Tap pixels inside the outline to switch them dark. | Each tapped pixel's rods swing to line up with the voltage, the light behind is blocked, and a dark smiley appears. | Tapping a dark pixel again: the voltage goes off, the rods twist back, and light pours through that pixel again. | Colour filters: make a red pixel | Octopus |
| FP-21 | `BLOCK HEAT!` | Aerogel is a solid sponge of glass threads that is almost all air, so it is the lightest solid there is and it blocks heat very well. | A crayon resting on a sheet above a small flame, and three sheets to choose from: metal, wood and a cloudy, almost invisible block of aerogel. | Slide a sheet between the flame and the crayon until the timer ends. | With the aerogel, the crayon stays cool and unmelted, though the flame is right below. | The metal sheet: heat races through, the crayon melts and drips, and the turtle catches it in a cup. | Aerogel catching comet dust on a spacecraft, without crushing it | Turtle |

---

## Materials chemistry for modern technology

Source: not from a course outline. These are the chemistry topics behind batteries, chips, clean cars, recycling and the air, chosen by their use in real jobs and projects. The ideas come from OpenStax *Chemistry 2e* (Ch. 12 Kinetics, section 12.7 Catalysis; Ch. 17 Electrochemistry, sections 17.5 Batteries and Fuel Cells and 17.6 Corrosion; Ch. 18), the Royal Swedish Academy of Sciences' popular explanations of the lithium-ion (2019) and graphene (2010) prizes, the US Department of Energy, the FAA, the EPA and the WMO. Physics rows on doping, diodes and transistors are pointed to rather than repeated.

### Unit 1: Conductors, chips and new materials
Why it matters: chip makers, MRI engineers and materials scientists choose and design materials by how freely electrons move through them.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Semiconductors and doping: see OC-12 `ZAP!` and UP3-16 `DOPE!` (physics). Diodes, transistors and solar cells: see UP3-17, UP3-18, QP-10 (physics) and EE-37 to EE-39 (engineering). | | | | | | |
| MT-01 | `LEVITATE!` | Cooled below a certain temperature, a superconductor loses all electrical resistance and pushes magnetic fields out, so a magnet floats above it. | A grey ceramic disc, a small magnet train car resting on it, and a flask of liquid nitrogen. | Pour the cold over the disc and keep pouring until the car floats. | The disc frosts over, the car lifts off and hovers, and a push sends it gliding with no friction. | Stopping too early: the disc is cold but not cold enough, and the car clunks back down. | The disc slowly warms: top it up to keep the car floating (as MRI magnets are kept cold) | Penguin |
| MT-02 | `PEEL!` | Peeling layers off graphite (pencil lead) again and again leaves a sheet one atom thick: graphene, the thinnest and strongest material known, which also conducts electricity. | A block of graphite and a roll of sticky tape; a microscope view beside it. | Stick and peel the tape again and again until the microscope shows a single layer. | Each peel thins the flake, until the view shows one honeycomb layer of carbon atoms and a little bulb wired to it lights up. | Ripping the tape off hard: a thick chunk comes away, and you've just made a pencil smudge. | Stretch the sheet: it bends but won't tear | Ant |
| MT-03 | `CHOP SMALL!` | Cut into pieces only a few hundred atoms across (nanoparticles), a material can act differently: gold turns red, because so much of it is surface. | A gold nugget on a chopping board, a magnifier and a church window with an empty red pane. | Mash the chopper until the nugget is dust too fine to see, then pour it into the glass. | As the pieces shrink past a size, the gold glitter turns ruby red, and the red pane fills with colour. | Stopping at coarse flakes: the glass is just sparkly gold, and the octopus squints. | Silver nanoparticles that turn yellow | Octopus |

### Unit 2: Batteries, fuel cells and hydrogen
Why it matters: phones, electric cars, power tools and grid storage run on lithium-ion batteries, and hydrogen made with clean electricity may power trucks, ships and steelworks. Knowing why damaged batteries catch fire keeps homes, planes and workshops safe.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | How a battery pushes electrons, and why it runs down: see APC-30 `LIGHT UP!` and APC-31 `RUN DOWN!`. | | | | | | |
| MT-04 | `RECHARGE!` | Charging a lithium-ion battery pushes lithium ions from one side of the battery to the other, where they tuck between layers of carbon; using it lets them flow back. | A phone at 1%, with a cutaway battery: a stack of carbon layers on one side, metal-oxide layers on the other, and all the lithium ions crowded on the oxide side. A charger plug. | Hold the plug in until the phone reaches full. | The ions stream across and slot between the carbon layers one by one, and the battery bar fills. Unplugged, the phone plays a video and the ions trickle back. | Pulling the plug early: only a few ions moved across, and the phone dies halfway through the video. | An old battery with cracked layers holds fewer ions | Rabbit |
| MT-05 | `ISOLATE!` | A damaged lithium battery can heat itself faster and faster (thermal runaway), and its heat can set off the cells beside it, so a hot cell is moved away and cooled. | A pack of six battery cells in a drone; one is dented, swells and glows red. A metal bin of water sits nearby. | Drag the hot cell out of the pack and drop it into the water bin. | The water cools it, its glow fades, and the five other cells stay calm and blue. | Waiting: the red cell heats its neighbour, which glows red too, and then the next; the cartoon drone puffs smoke as the beaver backs away. The card says: if a battery swells, smokes or gets hot, move away from it and tell an adult or a crew member; never charge a damaged battery. | A cell that only starts to swell (spot it before it heats) | Beaver |
| MT-06 | `SPLIT WATER!` | Electricity can split water into hydrogen and oxygen gas, and twice as much hydrogen comes off as oxygen. | A tank of water with two metal plates, a wind turbine wired to them, and two empty gas balloons, one for each plate. | Hold the turbine spinning until the hydrogen balloon is full. | Bubbles stream off both plates; the hydrogen balloon fills twice as fast as the oxygen one. | Letting the wind drop: the bubbles stop, and the balloons hang half full. | Swap the wires: the balloons fill on the other sides | Duck |
| MT-07 | `POWER THE BUS!` | A fuel cell joins hydrogen and oxygen back into water and makes electricity on the way; its only exhaust is water. | A city bus with a cutaway fuel cell: a hydrogen tank on one side, air on the other, a thin wall in the middle, and an outer wire to the motor. | Drag hydrogen into the cell and connect the outer wire to the motor. | The hydrogen splits; protons slip through the wall, electrons race round the wire and spin the motor, and they meet oxygen on the far side as water that drips from the exhaust. | Leaving the outer wire unplugged: the electrons can't get round, everything stops, and the bus stays at the stop. | Climb a hill: feed hydrogen faster | Fox |

### Unit 3: Catalysts, rust and coatings
Why it matters: catalysts clean car exhaust and make fertiliser, medicines and plastics with less energy; rust costs countries a fortune in repairs, and coatings and sacrificial metals protect bridges, ships, cars and bikes.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | How a catalyst gives an easier path: see HC-25 `LOWER!`. Making ammonia for fertiliser (the Haber process): see HC-26 `MAKE MORE!`. | | | | | | |
| MT-08 | `CLEAN EXHAUST!` | A car's catalytic converter is a hot honeycomb coated with metal catalysts that turns poisonous exhaust gases into less harmful ones. | A car's exhaust pipe puffing brown and grey gas, an open slot in the pipe, and a honeycomb block. The engine gauge reads cold. | Slide the honeycomb into the slot and rev the engine until the gauge warms. | Once it's hot, the gases touch the honeycomb's walls and come out as clear carbon dioxide, nitrogen and water vapour, and the flowers by the road perk up. | Driving off while it's still cold: the catalyst isn't working yet, and brown puffs keep coming out (which is why short cold trips pollute most). | Leaded fuel coats the catalyst and stops it working | Fox |
| MT-09 | `COAT IT!` | Rust needs both water and oxygen to reach the iron, so a complete coat of paint or oil stops it, and a single scratch lets it start. | A new steel bike with a paint can, and a rain cloud rolling in. | Paint every bit of the frame before the rain arrives. | The rain beads off the painted frame, and the bike stays shiny. | Missing a spot: rain soaks the bare spot and orange rust blooms from it and creeps under the paint. | Zinc-coated (galvanised) steel stays safe even where scratched; see OC-11 | Hedgehog |
| — | — | Sacrificial zinc on ships: see OC-11 `SAVE THE SHIP!`. Two different metals touching in salt water: see ME-14 `SEPARATE!` (engineering). | | | | | | |

### Unit 4: Plastics and recycling
Why it matters: packaging, clothing, cars and medical kit are made of plastics, and recycling works only if the different kinds are kept apart and can be remelted.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Plastics as long chains: see MC-15 `LINK!` and OR-20 `PULL!`. Recycling and landfills: see ES-18 `RECYCLE!` (earth and engineering). | | | | | | |
| MT-10 | `SORT PLASTIC!` | Different plastics melt at different temperatures and don't mix, so recyclers sort them by the number in the triangle, and one wrong kind can spoil a batch. | A conveyor of empty bottles and tubs, each with a recycling triangle and a number (1, 2 or 5); three bins with the same numbers. | Flick each item into the bin with its number. | Each bin melts its own plastic into clean pellets, which pop out as a new fleece jacket, a crate and a bucket. | A number-3 item in the number-1 bin: that batch melts into cloudy, brittle lumps that crack, and the turtle sighs. | Labels and caps of a different plastic must come off | Turtle |
| MT-11 | `CROSSLINK!` | Tying plastic chains to each other (cross-linking) makes a plastic that won't melt again, which is strong but can't be remelted to recycle. | A tangle of loose plastic chains, a box of little tie links, and a hot oven where a toy will be baked. | Drag ties between neighbouring chains until the tangle is a net, then slide it into the oven. | The tied net keeps its shape in the heat and comes out as a hard bowling ball. | No ties: the chains slide past each other in the heat, and the toy melts into a puddle. The card says this is why bottles can be remelted and tyres can't. | Just a few ties: a stretchy rubber band | Rabbit |

### Unit 5: Chemistry of the air
Why it matters: environmental scientists, city planners, engineers and doctors deal with the ozone layer, smog, acid rain and carbon dioxide; the ozone repair shows that a worldwide fix can work.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | How CFCs break the ozone layer: see ES-04 `SHIELD!`. Smog: see ES-20 `CLEAR THE AIR!`. Acid rain: see ES-22 `SCRUB!` and APC-24 `PROTECT!`. Gases that trap heat: see ES-01 `KEEP WARM!`. | | | | | | |
| MT-12 | `HEAL THE SKY!` | When the world stopped releasing ozone-destroying gases, the ozone layer began to repair itself, slowly, over decades. | A globe with a hole in its ozone layer over the South Pole; old spray cans and fridges leak grey CFC puffs around the world. A year counter runs fast. | Tap every leaking can and fridge to swap it for a safe one before the year counter runs out. | The grey puffs stop, and year by year the ozone hole shrinks and closes up over the South Pole, and the penguin takes off its sun hat. | Missing a few leaks: the hole keeps opening again every spring. | Leaks reappear in new places, which must also be found | Penguin |
| MT-13 | `STORE CARBON!` | Carbon capture grabs carbon dioxide from a chimney before it reaches the air and stores it deep underground in rock. | A factory chimney puffing carbon dioxide dots, a capture sponge on a hook, and a pipe leading down to a layer of porous rock under a cap of solid rock. | Hang the sponge in the chimney until it's full, then drag it down the pipe into the deep rock. | The sponge soaks up the dots, the chimney runs clear, and the dots settle into the rock's tiny holes under the cap. | Squeezing the full sponge out at the surface: the dots float straight back up into the sky. | A leaky cap rock that must be avoided | Beaver |
| MT-14 | `DESIGN OUT!` | Green chemistry designs a process so it makes no hazardous waste, which beats cleaning the waste up afterwards. | A factory making a product; each batch also spits out a barrel of toxic sludge. A clean-up truck and a reusable catalyst wheel sit outside. | Swap the factory's use-once chemical for the reusable catalyst wheel. | The product keeps coming, the barrels stop, and the same wheel keeps turning batch after batch. | Calling the clean-up truck instead: the truck drives off with barrels, but new barrels pile up faster than it can carry them. | Swap an oil-based starting material for one made from plant waste | Owl |

---

## Frontiers of biology and medicine

Source: not from a course outline. These are the biology and medicine topics in the news and in labs today, chosen by their use in health care, research and everyday decisions. The ideas come from OpenStax *Biology 2e* (Ch. 17 Biotechnology and Genomics, Ch. 21 Viruses, Ch. 22 Prokaryotes, Ch. 35 The Nervous System, Ch. 42 The Immune System), CDC pages on mRNA vaccines and antimicrobial resistance, and the Royal Swedish Academy of Sciences' popular explanation of the 2024 chemistry prize for protein structure. Where the evidence is still debated or emerging, the card says so. These games show how the body and treatments behave; they are not medical advice, and each medical card says so.

### Unit 1: The immune system in action
Why it matters: vaccines, transplants, allergy treatment and many new cancer drugs all work by steering the immune system; doctors, nurses and public-health workers use these ideas every day.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | White blood cells swallowing germs: see AN-15 `GOBBLE!`. Vaccines and memory cells: see AN-16 `REMEMBER!`. Blood-type antibodies: see AN-14, HB-16. | | | | | | |
| FB-01 | `LOCK ON!` | Antibodies are Y-shaped proteins whose tips fit one germ's shape; once a fitting antibody is found, the body makes huge numbers of it. | A virus with spiky star-shaped knobs drifting through blood, and a tray of antibodies with differently shaped tips. | Try antibodies on the virus until one clicks into place, then mash to copy it. | The fitting antibody clicks onto a knob, and copies pour out, coat every virus and tag them; a white blood cell swallows the tagged clump. | A tip that doesn't fit: it bounces off and the virus slips past. | The virus changes its knob shape halfway through | Hedgehog |
| FB-02 | `PATROL!` | Killer T cells check the flags on the body's own cells and destroy only the ones showing signs of a virus inside. | A street of body cells; each holds up a flag on its surface. Some flags show a tiny virus picture. | Steer the T cell along the street and tap each cell flying a virus flag. | Each infected cell the T cell touches crumples up before its viruses can get out, and the healthy ones wave. | Tapping a healthy cell: the T cell checks its flag, finds nothing wrong and moves on, puzzled. The card says that when T cells do attack healthy cells, it causes autoimmune disease. | Cells that hide their flags | Fox |
| FB-03 | `TRANSLATE!` | An mRNA vaccine is a short recipe that the cell's protein machine reads to make a harmless piece of the virus; the cell shows that piece to train the immune system and then breaks the recipe down. It never enters the nucleus or changes DNA. | A cell with a ribosome (a little machine) in it and a locked nucleus in the middle. An mRNA ribbon floats in. | Feed the ribbon into the ribosome. | The ribosome reads it and makes spike pieces, which pop up on the cell's surface; immune cells rush up and learn their shape, and the ribbon crumbles away. | Pushing the ribbon at the nucleus: its door stays shut and the ribbon bounces off, because mRNA can't get into the nucleus where the DNA is. | A booster: a second ribbon makes the memory response quicker | Owl |

### Unit 2: Reading, editing and designing genes and proteins
Why it matters: gene editing now treats some inherited blood diseases, AI predictions of protein shapes speed up drug design, and biotech companies design new proteins for vaccines and enzymes.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | CRISPR finding and cutting a matching sequence: see APB-24 `CUT!`. Copying DNA by PCR: see APB-23 `CYCLE!`. Proteins folding: see APB-03 `FOLD!`. | | | | | | |
| FB-04 | `FIX THE GENE!` | Gene editing can repair one misspelled letter: a guide carries the cutter to the spot, and the cell mends the cut using a correct copy supplied with it. | A long DNA strand of letters with one letter flashing red; red blood cells beside it are sickle-shaped. A cutter with a guide strip and a correct patch. | Slide the guide along until it matches the spot, cut, then drop in the correct patch. | The cut closes with the right letter, and the red blood cells round out and flow smoothly. | Cutting at a spot that only nearly matches: a healthy gene gets snipped, and a different cell wilts. The card says avoiding such wrong cuts is the main safety challenge. | Edit cells taken out of the body, then return them | Frog |
| FB-05 | `RESHAPE!` | A protein's shape is set by the order of its building blocks, so scientists can design new proteins by choosing that order; AI tools such as AlphaFold now predict a protein's shape from its sequence. | A floppy chain of beads, oily (yellow) and watery (blue), and a virus knob that a protein should grip. A computer screen shows the shape the current chain will fold into. | Swap beads in the chain until the predicted shape fits the virus knob, then let it fold. | The chain folds with its oily beads tucked inside, the shape grips the knob, and the virus can't latch on to a cell. | Leaving oily beads on the outside: the chain clumps with other chains into a useless lump of goo. | Design a protein that grips two knobs at once | Octopus |

### Unit 3: Microbes, resistance and the microbiome
Why it matters: drug-resistant infections are a growing worldwide problem; hospitals, farms and families slow them by preventing infections. The gut's microbes are an active research field in medicine and nutrition.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Antibiotics favouring resistant bacteria: see HB-24 `TREAT!`. Viruses versus bacteria, and why antibiotics do nothing against viruses: see OB-01 `INFECT!`. Bacteria multiplying: see HB-01. | | | | | | |
| FB-06 | `WASH HANDS!` | Washing with soap for long enough lifts germs, including resistant ones, off the hands, which stops them passing to the next person. | Two paws covered in glowing germs at a sink, soap, and a door handle the next animal will touch. | Mash to scrub with soap until the song bar fills, then rinse. | The lather lifts the glowing germs off, they swirl down the drain, and the door handle stays clean for the next rabbit. | A quick splash without soap: most germs stay put, and they hop onto the door handle and wave at the next rabbit. | Germs hiding between the fingers and under the nails | Rabbit |
| FB-07 | `REGROW!` | The gut is home to trillions of helpful microbes; a course of antibiotics can thin them out, and a varied, fibre-rich diet helps a mixed community grow back. Much about the microbiome is still being researched. | A gut drawn as a garden of many different microbe "flowers", mostly bare after a course of antibiotics, with weedy microbes creeping in. A basket of foods. | Drag beans, vegetables and grains into the garden until it is full and varied again. | Many kinds of microbe sprout, and the weedy ones are crowded out. | Feeding only sweets: one weedy kind spreads across the whole garden. The card says many claims about probiotic products are not yet proven. | A second course of antibiotics, after which the garden must regrow again | Bird |

### Unit 4: Cancer, its treatments and stem cells
Why it matters: doctors, nurses and drug researchers build today's cancer treatments on knowing why cancer cells grow and how they hide from the immune system. Stem cells are used in bone-marrow transplants and are being tested for repairing tissues.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | Checkpoints that stop damaged cells from dividing: see APB-13 `CHECK!`. Cells specialising by switching genes on: see AN-24 `SPECIALIZE!`. | | | | | | |
| FB-08 | `JAM THE SWITCH!` | Cancer cells keep dividing because a "grow" switch is stuck on and they ignore stop signals; a targeted drug fits that one switch and jams it. | A crowd of cells; a few are dividing wildly, each with a glowing switch stuck in the "on" position. Drug pieces shaped to fit that switch. | Flick drug pieces into the crowd until no cell is still dividing. | Each piece slots into a stuck switch, and that cell stops dividing; normal cells, which have no stuck switch, carry on. | Flicking at normal cells: the drug finds nothing to fit and bounces off, while the stuck cells keep piling up. | Some cancer cells change their switch's shape, so a second drug is needed | Turtle |
| FB-09 | `UNMASK!` | Some cancer cells hide from the immune system behind a "don't attack me" signal; immunotherapy drugs block that signal so T cells can attack. | A lump of cancer cells, each wearing a friendly mask; T cells patrol past without stopping. | Swipe the masks off the cancer cells. | The T cells spot the real faces and attack, and the lump shrinks. | Swiping masks off healthy cells too: the T cells attack those as well, and the card says this is why these drugs can have side effects. | Masks that grow back | Fox |
| FB-10 | `REPROGRAM!` | Stem cells can turn into many cell types, and scientists can reset an ordinary adult cell into a stem cell by switching on a few key genes. | A flat skin cell, four glowing gene switches, and a dish where a heart cell is needed. | Flip all four switches in the skin cell, then nudge it into the heart dish. | The cell rounds up into a stem cell, then grows into heart muscle in the dish and starts to beat. | Flipping only three: the cell stays skin and lies flat in the heart dish. | Make a nerve cell from the same stem cell | Owl |

### Unit 5: The brain, sleep and ageing
Why it matters: teachers, coaches, doctors and anyone who studies use what is known about how memories form and why sleep matters; ageing research is a fast-growing field, but many popular claims about it are not yet supported.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | — | A nerve signal travelling as a wave of opening gates: see AN-08 `FIRE!` and AN-09 `INSULATE!`. Reflexes: see MB-04. | | | | | | |
| FB-11 | `CROSS THE GAP!` | Nerve cells don't touch; a signal crosses the tiny gap between them (a synapse) as a puff of chemical messengers, and the next cell fires only if enough arrive. | The end of one nerve cell, a narrow gap, and the start of the next cell, which leads to a paw that should wave. | Tap the end of the first cell to release messenger bubbles until the next cell fires. | The bubbles drift across, dock in the next cell's receptors, and when enough have docked it fires and the paw waves. | Tapping only once: a few messengers dock, the next cell flickers but doesn't fire, and the paw stays still. | A drug that blocks some receptors | Frog |
| FB-12 | `REHEARSE!` | A connection between brain cells that is used again and again grows stronger, which is how practice builds a memory; an unused one fades. | Two nerve cells joined by a thin, faint link, and a piano with a short tune to play. | Trace the path from one cell to the other again and again. | With each trace the link thickens and glows, and the tune plays smoother and faster. | Tracing once and waiting: the link fades back to a faint thread, and the tune comes out jumbled. | Spaced practice: traces with breaks between them make a link that lasts longer | Bird |
| FB-13 | `SLEEP ON IT!` | During sleep the brain replays and stores the day's learning; missing sleep makes memory and reactions worse. | A fox in bed at night after learning a dance; its dream bubble replays the moves. A phone buzzes and a light flickers. | Swipe away every buzz and light so that the fox sleeps through until morning. | The dream bubble replays the dance all night, and in the morning the fox dances it perfectly. | Letting the phone wake it: the dream bubble pops, and in the morning the fox trips over its own feet. The card says scientists are still working out exactly how sleep stores memories. | A second night strengthens it more | Fox |
| FB-14 | `DIVIDE AGAIN!` | Each time most cells divide, the protective caps on the ends of their chromosomes (telomeres) get shorter, and when the caps are too short the cell stops dividing. This is one of several causes of ageing that scientists study. | A cell whose chromosomes have bright caps on their ends, and a wound in the skin that needs new cells. | Tap the cell to divide it again and again until the wound is filled. | Each division makes a new cell and the caps shrink a little, and the wound fills in before the caps run out. | Dividing a cell whose caps are almost gone: it refuses to split and sits there grey and tired (senescent). The card says that how much telomeres matter to ageing is still debated, and that anti-ageing products claiming to lengthen them are unproven. | Stem cells with an enzyme that rebuilds the caps | Hedgehog |

### Unit 6: Synthetic biology
Why it matters: insulin, many vaccines and the enzymes in washing powder are made by engineered microbes, and synthetic biologists build microbes that sense pollution or make new materials.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| FB-15 | `BREW INSULIN!` | Putting a human gene into bacteria or yeast makes them produce the human protein, which is how the insulin used to treat diabetes is made today. | A human insulin gene, a small ring of bacterial DNA (a plasmid), a tank of bacteria and an empty medicine bottle. | Snap the gene into the ring, slip the ring into a bacterium, and let the tank grow. | The bacterium copies itself many times, every copy makes insulin, and the bottle fills. | Snapping the gene in backwards: the bacteria grow, but they read it in the wrong direction and make nothing, and the bottle stays empty. | Yeast that also needs the protein folded correctly | Beaver |
| FB-16 | `GLOW ON CUE!` | Synthetic biologists wire genes together like circuits, for example joining a sensor gene to a glow gene so that a microbe lights up only when a pollutant is present. | A dish of microbes, a sensor gene, a glow gene and a connector; two water samples, one clean and one with a pollutant. | Connect the sensor gene to the glow gene, then drop the microbes into each sample. | The microbes in the polluted sample light up; those in the clean water stay dark. | Wiring the glow gene with no sensor: the microbes glow in both samples, so the test tells you nothing. | Make them glow a different colour for a second pollutant | Duck |

---

## First ten games to build

These ten are the ones this file's author judges most fun and most educational: each has a satisfying action, a vivid fail, and an idea that matters well beyond school.

| Rank | Game | Why first |
|---|---|---|
| 1 | `HUNT!` (MB-16) | The player is the predator, and natural selection happens because of what they did. It needs no words at all. |
| 2 | `BALANCE!` (HC-12) | The owner's own example: atoms as balls on two scale pans. It turns the most feared high school skill into a physical puzzle. |
| 3 | `TREAT!` (HB-24) | Antibiotic resistance, a real public-health problem, shown as armour that was already there. |
| 4 | `HERD!` (APC-27) | Entropy, an abstract idea, becomes a funny, hopeless attempt to herd particles back. |
| 5 | `SCREEN!` (MED-07) | Why a positive test can be wrong, shown with a crowd, without a single number. |
| 6 | `CYCLE!` (APB-23) | PCR as a rhythm game; each beat visibly doubles the DNA. |
| 7 | `ASSEMBLE!` (HC-13) | Limiting reactants as a sandwich line, with leftovers anyone recognises. |
| 8 | `REMEMBER!` (AN-16) | How vaccines work: the "wanted poster" makes the second attack fail fast. |
| 9 | `MELT IT!` (MC-08) | The thermometer stops while ice melts, a surprise that players remember. |
| 10 | `HURRY!` (APC-17) | The slowest step sets the pace, shown as a bucket brigade; the idea also applies to queues, factories and code. |

**Also worth building early (from the advanced courses).**
- `LID ON!` (FP-02): the one kitchen-fire rule everyone should know (lid on, heat off, never water), with a fail that shows why.
- `SMOTHER!` (FP-01): the fire triangle as three sides you can break, in any of three ways.
- `ISOLATE!` (MT-05): thermal runaway spreading cell to cell, and the safe response, for a world full of lithium batteries.
- `TRANSLATE!` (FB-03): how an mRNA vaccine works, with a fail that shows the mRNA can't reach the DNA.
- `IONIZE!` (FP-10): plasma as the state you reach by heating a gas until its electrons tear off.

---

## Self-review

Every row was checked against the owner's bar: the player does the key step with their own hands; the goal is obvious from the command and the first frame; there are no questions, calculations or formulas during play; success makes the concept happen on screen; and the fail is funny and shows the concept.

**Whole-file rewrites.** The file was redrafted three times as the owner's rules changed during the session:
- From calculation problems with working (the Q.E.D.! style) to the concrete thing first ("count the atoms" instead of "multiply the subscripts").
- From that to concepts only: every row that only practised a calculation was removed or turned into its concept. Removed as calculations: empirical formulas, molar-mass and gram-to-mole conversions, ICE tables, Ksp and Henderson–Hasselbalch arithmetic, Hess's-law and Faraday's-law sums, Nernst and Gibbs arithmetic, Hardy–Weinberg arithmetic, mark-recapture arithmetic, dose-by-weight, drip-rate and dilution arithmetic, BMI, and sensitivity, specificity and predictive-value arithmetic. Their concepts are kept (for example MED-02 `SIZE UP!` for dose by weight, MED-07 `SCREEN!` for predictive value, HC-11 `WEIGH!` for the mole).
- From that to the final microgame format: one shouted verb, one 3 to 6 second action, a goal achieved by acting, and a funny fail. All "predict, then watch" and "tap the right answer" rows were turned into goals (for example the sink-or-float prediction became MC-05 `RAFT!`: push something into the pond for the duck to ride).

**Rows rewritten in the final review, and why.**
- HC-21 `TOAST!`: the action was "drag the penguin onto the pan that warms fastest", which is answering. It now asks the player to warm the penguin's feet, moving between pans as needed.
- AN-01 `PAT LEFT!`: the sore paw glowed, so the player could succeed without the concept. Now the chart says "LEFT PAW" and the player must work out which paw that is from the patient's side.
- HC-13 `ASSEMBLE!`: the fail described two cases at once. It now gives the counts (4 hydrogen and 3 oxygen molecules) so that the twist (the bigger pile runs out first) is visible.
- OR-21 `CLOSE THE RING!`: its level 2 asked the player to predict; it now adds a side group to the molecule instead.
- Commands renamed so that no two games share a verb and none is longer than 15 characters: OC-05 `CUSHION!`, OR-13 `BREATHE OUT!`, LB-10 `SPIN UP!`, OC-09 `UNCAP!`, OC-14 `TINT!`, OR-04 `TOSS!`, AN-11 `POST!`, APB-21 `UNBLOCK!`.

**Advanced courses (FP, MT, FB), added in the last round.** Written to the final format under time pressure and not yet reviewed a second time. Rows to check first: FP-09 `SWEEP UP!` (its fail shows a dust flash; the art must stay cartoon and the card concept-only), FP-02 `LID ON!` (same for the water-on-oil flare), FP-17 `CREEP UP!` and MT-03 `CHOP SMALL!` (the effects are real but hard to draw clearly), FB-13 `SLEEP ON IT!` and FB-14 `DIVIDE AGAIN!` (the science is still debated, so the cards must say so), and MT-10 `SORT PLASTIC!` (players read the recycling numbers, which are symbols, not words). Fire, plasma and cold-liquid rows follow the course's safety rule: no recipes, quantities, mixtures or procedures, and fireworks only as colour (OC-02).

**Rows that remain the weakest fits**, kept because their topics matter: OR-14 `REPAIR!` (synthesis planning is open-ended; marked **[WEAK FIT]**), MC-16 `UNRAVEL!` (the "impact on society" half of its standard is left to the card), HC-11 `WEIGH!` (the game shows that atoms weigh different amounts; the card has to carry the idea of the mole as a counting number), and MED-10 `LINE UP!` (weight-for-height is a sensitive topic, so its art should use animals and avoid judging bodies).

---

## Sources

**College Board (fetched in full)**
- AP Biology Course at a Glance: https://apcentral.collegeboard.org/media/pdf/ap-biology-course-at-a-glance.pdf
- AP Chemistry Course at a Glance: https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-at-a-glance.pdf

**OpenStax (chapter lists read from OpenStax's own files)**
- *Chemistry 2e*: https://raw.githubusercontent.com/openstax/osbooks-chemistry-bundle/main/collections/chemistry-2e.collection.xml
- *Biology 2e*: https://raw.githubusercontent.com/openstax/osbooks-biology-bundle/main/collections/biology-2e.collection.xml
- *Organic Chemistry*: https://raw.githubusercontent.com/openstax/osbooks-organic-chemistry/main/collections/organic-chemistry.collection.xml
- *Anatomy and Physiology 2e* (preface page with the table of contents): https://openstax.org/books/anatomy-and-physiology-2e/pages/preface

**NGSS (fetched)**
- MS-PS1 Matter and its Interactions: https://www.nextgenscience.org/dci-arrangement/ms-ps1-matter-and-its-interactions
- 5-PS1 Matter and its Interactions: https://www.nextgenscience.org/dci-arrangement/5-ps1-matter-and-its-interactions

**Khan Academy: course list and launch posts (fetched)**
- KA Blog, "Everything You Need for Science Class—Free on Khan Academy" (2025-08-14; lists ms-biology, ms-chemistry, hs-bio, hs-chemistry, ap-biology, ap-chemistry-beta): https://blog.khanacademy.org/?p=19935
- KA Blog, "Explore Khan Academy's New NGSS-Aligned Middle School Chemistry Course" (2025-08-20): https://blog.khanacademy.org/explore-khan-academys-new-ngss-aligned-middle-school-chemistry-course/
- KA Help Center, "High School Chemistry" (2021 to 2023 requests for the course): https://support.khanacademy.org/hc/en-us/community/posts/4405381284493-High-School-Chemistry

**Khan Academy: unit titles seen in search results (not fetched; KA pages need JavaScript)**
- Middle school chemistry: "Classifying matter" https://www.khanacademy.org/science/ms-chemistry/xc370bc422b7f75fc:classifying-matter/xc370bc422b7f75fc:intro-to-ms-chemistry ; density lesson https://www.khanacademy.org/science/ms-chemistry/xc370bc422b7f75fc:physical-properties-of-matter/xc370bc422b7f75fc:density/a/density ; chemical changes https://www.khanacademy.org/science/ms-chemistry/xc370bc422b7f75fc:chemical-changes/xc370bc422b7f75fc:chemical-reactions/v/chemical-reactions
- High school chemistry: "Chemical reactions: Unit test" https://www.khanacademy.org/science/hs-chemistry/x2613d8165d88df5e:chemical-reactions/x2613d8165d88df5e:types-of-chemical-reactions/test/x2613d8165d88df5e:chemical-reactions-unit-test ; "Chemical bonding" https://www.khanacademy.org/science/hs-chemistry/x2613d8165d88df5e:chemical-bonding/x2613d8165d88df5e:metallic-bonds ; "Nuclear chemistry: Quiz 1" https://www.khanacademy.org/science/hs-chemistry/x2613d8165d88df5e:nuclear-chemistry-hs/x2613d8165d88df5e:radioactive-decay/quiz/x2613d8165d88df5e:nuclear-chemistry-hs-quiz-1 ; "Solutions, acids, and bases" https://www.khanacademy.org/science/hs-chemistry/x2613d8165d88df5e:solutions-acids-and-bases ; "Reaction rates and equilibrium: Quiz 1" https://en.khanacademy.org/science/hs-chemistry/x2613d8165d88df5e:reaction-rates-and-equilibrium/quiz/x2613d8165d88df5e:reaction-rates-and-equilibrium-quiz-1 ; "Stoichiometry and the mole" https://www.khanacademy.org/science/hs-chemistry/x2613d8165d88df5e:stoichiometry-and-the-mole/x2613d8165d88df5e:mole-calculations/v/empirical-molecular-and-structural-formulas ; TX version "Atomic structure: Unit test" https://www.khanacademy.org/science/hs-chemistry-tx/x1ff71253c4e4a747:atomic-structure-unit/test/x1ff71253c4e4a747:atomic-structure-unit-unit-test
- AP Chemistry: "Atomic structure and properties: Unit test" https://en.khanacademy.org/science/ap-chemistry-beta/x2eef969c74e0d802:atomic-structure-and-properties/x2eef969c74e0d802:periodic-trends/test/x2eef969c74e0d802:atomic-structure-and-properties-unit-test ; "Unit 3: Intermolecular forces and properties" https://www.khanacademy.org/science/ap-chemistry-beta/x2eef969c74e0d802:intermolecular-forces-and-properties ; thermodynamics https://www.khanacademy.org/science/ap-chemistry-beta/x2eef969c74e0d802:thermodynamics/x2eef969c74e0d802:enthalpy-of-formation/e/enthalpy-of-formation ; applications of thermodynamics https://www.khanacademy.org/science/ap-chemistry-beta/x2eef969c74e0d802:applications-of-thermodynamics/x2eef969c74e0d802:entropy/e/entropy
- Middle school biology: "Cells and organisms: Quiz 1" https://www.khanacademy.org/science/ms-biology/x0c5bb03129646fd6:cells-and-organisms/quiz/x0c5bb03129646fd6:cells-and-organisms-quiz-1 ; "Inheritance and variation" https://en.khanacademy.org/science/ms-biology/x0c5bb03129646fd6:inheritance-and-variation/x0c5bb03129646fd6:genes-proteins-and-traits ; "Interactions in ecosystems" https://www.khanacademy.org/science/ms-biology/x0c5bb03129646fd6:interactions-in-ecosystems ; matter and energy in organisms https://en.khanacademy.org/science/ms-biology/x0c5bb03129646fd6:matter-and-energy-in-organisms/x0c5bb03129646fd6:food-and-energy-in-organisms/v/cellular-respiration-ms
- High school biology: "Mechanisms of evolution: Unit test" https://www.khanacademy.org/science/hs-bio/x230b3ff252126bb6:mechanisms-of-evolution-hs/x230b3ff252126bb6:speciation-and-other-patterns-of-evolution/test/x230b3ff252126bb6:mechanisms-of-evolution-hs-unit-test ; "Inheritance and variation of traits" https://en.khanacademy.org/science/hs-bio/x230b3ff252126bb6:inheritance-and-variation-of-traits/x230b3ff252126bb6:complex-patterns-of-inheritance ; energy and matter https://www.khanacademy.org/science/hs-bio/x230b3ff252126bb6:energy-and-matter-in-biological-systems/x230b3ff252126bb6:biogeochemical-cycles/a/nitrogen-cycle ; from cells to organisms https://www.khanacademy.org/science/hs-bio/x230b3ff252126bb6:from-cells-to-organisms/x230b3ff252126bb6:the-cellular-basis-of-life/a/the-cellular-basis-of-life ; ecology and natural systems https://en.khanacademy.org/science/hs-bio/x230b3ff252126bb6:ecology-and-natural-systems/x230b3ff252126bb6:organization-of-natural-systems/v/welcome-to-high-school-biology

**Advanced chemistry: fire, plasma and extreme matter (fetched in this session unless marked)**
- CCOHS, "Fire Extinguishers - Portable" (fire classes A, B, C, D, K; fire tetrahedron; no water on electrical or cooking-oil fires): https://www.ccohs.ca/oshanswers/safety_haz/fire_extinguishers.html
- US Fire Administration, "Cooking Fire Safety" (archived; slide a lid on a pan fire, turn off the burner, keep an oven door shut): https://webarchive.library.unt.edu/web/20120913075511/http://www.usfa.fema.gov/citizens/home_fire_prev/cooking.shtm
- OSHA, Safety and Health Information Bulletin "Combustible Dust in Industry: Preventing and Mitigating the Effects of Fire and Explosions" (SHIB 07-31-2005, updated 2014; fire triangle and dust explosion pentagon): https://osha.gov/publications/shib073105
- CPSC, "Carbon Monoxide Questions and Answers" (for the CE-06 cross-reference; not fetched): https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Carbon-Monoxide-Information-Center/Carbon-Monoxide-Questions-and-Answers
- UCAR Center for Science Education, "Plasma" (electrons stripped from atoms; lightning, neon signs, fluorescent lights, auroras, the Sun): https://scied.ucar.edu/plasma
- ITER, "How does it work?" (tokamak: plasma confined by strong magnetic fields, about 150 million °C): https://www.iter.org/mach/tokamak
- University of Michigan plasma group, "Computer chips" (plasma etching; not fetched): https://cpseg.eecs.umich.edu/pub/intro/computer-chips.pdf
- Scientific American, "How is caffeine removed to produce decaffeinated coffee?" (supercritical carbon dioxide method): https://www.scientificamerican.com/article/how-is-caffeine-removed-t/
- NASA JPL, "Guinness Records Names JPL's Aerogel World's Lightest Solid" (2002-05-07; 99.8 percent air, insulation, Stardust): https://www.jpl.nasa.gov/news/guinness-records-names-jpls-aerogel-worlds-lightest-solid/
- OpenStax *Chemistry 2e*, Ch. 10 Liquids and Solids (phase diagrams and supercritical fluids; crystalline and amorphous solids; chapter list from the book file above). Superfluid helium, liquid nitrogen and metallic glass rows rest on textbook physics and chemistry and were not checked against a fetched page in this session.

**Materials chemistry for modern technology (fetched in this session unless marked)**
- Royal Swedish Academy of Sciences, popular information for the 2019 chemistry prize (lithium ions shuttling between the electrodes): https://www.kva.se/app/uploads/2019/10/popkeen19.pdf
- FAA, SAFO 25002 "Managing the Risks of Lithium Batteries Carried by Passengers and Crewmembers" (2025-08-25; thermal runaway; cooling with water): https://www.aviation.govt.nz/assets/aircraft/airworthiness-directives/other-authorities/SAFO25002.pdf
- US Department of Energy, Hydrogen and Fuel Cell Technologies Office, "Fuel Cells" (archived): https://webarchive.library.unt.edu/web/20170122225252/https://energy.gov/eere/fuelcells/fuel-cells
- Erisman et al., "How a century of ammonia synthesis changed the world", *Nature Geoscience* (2008) (for the HC-26 cross-reference; not fetched): https://www.nature.com/articles/ngeo325
- Nobel Prize in Physics 2010, popular information, "Graphene – the perfect atomic lattice": https://www.nobelprize.org/prizes/physics/2010/popular-information/
- EPA, "Basics of Green Chemistry" (snapshot of 2025-01-19): https://19january2025snapshot.epa.gov/greenchemistry/basics-green-chemistry
- WMO, "Ozone layer recovery is on track, helping avoid global warming by 0.5°C" (2023-01-09; nearly 99% of banned substances phased out; recovery around 2040, 2045 in the Arctic and 2066 over Antarctica): https://wmo.int/media/news/ozone-layer-recovery-track-helping-avoid-global-warming-05degc
- OpenStax *Chemistry 2e*, section 12.7 Catalysis and sections 17.5 Batteries and Fuel Cells and 17.6 Corrosion (chapter list from the book file above). The superconductor, nanoparticle, catalytic converter, recycling-code and carbon-capture rows rest on textbook material and were not checked against a fetched page in this session.

**Frontiers of biology and medicine (fetched in this session unless marked)**
- CDC, "COVID-19 Vaccine Basics" (mRNA instructs cells to make a harmless spike piece, does not enter the nucleus, is broken down): https://www.cdc.gov/covid/vaccines/how-they-work.html
- CDC, "Antimicrobial Resistance: Causes and How It Spreads": https://www.cdc.gov/antimicrobial-resistance/causes/index.html
- Nobel Prize in Chemistry 2024, popular information (AlphaFold2 predicts structures from sequence for almost all 200 million known proteins; Baker's designed proteins): https://www.nobelprize.org/prizes/chemistry/2024/popular-information/
- OpenStax *Biology 2e*, Ch. 17 Biotechnology and Genomics, Ch. 21 Viruses, Ch. 22 Prokaryotes, Ch. 35 The Nervous System, Ch. 42 The Immune System (chapter list from the book file above). The gene-editing therapy, microbiome, cancer therapy, stem-cell reprogramming, sleep, telomere and synthetic-biology rows rest on these chapters and general sources, not on pages fetched in this session; their cards flag the points that are still debated.

**Third-party listings of KA units (fetched)**
- s4me.info, "Khan Academy Biology Courses and Content" (hs-bio and ap-biology unit names and URLs): https://www.s4me.info/threads/khan-academy-biology-courses-and-content.44071
- Classtime, KA "High school biology" (older /science/hs-biology course, 9 units): https://www.classtime.com/curriculum/c/khan-academy-khan-academy-(english---us-curriculum)-science--engineering-high-school-biology/5552
