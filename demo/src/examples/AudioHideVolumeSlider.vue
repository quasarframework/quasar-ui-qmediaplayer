<template>
  <div style="max-width: 800px; width: 100%;">
    <q-media-player
      type="audio"
      :sources="sources"
      hide-volume-slider
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      sources: [
        {
          src: 'statics/media/Scott_Holmes_-_04_-_Upbeat_Party.mp3',
          type: 'audio/mp3'
        }
      ]
    }
  }
}
</script>
