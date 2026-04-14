import { setPrimaryColor, getRandomColor, setTheme } from './colors.js';

function initHeader() {
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

    let randomTitle = titles[Math.floor(Math.random() * titles.length)];

    const sidetitle = document.getElementById("side-title");
    sidetitle.textContent = randomTitle;

    document.querySelectorAll('.home-button').forEach(home_button => {
        home_button.addEventListener("click", (e) => {
            if (window.location.pathname === "/") {
                e.stopPropagation(); 
                randomTitle = titles[Math.floor(Math.random() * titles.length)];
                sidetitle.textContent = randomTitle;
            } else {
                window.location.href = "/";
            }
        });
    });

    document.querySelectorAll('.theme-toggle').forEach(themeToggle => {
        themeToggle.addEventListener("click", () => {
            const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            setTheme(newTheme);
        });
    });

    document.querySelectorAll('.color-toggle').forEach(colorToggle => {
        colorToggle.addEventListener("click", () => {
            const randomColor = getRandomColor();
            setPrimaryColor(randomColor);
        });
    });

    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("mobile-menu");

    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains("open");
        menu.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(!isOpen));
    });

    document.addEventListener("click", (e) => {
        if (
            !menu.contains(e.target) &&
            !toggle.contains(e.target) &&
            menu.classList.contains("open")
        ) {
            menu.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
            menu.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetch('../../components/header.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
            initHeader();
        });
});