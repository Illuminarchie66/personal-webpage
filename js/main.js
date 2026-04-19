import { Queue } from './queue.js';

function resetGlitchState() {
    document.body.classList.remove(
        'glitching',
        'glitch-paused',
        'glitch-frozen',
        'fading-out',
        'navigating'
    );

    document.body.style.overflow = '';

    const overlay = document.getElementById('glitch-overlay');
    if (overlay) overlay.remove();

    const style = document.getElementById('glitch-styles');
    if (style) style.remove();

    const fade = document.getElementById('orange-fade');
    if (fade) fade.remove();

    // reset inline card styles
    for (let i = 1; i <= 4; i++) {
        const card = document.getElementById(`card-${i}`);
        if (card) card.style.backgroundColor = '';
    }
}

resetGlitchState();

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        resetGlitchState();
    }
});

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
function animateText(container, text, waitForAnimation = true) {
    container.empty();

    for (let i = 0; i < text.length; i++) {
        const span = $('<span class="letter">' + text[i] + '</span>');
        container.append(span);
    }

    const triggerScrollAnimations = () => {
        observeOnScroll('.fade-up-target', 'fade-in-up');
        observeOnScroll('.fade-left-target', 'fade-in-left');
        observeOnScroll('.fade-right-target', 'fade-in-right');
    };

    if (!waitForAnimation) {
        triggerScrollAnimations();
    }

    setTimeout(() => {
        const letters = container.find('.letter');

        letters.each(function (index) {
            $(this).delay(index * 90).animate({ opacity: 1 }, 90, () => {

                // 👇 Only trigger here if we ARE waiting
                if (waitForAnimation && index === letters.length - 1) {
                    triggerScrollAnimations();
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
async function checkPassword(input) {
    const str = input.join(',');
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
    return hash === '3eb7acb69818ed722b07280814b0eb64ddc81a6610334eb01cc8f02f292d568e';
}

/* Skills cards interaction (sound + flash + queue tracking) */
function skillsCardSetup() {
    const q = new Queue(15);
    const wir = document.getElementById('wir');
    const noise = document.getElementById('noise');

    for (let i = 1; i <= 4; i++) {
        const card = document.getElementById(`card-${i}`);
        const audio = document.getElementById(`sound-${i}`);

        if (!card || !audio) continue;

        card.addEventListener('click', async () => {
            /* Visual feedback */
            card.classList.add(`flash-${i}`);
            setTimeout(() => card.classList.remove(`flash-${i}`), 400);

            /* Play sound */
            audio.currentTime = 0;
            audio.play();

            /* Track sequence */
            q.enqueue(i);
            if (await checkPassword(q.items)) {
                triggerUnlockSequence(wir, noise);
            }
        });
    }
}

function triggerUnlockSequence(wir, noise) {
    /* Inject styles */
    const style = document.createElement('style');
    style.id = 'glitch-styles';
    style.textContent = `
        /* Scanline overlay */
        #glitch-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            pointer-events: all;
            background: repeating-linear-gradient(
                to bottom,
                transparent 0px,
                transparent 2px,
                rgba(0,0,0,0.18) 2px,
                rgba(0,0,0,0.18) 4px
            );
            mix-blend-mode: multiply;
            opacity: 0;
            transition: opacity 0.1s;
        }
        #glitch-overlay.visible { opacity: 1; }
 
        /* Page shake */
        @keyframes glitch-shake {
            0%   { transform: translate(0, 0)       skewX(0deg);   }
            10%  { transform: translate(-4px, -2px) skewX(-2deg);  }
            20%  { transform: translate(4px, 2px)   skewX(1deg);   }
            30%  { transform: translate(-6px, 1px)  skewX(3deg);   }
            40%  { transform: translate(6px, -3px)  skewX(-1deg);  }
            50%  { transform: translate(-3px, 4px)  skewX(2deg);   }
            60%  { transform: translate(5px, -1px)  skewX(-3deg);  }
            70%  { transform: translate(-5px, 3px)  skewX(1deg);   }
            80%  { transform: translate(3px, -4px)  skewX(-2deg);  }
            90%  { transform: translate(-2px, 2px)  skewX(0deg);   }
            100% { transform: translate(0, 0)        skewX(0deg);  }
        }
 
        /* RGB split flicker */
        @keyframes glitch-rgb {
            0%   { text-shadow: none; }
            20%  { text-shadow: -3px 0 #fd5a19, 3px 0 #0ff; }
            40%  { text-shadow: 3px 0 #cf4511,  -3px 0 #f0f; }
            60%  { text-shadow: -2px 0 #ee4d10, 2px 0 #0ff; }
            80%  { text-shadow: none; }
            100% { text-shadow: none; }
        }
 
        body.glitching {
            animation: glitch-shake 0.15s infinite;
            background-color: #fd5a19 !important;
        }
 
        /* Blacken / orange-tint images */
        body.glitching img:not(#glitch-overlay) {
            filter: brightness(0) !important;
            transition: filter 0.05s;
        }
 
        /* Orange wash on cards */
        body.glitching .bg-bg-card,
        body.glitching [class*="bg-bg-extra"] {
            background-color: #cf4511 !important;
            transition: background-color 0.05s;
        }
 
        /* Text flicker */
        body.glitching h1,
        body.glitching h2,
        body.glitching h3,
        body.glitching p,
        body.glitching li,
        body.glitching span {
            animation: glitch-rgb 0.2s infinite;
            color: #fff !important;
        }
 
        /* Freeze cursor */
        body.glitching * { cursor: wait !important; }
 
        /* Fade to black before redirect */
        @keyframes fade-to-black {
            from { opacity: 1; }
            to   { opacity: 0; }
        }
        body.fading-out {
            animation: fade-to-black 0.8s ease-in forwards !important;
            pointer-events: none;
        }

        body.glitch-paused,
        body.glitch-paused *,
        body.glitch-paused *::before,
        body.glitch-paused *::after {
            animation-play-state: paused !important;
        }

        #orange-fade {
            position: fixed;
            inset: 0;
            background: #fd5a19;
            opacity: 0;
            z-index: 10000;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
 
    /* Scanline overlay element */
    const overlay = document.createElement('div');
    overlay.id = 'glitch-overlay';
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));
 
    /* Lock scrolling */
    document.body.style.overflow = 'hidden';
 
    /* Play noise audio */
    if (wir) {
        wir.currentTime = 0;
        wir.play().catch(() => {});
    }
 
    /* Start glitch */
    document.body.classList.add('glitching');
 
    /* Randomly swap card colors for extra chaos */
    const cards = [1,2,3,4].map(n => document.getElementById(`card-${n}`));
    const oranges = ['#fd5a19','#ee4d10','#cf4511','#ff6a30','#b83d0e'];
    const colourInterval = setInterval(() => {
        cards.forEach(card => {
            if (card) card.style.backgroundColor = oranges[Math.floor(Math.random() * oranges.length)];
        });
    }, 80);
 
    const glitchDuration = 4000
    const fadeDuration = (noise?.duration ? noise.duration * 1000 : 3000);
 
    setTimeout(() => {
        clearInterval(colourInterval);
        document.body.classList.add('glitch-paused');

        setTimeout(() => {

            const fade = document.createElement('div');
            fade.id = 'orange-fade';
            document.body.appendChild(fade);

            // ensure start state
            fade.style.opacity = '0';
            void fade.offsetHeight;

            // set duration based on audio
            const duration = (noise?.duration ? noise.duration * 1000 : 3000);

            fade.style.transition = `opacity ${duration}ms linear`;

            // START BOTH TOGETHER
            requestAnimationFrame(() => {
                fade.style.opacity = '1';

                if (noise) {
                    noise.currentTime = 0;
                    noise.play().catch(() => {});
                }
            });

            // redirect at end
            setTimeout(() => {
                // keep overlay visible during navigation start
                fade.style.opacity = '1';

                setTimeout(() => {
                    window.location.href = '/secrets_p_wbc_fsr/';
                }, 80);

            }, fadeDuration);

        }, 200);

    }, glitchDuration);
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

    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const initialText = isMobile ? "Archie H." : "Archie Harrodine";

    const animTitle = sessionStorage.getItem('animTitle') === 'true';

    if (animTitle) {
        animateText(container, initialText, false);
    } else {
        animateText(container, initialText, true);
        sessionStorage.setItem('seenIntro', 'true');
    }

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