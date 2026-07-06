<template>
  <div class="q-pa-md q-gutter-md">
    <q-banner rounded class="bg-blue-grey-1 text-blue-grey-10">
      HLS streams need either native browser HLS support or a JavaScript adapter such as
      <code>hls.js</code>. QMediaPlayer supplies the controls; the adapter owns stream loading.
    </q-banner>

    <q-media-player
      type="video"
      cross-origin="anonymous"
      @media-player="attachHls"
      @error="onMediaError"
    />

    <div class="text-caption text-grey-7">
      {{ status }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/dist/index.css'

defineOptions({ name: 'VideoHls' })

interface HlsErrorData {
  fatal?: boolean
  type?: string
}

interface HlsInstance {
  attachMedia: (media: HTMLMediaElement) => void
  destroy: () => void
  loadSource: (source: string) => void
  on: (event: string, callback: (event: string, data: HlsErrorData) => void) => void
}

interface HlsConstructor {
  new (): HlsInstance
  Events: {
    ERROR: string
    MANIFEST_PARSED: string
  }
  isSupported: () => boolean
}

type HlsWindow = Window & {
  Hls?: HlsConstructor
}

const hlsSource = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
const hlsScriptUrl = 'https://cdn.jsdelivr.net/npm/hls.js@1.6.16/dist/hls.min.js'
const status = ref('Waiting for the media element...')

let hls: HlsInstance | null = null
let activeMedia: HTMLMediaElement | null = null
let disposed = false
let hlsLoader: Promise<HlsConstructor> | null = null

function getHlsWindow() {
  return typeof window === 'undefined' ? undefined : (window as HlsWindow)
}

function getHlsDocument() {
  return typeof document === 'undefined' ? undefined : document
}

async function attachHls(media: HTMLMediaElement | null) {
  activeMedia = media
  resetHls()

  if (media === null) {
    status.value = 'Waiting for the media element...'
    return
  }

  status.value = 'Preparing HLS stream...'

  let Hls: HlsConstructor

  try {
    Hls = await loadHlsJs()
  } catch (err) {
    if (disposed === false && activeMedia === media) {
      if (useNativeHls(media) === true) {
        return
      }

      status.value = err instanceof Error ? err.message : 'Unable to load the HLS adapter.'
    }

    return
  }

  if (disposed === true || activeMedia !== media) {
    return
  }

  if (Hls.isSupported() !== true) {
    if (useNativeHls(media) === true) {
      return
    }

    status.value = 'HLS is not supported by this browser.'
    return
  }

  hls = new Hls()
  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    status.value = 'HLS stream is ready. Use the player controls to start playback.'
  })
  hls.on(Hls.Events.ERROR, (_event, data) => {
    if (data.fatal === true) {
      status.value = `HLS error: ${data.type}`
    }
  })
  hls.loadSource(hlsSource)
  hls.attachMedia(media)
}

function useNativeHls(media: HTMLMediaElement) {
  if (media.canPlayType('application/vnd.apple.mpegurl') === '') {
    return false
  }

  media.src = hlsSource
  media.load()
  status.value = 'Using native browser HLS support.'

  return true
}

function onMediaError(error: MediaError | null) {
  status.value = error?.message
    ? `Media error: ${error.message}`
    : 'The media stream failed to load.'
}

function loadHlsJs() {
  const hlsWindow = getHlsWindow()

  if (hlsWindow === undefined) {
    return Promise.reject(new Error('HLS playback is only available in the browser.'))
  }

  if (hlsWindow.Hls !== void 0) {
    return Promise.resolve(hlsWindow.Hls)
  }

  if (hlsLoader !== null) {
    return hlsLoader
  }

  hlsLoader = new Promise<HlsConstructor>((resolve, reject) => {
    const hlsDocument = getHlsDocument()

    if (hlsDocument === undefined) {
      reject(new Error('HLS playback is only available in the browser.'))
      return
    }

    const script = hlsDocument.createElement('script')

    script.src = hlsScriptUrl
    script.async = true
    script.dataset.qmediaplayerHlsjs = ''
    script.onload = () => {
      const loadedHls = getHlsWindow()?.Hls

      if (loadedHls === void 0) {
        reject(new Error('hls.js loaded, but did not expose an HLS adapter.'))
        return
      }

      resolve(loadedHls)
    }
    script.onerror = () => {
      reject(new Error('Unable to load the HLS adapter.'))
    }

    hlsDocument.head.append(script)
  })

  return hlsLoader
}

function resetHls() {
  hls?.destroy()
  hls = null
}

onBeforeUnmount(() => {
  disposed = true
  resetHls()
})
</script>
