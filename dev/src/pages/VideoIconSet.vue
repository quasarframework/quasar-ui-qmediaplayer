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
        { label: 'Line Awesome', value: 'line-awesome' },
        { label: 'Material Icons', value: 'material-icons' },
        { label: 'Material Icons Outlined', value: 'material-icons-outlined' },
        { label: 'Material Icons Round', value: 'material-icons-round' },
        { label: 'Material Icons Sharp', value: 'material-icons-sharp' },
        { label: 'MDI v5', value: 'mdi-v5' },
        { label: 'Themify', value: 'themify' },
        { label: 'SVG Bootstrap Icons', value: 'svg-bootstrap-icons' },
        { label: 'SVG Eva Icons', value: 'svg-eva-icons' },
        { label: 'SVG Fontawesome', value: 'svg-fontawesome-v5' },
        { label: 'SVG Ion Icons', value: 'svg-ionicons-v4' },
        { label: 'SVG Line Awesome', value: 'svg-line-awesome' },
        { label: 'SVG Material Icons', value: 'svg-material-icons' },
        { label: 'SVG Material Icons Outlined', value: 'svg-material-icons-outlined' },
        { label: 'SVG Material Icons Round', value: 'svg-material-icons-round' },
        { label: 'SVG Material Icons Sharp', value: 'svg-material-icons-sharp' },
        { label: 'SVG MDI v5', value: 'svg-mdi-v5' },
        { label: 'SVG Themify', value: 'svg-themify' }
      ]
    }
  },
  watch: {
    iconSet (iconSet) {
      this.changeIconSet(iconSet)
    }
  },
  methods: {
    changeIconSet (name) {
      const iconSet = require(`quasar/icon-set/${name}.js`).default
      this.$q.iconSet.set(iconSet)
    }
  }
}
</script>
