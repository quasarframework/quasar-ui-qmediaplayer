import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { blue } from 'kolorist'

const nodeRequire = createRequire(import.meta.url)
const buildDir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(buildDir, '../../..')
const resolvePath = (file: string): string => path.resolve(root, file)

type PackageJson = {
  name: string
  version: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

function writeJson(file: string, json: PackageJson): void {
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf-8')
}

function updateDependency(
  dependencies: Record<string, string> | undefined,
  name: string,
  version: string,
): boolean {
  if (dependencies?.[name]) {
    const currentSpecifier = dependencies[name]
    dependencies[name] = currentSpecifier.startsWith('workspace:') ? 'workspace:^' : '^' + version
    return true
  }

  return false
}

export function syncAppExt(both = true): void {
  const appExtDir = resolvePath('packages/app-extension')
  if (!fs.existsSync(appExtDir)) {
    return
  }

  const uiDir = resolvePath('packages/ui')
  if (!fs.existsSync(uiDir)) {
    return
  }

  const { name, version } = nodeRequire(resolvePath('packages/ui/package.json')) as PackageJson
  const appExtFile = resolvePath('packages/app-extension/package.json')
  const appExtJson = nodeRequire(appExtFile) as PackageJson

  if (both === true) {
    appExtJson.version = version
  }

  const finished =
    updateDependency(appExtJson.dependencies, name, version) ||
    updateDependency(appExtJson.devDependencies, name, version)

  if (finished === true) {
    writeJson(appExtFile, appExtJson)
    console.log(` ⭐️ App Extension version ${blue(appExtJson.name)} synced with UI version.\n`)
    return
  }

  console.error('   App Extension version and dependency NOT synced.\n')
}
