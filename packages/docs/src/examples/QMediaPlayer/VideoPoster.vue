<template>
  <div class="q-pa-md">
    <q-media-player type="video" :sources="sources" :poster="poster" />
  </div>
</template>

<script setup lang="ts">
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";

defineOptions({ name: "VideoPoster" });

const poster = "/media/TearsOfSteel/TearsOfSteel.jpeg";
const sources = [
  {
    src: "https://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/tears_of_steel_720p.mov",
    type: "video/mp4",
  },
];
</script>
