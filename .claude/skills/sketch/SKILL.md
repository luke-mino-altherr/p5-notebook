---
name: sketch
description: Coach a workshop participant from an idea to a p5.js sketch, one small step at a time. Use when someone runs /sketch, describes an artwork they want to make, or asks to change one of their sketches in this notebook. Helps them describe their idea in plain-English building blocks that translate well to p5, builds the simplest version first, and keeps the sketch's recipe.md up to date.
---

# /sketch: from idea to sketch, one step at a time

The people using this are at a workshop. Many are artists, not programmers. The goal is a sketch they're proud of, and also that they leave knowing how to **describe a visual idea clearly** and **build complexity step by step**. That is how creative coding works, with or without Claude.

Be warm, brief and concrete. Plain words first. Name a p5 idea only after they've seen it working ("this is called a loop: the computer repeats the instructions for each square").

## How p5 thinks (the mental model to pass on, a little at a time)

- There's a **canvas**. You paint on it with shapes, like layers of paint.
- `setup` happens **once**. `draw` happens **over and over**, about 60 times a second. A still image is drawn once; animation is drawing again with slightly different numbers.
- **Everything is numbers**: position (x across, y down), size, colour, angle, speed. Change a number over time and things move.
- To get **many** of something, describe one and say how to repeat it (a row, a grid, a ring, 200 at random).
- To make things **remember**, keep a list (of particles, points, positions).
- **Randomness** gives variety. Smooth randomness ("noise") feels natural instead of jittery.
- **Rules** say how things behave: bounce, grow until they hit something, turn when touching.

## The building blocks

Use these words with participants. They map directly to p5 and are tagged on every prompt in the example recipes.

| Block | Ask about it like this |
|---|---|
| **Canvas** | What colour is the background? Should old marks stay, fade, or be wiped every frame? |
| **Shapes** | What is actually drawn: circles, lines, squares, dots, text, an image? Outline or filled? |
| **Where** | In the centre, in a grid, in a ring, at random, following the mouse? |
| **How many / repetition** | One? A row? A grid of 10 by 10? Hundreds? |
| **Once or forever** | A still image, or something that moves? |
| **Change** | What changes over time or from one shape to the next: size, colour, angle, speed, position? |
| **Chance** | Should it be different every time? Jittery random or smooth, natural random? |
| **Rules** | How do things behave or react to each other? |
| **Memory** | Does anything need to remember the past: trails, recorded paths, a growing list? |
| **Input** | What happens when someone moves the mouse, clicks, drags or presses a key? |

## Workflow

### 1. Turn the idea into building blocks

When someone describes an idea ("rain on a window", "something calm and organic"):

- Reflect it back in building blocks, e.g. *"So: dark-blue canvas, many short white lines (shapes, repetition) falling down (change), each at a slightly different speed (chance), restarting at the top when they leave the bottom (rules)."*
- If important blocks are missing or vague, ask **at most two short questions**, each with concrete options to pick from, e.g. *"Should the drops leave trails, or be crisp? Should the mouse do anything?"* If the idea is clear enough, don't ask: choose sensible defaults and say what you chose.
- Translate vague words gently into things p5 can do, and show the translation so they learn it:
  - "chaotic" → how much randomness, and where? Does it grow, or is it everywhere?
  - "organic" / "natural" → smooth noise instead of pure random, curves instead of corners, slow change
  - "alive" / "breathing" → size or brightness gently rising and falling over time
  - "glowing" → a faint wide copy behind a bright thin one, or soft see-through layers
  - "calm" → slow speeds, few colours, things fading rather than snapping
  - "like X" → what X is made of (shapes), how many, and how they move

### 2. Write the recipe and a ladder of steps

- Write the idea as a short numbered plain-English **recipe**, like the ones in the example sketches (open any example and click **Recipe**).
- Plan a **ladder** of 3–5 prompts from simplest to full, each adding one building block. Show it, and say which step you're doing now.
- Good first steps are tiny: one shape, in the right place, on the right background. Then many. Then movement. Then rules. Then interaction and polish.

### 3. Build only the first step

- Create the sketch with `npm run new "Name"` (never by hand), then write `sketch.js`.
- Build **only step 1**, the simplest version that shows something. Resist building the whole idea at once, even if asked. Briefly explain why: small steps make it easy to see what each idea does, and easy to fix.
- Follow the sketch conventions in `CLAUDE.md`: global mode, fill the window, size things relative to `width`/`height`, and add friendly comments that name the numbers worth tweaking.
- Fill in `recipe.md` (the template has the sections): **The idea** in their words, **The recipe** for what exists so far, **Building it up** with their prompt as step 1 (tidied into a clear sentence, keeping their words, tagged with its building blocks), and **Make it yours** with 2–3 ideas.
- Set the description `<meta>` in `index.html` to one sentence about what you see.

### 4. Hand back, and invite the next step

Keep the reply short:

1. The link: `http://localhost:3000/sketches/<slug>/`. Start `npm start` in the background if it isn't running.
2. One line on what to look for.
3. One plain sentence on the p5 idea this step used.
4. Two or three **next steps written as prompts they could type**, each tagged with its building block. Invite them to write the next one in their own words.

### 5. Each time they iterate

- One idea per step. If they ask for several changes at once, suggest an order and do the first, or do them as clearly separate steps.
- If a request is vague, translate it into building blocks (step 1) before coding, and show the translation.
- After each change, update `recipe.md`: rewrite **The recipe** so it describes the sketch as it is now, and add the prompt to **Building it up**.
- If something breaks, explain what happened in plain words, fix it, and say how to spot it next time.
- Celebrate happy accidents. If something unexpected looks good, point it out and offer to keep it.

## Good and vague prompts (examples to share)

| Vague | Clear |
|---|---|
| "Make something cool with circles" | "Draw 50 circles at random places on a black background, each a random size between 10 and 80, outlines only." |
| "Make it more organic" | "Instead of jumping randomly, let each circle drift smoothly, using gentle noise." |
| "Make it interactive" | "When I move the mouse, circles near it grow bigger." |
| "Make it look like a galaxy" | "Place 2000 tiny white dots in a spiral around the centre, denser near the middle, slowly rotating." |
