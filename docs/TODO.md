# Q.E.D.! — outstanding work

Written at the end of the 2026-11-05 session. Everything below is known but not yet done. The owner's clarity rules that most items refer to are in "One expression, nothing unexplained" (below) and in docs/MICROGAMES.md.

## The owner's clarity rules (from playing the game)
1. ONE main expression that changes in place. A picture (number line, grid, table) is fine when it acts out the expression's change at the same moment, but it must not run a separate story with its own numbers.
2. Every new number visibly comes from something on screen, or arrives with its one-line reason beside it ("12 = 7 + 5"). Every shortcut is written out: "8 → 3" must read "8 = 5 + 3 → 3".
3. One idea per move; at most one working note visible at a time; nothing else moves while the expression changes.
4. Nothing important disappears before the player can read it: a note stays readable at least ~1 s × pace after it finishes writing, and each step's result stays on screen.
5. Readability: main expression ≥ 28 px, notes ≥ 22 px on a dark pill, labels ≥ 18 px bold, nothing past the screen edge.

## Microgames that still break the clarity rules
An audit filmed all 170 game files at level 0 and scored them. 11 were fixed (geometry_surface, logs_base, geometry_pyth, geometry_tri, limits_factor, limits_inf, integers_addopp, longway_division, modular_mod, counting_sigma, decimals_mult). Still to fix, worst first within each group (R = rule broken; times are seconds into the level-0 film):

### Bad (a newcomer would be lost)
- **fractions_mixed** (R2, R5): 8 rolls to 5 with only a small, quick "− 3"; should read "8 − 3 = 5". The whole number 1 → 2 likewise.
- **derivs_sum** (R2): exponent 3 → 2 with no "3 − 1" (1.6–2.0 s). Glitch: the dropped 3 covers the x, so it reads "3³".
- **quadratics_formula** (R2, R3, R5): "(−6)² = 36" and "4·1·8 = 32" overlap (4.4 s); −(−6) → 6 and 2·1 → 2 are never explained (7.2 s); notes ~14 px.
- **matrices_mult** (R3, R4): each entry's 3-line working (2·3 = 6, 1·3 = 3, 6 + 3 = 9) builds in 0.6 s and is gone 0.2 s after it is complete.
- **trig_soh** (R3, R4): the main card goes blank twice (4.8 s, 5.2 s) while notes flash; "10 × ½ = 5" is never written.

### Fix (a step is skipped or flashes)
- **quadratics_disc** (R3, R5): two notes at once over the changing expression (4.2–4.8 s); notes ~16 px; the expression reads "16" alone mid-collapse (5.4 s).
- **quadratics_factor** (R3, R4, R5): "1·6 = 6" and "1 + 6 = 7" show together at ~12 px and are gone after 0.8 s.
- **quadratics_vertex** (R2): −(−2)/(2·1) jumps to 2/2; 1 − 2 − 7 → −8 has no note.
- **longway_array** (R3): row and column counts flash in 0.46 s; the skip count moves at 0.26 s per row.
- **numbers_factor** (R4): "18 ÷ 2 = 9" is complete on screen for ~0.25 s.
- **modular_euclid** (R4): each division note ("12 = 1×8 + 4") is complete for ~0.3 s.
- **powers_negexp** (R2): the 1 appears and the − vanishes with no reason.
- **complex_mult** (R4): each product note ("2·4 = 8") is complete for only ~0.25 s.
- **carry_borrow** (R2): the 2 becomes 12 in ~0.2 s; the borrowed ten is never shown arriving.
- **chance_bayes** (R2, R5): 800, 80 and 720 appear with no "1000 − 200"; pills ~16 px.
- **integrals_usub** (R2): du = 2x dx is written with no "d/dx (x² + 5) = 2x"; the ÷ 3 drops under u³ with no reason (4.2–4.6 s).
- **integrals_parts** (R2, R5): v = eˣ arrives with no "∫ eˣ dx = eˣ" (3.4–4.2 s); notes ~14 px.
- **geometry_circle** (R2, R4): "≈ 28.3" appears under 9π with no "9 × 3.14 ≈ 28.3" and fades at 6.4 s.

### Minor
- R1 (a side tally beside the expression): **letters_like** (basket tally 4x + 2x = 6x), **geometry_perim** (the ant's running-total badge).
- R2 (a small step not written): **integrals_riemann** (2 + 3 + 4 → 9), **lines_slope** (2 − 0 → 2), **limits_sub** (9 + 4 → 13), **logic_handshake** (2 + 2 + 1 + 1 → 6), **derivs_zero** (2x² → 4x exponent step), **arrows_comp** (6·½ → 3), **arrows_unit** (√(3² + 4²) = 5 without 9 + 16 = 25), **counting_binom** (Pascal sums tiny; 1x³ → x³), **longway_areamodel** (45 splits into 40 | 5 without "45 = 40 + 5").
- R4: **foil_diffsq** (check line fades early), **fractions_common** (final screen keeps only 3/8; the problem line is gone).
- R5 only (notes or labels ~10–16 px): integers_sign, integers_zeropairs, logs_split, logs_log, linalg_cross, foil_synth, calc_tangent, decimals_convert, decimals_shift, fractions_divide, complex_isq, complex_rotate, longway_remainder, matrix_dot, modular_binary, modular_inverse, numbers_gcf, numbers_lcm, powers_powpow, powers_radical, quadratics_square, quadratics_zero, ratios_change, ratios_cross, ratios_discount, ratios_scale, ratios_table, series_geom, series_ratio, stats_mean, stats_range, stats_sd, stats_twoway, symmetry_cycle, symmetry_inverse, symmetry_order (each key line ~10 px), trig_rad, trig_spin (final answer ~12 px), twostep_balance, twostep_bothsides, twostep_ineq.

The audit's per-game films and full score tables were in the session scratchpad (not in the repo); re-film with `python3 tools/film.py OUT <id>` to see each problem.

## Animation-kit features agents asked for (src/mathkit.js)
- `MK.note` options: a dark pill sized to the text that reveals with the writing (no empty pill flashing first); a minimum readable hold of ~1 s × pace; "stay until the next note in the same group starts" (one note at a time, readable until replaced); a console warning when `at`/`from` names a key with no box (it fails silently today).
- A running-sum helper (`MK.collapse(g, terms, value)` or similar): the terms of an in-line sum light up, "a + b = c" writes itself, and they collapse into c. Several games hand-write this.
- Typesetter nodes the fonts lack: ∫ (with limits), √ (radical over a node), π (drawn to match the font weight), and an "under" node for subscripts like lim's x→0. Let `MK.note` and `MK.fly` draw them.
- Glides: wrapper nodes (frac, row, paren) should glide with their children; today a fraction bar or bracket can sit at its new place while its numbers are still moving.
- Bugs: `MK.drawEx`'s measuring pass clears a fraction's `bar` animation; a direct property assignment made while an `MK.tween` on it is ending gets overwritten (this once hid a minus sign); `hitToken` should prefer the leaf when a one-item row has the same box as its child.
- Helpers: `MK.gone(node)` (fade a subtree with no ghosts), `MK.bornAll(node)`, `MK.offset(node)` (a node's current glide offset, for art drawn behind it), a shared host-animal helper that points while working shows and hops on beats.
- A test or lint step that flags any note or label drawn below 18–22 px.
- `tools/film.py`: a paceMul option (`PM=2`) and a step-mode option.

## Other known issues
- **complex_powers**: in medium mode the tray covers the bottom (−i) station of the wheel.
- **complex_rotate**: in the level-2 half turn, a "(4 − 2i)" frame shows for ~0.15 s between the (−1) fading and the signs flipping.
- **geometry_cone**: the hand-drawn π is thinner than the font; the "·" briefly overlaps it while it glides.
- **twostep_bothsides**: at level 2, a three-tile pan with two-digit numbers only just clears the = badge.
- **integrals_ftc** subtraction (~1.9 s) and **integrals_usub** substitution (~2.0 s) run a little over the 1.6 s guideline at level 0.
- **tools/film.py** runs the game twice with different random problems and cuts the film at the first run's end, so a longer second run can be cut off.
- Command names must stay unique across microgames. Two pairs shared a name and were renamed this session (carry_round is now ROUND OFF!, integers_order is now PEMDAS!); a test that fails on duplicate `cmd` values would prevent this.
