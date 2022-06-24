import {
  ionMdPlay,
  ionMdPause,
  ionMdVolumeOff,
  ionMdVolumeLow,
  ionMdVolumeHigh,
  ionMdSettings,
  ionMdFlash,
  ionLogoClosedCaptioning,
  ionMdCheckmark,
  ionMdExpand,
  ionMdContract
} from '@quasar/extras/ionicons-v4/index.mjs'

export default {
  name: 'svg-ionicons-v4',
  mediaPlayer: {
    play: ionMdPlay,
    pause: ionMdPause,
    volumeOff: ionMdVolumeOff,
    volumeDown: ionMdVolumeLow,
    volumeUp: ionMdVolumeHigh,
    settings: ionMdSettings,
    speed: ionMdFlash,
    language: ionLogoClosedCaptioning,
    selected: ionMdCheckmark,
    fullscreen: ionMdExpand,
    fullscreenExit: ionMdContract,
    bigPlayButton: ionMdPlay
  }
}
