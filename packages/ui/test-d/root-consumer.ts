import { QMediaPlayer, version } from '@quasar/quasar-ui-qmediaplayer'
import type { NumberArray, StringArray } from '@quasar/quasar-ui-qmediaplayer'

const numbers: NumberArray = [1, 2, 3]
const strings: StringArray = ['audio', 'video']

QMediaPlayer.name?.toString()
version.toString()
numbers.at(0)?.toFixed(0)
strings.at(0)?.toString()
