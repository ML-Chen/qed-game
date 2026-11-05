# Q.E.D.! microgame map against Khan Academy math, grade 3 to college

Compiled 2026-11-04. This file maps the units of Khan Academy (KA) math courses to proposed Q.E.D.! microgames.

## How to read this file

- **Unit names** come from Khan Academy's own course listings. The "Source" line under each course says exactly where each name was checked. KA's course pages are rendered by JavaScript, so the fetch tool could not read them directly. The main source is the Khan Academy blog post "Free Math Worksheets", which lists every course's units with links (published 2021-03-15, last modified 2025-03-19). Where KA's site shows newer titles than the blog (6th grade, 7th grade, Precalculus), the newer titles come from khanacademy.org search results, and each one is marked as verified or unverified.
- **One row is one microgame.** Columns:
  - **ID**: a stable reference used in the stage list at the end (G3 = 3rd grade, A1 = Algebra 1, C = AP Calculus AB, and so on).
  - **Command**: the real name of the operation, in capitals, 15 characters or fewer, ending in "!".
  - **Problem shown**: the one real problem on screen.
  - **Moves (valid orders)**: the 2 to 5 taps or drags. The cell says which orders are accepted.
  - **Animation**: what the player watches while the arithmetic happens.
  - **Host**: the animal that acts it out, when a natural one fits.
  - **Classic miss**: the common wrong move. When the player makes it, the game shows the consequence.
  - **Medium asks**: the result the player picks from 3 or 4 tiles in medium mode.
- **[PLANNED]** marks the 9 microgames already in the design. The brief says 8 but names 9; all 9 are mapped.
- **[WEAK FIT]** marks skills that do not fit "tap and drag parts of one problem" well, such as proofs, open-ended modelling and constructions. Each one names the closest playable version.
- **"See X"** means a skill repeats one taught in an earlier course. The earlier microgame is reused with harder numbers instead of a new one being added.

## Coverage summary

| Course | Content units mapped | New microgames | Unit-list source |
|---|---|---|---|
| 3rd grade | 14 | 28 | KA blog list |
| 4th grade | 14 | 24 | KA blog list |
| 5th grade | 16 | 20 | KA blog list |
| 6th grade | 11 | 26 | Current titles from khanacademy.org search results; 9 of 11 seen directly, 2 carried over from the blog |
| 7th grade | 8 | 19 | Current titles from khanacademy.org search results; 6 of 8 seen directly, 2 reconstructed (unverified) |
| 8th grade | 7 | 24 | KA blog list |
| Algebra 1 | 15 | 30 | KA blog list |
| High school geometry | 10 | 21 | KA blog list |
| Algebra 2 | 13 | 25 | KA blog list |
| Trigonometry | 4 | 8 | KA blog list |
| Precalculus | 10 | 25 | KA blog list (9) plus "Limits and continuity" seen in search results; may be out of date |
| Statistics and probability (also covers AP/College Statistics) | 16 | 25 | KA blog list |
| AP/College Calculus AB (also covers Calculus 1) | 8 | 32 | KA blog list |
| AP/College Calculus BC additions (also covers Calculus 2) | 2 | 13 | KA blog list |
| Multivariable calculus | 5 | 18 | KA blog list |
| Differential equations | 3 | 8 | KA blog list |
| Linear algebra | 3 | 14 | KA blog list |
| Beyond Khan Academy | — | 33 | Not from KA |
| **Total** | **159** | **393** | |

The tables contain 397 microgame rows. 393 of them are new microgames. The other 4 (G4-03, G5-02, G6-23, G7-07) are harder levels of a microgame from an earlier grade. Rows whose ID cell is "—" are cross-references only and are not counted. 16 rows are marked [WEAK FIT] or [partly WEAK FIT], and each names its closest playable version.

Every content unit in the courses above has at least one microgame or cross-reference. Units that only hold exam practice or standards mappings (the AP solved-exam units, AP exam prep, "Standards mappings") are not mapped, because they repeat other units' skills.


---

## 3rd grade (Khan Academy: "3rd grade", /math/cc-third-grade-math)

Source: KA blog "Free Math Worksheets" (14 units, same order as the course).

### Unit 1: Intro to multiplication
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G3-01 | `ARRAY!` | 3 × 4 = ? | Drag 3 onto the empty pond, which makes 3 rows. Drag 4 onto the rows, and each row fills with 4 ducks. Tap the array to count it. The factors can go in either order; the array is the same rotated. | Ducklings waddle into rows; numbers 4, 8, 12 pop over each finished row. | Ducklings | Dragging 4 onto 3 glues the digits into "34"; the digits bounce apart. | Pick 12 from {7, 12, 34, 10} |
| G3-02 | `SKIP COUNT!` | 5 × 6 = ? on a number line | Drag 5 onto the kangaroo to set the hop length. Tap 6 to make it hop 6 times. Swapping the roles (hop 6, five times) is also accepted. | Kangaroo hops 0 → 5 → 10 … → 30, leaving arcs. | Kangaroo | Hops of length 1 (counting on); the kangaroo lands at 6. | Pick the landing spot 30 |

### Unit 2: 1-digit multiplication
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G3-03 | `BREAK APART!` | 7 × 8 = ? | Drag the splitter across 8, making 5 + 3. Tap 7 × 5 and 7 × 3, in either order. Drag the two products together to add them. | A beaver saws the 7 × 8 array into a 7 × 5 block and a 7 × 3 block; 35 and 21 slide together into 56. | Beaver | Multiplying only one part: 7 × 5 + 3 = 38. The leftover strip stays unshaded. | Pick 35, then 21, then 56 |
| G3-04 | `COMMUTATIVE!` | 9 × 3 = 3 × ? | Drag the corner handle of the 9 × 3 array to rotate it 90°. Drag the new row count into the blank. | The array turns on its corner; the count stays 27 the whole time. | Ducklings | Writing 9 in the blank but using the wrong side; the rotated array does not match. | Pick 9 |

### Unit 3: Addition, subtraction, and estimation
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G3-05 | `ROUND!` | Round 347 to the nearest ten | Tap the tens digit to mark the rounding place. Tap the ones digit to look next door. Drag 347 onto the number line between 340 and 350. | 347 rolls downhill to the closer ten, 350. | Hedgehog (rolls) | Rounding to 300 (wrong place) or rounding 5 down. | Pick 350 |
| G3-06 | `REGROUP!` **[PLANNED]** | 358 + 276 in columns | Drag the ones column down (8 + 6 = 14). Drag the tens column down (5 + 7 + 1 = 13). Drag the hundreds column down (3 + 2 + 1 = 6). Easy mode requires right to left. A "partial sums" variant accepts any column order and adds the partial sums at the end. | 14 ones snap into one ten-rod; an ant carries it to the top of the tens column. The same happens for tens to hundreds. | Ants | Writing 14 under the ones column (no regroup). The answer becomes "5 12 14" and the extra digits spark. | Pick each column's digit from tiles |
| G3-07 | `BORROW!` | 503 − 168 | Drag a hundred onto the empty tens place; it breaks into 10 tens. Drag a ten onto the ones; it breaks into 10 ones. Drag each column down, right to left. "REGROUP!" is an accepted alternate name for the same move. | A hundred-flat cracks into 10 rods, and a rod cracks into 10 cubes; a pelican scoops the cubes being taken away. | Pelican | Subtracting the smaller digit from the larger in every column (8 − 3 = 5). | Pick each column digit |
| G3-08 | `ESTIMATE!` | 489 + 312 ≈ ? | Tap 489 to round it to 500. Tap 312 to round it to 300. Either order works. Drag them together to get 800, then tap to reveal the exact sum 801. | Both numbers slide to the nearest hundred on a line; the estimate and exact markers land side by side. | Hedgehog | Rounding 489 to 400. | Pick 800 |

### Unit 4: Intro to division
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G3-09 | `SHARE!` | 12 ÷ 3 = ? | Drag 12 acorns onto the ÷ sign. Drag 3 to spawn 3 nests. Tap "deal" until the pile is empty. Making groups of 3 (4 groups) is also accepted, because it is the other meaning of division. | Squirrels deal acorns round-robin into nests; each nest ends with 4. | Squirrels | Subtracting (12 − 3 = 9). The nests overflow. | Pick 4 |
| G3-10 | `FACT FAMILY!` | 4 × 6 = 24, so 24 ÷ 6 = ? | Drag 24 to the front. Drag the × onto the 24, and it flips into ÷. Drag 6 into the divisor slot. | The equation rotates like a wheel through all 4 family members. | Squirrels | Writing 6 ÷ 24. | Pick 4 |

### Unit 5: Understand fractions
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G3-11 | `PARTITION!` | Show 3/4 | Drag the denominator 4 onto the pizza; it cuts into 4 equal slices. Unequal cuts snap to equal ones. Drag the numerator 3 onto the pizza to shade 3 slices. The denominator must go first. | Knife sweeps; slices shade one by one. | Mouse | Dragging 3 onto the pizza first, which cuts it into 3 slices. | Pick the correct picture |
| G3-12 | `NUMBER LINE!` | Place 2/3 | Drag 3 onto the 0–1 segment; it splits into 3 hops. Drag 2 onto the frog, which hops twice. | Frog hops along the thirds. | Frog | Placing the point at 2, or splitting the segment into 2. | Pick the point |

### Unit 6: Equivalent fractions and comparing fractions
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G3-13 | `EQUIVALENT!` | 1/2 = ?/4 | Drag ×2 onto the fraction bar of 1/2. Each slice splits into 2, so the top and bottom both double. | The bar's pieces split; the shaded amount stays the same. | Mouse | Doubling only the bottom (1/4); the shaded area visibly shrinks. | Pick 2/4 |
| G3-14 | `COMPARE!` | 3/8 ○ 3/4 | Drag each fraction onto the bar stack, in either order. Drag the alligator mouth toward the bigger one. | Bars line up; the eighths are visibly smaller pieces. | Alligator | Choosing 3/8 because 8 > 4. | Pick > or < |

### Unit 7: More with multiplication and division
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G3-15 | `TIMES TEN!` | 4 × 70 = ? | Tap 70 to split it into 7 × 10. Tap 4 × 7 to get 28. Drag × 10 onto 28. The associative alternative is accepted: 4 × 10 first, then × 7. | Digits slide one place left on a place-value mat and a 0 rolls into the ones. | Octopus | 4 × 70 = 28 (dropping the ten). | Pick 280 |
| G3-16 | `ASSOCIATIVE!` | 2 × 5 × 7 = ? | Drag parentheses around any pair. Tap to compute it. Tap again for the rest. All three pairings are valid. | Boxes of boxes: 2 boxes of 5 rows of 7. | Octopus | Adding instead of multiplying. | Pick 10, then 70 |

### Unit 8: Arithmetic patterns and problem solving
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G3-17 | `TWO-STEP!` | 3 × 4 − 5 = ? (3 bags of 4 apples, 5 eaten) | Tap 3 × 4 first, which makes 12. Then tap 12 − 5. Only this order is accepted (order of operations). | Bags burst into 12 apples; a goat eats 5. | Goat | Computing 4 − 5 first. | Pick 12, then 7 |
| G3-18 | `PATTERN!` | Multiplication-table row: 4, 8, 12, ?, 20 | Tap any two neighbouring entries to show the +4 hop. Drag the "+4" rule onto the blank. | Hop arcs appear between table cells. | Kangaroo | Using +3 or ×2 (8 → 16). | Pick 16 |

### Unit 9: Quadrilaterals
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G3-19 | `CLASSIFY!` **[WEAK FIT]** | Which group does this shape belong in? | Closest playable version: tap each side to measure it and each corner to test for a right angle (any order), then drag the shape through property gates into a Venn diagram (rhombus / rectangle / square). | Gates light up for each property the shape passes. | Bee (hexagons) | Putting a square outside "rectangle". | Pick the region |

### Unit 10: Area
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G3-20 | `AREA!` | Area of a 6 × 4 rectangle | Drag side label 6 onto side 4, or 4 onto 6. Tap to count. | Unit tiles sweep in row by row until the rectangle is full (24). | Beaver (tiler) | Adding the sides (10). Only the border lights up, showing perimeter instead. | Pick 24 square units |
| G3-21 | `DECOMPOSE!` | Area of an L-shape | Drag a cut line to make two rectangles (horizontal or vertical cut, both valid). Tap each rectangle to compute its area, in either order. Drag the two areas together. | The L splits and each piece fills with tiles. | Beaver | Multiplying the two outer lengths as if it were one rectangle. | Pick each area and the total |

### Unit 11: Perimeter
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G3-22 | `PERIMETER!` | Perimeter of a 5 × 3 rectangle | Tap each side in any order; or drag "2 ×" onto a pair of equal sides. | An ant walks each side while an odometer adds. | Ant | Multiplying 5 × 3. | Pick 16 |
| G3-23 | `MISSING SIDE!` | Perimeter 20; sides 6, 4, 6, ? | Drag each known side onto 20 to subtract it, in any order. | The fence shortens as each known side is subtracted. | Ant | Adding the known sides and stopping (16). | Pick 4 |

### Unit 12: Time
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G3-24 | `ELAPSED TIME!` | 2:45 to 4:10 | Drag the minute hand to 3:00 (+15 min). Drag the hour hand to 4:00 (+1 h). Drag the minute hand to 4:10 (+10 min). Tap to total the jumps. Jumping the hour first and then the minutes is also accepted. | Jumps appear on a timeline: 15 min, 1 h, 10 min. | Rooster | Subtracting the times as decimal numbers (4.10 − 2.45). | Pick 1 h 25 min |

### Unit 13: Measurement
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G3-25 | `MEASURE!` | How long is the pencil, to the nearest ¼ inch? | Drag the ruler's 0 onto the pencil's end. Tap the mark at the pencil's tip. | The ruler snaps into place and the quarter-inch ticks flash. | Inchworm | Starting the ruler at 1. | Pick 3¼ in |
| G3-26 | `MASS!` | 450 g + 300 g of flour; how much in all? | Drag gram weights onto the balance pan, in any order, until it is level. | The balance tips and then levels. | Elephant (balance) | Lining 300 up under the wrong digits (480). | Pick 750 g |

### Unit 14: Represent and interpret data
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G3-27 | `PICTOGRAPH!` | A picture graph where 1 icon = 2 animals; how many more cats than dogs? | Drag the key onto each row, in any order. Each icon doubles. Drag one row onto the other to find the difference. | Icons split into pairs; a bracket shows the difference. | Cats and dogs | Counting each icon as 1. | Pick the difference |
| G3-28 | `BAR GRAPH!` | Make a bar graph from a tally table | Drag each count onto its bar, in any order. | Bars grow to their heights. | Meerkats (stand tall) | Reading the scale as 1 per line when it is 2. | Pick the bar height |

---

## 4th grade (KA: "4th grade", /math/cc-fourth-grade-math)

Source: KA blog "Free Math Worksheets" (14 units).

### Unit 1: Place value
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G4-01 | `EXPAND!` | 4,072 = ? + ? + ? | Tap each digit in any order. It slides out as its place value: 4,000, 70, 2. The 0 shows that nothing is in the hundreds. | Digits drop off the place-value mat, carrying trailing zeros. | Squirrel | 4 + 0 + 7 + 2. | Pick 70 for the 7 |
| G4-02 | `COMPARE!` | 45,302 ○ 45,230 | Tap matching places from left to right until two digits differ. Left to right is the only accepted order. | The two numbers stack; columns grey out while they match. | Alligator | Comparing the ones first. | Pick > |
| G4-03 | `ROUND!` | Round 6,503 to the nearest thousand | See G3-05, with a larger place. | | | | |

### Unit 2: Addition, subtraction, and estimation
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G4-04 | `REGROUP!` **[PLANNED, harder level]** | 3,486 + 2,757 | Same as G3-06, with 4 columns and 3 carries. | The ant carries each ten. | Ants | No carry. | Pick digits |
| G4-05 | `BORROW!` | 5,000 − 1,234 (borrowing across zeros) | Drag a thousand onto the hundreds, a hundred onto the tens, and a ten onto the ones (this chain is the only order). Then drag each column down. | A thousand-cube cracks down the chain. | Pelican | Subtracting the smaller digit from the larger in each column (4,234). | Pick digits |

### Unit 3: Multiply by 1-digit numbers
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G4-06 | `AREA MODEL!` | 7 × 346 | Drag 346 onto the box; it splits into 300 \| 40 \| 6. Drag 7 onto each part, in any order (2,100, 280, 42). Drag the parts together to add them. | The rectangle splits into three panels that fill with colour. | Beaver | Computing 7 × 3 = 21 and dropping the place value. | Pick each partial product |
| G4-07 | `STANDARD ALGO!` | 6 × 238 | Drag 6 onto 8 (48; the ant carries 4). Drag 6 onto 3 (18 + 4 = 22; carry 2). Drag 6 onto 2 (12 + 2 = 14). Right to left only. | Carry digits float above the next column. | Ants | Forgetting to add the carry. | Pick each digit |

### Unit 4: Multiply by 2-digit numbers
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G4-08 | `AREA MODEL!` | 23 × 47 | Drag the splitters on both factors to make a 2 × 2 grid. Tap each cell in any order (800, 140, 120, 21). Drag the cells together to add them. | The grid fills one cell at a time; the cells pour into the total, 1,081. | Beaver | Multiplying only matching places (20 × 40 + 3 × 7 = 821). The two empty cells flash. | Pick each cell |

### Unit 5: Division
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G4-09 | `REMAINDER!` | 17 ÷ 5 | Drag 17 onto the ÷ sign. Drag 5 to make 5 nests. Tap "deal". | 2 acorns that cannot be shared fairly drop into an "R" bucket. | Squirrels | Leaving a remainder of 5 or more. | Pick 3 R 2 |
| G4-10 | `CHUNKING!` | 156 ÷ 6 (partial quotients; "chunking" is the UK name) | Drag a "×10" chunk (60) under 156, leaving 96. Drag another (60), leaving 36. Drag a "×6" chunk (36), leaving 0. Tap to add the chunk counts: 26. Any chunk sizes are accepted as long as none is bigger than what is left. | An anteater eats each chunk; the tally of chunks grows. | Anteater | Taking a chunk bigger than what is left. | Pick the quotient |

### Unit 6: Factors, multiples and patterns
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G4-11 | `FACTOR PAIRS!` | Find all factor pairs of 24 | Drag divisor tiles 1–6 onto 24, in any order. | The 24 tiles rearrange into a rectangle when the divisor works; leftovers stick out when it does not. | Ducklings | Including 5 (leftover). | Pick the next pair |
| G4-12 | `PRIME OR NOT!` | Is 21 prime? | Try to arrange 21 tiles into rectangles by dragging divisors onto it. A rectangle with no row of 1 means it is composite. | 21 forms a 3 × 7 rectangle. | Ducklings | Calling 21 prime because it is odd. | Pick prime or composite |

### Unit 7: Equivalent fractions and comparing fractions
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G4-13 | `COMMON DENOM!` | 2/3 ○ 3/5 | Drag ×5/5 onto 2/3, making 10/15. Drag ×3/3 onto 3/5, making 9/15. Either order. Then compare. | Both bars re-cut into fifteenths. | Mouse | Multiplying only the denominators. | Pick > |
| G4-14 | `SIMPLIFY!` | 6/8 | Drag ÷2 onto the top and the bottom. | Pairs of pieces merge into bigger pieces. | Mouse | Dividing only the top. | Pick 3/4 |

### Unit 8: Add and subtract fractions
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G4-15 | `ADD FRACTIONS!` | 2/7 + 3/7 | Drag one fraction onto the other. | Pieces slide into one bar; the denominator stays 7. | Mouse | Adding the bottoms too (5/14). The pieces visibly shrink to the wrong size. | Pick 5/7 |
| G4-16 | `MIXED NUMBER!` | 2¼ − 1¾ | Drag one whole from the 2; it breaks into 4/4, making 1 5/4. Then drag the parts down to subtract. | A whole pie cracks into quarters. | Mouse | Computing ¾ − ¼ instead (subtracting backwards). | Pick 2/4 = 1/2 |

### Unit 9: Multiply fractions
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G4-17 | `MULTIPLY!` | 3 × 2/5 | Drag 3 onto 2/5. | Three copies of the 2/5 bar line up end to end, making 6/5. | Mouse | 6/15 (multiplying the denominator by 3 too). | Pick 6/5 |

### Unit 10: Understand decimals
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G4-18 | `DECIMAL!` | 7/100 = ? | Drag the fraction into the place-value chart; the 7 slides to the hundredths. | The hundredths grid shades 7 squares. | Ladybug | 0.7. | Pick 0.07 |
| G4-19 | `COMPARE!` | 0.5 ○ 0.45 | Drag each decimal onto its own hundredths grid, in either order. | 50 squares shade next to 45. | Alligator | Choosing 0.45 because 45 > 5. | Pick > |

### Unit 11: Plane figures
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G4-20 | `SYMMETRY!` | Draw every line of symmetry of a rectangle | Drag a fold line onto the shape; it folds. Correct lines stick. | The shape folds along the line, and either the halves match or a gap shows. | Butterfly | Folding along a diagonal. | Pick the number of lines |
| G4-21 | `CLASSIFY!` **[WEAK FIT]** | Classify a triangle by sides and angles | Closest playable version: tap each angle to measure it and each side to compare it, then drag the triangle into the right bin. | Property badges stick to the triangle. | Bee | Calling an obtuse triangle acute. | Pick the name |

### Unit 12: Measuring angles
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G4-22 | `PROTRACTOR!` | Measure the angle | Drag the protractor's centre onto the vertex. Rotate it so the baseline lies on one ray. Tap the scale at the other ray. | A needle sweeps from 0 to the second ray. | Owl (head turns) | Reading the wrong scale (130° instead of 50°). | Pick 50° |
| G4-23 | `ADD ANGLES!` | A right angle is split into 35° and ? | Drag 90 onto 35 to subtract. | The wedges recombine into the right-angle square. | Owl | Adding (125°). | Pick 55° |

### Unit 13: Area and perimeter
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G4-24 | `MISSING SIDE!` | Area 48, width 6; find the length | Drag 48 onto 6 to divide. | 48 tiles regroup into rows of 6. | Beaver | 48 − 6 = 42. | Pick 8 |

### Unit 14: Units of measurement
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G4-25 | `CONVERT!` | 3 ft = ? in | Drag "×12 in per ft" onto 3. | Each foot-stick bursts into 12 inch-cubes. | Inchworm | Dividing (3 ÷ 12). | Pick 36 |

---

## 5th grade (KA: "5th grade", /math/cc-fifth-grade-math)

Source: KA blog "Free Math Worksheets" (16 units).

### Unit 1: Decimal place value
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-01 | `EXPAND!` | 2.305 = ? | Tap each digit, in any order, to slide it out as 2, 3/10, 5/1000. | Digits drop off a place-value mat that has decimal places. | Squirrel | 5/100 for the 5. | Pick the value of the 5 |
| G5-02 | `ROUND!` | Round 3.476 to the hundredths | See G3-05, on a decimal number line. | | | | |

### Unit 2: Add decimals
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-03 | `ALIGN DECIMALS!` | 4.7 + 2.35 | Drag 2.35 under 4.7; it snaps by the decimal point. A placeholder 0 appears (4.70). Then drag each column down, right to left, with carries. | The decimal points lock together like magnets. | Ants | Aligning the right-hand digits (4.7 + 2.35 = 2.82). | Pick column digits |

### Unit 3: Subtract decimals
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-04 | `BORROW!` | 6 − 2.48 | Drag the decimal point into place; it creates 6.00. Then borrow across the zeros as in G4-05. | Placeholder zeros fade in. | Pelican | Subtracting only the whole numbers (4.48). | Pick digits |

### Unit 4: Add and subtract fractions
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-05 | `COMMON DENOM!` | 1/3 + 1/4 | Drag 1/3 onto 1/4. The common denominator 12 appears. Tap each fraction, in either order, to re-cut it into twelfths (4/12, 3/12). Drag them together. | Both bars re-cut into twelfths and merge. | Mouse | Adding tops and bottoms (2/7). | Pick 7/12 |

### Unit 5: Multi-digit multiplication and division
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-06 | `LONG MULTIPLY!` **[PLANNED]** | 47 × 36 | Drag 6 onto 7 (42, carry 4) and onto 4 (24 + 4 = 28), giving 282. Drag 3 (a ten) down; a placeholder 0 slides in first, then 3 × 7 = 21 (carry 2) and 3 × 4 = 12 + 2 = 14, giving 1,410. Drag the two partial rows together and add with regrouping: 1,692. Ones digit first is conventional. Doing the tens row first is also accepted, because partial products can be made in any order. | An ant carries each carry. The 0 "placeholder pebble" rolls into place before the second row. | Ants | Forgetting the placeholder 0 (282 + 141 = 423). The rows misalign and sparks fly. | Pick each partial row, then 1,692 |
| G5-07 | `LONG DIVISION!` | 552 ÷ 24 | Fixed cycle: divide (drag 24 under 55, giving 2), multiply-subtract (tap; 55 − 48 = 7), bring down (drag the 2 down, making 72), divide again (3). | Each digit of the dividend gets eaten in turn; the remainder slides down to meet the next digit. | Anteater | Skipping "bring down" or a 0 in the quotient. | Pick each quotient digit |

### Unit 6: Multiply fractions
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-08 | `MULTIPLY!` | 2/3 × 3/4 | Drag 2/3 onto the 3/4 bar. Vertical cuts in thirds cross the horizontal fourths; the overlap is 6/12. Tap to simplify to 1/2. Alternative order: drag one 3 onto the other to cancel first (cross-cancelling), then multiply. | The overlap region glows double-shaded. | Mouse | Cross-multiplying (8/9) or adding. | Pick 6/12, then 1/2 |
| G5-09 | `SCALING!` | Is 3/4 × 12 more or less than 12? | Drag 3/4 onto the 12 bar. | The bar shrinks to 9; the "less" side lights up. | Ladybug | Thinking that multiplying always makes a number bigger. | Pick "less" |

### Unit 7: Divide fractions
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-10 | `DIVIDE!` | 3 ÷ 1/4 | Drag the 1/4 piece onto 3 wholes. Tap to count how many fit. | Quarter pieces tile the 3 bars: 12. | Mouse | Answering 3/4. | Pick 12 |

### Unit 8: Multiply decimals
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-11 | `DECIMAL PLACES!` | 2.4 × 0.3 | Tap 24 × 3 (ignoring the points) to get 72. Drag both decimal points down to the answer: 1 hop plus 1 hop, so 2 places. Either point first. | The points hop leftward through the digits of 72, giving 0.72. | Frog | 7.2 (counting only one point). | Pick 0.72 |

### Unit 9: Divide decimals
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-12 | `SHIFT POINT!` | 4.5 ÷ 0.15 | Drag the divisor's point 2 places right. The dividend's point is forced to follow 2 places (×100 on both). Tap 450 ÷ 15. | Both points hop together; "×100" stamps on both numbers. | Frog | Moving only the divisor's point. | Pick 30 |

### Unit 10: Powers of ten
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-13 | `POWER OF TEN!` | 3.6 × 10³ | Drag 10³ onto 3.6. | The digits slide 3 places left on a place-value mat and zeros fill in behind (3,600). | Octopus | Adding 3 zeros to the end (3.6000). | Pick 3,600 |

### Unit 11: Volume
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-14 | `VOLUME!` | 4 × 3 × 2 box | Drag 4 onto 3 to make a base layer of 12 cubes. Drag 2 to stack 2 layers. Any order of the three dimensions. | Sugar cubes fill the base, then the layers stack. | Hamster | Adding the dimensions (9). | Pick 24 cubic units |
| G5-15 | `ADD VOLUMES!` | Volume of two joined boxes | Drag a cut to separate the boxes. Compute each with VOLUME! in either order. Drag them together. | The shape splits apart, then rejoins. | Hamster | Counting the overlap twice. | Pick the total |

### Unit 12: Coordinate plane
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-16 | `PLOT!` | Plot (3, 5) | Drag 3 onto the x-axis; the ladybug walks right. Drag 5 onto the y-axis; it climbs. Easy mode accepts either order as long as each number goes to the correct axis. | The ladybug leaves footprints along the grid. | Ladybug | Plotting (5, 3). | Pick the point |

### Unit 13: Algebraic thinking
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-17 | `ORDER OF OPS!` | 3 × (4 + 2) − 5 | Tap the parentheses, then the ×, then the −. This order is forced. | Brackets glow and collapse into one number; then the next operation glows. | Owl | Computing 3 × 4 first. | Pick each result |
| G5-18 | `PATTERN!` | Rule "+3" and rule "+6" from 0; pair up the terms | Drag each rule onto its row, in either order. Drag the pairs onto the grid. | The points line up on a straight line through the origin. | Kangaroo | Pairing terms with different positions. | Pick the next pair |

### Unit 14: Converting units of measure
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-19 | `CONVERT!` | 2.5 km = ? m | Drag ×1,000 onto 2.5. | The digits slide 3 places left (2,500). | Inchworm | Dividing by 1,000. | Pick 2,500 |

### Unit 15: Line plots
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-20 | `LINE PLOT!` | Plot the amounts 1/4, 1/2, 1/2, 3/8, … then share the water equally | Drag each measurement onto its tick, in any order. Then drag all of them into one beaker and drag the count onto it to share equally. | X marks stack up; the beaker pours into equal cups. | Camel | Placing 3/8 between 1/2 and 3/4. | Pick the equal share |

### Unit 16: Properties of shapes
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G5-21 | `CLASSIFY!` **[WEAK FIT]** | Quadrilateral hierarchy | Closest playable version: G3-19 with a hierarchy tree instead of a Venn diagram. | | Bee | Saying a square is not a rhombus. | Pick the branch |

---

## 6th grade (KA: "6th grade", /math/cc-sixth-grade-math)

Source: the blog lists an older 8-unit version of this course. KA's site now shows renamed and added units. The titles below were checked against khanacademy.org search results: "Ratios", "Arithmetic with rational numbers", "Rates and percentages", "Exponents and order of operations", "Equations & inequalities" (unit-test title), "Plane figures" (unit slug), "Coordinate plane", "3D figures" (quiz title) and "Data and statistics". "Negative numbers" and "Variables & expressions" come from the blog and their unit slugs are unchanged. The unit order shown is a best reconstruction and was not verified. The blog's old unit "Properties of numbers" no longer appeared in search results under its own title.

### Ratios
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G6-01 | `RATIO TABLE!` | 3 : 5 = ? : 20 | Drag ×4 onto the 5. The 3 is forced to take ×4 too, because both rows scale. | The ratio table grows a column; paired icons multiply together. | Penguins (pairs) | Adding 15 to both terms (18 : 20). | Pick 12 |

### Arithmetic with rational numbers
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G6-02 | `RECIPROCAL!` | 3/4 ÷ 2/5 | Drag the ÷ onto 2/5; the fraction flips to 5/2 and ÷ becomes ×. Then multiply. Cancelling may come before or after. | The fraction cartwheels upside down. | Bat (hangs upside down) | Flipping the first fraction. | Pick 15/8 |
| G6-03 | `LONG DIVISION!` | 7 ÷ 8 = 0.875 | As G5-07, but drag zeros down after the decimal point. | Zeros drop like pebbles behind the point. | Anteater | Stopping at a remainder of 7. | Pick each digit |

### Rates and percentages
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G6-04 | `UNIT RATE!` | $12 for 4 apples; how much for 1? | Drag 4 onto 12; both are divided by 4. | 4 apples shrink to 1 as the price shrinks. | Cheetah (speed) | 4/12. | Pick $3 |
| G6-05 | `PERCENT!` | 30% of 80 | Drag 80 onto the 100-square grid; each square becomes 0.8. Tap 30 squares. Alternative order: drag 10% (8), then ×3. | The grid squares shade one row at a time. | Bees (100-cell comb) | 80 ÷ 30. | Pick 24 |

### Exponents and order of operations
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G6-06 | `EXPONENT!` | 2⁵ | Drag the exponent onto the base; it copies the base 5 times with × signs. Tap to fold the product up. | 2 → 4 → 8 → 16 → 32 as the copies fold. | Rabbits | 2 × 5 = 10. | Pick 32 |
| G6-07 | `ORDER OF OPS!` | 2 + 3² × 4 | Tap the exponent, then the ×, then the +. This order is forced. | Each operation glows in turn. | Owl | Computing 2 + 3 first. | Pick 38 |

### Negative numbers
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G6-08 | `ABSOLUTE VALUE!` | \|−7\| | Drag −7 onto the bars. | A frog hops back to 0 counting 7 hops. | Frog | −7. | Pick 7 |
| G6-09 | `COMPARE!` | −3 ○ −8 | Drag each number onto the number line, in either order. | The point further right glows. | Alligator | Choosing −8 because 8 > 3. | Pick > |

### Variables & expressions
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G6-10 | `SUBSTITUTE!` | 3x + 2 when x = 4 | Drag 4 onto x; the x pops out and 4 drops in with a visible ×. Tap 3 × 4, then tap the +. | The x is a box; the 4 jumps inside it. | Kangaroo (pouch) | 34 + 2 (concatenation). | Pick 14 |
| G6-11 | `LIKE TERMS!` | 3x + 5 + 2x | Drag 2x onto 3x to make 5x. Dragging 5 onto an x-term bounces off. | Two x-blocks snap together; the constant repels them. | Magpie (sorting) | 10x. | Pick 5x + 5 |
| G6-12 | `DISTRIBUTE!` | 4(x + 3) | Drag 4 onto x and onto 3, in either order. | The 4 splits into two copies that fly into the parentheses. | Octopus | 4x + 3. | Pick 4x + 12 |
| G6-13 | `FACTOR OUT!` | 12x + 18 | Tap the GCF 6. Drag it out front. | The 6 lifts out of both terms, leaving 6(2x + 3). | Octopus | Pulling out 3 or 2 (not the greatest factor). | Pick 6 |

### Equations & inequalities
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G6-14 | `INVERSE OP!` | x + 7 = 15 | Drag +7 across the = sign; it becomes −7. Tap 15 − 7. | A seesaw re-levels as the 7 leaves both sides. | Elephant (seesaw) | Carrying +7 across unchanged (22). | Pick 8 |
| G6-15 | `DIVIDE BOTH!` | 4x = 28 | Drag 4 across the = sign; it becomes ÷4. | 28 tiles split into 4 equal piles. | Elephant | 28 − 4 = 24. | Pick 7 |
| G6-16 | `INEQUALITY!` | Graph x > 3 | Drag 3 onto the number line to place an open circle. Drag the arrow toward the larger numbers. | The circle drops in hollow; the ray shoots right. | Frog | Using a closed circle. | Pick the graph |

### Plane figures
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G6-17 | `PARALLELOGRAM!` | Area: base 8, height 5, slant side 6 | Drag the triangular end across to the other side; the shape becomes a rectangle. Drag the base onto the height. | The cut-and-slide animation, then tiles fill. | Beaver | Using the slant side (8 × 6). | Pick 40 |
| G6-18 | `TRIANGLE AREA!` | Base 10, height 6 | Drag a rotated copy of the triangle onto it to make a parallelogram. Tap ÷2. | The copy spins into place, then fades away. | Beaver | Forgetting ÷2 (60). | Pick 30 |
| G6-19 | `TRAPEZOID!` | Bases 4 and 10, height 5 | Drag a rotated copy onto the trapezoid to make a parallelogram with base 14. Tap ÷2. Or drag the two bases together to average them first. | The copy spins in. | Beaver | (4 + 10) × 5 without halving. | Pick 35 |

### Coordinate plane
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G6-20 | `REFLECT!` | Reflect (3, −2) across the x-axis | Drag the point over the axis. | The y-sign flips as the point passes through a mirror. | Penguin (ice mirror) | Flipping x instead. | Pick (3, 2) |
| G6-21 | `DISTANCE!` | (−2, 5) to (−2, −3) | Drag one point onto the other along the grid line. | Hop counting crosses 0: 5 + 3. | Frog | 5 − 3 = 2. | Pick 8 |

### 3D figures
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G6-22 | `SURFACE AREA!` | 3 × 4 × 5 box | Drag the box to unfold it into a net. Tap each face, in any order (or tap a pair to double it). Drag all the faces together. | The box unfolds flat; each face fills with tiles. | Hamster | Computing the volume (60). | Pick 94 |
| G6-23 | `VOLUME!` | ½ × ¾ × 2 box | See G5-14, with fractional cubes. | | | | |

### Data and statistics
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G6-24 | `MEAN!` | Mean of 4, 8, 6, 2 | Drag all the stacks into one pile (20). Drag the count 4 onto the pile; it shares into 4 equal stacks. Alternative: drag blocks from tall stacks to short ones until all are level. | The stacks level out. | Squirrels (sharing nuts) | Dividing by the wrong count. | Pick 5 |
| G6-25 | `MEDIAN!` | Median of 7, 2, 9, 4, 5 | Tap SORT. Then tap the two ends to remove them, in any order, until one value remains. With an even count, drag the middle two together to average them. | Values line up by height; the ends fall away. | Meerkats (line up) | Taking the middle of the unsorted list. | Pick 5 |
| G6-26 | `IQR!` | Box plot of a data set | Tap the median. Tap Q1 and Q3 (the medians of each half), in either order. Drag Q1 onto Q3 to subtract. | The box draws itself; a whisker unrolls to each end. | Meerkats | Range instead of IQR. | Pick the IQR |
| G6-27 | `MAD!` | Mean absolute deviation of 2, 4, 6, 8 | Drag the mean line into place. Tap each point, in any order, to grow its distance bar. Drag all the bars together and average them. | Bars hang between the points and the mean line. | Squirrels | Keeping signs, so the bars cancel to 0. | Pick 2 |

---

## 7th grade (KA: "7th grade", /math/cc-seventh-grade-math)

Source: the blog lists an older 7-unit version. KA's site now uses these titles. Verified in khanacademy.org search results: "Integers: addition and subtraction" (unit test and quiz titles), "Rational numbers: addition and subtraction" (unit slug), "Negative numbers: multiplication and division" (slug), "Expressions, equations, & inequalities" (slug), "Geometry", "Statistics and probability". The titles "Proportional relationships" and "Rates and percentages" are reconstructed from memory over the verified slugs cc-7th-ratio-proportion and cc-7th-fractions-decimals and were not verified. "Scale copies" appeared only as a lesson inside Geometry, so it is not treated as a unit here.

### Proportional relationships (title unverified)
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G7-01 | `PROPORTION!` | Table x: 2, 5; y: 7, 17.5. Find k and the equation. | Drag a y-value onto its x-value to get k = 3.5. Tap to check the other row. Drag k into y = □x. | Each row's arrow shows "×3.5". | Cheetah | k = x / y. | Pick 3.5 |
| G7-02 | `CROSS MULTIPLY!` | 3/5 = x/20 | Drag 5 diagonally onto x and 20 onto 3, in either order (5x = 60). Drag 5 across to divide. | Diagonal arrows draw an X. | Spider (web lines) | 3 × 5 (multiplying straight across). | Pick 12 |

### Rates and percentages (title unverified)
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G7-03 | `PERCENT CHANGE!` | $40 increased by 25% | Drag 25% onto 40 to make a 10 chunk, then drag the chunk onto 40 to add it. Alternative order: drag ×1.25 onto 40 directly. | The price tag stretches by a quarter. | Cheetah | Dividing the change by the new value. | Pick $50 |
| G7-04 | `DISCOUNT!` | 20% off $35 | Drag 20% onto 35 (7), then subtract. Or drag ×0.8 directly. | The tag shrinks. | Raccoon (bargain hunter) | Subtracting 20 dollars. | Pick $28 |

### Integers: addition and subtraction (verified)
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G7-05 | `ZERO PAIRS!` | −5 + 3 | Drag positive chips onto negative chips, one pair at a time, in any order. | Each pair pops; 2 negative chips remain. | Fireflies (light and dark) | −8 or 8. | Pick −2 |
| G7-06 | `ADD OPPOSITE!` | 4 − (−6) | Drag the − onto (−6); "minus a negative" flips to "+6". Tap to hop. | The frog turns around twice, then hops right. | Frog | −2. | Pick 10 |

### Rational numbers: addition and subtraction (verified slug)
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G7-07 | `COMMON DENOM!` | −2/3 + 1/4 | See G5-05, with signed bars. | | | | |
| G7-08 | `DISTANCE!` | Distance between −3.5 and 2 | Drag one point onto the other; a bar shows \|−3.5 − 2\|. | A measuring tape stretches across 0. | Frog | 1.5. | Pick 5.5 |

### Negative numbers: multiplication and division (verified slug)
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G7-09 | `SIGN RULE!` | (−3) × (−4) | Drag one negative onto the other; the two direction flips cancel. Tap 3 × 4. | An arrow on the number line reverses twice. | Frog | −12. | Pick 12 |
| G7-10 | `REPEATING!` | 2/11 as a decimal | Run LONG DIVISION! (G5-07) moves until a remainder repeats. Tap the repeating block to put a bar over it. | Remainders 2, 9, 2, 9 … loop; a parrot repeats "18". | Parrot | Rounding to 0.18. | Pick 0.18 with the bar |

### Expressions, equations, & inequalities (verified slug)
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G7-11 | `TWO-STEP!` **[PLANNED]** | 2x + 5 = 13 | Drag +5 across the = sign; it becomes −5. Tap 13 − 5 = 8. Drag the 2 across; it becomes ÷2. Tap 8 ÷ 2 = 4. The other valid order is accepted: drag the 2 across first, so everything is divided by 2 (x + 5/2 = 13/2). The game animates the fractions honestly and then continues. | A balance scale. Weights lift off both pans together; the pans split into 2 equal groups. | Flamingo (balance) or elephant seesaw | Dragging +5 across without flipping its sign (x = 9). Or dividing only the 2x and not the 5 (x + 5 = 6.5). | Pick 8, then 4 |
| G7-12 | `FLIP THE SIGN!` | −3x < 12 | Drag −3 across the < sign; it becomes ÷(−3), and the < flips to >. | The inequality symbol does a backflip when the negative crosses it. | Bat | Not flipping (x < −4). | Pick x > −4 |

### Statistics and probability (verified)
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G7-13 | `TWO DICE!` **[PLANNED]** | P(sum = 7) with two dice | Drag die A onto die B; the 6 × 6 grid of outcomes spreads out (36). Tap the cells whose sum is 7; one tap on the anti-diagonal lights all 6. Drag 6 onto 36 to make the fraction, then tap to simplify. Building the grid must come first. Counting can be done by tapping cells one at a time or by tapping the whole diagonal. | Dice tumble and multiply into a grid; the 7-diagonal glows. | Raccoons rolling dice | 1/11 (treating the sums 2–12 as equally likely). A histogram of the 11 sums shows that they are not. | Pick 6/36, then 1/6 |
| G7-14 | `SAMPLE SPACE!` | Coin and 3-colour spinner | Drag the coin onto the spinner; a tree branches 2 × 3. | A tree diagram grows branches. | Squirrel (tree) | Adding (2 + 3 = 5). | Pick 6 |
| G7-15 | `PROBABILITY!` | 3 red and 5 blue marbles; P(red) | Tap the red group, then drag it onto the whole bag. | The red marbles glow inside a fraction bar. | Magpie | 3/5. | Pick 3/8 |

### Geometry (verified)
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G7-16 | `SCALE FACTOR!` | Map scale 1 cm : 5 m; 4 cm on the map | Drag the scale onto 4 cm. | A ruler stretches into real-world metres. | Ant (small world) | Dividing (0.8). | Pick 20 m |
| G7-17 | `CIRCUMFERENCE!` | Diameter 10 | Drag the diameter onto the circle. | The diameter wraps the rim a little over 3 times (π). | Hamster wheel | πr² (area instead). | Pick 10π ≈ 31.4 |
| G7-18 | `CIRCLE AREA!` | Radius 3 | Drag the slicer onto the circle; wedges unroll into a near-rectangle πr wide and r tall. Drag r onto πr. | Pizza wedges interleave into a rectangle. | Mouse | 2πr. | Pick 9π |
| G7-19 | `SUPPLEMENTARY!` | 65° and x on a straight line | Drag 180 onto 65 to subtract. | The straight line glows as two wedges. | Owl | 90 − 65. | Pick 115° |
| G7-20 | `CROSS SECTION!` | Slice a square pyramid horizontally | Drag the plane through the solid. | The cut face shows a square. | Mole | Saying triangle. | Pick the shape |

---

## 8th grade (KA: "8th grade", /math/cc-eighth-grade-math)

Source: KA blog "Free Math Worksheets" (7 units).

### Unit 1: Numbers and operations
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G8-01 | `REPEAT TO FRAC!` | x = 0.4545… | Drag ×100 onto both sides (100x = 45.4545…). Drag the x equation onto it to subtract; the infinite tails cancel (99x = 45). Drag 99 across to divide. | The two infinite tails line up digit by digit and slide off together. | Parrot | Multiplying by 10 (the tails don't line up). | Pick 45/99 = 5/11 |
| G8-02 | `SQUARE ROOT!` | √49, then estimate √50 | Drag 49 tiles into a square (side 7). For √50, tap between 7² and 8². | Tiles snap into a square; one extra tile sits outside. | Tortoise (square shell) | 49 ÷ 2. | Pick 7, then "just over 7" |
| G8-03 | `ADD EXPONENTS!` | x³ · x⁴ | Drag one power onto the other. | Chains of x's join: x·x·x + x·x·x·x makes 7 links. | Rabbits | x¹². | Pick x⁷ |
| G8-04 | `POWER OF POWER!` | (x²)³ | Drag the outer exponent onto the inner one. | 3 copies of the x² chain join. | Rabbits | x⁵. | Pick x⁶ |
| G8-05 | `NEGATIVE EXP!` | 2⁻³ | Drag 2⁻³ across the fraction bar; the sign of the exponent flips. | The power slides into the denominator. | Bat | −8. | Pick 1/8 |
| G8-06 | `SCI NOTATION!` | (3 × 10⁴)(2 × 10⁵) | Drag 3 onto 2 and 10⁴ onto 10⁵, in either order. Then for a case like 45 × 10⁷, tap to renormalise to 4.5 × 10⁸. | Coefficients multiply while the exponents add on a slider. | Whale (big numbers) | 6 × 10²⁰. | Pick 6 × 10⁹ |

### Unit 2: Solving equations with one unknown
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G8-07 | `BOTH SIDES!` | 5x − 4 = 2x + 11 | Drag 2x across (or 5x the other way). Drag −4 across. Tap to combine. Drag 3 across to divide. Any order of the first two moves. | A balance scale; the moved terms fade from one pan and appear negated on the other. | Elephant | Not flipping a sign when crossing the = sign. | Pick 3x = 15, then 5 |
| G8-08 | `DISTRIBUTE!` | 3(x + 2) = 3x + 5; how many solutions? | DISTRIBUTE!, then drag 3x across; the x's vanish and 6 = 5 is left. Tap the verdict. | A red X stamps "no solution". | Owl | Answering x = 0. | Pick none / one / infinitely many |

### Unit 3: Linear equations and functions
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G8-09 | `SLOPE!` | (2, 3) to (6, 11) | Drag point B onto point A; a staircase appears. Drag the rise (8) onto the run (4). Either point order is accepted (B − A or A − B) as long as it is used for both coordinates. | A goat climbs the rise and walks the run. | Mountain goat | Run over rise (1/2), or mixing the subtraction order (−2). | Pick 2 |
| G8-10 | `GRAPH LINE!` | y = 2x − 1 | Drag −1 onto the y-axis. Drag the slope 2 onto that point; it hops up 2 and right 1, repeatedly. | A line draws through the hop points. | Mountain goat | Putting the intercept on the x-axis. | Pick the graph |
| G8-11 | `INPUT OUTPUT!` | f(x) = 3x − 2 with inputs 0, 1, 2 | Drag each input into the machine, in any order. | The machine chews each input and spits out the output. | Pelican (gulp) | Applying −2 before ×3. | Pick the outputs |

### Unit 4: Systems of equations
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G8-12 | `SUBSTITUTION!` | y = 2x and x + y = 9 | Drag y = 2x onto the y in the second equation. Solve 3x = 9. Drag x = 3 back into either equation. | The y-tile is swapped for a 2x-tile. | Hermit crab (swaps shells) | Substituting into the same equation (0 = 0). | Pick (3, 6) |
| G8-13 | `ELIMINATION!` | x + y = 10 and x − y = 4 | Drag one equation onto the other; they add and the y's pop. Solve 2x = 14. Substitute back. | Equations stack like trays; the opposite terms annihilate. | Fireflies (zero pairs) | Subtracting, which keeps the y's. | Pick (7, 3) |
| G8-14 | `INTERSECTION!` | Graph both lines | Use GRAPH LINE! on each line, in either order. Tap the crossing point. | Two goats meet at the crossing. | Mountain goats | Reading the point as (y, x). | Pick the point |

### Unit 5: Geometry
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G8-15 | `PYTHAGOREAN!` | Legs 6 and 8 | Drag each leg, in either order; a square grows off it (36, 64). Drag both squares onto the hypotenuse's square; the tiles pour in (100). Tap √. | Water-filled squares pour into the big square. | Tortoise | 6 + 8 = 14. | Pick 100, then 10 |
| G8-16 | `ANGLE SUM!` | Triangle with angles 50°, 60°, x | Tear the two known corners off (drag them) onto a straight line. | The corners line up into a 180° line. | Owl | 360 − 110. | Pick 70° |
| G8-17 | `CORRESPONDING!` | Parallel lines cut by a transversal; one angle 110° | Drag the known angle along the transversal to its partner. | The angle slides and fits exactly. | Spider (web lines) | Picking the supplementary angle. | Pick 110° |
| G8-18 | `CONE VOLUME!` | r = 3, h = 4 | Drag the cone into the cylinder of the same base. Tap "fill" 3 times. Drag ⅓ onto πr²h. | Sand from 3 cones fills the cylinder. | Hermit crab | Forgetting ⅓. | Pick 12π |
| G8-19 | `SPHERE VOLUME!` | r = 3 | Drag r into ⁴⁄₃πr³; tap r³ first, then the ×. | A balloon inflates while the volume counter runs. | Pufferfish | Squaring r instead of cubing. | Pick 36π |

### Unit 6: Geometric transformations
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G8-20 | `TRANSLATE!` | Triangle moved by (3, −2) | Drag the vector onto the shape. | The shape slides, leaving footprints. | Crab (sideways) | Moving up instead of down. | Pick the image |
| G8-21 | `ROTATE 90!` | (4, 1) rotated 90° counter-clockwise about the origin | Drag the rotation handle. Coordinates swap and the sign flips: (−1, 4). | The point orbits the origin. | Owl (head turn) | (1, −4) (clockwise). | Pick (−1, 4) |
| G8-22 | `DILATE!` | Scale factor 2 about the origin | Drag ×2 onto each vertex, in any order. | Rays stretch out from the origin. | Pufferfish | Adding 2 to the coordinates. | Pick the image |

### Unit 7: Data and modeling
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| G8-23 | `PREDICT!` **[WEAK FIT]** | A scatter plot with a fitted line; predict y at x = 12 | Drawing a best-fit line by eye is open-ended. Closest playable version: the line is given; tap two lattice points on it to get its slope, then drag 12 onto the equation. | A trail from x = 12 up to the line, then across to y. | Meerkat | Reading the nearest data point instead of the line. | Pick the prediction |
| G8-24 | `TWO-WAY TABLE!` | Relative frequency of "plays sport", by grade | Drag a row total onto its cells, in any order. | Cells turn into percentages. | Meerkats | Dividing by the grand total. | Pick the percentage |

---

## Algebra 1 (KA: "Algebra 1", /math/algebra)

Source: KA blog "Free Math Worksheets" (15 units, with unit links under /math/algebra/x2f8bb11595b61c86:…).

| Unit | ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|---|
| 1 Algebra foundations | A1-01 | `SIMPLIFY!` | 3(2x − 1) − 4x | DISTRIBUTE! the 3 onto both terms (either order). Then LIKE TERMS! 6x with −4x. | The 3 splits into two copies that fly into the parentheses; the x-blocks merge. | Octopus | 6x − 1 − 4x (the 3 is never multiplied onto the −1). | Pick 2x − 3 |
| 2 Solving equations & inequalities | A1-02 | `ISOLATE!` | Solve A = ½bh for h | Drag ½ across (it becomes ×2). Drag b across (it becomes ÷b). Either order. | h slides out alone while the other letters pile up on the far side. | Hermit crab (leaves its shell) | h = 2A − b. | Pick h = 2A/b |
| 2 | A1-03 | `COMPOUND INEQ!` | −3 < 2x + 1 ≤ 7 | Drag −1 onto all three parts, then ÷2 onto all three parts. | All three parts move together, like a sandwich. | Elephant | Applying the step to the middle part only. | Pick −2 < x ≤ 3 |
| 3 Working with units | A1-04 | `CANCEL UNITS!` | 60 mi/h = ? ft/s | Drag the conversion factors (5,280 ft / 1 mi, 1 h / 3,600 s) into the chain, in any order. Matching units cancel. | Matching unit labels top and bottom strike through and pop. | Cheetah | Putting a factor upside down, which leaves mi² and shows the unit mismatch. | Pick 88 ft/s |
| 4 Linear equations & graphs | A1-05 | `INTERCEPTS!` | 3x + 2y = 12 | Drag 0 onto x (y = 6) and drag 0 onto y (x = 4), in either order. Tap to draw the line through both points. | Each intercept dot drops onto an axis, then the line snaps through them. | Mountain goat | Swapping the intercepts. | Pick (4, 0) and (0, 6) |
| 5 Forms of linear equations | A1-06 | `POINT-SLOPE!` | Slope 3 through (2, 5) | Drag the point into y − y₁ = m(x − x₁). Drag m into the template. Either order. Then DISTRIBUTE! to get slope-intercept form. | The template slots light up as they fill. | Mountain goat | y − 2 = 3(x − 5) (coordinates swapped). | Pick y = 3x − 1 |
| 5 | A1-07 | `STANDARD FORM!` | y = ⅔x + 4 to Ax + By = C | Drag ×3 onto both sides. Drag 2x across the = sign. | The fraction clears, then the terms slide across. | Owl | Multiplying only the x-term by 3. | Pick 2x − 3y = −12 |
| 6 Systems of equations | A1-08 | `ELIMINATION!` | 2x + 3y = 12 and 3x − 2y = 5 | Drag ×2 onto equation 1 and ×3 onto equation 2, in either order (or scale to eliminate x instead). Drag one equation onto the other. | The y-terms annihilate. | Fireflies | Scaling only one side of an equation. | Pick (3, 2) |
| 7 Inequalities (systems & graphs) | A1-09 | `SHADE!` | y > 2x − 1 | GRAPH LINE! the boundary; tap to make it dashed. Drag the test point (0, 0) into the inequality. The true side shades. | Paint flows over the half-plane that contains the test point when it passes. | Chameleon | Drawing a solid line, or shading the wrong side. | Pick the graph |
| 8 Functions | A1-10 | `EVALUATE!` | f(x) = x² − 3x; find f(−2) | Drag −2 onto each x, in either order. Each lands inside parentheses. Tap the square, then the products, then the sum. | (−2) drops into each x-slot wrapped in parentheses. | Pelican | −2² = −4 (dropping the parentheses), giving 2. | Pick 10 |
| 8 | A1-11 | `RATE OF CHANGE!` | Average rate of change of x² from x = 1 to x = 4 | Drag each x onto the curve, in either order, to get its point. Drag one point onto the other: rise 15, run 3. | A secant line draws between the two points. | Mountain goat | Using f(4)/4. | Pick 5 |
| 8 | A1-12 | `INVERSE!` | f(x) = 2x + 3; find f⁻¹ | Drag x and y to swap them. Then use INVERSE OP! moves to undo the +3 and the ×2. | The graph reflects across y = x. | Salmon (swims back upstream) | 1/(2x + 3). | Pick (x − 3)/2 |
| 9 Sequences | A1-13 | `ARITHMETIC SEQ!` | 5, 8, 11, …; find the 20th term | Drag d = 3 onto (n − 1) = 19 to get 57. Drag 57 onto the first term 5. | 19 hops of 3 after the first term. | Kangaroo | 5 + 3 · 20 = 65 (off by one hop). | Pick 62 |
| 9 | A1-14 | `GEOMETRIC SEQ!` | 3, 6, 12, …; find the nth term | Drag the ratio 2 onto the exponent slot (n − 1). Drag 3 onto the coefficient slot. | Each term doubles in size. | Rabbits | 3 · 2ⁿ. | Pick 3 · 2ⁿ⁻¹ |
| 10 Absolute value & piecewise functions | A1-15 | `ABS EQUATION!` | \|x − 3\| = 5 | Drag the bars off; the equation splits into x − 3 = 5 and x − 3 = −5. Solve each, in either order. | The equation forks into two lanes. | Frog (hops both ways from 3) | Finding only x = 8. | Pick 8 and −2 |
| 10 | A1-16 | `PIECEWISE!` | f(x) = x² if x < 2, else 3x; find f(4) | Drag 4 through the condition gates. Only the matching gate opens. Evaluate that branch. | The gate swings open for the branch that applies. | Sheepdog (herding) | Using the wrong branch (16). | Pick 12 |
| 11 Exponents & radicals | A1-17 | `SIMPLIFY ROOT!` | √72 | Tap 72 to factor it. Any factor tree works: 36 × 2, 9 × 8, and so on. Drag each pair of equal factors out of the radical. | A pair of 6s escapes the root and merges into one 6 outside. | Moles (pop out of a burrow) | 36√2 (halving instead of rooting). | Pick 6√2 |
| 11 | A1-18 | `RATIONAL EXP!` | 8^(2/3) | Drag the denominator 3 onto 8 to take the cube root (2), then the 2 to square it (4). The reverse order is also accepted: square to 64, then cube root to 4. | The cube unfolds into its edge length, then a square grows. | Tortoise | 8 · ⅔. | Pick 4 |
| 12 Exponential growth & decay | A1-19 | `GROWTH FACTOR!` | $500 grows 6% per year; value after 3 years | Drag 6% onto 1 to make the factor 1.06. Drag the 3 onto the factor as an exponent. Tap to compute. | Each year the money pile multiplies by 1.06. | Rabbits | 1.6 or 0.06 as the factor. | Pick 500 · 1.06³ ≈ 595.51 |
| 12 | A1-20 | `HALF-LIFE!` | 80 g, half-life 5 years; amount after 15 years | Drag 15 onto 5 to get 3 half-lives. Drag ½³ onto 80. | The pile halves three times. | Snail (slow decay) | 80 − 3 · 40. | Pick 10 g |
| 13 Quadratics: Multiplying & factoring | A1-21 | `FOIL!` | (x + 3)(x + 5) | Make 4 drags, in any order: x onto x, x onto 5, 3 onto x, 3 onto 5. Then drag 3x onto 5x to combine. ("DISTRIBUTE!" is accepted as the general name.) | An area-model grid fills one cell per drag. | Octopus | x² + 15 (missing the middle terms). The two blank grid cells flash. | Pick 8x, then the trinomial |
| 13 | A1-22 | `FACTOR!` | x² + 7x + 12 | Drag factor-pair tiles of 12 (1·12, 2·6, 3·4) onto the "sum = 7" slot until one fits. | The x² square plus 7 strips plus 12 units rearrange into a 3-by-4 rectangle. | Beaver | (x + 2)(x + 6). | Pick (x + 3)(x + 4) |
| 13 | A1-23 | `DIFF OF SQ!` | x² − 49 | Tap x² to show x · x and 49 to show 7 · 7, in either order. Drag them into (a + b)(a − b). | A square with a corner square cut out is sliced and re-glued into a rectangle. | Beaver | (x − 7)². | Pick (x + 7)(x − 7) |
| 13 | A1-24 | `GROUPING!` | 6x² + 7x + 2 | Drag a·c = 12 onto the factor pairs and pick 3 and 4 (sum 7) to split 7x. Drag brackets around each pair. Pull out the common binomial. | 7x splits into 3x + 4x; the matching (2x + 1) brackets glow. | Magpie | Splitting 7x into 1x + 6x. | Pick (3x + 2)(2x + 1) |
| 14 Quadratic functions & equations | A1-25 | `ZERO PRODUCT!` | (x − 2)(x + 5) = 0 | Drag 0 onto each factor, in either order. Each factor becomes its own equation. | The product splits into two doors, each set to 0. | Frog | x = −2 and 5 (signs reversed). | Pick 2 and −5 |
| 14 | A1-26 | `COMPLETE □!` | x² + 6x + 2 = 0 (command reads "complete the square") | Drag half of 6 (3) and square it (9) onto both sides; the corner tile fills. Fold the tiles into (x + 3)² = 7. Tap ±√. | An x² tile plus two 3x strips plus a missing 3 × 3 corner become a square. | Beaver | Adding 9 to one side only. | Pick −3 ± √7 |
| 14 | A1-27 | `QUAD FORMULA!` | 2x² − 3x − 2 = 0 | Drag a, b and c into the formula slots, in any order. Tap the discriminant (25). Tap √ (±5). Tap the two results. | The discriminant glows like a gem. The ± splits into two paths. | Owl | Using −b² instead of −b, or dividing only the root by 2a. | Pick 2 and −½ |
| 14 | A1-28 | `DISCRIMINANT!` | How many real roots does x² + 4x + 5 have? | Drag a, b and c into b² − 4ac. Tap to compute (−4). | The parabola rises off the axis and shows no crossings. | Owl | Answering 2 roots. | Pick 0 |
| 14 | A1-29 | `VERTEX!` | y = x² − 4x + 1 | Drag −b/2a onto the x-slot to get 2. Drag 2 into the function to get −3. | A ball rolls to the bottom of the parabola. | Skateboarding squirrel | Using x = 4. | Pick (2, −3) |
| 15 Irrational numbers | A1-30 | `CLOSURE!` **[WEAK FIT]** | Is √2 + 3 rational? | Proving irrationality is not tappable. Closest playable version: drag each operation between number tiles (rational + irrational, rational × rational, and so on) and watch the result tile change colour by the closure rule. | Tiles mix like paint. | Chameleon | Thinking √2 · √2 is irrational. | Pick rational / irrational |

---

## Geometry (KA: "High school geometry", /math/geometry)

Source: KA blog "Free Math Worksheets" (10 units).

| Unit | ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|---|
| 1 Performing transformations | GE-01 | `REFLECT!` | Reflect (5, 2) across y = x | Drag the point across the mirror line. | The coordinates swap places as the point passes through the mirror. | Penguin | (−5, −2). | Pick (2, 5) |
| 1 | GE-02 | `ROTATE!` | Rotate the triangle 180° about (1, 1) | Drag the pivot onto (1, 1). Drag the handle a half-turn. | The shape swings around the pin. | Owl | Rotating about the origin instead. | Pick the image |
| 2 Transformation properties and proofs | GE-03 | `SYMMETRY!` | Which rotations map a regular hexagon onto itself? | Drag the rotation handle; it clicks at every 60°. Tap each click that matches the outline. | Ghost outlines light up for each symmetry. | Bee (hexagonal cell) | Including 45°. | Pick 6 rotations |
| 2 | GE-04 | `RIGID MOTION!` **[WEAK FIT]** | Prove that these two figures are congruent | A written proof is not tappable. Closest playable version: build the proof as a sequence of moves. Drag translate, rotate and reflect cards onto figure A until it lands on figure B. | Each card animates its motion. | Crab | A sequence that ends with A flipped over relative to B. | Pick the next card |
| 3 Congruence | GE-05 | `CONGRUENT!` **[WEAK FIT]** | Triangles with marked sides and angles; which criterion applies? | Proof chains are not tappable. Closest playable version: drag triangle A onto B with rigid motions, then tap the matched marks; the criterion (SSS, SAS, ASA, AAS) lights up. Two-column proofs become "drag each given into its reason slot". | Matching tick marks glow in pairs. | Owl (proof judge) | Accepting SSA. | Pick the criterion |
| 4 Similarity | GE-06 | `SIMILAR!` | Triangles 3-4-5 and 6-8-x | Drag side 3 onto side 6 to get the scale factor ×2. Drag ×2 onto 5. | The small triangle zooms up and lands on the big one. | Pufferfish | +3 instead of ×2 (giving 8). | Pick 10 |
| 5 Right triangles & trigonometry | GE-07 | `SOH CAH TOA!` | Find x, the side opposite 30°, when the hypotenuse is 10 | Tap the angle; the sides get labelled O, A and H. Drag sin onto the angle. Drag the hypotenuse onto it. | The ratio bar fills to ½ of the hypotenuse. | Owl | Using cos. | Pick the ratio (sin), then 5 |
| 5 | GE-08 | `INVERSE TRIG!` | Opposite 5, adjacent 5; find the angle | Drag tan⁻¹ onto the ratio 5/5. | The angle opens to 45°. | Owl | tan(1). | Pick 45° |
| 5 | GE-09 | `SPECIAL RIGHT!` | 45-45-90 triangle with legs of 5 | Drag ×√2 onto a leg. | A square folds along its diagonal. | Tortoise | 10. | Pick 5√2 |
| 6 Non-right triangles & trigonometry (Advanced) | GE-10 | `LAW OF SINES!` | A = 30°, a = 5, B = 45°; find b | Drag the pair (a, A) and the pair (b, B) into a/sin A = b/sin B. Use CROSS MULTIPLY! moves to solve. | Each side and its opposite angle glow in the same colour. | Owl | Pairing a with B. | Pick 5√2 |
| 6 | GE-11 | `LAW OF COSINES!` | a = 5, b = 7, C = 60°; find c | Drag a, b and C into c² = a² + b² − 2ab cos C, in any order. Tap through the terms. | The Pythagorean squares appear with a correction strip removed. | Owl | Forgetting the −2ab cos C term. | Pick √39 |
| 7 Analytic geometry | GE-12 | `DISTANCE!` | (1, 2) to (7, 10) | Drag one point onto the other; a right triangle with legs 6 and 8 forms. Then use PYTHAGOREAN! moves. | A staircase forms, then the squares pour into the hypotenuse's square. | Mountain goat | 6 + 8. | Pick 10 |
| 7 | GE-13 | `MIDPOINT!` | Midpoint of (1, 2) and (7, 10) | Drag both points together. | The points walk toward each other and meet halfway. | Two ants | Subtracting the coordinates. | Pick (4, 6) |
| 7 | GE-14 | `PERPENDICULAR!` | Slope of a line perpendicular to slope ⅔ | Drag the slope onto the right-angle stamp; it flips and its sign changes. | The line rotates 90°. | Owl | 3/2 (forgetting the minus sign). | Pick −3/2 |
| 8 Conic sections | GE-15 | `CIRCLE EQN!` | x² + y² − 6x + 4y = 3 | Complete the square for x and for y, in either order. Drag the added constants to the right side. | Each variable's tiles fold into a square. | Hedgehog | Adding the constants to the left side only. | Pick centre (3, −2), r = 4 |
| 9 Circles | GE-16 | `ARC LENGTH!` | r = 6, central angle 60° | Drag 60/360 onto the circumference 12π. | A slice of the rim peels off as a string. | Snail (curled shell) | Using the radius instead of the circumference. | Pick 2π |
| 9 | GE-17 | `RADIANS!` | 180° = ? radians | Drag the radius onto the arc repeatedly; it wraps π times around a semicircle. | A radius-length string bends around the arc. | Snail | Calling 180° equal to 1 radian. | Pick π |
| 9 | GE-18 | `INSCRIBED!` | Central angle 100°; find the inscribed angle on the same arc | Drag the vertex from the centre out to the rim. | The angle halves as the vertex slides. | Spider | 200°. | Pick 50° |
| 9 | GE-19 | `SECTOR AREA!` | r = 6, angle 60° | Drag 60/360 onto πr². | A pizza slice lifts out. | Mouse | Using the circumference. | Pick 6π |
| 10 Solid geometry | GE-20 | `CAVALIERI!` | Do the straight and slanted stacks of coins have the same volume? | Drag the stack sideways to shear it. Tap to compare. | The coins slide; the volume counter stays fixed. | Raccoon | Saying the slanted stack is bigger. | Pick "equal" |
| 10 | GE-21 | `DENSITY!` | 300 g in 120 cm³ | Drag the mass onto the volume to divide. | The cube's colour intensity reflects density. | Hippo (sinks in water) | V/m. | Pick 2.5 g/cm³ |

---

## Algebra 2 (KA: "Algebra 2", /math/algebra2)

Source: KA blog "Free Math Worksheets" (13 units).

| Unit | ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|---|
| 1 Polynomial arithmetic | A2-01 | `MULTIPLY POLY!` | (x + 2)(x² − 3x + 1) | Drag x onto each of the 3 terms, and 2 onto each of the 3 terms (6 drags, any order). Drag tiles of the same degree together. | A 2 × 3 grid fills; like terms slide into a column. | Octopus | Missing a cross term. | Pick x³ − x² − 5x + 2 |
| 2 Complex numbers | A2-02 | `I SQUARED!` | (3 + 2i)(1 − 4i) | FOIL! (4 drags, any order). Drag i onto i; it spins 180° into −1. Combine. | i · i is shown as two quarter-turns adding up to a half-turn. | Owl (head turn) | i² = 1. | Pick 11 − 10i |
| 2 | A2-03 | `POWERS OF I!` | i²⁷ | Drag 27 onto 4 to get remainder 3. Tap i³. | i spins a quarter-turn per power; 27 quarter-turns land on −i. | Owl | i. | Pick −i |
| 3 Polynomial factorization | A2-04 | `SUM OF CUBES!` | x³ + 8 | Tap x³ to show x · x · x and 8 to show 2 · 2 · 2, in either order. Drag them into (a + b)(a² − ab + b²). | Template slots fill. | Tortoise | (x + 2)³. | Pick (x + 2)(x² − 2x + 4) |
| 3 | A2-05 | `SUBSTITUTE!` | x⁴ − 5x² + 4 | Drag u onto x². FACTOR! the result. Drag x² back into u, then DIFF OF SQ! both factors. | x² hides in a u-box, then comes back. | Hermit crab | Stopping at (x² − 1)(x² − 4). | Pick the full factorisation |
| 4 Polynomial division | A2-06 | `SYNTHETIC DIV!` | (x³ − 2x² − 5x + 6) ÷ (x − 1) | Drag 1 into the box. Drag the leading coefficient down. Then tap "multiply-add" across the row, left to right (fixed order). | Numbers bounce diagonally, then drop. A 0 remainder means a clean split. | Kangaroo | Using −1 (the sign of the divisor instead of its root). | Pick x² − x − 6 |
| 4 | A2-07 | `REMAINDER THM!` | Remainder of the same polynomial ÷ (x − 2) | Drag 2 into f(x). | A remainder chip pops out of the machine. | Pelican | Using f(−2). | Pick −4 |
| 4 | A2-08 | `POLY LONG DIV!` | (x² + 5x + 6) ÷ (x + 2) | Divide the leading terms, multiply, subtract, bring down. The cycle order is fixed, as in G5-07. | The same "eat a digit" animation as long division, with terms. | Anteater | Subtracting without distributing the minus sign. | Pick x + 3 |
| 5 Polynomial graphs | A2-09 | `END BEHAVIOR!` | −2x⁵ + x² | Drag the leading term to the far left and far right edges, in either order. | The graph's arms point down on the right and up on the left. | Mountain goat | Both arms up. | Pick the arms |
| 5 | A2-10 | `MULTIPLICITY!` | (x − 1)²(x + 2) | Tap each factor. An even power bounces off the axis; an odd power crosses it. | A ball bounces at x = 1 and passes through at −2. | Kangaroo | Saying the graph crosses at x = 1. | Pick bounce / cross |
| 6 Rational exponents and radicals | A2-11 | `SQUARE BOTH!` | √(x + 3) = x − 3 | Drag ² onto both sides. FACTOR! the quadratic. Drag each root back into the original equation to check it, in either order. | The impostor root x = 1 turns red and is ejected. | Meerkat (lookout checks) | Keeping x = 1. | Pick 6 |
| 7 Exponential models | A2-12 | `COMPOUND!` | $1,000 at 5% compounded monthly for 2 years | Drag 0.05 onto 12 (the rate per month). Drag 12 · 2 onto the exponent. | 24 small growth steps. | Rabbits | 1000(1.05)²⁴. | Pick the expression |
| 7 | A2-13 | `CONTINUOUS!` | 1,000e^(0.05 · 2) | Drag r and t into the exponent, in either order. | The steps blur into a smooth curve. | Rabbits | Using 1.05^0.1. | Pick ≈ $1,105.17 |
| 8 Logarithms | A2-14 | `LOG!` | log₂ 32 | Drag 2 onto 32 repeatedly; each drag halves it. Count the drags. | A mole digs down one level per halving. | Mole | 16. | Pick 5 |
| 8 | A2-15 | `LOG PROPERTIES!` | log(8x) − log 2 | Drag the − between the logs onto them; they merge into log(8x/2). Tap to simplify. | Two logs fuse into one. | Mole | log(8x − 2). | Pick log(4x) |
| 8 | A2-16 | `TAKE THE LOG!` | 3ˣ = 20 | Drag log onto both sides. The exponent x drops down in front. Drag log 3 across to divide. | The exponent slides down from the shoulder like a power-rule drop. | Mole | Dividing 20 by 3. | Pick log 20 / log 3 |
| 8 | A2-17 | `CHANGE OF BASE!` | log₄ 8 | Drag the base-2 converter onto the log: log₂ 8 / log₂ 4. | Both towers are rebuilt in base 2. | Mole | 8/4. | Pick 3/2 |
| 9 Transformations of functions | A2-18 | `SHIFT!` | y = (x − 2)² + 3 | Drag −2 onto the parabola (it moves right). Drag +3 (it moves up). Either order. | A crab walks the parabola sideways. | Crab | Moving it left for −2. | Pick the vertex (2, 3) |
| 9 | A2-19 | `STRETCH!` | y = 3f(x) | Drag 3 onto the graph. | The graph stretches vertically, with arrows on the points. | Giraffe | A horizontal stretch. | Pick the image |
| 10 Equations | A2-20 | `CLEAR DENOMS!` | x/(x − 2) + 1 = 2/(x − 2) | Drag the LCD (x − 2) onto every term, in any order. Solve. Check the answer against the domain. | Fractions dissolve. x = 2 hits the forbidden zone and is ejected. | Meerkat | Accepting x = 2. | Pick "no solution" |
| 11 Trigonometry | A2-21 | `UNIT CIRCLE!` | sin(5π/6) | Drag the angle onto the circle; a point travels counter-clockwise. Drag a perpendicular down to the x-axis. | The height of the point lights up as sin. | Owl | −½, or √3/2. | Pick ½ |
| 11 | A2-22 | `PERIOD!` | y = 3 sin(2x) | Drag 3 onto the wave (amplitude). Drag 2 onto the wave (period 2π/2). Either order. | The wave stretches up and squeezes sideways. | Snake (sine wave) | Period 4π. | Pick amplitude 3, period π |
| 12 Modeling | A2-23 | `FIT THE MODEL!` **[WEAK FIT]** | y = a · bˣ passes through (1, 6) and (3, 54) | Open-ended modelling is not tappable. Closest playable version: the model is already chosen. Drag the two points into the template. Drag one equation onto the other to divide (a cancels). Take √. | The curve snaps through both points. | Rabbits | Subtracting the equations. | Pick a = 2, b = 3 |
| 13 Rational functions | A2-24 | `CANCEL!` | (x² − 9)/(x² + x − 6) | Tap the top and the bottom to FACTOR! them, in either order. Drag (x + 3) onto (x + 3). | The factors cancel and a hole marker is left at x = −3. | Moles | Cancelling the x² terms. | Pick (x − 3)/(x − 2) |
| 13 | A2-25 | `ASYMPTOTE!` | (2x + 1)/(x − 3) | Tap the denominator's zero (vertical asymptote). Drag the leading terms together (horizontal asymptote). Either order. | Dashed walls appear. | Sloth (gets close, never touches) | A horizontal asymptote at y = 0. | Pick x = 3 and y = 2 |

---

## Trigonometry (KA: "Trigonometry", /math/trigonometry)

Source: KA blog "Free Math Worksheets" (4 units).

| Unit | ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|---|
| 1 Right triangles & trigonometry | — | — | See GE-07, GE-08, GE-09 | | | | | |
| 1 | T-01 | `RECIPROCAL!` | csc θ when sin θ = 3/5 | Drag sin θ onto the "1 over" slot; the fraction flips. | The fraction cartwheels. | Bat | Using cos. | Pick 5/3 |
| 2 Trigonometric functions | T-02 | `REF ANGLE!` | sin 210° | Drag the angle's ray back to the nearest x-axis, giving 30°. Tap the quadrant to get the sign. Either order. | The ray swings back to the axis, and the quadrant shows its sign. | Owl | +½. | Pick −½ |
| 2 | T-03 | `DEG TO RAD!` | 150° in radians | Drag π/180 onto 150°. Cancel the common factor 30. | The degree dial morphs into radius-lengths. | Snail | 150π. | Pick 5π/6 |
| 3 Non-right triangles & trigonometry | — | — | See GE-10, GE-11 | | | | | |
| 3 | T-04 | `TRIANGLE AREA!` | a = 5, b = 8, C = 30° | Drag a, b and sin C into ½ab sin C, in any order. | The height drops down as b sin C. | Beaver | Forgetting the ½. | Pick 10 |
| 4 Trigonometric equations and identities | T-05 | `PYTHAGOREAN ID!` | sin²θ + cos²θ | Drag sin² onto cos². | On the unit circle the two leg-squares pour into the 1 × 1 square. | Tortoise | Calling the sum 2 or sin 2θ. | Pick 1 |
| 4 | T-06 | `ANGLE ADDITION!` | sin 75° | Drag the splitter onto 75° to make 45° + 30°. Drag the formula on. Tap each product, in any order. | The two rotations stack. | Owl | sin 45° + sin 30°. | Pick (√6 + √2)/4 |
| 4 | T-07 | `DOUBLE ANGLE!` | sin 2θ when sin θ = 3/5 and cos θ = 4/5 | Drag 2 sin θ cos θ onto the problem, then the values, in any order. | The angle duplicates. | Owl | 2 · 3/5. | Pick 24/25 |
| 4 | T-08 | `SOLVE TRIG!` | 2 sin x = 1 on [0, 2π) | Drag 2 across to divide. Drag sin⁻¹ onto ½. Tap the mirror point on the unit circle. | Two points light up on the circle at the same height. | Owl | Finding only π/6. | Pick π/6 and 5π/6 |

---

## Precalculus (KA: "Precalculus", /math/precalculus)

Source: the KA blog lists 9 units (Complex numbers, Polynomials, Composite functions, Trigonometry, Vectors, Matrices, Series, Conic sections, Probability and combinatorics). khanacademy.org search results also showed a precalculus unit "Limits and continuity" (/math/precalculus/x9e81a4f98389efdf:limits-and-continuity) and a "Vectors: Unit test". KA's "Get ready for Precalculus" course has a unit "Get ready for composite and inverse functions", which suggests the current title of "Composite functions" is "Composite and inverse functions". That title is not verified. The skills in the blog's "Polynomials" unit were not verified either; the binomial theorem row below is a best guess.

| Unit | ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|---|
| Complex numbers | P-01 | `COMPLEX PLANE!` | Plot 3 − 4i and find \|z\| | Drag 3 onto the real axis and −4i onto the imaginary axis, in either order. Then use PYTHAGOREAN! moves to get the length. | An arrow draws from 0 to the point. | Owl | Plotting (−4, 3). | Pick 5 |
| Complex numbers | P-02 | `POLAR FORM!` | 1 + i | Drag the point onto the angle dial (45°). Drag it onto the length ruler (√2). Either order. | The arrow's length and angle are labelled. | Owl | An angle of 1 radian. | Pick √2 cis 45° |
| Complex numbers | P-03 | `MULTIPLY POLAR!` | (2 cis 30°)(3 cis 60°) | Drag one complex number onto the other. The lengths multiply and the angles add. | The arrow stretches and rotates. | Owl | Adding the lengths. | Pick 6 cis 90° = 6i |
| Complex numbers | P-04 | `DE MOIVRE!` | (1 + i)⁸ | Drag 8 onto the angle and onto the length, in either order. | The arrow spins 8 × 45° = 360° and grows to 16. | Owl | 8 + 8i. | Pick 16 |
| Polynomials | P-05 | `BINOMIAL THM!` | (x + 2)⁴ | Drag the row-4 Pascal coefficients (1, 4, 6, 4, 1) onto the terms. Drag the powers of 2 on. Either order. | Pascal's triangle lights row 4. | Bees (triangular comb) | x⁴ + 16. | Pick 24 for the x² coefficient |
| Composite functions | P-06 | `COMPOSE!` | f(g(2)) with f(x) = x², g(x) = x + 3 | Drag 2 into the inner machine g (giving 5). Drag the 5 into f (giving 25). Inner first is the only accepted order. | Nested machines; the output of g slides along a belt into f. | Hermit crab (shell inside a shell) | g(f(2)) = 7. | Pick 25 |
| Composite functions | P-07 | `INVERSE!` | Show that f(f⁻¹(x)) = x for f(x) = 2x + 3 | Drag f⁻¹(x) into f. Simplify. | Machines run forward and then backward; x comes out unchanged. | Salmon | Treating f⁻¹(x) as 1/f(x). | Pick x |
| Trigonometry | — | — | See A2-21, T-02 to T-08 | | | | | |
| Vectors | P-08 | `TIP-TO-TAIL!` **[PLANNED: vector addition]** | ⟨3, 1⟩ + ⟨1, 4⟩ | Drag the tail of v onto the head of u. Tap to draw the resultant from the start to the end. Components add column by column: ⟨4, 5⟩. Either vector can go first; the parallelogram shows both paths. | Arrows snap tip to tail; the resultant draws itself, then the components sum in a column. | Geese (V formation) or kangaroo hops | Placing the vectors tail to tail and joining their tips (that makes u − v). | Pick ⟨4, 5⟩ |
| Vectors | P-09 | `SCALAR MULT!` | 3⟨2, −1⟩ | Drag 3 onto the vector. | The arrow stretches to 3 times its length. | Kangaroo | ⟨6, −1⟩. | Pick ⟨6, −3⟩ |
| Vectors | P-10 | `MAGNITUDE!` | \|⟨6, 8⟩\| | Drag the vector onto the right-angle ruler. PYTHAGOREAN! the components. | Leg squares appear. | Kangaroo | 14. | Pick 10 |
| Vectors | P-11 | `UNIT VECTOR!` | Unit vector in the direction of ⟨3, 4⟩ | Use MAGNITUDE! moves (5). Drag 5 onto the vector to divide. | The arrow shrinks to length 1 on the unit circle. | Kangaroo | ⟨1, 1⟩. | Pick ⟨3/5, 4/5⟩ |
| Vectors | P-12 | `COMPONENTS!` | Magnitude 10 at 30° | Drag cos onto 10 (x) and sin onto 10 (y), in either order. | The vector's shadows fall on the axes. | Owl | Swapping sin and cos. | Pick ⟨5√3, 5⟩ |
| Matrices | P-13 | `MATRIX PRODUCT!` **[PLANNED: matrix product cell]** | Entry (row 2, column 1) of AB, with A = [[1, 2], [3, 4]] and B = [[5, 6], [7, 8]] | Drag row 2 of A onto column 1 of B. Tap each pair to multiply it (any order: 3 · 5, 4 · 7). Drag the products together (43). The result drops into the cell. | The row rotates 90° and lies alongside the column. The pairs click like a zipper. | Monkeys (swing along a row, then down a column) | Using row 2 with row 2, or multiplying entry by entry. | Pick 43 |
| Matrices | P-14 | `DETERMINANT!` | det [[3, 1], [2, 4]] | Drag the main diagonal (12). Drag the anti-diagonal (2). Either order. Subtract. | The unit square transforms into a parallelogram of area 10. | Beaver | ad + bc. | Pick 10 |
| Matrices | P-15 | `INVERSE MATRIX!` | [[4, 7], [2, 6]]⁻¹ | Swap a and d. Negate b and c. Drag 1/det onto the matrix. Any order. | Entries swap and flip, then scale. | Salmon | Inverting each entry (1/4, 1/7, …). | Pick (1/10)[[6, −7], [−2, 4]] |
| Matrices | P-16 | `TRANSFORM!` | [[0, −1], [1, 0]] applied to the unit square | Drag the matrix onto the grid. | The grid rotates 90°, and the basis arrows land on the matrix columns. | Owl | Rotating 90° clockwise. | Pick the image |
| Series | P-17 | `SIGMA!` | Σ from k = 1 to 4 of (2k + 1) | Drag each k value into the term, in any order, to get 3, 5, 7, 9. Drag the terms together. | The terms pop out of the sigma like a vending machine. | Squirrel | Using 4 terms starting at k = 0. | Pick 24 |
| Series | P-18 | `ARITH SERIES!` | 1 + 2 + … + 100 | Drag a reversed copy onto the row; the pairs all make 101. Drag × 100, then ÷ 2. | Gauss's pairing: two staircases fit into a rectangle. | Kangaroo | 100 × 101 (forgetting to halve). | Pick 5,050 |
| Series | P-19 | `GEOMETRIC SUM!` | 3 + 6 + 12 + 24 + 48 | Drag r · S (×2) under S. Subtract; the middle terms cancel. Divide by (r − 1). | The shifted copy cancels everything except the ends. | Rabbits | Using 5 · 48. | Pick 93 |
| Conic sections | P-20 | `ELLIPSE!` | x²/25 + y²/9 = 1 | Tap 25 (√ gives a = 5) and 9 (b = 3), in either order. | The ellipse stretches to its radii. | Hedgehog | Radii 25 and 9. | Pick a = 5, b = 3 |
| Conic sections | P-21 | `FOCI!` | Same ellipse; find the foci | Drag b² onto a² to subtract (c² = 16). Tap √. | A string-and-pins drawing of the ellipse. | Spider | c² = a² + b². | Pick (±4, 0) |
| Conic sections | P-22 | `HYPERBOLA!` | x²/9 − y²/16 = 1; find the asymptotes | Tap √ under 9 and √ under 16 (3 and 4). Drag them into y = ±(b/a)x. | A box and its diagonals draw the asymptotes. | Bat (wings) | Using a/b. | Pick y = ±(4/3)x |
| Probability and combinatorics | P-23 | `PERMUTATION!` | ₅P₃: 3 podium places from 5 animals | Drag animals into the 3 slots, one slot at a time. The pool shrinks: 5 × 4 × 3. | Animals hop onto the podium. | Penguins | 5³. | Pick 60 |
| Probability and combinatorics | P-24 | `COMBINATION!` | ₅C₃ | Do the PERMUTATION! moves, then drag 3! onto the result. | The 6 orderings of each group stack and merge into one. | Penguins | Forgetting to divide (60). | Pick 10 |
| Probability and combinatorics | P-25 | `FACTORIAL!` | 5! | Drag 5 onto the factorial staircase; it multiplies down to 1. | A staircase of 5, 4, 3, 2, 1. | Penguins | 5 + 4 + 3 + 2 + 1. | Pick 120 |
| Limits and continuity (verified in search results) | — | — | See C-01 to C-04 (same skills, introductory numbers) | | | | | |

---

## Statistics and probability (KA: "Statistics and probability", /math/statistics-probability)

Source: KA blog "Free Math Worksheets" (16 units). The blog also lists KA's "AP®︎/College Statistics" course (/math/ap-statistics) with 14 content units: Analyzing categorical data; Displaying and describing quantitative data; Summarizing quantitative data; Modeling data distributions; Exploring bivariate numerical data; Study design; Probability; Random variables; Sampling distributions; Confidence intervals; Significance tests (hypothesis testing); Inference comparing two groups or populations; Chi-square tests for categorical data; More on regression. It also has two non-content units: an exam-prep unit and "Standards mappings". Every AP Statistics content unit corresponds to a unit below, so the same microgames cover it. The blog names the exam-prep unit "Prepare for the 2020 AP®︎ Statistics Exam", which suggests the AP list was not refreshed when the blog was updated in 2025.

| Unit | ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|---|
| Analyzing categorical data | S-01 | `CONDITIONAL!` | Two-way table; P(likes cats \| 7th grader) | Drag the "7th grader" row out of the table; the rest fades. Drag the cell onto the row total. | The table shrinks to one row. | Cats | Dividing by the grand total. | Pick the fraction |
| Displaying and comparing quantitative data | S-02 | `HISTOGRAM!` | Bin 12 test scores into widths of 10 | Drag each score into its bin, in any order. | Bars grow as the scores drop in. | Meerkats | Putting 70 in the 60–70 bin when bins include their left edge. | Pick a bar height |
| Displaying and comparing quantitative data | S-03 | `STEM AND LEAF!` | Make a stem plot of 23, 27, 31, 35, 35, 42 | Drag each number; it splits into a stem and a leaf, in any order. | Leaves sprout off the stems. | Caterpillar | Making a stem for each number. | Pick a row |
| Summarizing quantitative data | S-04 | `STD DEVIATION!` | Data 2, 4, 4, 4, 5, 5, 7, 9 | Drag the mean line into place (5). Tap each point, in any order, to grow its deviation bar. Drag each bar to turn it into a square. Drag the squares together and average them (4). Tap √. | Bars become squares, and the squares merge. If the player skips the squaring, the signed bars cancel to 0, which shows why the squaring step exists. | Squirrels | Averaging the signed deviations (0). | Pick 4, then 2 |
| Summarizing quantitative data | S-05 | `OUTLIER!` | Q1 = 10, Q3 = 20; is 40 an outlier? | Drag Q1 onto Q3 (IQR = 10). Drag ×1.5 onto the IQR. Drag 15 onto each quartile to place the fences, in either order. | Fence posts appear; 40 lands outside them. | Sheepdog | Using 1.5 × the range. | Pick "yes" |
| Modeling data distributions | S-06 | `Z-SCORE!` | x = 85, μ = 70, σ = 10 | Drag μ onto x (difference 15). Drag σ onto 15 to measure it in σ-sized steps. | A ruler with σ ticks. | Kangaroo (σ-length hops) | Dividing by the variance. | Pick 1.5 |
| Modeling data distributions | S-07 | `EMPIRICAL RULE!` | μ = 100, σ = 15; what percent lie in 85–115? | Drag ±1σ onto the bell curve. | The area shades 68%. | Camel (hump) | Answering 95%. | Pick 68% |
| Exploring bivariate numerical data | S-08 | `RESIDUAL!` | Actual y = 12; the line predicts 10 at that x | Drag the point onto the line. Tap the vertical bar. | A vertical bar from the line up to the point. | Meerkat | Predicted − actual (−2). | Pick 2 |
| Exploring bivariate numerical data | S-09 | `LEAST SQUARES!` | r = 0.8, s_y = 10, s_x = 4; find the slope | Drag r onto s_y/s_x. Drag (x̄, ȳ) into the line equation for the intercept. | The line pivots through (x̄, ȳ). | Spider | r · s_x/s_y. | Pick 2 |
| Study design | S-10 | `RANDOMIZE!` **[WEAK FIT]** | Assign 10 subjects to 2 treatments | Judging study designs is open-ended. Closest playable version: tap a random-digit table, then drag each subject to the group the digit says. A companion bias-sorting round has the player drag scenarios into bins (convenience sample, voluntary response, and so on). | Subjects hop into groups. | Lab mice | Letting the subjects pick their own group. | Pick the design flaw |
| Probability | S-11 | `ADDITION RULE!` | P(A) = 0.5, P(B) = 0.4, P(A and B) = 0.2; find P(A or B) | Drag the circles to overlap; the overlap flashes as counted twice. Drag the overlap out once. | A Venn diagram double-shades the overlap. | Chameleons | Not subtracting the overlap (0.9). | Pick 0.7 |
| Probability | S-12 | `MULTIPLY PROBS!` | 4 red in 10 marbles; P(two reds) without replacement | Drag the first draw (4/10). The bag updates. Drag the second draw (3/9). Drag the two together to multiply. | A marble leaves the bag for good. | Magpie | 4/10 × 4/10 (with replacement). | Pick 2/15 |
| Probability | S-13 | `COMPLEMENT!` | P(at least one 6 in 4 rolls) | Drag "at least one" onto 1 −, which turns it into "no sixes". Drag (5/6)⁴. | The "none" region is cut out of the whole. | Raccoons (dice) | 4 × 1/6. | Pick 1 − (5/6)⁴ ≈ 0.518 |
| Counting, permutations, and combinations | — | — | See P-23, P-24, P-25 | | | | | |
| Random variables | S-14 | `EXPECTED VALUE!` | Win $10 with p = ¼; lose $2 with p = ¾ | Drag each value onto its probability, in either order. Drag the weighted chunks together. | Coins are weighted on a balance. | Raccoon | Averaging the values without weights (4). | Pick $1 |
| Random variables | S-15 | `BINOMIAL!` | n = 5, p = 0.3; P(X = 2) | Drag ₅C₂ (the number of paths). Drag p². Drag (1 − p)³. Any order. | A path grid lights every route with 2 successes. | Ducklings (5 crossings) | Leaving out ₅C₂. | Pick ≈ 0.309 |
| Random variables | S-16 | `ADD VARIANCES!` | SD(X) = 3, SD(Y) = 4, independent; SD(X − Y) | Drag Var X onto Var Y. They add even though the problem subtracts. Tap √. | The two squares pour together. | Tortoise (Pythagorean echo) | Subtracting the variances. | Pick 5 |
| Sampling distributions | S-17 | `STANDARD ERROR!` | σ = 12, n = 36; SE of the mean | Drag √n onto σ. | The bell curve narrows. | Hedgehog (narrower spines) | σ/n. | Pick 2 |
| Confidence intervals | S-18 | `CONFIDENCE INT!` | p̂ = 0.6, SE = 0.05, 95% | Drag z* = 1.96 onto SE to get the margin. Drag the margin onto p̂ in both directions. | The interval's arms extend from p̂. | Crab (arms) | Only adding the margin. | Pick 0.502 to 0.698 |
| Significance tests (hypothesis testing) | S-19 | `TEST STAT!` | p̂ = 0.6, p₀ = 0.5, SE = 0.05 | Drag p₀ onto p̂ (0.1). Drag SE onto the result to divide. | A σ ruler. | Owl (judge) | Subtracting in the wrong order. | Pick z = 2 |
| Significance tests (hypothesis testing) | S-20 | `P-VALUE!` | z = 2, two-sided; α = 0.05 | Drag z onto the curve; shade both tails. Drag α onto the p-value to compare. | Tails shade and the gavel falls. | Owl | Shading one tail only. | Pick ≈ 0.046 and "reject" |
| Two-sample inference for the difference between groups | S-21 | `TWO-SAMPLE T!` | s₁ = 6, n₁ = 36; s₂ = 8, n₂ = 64 | Drag s₁²/n₁ (1) and s₂²/n₂ (1) together, in either order. Tap √. | Two variance squares merge. | Twin otters | Adding the SDs directly. | Pick SE = √2 |
| Inference for categorical data (chi-square tests) | S-22 | `EXPECTED COUNT!` | Row total 40, column total 50, grand total 200 | Drag the row total onto the column total. Drag the grand total onto the product to divide. | A cell fills to 10. | Beavers | Row total × column total only. | Pick 10 |
| Inference for categorical data (chi-square tests) | S-23 | `CHI-SQUARE!` | Observed 30, 20; expected 25, 25 | Drag each observed count onto its expected count, in any order, to get (O − E)²/E chips. Drag the chips together. | Chips stack up on the χ² meter. | Beavers | Forgetting to divide by E. | Pick 2 |
| Advanced regression (inference and transforming) | S-24 | `LOG TRANSFORM!` | Exponential-looking scatter | Drag log onto the y-axis. Tap two points on the straightened line to get the slope. | The curve straightens into a line. | Mole | Taking the log of x instead. | Pick the linear model |
| Analysis of variance (ANOVA) | S-25 | `ANOVA!` **[partly WEAK FIT]** | 3 groups of 3 values each | The full computation is too long for one microgame. Closest playable version: drag each group mean onto the grand mean to make "between" squares, and each value onto its group mean to make "within" squares. Drag both piles onto the F ratio. | Squares split into two piles. | Three flocks of birds | Using the group SDs instead of squared deviations. | Pick F |

---

## AP Calculus AB (KA: "AP®︎/College Calculus AB", /math/ap-calculus-ab)

Source: KA blog "Free Math Worksheets" (8 content units, plus "AP Calculus AB solved free response questions from past exams" and "AP®︎ Calculus AB Standards mappings"). KA's Calculus 1 course (8 units: Limits and continuity; Derivatives: definition and basic rules; Derivatives: chain rule and other advanced topics; Applications of derivatives; Analyzing functions; Integrals; Differential equations; Applications of integrals) has the same content, so these microgames cover it.

| Unit | ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|---|
| 1 Limits and continuity | C-01 | `LIMIT!` | lim x→3 of (x² − 9)/(x − 3) | Drag 3 in (giving 0/0, shown as a cracked tile). Tap the numerator to FACTOR! it. Drag (x − 3) onto (x − 3) to cancel. Drag 3 in again. | A sloth creeps along the curve toward the hole at x = 3. | Sloth | Stopping at "undefined" or 0. | Pick 6 |
| 1 | C-02 | `CONJUGATE!` | lim x→0 of (√(x + 4) − 2)/x | Drag the conjugate (√(x + 4) + 2) onto the top and the bottom. Cancel x. Substitute. | The radicals annihilate in the numerator. | Sloth | Rationalising only the numerator. | Pick ¼ |
| 1 | C-03 | `SQUEEZE!` | lim x→0 of x² sin(1/x) | Drag −x² and x² onto the graph as bounds. Drag the limit onto both bounds. | Two walls squeeze the wiggly curve to 0. | Python (squeezes) | "Does not exist". | Pick 0 |
| 1 | C-04 | `LIMIT AT INF!` | (3x² + 1)/(5x² − x) as x → ∞ | Drag ÷x² onto every term, in any order. Small terms fade. | 1/x² terms shrink to dust. | Sloth | ∞. | Pick 3/5 |
| 1 | C-05 | `IVT!` **[WEAK FIT]** | f(1) = −2, f(4) = 3, f is continuous; must f have a zero in between? | An existence theorem has nothing to compute. Closest playable version: drag the horizontal line y = 0 between the endpoint values; the continuous curve is forced to cross it; tap the crossing interval. | The curve stretches between the endpoints and has to cross. | Spider (thread) | Using the theorem on a discontinuous function. | Pick "yes" |
| 2 Differentiation: definition and basic derivative rules | C-06 | `LIMIT DEF!` | f(x) = x² at x = 3 via the limit definition | Drag h into f(3 + h) − f(3). Expand. Drag h onto h to cancel it. Drag h → 0. | The secant line rotates into the tangent line. | Hummingbird (instant speed) | Setting h = 0 before cancelling (0/0). | Pick 6 |
| 2 | C-07 | `POWER RULE!` **[PLANNED]** | d/dx 4x³ (polynomial variant: d/dx (4x³ − 2x + 7)) | Drag the exponent 3 onto the coefficient 4; they multiply to 12, and the exponent drops to 2 as a "−1" chip falls off. For the polynomial, drag d/dx onto each term in any order (sum rule); the constant pops. | The exponent leaps down like a diver. | Hummingbird or cheetah | Lowering the exponent without multiplying (4x²), or multiplying by the new exponent (8x²). | Pick 12x² |
| 2 | C-08 | `SUM RULE!` | d/dx (x⁵ − 3x² + 7) | Drag d/dx onto each term, in any order. | d/dx splits into three copies. | Hummingbird | d/dx 7 = 7. | Pick 5x⁴ − 6x |
| 2 | C-09 | `PRODUCT RULE!` | d/dx [x² sin x] | Drag d/dx onto the first factor (the other is held fixed): 2x sin x. Drag d/dx onto the second: x² cos x. Either order. Tap +. | One factor freezes while the other changes, then they swap roles. | Two otters holding hands | (2x)(cos x), the product of the derivatives. | Pick 2x sin x + x² cos x |
| 2 | C-10 | `QUOTIENT RULE!` | d/dx [x/(x + 1)] | Drag d/dx onto the top ("low d-high"). Drag d/dx onto the bottom ("high d-low"). Drag the subtraction into place. Drag (low)² underneath. The order of the subtraction matters. | A chant meter reads "low d-high minus high d-low". | Two otters | Reversing the subtraction (wrong sign). | Pick 1/(x + 1)² |
| 2 | C-11 | `TRIG DERIV!` | d/dx sin x | Drag the slope probe along sin x. | The slope plot traces out cos x. | Snake | −cos x. | Pick cos x |
| 3 Differentiation: composite, implicit, and inverse functions | C-12 | `CHAIN RULE!` **[PLANNED]** | d/dx (3x + 1)⁵ | Drag d/dx onto the outer layer, the power, to get 5(3x + 1)⁴; the inner shell stays intact. Drag d/dx onto the inner layer 3x + 1 to get × 3. Tap to multiply: 15(3x + 1)⁴. Outer then inner is the convention. Inner first is also accepted, because the factors multiply in any order. | Nested shells. The outer shell opens, the inner one is differentiated, and the factors chain together. | Hermit crab (shell inside a shell) | Forgetting the inner derivative, 5(3x + 1)⁴. Or differentiating the inside while it is still inside, 5(3)⁴. | Pick each factor |
| 3 | C-13 | `IMPLICIT DIFF!` | x² + y² = 25; find dy/dx | Drag d/dx onto each term, in any order. The y-terms sprout a dy/dx tag. Then drag terms to isolate dy/dx. | A dy/dx flag pops up on every y. | Hermit crab | d/dx y² = 2y (missing the dy/dx). | Pick −x/y |
| 3 | C-14 | `INVERSE DERIV!` | f(x) = x³ + x; find (f⁻¹)′(2) | Tap f(1) = 2 to find the matching point. Drag f′(1) = 4 onto the "1 over" slot. | The tangent line reflects across y = x and its slope flips. | Salmon | 1/f′(2). | Pick ¼ |
| 4 Contextual applications of differentiation | C-15 | `RELATED RATES!` | Balloon: r = 5, dr/dt = 2; find dV/dt | Drag d/dt onto both sides of V = ⁴⁄₃πr³. Drag the values into the result, in any order. | The balloon inflates and both rate gauges spin. | Pufferfish | Plugging r in before differentiating. | Pick 200π |
| 4 | C-16 | `L'HOPITAL!` | lim x→0 of sin x / x | Confirm 0/0. Drag d/dx onto the top and onto the bottom separately. Substitute. | The top and bottom each turn into their own derivative. | Sloth | Applying the quotient rule. | Pick 1 |
| 4 | C-17 | `LINEARIZE!` | Approximate √4.1 | Drag the tangent line at 4 onto the curve. Drag 0.1 along the line. | The tangent line hugs the curve. | Hummingbird | Using the slope at 4.1. | Pick 2.025 |
| 5 Applying derivatives to analyze functions | C-18 | `CRITICAL POINT!` | f(x) = x³ − 3x | Drag d/dx onto f (3x² − 3). Drag = 0 onto it and solve (±1). Drag test points into each interval of the sign chart, in any order. | A roller-coaster car climbs and descends over the sign chart. | Mountain goat | Using the zeros of f instead of f′. | Pick max at −1, min at 1 |
| 5 | C-19 | `2ND DERIV TEST!` | f″ = 6x at x = ±1 | Drag each critical point into f″, in either order. | Smile and frown faces show the concavity. | Mountain goat | Mixing up concave up and maximum. | Pick max / min |
| 5 | C-20 | `OPTIMIZE!` **[partly WEAK FIT]** | Maximise A(x) = x(10 − x) (a fence with perimeter 20) | Writing the model is open-ended, so it is given. Drag d/dx, then = 0, then plug the result back in. | The rectangle morphs while the area meter peaks. | Beaver (fence) | Answering with x instead of the area. | Pick 25 |
| 5 | C-21 | `MVT!` **[WEAK FIT]** | f(x) = x² on [0, 2]; find c | Closest playable version: drag the secant (slope 2) down parallel to itself until it becomes a tangent. Solve f′(c) = 2. | The secant slides into a tangent position. | Hummingbird | Using f(c) = 2. | Pick c = 1 |
| 6 Integration and accumulation of change | C-22 | `RIEMANN SUM!` | Left sum of x² on [0, 4] with 4 rectangles | Tap "left". Drag each rectangle's height onto its width, in any order. Drag the areas together. | Rectangles rise under the curve. | Beaver | Using right-hand heights. | Pick 14 |
| 6 | C-23 | `REVERSE POWER!` | ∫ 6x² dx | Drag +1 onto the exponent (x³). Drag the new exponent under the coefficient (6/3 = 2). Tap + C. | The power rule runs backward: the exponent climbs up. | Hummingbird | Forgetting to divide, or forgetting + C. | Pick 2x³ + C |
| 6 | C-24 | `FTC!` | ∫₁³ 2x dx | Run REVERSE POWER! to get x². Drag 3 and 1 into the upper and lower slots. Subtract upper minus lower. | Area fills, and the antiderivative meter jumps from F(1) to F(3). | Ants (collecting crumbs) | F(1) − F(3). | Pick 8 |
| 6 | C-25 | `U-SUBSTITUTION!` | ∫ 2x(x² + 1)⁵ dx | Tap x² + 1 to mark it as u. Drag du = 2x dx onto the 2x dx. REVERSE POWER! in u. Drag x² + 1 back in for u. | The inner piece hides in a u-box. | Hermit crab | Not replacing dx. | Pick (x² + 1)⁶/6 + C |
| 6 | C-26 | `ACCUMULATE!` | ∫₀⁶ v(t) dt from a velocity graph | Tap each region, in any order. Regions below the axis count as negative. | Area tiles stack up; the negative tiles are a different colour. | Ants | Counting all area as positive (that is distance, not displacement). | Pick the net change |
| 7 Differential equations | C-27 | `SLOPE FIELD!` | dy/dx = x − y | Tap grid points, in any order, to draw slope segments. Drag a starting point; the solution curve follows the field. | Segments sprout; a leaf floats along the field. | Salmon (follows the current) | Computing y − x. | Pick the matching field |
| 7 | C-28 | `SEPARATE!` | dy/dx = ky | Drag y to the dy side and dx to the other side. Drag ∫ onto both sides, in either order. Exponentiate. | The variables walk to opposite sides of the =. | Rabbits (growth) | Forgetting + C, or putting a C on both sides. | Pick y = Ce^(kx) |
| 8 Applications of integration | C-29 | `AREA BETWEEN!` | y = x and y = x² on [0, 1] | Drag top minus bottom into the integrand. Integrate. | The strip between the curves fills. | Beaver | Bottom minus top. | Pick 1/6 |
| 8 | C-30 | `DISC METHOD!` | y = √x on [0, 4], rotated about the x-axis | Drag the region onto the axis to spin it. Drag πr² into the integral. Integrate. | Coin-like discs stack into a solid. | Beaver (gnaws a cone) | Using 2πr. | Pick 8π |
| 8 | C-31 | `WASHER!` | The region between y = x and y = x², rotated about the x-axis | Drag the outer radius and the inner radius into π(R² − r²). Integrate. | Discs with holes stack up. | Beaver | π(R − r)². | Pick 2π/15 |
| 8 | C-32 | `AVERAGE VALUE!` | Average of x² on [0, 3] | Drag ∫ (9) onto the width 3 to divide. | The area levels into a rectangle. | Beaver (levels the pond) | (f(0) + f(3))/2. | Pick 3 |

## AP Calculus BC additions (KA: "AP®︎/College Calculus BC", /math/ap-calculus-bc)

Source: KA blog. BC has the same first 8 units as AB, plus Unit 9 "Parametric equations, polar coordinates, and vector-valued functions" and Unit 10 "Infinite sequences and series" (then "AP Calculus BC solved exams" and standards mappings). BC also covers more integration techniques in Unit 6 and arc length in Unit 8. KA's Calculus 2 course (Integrals review; Integration techniques; Differential equations; Applications of integrals; Parametric equations, polar coordinates, and vector-valued functions; Series) is covered by the AB and BC rows together.

| Unit | ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|---|
| 6 (BC topics) | BC-01 | `BY PARTS!` | ∫ x eˣ dx | Tap u = x (the LIATE order). Tap dv = eˣ dx. Drag d onto u and ∫ onto dv, in either order. Assemble uv − ∫v du. | Two tiles swap roles and the leftover integral shrinks. | Two otters | Choosing u = eˣ, which loops forever. | Pick xeˣ − eˣ + C |
| 6 | BC-02 | `PARTIAL FRAC!` | 1/(x² − 1) | FACTOR! the denominator. Use the cover-up method: tap a factor to cover it and plug in its root, in either order. | The fraction splits into two simpler fractions. | Crab (two claws) | A = B = 1. | Pick ½/(x − 1) − ½/(x + 1) |
| 6 | BC-03 | `IMPROPER!` | ∫₁^∞ 1/x² dx | Drag ∞ out and replace it with b. Integrate. Drag b → ∞. | The area tail fades to nothing. | Sloth | Plugging in ∞ directly. | Pick 1 |
| 7 (BC topic) | BC-04 | `EULER'S METHOD!` | dy/dx = y, y(0) = 1, step 0.5, two steps | Drag the slope onto the step (repeated twice; the order is fixed). | The path walks along tangent segments. | Kangaroo | Using the slope at the new point too early. | Pick 2.25 |
| 8 (BC topic) | BC-05 | `ARC LENGTH!` | Length of y = x^(3/2) on [0, 4] | Drag d/dx onto y. Drag the result into √(1 + (y′)²). Integrate. | A string is laid along the curve and then straightened. | Snail (slime trail) | Leaving out the 1 +. | Pick (80√10 − 8)/27 |
| 9 Parametric equations, polar coordinates, and vector-valued functions | BC-06 | `PARAMETRIC!` | x = t², y = t³; find dy/dx | Drag d/dt onto x and onto y, in either order. Drag dy/dt onto dx/dt to divide. | A point traces the curve while its two speed gauges run. | Dragonfly | (dx/dt)/(dy/dt). | Pick 3t/2 |
| 9 | BC-07 | `POLAR AREA!` | Area of r = 2 for θ from 0 to π/2 | Drag r² into ½∫ … dθ. Integrate. | Pizza-slice sectors fill the region. | Mouse | Leaving out the ½. | Pick π |
| 9 | BC-08 | `VELOCITY!` | r(t) = ⟨t², sin t⟩ | Drag d/dt onto each component, in either order. | The velocity arrow rides along the path. | Dragonfly | Differentiating only one component. | Pick ⟨2t, cos t⟩ |
| 10 Infinite sequences and series | BC-09 | `GEOMETRIC SER!` | Σ from n = 0 to ∞ of 3(½)ⁿ | Drag a = 3 and r = ½ into a/(1 − r), in either order. | Each term fills half of the remaining bar. | Rabbits (halving) | a/(1 + r). | Pick 6 |
| 10 | BC-10 | `RATIO TEST!` | Σ n/2ⁿ | Drag a(n+1) onto aₙ. Simplify. Drag n → ∞. | The ratio meter settles at ½. | Sloth | Comparing aₙ with 0 instead. | Pick L = ½, converges |
| 10 | BC-11 | `NTH TERM TEST!` | Σ n/(n + 1) | Drag n → ∞ onto the term. | The terms approach 1, so the sum grows without bound. | Sloth | Concluding "converges" because the terms are small. | Pick "diverges" |
| 10 | BC-12 | `TAYLOR SERIES!` | eˣ about 0, through x³ | Drag d/dx repeatedly (the order is fixed); every derivative at 0 is 1. Drag n! under each term. | The polynomial hugs the curve a little more with each term. | Chameleon (copies the curve) | Forgetting the n!. | Pick 1 + x + x²/2 + x³/6 |
| 10 | BC-13 | `ALTERNATING!` | Error bound after 3 terms of 1 − ½ + ⅓ − ¼ … | Tap the first omitted term. | The partial sums zigzag toward the limit. | Bat (back and forth) | Using the last kept term. | Pick ¼ |

---

## Multivariable calculus (KA: "Multivariable calculus", /math/multivariable-calculus)

Source: KA blog "Free Math Worksheets" (5 units).

| Unit | ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|---|
| Thinking about multivariable functions | MV-01 | `CONTOUR!` | f(x, y) = x² + y²; level curve c = 4 | Drag c onto the surface. A circle of radius √4 is cut out. | A water level rises on the bowl; the contour is drawn on the floor. | Duck (floats on the level) | Radius 4. | Pick radius 2 |
| Thinking about multivariable functions | MV-02 | `VECTOR FIELD!` | F(x, y) = ⟨−y, x⟩ | Tap points, in any order, to draw an arrow at each. | The arrows swirl; leaves circle around. | Whirligig beetles | ⟨y, −x⟩ (the swirl goes the wrong way). | Pick the field |
| Derivatives of multivariable functions | MV-03 | `PARTIAL DERIV!` | ∂/∂x of x²y³ | Drag ∂/∂x onto the expression. y freezes into an ice block (it is treated as a constant). Then use POWER RULE! on x. | The ice block stays still while x changes. | Polar bear | Differentiating y too. | Pick 2xy³ |
| Derivatives of multivariable functions | MV-04 | `GRADIENT!` | ∇(x² + y²) at (1, 2) | Drag ∂/∂x and ∂/∂y onto f, in either order. Drag the point in. | An arrow appears pointing straight uphill. | Mountain goat | Using the point's coordinates as the gradient. | Pick ⟨2, 4⟩ |
| Derivatives of multivariable functions | MV-05 | `DIRECTIONAL!` | The same f and point, direction u = ⟨3/5, 4/5⟩ | Compute GRADIENT!. Drag u onto ∇f (a DOT PRODUCT!). | The gradient's shadow falls onto u. | Mountain goat | Using a direction that is not a unit vector. | Pick 22/5 |
| Derivatives of multivariable functions | MV-06 | `DIVERGENCE!` | div ⟨x², xy⟩ | Drag ∂/∂x onto P and ∂/∂y onto Q, in either order. Add. | Particles spread out from a source. | Fireflies | ∂P/∂y + ∂Q/∂x. | Pick 3x |
| Derivatives of multivariable functions | MV-07 | `CURL!` | 2D curl of ⟨−y, x⟩ | Drag ∂/∂x onto Q and ∂/∂y onto P, in either order. Subtract. | A paddle wheel spins. | Otter (spins in a current) | Adding instead of subtracting. | Pick 2 |
| Derivatives of multivariable functions | MV-08 | `JACOBIAN!` | (r, θ) → (x, y) | Drag each ∂ into the 2 × 2 grid, in any order. Run DETERMINANT!. | A small grid cell stretches by a factor of r. | Spider (web cell) | Getting 1. | Pick r |
| Applications of multivariable derivatives | MV-09 | `TANGENT PLANE!` | z = x² + y² at (1, 1) | Run GRADIENT! (2, 2). Drag it into z = f + fx(x − 1) + fy(y − 1). | A flat board lands on the bowl. | Mountain goat | Using the gradient at (0, 0). | Pick the plane equation |
| Applications of multivariable derivatives | MV-10 | `LAGRANGE!` | Maximise xy subject to x + y = 10 | Drag ∇f and ∇g into ∇f = λ∇g. Solve. | The level curves slide until one is tangent to the constraint. | Mountain goat | Forgetting the constraint. | Pick (5, 5), max 25 |
| Applications of multivariable derivatives | MV-11 | `2ND PARTIALS!` | f = x² − y² at (0, 0) | Drag f_xx, f_yy and f_xy into D, in any order. | The surface shows a saddle shape. | Horse (saddle) | Calling it a minimum. | Pick "saddle point" |
| Integrating multivariable functions | MV-12 | `ITERATED INT!` | ∫₀¹ ∫₀² xy dy dx | Drag ∫ dy onto xy (inner first, giving 2x). Then drag ∫ dx. Swapping the order (Fubini) is accepted on rectangles: drag dx dy to swap. | Slices sweep across, then stack into a volume. | Beaver (slices bread) | Integrating in x with the y bounds. | Pick 1 |
| Integrating multivariable functions | MV-13 | `LINE INTEGRAL!` | ∫ F · dr with F = ⟨y, x⟩ along r(t) = ⟨t, t²⟩, t from 0 to 1 | Drag r(t) into F. Drag r′(t) on. DOT PRODUCT!. Integrate. | A bead slides along a wire, pushed by the field. | Ant (walks the wire) | Leaving out r′(t). | Pick 1 |
| Integrating multivariable functions | MV-14 | `POLAR INTEGRAL!` | Area of the disc r ≤ 2 | Drag dA = r dr dθ into the integral. Integrate the inner and outer integrals. | Polar cells grow with r. | Spider (web) | Leaving out the extra r. | Pick 4π |
| Integrating multivariable functions | MV-15 | `FLUX!` | Flux of ⟨0, 0, 1⟩ through the unit square in the xy-plane | Drag the normal n onto F (DOT PRODUCT!). Integrate over the area. | Rain falls straight through a window. | Duck (in the rain) | Using a tangent vector instead of the normal. | Pick 1 |
| Green's, Stokes', and the divergence theorems | MV-16 | `GREEN'S THM!` **[theorem; playable as convert-and-compute]** | ∮ F · dr with F = ⟨−y, x⟩ around the unit square | Drag the boundary integral onto the region. It becomes ∬ curl dA. Compute it. | Tiny circulation cells inside the square cancel each other, and only the boundary is left. | Otters (spinning) | Using the divergence. | Pick 2 |
| Green's, Stokes', and the divergence theorems | MV-17 | `STOKES!` | ∮ around the boundary of a surface (simple field) | Drag the line integral onto the surface to turn it into the flux of the curl. | Cells cancel on a curved cap. | Otters | Pointing the normal the wrong way. | Pick the value |
| Green's, Stokes', and the divergence theorems | MV-18 | `DIVERGENCE THM!` | Outward flux of ⟨x, y, z⟩ through the unit sphere | Drag the surface integral onto the ball. It becomes ∭ div dV = 3 × volume. | Sources inside push flow out through the skin. | Pufferfish | Using the surface area instead of the volume. | Pick 4π |

---

## Differential equations (KA: "Differential equations", /math/differential-equations)

Source: KA blog "Free Math Worksheets" (3 units).

| Unit | ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|---|
| First order differential equations | — | — | See C-27 (slope fields), C-28 (separable), BC-04 (Euler's method) | | | | | |
| First order differential equations | DE-01 | `INTEG FACTOR!` | y′ + 2y = eˣ | Drag e^(∫2 dx) = e^(2x) onto both sides. The left side snaps into (ye^(2x))′, which is the product rule run in reverse. Integrate. Divide. | Product-rule tiles click together. | Two otters | Multiplying only the left side by the factor. | Pick y = eˣ/3 + Ce^(−2x) |
| First order differential equations | DE-02 | `EXACT!` | 2xy dx + x² dy = 0 | Drag ∂/∂y onto M and ∂/∂x onto N, in either order; both give 2x. Then integrate M with respect to x. | Two puzzle halves match. | Beaver | Integrating M with respect to y. | Pick x²y = C |
| Second order linear equations | DE-03 | `CHARACTERISTIC!` | y″ − 5y′ + 6y = 0 | Drag the guess e^(rx) into the equation. Each derivative pulls down an r. FACTOR! the result (r² − 5r + 6). | r's drop down out of the exponent, like the power rule. | Kangaroo (bounces) | Sign errors such as e^(−2x). | Pick c₁e^(2x) + c₂e^(3x) |
| Second order linear equations | DE-04 | `COMPLEX ROOTS!` | y″ + 2y′ + 5y = 0 | Run CHARACTERISTIC! and QUAD FORMULA!, giving −1 ± 2i. Drag the real part into e^(…) and the imaginary part into cos and sin. | A damped spring spirals in. | Kangaroo on a pogo stick | Writing e^(2ix) without converting it to real form. | Pick e^(−x)(c₁cos 2x + c₂sin 2x) |
| Second order linear equations | DE-05 | `UNDETERMINED!` | y″ + y = 5e^(2x) | Drag the guess Ae^(2x) into the equation. Solve 5A = 5. | The guess tile is weighed on a balance. | Elephant | Guessing Ae^x. | Pick A = 1 |
| Laplace transform | DE-06 | `LAPLACE!` | y′ + y = 0, y(0) = 1 | Drag ℒ onto both sides. This gives sY − 1 + Y = 0. Solve for Y. Apply ℒ⁻¹ from the table. | The equation drops through a portal into s-space and comes back. | Mole (tunnels through) | ℒ{y′} = sY with the −y(0) left out. | Pick y = e^(−t) |
| Laplace transform | DE-07 | `INV LAPLACE!` | 1/(s(s + 1)) | PARTIAL FRAC! first. Then drag each piece onto its table entry, in either order. | Table cards flip over. | Mole | Taking the inverse of each factor and multiplying them. | Pick 1 − e^(−t) |
| Laplace transform | DE-08 | `CONVOLUTION!` **[WEAK FIT]** | ℒ⁻¹{1/s²} written as 1 * 1 | Closest playable version: drag one function, flipped, across the other; the overlap area traces the result. | A sliding window. | Caterpillar | Multiplying the functions pointwise. | Pick t |

---

## Linear algebra (KA: "Linear algebra", /math/linear-algebra)

Source: KA blog "Free Math Worksheets" (3 units).

| Unit | ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|---|
| Vectors and spaces | — | — | See P-08 (TIP-TO-TAIL!, planned vector addition) and P-09 | | | | | |
| Vectors and spaces | LA-01 | `LINEAR COMBO!` | 2⟨1, 0⟩ + 3⟨1, 2⟩ | Drag 2 and 3 onto the two vectors, in either order. Then TIP-TO-TAIL!. | The arrows stretch, then chain. | Geese | ⟨5, 2⟩. | Pick ⟨5, 6⟩ |
| Vectors and spaces | LA-02 | `DOT PRODUCT!` | ⟨1, 2, 3⟩ · ⟨4, 5, 6⟩ | Drag one vector onto the other. Matching components pair up. Tap each pair, in any order. Drag the products together. | The projection's shadow is drawn and the pairs zip together. | Monkeys | Producing a vector ⟨4, 10, 18⟩. | Pick 32 |
| Vectors and spaces | LA-03 | `CROSS PRODUCT!` | ⟨1, 2, 3⟩ × ⟨4, 5, 6⟩ | Cover the i column, then j, then k (any order). Each cover leaves a 2 × 2 DETERMINANT!. The j term gets a sign flip. | A right-hand rule hand appears; the result arrow stands up perpendicular to both. | Owl | Forgetting the minus on j. | Pick ⟨−3, 6, −3⟩ |
| Vectors and spaces | LA-04 | `RREF!` | [[1, 2 \| 5], [3, 4 \| 6]] | Drag a row onto another row to add a multiple of it. Tap a row to scale it. Drag to swap rows. Many orders lead to the same RREF. | Pivots light up; zeros wipe in below them. | Sheepdog (herds the rows) | Adding a row to itself. | Pick each pivot |
| Vectors and spaces | LA-05 | `INDEPENDENCE!` | Are ⟨1, 2⟩ and ⟨2, 4⟩ independent? | Drag the vectors into a matrix. Run RREF!. A zero row means they are dependent. | One arrow lies on top of the other. | Geese | Answering "independent" because neither vector is 0. | Pick "dependent" |
| Vectors and spaces | LA-06 | `NULL SPACE!` | Null space of [[1, 2], [2, 4]] | Run RREF!. Tap the free variable. Drag it into the parametric form. | The whole line through ⟨−2, 1⟩ gets squashed to 0. | Mole | Answering {0}. | Pick span{⟨−2, 1⟩} |
| Matrix transformations | LA-07 | `TRANSFORM!` | A = [[2, 1], [0, 3]] times v = ⟨1, 2⟩ | Drag v's x-component onto column 1 to scale it. Drag the y-component onto column 2 to scale it. Either order. Then TIP-TO-TAIL! the scaled columns. | The column picture: the grid deforms. | Geese | Multiplying v by the rows the wrong way. | Pick ⟨4, 6⟩ |
| Matrix transformations | LA-08 | `COFACTOR!` | 3 × 3 determinant [[1, 2, 3], [0, 1, 4], [5, 6, 0]] | Tap a row or column to expand along (any choice is valid). Each tap shows a 2 × 2 DETERMINANT!. Apply the checkerboard signs. | A cube deforms and its volume meter reads the determinant. | Beaver | Ignoring the checkerboard signs. | Pick 1 |
| Matrix transformations | LA-09 | `INVERSE MATRIX!` | 3 × 3 inverse via [A \| I] | Run RREF! on the augmented matrix. | I appears on the left side and A⁻¹ on the right. | Salmon | Row-reducing only A. | Pick an entry |
| Matrix transformations | LA-10 | `TRANSPOSE!` | [[1, 2, 3], [4, 5, 6]]ᵀ | Drag the matrix across its diagonal. | Entries flip over the diagonal like pancakes. | Flamingo (mirror) | Reversing the rows instead. | Pick the 3 × 2 result |
| Alternate coordinate systems (bases) | LA-11 | `CHANGE BASIS!` | ⟨3, 1⟩ in the basis {⟨1, 1⟩, ⟨1, −1⟩} | Drag the basis vectors into a matrix. Solve with ELIMINATION!. | The grid re-draws along the new axes. | Geese | Swapping the coordinates. | Pick [2, 1] |
| Alternate coordinate systems (bases) | LA-12 | `PROJECTION!` | Project ⟨3, 4⟩ onto ⟨1, 1⟩ | DOT PRODUCT! v·u (7) and u·u (2), in either order. Drag the ratio onto u. | A flashlight casts v's shadow onto u. | Owl | Dividing by \|u\| instead of \|u\|². | Pick ⟨7/2, 7/2⟩ |
| Alternate coordinate systems (bases) | LA-13 | `GRAM-SCHMIDT!` | v₁ = ⟨1, 1⟩, v₂ = ⟨1, 0⟩ | Drag PROJECTION! of v₂ onto v₁. Subtract it from v₂. Normalise (optional in easy mode). | The shadow is cut off and the remainder stands at 90°. | Owl | Subtracting the projection from v₁. | Pick ⟨½, −½⟩ |
| Alternate coordinate systems (bases) | LA-14 | `EIGENVALUE!` | Eigenvalues of [[2, 1], [1, 2]] | Drag −λ onto each diagonal entry, in either order. Run DETERMINANT!. FACTOR!. | The grid transforms, and the arrows on the eigenvector lines stay on their lines. | Chameleon | Subtracting λ from every entry. | Pick 1 and 3 |

---

## Beyond Khan Academy: extra topics that fit the format

These topics are not in the KA courses listed above. Each fits the tap-and-drag format and connects to KA skills.

### Abstract algebra
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| X-01 | `SYMMETRY GROUP!` **[PLANNED: composing triangle symmetries]** | r ∘ s = ? on a triangle with labelled corners 1, 2, 3 (r = rotation by 120°, s = a reflection) | Drag s onto the triangle; it flips. Drag r onto the triangle; it rotates. Apply right to left, so s goes first. The result matches one of 6 ghost outlines; tap the matching Cayley-table cell. Applying r first is a valid computation, but of s ∘ r. The game shows that it gives a different reflection, which teaches non-commutativity. | Ghost outlines of all 6 symmetries hover; the moving triangle lands on one of them. | Starfish (or a penguin spinning on ice) | Doing r first and calling the result r ∘ s. | Pick the cell |
| X-02 | `CAYLEY TABLE!` | Fill one row of the table for ℤ₄ | Drag each column element onto the row element, in any order. | Clock hands add up. | Owl | Writing 5 instead of 1. | Pick each entry |
| X-03 | `GROUP INVERSE!` | Inverse of r (rotation by 120°) in D₃ | Drag candidates onto r until the identity outline lights up. | The triangle returns home. | Starfish | Answering r itself. | Pick r² |
| X-04 | `MODULO!` | 9 + 5 (mod 12); 17 mod 5 | Drag 5 onto the clock hand at 9; it wraps past 12. For 17 mod 5, drag 5s off 17 until less than 5 is left. | The hand passes 12 and keeps going. | Rooster (clock) | 14. | Pick 2 |
| X-05 | `MOD INVERSE!` | 3⁻¹ (mod 7) | Drag 3 onto each candidate, in any order, until the product ≡ 1. | The clock lands on 1. | Rooster | Answering ⅓. | Pick 5 |
| X-06 | `CYCLE NOTATION!` | (1 2 3)(2 3) | Drag each element through the cycles, right to left, in any element order. | Animals swap seats according to each cycle. | Penguins (musical chairs) | Composing left to right, which gives (1 3). | Pick (1 2) |
| X-07 | `ELEMENT ORDER!` | Order of 4 in ℤ₁₂ | Drag +4 onto 0 repeatedly until the result is back at 0. | Hops go around the clock. | Kangaroo | Answering 4. | Pick 3 |
| X-08 | `PARITY!` | Is (1 2 3) even or odd? | Drag the cycle onto the transposition splitter: (1 3)(1 2). Count the pieces. | The cycle splits into swaps. | Penguins | Calling it odd because it has 3 elements. | Pick "even" |

### Number theory
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| X-09 | `EUCLID!` | gcd(252, 105) | Drag 105 onto 252; it subtracts as many times as it fits, leaving remainder 42. Drag 42 onto 105, leaving 21. Drag 21 onto 42, leaving 0. The order is fixed. | A 252 × 105 rectangle fills with the largest squares that fit, and the smallest square is the gcd. | Tortoise (square shell) | Stopping at a remainder, or reporting a quotient. | Pick each remainder |
| X-10 | `PRIME FACTOR!` | 360 | Tap any composite number to split it into any factor pair. Any tree is accepted; every tree ends in 2³ · 3² · 5. | A factor tree grows; leaves that are primes glow. | Squirrel (tree) | Splitting into 1 × 360 (it bounces off). | Pick the prime factorisation |
| X-11 | `LCM!` | lcm(12, 18) | PRIME FACTOR! both numbers, in either order. Drag the larger power of each prime into the answer. | The two prime towers merge, keeping the taller of each. | Beavers | Multiplying the numbers (216). | Pick 36 |
| X-12 | `SIEVE!` | Primes up to 50 | Tap the smallest uncrossed number; its multiples are crossed out. Repeat. | Multiples fall through a sieve. | Chickens (peck the multiples) | Crossing out the prime itself. | Pick the next prime |
| X-13 | `DIVISIBILITY!` | Is 4,371 divisible by 3? By 9? | Drag the digits together into their sum (15). Drag 3 and then 9 onto the sum. | The digit sum spins like a slot machine. | Magpie | Using the last digit. | Pick yes / no |
| X-14 | `BEZOUT!` | Write 21 = 252a + 105b | Run EUCLID! forward. Then drag each remainder equation back into the previous one (back-substitution). | The steps unwind like a spring. | Tortoise | Sign errors. | Pick a = −2, b = 5 |

### Discrete math
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| X-15 | `TRUTH TABLE!` | p → q | Drag each (p, q) row, in any order, into the → gate. | A gate opens or stays shut for each row. | Owl | Calling F → F false. | Pick each output |
| X-16 | `DE MORGAN!` | ¬(p ∧ q) | Drag the ¬ onto the parentheses. It distributes and flips ∧ to ∨. | The ¬ splits in two, and ∧ turns upside down into ∨. | Bat | ¬p ∧ ¬q. | Pick ¬p ∨ ¬q |
| X-17 | `INTERSECT!` | A = {1, 2, 3, 4}, B = {3, 4, 5}; find A ∩ B and A ∪ B | Drag each element into the Venn diagram, in any order. Tap the region you want. | Elements float into regions. | Chipmunks (sorting nuts) | Listing 3 and 4 twice in A ∪ B. | Pick each set |
| X-18 | `INCL-EXCL!` | \|A\| = 20, \|B\| = 15, \|A ∩ B\| = 5; find \|A ∪ B\| | Drag A onto B; the overlap glows as counted twice. Drag the overlap out. | The same picture as S-11, with counts instead of probabilities. | Chameleons | 35. | Pick 30 |
| X-19 | `HANDSHAKE!` | Vertex degrees 3, 3, 2, 2; how many edges? | Tap each vertex, in any order, to count its edge ends. Drag the sum onto ÷2. | Every edge has two ends, so each edge lights up twice. | Ants (shaking feelers) | Using the degree sum as the answer (10). | Pick 5 |
| X-20 | `SHORTEST PATH!` | Weighted graph from A to F | Tap the nearest unvisited node. The labels update. Repeat (Dijkstra's algorithm; when there is a tie, either choice is accepted). | Tentative distances shrink as the frontier spreads. | Ant colony | Taking the route with the fewest edges. | Pick each label |
| X-21 | `EULER PATH!` | Does this graph have an Euler path? | Tap each vertex to count its degree. Then trace a path, starting at an odd-degree vertex. | Each edge is drawn once. | Spider (one thread) | Starting at an even-degree vertex. | Pick yes / no |
| X-22 | `GRAPH COLOR!` | 3-colour this map | Drag colours onto the regions, in any order. Clashing neighbours flash. | Paint spreads over each region. | Chameleons | Two neighbours with the same colour. | Pick the chromatic number |
| X-23 | `PIGEONHOLE!` **[WEAK FIT]** | 10 pigeons in 9 holes | The principle is a proof. Closest playable version: drag pigeons into holes in any arrangement; whatever the player does, some hole ends up with 2 pigeons. | Pigeons squabble in the doubled hole. | Pigeons | Thinking a lucky arrangement avoids it. | Pick "at least 2" |
| X-24 | `STARS & BARS!` | Share 5 cookies among 3 kids | Drag 2 bars into any 2 of the 7 slots. Then run COMBINATION! (₇C₂). | Each arrangement of bars shows a sharing of the cookies. | Mice | ₅C₃. | Pick 21 |
| X-25 | `PASCAL!` | Fill row 5 of Pascal's triangle | Drag each pair of neighbours down into the cell below, in any order. | Each cell is the sum of the two above it. | Bees (triangular comb) | Multiplying the pair instead of adding. | Pick each entry |

### Complex numbers as rotations
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| X-26 | `QUARTER TURN!` | (3 + 2i) · i (multiplying by i) | Drag i onto the point. | The point rotates 90° counter-clockwise; (3, 2) becomes (−2, 3). | Owl | 3i + 2i (forgetting that i² = −1). | Pick −2 + 3i |
| X-27 | `EULER FORMULA!` | e^(iπ) | Drag iπ onto e. | A point walks half-way around the unit circle and stops at −1. | Owl | e^π, a real number bigger than 1. | Pick −1 |
| X-28 | `ROOTS OF UNITY!` | Solve z³ = 1 | Drag 360°/3 onto the circle. | Three points are equally spaced around the circle. | Bees | Answering only z = 1. | Pick the 3 points |

### Bayes
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| X-29 | `BAYES!` | 1% of people are sick; the test catches 90% of sick people; 5% of healthy people test positive. P(sick \| positive)? | Using 10,000 people: drag 1% onto 10,000 (100 sick). Drag 90% onto the 100 (90 true positives) and 5% onto the 9,900 healthy (495 false positives), in either order. Drag all the positives together, then divide: 90/585. | A frequency tree splits a crowd of animals into groups. | Owl (doctor) | Answering 90%, which mixes up P(+ \| sick) and P(sick \| +). | Pick ≈ 15% |

### Binary and computer arithmetic
| ID | Command | Problem shown | Moves (valid orders) | Animation | Host | Classic miss | Medium asks |
|---|---|---|---|---|---|---|---|
| X-30 | `BINARY!` | 13 in binary | Drag 13 onto the 8 slot (it fits, so the light turns on, leaving 5). Then 4 (on, leaving 1), 2 (off), 1 (on). Alternative order: repeatedly divide by 2 and read the remainders upward. | Lights switch on in a row of bulbs. | Fireflies | Reading the remainders top to bottom (1011). | Pick 1101 |
| X-31 | `BINARY ADD!` | 1011 + 0110 | REGROUP! column by column, right to left; 1 + 1 makes 10. | The same ant carry as G3-06, with pairs instead of tens. | Ants | Writing 2 in a column. | Pick 10001 |
| X-32 | `BIT FLIP!` | −5 as an 8-bit two's complement number | Flip every bit of 00000101. Drag +1 onto the result. | The bulbs invert, then a carry ripples. | Fireflies | Stopping after the flip (11111010). | Pick 11111011 |
| X-33 | `HEX!` | 0x2F in decimal | Drag 2 onto the 16s place and F onto the 1s place, in either order. | 16-packs of nuts, plus 15 loose nuts. | Squirrels | 2 + 15. | Pick 47 |

---

## Proposed stage grouping

The stages are ordered by grade. Each holds 5 to 9 microgames. Stages marked "(extension)" hold the topics beyond Khan Academy and sit next to the grade where their prerequisites are taught. IDs refer to the tables above. A star (★) marks a planned microgame.

| Stage | Name | Level | Microgames |
|---|---|---|---|
| 1 | Equal Groups | Grade 3 | ARRAY! (G3-01), SKIP COUNT! (G3-02), BREAK APART! (G3-03), COMMUTATIVE! (G3-04), TIMES TEN! (G3-15), ASSOCIATIVE! (G3-16), TWO-STEP! (G3-17), PATTERN! (G3-18) |
| 2 | Carry the Ten | Grade 3 | ROUND! (G3-05), ★ REGROUP! (G3-06), BORROW! (G3-07), ESTIMATE! (G3-08), ELAPSED TIME! (G3-24), MEASURE! (G3-25), MASS! (G3-26) |
| 3 | Fair Shares | Grade 3 | SHARE! (G3-09), FACT FAMILY! (G3-10), PARTITION! (G3-11), NUMBER LINE! (G3-12), EQUIVALENT! (G3-13), COMPARE! (G3-14) |
| 4 | Tiles and Fences | Grade 3 | CLASSIFY! (G3-19), AREA! (G3-20), DECOMPOSE! (G3-21), PERIMETER! (G3-22), MISSING SIDE! (G3-23), PICTOGRAPH! (G3-27), BAR GRAPH! (G3-28) |
| 5 | Big Numbers | Grade 4 | EXPAND! (G4-01), COMPARE! (G4-02), ROUND! (G4-03), REGROUP! (G4-04), BORROW! (G4-05), AREA MODEL! (G4-06), STANDARD ALGO! (G4-07), AREA MODEL! (G4-08) |
| 6 | Divide and Factor | Grade 4 | REMAINDER! (G4-09), CHUNKING! (G4-10), FACTOR PAIRS! (G4-11), PRIME OR NOT! (G4-12), MISSING SIDE! (G4-24), CONVERT! (G4-25) |
| 7 | Fraction Kitchen | Grade 4 | COMMON DENOM! (G4-13), SIMPLIFY! (G4-14), ADD FRACTIONS! (G4-15), MIXED NUMBER! (G4-16), MULTIPLY! (G4-17), DECIMAL! (G4-18), COMPARE! (G4-19) |
| 8 | Angles and Shapes | Grade 4-5 | SYMMETRY! (G4-20), CLASSIFY! (G4-21), PROTRACTOR! (G4-22), ADD ANGLES! (G4-23), PLOT! (G5-16), CLASSIFY! (G5-21) |
| 9 | Decimal Point | Grade 5 | EXPAND! (G5-01), ROUND! (G5-02), ALIGN DECIMALS! (G5-03), BORROW! (G5-04), DECIMAL PLACES! (G5-11), SHIFT POINT! (G5-12), POWER OF TEN! (G5-13), CONVERT! (G5-19) |
| 10 | The Long Way Round | Grade 5 | COMMON DENOM! (G5-05), ★ LONG MULTIPLY! (G5-06), LONG DIVISION! (G5-07), MULTIPLY! (G5-08), SCALING! (G5-09), DIVIDE! (G5-10) |
| 11 | Boxes and Rules | Grade 5-6 | VOLUME! (G5-14), ADD VOLUMES! (G5-15), ORDER OF OPS! (G5-17), PATTERN! (G5-18), LINE PLOT! (G5-20), EXPONENT! (G6-06) |
| 12 | Number Detectives (extension) | Grade 5-6 extension | MODULO! (X-04), PRIME FACTOR! (X-10), LCM! (X-11), SIEVE! (X-12), DIVISIBILITY! (X-13), BINARY! (X-30), BINARY ADD! (X-31), HEX! (X-33) |
| 13 | Ratios and Rates | Grade 6 | RATIO TABLE! (G6-01), RECIPROCAL! (G6-02), LONG DIVISION! (G6-03), UNIT RATE! (G6-04), PERCENT! (G6-05), ORDER OF OPS! (G6-07) |
| 14 | Below Zero | Grade 6-7 | ABSOLUTE VALUE! (G6-08), COMPARE! (G6-09), REFLECT! (G6-20), DISTANCE! (G6-21), ZERO PAIRS! (G7-05), ADD OPPOSITE! (G7-06), DISTANCE! (G7-08), SIGN RULE! (G7-09) |
| 15 | Letters for Numbers | Grade 6 | SUBSTITUTE! (G6-10), LIKE TERMS! (G6-11), DISTRIBUTE! (G6-12), FACTOR OUT! (G6-13), INVERSE OP! (G6-14), DIVIDE BOTH! (G6-15), INEQUALITY! (G6-16) |
| 16 | Area Workshop | Grade 6-7 | PARALLELOGRAM! (G6-17), TRIANGLE AREA! (G6-18), TRAPEZOID! (G6-19), SURFACE AREA! (G6-22), VOLUME! (G6-23), CIRCUMFERENCE! (G7-17), CIRCLE AREA! (G7-18) |
| 17 | Mean, Median and Dice | Grade 6-7 | MEAN! (G6-24), MEDIAN! (G6-25), IQR! (G6-26), MAD! (G6-27), ★ TWO DICE! (G7-13), SAMPLE SPACE! (G7-14), PROBABILITY! (G7-15) |
| 18 | Proportions and Percents | Grade 7 | PROPORTION! (G7-01), CROSS MULTIPLY! (G7-02), PERCENT CHANGE! (G7-03), DISCOUNT! (G7-04), COMMON DENOM! (G7-07), REPEATING! (G7-10), SCALE FACTOR! (G7-16) |
| 19 | Two-Step | Grade 7-8 | ★ TWO-STEP! (G7-11), FLIP THE SIGN! (G7-12), SUPPLEMENTARY! (G7-19), CROSS SECTION! (G7-20), BOTH SIDES! (G8-07), DISTRIBUTE! (G8-08) |
| 20 | Powers of Rabbits | Grade 8 | REPEAT TO FRAC! (G8-01), SQUARE ROOT! (G8-02), ADD EXPONENTS! (G8-03), POWER OF POWER! (G8-04), NEGATIVE EXP! (G8-05), SCI NOTATION! (G8-06) |
| 21 | Lines | Grade 8 | SLOPE! (G8-09), GRAPH LINE! (G8-10), INPUT OUTPUT! (G8-11), SUBSTITUTION! (G8-12), ELIMINATION! (G8-13), INTERSECTION! (G8-14) |
| 22 | Pythagoras | Grade 8 | PYTHAGOREAN! (G8-15), ANGLE SUM! (G8-16), CORRESPONDING! (G8-17), CONE VOLUME! (G8-18), SPHERE VOLUME! (G8-19), PREDICT! (G8-23), TWO-WAY TABLE! (G8-24) |
| 23 | Moves on the Grid | Grade 8 / Geometry | TRANSLATE! (G8-20), ROTATE 90! (G8-21), DILATE! (G8-22), REFLECT! (GE-01), ROTATE! (GE-02), SYMMETRY! (GE-03) |
| 24 | Symmetry Groups (extension) | Geometry extension (abstract algebra) | ★ SYMMETRY GROUP! (X-01), CAYLEY TABLE! (X-02), GROUP INVERSE! (X-03), CYCLE NOTATION! (X-06), ELEMENT ORDER! (X-07), PARITY! (X-08) |
| 25 | Equation Workshop | Algebra 1 | SIMPLIFY! (A1-01), ISOLATE! (A1-02), COMPOUND INEQ! (A1-03), CANCEL UNITS! (A1-04), INTERCEPTS! (A1-05), POINT-SLOPE! (A1-06), STANDARD FORM! (A1-07), ELIMINATION! (A1-08), SHADE! (A1-09) |
| 26 | Function Machines | Algebra 1 | EVALUATE! (A1-10), RATE OF CHANGE! (A1-11), INVERSE! (A1-12), ARITHMETIC SEQ! (A1-13), GEOMETRIC SEQ! (A1-14), ABS EQUATION! (A1-15), PIECEWISE! (A1-16) |
| 27 | Growth and Roots | Algebra 1-2 | SIMPLIFY ROOT! (A1-17), RATIONAL EXP! (A1-18), GROWTH FACTOR! (A1-19), HALF-LIFE! (A1-20), CLOSURE! (A1-30), SQUARE BOTH! (A2-11), COMPOUND! (A2-12), CONTINUOUS! (A2-13) |
| 28 | FOIL and Factor | Algebra 1 | FOIL! (A1-21), FACTOR! (A1-22), DIFF OF SQ! (A1-23), GROUPING! (A1-24), ZERO PRODUCT! (A1-25), COMPLETE □! (A1-26) |
| 29 | Parabolas | Algebra 1-2 | QUAD FORMULA! (A1-27), DISCRIMINANT! (A1-28), VERTEX! (A1-29), END BEHAVIOR! (A2-09), MULTIPLICITY! (A2-10), SHIFT! (A2-18), STRETCH! (A2-19) |
| 30 | Congruent and Similar | Geometry | RIGID MOTION! (GE-04), CONGRUENT! (GE-05), SIMILAR! (GE-06), SOH CAH TOA! (GE-07), INVERSE TRIG! (GE-08), SPECIAL RIGHT! (GE-09) |
| 31 | Triangles Without Right Angles | Geometry / Trigonometry | LAW OF SINES! (GE-10), LAW OF COSINES! (GE-11), DISTANCE! (GE-12), MIDPOINT! (GE-13), PERPENDICULAR! (GE-14), RECIPROCAL! (T-01), TRIANGLE AREA! (T-04) |
| 32 | Circles | Geometry | CIRCLE EQN! (GE-15), ARC LENGTH! (GE-16), RADIANS! (GE-17), INSCRIBED! (GE-18), SECTOR AREA! (GE-19), CAVALIERI! (GE-20), DENSITY! (GE-21) |
| 33 | Logic and Sets (extension) | High school extension | TRUTH TABLE! (X-15), DE MORGAN! (X-16), INTERSECT! (X-17), INCL-EXCL! (X-18), HANDSHAKE! (X-19), EULER PATH! (X-21), GRAPH COLOR! (X-22), PIGEONHOLE! (X-23) |
| 34 | Polynomial Machine | Algebra 2 | MULTIPLY POLY! (A2-01), SUM OF CUBES! (A2-04), SUBSTITUTE! (A2-05), SYNTHETIC DIV! (A2-06), REMAINDER THM! (A2-07), POLY LONG DIV! (A2-08) |
| 35 | Imaginary Owl | Algebra 2 / Precalculus | I SQUARED! (A2-02), POWERS OF I! (A2-03), COMPLEX PLANE! (P-01), POLAR FORM! (P-02), MULTIPLY POLAR! (P-03), DE MOIVRE! (P-04), QUARTER TURN! (X-26), EULER FORMULA! (X-27), ROOTS OF UNITY! (X-28) |
| 36 | Logs and Rational Functions | Algebra 2 | LOG! (A2-14), LOG PROPERTIES! (A2-15), TAKE THE LOG! (A2-16), CHANGE OF BASE! (A2-17), CLEAR DENOMS! (A2-20), FIT THE MODEL! (A2-23), CANCEL! (A2-24), ASYMPTOTE! (A2-25) |
| 37 | Unit Circle | Algebra 2 / Trigonometry | UNIT CIRCLE! (A2-21), PERIOD! (A2-22), REF ANGLE! (T-02), DEG TO RAD! (T-03), PYTHAGOREAN ID! (T-05), ANGLE ADDITION! (T-06), DOUBLE ANGLE! (T-07), SOLVE TRIG! (T-08) |
| 38 | Machines Inside Machines | Precalculus | BINOMIAL THM! (P-05), COMPOSE! (P-06), INVERSE! (P-07), SIGMA! (P-17), ARITH SERIES! (P-18), GEOMETRIC SUM! (P-19) |
| 39 | Arrows | Precalculus | ★ TIP-TO-TAIL! (P-08), SCALAR MULT! (P-09), MAGNITUDE! (P-10), UNIT VECTOR! (P-11), COMPONENTS! (P-12), LINEAR COMBO! (LA-01) |
| 40 | Matrix Monkeys | Precalculus | ★ MATRIX PRODUCT! (P-13), DETERMINANT! (P-14), INVERSE MATRIX! (P-15), TRANSFORM! (P-16), TRANSFORM! (LA-07), TRANSPOSE! (LA-10) |
| 41 | Conics and Counting | Precalculus | ELLIPSE! (P-20), FOCI! (P-21), HYPERBOLA! (P-22), PERMUTATION! (P-23), COMBINATION! (P-24), FACTORIAL! (P-25) |
| 42 | Euclid's Workshop (extension) | High school / college extension | MOD INVERSE! (X-05), EUCLID! (X-09), BEZOUT! (X-14), SHORTEST PATH! (X-20), STARS & BARS! (X-24), PASCAL! (X-25), BIT FLIP! (X-32) |
| 43 | Spread | Statistics | CONDITIONAL! (S-01), HISTOGRAM! (S-02), STEM AND LEAF! (S-03), STD DEVIATION! (S-04), OUTLIER! (S-05), Z-SCORE! (S-06), EMPIRICAL RULE! (S-07) |
| 44 | Chance | Statistics | ADDITION RULE! (S-11), MULTIPLY PROBS! (S-12), COMPLEMENT! (S-13), EXPECTED VALUE! (S-14), BINOMIAL! (S-15), ADD VARIANCES! (S-16), BAYES! (X-29) |
| 45 | Lines Through Data | Statistics | RESIDUAL! (S-08), LEAST SQUARES! (S-09), RANDOMIZE! (S-10), STANDARD ERROR! (S-17), LOG TRANSFORM! (S-24), ANOVA! (S-25) |
| 46 | Inference Court | Statistics | CONFIDENCE INT! (S-18), TEST STAT! (S-19), P-VALUE! (S-20), TWO-SAMPLE T! (S-21), EXPECTED COUNT! (S-22), CHI-SQUARE! (S-23) |
| 47 | Limits | AP Calculus AB | LIMIT! (C-01), CONJUGATE! (C-02), SQUEEZE! (C-03), LIMIT AT INF! (C-04), IVT! (C-05), LIMIT DEF! (C-06) |
| 48 | Derivative Rules | AP Calculus AB | ★ POWER RULE! (C-07), SUM RULE! (C-08), PRODUCT RULE! (C-09), QUOTIENT RULE! (C-10), TRIG DERIV! (C-11), ★ CHAIN RULE! (C-12), IMPLICIT DIFF! (C-13), INVERSE DERIV! (C-14) |
| 49 | Rates in Motion | AP Calculus AB | RELATED RATES! (C-15), L'HOPITAL! (C-16), LINEARIZE! (C-17), CRITICAL POINT! (C-18), 2ND DERIV TEST! (C-19), OPTIMIZE! (C-20), MVT! (C-21) |
| 50 | Integration Toolkit | AP Calculus AB/BC | RIEMANN SUM! (C-22), REVERSE POWER! (C-23), FTC! (C-24), U-SUBSTITUTION! (C-25), ACCUMULATE! (C-26), BY PARTS! (BC-01), PARTIAL FRAC! (BC-02), IMPROPER! (BC-03) |
| 51 | Growth Equations and Solids | AP Calculus AB/BC | SLOPE FIELD! (C-27), SEPARATE! (C-28), AREA BETWEEN! (C-29), DISC METHOD! (C-30), WASHER! (C-31), AVERAGE VALUE! (C-32), EULER'S METHOD! (BC-04), ARC LENGTH! (BC-05) |
| 52 | Curves and Series | AP Calculus BC | PARAMETRIC! (BC-06), POLAR AREA! (BC-07), VELOCITY! (BC-08), GEOMETRIC SER! (BC-09), RATIO TEST! (BC-10), NTH TERM TEST! (BC-11), TAYLOR SERIES! (BC-12), ALTERNATING! (BC-13) |
| 53 | Many Variables | Multivariable calculus | CONTOUR! (MV-01), VECTOR FIELD! (MV-02), PARTIAL DERIV! (MV-03), GRADIENT! (MV-04), DIRECTIONAL! (MV-05), DIVERGENCE! (MV-06), CURL! (MV-07), JACOBIAN! (MV-08) |
| 54 | Planes and Integrals | Multivariable calculus | TANGENT PLANE! (MV-09), LAGRANGE! (MV-10), 2ND PARTIALS! (MV-11), ITERATED INT! (MV-12), LINE INTEGRAL! (MV-13), POLAR INTEGRAL! (MV-14) |
| 55 | Flux and Flow | Multivariable calculus / Differential equations | FLUX! (MV-15), GREEN'S THM! (MV-16), STOKES! (MV-17), DIVERGENCE THM! (MV-18), INTEG FACTOR! (DE-01), EXACT! (DE-02) |
| 56 | Springs and Portals | Differential equations | CHARACTERISTIC! (DE-03), COMPLEX ROOTS! (DE-04), UNDETERMINED! (DE-05), LAPLACE! (DE-06), INV LAPLACE! (DE-07), CONVOLUTION! (DE-08) |
| 57 | Row Operations | Linear algebra | CROSS PRODUCT! (LA-03), RREF! (LA-04), INDEPENDENCE! (LA-05), NULL SPACE! (LA-06), COFACTOR! (LA-08), INVERSE MATRIX! (LA-09) |
| 58 | New Bases | Linear algebra | DOT PRODUCT! (LA-02), CHANGE BASIS! (LA-11), PROJECTION! (LA-12), GRAM-SCHMIDT! (LA-13), EIGENVALUE! (LA-14) |

### Where the 9 planned microgames go

The brief says 8 planned microgames but names 9. All 9 are placed here.

| Planned microgame | Microgame in this map | Stage | Khan Academy course and unit it covers |
|---|---|---|---|
| Regrouping (long addition) | REGROUP! (G3-06) | Stage 2: Carry the Ten | 3rd grade, "Addition, subtraction, and estimation" (4th grade "Addition, subtraction, and estimation" adds harder levels as G4-04) |
| Long multiplication | LONG MULTIPLY! (G5-06) | Stage 10: The Long Way Round | 5th grade, "Multi-digit multiplication and division" (4th grade "Multiply by 2-digit numbers" introduces it with area models) |
| Solving two-step equations | TWO-STEP! (G7-11) | Stage 19: Two-Step | 7th grade, "Expressions, equations, & inequalities" (and 8th grade "Solving equations with one unknown", Algebra 1 "Solving equations & inequalities") |
| Two-dice probability | TWO DICE! (G7-13) | Stage 17: Mean, Median and Dice | 7th grade, "Statistics and probability" (also Statistics and probability, "Probability") |
| Power rule | POWER RULE! (C-07) | Stage 48: Derivative Rules | AP Calculus AB, Unit 2 "Differentiation: definition and basic derivative rules" (Calculus 1, "Derivatives: definition and basic rules") |
| Chain rule | CHAIN RULE! (C-12) | Stage 48: Derivative Rules | AP Calculus AB, Unit 3 "Differentiation: composite, implicit, and inverse functions" (Calculus 1, "Derivatives: chain rule and other advanced topics") |
| Composing triangle symmetries | SYMMETRY GROUP! (X-01) | Stage 24: Symmetry Groups (extension) | Not in KA. It is the abstract-algebra extension of High school geometry "Performing transformations" and "Transformation properties and proofs" (symmetries of shapes) |
| Matrix product cell | MATRIX PRODUCT! (P-13) | Stage 40: Matrix Monkeys | Precalculus, "Matrices" |
| Vector addition | TIP-TO-TAIL! (P-08) | Stage 39: Arrows | Precalculus, "Vectors" (also Linear algebra, "Vectors and spaces") |

---

## Sources

Khan Academy's course pages are rendered by JavaScript. The fetch tool got back only the page title for https://www.khanacademy.org/math/cc-third-grade-math, https://en.khanacademy.org/math/cc-third-grade-math, https://www.khanacademy.org/math/cc-fourth-grade-math and https://www.khanacademy.org/math/k-8-grades. KA's sitemap (https://www.khanacademy.org/sitemap.xml and https://www.khanacademy.org/sitemaps/math/cc-sixth-grade-math/sitemap.xml) lists course pages but not their units. The unit names therefore come from the sources below.

**Main source: every course's unit list (fetched in full)**
- Khan Academy Blog, "Free Math Worksheets — Over 100k free practice problems on Khan Academy" (published 2021-03-15, last modified 2025-03-19): https://blog.khanacademy.org/free-math-worksheets/
- Khan Academy Blog, "Get Free Math Curriculums from Kindergarten to Calculus" (fetched; gives the same course and unit list): https://blog.khanacademy.org/free-math-curriculum-from-kindergarten-to-calculus/

**6th grade: current unit titles (seen as page titles in khanacademy.org search results, not fetched)**
- "Exponents and order of operations": https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-exponents-and-order-of-operations
- "Rates and percentages": https://en.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-rates-and-percentages
- "Arithmetic with rational numbers": https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-arithmetic-operations
- "Ratios": https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic#cc-6th-percent-decimal-conversions
- "Coordinate plane": https://en.khanacademy.org/math/cc-sixth-grade-math/x0267d782:coordinate-plane
- "Equations & inequalities: Unit test": https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-equations-and-inequalities/x0267d782:cc-6th-analyzing-relationships/test/cc-6th-equations-and-inequalities-unit-test
- "3D figures: Quiz 1": https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-geometry-topic/cc-6th-volume-with-fractions/quiz/cc-6th-geometry-topic-quiz-1
- "Data and statistics": https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-data-statistics?open=1
- Plane figures unit slug: https://www.khanacademy.org/math/cc-sixth-grade-math/x0267d782:cc-6th-plane-figures/cc-6th-parallelogram-area/e/area_of_parallelograms
- KA Help Center, "Update: 6th grade math from Khan Academy!" (fetched; describes the 2022 renewal but does not list unit titles): https://support.khanacademy.org/hc/en-us/articles/7762110492045-Update-6th-grade-math-from-Khan-Academy

**7th grade: current unit titles (search-result titles)**
- "Integers: addition and subtraction: Unit test": https://www.khanacademy.org/math/cc-seventh-grade-math/cc-7th-negative-numbers-add-and-subtract/test/cc-7th-negative-numbers-add-and-subtract-unit-test
- Rational numbers: addition and subtraction unit slug: https://www.khanacademy.org/math/cc-seventh-grade-math/x6b17ba59:rational-numbers-addition-and-subtraction/cc-7th-add-sub-rational-numbers/v/adding-and-subtracting-a-decimal-percentage-and-fraction
- "Statistics and probability": https://www.khanacademy.org/math/cc-seventh-grade-math/cc-7th-probability-statistics#cc-7th-population-sampling
- "Geometry": https://en.khanacademy.org/math/cc-seventh-grade-math/cc-7th-geometry
- "Scale copies" lesson inside Geometry: https://www.khanacademy.org/math/cc-seventh-grade-math/cc-7th-geometry/scale-copies/e/scale-copies
- Proportional relationships slug: https://www.khanacademy.org/math/cc-seventh-grade-math/cc-7th-ratio-proportion/cc-7th-proportional-rel/v/analyzing-and-identifying-proportional-relationships-ex1
- Percent slug: https://www.khanacademy.org/math/cc-seventh-grade-math/cc-7th-fractions-decimals/cc-7th-percent-word-problems/e/markup_and_commission_word_problems
- KA Help Center, "Content update: Summer 2023 updates to 7th grade math courses" (fetched; lists exercises, not units): https://support.khanacademy.org/hc/en-us/articles/18036297962125-Content-update-Summer-2023-updates-to-7th-grade-math-courses

**Precalculus: units not in the blog list (search-result titles)**
- "Limits and continuity": https://en.khanacademy.org/math/precalculus/x9e81a4f98389efdf:limits-and-continuity/x9e81a4f98389efdf:determining-limits-using-the-squeeze-theorem
- "Vectors: Unit test": https://en.khanacademy.org/math/precalculus/x9e81a4f98389efdf:vectors/x9e81a4f98389efdf:vec-models/test/x9e81a4f98389efdf:vectors-unit-test
- Composite unit (inverse functions lesson): https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:composite/x9e81a4f98389efdf:verifying-inverse/v/verify-inverse-functions-from-tables
- "Get ready for composite and inverse functions": https://www.khanacademy.org/math/get-ready-for-precalculus/x65c069afc012e9d0:get-ready-for-composite-and-inverse-functions/x65c069afc012e9d0:scaling-functions/e/scale-functions-horizontally
