// import something here
import VuePlugin from 'ui' // "ui" is aliased in quasar.conf.js
import '@quasar/quasar-ui-qmediaplayer/src/index.sass'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default ({ app }) => {
  app.use(VuePlugin)
}
