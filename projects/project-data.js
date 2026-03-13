const projects = {
  "geographic-centre": {
    title: "Centre of N points",
    start: "Feb 2020",
    end: "Mar 2021",
    skills: ["Python", "Calculus", "Optimisation", "Geometry", "HTML", "CSS", "JavaScript"],
    links: [
      { icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/Geographic-Centre" },
      { icon: "../assets/icons/document.svg", label: "Doc", url: "./geographic-centre/CentreOfNPoints.pdf" },
      { icon: "../assets/icons/website.svg", label: "Website", url: "./geographic-centre" },
    ],
    markdown: "./geographic-centre/md/geographic-centre.md",
    prev: null,
    next: { key: "robotmaze", label: "CS118 Robot Maze" }
  },

  "robotmaze": {
    title: "CS118 Robot Maze",
    start: "Oct 2021",
    end: "Dec 2021",
    skills: ["Java", "OOP", "Algorithms", "Djikstra's"],
    links: [{ icon: "../assets/icons/github.svg", label: "GitHub", url: "https://github.com/Illuminarchie66/CS118-Robot-Maze" }],
    markdown: "./robot-maze/md/robot-maze.md",
    prev: { key: "geographic-centre", label: "Centre of N" },
    next: { key: "architecture", label: "CS132 Architecture" }
  },

  "architecture": {
    title: "CS132 Architecture",
    start: "Oct 2021",
    end: "Feb 2022",
    skills: ["C", "Assembly", "Computer Architecture"],
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
    start: "Jan 2022",
    end: "Mar 2022",
    skills: ["Java", "Data Structures", "Algorithms", "Databases"],
    github: "",
    other: null,
    content: `
# Introduction
`,
    prev: { key: "architecture", label: "CS132 Architecture" },
    next: { key: "hurdle", label: "CS141 Hurdle" }
  },

  "hurdle": {
    title: "CS141 Hurdle",
    start: "Jan 2022",
    end: "Feb 2022",
    skills: ["Functional Programming", "Haskell", "Wordle", "AI"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "waffles", label: "CS126 Waffles" },
    next: { key: "onaf", label: "ONAF" }
  },

  "onaf": {
    title: "One Night at Freddy's",
    start: "Feb 2022",
    end: "Mar 2022",
    skills: ["Functional Programming", "Haskell", "Game Development"],
    github: "",
    other: null,
    content: `
# Introduction
`,
    prev: { key: "hurdle", label: "CS141 Hurdle" },
    next: { key: "os-and-networks", label: "CS241 OS & Networks" }
  },

  "os-and-networks": {
    title: "CS241 OS & Networks",
    start: "Oct 2022",
    end: "Dec 2022",
    skills: ["C", "Networking", "Operating Systems"],
    github: "",
    other: null,
    content: `
# Introduction
`,
    prev: { key: "onaf", label: "One Night at Freddy's" },
    next: { key: "databases", label: "CS258 Databases" }
  },

  "databases": {
    title: "CS258 Databases",
    start: "Oct 2022",
    end: "Jan 2023",
    skills: ["SQL", "Database Design"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "os-and-networks", label: "CS241 OS & Networks" },
    next: { key: "ai", label: "CS255 AI" }
  },

  "ai": {
    title: "CS255 Artificial Intelligence",
    start: "Jan 2023",
    end: "Feb 2023",
    skills: ["Python", "AI", "Search Algorithms", "Monte Carlo"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "databases", label: "CS258 Databases" },
    next: { key: "formal-languages", label: "CS259 Formal Languages" }
  },

  "formal-languages": {
    title: "CS259 Formal Languages",
    start: "Jan 2023",
    end: "Mar 2023",
    skills: ["Java", "Automata Theory", "Compilers"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "ai", label: "CS255 Artificial Intelligence" },
    next: { key: "project-tracker", label: "Project Tracker" }
  },

  "project-tracker": {
    title: "Deutche Bank Project Tracker",
    start: "Jan 2023",
    end: "Apr 2023",
    skills: ["Python", "ML", "Jira", "Agile", "Flask", "NoSQL"],
    github: "",
    other: null,
    content: `
# Introduction
`,
    prev: { key: "formal-languages", label: "CS259 Formal Languages" },
    next: { key: "digital-forensics", label: "CS355 Digital Forensics" }
  },

  "digital-forensics": {
    title: "CS355 Digital Forensics",
    start: "Nov 2023",
    end: "Jan 2024",
    skills: ["MatLab", "Image Processing"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "project-tracker", label: "Deutche Bank Project Tracker" },
    next: { key: "machine-learning", label: "CS342 Machine Learning" }
  },

  "machine-learning": {
    title: "CS342 Machine Learning",
    start: "Nov 2023",
    end: "Dec 2023",
    skills: ["Python", "Machine Learning", "Data Analysis"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "digital-forensics", label: "CS355 Digital Forensics" },
    next: { key: "graphics", label: "CS324 Graphics" }
  },

  "graphics": {
    title: "CS324 Graphics",
    start: "Nov 2023",
    end: "Jan 2024",
    skills: ["JavaScript", "three.js", "WebGL"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "machine-learning", label: "CS342 Machine Learning" },
    next: { key: "simpleg", label: "SimpLeg" }
  },

  "simpleg": {
    title: "SimpLeg",
    start: "Oct 2023",
    end: "Apr 2024",
    skills: ["Python", "LLMs", "APIs", "Flask", "NLP"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "graphics", label: "CS324 Graphics" },
    next: { key: "box-quest", label: "Box Quest" }
  },

  "box-quest": {
    title: "Box Quest",
    start: "Jun 2024",
    end: "Sep 2024",
    skills: ["Unity", "C#", "Game Development"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "simpleg", label: "SimpLeg" },
    next: { key: "mario-map-project", label: "Mario Map Project" }
  },

  "mario-map-project": {
    title: "Mario Map Project",
    start: "Feb 2024",
    end: "Ongoing",
    skills: ["HTML","JavaScript","Tailwind CSS","Krita"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "box-quest", label: "Box Quest" },
    next: { key: "image-and-video", label: "CS413 Image and Video Analysis" }
  },

  "image-and-video": {
    title: "CS413 Image and Video Analysis",
    start: "Nov 2024",
    end: "Jan 2025",
    skills: ["Python", "OpenCV", "Image Processing"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "mario-map-project", label: "Mario Map Project" },
    next: { key: "optimisation", label: "CS416 Optimisation" }
  },

  "optimisation": {
    title: "CS416 Optimisation",
    start: "Jan 2025",
    end: "Mar 2025",
    skills: ["Python", "Derivatives", "Numerical Methods"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "image-and-video", label: "CS413 Image and Video Analysis" },
    next: { key: "data-mining", label: "CS429 Data Mining" }
  },

  "data-mining": {
    title: "CS429 Data Mining",
    start: "Jan 2025",
    end: "Mar 2025",
    skills: ["Python", "Machine Learning", "Deep Learning", "Neural Networks"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "optimisation", label: "CS416 Optimisation" },
    next: { key: "terrainfinity", label: "TerraInfinity" }
  },

  "terrainfinity": {
    title: "TerraInfinity",
    start: "Oct 2024",
    end: "Apr 2025",
    skills: ["Python", "C++", "Procedural Generation", "Simplex Noise"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "data-mining", label: "CS429 Data Mining" },
    next: { key: "value-betting", label: "Value Betting" }
  },

  "value-betting": {
    title: "Value Betting",
    start: "Jan 2025",
    end: "Ongoing",
    skills: ["Python", "Data Analysis", "Web Scraping", "Pandas", "Neural Networks", "PyTorch"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "terrainfinity", label: "TerraInfinity" },
    next: { key: "az900", label: "AZ900 Practice Exam" }
  },

  "az900": {
    title: "AZ900 Practice Exam",
    start: "Nov 2025",
    end: "Dec 2025",
    skills: ["Python", "Webscraping", "Web Development"],
    github: "",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "value-betting", label: "Value Betting" },
    next: null
  },

};
