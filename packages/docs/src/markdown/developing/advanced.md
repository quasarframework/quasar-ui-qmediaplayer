---
title: Advanced
desc: Advanced QMediaPlayer integration patterns
keys: developing
examples: QMediaPlayer
related:
  - /developing/using-qmediaplayer
  - /developing/faq
  - /getting-started/installation-types
---

QMediaPlayer owns the player controls and emits a native media element when you need deeper integration. Use the patterns on this page for adaptive streaming adapters, runtime sources, custom labels and icons, overlays, and visual overrides.

## Runtime Sources

Blob sources let you play media created or fetched at runtime. Use `loadBlob()` when you already have a `File` or `Blob`, such as data from `QFile`, a drag-and-drop flow, or a generated media object. The player creates and cleans up the object URL for you.

<MarkdownExample title="Audio Source Blob" file="AudioSourceBlob"/>

<MarkdownExample title="Video Source Blob" file="VideoSourceBlob"/>

## Adaptive Streaming

QMediaPlayer intentionally stays focused on native HTML5 media controls. For adaptive streaming formats, attach a dedicated streaming adapter to the native media element emitted by `@media-player`.

Use this pattern for HLS, MPEG-DASH, DRM adapters, or other source loaders that need direct access to the underlying `<video>` element. The examples lazy-load their adapters so those packages stay out of the default docs bundle.

::: tip
When an adapter touches browser-only globals, load it from a client-side callback or guard the code so SSR and SSG builds can render the page safely.
:::

<MarkdownExample title="Video HLS With hls.js" file="VideoHls"/>

<MarkdownExample title="Video DASH With dash.js" file="VideoDash"/>

## Localization

QMediaPlayer reads labels from Quasar's active language pack and its own media player language packs. Change the Quasar language at runtime and the player menu labels update with it.

Regional languages fall back to their base language when a matching QMediaPlayer pack exists. For example, `de-CH` can use the German media player labels.

<MarkdownExample title="Video Language" file="VideoLanguage" no-edit/>

## Icon Sets

QMediaPlayer reads media controls from the active Quasar icon set. If the icon set defines a `mediaPlayer` group, QMediaPlayer uses those icons directly. Otherwise, load one of the QMediaPlayer icon-set helpers or merge a custom `mediaPlayer` group into the active Quasar set.

<MarkdownExample title="Video Icon Set" file="VideoIconSet" no-edit/>

## Programmatic Control

Use a template ref when surrounding UI needs to control playback. Browser autoplay policies still apply, so user-triggered commands are the safest place to call `play()`.

```vue
<template>
  <q-media-player ref="player" type="video" :sources="sources" />
  <q-btn label="Jump to intro" @click="jumpToIntro" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface PlayerRef {
  play: () => void
  setCurrentTime: (seconds: number) => void
}

const player = ref<PlayerRef | null>(null)
const sources = [{ src: '/media/demo.mp4', type: 'video/mp4' }]

function jumpToIntro() {
  player.value?.setCurrentTime(30)
  player.value?.play()
}
</script>
```

## Slots And Overlays

Slots let you customize pieces of the player UI without replacing the whole component. The `overlay` slot is useful for watermarks, calls to action, consent prompts, or other video-only content.

<MarkdownExample title="Video Slot" file="VideoSlot"/>

When slot content needs to be interactive, such as a form or a custom call to action, use `:toggle-play-on-click="false"` so clicks inside the video frame do not bubble into playback toggles.

<MarkdownExample title="Video Overlay Form" file="VideoOverlayForm"/>

Dismissible overlays are useful for sponsored placements, consent prompts, upgrade calls to action, or other moments where the user needs to interact with content on top of the video. Bind `toggle-play-on-click` to the overlay state if you want normal frame-click playback behavior to return after the overlay is closed.

<MarkdownExample title="Video Overlay Ad" file="VideoOverlayAd"/>

## Media Fitting

Use `content-style` or `content-class` when the native media element needs special layout rules. Portrait video usually needs a constrained wrapper plus `object-fit: contain` so the full frame remains visible.

<MarkdownExample title="Video Portrait" file="VideoPortrait"/>

## Styling

Use props for normal color and radius changes. Use CSS variables when the project needs a reusable theme that follows your design system.

```scss
.brand-player {
  --mediaplayer-color: #f7fbff;
  --mediaplayer-background: #0b1016;
  --mediaplayer-error-color: #ffffff;
  --mediaplayer-error-background: #c62828;
  --big-play-button-color: #07111f;
  --big-play-button-background: #7dd3fc;
  --big-play-button-border: #bae6fd 1px solid;
  --big-play-button-border-hover: #f7fbff 1px solid;
  --big-play-button-hover-color: #f7fbff;
  --big-play-button-hover-background: rgba(125, 211, 252, 0.22);
}

.body--dark .brand-player {
  --mediaplayer-color-dark: #d7dde5;
  --mediaplayer-background-dark: #090b10;
  --big-play-button-background-dark: #a78bfa;
  --big-play-button-hover-background-dark: rgba(167, 139, 250, 0.24);
}
```

```vue
<q-media-player class="brand-player" type="video" :sources="sources" />
```

### CSS Variables

| Variable                             | Purpose                                          |
| ------------------------------------ | ------------------------------------------------ |
| `--mediaplayer-color`                | Text and icon color used by the player controls. |
| `--mediaplayer-background`           | Base background color used by the player.        |
| `--mediaplayer-error-color`          | Text color used by the error window.             |
| `--mediaplayer-error-background`     | Background color used by the error window.       |
| `--big-play-button-color`            | Icon color for the centered play button.         |
| `--big-play-button-background`       | Background color for the centered play button.   |
| `--big-play-button-border`           | Border for the centered play button.             |
| `--big-play-button-border-hover`     | Hover border for the centered play button.       |
| `--big-play-button-hover-color`      | Hover icon color for the centered play button.   |
| `--big-play-button-hover-background` | Hover background for the centered play button.   |

Each variable also has a dark counterpart ending in `-dark`, such as `--mediaplayer-color-dark` and `--big-play-button-background-dark`.
