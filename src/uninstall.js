/**
 * Quasar App Extension uninstall script
 *
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/UninstallAPI.js
 */
const fs = require('fs')
const path = require('path')

module.exports = function (api) {
  // TODO: remove boot file
  let qmediaplayerBootFile = path.resolve(process.cwd(), './src/boot/qmediaplayer.js')
  if (fs.existsSync(qmediaplayerBootFile)) {
    fs.unlinkSync(qmediaplayerBootFile)
    console.log(`App Extension (qmediaplayer) Info: 'qmediaplayer boot file removed'`)
  }
}
