<template>
  <div class="q-pa-md">
    <q-media-player
      type="audio"
      :sources="sources"
      style="--mediaplayer-color: #f57c00; --mediaplayer-color-dark: #f57c00"
    />
  </div>
</template>

<script setup lang="ts">
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/src/index.sass";

defineOptions({ name: "AudioColor" });

const sources = [
  {
    src: "https://raw.githubusercontent.com/quasarframework/quasar-ui-qmediaplayer/dev/demo/public/media/Scott_Holmes_-_04_-_Upbeat_Party.mp3",
    type: "audio/mp3",
  },
];
</script>
