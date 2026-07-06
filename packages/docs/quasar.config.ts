// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app'
import { viteExamplesPlugin, viteManualChunks } from '@md-plugins/vite-examples-plugin'
import { viteMdPlugin, type MenuItem } from '@md-plugins/vite-md-plugin'
import { viteSearchPlugin } from '@md-plugins/vite-search-plugin'

export default defineConfig(async (ctx) => {
  const siteConfig = await import('./src/siteConfig')
  const { sidebar } = siteConfig.default
  const uiDir = ctx.appPaths.appDir + '/../ui'

  return {
    boot: [],

    css: ['app.scss'],

    extras: [
      'bootstrap-icons',
      'eva-icons',
      'fontawesome-v7',
      'line-awesome',
      'material-icons',
      'mdi-v7',
      'roboto-font',
      'themify',
    ],

    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20',
      },

      typescript: {
        strict: true,
        vueShim: true,
        extendTsConfig(tsConfig) {
          tsConfig.compilerOptions ??= {}
          tsConfig.compilerOptions.exactOptionalPropertyTypes = false
          tsConfig.compilerOptions.paths ??= {}
          tsConfig.compilerOptions.paths['@quasar/quasar-ui-qmediaplayer'] = [
            './../../ui/src/index.ts',
          ]
          tsConfig.compilerOptions.paths['@quasar/quasar-ui-qmediaplayer/dist/api/*'] = [
            './../../ui/dist/api/*',
          ]
        },
      },

      vueRouterMode: 'history',

      extendViteConf(viteConf, { isClient }) {
        const alias = viteConf.resolve?.alias
        viteConf.resolve = viteConf.resolve || {}
        viteConf.resolve.alias = [
          ...(Array.isArray(alias)
            ? alias
            : Object.entries(alias ?? {}).map(([find, replacement]) => ({ find, replacement }))),
          // Consume workspace source in docs so examples track local UI edits.
          {
            find: /^@quasar\/quasar-ui-qmediaplayer$/,
            replacement: uiDir + '/src/index.ts',
          },
          // Keep API docs in Vite's local module graph during development.
          {
            find: /^@quasar\/quasar-ui-qmediaplayer\/dist\/api\/(.+)\.json$/,
            replacement: uiDir + '/dist/api/$1.json',
          },
          // Consume source styles in docs so local UI style edits HMR.
          {
            find: /^@quasar\/quasar-ui-qmediaplayer\/(?:dist\/)?index(?:\.rtl)?(?:\.min)?\.css$/,
            replacement: uiDir + '/src/index.scss',
          },
        ]

        if (ctx.prod && isClient) {
          viteConf.build = viteConf.build || {}
          viteConf.build.chunkSizeWarningLimit = 650

          const buildOptions = viteConf.build as typeof viteConf.build & {
            rolldownOptions?: {
              output?: {
                codeSplitting?: {
                  groups?: Array<{
                    name: (moduleId: string) => string | null
                  }>
                }
              }
            }
          }

          buildOptions.rolldownOptions = buildOptions.rolldownOptions || {}
          buildOptions.rolldownOptions.output = buildOptions.rolldownOptions.output || {}
          buildOptions.rolldownOptions.output.codeSplitting = {
            groups: [
              {
                name: (moduleId: string) => viteManualChunks(moduleId) ?? null,
              },
            ],
          }
        }
      },

      viteVuePluginOptions: {
        include: [/\.(vue|md)$/],
        template: {
          compilerOptions: {
            isPreTag: (tag) => tag === 'pre',
          },
        },
      },

      vitePlugins: [
        [
          viteMdPlugin,
          {
            path: ctx.appPaths.srcDir + '/markdown',
            menu: sidebar as MenuItem[],
            config: {
              headersPlugin: {
                shouldAllowExample: false,
              },
            },
          },
        ],
        [
          viteExamplesPlugin,
          {
            isProd: ctx.prod,
            path: ctx.appPaths.srcDir + '/examples',
          },
        ],
        viteSearchPlugin({
          markdown: {
            root: ctx.appPaths.srcDir + '/markdown',
            exclude: ['__*.md'],
          },
        }),
        [
          'vite-plugin-checker',
          {
            vueTsc: true,
          },
          { server: false },
        ],
      ],
    },

    devServer: {
      open: true,
      port: 8090,
    },

    framework: {
      config: {
        dark: 'auto',
        loadingBar: {
          color: 'red',
          position: 'top',
        },
      },

      plugins: [
        'AppFullscreen',
        'Dark',
        'Dialog',
        'LoadingBar',
        'LocalStorage',
        'Meta',
        'Notify',
        'Platform',
        'Screen',
      ],
    },

    animations: [],
  }
})
