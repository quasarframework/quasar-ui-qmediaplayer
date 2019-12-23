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
          src: 'http://www.peach.themazzone.com/durian/movies/sintel-2048-surround.mp4',
          type: 'video/mp4'
        }
      ]
    }
  }
}
</script>
