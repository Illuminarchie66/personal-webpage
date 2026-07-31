# Introduction
This year I participated in the [Game Maker's Toolkit (GMTK) Game Jam 2026]((https://itch.io/jam/gmtk-jam-2026))! I had participated in previous years, however never on my own, and never that successfully. This year was an opportunity to try and create something meaningful and more importantly something successful. By successful, I just mean a fully complete and functioning game uploaded before the submission deadline. For those unfamiliar, a game jam is an event where you are given a fixed amount of time to create a game to some theme. Here we had 96 hours and the theme was **Countdown**. This page will detail the game that I made and the journey that I went on. 

![Screenshot of the start of the game](./md/images/real_ss1.png)
*Screenshot of the start of the game.*

# Day 1
*96 hours remain.*

## Initial brainstorming and ideas 
*95 hours remain.*
I watched the announcement video as I finished up work, where we got the theme of 'Countdown' and the timer began to count down. Here I began to brainstorm with my partner about different possible ideas. My partner had an amazing idea of a murder mystery, following a detective in an elevator in a hotel. You would go from the top to the bottom, and descend down the hotel, gathering clues about a murder that just took place. A murder of a Count. Each floor, different people connected to the mystery will enter and exit, and you choose who you talk to, and the circumstances of their conversation. When you reach the bottom, you are expected to have pieced it together, and have to give your verdict to the police of whodunnit. The idea is that it would be replayed, each time you get more and more clues and insight, as you find the optimal path to figure out who killed the Count. This is an amazing idea and I adore their creativity. Sadly, I do not possess the writing chops for something like that. My brain instead first went toward some style of puzzle / piece matching game, where a score is constantly counting down and you have to keep filling it up. Or perhaps the idea of falling numbers? My mind was stuck for a little while, but after talking it through more, I considered what could be done in the limited time and the style I wanted to achieve. This led me to the idea of 'Descend', where you are descending through the Earth, trying to reach its centre, dodging obstacles as you go. Initially, the idea was the player character would be a number, which itself would count down like lives as you got hit ! And importantly, as you descended, the depth meter to your side would go down as well.

After coming up with the initial premise, I went on a walk with my dog to clear my head, and there the idea became more conceptualised in my mind. With fast-paced breakcore music, pretty colours in the distance, the world rushing past you, an exhilarating fall with the wind rushing past you, as you go faster and faster, leaving an ethereal trail behind. It was very inspired by the design and aesthetic of Celeste, with the simplicity of older mobile games like Jetpack Joyride and Doodle Jump, where it could easily be played on a mobile screen. It was at this point too I began to figure how I would go about implementing it. The plan was to have the player actually be at a constant position, and instead we just load in and unload the rows just above and below the screen, translating them upwards at different speeds to indicate the player was falling. However, what was I going to do it in? In the past I had used Unity for like [Box Quest](../box-quest), Knuckle Bones and Your Bullet Hell, but Unity wasn't great with pixels. It was also large, slow, clunky, and the UIs made it quite difficult to pick up. I wanted to learn Godot, but never got around to even installing it. So I instead explored the simplicity of HTML Canvas and JavaScript. Not only was I familiar with JavaScript, but the idea of making a game I could add rawly to my website was appealing! So, I looked around for some basic tutorials, and got to work.

## Learning HTML Canvas 
*90 hours remain.*
### Breakout Tutorial
### OOP Refactor

## Node Setup
*86 hours remain.*

# Day 2
*72 hours remain.*

## Row Generator
*71 hours remain.*

## Simple Player 
*68 hours remain.*

## Camera Shift 
*67 hours remain.*

## Designing Patterns
*66 hours remain.*

# Day 3
## Death Animation and Game Loop
### Shrinking box
### Spawning
### Camera reset

## Entity Refactor
### Row control problem
### Hitbox system 
### Balls

## Spriting
### Player Character Design
![Screenshot of designing Dee's spritesheet in Krita](./md/images/real_ss5.png)
*Screenshot of designing Dee's spritesheet in Krita.*

### Spriting the World 

## Row Blocks

## Boost Pads
### Design and Rendering
### Boosting

# Day 4

## Gameplay
### Implement and Parameterize the Row Blocks 
![Screenshot of Dee falling between a tight diagonal](./md/images/real_ss3.png)
*Screenshot of Dee falling between a tight diagonal.*

![Screenshot of the Chain Gap Row Block with momentum](./md/images/real_ss4.png)
*Screenshot of the Chain Gap Row Block with momentum.*

### Difficulty Grouping 
### Discrete Difficulty Distribution 

## UI
![Screenshot of Dee falling with the UI on the right](./md/images/real_ss2.png)
*Screenshot of Dee falling with the UI on the right.*

### Expanding the Canvas
### Depth Bar 
### Player Tracking
### Reset 

## Spriting 2
### Designing the Tiles
### Attaching Sprites to Entities
### Nightmare on Spritesheet 

# Evaluation 
## What I Learned 
## What I want to add 
## Final thoughts
