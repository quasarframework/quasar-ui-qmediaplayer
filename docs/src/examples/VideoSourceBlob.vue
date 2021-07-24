<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input v-model="media" filled clearable type="file" style="width: 50%;" class="q-pa-md"/>
    <q-media-player
      type="video"
      ref="mediaplayer"
      autoplay
      :source="itemUrl"
    />
  </div>

</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import QMediaPlayer from '@quasar/quasar-ui-qmediaplayer/src/components/QMediaPlayer.js'
import '@quasar/quasar-ui-qmediaplayer/src/QMediaPlayer.sass'

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
