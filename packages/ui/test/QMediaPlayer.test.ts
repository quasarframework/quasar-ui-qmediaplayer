import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'

import { QMediaPlayer, version } from '../src'
import api from '../src/components/QMediaPlayer.json'

describe('QMediaPlayer', () => {
  it('exports the component and package version', () => {
    expect(QMediaPlayer.name).toBe('QMediaPlayer')
    expect(version).toMatch(/^\d+\.\d+\.\d+/)
  })

  it('keeps key public props aligned with API metadata', () => {
    expect(QMediaPlayer.props).toHaveProperty('type')
    expect(QMediaPlayer.props).toHaveProperty('source')
    expect(QMediaPlayer.props).toHaveProperty('sources')
    expect(QMediaPlayer.props).toHaveProperty('tracks')
    expect(QMediaPlayer.props).toHaveProperty('autoPause')
    expect(QMediaPlayer.props).toHaveProperty('togglePlayOnClick')
    expect(QMediaPlayer.props).toHaveProperty('playbackRate')
  })

  it('documents blob loading helpers', () => {
    expect(api.methods).toHaveProperty('loadBlob')
    expect(api.methods).toHaveProperty('loadFileBlob')
  })

  it('emits every documented public event', () => {
    const emittedEvents = new Set(QMediaPlayer.emits)

    Object.keys(api.events).forEach((eventName) => {
      expect(emittedEvents.has(eventName)).toBe(true)
    })
  })

  it('renders an SSR-safe placeholder before client mount', async () => {
    const app = createSSRApp({
      render: () =>
        h(QMediaPlayer, {
          type: 'video',
          source: '/media/demo.mp4',
          poster: '/media/poster.jpg',
        }),
    })

    app.provide('_q_', {
      dark: { isActive: false },
      fullscreen: { isActive: false },
      iconSet: { name: 'material-icons' },
      lang: { isoName: 'en-US' },
    })

    const html = await renderToString(app)

    expect(html).toContain('q-media')
    expect(html).not.toContain('<video')
    expect(html).not.toContain('<audio')
  })
})
