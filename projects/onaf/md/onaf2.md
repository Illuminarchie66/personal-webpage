# Introduction
This was the final coursework for my functional programming module at University, and was perhaps some of my best work of the four years I was at Warwick. I did the best in the entire year - achieving 100%! Here I was able to explore difficult concepts with functional programming and monads; implementing them into a real functioning project; and researching the inner workings of one of my favourite games. 

## Problem Specification
This coursework was simple and vague. We were to create a functional program. Using the scaffold code provided to us, we were to create a complete Haskell program, that makes use of libaries, monads, input/output, and really a culmination of everything we had learned in this module. There was a lot of freedom in that you could make anything that you wanted, and it would be judged on its merits as a working program, implementing functional programming practices, and its creativeness/ingenuity. We were given some example of IO and interfaces with Gloss, and what you could achieve with Haskell, but otherwise we were left to go and create. I was excited to use the freedom, and very early on decided upon creating a game. One particular game had my attention: Five Nights at Freddy's.

## Why FNAF
This was a personal favourite. I loved the theorising around it, binging theory videos about the lore and the scary secrets that surrounded the Pizzeria. For those unaware, Five Nights at Freddy's (FNAF), is an indie horror game built by Scott Cawthon. You take the role of a security guard in a haunted pizzeria, and have to survive five nights by using your cameras to keep tabs on the animatronics roaming the hallways, blockign their advances with your doors, whilst managing how much power you use. It took the internet by storm, and inspired the next generation of indie games. The reason I had FNAF on mind, was not just because of the lore, but because of how perfectly I believed it could work with Haskell. Haskell is not built for game development, lacking objects and hierarchies, that make it hard to connect and manage elements like you would in a normal game. Instead, Haskell works by passing functions, such as passing a state. You can map anything to a function of time, progressing over a series of time steps, frames, transforming with a function. This is perfect for FNAF, as it relies heavily on time steps, and what happens and changes each frame to the game state. The reason this is perfect is because we can build the world as a game state, and develop functions that transform it as the night goes on. 

![FNAF](./onaf/md/images/freddy.webp)
*Freddy, Bonnie and Chica in the opening cutscene.*

## Scope and Limitations
This was built under a lot of time pressure, compelting this within 3 weeks - alongside other difficult courseworks (such as Waffles). This limited the scope to what I was able to achieve. Originally, I wanted to take photos of the university, and of the lecturers, and have them be the animatronics hunting down students, but this got time consuming and was not actual coding, so we instead fell back upon recreating the original game using the assets. We managed to recreate the majority of the game, implementing the gameplay, Bonnie, Chica and Freddy, as well as the UI, power system and time. We laid the foundations for Foxy and Golden Freddy, but unfortunately did not complete them. We also failed to add the audio, as well as the game menus. For the amount of work and learning required, these were necessary sacrifices to get this done for the submission date. Here we will detail the core concepts surrounding functional programming and this coursework, how we designed and implemented the core features, and the inner workings of FNAF.

# Background
Before discussing the project itself, we need to discuss the context and some core principals within functional programming.

## Functional Programming and Game Development
Functional programming and game development generally are at odds with each other. This is due to the transformation of *state*. Games are stateful, the world changes every frame with objects moving, health decreasing, buttons being pressed etc. In other languages or game enginges, we manage this with mutable variables, for example `player.health -= 10` when the player gets hit. We can use attributes and classes to modify values with consistency and appropriate logic, with elegant abstraction and layers of interaction. Functional programming meanwhile has data as immutable: you cannot modify values, only produce new ones. 

We use *pure functions*. A function being pure means that it will always return the same output for the same input, with no side effects - no printing to screen or modifying variables. Only an input and an output `f:: a -> b`. So how do we deal with the constantly changing game world? Instead of mutating state, the solution is to pass through the whole world. Each frame we take the current world, apply a transformation function, and get a new world back:
```haskell
update :: World -> World
```
The entire game is a fold over time! This becomes difficult to manage though, with complex function signatures, and working with inputs and outputs. Haskell uses `IO x`, which is some computation, when executed produces `x` while interacting with the outside world. This is not pure, so `IO` is quarantined, meaning it cannot be called from a pure function. Therefore we require clear separation of loading assets, reading inputs, and drawing to the screen. In our development, this was actually quite helpful for improving code maintainability, separating development of game logic and interface. 

Games typically use object oriented programming, allowing for entities in the form of objects with attributes and methods to work independently. Haskell instead treats everything as data - which actually works well for FNAF. Animatronics have data which is updated each time step, and can be treated as an updating world state. Behaviour is a function of data, rather than methods attached to it.

## Haskell and State Monad
To update the game state, we would pass it through several functions. We have many fucntions that read and update the game world, taking a `GameState` type as an input, and a modified `GameState` as an output. We can compose these easily, but this becomes messy when the function also needs to return a value, such as a randomly generated number, which updates the signature, becoming verbose and sometimes error prone. Monads are the abstraction Haskell provides for this issue, where monad `M x` represents a computation that produces a value of type `x` within some context `M`, such as optionality (`Maybe`), a list of possibilities (`[]`), IO side effects (`IO`) or a stateful computation `State s`. We use the following:
```haskell
return :: x -> M x                 --wraps value in the context
(>>=)  :: M x -> (x -> M y) -> M y --chain computations
```
The bind operator `>>=` sequences two computations, passing the result of the first into the second, threading context invisibly. The state monad `State s x` represents computation that reads and writes a piece of state of type `s` and produces `a`. So `State GameState Int` is really just a function `GameState -> (Int, GameState)`. The monad wires these so we don't need to pass the state manually, and we can use the key primitives: 
```haskell
get    :: State s s              --read current state
put    :: s -> State s ()        --replace the state 
modify :: (s -> s) -> State s () --apply a function to the state 
```
And we run the computations with:
```haskell
execState :: State s x -> s -> s      --run, discard result, return final state
evalState :: State s x -> s -> x      --run, discard final state, return result
runState  :: State s x -> s -> (x, s) --run return both
```
We use `execState` in our update loop and `evalState` in our render functions. We use `do` notation as syntactic sugar over `>>=`, for example:
```haskell
do
    gs <- get
    put gs { battery = battery gs - 1}
```
desugars to:
```haskell
get >>= \gs -> put gs { batter = battery gs - 1}
```
which is code for decrementing the battery value in the game state. It feels like a mutation, but it is entirely pure. Important to note that whenever we change the game state with `put`, we have to re-`get` the game state, else we discard the first action.

## Gloss
This is the Haskell libary that abstracts over OpenGL to allow for simple 2D graphics interface. Working with IO is difficult, and this library simplifies it. It abstracts away rendering, window events or managing frame buffers; instead Gloss handles all of this. We use the `play` function for interactive programs:
```haskell
play :: Display
    -> Color                     --background color
    -> Int                       --frames per second (fps)
    -> world                     --initial game state
    -> (world -> Picture)        --render function
    -> (Event -> world -> world) --input handler
    -> (Float -> world -> world) --GameState update
    -> IO ()
```
The `Picture` type represents a scene graph, representing a scene, with primitives like `Circle`, `Line`, `Polygon`, etc, which can be composed with transformations. Gloss takes the Picture and renders it. 

We also use `gloss-juicy`, an additional libary that uses `juicyPixels` image decoder to load PNG files into the Gloss `Picture`. We do it with `loadjuicyPNG :: FilePath -> IO (Maybe main)`, and we load it into a list of pictures `[Picture]`, where we reference the index. So if we want to use the first image, we reference `1`. By loading in images, we can use the assets from the original FNAF that we found [here](https://www.dropbox.com/scl/fo/8wzj0bx3diqvqrzxxxp5n/AKB30QcG8YrSL9rH_P50pxY/Textures?rlkey=u9btlhkulzw2qslxjgatc75qz&e=1&dl=0subfoldernavtracking). 

We learnt a lot about using Gloss from [Monday Morning Haskell](https://mmhaskell.com/blog/2019/3/25/making-a-glossy-game-part-1), a [Glossy Haskell Game](https://github.com/bergsans/glossy-haskell-game) and the [Haskell documentation](https://hackage.haskell.org/package/gloss-game-0.3.3.0/docs/Graphics-Gloss-Game.html); as well as recieving extensive help from seminar tutors. 

## Randomness in Pure Functions
We have discussed before that Haskell uses *pure functions*, meaning that for a given input, it will always give the same given output. If we want to have randomness, it directly conflicts with Haskell's design, and is by definition: impure. The solutuon is to use a pseudo-random generator. `StdGen` is a deterministic generator, where given the same seed, it will always produce the same sequence of numbers.
```haskell
randomR :: (Random a, RandomGen g) => (a, a) -> g -> (a, g)
```
This takea a range and a generator, and returns a new value and a new generator. The old generator is unchanged, and we use the new one for the next call. Therefore randomness is pure, it just requires explicitly threading the generator. The way we use this is with the `StdGen` inside the `GameState` inside `rndGen` field. We define `doRandomThing` as a `State GameState Int` action that extracts the generator, creates a new random value, and stores the updated generator back. We include a trace in the funciton just to keep track of the ranges and values.
```haskell
doRandomThing :: Int -> Int -> State GameState Int
doRandomThing x y = do
        gs@GameState{..} <- get
        let (z, g') = (randomR (x, y) rndGen)
        put gs {rndGen = trace ("Range: " ++ show x ++ ", " ++ show y ++ ": " ++ show z) g'}
        return z
```
This threads randomness through the State monad directly, getting a random value and advancing the seed automatically. The initial seed is obtained in `main` via `IO`, so the system remains entirely pure.

## Graph Theory for AI
The animatronics roam the pizzeria, and advance toward the player. There are various routes and paths that the animatronics can take and we need an effective way to represent traversal. We can model the pizzeria as a directed graph, where rooms are vertices, and valid movement between rooms are edges. So at each step, we find the neighbours of the current node and select one at random. We define graph `G=(V,E)`, where we have a set of vertices `V` and a set of edges `E`. An undirected edge between `u` and `v` means movement is valid in both directions; whereas a directed edge `(u,v)` means movement is only valid for `u` to `v`. We use this to define a polymorphic graph type:
```haskell
data Graph a = Graph {vertices :: [a], edges :: [Edge a]}
data Edge a = Edge a a | Null
```
Where we can use our function `getVertex :: a => a -> Graph a -> [a]` to acquire all vertices attached to a given node. We then can use a random index to isolate a random vertex to move toward. Bonnie and Chica use undirected graphs with branching paths, which has routes leading to deadends (Backstage, Supply Closet, and Kitchen) and not just the player's office. Meanwhile Freddy has a much stricter linear directed path, using a directed graph. We can use this graph abstraction for easily adding more animatronics easily, such as adding `Foxy` with minimal additions. The implementation is generic over animatronics, making it easily applicable.  

# Design
## GameState as the World
The `GameState` is the world of the program. We call it repeatedly to get the current state, update it repeatedly to change the world, the renderer uses it to depict the screen. This is everything that is mutable and adjustable. We use `RecordWildCards` extension, which means that we can reference the fields directly instead of `gs.field`, which makes working with the game state less noisy. The full breakdown of the `GameState` is in the table, but the core parts are the game mode, player view and position, door and light values, animation frame indicies, animatronic records and game systems like the battery or random seed.

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
      <tr><td><code>mode</code></td><td>Mode</td><td>This is the mode of the game, what is occurring at the time.</td><td><code>Office</code></td></tr>
      <tr><td><code>inOffice</code></td><td>Animatronic</td><td>This is the animatronic currently in the office. Can be None.</td><td><code>None</code></td></tr>
      <tr><td><code>animState</code></td><td>Int</td><td>This is the animation state of the camera. Oscillates between 0 and 10.</td><td><code>0</code></td></tr>
      <tr><td><code>swapping</code></td><td>Bool</td><td>Whether we are swapping between Office mode and Cameras mode.</td><td><code>False</code></td></tr>
      <tr><td><code>position</code></td><td>Float</td><td>The numerical position of where the user is looking on the screen.</td><td><code>0.0</code></td></tr>
      <tr><td><code>currentCam</code></td><td>Location</td><td>Current camera location being viewed.</td><td><code>ShowStage</code></td></tr>
      <tr><td><code>staticIndex</code></td><td>Int</td><td>Index for determining what static to overlay the cameras.</td><td><code>0</code></td></tr>
      <tr><td><code>doorLeft</code></td><td>Bool</td><td>Whether the left door is down.</td><td><code>False</code></td></tr>
      <tr><td><code>doorRight</code></td><td>Bool</td><td>Whether the right door is down.</td><td><code>False</code></td></tr>
      <tr><td><code>lightLeft</code></td><td>Bool</td><td>Whether the left light is on.</td><td><code>False</code></td></tr>
      <tr><td><code>lightRight</code></td><td>Bool</td><td>Whether the right light is on.</td><td><code>False</code></td></tr>
      <tr><td><code>leftDoorMove</code></td><td>Bool</td><td>Whether the left door is currently moving.</td><td><code>False</code></td></tr>
      <tr><td><code>leftAnimState</code></td><td>Int</td><td>Animation state of the left door.</td><td><code>0</code></td></tr>
      <tr><td><code>rightDoorMove</code></td><td>Bool</td><td>Whether the right door is currently moving.</td><td><code>False</code></td></tr>
      <tr><td><code>rightAnimState</code></td><td>Int</td><td>Animation state of the right door.</td><td><code>0</code></td></tr>
      <tr><td><code>redDotState</code></td><td>Int</td><td>Animation state of the red dot.</td><td><code>0</code></td></tr>
      <tr><td><code>freddy</code></td><td>Animatronic</td><td>Data/state for Freddy Fazbear.</td><td><code>Animatronic {--freddy}</code></td></tr>
      <tr><td><code>bonnie</code></td><td>Animatronic</td><td>Data/state for Bonnie the Bunny.</td><td><code>Animatronic {--bonnie}</code></td></tr>
      <tr><td><code>chica</code></td><td>Animatronic</td><td>Data/state for Chica the Chicken.</td><td><code>Animatronic {--chica}</code></td></tr>
      <tr><td><code>deathIndex</code></td><td>Int</td><td>Tracks frames of the jumpscare animation.</td><td><code>0</code></td></tr>
      <tr><td><code>timer</code></td><td>Int</td><td>In-game timer tracking total frames.</td><td><code>0 * 40</code></td></tr>
      <tr><td><code>rndGen</code></td><td>StdGen</td><td>Random seed for pseudo-random number generation.</td><td><code>seed</code></td></tr>
      <tr><td><code>staticEffect</code></td><td>Int</td><td>Index for static effect on the death screen.</td><td><code>0</code></td></tr>
      <tr><td><code>battery</code></td><td>Float</td><td>Battery percentage remaining.</td><td><code>100.0</code></td></tr>
      <tr><td><code>countDown</code></td><td>Int</td><td>Countdown during blackout until jumpscare.</td><td><code>0</code></td></tr>
      <tr><td><code>intervalCount</code></td><td>Float</td><td>Frequency at which the battery depletes by 1.</td><td><code>0</code></td></tr>
    </tbody>
  </table>
</div>

## Game Modes and Mode Type
The way we determine what the game should be showing is with the `Mode` type. It can be `Office | Cameras | Dying | Dead | Blackout | End`, where each represent what the game should be doing. The `Office` is the base gameplay, where the player can look around the office, open and close doors, etc. `Cameras` is when the player is looking at the cameras, and can navigate to view each of the rooms in the pizzeria. In both of these states, the animatronics are fully operational. `Dying`, `Dead`, `Blackout` and `End` are effectively cutscenes, where `Dying` is where a jumpscare animation plays, `Dead` is where an end screen static displays, `Blackout` is where you run out of power and Freddy kills you, and `End` is the victory screen when you complete the night. The `render` function pattern matches on the mode to decide on what to draw.
```haskell
render :: GameState -> [Picture] -> Picture
render gs imgs
    | mode gs == Office = pictures (officeRender imgs gs ++ renderLeftDoor gs imgs ++ renderRightDoor gs imgs  ++ evalState (renderCamUp imgs) gs ++ (renderBattery gs imgs) ++ (renderTime gs imgs))
    | mode gs == Cameras = pictures (evalState (renderCamDown imgs) gs ++ renderBattery gs imgs)
    | mode gs == Dying = evalState (renderJumpScare imgs) gs
    | mode gs == Dead = evalState (renderDeathScreen imgs) gs
    | mode gs == Blackout = pictures (evalState (blackoutRender imgs) gs)
    | mode gs == End = (imgs !! 209)
```
So when it is the `Office` mode, it will render the office image, the backdrop (whether Bonnie or Chica are in the windows), the left/right buttons, the left door, the right door, the battery, the time and whether the camera is being pulled up. It has these as a list of pictures `[Pictures]`, which Gloss will render in order. When the player presses *space*, it initiates the animation to begin, which has the camera pull up one frame at a time, and when the animation is complete it will switch to the `Cameras` mode. When in `Cameras` mode, it renders the camera image based on the location, the static over the screen, the camera effects (like the red dot and white lines), and the map which has buttons to allow the user to navigate. The map is done ratehr poorly, where each option has it just have a green box added to the map, which is handled by individual images. The `Cameras` also has a check for the swapping after *space* has been pressed. 

![Screenshot 1](./onaf/md/images/ss1.png)
*In game view of the office.*

![Screenshot 2](./onaf/md/images/ss2.png)
*In game view of the cameras of the stage.*

The way the image selection works for the cameras, is that it checks the game state, and depending on who is in that location, it will depict an image with the animatronic there - prioritised by Freddy, due to his game mechanic. For example in the dining area
```haskell
diningAreaRender :: [Picture] -> GameState -> [Picture]
diningAreaRender imgs gs@GameState{..}
    | room freddy == DiningArea = [translate position 0.0 (imgs !! 99)]
    | room bonnie == DiningArea = [translate position 0.0 (imgs !! 96)]
    | room chica == DiningArea = [translate position 0.0 (imgs !! 97)]
    | otherwise = [translate (position) 0.0 (imgs !! 33)]
```
It checks if the room that each animatronic is in is equal to the location. The first one that is a hit, is what it will go for. Otherwise it will use a default empty image. The images are determined by index, so `imgs !! 33` means the 33rd image in the asset list loaded in. This does need to be extended upon in future for some randomness in the images, as for example Bonnie and Chica have two possible dining area images that could be used, whereas right now it only uses one possible image. 

<div class="image-row-wrapper">
    <div class="image-row">
        <img src="./onaf/md/images/48.png" alt="empty dining area">
        <img src="./onaf/md/images/120.png" alt="bonnie dining area">
        <img src="./onaf/md/images/492.png" alt="freddy dining area">
    </div>
    <p class="image-caption"><em>The possible images used for the Dining Area.</em></p>
</div>

The cutscene modes uses `evalState`, which allows for the pictures taking the form of an animation. The simplest example of this is `Dead` state, which should just show a screen of static. The way we do this is that we call `evalState renderDeathScreen`, which returns an image with index of `121 + staticEffect`, where `staticEffect` is an integer in the range of [0,4]. This is because we have 5 static images on indices 121, 122, 123, 124 and 125, and so each frame while in the `Dead` mode, we increment the `staticEffect` in the game state, so it animates. This is the method we use for all of our cutscenes, which we will detail more in our implementation. 
```haskell
renderDeathScreen :: [Picture] -> State GameState Picture
renderDeathScreen imgs = do
    gs@GameState{..} <- get
    return (imgs !! (121 + staticEffect))
```

## Animatronic Data Design
Each animatronic has a set of attributes we must manage as well. We do this with our `Animatronic` type, which is purposefully made generic so that we can easily apply the same logic across all of our animatronics and add new ones seamlessly.

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
        <td>Identifier for the animatronic (used to distinguish behaviour and logic).</td>
        <td><code>Freddy / Bonnie / Chica</code></td>
      </tr>
      <tr>
        <td><code>room</code></td>
        <td>Location</td>
        <td>The current location of the animatronic within the map/camera system.</td>
        <td><code>ShowStage</code></td>
      </tr>
      <tr>
        <td><code>jumpFrames</code></td>
        <td>Int</td>
        <td>Number of frames used for the jumpscare animation sequence.</td>
        <td>
          <code>29 (Freddy)</code><br>
          <code>11 (Bonnie)</code><br>
          <code>16 (Chica)</code>
        </td>
      </tr>
      <tr>
        <td><code>frameMultiplier</code></td>
        <td>Int</td>
        <td>Multiplier controlling how long or intense the jumpscare animation appears.</td>
        <td>
          <code>1 (Freddy)</code><br>
          <code>3 (Bonnie/Chica)</code>
        </td>
      </tr>
      <tr>
        <td><code>aggressionLevel</code></td>
        <td>Int</td>
        <td>Determines how frequently the animatronic attempts to move or act.</td>
        <td>
          <code>1 (Freddy)</code><br>
          <code>10 (Bonnie/Chica)</code>
        </td>
      </tr>
      <tr>
        <td><code>frameTracker</code></td>
        <td>Int</td>
        <td>Tracks elapsed frames to decide when movement opportunities occur.</td>
        <td><code>0</code></td>
      </tr>
      <tr>
        <td><code>movementTake</code></td>
        <td>Int</td>
        <td>Frame interval at which the animatronic attempts to move (lower = more frequent movement).</td>
        <td>
          <code>121 (Freddy)</code><br>
          <code>198 (Bonnie)</code><br>
          <code>202 (Chica)</code>
        </td>
      </tr>
    </tbody>
  </table>
</div>

This basically acts as an extension of the GameState, but hierarchical - it acts as a class we can operate upon. The `room` tracks where the animatronic is, and the `aggressionLevel` and `movementTake` determines the AI of the animatronic. This can be translated into the custom night options in the original game. This clean design is what allowed for more efficient code, with repeat functions and type signatures. 

## Animatronic Graphs and Paths
Each animatronic has their own graph and path they use, which varies on the conditionals of the game state. The vertices of the graph are the different locations in the pizzeria, whcih each have a corresponding camera:
```haskell
data Location
    = ShowStage     --Cam 1A
    | PirateCove    --Cam 1C
    | Restrooms     --Cam 07
    | DiningArea    --Cam 1B
    | WestHall      --Cam 2A
    | WestCorner    --Cam 2B
    | WestOffice
    | EastHall      --Cam 4A
    | EastCorner    --Cam 4B
    | EastOffice
    | SupplyCloset  --Cam 03
    | Backstage     --Cam 05
    | Kitchen       --Cam 06 +
    | OfficeAnim
```

![Ingame map](./onaf/md/images/0.png)
*In game map of available cameras.*

Note that `OfficeAnim` is the player's location, the office, for the animatronics. Each animatronic then has their own directed graph, where Bonnie and Chica have bidirectional edges to allow them to go either direction. You can see their graphs below:

<div class="image-row-wrapper">
  <div class="image-row">
    <img src="./onaf/md/images/1.png" alt="Bonnie Path">
    <img src="./onaf/md/images/2.png" alt="Chica Path">
    <img src="./onaf/md/images/3.png" alt="Freddy Path">
  </div>
  <p class="image-caption"><em>Movement paths for Bonnie, Chica, and Freddy.</em></p>
</div>

Bonnie has a direct path of `ShowStage -> DiningArea -> WestHall -> WestCorner -> WestOffice -> Office`, with the `Backstage` and `SupplyCloset` as additional stops. Bonnie can only enter the office if the door is open, and there is no other animatronic inside. If either of these conditions are not met, then Bonnie is reset back to the `DiningArea`. 

Chica's direct path is `ShowStage -> DiningArea -> EastHall -> EastCorner -> EastOffice -> Office`, with the `Kitchen` and `Restrooms` as additional stops. Chica can only enter the office is the door is open, and there is no other animatronic inside. If either of these conditions are not met, then Bonnie is reset back to the `DiningArea`.

Freddy has a direct path `ShowStage -> DiningArea -> Restrooms -> Kitchen -> EastHall -> EastCorner -> Office`, and has no additional stops, and will not backtrack. Freddy will not move if the current camera is looking at him. As opposed to Bonnie and Chica, when encountering a door, he does not turn away, he instead waits there. 

## Power and Time systems
The power and time systems operate on a frame count basis, with a raw counter `intervalCount` that increments each frame. When this exceeds the current drain threshold, 1% battery is deducted and the counter resets. We yse tge threshold $384 / 2^n$, where $n$ is the number of active power draws: camera being open, a door being closed, or a light being on. Therefore, it drains every 9.6 seconds, and halves for each additional usage. This punishes constantly using the camera, and the doors. We render the battery depletion as percentages. When the battery reaches 0, it will start the blackout stage of the game. The clock uses the same system, with the timer incrementing each frame, and the `timeRender` compares it agaisnt fixed thresholds defined by `[0, 89*40, 178*40, 267*40, 356*40, 445*40]`, ending at 534 seconds, or 8 minutes and 54 seconds. We multiply by 40 as that us our frame rate. This works well for what it needs to do, however does run the assumption that it will have a consistent 40 frames a second, rather than working with `dt`. In the future, it should be reworked for delta time to be passed through instead of relying on frames.

# Implementation 
Now we know the theory, design and architecture, we can run through the entire pipeline and how everything works together. 

## Update Pipeline
We have our GameState and data structures in place, now we look to what happens each update. The `update` function calls `execState update''`, which makes use of the state monad. This is where the bulk of the program is initiated, covering each of the updates and routes to take.
```haskell
update'' :: State GameState ()
update'' = do
    gs@GameState{..} <- get
    if | mode == Dying -> if (battery < 0.0) then blackoutDeath else dyingUpdate
       | mode == Dead -> deadUpdate
       | mode == Blackout -> blackoutUpdate
       | otherwise -> do
           updateInterval       --Updates the battery
           updateTime           --Updates the ingame timer (by frame)
           movementActionUpdate --Updates the animatronic's actions
           cameraUpdate         --Updates the visuals on the cameras
           animationUpdate      --Updates the animations occuring on screen
           powerCheck           --Checks if the battery is below what it should be
           toDie                --Checks whether the player should be dead.
```
This isolates each of the modes into operations, with the primary gameplay being the list of updates. `updateInterval` updates the batter. `updateTime` increments the frame counter. The `movementActionUpate` calls `animatronicAction` on each animatronic, where it checks if the `frameTracker > movementTake` of the animatronic. If it is, it will go and move, otherwise it just increments. `movementTake` is baked into the animatronic itself. `cameraUpdate` makes it so that the static and red dot of the camera is animated, incrementing the static index and flashing red dot respectively. `animationUpdate` managed the animations occuring on the screen, checking if the player is *swapping* (switching between camera and office mode), and if the office doors are opening or closing. `powerCheck` checks the abttery each frame, and if lower than 0 it will start the blackout phase, initiating a random timer until Freddy attacks. Finally `toDie` checks if an animatronic is in your room - and if it is then it checks if the camera is pulled up, in which it will jumpscare immediately.

## Office and Camera Render
The office render consists of pictures composed by layers as mentioned before. The base layer is the scrollable backdrop, translated by `position`, which reflects the coordinates of where the mouse is on the player's screen. Everything that belongs to the world (all pictures on the screen) scroll with it. The image is a bit too wide for the screen, which gives the parallax impression that we are rotating about the room. 

Translating the `officeBackDropRender` renders the backdrop with appropriate lighting, dependent on if Bonnie/Chica is present, and whether the light button is pressed. We also do this with the interactable elements of the left and right buttons and doors. For example, if the left light is on and Bonnie is in the `WestOffice`, a different image is shown with Bonnie visible in the window. We define the buttons in the office with a series of pixel measurements, calculated off of the position of the user, where the images are translated, and the coordinates of the mouse. The buttons themselves are tended to with `handleKeys`, which identifies the external interactions of the game. So it detects if there is motion, if the space bar has been pressed, or if there is a click. The click is passed through to `handleButtons`, which works off of the various modes and ranges we defined. 
```haskell
handleKeys :: Event -> GameState -> GameState
handleKeys (EventKey (SpecialKey KeySpace) Down _ _) gs =
    if swapping gs then gs else gs { swapping = True }
handleKeys (EventMotion (x,y)) gs
    | x > 320.0 && position gs > -160.0 = gs { position = position gs - 10.0}
    | x < -320.0 && position gs < 160.0 = gs { position = position gs + 10.0}
handleKeys (EventKey (MouseButton LeftButton) Down _ (x,y)) gs = handleButtons gs (x,y)
handleKeys (EventKey (MouseButton LeftButton) Up _ _) gs = gs { lightLeft = False, lightRight = False}
handleKeys _ gs = gs
```
For example, if the Left Mouse button is pressed while in the office, it will send a signal to `handleButtons gs (x,y)`. It will then use this to check if the click is in a certain range, such as `centre1-16.0 < x && x < centre1+22.0 && y < 72.0 + (-110.0) && y > 18.0 + (-110.0)` controlling the left door button, the result updating the GameState. The individual ranges were calculated with pixel measurements and trial and error, leading to some imperfect buttons. 

This leads us onto the camera mode, which renders on the current location specified by `currentCam`. It defaults to the `ShowStage` and what you were looking at last will persist for when you reopen it. It has the room view, then the static overlay, the camera UI effects and then the interactive map, which works the same as the office buttons. The static works like the death screen static, with each frame controling the `staticIndex` over 8 images, with transparent tiles. Meanwhile the camera UI is not animated except for the red dot which flashes every few seconds controlled by another frame counter. As mentioned before, each camera has a set of possible options defined by animatronic conditions, the only complexity is the `ShowStage` which has to consider all cases of if different animatronics are there. 

## Animations
There are a few key animations throughout the game that we have implemented, each using the general strategy of progressing frame counters, and using that to dictate which image index we use. This has the benefit of simplicity, as we only need to reference an image start index, and then the frame counter accounts for the progression. Firstly is the camera transition, which uses the `animState` counting up from 0 to 10, or down from 10 to 0, using `swapping` as a gate. When the user presses space, `swapping` is set to true, and `animationUpdate` increments `animState` toward 10, which brings up the camera each frame - which works as it uses a transparent background so it is layered on top if it. When the target is reached, the mode is flipped. We use a count up and count down for this as pulling a camera down is the inverse of pulling it up.
```haskell
cameraUp :: GameState -> GameState
cameraUp gs = if animState gs == 10
    then gs {mode = Cameras, swapping = False}
    else gs {animState = animState gs + 1}

cameraDown :: GameState -> GameState
cameraDown gs = if animState gs == 0
    then gs {mode = Office, swapping = False}
    else gs {animState = animState gs - 1}
```
Next we have the doors, which use a similar method, counting up from 0 to 12 to close the door, and counting down from 12 to 0 for closign the door. We do this for both left and right doors with `leftAnimState` and `rightAnimState`. The doors are similarly just images with transparent backgrounds, which we place in a specific location to cover the door frame. I will note that I still find it weird that it costs energy for the door to be *closed*.
```haskell
rightDoor :: State GameState ()
rightDoor = do
    gs@GameState{..} <- get
    if | rightAnimState == 12 && doorRight -> put gs {rightDoorMove = False}
       | rightAnimState /= 12 && doorRight -> put gs {rightAnimState = rightAnimState + 1}
       | rightAnimState == 0 && not doorRight -> put gs {rightDoorMove = False}
       | rightAnimState /= 0 && not doorRight -> put gs {rightAnimState = rightAnimState -1}
       | otherwise -> put gs
```
The final key animations in the game are the jumpscares. The most iconic part of FNAF. When you are in the `Dying` mode, it renders the jumpscare of the animatronic that is in the room. Since there can only be on animatronic in the room at a time, it will find the aniamtronic and render using the `deathIndex`, which is incremented in the dying update. There are four jumpscares implemented, either Bonnie, Chica or Freddy when they enter the office manually; or an additional Freddy jumpscare for the end of the blackout segment. For Bonnie and Chica, we also animate them pulling the camera down. For Freddy we handle this with `freddyCam`, which pulls down the camera if it is up, else it does nothing.
```haskell
renderJumpScare :: [Picture] -> State GameState Picture
renderJumpScare imgs = do
    gs@GameState{..} <- get
    let cameraDown = if animState < 0 then [] else [imgs !! (3 + animState)]
        freddyCam = if mode == Cameras then [] else cameraDown
    if | battery < 0.0 -> return (pictures ([imgs !! (188 + deathIndex)]))
       | name inOffice == Bonnie -> return (pictures ([imgs !! (110 + deathIndex `mod` (jumpFrames (inOffice)))] ++ cameraDown))
       | name inOffice == Chica -> return (pictures ([imgs !! (126 + deathIndex `mod` (jumpFrames (inOffice)))] ++ cameraDown))
       | name inOffice == Freddy -> return (pictures ([imgs !! (143 + deathIndex `mod` (jumpFrames (inOffice)))] ++ freddyCam))
```

## Animatronic AI
The animatronic AI was the most interesting element to implement as I got a chance to delve into how the original game does it. Whereas the other elements are intuitive to a player, the AI of the animatronics is left purposefully vague, and supposed to seem rather random. While we have the graphs and paths from the routes they can take, how do they decide when and where to move? This information was gathered from this [incredible video](https://youtu.be/ujg0Y5IziiY) by Tech Rules. For each animatronic, each frame the `frameTracker` icrements. When it exceeds `movementTake`, a **move** is attempted. `movementCheck` rolls `doRandomThing 0 20`, and if the roll is below `aggressionLevel`, the move proceeds, otherwise the frame tracker resets. Each animatronic has a `movementTake` and `aggressionLevel`. For example, Bonnie will try to move after every 198 frames, roughly every 4.95 seconds. Then it will roll a number between 0 and 20. Lets say it rolls an 11 and its `aggressionLevel` is 10, then Bonnie will not move; but if it rolls an 8, then it will. This is the aggression AI used for the custom night in the original FNAF. 

![Custom night](./onaf/md/images/custom.webp)
*Original FNAF custom night menu.*

The exception to this is Freddy, who has an additional caveat that he cannot move if the player is currently looking at Freddy. This is done by checking if the current camera is equal to Freddy's room, and that the mode is `Cameras`. This is what makes Freddy dangerous, as Freddy will always move toward you, unless you look at him and stop his advances.

When the animatronics take their move, they call upon their graph and generate a list of all reachable rooms. Freddy will always go to the next room, whilst Bonnie and Chica will choose at random which room they go to from the list, producing the non-deterministic wandering. If the animatronic makes it to the office, they will check if the door is open and that no other animatronic is inside. If it fails either condition, it will go back to the `DiningArea`; other than Freddy - who will wait outside your door, waiting for you to slip up. 

## Death and Dying Pipeline
Finally, we have what happens when you die. We call the `toDie` function every frame, which checks if `inOffice` has a value other than `None`. The moment an animatronic is in the room, and the conditions are met, the player is dying. This means that a jumpscare begins, incrementing the `deathIndex` and decrements `animState` simultaneously (so the camera is pulled down). When the `deathIndex` equals the `frameMultiplier * jumpFrames`, then the mode switches to `Dead`, effectively controlling how many times the animation will loop. It loops for Bonnie and Chica 3 times, while for Freddy it only does it once. When you are in the `Dead` mode, the static will play on screen, and you are left to close the game. The other death route is through a blackout. This is when you run out of battery, checked by `powerCheck`; which defined the count down frames as a random value between 200 and 700. This means you have roughly between 5 and 17 seconds before Freddy jumps you. The `blackoutUpdate` begins, and the `countDown` decrements until it reaches 0. Freddy then jumpscares you with a different animation. This is always a tense moment, as you hold on to any hope of surviving the night, bracing for an incoming jumpscare. 

# Evaluation
This coursework was an incredible experience, and I am very grateful for the opportunity it provided me. Not only was this a great way to create something meaningful, but also to work on something that I am passionate about and interested in! It taught me large amounts about functional programming, monads and Haskell+Gloss; as well as teaching me a lot about game development! Working in this constricted environment, where I had to build the game state from the bottom up was restrictive and helpful! While it was stressful completing this in the tight timeframe presented, it was a thrilling experience and one that I would not change for the world - especially considering that I achieved 100% ! 

There is still many areas to improve and add to the game however. In particular, adding in the additional animatronics Foxy and Golden Freddy would let the game feel a lot more complete. Using the animatronic data types already in place, this would not be too difficult, but some extra animations would need to be added to account for Foxy running down the corridor toward you. Another improvement would be audio, which is a crucial part of a horror experience. We experimented with adding it, but it became difficult and confusing, so we left it out. If we were to add it, we would likely want to use either hmp3 or minstrel. We also definitely would want to add in some menus to allow for users to customise the animatronics, progress through each night, etc. We focused on the gameplay, as the menus are just more buttons and modes that add little to the final mark, but would be worthwhile for a final product. There are some small improvements we would want to make as well, such as making the static a bit more varied and random, using `dt` instead of frame counters to prevent frame drift, and adding screen static when the animatronics move so that it looks less awkward and less like they are teleporting between rooms. 

Despite the many improvements we could make, overall I am very happy with the final product, and the score that I achieved. Also the fact I got to write about *Freddy Fazbear* in a coursework is just awesome. 