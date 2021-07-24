<template>
  <div class="q-pa-md">
    <q-media-player
      type="video"
      :sources="sources"
      :tracks="tracks"
    />
  </div>

</template>

<script>
import { defineComponent } from 'vue'
import QMediaPlayer from '@quasar/quasar-ui-qmediaplayer/src/components/QMediaPlayer.js'
import '@quasar/quasar-ui-qmediaplayer/src/QMediaPlayer.sass'

export default defineComponent({
  name: 'VideoTracks',
  components: {
    QMediaPlayer
  },

  setup () {
    const sources = [
      {
        src: 'http://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/tears_of_steel_720p.mov',
        type: 'video/mp4'
      }
    ]
    const tracks = [
      {
        src: 'media/TearsOfSteel/TOS-en.vtt',
        kind: 'subtitles',
        srclang: 'en',
        label: 'English'
      },
      {
        src: 'media/TearsOfSteel/TOS-de.vtt',
        kind: 'subtitles',
        srclang: 'de',
        label: 'German'
      },
      {
        src: 'media/TearsOfSteel/TOS-es.vtt',
        kind: 'subtitles',
        srclang: 'es',
        label: 'Spanish'
      },
      {
        src: 'media/TearsOfSteel/TOS-fr-Goofy.vtt',
        kind: 'subtitles',
        srclang: 'fr',
        label: 'French'
      },
      {
        src: 'media/TearsOfSteel/TOS-it.vtt',
        kind: 'subtitles',
        srclang: 'it',
        label: 'Italian'
      },
      {
        src: 'media/TearsOfSteel/TOS-nl.vtt',
        kind: 'subtitles',
        srclang: 'nl',
        label: 'Dutch'
      }
    ]

    return {
      sources,
      tracks
    }
  }
})
</script>
