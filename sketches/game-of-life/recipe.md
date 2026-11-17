# Game of Life

*After John Conway, 1970*

## About

The mathematician John Conway invented the Game of Life in 1970, and it became famous after Martin Gardner wrote about it in *Scientific American*. It's not really a game, since nobody plays it. You set up a starting pattern and watch what four simple rules do with it. People have since found patterns that glide, pulse, multiply and even compute.

## The idea

A whole world from four rules. Every cell only looks at its eight neighbours, yet whole creatures appear, move and collide.

## The recipe

1. Divide the screen into a grid of small square cells. Each cell is either alive or dead.
2. To start, bring about one cell in five to life at random.
3. Several times a second, work out the next generation. Every cell counts how many of its eight neighbours are alive.
4. A live cell with two or three live neighbours survives. With fewer than two it dies of loneliness; with more than three it dies of overcrowding.
5. A dead cell with exactly three live neighbours comes to life.
6. The edges wrap around, so a cell on the right edge is a neighbour of the matching cell on the left edge.
7. Draw live cells as small rounded squares. Newborn cells are warm yellow and turn blue the longer they survive.
8. Dragging the mouse paints new live cells, and the world pauses while you draw.
9. If the world stops changing, start again with a fresh random grid.

## Building it up

> **1.** Divide the screen into a grid of 10-pixel squares and colour about one in five of them in at random. *(shapes, repetition, chance)*

> **2.** Make it come alive with Conway's Game of Life rules: each cell counts its eight neighbours; a live cell with 2 or 3 survives, and a dead cell with exactly 3 is born. *(rules, change over time)*

> **3.** Let me drag the mouse to bring cells to life, pausing while I draw. *(input)*

> **4.** Colour cells by how long they've been alive: yellow when newborn, turning blue with age. *(memory, colour)*

> **5.** When nothing is changing any more, start again with a new random grid. *(rules)*

## Make it yours

- Change a rule: what if a dead cell comes to life with 3 *or* 6 neighbours?
- What if the cells were circles that grow with age, or played a note when born?
- What if your drawing became the starting pattern, letters included?
