# Phyllotaxis

*After Helmut Vogel, 1979*

## About

Phyllotaxis is the way plants arrange leaves, petals and seeds. In 1979 the mathematician Helmut Vogel published a very short formula for the seeds in a sunflower head. Each new seed is turned by the same angle as the one before, about 137.5° (the "golden angle"), and placed a little further out. The formula is so short and the result so lifelike that it became a favourite first sketch in creative coding.

## The idea

A whole flower from one rule. Turn, step out, place a seed, and repeat. Change the angle even slightly and the perfect packing falls apart into spokes and gaps.

## The recipe

1. Fill the screen with dark soil and work from the centre.
2. Place seeds one after another. For seed number *n*:
   - turn by *n* times the golden angle (137.508°),
   - step out from the centre by the square root of *n*, scaled so the last seed reaches near the edge.
3. Draw each seed as a circle, gold near the middle and orange near the rim.
4. Grow 8 new seeds every frame, up to 1200.
5. When the mouse moves left or right, nudge the angle up to 3° away from golden, and show the angle in the corner.
6. When someone clicks, grow the flower again from the centre.

## Building it up

Each prompt adds one idea. Look at the result before writing the next one.

> **1.** On a dark background, place 1200 circles around the centre. Each one is turned 137.5° more than the one before and sits a little further out, using the square root of its number. *(shapes, where, repetition)*

> **2.** Colour the seeds gold in the middle, fading to orange at the edge. *(change)*

> **3.** Grow the seeds in one by one from the centre, a few each frame. *(once or forever, change)*

> **4.** Let the mouse nudge the angle a little away from 137.5°, and show the angle on screen. *(input)*

> **5.** Click to grow it again from the start. *(input)*

## Make it yours

- What if the seeds grew bigger towards the edge, like a real sunflower?
- What if each seed was a petal shape, or a word?
- What if the whole flower slowly rotated, or pulsed like it was breathing?
