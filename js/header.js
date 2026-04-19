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
    "Oh its you!",
    "Despite everything, its still you.",
    "You should check out Bojack Horseman",
    "Don't forget, I'm with you in the dark",
    "key = HexyHexyHexy...",
    "Whats that in the bottom right?",
    "I am the one who knocks",
    "My guilty pleasure is family guy shorts",
    "You should check out The Liveship Traders",
    "Mamma Mia",
    "GenAI is overrated",
    "Nows your chance to be a BIG SHOT",
    "Dinnnnnnnnnnnnn [din]",
    "Trans rights !!",
    "Play Terraria",
    "Its elementary dear Watson",
    "You should check out Gravity Falls",
    "Room temperature gin",
    "I love my boyfriend/girlfriend/partner !",
    "Oh noooo my lobster",
    "Hugh Laurie is hilarious",
    "Mike reassemble my kids!",
    "Its. T. V. Time!",
    "Freedom Motif",
    "And I'm a piece of sh*t. Here I go",
    "Here I come",
    "That looks dubious to me",
    "Do you remember being born?",
    "I'm having a boibi",
    "You ate the Moss", 
    "AHH! let's get outta here before the moon gets frisky!",
    "How about XDDCC",
    "Be quiet, I can't hear the escalator",
    "I'm not a child. You don't have to hype me up.",
    "YOU PARASITE",
    "Why are you like this?",
    "I hope this won't lead any kind of Fallout between us. Fallout New Vegas.",
    "you kissed your dad on the mouth?",
    "Yeah, he loves his cars….loves his cars.",
    "GET OUT OF MY HEAD MAN",
    "How do I look yellow man",
    "I JUST WANTED MY CHEEEEEEEEESE",
    "Yo guys its me charlie",
    "hey did that guy turn into sand",
    "IIIIIIIIITS SMORMU!!!! YOU VOTED AND WE LISTENED!",
    "I've been coming here since I was a Homunculus",
    "Oh if I had my GWIMBLY GUN RIGHT NOW I-",
    "Dude. Check the news, it doesn't matter what channel.",
    "Do a barrel roll!",
    "I've come to make an announcement",
    "I HAVE 70 ALTERNATIVE ACCOUNTS!",
    "I'm the devil, from. Bible.",
    "Shadow, it's me... The Devil!",
    "ALSO IM BISEXUAL",
    "I need to update my audio equipment.",
    "LOOKS LIKE PUMPKIN HILL!!!!! DODO-",
    "…Something just happened",
    "I miss my wife tails, I miss her a lot. I'll be back",
    "So this is the fabled tilted towers",
    "Memphis Tennessee",
    "Uh bing-bong hey what's up you're doing a bad job",
    "'Maria...' 💥",
    "VERY. VERY. INTERESTING",
    "Wing a ding ding. Its me gaster.",
    "He's GROOVY and NEVER glooby!",
    "FRIEND INSIDE ME",
    "Kris Get The Banana",
    "Potassium",
    "Proceed.",
    "That's not... the... ThornRing, is it...?",
    "It Snew",
    "Its like he's in some kind of Snowgrave",
    "Human... I remember you're genocides",
    "Equip.",
    "You were used up.",
    "Things took a weird route huh?",
    "NYEH HEH HEH HEH",
    "I can't go to hell, I'm all out of vacation days.",
    "But nobody came.",
    "Don't kill, and don't be killed, alright?",
    "You'd be dead where you stand.",
    "it's a beatiful day outside...",
    "You are filled with determination",
    "It's a snow poff.",
    "Toby? Who's that? Sounds...sexy",
    "RUN. INTO. THE. friendliness pellets",
    "But it refused.",
    "Every Living Breathing Moment",
    "You should check out Muse",
    "I'm Baldurs Gate 3",
    "Nah. I'd win.",
    "These boots have seen everything",
    "Courage is found in the battle against fear not in the defeat of it.",
    "Even the waves of fate can break upon the shores of will.",
    "the act of applause…. is an acclamation of the soul!",
    "At least curse at me a little at the very end",
    "Stand proud, you are strong.",
    "Throughout the heaven and earth I'm alone the honored one",
    "adulthood is characterized by the small tragedies of everyday life",
    "Are you sure?",
    "How is this possible?",
    "What's 17 more years?",
    "CECIL! I NEED YOU CECIL!",
    "Mark... I made a steak. A STEAK?!",
    "Pretty sure. Threw a trashbag. Into Space.",
    "WHERE'S OMNI MAN?! WHERE IS HE?!?",
    "What will you have after 500 years?",
    "THINK MARK!",
    "Let me break it down for you mordecai",
    "Let me break it down for you Mark.",
    "Another day, another random body pain.",
    "Mommy, is the floating head going to eat us?",
    "NON SPECIFIC EXCUSE!",
    "Sometimes, a man has to steal an animatronic badger",
    "SHMEBULOCK",
    "Cant argue with doctor medicine",
    "This vexes me",
    "Soos, is it wrong to punch a child?",
    "Burn the Child",
    "Your MATH is no match for my GUN you idiot!",
    "My ex wife still misses me",
    "BUT HER AIM IS GETTING BETTER",
    "Darn beautiful men, always eating my trash!",
    "Suck a lemon little man",
    "I was awoken by the sound of mockery.",
    "Wow, this is worthless!",
    "We put the fun in no refund",
    "I've been twaumatized",
    "Crombie? That's not even a word.",
    "Reality is an illusion, the universe is a hologram, buy gold bye!",
    "BYYYYYYYYYYYYYEEEEEEEEEEEEEE",
    "I always come back",
    "Was that the bite of 87?",
    "Exotic Butters",
    "Connection terminated.",
    "the darkest pit of Hell has opened to swallow you whole",
    "Uh Hello hello",
    "Henry Speech",
    "MUSICCCC MANNNN",
    "Can't reason with crazy",
    "MY ONLY WEAKNESS.... DYING",
    "My weak nerd arms",
    "Ah, farts. I got caught.",
    "If that bird tube ever talks to me again.",
    "Talk to the Glyph, Witch",
    "Oh. Wow. Sports.",
    "Amity, oh cramity",
    "I will be haunted by my actions forever. HOOT HOOT!",
    "Special delivery...PAIN",
    "They're adorable, and deserve all the happiness",
    "PEEK-A-HOOT",
    "My first word was hoot. My second word was hoot hoot.",
    "You're an experience. Make sure you're a good experience",
    "We're very sorry for your marriage",
    "Everything I did, I did it for her. Now she's gone, but I'm still here",
    "Well, i think your pretty great.",
    "You Clod!",
    "COOKIE CAT! He left his family behind!",
    "HELLO, I AM THE ENERGY MAN",
    "Hello jellyfishes. I am an energy man.",
    "What are they going to do? Put a prison owner in prison? That literally against the law of physics!",
    "Radiation is a hoax by the radiation suit companies",
    "In Sweden there is no radiation only thin clothing",
    "The only thing left to do was to go into a murderous rage",
    "khadgar is a pretty sh*t wizard",
    "What's a cute and fun trend from the 20th century? COMMUNISM",
    "And there I was, surrounded by Canadians...",
    "Is that the music from.... Yes, yes it is",
    "IT'S NOT AN RV YOU IGNORANT WHORESON",
    "Spike is a cool name for cool people",
    "There never was a Venice...",
    "And you can't prove I was sponsored, because it was all cash",
    "Once again, Minecraft has helped me more than school!",
    "If it weren't for the laws and petty moralities of man, the pipes would reach the sky!",
    "But this is a case for a Deku lawyer from Deku New York.",
    "Ottavay? What the f*** is an Ottavay",
    "By nine panthers, six polar bears and one very angry tortoise.",
    "Excitebike is eternal like cassettes and the Soviet Union.",
    "donkeys are brutal warriors look it up.",
    "Castrated! Activision castrated my purple dragon!"
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