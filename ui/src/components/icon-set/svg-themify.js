import {
  tiControlPlay,
  tiControlPause,
  tiNa,
  tiVolume,
  tiSettings,
  tiDashboard,
  tiLayoutMediaOverlay,
  tiCheck,
  tiFullscreen,
  tiClose
} from '@quasar/extras/themify/index.js'

export default {
  name: 'svg-themify',
  mediaPlayer: {
    play: tiControlPlay,
    pause: tiControlPause,
    volumeOff: tiNa,
    volumeDown: tiVolume,
    volumeUp: tiVolume,
    settings: tiSettings,
    speed: tiDashboard,
    language: tiLayoutMediaOverlay,
    selected: tiCheck,
    fullscreen: tiFullscreen,
    fullscreenExit: tiClose,
    bigPlayButton: tiControlPlay
  }
}
