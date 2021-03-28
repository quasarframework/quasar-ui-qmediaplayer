<template>
  <div style="max-width: 800px; width: 100%;">
    <q-media-player
      type="audio"
      no-video
      :sources="sources"
    />
  </div>
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
