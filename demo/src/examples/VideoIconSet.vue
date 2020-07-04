<template>
  <div>
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
export default {
  data () {
    return {
      sources: [
        {
          src: 'http://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/tears_of_steel_720p.mov',
          type: 'video/mp4'
        }
      ],
      tracks: [
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
      ],
      iconSet: this.$q.iconSet.name,
      iconSetOptions: [
        { label: 'Eva Icons', value: 'eva-icons' },
        { label: 'Fontawesome', value: 'fontawesome-v5' },
        { label: 'Ion Icons', value: 'ionicons-v4' },
        { label: 'Material Icons', value: 'material-icons' },
        { label: 'MDI', value: 'mdi-v4' },
        { label: 'Themify', value: 'themify' }
      ]
    }
  },
  watch: {
    iconSet (iconSet) {
      switch (iconSet) {
        case 'eva-icons':
          this.changeIconSetToEvaIcons()
          break
        case 'fontawesome-v5':
          this.changeIconSetToFontAwesome()
          break
        case 'ionicons-v4':
          this.changeIconSetToIonIcons()
          break
        case 'material-icons':
          this.changeIconSetToMaterialIcons()
          break
        case 'mdi-v4':
          this.changeIconSetToMDI()
          break
        case 'themify':
          this.changeIconSetToThemify()
          break
      }
    }
  },
  methods: {
    // in this scenario, each icon set must have a
    // path and cannot be loaded dynamically.
    // This allows webpack to know each font that
    // could be used so it is available for loading.
    changeIconSetToEvaIcons () {
      this.$q.iconSet = require('quasar/icon-set/eva-icons.js').default
    },
    changeIconSetToFontAwesome () {
      this.$q.iconSet = require('quasar/icon-set/fontawesome-v5.js').default
    },
    changeIconSetToIonIcons () {
      this.$q.iconSet = require('quasar/icon-set/ionicons-v4.js').default
    },
    changeIconSetToMaterialIcons () {
      this.$q.iconSet = require('quasar/icon-set/material-icons.js').default
    },
    changeIconSetToMDI () {
      this.$q.iconSet = require('quasar/icon-set/mdi-v4.js').default
    },
    changeIconSetToThemify () {
      this.$q.iconSet = require('quasar/icon-set/themify.js').default
    }
  }
}
</script>
