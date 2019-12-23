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
          src: 'https://raw.githubusercontent.com/quasarframework/quasar-ui-qmediaplayer/dev/demo/src/statics/media/Scott_Holmes_-_04_-_Upbeat_Party.mp3',
          type: 'audio/mp3'
        }
      ],
      iconSet: this.$q.iconSet.name,
      iconSetOptions: [
        { label: 'Eva Icons', value: 'eva-icons' },
        { label: 'Fontawesome', value: 'fontawesome-v5' },
        { label: 'Ion Icons', value: 'ionicons-v4' },
        { label: 'Material Icons', value: 'material-icons' },
        { label: 'MDI', value: 'mdi-v3' },
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
        case 'mdi-v3':
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
      this.$q.iconSet = require('quasar/icon-set/mdi-v3.js').default
    },
    changeIconSetToThemify () {
      this.$q.iconSet = require('quasar/icon-set/themify.js').default
    }
  }
}
</script>
