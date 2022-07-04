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
} from '@quasar/extras/ionicons-v6'

export default {
  name: 'svg-ionicons-v6',
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
