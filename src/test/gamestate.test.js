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
        const game = new GameState()
        const word = ["S", "K", "R", "U", "V", "Ö"]

        word.forEach((letter) => {
            game.addLetter(letter)
        })

        expect(game.currentInput).toHaveLength(GameState.MAX_WORD_SIZE)
        expect(game.currentInput).not.toContain("Ö")
    })
})
