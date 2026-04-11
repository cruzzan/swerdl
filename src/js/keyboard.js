const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Å'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
]

function renderKeyboard() {
    const keyboard = document.getElementById('keyboard')
    keyboard.innerHTML = ''

    for (const keys of KEYBOARD_ROWS) {
        const row = document.createElement('div')
        row.className = 'keyboard-row'
        for (const key of keys) {
            const btn = document.createElement('button')
            btn.textContent = key
            btn.dataset.key = key
            btn.className = 'key'
            if (key === 'ENTER' || key === '⌫') btn.classList.add('wide')

            btn.addEventListener('click', () => {
                if (key === 'ENTER') submitGuess()
                else if (key === '⌫') deleteLetter()
                else addLetter(key)
            })

            row.appendChild(btn)
        }
        keyboard.appendChild(row)
    }
}

const keyStatus = {}

function updateKeyboard(guess, result) {
    const priority = { correct: 3, present: 2, absent: 1 }

    for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = guess[i]
        const current = keyStatus[letter]
        if (!current || priority[result[i]] > priority[current]) {
            keyStatus[letter] = result[i]
        }
    }

    const buttons = document.querySelectorAll('#keyboard .key')
    for (const btn of buttons) {
        const status = keyStatus[btn.dataset.key]
        if (status) {
            btn.className = `key ${status}`
        }
    }
}
