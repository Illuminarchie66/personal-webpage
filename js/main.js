$(document).ready(function() {
    const container = $('#name');

    function setTextInstant(text) {
        container.empty(); 
        container.text(text); 
    }

    function animateText(text) {
        container.empty(); 
        for (let i = 0; i < text.length; i++) {
            let span = $('<span class="letter">' + text[i] + '</span>');
            container.append(span);
        }

        setTimeout(function () {
            $('.letter').each(function (index) {
                $(this).delay(index * 100).animate({ opacity: 1 }, 100, function () {
                    if (index === $('.letter').length - 1) {

                        observeOnScroll('.fade-up-target', 'fade-in-up');
                        observeOnScroll('.fade-left-target', 'fade-in-left');
                        observeOnScroll('.fade-right-target', 'fade-in-right');
                    }
                });
            });
        }, 350);
    }

    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const initialText = isMobile ? "Archie H." : "Archie Harrodine";

    animateText(initialText);

    $(window).on('resize', function() {
        const isMobileNow = window.matchMedia("(max-width: 639px)").matches;
        const newText = isMobileNow ? "Archie H." : "Archie Harrodine";
        setTextInstant(newText);
    });

    function observeOnScroll(selector, animationClass) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $(entry.target).addClass(`${animationClass} in-view`);
                    obs.unobserve(entry.target); 
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll(selector).forEach(el => {
            observer.observe(el);
        });
    }


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

    const home_button = document.getElementById("home-button");
    home_button.addEventListener("click", (e) => {
        e.stopPropagation(); 
        randomTitle = titles[Math.floor(Math.random() * titles.length)];
        sidetitle.textContent = randomTitle;
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

    $('.p-slick-carousel').slick({
        slidesToShow: 3, 
        slidesToScroll: 1, 
        infinite: true, 
        autoplay: true,             
        autoplaySpeed: 10000,       
        arrows: false,               
        draggable: false,          
        swipe: false,               

        responsive: [
            {
                breakpoint: 1024,  
                settings: {
                    slidesToShow: 1, 
                    slidesToScroll: 1, 
                    swipe: true,      
                    draggable: true, 
                }
            }
        ]
    });

    const $projectsCarousel = $('.p-slick-carousel');

    document.getElementById('projects-prev')
    .addEventListener('click', () => {
        $projectsCarousel.slick('slickPrev');
    });

    document.getElementById('projects-next')
    .addEventListener('click', () => {
        $projectsCarousel.slick('slickNext');
    });

    let currentSlide = 0;
    const slides = document.getElementById("slides");
    const totalSlides = slides.children.length;

    for (let i = 1; i <= 4; i++) {
		const card = document.getElementById(`card-${i}`);
		const audio = document.getElementById(`sound-${i}`);

		card.addEventListener('click', () => {
			card.classList.add(`flash-${i}`);
			setTimeout(() => card.classList.remove(`flash-${i}`), 400);

			audio.currentTime = 0; 
			audio.play();
		});
  	};

    window.nextSlide = function (direction) {
        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
        slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    };

    const sound = document.getElementById("paper");
    const overlay = document.getElementById("fullscreen-image");
    window.secret_paper = function () {
		overlay.classList.remove("hidden");
		
		sound.currentTime = 0;
		sound.play();
	}

});

document.addEventListener("DOMContentLoaded", () => {
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