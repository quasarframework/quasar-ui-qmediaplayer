/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

const extendConf = function (api, conf) {
  // for brevity
  let directives = conf.framework.directives

  // make sure directive CloseMenu is added
  if (!directives.includes('CloseMenu')) {
    console.log(` App Extension (qmediaplayer) Info: 'Adding CloseMenu directive - consider adding this to your quasar.conf.js'`)
    directives.push('CloseMenu')
  }
  // make sure directive Ripple is added
  if (!directives.includes('Ripple')) {
    console.log(` App Extension (qmediaplayer) Info: 'Adding Ripple directive - consider adding this to your quasar.conf.js'`)
    directives.push('Ripple')
  }

  // for brevity
  let boot = conf.boot

  // make sure qmediaplayer boot file is registered
  const bootFile = '~@quasar/quasar-app-extension-qmediaplayer/src/boot/qmediaplayer.js'
  if (!boot.includes(bootFile)) {
    boot.push(bootFile)
    // make sure boot file transpiles
    conf.build.transpileDependencies.push(/quasar-app-extension-qmediaplayer[\\/]src[\\/]boot/)
    conf.build.transpileDependencies.push(/quasar-app-extension-qmediaplayer[\\/]src[\\/]component/)
    console.log(` App Extension (qmediaplayer) Info: 'Adding qmediaplayer boot reference to your quasar.conf.js'`)
  }

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
  // register JSON api
  api.registerDescribeApi('QMediaPlayer', '../component/QMediaPlayer.json')

  // extend quasar.conf
  api.extendQuasarConf((conf) => {
    extendConf(api, conf)
  })
}
