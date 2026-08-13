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
While I planned on using HTML Canvas, I still had no experience with how it actually worked. I did have the option to use other frameworks such as [Phaser](https://phaser.io/), [PixiJS](https://pixijs.com/) or [Three.js](https://threejs.org/), but each was ruled out quite quickly. Phaser was too much GenAI slop, PixiJS' examples didn't blow me away and Three.js was more for 3D project compared to the 2D one I wanted to produce. Hence vanilla Canvas was the tool. The basics are to create a canvas with:
```html
<canvas id="myCanvas" width="480" height="320"></canvas>
```
and then have a script get the canvas and the context (`ctx`).
```js
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
```
This gives us something we can draw on each frame. The best way to achieve this is with a function, which has the context draw what we specify. The most basic is drawing some rectangle:
```js
ctx.beginPath();
ctx.rect(x, y, width, height);
ctx.fillStyle = "#0095DD";
ctx.fill();
ctx.closePath();
```
We can see that `.rect` takes the top left x and y coordinate, and draws a box that many pixels wide. Its worth noting that its in the top left and right corner, as it means that when managing hitboxes later on, they must be correctly aligned with each coordinate centre. We can use this to create a draw function that in its most basic form is this:
```js
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBox(x, y, width, height);
    requestAnimationFrame(draw);
}
```
Where we call an animation frame, with `requestAnimationFrame()` which will run the function on the next screen paint of the device, allowing us to keep the graphics and animation synchronized. We also clear the canvas, as otherwise we would leave a trail of everything we painted on the canvas beforehand. Its also worth noting that the rendering order is very simple in the sequential order we draw - so if we draw a bow, then draw a circle in the same place, it will replace the pixels of the box with the circle. This is important for how we render elements later. 

We further refine this so that we can gain access to the change in time (delta time, or `dt`) to improve our calculations later on, as this makes the game consistent regardless of framerate. 
```js
gameLoop(timestamp: number): void {
    if (this.lastTimestamp === null)
        this.lastTimestamp = timestamp;

    const dt = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    this.update(dt);
    this.draw();
    requestAnimationFrame(this.gameLoop.bind(this));
}

start(): void {
    requestAnimationFrame(this.gameLoop.bind(this));
}
```

### Breakout Tutorial
The way we first learned the basics of game design with this was with this great tutorial for the game [Breakout](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript). The game Breakout is well known, albeit not necessarily by that name. You basically have a paddle and have a to hit a ball upwards so that it breaks the blocks at the top of the screen, without letting it fall past you. 

![Screenshot of HTML Canvas Breakout](./md/images/mdn-breakout-gameplay.png)
*Screenshot of HTML Canvas Breakout.*

The way this tutorial was structured was effective, describing how we can make each individual component, have it render correctly, have it have internal logic with movements, respond to user input, and have a UI. It was done entirely within a single HTML file and script block, where we draw and update functionality. The most simple is the ball, where we have a `drawBall()` function and a `moveBall()` function. For moveBall we update the x and y with dx and dy, where if the ball collides with a wall, block, or paddle, the dx/dy will change accordingly.
```js
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function moveBall() {
    x += dx;
    y += dy;

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        color = getRandomColor();
        dx *= 1.01
        dy *= 1.01
    }

    if (y + dy < ballRadius) {
        dy = -dy;
        color = getRandomColor();
        dx *= 1.01
        dy *= 1.01
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX - 2 && x < paddleX + paddleWidth + 2) {
            dy = -dy;
        } else {
            lives--;
            lose();
        }
    }

}
```
We see that the draw function only cares about where the ball is, and draws it accordingly. Meanwhile the move function checks if the x value exceeds the vertical canvas barriers, and if the y value exceeds the horizontal canvas barriers. If it does, then some operation takes effect, such as here reflecting the direction, changing color, and increasing the total speed. We do something similar for all the components of the game, including the paddle, the bricks, the collisions, and the UI. The each of these functions are called inside of our draw function. We draw the score and the lives, then draw and move the ball, draw and move the paddle, draw the bricks, compute collisions, check if we have won, and repeat. This very clearly makes the distinction between the world and the visuals - we want to keep them as separate as we can.
```js
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawLives();
    drawBall();
    moveBall();
    drawPaddle();
    movePaddle();
    drawBricks();
    collisionDetection();
    win();
    requestAnimationFrame(draw);
}
```

This tutorial also helped with some basic controls, with event listeners. The basic method this uses is monitoring the key downs and key ups. If a key is pressed, it will check if the key is a right key or a left key, and set the boolean that it is being pressed to true. Likewise if its let go of, it will flip it. This is a simple mechanism, but was useful as a basis to implement further controls.
```js
let rightPressed = false;
let leftPressed = false;
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}
```

### OOP Refactor
There is a notable problem with the tutorial, and that is how there is no architecture or structure. Being all contained in a single script file meant it was very confusing and easy to get lost in. Likewise, there were no classes, which seemed like a missed opportunity, as all these global variables were getting long and confusing names, which instead could be localised entirely within objects much more effectively. So, we decided that we would go and refactor this project into something more OOP-like before we started on our own. 

The first big refactor was the ball, paddles and blocks. The ball is first defined with an initial constructor, which lets us set the initial conditions of its speed, its color, its initial location, and even its size. We make sure to pass in the canvas in so we can know about the limits of the game and where the walls are.
```ts
interface BallOptions {
    canvas: HTMLCanvasElement;
    paddle: Paddle;
    radius?: number;
    color?: string;
}

export default class Ball {
    private canvas: HTMLCanvasElement;
    private paddle: Paddle;

    radius: number;
    color: string;

    x: number;
    y: number;

    dx: number;
    dy: number;

    constructor({
        canvas,
        paddle,
        radius = 10,
        color = "#0095DD"
    }: BallOptions) {

        this.canvas = canvas;
        this.paddle = paddle;

        this.radius = radius;
        this.color = color;

        this.x = canvas.width / 2;
        this.y = canvas.height - 30;

        this.dx = 2;
        this.dy = -2;
    }
...
}
```

With this constructor, we can make as many balls as we like, and they will all be tracked and managed with their own internal objects. We do this with the `update()` function, which performs the same computations as `moveBall()`, but now it is far more generic to work with the more dynamic setup. We also have `bounce()` which specifies wat should be done on impact, so it is far easier to setup additional effects like a color change. 
```ts
update(): void {

    this.x += this.dx;
    this.y += this.dy;

    if (
        this.x + this.dx > this.canvas.width - this.radius ||
        this.x + this.dx < this.radius
    ) {
        this.dx = -this.dx;
        this.bounce();
    }

    if (this.y + this.dy < this.radius) {
        this.dy = -this.dy;
        this.bounce();
    }
    else if (this.y + this.dy > this.canvas.height - this.radius) {

        if (
            this.paddle.contains(
                this.x + this.dx - this.radius,
                this.y + this.dy
            )
        ) {
            this.dy = -this.dy;
            this.bounce();
        }
    }
}
```
On the other hand we have the `draw()` function, which is very similar to how we drew in the `drawBall()` function, just now designed to use the internal elements of the object. Note that we pass in the Canvas context into the drawing function, as we don't need to make it a property of the Ball. Instead we basically are just telling the ball where to paint in the moment. 
```ts
draw(ctx: CanvasRenderingContext2D): void {

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.closePath();
}
```

The `Paddle` is very similar, utilising a meaningful constructor, an update function and a draw function. This is the standard of an entity, it must be constructed, it must be updated and it must be drawn. We also make use of an input manager here. This is done so the paddle knows the details of the user's key presses. The InputManager class is just an abstraction around the previously implemented listeners, keeping it isolated if anything else requires inputs.

```ts
interface PaddleOptions {
    canvas: HTMLCanvasElement;
    inputs: InputManager;
    x: number;
    speed?: number;
    width?: number;
    height?: number;
    color?: string;
}

export default class Paddle {
    private canvas: HTMLCanvasElement;
    private inputs: InputManager;

    speed: number;
    width: number;
    height: number;
    color: string;
    x: number;
    y: number;

    constructor({
        canvas, 
        inputs,
        x, 
        speed=7, 
        width=75, 
        height=10, 
        color="#0095DD"
    }: PaddleOptions) {
        this.canvas = canvas;
        this.inputs = inputs;

        this.speed = speed
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = canvas.height - this.height;
    }

    update(): void {
        if (this.inputs.rightPressed && this.x < this.canvas.width - this.width) {
            this.x += this.speed;
        } else if (this.inputs.leftPressed && this.x > 0) {
            this.x -= this.speed;
        }
    }

    contains(x: number, y: number): boolean {
        return x >= this.x && x <= this.x + this.width;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}
```

Next we designed the `Brick` and the `BrickManager`. The bricks are very simple entities, just having details like their size and color specified, as well as their status (if they are alive or not) and a function to test if an xy coordinate is inside of the brick. Meanwhile the brick manager just acts as a smart way to hold all of the bricks. It specifies the pattern, with number of rows and columns, and iterates over them to draw and check collisions. The manager constructor creates the bricks it manages. This idea of ownership is important and powerful, allowing us to keep elements isolated - only objects that need to know about another object has anything to do with it. This division of responsibility is crucial to the overall design. 

```ts
interface BrickManagerOptions {
    gameState: any;
    ball: any;
    rows?: number;
    columns?: number;
    brickWidth?: number;
    brickHeight?: number;
    brickPadding?: number;
    brickOffsetTop?: number;
    brickOffsetLeft?: number;
}

export default class BrickManager {
    private gameState: any;
    rows: number;
    columns: number;
    private brickWidth: number;
    private brickHeight: number;
    private brickPadding: number;
    private brickOffsetTop: number;
    private brickOffsetLeft: number;

    bricks: Brick[][];

    constructor({
        gameState, 
        rows = 3, 
        columns = 5, 
        brickWidth = 75, 
        brickHeight = 20, 
        brickPadding = 10, 
        brickOffsetTop = 30, 
        brickOffsetLeft = 30
    }: BrickManagerOptions) {
        this.gameState = gameState;

        this.rows = rows;
        this.columns = columns;
        this.brickWidth = brickWidth;
        this.brickHeight = brickHeight;
        this.brickPadding = brickPadding;
        this.brickOffsetTop = brickOffsetTop;
        this.brickOffsetLeft = brickOffsetLeft;

        this.bricks = [];
        for (let c = 0; c < this.columns; c++) {
            console.log("Creating column " + this.rows);
            this.bricks[c] = [];
            for (let r = 0; r < this.rows; r++) {
                console.log("Creating brick at column " + c + ", row " + r);
                this.bricks[c][r] = new Brick({
                    x: brickOffsetLeft + c * (brickWidth + brickPadding),
                    y: brickOffsetTop + r * (brickHeight + brickPadding),
                    width: brickWidth,
                    height: brickHeight,
                    color: "#030303"
                });
            }
        }
        
    }

    checkCollision(ball: Ball): boolean {
        for (let c = 0; c < this.columns; c++) {
            for (let r = 0; r < this.rows; r++) {
                if (this.bricks[c][r].status === 1) {
                    if (this.bricks[c][r].contains(ball.x, ball.y)) {
                        this.bricks[c][r].status = 0;
                        return true;
                    }
                }
            }
        }

        return false;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        for (let c = 0; c < this.columns; c++) {
            for (let r = 0; r < this.rows; r++) {
                this.bricks[c][r].draw(ctx);
            }
        }
    }
}
```

The last major refactor was the game itself, which held the context, game state, input manager, paddle, ball, brick manager and the HUD. We build it to have a `reset()` function which is used in constructor for multiple games, where we can specify the parameters of the game itself! 

```ts
constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    
    this.reset();
    
}

reset(): void {
    this.gameState = new GameState({lives: 3});
    
    this.inputs = new InputManager();
    this.paddle = new Paddle({
        canvas: this.canvas,
        inputs: this.inputs,
        x: (this.canvas.width - 75) / 2
    });
    this.ball = new Ball({
        canvas: this.canvas,
        paddle: this.paddle,
    });
    this.brickManager = new BrickManager({
        gameState: this.gameState,
        ball: this.ball,
        rows: 2,
        columns: 5,
    });
    this.hud = new HUD({
        canvas: this.canvas,
        gameState: this.gameState,
    });
}
```

Now we can design an update function and draw function for the game. The update checks for the collisions, the ball being out of bounds, the gme state, losing lives, the score, etc! Meanwhile drawing clears the canvas, and then calls the objects draw functions respectively. We can see how everything is quite clean in its design, being isolated and working on its own, the ball and paddle updating independent of the rest of the game. This is better demonstrated within the draw function, which is a simple series of calls elsewhere. 

```ts
update(): void {
    this.ball.update();
    this.paddle.update();
    const hit = this.brickManager.checkCollision(this.ball);
    if (hit) {
        this.ball.dy = -this.ball.dy;
        this.ball.bounce();
        this.gameState.score++;
    }

    if (this.ball.outOfBounds()) {
        this.gameState.lives -= 1;
        this.ball = new Ball({
            canvas: this.canvas,
            paddle: this.paddle
        });
    }

    if (this.gameState.lives <= 0) {
        alert("GAME OVER");
        document.location.reload();
        this.reset();
    }

    if (this.gameState.score === this.brickManager.rows * this.brickManager.columns) {
        alert("YOU WIN, CONGRATULATIONS!");
        document.location.reload();
        this.reset();
    }
}

draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ball.draw(this.ctx);
    this.paddle.draw(this.ctx);
    this.brickManager.draw(this.ctx);
    this.hud.draw(this.ctx);
}
```

With the game defined, we gave it a `gameLoop()` and `start()` function, and now it can be started with a simple `game.start()`. This is the groundwork for how we will build our project. This gives enough meaningful object isolation and abstraction that ensures we update and draw separately to each other, while cleaning dividing ownership and control. 

## Node Setup
*86 hours remain.*
You may have noticed that in our refactor, our JavaScript looked different. That is because we switched up to use TypeScript with Node. This was something I was unfamiliar with going into this project, but after starting the refactor I was getting annoyed at how I didn't know what types things were, and the IDE couldn't help. Plus when an error was caused, it was difficult to trace through the JavaScript gobbledeegook. So I also took the time to learn TypeScript, and adapt it accordingly. It was not too difficult, as it was similar to using the `Typing` package in Python, which I recently had been growing more fond of. This did require having to learn Node though, which I knew a bit of, but the details were fuzzy. 

```bash
npm init -y
npm install --save-dev typescript
npx tsc --init

{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "sourceMap": true
  }
}

npx tsc
```
that generates the dist js file to use. This was effective and gave us a way to start using TypeScript. But we found that Vite was much better for development. This was a package which updated the build whenever we updated and saved a file, which made testing far easier, as the changes would automatically be visible when the dev command `npm run dev` was run. Then when it was time to release, we simply had to do `npm run build` and it would make a folder called `dist/` with index.html and a minified script, which can be used. Note, for itch.io, we needed to update the vite distribution index file to use `src="./assets/index-....js"` as otherwise it cannot identify the file.
```bash
npm install --save-dev vite
update package.json:

{
  "name": "breakout-game",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "typescript": "^...",
    "vite": "^..."
  }
}

npm run dev
```
This let us develop with TypeScript, which overall was a good inclusion. While it did slow us down sometimes with the boilerplate elements, it helped in letting us ensure proper architecture and consistent design. Interfaces were sometimes a bit finnicky to work with, when passing in parameters and dictionaries, but overtime we got used to it, and appreciated the restrictions and regulations it provided. 

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
As we were developing the different row block patterns we laid out, we started to encounter a problem with those that weren't confined to the rows. Up until this point, we defined the spikes as cells inside of the rows, where each cell is occupied by a single hitbox. When the row goes off screen, then the row and its attached entity is unloaded. This presented us a problem though, as for a rotating spikeball, it could exist when the row went off of the screen, so it would cause an awkward immersion break where you could see the spikeball despawn in real time. The problem is that we defined entities entirely by their associated rows, neglecting the fact that we want entities detached from the rows they spawn on. There was also the issue of collision, as right now we computed the collisions from the cell, rather than the hitbox - which wasn't sustainable for moving objects. Furthermore, this highlighted another issue that because we utilised the cell system, it meant that there was no way to place elements at positions that weren't perfectly on one of the ten cells. This isn't great as for example the boost panels that we have in mind would be very limited to how they could behave. Therefore for that functionality, we decided we needed to refactor what had been done to utilise entities rather than cells. An entity operated independently to a cell, meaning that it would exist in isolation and not rely on the row. It also could possess its own hitbox, with specialised collision designed.  

### Hitbox system
I keep referring to them as hitboxes, but in reality they are colliders, as we wanted circular hiboxes too. We needed a generic way to handle hitboxes to be able to check collisions, so first we created an abstract class. The core functionality is to check overlap with another collider. We also want to be able to debug colliders are in the correct position, so we added a draw functionality. 
```ts
export default abstract class Collider {
    active: boolean = true;

    abstract overlaps(other: Collider|null): boolean;

    abstract draw(ctx: CanvasRenderingContext2D): void;
}
```
This was used as the base for our `BoxCollider`, `CircleCollider` and `CompoundCollider`. It was also at this point we introduced a `Transform` interface, which basically gave a method to handle x,y cooridnates that would persist between objects. The box collider was given an owner, which is the position that the box follows (so for example a moving player). Then we also have an offset, if we want the box to always be slightly off to where it would be made by the owner - really just to deal with the drawing jank. Finally we have a width and height, as you would expect from a box. We draw the hitbox itself around the x,y subtracting half its width and height respectively, since it draws from the top left. The hitbox x,y is the centre of the box itself. Note that overlaps has little logic and instead calls Collisions, this is a static class dedicated to how different colliders should check if they collide. 
```ts
export default class BoxCollider extends Collider {
    
    constructor(
        public owner: Transform,
        public offsetX: number,
        public offsetY: number,
        public width: number,
        public height: number
    ) {
        super();
        this.owner = owner;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = width;
        this.height = height;
    }

    get x() {
        return this.owner.x + this.offsetX;
    }

    get y() {
        return this.owner.y + this.offsetY;
    }

    overlaps(other: Collider|null): boolean {
        if(other === null)
            return false;

        if (this.active === false || other.active === false)
            return false;

        return Collision.test(this, other);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "lime";

        ctx.strokeRect(
            this.x - this.width/2,
            this.y - this.height/2,
            this.width,
            this.height
        );
    }
}
```
The circle collider is incredibly similar, the only difference using a radius rather than a width and height; and the draw function using an arc rather than a box. However the type difference is important, as it allows us to evaluate collisions in different instances. 
```ts
draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "lime";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
}
```
The last collider we made (but did not end up using) was a compound collider, which simply maintains a list of colliders about an owner. This way if we wanted a hitbox to consist of two boxes and a circle, we could create that with this. The collider system was simple, especially since we did not implement any form of rotation, but for this simple game it did the job. 

The collisions were a little more interesting though, with different methods for how circles and boxes should test overlap. the `Collision.test()` takes two colliders, and finds out what they are, before selecting the appropriate method to evaluate if they overlap. If it is two circle colliders, we check if the difference between their centres is less than the total radius.
$$(x_a - x_b)^2 + (y_a - y_b)^2 \leq (r_a + r_b)^2$$
If it is two box colliders, we check if the absolute difference in their centres is less than the total width and height respectively. It takes a bit of thinking to see it, but becomes clear. 
```ts
export default class Collision {
    static test(a: Collider, b: Collider): boolean {
        if (a instanceof CircleCollider && b instanceof CircleCollider)
            return this.circleCircle(a, b);

        if (a instanceof BoxCollider && b instanceof BoxCollider)
            return this.boxBox(a, b);

        if (a instanceof CircleCollider && b instanceof BoxCollider)
            return this.circleBox(a, b);

        if (a instanceof BoxCollider && b instanceof CircleCollider)
            return this.circleBox(b, a);

        return false;
    }

    static circleCircle(a: CircleCollider, b: CircleCollider): boolean {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const radius = a.radius + b.radius;
        return dx*dx + dy*dy <= radius*radius;
    }

    static boxBox(a: BoxCollider, b: BoxCollider): boolean {
        return (Math.abs(a.x - b.x) * 2 < a.width + b.width) && (Math.abs(a.y - b.y) * 2 < a.height + b.height);
    }

    static circleBox(circle: CircleCollider, box: BoxCollider): boolean {
        const circleDistanceX = Math.abs(circle.x - box.x);
        const circleDistanceY = Math.abs(circle.y - box.y);

        if (circleDistanceX > (box.width / 2 + circle.radius)) { return false; }
        if (circleDistanceY > (box.height / 2 + circle.radius)) { return false; }

        if (circleDistanceX <= (box.width / 2)) { return true; }
        if (circleDistanceY <= (box.height / 2)) { return true; }

        const cornerDistance_sq = (circleDistanceX - box.width / 2) ** 2 + (circleDistanceY - box.height / 2) ** 2;
        return (cornerDistance_sq <= (circle.radius ** 2));
    }
}
```

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
