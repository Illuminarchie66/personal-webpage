function normalise(str) {
    const lower = str.toUpperCase();
    return [...lower]
}

function validGuess(str, guess_words) {
    return guess_words.has(str.toUpperCase());
}

function checkExact(guess, answer) {
    const exact = [];
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === answer[i]) { 
            exact.push(true);
        } else {
            exact.push(false);
        }
    }
    return exact;
}

function countLettersLeft(answer, exacts) {
    const letter_counts = new Array(26).fill(0);
    for (let i = 0; i < answer.length; i++) {
        if (!exacts[i]) {
            const index = answer[i].charCodeAt(0) - 'A'.charCodeAt(0);
            letter_counts[index]++;
        }
    }
    return letter_counts;
}

function checkExists(guess, answer, exacts) {
    const res = [];
    const letter_counts = countLettersLeft(answer, exacts);
    console.log(letter_counts);
    for (let i = 0; i < guess.length; i++) {
        if (!exacts[i]) {
            const index = guess[i].charCodeAt(0) - 'A'.charCodeAt(0);
            if (letter_counts[index] > 0) {
                res.push("EXISTS");
                letter_counts[index]--;
            } else {
                res.push("NOT IN");
            }
        } else {
            res.push("EXACT");
        }
    }
    return res;
}

function guess(guess, answer, guess_words) {
    if (validGuess(guess, guess_words)) {
        const normalised_guess = normalise(guess);
        const normalised_answer = normalise(answer);
        const exacts = checkExact(normalised_guess, normalised_answer);
        return checkExists(normalised_guess, normalised_answer, exacts);
    } else {
        return "INVALID";
    }
}

async function loadWords(path) {
  const res = await fetch(path);
  const text = await res.text();
  return text.split(/\r?\n/).filter(Boolean);
}

async function init() {
  const guessWords = new Set(await loadWords('assets/allowed-guesses'));
  const answers = await loadWords('assets/answers');
  const answer = answers[Math.floor(Math.random() * answers.length)];
  console.log(answer);

  console.log(guess("hells", answer, guessWords));
}

init();

export { loadWords, guess, normalise, validGuess, checkExact, checkExists };