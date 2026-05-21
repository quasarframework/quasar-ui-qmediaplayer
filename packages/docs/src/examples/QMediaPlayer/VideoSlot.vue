<template>
  <div class="q-pa-md">
    <q-media-player type="video" :sources="sources" :poster="poster">
      <template #overlay>
        <div>
          <img src="/qmediaplayer-logo.svg" style="width: 30vw; max-width: 50px; opacity: 0.25" />
        </div>
      </template>
    </q-media-player>
  </div>
</template>

<script setup lang="ts">
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/src/index.scss";

defineOptions({ name: "VideoSlot" });

const poster = "/media/TearsOfSteel/TearsOfSteel.jpeg";
const sources = [
  {
    src: "/media/pexels-ono-kosuki-5974545.mp4",
    type: "video/mp4",
  },
];
</script>
