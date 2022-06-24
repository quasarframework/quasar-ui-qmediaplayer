import {
  laPlaySolid,
  laPauseSolid,
  laVolumeMuteSolid,
  laVolumeDownSolid,
  laVolumeUpSolid,
  laCogSolid,
  laRunningSolid,
  laClosedCaptioning,
  laCheckSolid,
  laExpandSolid,
  laCompressSolid,
  laCaretRightSolid
} from '@quasar/extras/line-awesome/index.mjs'

export default {
  name: 'line-awesome',
  mediaPlayer: {
    play: laPlaySolid,
    pause: laPauseSolid,
    volumeOff: laVolumeMuteSolid,
    volumeDown: laVolumeDownSolid,
    volumeUp: laVolumeUpSolid,
    settings: laCogSolid,
    speed: laRunningSolid,
    language: laClosedCaptioning,
    selected: laCheckSolid,
    fullscreen: laExpandSolid,
    fullscreenExit: laCompressSolid,
    bigPlayButton: laCaretRightSolid
  }
}
