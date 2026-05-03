const STORAGE_KEY = "svrdl-state"

export const load = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return JSON.parse(raw)
    } catch (error) {
        console.error(
            `no state found in localStorage, key: ${STORAGE_KEY} ${error}`,
        )
        return false
    }
}

export const store = (state) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
        console.error(
            `could not save game state to localStorage, key: ${STORAGE_KEY} ${error}`,
        )
    }
}

export const clear = () => {
    localStorage.removeItem(STORAGE_KEY)
}
