import QMediaPlayer from '@quasar/quasar-app-extension-qmediaplayer/src/component/QMediaPlayer'
import { Colorize } from 'quasar-mixin-colorize'

export default ({ Vue, ssrContext }) => {
  Vue.component('q-media-player', QMediaPlayer(ssrContext))
  Vue.component(Colorize)
}
