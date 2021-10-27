import QMediaPlayer from './components/QMediaPlayer'
import { version } from './version'

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
