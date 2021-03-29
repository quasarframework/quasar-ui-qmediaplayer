<template>
  <div style="max-width: 800px; width: 100%;">
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
      type="audio"
      :sources="sources"
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
          src: 'https://raw.githubusercontent.com/quasarframework/quasar-ui-qmediaplayer/dev/demo/public/media/Scott_Holmes_-_04_-_Upbeat_Party.mp3',
          type: 'audio/mp3'
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
      const iconSet = require(`quasar/icon-set/${ name }.js`).default
      this.$q.iconSet.set(iconSet)
    }
  }
}
</script>
