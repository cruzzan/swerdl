import * as storage from "./storage"
import { GameState } from "./gamestate"
import { showToast } from "./toast"

const loadGame = () => {
    const saved = storage.load()

    if (saved) {
        const now = new Date(Date.now())
        now.setHours(0, 0, 0, 0)
        const initAt = new Date(saved.initializedAt)
        initAt.setHours(0, 0, 0, 0)
        if (now.getTime() === initAt.getTime()) {
            return GameState.fromState(saved)
        }
    }

    return new GameState()
}

const game = loadGame()
storage.store(game)

const init = () => {
    // Regular keyboard input listener
    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey || event.metaKey || event.altKey) {
            return
        }
        const key = event.key.toUpperCase()
        handleInput(key)
    })

    // Virtual keyboard input
    const keyboard_buttons = document.querySelectorAll(
        "div#keyboard section span.key",
    )
    keyboard_buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const key = event.currentTarget.getAttribute("data-value")
            handleInput(key)
        })
    })

    document.getElementById("toast-tester").addEventListener("click", () => {
        showToast("Testing the toaster still pops", 5000)
    })

    document.getElementById("reset-game").addEventListener("click", () => {
        storage.clear()
        globalThis.location.reload()
    })

    renderGuesses()
    paintKeyboard()
}

const handleInput = (key) => {
    if (key === "ENTER") {
        try {
            game.submitGuess()
        } catch (error) {
            switch (error.message) {
                case "Word is not in the game": {
                    showToast("Ordet finns inte i listan", 5000)
                    break
                }
                case "Game over": {
                    showToast("Spelet är slut", 5000)
                    break
                }
                default: {
                    console.error(error)
                    break
                }
            }
        }
    } else if (key === "BACKSPACE") {
        game.removeLetter()
    } else if (/^[A-ZÅÄÖ]$/.test(key)) {
        game.addLetter(key)
    }

    renderGuesses()
    paintKeyboard()
    storage.store(game)
}

const renderGuesses = () => {
    let emptyTiles = GameState.MAX_WORD_SIZE * GameState.MAX_GUESSES
    const board = document.getElementById("guesses")
    board.innerHTML = ""

    // Render guesses
    for (let guessIndex = 0; guessIndex < game.guesses.length; guessIndex++) {
        let guess = undefined
        if (game && game.guesses && game.guesses.length >= guessIndex + 1) {
            guess = game.guesses[guessIndex]
        }

        for (
            let letterIndex = 0;
            letterIndex < GameState.MAX_WORD_SIZE;
            letterIndex++
        ) {
            const item = document.createElement("div")
            const inner = document.createElement("span")
            item.appendChild(inner)
            item.className = "letter"

            let part = undefined
            if (guess && guess.length >= letterIndex + 1) {
                part = guess[letterIndex]
            }

            if (part) {
                item.className = "letter"
                switch (part.state) {
                    case GameState.LETTER_STATE.PRESENT: {
                        item.className = `${item.className} present`
                        break
                    }
                    case GameState.LETTER_STATE.CORRECT: {
                        item.className = `${item.className} correct`
                        break
                    }
                    default: {
                        item.className = `${item.className} guessed`
                    }
                }

                inner.textContent = part.part
            }

            board.appendChild(item)
            emptyTiles--
        }
    }

    // Render current input
    for (
        let letterIndex = 0;
        letterIndex < game.currentInput.length;
        letterIndex++
    ) {
        const letter = game.currentInput.charAt(letterIndex)
        const item = document.createElement("div")
        item.className = "letter"
        item.innerHTML = `<span>${letter}</span>`
        board.appendChild(item)
        emptyTiles--
    }

    // Render empty tiles
    for (let tileIndex = 0; tileIndex < emptyTiles; tileIndex++) {
        const item = document.createElement("div")
        item.className = "letter"
        item.innerHTML = `<span></span>`
        board.appendChild(item)
    }
}

const paintKeyboard = () => {
    const keyboard_buttons = document.querySelectorAll(
        "div#keyboard section span.key",
    )

    keyboard_buttons.forEach((key) => {
        key.classList.remove("correct")
        key.classList.remove("present")
        key.classList.remove("guessed")

        switch (game.letterStatus(key.getAttribute("data-value"))) {
            case GameState.LETTER_STATE.CORRECT: {
                key.classList.add("correct")
                break
            }
            case GameState.LETTER_STATE.PRESENT: {
                key.classList.add("present")
                break
            }
            case GameState.LETTER_STATE.ABSENT: {
                key.classList.add("guessed")
            }
        }
    })
}

init()
