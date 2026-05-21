<template>
  <div class="q-pa-md">
    <q-media-player type="video" :sources="sources" mobile-mode />
  </div>
</template>

<script setup lang="ts">
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/src/index.sass";

defineOptions({ name: "VideoStartTime" });

const sources = [
  {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4#t=90",
    type: "video/mp4",
  },
];
</script>
