/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

const extendWithMediaPlayer = function (api, conf) {
  // make sure there is a framework section
  if (!conf.framework) {
    conf.framework = {}
  }
  
  // make sure there is a directives array
  if (!conf.framework.directives) {
    conf.framework.directives = []
  }

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

  // make sure there is a boot array
  if (!conf.boot) {
    conf.boot = []
  }

  // for brevity
  let boot = conf.boot

  // make sure qmediaplayer boot file is registered
  if (!boot.includes('~@quasar/quasar-app-extension-qmediaplayer/boot/qmediaplayer.js')) {
    boot.push('~@quasar/quasar-app-extension-qmediaplayer/boot/qmediaplayer.js')
    // make sure boot file transpiles
    conf.build.transpileDependencies.push(/quasar-app-extension-qmediaplayer[\\/]src[\\/]boot/)
    console.log(` App Extension (qmediaplayer) Info: 'Adding qmediaplayer boot reference to your quasar.conf.js'`)
  }

  // make sure there is a css array
  if (!conf.css) {
    conf.css = []
  }
  
  // for brevity
  let css = conf.css

  // make sure qmediaplayer css goes through webpack to avoid ssr issues
  if (!css.includes('~@quasar/quasar-app-extension-qmediaplayer/component/media-player.styl')) {
    css.push('~@quasar/quasar-app-extension-qmediaplayer/component/media-player.styl')
    console.log(` App Extension (qmediaplayer) Info: 'Adding media-player.styl css reference to your quasar.conf.js'`)
  }
}

module.exports = function (api, ctx) {
  api.registerDescribeApi('QMediaPlayer', '../component/QMediaPlayer.json')

  api.extendQuasarConf((conf) => {
    return new Promise((resolve, reject) => {
      console.log('QMediaPlayer boot before:', conf.boot)
      console.log('QMediaPlayer css before:', conf.css)
      extendWithMediaPlayer(api, conf)
      console.log('QMediaPlayer boot after:', conf.boot)
      console.log('QMediaPlayer css after:', conf.css)
      resolve()
    })
  })
}
