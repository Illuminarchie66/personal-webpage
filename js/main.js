$(document).ready(function() {
    var text = "Archie Harrodine";
    var container = $('#name');

    for (let i = 0; i < text.length; i++) {
      let span = $('<span class="letter">' + text[i] + '</span>');
      container.append(span);
    }
  
    setTimeout(function () {
        $('.letter').each(function (index) {
            $(this).delay(index * 100).animate({ opacity: 1 }, 100, function () {
                if (index === $('.letter').length - 1) {
                    // Once the name finishes animating, start watching the other targets
                    observeOnScroll('.fade-up-target', 'fade-in-up');
                    observeOnScroll('.fade-left-target', 'fade-in-left');
                    observeOnScroll('.fade-right-target', 'fade-in-right');
                }
            });
        });
    }, 350);

    function observeOnScroll(selector, animationClass) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $(entry.target).addClass(`${animationClass} in-view`);
                    obs.unobserve(entry.target); // Remove observer after animation
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
        arrows: true,
        autoplay: true,             
        autoplaySpeed: 10000,       
        arrows: true,               
        draggable: false,          
        swipe: false,               
        prevArrow: '<button type="button" class="custom-slick-prev">&#x276E;</button>', // ‹
  		nextArrow: '<button type="button" class="custom-slick-next">&#x276F;</button>', // ›

        responsive: [
            {
                breakpoint: 1250,  
                settings: {
                    slidesToShow: 1, 
                    slidesToScroll: 1, 
                    swipe: true,      
                    draggable: true, 
                }
            }
        ]
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


