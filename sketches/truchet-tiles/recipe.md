# Truchet Tiles

*After Sébastien Truchet, 1704*

## About

Sébastien Truchet was a French priest, mathematician and engineer. In 1704 he published a study of a single square tile, cut corner to corner into a dark half and a light half. He showed that just by turning copies of that one tile, you can make an endless variety of patterns. In 1987 the scientist Cyril Stanley Smith brought the tiles back to attention and suggested a version with two quarter circles, which join up into winding paths. Generative artists have used both ever since.

## The idea

One tiny decision, repeated. Every tile is the same; the only thing chance picks is which way each one is turned. Yet the whole page looks designed.

## The recipe

1. Make a sheet of cream-coloured paper the size of the window.
2. Cover the page with a grid of square tiles, 14 across the shorter side.
3. For each tile, pick at random how many quarter turns to give it: 0, 1, 2 or 3.
4. Draw the tile: a dark triangle filling half of the square, from one corner to the opposite corner.
5. Draw everything once and stop. When someone clicks, pick new turns and draw it again.
6. When someone presses a key, swap every triangle for Smith's tile: two thick quarter-circle arcs in opposite corners.

## Building it up

Each prompt adds one idea. Look at the result before writing the next one.

> **1.** Fill the screen with a grid of squares, 14 across, on a cream background. In each square, fill the top-left half with a dark-blue triangle. *(shapes, repetition)*

> **2.** Turn each tile by a random number of quarter turns. *(chance)*

> **3.** Draw it once instead of animating, and draw a new pattern when I click. *(input)*

> **4.** When I press a key, swap the triangles for two quarter-circle arcs in opposite corners, so they join into winding paths. *(shapes, input)*

## Make it yours

- What if the tiles got smaller towards the centre of the page?
- What if the chance wasn't 50/50, so most tiles face one way?
- What if each tile slowly rotated when the mouse passed over it?
