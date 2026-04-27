# Plan
1. Implement Confetti in Javascript inspired by [this page](https://confettipage.com/en) for free
2. Implement simple physics system for a single particle
    - Have it be a something operate on by gravity, with a simple force acting upon it initially
    - Add in some floating/rotation mechanics
    - Make all of it parameterized and tunable
    - Despawn mechanic when out of range
3. Implement physics system across particle objects all at once
    - Create a particle manager and generator, which has initial parameters available 
    - Have the generator be timer dependent for patterns (such as run for x seconds)
4. Implement presets with easy abstracted inputs: duration, color range, floaty, speed, gravity, etc. 
5. Implement user interactivity, and an easy to copy code block anyone can use