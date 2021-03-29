<template>
  <div class="flex flex-center">
    <q-media-player
      :native-controls="true"
      :no-controls="true"
      :sources="sources"
      color="white"
      type="video"
      style="width: 600px; height: 400px;"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      sources: [
        {
          src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          type: 'video/mp4'
        }
      ]
    }
  }
}
</script>
