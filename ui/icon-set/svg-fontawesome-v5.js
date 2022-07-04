const {
  fasPlay,
  fasPause,
  fasVolumeMute,
  fasVolumeDown,
  fasVolumeUp,
  fasCog,
  fasRunning,
  fasClosedCaptioning,
  fasCheck,
  fasExpand,
  fasCompress
} = require('@quasar/extras/fontawesome-v5')

module.exports = {
  name: 'svg-fontawesome-v5',
  mediaPlayer: {
    play: fasPlay,
    pause: fasPause,
    volumeOff: fasVolumeMute,
    volumeDown: fasVolumeDown,
    volumeUp: fasVolumeUp,
    settings: fasCog,
    speed: fasRunning,
    language: fasClosedCaptioning,
    selected: fasCheck,
    fullscreen: fasExpand,
    fullscreenExit: fasCompress,
    bigPlayButton: fasPlay
  }
}
