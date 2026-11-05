# Heurēka!

Heurēka! is the second app in this repo, after Q.E.D.!. It covers "the everything else of STEM, plus business": physics, chemistry, biology and medicine, earth and space science, engineering, robotics and hardware, computer science and AI, business (personal finance, accounting, startups and venture capital, economics), and law, government and consulting. The name is the original Greek spelling of Archimedes' "I found it!".

Every microgame is a WarioWare moment: one shouted verb, one 3–6 second action toward a goal you can see, and the idea happening on screen because of what you did, with a funny fail that shows the same idea. There are no questions, no "predict, then watch" games, no multiple choice and no calculations. A card after the game explains the idea in plain English. The exact format is in `docs/HEUREKA_MICROGAMES.md`.

The curriculum, one file per subject, with every game as a table row (command, concept, scene, action, what happens, funny fail, level 2, host) and a source and a "Why it matters" line for every unit:
- CURRICULUM_physics.md
- CURRICULUM_chem_bio.md (chemistry, biology, medicine, and advanced courses on fire, plasma and extreme matter, materials chemistry, and the frontiers of biology and medicine)
- CURRICULUM_earth_eng.md (earth and space science, engineering)
- CURRICULUM_hardware.md (robotics, electronics, making things, shipping hardware)
- CURRICULUM_cs.md (computer science and AI, built around "you are the computer", with a coding-interview pilot that could grow into its own app)
- CURRICULUM_business.md
- CURRICULUM_law_policy.md (law, government and policy, consulting and structured problem solving)

BUILD_PLAN.md picks the order in which games are built, across all subjects: a few games per topic first, weighted toward the topics most useful for careers.

The app's code is in `heureka/` at the repo root; the shared engine is in `src/`.
