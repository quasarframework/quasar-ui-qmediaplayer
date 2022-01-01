process.env.NODE_ENV = 'production'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const parallel = require('os').cpus().length > 1
const runJob = parallel ? require('child_process').fork : require

import { createFolder } from './utils.js'
import chalk from 'chalk'
const { green, blue } = chalk

console.log()

import { syncAppExt } from './script.app-ext.js'
syncAppExt()

import './script.clean.js'

console.log(` 📦 Building ${ green('v' + require('../package.json').version) }...${ parallel ? blue(' [multi-threaded]') : '' }\n`)

createFolder('dist/api')

import './script.version.js'

import './build.api.js'
import './script.javascript.js'
import './script.css.js'
// runJob(join(__dirname, './script.javascript.js'))
// runJob(join(__dirname, './script.css.js'))
