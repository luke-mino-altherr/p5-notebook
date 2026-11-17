# Flow Field

*After Tyler Hobbs, 2020*

## About

Tyler Hobbs is a generative artist who makes paintings and prints from code, and writes openly about his techniques. His 2020 essay on flow fields helped make them one of the most widely used tools in today's generative art. This sketch is a study of the technique, not a copy of any of his works.

## The idea

An invisible current. Smooth randomness ("noise") gives every spot on the page a direction, like wind on a weather map. Curves dropped onto the page follow the wind, and because they never cross, the drawing feels calm and deliberate.

## The recipe

1. Start with warm off-white paper and leave a margin around the edge.
2. Give every spot on the page a direction using smooth noise, so nearby spots point in similar directions.
3. Drop a curve at a random spot. Pick a random thickness, from hairline to bold, and a random colour from a small palette.
4. Let the curve follow the directions in small steps, for up to 160 steps.
5. Stop the curve early if it reaches the margin, or comes within a small gap of a curve that's already drawn.
6. Skip curves that end up too short.
7. Remember where each curve went, so later curves keep their distance.
8. Try 1200 curves, a dozen at a time, so the drawing builds up while you watch. Clicking starts a new drawing with a new current.

## Building it up

> **1.** Give every point on the screen a direction using smooth noise, and show it as a grid of short lines, like a weather map of the wind. *(change, chance)*

> **2.** Now hide the grid. Drop curves at random places and let each one follow the directions for a while. *(rules, repetition)*

> **3.** Stop curves when they get close to a curve that's already there, so they never cross, and leave a margin around the page. *(rules, memory)*

> **4.** Give each curve a random thickness from hairline to bold, and a colour from a small palette on warm paper. *(colour, style)*

> **5.** Draw the curves gradually so I can watch the picture build, and start a new one when I click. *(change over time, input)*

Step 1 is worth noticing: drawing the invisible field first makes it much easier to understand the final picture.

## Make it yours

- Choose your own palette from a photo you love.
- What if the curves were rows of dots, or short dashes?
- What if the direction field swirled around the mouse?
