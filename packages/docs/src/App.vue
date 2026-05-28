<template>
  <router-view />
</template>

<script setup lang="ts">
import { useMeta } from "quasar";
import { useDark } from "@/.q-press/composables/dark";

import getMeta from "@/.q-press/assets/get-meta";

const { initDark } = useDark();
initDark();

useMeta({
  title: "QMediaPlayer for Vue and Quasar",
  titleTemplate: (title) => `${title} | QMediaPlayer`,

  meta: getMeta(
    "QMediaPlayer - HTML5 media player for Vue and Quasar",
    "QMediaPlayer is a Vue and Quasar component for building HTML5 audio and video players.",
  ),
});
</script>
