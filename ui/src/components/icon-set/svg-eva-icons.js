import {
  evaPlayCircleOutline,
  evaPauseCircleOutline,
  evaVolumeOffOutline,
  evaVolumeDownOutline,
  evaVolumeUpOutline,
  evaSettingsOutline,
  evaFlashOutline,
  evaGlobeOutline,
  evaCheckmarkOutline,
  evaExpandOutline,
  evaCollapseOutline,
  evaArrowRightOutline
} from '@quasar/extras/eva-icons'

export default {
  name: 'svg-eva-icons',
  mediaPlayer: {
    play: evaPlayCircleOutline,
    pause: evaPauseCircleOutline,
    volumeOff: evaVolumeOffOutline,
    volumeDown: evaVolumeDownOutline,
    volumeUp: evaVolumeUpOutline,
    settings: evaSettingsOutline,
    speed: evaFlashOutline,
    language: evaGlobeOutline,
    selected: evaCheckmarkOutline,
    fullscreen: evaExpandOutline,
    fullscreenExit: evaCollapseOutline,
    bigPlayButton: evaArrowRightOutline
  }
}
