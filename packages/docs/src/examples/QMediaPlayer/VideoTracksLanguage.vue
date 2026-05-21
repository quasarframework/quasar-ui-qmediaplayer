<template>
  <div class="q-pa-md">
    <q-media-player type="video" :sources="sources" :tracks="tracks" track-language="French" />
  </div>
</template>

<script setup lang="ts">
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/src/index.scss";

defineOptions({ name: "VideoTracksLanguage" });

const sources = [
  {
    src: "/media/pexels-ono-kosuki-5974545.mp4",
    type: "video/mp4",
  },
];
const tracks = [
  {
    src: "/media/TearsOfSteel/TOS-en.vtt",
    kind: "subtitles",
    srclang: "en",
    label: "English",
  },
  {
    src: "/media/TearsOfSteel/TOS-de.vtt",
    kind: "subtitles",
    srclang: "de",
    label: "German",
  },
  {
    src: "/media/TearsOfSteel/TOS-es.vtt",
    kind: "subtitles",
    srclang: "es",
    label: "Spanish",
  },
  {
    src: "/media/TearsOfSteel/TOS-fr-Goofy.vtt",
    kind: "subtitles",
    srclang: "fr",
    label: "French",
  },
  {
    src: "/media/TearsOfSteel/TOS-it.vtt",
    kind: "subtitles",
    srclang: "it",
    label: "Italian",
  },
  {
    src: "/media/TearsOfSteel/TOS-nl.vtt",
    kind: "subtitles",
    srclang: "nl",
    label: "Dutch",
  },
];
</script>
