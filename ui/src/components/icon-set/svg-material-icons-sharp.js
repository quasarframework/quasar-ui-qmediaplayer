import {
  sharpPlayArrow,
  sharpPause,
  sharpVolumeMute,
  sharpVolumeDown,
  sharpVolumeUp,
  sharpSettings,
  sharpDirectionsRun,
  sharpClosedCaption,
  sharpCheck,
  sharpFullscreen,
  sharpFullscreenExit
} from '@quasar/extras/material-icons-sharp'

export default {
  name: 'svg-material-icons-sharp',
  mediaPlayer: {
    play: sharpPlayArrow,
    pause: sharpPause,
    volumeOff: sharpVolumeMute,
    volumeDown: sharpVolumeDown,
    volumeUp: sharpVolumeUp,
    settings: sharpSettings,
    speed: sharpDirectionsRun,
    language: sharpClosedCaption,
    selected: sharpCheck,
    fullscreen: sharpFullscreen,
    fullscreenExit: sharpFullscreenExit,
    bigPlayButton: sharpPlayArrow
  }
}
