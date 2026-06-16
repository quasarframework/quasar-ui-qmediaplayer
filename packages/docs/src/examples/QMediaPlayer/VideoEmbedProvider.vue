<template>
  <div class="q-pa-md q-gutter-md">
    <q-banner rounded class="bg-blue-grey-1 text-blue-grey-10">
      Provider embed URLs return iframe players, not raw media files. Use QVideo for YouTube-style
      embeds and keep QMediaPlayer for native audio/video sources.
    </q-banner>

    <q-video :ratio="16 / 9" src="https://www.youtube-nocookie.com/embed/qZXt1Aom3Cs" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'VideoEmbedProvider' })
</script>
