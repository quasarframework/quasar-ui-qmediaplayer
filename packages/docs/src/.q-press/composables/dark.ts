import { useQuasar } from 'quasar'
import { useMarkdownStore } from '../stores/markdown'
import { computed, watch } from 'vue'

export function useDark() {
  const $q = useQuasar()
  const markdownStore = useMarkdownStore()

  const isDark = computed(() => markdownStore.dark)

  function initDark() {
    markdownStore.dark = $q.cookies.get('theme') !== 'light'
    $q.dark.set(markdownStore.dark)
  }

  function toggleDark() {
    $q.dark.toggle()
    markdownStore.dark = $q.dark.isActive

    $q.cookies.set('theme', markdownStore.dark ? 'dark' : 'light', {
      path: '/',
      sameSite: 'Strict',
      expires: 400,
    })
  }

  watch(
    () => markdownStore.dark,
    (val) => {
      $q.dark.set(val)
    },
  )

  return {
    isDark,
    initDark,
    toggleDark,
  }
}
