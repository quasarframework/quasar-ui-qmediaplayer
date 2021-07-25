<template>
  <div class="q-pa-md">
    <q-media-player
      type="audio"
      source="https://raw.githubusercontent.com/quasarframework/quasar-ui-qmediaplayer/dev/demo/public/media/Scott_Holmes_-_04_-_Upbeat_Party.mp3"
    />
  </div>

</template>

<script>
import { defineComponent } from 'vue'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/src/QMediaPlayer.sass'

export default defineComponent({
  name: 'AudioSource',
  components: {
    QMediaPlayer
  }
})
</script>
