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
} from "vue";
import type { PropType, Slot, VNode, VNodeArrayChildren } from "vue";

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
} from "quasar";

import defaultIconSet from "../../icon-set/material-icons.mjs";
import defaultLang from "../../lang/en-US.mjs";

type MediaPlayerType = "video" | "audio";
type CrossOrigin = "anonymous" | "use-credentials" | null;
type ClassOrStyle = string | Record<string, unknown> | undefined;

type MediaSource = {
  src?: string;
  type?: string;
};

type MediaTrack = {
  kind?: string;
  label?: string;
  src?: string;
  srclang?: string;
};

type PlaybackRateOption = {
  label: string;
  value: number;
};

type SelectOption = {
  label: string;
  value: string;
};

type RenderChild = string | number | boolean | VNode | VNodeArrayChildren | (() => unknown);

type MediaPlayerMessages = {
  language: string;
  mute: string;
  noLoadAudio: string;
  noLoadVideo: string;
  oldBrowserAudio: string;
  oldBrowserVideo: string;
  pause: string;
  play: string;
  rate1Point5: string;
  rate2: string;
  rateNormal: string;
  ratePoint5: string;
  settings: string;
  speed: string;
  toggleFullscreen: string;
  trackLanguageOff: string;
  unmute: string;
  waitingAudio: string;
  waitingVideo: string;
};

type MediaPlayerLang = {
  lang?: string;
  mediaPlayer: MediaPlayerMessages;
};

type MediaPlayerIcons = {
  bigPlayButton: string;
  fullscreen: string;
  fullscreenExit: string;
  language: string;
  pause: string;
  play: string;
  selected: string;
  settings: string;
  speed: string;
  volumeDown: string;
  volumeOff: string;
  volumeUp: string;
};

type MediaPlayerIconSet = {
  mediaPlayer: MediaPlayerIcons;
};

type QMediaPlayerGlobal = {
  Component?: unknown;
  lang?: Record<string, MediaPlayerLang>;
  iconSet?: Record<string, MediaPlayerIconSet>;
};

type QuasarLike = {
  dark: {
    isActive: boolean;
  };
  fullscreen?: {
    isActive?: boolean;
    request: (target?: Element | null) => void | Promise<void>;
    exit: () => void | Promise<void>;
  };
  iconSet?: {
    name?: string;
  };
  lang?: {
    isoName?: string;
  };
};

type MediaPlayerState = {
  errorText: string | null;
  controls: boolean;
  showControls: boolean;
  inControls: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  durationTime: string;
  remainingTime: string;
  displayTime: string;
  inFullscreen: boolean;
  loading: boolean;
  playReady: boolean;
  playing: boolean;
  playbackRates: PlaybackRateOption[];
  playbackRate: number;
  trackLanguage: string;
  showBigPlayButton: boolean;
  metadataLoaded: boolean;
  spinnerSize: string;
  bottomControls: boolean;
  noControls: boolean;
};

declare global {
  interface Window {
    QMediaPlayer?: QMediaPlayerGlobal;
  }
}

const defaultMediaPlayerLang = defaultLang as MediaPlayerLang;
const defaultMediaPlayerIconSet = defaultIconSet as MediaPlayerIconSet;

const matClose =
  "M0 0h24v24H0z@@fill:none;&&M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z";

const iconSetLoaders = {
  "bootstrap-icons": () => import("../../icon-set/bootstrap-icons.mjs"),
  "eva-icons": () => import("../../icon-set/eva-icons.mjs"),
  "fontawesome-v5": () => import("../../icon-set/fontawesome-v5.mjs"),
  "fontawesome-v5-pro": () => import("../../icon-set/fontawesome-v5-pro.mjs"),
  "fontawesome-v6": () => import("../../icon-set/fontawesome-v6.mjs"),
  "fontawesome-v6-pro": () => import("../../icon-set/fontawesome-v6-pro.mjs"),
  "fontawesome-v7": () => import("../../icon-set/fontawesome-v7.mjs"),
  "ionicons-v4": () => import("../../icon-set/ionicons-v4.mjs"),
  "ionicons-v7": () => import("../../icon-set/ionicons-v7.mjs"),
  "ionicons-v8": () => import("../../icon-set/ionicons-v8.mjs"),
  "line-awesome": () => import("../../icon-set/line-awesome.mjs"),
  "material-icons": async () => ({ default: defaultIconSet }),
  "material-icons-outlined": () => import("../../icon-set/material-icons-outlined.mjs"),
  "material-icons-round": () => import("../../icon-set/material-icons-round.mjs"),
  "material-icons-sharp": () => import("../../icon-set/material-icons-sharp.mjs"),
  "material-symbols-outlined": () => import("../../icon-set/material-symbols-outlined.mjs"),
  "material-symbols-rounded": () => import("../../icon-set/material-symbols-rounded.mjs"),
  "material-symbols-sharp": () => import("../../icon-set/material-symbols-sharp.mjs"),
  "mdi-v3": () => import("../../icon-set/mdi-v3.mjs"),
  "mdi-v4": () => import("../../icon-set/mdi-v4.mjs"),
  "mdi-v5": () => import("../../icon-set/mdi-v5.mjs"),
  "mdi-v6": () => import("../../icon-set/mdi-v6.mjs"),
  "mdi-v7": () => import("../../icon-set/mdi-v7.mjs"),
  "svg-bootstrap-icons": () => import("../../icon-set/svg-bootstrap-icons.mjs"),
  "svg-eva-icons": () => import("../../icon-set/svg-eva-icons.mjs"),
  "svg-fontawesome-v5": () => import("../../icon-set/svg-fontawesome-v5.mjs"),
  "svg-fontawesome-v6": () => import("../../icon-set/svg-fontawesome-v6.mjs"),
  "svg-fontawesome-v7": () => import("../../icon-set/svg-fontawesome-v7.mjs"),
  "svg-ionicons-v4": () => import("../../icon-set/svg-ionicons-v4.mjs"),
  "svg-ionicons-v7": () => import("../../icon-set/svg-ionicons-v7.mjs"),
  "svg-ionicons-v8": () => import("../../icon-set/svg-ionicons-v8.mjs"),
  "svg-line-awesome": () => import("../../icon-set/svg-line-awesome.mjs"),
  "svg-material-icons": () => import("../../icon-set/svg-material-icons.mjs"),
  "svg-material-icons-outlined": () => import("../../icon-set/svg-material-icons-outlined.mjs"),
  "svg-material-icons-round": () => import("../../icon-set/svg-material-icons-round.mjs"),
  "svg-material-icons-sharp": () => import("../../icon-set/svg-material-icons-sharp.mjs"),
  "svg-material-symbols-outlined": () => import("../../icon-set/svg-material-symbols-outlined.mjs"),
  "svg-material-symbols-rounded": () => import("../../icon-set/svg-material-symbols-rounded.mjs"),
  "svg-material-symbols-sharp": () => import("../../icon-set/svg-material-symbols-sharp.mjs"),
  "svg-mdi-v4": () => import("../../icon-set/svg-mdi-v4.mjs"),
  "svg-mdi-v5": () => import("../../icon-set/svg-mdi-v5.mjs"),
  "svg-mdi-v6": () => import("../../icon-set/svg-mdi-v6.mjs"),
  "svg-mdi-v7": () => import("../../icon-set/svg-mdi-v7.mjs"),
  "svg-themify": () => import("../../icon-set/svg-themify.mjs"),
  themify: () => import("../../icon-set/themify.mjs"),
};

const langLoaders = {
  ar: () => import("../../lang/ar.mjs"),
  "az-Latn": () => import("../../lang/az-Latn.mjs"),
  bg: () => import("../../lang/bg.mjs"),
  bn: () => import("../../lang/bn.mjs"),
  ca: () => import("../../lang/ca.mjs"),
  cs: () => import("../../lang/cs.mjs"),
  da: () => import("../../lang/da.mjs"),
  de: () => import("../../lang/de.mjs"),
  el: () => import("../../lang/el.mjs"),
  "en-GB": () => import("../../lang/en-GB.mjs"),
  "en-US": async () => ({ default: defaultLang }),
  eo: () => import("../../lang/eo.mjs"),
  es: () => import("../../lang/es.mjs"),
  et: () => import("../../lang/et.mjs"),
  fa: () => import("../../lang/fa.mjs"),
  "fa-IR": () => import("../../lang/fa-IR.mjs"),
  fi: () => import("../../lang/fi.mjs"),
  fr: () => import("../../lang/fr.mjs"),
  gn: () => import("../../lang/gn.mjs"),
  he: () => import("../../lang/he.mjs"),
  hr: () => import("../../lang/hr.mjs"),
  hu: () => import("../../lang/hu.mjs"),
  id: () => import("../../lang/id.mjs"),
  is: () => import("../../lang/is.mjs"),
  it: () => import("../../lang/it.mjs"),
  ja: () => import("../../lang/ja.mjs"),
  km: () => import("../../lang/km.mjs"),
  "ko-KR": () => import("../../lang/ko-KR.mjs"),
  "kur-CKB": () => import("../../lang/kur-CKB.mjs"),
  lt: () => import("../../lang/lt.mjs"),
  lu: () => import("../../lang/lu.mjs"),
  lv: () => import("../../lang/lv.mjs"),
  ml: () => import("../../lang/ml.mjs"),
  ms: () => import("../../lang/ms.mjs"),
  "nb-NO": () => import("../../lang/nb-NO.mjs"),
  nl: () => import("../../lang/nl.mjs"),
  pl: () => import("../../lang/pl.mjs"),
  pt: () => import("../../lang/pt.mjs"),
  "pt-BR": () => import("../../lang/pt-BR.mjs"),
  ro: () => import("../../lang/ro.mjs"),
  ru: () => import("../../lang/ru.mjs"),
  sk: () => import("../../lang/sk.mjs"),
  sl: () => import("../../lang/sl.mjs"),
  sr: () => import("../../lang/sr.mjs"),
  "sr-CYR": () => import("../../lang/sr-CYR.mjs"),
  sv: () => import("../../lang/sv.mjs"),
  ta: () => import("../../lang/ta.mjs"),
  th: () => import("../../lang/th.mjs"),
  tr: () => import("../../lang/tr.mjs"),
  ug: () => import("../../lang/ug.mjs"),
  uk: () => import("../../lang/uk.mjs"),
  vi: () => import("../../lang/vi.mjs"),
  "zh-CN": () => import("../../lang/zh-CN.mjs"),
  "zh-TW": () => import("../../lang/zh-TW.mjs"),
};

function hSlot(slot: Slot | undefined, otherwise: RenderChild): RenderChild {
  return slot !== void 0 ? slot() : otherwise;
}

const padTime = (val: number) => {
  val = Math.floor(val);
  if (val < 10) {
    return "0" + val;
  }
  return val + "";
};

const timeParse = (sec: number) => {
  let min = 0;
  min = Math.floor(sec / 60);
  sec = sec - min * 60;
  return padTime(min) + ":" + padTime(sec);
};

export default defineComponent({
  name: "QMediaPlayer",

  directives: {
    ClosePopup,
    Ripple,
  },

  props: {
    type: {
      type: String as PropType<MediaPlayerType>,
      required: false,
      default: "video",
      validator: (v: string) => ["video", "audio"].includes(v),
    },
    mobileMode: Boolean,
    source: String,
    sources: {
      type: Array as PropType<MediaSource[]>,
      default: () => [],
    },
    poster: {
      type: String,
      default: "",
    },
    tracks: {
      type: Array as PropType<MediaTrack[]>,
      default: () => [],
    },
    dense: Boolean,
    autoplay: Boolean,
    autoPause: {
      type: Boolean,
      default: false,
    },
    crossOrigin: {
      type: String as PropType<CrossOrigin>,
      default: null,
      validator: (v: string | null) => v === null || ["anonymous", "use-credentials"].includes(v),
    },
    volume: {
      type: Number,
      default: 60,
      validator: (v: number) => v >= 0 && v <= 100,
    },
    hideVolumeSlider: Boolean,
    hideVolumeBtn: Boolean,
    hidePlayBtn: Boolean,
    hideSettingsBtn: Boolean,
    hideFullscreenBtn: Boolean,
    disabledSeek: Boolean,
    preload: {
      type: String,
      default: "metadata",
      validator: (v: string) => ["none", "metadata", "auto"].includes(v),
    },
    noVideo: Boolean,
    muted: Boolean,
    playsinline: Boolean,
    loop: Boolean,
    trackLanguage: {
      type: String,
      default: "off", // value for 'Off'
    },
    showTooltips: Boolean,
    showBigPlayButton: {
      type: Boolean,
      default: true,
    },
    showSpinner: {
      type: Boolean,
      default: true,
    },
    spinnerSize: String,
    noControls: Boolean,
    nativeControls: Boolean,
    bottomControls: {
      type: Boolean,
      default: false,
    },
    controlsDisplayTime: {
      type: Number,
      default: 4000,
    },
    playbackRates: Array as PropType<PlaybackRateOption[]>,
    // initial playback rate
    playbackRate: {
      type: Number,
      default: 1,
    },
    dark: Boolean,
    radius: {
      type: [Number, String],
      default: 0,
    },
    contentStyle: [String, Object] as PropType<ClassOrStyle>,
    contentClass: [String, Object] as PropType<ClassOrStyle>,
    contentWidth: Number,
    contentHeight: Number,
  },

  emits: [
    "mediaPlayer",
    "playbackRate",
    "trackLanguage",
    "showControls",
    "volume",
    "muted",
    "fullscreen",
    "networkState",
    "abort",
    "ready",
    "canplay",
    "canplaythrough",
    "duration",
    "emptied",
    "ended",
    "error",
    "loadeddata",
    "loadedmetadata",
    "stalled",
    "suspend",
    "loadstart",
    "paused",
    "play",
    "playing",
    "timeupdate",
    "waiting",
  ],

  setup(props, { slots, emit, expose }) {
    const vm = getCurrentInstance();
    const vmContext = vm as ({ ctx?: { $q?: Partial<QuasarLike> } } & typeof vm) | null;
    const instanceQuasar = (vm?.proxy?.$q || vmContext?.ctx?.$q) as Partial<QuasarLike> | undefined;
    const quasar = (useQuasar() || instanceQuasar || {}) as Partial<QuasarLike>;
    const $q = {
      dark: { isActive: false },
      iconSet: { name: "material-icons" },
      lang: { isoName: "en-US" },
      ...quasar,
    } as QuasarLike;

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
        durationTime: "00:00",
        remainingTime: "00:00",
        displayTime: "00:00",
        inFullscreen: false,
        loading: true,
        playReady: false,
        playing: false,
        playbackRates: [
          { label: ".5x", value: 0.5 },
          { label: "Normal", value: 1 },
          { label: "1.5x", value: 1.5 },
          { label: "2x", value: 2 },
        ],
        playbackRate: 1,
        trackLanguage: "Off",
        showBigPlayButton: true,
        metadataLoaded: false,
        spinnerSize: "5em",
        bottomControls: false,
        noControls: false,
      }),
      settingsMenuVisible = ref(false),
      autoPauseObserver = ref<IntersectionObserver | null>(null),
      blobObjectUrl = ref<string | null>(null),
      allEvents = [
        "abort",
        "canplay",
        "canplaythrough",
        "durationchange",
        "emptied",
        "ended",
        "error",
        "interruptbegin",
        "interruptend",
        "loadeddata",
        "loadedmetadata",
        "loadstart",
        "pause",
        "play",
        "playing",
        "progress",
        "ratechange",
        "seeked",
        "timeupdate",
        "volumechange",
        "waiting",
      ];

    // Computed

    const __classes = computed(() => {
      return {
        "q-media__fullscreen": state.inFullscreen,
        "q-media__fullscreen--window": state.inFullscreen,
      };
    });

    const __renderVideoClasses = computed(() => {
      return {
        "q-media--player": true,
        "q-media--player--bottom-controls--standard":
          !props.dense && state.bottomControls && state.inFullscreen,
        "q-media--player--bottom-controls--dense":
          props.dense && state.bottomControls && state.inFullscreen,
      };
    });

    const __videoControlsClasses = computed(() => {
      return {
        "q-media__controls--dense":
          !slots.controls && (state.showControls || props.mobileMode) && props.dense,
        "q-media__controls--standard":
          !slots.controls && (state.showControls || props.mobileMode) && !props.dense,
        "q-media__controls--hidden": !state.showControls,
        "q-media__controls--bottom-controls": state.bottomControls,
      };
    });

    const __audioControlsClasses = computed(() => {
      return {
        "q-media__controls--dense": props.dense,
        "q-media__controls--standard": !props.dense,
        "q-media__controls--bottom-controls": state.bottomControls,
      };
    });

    const __contentStyle = computed(() => {
      const style: Record<string, unknown> = {};
      if (state.inFullscreen !== true) {
        Object.assign(style, __mergeClassOrStyle("style", props.contentStyle));
        if (props.bottomControls === true && style.height === void 0) {
          // const size = props.dense === true ? 40 : 80
          style.height = `calc(100% - ${__controlsHeight.value}px)`;
        }
        if (style.height === void 0) {
          style.height = "100%";
        }
      }
      return style;
    });

    const __volumeIcon = computed(() => {
      if (state.volume > 1 && state.volume < 70 && !state.muted) {
        return iconSet.mediaPlayer.volumeDown;
      } else if (state.volume >= 70 && !state.muted) {
        return iconSet.mediaPlayer.volumeUp;
      } else {
        return iconSet.mediaPlayer.volumeOff;
      }
    });

    const __selectTracksLanguageList = computed(() => {
      const tracksList: SelectOption[] = [];
      // provide option to turn subtitles/captions/chapters off
      const track: SelectOption = {
        label: lang.mediaPlayer.trackLanguageOff,
        value: "off",
      };
      tracksList.push(track);
      for (let index = 0; index < props.tracks.length; ++index) {
        const track = {
          label: props.tracks[index].label || "",
          value: props.tracks[index].label || "",
        };
        tracksList.push(track);
      }
      return tracksList;
    });

    function __mediaElement() {
      const media = $media.value;
      return media !== null && media.volume !== undefined ? media : null;
    }

    const __isMediaAvailable = computed(() => __mediaElement() !== null);

    const __isAudio = computed(() => {
      return props.type === "audio";
    });

    const __isVideo = computed(() => {
      return props.type === "video";
    });

    const __settingsPlaybackCaption = computed(() => {
      let caption = "";
      state.playbackRates.forEach((rate: PlaybackRateOption) => {
        if (rate.value === state.playbackRate) {
          caption = rate.label;
        }
      });
      return caption;
    });

    const __controlsHeight = computed(() => {
      if (controls.value) {
        return controls.value.clientHeight;
      }
      return props.dense ? 40 : 80;
    });

    // Watches

    watch(
      () => $media.value,
      () => {
        __init();
        emit("mediaPlayer", $media.value);
      },
    );

    watch(
      () => props.poster,
      () => {
        __updatePoster();
      },
    );

    watch(
      () => props.sources,
      () => {
        __updateSources();
      },
      { deep: true },
    );

    watch(
      () => props.source,
      () => {
        __updateSources();
      },
    );

    watch(
      () => props.tracks,
      () => {
        __updateTracks();
      },
      { deep: true },
    );

    watch(
      () => props.volume,
      () => {
        __updateVolume();
      },
    );

    watch(
      () => props.muted,
      () => {
        __updateMuted();
      },
    );

    watch(
      () => props.trackLanguage,
      () => {
        __updateTrackLanguage();
      },
    );

    watch(
      () => props.showBigPlayButton,
      () => {
        __updateBigPlayButton();
      },
    );

    watch(
      () => props.playbackRates,
      () => {
        __updatePlaybackRates();
      },
    );

    watch(
      () => props.playbackRate,
      () => {
        __updatePlaybackRate();
      },
    );

    // watch(() => $route, val => {
    //   exitFullscreen()
    // })

    watch(
      () => $q.lang?.isoName,
      () => {
        __setupLang();
      },
    );

    watch(
      () => $q.iconSet?.name,
      () => {
        __setupIcons();
      },
    );

    watch(
      () => $q.fullscreen?.isActive,
      (val: boolean | undefined) => {
        // user pressed F11/ESC to exit fullscreen
        if (!val && __isVideo.value && state.inFullscreen) {
          exitFullscreen();
        }
      },
    );

    watch(
      () => state.playbackRate,
      (val: number) => {
        const media = __mediaElement();
        if (val && media !== null) {
          media.playbackRate = val;
          // eslint-disable-next-line vue/custom-event-name-casing
          emit("playbackRate", val);
        }
      },
    );

    watch(
      () => state.trackLanguage,
      (val: string) => {
        __toggleCaptions();
        // eslint-disable-next-line vue/custom-event-name-casing
        emit("trackLanguage", val);
      },
    );

    watch(
      () => state.showControls,
      (val: boolean) => {
        if (__isVideo.value && !state.noControls) {
          // eslint-disable-next-line vue/custom-event-name-casing
          emit("showControls", val);
        }
      },
    );

    watch(
      () => state.volume,
      (val: number) => {
        const media = __mediaElement();
        if (media !== null) {
          const volume = val / 100.0;
          if (media.volume !== volume) {
            media.volume = volume;
            emit("volume", val);
          }
        }
      },
    );

    watch(
      () => state.muted,
      (val: boolean) => {
        emit("muted", val);
      },
    );

    watch(
      () => state.currentTime,
      () => {
        const media = __mediaElement();
        if (media !== null && state.playReady) {
          if (isFinite(media.duration)) {
            state.remainingTime = timeParse(media.duration - media.currentTime);
          }
          state.displayTime = timeParse(media.currentTime);
        }
      },
    );

    watch(
      () => props.bottomControls,
      (val: boolean) => {
        state.bottomControls = val;
        if (val) {
          state.showControls = true;
        }
      },
    );

    watch(
      () => props.noControls,
      (val: boolean) => {
        state.noControls = val;
        if (props.nativeControls === true) {
          state.noControls = true;
        }
      },
    );

    watch(
      () => props.autoPause,
      () => {
        __updateAutoPauseObserver();
      },
    );

    // watch(() => state.inControls, (val) => {
    //   console.log('inControls:', val)
    // })

    onMounted(() => {
      canRender.value = typeof window !== "undefined"; // SSR
      if (canRender.value === true) {
        __setupLang();
        __setupIcons();
        nextTick(() => {
          __updateAutoPauseObserver();
        });
      }
    });

    onBeforeUnmount(() => {
      if (canRender.value === true) {
        __removeAutoPauseObserver();

        // make sure not still in fullscreen
        exitFullscreen();

        // make sure noScroll is not left in unintended state
        document.body.classList.remove("no-scroll");

        __removeSourceEventListeners();
        __removeMediaEventListeners();

        // make sure no memory leaks
        __removeTracks();
        __removeSources();
        $media.value = null;
      }
    });

    // Public Methods

    function loadBlob(blob: Blob) {
      const media = __mediaElement();

      if (media === null) {
        return false;
      }

      if (!(blob instanceof Blob)) {
        console.error("[QMediaPlayer]: loadBlob method requires a Blob or File");
        return false;
      }

      __removeSources();

      const objectUrl = URL.createObjectURL(blob);
      blobObjectUrl.value = objectUrl;
      media.src = objectUrl;
      __reset();
      __addSourceEventListeners();
      media.load();
      nextTick(() => {
        __syncMediaReady();
      }).catch((e) => console.error(e));

      return true;
    }

    function loadFileBlob(fileList: FileList) {
      if (fileList) {
        if (Object.prototype.toString.call(fileList) === "[object FileList]") {
          return fileList.length > 0 ? loadBlob(fileList[0]) : false;
        }

        console.error("[QMediaPlayer]: loadFileBlob method requires a FileList");
      }
      return false;
    }

    function showControls() {
      // no controls - always off
      if (state.noControls) {
        state.showControls = false;
        return;
      }
      // bottom controls - always on
      if (state.bottomControls) {
        state.showControls = true;
        return;
      }
      // kill timer, if there is one
      if (timer.hideControlsTimer) {
        clearTimeout(timer.hideControlsTimer);
        timer.hideControlsTimer = null;
      }
      // show controls
      state.showControls = true;
      // check if hide cursor (fullscreen)
      __checkCursor();
      // set the timer
      if (props.controlsDisplayTime !== -1 && !props.mobileMode && __isVideo.value) {
        timer.hideControlsTimer = setTimeout(() => {
          // hide controls, but not if menu is showing
          if (!__showingMenu() && state.inControls !== true) {
            state.showControls = false;
            timer.hideControlsTimer = null;
            __checkCursor();
          } else {
            showControls();
          }
          // user configured display time (in ms)
        }, props.controlsDisplayTime);
      }
    }

    function hideControls() {
      if (state.inControls) return;
      // no controls - always off
      if (state.noControls) {
        state.showControls = false;
        return;
      }
      // bottom controls - always on
      if (state.bottomControls) {
        state.showControls = true;
        return;
      }
      // clear timer if there is one
      if (timer.hideControlsTimer) {
        clearTimeout(timer.hideControlsTimer);
      }
      if (props.controlsDisplayTime !== -1) {
        state.showControls = false;
        __checkCursor();
      }
      timer.hideControlsTimer = null;
    }

    function toggleControls() {
      if (state.bottomControls) {
        return;
      }

      if (state.showControls) {
        hideControls();
      } else {
        showControls();
      }
    }

    function play() {
      const media = __mediaElement();

      if (media !== null && state.playReady === true) {
        media
          .play()
          .then(() => {
            state.showBigPlayButton = false;
            state.playing = true;
            __mouseLeaveVideo();
            return true;
          })
          .catch(() => {});
      }
    }

    function pause() {
      const media = __mediaElement();

      if (media !== null && state.playReady === true) {
        if (state.playing) {
          media.pause();
          state.showBigPlayButton = true;
          state.playing = false;
        }
      }
    }

    function __updateAutoPauseObserver() {
      __removeAutoPauseObserver();

      if (
        props.autoPause !== true ||
        canRender.value !== true ||
        typeof IntersectionObserver === "undefined" ||
        $root.value === null
      ) {
        return;
      }

      autoPauseObserver.value = new IntersectionObserver((entries) => {
        const entry = entries[0];

        if (
          entry?.isIntersecting !== true &&
          state.playing === true &&
          state.inFullscreen !== true
        ) {
          pause();
        }
      });

      autoPauseObserver.value.observe($root.value);
    }

    function __removeAutoPauseObserver() {
      if (autoPauseObserver.value !== null) {
        autoPauseObserver.value.disconnect();
        autoPauseObserver.value = null;
      }
    }

    function mute() {
      state.muted = true;
      const media = __mediaElement();
      if (media !== null) {
        media.muted = true;
      }
    }

    function unmute() {
      state.muted = false;
      const media = __mediaElement();
      if (media !== null) {
        media.muted = false;
      }
    }

    function togglePlay(e?: Event) {
      __stopAndPrevent(e);
      const media = __mediaElement();

      if (media !== null && state.playReady === true) {
        if (state.playing) {
          media.pause();
          state.showBigPlayButton = true;
          state.playing = false;
        } else {
          media
            .play()
            .then(() => {
              state.showBigPlayButton = false;
              state.playing = true;
              __mouseLeaveVideo();
              return true;
            })
            .catch(() => {});
        }
      }
    }

    function toggleMuted(e: Event) {
      __stopAndPrevent(e);
      state.muted = !state.muted;
      const media = __mediaElement();
      if (media !== null) {
        media.muted = state.muted === true;
      }
    }

    function toggleFullscreen(e: Event) {
      if (__isVideo.value) {
        __stopAndPrevent(e);
        if (state.inFullscreen) {
          exitFullscreen();
        } else {
          setFullscreen();
        }
        emit("fullscreen", state.inFullscreen);
      }
    }

    function setFullscreen() {
      const media = __mediaElement();

      if (props.hideFullscreenBtn === true || !__isVideo.value || state.inFullscreen) {
        return;
      }
      if ($q.fullscreen !== void 0 && media !== null) {
        state.inFullscreen = true;
        $q.fullscreen.request(media.parentElement); // NOTE error Not capable - on iPhone Safari
        document.body.classList.add("no-scroll");
        // nextTick(() => {
        //   forceUpdate()
        // })
      }
    }

    function exitFullscreen() {
      if (props.hideFullscreenBtn === true || !__isVideo.value || !state.inFullscreen) {
        return;
      }
      if ($q.fullscreen !== void 0) {
        state.inFullscreen = false;
        $q.fullscreen.exit();
        document.body.classList.remove("no-scroll");
        // nextTick(() => {
        //   forceUpdate()
        // })
      }
    }

    function currentTime() {
      const media = __mediaElement();
      if (media !== null && state.playReady === true) {
        return media.currentTime;
      }
      return -1;
    }

    function setCurrentTime(seconds: number) {
      const media = __mediaElement();
      if (state.playReady) {
        if (
          media !== null &&
          isFinite(media.duration) &&
          seconds >= 0 &&
          seconds <= media.duration
        ) {
          state.currentTime = media.currentTime = seconds;
        }
      }
    }

    function setVolume(volume: number) {
      if (volume >= 0 && volume <= 100) {
        state.volume = volume;
      }
    }

    // Private Methods

    function __reset() {
      if (timer.hideControlsTimer && !state.bottomControls) {
        clearTimeout(timer.hideControlsTimer);
      }
      timer.hideControlsTimer = null;
      state.errorText = null;
      state.currentTime = 0.01;
      state.durationTime = "00:00";
      state.remainingTime = "00:00";
      state.displayTime = "00:00";
      state.duration = 1;
      state.playReady = false;
      state.playing = false;
      state.loading = true;
      state.metadataLoaded = false;
      __updateTrackLanguage();
      showControls();
    }

    function __toggleCaptions() {
      __showCaptions(state.trackLanguage);
    }

    function __showCaptions(lang: string) {
      const media = __mediaElement();

      if (media !== null && __isVideo.value) {
        for (let index = 0; index < media.textTracks.length; ++index) {
          if (media.textTracks[index].label === lang) {
            media.textTracks[index].mode = "showing";
            media.textTracks[index].oncuechange = __cueChanged;
          } else {
            media.textTracks[index].mode = "hidden";
            media.textTracks[index].oncuechange = null;
          }
        }
      }
    }

    function __stopAndPrevent(e?: Event) {
      if (e) {
        if (e.cancelable !== false) {
          e.preventDefault();
        }
        e.stopPropagation();
      }
    }

    async function __setupLang() {
      const isoName = $q.lang?.isoName || "en-US";
      let language: Partial<MediaPlayerLang> | undefined;
      try {
        // language = require(`./lang/${isoName}`)
        language = await __loadLang(isoName);
      } catch {}

      if (language?.mediaPlayer !== void 0) {
        lang.mediaPlayer = { ...defaultMediaPlayerLang.mediaPlayer, ...language.mediaPlayer };
        __updatePlaybackRates();
        __updateTrackLanguage();
      }
    }

    async function __loadLang(lang: string): Promise<Partial<MediaPlayerLang>> {
      let langList: Partial<MediaPlayerLang> = {};
      if (lang) {
        const mediaPlayerGlobal = typeof window !== "undefined" ? window.QMediaPlayer : undefined;
        // detect if UMD version is installed
        if (mediaPlayerGlobal && mediaPlayerGlobal.Component) {
          const name = lang.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase());
          if (mediaPlayerGlobal.lang && mediaPlayerGlobal.lang[name]) {
            langList = mediaPlayerGlobal.lang[name];
          } else {
            /* eslint-disable-next-line no-console */
            console.error(`[QMediaPlayer]: No language loaded called '${lang}'`);
            /* eslint-disable-next-line no-console */
            console.error(
              "[QMediaPlayer]: Be sure to load the UMD version of the language in a script tag before using with UMD",
            );
          }
        } else {
          try {
            const loadLang = langLoaders[lang as keyof typeof langLoaders] || langLoaders["en-US"];

            if (langLoaders[lang as keyof typeof langLoaders] === void 0) {
              /* eslint-disable-next-line no-console */
              console.error(`[QMediaPlayer]: Cannot find language file called '${lang}'`);
            }

            const result = await loadLang();
            langList = result.default as MediaPlayerLang;
          } catch {
            /* eslint-disable-next-line no-console */
            console.error(`[QMediaPlayer]: Cannot find language file called '${lang}'`);
          }
        }
      }
      return langList;
    }

    async function __setupIcons() {
      const iconSetName = $q.iconSet?.name || "material-icons";
      let icnSet: Partial<MediaPlayerIconSet> | undefined;
      try {
        icnSet = await __loadIconSet(iconSetName);
      } catch {}

      if (icnSet !== void 0 && icnSet.mediaPlayer !== void 0) {
        iconSet.mediaPlayer = { ...defaultMediaPlayerIconSet.mediaPlayer, ...icnSet.mediaPlayer };
      }
    }

    async function __loadIconSet(set: string): Promise<Partial<MediaPlayerIconSet>> {
      let iconsList: Partial<MediaPlayerIconSet> = {};
      if (set) {
        const mediaPlayerGlobal = typeof window !== "undefined" ? window.QMediaPlayer : undefined;
        // detect if UMD version is installed
        if (mediaPlayerGlobal && mediaPlayerGlobal.Component) {
          const name = set.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase());
          if (mediaPlayerGlobal.iconSet && mediaPlayerGlobal.iconSet[name]) {
            iconsList = mediaPlayerGlobal.iconSet[name];
          } else {
            /* eslint-disable-next-line no-console */
            console.error(`[QMediaPlayer]: No icon set loaded called '${set}'`);
            /* eslint-disable-next-line no-console */
            console.error(
              "[QMediaPlayer]:Be sure to load the UMD version of the icon set in a script tag before using with UMD",
            );
          }
        } else {
          const loadIconSet =
            iconSetLoaders[set as keyof typeof iconSetLoaders] || iconSetLoaders["material-icons"];

          if (iconSetLoaders[set as keyof typeof iconSetLoaders] === void 0) {
            /* eslint-disable-next-line no-console */
            console.error(`[QMediaPlayer]: Cannot find icon set file called '${set}'`);
          }

          const result = await loadIconSet();
          iconsList = result.default as MediaPlayerIconSet;
        }
      }
      return iconsList;
    }

    function __init() {
      const media = __mediaElement();

      state.bottomControls = props.bottomControls;
      state.noControls = props.noControls;
      if (props.nativeControls === true) {
        state.noControls = true;
      }
      // Attach media listeners before loading sources so cached/local assets
      // cannot race past readiness events.
      __addMediaEventListeners();
      // set default track language
      __updateTrackLanguage();
      __updateSources();
      __updateTracks();
      // set big play button
      __updateBigPlayButton();
      // set the volume
      __updateVolume();
      // set muted
      __updateMuted();
      // set playback rates
      __updatePlaybackRates();
      // set playback rate default
      __updatePlaybackRate();
      // does user want cors?
      if (props.crossOrigin && media !== null) {
        media.setAttribute("crossorigin", props.crossOrigin);
      }
      // make sure "controls" is turned off
      if (media !== null) {
        media.controls = false;
      }
      __addSourceEventListeners();
      __toggleCaptions();
    }

    function __addMediaEventListeners() {
      const media = __mediaElement();
      if (media !== null) {
        allEvents.forEach((event) => {
          media.addEventListener(event, __mediaEventHandler);
        });
      }
    }

    function __removeMediaEventListeners() {
      const media = __mediaElement();
      if (media !== null) {
        allEvents.forEach((event) => {
          media.removeEventListener(event, __mediaEventHandler);
        });
      }
    }

    function __addSourceEventListeners() {
      const media = __mediaElement();
      if (media !== null) {
        const sources = media.querySelectorAll("source");
        for (let index = 0; index < sources.length; ++index) {
          sources[index].addEventListener("error", __sourceEventHandler);
        }
      }
    }

    function __removeSourceEventListeners() {
      const media = __mediaElement();
      if (media !== null) {
        const sources = media.querySelectorAll("source");
        for (let index = 0; index < sources.length; ++index) {
          sources[index].removeEventListener("error", __sourceEventHandler);
        }
      }
    }

    function __setMediaReady() {
      const media = __mediaElement();

      if (media === null) {
        return false;
      }

      const wasReady = state.playReady;
      state.playReady = true;
      state.loading = false;
      state.displayTime = timeParse(media.currentTime);

      if (isFinite(media.duration)) {
        state.duration = media.duration;
        state.durationTime = timeParse(media.duration);
        state.remainingTime = timeParse(media.duration - media.currentTime);
      }

      showControls();
      return wasReady !== true;
    }

    function __syncMediaReady() {
      const HAVE_METADATA = 1;
      const media = __mediaElement();

      if (media !== null && (media.currentSrc || media.src) && media.readyState >= HAVE_METADATA) {
        __setMediaReady();
      }
    }

    function __sourceEventHandler(event: Event) {
      const NETWORK_NO_SOURCE = 3;
      const media = __mediaElement();
      if (media !== null && media.networkState === NETWORK_NO_SOURCE) {
        state.errorText = __isVideo.value
          ? lang.mediaPlayer.noLoadVideo
          : lang.mediaPlayer.noLoadAudio;
        state.loading = false;
      }
      // eslint-disable-next-line vue/custom-event-name-casing
      emit("networkState", event);
    }

    function __mediaEventHandler(event: Event) {
      const media = __mediaElement();
      if (media === null) {
        return;
      }

      if (event.type === "abort") {
        emit("abort");
      } else if (event.type === "canplay") {
        const becameReady = __setMediaReady();
        emit("canplay");
        if (becameReady) {
          emit("ready");
        }
      } else if (event.type === "canplaythrough") {
        // console.log('canplaythrough')
        emit("canplaythrough");
      } else if (event.type === "durationchange") {
        if (isFinite(media.duration)) {
          state.duration = media.duration;
          state.durationTime = timeParse(media.duration);
          emit("duration", media.duration);
        }
      } else if (event.type === "emptied") {
        emit("emptied");
      } else if (event.type === "ended") {
        state.playing = false;
        emit("ended");
      } else if (event.type === "error") {
        const error = media.error;
        state.errorText = error && error.message ? error.message : null;
        state.playing = false;
        state.loading = false;
        emit("error", error);
      } else if (event.type === "interruptbegin") {
        // console.log('interruptbegin')
      } else if (event.type === "interruptend") {
        // console.log('interruptend')
      } else if (event.type === "loadeddata") {
        state.loading = false;
        emit("loadeddata");
      } else if (event.type === "loadedmetadata") {
        // tracks can only be programatically added after 'loadedmetadata' event
        state.metadataLoaded = true;
        __updateTracks();
        // set default track language
        __updateTrackLanguage();
        __toggleCaptions();
        const becameReady = __setMediaReady();
        emit("loadedmetadata");
        if (becameReady) {
          emit("ready");
        }
      } else if (event.type === "stalled") {
        emit("stalled");
      } else if (event.type === "suspend") {
        emit("suspend");
      } else if (event.type === "loadstart") {
        emit("loadstart");
      } else if (event.type === "pause") {
        state.playing = false;
        emit("paused");
      } else if (event.type === "play") {
        emit("play");
      } else if (event.type === "playing") {
        state.playing = true;
        emit("playing");
      } else if (event.type === "progress") {
        //
      } else if (event.type === "ratechange") {
        //
      } else if (event.type === "seeked") {
        //
      } else if (event.type === "timeupdate") {
        state.currentTime = media.currentTime;
        emit("timeupdate", media.currentTime, state.remainingTime);
      } else if (event.type === "volumechange") {
        //
      } else if (event.type === "waiting") {
        emit("waiting");
      }
    }

    function __mergeClassOrStyle(type: "class" | "style", val: ClassOrStyle) {
      const child: Record<string, unknown> = {};
      if (val !== undefined) {
        if (typeof val === "string") {
          if (type === "style") {
            const parts = val.replace(/\s+/g, "").split(";");
            parts.forEach((part) => {
              if (part !== "") {
                const data = part.split(":");
                child[data[0]] = data[1];
              }
            });
          } else if (type === "class") {
            const parts = val.split(" ");
            parts.forEach((part) => {
              if (part.replace(/\s+/g, "") !== "") {
                child[part] = true;
              }
            });
          }
        } else {
          Object.assign(child, val);
        }
      }
      return child;
    }

    // for future functionality
    function __cueChanged(_data: Event) {}

    function __checkCursor() {
      const media = __mediaElement();
      if (media !== null) {
        if (state.inFullscreen && state.playing && !state.showControls) {
          media.classList.remove("cursor-inherit");
          media.classList.add("cursor-none");
        } else {
          media.classList.remove("cursor-none");
          media.classList.add("cursor-inherit");
        }
      }
    }

    function __adjustMenu() {
      const qmenu = menu.value;
      if (qmenu) {
        setTimeout(() => {
          qmenu.updatePosition();
        }, 350);
      }
    }

    function __videoClick(e: Event) {
      __stopAndPrevent(e);
      if (props.mobileMode !== true) {
        togglePlay();
      }
    }

    function __bigButtonClick(e: Event) {
      __stopAndPrevent(e);
      if (props.mobileMode) {
        hideControls();
      }
      togglePlay();
    }

    function __settingsMenuShowing(val: boolean) {
      settingsMenuVisible.value = val;
    }

    function __mouseLeaveVideo(e?: MouseEvent) {
      const relatedTarget = e?.relatedTarget;
      if (relatedTarget instanceof HTMLElement && relatedTarget.className === "q-pa-md") {
        if (
          !props.bottomControls &&
          !props.mobileMode &&
          !__isAudio.value &&
          state.inControls !== true
        ) {
          hideControls();
        }
      }
    }

    function __mouseMoveAction(e: MouseEvent) {
      if (!props.bottomControls && !props.mobileMode && !__isAudio.value) {
        __showControlsIfValid(e);
      }
    }

    function __getParentEl(el: HTMLElement | null, className: string): HTMLElement | null {
      if (!el) return null;
      if (String(el.className).startsWith(className)) {
        return el;
      }
      return __getParentEl(el.offsetParent as HTMLElement | null, className);
    }

    function __showControlsIfValid(e: MouseEvent) {
      const media = __mediaElement();
      if (media === null || !(e.target instanceof HTMLElement)) return false;

      const pos = media.getBoundingClientRect();
      const el = __getParentEl(e.target, "q-media");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (!pos || !rect) return false;
      if (
        rect.left === pos.left &&
        rect.top === pos.top &&
        rect.height === pos.height &&
        rect.width === pos.width
      ) {
        showControls();
        return true;
      }

      return false;
    }

    function __videoCurrentTimeChanged(val: number) {
      showControls();
      const media = __mediaElement();
      if (media !== null && media.duration && val && val > 0 && val <= state.duration) {
        if (media.currentTime !== val) {
          state.currentTime = media.currentTime = val;
        }
      }
    }

    function __volumePercentChanged(val: number) {
      showControls();
      state.volume = val;
    }

    function __trackLanguageChanged(language: string) {
      if (state.trackLanguage !== language) {
        state.trackLanguage = language;
      }
    }

    function __playbackRateChanged(rate: number) {
      if (state.playbackRate !== rate) {
        state.playbackRate = rate;
      }
    }

    function __showingMenu() {
      return settingsMenuVisible.value;
    }

    function __updateBigPlayButton() {
      if (state.showBigPlayButton !== props.showBigPlayButton) {
        state.showBigPlayButton = props.showBigPlayButton;
      }
    }

    function __updateVolume() {
      if (state.volume !== props.volume) {
        state.volume = props.volume;
      }
    }

    function __updateMuted() {
      if (state.muted !== props.muted) {
        state.muted = props.muted;
        const media = __mediaElement();
        if (media !== null) {
          media.muted = state.muted;
        }
      }
    }

    function __updateTrackLanguage() {
      if (state.trackLanguage !== props.trackLanguage || lang.mediaPlayer.trackLanguageOff) {
        state.trackLanguage = props.trackLanguage || lang.mediaPlayer.trackLanguageOff;
      }
    }

    function __updatePlaybackRates() {
      if (props.playbackRates && props.playbackRates.length > 0) {
        state.playbackRates = [...props.playbackRates];
      } else {
        state.playbackRates.splice(0, state.playbackRates.length);
        state.playbackRates.push({ label: lang.mediaPlayer.ratePoint5, value: 0.5 });
        state.playbackRates.push({ label: lang.mediaPlayer.rateNormal, value: 1 });
        state.playbackRates.push({ label: lang.mediaPlayer.rate1Point5, value: 1.5 });
        state.playbackRates.push({ label: lang.mediaPlayer.rate2, value: 2 });
      }
    }

    function __updatePlaybackRate() {
      if (state.playbackRate !== props.playbackRate) {
        state.playbackRate = props.playbackRate;
      }
    }

    function __updateSources() {
      __removeSources();
      __addSources();
    }

    function __removeSources() {
      const media = __mediaElement();
      if (media !== null) {
        __removeSourceEventListeners();
        // player must not be running
        media.pause();
        __revokeBlobObjectUrl();
        media.src = "";
        if (media.currentTime) {
          // otherwise IE11 has exception error
          media.currentTime = 0;
        }
        const childNodes = media.childNodes;
        for (let index = childNodes.length - 1; index >= 0; --index) {
          if (childNodes[index] instanceof HTMLSourceElement) {
            media.removeChild(childNodes[index]);
          }
        }
      }
    }

    function __revokeBlobObjectUrl() {
      if (blobObjectUrl.value !== null) {
        URL.revokeObjectURL(blobObjectUrl.value);
        blobObjectUrl.value = null;
      }
    }

    function __addSources() {
      const media = __mediaElement();
      if (media !== null) {
        let loaded = false;
        if (props.source && props.source.length > 0) {
          media.src = props.source;
          loaded = true;
        } else {
          if (props.sources.length > 0) {
            props.sources.forEach((source) => {
              const s = document.createElement("source");
              s.src = source.src ? source.src : "";
              s.type = source.type ? source.type : "";
              media.appendChild(s);
              if (!loaded && source.src) {
                media.src = source.src;
                loaded = true;
              }
            });
          }
        }
        __reset();
        if (loaded !== true) {
          state.loading = false;
          return;
        }
        __addSourceEventListeners();
        media.load();
        nextTick(() => {
          __syncMediaReady();
        }).catch((e) => console.error(e));
      }
    }

    function __updateTracks() {
      __removeTracks();
      __addTracks();
    }

    function __removeTracks() {
      const media = __mediaElement();
      if (media !== null) {
        const childNodes = media.childNodes;
        for (let index = childNodes.length - 1; index >= 0; --index) {
          if (childNodes[index] instanceof HTMLTrackElement) {
            media.removeChild(childNodes[index]);
          }
        }
      }
    }

    function __addTracks() {
      // only add tracks to video
      const media = __mediaElement();
      if (__isVideo.value && media !== null) {
        props.tracks.forEach((track) => {
          const t = document.createElement("track");
          t.kind = track.kind ? track.kind : "";
          t.label = track.label ? track.label : "";
          t.src = track.src ? track.src : "";
          t.srclang = track.srclang ? track.srclang : "";
          media.appendChild(t);
        });
        nextTick(() => {
          __toggleCaptions();
        });
      }
    }

    function __updatePoster() {
      const media = __mediaElement();
      if (media instanceof HTMLVideoElement && props.poster) {
        media.poster = props.poster;
      }
    }

    function __mouseEnterControls() {
      state.inControls = true;
    }
    function __mouseLeaveControls() {
      state.inControls = false;
    }

    // Rendering Methods

    function __renderVideo() {
      const slot = slots.oldbrowser;

      const attrs = {
        poster: props.poster ? props.poster : false,
        preload: props.preload,
        playsinline: props.playsinline === true,
        loop: props.loop === true,
        autoplay: props.autoplay === true,
        muted: props.muted === true,
        width: props.contentWidth || undefined,
        height: props.contentHeight || undefined,
      };

      nextTick(() => {
        const media = __mediaElement();
        if (media !== null && props.nativeControls === true) {
          media.controls = true;
        }
      }).catch((e) => console.error(e));

      return h(
        "video",
        {
          ref: $media,
          class: {
            ...__renderVideoClasses.value,
            ...__mergeClassOrStyle("class", props.contentClass),
          },
          style: {
            ...__contentStyle.value,
          },
          ...attrs,
        },
        hSlot(slot, h("p", lang.mediaPlayer.oldBrowserVideo)),
      );
    }

    function __renderAudio() {
      const slot = slots.oldbrowser;

      const attrs = {
        poster: props.poster ? props.poster : false,
        preload: props.preload,
        playsinline: props.playsinline === true,
        loop: props.loop === true,
        autoplay: props.autoplay === true,
        muted: props.muted === true,
        width: props.contentWidth || undefined,
        height: props.contentHeight || undefined,
      };

      nextTick(() => {
        const media = __mediaElement();
        if (media !== null && props.nativeControls === true) {
          media.controls = true;
        }
      }).catch((e) => console.error(e));

      // This is on purpose (not using audio tag).
      // The video tag can also play audio and works better if dynamically
      // switching between video and audio on the same component.
      // That being said, if audio is truly needed, use the 'no-video'
      // property to force the <audio> tag.

      return h(
        props.noVideo === true ? "audio" : "video",
        {
          ref: $media,
          class: {
            "q-media--player": true,
            ...__mergeClassOrStyle("class", props.contentClass),
          },
          style: props.contentStyle,
          ...attrs,
        },
        hSlot(slot, h("p", lang.mediaPlayer.oldBrowserAudio)),
      );
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
          "div",
          {
            class: "q-media__overlay-window fit",
          },
          slots.overlay(),
        );
      }
    }

    function errorWindowCloseButton() {
      return h(QBtn, {
        class: "q-media__error-window--button",
        onClick: () => {
          state.errorText = null;
        },
        icon: matClose,
        flat: true,
        size: "sm",
      });
    }

    function __renderErrorWindow() {
      const slot = slots.errorWindow;

      return h(
        "div",
        {
          class: "q-media__error-window",
        },
        hSlot(slot, h("span", [state.errorText, errorWindowCloseButton()])),
      );
    }

    function __renderPlayButton() {
      if (props.hidePlayBtn === true) return;

      const slot = slots.play;

      const properties = {
        icon: state.playing ? iconSet.mediaPlayer.pause : iconSet.mediaPlayer.play,
        size: "1rem",
        disable: !state.playReady,
        flat: true,
        padding: "4px",
      };

      const events = {
        onClick: togglePlay,
      };

      return (
        (slot && slot()) ||
        h(
          QBtn,
          {
            class: "q-media__controls--button play-button",
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
      );
    }

    function __renderVideoControls() {
      const slot = slots.controls;

      const events = {
        onClick: __stopAndPrevent,
        onMouseenter: __mouseEnterControls,
        onMouseleave: __mouseLeaveControls,
      };

      if (slot) {
        // we need to know the controls height for fullscreen, stop propagation to video component
        return h(
          "div",
          {
            ref: controls,
            class: {
              "q-media__controls": true,
              "q-media__controls--overlay":
                __isVideo.value === true && state.bottomControls !== true,
              ...__videoControlsClasses.value,
            },
            ...events,
          },
          slot(),
        );
      }

      return h(
        "div",
        {
          ref: controls,
          class: {
            "q-media__controls": true,
            "q-media__controls--overlay": __isVideo.value === true && state.bottomControls !== true,
            ...__videoControlsClasses.value,
          },
          ...events,
        },
        [
          // dense
          props.dense &&
            h(
              "div",
              {
                class: "q-media__controls--row row col content-start items-center",
              },
              [
                h("div", [
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
              "div",
              {
                class: "q-media__controls--row row col items-center justify-between",
              },
              [__renderDisplayTime(), __renderCurrentTimeSlider(), __renderDurationTime()],
            ),
          !props.dense &&
            h(
              "div",
              {
                class: "q-media__controls--row row col content-start items-center",
              },
              [
                h(
                  "div",
                  {
                    class: "row col",
                  },
                  [
                    h("div", [
                      __renderPlayButton(),
                      props.showTooltips &&
                        !state.playReady &&
                        h(QTooltip, () => lang.mediaPlayer.waitingVideo),
                    ]),
                    __renderVolumeButton(),
                    __renderVolumeSlider(),
                  ],
                ),
                h("div", [
                  __renderSettingsButton(),
                  $q.fullscreen !== void 0 &&
                    props.hideFullscreenBtn !== true &&
                    __renderFullscreenButton(),
                ]),
              ],
            ),
        ],
      );
    }

    function __renderAudioControls() {
      const slot = slots.controls;

      return (
        (slot && slot()) ||
        h(
          "div",
          {
            ref: controls,
            class: {
              "q-media__controls": true,
              ...__audioControlsClasses.value,
            },
          },
          [
            props.dense &&
              h(
                "div",
                {
                  class: "q-media__controls--row row col content-start items-center",
                },
                [
                  // dense
                  h("div", [
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
                "div",
                {
                  class: "q-media__controls--row row col items-center justify-between",
                },
                [__renderDisplayTime(), __renderCurrentTimeSlider(), __renderDurationTime()],
              ),
            !props.dense &&
              h(
                "div",
                {
                  class: "q-media__controls--row row col content-start items-center",
                },
                [
                  h("div", [
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
      );
    }

    function __renderVolumeButton() {
      if (props.hideVolumeBtn === true) {
        return;
      }
      const slot = slots.volume;

      const properties = {
        icon: __volumeIcon.value,
        size: "1rem",
        disable: !state.playReady,
        flat: true,
        padding: "4px",
      };

      const events = {
        onClick: toggleMuted,
      };

      return (
        (slot && slot()) ||
        h(
          QBtn,
          {
            class: "q-media__controls--button volume-button",
            style: {
              color:
                props.dark === true || $q.dark.isActive
                  ? "var(--mediaplayer-color-dark)"
                  : "var(--mediaplayer-color)",
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
      );
    }

    function __renderVolumeSlider() {
      if (props.hideVolumeSlider === true || props.hideVolumeBtn === true) {
        return;
      }
      const slot = slots.volumeSlider;

      const properties = {
        modelValue: state.volume,
        dark: props.dark,
        min: 0,
        max: 100,
        disable: !state.playReady || state.muted,
      };

      const events = {
        onChange: __volumePercentChanged,
      };

      return (
        (slot && slot()) ||
        h(QSlider, {
          class: "col",
          style: {
            width: "20%",
            margin: "0 0.5rem",
            minWidth: props.dense ? "20px" : "50px",
            maxWidth: props.dense ? "50px" : "200px",
            color:
              props.dark === true || $q.dark.isActive
                ? "var(--mediaplayer-color-dark)"
                : "var(--mediaplayer-color)",
          },
          ...properties,
          ...events,
        })
      );
    }

    function __renderSettingsButton() {
      if (props.hideSettingsBtn === true) {
        return;
      }

      const slot = slots.settings;

      const properties = {
        icon: iconSet.mediaPlayer.settings,
        size: "1rem",
        disable: !state.playReady,
        flat: true,
        padding: "4px",
      };

      return (
        (slot && slot()) ||
        h(
          QBtn,
          {
            class: "q-media__controls--button settings-button",
            ...properties,
          },
          () => [
            props.showTooltips === true && !settingsMenuVisible.value
              ? h(QTooltip, () => lang.mediaPlayer.settings)
              : undefined,
            __renderSettingsMenu(),
          ],
        )
      );
    }

    function __renderFullscreenButton() {
      const slot = slots.fullscreen;

      const properties = {
        icon: state.inFullscreen
          ? iconSet.mediaPlayer.fullscreenExit
          : iconSet.mediaPlayer.fullscreen,
        size: "1rem",
        disable: !state.playReady,
        flat: true,
        padding: "4px",
      };

      const events = {
        onClick: toggleFullscreen,
      };

      return (
        (slot && slot()) ||
        h(
          QBtn,
          {
            class: "q-media__controls--button fullscreen-button",
            ...properties,
            ...events,
          },
          () => [
            props.showTooltips === true
              ? h(QTooltip, () => lang.mediaPlayer.toggleFullscreen)
              : undefined,
          ],
        )
      );
    }

    function __renderLoader() {
      if (props.spinnerSize === void 0) {
        if (__isVideo.value) state.spinnerSize = "3em";
        else state.spinnerSize = "1.5em";
      } else {
        state.spinnerSize = props.spinnerSize;
      }

      const slot = slots.spinner;

      return (
        (slot && slot()) ||
        h(
          "div",
          {
            class: __isVideo.value ? "q-media__loading--video" : "q-media__loading--audio",
          },
          [
            h(QSpinner, {
              size: state.spinnerSize,
            }),
          ],
        )
      );
    }

    function __renderBigPlayButton() {
      const slot = slots.bigPlayButton;

      const events = {
        onClick: __bigButtonClick,
      };

      return (
        (slot && slot()) ||
        h(
          "div",
          {
            class: {
              "q-media--big-button q-media--big-button-bottom-controls":
                state.bottomControls === true,
              "q-media--big-button": state.bottomControls !== true,
            },
          },
          [
            h(QIcon, {
              name: iconSet.mediaPlayer.bigPlayButton,
              class: "q-media--big-button-icon",
              ...events,
            }),
          ],
        )
      );
    }

    function __renderCurrentTimeSlider() {
      const slot = slots.positionSlider;

      const properties = {
        modelValue: state.currentTime,
        dark: props.dark,
        min: 0,
        max: state.duration ? state.duration : 1,
        disable: !state.playReady || props.disabledSeek,
      };

      const events = {
        onChange: __videoCurrentTimeChanged,
      };

      return (
        (slot && slot()) ||
        h(QSlider, {
          class: "col",
          style: {
            margin: "0 0.5rem",
            color:
              props.dark === true || $q.dark.isActive
                ? "var(--mediaplayer-color-dark)"
                : "var(--mediaplayer-color)",
          },
          ...properties,
          ...events,
        })
      );
    }

    function __renderDisplayTime() {
      const slot = slots.displayTime;

      return (
        (slot && slot()) ||
        h(
          "span",
          {
            class: "q-media__controls--video-time-text text-left",
            style: {
              color:
                props.dark === true || $q.dark.isActive
                  ? "var(--mediaplayer-color-dark)"
                  : "var(--mediaplayer-color)",
            },
          },
          state.displayTime,
        )
      );
    }

    function __renderDurationTime() {
      const media = __mediaElement();
      if (media === null) return;

      const slot = slots.durationTime;
      const isInfinity = !isFinite(media.duration);

      return (
        (slot && slot()) ||
        h(
          "span",
          {
            class: "q-media__controls--video-time-text text-right",
            style: {
              width: isInfinity ? "30px" : "auto",
              color:
                props.dark === true || $q.dark.isActive
                  ? "var(--mediaplayer-color-dark)"
                  : "var(--mediaplayer-color)",
            },
          },
          [
            __isMediaAvailable.value === true && isInfinity !== true && state.durationTime,
            __isMediaAvailable.value === true && isInfinity === true && __renderInfinitySvg(),
          ],
        )
      );
    }

    function __renderInfinitySvg() {
      return h(
        "svg",
        {
          height: "16",
          viewbox: "0 0 16 16",
        },
        [
          h("path", {
            fill: "none",
            color:
              props.dark === true || $q.dark.isActive
                ? "var(--mediaplayer-color-dark)"
                : "var(--mediaplayer-color)",
            strokeWidth: "2",
            d: "M8,8 C16,0 16,16 8,8 C0,0 0,16 8,8z",
          }),
        ],
      );
    }

    function __renderSettingsMenu() {
      const slot = slots.settingsMenu;

      const properties = {
        anchor: "top right",
        self: "bottom right",
      };

      const events = {
        onShow: () => {
          __settingsMenuShowing(true);
        },
        onHide: () => {
          __settingsMenuShowing(false);
        },
      };

      return h(
        QMenu,
        {
          ref: menu,
          ...properties,
          ...events,
        },
        () => [
          (slot && slot()) ||
            h("div", [
              state.playbackRates.length > 0 &&
                h(
                  QExpansionItem,
                  {
                    // props
                    group: "settings-menu",
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
                                  __stopAndPrevent(e);
                                  __playbackRateChanged(rate.value);
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
                          );
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
                    group: "settings-menu",
                    expandSeparator: true,
                    icon: iconSet.mediaPlayer.language,
                    label: lang.mediaPlayer.language,
                    caption: state.trackLanguage,
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
                                  __stopAndPrevent(e);
                                  __trackLanguageChanged(language.value);
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
                          );
                        }),
                      ],
                    ),
                  ],
                ),
            ]),
        ],
      );
    }

    function __renderMediaPlayer() {
      const events = {
        onMousemove: __mouseMoveAction,
        onMouseleave: __mouseLeaveVideo,
        onClick: __videoClick,
      };

      return h(
        "div",
        {
          class: {
            "q-media--dark": props.dark === true,
            "q-media": true,
            ...__classes.value,
          },
          style: {
            borderRadius: !state.inFullscreen ? props.radius : 0,
            height: __isVideo.value ? "auto" : props.dense ? "40px" : "80px",
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
      );
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
    });

    return () => __renderMediaPlayer();
  },
});
