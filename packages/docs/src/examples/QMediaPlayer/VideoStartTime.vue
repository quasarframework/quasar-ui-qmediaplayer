<template>
  <div class="q-pa-md">
    <q-media-player type="video" :sources="sources" mobile-mode />
  </div>
</template>

<script setup lang="ts">
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/src/index.scss";

defineOptions({ name: "VideoStartTime" });

const sources = [
  {
    src: "/media/pexels-ono-kosuki-5974545.mp4#t=5",
    type: "video/mp4",
  },
];
</script>
