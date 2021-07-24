import QMediaPlayer from './components/QMediaPlayer'
import pkg from '../package.json'
const { version } = pkg

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
