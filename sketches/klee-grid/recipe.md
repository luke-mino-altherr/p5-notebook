# Klee Grid

*After Frieder Nake, 1965*

## About

Frieder Nake is a German mathematician and one of the first computer artists. In 1965 he and Georg Nees showed some of the earliest computer drawings in Stuttgart, made by a plotter (a machine that moves a pen across paper). One of his best-known drawings is a homage to the painter Paul Klee, whose 1929 painting *Highways and Byways* is built from bands and lines. Nake wrote rules that split the page into bands and filled them with lines chosen by chance. This sketch is a study of that approach, not a copy of the drawing.

## The idea

Splitting a page into parts, then letting chance decide what goes in each one. The rules give the drawing its structure; chance gives it rhythm and surprise.

## The recipe

1. Make a sheet of cream-coloured paper the size of the window, with a margin around the edge.
2. Draw 8 zig-zag lines across the page, one above the other, splitting it into 7 bands. Each line has 6 corners at random heights. The top and bottom lines wobble less.
3. For each band, choose at random how to fill it:
   - straight up-and-down lines at random places, or
   - slanted lines that all lean the same way, or
   - nothing at all.
4. Draw 6 circles of random sizes at random places on top.
5. Use thin black lines throughout, like a pen.
6. Draw everything once and stop. When someone clicks, roll new random numbers and draw it again.

## Building it up

Each prompt adds one idea. Look at the result before writing the next one.

> **1.** On cream paper with a margin, draw 8 horizontal lines that split the page into 7 equal bands. Thin black lines only. *(shapes, repetition)*

> **2.** Turn each line into a zig-zag with 6 corners at random heights, keeping the lines from crossing. *(chance)*

> **3.** Fill some bands with up-and-down lines at random places, some with slanted lines that lean the same way, and leave some empty. The lines should run from the zig-zag above to the zig-zag below. *(rules, chance)*

> **4.** Scatter 6 circles of random sizes on top. *(shapes, chance)*

> **5.** Draw it once instead of animating, and draw a new version when I click. *(input)*

## Make it yours

- What if the bands ran up and down instead of across?
- What if some bands were filled with dots, or small squares, instead of lines?
- What if each band had its own colour of ink?
