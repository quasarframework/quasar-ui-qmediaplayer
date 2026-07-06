<template>
  <div class="q-pa-md">
    <q-media-player
      type="video"
      :sources="sources"
      poster="/qmediaplayer-social-preview.png"
      bottom-controls
      class="audio-art-player"
      :content-style="{
        backgroundColor: '#0b1016',
        objectFit: 'contain',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/dist/index.css'

defineOptions({ name: 'AudioWithPoster' })

const sources = [
  {
    src: '/media/Scott_Holmes_-_04_-_Upbeat_Party.mp3',
    type: 'audio/mp3',
  },
]
</script>

<style lang="scss" scoped>
.audio-art-player {
  aspect-ratio: 16 / 9;
  max-width: 720px;
  margin-inline: auto;
}
</style>
