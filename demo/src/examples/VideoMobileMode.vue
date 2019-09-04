<template>
  <q-media-player
    type="video"
    :sources="sources"
    :poster="poster"
    mobile-mode
  />
</template>

<script>
export default {
  data () {
    return {
      poster: 'statics/media/TearsOfSteel/TearsOfSteel.jpeg',
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
