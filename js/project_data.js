const projects = {
  "geographic-centre": {
    title: "Centre of N points",
    summary: "A project to find the geographic centre of a set of points on the Earth's surface, using stochastic gradient descent and optimisation techniques.",
    start: "2020-02",
    end: "2021-03",
    skills: ["Python", "Calculus", "Optimisation", "Geometry", "HTML", "CSS", "JavaScript"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "personal",
      meta: ["has-website", "has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/Geographic-Centre" },
      { icon: "../../assets/icons/document.svg", label: "Report", url: "./CentreOfNPoints.pdf" },
      { icon: "../../assets/icons/website.svg", label: "Website", url: "./app" },
    ],
    markdown: "./md/geographic-centre.md",
    prev: null,
    next: { key: "robot-maze", label: "CS118 Robot Maze" }
  },

  "epq": {
    title: "EPQ: Game Design",
    summary: "An Extended Project Qualification (EPQ) on game design, where I designed and developed a game in Unity, and wrote a report and journal on the process.",
    start: "2020-02",
    end: "2021-03",
    skills: ["Unity", "Game Design", "C#"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "personal",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "TBD" },
      { icon: "../../assets/icons/document.svg", label: "Report", url: "https://cdn.archie-harrodine.com/projects/epq/Realising%20the%20perfect%20video%20game.docx" },
      { icon: "../../assets/icons/document.svg", label: "Journal", url: "https://cdn.archie-harrodine.com/projects/epq/EPQ%20Artefact%20Journal-merged.pdf" },
    ],
    markdown: "./md/epq.md",
    prev: { key: "geographic-centre", label: "Centre of N" },
    next: { key: "robot-maze", label: "CS118 Robot Maze" }
  },

  "robot-maze": {
    title: "CS118 Robot Maze",
    summary: "A project to program a robot to navigate a maze using various techniques, teaching the basics of OOP",
    start: "2021-10",
    end: "2021-12",
    skills: ["Java", "OOP", "Algorithms", "Djikstra's"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "academic",
      meta: ["has-github"]
    },
    links: [{ icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS118-Robot-Maze" }],
    markdown: "./md/robot-maze.md",
    prev: { key: "geographic-centre", label: "Centre of N" },
    next: { key: "architecture", label: "CS132 Architecture" }
  },

  "architecture": {
    title: "CS132 Architecture",
    summary: "A project to design different parts of CPU architecture, and developing programs using C.",
    start: "2021-10",
    end: "2022-02",
    skills: ["C", "Assembly", "Computer Architecture"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "academic",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS132-Computer-Architecture"},
      { icon: "../../assets/icons/document.svg", label: "Coursework 1", url: "./CS132_Coursework_1.pdf" },
      { icon: "../../assets/icons/document.svg", label: "Coursework 2", url: "./CS132_Coursework_2.pdf" }
    ],
    markdown: "./md/architecture.md",
    prev: { key: "robot-maze", label: "CS118 Robot Maze" },
    next: { key: "waffles", label: "CS126 Waffles" }
  },

  "waffles": {
    title: "CS126 Waffles",
    summary: "A project to design and implement a restaurant management system, teaching the basics of data structures and sorting algorithms to work with large amounts of data.",
    start: "2022-01",
    end: "2022-03",
    skills: ["Java", "Data Structures", "Algorithms", "Databases"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "academic",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/Waffles"},
      { icon: "../../assets/icons/document.svg", label: "Report", url: "./waffles.pdf" },
    ],
    markdown: "./md/waffles.md",
    prev: { key: "architecture", label: "CS132 Architecture" },
    next: { key: "hurdle", label: "CS141 Hurdle" }
  },

  "hurdle": {
    title: "CS141 Hurdle",
    summary: "A project to implement a functional programming solution for the Wordle game, exploring concepts in Haskell and developing a Wordle AI.",
    start: "2022-01",
    end: "2022-02",
    skills: ["Functional Programming", "Haskell", "Wordle", "AI"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "academic",
      meta: ["has-github", "has-website"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS141-Hurdle"},
      { icon: "../../assets/icons/document.svg", label: "Feedback", url: "./feedback.pdf" },
      { icon: "../../assets/icons/website.svg", label: "Wordle", url: "./app" },
    ],
    markdown: "./md/hurdle.md",
    prev: { key: "waffles", label: "CS126 Waffles" },
    next: { key: "onaf", label: "ONAF" }
  },

  "onaf": {
    title: "One Night at Freddy's",
    summary: "A project to implement Five Nights at Freddy's in Haskell, exploring functional programming and game development concepts.",
    start: "2022-02",
    end: "2022-03",
    skills: ["Functional Programming", "Haskell", "Game Development"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "academic",
      meta: ["has-github", "has-website"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS141-Functional-ONAF"},
      { icon: "../../assets/icons/document.svg", label: "Report", url: "./report.pdf" },
      { icon: "../../assets/icons/document.svg", label: "Feedback", url: "./feedback.pdf" },
    ],
    markdown: "./md/onaf.md",
    prev: { key: "hurdle", label: "CS141 Hurdle" },
    next: { key: "os-and-networks", label: "CS241 OS & Networks" }
  },

  "os-and-networks": {
    title: "CS241 OS & Networks",
    summary: "A project to explore packet sniffing, network protocols and using threading in programs.",
    start: "2022-10",
    end: "2022-12",
    skills: ["C", "Networking", "Operating Systems"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "academic",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS241-OS-and-Networks"},
      { icon: "../../assets/icons/document.svg", label: "Report", url: "./report.pdf" },
    ],
    markdown: "./md/os-and-networks.md",
    prev: { key: "onaf", label: "One Night at Freddy's" },
    next: { key: "databases", label: "CS258 Databases" }
  },

  "databases": {
    title: "CS258 Databases",
    summary: "A project to design and implement a database system for gigs, acts, venues and customers. Uses PostgreSQL and JDBC to create a fully functional database system, and explores concepts in database design and SQL.",
    start: "2022-10",
    end: "2023-01",
    skills: ["SQL", "Database Design", "Java"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "academic",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS258-Databases"},
    ],
    markdown: "./md/databases.md",
    prev: { key: "os-and-networks", label: "CS241 OS & Networks" },
    next: { key: "ai", label: "CS255 AI" }
  },

  "ai": {
    title: "CS255 Artificial Intelligence",
    summary: "A project to implement AI algorithms to solve a CSP problem of performing comedians, using backtracking and simulated annealing, while exploring concepts in AI, search algorithms and heuristics.",
    start: "2023-01",
    end: "2023-02",
    skills: ["Python", "AI", "Search Algorithms", "Monte Carlo"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "academic",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS255-Artificial-Intelligence"},
    ],
    markdown: "./md/ai.md",
    prev: { key: "databases", label: "CS258 Databases" },
    next: { key: "formal-languages", label: "CS259 Formal Languages" }
  },

  "formal-languages": {
    title: "CS259 Formal Languages",
    summary: "A project to implement a simple compiler for a functional programming language, exploring concepts in automata theory, parsing and compiler design - implemented with JavaCC.",
    start: "2023-01",
    end: "2023-03",
    skills: ["Java", "Automata Theory", "Compilers"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "academic",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/document.svg", label: "Program", url: "./Assignment.jj" },
    ],
    markdown: "./md/formal-languages.md",
    prev: { key: "ai", label: "CS255 Artificial Intelligence" },
    next: { key: "software-project-tracker", label: "CS261 Software Project Tracker" }
  },

  "software-project-tracker": {
    title: "CS261 Deutche Bank Software Project Tracker",
    summary: "A group project to design and implement a software project tracker for Deutsche Bank, using model view controller architecture for frontend, backend and database.",
    start: "2022-10",
    end: "2023-04",
    skills: ["Python", "ML", "Jira", "Agile", "Flask", "NoSQL"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "academic",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: ""},
      { icon: "../../assets/icons/document.svg", label: "Requirements", url: "./CS261_Requirements_Analysis.pdf" },
      { icon: "../../assets/icons/document.svg", label: "Design", url: "./CS261_Planning_And_Design.pdf" },
      { icon: "../../assets/icons/document.svg", label: "Report", url: "./CS261_Final_Report.pdf" },
    ],
    markdown: "./md/software-project-tracker.md",
    prev: { key: "formal-languages", label: "CS259 Formal Languages" },
    next: { key: "digital-forensics", label: "CS355 Digital Forensics" }
  },

  "digital-forensics": {
    title: "CS355 Digital Forensics",
    summary: "A project to complete various labs on different images, using MatLab and image processing techniques.",
    start: "2023-11",
    end: "2024-01",
    skills: ["MatLab", "Image Processing"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "academic",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS355-Digital-Forensics"},
      { icon: "../../assets/icons/document.svg", label: "Report 1", url: "./CS355_Report_1.pdf" },
      { icon: "../../assets/icons/document.svg", label: "Report 2", url: "./CS355_Report_2.pdf" },
    ],
    markdown: "./md/digital-forensics.md",
    prev: { key: "software-project-tracker", label: "CS261 Software Project Tracker" },
    next: { key: "machine-learning", label: "CS342 Machine Learning" }
  },

  "machine-learning": {
    title: "CS342 Machine Learning",
    summary: "A project to implement the kernel trick for SVMs to solve a non-linearly separable dataset, and exploring concepts in machine learning, SVMs and the kernel trick - as well as proving it mathematically.",
    start: "2023-11",
    end: "2023-12",
    skills: ["Python", "Machine Learning", "Data Analysis"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "academic",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS342-Machine-Learning"},
      { icon: "../../assets/icons/document.svg", label: "Report", url: "./CS342_Machine_Learning.pdf" },
    ],
    markdown: "./md/machine-learning.md",
    prev: { key: "digital-forensics", label: "CS355 Digital Forensics" },
    next: { key: "graphics", label: "CS324 Graphics" }
  },

  "graphics": {
    title: "CS324 Graphics",
    summary: "A project to implement a simple 3D game using WebGL and three.js, exploring concepts in 3D graphics, rendering and shading.",
    start: "2023-11",
    end: "2024-01",
    skills: ["JavaScript", "three.js", "WebGL"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "academic",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS324-Graphics"},
      { icon: "../../assets/icons/document.svg", label: "Report", url: "./Report.pdf" }
    ],
    markdown: "./md/graphics.md",
    prev: { key: "machine-learning", label: "CS342 Machine Learning" },
    next: { key: "robotics", label: "CS313 Mobile Robotics" }
  },

  "robotics": {
    title: "CS313 Mobile Robotics",
    summary: "A project to program a robot to navigate a maze using ROS and Python, exploring concepts in robotics, ROS and pathfinding algorithms.",
    start: "2024-01",
    end: "2024-03",
    skills: ["Robotics", "Python", "ROS"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "academic",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/document.svg", label: "Report", url: "./CS313_Lab_Report.pdf" }
    ],
    markdown: "./md/robotics.md",
    prev: { key: "graphics", label: "CS324 Graphics" },
    next: { key: "simpleg", label: "SimpLeg" }
  },

  "simpleg": {
    title: "SimpLeg",
    summary: "A project to implement a simple LLM-powered text summarisation and simplification tool for UK legislation, using Python, Flask and the OpenAI API, exploring concepts in natural language processing, LLMs and web development.",
    start: "2023-10",
    end: "2024-04",
    skills: ["Python", "LLMs", "APIs", "Flask", "NLP"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "personal",
      meta: ["has-github"] 
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/SimpLeg"},
      { icon: "../../assets/icons/document.svg", label: "Report", url: "https://cdn.archie-harrodine.com/projects/simpleg/CS310_Project_Final_Report.pdf" },
      { icon: "../../assets/icons/document.svg", label: "Report", url: "https://cdn.archie-harrodine.com/projects/simpleg/CS310_Project_Progress_Report.pdf" },
      { icon: "../../assets/icons/document.svg", label: "Report", url: "https://cdn.archie-harrodine.com/projects/simpleg/CS310_Project_Final_Report.pdf" },
    ],
    markdown: "./md/simpleg.md",
    prev: { key: "graphics", label: "CS324 Graphics" },
    next: { key: "box-quest", label: "Box Quest" }
  },

  "box-quest": {
    title: "Box Quest",
    summary: "A project to design and implement a quick 2D game in Unity based on the World's Hardest Game, exploring concepts in game development, C# programming and level design.",
    start: "2024-06",
    end: "2024-09",
    skills: ["Unity", "C#", "Game Development"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "personal",
      meta: ["has-github", "has-website"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/Box-Quest"},
      { icon: "../../assets/icons/website.svg", label: "itch.io", url: "https://illuminarchie.itch.io/box-quest"},
    ],
    markdown: "./md/box-quest.md",
    prev: { key: "simpleg", label: "SimpLeg" },
    next: { key: "mario-map-project", label: "Mario Map Project" }
  },

  "mario-map-project": {
    title: "Mario Map Project",
    summary: "A project to create a comprehensive interactive map of the Mario universe using HTML, JavaScript and Tailwind CSS, exploring concepts in web development, data collection and visualisation.",
    start: "2024-02",
    end: "Ongoing",
    tags: {
      state: "wip",
      docState: "not-started",
      type: "personal",
      meta: ["has-github", "has-website"]
    },
    skills: ["HTML","JavaScript","Tailwind CSS","Krita"],
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/Mario-Map"},
      { icon: "../../assets/icons/website.svg", label: "Website", url: "./app" },
    ],
    markdown: "./md/mario-map-project.md",
    prev: { key: "box-quest", label: "Box Quest" },
    next: { key: "image-and-video", label: "CS413 Image and Video Analysis" }
  },

  "image-and-video": {
    title: "CS413 Image and Video Analysis",
    summary: "A project to complete various image analysis tasks, including road sign detection, blinds filtering, homographies and image segmentation.",
    start: "2024-11",
    end: "2025-01",
    skills: ["Python", "OpenCV", "Image Processing"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "academic",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS413-Image-and-Video"},
    ],
    markdown: "./md/image-and-video.md",
    prev: { key: "mario-map-project", label: "Mario Map Project" },
    next: { key: "optimisation", label: "CS416 Optimisation" }
  },

  "optimisation": {
    title: "CS416 Optimisation",
    summary: "A project to implement various optimisation algorithms to solve various mathematical problems, using gradient descent, Newton's method, taking Hessians, fractal roots and numerical methods",
    start: "2025-01",
    end: "2025-03",
    skills: ["Python", "Derivatives", "Numerical Methods"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "academic",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS416-Optimisation"},
    ],
    markdown: "./md/optimisation.md",
    prev: { key: "image-and-video", label: "CS413 Image and Video Analysis" },
    next: { key: "data-mining", label: "CS429 Data Mining" }
  },

  "data-mining": {
    title: "CS429 Data Mining",
    summary: "A project to explore data analysis and machine learning techniques to solve problems in classification of images and proteins.",
    start: "2025-01",
    end: "2025-03",
    skills: ["Python", "Machine Learning", "Deep Learning", "Neural Networks"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "academic",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS429-Data-Mining"},
    ],
    markdown: "./md/data-mining.md",
    prev: { key: "optimisation", label: "CS416 Optimisation" },
    next: { key: "terrainfinity", label: "TerraInfinity" }
  },

  "terrainfinity": {
    title: "TerraInfinity",
    summary: "A group project to implement a procedural terrain generation algorithm using various techniques with uber noise, DLA, Bezier river generation, etc. as well as using a custom renderer and engine with variable parameters.",
    start: "2024-10",
    end: "2025-04",
    skills: ["Python", "C++", "Procedural Generation", "Simplex Noise"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "personal",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/4th-year-group-project/Terra-Infinity"},
      { icon: "../../assets/icons/document.svg", label: "Project Specification", url: "https://cdn.archie-harrodine.com/projects/terrainfinity/Project_Specification.pdf"},
      { icon: "../../assets/icons/document.svg", label: "Project Report", url: "https://cdn.archie-harrodine.com/projects/terrainfinity/report.pdf"},
      { icon: "../../assets/icons/document.svg", label: "Progress Presentation", url: "https://cdn.archie-harrodine.com/projects/terrainfinity/4YP_Progress.pdf"},
      { icon: "../../assets/icons/document.svg", label: "Single Slide", url: "https://cdn.archie-harrodine.com/projects/terrainfinity/Poster.pdf"},
    ],
    markdown: "./md/terrainfinity.md",
    prev: { key: "data-mining", label: "CS429 Data Mining" },
    next: { key: "value-betting", label: "Value Betting" }
  },

  "value-betting": {
    title: "Value Betting",
    summary: "A project for using rpscrape to scrape data on Horse Racing and use Deep Set Neural Networks to predict the probability of a horse winning, and using this to find value bets and make a profit.",
    start: "2025-01",
    end: "Ongoing",
    skills: ["Python", "Data Analysis", "Web Scraping", "Pandas", "Neural Networks", "PyTorch"],
    tags: {
      state: "wip",
      docState: "not-started",
      type: "personal",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/ValueBettting"},
    ],
    markdown: "./md/value-betting.md",
    prev: { key: "terrainfinity", label: "TerraInfinity" },
    next: { key: "az900", label: "AZ900 Practice Exam" }
  },

  "az900": {
    title: "AZ900 Practice Exam",
    summary: "A project to create a practice exam for the AZ900 Microsoft Azure Fundamentals certification, using Python and web development to create a user-friendly interface for users to test their knowledge and prepare for the exam.",
    start: "2025-11",
    end: "2025-12",
    skills: ["Python", "Webscraping", "Web Development"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "personal",
      meta: ["has-github"]
    },
    links: [
      { icon: "../../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/AZ900-PractiseTest"},
    ],
    markdown: "./md/az900.md",
    prev: { key: "value-betting", label: "Value Betting" },
    next: { key: "ore-or-oar", label: "Ore or Oar" }
  },

  "ore-or-oar": {
    title: "Ore or Oar",
    summary: "A project to create a simple game which takes an image of an ore or an oar and zooms in on it, and the user has to guess whether it's an ore or an oar. Uses a simple CNN to classify the images, and a simple web interface to play the game.",
    start: "-",
    end: "-",
    skills: [],
    tags: {
      state: "planned",
      docState: "not-started",
      type: "personal",
      meta: []
    },
    links: [],
    markdown: "./md/ore-or-oar.md",
    prev: { key: "terrainfinity", label: "TerraInfinity" },
    next: { key: "erosion-filter", label: "Erosion Filter" }
  },

  "erosion-filter": {
    title: "Erosion Filter",
    summary: "A project to explore and implement a new erosion filter technique for procedural generation using rotated sin waves to creates gullies and ridges.",
    start: "-",
    end: "-",
    skills: [],
    tags: {
      state: "planned",
      docState: "not-started",
      type: "personal",
      meta: []
    },
    links: [],
    markdown: "./md/erosion-filter.md",
    prev: { key: "ore-or-oar", label: "Ore or Oar" },
    next: { key: "confetti-maker", label: "Confetti Maker" }
  },

  "confetti-maker": {
    title: "Confetti Maker",
    summary: "A project to create a simple confetti maker using JavaScript and HTML canvas, allowing users to create and customize their own confetti animations, able to export the confetti to their own website.",
    start: "-",
    end: "-",
    skills: [],
    tags: {
      state: "planned",
      docState: "not-started",
      type: "personal",
      meta: []
    },
    links: [],
    markdown: "./md/confetti-maker.md",
    prev: { key: "erosion-filter", label: "Erosion Filter" },
    next: { key: "tanks-game", label: "Tanks Game" }
  },

  "tanks-game": {
    title: "Tanks Game",
    summary: "A project to create a simple 3D tanks game using Three.js, based off of Wii Tanks, creating the first 20 levels of the game and implementing various mechanics such as the different enemy tanks, the ricochet mechanics, and the mine placing.",
    start: "-",
    end: "-",
    skills: [],
    tags: {
      state: "planned",
      docState: "not-started",
      type: "personal",
      meta: []
    },
    links: [],
    markdown: "./md/tanks-game.md",
    prev: { key: "confetti-maker", label: "Confetti Maker" },
    next: { key: "level-name-generator", label: "Level Name Generator" }
  },

  "level-name-generator": {
    title: "Mario Level Name Generator",
    summary: "A project to create a simple LLM-powered Mario level name generator, using LORA and PEFT to fine-tune a small LLM on a dataset of Mario level names, and using this to generate new level names based on user input.",
    start: "-",
    end: "-",
    skills: [],
    tags: {
      state: "planned",
      docState: "not-started",
      type: "personal",
      meta: []
    },
    links: [],
    markdown: "./md/level-name-generator.md",
    prev: { key: "tanks-game", label: "Tanks Game" },
    next: { key: "minecraft-mod", label: "Minecraft Mod" }
  },

  "minecraft-mod": {
    title: "Minecraft Mod",
    summary: "A project to create a simple Minecraft mod using Java and the Minecraft Forge API, adding new bosses and weapons to the game.",
    start: "-",
    end: "-",
    skills: [],
    tags: {
      state: "planned",
      docState: "not-started", 
      type: "personal",
      meta: []
    },
    links: [],
    markdown: "./md/minecraft-mod.md",
    prev: { key: "level-name-generator", label: "Level Name Generator" },
    next: { key: "godot-game", label: "Fire Emblem Game in Godot" }
  },

  "godot-game": {
    title: "Fire Emblem Game in Godot",
    summary: "A project to create a simple Fire Emblem style game using the Godot engine, implementing various mechanics such as the weapon triangle, turn-based combat and character classes.",
    start: "-",
    end: "-",
    skills: [],
    tags: {
      state: "planned",
      docState: "not-started",
      type: "personal",
      meta: []
    },
    links: [],
    markdown: "./md/godot-game.md",
    prev: { key: "minecraft-mod", label: "Minecraft Mod" },
    next: { key: "cpp-game-dev", label: "C++ Game Development" }
  },

  "cpp-game-dev": {
    title: "C++ Game Development",
    summary: "A project to create a simple first person shooter game using C++ and OpenGL, implementing various mechanics such as player movement, shooting and splatter mechanics",
    start: "-",
    end: "-",
    skills: [],
    tags: {
      state: "planned",
      docState: "not-started",
      type: "personal",
      meta: []
    },
    links: [],
    markdown: "./md/cpp-game-dev.md",
    prev: { key: "godot-game", label: "Fire Emblem Game in Godot" },
    next: { key: "mario-party-simulator", label: "Mario Party Simulator" }
   },

  "mario-party-simulator": {
    title: "Mario Party Simulator",
    summary: "A project to create a simple Mario Party style game using Python and Pygame, implementing various mechanics such as the board game mechanics, items, and CPU AI",
    start: "-",
    end: "-",
    skills: [],
    tags: {
      state: "planned",
      docState: "not-started",
      type: "personal",
      meta: []
    },
    links: [],
    markdown: "./md/mario-party-simulator.md",
    prev: { key: "cpp-game-dev", label: "C++ Game Development" },
    next: { key: "utils-page", label: "Utilities" }
   },

  "utils-page": {
    title: "Utilities",
    summary: "A project to create a simple page to host various utilities such as: a dice roller, a password generator, duck racing, quiz generator, etc.",
    start: "-",
    end: "-",
    skills: [],
    tags: {
      state: "planned",
      docState: "not-started",
      type: "personal",
      meta: []
    },
    links: [],
    markdown: "./md/utils-page.md",
    prev: { key: "mario-party-simulator", label: "Mario Party Simulator" },
    next: null
   }
};


// ore or oar
// proc gen with new method + unity
// confetti maker
// betting bot
// tanks game
// mario llm name generator
// minecraft mod 
// godot game: fire emblem
// c++ game dev
// mario party simulator

  // "key": {
  //   title: "",
  //   summary: "",
  //   start: "",
  //   end: "",
  //   skills: [],
  //   tags: {
  //     state: "",
  //     docState: "",
  //     type: "",
  //     meta: []
  //   },
  //   links: [
  //     { icon: "../assets/icons/github.svg", label: "", url: ""},
  //   ],
  //   markdown: "",
  //   prev: { key: "value-betting", label: "Value Betting" },
  //   next: null
  // },

// CDN means must be hosted online / not yet found
// Tags:
// - state: completed, wip, planned
// - doc state: completed, wip, not-started
// - type: academic, personal, work
// - meta: has-website, has-github

