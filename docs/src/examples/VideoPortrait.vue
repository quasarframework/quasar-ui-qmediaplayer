<template>
  <div class="q-pa-md">
    <div class="row col justify-center">
      <div style="max-width: 100%">
        <q-media-player
          type="video"
          :sources="sources"
          style="height: 400px; text-align: center; width: 200px;"
        />
        <div>Video by <strong><a target="_blank" href="https://www.pexels.com/@ono-kosuki?utm_content=attributionCopyText&amp;utm_medium=referral&amp;utm_source=pexels">Ono  Kosuki</a></strong> from <strong><a target="_blank" href="https://www.pexels.com/photo/a-woman-texting-on-her-cellphone-5974545/?utm_content=attributionCopyText&amp;utm_medium=referral&amp;utm_source=pexels">Pexels</a></strong></div>
      </div>
    </div>
  </div>

</template>

<script>
import { defineComponent } from 'vue'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/src/index.sass'

export default defineComponent({
  name: 'VideoPortrait',
  components: {
    QMediaPlayer
  },

  setup () {
    const sources = [
      {
        src: 'media/pexels-ono-kosuki-5974545.mp4',
        type: 'video/mp4'
      }
    ]

    return {
      sources
    }
  }
})
</script>
