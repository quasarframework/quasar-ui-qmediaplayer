/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 */

import { defineIndexScript } from '#q-app'

export default defineIndexScript((api) => {
  api.compatibleWith('quasar', '^2.0.0')
  api.compatibleWith('@quasar/app-vite', '>=3.0.0')

  api.registerDescribeApi(
    'QMediaPlayer',
    '~@quasar/quasar-ui-qmediaplayer/dist/api/QMediaPlayer.json',
  )

  api.extendQuasarConf(() => ({
    boot: ['~@quasar/quasar-app-extension-qmediaplayer/dist/boot/vite-register.js'],
    css: ['~@quasar/quasar-ui-qmediaplayer/src/index.scss'],
    framework: {
      plugins: ['AppFullscreen'],
    },
  }))
})
