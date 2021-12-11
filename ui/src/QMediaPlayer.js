import QMediaPlayer from './components/QMediaPlayer.js'
import { version } from './version.js'

export {
  version,
  QMediaPlayer
}

export default {
  version,
  QMediaPlayer,

  install (app) {
    app.component(QMediaPlayer.name, QMediaPlayer)
  }
}
