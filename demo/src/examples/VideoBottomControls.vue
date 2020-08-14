<template>
  <q-media-player
    id="bottomControls"
    :bottom-controls="true"
    :sources="sources"
    color="white"
    type="video"
  />
</template>

<script>
export default {
  data () {
    return {
      sources: [
        {
          src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4#t=100',
          type: 'video/mp4'
        }
      ]
    }
  }
}
</script>
<style style="sass">
  #bottomControls .q-media__controls {
    background: teal;
  }
</style>
