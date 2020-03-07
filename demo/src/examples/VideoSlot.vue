<template>
  <q-media-player
    type="video"
    :sources="sources"
    :poster="poster"
  >
    <template v-slot:overlay>
      <div>
        <img
          src="statics/quasar-logo.png"
          style="width: 30vw; max-width: 50px; opacity: 0.25;"
        >
      </div>
    </template>
  </q-media-player>
</template>

<script>
export default {
  data () {
    return {
      poster: 'statics/media/TearsOfSteel/TearsOfSteel.jpeg',
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
