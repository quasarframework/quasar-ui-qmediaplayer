<template>
  <div class="q-pa-md q-gutter-sm">
    <q-file
      v-model="media"
      filled
      clearable
      label="Choose an audio file"
      accept="audio/*"
      style="width: 50%"
      class="q-pa-md"
    />
    <q-media-player ref="mediaplayer" type="audio" autoplay />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/dist/index.css'

defineOptions({ name: 'AudioSourceBlob' })

const media = ref<File | null>(null)
const mediaplayer = ref<{ loadBlob: (blob: Blob | File) => boolean } | null>(null)

watch(
  () => media.value,
  (file) => {
    if (file) {
      loadBlob(file)
    }
  },
)

function loadBlob(file: File) {
  mediaplayer.value?.loadBlob(file)
}
</script>
