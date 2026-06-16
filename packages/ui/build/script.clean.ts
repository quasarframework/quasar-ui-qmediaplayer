import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { rimrafSync } from 'rimraf'

const buildDir = dirname(fileURLToPath(import.meta.url))

export function cleanDist(): void {
  rimrafSync(resolve(buildDir, '../dist'))
  console.log(' 💥 Cleaned build artifacts.')
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  cleanDist()
}
