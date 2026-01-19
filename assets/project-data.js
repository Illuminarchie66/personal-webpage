const projects = {
  project1: {
    title: "Awesome Math Project",
    start: "Jan 2023",
    end: "Mar 2023",
    skills: ["Python", "NumPy", "Tailwind"],
    github: "https://github.com/username/project1",
    other: { label: "Dissertation PDF", url: "/downloads/project1.pdf" },
    content: `
# Overview

This project involved solving interesting math problems.

## Code Example

\`\`\`python
import numpy as np
print("Hello world")
\`\`\`

$x = 1+1$

Inline math: $E = mc^2$  

Block math: 
$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$
`,
    prev: null,
    next: { key: "project2", label: "Next Project" }
  },

  project2: {
    title: "Another Cool Project",
    start: "Apr 2023",
    end: "Jun 2023",
    skills: ["JavaScript", "D3.js"],
    github: "https://github.com/username/project2",
    other: null,
    content: `
# Introduction

Markdown content for project 2.
`,
    prev: { key: "project1", label: "Previous Project" },
    next: null
  }
};
