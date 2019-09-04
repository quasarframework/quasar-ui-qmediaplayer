import QMediaPlayer from '@quasar/quasar-app-extension-qmediaplayer/src/component/QMediaPlayer'

export default ({ Vue, ssrContext }) => {
  Vue.component('q-media-player', QMediaPlayer(ssrContext))
}
