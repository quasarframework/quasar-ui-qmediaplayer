import { readdirSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))
const examplesDir = join(rootDir, 'packages/docs/src/examples')

function readVueFiles(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)

    if (entry.isDirectory()) {
      readVueFiles(path, files)
    } else if (entry.isFile() && path.endsWith('.vue')) {
      files.push(path)
    }
  }

  return files
}

function slugifyRouteSegment(value) {
  return value
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/([a-z])(\d)/g, '$1-$2')
    .replace(/(\d)([A-Za-z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/^(\d)/, '_$1')
}

function exampleFileToRoute(file) {
  const key = `./${relative(examplesDir, file).replaceAll('\\', '/')}`
  const parts = key.substring(1, key.length - 4).split('/')
  const routeParts = parts.at(-2) === parts.at(-1) ? parts.slice(0, -1) : parts

  routeParts[0] = '/examples'

  if (routeParts[2]?.startsWith(routeParts[1])) {
    routeParts[2] = slugifyRouteSegment(routeParts[2].replace(routeParts[1], ''))
  } else if (routeParts[2] !== undefined) {
    routeParts[2] = slugifyRouteSegment(routeParts[2])
  }

  if (routeParts[1] !== undefined) {
    routeParts[1] = slugifyRouteSegment(routeParts[1])
  }

  return routeParts.join('/').replace(/\/{2,}/g, '/')
}

const exampleRoutes = readVueFiles(examplesDir).map(exampleFileToRoute).sort()

export default {
  api: {
    entries: [
      {
        docsUrl: '/developing/using-qmediaplayer',
        input: 'packages/ui/src/components/QMediaPlayer.ts',
        output: 'packages/ui/dist/api/QMediaPlayer.json',
      },
    ],
  },
  check: {
    allowedRoutes: [...exampleRoutes],
  },
}
