import VuePlugin from '@quasar/quasar-ui-qmediaplayer'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({ app }) => {
  app.use(VuePlugin)
}
