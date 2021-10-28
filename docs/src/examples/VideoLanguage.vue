<template>
  <div class="q-pa-md q-gutter-sm">
    <q-select
      v-model="lang"
      :options="langOptions"
      label="Language"
      dense
      borderless
      emit-value
      map-options
      options-dense
      style="min-width: 150px"
      class="q-ma-sm"
    />
    <q-media-player
      type="video"
      :sources="sources"
      :tracks="tracks"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onBeforeMount, watch } from 'vue'
import { useQuasar } from 'quasar'
import languages from 'quasar/lang/index.json'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/src/index.sass'

export default defineComponent({
  name: 'VideoLanguage',
  components: {
    QMediaPlayer
  },

  setup () {
    const sources = [
      {
        src: 'http://www.peach.themazzone.com/durian/movies/sintel-2048-surround.mp4',
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
    const $q = useQuasar()
    const lang = ref($q.lang.isoName)
    const langOptions = ref([])

    onBeforeMount(() => {
      langOptions.value = languages.map(l => ({
        label: l.nativeName, value: l.isoName
      }))
    })

    watch(lang, val => {
      // dynamic import, so loading on demand only
      import('quasar/lang/' + val).then(lang => {
        $q.lang.set(lang.default)
      })
    })

    return {
      sources,
      tracks,
      lang,
      langOptions
    }
  }
})
</script>
