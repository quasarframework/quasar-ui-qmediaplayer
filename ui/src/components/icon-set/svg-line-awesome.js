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
  laCompressSolid
} from '@quasar/extras/line-awesome'

export default {
  name: 'svg-line-awesome',
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
    bigPlayButton: laPlaySolid
  }
}
