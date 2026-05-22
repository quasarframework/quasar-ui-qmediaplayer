<template>
  <div class="q-pa-md q-gutter-md">
    <q-banner rounded class="bg-blue-grey-1 text-blue-grey-10">
      MPEG-DASH playback is handled by <code>dash.js</code>. QMediaPlayer emits the native media
      element so the DASH adapter can initialize against it.
    </q-banner>

    <q-media-player type="video" cross-origin="anonymous" @media-player="attachDash" />

    <div class="text-caption text-grey-7">
      {{ status }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import type { MediaPlayerClass } from "dashjs";
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";

defineOptions({ name: "VideoDash" });

const dashSource = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";
const status = ref("Waiting for the media element...");

let dashPlayer: MediaPlayerClass | null = null;
let activeMedia: HTMLMediaElement | null = null;
let disposed = false;

async function attachDash(media: HTMLMediaElement | null) {
  activeMedia = media;
  resetDash();

  if (media === null) {
    status.value = "Waiting for the media element...";
    return;
  }

  status.value = "Preparing DASH stream...";

  const dashjs = await import("dashjs");

  if (disposed === true || activeMedia !== media) {
    return;
  }

  if (dashjs.supportsMediaSource() !== true) {
    status.value = "MPEG-DASH playback is not supported by this browser.";
    return;
  }

  dashPlayer = dashjs.MediaPlayer().create();
  dashPlayer.initialize(media, dashSource, false);
  status.value = "DASH stream is ready. Use the player controls to start playback.";
}

function resetDash() {
  dashPlayer?.reset();
  dashPlayer = null;
}

onBeforeUnmount(() => {
  disposed = true;
  resetDash();
});
</script>
