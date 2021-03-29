<template>
  <q-media-player
    :sources="sources"
    type="video"
    mobile-mode
  />
</template>

<script>
export default {
  data () {
    return {
      sources: [
        {
          src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4#t=90',
          type: 'video/mp4'
        }
      ]
    }
  }
}
</script>
