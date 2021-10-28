<template>
  <div class="q-pa-md">
    <q-media-player
      type="video"
      :sources="sources"
      style="
        --big-play-button-color: #fbc02d;
        --big-play-button-background: #d32f2f;
        --big-play-button-border: #ffff00;
        --big-play-button-hover-color: #d32f2f;
        --big-play-button-hover-background: #fbc02d;
        --big-play-button-border: #fbc02d 2px solid;
        --big-play-button-border-hover: #d32f2f 2px solid;
        --big-play-button-color-dark: #fbc02d;
        --big-play-button-background-dark: #d32f2f;
        --big-play-button-border-dark: #ffff00;
        --big-play-button-hover-color-dark: #d32f2f;
        --big-play-button-hover-background-dark: #fbc02d;
        --big-play-button-border-dark: #fbc02d 2px solid;
        --big-play-button-border-hover-dark: #d32f2f 2px solid;
      "
    />
  </div>

</template>

<script>
import { defineComponent } from 'vue'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/src/index.sass'

export default defineComponent({
  name: 'VideoColor',
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
