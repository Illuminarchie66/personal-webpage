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
After completing the tutorial and refactoring it into better contained files, I was healthy and went to bed! This is the last time I am healthy in this challenge. I woke up and got ready to start developing, taking what I had learnt to create what I had envisioned. The first goal was to create a player that moved, and rows that would go 'up', so that it looked like the player was falling. For the time being we made the player a red square, and the row spikes to just be gray boxes. We went with a very simple 1:2 ratio of width to height, and had the rows consist of 10 empty blocks. This would give enough diversity in the style of obstacles we could create. Intricate patterns and details could come later: first we needed to just make a row. 

## Row Generator
*71 hours remain.*
Firstly was the row. The row consisted of an array of cells, where each cell could either contain a spike block, or an empty cell. The idea here is that we would populate a row with cells, which we could use various algorithms to generate different patterns. Then each cell was given a draw and update function, where we would draw the gray squares, and update the cells to move upwards. We quickly found though that the moving upwards was unintuitive, as suddenly the player's speed was interlinked with the speed the blocks moved. The idea was that we did not want to generate a massive array of all the blocks ever, however we instead maintained a row manager that contained a maximum of 50 something rows, and when the rows was off screen, we would pop that row and generate a new one. This was then expanded into a generic row class, which we inherited from to produce an `EmptyRow` and a `RandomRow`. For now our cells were just 0 or 1 - not a spike or a spike.

```ts
export default class Row {
    static CELL_SIZE = 50;
    static WIDTH = 10;

    y: number;
    cells: boolean[];

    constructor(y: number) {
        this.y = y;

        this.cells = Array.from({length: Row.WIDTH}, 0);
    }

    draw(ctx: CanvasRenderingContext2D): void {

        for (let i = 0; i < Row.WIDTH; i++) {

            if (!this.cells[i])
                continue;

            ctx.fillStyle = "#333333";

            ctx.fillRect(
                i * Row.CELL_SIZE,
                this.y,
                Row.CELL_SIZE,
                Row.CELL_SIZE
            );
        }
    }
}

export class EmptyRow extends Row {
    constructor() {
        super();
    }
}

export class RandomRow extends Row {
    constructor() {
        super();
        this.cells = Array.from(
            { length: Row.WIDTH },
            () => Math.random() > 0.5
        );
    }
}
```

From here we can make the `RowManager`, which similar to the `BrickManager` from breakout, handles all of the rows and how they move and operate. This importantly is the owner of the rows, and thus the owner of the obstacles. We see that in the update, they are made in a fixed position, they don't move up. Instead its entirely based on the camera and player moving down. When the top of the rows is below the current camera height, it pops the row and generates a new random row. This creates a sequence of rows in random patterns, where we simply look to how the row draws itself to handle the draw function.

```ts
export default class RowManager {

    rows: Row[] = [];

    rowHeight = 50;
    maxRows = 25;


    constructor() {
        for (let i = 0; i < this.maxRows; i++) {
            this.rows.push(
                new RandomRow(i * this.rowHeight)
            );
        }
    }


    update(cameraY: number): void {
        const first = this.rows[0];

        if (first.y + this.rowHeight < cameraY) {
            this.rows.shift();
            const last = this.rows[this.rows.length - 1];
            this.rows.push(new RandomRow(last.y + this.rowHeight));
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        for (const row of this.rows) {
            row.draw(ctx);
        }
    }
}
```
Importantly this makes use of the camera, which we originally designed to just 'fall' perpetually, as that simulated the effect of the blocks rushing past the screen - but without the player moving down, the player would quickly fall off the screen - thus we changed the camera to follow a target - the player. The camera would have a target y value it would try to match to, which each frame it would get closer to, by lerping between its current position and the target position. This meant that if the target moved at a constant speed, the camera would move at a constant speed too. But if the target accelerated, going faster so the difference between the y and target was greater, then the smoothing would cause it to have to adjust.
```ts
export default class Camera {

    y = 0;
    smoothing = 5;

    reset() {
        this.y = 0;
    }

    update(dt: number, targetY: number): void {

        const desiredY = targetY - 120;

        this.y += (desiredY - this.y) * this.smoothing * dt;
    }
}
```
But how does the context actually move with the camera? Well the key is that we translate by the y value. By doing this, we have the context shift to where the camera is facing each draw frame. All of this together lets the world be created.
```ts
this.ctx.translate(0, -this.camera.y);
```

## Simple Player 
*68 hours remain.*
While we had a basic camera and row system set up, we also needed a player. To start with, our player done made to be very simple. We used a near identical input manager we developed in breakout to handle the keypresses. We then had it so that each frame dx was forced to be 0. Then it would give horizontal speed based on the input manager. We force dx to be 0 so that the player felt like they have more control over their movements - instead of potentially slippery feeling controls with deceleration. It also was simpler to develop. Meanwhile we also added up and down controls, to make descent faster or slower - but otherwise the player perpetually moved down. While this wasn't reinventing the wheel with physics, it did the job of giving nice feeling movement without being too awkward or janky. We also just made a red box. Woo! Red box.
```ts
export default class Player { 
    private inputs: InputManager; 
    x: number; 
    y: number; 
    dx: number = 0; 
    dy: number = 200; 
    horizontalSpeed: number = 250; 
    hitboxWidth: number = 25; 
    hitboxHeight: number = 25; 
    
    constructor({ inputs, x }: PlayerOptions) { 
        this.inputs = inputs; 
        this.x = x; 
        this.y = 100 
    } 
    
    update(dt: number): void { 
        if (this.inputs.isHeld(Action.MoveRight) && this.inputs.isHeld(Action.MoveLeft)) { 
            this.dx = 0; 
        } else if (this.inputs.isHeld(Action.MoveRight)) { 
            this.dx = this.horizontalSpeed; 
        } else if (this.inputs.isHeld(Action.MoveLeft)) { 
            this.dx = -this.horizontalSpeed; 
        } 
        
        if (this.inputs.isHeld(Action.MoveDown)) { 
            this.dy = 400; 
        } else if (this.inputs.isHeld(Action.MoveUp)) { 
            this.dy = 100; 
        } else { 
            this.dy = 200; 
        } 
        
        this.x += this.dx * dt; 
        this.y += this.dy * dt; 
        this.dx = 0; 
        
    } 
    
    draw(ctx: CanvasRenderingContext2D): void { 
        ctx.beginPath(); 
        ctx.rect(this.x, this.y, this.hitboxHeight, this.hitboxWidth); 
        ctx.fillStyle = "#FF0000"; 
        ctx.fill(); 
        ctx.closePath(); 
    } 
}
```

## Designing Patterns
*66 hours remain.*
While we made rows, we didn't have any interaction, or any way to control what the patterns made really were. The random row generation had the issue that it was every single row independently. We needed to create groups of rows that worked together to form a pattern. The way to do this was with a `RowBlock`. Instead of the manager generating new rows, it would own a generator. The generator would produce new rows, where it keeps track of the current block and assigns a new block when a block is finished. What this means is that we can produce patterns dynamically, able to later produce different groups of patterns based on the player's progress. 

Firstly is the row manager, which handles the actual rendering and hitboxes of the rows. What I mean is, the manager handles the rows that are loaded, the process of loading them in and adding them, and the process of handling the group of rows that exist. 
```ts
export default class RowManager {

    rows: Row[] = [];
    gameDetails: GameDetails;
    generator: RowGenerator;

    maxRows = 25;
    loadDistance = World.GAMEPLAY_HEIGHT + 10*Row.ROW_HEIGHT;
    unloadDistance = 10 * Row.ROW_HEIGHT;

    constructor(gameDetails: GameDetails) {
        this.gameDetails = gameDetails;
        this.generator = new RowGenerator(gameDetails);

        let lastY = 0;
        for (let i = 0; i < this.maxRows; i++) {
            const row = this.generator.nextRow();
            row.setY(lastY + Row.ROW_HEIGHT);
            this.rows.push(row);
            lastY = row.y;
        }
    }

    update(cameraY: number): { added: Entity[], removed: Entity[] } {

        let added: Entity[] = [];
        let removed: Entity[] = [];

        while (
            this.rows.length > 0 &&
            this.rows[0].y + Row.ROW_HEIGHT < cameraY - this.unloadDistance
        ) {
            const removedRow = this.rows.shift();

            if (removedRow) {
                removed.push(...removedRow.entities);
            }
        }

        while (
            this.rows.length > 0 &&
            this.rows[this.rows.length - 1].y < cameraY + this.loadDistance
        ) {
            const row = this.generator.nextRow();
            row.setY(this.rows[this.rows.length - 1].y + Row.ROW_HEIGHT);
            this.rows.push(row);
            added.push(...row.entities);
        }

        return { added, removed };
    }


    draw(ctx: CanvasRenderingContext2D): void {
        for (const row of this.rows) {
            row.draw(ctx);
        }
    }
}
```
Meanwhile the row generator handles what it means to create patterns of row blocks. We can see how the generator only really is used with `.nextRow()`, as that is all we care to get from it. We maintain what the current block is, and generate with our method of choice specified in `generateBlock()`. Effectively we use this to generate the patterns that we desire. At this point we had it track if its the first block, which if so its just 25 empty rows (as specified with the `EmptyRowBlock`), and then it goes into alternating between empty row blocks as spacing, and then random row blocks which has 5 rows of random blocks, and a space of 3 rows between each random row. This was our testing bench, whenever we made a new pattern that we wanted to try out, we would replace `RandomRowBlock({})` with whatever row block pattern we made, and whatever parameters we would give it. This gave us an element of control over different procedural patterns, which we could further to make more generic. 

```ts
class RowGenerator {
    private currentBlock: RowBlock | null = null;
    first: boolean = true;
    alternate: boolean = true;
    gameDetails: GameDetails;
    rowBlockFactory: RowBlockFactory = new RowBlockFactory();


    constructor(gameDetails: GameDetails) {
        this.gameDetails = gameDetails;
    }

    nextRow(): Row {
        while(true) {

            if (this.currentBlock === null) {
                this.currentBlock = this.generateBlock();
                if (this.currentBlock instanceof EmptyRowBlock) {
                    this.gameDetails.numBlocks = (this.gameDetails.numBlocks ?? 0) + 1;
                }
            }

            const row = this.currentBlock.nextRow();

            if (row) {
                return row;
            }

            this.currentBlock = null;
        }
    }

    private generateBlock(): RowBlock {

        if (this.first) {
            this.first = false;
            return new EmptyRowBlock({ numRows: 25 });
        }

        this.alternate = !this.alternate;
        if (this.alternate) {
            return new EmptyRowBlock({ numRowsMin: 5, numRowsMax: 7 });
        } else {
            return new RandomRowBlock({ numObstacleRows: 5, spacing: 3 })
        }
    }
}

```

Finally we can touch on the row blocks themselves. A basic `RowBlock` is an abstract class which simply maintains a list of rows and the current index, and has a function to return the next row. We also have the interface of row block options. This is developed later on, but effectively is the generic parameters that apply to all patterns. This form then means all we need to do is create the list of rows in the constructor of the child classes of the `RowBlock`. So long as we define what a series of rows look like in advance, our generator can handle the row block and will produce them. 
```ts
export interface RowBlockOptions {
    numObstacleRows?: number;
    spacing?: number;
    leadIn?: number;
    leadOut?: number;
}

export default abstract class RowBlock {
    protected rows: Row[]
    private index: number = 0;

    constructor(rows: Row[]) {
        this.rows = rows;
    }

    get length(): number {
        return this.rows.length;
    }

    nextRow(): Row | null {
        if (this.index >= this.rows.length) {
            return null;
        }
        return this.rows[this.index++];
    }
}
```

What came next was a brainstorm session, writing on paper all quick possible ideas for generic designs and obstacles we can use. This was the much more fun level design element, taking on some procedural generation techniques and ideas. 
1. **Empty**: Generate a gap of empty rows.
2. **Random**: Generate a series of rows with random blocks based on a chance, with a guarantee at least one will always be open. 
3. **Random Gap**: Generate a series of rows where there is a gap with a certain size. We specify the width and index. 
4. **Random Gap Chain**: Generate a series of random gaps where every few rows it shifts in different directions, creating cool looking paths.
5. **Inverse Random Gap**: An inverse of the random gap where the 'gap' is spikes and the rest is empty. 
6. **Tunnel**: A simple block with a single gap that goes straight down. 
7. **Diagonal**: A tunnel block that goes at an angle. Imagine a block of filled spots, then draw a line from one start point to the end point, and carve out where that line intersects. 
8. **Zigzag**: This is an extension of the diagonal, but chaining multiple of them together to get a zigzagging tunnel.
9. **Ins and Outs**: This is chaining together a series of gaps and inverse gaps, where you have to go in and out as a pattern.
10. **Bitty Chains**: A series of repeating single blocks with gaps between them, with tight navigation required.  
11. **Horizontal Shift**: A row that has a gap that shifts left and right.
12. **Switch Block**: A series of red and blue blocks that switch every few seconds to a beat, a bit like in Super Mario Galaxy. 
13. **Boost Pads**: A ring that grants you a boost of speed.
14. **Breakable Blocks**: Blocks that break when you go through them at speed.
15. **Mini-Shroom**: A mushroom that makes you smaller for a time. This would make it easier to dodge elements and open up opportunity for secrets.
16. **Mega-Shroom**: A mushroom that makes you larger for a time. This would make harder to dodge elements, but open up opportunity to break through blocks and move faster.
17. **Snake Blocks**: Blocks which follow on a pattern like moving in a square or something, similar to Mario snake blocks.
18. **Electric Balls**: Balls which move left to right to attack you. 
19. **Swinging Balls**: Balls which swing in a circle or swing in a pendulum arc to hit you.
20. **Wall Grapplers**: Plant like enemies which lurch out of walls and target the players coordinates. 
21. **Falling Stones**: Stones that fall from above which you will get limited warning about that you much dodge.
22. **Activate Button**: A button which deactivates a series of blocks, so to progress you must hit the button as you fall. 

This was a great slew of possible patterns, designs and ideas to add a lot of variety to the game! I knew I likely wouldn't get them all done for the jam, but the ideas still persist for future updates. These ideas were implemented over the course of the jam, rather haphazardly, thus we will talk about all row block implementations in a single section of day 3.

![Photo of some sketch notes made](./md/images/sketch1.png)
*Photo of some sketch notes made.*

![Photo of some sketch notes made](./md/images/sketch2.png)
*Photo of some sketch notes made.*

# Day 3
*48 hours remain.*

I say day 3, but day 2 never ended. Thats right an all nighter baby! Takes me back to uni! By this point, we had a way to create rows and different patterns; we had a player which could move left and right, and a very simple collision system which logged if we overlapped with any spikes. It was nearly a fully fledged game - but not quite. We needed a proper start, a proper end, and a proper game loop. 

## Death Animation and Game Loop
*47 hours remain.*
Since all we had right now was a red square, we didn't need to do too much, just a simple animation to get us started, and one to have it end. The idea I decided on was shrinking the box into nothing for death, then having the camera pan back up to the start, where when the user presses space, the box will grow from nothing into its base size and then start to fall. This was achieved with game states, where we defined an enum and a state that persisted between elements in the Game class.
```ts
export enum GameState {
    Ready,
    Starting,
    Playing,
    Dying,
    Resetting
}
```
That way we could go and say to the game, we are in this state therefore do this. This let us chain events, where when certain timers were completed, it would set the game state to something else and cause the transition. 

### Spawning and Dying
The Player Object we were building was given a timer and duration for spawning and dying. It was a very simple design to have the spawn timer increment by dt, then we define progress as a fraction of the duration taken, and use that progress as the scale we use. When the progress is greater than or equal to 1, we say that is has spawned. By setting the spawn scale, when we draw the box at that scale in that frame. We defined it separately so that later we could design a better death animation if we desired.

```ts
updateSpawn(dt:number) {
    this.spawnTimer += dt;
    const progress = this.spawnTimer / this.spawnDuration;
    this.spawnScale = Math.min(1, progress);
    if(this.spawnScale >= 1) {
        this.spawned = true;
    }
}

updateDeath(dt:number) {
    this.deathTimer += dt;
    const progress = this.deathTimer / this.deathDuration;
    this.deathScale = Math.max(0, 1 - progress);
}
```
When we draw we have to ensure we use negative half width and height for the x and y values, as otherwise the growth scaling is not centered. The same applies for the shrinking. Also worth noting that in the drawing of the spawn and death we use `ctx.save()` and `ctx.restore()` - this is to isolate transformations like translate and scale to not affect the whole canvas; where we basically save the canvas state and then once we have shrunk or grown the player, we restore the rest of the canvas with the transformed player atop. 

### Camera reset
When dying, the player has fallen down a significant distance, and so we need to pull the camera back up to the start. The most basic method is that we defined a 'resetting' game state, and we had it pull back up to the top over a duration. This was later improved to use a smooth lerp, where each frame the camera progresses back up by a cubed percentage, which makes it so that it has a slow rise, a fast ascent, and then slow stop, which visually looked a lot better.
```ts
updateResetting(dt: number): void {
    this.resetTimer += dt;

    const t = Math.min(1, this.resetTimer / this.resetDuration);
    this.camera.y = this.resetStartY * (1 - t*t*t);

    if (t >= 1) {
        this.reset();
        this.gameDetails.state = GameState.Ready;
    }
}
```

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

The collisions were a little more interesting though, with different methods for how circles and boxes should test overlap. the `Collision.test()` takes two colliders: $a$ and $b$, and finds out what they are, before selecting the appropriate method to evaluate if they overlap.  If it is two circle colliders, we check if the difference between their centres is less than the total radius.
$$(x_a - x_b)^2 + (y_a - y_b)^2 \leq (r_a + r_b)^2$$
If it is two box colliders, we check if the absolute difference in their centres is less than the total width and height respectively. It takes a bit of thinking to see it, but becomes clearer when you think that its saying the horizontal distance is less than the total width, and vertical distance is less than the total height.
$$2|x_a - x_b| < w_a + w_b \land 2|y_a - y_b| < h_a + h_b$$
Finally we have a box and circle collider, where we got a lot of help from this [stackoverflow post](https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection). We first find the absolute distance between the two centres both horizontally and vertically. We then find the corner distance, as the sum of the square differences between half width/height and the horizontal/vertical distances. Then we use them to check a few core conditions:
- If the horizontal distance is greater than the circle radius and half the width, it isn't overlapping. 
- If the vertical distance is greater than the circle radius and half the height, it isn't overlapping. 
- If the horizontal distance is less than half the box width, it must be overlapping. 
- If the vertical distance is less than half the box height, it must be overlapping. 
- If the corner distance is less than the circle radius, it must be overlapping. 
- Else it isn't overlapping.
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
It is worth noting that these collision methods are quite primitive; if the box was to undergo any form of rotation it likely would not work as we rely on the orthogonality of the box being parallel to the axes, but that is something for the future. We also haven't implemented side based collision, for example we could want the vertical sides of spike blocks to be fine, but the tops to be deadly. This would require further work to have the collider return what side it collided with to accomplish.

### Spikes
Now we can take our previous spikes that built up the previous patterns and collision, and convert them into entities for consistency. We take an x,y coord, plus the width and height, all defined by row cells. Then we use this to create a box collider. Now the entity itself, doesn't need to know much, only what it should do when colliding with a player - in this instance to kill them. Likewise we also tell it how to draw itself. This way we simply iterate over all entities for collisions and for drawing. 
```ts
export default class Spike extends Entity {
    collider: Collider;
    width: number;
    height: number;
    sprite?: Sprite;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.collider = new BoxCollider(this, this.width/2, this.height/2, this.width, this.height);
    }

    override getCollider() {
        return this.collider;
    }

    override onPlayerCollision(player: Player) {
        player.kill();
    }

    override draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#333333";

        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}
```


### Balls
Spikeballs are very similar, however we instead also specify movement functionality. This is where the entity knows how it should operate and update each frame. The basic `SpikeBall` class is near identical to the `Spike` class, only with a a circle collider different drawing.
```ts
export class SpikeBall extends Entity {
    collider: Collider;
    radius: number;

    constructor(x: number, y: number, radius: number) {
        super(x, y);
        this.radius = radius;
        this.collider = new CircleCollider(this, 0, 0, this.radius);
    }

    override getCollider() {
        return this.collider;
    }

    override onPlayerCollision(player: Player) {
        player.kill();
    }

    override draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#333333";

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}
```
However we can extend it to move horizontally and about a pivot! If you remember the abstract entity class has an update function, which is now used here to tell these entities how they should behave. So the horizontally moving spikeball has their x value increment by dt speed in a specific direction, which will reverse upon reaching the edge. Meanwhile the pivot updates its x and y with the cosine and sine functions respectively, following at a radius where the increment of the angle determines direction and speed. For the rotating spikeball, we also got to draw an additional pivot point (where it rotates around) and the radius from that point, which shows the versatility of just drawing simple lines!

```ts
export class HorizontalMoveSpikeBall extends SpikeBall {
    speed: number;
    direction: number = 1;
    leftEnd: number;
    rightEnd: number;

    constructor(
        x: number, y: number, radius: number, speed: number, 
        direction: number = 1, leftEnd: number = 0, rightEnd: number = World.GAMEPLAY_WIDTH
    ) {
        super(x, y, radius);
        this.speed = speed;
        this.direction = direction;
        this.leftEnd = leftEnd;
        this.rightEnd = rightEnd;
    }

    override update(dt: number) {
        if (this.x >= this.rightEnd) {
            this.direction = -1;
        }

        if (this.x <= this.leftEnd) {
            this.direction = 1;
        }

        this.x += this.speed * this.direction * dt;
    }
}

export class PivotSpikeBall extends SpikeBall {
    speed: number;
    pivotRadius: number;
    direction: number = 1;
    angle: number = 0;
    centerX: number;
    centerY: number;

    constructor(x: number, y: number, radius: number, speed: number, pivotRadius: number, direction: number = 1, angle: number = 0) {
        super(x, y, radius);
        this.centerX = x;
        this.centerY = y;
        this.speed = speed;
        this.pivotRadius = pivotRadius;
        this.angle = angle;
        this.direction = direction;
    }

    override update(dt: number) {
        this.angle += this.direction * this.speed * dt;
        this.x = this.pivotRadius * Math.cos(this.angle) + this.centerX;
        this.y = this.pivotRadius * Math.sin(this.angle) + this.centerY;
    }

    override draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#333333";

        // ball
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // pivot point
        ctx.fillStyle = "#333333";
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, 5, 0, Math.PI * 2);
        ctx.fill();

        // line from pivot to ball
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.centerX, this.centerY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    }
}
```

### Entity Updates
Now instead of maintaining a series of rows for collisions, we maintained a entity list in the World class.Each row update, we would return the entities that were added to the world, and the entities that now were to be removed from the world. 
```ts
const { added, removed } =  this.rows.update(this.camera.y);
this.entities.push(...added);
if (removed.length > 0) {
    const r = new Set(removed);
    this.entities = this.entities.filter(e => !r.has(e));
}
```
That is then when we would check for collisions, where for each entity, we get their collider and check if it overlaps with the player collider. If it does, we do `entity.onPlayerCollision(this.player)` and that will do the rest from there. Likewise for when we draw, we iterate over the entities and draw the entity in the function, which we draw after the player as it looks slightly more natural when dying I found.

## Spriting
*40 hours remain.*
Up until this point we were using gray squares for spikes, a red box for the player, and a simple white background. Which made it feel so much more like a beta. I needed a break from coding, it was time for some sprites. Most of which, I gathered from other talented artists.

### Player Character Design
The one thing I did work on was Dee! The main playable character. Below you can see my designing process in Krita, getting a small pixel pencil and drawing out something that vaguely resembled a human. At this point I was pretty tired and letting the creative juices flow through me. The character was to have pale white skin, with light cyan hair, a brown top and dark blue shorts. Their design was heavily inspired by Madeline from Celeste, with the whole mental idea of the game wanting to feel like an emotional journey if possible - in particular the Summit from that game. With wind rushing by as you keep on going, keep on pushing through the hardship. I started off with the default falling design, creating two more variations by subtly change the leg and arms positions. The way I had them move was to feel like they were trying to balance in the air of their descent. While only 4 frames, the basic falling animation feels comforting in its simplicity, like calmly letting the wind carry you. Next was the diving art, which was just two frames, with their arms and legs being much closer to the body, making it feel like they are falling with more purpose and determination. Finally was them falling left and right. This was first done by rotating the art of the first, and then adjusting it so it removed the rotation artefacts. It sadly wasn't a simple reflection job, as I needed to keep the rough lighting I had slightly more consistent, where on the right side of their body it was slightly darker to add a bit more depth (I was not touching dynamic lighting). 

![Screenshot of designing Dee's spritesheet in Krita](./md/images/real_ss5.png)
*Screenshot of designing Dee's spritesheet in Krita.*

Once I had the different sprites, I created a Sprite object which had a `HTMLImageElement`, and specified its width, height, etc. Then we loaded in the sprite sheet we created, and isolated each one in a global sprites dictionary. For our purposes, we weren't going to use enough assets to warrant complex dynamic loading. 
```ts
export class Sprite {

    constructor(
        public image: HTMLImageElement,
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) {}

    draw(
        ctx: CanvasRenderingContext2D,
        dx: number,
        dy: number,
        dw: number = this.width,
        dh: number = this.height
    ) {
        ctx.drawImage(
            this.image,
            this.x,
            this.y,
            this.width,
            this.height,
            dx,
            dy,
            dw,
            dh
        );
    }
}
```
We could then use this to draw over the player! 
```ts
sprite.draw(
    ctx,
    player.x - player.spriteWidth / 2,
    player.y - player.spriteHeight / 2,
    player.spriteWidth,
    player.spriteHeight
)
```
We just now need a method to get the current sprite. A very simple method is to use the player's `.moveRight`, `.moveLeft`, etc. as conditions and then use those sprites. The problem is that since they are animated, we need a collection of sprites to form an animation and cycle. We do this with an animation class, which consists of a list of sprites in order of the animation, and then a frame time, which can be thought of as the duration. When the duration is reached, we increment the current frame on a modulus loop, and then use `getSprite()` to access the current frame. For simplicity we update all these animations perpetually - not just when they are active.
```ts
export default class Animation {

    frames: Sprite[];
    frameTime: number;

    currentFrame: number = 0;
    timer: number = 0;

    constructor(frames: Sprite[], frameTime: number) {
        this.frames = frames;
        this.frameTime = frameTime;
    }

    update(dt: number) {
        this.timer += dt;

        if (this.timer >= this.frameTime) {
            this.timer -= this.frameTime;

            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        }
    }

    getSprite(): Sprite {
        return this.frames[this.currentFrame];
    }

    reset() {
        this.currentFrame = 0;
        this.timer = 0;
    }

}
```
Then finally we can get the current sprite by if they are moving down we show the dive animation, if they move left we show the left animation, etc etc. In its current form it definitely has a few issues, with the animation control being quite limited; but now we had a player character that actually existed and it felt far more interactive.

### Spriting the World 
Right now everything is still very white and plain, so we need to add in some kind of background - something to make it look like you are actually falling and your surroundings are rushing past you. For this we added three elements: side walls, background walls, and a starting background. The starting background was the most simple, adjusting the beautiful art of a mountain done by PWL which you can view [here](https://opengameart.org/content/seamless-hd-landscape-in-parts). This is the very first thing to be rendered, keeping in mind the ordering we must uphold. Next was the wall tiles, which we used Lanea Zimmerman's lovely cave tileset as our base, which you can view [here](https://opengameart.org/content/dirt-platformer-tiles). We took some of the side cave elements and drew it straight on to the screen. The problem is that we need to generate new tiles, so we maintained a top and a bottom based on the camera and the buffer. Then we iterate over the rowe indices, and draw the tiles either side between the top and bottom range, where if it is the top of the hole (the beginning) then it uses slightly different tiles so it is not a harsh cut off. 
```ts
update(cameraY:number){
    this.top = Math.floor(cameraY / this.tileSize) - this.buffer;
    this.bottom = this.top + this.numTiles;
}

draw(ctx:CanvasRenderingContext2D){
    
    for(let y=this.top; y<this.bottom; y++){
        
        if (y === this.startDepth) {
            sprites.wallLeftTop.draw(
                ctx,
                500,
                y*this.tileSize,
                this.tileSize+1,
                this.tileSize+1
            );

            sprites.wallRightTop.draw(
                ctx,
                -32,
                y*this.tileSize,
                this.tileSize+1,
                this.tileSize+1
            );
        } else if (y > this.startDepth) {
            sprites.wallLeft.draw(
                ctx,
                500,
                y*this.tileSize,
                this.tileSize+1,
                this.tileSize+1
            );

            sprites.wallRight.draw(
                ctx,
                -32,
                y*this.tileSize,
                this.tileSize+1,
                this.tileSize+1
            );
        }
    }
}
```
Once we got the side walls working, it was a simple adjustment to get the background walls repeating as well. When we tested this we found that we got several line artefacts between the tiles, which we fixed by having the tile size to be one pixel larger to encourage overlap. With this in place, we eventually constructed a complete wall renderer which ordered elements by layers, and rendered them as such. This was done rather messily and haphazardly at this point though - the hackathon hackyness was starting to show. 

## Boost Rings
*38 hours remain.*
In my mind I very clearly wanted the pace to increase, for there to be a real speed and momentum to the game. One way this could be achieved is with Boost Rings, akin to Mario Kart boost panels, granting you a massive speed boost when you go through them. This would add that pace and momentum that was needed.

### Design and Rendering
At this point I was bored at my own inadequacy in pixel art, and switched back to see if I could render a ring using the HTML canvas. This could be done with an ellipse, where you can draw the back of a ring and the front of a ring with two ellipses. We can do each half with an arc specified between $(\pi, 2\pi)$ for the back, and $(0, \pi)$ for the front. 
```ts
drawRingHalf(ctx: CanvasRenderingContext2D, start: number, end: number) {
    ctx.beginPath();
    ctx.ellipse(
        this.x, this.y,
        this.width / 2, this.height / 2,
        0,
        start, end
    );
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.stroke();
}

override draw(ctx: CanvasRenderingContext2D) {
    this.drawRingHalf(ctx, Math.PI, 2*Math.PI);
    this.drawRingHalf(ctx, 0, Math.PI);
}
```
We could make the ring thicker with a greater line width, but it needed something more. Experimenting I found you could create a gradient of colors, which we could use to create a basic rainbow. We used slightly transparent colors as otherwise it was a bit too harsh to look at.
```ts
const gradient = ctx.createLinearGradient(
    this.x - this.width / 2,
    this.y,
    this.x + this.width / 2,
    this.y
);

gradient.addColorStop(0, "#ff004c80");
gradient.addColorStop(0.25, "#ffcc0080");
gradient.addColorStop(0.5, "#00ff8880");
gradient.addColorStop(0.75, "#00aaff80");
gradient.addColorStop(1, "#cc00ff80");

ctx.strokeStyle = gradient;
ctx.lineWidth = 8;
ctx.stroke();
```
We then combined this with the shadow effect you could create with save and restore; as well as some transparent white for a bit of a glow. Finally we also split the draw function into pre-player and post-player, which meant that the player would actually go through the ring as opposed to going over or under it. This created a cool visual effect, however right now we had nothing for it to do.

### Boosting
We added a small hitbox to the ring, and let it respond to the player's collisions, but what we needed was a boost mechanic. With this boost mechanic, the goal was to have the player speed up their descent temporarily, and for the camera to 'lag behind' the player to give the effect they were going faster. This was described as the change in y:
$$y = y + dt \left( \text{target } dy \cdot \text{ speed multiplier } + \text{ boost impulse } \right)$$
Typically, the speed multiplier and boost impulse are fixed at 1 and 0 respectively, but when we provide a boost, we up those values to let them kick in. This works as we cause them both decay. Each frame we decrement them by themselves multiplied by delta time. Now this results in exponential decay. I didn't quite understand why when I first read it, but after going through the mathematics it becomes a bit clearer. For this let $I$ be impulse, $\gamma$ be the decay factor, and $dt$ be delta time
$$
\begin{align*}
    & I^{(n+1)} = I^{(n)} - \left( I^{(n)} \cdot \gamma \right) dt \\\\
    \implies & I^{(n+1)} - I^{(n)} = - \left( I^{(n)} \cdot \gamma \right) dt \\\\
    \implies & dI \approx - I \cdot \gamma dt \\\\
    \implies & \frac{1}{I} dI = -\gamma dt \\\\
    \implies & \int \frac{1}{I} dI = -\int \gamma dt \\\\
    \implies & \ln|I| = -\gamma t + C \\\\
    \implies & I = Ae^{-\gamma t} \\\\
\end{align*}
$$
With our initial conditions, the $A$ just becomes a 1 , and we see that impulse decays to 0 exponentially. We have it set so when it is lower than a threshold of 2, we clamp the impulse down to 0. Since we have them surge forward an unexpected amount, our previous camera work which smooths between the desired y and the players current y means that it will cause the camera to fail to catch up briefly, lerping to them slowly. Now since a player may go through multiple rings, we also need to clamp the impulse and speed, to stop the player perpetually accelerating forever. This just invovles some simple clamps when applying the boost. Finally we add a check for when they are boosting, so we can account for it in animations, which we assume is the case if the boost impulse is greater than 1. 

## Better Animations
*35 hours remain.*
### Boost trail
### Death animation
### Wind particles 

## Row Blocks
*32 hours remain.*

# Day 4
*24 hours remain.*

## Intermission 
*23 hours remain.*

## Gameplay
*12 hours remain.*

### Parameterize the Row Blocks 
![Screenshot of Dee falling between a tight diagonal](./md/images/real_ss3.png)
*Screenshot of Dee falling between a tight diagonal.*

![Screenshot of the Chain Gap Row Block with momentum](./md/images/real_ss4.png)
*Screenshot of the Chain Gap Row Block with momentum.*

### Difficulty Grouping 
### Discrete Difficulty Distribution 

## UI
*6 hours remain.*

![Screenshot of Dee falling with the UI on the right](./md/images/real_ss2.png)
*Screenshot of Dee falling with the UI on the right.*

### Expanding the Canvas
### Depth Bar 
### Player Tracking
### Reset 

## Spriting 2
*2 hours remain.*

[Silkscreen Font](https://www.fontsquirrel.com/fonts/Silkscreen)

### Designing the Tiles
### Attaching Sprites to Entities
### Nightmare on Spritesheet 

## The Final Stretch
*1 hour remains.*

*30 minutes remain.*

*15 minutes remain.*

*5 minutes remain.*

# Evaluation 
## What I Learned 
## What I want to add 
## Final thoughts
