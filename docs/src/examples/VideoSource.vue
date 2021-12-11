<template>
  <div class="q-pa-md">
    <q-media-player
      type="video"
      source="http://www.peach.themazzone.com/durian/movies/sintel-2048-surround.mp4"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/src/index.sass'

export default defineComponent({
  name: 'VideoSource',
  components: {
    QMediaPlayer
  }
})
</script>
