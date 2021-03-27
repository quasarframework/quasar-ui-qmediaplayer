import {
  biPlayCircle,
  biPauseCircle,
  biVolumeMute,
  biVolumeDown,
  biVolumeUp,
  biGear,
  biSpeedometer,
  biBadgeCc,
  biCheck,
  biFullscreen,
  biFullscreenExit,
  biCaretRight
} from '@quasar/extras/bootstrap-icons'

export default {
  name: 'svg-bootstrap-icons',
  mediaPlayer: {
    play: biPlayCircle,
    pause: biPauseCircle,
    volumeOff: biVolumeMute,
    volumeDown: biVolumeDown,
    volumeUp: biVolumeUp,
    settings: biGear,
    speed: biSpeedometer,
    language: biBadgeCc,
    selected: biCheck,
    fullscreen: biFullscreen,
    fullscreenExit: biFullscreenExit,
    bigPlayButton: biCaretRight
  }
}
