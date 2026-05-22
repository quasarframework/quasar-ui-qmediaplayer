<template>
  <div class="q-pa-md q-gutter-md">
    <q-banner rounded class="bg-blue-grey-1 text-blue-grey-10">
      HLS streams need either native browser HLS support or a JavaScript adapter such as
      <code>hls.js</code>. QMediaPlayer supplies the controls; the adapter owns stream loading.
    </q-banner>

    <q-media-player type="video" cross-origin="anonymous" @media-player="attachHls" />

    <div class="text-caption text-grey-7">
      {{ status }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import type Hls from "hls.js";
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";

defineOptions({ name: "VideoHls" });

const hlsSource = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
const status = ref("Waiting for the media element...");

let hls: Hls | null = null;
let activeMedia: HTMLMediaElement | null = null;
let disposed = false;

async function attachHls(media: HTMLMediaElement | null) {
  activeMedia = media;
  resetHls();

  if (media === null) {
    status.value = "Waiting for the media element...";
    return;
  }

  status.value = "Preparing HLS stream...";

  if (media.canPlayType("application/vnd.apple.mpegurl")) {
    media.src = hlsSource;
    status.value = "Using native browser HLS support.";
    return;
  }

  const { default: Hls } = await import("hls.js");

  if (disposed === true || activeMedia !== media) {
    return;
  }

  if (Hls.isSupported() !== true) {
    status.value = "HLS is not supported by this browser.";
    return;
  }

  hls = new Hls();
  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    status.value = "HLS stream is ready. Use the player controls to start playback.";
  });
  hls.on(Hls.Events.ERROR, (_event, data) => {
    if (data.fatal === true) {
      status.value = `HLS error: ${data.type}`;
    }
  });
  hls.loadSource(hlsSource);
  hls.attachMedia(media);
}

function resetHls() {
  hls?.destroy();
  hls = null;
}

onBeforeUnmount(() => {
  disposed = true;
  resetHls();
});
</script>
