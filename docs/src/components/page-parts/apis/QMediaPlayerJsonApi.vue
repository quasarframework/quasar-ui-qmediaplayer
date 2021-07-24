<template>
  <json-api-viewer
    title="QMediaPlayer API"
    :json="json"
    no-menu
  />
</template>

<script>
import { defineComponent } from 'vue'
import Api from '@quasar/quasar-ui-qmediaplayer/dist/api/QMediaPlayer.json'

export default defineComponent({
  name: 'QMediaPlayerJsonApi',
  setup () {
    return {
      json: Api
    }
  }
})
</script>
