import {
  matPlayArrow,
  matPause,
  matVolumeOff,
  matVolumeDown,
  matVolumeUp,
  matSettings,
  matDirectionsRun,
  matClosedCaption,
  matCheck,
  matFullscreen,
  matFullscreenExit
} from '@quasar/extras/material-icons'

export default {
  name: 'material-icons',
  mediaPlayer: {
    play: matPlayArrow,
    pause: matPause,
    volumeOff: matVolumeOff,
    volumeDown: matVolumeDown,
    volumeUp: matVolumeUp,
    settings: matSettings,
    speed: matDirectionsRun,
    language: matClosedCaption,
    selected: matCheck,
    fullscreen: matFullscreen,
    fullscreenExit: matFullscreenExit,
    bigPlayButton: matPlayArrow
  }
}
