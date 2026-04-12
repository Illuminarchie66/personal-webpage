// CDN means must be hosted online / not yet found
// Tags:
// - state: completed, in-progress, planned
// - doc state: completed, in-progress, not-started
// - type: coursework, personal, work
// - meta: has-website, has-github

const projects = {
  "geographic-centre": {
    title: "Centre of N points",
    summary: "A project to find the geographic centre of a set of points on the Earth's surface, using stochastic gradient descent and optimisation techniques.",
    start: "Feb 2020",
    end: "Mar 2021",
    skills: ["Python", "Calculus", "Optimisation", "Geometry", "HTML", "CSS", "JavaScript"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "personal",
      meta: ["has-website", "has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/Geographic-Centre" },
      { icon: "../assets/icons/document.svg", label: "Report", url: "./geographic-centre/CentreOfNPoints.pdf" },
      { icon: "../assets/icons/website.svg", label: "Website", url: "./geographic-centre" },
    ],
    markdown: "./geographic-centre/md/geographic-centre.md",
    prev: null,
    next: { key: "robotmaze", label: "CS118 Robot Maze" }
  },

  "epq": {
    title: "EPQ: Game Design",
    summary: "An Extended Project Qualification (EPQ) on game design, where I designed and developed a game in Unity, and wrote a report and journal on the process.",
    start: "Feb 2020",
    end: "Mar 2021",
    skills: ["Unity", "Game Design", "C#"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "personal",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "CDN" },
      { icon: "../assets/icons/document.svg", label: "Report", url: "CDN" },
      { icon: "../assets/icons/document.svg", label: "Journal", url: "CDN" },
    ],
    markdown: "./epq/md/epq.md",
    prev: { key: "geographic-centre", label: "Centre of N" },
    next: { key: "robotmaze", label: "CS118 Robot Maze" }
  },

  "robotmaze": {
    title: "CS118 Robot Maze",
    summary: "A project to program a robot to navigate a maze using various techniques, teaching the basics of OOP",
    start: "Oct 2021",
    end: "Dec 2021",
    skills: ["Java", "OOP", "Algorithms", "Djikstra's"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "coursework",
      meta: ["has-github"]
    },
    links: [{ icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS118-Robot-Maze" }],
    markdown: "./robot-maze/md/robot-maze.md",
    prev: { key: "geographic-centre", label: "Centre of N" },
    next: { key: "architecture", label: "CS132 Architecture" }
  },

  "architecture": {
    title: "CS132 Architecture",
    summary: "A project to design different parts of CPU architecture, and developing programs using C.",
    start: "Oct 2021",
    end: "Feb 2022",
    skills: ["C", "Assembly", "Computer Architecture"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "coursework",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS132-Computer-Architecture"},
      { icon: "../assets/icons/document.svg", label: "Coursework 1", url: "./architecture/CS132_Coursework_1.pdf" },
      { icon: "../assets/icons/document.svg", label: "Coursework 2", url: "./architecture/CS132_Coursework_2.pdf" }
    ],
    markdown: "./architecture/md/architecture.md",
    prev: { key: "robotmaze", label: "CS118 Robot Maze" },
    next: { key: "waffles", label: "CS126 Waffles" }
  },

  "waffles": {
    title: "CS126 Waffles",
    summary: "A project to design and implement a restaurant management system, teaching the basics of data structures and sorting algorithms to work with large amounts of data.",
    start: "Jan 2022",
    end: "Mar 2022",
    skills: ["Java", "Data Structures", "Algorithms", "Databases"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "coursework",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/Waffles"},
      { icon: "../assets/icons/document.svg", label: "Report", url: "./waffles/waffles.pdf" },
    ],
    markdown: "./waffles/md/waffles.md",
    prev: { key: "architecture", label: "CS132 Architecture" },
    next: { key: "hurdle", label: "CS141 Hurdle" }
  },

  "hurdle": {
    title: "CS141 Hurdle",
    summary: "A project to implement a functional programming solution for the Wordle game, exploring concepts in Haskell and developing a Wordle AI.",
    start: "Jan 2022",
    end: "Feb 2022",
    skills: ["Functional Programming", "Haskell", "Wordle", "AI"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "coursework",
      meta: ["has-github", "has-website"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS141-Hurdle"},
      { icon: "../assets/icons/document.svg", label: "Feedback", url: "./hurdle/feedback.pdf" },
      { icon: "../assets/icons/website.svg", label: "Wordle", url: "./hurdle" },
    ],
    markdown: "./hurdle/md/hurdle.md",
    prev: { key: "waffles", label: "CS126 Waffles" },
    next: { key: "onaf", label: "ONAF" }
  },

  "onaf": {
    title: "One Night at Freddy's",
    summary: "A project to implement Five Nights at Freddy's in Haskell, exploring functional programming and game development concepts.",
    start: "Feb 2022",
    end: "Mar 2022",
    skills: ["Functional Programming", "Haskell", "Game Development"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "coursework",
      meta: ["has-github", "has-website"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS141-Functional-ONAF"},
      { icon: "../assets/icons/document.svg", label: "Report", url: "./onaf/report.pdf" },
      { icon: "../assets/icons/document.svg", label: "Feedback", url: "./onaf/feedback.pdf" },
    ],
    markdown: "./onaf/md/onaf.md",
    prev: { key: "hurdle", label: "CS141 Hurdle" },
    next: { key: "os-and-networks", label: "CS241 OS & Networks" }
  },

  "os-and-networks": {
    title: "CS241 OS & Networks",
    summary: "A project to explore packet sniffing, network protocols and using threading in programs.",
    start: "Oct 2022",
    end: "Dec 2022",
    skills: ["C", "Networking", "Operating Systems"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "coursework",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS241-OS-and-Networks"},
      { icon: "../assets/icons/document.svg", label: "Report", url: "./os-and-networks/report.pdf" },
    ],
    markdown: "./os-and-networks/md/os-and-networks.md",
    prev: { key: "onaf", label: "One Night at Freddy's" },
    next: { key: "databases", label: "CS258 Databases" }
  },

  "databases": {
    title: "CS258 Databases",
    summary: "A project to design and implement a database system for gigs, acts, venues and customers. Uses PostgreSQL and JDBC to create a fully functional database system, and explores concepts in database design and SQL.",
    start: "Oct 2022",
    end: "Jan 2023",
    skills: ["SQL", "Database Design", "Java"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "coursework",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS258-Databases"},
    ],
    markdown: "./databases/md/databases.md",
    prev: { key: "os-and-networks", label: "CS241 OS & Networks" },
    next: { key: "ai", label: "CS255 AI" }
  },

  "ai": {
    title: "CS255 Artificial Intelligence",
    summary: "A project to implement AI algorithms to solve a CSP problem of performing comedians, using backtracking and simulated annealing, while exploring concepts in AI, search algorithms and heuristics.",
    start: "Jan 2023",
    end: "Feb 2023",
    skills: ["Python", "AI", "Search Algorithms", "Monte Carlo"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "coursework",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS255-Artificial-Intelligence"},
    ],
    markdown: "./ai/md/ai.md",
    prev: { key: "databases", label: "CS258 Databases" },
    next: { key: "formal-languages", label: "CS259 Formal Languages" }
  },

  "formal-languages": {
    title: "CS259 Formal Languages",
    summary: "A project to implement a simple compiler for a functional programming language, exploring concepts in automata theory, parsing and compiler design - implemented with JavaCC.",
    start: "Jan 2023",
    end: "Mar 2023",
    skills: ["Java", "Automata Theory", "Compilers"],
    tags: {
      state: "completed",
      docState: "completed",
      type: "coursework",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/document.svg", label: "Program", url: "./formal-languages/Assignment.jj" },
    ],
    markdown: "./formal-languages/md/formal-languages.md",
    prev: { key: "ai", label: "CS255 Artificial Intelligence" },
    next: { key: "software-project-tracker", label: "CS261 Software Project Tracker" }
  },

  "software-project-tracker": {
    title: "CS261 Deutche Bank Software Project Tracker",
    summary: "A group project to design and implement a software project tracker for Deutsche Bank, using model view controller architecture for frontend, backend and database.",
    start: "Oct 2022",
    end: "Apr 2023",
    skills: ["Python", "ML", "Jira", "Agile", "Flask", "NoSQL"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "coursework",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: ""},
      { icon: "../assets/icons/document.svg", label: "Requirements", url: "./software-project-tracker/CS261_Requirements_Analysis.pdf" },
      { icon: "../assets/icons/document.svg", label: "Design", url: "./software-project-tracker/CS261_Planning_And_Design.pdf" },
      { icon: "../assets/icons/document.svg", label: "Report", url: "./software-project-tracker/CS261_Final_Report.pdf" },
    ],
    markdown: "./software-project-tracker/md/software-project-tracker.md",
    prev: { key: "formal-languages", label: "CS259 Formal Languages" },
    next: { key: "digital-forensics", label: "CS355 Digital Forensics" }
  },

  "digital-forensics": {
    title: "CS355 Digital Forensics",
    summary: "A project to complete various labs on different images, using MatLab and image processing techniques.",
    start: "Nov 2023",
    end: "Jan 2024",
    skills: ["MatLab", "Image Processing"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "coursework",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS355-Digital-Forensics"},
      { icon: "../assets/icons/document.svg", label: "Report 1", url: "./digital-forensics/CS355_Report_1.pdf" },
      { icon: "../assets/icons/document.svg", label: "Report 2", url: "./digital-forensics/CS355_Report_2.pdf" },
    ],
    markdown: "./digital-forensics/md/digital-forensics.md",
    prev: { key: "software-project-tracker", label: "CS261 Software Project Tracker" },
    next: { key: "machine-learning", label: "CS342 Machine Learning" }
  },

  "machine-learning": {
    title: "CS342 Machine Learning",
    summary: "A project to implement the kernel trick for SVMs to solve a non-linearly separable dataset, and exploring concepts in machine learning, SVMs and the kernel trick - as well as proving it mathematically.",
    start: "Nov 2023",
    end: "Dec 2023",
    skills: ["Python", "Machine Learning", "Data Analysis"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "coursework",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS342-Machine-Learning"},
      { icon: "../assets/icons/document.svg", label: "Report", url: "./machine-learning/CS342_Machine_Learning.pdf" },
    ],
    markdown: "./machine-learning/md/machine-learning.md",
    prev: { key: "digital-forensics", label: "CS355 Digital Forensics" },
    next: { key: "graphics", label: "CS324 Graphics" }
  },

  "graphics": {
    title: "CS324 Graphics",
    summary: "A project to implement a simple 3D game using WebGL and three.js, exploring concepts in 3D graphics, rendering and shading.",
    start: "Nov 2023",
    end: "Jan 2024",
    skills: ["JavaScript", "three.js", "WebGL"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "coursework",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS324-Graphics"},
      { icon: "../assets/icons/document.svg", label: "Report", url: "./graphics/Report.pdf" }
    ],
    markdown: "./graphics/md/graphics.md",
    prev: { key: "machine-learning", label: "CS342 Machine Learning" },
    next: { key: "robotics", label: "CS313 Mobile Robotics" }
  },

  "robotics": {
    title: "CS313 Mobile Robotics",
    summary: "A project to program a robot to navigate a maze using ROS and Python, exploring concepts in robotics, ROS and pathfinding algorithms.",
    start: "Jan 2024",
    end: "Mar 2024",
    skills: ["Robotics", "Python", "ROS"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "coursework",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/document.svg", label: "Report", url: "./robotics/CS313_Lab_Report.pdf" }
    ],
    markdown: "./robotics/md/robotics.md",
    prev: { key: "graphics", label: "CS324 Graphics" },
    next: { key: "simpleg", label: "SimpLeg" }
  },

  "simpleg": {
    title: "SimpLeg",
    summary: "A project to implement a simple LLM-powered text summarisation and simplification tool for UK legislation, using Python, Flask and the OpenAI API, exploring concepts in natural language processing, LLMs and web development.",
    start: "Oct 2023",
    end: "Apr 2024",
    skills: ["Python", "LLMs", "APIs", "Flask", "NLP"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "personal",
      meta: ["has-github"] 
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/SimpLeg"},
      { icon: "../assets/icons/document.svg", label: "Report", url: "./simpleg/CS310_Project_Specification.pdf" },
      { icon: "../assets/icons/document.svg", label: "Report", url: "./simpleg/CS310_Project_Progress_Report.pdf" },
      { icon: "../assets/icons/document.svg", label: "Report", url: "./simpleg/CS310_Project_Final_Report.pdf" },
    ],
    markdown: "./simpleg/md/simpleg.md",
    prev: { key: "graphics", label: "CS324 Graphics" },
    next: { key: "box-quest", label: "Box Quest" }
  },

  "box-quest": {
    title: "Box Quest",
    summary: "A project to design and implement a quick 2D game in Unity based on the World's Hardest Game, exploring concepts in game development, C# programming and level design.",
    start: "Jun 2024",
    end: "Sep 2024",
    skills: ["Unity", "C#", "Game Development"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "personal",
      meta: ["has-github", "has-website"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/Box-Quest"},
      { icon: "../assets/icons/website.svg", label: "itch.io", url: "https://illuminarchie.itch.io/box-quest"},
    ],
    markdown: "./box-quest/md/box-quest.md",
    prev: { key: "simpleg", label: "SimpLeg" },
    next: { key: "mario-map-project", label: "Mario Map Project" }
  },

  "mario-map-project": {
    title: "Mario Map Project",
    summary: "A project to create a comprehensive interactive map of the Mario universe using HTML, JavaScript and Tailwind CSS, exploring concepts in web development, data collection and visualisation.",
    start: "Feb 2024",
    end: "Ongoing",
    tags: {
      state: "in-progress",
      docState: "not-started",
      type: "personal",
      meta: ["has-github", "has-website"]
    },
    skills: ["HTML","JavaScript","Tailwind CSS","Krita"],
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/Mario-Map"},
      { icon: "../assets/icons/website.svg", label: "Website", url: "./mario-map-project" },
    ],
    markdown: "./mario-map-project/md/mario-map-project.md",
    prev: { key: "box-quest", label: "Box Quest" },
    next: { key: "image-and-video", label: "CS413 Image and Video Analysis" }
  },

  "image-and-video": {
    title: "CS413 Image and Video Analysis",
    summary: "A project to complete various image analysis tasks, including road sign detection, blinds filtering, homographies and image segmentation.",
    start: "Nov 2024",
    end: "Jan 2025",
    skills: ["Python", "OpenCV", "Image Processing"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "coursework",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS413-Image-and-Video"},
    ],
    markdown: "./image-and-video/md/image-and-video.md",
    prev: { key: "mario-map-project", label: "Mario Map Project" },
    next: { key: "optimisation", label: "CS416 Optimisation" }
  },

  "optimisation": {
    title: "CS416 Optimisation",
    summary: "A project to implement various optimisation algorithms to solve various mathematical problems, using gradient descent, Newton's method, taking Hessians, fractal roots and numerical methods",
    start: "Jan 2025",
    end: "Mar 2025",
    skills: ["Python", "Derivatives", "Numerical Methods"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "coursework",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS416-Optimisation"},
    ],
    markdown: "./optimisation/md/optimisation.md",
    prev: { key: "image-and-video", label: "CS413 Image and Video Analysis" },
    next: { key: "data-mining", label: "CS429 Data Mining" }
  },

  "data-mining": {
    title: "CS429 Data Mining",
    summary: "A project to explore data analysis and machine learning techniques to solve problems in classification of images and proteins.",
    start: "Jan 2025",
    end: "Mar 2025",
    skills: ["Python", "Machine Learning", "Deep Learning", "Neural Networks"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "coursework",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS429-Data-Mining"},
    ],
    markdown: "./data-mining/md/data-mining.md",
    prev: { key: "optimisation", label: "CS416 Optimisation" },
    next: { key: "terrainfinity", label: "TerraInfinity" }
  },

  "terrainfinity": {
    title: "TerraInfinity",
    summary: "A group project to implement a procedural terrain generation algorithm using various techniques with uber noise, DLA, Bezier river generation, etc. as well as using a custom renderer and engine with variable parameters.",
    start: "Oct 2024",
    end: "Apr 2025",
    skills: ["Python", "C++", "Procedural Generation", "Simplex Noise"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "personal",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/4th-year-group-project/Terra-Infinity"},
      { icon: "../assets/icons/document.svg", label: "Project Specification", url: "CDN"},
      { icon: "../assets/icons/document.svg", label: "Project Report", url: "CDN"},
      { icon: "../assets/icons/document.svg", label: "Progress Presentation", url: "CDN"},
      { icon: "../assets/icons/document.svg", label: "Single Slide", url: "CDN"},
    ],
    markdown: "./terrainfinity/md/terrainfinity.md",
    prev: { key: "data-mining", label: "CS429 Data Mining" },
    next: { key: "value-betting", label: "Value Betting" }
  },

  "value-betting": {
    title: "Value Betting",
    summary: "A project for using rpscrape to scrape data on Horse Racing and use Deep Set Neural Networks to predict the probability of a horse winning, and using this to find value bets and make a profit.",
    start: "Jan 2025",
    end: "Ongoing",
    skills: ["Python", "Data Analysis", "Web Scraping", "Pandas", "Neural Networks", "PyTorch"],
    tags: {
      state: "in-progress",
      docState: "not-started",
      type: "personal",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/ValueBettting"},
    ],
    markdown: "./value-betting/md/value-betting.md",
    prev: { key: "terrainfinity", label: "TerraInfinity" },
    next: { key: "az900", label: "AZ900 Practice Exam" }
  },

  "az900": {
    title: "AZ900 Practice Exam",
    summary: "A project to create a practice exam for the AZ900 Microsoft Azure Fundamentals certification, using Python and web development to create a user-friendly interface for users to test their knowledge and prepare for the exam.",
    start: "Nov 2025",
    end: "Dec 2025",
    skills: ["Python", "Webscraping", "Web Development"],
    tags: {
      state: "completed",
      docState: "not-started",
      type: "personal",
      meta: ["has-github"]
    },
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/AZ900-PractiseTest"},
    ],
    markdown: "./az900/md/az900.md",
    prev: { key: "value-betting", label: "Value Betting" },
    next: null
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
    markdown: "",
    prev: null,
    next: null
  },

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