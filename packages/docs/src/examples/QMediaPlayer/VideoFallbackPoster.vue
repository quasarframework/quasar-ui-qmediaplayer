<template>
  <div class="q-pa-md q-gutter-md">
    <q-toggle v-model="usePoster" label="Use explicit poster" />

    <q-media-player
      type="video"
      :sources="sources"
      :poster="usePoster ? poster : ''"
      :fallback-poster="fallbackPoster"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/dist/index.css'

defineOptions({ name: 'VideoFallbackPoster' })

const usePoster = ref(false)
const fallbackPoster = '/media/sintel/sintel-poster1.jpeg'
const poster = '/media/TearsOfSteel/TearsOfSteel.jpeg'
const sources = [
  {
    src: 'https://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/tears_of_steel_720p.mov',
    type: 'video/mp4',
  },
]
</script>
