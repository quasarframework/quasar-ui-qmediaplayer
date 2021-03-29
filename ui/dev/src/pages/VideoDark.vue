<template>
  <q-media-player
    type="video"
    :sources="sources"
    background-color="blue-grey-2"
    dark
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
