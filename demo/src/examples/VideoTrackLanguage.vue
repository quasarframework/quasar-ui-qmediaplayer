<template>
  <q-media-player
    type="video"
    :sources="sources"
    :tracks="tracks"
    track-language="French"
  />
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
      ],
      tracks: [
        {
          src: 'statics/media/TearsOfSteel/TOS-en.vtt',
          kind: 'subtitles',
          srclang: 'en',
          label: 'English'
        },
        {
          src: 'statics/media/TearsOfSteel/TOS-de.vtt',
          kind: 'subtitles',
          srclang: 'de',
          label: 'German'
        },
        {
          src: 'statics/media/TearsOfSteel/TOS-es.vtt',
          kind: 'subtitles',
          srclang: 'es',
          label: 'Spanish'
        },
        {
          src: 'statics/media/TearsOfSteel/TOS-fr-Goofy.vtt',
          kind: 'subtitles',
          srclang: 'fr',
          label: 'French'
        },
        {
          src: 'statics/media/TearsOfSteel/TOS-it.vtt',
          kind: 'subtitles',
          srclang: 'it',
          label: 'Italian'
        },
        {
          src: 'statics/media/TearsOfSteel/TOS-nl.vtt',
          kind: 'subtitles',
          srclang: 'nl',
          label: 'Dutch'
        }
      ]
    }
  }
}
</script>
