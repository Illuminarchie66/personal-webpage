# Robot Maze
Robot Maze was the first coursework for my computer science degree at Warwick University. It was for an introduction to programming, and was very helpful in reteaching me the basics I learnt at A-Level, while also enlightening me to languages outside of Python. Despite the many times this question was asked, the coursework was completed in Java. The goal of the project was to design a robot agent that would navigate through a 2D maze to find the exit. This was done with an existing Java framework for the maze and environment, and we only designed the robot. There were several exercises in the guide, which I for the life of me cannot find, so for each exercise I will give a rough approximation of what was tasked of us! From there, I will detail my solution and approach used. Sadly this cannot be run independently, as this code is only the robot; the rest being exclusively held by the university. 

![Circumcentre diagram](./robot-maze/md/images/robotmaze.jpg)
*The Robot Maze in Action!*

# Design
We were given an existing environment in Java that works like so, it will generate a random maze of size $64 \times 64$. A single tile will be a path or a wall. This maze will have a start and an end, and a route is guaranteed to exist between them. The end will be referred to as end, exit or target interchangably. For each exercise the maze may have different aspects that define them, such as containing loops, and where relevant this will be mentioned. The way that the robot operates is that each timestep it will try to move forward in the direction that it is facing, its `heading`. We get to control the heading. We also are able to use `look()`, which has the robot look in a direction relative to its heading. So for example, if our robot is facing East, and we have it look East, it will look South. `.look()` identifies what the tile is in that direction.  

# Exercises
## Exercise 1
The exercise was to create a simple robot that outputs its current direction it is heading in and its current situation. It will move forward until moving forward will make it collide with a wall. When the robot encounters an obstacle, it should turn and move forward in another direction chosen at random. 

Firstly, we added a static map of the robot's numerical direction to a string: `{forward, right, backward, left}`. We likewise did the same for the situation, where the number of walls corresponds to the situation `{0: "crossroad", 1: "junction", 2: "corridor", 3: "deadend"}`. For example, if there are 3 walls, that means there is only one possible direction to go and thus it is a deadend. The logic then of our robot was incredible simple, where if `.look()` was a wall, then it would look at each direction around itself, and any valid directions it would add them to an arraylist. Then it would generate a random integer between 0 and the size of the list, and make the robot face in that direction. This prevented the robot from randomly selecting an invalid direction and imediately having to reselect again. 

## Exercise 2
The followup exercise was to improve the simple robot so that it has a chance to move at random even when not going into a wall - controlled random wandering. Additionally, we were to fix the imbalanced probability from the previous robot.  

In Ex1, to generate a random integer in the range $[0,n)$ we used: 
```java
randno = (int) Math.round(Math.random()*(n-1));
```
However, to ensure fair probabilities the round function had to be changed to the floor function. The round function has a larger range of values that would be rounded upwards as round down $(0,0.499999...)$ and to round up its between $[0.5, 0.9999...)$ which is a larger range. Hence to solve this the floor function is used, as this has an equal range to round down for each interval of numbers, therefore equal probabilities.
```java
randno = (int) Math.floor(Math.random()*n);
```
We used the same logic for the random direction change, it would generate a random number from 1 to 8, using a random variable of chance, and if it was equal to 0, then the operation to change direction would proceed. This was not a disruptive change as the operation to change direction was already self contained within its own logic, and hence it had no impact on the program other than giving the robot more oppertunities to change direction. Additionally it was designed to work with the other issue of changing direction upon reaching a wall, as the if statement used an OR operator so that either of them could be in effect, or both. 

## Exercise 3
The next exercise was to write a controller that makes the robot move towards the target. 

We gain access to a new function which tells us the robot's current location, and the target location, as $(x,y)$ coordinates on the grid. We use this to get us some new information we can use, with `isTargetNorth()` and `isTargetEast()`, which returns 1 if the target is North/East, 0 if target is on same latitude/longitude, or -1 if South/West.

The design to this problem is heavily focused around the idea of priority. Priority in many ways can be described as a way of ordering some set. After the list of directions is filtered as to remove directions that lead to a wall, my program maps the values of `isTargetXXXX` to priority, which was found by expressing the inputs and outputs as a truthtable. Once priorities can be mapped, the list can be traversed, comparing priority, until the greatest priority is found. As the list is traversed randomly, that means that the condition of randomly choosing is satisfied. This method was chosen as it reduces the number of if statements, and reduces the number of unnecessary comparisons and checks. This uses greedy homing, choosing the direction that best aligns with the target vector. 

Whilst the robot will always home in on the target, it will not always reach it, as if a pathway goes to a deadend, it will get itself trapped in an endless loop of going back and forth between two squares, in its attempts to home in. The robot could be improved by implementing a system that prevents it from getting trapped in cycles, so it will always reach its target.

## Exercise 4
This exercise was to implement a depth-first search maze solving algorithm using junction recording and backtracking.

The key conceptual shift from the previous exercises was the introduction of state and memory. Instead of reacting only to local surroundings, the robot now records information about junctions it encounters. To support this, a `RobotData` class was created, designed to store a list of junction objects. Each junction stores the $(x,y)$ coordinates of the square and the heading the robot was facing when it first entered that junction. This allows the robot to later return to that exact junction and know which direction to reverse when backtracking.

As in previous exercises, the first step of the controller filters out any directions that lead to walls. The behaviour then depends on the robot’s situation, determined by the number of surrounding walls:
* Deadend (3 walls): The robot switches into backtracking mode and reverses direction (`BEHIND`).
* Corridor (2 walls): The robot removes the possibility of going backwards and continues forward along the only available path.
* Junction / Crossroad (0 or 1 walls): The behaviour depends on whether the robot is exploring or backtracking.

Two modes are maintained:
* `explorerMode = 1`: exploring new paths
* `explorerMode = 0`: backtracking

When exploring:
* If the junction is encountered for the first time, it is added to `RobotData`.
* All exits that lead to squares marked `BEENBEFORE` are removed.
* A random unexplored direction is chosen.

When backtracking:
* If all exits from a junction have been explored (i.e., every direction leads to a `BEENBEFORE` square), the robot retrieves the stored heading from `RobotData` and reverses out of the junction.
* If unexplored exits remain, it switches back to exploring mode and continues down a new branch.

This process effectively performs a depth-first search (DFS) of the maze. If we imagine each junction as a node in a tree, with corridors acting as edges, then the robot explores one branch fully before returning to the previous junction and exploring the next branch. Since each junction is only stored once and fully explored before backtracking, every possible path will eventually be traversed.

Assuming the maze contains no loops, this guarantees that the robot will eventually reach the target. The worst-case scenario occurs when the correct path is explored last, meaning the robot traverses nearly every branch before finding the solution. Compared to Ex3’s greedy homing strategy, this controller sacrifices directness for completeness. It may take longer, but it guarantees success by systematically exploring the entire search space rather than relying on heuristic alignment with the target.

## Exercise 5
This exercise was to improve upon the depth-first search by utilising a stack, improving both time and space complexity. 

We achieved this by removing the `RobotData`, and removing the list junction objects to just use a stack of the headings. This is so that we don't need to search the list, as the junction that needs to be accessed will always be the lastest junction in a list. By removing these we improve both time and space as we remove the need for linear search, and we also just reduce the amount we store in general. This has it take the form of much more accurate depth-first search. However, we still face the issue that it cannot solve mazes with loops.

## Exercise 6
This exercise was to improve upon the depth-first search further, by having it account for loopy mazes - mazes with loops. 

There are two changes that needed to be made to allow this to solve loopy mazes. Firstly, it needed to account for the scenario it enters a junction that is fully explored when it is in explorer mode. This is because before it assumed this would never occur, and hence it would fail if it ever entered a junction that was fully explored. So by treating this junction as a deadend, it would reverse, remove that path, and not consider it an option, hence dealing with the loop. The other change was to make the stack add a junction to the stack as long as it is not fully explored, as if this is not done then the robot will enter an infinite loop when it loops on to the same junction as it was at previously. By combining these additions, the robot can now handle loopy mazes, and fortunately it was a relatively small change.

All the changes to be made was done here:
```java
private int exploring(IRobot robot, int beenBefore, ArrayList<Integer> directions){
    if (beenBefore == directions.size()){ // if explored before
        return(deadend()); 
    } else {
        stack.push(robot.getHeading()); // pushes every junction so long as its not explored
        directions = beenBeforeClear(robot, directions);
        return (randomChoose(directions));
    }
}
```

## Grand finale
The final task was to create a robot which solved the maze effeciently, that can use subsequent runs for heightened effeciency - letting us explore before we solve the maze, cutting out unnecessary loops. 

This solution was inspired by Route B, where the first run builds a path that is then reused in subsequent runs. However, instead of storing full junction objects or reconstructing routes each time, I implemented a dynamic path list that records the relative directions taken when leaving a junction. This way when going back through the maze, it just pops the direction, and follows the route. 

The core idea is:
* During the first run, explore using a depth-first search style controller (with backtracking).
* Whenever the robot leaves a junction, record the chosen direction in a path list.
* If a deadend is encountered, remove the most recent direction from the path list, since that branch does not lead to the target.
* By the time the target is reached, the path list represents a valid (and usually quite efficient) route from start to goal.
* On subsequent runs, the robot simply replays this path instead of re-exploring the maze.

There are two special cases that need to be handled carefully. Firstly is the starting square, as if the robot backtracks all the way to the beginning, there would be nothing to pop from the stack or remove from the path list. We solve this by storing the start location globally, and if the robot ever returns to the start, it treats it as a junction regardless of wall count. This way the starting heading is pushed appropriately so backtracking logic remains valid. 

The next problem requires a bit more trickery. Because wall filtering occurs early, the robot may re-enter a junction from a different heading than when it was first visited. So we cannot append directions directly to the path list - as the relative direction depends on the robot's current orientation. Solving this without rewriting everything, we use modular arithmetic to convert between relative and absolute headings; so when we record a direction, we adjust relative to the original entry heading. This avoids a more memory intensive data structure storing both heading and direction pairs for every junction - at the cost of readability.

On prim mazes with no loops, the robot performs well, as the guide with the heuristic (from Ex3) so the first pass is guided well, backtracking removes the deadend branches, and the second run is nearly direct. However loopy mazes are more complex as multiple routes exist, so some branches may never be explored, and the discovered is not guaranteed to be the shortest. To compute the absolute shortest path, the algorithm would need to explore the entire maze and apply a shortest path algorithm such as Dijkstra's, however this increases time and memory usage, and the first run would be much slower. So we try to compromise speed of the first run, while still having decent subsequent runs.

Our final controller integrates:
* Depth-first search with backtracking
* Stack based junction memory
* Dynamic path pruning
* Heuristic target prioritisation

Which results in:
* Able to solve prim and loopy mazes
* Improves efficiency after first attempt
* Balanaces exploration cost with long-term performance  

# Evaluation
Rereading my work here was SOMETHING. This was done very early on in my computer science career, and it really shows. I am quite unfamiliar with general algorithms and data structures, their time complexities and how they can be used, as well as how to simplify and map problems. I especially had difficulty with respect to the heading, and absolute vs relative direction. Looking back, there are certain approaches and algorithms I would want to employ, depending on the goal (as I said I don't have the exercise sheet), but there definitely are many ways to improve what I've done. That being said... its all very fresh and exciting. In some ways, my programming and techniques have become very streamlined to adapting an existing algorithm, but this contains the boundless freedom that I first found when I started coding. I'll definitely have to think about that. 
