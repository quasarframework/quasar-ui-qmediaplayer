<template>
  <q-media-player
    content-style="height: 200px;"
    background-color="teal-3"
    :sources="sources"
    ref="qmp"
    :no-controls-overlay="true"
    type="video"
  >
    <template v-slot:controls>
      <div class="text-white bg-teal q-pa-md q-mt-xs">Your control panel which doesn't cover the video
        <q-btn @click="$refs.qmp.toggleFullscreen()" flat icon="fullscreen"></q-btn>
        <q-btn @click="$refs.qmp.togglePlay()" outline>Toggle play</q-btn>
      </div>
    </template>
  </q-media-player>
</template>

<script>
export default {
  data () {
    return {
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
