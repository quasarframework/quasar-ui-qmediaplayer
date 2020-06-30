// Utils
import { QColorizeMixin } from 'q-colorize-mixin'
import canRender from 'quasar/src/mixins/can-render'

import {
  QSlider,
  QBtn,
  QTooltip,
  QMenu,
  QExpansionItem,
  QList,
  QItem,
  QItemSection,
  QIcon,
  QSpinner,
  ClosePopup,
  Ripple
} from 'quasar'

const getMousePosition = function (e, type = 'x') {
  if (type === 'x') {
    return e.pageX
  }
  return e.pageY
}

const padTime = (val) => {
  val = Math.floor(val)
  if (val < 10) {
    return '0' + val
  }
  return val + ''
}

const timeParse = (sec) => {
  let min = 0
  min = Math.floor(sec / 60)
  sec = sec - min * 60
  return padTime(min) + ':' + padTime(sec)
}

export default {
  name: 'QMediaPlayer',

  directives: {
    ClosePopup,
    Ripple
  },

  mixins: [QColorizeMixin, canRender],

  props: {
    contentStyle: {
      type: String
    },
    contentClass: {
      type: String
    },
    type: {
      type: String,
      required: false,
      default: 'video',
      validator: v => ['video', 'audio'].includes(v)
    },
    mobileMode: Boolean,
    source: String,
    sources: {
      type: Array,
      default: () => []
    },
    poster: {
      type: String,
      default: ''
    },
    tracks: {
      type: Array,
      default: () => []
    },
    dense: Boolean,
    autoplay: Boolean,
    crossOrigin: {
      type: [String, null],
      default: null,
      validator: v => v === null || ['anonymous', 'use-credentials'].includes(v)
    },
    volume: {
      type: Number,
      default: 60,
      validator: v => v >= 0 && v <= 100
    },
    hideVolumeSlider: Boolean,
    hidePlayBtn: Boolean,
    preload: {
      type: String,
      default: 'metadata',
      validator: v => ['none', 'metadata', 'auto'].includes(v)
    },
    noVideo: Boolean,
    muted: Boolean,
    playsinline: Boolean,
    loop: Boolean,
    trackLanguage: {
      type: String,
      default: 'off' // value for 'Off'
    },
    showTooltips: Boolean,
    showBigPlayButton: {
      type: Boolean,
      default: true
    },
    showSpinner: {
      type: Boolean,
      default: true
    },
    spinnerSize: String,
    noControls: Boolean,
    noControlsOverlay: {
      type: Boolean,
      default: false
    },
    controlsDisplayTime: {
      type: Number,
      default: 2000
    },
    playbackRates: Array,
    // initial playback rate
    playbackRate: {
      type: Number,
      default: 1
    },
    color: {
      type: String,
      default: 'white'
    },
    backgroundColor: {
      type: String,
      default: 'black'
    },
    bigPlayButtonColor: {
      type: String,
      default: 'white'
    },
    dark: Boolean,
    radius: {
      type: [Number, String],
      default: 0
    }
  },

  data () {
    return {
      lang: {
        mediaPlayer: {}
      },
      iconSet: {
        mediaPlayer: {}
      },
      $media: null, // the actual video/audio player
      timer: {
        // timer used to hide control during mouse inactivity
        hideControlsTimer: null
      },
      state: {
        errorText: null,
        controls: false,
        showControls: true,
        volume: 60,
        muted: false,
        currentTime: 0.01,
        duration: 1,
        durationTime: '00:00',
        remainingTime: '00:00',
        displayTime: '00:00',
        inFullscreen: false,
        loading: true,
        playReady: false,
        playing: false,
        playbackRates: [
          { label: '.5x', value: 0.5 },
          { label: 'Normal', value: 1 },
          { label: '1.5x', value: 1.5 },
          { label: '2x', value: 2 }
        ],
        playbackRate: 1,
        trackLanguage: 'Off',
        showBigPlayButton: true,
        metadataLoaded: false,
        spinnerSize: '5em',
        noControlsOverlay: false
      },
      allEvents: [
        'abort',
        'canplay',
        'canplaythrough',
        'durationchange',
        'emptied',
        'ended',
        'error',
        'interruptbegin',
        'interruptend',
        'loadeddata',
        'loadedmetadata',
        'loadedstart',
        'pause',
        'play',
        'playing',
        'progress',
        'ratechange',
        'seeked',
        'timeupdate',
        'volumechange',
        'waiting'
      ],
      settingsMenuVisible: false
    }
  },

  beforeMount () {
    this.__setupLang()
    this.__setupIcons()
    if (!this.noControlsOverlay) {
      document.body.addEventListener('mousemove', this.__mouseMoveAction, false)
    }
  },

  mounted () {
    this.$nextTick(function () {
      this.__init()
      if (this.$media) {
        this.$emit('mediaPlayer', this.$media)
      }
    })
  },

  beforeDestroy () {
    // make sure noScroll is not left in unintended state
    this.exitFullscreen()

    document.body.removeEventListener('mousemove', this.__mouseMoveAction)

    this.__removeSourceEventListeners()
    this.__removeMediaEventListeners()

    // make sure no memory leaks
    this.__removeTracks()
    this.__removeSources()
    this.$media = null
  },

  computed: {
    classes () {
      return {
        'q-media__fullscreen': this.state.inFullscreen,
        'q-media__fullscreen--window': this.state.inFullscreen
      }
    },
    renderVideoClasses () {
      return {
        'q-media--player--no-controls-overlay--standard': !this.dense && this.state.noControlsOverlay && this.state.inFullscreen,
        'q-media--player--no-controls-overlay--dense': this.dense && this.state.noControlsOverlay && this.state.inFullscreen
      }
    },

    videoControlsClasses () {
      return {
        'q-media__controls--dense': !this.$slots.controls && ((this.state.showControls || this.mobileMode) && this.dense),
        'q-media__controls--standard': !this.$slots.controls && ((this.state.showControls || this.mobileMode) && !this.dense),
        'q-media__controls--hidden': !this.state.showControls,
        'q-media__controls--no-controls-overlay': this.state.noControlsOverlay
      }
    },

    audioControlsClasses () {
      return {
        'q-media__controls--dense': this.dense,
        'q-media__controls--standard': !this.dense,
        'q-media__controls--no-controls-overlay': this.state.noControlsOverlay
      }
    },

    videoWidth () {
      if (this.$el) {
        return this.$el.getBoundingClientRect().width
      }
      return 0
    },

    volumeIcon () {
      if (this.state.volume > 1 && this.state.volume < 70 && !this.state.muted) {
        return this.iconSet.mediaPlayer.volumeDown
      } else if (this.state.volume >= 70 && !this.state.muted) {
        return this.iconSet.mediaPlayer.volumeUp
      } else {
        return this.iconSet.mediaPlayer.volumeOff
      }
    },

    selectTracksLanguageList () {
      const tracksList = []
      // provide option to turn subtitles/captions/chapters off
      const track = {}
      track.label = this.lang.mediaPlayer.trackLanguageOff
      track.value = 'off'
      tracksList.push(track)
      for (let index = 0; index < this.tracks.length; ++index) {
        const track = {}
        track.label = track.value = this.tracks[index].label
        tracksList.push(track)
      }
      return tracksList
    },

    isAudio () {
      return this.type === 'audio'
    },

    isVideo () {
      return this.type === 'video'
    },

    settingsPlaybackCaption () {
      let caption = ''
      this.state.playbackRates.forEach((rate) => {
        if (rate.value === this.state.playbackRate) {
          caption = rate.label
        }
      })
      return caption
    },

    controlsHeight () {
      return this.$refs.controls.clientHeight
    }
  },

  watch: {
    poster () {
      this.__updatePoster()
    },

    sources: {
      handler () {
        this.__updateSources()
      },
      deep: true
    },

    source () {
      this.__updateSources()
    },

    tracks: {
      handler () {
        this.__updateTracks()
      },
      deep: true
    },

    volume () {
      this.__updateVolume()
    },

    muted () {
      this.__updateMuted()
    },

    trackLanguage () {
      this.__updateTrackLanguage()
    },

    showBigPlayButton () {
      this.__updateBigPlayButton()
    },

    playbackRates () {
      this.__updatePlaybackRates()
    },

    playbackRate () {
      this.__updatePlaybackRate()
    },

    $route (val) {
      this.exitFullscreen()
    },

    '$q.lang.isoName' (val) {
      this.__setupLang()
    },

    '$q.iconSet.name' (val) {
      this.__setupIcons()
    },

    '$q.fullscreen.isActive' (val) {
      // user pressed F11/ESC to exit fullscreen
      if (!val && this.isVideo && this.state.inFullscreen) {
        this.exitFullscreen()
      }
    },

    'state.playbackRate' (val) {
      if (val && this.$media) {
        this.$media.playbackRate = parseFloat(val)
        this.$emit('playbackRate', val)
      }
    },

    'state.trackLanguage' (val) {
      this.__toggleCaptions()
      this.$emit('trackLanguage', val)
    },

    'state.showControls' (val) {
      if (this.isVideo && !this.noControls) {
        this.$emit('showControls', val)
      }
    },

    'state.volume' (val) {
      if (this.$media) {
        const volume = parseFloat(val / 100.0)
        if (this.$media.volume !== volume) {
          this.$media.volume = volume
          this.$emit('volume', val)
        }
      }
    },

    'state.muted' (val) {
      this.$emit('muted', val)
    },

    'state.currentTime' (val) {
      if (this.$media && this.state.playReady) {
        if (isFinite(this.$media.duration)) {
          this.state.remainingTime = timeParse(this.$media.duration - this.$media.currentTime)
        }
        this.state.displayTime = timeParse(this.$media.currentTime)
      }
    },

    noControlsOverlay (val) {
      this.state.noControlsOverlay = val
      if (val) {
        this.state.showControls = true
        document.body.removeEventListener('mousemove', this.__mouseMoveAction, false)
      } else {
        document.body.addEventListener('mousemove', this.__mouseMoveAction, false)
      }
    }
  },

  methods: {
    loadFileBlob (fileList) {
      if (fileList && this.$media) {
        if (Object.prototype.toString.call(fileList) === '[object FileList]') {
          const reader = new FileReader()
          const self = this
          reader.onload = (event) => {
            self.$media.src = event.target.result
            self.__reset()
            self.__addSourceEventListeners()
            self.$media.load()
            self.state.loading = false
          }
          reader.readAsDataURL(fileList[0])
          return true
        } else {
          /* eslint-disable-next-line no-console */
          console.error('QMediaPlayer: loadFileBlob method requires a FileList')
        }
      }
      return false
    },

    showControls () {
      if (this.state.noControlsOverlay) {
        return
      }
      if (this.timer.hideControlsTimer) {
        clearTimeout(this.timer.hideControlsTimer)
        this.timer.hideControlsTimer = null
      }
      if (this.noControls) {
        return
      }
      this.state.showControls = true
      this.__checkCursor()
      if (this.controlsDisplayTime !== -1 && !this.mobileMode && this.isVideo) {
        this.timer.hideControlsTimer = setTimeout(() => {
          if (!this.__showingMenu()) {
            this.state.showControls = false
            this.timer.hideControlsTimer = null
            this.__checkCursor()
          } else {
            this.showControls()
          }
        }, this.controlsDisplayTime)
      }
    },

    hideControls () {
      if (this.state.noControlsOverlay) {
        return
      }
      if (this.timer.hideControlsTimer) {
        clearTimeout(this.timer.hideControlsTimer)
      }
      if (this.controlsDisplayTime !== -1) {
        this.state.showControls = false
        this.__checkCursor()
      }
      this.timer.hideControlsTimer = null
    },

    toggleControls () {
      if (this.state.noControlsOverlay) {
        return
      }

      if (this.state.showControls) {
        this.hideControls()
      } else {
        this.showControls()
      }
    },

    __reset () {
      if (this.timer.hideControlsTimer && !this.state.noControlsOverlay) {
        clearTimeout(this.timer.hideControlsTimer)
      }
      this.timer.hideControlsTimer = null
      this.state.errorText = null
      this.state.currentTime = 0.01
      this.state.durationTime = '00:00'
      this.state.remainingTime = '00:00'
      this.state.displayTime = '00:00'
      this.state.duration = 1
      this.state.playReady = false
      this.state.playing = false
      this.state.loading = true
      this.state.metadataLoaded = false
      this.__updateTrackLanguage()
      this.showControls()
    },

    __toggleCaptions () {
      this.__showCaptions(this.state.trackLanguage)
    },

    __showCaptions (lang) {
      if (this.$media && this.isVideo) {
        for (let index = 0; index < this.$media.textTracks.length; ++index) {
          if (this.$media.textTracks[index].label === lang) {
            this.$media.textTracks[index].mode = 'showing'
            this.$media.textTracks[index].oncuechange = this.__cueChanged
          } else {
            this.$media.textTracks[index].mode = 'hidden'
            this.$media.textTracks[index].oncuechange = null
          }
        }
      }
    },

    play () {
      if (this.$media && this.state.playReady) {
        const hasPromise = typeof this.$media.play() !== 'undefined'
        if (hasPromise) {
          this.$media.play()
            .then(() => {
              this.state.showBigPlayButton = false
              this.state.playing = true
              this.__mouseLeaveVideo()
            })
            .catch((e) => {
            })
        } else {
          // IE11 + EDGE support
          this.$media.play()
          this.state.showBigPlayButton = false
          this.state.playing = true
          this.__mouseLeaveVideo()
        }
      }
    },

    pause () {
      if (this.$media && this.state.playReady) {
        if (this.state.playing) {
          this.$media.pause()
          this.state.showBigPlayButton = true
          this.state.playing = false
        }
      }
    },

    mute () {
      this.state.muted = true
      if (this.$media) {
        this.$media.muted = this.state.muted === true
      }
    },

    unmute () {
      this.state.muted = false
      if (this.$media) {
        this.$media.muted = this.state.muted !== true
      }
    },

    togglePlay (e) {
      this.__stopAndPrevent(e)
      if (this.$media && this.state.playReady) {
        if (this.state.playing) {
          this.$media.pause()
          this.state.showBigPlayButton = true
          this.state.playing = false
        } else {
          const hasPromise = typeof this.$media.play() !== 'undefined'
          if (hasPromise) {
            this.$media.play()
              .then(() => {
                this.state.showBigPlayButton = false
                this.state.playing = true
                this.__mouseLeaveVideo()
              })
              .catch((e) => {
              })
          } else {
            // IE11 + EDGE support
            this.$media.play()
            this.state.showBigPlayButton = false
            this.state.playing = true
            this.__mouseLeaveVideo()
          }
        }
      }
    },

    toggleMuted (e) {
      this.__stopAndPrevent(e)
      this.state.muted = !this.state.muted
      if (this.$media) {
        this.$media.muted = this.state.muted === true
      }
    },

    toggleFullscreen (e) {
      if (this.isVideo) {
        this.__stopAndPrevent(e)
        if (this.state.inFullscreen) {
          this.exitFullscreen()
        } else {
          this.setFullscreen()
        }
        this.$emit('fullscreen', this.state.inFullscreen)
      }
    },

    setFullscreen () {
      if (!this.isVideo || this.state.inFullscreen) {
        return
      }
      if (this.$q.fullscreen !== void 0) {
        this.state.inFullscreen = true
        this.$q.fullscreen.request()
        document.body.classList.add('no-scroll')
        // NOTE To get the correct height of player depends on how many media players are on the page.
        /*
         Problematic is example page where all original videos are not loaded when on localhost,
         that's why new videos targeting to google storage are stored.
         */
        // If the computer is slow it has a problem with correction height calculation when switching to fullscreen.
        // Correct performance is on page demoNCO where the video is switched to fullscreen in all browsers fluently.
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        // Quasar Platform.is returns undefined - Platform was imported on the beginning
        // IE11 needs cssText to set height
        if (this.state.noControlsOverlay && this.$slots.controls) {
          // iPhone Safari - sometimes when switched to fullscreen, native control panels appears and user is not able to exit back to page
          // we have a custom controls slot
          const isIE11 = !!window.MSInputMethodContext && !!document.documentMode
          if (isIE11 || isSafari) {
            // IE11 always returns screen.height of the primary screen.
            // Safari on iPad(landscape mode only) doesn't calculate correctly
            // Safari has also problem with correct height
            // timeout gets the correct window.outerHeight most of the time except Safari o iMac
            setTimeout(() => {
              // works for IE11 on secondary screen, sometimes wrong height calculation for few pixels
              this.$refs.media.style.cssText = `height: ${window.outerHeight - this.controlsHeight}px!important`
            }, 400)
          } else {
            // correct height for chrome on secondary screen
            this.$refs.media.style.cssText = `height: ${screen.height - this.controlsHeight}px!important`
          }
        } else {
          // must be for non no-control-overlay and fullscreen to align video vertically
          if (!this.state.noControlsOverlay && !isSafari) {
            // if used in Safari iPad landscape mode video and control panel are out of the screen
            this.$refs.media.style.cssText = 'height: 100%'
          } else {
            // if (isSafari && !this.state.noControlsOverlay && this.$slots.controls) {
            // fixed the video height in render function
            // iPad Safari - remains problem with aligned video to the top and not to the screen center (could be also in iMac but depends on screen ration)
            //   console.log('safari fullscreen with custom slot but no-controls-overlay = false', this.state.noControlsOverlay)
            // }
            // Safari iMac - shows the video to fullscreen correctly
            // Safari iPad landscape - the whole video is visible but aligned to the top, not to center
          }
        }
      }
    },

    exitFullscreen () {
      if (!this.isVideo || !this.state.inFullscreen) {
        return
      }
      if (this.$q.fullscreen !== void 0) {
        this.state.inFullscreen = false
        this.$q.fullscreen.exit()
        document.body.classList.remove('no-scroll')
        this.$refs.media.style.height = null // remove height when back from fullscreen
        this.$refs.media.style.cssText = this.contentStyle // IE11 requires
      }
    },

    currentTime () {
      if (this.$media && this.state.playReady) {
        return this.$media.currentTime
      }
      return -1
    },

    setCurrentTime (seconds) {
      if (this.state.playReady) {
        if (this.$media && isFinite(this.$media.duration) && seconds >= 0 && seconds <= this.$media.duration) {
          this.state.currentTime = this.$media.currentTime = seconds
        }
      }
    },

    setVolume (volume) {
      if (volume >= 0 && volume <= 100) {
        this.state.volume = volume
      }
    },

    __stopAndPrevent (e) {
      if (e) {
        e.cancelable !== false && e.preventDefault()
        e.stopPropagation()
      }
    },

    __setupLang () {
      const isoName = this.$q.lang.isoName || 'en-us'
      let lang
      try {
        // lang = require(`./lang/${isoName}`)
        lang = this.__loadLang(isoName)
      } catch (e) {
      }

      if (lang !== void 0 && lang.lang !== void 0) {
        this.lang.mediaPlayer = { ...lang.mediaPlayer }
        this.__updatePlaybackRates()
        this.__updateTrackLanguage()
      }
    },

    __loadLang (lang) {
      let langList = {}
      if (lang) {
        // detect if UMD version is installed
        if (window && window.QMediaPlayer && window.QMediaPlayer.Component) {
          const name = lang.replace(/-([a-z])/g, g => g[1].toUpperCase())
          if (window.QMediaPlayer.lang && window.QMediaPlayer.lang[name]) {
            const selectedLang = window.QMediaPlayer.lang[name]
            langList = selectedLang
          } else {
            /* eslint-disable-next-line no-console */
            console.error(`QMediaPlayer: no language loaded called '${lang}'`)
            /* eslint-disable-next-line no-console */
            console.error('Be sure to load the UMD version of the language in a script tag before using with UMD')
          }
        } else {
          try {
            const langSet = require(`@quasar/quasar-ui-qmediaplayer/src/components/lang/${lang}.js`).default
            langList = langSet
          } catch (e) {
            /* eslint-disable-next-line no-console */
            console.error(`QMediaPlayer: cannot find language file called '${lang}'`)
          }
        }
      }
      return langList
    },

    __setupIcons () {
      const iconSetName = this.$q.iconSet.name || 'material-icons'
      let iconSet
      try {
        iconSet = this.__loadIconSet(iconSetName)
      } catch (e) {
      }
      iconSet !== void 0 && iconSet.name !== void 0 && (this.iconSet.mediaPlayer = { ...iconSet.mediaPlayer })
    },

    __loadIconSet (set) {
      let iconsList = {}
      if (set) {
        // detect if UMD version is installed
        if (window && window.QMediaPlayer && window.QMediaPlayer.Component) {
          const name = set.replace(/-([a-z])/g, g => g[1].toUpperCase())
          if (window.QMediaPlayer.iconSet && window.QMediaPlayer.iconSet[name]) {
            const iconsSet = window.QMediaPlayer.iconSet[name]
            iconsList = iconsSet
          } else {
            /* eslint-disable-next-line no-console */
            console.error(`QMediaPlayer: no icon set loaded called '${set}'`)
            /* eslint-disable-next-line no-console */
            console.error('Be sure to load the UMD version of the icon set in a script tag before using with UMD')
          }
        } else {
          try {
            const iconsSet = require(`@quasar/quasar-ui-qmediaplayer/src/components/icon-set/${set}.js`).default
            iconsList = iconsSet
          } catch (e) {
            /* eslint-disable-next-line no-console */
            console.error(`QMediaPlayer: cannot find icon set file called '${set}'`)
          }
        }
      }
      return iconsList
    },

    __init () {
      this.$media = this.$refs.media
      this.state.noControlsOverlay = this.noControlsOverlay
      // set default track language
      this.__updateTrackLanguage()
      this.__updateSources()
      this.__updateTracks()
      // set big play button
      this.__updateBigPlayButton()
      // set the volume
      this.__updateVolume()
      // set muted
      this.__updateMuted()
      // set playback rates
      this.__updatePlaybackRates()
      // set playback rate default
      this.__updatePlaybackRate()
      // does user want cors?
      if (this.crossOrigin) {
        this.$media.setAttribute('crossorigin', this.crossOrigin)
      }
      if (this.$media) {
        // make sure "controls" is turned off
        this.$media.controls = false
      }
      // set up event listeners on video
      this.__addMediaEventListeners()
      this.__addSourceEventListeners()
      this.__toggleCaptions()
    },

    __addMediaEventListeners () {
      if (this.$media) {
        this.allEvents.forEach((event) => {
          this.$media.addEventListener(event, this.__mediaEventHandler)
        })
      }
    },

    __removeMediaEventListeners () {
      if (this.$media) {
        this.allEvents.forEach((event) => {
          this.$media.removeEventListener(event, this.__mediaEventHandler)
        })
      }
    },

    __addSourceEventListeners () {
      if (this.$media) {
        const sources = this.$media.querySelectorAll('source')
        for (let index = 0; index < sources.length; ++index) {
          sources[index].addEventListener('error', this.__sourceEventHandler)
        }
      }
    },

    __removeSourceEventListeners () {
      if (this.$media) {
        const sources = this.$media.querySelectorAll('source')
        for (let index = 0; index < sources.length; ++index) {
          sources[index].removeEventListener('error', this.__sourceEventHandler)
        }
      }
    },

    __sourceEventHandler (event) {
      const NETWORK_NO_SOURCE = 3
      if (this.$media && this.$media.networkState === NETWORK_NO_SOURCE) {
        this.state.errorText = this.isVideo ? this.lang.mediaPlayer.noLoadVideo : this.lang.mediaPlayer.noLoadAudio
      }
      this.$emit('networkState', event)
    },

    __mediaEventHandler (event) {
      if (event.type === 'abort') {
        this.$emit('abort')
      } else if (event.type === 'canplay') {
        this.state.playReady = true
        this.state.displayTime = timeParse(this.$media.currentTime)
        this.__mouseEnterVideo()
        this.$emit('ready')
      } else if (event.type === 'canplaythrough') {
        // console.log('canplaythrough')
        this.$emit('canplaythrough')
      } else if (event.type === 'durationchange') {
        if (isFinite(this.$media.duration)) {
          this.state.duration = this.$media.duration
          this.state.durationTime = timeParse(this.$media.duration)
          this.$emit('duration', this.$media.duration)
        }
      } else if (event.type === 'emptied') {
        this.$emit('emptied')
      } else if (event.type === 'ended') {
        this.state.playing = false
        this.$emit('ended')
      } else if (event.type === 'error') {
        const error = this.$media.error
        this.$emit('error', error)
      } else if (event.type === 'interruptbegin') {
        // console.log('interruptbegin')
      } else if (event.type === 'interruptend') {
        // console.log('interruptend')
      } else if (event.type === 'loadeddata') {
        this.state.loading = false
        this.$emit('loadeddata')
      } else if (event.type === 'loadedmetadata') {
        // tracks can only be programatically added after 'loadedmetadata' event
        this.state.metadataLoaded = true
        this.__updateTracks()
        // set default track language
        this.__updateTrackLanguage()
        this.__toggleCaptions()
        this.$emit('loadedmetadata')
      } else if (event.type === 'stalled') {
        this.$emit('stalled')
      } else if (event.type === 'suspend') {
        this.$emit('suspend')
      } else if (event.type === 'loadstart') {
        this.$emit('loadstart')
      } else if (event.type === 'pause') {
        this.state.playing = false
        this.$emit('paused')
      } else if (event.type === 'play') {
        this.$emit('play')
      } else if (event.type === 'playing') {
        this.state.playing = true
        this.$emit('playing')
      } else if (event.type === 'progress') {
      } else if (event.type === 'ratechange') {
      } else if (event.type === 'seeked') {
      } else if (event.type === 'timeupdate') {
        this.state.currentTime = this.$media.currentTime
        this.$emit('timeupdate', this.$media.currentTime, this.state.remainingTime)
      } else if (event.type === 'volumechange') {
      } else if (event.type === 'waiting') {
        this.$emit('waiting')
      }
    },

    // for future functionality
    __cueChanged (data) {
    },

    __checkCursor () {
      if (this.state.inFullscreen && this.state.playing && !this.state.showControls) {
        this.$el.classList.remove('cursor-inherit')
        this.$el.classList.add('cursor-none')
      } else {
        this.$el.classList.remove('cursor-none')
        this.$el.classList.add('cursor-inherit')
      }
    },

    __adjustMenu () {
      const qmenu = this.$refs.menu
      if (qmenu) {
        setTimeout(() => {
          qmenu.updatePosition()
        }, 350)
      }
    },

    __videoClick (e) {
      this.__stopAndPrevent(e)
      if (this.mobileMode !== true) {
        this.togglePlay()
      }
      this.toggleControls()
    },

    __bigButtonClick (e) {
      this.__stopAndPrevent(e)
      if (this.mobileMode) {
        this.hideControls()
      }
      this.togglePlay()
    },

    __settingsMenuShowing (val) {
      this.settingsMenuVisible = val
    },

    __mouseEnterVideo (e) {
      if (!this.mobileMode && !this.isAudio) {
        this.showControls()
      }
    },

    __mouseLeaveVideo (e) {
      if (!this.mobileMode && !this.isAudio) {
        this.hideControls()
      }
    },

    __mouseMoveAction (e) {
      if (!this.mobileMode && !this.isAudio) {
        this.__showControlsIfValid(e)
      }
    },

    __showControlsIfValid (e) {
      if (this.__showingMenu()) {
        this.showControls()
        return true
      }
      const x = getMousePosition(e, 'x')
      const y = getMousePosition(e, 'y')
      const pos = this.$el.getBoundingClientRect()
      if (!pos) return false
      if (x > pos.left && x < pos.left + pos.width) {
        if (y > pos.top + pos.height - (this.dense ? 40 : 80) && y < pos.top + pos.height) {
          this.showControls()
          return true
        }
      }
      return false
    },

    __videoCurrentTimeChanged (val) {
      this.showControls()
      if (this.$media && this.$media.duration && val && val > 0 && val <= this.state.duration) {
        if (this.$media.currentTime !== val) {
          this.state.currentTime = this.$media.currentTime = val
        }
      }
    },

    __volumePercentChanged (val) {
      this.showControls()
      this.state.volume = val
    },

    __trackLanguageChanged (language) {
      if (this.state.trackLanguage !== language) {
        this.state.trackLanguage = language
      }
    },

    __playbackRateChanged (rate) {
      if (this.state.playbackRate !== rate) {
        this.state.playbackRate = rate
      }
    },

    __showingMenu () {
      return this.settingsMenuVisible
    },

    __updateBigPlayButton () {
      if (this.state.showBigPlayButton !== this.showBigPlayButton) {
        this.state.showBigPlayButton = this.showBigPlayButton
      }
    },

    __updateVolume () {
      if (this.state.volume !== this.volume) {
        this.state.volume = this.volume
      }
    },

    __updateMuted () {
      if (this.state.muted !== this.muted) {
        this.state.muted = this.muted
        if (this.$media) {
          this.$media.muted = this.state.muted
        }
      }
    },

    __updateTrackLanguage () {
      if (this.state.trackLanguage !== this.trackLanguage || this.lang.mediaPlayer.trackLanguageOff) {
        this.state.trackLanguage = this.trackLanguage || this.lang.mediaPlayer.trackLanguageOff
      }
    },

    __updatePlaybackRates () {
      if (this.playbackRates && this.playbackRates.length > 0) {
        this.state.playbackRates = [...this.playbackRates]
      } else {
        this.state.playbackRates.splice(0, this.state.playbackRates.length)
        this.state.playbackRates.push({ label: this.lang.mediaPlayer.ratePoint5, value: 0.5 })
        this.state.playbackRates.push({ label: this.lang.mediaPlayer.rateNormal, value: 1 })
        this.state.playbackRates.push({ label: this.lang.mediaPlayer.rate1Point5, value: 1.5 })
        this.state.playbackRates.push({ label: this.lang.mediaPlayer.rate2, value: 2 })
      }
      this.state.trackLanguage = this.lang.mediaPlayer.trackLanguageOff
    },

    __updatePlaybackRate () {
      if (this.state.playbackRate !== this.playbackRate) {
        this.state.playbackRate = this.playbackRate
      }
    },

    __updateSources () {
      this.__removeSources()
      this.__addSources()
    },

    __removeSources () {
      if (this.$media) {
        this.__removeSourceEventListeners()
        // player must not be running
        this.$media.pause()
        this.$media.src = ''
        if (this.$media.currentTime) {
          // otherwise IE11 has exception error
          this.$media.currentTime = 0
        }
        const childNodes = this.$media.childNodes
        for (let index = childNodes.length - 1; index >= 0; --index) {
          if (childNodes[index].tagName === 'SOURCE') {
            this.$media.removeChild(childNodes[index])
          }
        }
        this.$media.load()
      }
    },

    __addSources () {
      if (this.$media) {
        let loaded = false
        if (this.source && this.source.length > 0) {
          this.$media.src = this.source
          loaded = true
        } else {
          if (this.sources.length > 0) {
            this.sources.forEach((source) => {
              const s = document.createElement('SOURCE')
              s.src = source.src ? source.src : ''
              s.type = source.type ? source.type : ''
              this.$media.appendChild(s)
              if (!loaded && source.src) {
                this.$media.src = source.src
                loaded = true
              }
            })
          }
        }
        this.__reset()
        this.__addSourceEventListeners()
        this.$media.load()
      }
    },

    __updateTracks () {
      this.__removeTracks()
      this.__addTracks()
    },

    __removeTracks () {
      if (this.$media) {
        const childNodes = this.$media.childNodes
        for (let index = childNodes.length - 1; index >= 0; --index) {
          if (childNodes[index].tagName === 'TRACK') {
            this.$media.removeChild(childNodes[index])
          }
        }
      }
    },

    __addTracks () {
      // only add tracks to video
      if (this.isVideo && this.$media) {
        this.tracks.forEach((track) => {
          const t = document.createElement('TRACK')
          t.kind = track.kind ? track.kind : ''
          t.label = track.label ? track.label : ''
          t.src = track.src ? track.src : ''
          t.srclang = track.srclang ? track.srclang : ''
          this.$media.appendChild(t)
        })
        this.$nextTick(() => {
          this.__toggleCaptions()
        })
      }
    },

    __updatePoster () {
      if (this.$media) {
        this.$media.poster = this.poster
      }
    },

    __renderVideo (h) {
      const slot = this.$slots.oldbrowser

      return h('video', {
        ref: 'media',
        staticClass: 'q-media--player',
        class: this.renderVideoClasses, // this.contentClass // TODO merge custom contentClass with renderVideoClasses
        style: !this.state.inFullscreen ? this.contentStyle : '', // if not inFullscreen Safari + cutom slot + fullscreen shows video with contentStyle
        attrs: {
          poster: this.poster,
          preload: this.preload,
          playsinline: this.playsinline === true,
          loop: this.loop === true,
          autoplay: this.autoplay === true,
          muted: this.mute === true
        }
      }, [
        this.isVideo && (slot || h('p', this.lang.mediaPlayer.oldBrowserVideo))
      ])
    },

    __renderAudio (h) {
      const slot = this.$slots.oldbrowser

      // This is on purpose (not using audio tag).
      // The video tag can also play audio and works better if dynamically
      // switching between video and audio on the same component.
      // That being said, if audio is truly needed, use the 'nop-video'
      // property to force the <audio> tag.

      return h(this.noVideo === true ? 'audio' : 'video', {
        ref: 'media',
        staticClass: 'q-media--player',
        class: this.contentClass,
        style: this.contentStyle,
        attrs: {
          preload: this.preload,
          playsinline: this.playsinline === true,
          loop: this.loop === true,
          autoplay: this.autoplay === true,
          muted: this.mute === true
        }
      }, [
        this.isAudio && (slot || h('p', this.lang.mediaPlayer.oldBrowserAudio))
      ])
    },

    __renderSources (h) {
      return this.sources.map((source) => {
        return h('source', {
          attrs: {
            key: source.src + ':' + source.type,
            src: source.src,
            type: source.type
          }
        })
      })
    },

    __renderTracks (h) {
      return this.tracks.map((track) => {
        return h('track', {
          attrs: {
            key: track.src + ':' + track.kind,
            src: track.src,
            kind: track.kind,
            label: track.label,
            srclang: track.srclang
          }
        })
      })
    },

    __renderOverlayWindow (h) {
      const slot = this.$slots.overlay

      if (slot) {
        return h('div', {
          staticClass: 'q-media__overlay-window'
        }, slot)
      }
    },

    __renderErrorWindow (h) {
      const slot = this.$slots.errorWindow

      return h('div', {
        staticClass: 'q-media__error-window'
      }, [
        slot || h('div', this.state.errorText)
      ])
    },

    __renderPlayButton (h) {
      if (this.hidePlayBtn === true) return

      const slot = this.$slots.play

      return slot || h(QBtn, {
        staticClass: 'q-media__controls--button',
        props: {
          icon: this.state.playing ? this.iconSet.mediaPlayer.pause : this.iconSet.mediaPlayer.play,
          textColor: this.color,
          size: '1rem',
          disable: !this.state.playReady,
          flat: true
        },
        on: {
          click: this.togglePlay
        }
      }, [
        this.showTooltips && this.state.playing && h(QTooltip, this.lang.mediaPlayer.pause),
        this.showTooltips && !this.state.playing && this.state.playReady && h(QTooltip, this.lang.mediaPlayer.play)
      ])
    },

    __renderVideoControls (h) {
      const slot = this.$slots.controls
      if (slot) {
        // we need to know the controls height for fullscreen, stop propagation to video component
        return h('div', {
          ref: 'controls',
          staticClass: 'q-media__controls',
          class: this.videoControlsClasses,
          on: {
            click: this.__stopAndPrevent
          }
        },
        slot
        )
      }

      return slot || h('div', {
        ref: 'controls',
        staticClass: 'q-media__controls',
        class: this.videoControlsClasses,
        on: {
          click: this.__stopAndPrevent
        }
      }, [
        // dense
        this.dense && h('div', {
          staticClass: 'q-media__controls--row row col content-start items-center'
        }, [
          h('div', [
            this.__renderPlayButton(h),
            this.showTooltips && !this.state.playReady && h(QTooltip, this.lang.mediaPlayer.waitingVideo)
          ]),
          this.__renderVolumeButton(h),
          this.__renderVolumeSlider(h),
          this.__renderDisplayTime(h),
          this.__renderCurrentTimeSlider(h),
          this.__renderDurationTime(h),
          this.__renderSettingsButton(h),
          this.$q.fullscreen !== void 0 && this.__renderFullscreenButton(h)
        ]),
        // sparse
        !this.dense && h('div', {
          staticClass: 'q-media__controls--row row col items-center justify-between'
        }, [
          this.__renderDisplayTime(h),
          this.__renderCurrentTimeSlider(h),
          this.__renderDurationTime(h)
        ]),
        !this.dense && h('div', {
          staticClass: 'q-media__controls--row row col content-start items-center'
        }, [
          h('div', {
            staticClass: 'row col'
          }, [
            h('div', [
              this.__renderPlayButton(h),
              this.showTooltips && !this.state.playReady && h(QTooltip, this.lang.mediaPlayer.waitingVideo)
            ]),
            this.__renderVolumeButton(h),
            this.__renderVolumeSlider(h)
          ]),
          h('div', [
            this.__renderSettingsButton(h),
            this.$q.fullscreen !== void 0 && this.__renderFullscreenButton(h)
          ])
        ])
      ])
    },

    __renderAudioControls (h) {
      const slot = this.$slots.controls

      return slot || h('div', {
        ref: 'controls',
        staticClass: 'q-media__controls',
        class: this.audioControlsClasses
      }, [
        this.dense && h('div', {
          staticClass: 'q-media__controls--row row col content-start items-center'
        }, [
          // dense
          h('div', [
            this.__renderPlayButton(h),
            this.showTooltips && !this.state.playReady && h(QTooltip, this.lang.mediaPlayer.waitingAudio)
          ]),
          this.__renderVolumeButton(h),
          this.__renderVolumeSlider(h),
          this.__renderDisplayTime(h),
          this.__renderCurrentTimeSlider(h),
          this.__renderDurationTime(h)
        ]),
        // sparse
        !this.dense && h('div', {
          staticClass: 'q-media__controls--row row col items-center justify-between'
        }, [
          this.__renderDisplayTime(h),
          this.__renderCurrentTimeSlider(h),
          this.__renderDurationTime(h)
        ]),
        !this.dense && h('div', {
          staticClass: 'q-media__controls--row row col content-start items-center'
        }, [
          h('div', [
            this.__renderPlayButton(h),
            this.showTooltips && !this.state.playReady && h(QTooltip, this.lang.mediaPlayer.waitingAudio)
          ]),
          this.__renderVolumeButton(h),
          this.__renderVolumeSlider(h)
        ])
      ])
    },

    __renderVolumeButton (h) {
      const slot = this.$slots.volume

      return slot || h(QBtn, {
        staticClass: 'q-media__controls--button',
        props: {
          icon: this.volumeIcon,
          textColor: this.color,
          size: '1rem',
          disable: !this.state.playReady,
          flat: true
        },
        on: {
          click: this.toggleMuted
        }
      }, [
        this.showTooltips && !this.state.muted && h(QTooltip, this.lang.mediaPlayer.mute),
        this.showTooltips && this.state.muted && h(QTooltip, this.lang.mediaPlayer.unmute)
      ])
    },

    __renderVolumeSlider (h) {
      if (this.hideVolumeSlider === true) {
        return ''
      }
      const slot = this.$slots.volumeSlider

      return slot || h(QSlider, {
        staticClass: 'col',
        style: {
          width: '20%',
          margin: '0 0.5rem',
          minWidth: this.dense ? '20px' : '50px',
          maxWidth: this.dense ? '50px' : '200px'
        },
        props: {
          value: this.state.volume,
          color: this.color,
          dark: this.dark,
          min: 0,
          max: 100,
          disable: !this.state.playReady || this.state.muted
        },
        on: {
          input: this.__volumePercentChanged
        }
      })
    },

    __renderSettingsButton (h) {
      const slot = this.$slots.settings

      return slot || h(QBtn, {
        staticClass: 'q-media__controls--button',
        props: {
          icon: this.iconSet.mediaPlayer.settings,
          textColor: this.color,
          size: '1rem',
          disable: !this.state.playReady,
          flat: true
        }
      }, [
        this.showTooltips && !this.settingsMenuVisible && h(QTooltip, this.lang.mediaPlayer.settings),
        this.__renderSettingsMenu(h)
      ])
    },

    __renderFullscreenButton (h) {
      const slot = this.$slots.fullscreen

      return slot || h(QBtn, {
        staticClass: 'q-media__controls--button',
        props: {
          icon: this.state.inFullscreen ? this.iconSet.mediaPlayer.fullscreenExit : this.iconSet.mediaPlayer.fullscreen,
          textColor: this.color,
          size: '1rem',
          disable: !this.state.playReady,
          flat: true
        },
        on: {
          click: this.toggleFullscreen
        }
      }, [
        this.showTooltips && h(QTooltip, this.lang.mediaPlayer.toggleFullscreen)
      ])
    },

    __renderLoader (h) {
      if (this.spinnerSize === void 0) {
        if (this.isVideo) this.state.spinnerSize = '5em'
        else this.state.spinnerSize = '1.5em'
      } else {
        this.state.spinnerSize = this.spinnerSize
      }

      const slot = this.$slots.spinner

      return slot || h('div', {
        staticClass: this.isVideo ? 'q-media__loading--video' : 'q-media__loading--audio'
      }, [
        h(QSpinner, {
          props: {
            size: this.state.spinnerSize,
            color: this.color
          }
        })
      ])
    },

    __renderBigPlayButton (h) {
      const slot = this.$slots.bigPlayButton

      return slot || h('div', this.setBorderColor(this.bigPlayButtonColor, {
        staticClass: this.state.noControlsOverlay ? 'q-media--big-button q-media--big-button-no-controls-overlay' : 'q-media--big-button'
      }), [
        h(QIcon, this.setTextColor(this.bigPlayButtonColor, {
          props: {
            name: this.iconSet.mediaPlayer.bigPlayButton
          },
          staticClass: 'q-media--big-button-icon',
          on: {
            click: this.__bigButtonClick
          },
          directives: [
            {
              name: 'ripple',
              value: true
            }
          ]
        }))
      ])
    },

    __renderCurrentTimeSlider (h) {
      const slot = this.$slots.positionSlider

      return slot || h(QSlider, {
        staticClass: 'col',
        style: {
          margin: '0 0.5rem'
        },
        props: {
          value: this.state.currentTime,
          color: this.color,
          dark: this.dark,
          min: 0.01,
          max: this.state.duration ? this.state.duration : 1,
          disable: !this.state.playReady
        },
        on: {
          input: this.__videoCurrentTimeChanged
        }
      })
    },

    __renderDisplayTime (h) {
      const slot = this.$slots.displayTime

      return slot || h('span', {
        staticClass: 'q-media__controls--video-time-text' + ' text-' + this.color
      }, this.state.displayTime)
    },

    __renderDurationTime (h) {
      if (this.$media === void 0) return

      const slot = this.$slots.durationTime
      const isInfinity = this.$media !== void 0 && !isFinite(this.$media.duration)

      return slot || h('span', {
        staticClass: 'q-media__controls--video-time-text' + ' text-' + this.color,
        style: {
          width: isInfinity ? '30px' : 'auto'
        }
      }, [
        this.$media && isInfinity !== true && this.state.durationTime,
        this.$media && isInfinity === true && this.__renderInfinitySvg(h)
      ])
    },

    __renderInfinitySvg (h) {
      return h('svg', {
        attrs: {
          height: '16',
          viewbox: '0 0 16 16'
        }
      }, [
        h('path', {
          attrs: {
            fill: 'none',
            stroke: '#ffffff',
            strokeWidth: '2',
            d: 'M8,8 C16,0 16,16 8,8 C0,0 0,16 8,8z'
          }
        })
      ])
    },

    __renderSettingsMenu (h) {
      const slot = this.$slots.settingsMenu

      return h(QMenu, {
        ref: 'menu',
        props: {
          anchor: 'top right',
          self: 'bottom right'
        },
        on: {
          show: () => {
            this.__settingsMenuShowing(true)
          },
          hide: () => {
            this.__settingsMenuShowing(false)
          }
        }
      }, [
        slot || h('div', [
          this.state.playbackRates.length && h(QExpansionItem, {
            props: {
              group: 'settings-menu',
              expandSeparator: true,
              icon: this.iconSet.mediaPlayer.speed,
              label: this.lang.mediaPlayer.speed,
              caption: this.settingsPlaybackCaption
            },
            on: {
              show: this.__adjustMenu,
              hide: this.__adjustMenu
            }
          }, [
            h(QList, {
              props: {
                highlight: true
              }
            }, [
              this.state.playbackRates.map((rate) => {
                return h(QItem, {
                  attrs: {
                    key: rate.value
                  },
                  props: {
                    clickable: true
                  },
                  on: {
                    click: (e) => {
                      this.__stopAndPrevent(e)
                      this.__playbackRateChanged(rate.value)
                    }
                  },
                  directives: [
                    {
                      name: 'ripple',
                      value: true
                    },
                    {
                      name: 'close-popup',
                      value: true
                    }
                  ]
                }, [
                  h(QItemSection, {
                    props: {
                      avatar: true
                    }
                  }, [
                    rate.value === this.state.playbackRate && h(QIcon, {
                      props: {
                        name: this.iconSet.mediaPlayer.selected
                      }
                    })
                  ]),
                  h(QItemSection, rate.label)
                ])
              })
            ])
          ]),
          // first item is 'Off' and doesn't count unless more are added
          this.selectTracksLanguageList.length > 1 && h(QExpansionItem, {
            props: {
              group: 'settings-menu',
              expandSeparator: true,
              icon: this.iconSet.mediaPlayer.language,
              label: this.lang.mediaPlayer.language,
              caption: this.state.trackLanguage
            },
            on: {
              show: this.__adjustMenu,
              hide: this.__adjustMenu
            }
          }, [
            h(QList, {
              props: {
                highlight: true
              }
            }, [
              this.selectTracksLanguageList.map((language) => {
                return h(QItem, {
                  attrs: {
                    key: language.value
                  },
                  props: {
                    clickable: true
                  },
                  on: {
                    click: (e) => {
                      this.__stopAndPrevent(e)
                      this.__trackLanguageChanged(language.value)
                    }
                  },
                  directives: [
                    {
                      name: 'ripple',
                      value: true
                    },
                    {
                      name: 'close-popup',
                      value: true
                    }
                  ]
                }, [
                  h(QItemSection, {
                    props: {
                      avatar: true
                    }
                  }, [
                    language.value === this.state.trackLanguage && h(QIcon, {
                      props: {
                        name: this.iconSet.mediaPlayer.selected
                      }
                    })
                  ]),
                  h(QItemSection, language.label)
                ])
              })
            ])
          ])
        ])
      ])
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-media bg-' + this.backgroundColor,
      class: this.classes,
      style: {
        borderRadius: !this.state.inFullscreen ? this.radius : 0,
        height: this.isVideo ? 'auto' : this.dense ? '40px' : '80px'
      },
      on: {
        mousemove: this.__mouseEnterVideo,
        mouseenter: this.__mouseEnterVideo,
        mouseleave: this.__mouseLeaveVideo,
        click: this.__videoClick
      }
    }, this.canRender === true ? [
      this.isVideo && this.__renderVideo(h),
      this.isAudio && this.__renderAudio(h),
      this.__renderOverlayWindow(h),
      this.state.errorText && this.__renderErrorWindow(h),
      this.isVideo && !this.noControls && !this.state.errorText && this.__renderVideoControls(h),
      this.isAudio && !this.noControls && !this.state.errorText && this.__renderAudioControls(h),
      this.showSpinner && this.state.loading && !this.state.playReady && !this.state.errorText && this.__renderLoader(h),
      this.isVideo && this.showBigPlayButton && this.state.playReady && !this.state.playing && this.__renderBigPlayButton(h)
    ] : void 0)
  }
}
