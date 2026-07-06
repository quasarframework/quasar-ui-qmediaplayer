import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { writeFile } from './build.utils'

const buildDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(buildDir, '..')
const langDir = path.join(rootDir, 'lang')
const nodeRequire = createRequire(import.meta.url)

type QuasarLang = {
  isoName: string
  nativeName: string
}

const quasarLanguages = nodeRequire('quasar/lang/index.json') as QuasarLang[]
const nativeNames = new Map(quasarLanguages.map(({ isoName, nativeName }) => [isoName, nativeName]))

function parseStringProp(prop: string, txt: string, filename: string): string {
  const match = new RegExp(`${prop}:\\s*["']([^"']+)["']`).exec(txt)

  if (match === null) {
    throw new Error(`Unable to parse ${prop} from ${filename}`)
  }

  const value = match[1]

  if (value === undefined) {
    throw new Error(`Unable to parse ${prop} from ${filename}`)
  }

  return value
}

export async function buildLang(): Promise<void> {
  const languages: Array<{ isoName: string; nativeName: string }> = []
  const files = fs
    .readdirSync(langDir)
    .filter((file) => file.endsWith('.mjs'))
    .sort((a, b) => a.localeCompare(b))

  files.forEach((file) => {
    const fullPath = path.join(langDir, file)
    const content = fs.readFileSync(fullPath, 'utf-8')
    const isoName = parseStringProp('lang', content, file)
    const nativeName = nativeNames.get(isoName) ?? isoName

    languages.push({ isoName, nativeName })
  })

  languages.sort((a, b) => a.isoName.localeCompare(b.isoName))

  await writeFile(path.join(langDir, 'index.json'), JSON.stringify(languages, null, 2) + '\n')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildLang().catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
}
