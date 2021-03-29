<template>
  <q-media-player
    type="video"
    :sources="sources"
    :poster="poster"
  />
</template>

<script>
export default {
  data () {
    return {
      poster: 'media/TearsOfSteel/TearsOfSteel.jpeg',
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
