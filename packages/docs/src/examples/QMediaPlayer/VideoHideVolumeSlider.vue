<template>
  <div class="q-pa-md">
    <q-media-player type="video" :sources="sources" hide-volume-slider dense />
  </div>
</template>

<script setup lang="ts">
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/src/index.sass";

defineOptions({ name: "VideoHideVolumeSlider" });

const sources = [
  {
    src: "http://www.peach.themazzone.com/durian/movies/sintel-2048-surround.mp4",
    type: "video/mp4",
  },
];
</script>
