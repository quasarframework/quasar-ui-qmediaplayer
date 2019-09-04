/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

const extendConf = function (conf) {
  // make sure qmediaplayer boot file is registered
  conf.boot.push('~@quasar/quasar-app-extension-qmediaplayer/src/boot/qmediaplayer.js')
  console.log(` App Extension (qmediaplayer) Info: 'Adding qmediaplayer boot reference to your quasar.conf.js'`)

  // make sure boot & component files transpile
  conf.build.transpileDependencies.push(/quasar-app-extension-qmediaplayer[\\/]src/)

  // make sure these plugins are in the build
  conf.framework.plugins.push('AppFullscreen')

  // make sure qmediaplayer css goes through webpack to avoid ssr issues
  conf.css.push('~@quasar/quasar-app-extension-qmediaplayer/src/component/media-player.styl')
  console.log(` App Extension (qmediaplayer) Info: 'Adding media-player.styl css reference to your quasar.conf.js'`)
}

module.exports = function (api) {
  // quasar compatibility check
  api.compatibleWith('@quasar/app', '^1.0.0')
  api.compatibleWith('@quasar/quasar-app-extension-colorize', '^1.0.0-alpha.1')

  // register JSON api
  api.registerDescribeApi('QMediaPlayer', './component/QMediaPlayer.json')

  // extend quasar.conf
  api.extendQuasarConf(extendConf)
}
