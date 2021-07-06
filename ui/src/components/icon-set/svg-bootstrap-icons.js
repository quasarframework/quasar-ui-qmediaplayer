import {
  biPlay,
  biPause,
  biVolumeMute,
  biVolumeDown,
  biVolumeUp,
  biGear,
  biSpeedometer,
  biGlobe2,
  biCheck,
  biArrowsFullscreen,
  biFullscreenExit
} from '@quasar/extras/bootstrap-icons'

export default {
  name: 'svg-bootstrap-icons',
  mediaPlayer: {
    play: biPlay,
    pause: biPause,
    volumeOff: biVolumeMute,
    volumeDown: biVolumeDown,
    volumeUp: biVolumeUp,
    settings: biGear,
    speed: biSpeedometer,
    language: biGlobe2,
    selected: biCheck,
    fullscreen: biArrowsFullscreen,
    fullscreenExit: biFullscreenExit,
    bigPlayButton: biPlay
  }
}
