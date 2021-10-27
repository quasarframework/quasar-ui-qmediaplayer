<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'

import { provideMarkdownStore } from 'assets/markdown-store.js'
import getMeta from 'assets/get-meta.js'

export default defineComponent({
  name: 'App',

  setup () {
    useMeta({
      title: 'QMediaPlayer » HTML5 media player for your Quasar apps',
      titleTemplate: title => `${ title } » QMediaPlayer`,

      meta: getMeta(
        'QMediaPlayer - HTML5 media player for your Quasar apps',
        'QMediaPlayer allows playing HTML5 video for your Quasar apps.'
      )
    })

    provideMarkdownStore()
  }
})
</script>
