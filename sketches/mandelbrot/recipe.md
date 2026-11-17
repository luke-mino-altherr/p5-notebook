# Mandelbrot Set

*After Benoit Mandelbrot, 1980*

## About

In 1980 the mathematician Benoit Mandelbrot used computers at IBM to draw a shape defined by one tiny formula. It turned out to have endless detail: zoom in anywhere on its edge and new spirals, seahorses and smaller copies of the whole shape keep appearing. His book *The Fractal Geometry of Nature* (1982) made "fractal" a household word, and fractal images became an icon of 1980s computer art.

## The idea

Infinite detail from one rule, repeated. Every pixel asks the same simple question, and the answers paint a landscape you can zoom into forever, at least until the computer runs out of decimal places.

## The recipe

1. Treat the screen as a window onto a map of numbers. Each pixel stands for a point on the map.
2. For each pixel, start a number at zero, then over and over: square it and add the pixel's position.
3. Count how many repeats it takes for the number to fly off towards infinity, and stop counting after a limit.
4. If it never flies away, the pixel is inside the set: paint it dark.
5. If it does, colour it by how quickly it escaped, using a smoothly looping rainbow so neighbouring pixels blend.
6. Calculate the picture a few rows at a time, so it appears from top to bottom.
7. Clicking moves that point to the centre and zooms in three times closer, allowing more repeats so the detail stays sharp.
8. Double-clicking goes back to the start, and so does zooming in so far the computer loses precision.

## Building it up

> **1.** Draw the Mandelbrot set in black and white: black for points inside the set, white for points outside. *(rules)*

> **2.** Colour the outside by how many steps each point took to escape, using a smooth rainbow instead of bands. *(change, colour)*

> **3.** Draw the picture a few rows at a time so the page doesn't freeze, and I can watch it appear. *(change over time)*

> **4.** When I click, zoom in three times closer on that spot. Double-click to go back to the start. *(input)*

> **5.** As I zoom deeper, allow more steps so the edges stay detailed. *(polish)*

## Make it yours

- Try a different formula, e.g. cube the number instead of squaring it.
- What if the colours slowly cycled, so the picture seemed to flow?
- What if it zoomed in by itself, slowly, towards one spot forever?
