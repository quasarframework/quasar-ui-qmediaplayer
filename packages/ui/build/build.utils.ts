import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { blue, green, magenta, red, underline, yellow } from 'kolorist'
import { table } from 'table'

const nodeRequire = createRequire(import.meta.url)
const { version, name } = nodeRequire('../package.json') as {
  version: string
  name: string
}
const buildDir = path.dirname(fileURLToPath(import.meta.url))
const kebabRegex = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g
const tableData: string[][] = []
const verboseBuild =
  process.env.QMEDIAPLAYER_BUILD_VERBOSE === '1' || process.env.BUILD_VERBOSE === '1'

process.on('exit', (code) => {
  if (verboseBuild && code === 0 && tableData.length > 0) {
    tableData.sort((a, b) => {
      const [aType = '', aFile = ''] = a
      const [bType = '', bFile = ''] = b

      return aType === bType ? (aFile < bFile ? -1 : 1) : aType < bType ? -1 : 1
    })

    tableData.unshift([
      underline('Ext'),
      underline('Filename'),
      underline('Size'),
      underline('Gzipped'),
    ])

    const output = table(tableData, {
      columns: {
        0: { alignment: 'right' },
        1: { alignment: 'left' },
        2: { alignment: 'right' },
        3: { alignment: 'right' },
      },
    })

    console.log()
    console.log(` Summary of ${name} v${version}:`)
    console.log(output)
  }
})

function getSize(code: string | Buffer): string {
  return (code.length / 1024).toFixed(2) + 'kb'
}

export function createFolder(folder: string): void {
  const dir = path.join(buildDir, '..', folder)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

function getDestinationInfo(dest: string): {
  banner: string
  tableEntryType: string
  toTable: boolean
} {
  if (dest.endsWith('.json')) {
    return {
      banner: yellow('[json]'),
      tableEntryType: yellow('json'),
      toTable: true,
    }
  }

  if (dest.endsWith('.js') || dest.endsWith('.mjs')) {
    return {
      banner: green('[js]  '),
      tableEntryType: green('js'),
      toTable: dest.includes('dist/'),
    }
  }

  if (dest.endsWith('.css') || dest.endsWith('.scss') || dest.endsWith('.sass')) {
    return {
      banner: blue('[css] '),
      tableEntryType: blue('css'),
      toTable: true,
    }
  }

  if (dest.endsWith('.ts')) {
    return {
      banner: magenta('[ts]  '),
      tableEntryType: magenta('ts'),
      toTable: true,
    }
  }

  logError(`Unknown file type using buildUtils.writeFile: ${dest}`)
  process.exit(1)
}

export function writeFile(dest: string, code: string, zip?: boolean): Promise<string> {
  const { banner, tableEntryType, toTable } = getDestinationInfo(dest)
  const fileSize = getSize(code)
  const filePath = path.relative(process.cwd(), dest)

  return new Promise((resolve, reject) => {
    function report(gzippedString = '', gzippedSize = '-'): void {
      if (verboseBuild) {
        console.log(`${banner} ${filePath.padEnd(49)} ${fileSize.padStart(8)}${gzippedString}`)
      }

      if (verboseBuild && toTable) {
        tableData.push([tableEntryType, filePath, fileSize, gzippedSize])
      }

      resolve(code)
    }

    fs.writeFile(dest, code, (err) => {
      if (err) {
        reject(err)
        return
      }

      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) {
            reject(err)
            return
          }

          const size = getSize(zipped)
          report(` (gzipped: ${size.padStart(8)})`, size)
        })
        return
      }

      report()
    })
  })
}

export function readFile(file: string): string {
  return fs.readFileSync(file, 'utf-8')
}

export function fileExists(file: string): boolean {
  return fs.existsSync(file)
}

export function logError(err: unknown): void {
  console.error('\n' + red('[Error]'), err)
  console.log()
}

export function kebabCase(str: string): string {
  return str.replace(kebabRegex, (match) => '-' + match.toLowerCase()).substring(1)
}
