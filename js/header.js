document.addEventListener("DOMContentLoaded", () => {
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
    console.log(window.location.pathname);

    const sidetitle = document.getElementById("side-title");
    sidetitle.textContent = randomTitle;

    const home_button = document.getElementById("home-button");
    home_button.addEventListener("click", (e) => {
        if (window.location.pathname === "/") {
            e.stopPropagation(); 
            randomTitle = titles[Math.floor(Math.random() * titles.length)];
            sidetitle.textContent = randomTitle;
        } else {
            window.location.href = "/";
        }
        
    });

    const project_button = document.getElementById("projects-button");
    const project_menu = document.getElementById("projects-menu");
    project_button.addEventListener("click", (e) => {
        e.stopPropagation(); 
        project_menu.classList.toggle("hidden");
    });
    document.addEventListener("click", () => {
        project_menu.classList.add("hidden");
    });

    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("mobile-menu");

    if (!toggle || !menu) return;

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

});