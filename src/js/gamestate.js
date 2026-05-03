import words from '../words.json'

export class GameState {
    static MAX_WORD_SIZE = 5
    static MAX_GUESSES = 6
    static LETTER_STATE = { ABSENT: 0, CORRECT: 2, PRESENT: 1 }

    constructor() {
        this.targetWord = this.#newWord()
        this.guesses = []
        this.letterStatuses = {}
        this.currentInput = ""
        this.status = "playing"
        this.initializedAt = Date.now()
    }

    static fromState(state) {
        console.debug("Game state loaded", state)
        const game = new GameState
        game.targetWord = state.targetWord
        game.guesses = state.guesses
        game.letterStatuses = state.letterStatuses
        game.currentInput = state.currentInput
        game.status = state.status
        game.initializedAt = state.initializedAt
        return game
    }

    submitGuess() {
        const word = this.currentInput.toUpperCase()
        if (word.length !== GameState.MAX_WORD_SIZE) {
            throw new Error("Word is too short")
        }

        if (!words.includes(word)) {
            throw new Error("Word is not in the game")
        }

        if (this.status !== "playing" || this.guesses.length >= GameState.MAX_GUESSES) {
            throw new Error("Game over")
        }

        const guessParts = []
        for (let letterIndex = 0; letterIndex < word.length; letterIndex++) {
            let partState = GameState.LETTER_STATE.ABSENT
            if (word[letterIndex] === this.targetWord[letterIndex]) {
                partState = GameState.LETTER_STATE.CORRECT
            } else if (this.targetWord.includes(word[letterIndex])) {
                partState = GameState.LETTER_STATE.PRESENT
            }

            if (partState > this.letterStatuses[word[letterIndex]] || !this.letterStatuses[word[letterIndex]]) {
                this.letterStatuses[word[letterIndex]] = partState
            }

            guessParts.push({
                part: word[letterIndex],
                state: partState
            })
        }

        this.guesses.push(guessParts)
        this.currentInput = ""

        if (guessParts.reduce((acc, part) => acc + part.state, 0) === GameState.MAX_WORD_SIZE * 2) {
            this.status = "won"
        } else if (this.guesses.length >= GameState.MAX_GUESSES) {
            this.status = "lost"
        }
    }

    addLetter(letter) {
        letter = letter.slice(0, 1)

        if (!/[A-ZÅÄÖ]/.test(letter)){
            return
        }

        if (this.currentInput.length < GameState.MAX_WORD_SIZE && this.status === 'playing') {
            this.currentInput += letter
        }
    }

    removeLetter() {
        if (this.currentInput.length > 0) {
            this.currentInput = this.currentInput.slice(0, -1)
        }
    }

    letterStatus(letter) {
        return this.letterStatuses[letter];
    }

    #newWord() {
        const word = words[Math.floor(Math.random() * words.length)]
        return word.toUpperCase()
    }
}
