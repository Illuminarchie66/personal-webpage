# Introduction
This was the final coursework for my functional programming module at University, and was perhaps some of my best work across the four years I was at Warwick. I achieved the best mark in the entire year - 100%! Here I was able to explore difficult concepts in functional programming and monads, implementing them into a real functioning project, and researching the inner workings of one of my favourite games.

## Problem Specification
This coursework was simple and vague. We were to create a functional program. Using the scaffold code provided to us, we were to create a complete Haskell program that makes use of libraries, monads, input/output, and really a culmination of everything we had learned in the module. There was a lot of freedom in that you could make anything you wanted, and it would be judged on its merits as a working program, its implementation of functional programming practices, and its creativity and ingenuity. We were given some examples of IO and interfaces with Gloss, and what you could achieve with Haskell, but otherwise we were left to go and create. I was excited to use that freedom, and very early on decided upon creating a game. One particular game had my attention: Five Nights at Freddy's.

## Why FNAF
This was a personal favourite. I loved the theorising around it, binging theory videos about the lore and the scary secrets that surrounded the Pizzeria. For those unaware, Five Nights at Freddy's (FNAF) is an indie horror game built by Scott Cawthon. You take the role of a security guard in a haunted pizzeria, and have to survive the night shift by using your cameras to keep tabs on the animatronics roaming the hallways, blocking their advances with your doors, whilst managing how much power you use. It took the internet by storm and inspired the next generation of indie games.

The reason I had FNAF in mind was not just because of the lore, but because of how perfectly I believed it could work with Haskell. Haskell is not built for game development - it lacks the objects and hierarchies that make it easy to connect and manage elements as you would in a conventional game engine. Instead, Haskell works by passing and transforming functions. You can map anything to a function of time, progressing over a series of time steps and frames. This is perfect for FNAF, as it relies heavily on what happens and changes each frame to the game state. We can build the world as a single record, and develop functions that transform it as the night goes on.

![FNAF](./onaf/md/images/freddy.webp)
*Freddy, Bonnie and Chica in the opening cutscene.*

## Scope and Limitations
This was built under significant time pressure, completed within 3 weeks alongside other demanding courseworks (such as Waffles). This limited what I was able to achieve. Originally, I wanted to take photos around the university and of the lecturers, and have them be the animatronics hunting down students - but this got time-consuming and was not really coding, so we fell back on recreating the original game using its assets. We managed to recreate the majority of the game, implementing the core gameplay, Bonnie, Chica and Freddy, as well as the UI, power system and time system. We laid the foundations for Foxy and Golden Freddy, but unfortunately did not complete them. Audio and game menus also didn't make the cut. For the amount of work and learning required, these were necessary sacrifices to make the submission date.

Here we will detail the core concepts surrounding functional programming and this coursework, how we designed and implemented the core features, and the inner workings of FNAF.

---

# Background
Before discussing the project itself, we need to cover some context and core principles within functional programming.

## Functional Programming and Game Development
Functional programming and game development are generally at odds with each other. This comes down to the transformation of *state*. Games are stateful - the world changes every frame, with objects moving, health decreasing, buttons being pressed, and so on. In other languages and game engines, we manage this with mutable variables, for example `player.health -= 10` when the player takes damage. We can use attributes and classes to modify values with consistency and appropriate logic, with elegant abstraction and layered interaction.

Functional programming, meanwhile, treats data as immutable: you cannot modify values, only produce new ones. We use *pure functions* - a function being pure means it will always return the same output for the same input, with no side effects. No printing to screen, no modifying variables. Only an input and an output: `f :: a -> b`.

So how do we deal with a constantly changing game world? Instead of mutating state, the solution is to pass the whole world through. Each frame we take the current world, apply a transformation function, and get a new world back:

```haskell
update :: World -> World
```

The entire game is a fold over time! This becomes difficult to manage though, with complex function signatures and awkward input/output handling. Haskell uses `IO x` - a computation that, when executed, produces `x` while interacting with the outside world. This is not pure, so `IO` is quarantined and cannot be called from a pure function. This forces a clear separation between loading assets, reading inputs, and drawing to the screen. In practice, this was actually quite helpful for code maintainability, keeping game logic and interface development cleanly separated.

Games typically use object-oriented programming, allowing entities to exist as objects with attributes and methods that work independently. Haskell instead treats everything as data - which actually works well for FNAF. Animatronics have data which is updated each time step, and their behaviour is a function of that data rather than methods attached to an object.

## Haskell and the State Monad
To update the game state, we pass it through several functions. Many functions read and update the game world, taking a `GameState` as input and returning a modified `GameState` as output. We can compose these easily, but it becomes messy when a function also needs to return a value - such as a randomly generated number - as this complicates the signature and becomes verbose and error-prone.

Monads are the abstraction Haskell provides for this. A monad `M x` represents a computation that produces a value of type `x` within some context `M` - such as optionality (`Maybe`), a list of possibilities (`[]`), IO side effects (`IO`), or stateful computation (`State s`). We use the following:

```haskell
return :: x -> M x                  -- wraps a value in the context
(>>=)  :: M x -> (x -> M y) -> M y  -- chains computations
```

The bind operator `>>=` sequences two computations, passing the result of the first into the second and threading the context invisibly. The state monad `State s x` represents a computation that reads and writes a piece of state of type `s` and produces a value of type `x`. So `State GameState Int` is really just a function `GameState -> (Int, GameState)`. The monad wires these together so we don't have to pass state manually, and we can use the key primitives:

```haskell
get    :: State s s              -- read the current state
put    :: s -> State s ()        -- replace the state
modify :: (s -> s) -> State s () -- apply a function to the state
```

And we run the computations with:

```haskell
execState :: State s x -> s -> s      -- run, discard result, return final state
evalState :: State s x -> s -> x      -- run, discard final state, return result
runState  :: State s x -> s -> (x, s) -- run, return both
```

We use `execState` in our update loop and `evalState` in our render functions. We use `do` notation as syntactic sugar over `>>=`, for example:

```haskell
do
    gs <- get
    put gs { battery = battery gs - 1 }
```

desugars to:

```haskell
get >>= \gs -> put gs { battery = battery gs - 1 }
```

This decrements the battery in the game state. It feels like a mutation, but it is entirely pure. One important caveat: whenever we change the game state with `put`, we must re-`get` the updated state before the next operation - otherwise we'll be working from a stale snapshot and silently discard earlier changes.

## Gloss
Gloss is the Haskell library that abstracts over OpenGL to provide a simple 2D graphics interface. Working with IO directly is difficult, and Gloss simplifies it considerably - abstracting away rendering, window events, and frame buffer management. We use the `play` function for interactive programs:

```haskell
play :: Display
    -> Color                     -- background colour
    -> Int                       -- frames per second (fps)
    -> world                     -- initial game state
    -> (world -> Picture)        -- render function
    -> (Event -> world -> world) -- input handler
    -> (Float -> world -> world) -- update function
    -> IO ()
```

The `Picture` type represents a scene graph - a scene built from primitives like `Circle`, `Line`, `Polygon`, etc., which can be composed with transformations. Gloss takes the `Picture` and handles rendering it.

We also use `gloss-juicy`, an additional library that uses the `JuicyPixels` image decoder to load PNG files into Gloss `Picture` values. We load them with `loadJuicyPNG :: FilePath -> IO (Maybe Picture)`, storing everything in a flat list `[Picture]` and referencing images by index. This lets us use the original FNAF assets, which we sourced [here](https://www.dropbox.com/scl/fo/8wzj0bx3diqvqrzxxxp5n/AKB30QcG8YrSL9rH_P50pxY/Textures?rlkey=u9btlhkulzw2qslxjgatc75qz&e=1&dl=0subfoldernavtracking).

We learnt a lot about using Gloss from [Monday Morning Haskell](https://mmhaskell.com/blog/2019/3/25/making-a-glossy-game-part-1), a [Glossy Haskell Game](https://github.com/bergsans/glossy-haskell-game) and the [Haskell documentation](https://hackage.haskell.org/package/gloss-game-0.3.3.0/docs/Graphics-Gloss-Game.html), as well as receiving extensive help from seminar tutors.

## Randomness in Pure Functions
As discussed, Haskell uses pure functions - for a given input, you always get the same output. Randomness directly conflicts with this: it is, by definition, impure. The solution is a pseudo-random generator. `StdGen` is a deterministic generator where, given the same seed, it will always produce the same sequence of numbers.

```haskell
randomR :: (Random a, RandomGen g) => (a, a) -> g -> (a, g)
```

This takes a range and a generator, and returns a new value alongside a new generator. The old generator is unchanged, and we use the new one for the next call. Randomness is therefore pure - it just requires explicitly threading the generator. We store a `StdGen` in the `rndGen` field of our `GameState`, and define `doRandomThing` as a `State GameState Int` action that extracts the generator, produces a new random value, and stores the updated generator back. We include a `trace` call just to keep track of the ranges and values during debugging.

```haskell
doRandomThing :: Int -> Int -> State GameState Int
doRandomThing x y = do
    gs@GameState{..} <- get
    let (z, g') = randomR (x, y) rndGen
    put gs {rndGen = trace ("Range: " ++ show x ++ ", " ++ show y ++ ": " ++ show z) g'}
    return z
```

This threads randomness through the State monad directly, advancing the seed and returning the value in one step. The initial seed is obtained in `main` via `IO`, so the rest of the system remains entirely pure.

## Graph Theory for AI
The animatronics roam the pizzeria and advance toward the player along various routes. We need an effective way to represent this traversal. We can model the pizzeria as a graph, where rooms are vertices and valid movements between rooms are edges. At each step, we find the neighbours of the current node and select one. We define a graph `G = (V, E)`, where `V` is a set of vertices and `E` a set of edges. An undirected edge between `u` and `v` means movement is valid in both directions; a directed edge `(u, v)` means movement is only valid from `u` to `v`. We define a polymorphic graph type to capture this:

```haskell
data Graph a = Graph {vertices :: [a], edges :: [Edge a]}
data Edge a = Edge a a | Null
```

Using `getVertex :: Eq a => a -> Graph a -> [a]`, we acquire all vertices reachable from a given node and can use a random index to select the next destination. Bonnie and Chica use undirected graphs with branching paths, including dead ends (Backstage, Supply Closet, Kitchen) that slow their advance. Freddy uses a strictly linear directed path with no branching. Because the implementation is generic over the `Animatronic` type, adding a new character like Foxy would require only a new graph definition and minimal additional logic.

---

# Design

## GameState as the World
The `GameState` is the world of the program. We read it every frame to get the current state, update it to change the world, and the renderer uses it to decide what to draw. It holds everything that is mutable and adjustable. We use the `RecordWildCards` extension throughout, which lets us reference fields directly by name rather than through repeated `gs.field` access - keeping code considerably less noisy. The full breakdown is in the table below, but the core parts are: the game mode, the player's view and position, door and light booleans, animation frame indices, the three animatronic records, and system values like battery, frame timer, and random seed.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
        <th>Initial Value</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>mode</code></td><td>Mode</td><td>The current mode of the game.</td><td><code>Office</code></td></tr>
      <tr><td><code>inOffice</code></td><td>Animatronic</td><td>The animatronic currently in the office. Can be None.</td><td><code>None</code></td></tr>
      <tr><td><code>animState</code></td><td>Int</td><td>Animation state of the camera transition. Oscillates between 0 and 10.</td><td><code>0</code></td></tr>
      <tr><td><code>swapping</code></td><td>Bool</td><td>Whether we are currently swapping between Office and Cameras mode.</td><td><code>False</code></td></tr>
      <tr><td><code>position</code></td><td>Float</td><td>The horizontal position of the player's view.</td><td><code>0.0</code></td></tr>
      <tr><td><code>currentCam</code></td><td>Location</td><td>The camera location currently being viewed.</td><td><code>ShowStage</code></td></tr>
      <tr><td><code>staticIndex</code></td><td>Int</td><td>Index for the static overlay on the cameras.</td><td><code>0</code></td></tr>
      <tr><td><code>doorLeft</code></td><td>Bool</td><td>Whether the left door is closed.</td><td><code>False</code></td></tr>
      <tr><td><code>doorRight</code></td><td>Bool</td><td>Whether the right door is closed.</td><td><code>False</code></td></tr>
      <tr><td><code>lightLeft</code></td><td>Bool</td><td>Whether the left light is on.</td><td><code>False</code></td></tr>
      <tr><td><code>lightRight</code></td><td>Bool</td><td>Whether the right light is on.</td><td><code>False</code></td></tr>
      <tr><td><code>leftDoorMove</code></td><td>Bool</td><td>Whether the left door is currently animating.</td><td><code>False</code></td></tr>
      <tr><td><code>leftAnimState</code></td><td>Int</td><td>Animation frame of the left door.</td><td><code>0</code></td></tr>
      <tr><td><code>rightDoorMove</code></td><td>Bool</td><td>Whether the right door is currently animating.</td><td><code>False</code></td></tr>
      <tr><td><code>rightAnimState</code></td><td>Int</td><td>Animation frame of the right door.</td><td><code>0</code></td></tr>
      <tr><td><code>redDotState</code></td><td>Int</td><td>Frame counter for the red dot blink animation.</td><td><code>0</code></td></tr>
      <tr><td><code>freddy</code></td><td>Animatronic</td><td>Data and state for Freddy Fazbear.</td><td><code>Animatronic {...}</code></td></tr>
      <tr><td><code>bonnie</code></td><td>Animatronic</td><td>Data and state for Bonnie the Bunny.</td><td><code>Animatronic {...}</code></td></tr>
      <tr><td><code>chica</code></td><td>Animatronic</td><td>Data and state for Chica the Chicken.</td><td><code>Animatronic {...}</code></td></tr>
      <tr><td><code>deathIndex</code></td><td>Int</td><td>Tracks the current frame of the jumpscare animation.</td><td><code>0</code></td></tr>
      <tr><td><code>timer</code></td><td>Int</td><td>In-game timer tracking total elapsed frames.</td><td><code>0</code></td></tr>
      <tr><td><code>rndGen</code></td><td>StdGen</td><td>The random seed for pseudo-random number generation.</td><td><code>seed</code></td></tr>
      <tr><td><code>staticEffect</code></td><td>Int</td><td>Index for the static effect on the death screen.</td><td><code>0</code></td></tr>
      <tr><td><code>battery</code></td><td>Float</td><td>Remaining battery percentage.</td><td><code>100.0</code></td></tr>
      <tr><td><code>countDown</code></td><td>Int</td><td>Countdown during blackout until the Freddy jumpscare.</td><td><code>0</code></td></tr>
      <tr><td><code>intervalCount</code></td><td>Float</td><td>Accumulator tracking when the next battery drain should occur.</td><td><code>0</code></td></tr>
    </tbody>
  </table>
</div>

## Game Modes and the Mode Type
The way we determine what the game should be showing at any moment is with the `Mode` type. It can be `Office | Cameras | Dying | Dead | Blackout | End`, each representing a distinct state of the game. `Office` is the base gameplay - the player can look around the office, open and close doors, and check the lights. `Cameras` is when the player pulls up the monitor to view the rooms of the pizzeria. In both of these states, the animatronics are fully operational. `Dying`, `Dead`, `Blackout`, and `End` are effectively cutscenes: `Dying` plays the jumpscare animation, `Dead` shows the end-screen static, `Blackout` is the power-failure sequence before Freddy attacks, and `End` is the victory screen when you survive the night. The `render` function pattern-matches on `mode` to decide what to draw:

```haskell
render :: GameState -> [Picture] -> Picture
render gs imgs
    | mode gs == Office   = pictures (officeRender imgs gs ++ renderLeftDoor gs imgs ++ renderRightDoor gs imgs ++ evalState (renderCamUp imgs) gs ++ renderBattery gs imgs ++ renderTime gs imgs)
    | mode gs == Cameras  = pictures (evalState (renderCamDown imgs) gs ++ renderBattery gs imgs)
    | mode gs == Dying    = evalState (renderJumpScare imgs) gs
    | mode gs == Dead     = evalState (renderDeathScreen imgs) gs
    | mode gs == Blackout = pictures (evalState (blackoutRender imgs) gs)
    | mode gs == End      = imgs !! 209
```

In `Office` mode, it renders the backdrop, the door windows (showing Bonnie or Chica if present), the left and right buttons, the doors, the battery, and the time - plus the camera pull-up animation if `swapping` is active. In `Cameras` mode, it renders the room view for the current camera, the static overlay, the camera UI effects (red dot, white border), and the interactive map. When the player presses space, `swapping` is set to `True` and the transition animation begins, pulling the camera up one frame at a time until `animState` reaches 10 and the mode flips.

![Screenshot 1](./onaf/md/images/ss1.png)
*In-game view of the office.*

![Screenshot 2](./onaf/md/images/ss2.png)
*In-game view of the cameras.*

The camera image selection checks the game state and picks the appropriate image based on which animatronics are present, with Freddy always taking priority due to his mechanic of being frozen when observed. For example, in the dining area:

```haskell
diningAreaRender :: [Picture] -> GameState -> [Picture]
diningAreaRender imgs gs@GameState{..}
    | room freddy == DiningArea = [translate position 0.0 (imgs !! 99)]
    | room bonnie == DiningArea = [translate position 0.0 (imgs !! 96)]
    | room chica  == DiningArea = [translate position 0.0 (imgs !! 97)]
    | otherwise                 = [translate position 0.0 (imgs !! 33)]
```

The first guard that matches wins, with an empty room as the fallback. Images are referenced by their index in the flat asset list - `imgs !! 33` is the 33rd image loaded in `main`. One area for future improvement is adding variety here: Bonnie and Chica each have two possible dining area images in the original game, whereas currently only one is used per character.

<div class="image-row-wrapper">
    <div class="image-row">
        <img src="./onaf/md/images/48.png" alt="empty dining area">
        <img src="./onaf/md/images/120.png" alt="bonnie dining area">
        <img src="./onaf/md/images/492.png" alt="freddy dining area">
    </div>
    <p class="image-caption"><em>The possible images used for the Dining Area.</em></p>
</div>

The cutscene modes use `evalState` to return an animated picture from a stateful computation. The simplest example is the `Dead` state, which displays looping static. `renderDeathScreen` returns the image at index `121 + staticEffect`, where `staticEffect` cycles through [0, 4] - five static images across indices 121–125 - incrementing each frame to produce the animation. This same approach is used for all cutscene animations.

```haskell
renderDeathScreen :: [Picture] -> State GameState Picture
renderDeathScreen imgs = do
    gs@GameState{..} <- get
    return (imgs !! (121 + staticEffect))
```

## Animatronic Data Design
Each animatronic has a set of attributes we need to manage. We handle this with the `Animatronic` type, designed to be generic so that the same logic can be applied across all animatronics and new ones can be added with minimal friction.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
        <th>Initial Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>name</code></td>
        <td>Name</td>
        <td>Identifier for the animatronic, used to distinguish behaviour and routing logic.</td>
        <td><code>Freddy / Bonnie / Chica</code></td>
      </tr>
      <tr>
        <td><code>room</code></td>
        <td>Location</td>
        <td>The animatronic's current location within the pizzeria.</td>
        <td><code>ShowStage</code></td>
      </tr>
      <tr>
        <td><code>jumpFrames</code></td>
        <td>Int</td>
        <td>Number of distinct frames in the jumpscare animation.</td>
        <td><code>29 (Freddy), 11 (Bonnie), 16 (Chica)</code></td>
      </tr>
      <tr>
        <td><code>frameMultiplier</code></td>
        <td>Int</td>
        <td>How many times the jumpscare animation loops before transitioning to Dead.</td>
        <td><code>1 (Freddy), 3 (Bonnie / Chica)</code></td>
      </tr>
      <tr>
        <td><code>aggressionLevel</code></td>
        <td>Int</td>
        <td>Controls how often a movement attempt succeeds (0–20 scale).</td>
        <td><code>3 (Freddy), 17 (Bonnie / Chica)</code></td>
      </tr>
      <tr>
        <td><code>frameTracker</code></td>
        <td>Int</td>
        <td>Counts elapsed frames toward the next movement opportunity.</td>
        <td><code>0</code></td>
      </tr>
      <tr>
        <td><code>movementTake</code></td>
        <td>Int</td>
        <td>The frame threshold at which a movement attempt is triggered.</td>
        <td><code>121 (Freddy), 198 (Bonnie), 202 (Chica)</code></td>
      </tr>
    </tbody>
  </table>
</div>

This type effectively acts as a hierarchical extension of the `GameState` - a record we can operate on generically. The `room` field tracks location, while `aggressionLevel` and `movementTake` together define the character's AI - directly analogous to the custom night difficulty sliders in the original game. This clean design is what enables reusable functions and consistent type signatures across all three animatronics.

## Animatronic Graphs and Paths
Each animatronic has its own graph defining the routes it can take, with movement constrained by the conditions of the game state. The vertices of the graph are locations in the pizzeria, each corresponding to a camera the player can view:

```haskell
data Location
    = ShowStage     -- Cam 1A
    | PirateCove    -- Cam 1C
    | Restrooms     -- Cam 07
    | DiningArea    -- Cam 1B
    | WestHall      -- Cam 2A
    | WestCorner    -- Cam 2B
    | WestOffice
    | EastHall      -- Cam 4A
    | EastCorner    -- Cam 4B
    | EastOffice
    | SupplyCloset  -- Cam 03
    | Backstage     -- Cam 05
    | Kitchen       -- Cam 06
    | OfficeAnim
```

![Ingame map](./onaf/md/images/0.png)
*In-game map of available cameras.*

`OfficeAnim` represents the player's location from the animatronics' perspective. Each animatronic has its own directed graph, with Bonnie and Chica using bidirectional edges to allow movement in either direction.

<div class="image-row-wrapper">
  <div class="image-row">
    <img src="./onaf/md/images/1.png" alt="Bonnie Path">
    <img src="./onaf/md/images/2.png" alt="Chica Path">
    <img src="./onaf/md/images/3.png" alt="Freddy Path">
  </div>
  <p class="image-caption"><em>Movement paths for Bonnie, Chica, and Freddy.</em></p>
</div>

**Bonnie** follows a direct path of `ShowStage → DiningArea → WestHall → WestCorner → WestOffice → Office`, with `Backstage` and `SupplyCloset` as additional potential stops. Bonnie can only enter the office if the left door is open and no other animatronic is already inside. If either condition is not met, Bonnie is sent back to the `DiningArea`.

**Chica** follows `ShowStage → DiningArea → EastHall → EastCorner → EastOffice → Office`, with `Kitchen` and `Restrooms` as additional stops. The same entry conditions apply - open door, office unoccupied - with the same `DiningArea` reset on failure.

**Freddy** follows a strict linear path of `ShowStage → DiningArea → Restrooms → Kitchen → EastHall → EastCorner → Office`, with no branches and no backtracking. Freddy will not move if the player is currently watching his camera. Unlike Bonnie and Chica, encountering a closed door does not send him back - he simply waits outside, biding his time.

## Power and Time Systems
The power and time systems both operate on a frame-count basis. A running counter `intervalCount` increments each frame, and when it exceeds the current drain threshold, 1% battery is deducted and the counter resets. The threshold is $384 / 2^n$, where $n$ is the number of active power draws - the camera being open, a door being closed, or a light being on each count as one. At zero draws, the battery drains once every 9.6 seconds; each additional draw halves the interval, compounding the penalty for using multiple things simultaneously. When the battery reaches 0, the blackout phase begins.

The clock works the same way - `timer` increments each frame, and `timeRender` compares it against fixed thresholds to display the correct hour from 12 AM to 6 AM. The night spans 534 seconds (8 minutes and 54 seconds) at 40fps, with each hour occupying 89 × 40 frames.

One known limitation of both systems is that they assume a consistent 40fps. Because timing is based on frame counts rather than the `dt` float passed to `update`, any frame rate variation causes drift. A future improvement would be to accumulate `dt` and trigger events when a real-time threshold is crossed, decoupling game logic from render performance.

---

# Implementation
Now we have the theory, design and architecture in place - we can walk through the entire pipeline and how it all works together.

## Update Pipeline
The `update` function calls `execState update''`, running the entire per-frame logic as a single monadic chain over `GameState`. The first thing `update''` does is branch on `mode`. If the game is in `Dying`, `Dead`, or `Blackout`, it routes to a dedicated handler. Otherwise, the normal gameplay path runs seven actions in sequence:

```haskell
update'' :: State GameState ()
update'' = do
    gs@GameState{..} <- get
    if | mode == Dying    -> if battery < 0.0 then blackoutDeath else dyingUpdate
       | mode == Dead     -> deadUpdate
       | mode == Blackout -> blackoutUpdate
       | otherwise -> do
           updateInterval       -- updates the battery
           updateTime           -- increments the frame counter
           movementActionUpdate -- ticks the animatronics
           cameraUpdate         -- animates static and red dot
           animationUpdate      -- advances camera and door animations
           powerCheck           -- triggers blackout if battery <= 0
           toDie                -- triggers dying if an animatronic is in the office
```

The ordering is intentional. `updateInterval` drains the battery before `powerCheck` tests it, so the blackout trigger always sees an up-to-date value. `movementActionUpdate` advances the animatronics before `toDie` checks whether one has arrived, so an animatronic that reaches the office this frame is caught in the same frame. Each action reads the state as left by the previous one - this is what makes the ordering meaningful, and why the State monad is the right tool here.

## Office and Camera Render
The office render composes several picture layers, drawn back to front. The base layer is the scrollable backdrop, translated by `position` - a float that shifts as the player moves the mouse past the screen edge. The backdrop is slightly wider than the screen, giving the impression of rotating around the room. Everything in the world scrolls with it, while interactive elements like buttons and doors are translated with the inverse of position so they stay pinned to the screen edges.

`officeBackDropRender` selects the appropriate backdrop image based on lighting state and animatronic positions. If the left light is on and Bonnie is in `WestOffice`, a different image is used showing Bonnie in the window - which is the whole point of checking the lights. The door buttons similarly select from four variants combining the door and light booleans.

Input is handled in `handleKeys`, which pattern-matches on Gloss `Event` values. Mouse motion past the edge threshold shifts `position`; space sets `swapping`; a left click dispatches to `handleButtons`; releasing the mouse button clears both lights.

```haskell
handleKeys :: Event -> GameState -> GameState
handleKeys (EventKey (SpecialKey KeySpace) Down _ _) gs =
    if swapping gs then gs else gs { swapping = True }
handleKeys (EventMotion (x,y)) gs
    | x >  320.0 && position gs > -160.0 = gs { position = position gs - 10.0 }
    | x < -320.0 && position gs <  160.0 = gs { position = position gs + 10.0 }
handleKeys (EventKey (MouseButton LeftButton) Down _ (x,y)) gs = handleButtons gs (x,y)
handleKeys (EventKey (MouseButton LeftButton) Up   _ _    ) gs = gs { lightLeft = False, lightRight = False }
handleKeys _ gs = gs
```

`handleButtons` routes to `officeButtons` or `mapButtons` based on mode. The hit regions are manually measured pixel-coordinate bounding boxes - calculated based on where images are translated and offset by `position` for the office buttons. Imperfect, but functional.

The camera render layers the room view, the static overlay, the camera UI effects, and the interactive map. The room view dispatches through `camRender` to a per-room function based on `currentCam`, each guard checking animatronic positions. The static cycles through 8 transparent overlay images via `staticIndex mod 8`. The red dot blinks by rendering only when `redDotState < 64` out of a 96-frame cycle. The camera border is drawn as a Gloss `Line` primitive rather than a sprite. The map buttons work identically to the office buttons - pixel-coordinate hit testing that updates `currentCam` directly.

## Animations
All animations follow the same pattern: an integer index in `GameState` advances one step per frame, and the render function uses that index to select the current frame image. The benefit is simplicity - we only need a start index, and the frame counter handles progression automatically.

The camera transition is gated by `swapping`. When space is pressed, `animationUpdate` begins incrementing `animState` toward 10 (up) or decrementing it toward 0 (down). The transition images have transparent backgrounds, so they layer naturally over whatever is behind them. When the target is reached, `swapping` is cleared and `mode` flips.

```haskell
cameraUp :: GameState -> GameState
cameraUp gs = if animState gs == 10
    then gs { mode = Cameras, swapping = False }
    else gs { animState = animState gs + 1 }

cameraDown :: GameState -> GameState
cameraDown gs = if animState gs == 0
    then gs { mode = Office, swapping = False }
    else gs { animState = animState gs - 1 }
```

The doors use the same approach with `leftAnimState` and `rightAnimState`, counting from 0 to 12 to close and back down to 0 to open. The `doorMove` flags gate the animation - set on button press, cleared when the count reaches its target.

```haskell
rightDoor :: State GameState ()
rightDoor = do
    gs@GameState{..} <- get
    if | rightAnimState == 12 && doorRight      -> put gs { rightDoorMove = False }
       | rightAnimState /= 12 && doorRight      -> put gs { rightAnimState = rightAnimState + 1 }
       | rightAnimState == 0  && not doorRight  -> put gs { rightDoorMove = False }
       | rightAnimState /= 0  && not doorRight  -> put gs { rightAnimState = rightAnimState - 1 }
       | otherwise                              -> put gs
```

The jumpscare animations work the same way, using `deathIndex` as the frame counter. `renderJumpScare` selects the image at `baseIndex + (deathIndex mod jumpFrames)`, looping for `frameMultiplier` repetitions. For Bonnie and Chica, the camera pull-down animation plays simultaneously - they visually drag the monitor out of the way as they lunge. Freddy's handling accounts for whether the camera was up at the time of the attack.

```haskell
renderJumpScare :: [Picture] -> State GameState Picture
renderJumpScare imgs = do
    gs@GameState{..} <- get
    let cameraDown = if animState < 0 then [] else [imgs !! (3 + animState)]
        freddyCam  = if mode == Cameras then [] else cameraDown
    if | battery < 0.0          -> return (pictures [imgs !! (188 + deathIndex)])
       | name inOffice == Bonnie -> return (pictures ([imgs !! (110 + deathIndex `mod` jumpFrames inOffice)] ++ cameraDown))
       | name inOffice == Chica  -> return (pictures ([imgs !! (126 + deathIndex `mod` jumpFrames inOffice)] ++ cameraDown))
       | name inOffice == Freddy -> return (pictures ([imgs !! (143 + deathIndex `mod` jumpFrames inOffice)] ++ freddyCam))
```

## Animatronic AI
The animatronic AI was the most interesting element to implement, as it gave me the chance to dig into how the original game actually works. The AI is deliberately opaque to the player - it's supposed to feel unpredictable. The mechanic was sourced from this [excellent breakdown](https://youtu.be/ujg0Y5IziiY) by Tech Rules.

Each frame, `frameTracker` increments for every animatronic. When it exceeds `movementTake`, a move is attempted. `movementCheck` draws a random number between 0 and 20 - if it falls below `aggressionLevel`, the move proceeds; otherwise `frameTracker` resets. For example, Bonnie attempts a move every 198 frames (roughly every 4.95 seconds). If `aggressionLevel` is 17 and the roll is 11, the move goes ahead; if the roll is 19, it doesn't. This is the same aggression system used for the custom night difficulty in the original game.

![Custom night](./onaf/md/images/custom.webp)
*The original FNAF custom night menu.*

Freddy has one additional caveat: he cannot move if the player is currently watching his camera. This is checked by comparing `room freddy` to `currentCam` while `mode == Cameras`. It's what makes Freddy distinctly threatening - he always advances along his fixed path, and the only way to delay him is to keep your eyes on him.

When a move is taken, Bonnie and Chica call `getVertex` on their graph, receive all reachable rooms, and pick one at random - producing the non-deterministic wandering. Freddy always advances to the next room in his sequence. If any animatronic reaches the office, it checks whether the relevant door is open and whether `inOffice` is `None`. Bonnie and Chica retreat to `DiningArea` if either condition fails. Freddy, however, does not retreat - he simply waits outside the door until the conditions change.

## Death and Dying Pipeline
`toDie` is called every frame as the final step of the normal update chain. The moment `inOffice` is not `None`, and the trigger conditions are met, the mode switches to `Dying`. For Bonnie and Chica, the trigger requires `mode == Cameras` - they only attack when the monitor is up, pulling it down as they jumpscare you. Freddy triggers regardless of camera state.

Once in `Dying`, `dyingUpdate` runs each frame instead of the normal chain. It simultaneously increments `deathIndex` to advance the jumpscare animation and decrements `animState` to pull the camera down - both happening in parallel. When `deathIndex` reaches `frameMultiplier * jumpFrames`, the mode switches to `Dead`. Bonnie and Chica loop three times; Freddy plays once.

```haskell
dyingUpdate :: State GameState ()
dyingUpdate = do
    gs@GameState{..} <- get
    case deathIndex == frameMultiplier (inOffice) * jumpFrames (inOffice) of
        True  -> put gs { mode = Dead }
        False -> put gs { deathIndex = deathIndex + 1, animState = animState - 1 }
```

In `Dead` mode, `deadUpdate` cycles `staticEffect mod 5` indefinitely, looping the static screen. The only escape is closing the game.

The other death route is the blackout. When `battery` drops below zero, `powerCheck` sets `mode = Blackout` and generates a random `countDown` between 200 and 700 frames - roughly 5 to 17 seconds. `blackoutUpdate` decrements the counter each frame while pulling the camera down. When it reaches zero, Freddy is placed in `inOffice` and `Dying` is triggered with his secondary jumpscare animation. It's always a tense moment - you can hear the music box wind down, and all you can do is sit in the dark and wait.

---

# Evaluation
This coursework was an incredible experience, and I'm very grateful for the opportunity it gave me. Not only was it a great way to build something meaningful, but to do so with a game I genuinely care about. It taught me a great deal about functional programming, monads, and Haskell with Gloss - and also a surprising amount about game development in a constrained environment. Building the game state from the ground up, with no mutable variables and no objects, was both restrictive and revelatory. Stressful as it was under the tight deadline, it's one of my favourite things I've made - and achieving 100% made it all the sweeter.

There is plenty still to improve and add. The most obvious addition would be Foxy and Golden Freddy, which would make the game feel far more complete. The existing `Animatronic` type and graph infrastructure would carry over cleanly - the main addition would be Foxy's unique corridor sprint mechanic, which requires a timer-based approach rather than standard graph traversal. Audio would also make a significant difference to the horror atmosphere; we experimented with it but found it complex to integrate, and would likely look at `hmp3` or `minstrel` for a future attempt. A proper menu system - for customising animatronic difficulty, progressing through nights, and so on - was always planned but deprioritised in favour of the core gameplay.

Smaller improvements worth making include: replacing frame counters with `dt` accumulation to prevent timing drift at variable frame rates; adding screen static transitions when animatronics move between rooms, so they feel less like they're teleporting; and introducing more variation in camera images where multiple possibilities exist in the original assets.

Despite all of that, I'm very happy with what was achieved. And being able to write about *Freddy Fazbear* in a university coursework submission is, genuinely, pretty awesome.