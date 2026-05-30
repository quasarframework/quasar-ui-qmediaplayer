---
title: FAQ
desc: Common QMediaPlayer development questions
keys: developing
related:
  - /developing/using-qmediaplayer
  - /getting-started/installation-types
---

This page collects common QMediaPlayer development questions. It is meant to help you choose the right media setup, avoid native media gotchas, and understand where QMediaPlayer fits in a Quasar app.

## Installation and setup

:::details Q. Should I install the App Extension or the UI package directly?

For Quasar CLI Vite apps, use the App Extension when possible:

```bash
quasar ext add @quasar/qmediaplayer
```

While QMediaPlayer v3 is in beta, use:

```bash
quasar ext add @quasar/qmediaplayer@beta
```

The App Extension registers QMediaPlayer for the app and imports the component styles. Install the UI package directly only when you want to register the component manually, use it outside the App Extension flow, or build a custom integration.

:::

:::details Q. Does QMediaPlayer v3 support webpack-based Quasar apps?

No. QMediaPlayer v3 targets Quasar CLI Vite 3 and `@quasar/app-vite` v3 beta. If your app still uses `@quasar/app-webpack`, migrate the app to Quasar CLI Vite before installing QMediaPlayer v3.

:::

:::details Q. Do I need to import QMediaPlayer CSS myself?

The App Extension adds the stylesheet for you.

If you install the UI package directly, import the stylesheet in your boot file or app entry:

```ts
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";
```

:::

:::details Q. Can I inspect the component API from the CLI?

Yes. After the App Extension is installed, run:

```bash
quasar describe QMediaPlayer
```

The same generated API is shown on the [Using QMediaPlayer](/developing/using-qmediaplayer) page.

:::

## Sources and playback

:::details Q. Should I use `source` or `sources`?

Use `source` when you have exactly one media URL:

```html
<q-media-player type="video" source="/media/demo.mp4" />
```

Use `sources` when you want the browser to choose between multiple formats:

```html
<q-media-player
  type="video"
  :sources="[
    { src: '/media/demo.webm', type: 'video/webm' },
    { src: '/media/demo.mp4', type: 'video/mp4' },
  ]"
/>
```

If `source` is set, it is applied directly to the media element and the `sources` array is ignored.

:::

:::details Q. Why is my media not playing automatically?

Browsers heavily restrict autoplay, especially when audio is enabled. If you use `autoplay`, also use `muted` for the most reliable behavior:

```html
<q-media-player type="video" source="/media/demo.mp4" autoplay muted />
```

For anything that must play with sound, wait for the `ready` event and trigger playback from a user action such as a click or tap.

:::

:::details Q. Can QMediaPlayer play audio?

Yes. Set `type="audio"` and provide an audio source.

By default, QMediaPlayer may still use a `video` element for audio playback because it works better when dynamically switching between audio and video in the same component. If you need a real `audio` element, use `no-video`:

```html
<q-media-player type="audio" source="/media/song.mp3" no-video />
```

:::

:::details Q. Can QMediaPlayer play YouTube, Vimeo, RTSP, RTMP, or DRM streams?

No. QMediaPlayer wraps native HTML5 media playback. It is not a YouTube/Vimeo embed wrapper, DRM platform integration, or low-latency streaming player for protocols like RTSP, RTMP, RTP, or HDS.

If the browser can play the source through an HTML5 media element, QMediaPlayer can usually provide the UI around it.

:::

## Controls and layout

:::details Q. When should I use `native-controls`?

Use `native-controls` when you need the browser's built-in controls for platform behavior, accessibility testing, or debugging a media playback issue.

For a cohesive Quasar UI, leave `native-controls` off and use QMediaPlayer's controls.

:::

:::details Q. What does `mobile-mode` do?

`mobile-mode` disables hover-driven control visibility. Instead, the user taps or clicks the video area to show and hide controls. This is useful on touch devices and on layouts where hover behavior feels too busy.

```html
<q-media-player type="video" source="/media/demo.mp4" mobile-mode />
```

:::

:::details Q. How do I keep controls from covering the video?

Use `bottom-controls`. This moves controls below the video area instead of overlaying them.

```html
<q-media-player type="video" source="/media/demo.mp4" bottom-controls />
```

This is a good fit when captions, important visual content, or custom overlays need the full video surface.

:::

:::details Q. How do I create a compact player?

Use `dense` for smaller controls. You can combine it with `bottom-controls`, hidden volume controls, or custom styles for tight card and sidebar layouts.

```html
<q-media-player type="audio" source="/media/song.mp3" dense hide-volume-slider />
```

:::

## Captions, language, and icons

:::details Q. How do subtitles and captions work?

Use the `tracks` prop with WebVTT files. Each track should include `src`, `kind`, `srclang`, and `label`.

```html
<q-media-player
  type="video"
  source="/media/demo.mp4"
  :tracks="[
    { src: '/media/demo-en.vtt', kind: 'subtitles', srclang: 'en', label: 'English' },
    { src: '/media/demo-fr.vtt', kind: 'subtitles', srclang: 'fr', label: 'French' },
  ]"
/>
```

Use `track-language` when you want a default track selected by label:

```html
<q-media-player type="video" source="/media/demo.mp4" :tracks="tracks" track-language="French" />
```

:::

:::details Q. Why are my captions not showing?

Check that the track file is valid WebVTT, that the server returns it with a usable MIME type, and that the track `label` matches `track-language` exactly when selecting a default language.

For remote media and remote tracks, CORS can also matter. If needed, set `cross-origin="anonymous"` and make sure the media server allows it.

:::

:::details Q. How does QMediaPlayer choose labels and icons?

QMediaPlayer follows the active Quasar language and icon set. When the Quasar language or icon set changes, QMediaPlayer updates its player labels and icons as well.

If a language or icon set is missing, open an issue or PR so it can be added.

:::

:::details Q. Can I replace controls with my own UI?

Yes. QMediaPlayer exposes slots for common control areas, including `controls`, `play`, `volume`, `volumeSlider`, `settings`, `settingsMenu`, `fullscreen`, `displayTime`, `durationTime`, `positionSlider`, `spinner`, `bigPlayButton`, `overlay`, and `errorWindow`.

Use slots when you need a branded experience but still want QMediaPlayer to manage the media element, timing, playback state, and events.

:::

## Troubleshooting

:::details Q. Why does fullscreen not work on some devices?

Fullscreen behavior is controlled by the browser and operating system. Some mobile browsers, especially iOS Safari, restrict or reshape fullscreen behavior for HTML5 video.

If fullscreen is unavailable or undesirable for your target device, hide the fullscreen button:

```html
<q-media-player type="video" source="/media/demo.mp4" hide-fullscreen-btn />
```

:::

:::details Q. Why does a remote example fail to load?

Remote media can fail because of network availability, CORS, codec support, or server MIME types. Try the same URL directly in the browser first, then test with a local file or a known-good MP4/MP3 source.

The documentation examples use remote media, so they can occasionally load slowly or fail depending on network location.

:::

:::details Q. How do I report bugs or ask questions?

Use [GitHub Issues](https://github.com/quasarframework/quasar-ui-qmediaplayer/issues) for bugs and feature requests. Use [GitHub Discussions](https://github.com/quasarframework/quasar-ui-qmediaplayer/discussions) for broader questions, RFCs, or implementation discussion.
:::
