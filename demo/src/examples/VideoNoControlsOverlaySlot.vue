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
      <div class="column text-white bg-teal q-pa-md q-mt-xs">
        <div class="row">
          <q-btn size="xl" class="q-ml-sm" :icon="isPlaying ? 'stop': 'play_arrow'" @click="$refs.qmp.togglePlay()" outline></q-btn>
          <q-space></q-space>
          <q-btn @click="$refs.qmp.toggleFullscreen()" flat icon="fullscreen"></q-btn>
        </div>
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
