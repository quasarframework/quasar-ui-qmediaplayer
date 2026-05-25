<template>
  <div class="q-pa-md q-gutter-md">
    <q-banner rounded class="bg-blue-grey-1 text-blue-grey-10">
      MPEG-DASH playback is handled by <code>dash.js</code>, loaded only when this example needs it.
      QMediaPlayer emits the native media element so the DASH adapter can initialize against it.
    </q-banner>

    <q-media-player type="video" cross-origin="anonymous" @media-player="attachDash" />

    <div class="text-caption text-grey-7">
      {{ status }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";

defineOptions({ name: "VideoDash" });

interface DashMediaPlayer {
  initialize: (media: HTMLMediaElement, source: string, autoPlay?: boolean) => void;
  reset: () => void;
}

interface DashJsApi {
  MediaPlayer: () => {
    create: () => DashMediaPlayer;
  };
  supportsMediaSource: () => boolean;
}

declare global {
  interface Window {
    dashjs?: DashJsApi;
  }
}

const dashSource = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";
const dashScriptUrl = "https://cdn.jsdelivr.net/npm/dashjs@5.1.1/dist/modern/umd/dash.all.min.js";
const status = ref("Waiting for the media element...");

let dashPlayer: DashMediaPlayer | null = null;
let activeMedia: HTMLMediaElement | null = null;
let disposed = false;
let dashLoader: Promise<DashJsApi> | null = null;

async function attachDash(media: HTMLMediaElement | null) {
  activeMedia = media;
  resetDash();

  if (media === null) {
    status.value = "Waiting for the media element...";
    return;
  }

  status.value = "Preparing DASH stream...";

  let dashjs: DashJsApi;

  try {
    dashjs = await loadDashJs();
  } catch (err) {
    if (disposed === false && activeMedia === media) {
      status.value = err instanceof Error ? err.message : "Unable to load the DASH adapter.";
    }

    return;
  }

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

function loadDashJs() {
  if (window.dashjs !== void 0) {
    return Promise.resolve(window.dashjs);
  }

  if (dashLoader !== null) {
    return dashLoader;
  }

  dashLoader = new Promise<DashJsApi>((resolve, reject) => {
    const script = document.createElement("script");

    script.src = dashScriptUrl;
    script.async = true;
    script.dataset.qmediaplayerDashjs = "";
    script.onload = () => {
      if (window.dashjs === void 0) {
        reject(new Error("dash.js loaded, but did not expose a DASH adapter."));
        return;
      }

      resolve(window.dashjs);
    };
    script.onerror = () => {
      reject(new Error("Unable to load the DASH adapter."));
    };

    document.head.append(script);
  });

  return dashLoader;
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
