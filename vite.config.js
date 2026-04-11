import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
  root: resolve(__dirname, 'src'),
  server: {
    port: 8080,
    hot: true,
  },
}
