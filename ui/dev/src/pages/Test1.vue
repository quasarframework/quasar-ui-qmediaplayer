<template>
  <q-page padding>
    <q-media-player
      type="video"
      :sources="sources"
    ></q-media-player>
  </q-page>
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
