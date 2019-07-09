<template>
  <q-media-player
    type="video"
    :sources="sources"
    color='orange-8'
  />
</template>

<script>
export default {
  data () {
    return {
      sources: [
        {
          src: 'https://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/ToS-4k-1920.mov',
          type: 'video/mp4'
        }
      ]
    }
  }
}
</script>
