# Introduction 
This was my AI coursework, focused on a scheduling problem. Note that the AI we are refering to is the general practice of artificial intelligence, not neural networks. In this coursework, we were tasked with scheduling the timetable for an up-and-coming comedy club. We were given a list of comedians and their typical themes (e.g., politics, family, satire etc.), and we had to schedule them over the duration of a week. Every week, the comedy club wants to appeal to several demographics, each of which have particular topics that they like to see in comedy. We must assign comedians and demographics to slots in the timetable, based on matching a comedian’s themes to a demographic’s topics. We produce three timetables that (i) considers demographics and comedians, (ii) introduces test shows, and (iii) considers the cost of hiring comedians to perform their sets. This was implemented with Python, and was focused more on the theory than the code.

# Design
This project has `Comedian`, `Demographic`, `Timetable` and `Scheduler` classes. A `Comedian` has a name and a list of themes. A `Demographic` has a reference and a list of topics. These are mostly just data objects that are untouched in our development. A `Timetable` is what we assigne a schedule to. The scheudle is a dictionary of dictionaries, where it is 
```
{
    Week Day : {
        Timeslot : [comedian, demographic, show type]
    }
}
```
Where the week day is in `["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]`, the timeslot is a value in range `[1..5]` or `[1..10]`, reflecting the number of performances each day. Comedian and demographic have to be the respective objects, and the show type is either `"main"` or `"test"`, which will be elaborated upon later. The `Timetable` also tracks the task number (1, 2 or 3) and the cost. We add to the `Timetable` with `addSession()`, and it checks the validity of the schedules for each give, which is what build for our primary implementation. This is where our full logic is used, and we create our schedules for each task. 

# Tasks
For this coursework there were 3 tasks, each building in complexity from each other.

## Task 1
In this task, we had to complete the `createSchedule()` method in scheduler.py, to produce a schedule that adheres to the following requirements:
- Each demographic must be assigned to a slot.
- Each slot requires a comedian to be assigned to it. Assigning a comedian and a demographic to the same slot means that the comedian will perform a show in that slot, and the show will be marketed toward that demographic.
- A comedian can only be marketed toward a demographic (and thus, can only be assigned to the same slot) if their themes contain every topic that demographic is interested in.
- A comedian can perform a maximum of two shows a week.
- A comedian cannot perform more than one show a day

This is a Constraint Satisfaction Problem, a CSP. Our approach for this problem was to use backtracking. The idea is systematic trial and error, where we make a choice, and follow down that route until we hit a deadend. If we hit a deadend, we undo, and explore other routes. This can be imagined as a tree, where each depth is a decision we can make. If that branch fails us, we go back to the state we were at before we made the decision, and explore a different branch. 

![Backtracking tree.](./md/images/backtracking.jpg)

We apply this across our five day week, which has 5 availablable slots. Each slot has a `(comedian, demographic)` pair, meaning tis comedian performs for this demographic. Our core function we use is `backtracking_recursive(ass, D, C, day)`, where `ass` is the assignment, `D` is the remaining demographics to assign, `C` is the list of all comedians, and `day` is the day of the week it is. 

If `D` is empty (its size is 0), then our assignment is complete, as there are no demographics left to assign, and thus we return that assignment. Otherwise, we loop through every unassigned demographic and every comedian and check 3 constraints:
1. The comedian covers the demographic's topics: `all(x in comedian.themes for x in D[i].topics)`
2. The comedian is not already performing this day: `comedianDayCheck(comedian, ass[day]) < 1`
3. The comedian hasn't hit their 2-show limit: `comedianWeekCheck(comedian, ass) < 2`
If all 3 pass, we tentatively place the pair into the slot, and we recurse on to the next day while updating `C` and `D`. If there is a fail, we undo the assignment with `ass[day].pop(len(ass[day])-1)` and try the next comedian or demographic. 

Instead of filling all of Monday, then Tuesday, etc. the function assigns one slot per day per recursive call, wrapping back round to Monday. This means the daily limit and weekly limit are checked together on every step, eliminating more invalid branches early compared to filling day by day. Now it is worth noting that with backtracking, we effectively have an $O(c^d \cdot d!)$ time complexity, which is in the worst case that no pruning occurs at all, and every possible assignment is explored. To improve the general speed of the function, we use ordering heuristics, which allow for the search space to shrink by failing faster. We use `availableComedian`, which orders demographics by scarcity. The demographics with fewer compatible comedians get scheduled first. So if a demographic can only be matched with 1 or 2 comeidans, it is at most risk of being left without options - so we handle it early while more choices exist. We also use `comedianSort`, ordering comedians by flexibility. Comedians who can satisfy fewer demographics are tried first for a given slot, this presevers the most versatile comedians for harder to fill slots later. Effectively, we use the most constrained varaible first, and least constraining value first - which means we will find a valid solution faster as we are less likely to put ourselves into a corner. There is another improvement we could have made, using Arc Consistency, where before and during search, we propagate constraints across all variables to shrink the domains. For example if comedian A is the only one matching demographic X, then we remove comeidan A from all other demographics' candidate lists. 

In our implementation, we did not use the timetable object until the end. This is because you cannot easily remove from it. Since we were told to not change the timetable object, I instead used a temporary assignment, which is a list of lists, and then iterated over it at the end with:
```python
ass = [[],[],[],[],[]]
C = self.comedian_List.copy()
D = sorted(self.demographic_List, key=lambda x: self.avaliableComedian(x,C)) 
finalAss = self.backtracking_recursive(ass, D, C, 0)
for i in range(0, 5):
    for j in range(0, 5):
        timetableObj.addSession(days[i], j+1, finalAss[i][j][0], finalAss[i][j][1], "main")
```
This let us treat days as indicies, which are a lot cleaner to work with in our functions.

## Task 2
For Task 2, we are now to complete the `createTestShowSchedule()` function. As a result of the success of our timetable for events produced in Task 1, the comedy club can afford to put on extra shows. Each day now has 10 shows. Furthermore, there are now *main* shows and *test* shows. Main shows are two hour long comedy sets with the comedian’s best material, while the test shows are one hour long sets, where a comedian may try out new material. Test show tickets are, naturally, cheaper and the audience does not expect every joke to be to their taste. However, people like to attend test shows for a chance to see new material early. The comedy club is cautious about upsetting their customers, and so wants to assign one main show and one test show for each demographic each week. You must now create a scheduler that adheres to the following requirements:
- Each demographic must be assigned one main show and one test show.
- Each show, whether it is a main or test show, requires a comedian to be assigned to it.
- A comedian can only be assigned to the main show for a demographic if the comedian’s themes contain every topic that the demographic likes.
- A comedian can only be assigned to the test show for a demographic if the comedian’s themes contain at least one topic that the demographic likes.
- A comedian can perform in a maximum of 4 hours of shows a week. Main shows are 2 hours long, and test shows are 1 hour long.
- A comedian cannot perform for more than 2 hours per day.
- A comedian can perform only main shows, only test shows, or a combination of the two.
- The shows marketed to a demographic can either involve two different comedians, or the same comedian.

This expands the task complexity much more, where we have to check that comedian hours are appropriate, compared to the naive checking maximum 1 show each day, and 2 shows each week. For this we wrap our checks inside of the `can_perform()` function, which checks if adding a `(comedian, demographic, show type)` tuple is valid:
```python
def can_perform(self, ass, D, C, day):
    temp = 2 if D[1] == "main" else 1                           # how many hours this show costs
    hold = 
        self.comedianDayHourCheck(C, ass[day])+temp <= 2 and    # daily limit
        self.comedianWeekHourCheck(C, ass)+temp <= 4            # weekly limit
    if D[1] == "main":
        return hold and all(x in C.themes for x in D[0].topics) # all topics must match for main
    else:
        return hold and any(x in C.themes for x in D[0].topics) # at least one topic must match for test
```
This lets us use the same backtracking approach as before to solve this CSP. However, even more than before this ups the size of the problem, doubling the number of demographics massively expands the search space, and thus we need better heuristics. We used an updated minimum remaining value (MRV) principle as in Task 1, prioritising the constrained items first. We defined constrainedness  for `availableComedian2` by the number of comedians that could fit a legal demographic, show type slot given our limits. Demographics which have fewer available comedians get scheduled first. `fitsDemographics` counts how many remaining demographics a comedian could server, used to order comedians. We tried several other possible tie breakers including: ordering by hours remaining, prioritising main shows first, prioritising shows whose counterpart was already scheduled. None of them helped, and some actively hindered performance, showing MRV was perhaps sufficient. 

An improvement that could be made in future would be a forward check, which detects immediately after each placement if any remaining demographics have had its domains reduced to 0. We also should have done least constraining value done properly, but our implementation failed to do this successfully. Another improvement is the idea of backjumping, which instead of undoing a previous action, we instead go back to where the issue is caused. This would allow for entire branches to be pruned much faster than before. 

Our backtracking function itself is very similar to Task 1, filling out the timetable horizontally, due to how it enforces both daily and weekly hour constraints simultaneously. As for our implementation, we update it so that our demographic list has options for main and test, and that our timetable object is updated appropriately.  
```python
demoAndTest = []
for demographic in self.demographic_List:
    demoAndTest.append((demographic, "main"))
    demoAndTest.append((demographic, "test"))

ass = [[],[],[],[],[]]
D = sorted(demoAndTest, key=lambda x: self.avaliableComedian2(ass, x, self.comedian_List, 0))
C = sorted(self.comedian_List, key=lambda x: self.fitsDemographics(ass, D, x, 0))
finalAss = self.backtracking_test_recursive(ass, D, C, 0)
for i in range(0,5):
    for j in range(0, 10):
        timetableObj.addSession(days[i], j+1, finalAss[i][j][0], finalAss[i][j][1], finalAss[i][j][2])

```

## Task 3
In this task, we now consider the cost of a schedule. To hire a comedian to perform in a single main show costs £500. If that comedian is hired for a second main show, the second main show will only cost £300. If the two main shows are on consecutive days, then the second main show only costs £100. As such, it is preferable to hire a comedian to perform in two main shows, and schedule them on consecutive days.

To hire a comedian to perform a single test show costs £250. Each subsequent test show a comedian performs costs £50 less than the preceding one, and so the second show will cost £200, the third £150 and the fourth £100. Furthermore, a test show that is performed on the same day as something else the comedian is performing, whether main show or test show, has its cost halved. This means that if a comedian is performing in two test shows on the same day, they would cost £125 and £100 instead of £250 and £200 respectively.

We complete the `createMinCostSchedule()` method, to produce a schedule that minimises the cost, while adhering to the constraints laid out in task 2.

### Initial Solution
This problem has now changed from a CSP to an optimisation problem. We have to produce a valid schedule, while achieveing the minimum possible cost. Now, since we cannot use the timetable object, we have to implement some additional functions that operate on our `[[(C,D,S)]]` structure. We implemented `cost(schedule)` and `validityChecker(schedule)`, which uses the existing approaches found in `Timetable` but reworked to our structure. This lets us find the current cost, and that the current structure is valid. With these, we can begin our approach:
1. Backtracking
2. Get an initial solution
3. Simulated Annealing
4. Optimised solution
We first use the same backtracking from Task 2 to generate a valid schedule quickly. We use the Task 2 heuristics `availableComedian2` and `fitsDemographics`, but the comedian ordering is changed to cost sensitive heuristics. We order by `dayAppear`, which prioritises comedians already performing on that day or the previous day. This directly targets the consecutive day discount of 300 to 100 in cost; and the test show same-day halving. As a tie breaker we use `oftenAppear`, which prefers comedians already used frequently since reusing comedians triggers the discount structure. 

At first we utilised some new heuristics, which were more aggressive in their implementation, but I found this made the annealing approach the final solution slower, aka start further away. This is likely because the heuristics were causing less comedians to be in the domain, so we have to swap more to reach the optimal solution. 

### Simulated Annealing
With an initial solution, we can use simulated annealing, which is a probabilistic search that explores the neighbourhood of valid schedules, accepting worse solutions occasionally to escape local minima. The general approach of this is:
```python
for i in range(max_iterations):
    newAss = get_neighbour(currentAss, path)
    newCost = cost(newAss)
    
    delta = newCost - currentCost
    if delta < 0 or random.random() < math.exp(-delta / temperature):
        currentAss = newAss   # accept — either better, or lucky
        currentCost = newCost
    
    if newCost < bestCost:
        bestAss = newAss      # track all-time best separately
        bestCost = newCost
```
where it is important that we keep the best assignment and current assignment unique. Yes I did name all the variables ass in my coursework why do you ask. The random element allows for it to accept worse options if it gets lucky. The *lucky* chance is determined by temperature as a function of iterations, $i$. 
$$
\begin{align*}
\mathbb{U}[0.0,1.0) < \exp (-\delta / t_i), \\:
t_i = \frac{t_0}{(1 + \log(i+1))}
\end{align*}
$$
We tested linear, polynomial, exponential and logarithmic temperature functions, and found that logarithmic temperature worked the best. This is because early on there is a lot of change, which rapidly drops and then slows down, giving more time to explore broadly before narrowing in. On a geometric level, we can see that by varying $\delta$, it becomes easier for the random number to be less than it if delta is higher, the probability getting worse as iterations continue. By varying it with the difference in value, and number of iterations, it forces bad changes to be aborted more often then not, rather than explore, and lets good changes toward minima be pursued. This uses an initial value $t_0$, which we found to be best at about 50, supported by a [comparison of cooling schedules](#http://what-when-how.com/artificial-intelligence/a-comparison-of-cooling-schedules-for-simulated-annealing-artificial-intelligence/). Higher values than 50 sent the search too far from good solutions. 

### Neighbour Traversal
When we are finding neighbours, we use two different approaches:
1. `swapRandomSlots()`, which takes two random slots and swaps their `(comedian, demographic, show_type)` tuples, and then checks the validity. This changes when shows happen, using only comedians in the current domain. This primarily targets the consecutive-day and same-day discounts. 
2. `findRandomComedian()` picks a random slot and replaces another valid one from the pool, changing who performs, which impacts the domain and which discount brackets will apply.

Neither traversal method alone is sufficient, changing comedians to open new options, and then swapping slots to exploit them. To use this effectively, we use a path switching mechanism. We have a queue `trackQueue`, which detects when a strategy has stalled. If the best cost has not changed for 25 iterations of slot swapping, or 40 iterations of comedian changing, it toggles the strategy. The thresholds were found with experimentation, and reflect the that comedian changing produces fewer meaningful changes, so it gets more attempts before switching. This worked well together, and going forward should be fine-tuned further.

### Failed Approaches
We tried a few additional approaches of heuristics and traversals, which were not successful, but helpful for exploring different ideas. Firstly we have the heuristic of variance. This treats the assignment as a flat list of 1 to 50, where comedians used throughout would have an associated index. Due to the way that cost is calculated, where consecutive days, and using comedians on the same day, typically improves the price - it led to me thinking that the smaller the spread of the comedian, the better the final cost would be. This was then taken across all comedians, and used to find the average variance of all comedians of a schedule, and then the associated value would be taken to mean a neighbour is a better option to pick. Alternatively it would be used as a heuristic in finding the initial solution. When outputting the values of average variance as the system finds a better and better solution, there is a significant correlation between the variance and the optimal value. However, this correlation was limited, reaching a suboptimal minima, which we were struggling to meaningfully escape. 

Another approach was alternate attempts at finding a good neighbour. Instead of picking at random (swapping slots and changing comedian), these would find the best cost of each and choose that to go to the next neighbour. This was great at first, worth the time loss it gave. However, the issue with it reared its head when looking at possible optimal solutions. The problem with this technique is that it falls into a trap of a local minima, and no matter what combination I tried with other approaches, it can never quite make it out in a reasonable amount of time, to the point where this became a hinderance. Using them is guarenteed to quickly give a fairly optimal solution, but with tweaking of the later cooling schedule, its advantages can be accounted for by the other techniques.

We also tried exploring invalid selections, as a way to escape local minima. This contained two major flaws however; as once it went to an invalid solution it was very difficult to consistently return it to a valid one - and we need a valid assignment for the final output. Additionally, the process was very slow returning back to a valid solution, as the domain of possible neighbours was much greater. Hence we avoided using invalid assignments in the final submission. One possible method could be more complex pathing from invalid to valid, but we did not find time to implement this.

### Final Pipeline
Finally we had our full pipeline:
1. Build the full domain of demographic pairs and comedians
2. Sort by MRV and cost-aware comedian ordering
3. Perform backtracking to find one valid initial schedule 
4. Perform simulated annealing for 4000 iterations with initial temparature of 50
5. Switch between swapping slots (rearranging discounts) and changing comedian (opening domain) when the best cost reaches a local minima and stops improving
6. Return the best schedule seen across all iterations
With the example problems we were given, they all had optimal solutions summing to 10500, which gave a target to aim for. We found that 4000 iterations allowed for each problem to consistently get within ~£1000 of the optimal value without running too long. While there is definitely room for improvement in fine-tuning the approach, the solution was one I was very happy with.

# Evaluation
In total this coursework was an enlightening experience, that introduced me to the world of non continuous optimisation problems, and how they can be explored and approached in ways to combat the large domain space. Using probabilistic methods like Monte Carlo to traverse an space of solutions is captivating, and helps inspire my work I do today. Additionally, the example problems gave a good frame of reference, and the possible methods for heuristics and freedom to explore them made this coursework both interesting and stimulating. Though the limitation that we could not update the objects was quite frustrating, overcomplicating my solution by redesigning it around the assignment structure I used. 

There are many improvements that could be made, definitely with the heuristics. One big improvement would be in traversing the space more meaningfully, using either momentum approaches (weighting swaps with directional changes in cost, giving more weight to productive directions), or using more reinforcement learning approaches, learning policy gradient for a probability distribution over swaps that tend to reduce cost. Additionally, we would want to explore from various initial starting points, as to better cover the search space. Since our backtracking is deterministic, we would need to find a way to define multiple start points, and explore out from there. There are a slew of other improvements such as better initial solutions, targetting discounts more specifically, targetted swap selections, using tabu search and parallel searching are all methods we could use to improve our solution. 