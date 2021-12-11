<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input
      v-model="media"
      filled
      clearable
      type="file"
      style="width: 50%;"
      class="q-pa-md"
    />
    <q-media-player
      ref="mediaplayer"
      type="video"
      autoplay
      :source="itemUrl"
    />
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/src/index.sass'

export default defineComponent({
  name: 'VideoSourceBlob',
  components: {
    QMediaPlayer
  },

  setup () {
    const media = ref(null)
    const itemUrl = ref(null)
    const mediaplayer = ref(null)

    watch(() => media.value, fileList => {
      if (fileList && fileList.length > 0) {
        loadFileBlob(fileList)
      }
    })

    function loadFileBlob (fileList) {
      mediaplayer.value.loadFileBlob(fileList)
    }

    return {
      media,
      itemUrl,
      mediaplayer
    }
  }
})
</script>
