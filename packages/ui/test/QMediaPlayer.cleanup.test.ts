// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, reactive } from 'vue'
import { Quasar } from 'quasar'

import { QMediaPlayer } from '../src'

// Node resolves Quasar's SSR build; these mounting tests need its browser build.
vi.mock('quasar', () => import('quasar/dist/quasar.client.js'))

type PlayerProps = {
  type: 'audio' | 'video'
  source?: string
  sources?: { src: string; type: string }[]
}

describe('QMediaPlayer media cleanup', () => {
  const cleanups: (() => void)[] = []
  const loads: { media: HTMLMediaElement; src: string | null; sources: string[] }[] = []

  beforeEach(() => {
    loads.length = 0
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    // A DOM emulator cannot decode media. Record the sources at each native
    // reset so these tests also catch a reset performed before source removal.
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(function (
      this: HTMLMediaElement,
    ) {
      loads.push({
        media: this,
        src: this.getAttribute('src'),
        sources: Array.from(this.querySelectorAll('source'), (source) => source.src),
      })
    })
  })

  afterEach(() => {
    cleanups.splice(0).forEach((cleanup) => cleanup())
    vi.restoreAllMocks()
  })

  async function mountPlayer(initialProps: PlayerProps) {
    const props = reactive(initialProps)
    const container = document.createElement('div')
    document.body.appendChild(container)
    const app = createApp({
      render: () => h(QMediaPlayer, { ...props, noControls: true, showSpinner: false }),
    })
    app.use(Quasar)
    let mounted = true
    const unmount = () => {
      if (mounted) {
        app.unmount()
        mounted = false
      }
    }
    cleanups.push(() => {
      unmount()
      container.remove()
    })
    app.mount(container)
    await nextTick()

    const media = container.querySelector('audio, video') as HTMLMediaElement
    expect(media).not.toBeNull()
    loads.length = 0
    return { props, media, unmount }
  }

  describe.each(['audio', 'video'] as const)('%s', (type) => {
    it.each(['', undefined])('resets the native media when source becomes %j', async (source) => {
      const { props, media } = await mountPlayer({ type, source: '/media/first.mp4' })
      expect(media.getAttribute('src')).toBe(props.source)

      props.source = source
      await nextTick()

      expect(loads).toEqual([{ media, src: null, sources: [] }])
    })

    it('removes every source before resetting an emptied source list', async () => {
      const { props, media } = await mountPlayer({
        type,
        sources: [
          { src: '/media/first.mp4', type: 'video/mp4' },
          { src: '/media/second.webm', type: 'video/webm' },
        ],
      })
      expect(media.querySelectorAll('source')).toHaveLength(2)

      props.sources = []
      await nextTick()

      expect(loads).toEqual([{ media, src: null, sources: [] }])
    })

    it('resets the native media after removing sources during unmount', async () => {
      const { media, unmount } = await mountPlayer({
        type,
        sources: [{ src: '/media/first.mp4', type: 'video/mp4' }],
      })
      expect(media.querySelectorAll('source')).toHaveLength(1)

      unmount()

      expect(media.isConnected).toBe(false)
      expect(loads).toEqual([{ media, src: null, sources: [] }])
    })

    it('loads a replacement after resetting the previous source', async () => {
      const { props, media } = await mountPlayer({ type, source: '/media/first.mp4' })

      props.source = '/media/replacement.mp4'
      await nextTick()

      expect(loads).toEqual([
        { media, src: null, sources: [] },
        { media, src: props.source, sources: [] },
      ])
    })
  })
})
