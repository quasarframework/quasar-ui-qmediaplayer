<template>
  <div class="q-layout-padding q-mx-auto q-gutter-sm" style="max-width: 1000px; width: 100%; min-height: 100vh;">

    <div class="row flex-center">
      <p>This page is intended to test multiple scenarios of QMediaPlayer.</p>
      <p>Music courtesy of <a
        href="https://freemusicarchive.org/music/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_Upbeat_Party"
        target="blank">Free Music Archive</a></p>
      <p style="text-align: center;">Videos and subtitles courtesy of <a href="https://mango.blender.org/download/"
                                                                         target="blank">Blender Organization</a>.</p>
    </div>

    <div class="row flex-center">
      <q-item :dark="!darkbg" class="q-my-sm bg-blue-grey-6 shadow-1" style="border-radius: 30px" tag="label">
        <q-item-section>
          <q-item-label>Dark background (audio)</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-toggle :dark="darkbg" color="blue-grey-2" v-model="darkbg"></q-toggle>
        </q-item-section>
      </q-item>

      <q-card class="q-mx-auto" style="max-width: 800px; width: 100%; max-width: 90vw;">
        <q-card-section class="text-center">
          <div class="row flex-center q-gutter-sm">
            <q-toggle label="Dense" v-model="dense"></q-toggle>
            <q-toggle label="Dark" v-model="dark"></q-toggle>
            <q-toggle label="Radius" v-model="radius"></q-toggle>
            <q-toggle label="Muted" v-model="muted"></q-toggle>
            <q-toggle label="Plays Inline" v-model="playsinline"></q-toggle>
            <q-toggle label="Loop" v-model="loop"></q-toggle>
          </div>
          <div class="row flex-center q-gutter-sm">
            <q-toggle :disable="!videoType" label="Big Play Button" v-model="bigPlay"></q-toggle>
            <q-toggle :disable="!videoType" label="Overlay" v-model="overlay"></q-toggle>
            <q-toggle :disable="!videoType" label="Mobile Mode" v-model="mobileMode"></q-toggle>
          </div>
          <div class="row flex-center q-gutter-sm">
            <q-toggle label="Video" v-model="videoType"></q-toggle>
            <q-btn :disable="!videoType" @click="nextVideo" label="Next Video"></q-btn>
            <q-toggle label="Autoplay" v-model="autoplay"></q-toggle>
            <q-toggle v-model="noControlsOverlay" label="No Controls Overlay"></q-toggle>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="row flex-center" style="min-height: 2rem;">
      <div class="column">
        standard, mobileMode
        <transition name="q-transition--scale">
          <q-media-player
            :autoplay="autoplay"
            :background-color="darkbg === true ? 'black' : 'white'"
            :dark="dark"
            :dense="dense"
            :key="videoType === true ? 'video' : 'audio'"
            :loop="loop"
            :mobile-mode="true"
            :muted="muted"
            :no-controls-overlay="noControlsOverlay"
            :playsinline="playsinline"
            :poster="this.poster"
            :radius="radius ? '1rem' : 0"
            :show-big-play-button="bigPlay"
            :sources="this.sources"
            :tracks="this.tracks"
            :type="videoType === true ? 'video' : 'audio'"
            @ended="onEnded"
            track-language="English"
          >
            <template v-if="overlay" v-slot:overlay>
              <div>
                <img
                  src="statics/quasar-logo.png"
                  style="width: 30vw; max-width: 50px; opacity: 0.25;"
                >
              </div>
            </template>
          </q-media-player>
        </transition>
      </div>
    </div>
    <div class="row flex-center" style="min-height: 2rem;">
      <div class="clolumn">
      no-controls-overlay
        <transition name="q-transition--scale">
          <q-media-player
            :autoplay="autoplay"
            :background-color="darkbg === true ? 'black' : 'white'"
            :dark="dark"
            :dense="dense"
            :key="videoType === true ? 'video' : 'audio'"
            :loop="loop"
            :mobile-mode="mobileMode"
            :muted="muted"
            :no-controls-overlay="noControlsOverlay"
            :playsinline="playsinline"
            :poster="this.poster"
            :radius="radius ? '1rem' : 0"
            :show-big-play-button="bigPlay"
            :sources="this.sources"
            :tracks="this.tracks"
            :type="videoType === true ? 'video' : 'audio'"
            @ended="onEnded"
            track-language="English"
          >
          </q-media-player>
        </transition>
      </div>
    </div>
    <div class="row flex-center" style="min-height: 2rem;">
      <div class="column">
      no-controls-overlay, custom controls, custom height:130px
      <transition name="q-transition--scale">
        <q-media-player
          :autoplay="autoplay"
          :dark="dark"
          :dense="dense"
          :key="videoType === true ? 'video' : 'audio'"
          :loop="loop"
          :mobile-mode="mobileMode"
          :muted="muted"
          :no-controls-overlay="noControlsOverlay"
          :playsinline="playsinline"
          :poster="this.poster"
          :radius="radius ? '1rem' : 0"
          :show-big-play-button="bigPlay"
          :sources="this.sources"
          :tracks="this.tracks"
          :type="videoType === true ? 'video' : 'audio'"
          @ended="onEnded"
          @paused="isPlaying = false"
          @playing="isPlaying = true"
          background-color="teal-3"
          content-style="height: 130px;"
          ref="qmp"
          track-language="English"
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
      </transition>
      </div>
    </div>
    <div class="text-center">
      <p>QMediaPlayer <a href="https://github.com/quasarframework/quasar-ui-qmediaplayer" target="_blank">home page</a>.
      </p>
      <p>Demo project's <a href="https://github.com/quasarframework/quasar-ui-qmediaplayer/tree/master/demo"
                           target="_blank">home page</a>.</p>
    </div>

  </div>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      darkbg: true,
      dark: false,
      dense: false,
      videoType: true,
      mobileMode: false,
      muted: false,
      playsinline: false,
      loop: false,
      autoplay: false,
      bigPlay: true,
      radius: false,
      overlay: false,
      noControlsOverlay: true,
      isPlaying: false,
      videoIndex: 0,
      sources: [],
      tracks: [],
      poster: '',

      audio: {
        sources: [
          {
            src: 'https://raw.githubusercontent.com/quasarframework/quasar-ui-qmediaplayer/dev/demo/src/statics/media/Scott_Holmes_-_04_-_Upbeat_Party.mp3',
            type: 'audio/mp3'
          }
        ]
      },

      video: [
        {
          label: 'Tears of Steel',
          poster: 'media/TearsOfSteel/TearsOfSteel.jpeg',
          sources: [
            {
              src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4#t=200',
              type: 'video/mp4'
            }
          ],
          tracks: [
            {
              src: 'media/TearsOfSteel/TOS-en.vtt',
              kind: 'subtitles',
              srclang: 'en',
              label: 'English'
            },
            {
              src: 'media/TearsOfSteel/TOS-de.vtt',
              kind: 'subtitles',
              srclang: 'de',
              label: 'German'
            },
            {
              src: 'media/TearsOfSteel/TOS-es.vtt',
              kind: 'subtitles',
              srclang: 'es',
              label: 'Spanish'
            },
            {
              src: 'media/TearsOfSteel/TOS-fr-Goofy.vtt',
              kind: 'subtitles',
              srclang: 'fr',
              label: 'French'
            },
            {
              src: 'media/TearsOfSteel/TOS-it.vtt',
              kind: 'subtitles',
              srclang: 'it',
              label: 'Italian'
            },
            {
              src: 'media/TearsOfSteel/TOS-nl.vtt',
              kind: 'subtitles',
              srclang: 'nl',
              label: 'Dutch'
            }
          ]
        },
        {
          label: 'Sintel',
          poster: 'media/sintel/sintel-poster2.jpeg',
          sources: [
            {
              src: 'http://www.peach.themazzone.com/durian/movies/sintel-2048-surround.mp4',
              type: 'video/mp4'
            }
          ],
          tracks: [
            {
              src: 'media/sintel/sintel-en.vtt',
              kind: 'subtitles',
              srclang: 'en',
              label: 'English'
            },
            {
              src: 'media/sintel/sintel-de.vtt',
              kind: 'subtitles',
              srclang: 'de',
              label: 'Deutsch'
            },
            {
              src: 'media/sintel/sintel-es.vtt',
              kind: 'subtitles',
              srclang: 'es',
              label: 'Español'
            },
            {
              src: 'media/sintel/sintel-fr.vtt',
              kind: 'subtitles',
              srclang: 'fr',
              label: 'Français'
            },
            {
              src: 'media/sintel/sintel-it.vtt',
              kind: 'subtitles',
              srclang: 'it',
              label: 'Italiano'
            },
            {
              src: 'media/sintel/sintel-nl.vtt',
              kind: 'subtitles',
              srclang: 'nl',
              label: 'Nederlands'
            },
            {
              src: '/media/sintel/sintel-pt.vtt',
              kind: 'subtitles',
              srclang: 'pt',
              label: 'Português'
            },
            {
              src: 'media/sintel/sintel-pl.vtt',
              kind: 'subtitles',
              srclang: 'pl',
              label: 'Polski'
            },
            {
              src: 'media/sintel/sintel-ru.vtt',
              kind: 'subtitles',
              srclang: 'ru',
              label: 'Russian'
            }
          ]
        }
      ]
    }
  },

  created () {
    this.setSource()
  },

  mounted () {
  },

  computed: {},

  watch: {
    videoType (val) {
      this.setSource()
    }
  },

  methods: {
    setSource () {
      if (this.videoType) {
        this.sources.splice(0, this.sources.length, ...this.video[this.videoIndex].sources)
        this.tracks.splice(0, this.tracks.length, ...this.video[this.videoIndex].tracks)
        this.poster = this.video[this.videoIndex].poster
      }
      else {
        this.sources.splice(0, this.sources.length, ...this.audio.sources)
        this.tracks.splice(0, this.tracks.length)
        this.poster = ''
      }
    },
    onEnded () {
      if (this.videoType) {
        this.nextVideo()
      }
    },
    nextVideo () {
      if (this.videoIndex === 0) {
        this.videoIndex = 1
      }
      else {
        this.videoIndex = 0
      }
      this.setSource()
    }
  }
}
</script>
