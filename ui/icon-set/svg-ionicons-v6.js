const {
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
} = require('@quasar/extras/ionicons-v6')

module.exports = {
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
