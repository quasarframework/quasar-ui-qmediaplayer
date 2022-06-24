import {
  mdiPlay,
  mdiPause,
  mdiVolumeOff,
  mdiVolumeMedium,
  mdiVolumeHigh,
  mdiSettings,
  mdiRun,
  mdiClosedCaption,
  mdiCheck,
  mdiFullscreen,
  mdiFullscreenExit
} from '@quasar/extras/mdi-v4/index.mjs'

export default {
  name: 'svg-mdi-v4',
  mediaPlayer: {
    play: mdiPlay,
    pause: mdiPause,
    volumeOff: mdiVolumeOff,
    volumeDown: mdiVolumeMedium,
    volumeUp: mdiVolumeHigh,
    settings: mdiSettings,
    speed: mdiRun,
    language: mdiClosedCaption,
    selected: mdiCheck,
    fullscreen: mdiFullscreen,
    fullscreenExit: mdiFullscreenExit,
    bigPlayButton: mdiPlay
  }
}
