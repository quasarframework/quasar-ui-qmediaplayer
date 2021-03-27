import {
  roundPlayArrow,
  roundPause,
  roundVolumeMute,
  roundVolumeDown,
  roundVolumeUp,
  roundSettings,
  roundDirectionsRun,
  roundClosedCaption,
  roundCheck,
  roundFullscreen,
  roundFullscreenExit
} from '@quasar/extras/material-icons-round'

export default {
  name: 'svg-material-icons-round',
  mediaPlayer: {
    play: roundPlayArrow,
    pause: roundPause,
    volumeOff: roundVolumeMute,
    volumeDown: roundVolumeDown,
    volumeUp: roundVolumeUp,
    settings: roundSettings,
    speed: roundDirectionsRun,
    language: roundClosedCaption,
    selected: roundCheck,
    fullscreen: roundFullscreen,
    fullscreenExit: roundFullscreenExit,
    bigPlayButton: roundPlayArrow
  }
}
