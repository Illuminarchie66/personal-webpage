# Introduction
Harold's Happy House is a very small first-person horror game created in Three.js as a part of my third-year Computer Graphics module. This project required multiple environments, custom 3D modelling in Blender, lighting, and interactive gameplay. While originally developed as a coursework, it became an opportunity to explore real-time rendering, physics simulation and modular game architecture. This was quite a personal and emotional experience for me as well, as it was a chance to explore my dream of game development. Additionally, I spent far too long on it, ending up going over the deadline with some extreme sleep deprivation. So this coursework holds a lot of memories both good and bad! It was a chance to explore Three.js, Cannon-es, Blender, JavaScript and HTML/CSS.

![Screenshot of the Game](./md/images/1.png)
*Screenshot of the opening area of the game.*

# Objectives
For this assignment, sadly it was not just "go and create a game". Throughout the term we were learning the graphics pipeline, how rendering worked, primitives and projections, cameras and lighting, textures and maps. This project was to be a small demonstration of some of what we had learned, and so we had to ensure that our coursework contained:
- Two unique scenes with distinct environments
- A custom Blender model
- Interactive gameplay
- Unique lighting 
- And multiple camera angles (or camera controls)

For me, rather than creating a simple demonstration, I wanted to recreate the atmosphere of early 2010s indie horror games that inspired me so much when I was younger. Particular inspirations are Five Nights at Freddy's and Petscop. I didn't just want to emulate their graphics, I more wanted to recreate their atmosphere. Especially since I knew I had limited time and experience, with an inability to create something high quality and polished, I wanted to create something that was in that uncanny-valley area of incomplete. The feeling that something should be there, and that it is wrong that it isn't.  

![Screenshot of the Newmaker Plane in Petscop](./md/images/petscop.webp)
*Screenshot of the Newmaker Plane in Petscop.*

# Implementation
## Technical Architecture 
The primary tool we were using was [Three.js](https://threejs.org/), which is a Javascript package containing everything needed for graphic implementation through a web browser. We additionally used an extension of Three.js called [cannon-es](https://pmndrs.github.io/cannon-es/) which is a tool to help implement a physics engine. Beyond this, the bulk of our code was designed within our main.js (in future this needed to be split up A LOT more), with additional files to handle core subsidiary functionality.

**main.js**: This file contained initialization of all the core elements that made up the game. This included the renderer, the camera, the mesh and body materials, the scene, the world, the player, the lighting and the animation loop. The majority of it is comprised of making the map, which assembles various components which we can interact with. 

**controls.js**: This file handles the controls of the player, how it interacts with the camera, how the player can interact with the world, and how the physics respond to the controls. 

**loader.js**: This defined the functions to load in the models and their corresponding textures. 

**maker.js**: This handled materials and creating generic objects that could be reused, such as ramps, cylinders, stone walls etc. This was made to be quite generic, so that we could load different objects in the map generation with different position, scale, color, mesh and body. We abstracted out reusable building primitives, so maps become sequences of these reusable cells.

**prism_geom.js** This extended the THREE.ExtrudeGeometry, for a more generic Prism Geometry, which allowed us to create more unique elements such as ramps. 

## Controls
The controls were a large undertaking in this game. I knew from the start I wanted to make it be first-person, so that I would not need to create a render and animations for the playable character. Our original implementation was built by hand, inspired by [simondevyoutube](https://www.youtube.com/watch?v=oqKzxPMLWxo), however this had the issue of being far too loose and imprecise. There was a core problem that when turning it was hard to enforce controlling the camera to stop turning immediately to be responsive enough to the mouse. So we turned our attention to focus upon PointerLock, which is an in-built addon to better respond to the movements of the mouse. PointerLock on its own though was too limiting, with not enough control over the details and attributes of the camera. We explored around online and found an example made by [Schteppe](https://schteppe.github.io/cannon.js/examples/threejs_fps.html), which I quite liked the feel of, so I took the core components to work it into my solution. 

This still makes use of the PointerLock controls, where our Controls class contained a `.isLocked` attribute on PointerLock's return value. The main event used is:
```javascript
onMouseMove = (event) => {
    if (!this.enabled) {
        return
    }

    const { movementX, movementY } = event;

    this.yawObject.rotation.y -= movementX * 0.001;
    this.pitchObject.rotation.x -= movementY * 0.001;

    this.pitchObject.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitchObject.rotation.x));
}
```
The pitch (up/down rotation) is clamped to ±90° to prevent the camera from flipping over, while yaw (left/right rotation) remains unrestricted.

This accounted for the camera, but we still needed the player and camera attached to them to actually be able to move. We approached this with the class keeping boolean values of each relative direction the player is moving in based on what key is down. Then each update delta, we multiply by a velocity factor (basically player speed) and we get both the `x` and `z` directional velocity. We combine this with the pitch and yaw from the camera, and convert that into a quaternion - allowing us to apply directional rotation to velocity. With the input velocity rotated and scaled by the quaternion, we then reference our cannon body, which is the rigid body we use with cannon-es, and add the directional velocity for each. Additionally, we apply a damping factor, which means that the player doesn't drift across the floor like it is ice - it is basically a form of manual friction. 

There is one element left that is missing, and that is jumping. We made this so that when you press the space bar, it will check if you are able to jump (to prevent mid-air jumping), and then if you can, it will set the `y` velocity to the jump speed, and that acts independent to the rest, where cannon's gravity will force the player to decelerate downwards, until the `y` velocity is 0 again. To support jumping, the controller tracked whether the player was grounded before allowing a jump impulse to be applied. This prevented repeated mid-air jumps and made movement feel substantially more natural than a purely velocity-based implementation.

We also copy the position of the cannon body, and set that to be the position of the camera (offset slightly so its like the player has a height), so the camera will remain attached to the cannon body. 

## Physics
As mentioned, the physics engine used was cannon-es, or Cannon.js. It was chosen as it was more lightweight than Ammo.js and the physics required were not too complex. The physics were build with the principle that there is a division in the physics world and the graphical world - the physics world acted as the source of truth, while the graphical world was a visual representation synchronised from it each frame. For static objects of no mass, this meant very little, but for moving objects and the player, on animate the mesh was synced to the physics body in position and rotation. The player provided a further challenge as external inputs affected their world.

To understand slightly better, imagine a box which is defined as a series of primitives. By defining the body of that box, it knows how it can collide and interact with other boxes. We could stack two boxes atop of each other, and they know how to behave due to the physics engine. Now suppose we wanted to make one box look stoney, and the other box look fuzzy. We would assign them materials with textures that map onto their faces. This means that when the boxes move, the graphics are attached to them, and are affected by their interactions. The rendering pipeline only cares about the materials of the graphics, and displays what the current scene shows. The materials only move due to the physics engine, and thus that split is in place. 

## Animation Loop
The game ran on a traditional `requestAnimationFrame` loop. Each frame:
- Compute frame delta time.
- Step the cannon-es physics world.
- Apply player input to the physics body.
- Synchronise mesh transforms with physics bodies.
- Update lights and gameplay state.
- Render the scene.

This ordering ensured that rendering always reflected the latest physics state and avoided visible desynchronisation between collision bodies and meshes.

## Assets
The assets used for this project come from a large variety of places. As the setting of the game was to take place in a soft-play place, I needed leather, plastic and rope/net textures to complete the look. Below is a list of all references to where I got each of the textures I used. 
- [Metal Floor](https://3dtextures.me/2020/10/15/sci-fi-floor-002/)
- [Wood Floor](https://polyhaven.com/a/wood_floor_worn)
- [Rope Net](https://www.cgtrader.com/3d-models/textures/miscellaneous/seamless-net-textures-7ada34c5-da48-44f9-a6ab-b3e199fbfb0d)
- [Stone Wall](https://3dtextures.me/2021/12/25/wall-stone-022/)
- [Scuffed Plastic](https://www.texturecan.com/details/380/)
- [Scratched Plastic](https://free-3dtextureshd.com/download/scratched-plastic-3d-pbr-texture-generator-substance-sbsar-free-download-high-resolution-4k/)
- [Leather](https://3dtextures.me/2020/04/16/leather-008/)
- [Damaged Leather](https://free-3dtextureshd.com/download/damaged-brown-leather-3d-texture-fabric-cuir-seamless-bpr-material-high-resolution-free-download-hd-4k/#google_vignette)
We developed a loader which retrieved the albedo, metallic, normal, roughness, ao, bump, opacity and reflection maps for each of the textures, assigning them to the texture, leaving them undefined if they weren't present. This was whenever we needed a texture, we could simply await a specific texture that we loaded in with all the maps in its current directory. The method works well enough, however the class division could be much clearer, as for some reason it is also lumped in with the model loading. This eventually evolved into loading in materials, where for each texture we defined how it was tiled when loaded in (applied consistently with each map), as well as controlling if it was a standard material of a Phong material (which used a different lighting system). This material then could be given to models to texture them.

There was an issue I came across with tiling, in which I needed to load textures multiple times over due to not being able to change their tiling once materialized, which heavily impacted how many textures looked.

![Images of some of the textures used](./md/images/2.png)
*Images of some of the textures used.*

## Lighting
The lighting present throughout the game was varied and interesting! Due to the levels being indoors, I did not get much chance for using hemisphere lighting, (or a skybox unfortunately), which led to my focus on spotlight and point lights. In the first scene, the point lights atop give a sense of security in being able to see quite clearly. They are supposed to feel artificial and industrial, akin to a warehouse. We achieved this by experimenting with the Three.js spotlight parameters of penumbra and decay to get it feeling truly off-putting. When the room goes dark, the spotlight from the torch then allows for players to see just enough to be able to move back to the start, but not enough to feel as comfortable. This especially works well in the second level in the dark foggy corridors and passageways, only illuminating as far as you can step. The second stage has a red spotlight over Harold too, for the added flair and intimidation factor. The flashlight was interesting to make, as we had to place the spotlight inside of the flashlight model, and appropriately angle it relative to where the flashlight was pointing. 

![Screenshot of some ingame lighting.](./md/images/3.png)
*Screenshot of some in-game lighting of the soft-play place on the wall.*

## Performance Considerations
Running entirely in the browser introduced several performance constraints. The largest costs came from dynamic lighting, shadow casting, texture memory usage, and the number of active physics bodies. A few practical optimisations were applied:
- Reusing geometry and materials where possible.
- Restricting shadow casting to important objects.
- Using cannon-es instead of a heavier physics solution.
- ilding environments from reusable primitives rather than importing large monolithic meshes.

Despite this, the project still experienced frame drops on lower-end devices, particularly in scenes containing multiple dynamic lights and dense geometry. In retrospect, more aggressive culling, instanced rendering, and texture atlasing would have been worthwhile improvements.

## Modelling
Besides the basic model primitives, we had to have some of our own models present within the game. We used one model of the flashlight, which we downloaded from [TurboSquid](https://www.turbosquid.com/3d-models/3d-flashlight-lights-1664357), which was a nicely detailed flashlight we had the player pickup. But as per the description of the task, we also needed to create a model for the game using a tool like Blender. Creating the torch would have been easier, but I really wanted to create something that emulated the creepy energy of 2010 style mascot horror games. I took inspiration from the Wacky Warehouse mascot, as seen below.

![Wacky Warehouse Mascot](./md/images/wacky.jpg)
*Wacky Warehouse Mascot (They are terrifying!).*

Due to scope, I limited myself to only making the head of the mascot over the body. I first started with a sphere, which I sculpted using the grab tool and inflate tool to make it a very angular shape with large cheeks.Proceeding this, I began to use the inverse draw tool, and smooth tool to chip away to give two large eye holes and a smiling mouth. The model then was given ears and eyes, in the form of augmented spheres. As for the hair, I stretched out several spheres into long cylinder-like tubes and pulled them back like it was slipped back hair. This wasn’t exactly to the reference, but simplified to avoid the difficulties of that mascot’s crazy hair. Once the face shape was sculpted, I unwrapped the UVs and began to texture map. I applied the flesh tone to the whole shape and added the key colors of the hair, the mouth, and the cheeks. After all of this, I added a cute nose as I forgot to in the images.

![Blender Process](./md/images/blender1.png)
*Creating the initial sphere.*

![Blender Process](./md/images/blender2.png)
*Shaping the head and adding two bulbous cheeks.*

![Blender Process](./md/images/blender3.png)
*Carving out the eyes and mouth.*

![Blender Process](./md/images/blender4.png)
*Adding in the eyeballs and hair.*

![Blender Process](./md/images/blender5.png)
*Texture mapping the unwrapped UVs.*

For Harold within the game, we just gave them a floating round capsule body, which was designed to emulate characters like the Miis from the 2010 era of Wii games. This was effective enough, however prior to the coursework I had relatively little experience with Blender. Creating even a relatively simple stylised character highlighted how much there was to learn, particularly around sculpting, UV unwrapping, and texturing. Although the final model is relatively modest in complexity, it gave me a solid introduction to the complete asset creation pipeline.  

## Scene Making
For each of the scenes, the way that we made them was a series of component parts that could be easily loaded in, placed, scaled and rotated like complete objects. The design we used was with functions, however in retrospect using a much more object oriented design would have been much more effective - but at the time classes within JavaScript wasn't inherently obvious to me. 
```javascript
makeTexturedBox(position, scale, color, materialMesh, materialBody) {
    const boxMaterial = materialMesh;
    const boxMesh = new THREE.Mesh(
        new THREE.BoxGeometry(scale.x, scale.y, scale.z),
        boxMaterial,
    );
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    boxMesh.material.color.set(color);
    boxMesh.position.copy(position);

    const boxBody = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(scale.x/2,scale.y/2,scale.z/2)),
        mass: 0,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        material: materialBody,
    });
    
    return [boxMesh, boxBody];
}
```
The best example of this with our maker is creating a textured box. We give it the position, scale, color, material mesh and material body. We then create a box mesh which is all of the graphical side with the textures; and then a box body, which is the cannon-es physics. We return these as a pair.
```javascript
let block = this.maker.makeTexturedBox(
    new THREE.Vector3(20,1.25,-5),
    new THREE.Vector3(5,2,5),
    new THREE.Color(0x3d91ff),
    this.plasticTex1,
    this.wallMaterial
); blocks.push(block);
```
This function can then be called inside of our main.js as many times as we want, where for each we can specify all details that we need! This let us create more dynamic blocks and rows of alternating colors without loads of repeated code. Once created, we push the pair to a list of blocks, which we then add to the world with the following:
```javascript
for (let i=0; i<blocks.length; i++) {
    this.scene.add(blocks[i][0]);
    this.world.addBody(blocks[i][1]);
}
```
We developed these make functions for the foam/plastic/rope walls, ramps, cylinders, tubes, balls etc. Some of them required a bit more complexity, such as the tube requiring needing internal and external collision; or the rope wall requiring invisible material for the transparent areas. 

![Screenshot of part of the soft-play place](./md/images/4.png)
*Screenshot of part of the soft-play place*

## Level Design
The game is quite unevenly split, with much more focus being put into the first level, less into the second due to the detached nature. The first level is set in the Happy House, and was planned to be poised with extra details: tables, images, extra toys to pick up and more. The soft-play bit aimed to have a linear path for the player to follow to the end and back, with not enough time to add more sections to it. Building the soft-play was the most difficult part due to all of the textures and requirements for the geometry to come together. However it was nice building the plastic walls with the small hexagonal bolts using prism geometry. The whole aim of the first level is to put you on edge while Harold stalks you from afar. When you reach the top of the soft-play place, the lights go out and you pick up a torch. Retracing your steps you may notice Harold eyeing you up with their creepy blank stare.

![Harold is creepy](./md/images/5.png)
*Harold is creepy.*

Level 2 is much more the foundations of a level, currently with no achievable end goal, as Harold hunts you through the halls to jump scare you. Each of these take the builder approach to making the level, by creating many functions to easily build the objects we need. This section was made mostly to complete the objective of the coursework, and did not have enough time to be fleshed out. 

![The red halls](./md/images/6.png)
*The red halls.*

![Harold](./md/images/7.png)
*Harold.*

# Evaluation
This project was a huge mixed bag of successes and failures. The biggest successes was the modular design, the lighting, the atmosphere and the reusable nature of the architecture. The abstraction of building the scene to core functions was very helpful and let me develop much easier than I would have otherwise. However, they could have been improved much more using proper classes, and OOP techniques. Furthermore, there was a lot more optimisation that I could go and perform, as there are several frame drops here and there to be ironed out, as well as some glitches that needed addressing. There is a key limitation as well that it struggles to run on certain devices, not very well optimised with how it is rendered. The main limitation though is that it is not finished. The setup of the controls and the flashlight pickup implementation are all there, as well as the key physics, but the game itself is just a walking simulator, with little to no interaction or gameplay. For a graphics experiment this is okay, however I do wish I could go back and rebuild it from the ground up properly.

The most valuable lessons from this project were:
- Separate simulation from rendering early.
- Build reusable primitives instead of hard-coding levels.
- Prototype controls until they feel right; technical correctness alone is not enough.
- Lighting has as much impact on atmosphere as geometry.
- Performance constraints appear much earlier in real-time applications than expected.
- Asset creation is a hell of a discipline in its own right; even simple models require understanding sculpting, UVs, and texturing.

Creating this game was a huge amount of fun, and it was great to make something feel creepy and off putting, while also working in lore ideas, and cool designs with lighting. It is far from perfect, and suffers from being more a proof of concept than a game, but it still holds value from its energy alone and the experience I got from making it.