# Process Study

*After Casey Reas, 2004 onwards*

## About

Casey Reas co-created Processing, the language p5.js grew out of. Each artwork in his *Process* series starts as a few plain-English sentences describing simple elements and how they behave. The software is just one way of carrying out the instructions. This study uses our own instructions in the same spirit.

## The idea

Simple rules, complex results. Nothing in the instructions says "make a pattern", yet one builds up from thousands of faint lines.

## The recipe

1. Start with an off-white canvas that is never cleared, so every mark stays.
2. Make 90 invisible circles of different sizes, scattered at random. Each one drifts in a random direction at its own slow speed.
3. Every frame, check every pair of circles. If two overlap, draw a very faint dark line between their centres.
4. Move each circle forward. If a circle is touching another, it turns slightly as it goes.
5. A circle that drifts off one edge comes back on the opposite edge.
6. When someone clicks, clear the canvas and start again.

## Building it up

> **1.** Make 90 circles of random sizes drift across the screen in straight lines, wrapping around the edges. Draw them as outlines so I can see them. *(shapes, repetition, chance)*

> **2.** When two circles overlap, draw a line between their centres. *(rules)*

> **3.** Now hide the circles and draw only the lines. Don't clear the screen, so the lines build up, and make them very faint. *(memory)*

> **4.** While a circle is touching another, make it slowly turn. Start again when I click. *(rules, input)*

Step 1 is worth noticing: showing the hidden circles first makes it much easier to understand what the final drawing is made of.

## Make it yours

- Write a new rule in one sentence first, e.g. "circles speed up while touching", then ask for it.
- What if the line colour depended on how big the circles are?
- What if the circles avoided the mouse?
