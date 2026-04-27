# Plan
Tanks game from the wii implemented with three.js
1. Relearn the three.js fundamentals
2. Import in the tank model
3. Implement basic physics and controls 
    - Platform: tank moves on the platform, certain amount of drag(?)
    - Walls: can't go past, no clipping
    - Controls: movement controls with wasd / arrow keys
    - Leaving tank tracks where tanks go 
4. Implement tank attack controls
    - Turret: rotating head with mouse / other keys
    - Projection UI: following mouse direction 
    - Bullet physics: bouncing off of walls normal to the wall
5. Implement tank death when hit by a bullet 
6. Implement basic enemy tank AI
    - Simple tank who cannot move, fires every few seconds, aims with bounce if there is no route direct
    - Simple tank who can move, similar AI to above, but give traits of how to move. Plus maybe some predictive shots?
7. Implement mines
    - Create the mine and explosion 
    - Create its impacts killing tanks and exploding walls
    - Create explosive walls 
8. Create the first 5 full levels
