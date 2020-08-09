<template>
  <q-media-player
    content-style="height: 100px; width: 100px"
    bottom-controls
    :sources="sources"
    ref="qmp"
    type="video"
  >
    <template v-slot:overlay>
      <div class="full-width full-height"
           style="top: 0; left: 0; position: absolute">
        <div class="column q-ma-md q-pa-sm  bg-amber-3" style="position:absolute;">
          We are playing the audio in video type player to test the <code>
          bottom-controls
        </code>
        </div>
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
          src: 'https://raw.githubusercontent.com/quasarframework/quasar-ui-qmediaplayer/dev/demo/src/statics/media/Scott_Holmes_-_04_-_Upbeat_Party.mp3',
          type: 'audio/mp3'
        }
      ]
    }
  }
}
</script>
