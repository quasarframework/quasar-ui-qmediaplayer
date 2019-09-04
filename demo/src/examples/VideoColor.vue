<template>
  <q-media-player
    type="video"
    :sources="sources"
    color="orange-8"
    big-play-button-color="yellow-8"
  />
</template>

<script>
export default {
  data () {
    return {
      sources: [
        {
          src: 'https://ftp.halifax.rwth-aachen.de/blender/demo/movies/Sintel.2010.1080p.mkv',
          type: 'video/mp4'
        }
      ]
    }
  }
}
</script>
