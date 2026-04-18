import { Queue } from './queue.js';

/* Set text instantly (no animation) */
function setTextInstant(container, text) {
    container.empty();
    container.text(text);
}

/* Observe elements and trigger animation when entering viewport */
function observeOnScroll(selector, animationClass) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass, 'in-view');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll(selector).forEach(el => observer.observe(el));
}

/* Animate text letter-by-letter */
function animateText(container, text) {
    container.empty();

    /* Create span for each letter */
    for (let i = 0; i < text.length; i++) {
        const span = $('<span class="letter">' + text[i] + '</span>');
        container.append(span);
    }

    /* Delay start slightly for smoother load */
    setTimeout(() => {
        const letters = container.find('.letter');

        letters.each(function (index) {
            $(this).delay(index * 90).animate({ opacity: 1 }, 90, () => {

                /* Trigger scroll animations once animation completes */
                if (index === letters.length - 1) {
                    observeOnScroll('.fade-up-target', 'fade-in-up');
                    observeOnScroll('.fade-left-target', 'fade-in-left');
                    observeOnScroll('.fade-right-target', 'fade-in-right');
                }
            });
        });
    }, 350);
}

/* Project carousel (desktop autoplay, mobile swipe) */
function projectCarouselSetup() {
    const $carousel = $('.p-slick-carousel');

    $carousel.slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000, 
        speed: 600,         
        cssEase: 'ease-out',
        arrows: false,
        draggable: false,
        swipe: false,
        pauseOnHover: true,
        pauseOnFocus: true,

        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    swipe: true,
                    draggable: true,
                }
            }
        ]
    });

    /* Manual navigation buttons */
    document.getElementById('projects-prev')?.addEventListener('click', () => {
        $carousel.slick('slickPrev');
    });

    document.getElementById('projects-next')?.addEventListener('click', () => {
        $carousel.slick('slickNext');
    });
}

/* Interests slider (desktop + mobile behaviors) */
function interestsSliderSetup() {
    const slides = document.getElementById("slides");
    if (!slides) return;

    let currentSlide = 0;
    const totalSlides = slides.children.length;

    /* Desktop slide navigation */
    window.nextSlide = function (direction) {
        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
        slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    };

    /* Mobile tap-to-cycle slides */
    const mobileSlides = document.querySelectorAll(".mobile-slide");
    if (mobileSlides.length === 0) return;

    let current = 0;
    mobileSlides[current].classList.add("active");

    document.getElementById("mobile-carousel")?.addEventListener("click", () => {
        mobileSlides[current].classList.remove("active");
        current = (current + 1) % mobileSlides.length;
        mobileSlides[current].classList.add("active");
    });
}

/* Secret password check (sequence-based) */
function checkPassword(input) {
    const correctPassword = [4,4,4,4,4,4,4,4,4,4,3,3,4,4,4];

    if (input.length !== correctPassword.length) return false;

    for (let i = 0; i < input.length; i++) {
        if (input[i] !== correctPassword[i]) return false;
    }

    return true;
}

/* Skills cards interaction (sound + flash + queue tracking) */
function skillsCardSetup() {
    const q = new Queue(15);

    for (let i = 1; i <= 4; i++) {
        const card = document.getElementById(`card-${i}`);
        const audio = document.getElementById(`sound-${i}`);

        if (!card || !audio) continue;

        card.addEventListener('click', () => {
            /* Visual feedback */
            card.classList.add(`flash-${i}`);
            setTimeout(() => card.classList.remove(`flash-${i}`), 400);

            /* Play sound */
            audio.currentTime = 0;
            audio.play();

            /* Track sequence */
            q.enqueue(i);

            console.log("Queue:", q.items);
            console.log("Password correct:", checkPassword(q.items));
        });
    }
}

/* Secret overlay interaction */
function secretsSetup() {
    const sound = document.getElementById("paper");
    const overlay = document.getElementById("fullscreen-image");

    if (!sound || !overlay) return;

    /* Expose globally for inline trigger */
    window.secret_paper = function () {
        overlay.classList.remove("hidden");

        sound.currentTime = 0;
        sound.play();
    };
}

/* Main initialization */
$(document).ready(function () {
    const container = $('#name');

    /* Set initial name based on screen size */
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const initialText = isMobile ? "Archie H." : "Archie Harrodine";

    animateText(container, initialText);

    /* Update name instantly on resize (no re-animation) */
    $(window).on('resize', function () {
        const isMobileNow = window.matchMedia("(max-width: 639px)").matches;
        const newText = isMobileNow ? "Archie H." : "Archie Harrodine";
        setTextInstant(container, newText);
    });

    projectCarouselSetup();
    interestsSliderSetup();
    skillsCardSetup();
    secretsSetup();
});