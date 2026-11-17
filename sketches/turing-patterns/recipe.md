# Turing Patterns

*After Alan Turing, 1952*

## About

Alan Turing is best known for his work on computers and code-breaking. In 1952 he published a paper asking how a leopard gets its spots and a zebra its stripes. His answer: two chemicals that react with each other and spread out at different speeds can make spots and stripes all by themselves. Biologists later found his idea at work in real animals. This sketch uses the Gray-Scott model from the 1980s, a later version of the same idea that is simpler to code.

## The idea

Patterns that grow themselves. Nobody draws the spots or stripes; they appear from two simple rules, reacting and spreading, repeated thousands of times.

## The recipe

1. Cover the screen with a grid of tiny cells, 220 across the longer side.
2. Fill every cell with chemical A. Drop 12 small patches of chemical B at random places.
3. Over and over, for every cell:
   - **Spread:** each chemical drifts towards neighbouring cells. A spreads twice as fast as B.
   - **React:** where A and B meet, B eats some A and makes more B.
   - **Top up and fade:** A is slowly added everywhere; B slowly fades away.
4. Do 12 of these steps every frame.
5. Colour each cell: cream where there's mostly A, deep teal where there's B.
6. While the mouse is held down, pour more B under the mouse.

## Building it up

Each prompt adds one idea. Look at the result before writing the next one.

> **1.** Make a grid of tiny cells filling the screen. Each cell holds an amount of chemical A (start at full) and chemical B (start at none, except a few small random patches). Colour each cell cream for A and deep teal for B. *(canvas, memory)*

> **2.** Every frame, let both chemicals spread to neighbouring cells, with A spreading twice as fast as B. *(rules, change)*

> **3.** Add the reaction: where they meet, B turns A into more B. Slowly top up A everywhere and slowly fade B. *(rules)*

> **4.** Run 12 steps per frame so the pattern grows faster. *(change)*

> **5.** When I hold the mouse down, pour more B under it. *(input)*

## Make it yours

- Try the other FEED and KILL numbers in the code: spots, stripes and mazes all come from the same rules.
- What if FEED changed slowly from the left of the screen to the right, so one pattern melts into another?
- What if the colours came from a sunset, or a leopard?
