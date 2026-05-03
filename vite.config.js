import { defineConfig } from "vite"

export default defineConfig({
    base: "./",
    build: {
        emptyOutDir: true,
        outDir: "../dist",
    },
    root: "src",
    server: {
        hot: true,
        port: 8080,
    },
})
