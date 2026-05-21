<template>
  <div class="q-pa-md q-gutter-sm">
    <q-select
      v-model="iconSet"
      :options="iconSetOptions"
      label="Icon set"
      dense
      borderless
      emit-value
      map-options
      options-dense
      style="min-width: 150px"
      class="q-ma-sm"
    />
    <q-media-player type="video" :sources="sources" :tracks="tracks" mobile-mode />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import bootstrapIcons from "quasar/icon-set/bootstrap-icons";
import evaIcons from "quasar/icon-set/eva-icons";
import fontawesomeV5 from "quasar/icon-set/fontawesome-v5";
import ioniconsV4 from "quasar/icon-set/ionicons-v4";
import lineAwesome from "quasar/icon-set/line-awesome";
import materialIcons from "quasar/icon-set/material-icons";
import mdiV4 from "quasar/icon-set/mdi-v4";
import themify from "quasar/icon-set/themify";
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/src/index.sass";

defineOptions({ name: "VideoIconSet" });

const iconSets = {
  "eva-icons": evaIcons,
  "fontawesome-v5": fontawesomeV5,
  "ionicons-v4": ioniconsV4,
  "material-icons": materialIcons,
  "mdi-v4": mdiV4,
  themify,
  "line-awesome": lineAwesome,
  "bootstrap-icons": bootstrapIcons,
};

type IconSetName = keyof typeof iconSets;

const sources = [
  {
    src: "http://www.peach.themazzone.com/durian/movies/sintel-2048-surround.mp4",
    type: "video/mp4",
  },
];
const tracks = [
  {
    src: "media/TearsOfSteel/TOS-en.vtt",
    kind: "subtitles",
    srclang: "en",
    label: "English",
  },
  {
    src: "media/TearsOfSteel/TOS-de.vtt",
    kind: "subtitles",
    srclang: "de",
    label: "German",
  },
  {
    src: "media/TearsOfSteel/TOS-es.vtt",
    kind: "subtitles",
    srclang: "es",
    label: "Spanish",
  },
  {
    src: "media/TearsOfSteel/TOS-fr-Goofy.vtt",
    kind: "subtitles",
    srclang: "fr",
    label: "French",
  },
  {
    src: "media/TearsOfSteel/TOS-it.vtt",
    kind: "subtitles",
    srclang: "it",
    label: "Italian",
  },
  {
    src: "media/TearsOfSteel/TOS-nl.vtt",
    kind: "subtitles",
    srclang: "nl",
    label: "Dutch",
  },
];
const $q = useQuasar();
const iconSet = ref<IconSetName>(
  Object.prototype.hasOwnProperty.call(iconSets, $q.iconSet.name)
    ? ($q.iconSet.name as IconSetName)
    : "material-icons",
);
const iconSetOptions: Array<{ label: string; value: IconSetName }> = [
  { label: "Eva Icons", value: "eva-icons" },
  { label: "Fontawesome", value: "fontawesome-v5" },
  { label: "Ion Icons", value: "ionicons-v4" },
  { label: "Material Icons", value: "material-icons" },
  { label: "MDI", value: "mdi-v4" },
  { label: "Themify", value: "themify" },
  { label: "Line Awesome", value: "line-awesome" },
  { label: "Bootstrap Icons", value: "bootstrap-icons" },
];

watch(iconSet, (val) => {
  $q.iconSet.set(iconSets[val]);
});
</script>
