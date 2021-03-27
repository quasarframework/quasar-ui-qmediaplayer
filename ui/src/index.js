import { version } from '../package.json'
import QMediaPlayer from './components/QMediaPlayer'

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
