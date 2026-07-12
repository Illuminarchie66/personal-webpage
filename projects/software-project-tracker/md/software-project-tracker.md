# Introduction
This project was undertaken as as part of my Software Engineering module at the University of Warwick. The focus was on developing a software solution, whilst adhering to modern software engineering and project management practices. Thus the focus was less on the result and more so on how we produced it. For this project I was put into a group with Young-Ha Chun, [Owen Green](https://www.linkedin.com/in/owen-green-3314a1198/), [Tudor Irmies](https://www.linkedin.com/in/tudor-irimies-11334b237/) and [Yi Xiang Ng](https://www.linkedin.com/in/yixiang-ng/). Since I already knew several members of the team, I naturally took on the role of Project Manager, which saw to me floating around the different teams and focuses, as well as organising and coordinating the efforts to bring the project together. The project was assigned by Deutsche Bank, do develop a tool or application to enable software development tracking, allowing for managers to evaluate the likely success or failure of a project based on how it is progressing. First was the requirement analysis phase, then 4 months of development, before finally producing the final application and presenting it with the final report. 

For this project, we broke down the team into a frontend and backend. The frontend was carried by Tudor and Young-Ha; the backend was split into the algorithmic side with Owen, and the database with Yi Xiang. Meanwhile I coordinated the team, ensuring standups twice each week, enabling work sessions, letting the components meld and interact, and helping out in areas where I could. From this what we achieved was a pretty good solution overall, with a Flask/Jinja2 web interface linked up to AWS DynamoDB, with a risk algorithm developed from a variety of metrics, trained on Jira repositories of requirements. 

# Project Management
In our group of 5, we took inspiration from the Scrum methodology as the method we used to complete our project. We chose this method because of its high flexibility, as the sprints allow us to complete prioritised tasks first as well as allow for constant testing. The difference of our method to conventional Scrum is our sprints are 1 week long as opposed to the normal 2-4 weeks, and we met around twice a week, instead of daily. To oversee the entire process, we had a dedicated Scrum Master who kept check of our meetings and sprint cycles, making sure goals were met before due dates. Sprints are 1 week long, corresponding nicely to the weeks left of the term, and meeting up twice a week, once in person to properly discuss ideas and plans for the project. Furthermore, we acknowledged the absence of an on-site customer, and hence, for our solution to emulate the successful aspects of Scrum we used a mixture of occasional discussions with the module organiser, in addition to discussions between the Product Manager and the Business Analyst to determine our next set of requirements (using appropriate market research). These requirements were then passed to the Scrum Master to refine the new set of requirements for the coming sprint. Additionally, we took advantage of Jira, which specialises in agile project management. As regular meetings are a
core component of the Scrum methodology, we chose Discord as our main means of communication, due to the ease of access and its compatibility with bots that help us track our progress (such as bots for GitHub and Jira).
- Archie Harrodine: Project Manager
- Tudor Irmies: Scrum Master
- Owen Green: Business Analyst
- Yi Xiang Ng: Software Developer and Tester
- Young-Ha Chun: Software Developer and Tester
Young-Ha and Tudor primarily focusing on the frontend, due to their experience from the web development module; Yi Xiang and Owen focusing on the backend, due to experience with the AI module, and deeper understanding of database design. I floated between the two teams, providing support where needed, and enabling an interface for both pairs to have their products work together seamlessly.

# Requirements
For modern companies, development of software is a key aspect toward their success and expansion. As the need for software grows, the quantity and frequency of software development will only continue to increase, with a projected 12% increase for the software development industry, from a 2021 evaluation of $430 billion, by 2030. Currently, it is estimated that 70% of software projects end in failure, resulting in a waste of resources and, in the worst case scenario, could lead to the stability of the development company being threatened. Deutsche Bank tasked us with designing a platform capable of monitoring software development projects and identifying projects that may be at risk of failure. Rather than simply acting as another project management tool, the platform aimed to combine project tracking with automated risk analysis, helping managers identify problems early and understand the factors contributing to them. This project aims to minimise the failure of software projects, by granting more control to the software manager, improving the transparency of a project to its constituents, and providing a system which can aid in maintaining the health of a project.

For our requirements, we broke them down into four core sections: basic design and operations (R1), risk modelling and visualisation (R2), testing and quality assurance (R3), and finally system evolution and maintenance (R4). Each of those were broken down further into customer facing and developer facing requirements. 

During this phase I also developed a risk assessment, which considered issues like lack of technical skills, team personal circumstances, legal/policy changes, info leaks, or deadlines not being met. We assigned controls for these risks, however we many we could do little to account for due to the nature of this being a university project.

## Basic design and operations
- The system will consist of three main subsystems for: the web application, the database and risk modelling. The user will be able to access a personalised web interface and will be able to interact with their data.
- Database will support multiple levels of access depending on manager or member of a project. User will be able to see software projects they manage and will receive real time updates on their progress through the dashboard. 
- User will be able to login to the website, implemented via Amazon Web Services (AWS) authentication system to validate their credentials. 
- System will enforce up to date security measures such as Multi-Factor Authentication (MFA).
- System will identify first time users and will be shown a help prompt to walk them through using the main features of the site.
- Details regarding each project will be able to be viewed by selecting the specific project, with content shown being dictated by user's current permissions.
- Account creation permissions should be restricted to system administrators.
- System will save presets of preferred team member access options, and track all team members involved as well as their task to complete.
- Will provide users with an easy way to update details of the project as the project progresses, handling both AGILE and plan-driven approaches.
- Product manager will be able to create projects and add others to a project.
- Product is able to be linked to GitHub repository or Jira project to extrapolate more details.

## Risk modelling and visualisation
- Algorithm will produce a confidence rating from 0 to 1 of how likely it thinks a project is to fail. 
- Algorithm will be able to quantify the qualitative measurements into sensible parameters.
- Algorithm will be able to collate info from project members into numerical data used for modelling. 
- Algorithm will be able to produce a list of its input parameters ranked by how significantly they are affecting risk. 
- User will be able to see numerical and visual representatons of how likely a project is to fail. 
- User will be able to enter both direct parameters and qualitative measurements to evaluate progress.
- Project managers will be able to see which factors have the most significant risk. 

## Testing and quality assurance 
- Prototype will display several example projects which demo promised features.
- User interface will be reliable and behave as expected.
- Website will have test projects setup by external testers to eliminate areas that are not intuitive.
- Website ensures privacy is protected, and stored data is only displayed to authorised users.
- Testing data will be entered into the database to simulate ordinary users.
- Test cases of projects will be generated which we know if they are obviously failing or succeeding to rate the effectiveness of the model.

## System evolution and maintenance
- System will be sufficiently documented in order to allow external maintainers to support the project.
- Help pages will be produced describing exactly what to expect from existing APIs and components. 
- Database and risk modelling system will be designed to be flexible and modular enough to support storing/using new parameters and alternative models.

# Design 
The next step of the project was in the design phase, which saw us breaking down architecture, responsibilities, prototype approaches, mockups and system interaction. I cannot stress enough the importance of how a good design shapes a good project.

## Architecture 
Firstly we broke down the architecture of our product, and how that would reduce to team responsibilities. The architecture we chose was the Model-View-Controller (MVC). This architecture is crucial to our product's functionality, as this design is built around providing users a multitude of ways that the system can be viewed and interacted with. By offering a separation of presentation, interaction and system data, MVC not only lets users effectively interact with their software projects in real time but also enabled us to divide the threads of work cleanly between the model, the view and the controller. This separation also allows for easier maintainability for future updates and development. 

![MVC diagram](./md/images/mvc.png)
*Diagram showing the Model-View-Controller breakdown we used.*

With the underlying architecture determined, we could construct the model that we were to use. This looks at the overall scope with respect to a context model, and describing entity relationships. This context model captures the information about the key entities of the system. With the MVC architecture, it allowed for a design which is not overly reliant on specialised OOP coding practices. Each component of the system is designed to interact with each other when necessary, and the inner workings of each component aren’t so complex to require a large number of classes to be detailed. The more important aspect of this design, is how we designed each of these subsystems, and how they interacted with each other. Therefore no class diagram is needed, as the information is encapsulated within the diagram below.

![Context diagram](./md/images/context.png)
*Context Diagram of the system.*

## Metrics and Modelling
The project's aim was to gather and interpret various metrics used to track the progress of software. We approached this by looking at business practices - deriving how companies go about determining the current trajectory of a project - and looking into metrics that have been used for academic research for project success. The purpose of combining these two perspectives was to gain a wider perspective of the impact of metrics, and utilise them for our algorithm. Amongst reading several fairly generic online articles detailing the reasons for why software engineering projects fail, the most information for this side was gleaned from an interview with a chief architect at a large defence company. This interview detailed the metrics which each sprint is evaluated upon.
- Schedule: rating if requirements for a certain sprint have been met within the deadline. 
- Cost: rating if the project is within budget, considering expenditure from resources, technologies and realised risk.
- Quality: rating quality and success of each completed requirement, done by the developer or project manager.
- Business change: rating the impact of an internal or external restructurings of the company.
- Safety: rating how well a system can handle failure or erroneous human actions.
- Resourcing: rating the allocation of resources toward certain aspects and areas of the project.
- Risk: rating the amount of risk realised from the risk assessment, either with a rating or monetary value.
- Stakeholder satisfaction: rating the happiness of the customer with the current build. 
- Technical maturity: rating how far along a solution is to the problem. 
- Sprint review: this is the project manager's personal review of how the project is progressing. 
For our project, including and tracking all of these would be severe scope creep, and so we must prioritise which we are to include and implement. The metrics we focused upon are: schedule, cost, risk, resourcing. This ordering is derived from various articles, and what was discussed with the interviewer. In particular, remaining on schedule, remaining within budget, and ensuring enough redundancy to handle realised risk, were the three key areas which determine if a software project is likely to fail. 

With the metrics setup, we explored how we may model with them. The study of risk management in software engineering has evolved with the discipline itself. As early as 1989 software risk management was being studied with it being acknowledged that software 'rework' costs already accounted for forty to fifty percent of total software development costs.  As time has evolved the complexities of the techniques used for risk management has increased with many AI and ML techniques being applied to the problem. We initially investigated several approaches, including the Átropos context-history model and a Naive Bayes classifier informed by academic literature. However, as the project progressed, the availability of suitable training data became the limiting factor, leading us to pivot towards an exponentially weighted moving average (EWMA) approach that better suited the data available. We used a pipe and filter diagram to show how the risk modelling system would interact with the other system components, utilising API requests.

![Pipe and Filter diagram of the risk modelling system](./md/images/pipe-and-filter.png)
*Pipe and Filter diagram of the risk modelling system.*

## Database Design 
For this project we used AWS DynamoDB to store all data, and Amazon Cognito to handle the logins. DynamoDB is one of Amazon's NoSQL Databases that works easily with AWS which we are using to host our project - and more importantly it was free (for small scale projects). A NoSQL schema also gave us the flexibility to evolve the project metrics throughout development without requiring expensive schema migrations. DynamoDB is also compatible with Cognito and other programming languages via AWS SDK. This was ideal as Cognito also had helpful functionality such as emailing and sending messages on an event, letting us remind users of deadlines and events. Cognito uses a token system which upon successful authentication granted tokens which are exchanged for access to other AWS services. 

For our database, we made sure to use multiple tables and normalization to reduce data redundancy and duplication. There was a central project table, which linked to others for metrics for further detail on them, as well as employee and manager tables for managing users. You can visualise our plan below:

![Database Entity Relationship Diagram](./md/images/db.png)
*Database Entity Relationship Diagram.*

## Processes and Activities
Since there is a variety of ways for the user to interact with the system, we broke it down into a series of primary examples in Use-Case diagrams so that both the database team and UI team could build their subsystems around the same interface. The key things of note from this diagram is the extensions when creating a project, to be able to set different user restrictions on what metrics can be seen, and the option of adding people to the provided project.

![Use-case Diagram to show user interactions](./md/images/use-case.png)
*Use-case Diagram to show user interactions.*

The way that our main components interact is solidly reflected by our MVC architecture. There are a few areas that need further elaboration though. Firstly the login system must be touched upon due to its deeper ties with the external AWS system. The user login activity diagram showcases the process of an initial login, and how it interacts with the database. We also study the possible sequencing of uploading data, and what that looks like between the user, database and risk modelling system. Now it is worth saying that all these different diagrams exist pretty much exclusively for the marks - and were not really that useful. Like at all. I think it could be helpful if we were like upper management and wanted to tell other teams what to do but like... we were going to do this ourselves. Idk. Big waste of time for us but whatever! They look pretty.

![User login activity diagram](./md/images/activity.png)
*User login activity diagram.*

![Sequence diagram of data entry](./md/images/sequence.png)
*Sequence diagram of data entry.*

## UI Design
The website aims to provide an all-in-one platform for tracking and managing software projects. The platform will be centred around a dashboard, which allows users to see the software projects they manage and receive real-time updates on their progress. Project members will have the ability to view a subset of information about the project, as dictated by the project manager, and they will be able to access detailed information about each project by selecting it from the dashboard. The platform will track a variety of metrics, including project progress, and the amount of information displayed will depend on the user’s current permission setting. To ensure an easy and intuitive experience, the platform will also provide users with a simple and straightforward method for updating the details of the project as it progresses, allowing for seamless management and tracking of each sprint or milestone. With the help of a navigation bar on the left-hand side, the user will be able to access the main pages of the website, as well as their list of co-workers, with a possible representation of a green circle adjacent to coworkers that are currently active on the website. Furthermore, the navigation bar provides access to a settings button and profile page, providing additional customization options for users to personalise their experience. The dashboard mockup created was well designed and used in the final product. We additionally designed the project page and feedback pages, but they distinctly evolved as time passed to be more visually appealing and easy to use. These mockups later formed the basis of the final Tailwind-based interface, although several pages evolved considerably throughout development following usability testing.

<div class="image-row-wrapper">
    <div class="image-row">
        <img src="./md/images/dashboard.png" alt="Dashboard mockup">
        <img src="./md/images/project.png" alt="Project Page mockup">
        <img src="./md/images/feedback.png" alt="Feedback Page mockup">
    </div>
    <p class="image-caption"><em>The UI mockups designed.</em></p>
</div>

The design of the buttons on the website follows the principles of Gestalt psychology, with a consistent style and convenient placement to reduce cognitive load on users. The similarity principle ensures a cohesive look for buttons, establishing a clear visual hierarchy and making it easier for users to understand the relationships between different elements on the page. This design approach minimises the burden on users' long term memory and instead focuses on short term memory and reasoning, creating a streamlined and efficient experience. In addition to its clear and intuitive design, the web page will also be fully responsive and adjustable to different devices.

## Testing
We designed our testing such that each sprint we ensure that our project and risk model stays on track. Within larger software projects, it is so easy to divert from the original requirements; hence each week during the sprint evaluation, the scrum master tracked  if the stories meet their goals, and evaluated how focused the result was when compared to the task set. This was a decent method of staying on top of things, but fell a bit short when other courseworks disturbed our development.

We made sure to implement unit testing, which focused upon regular updates and tests of core components. We also performed usability testing in the later phases of the project, which evaluated how accessible the interface is to a user and their experience using it. It had them completing a list of standard tasks and reviewing their ease or difficulty in completing them. We finally had integration testing, which is a fun way of saying we made sure our different components would work together. 

# Implementation 
Once the design was in place, that is when we began the actual development. Each sprint had a variety of twists and turns, but the team made a phenomenal effort and I was so lucky to be a part of that group.

## Technology Stack
The breadth of this project was a good introduction into a variety of technologies, and let me learn what is used throughout the industry. We primarily utilised a webpage so it would be highly accessible, with a Python backend for the server to allow for easy development of the risk models.

| Technology | Purpose | 
| --- | --- |
| Flask + Jinja2 | Backend routing and templating. |
| Tailwind CSS | Styling. |
| Flowbite | Interactive UI components. |
| Chart.js | Used for sprint and metric visualisations. |
| AWS DynamoDB | NoSQL project storage. |
| Amazon Cognito | Authentication. |
| Pandas / Scikit-learn / SciPy | Risk modelling. |

## Frontend
In our final product, we managed to achieve a well designed Login, Dashboard, Project Page, Permission Systems, and interactive elements on each of the pages. We login via Amazon Cognito, which maintains a session between pages. We then have a tutorial on first login, to make it easy to understand for users. The website contains a navigation bar on the left hand side of the page, highlighting the current page the user is on, and allowing for smooth movement between pages and sections of the site. 

The dashboard page allows for users to view and order projects according to various metrics such as name, budget, deadline etc. It also allows for them to create and deactivate new projects. For creating, an overlay will appear, prompting the user to input starting information about the project, which can be seen below.

![Dashboard Page](./md/images/dashboard-final.png)
*Dashboard Page.*

![Add Project View](./md/images/add-project.png)
*Add Project View.*

The project page can be accessed via the corresponding view button on the dashboard or the navigation bar as previously mentioned. Similarly, the project page also includes a help button that provides explanations on how to use the page. An important feature of the project page is that details are displayed according to the permission level of the user, for a given project, ranging from 1 to 3 with the highest access given to a manager. As such, depending on the user's permission, they have access to different areas of the website. For those with the lowest permission, level 1, the user may view basic project information consisting of the: project name, progress bar, status, deadline and budget. For level 2 users, they gain access to two new sections on the page, composed of the "Sprint Details" where they may view current requirements to be completed with a graph showing a detailed overview of sprints thus far, as well as the "Team Members" section where they may view coworkers in the same project. Level 3 users would also have access to a "Details" component, where they are given feedback on various metrics such as their budget spending and sprint timings, to get a better understanding of how to improve. Additionally, at the highest level of permissions, the manager has access to features that enable them to alter project data in the database, from editing members and their permissions, to adding and completing requirements.

![Project Page](./md/images/project-page.png)
*Project Page*

![Add Requirement View](./md/images/add-requirement.png)
*Add Requirement View.*

All previous sections can be collapsed via an accordion to minimise the space taken on the screen, to aid with potential visual clutter. The feeback page provides provides an interface for the user to contribute to the progress tracking by inputting a number of metrics to add in determining the status of the project. It will take the inputs, use them in the risk modelling, then redirect to the dashboard page. 

We initially relied solely on Tailwind CSS before introducing Flowbite to simplify interactive components such as modals and accordions. Later, Chart.js was integrated to visualise sprint progress. Looking back, selecting a single component library from the beginning would have reduced some unnecessary complexity.

## Database
Using AWS' Software Development Kit for Python3 (Boto3), we could call add, delete, query and update operations on the Database through a python file. By using AWS, a single user can create roles and permissions for themesleves, which in turn allows users to generate access keys and secret keys which gives us access to the Database in the AWS system. By making use of OOP, the DB team only needed to create methods for accessing, adding and updating to the database, while frontend and backend teams would only need to import the database program to use the functions. From the DB we ensured the employee permission levels utilising clearance levels from 1 to 3, representing a number of metrics a user can view. It is stored in the Project_Team table, representing a team of people tasked with a project, their manager, and their permissions.  

The NOSQL Database - also known as schema-less database - meant that all records are essentially key-value pairs, which means that other than the primary key, the other values entered into the DB do not necessarily have to conform to a schema. Taking advantage of this, we can initiate projects with a certain attributes empty to signify they are incomplete. 

One of the major challenges faced by the team was ironically caused by the supposed advantages of a NoSQL Database. The no-relational style of NoSQL made it difficult to ensure referential integrity. This became an issue in the middle of development when more tables were created, many of which referenced either ProjectID or RequirementID. Additionally, NoSQL also meant the absence of a SERIAL datatype, which proved difficult to automatically generate IDs for us. With the team being more comfortable with SQL databases, this sudden shift did cause some problems. In retrospect, as project lead I should have looked into the affects of NoSQL further, and decided to use regular SQL for a better design overall. 

Our design thus was flawed, as it was built with SQL in mind. Our initial SQL based design required us to change it to something more appropriate to schemaless DB. This eventually resulted in further communication issues, which required a bit of crunch to fix. Eventually, we reconfigured the table structure to remove the relational complexity, with foreign relationships being enforced through out code rather than DynamoDB. Additionally, to account for the SERIAL data type problem, we found the best method to account for this to be when we are creating a new entry we access the length of the table, and use this to assign to the new value. This posed risk of what occurs when projects are deleted, but this was dealt with by adding an additional attribute which determined if a project was active or inactive. This is justified by the fact companies may wish to retain failed project data, for future insights.

The final database also saw the removal of several tables and attributes of metrics that were no longer to be considered from time constraints. In particular the stakeholder review, and the resourcing details. Furthermore, we found for tracking the progression of data, as well as for making full use of exponential running average, we would store in the Sprints table, all metrics, so their progression can be detailed.

![Original SQL database design](./md/images/original-sql.png)
*Original SQL database design*

![Final database structure design](./md/images/final-schemaless.png)
*Final database structure design*

## Risk Engine 
The risk algorithm comprises of 4 different components which are evaluated individually and then combined in order to produce a singular risk value which accurately represents the health of a project. This modular approach also enables easy identification of factors which are most greatly affecting risk. For clarity we mapped all risk components to the interval $[0,5]$ where 0 represents good, no riskm and 5 represents bad, the highest amount of risk. From these four risk values we take a weighted average, which gives us a single value to evaluate the risk of the project. We ensure we return the complete breakdown though, as this allows for the project managers to pick apart where the project is failing the most. We also ensured that the calculator was modular, with each metric being independent, so extending it with new metrics was a simple addition to the weighted average.

### Requirement Value
We utilised a dataset based off of public Jira repositories in order to evaluate the risk associated with each requirement. We used a Naive Bayes classifier, in order to accurately classify the risk value associated with each requirement. Specifically we used the Gaussian Naive Bayes function of Scikit-Learn in order to classify requirements. We chose to consider only the priority and probability attributes of the dataset as interpreting the text fields would have increased the complexity of the model greatly and we felt they encapsulated what we needed to measure risk.  Once we were familiar with the basic operation of Scikit-Learn the implementation was fairly straightforward leveraging the `test_train_split()`, `GaussianNB.fit()` and `GaussianNB.predict()` functions.

### Schedule Value
We analysed a data set of many sprints from [various open source projects](https://github.com/RandulaKoralage/AgileScrumSprintVelocityDataSet) and found that on average 41.8% of tasks were completed during a sprint. Given the large size of sample data used we assumed that it was normally distributed (Central Limit Theorem) and mapped the probability of a project having a particular completion percentage to the 0 to 5 interval. For example a sprint having a completion rate of 90%, well beyond the normal mean, has a risk value of around 0.35 representing that this factor is contributing very little to the risk of the project. The analysis of the data was performed using pandas as the DataFrame object provided an easy way to filter and concatenate data. For creating and applying the distribution we used scipy.stats which with its build in norm and cdf functions made implementation straightforward. In order to see a picture over multiple sprints we took an exponentially weighted moving average (EWMA) which is shown in the formula below where t represents the number of time steps and each xi are our input values. A decay paramater, $\alpha$ is used in order to decrease the value of older sprints and hence, consider the most recent ones more prominently. We are able to use this in order to observe the trend of how tasks are being completed across sprints. We implemented EWMA using the built in pandas function and set $\alpha = 0.5$ for a balanced rate of decrease.

$$
y_t = \dfrac{x_t + (1- \alpha) x_{t-1} + (1 - \alpha)^2 x_{t-2} + \cdots + (1 - \alpha)^t x_0}{1 + (1 - \alpha) + (1 - \alpha)^2 + \cdots + (1 - \alpha)^t}
$$

### Quality Value
We use the same ideas outlined in Schedule Value as the `quality_metric()` function takes in a list of average quality ratings for each sprint which we can then take the EWMA in order to build a picture across multiple sprints. Implementation was very easy as it uses identical techniques to the schedule value code.

### Cost Value
Earned value management is an active research area with many complex techniques being employed to enhance the accuracy of project performance rating. We opted for a more perspicuous approach centering our analysis around the cost performance index (CPI) of a project which is calculated by taking the earned value and dividing it by the actual cost. Projects with an earned value > 1 are under budget and as such are less at risk meanwhile projects with a CPI < 1 are over budget. A quick internet search shows there are many different ways of interpreting this figure and acceptable ranges can vary greatly. We went for a more rigorous interpretation as set out by Kim and Pinto in their article "What CPI =0.85 Really Means: A Probabilistic Extension of the Estimate at Completion". They state that typical thresholds for budget are within $\pm15%$ which corresponding to a CPI of over 0.85. However, McKinsey found that large software projects (a budget ≥ $15 million) are on average 45% over budget. Therefore, we must accept a wider range of CPI values in order to meaningfully track a wide range of software projects.

For implementation, we created a custom piecewise linear function which maps CPI values onto our 0 to 5 scale taking into account the research of Kim and Pinto as well as the fact software projects are highly likely to run over budget. For CPI over 1.1 we map to 0 risk value as these projects are well within budget. From there we increase gradually so that a project with a CPI of 1 has a risk of 1. We determined that a CPI of 0.5 was a suitable cut off point to maximise the contribution to the overall risk factor of the cost value as this was well beyond McKinsey’s average range which allows our system to have better granularity in determining the cost value.

## System Integration 
The final aspect to consider during development is the interactivity between the systems. This focus started in the 5th sprint, and had the goal of providing functions that the web page could call to interact with the database. The interactions were designed to minimise the number of unnecessary recalculations and updates, as that is costly on time. We encountered a problem of updating individual components, as before this point it was either everything or nothing. However, after studying AWS requests, a function was designed such that the tables could update an attribute specified in the function, reducing heavy amounts of code refactoring. The other major issue of component interaction was deciding how to handle an input with incomplete requirements. The method that was settled for was to take all complete requirements of the current sprint, and all incomplete requirements of the entire project, and divide the two. This way it makes the natural assumption that if a requirement is incomplete, it is considered in the current sprint. To conclude, the interactivity between components was fairly easy to implement with little issue, as it was carefully planned out, and did not need to perform any complex functionality. We can see all of the primary interactions displayed below:

![Component Interaction Diagram](./md/images/interaction2.png)
*Component Interaction Diagram*

## Iterative Development 
As we worked through each sprint, we had several design changes during development. 
- Tutorial mode was changed with a help button on each page, so there is always an easy method to remind yourself on how to use the page.
- Instead of customized permissions, we set three levels depending on role, to reduce project and testing complexity.
- We switched to only develop for AGILE driven approaches, ignoring plan-driven to reduce the scope.
- We replaced the temperature bar with a lexical approach alongside numerical information in the form of a graph. 
- We ignored most qualative parameters as data was far easier to interpret. 
- We changed the risk value range from 0 to 1, to 0 to 5, for more consistent easy to understand evaluations.

While the original design proved to be a strong foundation, several aspects evolved substantially during implementation. These changes highlighted the importance of iterative design and demonstrated that adapting the architecture based on practical experience often leads to a stronger final system than rigidly adhering to an initial specification.

# Evaluation

## Frontend
Our frontend met the majority of our functioanl goals, with a successful user interface with the core pages accessible and itneractable. User feedback was integrated and it was all easy to navigate, being very responsive throughout the whole workflow. While there were several limitations such as taking in qualitative data and certain metrics, the basic implementation was there and ready to be expanded upon. The biggest limitation in our view was with our system of permissions to have a hierarchy of levels, as the nuance was too much for the limited time we had. We also could have scrutinised user input further, as we only used Jinja2 sanitisation, but we could have gone further to ensure security.

Our user testing was successful in gleaning more details about the design and interactability. Generally the feedback was positive, with issues being ironed out as we developed, such as the color scheme for status and progress aligning; or multiple sections displaying at once being overwhelming which was fixed with accordions. When we ran our final tests at the end of the project, we recieved feedback saying the site was easy to navigate, the sorting was useful, consistent colour scheme, and animations were clean. However, there were some persisting issues such as help buttons being inconsistent, coworker information being ianccessible, online indicator being confusing, and the date formatting was unexpected. Overall, user testing led to several improvements throughout development and confirmed that the interface was generally intuitive to use.

A small number of requirements were left incompelte for the frontend, which mostly pertained to extensibility rather than core functionality. More configuration and customisability would be the biggest improvement we could achieve here.

## Database
Throughout the course of this project, the demands needed from the database changed regularly, and thus, the methods as well. Since the database program includes a plethora of methods, a comprehensive automated unit test program was created to ensure that each method was working according to design and that each update to the database was as intended. After the initial static testing where we inspect code, the test program would be run at regular intervals throughout the sprint to make sure that any new commits to the repository would still meet our requirements. We also performed consistent extra tests to ensure what was in the DB was being reflected on the website, whcih we could not automate. 

With more time, we might have avoided the sunk cost fallacy which was our use of DynamoDB. Amazon does offer other database services which work with MySQL and PostgreSQL, such as Amazon Relational Database System (RDS), albeit RDS being much more complicated to use and setup compared to DynamoDB. Since most of us are more familiar with SQL as opposed to NoSQL as well as how our tables all reference each other, this change would definitely be the first thing we do if we were to carry out the project again.

If we were to take the project further, the biggest area of improvement would be mapping more data, with tasks per employee, richer employee metadata and matching the skills of employees to the tasks at hand. 

## Backend
As we developed, we prepared unit tests, scenarios and edge cases to ensure correctness of the model, such as dealing with empty data returning 0; or inherently good/bad projects returning a value above or below 2.5 respectively. We used several tests to evaluate correctness, with our risk model performing generally quite well depending on the attributes used. 

| Attributes Used | Number Mislabelled (/150) | Percentage Correct | 
| --- | --- | --- |
| Probability, Priority | 11 | 92.67 |
| Probability, Magnitude, Priority | 12 | 92.00 |
| Impact, Magnitude | 77 | 48.67 |
| Probability | 22 | 85.33 |
| Priority | 8 | 95.33 |

Whilst our risk model performs suitably well in testing, various aspects of the model could be improved. The table above shows the performance of various Gaussian Naive Bayes Models on the requirements dataset using a 50 / 50 train, test split. Although priority alone performed slightly better on the available dataset, using multiple attributes provides a more flexible model that can generalise better when additional data becomes available. The primary limitation is small organisation-specific dataset. We should explore more retraining and metrics in the future. 

## Overall
Overall, the project achieved its primary objective of producing a working software project management prototype capable of tracking projects and estimating project risk. While several lower priority features remain unfinished and there are opportunities to improve maintainability and expand the risk model - the prototype demonstrates the feasibility of the approach and provides a strong foundation for future work. The strongest elements are the effective front end, the integrated interconnected system, and the expandable architecture. The weakest is the database, component coupling, missing metrics and how we visualise some of the data.

## Extensions
There are many potential extensions that can be made toward this product, both visually and algorithmically. 