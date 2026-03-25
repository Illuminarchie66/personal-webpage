function normalise(str) {
    const lower = str.toUpperCase();
    return [...lower]
}

function validGuess(str, guessWords) {
    return guessWords.has(str.toUpperCase());
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

function addGuessResult(guess, res) {
    const answers_div = document.getElementById('answers');
    const normalised_guess = normalise(guess);

    const row = document.createElement('div');
    row.className = 'answer-container';

    let correct = true;

    for (let i = 0; i < normalised_guess.length; i++) {
        const letter = document.createElement('div');
        if (res[i] == "EXACT") {
            letter.className = "letter-box exact";
        } else if (res[i] == "EXISTS") {
            letter.className = "letter-box exists";
            correct = false;
        } else {
            letter.className = "letter-box";
            correct = false;
        }
        
        letter.innerHTML = normalised_guess[i];

        row.appendChild(letter);
    }

    answers_div.appendChild(row);

}

function checkCorrect(res) {
    for (let i = 0; i < res.length; i++) {
        if (res[i] != "EXACT") {
            return false;
        }
    }
    return true;
}

function showInvalidFeedback() {
    const container = document.querySelector('.word-container');
    const errorMsg = document.getElementById('error-message');

    container.classList.add('shake');

    setTimeout(() => {
        container.classList.remove('shake');
    }, 300);

    errorMsg.textContent = "Invalid word";
    errorMsg.classList.add('show');

    setTimeout(() => {
        errorMsg.classList.remove('show');
    }, 1200);
}

function resetInputBoxes() {
    const boxes = document.querySelectorAll('.input-box');

    boxes.forEach(box => {
        box.value = '';
        box.blur();
    });

    if (boxes.length > 0) {
        boxes[0].focus();
    }
}

function guess(guess, answer, answers_set) {
    if (validGuess(guess, answers_set)) {
        const normalised_guess = normalise(guess);
        const normalised_answer = normalise(answer);
        const exacts = checkExact(normalised_guess, normalised_answer);
        return checkExists(normalised_guess, normalised_answer, exacts);
    } else {
        return "INVALID";
    }
}

function encodePattern(res) {
    let code = 0;
    for (let i = 0; i < res.length; i++) {
        let val = 0;
        if (res[i] === "EXACT") val = 2;
        else if (res[i] === "EXISTS") val = 1;

        code = code * 3 + val;
    }
    return code;
}

function computeEntropy(guessWord, possibleAnswers, guessWords) {
    const counts = new Array(243).fill(0);

    const localCache = new Map();

    for (const answer of possibleAnswers) {
        let res;

        if (localCache.has(answer)) {
            res = localCache.get(answer);
        } else {
            res = guess(guessWord, answer, guessWords);
            localCache.set(answer, res);
        }

        if (res === "INVALID") continue;

        const key = encodePattern(res);
        counts[key]++;
    }

    const total = possibleAnswers.length;
    let entropy = 0;

    for (let i = 0; i < counts.length; i++) {
        const count = counts[i];
        if (count === 0) continue;

        const p = count / total;
        entropy -= p * Math.log2(p);
    }

    return entropy;
}

function findBestGuesses(guessList, possibleAnswers, guessWords, k = 5) {
    if (possibleAnswers.length === 1) {
        return [{ word: possibleAnswers[0], entropy: 0 }];
    }

    const results = [];

    for (const word of guessList) {
        const ent = computeEntropy(word, possibleAnswers, guessWords);

        results.push({ word, entropy: ent });
    }

    results.sort((a, b) => b.entropy - a.entropy);

    return results.slice(0, k);
}

function filterAnswers(possibleAnswers, guessWord, result, guessWords) {
    const target = encodePattern(result);

    return possibleAnswers.filter(answer => {
        const res = guess(guessWord, answer, guessWords);
        return encodePattern(res) === target;
    });
}

function showEndScreen({ won = false, answer = '' }) {
    const gameArea = document.getElementById('game-area');
    const endScreen = document.getElementById('end-screen');
    const heading = document.getElementById('end-heading');
    const subtext = document.getElementById('end-subtext');

    gameArea.classList.add('hidden');

    endScreen.classList.remove('win', 'lose');

    if (won) {
        heading.textContent = "CONGRATULATIONS";
        subtext.textContent = "";
        endScreen.classList.add('win');
    } else {
        heading.textContent = "YOU LOSE";
        subtext.textContent = `Answer: ${answer}`;
        endScreen.classList.add('lose');
    }

    endScreen.classList.remove('hidden');
}

async function loadWords(path) {
    const res = await fetch(path);
    const text = await res.text();
    return text.toUpperCase().split(/\r?\n/).filter(Boolean);
}

export { loadWords, guess, normalise, validGuess, checkExact, checkExists, addGuessResult, resetInputBoxes, showInvalidFeedback, checkCorrect, findBestGuesses, filterAnswers, showEndScreen };