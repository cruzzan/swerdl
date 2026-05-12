import { describe, expect, test } from "vitest"
import { GameState } from "../js/gamestate"

describe("guess input", () => {
    test("adding allowed letters", () => {
        const game = new GameState()

        game.addLetter("A")

        expect(game.currentInput).toBe("A")
    })

    test("add lower case letter", () => {
        const game = new GameState()
        game.addLetter("a")
        expect(game.currentInput).toHaveLength(0)
    })

    test("adding numbers or special chars", () => {
        const game = new GameState()
        const blacklisted = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "!",
            "@",
            "#",
            "$",
            "%",
            "^",
            "&",
            "*",
            "(",
            ")",
            "-",
            "_",
            "=",
            "+",
            "[",
            "]",
            "{",
            "}",
            "|",
            ";",
            ":",
            '"',
            "'",
            ",",
            ".",
            "<",
            ">",
            "?",
            "/",
            "\\",
            "`",
            "~",
            " ",
            "\t",
            "\n",
            "\r",
            "é",
            "ñ",
            "ü",
            "ç",
            "€",
            "£",
            "¥",
            "→",
            "←",
            "↑",
            "↓",
            "★",
            "♥",
            "✓",
            "✗",
            "🔥",
            "🚀",
            "💻",
            "\u0000",
            "\u0001",
            "\u001F",
        ]

        blacklisted.forEach((char) => {
            game.addLetter(char)
        })

        expect(game.currentInput).toHaveLength(0)
    })

    test("adding swedish letters", () => {
        const game = new GameState()

        const whitelisted = ["Å", "Ä", "Ö"]

        whitelisted.forEach((char) => {
            game.addLetter(char)
        })

        expect(game.currentInput).toHaveLength(3)
        whitelisted.forEach((char) => {
            expect(game.currentInput).toContain(char)
        })
    })

    test("adding multiple letters in one call", () => {
        const game = new GameState()
        game.addLetter("ABC")
        expect(game.currentInput).toHaveLength(1)
        expect(game.currentInput).toBe("A")
    })

    test("adding a letter when input is full", () => {
        const game = GameState.fromState({
            currentInput: "SKRUV",
            initializedAt: Date.now(),
            targetWord: "SKRUV",
        })

        expect(game.currentInput).toHaveLength(GameState.MAX_WORD_SIZE)
        expect(game.currentInput).not.toContain("Ö")
    })

    test("deleting letter", () => {
        const game = GameState.fromState({
            currentInput: "SKRUV",
        })

        game.removeLetter()

        expect(game.currentInput).toHaveLength(4)
        expect(game.currentInput).toBe("SKRU")
    })

    test("submit guess that is too short throws error", () => {
        const game = GameState.fromState({
            currentInput: "SKRU",
        })

        expect(() => {
            game.submitGuess()
        }).toThrow("Word is too short")
    })

    test("submit guess that is not in the game throws error", () => {
        const game = GameState.fromState({
            currentInput: "APPLE",
        })

        expect(() => {
            game.submitGuess()
        }).toThrow("Word is not in the game")
    })

    test("submit guess when game is lost throws error", () => {
        const game = GameState.fromState({
            currentInput: "SKRUV",
            status: "lost",
        })

        expect(() => {
            game.submitGuess()
        }).toThrow("Game over")
    })

    test("submit guess when game is won throws error", () => {
        const game = GameState.fromState({
            currentInput: "SKRUV",
            status: "won",
        })

        expect(() => {
            game.submitGuess()
        }).toThrow("Game over")
    })

    test("submit final guess with wrong word should lose game", () => {
        const game = GameState.fromState({
            currentInput: "SKRUV",
            guesses: [[], [], [], [], []],
            letterStatuses: {},
            status: "playing",
            targetWord: "GRUVA",
        })

        game.submitGuess()

        expect(game.status).toBe("lost")
    })

    test("submit correct guess should win game", () => {
        const game = GameState.fromState({
            currentInput: "SKRUV",
            guesses: [],
            letterStatuses: {},
            status: "playing",
            targetWord: "SKRUV",
        })

        game.submitGuess()

        expect(game.status).toBe("won")
    })

    test("submit guess with no correct letters", () => {
        const game = GameState.fromState({
            currentInput: "SKRUV",
            guesses: [],
            letterStatuses: {},
            status: "playing",
            targetWord: "PÅTAD",
        })

        game.submitGuess()

        for (const char of "SKRUV") {
            expect(game.letterStatus(char)).toBe(GameState.LETTER_STATE.ABSENT)
        }
    })

    test("submit guess with mix of letter states", () => {
        const game = GameState.fromState({
            currentInput: "SKRUV",
            guesses: [],
            letterStatuses: {},
            status: "playing",
            targetWord: "SKARV",
        })

        game.submitGuess()

        expect(game.letterStatus("S")).toBe(GameState.LETTER_STATE.CORRECT)

        expect(game.letterStatus("K")).toBe(GameState.LETTER_STATE.CORRECT)

        expect(game.letterStatus("R")).toBe(GameState.LETTER_STATE.PRESENT)

        expect(game.letterStatus("U")).toBe(GameState.LETTER_STATE.ABSENT)

        expect(game.letterStatus("V")).toBe(GameState.LETTER_STATE.CORRECT)
    })
})
