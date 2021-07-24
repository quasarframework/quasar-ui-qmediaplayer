<template>
  <div class="q-pa-md">
    <q-media-player
      type="video"
      :sources="sources"
      mobile-mode
    />
  </div>

</template>

<script>
import { defineComponent } from 'vue'
import QMediaPlayer from '@quasar/quasar-ui-qmediaplayer/src/components/QMediaPlayer.js'
import '@quasar/quasar-ui-qmediaplayer/src/QMediaPlayer.sass'

export default defineComponent({
  name: 'VideoStartTime',
  components: {
    QMediaPlayer
  },

  setup () {
    const sources = [
      {
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4#t=90',
        type: 'video/mp4'
      }
    ]

    return {
      sources
    }
  }
})
</script>
