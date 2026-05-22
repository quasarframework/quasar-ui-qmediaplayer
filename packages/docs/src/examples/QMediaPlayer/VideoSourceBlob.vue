<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input v-model="media" filled clearable type="file" style="width: 50%" class="q-pa-md" />
    <q-media-player ref="mediaplayer" type="video" autoplay :source="itemUrl" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";

defineOptions({ name: "VideoSourceBlob" });

const media = ref<FileList | null>(null);
const itemUrl = ref<string | undefined>();
const mediaplayer = ref<{ loadFileBlob: (files: FileList) => void } | null>(null);

watch(
  () => media.value,
  (fileList) => {
    if (fileList && fileList.length > 0) {
      loadFileBlob(fileList);
    }
  },
);

function loadFileBlob(fileList: FileList) {
  mediaplayer.value?.loadFileBlob(fileList);
}
</script>
