const letterStatus = Array(26).fill("DEFAULT"); // "DEFAULT", "IN", "NOTIN"
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const keyboardTab = document.getElementById('keyboard-tab');
const letterBoxes = [];

function initKeyboardTab() {
    keyboardTab.innerHTML = '';
    letterBoxes.length = 0;

    // 14 on row 1, 12 on row 2
    const row1 = document.createElement('div');
    row1.className = 'keyboard-row';

    const row2 = document.createElement('div');
    row2.className = 'keyboard-row';

    alphabet.forEach((letter, idx) => {
        const div = document.createElement('div');
        div.className = 'letter-box default';
        div.textContent = letter;
        letterBoxes.push(div);

        if (idx < 14) {
            row1.appendChild(div);
        } else {
            row2.appendChild(div);
        }
    });

    keyboardTab.appendChild(row1);
    keyboardTab.appendChild(row2);
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
        letterBoxes[i].className = `letter-box default`;
    }
}

export { initKeyboardTab, updateKeyboard, resetKeyboard };
