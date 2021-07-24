import { boot } from 'quasar/wrappers'
import VuePlugin from '@quasar/quasar-ui-qmediaplayer'

export default boot(({ app }) => {
  app.use(VuePlugin)
})
