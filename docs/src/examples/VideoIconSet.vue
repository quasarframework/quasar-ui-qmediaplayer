<template>
  <div class="q-pa-md q-gutter-sm">
    <q-select
      v-model="iconSet"
      :options="iconSetOptions"
      label="Icon set"
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
      mobile-mode
    />
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/src/index.sass'

export default defineComponent({
  name: 'VideoIconSet',
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
    const iconSet = ref($q.iconSet.name)
    const iconSetOptions = [
      { label: 'Eva Icons', value: 'eva-icons' },
      { label: 'Fontawesome', value: 'fontawesome-v5' },
      { label: 'Ion Icons', value: 'ionicons-v4' },
      { label: 'Material Icons', value: 'material-icons' },
      { label: 'MDI', value: 'mdi-v4' },
      { label: 'Themify', value: 'themify' },
      { label: 'Line Awesome', value: 'line-awesome' },
      { label: 'Bootstrap Icons', value: 'bootstrap-icons' }
    ]

    watch(iconSet, val => {
      switch (val) {
        case 'eva-icons':
          changeIconSetToEvaIcons()
          break
        case 'fontawesome-v5':
          changeIconSetToFontAwesome()
          break
        case 'ionicons-v4':
          changeIconSetToIonIcons()
          break
        case 'material-icons':
          changeIconSetToMaterialIcons()
          break
        case 'mdi-v4':
          changeIconSetToMDI()
          break
        case 'themify':
          changeIconSetToThemify()
          break
        case 'line-awesome':
          changeIconSetToLineAwesome()
          break
        case 'bootstrap-icons':
          changeIconSetToBootstrapIcons()
          break
      }
    })

    // in this scenario, each icon set must have a
    // path and cannot be loaded dynamically.
    // This allows webpack to know each font that
    // could be used so it is available for loading.
    function changeIconSetToEvaIcons () {
      $q.iconSet.set(require('quasar/icon-set/eva-icons.js').default)
    }

    function changeIconSetToFontAwesome () {
      $q.iconSet.set(require('quasar/icon-set/fontawesome-v5.js').default)
    }

    function changeIconSetToIonIcons () {
      $q.iconSet.set(require('quasar/icon-set/ionicons-v4.js').default)
    }

    function changeIconSetToMaterialIcons () {
      $q.iconSet.set(require('quasar/icon-set/material-icons.js').default)
    }

    function changeIconSetToMDI () {
      $q.iconSet.set(require('quasar/icon-set/mdi-v4.js').default)
    }

    function changeIconSetToThemify () {
      $q.iconSet.set(require('quasar/icon-set/themify.js').default)
    }

    function changeIconSetToLineAwesome () {
      $q.iconSet.set(require('quasar/icon-set/line-awesome.js').default)
    }

    function changeIconSetToBootstrapIcons () {
      $q.iconSet.set(require('quasar/icon-set/bootstrap-icons.js').default)
    }

    return {
      sources,
      tracks,
      iconSet,
      iconSetOptions
    }
  }
})
</script>
