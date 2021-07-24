<template>
  <div class="q-pa-md">
    <q-media-player
      type="video"
      :sources="sources"
      :poster="poster"
    >
      <template v-slot:overlay>
        <div>
          <img
            src="icons/favicon-32x32.png"
            style="width: 30vw; max-width: 50px; opacity: 0.25;"
          >
        </div>
      </template>
    </q-media-player>
  </div>

</template>

<script>
import { defineComponent } from 'vue'
import QMediaPlayer from '@quasar/quasar-ui-qmediaplayer/src/components/QMediaPlayer.js'
import '@quasar/quasar-ui-qmediaplayer/src/QMediaPlayer.sass'

export default defineComponent({
  name: 'VideoSlot',
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
