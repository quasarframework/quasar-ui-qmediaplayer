<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      This example uses a "dummy" url that won't resolve. Open the dev console to see additional
      error information.
    </div>
    <q-media-player type="video" :sources="sources" />
  </div>
</template>

<script setup lang="ts">
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/src/index.scss";

defineOptions({ name: "VideoError" });

const sources = [
  {
    // this video does not exist and will cause an error
    src: "https://some-unknown-service.com/video.mp4",
    type: "video/mp4",
  },
];
</script>
