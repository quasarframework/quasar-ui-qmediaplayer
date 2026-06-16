import { defineBoot } from '#q-app'
import VuePlugin from '@quasar/quasar-ui-qmediaplayer'

export default defineBoot(({ app }) => {
  app.use(VuePlugin)
})
