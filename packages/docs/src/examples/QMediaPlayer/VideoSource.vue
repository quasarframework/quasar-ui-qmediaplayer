<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm q-mb-md">
      <q-btn label="Load video" :disable="!!source" @click="source = videoSource" />
      <q-btn label="Clear video" :disable="!source" @click="source = ''" />
    </div>
    <q-media-player type="video" :source="source" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/dist/index.css'

defineOptions({ name: 'VideoSource' })

const videoSource = 'https://www.peach.themazzone.com/durian/movies/sintel-2048-surround.mp4'
const source = ref(videoSource)
</script>
