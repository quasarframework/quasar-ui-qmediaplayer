import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { resolve } = require('path')
const open = require('open')

open(
  resolve(__dirname, '../umd-test.html')
)
