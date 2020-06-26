<template>
  <q-media-player
    :no-controls-overlay="true"
    :sources="sources"
    @playing="isPlaying = true"
    @paused="isPlaying = false"
    background-color="teal-3"
    content-style="height: 200px;"
    ref="qmp"
    type="video"
  >
    <template v-slot:controls>
      <div class="text-white bg-teal q-pa-md q-mt-xs">Custom control panel doesn't cover the video
        <q-btn @click="$refs.qmp.toggleFullscreen()" flat icon="fullscreen"></q-btn>
        <q-btn :icon="isPlaying ? 'stop': 'play_arrow'" @click="$refs.qmp.togglePlay()" outline></q-btn>
      </div>
    </template>
  </q-media-player>
</template>

<script>
export default {
  data () {
    return {
      isPlaying: false,
      sources: [
        {
          src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4#t=300',
          type: 'video/mp4'
        }
      ]
    }
  }
}
</script>
