import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const nodeRequire = createRequire(import.meta.url)
const { version } = nodeRequire('../package.json') as { version: string }
const buildDir = path.dirname(fileURLToPath(import.meta.url))

const templatePath = path.resolve(buildDir, './version/version-template.ts')
const outputPath = path.resolve(buildDir, '../src/version.ts')

export function generateVersionFile(): void {
  const template = fs.readFileSync(templatePath, 'utf-8')
  fs.writeFileSync(outputPath, template.replace('__UI_VERSION__', `"${version}"`), 'utf-8')
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  generateVersionFile()
}
