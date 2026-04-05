# Introduction 

# Design
- Comedian
- Demographic 
- Timetable
- Scheduler

# Tasks
## Task 1
In this task, you must complete the createSchedule method in scheduler.py, to produce a schedule
that adheres to the following requirements:
• Each demographic must be assigned to a slot.
• Each slot requires a comedian to be assigned to it. Assigning a comedian and a demographic
to the same slot means that the comedian will perform a show in that slot, and the show will
be marketed toward that demographic.
• A comedian can only be marketed toward a demographic (and thus, can only be assigned to
the same slot) if their themes contain every topic that demographic is interested in.
• A comedian can perform a maximum of two shows a week.
• A comedian cannot perform more than one show a day

## Task 2
As a result of the success of your timetable for events produced in Task 1, the comedy club can
afford to put on extra shows. Each day now has 10 shows. Furthermore, there are now ‘main’ shows
and ‘test’ shows. Main shows are two hour long comedy sets with the comedian’s best material,
while the test shows are one hour long sets, where a comedian may try out new material.
Test show tickets are, naturally, cheaper and the audience does not expect every joke to be to
their taste. However, people like to attend test shows for a chance to see new material early. The comedy club is cautious about upsetting their customers, and so wants to assign one main show and one test show for each demographic each week. You must now create a scheduler that adheres to the following requirements:
• Each demographic must be assigned one main show and one test show.
• Each show, whether it is a main or test show, requires a comedian to be assigned to it.
• A comedian can only be assigned to the main show for a demographic if the comedian’s
themes contain every topic that the demographic likes.
• A comedian can only be assigned to the test show for a demographic if the comedian’s themes
contain at least one topic that the demographic likes.
• A comedian can perform in a maximum of 4 hours of shows a week. Main shows are 2 hours
long, and test shows are 1 hour long.
• A comedian cannot perform for more than 2 hours per day.
3
• A comedian can perform only main shows, only test shows, or a combination of the two.
• The shows marketed to a demographic can either involve two different comedians, or the same
comedian.
You must complete the createTestShowSchedule method in scheduler.py with your solution to
this problem

## Task 3
In this task, you must now consider the cost of a schedule. To hire a comedian to perform in a
single main show costs £500. If that comedian is hired for a second main show, the second main
show will only cost £300. If the two main shows are on consecutive days, then the second main
show only costs £100. As such, it is preferable to hire a comedian to perform in two main shows,
and schedule them on consecutive days.
To hire a comedian to perform a single test show costs £250. Each subsequent test show a
comedian performs costs £50 less than the preceding one, and so the second show will cost £200,
the third £150 and the fourth £100. Furthermore, a test show that is performed on the same day
as something else the comedian is performing, whether main show or test show, has its cost halved.
This means that if a comedian is performing in two test shows on the same day, they would cost
£125 and £100 instead of £250 and £200 respectively.
You must complete the createMinCostSchedule method in scheduler.py, to produce a schedule
that minimises the cost, while adhering to the constraints laid out in task 2.
Hint: You should consider a heuristic based approach, and think about how you can measure
closeness to the optimal solution.

# Evaluation