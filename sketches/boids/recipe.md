# Boids

*After Craig Reynolds, 1987*

## About

Craig Reynolds is a computer graphics researcher. In 1987 he showed that a realistic flock of birds needs no leader and no plan. Each simulated bird (he called them "boids") follows three simple rules about its nearest neighbours, and the flock appears on its own. His boids went on to animate bats and penguins in films, and the idea is still used for crowds, fish and swarms today.

## The idea

A flock from three rules. No bird knows where the flock is going; each one just watches the birds near it. The swirling shape of the whole flock is a surprise that nobody drew.

## The recipe

1. Fill the screen with a deep blue night sky.
2. Scatter 150 birds at random places, each flying in a random direction.
3. Every frame, each bird looks at the other birds nearby and follows three rules:
   - **Separation:** turn away from birds that are too close.
   - **Alignment:** turn to fly the same way as the birds nearby.
   - **Cohesion:** turn towards the middle of the birds nearby.
4. Each bird can only turn a little at a time, and has a top speed.
5. Birds that fly off one edge come back on the opposite edge.
6. Draw each bird as a small pale triangle pointing the way it flies. Paint a see-through background each frame so they leave short trails.
7. Birds near the mouse flee from it, like a hawk is chasing them.

## Building it up

Each prompt adds one idea. Look at the result before writing the next one.

> **1.** On a deep blue background, scatter 150 small pale triangles, each flying in a random direction and pointing the way it flies. When they leave one edge, bring them back on the opposite edge. *(shapes, repetition, change)*

> **2.** Make each bird turn to fly the same way as the birds near it. *(rules)*

> **3.** Make each bird also turn towards the middle of the birds near it, and away from any that are too close. *(rules)*

> **4.** Leave short trails behind the birds. *(canvas, memory)*

> **5.** Make the birds flee from the mouse. *(input)*

## Make it yours

- Turn SEPARATION, ALIGNMENT or COHESION up or down in the code. What happens when one rule is missing?
- What if there were two flocks in different colours that avoided each other?
- What if the birds were fish, with a gentle current pushing them sideways?
