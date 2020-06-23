<template>
  <q-media-player
    :sources="sources"
    color="primary"
    :no-controls-overlay="true"
    type="video"
  />
</template>

<script>
export default {
  data () {
    return {
      sources: [
        {
          src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4#t=100',
          type: 'video/mp4'
        }
      ]
    }
  }
}
</script>
