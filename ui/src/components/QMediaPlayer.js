import {
  h,
  computed,
  defineComponent,
  // getCurrentInstance,
  // onBeforeUpdate,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  nextTick,
  forceUpdate,
  reactive,
  ref,
  // Transition,
  watch
  // withDirectives
} from 'vue'

import { useRoute } from 'vue-router'

// Utils
import { useColorizeProps, useColorize } from 'q-colorize-mixin'

import {
  useQuasar,
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

export default defineComponent({
  name: 'QMediaPlayer',

  directives: {
    ClosePopup,
    Ripple
  },

  props: {
    ...useColorizeProps(),
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
    hideVolumeBtn: Boolean,
    hidePlayBtn: Boolean,
    hideSettingsBtn: Boolean,
    hideFullscreenBtn: Boolean,
    disabledSeek: Boolean,
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
    nativeControls: Boolean,
    bottomControls: {
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
    },
    contentStyle: [String, Object],
    contentClass: [String, Object],
    contentWidth: Number,
    contentHeight: Number
  },

  emits: [
    'mediaPlayer',
    'playbackRate',
    'trackLanguage',
    'showControls',
    'volume',
    'muted',
    'fullscreen',
    'networkState',
    'abort',
    'ready',
    'canplaythrough',
    'duration',
    'emptied',
    'ended',
    'error',
    'loadeddata',
    'loadedmetadata',
    'stalled',
    'suspend',
    'loadstart',
    'paused',
    'play',
    'playing',
    'timeupdate',
    'waiting'
  ],

  setup (props, { slots, emit, expose }) {
    const
      $q = useQuasar(),
      $route = useRoute(),
      canRender = ref(false),
      lang = reactive({
        mediaPlayer: {}
      }),
      iconSet = reactive({
        mediaPlayer: {}
      }),
      $media = ref(null), // $ref - the actual video/audio player
      controls = ref(null), // $ref
      menu = ref(null), // $ref
      // media = ref(null), // $ref
      timer = reactive({
      // timer used to hide control during mouse inactivity
        hideControlsTimer: null
      }),
      state = reactive({
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
        bottomControls: false
      }),
      settingsMenuVisible = ref(false),
      allEvents = [
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
      ]

    // Composition
    const {
      setTextColor,
      setBorderColor
    } = useColorize()

    // Computed

    const __classes = computed(() => {
      return {
        'q-media__fullscreen': state.inFullscreen,
        'q-media__fullscreen--window': state.inFullscreen
      }
    })

    const __renderVideoClasses = computed(() => {
      return 'q-media--player' +
      (!props.dense && state.bottomControls && state.inFullscreen ? ' q-media--player--bottom-controls--standard' : '') +
      (props.dense && state.bottomControls && state.inFullscreen ? ' q-media--player--bottom-controls--dense' : '')
    })

    const __videoControlsClasses = computed(() => {
      return {
        'q-media__controls--dense': !slots.controls && ((state.showControls || props.mobileMode) && props.dense),
        'q-media__controls--standard': !slots.controls && ((state.showControls || props.mobileMode) && !props.dense),
        'q-media__controls--hidden': !state.showControls,
        'q-media__controls--bottom-controls': state.bottomControls
      }
    })

    const __audioControlsClasses = computed(() => {
      return {
        'q-media__controls--dense': props.dense,
        'q-media__controls--standard': !props.dense,
        'q-media__controls--bottom-controls': state.bottomControls
      }
    })

    const __contentStyle = computed(() => {
      const style = {}
      if (state.inFullscreen !== true) {
        Object.assign(style, __mergeClassOrStyle('style', props.contentStyle))
        if (props.bottomControls === true && style.height === void 0) {
        // const size = props.dense === true ? 40 : 80
          style.height = `calc(100% - ${__controlsHeight.value}px)`
        }
        if (style.height === void 0) {
          style.height = '100%'
        }
      }
      return style
    })

    const __volumeIcon = computed(() => {
      if (state.volume > 1 && state.volume < 70 && !state.muted) {
        return iconSet.mediaPlayer.volumeDown
      }
      else if (state.volume >= 70 && !state.muted) {
        return iconSet.mediaPlayer.volumeUp
      }
      else {
        return iconSet.mediaPlayer.volumeOff
      }
    })

    const __selectTracksLanguageList = computed(() => {
      const tracksList = []
      // provide option to turn subtitles/captions/chapters off
      const track = {}
      track.label = lang.mediaPlayer.trackLanguageOff
      track.value = 'off'
      tracksList.push(track)
      for (let index = 0; index < props.tracks.length; ++index) {
        const track = {}
        track.label = track.value = props.tracks[index].label
        tracksList.push(track)
      }
      return tracksList
    })

    const __isMediaAvailable = computed(() => $media.volume !== undefined)

    const __isAudio = computed(() => {
      return props.type === 'audio'
    })

    const __isVideo = computed(() => {
      return props.type === 'video'
    })

    const __settingsPlaybackCaption = computed(() => {
      let caption = ''
      state.playbackRates.forEach((rate) => {
        if (rate.value === state.playbackRate) {
          caption = rate.label
        }
      })
      return caption
    })

    const __controlsHeight = computed(() => {
      if (controls.value) {
        return controls.value.clientHeight
      }
      return props.dense ? 40 : 80
    })

    // Watches

    watch(() => props.poster, () => {
      __updatePoster()
    })

    watch(() => props.sources, () => {
      __updateSources()
    },
    { deep: true }
    )

    watch(() => props.source, () => {
      __updateSources()
    })

    watch(() => props.tracks, () => {
      __updateTracks()
    },
    { deep: true }
    )

    watch(() => props.volume, () => {
      __updateVolume()
    })

    watch(() => props.muted, () => {
      __updateMuted()
    })

    watch(() => props.trackLanguage, () => {
      __updateTrackLanguage()
    })

    watch(() => props.showBigPlayButton, () => {
      __updateBigPlayButton()
    })

    watch(() => props.playbackRates, () => {
      __updatePlaybackRates()
    })

    watch(() => props.playbackRate, () => {
      __updatePlaybackRate()
    })

    watch(() => $route, val => {
      exitFullscreen()
    })

    watch(() => $q.lang.isoName, val => {
      __setupLang()
    })

    watch(() => $q.iconSet.name, val => {
      __setupIcons()
    })

    watch(() => $q.fullscreen.isActive, val => {
    // user pressed F11/ESC to exit fullscreen
      if (!val && __isVideo.value && state.inFullscreen) {
        exitFullscreen()
      }
    })

    watch(() => state.playbackRate, val => {
      if (val && __isMediaAvailable.value === true) {
        $media.playbackRate = parseFloat(val)
        // eslint-disable-next-line vue/custom-event-name-casing
        emit('playbackRate', val)
      }
    })

    watch(() => state.trackLanguage, val => {
      __toggleCaptions()
      // eslint-disable-next-line vue/custom-event-name-casing
      emit('trackLanguage', val)
    })

    watch(() => state.showControls, val => {
      if (__isVideo.value && !state.noControls) {
      // eslint-disable-next-line vue/custom-event-name-casing
        emit('showControls', val)
      }
    })

    watch(() => state.volume, val => {
      if (__isMediaAvailable.value === true) {
        const volume = parseFloat(val / 100.0)
        if ($media.volume !== volume) {
          $media.volume = volume
          emit('volume', val)
        }
      }
    })

    watch(() => state.muted, val => {
      emit('muted', val)
    })

    watch(() => state.currentTime, val => {
      if (__isMediaAvailable.value === true && state.playReady) {
        if (isFinite($media.duration)) {
          state.remainingTime = timeParse($media.duration - $media.currentTime)
        }
        state.displayTime = timeParse($media.currentTime)
      }
    })

    watch(() => props.bottomControls, val => {
      state.bottomControls = val
      if (val) {
        state.showControls = true
      }
    })

    watch(() => props.noControls, val => {
      state.noControls = val
      if (props.nativeControls === true) {
        state.noControls = true
      }
    })

    onBeforeMount(() => {
      canRender.value = window !== undefined // SSR
      if (canRender.value === true) {
        __setupLang()
        __setupIcons()
        document.body.addEventListener('mousemove', __mouseMoveAction, false)
      }
    })

    onMounted(() => {
      if (canRender.value === true) {
        nextTick(function () {
          __init()
          if (__isMediaAvailable.value === true) {
          // eslint-disable-next-line vue/custom-event-name-casing
            emit('mediaPlayer', $media)
          }
        })
      }
    })

    onBeforeUnmount(() => {
      if (canRender.value === true) {
      // make sure not still in fullscreen
        exitFullscreen()

        // make sure noScroll is not left in unintended state
        document.body.classList.remove('no-scroll')

        document.body.removeEventListener('mousemove', __mouseMoveAction)

        __removeSourceEventListeners()
        __removeMediaEventListeners()

        // make sure no memory leaks
        __removeTracks()
        __removeSources()
        $media.value = null
      }
    })

    // Public Methods

    function loadFileBlob (fileList) {
      if (fileList && __isMediaAvailable.value === true) {
        if (Object.prototype.toString.call(fileList) === '[object FileList]') {
          const reader = new FileReader()
          reader.onload = (event) => {
            $media.src = event.target.result
            __reset()
            __addSourceEventListeners()
            $media.load()
            state.loading = false
          }
          reader.readAsDataURL(fileList[0])
          return true
        }
        else {
        /* eslint-disable-next-line no-console */
          console.error('QMediaPlayer: loadFileBlob method requires a FileList')
        }
      }
      return false
    }

    function showControls () {
      if (state.bottomControls) {
        return
      }
      if (timer.hideControlsTimer) {
        clearTimeout(timer.hideControlsTimer)
        timer.hideControlsTimer = null
      }
      if (state.noControls) {
        return
      }
      state.showControls = true
      __checkCursor()
      if (props.controlsDisplayTime !== -1 && !props.mobileMode && __isVideo.value) {
        timer.hideControlsTimer = setTimeout(() => {
          if (!__showingMenu()) {
            state.showControls = false
            timer.hideControlsTimer = null
            __checkCursor()
          }
          else {
            showControls()
          }
        }, props.controlsDisplayTime)
      }
    }

    function hideControls () {
      if (state.bottomControls) {
        return
      }
      if (timer.hideControlsTimer) {
        clearTimeout(timer.hideControlsTimer)
      }
      if (props.controlsDisplayTime !== -1) {
        state.showControls = false
        __checkCursor()
      }
      timer.hideControlsTimer = null
    }

    function toggleControls () {
      if (state.bottomControls) {
        return
      }

      if (state.showControls) {
        hideControls()
      }
      else {
        showControls()
      }
    }

    function play () {
      if (__isMediaAvailable.value === true && state.playReady) {
        const hasPromise = typeof $media.play() !== 'undefined'
        if (hasPromise) {
          $media.play()
            .then(() => {
              state.showBigPlayButton = false
              state.playing = true
              __mouseLeaveVideo()
            })
            .catch((e) => {
            })
        }
        else {
        // IE11 + EDGE support
          $media.play()
          state.showBigPlayButton = false
          state.playing = true
          __mouseLeaveVideo()
        }
      }
    }

    function pause () {
      if (__isMediaAvailable.value === true && state.playReady) {
        if (state.playing) {
          $media.pause()
          state.showBigPlayButton = true
          state.playing = false
        }
      }
    }

    function mute () {
      state.muted = true
      if (__isMediaAvailable.value === true) {
        $media.muted = state.muted === true
      }
    }

    function unmute () {
      state.muted = false
      if (__isMediaAvailable.value === true) {
        $media.muted = state.muted !== true
      }
    }

    function togglePlay (e) {
      __stopAndPrevent(e)
      if (__isMediaAvailable.value === true && state.playReady) {
        if (state.playing) {
          $media.pause()
          state.showBigPlayButton = true
          state.playing = false
        }
        else {
          const hasPromise = typeof $media.play() !== 'undefined'
          if (hasPromise) {
            $media.play()
              .then(() => {
                state.showBigPlayButton = false
                state.playing = true
                __mouseLeaveVideo()
              })
              .catch((e) => {
              })
          }
          else {
          // IE11 + EDGE support
            $media.play()
            state.showBigPlayButton = false
            state.playing = true
            __mouseLeaveVideo()
          }
        }
      }
    }

    function toggleMuted (e) {
      __stopAndPrevent(e)
      state.muted = !state.muted
      if (__isMediaAvailable.value === true) {
        $media.muted = state.muted === true
      }
    }

    function toggleFullscreen (e) {
      if (__isVideo.value) {
        __stopAndPrevent(e)
        if (state.inFullscreen) {
          exitFullscreen()
        }
        else {
          setFullscreen()
        }
        emit('fullscreen', state.inFullscreen)
      }
    }

    function setFullscreen () {
      if (props.hideFullscreenBtn === true || !__isVideo.value || state.inFullscreen) {
        return
      }
      if ($q.fullscreen !== void 0) {
        state.inFullscreen = true
        $q.fullscreen.request() // NOTE error Not capable - on iPhone Safari
        document.body.classList.add('no-scroll')
        nextTick(() => {
          forceUpdate()
        })
      }
    }

    function exitFullscreen () {
      if (props.hideFullscreenBtn === true || !__isVideo.value || !state.inFullscreen) {
        return
      }
      if ($q.fullscreen !== void 0) {
        state.inFullscreen = false
        $q.fullscreen.exit()
        document.body.classList.remove('no-scroll')
        nextTick(() => {
          forceUpdate()
        })
      }
    }

    function currentTime () {
      if (__isMediaAvailable.value === true && state.playReady) {
        return $media.currentTime
      }
      return -1
    }

    function setCurrentTime (seconds) {
      if (state.playReady) {
        if (__isMediaAvailable.value === true && isFinite($media.duration) && seconds >= 0 && seconds <= $media.duration) {
          state.currentTime = $media.currentTime = seconds
        }
      }
    }

    function setVolume (volume) {
      if (volume >= 0 && volume <= 100) {
        state.volume = volume
      }
    }

    // Private Methods

    function __reset () {
      if (timer.hideControlsTimer && !state.bottomControls) {
        clearTimeout(timer.hideControlsTimer)
      }
      timer.hideControlsTimer = null
      state.errorText = null
      state.currentTime = 0.01
      state.durationTime = '00:00'
      state.remainingTime = '00:00'
      state.displayTime = '00:00'
      state.duration = 1
      state.playReady = false
      state.playing = false
      state.loading = true
      state.metadataLoaded = false
      __updateTrackLanguage()
      showControls()
    }

    function __toggleCaptions () {
      __showCaptions(state.trackLanguage)
    }

    function __showCaptions (lang) {
      if (__isMediaAvailable.value === true && __isVideo.value) {
        for (let index = 0; index < $media.textTracks.length; ++index) {
          if ($media.textTracks[index].label === lang) {
            $media.textTracks[index].mode = 'showing'
            $media.textTracks[index].oncuechange = __cueChanged
          }
          else {
            $media.textTracks[index].mode = 'hidden'
            $media.textTracks[index].oncuechange = null
          }
        }
      }
    }

    function __stopAndPrevent (e) {
      if (e) {
        e.cancelable !== false && e.preventDefault()
        e.stopPropagation()
      }
    }

    function __setupLang () {
      const isoName = $q.lang.isoName || 'en-us'
      let lang
      try {
      // lang = require(`./lang/${isoName}`)
        lang = __loadLang(isoName)
      }
      catch (e) { }

      if (lang !== void 0 && lang.lang !== void 0) {
        lang.mediaPlayer = { ...lang.mediaPlayer }
        __updatePlaybackRates()
        __updateTrackLanguage()
      }
    }

    function __loadLang (lang) {
      let langList = {}
      if (lang) {
      // detect if UMD version is installed
        if (window && window.QMediaPlayer && window.QMediaPlayer.Component) {
          const name = lang.replace(/-([a-z])/g, g => g[1].toUpperCase())
          if (window.QMediaPlayer.lang && window.QMediaPlayer.lang[name]) {
            const selectedLang = window.QMediaPlayer.lang[name]
            langList = selectedLang
          }
          else {
          /* eslint-disable-next-line no-console */
            console.error(`QMediaPlayer: no language loaded called '${lang}'`)
            /* eslint-disable-next-line no-console */
            console.error('Be sure to load the UMD version of the language in a script tag before using with UMD')
          }
        }
        else {
          try {
            const langSet = require(`@quasar/quasar-ui-qmediaplayer/src/components/lang/${lang}.js`).default
            langList = langSet
          }
          catch (e) {
          /* eslint-disable-next-line no-console */
            console.error(`QMediaPlayer: cannot find language file called '${lang}'`)
          }
        }
      }
      return langList
    }

    function __setupIcons () {
      const iconSetName = $q.iconSet.name || 'material-icons'
      let icnSet
      try {
        icnSet = __loadIconSet(iconSetName)
      }
      catch (e) { }
      icnSet !== void 0 && icnSet.name !== void 0 && (iconSet.mediaPlayer = { ...iconSet.mediaPlayer })
    }

    function __loadIconSet (set) {
      let iconsList = {}
      if (set) {
      // detect if UMD version is installed
        if (window && window.QMediaPlayer && window.QMediaPlayer.Component) {
          const name = set.replace(/-([a-z])/g, g => g[1].toUpperCase())
          if (window.QMediaPlayer.iconSet && window.QMediaPlayer.iconSet[name]) {
            const iconsSet = window.QMediaPlayer.iconSet[name]
            iconsList = iconsSet
          }
          else {
          /* eslint-disable-next-line no-console */
            console.error(`QMediaPlayer: no icon set loaded called '${set}'`)
            /* eslint-disable-next-line no-console */
            console.error('Be sure to load the UMD version of the icon set in a script tag before using with UMD')
          }
        }
        else {
          try {
            const iconsSet = require(`@quasar/quasar-ui-qmediaplayer/src/components/icon-set/${set}.js`).default
            iconsList = iconsSet
          }
          catch (e) {
          /* eslint-disable-next-line no-console */
            console.error(`QMediaPlayer: cannot find icon set file called '${set}'`)
          }
        }
      }
      return iconsList
    }

    function __init () {
      state.bottomControls = props.bottomControls
      state.noControls = props.noControls
      if (props.nativeControls === true) {
        state.noControls = true
      }
      // set default track language
      __updateTrackLanguage()
      __updateSources()
      __updateTracks()
      // set big play button
      __updateBigPlayButton()
      // set the volume
      __updateVolume()
      // set muted
      __updateMuted()
      // set playback rates
      __updatePlaybackRates()
      // set playback rate default
      __updatePlaybackRate()
      // does user want cors?
      props.crossOrigin && __isMediaAvailable.value === true && $media.setAttribute('crossorigin', props.crossOrigin)
      // make sure "controls" is turned off
      __isMediaAvailable.value === true && ($media.controls = false)
      // set up event listeners on video
      __addMediaEventListeners()
      __addSourceEventListeners()
      __toggleCaptions()
    }

    function __addMediaEventListeners () {
      if (__isMediaAvailable.value === true) {
        allEvents.forEach((event) => {
          $media.addEventListener(event, __mediaEventHandler)
        })
      }
    }

    function __removeMediaEventListeners () {
      if (__isMediaAvailable.value === true) {
        allEvents.forEach((event) => {
          $media.removeEventListener(event, __mediaEventHandler)
        })
      }
    }

    function __addSourceEventListeners () {
      if (__isMediaAvailable.value === true) {
        const sources = $media.querySelectorAll('source')
        for (let index = 0; index < sources.length; ++index) {
          sources[index].addEventListener('error', __sourceEventHandler)
        }
      }
    }

    function __removeSourceEventListeners () {
      if (__isMediaAvailable.value === true) {
        const sources = $media.querySelectorAll('source')
        for (let index = 0; index < sources.length; ++index) {
          sources[index].removeEventListener('error', __sourceEventHandler)
        }
      }
    }

    function __sourceEventHandler (event) {
      const NETWORK_NO_SOURCE = 3
      if (__isMediaAvailable.value === true && $media.networkState === NETWORK_NO_SOURCE) {
        state.errorText = __isVideo.value ? lang.mediaPlayer.noLoadVideo : lang.mediaPlayer.noLoadAudio
      }
      // eslint-disable-next-line vue/custom-event-name-casing
      emit('networkState', event)
    }

    function __mediaEventHandler (event) {
      if (event.type === 'abort') {
        emit('abort')
      }
      else if (event.type === 'canplay') {
        state.playReady = true
        state.displayTime = timeParse($media.currentTime)
        __mouseEnterVideo()
        emit('ready')
      }
      else if (event.type === 'canplaythrough') {
      // console.log('canplaythrough')
        emit('canplaythrough')
      }
      else if (event.type === 'durationchange') {
        if (isFinite($media.duration)) {
          state.duration = $media.duration
          state.durationTime = timeParse($media.duration)
          emit('duration', $media.duration)
        }
      }
      else if (event.type === 'emptied') {
        emit('emptied')
      }
      else if (event.type === 'ended') {
        state.playing = false
        emit('ended')
      }
      else if (event.type === 'error') {
        const error = $media.error
        emit('error', error)
      }
      else if (event.type === 'interruptbegin') {
      // console.log('interruptbegin')
      }
      else if (event.type === 'interruptend') {
      // console.log('interruptend')
      }
      else if (event.type === 'loadeddata') {
        state.loading = false
        emit('loadeddata')
      }
      else if (event.type === 'loadedmetadata') {
      // tracks can only be programatically added after 'loadedmetadata' event
        state.metadataLoaded = true
        __updateTracks()
        // set default track language
        __updateTrackLanguage()
        __toggleCaptions()
        emit('loadedmetadata')
      }
      else if (event.type === 'stalled') {
        emit('stalled')
      }
      else if (event.type === 'suspend') {
        emit('suspend')
      }
      else if (event.type === 'loadstart') {
        emit('loadstart')
      }
      else if (event.type === 'pause') {
        state.playing = false
        emit('paused')
      }
      else if (event.type === 'play') {
        emit('play')
      }
      else if (event.type === 'playing') {
        state.playing = true
        emit('playing')
      }
      else if (event.type === 'progress') {
      //
      }
      else if (event.type === 'ratechange') {
      //
      }
      else if (event.type === 'seeked') {
      //
      }
      else if (event.type === 'timeupdate') {
        state.currentTime = $media.currentTime
        emit('timeupdate', $media.currentTime, state.remainingTime)
      }
      else if (event.type === 'volumechange') {
      //
      }
      else if (event.type === 'waiting') {
        emit('waiting')
      }
    }

    function __mergeClassOrStyle (type, val) {
      const child = {}
      if (val !== undefined) {
        if (typeof val === 'string') {
          if (type === 'style') {
            const parts = val.replace(/\s+/g, '').split(';')
            parts.forEach(part => {
              if (part !== '') {
                const data = part.split(':')
                child[data[0]] = data[1]
              }
            })
          }
          else if (type === 'class') {
            const parts = val.split(' ')
            parts.forEach(part => {
              if (part.replace(/\s+/g, '') !== '') {
                child[part] = true
              }
            })
          }
        }
        else {
          Object.assign(child, val)
        }
      }
      return child
    }

    // for future functionality
    function __cueChanged (data) {
    }

    function __checkCursor () {
      if (state.inFullscreen && state.playing && !state.showControls) {
        this.$el.classList.remove('cursor-inherit')
        this.$el.classList.add('cursor-none')
      }
      else {
        this.$el.classList.remove('cursor-none')
        this.$el.classList.add('cursor-inherit')
      }
    }

    function __adjustMenu () {
      const qmenu = menu.value
      if (qmenu) {
        setTimeout(() => {
          qmenu.updatePosition()
        }, 350)
      }
    }

    function __videoClick (e) {
      __stopAndPrevent(e)
      if (props.mobileMode !== true) {
        togglePlay()
      }
      toggleControls()
    }

    function __bigButtonClick (e) {
      __stopAndPrevent(e)
      if (props.mobileMode) {
        hideControls()
      }
      togglePlay()
    }

    function __settingsMenuShowing (val) {
      settingsMenuVisible.value = val
    }

    function __mouseEnterVideo (e) {
      if (!props.bottomControls && !props.mobileMode && !__isAudio.value) {
        showControls()
      }
    }

    function __mouseLeaveVideo (e) {
      if (!props.bottomControls && !props.mobileMode && !__isAudio.value) {
        hideControls()
      }
    }

    function __mouseMoveAction (e) {
      if (!props.bottomControls && !props.mobileMode && !__isAudio.value) {
        __showControlsIfValid(e)
      }
    }

    function __showControlsIfValid (e) {
      if (__showingMenu()) {
        showControls()
        return true
      }
      const x = getMousePosition(e, 'x')
      const y = getMousePosition(e, 'y')
      const pos = this.$el.getBoundingClientRect()
      if (!pos) return false
      if (x > pos.left && x < pos.left + pos.width) {
        if (y > pos.top + pos.height - (props.dense ? 40 : 80) && y < pos.top + pos.height) {
          showControls()
          return true
        }
      }
      return false
    }

    function __videoCurrentTimeChanged (val) {
      showControls()
      if (__isMediaAvailable.value === true && $media.duration && val && val > 0 && val <= state.duration) {
        if ($media.currentTime !== val) {
          state.currentTime = $media.currentTime = val
        }
      }
    }

    function __volumePercentChanged (val) {
      showControls()
      state.volume = val
    }

    function __trackLanguageChanged (language) {
      if (state.trackLanguage !== language) {
        state.trackLanguage = language
      }
    }

    function __playbackRateChanged (rate) {
      if (state.playbackRate !== rate) {
        state.playbackRate = rate
      }
    }

    function __showingMenu () {
      return settingsMenuVisible.value
    }

    function __updateBigPlayButton () {
      if (state.showBigPlayButton !== props.showBigPlayButton) {
        state.showBigPlayButton = props.showBigPlayButton
      }
    }

    function __updateVolume () {
      if (state.volume !== props.volume) {
        state.volume = props.volume
      }
    }

    function __updateMuted () {
      if (state.muted !== props.muted) {
        state.muted = props.muted
        if (__isMediaAvailable.value === true) {
          $media.muted = state.muted
        }
      }
    }

    function __updateTrackLanguage () {
      if (state.trackLanguage !== props.trackLanguage || lang.mediaPlayer.trackLanguageOff) {
        state.trackLanguage = props.trackLanguage || lang.mediaPlayer.trackLanguageOff
      }
    }

    function __updatePlaybackRates () {
      if (props.playbackRates && props.playbackRates.length > 0) {
        state.playbackRates = [...props.playbackRates]
      }
      else {
        state.playbackRates.splice(0, state.playbackRates.length)
        state.playbackRates.push({ label: lang.mediaPlayer.ratePoint5, value: 0.5 })
        state.playbackRates.push({ label: lang.mediaPlayer.rateNormal, value: 1 })
        state.playbackRates.push({ label: lang.mediaPlayer.rate1Point5, value: 1.5 })
        state.playbackRates.push({ label: lang.mediaPlayer.rate2, value: 2 })
      }
      state.trackLanguage = lang.mediaPlayer.trackLanguageOff
    }

    function __updatePlaybackRate () {
      if (state.playbackRate !== props.playbackRate) {
        state.playbackRate = props.playbackRate
      }
    }

    function __updateSources () {
      __removeSources()
      __addSources()
    }

    function __removeSources () {
      if (__isMediaAvailable.value === true) {
        __removeSourceEventListeners()
        // player must not be running
        $media.pause()
        $media.src = ''
        if ($media.currentTime) {
        // otherwise IE11 has exception error
          $media.currentTime = 0
        }
        const childNodes = $media.childNodes
        for (let index = childNodes.length - 1; index >= 0; --index) {
          if (childNodes[index].tagName === 'SOURCE') {
            $media.removeChild(childNodes[index])
          }
        }
        $media.load()
      }
    }

    function __addSources () {
      if (__isMediaAvailable.value === true) {
        let loaded = false
        if (props.source && props.source.length > 0) {
          $media.src = props.source
          loaded = true
        }
        else {
          if (props.sources.length > 0) {
            props.sources.forEach((source) => {
              const s = document.createElement('SOURCE')
              s.src = source.src ? source.src : ''
              s.type = source.type ? source.type : ''
              $media.appendChild(s)
              if (!loaded && source.src) {
                $media.src = source.src
                loaded = true
              }
            })
          }
        }
        __reset()
        __addSourceEventListeners()
        $media.load()
      }
    }

    function __updateTracks () {
      __removeTracks()
      __addTracks()
    }

    function __removeTracks () {
      if (__isMediaAvailable.value === true) {
        const childNodes = $media.childNodes
        for (let index = childNodes.length - 1; index >= 0; --index) {
          if (childNodes[index].tagName === 'TRACK') {
            $media.removeChild(childNodes[index])
          }
        }
      }
    }

    function __addTracks () {
    // only add tracks to video
      if (__isVideo.value && __isMediaAvailable.value === true) {
        props.tracks.forEach((track) => {
          const t = document.createElement('TRACK')
          t.kind = track.kind ? track.kind : ''
          t.label = track.label ? track.label : ''
          t.src = track.src ? track.src : ''
          t.srclang = track.srclang ? track.srclang : ''
          $media.appendChild(t)
        })
        nextTick(() => {
          __toggleCaptions()
        })
      }
    }

    function __updatePoster () {
      if (__isMediaAvailable.value === true) {
        $media.poster = props.poster
      }
    }

    function __bigButtonPositionHeight () {
      if ($media.value) {
      // top of video
        return $media.value.clientTop +
        // height of video / 2
        ($media.value.clientHeight / 2).toFixed(2) -
        // big button is 48px -- so 1/2 of that
        24 + 'px'
      }
      return '50%'
    }

    // Rendering Methods

    function __renderVideo () {
      const slot = slots.oldbrowser

      const attrs = {
        poster: props.poster,
        preload: props.preload,
        playsinline: props.playsinline === true,
        loop: props.loop === true,
        autoplay: props.autoplay === true,
        muted: props.muted === true,
        width: props.contentWidth || undefined,
        height: props.contentHeight || undefined
      }

      nextTick(() => {
        if ($media.value && props.nativeControls === true) {
          $media.value.controls = true
        }
      })

      return h('video', {
        ref: $media,
        class: {
          ...__renderVideoClasses.value,
          ...__mergeClassOrStyle('class', props.contentClass)
        },
        style: {
          ...__contentStyle.value
        },
        ...attrs
      }, [
        __isVideo.value && (slot || h('p', lang.mediaPlayer.oldBrowserVideo))
      ])
    }

    function __renderAudio () {
      const slot = slots.oldbrowser

      const attrs = {
        preload: props.preload,
        playsinline: props.playsinline === true,
        loop: props.loop === true,
        autoplay: props.autoplay === true,
        muted: props.muted === true,
        width: props.contentWidth || undefined,
        height: props.contentHeight || undefined
      }

      nextTick(() => {
        if ($media.value && props.nativeControls === true) {
          $media.value.controls = true
        }
      })

      // This is on purpose (not using audio tag).
      // The video tag can also play audio and works better if dynamically
      // switching between video and audio on the same component.
      // That being said, if audio is truly needed, use the 'nop-video'
      // property to force the <audio> tag.

      return h(props.noVideo === true ? 'audio' : 'video', {
        ref: $media,
        class: {
          'q-media--player': true,
          ...__mergeClassOrStyle('class', props.contentClass)
        },
        style: props.contentStyle,
        attrs
      }, [
        __isAudio.value && (slot || h('p', lang.mediaPlayer.oldBrowserAudio))
      ])
    }

    function __renderSources () {
      return props.sources.map((source) => {
        return h('source', {
          attrs: {
            key: source.src + ':' + source.type,
            src: source.src,
            type: source.type
          }
        })
      })
    }

    function __renderTracks () {
      return props.tracks.map((track) => {
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
    }

    function __renderOverlayWindow () {
      const slot = slots.overlay

      if (slot) {
        return h('div', {
          class: 'q-media__overlay-window fit'
        }, slot)
      }
    }

    function __renderErrorWindow () {
      const slot = slots.errorWindow

      return h('div', {
        class: 'q-media__error-window'
      }, [
        slot || h('div', state.errorText)
      ])
    }

    function __renderPlayButton () {
      if (props.hidePlayBtn === true) return

      const slot = slots.play

      const properties = {
        icon: state.playing ? iconSet.mediaPlayer.pause : iconSet.mediaPlayer.play,
        textColor: props.color,
        size: '1rem',
        disable: !state.playReady,
        flat: true,
        padding: '4px'
      }

      const events = {
        click: togglePlay
      }

      return slot || h(QBtn, {
        class: 'q-media__controls--button',
        ...properties,
        ...events
      }, [
        props.showTooltips && state.playing && h(QTooltip, lang.mediaPlayer.pause),
        props.showTooltips && !state.playing && state.playReady && h(QTooltip, lang.mediaPlayer.play)
      ])
    }

    function __renderVideoControls () {
      const slot = slots.controls

      const events = {
        click: __stopAndPrevent
      }

      if (slot) {
      // we need to know the controls height for fullscreen, stop propagation to video component
        return h('div', {
          ref: controls,
          class: {
            'q-media__controls': true,
            ...__videoControlsClasses.value
          },
          ...events
        },
        slot
        )
      }

      return h('div', {
        ref: controls,
        class: {
          'q-media__controls': true,
          ...__videoControlsClasses.value
        },
        ...events
      }, [
      // dense
        props.dense && h('div', {
          class: 'q-media__controls--row row col content-start items-center'
        }, [
          h('div', [
            __renderPlayButton(),
            props.showTooltips && !state.playReady && h(QTooltip, lang.mediaPlayer.waitingVideo)
          ]),
          __renderVolumeButton(),
          __renderVolumeSlider(),
          __renderDisplayTime(),
          __renderCurrentTimeSlider(),
          __renderDurationTime(),
          __renderSettingsButton(),
          $q.fullscreen !== void 0 && props.hideFullscreenBtn !== true && __renderFullscreenButton()
        ]),
        // sparse
        !props.dense && h('div', {
          class: 'q-media__controls--row row col items-center justify-between'
        }, [
          __renderDisplayTime(),
          __renderCurrentTimeSlider(),
          __renderDurationTime()
        ]),
        !props.dense && h('div', {
          class: 'q-media__controls--row row col content-start items-center'
        }, [
          h('div', {
            class: 'row col'
          }, [
            h('div', [
              __renderPlayButton(),
              props.showTooltips && !state.playReady && h(QTooltip, lang.mediaPlayer.waitingVideo)
            ]),
            __renderVolumeButton(),
            __renderVolumeSlider()
          ]),
          h('div', [
            __renderSettingsButton(),
            $q.fullscreen !== void 0 && props.hideFullscreenBtn !== true && __renderFullscreenButton()
          ])
        ])
      ])
    }

    function __renderAudioControls () {
      const slot = slots.controls

      return slot || h('div', {
        ref: controls,
        class: {
          'q-media__controls': true,
          ...__audioControlsClasses.value
        }
      }, [
        props.dense && h('div', {
          class: 'q-media__controls--row row col content-start items-center'
        }, [
        // dense
          h('div', [
            __renderPlayButton(),
            props.showTooltips && !state.playReady && h(QTooltip, lang.mediaPlayer.waitingAudio)
          ]),
          __renderVolumeButton(),
          __renderVolumeSlider(),
          __renderDisplayTime(),
          __renderCurrentTimeSlider(),
          __renderDurationTime()
        ]),
        // sparse
        !props.dense && h('div', {
          class: 'q-media__controls--row row col items-center justify-between'
        }, [
          __renderDisplayTime(),
          __renderCurrentTimeSlider(),
          __renderDurationTime()
        ]),
        !props.dense && h('div', {
          class: 'q-media__controls--row row col content-start items-center'
        }, [
          h('div', [
            __renderPlayButton(),
            props.showTooltips && !state.playReady && h(QTooltip, lang.mediaPlayer.waitingAudio)
          ]),
          __renderVolumeButton(),
          __renderVolumeSlider()
        ])
      ])
    }

    function __renderVolumeButton () {
      if (props.hideVolumeBtn === true) {
        return
      }
      const slot = slots.volume

      const properties = {
        icon: __volumeIcon.value,
        textColor: props.color,
        size: '1rem',
        disable: !state.playReady,
        flat: true,
        padding: '4px'
      }

      const events = {
        click: toggleMuted
      }

      return slot || h(QBtn, {
        class: 'q-media__controls--button',
        ...properties,
        ...events
      }, [
        props.showTooltips && !state.muted && h(QTooltip, lang.mediaPlayer.mute),
        props.showTooltips && state.muted && h(QTooltip, lang.mediaPlayer.unmute)
      ])
    }

    function __renderVolumeSlider () {
      if (props.hideVolumeSlider === true || props.hideVolumeBtn === true) {
        return
      }
      const slot = slots.volumeSlider

      const properties = {
        value: state.volume,
        color: props.color,
        dark: props.dark,
        min: 0,
        max: 100,
        disable: !state.playReady || state.muted
      }

      const events = {
        input: __volumePercentChanged
      }

      return slot || h(QSlider, {
        class: 'col',
        style: {
          width: '20%',
          margin: '0 0.5rem',
          minWidth: props.dense ? '20px' : '50px',
          maxWidth: props.dense ? '50px' : '200px'
        },
        ...properties,
        ...events
      })
    }

    function __renderSettingsButton () {
      if (props.hideSettingsBtn === true) {
        return
      }

      const slot = slots.settings

      return slot || h(QBtn, {
        class: 'q-media__controls--button',
        props: {
          icon: iconSet.mediaPlayer.settings,
          textColor: props.color,
          size: '1rem',
          disable: !state.playReady,
          flat: true,
          padding: '4px'
        }
      }, [
        props.showTooltips && !settingsMenuVisible.value && h(QTooltip, lang.mediaPlayer.settings),
        __renderSettingsMenu()
      ])
    }

    function __renderFullscreenButton () {
      const slot = slots.fullscreen

      const events = {
        click: toggleFullscreen
      }

      return slot || h(QBtn, {
        class: 'q-media__controls--button',
        props: {
          icon: state.inFullscreen ? iconSet.mediaPlayer.fullscreenExit : iconSet.mediaPlayer.fullscreen,
          textColor: props.color,
          size: '1rem',
          disable: !state.playReady,
          flat: true,
          padding: '4px'
        },
        ...events
      }, [
        props.showTooltips && h(QTooltip, lang.mediaPlayer.toggleFullscreen)
      ])
    }

    function __renderLoader () {
      if (props.spinnerSize === void 0) {
        if (__isVideo.value) state.spinnerSize = '3em'
        else state.spinnerSize = '1.5em'
      }
      else {
        state.spinnerSize = props.spinnerSize
      }

      const slot = slots.spinner

      return slot || h('div', {
        class: __isVideo.value ? 'q-media__loading--video' : 'q-media__loading--audio'
      }, [
        h(QSpinner, {
          props: {
            size: state.spinnerSize,
            color: props.color
          }
        })
      ])
    }

    function __renderBigPlayButton () {
      const slot = slots.bigPlayButton

      const events = {
        click: __bigButtonClick
      }

      return slot || h('div', setBorderColor(props.bigPlayButtonColor, {
        class: state.bottomControls === true ? 'q-media--big-button q-media--big-button-bottom-controls' : 'q-media--big-button',
        style: {
          top: __bigButtonPositionHeight()
        }
      }), [
        h(QIcon, setTextColor(props.bigPlayButtonColor, {
          props: {
            name: iconSet.mediaPlayer.bigPlayButton
          },
          class: 'q-media--big-button-icon',
          ...events,
          directives: [
            {
              name: 'ripple',
              value: true
            }
          ]
        }))
      ])
    }

    function __renderCurrentTimeSlider () {
      const slot = slots.positionSlider

      const properties = {
        value: state.currentTime,
        color: props.color,
        dark: props.dark,
        min: 0,
        max: state.duration ? state.duration : 1,
        disable: !state.playReady || props.disabledSeek
      }

      const events = {
        input: __videoCurrentTimeChanged
      }

      return slot || h(QSlider, {
        class: 'col',
        style: {
          margin: '0 0.5rem'
        },
        ...properties,
        ...events
      })
    }

    function __renderDisplayTime () {
      const slot = slots.displayTime

      return slot || h('span', {
        class: 'q-media__controls--video-time-text' + ' text-' + props.color
      }, state.displayTime)
    }

    function __renderDurationTime () {
      if (__isMediaAvailable.value !== true) return

      const slot = slots.durationTime
      const isInfinity = !isFinite($media.duration)

      return slot || h('span', {
        class: 'q-media__controls--video-time-text' + ' text-' + props.color,
        style: {
          width: isInfinity ? '30px' : 'auto'
        }
      }, [
        __isMediaAvailable.value === true && isInfinity !== true && state.durationTime,
        __isMediaAvailable.value === true && isInfinity === true && __renderInfinitySvg()
      ])
    }

    function __renderInfinitySvg () {
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
    }

    function __renderSettingsMenu () {
      const slot = slots.settingsMenu

      const properties = {
        anchor: 'top right',
        self: 'bottom right'
      }

      const events = {
        show: () => {
          __settingsMenuShowing(true)
        },
        hide: () => {
          __settingsMenuShowing(false)
        }
      }

      return h(QMenu, {
        ref: menu,
        ...properties,
        ...events
      }, [
        slot || h('div', [
          state.playbackRates.length && h(QExpansionItem, {
          // props
            group: 'settings-menu',
            expandSeparator: true,
            icon: iconSet.mediaPlayer.speed,
            label: lang.mediaPlayer.speed,
            caption: __settingsPlaybackCaption.value,
            // events
            show: __adjustMenu,
            hide: __adjustMenu
          }, [
            h(QList, {
            // props
              highlight: true
            }, [
              state.playbackRates.map((rate) => {
                return h(QItem, {
                // attrs
                  key: rate.value,
                  // props
                  clickable: true,
                  // events
                  click: (e) => {
                    __stopAndPrevent(e)
                    __playbackRateChanged(rate.value)
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
                  // props
                    avatar: true
                  }, [
                    rate.value === state.playbackRate && h(QIcon, {
                    // props
                      name: iconSet.mediaPlayer.selected
                    })
                  ]),
                  h(QItemSection, rate.label)
                ])
              })
            ])
          ]),
          // first item is 'Off' and doesn't count unless more are added
          __selectTracksLanguageList.value.length > 1 && h(QExpansionItem, {
          // proips
            group: 'settings-menu',
            expandSeparator: true,
            icon: iconSet.mediaPlayer.language,
            label: lang.mediaPlayer.language,
            caption: state.trackLanguage,
            // events
            show: __adjustMenu,
            hide: __adjustMenu
          }, [
            h(QList, {
            // props
              highlight: true
            }, [
              __selectTracksLanguageList.value.map((language) => {
                return h(QItem, {
                // attrs
                  key: language.value,
                  // props
                  clickable: true,
                  // events
                  click: (e) => {
                    __stopAndPrevent(e)
                    __trackLanguageChanged(language.value)
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
                  // props
                    avatar: true
                  }, [
                    language.value === state.trackLanguage &&
                    h(QIcon, {
                      // props
                      name: iconSet.mediaPlayer.selected
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

    function __renderMediaPlayer () {
      const events = {
        mousemove: __mouseMoveAction,
        mouseenter: __mouseEnterVideo,
        mouseleave: __mouseLeaveVideo,
        click: __videoClick
      }

      return h('div', {
        class: {
          ['q-media bg-' + props.backgroundColor]: true,
          ...__classes.value
        },
        style: {
          borderRadius: !state.inFullscreen ? props.radius : 0,
          height: __isVideo.value ? 'auto' : props.dense ? '40px' : '80px'
        },
        ...events
      }, canRender.value === true
        ? [
            __isVideo.value && __renderVideo(),
            __isAudio.value && __renderAudio(),
            __renderOverlayWindow(),
            state.errorText && __renderErrorWindow(),
            __isVideo.value && !state.noControls && !state.errorText && __renderVideoControls(),
            __isAudio.value && !state.noControls && !state.errorText && __renderAudioControls(),
            props.showSpinner && state.loading && !state.playReady && !state.errorText && __renderLoader(),
            __isVideo.value && props.showBigPlayButton && state.playReady && !state.playing && __renderBigPlayButton()
          ]
        : void 0)
    }

    // expose public methods
    expose({
      loadFileBlob,
      showControls,
      hideControls,
      toggleControls,
      play,
      pause,
      mute,
      unmute,
      togglePlay,
      toggleMuted,
      toggleFullscreen,
      setFullscreen,
      exitFullscreen,
      currentTime,
      setCurrentTime,
      setVolume
    })

    return () => __renderMediaPlayer()
  }
})
