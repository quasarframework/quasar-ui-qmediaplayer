<template>
  <div class="q-pa-md">
    <q-media-player type="audio" :sources="sources" disabled-seek />
  </div>
</template>

<script setup lang="ts">
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/dist/index.css'

defineOptions({ name: 'AudioDisabledSeek' })

const sources = [
  {
    src: '/media/Scott_Holmes_-_04_-_Upbeat_Party.mp3',
    type: 'audio/mp3',
  },
]
</script>
