# Workshop guide: describing your ideas

In this workshop you'll make your own generative artwork by describing it to Claude in plain English. You don't need to know how to code. The skill you're practising is **describing a visual idea clearly, then building it up one step at a time**. That's how creative coders work, with or without AI.

## 1. Look at the examples

Open the gallery (http://localhost:3000). The examples run from 1968 to today. Open one, then click **Recipe** in the toolbar to see:

- **The recipe**: the whole artwork as numbered plain-English steps.
- **Building it up**: the short prompts that built it, one idea at a time.

Notice how simple the first prompt always is.

## 2. How p5 thinks

- There's a **canvas**, and you paint shapes onto it.
- Some things happen **once**, at the start. Others happen **over and over**, about 60 times a second. That's what makes animation.
- **Everything is numbers**: position, size, colour, angle, speed. Change a number over time and something moves.
- To get **many** of something, describe one and say how to repeat it.
- **Randomness** makes every run different. Smooth randomness feels natural.
- **Rules** describe how things behave and react to each other.

## 3. The building blocks

Try to cover these when you describe an idea. You don't need all of them, and you can add them one at a time.

| Block | Questions to answer |
|---|---|
| **Canvas** | Background colour? Do marks stay, fade or get wiped? |
| **Shapes** | Circles, lines, squares, dots, text? Outline or filled? |
| **Where** | Centre, grid, ring, random, following the mouse? |
| **How many** | One, a row, a grid, hundreds? |
| **Once or forever** | A still image, or moving? |
| **Change** | What changes over time or from shape to shape? |
| **Chance** | Different every time? Jittery or smooth? |
| **Rules** | How do things behave or react to each other? |
| **Memory** | Trails, recorded paths, things that build up? |
| **Input** | What happens on mouse move, click, drag or key press? |

## 4. Start simple, then climb

1. **One thing.** One shape, in the right place, on the right background.
2. **Many things.** Repeat it in a row, grid, ring or at random.
3. **Movement.** Make something change over time.
4. **Rules.** Make things react to each other or to the edges.
5. **People.** Let the mouse or touch take part.
6. **Polish.** Colour, trails, timing, the details that make it yours.

After each step, look at the result and decide what the next single change is.

## 5. Making your own

In Claude Code, type `/sketch` followed by your idea:

```
/sketch rain sliding down a foggy window
```

Claude will turn your idea into building blocks, ask a question or two if needed, build the simplest first step, and suggest what to try next. Your sketch appears in the gallery under **Your sketches**, with its own recipe that grows as you go.

### Vague vs. clear

| Vague | Clear |
|---|---|
| "Make something cool with circles" | "Draw 50 circles at random places on a black background, each a random size, outlines only." |
| "Make it more organic" | "Let each circle drift smoothly instead of jumping." |
| "Make it interactive" | "When I move the mouse, circles near it grow bigger." |
| "Make it look like a galaxy" | "Place 2000 tiny white dots in a spiral around the centre, denser near the middle, slowly rotating." |

Vague is fine as a starting point. Claude will help you make it clearer, and that back-and-forth is part of the practice.
