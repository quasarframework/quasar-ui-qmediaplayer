<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="qmediaplayer-portrait-example">
        <q-media-player
          type="video"
          :sources="sources"
          :content-style="{
            objectFit: 'cover',
          }"
          class="qmediaplayer-portrait-example__player"
        />
        <div class="q-mt-sm text-caption text-center">
          Video by
          <strong
            ><a
              target="_blank"
              href="https://www.pexels.com/@ono-kosuki?utm_content=attributionCopyText&amp;utm_medium=referral&amp;utm_source=pexels"
              >Ono Kosuki</a
            ></strong
          >
          from
          <strong
            ><a
              target="_blank"
              href="https://www.pexels.com/photo/a-woman-texting-on-her-cellphone-5974545/?utm_content=attributionCopyText&amp;utm_medium=referral&amp;utm_source=pexels"
              >Pexels</a
            ></strong
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";

defineOptions({ name: "VideoPortrait" });

const sources = [
  {
    src: "/media/pexels-ono-kosuki-5974545.mp4",
    type: "video/mp4",
  },
];
</script>

<style lang="scss" scoped>
.qmediaplayer-portrait-example {
  width: min(220px, 100%);
}

.qmediaplayer-portrait-example__player {
  aspect-ratio: 9 / 16;
  max-height: 420px;
  overflow: hidden;
}
</style>
