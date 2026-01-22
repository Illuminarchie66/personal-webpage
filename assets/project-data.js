const projects = {
  "geographic-centre": {
    title: "Centre of N points",
    start: "Feb 2020",
    end: "Mar 2021",
    skills: ["Python", "Calculus", "Optimisation", "Geometry", "HTML", "CSS", "JavaScript"],
    github: "https://github.com/Illuminarchie66/Geographic-Centre",
    other: { label: "Website", url: ".." },
    content: `
# Introduction
The Centre of N Points was my A-Level Computer Science coursework project, a weave of Mathematics and Computing to explore a problem that fascinated me. Given $n$ points in some space $S$, what is the point in $S$ that is equidistant from from all those points. Right now that seems vague and poorly defined, and thats because it is ! The original problem was spurred on from an issue me and my family were having: we are scattered across the UK, where would be a location to meet such that each party would have to travel an equal distance to travel to arrive at that location. Furthermore, what would be a location that would be an equal distance to travel whilst also minimizing the total distance that all parties have to travel. At the time, I was learning Djikstra's algorithm and A*; as well as learning the basics of 3D geometry and calculus. Thus, I pursued this problem for my A-Level project.

This involved a deep exploration into mathematics and optimisation. The original project was created with PyQt5 for the interface; but later I engineered this to work on my website in Python (for a Flask server backend) and then in raw JavaScript. This achieved an A* for my A-Level coursework, and you can download the original word document I wrote [here](/downloads/blah.word). 

# Design
## Problem Breakdown
The original problem of finding a location of equal distance to travel to in our world was too defined and bounded by the complexities of real world travel. Thus, we abstracted away the information to reduce it to a more mathematical formulation. Given $n$ points ($\\text{s.t.} n > 0$), we shall call vertices $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\ldots \\mathbf{v}_n\\}$, in some space $S$, we want to find $\\mathbf{c} \\in S$, such that distance $\\ell: S^2 \\rightarrow \\mathbb{R}$ between $\\mathbf{v}_i$ and $\\mathbf{c} = k \\in \\mathbb{R} \\forall i$. When we refer to a space, we mean some way that the vertices can be traversed to one and other; for our purposes we look at three spaces: a graph $G=(V,E)$, continuous Euclidean $\\mathbb{R}^n$ and polar $(r, \\phi, \\theta)$. <br> <br>

In our definition of what we are aiming for, it assumes that there is some singular distance $k$ that exists which is equal for all vertices to the centre. However, there isn't always a guarantee of this. Hence, we refraim this as a minimisation problem. Since the goal is to achieve equidistance, an equivalent idea is to have the distances be as similar as possible. Let us have the set of distances $k_1, k_2, \\ldots k_n$ where $k_i = \\ell(\\mathbf{v}\\_i, \\mathbf{c} )$ , ideally we want $k_1 = k_2 = \\dots = k_n$ however in cases where this is not possible, we want them to be a close together as possible. There are a few possible metrics we could use for this, but the most apt is variance. 

$$\\sigma = \\frac{\\sum_{i=0}^{n} (k_i - \\mu)^2}{n} = \\frac{\\sum_{i=0}^{n} k_i^2}{n} - \\left(\\frac{\\sum_{i=0}^n k_i}{n}\\right)^2$$

Minimising the mean or median of the distances is also viable, however that is cluster centrality, as opposed to equidistance. Thus our goal is to find $\\mathbf{c} \\in S$ such that $\\sigma$ is minimised.

## Discrete Graph
Let $G=(V,E)$, where vertex $\\mathbf{v}_i, \\mathbf{c} \\in V$. We define distance $\\ell(\\mathbf{v}_a \\rightarrow \\mathbf{v}_b)$ as the sum of weights of the edges for a given path $P$ between vertices $\\mathbf{v}_a$ and $\\mathbf{v}_b$. If we do not impose restrictions though we run into issues. If we allow for any path between two vertices, there are infinitely many paths (due to cycles) and thus the distance is undefined. If we restrict to simple paths (no vertices visited more than once), then the problem becomes NP-Hard. This is because our objective now requires us to consider all paths. Lets consider the case of 2 vertices $\\mathbf{v}_1, \\mathbf{v}_2$ and a candidate centre $\\mathbf{c}$. We want to find a simple path $P_1: \\mathbf{v}_1 \\rightarrow \\mathbf{c}$ and $P_2: \\mathbf{v}_2 \\rightarrow \\mathbf{c}$ such that the distances are as close to equal as possible, thus our goal is:

$$\\min_{\\mathbf{c}, P_1, P_2} (\\ell(P_1) - \\ell(P_2))^2$$

There are $|V|!$ possible simple paths for each vertex, and we would need to consider it for all pairs of vertices and all possible centres, so naively $O(|V|^2)$ for two vertices. While there may be better approaches with dynamic programming, we can see this problem likely is NP-Hard as we can reduce it to the problem "Is there a simple path of length $k$ between vertices $\\mathbf{v}_a$ and $\\mathbf{v}_b$" (the [longest path problem](https://en.wikipedia.org/wiki/Longest_path_problem)). Therefore, we impose another restriction, that we only consider shortest paths between vertices. This allows us to use Djikstra's or A* to compute the shortest path between two vertices in polynomial time. Thus our objective becomes:

$$\\min_{\\mathbf{c} \\in V} \\sigma(\\{\\ell_{sp}(\\mathbf{v}_i, \\mathbf{c}) | i = 1 \\ldots n\\})$$

Where $\\ell_{sp}$ is the shortest path distance between two vertices. This can be computed in $O(n (|E| + |V| \\log |V|))$ time using Djikstra's algorithm from each vertex to the candidate centre. For each vertex we run Djikstra's, and so each node gets a list of distances to each candidate centre. We can then compute the variance (or any other metric) in $O(n)$ time for each candidate centre. We considered this approach for implementation, however due to the costs of using Google APIs for geographic graph mapping data, we only implemented it on simple graphs. 

## Euclidean Space
- definition of distance
- geometric interpretation 
- midpoint of a line 
- centre of 3 points with triangle / circle equation
- calculus approach for n points with partial derivatives 
- cicle fitting approach
- euclidean doesnt map to real world well

## Polar Space
- definition of distance
- spherical coordinates
- midpoint of a great circle
- centre of 3 points on a sphere with plane equations
- calculus approach for n points with partial derivatives
- latitude/longitude to location mapping

# Implementation
- brief overview of code structure, classes, etc
- original pyqt5 app
- javascript implementation for website

# Evaluation
- using
- convergence
- limitations
- what i would like to do next / add
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
