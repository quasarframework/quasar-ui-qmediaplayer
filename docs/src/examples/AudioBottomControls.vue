<template>
  <div class="q-pa-md">
    <q-media-player
      type="video"
      :sources="sources"
      bottom-controls
    >
      <template v-slot:overlay>
        <div class="full-width full-height"
            style="top: 0; left: 0; position: absolute">
          <div class="q-ma-md q-pa-sm  bg-amber-3 text-black rounded-borders" style="position:absolute;">
            We are playing the audio in video type player to test the <code class="markdown--token">
            bottom-controls</code> property.
          </div>
        </div>
      </template>
    </q-media-player>
  </div>

</template>

<script>
import { defineComponent } from 'vue'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/src/index.sass'

export default defineComponent({
  name: 'AudioBottomControls',
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
