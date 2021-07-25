<template>
  <div class="q-pa-md">
    <q-media-player
      type="video"
      :sources="sources"
      native-controls
    />
  </div>

</template>

<script>
import { defineComponent } from 'vue'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/src/QMediaPlayer.sass'

export default defineComponent({
  name: 'VideoNativeControls',
  components: {
    QMediaPlayer
  },

  setup () {
    const sources = [
      {
        src: 'http://www.peach.themazzone.com/durian/movies/sintel-2048-surround.mp4',
        type: 'video/mp4'
      }
    ]

    return {
      sources
    }
  }
})
</script>
