import words from '../words.json'

export class GameState {
    static #STORAGE_KEY = 'svrdl-state'
    static MAX_WORD_SIZE = 5
    static MAX_GUESSES = 6

    constructor() {
        this.targetWord = this.#newWord()
        this.guesses = []
        this.letterStatuses = {}
        this.currentInput = ""
        this.status = "playing"
        this.initializedAt = Date.now()

        const gameState = this.#load()
        if (gameState) {
            const now = new Date(Date.now())
            now.setHours(0, 0, 0, 0)
            const initAt = new Date(gameState.initializedAt)
            initAt.setHours(0, 0, 0, 0)

            if (now.getTime() === initAt.getTime()) {
                console.debug("Game state loaded", gameState)
                this.targetWord = gameState.targetWord
                this.guesses = gameState.guesses
                this.letterStatuses = gameState.letterStatuses
                this.currentInput = gameState.currentInput
                this.status = gameState.status
                this.initializedAt = gameState.initializedAt
            }
        }

        this.#store()
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
            let partState = 0
            if (word[letterIndex] === this.targetWord[letterIndex]) {
                partState = 2
            } else if (this.targetWord.includes(word[letterIndex])) {
                partState = 1
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

        if (guessParts.reduce((acc, part) => acc + part.state, 0) === 10) {
            this.status = "won"
        } else if (this.guesses.length >= GameState.MAX_GUESSES) {
            this.status = "lost"
        }

        this.#store()
    }

    addLetter(letter) {
        if (this.currentInput.length < GameState.MAX_WORD_SIZE && this.status === 'playing') {
            this.currentInput += letter
            this.#store()
        }
    }

    removeLetter() {
        if (this.currentInput.length > 0) {
            const tmp = this.currentInput
            this.currentInput = tmp.substring(0, tmp.length - 1)
            this.#store()
        }
    }

    letterStatus(letter) {
        return this.letterStatuses[letter];
    }

    #load() {
        try {
            const raw = localStorage.getItem(GameState.#STORAGE_KEY)
            return JSON.parse(raw)
        } catch {
            console.error('no state')
            return undefined
        }
    }

    #store() {
        try {
            localStorage.setItem(GameState.#STORAGE_KEY, JSON.stringify(this))
        } catch {
            console.warn("Could not save game state")
        }
    }

    #newWord() {
        const word = words[Math.floor(Math.random() * words.length)]
        return word.toUpperCase()
    }

    clear() {
        localStorage.removeItem(GameState.#STORAGE_KEY)
    }
}
