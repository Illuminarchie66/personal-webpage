/* Imports */

import { setPrimaryColor, getRandomColor, setTheme } from './colors.js';


/* Initialize header interactions */

function initHeader() {
  /* Rotating title options */
  const titles = [
    "Personal Website",
    "Eat lettuce with your bread!",
    "Play Minecraft!",
    "LGBTQ+ Rights",
    "The best website ever",
    "Delta on my Rune",
    "Shall we play a game?",
    "Love and be Loved!",
    "abc or 123?",
    "System.println('Hello, World!')",
    "Oh its you!"
  ];

  /* Get side title element */
  const sideTitle = document.getElementById("side-title");
  if (!sideTitle) return;

  /* Pick and set initial random title */
  let currentTitle = titles[Math.floor(Math.random() * titles.length)];
  sideTitle.textContent = currentTitle;


  /* Handle home button behavior */
  document.querySelectorAll('.home-button').forEach(button => {
    button.addEventListener("click", (e) => {
      /* If already on homepage, just rotate title */
      if (window.location.pathname === "/") {
        e.stopPropagation();
        currentTitle = titles[Math.floor(Math.random() * titles.length)];
        sideTitle.textContent = currentTitle;
      } else {
        window.location.href = "/";
      }
    });
  });


  /* Theme toggle (light / dark) */
  document.querySelectorAll('.theme-toggle').forEach(toggle => {
    toggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "light" : "dark");
    });
  });


  /* Random primary color toggle */
  document.querySelectorAll('.color-toggle').forEach(toggle => {
    toggle.addEventListener("click", () => {
      setPrimaryColor(getRandomColor());
    });
  });


  /* Mobile menu elements */
  const toggleBtn = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");

  if (!toggleBtn || !menu) return;


  /* Toggle mobile menu open/close */
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const isOpen = menu.classList.contains("open");
    menu.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", String(!isOpen));
  });


  /* Close menu when clicking outside */
  document.addEventListener("click", (e) => {
    if (
      menu.classList.contains("open") &&
      !menu.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      menu.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });


  /* Reset menu on desktop resize */
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      menu.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });
}


/* Load header HTML and initialize */

document.addEventListener("DOMContentLoaded", () => {
  fetch('../../components/header.html')
    .then(res => res.text())
    .then(html => {
      const headerEl = document.getElementById('header');
      if (!headerEl) return;

      headerEl.innerHTML = html;
      initHeader();
    })
    .catch(err => {
      console.error("Failed to load header:", err);
    });
});