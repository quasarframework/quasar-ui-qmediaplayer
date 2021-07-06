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
        { label: 'Bootstrap Icons', value: 'bootstrap-icons' },
        { label: 'Eva Icons', value: 'eva-icons' },
        { label: 'Fontawesome', value: 'fontawesome-v5' },
        { label: 'Ion Icons', value: 'ionicons-v4' },
        { label: 'Material Icons', value: 'material-icons' },
        { label: 'Material Icons (outlined)', value: 'material-icons-outlined' },
        { label: 'Material Icons (round)', value: 'material-icons-round' },
        { label: 'Material Icons (sharp)', value: 'material-icons-sharp' },
        { label: 'MDI', value: 'mdi-v5' },
        { label: 'Themify', value: 'themify' },
        { label: 'Line Awesome', value: 'line-awesome' },
        { label: '(SVG) Bootstrap Icons', value: 'svg-bootstrap-icons' },
        { label: '(SVG) Eva Icons', value: 'svg-eva-icons' },
        { label: '(SVG) Fontawesome', value: 'svg-fontawesome-v5' },
        { label: '(SVG) Ion Icons', value: 'svg-ionicons-v4' },
        { label: '(SVG) Material Icons', value: 'svg-material-icons' },
        { label: '(SVG) Material Icons (outlined)', value: 'svg-material-icons-outlined' },
        { label: '(SVG) Material Icons (round)', value: 'svg-material-icons-round' },
        { label: '(SVG) Material Icons (sharp)', value: 'svg-material-icons-sharp' },
        { label: '(SVG) MDI', value: 'svg-mdi-v5' },
        { label: '(SVG) Themify', value: 'svg-themify' },
        { label: '(SVG) Line Awesome', value: 'svg-line-awesome' }
      ]
    }
  },
  watch: {
    iconSet (iconSet) {
      switch (iconSet) {
        case 'bootstrap-icons':
          this.changeIconSetToBootstrapIcons()
          break
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
        case 'material-icons-outlined':
          this.changeIconSetToMaterialIconsOutlined()
          break
        case 'material-icons-round':
          this.changeIconSetToMaterialIconsRound()
          break
        case 'material-icons-sharp':
          this.changeIconSetToMaterialIconsSharp()
          break
        case 'mdi-v5':
          this.changeIconSetToMDI()
          break
        case 'themify':
          this.changeIconSetToThemify()
          break
        case 'line-awesome':
          this.changeIconSetToSvgLineAwesome()
          break
        case 'svg-bootstrap-icons':
          this.changeIconSetToSvgBootstrapIcons()
          break
        case 'svg-eva-icons':
          this.changeIconSetToSvgEvaIcons()
          break
        case 'svg-fontawesome-v5':
          this.changeIconSetToSvgFontAwesome()
          break
        case 'svg-ionicons-v4':
          this.changeIconSetToSvgIonIcons()
          break
        case 'svg-material-icons':
          this.changeIconSetToSvgMaterialIcons()
          break
        case 'svg-material-icons-outlined':
          this.changeIconSetToSvgMaterialIconsOutlined()
          break
        case 'svg-material-icons-round':
          this.changeIconSetToSvgMaterialIconsRound()
          break
        case 'svg-material-icons-sharp':
          this.changeIconSetToSvgMaterialIconsSharp()
          break
        case 'svg-mdi-v5':
          this.changeIconSetToSvgMDI()
          break
        case 'svg-themify':
          this.changeIconSetToSvgThemify()
          break
        case 'svg-line-awesome':
          this.changeIconSetToSvgLineAwesome()
          break
      }
    }
  },
  methods: {
    // in this scenario, each icon set must have a
    // path and cannot be loaded dynamically.
    // This allows webpack to know each font that
    // could be used so it is available for loading.
    changeIconSetToBootstrapIcons () {
      this.$q.iconSet = require('quasar/icon-set/bootstrap-icons.js').default
    },
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
    changeIconSetToMaterialIconsOutlined () {
      this.$q.iconSet = require('quasar/icon-set/material-icons-outlined.js').default
    },
    changeIconSetToMaterialIconsRound () {
      this.$q.iconSet = require('quasar/icon-set/material-icons-round.js').default
    },
    changeIconSetToMaterialIconsSharp () {
      this.$q.iconSet = require('quasar/icon-set/material-icons-sharp.js').default
    },
    changeIconSetToMDI () {
      this.$q.iconSet = require('quasar/icon-set/mdi-v5.js').default
    },
    changeIconSetToThemify () {
      this.$q.iconSet = require('quasar/icon-set/themify.js').default
    },
    changeIconSetToLineAwesome () {
      this.$q.iconSet = require('quasar/icon-set/line-awesome.js').default
    },
    changeIconSetToSvgBootstrapIcons () {
      this.$q.iconSet = require('quasar/icon-set/svg-bootstrap-icons.js').default
    },
    changeIconSetToSvgEvaIcons () {
      this.$q.iconSet = require('quasar/icon-set/svg-eva-icons.js').default
    },
    changeIconSetToSvgFontAwesome () {
      this.$q.iconSet = require('quasar/icon-set/svg-fontawesome-v5.js').default
    },
    changeIconSetToSvgIonIcons () {
      this.$q.iconSet = require('quasar/icon-set/svg-ionicons-v4.js').default
    },
    changeIconSetToSvgMaterialIcons () {
      this.$q.iconSet = require('quasar/icon-set/svg-material-icons.js').default
    },
    changeIconSetToSvgMaterialIconsOutlined () {
      this.$q.iconSet = require('quasar/icon-set/svg-material-icons-outlined.js').default
    },
    changeIconSetToSvgMaterialIconsRound () {
      this.$q.iconSet = require('quasar/icon-set/svg-material-icons-round.js').default
    },
    changeIconSetToSvgMaterialIconsSharp () {
      this.$q.iconSet = require('quasar/icon-set/svg-material-icons-sharp.js').default
    },
    changeIconSetToSvgMDI () {
      this.$q.iconSet = require('quasar/icon-set/svg-mdi-v5.js').default
    },
    changeIconSetToSvgThemify () {
      this.$q.iconSet = require('quasar/icon-set/svg-themify.js').default
    },
    changeIconSetToSvgLineAwesome () {
      this.$q.iconSet = require('quasar/icon-set/line-awesome.js').default
    }
  }
}
</script>
