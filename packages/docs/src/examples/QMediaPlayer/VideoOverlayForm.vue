<template>
  <div class="q-pa-md">
    <q-media-player
      type="video"
      :sources="sources"
      :poster="poster"
      :toggle-play-on-click="false"
      bottom-controls
    >
      <template #overlay>
        <div class="absolute-center q-pa-md" style="width: min(360px, 90%)">
          <q-card flat bordered class="bg-white text-grey-9 q-pa-md shadow-4">
            <div class="text-subtitle2 q-mb-sm">Interactive overlay</div>
            <q-input v-model="email" dense filled label="Email address" type="email" />
            <q-btn color="primary" class="q-mt-md full-width" label="Save preference" no-caps />
          </q-card>
        </div>
      </template>
    </q-media-player>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";

defineOptions({ name: "VideoOverlayForm" });

const email = ref("");
const poster = "/media/TearsOfSteel/TearsOfSteel.jpeg";
const sources = [
  {
    src: "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
    type: "video/mp4",
  },
];
</script>
