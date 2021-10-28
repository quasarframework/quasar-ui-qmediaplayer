<template>
  <div class="q-pa-md">
    <q-media-player
      type="audio"
      :sources="sources"
      hide-volume-slider
      dense
    />
  </div>

</template>

<script>
import { defineComponent } from 'vue'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/src/index.sass'

export default defineComponent({
  name: 'AudioHideVolumeSliderDense',
  components: {
    QMediaPlayer
  },

  setup () {
    const sources = [
      {
        src: 'https://raw.githubusercontent.com/quasarframework/quasar-ui-qmediaplayer/dev/demo/public/media/Scott_Holmes_-_04_-_Upbeat_Party.mp3',
        type: 'audio/mp3'
      }
    ]

    return {
      sources
    }
  }
})
</script>
