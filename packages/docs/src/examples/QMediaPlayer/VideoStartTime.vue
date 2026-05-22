<template>
  <div class="q-pa-md">
    <q-media-player type="video" :sources="sources" mobile-mode />
  </div>
</template>

<script setup lang="ts">
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";

defineOptions({ name: "VideoStartTime" });

const sources = [
  {
    src: "https://www.peach.themazzone.com/durian/movies/sintel-2048-surround.mp4#t=90",
    type: "video/mp4",
  },
];
</script>
