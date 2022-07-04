import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  reactive,
  ref,
  watch,
  withDirectives
} from 'vue'

import {
  ClosePopup,
  QBtn,
  QExpansionItem,
  QIcon,
  QItem,
  QItemSection,
  QList,
  QMenu,
  QSlider,
  QSpinner,
  QTooltip,
  Ripple,
  useQuasar
} from 'quasar'

import {
  matClose
} from '@quasar/extras/material-icons/index.mjs'

function hSlot (slot, otherwise) {
  return slot !== void 0
    ? slot()
    : otherwise
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
    type: {
      type: String,
      required: false,
      default: 'video',
      validator: v => [ 'video', 'audio' ].includes(v)
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
      type: [String],
      default: null,
      validator: v => v === null || [ 'anonymous', 'use-credentials' ].includes(v)
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
      validator: v => [ 'none', 'metadata', 'auto' ].includes(v)
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
      default: 4000
    },
    playbackRates: Array,
    // initial playback rate
    playbackRate: {
      type: Number,
      default: 1
    },
    dark: Boolean,
    radius: {
      type: [ Number, String ],
      default: 0
    },
    contentStyle: [ String, Object ],
    contentClass: [ String, Object ],
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
      vm = getCurrentInstance(),
      $q = useQuasar() || vm.proxy.$q || vm.ctx.$q,
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
        inControls: false,
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

    // Computed

    const __classes = computed(() => {
      return {
        'q-media__fullscreen': state.inFullscreen,
        'q-media__fullscreen--window': state.inFullscreen
      }
    })

    const __renderVideoClasses = computed(() => {
      return {
        'q-media--player': true,
        'q-media--player--bottom-controls--standard': !props.dense && state.bottomControls && state.inFullscreen,
        'q-media--player--bottom-controls--dense': props.dense && state.bottomControls && state.inFullscreen
      }
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
          style.height = `calc(100% - ${ __controlsHeight.value }px)`
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
        track.label = track.value = props.tracks[ index ].label
        tracksList.push(track)
      }
      return tracksList
    })

    const __isMediaAvailable = computed(() => $media.value && $media.value.volume !== undefined)

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

    watch(() => $media.value, () => {
      __init()
      emit('mediaPlayer', $media.value)
    })

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

    // watch(() => $route, val => {
    //   exitFullscreen()
    // })

    watch($q.lang, val => {
      __setupLang()
    })

    watch($q.iconSet, val => {
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
        $media.value.playbackRate = parseFloat(val)
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
        if ($media.value.volume !== volume) {
          $media.value.volume = volume
          emit('volume', val)
        }
      }
    })

    watch(() => state.muted, val => {
      emit('muted', val)
    })

    watch(() => state.currentTime, val => {
      if (__isMediaAvailable.value === true && state.playReady) {
        if (isFinite($media.value.duration)) {
          state.remainingTime = timeParse($media.value.duration - $media.value.currentTime)
        }
        state.displayTime = timeParse($media.value.currentTime)
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

    // watch(() => state.inControls, (val) => {
    //   console.log('inControls:', val)
    // })

    onBeforeMount(() => {
      canRender.value = window !== undefined // SSR
      if (canRender.value === true) {
        __setupLang()
        __setupIcons()
      }
    })

    onBeforeUnmount(() => {
      if (canRender.value === true) {
        // make sure not still in fullscreen
        exitFullscreen()

        // make sure noScroll is not left in unintended state
        document.body.classList.remove('no-scroll')

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
            $media.value.src = event.target.result
            __reset()
            __addSourceEventListeners()
            $media.value.load()
            state.loading = false
          }
          reader.readAsDataURL(fileList[ 0 ])
          return true
        }
        else {
          /* eslint-disable-next-line no-console */
          console.error('[QMediaPlayer]: loadFileBlob method requires a FileList')
        }
      }
      return false
    }

    function showControls () {
      // no controls - always off
      if (state.noControls) {
        state.showControls = false
        return
      }
      // bottom controls - always on
      if (state.bottomControls) {
        state.showControls = true
        return
      }
      // kill timer, if there is one
      if (timer.hideControlsTimer) {
        clearTimeout(timer.hideControlsTimer)
        timer.hideControlsTimer = null
      }
      // show controls
      state.showControls = true
      // check if hide cursor (fullscreen)
      __checkCursor()
      // set the timer
      if (props.controlsDisplayTime !== -1 && !props.mobileMode && __isVideo.value) {
        timer.hideControlsTimer = setTimeout(() => {
          // hide controls, but not if menu is showing
          if (!__showingMenu() && state.inControls !== true) {
            state.showControls = false
            timer.hideControlsTimer = null
            __checkCursor()
          }
          else {
            showControls()
          }
          // user configured display time (in ms)
        }, props.controlsDisplayTime)
      }
    }

    function hideControls () {
      if (state.inControls) return
      // no controls - always off
      if (state.noControls) {
        state.showControls = false
        return
      }
      // bottom controls - always on
      if (state.bottomControls) {
        state.showControls = true
        return
      }
      // clear timer if there is one
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
      if (__isMediaAvailable.value === true && state.playReady === true) {
        const hasPromise = typeof $media.value.play() !== 'undefined'
        if (hasPromise) {
          $media.value.play()
            .then(() => {
              state.showBigPlayButton = false
              state.playing = true
              __mouseLeaveVideo()
              return true
            })
            .catch((e) => {
            })
        }
        else {
          // IE11 + EDGE support
          $media.value.play()
          state.showBigPlayButton = false
          state.playing = true
          __mouseLeaveVideo()
        }
      }
    }

    function pause () {
      if (__isMediaAvailable.value === true && state.playReady === true) {
        if (state.playing) {
          $media.value.pause()
          state.showBigPlayButton = true
          state.playing = false
        }
      }
    }

    function mute () {
      state.muted = true
      if (__isMediaAvailable.value === true) {
        $media.value.muted = state.muted === true
      }
    }

    function unmute () {
      state.muted = false
      if (__isMediaAvailable.value === true) {
        $media.value.muted = state.muted !== true
      }
    }

    function togglePlay (e) {
      __stopAndPrevent(e)
      if (__isMediaAvailable.value === true && state.playReady === true) {
        if (state.playing) {
          $media.value.pause()
          state.showBigPlayButton = true
          state.playing = false
        }
        else {
          const hasPromise = typeof $media.value.play() !== 'undefined'
          if (hasPromise) {
            $media.value.play()
              .then(() => {
                state.showBigPlayButton = false
                state.playing = true
                __mouseLeaveVideo()
                  return true
              })
              .catch((e) => {
              })
          }
          else {
            // IE11 + EDGE support
            $media.value.play()
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
        $media.value.muted = state.muted === true
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
        $q.fullscreen.request($media.value.parentNode) // NOTE error Not capable - on iPhone Safari
        document.body.classList.add('no-scroll')
        // nextTick(() => {
        //   forceUpdate()
        // })
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
        // nextTick(() => {
        //   forceUpdate()
        // })
      }
    }

    function currentTime () {
      if (__isMediaAvailable.value === true && state.playReady === true) {
        return $media.value.currentTime
      }
      return -1
    }

    function setCurrentTime (seconds) {
      if (state.playReady) {
        if (__isMediaAvailable.value === true && isFinite($media.value.duration) && seconds >= 0 && seconds <= $media.value.duration) {
          state.currentTime = $media.value.currentTime = seconds
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
        for (let index = 0; index < $media.value.textTracks.length; ++index) {
          if ($media.value.textTracks[ index ].label === lang) {
            $media.value.textTracks[ index ].mode = 'showing'
            $media.value.textTracks[ index ].oncuechange = __cueChanged
          }
          else {
            $media.value.textTracks[ index ].mode = 'hidden'
            $media.value.textTracks[ index ].oncuechange = null
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

    async function __setupLang () {
      const isoName = $q.lang.isoName || 'en-US'
      let language
      try {
        // language = require(`./lang/${isoName}`)
        language = await __loadLang(isoName)
      }
      catch (e) {
      }

      if (language !== void 0 && language.lang !== void 0) {
        lang.mediaPlayer = { ...language.mediaPlayer }
        __updatePlaybackRates()
        __updateTrackLanguage()
      }
    }

    async function __loadLang (lang) {
      let langList = {}
      if (lang) {
        // detect if UMD version is installed
        if (window && window.QMediaPlayer && window.QMediaPlayer.Component) {
          const name = lang.replace(/-([a-z])/g, g => g[ 1 ].toUpperCase())
          if (window.QMediaPlayer.lang && window.QMediaPlayer.lang[ name ]) {
            langList = window.QMediaPlayer.lang[ name ]
          }
          else {
            /* eslint-disable-next-line no-console */
            console.error(`[QMediaPlayer]: No language loaded called '${ lang }'`)
            /* eslint-disable-next-line no-console */
            console.error('[QMediaPlayer]: Be sure to load the UMD version of the language in a script tag before using with UMD')
          }
        }
        else {
          try {
            const result = await import(
              /* webpackChunkName: "[request]" */
              `@quasar/quasar-ui-qmediaplayer/lang/${ lang }.js`
            )
            langList = result.default
          }
          catch (e) {
            /* eslint-disable-next-line no-console */
            console.error(`[QMediaPlayer]: Cannot find language file called '${ lang }'`)
          }
        }
      }
      return langList
    }

    async function __setupIcons () {
      const iconSetName = $q.iconSet.name || 'material-icons'
      let icnSet
      try {
        icnSet = await __loadIconSet(iconSetName)
      }
      catch (e) {
      }
      icnSet !== void 0 && icnSet.name !== void 0 && (iconSet.mediaPlayer = { ...icnSet.mediaPlayer })
    }

    async function __loadIconSet (set) {
      let iconsList = {}
      if (set) {
        // detect if UMD version is installed
        if (window && window.QMediaPlayer && window.QMediaPlayer.Component) {
          const name = set.replace(/-([a-z])/g, g => g[ 1 ].toUpperCase())
          if (window.QMediaPlayer.iconSet && window.QMediaPlayer.iconSet[ name ]) {
            iconsList = window.QMediaPlayer.iconSet[ name ]
          }
          else {
            /* eslint-disable-next-line no-console */
            console.error(`[QMediaPlayer]: No icon set loaded called '${ set }'`)
            /* eslint-disable-next-line no-console */
            console.error('[QMediaPlayer]:Be sure to load the UMD version of the icon set in a script tag before using with UMD')
          }
        }
        else {
          try {
            const result = await import (
              /* webpackChunkName: "[request]" */
              `@quasar/quasar-ui-qmediaplayer/icon-set/${ set }.js`
            )
            iconsList = result.default
          }
          catch (e) {
            /* eslint-disable-next-line no-console */
            console.error(`[QMediaPlayer]: Cannot find icon set file called '${ set }'`)
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
      props.crossOrigin && __isMediaAvailable.value === true && $media.value.setAttribute('crossorigin', props.crossOrigin)
      // make sure "controls" is turned off
      __isMediaAvailable.value === true && ($media.value.controls = false)
      // set up event listeners on video
      __addMediaEventListeners()
      __addSourceEventListeners()
      __toggleCaptions()
    }

    function __addMediaEventListeners () {
      if (__isMediaAvailable.value === true) {
        allEvents.forEach((event) => {
          $media.value.addEventListener(event, __mediaEventHandler)
        })
      }
    }

    function __removeMediaEventListeners () {
      if (__isMediaAvailable.value === true) {
        allEvents.forEach((event) => {
          $media.value.removeEventListener(event, __mediaEventHandler)
        })
      }
    }

    function __addSourceEventListeners () {
      if (__isMediaAvailable.value === true) {
        const sources = $media.value.querySelectorAll('source')
        for (let index = 0; index < sources.length; ++index) {
          sources[ index ].addEventListener('error', __sourceEventHandler)
        }
      }
    }

    function __removeSourceEventListeners () {
      if (__isMediaAvailable.value === true) {
        const sources = $media.value.querySelectorAll('source')
        for (let index = 0; index < sources.length; ++index) {
          sources[ index ].removeEventListener('error', __sourceEventHandler)
        }
      }
    }

    function __sourceEventHandler (event) {
      const NETWORK_NO_SOURCE = 3
      if (__isMediaAvailable.value === true && $media.value.networkState === NETWORK_NO_SOURCE) {
        state.errorText = __isVideo.value ? lang.mediaPlayer.noLoadVideo : lang.mediaPlayer.noLoadAudio
        state.loading = false
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
        state.displayTime = timeParse($media.value.currentTime)
        showControls()
        emit('ready')
      }
      else if (event.type === 'canplaythrough') {
        // console.log('canplaythrough')
        emit('canplaythrough')
      }
      else if (event.type === 'durationchange') {
        if (isFinite($media.value.duration)) {
          state.duration = $media.value.duration
          state.durationTime = timeParse($media.value.duration)
          emit('duration', $media.value.duration)
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
        const error = $media.value.error
        state.errorText = error && error.message ? error.message : null
        state.playing = false
        state.loading = false
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
        state.currentTime = $media.value.currentTime
        emit('timeupdate', $media.value.currentTime, state.remainingTime)
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
                child[ data[ 0 ] ] = data[ 1 ]
              }
            })
          }
          else if (type === 'class') {
            const parts = val.split(' ')
            parts.forEach(part => {
              if (part.replace(/\s+/g, '') !== '') {
                child[ part ] = true
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
      if (__isMediaAvailable.value === true) {
        if (state.inFullscreen && state.playing && !state.showControls) {
          $media.value.classList.remove('cursor-inherit')
          $media.value.classList.add('cursor-none')
        }
        else {
          $media.value.classList.remove('cursor-none')
          $media.value.classList.add('cursor-inherit')
        }
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

    function __mouseLeaveVideo (e) {
      if (e.relatedTarget && e.relatedTarget.className === 'q-pa-md') {
        if (!props.bottomControls && !props.mobileMode && !__isAudio.value && state.inControls !== true) {
          hideControls()
        }
      }
    }

    function __mouseMoveAction (e) {
      if (!props.bottomControls && !props.mobileMode && !__isAudio.value) {
        __showControlsIfValid(e)
      }
    }

    function __getParentEl (el, className) {
      if (!el) return null
      if (String(el.className).startsWith(className)) {
        return el
      }
      return __getParentEl(el.offsetParent, className)
    }

    function __showControlsIfValid (e) {
      const pos = $media.value.getBoundingClientRect()
      const el = __getParentEl(e.target, 'q-media')
      if (!el) return
      var rect = el.getBoundingClientRect()
      if (!pos || !rect) return false
      if (rect.left === pos.left && rect.top === pos.top && rect.height === pos.height && rect.width === pos.width) {
        showControls()
        return true
      }

      return false
    }

    function __videoCurrentTimeChanged (val) {
      showControls()
      if (__isMediaAvailable.value === true && $media.value.duration && val && val > 0 && val <= state.duration) {
        if ($media.value.currentTime !== val) {
          state.currentTime = $media.value.currentTime = val
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
          $media.value.muted = state.muted
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
        $media.value.pause()
        $media.value.src = ''
        if ($media.value.currentTime) {
          // otherwise IE11 has exception error
          $media.value.currentTime = 0
        }
        const childNodes = $media.value.childNodes
        for (let index = childNodes.length - 1; index >= 0; --index) {
          if (childNodes[ index ].tagName === 'SOURCE') {
            $media.value.removeChild(childNodes[ index ])
          }
        }
        $media.value.load()
      }
    }

    function __addSources () {
      if (__isMediaAvailable.value === true) {
        let loaded = false
        if (props.source && props.source.length > 0) {
          $media.value.src = props.source
          loaded = true
        }
        else {
          if (props.sources.length > 0) {
            props.sources.forEach((source) => {
              const s = document.createElement('SOURCE')
              s.src = source.src ? source.src : ''
              s.type = source.type ? source.type : ''
              $media.value.appendChild(s)
              if (!loaded && source.src) {
                $media.value.src = source.src
                loaded = true
              }
            })
          }
        }
        __reset()
        __addSourceEventListeners()
        $media.value.load()
      }
    }

    function __updateTracks () {
      __removeTracks()
      __addTracks()
    }

    function __removeTracks () {
      if (__isMediaAvailable.value === true) {
        const childNodes = $media.value.childNodes
        for (let index = childNodes.length - 1; index >= 0; --index) {
          if (childNodes[ index ].tagName === 'TRACK') {
            $media.value.removeChild(childNodes[ index ])
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
          $media.value.appendChild(t)
        })
        nextTick(() => {
          __toggleCaptions()
        })
      }
    }

    function __updatePoster () {
      if (__isMediaAvailable.value === true && props.poster) {
        $media.value.poster = props.poster
      }
    }

    function __bigButtonPositionHeight () {
      if ($media.value) {
        // top of video
        return $media.value.clientTop
          // height of video / 2
          + ($media.value.clientHeight / 2).toFixed(2)
          // big button is 48px -- so 1/2 of that
          - 24 + 'px'
      }
      return '50%'
    }

    function __mouseEnterControls () {
      state.inControls = true
    }
    function __mouseLeaveControls () {
      state.inControls = false
    }


    // Rendering Methods

    function __renderVideo () {
      const slot = slots.oldbrowser

      const attrs = {
        poster: (props.poster ? props.poster : false),
        preload: props.preload,
        playsinline: props.playsinline === true,
        loop: props.loop === true,
        autoplay: props.autoplay === true,
        muted: props.muted === true,
        width: props.contentWidth || undefined,
        height: props.contentHeight || undefined
      }

      nextTick(() => {
        if (__isMediaAvailable.value && props.nativeControls === true) {
          $media.value.controls = true
        }
      }).catch(e => console.error(e))

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
      }, hSlot(slot, h('p', lang.mediaPlayer.oldBrowserVideo)))
    }

    function __renderAudio () {
      const slot = slots.oldbrowser

      const attrs = {
        poster: (props.poster ? props.poster : false),
        preload: props.preload,
        playsinline: props.playsinline === true,
        loop: props.loop === true,
        autoplay: props.autoplay === true,
        muted: props.muted === true,
        width: props.contentWidth || undefined,
        height: props.contentHeight || undefined
      }

      nextTick(() => {
        if (__isMediaAvailable.value && props.nativeControls === true) {
          $media.value.controls = true
        }
      }).catch(e => console.error(e))

      // This is on purpose (not using audio tag).
      // The video tag can also play audio and works better if dynamically
      // switching between video and audio on the same component.
      // That being said, if audio is truly needed, use the 'no-video'
      // property to force the <audio> tag.

      return h(props.noVideo === true ? 'audio' : 'video', {
        ref: $media,
        class: {
          'q-media--player': true,
          ...__mergeClassOrStyle('class', props.contentClass)
        },
        style: props.contentStyle,
        ...attrs
      }, hSlot(slot, h('p', lang.mediaPlayer.oldBrowserAudio)))
    }

    // function __renderSources () {
    //   return props.sources.map((source) => {
    //     return h('source', {
    //       attrs: {
    //         key: source.src + ':' + source.type,
    //         src: source.src,
    //         type: source.type
    //       }
    //     })
    //   })
    // }

    // function __renderTracks () {
    //   return props.tracks.map((track) => {
    //     return h('track', {
    //       attrs: {
    //         key: track.src + ':' + track.kind,
    //         src: track.src,
    //         kind: track.kind,
    //         label: track.label,
    //         srclang: track.srclang
    //       }
    //     })
    //   })
    // }

    function __renderOverlayWindow () {
      if (slots.overlay) {
        return h('div', {
          class: 'q-media__overlay-window fit'
        }, slots.overlay())
      }
    }

    function errorWindowCloseButton () {
      return h(QBtn, {
        class: 'q-media__error-window--button',
        onClick: () => { state.errorText = null },
        icon: matClose,
        flat: true,
        size: 'sm'
      })
    }

    function __renderErrorWindow () {
      const slot = slots.errorWindow

      return h('div', {
        class: 'q-media__error-window'
      }, hSlot(slot, h('span', [state.errorText, errorWindowCloseButton()])))
    }

    function __renderPlayButton () {
      if (props.hidePlayBtn === true) return

      const slot = slots.play

      const properties = {
        icon: state.playing ? iconSet.mediaPlayer.pause : iconSet.mediaPlayer.play,
        size: '1rem',
        disable: !state.playReady,
        flat: true,
        padding: '4px'
      }

      const events = {
        onClick: togglePlay
      }

      return (slot && slot()) || h(QBtn, {
        class: 'q-media__controls--button play-button',
        ...properties,
        ...events
      }, () => [
        props.showTooltips && state.playing && h(QTooltip, () => lang.mediaPlayer.pause),
        props.showTooltips && !state.playing && state.playReady && h(QTooltip, () => lang.mediaPlayer.play)
      ])
    }

    function __renderVideoControls () {
      const slot = slots.controls

      const events = {
        onClick: __stopAndPrevent,
        onMouseenter: __mouseEnterControls,
        onMouseleave: __mouseLeaveControls,
      }

      if (slot) {
        // we need to know the controls height for fullscreen, stop propagation to video component
        return h('div', {
          ref: controls,
          class: {
            'q-media__controls': true,
            'q-media__controls--overlay': __isVideo.value === true && state.bottomControls !== true,
            ...__videoControlsClasses.value
          },
          ...events
        },
        slot()
        )
      }

      return h('div', {
        ref: controls,
        class: {
          'q-media__controls': true,
          'q-media__controls--overlay': __isVideo.value === true && state.bottomControls !== true,
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
            props.showTooltips && !state.playReady && h(QTooltip, () => lang.mediaPlayer.waitingVideo)
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
              props.showTooltips && !state.playReady && h(QTooltip, () => lang.mediaPlayer.waitingVideo)
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

      return (slot && slot()) || h('div', {
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
            props.showTooltips && !state.playReady && h(QTooltip, () => lang.mediaPlayer.waitingAudio)
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
            props.showTooltips && !state.playReady && h(QTooltip, () => lang.mediaPlayer.waitingAudio)
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
        size: '1rem',
        disable: !state.playReady,
        flat: true,
        padding: '4px'
      }

      const events = {
        onClick: toggleMuted
      }

      return (slot && slot()) || h(QBtn, {
        class: 'q-media__controls--button volume-button',
        style: {
          color: props.dark === true || $q.dark.isActive ? 'var(--mediaplayer-color-dark)' : 'var(--mediaplayer-color)'
        },
        ...properties,
        ...events
      }, () => [
        props.showTooltips === true
          ? state.muted === true
            ? h(QTooltip, () => lang.mediaPlayer.unmute)
            : h(QTooltip, () => lang.mediaPlayer.mute)
          : undefined
      ])
    }

    function __renderVolumeSlider () {
      if (props.hideVolumeSlider === true || props.hideVolumeBtn === true) {
        return
      }
      const slot = slots.volumeSlider

      const properties = {
        modelValue: state.volume,
        dark: props.dark,
        min: 0,
        max: 100,
        disable: !state.playReady || state.muted
      }

      const events = {
        onChange: __volumePercentChanged
      }

      return (slot && slot()) || h(QSlider, {
        class: 'col',
        style: {
          width: '20%',
          margin: '0 0.5rem',
          minWidth: props.dense ? '20px' : '50px',
          maxWidth: props.dense ? '50px' : '200px',
          color: props.dark === true || $q.dark.isActive ? 'var(--mediaplayer-color-dark)' : 'var(--mediaplayer-color)'
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

      const properties = {
        icon: iconSet.mediaPlayer.settings,
        size: '1rem',
        disable: !state.playReady,
        flat: true,
        padding: '4px'
      }

      return (slot && slot()) || h(QBtn, {
        class: 'q-media__controls--button settings-button',
        ...properties
      }, () => [
        props.showTooltips === true && !settingsMenuVisible.value
          ? h(QTooltip, () => lang.mediaPlayer.settings)
          : undefined,
        __renderSettingsMenu()
      ])
    }

    function __renderFullscreenButton () {
      const slot = slots.fullscreen

      const properties = {
        icon: state.inFullscreen ? iconSet.mediaPlayer.fullscreenExit : iconSet.mediaPlayer.fullscreen,
        size: '1rem',
        disable: !state.playReady,
        flat: true,
        padding: '4px'
      }

      const events = {
        onClick: toggleFullscreen
      }

      return (slot && slot()) || h(QBtn, {
        class: 'q-media__controls--button fullscreen-button',
        ...properties,
        ...events
      }, () => [
        props.showTooltips === true
          ? h(QTooltip, () => lang.mediaPlayer.toggleFullscreen)
          : undefined
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

      return (slot && slot()) || h('div', {
        class: __isVideo.value ? 'q-media__loading--video' : 'q-media__loading--audio'
      }, [
        h(QSpinner, {
          size: state.spinnerSize
        })
      ])
    }

    function __renderBigPlayButton () {
      const slot = slots.bigPlayButton

      const events = {
        onClick: __bigButtonClick
      }

      return (slot && slot()) || h('div', {
        class: {
          'q-media--big-button q-media--big-button-bottom-controls': state.bottomControls === true,
          'q-media--big-button': state.bottomControls !== true
        },
        style: {
          top: __bigButtonPositionHeight()
        }
      }, [
        h(QIcon, {
          name: iconSet.mediaPlayer.bigPlayButton,
          class: 'q-media--big-button-icon',
          ...events
        })
      ])
    }

    function __renderCurrentTimeSlider () {
      const slot = slots.positionSlider

      const properties = {
        modelValue: state.currentTime,
        dark: props.dark,
        min: 0,
        max: state.duration ? state.duration : 1,
        disable: !state.playReady || props.disabledSeek
      }

      const events = {
        onChange: __videoCurrentTimeChanged
      }

      return (slot && slot()) || h(QSlider, {
        class: 'col',
        style: {
          margin: '0 0.5rem',
          color: props.dark === true || $q.dark.isActive ? 'var(--mediaplayer-color-dark)' : 'var(--mediaplayer-color)'
        },
        ...properties,
        ...events
      })
    }

    function __renderDisplayTime () {
      const slot = slots.displayTime

      return (slot && slot()) || h('span', {
        class: 'q-media__controls--video-time-text text-left',
        style: {
          color: props.dark === true || $q.dark.isActive ? 'var(--mediaplayer-color-dark)' : 'var(--mediaplayer-color)'
        }
      }, state.displayTime)
    }

    function __renderDurationTime () {
      if (__isMediaAvailable.value !== true) return

      const slot = slots.durationTime
      const isInfinity = !isFinite($media.value.duration)

      return (slot && slot()) || h('span', {
        class: 'q-media__controls--video-time-text text-right',
        style: {
          width: isInfinity ? '30px' : 'auto',
          color: props.dark === true || $q.dark.isActive ? 'var(--mediaplayer-color-dark)' : 'var(--mediaplayer-color)'
        }
      }, [
        __isMediaAvailable.value === true && isInfinity !== true && state.durationTime,
        __isMediaAvailable.value === true && isInfinity === true && __renderInfinitySvg()
      ])
    }

    function __renderInfinitySvg () {
      return h('svg', {
        height: '16',
        viewbox: '0 0 16 16'
      }, [
        h('path', {
          fill: 'none',
          color: props.dark === true || $q.dark.isActive ? 'var(--mediaplayer-color-dark)' : 'var(--mediaplayer-color)',
          strokeWidth: '2',
          d: 'M8,8 C16,0 16,16 8,8 C0,0 0,16 8,8z'
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
        onShow: () => {
          __settingsMenuShowing(true)
        },
        onHide: () => {
          __settingsMenuShowing(false)
        }
      }

      return h(QMenu, {
        ref: menu,
        ...properties,
        ...events
      }, () => [
        (slot && slot()) || h('div', [
          state.playbackRates.length > 0 && h(QExpansionItem, {
            // props
            group: 'settings-menu',
            expandSeparator: true,
            icon: iconSet.mediaPlayer.speed,
            label: lang.mediaPlayer.speed,
            caption: __settingsPlaybackCaption.value,
            // events
            onShow: __adjustMenu,
            onHide: __adjustMenu
          }, () => [
            h(QList, {
              // props
              highlight: true
            }, () => [
              state.playbackRates.map(rate => {
                return withDirectives(h(QItem, {
                  // attrs
                  key: rate.value,
                  // props
                  clickable: true,
                  dense: true,
                  // events
                  onClick: (e) => {
                    __stopAndPrevent(e)
                    __playbackRateChanged(rate.value)
                  }
                }, () => [
                  h(QItemSection, {
                    // props
                    avatar: true
                  }, () => [
                    rate.value === state.playbackRate && h(QIcon, {
                      // props
                      name: iconSet.mediaPlayer.selected
                    })
                  ]),
                  h(QItemSection, () => rate.label)
                ]), [[
                  ClosePopup
                ]])
              })
            ])
          ]),
          // first item is 'Off' and doesn't count unless more are added
          __selectTracksLanguageList.value.length > 1 && h(QExpansionItem, {
            // props
            group: 'settings-menu',
            expandSeparator: true,
            icon: iconSet.mediaPlayer.language,
            label: lang.mediaPlayer.language,
            caption: state.trackLanguage,
            // events
            onShow: __adjustMenu,
            onHide: __adjustMenu
          }, () => [
            h(QList, {
              // props
              highlight: true
            }, () => [
              __selectTracksLanguageList.value.map(language => {
                return withDirectives(h(QItem, {
                  // attrs
                  key: language.value,
                  // props
                  clickable: true,
                  dense: true,
                  // events
                  onClick: (e) => {
                    __stopAndPrevent(e)
                    __trackLanguageChanged(language.value)
                  }
                }, () => [
                  h(QItemSection, {
                    // props
                    avatar: true
                  }, () => [
                    language.value === state.trackLanguage
                    && h(QIcon, {
                      // props
                      name: iconSet.mediaPlayer.selected
                    })
                  ]),
                  h(QItemSection, () => language.label)
                ]), [[
                  ClosePopup
                ]])
              })
            ])
          ])
        ])
      ])
    }

    function __renderMediaPlayer () {
      const events = {
        onMousemove: __mouseMoveAction,
        onMouseleave: __mouseLeaveVideo,
        onClick: __videoClick
      }

      return h('div', {
        class: {
          'q-media--dark': props.dark === true,
          'q-media': true,
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
            props.showSpinner === true && state.loading && !state.playReady && !state.errorText && __renderLoader(),
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
      setVolume,
      $media
    })

    return () => __renderMediaPlayer()
  }
})
