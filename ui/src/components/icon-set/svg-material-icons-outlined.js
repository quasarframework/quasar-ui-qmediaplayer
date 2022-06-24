import {
  outlinedPlayArrow,
  outlinedPause,
  outlinedVolumeMute,
  outlinedVolumeDown,
  outlinedVolumeUp,
  outlinedSettings,
  outlinedDirectionsRun,
  outlinedClosedCaption,
  outlinedCheck,
  outlinedFullscreen,
  outlinedFullscreenExit
} from '@quasar/extras/material-icons-outlined/index.mjs'

export default {
  name: 'svg-material-icons-outlined',
  mediaPlayer: {
    play: outlinedPlayArrow,
    pause: outlinedPause,
    volumeOff: outlinedVolumeMute,
    volumeDown: outlinedVolumeDown,
    volumeUp: outlinedVolumeUp,
    settings: outlinedSettings,
    speed: outlinedDirectionsRun,
    language: outlinedClosedCaption,
    selected: outlinedCheck,
    fullscreen: outlinedFullscreen,
    fullscreenExit: outlinedFullscreenExit,
    bigPlayButton: outlinedPlayArrow
  }
}
