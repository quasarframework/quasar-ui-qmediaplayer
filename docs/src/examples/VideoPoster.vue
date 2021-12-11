<template>
  <div class="q-pa-md">
    <q-media-player
      type="video"
      :sources="sources"
      :poster="poster"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/src/index.sass'

export default defineComponent({
  name: 'VideoPoster',
  components: {
    QMediaPlayer
  },

  setup () {
    const poster = 'media/TearsOfSteel/TearsOfSteel.jpeg'
    const sources = [
      {
        src: 'http://www.peach.themazzone.com/durian/movies/sintel-2048-surround.mp4',
        type: 'video/mp4'
      }
    ]

    return {
      poster,
      sources
    }
  }
})
</script>
