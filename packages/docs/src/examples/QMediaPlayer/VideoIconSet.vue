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
    <q-banner
      v-if="iconSet === 'custom-media-player'"
      rounded
      class="bg-blue-grey-1 text-blue-grey-10 q-ma-sm"
    >
      This option uses Material Icons with a custom <code>mediaPlayer</code> icon group.
    </q-banner>
    <q-media-player type="video" :sources="sources" :tracks="tracks" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import bootstrapIcons from "quasar/icon-set/bootstrap-icons";
import evaIcons from "quasar/icon-set/eva-icons";
import fontawesomeV6 from "quasar/icon-set/fontawesome-v6";
import fontawesomeV7 from "quasar/icon-set/fontawesome-v7";
import lineAwesome from "quasar/icon-set/line-awesome";
import materialIcons from "quasar/icon-set/material-icons";
import mdiV6 from "quasar/icon-set/mdi-v6";
import mdiV7 from "quasar/icon-set/mdi-v7";
import svgIoniconsV7 from "quasar/icon-set/svg-ionicons-v7";
import svgIoniconsV8 from "quasar/icon-set/svg-ionicons-v8";
import themify from "quasar/icon-set/themify";
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";

defineOptions({ name: "VideoIconSet" });

const iconSets = {
  "eva-icons": evaIcons,
  "fontawesome-v6": fontawesomeV6,
  "fontawesome-v7": fontawesomeV7,
  "material-icons": materialIcons,
  "mdi-v6": mdiV6,
  "mdi-v7": mdiV7,
  "svg-ionicons-v7": svgIoniconsV7,
  "svg-ionicons-v8": svgIoniconsV8,
  themify,
  "line-awesome": lineAwesome,
  "bootstrap-icons": bootstrapIcons,
  "custom-media-player": {
    ...materialIcons,
    mediaPlayer: {
      play: "play_circle",
      pause: "pause_circle",
      volumeOff: "volume_off",
      volumeDown: "volume_down",
      volumeUp: "volume_up",
      settings: "tune",
      speed: "speed",
      language: "subtitles",
      selected: "done",
      fullscreen: "fullscreen",
      fullscreenExit: "fullscreen_exit",
      bigPlayButton: "slow_motion_video",
    },
  },
};

type IconSetName = keyof typeof iconSets;

const sources = [
  {
    src: "https://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/tears_of_steel_720p.mov",
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
const $q = useQuasar();
const iconSet = ref<IconSetName>(
  Object.prototype.hasOwnProperty.call(iconSets, $q.iconSet.name)
    ? ($q.iconSet.name as IconSetName)
    : "material-icons",
);
const iconSetOptions: Array<{ label: string; value: IconSetName }> = [
  { label: "Eva Icons", value: "eva-icons" },
  { label: "Font Awesome v6", value: "fontawesome-v6" },
  { label: "Font Awesome v7", value: "fontawesome-v7" },
  { label: "Material Icons", value: "material-icons" },
  { label: "MDI v6", value: "mdi-v6" },
  { label: "MDI v7", value: "mdi-v7" },
  { label: "Ionicons v7 (SVG)", value: "svg-ionicons-v7" },
  { label: "Ionicons v8 (SVG)", value: "svg-ionicons-v8" },
  { label: "Themify", value: "themify" },
  { label: "Line Awesome", value: "line-awesome" },
  { label: "Bootstrap Icons", value: "bootstrap-icons" },
  { label: "Custom mediaPlayer group", value: "custom-media-player" },
];

watch(iconSet, (val) => {
  $q.iconSet.set(iconSets[val]);
});
</script>
