import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
  withDirectives,
} from 'vue'
import type { PropType, Slot, SlotsType, VNode, VNodeArrayChildren } from 'vue'

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
  useQuasar,
} from 'quasar'

import defaultIconSet from '../../icon-set/material-icons.mjs'
import defaultLang from '../../lang/en-US.mjs'

type MediaPlayerType = 'video' | 'audio'
type CrossOrigin = 'anonymous' | 'use-credentials' | null
type ClassOrStyle = string | Record<string, unknown> | undefined

type MediaSource = {
  /**
   * Path to a media source.
   *
   * @example src="https://your-server/your-video.mov"
   * @example src="https://your-server/your-audio.mp3"
   */
  src?: string
  /**
   * MIME type for the media source.
   *
   * @example type="video/mp4"
   * @example type="audio/mp3"
   */
  type?: string
}

type MediaTrack = {
  /**
   * Text track kind.
   *
   * @example kind="subtitles"
   * @example kind="captions"
   */
  kind?: string
  /**
   * Label used for track selection.
   *
   * @example label="English"
   * @example label="Deutsch"
   */
  label?: string
  /**
   * Path to a subtitle, caption, chapter, or metadata file.
   *
   * @example src="https://your-server/path/to/subtitles-en.vtt"
   */
  src?: string
  /**
   * Track language identifier.
   *
   * @example srclang="en"
   * @example srclang="de"
   */
  srclang?: string
}

type PlaybackRateOption = {
  /**
   * Displayed label for the playback speed option.
   *
   * @example .5X
   * @example Normal
   */
  label: string
  /**
   * Playback speed multiplier.
   *
   * @example 0.5
   * @example 1
   */
  value: number
}

type SelectOption = {
  label: string
  value: string
}

type RenderChild = string | number | boolean | VNode | VNodeArrayChildren | (() => unknown)

type MediaPlayerMessages = {
  language: string
  mute: string
  noLoadAudio: string
  noLoadVideo: string
  oldBrowserAudio: string
  oldBrowserVideo: string
  pause: string
  play: string
  rate1Point5: string
  rate2: string
  rateNormal: string
  ratePoint5: string
  settings: string
  speed: string
  toggleFullscreen: string
  trackLanguageOff: string
  unmute: string
  waitingAudio: string
  waitingVideo: string
}

type MediaPlayerLang = {
  lang?: string
  mediaPlayer: MediaPlayerMessages
}

type MediaPlayerIcons = {
  bigPlayButton: string
  fullscreen: string
  fullscreenExit: string
  language: string
  pause: string
  play: string
  selected: string
  settings: string
  speed: string
  volumeDown: string
  volumeOff: string
  volumeUp: string
}

type MediaPlayerIconSet = {
  mediaPlayer: MediaPlayerIcons
}

type QMediaPlayerGlobal = {
  Component?: unknown
  lang?: Record<string, MediaPlayerLang>
  iconSet?: Record<string, MediaPlayerIconSet>
}

type QuasarLike = {
  dark: {
    isActive: boolean
  }
  fullscreen?: {
    isActive?: boolean
    request: (target?: Element | null) => void | Promise<void>
    exit: () => void | Promise<void>
  }
  iconSet?: {
    name?: string
    mediaPlayer?: Partial<MediaPlayerIcons>
  }
  lang?: {
    isoName?: string
  }
}

type MediaPlayerState = {
  errorText: string | null
  controls: boolean
  showControls: boolean
  inControls: boolean
  volume: number
  muted: boolean
  currentTime: number
  duration: number
  durationTime: string
  remainingTime: string
  displayTime: string
  inFullscreen: boolean
  loading: boolean
  playReady: boolean
  playing: boolean
  playbackRates: PlaybackRateOption[]
  playbackRate: number
  trackLanguage: string
  showBigPlayButton: boolean
  metadataLoaded: boolean
  spinnerSize: string
  bottomControls: boolean
  noControls: boolean
}

interface QMediaPlayerSlots {
  /**
   * Replace the default old browser fallback text.
   *
   * @applicable Audio | Video
   */
  oldbrowser: () => VNode[]
  /**
   * Render custom overlay content over the video frame.
   *
   * @applicable Video
   */
  overlay: () => VNode[]
  /**
   * Replace the default error window.
   *
   * @applicable Audio | Video
   */
  errorWindow: () => VNode[]
  /**
   * Replace the default controls.
   *
   * @applicable Audio | Video
   */
  controls: () => VNode[]
  /**
   * Replace the default spinner/loading icon.
   *
   * @applicable Audio | Video
   */
  spinner: () => VNode[]
  /**
   * Replace the default big play button.
   *
   * @applicable Video
   */
  bigPlayButton: () => VNode[]
  /**
   * Replace the default display time.
   *
   * @applicable Audio | Video
   */
  displayTime: () => VNode[]
  /**
   * Replace the default playback position slider.
   *
   * @applicable Audio | Video
   */
  positionSlider: () => VNode[]
  /**
   * Replace the default duration time.
   *
   * @applicable Audio | Video
   */
  durationTime: () => VNode[]
  /**
   * Replace the default play/pause control.
   *
   * @applicable Audio | Video
   */
  play: () => VNode[]
  /**
   * Replace the default volume button.
   *
   * @applicable Audio | Video
   */
  volume: () => VNode[]
  /**
   * Replace the default volume slider.
   *
   * @applicable Audio | Video
   */
  volumeSlider: () => VNode[]
  /**
   * Replace the default settings button.
   *
   * @applicable Video
   */
  settings: () => VNode[]
  /**
   * Replace the default settings menu content.
   *
   * @applicable Video
   */
  settingsMenu: () => VNode[]
  /**
   * Replace the default fullscreen button.
   *
   * @applicable Video
   */
  fullscreen: () => VNode[]
}

declare global {
  interface Window {
    QMediaPlayer?: QMediaPlayerGlobal
  }
}

const defaultMediaPlayerLang = defaultLang as MediaPlayerLang
const defaultMediaPlayerIconSet = defaultIconSet as MediaPlayerIconSet

const matClose =
  'M0 0h24v24H0z@@fill:none;&&M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'

const iconSetLoaders = {
  'bootstrap-icons': () => import('../../icon-set/bootstrap-icons.mjs'),
  'eva-icons': () => import('../../icon-set/eva-icons.mjs'),
  'fontawesome-v7': () => import('../../icon-set/fontawesome-v7.mjs'),
  'ionicons-v4': () => import('../../icon-set/ionicons-v4.mjs'),
  'ionicons-v8': () => import('../../icon-set/ionicons-v8.mjs'),
  'line-awesome': () => import('../../icon-set/line-awesome.mjs'),
  'material-icons': async () => ({ default: defaultIconSet }),
  'material-icons-outlined': () => import('../../icon-set/material-icons-outlined.mjs'),
  'material-icons-round': () => import('../../icon-set/material-icons-round.mjs'),
  'material-icons-sharp': () => import('../../icon-set/material-icons-sharp.mjs'),
  'material-symbols-outlined': () => import('../../icon-set/material-symbols-outlined.mjs'),
  'material-symbols-rounded': () => import('../../icon-set/material-symbols-rounded.mjs'),
  'material-symbols-sharp': () => import('../../icon-set/material-symbols-sharp.mjs'),
  'mdi-v7': () => import('../../icon-set/mdi-v7.mjs'),
  'svg-bootstrap-icons': () => import('../../icon-set/svg-bootstrap-icons.mjs'),
  'svg-eva-icons': () => import('../../icon-set/svg-eva-icons.mjs'),
  'svg-fontawesome-v7': () => import('../../icon-set/svg-fontawesome-v7.mjs'),
  'svg-ionicons-v4': () => import('../../icon-set/svg-ionicons-v4.mjs'),
  'svg-ionicons-v8': () => import('../../icon-set/svg-ionicons-v8.mjs'),
  'svg-line-awesome': () => import('../../icon-set/svg-line-awesome.mjs'),
  'svg-material-icons': () => import('../../icon-set/svg-material-icons.mjs'),
  'svg-material-icons-outlined': () => import('../../icon-set/svg-material-icons-outlined.mjs'),
  'svg-material-icons-round': () => import('../../icon-set/svg-material-icons-round.mjs'),
  'svg-material-icons-sharp': () => import('../../icon-set/svg-material-icons-sharp.mjs'),
  'svg-material-symbols-outlined': () => import('../../icon-set/svg-material-symbols-outlined.mjs'),
  'svg-material-symbols-rounded': () => import('../../icon-set/svg-material-symbols-rounded.mjs'),
  'svg-material-symbols-sharp': () => import('../../icon-set/svg-material-symbols-sharp.mjs'),
  'svg-mdi-v7': () => import('../../icon-set/svg-mdi-v7.mjs'),
  'svg-themify': () => import('../../icon-set/svg-themify.mjs'),
  themify: () => import('../../icon-set/themify.mjs'),
}

const langLoaders = {
  ar: () => import('../../lang/ar.mjs'),
  'az-Latn': () => import('../../lang/az-Latn.mjs'),
  bg: () => import('../../lang/bg.mjs'),
  bn: () => import('../../lang/bn.mjs'),
  ca: () => import('../../lang/ca.mjs'),
  cs: () => import('../../lang/cs.mjs'),
  da: () => import('../../lang/da.mjs'),
  de: () => import('../../lang/de.mjs'),
  el: () => import('../../lang/el.mjs'),
  'en-GB': () => import('../../lang/en-GB.mjs'),
  'en-US': async () => ({ default: defaultLang }),
  eo: () => import('../../lang/eo.mjs'),
  es: () => import('../../lang/es.mjs'),
  et: () => import('../../lang/et.mjs'),
  fa: () => import('../../lang/fa.mjs'),
  'fa-IR': () => import('../../lang/fa-IR.mjs'),
  fi: () => import('../../lang/fi.mjs'),
  fr: () => import('../../lang/fr.mjs'),
  gn: () => import('../../lang/gn.mjs'),
  he: () => import('../../lang/he.mjs'),
  hr: () => import('../../lang/hr.mjs'),
  hu: () => import('../../lang/hu.mjs'),
  id: () => import('../../lang/id.mjs'),
  is: () => import('../../lang/is.mjs'),
  it: () => import('../../lang/it.mjs'),
  ja: () => import('../../lang/ja.mjs'),
  km: () => import('../../lang/km.mjs'),
  'ko-KR': () => import('../../lang/ko-KR.mjs'),
  'kur-CKB': () => import('../../lang/kur-CKB.mjs'),
  lt: () => import('../../lang/lt.mjs'),
  lu: () => import('../../lang/lu.mjs'),
  lv: () => import('../../lang/lv.mjs'),
  ml: () => import('../../lang/ml.mjs'),
  ms: () => import('../../lang/ms.mjs'),
  'nb-NO': () => import('../../lang/nb-NO.mjs'),
  nl: () => import('../../lang/nl.mjs'),
  pl: () => import('../../lang/pl.mjs'),
  pt: () => import('../../lang/pt.mjs'),
  'pt-BR': () => import('../../lang/pt-BR.mjs'),
  ro: () => import('../../lang/ro.mjs'),
  ru: () => import('../../lang/ru.mjs'),
  sk: () => import('../../lang/sk.mjs'),
  sl: () => import('../../lang/sl.mjs'),
  sr: () => import('../../lang/sr.mjs'),
  'sr-CYR': () => import('../../lang/sr-CYR.mjs'),
  sv: () => import('../../lang/sv.mjs'),
  ta: () => import('../../lang/ta.mjs'),
  th: () => import('../../lang/th.mjs'),
  tr: () => import('../../lang/tr.mjs'),
  ug: () => import('../../lang/ug.mjs'),
  uk: () => import('../../lang/uk.mjs'),
  vi: () => import('../../lang/vi.mjs'),
  'zh-CN': () => import('../../lang/zh-CN.mjs'),
  'zh-TW': () => import('../../lang/zh-TW.mjs'),
}

function getLanguageCandidates(lang: string) {
  const candidates = [lang]
  const [baseLang] = lang.split('-')

  if (baseLang && baseLang !== lang) {
    candidates.push(baseLang)
  }

  if (!candidates.includes('en-US')) {
    candidates.push('en-US')
  }

  return candidates
}

function getLanguageGlobalName(lang: string) {
  return lang.replace(/-([A-Za-z])/g, (_, char: string) => char.toUpperCase())
}

function resolveLangLoaderName(lang: string): keyof typeof langLoaders {
  const candidates = getLanguageCandidates(lang)

  for (const candidate of candidates) {
    if (Object.prototype.hasOwnProperty.call(langLoaders, candidate)) {
      return candidate as keyof typeof langLoaders
    }
  }

  return 'en-US'
}

function hSlot(slot: Slot | undefined, otherwise: RenderChild): RenderChild {
  return slot !== void 0 ? slot() : otherwise
}

const padTime = (val: number) => {
  val = Math.floor(val)
  if (val < 10) {
    return '0' + val
  }
  return val + ''
}

const timeParse = (sec: number) => {
  let min = 0
  min = Math.floor(sec / 60)
  sec = sec - min * 60
  return padTime(min) + ':' + padTime(sec)
}

export default defineComponent({
  name: 'QMediaPlayer',

  directives: {
    ClosePopup,
    Ripple,
  },

  slots: Object as SlotsType<QMediaPlayerSlots>,

  props: {
    /**
     * Tells the component which player is to be used.
     *
     * @category behavior
     * @applicable Audio | Video
     * @values video | audio
     * @example type="video"
     * @example type="audio"
     */
    type: {
      type: String as PropType<MediaPlayerType>,
      required: false,
      default: 'video',
      validator: (v: string) => ['video', 'audio'].includes(v),
    },
    /**
     * Use mobile logic for handling visibility of controls. This mode is best for mobiles, but can be used on desktop as well. It prevents the controls from displaying/hiding with mouse hover. Instead, clicks are used to show/hide the controls.
     *
     * @category behavior
     * @applicable Video
     */
    mobileMode: Boolean,
    /**
     * When true, clicking or tapping the video frame toggles play/pause. Turn this off when the overlay slot contains interactive content, such as forms or buttons.
     *
     * @category behavior
     * @applicable Video
     * @example :toggle-play-on-click="false"
     */
    togglePlayOnClick: {
      type: Boolean,
      default: true,
    },
    /**
     * Direct media source URL. When this is set, the media element `src` is set directly and the `sources` prop is ignored.
     *
     * @category model
     * @applicable Audio | Video
     * @example source="https://path/to/the/video.mpeg"
     */
    source: String,
    /**
     * One or more sources for video or audio. The browser picks the best source based on supported codecs.
     *
     * @category model
     * @applicable Audio | Video
     * @tsType MediaSource[]
     * @example :sources="[{ src: 'https://your-server/your-video.mov', type: 'video/mp4' }]"
     * @example :sources="[{ src: 'https://your-server/your-audio.mp3', type: 'audio/mp3' }]"
     */
    sources: {
      type: Array as PropType<MediaSource[]>,
      default: () => [],
    },
    /**
     * Poster image to display before the video is loaded.
     *
     * @category model
     * @applicable Video
     * @example poster="https://path/to/the/image.jpg"
     */
    poster: {
      type: String,
      default: '',
    },
    /**
     * Fallback poster image to display when `poster` is not provided. The `poster` prop always takes precedence.
     *
     * @category model
     * @applicable Video
     * @example fallback-poster="https://path/to/the/fallback-image.jpg"
     */
    fallbackPoster: {
      type: String,
      default: '',
    },
    /**
     * One or more text tracks for subtitles, captions, chapters, or metadata.
     *
     * @category model
     * @applicable Video
     * @tsType MediaTrack[]
     * @example :tracks="[{ src: 'https://your-server/path/to/subtitles-en.vtt', kind: 'subtitles', srclang: 'en', label: 'English' }]"
     */
    tracks: {
      type: Array as PropType<MediaTrack[]>,
      default: () => [],
    },
    /**
     * Display controls in a compact single-line layout.
     *
     * @category style
     * @applicable Audio | Video
     */
    dense: Boolean,
    /**
     * Automatically start playback when the media is ready to play.
     *
     * @category behavior
     * @applicable Audio | Video
     */
    autoplay: Boolean,
    /**
     * Pause playback when the player scrolls completely out of the viewport. QMediaPlayer will not automatically resume playback when it becomes visible again.
     *
     * @category behavior
     * @applicable Audio | Video
     * @example auto-pause
     */
    autoPause: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to use CORS for fetching media assets.
     *
     * @category behavior
     * @applicable Audio | Video
     * @values null | anonymous | use-credentials
     * @example cross-origin="anonymous"
     */
    crossOrigin: {
      type: String as PropType<CrossOrigin>,
      default: null,
      validator: (v: string | null) => v === null || ['anonymous', 'use-credentials'].includes(v),
    },
    /**
     * Initial volume from 0-100, as a percentage.
     *
     * @category behavior
     * @applicable Audio | Video
     * @example :volume="50"
     * @example :volume="75"
     */
    volume: {
      type: Number,
      default: 60,
      validator: (v: number) => v >= 0 && v <= 100,
    },
    /**
     * Hide the volume slider control.
     *
     * @category behavior
     * @applicable Audio | Video
     */
    hideVolumeSlider: Boolean,
    /**
     * Hide the volume button and volume slider.
     *
     * @category behavior
     * @applicable Audio | Video
     * @since v1.1.0
     */
    hideVolumeBtn: Boolean,
    /**
     * Hide the play/pause button.
     *
     * @category behavior
     * @applicable Audio | Video
     * @since v1.0.21
     */
    hidePlayBtn: Boolean,
    /**
     * Hide the settings button.
     *
     * @category behavior
     * @applicable Audio | Video
     * @since v1.0.2
     */
    hideSettingsBtn: Boolean,
    /**
     * Hide the fullscreen button.
     *
     * @category behavior
     * @applicable Video
     * @since v1.2.0
     */
    hideFullscreenBtn: Boolean,
    /**
     * Disable the seek-to-position slider.
     *
     * @category behavior
     * @applicable Audio | Video
     * @since v1.1.0
     */
    disabledSeek: Boolean,
    /**
     * Provides a hint to the browser about what the author thinks will lead to the best user experience.
     *
     * @category state
     * @applicable Video
     * @values none | metadata | auto
     * @tsType 'none' | 'metadata' | 'auto'
     * @example preload="metadata"
     */
    preload: {
      type: String,
      default: 'metadata',
      validator: (v: string) => ['none', 'metadata', 'auto'].includes(v),
    },
    /**
     * Force the player to use an `<audio>` element when `type` is `audio`.
     *
     * @category behavior
     * @applicable Audio
     * @since v1.0.23
     */
    noVideo: Boolean,
    /**
     * Start the player muted.
     *
     * @category behavior
     * @applicable Audio | Video
     */
    muted: Boolean,
    /**
     * Render media inline where the platform supports the video element `playsinline` attribute.
     *
     * @category behavior
     * @applicable Audio | Video
     */
    playsinline: Boolean,
    /**
     * Automatically seek back to the start when playback reaches the end.
     *
     * @category behavior
     * @applicable Audio | Video
     */
    loop: Boolean,
    /**
     * Track `label` value to show by default.
     *
     * @category behavior
     * @applicable Video
     * @example track-language="English"
     */
    trackLanguage: {
      type: String,
      default: 'off', // value for 'Off'
    },
    /**
     * Show tooltips for built-in controls.
     *
     * @category state
     */
    showTooltips: Boolean,
    /**
     * Show the big play button over the video frame.
     *
     * @category behavior
     * @applicable Video
     */
    showBigPlayButton: {
      type: Boolean,
      default: true,
    },
    /**
     * Show the spinner while video or audio is loading.
     *
     * @category behavior
     * @applicable Audio | Video
     */
    showSpinner: {
      type: Boolean,
      default: true,
    },
    /**
     * CSS size for the spinner. Defaults to `3em` for video and `1.5em` for audio.
     *
     * @category state
     * @applicable Audio | Video
     * @example spinner-size="3em"
     * @example spinner-size="1.5em"
     */
    spinnerSize: String,
    /**
     * Never display QMediaPlayer controls.
     *
     * @category behavior
     * @applicable Video
     */
    noControls: Boolean,
    /**
     * Show the native browser media controls.
     *
     * @category behavior
     * @applicable Audio | Video
     * @since v1.2.0
     */
    nativeControls: Boolean,
    /**
     * Render controls below the video instead of covering the video.
     *
     * @category behavior
     * @applicable Video | Audio
     */
    bottomControls: {
      type: Boolean,
      default: false,
    },
    /**
     * Idle time in milliseconds before hiding the controls.
     *
     * @category behavior
     * @applicable Video
     * @example :controls-display-time="3000"
     */
    controlsDisplayTime: {
      type: Number,
      default: 4000,
    },
    /**
     * Playback speed options for the settings menu.
     *
     * @category behavior
     * @applicable Video
     * @tsType PlaybackRateOption[]
     * @default [ { label: '.5x', value: 0.5 }, { label: 'Normal', value: 1 }, { label: '1.5x', value: 1.5 }, { label: '2x', value: 2 } ]
     * @example :playback-rates="[{ label: '.5x', value: 0.5 }]"
     */
    playbackRates: Array as PropType<PlaybackRateOption[]>,
    /**
     * Initial playback rate. Corresponds to a `value` in `playback-rates`.
     *
     * @category behavior
     * @applicable Video
     * @example :playback-rate="2"
     */
    playbackRate: {
      type: Number,
      default: 1,
    },
    /**
     * Render the player on a dark background.
     *
     * @category style
     * @applicable Audio | Video
     */
    dark: Boolean,
    /**
     * Border radius applied to the media player.
     *
     * @category style
     * @applicable Audio | Video
     * @tsType number | string
     * @example radius="4px"
     * @example radius="6%"
     */
    radius: {
      type: [Number, String],
      default: 0,
    },
    /**
     * Style definitions applied directly to the media element.
     *
     * @category style
     * @applicable Audio | Video
     * @tsType ClassOrStyle
     * @example content-style="background-color: #ff0000"
     * @example :content-style="{ backgroundColor: '#ff0000' }"
     */
    contentStyle: [String, Object] as PropType<ClassOrStyle>,
    /**
     * Class definitions applied directly to the media element.
     *
     * @category style
     * @applicable Audio | Video
     * @tsType ClassOrStyle
     * @example content-class="my-special-class"
     * @example :content-class="{ 'my-special-class': condition }"
     */
    contentClass: [String, Object] as PropType<ClassOrStyle>,
    /**
     * Width attribute applied directly to the media element, in pixels.
     *
     * @category style
     * @applicable Audio | Video
     * @example :content-width="300"
     * @since v1.0.2
     */
    contentWidth: Number,
    /**
     * Height attribute applied directly to the media element, in pixels.
     *
     * @category style
     * @applicable Audio | Video
     * @example :content-height="300"
     * @since v1.0.2
     */
    contentHeight: Number,
  },

  emits: [
    /**
     * Emitted when the media element has been created.
     *
     * @applicable Audio | Video
     * @param mediaElement Media element instance.
     * @param-type mediaElement Object
     * @param-tsType mediaElement HTMLMediaElement | null
     */
    'mediaPlayer',
    /**
     * Emitted when the playback rate changes.
     *
     * @applicable Audio | Video
     * @param rate Playback rate value.
     * @param-type rate Number
     * @param-tsType rate number
     * @param-api-exemption rate examples
     */
    'playbackRate',
    /**
     * Emitted when the track language changes.
     *
     * @applicable Audio | Video
     * @param lang Track language value.
     * @param-type lang String
     * @param-tsType lang string
     * @param-api-exemption lang examples
     */
    'trackLanguage',
    /**
     * Emitted when QMediaPlayer controls are toggled.
     *
     * @applicable Video
     * @param showing Whether the controls are showing.
     * @param-type showing Boolean
     * @param-tsType showing boolean
     */
    'showControls',
    /**
     * Emitted when the volume changes.
     *
     * @applicable Audio | Video
     * @param volume Volume as a percent.
     * @param-type volume Number
     * @param-tsType volume number
     * @param-example volume 50 - 50%
     * @param-example volume 75 - 75%
     */
    'volume',
    /**
     * Emitted when mute changes.
     *
     * @applicable Audio | Video
     * @param muted Whether volume is muted.
     * @param-type muted Boolean
     * @param-tsType muted boolean
     */
    'muted',
    /**
     * Emitted when entering or exiting fullscreen mode.
     *
     * @applicable Video
     * @param showing Whether the player is in fullscreen mode.
     * @param-type showing Boolean
     * @param-tsType showing boolean
     */
    'fullscreen',
    /**
     * Emitted when a source element reports a network-state error.
     *
     * @applicable Audio | Video
     * @param event Native source error event.
     * @param-type event Object
     * @param-tsType event Event
     * @param-api-exemption event examples
     */
    'networkState',
    /**
     * Emitted when the resource was not fully loaded, but not as the result of an error.
     *
     * @applicable Audio | Video
     */
    'abort',
    /**
     * Emitted when the media is ready to play. Do not call play/pause or setCurrentTime before this event.
     *
     * @applicable Audio | Video
     */
    'ready',
    /**
     * Emitted when the user agent can play the media, but estimates that more buffering may be needed before playback can finish.
     *
     * @applicable Audio | Video
     */
    'canplay',
    /**
     * Emitted when the user agent estimates enough data has loaded to play through to the end without further buffering.
     *
     * @applicable Audio | Video
     * @since v1.0.18
     */
    'canplaythrough',
    /**
     * Emitted when the duration of the media has been determined.
     *
     * @applicable Audio | Video
     * @param seconds Duration in seconds.
     * @param-type seconds Number
     * @param-tsType seconds number
     * @param-example seconds 600 - 10 minutes of audio or video
     * @param-example seconds 1200 - 20 minutes of audio or video
     */
    'duration',
    /**
     * Emitted when the media has become empty, for example when `HTMLMediaElement.load()` reloads previously loaded media.
     *
     * @applicable Audio | Video
     * @since v1.0.18
     */
    'emptied',
    /**
     * Emitted when the media has finished playing.
     *
     * @applicable Audio | Video
     */
    'ended',
    /**
     * Emitted when there is a media error.
     *
     * @applicable Audio | Video
     * @param mediaError Media error details from the HTML media element.
     * @param-type mediaError Object
     * @param-tsType mediaError MediaError | null
     * @param-api-exemption mediaError examples
     */
    'error',
    /**
     * Emitted when the browser has loaded the current frame of media data.
     *
     * @applicable Audio | Video
     * @since v1.0.18
     */
    'loadeddata',
    /**
     * Emitted when the metadata has been loaded.
     *
     * @applicable Audio | Video
     * @since v1.0.18
     */
    'loadedmetadata',
    /**
     * Emitted when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming.
     *
     * @applicable Audio | Video
     * @since v1.0.18
     */
    'stalled',
    /**
     * Emitted when media data loading has been suspended.
     *
     * @applicable Audio | Video
     * @since v1.0.18
     */
    'suspend',
    /**
     * Emitted when the browser has started loading a resource.
     *
     * @applicable Audio | Video
     * @since v1.0.18
     */
    'loadstart',
    /**
     * Emitted when the media player is paused.
     *
     * @applicable Audio | Video
     */
    'paused',
    /**
     * Emitted when the paused property changes from true to false because of `HTMLMediaElement.play()` or autoplay.
     *
     * @applicable Audio | Video
     * @since v1.0.18
     */
    'play',
    /**
     * Emitted when media starts playing. This can also emit after a pause or wait.
     *
     * @applicable Audio | Video
     */
    'playing',
    /**
     * Emitted whenever playback time updates during play.
     *
     * @applicable Audio | Video
     * @param currentTime Current play time in seconds.
     * @param-type currentTime Number
     * @param-tsType currentTime number
     * @param-api-exemption currentTime examples
     * @param remainingTime Remaining play time formatted as `MM:SS`.
     * @param-type remainingTime String
     * @param-tsType remainingTime string
     * @param-api-exemption remainingTime examples
     */
    'timeupdate',
    /**
     * Emitted when playback stops because of a temporary lack of data.
     *
     * @applicable Audio | Video
     */
    'waiting',
  ],

  setup(props, { slots, emit, expose }) {
    const vm = getCurrentInstance()
    const vmContext = vm as ({ ctx?: { $q?: Partial<QuasarLike> } } & typeof vm) | null
    const instanceQuasar = (vm?.proxy?.$q || vmContext?.ctx?.$q) as Partial<QuasarLike> | undefined
    const quasar = (useQuasar() || instanceQuasar || {}) as Partial<QuasarLike>
    const $q = {
      dark: { isActive: false },
      iconSet: { name: 'material-icons' },
      lang: { isoName: 'en-US' },
      ...quasar,
    } as QuasarLike

    const canRender = ref(false),
      lang = reactive({
        mediaPlayer: { ...defaultMediaPlayerLang.mediaPlayer } as MediaPlayerMessages,
      }),
      iconSet = reactive({
        mediaPlayer: { ...defaultMediaPlayerIconSet.mediaPlayer } as MediaPlayerIcons,
      }),
      $root = ref<HTMLElement | null>(null), // $ref - the QMediaPlayer wrapper
      $media = ref<HTMLMediaElement | null>(null), // $ref - the actual video/audio player
      controls = ref<HTMLElement | null>(null), // $ref
      menu = ref<{ updatePosition: () => void } | null>(null), // $ref
      // media = ref(null), // $ref
      timer = reactive({
        // timer used to hide control during mouse inactivity
        hideControlsTimer: null as ReturnType<typeof setTimeout> | null,
      }),
      state = reactive<MediaPlayerState>({
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
          { label: '2x', value: 2 },
        ],
        playbackRate: 1,
        trackLanguage: 'Off',
        showBigPlayButton: true,
        metadataLoaded: false,
        spinnerSize: '5em',
        bottomControls: false,
        noControls: false,
      }),
      settingsMenuVisible = ref(false),
      autoPauseObserver = ref<IntersectionObserver | null>(null),
      blobObjectUrl = ref<string | null>(null),
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
        'loadstart',
        'pause',
        'play',
        'playing',
        'progress',
        'ratechange',
        'seeked',
        'timeupdate',
        'volumechange',
        'waiting',
      ]

    // Computed

    const __classes = computed(() => {
      return {
        'q-media__fullscreen': state.inFullscreen,
        'q-media__fullscreen--window': state.inFullscreen,
      }
    })

    const __renderVideoClasses = computed(() => {
      return {
        'q-media--player': true,
        'q-media--player--bottom-controls--standard':
          !props.dense && state.bottomControls && state.inFullscreen,
        'q-media--player--bottom-controls--dense':
          props.dense && state.bottomControls && state.inFullscreen,
      }
    })

    const __videoControlsClasses = computed(() => {
      return {
        'q-media__controls--dense':
          !slots.controls && (state.showControls || props.mobileMode) && props.dense,
        'q-media__controls--standard':
          !slots.controls && (state.showControls || props.mobileMode) && !props.dense,
        'q-media__controls--hidden': !state.showControls,
        'q-media__controls--bottom-controls': state.bottomControls,
      }
    })

    const __audioControlsClasses = computed(() => {
      return {
        'q-media__controls--dense': props.dense,
        'q-media__controls--standard': !props.dense,
        'q-media__controls--bottom-controls': state.bottomControls,
      }
    })

    const __contentStyle = computed(() => {
      const style: Record<string, unknown> = {}
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
      } else if (state.volume >= 70 && !state.muted) {
        return iconSet.mediaPlayer.volumeUp
      } else {
        return iconSet.mediaPlayer.volumeOff
      }
    })

    const __selectTracksLanguageList = computed(() => {
      const tracksList: SelectOption[] = []
      // provide option to turn subtitles/captions/chapters off
      const track: SelectOption = {
        label: lang.mediaPlayer.trackLanguageOff,
        value: 'off',
      }
      tracksList.push(track)
      for (const mediaTrack of props.tracks) {
        const track = {
          label: mediaTrack.label || '',
          value: mediaTrack.label || '',
        }
        tracksList.push(track)
      }
      return tracksList
    })

    const __trackLanguageCaption = computed(() => {
      return (
        __selectTracksLanguageList.value.find((language) => language.value === state.trackLanguage)
          ?.label || state.trackLanguage
      )
    })

    function __mediaElement() {
      const media = $media.value
      return media !== null && media.volume !== undefined ? media : null
    }

    const __isMediaAvailable = computed(() => __mediaElement() !== null)

    const __isAudio = computed(() => {
      return props.type === 'audio'
    })

    const __isVideo = computed(() => {
      return props.type === 'video'
    })

    const __poster = computed(() => {
      return props.poster || props.fallbackPoster || undefined
    })

    const __settingsPlaybackCaption = computed(() => {
      let caption = ''
      state.playbackRates.forEach((rate: PlaybackRateOption) => {
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

    watch(
      () => $media.value,
      () => {
        __init()
        emit('mediaPlayer', $media.value)
      },
    )

    watch(
      () => [props.poster, props.fallbackPoster],
      () => {
        __updatePoster()
      },
    )

    watch(
      () => props.sources,
      () => {
        __updateSources()
      },
      { deep: true },
    )

    watch(
      () => props.source,
      () => {
        __updateSources()
      },
    )

    watch(
      () => props.tracks,
      () => {
        __updateTracks()
      },
      { deep: true },
    )

    watch(
      () => props.volume,
      () => {
        __updateVolume()
      },
    )

    watch(
      () => props.muted,
      () => {
        __updateMuted()
      },
    )

    watch(
      () => props.trackLanguage,
      () => {
        __updateTrackLanguage()
      },
    )

    watch(
      () => props.showBigPlayButton,
      () => {
        __updateBigPlayButton()
      },
    )

    watch(
      () => props.playbackRates,
      () => {
        __updatePlaybackRates()
      },
    )

    watch(
      () => props.playbackRate,
      () => {
        __updatePlaybackRate()
      },
    )

    // watch(() => $route, val => {
    //   exitFullscreen()
    // })

    watch(
      () => $q.lang?.isoName,
      () => {
        __setupLang()
      },
    )

    watch(
      () => [$q.iconSet?.name, $q.iconSet?.mediaPlayer] as const,
      () => {
        __setupIcons()
      },
    )

    watch(
      () => $q.fullscreen?.isActive,
      (val: boolean | undefined) => {
        // user pressed F11/ESC to exit fullscreen
        if (!val && __isVideo.value && state.inFullscreen) {
          exitFullscreen()
        }
      },
    )

    watch(
      () => state.playbackRate,
      (val: number) => {
        const media = __mediaElement()
        if (val && media !== null) {
          media.playbackRate = val
          // eslint-disable-next-line vue/custom-event-name-casing
          emit('playbackRate', val)
        }
      },
    )

    watch(
      () => state.trackLanguage,
      (val: string) => {
        __toggleCaptions()
        // eslint-disable-next-line vue/custom-event-name-casing
        emit('trackLanguage', val)
      },
    )

    watch(
      () => state.showControls,
      (val: boolean) => {
        if (__isVideo.value && !state.noControls) {
          // eslint-disable-next-line vue/custom-event-name-casing
          emit('showControls', val)
        }
      },
    )

    watch(
      () => state.volume,
      (val: number) => {
        const media = __mediaElement()
        if (media !== null) {
          const volume = val / 100.0
          if (media.volume !== volume) {
            media.volume = volume
            emit('volume', val)
          }
        }
      },
    )

    watch(
      () => state.muted,
      (val: boolean) => {
        emit('muted', val)
      },
    )

    watch(
      () => state.currentTime,
      () => {
        const media = __mediaElement()
        if (media !== null && state.playReady) {
          if (isFinite(media.duration)) {
            state.remainingTime = timeParse(media.duration - media.currentTime)
          }
          state.displayTime = timeParse(media.currentTime)
        }
      },
    )

    watch(
      () => props.bottomControls,
      (val: boolean) => {
        state.bottomControls = val
        if (val) {
          state.showControls = true
        }
      },
    )

    watch(
      () => props.noControls,
      (val: boolean) => {
        state.noControls = val
        if (props.nativeControls === true) {
          state.noControls = true
        }
      },
    )

    watch(
      () => props.autoPause,
      () => {
        __updateAutoPauseObserver()
      },
    )

    // watch(() => state.inControls, (val) => {
    //   console.log('inControls:', val)
    // })

    onMounted(() => {
      canRender.value = typeof window !== 'undefined' // SSR
      if (canRender.value === true) {
        __setupLang()
        __setupIcons()
        nextTick(() => {
          __updateAutoPauseObserver()
        })
      }
    })

    onBeforeUnmount(() => {
      if (canRender.value === true) {
        __removeAutoPauseObserver()

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

    /**
     * Load audio or video using a Blob or File object.
     *
     * @param blob Blob or File object. The player creates and manages the object URL.
     * @param-tsType blob Blob | File
     * @param-api-exemption blob examples
     * @returns True if the media source was loaded, otherwise false.
     * @returns-type Boolean
     * @returns-tsType boolean
     * @returns-api-exemption examples
     */
    function loadBlob(blob: Blob): boolean {
      const media = __mediaElement()

      if (media === null) {
        return false
      }

      if (!(blob instanceof Blob)) {
        console.error('[QMediaPlayer]: loadBlob method requires a Blob or File')
        return false
      }

      __removeSources()

      const objectUrl = URL.createObjectURL(blob)
      blobObjectUrl.value = objectUrl
      media.src = objectUrl
      __reset()
      __addSourceEventListeners()
      media.load()
      nextTick(() => {
        __syncMediaReady()
      }).catch((e) => console.error(e))

      return true
    }

    /**
     * Load audio or video using a FileList. Only the first item in the list is used.
     *
     * @param fileList FileList received from an input with `type="file"`.
     * @param-tsType fileList FileList
     * @param-api-exemption fileList examples
     * @returns True if the media source was loaded, otherwise false.
     * @returns-type Boolean
     * @returns-tsType boolean
     * @returns-api-exemption examples
     */
    function loadFileBlob(fileList: FileList): boolean {
      if (fileList) {
        if (Object.prototype.toString.call(fileList) === '[object FileList]') {
          const file = fileList.item(0)

          return file !== null ? loadBlob(file) : false
        }

        console.error('[QMediaPlayer]: loadFileBlob method requires a FileList')
      }
      return false
    }

    /**
     * Show the controls. Has no effect if controls are already displayed.
     *
     * @applicable Video
     */
    function showControls(): void {
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
          } else {
            showControls()
          }
          // user configured display time (in ms)
        }, props.controlsDisplayTime)
      }
    }

    /**
     * Hide the controls. Has no effect if controls are already hidden.
     *
     * @applicable Video
     */
    function hideControls(): void {
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

    /**
     * Toggle the controls.
     *
     * @applicable Video
     */
    function toggleControls(): void {
      if (state.bottomControls) {
        return
      }

      if (state.showControls) {
        hideControls()
      } else {
        showControls()
      }
    }

    /**
     * Start playback if the media is ready. This should be called after the `ready` event and may still require a user gesture depending on browser policy.
     *
     * @applicable Audio | Video
     */
    function play(): void {
      const media = __mediaElement()

      if (media !== null && state.playReady === true) {
        media
          .play()
          .then(() => {
            state.showBigPlayButton = false
            state.playing = true
            __mouseLeaveVideo()
            return true
          })
          .catch(() => {})
      }
    }

    /**
     * Pause playback if the media is currently playing.
     *
     * @applicable Audio | Video
     */
    function pause(): void {
      const media = __mediaElement()

      if (media !== null && state.playReady === true) {
        if (state.playing) {
          media.pause()
          state.showBigPlayButton = true
          state.playing = false
        }
      }
    }

    function __updateAutoPauseObserver() {
      __removeAutoPauseObserver()

      if (
        props.autoPause !== true ||
        canRender.value !== true ||
        typeof IntersectionObserver === 'undefined' ||
        $root.value === null
      ) {
        return
      }

      autoPauseObserver.value = new IntersectionObserver((entries) => {
        const entry = entries[0]

        if (
          entry?.isIntersecting !== true &&
          state.playing === true &&
          state.inFullscreen !== true
        ) {
          pause()
        }
      })

      autoPauseObserver.value.observe($root.value)
    }

    function __removeAutoPauseObserver() {
      if (autoPauseObserver.value !== null) {
        autoPauseObserver.value.disconnect()
        autoPauseObserver.value = null
      }
    }

    /**
     * Mute the audio.
     *
     * @applicable Audio | Video
     */
    function mute(): void {
      state.muted = true
      const media = __mediaElement()
      if (media !== null) {
        media.muted = true
      }
    }

    /**
     * Unmute the audio.
     *
     * @applicable Audio | Video
     */
    function unmute(): void {
      state.muted = false
      const media = __mediaElement()
      if (media !== null) {
        media.muted = false
      }
    }

    /**
     * Toggle between play and pause states.
     *
     * @applicable Audio | Video
     * @param event Optional source event.
     * @param-required event false
     * @param-tsType event Event
     */
    function togglePlay(event?: Event): void {
      __stopAndPrevent(event)
      const media = __mediaElement()

      if (media !== null && state.playReady === true) {
        if (state.playing) {
          media.pause()
          state.showBigPlayButton = true
          state.playing = false
        } else {
          media
            .play()
            .then(() => {
              state.showBigPlayButton = false
              state.playing = true
              __mouseLeaveVideo()
              return true
            })
            .catch(() => {})
        }
      }
    }

    /**
     * Toggle between muted and unmuted states.
     *
     * @applicable Audio | Video
     * @param event Source event.
     * @param-tsType event Event
     */
    function toggleMuted(event: Event): void {
      __stopAndPrevent(event)
      state.muted = !state.muted
      const media = __mediaElement()
      if (media !== null) {
        media.muted = state.muted === true
      }
    }

    /**
     * Toggle fullscreen mode.
     *
     * @applicable Video
     * @param event Source event.
     * @param-tsType event Event
     */
    function toggleFullscreen(event: Event): void {
      if (__isVideo.value) {
        __stopAndPrevent(event)
        if (state.inFullscreen) {
          exitFullscreen()
        } else {
          setFullscreen()
        }
        emit('fullscreen', state.inFullscreen)
      }
    }

    /**
     * Enter fullscreen mode.
     *
     * @applicable Video
     */
    function setFullscreen(): void {
      const media = __mediaElement()

      if (props.hideFullscreenBtn === true || !__isVideo.value || state.inFullscreen) {
        return
      }
      if ($q.fullscreen !== void 0 && media !== null) {
        state.inFullscreen = true
        $q.fullscreen.request(media.parentElement) // NOTE error Not capable - on iPhone Safari
        document.body.classList.add('no-scroll')
        // nextTick(() => {
        //   forceUpdate()
        // })
      }
    }

    /**
     * Exit fullscreen mode.
     *
     * @applicable Video
     */
    function exitFullscreen(): void {
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

    /**
     * Return the current play time in seconds.
     *
     * @applicable Audio | Video
     * @returns `-1` if not ready, otherwise the current play time in seconds.
     * @returns-type Number
     * @returns-tsType number
     * @returns-api-exemption examples
     */
    function currentTime(): number {
      const media = __mediaElement()
      if (media !== null && state.playReady === true) {
        return media.currentTime
      }
      return -1
    }

    /**
     * Set the current play time.
     *
     * @applicable Audio | Video
     * @param seconds Time in seconds.
     * @param-type seconds Number
     * @param-tsType seconds number
     * @param-example seconds 30
     * @param-example seconds 280
     */
    function setCurrentTime(seconds: number): void {
      const media = __mediaElement()
      if (state.playReady) {
        if (
          media !== null &&
          isFinite(media.duration) &&
          seconds >= 0 &&
          seconds <= media.duration
        ) {
          state.currentTime = media.currentTime = seconds
        }
      }
    }

    /**
     * Set the volume as a percent from 0-100.
     *
     * @applicable Audio | Video
     * @param volume Volume in percent.
     * @param-type volume Number
     * @param-tsType volume number
     * @param-example volume 50
     * @param-example volume 75
     */
    function setVolume(volume: number): void {
      if (volume >= 0 && volume <= 100) {
        state.volume = volume
      }
    }

    // Private Methods

    function __reset() {
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

    function __toggleCaptions() {
      __showCaptions(state.trackLanguage)
    }

    function __showCaptions(lang: string) {
      const media = __mediaElement()

      if (media !== null && __isVideo.value) {
        for (const track of Array.from(media.textTracks as ArrayLike<TextTrack>)) {
          if (track.label === lang) {
            track.mode = 'showing'
            track.oncuechange = __cueChanged
          } else {
            track.mode = 'hidden'
            track.oncuechange = null
          }
        }
      }
    }

    function __stopAndPrevent(e?: Event) {
      if (e) {
        if (e.cancelable !== false) {
          e.preventDefault()
        }
        e.stopPropagation()
      }
    }

    async function __setupLang() {
      const isoName = $q.lang?.isoName || 'en-US'
      let language: Partial<MediaPlayerLang> | undefined
      try {
        language = await __loadLang(isoName)
      } catch {}

      if (language?.mediaPlayer !== void 0) {
        lang.mediaPlayer = { ...defaultMediaPlayerLang.mediaPlayer, ...language.mediaPlayer }
        __updatePlaybackRates()
        __updateTrackLanguage()
      }
    }

    async function __loadLang(lang: string): Promise<Partial<MediaPlayerLang>> {
      let langList: Partial<MediaPlayerLang> = {}
      if (lang) {
        const mediaPlayerGlobal = typeof window !== 'undefined' ? window.QMediaPlayer : undefined
        // detect if UMD version is installed
        if (mediaPlayerGlobal && mediaPlayerGlobal.Component) {
          const language = getLanguageCandidates(lang).find(
            (candidate) => mediaPlayerGlobal.lang?.[getLanguageGlobalName(candidate)] !== void 0,
          )

          if (language !== void 0) {
            langList = mediaPlayerGlobal.lang?.[getLanguageGlobalName(language)] ?? {}
          } else {
            /* eslint-disable-next-line no-console */
            console.error(`[QMediaPlayer]: No language loaded called '${lang}'`)
            /* eslint-disable-next-line no-console */
            console.error(
              '[QMediaPlayer]: Be sure to load the UMD version of the language in a script tag before using with UMD',
            )
          }
        } else {
          try {
            const langName = resolveLangLoaderName(lang)
            const loadLang = langLoaders[langName]

            if (langName === 'en-US' && lang !== 'en-US') {
              /* eslint-disable-next-line no-console */
              console.error(`[QMediaPlayer]: Cannot find language file called '${lang}'`)
            }

            const result = await loadLang()
            langList = result.default as MediaPlayerLang
          } catch {
            /* eslint-disable-next-line no-console */
            console.error(`[QMediaPlayer]: Cannot find language file called '${lang}'`)
          }
        }
      }
      return langList
    }

    async function __setupIcons() {
      const customMediaPlayerIcons = $q.iconSet?.mediaPlayer

      if (customMediaPlayerIcons !== void 0) {
        iconSet.mediaPlayer = {
          ...defaultMediaPlayerIconSet.mediaPlayer,
          ...customMediaPlayerIcons,
        }
        return
      }

      const iconSetName = $q.iconSet?.name || 'material-icons'
      let icnSet: Partial<MediaPlayerIconSet> | undefined
      try {
        icnSet = await __loadIconSet(iconSetName)
      } catch {}

      if (icnSet !== void 0 && icnSet.mediaPlayer !== void 0) {
        iconSet.mediaPlayer = { ...defaultMediaPlayerIconSet.mediaPlayer, ...icnSet.mediaPlayer }
      }
    }

    async function __loadIconSet(set: string): Promise<Partial<MediaPlayerIconSet>> {
      let iconsList: Partial<MediaPlayerIconSet> = {}
      if (set) {
        const mediaPlayerGlobal = typeof window !== 'undefined' ? window.QMediaPlayer : undefined
        // detect if UMD version is installed
        if (mediaPlayerGlobal && mediaPlayerGlobal.Component) {
          const name = set.replace(/-([a-z])/g, (_match, char: string) => char.toUpperCase())
          if (mediaPlayerGlobal.iconSet && mediaPlayerGlobal.iconSet[name]) {
            iconsList = mediaPlayerGlobal.iconSet[name]
          } else {
            /* eslint-disable-next-line no-console */
            console.error(`[QMediaPlayer]: No icon set loaded called '${set}'`)
            /* eslint-disable-next-line no-console */
            console.error(
              '[QMediaPlayer]:Be sure to load the UMD version of the icon set in a script tag before using with UMD',
            )
          }
        } else {
          const loadIconSet =
            iconSetLoaders[set as keyof typeof iconSetLoaders] || iconSetLoaders['material-icons']

          if (iconSetLoaders[set as keyof typeof iconSetLoaders] === void 0) {
            /* eslint-disable-next-line no-console */
            console.error(`[QMediaPlayer]: Cannot find icon set file called '${set}'`)
          }

          const result = await loadIconSet()
          iconsList = result.default as MediaPlayerIconSet
        }
      }
      return iconsList
    }

    function __init() {
      const media = __mediaElement()

      state.bottomControls = props.bottomControls
      state.noControls = props.noControls
      if (props.nativeControls === true) {
        state.noControls = true
      }
      // Attach media listeners before loading sources so cached/local assets
      // cannot race past readiness events.
      __addMediaEventListeners()
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
      if (props.crossOrigin && media !== null) {
        media.setAttribute('crossorigin', props.crossOrigin)
      }
      // make sure "controls" is turned off
      if (media !== null) {
        media.controls = false
      }
      __addSourceEventListeners()
      __toggleCaptions()
    }

    function __addMediaEventListeners() {
      const media = __mediaElement()
      if (media !== null) {
        allEvents.forEach((event) => {
          media.addEventListener(event, __mediaEventHandler)
        })
      }
    }

    function __removeMediaEventListeners() {
      const media = __mediaElement()
      if (media !== null) {
        allEvents.forEach((event) => {
          media.removeEventListener(event, __mediaEventHandler)
        })
      }
    }

    function __addSourceEventListeners() {
      const media = __mediaElement()
      if (media !== null) {
        const sources = media.querySelectorAll('source')
        for (const source of sources) {
          source.addEventListener('error', __sourceEventHandler)
        }
      }
    }

    function __removeSourceEventListeners() {
      const media = __mediaElement()
      if (media !== null) {
        const sources = media.querySelectorAll('source')
        for (const source of sources) {
          source.removeEventListener('error', __sourceEventHandler)
        }
      }
    }

    function __setMediaReady() {
      const media = __mediaElement()

      if (media === null) {
        return false
      }

      const wasReady = state.playReady
      state.playReady = true
      state.loading = false
      state.displayTime = timeParse(media.currentTime)

      if (isFinite(media.duration)) {
        state.duration = media.duration
        state.durationTime = timeParse(media.duration)
        state.remainingTime = timeParse(media.duration - media.currentTime)
      }

      showControls()
      return wasReady !== true
    }

    function __syncMediaReady() {
      const HAVE_METADATA = 1
      const media = __mediaElement()

      if (media !== null && (media.currentSrc || media.src) && media.readyState >= HAVE_METADATA) {
        __setMediaReady()
      }
    }

    function __hasMediaSource(media: HTMLMediaElement) {
      return (
        media.currentSrc.length > 0 ||
        (media.getAttribute('src') || '').length > 0 ||
        Array.from(media.querySelectorAll('source')).some(
          (source) => (source.getAttribute('src') || '').length > 0,
        )
      )
    }

    function __sourceEventHandler(event: Event) {
      const NETWORK_NO_SOURCE = 3
      const media = __mediaElement()
      if (media !== null && __hasMediaSource(media) !== true) {
        state.errorText = null
        state.loading = false
        return
      }
      if (media !== null && media.networkState === NETWORK_NO_SOURCE) {
        state.errorText = __isVideo.value
          ? lang.mediaPlayer.noLoadVideo
          : lang.mediaPlayer.noLoadAudio
        state.loading = false
      }
      // eslint-disable-next-line vue/custom-event-name-casing
      emit('networkState', event)
    }

    function __mediaEventHandler(event: Event) {
      const media = __mediaElement()
      if (media === null) {
        return
      }

      if (event.type === 'abort') {
        emit('abort')
      } else if (event.type === 'canplay') {
        const becameReady = __setMediaReady()
        emit('canplay')
        if (becameReady) {
          emit('ready')
        }
      } else if (event.type === 'canplaythrough') {
        // console.log('canplaythrough')
        emit('canplaythrough')
      } else if (event.type === 'durationchange') {
        if (isFinite(media.duration)) {
          state.duration = media.duration
          state.durationTime = timeParse(media.duration)
          emit('duration', media.duration)
        }
      } else if (event.type === 'emptied') {
        emit('emptied')
      } else if (event.type === 'ended') {
        state.playing = false
        emit('ended')
      } else if (event.type === 'error') {
        if (__hasMediaSource(media) !== true) {
          state.errorText = null
          state.playing = false
          state.loading = false
          return
        }

        const error = media.error
        state.errorText = error && error.message ? error.message : null
        state.playing = false
        state.loading = false
        emit('error', error)
      } else if (event.type === 'interruptbegin') {
        // console.log('interruptbegin')
      } else if (event.type === 'interruptend') {
        // console.log('interruptend')
      } else if (event.type === 'loadeddata') {
        state.loading = false
        emit('loadeddata')
      } else if (event.type === 'loadedmetadata') {
        // tracks can only be programatically added after 'loadedmetadata' event
        state.metadataLoaded = true
        __updateTracks()
        // set default track language
        __updateTrackLanguage()
        __toggleCaptions()
        const becameReady = __setMediaReady()
        emit('loadedmetadata')
        if (becameReady) {
          emit('ready')
        }
      } else if (event.type === 'stalled') {
        emit('stalled')
      } else if (event.type === 'suspend') {
        emit('suspend')
      } else if (event.type === 'loadstart') {
        emit('loadstart')
      } else if (event.type === 'pause') {
        state.playing = false
        emit('paused')
      } else if (event.type === 'play') {
        emit('play')
      } else if (event.type === 'playing') {
        state.playing = true
        emit('playing')
      } else if (event.type === 'progress') {
        //
      } else if (event.type === 'ratechange') {
        //
      } else if (event.type === 'seeked') {
        //
      } else if (event.type === 'timeupdate') {
        state.currentTime = media.currentTime
        emit('timeupdate', media.currentTime, state.remainingTime)
      } else if (event.type === 'volumechange') {
        //
      } else if (event.type === 'waiting') {
        emit('waiting')
      }
    }

    function __mergeClassOrStyle(type: 'class' | 'style', val: ClassOrStyle) {
      const child: Record<string, unknown> = {}
      if (val !== undefined) {
        if (typeof val === 'string') {
          if (type === 'style') {
            const parts = val.replace(/\s+/g, '').split(';')
            parts.forEach((part) => {
              if (part !== '') {
                const [property, value] = part.split(':')

                if (property !== undefined && value !== undefined) {
                  child[property] = value
                }
              }
            })
          } else if (type === 'class') {
            const parts = val.split(' ')
            parts.forEach((part) => {
              if (part.replace(/\s+/g, '') !== '') {
                child[part] = true
              }
            })
          }
        } else {
          Object.assign(child, val)
        }
      }
      return child
    }

    // for future functionality
    function __cueChanged(_data: Event) {}

    function __checkCursor() {
      const media = __mediaElement()
      if (media !== null) {
        if (state.inFullscreen && state.playing && !state.showControls) {
          media.classList.remove('cursor-inherit')
          media.classList.add('cursor-none')
        } else {
          media.classList.remove('cursor-none')
          media.classList.add('cursor-inherit')
        }
      }
    }

    function __adjustMenu() {
      const qmenu = menu.value
      if (qmenu) {
        setTimeout(() => {
          qmenu.updatePosition()
        }, 350)
      }
    }

    function __videoClick(e: Event) {
      if (props.togglePlayOnClick !== true) {
        return
      }

      __stopAndPrevent(e)
      if (props.mobileMode !== true) {
        togglePlay()
      }
    }

    function __bigButtonClick(e: Event) {
      __stopAndPrevent(e)
      if (props.mobileMode) {
        hideControls()
      }
      togglePlay()
    }

    function __settingsMenuShowing(val: boolean) {
      settingsMenuVisible.value = val
    }

    function __mouseLeaveVideo(e?: MouseEvent) {
      const relatedTarget = e?.relatedTarget
      if (relatedTarget instanceof HTMLElement && relatedTarget.className === 'q-pa-md') {
        if (
          !props.bottomControls &&
          !props.mobileMode &&
          !__isAudio.value &&
          state.inControls !== true
        ) {
          hideControls()
        }
      }
    }

    function __mouseMoveAction(e: MouseEvent) {
      if (!props.bottomControls && !props.mobileMode && !__isAudio.value) {
        __showControlsIfValid(e)
      }
    }

    function __getParentEl(el: HTMLElement | null, className: string): HTMLElement | null {
      if (!el) return null
      if (String(el.className).startsWith(className)) {
        return el
      }
      return __getParentEl(el.offsetParent as HTMLElement | null, className)
    }

    function __showControlsIfValid(e: MouseEvent) {
      const media = __mediaElement()
      if (media === null || !(e.target instanceof HTMLElement)) return false

      const pos = media.getBoundingClientRect()
      const el = __getParentEl(e.target, 'q-media')
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (!pos || !rect) return false
      if (
        rect.left === pos.left &&
        rect.top === pos.top &&
        rect.height === pos.height &&
        rect.width === pos.width
      ) {
        showControls()
        return true
      }

      return false
    }

    function __videoCurrentTimeChanged(val: number) {
      showControls()
      const media = __mediaElement()
      if (media !== null && media.duration && val && val > 0 && val <= state.duration) {
        if (media.currentTime !== val) {
          state.currentTime = media.currentTime = val
        }
      }
    }

    function __volumePercentChanged(val: number) {
      showControls()
      state.volume = val
    }

    function __trackLanguageChanged(language: string) {
      if (state.trackLanguage !== language) {
        state.trackLanguage = language
      }
    }

    function __playbackRateChanged(rate: number) {
      if (state.playbackRate !== rate) {
        state.playbackRate = rate
      }
    }

    function __showingMenu() {
      return settingsMenuVisible.value
    }

    function __updateBigPlayButton() {
      if (state.showBigPlayButton !== props.showBigPlayButton) {
        state.showBigPlayButton = props.showBigPlayButton
      }
    }

    function __updateVolume() {
      if (state.volume !== props.volume) {
        state.volume = props.volume
      }
    }

    function __updateMuted() {
      if (state.muted !== props.muted) {
        state.muted = props.muted
        const media = __mediaElement()
        if (media !== null) {
          media.muted = state.muted
        }
      }
    }

    function __updateTrackLanguage() {
      if (state.trackLanguage !== props.trackLanguage || lang.mediaPlayer.trackLanguageOff) {
        state.trackLanguage = props.trackLanguage || lang.mediaPlayer.trackLanguageOff
      }
    }

    function __updatePlaybackRates() {
      if (props.playbackRates && props.playbackRates.length > 0) {
        state.playbackRates = [...props.playbackRates]
      } else {
        state.playbackRates.splice(0, state.playbackRates.length)
        state.playbackRates.push({ label: lang.mediaPlayer.ratePoint5, value: 0.5 })
        state.playbackRates.push({ label: lang.mediaPlayer.rateNormal, value: 1 })
        state.playbackRates.push({ label: lang.mediaPlayer.rate1Point5, value: 1.5 })
        state.playbackRates.push({ label: lang.mediaPlayer.rate2, value: 2 })
      }
    }

    function __updatePlaybackRate() {
      if (state.playbackRate !== props.playbackRate) {
        state.playbackRate = props.playbackRate
      }
    }

    function __updateSources() {
      __removeSources()
      __addSources()
    }

    function __removeSources() {
      const media = __mediaElement()
      if (media !== null) {
        __removeSourceEventListeners()
        // player must not be running
        media.pause()
        __revokeBlobObjectUrl()
        media.removeAttribute('src')
        if (media.currentTime) {
          // otherwise IE11 has exception error
          media.currentTime = 0
        }
        const childNodes = media.childNodes
        for (let index = childNodes.length - 1; index >= 0; --index) {
          const node = childNodes[index]

          if (node instanceof HTMLSourceElement) {
            media.removeChild(node)
          }
        }
      }
    }

    function __revokeBlobObjectUrl() {
      if (blobObjectUrl.value !== null) {
        URL.revokeObjectURL(blobObjectUrl.value)
        blobObjectUrl.value = null
      }
    }

    function __addSources() {
      const media = __mediaElement()
      if (media !== null) {
        let loaded = false
        if (props.source && props.source.length > 0) {
          media.src = props.source
          loaded = true
        } else {
          if (props.sources.length > 0) {
            props.sources.forEach((source) => {
              const s = document.createElement('source')
              s.src = source.src ? source.src : ''
              s.type = source.type ? source.type : ''
              media.appendChild(s)
              if (!loaded && source.src) {
                media.src = source.src
                loaded = true
              }
            })
          }
        }
        __reset()
        if (loaded !== true) {
          state.loading = false
          return
        }
        __addSourceEventListeners()
        media.load()
        nextTick(() => {
          __syncMediaReady()
        }).catch((e) => console.error(e))
      }
    }

    function __updateTracks() {
      __removeTracks()
      __addTracks()
    }

    function __removeTracks() {
      const media = __mediaElement()
      if (media !== null) {
        const childNodes = media.childNodes
        for (let index = childNodes.length - 1; index >= 0; --index) {
          const node = childNodes[index]

          if (node instanceof HTMLTrackElement) {
            media.removeChild(node)
          }
        }
      }
    }

    function __addTracks() {
      // only add tracks to video
      const media = __mediaElement()
      if (__isVideo.value && media !== null) {
        props.tracks.forEach((track) => {
          const t = document.createElement('track')
          t.kind = track.kind ? track.kind : ''
          t.label = track.label ? track.label : ''
          t.src = track.src ? track.src : ''
          t.srclang = track.srclang ? track.srclang : ''
          media.appendChild(t)
        })
        nextTick(() => {
          __toggleCaptions()
        })
      }
    }

    function __updatePoster() {
      const media = __mediaElement()
      if (media instanceof HTMLVideoElement) {
        media.poster = __poster.value || ''
      }
    }

    function __mouseEnterControls() {
      state.inControls = true
    }
    function __mouseLeaveControls() {
      state.inControls = false
    }

    // Rendering Methods

    function __renderVideo() {
      const slot = slots.oldbrowser

      const attrs = {
        poster: __poster.value,
        preload: props.preload,
        playsinline: props.playsinline === true,
        loop: props.loop === true,
        autoplay: props.autoplay === true,
        muted: props.muted === true,
        width: props.contentWidth || undefined,
        height: props.contentHeight || undefined,
      }

      nextTick(() => {
        const media = __mediaElement()
        if (media !== null && props.nativeControls === true) {
          media.controls = true
        }
      }).catch((e) => console.error(e))

      return h(
        'video',
        {
          ref: $media,
          class: {
            ...__renderVideoClasses.value,
            ...__mergeClassOrStyle('class', props.contentClass),
          },
          style: {
            ...__contentStyle.value,
          },
          ...attrs,
        },
        hSlot(slot, h('p', lang.mediaPlayer.oldBrowserVideo)),
      )
    }

    function __renderAudio() {
      const slot = slots.oldbrowser
      const mediaTag = props.noVideo === true ? 'audio' : 'video'

      const attrs = {
        ...(mediaTag === 'video' ? { poster: __poster.value } : {}),
        preload: props.preload,
        playsinline: props.playsinline === true,
        loop: props.loop === true,
        autoplay: props.autoplay === true,
        muted: props.muted === true,
        width: props.contentWidth || undefined,
        height: props.contentHeight || undefined,
      }

      nextTick(() => {
        const media = __mediaElement()
        if (media !== null && props.nativeControls === true) {
          media.controls = true
        }
      }).catch((e) => console.error(e))

      // This is on purpose (not using audio tag).
      // The video tag can also play audio and works better if dynamically
      // switching between video and audio on the same component.
      // That being said, if audio is truly needed, use the 'no-video'
      // property to force the <audio> tag.

      return h(
        mediaTag,
        {
          ref: $media,
          class: {
            'q-media--player': true,
            ...__mergeClassOrStyle('class', props.contentClass),
          },
          style: props.contentStyle,
          ...attrs,
        },
        hSlot(slot, h('p', lang.mediaPlayer.oldBrowserAudio)),
      )
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

    function __renderOverlayWindow() {
      if (slots.overlay) {
        return h(
          'div',
          {
            class: 'q-media__overlay-window fit',
          },
          slots.overlay(),
        )
      }
    }

    function errorWindowCloseButton() {
      return h(QBtn, {
        class: 'q-media__error-window--button',
        onClick: () => {
          state.errorText = null
        },
        icon: matClose,
        'aria-label': 'Close error message',
        flat: true,
        size: 'sm',
      })
    }

    function __renderErrorWindow() {
      const slot = slots.errorWindow

      return h(
        'div',
        {
          class: 'q-media__error-window',
        },
        hSlot(slot, h('span', [state.errorText, errorWindowCloseButton()])),
      )
    }

    function __renderPlayButton() {
      if (props.hidePlayBtn === true) return

      const slot = slots.play

      const properties = {
        icon: state.playing ? iconSet.mediaPlayer.pause : iconSet.mediaPlayer.play,
        'aria-label': state.playing ? lang.mediaPlayer.pause : lang.mediaPlayer.play,
        size: '1rem',
        disable: !state.playReady,
        flat: true,
        padding: '4px',
      }

      const events = {
        onClick: togglePlay,
      }

      return (
        (slot && slot()) ||
        h(
          QBtn,
          {
            class: 'q-media__controls--button play-button',
            ...properties,
            ...events,
          },
          () => [
            props.showTooltips && state.playing && h(QTooltip, () => lang.mediaPlayer.pause),
            props.showTooltips &&
              !state.playing &&
              state.playReady &&
              h(QTooltip, () => lang.mediaPlayer.play),
          ],
        )
      )
    }

    function __renderVideoControls() {
      const slot = slots.controls

      const events = {
        onClick: __stopAndPrevent,
        onMouseenter: __mouseEnterControls,
        onMouseleave: __mouseLeaveControls,
      }

      if (slot) {
        // we need to know the controls height for fullscreen, stop propagation to video component
        return h(
          'div',
          {
            ref: controls,
            class: {
              'q-media__controls': true,
              'q-media__controls--overlay':
                __isVideo.value === true && state.bottomControls !== true,
              ...__videoControlsClasses.value,
            },
            ...events,
          },
          slot(),
        )
      }

      return h(
        'div',
        {
          ref: controls,
          class: {
            'q-media__controls': true,
            'q-media__controls--overlay': __isVideo.value === true && state.bottomControls !== true,
            ...__videoControlsClasses.value,
          },
          ...events,
        },
        [
          // dense
          props.dense &&
            h(
              'div',
              {
                class: 'q-media__controls--row row col content-start items-center',
              },
              [
                h('div', [
                  __renderPlayButton(),
                  props.showTooltips &&
                    !state.playReady &&
                    h(QTooltip, () => lang.mediaPlayer.waitingVideo),
                ]),
                __renderVolumeButton(),
                __renderVolumeSlider(),
                __renderDisplayTime(),
                __renderCurrentTimeSlider(),
                __renderDurationTime(),
                __renderSettingsButton(),
                $q.fullscreen !== void 0 &&
                  props.hideFullscreenBtn !== true &&
                  __renderFullscreenButton(),
              ],
            ),
          // sparse
          !props.dense &&
            h(
              'div',
              {
                class: 'q-media__controls--row row col items-center justify-between',
              },
              [__renderDisplayTime(), __renderCurrentTimeSlider(), __renderDurationTime()],
            ),
          !props.dense &&
            h(
              'div',
              {
                class: 'q-media__controls--row row col content-start items-center',
              },
              [
                h(
                  'div',
                  {
                    class: 'row col',
                  },
                  [
                    h('div', [
                      __renderPlayButton(),
                      props.showTooltips &&
                        !state.playReady &&
                        h(QTooltip, () => lang.mediaPlayer.waitingVideo),
                    ]),
                    __renderVolumeButton(),
                    __renderVolumeSlider(),
                  ],
                ),
                h('div', [
                  __renderSettingsButton(),
                  $q.fullscreen !== void 0 &&
                    props.hideFullscreenBtn !== true &&
                    __renderFullscreenButton(),
                ]),
              ],
            ),
        ],
      )
    }

    function __renderAudioControls() {
      const slot = slots.controls

      return (
        (slot && slot()) ||
        h(
          'div',
          {
            ref: controls,
            class: {
              'q-media__controls': true,
              ...__audioControlsClasses.value,
            },
          },
          [
            props.dense &&
              h(
                'div',
                {
                  class: 'q-media__controls--row row col content-start items-center',
                },
                [
                  // dense
                  h('div', [
                    __renderPlayButton(),
                    props.showTooltips &&
                      !state.playReady &&
                      h(QTooltip, () => lang.mediaPlayer.waitingAudio),
                  ]),
                  __renderVolumeButton(),
                  __renderVolumeSlider(),
                  __renderDisplayTime(),
                  __renderCurrentTimeSlider(),
                  __renderDurationTime(),
                ],
              ),
            // sparse
            !props.dense &&
              h(
                'div',
                {
                  class: 'q-media__controls--row row col items-center justify-between',
                },
                [__renderDisplayTime(), __renderCurrentTimeSlider(), __renderDurationTime()],
              ),
            !props.dense &&
              h(
                'div',
                {
                  class: 'q-media__controls--row row col content-start items-center',
                },
                [
                  h('div', [
                    __renderPlayButton(),
                    props.showTooltips &&
                      !state.playReady &&
                      h(QTooltip, () => lang.mediaPlayer.waitingAudio),
                  ]),
                  __renderVolumeButton(),
                  __renderVolumeSlider(),
                ],
              ),
          ],
        )
      )
    }

    function __renderVolumeButton() {
      if (props.hideVolumeBtn === true) {
        return
      }
      const slot = slots.volume

      const properties = {
        icon: __volumeIcon.value,
        'aria-label': state.muted === true ? lang.mediaPlayer.unmute : lang.mediaPlayer.mute,
        size: '1rem',
        disable: !state.playReady,
        flat: true,
        padding: '4px',
      }

      const events = {
        onClick: toggleMuted,
      }

      return (
        (slot && slot()) ||
        h(
          QBtn,
          {
            class: 'q-media__controls--button volume-button',
            style: {
              color:
                props.dark === true || $q.dark.isActive
                  ? 'var(--mediaplayer-color-dark)'
                  : 'var(--mediaplayer-color)',
            },
            ...properties,
            ...events,
          },
          () => [
            props.showTooltips === true
              ? state.muted === true
                ? h(QTooltip, () => lang.mediaPlayer.unmute)
                : h(QTooltip, () => lang.mediaPlayer.mute)
              : undefined,
          ],
        )
      )
    }

    function __renderVolumeSlider() {
      if (props.hideVolumeSlider === true || props.hideVolumeBtn === true) {
        return
      }
      const slot = slots.volumeSlider

      const properties = {
        modelValue: state.volume,
        dark: props.dark,
        min: 0,
        max: 100,
        disable: !state.playReady || state.muted,
      }

      const events = {
        onChange: __volumePercentChanged,
      }

      return (
        (slot && slot()) ||
        h(QSlider, {
          class: 'col',
          'aria-label': 'Volume',
          style: {
            width: '20%',
            margin: '0 0.5rem',
            minWidth: props.dense ? '20px' : '50px',
            maxWidth: props.dense ? '50px' : '200px',
            color:
              props.dark === true || $q.dark.isActive
                ? 'var(--mediaplayer-color-dark)'
                : 'var(--mediaplayer-color)',
          },
          ...properties,
          ...events,
        })
      )
    }

    function __renderSettingsButton() {
      if (props.hideSettingsBtn === true) {
        return
      }

      const slot = slots.settings

      const properties = {
        icon: iconSet.mediaPlayer.settings,
        'aria-label': lang.mediaPlayer.settings,
        size: '1rem',
        disable: !state.playReady,
        flat: true,
        padding: '4px',
      }

      return (
        (slot && slot()) ||
        h(
          QBtn,
          {
            class: 'q-media__controls--button settings-button',
            ...properties,
          },
          () => [
            props.showTooltips === true && !settingsMenuVisible.value
              ? h(QTooltip, () => lang.mediaPlayer.settings)
              : undefined,
            __renderSettingsMenu(),
          ],
        )
      )
    }

    function __renderFullscreenButton() {
      const slot = slots.fullscreen

      const properties = {
        icon: state.inFullscreen
          ? iconSet.mediaPlayer.fullscreenExit
          : iconSet.mediaPlayer.fullscreen,
        'aria-label': lang.mediaPlayer.toggleFullscreen,
        size: '1rem',
        disable: !state.playReady,
        flat: true,
        padding: '4px',
      }

      const events = {
        onClick: toggleFullscreen,
      }

      return (
        (slot && slot()) ||
        h(
          QBtn,
          {
            class: 'q-media__controls--button fullscreen-button',
            ...properties,
            ...events,
          },
          () => [
            props.showTooltips === true
              ? h(QTooltip, () => lang.mediaPlayer.toggleFullscreen)
              : undefined,
          ],
        )
      )
    }

    function __renderLoader() {
      if (props.spinnerSize === void 0) {
        if (__isVideo.value) state.spinnerSize = '3em'
        else state.spinnerSize = '1.5em'
      } else {
        state.spinnerSize = props.spinnerSize
      }

      const slot = slots.spinner

      return (
        (slot && slot()) ||
        h(
          'div',
          {
            class: __isVideo.value ? 'q-media__loading--video' : 'q-media__loading--audio',
          },
          [
            h(QSpinner, {
              size: state.spinnerSize,
            }),
          ],
        )
      )
    }

    function __renderBigPlayButton() {
      const slot = slots.bigPlayButton

      const events = {
        onClick: __bigButtonClick,
      }

      return (
        (slot && slot()) ||
        h(
          'div',
          {
            class: {
              'q-media--big-button q-media--big-button-bottom-controls':
                state.bottomControls === true,
              'q-media--big-button': state.bottomControls !== true,
            },
          },
          [
            h(QIcon, {
              name: iconSet.mediaPlayer.bigPlayButton,
              class: 'q-media--big-button-icon',
              ...events,
            }),
          ],
        )
      )
    }

    function __renderCurrentTimeSlider() {
      const slot = slots.positionSlider

      const properties = {
        modelValue: state.currentTime,
        dark: props.dark,
        min: 0,
        max: state.duration ? state.duration : 1,
        disable: !state.playReady || props.disabledSeek,
      }

      const events = {
        onChange: __videoCurrentTimeChanged,
      }

      return (
        (slot && slot()) ||
        h(QSlider, {
          class: 'col',
          'aria-label': 'Playback position',
          style: {
            margin: '0 0.5rem',
            color:
              props.dark === true || $q.dark.isActive
                ? 'var(--mediaplayer-color-dark)'
                : 'var(--mediaplayer-color)',
          },
          ...properties,
          ...events,
        })
      )
    }

    function __renderDisplayTime() {
      const slot = slots.displayTime

      return (
        (slot && slot()) ||
        h(
          'span',
          {
            class: 'q-media__controls--video-time-text text-left',
            style: {
              color:
                props.dark === true || $q.dark.isActive
                  ? 'var(--mediaplayer-color-dark)'
                  : 'var(--mediaplayer-color)',
            },
          },
          state.displayTime,
        )
      )
    }

    function __renderDurationTime() {
      const media = __mediaElement()
      if (media === null) return

      const slot = slots.durationTime
      const isInfinity = !isFinite(media.duration)

      return (
        (slot && slot()) ||
        h(
          'span',
          {
            class: 'q-media__controls--video-time-text text-right',
            style: {
              width: isInfinity ? '30px' : 'auto',
              color:
                props.dark === true || $q.dark.isActive
                  ? 'var(--mediaplayer-color-dark)'
                  : 'var(--mediaplayer-color)',
            },
          },
          [
            __isMediaAvailable.value === true && isInfinity !== true && state.durationTime,
            __isMediaAvailable.value === true && isInfinity === true && __renderInfinitySvg(),
          ],
        )
      )
    }

    function __renderInfinitySvg() {
      return h(
        'svg',
        {
          height: '16',
          viewbox: '0 0 16 16',
        },
        [
          h('path', {
            fill: 'none',
            color:
              props.dark === true || $q.dark.isActive
                ? 'var(--mediaplayer-color-dark)'
                : 'var(--mediaplayer-color)',
            strokeWidth: '2',
            d: 'M8,8 C16,0 16,16 8,8 C0,0 0,16 8,8z',
          }),
        ],
      )
    }

    function __renderSettingsMenu() {
      const slot = slots.settingsMenu

      const properties = {
        anchor: 'top right',
        self: 'bottom right',
      }

      const events = {
        onShow: () => {
          __settingsMenuShowing(true)
        },
        onHide: () => {
          __settingsMenuShowing(false)
        },
      }

      return h(
        QMenu,
        {
          ref: menu,
          ...properties,
          ...events,
        },
        () => [
          (slot && slot()) ||
            h('div', [
              state.playbackRates.length > 0 &&
                h(
                  QExpansionItem,
                  {
                    // props
                    group: 'settings-menu',
                    expandSeparator: true,
                    icon: iconSet.mediaPlayer.speed,
                    label: lang.mediaPlayer.speed,
                    caption: __settingsPlaybackCaption.value,
                    // events
                    onShow: __adjustMenu,
                    onHide: __adjustMenu,
                  },
                  () => [
                    h(
                      QList,
                      {
                        // props
                        highlight: true,
                      },
                      () => [
                        state.playbackRates.map((rate) => {
                          return withDirectives(
                            h(
                              QItem,
                              {
                                // attrs
                                key: rate.value,
                                // props
                                clickable: true,
                                dense: true,
                                // events
                                onClick: (e: Event) => {
                                  __stopAndPrevent(e)
                                  __playbackRateChanged(rate.value)
                                },
                              },
                              () => [
                                h(
                                  QItemSection,
                                  {
                                    // props
                                    avatar: true,
                                  },
                                  () => [
                                    rate.value === state.playbackRate &&
                                      h(QIcon, {
                                        // props
                                        name: iconSet.mediaPlayer.selected,
                                      }),
                                  ],
                                ),
                                h(QItemSection, () => rate.label),
                              ],
                            ),
                            [[ClosePopup]],
                          )
                        }),
                      ],
                    ),
                  ],
                ),
              // first item is 'Off' and doesn't count unless more are added
              __selectTracksLanguageList.value.length > 1 &&
                h(
                  QExpansionItem,
                  {
                    // props
                    group: 'settings-menu',
                    expandSeparator: true,
                    icon: iconSet.mediaPlayer.language,
                    label: lang.mediaPlayer.language,
                    caption: __trackLanguageCaption.value,
                    // events
                    onShow: __adjustMenu,
                    onHide: __adjustMenu,
                  },
                  () => [
                    h(
                      QList,
                      {
                        // props
                        highlight: true,
                      },
                      () => [
                        __selectTracksLanguageList.value.map((language) => {
                          return withDirectives(
                            h(
                              QItem,
                              {
                                // attrs
                                key: language.value,
                                // props
                                clickable: true,
                                dense: true,
                                // events
                                onClick: (e: Event) => {
                                  __stopAndPrevent(e)
                                  __trackLanguageChanged(language.value)
                                },
                              },
                              () => [
                                h(
                                  QItemSection,
                                  {
                                    // props
                                    avatar: true,
                                  },
                                  () => [
                                    language.value === state.trackLanguage &&
                                      h(QIcon, {
                                        // props
                                        name: iconSet.mediaPlayer.selected,
                                      }),
                                  ],
                                ),
                                h(QItemSection, () => language.label),
                              ],
                            ),
                            [[ClosePopup]],
                          )
                        }),
                      ],
                    ),
                  ],
                ),
            ]),
        ],
      )
    }

    function __renderMediaPlayer() {
      const events = {
        onMousemove: __mouseMoveAction,
        onMouseleave: __mouseLeaveVideo,
        onClick: __videoClick,
      }

      return h(
        'div',
        {
          class: {
            'q-media--dark': props.dark === true,
            'q-media': true,
            ...__classes.value,
          },
          style: {
            borderRadius: !state.inFullscreen ? props.radius : 0,
            height: __isVideo.value ? 'auto' : props.dense ? '40px' : '80px',
          },
          ref: $root,
          ...events,
        },
        canRender.value === true
          ? [
              __isVideo.value && __renderVideo(),
              __isAudio.value && __renderAudio(),
              __renderOverlayWindow(),
              state.errorText && __renderErrorWindow(),
              __isVideo.value && !state.noControls && !state.errorText && __renderVideoControls(),
              __isAudio.value && !state.noControls && !state.errorText && __renderAudioControls(),
              props.showSpinner === true &&
                state.loading &&
                !state.playReady &&
                !state.errorText &&
                __renderLoader(),
              __isVideo.value &&
                props.showBigPlayButton &&
                state.playReady &&
                !state.playing &&
                __renderBigPlayButton(),
            ]
          : void 0,
      )
    }

    // expose public methods
    expose({
      loadBlob,
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
      $media,
    })

    return () => __renderMediaPlayer()
  },
})
