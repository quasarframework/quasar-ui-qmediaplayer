import {
  mdiPlay,
  mdiPause,
  mdiVolumeOff,
  mdiVolumeMedium,
  mdiVolumeHigh,
  mdiCog,
  mdiRun,
  mdiClosedCaption,
  mdiCheck,
  mdiFullscreen,
  mdiFullscreenExit
} from '@quasar/extras/mdi-v6'

export default {
  name: 'svg-mdi-v6',
  mediaPlayer: {
    play: mdiPlay,
    pause: mdiPause,
    volumeOff: mdiVolumeOff,
    volumeDown: mdiVolumeMedium,
    volumeUp: mdiVolumeHigh,
    settings: mdiCog,
    speed: mdiRun,
    language: mdiClosedCaption,
    selected: mdiCheck,
    fullscreen: mdiFullscreen,
    fullscreenExit: mdiFullscreenExit,
    bigPlayButton: mdiPlay
  }
}
