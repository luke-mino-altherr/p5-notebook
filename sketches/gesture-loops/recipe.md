# Gesture Loops

*In the spirit of Zach Lieberman, 2010s to today*

## About

Zach Lieberman makes playful, real-time work where people's movements become the artwork: drawings that come alive, sound you can see. He co-founded the creative coding toolkit openFrameworks and posts a new code sketch almost every day, a habit many artists now share.

## The idea

The viewer is part of the piece. The code gives the rules, and you give the movement.

## The recipe

1. Clear the screen to a dark colour every frame.
2. While someone holds the mouse button and drags, record every point the mouse passes through, and show the path as a thin white line.
3. When they let go, keep that list of points as a loop.
4. Every frame, move a playhead one step along each loop, starting over when it reaches the end.
5. Draw the 70 points behind the playhead as a ribbon: thick and bright at the front, thin and dark at the tail.
6. Make the ribbon gently get wider and thinner, like breathing, and shift its colour along its length.
7. Keep up to 12 loops. When there are more, the oldest disappears.
8. Before anyone draws, play a figure-of-eight example with the words "draw something".

## Building it up

> **1.** When I drag the mouse, draw a line that follows it. *(input)*

> **2.** When I let go, remember the line and replay it as a dot travelling along the path, over and over. *(memory)*

> **3.** Instead of a dot, make it a ribbon that's thick and bright at the front and fades out behind. *(change)*

> **4.** Let me draw lots of these, each a different colour, and make them gently pulse wider and thinner. *(repetition, change over time)*

> **5.** Before anyone has drawn, show a figure-of-eight example and the words "draw something". *(polish)*

## Make it yours

- What if each loop were mirrored, like a kaleidoscope?
- What if loops played back faster or slower depending on how fast you drew?
- What if the ribbons were made of letters, or left a mark that never fades?
