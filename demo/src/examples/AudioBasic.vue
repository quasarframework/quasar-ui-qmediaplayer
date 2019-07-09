<template>
  <q-media-player
    type="audio"
    :sources="sources"
  />
</template>

<script>
export default {
  data () {
    return {
      sources: [
        {
          src: 'statics/media/Dee_Yan-Key_-_01_-_Driving_Home.mp3',
          type: 'audio/mp3'
        }
      ]
    }
  }
}
</script>
