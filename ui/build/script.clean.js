import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const
  rimraf = require('rimraf'),
  path = require('path')

rimraf.sync(path.resolve(__dirname, '../dist/*'))
console.log(' 💥 Cleaned build artifacts.\n')
