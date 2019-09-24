<template>
  <div>
    <q-input v-model="media" filled clearable type="file" style="width: 50%;" class="q-pa-md"/>
    <q-media-player
      type="audio"
      ref="mediaplayer"
      autoplay
      :source="itemUrl"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      media: null,
      itemUrl: null
    }
  },
  watch: {
    media (fileList) {
      if (fileList && fileList.length > 0) {
        this.loadFileBlob(fileList)
      }
    }
  },
  methods: {
    loadFileBlob (fileList) {
      this.$refs.mediaplayer.loadFileBlob(fileList)
    }
  }
}
</script>
