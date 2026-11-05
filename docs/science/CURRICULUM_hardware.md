# Heurēka! hardware microgames: robots and gadgets, electronics you can build, making things, robotics, shipping hardware

Compiled 2026-11-05. This file maps practical hardware and robotics to WarioWare-style microgames for Heurēka!. The owner asked for "real-world robotics more substantively, and practical hardware like Arduino-like things, 3D printing", built by thinking about what startups use and working back to what a newcomer needs first. It follows the final microgame format (one shouted verb, one action of 3 to 6 seconds, the idea happening on screen, a funny fail) and the layout of CURRICULUM_business.md.

## How to read this file

- **A microgame is a moment, not a question.** The game shouts one verb ("BLINK!", "SPIN LIDAR!", "POP OUT!"). The player does one action they can read in under a second (tap, mash, hold, swipe, drag, tilt, stop at the right moment). Success makes the idea happen on screen, and the idea is the reason the action works: the motor spins hard only once the motor driver sits between the weak pin and the motor. Failure is funny and shows the same idea from the other side. The card shown afterwards says the idea in plain words and names the real term (for example "H-bridge" or "draft angle").
- **No questions, no calculations, no formulas during play.** The goal is obvious from the command and the first frame. Amounts appear only as things the player can see: a fuller battery, a taller coin stack, a thicker wall. During play the player reads at most three words.
- **Order follows usefulness for someone building a real product.** The method was to list what hardware and robotics startups use day to day (see "What startups use" below), then work back to the ideas a newcomer needs first. Courses run from first ideas to shipping, and inside each course the units and rows run from most used to least used.
- **"Why it matters"** under each unit heading says where people use the unit's ideas in real work. Each unit names its source.
- **Columns** (one row per microgame):
  - **ID**: a stable reference (GE = elementary robots and gadgets, EB = electronics you can build, MK = making things, RO = robotics, SH = shipping hardware).
  - **Command**: a verb the player does, one to three words, in capitals, 15 characters or fewer, ending in "!". Every command is unique across all files in docs/science/ and the math app's docs/CURRICULUM.md.
  - **Concept**: the one plain sentence the player comes to see.
  - **Scene**: what is on screen in the first second.
  - **Action**: the one thing the player does.
  - **What happens**: success, with the idea made visible.
  - **Funny fail**: the common wrong move, what it looks like, and what it shows.
  - **Level 2**: the same action made harder, or one new twist. Never a calculation.
  - **Host**: the animal that acts it out (frog, ant, penguin, duck, turtle, octopus, owl, fox, rabbit, beaver, hedgehog, bird).
- **The clarity bar.** A young child who has never seen a circuit board should be able to follow what happens on screen and know what to do, even in the SLAM and injection-moulding games.
- **Recurring pictures**, so a player who learns one game can read the next:
  - **The robot loop** is three glowing icons on every robot's chest: an eye (sense), a brain (think) and a wheel (act). An arrow runs from the wheel back to the eye.
  - **The brain board** is the microcontroller: a small blue board with a row of pin holes along each edge. A pin that is switched on glows.
  - **Flowing dots** are electric current, as in the electrical-engineering games (EE-01 onwards). More dots means more current; red-hot dots mean too much.
  - **The ghost robot** is where the robot thinks it is: a see-through copy that drifts away from the real robot when its guess goes wrong.
  - **The coin stack** is cost, as in the business games: a taller stack costs more.
- **[TRIMMED]** marks a topic that matters less for a first product; it keeps one short game.
- **[WEAK FIT]** marks a topic that fits no action well; the row still gives the best playable idea.
- **"See X"** means the idea is already taught by a row in another file (CURRICULUM_earth_eng.md, CURRICULUM_physics.md, CURRICULUM_cs.md or CURRICULUM_business.md). The earlier game is reused instead of a new one being added. Those rows have "—" in the ID cell and are not counted.

## What startups use, and how this file works back from it

Before writing any games, this file listed the tools and ideas that hardware and robotics companies use every week. Sources are the YC blog post "Advice for Early-Stage Hardware Startups" (Iseman and Chang, 2015), Instrumental's EVT/DVT/PVT whitepaper, the Modern Robotics textbook (Lynch and Park), the π0 paper from Physical Intelligence, published design guides for 3D printing and injection moulding, and robotics job postings that ask for ROS 2, Gazebo or Isaac Sim, and SLAM (all listed under Sources).

| Area | What teams use | Where it lands |
|---|---|---|
| The brain | Microcontrollers (Arduino, ESP32, Raspberry Pi Pico) for one job done instantly on little power; single-board computers (Raspberry Pi, NVIDIA Jetson) for cameras, maps and learned models | EB Unit 1 |
| Sensing | IMUs (accelerometer and gyroscope), wheel encoders, ultrasonic rangers, lidar, depth cameras, load cells | GE Unit 3, EB Unit 2, RO Units 4–5 |
| Moving | DC motors with motor drivers and H-bridges, stepper motors, hobby servos, gearboxes | GE Unit 2, EB Unit 3 |
| Power | Lithium (LiPo) batteries, voltage regulators, current limits, shared ground | EB Unit 4 |
| Wiring and talking | Breadboards, soldering, UART, I2C, SPI, CAN, USB, Wi-Fi and Bluetooth Low Energy | EB Unit 5 |
| Making parts | CAD (Fusion, Onshape, SolidWorks), FDM 3D printing (layers, supports, infill, tolerances, PLA/PETG/nylon), laser cutting, CNC milling, heat-set inserts | MK Units 1–4 |
| Robot ideas | Degrees of freedom, forward and inverse kinematics, PID control, motion profiles, balance, odometry and drift, sensor fusion, SLAM, path planning, obstacle avoidance, emergency stops, grippers | RO Units 1–8 |
| Robot software | ROS 2 (nodes and topics), simulation (Gazebo, Isaac Sim), the sim-to-real gap | RO Unit 9 |
| Robot learning (2026) | Teleoperation data, imitation learning, vision-language-action models such as π0, humanoids | RO Unit 10 |
| Shipping | PCB design (KiCad: schematic, layout, design-rule check, fab and assembly at board houses such as JLCPCB), design for manufacturing, injection moulding, bill of materials and unit cost, EVT/DVT/PVT builds, factory testing, FCC/CE certification, lead times and second sources | SH Units 1–5 |

Working back from that list gave the Elementary course: a robot senses, thinks and acts; a motor turns electricity into motion; a sensor is a robot's eye or ear; a robot's program loops forever; a battery runs out.

## Coverage summary

| Course | Units mapped | Microgames | Unit-list source |
|---|---|---|---|
| Elementary: robots and gadgets | 5 | 9 | No standard course; reconstructed from the sense–think–act model used in Modern Robotics Ch. 1 and in school robotics kits, and the NGSS elementary engineering-design standards (K-2-ETS1, 3-5-ETS1) |
| Electronics you can build | 5 | 26 | No standard course; units follow the toolchain list above, with Arduino and ESP32 practice as the reference (not fetched) |
| Making things | 4 | 18 | Published 3D-printing design guides (Snapmaker 45-degree rule, fetched), laser-cutting and CNC practice (not fetched), and YC's works-like and looks-like prototype advice (fetched) |
| Robotics | 10 | 22 | Lynch and Park, *Modern Robotics* (chapter list fetched); Thrun, Burgard and Fox, *Probabilistic Robotics* (not fetched); ROS 2 documentation (blocked, not fetched); π0 paper (fetched) |
| Shipping hardware | 5 | 15 | Instrumental EVT/DVT/PVT whitepaper (fetched); YC "Advice for Early-Stage Hardware Startups" (fetched); Fast Radius injection-moulding guide (fetched) |
| **Total** | **29** | **90** | |

Every counted row is a new microgame; 14 "See X" rows point to games in other files instead of repeating them. Two rows are marked [TRIMMED] (SH-15 `CAN THE NOISE!` and EB-26 `STAY IN RANGE!`) and one is marked [WEAK FIT] (RO-22 `TELL THE BOT!`). Topics left out on purpose: SPI as its own game (it shares EB-24's picture and is named on that card), stereo depth cameras (hard to show without words; lidar carries the idea of measuring distance in every direction), Jacobians and robot dynamics (exam-level mathematics), and detailed RF antenna design.

---

## Elementary: robots and gadgets

Source: no single elementary robotics course is standard. The units follow the sense–think–act loop that Modern Robotics Ch. 1 and school robotics kits use to describe a robot, plus the NGSS elementary engineering-design standards (K-2-ETS1 and 3-5-ETS1), which ask children to build, test and improve a design. Unit groupings are reconstructed by this file.

These games use pictures and actions only, with no reading during play.

### Unit 1: What a robot is: sense, think, act
Why it matters: every robot, from a vacuum cleaner to a warehouse arm, is built from parts that sense, parts that decide and parts that move; a newcomer who can name the three can read any robot.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| GE-01 | `BUILD A BOT!` | A robot needs a part that senses (an eye), a part that decides (a brain) and a part that moves (wheels). | An empty robot-vacuum shell on a kitchen floor covered in crumbs. Beside it lie an eye, a small brain board and a pair of wheels. | Drag the three parts into the shell. | The eye glows and spots a crumb, the brain blinks, the wheels roll over and slurp it up, and the robot heads for the next crumb. The three chest icons of the robot loop light up in turn. | Leaving out the eye: the robot rolls in a straight line, bonks the fridge, and keeps bonking it while crumbs sit all around. | Add a second sense (a bumper) before the cat walks in | Hedgehog |
| GE-02 | `LOOP FOREVER!` | A robot's program runs round and round: look, decide, move, then look again. | A robot dog and a bouncing ball. Above the dog, three picture cards (eye, brain, paw) sit in a row with a loose arrow at the end. | Drag the loose arrow from the last card back to the first. | The cards light one after another, again and again, and the dog keeps chasing the ball wherever it bounces. | No loop: the dog looks once, takes one step, then freezes like a statue while the ball bonks it on the head. | The ball speeds up: the loop must run faster | Fox |

### Unit 2: Motors make things move
Why it matters: almost every gadget that moves, from a phone's buzzer to a drone, uses an electric motor; knowing that current makes it turn, and that reversing the current reverses it, is the first step to controlling one.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| GE-03 | `RUN THE FAN!` | A motor turns electricity into spinning, and flipping the battery flips the direction. | A hot penguin in front of a toy fan. The fan's two wires hang loose next to a battery. | Drag the wires onto the battery's ends. | Dots flow through the motor, the blades spin, and a breeze cools the penguin, who sighs. | Wires on the wrong ends: the fan spins backwards, sucks the penguin's hat off its head and sticks it to the grille. | A switch to turn it off before the penguin gets too cold | Penguin |
| GE-04 | `TURN THE BOT!` | A two-wheeled robot turns by running one wheel faster than the other. | A robot with a motor on each wheel, a cheese on the left side of the room. Two big buttons: left wheel, right wheel. | Hold one button longer than the other to curve toward the cheese. | The robot curves smoothly and stops at the cheese; the frog cheers. | Holding both equally: the robot drives straight past the cheese into the wall. Holding only one: it spins on the spot like a top. | The cheese moves | Frog |
| — | See ME-06 `GEAR DOWN!` (CURRICULUM_earth_eng.md) | Gears trade speed for strength. | | | | | | |

### Unit 3: Sensors are a robot's eyes and ears
Why it matters: a robot can only react to what its sensors notice; choosing what to sense is the first design decision for any robot.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| GE-05 | `PING!` | A robot can feel how far away a wall is by sending out a sound and timing the echo. | A bat-shaped robot rolling down a dark hallway toward a wall. | Tap to send out a sound ring; tap again as it rolls. | Each ring hits the wall and bounces back; the closer the wall, the quicker the echo returns. When the echo is quick, the robot brakes just in time. | Never pinging: the robot rolls blind and flattens its nose on the wall. | A soft curtain that swallows the sound | Bird |
| GE-06 | `DRAW A PATH!` | A line-following robot uses two light sensors to see a dark line and steers to keep it between them. | A white floor, a robot with two small sensor eyes underneath, and a black marker in your hand. | Draw a black line in front of the robot with your finger. | The robot wiggles along the line: whenever one eye sees black, it turns that way. | A line that turns too sharply: both eyes lose the line, and the robot wanders off and gets lost under the sofa. | Draw through a gap; the robot must find the line again | Ant |
| GE-07 | `ADD BUMPER!` | A touch sensor tells a robot it has hit something, so it can back off and turn. | A robot vacuum pushing a chair across the room, the chair scraping the floor. A springy bumper lies nearby. | Drag the bumper onto the robot's front. | Next time it touches the chair, the bumper clicks, the robot backs up, turns and goes round it. | No bumper: the robot shoves the chair all the way into the fish tank. | A table leg: thin things are easy to miss | Beaver |

### Unit 4: Programs that react
Why it matters: robots follow rules of the form "if I sense this, do that"; every real robot program is built from such rules running in a loop.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| GE-08 | `LIGHT IT UP!` | A rule "if it is dark, switch on the light" lets a gadget react by itself. | A night light with a light sensor, a sleeping rabbit, and the sun setting outside the window. Two picture cards: a moon and a light bulb. | Drag the moon card onto the bulb card to join them into one rule. | As the sun sets, the sensor sees dark, the bulb switches on, and the rabbit sleeps peacefully. | Joining the sun card instead: the light blazes all day and switches off at night, and the rabbit wakes up scared in the dark. | Add "if there's noise, glow brighter" | Rabbit |
| — | See CS EL-04 `REPEAT!` and PR-03 `KEEP GOING!` (CURRICULUM_cs.md) | Loops in programs. | | | | | | |

### Unit 5: Batteries run out
Why it matters: battery life is one of the first things customers notice about any gadget, and a robot that can't get back to its charger is a robot that stops working.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| GE-09 | `HEAD HOME!` | A battery holds a fixed amount of energy, so a robot must head back to charge before it runs out. | A robot vacuum far across the house, its battery icon shrinking. The charging dock glows by the door. | Steer the robot (drag) back to the dock. | The robot rolls onto the dock, sparks of charge flow in, and the battery icon fills up. | Dawdling to grab one last crumb: the battery empties and the robot stops mid-carpet with a sad beep; the duck has to carry it home. | Driving fast drains the battery faster | Duck |
| — | See EE-04 `LAST LONGER!` (CURRICULUM_earth_eng.md) | A bigger draw empties a battery faster. | | | | | | |

---

## Electronics you can build (microcontrollers, sensors, motors, power, wiring and buses)

Source: no standard course covers this exact set. The units follow the toolchain that hardware and robotics teams use (the "What startups use" table), with Arduino and ESP32 practice as the reference: digital and analog pins, motor drivers, regulators, and the UART, I2C and CAN buses. The YC hardware post (fetched) advises using "easy-to-substitute off-the-shelf and pre-certified components wherever possible", which is why this course centres on standard boards, modules and buses. Circuit basics (voltage, current, resistance, LEDs, diodes and transistors) are already taught in CURRICULUM_earth_eng.md (EE-01 to EE-39) and are cross-referenced instead of repeated.

### Unit 1: Microcontrollers, the small brain
Why it matters: a microcontroller is the brain of almost every gadget (a toothbrush, a thermostat, a drone); being able to make one switch an output and read an input is where every hardware prototype starts.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EB-01 | `BLINK!` | A microcontroller is a tiny computer whose pins switch on and off as its program says. | The brain board, running a program shown as a looping strip of pictures: bulb on, clock, bulb off, clock. An LED with one long leg and one short leg dangles above. | Drag the LED's legs into the pin hole and the ground hole. | The pin glows on and off with the program strip, and the LED blinks in time. The card says this is the first thing everyone builds ("hello world"). | Plugging it in backwards: the pin glows but the LED stays dark, because an LED lets current through only one way (see EE-37). The owl turns it round. | Two LEDs that blink in turn | Owl |
| EB-02 | `ONE PRESS!` | A button's metal contacts bounce, so one press can look like many; the program waits a moment before believing it. | A doughnut dispenser with a button, a hungry fox, and a close-up bubble showing the button's metal contacts. A small sponge labelled "wait" sits by the wire. | Drag the sponge onto the button's wire, then press the button. | In the bubble, the contacts bounce, the sponge soaks up the chatter, and exactly one doughnut drops for the fox. | Pressing without the sponge: the contacts chatter, the board counts five presses, and five doughnuts bury the fox. | A sticky old button that bounces longer | Fox |
| EB-03 | `DIAL IN!` | Some pins read in-between amounts, not just on or off, so a knob can set how bright or fast something is. | A seedling under a lamp, a knob wired to the brain board. Too little light and it droops; too much and it scorches. | Turn the knob until the seedling perks up. | As you turn, a bar on the pin rises smoothly and the lamp brightens with it; the seedling stands tall. | Wiring the knob to an on-off pin: the lamp jumps between dark and blazing, and the seedling droops then smokes. | The sun comes out and you must turn it down | Turtle |
| EB-04 | `NAP!` | Battery gadgets last for months by sleeping almost all the time and waking only to do their job. | A battery doorbell on a door, its battery icon, and a wall calendar. Visitors arrive now and then. | Tap the board to put it to sleep each time a visitor has rung. | The board snores between visitors, the battery barely drops, and the calendar flips through a whole year. | Leaving it awake: the board stares at the empty doorstep, the battery drains in two calendar pages, and the next visitor's ring makes no sound. | A board that can set its own wake-up alarm | Hedgehog |
| EB-05 | `CHOOSE A BRAIN!` | A microcontroller starts instantly and sips power; a single-board computer (like a Raspberry Pi) runs a full operating system for cameras and maps but takes time to start and uses more power. | Two jobs side by side: a light switch that must react the instant it is pressed, and a robot that must recognise faces in a camera. Two brains on the bench: a small blue board and a bigger computer board with a fan. | Drag a brain into each job. | The small board turns the light on the instant it's pressed; the big board draws boxes round faces in the camera. | Big board in the light switch: you press it and wait while it boots, a loading bar crawls, and the rabbit sits in the dark. Small board on the camera: the picture freezes into a slideshow. | A battery robot that needs both: they work together | Rabbit |

### Unit 2: Sensors you can wire up
Why it matters: robots and smart gadgets are only as good as their measurements; inertial sensors, encoders, lidar and load cells are the sensors robotics job postings ask for most often.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EB-06 | `TURN SIDEWAYS!` | An accelerometer feels which way gravity pulls, so a phone knows which way is down. | A phone showing a film to a duck. A see-through window in the phone shows a tiny weight on springs. | Rotate the phone on its side (swipe round or tilt the device). | The tiny weight sags toward the ground, the screen turns to wide view, and the duck settles in to watch. | Laying it face-up flat on the table: the weight sags into the table, the phone can't tell which way to show the film, and the picture flips back and forth while the duck gets dizzy. | A robot uses the same sensor to tell when it is tipping | Duck |
| EB-07 | `COUNT TICKS!` | An encoder counts slots on a spinning disc, so a robot knows how far its wheel has turned. | A robot whose wheel carries a disc with slots; a light beam shines through it. A cookie lies ahead, and a dotted strip on the floor runs to it. | Hold to drive; let go when the lit ticks reach the cookie. | Each slot that passes the beam lights one tick on the floor strip; the robot stops with its nose at the cookie. | The wheel slips on a puddle: it spins and the ticks race ahead, but the robot hasn't moved, and it stops short of the cookie with its nose in the air. | A slippery floor: ticks are counted but distance is lost | Ant |
| EB-08 | `SPIN LIDAR!` | Lidar spins a laser and measures the distance in every direction, drawing the room as dots. | A dark room. A robot carries a small spinning turret on top. A cat is hiding behind the sofa. | Hold to spin the lidar. | Red dots splash outward and outline the walls, the sofa and the cat's tail sticking out. | A glass door: the laser passes straight through, the map shows open space, and the robot drives into the glass with a bonk. | A mirror that shows a fake room | Owl |
| EB-09 | `FILL THE BOWL!` | A load cell is a metal bar that bends a tiny bit under weight; a stretchy strip glued on it turns the bend into a signal. | A kitchen scale cut open: a metal bar with a strip on it. A bowl on top, and a line marking the right bend. A bag of flour hangs above. | Tip the bag (hold) until the bar bends to the line. | The bar bends (drawn larger than life), the strip stretches and glows, and the bowl holds just enough flour. | Pouring too fast: flour heaps over, the bar bends past the line, and a cloud of flour covers the beaver. | The beaver's paw leans on the bowl | Beaver |
| EB-10 | `ZERO IT!` | Sensors read a little wrong until you set their zero (calibrate) with nothing on them. | The same scale, with an empty bowl already on it; the bend shows weight that isn't flour. | Tap the zero button with the bowl on. | The reading drops to zero, and the flour poured next is counted on its own; the cake rises. | Not zeroing: the scale counts the bowl as flour, too little flour goes in, and the cake comes out flat as a pancake. | A sensor whose zero slowly drifts as it warms | Beaver |
| — | See SC-07 `SMOOTH OUT!` (CURRICULUM_earth_eng.md) | Averaging readings smooths a jittery sensor. | | | | | | |
| — | See EE-20 `PULL UP!` (CURRICULUM_earth_eng.md) | A pin left unconnected floats. | | | | | | |

### Unit 3: Motors and motor drivers
Why it matters: choosing the right motor and driving it properly decides whether a robot moves precisely, holds a position or burns out; it is the most common source of smoke in a first robot.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EB-11 | `DRIVE IT!` | A microcontroller's pin is too weak to run a motor; a motor driver uses the pin's small signal to switch the battery's big current. | A brain board with a wire straight from its pin to a motor; the motor twitches feebly. A motor-driver chip and a big battery sit beside it. | Drag the driver chip between the pin and the motor. | The pin's trickle of dots flips the driver, a river of dots flows from the battery, and the motor spins hard. | Leaving the motor on the pin: the pin glows red, puffs a little smoke, and the beaver fans it with a leaf. | Two motors, one driver | Beaver |
| EB-12 | `REVERSE BOT!` | An H-bridge is four switches round a motor; closing opposite corners sends current one way or the other, so the robot can reverse. | A robot facing a wall. Below it, four switches arranged in an H around its motor. | Tap the two switches on opposite corners. | Dots flow through the motor the other way and the robot backs away from the wall. | Closing the two switches on the same side: the dots skip the motor and race straight across, sparks fly, and the robot's hair stands on end (a short circuit). | Swap direction quickly back and forth to wiggle out of a corner | Hedgehog |
| EB-13 | `STEP!` | A stepper motor moves in exact small steps, one per pulse, so a 3D printer knows where its nozzle is without measuring. | A 3D printer's nozzle at one end of a rail; a target mark along it. | Tap to send pulses; each tap moves the nozzle one notch. | The nozzle clicks along notch by notch and stops on the mark. | Tapping too fast: the motor buzzes, skips steps, and the nozzle stops short, so the next layer prints off to one side (a layer shift). | A heavier nozzle skips sooner | Frog |
| EB-14 | `AIM THE FLAG!` | A hobby servo has its own sensor and controller inside, so you tell it an angle and it holds it. | A servo with a flag on its arm, a treasure chest across the room, and gusts of wind. A dial sets the angle. | Drag the dial so the flag points at the treasure. | The servo swings the flag round, and when gusts push it, it pushes back and holds steady. | Swapping in a plain motor: it spins round and round and the flag whirls like a propeller. | The treasure moves | Octopus |
| EB-15 | `FREE WHEEL!` | A motor that is blocked (stalled) draws a huge current and heats up. | A robot's wheel jammed against a sock; the motor's dots are turning red. | Swipe the sock away before the motor glows. | The wheel turns freely, the dots cool to blue, and the robot drives on. | Waiting: the motor glows, then smokes, and the robot gives a sad cough. | The software could cut power when current spikes | Turtle |
| — | See SC-15 `FLICKER!` (CURRICULUM_earth_eng.md) | Switching power on and off fast sets an LED's brightness; motor speed is set the same way. | | | | | | |
| — | See EE-25 `SPARK!` (CURRICULUM_earth_eng.md) | A coil resists sudden changes in current, so switching a motor off makes a spike. | | | | | | |
| — | See ME-29 `TWIST!` (CURRICULUM_earth_eng.md) | A slow, strong motor twists its shaft hard. | | | | | | |

### Unit 4: Power
Why it matters: power problems (dead batteries, brown-outs, fried chips, fires) cause many of the failures in early hardware, and lithium batteries need care to be safe.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EB-16 | `REGULATE!` | A voltage regulator turns a battery's bigger, changing voltage into the steady, smaller voltage that chips need. | A tall water tower (the battery) above a tiny teacup (the chip), joined by a pipe. A regulator valve lies beside the pipe. | Drag the regulator onto the pipe. | A steady trickle fills the teacup to just the right level, and keeps it there even as the tower's water drops. | No regulator: the torrent shatters the teacup and a puff of smoke rises (the card calls it "magic smoke"). | A sensor that needs a different level from the brain | Penguin |
| EB-17 | `KEEP AWAKE!` | When motors start they gulp current, which can drop the voltage so far that the brain restarts; a big capacitor nearby covers the gulp. | A robot whose brain board shows a happy face. Every time its motors start, the face blinks off and the robot jerks. A big capacitor (a bucket) sits beside it. | Drag the capacitor next to the board, then let the motors start. | The bucket pours out a splash as the motors gulp, the face stays on, and the robot drives smoothly. | No bucket: every start blinks the brain off, the robot reboots, jerks, reboots, and ends up dancing on the spot. | Bigger motors need a bigger bucket or their own battery | Rabbit |
| EB-18 | `LAND NOW!` | A lithium (LiPo) battery is damaged if it is drained too low, so drones land before the floor line. | A drone flying over a pond; its battery bar falls toward a red floor line. | Tap to land before the bar crosses the line. | The drone settles on the dock and the battery bar sits just above the line, healthy. | Flying past the line: the battery puffs up like a pillow and the drone wobbles down into the pond with a splash. | A headwind drains it faster | Bird |
| EB-19 | `SHARE GROUND!` | Two boards understand each other's signals only when their grounds (their zero levels) are joined. | Two brain boards, one sending "HELLO" to the other along a single wire. A ground wire lies loose. | Drag the ground wire between the two boards. | The message arrives clean: HELLO. | Without the ground wire: the message arrives as scrambled symbols, and the second board shrugs. | Three boards in a chain | Ant |
| — | See EE-08 `PROTECT!` and EE-10 `FUSE IT!` (CURRICULUM_earth_eng.md) | Current limits protect parts and wires. | | | | | | |

### Unit 5: Wiring and communication buses
Why it matters: every prototype is wired on a breadboard and soldered, and every product joins its chips with a few standard buses (UART, I2C, SPI, CAN); wiring mistakes are among the most common prototype bugs.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| EB-20 | `PRESS IN!` | A breadboard's holes are joined in hidden strips, so parts in the same strip are connected. | A breadboard with its strips drawn faintly, a battery already plugged in, and an LED in your hand. | Push the LED's two legs into two different strips beside the battery's. | Both strips glow and the LED lights. | Both legs in the same strip: the strip joins the legs together, current skips the LED, and it stays dark. | Add a resistor in a third strip | Owl |
| EB-21 | `SOLDER!` | A good solder joint comes from heating the pad and the leg, then feeding in solder, which flows into a shiny cone. | A circuit board with a part's leg poking through a copper pad; a soldering iron and a coil of solder wire. | Hold the iron on the pad and leg, then drag the solder in. | The solder melts, flows round the leg and sets into a shiny little cone. | Melting solder on the iron and dabbing it on: it sits as a dull ball, and when the board is shaken the leg wobbles out (a "cold joint"). | A big pad that takes longer to heat | Hedgehog |
| EB-22 | `CROSS WIRES!` | In serial (UART) wiring, each board's "send" wire goes to the other's "listen" wire. | Two boards, each with a mouth pin (send) and an ear pin (listen). | Drag the first board's mouth wire to the second board's ear. | The message flies mouth to ear and the second board nods. | Mouth to mouth: both boards shout at each other and nobody hears anything. | Both directions at once | Frog |
| EB-23 | `MATCH SPEED!` | Both ends of a serial link must agree on the same speed, or the text turns to gibberish. | A board talking to a laptop; the laptop shows scrambled symbols. A speed dial sits on the laptop. | Turn the dial until the scramble becomes words. | The symbols settle into "HELLO" as the speeds match. | Turning past it: the text scrambles again, and the frog squints at it upside down. | The board changes speed mid-message | Frog |
| EB-24 | `JOIN THE BUS!` | I2C lets many sensors share two wires; each sensor has its own address and answers only to it. | A two-wire street. The brain board lives at one end; sensor houses (a thermometer, a light sensor, a compass), each with a house number, wait to move in. | Drag each sensor house onto the street. | The brain calls each house in turn and only that house answers; readings flow back along the street. | Two houses with the same number: both answer at once, the replies crash into a tangle, and the brain clutches its head. | A sensor whose address can be changed with a tiny switch | Bird |
| EB-25 | `BRAKE FIRST!` | On a CAN bus (used in cars and robots), all parts share one pair of wires, and the most important message wins when two talk at once. | A car's single shared wire; the radio is chattering along it. A deer leaps into the road. | Tap the brake pedal. | The brake message barges onto the wire, the radio's message waits politely, and the car stops before the deer. | If the radio had priority (shown on the card's replay): the brake message waits behind a song, and the deer leaps over the bonnet. | Three parts all talking at once | Fox |
| EB-26 | `STAY IN RANGE!` **[TRIMMED]** | Bluetooth Low Energy talks only over short distances but uses little power; Wi-Fi reaches farther and connects to the internet but drains more. | A step-counter on a jogging turtle and a phone in the turtle's pocket. A dotted link joins them. | Keep the phone close to the step-counter as the turtle runs (drag). | The dotted link stays solid and the steps tick up on the phone. | Leaving the phone on the bench: the link stretches, dots drop out and the step count freezes. | A wall between them shortens the range | Turtle |

---

## Making things (CAD, 3D printing, laser cutting and CNC, prototyping)

Source: no standard course covers these together. CAD games follow how parametric CAD tools (Fusion, Onshape, SolidWorks) work: a closed sketch is extruded into a solid, and dimensions drive the shape. 3D-printing games follow published design guides; the overhang rule follows Snapmaker's "45-degree rule" page (fetched: most FDM printers handle overhangs up to about 45 degrees without supports, because each layer still rests on about half of the layer below; strong cooling can stretch this to 60 degrees or more). Laser-cutting and CNC games follow standard shop practice (kerf and round-bit inside corners; not fetched). The prototyping unit follows YC's hardware advice (fetched): build a "works like" prototype and a separate "looks like" model, and nobody cares what chip blinks the LED in a prototype.

### Unit 1: 3D printing (FDM)
Why it matters: desktop 3D printers (FDM, or fused deposition modelling: a hot nozzle laying melted plastic) are how startups make brackets, cases and test parts in a day; knowing the few rules below decides whether a print works first time.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MK-01 | `LAYER UP!` | An FDM printer builds a part by laying thin lines of melted plastic, one layer on top of another. | A print bed with a ghostly outline of a cup; the nozzle waits at the bottom. | Swipe back and forth to lay lines; each full layer lifts the nozzle a notch. | Line by line the cup rises, layer stripes showing on its side, until the rim is done. | Swiping wildly outside the outline: lines land on air and droop into a tangle of spaghetti. | A cup with a handle | Ant |
| MK-02 | `SQUISH!` | The first layer must be pressed onto the bed, or the whole print comes loose. | A nozzle a little too high above the bed; the first line comes out as a round noodle. | Drag the nozzle down until the line flattens. | The line squishes flat and grips the bed, and the print grows on a solid base. | Too high: the noodle curls up, sticks to the nozzle and drags the print off the bed. Too low: the nozzle scrapes the bed and no plastic comes out. | A warped bed: one corner is higher | Beaver |
| MK-03 | `TILT IT!` | Steep overhangs droop, because each layer needs about half of the layer below to rest on; tilting the part to 45 degrees or less fixes it. | A model of a letter T standing on the bed; its arms stick straight out into the air. | Rotate the model until no part hangs out further than a 45-degree slope (or flip it upside down). | The printer prints it cleanly: every layer has something to rest on. | Printing the T upright: the arms droop like wet noodles and dangle down the sides. | A model that can't be tilted: see MK-04 | Owl |
| MK-04 | `ADD SUPPORT!` | When a part can't be turned, temporary supports hold up the overhang and are snapped off afterwards. | A model of a bridge-shaped arch with a flat roof floating over empty space. A box of thin support sticks. | Drag supports under the floating roof. | The roof prints on the sticks; afterwards the frog snaps them off and holds up a clean arch. | Too few sticks: the roof sags between them like a hammock. | Supports that leave rough marks; put the visible face up | Frog |
| MK-05 | `SPAN THE GAP!` | A printer can stretch plastic across a short gap between two pillars (a bridge), but a long one sags. | Two pillars far apart; a beam needs printing across their tops. | Drag the pillars closer together until the beam can cross. | The nozzle stretches a taut strand across and the beam prints flat. | Pillars too far apart: the strands sag into a smile and the beam is wavy. | A pillar that can't move: add a third in the middle | Beaver |
| MK-06 | `ADD WALLS!` | Printed parts are mostly hollow inside with a pattern (infill); more walls and infill make a part stronger but slower and heavier. | A printed hook, cut open to show a thin shell and sparse honeycomb. A heavy shopping bag waits to hang on it. | Hold to add walls and infill; let go, and the bag is hung. | The hook's insides fill in and it holds the bag. | Letting go too early: the hook crumples like an eggshell. Holding forever: the hook is solid, but the print clock spins and the shop has closed. | A heavier bag | Rabbit |
| MK-07 | `ORIENT!` | Printed parts are weakest between layers, so lay a part so the force runs along the layers, not across them. | A printed shelf bracket on the bed, standing upright so its layers stack like pancakes. A heavy pot plant waits to go on the shelf. | Rotate the bracket to lie flat, then let it print and load it. | The layers now run the length of the arm, and the bracket holds the plant. | Printing it upright: the bracket snaps cleanly between two layers, like a stack of pancakes sliding apart, and the plant lands on the turtle. | A bracket that is loaded two ways | Turtle |
| MK-08 | `FIT TOGETHER!` | Printed holes come out a little smaller than drawn, so parts that slide together need a small gap. | A printed peg and a printed hole drawn exactly the same size. A gap handle on the hole. | Drag the gap handle out a little, then push the peg in. | The peg slides in snugly and turns smoothly. | No gap: the peg jams; the hedgehog hammers it and the part cracks. Too much gap: the peg rattles and falls out. | A snap-fit lid | Hedgehog |
| MK-09 | `BEAT THE HEAT!` | PLA, the easiest plastic, softens in a hot car; PETG and nylon cope with heat and knocks. | A phone holder on a car dashboard in blazing sun. Spools of PLA and PETG sit by the printer. | Drag a spool into the printer; the holder prints and the sun beats down. | A PETG holder stays firm and the phone stays up all summer. | A PLA holder: it slumps like melted cheese and the phone slides onto the floor. | A flexible plastic (TPU) for a bumper that must bend | Penguin |
| MK-10 | `ENCLOSE!` | Plastic shrinks as it cools, so big flat parts curl up at the corners (warping); a warm enclosure slows the cooling. | A big flat tray printing in a draughty room; its corners start to lift. A clear box lies beside the printer. | Drag the box over the printer. | Warm air stays in, the corners stay flat, and the tray comes out level. | No box: the corners curl up like a crisp and the nozzle knocks the print off the bed. | A brim (a thin skirt) helps the corners grip | Penguin |
| — | See EM-05 `SLOT IN!` (CURRICULUM_earth_eng.md) | Small size errors add up when parts stack. | | | | | | |

### Unit 2: CAD basics
Why it matters: every printed, cut or moulded part starts as a CAD model; designing so that changing one size updates the whole part is what lets a team make ten versions in a week.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MK-11 | `EXTRUDE!` | CAD turns a closed flat sketch into a solid by pulling it up. | A flat outline of a phone stand with a hole for the cable, drawn on a grid. | Drag up on the sketch. | A solid stand rises out of the grid, with the hole going right through. | A sketch with a tiny gap in its outline: pulling it up raises only a floppy ribbon of wall, because an open sketch has no inside to fill. | Pull the hole down to cut it instead | Octopus |
| MK-12 | `WIDEN SLOT!` | In parametric CAD, sizes are linked, so changing one dimension updates everything tied to it. | The phone stand from MK-11 with a phone that's too thick for its slot. A dimension arrow sits across the slot. | Drag the slot's dimension arrow wider. | The slot widens and the walls, fillets and cable hole all move with it; the phone drops in. | In a model drawn without links: the slot widens straight through the side wall, and the stand splits in two. | The phone needs a case: widen again | Octopus |
| MK-13 | `MEASURE IT!` | Measure the real part with calipers before drawing the part that holds it. | A battery and a pair of calipers. A printed case waits to be designed round the battery. | Slide the caliper jaws until they just touch both sides of the battery. | The measurement flows into the CAD sketch, the case prints, and the battery clicks in. | Jaws left loose: the case is drawn too small, prints, and the battery perches on top like a hat. | Measure a round shaft | Ant |

### Unit 3: Laser cutting, CNC milling and fastening
Why it matters: laser cutters make flat parts and boxes in minutes, CNC mills carve strong metal and wood parts, and inserts make printed parts that can be screwed and unscrewed many times.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MK-14 | `SNAP A BOX!` | A laser cutter cuts flat panels; slotted edges (finger joints) let them lock into a box, and the panels must allow for the width the beam burns away (kerf). | Six flat plywood panels with toothed edges, fresh from the laser. | Drag the panels together into a box. | The teeth interlock with a satisfying click and the box stands firm. | Panels drawn without allowing for the burned-away width: the teeth rattle loose and the box folds flat when the fox sits on it. | A lid with a living hinge (a sheet cut into flexible zigzags) | Fox |
| MK-15 | `MILL!` | A CNC mill carves by cutting away material with a round spinning bit, so it can't make a sharp inside corner. | A metal block with a square pocket to carve; a square part waits to fit in it. | Trace the pocket's outline with the spinning bit. | The pocket's corners come out rounded; the card shows the trick of drawing small round notches at the corners ("dogbones") so the square part fits. | Tracing square corners exactly: the bit leaves curved corners, and the square part sits on top, stuck. | A pocket for a round part (it fits easily) | Beaver |
| MK-16 | `MELT IN!` | Screws strip soft plastic threads; a brass insert melted into the plastic gives strong threads that can be reused. | A printed case with a hole; a brass insert and a soldering iron; a screw. | Hold the hot iron on the insert to sink it into the hole, then turn the screw. | The insert sinks in, plastic flows round its ridges, and the screw goes in and out again and again. | Screwing straight into the plastic three times: the threads strip and the screw spins forever while the lid flaps open. | Sink it in straight: a tilted insert jams the screw | Hedgehog |

### Unit 4: Prototyping fast
Why it matters: YC's hardware advice is to build a rough "works like" prototype and a separate "looks like" model, and to put the first version in front of people quickly; this is how teams find out what is wrong before spending money on tooling.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| MK-17 | `TAPE IT!` | Build an ugly prototype fast and test it, because testing shows what's wrong sooner than polishing. | An idea for an automatic cat feeder: a cardboard box, a cup, a motor, a roll of tape. A cat clock counts down to dinner. | Mash to tape the parts together before dinner time. | A lopsided feeder drops kibble, the cat eats, and the card notes that the test showed the chute jams, which the next version fixes. | Holding to sand one part smooth: dinner time comes, there's one beautiful cup and no feeder, and the cat eats the tape. | The test shows a new problem; tape on a fix | Rabbit |
| MK-18 | `SPLIT IN TWO!` | Make a "works like" prototype for the guts and a separate "looks like" model for the shape, so each can change fast. | A messy board of wires that works, and a beautiful but empty plastic shell. A customer rabbit wants to see the product. | Drag the messy board into a test box and the shell onto the display stand. | The customer holds the shell and loves the shape; the messy board does its job in its box. Both teams keep changing their part. | Cramming the messy board into the pretty shell: wires spill out, the lid won't close and smoke curls up. | The shell changes shape and the board must still fit (later) | Rabbit |

---

## Robotics (moving, reaching, control, localisation, mapping, planning, safety, manipulation, robot software, robot learning)

Source: Kevin M. Lynch and Frank C. Park, *Modern Robotics: Mechanics, Planning, and Control* (Cambridge University Press 2017; updated first edition 2019; chapter list fetched from the book's Northwestern page). Its chapters include configuration space (Ch. 2), forward kinematics (Ch. 4), inverse kinematics (Ch. 6), trajectory generation (Ch. 9), motion planning (Ch. 10), robot control (Ch. 11), grasping and manipulation (Ch. 12) and wheeled mobile robots (Ch. 13). Localisation and mapping follow Thrun, Burgard and Fox, *Probabilistic Robotics* (MIT Press 2005; not fetched). Robot software follows ROS 2 and the simulators Gazebo and Isaac Sim, which robotics job postings name as requirements (job listings seen in search results; the ROS 2 documentation page was blocked and not fetched). Robot learning follows Black et al., "π0: A Vision-Language-Action Flow Model for General Robot Control" (Physical Intelligence, arXiv 2410.24164, RSS 2025, revised January 2026; fetched), trained on data from single-arm, dual-arm and mobile robots, with tasks such as folding laundry and assembling boxes. Feedback-control basics are already taught in CURRICULUM_earth_eng.md (SC-01 to SC-05) and are cross-referenced.

### Unit 1: Moving: wheels, legs and joints
Why it matters: the first design choice for a robot is how it moves, and each joint added (a degree of freedom) adds cost, weight and control work.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| RO-01 | `ADD A JOINT!` | Each joint adds one way to move (a degree of freedom); with too few, an arm can't reach round things. | A robot arm with one joint; a cup sits on a shelf behind a box. A tray of joints lies beside it. | Drag joints onto the arm until it can curl round the box. | With a shoulder, elbow and wrist, the arm snakes over the box and picks up the cup. | One joint: the arm sweeps a single arc and smacks the box onto the floor. | A cup inside a cupboard: a joint that turns the wrist | Octopus |
| RO-02 | `TAKE STAIRS!` | Wheels are fast and simple on flat floors; legs can step up stairs and over rocks. | A delivery robot with a parcel at the bottom of some front steps. Wheels and legs lie by the robot. | Drag a set of legs onto the robot, then mash to walk. | The robot climbs step by step and leaves the parcel at the door. | Keeping wheels: the robot bumps the first step, rolls back, bumps again, and the parcel bounces onto its head. | A long flat road after the stairs: wheels win there | Frog |

### Unit 2: Kinematics: reaching
Why it matters: every robot arm, from a factory welder to a surgical robot, must turn "put the hand there" into joint angles; this is the core calculation the arm's software does many times a second.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| RO-03 | `SWING ARM!` | Turning a joint moves everything after it, so the hand's position comes from all the joint angles together (forward kinematics). | A three-joint arm; a bell hangs above and to the side. | Twist the shoulder joint (drag round) until the hand rings the bell. | The shoulder swings the whole arm, elbow and hand with it, and the hand dings the bell. | Twisting only the wrist: the hand spins on the spot like a whisk while the bell stays out of reach. | Ring two bells, one after the other | Bird |
| RO-04 | `REACH OUT!` | Working backward from where the hand must go to the joint angles is inverse kinematics; often two arm shapes reach the same spot. | A robot arm on a table with a vase; an apple on the far side. | Drag the robot's hand to the apple; the joints bend themselves to follow. | The elbow lifts up and over the vase and the hand closes on the apple. | Dragging so the elbow bends down instead: it sweeps the vase off the table. Dragging past the arm's reach: the arm stretches straight and the hand flops short. | The apple is placed so only one shape works | Owl |

### Unit 3: Control: getting there smoothly
Why it matters: almost every motor in a robot runs a feedback loop (usually PID: proportional, integral, derivative); tuning it is daily work for robotics engineers.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| — | See SC-01 `APPROACH!` (CURRICULUM_earth_eng.md) | Correct harder the farther you are from the target (proportional). | | | | | | |
| — | See SC-05 `CLOSE THE GAP!` (CURRICULUM_earth_eng.md) | Remembering past error closes the leftover gap (integral). | | | | | | |
| — | See SC-03 `ADJUST!` (CURRICULUM_earth_eng.md) | A delay in the loop causes overshoot. | | | | | | |
| RO-05 | `SETTLE IT!` | A "brake as you get close" part of the controller (derivative) stops a robot overshooting its target. | A drone bouncing up and down past a window ledge where a parcel must go. A brake knob on its remote. | Turn the brake knob up until the drone settles at the ledge. | The bouncing shrinks to a gentle stop and the parcel slides onto the ledge. | Too much brake: the drone creeps up so slowly that the owl dozes off. No brake: it bounces and bonks its head on the roof. | Wind gusts that the controller must fight | Owl |
| RO-06 | `EASE IN!` | Robots speed up and slow down gradually (a motion profile) so they don't spill or shake what they carry. | A robot carrying a full mug of cocoa toward a table where a cat waits. | Hold to drive, pressing gently at first and easing off before the table (the throttle follows how long you hold). | The robot glides off and glides in, and the cocoa barely ripples. | Slamming full speed and stopping dead: the cocoa sloshes out over the cat. | A fuller mug | Penguin |
| RO-07 | `STAY UPRIGHT!` | A balancing robot stays up by driving its wheels under whichever way it starts to fall. | A two-wheeled robot balancing a tall pole, wobbling. | Tilt (or swipe) left and right to drive the wheels under the pole. | Small quick moves keep the pole upright; the robot rolls across the room still balanced. | Moving the wrong way, or too late: the pole crashes to the floor and the robot flops beside it. | A heavier top; humanoids balance the same way on two legs | Penguin |

### Unit 4: Knowing where you are
Why it matters: a mobile robot must know where it is to do anything useful, and every position sensor drifts or jitters; combining sensors is standard practice in robots, drones and phones.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| RO-08 | `SPOT LANDMARK!` | Counting wheel turns (odometry) drifts as small errors pile up; seeing a known landmark snaps the robot's guess back to the truth. | A dim warehouse. The robot drives toward its charger, and its ghost (where it thinks it is) slowly slides away from it. A poster it knows hangs on the wall. | Tap the poster when it comes into the robot's camera view. | The ghost snaps back onto the real robot, and the robot parks neatly on its charger. | Never checking: the ghost drifts further and further, and the robot proudly parks in a plant pot. | Two posters that look alike | Fox |
| RO-09 | `BLEND SENSORS!` | Mixing a smooth-but-drifting sensor (a gyroscope) with a jittery-but-steady one (a compass) gives a heading better than either (sensor fusion). | A robot's heading arrow. A gyroscope arrow turns smoothly but slowly drifts off north; a compass arrow points north but shakes. A slider between them. | Slide the mix until the robot's arrow is both steady and true. | The arrow points north without shaking, and the robot drives in a straight line. | All gyro: the robot curves slowly into the pond. All compass: it zigzags like a bee. | A magnet nearby bends the compass | Duck |

### Unit 5: Mapping (SLAM)
Why it matters: robot vacuums, warehouse robots and self-driving cars build maps of places they have never seen while working out where they are on them (SLAM: simultaneous localisation and mapping).

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| RO-10 | `MAP THE HOUSE!` | A robot can build a map and find itself on it at the same time, using its lidar dots. | A dark, unknown house. A robot with a spinning lidar sits at the front door. | Drag the robot slowly through the rooms. | Lidar dots paint the walls as it goes, and a floor plan appears behind it. | Dragging too fast: the dots smear, walls appear twice, and the map looks like a house in an earthquake. | A door that opens while you map | Beaver |
| RO-11 | `CLOSE THE LOOP!` | When a robot recognises a place it has already been, it fixes the drift in the whole map at once (loop closure). | A map drawn round a block of rooms, slightly bent, so the end doesn't meet the start. The front door is just ahead. | Drive the robot back to the front door. | The robot recognises the door, and the whole bent map springs straight with a click. | Turning away just before the door: the map stays bent and a corridor runs through the kitchen sink. | A long loop with more drift | Beaver |

### Unit 6: Planning paths and avoiding obstacles
Why it matters: every mobile robot must find a route that doesn't hit anything, and real rooms change (people, pets, boxes), so it keeps re-planning as it goes.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| RO-12 | `PLAN A PATH!` | A robot plans a route on its map that keeps its whole body, not just its centre, clear of obstacles. | A map of a room with furniture, a round robot and its charger in the far corner. | Trace a path from the robot to the charger. | The robot follows the path, its full width clearing every table leg. The card shows how planners grow every obstacle by the robot's width before searching. | A path that hugs the table: the robot's centre fits the line but its side clips the leg, and a teapot wobbles off. | A narrow doorway the robot only just fits through | Ant |
| RO-13 | `SWERVE!` | Robots keep checking their sensors as they move and steer round things that weren't on the map. | A robot following its planned path down a corridor. A cat strolls into the way. | Swipe the robot round the cat when the cat appears. | The robot curves round the cat and rejoins its path. | Sticking to the old path: the robot rolls into the cat, which sits on it and rides it to the charger. | Two cats moving in different directions | Fox |

### Unit 7: Safety
Why it matters: robots are heavy and strong, so every real robot has a hardware emergency stop, and robots working near people slow down when someone comes close.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| RO-14 | `E-STOP!` | Every real robot has a big red stop button that cuts motor power whatever the software is doing. | A robot arm swinging wildly toward a birthday cake. Its screen shows a "pause" button; a big red mushroom button sits on the wall. | Slam the red button. | Power cuts instantly, the arm freezes mid-swing and the cake is saved. | Tapping the screen's pause: the frozen screen shows a spinning wheel while the arm keeps swinging and splats the cake, because stuck software can't stop itself. | The arm slows by itself as the hedgehog walks near | Hedgehog |

### Unit 8: Grippers and manipulation
Why it matters: picking things up reliably is the job most new robots are bought for (warehouses, kitchens, factories), and it is one of the hardest problems in robotics.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| RO-15 | `LIFT GENTLY!` | A gripper must squeeze hard enough not to drop a thing but gently enough not to crush it, so good grippers sense their force. | A robot gripper above a ripe strawberry. | Hold to close the gripper; let go when it's snug, and the arm lifts. | The fingers press just enough, and the strawberry rises without a dent. | Squeezing too long: the strawberry squishes and juice drips. Too short: it slips out and plops back on the plate. | An egg, then a heavy jar | Rabbit |
| RO-16 | `CLEAR THE BIN!` | Suction cups grab smooth flat things fast, which is why warehouses use them, but they fail on bumpy or soft things. | A warehouse bin with boxes, a bag of oranges and a fluffy toy. A suction gripper and a finger gripper hang above. | Lower a gripper onto each item and lift it out. | Suction lifts the boxes one after another; the finger gripper picks the toy and the bag. | Suction on the fluffy toy: it slurps up a tuft of fluff and the toy stays put; the cup makes a rude noise. | A box with a crumpled label | Octopus |
| RO-17 | `GRASP!` | Grabbing near an object's balance point stops it twisting out of the gripper. | A hammer lying on a bench; the gripper can grab anywhere along it. | Drag the gripper along the hammer and close it. | Grabbing near the heavy head, the hammer lifts level and steady. | Grabbing the far end of the handle: the heavy head swings down, twists out of the fingers and clonks the bench. | A full bucket with its handle off-centre | Beaver |

### Unit 9: Robot software and simulation
Why it matters: robotics teams build their software from many small programs joined by ROS 2, and test it in simulators such as Gazebo and Isaac Sim before risking real hardware; job postings ask for both.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| RO-18 | `SUBSCRIBE!` | In ROS 2, each small program (a node) does one job and posts messages on named channels (topics) that any other node can listen to. | Three nodes as little machines: a camera, a planner and a motor. Pipes labelled with pictures (camera, thermometer, wheel) run past them. The planner's ear hangs loose. | Plug the planner's ear into the camera pipe. | Pictures flow into the planner, the planner sends commands down the wheel pipe, and the robot drives toward the ball. | Plugging into the thermometer pipe: the planner gets only temperatures and steers the robot toward the warm oven. | Add a new node that listens to the same camera pipe | Bird |
| RO-19 | `TEST IN SIM!` | Crashing a virtual robot thousands of times costs nothing, so teams test in simulation first. | A screen showing a virtual robot learning to drive a twisty track; beside it, the real, expensive robot. | Mash to run practice laps in the simulation. | Virtual robots crash, respawn and improve; then the real robot drives the track first time. | Skipping the simulation: the real robot takes the first bend at full speed and lands in pieces, with a price tag fluttering down. | The track has a hill | Frog |
| RO-20 | `SHAKE UP SIM!` | A robot trained in a perfect simulation can fail in the messy real world; varying the simulation (light, colours, slippery floors) makes it cope (closing the "sim-to-real gap"). | A tidy simulated kitchen, all one colour, where a robot practises picking a cup. | Shake the device (or swipe) to scramble the simulated lights, colours and floors while it practises. | After practice, the robot walks into the real, messy kitchen and picks up the cup anyway. | No shaking: the robot, trained only on the tidy kitchen, sees a patterned rug, freezes, and tries to pick up the rug. | A real cup that is heavier than in the sim | Octopus |

### Unit 10: Robot learning (as of 2026)
Why it matters: in 2026, robotics companies building humanoids and home and warehouse robots train robots on recordings of people steering them (teleoperation), and models such as π0 combine camera images and spoken instructions into actions; collecting good demonstration data is now a core job in robotics.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| RO-21 | `SHOW ME!` | People steer a robot by remote control to record examples, and the robot learns to copy them (imitation learning). | A robot at a table with a crumpled towel. A ghost hand lets you steer the robot's hand. | Drag the robot's hand through folding the towel. | After your demonstration, the robot folds a second towel by itself, copying your moves. | A shaky, wandering drag: the robot copies the shakes too, and folds the towel into a lumpy ball with a flourish. | Demonstrate on three different towels; it now folds a new one | Rabbit |
| RO-22 | `TELL THE BOT!` **[WEAK FIT]** | A vision-language-action model looks through the camera, takes an instruction, and turns both into movements. | A robot facing a messy table with a sock, a cup and a banana. A speech bubble above the robot is empty. Picture cards wait below. | Drag the cup picture into the speech bubble. | The robot's camera view highlights the cup, it reaches, and it places the cup on the shelf. | Dragging a blurry "that" card: the robot looks around, confused, and picks up the cat. | A cup it has never seen before (a new colour) | Fox |

---

## Shipping hardware (PCBs, design for manufacturing, BOM and unit cost, testing and certification, supply chain)

Source: the build stages follow Instrumental's "EVT DVT PVT" whitepaper (fetched): EVT (engineering validation test) picks the production-intent design (about 100 to 1,000 units); DVT (design validation test) checks yields with one production-worthy design on hard tooling (about 300 to 2,000 units); PVT (production validation test) checks yields at mass-production speed (about 1,000 to 20,000 units, all for sale), and a design change at PVT "is a major risk". YC's "Advice for Early-Stage Hardware Startups" (Iseman and Chang, 2015; fetched) says it is "at least a year from locked-down, working prototype to delivery to customers at any significant scale", that certifications "each cost at least a couple thousand bucks", and that hardware costs are "very spiky". Injection-moulding rules follow Fast Radius's design guide (fetched): 1.5 to 2 degrees of draft is "typically a safe minimum", walls should be even (generally 1.2 to 3 mm), thick ribs cause sink marks, and undercuts "prevent a part from being ejected from the mold with a single, unidirectional pull". PCB games follow the KiCad workflow (schematic, layout, design-rule check, then manufacturing files sent to a board house; not fetched).

### Unit 1: Printed circuit boards
Why it matters: every product moves from breadboard wires to a printed circuit board (PCB); board houses such as JLCPCB make and assemble small batches cheaply, so a first board is often ordered within weeks of the first prototype.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| SH-01 | `LAY COPPER!` | A PCB replaces loose wires with copper paths (traces) on a board; paths can't cross on one side, so they hop to the other side through small holes (vias). | A green board with a chip and a connector; their pins need joining in pairs, and two of the paths must cross. | Trace copper from each chip pin to its connector pin; where paths would cross, tap to drop a via. | Copper lines glow, one hops through a via to the back and back up, and the board lights when powered. | Crossing two traces on the same side: they touch, spark, and the board fizzles (a short). | A tighter board with more pins | Ant |
| SH-02 | `MATCH PADS!` | Each part needs pads (a footprint) that match its real legs, and it must be placed the right way round, using the dot that marks pin 1. | A chip with a dot in one corner above a pattern of pads on the board; a matching dot is printed on the board. | Rotate the chip and drop it so the dots line up. | Every leg lands on its pad, solder flows, and the board starts up. | Dropped turned round: the chip's power pin lands on ground, it glows and pops, and the owl's spectacles fog up. | A part whose legs don't match the pads at all | Owl |
| SH-03 | `FIX THE FLAGS!` | The board factory has minimum widths and gaps; a design-rule check flags the problems before you pay. | A board layout with three red flags where traces squeeze too close together. A "send to factory" button. | Tap each flag to widen the gap, then send. | The boards arrive clean and every one works. | Sending with flags up: the boards arrive with copper bridges between traces, and a stack of dead boards topples onto the beaver. | Flags hidden under a part: move it aside | Beaver |

### Unit 2: Design for manufacturing
Why it matters: parts made in large numbers are usually injection-moulded in steel moulds, which cost a lot and are slow to change; designing parts that come out of the mould cleanly saves money and months.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| SH-04 | `MASS PRODUCE!` | A steel mould costs a lot up front, but then each part costs very little and comes out in seconds; 3D printing has no up-front cost but is slow and costs more per part. | A truck waiting for a mountain of toy-car bodies. A 3D printer, and a steel mould with a tall coin stack (its price) beside it. | Mash to stamp parts out of the mould. | Parts pour out every few seconds, and the mould's tall coin stack spreads thinner and thinner across the growing mountain, until each part costs a crumb. | Printing them one by one: the printer is still on the fifth car when the truck honks and leaves. | A small order of ten: printing wins | Beaver |
| SH-05 | `POP OUT!` | Moulded parts need slightly slanted walls (draft) so they slide out of the mould. | A cup-shaped part inside a two-piece mould; its walls are dead straight. | Drag the walls to tilt them slightly, then pull the mould halves apart. | The part slides out cleanly with a pop. | Straight walls: the part grips the mould, scrapes as it's dragged out, and comes out scratched and bent. | A hook on the side catches the mould (an undercut): move it | Frog |
| SH-06 | `EVEN OUT!` | Thick spots cool slower than thin ones and sink into dents, so moulded walls should be the same thickness everywhere. | A moulded part with a thick lump at one end, cooling. | Scoop out the inside of the lump (drag), leaving walls as thick as the rest. | The part cools evenly and comes out smooth and flat. | Leaving the lump: it cools last, sinks into a dimple (a sink mark), and the part bends like a banana. | A thick rib that also sinks: make it thinner | Turtle |
| SH-07 | `CLICK SHUT!` | Fewer parts and fewer screws make a product faster and cheaper to put together; snap-fits can replace screws. | A factory line moving speaker shells past; the two halves are designed with snap hooks. A clock ticks over the line. | Press the halves together as each shell passes. | Click, click, click: every speaker is closed before it leaves your station. | A version with twelve screws per shell: the hedgehog screws frantically and shells pile up off the end of the belt. | A clip that must also come apart for repair | Hedgehog |

### Unit 3: The bill of materials and unit cost
Why it matters: the bill of materials (BOM: the list of every part and its price) sets what each unit costs to make, and a hardware startup's margin depends on it.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| SH-08 | `TRIM THE BOM!` | Every part adds cost, and swapping an expensive part for a cheaper one that does the same job leaves room for profit. | A gadget exploded into its parts, each with a coin stack. The total stack stands next to the price tag, with almost no gap. | Drag a costly part out and drop in a cheaper part that does the same job. | The total stack shrinks and a green gap (profit) opens below the price tag. | Swapping the battery for a cheap one that doesn't do the job: the stack shrinks, but a pile of returned, swollen gadgets lands on the doorstep. | A part that only one supplier makes | Fox |
| — | See SV-01 `UNPACK!` (CURRICULUM_business.md) | Each order must leave money after packing, shipping and fees, not just parts. | | | | | | |

### Unit 4: Building in stages, testing and certification
Why it matters: hardware is built in rounds (EVT, DVT, PVT), each larger and more expensive to change than the last, and every product must be tested in the factory and certified before it can be sold.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| SH-09 | `FIX IT EARLY!` | Hardware is built in rounds that get bigger and harder to change, so a flaw costs little to fix early and a fortune late. | A conveyor runs through three gates labelled EVT, DVT and PVT, each with a taller pile of units behind it. A crack appears in a speaker case. | Tap the crack as early as you can. | Fixed at the first gate, the fix costs one small coin and the later piles come out perfect. | Waiting until the last gate: the fix means scrapping a steel mould and a whole pallet of speakers, and a mountain of coins slides away. | Two flaws that appear at different gates | Owl |
| SH-10 | `SMASH TEST!` | Dropping and shaking prototypes on purpose finds weak spots before customers do. | A new gadget, a concrete floor, and a stepladder. | Mash to drop the gadget again and again from the ladder. | On the fifth drop a corner cracks, glowing red; the card shows the next version with a rounded, thicker corner that survives. | Shipping without testing: a customer drops it once and sends back a box of pieces. | A hot, humid chamber as well | Rabbit |
| SH-11 | `TEST EVERY ONE!` | Every unit off the line gets a quick test, because a few always come out bad. | A conveyor of finished gadgets passing a test bed with a red and green light. | Tap each gadget onto the test bed as it passes. | Good ones light green and roll on; a bad one lights red and drops into the bin. | Letting one slip past: a customer opens it, it's dead, and an angry one-star review flutters across the screen. | The belt speeds up | Ant |
| SH-12 | `PASS THE LAB!` | Anything with a radio must be tested so it doesn't disturb other devices (FCC in the US, CE in Europe), and a pre-certified radio module makes this much easier. | A gadget in a test chamber, a neighbour's TV beside it. A shiny pre-certified radio module lies on the bench. | Drag the module into the gadget. | The TV picture stays clear and a big "pass" stamp lands on the gadget. | Keeping the home-made radio: the neighbour's TV fills with snow and the stamp lands "fail". | A second country with its own rules | Duck |

### Unit 5: Supply chain and lead times
Why it matters: some parts take months to arrive, and a single missing part stops a production line; YC's advice puts at least a year between a working prototype and delivery at scale.

| ID | Command | Concept | Scene | Action | What happens | Funny fail | Level 2 | Host |
|---|---|---|---|---|---|---|---|---|
| SH-13 | `ORDER EARLY!` | Some parts take months to arrive (their lead time), so you order them long before you need them. | A calendar track running to launch day. A slow cargo ship carrying chips waits at a faraway port. | Tap to send the order while there is still time for the ship to arrive. | The ship crawls across the ocean and docks just before launch; the line starts on time. | Ordering late: launch day comes, the line is empty, and the workers play cards while the ship is still at sea. | A storm slows the ship | Turtle |
| SH-14 | `ADD A SUPPLIER!` | If only one supplier makes a part, one problem stops everything; a second supplier keeps the line running. | One road runs from a single parts factory to your production line. | Drag a second road from another factory to the line. | A flood closes the first factory, but parts keep arriving down the second road and the line hums on. | One road only: the flood closes it, the line stops and the beaver sits on an empty conveyor. | The second supplier's part is slightly different: check it fits | Beaver |
| SH-15 | `CAN THE NOISE!` **[TRIMMED]** | A metal cover (a shield can) over a noisy chip keeps its radio noise in. | A chip giving off visible fuzz that makes a nearby sensor jitter; a small metal lid on the bench. | Drag the lid over the chip. | The fuzz stays inside the lid and the sensor reads steadily. | Lid on the wrong chip: the fuzz keeps flowing and the sensor's reading dances. | Two noisy chips | Hedgehog |

---

## First ten games to build

| Order | Game | Why first |
|---|---|---|
| 1 | GE-01 `BUILD A BOT!` | Introduces the robot loop (eye, brain, wheel) that every later robot game reuses, with a funny, instant fail. |
| 2 | EB-01 `BLINK!` | The "hello world" of hardware; the backwards-LED fail is the first mistake every beginner makes. |
| 3 | EB-11 `DRIVE IT!` | The smoking pin shows why motor drivers exist, the most common first-robot mistake, in one drag. |
| 4 | MK-03 `TILT IT!` | The drooping T makes the 45-degree overhang rule obvious without a word; it is the rule 3D-printer users hit first. |
| 5 | MK-07 `ORIENT!` | Pancake layers splitting is a vivid picture of why printed parts are weak between layers. |
| 6 | RO-08 `SPOT LANDMARK!` | The ghost robot drifting into a plant pot explains odometry drift and correction together, and sets up the mapping games. |
| 7 | EB-08 `SPIN LIDAR!` | Dots splashing out to draw a room is beautiful and the glass-door bonk is a real lidar limitation. |
| 8 | RO-14 `E-STOP!` | Teaches the most important safety rule in robotics with one slam; the frozen-screen fail shows why software stop buttons are not enough. |
| 9 | SH-04 `MASS PRODUCE!` | Shows why startups switch from printing to moulding, with the coin stack spreading thin across the parts. |
| 10 | RO-21 `SHOW ME!` | Brings 2026 robot learning (teleoperation and imitation) into one drag, and the copied shakes show why data quality matters. |

Runners-up: EB-24 `JOIN THE BUS!` (I2C addresses) and SH-09 `FIX IT EARLY!` (the cost of late changes).

## Self-review

After the draft was complete, every row was checked against the owner's tests: the goal is obvious from the command and the first frame; the player does the key step with their own hands; one main picture changes; a satisfying success; a vivid fail that shows the idea; at most three words to read during play; no question, prediction or calculation.

- **Choices that could read as tests.** EB-05 `CHOOSE A BRAIN!`, MK-09 `BEAT THE HEAT!`, RO-02 `TAKE STAIRS!` and RO-16 `CLEAR THE BIN!` involve picking between objects. In each, the pick is part of reaching a goal shown in the first frame (light the room, keep the phone up, deliver the parcel, empty the bin), and the wrong pick fails in a way that shows the idea, as the format allows. EB-05 is the closest to a matching exercise and should be playtested first; if it reads as a test, cut it and move its idea to the card of EB-04 `NAP!`.
- **EB-06 `TURN SIDEWAYS!`.** Its first fail (dropping the phone) showed nothing about sensing; the fail is now the phone laid face-up flat, where the tiny weight sags into the table and the phone can't tell which way to show the film.
- **Commands checked for uniqueness.** Seventeen first-choice commands were already used in other files (for example `SPIN UP!`, `STEER!`, `SCAN!`, `BRIDGE!`, `REACH!`, `CLIMB!`, `RANDOMIZE!`, `DOCK!`, `SHIELD IT!`) and were renamed (`RUN THE FAN!`, `TURN THE BOT!`, `SPIN LIDAR!`, `SPAN THE GAP!`, `REACH OUT!`, `TAKE STAIRS!`, `SHAKE UP SIM!`, `HEAD HOME!`, `CAN THE NOISE!`). The final list was checked again against every backticked command in docs/science/ and docs/CURRICULUM.md; all are 15 characters or fewer.
- **Duplicated ideas.** Circuit basics, transistors, pull-ups, PWM, filtering and feedback control were already in CURRICULUM_earth_eng.md, so they appear as "See X" rows instead of new games.
- **Prose claims.** "Why it matters" lines avoid unbacked words such as "most"; where a line says something is common (for example power problems in early hardware), it is phrased as "many" or tied to a named source.

Rows to playtest more than rewrite: RO-22 `TELL THE BOT!` ([WEAK FIT]: an instruction is hard to show without words, and dragging a picture card is close to a matching exercise), RO-09 `BLEND SENSORS!` (a slider game that needs a clearly visible "right" blend), RO-11 `CLOSE THE LOOP!` (the map springing straight must be readable in under a second), and EB-25 `BRAKE FIRST!` (its fail is shown as a replay, because the player cannot give the radio priority by acting).

## Sources

**Startup practice and shipping hardware**
- Luke Iseman and Jeff Chang, "Advice for Early-Stage Hardware Startups", Y Combinator blog (2015-02-10; fetched): https://www.ycombinator.com/blog/advice-for-early-stage-hardware-startups/
- Instrumental, "EVT DVT PVT" whitepaper (2020; fetched; goals and typical quantities of each build stage): https://instrumental.com/wp-content/uploads/2020/10/EVT-DVT-PVT-Whitepaper.pdf
- Fast Radius, "How to make your injection molding designs production-ready" (2021-01-27; fetched; draft, wall thickness, sink marks, undercuts): https://fastradius.com/resources/injection-molding-designs-production-ready/
- Y Combinator, "YC for Hardware" and "Hardware AMA with YC Partner Eric Migicovsky" (titles seen in search results, not fetched): https://www.ycombinator.com/blog/yc-for-hardware and https://www.ycombinator.com/blog/hardware-ama-with-yc-partner-eric-migicovsky
- KiCad and JLCPCB workflow (schematic, layout, design-rule check, fabrication and assembly): standard practice, not fetched.

**Making things**
- Snapmaker, "The Ultimate Guide to the 45-Degree Rule in 3D Printing" (fetched): https://www.snapmaker.com/blog/45-degree-rule-3d-printing/
- GrabCAD, "3D Printing Design Guidelines" (title seen in search results, not fetched): https://workbench.grabcad.com/tutorials/3d-printing-design-guidelines

**Robotics**
- Kevin M. Lynch and Frank C. Park, *Modern Robotics: Mechanics, Planning, and Control*, Cambridge University Press, 2017; updated first edition 2019 (chapter list and Coursera course names fetched): https://hades.mech.northwestern.edu/index.php/Modern_Robotics
- Sebastian Thrun, Wolfram Burgard and Dieter Fox, *Probabilistic Robotics*, MIT Press, 2005 (not fetched; localisation, sensor fusion and SLAM).
- Kevin Black et al., "π0: A Vision-Language-Action Flow Model for General Robot Control", Physical Intelligence, arXiv 2410.24164 (v1 2024-10-31, v4 2026-01-08; RSS 2025; fetched): https://arxiv.org/abs/2410.24164
- ROS 2 documentation, "Basic concepts" (Jazzy; the page was blocked by a bot check and not fetched): https://docs.ros.org/en/jazzy/Concepts/Basic.html
- Robotics engineer job listings asking for ROS 2, Gazebo or Isaac Sim, and SLAM (seen in search results on embedded.jobs and aijobs.net, not fetched individually), for example: https://aijobs.net/job/KFNEjQ5pRjyGs3J/apply/

**Elementary**
- NGSS K-2-ETS1 and 3-5-ETS1 engineering-design standards (as already cited in CURRICULUM_earth_eng.md; not fetched again).
