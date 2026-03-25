const letterStatus = Array(26).fill("DEFAULT"); // "DEFAULT", "IN", "NOT IN"
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const keyboardTab = document.getElementById('keyboard-tab');
const letterBoxes = [];

function initKeyboardTab() {
    keyboardTab.innerHTML = '';
    alphabet.forEach(letter => {
        const div = document.createElement('div');
        div.className = 'letter-box default';
        div.textContent = letter;
        keyboardTab.appendChild(div);
        letterBoxes.push(div);
    });
}

function updateKeyboard(guess, result) {
    guess = guess.toUpperCase();
    for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        const statusIndex = letter.charCodeAt(0) - 'A'.charCodeAt(0);

        if (result[i] === "EXACT" || result[i] === "EXISTS") {
            letterStatus[statusIndex] = "IN";
        } else if (result[i] === "NOT IN" && letterStatus[statusIndex] !== "IN") {
            letterStatus[statusIndex] = "NOTIN";
        }
    }

    for (let i = 0; i < 26; i++) {
        letterBoxes[i].className = `letter-box ${letterStatus[i].toLowerCase()}`;
    }
}

function resetKeyboard() {
    for (let i = 0; i < 26; i++) {
        letterStatus[i] = "DEFAULT";
    }
    for (let i = 0; i < 26; i++) {
        letterBoxes[i].className = `letter-box ${letterStatus[i].toLowerCase()}`;
    }
}

export { initKeyboardTab, updateKeyboard, resetKeyboard };