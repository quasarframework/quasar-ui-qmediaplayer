<template>
  <div class="q-pa-md q-gutter-md">
    <q-banner rounded class="bg-primary text-white">
      Start the video, then scroll until this example leaves the viewport. Playback pauses
      automatically and stays paused until the user starts it again.
    </q-banner>

    <q-media-player type="video" :sources="sources" auto-pause />
  </div>
</template>

<script setup lang="ts">
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";

defineOptions({ name: "VideoAutoPause" });

const sources = [
  {
    src: "https://www.peach.themazzone.com/durian/movies/sintel-2048-surround.mp4",
    type: "video/mp4",
  },
];
</script>
