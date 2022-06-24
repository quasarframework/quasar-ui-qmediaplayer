import {
  ionPlay,
  ionPause,
  ionVolumeOff,
  ionVolumeLow,
  ionVolumeHigh,
  ionSettings,
  ionFlash,
  ionLogoClosedCaptioning,
  ionCheckmark,
  ionExpand,
  ionContract
} from '@quasar/extras/ionicons-v5/index.mjs'

export default {
  name: 'svg-ionicons-v5',
  mediaPlayer: {
    play: ionPlay,
    pause: ionPause,
    volumeOff: ionVolumeOff,
    volumeDown: ionVolumeLow,
    volumeUp: ionVolumeHigh,
    settings: ionSettings,
    speed: ionFlash,
    language: ionLogoClosedCaptioning,
    selected: ionCheckmark,
    fullscreen: ionExpand,
    fullscreenExit: ionContract,
    bigPlayButton: ionPlay
  }
}
