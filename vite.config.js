import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const dir_name = dirname(fileURLToPath(import.meta.url))

export default {
  root: resolve(dir_name, 'src'),
  server: {
    hot: true,
    port: 8080,
  },
}
