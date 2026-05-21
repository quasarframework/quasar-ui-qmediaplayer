<template>
  <div class="q-pa-md">
    <q-media-player type="video" source="/media/pexels-ono-kosuki-5974545.mp4" />
  </div>
</template>

<script setup lang="ts">
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/src/index.scss";

defineOptions({ name: "VideoSource" });
</script>
