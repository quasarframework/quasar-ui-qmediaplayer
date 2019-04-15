/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

const extendConf = function (api, conf) {
  // for brevity
  let boot = conf.boot

  // make sure qmediaplayer boot file is registered
  const bootFile = '~@quasar/quasar-app-extension-qmediaplayer/src/boot/qmediaplayer.js'
  if (!boot.includes(bootFile)) {
    boot.push(bootFile)
    console.log(` App Extension (qmediaplayer) Info: 'Adding qmediaplayer boot reference to your quasar.conf.js'`)
  }

  // make sure boot file transpiles
  conf.build.transpileDependencies.push(/quasar-app-extension-qmediaplayer[\\/]src/)


  // for brevity
  let css = conf.css

  // make sure qmediaplayer css goes through webpack to avoid ssr issues
  const cssFile = '~@quasar/quasar-app-extension-qmediaplayer/src/component/media-player.styl'
  if (!css.includes(cssFile)) {
    css.push(cssFile)
    console.log(` App Extension (qmediaplayer) Info: 'Adding media-player.styl css reference to your quasar.conf.js'`)
  }
}

module.exports = function (api, ctx) {
  // quasar compatibility check
  api.compatibleWithQuasarApp('^1.0.0-beta.17')

  // register JSON api
  api.registerDescribeApi('QMediaPlayer', './component/QMediaPlayer.json')

  // extend quasar.conf
  api.extendQuasarConf((conf) => {
    extendConf(api, conf)
  })
}
