import {showToast} from './toast'
import {GameState} from './gamestate'

const game = new GameState()

function init() {
    // Regular keyboard input listener
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return
        const key = e.key.toUpperCase()
        handleInput(key)
    })

    // Virtual keyboard input
    let keyboard_buttons = document.querySelectorAll("div#keyboard section span.key")
    keyboard_buttons.forEach(button => {
        button.addEventListener("click", (e) => {
            let key = e.currentTarget.getAttribute("data-value")
            handleInput(key)
        })
    })

    document.getElementById("toast-tester").addEventListener('click', () => {
        showToast("Testing the toaster still pops", 5000)
    })

    document.getElementById("reset-game").addEventListener('click', () => {
        game.clear()
        window.location.reload()
    })

    renderGuesses()
    paintKeyboard()
}

function handleInput(key) {
    if (key === 'ENTER') {
        try {
            game.submitGuess()
        } catch (e) {
            switch (e.message) {
                case "Word is not in the game":
                    showToast("Ordet finns inte i listan", 5000)
                    break
                case "Game over":
                    showToast("Spelet är slut", 5000)
                    break
                default:
                    console.error(e)
                    break
            }
        }
    } else if (key === 'BACKSPACE') {
        game.removeLetter()
    } else if (/^[A-ZÅÄÖ]$/.test(key)) {
        game.addLetter(key)
    }

    renderGuesses()
    paintKeyboard()
}

function renderGuesses() {
    let emptyTiles = GameState.MAX_WORD_SIZE * GameState.MAX_GUESSES
    let board = document.getElementById('guesses')
    board.innerHTML = ''

    // Render guesses
    for (let i = 0; i < game.guesses.length; i++) {
        let guess
        if (game && game.guesses && game.guesses.length >= i+1) {
            guess = game.guesses[i]
        }

        for (let j = 0; j < GameState.MAX_WORD_SIZE; j++) {
            const item = document.createElement('div')
            let part
            if (guess && guess.length >= j+1) {
                part = guess[j]
            }

            if (part) {
                item.className = 'letter'
                switch (part.state) {
                    case 1:
                        item.className = `${item.className} present`
                        break
                    case 2:
                        item.className = `${item.className} correct`
                        break
                    default:
                        item.className = `${item.className} guessed`
                }
                item.innerHTML = `<span>${part.part}</span>`;
            } else {
                item.className = 'letter';
                item.innerHTML = `<span></span>`;
            }

            board.appendChild(item);
            emptyTiles--
        }
    }

    // Render current input
    for (let i = 0; i < game.currentInput.length; i++) {
        let letter = game.currentInput.charAt(i)
        const item = document.createElement('div')
        item.className = 'letter'
        item.innerHTML = `<span>${letter}</span>`;
        board.appendChild(item);
        emptyTiles--
    }

    // Render empty tiles
    for (let i = 0; i < emptyTiles; i++) {
        const item = document.createElement('div')
        item.className = 'letter'
        item.innerHTML = `<span></span>`;
        board.appendChild(item);
    }
}

function paintKeyboard() {
    let keyboard_buttons = document.querySelectorAll("div#keyboard section span.key")

    keyboard_buttons.forEach(key => {
        key.classList.remove("correct")
        key.classList.remove("present")
        key.classList.remove("guessed")

        switch (game.letterStatus(key.getAttribute("data-value"))) {
            case 2:
                key.classList.add("correct")
                break
            case 1:
                key.classList.add("present")
                break
            case 0:
                key.classList.add("guessed")
        }
    })
}

init()
