import type { App } from 'vue'

import QMediaPlayer from './components/QMediaPlayer'
import { version } from './version'

function install(app: App): void {
  app.component(String(QMediaPlayer.name), QMediaPlayer)
}

export { version, QMediaPlayer, install }

export default {
  version,
  QMediaPlayer,
  install,
}
