# Random Type

*After LettError's Beowolf, 1990*

## About

In 1990 the Dutch type designers Erik van Blokland and Just van Rossum, working together as LettError, released *Beowolf*, a typeface with randomness built in. Every time a letter was printed, the points of its outline shifted slightly, so no two letters were ever the same. A font had always been a fixed set of shapes; Beowolf made it a process.

## The idea

Letters as living shapes. Each letter's outline is a list of points joined by curves. Nudge every point by a random amount each time you draw it, and solid type starts to tremble, wobble and melt.

## The recipe

1. Load a typeface (here Fraunces, an open-source font) and turn the word into outlines: lists of points and curves for each letter.
2. Make the word as large as will fit across the window, and centre it.
3. A few times a second, clear the page to off-white paper and redraw the word.
4. When drawing, nudge every point of every outline left/right and up/down by a random amount.
5. Use the mouse to set how big the nudges are: none at the far left, wild at the far right.
6. Print the word three times on top of each other, in pink, blue and black, each with its own random nudges, letting the colours mix where they overlap, like a print slightly out of line.
7. Typing adds letters to the word; Backspace removes them.

## Building it up

> **1.** Load a bold typeface and draw the word "chance" as large as fits, centred on off-white paper. *(text, where)*

> **2.** Instead of drawing the text normally, get the outline points of the letters and nudge each point by a small random amount. *(shapes, chance)*

> **3.** Redraw with new random nudges a few times a second, so the letters tremble. *(change over time)*

> **4.** Let the mouse control the wobble: crisp at the left, wild at the right. Let me type my own word. *(input)*

> **5.** Print three copies on top of each other in pink, blue and black, blending where they overlap, each with its own wobble. *(repetition, colour)*

## Make it yours

- What if the wobble were strongest near the mouse, and calm far away?
- What if the letters slowly melted downwards, or exploded into dots?
- What if each letter were a different typeface, or the word were your name?
