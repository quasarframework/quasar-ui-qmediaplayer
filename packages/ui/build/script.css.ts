/* eslint-disable array-bracket-spacing */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import postcss from 'postcss'
import rtl from 'rtlcss'
import * as sass from 'sass-embedded'

import buildConf from './config'
import * as buildUtils from './build.utils'

const buildDir = path.dirname(fileURLToPath(import.meta.url))
const postCssCompiler = postcss([autoprefixer()])
const postCssRtlCompiler = postcss([rtl({})])

const nano = postcss([
  cssnano({
    preset: [
      'default',
      {
        mergeLonghand: false,
        convertValues: false,
        cssDeclarationSorter: false,
        reduceTransforms: false,
      },
    ],
  }),
])

generate('src/index.scss', 'dist/index').catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})

function resolvePath(relativePath: string): string {
  return path.resolve(buildDir, '..', relativePath)
}

async function generate(src: string, dest: string): Promise<void> {
  const source = resolvePath(src)
  const destination = resolvePath(dest)

  const result = await sass.compileAsync(source, { loadPaths: ['node_modules'] })
  let code = buildConf.banner + result.css
  const prefixed = await postCssCompiler.process(code, { from: undefined })

  prefixed.warnings().forEach((warn) => {
    console.warn(warn.toString())
  })

  code = prefixed.css
  const rtlCode = await postCssRtlCompiler.process(code, { from: undefined })

  await Promise.all([generateUMD(destination, code), generateUMD(destination, rtlCode.css, '.rtl')])
}

async function generateUMD(dest: string, code: string, ext = ''): Promise<void> {
  const source = await buildUtils.writeFile(`${dest}${ext}.css`, code, true)
  const minified = await nano.process(source, { from: undefined })

  await buildUtils.writeFile(`${dest}${ext}.min.css`, minified.css, true)
}
